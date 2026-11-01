/**
 * api-08-5 — API Design · Chapter 8 · Lesson 8.5 "SLOs and load shedding" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s08-he-thong.mjs › api-8-4-kha-dung. Output = chạy thật perf/budget.mjs, perf/probe.mjs, perf/shed.mjs (100/200 người, có/không LABFLOW_LOGIN_MAX_INFLIGHT=8).
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 8 — Thinking in systems', bai: '8.5' };

export const deck = { key: 'api-08-5', code: 'API 8.5', title: 'SLOs and load shedding', sub: 'Availability in the contract (1/2)' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'SLOs, error budgets<br>and load shedding', sub: 'Accepting fewer requests<br>got ten times more people in.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>SLI, SLO, SLA</b> — and the error budget, in minutes</li>
<li>Why availabilities in a chain <b>multiply</b></li>
<li>Measuring an SLI the way a <b>user</b> sees it</li>
<li><b>Congestion collapse</b>: the server is busy, nobody is served</li>
<li><b>Load shedding</b> with 503 + Retry-After; 429 or 503?</li>
</ul>` },

  { t: 'SLI, SLO, SLA — and the error budget', giua: true, body: two(`<ul>
<li><b>SLI</b> — a number you measure: share of GET /v2/labs that are 2xx and &lt; 300 ms</li>
<li><b>SLO</b> — its target over a window: 99.9% / 30 days</li>
<li><b>SLA</b> — an SLO in a contract with consequences</li>
<li><b>Error budget</b> = 100% − SLO: spent on outages, deploys, maintenance</li>
</ul>`, http(`$ node perf/budget.mjs
SLO     hỏng tối đa / 30 ngày   / tuần     lỗi / 1 triệu request
99      7.2 giờ          1.7 giờ    10000
99.5    3.6 giờ          50.4 phút  5000
99.9    43.2 phút        10.1 phút  1000
99.95   21.6 phút        5.0 phút   500
99.99   4.3 phút         1.0 phút   100

LB 99.99% × LabFlow 99.95% × PostgreSQL 99.95% × email 99.9%
  = 99.790%  ⇒ 1.5 giờ hỏng mỗi 30 ngày
Bỏ email ra khỏi đường đồng bộ: 99.890% ⇒ 47.5 phút`, { sm: true, wrap: 'any' }) + box('In a chain, availabilities multiply', 'The whole is worse than any part. Send the e-mail later from a queue (Chapter 10).', 'lam')) },

  { t: 'Measure the SLI like a user', giua: true, body: two(sql(`// perf/probe.mjs (condensed)
while (Date.now() < end) {
  const a = performance.now();
  let status = 'timeout';
  try {
    const r = await fetch(URL_, { signal: AbortSignal.timeout(1000) });
    await r.text(); status = r.status;
  } catch {}
  const ms = performance.now() - a;
  total++;
  if (typeof status === 'number' && status < 300 && ms < 300) good++;
  await sleep(100);
}`, { lang: 'javascript', sm: true, hl: [11] }), http(`# LABFLOW_OUTAGE_MS=3000: the first 3 s answer 503
$ SECONDS=30 node perf/probe.mjs
291 request · tốt 262 · mã {"200":262,"503":29}
SLI (2xx và < 300 ms): 90.03% · SLO 99.9% ⇒ TRƯỢT
Ngân sách lỗi 30 ngày ở SLO 99.9%: 43.2 phút
  · lần đo này đã dùng 0.05 phút (0.1%)`, { sm: true, wrap: 'any' }) + box('The window matters', '90% over 30 s — but 0.1% of a 30-day budget. Alerts fire when the budget burns <b>fast</b>.', 'lam') + box('Why from outside?', 'Server logs miss requests that never reached the server.', 'xanh')) },

  { t: 'Overload: when everyone waits, nobody is served', giua: true, body: two(http(`$ CONC=100 node perf/shed.mjs     # each user waits ≤ 1 s
  có câu trả lời :  1360  (136.0/s) · p50 786 ms · p99 821 ms
  bỏ cuộc (timeout):   0
  tải đã dừng — cô Lan đăng nhập: 200 sau 32 ms

$ CONC=200 node perf/shed.mjs
  có câu trả lời :   116  (11.6/s) · p50 561 ms · p99 987 ms
  bỏ cuộc (timeout): 1990  ⇒ server vẫn làm 1990 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 12977 ms`, { sm: true, wrap: 'any' }), box('Congestion collapse', '<b>Throughput</b> stays high, <b>goodput</b> (answers someone still waits for) falls from 136/s to <b>12/s</b>.', 'do2') + box('Wasted work', 'The server cannot know the client gave up: it hashed 1,990 abandoned passwords — and Lan waited <b>13 s</b> after the test ended.', 'do2') + box('Amazon Builders’ Library', 'Reject excess work early and cheaply; retries amplify overload.', 'lam')) },

  { t: 'Load shedding: say “no” quickly', body: two(sql(`// resilience.js
export function limitInflight(max) {
  let inflight = 0;
  return (req, res, next) => {
    if (inflight >= max) {
      res.set('Retry-After', '1');
      throw new HttpError(503, 'OVERLOADED', { max });
    }
    inflight++;
    res.once('close', () => { inflight--; });
    next();
  };
}
// routes/auth.js — BEFORE the per-user login limit
.post(...shed, loginLimit, validate('body', Login), …)`, { lang: 'javascript', sm: true, hl: [5, 6, 7] }), http(`HTTP/1.1 503 Service Unavailable
Retry-After: 1
Content-Type: application/problem+json

{ "type": "…/problems/overloaded",
  "status": 503,
  "detail": "Đang xử lý tối đa 1 yêu cầu loại này; …",
  "code": "OVERLOADED" }`, { sm: true, wrap: 'any' }) + box('Why 8?', '4 threadpool threads × 2: no thread waits for work, the queue never grows.', 'lam') + box('429 or 503?', '<b>429</b>: you are over your quota. <b>503</b>: the service cannot take it now, for anyone. Both with Retry-After (RFC 9110).', 'xanh'), 'r64') },

  { t: 'Shedding at 100 and 200 users', giua: true, body: two(http(`$ LABFLOW_LOGIN_MAX_INFLIGHT=8 npm start
$ CONC=100 node perf/shed.mjs
  có câu trả lời :  1268  (126.8/s) · p50 63 ms · p99 71 ms
  bị từ chối 503 :   920  · p50 3 ms
  tải đã dừng — cô Lan đăng nhập: 200 sau 35 ms

$ CONC=200 node perf/shed.mjs
  có câu trả lời :  1226  (122.6/s) · p50 64 ms · p99 110 ms
  bị từ chối 503 :  1920  · p50 7 ms
  tải đã dừng — cô Lan đăng nhập: 200 sau 33 ms`, { sm: true, wrap: 'any' }), `<table class="t" style="font-size:18px">
<tr><th>200 users</th><th>no limit</th><th>limit 8</th></tr>
<tr><td>answered / s</td><td>12</td><td><b>123</b></td></tr>
<tr><td>abandoned</td><td>1,990</td><td><b>0</b></td></tr>
<tr><td>login after the peak</td><td>13 s</td><td><b>33 ms</b></td></tr>
</table>` + box('Report the spread', 'One run under heavy machine load: 65.7/s; repeated runs 120–126/s.', 'lam') + box('✗ Shedding work that never waits', 'A synchronous CPU handler holds the event loop: the counter never sees 2 in flight. Fix blocking first (Lab 8).', 'do2')) },

  { t: 'Interview answers', to: true, giua: true, body: cards([
    ['“What is an error budget?”', '100% − SLO over a window. 99.9% / 30 days = 43 minutes. When it is gone, slow down releases.'],
    ['“Your server is overloaded.”', 'Shed early and cheaply: 503 + Retry-After. Goodput 12 → 123/s at 200 users.'],
    ['“429 or 503?”', '429: this client is over its quota. 503: nobody can be served right now.'],
  ]) + box('Practice', 'Try LABFLOW_LOGIN_MAX_INFLIGHT = 4, 8, 16, 64 at CONC=200. Why does 64 behave like no limit?', 'xanh') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>SLO 99.9% = <b>43.2 minutes</b> per 30 days; a chain of four parts → 99.79%</li>
<li>A probe that acts like a user: a 3 s outage = 90% over 30 s, 0.1% of the month</li>
<li>No shedding at 200 users: goodput <b>136 → 12/s</b>, 13 s of abandoned work</li>
<li><b>limitInflight(8)</b> + 503 + Retry-After: <b>123/s</b> in ~64 ms; refusals in ms</li>
<li>Only work that <b>waits</b> can be shed</li>
</ul>
${box('Next', 'Lesson 8.6 — the database goes down: degrade on purpose, readiness, and clients that read the contract.', 'xanh')}` },
]);
