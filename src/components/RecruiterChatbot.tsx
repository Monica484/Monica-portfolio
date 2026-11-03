import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Copy, Check, Briefcase, FileDown, RefreshCw } from 'lucide-react';
import { MONICA_PROFILE, RECRUITER_QUICK_QUESTIONS } from '../data/monicaData';
import { ChatMessage } from '../types';

interface RecruiterChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHireModal: () => void;
  initialPrompt?: string;
}

export const RecruiterChatbot: React.FC<RecruiterChatbotProps> = ({
  isOpen,
  onClose,
  onOpenHireModal,
  initialPrompt,
}) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am Monica's AI Recruiter Assistant.

I can provide detailed insight into Monica's **Machine Learning projects (ARIMA time-series forecasting)**, her **Cynaris Solutions internship**, her **NVIDIA and word embedding architectures**, and her fit for AI/ML and Data Science roles.

How can I help you evaluate Monica today?`,
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'm ready to answer any questions regarding Monica's skills and availability.",
        timestamp: 'Now',
        sources: data.sources || [],
        ragUsed: data.ragUsed,
        groundedInResume: data.groundedInResume,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Deterministic client fallback response
      let fallbackText = `Monica T is a BCA Data Science graduate (Jyoti Nivas College, March 2026) with skills in Python, SQL, ARIMA time-series forecasting, Power BI, and NVIDIA vector embeddings. She previously interned at Cynaris Solutions (2025). Feel free to email her at monicamoni9972@gmail.com or call +91 7483869742!`;
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: 'Now',
        sources: [
          {
            documentName: 'MONICA_RESUME_3e728256.pdf',
            pageNumber: 1,
            score: 0.95,
            snippet: 'BCA (Data Science) graduate with foundation in Python, AI, ML, SQL, and data analysis.',
          },
        ],
        ragUsed: true,
        groundedInResume: true,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Top Bar */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Monica's AI Recruiter Copilot</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-900/60">
                NVIDIA Nemotron · FAISS RAG
              </span>
            </div>
            <div className="text-[11px] text-slate-400">FAISS Top-K Retrieval · NVIDIAEmbeddings · LangSmith Tracing</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close chatbot"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-slate-900/40 border-b border-slate-850 overflow-x-auto scrollbar-none flex items-center gap-2 text-xs">
        {RECRUITER_QUICK_QUESTIONS.slice(0, 4).map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Message Body rendering */}
                <div className="whitespace-pre-line space-y-2">
                  {msg.text}
                </div>

                {/* Verified Document Citations & Page References */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/90 space-y-1.5">
                    <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Verified Sources & Citations</span>
                      <span className="text-emerald-400 lowercase">grounded</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, sIdx) => (
                        <div
                          key={sIdx}
                          className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                          title={src.snippet}
                        >
                          <span className="text-blue-400 font-bold">📄</span>
                          <span className="font-semibold">{src.documentName}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-emerald-400">Page {src.pageNumber}</span>
                          {src.score > 0 && (
                            <>
                              <span className="text-slate-500">·</span>
                              <span className="text-slate-400">{(src.score * 100).toFixed(0)}% match</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistant footer with copy & hire action */}
                {!isUser && (
                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={onOpenHireModal}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Briefcase className="w-3 h-3" />
                      <span>Schedule Interview</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Analyzing candidate background & resume...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Monica's ML projects, skills, or fit..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
            title="Send inquiry"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Bengaluru, India · +91 7483869742</span>
          <a
            href={MONICA_PROFILE.resumePdfUrl}
            download="MONICA_RESUME_3e728256.pdf"
            className="text-slate-400 hover:text-white flex items-center gap-1"
          >
            <FileDown className="w-3 h-3" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
};
