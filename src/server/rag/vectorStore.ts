import fs from 'fs';
import path from 'path';
import { VectorStore } from '@langchain/core/vectorstores';
import { Document } from '@langchain/core/documents';
import { Embeddings } from '@langchain/core/embeddings';
import { RagDocumentChunk, IndexedDocumentMeta } from './types';
import { ChromaClient, Collection } from 'chromadb';

export interface PersistentVectorStoreArgs {
  storagePath?: string;
  chromaUrl?: string;
  collectionName?: string;
}

export class PersistentVectorStore extends VectorStore {
  declare FilterType: Record<string, any>;
  public storagePath: string;
  public chromaUrl: string | null;
  public collectionName: string;
  private chunks: RagDocumentChunk[] = [];
  private chromaClient: ChromaClient | null = null;
  private chromaCollection: Collection | null = null;

  constructor(embeddings: Embeddings, args?: PersistentVectorStoreArgs) {
    super(embeddings, args ?? {});
    this.storagePath = args?.storagePath || path.resolve(process.cwd(), 'data', 'vectorstore', 'vector_store.json');
    this.chromaUrl = args?.chromaUrl || process.env.CHROMA_URL || null;
    this.collectionName = args?.collectionName || 'monica_recruiter_rag';

    this.ensureStorageDirectory();
    this.loadFromDisk();
    this.initChroma();
  }

  _vectorstoreType(): string {
    return 'persistent_file_chroma_hybrid';
  }

