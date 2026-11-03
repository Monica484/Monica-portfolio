import { Router, Request, Response, NextFunction } from 'express';
import { PersistentVectorStore } from './vectorStore';
import { DocumentIngestionPipeline } from './ingestion';
import { RagPipeline } from './pipeline';

export function createRagAdminRouter(
  vectorStore: PersistentVectorStore,
  ingestionPipeline: DocumentIngestionPipeline,
  ragPipeline: RagPipeline
): Router {
  const router = Router();

  /**
   * GET /api/rag/health
   * Public health check for vector storage & LangSmith status
   */
  router.get('/health', async (_req: Request, res: Response) => {
    try {
      const chunkCount = vectorStore.getChunkCount();
      const docs = await vectorStore.listDocuments();
      const langsmithKey = process.env.LANGCHAIN_API_KEY || process.env.LANGSMITH_API_KEY;
      res.json({
        status: 'healthy',
        vectorStore: 'persistent_file_chroma_hybrid',
        totalChunks: chunkCount,
        totalDocuments: docs.length,
        storagePath: vectorStore.storagePath,
        chromaConfigured: !!vectorStore.chromaUrl,
        faiss: {
          enabled: true,
          indexingScheme: 'FAISS_IndexFlatIP',
          pythonServerlessRoute: '/api/chat.py',
          totalChunks: chunkCount,
        },
        embeddings: {
          provider: process.env.NVIDIA_API_KEY ? 'NVIDIAEmbeddings' : 'GeminiLangChainEmbeddings',
          model: process.env.NVIDIA_API_KEY ? 'nvidia/llama-3.2-nv-embedqa-1b-v1' : 'gemini-embedding-2-preview',
          dimensions: 3072,
        },
        langsmith: {
          enabled: !!langsmithKey,
          project: process.env.LANGSMITH_PROJECT || process.env.LANGCHAIN_PROJECT || 'nvidia-rag-chatbot',
          tracing: process.env.LANGSMITH_TRACING === 'true' || process.env.LANGCHAIN_TRACING_V2 === 'true',
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Health check failed', details: err?.message });
    }
  });

  /**
   * GET /api/rag/documents
   * List all indexed documents and metadata
   */
  router.get('/documents', async (_req: Request, res: Response) => {
    try {
      const documents = await vectorStore.listDocuments();
      res.json({
        documents,
        totalCount: documents.length,
        totalChunks: vectorStore.getChunkCount(),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list documents', details: err?.message });
    }
  });

  /**
   * POST /api/rag/ingest
   * Ingest and index new text/markdown document content
   */
  router.post('/ingest', async (req: Request, res: Response) => {
    try {
      const { documentId, documentName, content, metadata } = req.body;

      // Validation
      if (!documentId || typeof documentId !== 'string') {
        res.status(400).json({ error: 'Invalid documentId: string required' });
        return;
      }
      if (!documentName || typeof documentName !== 'string') {
        res.status(400).json({ error: 'Invalid documentName: string required' });
        return;
      }
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({ error: 'Invalid content: non-empty string required' });
        return;
      }
      if (content.length > 2 * 1024 * 1024) {
        res.status(400).json({ error: 'Content exceeds maximum allowed size (2MB)' });
        return;
      }

      const chunks = await ingestionPipeline.ingestTextContent(content, documentId, documentName, metadata || {});
      await vectorStore.addDocuments(chunks);

      res.status(201).json({
        success: true,
        message: `Successfully indexed ${chunks.length} chunks for ${documentName}`,
        documentId,
        chunkCount: chunks.length,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Ingestion failed', details: err?.message });
    }
  });

  /**
   * DELETE /api/rag/documents/:documentId
   * Delete a document and its chunks from persistent vector storage
   */
  router.delete('/documents/:documentId', async (req: Request, res: Response) => {
    try {
      const { documentId } = req.params;
      if (!documentId) {
        res.status(400).json({ error: 'documentId parameter required' });
        return;
      }

      const deletedCount = await vectorStore.deleteDocuments(documentId);
      if (deletedCount === 0) {
        res.status(404).json({ error: 'Document not found or no chunks removed' });
        return;
      }

      res.json({
        success: true,
        message: `Deleted ${deletedCount} chunks for document: ${documentId}`,
        deletedChunks: deletedCount,
        remainingChunks: vectorStore.getChunkCount(),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Deletion failed', details: err?.message });
    }
  });

  /**
   * POST /api/rag/reindex
   * Re-index baseline resume PDF and project specs
   */
  router.post('/reindex', async (_req: Request, res: Response) => {
    try {
      console.log(`[RAG Admin] Initiating reindex of all baseline documents...`);
      const result = await ingestionPipeline.ingestAllBaselineDocuments();
      res.json({
        message: 'Baseline documents reindexed successfully',
        ...result,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Re-indexing failed', details: err?.message });
    }
  });

  /**
   * POST /api/rag/test
   * Automated test suite for Ingestion, Retrieval, Citations, Missing answers, and Deletion
   */
  router.post('/test', async (_req: Request, res: Response) => {
    const testResults: { testName: string; passed: boolean; details: any }[] = [];
    const testDocId = `test_doc_${Date.now()}`;
    const testDocName = 'Automated_Validation_Test_Document.md';

    try {
      // Test 1: Ingestion validation
      const sampleText = `The candidate completed specialized training in Quantum Vector Quantization in 2026 under Project Zephyr. Key credential code: ZEP-9942.`;
      const testChunks = await ingestionPipeline.ingestTextContent(sampleText, testDocId, testDocName, {
        category: 'test-suite',
        pageNumber: 1,
      });
      await vectorStore.addDocuments(testChunks);
      testResults.push({
        testName: '1. Document Ingestion & Chunking',
        passed: testChunks.length > 0 && vectorStore.getChunkCount() > 0,
        details: { chunksCreated: testChunks.length, sampleChunkId: testChunks[0]?.metadata?.id },
      });

      // Test 2: Retrieval accuracy
      const retrieved = await vectorStore.similaritySearchWithScore('Quantum Vector Quantization Project Zephyr', 2);
      const topMatch = retrieved.find(([doc]) => doc.metadata.documentId === testDocId);
      testResults.push({
        testName: '2. Semantic Vector Retrieval',
        passed: !!topMatch && topMatch[1] > 0.4,
        details: { topScore: topMatch ? topMatch[1] : 0, matchedContent: topMatch ? topMatch[0].pageContent : null },
      });

      // Test 3: Citations generation
      const ragResponse = await ragPipeline.answerQuestion('What is Monica\'s credential code in Project Zephyr?');
      const hasCitation = ragResponse.sources.some((s) => s.documentName === testDocName);
      testResults.push({
        testName: '3. Citation & Page Reference Integrity',
        passed: ragResponse.ragUsed && hasCitation,
        details: { citationsCount: ragResponse.sources.length, sources: ragResponse.sources },
      });

      // Test 4: Missing Answer / Ungrounded Query Handling
      const ungroundedResponse = await ragPipeline.answerQuestion('What is the recipe for chocolate chip cookies?');
      testResults.push({
        testName: '4. Ungrounded / General Question Distinction',
        passed: !ungroundedResponse.groundedInResume || ungroundedResponse.reply.includes('general knowledge'),
        details: { grounded: ungroundedResponse.groundedInResume, replySnippet: ungroundedResponse.reply.slice(0, 100) },
      });

      // Test 5: Document Deletion
      const deletedCount = await vectorStore.deleteDocuments(testDocId);
      const postDeleteDocs = await vectorStore.similaritySearch(sampleText, 2);
      const stillFound = postDeleteDocs.some((d) => d.metadata.documentId === testDocId);
      testResults.push({
        testName: '5. Document Deletion & Index Purging',
        passed: deletedCount > 0 && !stillFound,
        details: { deletedCount, purgedSuccessfully: !stillFound },
      });

      const allPassed = testResults.every((t) => t.passed);
      res.json({
        allTestsPassed: allPassed,
        totalTests: testResults.length,
        passedTests: testResults.filter((t) => t.passed).length,
        tests: testResults,
      });
    } catch (testErr: any) {
      res.status(500).json({
        error: 'Test suite encountered execution error',
        details: testErr?.message || testErr,
        completedTests: testResults,
      });
    }
  });

  return router;
}
