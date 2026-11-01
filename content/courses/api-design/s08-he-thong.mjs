/**
 * API Design — Chương 8: Tư duy hệ thống (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, autocannon 8.0.0, compression 1.8.2, pg 8.23.1, PostgreSQL 18 (riêng, cổng 55432).
 * Bảng độ trễ đo trên máy, Server-Timing, test tải trộn (scryptSync chặn event loop: p99 3,3 → 463 ms; scrypt bất đồng bộ: 8 ms),
 * payload qua đường 1 Mbit/s giả lập, hai instance sau round-robin (4 chỗ hỏng; idempotency dùng chung bằng PostgreSQL),
 * SLO/ngân sách lỗi, sụp vì nghẽn và bỏ bớt tải 503 + Retry-After, suy giảm có kiểm soát + /ready, client đọc hợp đồng.
 * Mã cuối chương = lời giải Lab 8 (bài 8.7, báo cáo dùng phòng). Slide: api-08-1 … api-08-6 + api-lab-8; giảng EN/VI ở ./giang/.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-8-1-so-lieu, api-8-2-mot-may, api-8-3-mo-rong, api-8-4-kha-dung (thứ tự hiển thị 8.1, 8.2, 8.4, 8.5) và title chương;
 * bài 8.3 (api-8-2-payload) và 8.6 (api-8-4-suy-giam) là bài MỚI tách ra để mỗi bài ≤ 40k ký tự.
 */

import G081 from './giang/api-08-1.mjs';
import G082 from './giang/api-08-2.mjs';
import G083 from './giang/api-08-3.mjs';
import G084 from './giang/api-08-4.mjs';
import G085 from './giang/api-08-5.mjs';
import G086 from './giang/api-08-6.mjs';
import GL8 from './giang/api-lab-8.mjs';

