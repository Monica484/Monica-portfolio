import React, { useState } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { HeroOverview } from './components/HeroOverview';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { EmbeddingStudio } from './components/EmbeddingStudio';
import { ResumeExperience } from './components/ResumeExperience';
import { VercelDeployHub } from './components/VercelDeployHub';
import { RecruiterChatbot } from './components/RecruiterChatbot';
import { HireModal } from './components/HireModal';
import { MONICA_PROFILE } from './data/monicaData';
import { Github, Mail, Phone, MapPin, MessageSquare, Briefcase } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isHireModalOpen, setIsHireModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string>('');

  const handleOpenChatWithPrompt = (prompt: string) => {
    setInitialChatPrompt(prompt);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHireModal={() => setIsHireModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <HeroOverview
            onOpenHireModal={() => setIsHireModalOpen(true)}
            onOpenChatWithPrompt={handleOpenChatWithPrompt}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsShowcase
            onOpenChatWithPrompt={handleOpenChatWithPrompt}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'embeddings' && <EmbeddingStudio />}

        {activeTab === 'resume' && (
          <ResumeExperience onOpenHireModal={() => setIsHireModalOpen(true)} />
        )}

        {activeTab === 'vercel' && <VercelDeployHub />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-bold text-slate-300">{MONICA_PROFILE.name}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>BCA (Data Science) Graduate</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>Bengaluru, India</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('vercel')}
              className="hover:text-blue-400 transition-colors"
            >
              Vercel Deployment
            </button>
            <a
              href={MONICA_PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={`mailto:${MONICA_PROFILE.email}`}
              className="hover:text-white transition-colors"
            >
              {MONICA_PROFILE.email}
            </a>
            <button
              onClick={() => setIsHireModalOpen(true)}
              className="text-blue-400 font-semibold hover:underline"
            >
              Hire Monica
            </button>
          </div>
        </div>
      </footer>

      {/* AI Recruiter Chatbot Drawer */}
      <RecruiterChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenHireModal={() => {
          setIsChatOpen(false);
          setIsHireModalOpen(true);
        }}
        initialPrompt={initialChatPrompt}
      />

      {/* Fast-Track Hire Modal */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />

      {/* Persistent Floating Chat Trigger (when closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
          title="Ask Monica's AI Recruiter Assistant"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask AI Recruiter</span>
        </button>
      )}
    </div>
  );
}
