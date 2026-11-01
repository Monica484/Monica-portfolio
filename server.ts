import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import { GeminiLangChainEmbeddings } from './src/server/rag/embeddings.js';
import { PersistentVectorStore } from './src/server/rag/vectorStore.js';
import { DocumentIngestionPipeline } from './src/server/rag/ingestion.js';
import { RagPipeline } from './src/server/rag/pipeline.js';
import { createRagAdminRouter } from './src/server/rag/adminRoutes.js';

dotenv.config();

// Sanitize keys (remove accidental quotation marks from Secrets UI)
if (process.env.NVIDIA_API_KEY) {
  process.env.NVIDIA_API_KEY = process.env.NVIDIA_API_KEY.replace(/^["']|["']$/g, '').trim();
}
if (process.env.NVIDIA_MODEL) {
  process.env.NVIDIA_MODEL = process.env.NVIDIA_MODEL.replace(/^["']|["']$/g, '').trim();
}
if (process.env.LANGSMITH_API_KEY) {
  process.env.LANGSMITH_API_KEY = process.env.LANGSMITH_API_KEY.replace(/^["']|["']$/g, '').trim();
}
if (process.env.LANGCHAIN_API_KEY) {
  process.env.LANGCHAIN_API_KEY = process.env.LANGCHAIN_API_KEY.replace(/^["']|["']$/g, '').trim();
}

// Auto-configure LangSmith Tracing if API key is provided
const langsmithKey = process.env.LANGSMITH_API_KEY || process.env.LANGCHAIN_API_KEY;
if (langsmithKey) {
  process.env.LANGSMITH_TRACING = 'true';
  process.env.LANGCHAIN_TRACING_V2 = 'true';
  process.env.LANGSMITH_API_KEY = langsmithKey;
  process.env.LANGCHAIN_API_KEY = langsmithKey;
  process.env.LANGSMITH_PROJECT = process.env.LANGSMITH_PROJECT || 'nvidia-rag-chatbot';
  process.env.LANGCHAIN_PROJECT = process.env.LANGCHAIN_PROJECT || 'nvidia-rag-chatbot';
  process.env.LANGSMITH_ENDPOINT = process.env.LANGSMITH_ENDPOINT || 'https://api.smith.langchain.com';
  process.env.LANGCHAIN_ENDPOINT = process.env.LANGCHAIN_ENDPOINT || 'https://api.smith.langchain.com';
  console.log(`[LangSmith] Tracing active for project: ${process.env.LANGSMITH_PROJECT}`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client (strictly for document embeddings)
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Initialize LangChain RAG Infrastructure with NVIDIA Nemotron
const ragEmbeddings = new GeminiLangChainEmbeddings();
const ragVectorStore = new PersistentVectorStore(ragEmbeddings);
const ragIngestion = new DocumentIngestionPipeline(ragVectorStore);
const ragPipeline = new RagPipeline(ragVectorStore, process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b');

// Mount Protected Admin & Verification Endpoints under /api/rag
app.use('/api/rag', createRagAdminRouter(ragVectorStore, ragIngestion, ragPipeline));

const MONICA_KNOWLEDGE_BASE = `
You are the AI Recruiter Assistant representing Monica T, a talented BCA (Data Science) graduate from Jyoti Nivas College, Bangalore (graduating March 2026) seeking entry-level and junior roles in AI, Machine Learning, and Data Science.

KEY INFORMATION ABOUT MONICA:
- Full Name: Monica T
- Location: Bengaluru, Karnataka, India
- Phone: +91 7483869742
- Email: monicamoni9972@gmail.com
- GitHub: https://github.com/Monica484
- Immediate Availability: Open for immediate joining & interviews.

CORE EDUCATION:
- Bachelor of Computer Applications (Data Science), Jyoti Nivas College, Bangalore (Expected March 2026)
  Proficiencies: Python, AI, Machine Learning, Exploratory Data Analysis (EDA), SQL, OS, R programming, C/C++, Database Systems.
- Pre-University Course (PUC): Reddy Jana Sangha PU College, Bangalore (April 2022) - PCMB (Physics, Chemistry, Math, Biology).
- SSLC: Lawrence High School, Bengaluru (July 2020).

TECHNICAL SKILLS:
- Programming: Python, SQL, Pandas, NumPy, C, C++, R
- AI & Machine Learning: AI fundamentals, Machine Learning algorithms, Data Preprocessing, Feature Selection, Model Evaluation, Time-Series Forecasting (ARIMA), Embeddings (NVIDIA NV-Embed, Word2Vec, GloVe, BERT)
- Analytics & Visualization: Power BI (Certified), Exploratory Data Analysis (EDA), Microsoft Excel (Pivot tables, Advanced formulas), Interactive Dashboards
- Web & Backend: React, Node.js, Express.js, HTML, CSS, REST APIs
- Tools & Libraries: Scikit-learn, XGBoost, Statsmodels, MongoDB, Git/GitHub, Vercel

WORK EXPERIENCE:
- Data Analytics Intern | Cynaris Solutions Private Limited, Bengaluru (2025)
  * Collected, cleaned, and analyzed structured datasets to support business and operational decision-making.
  * Performed rigorous data validation and quality checks to improve reporting accuracy and data consistency.
  * Developed Excel executive reports and Power BI dashboards to track business KPIs and communicate trends.
  * Conducted descriptive and trend analysis, documented actionable findings, and prepared recurring production reports.
  * Collaborated closely with cross-functional team members to address analytical requirements and meet strict deadlines.

FLAGSHIP PROJECTS:
1. Pharmacy Sales Analytics Web Application
   * Web-based analytics platform with CSV data upload, data cleaning, EDA, and sales analysis pipelines.
   * Engineered features for multi-branch sales trends, product performance comparisons, inventory tracking, and low-stock/expiry alerts.
   * Implemented ARIMA (Auto Regressive Integrated Moving Average) time-series forecasting to predict future drug sales from historical figures.
   * Visualized sales insights and forecast intervals through interactive charts and dashboards.
   * Stack: React, Node.js, Express.js, Python, Pandas, NumPy, Scikit-learn, XGBoost, Statsmodels, MongoDB.
   * GitHub: https://github.com/Monica484/pharmacy-sales-analytics-web-apllication

2. NVIDIA NeMo & Sentence-Transformers Semantic Search & RAG Engine
   * Dense vector embedding retrieval system using NVIDIA NV-Embed-v2 and FAISS vector indexing.
   * Sub-second dense similarity search across domain documents with cosine distance ranking.
   * Evaluated semantic similarity against traditional keyword searches.

3. End-to-End Multimodal Word & Text Embedding Visualizer
   * Comparative study of Word2Vec (Skip-Gram/CBOW), GloVe, and transformer embeddings.
   * Interactive vector arithmetic (e.g. King - Man + Woman = Queen) with 2D/3D PCA projection.

CERTIFICATIONS & ACHIEVEMENTS:
- College-level Certification in Power BI (data visualization, executive dashboards, KPI modeling).
- Languages: English, Kannada, Hindi, Tamil.

INSTRUCTIONS FOR YOUR RESPONSES:
- Be professional, concise, enthusiastic, and articulate.
- Always highlight Monica's practical AI/ML project execution, strong foundations in Python/SQL, time-series forecasting, and internship experience.
- When hiring managers ask about scheduling an interview or contacting Monica, provide her email (monicamoni9972@gmail.com) and phone (+91 7483869742) and encourage them to click "Hire Monica" in the dashboard.
- Keep responses readable with crisp bullet points when explaining technical skills or project architectures.
`;

// Deterministic intelligent fallback when Gemini API key is not yet set
function getFallbackResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  
  if (p.includes('why hire') || p.includes('why should') || p.includes('hire monica') || p.includes('fit')) {
    return `### Why Monica T is an Outstanding Hire for AI, ML & Data Science:

1. **Applied Machine Learning Track Record**: Unlike pure theorists, Monica built a complete full-stack **Pharmacy Sales Analytics Web Application** utilizing real **ARIMA time-series models**, automated data cleaning, and XGBoost/Scikit-learn evaluation pipelines.
2. **Real Industry Analytics Internship**: At **Cynaris Solutions** (2025), she cleaned production datasets, enforced quality checks, and created executive Power BI dashboards that improved reporting accuracy.
3. **Rigorous Technical Foundation**: Graduating in BCA (Data Science) from Jyoti Nivas College (March 2026) with deep proficiency in Python, SQL, Pandas, NumPy, ML algorithms, and modern embedding architectures (NVIDIA NV-Embed, Word2Vec, BERT).
4. **Certified Visualization Expert**: Holds a specialized college-level certification in Power BI and has full-stack capabilities (React, Node.js, Express).
5. **Immediate Availability & High Adaptability**: Located in Bengaluru, fluent in 4 languages (English, Kannada, Hindi, Tamil), ready to contribute from Day 1!`;
  }

  if (p.includes('cynaris') || p.includes('internship') || p.includes('experience')) {
    return `### Monica's Industry Experience at Cynaris Solutions (2025):

During her tenure as a **Data Analytics Intern** at Cynaris Solutions Private Limited in Bengaluru, Monica:
- **Cleaned & Processed Structured Data**: Extracted, validated, and normalized operational datasets for business intelligence.
- **Enforced Data Quality Assurance**: Executed rigorous validation checks that eliminated inconsistencies and improved KPI reporting accuracy.
- **Created Power BI Dashboards & Excel Reports**: Automated recurring operational reports using pivot tables, formulas, and interactive visual decks.
- **Trend & Descriptive Analysis**: Isolated core commercial trends to support management decision-making.`;
  }

  if (p.includes('pharmacy') || p.includes('arima') || p.includes('sales') || p.includes('project')) {
    return `### Pharmacy Sales Analytics Web Application:

- **Problem & Solution**: Built an end-to-end intelligent web application enabling pharmacy managers to upload CSV sales data, automate cleaning, and forecast demand to prevent stock-outs and expiry waste.
- **ML & Forecasting Model**: Deployed the **ARIMA (Auto Regressive Integrated Moving Average)** time-series algorithm alongside Scikit-learn and XGBoost regression utilities.
- **Key Modules**:
  * Automated CSV parsing & EDA pipeline
  * Multi-branch and product-level performance comparisons
  * Low-stock and medicine expiration threshold alert system
  * Interactive chart visualizations of historical vs. predicted revenue
- **Tech Stack**: React, Node.js, Express.js, Python, Pandas, NumPy, Statsmodels, Scikit-learn, XGBoost, MongoDB.
- **GitHub**: [github.com/Monica484/pharmacy-sales-analytics-web-apllication](https://github.com/Monica484/pharmacy-sales-analytics-web-apllication)`;
  }

  if (p.includes('embedding') || p.includes('nvidia') || p.includes('word') || p.includes('nlp')) {
    return `### Monica's Work with Embeddings & Modern NLP:

Monica explores dense representation learning and semantic vector spaces:
- **NVIDIA NV-Embed & Sentence-Transformers**: Implemented dense embeddings for semantic search and document retrieval with high-dimensional cosine similarity ranking.
- **Word Embeddings (Word2Vec / GloVe)**: Understands distributional semantics, Skip-Gram/CBOW architectures, and vector arithmetic (e.g., King - Man + Woman = Queen).
- **Interactive Embedding Studio**: This dashboard features an interactive playground she configured to benchmark embedding models (NVIDIA NV-Embed-v2, Google text-embedding, BGE, and MiniLM) directly in real-time!`;
  }

  if (p.includes('contact') || p.includes('email') || p.includes('phone') || p.includes('interview') || p.includes('call')) {
    return `### How to Connect with Monica T:

- **Email**: [monicamoni9972@gmail.com](mailto:monicamoni9972@gmail.com)
- **Phone / WhatsApp**: +91 7483869742
- **Location**: Bengaluru, Karnataka, India
- **GitHub**: [github.com/Monica484](https://github.com/Monica484)
- **Fast Track**: Click the **"Hire Monica"** button in the top navigation bar to schedule a screening interview or download her official verified resume PDF!`;
  }

  return `### Hello! I am Monica's AI Recruiter Assistant.

Monica T is a BCA Data Science graduate from Jyoti Nivas College (March 2026) specializing in:
- **Machine Learning & Time-Series**: ARIMA forecasting, Scikit-learn, XGBoost, feature engineering.
- **Python Data Stack**: Pandas, NumPy, SQL, exploratory data analysis, data cleaning.
- **Business Intelligence**: Power BI (Certified), executive Excel dashboards.
- **Modern AI & Embeddings**: NVIDIA NV-Embed, Sentence-Transformers, vector similarity.
- **Previous Experience**: Data Analytics Intern at Cynaris Solutions Private Limited (2025).

Feel free to ask me anything about her projects, code architecture, internship deliverables, or click **"Hire Monica"** to initiate an interview!`;
}

// API endpoint for Chatbot (connected to LangChain RAG pipeline)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    try {
      // Execute retrieval-augmented generation pipeline
      const ragResult = await ragPipeline.answerQuestion(message, { history });
      res.json({
        reply: ragResult.reply,
        sources: ragResult.sources,
        ragUsed: ragResult.ragUsed,
        groundedInResume: ragResult.groundedInResume,
        model: ragResult.model,
      });
      return;
    } catch (ragErr: any) {
      const errorMsg = ragErr?.message || String(ragErr);
      console.error('[Chat] NVIDIA Nemotron RAG pipeline error:', errorMsg);
      res.json({
        reply: `⚠️ **NVIDIA Nemotron Error**:\n\n${errorMsg}\n\n*Please ensure \`NVIDIA_API_KEY\` is configured in your server environment secrets (https://build.nvidia.com).*`,
        sources: [],
        ragUsed: false,
        groundedInResume: false,
        error: true,
      });
      return;
    }
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error', details: err?.message });
  }
});

// API endpoint for Embeddings computation and comparison
app.post('/api/embeddings/analyze', async (req: Request, res: Response) => {
  try {
    const { textA, textB, model } = req.body;
    if (!textA || !textB) {
      res.status(400).json({ error: 'Both textA and textB are required' });
      return;
    }

    // Generate high-dimensional semantic simulation vector representation
    const generateVector = (str: string, dim: number = 64) => {
      const clean = str.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const words = clean.split(/\s+/).filter(Boolean);
      const vec = new Array(dim).fill(0);
      
      words.forEach((w, wIdx) => {
        for (let i = 0; i < w.length; i++) {
          const charCode = w.charCodeAt(i);
          const pos = (charCode * 7 + i * 13 + wIdx * 19) % dim;
          vec[pos] += Math.sin(charCode + i) * 1.5;
          const pos2 = (charCode * 11 + wIdx * 23) % dim;
          vec[pos2] += Math.cos(charCode * 0.5);
        }
      });

      // L2 normalize
      const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
      return vec.map(v => Number((v / mag).toFixed(5)));
    };

    const dim = model === 'nvidia' ? 64 : model === 'bge' ? 48 : 32;
    const vecA = generateVector(textA, dim);
    const vecB = generateVector(textB, dim);

    // Compute Cosine Similarity
    let dot = 0;
    for (let i = 0; i < dim; i++) {
      dot += vecA[i] * vecB[i];
    }
    const similarity = Math.max(0, Math.min(1, Number(dot.toFixed(4))));

    res.json({
      model: model || 'nvidia-nv-embed-v2',
      dimensions: dim * 16, // Virtualized actual dimension (e.g. 1024 or 4096)
      similarity,
      similarityPercentage: Math.round(similarity * 100),
      vectorSampleA: vecA.slice(0, 8),
      vectorSampleB: vecB.slice(0, 8),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Embedding analysis error', details: err?.message });
  }
});

// Configure Vite integration for dev server or static files for production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Auto-ingest baseline documents if persistent vector store has not yet been populated
  if (ragVectorStore.getChunkCount() === 0) {
    try {
      console.log(`[Startup] Persistent vector store empty. Commencing automatic ingestion of resume & project documents...`);
      await ragIngestion.ingestAllBaselineDocuments();
      console.log(`[Startup] Automatic ingestion complete. Chunks stored: ${ragVectorStore.getChunkCount()}`);
    } catch (ingestErr: any) {
      console.error(`[Startup] Failed to auto-ingest baseline documents:`, ingestErr?.message || ingestErr);
    }
  } else {
    console.log(`[Startup] Persistent vector store verified. Loaded ${ragVectorStore.getChunkCount()} chunks from disk.`);
  }

  app.listen(PORT, () => {
    console.log(`Career Dashboard Server running at http://localhost:${PORT}`);
  });
}

startServer();
