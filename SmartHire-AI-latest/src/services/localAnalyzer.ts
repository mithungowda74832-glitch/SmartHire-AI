import {
  ResumeAnalysisResult,
  ScoreBreakdown,
  CategorizedSkills,
  ResumeStrength,
  ResumeImprovement,
  JobMatchAnalysis,
  CandidateProfile,
} from '../types/resume';
import { parseDocumentLocally } from './clientDocumentParser';

// Comprehensive local skill taxonomies
const TECHNICAL_SKILLS_DICTIONARY = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'go', 'rust', 'ruby', 'php',
  'swift', 'kotlin', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
  'graphql', 'rest api', 'restful apis', 'grpc', 'microservices', 'html5', 'css3', 'sass',
  'data structures', 'algorithms', 'distributed systems', 'system design', 'machine learning',
  'deep learning', 'nlp', 'computer vision', 'data engineering', 'etl', 'pandas', 'numpy',
  'tensorflow', 'pytorch', 'scikit-learn', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
  'terraform', 'ci/cd', 'git', 'linux', 'bash', 'node.js', 'express', 'django', 'fastapi',
  'flask', 'spring boot', 'react', 'next.js', 'vue', 'angular', 'svelte', 'tailwind css',
];

const TOOLS_FRAMEWORKS_DICTIONARY = [
  'react', 'next.js', 'vue.js', 'angular', 'svelte', 'express.js', 'django', 'fastapi', 'flask',
  'spring boot', 'tailwind css', 'bootstrap', 'material ui', 'vite', 'webpack', 'docker',
  'kubernetes', 'helm', 'terraform', 'ansible', 'jenkins', 'github actions', 'gitlab ci',
  'postman', 'jest', 'cypress', 'playwright', 'pytest', 'junit', 'kafka', 'rabbitmq',
  'aws lambda', 'amazon s3', 'dynamodb', 'google cloud platform', 'azure devops', 'jira',
  'confluence', 'figma', 'notion', 'tableau', 'power bi', 'snowflake', 'bigquery',
];

const LEADERSHIP_SOFT_DICTIONARY = [
  'cross-functional leadership', 'stakeholder management', 'mentorship', 'team leadership',
  'agile development', 'scrum', 'sprint planning', 'code reviews', 'technical writing',
  'incident management', 'architecture governance', 'client communication', 'problem solving',
  'project management', 'strategic roadmapping', 'collaboration', 'public speaking',
];

const ACTION_VERBS = [
  'architected', 'spearheaded', 'engineered', 'developed', 'optimized', 'scaled', 'implemented',
  'designed', 'reduced', 'increased', 'accelerated', 'transformed', 'delivered', 'automated',
  'streamlined', 'mentored', 'established', 'audited', 'built', 'created', 'launched',
  'integrated', 'directed', 'refactored', 'orchestrated', 'pioneered',
];

/**
 * Runs genuine client-side resume analysis entirely in the browser memory.
 * No network requests, zero external APIs, zero data leaves the user's device.
 */
