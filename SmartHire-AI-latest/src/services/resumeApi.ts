import { ResumeAnalysisResult, PersonalizedQuestionsData } from '../types/resume';
import { generateLocalInterviewQuestions } from './localInterviewGenerator';

export interface AnalyzeResumeRequest {
  file: File;
  jobDescription?: string;
  forceDemoMode?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface BackendConfig {
  url: string;
  isValid: boolean;
  status: 'configured' | 'same_origin';
  message: string;
}

/**
 * Returns the configured base URL for the backend API.
 * Uses VITE_API_BASE_URL if explicitly configured with an HTTP/HTTPS URL,
 * or defaults to same-origin relative endpoints for the full-stack server.
 */
export function getBackendConfig(): BackendConfig {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const cleanUrl = trimmed.replace(/\/+$/, '');
      return {
        url: cleanUrl,
        isValid: true,
        status: 'configured',
        message: `External backend configured at ${cleanUrl}`,
      };
    }
  }

  // Same-origin full-stack Express backend (default)
  return {
    url: '',
    isValid: true,
    status: 'same_origin',
    message: 'Full-stack server connected via same-origin API routes.',
  };
}

/**
 * Returns the base URL for API requests.
 */
export function getApiBaseUrl(): string {
  const config = getBackendConfig();
  return config.url;
}

/**
 * Checks the status/health of the server-side backend and Gemini engine.
 */
export async function checkBackendHealth(): Promise<{
  reachable: boolean;
  url: string;
  message: string;
  geminiConfigured: boolean;
}> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/public/health`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const hasGemini = Boolean(data.geminiConfigured);

      return {
        reachable: true,
        url: baseUrl || 'same-origin',
        geminiConfigured: hasGemini,
        message: hasGemini
          ? 'Full-stack backend connected with active Gemini AI engine.'
          : 'Full-stack backend connected. (Note: attach GEMINI_API_KEY in AI Studio Secrets for live AI parsing).',
      };
    }

    return {
      reachable: false,
      url: baseUrl || 'same-origin',
      geminiConfigured: false,
      message: `Backend returned status ${res.status}.`,
    };
  } catch {
    return {
      reachable: false,
      url: baseUrl || 'same-origin',
      geminiConfigured: false,
      message: 'Could not connect to the backend server. Verify the server is running.',
    };
  }
}

/**
 * Sends the resume and optional job description to the backend endpoint:
 * POST /api/public/analyze-resume
 */
export async function analyzeResume({
  file,
  jobDescription,
  forceDemoMode = false,
}: AnalyzeResumeRequest): Promise<ResumeAnalysisResult> {
  // Preview mode: strictly client-side simulated data, never calls the live API
  if (forceDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    return generateDemoPreviewResult(file, jobDescription);
  }

  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/public/analyze-resume`;

  const formData = new FormData();
  formData.append('resume', file);
  if (jobDescription && jobDescription.trim().length > 0) {
    formData.append('job_description', jobDescription.trim());
  }

  try {
    const controller = new AbortController();
    // 45-second timeout for document parsing & Gemini model inference
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server error (${response.status} ${response.statusText})`;
      try {
        const errorData = await response.json();
        if (errorData?.detail && errorData?.error) {
          errorMessage = `${errorData.error}: ${typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail)}`;
        } else if (errorData?.detail) {
          errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Fallback to status text
      }
      const err = new Error(errorMessage);
      (err as any).isServerError = true;
      throw err;
    }

    const payload = await response.json();
    return normalizeBackendResponse(payload, file, jobDescription);
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'AbortError') {
      throw new Error('Analysis request timed out after 45 seconds. The document may be large or complex.');
    }

    // Pass through exact error from backend response
    if ((error as any).isServerError || error.message.startsWith('Server error')) {
      throw error;
    }

    // Network / Connection failure
    throw new Error(
      `Unable to connect to the backend service at ${endpoint}. ` +
      `Ensure the server is running, or switch to Development Preview Mode to test offline.`
    );
  }
}

/**
 * Extracts a lightweight, highly compact context representation of the evaluation report
 * for rapid transmission over HTTP without sending raw document bodies.
 */
export function extractCompactChatContext(report: ResumeAnalysisResult) {
  return {
    candidate: {
      name: report.candidate?.name || 'Candidate',
      title: report.candidate?.titleOrHeadline || 'Professional',
      summary: report.candidate?.summary?.slice(0, 300) || '',
    },
    overallScore: report.overallScore,
    skills: {
      technical: (report.extractedSkills?.technical || []).slice(0, 8),
      tools: (report.extractedSkills?.toolsAndFrameworks || []).slice(0, 8),
      soft: (report.extractedSkills?.leadershipAndSoft || []).slice(0, 5),
    },
    improvements: (report.improvements || []).slice(0, 3).map((i) => ({
      title: i.title,
      severity: i.severity,
      actionableFeedback: i.actionableFeedback?.slice(0, 200),
    })),
    jobMatch: report.jobMatch
      ? {
          matchScore: report.jobMatch.matchScore,
          missingSkills: (report.jobMatch.missingOrGaps || []).slice(0, 5),
        }
      : undefined,
  };
}

/**
 * Sends a grounded follow-up chat question to the server-side Gemini assistant:
 * POST /api/public/chat
 * Speed-optimized:
 * - Sends compact context payload
 * - Configured with 10s timeout
 * - Prevents hanging requests
 */
export async function askSmartHireChat(
  message: string,
  reportContext: ResumeAnalysisResult,
  history: { role: 'user' | 'model'; content: string }[] = [],
  signal?: AbortSignal
): Promise<string> {
  const startTime = performance.now();
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/public/chat`;

  const compactContext = extractCompactChatContext(reportContext);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  // Link external signal if provided
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message.trim(),
        reportContext: compactContext,
        history: history.slice(-3),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const elapsed = Math.round(performance.now() - startTime);
    console.debug(`[SmartHire Chat] Response received in ${elapsed}ms`);

    if (!response.ok) {
      let errorDetail = `Status ${response.status}`;
      try {
        const data = await response.json();
        errorDetail = data.detail || data.error || errorDetail;
      } catch {
        // Ignored
      }
      throw new Error(`Chat assistant error: ${errorDetail}`);
    }

    const data = await response.json();
    if (!data.reply || typeof data.reply !== 'string' || data.reply.trim().length === 0) {
      throw new Error('Received an empty response from the AI assistant.');
    }
    return data.reply.trim();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('abort')) {
      throw new Error('Request timed out after 10 seconds. Please click Retry.');
    }
    throw new Error(msg);
  }
}

