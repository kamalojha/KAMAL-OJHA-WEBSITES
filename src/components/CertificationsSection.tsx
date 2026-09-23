import React from 'react';
import { Award, Cloud, Cpu, Radio, Trophy, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';

export const CertificationsSection: React.FC = () => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'cloud':
        return <Cloud className="w-5 h-5 text-amber-400" />;
      case 'software':
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case 'ai':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'networking':
        return <Radio className="w-5 h-5 text-emerald-400" />;
      case 'hackathon':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      default:
        return <Award className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section id="certifications" className="py-20 border-t border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
            Verified Credentials & Accolades
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            05. Certifications & Industry Recognition
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Industry cloud architect validation, corporate simulations with Goldman Sachs, and nationwide hackathon hacker honors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                    {getIcon(cert.category)}
                  </div>
                  {cert.date && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      {cert.date}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-white font-display">
                    {cert.title}
                  </h3>
                  <div className="text-xs text-blue-400 font-semibold mt-1">
                    {cert.issuer}
                  </div>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Credential
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