export async function analyzeResumeLocally(
  file: File,
  jobDescription?: string
): Promise<ResumeAnalysisResult> {
  const parsed = await parseDocumentLocally(file);
  const text = parsed.text;
  const lowerText = text.toLowerCase();

  // 1. Candidate profile heuristics
  const profile = extractCandidateProfile(text, lowerText);

  // 2. Skill taxonomy matching
  const extractedSkills = extractSkillsFromText(lowerText);

  // 3. Quantitative outcome detection & Action verbs
  const metricsFound = detectMetrics(text);
  const verbsFound = ACTION_VERBS.filter((verb) => new RegExp(`\\b${verb}\\b`, 'i').test(lowerText));

  // 4. Section structure analysis
  const hasExperience = /(experience|work history|employment|professional background)/i.test(lowerText);
  const hasEducation = /(education|university|college|bachelor|master|phd|degree|gpa)/i.test(lowerText);
  const hasSkillsSection = /(skills|technologies|proficiencies|competencies)/i.test(lowerText);
  const hasContact = Boolean(profile.email || profile.phone);

  // 5. Compute objective rubric scores (0-100)
  // Impact: metrics count, action verb diversity
  const metricScore = Math.min(25, metricsFound.length * 5);
  const verbScore = Math.min(25, verbsFound.length * 3);
  const impactRaw = metricScore + verbScore; // 0-50 mapped to 0-100
  const impactScore = Math.min(95, Math.max(35, Math.round(impactRaw * 2)));

  // Brevity & Formatting: word count hygiene (400 - 900 words optimal)
  let brevityScore = 80;
  if (parsed.wordCount < 250) brevityScore = 55; // too short
  else if (parsed.wordCount > 1300) brevityScore = 65; // too long for standard 1-2 page
  else if (parsed.wordCount >= 380 && parsed.wordCount <= 850) brevityScore = 90;

  // Skills Clarity: total technical/tool skills recognized
  const totalSkillsCount =
    extractedSkills.technical.length +
    extractedSkills.toolsAndFrameworks.length +
    extractedSkills.leadershipAndSoft.length;
  const skillsScore = Math.min(95, Math.max(40, 45 + totalSkillsCount * 3));

  // Experience Relevance: section presence, active verb density
  let experienceScore = 70;
  if (!hasExperience) experienceScore -= 30;
  if (verbsFound.length >= 6) experienceScore += 15;
  if (hasEducation) experienceScore += 5;
  experienceScore = Math.min(95, Math.max(35, experienceScore));

  const overallScore = Math.round(
    impactScore * 0.35 +
    brevityScore * 0.2 +
    skillsScore * 0.25 +
    experienceScore * 0.2
  );

  const scoreBreakdown: ScoreBreakdown = {
    impact: {
      score: impactScore,
      max: 100,
      label: 'Measurable Impact',
      assessment: `${metricsFound.length} quantified metric(s) and ${verbsFound.length} strong action verb(s) detected locally.`,
    },
    brevityAndFormatting: {
      score: brevityScore,
      max: 100,
      label: 'Length & Brevity',
      assessment: `Document length is approximately ${parsed.wordCount} words across ${parsed.pageCount || 1} page(s).`,
    },
    skillsClarity: {
      score: skillsScore,
      max: 100,
      label: 'Skill Recognition',
      assessment: `${totalSkillsCount} recognized technical, framework, and leadership keywords identified from offline taxonomy.`,
    },
    experienceRelevance: {
      score: experienceScore,
      max: 100,
      label: 'Structure & Completeness',
      assessment: `Essential sections detected: Experience (${hasExperience ? '✓' : '✗'}), Education (${hasEducation ? '✓' : '✗'}), Skills (${hasSkillsSection ? '✓' : '✗'}), Contact Info (${hasContact ? '✓' : '✗'}).`,
    },
  };

  // 6. Strengths
  const strengths: ResumeStrength[] = [];
  if (metricsFound.length >= 2) {
    strengths.push({
      id: 'str-metrics',
      headline: 'Evidence of Quantifiable Outcomes',
      description: `Detected ${metricsFound.length} measurable metric indicators (e.g. percentages, scale, currency, latency, performance multipliers).`,
      evidence: metricsFound.slice(0, 3).join(', '),
    });
  }
  if (extractedSkills.technical.length >= 5) {
    strengths.push({
      id: 'str-tech-breadth',
      headline: 'Strong Technical Competency Density',
      description: `Identified ${extractedSkills.technical.length} verified engineering keywords directly mapped in the candidate profile.`,
      evidence: extractedSkills.technical.slice(0, 5).join(', '),
    });
  }
  if (verbsFound.length >= 5) {
    strengths.push({
      id: 'str-verbs',
      headline: 'Action-Oriented Experience Phrasing',
      description: `Consistent use of high-impact action verbs establishing direct candidate ownership.`,
      evidence: verbsFound.slice(0, 6).join(', '),
    });
  }
  if (strengths.length === 0) {
    strengths.push({
      id: 'str-baseline',
      headline: 'Structured Document Layout',
      description: 'Document adheres to clear textual formatting with readable work history and technical sections.',
    });
  }

  // 7. Improvements
  const improvements: ResumeImprovement[] = [];
  if (metricsFound.length < 3) {
    improvements.push({
      id: 'imp-quantify',
      category: 'Impact & Outcomes',
      severity: 'high',
      title: 'Increase Quantified Results in Experience Bullets',
      actionableFeedback: 'Several achievement descriptions lack numerical evidence. Whenever possible, add metrics answering: By how much? At what scale? Over what timeframe?',
      suggestedRevision: 'Before: "Improved database query response time." → After: "Optimized PostgreSQL indexes and query plans, reducing P99 latency by 42% across 5M daily requests."',
    });
  }
  if (verbsFound.length < 5) {
    improvements.push({
      id: 'imp-verbs',
      category: 'Action Verbs',
      severity: 'medium',
      title: 'Replace Passive Responsibilities with Direct Ownership Verbs',
      actionableFeedback: 'Avoid passive opening phrases like "Responsible for", "Helped with", or "Assisted in". Begin every bullet with a definitive past-tense action verb.',
      suggestedRevision: 'Example verbs to integrate: Architected, Automated, Spearheaded, Refactored, Delivered, Scaled.',
    });
  }
  if (!hasEducation) {
    improvements.push({
      id: 'imp-edu',
      category: 'Completeness',
      severity: 'medium',
      title: 'Verify Education & Credentials Visibility',
      actionableFeedback: 'An explicit Education or Certifications heading was not clearly recognized during local parsing. Ensure degree, institution, and graduation year are easily scannable.',
    });
  }
  if (parsed.wordCount > 1100) {
    improvements.push({
      id: 'imp-length',
      category: 'Brevity',
      severity: 'low',
      title: 'Trim Older or Redundant Bullet Points',
      actionableFeedback: `At ~${parsed.wordCount} words, the document may exceed 2 pages. Condense older roles to 2-3 focused lines to preserve maximum recruiter focus on recent impact.`,
    });
  }

  // 8. Local Job Description Keyword Match (if supplied)
  let jobMatch: JobMatchAnalysis | undefined;
  if (jobDescription && jobDescription.trim().length > 15) {
    jobMatch = evaluateJobMatchLocally(lowerText, jobDescription.trim());
  }

  return {
    candidate: profile,
    overallScore,
    scoreBreakdown,
    extractedSkills,
    strengths,
    improvements,
    jobMatch,
    extractedText: text,
    metadata: {
      fileName: file.name,
      fileSizeBytes: file.size,
      fileType: parsed.format.toUpperCase(),
      analyzedAt: new Date().toISOString(),
      wordCountEstimate: parsed.wordCount,
      sourceMode: 'local_offline',
      offlineDetails: {
        engine: 'SmartHire Browser In-Memory Heuristic Engine v2.0 (Offline Native)',
        parsedLocally: true,
        disclaimer:
          'LOCAL OFFLINE ANALYSIS: Generated entirely on your device without cloud API access. Keyword extraction and rubric scoring are heuristic calculations. For deep semantic evaluation, connect to the network to use the Gemini AI engine.',
        limitations: [
          'Scored via deterministic local keyword taxonomy and lexical pattern matching.',
          'Does not perform full semantic contextual reasoning like cloud Gemini models.',
          'Job description alignment is based on lexical keyword co-occurrence, not semantic embedding similarity.',
          'Zero data was transmitted over the network.',
        ],
      },
    },
  };
}

