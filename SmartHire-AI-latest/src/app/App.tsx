import React, { useRef, useEffect, useState } from 'react';
import { useAppState } from './app-state';
import { ThemeProvider } from '../hooks/useTheme';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { CinematicCanvas } from '../components/layout/CinematicCanvas';
import { HeroSection } from '../components/landing/HeroSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { PrivacySection } from '../components/landing/PrivacySection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { ResumeUploader } from '../components/analyzer/ResumeUploader';
import { JobDescriptionInput } from '../components/analyzer/JobDescriptionInput';
import { AnalysisProgress } from '../components/analyzer/AnalysisProgress';
import { ReportHeader } from '../components/report/ReportHeader';
import { ScoreOverview } from '../components/report/ScoreOverview';
import { ScoreBreakdown } from '../components/report/ScoreBreakdown';
import { SkillsSection } from '../components/report/SkillsSection';
import { StrengthsSection } from '../components/report/StrengthsSection';
import { ImprovementsSection } from '../components/report/ImprovementsSection';
import { JobMatchSection } from '../components/report/JobMatchSection';
import { ReportAssistant } from '../components/report/ReportAssistant';
import { PersonalizedInterviewQuestions } from '../components/report/PersonalizedInterviewQuestions';
import { DownloadReport } from '../components/report/DownloadReport';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Toast } from '../components/ui/Toast';
import {
  Sparkles,
  ArrowRight,
  Server,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Info,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useConnectivity } from '../hooks/useConnectivity';

