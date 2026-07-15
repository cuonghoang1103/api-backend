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
];
