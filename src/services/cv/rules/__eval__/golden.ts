/**
 * Golden set for the CV bullet linter (Phase 3 eval harness).
 * ─────────────────────────────────────────────────────────────────────────
 * 30+ real-shaped bullets across strengths, each with a human-assigned expected
 * verdict. The metric that matters MOST is the false-positive rate on STRONG
 * bullets: telling a user their genuinely strong bullet is weak destroys trust
 * in everything else. A change that raises that rate must fail CI.
 *
 * Add confirmed real-world false positives here as regression fixtures.
 */
export interface GoldenBullet {
  text: string;
  expected: 'WEAK' | 'OK' | 'STRONG';
  note?: string;
}

export const GOLDEN: GoldenBullet[] = [
  // ── STRONG: strong verb + measurable outcome ──
  { text: 'Reduced API p95 latency from 800ms to 180ms by adding a Redis cache layer', expected: 'STRONG' },
  { text: 'Built a PayOS webhook pipeline processing 2,000+ transactions/day with idempotent retries', expected: 'STRONG' },
  { text: 'Migrated 40 microservices from EC2 to Kubernetes, cutting deploy time from 30min to 4min', expected: 'STRONG' },
  { text: 'Optimized a PostgreSQL query with a composite index, improving dashboard load 3x', expected: 'STRONG' },
  { text: 'Automated the release pipeline, eliminating ~6 hours of manual QA per week', expected: 'STRONG' },
  { text: 'Designed an event-driven order system handling 15k events/min at 99.9% uptime', expected: 'STRONG' },
  { text: 'Refactored the auth module, reducing login failures by 35%', expected: 'STRONG' },
  { text: 'Led a team of 4 to ship the checkout redesign, increasing conversion 12%', expected: 'STRONG' },
  { text: 'Instrumented services with OpenTelemetry, cutting incident detection from 20min to 3min', expected: 'STRONG' },
  { text: 'Scaled the ingestion service to 1M records/hour by parallelizing the worker pool', expected: 'STRONG' },
  { text: 'Rewrote the sync engine in Go, dropping memory usage from 1.2GB to 300MB', expected: 'STRONG' },

  // ── OK: action verb, real task, but no strong measurable outcome ──
  { text: 'Developed a REST API for the mobile app using Node.js and Express', expected: 'OK' },
  { text: 'Built a CI pipeline with GitHub Actions for automated testing', expected: 'OK' },
  { text: 'Implemented user authentication with JWT and refresh tokens', expected: 'OK' },
  { text: 'Created internal dashboards with React and Recharts', expected: 'OK' },
  { text: 'Integrated Stripe for subscription billing', expected: 'OK' },
  { text: 'Configured Nginx as a reverse proxy with TLS termination', expected: 'OK' },
  { text: 'Wrote unit and integration tests for the payment service', expected: 'OK' },
  { text: 'Designed the database schema for the notifications feature', expected: 'OK' },
  { text: 'Deployed the app to a VPS with Docker Compose', expected: 'OK' },

  // ── WEAK: presence not contribution / no verb+no outcome / buzzwords / first-person ──
  { text: 'Responsible for the payment module', expected: 'WEAK' },
  { text: 'Worked on various backend features and bug fixes', expected: 'WEAK' },
  { text: 'Helped with the frontend and other tasks', expected: 'WEAK' },
  { text: 'Participated in team meetings and code reviews', expected: 'WEAK' },
  { text: 'Was tasked with maintaining the legacy system', expected: 'WEAK' },
  { text: 'I built a small website for a class project', expected: 'WEAK', note: 'first person' },
  { text: 'Team player who is passionate about coding and a fast learner', expected: 'WEAK', note: 'buzzwords, no outcome' },
  { text: 'Duties included writing code and fixing bugs', expected: 'WEAK' },
  { text: 'Involved in the development of the mobile application', expected: 'WEAK' },
  { text: 'Studied data structures and algorithms', expected: 'WEAK', note: 'coursework as achievement' },
  { text: 'Assisted senior engineers with debugging', expected: 'WEAK' },

  // ── Extended set (Phase 11.4) — edge cases across verbs/stacks/levels ──
  // STRONG — less common strong verbs, unusual metrics
  { text: 'Diagnosed and fixed a memory leak, cutting pod restarts from 12/day to 0', expected: 'STRONG' },
  { text: 'Cut monthly cloud spend 40% by rightsizing EC2 instances and adding autoscaling', expected: 'STRONG' },
  { text: 'Containerized 12 legacy services, shrinking cold-start from 45s to 6s', expected: 'STRONG' },
  { text: 'Benchmarked three message queues and migrated to NATS, tripling throughput', expected: 'STRONG' },
  { text: 'Mentored 3 juniors and introduced code review, dropping production incidents 50%', expected: 'STRONG' },
  { text: 'Rearchitected the billing flow to be idempotent, eliminating duplicate charges', expected: 'STRONG', note: 'outcome without a number' },
  { text: 'Automated data backfills, saving the team ~10 engineer-hours each week', expected: 'STRONG' },

  // OK — real tasks, action verb, but no strong measurable outcome (must NOT be WEAK)
  { text: 'Configured monitoring and alerting with Prometheus and Grafana', expected: 'OK' },
  { text: 'Wrote technical documentation and onboarding guides for the API', expected: 'OK' },
  { text: 'Reviewed pull requests and enforced coding standards across the team', expected: 'OK' },
  { text: 'Provisioned staging environments with Terraform', expected: 'OK' },
  { text: 'Migrated the frontend from JavaScript to TypeScript', expected: 'OK' },

  // WEAK — passive, buzzword-summary, listing without a verb, first person, coursework
  { text: 'The payment system was migrated to AWS by the team', expected: 'WEAK', note: 'passive, no ownership' },
  { text: 'Detail-oriented engineer with a passion for writing clean, maintainable code', expected: 'WEAK', note: 'buzzword summary' },
  { text: 'Familiar with Docker, Kubernetes, and various cloud platforms', expected: 'WEAK', note: 'listing, no contribution' },
  { text: 'My main task was to maintain the internal admin dashboard', expected: 'WEAK', note: 'first person + maintain' },
  { text: 'Contributed to several open-source projects in my free time', expected: 'WEAK', note: 'vague, no specifics' },
  { text: 'Completed an online course on machine learning', expected: 'WEAK', note: 'coursework' },
  { text: 'Worked as part of a team to deliver features on schedule', expected: 'WEAK', note: 'presence not contribution' },
];
