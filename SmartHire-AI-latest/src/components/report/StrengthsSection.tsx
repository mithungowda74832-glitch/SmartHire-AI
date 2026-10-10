import React from 'react';
import { Card } from '../ui/Card';
import { ResumeStrength } from '../../types/resume';
import { CheckCircle2, Quote } from 'lucide-react';

interface StrengthsSectionProps {
  strengths: ResumeStrength[];
}

export const StrengthsSection: React.FC<StrengthsSectionProps> = ({ strengths }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Identified Strengths
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Elements of your profile that effectively communicate competence and credibility.
        </p>
      </div>

      {strengths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strengths.map((str) => (
            <Card
              key={str.id}
              className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-2.5 mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {str.headline}
                  </h3>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {str.description}
                </p>

                {str.evidence && (
                  <div className="mt-2 pt-3 border-t border-neutral-100 dark:border-neutral-850 text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-50/70 dark:bg-neutral-950/50 p-3 rounded-xl flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span className="italic leading-relaxed font-serif">{str.evidence}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-xs text-neutral-500 bg-white dark:bg-neutral-900">
          No distinct strengths isolated by the parsing engine.
        </Card>
      )}
    </div>
  );
};