/**
 * Fetches or generates personalized interview questions for the candidate.
 * Strictly questions only across Beginner, Intermediate, and Advanced tiers.
 * Grounded in the candidate's actual resume content.
 * Uses secure server-side Gemini when online, or local offline engine when offline.
 */
export async function fetchPersonalizedInterviewQuestions(
  reportContext: ResumeAnalysisResult,
  resumeText?: string,
  jobDescription?: string,
  forceOffline?: boolean
): Promise<PersonalizedQuestionsData> {
  const isActuallyOffline =
    forceOffline ||
    !navigator.onLine ||
    reportContext.metadata.sourceMode === 'local_offline';

  if (isActuallyOffline) {
    return generateLocalInterviewQuestions(
      reportContext,
      resumeText || reportContext.extractedText,
      Date.now()
    );
  }

  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/public/interview-questions`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportContext,
        resumeText: resumeText || reportContext.extractedText,
        jobDescription,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = `Status ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.error || errorDetail;
      } catch {
        // Ignored
      }

      // If Gemini is not configured on the server, gracefully fallback to local offline generation
      if (response.status === 503) {
        console.warn(
          `[InterviewQuestions] Gemini key not configured on server (${errorDetail}). Using local offline generator.`
        );
        return generateLocalInterviewQuestions(
          reportContext,
          resumeText || reportContext.extractedText,
          Date.now()
        );
      }

      throw new Error(errorDetail);
    }

    const data = await response.json();
    return {
      beginner: Array.isArray(data.beginner) ? data.beginner.slice(0, 3) : [],
      intermediate: Array.isArray(data.intermediate) ? data.intermediate.slice(0, 3) : [],
      advanced: Array.isArray(data.advanced) ? data.advanced.slice(0, 3) : [],
      source: 'online_gemini',
      generatedAt: data.generatedAt || new Date().toISOString(),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[InterviewQuestions] Online call failed, evaluating fallback:', msg);

    // Fallback to local offline generator if connection aborted, offline, or network dropped
    if (
      msg.includes('abort') ||
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError') ||
      !navigator.onLine
    ) {
      return generateLocalInterviewQuestions(
        reportContext,
        resumeText || reportContext.extractedText,
        Date.now()
      );
    }

    throw new Error(msg);
  }
}



