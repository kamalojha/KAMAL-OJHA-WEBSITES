import React, { useState } from 'react';
import { FileText, Mail, Menu, X, CreditCard } from 'lucide-react';

interface Props {
  onOpenResume: () => void;
  onOpenContact: () => void;
  onOpenPayment?: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenResume, onOpenContact, onOpenPayment }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <a
          href="#home"
          className="text-lg font-bold tracking-tight text-white font-display hover:text-blue-400 transition-colors"
        >
          Kamal Ojha
        </a>

        {/* Zone 2: Clean 4–6 nav links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
          <a href="#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#skills" className="hover:text-white transition-colors">
            Skills
          </a>
          <a href="#experience" className="hover:text-white transition-colors">
            Experience
          </a>
          <a href="#endorsements" className="hover:text-white transition-colors">
            Endorsements
          </a>
          <a href="#consulting" className="hover:text-white transition-colors flex items-center gap-1 text-blue-400 font-semibold">
            <span>🇮🇳 Pay & Book (INR)</span>
          </a>
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onOpenPayment && (
            <button
              onClick={onOpenPayment}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
              title="Razorpay & Paytm Gateways"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>Razorpay / Paytm</span>
            </button>
          )}
          <button
            onClick={onOpenResume}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </button>
          <button
            onClick={onOpenContact}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean, under 15% sticky height constraint) */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-slate-300">
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Projects
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Skills
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Experience
            </a>
            <a
              href="#education"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Education
            </a>
            <a
              href="#certifications"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Certifications
            </a>
            <a
              href="#endorsements"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Endorsements
            </a>
            <a
              href="#consulting"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-blue-400 font-semibold hover:text-blue-300"
            >
              Advisory & Payment Gateways
            </a>
          </nav>
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
            {onOpenPayment && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPayment();
                }}
                className="flex-1 py-2 text-xs font-semibold text-center text-white bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Pay / Book</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex-1 py-2 text-xs font-medium text-center text-slate-200 bg-slate-800 rounded-lg"
            >
              Resume
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="flex-1 py-2 text-xs font-medium text-center text-white bg-blue-600 rounded-lg"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
