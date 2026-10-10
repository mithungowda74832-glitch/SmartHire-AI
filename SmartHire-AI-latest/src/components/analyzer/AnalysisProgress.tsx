import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface AnalysisProgressProps {
  fileName: string;
  hasJobDescription: boolean;
  isDemoMode?: boolean;
}

const STAGES = [
  'Validating document format and text integrity...',
  'Extracting sections, chronological experience, and titles...',
  'Parsing technical competencies and developer tools...',
  'Analyzing quantifiable metric-to-verb ratios...',
  'Cross-referencing formatting against ATS parsing heuristics...',
  'Synthesizing actionable feedback and recommendation report...',
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  fileName,
  hasJobDescription,
  isDemoMode = false,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 sm:p-12 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm text-center flex flex-col items-center max-w-xl mx-auto">
      <div className="relative mb-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
        Evaluating Resume
      </h3>

      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 truncate max-w-md">
        <span>{fileName}</span>
        {hasJobDescription ? (
          <span className="text-cyan-600 dark:text-cyan-400 font-medium"> · Benchmarking against target job</span>
        ) : (
          <span> · General resume quality &amp; ATS evaluation</span>
        )}
      </div>

      {/* Honest Stage Progress */}
      <div className="w-full space-y-2 text-left max-w-md">
        {STAGES.map((stage, idx) => {
          const isCurrent = idx === currentStageIndex;
          const isDone = idx < currentStageIndex;

          return (
            <div
              key={stage}
              className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-colors ${
                isCurrent
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-medium border border-blue-200/50 dark:border-blue-900/50'
                  : isDone
                  ? 'text-neutral-500 dark:text-neutral-400 opacity-80'
                  : 'text-neutral-400 dark:text-neutral-600'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:text-blue-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                )}
              </div>
              <span className="truncate">{stage}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-xs text-neutral-400 dark:text-neutral-500">
        {isDemoMode
          ? 'Running in Development Preview demonstration mode.'
          : 'Processing via secure server pipeline. Deep analyses typically complete in 5–15 seconds.'}
      </div>
    </div>
  );
};