/**
 * Extracts candidate information from resume text using regex patterns
 */
function extractCandidateProfile(text: string, lowerText: string): CandidateProfile {
  const profile: CandidateProfile = {};

  // Email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/);
  if (emailMatch) profile.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) profile.phone = phoneMatch[0];

  // Candidate Name: heuristic from top 3 non-empty lines
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 2 && l.length < 50);
  if (lines.length > 0) {
    const candidateNameLine = lines[0];
    if (!candidateNameLine.includes('@') && !candidateNameLine.includes('http') && !/resume|curriculum/i.test(candidateNameLine)) {
      profile.name = candidateNameLine;
    }
  }

  // Location heuristic
  const locationMatch = text.match(/\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]+))\b/);
  if (locationMatch) profile.location = locationMatch[1];

  return profile;
}

/**
 * Extracts skills matching recognized taxonomies
 */
function extractSkillsFromText(lowerText: string): CategorizedSkills {
  const technical = TECHNICAL_SKILLS_DICTIONARY.filter((skill) =>
    new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i').test(lowerText)
  );

  const toolsAndFrameworks = TOOLS_FRAMEWORKS_DICTIONARY.filter((tool) =>
    new RegExp(`\\b${escapeRegex(tool)}\\b`, 'i').test(lowerText)
  );

  const leadershipAndSoft = LEADERSHIP_SOFT_DICTIONARY.filter((soft) =>
    new RegExp(`\\b${escapeRegex(soft)}\\b`, 'i').test(lowerText)
  );

  return {
    technical: Array.from(new Set(technical)),
    toolsAndFrameworks: Array.from(new Set(toolsAndFrameworks)),
    leadershipAndSoft: Array.from(new Set(leadershipAndSoft)),
  };
}

