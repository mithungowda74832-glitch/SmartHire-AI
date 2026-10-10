import { ResumeAnalysisResult, PersonalizedQuestionsData } from '../types/resume';

export const SAMPLE_PYTHON_RESUME_TEXT = `Liam Vance
Seattle, WA · liam.vance@example.dev · (206) 555-0182 · linkedin.com/in/liam-vance-dev · github.com/liamvance

OBJECTIVE
Motivated Junior Python Developer with 1.5 years of practical software development experience building RESTful APIs, automation scripts, and database-backed services. Seeking to contribute core Python engineering skills to an agile engineering team.

TECHNICAL SKILLS
• Languages: Python (3.10+), SQL (PostgreSQL), JavaScript (ES6+), HTML5/CSS3
• Frameworks & Libraries: FastAPI, Flask, SQLAlchemy, Pydantic, Pytest, Pandas, Celery
• Databases & Caching: PostgreSQL, Redis, SQLite
• Developer Tools: Git, GitHub Actions, Docker, Linux (Ubuntu), Postman, VS Code

EXPERIENCE
Junior Software Developer | CloudScale Solutions (Contract)
June 2024 – Present | Seattle, WA
• Developed 8+ RESTful microservice endpoints in FastAPI for internal customer reporting, reducing manual data export time by 38%.
• Refactored legacy raw SQL queries to SQLAlchemy ORM with query indexing, improving average endpoint latency from 420ms to 180ms.
• Built automated CI test pipelines using Pytest and GitHub Actions, achieving 84% code test coverage across core reporting modules.
• Designed Redis caching layers for frequently requested analytics summaries, serving over 15,000 cached requests daily.

Software Engineering Intern | DataBridge Labs
October 2023 – May 2024 | Remote
• Wrote Python ETL scripts to parse, clean, and validate 250,000+ daily CSV and JSON log records into PostgreSQL tables.
• Created automated data sanitization routines utilizing Pandas and Pydantic data schemas.
• Participated in weekly sprint planning, daily standups, and submitted 35+ reviewed pull requests.

PROJECTS
TaskStream — Asynchronous Job Dispatcher (Personal Project)
• Built an asynchronous task execution engine with FastAPI, Celery, and Redis backend.
• Implemented JWT token authentication and role-based permissions for user workloads.
• Dockerized entire multi-container architecture with docker-compose for zero-friction local deployments.

EDUCATION
B.S. in Computer Science | University of Washington
Graduated June 2023 | GPA: 3.7/4.0
`;

export const SAMPLE_JOB_DESCRIPTION_TEXT = `Junior Python Developer
Company: Apex Cloud Technologies
Location: Hybrid (Seattle, WA or Remote)
Department: Backend Engineering

About the Role:
We are seeking an enthusiastic Junior Python Developer to join our backend platform team. In this role, you will help design, build, and maintain high-throughput web APIs and data pipelines that power our core analytics products.

Responsibilities:
• Develop, test, and maintain robust REST APIs using Python (FastAPI / Flask).
• Write clean, readable, maintainable, and thoroughly tested code using Pytest.
• Collaborate with senior engineers on database modeling with PostgreSQL and SQLAlchemy.
• Optimize application performance using Redis caching and asynchronous queues (Celery).
• Containerize microservices with Docker and deploy through GitHub Actions CI/CD pipelines.
• Troubleshoot production bugs and improve system observability.

Requirements:
• 1–3 years of programming experience in Python (academic, internships, or professional).
• Hands-on familiarity with modern web frameworks (FastAPI or Flask).
• Solid understanding of relational databases (PostgreSQL preferred) and SQL queries.
• Experience writing unit and integration tests with Pytest.
• Working knowledge of Git version control and GitHub workflow.
• Familiarity with Docker containerization and REST API principles.
• Strong problem-solving mindset and eagerness to learn from senior engineers.

Nice to Have:
• Experience with Redis or message queues (RabbitMQ, Kafka, Celery).
• Familiarity with AWS or GCP cloud fundamentals.
• Exposure to Pydantic, typing hints, or asynchronous Python (asyncio).
`;

