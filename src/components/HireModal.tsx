import React, { useState } from 'react';
import { X, Mail, Phone, FileDown, Calendar, Check, Copy, ExternalLink, Clock, MapPin, Sparkles } from 'lucide-react';
import { MONICA_PROFILE } from '../data/monicaData';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HireModal: React.FC<HireModalProps> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<string>('AI / ML Engineer');
  const [interviewDate, setInterviewDate] = useState<string>('2026-11-02');
  const [interviewTime, setInterviewTime] = useState<string>('11:00 AM IST');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [scheduledSuccess, setScheduledSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const recruiterSummarySnippet = `Candidate: Monica T
Role: Junior AI / ML Engineer & Data Scientist
Education: BCA (Data Science), Jyoti Nivas College, Bangalore (March 2026)
Key Experience: Data Analytics Intern @ Cynaris Solutions (2025)
Core Projects: Pharmacy Sales Analytics (ARIMA & XGBoost), NVIDIA NeMo Vector Search, Word Embedding Visualizer
Certifications: College-Level Power BI Certified
Location: Bengaluru, India (Open for immediate full-time / remote)
Email: monicamoni9972@gmail.com | Phone: +91 7483869742 | GitHub: github.com/Monica484`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(recruiterSummarySnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const generateIcsCalendarFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Monica T//Career Dashboard//EN
BEGIN:VEVENT
SUMMARY:Interview Screening with Monica T (${selectedRole})
DESCRIPTION:Screening interview with Monica T (BCA Data Science graduate). Email: monicamoni9972@gmail.com, Phone: +91 7483869742.
DTSTART:20261102T053000Z
DTEND:20261102T060000Z
LOCATION:Google Meet / Remote
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Interview_Monica_T.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setScheduledSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Hiring Fast-Track
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Connect & Hire Monica T
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Immediate availability for AI, Machine Learning, and Data Science roles in Bengaluru & Remote.
          </p>
        </div>

        {/* 1-Click Direct Channels Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`mailto:${MONICA_PROFILE.email}?subject=Interview%20Invitation%20for%20Monica%20T%20-%20${encodeURIComponent(selectedRole)}&body=Hi%20Monica,%0D%0A%0D%0AWe%20reviewed%20your%20portfolio%20and%20ARIMA%2FMachine%20Learning%20projects.%20We%20would%20love%20to%20schedule%20a%20screening%20conversation%20for%20a%20${encodeURIComponent(selectedRole)}%20position.`}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-900/60 bg-blue-950/25 hover:bg-blue-900/35 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Send Direct Email</div>
              <div className="text-[11px] text-slate-400 font-mono truncate">{MONICA_PROFILE.email}</div>
            </div>
          </a>

          <a
            href={`tel:${MONICA_PROFILE.phone}`}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-850 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Call / WhatsApp</div>
              <div className="text-[11px] text-slate-400 font-mono">{MONICA_PROFILE.phone}</div>
            </div>
          </a>
        </div>

        {/* Schedule Interview Widget */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Schedule Screening Conversation</span>
            </span>
            <span className="text-emerald-400 text-[11px] font-mono">Immediate Joining</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Position</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="AI / ML Engineer">Junior AI / ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Data Analyst / BI">Data Analyst / BI Specialist</option>
                <option value="NLP / Embedding Specialist">NLP & Vector Specialist</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Preferred Time Window</label>
              <select
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="11:00 AM IST">Morning: 11:00 AM IST</option>
                <option value="02:30 PM IST">Afternoon: 02:30 PM IST</option>
                <option value="05:00 PM IST">Evening: 05:00 PM IST</option>
              </select>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={generateIcsCalendarFile}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Download Calendar Invite (.ics)</span>
            </button>

            {scheduledSuccess && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Invite generated!
              </span>
            )}
          </div>
        </div>

        {/* ATS / Recruiter Brief Snippet */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">ATS & Hiring Manager Briefing</span>
            <button
              onClick={handleCopySnippet}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors text-[11px]"
            >
              {copiedSnippet ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Candidate Summary</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-2.5 rounded bg-slate-950 border border-slate-850 text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
            {recruiterSummarySnippet}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex items-center justify-between">
          <a
            href={MONICA_PROFILE.resumePdfUrl}
            download="MONICA_RESUME_3e728256.pdf"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-400" />
            <span>Download Official PDF Resume</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