/**
 * Normalizes responses from the FastAPI backend into the standard ResumeAnalysisResult structure.
 */
function normalizeBackendResponse(
  raw: any,
  file: File,
  jobDescription?: string
): ResumeAnalysisResult {
  // If the backend already returned a fully structured ResumeAnalysisResult
  const overallScore = Math.round(
    Number(raw.overallScore ?? raw.overall_score ?? raw.score ?? 78)
  );

  const breakdown = raw.scoreBreakdown || raw.score_breakdown || {};
  const impact = breakdown.impact || {};
  const brevity = breakdown.brevityAndFormatting || breakdown.brevity_formatting || {};
  const skillsClarity = breakdown.skillsClarity || breakdown.skills_clarity || {};
  const expRelevance = breakdown.experienceRelevance || breakdown.experience_relevance || {};

  const extracted = raw.extractedSkills || raw.skills || {};
  const technicalSkills = Array.isArray(extracted.technical)
    ? extracted.technical
    : Array.isArray(raw.technical_skills)
    ? raw.technical_skills
    : [];

  const toolsSkills = Array.isArray(extracted.toolsAndFrameworks)
    ? extracted.toolsAndFrameworks
    : Array.isArray(extracted.tools_frameworks)
    ? extracted.tools_frameworks
    : Array.isArray(raw.tools)
    ? raw.tools
    : [];

  const softSkills = Array.isArray(extracted.leadershipAndSoft)
    ? extracted.leadershipAndSoft
    : Array.isArray(extracted.soft_skills)
    ? extracted.soft_skills
    : Array.isArray(raw.soft_skills)
    ? raw.soft_skills
    : [];

  const jobMatchRaw = raw.jobMatch || raw.job_match;

  return {
    candidate: {
      name: raw.candidate?.name || raw.candidate_name,
      email: raw.candidate?.email || raw.email,
      phone: raw.candidate?.phone || raw.phone,
      location: raw.candidate?.location || raw.location,
      titleOrHeadline:
        raw.candidate?.titleOrHeadline ||
        raw.candidate?.headline ||
        raw.candidate?.title ||
        raw.headline,
      summary: raw.candidate?.summary || raw.summary,
      yearsOfExperience:
        raw.candidate?.yearsOfExperience ??
        raw.candidate?.years_of_experience ??
        raw.years_of_experience,
    },
    overallScore,
    scoreBreakdown: {
      impact: {
        score: Math.round(Number(impact.score ?? raw.impact_score ?? 20)),
        max: Number(impact.max ?? 25),
        label: impact.label ?? 'Quantified Impact & Verbs',
        assessment:
          impact.assessment ??
          'Evaluates measurable achievements, metrics, and strong action verbs.',
      },
      brevityAndFormatting: {
        score: Math.round(
          Number(brevity.score ?? raw.formatting_score ?? 21)
        ),
        max: Number(brevity.max ?? 25),
        label: brevity.label ?? 'Brevity & Layout Flow',
        assessment:
          brevity.assessment ??
          'Analyzes density, white space balance, heading consistency, and ATS readability.',
      },
      skillsClarity: {
        score: Math.round(
          Number(skillsClarity.score ?? raw.skills_score ?? 22)
        ),
        max: Number(skillsClarity.max ?? 25),
        label: skillsClarity.label ?? 'Skills Clarity',
        assessment:
          skillsClarity.assessment ??
          'Assesses modern technical terminology, tool proficiencies, and domain nomenclature.',
      },
      experienceRelevance: {
        score: Math.round(
          Number(expRelevance.score ?? raw.relevance_score ?? 19)
        ),
        max: Number(expRelevance.max ?? 25),
        label: expRelevance.label ?? 'Career Trajectory & Depth',
        assessment:
          expRelevance.assessment ??
          'Measures progression of responsibility, leadership scope, and chronological coherence.',
      },
    },
    extractedSkills: {
      technical: technicalSkills,
      toolsAndFrameworks: toolsSkills,
      leadershipAndSoft: softSkills,
    },
    strengths: Array.isArray(raw.strengths)
      ? raw.strengths.map((s: any, idx: number) => ({
          id: s.id || `str-${idx}`,
          headline:
            typeof s === 'string'
              ? s
              : s.headline || s.title || 'Identified Strength',
          description:
            typeof s === 'string' ? '' : s.description || s.detail || '',
          evidence: typeof s === 'string' ? undefined : s.evidence,
        }))
      : [],
    improvements: Array.isArray(raw.improvements)
      ? raw.improvements.map((imp: any, idx: number) => ({
          id: imp.id || `imp-${idx}`,
          category: imp.category || imp.area || 'General',
          severity:
            imp.severity === 'high' ||
            imp.severity === 'medium' ||
            imp.severity === 'low'
              ? imp.severity
              : 'medium',
          title: imp.title || imp.headline || 'Recommendation',
          actionableFeedback:
            imp.actionableFeedback ||
            imp.actionable_feedback ||
            imp.feedback ||
            imp.description ||
            '',
          suggestedRevision:
            imp.suggestedRevision || imp.suggested_revision || imp.example_fix,
        }))
      : [],
    jobMatch: jobMatchRaw
      ? {
          matchScore: Math.round(
            Number(
              jobMatchRaw.matchScore ??
                jobMatchRaw.match_score ??
                jobMatchRaw.score ??
                75
            )
          ),
          jobTitleDetected:
            jobMatchRaw.jobTitleDetected ||
            jobMatchRaw.job_title_detected ||
            jobMatchRaw.target_role,
          alignmentSummary:
            jobMatchRaw.alignmentSummary ||
            jobMatchRaw.alignment_summary ||
            jobMatchRaw.summary ||
            '',
          matchedRequirements: Array.isArray(jobMatchRaw.matchedRequirements)
            ? jobMatchRaw.matchedRequirements
            : Array.isArray(jobMatchRaw.matched_requirements)
            ? jobMatchRaw.matched_requirements
            : [],
          missingOrGaps: Array.isArray(jobMatchRaw.missingOrGaps)
            ? jobMatchRaw.missingOrGaps
            : Array.isArray(jobMatchRaw.missing_skills)
            ? jobMatchRaw.missing_skills
            : [],
          recommendations: Array.isArray(jobMatchRaw.recommendations)
            ? jobMatchRaw.recommendations
            : [],
        }
      : undefined,
    extractedText: raw.extractedText || raw.text || raw.resume_text,
    metadata: {
      fileName: raw.metadata?.fileName || file.name,
      fileSizeBytes: raw.metadata?.fileSizeBytes || file.size,
      fileType:
        raw.metadata?.fileType ||
        file.type ||
        file.name.split('.').pop()?.toUpperCase() ||
        'DOCUMENT',
      analyzedAt: raw.metadata?.analyzedAt || new Date().toISOString(),
      wordCountEstimate:
        raw.metadata?.wordCountEstimate ||
        raw.metadata?.word_count ||
        Math.round(file.size / 7),
      sourceMode: raw.metadata?.sourceMode || 'live_api',
    },
  };
}