/**
 * Detects quantified outcomes (percentages, multipliers, scale, currency)
 */
function detectMetrics(text: string): string[] {
  const matches: string[] = [];
  const regexes = [
    /\b\d+(?:\.\d+)?%\b/g, // percentages (e.g. 25%, 99.9%)
    /\$\s*\d+(?:,\d{3})*(?:\.\d+)?[KkMmBb]?\b/g, // dollars ($500K, $2M)
    /\b\d+\s*(?:ms|seconds|minutes|hours|days|weeks|x|fold)\b/gi, // speed/multipliers
    /\b(?:increased|reduced|saved|cut|grew|scaled|handled|supported)\s+(?:by\s+)?(?:\$|\d+)/gi, // action + numbers
  ];

  regexes.forEach((r) => {
    const found = text.match(r);
    if (found) {
      matches.push(...found);
    }
  });

  return Array.from(new Set(matches.map((m) => m.trim()))).slice(0, 10);
}

/**
 * Performs local keyword matching between target job description and resume
 */
function evaluateJobMatchLocally(resumeLower: string, jdText: string): JobMatchAnalysis {
  const jdLower = jdText.toLowerCase();

  // Combine dictionaries to find what the job requires
  const allKnownKeywords = [
    ...TECHNICAL_SKILLS_DICTIONARY,
    ...TOOLS_FRAMEWORKS_DICTIONARY,
    ...LEADERSHIP_SOFT_DICTIONARY,
  ];

  const jdRequiredKeywords = allKnownKeywords.filter((kw) =>
    new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i').test(jdLower)
  );

  const matched = jdRequiredKeywords.filter((kw) =>
    new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i').test(resumeLower)
  );

  const missing = jdRequiredKeywords.filter((kw) => !matched.includes(kw));

  const totalRequired = jdRequiredKeywords.length;
  const matchPercentage = totalRequired > 0 ? Math.round((matched.length / totalRequired) * 100) : 75;

  return {
    matchScore: Math.min(98, Math.max(25, matchPercentage)),
    alignmentSummary: `LOCAL KEYWORD COMPARISON: Detected ${matched.length} of ${totalRequired} key technical and leadership terms referenced in the target job description.`,
    matchedRequirements: matched.slice(0, 12),
    missingOrGaps: missing.slice(0, 10),
    recommendations: [
      `Review missing job keywords (${missing.slice(0, 4).join(', ') || 'none detected'}) and integrate legitimate experience where applicable.`,
      'Ensure the job title and specific tools requested are referenced in recent project bullet points.',
      'Note: This is an offline lexical keyword comparison, not a semantic deep-learning evaluation.',
    ],
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
