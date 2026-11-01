import React from 'react';
import { MessageSquare, Sparkles, FileDown, Briefcase } from 'lucide-react';
import { MONICA_PROFILE } from '../data/monicaData';

interface TopNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHireModal: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenHireModal,
  onToggleChat,
  isChatOpen,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'embeddings', label: 'Embedding Studio' },
    { id: 'resume', label: 'Resume & Experience' },
    { id: 'vercel', label: 'Deploy to Vercel' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no clutter) */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-baseline gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
            {MONICA_PROFILE.name}
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 font-medium whitespace-nowrap">
            · AI & Data Science
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean text links with hover styling */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary CTA action + AI Chatbot Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleChat}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              isChatOpen
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
            } whitespace-nowrap shrink-0`}
            title="Ask Monica's AI Recruiter Assistant"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">AI Recruiter</span>
          </button>

          <button
            onClick={onOpenHireModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hire Monica</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-850 gap-4 text-xs font-medium text-slate-400 bg-slate-950/95 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap shrink-0 py-1 ${
              activeTab === item.id ? 'text-blue-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
