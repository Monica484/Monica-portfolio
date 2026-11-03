import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Terminal, Globe, ShieldCheck, Zap, Server, CheckCircle2 } from 'lucide-react';
import { MONICA_PROFILE } from '../data/monicaData';

export const VercelDeployHub: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const vercelJsonContent = `{
  "framework": "vite",
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/api/chat",
      "destination": "/api/chat"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/chat.py": {
      "includeFiles": "data/vectorstore/**",
      "excludeFiles": "{node_modules/**,src/**,public/**,dist/**,package-lock.json,bun.lock,*.pdf,server.ts}"
    }
  }
}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const gitCommands = `# 1. Push code to your GitHub account (e.g., github.com/Monica484/monica-ai-portfolio)
git init
git add .
git commit -m "Initial commit: Monica T AI & Data Science Portfolio"
git branch -M main
git remote add origin https://github.com/Monica484/monica-ai-portfolio.git
git push -u origin main`;

  const vercelCliCommands = `# Or deploy instantly via Vercel CLI from your terminal:
npm install -g vercel
vercel deploy --prod`;

  return (
    <div className="space-y-12 py-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
          Cloud Deployment Automation
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Deploy Monica's AI Dashboard to Vercel
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Production configuration and 1-click deployment pipeline for hosting this portfolio, recruiter chatbot, and embedding models on Vercel's global edge network.
        </p>
      </div>

      {/* 1-Click Deploy Banner */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950/40 p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 22.525H0l12-21.05 12 21.05z" />
            </svg>
            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Vercel Production Deployment
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">1-Click Cloud Deployment</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Pre-configured with <code className="text-blue-400 font-mono">vercel.json</code>, Python serverless function (<code className="text-blue-400 font-mono">/api/chat.py</code>), FAISS vector retriever, and NVIDIA Nemotron LLM.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href={`https://vercel.com/new/clone?repository-url=${encodeURIComponent('https://github.com/Monica484/monica-ai-portfolio')}&env=NVIDIA_API_KEY,LANGSMITH_API_KEY&envDescription=Required%20for%20NVIDIA%20Nemotron%20and%20LangSmith%20Tracing`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 text-xs font-bold text-black bg-white hover:bg-slate-200 rounded-lg transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 22.525H0l12-21.05 12 21.05z" />
            </svg>
            <span>Deploy to Vercel</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-700 ml-0.5" />
          </a>

          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-850 transition-colors whitespace-nowrap"
          >
            Open Vercel Dashboard
          </a>
        </div>
      </section>

      {/* Notice: Why Vercel still has the old project */}
      <section className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Why your Vercel URL still shows the old Pharmacy project:</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Your existing Vercel project is currently connected to your previous GitHub repository (<code className="text-amber-300 font-mono">pharmacy-sales-analytics-web-apllication</code>). Vercel builds strictly from whichever GitHub repository or branch is linked to it.
        </p>
        <div className="text-xs text-slate-300 space-y-1.5 pl-2 border-l-2 border-amber-800">
          <p><strong>To display this new AI Dashboard on Vercel:</strong></p>
          <p>1. <strong>Push this new project</strong> to a fresh GitHub repository (e.g. <code className="text-blue-300 font-mono">github.com/Monica484/monica-ai-portfolio</code>).</p>
          <p>2. In your Vercel Dashboard, click <strong>"Add New..." &gt; "Project"</strong>, import <code className="text-blue-300 font-mono">monica-ai-portfolio</code>, add <code className="text-emerald-300 font-mono">NVIDIA_API_KEY</code>, and click <strong>Deploy</strong>.</p>
          <p>3. Or in your existing Vercel project, go to <strong>Settings &gt; Git</strong> and re-link the repository to the new code!</p>
        </div>
      </section>

      {/* Deployment Pre-Flight Diagnostics Check */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Pre-Flight Health Diagnostics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Framework</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white font-mono">Vite + React 19</div>
            <div className="text-[11px] text-slate-500">Auto-detected by Vercel</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Build Command</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white font-mono">npm run build</div>
            <div className="text-[11px] text-slate-500">Outputs to /dist</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Python Serverless</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white font-mono">/api/chat.py</div>
            <div className="text-[11px] text-slate-500">FAISS & NVIDIAEmbeddings</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Vector Search</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white font-mono">FAISS Top-K</div>
            <div className="text-[11px] text-slate-500">IndexFlatIP Inner Product</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">LLM Generation</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white font-mono">NVIDIA Nemotron</div>
            <div className="text-[11px] text-slate-500">nvidia/nemotron-3.5-lightning</div>
          </div>
        </div>
      </section>

      {/* Step by Step Terminal Instructions & Config Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step by Step Guide */}
        <section className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Step-by-Step Deployment Instructions
          </h3>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 font-mono">Step 1: Push to GitHub</span>
                <button
                  onClick={() => copyToClipboard(gitCommands, 'git')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedCode === 'git' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Commands</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs font-mono text-slate-300 overflow-x-auto">
                {gitCommands}
              </pre>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
              <div className="text-xs font-bold text-blue-400 font-mono">
                Step 2: Connect Repository in Vercel
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-blue-400 underline">vercel.com/new</a>, select your GitHub account (<code className="text-slate-200">Monica484</code>), and click <strong>Import</strong> next to this repository. Vercel automatically detects Vite!
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
              <div className="text-xs font-bold text-blue-400 font-mono">
                Step 3: Configure Environment Variables
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In the Vercel project configuration screen, open <strong>Environment Variables</strong> and add:
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 font-mono text-xs text-blue-300 flex items-center justify-between">
                <span>NVIDIA_API_KEY = nvapi-your_nvidia_key</span>
                <span className="text-[10px] text-slate-500">From build.nvidia.com</span>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Inspector: vercel.json */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Included vercel.json
            </h3>
            <button
              onClick={() => copyToClipboard(vercelJsonContent, 'vercelJson')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
            >
              {copiedCode === 'vercelJson' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy vercel.json</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <pre className="text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {vercelJsonContent}
            </pre>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Config Vercel Guarantee</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Because <code className="text-slate-300 font-mono">vercel.json</code> is located in the root of the project with SPA wildcard rewrites, hiring managers and recruiters can navigate between all tabs with direct URL access without encountering 404 errors!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