  private ensureStorageDirectory() {
    const dir = path.dirname(this.storagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          this.chunks = data;
          console.log(`[PersistentVectorStore] Loaded ${this.chunks.length} chunks from disk persistence: ${this.storagePath}`);
        }
      } else {
        this.saveToDisk();
      }
    } catch (err: any) {
      console.warn(`[PersistentVectorStore] Failed to load disk persistence file:`, err?.message || err);
      this.chunks = [];
    }
  }

  private saveToDisk() {
    try {
      this.ensureStorageDirectory();
      const tmpPath = `${this.storagePath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.chunks, null, 2), 'utf-8');
      fs.renameSync(tmpPath, this.storagePath);
    } catch (err: any) {
      console.error(`[PersistentVectorStore] Error saving chunks to disk:`, err?.message || err);
    }
  }

  private async initChroma() {
    if (!this.chromaUrl) return;
    try {
      this.chromaClient = new ChromaClient({ path: this.chromaUrl });
      this.chromaCollection = await this.chromaClient.getOrCreateCollection({
        name: this.collectionName,
      });
      console.log(`[PersistentVectorStore] Connected to ChromaDB at ${this.chromaUrl}, collection: ${this.collectionName}`);
    } catch (err: any) {
      console.warn(`[PersistentVectorStore] ChromaDB not reachable at ${this.chromaUrl} (${err?.message || err}). Operating in local disk persistence mode.`);
      this.chromaClient = null;
      this.chromaCollection = null;
    }
  }

  /**
   * Add documents with embeddings to persistent storage and optional ChromaDB.
   */
  async addDocuments(documents: Document[]): Promise<string[]> {
    const texts = documents.map((doc) => doc.pageContent);
    const vectors = await this.embeddings.embedDocuments(texts);
    return this.addVectors(vectors, documents);
  }

  async addVectors(vectors: number[][], documents: Document[]): Promise<string[]> {
    const ids: string[] = [];

    documents.forEach((doc, idx) => {
      const id = doc.metadata.id || `chunk_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`;
      ids.push(id);

      const chunk: RagDocumentChunk = {
        id,
        documentId: doc.metadata.documentId || 'resume-primary',
        documentName: doc.metadata.documentName || 'MONICA_RESUME_3e728256.pdf',
        pageNumber: Number(doc.metadata.pageNumber) || 1,
        totalDocPages: Number(doc.metadata.totalDocPages) || 1,
        content: doc.pageContent,
        embedding: vectors[idx],
        metadata: doc.metadata,
        createdAt: new Date().toISOString(),
      };

      // Upsert by chunk id
      const existingIdx = this.chunks.findIndex((c) => c.id === id);
      if (existingIdx >= 0) {
        this.chunks[existingIdx] = chunk;
      } else {
        this.chunks.push(chunk);
      }
    });

    // Write-through disk persistence
    this.saveToDisk();

    // Mirror to ChromaDB if connected
    if (this.chromaCollection) {
      try {
        await this.chromaCollection.upsert({
          ids,
          embeddings: vectors,
          metadatas: documents.map((d) => ({
            documentId: String(d.metadata.documentId || ''),
            documentName: String(d.metadata.documentName || ''),
            pageNumber: Number(d.metadata.pageNumber || 1),
          })),
          documents: documents.map((d) => d.pageContent),
        });
      } catch (err: any) {
        console.warn(`[PersistentVectorStore] ChromaDB sync error:`, err?.message || err);
      }
    }

    return ids;
  }

  /**
   * Cosine similarity search over persistent vector records.
   */
  async similaritySearchVectorWithScore(
    queryVector: number[],
    k: number = 4,
    filter?: Record<string, any>
  ): Promise<[Document, number][]> {
    if (this.chunks.length === 0) {
      return [];
    }

    const scoredChunks: { chunk: RagDocumentChunk; score: number }[] = [];

    for (const chunk of this.chunks) {
      // Optional metadata filter
      if (filter) {
        let match = true;
        for (const [key, val] of Object.entries(filter)) {
          if (chunk.metadata[key] !== val && (chunk as any)[key] !== val) {
            match = false;
            break;
          }
        }
        if (!match) continue;
      }

      const score = this.calculateCosineSimilarity(queryVector, chunk.embedding);
      scoredChunks.push({ chunk, score });
    }

    // Sort descending by similarity
    scoredChunks.sort((a, b) => b.score - a.score);
    const topK = scoredChunks.slice(0, k);

    return topK.map(({ chunk, score }) => [
      new Document({
        pageContent: chunk.content,
        metadata: {
          id: chunk.id,
          documentId: chunk.documentId,
          documentName: chunk.documentName,
          pageNumber: chunk.pageNumber,
          totalDocPages: chunk.totalDocPages,
          score,
          ...chunk.metadata,
        },
      }),
      score,
    ]);
  }

  async similaritySearch(query: string, k: number = 4, filter?: Record<string, any>): Promise<Document[]> {
    const queryVector = await this.embeddings.embedQuery(query);
    const results = await this.similaritySearchVectorWithScore(queryVector, k, filter);
    return results.map(([doc]) => doc);
  }

  async similaritySearchWithScore(query: string, k: number = 4, filter?: Record<string, any>): Promise<[Document, number][]> {
    const queryVector = await this.embeddings.embedQuery(query);
    return this.similaritySearchVectorWithScore(queryVector, k, filter);
  }

  /**
   * Delete all chunks for a given documentId.
   */
  async deleteDocuments(documentId: string): Promise<number> {
    const initialCount = this.chunks.length;
    const deletedChunks = this.chunks.filter((c) => c.documentId === documentId);
    this.chunks = this.chunks.filter((c) => c.documentId !== documentId);

    const count = initialCount - this.chunks.length;
    if (count > 0) {
      this.saveToDisk();

      if (this.chromaCollection && deletedChunks.length > 0) {
        try {
          await this.chromaCollection.delete({
            ids: deletedChunks.map((c) => c.id),
          });
        } catch (err: any) {
          console.warn(`[PersistentVectorStore] ChromaDB delete error:`, err?.message || err);
        }
      }
    }
    return count;
  }

  /**
   * List summary metadata of all indexed documents in the persistent store.
   */
  async listDocuments(): Promise<IndexedDocumentMeta[]> {
    const docMap = new Map<string, { name: string; pages: Set<number>; count: number; date: string }>();

    for (const chunk of this.chunks) {
      const docId = chunk.documentId;
      if (!docMap.has(docId)) {
        docMap.set(docId, {
          name: chunk.documentName,
          pages: new Set([chunk.pageNumber]),
          count: 1,
          date: chunk.createdAt,
        });
      } else {
        const item = docMap.get(docId)!;
        item.pages.add(chunk.pageNumber);
        item.count += 1;
      }
    }

    const result: IndexedDocumentMeta[] = [];
    for (const [documentId, data] of docMap.entries()) {
      result.push({
        documentId,
        documentName: data.name,
        filePath: `data/vectorstore/${documentId}`,
        chunkCount: data.count,
        pageCount: data.pages.size,
        indexedAt: data.date,
      });
    }
    return result;
  }

  /**
   * Clear all records from persistent vector storage.
   */
  async clear(): Promise<void> {
    this.chunks = [];
    this.saveToDisk();
    if (this.chromaCollection) {
      try {
        await this.chromaClient?.deleteCollection({ name: this.collectionName });
        this.chromaCollection = await this.chromaClient!.getOrCreateCollection({ name: this.collectionName });
      } catch (err: any) {
        console.warn(`[PersistentVectorStore] Chroma clear error:`, err?.message || err);
      }
    }
  }

  getChunkCount(): number {
    return this.chunks.length;
  }

  getAllChunks(): RagDocumentChunk[] {
    return [...this.chunks];
  }

  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
    const len = Math.min(vecA.length, vecB.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) return 0;
    return Number((dot / denom).toFixed(5));
  }
}