export const SAMPLE_INTERVIEW_QUESTIONS: PersonalizedQuestionsData = {
  beginner: [
    'What are the core differences between Python lists and tuples, and in what scenarios would you choose a tuple for immutability?',
    'How does FastAPI use Pydantic models and Python type hints to perform request payload validation and serialize response models?',
    'What is the difference between a clustered and non-clustered index in PostgreSQL, and how does indexing improve query performance?',
  ],
  intermediate: [
    'On your resume, you highlight refactoring SQL queries to SQLAlchemy ORM and improving query latency from 420ms to 180ms. What specific query plans or indexing strategies did you implement?',
    'How do you manage database session lifecycles and transactions in FastAPI using dependency injection (`Depends`) to prevent leaked connections?',
    'In your TaskStream personal project, how did you orchestrate asynchronous job execution between FastAPI, Celery, and Redis?',
  ],
  advanced: [
    'How would you architect a distributed task queue system like TaskStream to guarantee at-least-once task delivery without duplicate side-effects during worker node crashes?',
    'When scaling FastAPI and PostgreSQL horizontally across multiple container replicas, how do you handle connection pool exhaustion (e.g., using connection multiplexing)?',
    'How would you diagnose and mitigate asynchronous event loop starvation or blocking I/O calls inside a high-throughput FastAPI application?',
  ],
  source: 'online_gemini',
  generatedAt: new Date().toISOString(),
};

