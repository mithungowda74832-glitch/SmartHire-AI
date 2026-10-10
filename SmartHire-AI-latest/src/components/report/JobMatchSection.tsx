import React from 'react';
import { Card } from '../ui/Card';
import { JobMatchAnalysis } from '../../types/resume';
import { Target, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface JobMatchSectionProps {
  jobMatch?: JobMatchAnalysis;
}

export const JobMatchSection: React.FC<JobMatchSectionProps> = ({ jobMatch }) => {
  if (!jobMatch) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Target Job Alignment</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Benchmarked against your supplied job description.
          </p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
            {jobMatch.matchScore}%
          </span>
          <span className="block text-[11px] font-mono text-neutral-400">Alignment Match</span>
        </div>
      </div>

      <Card className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-6">
        <div>
          {jobMatch.jobTitleDetected && (
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
              Detected Target Role: <span className="text-neutral-900 dark:text-neutral-100 font-bold">{jobMatch.jobTitleDetected}</span>
            </div>
          )}
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {jobMatch.alignmentSummary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-neutral-100 dark:border-neutral-800">
          {/* Matched Requirements */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Satisfied Prerequisites ({jobMatch.matchedRequirements.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
              {jobMatch.matchedRequirements.map((req) => (
                <li key={req} className="flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Skills / Gaps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Keyword Gaps & Omissions ({jobMatch.missingOrGaps.length})</span>
            </div>
            {jobMatch.missingOrGaps.length > 0 ? (
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                {jobMatch.missingOrGaps.map((gap) => (
                  <li key={gap} className="flex items-start gap-2">
                    <span className="text-rose-500 shrink-0 font-bold">!</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-neutral-500 italic">No critical missing keywords identified.</p>
            )}
          </div>
        </div>

        {/* Alignment Recommendations */}
        {jobMatch.recommendations.length > 0 && (
          <div className="pt-5 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Lightbulb className="w-4 h-4" />
              <span>How to Bridge These Gaps</span>
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
              {jobMatch.recommendations.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};
