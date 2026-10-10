# SmartHire AI — AI Resume Analyzer

**Analyze your resume. Understand your strengths. Discover opportunities to improve.**

SmartHire AI is an AI-powered resume analysis web application that helps users understand their resumes through structured insights into skills, experience, education, projects, and potential areas for improvement.

🌐 **Live Website:** [Open Smart Hire AI](https://smarthire-ai-gqa8.onrender.com/)

---

## Overview

SmartHire AI allows users to upload a resume and receive an AI-generated analysis report without creating an account. The application extracts relevant resume information and presents useful feedback to help users understand how their resume communicates their qualifications.

The project is designed with a simple user experience, responsive interface, and support for web-based and installable app experiences where supported.

## Features

* **AI-Powered Resume Analysis** — Generate insights from uploaded resumes.
* **Resume Upload** — Supports PDF and DOCX, with TXT support where enabled.
* **Resume Information Extraction** — Identify available information such as skills, experience, education, and projects.
* **Skills Analysis** — Review skills identified in the resume.
* **Resume Strengths** — Understand areas that are clearly represented.
* **Improvement Suggestions** — Identify missing details and opportunities to improve resume content.
* **Target Job Description** — Optionally provide a job description for more relevant analysis, if enabled.
* **Analysis Report** — Review the generated results in a structured format.
* **Responsive Interface** — Designed for desktop and mobile browsers.
* **PWA Support** — Installation may be available on compatible browsers and devices.

## How It Works

1. Open the SmartHire AI website.
2. Upload your resume.
3. Optionally provide a target job description, if supported.
4. Let the application process and analyze the resume.
5. Review the analysis report and improvement suggestions.
6. Start a new analysis when needed.

## Technology Stack

The project uses technologies including:

* **Frontend:** React, TypeScript, and Vite
* **Backend:** Node.js and Express
* **AI Integration:** Google Gemini API
* **Document Processing:** PDF and DOCX parsing libraries
* **Web Application:** Responsive frontend with Progressive Web App support

## Run Locally

### Prerequisites

* Node.js and npm
* A Google Gemini API key for AI-powered analysis

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mithungowda74832-glitch/SmartHire-AI.git
   ```

2. Open the application folder:

   ```bash
   cd SmartHire-AI/SmartHire-AI-latest
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the application folder and add your API key:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Replace the placeholder with your own key. Never commit your `.env` file or publish secret API keys.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in your terminal.

### Production Build

To build the frontend for production:

```bash
npm run build
```

To start the application using its configured start script:

```bash
npm start
```

## Deployment

SmartHire AI is deployed using Render. The live website link is provided at the top of this README.

Deployment requires the correct Node.js environment, project root directory, build and start commands, and securely configured environment variables.

## Privacy and Security

* Resume files can contain sensitive personal information. Upload only documents you have permission to process.
* Keep API keys in server-side environment variables.
* Never expose secret keys in frontend code or commit them to GitHub.
* Do not assume uploaded files or analysis records are private without verifying the application's storage and access controls.
* Temporary resume files and analysis data should be handled securely and removed when no longer needed.

## Project Goal

The goal of SmartHire AI is to make resume analysis more accessible by providing understandable, actionable feedback through an AI-powered web application.

---

**SmartHire AI** — An AI-powered approach to understanding and improving resumes.
