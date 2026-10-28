/**
 * os-03-1 — khoá "Operating Systems for Developers", bài 3.1 "Threads: what they share" (28/10/2026).
 * Khuôn chuẩn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Số liệu = CHẠY THẬT trong ảnh os-lab
 * (content/courses/operating-systems-for-developers/lab/out/c31-luong.out.txt). Giảng: giang/os-03-1.mjs (walk()).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards } from './_pg-chung.mjs';

export const deck = { key: 'os-03-1', code: 'OS 3.1', title: 'Threads: what they share', sub: 'Operating Systems · Chapter 3' };

const term = (t, o = {}) => sh(t, { sm: true, ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', GY = '#8a8a8a', RD = '#c0392b';

/* Slide 3: nhiều tiến trình (bộ nhớ riêng) vs một tiến trình nhiều luồng (bộ nhớ chung) */
const procVsThread = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  s += T(260, 26, 'Process per request', 22, { a: 'middle', w: 800, f: BR });
  s += T(830, 26, 'Threads in ONE process', 22, { a: 'middle', w: 800, f: BL });
  [0, 1, 2].forEach((i) => {
    const x = 20 + i * 165;
    s += R(x, 46, 150, 236, '#fff7ef', OR);
    s += T(x + 75, 74, 'PID ' + (100 + i), 17, { a: 'middle', w: 700, f: BR });
    s += R(x + 14, 90, 122, 56, '#fde6cf', OR, { rx: 6, sw: 1.5 });
    s += T(x + 75, 124, 'own heap', 16, { a: 'middle' });
    s += R(x + 14, 156, 122, 46, '#fde6cf', OR, { rx: 6, sw: 1.5 });
    s += T(x + 75, 185, 'own fds', 16, { a: 'middle' });
    s += R(x + 14, 212, 122, 56, '#fff', GY, { rx: 6, sw: 1.5 });
    s += T(x + 75, 246, 'stack', 16, { a: 'middle' });
  });
  s += R(560, 46, 540, 236, '#eef4fa', BL);
  s += T(830, 74, 'PID 17', 17, { a: 'middle', w: 700, f: BL });
  s += R(580, 90, 500, 56, '#d6e6f5', BL, { rx: 6, sw: 1.5 });
  s += T(830, 124, 'ONE heap · globals · code · fd table', 17, { a: 'middle', w: 700, f: BL });
  ['main 17', 'worker 19', 'worker 20', 'worker 21'].forEach((t, i) => {
    const x = 580 + i * 127;
    s += R(x, 160, 116, 108, '#fff', GY, { rx: 6, sw: 1.5 });
    s += T(x + 58, 190, t, 15, { a: 'middle', w: 700 });
    s += T(x + 58, 222, 'own stack', 15, { a: 'middle', f: '#555' });
    s += T(x + 58, 248, 'own regs', 15, { a: 'middle', f: '#555' });
  });
  return s + '</svg>';
};

/* Slide 5: bố cục: phần chung một bản, bốn stack cách nhau 8 MiB + 64 KiB */
const stacks = () => {
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  s += R(10, 30, 260, 180, '#d6e6f5', BL);
  s += T(140, 70, 'code · globals', 20, { a: 'middle', w: 800, f: BL });
  s += T(140, 98, '&amp;global = 0xaaaacb810048', 14, { a: 'middle', m: 1 });
  s += T(140, 140, 'heap (malloc)', 20, { a: 'middle', w: 800, f: BL });
  s += T(140, 168, 'heap = 0xaaaaff580010', 14, { a: 'middle', m: 1 });
  s += T(140, 234, 'one copy — same address in all 4', 16, { a: 'middle', f: BL, w: 700 });
  const st = [['worker-3', '0xffff9a10e8a4'], ['worker-2', '0xffff9a91e8a4'], ['worker-1', '0xffff9b12e8a4'], ['main', '0xffffe33286fc']];
  st.forEach(([n, a], i) => {
    const x = 300 + i * 200;
    s += R(x, 30, 180, 150, i === 3 ? '#fff7ef' : '#fff', i === 3 ? OR : GY);
    s += T(x + 90, 64, n + ' stack', 18, { a: 'middle', w: 800 });
    s += T(x + 90, 96, '&amp;local =', 14, { a: 'middle', f: '#666' });
    s += T(x + 90, 120, a, 14, { a: 'middle', m: 1 });
    s += T(x + 90, 160, i === 3 ? 'main’s own stack' : '8 MB reserved', 15, { a: 'middle', f: '#666' });
  });
  s += T(700, 214, 'neighbours differ by 0x810000 = 8 MiB + 64 KiB  (stack + guard page)', 19, { a: 'middle', w: 700, f: BR });
  return s + '</svg>';
};

