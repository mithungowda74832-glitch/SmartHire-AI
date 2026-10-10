import React from 'react';
import { Button } from '../ui/Button';
import { UploadCloud, Play } from 'lucide-react';

interface FinalCTAProps {
  onAnalyzeClick: () => void;
  onTryDemoClick?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onAnalyzeClick, onTryDemoClick }) => {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 sm:p-12 md:p-16 shadow-lg shadow-slate-900/5 dark:shadow-cyan-950/20 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 mb-3">
            <span>Ready for Evaluation</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal normal-case">Immediate Results</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 max-w-xl text-balance">
            Elevate your resume before your next application.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 max-w-lg leading-relaxed">
            Upload your document to receive comprehensive scoring, detected skill taxonomies, ATS readability benchmarks, and prioritized line-by-line improvements.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              onClick={onAnalyzeClick}
              icon={<UploadCloud className="w-4 h-4" />}
              className="w-full sm:w-auto font-medium shadow-md bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 border-cyan-500 cursor-pointer"
            >
              Analyze My Resume
            </Button>

            {onTryDemoClick && (
              <Button
                variant="outline"
                size="lg"
                onClick={onTryDemoClick}
                icon={<Play className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500/20" />}
                className="w-full sm:w-auto font-medium bg-white/80 dark:bg-slate-900/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Try Sample Analysis
              </Button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span>100% Free & Open</span>
            <span aria-hidden="true" className="mx-2 text-slate-300 dark:text-slate-700">·</span>
            <span>No account or credit card</span>
            <span aria-hidden="true" className="mx-2 text-slate-300 dark:text-slate-700">·</span>
            <span>Private browser session</span>
          </div>
        </div>
      </div>
    </section>
  );
};
