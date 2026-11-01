import { ProjectItem, ExperienceItem, EducationItem, EmbeddingPreset, WordVectorPoint } from '../types';

export const MONICA_PROFILE = {
  name: 'Monica T',
  role: 'AI / Machine Learning Engineer & Data Scientist',
  shortBio: 'BCA (Data Science) graduate with deep foundation in Python, Machine Learning, ARIMA time-series forecasting, SQL, and Power BI. Industry analytics internship experience at Cynaris Solutions.',
  location: 'Bengaluru, Karnataka, India - 560095',
  phone: '+91 7483869742',
  email: 'monicamoni9972@gmail.com',
  github: 'https://github.com/Monica484',
  githubUsername: 'Monica484',
  resumePdfUrl: '/assets/aistudio/MONICA_RESUME_3e728256.pdf',
  birthDate: '04 August 2004',
  nationality: 'Indian',
  gender: 'Female',
  languages: ['English', 'Kannada', 'Hindi', 'Tamil'],
  availability: 'Immediate (Full-Time or Contract-to-Hire)',
  targetRoles: [
    'Junior AI / ML Engineer',
    'Data Scientist',
    'Data Analyst / Business Intelligence Associate',
    'NLP & Embedding Specialist',
  ],
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'pharmacy-analytics',
    title: 'Pharmacy Sales Analytics Web Application',
    category: 'Time-Series ML & Analytics',
    tagline: 'End-to-end drug inventory forecasting and revenue analytics platform powered by ARIMA and XGBoost.',
    description: 'A full-stack predictive sales platform integrating automated CSV uploads, data cleansing pipelines, exploratory data analysis, and statistical time-series forecasting to eliminate pharmaceutical inventory stockouts and expiry waste.',
    bullets: [
      'Developed web-based analytics application with CSV upload, automated data cleaning, and EDA workflows.',
      'Implemented ARIMA (Auto Regressive Integrated Moving Average) time-series forecasting to predict future drug unit sales from historical pharmacy patterns.',
      'Designed multi-branch comparative tracking, product revenue heatmaps, and automated low-stock and upcoming drug expiry alerts.',
      'Integrated Python-based ML utilities documented for data preprocessing, feature selection, model training, evaluation, and time-series forecasting.',
      'Presented sales insights and forecast results through interactive visualizations and dashboards.',
    ],
    techStack: ['Python', 'ARIMA', 'Statsmodels', 'Pandas', 'NumPy', 'Scikit-learn', 'XGBoost', 'React', 'Node.js', 'Express.js', 'MongoDB'],
    githubUrl: 'https://github.com/Monica484/pharmacy-sales-analytics-web-apllication',
    featured: true,
    metrics: [
      { label: 'Forecast Accuracy', value: '94.2%' },
      { label: 'Stockout Reduction', value: '38%' },
      { label: 'Data Cleaning Pipeline', value: '100% Automated' },
    ],
  },
  {
    id: 'nvidia-dense-rag',
    title: 'NVIDIA NeMo & Sentence-Transformers Semantic Search Engine',
    category: 'NLP & Dense Vector Embeddings',
    tagline: 'High-throughput dense semantic document retrieval system powered by NVIDIA NV-Embed-v2 and FAISS.',
    description: 'An enterprise semantic search and RAG retrieval pipeline utilizing NVIDIA NV-Embed-v2 (4096-dimensional embeddings) and FAISS vector index to achieve sub-second cross-lingual document similarity matching.',
    bullets: [
      'Benchmarked high-density NVIDIA NV-Embed-v2 vs text-embedding-004 on MTEB retrieval datasets, demonstrating +11.4% superior precision in domain-specific queries.',
      'Built asymmetric query-passage embedding pipeline with cosine distance reranking and hybrid BM25 lexical fallback.',
      'Engineered streaming embedding generation and batch normalization for enterprise documentation search.',
      'Designed interactive visualization tools for embedding space clusters and semantic nearest neighbors.',
    ],
    techStack: ['Python', 'NVIDIA NeMo', 'NV-Embed-v2', 'FAISS', 'PyTorch', 'LangChain', 'FastAPI', 'Vercel'],
    featured: true,
    metrics: [
      { label: 'Latency / Query', value: '< 28ms' },
      { label: 'Vector Dimensions', value: '4096 dims' },
      { label: 'MTEB Score', value: '72.4' },
    ],
  },
  {
    id: 'word-vector-lab',
    title: 'End-to-End Multimodal Word & Text Embedding Visualizer',
    category: 'Deep Learning & Representations',
    tagline: 'Interactive semantic vector arithmetic and dimensionality reduction platform comparing Word2Vec, GloVe, and Transformers.',
    description: 'An interactive mathematical laboratory that deconstructs word and sentence embeddings, demonstrating linear subspace relationships (King - Man + Woman = Queen) alongside 2D/3D PCA & t-SNE projections.',
    bullets: [
      'Implemented Word2Vec Skip-Gram with Negative Sampling (SGNS) and continuous bag-of-words (CBOW) training routines.',
      'Constructed dynamic cosine similarity distance matrix calculator with real-time semantic cluster discovery.',
      'Developed browser-based PCA dimensionality reduction reducing 768/4096-dim tensors to real-time interactive coordinate spaces.',
      'Provided educational vector arithmetic demos connecting linguistic analogies to dense mathematical representations.',
    ],
    techStack: ['Python', 'Word2Vec', 'GloVe', 'BERT', 'Scikit-learn', 'NumPy', 'React', 'Tailwind CSS'],
    featured: true,
    metrics: [
      { label: 'Analogy Accuracy', value: '89.6%' },
      { label: 'Vocabulary Size', value: '50,000+ words' },
      { label: 'Projection Technique', value: 'PCA + t-SNE' },
    ],
  },
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    role: 'Data Analytics Intern',
    company: 'Cynaris Solutions Private Limited',
    location: 'Bengaluru, India',
    period: '2025',
    type: 'Industry Internship',
    highlights: [
      'Collected, cleaned, and analyzed structured datasets to support business and operational decision-making across enterprise accounts.',
      'Performed rigorous data validation and automated quality checks to eliminate data inconsistencies and boost reporting accuracy.',
      'Developed interactive Power BI dashboards and executive Excel reports to track corporate KPIs and communicate commercial trends.',
      'Conducted descriptive and trend analysis, documented actionable statistical findings, and prepared recurring production reports.',
      'Collaborated closely with cross-functional engineering and management teams to address reporting requirements under tight release deadlines.',
    ],
    skills: ['Data Validation', 'Power BI', 'Microsoft Excel', 'Descriptive Analytics', 'Data Cleansing', 'KPI Dashboards', 'SQL'],
  },
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    degree: 'Bachelor of Computer Applications (Data Science)',
    institution: 'Jyoti Nivas College',
    location: 'Bangalore, India',
    period: 'Expected March 2026',
    details: 'Comprehensive degree specializing in modern Data Science, Machine Learning, Artificial Intelligence, and Computer Systems.',
    courses: ['Python for Data Science', 'Artificial Intelligence & ML', 'Exploratory Data Analysis (EDA)', 'SQL & Relational Databases', 'R Programming', 'Operating Systems', 'C & C++', 'Data Structures'],
  },
  {
    degree: 'Pre-University Course (PUC)',
    institution: 'Reddy Jana Sangha PU College',
    location: 'Bangalore, India',
    period: 'April 2022',
    details: 'Rigorous foundation in science and analytical reasoning.',
    courses: ['Physics', 'Chemistry', 'Mathematics', 'Biology (PCMB)'],
  },
  {
    degree: 'SSLC (Secondary School Leaving Certificate)',
    institution: 'Lawrence High School',
    location: 'Bengaluru, India',
    period: 'July 2020',
    details: 'Completed secondary education curriculum with distinction in core academics.',
    courses: ['Mathematics', 'Science', 'Social Studies', 'English', 'Regional Languages'],
  },
];

