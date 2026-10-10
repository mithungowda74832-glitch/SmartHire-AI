import React, { useState } from 'react';
import { Button } from '../ui/Button';
import {
  ArrowLeft,
  RotateCcw,
  FileText,
  Calendar,
  HardDrive,
  Info,
  Briefcase,
  Copy,
  Check,
  UploadCloud,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { ResumeAnalysisResult } from '../../types/resume';
import { formatDate, formatBytes } from '../../utils/formatters';
import {
  SAMPLE_PYTHON_RESUME_TEXT,
  SAMPLE_JOB_DESCRIPTION_TEXT,
} from '../../data/sampleData';

interface ReportHeaderProps {
  result: ResumeAnalysisResult;
  onReset: () => void;
  onDownloadClick: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  result,
  onReset,
  onDownloadClick,
}) => {
  const isDemoMode = result.metadata.sourceMode === 'demo_preview';
  const isLocalOffline = result.metadata.sourceMode === 'local_offline';
  const [activeModal, setActiveModal] = useState<'resume' | 'job' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
      {/* Offline Mode Disclosure Banner */}
      {isLocalOffline && (
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/90 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-800/80 space-y-3 text-xs text-cyan-950 dark:text-cyan-100">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded font-mono font-bold text-[11px] bg-cyan-200 text-cyan-900 dark:bg-cyan-900 dark:text-cyan-100 uppercase tracking-wider">
                  LOCAL OFFLINE ANALYSIS
                </span>
                <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300">
                  Zero Network Traffic · Client-Side Heuristics
                </span>
              </div>
              <p className="text-cyan-900 dark:text-cyan-200 leading-relaxed text-xs">
                {result.metadata.offlineDetails?.disclaimer ||
                  'This evaluation was computed entirely inside your browser memory without contacting external APIs or Gemini. Results are heuristic evaluations based on local skill taxonomies, action verbs, and structural completeness.'}
              </p>
              {result.metadata.offlineDetails?.limitations && (
                <ul className="pt-1 space-y-1 text-[11px] text-cyan-800 dark:text-cyan-300 list-disc list-inside">
                  {result.metadata.offlineDetails.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Demo mode disclosure banner & input preview controls */}
      {isDemoMode && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 space-y-3.5 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-amber-200 text-amber-900 dark:bg-amber-900/90 dark:text-amber-100 uppercase tracking-wider">
                  DEMO DATA
                </span>
                <span className="font-bold tracking-wide uppercase text-[11px] text-amber-800 dark:text-amber-300">
                  Sample Candidate Evaluation: Liam Vance (Junior Python Developer)
                </span>
              </div>
              <p className="text-amber-800 dark:text-amber-200 leading-relaxed pt-0.5 text-xs">
                This is a realistic, pre-computed demonstration dataset evaluating a Junior Python Developer against a job posting at Apex Cloud Technologies. No backend call or API key was required. Real resume uploads are processed in real-time by the backend engine.
              </p>
            </div>
          </div>

          {/* Sample Input Preview Triggers */}
          <div className="pt-2 border-t border-amber-200/80 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-amber-800/90 dark:text-amber-300">
                Inspect Sample Inputs:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('resume')}
                icon={<FileText className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />}
                className="bg-white/80 dark:bg-neutral-900/80 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100/50 text-xs py-1 h-7"
              >
                View Sample Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('job')}
                icon={<Briefcase className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />}
                className="bg-white/80 dark:bg-neutral-900/80 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100/50 text-xs py-1 h-7"
              >
                View Sample Job Posting
              </Button>
            </div>

            <Button
              size="sm"
              onClick={onReset}
              icon={<UploadCloud className="w-3.5 h-3.5" />}
              className="text-xs py-1 h-7"
            >
              Analyze Your Real Resume
            </Button>
          </div>
        </div>
      )}

      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isDemoMode ? 'Back to Landing Page' : 'Back to Analyzer'}</span>
        </button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {isDemoMode ? 'Upload Your Resume' : 'Analyze Another Resume'}
          </Button>
          <Button
            size="sm"
            onClick={onDownloadClick}
          >
            Download Report
          </Button>
        </div>
      </div>

      {/* Document info banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Analysis Evaluation Report</span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-neutral-500 dark:text-neutral-400 font-normal">
              {isDemoMode ? 'DEMO DATA (Liam Vance)' : isLocalOffline ? 'LOCAL OFFLINE ENGINE (In-Browser)' : 'Gemini 3.8 Flash AI Model'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-3">
            <span>{result.candidate?.name || result.metadata.fileName}</span>
            {isDemoMode && (
              <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                DEMO DATA
              </span>
            )}
            {isLocalOffline && (
              <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-bold bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                LOCAL OFFLINE
              </span>
            )}
          </h1>
          {result.candidate?.titleOrHeadline && (
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-1">
              {result.candidate.titleOrHeadline}
            </p>
          )}

          {/* Analysis Scope Indicator */}
          <div className="pt-2">
            {result.jobMatch ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300">
                <Target className="w-3.5 h-3.5 text-cyan-500" />
                <span>Job-Targeted Analysis: {result.jobMatch.jobTitleDetected || 'Custom Job Description'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>General Resume Quality &amp; ATS Evaluation (No Job Description Specified)</span>
              </span>
            )}
          </div>
        </div>

        {/* File metadata tags */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-900/70 p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            <span>{formatBytes(result.metadata.fileSizeBytes)}</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(result.metadata.analyzedAt)}</span>
          </div>
          {result.metadata.wordCountEstimate && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">~{result.metadata.wordCountEstimate} words</span>
            </>
          )}
        </div>
      </div>

      {/* Modal for viewing raw input sample documents */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  {activeModal === 'resume' ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Briefcase className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {activeModal === 'resume'
                      ? 'Sample Resume: Liam Vance (Junior Python Developer)'
                      : 'Sample Job Description: Apex Cloud Technologies'}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {activeModal === 'resume'
                      ? 'The raw resume text evaluated in this sample report.'
                      : 'The target job specification used for skill matching.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopy(
                      activeModal === 'resume'
                        ? SAMPLE_PYTHON_RESUME_TEXT
                        : SAMPLE_JOB_DESCRIPTION_TEXT
                    )
                  }
                  icon={
                    copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                  className="text-xs"
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-semibold w-7 h-7 flex items-center justify-center"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body with formatted mono text */}
            <div className="p-5 overflow-y-auto font-mono text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed bg-neutral-50/60 dark:bg-neutral-950/60 flex-1">
              {activeModal === 'resume'
                ? SAMPLE_PYTHON_RESUME_TEXT
                : SAMPLE_JOB_DESCRIPTION_TEXT}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900">
              <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
                Labeled: DEMO DATA
              </span>
              <Button size="sm" onClick={() => setActiveModal(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
