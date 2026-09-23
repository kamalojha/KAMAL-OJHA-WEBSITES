import React, { useState } from 'react';
import { Mail, Phone, Linkedin, MapPin, Copy, Check, ArrowDown, ExternalLink, Terminal, ShieldCheck, CreditCard } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface Props {
  onOpenResume: () => void;
  onOpenContact: () => void;
  onExploreProjects: () => void;
  onOpenPayment?: () => void;
}

export const Hero: React.FC<Props> = ({ onOpenResume, onOpenContact, onExploreProjects, onOpenPayment }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle background ambient grid (Zero-pill, high-contrast engineering aesthetic) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic & Role Authority */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed availability line with subtle typographic separator */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">{PERSONAL_INFO.status}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 flex items-center gap-1">
                <span>Greater Noida, India</span>
                <span title="India">🇮🇳</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-blue-400">Entry-Level / Graduate Roles</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.08] text-balance">
                Architecting Machine Learning & Scalable Full-Stack Systems
              </h1>
              <p className="text-lg text-slate-300 font-medium pt-1">
                Kamal Ojha <span aria-hidden="true" className="text-slate-600">/</span> Fresher & B.E. Computer Science Graduate (2024)
              </p>
            </div>

            {/* Resume Summary */}
            <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
              {PERSONAL_INFO.summary}
            </p>

            {/* Quick Contact & Verified Identity Row */}
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
              {/* Email with 1-click copy */}
              <button
                onClick={handleCopyEmail}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                title="Click to copy email address"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono">{PERSONAL_INFO.email}</span>
                {copiedEmail ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500" />
                )}
              </button>

              {/* Phone with 1-click copy */}
              <button
                onClick={handleCopyPhone}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                title="Click to copy phone number"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">{PERSONAL_INFO.phone}</span>
                {copiedPhone ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500" />
                )}
              </button>

              {/* LinkedIn Link */}
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-mono">{PERSONAL_INFO.linkedinHandle}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProjects}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                <span>Explore Featured Projects</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenResume}
                className="px-5 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors flex items-center gap-2"
              >
                <span>View Full Resume Dossier</span>
              </button>

              {onOpenPayment && (
                <button
                  onClick={onOpenPayment}
                  className="px-5 py-3 text-sm font-semibold text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Book & Pay (Razorpay / Paytm)</span>
                </button>
              )}
            </div>

            {/* Quantitative Proof Adjacency Metrics */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PERSONAL_INFO.metrics.map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="text-2xl font-bold font-display text-white tabular-nums">
                    {m.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Engineering Terminal & Domain Capability Inspector */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">kamal_ojha.config.json</span>
                </div>
                <div className="text-[11px] font-mono text-blue-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>AWS Certified</span>
                </div>
              </div>

              {/* Engineering Profile Code Block */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/70 space-y-1.5">
                  <span className="text-slate-400 block">// Core Engineering Stack</span>
                  <div className="text-slate-300">
                    <span className="text-blue-400">const</span> <span className="text-yellow-300">competencies</span> = {'{'}
                  </div>
                  <div className="pl-4 text-slate-300 space-y-1">
                    <div><span className="text-indigo-300">primaryLanguage</span>: <span className="text-emerald-300">"Python"</span>,</div>
                    <div><span className="text-indigo-300">deepLearning</span>: [<span className="text-emerald-300">"CNNs"</span>, <span className="text-emerald-300">"Transfer Learning"</span>, <span className="text-emerald-300">"Keras"</span>],</div>
                    <div><span className="text-indigo-300">computerVision</span>: [<span className="text-emerald-300">"OpenCV"</span>, <span className="text-emerald-300">"Grad-CAM"</span>, <span className="text-emerald-300">"Segmentation"</span>],</div>
                    <div><span className="text-indigo-300">fullStack</span>: [<span className="text-emerald-300">"React"</span>, <span className="text-emerald-300">"Django"</span>, <span className="text-emerald-300">"PHP"</span>, <span className="text-emerald-300">"MySQL"</span>],</div>
                    <div><span className="text-indigo-300">distributedSystems</span>: [<span className="text-emerald-300">"LARA Protocol"</span>, <span className="text-emerald-300">"Multipath"</span>]</div>
                  </div>
                  <div className="text-slate-300">{'}'};</div>
                </div>

                {/* Key Technical Highlights Box */}
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/60 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>Real-World Engineering Highlights</span>
                  </div>
                  <div className="text-slate-400 space-y-1.5 text-[11px]">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400">▹</span>
                      <span>Healthcare AI: Chest X-ray pneumonia classification with clinical Grad-CAM heatmap localization.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400">▹</span>
                      <span>AgriTech Vision: Automated foliar lesion classification across wheat crop strains for rapid intervention.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-sky-400">▹</span>
                      <span>Distributed Ad-hoc: Energy and buffer-aware multipath packet routing diminishing node failure by 28%.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Location: Greater Noida, UP</span>
                <span>Open for Relocation & Remote</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
