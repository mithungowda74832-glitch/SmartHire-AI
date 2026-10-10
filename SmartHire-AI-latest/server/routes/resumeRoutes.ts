import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseDocument } from '../services/documentParser';
import {
  analyzeResumeWithGemini,
  askSmartHireAssistant,
  generatePersonalizedInterviewQuestions,
} from '../services/geminiService';

export const resumeRouter = Router();

// Configure multer memory storage with 10 MB file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    const lowerName = file.originalname.toLowerCase();
    const isAllowedExt =
      lowerName.endsWith('.pdf') ||
      lowerName.endsWith('.docx') ||
      lowerName.endsWith('.txt');

    if (isAllowedExt) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Unsupported file format. Please upload a PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) document.'
        )
      );
    }
  },
});

/**
 * Health check endpoint:
 * GET /api/public/health or GET /api/health
 */
resumeRouter.get(['/public/health', '/health'], (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0
  );

  res.json({
    status: 'ok',
    service: 'SmartHire AI Server-Side Engine',
    geminiConfigured: hasGeminiKey,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Main resume analysis endpoint:
 * POST /api/public/analyze-resume or POST /api/analyze-resume
 */
resumeRouter.post(
  ['/public/analyze-resume', '/analyze-resume'],
  upload.single('resume'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          error: 'No resume file provided.',
          detail: 'Please upload a file using the multipart/form-data field name "resume".',
        });
        return;
      }

      const file = req.file;
      const jobDescription = req.body?.job_description || req.body?.jobDescription;

      // 1. Parse document text and layout
      const parsedDoc = await parseDocument(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      // 2. Perform server-side Gemini AI analysis
      const analysisResult = await analyzeResumeWithGemini(
        parsedDoc,
        file.originalname,
        file.size,
        jobDescription
      );

      res.status(200).json(analysisResult);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[ResumeAnalysisError]', error);

      // Check if Gemini key missing
      if (error.message.includes('GEMINI_API_KEY is not configured')) {
        res.status(503).json({
          error: 'Gemini AI API key is not configured on the server.',
          detail:
            'Please configure GEMINI_API_KEY in your AI Studio Secrets panel, or use Development Preview Mode to test the user interface offline.',
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to complete resume analysis.',
        detail: error.message || 'An unexpected error occurred during document parsing.',
      });
    }
  }
);

/**
 * AI follow-up chat endpoint grounded in report:
 * POST /api/public/chat or POST /api/chat
 */
resumeRouter.post(
  ['/public/chat', '/chat'],
  async (req: Request, res: Response): Promise<void> => {
    const t0 = Date.now();
    try {
      const { message, reportContext, history } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'A valid message string is required.' });
        return;
      }

      if (!reportContext) {
        res.status(400).json({ error: 'reportContext is required for grounded answers.' });
        return;
      }

      const tGeminiStart = Date.now();
      const reply = await askSmartHireAssistant(
        reportContext,
        message,
        Array.isArray(history) ? history : []
      );
      const geminiElapsed = Date.now() - tGeminiStart;
      const totalElapsed = Date.now() - t0;
      console.log(
        `[SmartHire Chat Route] Gemini model took ${geminiElapsed}ms (total route: ${totalElapsed}ms)`
      );

      res.json({ reply, timingMs: { gemini: geminiElapsed, total: totalElapsed } });
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[ChatAssistantError]', error);

      if (error.message.includes('GEMINI_API_KEY is not configured')) {
        res.status(503).json({
          error: 'Gemini AI key is not configured on the server for chat.',
        });
        return;
      }

      res.status(500).json({
        error: 'Chat assistant encountered an error.',
        detail: error.message,
      });
    }
  }
);

/**
 * Personalized interview questions endpoint:
 * POST /api/public/interview-questions or POST /api/interview-questions
 */
resumeRouter.post(
  ['/public/interview-questions', '/interview-questions'],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportContext, resumeText, jobDescription } = req.body;

      if (!reportContext) {
        res.status(400).json({
          error: 'reportContext is required to generate personalized interview questions.',
        });
        return;
      }

      const questions = await generatePersonalizedInterviewQuestions(
        reportContext,
        resumeText,
        jobDescription
      );

      res.json({
        ...questions,
        source: 'online_gemini',
        generatedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[InterviewQuestionsError]', error);

      if (error.message.includes('GEMINI_API_KEY is not configured')) {
        res.status(503).json({
          error: 'Gemini AI key is not configured on the server for interview question generation.',
          detail: 'Configure GEMINI_API_KEY in your AI Studio Secrets panel, or use offline local generation.',
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to generate personalized interview questions.',
        detail: error.message || 'An unexpected error occurred while generating interview questions.',
      });
    }
  }
);
