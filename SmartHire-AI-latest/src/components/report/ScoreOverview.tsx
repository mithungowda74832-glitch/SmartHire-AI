import React from 'react';
import { Card } from '../ui/Card';
import { ResumeAnalysisResult } from '../../types/resume';
import { getScoreGrade } from '../../utils/formatters';
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';

interface ScoreOverviewProps {
  result: ResumeAnalysisResult;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({ result }) => {
  const score = result.overallScore;
  const grade = getScoreGrade(score);
  const candidate = result.candidate;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Overall Score Box */}
      <Card className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Overall ATS Score
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-50">
              {score}
            </span>
            <span className="text-xl font-normal font-mono text-neutral-400 dark:text-neutral-500">/ 100</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className={`text-sm font-bold ${grade.colorClass}`}>
              {grade.label}
            </span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {score >= 80 ? 'Competitive candidate tier' : score >= 65 ? 'Competitive with targeted revisions' : 'Substantial revision recommended'}
            </span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 leading-relaxed">
          Aggregated across four core dimensions: Quantified Impact, Layout Brevity, Technical Skills, and Career Depth.
        </p>
      </Card>

      {/* Candidate Profile Summary */}
      <Card className="lg:col-span-8 p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Extracted Profile & Executive Summary
          </div>

          {candidate?.summary ? (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {candidate.summary}
            </p>
          ) : (
            <p className="text-sm text-neutral-500 italic">
              No formal summary section detected in document. Consider adding an opening 3-sentence executive summary.
            </p>
          )}
        </div>

        {/* Contact & Experience detail row adhering to zero-pill discipline */}
        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">
          {candidate?.yearsOfExperience !== undefined && (
            <div className="flex items-center gap-1.5 font-mono">
              <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
              <span>{candidate.yearsOfExperience} Years Experience</span>
            </div>
          )}
          {candidate?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{candidate.location}</span>
            </div>
          )}
          {candidate?.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-mono">{candidate.email}</span>
            </div>
          )}
          {candidate?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-mono">{candidate.phone}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