function AppContent() {
  const connectivity = useConnectivity();
  const {
    uploadedFile,
    jobDescription,
    setJobDescription,
    status,
    analysisResult,
    error,
    setError,
    forceDemoMode,
    setForceDemoMode,
    backendStatus,
    toasts,
    dismissToast,
    handleFileSelect,
    handleFileRemove,
    resetAll,
    loadSampleReport,
    executeAnalysis,
    executeLocalAnalysis,
  } = useAppState();

  const analyzerRef = useRef<HTMLDivElement>(null);
  const downloadSectionRef = useRef<HTMLDivElement>(null);

  const navigateToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      if (window.history.pushState) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
      if (analysisResult) {
        resetAll();
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const resolvedId =
      sectionId === 'privacy'
        ? 'document-privacy'
        : sectionId === 'launch-analyzer'
        ? 'analyzer'
        : sectionId;

    if (analysisResult) {
      // Exit report view back to landing/workspace first
      resetAll();
      setTimeout(() => {
        const el = document.getElementById(resolvedId) || document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.history.pushState) {
            window.history.pushState(null, '', `#${resolvedId}`);
          }
        }
      }, 70);
    } else {
      const el = document.getElementById(resolvedId) || document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.history.pushState) {
          window.history.pushState(null, '', `#${resolvedId}`);
        }
      }
    }
  };

  const scrollToAnalyzer = () => {
    navigateToSection('analyzer');
  };

  const scrollToHowItWorks = () => {
    navigateToSection('how-it-works');
  };

  const scrollToFeatures = () => {
    navigateToSection('features');
  };

  const scrollToPrivacy = () => {
    navigateToSection('document-privacy');
  };

  const scrollToDownload = () => {
    downloadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scroll suppression state: prevents any automated scroll-to-section logic
  // from running during the first 500ms of the application's lifecycle.
  const [scrollSuppressed, setScrollSuppressed] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScrollSuppressed(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Consolidated scroll-to-top and hash-based navigation logic:
  // Verifies if the user is reloading the page or at root '/' without a hash before triggering top-scroll.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isReload = navEntry?.type === 'reload';
    const pathname = window.location.pathname;
    const rawHash = window.location.hash.replace('#', '').trim();
    const isRootWithoutHash = (pathname === '/' || pathname === '') && (!rawHash || rawHash === 'top');

    // On browser refresh or root visit: clear any stale section hash and stay firmly at the top hero
    if (isReload || isRootWithoutHash) {
      if (rawHash && rawHash !== 'top' && window.history.replaceState) {
        window.history.replaceState(null, '', pathname || '/');
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }

    // Direct intentional hash provided on cold link visit (e.g. shared link /#features)
    // Only execute if not suppressed or after initial page load delay
    if (!scrollSuppressed && rawHash && rawHash !== 'top') {
      const targetId =
        rawHash === 'privacy'
          ? 'document-privacy'
          : rawHash === 'launch-analyzer'
          ? 'analyzer'
          : rawHash;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollSuppressed]);

  // Support browser Back and Forward navigation without jumping bugs
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash || hash === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetId =
          hash === 'privacy'
            ? 'document-privacy'
            : hash === 'launch-analyzer'
            ? 'analyzer'
            : hash;
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAnalyzing = status === 'uploading' || status === 'parsing' || status === 'evaluating';

  return (
    <div id="top" className="min-h-screen relative flex flex-col bg-[#f8fafc] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Live Cinematic Intelligence Engine Canvas Background */}
      <CinematicCanvas />

      {/* Toast notifications positioned at bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>

      {/* Top Header */}
      <SiteHeader
        onStartAnalysis={scrollToAnalyzer}
        onNavigateSection={navigateToSection}
        onTrySampleReport={loadSampleReport}
        activeView={analysisResult ? 'report' : 'landing'}
        connectivity={connectivity}
      />

      <main className="flex-1 relative z-10">
        {/* If a report is actively completed, render the Report View directly */}
        {analysisResult ? (
          <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-300">
            <ReportHeader
              result={analysisResult}
              onReset={resetAll}
              onDownloadClick={scrollToDownload}
            />

            <ScoreOverview result={analysisResult} />

            <ScoreBreakdown breakdown={analysisResult.scoreBreakdown} />

            <SkillsSection skills={analysisResult.extractedSkills} />

            <StrengthsSection strengths={analysisResult.strengths} />

            <ImprovementsSection improvements={analysisResult.improvements} />

            {analysisResult.jobMatch && (
              <JobMatchSection jobMatch={analysisResult.jobMatch} />
            )}

            {/* Your Personalized Interview Questions directly below resume analysis results */}
            <PersonalizedInterviewQuestions
              result={analysisResult}
              resumeText={uploadedFile?.textPreview || analysisResult.extractedText}
              jobDescription={jobDescription}
            />

            <ReportAssistant result={analysisResult} />

            <div ref={downloadSectionRef}>
              <DownloadReport result={analysisResult} />
            </div>

            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Analysis session active · Documents are not stored after page reload.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAll}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Analyze Another Resume
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Landing & Analyzer Flow */
          <>
            <HeroSection
              onAnalyzeClick={scrollToAnalyzer}
              onHowItWorksClick={scrollToHowItWorks}
              onTryDemoClick={loadSampleReport}
            />

            {/* Interactive Analyzer Workspace */}
            <section
              id="analyzer"
              ref={analyzerRef}
              className="py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 scroll-mt-20 relative"
            >
              {/* Alias id for launch-analyzer */}
              <span id="launch-analyzer" className="absolute -top-20 pointer-events-none" aria-hidden="true" />
              <div className="max-w-4xl mx-auto px-6">
                <div className="mb-8 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Resume Analyzer Workspace</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-500 dark:text-slate-400 font-normal normal-case">Direct Document Intake</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Upload your resume to begin evaluation.
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    Select your document, optionally supply a target job posting, and run the analysis. Files are processed privately in-memory.
                  </p>
                </div>

                {isAnalyzing ? (
                  <AnalysisProgress
                    fileName={uploadedFile?.name || 'Resume'}
                    hasJobDescription={Boolean(jobDescription.trim())}
                    isDemoMode={forceDemoMode}
                  />
                ) : (
                  <Card className="p-6 sm:p-8 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
                    {/* Resume Upload Box */}
                    <ResumeUploader
                      uploadedFile={uploadedFile}
                      onFileSelect={handleFileSelect}
                      onFileRemove={handleFileRemove}
                      disabled={isAnalyzing}
                    />

                    {/* Job Description Input */}
                    <JobDescriptionInput
                      value={jobDescription}
                      onChange={setJobDescription}
                      disabled={isAnalyzing}
                    />

                    {/* Backend status & Mode selector */}
                    <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-4">
                      {/* Mode Segmented Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {connectivity.mode === 'online' ? (
                              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                            )}
                            <span>Analysis Engine</span>
                            <span
                              className={`ml-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                                connectivity.mode === 'online'
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {connectivity.mode === 'online' ? 'Online Mode' : 'Offline Native'}
                            </span>
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {connectivity.mode === 'online'
                              ? 'Connected to server-side Gemini 3.8 Flash model. Private local offline analysis is also supported.'
                              : 'Network disconnected. Local in-browser heuristic engine is active.'}
                          </span>
                        </div>

                        <div className="inline-flex p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-lg text-xs self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setForceDemoMode(false);
                              setError(null);
                            }}
                            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                              !forceDemoMode
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            {connectivity.mode === 'online' ? 'Gemini AI Model (Online)' : 'Local Offline Engine'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setForceDemoMode(true);
                              setError(null);
                            }}
                            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                              forceDemoMode
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            Demo Data Preview
                          </button>
                        </div>
                      </div>

                      {/* Informational Context Banner */}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          {forceDemoMode ? (
                            <span className="text-slate-700 dark:text-slate-300">
                              <strong>Development Preview Mode Active (DEMO DATA):</strong> Evaluates the user interface, upload workflows, scoring breakdown, and exports using simulated heuristics. Results are explicitly labeled as <strong>DEMO DATA</strong>.
                            </span>
                          ) : connectivity.mode === 'online' ? (
                            <span>
                              <strong>Online AI Engine Active:</strong> Multi-part resume parser and Gemini 3.8 Flash model pipeline ready on{' '}
                              <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">
                                /api/public/analyze-resume
                              </code>.
                            </span>
                          ) : (
                            <span className="text-amber-800 dark:text-amber-300 font-medium">
                              <strong>Offline Mode Active:</strong> Resumes and job descriptions are parsed and scored completely inside your browser memory using local skill taxonomies and heuristic rubrics. Zero data leaves your device.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submission Error Banner */}
                    {error && (
                      <div className="p-4 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1.5 flex-1">
                          <p className="font-semibold">Analysis Failed</p>
                          <p className="leading-relaxed">{error}</p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={executeLocalAnalysis}
                              className="text-xs bg-white dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100"
                            >
                              Run Local Offline Analysis Instead
                            </Button>
                            <span className="text-[11px] text-rose-700 dark:text-rose-300">
                              or test in Demo Data Preview mode.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Maximum file size: 10 MB (PDF, DOCX, TXT)</span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {uploadedFile && (
                          <Button
                            variant="ghost"
                            size="md"
                            onClick={handleFileRemove}
                            disabled={isAnalyzing}
                            className="w-full sm:w-auto text-xs"
                          >
                            Clear File
                          </Button>
                        )}

                        <Button
                          size="md"
                          onClick={executeAnalysis}
                          disabled={!uploadedFile || isAnalyzing}
                          loading={isAnalyzing}
                          icon={<ArrowRight className="w-4 h-4" />}
                          className="w-full sm:w-auto shadow-sm font-medium bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 border-cyan-500 cursor-pointer"
                        >
                          {forceDemoMode
                            ? 'Run Preview Analysis'
                            : connectivity.mode === 'online'
                            ? 'Analyze Resume (Gemini AI)'
                            : 'Analyze Resume (Offline Local)'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </section>

            {/* Explanatory Workflows */}
            <WorkflowSection />

            {/* Core Capabilities */}
            <FeaturesSection />

            {/* Strict Data Privacy Commitments */}
            <PrivacySection />

            {/* Final Conversion Action */}
            <FinalCTA
              onAnalyzeClick={scrollToAnalyzer}
              onTryDemoClick={loadSampleReport}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <SiteFooter onNavigateSection={navigateToSection} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
