/**
 * os-06-3 — khoá "Operating Systems for Developers", bài 6.3 "Dining philosophers, readers-writers, bounded buffer" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c63-philo.out.txt (ảnh os-lab, container vứt đi) qua grab().
 * Nhúng vào bài bằng giang/os-06-3.mjs.
 */
import { lamDeck, sql, sh, two as two0, box, cards } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-06-3', code: 'OS 6.3', title: 'Dining philosophers, readers-writers, bounded buffer', sub: 'Operating Systems · Chapter 6' };

const g = (pre, n = 1) => grab('c63-philo', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const big = (t, o = {}) => sh(t, { ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}">${s}</text>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b';

/* Bàn tròn 5 triết gia, 5 đũa. dead=true: mỗi người cầm đũa TRÁI (nét liền) và chờ đũa PHẢI (nét đứt đỏ). */
const table = (dead, w = 520) => {
  const cx = 260, cy = 190, R = 140, r = 78;
  let s = `<svg viewBox="0 0 520 380" width="${w}" height="${Math.round((w * 380) / 520)}" font-family="Arial"><defs><marker id="m63" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${RD}"/></marker></defs>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r + 18}" fill="#f7efe3" stroke="#c9b18a" stroke-width="3"/>`;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  const fang = (i) => ang(i) - Math.PI / 5;                       // đũa i nằm giữa P(i-1) và P(i) ⇒ P(i) dùng đũa i và i+1, khớp philo.c
  for (let i = 0; i < 5; i++) {
    const fx = cx + (r - 8) * Math.cos(fang(i)), fy = cy + (r - 8) * Math.sin(fang(i));
    s += `<rect x="${fx - 7}" y="${fy - 22}" width="14" height="44" rx="5" fill="#8a6d3b" transform="rotate(${(fang(i) * 180) / Math.PI + 90} ${fx} ${fy})"/>`;
    s += T(cx + (r - 40) * Math.cos(fang(i)), cy + (r - 40) * Math.sin(fang(i)) + 6, `f${i}`, 16, { a: 'middle', w: 700, f: '#8a6d3b' });
  }
  const P = [0, 1, 2, 3, 4].map((i) => [cx + R * Math.cos(ang(i)), cy + R * Math.sin(ang(i))]);
  if (dead) for (let i = 0; i < 5; i++) {
    const [px, py] = P[i];
    const hx = cx + (r - 8) * Math.cos(fang(i)), hy = cy + (r - 8) * Math.sin(fang(i));         // cầm đũa TRÁI = f(i)
    const wx = cx + (r - 8) * Math.cos(fang(i + 1)), wy = cy + (r - 8) * Math.sin(fang(i + 1)); // chờ đũa PHẢI = f(i+1)
    s += `<line x1="${px}" y1="${py}" x2="${hx}" y2="${hy}" stroke="${BL}" stroke-width="4"/>`;
    s += `<line x1="${px}" y1="${py}" x2="${(px + wx) / 2 + (wx - px) * 0.3}" y2="${(py + wy) / 2 + (wy - py) * 0.3}" stroke="${RD}" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#m63)"/>`;
  }
  for (const [i, [px, py]] of P.entries()) s += `<circle cx="${px}" cy="${py}" r="30" fill="#eef3f8" stroke="${BL}" stroke-width="3"/>` + T(px, py + 7, `P${i}`, 20, { a: 'middle', w: 800, f: BL });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 6 — Deadlock', bai: '6.3',
}, [
  { cover: true, t: 'Dining philosophers,<br>readers–writers, bounded buffer', sub: 'The three classic problems — run in C and Java,<br>solved three ways, and written the way the exam wants' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Run the <b>dining philosophers</b> and watch all five freeze</li>
<li>Solve it <b>three ways</b> — and measure throughput and fairness of each</li>
<li>See a deadlock-free solution that still <b>starves</b> four of five philosophers</li>
<li>Write <b>bounded buffer</b> and <b>readers–writers</b> with semaphores, exam style — and break one by swapping two lines</li>
</ul>` },

  { t: 'The problem (Dijkstra, 1965)', giua: true, body: two(
    table(false),
    `<ul style="font-size:22px">
<li>5 philosophers, 5 forks (here: chopsticks), one between each pair</li>
<li>To eat you need <b>both</b> neighbouring forks: left <code class="i">f(i)</code>, right <code class="i">f(i+1)</code> (P4's right fork is f0)</li>
<li>Think → pick up forks → eat → put them down, forever</li>
<li>Forks = locks, philosophers = threads. Any program that needs <b>two locks out of a shared set</b> is this problem</li>
</ul>`) },

  { t: 'Naive: left, then right — everyone freezes', giua: true, body: two(
    table(true, 400),
    `${sql(`take(left);         // fork i
usleep(100);        // a gap, as in real code
take(right);        // fork i+1
eat();
put(right); put(left);`, { lang: 'c', sm: true })}
<p style="margin:0;font-size:21px">Solid line = holds its <b>left</b> fork · dashed arrow = waits for its <b>right</b> fork, which the neighbour holds. A cycle of five.</p>`) + big(g('./philo naive')) },

  { t: 'Java confirms the cycle, thread by thread', giua: true, body: `
${big(g('java Philo.java naive'))}
<p style="margin:0;font-size:22px"><code class="i">ThreadMXBean.findDeadlockedThreads()</code> walks the same wait-for graph as <code class="i">jstack</code> (6.1): 0 → 1 → 2 → 3 → 4 → 0. All four Coffman conditions hold. Each fix below breaks one.</p>` },

  { t: 'Fix 1 — order the forks (break circular wait)', giua: true, body: `
${sql(`int a = min(left, right), b = max(left, right);   // P4 picks up fork 0 first, not fork 4
take(a); usleep(100); take(b);`, { lang: 'c', sm: true })}
${big(g('./philo ordered'))}
${cards([
    ['Why it works', 'Everyone climbs forks in increasing number, so the cycle 4 → 0 can never close.'],
    ['Throughput', 'Highest of the three: <b>12,412</b> meals in 2 s.'],
    ['Fairness', 'Uneven: P0 and P4 both start with fork 0 and eat ~half as much as P3.'],
  ])}` },

  { t: 'Fix 2 — a waiter: only 4 may sit (semaphore N−1)', giua: true, body: `
${sql(`sem_init(&seats, 0, N - 1);        // 4 seats for 5 philosophers
sem_wait(&seats);  take(left); usleep(100); take(right);  eat();  put(right); put(left);  sem_post(&seats);`, { lang: 'c', sm: true })}
${big(g('./philo waiter'))}
${cards([
    ['Why it works', 'With at most 4 at the table and 5 forks, by pigeonhole at least one has <b>both</b> forks.'],
    ['Throughput', '<b>11,345</b> meals — a little less: someone always waits for a seat.'],
    ['Fairness', 'Almost perfectly even: 2,265–2,271 each.'],
  ])}` },

  { t: 'Fix 3 — try the second fork, put the first back', giua: true, body: `
${sql(`for (;;) {
    take(left); usleep(100);
    if (pthread_mutex_trylock(&fork[right]) == 0) break;   // got both
    put(left);  usleep(rand_r(&seed) % 200);               // give back, random pause
}`, { lang: 'c', sm: true })}
${big(g('./philo trylock'))}
${cards([
    ['Why it works', 'Breaks <b>hold and wait</b>: never waits while holding a fork.'],
    ['Throughput', 'Lowest: <b>8,734</b> — time spent putting forks back and pausing.'],
    ['Catch', 'Without the random pause: livelock (6.2).'],
  ])}` },

  { t: 'Three solutions side by side (C, 2 s each)', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:24%">Solution</th><th style="width:22%">Breaks</th><th style="width:14%">Meals</th><th style="width:22%">Per philosopher</th><th>Notes</th></tr>
<tr><td>left then right</td><td>— (all four hold)</td><td>0</td><td>0 0 0 0 0</td><td>deadlock, exit 3</td></tr>
<tr><td>Ordered forks</td><td>circular wait</td><td>12,412</td><td>1,699 … 3,159</td><td>fastest, unfair</td></tr>
<tr><td>Waiter (sem 4)</td><td>circular wait</td><td>11,345</td><td>2,265 … 2,271</td><td>fair, needs an extra semaphore</td></tr>
<tr><td>Try-lock + backoff</td><td>hold and wait</td><td>8,734</td><td>1,701 … 1,828</td><td>no global rule needed; slowest</td></tr>
</table>
${box('Other answers you may see', '<b>Chandy–Misra</b> (1984): forks are dirty/clean and passed by request — scales to any graph of neighbours. <b>One global mutex</b> around picking up: correct, but only one philosopher picks up at a time.', 'lam')}` },

  { t: 'Deadlock-free is not starvation-free (Java)', giua: true, body: `
${big(g('java Philo.java ordered', 2))}
<ul style="font-size:22px">
<li>Same ordered fix, Java <code class="i">ReentrantLock</code> (non-fair by default): <b>P3 ate 8,407 times, P0, P1 and P4 once each</b></li>
<li>A thread that releases a lock and immediately asks again usually wins — it is already running; the woken waiter is not</li>
<li><code class="i">new ReentrantLock(true)</code> (fair) or the waiter fix spreads it out — at a throughput cost</li>
</ul>` },

  { t: 'Bounded buffer with semaphores — exam form', giua: true, body: two(
    sql(`semaphore empty = N;   // free slots
semaphore full  = 0;   // filled slots
semaphore mutex = 1;   // protects in/out

producer:              consumer:
  wait(empty);           wait(full);
  wait(mutex);           wait(mutex);
  put(item);             item = take();
  signal(mutex);         signal(mutex);
  signal(full);          signal(empty);`, { lang: 'c' }),
    `${term(g('./bb right'))}
<ul style="font-size:21px">
<li><b>empty/full</b> count slots: they make you <b>wait for room or data</b></li>
<li><b>mutex</b> only guards the few lines that touch the buffer</li>
<li>Rule: wait on the <b>counting</b> semaphore first, take the <b>mutex</b> last</li>
<li>Lesson 5.2 built the same thing with a condition variable</li>
</ul>`) },

  { t: 'Swap two lines in the producer → deadlock', giua: true, body: two(
    sql(`producer (wrong):
  wait(mutex);    // ⛔ lock first…
  wait(empty);    // …then sleep for room
  put(item);
  signal(mutex);
  signal(full);`, { lang: 'c' }),
    `<ul style="font-size:21px">
<li>Buffer of 4 fills up (4 produced)</li>
<li>Producer holds <b>mutex</b>, sleeps on <b>empty = 0</b></li>
<li>Consumer took a <b>full</b> ticket (full 4 → 3), then blocks on <b>mutex = 0</b> before it can free a slot</li>
<li>Each holds what the other needs: a classic exam trap</li>
</ul>`) + big(g('./bb wrong')) },

  { t: 'Readers–writers — exam form (readers first)', giua: true, body: two(
    sql(`semaphore rw = 1, mutex = 1;
int readers = 0;

writer:        reader:
  wait(rw);      wait(mutex);
  write();       if (++readers == 1) wait(rw);
  signal(rw);    signal(mutex);
                 read();
                 wait(mutex);
                 if (--readers == 0) signal(rw);
                 signal(mutex);`, { lang: 'c' }),
    `<ul style="font-size:21px">
<li>First reader locks writers out, last reader lets them in</li>
<li>Many readers together; a writer alone</li>
<li>As long as readers overlap, <b>rw</b> is never released — the writer <b>starves</b></li>
<li>Measured in 6.2: the writer gave up after <b>3,000 ms</b> while 30,977 reads went by; writer preference: 0.2 ms</li>
<li>In real code: <code class="i">pthread_rwlock_t</code>, <code class="i">ReentrantReadWriteLock</code> (5.3)</li>
</ul>`) },

  { t: 'How to answer in an exam or interview', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:30%">They ask…</th><th>Say (and draw)</th></tr>
<tr><td>Why do the philosophers deadlock?</td><td>All four Coffman conditions; the cycle P0→P1→…→P4→P0 of "holds left, waits right"</td></tr>
<tr><td>Give a fix</td><td>Order resources (P4 picks fork 0 first) / allow N−1 at the table / pick up both or none</td></tr>
<tr><td>Is it starvation-free?</td><td>Not automatically: a non-fair lock let one philosopher eat 8,407 times while others ate once</td></tr>
<tr><td>Order of semaphores in bounded buffer?</td><td>counting first (empty/full), mutex second — else deadlock when full</td></tr>
<tr><td>Readers–writers weakness?</td><td>first version starves writers; fix with writer priority or a fair queue</td></tr>
</table>` },

  { t: 'Cheat sheet — classic problems', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:26%">Problem</th><th style="width:38%">Real-world twin</th><th>Tool</th></tr>
<tr><td>Dining philosophers</td><td>a transfer that locks two accounts; a job that needs two connections</td><td>lock ordering, N−1 limit, try-lock</td></tr>
<tr><td>Bounded buffer</td><td>a job queue, a pipe, a Kafka partition consumer</td><td>2 counting semaphores + mutex, or a condition variable</td></tr>
<tr><td>Readers–writers</td><td>a config cache, a price table read 99% of the time</td><td>read-write lock, writer preference</td></tr>
</table>
${box('Next', 'Lesson 6.4 — the other two strategies: avoid deadlock with the Banker’s algorithm, or let it happen and detect it — what PostgreSQL does, and the pool deadlock in Node.', 'lam')}` },
]);