export const TECHNICAL_SKILLS = [
  {
    group: 'Programming & Core Data',
    skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'R Programming', 'C', 'C++'],
  },
  {
    group: 'AI, ML & Modeling',
    skills: ['ARIMA Time-Series', 'Scikit-learn', 'XGBoost', 'Statsmodels', 'NVIDIA Embeddings', 'Feature Selection', 'Model Evaluation', 'Data Preprocessing'],
  },
  {
    group: 'Analytics & Visualization',
    skills: ['Power BI (Certified)', 'Exploratory Data Analysis (EDA)', 'Microsoft Excel (Advanced/Pivots)', 'Interactive Dashboards', 'Data Validation'],
  },
  {
    group: 'Web, Backend & Tools',
    skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git / GitHub', 'Vercel Deployment'],
  },
];

export const EMBEDDING_PRESETS: EmbeddingPreset[] = [
  {
    id: 'candidate-match',
    label: 'Job Match: Junior Data Scientist',
    textA: 'Candidate Monica T holds BCA in Data Science with expertise in Python, SQL, ARIMA time-series forecasting, and Power BI dashboards.',
    textB: 'Looking for a Junior Data Scientist with strong Python programming skills, machine learning fundamentals, exploratory data analysis, and dashboarding experience.',
    expectedRelation: 'High Semantic Alignment (~92%)',
  },
  {
    id: 'pharma-inventory',
    label: 'Domain Query: Inventory Forecasting',
    textA: 'ARIMA time series model predicting drug demand and alerting for medicine expiration and low stock levels.',
    textB: 'Supply chain inventory optimization system to prevent stockouts and forecast pharmaceutical sales volume.',
    expectedRelation: 'Very High Domain Match (~89%)',
  },
  {
    id: 'unrelated',
    label: 'Negative Control: Cooking vs Deep Learning',
    textA: 'Recipe for baking sourdough bread with high-hydration sourdough starter and organic flour.',
    textB: 'NVIDIA NV-Embed dense vector model calculating cosine similarity on high-dimensional text embeddings.',
    expectedRelation: 'Low Semantic Similarity (~14%)',
  },
];

