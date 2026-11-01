/**
 * api-08-1 — API Design · Chapter 8 · Lesson 8.1 "Latency budgets" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s08-he-thong.mjs › api-8-1-so-lieu. Output = chạy thật perf/latency-table.mjs + curl Server-Timing (Node 22, PG 18).
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 8 — Thinking in systems', bai: '8.1' };

export const deck = { key: 'api-08-1', code: 'API 8.1', title: 'Latency budgets', sub: 'Where does the time of one API call go?' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Where does the time<br>of one API call go?', sub: 'Measure every leg on your own machine<br>before you change a line.' },

  { t: 'After Chapter 8 you can…', to: true, giua: true, body: `
<ul>
<li><b>8.1</b> name real latencies from your own measurements; read <b>Server-Timing</b></li>
<li><b>8.2–8.3</b> load-test, find a blocked event loop, shrink payloads on slow links</li>
<li><b>8.4</b> run two instances and move shared state out of the process</li>
<li><b>8.5–8.6</b> write SLOs, shed load with <b>503 + Retry-After</b>, degrade on purpose</li>
<li><b>8.7 Lab</b> take a report from 3 to 4,500 requests/s, same answer byte for byte</li>
</ul>
${box('Why it is worth it', 'Interviews ask “what happens when 1,000 people do this at once?”. Every number in this chapter was measured on LabFlow.', 'lam')}` },

  { t: 'One request, many legs', to: true, giua: true, body: flow([
    { t: 'DNS+TCP+TLS', s: 'new connection only' },
    { t: 'request', s: 'phone → server', mau: '#7a5195' },
    { t: 'middleware', s: 'auth · validate' },
    { t: 'handler', s: 'DB · rules · JSON', mau: '#b85a2b' },
    { t: 'response', s: 'bigger body = slower', mau: '#c0392b' },
  ]) + box('First question, always', 'Which leg is big? Shaving 1 ms off a 0.1 ms leg changes nothing when another leg is 200 ms.', 'lam') },

  { t: 'Numbers measured on this machine', giua: true, body: http(`$ node perf/latency-table.mjs
operation                                             median     p99
Map.get — one booking by id (RAM)                      11 ns       —
filter 10,000 bookings in RAM                        81.5 µs  270.5 µs
JSON.stringify 20 bookings                            3.8 µs     5.7 µs
HMAC-SHA256 — sign one JWT                            2.0 µs     4.2 µs
scrypt — check one password (login)                  30.8 ms    33.2 ms
HTTP over localhost — GET /health                   385.6 µs     2.2 ms
PostgreSQL — SELECT by primary key                  109.7 µs   338.4 µs
PostgreSQL — OFFSET 900000 LIMIT 20                  35.2 ms    37.4 ms
Internet — example.com (connection reused)           37.1 ms    58.6 ms
Internet — first request (DNS + TCP + TLS + HTTP)   197.2 ms       —`, { sm: true }) + two(box('Normal API work is cheap', 'auth + validate + PK query + JSON ≪ 1 ms', 'xanh'), box('A few things cost 10,000×', 'scrypt · deep OFFSET · other servers · new connections', 'do2')) },

  { t: 'Median, p95, p99 — why the average lies', giua: true, body: two(`
<ul>
<li>Sort 100 times: <b>p50</b> = the 50th, <b>p99</b> = the 99th</li>
<li>99 × 2 ms + 1 × 1,000 ms ⇒ average <b>12 ms</b> — nobody had 12 ms</li>
<li>p50 = typical · p95/p99 = bad but common · max = noise</li>
</ul>`, box('One screen, five calls', 'LabFlow’s home screen calls 5 endpoints. If each is slow 1% of the time:<br><b>1 − 0.99<sup>5</sup> ≈ 4.9%</b> of screens are slow.', 'lam') + box('Fan out to 100 servers', '<b>1 − 0.99<sup>100</sup> ≈ 63%</b> of requests hit the tail.', 'do2'), 'r64') },

  { t: 'Server-Timing: each response explains itself', body: two(sql(`// timing.js (condensed)
export function serverTiming(req, res, next) {
  const start = performance.now(), marks = [];
  req.timing = {
    time(name, fn) {
      const a = performance.now();
      try { return fn(); }
      finally { marks.push([name, performance.now() - a]); }
    },
    add(name, ms) { marks.push([name, ms]); },
  };
  const writeHead = res.writeHead;
  res.writeHead = function (...args) {
    const parts = marks.map(([n, ms]) =>
      \`\${n};dur=\${ms.toFixed(2)}\`);
    parts.push(\`total;dur=\${(performance.now() - start).toFixed(2)}\`);
    res.setHeader('Server-Timing', parts.join(', '));
    return writeHead.apply(this, args);
  };
  next();
}`, { lang: 'javascript', sm: true, hl: [12, 13, 17] }), http(`POST /v2/auth/login
Server-Timing: validate;dur=0.11,
  scrypt;dur=31.19, total;dur=32.00

GET /v2/bookings?limit=20
Server-Timing: auth;dur=0.07, validate;dur=0.09,
  db;dur=0.29, sort;dur=1.08, total;dur=1.99

GET /v2/bookings?limit=20&q=lab
Server-Timing: auth;dur=0.18, validate;dur=0.34,
  db;dur=3.20, sort;dur=0.59, total;dur=4.79`, { sm: true }) + box('Read it', 'Login is <b>97% scrypt</b>. Text search: db 0.3 → 3.2 ms. Do not send this header to strangers in production.', 'lam'), 'r64') },

  { t: 'A latency budget for one endpoint', giua: true, body: two(`<table class="t" style="font-size:18px">
<tr><th>Leg</th><th>Budget</th><th>Measured</th></tr>
<tr><td>Target: book a lab, p95</td><td><b>≤ 300 ms</b></td><td>(a target)</td></tr>
<tr><td>Network, reused connection</td><td>~40 ms</td><td>37 ms</td></tr>
<tr><td>Network, new connection</td><td>~200 ms</td><td>197 ms</td></tr>
<tr><td>Server at p95</td><td>≤ 50 ms</td><td>2–5 ms today</td></tr>
<tr><td>Spare</td><td>the rest</td><td>retries, slow phones</td></tr>
</table>`, box('Open the connection early', 'At app start-up, not on the tap — the new connection alone eats 2/3 of the budget.', 'xanh') + box('Budgets turn arguments into checks', 'A PR adding a synchronous e-mail call (100+ ms) visibly blows the server line. 8.5 turns the target into an SLO.', 'lam')) },

  { t: 'Is one server enough? Estimate first', to: true, giua: true, body: cards([
    ['Average', '3,000 users × 20 calls = 60,000/day ÷ 86,400 s ≈ <b>0.7 req/s</b>'],
    ['Peak hour', '× ~10 ⇒ <b>~7 req/s</b>. One process served ~1,000 req/s on the bookings list.'],
    ['The real danger', 'Booking opens at 07:00: 2,000 logins in 10 s = <b>200/s</b>. scrypt = 31 ms ⇒ ~32/s per core. ⇒ 8.2'],
  ]) + box('Full estimation method', 'Daily users → QPS → storage → bandwidth: the System Design course, chapter 1.', 'lam') },

  { t: 'Traps and interview answers', to: true, giua: true, body: cards([
    ['✗ Trusting one run, one machine', 'A busy laptop is not an idle one. ✓ Repeat; compare orders of magnitude.'],
    ['✗ Server-Timing for everyone', 'It tells strangers which steps exist and how long. ✓ Dev, staff, or monitoring only.'],
    ['“The API is slow — where do you start?”', 'Measure each step, attack the biggest leg. In login: scrypt was 97%.'],
  ]) + box('Interview: “why p99 and not the average?”', 'The average hides the tail, and a screen that calls five endpoints meets the tail on about one load in twenty.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Measured: RAM 11 ns · JSON/JWT µs · PG PK 110 µs · scrypt 31 ms · Internet 37 / 197 ms</li>
<li>Normal work ≪ 1 ms; a few operations are 10,000× more — bottlenecks live there</li>
<li>Promise <b>percentiles</b>: 5 calls per screen ⇒ p99 on ~4.9% of screens</li>
<li><b>Server-Timing</b>: login 97% scrypt; keep it away from strangers</li>
<li>A <b>latency budget</b> splits the target; the risk is a burst on an expensive endpoint</li>
</ul>
${box('Next', 'Lesson 8.2 — the 07:00 load test, and the bottleneck it finds.', 'xanh')}` },
]);
