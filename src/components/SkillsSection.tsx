import React, { useState } from 'react';
import { Search, Code2, Cpu, Globe, Database, Server, Check } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = SKILL_CATEGORIES.map((category) => {
    if (!searchQuery.trim()) return category;
    const q = searchQuery.toLowerCase();
    const filteredSkills = category.skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.level.toLowerCase().includes(q) ||
        s.usedIn.some((u) => u.toLowerCase().includes(q))
    );
    return { ...category, skills: filteredSkills };
  }).filter((category) => category.skills.length > 0);

  const getCategoryIcon = (title: string) => {
    switch (title) {
      case 'Programming Languages':
        return <Code2 className="w-5 h-5 text-blue-400" />;
      case 'Machine Learning & Vision':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Frameworks & Libraries':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'Web & Databases':
        return <Database className="w-5 h-5 text-amber-400" />;
      default:
        return <Server className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 border-t border-slate-800/80 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
              Core Competencies
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              02. Technical Capabilities & Stack
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Languages, deep learning frameworks, databases, and systems engineered across academic research and full-stack projects.
            </p>
          </div>

          {/* Search / Filter Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill (e.g. Python, Keras)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.title}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    {getCategoryIcon(category.title)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 mb-4 leading-relaxed">
                  {category.description}
                </p>

                {/* Skills List (Zero-Pill: Clean unboxed list with typographic metadata) */}
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/70 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white font-mono">{skill.name}</span>
                        <span className="text-slate-400 font-medium text-[11px]">{skill.level}</span>
                      </div>

                      {/* Applied in project context */}
                      <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-x-1.5">
                        <span className="text-slate-400">Used in:</span>
                        {skill.usedIn.map((item, idx) => (
                          <React.Fragment key={item}>
                            <span className="text-blue-300/80">{item}</span>
                            {idx < skill.usedIn.length - 1 && <span aria-hidden="true" className="text-slate-600">·</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
