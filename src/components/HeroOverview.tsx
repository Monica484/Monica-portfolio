import React from 'react';
import { FileDown, Briefcase, MessageSquare, ExternalLink, ArrowRight, CheckCircle2, MapPin, Mail, Phone, Github } from 'lucide-react';
import { MONICA_PROFILE, PROJECTS_DATA } from '../data/monicaData';

interface HeroOverviewProps {
  onOpenHireModal: () => void;
  onOpenChatWithPrompt: (prompt: string) => void;
  setActiveTab: (tab: string) => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  onOpenHireModal,
  onOpenChatWithPrompt,
  setActiveTab,
}) => {
  return (
    <div className="space-y-16 py-8">
      {/* 2-Column Split Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Left Column: Typographic Hierarchy & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Data Science & Machine Learning Engineer
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
            Predictive Time-Series, Dense Embeddings & Production Analytics.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Hi, I'm <strong className="text-white font-semibold">{MONICA_PROFILE.name}</strong>, a BCA (Data Science) graduate from <span className="text-slate-100">Jyoti Nivas College, Bangalore</span>. Built an end-to-end Pharmacy Sales ARIMA forecasting engine and completed an industry analytics internship at <span className="text-slate-100">Cynaris Solutions</span>. Ready to build high-impact AI/ML and data solutions.
          </p>

          {/* Quick Contact & Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Bengaluru, Karnataka, India</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <a href={`mailto:${MONICA_PROFILE.email}`} className="hover:text-blue-400 transition-colors">
                {MONICA_PROFILE.email}
              </a>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <a href={`tel:${MONICA_PROFILE.phone}`} className="hover:text-blue-400 transition-colors">
                {MONICA_PROFILE.phone}
              </a>
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenHireModal}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap"
            >
              <Briefcase className="w-4 h-4" />
              <span>Hire Monica (Immediate)</span>
            </button>

            <a
              href={MONICA_PROFILE.resumePdfUrl}
              download="MONICA_RESUME_AI_DATA_SCIENCE.pdf"
              className="px-5 py-2.5 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <FileDown className="w-4 h-4 text-slate-400" />
              <span>Download Resume (PDF)</span>
            </a>

            <button
              onClick={() => onOpenChatWithPrompt('Why should we hire Monica for a Data Science role?')}
              className="px-4 py-2.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 border border-blue-900/60 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask AI Recruiter</span>
            </button>
          </div>

          {/* Quick recruiter question pills */}
          <div className="pt-2">
            <div className="text-xs text-slate-400 mb-2 font-medium">Frequently asked by hiring managers:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onOpenChatWithPrompt('Explain her Pharmacy Sales ARIMA project in detail')}
                className="text-xs px-3 py-1.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
              >
                Pharmacy ARIMA Model &rarr;
              </button>
              <button
                onClick={() => onOpenChatWithPrompt('What did she do at Cynaris Solutions internship?')}
                className="text-xs px-3 py-1.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
              >
                Cynaris Internship Impact &rarr;
              </button>
              <button
                onClick={() => onOpenChatWithPrompt('How do her NVIDIA & text embedding models work?')}
                className="text-xs px-3 py-1.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
              >
                NVIDIA Embedding Architecture &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Monica Portrait & Candidate Snapshot */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-sm">
            <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-5">
              <img
                src="/src/assets/images/monica_portrait_1793185123213.jpg"
                alt="Monica T - AI and Data Science Professional"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                style={{ display: 'none' }}
                className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 font-bold text-2xl mb-3">
                  MT
                </div>
                <div className="text-lg font-bold text-white">Monica T</div>
                <div className="text-xs text-slate-400 mt-1">BCA Data Science Graduate</div>
              </div>
            </div>

            {/* Verification & Candidate Quick Badges */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                <span className="text-slate-400">Education</span>
                <span className="text-slate-200 font-medium">BCA Data Science · Jyoti Nivas College</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                <span className="text-slate-400">Industry Experience</span>
                <span className="text-slate-200 font-medium">Cynaris Solutions (Internship)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                <span className="text-slate-400">Certification</span>
                <span className="text-blue-400 font-medium">Power BI Certified (College-Level)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-400">Notice Period</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Immediate Available
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <a
                href={MONICA_PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>github.com/Monica484</span>
              </a>
              <span className="text-xs text-slate-500 font-mono">Bangalore 560095</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Metric Strip Below Hero Split */}
      <section className="border-y border-slate-800/90 py-8 bg-slate-900/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="space-y-1 sm:pl-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              94.2%
            </div>
            <div className="text-xs text-slate-400 font-medium">
              ARIMA Sales Forecast Accuracy
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-6">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              4096-Dim
            </div>
            <div className="text-xs text-slate-400 font-medium">
              NVIDIA NV-Embed Dense Retrieval
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-6">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              2025
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Cynaris Solutions Industry Internship
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-6">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tabular-nums">
              Day 1
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Ready to Join Full-Time / Remote
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview Bento */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase">Selected Work</div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Core Machine Learning & AI Implementations</h2>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS_DATA.map((proj) => (
            <div
              key={proj.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-slate-700 transition-all hover:bg-slate-900/80 group"
            >
              <div className="space-y-3">
                <div className="text-xs text-blue-400 font-medium">{proj.category}</div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {proj.tagline}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.techStack.length > 4 && (
                    <span className="text-[11px] font-mono px-1.5 py-0.5 text-slate-500">
                      +{proj.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab(proj.id === 'word-vector-lab' ? 'embeddings' : 'projects')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-white transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Immediate Hire Banner */}
      <section className="rounded-2xl border border-blue-900/50 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold text-white">Looking for an AI, ML, or Data Science Contributor?</h3>
          <p className="text-sm text-slate-300 max-w-xl">
            Monica is based in Bengaluru with immediate joining availability, hands-on experience in time-series forecasting, EDA pipelines, and modern vector embeddings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenHireModal}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-md shadow-blue-500/25 whitespace-nowrap"
          >
            Schedule Interview
          </button>
          <a
            href={`mailto:${MONICA_PROFILE.email}?subject=Interview%20Invitation%20for%20Monica%20T`}
            className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-850 transition-colors whitespace-nowrap"
          >
            Direct Email
          </a>
        </div>
      </section>
    </div>
  );
};
