/**
 * os-06-2 — khoá "Operating Systems for Developers", bài 6.2 "Livelock, starvation and priority inversion" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c62-live.out.txt (ảnh os-lab, container --cap-add SYS_NICE vứt đi)
 * và c64-bank.out.txt (pool đói) qua grab(). Nhúng vào bài bằng giang/os-06-2.mjs.
 */
import { lamDeck, sql, sh, two as two0, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-06-2', code: 'OS 6.2', title: 'Livelock, starvation and priority inversion', sub: 'Operating Systems · Chapter 6' };

const g = (pre, n = 1) => grab('c62-live', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
/* Dòng lệnh đầu quá dài cho nửa khung ⇒ cắt hiển thị bằng “…” (output giữ nguyên văn). */
const cmd1 = (t, n) => t.split('\n').map((l, i) => (i === 0 && l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const big = (t, o = {}) => sh(t, { ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}">${s}</text>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b', GY = '#9aa3ad';

/* Gantt một lõi: các làn H/M/L, thanh = đang chạy, sọc nhạt = bị chặn chờ khoá. Số đo lấy từ c62-live (pi none/inherit). */
const gantt = (title, bars, note, noteColor) => {
  const x0 = 120, W = 940, max = 560, sx = (ms) => x0 + (ms / max) * W;
  const lanes = { H: [70, RD, 'H prio 30'], M: [130, OR, 'M prio 20'], L: [190, BL, 'L prio 10'] };
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  s += T(555, 26, title, 22, { a: 'middle', w: 800 });
  for (const [k, [y, c, lab]] of Object.entries(lanes)) s += T(10, y + 26, lab, 18, { w: 700, f: c }) + `<line x1="${x0}" y1="${y + 40}" x2="${x0 + W}" y2="${y + 40}" stroke="#ddd"/>`;
  for (const [k, a, b, kind, lab] of bars) {
    const [y, c] = lanes[k];
    const fill = kind === 'run' ? c : kind === 'boost' ? RD : '#fff';
    s += `<rect x="${sx(a)}" y="${y + 6}" width="${Math.max(3, sx(b) - sx(a))}" height="34" rx="4" fill="${fill}${kind === 'run' ? 'cc' : kind === 'boost' ? '99' : ''}" stroke="${kind === 'wait' ? RD : c}" stroke-width="2"${kind === 'wait' ? ' stroke-dasharray="6 4"' : ''}/>`;
    if (lab) s += T((sx(a) + sx(b)) / 2, y + 29, lab, 16, { a: 'middle', w: 700, f: kind === 'wait' ? RD : '#fff' });
  }
  for (const ms of [0, 100, 200, 300, 400, 500]) s += T(sx(ms), 262, `${ms} ms`, 15, { a: 'middle', f: '#777' });
  s += T(555, 292, note, 20, { a: 'middle', w: 800, f: noteColor });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 6 — Deadlock', bai: '6.2',
}, [
  { cover: true, t: 'Livelock, starvation<br>and priority inversion', sub: 'No deadlock — and still no progress.<br>Measured, plus the bug that reset a spacecraft on Mars' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Tell three kinds of "no progress" apart: <b>deadlock</b>, <b>livelock</b>, <b>starvation</b></li>
<li>Make a <b>livelock</b> on purpose — and break it with randomness</li>
<li>Starve a writer for 3 seconds with a read-write lock</li>
<li>Reproduce <b>Mars Pathfinder</b>'s priority inversion: 540 ms → 40 ms with priority inheritance</li>
</ul>` },

  { t: 'Three ways to make no progress', giua: true, body: `
${cards([
    ['Deadlock', 'Everyone in the cycle <b>waits</b>, asleep. CPU ≈ 0. Lasts forever unless someone is killed.'],
    ['Livelock', 'Everyone is <b>busy</b> reacting to everyone else. CPU is burned, no work finishes.'],
    ['Starvation', 'The system makes progress — just <b>never for one</b> thread. It might get in someday, or never.'],
  ])}
${big(g('/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" timeout 3'))}
<p style="margin:0;font-size:21px">The deadlock from 6.1: 3 seconds of wall time, <b>0.00 s</b> of CPU. Remember that number for the next slide.</p>` },

  { t: 'Livelock: two very polite threads', giua: true, body: two(
    sql(`for (;;) {
    lock(mine);
    // do the first half of the job
    if (trylock(other) == OK) {   // got both: done
        jobs++; unlock(other); unlock(mine);
        continue;
    }
    unlock(mine);   // "after you!"
    retries++;
    wait_a_bit();   // same delay for both…
}`, { lang: 'c' }),
    `<ul style="font-size:22px">
<li>Never holds one lock while <b>waiting</b> for the other — no deadlock possible</li>
<li>But if both step in the <b>same rhythm</b>, each always finds the other's lock taken</li>
<li>Like two people in a corridor who step aside the same way, again and again</li>
<li>The program forces that rhythm with a barrier: <code class="i">./livelock lockstep</code></li>
</ul>`) },

  { t: 'Lockstep: 200,000 retries, zero jobs, CPU burning', giua: true, body: `
${big(g('/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./livelock lockstep'))}
${box('Not a deadlock', 'Every thread is running and changing state (1.9 s of CPU for 3.7 s of wall time) — yet 0 jobs finish. A CPU graph says “busy”, a log says “retrying” — that is what makes livelock harder to spot than a quiet deadlock.', 'do2')}` },

  { t: 'Break the symmetry with randomness', giua: true, body: `
${term(g('/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./livelock lockstep-random'))}
${term(g('./livelock real'))}
<ul style="font-size:21px">
<li><b>lockstep-random</b>: after a miss, flip a coin and sit out one beat ⇒ 28,530 jobs</li>
<li><b>real</b>: no forced rhythm; the scheduler's own jitter already breaks it — but half the attempts are still wasted</li>
<li>Same idea as Ethernet's random backoff and "retry with jitter" in cloud SDKs and HTTP clients</li>
</ul>` },

  { t: 'Starvation: a writer behind endless readers', giua: true, body: `
${sql(`for (;;) { pthread_rwlock_rdlock(&rw); usleep(200); pthread_rwlock_unlock(&rw); }   // 4 readers, overlapping
pthread_rwlock_timedwrlock(&rw, &now_plus_3s);                                     // 1 writer, once
pthread_rwlockattr_setkind_np(&attr, PTHREAD_RWLOCK_PREFER_WRITER_NONRECURSIVE_NP); // the "writers" run`, { lang: 'c', sm: true })}
${big(g('./starve readers', 2))}
<p style="margin:0;font-size:21px">glibc's default <b>prefers readers</b>: a new reader may enter while a writer waits, so with overlapping readers the writer never finds a gap — 30,977 reads went by while it waited. With writer preference, new readers queue behind the writer: <b>0.2 ms</b>. (<code class="i">ETIMEDOUT</code>'s text really is "Connection timed out".)</p>` },

  { t: 'Starvation fixes: fairness and aging', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:30%">Where</th><th>Starves</th><th>Fix</th></tr>
<tr><td>Read-write lock</td><td>writers (or readers)</td><td>writer preference; a fair (FIFO) lock</td></tr>
<tr><td>Priority scheduler</td><td>low-priority jobs</td><td><b>aging</b>: priority rises while it waits; Linux CFS/EEVDF share by weight instead of strict priority</td></tr>
<tr><td>Unfair mutex (glibc, Java default)</td><td>the thread that just woke up</td><td>fair mode (<code class="i">new ReentrantLock(true)</code>) — slower, but FIFO</td></tr>
<tr><td>Connection pool</td><td>fast requests behind slow ones</td><td>separate pools (bulkhead), timeouts — lesson 6.4</td></tr>
</table>
${box('The trade-off', 'Unfair locks are faster because the thread already on a CPU can grab the lock without a wake-up. Fair locks cost throughput; starvation costs latency for someone.', 'lam')}` },

  { t: 'Mars Pathfinder, July 1997: resets on Mars', giua: true, body: `
${cards([
    ['High: bus management', 'Runs often, moves data through a shared <b>information bus</b> guarded by a <b>mutex</b>.'],
    ['Low: meteorological data', 'Runs rarely; takes the same mutex to publish its readings.'],
    ['Medium: communications', 'Long-running, does not need the mutex at all.'],
  ])}
<ul style="font-size:22px">
<li>Low holds the mutex → High blocks on it → Medium preempts Low and runs on and on</li>
<li>High waits for Medium without sharing anything with it; a watchdog sees the bus task not running and <b>resets the whole system</b></li>
<li>VxWorks, preemptive priority scheduling — the textbook <b>priority inversion</b></li>
</ul>` },

  { t: 'Reproduced on one core: H waits 540 ms', giua: true, body: `
${gantt('./pi none — plain mutex, all threads on CPU 0, SCHED_FIFO', [
    ['L', 0, 10.2, 'run', 'L'], ['H', 10.2, 550.3, 'wait', 'H blocked on the mutex L holds'], ['M', 10.2, 510.2, 'run', 'M: 500 ms of unrelated work'],
    ['L', 510.2, 550.3, 'run', ''], ['H', 550.3, 552, 'run', ''],
  ], 'H waited 540.2 ms — for a task (M) it shares nothing with', RD)}
${term(g('./pi none').split('\n').slice(1).join('\n'))}` },

  { t: 'Priority inheritance: L borrows H’s priority', giua: true, body: `
${gantt('./pi inherit — PTHREAD_PRIO_INHERIT mutex', [
    ['L', 0, 10.1, 'run', ''], ['H', 10.1, 50.3, 'wait', ''], ['L', 10.1, 50.2, 'boost', 'L↑30'],
    ['H', 50.3, 52, 'run', ''], ['M', 50.4, 550.4, 'run', 'M runs after H is served'],
  ], 'H waited 40.0 ms — only L’s remaining critical section', GR)}
${term(g('./pi inherit').split('\n').slice(1).join('\n'))}` },

  { t: 'The kernel does it: PI futexes', giua: true, body: `
${sql(`pthread_mutexattr_t ma;
pthread_mutexattr_init(&ma);
pthread_mutexattr_setprotocol(&ma, PTHREAD_PRIO_INHERIT);   // the one line Pathfinder was missing
pthread_mutex_init(&bus, &ma);`, { lang: 'c', sm: true })}
${two(term(cmd1(g('strace -f -e trace=futex ./pi none'), 50)), term(cmd1(g('strace -f -e trace=futex ./pi inherit'), 50)))}
<p style="margin:0;font-size:20px">With the protocol set, glibc switches to <code class="i">FUTEX_LOCK_PI</code>: the kernel knows the <b>owner</b> and boosts it while a higher-priority thread waits.</p>` },

  { t: 'How JPL fixed a spacecraft from Earth', giua: true, body: `
<ul style="font-size:23px">
<li>Reproduced on an identical replica with VxWorks' full <b>event trace</b> on — after hours of trying</li>
<li>The mutex had been created with priority inheritance <b>off</b> (judged "too slow" for a hot task)</li>
<li>VxWorks' built-in C interpreter was still enabled: a short program uploaded to the craft flipped the global flags to <b>TRUE</b></li>
<li>No more resets. Pre-flight tests had shown one or two unexplained resets — written off as "hardware glitches"</li>
</ul>
${box('Lessons you can use on a backend', 'Keep tracing/diagnostics in production builds · an unreproducible glitch is a bug you have not caught yet · correctness first in the hottest path.', 'lam')}` },

  { t: 'Backend twins of priority inversion', giua: true, body: vsd(
    `<ul style="font-size:21px"><li>A nightly report holds a <b>row lock</b> for minutes; a checkout request (urgent) waits on it</li><li>A batch job holds pool connections; the <b>health check</b> waits behind it (6.4: 1.9 s)</li><li>A low-priority thread holds a <code class="i">synchronized</code> cache lock while GC or a busy neighbour delays it</li></ul>`,
    `<ul style="font-size:21px"><li>Keep critical sections short; never call slow services while holding a lock</li><li>Separate pools / queues by priority (bulkhead)</li><li>Timeouts on every lock and connection acquire</li><li>Real-time code: PI mutexes (<code class="i">PTHREAD_PRIO_INHERIT</code>)</li></ul>`,
    '✗ The same shape', '✓ What helps') },

  { t: 'Cheat sheet — no progress, which kind?', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:22%">Kind</th><th style="width:38%">Symptom you measure</th><th>Typical fix</th></tr>
<tr><td>Deadlock</td><td>threads in S, 0% CPU, cycle in gdb/jstack</td><td>lock order, try-lock + timeout</td></tr>
<tr><td>Livelock</td><td>CPU busy, retry counters climbing, 0 jobs done</td><td>randomised backoff, a tie-breaker</td></tr>
<tr><td>Starvation</td><td>others progress, one waits very long / times out</td><td>fair locks, writer preference, aging</td></tr>
<tr><td>Priority inversion</td><td>urgent task waits for an unrelated medium one</td><td>priority inheritance, short critical sections</td></tr>
</table>
${box('Next', 'Lesson 6.3 — the classic problems: dining philosophers solved three ways, readers–writers and the bounded buffer in exam form.', 'lam')}` },
]);
