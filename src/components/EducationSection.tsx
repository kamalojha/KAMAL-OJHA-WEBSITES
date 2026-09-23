import React from 'react';
import { GraduationCap, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { EDUCATION } from '../data/portfolioData';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-20 border-t border-slate-800/80 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
            Academic Pedigree
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            04. Education & Academic Background
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Computer science engineering degrees with strong analytical grounding in algorithms, operating systems, and neural computation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUCATION.map((edu, idx) => (
            <div
              key={edu.institution}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="p-2.5 bg-blue-950/40 border border-blue-800/40 rounded-xl text-blue-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                    {edu.period}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-white font-display leading-snug">
                    {edu.degree}
                  </h3>
                  <div className="text-sm text-blue-400 font-semibold mt-1">
                    {edu.institution}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{edu.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
                  {edu.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
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
