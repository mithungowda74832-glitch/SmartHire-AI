import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { ScoreBreakdown as IScoreBreakdown } from '../../types/resume';

interface ScoreBreakdownProps {
  breakdown: IScoreBreakdown;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const categories = [
    breakdown.impact,
    breakdown.brevityAndFormatting,
    breakdown.skillsClarity,
    breakdown.experienceRelevance,
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Evaluation Dimensions
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Standardized criteria mapped to modern engineering & corporate screening algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const pct = Math.round((cat.score / cat.max) * 100);
          const tone = pct >= 80 ? 'success' : pct >= 65 ? 'default' : 'warning';

          return (
            <Card
              key={cat.label}
              className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {cat.label}
                  </span>
                  <span className="text-sm font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                    {cat.score}{' '}
                    <span className="text-xs font-normal font-mono text-neutral-400">/ {cat.max}</span>
                  </span>
                </div>

                <ProgressBar
                  value={cat.score}
                  max={cat.max}
                  showValueText={false}
                  tone={tone}
                  size="md"
                />

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3.5 leading-relaxed">
                  {cat.assessment}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
