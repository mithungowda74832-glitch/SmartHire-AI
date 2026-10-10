import { ResumeAnalysisResult } from '../types/resume';
import { formatDate } from '../utils/formatters';

/**
 * Downloads a beautifully styled, self-contained HTML report that can be opened
 * in any browser, printed, or saved as PDF.
 */
export function exportReportAsHtml(result: ResumeAnalysisResult) {
  const isDemo = result.metadata.sourceMode === 'demo_preview';
  const isOffline = result.metadata.sourceMode === 'local_offline';
  const score = result.overallScore;
  const { impact, brevityAndFormatting, skillsClarity, experienceRelevance } = result.scoreBreakdown;

  const engineLabel = isDemo
    ? 'Development Preview (Offline Demonstration · DEMO DATA)'
    : isOffline
    ? 'SmartHire In-Browser Heuristic Engine (LOCAL OFFLINE ANALYSIS)'
    : 'Gemini 3.8 Flash Cloud Pipeline';

  const badgeHtml = isDemo
    ? '<span style="color: #b45309; font-size: 11px; background: #fef3c7; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">DEMO DATA</span>'
    : isOffline
    ? '<span style="color: #0369a1; font-size: 11px; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">LOCAL OFFLINE</span>'
    : '';

  const disclaimerNotice = isDemo
    ? '<div class="notice"><strong>DEMO DATA NOTICE:</strong> This report contains simulated demonstration data generated in Development Preview Mode because the backend is offline. These results are not real AI analysis.</div>'
    : isOffline
    ? `<div class="notice" style="background: #f0fdf4; border-color: #86efac; color: #166534;"><strong>LOCAL OFFLINE ANALYSIS:</strong> Generated entirely inside your local browser without external network requests or Gemini API calls. Keyword extraction and scoring are based on deterministic lexical heuristics. Zero data was transmitted over the network.</div>`
    : '';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SmartHire AI Analysis — ${escapeHtml(result.metadata.fileName)}</title>
  <style>
    @page { margin: 18mm 15mm; size: A4; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.6;
      margin: 0;
      padding: 32px 40px;
    }
    .header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .brand {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #2563eb;
      margin-bottom: 4px;
    }
    .title {
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }
    .meta-line {
      font-size: 13px;
      color: #64748b;
    }
    .notice {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 13px;
      color: #334155;
      margin-top: 14px;
    }
    .score-banner {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px 24px;
      margin-bottom: 28px;
      gap: 32px;
    }
    .score-circle {
      text-align: center;
      min-width: 100px;
    }
    .score-number {
      font-size: 44px;
      font-weight: 800;
      color: #2563eb;
      line-height: 1;
    }
    .score-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-top: 4px;
    }
    .criteria-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      flex: 1;
    }
    .criteria-item {
      font-size: 13px;
    }
    .criteria-name {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .progress-bar-bg {
      background: #e2e8f0;
      height: 6px;
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-bar-fill {
      background: #2563eb;
      height: 100%;
    }
    .section {
      margin-bottom: 28px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 12px;
    }
    .skills-block {
      margin-bottom: 12px;
    }
    .skills-category {
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
    }
    .skills-list {
      font-size: 14px;
      color: #1e293b;
    }
    .strength-item, .improvement-item {
      margin-bottom: 14px;
      padding: 12px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }
    .item-title {
      font-weight: 600;
      font-size: 14px;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .item-text {
      font-size: 13px;
      color: #334155;
      margin: 0;
    }
    .item-quote {
      font-size: 12px;
      font-style: italic;
      color: #475569;
      margin-top: 6px;
      padding-left: 10px;
      border-left: 2px solid #cbd5e1;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      margin-top: 36px;
      padding-top: 16px;
      font-size: 12px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">SmartHire AI · Evaluation Report ${badgeHtml}</div>
    <h1 class="title">${escapeHtml(result.metadata.fileName)}</h1>
    <div class="meta-line">
      Analyzed on ${formatDate(result.metadata.analyzedAt)} · Engine: ${engineLabel}
    </div>
    ${disclaimerNotice}
  </div>

  <div class="score-banner">
    <div class="score-circle">
      <div class="score-number">${score}</div>
      <div class="score-label">Overall Score</div>
    </div>
    <div class="criteria-grid">
      <div class="criteria-item">
        <div class="criteria-name">
          <span>${escapeHtml(impact.label)}</span>
          <span>${impact.score} / ${impact.max}</span>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${
          (impact.score / impact.max) * 100
        }%"></div></div>
      </div>
      <div class="criteria-item">
        <div class="criteria-name">
          <span>${escapeHtml(brevityAndFormatting.label)}</span>
          <span>${brevityAndFormatting.score} / ${brevityAndFormatting.max}</span>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${
          (brevityAndFormatting.score / brevityAndFormatting.max) * 100
        }%"></div></div>
      </div>
      <div class="criteria-item">
        <div class="criteria-name">
          <span>${escapeHtml(skillsClarity.label)}</span>
          <span>${skillsClarity.score} / ${skillsClarity.max}</span>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${
          (skillsClarity.score / skillsClarity.max) * 100
        }%"></div></div>
      </div>
      <div class="criteria-item">
        <div class="criteria-name">
          <span>${escapeHtml(experienceRelevance.label)}</span>
          <span>${experienceRelevance.score} / ${experienceRelevance.max}</span>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${
          (experienceRelevance.score / experienceRelevance.max) * 100
        }%"></div></div>
      </div>
    </div>
  </div>

  ${
    result.candidate?.summary
      ? `<div class="section">
    <div class="section-title">Candidate Profile & Summary</div>
    <p class="item-text">${escapeHtml(result.candidate.summary)}</p>
  </div>`
      : ''
  }

  <div class="section">
    <div class="section-title">Detected Skills Inventory</div>
    <div class="skills-block">
      <div class="skills-category">Technical Competencies</div>
      <div class="skills-list">${result.extractedSkills.technical.join(' · ') || 'None detected'}</div>
    </div>
    <div class="skills-block">
      <div class="skills-category">Tools & Frameworks</div>
      <div class="skills-list">${result.extractedSkills.toolsAndFrameworks.join(' · ') || 'None detected'}</div>
    </div>
    <div class="skills-block">
      <div class="skills-category">Leadership & Domain Strengths</div>
      <div class="skills-list">${result.extractedSkills.leadershipAndSoft.join(' · ') || 'None detected'}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Identified Resume Strengths</div>
    ${result.strengths
      .map(
        (s) => `
      <div class="strength-item">
        <div class="item-title">${escapeHtml(s.headline)}</div>
        <div class="item-text">${escapeHtml(s.description)}</div>
        ${s.evidence ? `<div class="item-quote">${escapeHtml(s.evidence)}</div>` : ''}
      </div>
    `
      )
      .join('')}
  </div>

  <div class="section">
    <div class="section-title">Actionable Areas for Improvement</div>
    ${result.improvements
      .map(
        (imp) => `
      <div class="improvement-item">
        <div class="item-title">${escapeHtml(imp.title)} <span style="font-size: 11px; text-transform: uppercase; color: #dc2626;">[${imp.severity}]</span></div>
        <div class="item-text">${escapeHtml(imp.actionableFeedback)}</div>
        ${
          imp.suggestedRevision
            ? `<div class="item-quote">Suggested Revision: ${escapeHtml(imp.suggestedRevision)}</div>`
            : ''
        }
      </div>
    `
      )
      .join('')}
  </div>

  ${
    result.jobMatch
      ? `
  <div class="section">
    <div class="section-title">Target Job Match Analysis (${result.jobMatch.matchScore}%)</div>
    <p class="item-text"><strong>Summary:</strong> ${escapeHtml(result.jobMatch.alignmentSummary)}</p>
    <div style="margin-top: 10px;">
      <div class="skills-category">Matched Requirements</div>
      <div class="skills-list">${result.jobMatch.matchedRequirements.join(' · ')}</div>
    </div>
    <div style="margin-top: 10px;">
      <div class="skills-category">Identified Gaps & Missing Skills</div>
      <div class="skills-list" style="color: #b91c1c;">${result.jobMatch.missingOrGaps.join(' · ') || 'No critical gaps'}</div>
    </div>
  </div>
  `
      : ''
  }

  ${
    result.interviewQuestions
      ? `
  <div class="section">
    <div class="section-title">Your Personalized Interview Questions</div>
    <div style="margin-top: 10px;">
      <div class="skills-category">Beginner — Fundamentals</div>
      <ol style="margin: 6px 0 16px 20px; padding: 0;">
        ${result.interviewQuestions.beginner.map((q) => `<li style="margin-bottom: 6px;">${escapeHtml(q)}</li>`).join('')}
      </ol>
      <div class="skills-category">Intermediate — Practical Application</div>
      <ol style="margin: 6px 0 16px 20px; padding: 0;">
        ${result.interviewQuestions.intermediate.map((q) => `<li style="margin-bottom: 6px;">${escapeHtml(q)}</li>`).join('')}
      </ol>
      <div class="skills-category">Advanced — In-Depth Expertise</div>
      <ol style="margin: 6px 0 16px 20px; padding: 0;">
        ${result.interviewQuestions.advanced.map((q) => `<li style="margin-bottom: 6px;">${escapeHtml(q)}</li>`).join('')}
      </ol>
    </div>
  </div>
  `
      : ''
  }

  <div class="footer">
    <div>SmartHire AI — Document Intelligence</div>
    <div>Confidential Analysis</div>
  </div>
</body>
</html>`;

  triggerFileDownload(
    htmlContent,
    `smarthire-analysis-${sanitizeFilename(result.metadata.fileName)}.html`,
    'text/html'
  );
}

/**
 * Downloads a structured Markdown report.
 */
export function exportReportAsMarkdown(result: ResumeAnalysisResult) {
  const isDemo = result.metadata.sourceMode === 'demo_preview';
  let md = `# SmartHire AI — Resume Analysis Report ${isDemo ? '[DEMO DATA]' : ''}\n\n`;
  if (isDemo) {
    md += `> **NOTICE (DEMO DATA):** This report was generated in Development Preview Mode with simulated demonstration data. It does not represent real AI analysis.\n\n`;
  }
  md += `**Document:** ${result.metadata.fileName}\n`;
  md += `**Analyzed Date:** ${formatDate(result.metadata.analyzedAt)}\n`;
  md += `**Engine:** ${isDemo ? 'Development Preview (Offline Demonstration · DEMO DATA)' : 'FastAPI Production Service'}\n\n`;

  md += `## Overall Score: ${result.overallScore} / 100\n\n`;
  md += `### Score Breakdown\n`;
  md += `- **${result.scoreBreakdown.impact.label}:** ${result.scoreBreakdown.impact.score}/${result.scoreBreakdown.impact.max}\n`;
  md += `- **${result.scoreBreakdown.brevityAndFormatting.label}:** ${result.scoreBreakdown.brevityAndFormatting.score}/${result.scoreBreakdown.brevityAndFormatting.max}\n`;
  md += `- **${result.scoreBreakdown.skillsClarity.label}:** ${result.scoreBreakdown.skillsClarity.score}/${result.scoreBreakdown.skillsClarity.max}\n`;
  md += `- **${result.scoreBreakdown.experienceRelevance.label}:** ${result.scoreBreakdown.experienceRelevance.score}/${result.scoreBreakdown.experienceRelevance.max}\n\n`;

  if (result.candidate?.summary) {
    md += `## Candidate Summary\n${result.candidate.summary}\n\n`;
  }

  md += `## Detected Skills\n`;
  md += `- **Technical:** ${result.extractedSkills.technical.join(', ')}\n`;
  md += `- **Tools & Frameworks:** ${result.extractedSkills.toolsAndFrameworks.join(', ')}\n`;
  md += `- **Leadership & Soft Skills:** ${result.extractedSkills.leadershipAndSoft.join(', ')}\n\n`;

  md += `## Key Strengths\n`;
  result.strengths.forEach((s) => {
    md += `### ${s.headline}\n${s.description}\n`;
    if (s.evidence) md += `> *Evidence:* ${s.evidence}\n`;
    md += `\n`;
  });

  md += `## Actionable Areas for Improvement\n`;
  result.improvements.forEach((imp) => {
    md += `### [${imp.severity.toUpperCase()}] ${imp.title}\n${imp.actionableFeedback}\n`;
    if (imp.suggestedRevision) {
      md += `*Suggested Revision:* \`${imp.suggestedRevision}\`\n`;
    }
    md += `\n`;
  });

  if (result.jobMatch) {
    md += `## Job Match Alignment (${result.jobMatch.matchScore}%)\n`;
    md += `${result.jobMatch.alignmentSummary}\n\n`;
    md += `**Matched Requirements:**\n`;
    result.jobMatch.matchedRequirements.forEach((r) => (md += `- ${r}\n`));
    md += `\n**Missing Skills & Gaps:**\n`;
    result.jobMatch.missingOrGaps.forEach((g) => (md += `- ${g}\n`));
  }

  if (result.interviewQuestions) {
    md += `\n## Your Personalized Interview Questions\n\n`;
    md += `### Beginner — Fundamentals\n`;
    result.interviewQuestions.beginner.forEach((q, idx) => {
      md += `${idx + 1}. ${q}\n`;
    });
    md += `\n### Intermediate — Practical Application\n`;
    result.interviewQuestions.intermediate.forEach((q, idx) => {
      md += `${idx + 1}. ${q}\n`;
    });
    md += `\n### Advanced — In-Depth Expertise\n`;
    result.interviewQuestions.advanced.forEach((q, idx) => {
      md += `${idx + 1}. ${q}\n`;
    });
  }

  triggerFileDownload(
    md,
    `smarthire-analysis-${sanitizeFilename(result.metadata.fileName)}.md`,
    'text/markdown'
  );
}

/**
 * Downloads the raw structured JSON report.
 */
export function exportReportAsJson(result: ResumeAnalysisResult) {
  const jsonContent = JSON.stringify(result, null, 2);
  triggerFileDownload(
    jsonContent,
    `smarthire-analysis-${sanitizeFilename(result.metadata.fileName)}.json`,
    'application/json'
  );
}

function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 40);
}
