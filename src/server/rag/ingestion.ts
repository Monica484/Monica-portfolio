import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';
import { PersistentVectorStore } from './vectorStore';

export interface IngestionOptions {
  resumePdfPath?: string;
  chunkSize?: number;
  chunkOverlap?: number;
}

export interface IngestionResult {
  success: boolean;
  documentCount: number;
  chunkCount: number;
  documents: {
    id: string;
    name: string;
    chunks: number;
    pages: number;
  }[];
}

export class DocumentIngestionPipeline {
  private vectorStore: PersistentVectorStore;
  private splitter: RecursiveCharacterTextSplitter;

  constructor(vectorStore: PersistentVectorStore, options?: IngestionOptions) {
    this.vectorStore = vectorStore;
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: options?.chunkSize || 500,
      chunkOverlap: options?.chunkOverlap || 100,
      separators: ['\n\n', '\n', '. ', ' ', ''],
    });
  }

  /**
   * Ingest a PDF file into the vector store with page-level metadata.
   */
  async ingestPdfFile(
    filePath: string,
    documentId: string,
    documentName: string
  ): Promise<Document[]> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();

    const rawDocuments: Document[] = [];
    const totalPages = pdfData.total || (pdfData.pages ? pdfData.pages.length : 1);

    if (pdfData.pages && Array.isArray(pdfData.pages) && pdfData.pages.length > 0) {
      for (let i = 0; i < pdfData.pages.length; i++) {
        const pageObj = pdfData.pages[i];
        const pageText = typeof pageObj === 'string' ? pageObj : pageObj.text || '';
        if (pageText.trim().length > 0) {
          rawDocuments.push(
            new Document({
              pageContent: pageText.trim(),
              metadata: {
                documentId,
                documentName,
                pageNumber: i + 1,
                totalDocPages: totalPages,
                source: `${documentName} (Page ${i + 1})`,
              },
            })
          );
        }
      }
    } else if (pdfData.text && pdfData.text.trim().length > 0) {
      rawDocuments.push(
        new Document({
          pageContent: pdfData.text.trim(),
          metadata: {
            documentId,
            documentName,
            pageNumber: 1,
            totalDocPages: totalPages,
            source: `${documentName} (Page 1)`,
          },
        })
      );
    }

    // Split raw page documents into overlapping chunks
    const chunkedDocs = await this.splitter.splitDocuments(rawDocuments);

    // Tag each chunk with unique id and chunk index
    chunkedDocs.forEach((doc, idx) => {
      doc.metadata.id = `${documentId}_p${doc.metadata.pageNumber}_c${idx}`;
      doc.metadata.chunkIndex = idx;
    });

    console.log(`[DocumentIngestion] Parsed ${documentName}: ${rawDocuments.length} pages into ${chunkedDocs.length} chunks`);
    return chunkedDocs;
  }

  /**
   * Ingest text or markdown content into the vector store.
   */
  async ingestTextContent(
    content: string,
    documentId: string,
    documentName: string,
    metadata: Record<string, any> = {}
  ): Promise<Document[]> {
    const rawDoc = new Document({
      pageContent: content.trim(),
      metadata: {
        documentId,
        documentName,
        pageNumber: metadata.pageNumber || 1,
        totalDocPages: metadata.totalDocPages || 1,
        source: documentName,
        ...metadata,
      },
    });

    const chunkedDocs = await this.splitter.splitDocuments([rawDoc]);
    chunkedDocs.forEach((doc, idx) => {
      doc.metadata.id = `${documentId}_c${idx}`;
      doc.metadata.chunkIndex = idx;
    });

    return chunkedDocs;
  }

  /**
   * Execute full baseline ingestion of Monica's resume and verified technical project specs.
   */
  async ingestAllBaselineDocuments(): Promise<IngestionResult> {
    const resumePath = path.resolve(process.cwd(), 'public', 'assets', 'aistudio', 'MONICA_RESUME_3e728256.pdf');
    const allChunks: Document[] = [];
    const docSummary: { id: string; name: string; chunks: number; pages: number }[] = [];

    // 1. Ingest official verified resume PDF
    if (fs.existsSync(resumePath)) {
      const resumeChunks = await this.ingestPdfFile(resumePath, 'monica-resume', 'MONICA_RESUME_3e728256.pdf');
      allChunks.push(...resumeChunks);
      docSummary.push({
        id: 'monica-resume',
        name: 'MONICA_RESUME_3e728256.pdf',
        chunks: resumeChunks.length,
        pages: 2,
      });
    } else {
      console.warn(`[DocumentIngestion] Resume PDF not found at ${resumePath}`);
    }

    // 2. Ingest detailed project specs: Pharmacy Sales Analytics
    const pharmaSpec = `
PROJECT DOSSIER: Pharmacy Sales Analytics Web Application
Candidate Developer: Monica T
GitHub Repository: https://github.com/Monica484/pharmacy-sales-analytics-web-apllication
Technology Stack: React, Node.js, Express.js, Python, Pandas, NumPy, Scikit-learn, XGBoost, Statsmodels, MongoDB
Architecture & Implementation:
- Web-based analytics application with CSV data upload, automated data cleaning, exploratory data analysis (EDA), and sales analysis workflows.
- Implemented the ARIMA (Auto Regressive Integrated Moving Average) time-series forecasting model to predict future drug sales from historical figures.
- Designed features for sales trends, branch and product comparisons, inventory tracking, and low stock/expiry monitoring.
- Integrated Python-based ML utilities for data preprocessing, feature selection, model evaluation, and time-series forecasting.
- Presented sales insights and forecast results through interactive visualizations and dashboards.
    `.trim();

    const pharmaChunks = await this.ingestTextContent(pharmaSpec, 'pharmacy-analytics-spec', 'Pharmacy_Sales_Analytics_Technical_Spec.md', {
      category: 'project-architecture',
      pageNumber: 1,
      totalDocPages: 1,
    });
    allChunks.push(...pharmaChunks);
    docSummary.push({
      id: 'pharmacy-analytics-spec',
      name: 'Pharmacy_Sales_Analytics_Technical_Spec.md',
      chunks: pharmaChunks.length,
      pages: 1,
    });

    // 3. Ingest detailed project specs: NVIDIA NeMo Semantic Search
    const nvidiaSpec = `
PROJECT DOSSIER: NVIDIA NeMo & Sentence-Transformers Semantic Search & RAG Engine
Candidate Developer: Monica T
Technology Stack: Python, NVIDIA NeMo NV-Embed-v2, FAISS, PyTorch, LangChain, FastAPI
Architecture & Implementation:
- High-throughput dense vector embedding retrieval system using NVIDIA NV-Embed-v2 (4096-dimensional embeddings) and FAISS vector indexing.
- Benchmarked on MTEB retrieval datasets, achieving 72.4 retrieval benchmark score with 32k context token window.
- Sub-second dense similarity search across enterprise domain documents with cosine distance ranking.
- Asymmetric query-passage dense embedding pipeline with cosine distance reranking and hybrid BM25 lexical fallback.
    `.trim();

    const nvidiaChunks = await this.ingestTextContent(nvidiaSpec, 'nvidia-rag-spec', 'NVIDIA_NeMo_Semantic_Search_Spec.md', {
      category: 'project-architecture',
      pageNumber: 1,
      totalDocPages: 1,
    });
    allChunks.push(...nvidiaChunks);
    docSummary.push({
      id: 'nvidia-rag-spec',
      name: 'NVIDIA_NeMo_Semantic_Search_Spec.md',
      chunks: nvidiaChunks.length,
      pages: 1,
    });

    // 4. Ingest detailed project specs: Word & Text Embedding Visualizer
    const wordSpec = `
PROJECT DOSSIER: End-to-End Multimodal Word & Text Embedding Visualizer
Candidate Developer: Monica T
Technology Stack: Python, Word2Vec, GloVe, BERT, Scikit-learn, NumPy, React, Tailwind CSS
Architecture & Implementation:
- Comparative study of Word2Vec (Skip-Gram/CBOW), GloVe, and transformer embeddings.
- Interactive vector arithmetic demonstrating linear subspace relationships (e.g. King - Man + Woman = Queen, Data - Raw + Clean = Insight).
- 2D/3D Principal Component Analysis (PCA) and t-SNE dimensionality reduction mapping high-dimensional vectors to interactive coordinate spaces.
- Vocabulary cluster discovery across Data Science, Machine Learning, and Analytics domains.
    `.trim();

    const wordChunks = await this.ingestTextContent(wordSpec, 'word-embedding-spec', 'Word_Embedding_Visualizer_Spec.md', {
      category: 'project-architecture',
      pageNumber: 1,
      totalDocPages: 1,
    });
    allChunks.push(...wordChunks);
    docSummary.push({
      id: 'word-embedding-spec',
      name: 'Word_Embedding_Visualizer_Spec.md',
      chunks: wordChunks.length,
      pages: 1,
    });

    // Clear vector store and commit all chunks to persistent disk storage
    await this.vectorStore.clear();
    await this.vectorStore.addDocuments(allChunks);

    console.log(`[DocumentIngestion] Ingested ${docSummary.length} documents (${allChunks.length} chunks) into persistent vector store`);

    return {
      success: true,
      documentCount: docSummary.length,
      chunkCount: allChunks.length,
      documents: docSummary,
    };
  }
}
