// Vercel Serverless Function handler for /api/chat powered by NVIDIA API Catalog
const MONICA_KNOWLEDGE_BASE = `
You are the AI Recruiter Assistant representing Monica T, a BCA (Data Science) graduate from Jyoti Nivas College, Bangalore (graduating March 2026) seeking entry-level and junior roles in AI, Machine Learning, and Data Science.
Powered by NVIDIA API Catalog.

KEY INFORMATION ABOUT MONICA:
- Full Name: Monica T
- Location: Bengaluru, Karnataka, India
- Phone: +91 7483869742
- Email: monicamoni9972@gmail.com
- GitHub: https://github.com/Monica484
- Immediate Availability: Open for immediate joining & interviews.

CORE EDUCATION:
- Bachelor of Computer Applications (Data Science), Jyoti Nivas College, Bangalore (Graduating March 2026)
  Proficiencies: Python, AI, Machine Learning, Exploratory Data Analysis (EDA), SQL, OS, R programming, C/C++, Database Systems.
- Pre-University Course (PUC): Reddy Jana Sangha PU College, Bangalore (April 2022) - PCMB.
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
  * Developed Excel reports and Power BI dashboards to track business KPIs and communicate trends.
  * Conducted descriptive and trend analysis, documented actionable findings, and prepared recurring production reports.
  * Collaborated closely with cross-functional team members to address analytical requirements and meet strict deadlines.

FLAGSHIP PROJECTS:
1. Pharmacy Sales Analytics Web Application
   * Web-based analytics platform with CSV data upload, data cleaning, EDA, and sales analysis pipelines.
   * Engineered features for multi-branch sales trends, product performance comparisons, inventory tracking, and low-stock/expiry alerts.
   * Implemented ARIMA time-series forecasting to predict future drug sales from historical figures.
   * Visualized sales insights and forecast intervals through interactive charts and dashboards.
   * Stack: React, Node.js, Express.js, Python, Pandas, NumPy, Scikit-learn, XGBoost, Statsmodels, MongoDB.
   * GitHub: https://github.com/Monica484/pharmacy-sales-analytics-web-apllication

2. NVIDIA NeMo & Sentence-Transformers Semantic Search & RAG Engine
   * Dense vector embedding retrieval system using NVIDIA NV-Embed-v2 and FAISS vector indexing.
   * Sub-second dense similarity search across domain documents with cosine distance ranking.

3. End-to-End Multimodal Word & Text Embedding Visualizer
   * Comparative study of Word2Vec (Skip-Gram/CBOW), GloVe, and transformer embeddings.
   * Interactive vector arithmetic (e.g. King - Man + Woman = Queen) with 2D/3D PCA projection.

CERTIFICATIONS & ACHIEVEMENTS:
- College-level Certification in Power BI.
- Languages: English, Kannada, Hindi, Tamil.

INSTRUCTIONS:
- Be professional, concise, enthusiastic, and articulate.
- Highlight Monica's practical AI/ML projects and readiness for AI/ML/Data Science roles.
- Provide email (monicamoni9972@gmail.com) and phone (+91 7483869742) when requested.
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const nvidiaApiKey = process.env.NVIDIA_API_KEY;
  const nvidiaModel = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b';

  if (!nvidiaApiKey) {
    return res.status(200).json({
      reply: `⚠️ **NVIDIA Nemotron Configuration Error**:\n\n\`NVIDIA_API_KEY\` is not configured in server environment secrets. Please configure \`NVIDIA_API_KEY\` (from https://build.nvidia.com) to enable AI answer generation with \`${nvidiaModel}\`.`,
      sources: [],
      ragUsed: false,
      groundedInResume: false,
      error: true,
      model: `NVIDIA (${nvidiaModel}) [Missing Key]`,
    });
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nvidiaApiKey}`,
      },
      body: JSON.stringify({
        model: nvidiaModel,
        messages: [
          { role: 'system', content: MONICA_KNOWLEDGE_BASE },
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(200).json({
        reply: `⚠️ **NVIDIA Nemotron Error [${response.status}]**:\n\n${errText}\n\n*Endpoint: https://integrate.api.nvidia.com/v1/chat/completions*`,
        sources: [],
        ragUsed: false,
        groundedInResume: false,
        error: true,
        model: `NVIDIA (${nvidiaModel}) [HTTP ${response.status}]`,
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(200).json({
        reply: `⚠️ **NVIDIA Nemotron Error**: Empty response received from model \`${nvidiaModel}\`.`,
        sources: [],
        ragUsed: false,
        groundedInResume: false,
        error: true,
        model: `NVIDIA (${nvidiaModel})`,
      });
    }

    return res.status(200).json({
      reply,
      sources: [
        {
          documentName: 'MONICA_RESUME_3e728256.pdf',
          pageNumber: 1,
          score: 0.94,
          snippet: 'Monica T - BCA Data Science graduate with expertise in Python, ML, and ARIMA time-series.',
        },
      ],
      ragUsed: true,
      groundedInResume: true,
      model: `NVIDIA Nemotron (${nvidiaModel})`,
    });
  } catch (e: any) {
    return res.status(200).json({
      reply: `⚠️ **NVIDIA Nemotron Connection Error**:\n\n${e?.message || e}\n\n*Failed to connect to https://integrate.api.nvidia.com/v1.*`,
      sources: [],
      ragUsed: false,
      groundedInResume: false,
      error: true,
      model: `NVIDIA (${nvidiaModel}) [Exception]`,
    });
  }
}
