import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ResumeImprovement } from '../../types/resume';
import { AlertCircle, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

interface ImprovementsSectionProps {
  improvements: ResumeImprovement[];
}

export const ImprovementsSection: React.FC<ImprovementsSectionProps> = ({ improvements }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getSeverityStyle = (sev: ResumeImprovement['severity']) => {
    switch (sev) {
      case 'high':
        return {
          label: 'High Priority',
          className: 'text-rose-700 dark:text-rose-400 font-bold',
        };
      case 'medium':
        return {
          label: 'Moderate Impact',
          className: 'text-amber-700 dark:text-amber-400 font-semibold',
        };
      case 'low':
        return {
          label: 'Fine-tuning',
          className: 'text-blue-700 dark:text-blue-400 font-medium',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Targeted Improvements & Fixes
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Actionable, concrete revisions ordered by their potential screening impact.
        </p>
      </div>

      {improvements.length > 0 ? (
        <div className="space-y-3">
          {improvements.map((imp) => {
            const severity = getSeverityStyle(imp.severity);
            const isCopied = copiedId === imp.id;

            return (
              <Card
                key={imp.id}
                className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {imp.title}
                    </h3>
                  </div>

                  {/* Clean unboxed metadata with dot separator */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400">{imp.category}</span>
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className={severity.className}>{severity.label}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pl-6">
                  {imp.actionableFeedback}
                </p>

                {imp.suggestedRevision && (
                  <div className="mt-3.5 ml-6 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/70 dark:border-neutral-800 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Actionable Rewrite</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(imp.id, imp.suggestedRevision!)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded transition-colors"
                        title="Copy suggested revision"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex items-start gap-2 text-neutral-800 dark:text-neutral-200 font-mono text-[11px] leading-relaxed">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{imp.suggestedRevision}</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-6 text-center text-xs text-neutral-500 bg-white dark:bg-neutral-900">
          No critical improvement areas detected.
        </Card>
      )}
    </div>
  );
};
