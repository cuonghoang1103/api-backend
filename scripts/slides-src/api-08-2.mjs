/**
 * api-08-2 — API Design · Chapter 8 · Lesson 8.2 "The first bottleneck" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s08-he-thong.mjs › api-8-2-mot-may. Output = chạy thật autocannon 8.0.0 + perf/mixed.mjs (scryptSync vs scrypt).
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 8 — Thinking in systems', bai: '8.2' };

export const deck = { key: 'api-08-2', code: 'API 8.2', title: 'The first bottleneck', sub: 'A load test, a blocked event loop, and the fix' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'A load test, and<br>the first real bottleneck', sub: 'One line from Chapter 6 made<br>every LabFlow request wait.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A first load test with <b>autocannon</b> — and a trap that looks like a fast server</li>
<li><b>Little’s law</b>: a sanity check you can do in your head</li>
<li>The <b>07:00 test</b>: logins flood in while another student browses labs</li>
<li>Why a slow login made the <b>lab list</b> 140× slower at p99</li>
<li>The fix (async scrypt), the <b>threadpool</b>, and what shares it</li>
</ul>` },

  { t: 'First load test — read the status codes', giua: true, body: two(http(`$ npx autocannon -c 10 -d 10 http://localhost:4000/v2/labs
│ Req/Sec │ … │ 8,258.1 │ …
116 2xx responses, 82460 non 2xx responses

# rate limit raised FOR THE TEST ONLY
$ LABFLOW_IP_LIMIT=1000000/60 npm start
$ npx autocannon -c 10 -d 10 …/v2/labs
│ Latency │ 0 ms │ 0 ms │ 2 ms │ 3 ms │ 0.41 ms │
│ Req/Sec │ … │ 9,414.19 │ …

$ npx autocannon -c 10 -d 10 … '…/v2/bookings?limit=20'
│ Latency │ 5 ms │ 7 ms │ 24 ms │ 37 ms │ 8.7 ms │
│ Req/Sec │ … │ 1,083.7 │ …`, { sm: true, wrap: 'any' }), box('The trap', '82,460 answers were LabFlow’s own <b>429</b> (100/min per IP, 5.3). The test measured how fast we say “too many”.', 'do2') + box('Little’s law', 'in flight = throughput × time<br>10 ÷ 9,414/s = 1.06 ms ✓ · 10 ÷ 1,084/s = 9.2 ms vs 8.7 ms ✓', 'lam'), 'r64') },

  { t: 'The 07:00 test: logins + one bystander', body: two(sql(`// perf/mixed.mjs (condensed)
const load = autocannon({
  url: \`\${BASE}/v2/auth/login\`, connections: 10, duration: 10,
  requests: [{ method: 'POST', setupRequest: (r) => ({ ...r,
    body: JSON.stringify({ email: \`sv\${n++}@…\`, password: 'wrong' }) }) }],
});
// meanwhile: one student opens the lab list every 20 ms
while (Date.now() < end) {
  const a = performance.now();
  await (await fetch(\`\${BASE}/v2/labs\`)).text();
  lat.push(performance.now() - a);
  await sleep(20);
}`, { lang: 'javascript', sm: true, hl: [3, 8] }), http(`# 5 s, no logins
$ LOAD=0 node perf/mixed.mjs
GET /v2/labs: 217 lần · p50 1.0 ms · p99 3.3 ms

# Chapter 6 code: scryptSync
$ node perf/mixed.mjs
login: 30.2 req/s · p50 311 ms · p99 538 ms
GET /v2/labs: 84 lần · p50 85.1 ms · p99 462.8 ms`, { sm: true, wrap: 'any' }) + box('Read it', 'Logins at the speed of <b>one core</b> (1000 ÷ 31 ≈ 32/s). The lab list hashes nothing — yet p99 went <b>3.3 → 463 ms</b>.', 'do2'), 'r64') },

  { t: 'Why: one thread, and scryptSync holds it', to: true, giua: true, body: flow([
    { t: '0 ms', s: 'login #1: scryptSync' },
    { t: '5 ms', s: 'GET /labs queues', mau: '#7a5195' },
    { t: '31 ms', s: 'login #2 next', mau: '#b85a2b' },
    { t: '85–460 ms', s: 'labs answered', mau: '#c0392b' },
  ]) + two(box('The rule', 'A slow <b>synchronous</b> step in ANY handler slows down EVERY endpoint. Same with big JSON.parse, readFileSync, a heavy loop, a bad regex.', 'do2'), box('Node.js docs', '“While a thread is blocked working on behalf of one client, it cannot handle requests from any other clients.”', 'lam')) + box('How to prove it', 'Probe a <b>cheap</b> endpoint while loading the <b>expensive</b> one. If the cheap one slows down too, the event loop is blocked — 84 lab-list answers in 10 s instead of ~430.', 'xanh') },

  { t: 'The fix: asynchronous scrypt', body: sql(`// passwords.js — bài 8.2
import { scrypt, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);

export async function verifyPassword(password, stored) {
  const [, saltHex, hashHex] = stored.split('$');
  const hash = await scryptAsync(password, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));
}
// routes/auth.js: async handler + await verifyPassword(…) — Express 5 forwards async errors`, { lang: 'javascript', sm: true, hl: [4, 8] }) + two(http(`$ node perf/mixed.mjs
login: 113.6 req/s · p50 81 ms · p99 226 ms
GET /v2/labs: 438 lần · p50 1.0 ms · p99 8.0 ms`, { sm: true, wrap: 'any' }) + box('Why ~4×, not 10×', 'The asynchronous scrypt runs on libuv’s threadpool: 4 threads × ~32/s ≈ 128; measured 114.', 'lam'), `<table class="t" style="font-size:19px">
<tr><th></th><th>scryptSync</th><th>scrypt</th></tr>
<tr><td>lab list p99</td><td>463 ms</td><td><b>8 ms</b></td></tr>
<tr><td>lab list p50</td><td>85 ms</td><td><b>1.0 ms</b></td></tr>
<tr><td>logins/s</td><td>30.2</td><td><b>113.6</b></td></tr>
<tr><td>code changed</td><td colspan="2">two lines, no new library</td></tr>
</table>`) },

  { t: 'Four threads by default — and who shares them', giua: true, body: two(http(`$ UV_THREADPOOL_SIZE=8 npm start
$ node perf/mixed.mjs
login: 193.0 req/s · p50 45 ms · p99 167 ms
GET /v2/labs: 398 lần · p50 2.7 ms · p99 13.0 ms`, { sm: true, wrap: 'any' }) + box('Measure the trade-off', '193 logins/s, but the bystander’s p50 rose 1.0 → 2.7 ms: load generator, probe, 8 threads and the event loop share one 10-core laptop.', 'lam'),
    box('libuv threadpool (default 4) is shared by', 'async <b>crypto</b> (scrypt, pbkdf2, randomBytes) · non-sync <b>fs</b> · <b>dns.lookup()</b> · <b>zlib</b> (compression, 8.3)', 'xanh') + box('✗ process.env.UV_THREADPOOL_SIZE = 8 in code', 'The pool may already exist — not guaranteed. Set it in the environment that starts Node.', 'do2')) },

  { t: 'Traps and interview answers', to: true, giua: true, body: cards([
    ['✗ Load test without status codes', '82,460 “fast” answers were 429. ✓ Count 2xx; check Little’s law.'],
    ['“All endpoints got slow at once”', 'In Node: suspect a synchronous CPU step. Prove it with a bystander probe.'],
    ['“How did you find it?”', 'Mixed test → Server-Timing → one change → same test: p99 463 → 8 ms.'],
  ]) + box('Academy link', 'SDN302 1.1 states the rule “no CPU-heavy work on the main thread”; here you measured what breaking it costs.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Read every load test’s <b>status codes</b>; sanity-check with Little’s law</li>
<li>Mixed load showed the damage: lab list p99 <b>3.3 → 463 ms</b> at 30 logins/s</li>
<li>Cause: <b>scryptSync</b> held Node’s only JavaScript thread 31 ms per login</li>
<li>Fix: async scrypt — p99 <b>8 ms</b>, logins <b>114/s</b>; 8 threads gave 193/s at a cost</li>
<li>The threadpool is shared with fs, dns.lookup, zlib; size it in the environment</li>
</ul>
${box('Next', 'Lesson 8.3 — slow by design: payload size, sparse fields and compression.', 'xanh')}` },
]);