/* Slide 9: VSZ vs RSS theo số luồng (đo thật) */
const vszRss = () => {
  const rows = [['1 thread', 12636, 1504], ['100 threads', 829936, 2344], ['1000 threads', 8259408, 9792]];
  const max = 8259408, W = 760;
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  rows.forEach(([n, v, r], i) => {
    const y = 20 + i * 92;
    s += T(150, y + 30, n, 20, { a: 'end', w: 800 });
    const wv = Math.max(4, Math.round((v / max) * W));
    s += R(165, y + 8, wv, 30, '#f0f0f0', GY, { rx: 4, sw: 1.5 });
    s += T(165 + wv + 10 > 1000 ? 165 + wv - 10 : 165 + wv + 10, y + 30, 'VSZ ' + (v >= 1e6 ? (v / 1e6).toFixed(2) + ' GB' : (v / 1e3).toFixed(1) + ' MB'), 17, { a: 165 + wv + 10 > 1000 ? 'end' : 'start', f: '#555', w: 700 });
    s += R(165, y + 44, Math.max(6, Math.round((r / max) * W)), 26, GR + '33', GR, { rx: 4, sw: 1.5 });
    s += T(185, y + 63, 'RSS ' + (r / 1e3).toFixed(1) + ' MB', 17, { f: GR, w: 700 });
  });
  s += T(555, 292, 'each thread reserves an 8 MB stack virtually — only touched pages use RAM', 18, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* Slide 12: luồng nền tảng vs luồng ảo — 10 000 việc chờ 2 s (đo thật) */
const vtBars = () => {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  const m = [['total time', 6572, 2072, 'ms'], ['kernel threads', 2464, 31, ''], ['RSS', 278, 151, 'MB']];
  m.forEach(([lab, p, v, u], i) => {
    const x = 20 + i * 370, max = Math.max(p, v), H = 200, B = 290;
    s += T(x + 165, 26, lab, 22, { a: 'middle', w: 800 });
    const hp = Math.round((p / max) * H), hv = Math.max(4, Math.round((v / max) * H));
    s += R(x + 45, B - hp, 110, hp, BR + '33', BR, { rx: 4, sw: 2 });
    s += R(x + 180, B - hv, 110, hv, GR + '33', GR, { rx: 4, sw: 2 });
    s += T(x + 100, B - hp - 10, p.toLocaleString('en-US') + (u ? ' ' + u : ''), 19, { a: 'middle', w: 700, f: BR });
    s += T(x + 235, B - hv - 10, v.toLocaleString('en-US') + (u ? ' ' + u : ''), 19, { a: 'middle', w: 700, f: GR });
    s += T(x + 100, B + 26, 'platform', 18, { a: 'middle', f: BR, w: 700 });
    s += T(x + 235, B + 26, 'virtual', 18, { a: 'middle', f: GR, w: 700 });
  });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 3 — Threads & scheduling', bai: '3.1',
}, [
  { cover: true, t: 'Threads: what they share', sub: 'One process, many lines of execution<br>— TIDs, stacks, 1:1 vs virtual threads, measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why backends use <b>threads</b> instead of a process per request</li>
<li>What threads of one process <b>share</b> — and what each keeps <b>private</b></li>
<li>How the kernel sees them: <b>TIDs</b> under <code class="i">/proc/&lt;pid&gt;/task</code></li>
<li>Why 1 000 threads show <b>8 GB VSZ</b> but ~10 MB of real RAM</li>
<li><b>Kernel threads vs virtual threads</b>: 10 000 waiting tasks, measured</li>
</ul>
${box('Measured, not claimed', 'Every number comes from a real run in the course lab: Ubuntu 26.04, kernel 7.0, gcc 15, Java 21, Node 22.', 'lam')}` },

  { t: 'A thread is a second line of execution in the same process', giua: true, body: `
${procVsThread()}
${cards([
    ['Process per request', 'Isolated, but every process has its <b>own memory</b> — sharing a cache or a pool is hard and expensive.'],
    ['Threads', 'Many flows of execution in <b>one</b> address space: share data for free, each with its own stack.'],
    ['The catch', 'Shared memory means two threads can touch the same data at the same instant — Chapter 5.'],
  ])}` },

  { t: 'One process, four threads — measured', giua: true, body: two(
    sh(`$ ./luong > luong.txt & sleep 0.5; cat luong.txt
main     pid=17 tid=17  &local=0xffffe33286fc
         &global=0xaaaacb810048  heap=0xaaaaff580010
worker-1 pid=17 tid=19  &local=0xffff9b12e8a4
         &global=0xaaaacb810048  heap=0xaaaaff580010
worker-2 pid=17 tid=20  &local=0xffff9a91e8a4
         &global=0xaaaacb810048  heap=0xaaaaff580010
worker-3 pid=17 tid=21  &local=0xffff9a10e8a4
         &global=0xaaaacb810048  heap=0xaaaaff580010`),
    `<ul style="font-size:21px">
<li><b>pid = 17</b> on every line: one process</li>
<li><b>tid</b> 17, 19, 20, 21: four threads; main’s TID = the PID</li>
<li><b>&amp;global</b> and <b>heap</b>: the same address — one shared copy</li>
<li><b>&amp;local</b> differs: every thread has its <b>own stack</b></li>
</ul>
<p class="nho">Lines wrapped to fit; the full output is in the lesson.</p>`, 'r64') + box('Same process, separate flows', 'Four threads run the same code at the same time, each with its own program counter and stack — and they all see the same global variable and heap block.', 'lam') },

  { t: 'Shared data lives once; every thread has its own stack', giua: true, body: `
${stacks()}
${box('Why 8 MB?', '<code>ulimit -s</code> = 8192 KB is the default stack size; glibc gives every new thread that much address space plus a guard page that crashes the thread cleanly if it overflows.', 'lam')}` },

  { t: 'The kernel sees tasks that share one thread-group ID', giua: true, body: two(
    sh(`$ ps -L -o pid,lwp,nlwp,stat,comm -p $PID
    PID     LWP NLWP STAT COMMAND
     17      17    4 Sl   luong
     17      19    4 Sl   worker-1
     17      20    4 Sl   worker-2
     17      21    4 Sl   worker-3
$ ls /proc/$PID/task
17  19  20  21`),
    sh(`$ grep -E '^(Name|Tgid|Pid|Threads)' \\
    /proc/17/task/19/status
Name:	worker-1
Tgid:	17
Pid:	19
Threads:	4
$ readlink /proc/$PID/task/*/fd/1 | uniq -c
      4 /lab/ch03/luong.txt`)) + box('1:1 model', 'Each pthread is one kernel task (made by clone()), scheduled on its own. "PID" is really the thread-group ID (Tgid); the fd table is shared.', 'xanh') + `<p style="margin:0;font-size:21px;text-align:center">Thread 19: <b>Pid 19</b> = its own task ID · <b>Tgid 17</b> = the process it belongs to · all four threads’ fd 1 → the same file</p>` },

  { t: 'What is shared and what is private', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th style="width:50%">Shared by all threads of a process</th><th>Private to each thread</th></tr>
<tr><td>code, global variables, heap (malloc / new)</td><td>stack: locals, return addresses (8 MB reserved)</td></tr>
<tr><td>open files and sockets (fd table), current directory</td><td>registers: program counter, stack pointer</td></tr>
<tr><td>PID (thread-group ID), user/group, signal handlers</td><td>TID, signal mask, errno, thread-local storage</td></tr>
<tr><td>memory limits and the OOM verdict</td><td>scheduling state — each thread is queued and preempted on its own</td></tr>
</table>
${box('Consequence for this chapter', 'The scheduler schedules threads, not processes: a process with 200 threads competes for the CPU as 200 runnable things.', 'lam')}` },

  { t: 'Shared memory is both the feature and the bug', to: true, giua: true, body: `
<ul>
<li>Two threads can update the same object at the same instant — our demo used a <b>mutex</b>, so <code class="i">global</code> came out 3</li>
<li>Remove the lock and repeat a million times ⇒ <b>lost updates</b> — a race condition (Chapter 5)</li>
<li>One thread that writes past an array or leaks memory takes down <b>every</b> thread: one address space, one OOM verdict</li>
</ul>
${box('Rule', 'Threads are cheap to cooperate and dangerous to share carelessly. Isolation (processes, containers) is the price you pay for safety.', 'do2')}` },

  { t: 'Stacks are reserved, not used — VSZ vs RSS again', giua: true, body: vszRss() + box('Same trap as lesson 1.1, bigger', 'A Java server with 500 threads “using 4 GB” of VSZ is usually using a fraction of that in RAM. Watch RSS.', 'lam') },

  { t: 'The real thread limits live elsewhere', giua: true, body: two(
    sh(`$ cat /proc/sys/kernel/threads-max \\
      /sys/fs/cgroup/pids.max
63759
max

# container run with --pids-limit 100:
$ ./many 200
pthread_create failed at 98`),
    `<ul style="font-size:21px">
<li><b>threads-max</b>: ceiling for the whole kernel</li>
<li><b>pids.max</b>: the container’s cgroup budget — it counts <b>threads</b>, not just processes</li>
<li>Docker <code class="i">--pids-limit</code> or a pod limit ⇒ <code class="i">pthread_create</code> fails</li>
<li>Java says <b>OutOfMemoryError: unable to create native thread</b> — a thread budget, not a heap problem</li>
</ul>`, 'r46') + box('Before you “add more heap”', 'Check <code>Threads:</code> in /proc/PID/status against <code>pids.max</code>. Fix the thread count (pool size, virtual threads) or raise the pids limit — heap size is irrelevant here.', 'do2') },

  { t: 'Your runtime already has threads', giua: true, body: two(
    sh(`$ node -e 'setTimeout(()=>{},3000)' & sleep 0.5
$ grep Threads /proc/$!/status
Threads:	7
$ cat /proc/$!/task/*/comm | sort | uniq -c
      1 DelayedTaskSche
      6 node`),
    `<ul style="font-size:21px">
<li>"Node is single-threaded" = <b>your JavaScript</b> runs on one thread</li>
<li>The process has <b>7</b> before you write a line: main (JS + event loop), V8 workers (GC, background compiling), a delayed-task scheduler</li>
<li>The <b>libuv pool</b> (files, crypto) appears on first use — lesson 3.5</li>
</ul>`) + box('Same for the JVM', 'Our Java HTTP server with a 10-thread pool showed <b>30</b> threads (lesson 3.5): garbage collector, JIT compiler and other JVM housekeeping threads come on top of yours.', 'lam') },

  { t: 'Kernel threads vs virtual threads: 10 000 waits', giua: true, body: `
${vtBars()}
<p style="margin:0;font-size:20px;text-align:center">Same job: 10 000 tasks that each wait 2 s. <b style="color:#b85a2b">Platform</b> = one kernel thread per task (1:1); <b style="color:#2f7d4f">virtual</b> = JVM-scheduled on ~10 carriers (M:N).</p>` },

  { t: 'Cheat sheet — threads on a live system', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th style="width:46%">You want to know…</th><th>Run</th></tr>
<tr><td>How many threads a process has</td><td><code class="i">grep Threads /proc/PID/status</code></td></tr>
<tr><td>List its threads with names</td><td><code class="i">ps -L -o pid,lwp,stat,comm -p PID</code></td></tr>
<tr><td>Thread IDs and their names</td><td><code class="i">ls /proc/PID/task; cat /proc/PID/task/*/comm</code></td></tr>
<tr><td>Default stack per thread</td><td><code class="i">ulimit -s</code></td></tr>
<tr><td>Thread budget in a container</td><td><code class="i">cat /sys/fs/cgroup/pids.max</code></td></tr>
</table>
${box('Rule of thumb', 'Shared: heap, globals, fds, PID. Private: stack, registers, TID. Many waiting tasks? Virtual threads or an event loop — not 10 000 kernel threads.', 'xanh')}` },
]);