export default {
  title: 'Chapter 8 — Thinking in systems|||Chương 8 — Tư duy hệ thống',
  description: 'Độ trễ, tải và tính sẵn sàng đo thật trên LabFlow: bảng độ trễ và Server-Timing; test tải trộn tìm ra scryptSync chặn event loop (p99 3,3 → 463 ms) và sửa bằng scrypt bất đồng bộ; payload qua đường 1 Mbit/s (319 → 103 ms nhờ nén); hai instance sau load balancer làm hỏng 4 thứ và cách đưa trạng thái ra ngoài; SLO, ngân sách lỗi, bỏ bớt tải 503 + Retry-After (goodput 12 → 123/s); suy giảm có kiểm soát, readiness và client đọc hợp đồng; lab báo cáo dùng phòng có thang chấm, quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Latency budgets: where does the time of one API call go?|||8.1 — Ngân sách độ trễ: thời gian của một lời gọi API đi đâu?',
      slug: 'api-8-1-so-lieu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở đầu chương: học xong làm được gì. Bảng độ trễ tự đo (RAM 11 ns tới Internet 197 ms), median và p99, Server-Timing (đăng nhập 97% là scrypt), ngân sách độ trễ cho một endpoint, ước lượng tải của LabFlow.',
      content: `${G081}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Latency budgets: where does the time of one API call go?</h2>
<p class="lead">Chapters 1–7 asked “is the API <em>correct</em>?” This chapter asks “is it <em>fast enough</em>, and does it <em>stay up</em> when many people use it at once?” Before changing anything you need numbers: how long each step of a request really takes, measured on your own machine, and a way to see those steps on every response. That is this lesson.</p>

<div class="callout ok">
<p><strong>After Chapter 8 you can:</strong></p>
<ul>
  <li>say how long RAM, CPU work, a database query and the Internet take, from numbers you measured yourself, and split a response time into legs with <code>Server-Timing</code> (8.1);</li>
  <li>load-test an endpoint, read median/p99 correctly, and find the first bottleneck — here a password hash that made every other request wait up to 460 ms (8.2), and see why a 25 KB answer that takes 3 ms on localhost takes 319 ms on slow Wi-Fi (8.3);</li>
  <li>run LabFlow as two instances behind a load balancer, see four things break, and fix the pattern with a shared store (8.4);</li>
  <li>write availability into the contract: an SLO with an error budget, <code>503</code> + <code>Retry-After</code> load shedding, stale-but-labelled data, and readiness checks (8.5–8.6);</li>
  <li>take a slow report from 3 requests/s to 4,500/s in the lab, with the same answer byte for byte (8.7).</li>
</ul>
<p><strong>Why it is worth it:</strong> “it works on my machine with one user” is where most student projects stop. Interviews for backend roles ask “what happens when 1,000 people do this at once?”, and on-call work is mostly reading these numbers. Every number in this chapter was measured on LabFlow — none is copied from a blog.</p>
</div>

<h3>One request, many legs</h3>
<p>When An taps “Book” in the LabFlow app, the time he waits is the sum of many smaller times. Some are on the network, some are in our code, some are in the database:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · network</span><span class="lz-t">DNS + TCP + TLS</span><span class="lz-d">only for a NEW connection; reused connections skip it</span></div>
  <div class="lz-step"><span class="lz-k">2 · network</span><span class="lz-t">request travels</span><span class="lz-d">phone → Wi-Fi/4G → Internet → our server</span></div>
  <div class="lz-step"><span class="lz-k">3 · server</span><span class="lz-t">middleware</span><span class="lz-d">verify JWT (auth), validate body (Zod)</span></div>
  <div class="lz-step"><span class="lz-k">4 · server</span><span class="lz-t">handler</span><span class="lz-d">query the database, apply rules, build JSON</span></div>
  <div class="lz-step"><span class="lz-k">5 · network</span><span class="lz-t">response travels back</span><span class="lz-d">bigger body = longer on slow links (8.3)</span></div>
</div>
<p>To make a request faster you must first know <strong>which leg is big</strong>. Shaving 1 ms off a 0.1 ms leg changes nothing when another leg is 200 ms.</p>

<h3>Numbers measured on this machine</h3>
<p>Instead of memorising a famous table from someone else’s hardware, measure your own. <code>perf/latency-table.mjs</code> times each thing a LabFlow request can do — 5 to 1,000,000 times, in a loop of <code>performance.now()</code> pairs — and prints the median and the 99th percentile (next section). It is in the chapter’s project zip (Lab 8).</p>
<p>LabFlow runs on port 4000 and the private PostgreSQL from Chapter 3 (the table with 1,000,000 bookings) on 55432:</p>
<pre><code class="language-bash">node perf/latency-table.mjs</code></pre>
<div class="out">operation                                                   median        p99
Map.get — one booking by id (RAM)                            11 ns          —
filter 10,000 bookings in RAM (my bookings)                81.5 µs   270.5 µs
JSON.stringify 20 bookings                                  3.8 µs     5.7 µs
HMAC-SHA256 — sign one JWT                                  2.0 µs     4.2 µs
scrypt — check one password (login)                        30.8 ms    33.2 ms
HTTP over localhost — GET /health (keep-alive)            385.6 µs     2.2 ms
PostgreSQL over localhost — SELECT by primary key         109.7 µs   338.4 µs
PostgreSQL — OFFSET 900000 LIMIT 20 (Chapter 3)            35.2 ms    37.4 ms
Internet — GET https://example.com/ (connection reused)    37.1 ms    58.6 ms
Internet — first request (DNS + TCP + TLS + HTTP)         197.2 ms          —</div>
<p>Read it as <strong>orders of magnitude</strong>, not the third digit (one run on one laptop — repeat yours): each line is roughly 10–1,000 times the one before.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">nanoseconds (ns)</span><span class="lz-lnote">a Map lookup in RAM: 11 ns — you can do a million per request and not notice</span></div>
  <div class="lz-layer"><span class="lz-lname">microseconds (µs)</span><span class="lz-lnote">JSON of 20 bookings 3.8 µs · sign a JWT 2 µs · filter 10,000 rows 82 µs · PG primary-key query 110 µs</span></div>
  <div class="lz-layer"><span class="lz-lname">milliseconds (ms)</span><span class="lz-lnote">check ONE password with scrypt 31 ms · OFFSET 900,000 35 ms · a far server on the Internet 37 ms</span></div>
  <div class="lz-layer"><span class="lz-lname">hundreds of ms</span><span class="lz-lnote">first request to a far server (DNS + TCP + TLS + HTTP): 197 ms</span></div>
</div>
<p>Three lessons fall out of this table:</p>
<ul>
  <li><strong>Normal API work is cheap.</strong> Auth + validation + a primary-key query + JSON is well under 1 ms of server time. A LabFlow request is usually dominated by the network, not by our code.</li>
  <li><strong>A few operations are 10,000× more expensive</strong> than the rest: password hashing (slow <em>on purpose</em>, 6.1), deep <code>OFFSET</code> (3.1), calls to other servers. These are where bottlenecks live.</li>
  <li><strong>New connections are expensive.</strong> 197 ms for the first request versus 37 ms on a reused connection. Keep connections alive.</li>
</ul>
<h3>Median, p95, p99 — why the average lies</h3>
<p>If you send 100 requests and sort their times, the <strong>median</strong> (p50) is the 50th — half were faster. The <strong>p99</strong> is the 99th: only 1 request in 100 was slower. People feel the slow ones, so APIs promise percentiles, not averages:</p>
<ul>
  <li><strong>Average</strong> mixes everything: 99 requests at 2 ms and one at 1,000 ms average 12 ms — a number no request actually had.</li>
  <li><strong>p50</strong> = the typical experience. <strong>p95 / p99</strong> = the bad-but-common experience. <strong>max</strong> = one unlucky request (noisy; do not set targets on it).</li>
</ul>
<p>Why care about 1 in 100? Because one screen calls several endpoints. LabFlow’s home screen calls 5 (<code>/me</code>, <code>/labs</code>, <code>/bookings</code>, <code>/me/waitlist</code>, <code>/app-config</code>). If each is slow 1% of the time, the screen is slow when <em>any</em> of them is: 1 − 0.99<sup>5</sup> ≈ <strong>4.9%</strong> of home-screen loads. A backend that fans one request out to 100 servers sees the slow 1% on 1 − 0.99<sup>100</sup> ≈ <strong>63%</strong> of requests. The tail becomes the normal case.</p>
<a class="link-card" href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google SRE book — Service Level Objectives (read 1 Nov 2026)</span><span class="lc-sub">Prefers percentiles to averages because averages hide the long tail; its examples are written as percentiles, e.g. “99% of Get calls complete in under 100 ms”. Lesson 8.5 builds SLOs on this.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Server-Timing: let every response say where its time went</h3>
<p><code>Server-Timing</code> is a standard response header that carries named durations, for example <code>db;dur=3.2, total;dur=4.8</code>. Browser DevTools shows it in the Network → Timing tab; curl shows it with <code>-D -</code>. LabFlow gets a small middleware: each request gets <code>req.timing.time(name, fn)</code> to time a step and <code>add(name, ms)</code> for steps that are awaited; the header is written just before the status line goes out.</p>
<pre><code class="language-javascript">// timing.js — bài 8.1: đo từng chặng của MỘT request rồi báo trong header Server-Timing (chuẩn W3C)
// DevTools (tab Network → Timing) đọc được header này; curl -i thấy ngay.
export function serverTiming(req, res, next) {
  const start = performance.now();
  const marks = [];
  req.timing = {
    time(name, fn) {                                   // đo một đoạn code đồng bộ
      const a = performance.now();
      try { return fn(); } finally { marks.push([name, performance.now() - a]); }
    },
    add(name, ms) { marks.push([name, ms]); },          // đoạn bất đồng bộ: tự đo rồi ghi lại
  };
  const writeHead = res.writeHead;                   // header phải gắn TRƯỚC khi gửi: chặn ngay lúc ghi dòng trạng thái
  res.writeHead = function (...args) {
    const parts = marks.map(([n, ms]) =&gt; &#96;\${n};dur=\${ms.toFixed(2)}&#96;);
    parts.push(&#96;total;dur=\${(performance.now() - start).toFixed(2)}&#96;);
    if (!res.headersSent) res.setHeader('Server-Timing', parts.join(', '));
    return writeHead.apply(this, args);
  };
  next();
}</code></pre>
<p>The steps are wired in one line each: <code>auth</code> around JWT verification (6.1), <code>validate</code> in the Zod middleware (2.2), <code>db</code> and <code>sort</code> in the bookings list, <code>scrypt</code> in login. The bookings list is served from 10,000 seeded bookings (<code>SEED_BOOKINGS=10000</code>, 3.1):</p>
<pre><code class="language-bash">curl -s -D - -o /dev/null -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | grep -iE '^(HTTP|Server-Timing)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Server-Timing: validate;dur=0.11, scrypt;dur=31.19, total;dur=32.00</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=20' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(Server-Timing|Content-Length)'</code></pre>
<div class="out">Content-Length: 7411
Server-Timing: auth;dur=0.07, validate;dur=0.09, db;dur=0.29, sort;dur=1.08, total;dur=1.99</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(Server-Timing|Content-Length)'</code></pre>
<div class="out">Content-Length: 36428
Server-Timing: auth;dur=0.07, validate;dur=0.07, db;dur=0.13, sort;dur=0.53, total;dur=1.26</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=20&amp;q=lab' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(Server-Timing|Content-Length)'</code></pre>
<div class="out">Content-Length: 7379
Server-Timing: auth;dur=0.18, validate;dur=0.34, db;dur=3.20, sort;dur=0.59, total;dur=4.79</div>
<p>Now each response explains itself:</p>
<ul>
  <li><strong>Login</strong> spends 31.2 of its 32.0 ms in <code>scrypt</code> — 97%. Optimising anything else in login is pointless.</li>
  <li><strong>Bookings, 20 per page</strong>: 2 ms total, mostly <code>sort</code>. Asking for 100 is <em>not</em> slower on the server (1.26 ms) — but the body is 36 KB instead of 7 KB, which matters on the network (8.3).</li>
  <li><strong>Search <code>q=lab</code></strong>: <code>db</code> jumps from 0.3 to 3.2 ms — text search scans every booking. Fine at 10,000; at a million it is Chapter 3’s problem again.</li>
</ul>
<div class="pitfall"><p><strong>Trap — sending Server-Timing to everyone in production.</strong> The header tells a stranger which steps exist and how long they take (for example: is this email registered? does this query hit the database?). Send it in development, to staff accounts, or only to your own monitoring. LabFlow sends it while learning.</p></div>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Server-Timing" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: MDN — Server-Timing header (read 1 Nov 2026)</span><span class="lc-sub">Syntax name;dur=…;desc=…, shown in DevTools and readable from JavaScript as PerformanceServerTiming (same origin unless Timing-Allow-Origin allows another). Warns that it may expose sensitive application and infrastructure information.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>A latency budget for one endpoint</h3>
<p>A <strong>latency budget</strong> is a target split across legs, written down before you build. Say the team wants “booking a lab feels instant on campus Wi-Fi”: <em>p95 under 300 ms</em> measured in the app. Using the measured numbers:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Target · p95 ≤ 300 ms</span><span class="lz-lnote">what the user feels, measured in the app (a target, not a measurement)</span></div>
  <div class="lz-layer"><span class="lz-lname">Network, reused connection · ~40 ms</span><span class="lz-lnote">measured 37 ms median to a far server; keep connections alive</span></div>
  <div class="lz-layer"><span class="lz-lname">Network, new connection · ~200 ms</span><span class="lz-lnote">measured 197 ms — the app should open the connection early (at start-up), not on the tap</span></div>
  <div class="lz-layer"><span class="lz-lname">Server · ≤ 50 ms at p95</span><span class="lz-lnote">today ~2–5 ms; the budget leaves room for the conflict query on real PostgreSQL (Ch12)</span></div>
  <div class="lz-layer"><span class="lz-lname">Spare · the rest</span><span class="lz-lnote">for retries (5.2), slow phones, and the next feature</span></div>
</div>
<p>The budget turns arguments into checks: a pull request that adds a synchronous call to an email service (often 100+ ms) visibly blows the server line. Lesson 8.5 turns the target into an SLO.</p>

<h3>Is that enough? Estimating LabFlow’s load</h3>
<p>Back-of-the-envelope maths before buying servers. Assumptions (write them down, they will be wrong in the details): a campus with 8,000 students, 3,000 of them use LabFlow on a normal day, ~20 API calls each.</p>
<ul>
  <li>Average: 3,000 × 20 = 60,000 calls a day ÷ 86,400 s ≈ <strong>0.7 req/s</strong>.</li>
  <li>Peak: most traffic falls in a few hours, so multiply by ~10: <strong>~7 req/s</strong>. One process measured ~1,000 req/s on the bookings list — 100× headroom.</li>
  <li>The real danger is a <strong>burst on an expensive endpoint</strong>: booking opens at 07:00 and 2,000 students log in within 10 seconds = <strong>200 logins/s</strong>. Login costs 31 ms of CPU — one core does ~32 per second. That number is lesson 8.2.</li>
</ul>
<p>The full method (daily users → QPS → storage → bandwidth) is chapter 1 of the <em>System Design</em> course; this chapter stays at the level of one API.</p>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“The API is slow — where do you start?”</strong> Measure where the time goes before changing code: Server-Timing or tracing per step, then the biggest leg. In LabFlow’s login, 97% was scrypt.</li>
</ul>

<h3>🧪 Practice (25–35 min)</h3>
<div class="callout ok"><ol>
  <li>Add a <code>conflict</code> timing around the overlap check in <code>POST /v2/bookings</code> and read it with curl. How much of <code>total</code> is it with 10,000 seeded bookings?</li>
  <li>Write a latency budget for <code>GET /v2/bookings</code> using your own network numbers.</li>
</ol>
<p><strong>Done when:</strong> you can say, for login and for the bookings list, which leg is the biggest and how you know.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Latency</span><span class="v">How long one request takes, from send to full response.</span></div>
  <div class="kv"><span class="k">Throughput</span><span class="v">How many requests are completed per second (req/s).</span></div>
  <div class="kv"><span class="k">Percentile (p50, p99)</span><span class="v">The time that 50% / 99% of requests were faster than.</span></div>
  <div class="kv"><span class="k">Server-Timing</span><span class="v">Response header with named durations per server step.</span></div>
  <div class="kv"><span class="k">Latency budget</span><span class="v">A target response time split across the legs of a request.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Measured: RAM 11 ns, JSON/JWT µs, PG primary key 110 µs, scrypt 31 ms, OFFSET 900k 35 ms, Internet 37 ms reused / 197 ms new.</li>
  <li>Normal API work costs well under 1 ms; a few operations cost 10,000× more — bottlenecks live there.</li>
  <li>Promise percentiles, not averages; screens that call 5 endpoints see the p99 on ~4.9% of loads.</li>
  <li>Server-Timing showed login is 97% scrypt; do not send it to strangers in production.</li>
  <li>A latency budget splits a target across legs. Normal requests are network-bound; the risk is a burst on an expensive endpoint — 200 logins/s against ~32/s per core (8.2).</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Ngân sách độ trễ: thời gian của một lời gọi API đi đâu?</h2>
<p class="lead">Chương 1–7 hỏi “API có <em>đúng</em> không?”. Chương này hỏi “nó có <em>đủ nhanh</em> không, và có <em>còn sống</em> khi nhiều người dùng cùng lúc không?”. Trước khi sửa gì, bạn cần số liệu: mỗi bước của một request thật sự tốn bao lâu, đo trên chính máy bạn, và một cách để thấy các bước đó trên mọi response. Đó là bài này.</p>

<div class="callout ok">
<p><strong>Học xong Chương 8 bạn làm được:</strong></p>
<ul>
  <li>nói được RAM, việc tính toán CPU, một truy vấn CSDL và Internet tốn bao lâu, bằng số tự đo, và tách thời gian trả lời thành từng chặng bằng <code>Server-Timing</code> (8.1);</li>
  <li>test tải một endpoint, đọc đúng median/p99, và tìm ra nút thắt đầu tiên — ở đây là một lần băm mật khẩu bắt mọi request khác chờ tới 460 ms (8.2), và thấy vì sao câu trả lời 25 KB mất 3 ms trên localhost lại mất 319 ms trên Wi-Fi chậm (8.3);</li>
  <li>chạy LabFlow thành hai bản sau một bộ cân bằng tải, thấy bốn thứ hỏng, và sửa theo mẫu bằng kho dùng chung (8.4);</li>
  <li>viết tính sẵn sàng vào hợp đồng: SLO kèm ngân sách lỗi, bỏ bớt tải bằng <code>503</code> + <code>Retry-After</code>, dữ liệu cũ có dán nhãn, và kiểm tra readiness (8.5–8.6);</li>
  <li>trong lab, đưa một báo cáo chậm từ 3 request/giây lên 4.500/giây, câu trả lời giống hệt từng byte (8.7).</li>
</ul>
<p><strong>Vì sao đáng học:</strong> “máy em chạy được với một người dùng” là chỗ phần lớn đồ án sinh viên dừng lại. Phỏng vấn backend hay hỏi “1.000 người cùng làm việc này thì sao?”, và trực sự cố (on-call) phần lớn là đọc những con số này. Mọi số trong chương đều đo trên LabFlow — không số nào chép từ blog.</p>
</div>

<h3>Một request, nhiều chặng</h3>
<p>Khi An bấm “Đặt phòng” trên app LabFlow, thời gian cậu chờ là tổng của nhiều khoảng nhỏ hơn. Có khoảng nằm trên mạng, có khoảng trong code của ta, có khoảng trong cơ sở dữ liệu:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · mạng</span><span class="lz-t">DNS + TCP + TLS</span><span class="lz-d">chỉ với kết nối MỚI; kết nối dùng lại thì bỏ qua bước này</span></div>
  <div class="lz-step"><span class="lz-k">2 · mạng</span><span class="lz-t">request đi</span><span class="lz-d">điện thoại → Wi-Fi/4G → Internet → server của ta</span></div>
  <div class="lz-step"><span class="lz-k">3 · server</span><span class="lz-t">middleware</span><span class="lz-d">kiểm JWT (auth), kiểm body (Zod)</span></div>
  <div class="lz-step"><span class="lz-k">4 · server</span><span class="lz-t">handler</span><span class="lz-d">truy vấn CSDL, áp luật, dựng JSON</span></div>
  <div class="lz-step"><span class="lz-k">5 · mạng</span><span class="lz-t">response quay về</span><span class="lz-d">body càng lớn càng lâu trên đường truyền chậm (8.3)</span></div>
</div>
<p>Muốn request nhanh hơn, trước hết phải biết <strong>chặng nào lớn</strong>. Gọt 1 ms khỏi một chặng 0,1 ms chẳng đổi được gì khi có chặng khác 200 ms.</p>

<h3>Số liệu đo trên chính máy này</h3>
<p>Thay vì học thuộc một bảng nổi tiếng đo trên phần cứng của người khác, hãy tự đo. <code>perf/latency-table.mjs</code> bấm giờ từng việc mà một request LabFlow có thể làm — mỗi việc từ 5 tới 1.000.000 lần, bằng các cặp <code>performance.now()</code> — rồi in ra trung vị (median) và phân vị 99 (p99, mục sau). Tệp nằm trong gói dự án của chương (Lab 8).</p>
<p>LabFlow chạy ở cổng 4000, PostgreSQL riêng của Chương 3 (bảng 1.000.000 lượt đặt) ở cổng 55432:</p>
<pre><code class="language-bash">node perf/latency-table.mjs</code></pre>
<div class="out">operation                                                   median        p99
Map.get — one booking by id (RAM)                            11 ns          —
filter 10,000 bookings in RAM (my bookings)                81.5 µs   270.5 µs
JSON.stringify 20 bookings                                  3.8 µs     5.7 µs
HMAC-SHA256 — sign one JWT                                  2.0 µs     4.2 µs
scrypt — check one password (login)                        30.8 ms    33.2 ms
HTTP over localhost — GET /health (keep-alive)            385.6 µs     2.2 ms
PostgreSQL over localhost — SELECT by primary key         109.7 µs   338.4 µs
PostgreSQL — OFFSET 900000 LIMIT 20 (Chapter 3)            35.2 ms    37.4 ms
Internet — GET https://example.com/ (connection reused)    37.1 ms    58.6 ms
Internet — first request (DNS + TCP + TLS + HTTP)         197.2 ms          —</div>
<p>Đọc bảng theo <strong>bậc độ lớn</strong>, đừng soi chữ số thứ ba (một lần đo trên một laptop — hãy tự đo lại): mỗi dòng gấp khoảng 10–1.000 lần dòng trước.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">nano giây (ns)</span><span class="lz-lnote">tra một Map trong RAM: 11 ns — một request làm cả triệu lần cũng không ai thấy</span></div>
  <div class="lz-layer"><span class="lz-lname">micro giây (µs)</span><span class="lz-lnote">JSON 20 lượt đặt 3,8 µs · ký JWT 2 µs · lọc 10.000 dòng 82 µs · PG tìm theo khoá chính 110 µs</span></div>
  <div class="lz-layer"><span class="lz-lname">mili giây (ms)</span><span class="lz-lnote">kiểm MỘT mật khẩu bằng scrypt 31 ms · OFFSET 900.000 35 ms · một server xa trên Internet 37 ms</span></div>
  <div class="lz-layer"><span class="lz-lname">hàng trăm ms</span><span class="lz-lnote">request đầu tiên tới server xa (DNS + TCP + TLS + HTTP): 197 ms</span></div>
</div>
<p>Từ bảng này rút ra ba điều:</p>
<ul>
  <li><strong>Việc API bình thường rất rẻ.</strong> Auth + kiểm dữ liệu + một truy vấn theo khoá chính + JSON tốn chưa tới 1 ms ở server. Một request LabFlow thường bị mạng chi phối, không phải code của ta.</li>
  <li><strong>Vài thao tác đắt gấp 10.000 lần</strong> phần còn lại: băm mật khẩu (cố ý chậm, bài 6.1), <code>OFFSET</code> sâu (3.1), gọi sang server khác. Nút thắt nằm ở đó.</li>
  <li><strong>Kết nối mới thì đắt.</strong> 197 ms cho request đầu so với 37 ms trên kết nối dùng lại. Hãy giữ kết nối sống (keep-alive).</li>
</ul>
<h3>Median, p95, p99 — vì sao số trung bình nói dối</h3>
<p>Gửi 100 request rồi xếp thời gian từ nhanh tới chậm: <strong>median</strong> (p50) là request thứ 50 — một nửa nhanh hơn nó. <strong>p99</strong> là request thứ 99: chỉ 1 trong 100 chậm hơn. Người dùng cảm nhận những lần chậm, nên API hứa theo phân vị, không theo trung bình:</p>
<ul>
  <li><strong>Trung bình</strong> trộn tất cả: 99 request 2 ms và một request 1.000 ms cho trung bình 12 ms — con số không request nào thật sự có.</li>
  <li><strong>p50</strong> = trải nghiệm thường gặp. <strong>p95 / p99</strong> = trải nghiệm tệ nhưng vẫn hay gặp. <strong>max</strong> = một request xui (nhiễu; đừng đặt mục tiêu theo nó).</li>
</ul>
<p>Vì sao quan tâm 1 trên 100? Vì một màn hình gọi nhiều endpoint. Màn hình chính của LabFlow gọi 5 cái (<code>/me</code>, <code>/labs</code>, <code>/bookings</code>, <code>/me/waitlist</code>, <code>/app-config</code>). Nếu mỗi cái chậm 1% số lần, màn hình chậm khi <em>bất kỳ</em> cái nào chậm: 1 − 0,99<sup>5</sup> ≈ <strong>4,9%</strong> số lần mở màn hình. Một backend chia một request ra 100 server sẽ gặp 1% chậm đó ở 1 − 0,99<sup>100</sup> ≈ <strong>63%</strong> request. Cái “đuôi” (tail) trở thành chuyện bình thường.</p>
<a class="link-card" href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google SRE book — Service Level Objectives (đọc ngày 1/11/2026)</span><span class="lc-sub">Chọn phân vị thay vì trung bình vì trung bình giấu cái đuôi dài; ví dụ của họ viết theo phân vị, như “99% lời gọi Get xong dưới 100 ms”. Bài 8.5 dựng SLO trên nền này.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Server-Timing: để mỗi response tự nói thời gian của nó đi đâu</h3>
<p><code>Server-Timing</code> là một header response chuẩn, chở các khoảng thời gian có tên, ví dụ <code>db;dur=3.2, total;dur=4.8</code>. DevTools của trình duyệt hiện nó ở tab Network → Timing; curl hiện nó với <code>-D -</code>. LabFlow có thêm một middleware nhỏ: mỗi request có <code>req.timing.time(tên, hàm)</code> để bấm giờ một bước và <code>add(tên, ms)</code> cho bước phải <code>await</code>; header được ghi ngay trước khi dòng trạng thái đi ra.</p>
<pre><code class="language-javascript">// timing.js — bài 8.1: đo từng chặng của MỘT request rồi báo trong header Server-Timing (chuẩn W3C)
// DevTools (tab Network → Timing) đọc được header này; curl -i thấy ngay.
export function serverTiming(req, res, next) {
  const start = performance.now();
  const marks = [];
  req.timing = {
    time(name, fn) {                                   // đo một đoạn code đồng bộ
      const a = performance.now();
      try { return fn(); } finally { marks.push([name, performance.now() - a]); }
    },
    add(name, ms) { marks.push([name, ms]); },          // đoạn bất đồng bộ: tự đo rồi ghi lại
  };
  const writeHead = res.writeHead;                   // header phải gắn TRƯỚC khi gửi: chặn ngay lúc ghi dòng trạng thái
  res.writeHead = function (...args) {
    const parts = marks.map(([n, ms]) =&gt; &#96;\${n};dur=\${ms.toFixed(2)}&#96;);
    parts.push(&#96;total;dur=\${(performance.now() - start).toFixed(2)}&#96;);
    if (!res.headersSent) res.setHeader('Server-Timing', parts.join(', '));
    return writeHead.apply(this, args);
  };
  next();
}</code></pre>
<p>Mỗi bước được nối bằng một dòng: <code>auth</code> quanh việc kiểm JWT (6.1), <code>validate</code> trong middleware Zod (2.2), <code>db</code> và <code>sort</code> trong danh sách đặt phòng, <code>scrypt</code> trong đăng nhập. Danh sách đặt phòng lấy từ 10.000 lượt đặt mẫu (<code>SEED_BOOKINGS=10000</code>, bài 3.1):</p>
<pre><code class="language-bash">curl -s -D - -o /dev/null -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | grep -iE '^(HTTP|Server-Timing)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Server-Timing: validate;dur=0.11, scrypt;dur=31.19, total;dur=32.00</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=20' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(Server-Timing|Content-Length)'</code></pre>
<div class="out">Content-Length: 7411
Server-Timing: auth;dur=0.07, validate;dur=0.09, db;dur=0.29, sort;dur=1.08, total;dur=1.99</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(Server-Timing|Content-Length)'</code></pre>
<div class="out">Content-Length: 36428
Server-Timing: auth;dur=0.07, validate;dur=0.07, db;dur=0.13, sort;dur=0.53, total;dur=1.26</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=20&amp;q=lab' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(Server-Timing|Content-Length)'</code></pre>
<div class="out">Content-Length: 7379
Server-Timing: auth;dur=0.18, validate;dur=0.34, db;dur=3.20, sort;dur=0.59, total;dur=4.79</div>
<p>Giờ mỗi response tự giải thích:</p>
<ul>
  <li><strong>Đăng nhập</strong> dành 31,2 trong 32,0 ms cho <code>scrypt</code> — 97%. Tối ưu bất cứ thứ gì khác trong đăng nhập đều vô ích.</li>
  <li><strong>Danh sách 20 lượt/trang</strong>: tổng 2 ms, phần lớn là <code>sort</code>. Xin 100 lượt <em>không</em> chậm hơn ở server (1,26 ms) — nhưng body nặng 36 KB thay vì 7 KB, điều đó tính trên mạng (8.3).</li>
  <li><strong>Tìm kiếm <code>q=lab</code></strong>: <code>db</code> nhảy từ 0,3 lên 3,2 ms — tìm chữ phải quét mọi lượt đặt. Với 10.000 dòng thì ổn; với một triệu thì lại là chuyện của Chương 3.</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — gửi Server-Timing cho mọi người ở production.</strong> Header này cho người lạ biết có những bước nào và mỗi bước bao lâu (ví dụ: email này có đăng ký chưa? truy vấn này có chạm CSDL không?). Chỉ gửi ở môi trường dev, cho tài khoản nhân viên, hoặc chỉ cho hệ thống giám sát của mình. LabFlow gửi nó trong lúc học.</p></div>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Server-Timing" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: MDN — header Server-Timing (đọc ngày 1/11/2026)</span><span class="lc-sub">Cú pháp tên;dur=…;desc=…, hiện trong DevTools và đọc được từ JavaScript qua PerformanceServerTiming (chỉ cùng origin, trừ khi Timing-Allow-Origin cho phép). Cảnh báo nó có thể lộ thông tin nhạy cảm về ứng dụng và hạ tầng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Ngân sách độ trễ cho một endpoint</h3>
<p><strong>Ngân sách độ trễ</strong> (latency budget) là một mục tiêu được chia cho từng chặng, viết ra TRƯỚC khi làm. Giả sử đội muốn “đặt phòng thấy tức thì trên Wi-Fi trường”: <em>p95 dưới 300 ms</em>, đo trong app. Dùng các số vừa đo:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mục tiêu · p95 ≤ 300 ms</span><span class="lz-lnote">thứ người dùng cảm nhận, đo trong app (là mục tiêu, không phải số đo)</span></div>
  <div class="lz-layer"><span class="lz-lname">Mạng, kết nối dùng lại · ~40 ms</span><span class="lz-lnote">đo được 37 ms (median) tới server xa; giữ kết nối sống</span></div>
  <div class="lz-layer"><span class="lz-lname">Mạng, kết nối mới · ~200 ms</span><span class="lz-lnote">đo được 197 ms — app nên mở kết nối sớm (lúc khởi động), đừng đợi tới lúc bấm</span></div>
  <div class="lz-layer"><span class="lz-lname">Server · ≤ 50 ms ở p95</span><span class="lz-lnote">hiện tại ~2–5 ms; ngân sách chừa chỗ cho truy vấn kiểm trùng trên PostgreSQL thật (Ch12)</span></div>
  <div class="lz-layer"><span class="lz-lname">Dự phòng · phần còn lại</span><span class="lz-lnote">cho thử lại (5.2), điện thoại chậm, và tính năng sau</span></div>
</div>
<p>Ngân sách biến tranh cãi thành phép kiểm: một pull request thêm lời gọi ĐỒNG BỘ tới dịch vụ email (thường 100 ms trở lên) làm vỡ dòng “server” thấy ngay. Bài 8.5 biến mục tiêu này thành SLO.</p>

<h3>Vậy đã đủ chưa? Ước lượng tải của LabFlow</h3>
<p>Tính nhẩm trước khi mua server. Giả định (ghi ra giấy, chi tiết sẽ sai): một trường 8.000 sinh viên, ngày thường 3.000 bạn dùng LabFlow, mỗi bạn ~20 lời gọi API.</p>
<ul>
  <li>Trung bình: 3.000 × 20 = 60.000 lời gọi/ngày ÷ 86.400 giây ≈ <strong>0,7 req/s</strong>.</li>
  <li>Giờ cao điểm: phần lớn lưu lượng dồn vào vài giờ, nhân ~10: <strong>~7 req/s</strong>. Một tiến trình đo được ~1.000 req/s ở danh sách đặt phòng — dư 100 lần.</li>
  <li>Nguy hiểm thật là <strong>một đợt dồn vào endpoint đắt</strong>: 07:00 mở đăng ký, 2.000 sinh viên đăng nhập trong 10 giây = <strong>200 lượt đăng nhập/giây</strong>. Đăng nhập tốn 31 ms CPU — một nhân làm được ~32 lượt mỗi giây. Con số đó là bài 8.2.</li>
</ul>
<p>Cách ước lượng đầy đủ (người dùng mỗi ngày → QPS → lưu trữ → băng thông) ở chương 1 khoá <em>System Design</em>; chương này đứng ở mức một API.</p>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“API chậm — bắt đầu từ đâu?”</strong> Đo thời gian đi đâu trước khi sửa code: Server-Timing hoặc tracing theo từng bước, rồi nhắm chặng lớn nhất. Trong đăng nhập của LabFlow, 97% là scrypt.</li>
</ul>

<h3>🧪 Thực hành (25–35 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm bấm giờ <code>conflict</code> quanh phép kiểm trùng giờ trong <code>POST /v2/bookings</code> và đọc bằng curl. Với 10.000 lượt đặt mẫu, nó chiếm bao nhiêu phần <code>total</code>?</li>
  <li>Viết ngân sách độ trễ cho <code>GET /v2/bookings</code> bằng số đo mạng của chính bạn.</li>
</ol>
<p><strong>Xong khi:</strong> bạn nói được, với đăng nhập và với danh sách đặt phòng, chặng nào lớn nhất và vì sao bạn biết.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Latency (độ trễ)</span><span class="v">Một request tốn bao lâu, từ lúc gửi tới lúc nhận đủ response.</span></div>
  <div class="kv"><span class="k">Throughput (thông lượng)</span><span class="v">Số request làm xong mỗi giây (req/s).</span></div>
  <div class="kv"><span class="k">Phân vị (p50, p99)</span><span class="v">Mốc thời gian mà 50% / 99% request nhanh hơn.</span></div>
  <div class="kv"><span class="k">Server-Timing</span><span class="v">Header response chở thời gian có tên của từng bước ở server.</span></div>
  <div class="kv"><span class="k">Ngân sách độ trễ</span><span class="v">Thời gian trả lời mục tiêu, chia cho từng chặng của request.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đo được: RAM 11 ns, JSON/JWT vài µs, PG theo khoá chính 110 µs, scrypt 31 ms, OFFSET 900k 35 ms, Internet 37 ms (dùng lại) / 197 ms (kết nối mới).</li>
  <li>Việc API bình thường tốn chưa tới 1 ms; vài thao tác đắt gấp 10.000 lần — nút thắt nằm ở đó.</li>
  <li>Hứa theo phân vị, không theo trung bình; màn hình gọi 5 endpoint gặp p99 ở ~4,9% số lần mở.</li>
  <li>Server-Timing cho thấy đăng nhập 97% là scrypt; đừng gửi nó cho người lạ ở production.</li>
  <li>Ngân sách độ trễ chia mục tiêu cho từng chặng. Request bình thường bị mạng chi phối; rủi ro là một đợt dồn vào endpoint đắt — 200 lượt đăng nhập/giây so với ~32/giây mỗi nhân (8.2).</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Measuring your API: a load test, and the first real bottleneck|||8.2 — Đo API của bạn: một bài test tải, và nút thắt thật đầu tiên',
      slug: 'api-8-2-mot-may',
      type: 'LESSON',
      isFreePreview: true,
      description: 'autocannon và cái bẫy 429, định luật Little; test tải trộn 07:00: scryptSync chặn event loop (danh sách phòng p99 3,3 → 463 ms); scrypt bất đồng bộ trên threadpool (p99 8 ms, 30 → 114 lượt/s); UV_THREADPOOL_SIZE.',
      content: `${G082}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Measuring your API: a load test, and the first real bottleneck</h2>
<p class="lead">Lesson 8.1 ended with a risk: at 07:00 when booking opens, 2,000 students may log in within seconds. This lesson builds the test for exactly that moment — logins flooding in while other students browse labs — and finds that one line of code from Chapter 6 made <em>every</em> request in LabFlow wait, not just logins. Then it fixes it and measures again.</p>

<h3>First load test — and a trap that looks like a fast server</h3>
<p>A <strong>load test</strong> sends many requests at once and measures throughput (requests per second, req/s) and latency. <code>autocannon</code> (a Node load tester) keeps 10 connections busy for 10 seconds:</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 http://localhost:4000/v2/labs 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Latency │ 0 ms │ 0 ms │ 3 ms  │ 5 ms │ 0.54 ms │ 1.37 ms │ 48 ms │
│ Req/Sec   │ 3,715   │ 3,715   │ 9,199   │ 10,071  │ 8,258.1 │ 2,126.1 │ 3,715   │
116 2xx responses, 82460 non 2xx responses
83k requests in 10.04s, 53.5 MB read</div>
<p>8,258 req/s looks great — until the last line: <strong>116</strong> successes and <strong>82,460</strong> non-2xx. They are <code>429</code>s from LabFlow’s own rate limit on <code>GET /v2/labs</code> (100 per minute per IP, lesson 5.3). The test measured how fast LabFlow can say “too many requests”. <strong>Always read the status codes of a load test.</strong> With the limit raised for the test (<code>LABFLOW_IP_LIMIT=1000000/60</code>, test only):</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 http://localhost:4000/v2/labs 2&gt;&amp;1 | grep -E 'Stat|Latency|Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
│ Latency │ 0 ms │ 0 ms │ 2 ms  │ 3 ms │ 0.41 ms │ 1.25 ms │ 92 ms │
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev    │ Min     │
│ Req/Sec   │ 6,499   │ 6,499   │ 9,847   │ 11,007  │ 9,414.19 │ 1,372.42 │ 6,498   │
104k requests in 11.01s, 85 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" 'http://localhost:4000/v2/bookings?limit=20' 2&gt;&amp;1 | grep -E 'Stat|Latency|Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg    │ Stdev   │ Max    │
│ Latency │ 5 ms │ 7 ms │ 24 ms │ 37 ms │ 8.7 ms │ 7.35 ms │ 151 ms │
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
│ Req/Sec   │ 530     │ 530     │ 1,019   │ 1,442   │ 1,083.7 │ 265.7  │ 530     │
11k requests in 10.05s, 85.5 MB read</div>
<p>A sanity check you can do in your head — <strong>Little’s law</strong>: requests in flight = throughput × time each one takes. Here 10 connections are always in flight:</p>
<ul>
  <li><code>/v2/labs</code>: 10 ÷ 9,414 req/s = 1.06 ms per request — autocannon’s own average is 0.41 ms plus client overhead. Same order. ✓</li>
  <li><code>/v2/bookings</code>: 10 ÷ 1,084 req/s = 9.2 ms — autocannon says 8.7 ms average. ✓</li>
</ul>
<p>If your numbers break Little’s law badly, the test is lying (errors, a limit, a client that cannot keep up).</p>
<a class="link-card" href="https://github.com/mcollina/autocannon" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: autocannon README (read 1 Nov 2026)</span><span class="lc-sub">-c connections, -d duration, -H headers; reports latency percentiles, req/s and the count of non-2xx responses — the line that exposed the 429 trap above. Usable from the command line and as a Node API (perf/mixed.mjs below).</span></span>
  <span class="lc-cta">OPEN →</span>
</a>


<h3>The 07:00 test: logins flood in while others browse</h3>
<p>A single-endpoint test answers “how fast is X alone?”. Real traffic is mixed. <code>perf/mixed.mjs</code> uses autocannon as a library to send logins (each with a different e-mail, so the per-user login limit of 6.1 never triggers — a wrong password still costs one full scrypt), and at the same time acts as <em>one other student</em> who opens the lab list every 20 ms and records how long each answer takes:</p>
<pre><code class="language-javascript">// perf/mixed.mjs (rút gọn) — tải đăng nhập + một người đứng ngoài xem phòng
const load = autocannon({ url: &#96;\${BASE}/v2/auth/login&#96;, connections: 10, duration: SECONDS,
  requests: [{ method: 'POST', headers: { 'content-type': 'application/json' },
    setupRequest: (r) =&gt; ({ ...r, body: JSON.stringify({ email: &#96;sv\${n++}@student.labflow.example&#96;, password: 'sai-mat-khau' }) }) }] });
while (Date.now() &lt; end) {                           // người đứng ngoài: 20 ms một lần
  const a = performance.now();
  const res = await fetch(&#96;\${BASE}/v2/labs&#96;); await res.text();
  lat.push(performance.now() - a);
  await new Promise((r) =&gt; setTimeout(r, 20));
}</code></pre>
<p>First with no login load (<code>LOAD=0</code>), to know what “normal” is; then with 10 connections logging in non-stop. This is the Chapter 6 code, where <code>verifyPassword</code> calls <code>scryptSync</code>:</p>
<pre><code class="language-bash">SECONDS=5 LOAD=0 node perf/mixed.mjs</code></pre>
<div class="out">GET /v2/labs trong lúc đó: 217 lần · p50 1.0 ms · p99 3.3 ms · max 32.2 ms · mã {"200":217}</div>
<pre><code class="language-bash">SECONDS=10 node perf/mixed.mjs</code></pre>
<div class="out">login: 30.2 req/s · p50 311 ms · p99 538 ms · non-2xx 302 (email lạ ⇒ 401, vẫn tốn đủ một lần scrypt)
GET /v2/labs trong lúc đó: 84 lần · p50 85.1 ms · p99 462.8 ms · max 462.8 ms · mã {"200":84}</div>
<p>Read the second run slowly:</p>
<ul>
  <li><strong>Login: 30.2 req/s.</strong> 8.1 measured 31 ms per scrypt, and 1,000 ms ÷ 31 ms ≈ 32. LabFlow logs people in at the speed of <em>one</em> CPU core, on a machine with 10.</li>
  <li><strong>The lab list went from p50 1.0 ms to 85 ms, and p99 from 3.3 ms to 463 ms.</strong> The lab list does not hash anything. It was slow because it had to <em>wait</em>.</li>
  <li>The student checking labs managed 84 requests in 10 s instead of ~430. Nobody touched <code>/v2/labs</code>, yet it became 140 times slower at p99.</li>
</ul>

<h3>Why: one thread, and scryptSync holds it</h3>
<p>Node runs all your JavaScript on <strong>one thread</strong> — the event loop (SDN302 1.1). That is fine while handlers only <em>start</em> slow work and wait for it (database, network): the thread serves other requests meanwhile. <code>scryptSync</code> is different: the word <em>Sync</em> means the thread itself does the 31 ms of maths and does nothing else until it finishes.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0 ms</span><span class="lz-t">login #1 arrives</span><span class="lz-d">scryptSync — the only thread is busy for 31 ms</span></div>
  <div class="lz-step"><span class="lz-k">5 ms</span><span class="lz-t">GET /v2/labs arrives</span><span class="lz-d">its 1 ms of work waits in the queue</span></div>
  <div class="lz-step"><span class="lz-k">31 ms</span><span class="lz-t">login #2 is next</span><span class="lz-d">10 connections keep ~10 logins queued: another 31 ms each</span></div>
  <div class="lz-step"><span class="lz-k">≈ 85–460 ms</span><span class="lz-t">labs finally answered</span><span class="lz-d">time spent = the queue in front of it, not its own work</span></div>
</div>
<p>This is the most important performance idea in Node: <strong>a slow synchronous step in ANY handler slows down EVERY endpoint</strong>. The same happens with a big <code>JSON.parse</code>, a heavy loop over all bookings (you will meet one in Lab 8), <code>fs.readFileSync</code> in a handler, or a badly written regular expression.</p>
<a class="link-card" href="https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Node.js — Don’t Block the Event Loop (or the Worker Pool) (read 1 Nov 2026)</span><span class="lc-sub">“While a thread is blocked working on behalf of one client, it cannot handle requests from any other clients.” Lists synchronous crypto, zlib and fs calls to avoid in servers, and treats a blocking input as a denial-of-service risk.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>The fix: the asynchronous scrypt</h3>
<p><code>node:crypto</code> has both versions. The asynchronous <code>scrypt</code> sends the maths to <strong>libuv’s threadpool</strong> — a few helper threads inside the Node process — and the event loop is free until the result comes back. Two changes: <code>verifyPassword</code> becomes <code>async</code>, and the login handler <code>await</code>s it (Express 5 forwards errors from async handlers by itself, 2.1).</p>
<pre><code class="language-javascript">// passwords.js — bài 6.1: băm mật khẩu bằng scrypt (có sẵn trong node:crypto, chậm có chủ đích, có salt)
// Bài 8.2: kiểm mật khẩu bằng scrypt BẤT ĐỒNG BỘ — chạy trên threadpool của libuv, không chặn event loop
import { scrypt, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export function hashPassword(password) {          // chỉ dùng lúc khởi động (dữ liệu mẫu) ⇒ bản đồng bộ là được
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return &#96;scrypt$\${salt.toString('hex')}$\${hash.toString('hex')}&#96;;
}

export async function verifyPassword(password, stored) {
  const [, saltHex, hashHex] = stored.split('$');
  const hash = await scryptAsync(password, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));       // so trong thời gian không đổi
}</code></pre>
<pre><code class="language-javascript">// routes/auth.js — chỉ đổi hai chỗ: handler async, và await
.post(loginLimit, validate('body', Login), async (req, res) =&gt; {
  const t0 = performance.now();
  const ok = (await verifyPassword(password, user?.passwordHash ?? DUMMY)) &amp;&amp; user;
  req.timing.add('scrypt', performance.now() - t0);   // thời gian CHỜ — event loop vẫn rảnh
  …</code></pre>
<p><code>hashPassword</code> keeps <code>scryptSync</code>: it only runs at start-up to hash the demo users, before any request arrives. Same test, same machine:</p>
<pre><code class="language-bash">SECONDS=10 node perf/mixed.mjs</code></pre>
<div class="out">login: 113.6 req/s · p50 81 ms · p99 226 ms · non-2xx 1136 (email lạ ⇒ 401, vẫn tốn đủ một lần scrypt)
GET /v2/labs trong lúc đó: 438 lần · p50 1.0 ms · p99 8.0 ms · max 132.2 ms · mã {"200":438}</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Lab list p99 · 463 ms → 8 ms</span><span class="lz-lnote">p50 back to 1.0 ms — the bystander no longer waits for logins</span></div>
  <div class="lz-layer"><span class="lz-lname">Logins · 30.2 → 113.6 req/s</span><span class="lz-lnote">4 threads × ~32 per second ≈ 128; the measured 114 is close</span></div>
  <div class="lz-layer"><span class="lz-lname">Same code size</span><span class="lz-lnote">two lines changed; no new library, no new server</span></div>
</div>

<h3>Four threads by default — and what shares them</h3>
<p>Why ~4× and not 10×? libuv’s threadpool has <strong>4 threads by default</strong>. You can raise it with the environment variable <code>UV_THREADPOOL_SIZE</code>, set <em>before</em> Node starts:</p>
<pre><code class="language-bash">UV_THREADPOOL_SIZE=8 npm start</code></pre>
<pre><code class="language-bash">SECONDS=10 node perf/mixed.mjs</code></pre>
<div class="out">login: 193.0 req/s · p50 45 ms · p99 167 ms · non-2xx 1930 (email lạ ⇒ 401, vẫn tốn đủ một lần scrypt)
GET /v2/labs trong lúc đó: 398 lần · p50 2.7 ms · p99 13.0 ms · max 47.8 ms · mã {"200":398}</div>
<p>193 logins/s — but the lab list’s p50 rose from 1.0 to 2.7 ms. The load generator, the probe, the 8 hashing threads and the event loop all run on the same 10-core laptop, so they now compete for CPU. On a real server the load generator would be elsewhere. The lesson is not “always 8”, it is: <strong>measure the trade-off</strong>.</p>
<p>The threadpool is shared with other work: <code>fs</code> calls, <code>dns.lookup()</code> (used whenever you connect to a host name) and <code>zlib</code> — including the compression of 8.3. During a login flood, those wait behind scrypt. That is one more reason for the login limit in 8.5.</p>
<div class="pitfall"><p><strong>Trap — <code>process.env.UV_THREADPOOL_SIZE = 8</code> inside your code.</strong> The pool may already exist by then, so the setting is not guaranteed to apply. Set it in the environment (or the Docker/systemd file) that starts Node.</p></div>
<a class="link-card" href="https://nodejs.org/api/cli.html#uv_threadpool_sizesize" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Node.js docs — UV_THREADPOOL_SIZE (v26 docs, read 1 Nov 2026)</span><span class="lc-sub">Default 4 threads. Used by all non-sync fs APIs, asynchronous crypto (pbkdf2, scrypt, randomBytes, randomFill, generateKeyPair), dns.lookup() and all non-sync zlib APIs; a long task there slows “seemingly unrelated” APIs. Setting it from inside the process is not guaranteed to work.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-1-1-node-event-loop" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — 1.1 Node.js, the event loop &amp; modules</span><span class="lc-sub">If you took SDN302 on Academy, you learnt that Node serves many connections on one thread and the warning “do not put CPU-heavy work on the main thread”. Same: one thread, blocking versus non-blocking. Different: SDN302 states the rule; here you measure what breaking it costs (the lab list’s p99 from 3 ms to 463 ms) and how much the fix buys. Not taken SDN302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“One endpoint is slow and suddenly all endpoints are slow.”</strong> In Node, suspect a synchronous CPU step blocking the event loop. Prove it with a probe on a cheap endpoint while loading the expensive one.</li>
  <li><strong>“How did you find the bottleneck?”</strong> Mixed load test (logins + a bystander), Server-Timing on the slow endpoint, one change, the same test again: p99 463 → 8 ms, logins 30 → 114/s.</li>
  <li><strong>“Your load test shows 8,000 req/s.”</strong> “How many were 2xx?” — then check Little’s law.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Reproduce the before/after on your machine. Write down your login req/s and the lab list p99 for both.</li>
  <li>Add a route <code>GET /v2/debug/block?ms=200</code> (development only) that loops for <code>ms</code> milliseconds. Run <code>perf/mixed.mjs</code> with <code>LOAD=0</code> while you call it from another terminal. What does the probe’s max show?</li>
  <li>Try <code>UV_THREADPOOL_SIZE</code> = 2, 4, 8, 16. Make a small table of login req/s and the lab list p50. Where does it stop helping on your machine?</li>
</ol>
<p><strong>Done when:</strong> you can explain, with your own numbers, why a slow login made the lab list slow.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Load test</span><span class="v">Many requests at once to measure throughput and latency.</span></div>
  <div class="kv"><span class="k">Little’s law</span><span class="v">In-flight requests = throughput × time per request.</span></div>
  <div class="kv"><span class="k">Event loop</span><span class="v">The one thread that runs all of a Node process’s JavaScript.</span></div>
  <div class="kv"><span class="k">Blocking</span><span class="v">A synchronous step that keeps the thread busy, so everything else waits.</span></div>
  <div class="kv"><span class="k">libuv threadpool</span><span class="v">Helper threads (4 by default) for async crypto, fs, dns.lookup, zlib.</span></div>
  <div class="kv"><span class="k">Bottleneck</span><span class="v">The one step that limits the whole system’s speed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Read the status codes of every load test: 82,460 “fast” answers were LabFlow’s own 429s. Check results with Little’s law.</li>
  <li>Mixed load (logins + a bystander) showed the real damage: the lab list p99 went from 3.3 ms to 463 ms while logins ran at 30/s.</li>
  <li>Cause: <code>scryptSync</code> held Node’s only JavaScript thread for 31 ms per login.</li>
  <li>Fix: asynchronous <code>scrypt</code> on the threadpool — p99 8 ms, logins 114/s; <code>UV_THREADPOOL_SIZE=8</code> gave 193/s at some cost to the bystander.</li>
  <li>The threadpool is shared with fs, dns.lookup and zlib; set its size in the environment, not in code.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Đo API của bạn: một bài test tải, và nút thắt thật đầu tiên</h2>
<p class="lead">Bài 8.1 khép lại bằng một rủi ro: 07:00 mở đăng ký, 2.000 sinh viên có thể đăng nhập trong vài giây. Bài này dựng bài test cho đúng khoảnh khắc đó — đăng nhập ồ ạt trong lúc các bạn khác xem danh sách phòng — và phát hiện một dòng code từ Chương 6 đã làm <em>mọi</em> request của LabFlow phải chờ, không riêng gì đăng nhập. Rồi sửa, rồi đo lại.</p>

<h3>Test tải đầu tiên — và cái bẫy trông như server rất nhanh</h3>
<p><strong>Test tải</strong> (load test) gửi nhiều request cùng lúc và đo thông lượng (số request mỗi giây, req/s) và độ trễ. <code>autocannon</code> (công cụ test tải viết bằng Node) giữ 10 kết nối luôn bận trong 10 giây:</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 http://localhost:4000/v2/labs 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Latency │ 0 ms │ 0 ms │ 3 ms  │ 5 ms │ 0.54 ms │ 1.37 ms │ 48 ms │
│ Req/Sec   │ 3,715   │ 3,715   │ 9,199   │ 10,071  │ 8,258.1 │ 2,126.1 │ 3,715   │
116 2xx responses, 82460 non 2xx responses
83k requests in 10.04s, 53.5 MB read</div>
<p>8.258 req/s trông tuyệt — cho tới dòng cuối: <strong>116</strong> lần thành công và <strong>82.460</strong> lần không phải 2xx. Đó là các <code>429</code> từ chính giới hạn tần suất của LabFlow trên <code>GET /v2/labs</code> (100 lần mỗi phút mỗi IP, bài 5.3). Bài test đã đo xem LabFlow nói “quá nhiều request” nhanh cỡ nào. <strong>Luôn đọc mã trạng thái của mọi bài test tải.</strong> Nâng giới hạn lên khi test (<code>LABFLOW_IP_LIMIT=1000000/60</code>, chỉ để test):</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 http://localhost:4000/v2/labs 2&gt;&amp;1 | grep -E 'Stat|Latency|Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
│ Latency │ 0 ms │ 0 ms │ 2 ms  │ 3 ms │ 0.41 ms │ 1.25 ms │ 92 ms │
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev    │ Min     │
│ Req/Sec   │ 6,499   │ 6,499   │ 9,847   │ 11,007  │ 9,414.19 │ 1,372.42 │ 6,498   │
104k requests in 11.01s, 85 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" 'http://localhost:4000/v2/bookings?limit=20' 2&gt;&amp;1 | grep -E 'Stat|Latency|Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg    │ Stdev   │ Max    │
│ Latency │ 5 ms │ 7 ms │ 24 ms │ 37 ms │ 8.7 ms │ 7.35 ms │ 151 ms │
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
│ Req/Sec   │ 530     │ 530     │ 1,019   │ 1,442   │ 1,083.7 │ 265.7  │ 530     │
11k requests in 10.05s, 85.5 MB read</div>
<p>Một phép kiểm tính nhẩm được — <strong>định luật Little</strong> (Little’s law): số request đang xử lý = thông lượng × thời gian mỗi request. Ở đây luôn có 10 kết nối đang chờ:</p>
<ul>
  <li><code>/v2/labs</code>: 10 ÷ 9.414 req/s = 1,06 ms mỗi request — autocannon tự báo trung bình 0,41 ms, cộng thêm phần việc của chính client. Cùng bậc. ✓</li>
  <li><code>/v2/bookings</code>: 10 ÷ 1.084 req/s = 9,2 ms — autocannon báo trung bình 8,7 ms. ✓</li>
</ul>
<p>Số của bạn lệch định luật Little quá xa thì bài test đang nói dối (lỗi, giới hạn, hoặc client không theo kịp).</p>
<a class="link-card" href="https://github.com/mcollina/autocannon" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: README của autocannon (đọc ngày 1/11/2026)</span><span class="lc-sub">-c số kết nối, -d thời lượng, -H header; báo phân vị độ trễ, req/s và số response không phải 2xx — chính dòng đã lật cái bẫy 429 ở trên. Dùng được từ dòng lệnh lẫn như một API Node (perf/mixed.mjs ngay dưới đây).</span></span>
  <span class="lc-cta">MỞ →</span>
</a>


<h3>Bài test 07:00: đăng nhập ồ ạt trong lúc người khác xem phòng</h3>
<p>Test một endpoint trả lời câu “riêng X thì nhanh cỡ nào?”. Lưu lượng thật thì trộn lẫn. <code>perf/mixed.mjs</code> dùng autocannon như một thư viện để gửi đăng nhập (mỗi lần một email khác, nên giới hạn đăng nhập theo người dùng của bài 6.1 không bao giờ bật — mật khẩu sai vẫn tốn trọn một lần scrypt), đồng thời đóng vai <em>một sinh viên khác</em> cứ 20 ms mở danh sách phòng một lần và ghi lại mỗi câu trả lời mất bao lâu:</p>
<pre><code class="language-javascript">// perf/mixed.mjs (rút gọn) — tải đăng nhập + một người đứng ngoài xem phòng
const load = autocannon({ url: &#96;\${BASE}/v2/auth/login&#96;, connections: 10, duration: SECONDS,
  requests: [{ method: 'POST', headers: { 'content-type': 'application/json' },
    setupRequest: (r) =&gt; ({ ...r, body: JSON.stringify({ email: &#96;sv\${n++}@student.labflow.example&#96;, password: 'sai-mat-khau' }) }) }] });
while (Date.now() &lt; end) {                           // người đứng ngoài: 20 ms một lần
  const a = performance.now();
  const res = await fetch(&#96;\${BASE}/v2/labs&#96;); await res.text();
  lat.push(performance.now() - a);
  await new Promise((r) =&gt; setTimeout(r, 20));
}</code></pre>
<p>Chạy trước khi không có tải đăng nhập (<code>LOAD=0</code>) để biết “bình thường” là bao nhiêu; rồi với 10 kết nối đăng nhập liên tục. Đây là code của Chương 6, nơi <code>verifyPassword</code> gọi <code>scryptSync</code>:</p>
<pre><code class="language-bash">SECONDS=5 LOAD=0 node perf/mixed.mjs</code></pre>
<div class="out">GET /v2/labs trong lúc đó: 217 lần · p50 1.0 ms · p99 3.3 ms · max 32.2 ms · mã {"200":217}</div>
<pre><code class="language-bash">SECONDS=10 node perf/mixed.mjs</code></pre>
<div class="out">login: 30.2 req/s · p50 311 ms · p99 538 ms · non-2xx 302 (email lạ ⇒ 401, vẫn tốn đủ một lần scrypt)
GET /v2/labs trong lúc đó: 84 lần · p50 85.1 ms · p99 462.8 ms · max 462.8 ms · mã {"200":84}</div>
<p>Đọc chậm lần chạy thứ hai:</p>
<ul>
  <li><strong>Đăng nhập: 30,2 req/s.</strong> Bài 8.1 đo được 31 ms mỗi lần scrypt, và 1.000 ms ÷ 31 ms ≈ 32. LabFlow cho người dùng đăng nhập với tốc độ của <em>một</em> nhân CPU, trên một máy có 10 nhân.</li>
  <li><strong>Danh sách phòng từ p50 1,0 ms lên 85 ms, p99 từ 3,3 ms lên 463 ms.</strong> Danh sách phòng chẳng băm gì cả. Nó chậm vì phải <em>chờ</em>.</li>
  <li>Bạn sinh viên xem phòng chỉ gửi được 84 request trong 10 giây thay vì ~430. Không ai đụng vào <code>/v2/labs</code>, vậy mà ở p99 nó chậm đi 140 lần.</li>
</ul>

<h3>Vì sao: một luồng, và scryptSync giữ chặt nó</h3>
<p>Node chạy toàn bộ JavaScript của bạn trên <strong>một luồng</strong> — event loop (SDN302 bài 1.1). Không sao, chừng nào handler chỉ <em>bắt đầu</em> việc chậm rồi chờ (CSDL, mạng): trong lúc chờ, luồng phục vụ request khác. <code>scryptSync</code> thì khác: chữ <em>Sync</em> nghĩa là chính luồng đó tự làm 31 ms tính toán và không làm gì khác cho tới khi xong.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0 ms</span><span class="lz-t">đăng nhập #1 tới</span><span class="lz-d">scryptSync — luồng duy nhất bận 31 ms</span></div>
  <div class="lz-step"><span class="lz-k">5 ms</span><span class="lz-t">GET /v2/labs tới</span><span class="lz-d">1 ms việc của nó phải xếp hàng</span></div>
  <div class="lz-step"><span class="lz-k">31 ms</span><span class="lz-t">tới lượt đăng nhập #2</span><span class="lz-d">10 kết nối giữ ~10 lượt đăng nhập trong hàng: mỗi lượt thêm 31 ms</span></div>
  <div class="lz-step"><span class="lz-k">≈ 85–460 ms</span><span class="lz-t">danh sách phòng mới được trả</span><span class="lz-d">thời gian tốn = hàng đợi phía trước, không phải việc của chính nó</span></div>
</div>
<p>Đây là ý quan trọng nhất về hiệu năng trong Node: <strong>một bước đồng bộ chậm ở BẤT KỲ handler nào làm chậm MỌI endpoint</strong>. Chuyện y hệt xảy ra với một <code>JSON.parse</code> lớn, một vòng lặp nặng qua mọi lượt đặt (bạn sẽ gặp một cái ở Lab 8), <code>fs.readFileSync</code> trong handler, hay một biểu thức chính quy viết tệ.</p>
<a class="link-card" href="https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Node.js — Don’t Block the Event Loop (or the Worker Pool) (đọc ngày 1/11/2026)</span><span class="lc-sub">“Khi một luồng bị chặn vì đang làm việc cho một client, nó không thể xử lý request của bất kỳ client nào khác.” Liệt kê các lời gọi crypto, zlib, fs đồng bộ cần tránh trong server, và coi một đầu vào gây chặn là rủi ro từ chối dịch vụ (DoS).</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Cách sửa: scrypt bất đồng bộ</h3>
<p><code>node:crypto</code> có cả hai bản. <code>scrypt</code> bất đồng bộ gửi phần tính toán sang <strong>threadpool của libuv</strong> — vài luồng phụ bên trong tiến trình Node — và event loop rảnh cho tới khi kết quả quay về. Hai thay đổi: <code>verifyPassword</code> thành <code>async</code>, và handler đăng nhập <code>await</code> nó (Express 5 tự chuyển lỗi từ handler async, bài 2.1).</p>
<pre><code class="language-javascript">// passwords.js — bài 6.1: băm mật khẩu bằng scrypt (có sẵn trong node:crypto, chậm có chủ đích, có salt)
// Bài 8.2: kiểm mật khẩu bằng scrypt BẤT ĐỒNG BỘ — chạy trên threadpool của libuv, không chặn event loop
import { scrypt, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export function hashPassword(password) {          // chỉ dùng lúc khởi động (dữ liệu mẫu) ⇒ bản đồng bộ là được
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return &#96;scrypt$\${salt.toString('hex')}$\${hash.toString('hex')}&#96;;
}

export async function verifyPassword(password, stored) {
  const [, saltHex, hashHex] = stored.split('$');
  const hash = await scryptAsync(password, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));       // so trong thời gian không đổi
}</code></pre>
<pre><code class="language-javascript">// routes/auth.js — chỉ đổi hai chỗ: handler async, và await
.post(loginLimit, validate('body', Login), async (req, res) =&gt; {
  const t0 = performance.now();
  const ok = (await verifyPassword(password, user?.passwordHash ?? DUMMY)) &amp;&amp; user;
  req.timing.add('scrypt', performance.now() - t0);   // thời gian CHỜ — event loop vẫn rảnh
  …</code></pre>
<p><code>hashPassword</code> vẫn giữ <code>scryptSync</code>: nó chỉ chạy lúc khởi động để băm mật khẩu người dùng mẫu, trước khi có request nào. Cùng bài test, cùng máy:</p>
<pre><code class="language-bash">SECONDS=10 node perf/mixed.mjs</code></pre>
<div class="out">login: 113.6 req/s · p50 81 ms · p99 226 ms · non-2xx 1136 (email lạ ⇒ 401, vẫn tốn đủ một lần scrypt)
GET /v2/labs trong lúc đó: 438 lần · p50 1.0 ms · p99 8.0 ms · max 132.2 ms · mã {"200":438}</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">p99 danh sách phòng · 463 ms → 8 ms</span><span class="lz-lnote">p50 về lại 1,0 ms — người đứng ngoài không còn phải chờ đăng nhập</span></div>
  <div class="lz-layer"><span class="lz-lname">Đăng nhập · 30,2 → 113,6 req/s</span><span class="lz-lnote">4 luồng × ~32 mỗi giây ≈ 128; số đo 114 khá sát</span></div>
  <div class="lz-layer"><span class="lz-lname">Code gần như không đổi</span><span class="lz-lnote">đổi hai dòng; không thư viện mới, không server mới</span></div>
</div>

<h3>Mặc định bốn luồng — và ai dùng chung</h3>
<p>Vì sao nhanh ~4 lần mà không phải 10 lần? Threadpool của libuv mặc định có <strong>4 luồng</strong>. Tăng được bằng biến môi trường <code>UV_THREADPOOL_SIZE</code>, đặt <em>trước</em> khi Node khởi động:</p>
<pre><code class="language-bash">UV_THREADPOOL_SIZE=8 npm start</code></pre>
<pre><code class="language-bash">SECONDS=10 node perf/mixed.mjs</code></pre>
<div class="out">login: 193.0 req/s · p50 45 ms · p99 167 ms · non-2xx 1930 (email lạ ⇒ 401, vẫn tốn đủ một lần scrypt)
GET /v2/labs trong lúc đó: 398 lần · p50 2.7 ms · p99 13.0 ms · max 47.8 ms · mã {"200":398}</div>
<p>193 lượt đăng nhập/giây — nhưng p50 của danh sách phòng tăng từ 1,0 lên 2,7 ms. Máy tạo tải, bộ đo, 8 luồng băm và event loop cùng chạy trên một laptop 10 nhân, nên giờ chúng tranh CPU của nhau. Trên server thật, máy tạo tải nằm ở chỗ khác. Bài học không phải “luôn đặt 8”, mà là: <strong>đo cái được và cái mất</strong>.</p>
<p>Threadpool dùng chung với việc khác: các lời gọi <code>fs</code>, <code>dns.lookup()</code> (dùng mỗi khi kết nối tới một tên miền) và <code>zlib</code> — kể cả phần nén của bài 8.3. Trong một đợt đăng nhập ồ ạt, chúng phải xếp hàng sau scrypt. Thêm một lý do cho giới hạn đăng nhập ở bài 8.5.</p>
<div class="pitfall"><p><strong>Bẫy — viết <code>process.env.UV_THREADPOOL_SIZE = 8</code> trong code.</strong> Lúc đó pool có thể đã được tạo rồi, nên không chắc có tác dụng. Đặt nó ở môi trường khởi động Node (hoặc trong tệp Docker/systemd).</p></div>
<a class="link-card" href="https://nodejs.org/api/cli.html#uv_threadpool_sizesize" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: tài liệu Node.js — UV_THREADPOOL_SIZE (tài liệu v26, đọc ngày 1/11/2026)</span><span class="lc-sub">Mặc định 4 luồng. Dùng bởi mọi API fs không đồng bộ, crypto bất đồng bộ (pbkdf2, scrypt, randomBytes, randomFill, generateKeyPair), dns.lookup() và mọi API zlib không đồng bộ; một việc dài ở đó làm chậm cả những API “trông như không liên quan”. Đặt từ bên trong tiến trình thì không chắc có tác dụng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-1-1-node-event-loop" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp điều này ở SDN302 — 1.1 Node.js, event loop &amp; module</span><span class="lc-sub">Nếu đã học SDN302 trên Academy, bạn biết Node phục vụ nhiều kết nối trên một luồng và lời dặn “đừng đặt việc nặng CPU trên luồng chính”. Giống: một luồng, chặn và không chặn. Khác: SDN302 nêu luật; ở đây bạn đo cái giá khi phạm luật (p99 danh sách phòng từ 3 ms lên 463 ms) và cách sửa mua lại được bao nhiêu. Chưa học SDN302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Một endpoint chậm rồi bỗng dưng endpoint nào cũng chậm.”</strong> Trong Node, nghi ngay một bước CPU đồng bộ đang chặn event loop. Chứng minh bằng một bộ đo gọi endpoint rẻ trong lúc tạo tải lên endpoint đắt.</li>
  <li><strong>“Em tìm ra nút thắt thế nào?”</strong> Test tải trộn (đăng nhập + một người đứng ngoài), Server-Timing ở endpoint chậm, đổi một chỗ, chạy lại đúng bài test: p99 463 → 8 ms, đăng nhập 30 → 114/s.</li>
  <li><strong>“Test tải của em ra 8.000 req/s.”</strong> “Bao nhiêu lần là 2xx?” — rồi kiểm bằng định luật Little.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Lặp lại phép đo trước/sau trên máy bạn. Ghi lại req/s đăng nhập và p99 danh sách phòng của cả hai lần.</li>
  <li>Thêm route <code>GET /v2/debug/block?ms=200</code> (chỉ ở dev) quay vòng lặp trong <code>ms</code> mili giây. Chạy <code>perf/mixed.mjs</code> với <code>LOAD=0</code> trong lúc gọi route đó từ terminal khác. Cột max của bộ đo cho thấy gì?</li>
  <li>Thử <code>UV_THREADPOOL_SIZE</code> = 2, 4, 8, 16. Lập bảng nhỏ: req/s đăng nhập và p50 danh sách phòng. Trên máy bạn, tới đâu thì hết lợi?</li>
</ol>
<p><strong>Xong khi:</strong> bạn giải thích được, bằng số của chính mình, vì sao đăng nhập chậm làm danh sách phòng chậm.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Load test (test tải)</span><span class="v">Gửi nhiều request cùng lúc để đo thông lượng và độ trễ.</span></div>
  <div class="kv"><span class="k">Định luật Little</span><span class="v">Số request đang xử lý = thông lượng × thời gian mỗi request.</span></div>
  <div class="kv"><span class="k">Event loop</span><span class="v">Luồng duy nhất chạy toàn bộ JavaScript của một tiến trình Node.</span></div>
  <div class="kv"><span class="k">Blocking (chặn)</span><span class="v">Một bước đồng bộ giữ luồng bận, nên mọi việc khác phải chờ.</span></div>
  <div class="kv"><span class="k">Threadpool của libuv</span><span class="v">Các luồng phụ (mặc định 4) cho crypto bất đồng bộ, fs, dns.lookup, zlib.</span></div>
  <div class="kv"><span class="k">Bottleneck (nút thắt)</span><span class="v">Một bước giới hạn tốc độ của cả hệ thống.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đọc mã trạng thái của mọi bài test tải: 82.460 câu trả lời “nhanh” là 429 của chính LabFlow. Kiểm kết quả bằng định luật Little.</li>
  <li>Tải trộn (đăng nhập + một người đứng ngoài) lộ ra thiệt hại thật: p99 danh sách phòng từ 3,3 ms lên 463 ms trong lúc đăng nhập chạy 30/s.</li>
  <li>Nguyên nhân: <code>scryptSync</code> giữ luồng JavaScript duy nhất của Node 31 ms mỗi lượt đăng nhập.</li>
  <li>Sửa: <code>scrypt</code> bất đồng bộ trên threadpool — p99 8 ms, đăng nhập 114/s; <code>UV_THREADPOOL_SIZE=8</code> cho 193/s, đổi lại người đứng ngoài chậm hơn chút.</li>
  <li>Threadpool dùng chung với fs, dns.lookup và zlib; đặt kích thước ở môi trường, không trong code.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 8.3 (bài MỚI) ─────────────────────────── */
    {
      title: '8.3 — Slow by design: payload size, sparse fields and compression|||8.3 — Chậm do thiết kế: kích thước payload, chọn trường và nén',
      slug: 'api-8-2-payload',
      type: 'LESSON',
      isFreePreview: true,
      description: '100 lượt đặt: 25,5 KB → 11,7 KB (fields) → 1,4 KB (br); đường 1 Mbit/s giả lập: 319 ms so với 103 ms; nén trong Express, Vary, ngưỡng 1 KB, BREACH; băng thông của server; N+1, OFFSET sâu, màn hình lắm lời.',
      content: `${G083}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Slow by design: payload size, sparse fields and compression</h2>
<p class="lead">8.2 fixed a slow <em>server</em>. Many slow APIs are slow before the server does any work — they are slow because of what the contract makes the client download or how many calls it makes. On localhost you never see it; on crowded campus Wi-Fi you see nothing else. This lesson measures LabFlow’s responses over a simulated slow link and fixes them with tools the contract already has.</p>

<h3>Where bytes cost time</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">server</span><span class="lz-t">build JSON</span><span class="lz-d">microseconds per booking (8.1) — almost free</span></div>
  <div class="lz-step"><span class="lz-k">link</span><span class="lz-t">send the bytes</span><span class="lz-d">time = size ÷ bandwidth — the leg that grows with size</span></div>
  <div class="lz-step"><span class="lz-k">phone</span><span class="lz-t">parse and render</span><span class="lz-d">a cheap phone parses large JSON slowly too</span></div>
</div>
<p>On localhost the link has gigabytes per second, so size looks free. On a 1 Mbit/s link (a crowded classroom, weak 4G) every 1,000 bytes costs 8 ms.</p>

<h3>How big are LabFlow’s answers?</h3>
<p>Measured with <code>NODE_ENV=production</code>, which sends compact JSON (in development LabFlow indents with 2 spaces for readability — that is why 8.1 showed 36,428 bytes for the same 100 bookings; indentation alone was 30% of the body):</p>
<pre><code class="language-bash">curl -s -o /dev/null -w 'limit=100, JSON gọn: %{size_download} byte\\n' 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)"</code></pre>
<div class="out">limit=100, JSON gọn: 25501 byte</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'limit=100&amp;fields=id,status,period: %{size_download} byte\\n' 'http://localhost:4000/v2/bookings?limit=100&amp;fields=id,status,period' \\
  -H "Authorization: Bearer $(cat lan.jwt)"</code></pre>
<div class="out">limit=100&amp;fields=id,status,period: 11653 byte</div>
<pre><code class="language-bash">curl -s -o /dev/null -D - -w 'gzip: %{size_download} byte\\n' \\
  -H 'Accept-Encoding: gzip' 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^content-encoding|byte'</code></pre>
<div class="out">Content-Encoding: gzip
gzip: 1688 byte</div>
<pre><code class="language-bash">curl -s -o /dev/null -D - -w 'br: %{size_download} byte\\n' \\
  -H 'Accept-Encoding: br' 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^content-encoding|byte'</code></pre>
<div class="out">Content-Encoding: br
br: 1447 byte</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">100 bookings, all fields · 25,501 B</span><span class="lz-lnote">what a client gets if it asks for everything</span></div>
  <div class="lz-layer"><span class="lz-lname">fields=id,status,period · 11,653 B</span><span class="lz-lnote">sparse fieldsets (3.4): only what the calendar view shows — 54% smaller</span></div>
  <div class="lz-layer"><span class="lz-lname">gzip · 1,688 B</span><span class="lz-lnote">15× smaller: JSON repeats the same keys and values</span></div>
  <div class="lz-layer"><span class="lz-lname">Brotli (br) · 1,447 B</span><span class="lz-lnote">a little smaller again; supported by all current browsers</span></div>
</div>

<h3>The same answers over a slow link</h3>
<p>Size only becomes time on a slow link, so build one. <code>perf/slow-link.mjs</code> sits between curl and LabFlow, adds 40 ms each way (like a far server) and drips the response out at 1,000 kbit/s:</p>
<pre><code class="language-javascript">// perf/slow-link.mjs — bài 8.3: giả lập đường truyền chậm giữa app và LabFlow (Wi-Fi đông người / 4G yếu)
//   node perf/slow-link.mjs &lt;cổng nghe&gt; &lt;cổng LabFlow&gt; &lt;kbit/s&gt; &lt;ms trễ mỗi chiều&gt;
// Mọi request đi qua nguyên vẹn (kể cả Accept-Encoding); response bị "nhỏ giọt" đúng băng thông đã đặt.
import http from 'node:http';
const [listen = 8090, upstream = 4000, kbps = 1000, delay = 40] = process.argv.slice(2).map(Number);
const bytesPerMs = (kbps * 1000) / 8 / 1000;
const sleep = (ms) =&gt; new Promise((ok) =&gt; setTimeout(ok, ms));
http.createServer(async (req, res) =&gt; {
  await sleep(delay);                                            // request đi tới server
  const up = http.request({ port: upstream, path: req.url, method: req.method, headers: req.headers }, async (r) =&gt; {
    await sleep(delay);                                          // byte đầu của response đi về
    res.writeHead(r.statusCode, r.headers);
    for await (const chunk of r) {
      for (let i = 0; i &lt; chunk.length; i += 1024) {             // nhỏ giọt từng 1 KB theo băng thông
        const piece = chunk.subarray(i, i + 1024);
        res.write(piece);
        await sleep(piece.length / bytesPerMs);
      }
    }
    res.end();
  });
  req.pipe(up);
}).listen(listen, () =&gt; console.log(&#96;đường chậm :\${listen} → :\${upstream}, \${kbps} kbit/s, trễ \${delay} ms mỗi chiều&#96;));</code></pre>
<pre><code class="language-bash">node perf/slow-link.mjs 8090 4000 1000 40     # cổng 8090 → LabFlow :4000, 1 Mbit/s, trễ 40 ms mỗi chiều</code></pre>
<pre><code class="language-bash">for q in 'limit=20' 'limit=100' 'limit=100&amp;fields=id,status,period'; do curl -s -o /dev/null -w "$q: %{size_download} byte, %{time_total} s\\n" "http://localhost:8090/v2/bookings?$q" -H "Authorization: Bearer $(cat lan.jwt)"; done</code></pre>
<div class="out">limit=20: 5204 byte, 0.146403 s
limit=100: 25501 byte, 0.319357 s
limit=100&amp;fields=id,status,period: 11653 byte, 0.196988 s</div>
<pre><code class="language-bash">for e in gzip br; do curl -s -o /dev/null -H "Accept-Encoding: $e" -w "limit=100, $e: %{size_download} byte, %{time_total} s\\n" 'http://localhost:8090/v2/bookings?limit=100' -H "Authorization: Bearer $(cat lan.jwt)"; done</code></pre>
<div class="out">limit=100, gzip: 1688 byte, 0.103244 s
limit=100, br: 1447 byte, 0.103708 s</div>
<p>Check it with arithmetic: every request pays 80 ms of delay; then 25,501 B × 8 ÷ 1,000,000 bit/s = 204 ms of transfer. 80 + 204 = <strong>284 ms</strong> predicted, <strong>319 ms</strong> measured (the proxy sleeps after every 1 KB piece, and timers run a little late). With gzip: 80 + 13.5 = 93.5 predicted, <strong>103 ms</strong> measured. The server time (2–3 ms) is invisible in both.</p>
<p>Put that next to the budget from 8.1 (p95 ≤ 300 ms): <strong>the uncompressed list alone breaks the budget</strong> before any slow phone or retry. Compressed, it uses a third of it. Nothing in the server became faster — the contract became cheaper.</p>
<div class="pitfall"><p><strong>Trap — judging an API by localhost numbers.</strong> On localhost the 25 KB answer took 3 ms. Test with a slow link (a proxy like this one, or Chrome DevTools → Network → throttling) before calling an endpoint “fast”.</p></div>

<h3>Fixing it in the contract</h3>
<p>Every fix below is a rule of the <em>API contract</em> — which is why it belongs in an API design course and not only in “server tuning”:</p>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">1</span><span class="lz-nbody"><span class="lz-ntitle">Small default page</span><span class="lz-nsub">limit defaults to 20, max 100 (3.1) — a client that forgets to ask still gets 5 KB, not 25</span></span></div>
    <div class="lz-node"><span class="lz-badge">2</span><span class="lz-nbody"><span class="lz-ntitle">Sparse fields</span><span class="lz-nsub">fields=id,status,period (3.4) — 54% smaller here; the client says what the screen shows</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">3</span><span class="lz-nbody"><span class="lz-ntitle">Opt-in embedding</span><span class="lz-nsub">include=lab only when asked (3.4); never embed by default “just in case”</span></span></div>
    <div class="lz-node"><span class="lz-badge">4</span><span class="lz-nbody"><span class="lz-ntitle">Compression</span><span class="lz-nsub">Accept-Encoding → Content-Encoding: br/gzip; 15–18× here, and the client does not change its code</span></span></div>
  </div>
</div>

<h3>Compression in Express, and what it does not touch</h3>
<p>LabFlow adds one line near the top of <code>app.js</code> (package <code>compression</code> 1.8.2):</p>
<pre><code class="language-javascript">import compression from 'compression';
app.use(compression({ threshold: 1024 }));   // bài 8.3: gzip/br khi client gửi Accept-Encoding và body &gt; 1 KB</code></pre>
<p>The exchange is part of HTTP itself: the client lists what it can decode in <code>Accept-Encoding</code>; the server picks one, says so in <code>Content-Encoding</code>, and adds <code>Vary: Accept-Encoding</code> so caches never give a Brotli body to a client that only asked for plain JSON (caches are Chapter 9). Browsers, Node <code>fetch</code>, Android’s OkHttp and iOS all send <code>Accept-Encoding</code> and decompress for you.</p>
<pre><code class="language-bash">curl -s -o /dev/null -D - \\
  -H 'Accept-Encoding: gzip, br' http://localhost:4000/v2/labs/lab_1 -w 'size: %{size_download} byte\\n' | grep -iE '^(content-encoding|content-length|vary)|size'</code></pre>
<div class="out">Vary: Origin, Accept-Encoding
Content-Length: 101
size: 101 byte</div>
<pre><code class="language-bash">curl -s -o /dev/null -D - \\
  -H 'Accept-Encoding: gzip, br' 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" -w 'size: %{size_download} byte\\n' | grep -iE '^(content-encoding|content-length|vary)|size'</code></pre>
<div class="out">Vary: Origin, Accept-Encoding
Content-Encoding: br
size: 1447 byte</div>
<ul>
  <li><strong>A 101-byte lab</strong> is sent as is: below the 1 KB threshold compression costs more than it saves (the gzip header alone is ~20 bytes).</li>
  <li><strong>The 100-booking list</strong> goes out as <code>br</code>, 1,447 bytes.</li>
  <li>The middleware never compresses responses marked <code>Cache-Control: no-transform</code>, and it buffers output — for server-sent events you must flush after each event (Chapter 10).</li>
</ul>
<div class="pitfall"><p><strong>Trap — compressing secrets next to attacker-controlled text.</strong> If one compressed response contains both a secret (say a CSRF token in HTML) and text an attacker can choose, the compressed <em>size</em> can leak the secret letter by letter (the BREACH attack, 2013). LabFlow’s JSON API carries its token in a header, not in the body, so the risk does not apply — but know why some teams turn compression off for certain pages.</p></div>
<a class="link-card" href="https://github.com/expressjs/compression" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: expressjs/compression README (read 1 Nov 2026)</span><span class="lc-sub">Supports deflate, gzip and br; default threshold 1 kb (treated as “over” when the size is unknown); never compresses Cache-Control: no-transform; needs res.flush() for server-sent events.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html#name-content-encoding" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9110 §8.4 Content-Encoding and §12.5.3 Accept-Encoding (read 1 Nov 2026)</span><span class="lc-sub">How a client advertises the codings it accepts and how the server labels the coding it applied; the coding is a property of the representation, so the client decodes before reading the JSON.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>The server pays for bytes too</h3>
<p>The same 100-booking list under load, without and with gzip (autocannon, 10 connections, 10 s):</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|requests in'</code></pre>
<div class="out">│ Latency │ 5 ms │ 7 ms │ 16 ms │ 21 ms │ 8.11 ms │ 4.6 ms │ 140 ms │
│ Req/Sec   │ 683     │ 683     │ 1,224   │ 1,336   │ 1,163.91 │ 198.97  │ 683     │
12k requests in 10.01s, 303 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" -H 'Accept-Encoding=gzip' 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|requests in'</code></pre>
<div class="out">│ Latency │ 6 ms │ 7 ms │ 12 ms │ 13 ms │ 7.89 ms │ 1.74 ms │ 23 ms │
│ Req/Sec   │ 1,053   │ 1,053   │ 1,233   │ 1,270   │ 1,192.91 │ 70.25  │ 1,053   │
12k requests in 10.02s, 26.6 MB read</div>
<p>Requests per second barely move on localhost (1,164 vs 1,193; another run gave 1,036 with gzip — on a laptop the difference is noise). The bytes do move: <strong>303 MB versus 26.6 MB</strong> in ten seconds. 303 MB in 10 s is about 240 Mbit/s. If the server’s network port is 100 Mbit/s, uncompressed it would stop near 490 req/s however fast the code is; compressed it would not reach the limit at all. Cloud providers also bill outgoing traffic by the gigabyte.</p>

<h3>Other slowness that the design creates</h3>
<p>Three more patterns from earlier chapters, with the numbers measured there:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">N+1 queries (3.4)</span><span class="lz-lnote">a page of 20 + one query per row = 21 queries, 2.16 ms on localhost, vs 1 JOIN 0.25 ms. With the database on another machine, each extra query adds a network round trip</span></div>
  <div class="lz-layer"><span class="lz-lname">Deep OFFSET (3.1)</span><span class="lz-lnote">OFFSET 900,000 = 35 ms per page (8.1) and grows with the page number; a cursor stays flat</span></div>
  <div class="lz-layer"><span class="lz-lname">Chatty screens</span><span class="lz-lnote">the home screen makes 5 calls; on the slow link above each costs ≥ 80 ms of round trips. Run them in parallel, or offer one screen-shaped endpoint if it is measured to matter</span></div>
  <div class="lz-layer"><span class="lz-lname">Unbounded responses</span><span class="lz-lnote">any list without a limit eventually becomes the 25 KB (or 25 MB) answer — every collection is paginated</span></div>
</div>
<p>The pattern: <strong>find the cost with a measurement, fix it with a contract rule</strong> — a limit, a field list, a cursor, a coding. Infrastructure fixes (CDNs, read replicas) come later, in the System Design course.</p>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“The mobile app is slow but the API is fast.”</strong> Measure on a throttled link. Here a 25 KB list took 319 ms on 1 Mbit/s and 103 ms compressed — the server spent 3 ms.</li>
  <li><strong>“How would you make this endpoint faster without touching the database?”</strong> Smaller default page, sparse fields, compression, fewer round trips.</li>
  <li><strong>“Why <code>Vary: Accept-Encoding</code>?”</strong> So a cache stores one copy per encoding and never sends Brotli to a client that cannot decode it.</li>
</ul>

<h3>🧪 Practice (25–35 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>perf/slow-link.mjs</code> at 400 kbit/s. Measure <code>limit=100</code>, <code>limit=100&amp;fields=id,status,period</code> and the same with <code>Accept-Encoding: br</code>. Predict each time with arithmetic first.</li>
  <li>Measure the home screen: the 5 calls one after another, then all at once with <code>Promise.all</code>, through the slow link. How much does running them in parallel save?</li>
  <li>Set <code>Cache-Control: no-transform</code> on one route and confirm with curl that it is no longer compressed.</li>
</ol>
<p><strong>Done when:</strong> your measured times are within ~20% of your predictions and you can explain any gap.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Payload</span><span class="v">The body of a request or response.</span></div>
  <div class="kv"><span class="k">Bandwidth</span><span class="v">How many bits per second a link can carry; transfer time = size ÷ bandwidth.</span></div>
  <div class="kv"><span class="k">Sparse fieldset</span><span class="v">The client names the fields it needs (<code>fields=</code>).</span></div>
  <div class="kv"><span class="k">Accept-Encoding / Content-Encoding</span><span class="v">What the client can decode / what the server applied (gzip, br).</span></div>
  <div class="kv"><span class="k">Vary</span><span class="v">Tells caches which request headers change the response.</span></div>
  <div class="kv"><span class="k">Chatty API</span><span class="v">One screen needs many round trips.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>100 bookings: 25.5 KB compact JSON, 11.7 KB with <code>fields=</code>, 1.7 KB gzip, 1.4 KB Brotli; indentation alone added 30% in development.</li>
  <li>On a 1 Mbit/s link with 40 ms each way: 319 ms uncompressed, 103 ms compressed — the server spent 2–3 ms.</li>
  <li>Compression is one line of Express; responses under 1 KB stay plain; <code>Vary: Accept-Encoding</code> keeps caches correct.</li>
  <li>Under load the server sent 303 MB vs 26.6 MB in 10 s — bandwidth limits and bills.</li>
  <li>N+1, deep OFFSET, chatty screens and unbounded lists are design costs; fix them with contract rules.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Chậm do thiết kế: kích thước payload, chọn trường và nén</h2>
<p class="lead">Bài 8.2 sửa một <em>server</em> chậm. Nhiều API chậm ngay cả trước khi server làm gì — chậm vì hợp đồng bắt client tải về bao nhiêu byte, hay phải gọi bao nhiêu lần. Trên localhost bạn không bao giờ thấy; trên Wi-Fi trường đông người thì chỉ thấy mỗi nó. Bài này đo response của LabFlow qua một đường truyền chậm giả lập và sửa bằng chính những công cụ hợp đồng đã có.</p>

<h3>Byte tốn thời gian ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">server</span><span class="lz-t">dựng JSON</span><span class="lz-d">vài micro giây mỗi lượt đặt (8.1) — gần như miễn phí</span></div>
  <div class="lz-step"><span class="lz-k">đường truyền</span><span class="lz-t">gửi các byte</span><span class="lz-d">thời gian = kích thước ÷ băng thông — chặng lớn lên theo kích thước</span></div>
  <div class="lz-step"><span class="lz-k">điện thoại</span><span class="lz-t">phân tích và hiển thị</span><span class="lz-d">máy rẻ phân tích JSON lớn cũng chậm</span></div>
</div>
<p>Trên localhost đường truyền có hàng gigabyte mỗi giây, nên kích thước trông như miễn phí. Trên đường 1 Mbit/s (lớp học đông người, 4G yếu) cứ 1.000 byte tốn 8 ms.</p>

<h3>Câu trả lời của LabFlow nặng bao nhiêu?</h3>
<p>Đo với <code>NODE_ENV=production</code>, chế độ gửi JSON liền một dòng (khi dev, LabFlow thụt lề 2 dấu cách cho dễ đọc — vì thế bài 8.1 thấy 36.428 byte cho cùng 100 lượt đặt; riêng thụt lề đã chiếm 30% body):</p>
<pre><code class="language-bash">curl -s -o /dev/null -w 'limit=100, JSON gọn: %{size_download} byte\\n' 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)"</code></pre>
<div class="out">limit=100, JSON gọn: 25501 byte</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'limit=100&amp;fields=id,status,period: %{size_download} byte\\n' 'http://localhost:4000/v2/bookings?limit=100&amp;fields=id,status,period' \\
  -H "Authorization: Bearer $(cat lan.jwt)"</code></pre>
<div class="out">limit=100&amp;fields=id,status,period: 11653 byte</div>
<pre><code class="language-bash">curl -s -o /dev/null -D - -w 'gzip: %{size_download} byte\\n' \\
  -H 'Accept-Encoding: gzip' 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^content-encoding|byte'</code></pre>
<div class="out">Content-Encoding: gzip
gzip: 1688 byte</div>
<pre><code class="language-bash">curl -s -o /dev/null -D - -w 'br: %{size_download} byte\\n' \\
  -H 'Accept-Encoding: br' 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^content-encoding|byte'</code></pre>
<div class="out">Content-Encoding: br
br: 1447 byte</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">100 lượt đặt, mọi trường · 25.501 B</span><span class="lz-lnote">thứ client nhận nếu xin tất cả</span></div>
  <div class="lz-layer"><span class="lz-lname">fields=id,status,period · 11.653 B</span><span class="lz-lnote">chọn trường (3.4): chỉ những gì màn lịch hiển thị — nhỏ hơn 54%</span></div>
  <div class="lz-layer"><span class="lz-lname">gzip · 1.688 B</span><span class="lz-lnote">nhỏ hơn 15 lần: JSON lặp đi lặp lại cùng các khoá và giá trị</span></div>
  <div class="lz-layer"><span class="lz-lname">Brotli (br) · 1.447 B</span><span class="lz-lnote">nhỏ hơn chút nữa; mọi trình duyệt hiện nay đều hỗ trợ</span></div>
</div>

<h3>Cũng những câu trả lời đó qua đường truyền chậm</h3>
<p>Kích thước chỉ thành thời gian trên đường chậm, nên hãy dựng một đường chậm. <code>perf/slow-link.mjs</code> đứng giữa curl và LabFlow, thêm 40 ms mỗi chiều (như một server ở xa) và nhỏ giọt response ra với tốc độ 1.000 kbit/s:</p>
<pre><code class="language-javascript">// perf/slow-link.mjs — bài 8.3: giả lập đường truyền chậm giữa app và LabFlow (Wi-Fi đông người / 4G yếu)
//   node perf/slow-link.mjs &lt;cổng nghe&gt; &lt;cổng LabFlow&gt; &lt;kbit/s&gt; &lt;ms trễ mỗi chiều&gt;
// Mọi request đi qua nguyên vẹn (kể cả Accept-Encoding); response bị "nhỏ giọt" đúng băng thông đã đặt.
import http from 'node:http';
const [listen = 8090, upstream = 4000, kbps = 1000, delay = 40] = process.argv.slice(2).map(Number);
const bytesPerMs = (kbps * 1000) / 8 / 1000;
const sleep = (ms) =&gt; new Promise((ok) =&gt; setTimeout(ok, ms));
http.createServer(async (req, res) =&gt; {
  await sleep(delay);                                            // request đi tới server
  const up = http.request({ port: upstream, path: req.url, method: req.method, headers: req.headers }, async (r) =&gt; {
    await sleep(delay);                                          // byte đầu của response đi về
    res.writeHead(r.statusCode, r.headers);
    for await (const chunk of r) {
      for (let i = 0; i &lt; chunk.length; i += 1024) {             // nhỏ giọt từng 1 KB theo băng thông
        const piece = chunk.subarray(i, i + 1024);
        res.write(piece);
        await sleep(piece.length / bytesPerMs);
      }
    }
    res.end();
  });
  req.pipe(up);
}).listen(listen, () =&gt; console.log(&#96;đường chậm :\${listen} → :\${upstream}, \${kbps} kbit/s, trễ \${delay} ms mỗi chiều&#96;));</code></pre>
<pre><code class="language-bash">node perf/slow-link.mjs 8090 4000 1000 40     # cổng 8090 → LabFlow :4000, 1 Mbit/s, trễ 40 ms mỗi chiều</code></pre>
<pre><code class="language-bash">for q in 'limit=20' 'limit=100' 'limit=100&amp;fields=id,status,period'; do curl -s -o /dev/null -w "$q: %{size_download} byte, %{time_total} s\\n" "http://localhost:8090/v2/bookings?$q" -H "Authorization: Bearer $(cat lan.jwt)"; done</code></pre>
<div class="out">limit=20: 5204 byte, 0.146403 s
limit=100: 25501 byte, 0.319357 s
limit=100&amp;fields=id,status,period: 11653 byte, 0.196988 s</div>
<pre><code class="language-bash">for e in gzip br; do curl -s -o /dev/null -H "Accept-Encoding: $e" -w "limit=100, $e: %{size_download} byte, %{time_total} s\\n" 'http://localhost:8090/v2/bookings?limit=100' -H "Authorization: Bearer $(cat lan.jwt)"; done</code></pre>
<div class="out">limit=100, gzip: 1688 byte, 0.103244 s
limit=100, br: 1447 byte, 0.103708 s</div>
<p>Kiểm bằng số học: request nào cũng trả 80 ms trễ; rồi 25.501 B × 8 ÷ 1.000.000 bit/s = 204 ms truyền. 80 + 204 = <strong>284 ms</strong> dự đoán, <strong>319 ms</strong> đo được (proxy ngủ sau mỗi mẩu 1 KB, và bộ hẹn giờ chạy trễ chút). Có gzip: 80 + 13,5 = 93,5 dự đoán, <strong>103 ms</strong> đo được. Thời gian server (2–3 ms) chìm mất trong cả hai.</p>
<p>Đặt cạnh ngân sách của bài 8.1 (p95 ≤ 300 ms): <strong>riêng danh sách không nén đã vỡ ngân sách</strong>, trước cả điện thoại chậm hay thử lại. Có nén, nó dùng một phần ba. Server không nhanh lên chút nào — hợp đồng rẻ đi.</p>
<div class="pitfall"><p><strong>Bẫy — đánh giá API bằng số đo localhost.</strong> Trên localhost câu trả lời 25 KB mất 3 ms. Test với đường truyền chậm (một proxy như trên, hoặc Chrome DevTools → Network → throttling) rồi hãy gọi một endpoint là “nhanh”.</p></div>

<h3>Sửa bằng hợp đồng</h3>
<p>Mỗi cách sửa dưới đây là một luật của <em>hợp đồng API</em> — vì thế nó thuộc về khoá thiết kế API, không chỉ “tinh chỉnh server”:</p>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">1</span><span class="lz-nbody"><span class="lz-ntitle">Trang mặc định nhỏ</span><span class="lz-nsub">limit mặc định 20, tối đa 100 (3.1) — client quên xin vẫn nhận 5 KB, không phải 25</span></span></div>
    <div class="lz-node"><span class="lz-badge">2</span><span class="lz-nbody"><span class="lz-ntitle">Chọn trường</span><span class="lz-nsub">fields=id,status,period (3.4) — nhỏ hơn 54% ở đây; client nói màn hình cần gì</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">3</span><span class="lz-nbody"><span class="lz-ntitle">Nhúng khi được xin</span><span class="lz-nsub">include=lab chỉ khi client yêu cầu (3.4); đừng nhúng sẵn “phòng khi cần”</span></span></div>
    <div class="lz-node"><span class="lz-badge">4</span><span class="lz-nbody"><span class="lz-ntitle">Nén</span><span class="lz-nsub">Accept-Encoding → Content-Encoding: br/gzip; nhỏ 15–18 lần ở đây, client không phải sửa code</span></span></div>
  </div>
</div>

<h3>Nén trong Express, và những gì nó không đụng tới</h3>
<p>LabFlow thêm một dòng gần đầu <code>app.js</code> (gói <code>compression</code> 1.8.2):</p>
<pre><code class="language-javascript">import compression from 'compression';
app.use(compression({ threshold: 1024 }));   // bài 8.3: gzip/br khi client gửi Accept-Encoding và body &gt; 1 KB</code></pre>
<p>Cuộc trao đổi này nằm sẵn trong HTTP: client liệt kê những gì nó giải nén được trong <code>Accept-Encoding</code>; server chọn một cái, ghi lại trong <code>Content-Encoding</code>, và thêm <code>Vary: Accept-Encoding</code> để bộ đệm (cache) không bao giờ đưa body Brotli cho client chỉ xin JSON thường (cache là Chương 9). Trình duyệt, <code>fetch</code> của Node, OkHttp trên Android và iOS đều tự gửi <code>Accept-Encoding</code> và tự giải nén cho bạn.</p>
<pre><code class="language-bash">curl -s -o /dev/null -D - \\
  -H 'Accept-Encoding: gzip, br' http://localhost:4000/v2/labs/lab_1 -w 'size: %{size_download} byte\\n' | grep -iE '^(content-encoding|content-length|vary)|size'</code></pre>
<div class="out">Vary: Origin, Accept-Encoding
Content-Length: 101
size: 101 byte</div>
<pre><code class="language-bash">curl -s -o /dev/null -D - \\
  -H 'Accept-Encoding: gzip, br' 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" -w 'size: %{size_download} byte\\n' | grep -iE '^(content-encoding|content-length|vary)|size'</code></pre>
<div class="out">Vary: Origin, Accept-Encoding
Content-Encoding: br
size: 1447 byte</div>
<ul>
  <li><strong>Một phòng 101 byte</strong> được gửi nguyên: dưới ngưỡng 1 KB, nén tốn hơn được (riêng phần đầu của gzip đã ~20 byte).</li>
  <li><strong>Danh sách 100 lượt đặt</strong> đi ra dạng <code>br</code>, 1.447 byte.</li>
  <li>Middleware không bao giờ nén response có <code>Cache-Control: no-transform</code>, và nó gom output vào bộ đệm — với server-sent events phải flush sau mỗi sự kiện (Chương 10).</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — nén bí mật nằm cạnh chữ do kẻ tấn công chọn.</strong> Nếu một response nén chứa cả bí mật (ví dụ CSRF token trong HTML) lẫn đoạn chữ kẻ tấn công điều khiển được, <em>kích thước</em> sau nén có thể làm lộ bí mật từng ký tự (tấn công BREACH, 2013). API JSON của LabFlow để token ở header, không ở body, nên rủi ro này không áp dụng — nhưng hãy biết vì sao có đội tắt nén ở vài trang.</p></div>
<a class="link-card" href="https://github.com/expressjs/compression" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: README của expressjs/compression (đọc ngày 1/11/2026)</span><span class="lc-sub">Hỗ trợ deflate, gzip và br; ngưỡng mặc định 1 kb (không biết trước kích thước thì coi là “vượt”); không bao giờ nén khi có Cache-Control: no-transform; cần res.flush() cho server-sent events.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html#name-content-encoding" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9110 §8.4 Content-Encoding và §12.5.3 Accept-Encoding (đọc ngày 1/11/2026)</span><span class="lc-sub">Cách client báo những kiểu mã hoá nó nhận, và cách server dán nhãn kiểu đã áp dụng; mã hoá là thuộc tính của bản biểu diễn, nên client giải mã xong mới đọc JSON.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Server cũng trả giá cho từng byte</h3>
<p>Cùng danh sách 100 lượt đặt khi có tải, không nén và có gzip (autocannon, 10 kết nối, 10 giây):</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|requests in'</code></pre>
<div class="out">│ Latency │ 5 ms │ 7 ms │ 16 ms │ 21 ms │ 8.11 ms │ 4.6 ms │ 140 ms │
│ Req/Sec   │ 683     │ 683     │ 1,224   │ 1,336   │ 1,163.91 │ 198.97  │ 683     │
12k requests in 10.01s, 303 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" -H 'Accept-Encoding=gzip' 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|requests in'</code></pre>
<div class="out">│ Latency │ 6 ms │ 7 ms │ 12 ms │ 13 ms │ 7.89 ms │ 1.74 ms │ 23 ms │
│ Req/Sec   │ 1,053   │ 1,053   │ 1,233   │ 1,270   │ 1,192.91 │ 70.25  │ 1,053   │
12k requests in 10.02s, 26.6 MB read</div>
<p>Số request mỗi giây gần như không đổi trên localhost (1.164 so với 1.193; một lần chạy khác ra 1.036 khi có gzip — trên laptop chênh lệch này là nhiễu). Byte thì đổi hẳn: <strong>303 MB so với 26,6 MB</strong> trong mười giây. 303 MB trong 10 giây là khoảng 240 Mbit/s. Nếu cổng mạng của server là 100 Mbit/s, không nén thì nó dừng quanh 490 req/s dù code nhanh cỡ nào; có nén thì còn lâu mới chạm giới hạn. Nhà cung cấp cloud còn tính tiền lưu lượng đi ra theo từng gigabyte.</p>

<h3>Những kiểu chậm khác do thiết kế gây ra</h3>
<p>Ba mẫu nữa từ các chương trước, kèm số đã đo ở đó:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Truy vấn N+1 (3.4)</span><span class="lz-lnote">một trang 20 dòng + mỗi dòng một truy vấn = 21 truy vấn, 2,16 ms trên localhost, so với 1 JOIN 0,25 ms. CSDL ở máy khác thì mỗi truy vấn thêm một lượt đi-về qua mạng</span></div>
  <div class="lz-layer"><span class="lz-lname">OFFSET sâu (3.1)</span><span class="lz-lnote">OFFSET 900.000 = 35 ms mỗi trang (8.1) và tăng theo số trang; cursor thì giữ phẳng</span></div>
  <div class="lz-layer"><span class="lz-lname">Màn hình “lắm lời”</span><span class="lz-lnote">màn chính gọi 5 lần; trên đường chậm ở trên mỗi lần tốn ≥ 80 ms đi-về. Gọi song song, hoặc làm một endpoint theo màn hình nếu đo thấy đáng</span></div>
  <div class="lz-layer"><span class="lz-lname">Danh sách không giới hạn</span><span class="lz-lnote">danh sách nào không có limit rồi cũng thành câu trả lời 25 KB (hay 25 MB) — mọi tập hợp đều phân trang</span></div>
</div>
<p>Khuôn chung: <strong>tìm cái giá bằng một phép đo, sửa bằng một luật hợp đồng</strong> — một limit, một danh sách trường, một cursor, một kiểu nén. Cách sửa bằng hạ tầng (CDN, bản sao đọc) để sau, ở khoá System Design.</p>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“App di động chậm nhưng API nhanh.”</strong> Đo trên đường truyền bị bóp băng thông. Ở đây danh sách 25 KB mất 319 ms trên 1 Mbit/s và 103 ms khi nén — server chỉ tốn 3 ms.</li>
  <li><strong>“Làm endpoint này nhanh hơn mà không đụng CSDL thế nào?”</strong> Trang mặc định nhỏ hơn, chọn trường, nén, ít lượt đi-về hơn.</li>
  <li><strong>“Vì sao có <code>Vary: Accept-Encoding</code>?”</strong> Để cache lưu một bản cho mỗi kiểu mã hoá và không bao giờ gửi Brotli cho client không giải được.</li>
</ul>

<h3>🧪 Thực hành (25–35 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>perf/slow-link.mjs</code> ở 400 kbit/s. Đo <code>limit=100</code>, <code>limit=100&amp;fields=id,status,period</code> và cùng các request đó với <code>Accept-Encoding: br</code>. Tính trước từng thời gian bằng số học.</li>
  <li>Đo màn hình chính: 5 lời gọi lần lượt, rồi cả 5 cùng lúc bằng <code>Promise.all</code>, qua đường chậm. Gọi song song tiết kiệm được bao nhiêu?</li>
  <li>Đặt <code>Cache-Control: no-transform</code> cho một route và xác nhận bằng curl rằng nó không còn bị nén.</li>
</ol>
<p><strong>Xong khi:</strong> thời gian đo được lệch dự đoán của bạn không quá ~20% và bạn giải thích được phần chênh.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Payload</span><span class="v">Phần body của request hay response.</span></div>
  <div class="kv"><span class="k">Băng thông (bandwidth)</span><span class="v">Số bit mỗi giây đường truyền chở được; thời gian truyền = kích thước ÷ băng thông.</span></div>
  <div class="kv"><span class="k">Chọn trường (sparse fieldset)</span><span class="v">Client nêu tên các trường nó cần (<code>fields=</code>).</span></div>
  <div class="kv"><span class="k">Accept-Encoding / Content-Encoding</span><span class="v">Client giải nén được gì / server đã nén bằng gì (gzip, br).</span></div>
  <div class="kv"><span class="k">Vary</span><span class="v">Báo cho cache biết header nào của request làm response khác đi.</span></div>
  <div class="kv"><span class="k">API “lắm lời” (chatty)</span><span class="v">Một màn hình cần nhiều lượt đi-về.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>100 lượt đặt: 25,5 KB JSON liền dòng, 11,7 KB với <code>fields=</code>, 1,7 KB gzip, 1,4 KB Brotli; riêng thụt lề khi dev đã thêm 30%.</li>
  <li>Trên đường 1 Mbit/s, trễ 40 ms mỗi chiều: 319 ms không nén, 103 ms có nén — server chỉ tốn 2–3 ms.</li>
  <li>Nén là một dòng Express; response dưới 1 KB giữ nguyên; <code>Vary: Accept-Encoding</code> giữ cache đúng.</li>
  <li>Khi có tải, server gửi 303 MB so với 26,6 MB trong 10 giây — băng thông vừa là giới hạn vừa là hoá đơn.</li>
  <li>N+1, OFFSET sâu, màn hình lắm lời và danh sách không giới hạn là cái giá của thiết kế; sửa bằng luật hợp đồng.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Designing APIs that scale out: statelessness and safe retries|||8.4 — Thiết kế API để mở rộng ngang: không trạng thái và gửi lại an toàn',
      slug: 'api-8-3-mo-rong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai instance sau round-robin: JWT vẫn chạy; dữ liệu, id, giới hạn và idempotency hỏng (hai bk_1, 8/8 lượt đặt, hai 201); bảng idempotency dùng chung trong PostgreSQL; sticky session; 502 khi một bản chết; bảng kiểm.',
      content: `${G084}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Designing APIs that scale out: statelessness and safe retries</h2>
<p class="lead">One Node process logs in ~114 people per second (8.2). When that is not enough — or one crash must not take LabFlow down — you run <strong>several copies</strong> behind a <strong>load balancer</strong>: scaling <em>out</em>. Here, two real instances and four things that break — one cause, and the contract decides how hard the fix is.</p>

<h3>Two instances behind a load balancer</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">client</span><span class="lz-t">app / curl</span><span class="lz-d">knows ONE address: :8080</span></div>
  <div class="lz-step"><span class="lz-k">load balancer</span><span class="lz-t">round-robin</span><span class="lz-d">request 1 → A, request 2 → B, request 3 → A …</span></div>
  <div class="lz-step"><span class="lz-k">instance A :4001</span><span class="lz-t">LabFlow process</span><span class="lz-d">its own RAM, its own counters</span></div>
  <div class="lz-step"><span class="lz-k">instance B :4002</span><span class="lz-t">LabFlow process</span><span class="lz-d">same code, separate RAM</span></div>
</div>
<p>Real ones are nginx, HAProxy or a cloud service; LabFlow uses 15 lines to see every step:</p>
<pre><code class="language-javascript">// perf/proxy-rr.mjs (rút gọn) — node perf/proxy-rr.mjs 8080 4001 4002
http.createServer((req, res) =&gt; {
  const up = ups[i++ % ups.length];                        // lần lượt: A, B, A, B …
  const p = http.request({ host: '127.0.0.1', port: up, path: req.url, method: req.method, agent, headers: req.headers },
    (r) =&gt; { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  p.on('error', () =&gt; { res.writeHead(502, { 'content-type': 'application/problem+json' }); res.end(/* … */); });
  req.pipe(p);
}).listen(port);</code></pre>
<pre><code class="language-bash">LABFLOW_INSTANCE=A PORT=4001 npm start      # mỗi câu trả lời có header LabFlow-Instance (chỉ để học)
LABFLOW_INSTANCE=B PORT=4002 npm start
node perf/proxy-rr.mjs 8080 4001 4002</code></pre>

<h3>What still works: the token</h3>
<pre><code class="language-bash">curl -s -X POST http://localhost:8080/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' -D - -o lan.json | grep -iE '^(HTTP|LabFlow-Instance)'; jq -r .accessToken lan.json &gt; lan.jwt</code></pre>
<div class="out">HTTP/1.1 200 OK
labflow-instance: A</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null http://localhost:8080/v2/me -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|LabFlow-Instance)'; done</code></pre>
<div class="out">HTTP/1.1 200 OK
labflow-instance: B
HTTP/1.1 200 OK
labflow-instance: A</div>
<p>Login happened on A; the next two requests went to B and then A, and both accepted the token. A JWT (6.1) carries everything the server needs — who you are, until when — signed with a secret that both instances share as <em>configuration</em>. No instance has to remember the login. That is what <strong>stateless</strong> means: any instance can answer any request, because nothing about the conversation lives in one process’s memory.</p>

<h3>What breaks</h3>
<p><strong>1 · Data in RAM.</strong> LabFlow still keeps bookings in memory (PostgreSQL arrives in Chapter 12). Lan books lab 1:</p>
<pre><code class="language-bash">curl -s -D - http://localhost:8080/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-04-05T08:00:00+07:00","end":"2027-04-05T10:00:00+07:00"}}' | grep -iE '^(HTTP|LabFlow-Instance|Location)'</code></pre>
<div class="out">HTTP/1.1 201 Created
labflow-instance: B
location: /v2/bookings/bk_1</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null http://localhost:8080/v2/bookings/bk_1 -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|LabFlow-Instance)'; done</code></pre>
<div class="out">HTTP/1.1 404 Not Found
labflow-instance: A
HTTP/1.1 200 OK
labflow-instance: B</div>
<p>Created on B. Read through the balancer: 404 from A, 200 from B. To the client the booking flickers in and out of existence.</p>
<p><strong>2 · Rules checked in RAM.</strong> Lan sends the <em>same</em> booking again — same lab, same two hours:</p>
<pre><code class="language-bash">curl -s -D - http://localhost:8080/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-04-05T08:00:00+07:00","end":"2027-04-05T10:00:00+07:00"}}' | grep -iE '^(HTTP|LabFlow-Instance|Location)'</code></pre>
<div class="out">HTTP/1.1 201 Created
labflow-instance: A
location: /v2/bookings/bk_1</div>
<p>It should be <code>409 BOOKING_CONFLICT</code> (1.3). A has never seen B’s booking, so it accepts — and its own counter also starts at 1, so there are now two different <code>bk_1</code>s. A double booking <em>and</em> an ID that means two things.</p>
<p><strong>3 · Limits counted in RAM.</strong> The booking limit is 5 per minute per user (5.3). Eight bookings in a row:</p>
<pre><code class="language-bash">for d in 10 11 12 13 14 15 16 17; do curl -s -D - -o /dev/null http://localhost:8080/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json "{\\"labId\\":\\"lab_2\\",\\"period\\":{\\"start\\":\\"2027-04-\${d}T08:00:00+07:00\\",\\"end\\":\\"2027-04-\${d}T10:00:00+07:00\\"}}" | grep -iE '^(HTTP|LabFlow-Instance)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created labflow-instance: B
HTTP/1.1 201 Created labflow-instance: A
HTTP/1.1 201 Created labflow-instance: B
HTTP/1.1 201 Created labflow-instance: A
HTTP/1.1 201 Created labflow-instance: B
HTTP/1.1 201 Created labflow-instance: A
HTTP/1.1 201 Created labflow-instance: B
HTTP/1.1 201 Created labflow-instance: A</div>
<p>8 of 8 accepted: each instance counted only its own half. With N instances the real limit is N × 5 — and it changes every time someone adds an instance.</p>
<p><strong>4 · Idempotency in RAM.</strong> The worst one, because it breaks a promise the contract makes. Lan retries a booking with the same <code>Idempotency-Key</code> (5.1), exactly what an app does after a timeout:</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - http://localhost:8080/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" -H 'Idempotency-Key: dat-phong-lan-01' --json '{"labId":"lab_3","period":{"start":"2027-04-20T08:00:00+07:00","end":"2027-04-20T10:00:00+07:00"}}' | grep -iE '^(HTTP|LabFlow-Instance|Location|Idempotent-Replayed)|"id"' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created labflow-instance: A location: /v2/bookings/bk_1   "id": "bk_1",
HTTP/1.1 201 Created labflow-instance: B location: /v2/bookings/bk_1   "id": "bk_1",</div>
<p>Two <code>201 Created</code>, from A and from B. The header that exists to stop double bookings let one through, because each instance kept its own table of keys.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cause of all four</span><span class="lz-lnote">state that must be shared lives inside one process</span></div>
  <div class="lz-layer"><span class="lz-lname">Data, ID counter</span><span class="lz-lnote">→ the database (Ch12); IDs from the database or random (UUID/ULID), never a per-process counter</span></div>
  <div class="lz-layer"><span class="lz-lname">Rate-limit counters</span><span class="lz-lnote">→ a shared store (Redis, PostgreSQL) or the gateway in front of all instances</span></div>
  <div class="lz-layer"><span class="lz-lname">Idempotency keys</span><span class="lz-lnote">→ a shared store, claimed atomically — fixed below</span></div>
</div>
<a class="link-card" href="https://12factor.net/processes" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: The Twelve-Factor App — VI. Processes (read 1 Nov 2026)</span><span class="lc-sub">“Twelve-factor processes are stateless and share-nothing. Any data that needs to persist must be stored in a stateful backing service, typically a database.” It also says sticky sessions “should never be used or relied upon”.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Moving state out: one idempotency table for every instance</h3>
<p>The fix keeps the <em>same rules</em> as lesson 5.1 (400 missing key · 422 same key with a different body · 409 still running · replay with <code>Idempotent-Replayed: true</code>) and changes only <em>where</em> the keys live: a PostgreSQL table that every instance uses. The important part is the first statement in the code below — the claim.</p>
<p>If two instances receive the same key at the same moment, both run this statement, the primary key <code>(scope, key)</code> lets exactly one row in, and only that instance gets a row back. The other one reads the existing row and replays or answers 409. No “check, then insert” gap where both could win.</p>
<pre><code class="language-javascript">// idempotency-pg.js (rút gọn) — CÙNG luật bài 5.1, bảng khoá nằm trong PostgreSQL dùng chung
const won = await pool.query(&#96;INSERT INTO idempotency_keys (scope, key, fp, state) VALUES ($1, $2, $3, 'running')
  ON CONFLICT DO NOTHING RETURNING 1&#96;, [scope, key, fp]);
if (won.rowCount === 0) {                                  // khoá đã có — ở instance này hay instance khác
  const { rows: [e] } = await pool.query('SELECT * FROM idempotency_keys WHERE scope = $1 AND key = $2', [scope, key]);
  if (e.fp !== fp) throw new HttpError(422, 'IDEMPOTENCY_KEY_REUSED');
  if (e.state === 'running') { res.set('Retry-After', '1'); throw new HttpError(409, 'IDEMPOTENCY_IN_PROGRESS'); }
  res.set('Idempotent-Replayed', 'true');
  return res.status(e.status).json(e.body);                // phát lại đúng câu trả lời đã lưu
}
// thắng ⇒ chạy handler; khi response xong: 2xx ⇒ UPDATE state = 'done' + lưu status/body; lỗi ⇒ DELETE để cho thử lại</code></pre>
<p><code>idempotency.js</code> exports this version when <code>LABFLOW_IDEMPOTENCY=pg</code>, so routes do not change. Same two requests, fresh instances:</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - http://localhost:8080/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" -H 'Idempotency-Key: dat-phong-lan-01' --json '{"labId":"lab_3","period":{"start":"2027-04-20T08:00:00+07:00","end":"2027-04-20T10:00:00+07:00"}}' | grep -iE '^(HTTP|LabFlow-Instance|Location|Idempotent-Replayed)|"id"' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created labflow-instance: B location: /v2/bookings/bk_1   "id": "bk_1",
HTTP/1.1 201 Created labflow-instance: A idempotent-replayed: true location: /v2/bookings/bk_1   "id": "bk_1",</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null http://localhost:8080/v2/bookings/bk_1 -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|LabFlow-Instance)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">HTTP/1.1 200 OK labflow-instance: B
HTTP/1.1 404 Not Found labflow-instance: A</div>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -Atc "SELECT scope, key, state, status, body-&gt;&gt;'id' FROM idempotency_keys"</code></pre>
<div class="out">usr_3|dat-phong-lan-01|done|201|bk_1</div>
<ul>
  <li>B created <code>bk_1</code>; A answered the retry with the <strong>stored</strong> 201 and <code>Idempotent-Replayed: true</code>. One booking. ✓</li>
  <li>But <code>GET /v2/bookings/bk_1</code> still says 404 on A: the bookings themselves are still in B’s RAM. Idempotency is fixed; data waits for Chapter 12. Honest numbers beat a demo that hides it.</li>
  <li>The row in PostgreSQL is the shared memory both instances now agree on.</li>
</ul>
<div class="pitfall"><p><strong>Trap — “check if the key exists, then insert it” in two queries.</strong> Between the SELECT and the INSERT another instance can do the same, and both proceed. Let the database decide in one statement (a unique key + <code>ON CONFLICT</code>), or use a transaction with the right lock.</p></div>

<h3>Why not sticky sessions?</h3>
<p>A <strong>sticky session</strong> makes the balancer send each user to the same instance, so in-RAM state “works” — until that instance restarts (every deploy) and its users lose it, or one class of 40 students behind one school IP pins one instance while the other idles. It also cannot stop Lan and An, on different instances, from booking the same lab. Tokens, shared data and idempotency keys make it unnecessary.</p>

<h3>When an instance dies</h3>
<p>Kill B and keep sending through the balancer:</p>
<pre><code class="language-bash">kill $(lsof -ti tcp:4002 -sTCP:LISTEN)</code></pre>
<pre><code class="language-bash">for i in 1 2 3 4; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8080/v2/labs; done; echo</code></pre>
<div class="out">502 200 502 200 </div>
<p>Half the requests fail with <code>502 Bad Gateway</code>: the naive balancer keeps sending to a dead instance. Real balancers do two things, and both touch the API contract:</p>
<ul>
  <li><strong>Health checks</strong>: call an endpoint every few seconds; stop sending to instances that fail it (LabFlow’s <code>/ready</code>, 8.6).</li>
  <li><strong>Retries</strong> on another instance — only if repeating is safe: <code>GET</code> (1.2), or a <code>POST</code> with an <code>Idempotency-Key</code> backed by the shared table above. The dead instance may have finished the write.</li>
</ul>

<h3>A scale-out checklist for the contract</h3>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">1</span><span class="lz-nbody"><span class="lz-ntitle">Tokens, not sessions in RAM</span><span class="lz-nsub">any instance can check a JWT; the secret is shared configuration</span></span></div>
    <div class="lz-node"><span class="lz-badge">2</span><span class="lz-nbody"><span class="lz-ntitle">IDs that cannot collide</span><span class="lz-nsub">from the database or random — never “counter + 1” in one process</span></span></div>
    <div class="lz-node"><span class="lz-badge">3</span><span class="lz-nbody"><span class="lz-ntitle">Every write retry-safe</span><span class="lz-nsub">Idempotency-Key with a shared, atomic store</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">4</span><span class="lz-nbody"><span class="lz-ntitle">Limits counted once</span><span class="lz-nsub">shared counters or the gateway — the documented limit must be the real one</span></span></div>
    <div class="lz-node"><span class="lz-badge">5</span><span class="lz-nbody"><span class="lz-ntitle">Cursors any instance can read</span><span class="lz-nsub">the cursor carries its own position (3.2), not a pointer into one process</span></span></div>
    <div class="lz-node"><span class="lz-badge">6</span><span class="lz-nbody"><span class="lz-ntitle">Files in object storage</span><span class="lz-nsub">uploads never on one instance’s disk</span></span></div>
  </div>
</div>
<p>Load balancing algorithms, autoscaling and the stages of growing from one server to many are in the <em>System Design</em> course (chapter 2) on Courses.</p>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“What has to change to run your API on several servers?”</strong> Move every piece of shared state out of the process: data, ID generation, rate-limit counters, idempotency keys. Here: four breakages, one cause.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Run A, B and the proxy. Reproduce the double <code>bk_1</code> and the 8/8 bookings. Then explain each in one sentence.</li>
  <li>Switch to <code>LABFLOW_IDEMPOTENCY=pg</code> and send the same key to A and B <em>at the same time</em> (two curl commands with <code>&amp;</code>). How many 201s and how many 409s?</li>
  <li>Make <code>proxy-rr.mjs</code> skip an instance for 5 seconds after a connection error, and retry the request once on the other instance <em>only if the method is GET</em>. Show the 502s disappear.</li>
</ol>
<p><strong>Done when:</strong> you can say which LabFlow state is still per-instance and where each piece should live.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Scale out (horizontal)</span><span class="v">Run more copies of the service instead of a bigger machine.</span></div>
  <div class="kv"><span class="k">Load balancer</span><span class="v">Spreads requests over instances (round-robin and others).</span></div>
  <div class="kv"><span class="k">Stateless</span><span class="v">Any instance can answer any request; shared state lives outside the process.</span></div>
  <div class="kv"><span class="k">Sticky session</span><span class="v">The balancer pins a user to one instance.</span></div>
  <div class="kv"><span class="k">Atomic claim</span><span class="v">One statement that lets exactly one contender win (INSERT … ON CONFLICT).</span></div>
  <div class="kv"><span class="k">502 Bad Gateway</span><span class="v">The proxy could not get a valid answer from the instance behind it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Two instances behind round-robin: JWT kept working (stateless); data, ID counters, rate limits and idempotency broke — all state in one process’s RAM.</li>
  <li>Measured: a booking visible on one instance only, two different <code>bk_1</code>, 8/8 bookings past a limit of 5, and the same Idempotency-Key giving two 201s.</li>
  <li>A shared PostgreSQL table with <code>INSERT … ON CONFLICT DO NOTHING</code> fixed idempotency: second request replayed. Data stays per-instance until Chapter 12.</li>
  <li>Sticky sessions hide the problem; health checks and safe retries depend on the contract (GET, idempotency keys).</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 8.4 — Cookies, CSRF, revocation and rate limiting</span><span class="lc-sub">The Node.js course builds this into a real API and measures it. Same: a counter kept in one process's memory stops being a limit once there are two instances. There you add: the login limiter itself (a Map keyed on IP + email, 429 + Retry-After, trust proxy), and revocation with tokenVersion. This lesson adds what that one does not: two instances behind round-robin measured: 8 bookings out of 8 got past a limit of 5, and the fix with shared counters.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Thiết kế API để mở rộng ngang: không trạng thái và gửi lại an toàn</h2>
<p class="lead">Một tiến trình Node cho ~114 người đăng nhập mỗi giây (8.2). Khi chừng đó không đủ — hay một lần sập không được kéo cả LabFlow chết theo — bạn chạy <strong>nhiều bản sao</strong> sau một <strong>bộ cân bằng tải</strong> (load balancer): mở rộng <em>ngang</em>. Ở đây: hai bản chạy thật và bốn thứ hỏng — một nguyên nhân, và hợp đồng quyết định việc sửa khó hay dễ.</p>

<h3>Hai bản sau một bộ cân bằng tải</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">client</span><span class="lz-t">app / curl</span><span class="lz-d">chỉ biết MỘT địa chỉ: :8080</span></div>
  <div class="lz-step"><span class="lz-k">cân bằng tải</span><span class="lz-t">chia lần lượt</span><span class="lz-d">request 1 → A, request 2 → B, request 3 → A …</span></div>
  <div class="lz-step"><span class="lz-k">bản A :4001</span><span class="lz-t">tiến trình LabFlow</span><span class="lz-d">RAM riêng, bộ đếm riêng</span></div>
  <div class="lz-step"><span class="lz-k">bản B :4002</span><span class="lz-t">tiến trình LabFlow</span><span class="lz-d">cùng code, RAM tách biệt</span></div>
</div>
<p>Bản thật là nginx, HAProxy hay dịch vụ cloud; LabFlow dùng 15 dòng để thấy từng bước:</p>
<pre><code class="language-javascript">// perf/proxy-rr.mjs (rút gọn) — node perf/proxy-rr.mjs 8080 4001 4002
http.createServer((req, res) =&gt; {
  const up = ups[i++ % ups.length];                        // lần lượt: A, B, A, B …
  const p = http.request({ host: '127.0.0.1', port: up, path: req.url, method: req.method, agent, headers: req.headers },
    (r) =&gt; { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  p.on('error', () =&gt; { res.writeHead(502, { 'content-type': 'application/problem+json' }); res.end(/* … */); });
  req.pipe(p);
}).listen(port);</code></pre>
<pre><code class="language-bash">LABFLOW_INSTANCE=A PORT=4001 npm start      # mỗi câu trả lời có header LabFlow-Instance (chỉ để học)
LABFLOW_INSTANCE=B PORT=4002 npm start
node perf/proxy-rr.mjs 8080 4001 4002</code></pre>

<h3>Thứ vẫn chạy: token</h3>
<pre><code class="language-bash">curl -s -X POST http://localhost:8080/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' -D - -o lan.json | grep -iE '^(HTTP|LabFlow-Instance)'; jq -r .accessToken lan.json &gt; lan.jwt</code></pre>
<div class="out">HTTP/1.1 200 OK
labflow-instance: A</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null http://localhost:8080/v2/me -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|LabFlow-Instance)'; done</code></pre>
<div class="out">HTTP/1.1 200 OK
labflow-instance: B
HTTP/1.1 200 OK
labflow-instance: A</div>
<p>Đăng nhập diễn ra ở A; hai request sau đi tới B rồi A, và cả hai đều nhận token. JWT (6.1) mang đủ những gì server cần — bạn là ai, hiệu lực tới khi nào — được ký bằng một khoá bí mật mà hai bản dùng chung như <em>cấu hình</em>. Không bản nào phải nhớ lần đăng nhập. Đó là nghĩa của <strong>không trạng thái</strong> (stateless): bản nào cũng trả lời được request nào, vì không có gì về cuộc trò chuyện nằm trong bộ nhớ của một tiến trình.</p>

<h3>Thứ hỏng</h3>
<p><strong>1 · Dữ liệu trong RAM.</strong> LabFlow vẫn giữ lượt đặt trong bộ nhớ (PostgreSQL tới ở Chương 12). Cô Lan đặt phòng lab 1:</p>
<pre><code class="language-bash">curl -s -D - http://localhost:8080/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-04-05T08:00:00+07:00","end":"2027-04-05T10:00:00+07:00"}}' | grep -iE '^(HTTP|LabFlow-Instance|Location)'</code></pre>
<div class="out">HTTP/1.1 201 Created
labflow-instance: B
location: /v2/bookings/bk_1</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null http://localhost:8080/v2/bookings/bk_1 -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|LabFlow-Instance)'; done</code></pre>
<div class="out">HTTP/1.1 404 Not Found
labflow-instance: A
HTTP/1.1 200 OK
labflow-instance: B</div>
<p>Tạo ở B. Đọc qua bộ cân bằng tải: A trả 404, B trả 200. Với client, lượt đặt lúc có lúc không.</p>
<p><strong>2 · Luật kiểm trong RAM.</strong> Cô Lan gửi <em>đúng</em> lượt đặt đó lần nữa — cùng phòng, cùng hai giờ:</p>
<pre><code class="language-bash">curl -s -D - http://localhost:8080/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-04-05T08:00:00+07:00","end":"2027-04-05T10:00:00+07:00"}}' | grep -iE '^(HTTP|LabFlow-Instance|Location)'</code></pre>
<div class="out">HTTP/1.1 201 Created
labflow-instance: A
location: /v2/bookings/bk_1</div>
<p>Đáng lẽ phải là <code>409 BOOKING_CONFLICT</code> (1.3). A chưa từng thấy lượt đặt của B nên nhận luôn — và bộ đếm của A cũng bắt đầu từ 1, nên giờ có hai <code>bk_1</code> khác nhau. Vừa đặt trùng phòng <em>vừa</em> có một id mang hai nghĩa.</p>
<p><strong>3 · Giới hạn đếm trong RAM.</strong> Giới hạn đặt phòng là 5 lần mỗi phút mỗi người (5.3). Đặt liền tám lần:</p>
<pre><code class="language-bash">for d in 10 11 12 13 14 15 16 17; do curl -s -D - -o /dev/null http://localhost:8080/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json "{\\"labId\\":\\"lab_2\\",\\"period\\":{\\"start\\":\\"2027-04-\${d}T08:00:00+07:00\\",\\"end\\":\\"2027-04-\${d}T10:00:00+07:00\\"}}" | grep -iE '^(HTTP|LabFlow-Instance)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created labflow-instance: B
HTTP/1.1 201 Created labflow-instance: A
HTTP/1.1 201 Created labflow-instance: B
HTTP/1.1 201 Created labflow-instance: A
HTTP/1.1 201 Created labflow-instance: B
HTTP/1.1 201 Created labflow-instance: A
HTTP/1.1 201 Created labflow-instance: B
HTTP/1.1 201 Created labflow-instance: A</div>
<p>Nhận cả 8/8: mỗi bản chỉ đếm nửa của mình. Với N bản, giới hạn thật là N × 5 — và nó đổi mỗi khi ai đó thêm một bản.</p>
<p><strong>4 · Idempotency trong RAM.</strong> Tệ nhất, vì nó phá một lời hứa của hợp đồng. Cô Lan gửi lại một lượt đặt với cùng <code>Idempotency-Key</code> (5.1), đúng như app làm sau một lần hết giờ chờ:</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - http://localhost:8080/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" -H 'Idempotency-Key: dat-phong-lan-01' --json '{"labId":"lab_3","period":{"start":"2027-04-20T08:00:00+07:00","end":"2027-04-20T10:00:00+07:00"}}' | grep -iE '^(HTTP|LabFlow-Instance|Location|Idempotent-Replayed)|"id"' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created labflow-instance: A location: /v2/bookings/bk_1   "id": "bk_1",
HTTP/1.1 201 Created labflow-instance: B location: /v2/bookings/bk_1   "id": "bk_1",</div>
<p>Hai <code>201 Created</code>, từ A và từ B. Header sinh ra để chặn đặt trùng lại để lọt một lượt, vì mỗi bản giữ bảng khoá riêng.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nguyên nhân của cả bốn</span><span class="lz-lnote">trạng thái lẽ ra phải dùng chung lại nằm trong một tiến trình</span></div>
  <div class="lz-layer"><span class="lz-lname">Dữ liệu, bộ đếm id</span><span class="lz-lnote">→ cơ sở dữ liệu (Ch12); id lấy từ CSDL hoặc ngẫu nhiên (UUID/ULID), không bao giờ là bộ đếm riêng của một tiến trình</span></div>
  <div class="lz-layer"><span class="lz-lname">Bộ đếm giới hạn tần suất</span><span class="lz-lnote">→ kho dùng chung (Redis, PostgreSQL) hoặc gateway đứng trước mọi bản</span></div>
  <div class="lz-layer"><span class="lz-lname">Khoá idempotency</span><span class="lz-lnote">→ kho dùng chung, giành khoá nguyên tử — sửa ngay dưới đây</span></div>
</div>
<a class="link-card" href="https://12factor.net/processes" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: The Twelve-Factor App — VI. Processes (đọc ngày 1/11/2026)</span><span class="lc-sub">“Tiến trình kiểu twelve-factor không trạng thái và không chia sẻ gì. Dữ liệu cần giữ lâu phải nằm trong một dịch vụ có trạng thái, thường là cơ sở dữ liệu.” Trang này cũng nói sticky session “không bao giờ nên dùng hay dựa vào”.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Đưa trạng thái ra ngoài: một bảng idempotency cho mọi bản</h3>
<p>Cách sửa giữ <em>nguyên luật</em> của bài 5.1 (400 thiếu khoá · 422 cùng khoá khác body · 409 đang xử lý · phát lại với <code>Idempotent-Replayed: true</code>) và chỉ đổi <em>nơi</em> giữ khoá: một bảng PostgreSQL mà mọi bản cùng dùng. Phần quan trọng là câu lệnh đầu tiên trong đoạn code dưới đây — lệnh giành khoá.</p>
<p>Nếu hai bản nhận cùng một khoá cùng lúc, cả hai chạy câu lệnh này, khoá chính <code>(scope, key)</code> chỉ cho đúng một dòng vào, và chỉ bản đó nhận lại một dòng. Bản kia đọc dòng đã có rồi phát lại hoặc trả 409. Không có khe hở “kiểm trước, chèn sau” để cả hai cùng thắng.</p>
<pre><code class="language-javascript">// idempotency-pg.js (rút gọn) — CÙNG luật bài 5.1, bảng khoá nằm trong PostgreSQL dùng chung
const won = await pool.query(&#96;INSERT INTO idempotency_keys (scope, key, fp, state) VALUES ($1, $2, $3, 'running')
  ON CONFLICT DO NOTHING RETURNING 1&#96;, [scope, key, fp]);
if (won.rowCount === 0) {                                  // khoá đã có — ở instance này hay instance khác
  const { rows: [e] } = await pool.query('SELECT * FROM idempotency_keys WHERE scope = $1 AND key = $2', [scope, key]);
  if (e.fp !== fp) throw new HttpError(422, 'IDEMPOTENCY_KEY_REUSED');
  if (e.state === 'running') { res.set('Retry-After', '1'); throw new HttpError(409, 'IDEMPOTENCY_IN_PROGRESS'); }
  res.set('Idempotent-Replayed', 'true');
  return res.status(e.status).json(e.body);                // phát lại đúng câu trả lời đã lưu
}
// thắng ⇒ chạy handler; khi response xong: 2xx ⇒ UPDATE state = 'done' + lưu status/body; lỗi ⇒ DELETE để cho thử lại</code></pre>
<p><code>idempotency.js</code> xuất bản này khi <code>LABFLOW_IDEMPOTENCY=pg</code>, nên các route không đổi. Cùng hai request, hai bản mới khởi động:</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - http://localhost:8080/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" -H 'Idempotency-Key: dat-phong-lan-01' --json '{"labId":"lab_3","period":{"start":"2027-04-20T08:00:00+07:00","end":"2027-04-20T10:00:00+07:00"}}' | grep -iE '^(HTTP|LabFlow-Instance|Location|Idempotent-Replayed)|"id"' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created labflow-instance: B location: /v2/bookings/bk_1   "id": "bk_1",
HTTP/1.1 201 Created labflow-instance: A idempotent-replayed: true location: /v2/bookings/bk_1   "id": "bk_1",</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null http://localhost:8080/v2/bookings/bk_1 -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|LabFlow-Instance)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">HTTP/1.1 200 OK labflow-instance: B
HTTP/1.1 404 Not Found labflow-instance: A</div>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -Atc "SELECT scope, key, state, status, body-&gt;&gt;'id' FROM idempotency_keys"</code></pre>
<div class="out">usr_3|dat-phong-lan-01|done|201|bk_1</div>
<ul>
  <li>B tạo <code>bk_1</code>; A trả lời lần gửi lại bằng 201 <strong>đã lưu</strong> kèm <code>Idempotent-Replayed: true</code>. Một lượt đặt. ✓</li>
  <li>Nhưng <code>GET /v2/bookings/bk_1</code> vẫn 404 ở A: bản thân lượt đặt vẫn nằm trong RAM của B. Idempotency đã sửa; dữ liệu chờ Chương 12. Số liệu trung thực hơn một bản demo giấu chuyện đó.</li>
  <li>Dòng trong PostgreSQL là bộ nhớ chung mà giờ hai bản cùng đồng ý.</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — “kiểm xem khoá có chưa, rồi chèn” bằng hai câu truy vấn.</strong> Giữa SELECT và INSERT, một bản khác có thể làm y hệt, và cả hai đi tiếp. Để CSDL quyết định trong một câu lệnh (khoá duy nhất + <code>ON CONFLICT</code>), hoặc dùng transaction với khoá phù hợp.</p></div>

<h3>Sao không dùng sticky session?</h3>
<p><strong>Sticky session</strong> bắt bộ cân bằng tải luôn gửi một người dùng tới cùng một bản, nên trạng thái trong RAM “có vẻ chạy” — cho tới khi bản đó khởi động lại (mỗi lần deploy) và người dùng của nó mất trạng thái, hay một lớp 40 sinh viên chung một IP của trường ghim chặt một bản trong khi bản kia ngồi chơi. Nó cũng không ngăn được cô Lan và An, ở hai bản khác nhau, đặt cùng một phòng. Token, dữ liệu dùng chung và khoá idempotency làm nó trở nên thừa.</p>

<h3>Khi một bản chết</h3>
<p>Tắt B rồi tiếp tục gửi qua bộ cân bằng tải:</p>
<pre><code class="language-bash">kill $(lsof -ti tcp:4002 -sTCP:LISTEN)</code></pre>
<pre><code class="language-bash">for i in 1 2 3 4; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8080/v2/labs; done; echo</code></pre>
<div class="out">502 200 502 200 </div>
<p>Một nửa số request hỏng với <code>502 Bad Gateway</code>: bộ cân bằng tải ngây thơ vẫn gửi tới bản đã chết. Bộ cân bằng tải thật làm hai việc, và cả hai đều chạm tới hợp đồng API:</p>
<ul>
  <li><strong>Kiểm tra sức khoẻ</strong>: vài giây gọi một endpoint; bản nào hỏng thì thôi gửi (<code>/ready</code> của LabFlow, 8.6).</li>
  <li><strong>Thử lại</strong> sang bản khác — chỉ khi lặp lại an toàn: <code>GET</code> (1.2), hoặc <code>POST</code> có <code>Idempotency-Key</code> dựa trên bảng dùng chung ở trên. Bản đã chết có thể đã ghi xong.</li>
</ul>

<h3>Bảng kiểm mở rộng ngang cho hợp đồng</h3>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">1</span><span class="lz-nbody"><span class="lz-ntitle">Token, không phải phiên trong RAM</span><span class="lz-nsub">bản nào cũng kiểm được JWT; khoá bí mật là cấu hình dùng chung</span></span></div>
    <div class="lz-node"><span class="lz-badge">2</span><span class="lz-nbody"><span class="lz-ntitle">Id không thể trùng</span><span class="lz-nsub">lấy từ CSDL hoặc ngẫu nhiên — không bao giờ “bộ đếm + 1” trong một tiến trình</span></span></div>
    <div class="lz-node"><span class="lz-badge">3</span><span class="lz-nbody"><span class="lz-ntitle">Mọi lệnh ghi gửi lại được</span><span class="lz-nsub">Idempotency-Key với kho dùng chung, giành khoá nguyên tử</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">4</span><span class="lz-nbody"><span class="lz-ntitle">Giới hạn đếm một lần</span><span class="lz-nsub">bộ đếm dùng chung hoặc ở gateway — giới hạn ghi trong tài liệu phải là giới hạn thật</span></span></div>
    <div class="lz-node"><span class="lz-badge">5</span><span class="lz-nbody"><span class="lz-ntitle">Cursor bản nào cũng đọc được</span><span class="lz-nsub">cursor tự mang vị trí của nó (3.2), không trỏ vào bộ nhớ một tiến trình</span></span></div>
    <div class="lz-node"><span class="lz-badge">6</span><span class="lz-nbody"><span class="lz-ntitle">Tệp ở object storage</span><span class="lz-nsub">tệp tải lên không bao giờ nằm trên đĩa của một bản</span></span></div>
  </div>
</div>
<p>Thuật toán cân bằng tải, tự co giãn (autoscaling) và các giai đoạn đi từ một server lên nhiều server nằm ở khoá <em>System Design</em> (chương 2) trên Courses.</p>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Muốn chạy API trên nhiều server thì phải đổi gì?”</strong> Đưa mọi trạng thái dùng chung ra khỏi tiến trình: dữ liệu, cách sinh id, bộ đếm giới hạn, khoá idempotency. Ở đây: bốn chỗ hỏng, một nguyên nhân.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy A, B và proxy. Tái hiện hai <code>bk_1</code> và 8/8 lượt đặt. Giải thích mỗi chuyện bằng một câu.</li>
  <li>Chuyển sang <code>LABFLOW_IDEMPOTENCY=pg</code> rồi gửi cùng một khoá tới A và B <em>cùng lúc</em> (hai lệnh curl với <code>&amp;</code>). Bao nhiêu 201, bao nhiêu 409?</li>
  <li>Sửa <code>proxy-rr.mjs</code>: gặp lỗi kết nối thì bỏ qua bản đó 5 giây, và gửi lại request một lần sang bản kia <em>chỉ khi phương thức là GET</em>. Cho thấy các 502 biến mất.</li>
</ol>
<p><strong>Xong khi:</strong> bạn nói được trạng thái nào của LabFlow vẫn còn riêng từng bản và mỗi thứ nên nằm ở đâu.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Scale out (mở rộng ngang)</span><span class="v">Chạy thêm bản sao của dịch vụ thay vì mua máy to hơn.</span></div>
  <div class="kv"><span class="k">Load balancer (cân bằng tải)</span><span class="v">Chia request cho các bản (chia lần lượt và các cách khác).</span></div>
  <div class="kv"><span class="k">Stateless (không trạng thái)</span><span class="v">Bản nào cũng trả lời được request nào; trạng thái chung nằm ngoài tiến trình.</span></div>
  <div class="kv"><span class="k">Sticky session</span><span class="v">Bộ cân bằng tải ghim một người dùng vào một bản.</span></div>
  <div class="kv"><span class="k">Giành khoá nguyên tử</span><span class="v">Một câu lệnh chỉ cho đúng một bên thắng (INSERT … ON CONFLICT).</span></div>
  <div class="kv"><span class="k">502 Bad Gateway</span><span class="v">Proxy không nhận được câu trả lời hợp lệ từ bản phía sau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Hai bản sau bộ chia lần lượt: JWT vẫn chạy (không trạng thái); dữ liệu, bộ đếm id, giới hạn tần suất và idempotency hỏng — tất cả là trạng thái trong RAM của một tiến trình.</li>
  <li>Đo được: lượt đặt chỉ thấy ở một bản, hai <code>bk_1</code> khác nhau, 8/8 lượt đặt vượt giới hạn 5, và cùng Idempotency-Key cho hai 201.</li>
  <li>Bảng PostgreSQL dùng chung với <code>INSERT … ON CONFLICT DO NOTHING</code> sửa được idempotency: request thứ hai được phát lại. Dữ liệu vẫn riêng từng bản cho tới Chương 12.</li>
  <li>Sticky session giấu vấn đề; kiểm tra sức khoẻ và thử lại an toàn phụ thuộc hợp đồng (GET, khoá idempotency).</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 8.4 — Cookie, CSRF, thu hồi phiên và chặn dò mật khẩu</span><span class="lc-sub">Khoá Node.js dựng đúng phần này vào một API thật và đo nó. Giống: bộ đếm nằm trong RAM của một tiến trình thôi là giới hạn khi có hai bản chạy. Ở đó học thêm: chính bộ chặn đăng nhập (một Map khoá theo IP + email, 429 + Retry-After, trust proxy), và thu hồi bằng tokenVersion. Bài này có thứ bài kia không có: hai bản chạy sau round-robin, đo thật: 8 trên 8 lượt đặt vượt giới hạn 5, và cách sửa bằng bộ đếm dùng chung.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Availability in the contract (1/2): SLOs, error budgets and load shedding|||8.5 — Tính sẵn sàng trong hợp đồng (1/2): SLO, ngân sách lỗi và bỏ bớt tải',
      slug: 'api-8-4-kha-dung',
      type: 'LESSON',
      isFreePreview: true,
      description: 'SLI/SLO/SLA, ngân sách lỗi đổi ra phút, phụ thuộc nối tiếp nhân với nhau; đo SLI như người dùng; sụp vì nghẽn (goodput 136 → 12/s, 13 s việc bỏ rơi); bỏ bớt tải 503 + Retry-After (123/s, 64 ms); 429 hay 503.',
      content: `${G085}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Availability in the contract (1/2): SLOs, error budgets and load shedding</h2>
<p class="lead">Every system fails sometimes: a database restarts, a deploy goes wrong, 2,000 students arrive in the same ten seconds. Users do not judge you by whether it fails, but by <em>how</em>: a clear “try again in 1 second”, a list that is 2 seconds old and says so, or a spinner that never ends. This lesson defines what “up” means for LabFlow, measures it like a user, and then measures what overload does — and how a fast 503 fixes it. Lesson 8.6 handles a broken database.</p>

<h3>SLI, SLO, SLA — three words, one idea</h3>
<ul>
  <li><strong>SLI</strong> (indicator) — a number you measure. LabFlow’s: “share of <code>GET /v2/labs</code> requests that returned 2xx in under 300 ms”.</li>
  <li><strong>SLO</strong> (objective) — the target for that number over a window. “99.9% over 30 days.”</li>
  <li><strong>SLA</strong> (agreement) — an SLO written in a contract with a consequence (refunds, penalties). A school project has SLOs, not SLAs.</li>
</ul>
<p>The other side of an SLO is the <strong>error budget</strong>: 99.9% means 0.1% of the time may be bad. That budget is spent on outages, risky deploys and maintenance. <code>perf/budget.mjs</code> turns targets into minutes:</p>
<pre><code class="language-bash">node perf/budget.mjs</code></pre>
<div class="out">SLO       hỏng tối đa / 30 ngày   / tuần        lỗi được phép trên 1 triệu request
99        7.2 giờ                 1.7 giờ       10000
99.5      3.6 giờ                 50.4 phút     5000
99.9      43.2 phút               10.1 phút     1000
99.95     21.6 phút               5.0 phút      500
99.99     4.3 phút                1.0 phút      100

Nối tiếp load balancer 99.99% × LabFlow (2 bản) 99.95% × PostgreSQL 99.95% × email provider 99.9%
  = 99.790%  ⇒ 1.5 giờ hỏng mỗi 30 ngày — thấp hơn MỌI thành phần
Bỏ email ra khỏi đường đồng bộ (gửi sau qua hàng đợi): 99.890% ⇒ 47.5 phút</div>
<p>Two lessons from the output. Each extra “9” cuts the budget by ten — 99.99% leaves 4.3 minutes a month, less than one slow deploy. And availabilities in a chain <strong>multiply</strong>: a booking that synchronously needs the balancer, LabFlow, PostgreSQL and an e-mail provider can only be up 99.79% of the time — 1.5 hours a month, worse than any single part. Sending the e-mail later from a queue (Chapter 10) takes it off the path and wins back about 43 minutes a month.</p>
<a class="link-card" href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google SRE book — Service Level Objectives (read 1 Nov 2026)</span><span class="lc-sub">Defines SLI (a quantitative measure of service), SLO (a target value or range for an SLI) and SLA (an agreement with consequences); describes the error budget as the allowed rate of missing the SLO, used to decide how fast to release.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Measuring an SLI the way a user sees it</h3>
<p>Server logs miss requests that never reached the server. So measure from outside, like a status page does: <code>perf/probe.mjs</code> asks for the lab list every 100 ms with a 1-second timeout and counts a request as good only if it was 2xx <em>and</em> under 300 ms:</p>
<pre><code class="language-javascript">// perf/probe.mjs — bài 8.4: "người dùng giả" đo SLI như một trang trạng thái
// Cứ 100 ms gọi GET /v2/labs (timeout 1 s). Request TỐT = mã 2xx VÀ nhanh hơn 300 ms.
const URL_ = process.env.URL ?? 'http://localhost:4000/v2/labs';
const SECONDS = Number(process.env.SECONDS ?? 30);
const SLO = Number(process.env.SLO ?? 99.9);
let good = 0, total = 0;
const codes = {};
const end = Date.now() + SECONDS * 1000;
while (Date.now() &lt; end) {
  const a = performance.now();
  let status = 'timeout';
  try { const r = await fetch(URL_, { signal: AbortSignal.timeout(1000) }); await r.text(); status = r.status; } catch { /* timeout / mạng */ }
  const ms = performance.now() - a;
  total++;
  codes[status] = (codes[status] ?? 0) + 1;
  if (typeof status === 'number' &amp;&amp; status &lt; 300 &amp;&amp; ms &lt; 300) good++;
  await new Promise((r) =&gt; setTimeout(r, 100));
}
const sli = (100 * good) / total;
console.log(&#96;\${total} request · tốt \${good} · mã \${JSON.stringify(codes)}&#96;);
console.log(&#96;SLI (2xx và &lt; 300 ms): \${sli.toFixed(2)}% · SLO \${SLO}% ⇒ \${sli &gt;= SLO ? 'ĐẠT' : 'TRƯỢT'}&#96;);
const budget = 30 * 24 * 60 * (1 - SLO / 100);                // phút được phép hỏng mỗi 30 ngày
const used = (SECONDS / 60) * (1 - sli / 100);                // phút "hỏng" trong lần đo này
console.log(&#96;Ngân sách lỗi 30 ngày ở SLO \${SLO}%: \${budget.toFixed(1)} phút · lần đo này đã dùng \${used.toFixed(2)} phút (\${((100 * used) / budget).toFixed(1)}%)&#96;);</code></pre>
<p>Started against LabFlow with <code>LABFLOW_OUTAGE_MS=3000</code> (Chapter 5’s simulated outage: the first 3 seconds answer 503):</p>
<pre><code class="language-bash">SECONDS=30 node perf/probe.mjs</code></pre>
<div class="out">291 request · tốt 262 · mã {"200":262,"503":29}
SLI (2xx và &lt; 300 ms): 90.03% · SLO 99.9% ⇒ TRƯỢT
Ngân sách lỗi 30 ngày ở SLO 99.9%: 43.2 phút · lần đo này đã dùng 0.05 phút (0.1%)</div>
<p>Over this 30-second window the SLI is 90% — a missed SLO. Over 30 days the same 3 seconds are 0.1% of the budget. The window matters as much as the target: SLOs are judged over days, alerts fire when the budget burns <em>fast</em>.</p>

<h3>Overload: when everyone waits, nobody is served</h3>
<p>Back to 07:00. The async scrypt of 8.2 handles ~120 logins/s. What happens with more people than that? <code>perf/shed.mjs</code> simulates N students pressing “Log in” again and again; each gives up after 1 second (a typical app timeout). It counts what each user <em>experiences</em>: a real answer, a quick refusal, or a timeout — and finally times one more login right after the load stops:</p>
<pre><code class="language-javascript">// perf/shed.mjs (rút gọn) — CONC người cùng bấm đăng nhập, mỗi người chờ tối đa TIMEOUT ms
const r = await fetch(&#96;\${BASE}/v2/auth/login&#96;, { method: 'POST', body, headers, signal: AbortSignal.timeout(TIMEOUT) });
if (r.status === 503) { shed.push(ms); await sleep(1000 * Number(r.headers.get('retry-after') ?? 1)); }   // bị từ chối ⇒ làm theo Retry-After
else answered.push(ms);                                     // 401/200: có câu trả lời thật
// catch ⇒ timeout: người dùng bỏ cuộc — nhưng server VẪN tính scrypt cho request đó</code></pre>
<pre><code class="language-bash">CONC=100 node perf/shed.mjs</code></pre>
<div class="out">100 người, 10 s, chờ tối đa 1000 ms
  có câu trả lời :  1360  (136.0/s) · p50 786 ms · p99 821 ms
  bị từ chối 503 :     0  · p50 — (rồi chờ Retry-After)
  bỏ cuộc (timeout):   0  ⇒ server vẫn làm 0 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 32 ms</div>
<pre><code class="language-bash">CONC=200 node perf/shed.mjs</code></pre>
<div class="out">200 người, 10 s, chờ tối đa 1000 ms
  có câu trả lời :   116  (11.6/s) · p50 561 ms · p99 987 ms
  bị từ chối 503 :     0  · p50 — (rồi chờ Retry-After)
  bỏ cuộc (timeout): 1990  ⇒ server vẫn làm 1990 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 12977 ms</div>
<p>With 100 users everyone waits ~790 ms, but answers arrive. With 200 the system <strong>collapses</strong>:</p>
<ul>
  <li>Only <strong>12 answers per second</strong> reach a user who is still waiting, down from 136. The server is just as busy — it is busy with the wrong requests.</li>
  <li>1,990 requests timed out. The server cannot know the client gave up, so it still computed scrypt for every one of them.</li>
  <li>After the test stopped, Lan’s login took <strong>13 seconds</strong>: the server was still working through the queue of abandoned requests. In real life those users press “Log in” again, and the queue never drains.</li>
</ul>
<p>This is <strong>congestion collapse</strong>: <em>throughput</em> (work done) stays high while <em>goodput</em> (work someone receives in time) falls towards zero.</p>
<a class="link-card" href="https://builder.aws.com/content/3Eun1EEyX6p2e3VYNyRLSJzLuMV/using-load-shedding-to-avoid-overload" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Amazon Builders’ Library — Using load shedding to avoid overload (2019, read 1 Nov 2026)</span><span class="lc-sub">Goodput is the part of throughput handled without error and in time; when latency passes the client timeout, the server’s work on that request is wasted, and retries amplify the load. Recommends rejecting excess work early and cheaply.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Load shedding: say “no” quickly</h3>
<p>If the server can finish ~120 logins a second, accepting the 121st only makes everyone late. Better: keep at most N logins in progress and answer the rest <em>immediately</em> with <code>503</code> and <code>Retry-After</code>. Rejecting costs microseconds; the accepted ones stay fast.</p>
<pre><code class="language-javascript">// resilience.js — quá max request ĐANG XỬ LÝ cùng lúc ⇒ 503 + Retry-After ngay
export function limitInflight(max) {
  let inflight = 0;
  return (req, res, next) =&gt; {
    if (inflight &gt;= max) {
      res.set('Retry-After', '1');
      throw new HttpError(503, 'OVERLOADED', { max });
    }
    inflight++;
    res.once('close', () =&gt; { inflight--; });             // xong, lỗi hay client cắt kết nối đều trả chỗ
    next();
  };
}
// routes/auth.js — đặt TRƯỚC giới hạn đăng nhập: bị từ chối thì không tốn lượt của người dùng
.post(...shed, loginLimit, validate('body', Login), async (req, res) =&gt; { … })</code></pre>
<p>N = 8: four threadpool threads × 2, so a thread never waits for work but the queue never grows. What a rejected client sees:</p>
<pre><code class="language-bash">for i in 1 2 3; do curl -s -o /dev/null -w '%{http_code} ' -X POST http://localhost:4000/v2/auth/login --json "{\\"email\\":\\"sv$i@student.labflow.example\\",\\"password\\":\\"x\\"}" &amp; done; wait; echo</code></pre>
<div class="out">503 503 401 </div>
<pre><code class="language-bash">curl -s -o /dev/null -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"a@student.labflow.example","password":"x"}' &amp; sleep 0.01; curl -s -i -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"b@student.labflow.example","password":"x"}' | grep -vE '^(Date|Connection|Keep-Alive|Vary|Server-Timing|Content-Length|ETag|LabFlow-Version|Content-Language)'; wait</code></pre>
<div class="out">HTTP/1.1 503 Service Unavailable
Retry-After: 1
Content-Type: application/problem+json; charset=utf-8

{
  "type": "https://labflow.example/problems/overloaded",
  "title": "Máy chủ đang quá tải",
  "status": 503,
  "detail": "Đang xử lý tối đa 1 yêu cầu loại này; thử lại sau Retry-After giây",
  "instance": "/v2/auth/login",
  "code": "OVERLOADED"
}</div>
<p>Now the same two tests with <code>LABFLOW_LOGIN_MAX_INFLIGHT=8</code>:</p>
<pre><code class="language-bash">CONC=100 node perf/shed.mjs</code></pre>
<div class="out">100 người, 10 s, chờ tối đa 1000 ms
  có câu trả lời :  1268  (126.8/s) · p50 63 ms · p99 71 ms
  bị từ chối 503 :   920  · p50 3 ms (rồi chờ Retry-After)
  bỏ cuộc (timeout):   0  ⇒ server vẫn làm 0 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 35 ms</div>
<pre><code class="language-bash">CONC=200 node perf/shed.mjs</code></pre>
<div class="out">200 người, 10 s, chờ tối đa 1000 ms
  có câu trả lời :  1226  (122.6/s) · p50 64 ms · p99 110 ms
  bị từ chối 503 :  1920  · p50 7 ms (rồi chờ Retry-After)
  bỏ cuộc (timeout):   0  ⇒ server vẫn làm 0 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 33 ms</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Goodput at 200 users · 12/s → 123/s</span><span class="lz-lnote">ten times more people actually logged in</span></div>
  <div class="lz-layer"><span class="lz-lname">Accepted logins (100 users) · p50 786 ms → 63 ms</span><span class="lz-lnote">no queue in front of them</span></div>
  <div class="lz-layer"><span class="lz-lname">Rejected · answered in 3–7 ms</span><span class="lz-lnote">with Retry-After: 1 — the app waits and tries again instead of hanging</span></div>
  <div class="lz-layer"><span class="lz-lname">After the load · 13 s → 33 ms</span><span class="lz-lnote">no abandoned work left behind</span></div>
</div>
<p>One run during heavy machine load gave 65.7 answered logins/s instead of ~123; repeated runs gave 120–126. Report the spread, not the best run.</p>
<div class="pitfall"><p><strong>Trap — shedding work that never waits.</strong> <code>limitInflight</code> counts requests that are <em>waiting</em> on something (the threadpool, a database). A handler that burns CPU synchronously holds the event loop, so the counter never sees a second request in flight and sheds nothing — Lab 8 measures exactly this. Fix blocking first (8.2), then shed.</p></div>
<p><strong>429 or 503?</strong> Both can carry <code>Retry-After</code>. <code>429 Too Many Requests</code> says “<em>you</em> are over <em>your</em> quota” (5.3) — another client would be served. <code>503 Service Unavailable</code> says “the <em>service</em> cannot take this right now, for anyone”. Using the right one tells the client whether slowing down personally will help.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html#name-503-service-unavailable" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9110 §15.6.4 503 Service Unavailable and §10.2.3 Retry-After (read 1 Nov 2026)</span><span class="lc-sub">503 means the server is temporarily unable to handle the request because of overload or maintenance, likely to be alleviated after some delay; the server MAY send Retry-After (seconds or an HTTP date) to say how long the client should wait.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“What is an error budget?”</strong> 100% minus the SLO, over a window. At 99.9% for 30 days: 43 minutes. Spend it on deploys and incidents; when it is gone, slow down releases.</li>
  <li><strong>“Your server is overloaded. What do you do?”</strong> Shed early and cheaply with 503 + Retry-After. Measured: goodput 12/s → 123/s at 200 users, and no abandoned work after the peak.</li>
  <li><strong>“429 or 503?”</strong> 429: this client is over its quota. 503: the service cannot take it now, for anyone. Both with Retry-After.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Reproduce the collapse with <code>CONC=200</code>, then the fix with <code>LABFLOW_LOGIN_MAX_INFLIGHT</code> = 4, 8, 16, 64. Which value gives the most answered logins on your machine, and why does 64 behave like no limit?</li>
  <li>Make <code>probe.mjs</code> also print p99, and run it against the lab list while <code>perf/shed.mjs</code> runs with and without shedding. Does the lab list keep its SLO in both cases?</li>
  <li>Write LabFlow’s SLOs for three endpoint groups (lab list, booking, login) with a window and an error budget in minutes.</li>
</ol>
<p><strong>Done when:</strong> you can explain, with your numbers, why accepting fewer requests got more people logged in.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SLI / SLO / SLA</span><span class="v">What you measure / the target / a contract with consequences.</span></div>
  <div class="kv"><span class="k">Error budget</span><span class="v">How much may go wrong in the window: 100% − SLO.</span></div>
  <div class="kv"><span class="k">Congestion collapse</span><span class="v">The server stays busy but almost nothing reaches users in time.</span></div>
  <div class="kv"><span class="k">Goodput</span><span class="v">Work delivered to a client that is still waiting for it.</span></div>
  <div class="kv"><span class="k">Load shedding</span><span class="v">Rejecting excess work early (503 + Retry-After) to keep accepted work fast.</span></div>
  <div class="kv"><span class="k">Retry-After</span><span class="v">Header on 503/429: how many seconds to wait before trying again.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>SLO 99.9% = 43.2 minutes of budget per 30 days; dependencies in a chain multiply (four parts → 99.79%, 1.5 hours).</li>
  <li>A probe that acts like a user measured a 3-second outage as 90% over 30 s — and 0.1% of a 30-day budget.</li>
  <li>Without shedding, 200 users cut goodput from 136/s to 12/s and left 13 s of abandoned work.</li>
  <li><code>limitInflight(8)</code> + 503 + Retry-After: 123 logins/s answered in ~64 ms, refusals in milliseconds — but only work that waits can be shed.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Tính sẵn sàng trong hợp đồng (1/2): SLO, ngân sách lỗi và bỏ bớt tải</h2>
<p class="lead">Hệ thống nào rồi cũng có lúc hỏng: CSDL khởi động lại, một lần deploy lỗi, 2.000 sinh viên cùng tới trong mười giây. Người dùng không chấm bạn theo chuyện có hỏng hay không, mà theo <em>hỏng ra sao</em>: một câu rõ ràng “thử lại sau 1 giây”, một danh sách cũ 2 giây và nói rõ điều đó, hay một vòng xoay không bao giờ dừng. Bài này định nghĩa “đang chạy” nghĩa là gì với LabFlow, đo nó như một người dùng, rồi đo xem quá tải làm gì — và một câu 503 trả lời nhanh sửa nó ra sao. Bài 8.6 lo chuyện CSDL hỏng.</p>

<h3>SLI, SLO, SLA — ba chữ, một ý</h3>
<ul>
  <li><strong>SLI</strong> (chỉ số) — một con số bạn đo. Của LabFlow: “tỉ lệ request <code>GET /v2/labs</code> trả 2xx trong dưới 300 ms”.</li>
  <li><strong>SLO</strong> (mục tiêu) — mức cần đạt của con số đó trong một khoảng thời gian. “99,9% trong 30 ngày.”</li>
  <li><strong>SLA</strong> (thoả thuận) — một SLO ghi vào hợp đồng, kèm hậu quả (hoàn tiền, phạt). Đồ án ở trường có SLO, không có SLA.</li>
</ul>
<p>Mặt kia của SLO là <strong>ngân sách lỗi</strong> (error budget): 99,9% nghĩa là 0,1% thời gian được phép tệ. Ngân sách đó tiêu vào sự cố, những lần deploy mạo hiểm và bảo trì. <code>perf/budget.mjs</code> đổi mục tiêu ra phút:</p>
<pre><code class="language-bash">node perf/budget.mjs</code></pre>
<div class="out">SLO       hỏng tối đa / 30 ngày   / tuần        lỗi được phép trên 1 triệu request
99        7.2 giờ                 1.7 giờ       10000
99.5      3.6 giờ                 50.4 phút     5000
99.9      43.2 phút               10.1 phút     1000
99.95     21.6 phút               5.0 phút      500
99.99     4.3 phút                1.0 phút      100

Nối tiếp load balancer 99.99% × LabFlow (2 bản) 99.95% × PostgreSQL 99.95% × email provider 99.9%
  = 99.790%  ⇒ 1.5 giờ hỏng mỗi 30 ngày — thấp hơn MỌI thành phần
Bỏ email ra khỏi đường đồng bộ (gửi sau qua hàng đợi): 99.890% ⇒ 47.5 phút</div>
<p>Hai bài học từ output. Mỗi chữ “9” thêm vào cắt ngân sách đi mười lần — 99,99% chỉ còn 4,3 phút mỗi tháng, chưa đủ cho một lần deploy chậm. Và tính sẵn sàng nối tiếp nhau thì <strong>nhân với nhau</strong>: một lượt đặt phòng cần ĐỒNG BỘ cả bộ cân bằng tải, LabFlow, PostgreSQL và nhà cung cấp email thì chỉ chạy được 99,79% thời gian — 1,5 giờ hỏng mỗi tháng, tệ hơn mọi thành phần. Gửi email sau qua hàng đợi (Chương 10) đưa nó ra khỏi đường đi và lấy lại khoảng 43 phút mỗi tháng.</p>
<a class="link-card" href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google SRE book — Service Level Objectives (đọc ngày 1/11/2026)</span><span class="lc-sub">Định nghĩa SLI (thước đo định lượng một mặt của dịch vụ), SLO (giá trị hay khoảng mục tiêu cho một SLI) và SLA (thoả thuận có hậu quả); mô tả ngân sách lỗi là mức được phép trượt SLO, dùng để quyết định phát hành nhanh hay chậm.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Đo SLI theo cách người dùng thấy</h3>
<p>Log của server bỏ sót những request không bao giờ tới được server. Vì thế hãy đo từ bên ngoài, như trang trạng thái vẫn làm: <code>perf/probe.mjs</code> cứ 100 ms xin danh sách phòng một lần, chờ tối đa 1 giây, và chỉ tính là tốt khi request trả 2xx <em>và</em> dưới 300 ms:</p>
<pre><code class="language-javascript">// perf/probe.mjs — bài 8.4: "người dùng giả" đo SLI như một trang trạng thái
// Cứ 100 ms gọi GET /v2/labs (timeout 1 s). Request TỐT = mã 2xx VÀ nhanh hơn 300 ms.
const URL_ = process.env.URL ?? 'http://localhost:4000/v2/labs';
const SECONDS = Number(process.env.SECONDS ?? 30);
const SLO = Number(process.env.SLO ?? 99.9);
let good = 0, total = 0;
const codes = {};
const end = Date.now() + SECONDS * 1000;
while (Date.now() &lt; end) {
  const a = performance.now();
  let status = 'timeout';
  try { const r = await fetch(URL_, { signal: AbortSignal.timeout(1000) }); await r.text(); status = r.status; } catch { /* timeout / mạng */ }
  const ms = performance.now() - a;
  total++;
  codes[status] = (codes[status] ?? 0) + 1;
  if (typeof status === 'number' &amp;&amp; status &lt; 300 &amp;&amp; ms &lt; 300) good++;
  await new Promise((r) =&gt; setTimeout(r, 100));
}
const sli = (100 * good) / total;
console.log(&#96;\${total} request · tốt \${good} · mã \${JSON.stringify(codes)}&#96;);
console.log(&#96;SLI (2xx và &lt; 300 ms): \${sli.toFixed(2)}% · SLO \${SLO}% ⇒ \${sli &gt;= SLO ? 'ĐẠT' : 'TRƯỢT'}&#96;);
const budget = 30 * 24 * 60 * (1 - SLO / 100);                // phút được phép hỏng mỗi 30 ngày
const used = (SECONDS / 60) * (1 - sli / 100);                // phút "hỏng" trong lần đo này
console.log(&#96;Ngân sách lỗi 30 ngày ở SLO \${SLO}%: \${budget.toFixed(1)} phút · lần đo này đã dùng \${used.toFixed(2)} phút (\${((100 * used) / budget).toFixed(1)}%)&#96;);</code></pre>
<p>Chạy với LabFlow đặt <code>LABFLOW_OUTAGE_MS=3000</code> (sự cố giả lập của Chương 5: 3 giây đầu trả 503):</p>
<pre><code class="language-bash">SECONDS=30 node perf/probe.mjs</code></pre>
<div class="out">291 request · tốt 262 · mã {"200":262,"503":29}
SLI (2xx và &lt; 300 ms): 90.03% · SLO 99.9% ⇒ TRƯỢT
Ngân sách lỗi 30 ngày ở SLO 99.9%: 43.2 phút · lần đo này đã dùng 0.05 phút (0.1%)</div>
<p>Trong khung 30 giây này SLI là 90% — trượt SLO. Trong 30 ngày, cũng 3 giây đó chỉ là 0,1% ngân sách. Khung thời gian quan trọng ngang mục tiêu: SLO được chấm theo ngày, còn cảnh báo bật khi ngân sách cháy <em>nhanh</em>.</p>

<h3>Quá tải: khi ai cũng chờ, không ai được phục vụ</h3>
<p>Quay lại 07:00. scrypt bất đồng bộ của bài 8.2 xử lý ~120 lượt đăng nhập mỗi giây. Đông hơn thế thì sao? <code>perf/shed.mjs</code> giả lập N sinh viên bấm “Đăng nhập” liên tục; mỗi bạn bỏ cuộc sau 1 giây (mức timeout hay gặp của app). Nó đếm thứ mỗi người <em>gặp phải</em>: một câu trả lời thật, một lời từ chối nhanh, hay hết giờ chờ — và cuối cùng bấm giờ thêm một lượt đăng nhập ngay khi tải dừng:</p>
<pre><code class="language-javascript">// perf/shed.mjs (rút gọn) — CONC người cùng bấm đăng nhập, mỗi người chờ tối đa TIMEOUT ms
const r = await fetch(&#96;\${BASE}/v2/auth/login&#96;, { method: 'POST', body, headers, signal: AbortSignal.timeout(TIMEOUT) });
if (r.status === 503) { shed.push(ms); await sleep(1000 * Number(r.headers.get('retry-after') ?? 1)); }   // bị từ chối ⇒ làm theo Retry-After
else answered.push(ms);                                     // 401/200: có câu trả lời thật
// catch ⇒ timeout: người dùng bỏ cuộc — nhưng server VẪN tính scrypt cho request đó</code></pre>
<pre><code class="language-bash">CONC=100 node perf/shed.mjs</code></pre>
<div class="out">100 người, 10 s, chờ tối đa 1000 ms
  có câu trả lời :  1360  (136.0/s) · p50 786 ms · p99 821 ms
  bị từ chối 503 :     0  · p50 — (rồi chờ Retry-After)
  bỏ cuộc (timeout):   0  ⇒ server vẫn làm 0 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 32 ms</div>
<pre><code class="language-bash">CONC=200 node perf/shed.mjs</code></pre>
<div class="out">200 người, 10 s, chờ tối đa 1000 ms
  có câu trả lời :   116  (11.6/s) · p50 561 ms · p99 987 ms
  bị từ chối 503 :     0  · p50 — (rồi chờ Retry-After)
  bỏ cuộc (timeout): 1990  ⇒ server vẫn làm 1990 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 12977 ms</div>
<p>Với 100 người, ai cũng chờ ~790 ms, nhưng câu trả lời vẫn tới. Với 200 người, hệ thống <strong>sụp</strong>:</p>
<ul>
  <li>Chỉ <strong>12 câu trả lời mỗi giây</strong> tới được người còn đang chờ, từ 136 tụt xuống. Server vẫn bận y như cũ — bận với những request không còn ai cần.</li>
  <li>1.990 request hết giờ chờ. Server không thể biết client đã bỏ đi, nên vẫn tính scrypt cho từng cái.</li>
  <li>Bài test dừng rồi, cô Lan đăng nhập vẫn mất <strong>13 giây</strong>: server còn đang cày hàng đợi của những request bị bỏ rơi. Ngoài đời những người đó lại bấm “Đăng nhập” lần nữa, và hàng đợi không bao giờ cạn.</li>
</ul>
<p>Đó là <strong>sụp vì nghẽn</strong> (congestion collapse): <em>thông lượng</em> (việc làm được) vẫn cao trong khi <em>goodput</em> (việc tới tay ai đó kịp lúc) tụt về gần 0.</p>
<a class="link-card" href="https://builder.aws.com/content/3Eun1EEyX6p2e3VYNyRLSJzLuMV/using-load-shedding-to-avoid-overload" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Amazon Builders’ Library — Using load shedding to avoid overload (2019, đọc ngày 1/11/2026)</span><span class="lc-sub">Goodput là phần thông lượng được xử lý không lỗi và kịp lúc; khi độ trễ vượt timeout của client, công server bỏ ra cho request đó thành phí, và việc thử lại khuếch đại tải. Khuyên từ chối phần dư sớm và rẻ.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Bỏ bớt tải: nói “không” thật nhanh</h3>
<p>Nếu server làm xong ~120 lượt đăng nhập mỗi giây, nhận thêm lượt thứ 121 chỉ khiến mọi người cùng trễ. Tốt hơn: giữ tối đa N lượt đang xử lý, phần còn lại trả <em>ngay</em> <code>503</code> kèm <code>Retry-After</code>. Từ chối tốn vài micro giây; những lượt được nhận vẫn nhanh.</p>
<pre><code class="language-javascript">// resilience.js — quá max request ĐANG XỬ LÝ cùng lúc ⇒ 503 + Retry-After ngay
export function limitInflight(max) {
  let inflight = 0;
  return (req, res, next) =&gt; {
    if (inflight &gt;= max) {
      res.set('Retry-After', '1');
      throw new HttpError(503, 'OVERLOADED', { max });
    }
    inflight++;
    res.once('close', () =&gt; { inflight--; });             // xong, lỗi hay client cắt kết nối đều trả chỗ
    next();
  };
}
// routes/auth.js — đặt TRƯỚC giới hạn đăng nhập: bị từ chối thì không tốn lượt của người dùng
.post(...shed, loginLimit, validate('body', Login), async (req, res) =&gt; { … })</code></pre>
<p>N = 8: bốn luồng threadpool × 2, để luồng không bao giờ ngồi chờ việc nhưng hàng đợi cũng không phình ra. Client bị từ chối thấy gì:</p>
<pre><code class="language-bash">for i in 1 2 3; do curl -s -o /dev/null -w '%{http_code} ' -X POST http://localhost:4000/v2/auth/login --json "{\\"email\\":\\"sv$i@student.labflow.example\\",\\"password\\":\\"x\\"}" &amp; done; wait; echo</code></pre>
<div class="out">503 503 401 </div>
<pre><code class="language-bash">curl -s -o /dev/null -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"a@student.labflow.example","password":"x"}' &amp; sleep 0.01; curl -s -i -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"b@student.labflow.example","password":"x"}' | grep -vE '^(Date|Connection|Keep-Alive|Vary|Server-Timing|Content-Length|ETag|LabFlow-Version|Content-Language)'; wait</code></pre>
<div class="out">HTTP/1.1 503 Service Unavailable
Retry-After: 1
Content-Type: application/problem+json; charset=utf-8

{
  "type": "https://labflow.example/problems/overloaded",
  "title": "Máy chủ đang quá tải",
  "status": 503,
  "detail": "Đang xử lý tối đa 1 yêu cầu loại này; thử lại sau Retry-After giây",
  "instance": "/v2/auth/login",
  "code": "OVERLOADED"
}</div>
<p>Giờ chạy lại hai bài test với <code>LABFLOW_LOGIN_MAX_INFLIGHT=8</code>:</p>
<pre><code class="language-bash">CONC=100 node perf/shed.mjs</code></pre>
<div class="out">100 người, 10 s, chờ tối đa 1000 ms
  có câu trả lời :  1268  (126.8/s) · p50 63 ms · p99 71 ms
  bị từ chối 503 :   920  · p50 3 ms (rồi chờ Retry-After)
  bỏ cuộc (timeout):   0  ⇒ server vẫn làm 0 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 35 ms</div>
<pre><code class="language-bash">CONC=200 node perf/shed.mjs</code></pre>
<div class="out">200 người, 10 s, chờ tối đa 1000 ms
  có câu trả lời :  1226  (122.6/s) · p50 64 ms · p99 110 ms
  bị từ chối 503 :  1920  · p50 7 ms (rồi chờ Retry-After)
  bỏ cuộc (timeout):   0  ⇒ server vẫn làm 0 lần scrypt không ai nhận
  tải đã dừng — cô Lan đăng nhập: 200 sau 33 ms</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Goodput với 200 người · 12/s → 123/s</span><span class="lz-lnote">số người thật sự đăng nhập được gấp mười</span></div>
  <div class="lz-layer"><span class="lz-lname">Lượt được nhận (100 người) · p50 786 ms → 63 ms</span><span class="lz-lnote">không còn hàng đợi phía trước</span></div>
  <div class="lz-layer"><span class="lz-lname">Lượt bị từ chối · trả lời trong 3–7 ms</span><span class="lz-lnote">kèm Retry-After: 1 — app chờ rồi thử lại thay vì treo</span></div>
  <div class="lz-layer"><span class="lz-lname">Sau đợt tải · 13 s → 33 ms</span><span class="lz-lnote">không để lại việc bị bỏ rơi nào</span></div>
</div>
<p>Một lần chạy lúc máy đang rất bận cho 65,7 lượt/giây thay vì ~123; các lần chạy lặp lại cho 120–126. Hãy báo khoảng dao động, đừng chỉ báo lần đẹp nhất.</p>
<div class="pitfall"><p><strong>Bẫy — bỏ bớt tải cho việc không bao giờ chờ.</strong> <code>limitInflight</code> đếm những request đang <em>chờ</em> một thứ gì đó (threadpool, CSDL). Handler đốt CPU đồng bộ thì giữ chặt event loop, nên bộ đếm không bao giờ thấy request thứ hai đang xử lý và chẳng từ chối gì — Lab 8 đo đúng chuyện này. Gỡ chặn trước (8.2), rồi mới bỏ bớt tải.</p></div>
<p><strong>429 hay 503?</strong> Cả hai đều có thể kèm <code>Retry-After</code>. <code>429 Too Many Requests</code> nói “<em>bạn</em> đã vượt hạn mức <em>của bạn</em>” (5.3) — client khác vẫn được phục vụ. <code>503 Service Unavailable</code> nói “<em>dịch vụ</em> lúc này không nhận được, với bất kỳ ai”. Dùng đúng mã cho client biết việc tự mình chậm lại có giúp được không.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html#name-503-service-unavailable" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9110 §15.6.4 503 Service Unavailable và §10.2.3 Retry-After (đọc ngày 1/11/2026)</span><span class="lc-sub">503 nghĩa là server tạm thời không xử lý được request vì quá tải hoặc bảo trì, nhiều khả năng sẽ ổn sau một lúc; server CÓ THỂ gửi Retry-After (số giây hoặc một mốc thời gian HTTP) để nói client nên chờ bao lâu.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Ngân sách lỗi là gì?”</strong> 100% trừ SLO, trong một khoảng thời gian. 99,9% trong 30 ngày: 43 phút. Tiêu vào deploy và sự cố; hết ngân sách thì chậm việc phát hành lại.</li>
  <li><strong>“Server quá tải thì em làm gì?”</strong> Từ chối sớm và rẻ bằng 503 + Retry-After. Đo được: goodput 12/s → 123/s với 200 người, và không còn việc bị bỏ rơi sau đỉnh tải.</li>
  <li><strong>“429 hay 503?”</strong> 429: client này vượt hạn mức của nó. 503: dịch vụ lúc này không nhận được, với ai cũng vậy. Cả hai kèm Retry-After.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Tái hiện cú sụp với <code>CONC=200</code>, rồi cách sửa với <code>LABFLOW_LOGIN_MAX_INFLIGHT</code> = 4, 8, 16, 64. Giá trị nào cho nhiều lượt đăng nhập được trả lời nhất trên máy bạn, và vì sao 64 hành xử như không giới hạn?</li>
  <li>Cho <code>probe.mjs</code> in thêm p99, rồi chạy nó với danh sách phòng trong lúc <code>perf/shed.mjs</code> chạy, có và không có bỏ bớt tải. Danh sách phòng có giữ được SLO trong cả hai trường hợp không?</li>
  <li>Viết SLO của LabFlow cho ba nhóm endpoint (danh sách phòng, đặt phòng, đăng nhập), kèm khung thời gian và ngân sách lỗi tính bằng phút.</li>
</ol>
<p><strong>Xong khi:</strong> bạn giải thích được, bằng số của mình, vì sao nhận ít request hơn lại giúp nhiều người đăng nhập được hơn.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SLI / SLO / SLA</span><span class="v">Thứ bạn đo / mục tiêu / hợp đồng có hậu quả.</span></div>
  <div class="kv"><span class="k">Ngân sách lỗi</span><span class="v">Được phép hỏng bao nhiêu trong khung thời gian: 100% − SLO.</span></div>
  <div class="kv"><span class="k">Sụp vì nghẽn</span><span class="v">Server vẫn bận nhưng gần như không gì tới tay người dùng kịp lúc.</span></div>
  <div class="kv"><span class="k">Goodput</span><span class="v">Phần việc tới được client vẫn còn đang chờ nó.</span></div>
  <div class="kv"><span class="k">Bỏ bớt tải (load shedding)</span><span class="v">Từ chối phần dư thật sớm (503 + Retry-After) để việc đã nhận vẫn nhanh.</span></div>
  <div class="kv"><span class="k">Retry-After</span><span class="v">Header đi kèm 503/429: chờ bao nhiêu giây rồi hãy thử lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>SLO 99,9% = 43,2 phút ngân sách mỗi 30 ngày; phụ thuộc nối tiếp nhau thì nhân với nhau (bốn thành phần → 99,79%, 1,5 giờ).</li>
  <li>Bộ đo đóng vai người dùng đo một sự cố 3 giây ra 90% trong khung 30 giây — và 0,1% ngân sách 30 ngày.</li>
  <li>Không bỏ bớt tải, 200 người làm goodput tụt từ 136/s xuống 12/s và để lại 13 giây việc bị bỏ rơi.</li>
  <li><code>limitInflight(8)</code> + 503 + Retry-After: 123 lượt/giây được trả lời trong ~64 ms, lời từ chối trong vài mili giây — nhưng chỉ bỏ bớt được việc có chờ.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 8.6 (bài MỚI) ─────────────────────────── */
    {
      title: '8.6 — Availability in the contract (2/2): degrading on purpose, readiness, and clients that read the rules|||8.6 — Tính sẵn sàng trong hợp đồng (2/2): suy giảm có chủ đích, readiness, và client biết đọc luật',
      slug: 'api-8-4-suy-giam',
      type: 'LESSON',
      isFreePreview: true,
      description: 'CSDL sập: đọc trả bản cũ kèm Age + LabFlow-Degraded, ghi trả 503 DEPENDENCY_DOWN; liveness và readiness; OpenAPI 2.2.0 ghi 503 và header; client theo Retry-After trong ngân sách thời gian; trang SLO.',
      content: `${G086}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.6</span>
<h2>Availability in the contract (2/2): degrading on purpose, readiness, and clients that read the rules</h2>
<p class="lead">8.5 protected LabFlow from too many users. This lesson breaks something underneath it: the database goes away. Answering “500” to everything is the lazy option. Better: decide per endpoint what is still safe to return, label it honestly, tell the load balancer, write all of it into the contract — and then check that an app which reads the contract behaves well.</p>

<h3>Degrading on purpose: old data with a label, or a clear refusal</h3>
<p>When PostgreSQL is down, “500 for everything” is the lazy answer. Decide per endpoint, and write it in the contract:</p>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">R</span><span class="lz-nbody"><span class="lz-ntitle">Reads with a safe fallback</span><span class="lz-nsub">lab list: serve the last good copy + Age + LabFlow-Degraded: stale-data</span></span></div>
    <div class="lz-node"><span class="lz-badge">W</span><span class="lz-nbody"><span class="lz-ntitle">Writes without a fallback</span><span class="lz-nsub">booking: 503 DEPENDENCY_DOWN + Retry-After: 30 — never pretend it was saved</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">?</span><span class="lz-nbody"><span class="lz-ntitle">Reads where old is wrong</span><span class="lz-nsub">“my bookings” right after booking, a balance — refuse rather than mislead</span></span></div>
    <div class="lz-node"><span class="lz-badge">✓</span><span class="lz-nbody"><span class="lz-ntitle">Tell the balancer</span><span class="lz-nsub">/ready answers 503 so traffic moves to instances that can still write</span></span></div>
  </div>
</div>
<pre><code class="language-javascript">// resilience.js — đọc có đường lùi: nhớ bản tốt gần nhất; CSDL sập thì trả bản đó kèm tuổi của nó
export function withLastGood(read) {
  let last = null;
  return (req, res) =&gt; {
    if (!dependency.down) { const data = read(req); last = { data, at: Date.now() }; return { data, stale: null }; }
    if (!last) { res.set('Retry-After', '30'); throw new HttpError(503, 'DEPENDENCY_DOWN'); }   // chưa từng đọc được
    return { data: last.data, stale: Math.floor((Date.now() - last.at) / 1000) };
  };
}
// routes/labs.js
const { data, stale } = readLabs(req, res);
if (stale !== null) res.set('Age', String(stale)).set('LabFlow-Degraded', 'stale-data');</code></pre>
<p>LabFlow simulates the outage with <code>POST /chaos/db</code> (only when <code>LABFLOW_CHAOS=1</code>, for learning):</p>
<pre><code class="language-bash">curl -s http://localhost:4000/health; echo; curl -s http://localhost:4000/ready</code></pre>
<div class="out">{
  "status": "ok"
}
{
  "status": "ready",
  "database": "up"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/v2/labs</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/chaos/db --json '{"down":true}'</code></pre>
<div class="out">{
  "down": true,
  "since": "2026-10-31T23:14:12.072Z"
}</div>
<pre><code class="language-bash">sleep 2; curl -s -D - -o /dev/null http://localhost:4000/v2/labs | grep -iE '^(HTTP|Age|LabFlow-Degraded)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Age: 2
LabFlow-Degraded: stale-data</div>
<pre><code class="language-bash">curl -s -i http://localhost:4000/health | grep -iE '^HTTP|status'; curl -s -i http://localhost:4000/ready | grep -iE '^(HTTP|Retry-After)|status'</code></pre>
<div class="out">HTTP/1.1 200 OK
  "status": "ok"
HTTP/1.1 503 Service Unavailable
Retry-After: 30
  "status": "degraded",</div>
<pre><code class="language-bash">curl -s -i http://localhost:4000/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-04-05T08:00:00+07:00","end":"2027-04-05T10:00:00+07:00"}}' | grep -iE '^(HTTP|Retry-After)|"code"'</code></pre>
<div class="out">HTTP/1.1 503 Service Unavailable
Retry-After: 30
  "code": "DEPENDENCY_DOWN"</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/chaos/db --json '{"down":false}'</code></pre>
<div class="out">{
  "down": false,
  "since": null
}</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/v2/labs | grep -iE '^(HTTP|Age|LabFlow-Degraded)'; curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/ready</code></pre>
<div class="out">HTTP/1.1 200 OK
200</div>
<p>During the outage the lab list stayed <code>200</code> with <code>Age: 2</code> (seconds since that copy was fresh — the standard HTTP header, RFC 9111) and <code>LabFlow-Degraded: stale-data</code>, so the app can show “updated a moment ago”. The booking was refused with a reason and a time to retry. <code>/health</code> stayed 200 while <code>/ready</code> said 503. When the database returned, the label disappeared by itself.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9111.html#name-age" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9111 §5.1 Age (read 1 Nov 2026)</span><span class="lc-sub">Age is the sender’s estimate, in seconds, of the time since the response was generated or validated at the origin. LabFlow reuses this standard header for its stale copy instead of inventing a new field; LabFlow-Degraded says why it is old.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>


<h3>Liveness and readiness are different questions</h3>
<ul>
  <li><strong><code>/health</code> — liveness:</strong> “is this process alive and answering?” If not, restart it.</li>
  <li><strong><code>/ready</code> — readiness:</strong> “should this instance get traffic now?” If not, the balancer stops sending to it — no restart.</li>
</ul>
<div class="pitfall"><p><strong>Trap — checking the database in the liveness probe.</strong> When the database goes down, every instance fails liveness, the platform restarts all of them at once, they come back to the same broken database — and the stale lab list you could have served is gone. Dependencies belong in readiness; liveness checks only the process itself.</p></div>
<a class="link-card" href="https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Kubernetes — Liveness, Readiness, and Startup Probes (read 1 Nov 2026)</span><span class="lc-sub">A failed liveness probe restarts the container; a failed readiness probe removes the Pod from the Service’s endpoints. Warns that wrong liveness probes cause cascading failures, and suggests that readiness additionally checks required back-end services.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Writing it into the contract</h3>
<p>None of this helps if clients do not know it. LabFlow’s <code>openapi.yaml</code> (Chapter 7) now documents the 503 on the three operations that can shed or refuse, and the two headers of a degraded lab list:</p>
<pre><code class="language-yaml"># openapi.yaml 2.2.0 — thêm vào components (redocly + spectral lint: 0 lỗi; cổng so phiên bản 2.1.0: không phá vỡ)
  headers:
    Retry-After:
      description: Seconds to wait before retrying (503 overload or dependency down, 429 quota)
      schema: { type: integer, minimum: 1 }
    Age:
      description: Seconds since this copy was fresh (RFC 9111); sent with LabFlow-Degraded
      schema: { type: integer, minimum: 0 }
    LabFlow-Degraded:
      description: Present when the body is a stale copy served during an incident; see Age
      schema: { type: string, enum: [stale-data] }
  responses:
    Unavailable:
      description: Overloaded (&#96;OVERLOADED&#96;) or a dependency is down (&#96;DEPENDENCY_DOWN&#96;). Safe to retry after Retry-After.
      headers:
        Retry-After: { $ref: '#/components/headers/Retry-After' }
      content:
        application/problem+json:
          schema: { $ref: '#/components/schemas/Problem' }
# và ở POST /auth/login, GET /labs, POST /bookings:   '503': { $ref: '#/components/responses/Unavailable' }</code></pre>
<p>Next to the spec, a short <strong>SLO page</strong> says what LabFlow promises: the SLOs per endpoint group, how degradation looks, the client timeout and retry rules (Chapter 5: a capped number of tries, backoff with jitter, honour <code>Retry-After</code>, a total time budget), and where the status page is — shown below.</p>

<h3>The other side: an app that reads the contract</h3>
<p>A contract is only as good as its clients. <code>perf/app-client.mjs</code> plays the LabFlow app with three rules: show stale data with an “updating” line; on 503/429 wait exactly <code>Retry-After</code> and resend with the <em>same</em> <code>Idempotency-Key</code>; and if <code>Retry-After</code> is longer than the screen can wait (its <strong>time budget</strong>, here 10 s), stop at once and tell the user.</p>
<pre><code class="language-javascript">// perf/app-client.mjs (rút gọn) — phía app đọc hợp đồng suy giảm của LabFlow
export async function call(method, path, { body, token, budgetMs = 10_000 } = {}) {
  const key = method === 'POST' ? randomUUID() : undefined;     // MỘT khoá cho mọi lần gửi lại
  const start = Date.now();
  for (let attempt = 1; ; attempt++) {
    const r = await fetch(&#96;\${BASE}\${path}&#96;, { method, body: body &amp;&amp; JSON.stringify(body), headers: { /* … */ 'idempotency-key': key } });
    const data = await r.json();
    if (r.status !== 503 &amp;&amp; r.status !== 429) {
      if (r.headers.get('labflow-degraded')) log(&#96;… bản cũ \${r.headers.get('age')} s ⇒ hiện dữ liệu + dòng "đang cập nhật"&#96;);
      return { status: r.status, data };
    }
    const wait = 1000 * Number(r.headers.get('retry-after') ?? 1);
    if (Date.now() - start + wait &gt; budgetMs) return { status: r.status, data };   // quá ngân sách ⇒ dừng, báo rõ
    await sleep(wait);                                          // đúng Retry-After, rồi gửi lại CÙNG khoá
  }
}</code></pre>
<p><strong>Scenario 1 — the 07:00 flood</strong> (200 simulated users with shedding on, as in 8.5; Lan’s app starts half a second later):</p>
<pre><code class="language-bash">(CONC=200 SECONDS=4 node perf/shed.mjs &gt; /dev/null &amp;) ; sleep 0.5; node perf/app-client.mjs</code></pre>
<div class="out">[   34 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 1038 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 2046 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 3053 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 4087 ms] POST /v2/auth/login → 200 (lần 5)</div>
<p>Lan was refused four times in a row and got in on the fifth try, at 4.1 s — exactly when the flood ended. Every refusal was cheap and honest, and her app never hung. But notice what shedding does <em>not</em> promise: fairness. 200 other clients also retry after exactly 1 second, so Lan’s chance each second is small. Real clients add random <strong>jitter</strong> to the wait (5.2), and important traffic (staff, paid users) can get its own limit.</p>
<p><strong>Scenario 2 — the database is down:</strong></p>
<pre><code class="language-bash">curl -s -o /dev/null http://localhost:4000/v2/labs; curl -s -o /dev/null -X POST http://localhost:4000/chaos/db \\
  --json '{"down":true}'; sleep 1</code></pre>
<pre><code class="language-bash">SCENARIO=db-down node perf/app-client.mjs</code></pre>
<div class="out">[   71 ms] POST /v2/auth/login → 200
[   74 ms] GET /v2/labs → 200, bản cũ 1 s ⇒ hiện dữ liệu + dòng "đang cập nhật"
[   77 ms] POST /v2/bookings → 503 DEPENDENCY_DOWN, Retry-After 30 s &gt; ngân sách 10 s ⇒ dừng, báo "chưa đặt được, thử lại sau"</div>
<p>The lab list shows (one second old, labelled). The booking stops in 3 ms with a clear message, instead of a spinner for 30 seconds or a silent retry loop. Because the same key would be reused, the user can safely press “Book” again later.</p>

<h3>The SLO page next to the spec</h3>
<p>OpenAPI describes each response; a short human page describes the promises and the behaviour during incidents. LabFlow’s <code>docs/slo.md</code>:</p>
<pre><code class="language-markdown"># LabFlow API — SLO và hành vi khi có sự cố (bản 2.2.0)

| Nhóm endpoint | SLI (đo từ ngoài, như người dùng) | SLO / 30 ngày | Ngân sách lỗi |
|---|---|---|---|
| GET /v2/labs, /v2/labs/{id} | 2xx và &lt; 300 ms | 99,9% | 43,2 phút |
| POST /v2/bookings, /cancel, /check-in | 2xx/4xx đúng hợp đồng và &lt; 1 s | 99,5% | 3,6 giờ |
| POST /v2/auth/login | có câu trả lời (200/401/503 kèm Retry-After) trong &lt; 1 s | 99,5% | 3,6 giờ |

## Khi quá tải
- Đăng nhập: tối đa 8 lượt đang xử lý mỗi instance; dư ⇒ &#96;503 OVERLOADED&#96; + &#96;Retry-After: 1&#96;.

## Khi cơ sở dữ liệu gặp sự cố
- &#96;GET /v2/labs&#96;: trả bản tốt gần nhất, &#96;200&#96; + &#96;Age&#96; + &#96;LabFlow-Degraded: stale-data&#96;.
- Mọi lệnh ghi: &#96;503 DEPENDENCY_DOWN&#96; + &#96;Retry-After: 30&#96;. Không bao giờ trả 2xx cho thứ chưa lưu.
- &#96;/ready&#96; trả 503 (load balancer bớt gửi); &#96;/health&#96; vẫn 200 (không khởi động lại).

## Client nên làm gì
- Timeout 10 s mỗi request; thử lại tối đa 3 lần, lùi dần có jitter (Chương 5); luôn theo &#96;Retry-After&#96;.
- Lệnh ghi luôn gửi &#96;Idempotency-Key&#96;, giữ nguyên khoá khi gửi lại.
- &#96;Retry-After&#96; dài hơn thời gian màn hình chịu chờ ⇒ dừng và báo người dùng, đừng quay vòng.

Trang trạng thái: https://status.labflow.example (ví dụ)</code></pre>
<p>Every line of it was measured in this chapter. The status page itself (a separate, simple site that says “degraded since 10:42”) is the System Design course’s topic.</p>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“The database is down. What does your API return?”</strong> It depends on the endpoint, and it is written down: stale reads with <code>Age</code> + a label where old data is harmless, 503 + Retry-After for writes, readiness 503 so traffic moves.</li>
  <li><strong>“Liveness vs readiness?”</strong> Restart vs stop sending traffic. Never put the database in liveness.</li>
  <li><strong>“How should a mobile client handle 503?”</strong> Respect Retry-After within the screen’s time budget, keep the same idempotency key, add jitter, and fail with a clear message when the wait is too long.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>withLastGood</code> to <code>GET /v2/devices</code>. Decide in writing whether <code>GET /v2/me/bookings</code> should get it too, and why.</li>
  <li>Give <code>app-client.mjs</code> random jitter (0–500 ms) on top of Retry-After and run scenario 1 three times. Does Lan get in earlier?</li>
  <li>Add the 503 response to <code>POST /bookings/{id}/cancel</code> in <code>openapi.yaml</code>, run <code>npm run api:lint</code> and the version gate against 2.1.0.</li>
</ol>
<p><strong>Done when:</strong> for every LabFlow endpoint you can say what it returns while the database is down, and the spec says the same.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Graceful degradation</span><span class="v">Serving a reduced but honest result during a failure.</span></div>
  <div class="kv"><span class="k">Age</span><span class="v">Standard header: seconds since the response was fresh.</span></div>
  <div class="kv"><span class="k">Liveness</span><span class="v">Is the process alive? If not, restart it.</span></div>
  <div class="kv"><span class="k">Readiness</span><span class="v">Should this instance get traffic now? If not, route around it.</span></div>
  <div class="kv"><span class="k">Time budget</span><span class="v">How long a screen may wait in total, retries included.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">A random part added to retry waits so clients do not retry in step.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Decide per endpoint: stale reads with <code>Age</code> + <code>LabFlow-Degraded</code>, writes refused with <code>503 DEPENDENCY_DOWN</code> + <code>Retry-After: 30</code>.</li>
  <li>Measured during the simulated outage: lab list 200 (Age 2), booking 503, <code>/ready</code> 503, <code>/health</code> 200; all normal again when the database returned.</li>
  <li>Liveness checks only the process; dependencies belong in readiness, or one outage restarts everything.</li>
  <li>OpenAPI 2.2.0 documents the 503 and both headers (lint 0 errors, no breaking change); <code>docs/slo.md</code> states the promises.</li>
  <li>A client that reads the contract never hangs: it waited out four 503s in the flood and refused a 30 s wait at once when the database was down.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.6</span>
<h2>Tính sẵn sàng trong hợp đồng (2/2): suy giảm có chủ đích, readiness, và client biết đọc luật</h2>
<p class="lead">Bài 8.5 bảo vệ LabFlow khỏi quá nhiều người dùng. Bài này làm hỏng thứ nằm bên dưới: cơ sở dữ liệu biến mất. Trả “500” cho mọi thứ là cách lười. Tốt hơn: quyết định cho từng endpoint xem cái gì vẫn an toàn để trả, dán nhãn trung thực, báo cho bộ cân bằng tải, viết tất cả vào hợp đồng — rồi kiểm xem một app biết đọc hợp đồng có cư xử tử tế không.</p>

<h3>Suy giảm có chủ đích: dữ liệu cũ có dán nhãn, hoặc một lời từ chối rõ ràng</h3>
<p>Khi PostgreSQL sập, “500 cho tất cả” là câu trả lời lười. Quyết định theo từng endpoint, và viết vào hợp đồng:</p>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">R</span><span class="lz-nbody"><span class="lz-ntitle">Đọc có đường lùi an toàn</span><span class="lz-nsub">danh sách phòng: trả bản tốt gần nhất + Age + LabFlow-Degraded: stale-data</span></span></div>
    <div class="lz-node"><span class="lz-badge">W</span><span class="lz-nbody"><span class="lz-ntitle">Ghi không có đường lùi</span><span class="lz-nsub">đặt phòng: 503 DEPENDENCY_DOWN + Retry-After: 30 — không bao giờ giả vờ đã lưu</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">?</span><span class="lz-nbody"><span class="lz-ntitle">Đọc mà dữ liệu cũ là sai</span><span class="lz-nsub">“lượt đặt của tôi” ngay sau khi đặt, số dư — thà từ chối còn hơn gây hiểu lầm</span></span></div>
    <div class="lz-node"><span class="lz-badge">✓</span><span class="lz-nbody"><span class="lz-ntitle">Báo cho bộ cân bằng tải</span><span class="lz-nsub">/ready trả 503 để lưu lượng chuyển sang bản còn ghi được</span></span></div>
  </div>
</div>
<pre><code class="language-javascript">// resilience.js — đọc có đường lùi: nhớ bản tốt gần nhất; CSDL sập thì trả bản đó kèm tuổi của nó
export function withLastGood(read) {
  let last = null;
  return (req, res) =&gt; {
    if (!dependency.down) { const data = read(req); last = { data, at: Date.now() }; return { data, stale: null }; }
    if (!last) { res.set('Retry-After', '30'); throw new HttpError(503, 'DEPENDENCY_DOWN'); }   // chưa từng đọc được
    return { data: last.data, stale: Math.floor((Date.now() - last.at) / 1000) };
  };
}
// routes/labs.js
const { data, stale } = readLabs(req, res);
if (stale !== null) res.set('Age', String(stale)).set('LabFlow-Degraded', 'stale-data');</code></pre>
<p>LabFlow giả lập sự cố bằng <code>POST /chaos/db</code> (chỉ có khi <code>LABFLOW_CHAOS=1</code>, để học):</p>
<pre><code class="language-bash">curl -s http://localhost:4000/health; echo; curl -s http://localhost:4000/ready</code></pre>
<div class="out">{
  "status": "ok"
}
{
  "status": "ready",
  "database": "up"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/v2/labs</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/chaos/db --json '{"down":true}'</code></pre>
<div class="out">{
  "down": true,
  "since": "2026-10-31T23:14:12.072Z"
}</div>
<pre><code class="language-bash">sleep 2; curl -s -D - -o /dev/null http://localhost:4000/v2/labs | grep -iE '^(HTTP|Age|LabFlow-Degraded)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Age: 2
LabFlow-Degraded: stale-data</div>
<pre><code class="language-bash">curl -s -i http://localhost:4000/health | grep -iE '^HTTP|status'; curl -s -i http://localhost:4000/ready | grep -iE '^(HTTP|Retry-After)|status'</code></pre>
<div class="out">HTTP/1.1 200 OK
  "status": "ok"
HTTP/1.1 503 Service Unavailable
Retry-After: 30
  "status": "degraded",</div>
<pre><code class="language-bash">curl -s -i http://localhost:4000/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-04-05T08:00:00+07:00","end":"2027-04-05T10:00:00+07:00"}}' | grep -iE '^(HTTP|Retry-After)|"code"'</code></pre>
<div class="out">HTTP/1.1 503 Service Unavailable
Retry-After: 30
  "code": "DEPENDENCY_DOWN"</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/chaos/db --json '{"down":false}'</code></pre>
<div class="out">{
  "down": false,
  "since": null
}</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/v2/labs | grep -iE '^(HTTP|Age|LabFlow-Degraded)'; curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/ready</code></pre>
<div class="out">HTTP/1.1 200 OK
200</div>
<p>Trong lúc sự cố, danh sách phòng vẫn <code>200</code> với <code>Age: 2</code> (số giây kể từ khi bản đó còn mới — header HTTP chuẩn, RFC 9111) và <code>LabFlow-Degraded: stale-data</code>, để app hiện được “cập nhật cách đây ít phút”. Lượt đặt bị từ chối kèm lý do và thời điểm nên thử lại. <code>/health</code> vẫn 200 trong khi <code>/ready</code> nói 503. CSDL trở lại thì nhãn tự biến mất.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9111.html#name-age" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9111 §5.1 Age (đọc ngày 1/11/2026)</span><span class="lc-sub">Age là ước lượng của bên gửi, tính bằng giây, về thời gian kể từ khi response được tạo hay xác nhận lại ở server gốc. LabFlow dùng lại header chuẩn này cho bản cũ thay vì bịa trường mới; LabFlow-Degraded nói vì sao nó cũ.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Liveness và readiness là hai câu hỏi khác nhau</h3>
<ul>
  <li><strong><code>/health</code> — liveness (còn sống):</strong> “tiến trình này còn sống và còn trả lời không?” Không ⇒ khởi động lại.</li>
  <li><strong><code>/ready</code> — readiness (sẵn sàng):</strong> “bản này có nên nhận lưu lượng lúc này không?” Không ⇒ bộ cân bằng tải thôi gửi tới — không khởi động lại.</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — kiểm CSDL trong liveness.</strong> CSDL sập thì mọi bản đều trượt liveness, nền tảng khởi động lại tất cả cùng lúc, chúng sống lại với đúng cái CSDL đang hỏng — và danh sách phòng cũ lẽ ra vẫn phục vụ được thì mất sạch. Phụ thuộc thuộc về readiness; liveness chỉ kiểm chính tiến trình.</p></div>
<a class="link-card" href="https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Kubernetes — Liveness, Readiness, and Startup Probes (đọc ngày 1/11/2026)</span><span class="lc-sub">Trượt liveness thì container bị khởi động lại; trượt readiness thì Pod bị gỡ khỏi danh sách endpoint của Service. Cảnh báo liveness cấu hình sai gây hỏng dây chuyền, và gợi ý readiness kiểm thêm các dịch vụ phía sau bắt buộc phải có.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Viết vào hợp đồng</h3>
<p>Tất cả những điều trên vô ích nếu client không biết. <code>openapi.yaml</code> của LabFlow (Chương 7) giờ ghi rõ 503 ở ba thao tác có thể bỏ bớt tải hay từ chối, và hai header của một danh sách phòng đang suy giảm:</p>
<pre><code class="language-yaml"># openapi.yaml 2.2.0 — thêm vào components (redocly + spectral lint: 0 lỗi; cổng so phiên bản 2.1.0: không phá vỡ)
  headers:
    Retry-After:
      description: Seconds to wait before retrying (503 overload or dependency down, 429 quota)
      schema: { type: integer, minimum: 1 }
    Age:
      description: Seconds since this copy was fresh (RFC 9111); sent with LabFlow-Degraded
      schema: { type: integer, minimum: 0 }
    LabFlow-Degraded:
      description: Present when the body is a stale copy served during an incident; see Age
      schema: { type: string, enum: [stale-data] }
  responses:
    Unavailable:
      description: Overloaded (&#96;OVERLOADED&#96;) or a dependency is down (&#96;DEPENDENCY_DOWN&#96;). Safe to retry after Retry-After.
      headers:
        Retry-After: { $ref: '#/components/headers/Retry-After' }
      content:
        application/problem+json:
          schema: { $ref: '#/components/schemas/Problem' }
# và ở POST /auth/login, GET /labs, POST /bookings:   '503': { $ref: '#/components/responses/Unavailable' }</code></pre>
<p>Bên cạnh spec, một <strong>trang SLO</strong> ngắn nói LabFlow hứa gì: SLO cho từng nhóm endpoint, suy giảm trông ra sao, luật timeout và thử lại cho client (Chương 5: giới hạn số lần thử, lùi dần có jitter, theo <code>Retry-After</code>, một ngân sách thời gian tổng), và trang trạng thái ở đâu — xem ngay dưới.</p>

<h3>Phía bên kia: một app biết đọc hợp đồng</h3>
<p>Hợp đồng chỉ tốt bằng client của nó. <code>perf/app-client.mjs</code> đóng vai app LabFlow với ba luật: dữ liệu cũ thì vẫn hiện kèm dòng “đang cập nhật”; gặp 503/429 thì chờ đúng <code>Retry-After</code> rồi gửi lại với <em>cùng</em> <code>Idempotency-Key</code>; còn nếu <code>Retry-After</code> dài hơn thời gian màn hình chịu chờ (<strong>ngân sách thời gian</strong>, ở đây 10 giây) thì dừng ngay và báo người dùng.</p>
<pre><code class="language-javascript">// perf/app-client.mjs (rút gọn) — phía app đọc hợp đồng suy giảm của LabFlow
export async function call(method, path, { body, token, budgetMs = 10_000 } = {}) {
  const key = method === 'POST' ? randomUUID() : undefined;     // MỘT khoá cho mọi lần gửi lại
  const start = Date.now();
  for (let attempt = 1; ; attempt++) {
    const r = await fetch(&#96;\${BASE}\${path}&#96;, { method, body: body &amp;&amp; JSON.stringify(body), headers: { /* … */ 'idempotency-key': key } });
    const data = await r.json();
    if (r.status !== 503 &amp;&amp; r.status !== 429) {
      if (r.headers.get('labflow-degraded')) log(&#96;… bản cũ \${r.headers.get('age')} s ⇒ hiện dữ liệu + dòng "đang cập nhật"&#96;);
      return { status: r.status, data };
    }
    const wait = 1000 * Number(r.headers.get('retry-after') ?? 1);
    if (Date.now() - start + wait &gt; budgetMs) return { status: r.status, data };   // quá ngân sách ⇒ dừng, báo rõ
    await sleep(wait);                                          // đúng Retry-After, rồi gửi lại CÙNG khoá
  }
}</code></pre>
<p><strong>Tình huống 1 — đợt dồn 07:00</strong> (200 người dùng giả lập, có bỏ bớt tải như bài 8.5; app của cô Lan khởi động trễ nửa giây):</p>
<pre><code class="language-bash">(CONC=200 SECONDS=4 node perf/shed.mjs &gt; /dev/null &amp;) ; sleep 0.5; node perf/app-client.mjs</code></pre>
<div class="out">[   34 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 1038 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 2046 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 3053 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 4087 ms] POST /v2/auth/login → 200 (lần 5)</div>
<p>Cô Lan bị từ chối bốn lần liền và vào được ở lần thứ năm, lúc 4,1 giây — đúng lúc đợt dồn kết thúc. Lời từ chối nào cũng rẻ và trung thực, app của cô không bao giờ treo. Nhưng để ý điều bỏ bớt tải <em>không</em> hứa: công bằng. 200 client khác cũng thử lại sau đúng 1 giây, nên mỗi giây cơ hội của cô Lan rất nhỏ. Client thật cộng thêm một khoảng <strong>jitter</strong> ngẫu nhiên vào thời gian chờ (5.2), và lưu lượng quan trọng (nhân viên, người dùng trả phí) có thể có giới hạn riêng.</p>
<p><strong>Tình huống 2 — CSDL sập:</strong></p>
<pre><code class="language-bash">curl -s -o /dev/null http://localhost:4000/v2/labs; curl -s -o /dev/null -X POST http://localhost:4000/chaos/db \\
  --json '{"down":true}'; sleep 1</code></pre>
<pre><code class="language-bash">SCENARIO=db-down node perf/app-client.mjs</code></pre>
<div class="out">[   71 ms] POST /v2/auth/login → 200
[   74 ms] GET /v2/labs → 200, bản cũ 1 s ⇒ hiện dữ liệu + dòng "đang cập nhật"
[   77 ms] POST /v2/bookings → 503 DEPENDENCY_DOWN, Retry-After 30 s &gt; ngân sách 10 s ⇒ dừng, báo "chưa đặt được, thử lại sau"</div>
<p>Danh sách phòng vẫn hiện (cũ một giây, có nhãn). Lượt đặt dừng sau 3 ms với thông báo rõ ràng, thay vì một vòng xoay 30 giây hay một vòng lặp thử lại âm thầm. Vì cùng một khoá sẽ được dùng lại, người dùng có thể yên tâm bấm “Đặt” lần nữa sau đó.</p>

<h3>Trang SLO đặt cạnh spec</h3>
<p>OpenAPI mô tả từng response; một trang ngắn cho người đọc mô tả những lời hứa và cách hệ thống cư xử khi có sự cố. <code>docs/slo.md</code> của LabFlow:</p>
<pre><code class="language-markdown"># LabFlow API — SLO và hành vi khi có sự cố (bản 2.2.0)

| Nhóm endpoint | SLI (đo từ ngoài, như người dùng) | SLO / 30 ngày | Ngân sách lỗi |
|---|---|---|---|
| GET /v2/labs, /v2/labs/{id} | 2xx và &lt; 300 ms | 99,9% | 43,2 phút |
| POST /v2/bookings, /cancel, /check-in | 2xx/4xx đúng hợp đồng và &lt; 1 s | 99,5% | 3,6 giờ |
| POST /v2/auth/login | có câu trả lời (200/401/503 kèm Retry-After) trong &lt; 1 s | 99,5% | 3,6 giờ |

## Khi quá tải
- Đăng nhập: tối đa 8 lượt đang xử lý mỗi instance; dư ⇒ &#96;503 OVERLOADED&#96; + &#96;Retry-After: 1&#96;.

## Khi cơ sở dữ liệu gặp sự cố
- &#96;GET /v2/labs&#96;: trả bản tốt gần nhất, &#96;200&#96; + &#96;Age&#96; + &#96;LabFlow-Degraded: stale-data&#96;.
- Mọi lệnh ghi: &#96;503 DEPENDENCY_DOWN&#96; + &#96;Retry-After: 30&#96;. Không bao giờ trả 2xx cho thứ chưa lưu.
- &#96;/ready&#96; trả 503 (load balancer bớt gửi); &#96;/health&#96; vẫn 200 (không khởi động lại).

## Client nên làm gì
- Timeout 10 s mỗi request; thử lại tối đa 3 lần, lùi dần có jitter (Chương 5); luôn theo &#96;Retry-After&#96;.
- Lệnh ghi luôn gửi &#96;Idempotency-Key&#96;, giữ nguyên khoá khi gửi lại.
- &#96;Retry-After&#96; dài hơn thời gian màn hình chịu chờ ⇒ dừng và báo người dùng, đừng quay vòng.

Trang trạng thái: https://status.labflow.example (ví dụ)</code></pre>
<p>Mỗi dòng trong đó đều đã đo trong chương này. Bản thân trang trạng thái (một trang riêng, đơn giản, ghi “suy giảm từ 10:42”) là chủ đề của khoá System Design.</p>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“CSDL sập. API của em trả gì?”</strong> Tuỳ endpoint, và đã viết ra: đọc trả bản cũ kèm <code>Age</code> + nhãn ở chỗ dữ liệu cũ vô hại, ghi trả 503 + Retry-After, readiness 503 để lưu lượng chuyển đi.</li>
  <li><strong>“Liveness khác readiness thế nào?”</strong> Khởi động lại so với thôi gửi lưu lượng. Đừng bao giờ đưa CSDL vào liveness.</li>
  <li><strong>“Client di động nên xử lý 503 ra sao?”</strong> Theo Retry-After trong phạm vi ngân sách thời gian của màn hình, giữ nguyên khoá idempotency, thêm jitter, và báo lỗi rõ khi phải chờ quá lâu.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>withLastGood</code> cho <code>GET /v2/devices</code>. Quyết định bằng văn bản xem <code>GET /v2/me/bookings</code> có nên dùng nó không, và vì sao.</li>
  <li>Cho <code>app-client.mjs</code> thêm jitter ngẫu nhiên (0–500 ms) vào Retry-After và chạy tình huống 1 ba lần. Cô Lan có vào sớm hơn không?</li>
  <li>Thêm response 503 cho <code>POST /bookings/{id}/cancel</code> trong <code>openapi.yaml</code>, chạy <code>npm run api:lint</code> và cổng so phiên bản với 2.1.0.</li>
</ol>
<p><strong>Xong khi:</strong> với mọi endpoint của LabFlow, bạn nói được nó trả gì khi CSDL sập, và spec nói đúng như vậy.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Suy giảm có chủ đích</span><span class="v">Trả kết quả kém hơn nhưng trung thực trong lúc có sự cố.</span></div>
  <div class="kv"><span class="k">Age</span><span class="v">Header chuẩn: số giây kể từ khi response còn mới.</span></div>
  <div class="kv"><span class="k">Liveness</span><span class="v">Tiến trình còn sống không? Không ⇒ khởi động lại.</span></div>
  <div class="kv"><span class="k">Readiness</span><span class="v">Bản này có nên nhận lưu lượng lúc này không? Không ⇒ đi vòng qua nó.</span></div>
  <div class="kv"><span class="k">Ngân sách thời gian</span><span class="v">Một màn hình được chờ tổng cộng bao lâu, kể cả các lần thử lại.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">Phần ngẫu nhiên cộng vào thời gian chờ để các client không thử lại cùng nhịp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Quyết định theo từng endpoint: đọc trả bản cũ kèm <code>Age</code> + <code>LabFlow-Degraded</code>, ghi bị từ chối bằng <code>503 DEPENDENCY_DOWN</code> + <code>Retry-After: 30</code>.</li>
  <li>Đo trong sự cố giả lập: danh sách phòng 200 (Age 2), đặt phòng 503, <code>/ready</code> 503, <code>/health</code> 200; tất cả bình thường lại khi CSDL trở về.</li>
  <li>Liveness chỉ kiểm tiến trình; phụ thuộc thuộc về readiness, nếu không một sự cố sẽ khởi động lại mọi thứ.</li>
  <li>OpenAPI 2.2.0 ghi rõ 503 và cả hai header (lint 0 lỗi, không thay đổi phá vỡ); <code>docs/slo.md</code> nêu các lời hứa.</li>
  <li>Client biết đọc hợp đồng không bao giờ treo: nó chờ qua bốn lần 503 trong đợt dồn và từ chối ngay một lần chờ 30 giây khi CSDL sập.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 8.7 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '8.7 — Lab 8: a usage report that froze LabFlow — measure, fix, protect, promise (with rubric)|||8.7 — Lab 8: báo cáo dùng phòng làm LabFlow đứng hình — đo, sửa, bảo vệ, cam kết (có thang chấm)',
      slug: 'api-8-7-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: báo cáo 335 ms chặn event loop (người xem phòng chờ 3,1 s); limitInflight không giúp; một lượt quét 516/s giống từng byte, cache 60 s 4.532/s; giới hạn ×2 khi hai bản; OpenAPI + SLO; thang chấm 10 điểm, gói dự án.',
      content: `${GL8}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab 8</span>
<h2>Lab 8: a usage report that froze LabFlow — measure, fix, protect, promise</h2>
<p class="lead">Ms Lan asked for a usage report: for each day and each lab, how many bookings and how many hours. A teammate wrote <code>GET /v2/reports/usage</code>; it returns the right numbers. On planning day five lab managers open it at once — and every student’s app freezes. Your job is the whole chapter in one task: measure it, find why it hurts <em>other</em> endpoints, fix it without changing a single number in the answer, protect the server, check it across two instances, and write down what LabFlow now promises.</p>

<h3>Starting point</h3>
<p>Start from the chapter’s code (download below) and put the starter file in place: <code>cp lab/reports-starter.js src/routes/reports.js</code>. Run with 20,000 seeded bookings (about four years of a three-lab building):</p>
<pre><code class="language-bash">SEED_BOOKINGS=20000 LABFLOW_IP_LIMIT=1000000/60 npm start     # IP_LIMIT chỉ để test tải, đừng đặt ở production</code></pre>
<pre><code class="language-javascript">// routes/reports.js — Lab 8 (BẢN KHỞI ĐẦU, cố ý chậm): báo cáo dùng phòng cho cô Lan
// GET /v2/reports/usage?from=2026-11-02&amp;days=30 ⇒ mỗi ngày, mỗi phòng: số lượt đặt và số giờ (bỏ lượt đã huỷ)
import { Router } from 'express';
import { z } from 'zod';
import { labs, bookings } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { onlyAllow } from '../http.js';

const Q = z.strictObject({
  from: z.iso.date(),
  days: z.coerce.number().int().min(1).max(92).default(30),
});

export const reportsRouter = Router();
reportsRouter.route('/usage')
  .get(requireAuth, requireRole('LAB_MANAGER'), validate('query', Q), (req, res) =&gt; {
    const { from, days } = req.valid.query;
    const out = [];
    for (let d = 0; d &lt; days; d++) {
      const day = new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10);
      for (const lab of labs) {
        // mỗi (ngày, phòng) lại quét TOÀN BỘ danh sách đặt phòng
        const mine = bookings.filter((b) =&gt; b.labId === lab.id &amp;&amp; b.status !== 'CANCELLED'
          &amp;&amp; new Date(b.startAt).toISOString().slice(0, 10) === day);
        const hours = mine.reduce((s, b) =&gt; s + (new Date(b.endAt) - new Date(b.startAt)) / 3600000, 0);
        out.push({ day, labId: lab.id, bookings: mine.length, hours });
      }
    }
    res.json({ from, days, rows: out });
  })
  .all(onlyAllow('GET'));</code></pre>
<p>The load test, <code>perf/report-mixed.mjs</code>, is <code>perf/mixed.mjs</code> from 8.2 with the target swapped: five managers (autocannon, <code>CONC</code> connections, Lan’s token in <code>TOKEN</code>) refresh <code>GET /v2/reports/usage?from=2026-11-02&amp;days=30</code> non-stop while one student opens the lab list every 20 ms.</p>

<h3>Tasks</h3>
<ol>
  <li><strong>Measure (2 pts).</strong> One request with <code>-D -</code>: what does Server-Timing say, and where is the time? Save the body as <code>before.json</code>. Run <code>report-mixed.mjs</code> with <code>CONC=5</code>. Write down report req/s and p99, and the lab list p50/p99.</li>
  <li><strong>Explain (1 pt).</strong> Why did <code>GET /v2/labs</code>, which never touches the report code, become slow? Then add <code>limitInflight(2)</code> to the report route and measure again. Explain the result in two sentences.</li>
  <li><strong>Fix the algorithm (2 pts).</strong> Rewrite the computation so it scans the bookings once. The answer must be <em>identical</em>: <code>cmp before.json after.json</code> prints nothing. Measure again.</li>
  <li><strong>Cache it honestly (2 pts).</strong> The report may be up to 60 seconds old. Keep each computed answer 60 s per <code>(from, days)</code>, send <code>Cache-Control: private, max-age=60</code> and <code>Age</code>. Authentication and the role check must still run on <em>every</em> request. Measure again.</li>
  <li><strong>Two instances (1 pt).</strong> Send 250 <code>GET /v2/labs</code> to one fresh instance, then 250 through <code>perf/proxy-rr.mjs</code> to two fresh ones. Count 200s and 429s; say where the counter should live and whether a per-instance report cache is a problem.</li>
  <li><strong>Promise it (2 pts).</strong> Add <code>GET /reports/usage</code> to <code>openapi.yaml</code> (200 schema, 400, 401, 403, 503; Age header), with lint 0 errors and no breaking change against 2.1.0. Add one row to <code>docs/slo.md</code>: SLI, SLO, error budget, and what happens under overload.</li>
</ol>

<h3>Rubric (10 points)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Measure — 2</span><span class="v">Server-Timing read correctly; before numbers for both the report and the bystander, with the command that produced them.</span></div>
  <div class="kv"><span class="k">2 · Explain — 1</span><span class="v">Names event-loop blocking; explains why the in-flight limit shed nothing (synchronous handler never has two requests waiting).</span></div>
  <div class="kv"><span class="k">3 · Algorithm — 2</span><span class="v">One pass over bookings; <code>cmp</code> identical for at least two queries (one with <code>days=92</code>); report ≥ 50× faster.</span></div>
  <div class="kv"><span class="k">4 · Cache — 2</span><span class="v">60 s per query, Age correct, <code>private</code>; 401/403 still returned with a warm cache (shown with curl).</span></div>
  <div class="kv"><span class="k">5 · Instances — 1</span><span class="v">Measured ~2× the limit through the proxy; shared counter or gateway proposed; cache staleness argued.</span></div>
  <div class="kv"><span class="k">6 · Contract — 2</span><span class="v">OpenAPI path valid (lint 0, gate “no breaking change”); SLO row with numbers that match your measurements.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — caching before checking who is asking.</strong> If the cache lookup runs before <code>requireAuth</code> and <code>requireRole</code>, a student gets the managers’ report from the cache. In the reference solution the cache lives <em>inside</em> the handler, after both checks.</p></div>

<h3>Reference solution and measured results</h3>
<p><strong>1 · Measure.</strong></p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | jq -r .accessToken &gt; lan.jwt</code></pre>
<pre><code class="language-bash">curl -s -D - -o before.json "http://localhost:4000/v2/reports/usage?from=2026-11-02&amp;days=30" \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE "^(HTTP|Server-Timing|Content-Length)"</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Length: 12322
Server-Timing: auth;dur=0.12, validate;dur=0.57, total;dur=335.41</div>
<pre><code class="language-bash">jq -c ".rows[0:3], (.rows | length)" before.json</code></pre>
<div class="out">[{"day":"2026-11-02","labId":"lab_1","bookings":4,"hours":8},{"day":"2026-11-02","labId":"lab_2","bookings":4,"hours":8},{"day":"2026-11-02","labId":"lab_3","bookings":5,"hours":10}]
120</div>
<pre><code class="language-bash">TOKEN=$(cat ../lan.jwt) CONC=5 node perf/report-mixed.mjs</code></pre>
<div class="out">report: 2.9 req/s · p50 1677 ms · p99 3098 ms · 2xx 29 · non-2xx 0
GET /v2/labs trong lúc đó: 4 lần · p50 3119.9 ms · p99 3336.4 ms · max 3336.4 ms · mã {"200":4}</div>
<p>335 ms of server time, and nothing in Server-Timing explains it — <code>auth</code> and <code>validate</code> are under 1 ms; the rest is the handler (add your own <code>compute</code> mark to prove it). Under 5 managers the report itself manages 2.9/s with p50 1.7 s, and the student checking labs waits <strong>3.1 s</strong> at p50: four requests in ten seconds.</p>
<p><strong>2 · Explain.</strong> 30 days × 4 labs × 20,000 bookings = 2.4 million iterations, each creating <code>Date</code> objects, all synchronous: the event loop is held for ~330 ms per report and every other request queues behind it (exactly 8.2’s scrypt story).</p>
<pre><code class="language-bash">TOKEN=$(cat ../lan.jwt) CONC=5 node perf/report-mixed.mjs</code></pre>
<div class="out">report: 2.5 req/s · p50 1581 ms · p99 3634 ms · 2xx 25 · non-2xx 0
GET /v2/labs trong lúc đó: 3 lần · p50 4167.5 ms · p99 5046.2 ms · max 5046.2 ms · mã {"200":3}</div>
<p>Nothing was shed (non-2xx 0) and nothing improved: a synchronous handler finishes before the next request is even read, so “in flight” never exceeds one. Shedding protects work that <em>waits</em>; this work does not wait.</p>
<p><strong>3 · Fix the algorithm. 4 · Cache.</strong> Build the empty table of (day, lab) cells first, then walk the bookings <em>once</em>, cutting the date out of the ISO string instead of creating <code>Date</code> objects; then keep the result 60 s:</p>
<pre><code class="language-javascript">// routes/reports.js — Lab 8 (BẢN THAM KHẢO): cùng câu trả lời với bản khởi đầu, nhưng
//   1) quét danh sách đặt phòng MỘT lần (O(N)) thay vì days × labs lần (O(days·labs·N)), không tạo Date trong vòng lặp
//   2) nhớ kết quả 60 s theo (from, days) — báo cáo không cần tươi từng giây; Age cho client biết dữ liệu cũ bao lâu
//   3) tối đa 2 lượt tính cùng lúc, dư ⇒ 503 + Retry-After (một báo cáo nặng không được kéo cả API chậm theo)
import { Router } from 'express';
import { z } from 'zod';
import { labs, bookings } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { onlyAllow } from '../http.js';
import { limitInflight } from '../resilience.js';

const Q = z.strictObject({
  from: z.iso.date(),
  days: z.coerce.number().int().min(1).max(92).default(30),
});
const TTL_MS = Number(process.env.REPORT_CACHE_MS ?? 60_000);   // REPORT_CACHE_MS=0 ⇒ tắt cache (để đo riêng phần tính)
const cache = new Map();                                       // "from|days" ⇒ { body, at }

function usage(from, days) {
  const dayList = Array.from({ length: days }, (_, d) =&gt; new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10));
  const cell = new Map();                                       // "2026-11-02|lab_1" ⇒ { bookings, hours }
  for (const day of dayList) for (const lab of labs) cell.set(&#96;\${day}|\${lab.id}&#96;, { bookings: 0, hours: 0 });
  for (const b of bookings) {                                   // MỘT lượt quét
    if (b.status === 'CANCELLED') continue;
    const c = cell.get(&#96;\${b.startAt.slice(0, 10)}|\${b.labId}&#96;); // startAt luôn là ISO UTC do server sinh ⇒ cắt chuỗi là đủ
    if (!c) continue;                                           // ngoài khoảng ngày
    c.bookings++;
    c.hours += (Date.parse(b.endAt) - Date.parse(b.startAt)) / 3600000;
  }
  const rows = [];
  for (const day of dayList) for (const lab of labs) rows.push({ day, labId: lab.id, ...cell.get(&#96;\${day}|\${lab.id}&#96;) });
  return { from, days, rows };
}

export const reportsRouter = Router();
reportsRouter.route('/usage')
  .get(requireAuth, requireRole('LAB_MANAGER'), limitInflight(2), validate('query', Q), (req, res) =&gt; {
    const { from, days } = req.valid.query;
    const key = &#96;\${from}|\${days}&#96;;
    let hit = cache.get(key);
    if (!hit || Date.now() - hit.at &gt; TTL_MS) {
      hit = { body: req.timing.time('compute', () =&gt; usage(from, days)), at: Date.now() };
      cache.set(key, hit);
    }
    res.set('Cache-Control', 'private, max-age=60')
      .set('Age', String(Math.floor((Date.now() - hit.at) / 1000)))
      .json(hit.body);
  })
  .all(onlyAllow('GET'));</code></pre>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o after.json "http://localhost:4000/v2/reports/usage?from=2026-11-02&amp;days=30" -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE "^(HTTP|Server-Timing|Age|Cache-Control)"; done</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: private, max-age=60
Age: 0
Server-Timing: auth;dur=0.12, validate;dur=0.58, compute;dur=4.22, total;dur=6.31
HTTP/1.1 200 OK
Cache-Control: private, max-age=60
Age: 0
Server-Timing: auth;dur=0.07, validate;dur=0.13, compute;dur=2.92, total;dur=3.66</div>
<pre><code class="language-bash">cmp before.json after.json &amp;&amp; echo "same answer"</code></pre>
<div class="out">same answer</div>
<pre><code class="language-bash">TOKEN=$(cat ../lan.jwt) CONC=5 node perf/report-mixed.mjs</code></pre>
<div class="out">report: 515.9 req/s · p50 9 ms · p99 26 ms · 2xx 5159 · non-2xx 0
GET /v2/labs trong lúc đó: 299 lần · p50 12.0 ms · p99 40.8 ms · max 49.6 ms · mã {"200":299}</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o after.json "http://localhost:4000/v2/reports/usage?from=2026-11-02&amp;days=30" -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE "^(HTTP|Server-Timing|Age|Cache-Control)"; done</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: private, max-age=60
Age: 0
Server-Timing: auth;dur=0.12, validate;dur=0.62, compute;dur=4.11, total;dur=6.05
HTTP/1.1 200 OK
Cache-Control: private, max-age=60
Age: 0
Server-Timing: auth;dur=0.06, validate;dur=0.13, total;dur=0.71</div>
<pre><code class="language-bash">TOKEN=$(cat ../lan.jwt) CONC=5 node perf/report-mixed.mjs</code></pre>
<div class="out">report: 4532.2 req/s · p50 0 ms · p99 6 ms · 2xx 45315 · non-2xx 0
GET /v2/labs trong lúc đó: 433 lần · p50 1.7 ms · p99 22.9 ms · max 31.8 ms · mã {"200":433}</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Starter · 2.9 report/s</span><span class="lz-lnote">server 335 ms per report; bystander p50 3,120 ms</span></div>
  <div class="lz-layer"><span class="lz-lname">One pass · 516 report/s</span><span class="lz-lnote">compute 3–4 ms; bystander p50 12 ms — same bytes (cmp)</span></div>
  <div class="lz-layer"><span class="lz-lname">One pass + 60 s cache · 4,532 report/s</span><span class="lz-lnote">a cached answer costs 0.7 ms; bystander p50 1.7 ms</span></div>
</div>
<p>The algorithm gave ~180×, the cache another ~9×. Order matters: a cache in front of the 335 ms version would still freeze LabFlow once a minute per query, and on every new <code>from</code> a manager types.</p>
<p><strong>5 · Two instances.</strong></p>
<pre><code class="language-bash">for i in $(seq 1 250); do curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4003/v2/labs; done | sort | uniq -c</code></pre>
<div class="out"> 105 200
 145 429</div>
<pre><code class="language-bash">for i in $(seq 1 250); do curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8080/v2/labs; done | sort | uniq -c</code></pre>
<div class="out"> 210 200
  40 429</div>
<p>105 vs 210: the documented “100 per minute per IP” is really 100 × the number of instances (a few extra are refills during the run). The counter belongs in a shared store (a PostgreSQL row or Redis key with an atomic increment) or in the gateway in front of both. The report cache being per instance is acceptable: each copy is at most 60 s old, which is exactly what <code>Cache-Control</code> and <code>Age</code> already promise — two instances can disagree by up to a minute, and that is written down.</p>
<p><strong>6 · Promise it.</strong> The path added to <code>openapi.yaml</code> (lint “valid”, gate against 2.1.0: “GET /reports/usage: new operation — no breaking change”), and checked against a real response with Ajv:</p>
<pre><code class="language-yaml">  /reports/usage:
    get:
      tags: [Reports]
      operationId: getUsageReport
      parameters:   # from: date, bắt buộc · days: 1–92, mặc định 30
      responses:
        '200': … rows[] { day, labId, bookings, hours } + Cache-Control, Age
        '400': { $ref: '#/components/responses/InvalidQuery' }
        '401': { $ref: '#/components/responses/Unauthenticated' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '503': { $ref: '#/components/responses/Unavailable' }</code></pre>
<pre><code class="language-markdown">| GET /v2/reports/usage | 2xx và &lt; 1 s, đo từ ngoài | 99,5% / 30 ngày | 3,6 giờ |
Quá tải: tối đa 2 lượt tính cùng lúc mỗi instance ⇒ 503 OVERLOADED + Retry-After: 1. Kết quả có thể cũ tới 60 s (Age).</code></pre>
<p>Why keep <code>limitInflight(2)</code> after task 2 showed it shed nothing? The report will not stay synchronous: once bookings live in PostgreSQL (Chapter 12) it becomes a query that <em>waits</em>, and then the limit protects the database pool.</p>
<p><strong>Discuss:</strong> days are UTC dates, so a booking at 06:00 in Vietnam (UTC+7) would land on the previous day. What would you change in the contract if the building opened at 06:00?</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch8.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API at the end of Chapter 8 (labflow-api-ch8.zip)</span><span class="lc-sub">The chapter’s code = this lab’s solution, every perf/ script of the chapter, OpenAPI 2.2.0, docs/slo.md and lab/reports-starter.js. npm install, then npm test.</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>📌 What this lab shows</h3>
<ul>
  <li>One slow synchronous handler made an unrelated endpoint wait: under the same load the lab list’s p50 was 3.1 s with the starter and 1.7 ms after the fix (~1,800×).</li>
  <li>Load shedding cannot fix blocking; fixing the algorithm can (~180×), and only then is a cache worth adding (~9× more).</li>
  <li>Correctness is checked byte for byte before speed is celebrated.</li>
  <li>Anything counted per instance — limits, caches — is either moved to a shared place or written into the contract as it really behaves.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab 8</span>
<h2>Lab 8: báo cáo dùng phòng làm LabFlow đứng hình — đo, sửa, bảo vệ, cam kết</h2>
<p class="lead">Cô Lan cần một báo cáo dùng phòng: mỗi ngày, mỗi phòng, bao nhiêu lượt đặt và bao nhiêu giờ. Một bạn trong nhóm viết <code>GET /v2/reports/usage</code>; nó trả đúng số. Ngày lên kế hoạch học kỳ, năm quản lý phòng lab cùng mở báo cáo — và app của mọi sinh viên đứng hình. Việc của bạn là cả chương gói trong một bài: đo, tìm ra vì sao nó làm hại endpoint <em>khác</em>, sửa mà không đổi một con số nào trong câu trả lời, bảo vệ server, kiểm khi chạy hai bản, và viết ra LabFlow giờ hứa những gì.</p>

<h3>Điểm xuất phát</h3>
<p>Bắt đầu từ code của chương (tải ở cuối bài) và đặt tệp khởi đầu vào chỗ: <code>cp lab/reports-starter.js src/routes/reports.js</code>. Chạy với 20.000 lượt đặt mẫu (khoảng bốn năm của một toà nhà ba phòng lab):</p>
<pre><code class="language-bash">SEED_BOOKINGS=20000 LABFLOW_IP_LIMIT=1000000/60 npm start     # IP_LIMIT chỉ để test tải, đừng đặt ở production</code></pre>
<pre><code class="language-javascript">// routes/reports.js — Lab 8 (BẢN KHỞI ĐẦU, cố ý chậm): báo cáo dùng phòng cho cô Lan
// GET /v2/reports/usage?from=2026-11-02&amp;days=30 ⇒ mỗi ngày, mỗi phòng: số lượt đặt và số giờ (bỏ lượt đã huỷ)
import { Router } from 'express';
import { z } from 'zod';
import { labs, bookings } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { onlyAllow } from '../http.js';

const Q = z.strictObject({
  from: z.iso.date(),
  days: z.coerce.number().int().min(1).max(92).default(30),
});

export const reportsRouter = Router();
reportsRouter.route('/usage')
  .get(requireAuth, requireRole('LAB_MANAGER'), validate('query', Q), (req, res) =&gt; {
    const { from, days } = req.valid.query;
    const out = [];
    for (let d = 0; d &lt; days; d++) {
      const day = new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10);
      for (const lab of labs) {
        // mỗi (ngày, phòng) lại quét TOÀN BỘ danh sách đặt phòng
        const mine = bookings.filter((b) =&gt; b.labId === lab.id &amp;&amp; b.status !== 'CANCELLED'
          &amp;&amp; new Date(b.startAt).toISOString().slice(0, 10) === day);
        const hours = mine.reduce((s, b) =&gt; s + (new Date(b.endAt) - new Date(b.startAt)) / 3600000, 0);
        out.push({ day, labId: lab.id, bookings: mine.length, hours });
      }
    }
    res.json({ from, days, rows: out });
  })
  .all(onlyAllow('GET'));</code></pre>
<p>Bài test tải <code>perf/report-mixed.mjs</code> chính là <code>perf/mixed.mjs</code> của bài 8.2 đổi mục tiêu: năm quản lý (autocannon, <code>CONC</code> kết nối, token của cô Lan trong <code>TOKEN</code>) làm mới <code>GET /v2/reports/usage?from=2026-11-02&amp;days=30</code> liên tục, trong lúc một sinh viên cứ 20 ms mở danh sách phòng một lần.</p>

<h3>Nhiệm vụ</h3>
<ol>
  <li><strong>Đo (2 điểm).</strong> Một request với <code>-D -</code>: Server-Timing nói gì, thời gian nằm ở đâu? Lưu body thành <code>before.json</code>. Chạy <code>report-mixed.mjs</code> với <code>CONC=5</code>. Ghi lại req/s và p99 của báo cáo, p50/p99 của danh sách phòng.</li>
  <li><strong>Giải thích (1 điểm).</strong> Vì sao <code>GET /v2/labs</code>, vốn không hề chạm vào code báo cáo, lại chậm? Rồi thêm <code>limitInflight(2)</code> vào route báo cáo và đo lại. Giải thích kết quả trong hai câu.</li>
  <li><strong>Sửa thuật toán (2 điểm).</strong> Viết lại phần tính sao cho chỉ quét danh sách đặt phòng một lần. Câu trả lời phải <em>giống hệt</em>: <code>cmp before.json after.json</code> không in gì. Đo lại.</li>
  <li><strong>Cache một cách trung thực (2 điểm).</strong> Báo cáo được phép cũ tới 60 giây. Giữ mỗi kết quả đã tính 60 giây theo <code>(from, days)</code>, gửi <code>Cache-Control: private, max-age=60</code> và <code>Age</code>. Xác thực và kiểm vai trò vẫn phải chạy ở <em>mọi</em> request. Đo lại.</li>
  <li><strong>Hai bản (1 điểm).</strong> Gửi 250 lần <code>GET /v2/labs</code> vào một bản mới khởi động, rồi 250 lần qua <code>perf/proxy-rr.mjs</code> tới hai bản mới. Đếm số 200 và 429; nói bộ đếm nên nằm ở đâu và cache báo cáo riêng từng bản có phải vấn đề không.</li>
  <li><strong>Cam kết (2 điểm).</strong> Thêm <code>GET /reports/usage</code> vào <code>openapi.yaml</code> (schema 200, 400, 401, 403, 503; header Age), lint 0 lỗi và không thay đổi phá vỡ so với 2.1.0. Thêm một dòng vào <code>docs/slo.md</code>: SLI, SLO, ngân sách lỗi, và chuyện gì xảy ra khi quá tải.</li>
</ol>

<h3>Thang chấm (10 điểm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Đo — 2</span><span class="v">Đọc đúng Server-Timing; có số “trước” cho cả báo cáo lẫn người đứng ngoài, kèm lệnh đã tạo ra chúng.</span></div>
  <div class="kv"><span class="k">2 · Giải thích — 1</span><span class="v">Gọi đúng tên chặn event loop; giải thích vì sao giới hạn đang-xử-lý không từ chối gì (handler đồng bộ không bao giờ có hai request cùng chờ).</span></div>
  <div class="kv"><span class="k">3 · Thuật toán — 2</span><span class="v">Một lượt quét qua các lượt đặt; <code>cmp</code> giống hệt với ít nhất hai truy vấn (một cái <code>days=92</code>); báo cáo nhanh hơn ≥ 50 lần.</span></div>
  <div class="kv"><span class="k">4 · Cache — 2</span><span class="v">60 giây theo truy vấn, Age đúng, <code>private</code>; vẫn trả 401/403 khi cache đang nóng (chứng minh bằng curl).</span></div>
  <div class="kv"><span class="k">5 · Hai bản — 1</span><span class="v">Đo được ~2 lần giới hạn qua proxy; đề xuất bộ đếm dùng chung hoặc gateway; lập luận về độ cũ của cache.</span></div>
  <div class="kv"><span class="k">6 · Hợp đồng — 2</span><span class="v">Path OpenAPI hợp lệ (lint 0, cổng so phiên bản “không phá vỡ”); dòng SLO có số khớp với số bạn đo.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tra cache trước khi kiểm ai đang hỏi.</strong> Nếu bước tra cache chạy trước <code>requireAuth</code> và <code>requireRole</code>, một sinh viên sẽ nhận báo cáo của quản lý từ cache. Trong lời giải tham khảo, cache nằm <em>bên trong</em> handler, sau cả hai bước kiểm.</p></div>

<h3>Lời giải tham khảo và kết quả đo</h3>
<p><strong>1 · Đo.</strong></p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | jq -r .accessToken &gt; lan.jwt</code></pre>
<pre><code class="language-bash">curl -s -D - -o before.json "http://localhost:4000/v2/reports/usage?from=2026-11-02&amp;days=30" \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE "^(HTTP|Server-Timing|Content-Length)"</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Length: 12322
Server-Timing: auth;dur=0.12, validate;dur=0.57, total;dur=335.41</div>
<pre><code class="language-bash">jq -c ".rows[0:3], (.rows | length)" before.json</code></pre>
<div class="out">[{"day":"2026-11-02","labId":"lab_1","bookings":4,"hours":8},{"day":"2026-11-02","labId":"lab_2","bookings":4,"hours":8},{"day":"2026-11-02","labId":"lab_3","bookings":5,"hours":10}]
120</div>
<pre><code class="language-bash">TOKEN=$(cat ../lan.jwt) CONC=5 node perf/report-mixed.mjs</code></pre>
<div class="out">report: 2.9 req/s · p50 1677 ms · p99 3098 ms · 2xx 29 · non-2xx 0
GET /v2/labs trong lúc đó: 4 lần · p50 3119.9 ms · p99 3336.4 ms · max 3336.4 ms · mã {"200":4}</div>
<p>335 ms thời gian server, và Server-Timing không giải thích được — <code>auth</code> và <code>validate</code> dưới 1 ms; phần còn lại là handler (thêm mốc <code>compute</code> của riêng bạn để chứng minh). Với 5 quản lý, bản thân báo cáo chỉ được 2,9 lần/giây, p50 1,7 giây, còn bạn sinh viên xem phòng chờ <strong>3,1 giây</strong> ở p50: bốn request trong mười giây.</p>
<p><strong>2 · Giải thích.</strong> 30 ngày × 4 phòng × 20.000 lượt đặt = 2,4 triệu vòng lặp, vòng nào cũng tạo đối tượng <code>Date</code>, tất cả đồng bộ: event loop bị giữ ~330 ms mỗi báo cáo và mọi request khác phải xếp hàng phía sau (y hệt câu chuyện scrypt của bài 8.2).</p>
<pre><code class="language-bash">TOKEN=$(cat ../lan.jwt) CONC=5 node perf/report-mixed.mjs</code></pre>
<div class="out">report: 2.5 req/s · p50 1581 ms · p99 3634 ms · 2xx 25 · non-2xx 0
GET /v2/labs trong lúc đó: 3 lần · p50 4167.5 ms · p99 5046.2 ms · max 5046.2 ms · mã {"200":3}</div>
<p>Không gì bị từ chối (non-2xx 0) và không gì khá hơn: handler đồng bộ làm xong trước cả khi request kế tiếp được đọc, nên “đang xử lý” không bao giờ vượt quá một. Bỏ bớt tải bảo vệ việc có <em>chờ</em>; việc này không chờ gì cả.</p>
<p><strong>3 · Sửa thuật toán. 4 · Cache.</strong> Dựng sẵn bảng rỗng các ô (ngày, phòng), rồi đi qua danh sách đặt phòng <em>một lần</em>, cắt ngày từ chuỗi ISO thay vì tạo <code>Date</code>; sau đó giữ kết quả 60 giây:</p>
<pre><code class="language-javascript">// routes/reports.js — Lab 8 (BẢN THAM KHẢO): cùng câu trả lời với bản khởi đầu, nhưng
//   1) quét danh sách đặt phòng MỘT lần (O(N)) thay vì days × labs lần (O(days·labs·N)), không tạo Date trong vòng lặp
//   2) nhớ kết quả 60 s theo (from, days) — báo cáo không cần tươi từng giây; Age cho client biết dữ liệu cũ bao lâu
//   3) tối đa 2 lượt tính cùng lúc, dư ⇒ 503 + Retry-After (một báo cáo nặng không được kéo cả API chậm theo)
import { Router } from 'express';
import { z } from 'zod';
import { labs, bookings } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { onlyAllow } from '../http.js';
import { limitInflight } from '../resilience.js';

const Q = z.strictObject({
  from: z.iso.date(),
  days: z.coerce.number().int().min(1).max(92).default(30),
});
const TTL_MS = Number(process.env.REPORT_CACHE_MS ?? 60_000);   // REPORT_CACHE_MS=0 ⇒ tắt cache (để đo riêng phần tính)
const cache = new Map();                                       // "from|days" ⇒ { body, at }

function usage(from, days) {
  const dayList = Array.from({ length: days }, (_, d) =&gt; new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10));
  const cell = new Map();                                       // "2026-11-02|lab_1" ⇒ { bookings, hours }
  for (const day of dayList) for (const lab of labs) cell.set(&#96;\${day}|\${lab.id}&#96;, { bookings: 0, hours: 0 });
  for (const b of bookings) {                                   // MỘT lượt quét
    if (b.status === 'CANCELLED') continue;
    const c = cell.get(&#96;\${b.startAt.slice(0, 10)}|\${b.labId}&#96;); // startAt luôn là ISO UTC do server sinh ⇒ cắt chuỗi là đủ
    if (!c) continue;                                           // ngoài khoảng ngày
    c.bookings++;
    c.hours += (Date.parse(b.endAt) - Date.parse(b.startAt)) / 3600000;
  }
  const rows = [];
  for (const day of dayList) for (const lab of labs) rows.push({ day, labId: lab.id, ...cell.get(&#96;\${day}|\${lab.id}&#96;) });
  return { from, days, rows };
}

export const reportsRouter = Router();
reportsRouter.route('/usage')
  .get(requireAuth, requireRole('LAB_MANAGER'), limitInflight(2), validate('query', Q), (req, res) =&gt; {
    const { from, days } = req.valid.query;
    const key = &#96;\${from}|\${days}&#96;;
    let hit = cache.get(key);
    if (!hit || Date.now() - hit.at &gt; TTL_MS) {
      hit = { body: req.timing.time('compute', () =&gt; usage(from, days)), at: Date.now() };
      cache.set(key, hit);
    }
    res.set('Cache-Control', 'private, max-age=60')
      .set('Age', String(Math.floor((Date.now() - hit.at) / 1000)))
      .json(hit.body);
  })
  .all(onlyAllow('GET'));</code></pre>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o after.json "http://localhost:4000/v2/reports/usage?from=2026-11-02&amp;days=30" -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE "^(HTTP|Server-Timing|Age|Cache-Control)"; done</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: private, max-age=60
Age: 0
Server-Timing: auth;dur=0.12, validate;dur=0.58, compute;dur=4.22, total;dur=6.31
HTTP/1.1 200 OK
Cache-Control: private, max-age=60
Age: 0
Server-Timing: auth;dur=0.07, validate;dur=0.13, compute;dur=2.92, total;dur=3.66</div>
<pre><code class="language-bash">cmp before.json after.json &amp;&amp; echo "same answer"</code></pre>
<div class="out">same answer</div>
<pre><code class="language-bash">TOKEN=$(cat ../lan.jwt) CONC=5 node perf/report-mixed.mjs</code></pre>
<div class="out">report: 515.9 req/s · p50 9 ms · p99 26 ms · 2xx 5159 · non-2xx 0
GET /v2/labs trong lúc đó: 299 lần · p50 12.0 ms · p99 40.8 ms · max 49.6 ms · mã {"200":299}</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o after.json "http://localhost:4000/v2/reports/usage?from=2026-11-02&amp;days=30" -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE "^(HTTP|Server-Timing|Age|Cache-Control)"; done</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: private, max-age=60
Age: 0
Server-Timing: auth;dur=0.12, validate;dur=0.62, compute;dur=4.11, total;dur=6.05
HTTP/1.1 200 OK
Cache-Control: private, max-age=60
Age: 0
Server-Timing: auth;dur=0.06, validate;dur=0.13, total;dur=0.71</div>
<pre><code class="language-bash">TOKEN=$(cat ../lan.jwt) CONC=5 node perf/report-mixed.mjs</code></pre>
<div class="out">report: 4532.2 req/s · p50 0 ms · p99 6 ms · 2xx 45315 · non-2xx 0
GET /v2/labs trong lúc đó: 433 lần · p50 1.7 ms · p99 22.9 ms · max 31.8 ms · mã {"200":433}</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bản khởi đầu · 2,9 báo cáo/s</span><span class="lz-lnote">server 335 ms mỗi báo cáo; người đứng ngoài p50 3.120 ms</span></div>
  <div class="lz-layer"><span class="lz-lname">Một lượt quét · 516 báo cáo/s</span><span class="lz-lnote">compute 3–4 ms; người đứng ngoài p50 12 ms — cùng từng byte (cmp)</span></div>
  <div class="lz-layer"><span class="lz-lname">Một lượt quét + cache 60 s · 4.532 báo cáo/s</span><span class="lz-lnote">câu trả lời từ cache tốn 0,7 ms; người đứng ngoài p50 1,7 ms</span></div>
</div>
<p>Thuật toán cho ~180 lần, cache thêm ~9 lần. Thứ tự quan trọng: đặt cache trước bản 335 ms thì LabFlow vẫn đứng hình mỗi phút một lần cho mỗi truy vấn, và mỗi lần quản lý gõ một ngày <code>from</code> mới.</p>
<p><strong>5 · Hai bản.</strong></p>
<pre><code class="language-bash">for i in $(seq 1 250); do curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4003/v2/labs; done | sort | uniq -c</code></pre>
<div class="out"> 105 200
 145 429</div>
<pre><code class="language-bash">for i in $(seq 1 250); do curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8080/v2/labs; done | sort | uniq -c</code></pre>
<div class="out"> 210 200
  40 429</div>
<p>105 so với 210: giới hạn “100 lần mỗi phút mỗi IP” ghi trong tài liệu thật ra là 100 × số bản (vài lần dư là do xô được nạp lại trong lúc chạy). Bộ đếm phải nằm ở kho dùng chung (một dòng PostgreSQL hoặc khoá Redis tăng nguyên tử) hoặc ở gateway đứng trước cả hai. Cache báo cáo riêng từng bản thì chấp nhận được: mỗi bản sao cũ tối đa 60 giây, đúng như <code>Cache-Control</code> và <code>Age</code> đã hứa — hai bản có thể lệch nhau tới một phút, và điều đó đã được viết ra.</p>
<p><strong>6 · Cam kết.</strong> Path thêm vào <code>openapi.yaml</code> (lint “valid”, cổng so với 2.1.0: “GET /reports/usage: thao tác mới — không có thay đổi phá vỡ”), và đã kiểm với một response thật bằng Ajv:</p>
<pre><code class="language-yaml">  /reports/usage:
    get:
      tags: [Reports]
      operationId: getUsageReport
      parameters:   # from: date, bắt buộc · days: 1–92, mặc định 30
      responses:
        '200': … rows[] { day, labId, bookings, hours } + Cache-Control, Age
        '400': { $ref: '#/components/responses/InvalidQuery' }
        '401': { $ref: '#/components/responses/Unauthenticated' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '503': { $ref: '#/components/responses/Unavailable' }</code></pre>
<pre><code class="language-markdown">| GET /v2/reports/usage | 2xx và &lt; 1 s, đo từ ngoài | 99,5% / 30 ngày | 3,6 giờ |
Quá tải: tối đa 2 lượt tính cùng lúc mỗi instance ⇒ 503 OVERLOADED + Retry-After: 1. Kết quả có thể cũ tới 60 s (Age).</code></pre>
<p>Vì sao giữ <code>limitInflight(2)</code> khi nhiệm vụ 2 cho thấy nó không từ chối gì? Báo cáo sẽ không đồng bộ mãi: khi lượt đặt nằm trong PostgreSQL (Chương 12) nó thành truy vấn có <em>chờ</em>, và lúc đó giới hạn này bảo vệ pool kết nối CSDL.</p>
<p><strong>Thảo luận:</strong> ngày là ngày theo UTC, nên lượt đặt lúc 06:00 giờ Việt Nam (UTC+7) sẽ rơi vào hôm trước. Nếu toà nhà mở cửa từ 06:00, bạn đổi gì trong hợp đồng?</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch8.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API cuối Chương 8 (labflow-api-ch8.zip)</span><span class="lc-sub">Code của chương = lời giải lab này, mọi script perf/ của chương, OpenAPI 2.2.0, docs/slo.md và lab/reports-starter.js. npm install, rồi npm test.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📌 Lab này cho thấy</h3>
<ul>
  <li>Một handler đồng bộ chậm bắt một endpoint không liên quan phải chờ: cùng mức tải, p50 danh sách phòng là 3,1 giây với bản khởi đầu và 1,7 ms sau khi sửa (~1.800 lần).</li>
  <li>Bỏ bớt tải không chữa được chặn event loop; sửa thuật toán thì được (~180 lần), và chỉ sau đó cache mới đáng thêm (~9 lần nữa).</li>
  <li>Đúng được kiểm từng byte trước khi ăn mừng nhanh.</li>
  <li>Thứ gì đếm riêng từng bản — giới hạn, cache — hoặc chuyển sang chỗ dùng chung, hoặc được viết vào hợp đồng đúng như nó thật sự chạy.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 8.8 Quiz (bài MỚI) ─────────────────────────── */
    {
      title: '8.8 — Chapter 8 check: thinking in systems|||8.8 — Kiểm tra Chương 8: tư duy hệ thống',
      slug: 'api-8-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về Server-Timing, test tải và 429, event loop bị chặn, đường truyền chậm, hai instance, giành khoá nguyên tử, tính sẵn sàng nối tiếp, sụp vì nghẽn, giới hạn đang-xử-lý và suy giảm khi CSDL sập; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Chapter 8 check: thinking in systems</h2>
<p class="lead">Ten situations from the chapter’s measurements: the latency table, a load test that lied, a blocked event loop, a slow link, two instances, an error budget, overload and a database outage. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can split a response time into legs with Server-Timing and say which leg to attack.</li>
  <li>I can run a mixed load test, read its status codes and percentiles, and find a blocked event loop.</li>
  <li>I can predict how long a response takes on a slow link and shrink it with contract rules.</li>
  <li>I can list what breaks when an API runs as several instances, and move that state out.</li>
  <li>I can turn an SLO into minutes, shed load with 503 + Retry-After, and decide what each endpoint does during an outage.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Kiểm tra Chương 8: tư duy hệ thống</h2>
<p class="lead">Mười tình huống từ chính các phép đo của chương: bảng độ trễ, một bài test tải nói dối, event loop bị chặn, đường truyền chậm, hai bản chạy song song, ngân sách lỗi, quá tải và CSDL sập. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi tách được thời gian trả lời thành từng chặng bằng Server-Timing và nói được nên nhắm chặng nào.</li>
  <li>Tôi chạy được test tải trộn, đọc mã trạng thái và phân vị, và tìm ra event loop bị chặn.</li>
  <li>Tôi đoán được một response mất bao lâu trên đường truyền chậm và làm nó nhỏ lại bằng luật hợp đồng.</li>
  <li>Tôi kể được những gì hỏng khi API chạy nhiều bản, và đưa trạng thái đó ra ngoài.</li>
  <li>Tôi đổi được SLO ra phút, bỏ bớt tải bằng 503 + Retry-After, và quyết định mỗi endpoint làm gì khi có sự cố.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "Server-Timing on login showed validate;dur=0.11, scrypt;dur=31.19, total;dur=32.00. What is the right next step to make login faster?|||Server-Timing của đăng nhập ghi validate;dur=0.11, scrypt;dur=31.19, total;dur=32.00. Bước tiếp theo đúng để đăng nhập nhanh hơn là gì?",
            options: [
              "Make the Zod validation faster, because it runs on every request|||Làm bước kiểm Zod nhanh hơn, vì nó chạy ở mọi request",
              "Accept that 97% is scrypt, which is slow on purpose; protect it (async, limits) instead of trimming the other 3%|||Chấp nhận 97% là scrypt, vốn chậm có chủ đích; bảo vệ nó (bất đồng bộ, giới hạn) thay vì gọt 3% còn lại",
              "Lower scrypt’s cost until login takes under 1 ms|||Giảm độ khó của scrypt cho tới khi đăng nhập dưới 1 ms",
              "Cache the login response for 60 seconds per email|||Cache câu trả lời đăng nhập 60 giây theo email",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lessons 8.1–8.2. Attack the biggest leg — but this one is a security feature (6.1); weakening it helps attackers. Make it non-blocking and limit concurrency. Validation is 0.11 ms of 32.|||VI: Bài 8.1–8.2. Nhắm chặng lớn nhất — nhưng chặng này là tính năng bảo mật (6.1); làm yếu nó là giúp kẻ tấn công. Hãy làm nó không chặn và giới hạn số lượt cùng lúc. Bước kiểm chỉ 0,11 trong 32 ms.",
          },
          {
            question: "autocannon on GET /v2/labs reported 8,258 req/s, 116 2xx and 82,460 non-2xx. What did the test measure?|||autocannon vào GET /v2/labs báo 8.258 req/s, 116 lần 2xx và 82.460 lần không phải 2xx. Bài test đã đo gì?",
            options: [
              "LabFlow’s real capacity for the lab list: about 8,000 requests per second|||Sức chịu thật của danh sách phòng: khoảng 8.000 request mỗi giây",
              "The speed of autocannon itself, unrelated to LabFlow|||Tốc độ của bản thân autocannon, không liên quan LabFlow",
              "A crash of the server after 116 requests|||Server sập sau 116 request",
              "How fast LabFlow answers 429 from its own per-IP rate limit|||LabFlow trả 429 từ chính giới hạn tần suất theo IP nhanh cỡ nào",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 8.2. The limit is 100 per minute per IP (5.3); almost every answer was a fast 429. Always read the status codes. With the limit raised for the test: 9,414 req/s, all 2xx.|||VI: Bài 8.2. Giới hạn là 100 lần mỗi phút mỗi IP (5.3); gần như mọi câu trả lời là 429 nhanh. Luôn đọc mã trạng thái. Nâng giới hạn khi test: 9.414 req/s, toàn 2xx.",
          },
          {
            question: "With scryptSync and 10 connections logging in, GET /v2/labs went from p99 3.3 ms to 463 ms. Why?|||Với scryptSync và 10 kết nối đăng nhập liên tục, GET /v2/labs từ p99 3,3 ms lên 463 ms. Vì sao?",
            options: [
              "Node’s single JavaScript thread was busy 31 ms per login, so the lab list waited in the queue|||Luồng JavaScript duy nhất của Node bận 31 ms mỗi lượt đăng nhập, nên danh sách phòng phải xếp hàng",
              "The database was overloaded by logins|||CSDL bị đăng nhập làm quá tải",
              "The lab list also hashes a password on each request|||Danh sách phòng cũng băm mật khẩu ở mỗi request",
              "The libuv threadpool had only 4 threads|||Threadpool của libuv chỉ có 4 luồng",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 8.2. Sync work holds the event loop; every endpoint queues behind it. The threadpool is the FIX (async scrypt: p99 8 ms), not the cause — scryptSync never used it. LabFlow’s data is in RAM, no database involved.|||VI: Bài 8.2. Việc đồng bộ giữ chặt event loop; mọi endpoint xếp hàng phía sau. Threadpool là cách SỬA (scrypt bất đồng bộ: p99 8 ms), không phải nguyên nhân — scryptSync không hề dùng nó. Dữ liệu LabFlow nằm trong RAM, không có CSDL nào ở đây.",
          },
          {
            question: "Through a simulated 1 Mbit/s link with 40 ms each way, 100 bookings took 319 ms uncompressed and 103 ms with gzip. Which statement is right?|||Qua đường truyền giả lập 1 Mbit/s, trễ 40 ms mỗi chiều, 100 lượt đặt mất 319 ms khi không nén và 103 ms khi có gzip. Câu nào đúng?",
            options: [
              "Compression made the server faster|||Nén làm server nhanh hơn",
              "Transfer time is size ÷ bandwidth: 25,501 B ≈ 204 ms vs 1,688 B ≈ 14 ms, plus 80 ms of delay; the server spent 2–3 ms|||Thời gian truyền = kích thước ÷ băng thông: 25.501 B ≈ 204 ms so với 1.688 B ≈ 14 ms, cộng 80 ms trễ; server chỉ tốn 2–3 ms",
              "On localhost the same difference would be visible|||Trên localhost cũng thấy được chênh lệch đó",
              "gzip should also be applied to the 101-byte lab|||Nên gzip cả phòng lab 101 byte",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 8.3. The contract got cheaper, not the server faster. On localhost the 25 KB answer took 3 ms. Bodies under the 1 KB threshold are sent as is.|||VI: Bài 8.3. Hợp đồng rẻ đi, server không nhanh hơn. Trên localhost câu trả lời 25 KB mất 3 ms. Body dưới ngưỡng 1 KB được gửi nguyên.",
          },
          {
            question: "Two LabFlow instances behind round-robin: which of these kept working WITHOUT any change?|||Hai bản LabFlow sau bộ chia lần lượt: thứ nào vẫn chạy mà KHÔNG cần sửa gì?",
            options: [
              "The booking limit of 5 per minute per user|||Giới hạn 5 lượt đặt mỗi phút mỗi người",
              "Idempotency-Key replays|||Phát lại theo Idempotency-Key",
              "The 409 check for overlapping bookings|||Phép kiểm 409 cho lượt đặt trùng giờ",
              "JWT authentication|||Xác thực bằng JWT",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 8.4. A JWT carries its own claims; the secret is shared configuration. The other three lived in one process’s RAM: 8/8 bookings passed a limit of 5, the same key gave two 201s, and two bk_1 were created for the same slot.|||VI: Bài 8.4. JWT tự mang thông tin của nó; khoá bí mật là cấu hình dùng chung. Ba thứ kia nằm trong RAM của một tiến trình: 8/8 lượt đặt vượt giới hạn 5, cùng khoá cho hai 201, và hai bk_1 được tạo cho cùng một ca.",
          },
          {
            question: "Why does the shared idempotency table claim a key with INSERT … ON CONFLICT DO NOTHING instead of SELECT then INSERT?|||Vì sao bảng idempotency dùng chung giành khoá bằng INSERT … ON CONFLICT DO NOTHING thay vì SELECT rồi INSERT?",
            options: [
              "Between a SELECT and an INSERT another instance can do the same and both proceed; one statement on a primary key lets exactly one win|||Giữa SELECT và INSERT, một bản khác có thể làm y hệt và cả hai cùng đi tiếp; một câu lệnh trên khoá chính chỉ cho đúng một bên thắng",
              "It is shorter to write|||Viết ngắn hơn",
              "PostgreSQL does not allow SELECT on tables with jsonb columns|||PostgreSQL không cho SELECT trên bảng có cột jsonb",
              "It makes the key expire after 24 hours|||Nó làm khoá hết hạn sau 24 giờ",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 8.4. The atomic claim is the whole fix: B created bk_1, A replayed it with Idempotent-Replayed: true. Expiry is a separate DELETE.|||VI: Bài 8.4. Giành khoá nguyên tử chính là toàn bộ cách sửa: B tạo bk_1, A phát lại với Idempotent-Replayed: true. Hết hạn là một câu DELETE riêng.",
          },
          {
            question: "A booking synchronously depends on a balancer (99.99%), LabFlow (99.95%), PostgreSQL (99.95%) and an e-mail provider (99.9%). Its best possible availability is…|||Một lượt đặt phụ thuộc ĐỒNG BỘ vào bộ cân bằng tải (99,99%), LabFlow (99,95%), PostgreSQL (99,95%) và nhà cung cấp email (99,9%). Tính sẵn sàng tốt nhất có thể của nó là…",
            options: [
              "99.99%, the best component|||99,99%, thành phần tốt nhất",
              "99.9%, the worst component|||99,9%, thành phần tệ nhất",
              "About 99.79% — about 1.5 hours of failure per 30 days|||Khoảng 99,79% — khoảng 1,5 giờ hỏng mỗi 30 ngày",
              "100%, because there are two LabFlow instances|||100%, vì có hai bản LabFlow",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 8.5. Availabilities in a chain multiply, so the whole is worse than any part. Sending the e-mail later from a queue lifts it to 99.89%.|||VI: Bài 8.5. Tính sẵn sàng nối tiếp thì nhân với nhau, nên tổng thể tệ hơn mọi thành phần. Gửi email sau qua hàng đợi nâng lên 99,89%.",
          },
          {
            question: "Without load shedding, 200 users logging in gave 12 answered logins/s and Lan waited 13 s after the test ended. What happened?|||Không bỏ bớt tải, 200 người đăng nhập cho 12 lượt được trả lời mỗi giây và cô Lan chờ 13 giây sau khi bài test kết thúc. Chuyện gì đã xảy ra?",
            options: [
              "The server crashed and restarted|||Server sập rồi khởi động lại",
              "The threadpool grew to 200 threads and ran out of memory|||Threadpool tăng lên 200 luồng và hết bộ nhớ",
              "The per-email login limit blocked most students|||Giới hạn đăng nhập theo email chặn phần lớn sinh viên",
              "Congestion collapse: the server kept computing scrypt for requests whose clients had already timed out|||Sụp vì nghẽn: server vẫn tính scrypt cho những request mà client đã bỏ đi vì hết giờ",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 8.5. Throughput stayed high; goodput fell. 1,990 abandoned requests were still worked on. Each email was different, so the login limit never triggered; the pool stays at 4.|||VI: Bài 8.5. Thông lượng vẫn cao; goodput tụt. 1.990 request bị bỏ rơi vẫn được làm. Mỗi lần một email khác nên giới hạn đăng nhập không bao giờ bật; pool vẫn 4 luồng.",
          },
          {
            question: "In Lab 8, limitInflight(2) on the slow synchronous report shed nothing and helped nothing. Why?|||Trong Lab 8, limitInflight(2) trên báo cáo đồng bộ chậm không từ chối gì và không giúp gì. Vì sao?",
            options: [
              "2 is too high; it should be 1|||2 là quá cao; phải là 1",
              "A synchronous handler finishes before the next request is read, so “in flight” never exceeds one; shedding protects work that waits|||Handler đồng bộ làm xong trước khi request kế tiếp được đọc, nên “đang xử lý” không bao giờ quá một; bỏ bớt tải bảo vệ việc có chờ",
              "limitInflight only works on POST|||limitInflight chỉ chạy với POST",
              "The rate limit ran first and rejected the extra requests|||Giới hạn tần suất chạy trước và đã từ chối các request dư",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lab 8. Fix the blocking first (one pass: 2.9 → 516 reports/s), then cache (4,532/s). The limit stays for when the report becomes a database query that waits.|||VI: Lab 8. Gỡ chặn trước (một lượt quét: 2,9 → 516 báo cáo/s), rồi cache (4.532/s). Giới hạn được giữ cho lúc báo cáo thành một truy vấn CSDL có chờ.",
          },
          {
            question: "The database is down. Which design does LabFlow’s contract choose?|||CSDL sập. Hợp đồng của LabFlow chọn thiết kế nào?",
            options: [
              "Lab list: 200 with the last good copy + Age + LabFlow-Degraded; booking: 503 DEPENDENCY_DOWN + Retry-After; /ready 503, /health 200|||Danh sách phòng: 200 với bản tốt gần nhất + Age + LabFlow-Degraded; đặt phòng: 503 DEPENDENCY_DOWN + Retry-After; /ready 503, /health 200",
              "Bookings return 201 and are saved later|||Đặt phòng trả 201 rồi lưu sau",
              "/health returns 503 so the platform restarts every instance|||/health trả 503 để nền tảng khởi động lại mọi bản",
              "Every endpoint returns 500 until the database is back|||Mọi endpoint trả 500 cho tới khi CSDL trở lại",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 8.6. Dependencies belong in readiness — liveness failing would restart everything into the same broken database. Never answer 2xx for something not saved.|||VI: Bài 8.6. Phụ thuộc thuộc về readiness — liveness trượt sẽ khởi động lại mọi thứ vào đúng cái CSDL đang hỏng. Không bao giờ trả 2xx cho thứ chưa lưu.",
          },
        ],
      },
    },
  ],
};
