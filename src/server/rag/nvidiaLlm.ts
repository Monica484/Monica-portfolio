import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { traceable } from 'langsmith/traceable';

export interface NvidiaLlmConfig {
  apiKey?: string;
  modelName?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
}

export class NvidiaLanguageModel {
  public modelName: string;
  public baseURL: string;
  private client: ChatOpenAI | null = null;
  private apiKey: string | null = null;
  private temperature: number;
  private maxTokens: number;

  constructor(config?: NvidiaLlmConfig) {
    const rawKey = config?.apiKey || process.env.NVIDIA_API_KEY || null;
    this.apiKey = rawKey ? rawKey.replace(/^["']|["']$/g, '').trim() : null;
    const rawModel = config?.modelName || process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b';
    this.modelName = rawModel.replace(/^["']|["']$/g, '').trim();
    this.baseURL = config?.baseURL || 'https://integrate.api.nvidia.com/v1';
    this.temperature = config?.temperature ?? 0.2;
    this.maxTokens = config?.maxTokens ?? 1024; // Optimized for rapid generation + complete answer

    this.initializeClient();
  }

  private initializeClient() {
    const rawKey = this.apiKey || process.env.NVIDIA_API_KEY;
    const key = rawKey ? rawKey.replace(/^["']|["']$/g, '').trim() : null;
    const rawModel = this.modelName || process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b';
    this.modelName = rawModel.replace(/^["']|["']$/g, '').trim();

    if (key) {
      this.apiKey = key;
      this.client = new ChatOpenAI({
        apiKey: key,
        configuration: {
          baseURL: this.baseURL,
        },
        model: this.modelName,
        temperature: this.temperature,
        maxTokens: this.maxTokens,
        modelKwargs: {
          // Low reasoning effort instructs Nemotron to keep thinking phase agile (<100 tokens)
          reasoning_effort: 'low',
        },
      });
      console.log(`[NvidiaLanguageModel] Initialized fast NVIDIA Nemotron: ${this.modelName} (reasoning_effort: low)`);
    } else {
      console.warn(`[NvidiaLanguageModel] NVIDIA_API_KEY not configured in environment secrets.`);
    }
  }

  /**
   * Check if NVIDIA API key is available.
   */
  hasApiKey(): boolean {
    const key = this.apiKey || process.env.NVIDIA_API_KEY;
    return !!(key && key.replace(/^["']|["']$/g, '').trim().length > 0);
  }

  /**
   * Generate an answer using NVIDIA Nemotron through the NVIDIA API Catalog.
   * Instrument with LangSmith tracing as an LLM span.
   */
  generateAnswer = traceable(
    async (
      systemPrompt: string,
      userQuery: string,
      history: { sender: 'user' | 'assistant'; text: string }[] = []
    ): Promise<string> => {
      if (!this.client || !this.apiKey) {
        this.initializeClient();
      }

      if (!this.client || !this.apiKey) {
        throw new Error(
          'NVIDIA_API_KEY is not configured in server environment secrets. Please set NVIDIA_API_KEY to enable NVIDIA Nemotron answer generation.'
        );
      }

      // Build LangChain chat messages
      const messages: BaseMessage[] = [new SystemMessage(systemPrompt)];

      for (const turn of history.slice(-4)) {
        if (turn.sender === 'user') {
          messages.push(new HumanMessage(turn.text));
        } else {
          messages.push(new AIMessage(turn.text));
        }
      }

      messages.push(new HumanMessage(userQuery));

      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('NVIDIA Nemotron request timed out after 20 seconds.')), 20000)
        );

        const invokePromise = this.client.invoke(messages);
        const response: any = await Promise.race([invokePromise, timeoutPromise]);

        let content = typeof response.content === 'string' ? response.content.trim() : JSON.stringify(response.content);

        // If content is empty or null, fall back to cleaned reasoning_content
        if ((!content || content === 'null' || content.length === 0) && response.additional_kwargs?.reasoning_content) {
          const rawReasoning = String(response.additional_kwargs.reasoning_content).trim();
          const finalMatch = rawReasoning.match(/(?:Draft|Final response|Answer|Summary|Output):\s*([\s\S]+)$/i);
          if (finalMatch) {
            content = finalMatch[1].replace(/✅|[\*]{2}Check[\s\S]*$/gi, '').trim();
          } else if (rawReasoning.includes("Here's a thinking process:")) {
            // Split by double newline and filter out thinking step bullet points
            const paragraphs = rawReasoning.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
            const nonThinking = paragraphs.filter(p => !p.startsWith("Here's a thinking") && !/^\d+\.\s+\*\*/.test(p) && !p.startsWith('- '));
            content = nonThinking.length > 0 ? nonThinking[nonThinking.length - 1] : rawReasoning;
          } else {
            content = rawReasoning;
          }
        }

        if (!content || content === 'null' || content.length === 0) {
          throw new Error('NVIDIA Nemotron returned an empty response.');
        }

        return content;
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        console.error(`[NvidiaLanguageModel] Generation failure:`, errMsg);

        // Safe error classification
        if (errMsg.includes('401') || errMsg.includes('Incorrect API key') || errMsg.includes('Unauthorized')) {
          throw new Error('NVIDIA API Error: Unauthorized (401). Please verify that your NVIDIA_API_KEY is valid.');
        }
        if (errMsg.includes('429') || errMsg.includes('Rate limit')) {
          throw new Error('NVIDIA API Error: Rate limit exceeded (429). Please try again shortly.');
        }
        if (errMsg.includes('timed out')) {
          throw new Error('NVIDIA API Error: Request timed out. The NVIDIA API Catalog endpoint is currently experiencing high latency.');
        }
        throw new Error(`NVIDIA Nemotron Error: ${errMsg}`);
      }
    },
    {
      name: 'nvidia_nemotron_call',
      run_type: 'llm',
      metadata: {
        provider: 'NVIDIA API Catalog',
        endpoint: 'https://integrate.api.nvidia.com/v1',
      },
    }
  );
}
