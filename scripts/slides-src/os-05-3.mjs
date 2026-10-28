/**
 * os-05-3 — khoá "Operating Systems for Developers", bài 5.3 "Semaphores, RW locks, atomics/CAS and memory visibility"
 * (28/10/2026). Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c53-sem.out.txt (chạy thật trong ảnh os-lab) qua grab().
 * Nhúng vào bài bằng giang/os-05-3.mjs.
 */
import { lamDeck, sql, sh, two as two0, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-05-3', code: 'OS 5.3', title: 'Semaphores, RW locks, atomics and visibility', sub: 'Operating Systems · Chapter 5' };

const g = (pre, n = 1) => grab('c53-sem', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const big = (t, o = {}) => sh(t, { ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e';

/* Slide 4: 3 "chỗ" của semaphore × 4 đợt 100 ms — 10 yêu cầu */
const waves = () => {
  const X = 140, cw = 220;
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  for (let slot = 0; slot < 3; slot++) s += T(X - 14, 52 + slot * 58, `slot ${slot + 1}`, 19, { a: 'end', w: 700, f: BL });
  let req = 1;
  for (let w = 0; w < 4; w++) {
    s += T(X + w * cw + cw / 2, 18, `${w * 100}–${(w + 1) * 100} ms`, 16, { a: 'middle', f: '#888' });
    for (let slot = 0; slot < 3 && req <= 10; slot++, req++) {
      s += R(X + w * cw + 4, 28 + slot * 58, cw - 8, 44, BL + '1c', BL) + T(X + w * cw + cw / 2, 57 + slot * 58, `request ${req}`, 19, { a: 'middle', m: 1 });
    }
  }
  s += T(X, 220, 'Requests 4–10 are not rejected — they WAIT in sem_wait() until a slot is posted back.', 20, { f: OR, w: 700 });
  return s + T(X, 246, `⌈10 / 3⌉ = 4 waves × 100 ms ≈ 400 ms   (measured: ${g('./sem 3').match(/total=([0-9]+) ms/)[1]} ms)`, 19, { f: '#555' }) + '</svg>';
};

/* Slide 11: hai lõi, mỗi lõi một store buffer */
const storeBuf = () => {  // mũi tên đi NGOÀI hộp store buffer để không đâm chữ
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial"><defs><marker id="sb-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  [[30, 'Core A', 'x = 1;  r1 = y;', 'x = 1 (waiting)'], [590, 'Core B', 'y = 1;  r2 = x;', 'y = 1 (waiting)']].forEach(([x, n, code, buf]) => {
    s += R(x, 8, 490, 64, '#eef4fa', BL) + T(x + 16, 34, n, 20, { w: 800, f: BL }) + T(x + 16, 60, code, 18, { m: 1 });
    s += R(x + 70, 92, 400, 46, '#fff4e5', OR) + T(x + 270, 121, `store buffer: ${buf}`, 17, { a: 'middle', m: 1, f: '#8a4b00' });
  });
  s += R(30, 186, 1050, 54, '#f3f3f3', '#999') + T(555, 219, 'shared cache / memory:  x = 0,  y = 0   ← both loads read here', 19, { a: 'middle', m: 1 });
  s += `<line x1="50" y1="72" x2="50" y2="182" stroke="#b85a2b" stroke-width="3" marker-end="url(#sb-a)"/>`;
  s += `<line x1="610" y1="72" x2="610" y2="182" stroke="#b85a2b" stroke-width="3" marker-end="url(#sb-a)"/>`;
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 5 — Synchronization', bai: '5.3',
}, [
  { cover: true, t: 'Semaphores, RW locks,<br>atomics and visibility', sub: 'More tools than a mutex —<br>and a bug no lock count shows' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Semaphore</b>: “at most N inside” — exactly your DB connection pool</li>
<li><b>Read-write lock</b>: many readers or one writer (readers–writers)</li>
<li><b>Compare-and-swap</b>: lock-free updates, and their retries</li>
<li><code class="i">AtomicLong</code> vs <code class="i">LongAdder</code>, and Node <code class="i">Atomics</code></li>
<li><b>Memory visibility</b>: a loop that never sees a flag, and the CPU reordering your code</li>
</ul>` },

  { t: 'A semaphore is a counter of permits', giua: true, body: two(
    sql(`sem_init(&slots, 0, 3);   // 3 permits

void *request(void *arg) {
    sem_wait(&slots);  // P: take or sleep
    query();           // 100 ms of work
    sem_post(&slots);  // V: give back
}`, { lang: 'c' }),
    `${cards([
      ['wait (P)', 'Take a permit; if none are left, sleep until one is posted.'],
      ['post (V)', 'Return a permit and wake one sleeper. Any thread may post — a semaphore has no owner.'],
    ], 1)}`) },

  { t: 'Limit 3: ten requests in four waves', giua: true, body: `
${big(g('./sem 0'))}
${big(g('./sem 3'))}
${waves()}` },

  { t: 'Your connection pool is a semaphore', giua: true, to: true, body: `
<ul>
<li>Prisma <code class="i">connection_limit</code>, HikariCP <code class="i">maximumPoolSize</code>, <code class="i">pg.Pool({ max })</code></li>
<li>Request N+1 does not fail — it <b>waits</b>; a too-small pool shows up as <b>latency</b>, not errors</li>
<li>A semaphore of 1 behaves like a mutex, but has <b>no owner</b>: good for signalling, risky as a lock</li>
</ul>
${box('Java', '<code>java.util.concurrent.Semaphore</code> — same two operations: <code>acquire()</code> and <code>release()</code>.', 'lam')}` },

  { t: 'Read-write lock: 99% reads, about twice the throughput', giua: true, body: `
${big(g('./rw mutex'))}
${big(g('./rw rwlock'))}
${cards([
    ['Readers together', 'Any number of <code class="i">rdlock</code> holders at once; a writer gets the table alone.'],
    ['Writer starvation', 'Steady readers can keep a writer waiting forever. glibc prefers readers by default.'],
    ['Measure first', 'For a few-instruction critical section the RW bookkeeping can make it slower than a mutex.'],
  ])}` },

  { t: 'Compare-and-swap: correct, with retries', giua: true, body: `
${sql(`long old = atomic_load(&counter);
// "if counter is STILL old, write old+1" — one instruction; on failure old is reloaded
while (!atomic_compare_exchange_weak(&counter, &old, old + 1)) retries++;`, { lang: 'c' })}
${big(g('./cas 1 '))}
${big(g('./cas 4 '))}
<p style="margin:0;font-size:22px">Lock-free ≠ contention-free: with 4 threads, more than one retry per increment.</p>` },

  { t: 'Java: LongAdder stops sharing one word', giua: true, body: `
${big(g('java Atomics.java'))}
${cards([
    ['AtomicLong', 'One shared word: 8 threads fight over one cache line (CAS / LDADD).'],
    ['LongAdder', 'A cell per thread, summed when you read — lesson 5.2’s <b>local</b> idea as a class. Use it for metrics.'],
    ['Node Atomics', `<code class="i">Atomics.add</code> on a SharedArrayBuffer: ${g('node race-sab.js atomics').split('\n')[1].replace(/^atomics: /, '')}.`],
  ])}` },

  { t: 'A flag the waiting thread never sees (C, -O2)', giua: true, body: two(
    sql(`int ready;          // plain int
void *waiter(void *arg) {
    while (!ready) {}   // read once?
    puts("saw ready = 1");
}
// main: sleep 100 ms; ready = 1;`, { lang: 'c' }),
    `${big(g('timeout 3 ./flag plain'))}
${big(g('./flag atomic'))}
<p style="margin:0;font-size:20px">exit 124 = killed by <code class="i">timeout</code>. The compiler may assume no data race, so it kept <code class="i">ready</code> in a register.</p>`) },

  { t: 'Java: the JIT hoists the read; volatile fixes it', giua: true, body: `
${big(g('timeout 5 java Stop.java plain'))}
${big(g('java Stop.java volatile'))}
${box('happens-before', 'The Java Memory Model only promises another thread sees a write if a synchronising edge orders them: <b>volatile</b>, <b>synchronized</b>, locks, atomics.', 'lam')}` },

  { t: 'The CPU reorders too: store buffers', giua: true, body: `
${storeBuf()}
<p style="margin:0;font-size:22px">Each core’s write waits in its own store buffer; its next load reads memory first. Both loads can see 0 — the “impossible” result.</p>` },

  { t: 'Relaxed: (0, 0) almost every run — seq_cst: never', giua: true, body: `
${big(g('./sb relaxed', 2))}
${big(g('objdump -d --no-show-raw-insn sb'))}
<p style="margin:0;font-size:21px">The relaxed code is <code class="i">str</code> then <code class="i">ldr</code> — your order; the <b>CPU</b> reordered. Sequentially-consistent atomics emit <code class="i">stlr</code>/<code class="i">ldar</code>: zero.</p>` },

  { t: '“Make it volatile and it is thread-safe”', giua: true, body: vsd(
    `<ul style="font-size:21px"><li><b>Java</b> volatile fixes visibility of a flag — but <code class="i">count++</code> on a volatile is still load–add–store</li><li><b>C/C++</b> volatile only stops register caching: no atomicity, no ordering. Lesson 5.2’s <code class="i">none</code> counter was volatile and lost 70%</li></ul>`,
    `<ul style="font-size:21px"><li>Flags and published references: Java <b>volatile</b>, C <code class="i">_Atomic</code></li><li>Read-modify-write: <b>atomics</b> or a <b>lock</b></li><li>Never a home-made flag protocol</li></ul>`,
    '✗ The myth', '✓ The rule') },

  { t: 'Cheat sheet — which tool', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:42%">You need…</th><th>Use</th></tr>
<tr><td>At most N at once (pool, rate)</td><td>semaphore — <code class="i">sem_wait/sem_post</code>, Java <code class="i">Semaphore</code></td></tr>
<tr><td>Mostly reads, rare writes</td><td>read-write lock (measure first)</td></tr>
<tr><td>One word, read-modify-write</td><td>atomic / CAS</td></tr>
<tr><td>Write-heavy counter</td><td><code class="i">LongAdder</code> / per-thread cells</td></tr>
<tr><td>Stop flag between threads</td><td>Java <code class="i">volatile</code> · C <code class="i">atomic_load/store</code></td></tr>
</table>
${box('Next', 'Lesson 5.4 — the same bugs in backend code: double booking, FOR UPDATE, Redis locks, idempotency.', 'lam')}` },
]);
