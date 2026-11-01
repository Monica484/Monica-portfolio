import React, { useState } from 'react';
import { Github, ExternalLink, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Sliders, Database, Cpu, Code2 } from 'lucide-react';
import { PROJECTS_DATA, MONICA_PROFILE } from '../data/monicaData';

interface ProjectsShowcaseProps {
  onOpenChatWithPrompt: (prompt: string) => void;
  setActiveTab: (tab: string) => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({
  onOpenChatWithPrompt,
  setActiveTab,
}) => {
  // Interactive ARIMA Simulator State
  const [selectedDrug, setSelectedDrug] = useState<'amox' | 'para' | 'cet'>('amox');
  const [horizon, setHorizon] = useState<number>(30);
  const [arimaOrder, setArimaOrder] = useState<string>('ARIMA(1,1,1)');

  const drugData = {
    amox: {
      name: 'Amoxicillin 500mg (Antibiotic)',
      baseDemand: 450,
      volatility: 0.12,
      reorderPoint: 300,
      currentStock: 340,
      trend: '+14% MoM',
      mape: '4.8%',
      history: [380, 410, 400, 435, 420, 460, 450, 475, 490, 470, 510, 530],
    },
    para: {
      name: 'Paracetamol 650mg (Analgesic)',
      baseDemand: 820,
      volatility: 0.08,
      reorderPoint: 600,
      currentStock: 920,
      trend: '+6% MoM',
      mape: '3.6%',
      history: [750, 780, 790, 810, 800, 830, 840, 860, 850, 880, 890, 915],
    },
    cet: {
      name: 'Cetirizine 10mg (Antihistamine)',
      baseDemand: 280,
      volatility: 0.18,
      reorderPoint: 200,
      currentStock: 190,
      trend: '+22% Seasonal',
      mape: '5.2%',
      history: [210, 225, 230, 240, 260, 290, 310, 330, 320, 350, 380, 410],
    },
  };

  const activeDrug = drugData[selectedDrug];

  // Generate forecast points based on ARIMA calculation simulation
  const lastHistorical = activeDrug.history[activeDrug.history.length - 1];
  const forecastCount = horizon === 7 ? 4 : horizon === 14 ? 6 : horizon === 30 ? 8 : 12;
  const forecastPoints = Array.from({ length: forecastCount }).map((_, i) => {
    const growth = 1 + (i + 1) * 0.02;
    const center = Math.round(lastHistorical * growth);
    const spread = Math.round(center * 0.07 * Math.sqrt(i + 1));
    return {
      day: `Wk ${i + 1}`,
      expected: center,
      upper: center + spread,
      lower: Math.max(0, center - spread),
    };
  });

  const totalForecastDemand = forecastPoints.reduce((acc, p) => acc + p.expected, 0);
  const isReorderNeeded = activeDrug.currentStock < (activeDrug.reorderPoint + (totalForecastDemand / forecastCount));

  return (
    <div className="space-y-16 py-6">
      {/* Section Header */}
      <div>
        <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
          Production Architecture & Projects
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Machine Learning & Data Science Portfolio
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Real implementations demonstrating end-to-end data pipeline construction: from raw data ingestion and exploratory analysis to predictive time-series models and high-dimensional vector representations.
        </p>
      </div>

      {/* Flagship Project 1: Pharmacy Sales Analytics Web Application */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="text-xs font-mono text-blue-400">Time-Series Machine Learning · Full-Stack</div>
            <h2 className="text-2xl font-bold text-white">
              Pharmacy Sales Analytics Web Application
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              End-to-end inventory forecasting and branch analytics web platform utilizing ARIMA time-series models, XGBoost, and automated CSV data ingestion pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://github.com/Monica484/pharmacy-sales-analytics-web-apllication"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>

            <button
              onClick={() => onOpenChatWithPrompt('Explain the ARIMA mathematics and Python libraries Monica used in Pharmacy Sales Analytics')}
              className="px-4 py-2 text-xs font-medium text-blue-400 hover:text-white bg-blue-950/40 border border-blue-900/60 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Explain Architecture</span>
            </button>
          </div>
        </div>

        {/* Interactive ARIMA Live Model Simulator */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">
                Live ARIMA Time-Series Forecasting Simulator
              </span>
            </div>

            {/* Model & Drug Selectors */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Drug Product:</span>
              <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => setSelectedDrug('amox')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedDrug === 'amox' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Amoxicillin
                </button>
                <button
                  onClick={() => setSelectedDrug('para')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedDrug === 'para' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Paracetamol
                </button>
                <button
                  onClick={() => setSelectedDrug('cet')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedDrug === 'cet' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cetirizine
                </button>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
                <span className="text-slate-500">Horizon:</span>
                <select
                  value={horizon}
                  onChange={(e) => setHorizon(Number(e.target.value))}
                  className="bg-transparent text-white font-mono focus:outline-none"
                >
                  <option value={7} className="bg-slate-900">7 Days</option>
                  <option value={14} className="bg-slate-900">14 Days</option>
                  <option value={30} className="bg-slate-900">30 Days</option>
                  <option value={90} className="bg-slate-900">90 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Forecast KPI Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-900/60 border border-slate-850">
            <div>
              <div className="text-xs text-slate-400">Current In-Stock</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {activeDrug.currentStock} units
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Forecast Demand ({horizon}d)</div>
              <div className="text-lg font-bold text-blue-400 font-mono tabular-nums">
                {totalForecastDemand} units
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">ARIMA MAPE Error</div>
              <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                {activeDrug.mape} (High Accuracy)
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Inventory Status</div>
              <div className={`text-sm font-semibold flex items-center gap-1.5 mt-0.5 ${
                isReorderNeeded ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {isReorderNeeded ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Reorder Triggered</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Optimal Safety Buffer</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interactive SVG Chart: Historical vs ARIMA Forecast */}
          <div className="relative pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono">{activeDrug.name} — Demand Curve</span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block" /> Historical
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-blue-500 inline-block" /> ARIMA Forecast
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-red-400 border border-dashed border-red-400 inline-block" /> Reorder Point ({activeDrug.reorderPoint})
                </span>
              </div>
            </div>

            <div className="h-48 w-full bg-slate-900/40 rounded-lg p-2 border border-slate-850 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160">
                {/* Horizontal gridlines */}
                <line x1="0" y1="20" x2="700" y2="20" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="60" x2="700" y2="60" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="#334155" opacity="0.6" />

                {/* Reorder safety threshold line */}
                <line
                  x1="0"
                  y1={160 - (activeDrug.reorderPoint / 1000) * 140}
                  x2="700"
                  y2={160 - (activeDrug.reorderPoint / 1000) * 140}
                  stroke="#f87171"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />

                {/* Historical line points (first 350px) */}
                {(() => {
                  const points = activeDrug.history.map((val, idx) => {
                    const x = (idx / (activeDrug.history.length - 1)) * 340;
                    const y = 160 - (val / 1000) * 140;
                    return `${x},${y}`;
                  }).join(' ');

                  // Forecast line points (350px to 700px)
                  const lastX = 340;
                  const lastY = 160 - (lastHistorical / 1000) * 140;
                  const fPoints = `${lastX},${lastY} ` + forecastPoints.map((p, idx) => {
                    const x = 340 + ((idx + 1) / forecastPoints.length) * 350;
                    const y = 160 - (p.expected / 1000) * 140;
                    return `${x},${y}`;
                  }).join(' ');

                  // Confidence ribbon polygon
                  const upperPts = forecastPoints.map((p, idx) => {
                    const x = 340 + ((idx + 1) / forecastPoints.length) * 350;
                    const y = 160 - (p.upper / 1000) * 140;
                    return `${x},${y}`;
                  });
                  const lowerPts = [...forecastPoints].reverse().map((p, idx) => {
                    const origIdx = forecastPoints.length - 1 - idx;
                    const x = 340 + ((origIdx + 1) / forecastPoints.length) * 350;
                    const y = 160 - (p.lower / 1000) * 140;
                    return `${x},${y}`;
                  });
                  const ribbon = `${lastX},${lastY} ` + upperPts.join(' ') + ' ' + lowerPts.join(' ');

                  return (
                    <>
                      {/* 95% Confidence Band */}
                      <polygon points={ribbon} fill="#3b82f6" fillOpacity="0.12" />
                      {/* Historical curve */}
                      <polyline points={points} fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                      {/* Forecast curve */}
                      <polyline points={fPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 3" />
                      {/* Boundary divider line */}
                      <line x1="340" y1="0" x2="340" y2="160" stroke="#60a5fa" strokeDasharray="2 2" strokeWidth="1" />
                    </>
                  );
                })()}
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
              <span>Past 12 Months (Historical)</span>
              <span>Today</span>
              <span>Next {horizon} Days (ARIMA Forecast Interval)</span>
            </div>
          </div>
        </div>

        {/* Feature Bullets & Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>Data Pipeline & Analytical Deliverables</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span><strong>Automated Ingestion</strong>: CSV upload with statistical schema validation, missing value imputation, and anomaly elimination.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span><strong>ARIMA Forecasting</strong>: Automated grid search for autoregressive order $p$, differencing $d$, and moving average $q$ parameters via AIC/BIC criteria.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span><strong>Multi-Branch Visibility</strong>: Cross-store product comparisons, revenue velocity analysis, and inventory reorder alerts.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Full-Stack & Machine Learning Technologies</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {PROJECTS_DATA[0].techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-750"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 pt-1 leading-relaxed">
              Modular Python ML scripts coupled with Express.js REST API endpoints and dynamic React visualization views for real-time manager decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Projects 2 & 3: NVIDIA Dense Semantic Search & Word Embedding Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project 2: NVIDIA NeMo RAG */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono text-blue-400">NLP & Dense Vector Embeddings</div>
            <h3 className="text-xl font-bold text-white">
              NVIDIA NeMo & Sentence-Transformers Semantic Search
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              High-throughput dense semantic document retrieval pipeline using NVIDIA NV-Embed-v2 (4096-dimensional embeddings) and FAISS vector indices for sub-second retrieval.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span>Asymmetric query-document dense embeddings with cosine similarity reranking.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span>72.4 MTEB retrieval benchmark score with 32k context token support.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span>Integrated into the live Embedding Studio on this portfolio dashboard!</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Python', 'NVIDIA NeMo', 'NV-Embed-v2', 'FAISS', 'PyTorch', 'LangChain'].map((t) => (
                <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('embeddings')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
            >
              <span>Test NVIDIA Embeddings in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-500 font-mono">4096 Dims</span>
          </div>
        </div>

        {/* Project 3: Word Embedding Visualizer */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono text-blue-400">Deep Learning & Distributional Semantics</div>
            <h3 className="text-xl font-bold text-white">
              End-to-End Multimodal Word & Text Embedding Visualizer
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interactive mathematical laboratory comparing Word2Vec (Skip-Gram/CBOW), GloVe, and transformer models with linear vector arithmetic and 2D/3D PCA projection.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span>Vector algebra demonstration: <code>King - Man + Woman = Queen</code>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span>Live PCA dimensionality reduction mapped onto an interactive 2D coordinate canvas.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span>Vocabulary cluster discovery across Data Science, ML, and Analytics domains.</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Word2Vec', 'GloVe', 'BERT', 'PCA', 'Scikit-learn', 'NumPy', 'React'].map((t) => (
                <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('embeddings')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
            >
              <span>Explore Word Vectors & 2D PCA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-500 font-mono">PCA Projection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
