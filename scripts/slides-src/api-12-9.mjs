/**
 * api-12-9 — API Design · Chapter 12 · Lesson 12.9 "Where to go next" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-8-hoc-tiep. Bài định hướng: bản đồ khoá học trên CuongThai.com, không có output đo.
 */
import { lamDeck, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: '12.9' };

export const deck = { key: 'api-12-9', code: 'API 12.9', title: 'Where to go next', sub: 'From LabFlow to your next project' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Where to go next', sub: 'From curl and one route<br>to a measured production API.' },

  { t: 'What you can do now', giua: true, body: cards([
    ['Contract · Ch1–4, 7', 'resources, RFC 9457 errors, cursor pages, versions, OpenAPI 3.1 with drift + breaking-change gates'],
    ['Reliability · Ch5–6', 'idempotency keys, backoff, rate limits, If-Match; JWT, BOLA, OWASP API Top 10, CORS'],
    ['Systems · Ch8–10', 'latency budgets, load tests, shedding; HTTP + Redis caches, replicas; 202 jobs, events, SSE/WS, webhooks'],
    ['Interview · Ch11', 'a 45-minute plan, estimates from measured capacity, three classic designs'],
    ['Production · Ch12', 'migrations, one pool, shared state, outbox + queue, re-measured load, deploy checklist'],
    ['Your story · 12.8', 'an evidence sheet, three STAR stories, CV lines with numbers'],
  ]) },

  { t: 'Three roads for the next three months', giua: true, to: true, body: `<table class="t lon"><tr><th>Road</th><th>For you if…</th><th>Order</th></tr>
<tr><td><b>Backend job</b></td><td>internship / junior Node.js</td><td>Testing → Node.js (Ch13, 15, 17) → Deploy to a VPS → LabFlow online</td></tr>
<tr><td><b>Operations-minded</b></td><td>12.7 was your favourite</td><td>Docker → Deploy to a VPS → Observability → GitHub Actions → PostgreSQL Ch14–16</td></tr>
<tr><td><b>Interview season</b></td><td>applying within a month</td><td>Lab 11 again, timed → System Design → your three STAR stories, aloud</td></tr></table>` },

  { t: 'Where each part of LabFlow goes deeper', giua: true, body: `<table class="t"><tr><th>Course</th><th>Adds to what you built</th><th>Start at</th></tr>
<tr><td>Testing</td><td>a real database in tests, API tests, Playwright, mutation testing, CI</td><td>4.1</td></tr>
<tr><td>Node.js (video series)</td><td>Prisma, Redis, BullMQ, logs and metrics, profiling, Docker deploy</td><td>13.1</td></tr>
<tr><td>PostgreSQL</td><td>EXPLAIN, locks, PgBouncer, WAL backups and replication</td><td>14.2</td></tr>
<tr><td>Redis</td><td>Lua and atomicity, streams and consumer groups, persistence</td><td>7.3</td></tr>
<tr><td>Docker · Deploy to a VPS</td><td>Compose for prod, healthchecks · systemd, nginx, zero-downtime, restore drills</td><td>16.2 · 3.2</td></tr>
<tr><td>Observability &amp; Monitoring</td><td>logs, correlation ids, metrics, alerts, probes</td><td>8.1</td></tr>
<tr><td>System Design · Background Jobs · Interview Prep</td><td>being written — rate limiters at scale, outbox/saga, STAR practice</td><td>—</td></tr></table>` },

  { t: 'Keep LabFlow alive: six extensions', giua: true, body: two(cards([
    ['Easy · waitlist promotion', 'booking.cancelled ⇒ offer the slot with a 10-minute hold (mind the 11.6 trap)'],
    ['Easy · weekly restore drill', 'schedule ops/backup.sh, alert on LỆCH'],
    ['Medium · API-key plans', '60 vs 600 req/min from the key’s plan, in the Lua bucket'],
  ], 1), cards([
    ['Medium · audit log', 'append-only table in the same transaction, cursor-paged for managers'],
    ['Hard · recurring bookings', '“every Tuesday for 10 weeks”, all-or-nothing, 409 lists the clashing weeks'],
    ['Hard · several campuses', 'campus_id + row-level security: BOLA enforced by the database'],
  ], 1)) + box('Rule for every extension', 'Contract first (openapi.yaml + breaking-change diff), then code, then one behaviour test and one measurement in your evidence sheet.', 'xanh') },

  { t: 'Last step: the final exam', giua: true, to: true, body: box('20 situations · 30 minutes · no notes', 'From “which status code?” (Chapter 2) to “how do you shut down without dropping a request?” (Chapter 12). Then read every explanation — each names the lesson to reread.', 'lam') + box('Thank you for building LabFlow all the way', 'You can design an API, make it hold under real conditions, and prove it with your own numbers.', 'xanh') },
]);
