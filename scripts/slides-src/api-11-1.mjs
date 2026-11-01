/**
 * api-11-1 — API Design · Chapter 11 · Lesson 11.1 "A framework for API design interview questions" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s11-phong-van.mjs › api-11-1-khung. Output = chạy thật autocannon + interview/estimate.mjs.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 11 — The API design interview', bai: '11.1' };

export const deck = { key: 'api-11-1', code: 'API 11.1', title: 'A 45-minute framework', sub: 'Clarify, contract, failures, security, scale' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Answering an API design<br>question in 45 minutes', sub: 'Five steps, one rubric —<br>and numbers you measured yourself.' },

  { t: 'What the interviewer is really scoring', giua: true, body: cards([
    ['1 · Requirements and numbers', 'Did you ask before drawing? Who, what, how many, what must never happen — and a peak in req/s.'],
    ['2 · API surface', 'Nouns and methods, 201 + Location, one status code per failure, consistent names.'],
    ['3 · Correctness under failure', 'Retries, double clicks, stale copies, pages that move — unprompted.'],
    ['4 · Security and operations', 'Object-level checks (404), a rate-limit policy, a versioning plan.'],
    ['5 · Scale and trade-offs', 'The bottleneck from your numbers, at most two fixes, and what they cost.'],
    ['6 · Communication', 'Thinking aloud, using hints, a summary before the clock runs out.'],
  ]) + box('A driving test, not a quiz', 'Nobody fails you for taking another street — they fail you for not checking the mirror. Habits, not one right answer.', 'lam') },

  { t: 'The 45-minute plan', giua: true, body: `<table class="t lon"><tr><th>Minutes</th><th>Step</th><th>On the board</th></tr>
<tr><td>0–8</td><td><b>1 · Clarify + size</b></td><td>users, 2–3 use cases, out of scope, “must never happen”, peak req/s</td></tr>
<tr><td>8–20</td><td><b>2 · Resources + endpoints</b></td><td>a table: method, path, success code</td></tr>
<tr><td>20–28</td><td><b>3 · Errors + pagination</b></td><td>problem+json, conflicts, cursor lists, Idempotency-Key</td></tr>
<tr><td>28–36</td><td><b>4 · Auth, limits, versions</b></td><td>who may call each line, 429 policy, how v2 arrives</td></tr>
<tr><td>36–45</td><td><b>5 · Scale + wrap-up</b></td><td>bottleneck, ≤ 2 fixes with their cost, 3-sentence summary</td></tr></table>` },

  { t: 'Size it — then compare with a measurement', body: http(`$ npx autocannon -c 50 -d 10 -j http://localhost:4100/v2/labs > perf/bench-labs.json
$ node interview/estimate.mjs
autocannon GET /v2/labs: 7963 req/s trung bình · p50 5 ms · p99 16 ms · non-2xx 0
DAU = 30,000 × 0.2 = 6,000 người/ngày
                 mỗi ngày     trung bình/s   đỉnh (phút 07:00)/s
reads              72,000           0.83            500
bookings            6,000           0.07             50
logins              6,000           0.07             50
…
bảng bookings đo thật: 1,000,000 dòng, 167.6 MB kể cả chỉ mục ⇒ 168 byte/lượt đặt
…
  đọc: cần 500/s, một tiến trình làm được 7,963/s ⇒ dùng 6% công suất
  đăng nhập: cần 50/s, một tiến trình làm được 114/s ⇒ dùng 44% công suất`, { sm: true, wrap: true, title: 'assumptions: 30,000 students, 20% daily, half of them in the 07:00 minute' }) + two(box('Say it like this', 'Average 0.83 req/s is useless. The 07:00 minute: ~500 reads/s (6% of one process, ~8,000 measured; four runs 7,963–9,888) and ~50 logins/s (44% of 114/s, 8.2). Risk = login spike + one slot, not throughput.', 'xanh'), box('Trap: number theatre', 'Three minutes of “10M DAU × 86,400” that never changes a decision. No decision ⇒ skip the number.', 'do2')) },

  { t: 'The contract on the board', giua: true, body: sql(`POST   /v2/devices/{id}/issues   Idempotency-Key   201 + Location   409 duplicate · 422 · 429 · 401
GET    /v2/issues?status=OPEN&limit=20              200 {data, page.next}   400 bad cursor
GET    /v2/issues/{id}                              200 + ETag       404
POST   /v2/issues/{id}/resolve   If-Match           200              403 · 409 already resolved · 412 stale`, { lang: 'plaintext', sm: true }) + `<table class="t"><tr><th>Moment</th><th>Weak</th><th>Strong</th></tr>
<tr><td>First minute</td><td>draws microservices and Kafka</td><td>asks who, what, how many, what must never happen</td></tr>
<tr><td>Endpoints</td><td><code class="i">/createIssue</code>, 200 for everything</td><td>nouns + methods, 201 + Location, a code per failure</td></tr>
<tr><td>Failure</td><td>not mentioned until asked</td><td>retry ⇒ Idempotency-Key (5.1) · two managers ⇒ If-Match/412 (5.4)</td></tr>
<tr><td>Trade-offs</td><td>“a cache, because it's faster”</td><td>“60 s cache ⇒ a new lab appears up to 60 s late — fine for a list”</td></tr></table>` },

  { t: 'The rubric, and what comes next', body: `<table class="t"><tr><th>Criterion</th><th>1 — weak</th><th>2 — acceptable</th><th>3 — strong</th></tr>
<tr><td>Requirements + numbers</td><td>no questions</td><td>use cases, rough users</td><td>scope + must-never + peak vs measured capacity</td></tr>
<tr><td>API surface</td><td>verbs, 200 for errors</td><td>REST, mostly right</td><td>clean table, codes per failure</td></tr>
<tr><td>Correctness</td><td>happy path</td><td>errors, pages mentioned</td><td>idempotency, 409/412, cursors — unprompted</td></tr>
<tr><td>Security + ops</td><td>“add JWT”</td><td>auth + roles</td><td>404 per object, 429 policy, versioning</td></tr>
<tr><td>Scale + trade-offs</td><td>buzzwords</td><td>cache/queue with a reason</td><td>bottleneck from numbers, ≤ 2 fixes + cost</td></tr>
<tr><td>Communication</td><td>silent, out of time</td><td>structured, rigid</td><td>aloud, uses hints, summary on time</td></tr></table>` + two(box('Strong junior', '≥ 13 of 18, and no 1 in API surface or correctness. Course rubric — not any company’s official sheet.', 'xanh'), box('Next', '11.2–11.3 URL shortener · 11.4 feed · 11.5 chat · 11.6 booking = LabFlow · Lab 11 mock interview.', 'lam')) },
]);
