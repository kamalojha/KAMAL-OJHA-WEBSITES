import React, { useState, useMemo } from 'react';
import { ArrowRight, Play, CheckCircle2, Cpu, Globe, Database, Network, Eye } from 'lucide-react';
import { Project } from '../types/portfolio';
import { PROJECTS } from '../data/portfolioData';

interface Props {
  onSelectProject: (project: Project) => void;
}

export const ProjectsSection: React.FC<Props> = ({ onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ml_vision' | 'fullstack' | 'systems'>('all');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  // Clean SVG thumbnail illustrations for each project (Strict Zero-Broken-Image Policy)
  const renderProjectVisual = (project: Project) => {
    switch (project.demoType) {
      case 'xray':
        return (
          <div className="w-full h-44 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/30 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.01] transition-transform">
            <svg viewBox="0 0 300 160" className="w-full h-full opacity-80">
              <path d="M 150 10 L 150 150" stroke="#334155" strokeWidth="8" strokeDasharray="4 2" />
              <path d="M 70 30 Q 150 45 150 55" stroke="#475569" strokeWidth="4" fill="none" />
              <path d="M 230 30 Q 150 45 150 55" stroke="#475569" strokeWidth="4" fill="none" />
              <path d="M 140 70 Q 80 80 60 115" stroke="#334155" strokeWidth="3" fill="none" />
              <path d="M 160 70 Q 220 80 240 115" stroke="#334155" strokeWidth="3" fill="none" />
              <ellipse cx="200" cy="110" rx="30" ry="20" fill="#ef4444" opacity="0.35" />
              <circle cx="200" cy="110" r="12" fill="#f59e0b" opacity="0.6" />
            </svg>
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-400">
              ResNet50 · Grad-CAM Opacity Localization
            </div>
          </div>
        );
      case 'wheat':
        return (
          <div className="w-full h-44 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.01] transition-transform">
            <svg viewBox="0 0 300 160" className="w-full h-full opacity-80">
              <path d="M 20 130 C 80 100, 160 70, 280 40 C 230 80, 150 120, 40 145 Z" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
              <path d="M 90 110 L 140 95" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />
              <path d="M 150 90 L 210 70" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />
              <rect x="100" y="85" width="55" height="28" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245, 158, 11, 0.2)" rx="2" />
            </svg>
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-amber-400">
              OpenCV Preprocessing · Stripe Rust Detection
            </div>
          </div>
        );
      case 'pglife':
        return (
          <div className="w-full h-44 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.01] transition-transform">
            <svg viewBox="0 0 300 160" className="w-full h-full opacity-80">
              <rect x="30" y="25" width="240" height="110" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <rect x="45" y="40" width="70" height="80" rx="4" fill="#1e293b" />
              <line x1="130" y1="45" x2="250" y2="45" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
              <line x1="130" y1="65" x2="220" y2="65" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="130" y1="85" x2="190" y2="85" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <rect x="130" y="105" width="60" height="15" rx="3" fill="#6366f1" />
            </svg>
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-indigo-400">
              React Frontend · MySQL & MongoDB Hybrid
            </div>
          </div>
        );
      case 'network':
        return (
          <div className="w-full h-44 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.01] transition-transform">
            <svg viewBox="0 0 300 160" className="w-full h-full opacity-80">
              <line x1="50" y1="80" x2="150" y2="40" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="150" y1="40" x2="250" y2="80" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="50" y1="80" x2="150" y2="120" stroke="#475569" strokeWidth="1.5" />
              <line x1="150" y1="120" x2="250" y2="80" stroke="#475569" strokeWidth="1.5" />
              <circle cx="50" cy="80" r="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
              <circle cx="150" cy="40" r="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
              <circle cx="150" cy="120" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="250" cy="80" r="14" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-400">
              LARA Protocol · Multipath Load Balancing
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-44 bg-slate-900 flex items-center justify-center relative">
            <div className="text-xs font-mono text-slate-400">{project.title}</div>
          </div>
        );
    }
  };

  return (
    <section id="projects" className="py-20 border-t border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Title (No // comment headers) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
              Engineering Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              01. Featured Engineering Projects
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              End-to-end applications demonstrating machine learning inference, computer vision, full-stack architectures, and network protocols.
            </p>
          </div>

          {/* Interactive Filter Tabs (Segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Projects (6)
            </button>
            <button
              onClick={() => setActiveFilter('ml_vision')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'ml_vision'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Machine Learning & CV
            </button>
            <button
              onClick={() => setActiveFilter('fullstack')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'fullstack'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full-Stack Web
            </button>
            <button
              onClick={() => setActiveFilter('systems')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'systems'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Systems & Networks
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="border-b border-slate-800/80 cursor-pointer" onClick={() => onSelectProject(project)}>
                  {renderProjectVisual(project)}
                </div>

                <div className="p-5 space-y-3">
                  {/* Category & Title */}
                  <div>
                    <div className="text-[11px] font-mono text-blue-400">{project.categoryLabel}</div>
                    <h3
                      onClick={() => onSelectProject(project)}
                      className="text-lg font-bold text-white font-display mt-0.5 group-hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Tech Stack rendered with subtle unboxed typographic separators (Zero-pill discipline) */}
                  <div className="pt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span className="font-mono text-slate-300">{tech}</span>
                        {idx < Math.min(project.techStack.length, 4) - 1 && (
                          <span aria-hidden="true" className="text-slate-600">·</span>
                        )}
                      </React.Fragment>
                    ))}
                    {project.techStack.length > 4 && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="font-mono text-slate-500">+{project.techStack.length - 4}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  onClick={() => onSelectProject(project)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Deep Dive & Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {project.hasInteractiveDemo && (
                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-2.5 py-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 rounded-md hover:bg-emerald-900/40 transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-emerald-400" />
                    <span>Run Demo</span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
