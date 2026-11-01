/**
 * api-lab-8 — API Design · Chapter 8 · Lab 8 "Usage report" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s08-he-thong.mjs › api-8-7-lab. Output = chạy thật perf/report-mixed.mjs (SEED_BOOKINGS=20000), cmp, 2 instance + proxy.
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 8 — Thinking in systems', bai: 'Lab 8' };

export const deck = { key: 'api-lab-8', code: 'API Lab 8', title: 'Lab 8 — Usage report', sub: 'Measure, fix, protect, promise' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Lab 8: the report<br>that froze LabFlow', sub: 'Measure · fix · protect · promise —<br>the whole chapter in one task.' },

  { t: 'The story and the six tasks', to: true, giua: true, body: `
<ul>
<li>Ms Lan’s <b>GET /v2/reports/usage</b>: bookings and hours per lab per day — correct numbers</li>
<li>Five managers open it at once ⇒ every student’s app freezes</li>
</ul>` + cards([
    ['1 · Measure (2)', 'Server-Timing, before.json, report-mixed CONC=5'],
    ['2 · Explain (1)', 'why /v2/labs slows; try limitInflight(2)'],
    ['3 · Algorithm (2)', 'one pass; cmp before after = identical'],
    ['4 · Cache (2)', '60 s per (from, days), private, Age; auth still first'],
    ['5 · Instances (1)', '250 requests: one instance vs two behind the proxy'],
    ['6 · Promise (2)', 'OpenAPI path + an SLO row'],
  ]) },

  { t: 'The starter: correct, and 335 ms', body: two(sql(`// routes/reports.js — LAB 8 starter (slow on purpose)
.get(requireAuth, requireRole('LAB_MANAGER'),
     validate('query', Q), (req, res) => {
  const { from, days } = req.valid.query;
  const out = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(Date.parse(from) + d * 86400000)
      .toISOString().slice(0, 10);
    for (const lab of labs) {
      // every (day, lab) scans ALL bookings again
      const mine = bookings.filter((b) => b.labId === lab.id
        && b.status !== 'CANCELLED'
        && new Date(b.startAt).toISOString().slice(0, 10) === day);
      const hours = mine.reduce((s, b) =>
        s + (new Date(b.endAt) - new Date(b.startAt)) / 3600000, 0);
      out.push({ day, labId: lab.id, bookings: mine.length, hours });
    }
  }
  res.json({ from, days, rows: out });
})`, { lang: 'javascript', sm: true, hl: [11, 12, 13] }), http(`$ curl -D - -o before.json '…/v2/reports/usage?from=2026-11-02&days=30' …
HTTP/1.1 200 OK
Content-Length: 12322
Server-Timing: auth;dur=0.12, validate;dur=0.57, total;dur=335.41

$ TOKEN=… CONC=5 node perf/report-mixed.mjs
report: 2.9 req/s · p50 1677 ms · p99 3098 ms · 2xx 29
GET /v2/labs trong lúc đó: 4 lần · p50 3119.9 ms
  · p99 3336.4 ms`, { sm: true, wrap: 'any' }) + box('30 days × 4 labs × 20,000 bookings', '= 2.4 million iterations, all synchronous: the event loop is held ~330 ms per report (8.2’s story again).', 'do2'), 'r64') },

  { t: 'Task 2: why shedding does nothing here', giua: true, body: two(http(`# starter + limitInflight(2)
$ TOKEN=… CONC=5 node perf/report-mixed.mjs
report: 2.5 req/s · p50 1581 ms · p99 3634 ms · 2xx 25 · non-2xx 0
GET /v2/labs trong lúc đó: 3 lần · p50 4167.5 ms · p99 5046.2 ms`, { sm: true, wrap: 'any' }) + box('non-2xx 0', 'Nothing was shed, nothing improved.', 'do2'),
    box('Why', 'A synchronous handler finishes before the next request is even read, so “in flight” never exceeds one. Shedding protects work that <b>waits</b> (threadpool, database); this work does not wait.', 'lam') + box('So', 'Fix the blocking first. Keep the limit for later: when the report becomes a PostgreSQL query (Ch12) it will wait, and the limit will protect the pool.', 'xanh')) },

  { t: 'Tasks 3–4: one pass, then a 60 s cache', body: two(sql(`function usage(from, days) {
  const dayList = Array.from({ length: days }, (_, d) =>
    new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10));
  const cell = new Map();          // "2026-11-02|lab_1" ⇒ { bookings, hours }
  for (const day of dayList) for (const lab of labs)
    cell.set(\`\${day}|\${lab.id}\`, { bookings: 0, hours: 0 });
  for (const b of bookings) {      // ONE scan
    if (b.status === 'CANCELLED') continue;
    const c = cell.get(\`\${b.startAt.slice(0, 10)}|\${b.labId}\`);
    if (!c) continue;
    c.bookings++;
    c.hours += (Date.parse(b.endAt) - Date.parse(b.startAt)) / 3600000;
  }
  …
}
.get(requireAuth, requireRole('LAB_MANAGER'), limitInflight(2),
     validate('query', Q), (req, res) => {
  let hit = cache.get(key);        // AFTER auth + role
  if (!hit || Date.now() - hit.at > TTL_MS) hit = { body: …usage(…), at: Date.now() };
  res.set('Cache-Control', 'private, max-age=60').set('Age', …).json(hit.body);
})`, { lang: 'javascript', sm: true, hl: [7, 18] }), http(`$ … one pass, no cache
Server-Timing: auth;dur=0.07, validate;dur=0.13,
  compute;dur=2.92, total;dur=3.66
$ cmp before.json after.json && echo "same answer"
same answer
report: 515.9 req/s · p50 9 ms · p99 26 ms
GET /v2/labs: 299 lần · p50 12.0 ms · p99 40.8 ms

$ … one pass + cache 60 s
Server-Timing: auth;dur=0.06, validate;dur=0.13, total;dur=0.71
report: 4532.2 req/s · p50 0 ms · p99 6 ms
GET /v2/labs: 433 lần · p50 1.7 ms · p99 22.9 ms`, { sm: true, wrap: 'any' }), 'r64') },

  { t: 'The numbers side by side', to: true, giua: true, body: `<table class="t" style="font-size:20px">
<tr><th>Version</th><th>reports / s</th><th>server per report</th><th>bystander p50</th></tr>
<tr><td>Starter</td><td>2.9</td><td>335 ms</td><td>3,120 ms</td></tr>
<tr><td>One pass</td><td>516 (~180×)</td><td>3–4 ms</td><td>12 ms</td></tr>
<tr><td>One pass + 60 s cache</td><td><b>4,532</b> (~9× more)</td><td>0.7 ms (hit)</td><td><b>1.7 ms</b></td></tr>
</table>` + two(box('Order matters', 'A cache in front of the 335 ms version still freezes LabFlow once a minute per query — and on every new <code class="i">from</code>.', 'lam'), box('✗ Cache before auth', 'A student would get the managers’ report from the cache. The cache lives inside the handler, after both checks.', 'do2')) },

  { t: 'Task 5: per-instance counters — Task 6: promise it', giua: true, body: two(http(`# one fresh instance
$ for i in $(seq 1 250); do curl … :4003/v2/labs; done | sort | uniq -c
 105 200
 145 429
# two fresh instances behind the proxy
$ for i in $(seq 1 250); do curl … :8080/v2/labs; done | sort | uniq -c
 210 200
  40 429`, { sm: true, wrap: 'any' }) + box('“100/min per IP” = 100 × instances', 'Move the counter to a shared store (atomic increment) or the gateway. A per-instance report cache is fine: ≤ 60 s old is exactly what Age promises.', 'lam'),
    sql(`  /reports/usage:
    get:
      tags: [Reports]
      operationId: getUsageReport
      parameters:
        - { name: from, in: query, required: true, … format: date }
        - { name: days, in: query, … minimum: 1, maximum: 92, default: 30 }
      responses:
        '200': … rows[] + Cache-Control, Age
        '400', '401', '403', '503': …`, { lang: 'yaml', sm: true }) + box('Checked', 'Lint “valid”; gate vs 2.1.0: new operation, no breaking change; a real response validated with Ajv. SLO row: 99.5% · 2xx &lt; 1 s · 3.6 h budget.', 'xanh')) },

  { t: 'Rubric (10 points)', to: true, giua: true, body: cards([
    ['Measure — 2', 'Server-Timing read correctly; before numbers with their commands.'],
    ['Explain — 1', 'Event-loop blocking; why the in-flight limit shed nothing.'],
    ['Algorithm — 2', 'One pass; cmp identical (incl. days=92); ≥ 50× faster.'],
    ['Cache — 2', '60 s per query, Age, private; 401/403 with a warm cache.'],
    ['Instances — 1', '~2× limit measured; shared counter or gateway; staleness argued.'],
    ['Contract — 2', 'OpenAPI valid, no breaking change; SLO row matches your numbers.'],
  ]) + box('Download', 'labflow-api-ch8.zip — the chapter’s code = this lab’s solution, plus lab/reports-starter.js.', 'lam') },

  { t: 'What this lab shows', to: true, giua: true, body: `
<ul>
<li>One slow synchronous handler made the lab list wait: p50 <b>3.1 s</b> vs <b>1.7 ms</b> after the fix</li>
<li>Shedding cannot fix blocking; the algorithm can (~180×), then the cache (~9×)</li>
<li>Correctness checked <b>byte for byte</b> before speed is celebrated</li>
<li>Per-instance limits and caches: move them, or write how they really behave</li>
</ul>
${box('Next', 'Chapter 9 — data at scale: HTTP caching, read-after-write, IDs and pagination that survive sharding.', 'xanh')}` },
]);
