import React, { useState, useEffect } from 'react';
import {
  Target,
  X,
  FileText,
  Sparkles,
  Info,
  CheckCircle2,
  Trash2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { JobRoleSelector } from './JobRoleSelector';
import { JOB_ROLE_PRESETS, JobRolePreset } from '../../data/jobPresets';

interface JobDescriptionInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string | null>(() => {
    if (!value) return null;
    const match = JOB_ROLE_PRESETS.find((p) => value.includes(`Role: ${p.title}`));
    return match ? match.title : null;
  });

  // Keep selectedRoleTitle in sync if value is cleared externally
  useEffect(() => {
    if (!value.trim()) {
      setSelectedRoleTitle(null);
    }
  }, [value]);

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const hasContent = value.trim().length > 0;

  const handleApplyPreset = (preset: JobRolePreset) => {
    setSelectedRoleTitle(preset.title);
    onChange(preset.sampleDescription);
  };

  const handleClear = () => {
    setSelectedRoleTitle(null);
    onChange('');
  };

  const handleSkipJD = () => {
    setSelectedRoleTitle(null);
    onChange('');
  };

  return (
    <div className="space-y-6 pt-2">
      {/* 1. Choose a Job Role: Searchable Preset Suggestions */}
      <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800/90 space-y-4">
        <JobRoleSelector
          currentText={value}
          selectedRoleTitle={selectedRoleTitle}
          onApplyPreset={handleApplyPreset}
          onClear={handleClear}
          disabled={disabled}
        />
      </div>

      {/* 2. Target Job Description Workspace (Textarea & Toolbar) */}
      <div className="space-y-3">
        {/* Label & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor="job-description-field"
              className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100"
            >
              <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Target Job Description</span>
            </label>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80">
              Optional
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            {selectedRoleTitle && (
              <span className="text-cyan-600 dark:text-cyan-400 font-sans font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Template: {selectedRoleTitle}
              </span>
            )}
            <span className="tabular-nums">
              {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} chars
            </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative group">
          <textarea
            id="job-description-field"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (!e.target.value.trim()) {
                setSelectedRoleTitle(null);
              }
            }}
            disabled={disabled}
            placeholder="Paste a target job posting here, or select a role preset from above to automatically load an editable template..."
            rows={7}
            className="w-full p-4 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/15 transition-all resize-y disabled:opacity-50 font-sans leading-relaxed"
          />

          {/* Quick Floating Clear when text is present */}
          {hasContent && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              title="Clear job description"
              aria-label="Clear job description"
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Footer Actions & Clear Guidance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {hasContent ? (
                <>
                  <strong className="text-slate-700 dark:text-slate-200">Role matching active:</strong> Gemini will benchmark your resume directly against these responsibilities and requirements.
                </>
              ) : (
                <>
                  <strong className="text-slate-700 dark:text-slate-200">No job description?</strong> That’s fine — you’ll receive thorough feedback on overall resume quality, ATS formatting, and extracted skills.
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            {hasContent ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Description</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkipJD}
                disabled={disabled}
                className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-medium cursor-pointer"
              >
                <span>Analyze Without JD (General Evaluation)</span>
              </button>
            )}
          </div>
        </div>

        {/* Educational Callout Box for Optional No-JD Workflow */}
        {!hasContent && (
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Job Description is 100% Optional
              </span>
              <p className="leading-relaxed">
                If you skip this step, SmartHire AI will objectively assess your resume’s formatting brevity, action verb impact, bullet-point metrics, and technical competency depth without fabricating a job-specific match score.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
