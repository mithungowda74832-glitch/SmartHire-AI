import { GoogleGenAI, Type } from '@google/genai';
import { ParsedDocument } from './documentParser';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      'GEMINI_API_KEY is not configured on the server. Please set your Gemini API key in AI Studio Secrets to enable live AI resume analysis.'
    );
  }

  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    candidate: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        titleOrHeadline: { type: Type.STRING },
        summary: { type: Type.STRING },
        yearsOfExperience: { type: Type.NUMBER },
      },
      required: ['name', 'summary'],
    },
    overallScore: {
      type: Type.NUMBER,
      description: 'Overall resume quality score between 0 and 100 based on standard screening criteria.',
    },
    scoreBreakdown: {
      type: Type.OBJECT,
      properties: {
        impact: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Score out of 25' },
            max: { type: Type.NUMBER },
            label: { type: Type.STRING },
            assessment: { type: Type.STRING },
          },
          required: ['score', 'max', 'label', 'assessment'],
        },
        brevityAndFormatting: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Score out of 25' },
            max: { type: Type.NUMBER },
            label: { type: Type.STRING },
            assessment: { type: Type.STRING },
          },
          required: ['score', 'max', 'label', 'assessment'],
        },
        skillsClarity: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Score out of 25' },
            max: { type: Type.NUMBER },
            label: { type: Type.STRING },
            assessment: { type: Type.STRING },
          },
          required: ['score', 'max', 'label', 'assessment'],
        },
        experienceRelevance: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Score out of 25' },
            max: { type: Type.NUMBER },
            label: { type: Type.STRING },
            assessment: { type: Type.STRING },
          },
          required: ['score', 'max', 'label', 'assessment'],
        },
      },
      required: ['impact', 'brevityAndFormatting', 'skillsClarity', 'experienceRelevance'],
    },
    extractedSkills: {
      type: Type.OBJECT,
      properties: {
        technical: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Languages, system architectures, database systems, core domain competencies',
        },
        toolsAndFrameworks: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Frameworks, developer tools, cloud providers, CI/CD tools',
        },
        leadershipAndSoft: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Mentorship, product collaboration, communication, agile methodologies',
        },
      },
      required: ['technical', 'toolsAndFrameworks', 'leadershipAndSoft'],
    },
    strengths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          headline: { type: Type.STRING },
          description: { type: Type.STRING },
          evidence: { type: Type.STRING, description: 'Direct quote or verbatim example from the resume document' },
        },
        required: ['id', 'headline', 'description'],
      },
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING },
          severity: { type: Type.STRING, description: 'high, medium, or low' },
          title: { type: Type.STRING },
          actionableFeedback: { type: Type.STRING },
          suggestedRevision: { type: Type.STRING, description: 'Concrete before-and-after rewrite example' },
        },
        required: ['id', 'category', 'severity', 'title', 'actionableFeedback'],
      },
    },
    jobMatch: {
      type: Type.OBJECT,
      properties: {
        matchScore: { type: Type.NUMBER, description: 'Alignment match percentage 0-100' },
        jobTitleDetected: { type: Type.STRING },
        alignmentSummary: { type: Type.STRING },
        matchedRequirements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        missingOrGaps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        recommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['matchScore', 'alignmentSummary', 'matchedRequirements', 'missingOrGaps', 'recommendations'],
    },
  },
  required: [
    'candidate',
    'overallScore',
    'scoreBreakdown',
    'extractedSkills',
    'strengths',
    'improvements',
  ],
};

