/**
 * os-03-5 — khoá "Operating Systems for Developers", bài 3.5 "Event loop vs thread pool" (28/10/2026).
 * Khuôn _pg-chung.mjs. Số liệu = CHẠY THẬT (lab/out/c35-loop.out.txt). Mặc định Spring Boot/HikariCP lấy từ tài liệu
 * chính thức (docs.spring.io application-properties; README HikariCP). Giảng: giang/os-03-5.mjs.
 */
import { lamDeck, sql, sh, two as two0, box, cards, vsd } from './_pg-chung.mjs';

export const deck = { key: 'os-03-5', code: 'OS 3.5', title: 'Event loop vs thread pool', sub: 'Operating Systems · Chapter 3' };

const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const MK = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', GY = '#8a8a8a', RD = '#c0392b';

/* Slide 3: hai kiến trúc */
const kienTruc = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial"><defs>${MK('a5', BR)}</defs>`;
  // Node
  s += R(10, 10, 530, 280, '#eef4fa', BL);
  s += T(275, 40, 'Node: one JS thread + event loop', 21, { a: 'middle', w: 800, f: BL });
  s += R(30, 60, 220, 100, '#fff', BL, { rx: 50 });
  s += T(140, 102, 'event loop', 19, { a: 'middle', w: 800, f: BL });
  s += T(140, 128, 'runs ready callbacks', 15, { a: 'middle', f: '#555' });
  s += T(140, 147, 'one at a time', 15, { a: 'middle', f: '#555' });
  s += R(290, 60, 230, 46, '#fff', GY, { rx: 6, sw: 1.5 });
  s += T(405, 89, 'epoll: 1000s of sockets', 16, { a: 'middle' });
  s += R(290, 116, 230, 46, '#fff', GY, { rx: 6, sw: 1.5 });
  s += T(405, 145, 'timers', 16, { a: 'middle' });
  s += T(140, 196, 'libuv pool (4 threads):', 17, { a: 'middle', w: 700, f: BL });
  [0, 1, 2, 3].forEach((k) => { s += R(40 + k * 52, 210, 42, 42, OR + '33', OR, { rx: 5, sw: 1.5 }); });
  s += T(380, 220, 'fs · dns.lookup', 16, { a: 'middle', f: '#555' });
  s += T(380, 244, 'crypto · zlib', 16, { a: 'middle', f: '#555' });
  s += T(275, 280, 'waits cost no thread', 16, { a: 'middle', w: 700, f: GR });
  // Tomcat
  s += R(570, 10, 530, 280, '#fff7ef', OR);
  s += T(835, 40, 'Spring Boot / Tomcat: thread per request', 21, { a: 'middle', w: 800, f: BR });
  s += R(590, 70, 140, 60, '#fff', GY, { rx: 6, sw: 1.5 });
  s += T(660, 98, 'accept', 17, { a: 'middle', w: 700 });
  s += T(660, 118, 'queue (100)', 15, { a: 'middle', f: '#555' });
  s += `<line x1="732" y1="100" x2="776" y2="100" stroke="${BR}" stroke-width="3" marker-end="url(#a5)"/>`;
  s += T(940, 72, 'pool: up to 200 threads', 17, { a: 'middle', w: 700, f: BR });
  for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) s += R(790 + k * 50, 86 + r * 50, 40, 40, BL + '22', BL, { rx: 5, sw: 1.5 });
  s += T(835, 254, 'each thread BLOCKS while its request waits (JDBC)', 16, { a: 'middle', f: '#555' });
  s += T(835, 280, 'waits cost one thread each', 16, { a: 'middle', w: 700, f: RD });
  return s + '</svg>';
};

