import React, { useState } from 'react';
import { Mail, Phone, Linkedin, MapPin, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { submitInquiry } from '../services/inquiryService';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Interview Opportunity / Collaboration');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

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

  const setPrecomposedDraft = (template: 'interview' | 'ml_role' | 'fullstack') => {
    switch (template) {
      case 'interview':
        setSubject('Interview Invitation — Graduate / Fresher Engineering Role');
        setMessage(
          `Hi Kamal,\n\nWe reviewed your portfolio and were impressed by your deep learning work in healthcare AI, full-stack projects, and strong academic background. We would love to schedule an initial interview regarding an Entry-Level / Graduate Engineering opening on our team.\n\nBest regards,\n`
        );
        break;
      case 'ml_role':
        setSubject('Machine Learning & Computer Vision Opportunity');
        setMessage(
          `Hi Kamal,\n\nI came across your Pneumonia and Wheat Disease detection projects. We have an upcoming ML/Computer Vision initiative and would like to discuss your experience with CNN architectures and data preprocessing.\n\nLooking forward to speaking,\n`
        );
        break;
      case 'fullstack':
        setSubject('Full-Stack Software Engineering Position');
        setMessage(
          `Hi Kamal,\n\nYour PG Life and Time Entry web application projects match what we are building with React, Python, and relational databases. Are you open to discussing opportunities?\n\nBest,\n`
        );
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitStatus('error');
      setStatusMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Direct write to Firebase Firestore
      await submitInquiry({ name, email, subject, message });

      // Also mirror to API endpoint for redundancy
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      }).catch(() => {});

      setSubmitStatus('success');
      setStatusMessage('Your message was successfully received and persisted in Firebase. Thank you!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.warn('Firestore direct write error, falling back to server route:', err);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message }),
        });
        const data = await response.json();
        if (response.ok) {
          setSubmitStatus('success');
          setStatusMessage(data.message || 'Your message was successfully received by Kamal.');
          setName('');
          setEmail('');
          setMessage('');
        } else {
          setSubmitStatus('error');
          setStatusMessage(data.error || 'Failed to dispatch message.');
        }
      } catch (fallbackErr) {
        setSubmitStatus('error');
        setStatusMessage('Network error. You can also contact directly via email or phone.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Direct Information */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
                Direct Communication
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                08. Get in Touch
              </h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Currently open for Software Engineering, Machine Learning, and Data Engineering roles across India and remote global teams.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-3 pt-2">
              {/* Email */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-950/40 border border-blue-800/40 rounded-lg text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block">Personal Email</span>
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="text-xs font-mono font-medium text-white hover:text-blue-400">
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block">Phone & WhatsApp</span>
                    <a href={`tel:${PERSONAL_INFO.phone}`} className="text-xs font-mono font-medium text-white hover:text-emerald-400">
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyPhone}
                  className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                  title="Copy phone number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* LinkedIn */}
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors group block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-950/40 border border-sky-800/40 rounded-lg text-sky-400">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block">LinkedIn Profile</span>
                    <span className="text-xs font-mono font-medium text-white group-hover:text-sky-400 transition-colors">
                      {PERSONAL_INFO.linkedinHandle}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">Visit →</span>
              </a>

              {/* Location */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-500 block">Base Location</span>
                  <span className="text-xs font-mono text-slate-300">
                    {PERSONAL_INFO.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inbound Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white font-display">
                  Send Inbound Message
                </h3>
                {/* Pre-fill Draft Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  <span className="text-slate-500 text-[10px] uppercase font-mono mr-1">Drafts:</span>
                  <button
                    type="button"
                    onClick={() => setPrecomposedDraft('interview')}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrecomposedDraft('ml_role')}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    ML Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrecomposedDraft('fullstack')}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    Full-Stack
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins (Engineering Recruiter)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Your Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. s.jenkins@techcorp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Details about the role, technical team scope, and scheduling..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <span>Transmitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Message to Kamal Ojha</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
