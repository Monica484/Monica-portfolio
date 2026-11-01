import React, { useState } from 'react';
import { FileDown, ExternalLink, Award, BookOpen, Briefcase, CheckCircle2, Eye, User, Globe2 } from 'lucide-react';
import { MONICA_PROFILE, EXPERIENCE_DATA, EDUCATION_DATA, TECHNICAL_SKILLS } from '../data/monicaData';

interface ResumeExperienceProps {
  onOpenHireModal: () => void;
}

export const ResumeExperience: React.FC<ResumeExperienceProps> = ({ onOpenHireModal }) => {
  const [showPdfEmbed, setShowPdfEmbed] = useState<boolean>(false);

  return (
    <div className="space-y-12 py-6">
      {/* Header with 1-click Download */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Official Credentials & Verification
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Resume & Professional Experience
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verified resume information for Monica T, BCA Data Science graduate.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowPdfEmbed(!showPdfEmbed)}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPdfEmbed ? 'Hide PDF Preview' : 'Preview Official PDF'}</span>
          </button>

          <a
            href={MONICA_PROFILE.resumePdfUrl}
            download="MONICA_RESUME_3e728256.pdf"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </a>
        </div>
      </div>

      {/* PDF Embed / Preview Container if toggled */}
      {showPdfEmbed && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">Document: /assets/aistudio/MONICA_RESUME_3e728256.pdf</span>
            <a
              href={MONICA_PROFILE.resumePdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Open in new tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="w-full h-[600px] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
            <iframe
              src={MONICA_PROFILE.resumePdfUrl}
              title="Monica T Resume Preview"
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Professional Summary Callout */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
          Professional Profile
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed">
          BCA (Data Science) graduate with a foundation in Python, artificial intelligence, machine learning, SQL, and data analysis. Built a Pharmacy Sales Analytics Web Application that brings together data preprocessing, exploratory analysis, sales forecasting using a python-based ML model. Gained industry internship experience in data analytics at Cynaris Solutions. Eager to contribute programming and analytical skills to practical AI/ML solutions while continuing to develop technical expertise.
        </p>
      </div>

      {/* Work Experience Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-lg font-bold text-white">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <span>Work Experience</span>
        </div>

        <div className="space-y-4">
          {EXPERIENCE_DATA.map((exp, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <div className="text-xs text-blue-400 font-medium">
                    {exp.company} · {exp.location}
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {exp.period} · {exp.type}
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                {exp.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold mt-0.5">·</span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-850">
                {exp.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Skill Matrix */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-lg font-bold text-white">
          <Award className="w-5 h-5 text-blue-400" />
          <span>Technical Skills</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TECHNICAL_SKILLS.map((grp) => (
            <div
              key={grp.group}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3"
            >
              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {grp.group}
              </h4>
              <div className="flex flex-wrap gap-2">
                {grp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-750"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Achievements Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Education Timeline */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Education</span>
          </div>

          <div className="space-y-4">
            {EDUCATION_DATA.map((edu, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                    <div className="text-xs text-blue-400">
                      {edu.institution} · {edu.location}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                    {edu.period}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{edu.details}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {edu.courses.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-850"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications, Languages & Personal Details */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <Award className="w-5 h-5 text-blue-400" />
            <span>Achievements & Details</span>
          </div>

          {/* Power BI Certification Card */}
          <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Certified Credential
              </span>
              <span className="text-xs text-emerald-400 font-mono">Verified</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              College-Level Certification in Power BI
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Demonstrated core competencies in data visualization, ETL workflows, KPI tracking, and interactive dashboard development.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 pt-1">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Automated Excel reporting reducing manual reconciliation effort.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Built interactive Power BI dashboards for operational monitoring.</span>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Languages</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MONICA_PROFILE.languages.map((lang) => (
                <span
                  key={lang}
                  className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/80 font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Personal Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Personal Details</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Date of Birth</span>
                <span className="text-slate-200 font-mono">{MONICA_PROFILE.birthDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Location</span>
                <span className="text-slate-200">{MONICA_PROFILE.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Nationality</span>
                <span className="text-slate-200">{MONICA_PROFILE.nationality}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Availability</span>
                <span className="text-emerald-400 font-semibold">{MONICA_PROFILE.availability}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          Want to discuss interview scheduling or immediate joining?
        </div>
        <button
          onClick={onOpenHireModal}
          className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap"
        >
          Fast-Track Interview Request
        </button>
      </div>
    </div>
  );
};
