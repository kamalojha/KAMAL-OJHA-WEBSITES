import React from 'react';
import { ArrowUp, Mail, Phone, Linkedin, Heart } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-white font-bold font-display text-sm">
            Kamal Ojha
          </div>
          <p className="text-slate-400 mt-0.5">
            Software & Machine Learning Engineer · Greater Noida, Uttar Pradesh, India
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#skills" className="hover:text-white transition-colors">
            Skills
          </a>
          <a href="#experience" className="hover:text-white transition-colors">
            Experience
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
          <button
            onClick={scrollToTop}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition-colors flex items-center gap-1"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">Top</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <span>
          © {new Date().getFullYear()} Kamal Ojha. All engineering rights reserved.
        </span>
        <div className="flex items-center gap-3">
          <span>{PERSONAL_INFO.email}</span>
          <span aria-hidden="true">·</span>
          <span>{PERSONAL_INFO.phone}</span>
        </div>
      </div>
    </footer>
  );
};