export async function analyzeResumeWithGemini(
  doc: ParsedDocument,
  fileName: string,
  fileSizeBytes: number,
  jobDescription?: string
) {
  const ai = getGeminiClient();

  const parts: any[] = [];

  // Pass document either as native PDF inlineData or parsed text
  if (doc.mimeType === 'application/pdf' && doc.pdfBase64) {
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: doc.pdfBase64,
      },
    });
    parts.push({
      text: 'Analyze the resume document attached above in detail.',
    });
  } else {
    parts.push({
      text: `RESUME DOCUMENT CONTENT:\n\n${doc.text}`,
    });
  }

  let promptDirective = `You are SmartHire AI, an executive resume reviewer and hiring systems evaluator.
Evaluate the uploaded resume thoroughly and objectively.
Do NOT invent candidate information, skills, or fake accomplishments. Extract only what is evidenced or directly implied by the resume text.

EVALUATION CRITERIA:
1. Overall Score (0-100): Calculated from 4 categories of max 25 each:
   - Quantified Impact & Verbs (metrics, measurable business outcomes, active action verbs vs passive duties)
   - Brevity & Formatting (visual hierarchy, layout flow, section headers, ATS-friendliness)
   - Skills Clarity (current relevant technologies, frameworks, depth vs fluff)
   - Career Depth & Trajectory (chronological coherence, leadership scope, promotions)
2. Extract Candidate Profile: Full name, contact details if found, current professional title, a 2-3 sentence executive summary, and estimated years of professional experience.
3. Skills Categorization: Technical skills, Tools & Frameworks, Leadership & Soft skills.
4. Identified Strengths: 3 concrete strengths with exact quotes/evidence from the resume.
5. Actionable Areas for Improvement: 3-5 specific suggestions with severity ('high', 'medium', 'low'), category, and suggested sentence revisions (concrete rewrite examples).
`;

  if (jobDescription && jobDescription.trim().length > 10) {
    promptDirective += `\nTARGET JOB DESCRIPTION PROVIDED BY CANDIDATE:
"""
${jobDescription.trim()}
"""
Perform target job alignment analysis:
- Calculate a realistic matchScore (0-100).
- Identify detected job title.
- Provide alignment summary.
- List matched requirements.
- Identify critical missing skills or keyword gaps.
- Provide actionable recommendations to bridge these gaps.
Include the "jobMatch" object in your JSON output.
`;
  } else {
    promptDirective += `\nNo target job description was provided. You must omit the "jobMatch" property or set it to null.`;
  }

  parts.push({ text: promptDirective });

  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let response: any = null;
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: ANALYSIS_SCHEMA as any,
          systemInstruction:
            'You are an expert talent acquisition director and ATS resume parser. Always return strictly valid JSON matching the requested schema. Be constructive, rigorous, and truthful.',
        },
      });
      if (response?.text) {
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[SmartHire AI] Model ${model} returned error, attempting fallback:`, err?.message || err);
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  if (!response?.text) {
    throw lastError || new Error('Failed to receive response from AI analysis model.');
  }

  const rawJson = response.text.trim();
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    throw new Error('Failed to parse model response as JSON: ' + rawJson.slice(0, 200));
  }

  // Ensure metadata is stamped
  parsed.metadata = {
    fileName,
    fileSizeBytes,
    fileType: doc.mimeType,
    analyzedAt: new Date().toISOString(),
    wordCountEstimate: doc.charCount ? Math.round(doc.charCount / 6) : 450,
    sourceMode: 'live_api',
  };

  // Preserve extracted document text so subsequent features never require re-uploading
  parsed.extractedText = doc.text;

  return parsed;
}

/**
 * Generates personalized interview questions directly tailored to the candidate's verified
 * skills, experience, projects, education, and achievements.
 * Speed-optimized:
 * - Exactly 9 questions total (3 Beginner, 3 Intermediate, 3 Advanced)
 * - Questions only (no answers, hints, explanations, answer guidance, or sample responses)
 * - Output token limit (600 tokens) and bounded execution timeout
 */
export async function generatePersonalizedInterviewQuestions(
  reportContext: any,
  resumeText?: string,
  jobDescription?: string
): Promise<{ beginner: string[]; intermediate: string[]; advanced: string[] }> {
  const ai = getGeminiClient();

  const candidateName = reportContext?.candidate?.name || 'Candidate';
  const candidateTitle = reportContext?.candidate?.titleOrHeadline || 'Professional';
  const candidateSummary = reportContext?.candidate?.summary || '';
  const technicalSkills = (reportContext?.extractedSkills?.technical || []).slice(0, 8).join(', ');
  const tools = (reportContext?.extractedSkills?.toolsAndFrameworks || []).slice(0, 8).join(', ');
  const softSkills = (reportContext?.extractedSkills?.leadershipAndSoft || []).slice(0, 5).join(', ');
  const strengths = (reportContext?.strengths || []).map((s: any) => `${s.headline}`).join('; ');
  const docText = resumeText || reportContext?.extractedText || '';

  const systemInstruction = `You are an expert technical interviewer.
Generate 9 personalized technical interview questions (exactly 3 Beginner, 3 Intermediate, 3 Advanced) strictly grounded in the candidate's actual skills, experience, and projects.

CRITICAL RULES:
1. QUESTIONS ONLY: Return ONLY standalone question strings. Absolutely NO answers, explanations, hints, grading criteria, or sample responses.
2. NINE QUESTIONS TOTAL: Exactly 3 Beginner (fundamentals), 3 Intermediate (practical application & projects), 3 Advanced (architecture & scale).
3. CONCISE & GROUNDED: Keep questions clear, focused, and directly tied to their specific technologies and metrics.`;

  let prompt = `Candidate: ${candidateName} (${candidateTitle})
Summary: ${candidateSummary}
Technical Skills: ${technicalSkills || 'Core engineering skills'}
Tools: ${tools || 'Standard tools'}
Leadership & Soft Skills: ${softSkills || 'Agile teamwork'}
Strengths: ${strengths || 'Consistent engineering execution'}`;

  if (jobDescription && jobDescription.trim().length > 10) {
    prompt += `\nTarget Role: ${jobDescription.trim().slice(0, 400)}`;
  }

  if (docText && docText.trim().length > 20) {
    prompt += `\n\nResume Excerpts:\n${docText.trim().slice(0, 2000)}`;
  }

  prompt += `\n\nGenerate exactly 3 Beginner, 3 Intermediate, and 3 Advanced questions (9 total). Return strictly JSON. QUESTIONS ONLY.`;

  const QUESTIONS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      beginner: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Exactly 3 foundational interview questions testing core concepts of their listed skills. Questions only.',
      },
      intermediate: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Exactly 3 practical application interview questions testing real-world projects and hands-on experience. Questions only.',
      },
      advanced: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Exactly 3 advanced interview questions testing system architecture, scale, and trade-offs. Questions only.',
      },
    },
    required: ['beginner', 'intermediate', 'advanced'],
  };

  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      // Fast bounded generation with timeout
      const generatePromise = ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: QUESTIONS_SCHEMA as any,
          systemInstruction,
          temperature: 0.4,
          maxOutputTokens: 600,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini request timed out after 8 seconds on ${model}`)), 8000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (response?.text) {
        const parsed = JSON.parse(response.text.trim());
        if (
          Array.isArray(parsed.beginner) &&
          Array.isArray(parsed.intermediate) &&
          Array.isArray(parsed.advanced)
        ) {
          return {
            beginner: parsed.beginner.slice(0, 3).map((q: string) => String(q).trim()),
            intermediate: parsed.intermediate.slice(0, 3).map((q: string) => String(q).trim()),
            advanced: parsed.advanced.slice(0, 3).map((q: string) => String(q).trim()),
          };
        }
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Interview Questions] Model ${model} error or timeout:`, err?.message || err);
    }
  }

  throw new Error(lastError?.message || 'Failed to generate interview questions with Gemini.');
}

/**
 * Handles grounded follow-up chat queries about the candidate's analysis report.
 * Speed-optimized:
 * - Direct single-request execution with 7-second timeout
 * - Uses gemini-3.1-flash-lite for rapid sub-2s responses
 * - Max output token limit (260 tokens) for fast, punchy responses (<120 words)
 * - Grounded strictly in compact candidate evaluation findings
 */
export async function askSmartHireAssistant(
  reportContext: any,
  userMessage: string,
  history: { role: 'user' | 'model'; content: string }[] = []
): Promise<string> {
  const ai = getGeminiClient();

  const candidateName = reportContext?.candidate?.name || 'Candidate';
  const candidateTitle =
    reportContext?.candidate?.title ||
    reportContext?.candidate?.titleOrHeadline ||
    'Professional';
  const overallScore = reportContext?.overallScore || 80;

  // Extract skills compactly
  const techSkills = (
    reportContext?.skills?.technical ||
    reportContext?.extractedSkills?.technical ||
    []
  )
    .slice(0, 8)
    .join(', ');
  const tools = (
    reportContext?.skills?.tools ||
    reportContext?.extractedSkills?.toolsAndFrameworks ||
    []
  )
    .slice(0, 8)
    .join(', ');

  // Extract improvements compactly
  const improvements = (reportContext?.improvements || [])
    .slice(0, 3)
    .map((i: any) => `- ${i.title}: ${i.actionableFeedback}`)
    .join('\n');

  // Job match context if present
  const jobMatchStr = reportContext?.jobMatch
    ? `Target Match: ${reportContext.jobMatch.matchScore}%. Missing Gaps: ${(
        reportContext.jobMatch.missingSkills ||
        reportContext.jobMatch.missingOrGaps ||
        []
      )
        .slice(0, 4)
        .join(', ')}`
    : '';

  const systemInstruction = `You are SmartHire AI, an expert technical career coach.