/* Slide 7: pbkdf2 trên pool 4 vs 8 (đo thật) */
const poolGantt = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  const x0 = 210, u = 2.1; // 1 ms = 2.1 px → 360 ms ≈ 756 px
  s += T(20, 26, 'UV_THREADPOOL_SIZE=4 (default)', 19, { w: 800, f: BL });
  for (let k = 0; k < 4; k++) {
    const y = 40 + k * 26;
    s += T(x0 - 10, y + 18, 'worker ' + (k + 1), 14, { a: 'end', f: '#555' });
    s += R(x0, y, 176 * u, 22, BL + '44', BL, { rx: 3, sw: 1.5 });
    s += R(x0 + 176 * u, y, 175 * u, 22, OR + '44', OR, { rx: 3, sw: 1.5 });
  }
  s += T(x0 + 176 * u / 2, 160, 'hashes 1–4 done @176 ms', 15, { a: 'middle', w: 700, f: BL });
  s += T(x0 + 176 * u * 1.5, 160, 'hashes 5–8 done @351 ms', 15, { a: 'middle', w: 700, f: BR });
  s += T(20, 196, 'UV_THREADPOOL_SIZE=8', 19, { w: 800, f: GR });
  for (let k = 0; k < 8; k++) {
    const y = 206 + k * 9;
    s += R(x0, y, 182 * u, 7, GR + '55', GR, { rx: 2, sw: 1 });
  }
  s += T(x0 + 182 * u + 12, 248, 'all 8 done @171–182 ms', 16, { w: 700, f: GR });
  return s + '</svg>';
};

