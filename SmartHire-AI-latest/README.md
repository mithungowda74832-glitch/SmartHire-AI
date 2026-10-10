# SmartHire AI — AI Resume Analyzer

SmartHire AI helps users understand and improve their resumes through AI-powered analysis.

## Features

* Upload resumes in PDF, DOCX, or TXT format where supported.
* Extract skills, experience, education, and project details.
* Review resume strengths and areas for improvement.
* Optionally analyze a resume against a target job description.
* View and export analysis results where supported.
* Responsive interface with Progressive Web App (PWA) support.

## Run Locally

**Prerequisite:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your Gemini API key in your local environment file, following the project's existing configuration.

3. Start the development server:

   ```bash
   npm run dev
   ```

## Security

* Never commit API keys, passwords, or other secrets.
* Keep private configuration in local environment files.
* Resume data should be handled securely and isolated between users.
