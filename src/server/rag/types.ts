export interface RagDocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  totalDocPages: number;
  content: string;
  embedding: number[];
  metadata: {
    section?: string;
    category?: string;
    [key: string]: any;
  };
  createdAt: string;
}

export interface RagCitation {
  documentName: string;
  pageNumber: number;
  score: number;
  snippet: string;
}

export interface RagQueryOptions {
  topK?: number;
  similarityThreshold?: number;
  history?: { sender: 'user' | 'assistant'; text: string }[];
}

export interface RagQueryResponse {
  reply: string;
  sources: RagCitation[];
  ragUsed: boolean;
  groundedInResume: boolean;
  model: string;
}

export interface IndexedDocumentMeta {
  documentId: string;
  documentName: string;
  filePath: string;
  chunkCount: number;
  pageCount: number;
  indexedAt: string;
}
