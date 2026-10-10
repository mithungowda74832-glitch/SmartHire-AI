import { ResumeAnalysisResult, PersonalizedQuestionsData } from '../types/resume';

interface SkillQuestionSet {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
}

// Deep, skill-specific question mappings for common technologies
const SKILL_QUESTION_BANK: Record<string, SkillQuestionSet> = {
  python: {
    beginner: [
      'What are the key differences between Python lists and tuples, and in what circumstances would you choose one over the other?',
      'How does Python handle memory management and garbage collection with reference counting?',
      'Can you explain the difference between `is` and `==` in Python with examples?',
      'How do Python decorators work under the hood, and how do you write a decorator that accepts arguments?',
      'What is the Global Interpreter Lock (GIL) in CPython, and what are its implications for multithreaded programs?',
    ],
    intermediate: [
      'How do Python generators and the `yield` keyword manage execution context and memory compared to returning a full collection?',
      'How have you used context managers (`with` statement) and the `__enter__` and `__exit__` dunder methods in your projects?',
      'How do you write asynchronous coroutines using `asyncio` to coordinate concurrent I/O-bound operations?',
      'How do you profile memory leaks and CPU bottlenecks in a Python web service using tools like `cProfile` or `tracemalloc`?',
      'In Python object-oriented programming, how does Method Resolution Order (MRO) work with multiple inheritance and `super()`?',
    ],
    advanced: [
      'How would you architect a CPU-bound data processing service in Python to bypass GIL constraints across multiple worker processes?',
      'How do Python metaclasses and `__init_subclass__` function, and when would you use them over standard class inheritance or composition?',
      'What internal data structure changes occurred in modern Python dictionaries (compact dicts), and how does hashing resolve collisions?',
      'How do you handle graceful degradation and backpressure when orchestrating asynchronous worker pools in Python?',
      'How would you optimize Cython or C-extensions to accelerate performance-critical mathematical or parsing operations in a Python pipeline?',
    ],
  },
  fastapi: {
    beginner: [
      'How does FastAPI utilize Python type hints and Pydantic models for automatic request validation and serialization?',
      'What is the role of Dependency Injection in FastAPI, and how do you define a reusable dependency with `Depends`?',
      'How does FastAPI generate interactive OpenAPI and Swagger documentation automatically from route signatures?',
      'What is the difference between synchronous (`def`) and asynchronous (`async def`) path operations in FastAPI?',
    ],
    intermediate: [
      'How do you structure custom middleware in FastAPI to handle cross-cutting concerns like request logging, correlation IDs, and timing?',
      'How have you managed database sessions and transaction lifecycles across FastAPI endpoints using dependency injection?',
      'How do you configure background tasks in FastAPI using `BackgroundTasks`, and what are its operational limitations compared to external message queues?',
      'How do you implement OAuth2 password flow or JWT bearer token validation in FastAPI applications?',
    ],
    advanced: [
      'How would you tune ASGI workers (e.g., Uvicorn with Gunicorn process manager) to maximize throughput under high concurrent websocket or HTTP loads?',
      'How do you manage distributed connection pooling across horizontal replicas when scaling FastAPI microservices against a relational database?',
      'How do you implement distributed rate limiting and circuit breaking in a FastAPI service communicating with external third-party APIs?',
    ],
  },
  javascript: {
    beginner: [
      'What is the difference between `let`, `const`, and `var`, and how does hoisting affect their declarations?',
      'How does JavaScript prototypal inheritance differ from classical class-based inheritance?',
      'What are closures in JavaScript, and what is a practical use case where you have implemented one?',
      'What is the event loop in JavaScript, and how does it prioritize the microtask queue versus macrotask queue?',
    ],
    intermediate: [
      'How do Promises work under the hood, and how do `Promise.all`, `Promise.allSettled`, and `Promise.race` differ in failure modes?',
      'What are WeakMap and WeakSet in modern JavaScript, and how do they prevent memory leaks in long-running single-page applications?',
      'How do you debug asynchronous race conditions and unhandled promise rejections in production JavaScript code?',
      'How does JavaScript handle module resolution (ES Modules vs CommonJS), and what are the interoperability challenges?',
    ],
    advanced: [
      'How does the V8 engine perform just-in-time compilation, hidden classes, and inline caching for property access?',
      'How do you diagnose and remediate detached DOM node memory leaks in complex client-side applications?',
      'How would you design a high-throughput worker pool using Web Workers or Node.js Worker Threads for intensive client-side computation?',
    ],
  },
  typescript: {
    beginner: [
      'What is the difference between `type` aliases and `interface` in TypeScript, and when is one preferred over the other?',
      'What are TypeScript union and intersection types, and how do you use type narrowing to safely inspect them?',
      'How do the `any`, `unknown`, and `never` types differ in TypeScript?',
      'What is the purpose of `keyof` and mapped types in TypeScript?',
    ],
    intermediate: [
      'How do you write custom type guards using the `is` operator to assert types at runtime?',
      'How have you implemented conditional types and template literal types to build strongly typed utility APIs?',
      'How do you configure TypeScript compiler flags (`strict`, `noImplicitAny`, `exactOptionalPropertyTypes`) to enforce enterprise type safety?',
      'How do generic constraints with `extends` ensure type safety when transforming complex object graphs?',
    ],
    advanced: [
      'How would you build a zero-runtime-overhead type parser that validates recursive nested JSON schema definitions using advanced TypeScript conditional types?',
      'How do covariance, contravariance, and bivariance affect function arguments and return types in TypeScript subtyping?',
      'How do you maintain build performance and incremental compilation in a large-scale TypeScript monorepo?',
    ],
  },
  react: {
    beginner: [
      'What is the virtual DOM in React, and how does the reconciliation algorithm update the browser DOM efficiently?',
      'What is the difference between controlled and uncontrolled form components in React?',
      'What are the rules of React Hooks, and why must hooks only be called at the top level of a component?',
      'When should you use `useEffect` versus `useLayoutEffect` in a React application?',
    ],
    intermediate: [
      'How do `useCallback` and `useMemo` prevent unnecessary re-renders, and what are the trade-offs of premature memoization?',
      'How do you manage complex shared state across nested components without encountering prop drilling or unnecessary subtree rerenders?',
      'How do Error Boundaries work in React, and what types of errors can they not catch?',
      'How have you implemented custom React hooks to encapsulate asynchronous data fetching, abort controllers, and retry logic?',
    ],
    advanced: [
      'How does React Concurrent Mode and fiber scheduling prioritize urgent user interactions over non-urgent background rendering passes?',
      'How would you architect a high-frequency real-time dashboard in React rendering thousands of changing data points per second without frame drops?',
      'What architectural considerations guide your decisions between React Server Components (RSC) and traditional Client-Side Hydration?',
    ],
  },
  docker: {
    beginner: [
      'What is the conceptual difference between a Docker image and a running Docker container?',
      'How do Docker image layers work, and how does layer caching affect image build times?',
      'What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?',
      'How do Docker volume mounts differ from bind mounts when persisting container data?',
    ],
    intermediate: [
      'How do you structure multi-stage Docker builds to produce minimal, security-hardened production runtime images?',
      'How do container networking modes (bridge, host, overlay, none) isolate or connect services in a multi-container stack?',
      'How do you handle non-root user security and vulnerability scanning in your Docker build pipelines?',
      'How do health check instructions in Dockerfiles enable orchestrators to detect and restart degraded containers?',
    ],
    advanced: [
      'How do Linux kernel cgroups, namespaces, and seccomp profiles enforce container isolation, and how do you debug container noisy-neighbor issues?',
      'How would you design a distributed container image caching architecture to optimize CI/CD deployment latencies across globally distributed runners?',
      'How do you troubleshoot zombie processes and proper signal forwarding (SIGTERM vs SIGKILL) in containers when orchestrating graceful shutdowns?',
    ],
  },
  postgresql: {
    beginner: [
      'What are the primary differences between clustered and unclustered indexes in relational databases?',
      'How does the PostgreSQL `EXPLAIN ANALYZE` command help identify slow query execution bottlenecks?',
      'What are foreign keys, and what is the difference between `ON DELETE CASCADE` and `ON DELETE SET NULL`?',
      'What is ACID compliance, and why is each property critical for relational data integrity?',
    ],
    intermediate: [
      'How does Multi-Version Concurrency Control (MVCC) in PostgreSQL prevent read queries from blocking write queries?',
      'When would you utilize a B-Tree index versus a GIN, GiST, or BRIN index in PostgreSQL?',
      'How have you handled database migrations with zero downtime on high-volume production tables without locking reads or writes?',
      'How do table partitioning strategies (range, list, hash) improve query performance on large historical datasets?',
    ],
    advanced: [
      'How would you diagnose and resolve PostgreSQL transaction ID wraparound before it triggers an emergency database shutdown?',
      'How do you configure and monitor write-ahead logging (WAL), checkpoint frequency, and vacuuming parameters for write-heavy workloads?',
      'How do you design an active-passive or read-replica failover topology with minimal data loss (RPO) and recovery time (RTO)?',
    ],
  },
  redis: {
    beginner: [
      'What makes Redis significantly faster than traditional disk-backed relational databases for key-value lookups?',
      'What are the primary data structures supported by Redis, and when would you use a Set versus a Sorted Set (ZSET)?',
      'What is Time-to-Live (TTL) in Redis, and how does key expiration work?',
    ],
    intermediate: [
      'How do Redis persistence mechanisms (RDB snapshots vs AOF logs) balance durability with write throughput?',
      'How have you used Redis Pub/Sub or Redis Streams for asynchronous event dispatching in your architectures?',
      'What cache eviction policies does Redis support (e.g., volatile-lru, allkeys-lru, volatile-ttl), and how do you pick the right policy?',
      'How do you prevent cache stampedes (thundering herd problem) and cache penetration when multiple clients query missing keys?',
    ],
    advanced: [
      'How does the Redis cluster hash slot sharding algorithm distribute keys across nodes, and how do you handle cross-slot multi-key operations?',
      'How would you implement a distributed lock with Redlock in Redis while accounting for clock drift and network partition edge cases?',
      'How do you handle Redis replication lag and split-brain scenarios in a distributed Redis Sentinel or Cluster deployment?',
    ],
  },
  aws: {
    beginner: [
      'What is the difference between AWS IAM users, groups, and roles, and when should IAM roles with temporary credentials be used?',
      'What are the core differences between Amazon S3 storage classes (Standard, Infrequent Access, Glacier)?',
      'What is a VPC (Virtual Private Cloud), and what role do subnets and route tables play in network isolation?',
    ],
    intermediate: [
      'How do Security Groups and Network ACLs (NACLs) differ in terms of statefulness and rule evaluation order?',
      'How have you architected serverless workloads using AWS Lambda, API Gateway, and DynamoDB, and how did you manage cold starts?',
      'How do you set up AWS CloudWatch alarms, metric filters, and SNS notifications to detect and alert on service degradation?',
    ],
    advanced: [
      'How would you design a multi-region active-active disaster recovery architecture with Route 53 latency-based routing and cross-region replication?',
      'How do you enforce least-privilege permission boundaries and SCPs (Service Control Policies) across AWS Organizations?',
      'How do you optimize egress networking costs and NAT Gateway bottlenecks across high-throughput distributed microservices?',
    ],
  },
  testing: {
    beginner: [
      'What is the difference between unit tests, integration tests, and end-to-end (E2E) tests in the testing pyramid?',
      'What is test coverage, and why does 100% code coverage not necessarily guarantee bug-free software?',
      'What is the difference between a mock, a stub, and a spy in automated testing?',
    ],
    intermediate: [
      'How do you structure tests to avoid brittle coupling to implementation details rather than external behavior?',
      'How have you implemented test fixtures, database rollbacks, and ephemeral test environments in CI/CD pipelines?',
      'How do parameterized tests help validate boundary values and edge cases without duplicating test logic?',
    ],
    advanced: [
      'How would you implement consumer-driven contract testing (e.g., Pact) across microservices to verify API compatibility without full end-to-end deployments?',
      'How do property-based testing (e.g., Hypothesis) and fuzz testing uncover latent assumptions in critical algorithmic code?',
      'How do you maintain deterministic test runs and eliminate flaky tests in large parallelized test suites?',
    ],
  },
  git: {
    beginner: [
      'What is the difference between `git merge` and `git rebase`, and when should you avoid rebasing?',
      'What does `git stash` do, and how do you inspect and apply stashed changes?',
      'What is the purpose of `.gitignore`, and how do you untrack a file that was accidentally committed?',
    ],
    intermediate: [
      'How do you use `git bisect` with automated test scripts to identify the exact commit that introduced a regression?',
      'How do you resolve complex merge conflicts involving renames or divergent branches while preserving commit history hygiene?',
      'How do interactive rebases (`git rebase -i`) assist in curating clean, atomic pull requests for team review?',
    ],
    advanced: [
      'How does Git store commits, trees, blobs, and annotated tags internally as a directed acyclic graph (DAG) of SHA hashes?',
      'How would you rescue a commit lost due to a forced push or hard reset using the `git reflog` and garbage collection recovery?',
      'How do you structure Git trunk-based development with short-lived feature branches and feature flags in high-velocity teams?',
    ],
  },
};