export const SAMPLE_PYTHON_REPORT: ResumeAnalysisResult = {
  candidate: {
    name: 'Liam Vance',
    email: 'liam.vance@example.dev',
    phone: '(206) 555-0182',
    location: 'Seattle, WA',
    titleOrHeadline: 'Junior Python Developer',
    summary:
      'Motivated Junior Python Developer with 1.5 years of practical software development experience building RESTful APIs, automation scripts, and database-backed services. Seeking to contribute core Python engineering skills to an agile engineering team.',
    yearsOfExperience: 1.5,
  },
  overallScore: 86,
  scoreBreakdown: {
    impact: {
      score: 22,
      max: 25,
      label: 'Quantified Impact & Metrics',
      assessment:
        'Strong metrics demonstrating performance improvements (latency drop from 420ms to 180ms, 84% test coverage, 38% export time reduction).',
    },
    brevityAndFormatting: {
      score: 23,
      max: 25,
      label: 'Brevity & Layout Flow',
      assessment:
        'Clean single-page structure with standard reverse-chronological sections, consistent bullet typography, and zero extraneous fluff.',
    },
    skillsClarity: {
      score: 21,
      max: 25,
      label: 'Skills Ontology & Taxonomy',
      assessment:
        'Clearly partitioned technical skills including modern Python 3.10+, FastAPI, PostgreSQL, Redis, Docker, and Pytest.',
    },
    experienceRelevance: {
      score: 20,
      max: 25,
      label: 'Target Role Alignment',
      assessment:
        'Direct alignment with junior backend engineering tasks: API endpoints, ORM data queries, unit testing, and containerization.',
    },
  },
  extractedSkills: {
    technical: [
      'Python',
      'FastAPI',
      'Flask',
      'SQLAlchemy',
      'PostgreSQL',
      'Redis',
      'SQLite',
      'Pydantic',
      'Pandas',
      'Celery',
      'REST APIs',
      'SQL',
    ],
    toolsAndFrameworks: [
      'Git',
      'GitHub Actions',
      'Docker',
      'Pytest',
      'Postman',
      'Linux (Ubuntu)',
      'VS Code',
      'CI/CD Pipelines',
    ],
    leadershipAndSoft: [
      'Agile Sprint Planning',
      'Code Review Collaboration',
      'Cross-functional Communication',
      'Documentation',
    ],
  },
  strengths: [
    {
      id: 'str-1',
      headline: 'Exceptional Quantified Latency & Speed Gains',
      description:
        'The candidate measures tangible engineering outcomes rather than just listing daily tasks.',
      evidence:
        'Refactored legacy SQL queries to SQLAlchemy with query indexing, improving average endpoint latency from 420ms to 180ms.',
    },
    {
      id: 'str-2',
      headline: 'High Test Coverage & Automated CI Discipline',
      description:
        'Demonstrates engineering maturity uncommon in early-career developers by creating automated pipelines and achieving 84% test coverage.',
      evidence:
        'Built automated CI test pipelines using Pytest and GitHub Actions, achieving 84% code test coverage.',
    },
    {
      id: 'str-3',
      headline: 'Modern Async Stack Familiarity',
      description:
        'Actively works with modern async Python primitives (FastAPI, Redis caching, Celery queues), matching contemporary cloud backend paradigms.',
      evidence:
        'Designed Redis caching layers for frequently requested analytics summaries, serving over 15,000 cached requests daily.',
    },
  ],
  improvements: [
    {
      id: 'imp-1',
      category: 'Impact Depth',
      severity: 'medium',
      title: 'Clarify Business Impact of Intern ETL Pipelines',
      actionableFeedback:
        'The intern project mentions processing 250,000+ daily log records. Mention who consumed this data or what downtime/reporting errors were eliminated.',
      suggestedRevision:
        'Engineered daily ETL pipeline for 250,000+ customer audit records, eliminating manual ingest backlog and enabling real-time billing reconciliation.',
    },
    {
      id: 'imp-2',
      category: 'Cloud Deployment',
      severity: 'low',
      title: 'Highlight Cloud Hosting Environment',
      actionableFeedback:
        'Docker is referenced, but cloud provider deployment experience (AWS ECS/EC2, GCP Cloud Run, or Kubernetes) is omitted. Even personal hobby deployment helps.',
      suggestedRevision:
        'Containerized multi-service architecture using Docker & deployed staging prototype to GCP Cloud Run / AWS.',
    },
    {
      id: 'imp-3',
      category: 'Soft Skills Proof',
      severity: 'low',
      title: 'Quantify Code Review & Peer Collaboration',
      actionableFeedback:
        'Mention the volume or nature of pull requests reviewed to signal collaborative peer review readiness.',
      suggestedRevision:
        'Participated in agile ceremonies and completed 35+ peer pull request reviews adhering to PEP 8 standards.',
    },
  ],
  jobMatch: {
    matchScore: 92,
    jobTitleDetected: 'Junior Python Developer',
    alignmentSummary:
      'Exceptional alignment (92%) with the Junior Python Developer posting. Liam demonstrates practical proficiency in 9 out of 10 required backend competencies, specifically FastAPI, Pytest, PostgreSQL, SQLAlchemy, and Docker.',
    matchedRequirements: [
      'Python programming (1.5 years practical experience)',
      'FastAPI & Flask REST API development',
      'PostgreSQL & SQLAlchemy query optimization',
      'Automated testing with Pytest (84% coverage)',
      'Git & GitHub Actions CI/CD workflows',
      'Docker containerization',
      'Redis caching and Celery queues',
    ],
    missingOrGaps: [
      'AWS / GCP Cloud provider production deployment experience',
      'Observability / APM tooling experience (Prometheus, Grafana, Datadog)',
    ],
    recommendations: [
      'Highlight any personal projects deployed to AWS Free Tier or GCP Cloud Run.',
      'During the interview, emphasize the 420ms to 180ms latency optimization story and how you structured test suites.',
    ],
  },
  extractedText: SAMPLE_PYTHON_RESUME_TEXT,
  interviewQuestions: SAMPLE_INTERVIEW_QUESTIONS,
  metadata: {
    fileName: 'Liam_Vance_Junior_Python_Developer_Resume.pdf',
    fileSizeBytes: 48200,
    fileType: 'PDF',
    analyzedAt: new Date().toISOString(),
    wordCountEstimate: 395,
    sourceMode: 'demo_preview',
  },
};
