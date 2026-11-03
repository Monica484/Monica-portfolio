import { PersistentVectorStore } from './vectorStore';
import { RagCitation, RagQueryOptions, RagQueryResponse } from './types';
import { NvidiaLanguageModel } from './nvidiaLlm';
import { traceable } from 'langsmith/traceable';
import { Document } from '@langchain/core/documents';

export class RagPipeline {
  private vectorStore: PersistentVectorStore;
  private nvidiaLlm: NvidiaLanguageModel;
  public modelName: string;

  constructor(vectorStore: PersistentVectorStore, modelName?: string) {
    this.vectorStore = vectorStore;
    this.modelName = modelName || process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b';
    this.nvidiaLlm = new NvidiaLanguageModel({
      modelName: this.modelName,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
  }

  /**
   * Child LangSmith traceable retriever span.
   */
  private retrieveDocumentChunks = traceable(
    async (
      query: string,
      topK: number,
      threshold: number
    ): Promise<{ relevantResults: [Document, number][]; sources: RagCitation[] }> => {
      const searchResults = await this.vectorStore.similaritySearchWithScore(query, topK);
      const relevantResults = searchResults.filter(([_, score]) => score >= threshold);

      const sources: RagCitation[] = relevantResults.map(([doc, score]) => ({
        documentName: String(doc.metadata.documentName || 'Document'),
        pageNumber: Number(doc.metadata.pageNumber || 1),
        score: Math.round(score * 100) / 100,
        snippet: doc.pageContent.replace(/\s+/g, ' ').slice(0, 160) + (doc.pageContent.length > 160 ? '...' : ''),
      }));

      return { relevantResults, sources };
    },
    {
      name: 'vector_retrieval_step',
      run_type: 'retriever',
      metadata: {
        vectorStore: 'PersistentVectorStore',
      },
    }
  );

  /**
   * Execute complete LangChain RAG pipeline with NVIDIA Nemotron and LangSmith tracing.
   */
  answerQuestion = traceable(
    async (query: string, options?: RagQueryOptions): Promise<RagQueryResponse> => {
      const topK = options?.topK || 3;
      const threshold = options?.similarityThreshold !== undefined ? options?.similarityThreshold : 0.62;
      const history = options?.history || [];

      // 1. Retrieve document chunks using semantic similarity search
      const { relevantResults, sources } = await this.retrieveDocumentChunks(query, topK, threshold);
      const isGrounded = relevantResults.length > 0;

      // 2. Build augmented context string from retrieved document chunks
      let contextBlock = '';
      if (isGrounded) {
        contextBlock = relevantResults
          .map(([doc, score], idx) => {
            const docName = doc.metadata.documentName || 'Resume';
            const page = doc.metadata.pageNumber ? `Page ${doc.metadata.pageNumber}` : 'General';
            return `[Source Document ${idx + 1}: ${docName} (${page}) | Semantic Relevance: ${(score * 100).toFixed(0)}%]\n${doc.pageContent.trim()}`;
          })
          .join('\n\n---\n\n');
      }

      // 3. Construct System Prompt according to RAG grounding principles for NVIDIA Nemotron
      const systemPrompt = `
You are the AI Recruiter Copilot representing Monica T, powered by NVIDIA Nemotron (nvidia/nemotron-3.5-lightning-30b-a3b) through the NVIDIA API Catalog.
Candidate Profile: Monica T, BCA (Data Science) graduate from Jyoti Nivas College, Bangalore (March 2026).
Your goal is to answer hiring manager and recruiter inquiries with precision, professional enthusiasm, and strict grounding.

${
  isGrounded
    ? `VERIFIED RETRIEVED CONTEXT FROM CANDIDATE DOCUMENTS:
==================================================
${contextBlock}
==================================================

GROUNDING INSTRUCTIONS:
1. Base all assertions regarding Monica's education, skills, projects (Pharmacy Sales ARIMA, NVIDIA NeMo, Word Embeddings), and internship (Cynaris Solutions) strictly on the retrieved context above.
2. When referencing specific achievements or projects, cite the source document and page number where appropriate.
3. If the retrieved context does not contain the answer to a question about Monica, state clearly: "This specific information is not mentioned in Monica's provided resume or project records." Do NOT hallucinate unverified employers, degrees, or metrics.`
    : `GENERAL / CASUAL INQUIRY INSTRUCTIONS:
No relevant document passages were retrieved for this specific question from Monica's resume.
- If this is a technical concept (e.g., machine learning, statistics, data science algorithms): Provide a clear, sharp technical explanation, and briefly mention how Monica applies these concepts in her projects.
- If this is a casual, philosophical, or off-topic question (e.g. "what is life", "hello", "tell me a joke"): Give a warm, friendly, or witty remark, then gracefully bridge back to exploring Monica's data science skills, education, or projects.`
}

CONVERSATION STYLE:
- Professional, articulate, warm, and welcoming.
- Keep answers clear and formatted with scannable bullet points when explaining technical concepts.
- Be direct and prompt. Keep internal reasoning concise so the recruiter receives answers quickly.
- When asked about contacting Monica or scheduling an interview, invite them to use the "Hire Monica" button in the dashboard, email monicamoni9972@gmail.com, or call +91 7483869742.
`.trim();

      // 4. Generate Answer via NVIDIA Nemotron
      try {
        const reply = await this.nvidiaLlm.generateAnswer(systemPrompt, query, history);

        return {
          reply,
          sources,
          ragUsed: true,
          groundedInResume: isGrounded,
          model: `NVIDIA Nemotron (${this.nvidiaLlm.modelName}) + FAISS`,
        };
      } catch (nvidiaError: any) {
        const errorMsg = nvidiaError?.message || String(nvidiaError);
        console.error(`[RagPipeline] NVIDIA Nemotron call failed:`, errorMsg);

        // Do NOT silently fall back to Gemini. Return clear error message per requirements.
        return {
          reply: `⚠️ **NVIDIA Nemotron Generation Error**:\n\n${errorMsg}\n\n*Please ensure that \`NVIDIA_API_KEY\` is configured in your server environment secrets (https://build.nvidia.com).*`,
          sources,
          ragUsed: true,
          groundedInResume: isGrounded,
          model: `NVIDIA Nemotron (${this.nvidiaLlm.modelName}) [Error]`,
        };
      }
    },
    {
      name: 'nvidia_nemotron_rag_pipeline',
      run_type: 'chain',
      metadata: {
        model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
        framework: 'LangChain + FAISS + LangSmith',
        retriever: 'FAISS IndexFlatIP (Top-3)',
        embeddings: 'NVIDIAEmbeddings (nvidia/llama-3.2-nv-embedqa-1b-v1)',
      },
    }
  );
}
