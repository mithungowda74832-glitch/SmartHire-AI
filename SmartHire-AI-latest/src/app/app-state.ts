import { useState, useCallback, useEffect } from 'react';
import {
  UploadedFileState,
  ResumeAnalysisResult,
  AnalysisStatus,
} from '../types/resume';
import {
  analyzeResume,
  checkBackendHealth,
  getBackendConfig,
  fetchPersonalizedInterviewQuestions,
} from '../services/resumeApi';
import { analyzeResumeLocally } from '../services/localAnalyzer';
import { generateLocalInterviewQuestions } from '../services/localInterviewGenerator';
import { ToastMessage } from '../components/ui/Toast';

export function useAppState() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFileState | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forceDemoMode, setForceDemoMode] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  const [backendStatus, setBackendStatus] = useState<{
    checked: boolean;
    reachable: boolean;
    url: string;
    message: string;
    geminiConfigured: boolean;
  }>(() => {
    const initialConfig = getBackendConfig();
    return {
      checked: false,
      reachable: false,
      url: initialConfig.url,
      message: initialConfig.message,
      geminiConfigured: false,
    };
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Check backend health & sync connectivity
  const refreshBackendHealth = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOfflineMode(true);
      setBackendStatus((prev) => ({
        ...prev,
        checked: true,
        reachable: false,
        geminiConfigured: false,
        message: 'Browser is currently offline.',
      }));
      return;
    }

    try {
      const res = await checkBackendHealth();
      setBackendStatus({
        checked: true,
        reachable: res.reachable,
        url: res.url,
        message: res.message,
        geminiConfigured: res.geminiConfigured,
      });
      setIsOfflineMode(!res.reachable);
    } catch {
      setIsOfflineMode(true);
      setBackendStatus((prev) => ({
        ...prev,
        checked: true,
        reachable: false,
        geminiConfigured: false,
        message: 'Could not connect to backend server.',
      }));
    }
  }, []);

  useEffect(() => {
    refreshBackendHealth();

    const onOnline = () => {
      refreshBackendHealth();
    };

    const onOffline = () => {
      setIsOfflineMode(true);
      setBackendStatus((prev) => ({
        ...prev,
        reachable: false,
        geminiConfigured: false,
        message: 'Network offline.',
      }));
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [refreshBackendHealth]);

  const addToast = useCallback((type: ToastMessage['type'], message: string, detail?: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      message,
      detail,
      duration: 6000,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setUploadedFile({
      file,
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop() || 'document',
      lastModified: file.lastModified,
    });
    setError(null);
  }, []);

  const handleFileRemove = useCallback(() => {
    setUploadedFile(null);
    setError(null);
  }, []);

  const resetAll = useCallback(() => {
    setUploadedFile(null);
    setJobDescription('');
    setStatus('idle');
    setAnalysisResult(null);
    setError(null);
  }, []);

  const loadSampleReport = useCallback(() => {
    import('../data/sampleData').then(({ SAMPLE_PYTHON_REPORT }) => {
      setUploadedFile({
        file: null,
        name: SAMPLE_PYTHON_REPORT.metadata.fileName,
        size: SAMPLE_PYTHON_REPORT.metadata.fileSizeBytes,
        type: 'application/pdf',
      });
      setJobDescription('Junior Python Developer at Apex Cloud Technologies');
      setAnalysisResult(SAMPLE_PYTHON_REPORT);
      setStatus('completed');
      setError(null);
      addToast(
        'info',
        'Sample Evaluation Loaded (DEMO DATA)',
        'Reviewing Junior Python Developer sample profile Liam Vance.'
      );
    });
  }, [addToast]);

  /**
   * Runs local in-browser analysis without sending any network request
   */
  const executeLocalAnalysis = useCallback(async () => {
    if (!uploadedFile || !uploadedFile.file) {
      setError('Please select a resume file before initiating analysis.');
      return;
    }

    setStatus('parsing');
    setError(null);

    try {
      const result = await analyzeResumeLocally(
        uploadedFile.file,
        jobDescription.trim() || undefined
      );

      // Instant local question generation so they are immediately available
      try {
        result.interviewQuestions = generateLocalInterviewQuestions(
          result,
          result.extractedText,
          Date.now()
        );
      } catch (qErr) {
        console.warn('[Local Questions Error]', qErr);
      }

      setAnalysisResult(result);
      setStatus('completed');
      addToast(
        'info',
        'Local Offline Analysis Complete',
        'Processed entirely inside browser memory using local heuristic taxonomy. Zero data transmitted.'
      );
    } catch (err: unknown) {
      const e = err as Error;
      setStatus('error');
      setError(e.message || 'An error occurred during local document analysis.');
      addToast('error', 'Local analysis failed', e.message);
    }
  }, [uploadedFile, jobDescription, addToast]);

  /**
   * Main execute analysis routine:
   * Uses server-side Gemini API when online/reachable,
   * Or transparently falls back to local analysis when offline/server unreachable (or user requests local).
   */
  const executeAnalysis = useCallback(async () => {
    if (!uploadedFile || !uploadedFile.file) {
      setError('Please select a resume file before initiating analysis.');
      return;
    }

    // If browser is physically offline or backend unreachable, run genuine local offline engine
    const isActuallyOffline = !navigator.onLine || !backendStatus.reachable;

    if (isActuallyOffline && !forceDemoMode) {
      return executeLocalAnalysis();
    }

    setStatus('uploading');
    setError(null);

    try {
      const result = await analyzeResume({
        file: uploadedFile.file,
        jobDescription: jobDescription.trim() || undefined,
        forceDemoMode,
      });

      // Start fetching questions in background immediately so they are ready when the user scrolls down
      fetchPersonalizedInterviewQuestions(
        result,
        result.extractedText,
        jobDescription.trim() || undefined
      )
        .then((questions) => {
          result.interviewQuestions = questions;
          setAnalysisResult((prev) => (prev && prev === result ? { ...prev, interviewQuestions: questions } : prev));
        })
        .catch((err) => {
          console.warn('[Pre-fetch Questions Error]', err);
        });

      setAnalysisResult(result);
      setStatus('completed');
      addToast(
        'success',
        'Analysis completed successfully.',
        result.metadata.sourceMode === 'demo_preview'
          ? 'Rendered in development preview mode.'
          : 'Processed via secure Gemini 3.8 Flash model.'
      );
    } catch (err: unknown) {
      const e = err as Error;
      setStatus('error');
      setError(e.message || 'An error occurred during resume analysis.');
      addToast('error', 'Analysis failed', e.message);
    }
  }, [uploadedFile, jobDescription, forceDemoMode, backendStatus.reachable, executeLocalAnalysis, addToast]);

  return {
    uploadedFile,
    jobDescription,
    setJobDescription,
    status,
    analysisResult,
    error,
    setError,
    forceDemoMode,
    setForceDemoMode,
    isOfflineMode,
    backendStatus,
    refreshBackendHealth,
    toasts,
    addToast,
    dismissToast,
    handleFileSelect,
    handleFileRemove,
    resetAll,
    loadSampleReport,
    executeAnalysis,
    executeLocalAnalysis,
  };
}
