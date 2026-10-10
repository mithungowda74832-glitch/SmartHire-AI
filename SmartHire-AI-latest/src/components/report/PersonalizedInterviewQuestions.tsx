import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  ResumeAnalysisResult,
  PersonalizedQuestionsData,
  InterviewDifficulty,
} from '../../types/resume';
import { fetchPersonalizedInterviewQuestions } from '../../services/resumeApi';
import { generateLocalInterviewQuestions } from '../../services/localInterviewGenerator';
import {
  HelpCircle,
  Sparkles,
  RefreshCw,
  Check,
  Copy,
  AlertCircle,
  WifiOff,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PersonalizedInterviewQuestionsProps {
  result: ResumeAnalysisResult;
  resumeText?: string;
  jobDescription?: string;
}

interface DifficultyTabConfig {
  id: InterviewDifficulty;
  label: string;
  badge: string;
  description: string;
  difficultyClass: string;
}

const DIFFICULTY_TABS: DifficultyTabConfig[] = [
  {
    id: 'beginner',
    label: 'Beginner — Fundamentals',
    badge: 'Tier 1',
    description:
      'Core principles, terminology, fundamental syntax, and foundational concepts of your verified skills.',
    difficultyClass:
      'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80',
  },
  {
    id: 'intermediate',
    label: 'Intermediate — Practical Application',
    badge: 'Tier 2',
    description:
      'Real-world implementation, hands-on scenarios, debugging, and project execution based on your work experience.',
    difficultyClass:
      'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800/80',
  },
  {
    id: 'advanced',
    label: 'Advanced — In-Depth Expertise',
    badge: 'Tier 3',
    description:
      'High-scale architecture, system performance optimization, failure modes, trade-offs, and senior engineering decisions.',
    difficultyClass:
      'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/80',
  },
];

export const PersonalizedInterviewQuestions: React.FC<PersonalizedInterviewQuestionsProps> = ({
  result,
  resumeText,
  jobDescription,
}) => {
  const [activeTab, setActiveTab] = useState<InterviewDifficulty>('beginner');
  const [questionsData, setQuestionsData] = useState<PersonalizedQuestionsData | null>(
    result.interviewQuestions || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!result.interviewQuestions);
  const [error, setError] = useState<string | null>(null);
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Track the active analysis session to prevent redundant requests across re-renders
  const lastRequestedResultRef = useRef<ResumeAnalysisResult | null>(null);
  const activeAbortControllerRef = useRef<AbortController | null>(null);

  const candidateName = result.candidate?.name || 'Your';
  const effectiveText = resumeText || result.extractedText;

  // Optimized question generation with request deduplication and configurable timeout
  const loadQuestions = useCallback(
    async (forceOffline = false) => {
      // Cancel any ongoing fetch
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }

      setIsLoading(true);
      setError(null);
      const controller = new AbortController();
      activeAbortControllerRef.current = controller;

      // Timeout watchdog: ensure interface NEVER hangs in "Generating..." state
      const watchdogTimer = setTimeout(() => {
        if (!controller.signal.aborted) {
          controller.abort();
          console.warn('[InterviewQuestions] Request exceeded 10s watchdog timeout.');
          // Fall back gracefully to offline generator
          const fallback = generateLocalInterviewQuestions(result, effectiveText, Date.now());
          setQuestionsData(fallback);
          result.interviewQuestions = fallback;
          setIsLoading(false);
        }
      }, 10000);

      try {
        const data = await fetchPersonalizedInterviewQuestions(
          result,
          effectiveText,
          jobDescription,
          forceOffline
        );

        if (!controller.signal.aborted) {
          clearTimeout(watchdogTimer);
          setQuestionsData(data);
          // Cache on the active result object for the entire session
          result.interviewQuestions = data;
        }
      } catch (err: unknown) {
        clearTimeout(watchdogTimer);
        if (!controller.signal.aborted) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Unable to generate interview questions. Please try again.';
          setError(msg);
        }
      } finally {
        clearTimeout(watchdogTimer);
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [result, effectiveText, jobDescription]
  );

  // Synchronize state when the result prop updates (e.g., new analysis loaded)
  useEffect(() => {
    // If questions are already cached on the current analysis result, reuse immediately
    if (result.interviewQuestions) {
      setQuestionsData(result.interviewQuestions);
      setIsLoading(false);
      setError(null);
      lastRequestedResultRef.current = result;
      return;
    }

    // Only request once per distinct resume analysis result
    if (lastRequestedResultRef.current !== result) {
      lastRequestedResultRef.current = result;
      loadQuestions(false);
    }
  }, [result, loadQuestions]);

  // Clean up in-flight requests on unmount
  useEffect(() => {
    return () => {
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
    };
  }, []);

  const handleCopySingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIndex(index);
    setTimeout(() => setCopiedQuestionIndex(null), 2500);
  };

  const handleCopyAll = () => {
    if (!questionsData) return;
    const currentList = questionsData[activeTab] || [];
    const fullText = currentList
      .map((q, idx) => `${idx + 1}. ${q}`)
      .join('\n\n');

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const activeTabConfig =
    DIFFICULTY_TABS.find((t) => t.id === activeTab) || DIFFICULTY_TABS[0];
  const currentQuestions = questionsData ? questionsData[activeTab] || [] : [];

  return (
    <Card
      id="interview-questions"
      className="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 scroll-mt-20"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Your Personalized Interview Questions
              </h3>

              {/* Engine Source Badge */}
              {questionsData && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    questionsData.source === 'offline_local'
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {questionsData.source === 'offline_local' ? (
                    <>
                      <WifiOff className="w-3 h-3" />
                      <span>Offline-Generated Questions</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Gemini AI Generated</span>
                    </>
                  )}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Targeted interview questions tailored specifically to{' '}
            <strong className="font-semibold text-slate-900 dark:text-slate-200">
              {candidateName}&apos;s
            </strong>{' '}
            verified skills, projects, work experience, and achievements.
            <span className="block mt-0.5 text-slate-500 dark:text-slate-500 text-xs">
              Strictly questions only (9 concise questions total: 3 per difficulty level).
            </span>
          </p>
        </div>

        {/* Regenerate Questions CTA */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadQuestions(false)}
            disabled={isLoading}
            icon={
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
            }
          >
            {isLoading ? 'Regenerating...' : 'Regenerate Questions'}
          </Button>
        </div>
      </div>

      {/* Loading state with clean skeleton shimmer */}
      {isLoading && (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Formulating Personalized Interview Questions...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Generating 9 focused questions (3 Fundamentals, 3 Practical Application, and 3 In-Depth Expertise) based on your resume.
            </p>
          </div>
          {/* Skeleton placeholders */}
          <div className="w-full max-w-2xl space-y-2.5 pt-2">
            <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
            <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse delay-75" />
            <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse delay-150" />
          </div>
        </div>
      )}

      {/* Error state with retry controls */}
      {!isLoading && error && (
        <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-semibold">Failed to generate interview questions</h4>
              <p className="text-xs text-rose-600 dark:text-rose-300 leading-relaxed">{error}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-500/20">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadQuestions(false)}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Retry
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadQuestions(true)}
              icon={<WifiOff className="w-3.5 h-3.5" />}
            >
              Generate Offline Instead
            </Button>
          </div>
        </div>
      )}

      {/* Questions Content */}
      {!isLoading && !error && questionsData && (
        <div className="space-y-6">
          {/* Three selectable difficulty tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-slate-100 dark:bg-slate-950/70 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {DIFFICULTY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = questionsData[tab.id]?.length || 0;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col text-left p-3 rounded-lg transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-md border border-slate-200/90 dark:border-slate-700/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-900/50'
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold tracking-tight">{tab.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {count} Questions
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active difficulty description banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className={`px-2 py-0.5 rounded font-semibold text-[11px] border ${activeTabConfig.difficultyClass}`}>
                {activeTabConfig.label}
              </span>
              <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">·</span>
              <span className="text-slate-600 dark:text-slate-400">{activeTabConfig.description}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium self-end sm:self-auto shrink-0"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied All</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All ({currentQuestions.length})</span>
                </>
              )}
            </button>
          </div>

          {/* Clean Numbered List of Questions Only */}
          <div className="space-y-3">
            {currentQuestions.map((question, index) => {
              const questionNumber = String(index + 1).padStart(2, '0');
              const isCopied = copiedQuestionIndex === index;

              return (
                <div
                  key={`${activeTab}-${index}`}
                  className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-xs transition-all"
                >
                  {/* Monospace Number Badge */}
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-400 font-mono font-bold text-xs sm:text-sm select-none">
                    {questionNumber}
                  </div>

                  {/* Question Content (Questions Only) */}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                      {question}
                    </p>
                  </div>

                  {/* Quick Copy button */}
                  <button
                    type="button"
                    onClick={() => handleCopySingle(question, index)}
                    title="Copy question text"
                    aria-label={`Copy question ${index + 1}`}
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom guidance notice */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>
                3 focused questions per difficulty tier (9 questions total).
              </span>
            </span>

            <div className="flex items-center gap-2">
              {activeTab !== 'advanced' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'beginner') setActiveTab('intermediate');
                    else if (activeTab === 'intermediate') setActiveTab('advanced');
                  }}
                  className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <span>
                    Next Tier:{' '}
                    {activeTab === 'beginner'
                      ? 'Intermediate'
                      : 'Advanced'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
