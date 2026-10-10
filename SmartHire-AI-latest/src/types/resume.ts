export interface CandidateProfile {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  titleOrHeadline?: string;
  summary?: string;
  yearsOfExperience?: number | string;
}

export interface ScoreCategory {
  score: number;
  max: number;
  label: string;
  assessment: string;
}

export interface ScoreBreakdown {
  impact: ScoreCategory;
  brevityAndFormatting: ScoreCategory;
  skillsClarity: ScoreCategory;
  experienceRelevance: ScoreCategory;
}

export interface CategorizedSkills {
  technical: string[];
  toolsAndFrameworks: string[];
  leadershipAndSoft: string[];
}

export interface ResumeStrength {
  id: string;
  headline: string;
  description: string;
  evidence?: string;
}

export interface ResumeImprovement {
  id: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  actionableFeedback: string;
  suggestedRevision?: string;
}

export interface JobMatchAnalysis {
  matchScore: number;
  jobTitleDetected?: string;
  alignmentSummary: string;
  matchedRequirements: string[];
  missingOrGaps: string[];
  recommendations: string[];
}

export interface PersonalizedQuestionsData {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
  source: 'online_gemini' | 'offline_local';
  generatedAt: string;
}

export type InterviewDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ResumeAnalysisResult {
  candidate?: CandidateProfile;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  extractedSkills: CategorizedSkills;
  strengths: ResumeStrength[];
  improvements: ResumeImprovement[];
  jobMatch?: JobMatchAnalysis;
  extractedText?: string;
  interviewQuestions?: PersonalizedQuestionsData;
  metadata: {
    fileName: string;
    fileSizeBytes: number;
    fileType: string;
    analyzedAt: string;
    wordCountEstimate?: number;
    sourceMode: 'live_api' | 'demo_preview' | 'local_offline';
    offlineDetails?: {
      engine: string;
      parsedLocally: boolean;
      disclaimer: string;
      limitations: string[];
    };
  };
}

export interface UploadedFileState {
  file: File | null;
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  textPreview?: string;
}

export type AnalysisStatus = 'idle' | 'validating' | 'uploading' | 'parsing' | 'evaluating' | 'completed' | 'error';
