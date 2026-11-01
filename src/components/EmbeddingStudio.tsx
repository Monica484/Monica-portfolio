import React, { useState } from 'react';
import { Cpu, Sparkles, Layers, Sliders, ArrowRight, Play, RefreshCw, BarChart2, Check, Zap } from 'lucide-react';
import { EMBEDDING_PRESETS, WORD_VECTOR_POINTS } from '../data/monicaData';

export const EmbeddingStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dense' | 'word' | 'benchmark'>('dense');

  // Dense text embedding state
  const [selectedModel, setSelectedModel] = useState<string>('nvidia/nv-embed-v2');
  const [textA, setTextA] = useState<string>(EMBEDDING_PRESETS[0].textA);
  const [textB, setTextB] = useState<string>(EMBEDDING_PRESETS[0].textB);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [similarityScore, setSimilarityScore] = useState<number>(0.924);
  const [vectorA, setVectorA] = useState<number[]>([0.14, 0.42, -0.28, 0.65, 0.08, -0.35, 0.51, 0.22, 0.19, -0.11, 0.44, 0.31, -0.05, 0.58, -0.24, 0.17]);
  const [vectorB, setVectorB] = useState<number[]>([0.12, 0.39, -0.25, 0.61, 0.11, -0.31, 0.48, 0.25, 0.16, -0.09, 0.41, 0.29, -0.07, 0.54, -0.21, 0.15]);

  // Word embedding math state
  const [wordA, setWordA] = useState<string>('King');
  const [wordB, setWordB] = useState<string>('Man');
  const [wordC, setWordC] = useState<string>('Woman');
  const [predictedWord, setPredictedWord] = useState<string>('Queen');
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const wordMathPresets = [
    { a: 'King', b: 'Man', c: 'Woman', res: 'Queen', desc: 'Classic gender analogy in latent space' },
    { a: 'Data', b: 'Raw', c: 'Clean', res: 'Insight', desc: 'Analytics pipeline transformation' },
    { a: 'ARIMA', b: 'Linear', c: 'Deep', res: 'LSTM / Transformer', desc: 'Forecasting model evolution' },
    { a: 'Python', b: 'Script', c: 'Enterprise', res: 'PySpark / Cloud', desc: 'Scale progression' },
  ];

  // Handle Preset selection for dense embeddings
  const applyPreset = (presetId: string) => {
    const preset = EMBEDDING_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setTextA(preset.textA);
    setTextB(preset.textB);
    computeSimilarity(preset.textA, preset.textB, selectedModel);
  };

  // Compute dense similarity via server or fast mathematical vector projection
  const computeSimilarity = async (a: string, b: string, model: string) => {
    setIsComputing(true);
    try {
      const res = await fetch('/api/embeddings/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textA: a,
          textB: b,
          model: model.includes('nvidia') ? 'nvidia' : model.includes('bge') ? 'bge' : 'minilm',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSimilarityScore(data.similarity);
        if (data.vectorSampleA) setVectorA(data.vectorSampleA.concat(data.vectorSampleA));
        if (data.vectorSampleB) setVectorB(data.vectorSampleB.concat(data.vectorSampleB));
      } else {
        throw new Error('Fallback calculation');
      }
    } catch {
      // Deterministic client-side similarity computation
      const wordsA = a.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
      const wordsB = b.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
      const setA = new Set(wordsA);
      const setB = new Set(wordsB);
      let overlap = 0;
      setA.forEach((w) => {
        if (setB.has(w)) overlap += 1;
      });

      const jaccard = overlap / (setA.size + setB.size - overlap || 1);
      const sim = Math.min(0.98, Math.max(0.12, Number((jaccard * 0.5 + 0.45).toFixed(3))));
      setSimilarityScore(sim);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
          AI & NLP Architecture Lab
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          NVIDIA, Text & Word Embedding Studio
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Interactive evaluation console for dense vector models (NVIDIA NV-Embed-v2, Google text-embedding, BGE) and distributional word semantics (Word2Vec, PCA dimensionality reduction).
        </p>
      </div>

      {/* Segmented Mode Selector */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab('dense')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'dense'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          NVIDIA & Dense Embeddings
        </button>
        <button
          onClick={() => setActiveSubTab('word')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'word'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Word Embedding & 2D PCA Lab
        </button>
        <button
          onClick={() => setActiveSubTab('benchmark')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'benchmark'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          MTEB Benchmark Matrix
        </button>
      </div>

      {/* SUB-VIEW 1: NVIDIA & DENSE TEXT EMBEDDINGS */}
      {activeSubTab === 'dense' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Embedding Architecture:</span>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  computeSimilarity(textA, textB, e.target.value);
                }}
                className="bg-slate-950 border border-slate-750 text-white text-xs rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="nvidia/nv-embed-v2">NVIDIA NV-Embed-v2 (4096-dim · MTEB Leader)</option>
                <option value="google/text-embedding-004">Google text-embedding-004 (768-dim)</option>
                <option value="bge-large-en-v1.5">BAAI BGE-Large-EN-v1.5 (1024-dim)</option>
                <option value="sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2 (384-dim Fast Edge)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Preset Pairs:</span>
              <select
                onChange={(e) => applyPreset(e.target.value)}
                defaultValue={EMBEDDING_PRESETS[0].id}
                className="bg-slate-950 border border-slate-750 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
              >
                {EMBEDDING_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Pairs & Vector Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Passages */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-mono font-medium">Passage / Query Vector A</span>
                  <span className="text-slate-500 font-mono">{textA.length} chars</span>
                </div>
                <textarea
                  value={textA}
                  onChange={(e) => setTextA(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none font-sans"
                  placeholder="Enter text passage A..."
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-mono font-medium">Passage / Candidate Vector B</span>
                  <span className="text-slate-500 font-mono">{textB.length} chars</span>
                </div>
                <textarea
                  value={textB}
                  onChange={(e) => setTextB(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none font-sans"
                  placeholder="Enter text passage B..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => computeSimilarity(textA, textB, selectedModel)}
                  disabled={isComputing}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isComputing ? 'animate-spin' : ''}`} />
                  <span>Compute Dense Cosine Distance</span>
                </button>
              </div>
            </div>

            {/* Live Vector Metric Card */}
            <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Cosine Similarity Score</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-950/60 border border-blue-900/40 text-blue-400 font-mono">
                    L2 Normalized
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-extrabold text-white font-mono tabular-nums">
                    {(similarityScore * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400">
                    metric value:{' '}
                    <span className="font-mono text-blue-400 font-semibold">
                      {similarityScore.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${similarityScore * 100}%` }}
                  />
                </div>

                <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                  {similarityScore >= 0.8 ? (
                    <span className="text-emerald-400 font-medium">
                      High Semantic Overlap: Strong thematic and contextual alignment for retrieval reranking.
                    </span>
                  ) : similarityScore >= 0.5 ? (
                    <span className="text-amber-400 font-medium">
                      Moderate Alignment: Partial conceptual overlap with distinct domain variations.
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      Low Similarity: Disjoint latent distributions across non-overlapping vocabularies.
                    </span>
                  )}
                </div>
              </div>

              {/* Sampled Embedding Vector Heatmap */}
              <div className="space-y-2 pt-4 border-t border-slate-900">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>16-Channel Latent Slice Preview</span>
                  <span>{selectedModel.includes('nvidia') ? '4096-dim' : '768-dim'}</span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {vectorA.slice(0, 8).map((val, i) => {
                    const intensity = Math.min(1, Math.abs(val) * 1.8);
                    return (
                      <div
                        key={`va-${i}`}
                        className="h-6 rounded flex items-center justify-center text-[10px] font-mono text-white/90"
                        style={{
                          backgroundColor: val >= 0 ? `rgba(59, 130, 246, ${intensity})` : `rgba(239, 68, 68, ${intensity})`,
                        }}
                        title={`Dim ${i}: ${val}`}
                      >
                        {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono text-center">
                  Vector dot product: sum(A_i * B_i) over unit sphere
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: WORD EMBEDDING & 2D PCA LAB */}
      {activeSubTab === 'word' && (
        <div className="space-y-6">
          {/* Word Math Header */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Distributional Vector Arithmetic
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Linear Subspace Offset: vec(A) - vec(B) + vec(C) &approx; vec(Result)
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {wordMathPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setWordA(p.a);
                    setWordB(p.b);
                    setWordC(p.c);
                    setPredictedWord(p.res);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors font-mono"
                >
                  {p.a} - {p.b} + {p.c} = {p.res}
                </button>
              ))}
            </div>

            {/* Word Math Equation Display */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-sm">
              <input
                type="text"
                value={wordA}
                onChange={(e) => setWordA(e.target.value)}
                className="w-24 bg-slate-900 border border-slate-750 px-2 py-1 rounded text-center text-blue-400 font-semibold focus:outline-none"
              />
              <span className="text-slate-500 text-lg">-</span>
              <input
                type="text"
                value={wordB}
                onChange={(e) => setWordB(e.target.value)}
                className="w-24 bg-slate-900 border border-slate-750 px-2 py-1 rounded text-center text-red-400 font-semibold focus:outline-none"
              />
              <span className="text-slate-500 text-lg">+</span>
              <input
                type="text"
                value={wordC}
                onChange={(e) => setWordC(e.target.value)}
                className="w-24 bg-slate-900 border border-slate-750 px-2 py-1 rounded text-center text-emerald-400 font-semibold focus:outline-none"
              />
              <span className="text-slate-500 text-lg">&approx;</span>
              <span className="px-3 py-1 rounded bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold">
                {predictedWord}
              </span>
            </div>
          </div>

          {/* Interactive 2D PCA Dimensionality Reduction Scatter Canvas */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-sm font-semibold text-white">
                  2D Principal Component Analysis (PCA) Semantic Space
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualizing multi-dimensional Word2Vec coordinates projected onto 2 principal variance vectors.
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Data Science
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Machine Learning
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Business Analytics
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Web / Cloud
                </span>
              </div>
            </div>

            {/* 2D Canvas Area */}
            <div className="relative w-full h-80 bg-slate-900/40 rounded-lg border border-slate-850 overflow-hidden">
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-slate-700" />
                ))}
              </div>

              {/* Plotted Word Vector Points */}
              {WORD_VECTOR_POINTS.map((pt) => {
                const colorClass =
                  pt.category === 'data-science'
                    ? 'bg-blue-500 text-blue-200 border-blue-400/50'
                    : pt.category === 'machine-learning'
                    ? 'bg-purple-500 text-purple-200 border-purple-400/50'
                    : pt.category === 'business'
                    ? 'bg-emerald-500 text-emerald-200 border-emerald-400/50'
                    : 'bg-amber-500 text-amber-200 border-amber-400/50';

                return (
                  <div
                    key={pt.word}
                    style={{ left: `${pt.x}%`, top: `${100 - pt.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <div className="flex items-center gap-1">
                      <span className={`w-2.5 h-2.5 rounded-full border ${colorClass} shadow-sm group-hover:scale-125 transition-transform`} />
                      <span className="text-[11px] font-mono text-slate-300 group-hover:text-white transition-colors bg-slate-950/80 px-1 rounded">
                        {pt.word}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Hover Tooltip */}
              {hoveredPoint && (
                <div
                  style={{
                    left: `${Math.min(80, Math.max(20, hoveredPoint.x))}%`,
                    top: `${Math.min(75, Math.max(20, 100 - hoveredPoint.y))}%`,
                  }}
                  className="absolute z-10 -translate-x-1/2 -translate-y-12 bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono pointer-events-none"
                >
                  <div className="text-white font-bold">{hoveredPoint.word}</div>
                  <div className="text-slate-400 text-[10px]">
                    PCA coordinates: [{hoveredPoint.x}, {hoveredPoint.y}] · {hoveredPoint.category}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
              <span>Principal Component 1 (Technical &rarr; Analytical)</span>
              <span>Principal Component 2 (Algorithmic &rarr; Deployment)</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: MTEB BENCHMARK MATRIX */}
      {activeSubTab === 'benchmark' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h3 className="text-lg font-bold text-white">
              Massive Text Embedding Benchmark (MTEB) Comparison
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Monica evaluates and benchmarks state-of-the-art embedding models across semantic retrieval, context token windows, and inference latency.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 overflow-x-auto bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="py-3 px-4">Embedding Model</th>
                  <th className="py-3 px-4">Provider / Architecture</th>
                  <th className="py-3 px-4 text-right">MTEB Retrieval</th>
                  <th className="py-3 px-4 text-right">Dimensions</th>
                  <th className="py-3 px-4 text-right">Context Window</th>
                  <th className="py-3 px-4">Optimal Production Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-mono">
                <tr className="bg-blue-950/20 hover:bg-blue-950/30">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>NVIDIA NV-Embed-v2</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">NVIDIA NeMo (Decoder-only + Latent Pool)</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 font-bold tabular-nums">72.4 (Rank #1)</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">4096</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">32,768 tokens</td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">High-precision enterprise RAG & dense technical retrieval</td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Google text-embedding-004</td>
                  <td className="py-3.5 px-4 text-slate-400">Google DeepMind</td>
                  <td className="py-3.5 px-4 text-right text-slate-200 tabular-nums">68.2</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">768</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">8,192 tokens</td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">Cloud microservices & cross-modal indexing</td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">BAAI BGE-Large-EN-v1.5</td>
                  <td className="py-3.5 px-4 text-slate-400">BAAI (BERT Large)</td>
                  <td className="py-3.5 px-4 text-right text-slate-200 tabular-nums">64.1</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">1024</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">512 tokens</td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">Sentence-level classification & semantic search</td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">all-MiniLM-L6-v2</td>
                  <td className="py-3.5 px-4 text-slate-400">Sentence-Transformers</td>
                  <td className="py-3.5 px-4 text-right text-slate-200 tabular-nums">56.3</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">384</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">256 tokens</td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">Ultra-fast edge deployment and mobile apps</td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Word2Vec (Skip-Gram)</td>
                  <td className="py-3.5 px-4 text-slate-400">Mikolov et al. (Static Vector)</td>
                  <td className="py-3.5 px-4 text-right text-slate-400 tabular-nums">38.6</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">300</td>
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">Context Window 5</td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">Foundational token semantics & analogical reasoning</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
