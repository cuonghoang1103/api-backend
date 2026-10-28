/**
 * os-06-1 — khoá "Operating Systems for Developers", bài 6.1 "Deadlock: the four Coffman conditions" (28/10/2026).
 * Khuôn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Output đọc THẲNG từ lab/out/c61-dl.out.txt (chạy thật trong
 * ảnh os-lab, container --privileged vứt đi) qua grab() — không chép tay. Nhúng vào bài bằng giang/os-06-1.mjs (walk()).
 */
import { lamDeck, sql, sh, two as two0, box, cards, kw, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-06-1', code: 'OS 6.1', title: 'Deadlock: the four Coffman conditions', sub: 'Operating Systems · Chapter 6' };

/* Dòng quá dài cho khung ⇒ cắt hiển thị bằng “…” (phần còn lại giữ nguyên văn). */
const cut = (t, n) => t.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const g = (pre, n = 1, w = 200) => cut(grab('c61-dl', pre, n), w);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const big = (t, o = {}) => sh(t, { ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b';
const DEF = `<defs>${[['h', '#333'], ['r', RD], ['b', BL], ['o', OR]].map(([k, c]) =>
  `<marker id="m6${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join('')}</defs>`;
const line = (x1, y1, x2, y2, c, m, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw || 3}"${o.d ? ' stroke-dasharray="8 6"' : ''} marker-end="url(#m6${m})"/>`;

/* Slide 6: đồ thị chờ dựng từ gdb — LWP 29 giữ A chờ B, LWP 30 giữ B chờ A. */
const waitFor = () => {
  let s = `<svg viewBox="0 0 1110 360" width="1110" height="360" font-family="Arial">${DEF}`;
  // hai luồng (tròn) và hai khoá (vuông)
  s += `<circle cx="220" cy="180" r="74" fill="${BL}18" stroke="${BL}" stroke-width="3"/>` + T(220, 172, 'LWP 29', 24, { a: 'middle', w: 800, f: BL }) + T(220, 202, 'T1: A → B', 19, { a: 'middle' });
  s += `<circle cx="890" cy="180" r="74" fill="${OR}18" stroke="${OR}" stroke-width="3"/>` + T(890, 172, 'LWP 30', 24, { a: 'middle', w: 800, f: OR }) + T(890, 202, 'T2: B → A', 19, { a: 'middle' });
  s += `<rect x="495" y="30" width="120" height="70" rx="10" fill="#f3f3f3" stroke="#555" stroke-width="3"/>` + T(555, 74, 'mutex A', 22, { a: 'middle', w: 700 });
  s += `<rect x="495" y="260" width="120" height="70" rx="10" fill="#f3f3f3" stroke="#555" stroke-width="3"/>` + T(555, 304, 'mutex B', 22, { a: 'middle', w: 700 });
  // giữ (nét liền, từ khoá về luồng) và chờ (nét đứt đỏ, từ luồng tới khoá)
  s += line(495, 70, 292, 150, BL, 'b') + T(120, 70, 'holds  (A.__owner = 29)', 18, { f: BL, w: 700 });
  s += line(615, 300, 818, 212, OR, 'o') + T(640, 350, 'holds  (B.__owner = 30)', 18, { f: OR, w: 700 });
  s += line(280, 230, 492, 292, RD, 'r', { d: 1 }) + T(150, 300, 'waits in pthread_mutex_lock(B)', 18, { f: RD, w: 700 });
  s += line(830, 132, 618, 72, RD, 'r', { d: 1 }) + T(700, 40, 'waits in pthread_mutex_lock(A)', 18, { f: RD, w: 700 });
  s += T(555, 190, 'cycle ⇒ nobody', 22, { a: 'middle', f: RD, w: 800 }) + T(555, 218, 'can ever continue', 22, { a: 'middle', f: RD, w: 800 });
  return s + '</svg>';
};

/* Slide 8: đồ thị cấp phát tài nguyên (RAG) và đồ thị chờ rút gọn (WFG) cạnh nhau. */
const ragWfg = () => {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">${DEF}`;
  const P = (x, y, t, c) => `<circle cx="${x}" cy="${y}" r="38" fill="${c}18" stroke="${c}" stroke-width="3"/>` + T(x, y + 8, t, 22, { a: 'middle', w: 800, f: c });
  const Rr = (x, y, t) => `<rect x="${x - 40}" y="${y - 32}" width="80" height="64" rx="6" fill="#f3f3f3" stroke="#555" stroke-width="3"/><circle cx="${x}" cy="${y + 12}" r="6" fill="#555"/>` + T(x, y - 6, t, 20, { a: 'middle', w: 700 });
  s += T(250, 30, 'Resource-allocation graph', 22, { a: 'middle', w: 800 });
  s += P(90, 170, 'T1', BL) + P(410, 170, 'T2', OR) + Rr(250, 80, 'A') + Rr(250, 262, 'B');
  s += line(210, 92, 124, 146, '#333', 'h') + T(110, 105, 'assigned', 16, { f: '#555' });
  s += line(124, 196, 208, 248, RD, 'r', { d: 1 }) + T(70, 262, 'request', 16, { f: RD });
  s += line(290, 250, 378, 196, '#333', 'h') + T(350, 262, 'assigned', 16, { f: '#555' });
  s += line(378, 146, 292, 94, RD, 'r', { d: 1 }) + T(372, 100, 'request', 16, { f: RD });
  s += `<line x1="555" y1="40" x2="555" y2="310" stroke="#ccc" stroke-width="2"/>`;
  s += T(840, 30, 'Wait-for graph (resources removed)', 22, { a: 'middle', w: 800 });
  s += P(700, 170, 'T1', BL) + P(980, 170, 'T2', OR);
  s += `<path d="M738,150 C800,90 880,90 942,150" stroke="${RD}" stroke-width="3" fill="none" marker-end="url(#m6r)"/>`;
  s += `<path d="M942,190 C880,250 800,250 738,190" stroke="${RD}" stroke-width="3" fill="none" marker-end="url(#m6r)"/>`;
  s += T(840, 96, 'T1 waits for T2', 18, { a: 'middle', f: RD, w: 700 }) + T(840, 262, 'T2 waits for T1', 18, { a: 'middle', f: RD, w: 700 });
  s += T(840, 310, 'one instance per resource: cycle ⇔ deadlock', 19, { a: 'middle', w: 700 });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 6 — Deadlock', bai: '6.1',
}, [
  { cover: true, t: 'Deadlock:<br>the four Coffman conditions', sub: 'Two transfers that wait for each other forever —<br>found with ps, /proc, gdb and jstack' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Make a <b>deadlock</b> happen on demand in C and Java</li>
<li>Prove it from outside: <b>0% CPU</b>, <code class="i">wchan</code>, kernel stack, <code class="i">gdb</code>, <code class="i">jstack</code></li>
<li>Name the <b>four Coffman conditions</b> and draw the <b>wait-for graph</b></li>
<li>Prevent it two ways: one <b>global lock order</b>, or <b>try-lock with a timeout</b></li>
</ul>
${box('Measured, not claimed', 'Every output is a real run in the course lab: Ubuntu 26.04 container, 10 cores (arm64), gcc 15, gdb, Java 21.', 'lam')}` },

  { t: 'The experiment: two transfers in opposite directions', giua: true, body: two(
    sql(`void transfer(account *from, account *to) {
    pthread_mutex_lock(&from->m);
    usleep(1);        // check limits, read balance…
    pthread_mutex_lock(&to->m);
    from->balance -= 1;  to->balance += 1;
    pthread_mutex_unlock(&to->m);
    pthread_mutex_unlock(&from->m);
}
// T1: 5,000 × transfer(&A, &B)
// T2: 5,000 × transfer(&B, &A)`, { lang: 'c' }),
    `<ul style="font-size:22px">
<li>Each transfer locks <b>both</b> accounts — correct for one thread</li>
<li>T1 locks A then B; T2 locks <b>B then A</b></li>
<li>Both lock their first account, then each waits for the one the other holds</li>
<li>Nothing crashes. Nothing is printed. It just stops.</li>
</ul>`) },

  { t: 'It hangs: timeout kills it, exit 124', giua: true, body: `
${big(g('timeout 5 ./dl naive'))}
${big(g('ps -L -o pid,lwp,stat,pcpu'))}
${box('A deadlock looks idle', 'All three threads: state <b>S</b> (sleeping), <b>0.0% CPU</b>, waiting in <code>futex_do_wait</code>. A busy loop would show 100%; a deadlock shows nothing at all.', 'do2')}` },

  { t: 'The kernel says where each thread sleeps', giua: true, body: two(
    term(g('grep . /proc/$P/task/*/wchan')),
    term(g('grep -m 4 . /proc/$P/task/*/stack')),
  ) + `<p style="margin:0;font-size:22px"><code class="i">wchan</code> = the kernel function a sleeping thread waits in. <code class="i">stack</code> (root only) = the whole kernel call chain: <b>futex</b> — the mutex wait from lesson 5.2. The kernel knows <i>that</i> they wait, not <i>for whom</i>.</p>` },

  { t: 'gdb names the cycle', giua: true, body: `
${term(g('gdb -p $P -batch -ex "thread apply 2-3', 1, 118))}
${term(g('gdb -p $P -batch -ex "p A.m', 1, 118))}
<p style="margin:0;font-size:21px">LWP 29 runs <code class="i">transfer(from=A, to=B)</code> and waits on <b>B</b>; LWP 30 runs <code class="i">transfer(from=B, to=A)</code> and waits on <b>A</b>. The mutex itself records its owner: <b>A → 29, B → 30</b>.</p>` },

  { t: 'Draw it: the wait-for graph has a cycle', giua: true, body: waitFor() },

  { t: 'The four Coffman conditions (1971) — all must hold', giua: true, body: `
${cards([
    ['1 · Mutual exclusion', 'A resource is held by <b>one</b> thread at a time. (A mutex, a row lock.)'],
    ['2 · Hold and wait', 'A thread keeps what it has <b>while</b> waiting for more. (T1 keeps A while asking for B.)'],
    ['3 · No preemption', 'Nobody can <b>take</b> a lock away; only the holder releases it.'],
    ['4 · Circular wait', 'T1 waits for T2, T2 waits for T1 — a <b>cycle</b> in the wait-for graph.'],
  ], 2)}
<p style="margin:0;font-size:22px">Break <b>any one</b> and deadlock is impossible. In application code the cheapest to break is <b>4</b>, then <b>2</b>.</p>` },

  { t: 'Resource-allocation graph → wait-for graph', giua: true, body: `
${ragWfg()}
<p style="margin:0;font-size:21px">With several instances per resource (a pool of 10 connections) a cycle means <b>maybe</b>, not certainly — that is lesson 6.4.</p>` },

  { t: 'Java: jstack finds it for you', giua: true, body: `
${term(g('jstack $J', 1, 110).split('\n').slice(0, 15).join('\n'))}
<p style="margin:0;font-size:21px">The JVM knows the owner of every monitor, so <code class="i">jstack &lt;pid&gt;</code> runs the cycle search and prints <b>"Found one Java-level deadlock"</b> with both stacks and the exact lines (Transfer.java:21).</p>` },

  { t: 'Or let the service detect it itself', giua: true, body: `
${sql(`var mx = ManagementFactory.getThreadMXBean();
while (true) {
    Thread.sleep(500);
    long[] ids = mx.findDeadlockedThreads();     // null = no cycle
    if (ids != null) {
        for (var info : mx.getThreadInfo(ids))
            log(info.getThreadName() + " waits for " + info.getLockName() + " held by " + info.getLockOwnerName());
        System.exit(2);                          // alert + let the orchestrator restart it
    }
}`, { lang: 'java', sm: true })}
${term(g('java Transfer.java watchdog', 1, 110))}
${box('Detection ≠ fix', 'A watchdog turns a silent hang into a loud crash + restart. The deadlock still happens; you just stop waiting for a human to notice.', 'lam')}` },

  { t: 'Prevention 1: one global lock order', giua: true, body: `
${sql(`// always lock the account with the SMALLER id first — every thread, every transfer
account *first  = from->id < to->id ? from : to;
account *second = from->id < to->id ? to : from;
pthread_mutex_lock(&first->m);
pthread_mutex_lock(&second->m);`, { lang: 'c' })}
${big(g('./dl ordered'))}
${cards([
    ['No cycle possible', 'T1 and T2 both take <b>A before B</b>; whoever gets A first finishes.'],
    ['Breaks condition 4', '<b>Circular wait</b> cannot form when every thread climbs the same ladder.'],
    ['Costs nothing', '5,000 + 5,000 transfers, 0 timeouts, balances intact.'],
  ])}` },

  { t: 'Prevention 2: try-lock with a timeout, back off', giua: true, body: `
${sql(`for (;;) {
    pthread_mutex_lock(&from->m);
    if (pthread_mutex_timedlock(&to->m, &deadline_2ms) == 0) break;   // got both
    pthread_mutex_unlock(&from->m);                                    // give back what you hold
    usleep(rand() % 1000);                                             // random backoff 0–1 ms
}`, { lang: 'c', sm: true })}
${big(g('./dl trylock'))}
${cards([
    ['Breaks condition 2', '<b>Hold and wait</b>: on timeout, give everything back.'],
    ['About 4× slower here', '5.56 s vs 1.35 s: 1,816 timeouts × 2 ms of pure waiting.'],
    ['Randomise the backoff', 'Fixed backoff can make both retry in lockstep — livelock (6.2).'],
  ])}` },

  { t: 'Which condition each fix breaks', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:30%">Technique</th><th style="width:24%">Breaks</th><th>Cost / catch</th></tr>
<tr><td>One global lock order</td><td>4 · circular wait</td><td>Free. Needs a rule everyone follows (by id, by address).</td></tr>
<tr><td>try-lock + timeout + backoff</td><td>2 · hold and wait</td><td>Wasted time on every timeout; livelock without randomness.</td></tr>
<tr><td>Take all locks at once</td><td>2 · hold and wait</td><td>Must know every lock up front; holds them longer.</td></tr>
<tr><td>One big lock</td><td>1 · (only one lock)</td><td>No deadlock, no parallelism.</td></tr>
<tr><td>Lock-free / no sharing</td><td>1 · mutual exclusion</td><td>Hardest to write; atomics only (lesson 5.3).</td></tr>
<tr><td>Kill a victim (databases)</td><td>3 · no preemption</td><td>Work is rolled back and must be retried (6.4).</td></tr>
</table>` },

  { t: 'Cheat sheet — a process is hung', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:44%">You want to know…</th><th>Run</th></tr>
<tr><td>Busy or waiting?</td><td><code class="i">ps -L -o pid,lwp,stat,pcpu,wchan:16 -p PID</code></td></tr>
<tr><td>What each thread waits on (kernel)</td><td><code class="i">grep . /proc/PID/task/*/wchan</code> · <code class="i">…/stack</code></td></tr>
<tr><td>Where in my code (C/C++)</td><td><code class="i">gdb -p PID -batch -ex "thread apply all bt"</code></td></tr>
<tr><td>Who owns a pthread mutex</td><td><code class="i">p mutex.__data.__owner</code> in gdb</td></tr>
<tr><td>Java deadlock</td><td><code class="i">jstack PID</code> · <code class="i">ThreadMXBean.findDeadlockedThreads()</code></td></tr>
</table>
${box('Next', 'Lesson 6.2 — no deadlock, still no progress: livelock, starvation and priority inversion.', 'lam')}` },
]);