Candidate: ${candidateName} (${candidateTitle}). Resume Score: ${overallScore}/100.
Key Skills: ${techSkills || 'General engineering'} | Tools: ${tools || 'Standard tools'}
Key Growth Areas:
${improvements || 'Enhance measurable outcomes'}
${jobMatchStr}

CRITICAL RULES:
1. FAST & CONCISE: Answer in 1 to 2 punchy, highly actionable paragraphs (under 120 words total). Never write long essays or rambling introductions.
2. DIRECT & GROUNDED: Directly address the user's question with specific, practical guidance based on their report. If recommending a resume rewrite, provide one concise before/after bullet.
3. NO FABRICATION: Only refer to skills and facts from their actual report.`;

  const contents: any[] = [];

  // Add recent conversation history (max 3 turns, truncating older messages to 250 chars)
  const recentHistory = history.slice(-3);
  for (const h of recentHistory) {
    contents.push({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.content.slice(0, 250) }],
    });
  }

  // Add current user prompt
  contents.push({
    role: 'user',
    parts: [{ text: userMessage.trim().slice(0, 500) }],
  });

  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const generatePromise = ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.3,
          maxOutputTokens: 260,
        },
      });

      // 8-second timeout per model attempt
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Chat request timed out after 8 seconds on ${model}`)),
          8000
        )
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (response?.text && response.text.trim().length > 0) {
        return response.text.trim();
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[SmartHire Chat] Model ${model} error or timeout:`, err?.message || err);
    }
  }

  throw new Error(
    lastError?.message ||
      'The AI career coaching service is temporarily unavailable. Please click Retry.'
  );
}