// General questions parameterized by candidate profile attributes
function getGeneralRoleQuestions(
  title: string,
  experienceYears: number,
  strengths: string[]
): SkillQuestionSet {
  const roleName = title || 'Software Engineer';
  const yearsText = experienceYears ? `${experienceYears} years of` : 'your';

  return {
    beginner: [
      `In your work as a ${roleName}, how do you approach breaking down a new feature requirement into verifiable technical tasks?`,
      `How do you ensure your code adheres to standard team style guides, linting rules, and documentation conventions?`,
      `What is your process for verifying that your local code changes will not break existing production functionality before opening a pull request?`,
      `How do you prioritize fixing critical production bugs versus delivering new feature roadmap deliverables?`,
      `Can you explain your approach to writing clear, self-documenting code with meaningful variable and function naming?`,
    ],
    intermediate: [
      `Given your background in ${roleName} roles, walk through a time you identified and resolved a non-obvious performance bottleneck in an application.`,
      `How do you balance rapid delivery deadlines with architectural quality and refactoring technical debt in your sprint cycles?`,
      `In your ${yearsText} experience, how have you collaborated with cross-functional partners (product managers, designers, QA) to refine ambiguous requirements?`,
      `How do you conduct constructive code reviews for peers to elevate team engineering standards without creating velocity bottlenecks?`,
      `Can you describe an architectural decision you made in a recent project where you evaluated two competing technologies and justified your final choice?`,
    ],
    advanced: [
      `As an experienced ${roleName}, how do you evaluate architectural trade-offs between monolithic and microservice architectures for a rapidly evolving product?`,
      `How do you establish engineering observability, monitoring dashboards, and alerting thresholds so that critical incidents are detected before customers report them?`,
      `Walk through how you would conduct a blameless post-mortem after a high-severity production outage, and how you ensure systemic mitigations are implemented.`,
      `How do you mentor junior and mid-level engineers to scale their technical autonomy and system design capabilities across an engineering organization?`,
      `How would you architect a disaster recovery and business continuity plan for a mission-critical service requiring 99.99% availability?`,
    ],
  };
}

