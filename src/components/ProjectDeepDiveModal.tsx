import React, { useState } from 'react';
import { X, ExternalLink, Code2, Layers, CheckCircle2, Copy, Check } from 'lucide-react';
import { Project } from '../types/portfolio';
import { XRaySimulator } from './simulators/XRaySimulator';
import { WheatDiseaseSimulator } from './simulators/WheatDiseaseSimulator';
import { PGLifeSimulator } from './simulators/PGLifeSimulator';
import { NetworkBalanceSimulator } from './simulators/NetworkBalanceSimulator';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDeepDiveModal: React.FC<Props> = ({ project, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'simulator' | 'code'>('simulator');

  if (!project) return null;

  const handleCopyCode = () => {
    if (project.architectureDetails.codeSnippet) {
      navigator.clipboard.writeText(project.architectureDetails.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-900/60">
          <div>
            <div className="text-xs font-mono text-blue-400 mb-1">{project.categoryLabel}</div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">{project.title}</h3>
            {/* Tech Stack rendered as clean unboxed text with subtle typographic separators */}
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 mt-2">
              {project.techStack.map((tech, idx) => (
                <React.Fragment key={tech}>
                  <span className="text-slate-300 font-mono">{tech}</span>
                  {idx < project.techStack.length - 1 && <span aria-hidden="true" className="text-slate-600">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Segmented buttons) */}
        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-800/60 flex items-center gap-2 bg-slate-950">
          {project.hasInteractiveDemo && (
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Interactive Simulator
            </button>
          )}

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            System Architecture
          </button>

          {project.architectureDetails.codeSnippet && (
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Source Excerpt
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'simulator' && project.hasInteractiveDemo && (
            <div className="space-y-4">
              {project.demoType === 'xray' && <XRaySimulator />}
              {project.demoType === 'wheat' && <WheatDiseaseSimulator />}
              {project.demoType === 'pglife' && <PGLifeSimulator />}
              {project.demoType === 'network' && <NetworkBalanceSimulator />}
              {project.demoType === 'timeentry' && (
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs space-y-3">
                  <div className="font-semibold text-white text-sm">Corporate Attendance & Task Ledger Demo</div>
                  <p>
                    Django REST framework backend paired with asynchronous JavaScript clock timers. Enforces transactional database constraints preventing overlapping shift logs across employee rosters.
                  </p>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-2">
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-400">Total Logged</div>
                      <div className="text-emerald-400 font-bold mt-1">42.5 hrs / week</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-400">Billable Ratio</div>
                      <div className="text-blue-400 font-bold mt-1">94.2%</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-400">Approval State</div>
                      <div className="text-amber-400 font-bold mt-1">Manager Signed</div>
                    </div>
                  </div>
                </div>
              )}
              {project.demoType === 'library' && (
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs space-y-3">
                  <div className="font-semibold text-white text-sm">Library Circulation Engine & Fine Calculator</div>
                  <p>
                    Python & Tkinter desktop architecture utilizing SQLite3 / MySQL with foreign key cascading constraints. Automatically calculates overdue days and applies incremental penalties upon return.
                  </p>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-2">
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-400">Catalog Size</div>
                      <div className="text-white font-bold mt-1">2,400+ Titles</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-400">Circulation Rate</div>
                      <div className="text-emerald-400 font-bold mt-1">Instant ACID commit</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <div className="text-slate-400">Fine Grace Period</div>
                      <div className="text-blue-400 font-bold mt-1">14 Calendar Days</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono text-slate-400">
                  Engineering Overview
                </h4>
                <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
                  {project.architectureDetails.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl">
                  <span className="text-xs font-mono text-amber-400 block font-semibold mb-1">
                    Technical Bottleneck & Challenge
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.architectureDetails.keyChallenge}
                  </p>
                </div>

                <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl">
                  <span className="text-xs font-mono text-emerald-400 block font-semibold mb-1">
                    Algorithmic Solution & Design Pattern
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.architectureDetails.solution}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <span className="text-xs font-mono text-blue-400 block font-semibold mb-1">
                  Measurable Impact & Validation
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {project.architectureDetails.impact}
                </p>
              </div>

              {/* Verified Highlights from resume */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-400 mb-2">
                  Key Resume Accomplishments
                </h4>
                <ul className="space-y-2">
                  {project.bulletPoints.map((bp, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'code' && project.architectureDetails.codeSnippet && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {project.architectureDetails.codeSnippet.filename} ({project.architectureDetails.codeSnippet.language})
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{project.architectureDetails.codeSnippet.code}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <span className="text-xs text-slate-400">
            Author: <strong className="text-slate-200">Kamal Ojha</strong> · B.E. Computer Science Engineering
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Deep Dive
          </button>
        </div>
      </div>
    </div>
  );
};
