import React from 'react';
import { Lock, EyeOff, HardDrive, Shield } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const privacyPoints = [
    {
      title: 'Zero Account Requirement',
      description:
        'No signup, sign-in, email verification, or marketing opt-in. The analyzer is public and accessible immediately for anyone with a resume.',
      icon: <Lock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    },
    {
      title: 'Ephemeral Session Memory',
      description:
        'Uploaded resumes are held in browser memory only during your active tab session. In Offline Mode, files are parsed 100% locally on your machine with zero bytes transmitted over any network.',
      icon: <HardDrive className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    },
    {
      title: 'Confidential Evaluation',
      description:
        'Analysis reports are strictly private to your current session. No public candidate databases, search indexing, or recruiter resale networks.',
      icon: <EyeOff className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    },
    {
      title: 'Encrypted Server Pipeline',
      description:
        'When processed by the full-stack engine, your document is sent over encrypted HTTPS multipart form payload solely for text parsing and extraction.',
      icon: <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    },
  ];

  return (
    <section
      id="document-privacy"
      className="py-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-xs scroll-mt-20 relative"
    >
      {/* Anchor alias so both #document-privacy and #privacy work */}
      <span id="privacy" className="absolute -top-20 pointer-events-none" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            <span>Document Privacy & Data Protection</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal normal-case">Strict Confidentiality</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Document Privacy: Your career data remains your confidential property.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            We believe career analysis tools should never harvest candidate contact details, track personal data, or train third-party models on your private work history.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyPoints.map((pt) => (
            <div
              key={pt.title}
              className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-cyan-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-800/60 flex items-center justify-center mb-5">
                {pt.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                {pt.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {pt.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
