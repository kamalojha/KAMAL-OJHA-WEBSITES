import React from 'react';
import { Briefcase, Award, HeartHandshake, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-20 border-t border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
            Career & Practical Training
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            03. Internships & Professional Training
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Practical development internships, enterprise certifications with IBM and Punjab University, and community leadership programs.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-slate-800 ml-3 sm:ml-6 space-y-10 pl-6 sm:pl-8">
          {EXPERIENCES.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 group-hover:scale-125 transition-transform" />

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      {item.role}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                      <span className="text-blue-400 font-semibold">{item.organization}</span>
                      {item.location && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {item.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700/80 self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.year}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Key Learnings */}
                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Key Accomplishments & Skills Acquired
                  </div>
                  <ul className="space-y-1.5">
                    {item.keyLearnings.map((learning, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{learning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