/* Slide 10: pool Java 10 / 200 / virtual */
const javaBars = () => {
  const rows = [['fixed pool of 10', 2166, '2 166 ms · 30 threads', RD], ['fixed pool of 200', 570, '570 ms · 173 threads', BL], ['virtual threads', 359, '359 ms · 31 threads', GR]];
  let s = `<svg viewBox="0 0 1110 220" width="1110" height="220" font-family="Arial">`;
  rows.forEach(([lab, v, txt, m], i) => {
    const y = 6 + i * 70, w = Math.max(6, Math.round(v / 2166 * 560));
    s += T(250, y + 40, lab, 21, { a: 'end', w: 700 });
    s += R(264, y + 12, w, 46, m + '33', m, { rx: 4, sw: 2 });
    s += T(276 + w, y + 42, txt, 20, { w: 800, f: m });
  });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 3 — Threads & scheduling', bai: '3.5',
}, [
  { cover: true, t: 'Event loop vs thread pool', sub: 'Node and Spring Boot under the same load —<br>200 ms database waits and CPU-heavy requests, measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why one Node thread serves <b>100 concurrent waits</b> in 277 ms</li>
<li>How one CPU-heavy callback <b>blocks every user</b> — and why <code class="i">async</code> does not help</li>
<li>Node’s hidden <b>libuv thread pool</b>: what uses it and how big it is</li>
<li>Thread-per-request (Tomcat): pool size, <b>Little’s law</b>, virtual threads</li>
<li>Spring Boot’s real defaults, and how to choose between the two models</li>
</ul>` },

  { t: 'Two designs for “thousands of requests”', giua: true, body: `
${kienTruc()}
${box('Both are scheduling decisions', 'An event loop is a non-preemptive FCFS scheduler on one thread. A thread pool is N preemptive workers scheduled by the kernel. Each has one way to fail badly.', 'lam')}` },

  { t: 'Node: one JS thread, 100 waits, 277 ms', giua: true, body: two(
    sql(`http.createServer((req, res) => {
  ...
  if (u.pathname === '/io')     // a DB-like wait
    return setTimeout(() => res.end('io done'), ms);
  if (u.pathname === '/cpu') {  // burns CPU
    const end = Date.now() + ms;
    while (Date.now() < end);
    return res.end('cpu done');
  }
  res.end('fast');
}).listen(8080);`, { lang: 'javascript', sm: true }),
    sh(`$ node load.js 'http://localhost:8080/io?ms=200' 100
100 concurrent requests: all done in 277 ms
  (fastest 231 ms, slowest 256 ms)
$ curl -s 'http://localhost:8080/lag'
worst event-loop delay since last check: 5 ms`, { sm: true })) + box('Waiting is not running', 'While a request waits, its callback is just an entry in a timer list (or an fd in epoll). The one JS thread runs other callbacks; the loop was never late by more than 5 ms.', 'xanh') },

  { t: 'Blocking the event loop: one slow request stalls all', giua: true, body: two(
    sh(`$ curl -s '.../cpu?ms=1500' > /dev/null &
$ sleep 0.1; curl -s -o /dev/null \\
    -w 'GET /fast took %{time_total} s\\n' .../fast
GET /fast took 1.393173 s
$ curl -s '.../lag'
worst event-loop delay since last check: 1491 ms
$ node load.js '.../cpu?ms=100' 10
10 concurrent requests: all done in 1037 ms
  (fastest 141 ms, slowest 1007 ms)`),
    `<ul style="font-size:22px">
<li><b>/fast</b> waited <b>1.39 s</b> behind one 1.5 s CPU callback</li>
<li>The loop was blocked for <b>1 491 ms</b></li>
<li>Ten 100 ms CPU requests ran <b>strictly one after another</b>: 1 037 ms</li>
<li>JS callbacks are never preempted: the event loop is <b>FCFS</b> — the convoy of lesson 3.2</li>
</ul>`, 'r64') },

  { t: '“I made it async, so it can’t block”', to: true, giua: true, body: `
${vsd(`<ul><li><code class="i">await heavyCpuWork()</code> runs on the JS thread</li><li>JSON.parse of 50 MB, sync bcrypt, a catastrophic regex, <code class="i">readFileSync</code>, building a big PDF — all block everyone</li></ul>`,
    `<ul><li><code class="i">await</code> only waits for work done <b>elsewhere</b>: kernel, libuv pool, another server</li><li>Move CPU work to <b>worker_threads</b> (Ch. 4), a job queue, or chunk it</li></ul>`, '✗ Myth', '✓ Reality')}` },

  { t: 'Node’s hidden pool: 8 hashes, 4 workers, 2 waves', giua: true, body: `
${poolGantt()}
${box('libuv thread pool', 'crypto.pbkdf2, zlib, fs and dns.lookup run on libuv’s pool, 4 threads by default. Threads before / after: 7 → 11 (four <code>libuv-worker</code>) → 15 with size 8. Set <code>UV_THREADPOOL_SIZE</code> before first use, from <code>os.availableParallelism()</code>.', 'lam')}` },

  { t: 'What goes where in Node', to: true, giua: true, body: `
${cards([
    ['JS thread (event loop)', 'Your callbacks, JSON, template rendering, any loop you write. <b>Never block it.</b>'],
    ['epoll (no thread)', 'Network sockets, timers. Thousands of connections cost no threads.'],
    ['libuv pool (4 threads)', 'File system, <code class="i">dns.lookup</code>, crypto, zlib. Queues when all 4 are busy.'],
  ])}
${box('Consequence', 'Lots of slow file reads or heavy crypto can queue behind 4 pool threads even while the event loop looks idle.', '')}` },

  { t: 'Java: one request, one thread from a pool', giua: true, body: two(
    sql(`ExecutorService pool = mode.equals("virtual")
    ? Executors.newVirtualThreadPerTaskExecutor()
    : Executors.newFixedThreadPool(n);
HttpServer s = HttpServer.create(
    new InetSocketAddress(8081), 1000);
s.createContext("/", ex -> {
  Thread.sleep(200);   // like a JDBC call: the thread BLOCKS
  ex.sendResponseHeaders(200, b.length);
  ...
});
s.setExecutor(pool);   // = Tomcat's worker pool`, { lang: 'java' }),
    `<ul style="font-size:22px">
<li>The handler <b>blocks</b> its thread for 200 ms, like a database call</li>
<li>Fixed pool of N = what Tomcat does inside Spring Boot</li>
<li>Or one <b>virtual thread</b> per request (Java 21)</li>
<li>Load: 100 concurrent requests</li>
</ul>`, 'r64') },

  { t: '100 requests that each wait 200 ms', giua: true, body: `
${javaBars()}
${box('Read it', 'Pool of 10: ten waves of 200 ms. Pool of 200: one wave, but 173 kernel threads. Virtual threads: one wave on 31 kernel threads.', 'xanh')}` },

  { t: 'Little’s law: the pool is a hard ceiling', to: true, giua: true, body: `
<p style="text-align:center;font-size:34px;margin:0"><b>throughput ≤ threads ÷ time per request</b></p>
${cards([
    ['Pool 10, 200 ms', '10 ÷ 0.2 s = <b>50 req/s</b><br>100 requests ⇒ ~2 s · measured <b>2.17 s</b> (46/s)'],
    ['Pool 200, 200 ms', '200 ÷ 0.2 s = 1 000 req/s<br>100 requests ⇒ one wave · measured 0.57 s'],
    ['Virtual threads', 'No pool ceiling; the <b>next</b> pool becomes the limit (DB connections)'],
  ])}
${box('Corollary', 'A bigger pool only helps while threads WAIT. For CPU-bound handlers the cores are the limit (lesson 3.3).', 'lam')}` },

  { t: 'What this means in Spring Boot', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>Property (official reference)</th><th>Default</th><th>Meaning</th></tr>
<tr><td><code class="i">server.tomcat.threads.max</code></td><td><b>200</b></td><td>worker threads — the pool size</td></tr>
<tr><td><code class="i">server.tomcat.threads.min-spare</code></td><td>10</td><td>threads kept idle</td></tr>
<tr><td><code class="i">server.tomcat.accept-count</code></td><td>100</td><td>connections queued when all threads are busy</td></tr>
<tr><td><code class="i">spring.threads.virtual.enabled</code></td><td>false</td><td>true (Java 21+) ⇒ virtual threads; threads.max ignored</td></tr>
<tr><td>HikariCP <code class="i">maximumPoolSize</code></td><td><b>10</b></td><td>DB connections — often the real ceiling</td></tr>
</table>
${box('The bottleneck moves', '200 Tomcat threads — or 10 000 virtual threads — still reach the database ten at a time.', 'do2')}` },

  { t: 'Choosing between them', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:24%">Workload</th><th>Node (event loop)</th><th>Spring Boot (pool / virtual threads)</th></tr>
<tr><td>Many slow I/O waits</td><td>Excellent: one thread, thousands of waits</td><td>Capped at threads ÷ latency; virtual threads remove the cap</td></tr>
<tr><td>CPU-heavy work in a request</td><td>Blocks everyone — worker_threads or a queue</td><td>Fine up to the number of cores, then queues</td></tr>
<tr><td>Blocking libraries (JDBC)</td><td>Must not run on the JS thread</td><td>The classic case for a pool</td></tr>
<tr><td>How it fails</td><td>One slow callback ⇒ latency spike for all</td><td>Pool exhausted ⇒ queue, timeouts; lock thrash (3.3)</td></tr>
</table>
${box('This site', 'cuongthai.com’s backend is Express on Node: any synchronous CPU-heavy step in a handler stalls every other user — exactly the 1.39 s /fast above.', 'lam')}` },

  { t: 'Cheat sheet — event loop and pools', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:44%">You want to…</th><th>Use</th></tr>
<tr><td>Detect a blocked event loop</td><td>a 10 ms timer’s lateness · <code class="i">perf_hooks.monitorEventLoopDelay</code></td></tr>
<tr><td>Size Node’s file/crypto pool</td><td><code class="i">UV_THREADPOOL_SIZE</code> (set before start)</td></tr>
<tr><td>Move CPU work off the JS thread</td><td><code class="i">worker_threads</code> · a job queue</td></tr>
<tr><td>Size a Tomcat pool</td><td>Little’s law · <code class="i">server.tomcat.threads.max</code></td></tr>
<tr><td>Many blocking waits in Java</td><td><code class="i">spring.threads.virtual.enabled=true</code></td></tr>
</table>
${box('Rule of thumb', 'Event loop: never block it. Thread pool: concurrency = threads, so throughput ≤ threads ÷ latency. Either way, find the next pool before it finds you.', 'xanh')}` },
]);