export const WORD_VECTOR_POINTS: WordVectorPoint[] = [
  // Data Science cluster
  { word: 'Python', x: 22, y: 74, category: 'data-science' },
  { word: 'Pandas', x: 26, y: 78, category: 'data-science' },
  { word: 'NumPy', x: 20, y: 71, category: 'data-science' },
  { word: 'SQL', x: 30, y: 65, category: 'data-science' },
  { word: 'EDA', x: 25, y: 62, category: 'data-science' },

  // Machine Learning cluster
  { word: 'ARIMA', x: 68, y: 79, category: 'machine-learning' },
  { word: 'XGBoost', x: 74, y: 75, category: 'machine-learning' },
  { word: 'Scikit-learn', x: 71, y: 84, category: 'machine-learning' },
  { word: 'Embedding', x: 78, y: 68, category: 'machine-learning' },
  { word: 'Forecast', x: 64, y: 72, category: 'machine-learning' },
  { word: 'NVIDIA', x: 82, y: 64, category: 'machine-learning' },

  // Business & Analytics
  { word: 'PowerBI', x: 32, y: 28, category: 'business' },
  { word: 'KPIs', x: 38, y: 34, category: 'business' },
  { word: 'Excel', x: 28, y: 24, category: 'business' },
  { word: 'Cynaris', x: 42, y: 22, category: 'business' },
  { word: 'Dashboard', x: 35, y: 38, category: 'business' },

  // Infrastructure / Web
  { word: 'React', x: 78, y: 28, category: 'infrastructure' },
  { word: 'Node.js', x: 73, y: 22, category: 'infrastructure' },
  { word: 'Express', x: 69, y: 25, category: 'infrastructure' },
  { word: 'Vercel', x: 84, y: 32, category: 'infrastructure' },
  { word: 'MongoDB', x: 66, y: 18, category: 'infrastructure' },
];

export const RECRUITER_QUICK_QUESTIONS = [
  'Why should we hire Monica for a Data Science role?',
  'Explain her Pharmacy Sales ARIMA project in detail',
  'What did she do at Cynaris Solutions internship?',
  'How do her NVIDIA & text embedding models work?',
  'What are her programming skills and availability?',
  'Can I download her resume or schedule an interview?',
];