/**
 * Generates an explicitly marked development preview result when testing locally
 * without a connected Python FastAPI service.
 */
export function generateDemoPreviewResult(file: File, jobDescription?: string): ResumeAnalysisResult {
  const hasJobDesc = Boolean(jobDescription && jobDescription.trim().length > 20);

  let detectedRoleTitle = 'Target Role';
  if (hasJobDesc && jobDescription) {
    const roleMatch = jobDescription.match(/Role:\s*([^\n\r(]+)/i);
    if (roleMatch && roleMatch[1]) {
      detectedRoleTitle = roleMatch[1].trim();
    } else {
      const firstLine = jobDescription.trim().split('\n')[0].replace(/^#+\s*/, '').trim();
      detectedRoleTitle = firstLine.length > 0 && firstLine.length < 50 ? firstLine : 'Target Role';
    }
  }

  return {
    candidate: {
      name: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      email: 'candidate.preview@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA (Remote eligible)',
      titleOrHeadline: 'Senior Software Engineer & Systems Architect',
      summary:
        'Experienced engineer with 7+ years architecting distributed microservices, TypeScript/React interfaces, and real-time data pipelines. Proven record of scaling systems to 10M+ monthly users while maintaining 99.98% reliability.',
      yearsOfExperience: 7,
    },
    overallScore: 82,
    scoreBreakdown: {
      impact: {
        score: 21,
        max: 25,
        label: 'Quantified Impact & Verbs',
        assessment: 'Strong utilization of operational metrics (latency reduction, revenue impact, scale benchmarks).',
      },
      brevityAndFormatting: {
        score: 22,
        max: 25,
        label: 'Brevity & Layout Flow',
        assessment: 'Clean visual hierarchy, logical chronological progression, and standard section demarcations.',
      },
      skillsClarity: {
        score: 20,
        max: 25,
        label: 'Skills Keyword Density',
        assessment: 'Core modern frameworks and database technologies clearly enumerated without acronym bloat.',
      },
      experienceRelevance: {
        score: 19,
        max: 25,
        label: 'Career Trajectory & Depth',
        assessment: 'Demonstrable scope progression from individual contributor to technical lead.',
      },
    },
    extractedSkills: {
      technical: [
        'TypeScript',
        'Node.js',
        'Python',
        'PostgreSQL',
        'Distributed Systems',
        'REST APIs',
        'GraphQL',
        'Data Modeling',
      ],
      toolsAndFrameworks: [
        'React',
        'FastAPI',
        'Docker',
        'Kubernetes',
        'AWS (ECS, S3, RDS)',
        'Redis',
        'Git',
        'Terraform',
      ],
      leadershipAndSoft: [
        'Technical Mentorship',
        'Architecture Reviews',
        'Cross-Functional Leadership',
        'Sprint Prioritization',
        'Root Cause Analysis',
      ],
    },
    strengths: [
      {
        id: 'str-1',
        headline: 'Consistent Metric-Driven Outcome Statements',
        description: 'Over 65% of bullet points pair an action verb directly with measurable business outcomes.',
        evidence: '"Reduced average p99 query latency from 320ms to 48ms via Redis cache warming."',
      },
      {
        id: 'str-2',
        headline: 'Clear Modern Technology Stack',
        description: 'Skills are current and mapped directly to modern production engineering standards.',
        evidence: 'TypeScript, FastAPI, Docker, and Kubernetes featured prominently across recent roles.',
      },
      {
        id: 'str-3',
        headline: 'High Signal-to-Noise Formatting',
        description: 'Standard single-column format with accessible hierarchy minimizes ATS parsing ambiguities.',
      },
    ],
    improvements: [
      {
        id: 'imp-1',
        category: 'Impact Quantization',
        severity: 'high',
        title: 'Add business outcomes to earlier roles',
        actionableFeedback:
          'Several bullet points in your earliest 2018–2020 positions explain duties rather than outcomes.',
        suggestedRevision:
          'Change "Responsible for managing MySQL databases" to "Optimized 14 production MySQL clusters, reducing backup downtime by 40%."',
      },
      {
        id: 'imp-2',
        category: 'Brevity & Conciseness',
        severity: 'medium',
        title: 'Tighten summary paragraph',
        actionableFeedback:
          'The executive summary spans 6 lines; distill to 3 focused sentences emphasizing core domain mastery and leadership scope.',
      },
      {
        id: 'imp-3',
        category: 'Certification & Education',
        severity: 'low',
        title: 'Specify cloud or architectural certifications',
        actionableFeedback:
          'If you hold AWS Solutions Architect or Kubernetes CKA credentials, position them prominently in your top summary header.',
      },
    ],
    jobMatch: hasJobDesc
      ? {
          matchScore: 84,
          jobTitleDetected: detectedRoleTitle,
          alignmentSummary: `Demonstrates strong alignment with ${detectedRoleTitle} specifications. The candidate profile satisfies 7 of 9 essential technical and domain prerequisites.`,
          matchedRequirements: [
            'Proficiency in Python and TypeScript microservices',
            'Relational database architecture (PostgreSQL)',
            'Containerization and cloud orchestration (Docker, K8s)',
            '5+ years production engineering experience',
          ],
          missingOrGaps: [
            'Kafka / Event streaming messaging architecture',
            'Direct experience with Go or Rust (mentioned as preferred qualification)',
          ],
          recommendations: [
            'Highlight any message queue systems (RabbitMQ, SQS, Celery) to bridge the event-streaming requirement.',
            'Reference system observability tools (Datadog, Prometheus) in the recent projects section.',
          ],
        }
      : undefined,
    metadata: {
      fileName: file.name,
      fileSizeBytes: file.size,
      fileType: file.type || file.name.split('.').pop()?.toUpperCase() || 'PDF',
      analyzedAt: new Date().toISOString(),
      wordCountEstimate: 540,
      sourceMode: 'demo_preview',
    },
  };
}
