export interface JobRolePreset {
  id: string;
  title: string;
  category: 'Engineering' | 'Data & AI' | 'Design' | 'Product' | 'Marketing';
  shortSummary: string;
  keySkills: string[];
  sampleDescription: string;
}

export const JOB_ROLE_PRESETS: JobRolePreset[] = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Engineering',
    shortSummary: 'Modern React, TypeScript, responsive UI systems, state management, and web performance.',
    keySkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Web Performance', 'REST/GraphQL', 'Jest/RTL', 'A11y'],
    sampleDescription: `Role: Frontend Developer (Sample Template)
Level: Mid to Senior | Department: Web Engineering

Role Overview:
We are seeking a Frontend Developer to build fast, accessible, and responsive web applications. In this role, you will collaborate closely with product designers and backend engineers to translate wireframes into production-grade user experiences with modern component architectures.

Key Responsibilities:
• Architect, build, and maintain high-performance web interfaces using React, TypeScript, and modern styling libraries.
• Optimize client-side rendering speed, Core Web Vitals, and bundle sizes across mobile and desktop viewports.
• Implement state management and integrate REST and GraphQL APIs with optimistic caching and graceful error handling.
• Champion web accessibility (WCAG 2.1 AA) and write comprehensive unit and integration tests (Jest, React Testing Library, Cypress).
• Partner with product managers and UX designers in rapid iteration cycles, code reviews, and design system governance.

Requirements & Qualifications:
• 3+ years of professional web application engineering with React and TypeScript.
• Deep understanding of modern JavaScript (ES6+), CSS3/Tailwind CSS, and component design patterns.
• Experience with build tooling (Vite, Next.js, Webpack) and browser profiling.
• Familiarity with Git version control, CI/CD pipelines, and agile software development workflows.
• Strong communication skills and empathy for end-user workflows.`,
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Engineering',
    shortSummary: 'Scalable microservices, distributed systems, relational databases, APIs, and cloud architecture.',
    keySkills: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Microservices', 'AWS'],
    sampleDescription: `Role: Backend Developer (Sample Template)
Level: Mid to Senior | Department: Platform & Infrastructure

Role Overview:
We are looking for a Backend Developer to design, develop, and scale core services and data pipelines. You will be responsible for creating robust APIs, maintaining transactional database integrity, and ensuring high service availability under heavy concurrent traffic.

Key Responsibilities:
• Design and implement resilient REST and gRPC microservices with clean architectural boundaries.
• Model relational schemas in PostgreSQL and configure caching layers with Redis to minimize p99 query latency.
• Implement secure authentication (OAuth 2.0, JWT), rate limiting, and role-based access control (RBAC).
• Manage containerized deployments using Docker and Kubernetes across cloud infrastructure (AWS/GCP).
• Instrument distributed tracing, structured logging, and automated alerting (Datadog, Prometheus).

Requirements & Qualifications:
• 3+ years of server-side engineering in Node.js, Go, Python, or Java.
• Strong knowledge of relational database design, indexing strategies, and ACID transaction boundaries.
• Practical experience with asynchronous queues (RabbitMQ, Apache Kafka, or SQS/Celery).
• Familiarity with CI/CD automation, unit/integration testing, and API contract testing.
• Passion for system reliability, code readability, and security best practices.`,
  },
  {
    id: 'full-stack-developer',
    title: 'Full-Stack Developer',
    category: 'Engineering',
    shortSummary: 'End-to-end feature delivery spanning React frontends, Node/Python backends, and databases.',
    keySkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Next.js', 'GraphQL', 'AWS', 'Docker', 'Prisma/ORM'],
    sampleDescription: `Role: Full-Stack Developer (Sample Template)
Level: Mid to Senior | Department: Product Engineering

Role Overview:
We are looking for a Full-Stack Developer to lead end-to-end feature initiatives from database schema design through polished UI implementation. You will own customer-facing features and balance product velocity with architectural maintainability.

Key Responsibilities:
• Build full-stack product capabilities using React/TypeScript on the frontend and Node.js or Python on the server.
• Design, query, and optimize relational databases (PostgreSQL/MySQL) using modern ORMs (Prisma, Drizzle, or SQLAlchemy).
• Build and document well-structured RESTful and GraphQL endpoints for web and mobile clients.
• Ensure application security, input validation, session management, and automated test coverage across layers.
• Deploy and monitor cloud applications in containerized staging and production environments.

Requirements & Qualifications:
• 3+ years of full-stack engineering experience building and deploying production web applications.
• Proficiency in TypeScript across both client and server runtimes.
• Solid foundation in relational data modeling, migrations, and performance debugging.
• Experience collaborating in agile sprints with designers, QA engineers, and product stakeholders.
• Self-motivated learner with proactive problem-solving abilities.`,
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Engineering',
    shortSummary: 'Core algorithms, scalable systems, clean code principles, performance engineering, and architecture.',
    keySkills: ['Algorithms', 'Data Structures', 'OOP', 'System Design', 'Git', 'Linux', 'Testing', 'CI/CD'],
    sampleDescription: `Role: Software Engineer (Sample Template)
Level: Mid-Level | Department: Core Systems

Role Overview:
We are hiring a Software Engineer to develop core platform modules and mission-critical software components. In this role, you will solve algorithmic challenges, refactor legacy workflows, and contribute to system reliability and scalability.

Key Responsibilities:
• Write clean, modular, and well-tested software adhering to SOLID principles and company coding standards.
• Analyze algorithmic complexity and tune CPU/memory usage for data-heavy background jobs.
• Participate actively in code reviews, technical specification writing, and retrospective meetings.
• Diagnose production defects, reproduce bugs with regression tests, and implement stable fixes.
• Collaborate with cross-functional technical teams to integrate internal SDKs and third-party APIs.

Requirements & Qualifications:
• Bachelor's degree in Computer Science, related technical discipline, or equivalent practical experience.
• 2+ years of professional software engineering in a typed language (Java, C++, TypeScript, Go, or Python).
• Solid understanding of foundational data structures, algorithms, and multithreading concepts.
• Experience using Git, branch management strategies, and automated testing frameworks.
• Rigorous analytical mindset and dedication to engineering craftsmanship.`,
  },
  {
    id: 'python-developer',
    title: 'Python Developer',
    category: 'Engineering',
    shortSummary: 'Python 3, FastAPI/Django, asynchronous I/O, data pipelines, ORMs, and automation.',
    keySkills: ['Python 3', 'FastAPI', 'Django', 'SQLAlchemy', 'PostgreSQL', 'Pytest', 'Docker', 'Pandas', 'Celery'],
    sampleDescription: `Role: Python Developer (Sample Template)
Level: Mid to Senior | Department: Application Services

Role Overview:
We are seeking a Python Developer to build high-throughput backend APIs, automate operational tasks, and power internal data workflows. You will craft idiomatic Python code, optimize database transactions, and maintain clean API documentation.

Key Responsibilities:
• Develop asynchronous web services and REST endpoints using FastAPI, Django, or Flask.
• Model application data, write complex queries, and manage migrations with SQLAlchemy or Django ORM.
• Coordinate asynchronous worker queues with Celery or Redis for background processing.
• Maintain high test coverage using Pytest, including mock fixtures, integration tests, and linting (Ruff, Black, Flake8).
• Package and deploy Python microservices via Docker containers on cloud infrastructure.

Requirements & Qualifications:
• 3+ years of professional development experience with Python 3.8+.
• Deep knowledge of Python concurrency (asyncio, threading, multiprocessing) and package management (Poetry, pip).
• Strong relational database skills with PostgreSQL, query tuning, and index analysis.
• Experience with OpenAPI/Swagger specifications and defensive API validation (Pydantic).
• Track record of shipping reliable, well-documented Python services.`,
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    category: 'Data & AI',
    shortSummary: 'Deep learning, LLM orchestration, vector databases, model fine-tuning, PyTorch, and MLOps.',
    keySkills: ['Python', 'PyTorch', 'LLMs & GenAI', 'LangChain', 'Vector DBs (Pinecone/Chroma)', 'MLOps', 'Transformers', 'FastAPI'],
    sampleDescription: `Role: AI/ML Engineer (Sample Template)
Level: Mid to Senior | Department: Applied AI & Machine Learning

Role Overview:
We are looking for an AI/ML Engineer to develop and deploy generative AI applications, semantic search pipelines, and predictive machine learning models. You will bridge experimental machine learning prototypes with scalable production inference systems.

Key Responsibilities:
• Build and operationalize retrieval-augmented generation (RAG) pipelines using vector embeddings and LLM APIs.
• Fine-tune, evaluate, and benchmark transformer-based models on proprietary domain datasets.
• Design low-latency inference services and model serving endpoints using FastAPI and Triton/TorchServe.
• Implement evaluation harnesses to quantify hallucination rates, recall, precision, and latency metrics.
• Build automated MLOps pipelines for data preprocessing, experiment tracking (Weights & Biases, MLflow), and model monitoring.

Requirements & Qualifications:
• 2+ years of experience deploying machine learning or generative AI solutions to production environments.
• Proficiency with Python, PyTorch or TensorFlow, Hugging Face Transformers, and OpenAI/Gemini SDKs.
• Experience with vector storage engines (Pinecone, Qdrant, Chroma, pgvector).
• Familiarity with prompt engineering techniques, model quantization, and token budget optimization.
• Solid background in linear algebra, statistics, and machine learning fundamentals.`,
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & AI',
    shortSummary: 'SQL analytics, interactive dashboards (Tableau/PowerBI), statistical modeling, and stakeholder reporting.',
    keySkills: ['SQL', 'Tableau', 'PowerBI', 'Python/Pandas', 'Data Warehousing (Snowflake/BigQuery)', 'A/B Testing', 'KPI Modeling'],
    sampleDescription: `Role: Data Analyst (Sample Template)
Level: Mid-Level | Department: Business Intelligence & Analytics

Role Overview:
We are seeking an analytical Data Analyst to transform complex datasets into actionable business insights. You will partner with product, marketing, and executive leaders to build executive dashboards, measure experiment outcomes, and guide strategic decisions.

Key Responsibilities:
• Write advanced SQL queries across modern cloud data warehouses (Snowflake, BigQuery, or Redshift).
• Design, launch, and maintain self-service dashboards in Tableau, PowerBI, or Looker for cross-functional stakeholders.
• Conduct statistical analyses on A/B experiments to evaluate feature adoption, retention cohorts, and conversion funnels.
• Clean, transform, and validate data streams using Python (Pandas) and dbt models.
• Present data-driven findings and recommendations clearly to both technical and non-technical audiences.

Requirements & Qualifications:
• 2+ years of commercial experience in data analytics or business intelligence.
• Advanced proficiency in SQL (window functions, CTEs, optimization, indexing).
• Demonstrated portfolio creating impactful BI dashboards with intuitive visual hierarchy.
• Working knowledge of basic probability, hypothesis testing, and user behavioral metrics.
• Strong curiosity and ability to translate open-ended business questions into structured queries.`,
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design',
    shortSummary: 'Figma design systems, high-fidelity prototypes, user research, wireframing, and usability testing.',
    keySkills: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Prototyping', 'Usability Testing', 'Wireframing', 'Responsive Layouts'],
    sampleDescription: `Role: UI/UX Designer (Sample Template)
Level: Mid to Senior | Department: Product Design

Role Overview:
We are looking for a creative and systematic UI/UX Designer to craft intuitive, beautiful digital product experiences. You will own the design process from initial discovery and user journey mapping through component specs and engineering design review.

Key Responsibilities:
• Design end-to-end user experiences, wireframes, interaction patterns, and high-fidelity prototypes in Figma.
• Expand and maintain the product design system, ensuring consistent typography, spacing, color tokens, and accessibility.
• Plan and conduct qualitative user interviews, usability tests, and heuristic evaluations to validate design concepts.
• Collaborate closely with frontend engineers to ensure pixel-perfect implementation and fluid transitions.
• Balance user needs, business objectives, and technical feasibility during feature scoping.

Requirements & Qualifications:
• 3+ years of product design experience across responsive web and mobile interfaces.
• Strong portfolio demonstrating structured design thinking, wireframing, and refined visual design craft.
• Expert mastery of Figma (components, autolayout, variables, interactive prototypes).
• Understanding of HTML/CSS capabilities and design system tokens.
• Excellent storytelling skills to articulate design decisions to cross-functional partners.`,
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Product',
    shortSummary: 'Roadmap strategy, PRD specifications, agile sprints, user discovery, and KPI-driven execution.',
    keySkills: ['Product Strategy', 'PRDs', 'Agile / Scrum', 'User Discovery', 'Metrics & Analytics', 'A/B Testing', 'Cross-Functional Leadership'],
    sampleDescription: `Role: Product Manager (Sample Template)
Level: Mid to Senior | Department: Product Management

Role Overview:
We are hiring a Product Manager to guide the vision, discovery, and execution of core product initiatives. You will work side-by-side with engineering, design, and commercial teams to define product roadmaps, write crisp specifications, and deliver measurable customer value.

Key Responsibilities:
• Define product vision, quarterly roadmap priorities, and clear success criteria (OKRs and KPIs).
• Conduct customer discovery interviews and analyze telemetry data to identify high-leverage user friction points.
• Author detailed Product Requirement Documents (PRDs), user stories, and acceptance criteria.
• Lead agile ceremonies (sprint planning, backlog grooming, daily standups) in lockstep with engineering leads.
• Coordinate go-to-market launches with marketing, customer support, and sales enablement teams.

Requirements & Qualifications:
• 3+ years of product management experience delivering web or mobile software products.
• Proven track record taking features from ideation and MVP through scaling phases.
• Analytical fluency with product analytics platforms (Amplitude, Mixpanel, or Google Analytics).
• Exceptional written and verbal communication, prioritization, and conflict-resolution skills.
• Technical literacy to engage credibly in architectural trade-off discussions with engineering.`,
  },
  {
    id: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    category: 'Marketing',
    shortSummary: 'Growth marketing, multi-channel campaigns (PPC/Paid Social), SEO/SEM, email workflows, and CRO.',
    keySkills: ['SEO / SEM', 'Google Ads', 'Meta Ads', 'Email Marketing', 'Google Analytics 4', 'Conversion Rate Optimization (CRO)', 'Content Strategy'],
    sampleDescription: `Role: Digital Marketing Specialist (Sample Template)
Level: Mid-Level | Department: Growth & Marketing

Role Overview:
We are looking for a data-driven Digital Marketing Specialist to execute high-impact acquisition, retention, and content marketing campaigns. You will manage digital advertising budgets, run conversion experiments, and optimize organic discovery across digital channels.

Key Responsibilities:
• Plan, launch, and optimize paid acquisition campaigns across Google Ads, LinkedIn, Meta, and partner networks.
• Perform keyword research, on-page SEO optimization, and technical content audits to expand organic search traffic.
• Design automated email nurturing sequences and customer lifecycle drip campaigns to improve activation rates.
• Measure campaign ROI, customer acquisition cost (CAC), and channel performance using GA4 and attribution models.
• Run landing page A/B tests and conversion rate optimization (CRO) experiments to maximize visitor-to-lead flow.

Requirements & Qualifications:
• 2+ years of experience in digital marketing, performance marketing, or growth marketing.
• Hands-on expertise with Google Ads, Meta Ads Manager, GA4, and email automation platforms (HubSpot, Mailchimp, Klaviyo).
• Working knowledge of SEO tooling (Ahrefs, Semrush, Google Search Console).
• Analytical mindset with strong Excel/Google Sheets data manipulation and reporting skills.
• Strong copywriting ability and sharp aesthetic eye for marketing creatives.`,
  },
];
