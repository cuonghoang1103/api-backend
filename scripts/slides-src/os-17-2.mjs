/**
 * os-17-2 — khoá "Operating Systems for Developers", bài 17.2 "Project 2: a thread-pool HTTP server" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c172-server.out.txt qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-17-2.mjs.
 */
import { lamDeck, sh, box, steps, vsd, flow } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-17-2', code: 'OS 17.2', title: 'Project 2: a thread-pool HTTP server', sub: 'Operating Systems · Chapter 17 — Capstone' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const V = (pre, n = 1) => grab('c172-server', pre, n, { drop: /^# / });

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 17 — Capstone', bai: '17.2',
}, [
  { cover: true, t: 'Project 2:<br>a thread-pool HTTP server', sub: 'Bounded queue, timeouts, graceful shutdown — and Little’s law measured under load' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The brief for <code class="i">tpserver</code>: one accept thread, N workers, a <b>bounded</b> queue</li>
<li>503 when full, 408 for silent clients, a clean exit on <b>SIGTERM</b></li>
<li>Nine acceptance tests — and two planted bugs they catch</li>
<li>A load generator and <b>Little’s law</b> in real numbers</li>
<li>Threads for waiting work vs computing work</li>
</ul>` },

  { t: 'The architecture in one line', giua: true, to: true, body: flow([
    { t: 'accept', s: 'one thread', mau: '#336791' }, { t: 'queue (Q)', s: 'full ⇒ 503 now', mau: '#e08a1e' },
    { t: 'N workers', s: 'deadline ⇒ 408', mau: '#2f7d4f' }, { t: 'reply + close', s: 'one write', mau: '#2f7d4f' },
  ], { fs: 21 }) + box('SIGTERM', 'close the listener ⇒ drain running + queued work ⇒ join with an 8 s deadline ⇒ exit 0.', 'lam') },

  { t: 'Contract and marks', giua: true, body: bang(['#', 'What the test checks', 'Marks'], [
    ['S1', '/, /healthz, 404', '1'], ['S2', 'exactly N workers; 8 × 500 ms on 4 threads ≈ 1 s', '2.5'],
    ['S3', '2 threads + queue 2, 10 clients ⇒ 4 served, 6 × 503 at once', '2'], ['S4', 'silent client ⇒ 408 after T ms, worker free again', '1.5'],
    ['S5', 'after SIGTERM: refused, in-flight 200, exit 0', '2'], ['S6', 'no fd leak after thousands of requests', '1'],
  ], 20) + box('', 'Command line: <code class="i">tpserver PORT --threads N --queue Q --timeout-ms T</code> — any language that follows it can be tested.', '') },

  { t: 'Four days', giua: true, to: true, body: steps([
    '<b>Socket + one thread</b>: parse the request line, answer in one write',
    '<b>The pool</b>: ring buffer + mutex + condition variable; full ⇒ 503',
    '<b>Timeouts</b>: poll with a deadline; send with MSG_NOSIGNAL',
    '<b>Shutdown + measuring</b>: signalfd, drain, join; then loadgen',
  ]) },

  { t: 'The reference passes all nine tests', giua: true, body: term(V('wc -l server/tpserver.c', 2), 15) },

  { t: 'Two planted bugs, two failing tests', giua: true, body: term(V("sed 's|        close(fd);", 2), 15) +
    box('', 'No close(fd): 6 → 54 fds. No signal mask: SIGTERM kills at once — exit 143, the running request gets nothing.', 'do2') },

  { t: 'Little’s law: more clients, same throughput, more wait', giua: true, body: term(V('/tmp/lg 127.0.0.1 8001', 3), 16) +
    box('', '4 threads × 10 ms ⇒ ≤ 400/s. With 64 clients: W = 64 / 347 ≈ 184 ms — measured p50 182 ms.', 'lam') },

  { t: 'A bounded queue bounds latency', giua: true, body: term(V('/tmp/lg 127.0.0.1 8002'), 18) +
    box('', 'Queue 8: (4 + 8) / 4 × 10 ms ≈ 30 ms ⇒ p50 31.1, p99 32.3 ms; the rest get 503 at once. Unbounded: p99 204 ms.', 'xanh') },

  { t: 'Threads help waiting work, not computing work', giua: true, body: term(V('/tmp/lg 127.0.0.1 8003', 3), 14) +
    box('', 'Waiting: 32 threads ⇒ 2,865/s. CPU-bound on 4 cores: 1 → 190/s, 4 → 727/s, 16 → 634/s with 3× the p95.', 'lam') },

  { t: 'Graceful shutdown, from the server’s log', giua: true, body: term(V('(for i in 1 2 3; do curl'), 17) +
    box('', 'Two running, one queued at the signal; all three answered; exit 0 after 1.4 s — inside docker stop’s 10 s.', 'xanh') },

  { t: 'Pitfall: "more threads" as a fix', giua: true, to: true, body: vsd(
    'Raise Tomcat threads from 200 to 2,000 because noon is slow.',
    'Measure whether requests <b>wait</b> or <b>compute</b>, apply Little’s law, cap the queue — then size the pool.') },

  { t: 'What to put on your CV', giua: true, to: true, body: box('One line', '"Built a multithreaded HTTP server in C (pthreads): bounded queue with 503 load shedding, per-request deadlines (408), graceful SIGTERM drain via signalfd; load-tested with a custom generator (Little’s law: 64 clients ⇒ 182 ms p50 at 347 req/s)."', 'xanh') +
    box('Bring', 'the load-report table — each number with one sentence of explanation.', 'lam') },

  { t: 'Practice: noon is slow, CPU is at 35 %', giua: true, to: true, body: `
<ol>
<li>4 threads, queue 4096, <code class="i">/work?ms=10</code> at 4, 16, 64 clients: λ × W?</li>
<li>Same with queue 8: p99 and 503 count</li>
<li><code class="i">/cpu?n=2</code> at 1, nproc, 4 × nproc threads</li>
<li>Three sentences for the team: queueing or computing? what to change?</li>
</ol>` + box('Done when', 'λ × W within 10 % of the client count, and your advice names the 10 ms wait as the bottleneck.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>N threads × 10 ms ⇒ ≤ N / 0.01 s; extra clients only add latency</li>
<li>Little: 64 / 347 ≈ 184 ms predicted, 182 ms measured</li>
<li>Bounded queue: p99 32 ms instead of 204 ms, plus fast 503s</li>
<li>Threads help waiting, hurt computing beyond the core count</li>
<li>SIGTERM: signalfd → close listener → drain → exit 0</li>
</ul>` },
]);
