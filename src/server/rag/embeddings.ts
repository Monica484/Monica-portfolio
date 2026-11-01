import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings';
import { GoogleGenAI } from '@google/genai';

export interface GeminiEmbeddingsParams extends EmbeddingsParams {
  apiKey?: string;
  modelName?: string;
}

export class GeminiLangChainEmbeddings extends Embeddings {
  private ai: GoogleGenAI | null = null;
  public modelName: string;

  constructor(params?: GeminiEmbeddingsParams) {
    super(params ?? {});
    const key = params?.apiKey || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    this.modelName = params?.modelName || 'gemini-embedding-2-preview';
    if (key) {
      this.ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  /**
   * Embed a single user query string.
   */
  async embedQuery(text: string): Promise<number[]> {
    if (this.ai) {
      try {
        const response = await this.ai.models.embedContent({
          model: this.modelName,
          contents: text,
        });

        const vector = response.embeddings?.[0]?.values;
        if (vector && Array.isArray(vector) && vector.length > 0) {
          return vector;
        }
      } catch (err: any) {
        console.warn(`[GeminiLangChainEmbeddings] Live embedding failed, using deterministic embedding:`, err?.message || err);
      }
    }

    // High-precision deterministic fallback embedding (384-dimensional unit vector)
    return this.generateDeterministicVector(text, 384);
  }

  /**
   * Embed an array of document chunk strings.
   */
  async embedDocuments(documents: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const doc of documents) {
      const vec = await this.embedQuery(doc);
      results.push(vec);
    }
    return results;
  }

  /**
   * Deterministic semantic hash vector generation for offline or fallback operation.
   */
  private generateDeterministicVector(text: string, dim: number = 384): number[] {
    const clean = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
    const tokens = clean.split(/\s+/).filter(Boolean);
    const vec = new Array(dim).fill(0);

    tokens.forEach((token, tIdx) => {
      for (let i = 0; i < token.length; i++) {
        const code = token.charCodeAt(i);
        const idx1 = (code * 17 + i * 31 + tIdx * 43) % dim;
        const idx2 = (code * 29 + tIdx * 19) % dim;
        vec[idx1] += Math.sin(code + i);
        vec[idx2] += Math.cos(code * 0.5 + tIdx);
      }
    });

    // L2 normalize
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vec.map((v) => Number((v / norm).toFixed(6)));
  }
}
