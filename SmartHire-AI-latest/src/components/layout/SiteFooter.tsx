import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SiteFooterProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigateSection }) => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50 font-bold text-base tracking-tight">
              <div className="w-6 h-6 rounded-md bg-cyan-600 dark:bg-cyan-500 flex items-center justify-center text-white dark:text-slate-950">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>SmartHire AI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Public AI resume analyzer for engineering and professional candidates. Evaluates impact, formatting, skills, and target job alignment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <a
              href="#how-it-works"
              onClick={(e) => handleNav(e, 'how-it-works')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors hover:underline underline-offset-4"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={(e) => handleNav(e, 'features')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors hover:underline underline-offset-4"
            >
              Features
            </a>
            <a
              href="#document-privacy"
              onClick={(e) => handleNav(e, 'document-privacy')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors hover:underline underline-offset-4"
            >
              Document Privacy
            </a>
            <a
              href="#analyzer"
              onClick={(e) => handleNav(e, 'analyzer')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors hover:underline underline-offset-4"
            >
              Launch Analyzer
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Zero account requirement. Resumes are processed strictly in-memory during analysis.</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} SmartHire AI. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
