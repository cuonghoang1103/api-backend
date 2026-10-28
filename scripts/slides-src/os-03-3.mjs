/**
 * os-03-3 — khoá "Operating Systems for Developers", bài 3.3 "Context switches" (28/10/2026).
 * Khuôn _pg-chung.mjs. Số liệu = CHẠY THẬT (lab/out/c33-cs.out.txt). Giảng: giang/os-03-3.mjs.
 */
import { lamDeck, sql, sh, two as two0, box, cards, steps, vsd } from './_pg-chung.mjs';

export const deck = { key: 'os-03-3', code: 'OS 3.3', title: 'Context switches and their cost', sub: 'Operating Systems · Chapter 3' };

const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b';

/** Thanh ngang: rows [[nhãn, giá trị, chữ bên phải, màu]] */
const hbars = (rows, max, { lw = 260, W = 1110, bw = 520, rh = 54, bh = 36, fs = 19 } = {}) => {
  const H = rows.length * rh + 6;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  rows.forEach(([lab, v, txt, m], i) => {
    const y = i * rh + 4, w = Math.max(4, Math.round(v / max * bw));
    s += T(lw - 14, y + 6 + bh / 2 + 7, lab, 20, { a: 'end', w: 700 });
    s += R(lw, y + 6, w, bh, m + '33', m, { rx: 4, sw: 2 });
    s += T(lw + w + 12, y + 6 + bh / 2 + 7, txt, fs, { w: 700, f: m });
  });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 3 — Threads & scheduling', bai: '3.3',
}, [
  { cover: true, t: 'What a context switch costs', sub: 'What a switch does, how to count it,<br>and when more threads make things slower — measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What the kernel does in one <b>context switch</b>, and its hidden cost</li>
<li><b>Voluntary</b> vs <b>involuntary</b> switches — and what each tells you</li>
<li>Count them: <code class="i">vmstat</code>, <code class="i">perf stat</code>, <code class="i">pidstat -w</code>, <code class="i">/proc/&lt;pid&gt;/status</code></li>
<li>The price of one switch: <b>~1 µs</b> on one core, <b>~12×</b> across cores</li>
<li>When more threads cost nothing — and when they cost <b>9×</b></li>
</ul>` },

  { t: 'What one context switch does', giua: true, body: two(
    steps([
      'Thread enters the kernel: it <b>blocked</b> (read, sleep, lock) or was <b>preempted</b> (timer, waking task)',
      'Save its registers into its <code class="i">task_struct</code>',
      'Scheduler picks the next task (lesson 3.2)',
      'Different process? Switch <b>page tables</b> ⇒ TLB entries lost (Ch. 7)',
      'Restore the next task’s registers, return to user mode',
    ]),
    box('Direct cost', 'Steps 1–5: kernel entry, save, pick, restore. Measured below: about a microsecond.', 'lam') +
    box('Indirect cost', 'The next thread finds the CPU caches full of someone else’s data. Often the bigger cost, and invisible in the switch count.', 'do2'), 'r64') },

  { t: 'Two kinds of switch, two different stories', to: true, giua: true, body: `
${cards([
    ['Voluntary', 'The thread <b>gave up</b> the CPU: it blocked on I/O, a lock, a sleep. Normal for servers — they mostly wait.<br><code class="i">voluntary_ctxt_switches</code> · <code class="i">cswch/s</code>'],
    ['Involuntary', 'The thread <b>wanted to keep running</b> but was preempted: slice used up, or a waking task took over.<br><code class="i">nonvoluntary_ctxt_switches</code> · <code class="i">nvcswch/s</code>'],
  ], 2)}
${box('Diagnosis', 'Many involuntary switches = more runnable threads than cores, or a CPU quota throttling you (lesson 3.4).', 'lam')}` },

  { t: 'vmstat cs: idle lab vs a chatty pair of processes', giua: true, body: two(
    sh(`$ vmstat 1 3
 r  b ... in   cs us sy id
 1  0 ... 2702    3  1  1 99
 0  0 ... 1205 1309  0  0 100
 0  0 ...  830  814  0  0 100`),
    sh(`$ ./pingpong 4000000 > /dev/null &
$ vmstat 1 3
 r  b ...    in     cs us sy id
 2  0 ...  2704      3  1  1 99
 1  0 ... 91298 217117  8  8 84
 1  0 ... 93264 180095  1  5 94`)) + box('Read it', 'Ignore the first line (an average since boot). Idle: ~1 000 switches/s. Two processes bouncing a byte: <b>180 000–217 000/s</b>, and the kernel share <code>sy</code> goes up. Columns between b and in trimmed to fit.', 'lam') },

  { t: 'pingpong: two processes, one byte, two pipes', giua: true, body: two(
    sql(`if (fork() == 0) {          /* child */
  for (long i = 0; i < n; i++) {
    read(ping[0], &b, 1);       /* sleep until parent writes */
    write(pong[1], &b, 1);      /* wake the parent */
  }
  _exit(0);
}
for (long i = 0; i < n; i++) {  /* parent */
  write(ping[1], &b, 1);        /* wake the child */
  read(pong[0], &b, 1);         /* sleep until it answers */
}`, { lang: 'c', sm: true }),
    `<ul style="font-size:22px">
<li>Each side must <b>sleep</b> until the other answers</li>
<li>Pinned to one core (<code class="i">taskset -c 0</code>), one round trip = parent → child → parent = <b>exactly two switches</b></li>
<li>So time ÷ round trips ÷ 2 ≈ the price of one switch (plus the pipe syscalls)</li>
</ul>`, 'r64') },

  { t: 'The price: ~1 µs on one core, ~12× across cores', giua: true, body: `
${hbars([
    ['same core (taskset -c 0)', 1985, '1 985 ns per round trip ≈ 1 µs per switch', BL],
    ['two cores (taskset -c 0,1)', 23229, '23 229 ns per round trip', RD],
  ], 23229, { bw: 380, lw: 330, rh: 100, bh: 70, fs: 21 })}
${box('Why cross-core is slower', 'The partner’s core goes idle while it waits. Waking an idle core needs an inter-processor interrupt and the core leaving its sleep state — in a VM the hypervisor must also wake the virtual CPU. Hand-offs between cores can cost far more than the switch itself.', 'do2')}` },

  { t: 'perf stat confirms the arithmetic', giua: true, body: two(
    sh(`$ perf stat -e context-switches,cpu-migrations,task-clock \\
    taskset -c 0 ./pingpong 100000
100000 round trips: 2156 ns per round trip
            200006      context-switches
                 1      cpu-migrations
            216.24 msec task-clock
       0.217094500 seconds time elapsed`),
    `<ul style="font-size:22px">
<li>100 000 round trips ⇒ <b>200 006</b> switches: two per round trip</li>
<li>1 migration: pinned, it stayed on CPU 0</li>
<li>In the lab add <code class="i">--cap-add PERFMON</code> <code class="i">--security-opt seccomp=unconfined</code> to <code class="i">docker run</code></li>
<li>Docker Desktop: software events only, no hardware cache counters</li>
</ul>`, 'r64') },

  { t: 'Voluntary or involuntary? /proc and pidstat say', body: two(
    sh(`# two hogs sharing CPU 0 for 3 s
$ grep ctxt /proc/$!/status
voluntary_ctxt_switches:	5
nonvoluntary_ctxt_switches:	510

# a process that only sleeps
$ grep ctxt /proc/$S/status
voluntary_ctxt_switches:	1
nonvoluntary_ctxt_switches:	0`),
    sh(`$ pidstat -w -p $! 1 2
  PID   cswch/s nvcswch/s  Command
   64 236734.00 249764.00  pingpong
   64 239020.79 248847.52  pingpong
Average:
   64 237883.08 249303.48  pingpong`)) + box('Read it', 'The hog was <b>preempted 510 times</b> in 3 s (≈ one 2.8 ms slice each, shared by two). sleep switched once, voluntarily. pingpong does ~240 000/s of both: it blocks in read (voluntary) and is preempted by the child it just woke (involuntary). pidstat columns trimmed.', 'lam') },

  { t: 'More threads, independent work: almost free', giua: true, body: `
${hbars([
    ['1 thread', 886, '886 ms', BL],
    ['4 threads', 225, '225 ms — 3.9× on 4 cores', GR],
    ['64 threads', 303, '303 ms', BL],
    ['512 threads', 271, '271 ms — only ~20% over 4 threads', BL],
  ], 886, { bw: 520, lw: 200 })}
${box('Same fixed job, 4 cores (crowd.c, cpu mode)', 'Each thread counts on its own. A switch costs ~1 µs every few ms, so oversubscribing pure CPU work barely hurts.', 'xanh')}` },

  { t: 'More threads, one shared lock: 9× slower', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th>crowd.c, lock mode, 4 cores</th><th>Wall time</th><th>Context switches</th><th>CPU burned</th></tr>
<tr><td>1 thread</td><td><b class="xanh">118 ms</b></td><td>5</td><td>0.12 s</td></tr>
<tr><td>4 threads</td><td>617 ms</td><td>37 709</td><td>1.84 s</td></tr>
<tr><td>64 threads</td><td><b class="do">1 086 ms</b></td><td><b class="do">230 378</b></td><td><b class="do">4.32 s</b></td></tr>
</table>
${box('Why', 'Every step takes one mutex. Waiters sleep in the kernel (futex) and must be woken and rescheduled; the lock and the counter bounce between the cores’ caches. More threads on one lock = slower <b>and</b> 36× more CPU. Chapter 5 fixes it properly.', 'do2')}` },

  { t: '“The service is slow — raise the pool from 50 to 500”', to: true, giua: true, body: `
${vsd(`<ul><li>More threads = more throughput</li><li>“200k cs/s on the dashboard — the scheduler is broken!”</li></ul>`,
    `<ul><li>Helps only if threads <b>wait on independent I/O</b>; on a lock, a pool or the CPU it hurts</li><li>A cs rate means nothing without a <b>baseline</b> — compare a normal day, split voluntary vs involuntary</li></ul>`, '✗ Reflex', '✓ Measure first')}` },

  { t: 'Cheat sheet — context switches', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:44%">You want to know…</th><th>Run</th></tr>
<tr><td>Machine-wide switches per second</td><td><code class="i">vmstat 1</code> (column <code class="i">cs</code>)</td></tr>
<tr><td>Per-process, live</td><td><code class="i">pidstat -w -p PID 1</code></td></tr>
<tr><td>Totals for one process</td><td><code class="i">grep ctxt /proc/PID/status</code></td></tr>
<tr><td>For one command, with migrations</td><td><code class="i">perf stat -e context-switches,cpu-migrations CMD</code></td></tr>
</table>
${box('Rule of thumb', 'One switch ≈ 1 µs; cross-core hand-off ≈ 10× more. Independent work tolerates many threads; lock-bound work does not.', 'xanh')}` },
]);