/**
 * Deterministically shuffles or offsets an array based on an integer seed
 */
function pickQuestions(pool: string[], count: number, seed: number): string[] {
  if (pool.length <= count) return [...pool];
  const shuffled = [...pool];
  // Simple deterministic pseudorandom shuffle based on seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.abs(Math.sin(seed + i) * 10000) % (i + 1) | 0;
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled.slice(0, count);
}

/**
 * Generates personalized interview questions locally in the browser.
 * Grounded in candidate's skills, experience, projects, and achievements.
 * Questions only — no answers, hints, or sample responses.
 */
export function generateLocalInterviewQuestions(
  report: ResumeAnalysisResult,
  resumeText?: string,
  seed: number = Date.now()
): PersonalizedQuestionsData {
  const candidate = report.candidate;
  const candidateTitle = candidate?.titleOrHeadline || 'Software Engineer';
  const years = typeof candidate?.yearsOfExperience === 'number' ? candidate.yearsOfExperience : 2;

  // Extract all verified skills from the report
  const allSkills: string[] = [
    ...(report.extractedSkills?.technical || []),
    ...(report.extractedSkills?.toolsAndFrameworks || []),
  ].map((s) => s.toLowerCase().trim());

  // Also scan resume text for key technologies if skills list was small
  const textToScan = (resumeText || report.extractedText || '').toLowerCase();
  for (const skillKey of Object.keys(SKILL_QUESTION_BANK)) {
    if (!allSkills.includes(skillKey) && textToScan.includes(skillKey)) {
      allSkills.push(skillKey);
    }
  }

  const strengthsList = (report.strengths || []).map((s) => s.headline);
  const generalQuestions = getGeneralRoleQuestions(candidateTitle, years, strengthsList);

  const beginnerPool: string[] = [];
  const intermediatePool: string[] = [];
  const advancedPool: string[] = [];

  // 1. Collect questions from candidate's matched skills
  const matchedSkillKeys = Object.keys(SKILL_QUESTION_BANK).filter((key) =>
    allSkills.some((s) => s.includes(key) || key.includes(s))
  );

  for (const key of matchedSkillKeys) {
    const bank = SKILL_QUESTION_BANK[key];
    if (bank) {
      beginnerPool.push(...bank.beginner);
      intermediatePool.push(...bank.intermediate);
      advancedPool.push(...bank.advanced);
    }
  }

  // 2. Add role-specific questions to ensure rich pools
  beginnerPool.push(...generalQuestions.beginner);
  intermediatePool.push(...generalQuestions.intermediate);
  advancedPool.push(...generalQuestions.advanced);

  // 3. Add project/experience-grounded questions if candidate has metrics or specific roles
  if (report.strengths && report.strengths.length > 0) {
    const primaryStrength = report.strengths[0];
    intermediatePool.push(
      `Your resume highlights: "${primaryStrength.headline}". Can you walk me through the specific architectural steps and challenges you overcame to achieve this outcome?`
    );
    if (primaryStrength.evidence) {
      intermediatePool.push(
        `In your work demonstrating "${primaryStrength.evidence}", what baseline metrics were measured before your intervention, and how did you measure success?`
      );
    }
  }

  // 4. Select exactly 3 questions per difficulty tier (9 total)
  const beginner = pickQuestions(beginnerPool, 3, seed + 11);
  const intermediate = pickQuestions(intermediatePool, 3, seed + 23);
  const advanced = pickQuestions(advancedPool, 3, seed + 37);

  return {
    beginner,
    intermediate,
    advanced,
    source: 'offline_local',
    generatedAt: new Date().toISOString(),
  };
}
