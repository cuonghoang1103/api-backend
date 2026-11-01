/**
 * api-12-8 — API Design · Chapter 12 · Lesson 12.8 "Review, documentation and your interview story" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-4-tong-ket. Số liệu = output thật của bài 12.1–12.7 + lệnh đếm dự án (cmd-128).
 */
import { lamDeck, sql, http, two, box, vsd, steps } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: '12.8' };

export const deck = { key: 'api-12-8', code: 'API 12.8', title: 'Your interview story', sub: 'Review, documentation, STAR stories, CV lines' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Your interview story', sub: 'Make someone else believe it<br>in five minutes.' },

  { t: 'The evidence sheet: before ⇒ after, all measured', giua: true, body: `<table class="t"><tr><th>Claim</th><th>Measured</th><th>Lesson</th></tr>
<tr><td>No double booking</td><td>50 at once, 2 instances: RAM 2 ⇒ PostgreSQL 1 (+49 × 409)</td><td>12.3</td></tr>
<tr><td>“Max 3 active” holds</td><td>10 at once: 5–8 ⇒ 3 every time (row lock)</td><td>12.3</td></tr>
<tr><td>Paging loses no rows</td><td>bulk insert: 900/1,000 lost (µs) ⇒ 0 (<code class="i">timestamptz(3)</code>)</td><td>12.1</td></tr>
<tr><td>Global rate limit · no lost edits</td><td>8/8 past a limit of 5 ⇒ 5 then 429 · 11/20 lost ⇒ 0/20</td><td>12.4</td></tr>
<tr><td>Email never slows a booking</td><td>p50 311 ms and 500s ⇒ 3.6 ms, retried to delivery</td><td>12.5</td></tr>
<tr><td>No regression</td><td>lists 1.4–2.2×, writes 2.7–3.2× faster on PostgreSQL</td><td>12.6</td></tr>
<tr><td>Deploys lose no requests</td><td>SIGTERM under load: 622 × 502 ⇒ 0</td><td>12.7</td></tr>
<tr><td>Contract unchanged</td><td>2.3.0 ⇒ 2.4.0: 0 breaking · drift 40/40</td><td>12.6</td></tr></table>` },

  { t: 'A README a reviewer reads in two minutes', giua: true, body: two(sql(`# LabFlow API — lab and device booking
Node 22 · Express 5 · PostgreSQL 18 · Redis 8 · OpenAPI 3.1 (29 ops)

## Run it      npm ci · npm run db:migrate && npm run db:seed
##             bash ops/dev-stack.sh start
## Guarantees  one booking per slot (EXCLUDE) · ≤ 3 per student
## Evidence    table + the script behind every number
## Architecture  2 instances · PostgreSQL · Redis · worker
## Operations  /health /ready · drain · JSON logs · /metrics
## Next        3 honest lines`, { lang: 'plaintext', sm: true }), http(`$ echo "thao tác OpenAPI: … · migration: … · bảng: …"
thao tác OpenAPI: 29 · migration: 4 · bảng: 11
$ echo "mã nguồn src/: … · script đo perf/: … · test: …"
mã nguồn src/: 73 tệp, 3617 dòng · script đo perf/: 34 · test: 4 tệp
$ npm test | grep -E '^ℹ (tests|pass|fail|skipped)'
ℹ tests 18 ℹ pass 17 ℹ fail 0 ℹ skipped 1`, { sm: true, wrap: true, title: 'counted, not estimated' })) + box('First screen answers three questions', 'What is it · how do I run it · why should I believe it works.', 'xanh') },

  { t: 'Three STAR stories', giua: true, to: true, body: steps([
    '<b>Bug:</b> two instances ⇒ 50 parallel bookings made 2. Moved the rule into an EXCLUDE constraint, mapped 23P01 to the existing 409, added a 20-request test. <b>Result:</b> exactly 1 × 201 + 49 × 409, every run.',
    '<b>Hidden problem:</b> a script paging 1,000 rows found 100 — µs in the database, ms in the cursor. Switched to timestamptz(3), kept the script as a test. <b>Result:</b> 1,000/1,000.',
    '<b>Slow third party:</b> email in the request cost +300 ms and a 500 when the provider failed. Outbox + queue + idempotency key per email. <b>Result:</b> 311 ms ⇒ 3.6 ms, no lost or duplicate emails in crash tests.',
  ]) + box('MIT CAPD: STAR', 'Situation ~20% · Task ~10% · <b>Action ~60%</b> · Result ~10% with numbers. “I” statements. Prepare 3–5 stories; do not memorise word for word.', 'lam') },

  { t: 'CV lines with numbers you can defend', giua: true, body: vsd('<p>“Built a REST API with Node.js and PostgreSQL.”</p><p>“Used Redis for caching and rate limiting.”</p><p>“Handles 10,000 users.” — measured how?</p>', '<p>“Built a booking REST API (Node 22, PostgreSQL, Redis; OpenAPI 3.1, 29 operations) on two instances with zero double bookings under 50 concurrent requests.”</p><p>“Moved email out of the request path with a transactional outbox and BullMQ: booking p50 311 ms → 3.6 ms.”</p>', '✗ adjectives and unmeasured claims', '✓ stack · guarantee · number') + box('Rule', 'Quote only what your scripts printed, name the machine (“my laptop, two instances”), say what you did not test.', 'do2') },

  { t: 'A five-minute demo, then honest limits', giua: true, body: `<table class="t"><tr><th>Time</th><th>Show</th></tr>
<tr><td>0:00</td><td>one sentence of problem + the architecture diagram</td></tr>
<tr><td>0:30</td><td><code class="i">node ops/smoke.mjs</code> — twelve green lines</td></tr>
<tr><td>1:30</td><td><code class="i">node perf/race-api.mjs slot 50</code> — fifty clicks, one booking</td></tr>
<tr><td>2:30</td><td>stop Redis — bookings still 201; start it — outbox drains, emails arrive</td></tr>
<tr><td>3:30</td><td>the OpenAPI page and the breaking-change diff</td></tr>
<tr><td>4:30</td><td>limits: one PostgreSQL, no PITR, a fake mail provider</td></tr></table>` + box('Summary · next', 'Evidence sheet · two-minute README · three STAR stories · CV lines with numbers · a scripted demo. Next (12.9): where to go after this course.', 'xanh') },
]);
