/**
 * os-03-2 — khoá "Operating Systems for Developers", bài 3.2 "Scheduling" (28/10/2026).
 * Khuôn _pg-chung.mjs. Gantt + trung bình = engine của SchedulerSim (frontend/src/components/os-lab/engine/scheduler.ts,
 * chạy bằng tsx); nice + độ trễ thức = CHẠY THẬT (lab/out/c32-lich.out.txt). Giảng: giang/os-03-2.mjs.
 */
import { lamDeck, sh, two as two0, box, cards, steps, vsd } from './_pg-chung.mjs';

export const deck = { key: 'os-03-2', code: 'OS 3.2', title: 'Scheduling: FIFO, RR, MLFQ, CFS, EEVDF', sub: 'Operating Systems · Chapter 3' };

const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b';
const MAU = { P1: '#336791', P2: '#e08a1e', P3: '#2f7d4f', P4: '#8e44ad', BUILD: '#8a8a8a', curl: '#e08a1e', ls: '#2f7d4f', git: '#336791' };

/** Gantt: rows = [[nhãn, 'P1 P1 P2 …' (một ô mỗi nhịp), ghi chú phải]], n nhịp. */
const gantt = (rows, n, { lw = 150, rw = 190, rh = 46, gap = 18 } = {}) => {
  const W = 1110, u = (W - lw - rw) / n, H = rows.length * (rh + gap) + 34;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  rows.forEach(([lab, seq, note], r) => {
    const y = r * (rh + gap), cells = seq.split(' ');
    s += T(lw - 12, y + rh / 2 + 7, lab, 20, { a: 'end', w: 800 });
    let k = 0;
    while (k < cells.length) {
      let e = k; while (e + 1 < cells.length && cells[e + 1] === cells[k]) e++;
      const p = cells[k];
      if (p !== '.') {
        const x = lw + k * u, w = (e - k + 1) * u, m = MAU[p] || '#555';
        s += `<rect x="${x}" y="${y}" width="${w}" height="${rh}" fill="${m}" stroke="#fff" stroke-width="2"/>`;
        if (w > 30) s += T(x + w / 2, y + rh / 2 + 6, p, w > 50 ? 17 : 14, { a: 'middle', w: 800, f: '#fff' });
      }
      k = e + 1;
    }
    s += T(W - rw + 12, y + rh / 2 + 7, note, 18, { w: 700, f: BR });
  });
  const yb = rows.length * (rh + gap) + 6;
  for (let t = 0; t <= n; t += (n > 20 ? 2 : 1)) s += T(lw + t * u, yb + 14, String(t), 13, { a: 'middle', f: '#777' });
  return s + '</svg>';
};

/* Slide 10: nice đo thật — phần CPU trong 4 s */
const niceBars = () => {
  const rows = [['10 free cores', [['nice 0', 4.11], ['nice 5', 4.11]]], ['one core', [['nice 0', 3.01], ['nice 5', 0.99]]], ['one core', [['nice 0', 3.94], ['nice 19', 0.06]]]];
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  rows.forEach(([lab, pr], i) => {
    const y = 10 + i * 96;
    s += T(150, y + 44, lab, 20, { a: 'end', w: 800 });
    pr.forEach(([n, v], j) => {
      const yy = y + j * 38, w = Math.max(4, Math.round(v / 4.2 * 700));
      s += R(165, yy + 12, w, 30, (j ? BR : BL) + '33', j ? BR : BL, { rx: 4, sw: 2 });
      s += T(175 + w, yy + 34, `${n}: ${v.toFixed(2)} s CPU`, 18, { w: 700, f: j ? BR : BL });
    });
  });
  return s + '</svg>';
};

/* Slide 12: độ trễ thức dậy p99 (đo thật, µs) */
const wakeBars = () => {
  const rows = [['alone on CPU 0', 279, 1459], ['+3 hogs (nice 0)', 52, 2998], ['+3 hogs (nice 19)', 51, 1289], ['+3 hogs, me SCHED_FIFO', 1, 29]];
  let s = `<svg viewBox="0 0 1110 260" width="1110" height="260" font-family="Arial">`;
  rows.forEach(([lab, med, p99], i) => {
    const y = 8 + i * 60, w = Math.max(4, Math.round(p99 / 3000 * 470));
    s += T(300, y + 32, lab, 20, { a: 'end', w: 700 });
    s += R(315, y + 10, w, 34, (i === 1 ? RD : i === 3 ? GR : BL) + '33', i === 1 ? RD : i === 3 ? GR : BL, { rx: 4, sw: 2 });
    s += T(325 + w, y + 33, `p99 ${p99.toLocaleString('en-US')} µs · median ${med} µs`, 18, { w: 700, f: '#444' });
  });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 3 — Threads & scheduling', bai: '3.2',
}, [
  { cover: true, t: 'Scheduling: who runs next?', sub: 'FCFS, SJF, RR, MLFQ — then CFS and EEVDF in Linux,<br>with nice and wake-up latency measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The three numbers every scheduler trades: <b>turnaround</b>, <b>waiting</b>, <b>response</b></li>
<li>FCFS, SJF, SRTF and round robin computed on the textbook set — and why <b>no OS can run SJF</b></li>
<li>The <b>convoy effect</b> and how <b>MLFQ</b> learns from behaviour</li>
<li>What Linux really does: <b>CFS → EEVDF</b>, weights and <b>nice</b> — measured</li>
<li>How long a waking thread waits next to CPU hogs, and what <b>SCHED_FIFO</b> changes</li>
</ul>` },

  { t: 'Every policy trades the same three numbers', to: true, giua: true, body: `
${cards([
    ['Turnaround', 'finish − arrival<br>How long the whole job took. Batch jobs care.'],
    ['Waiting', 'time spent <b>ready but not running</b>. The exam’s favourite average.'],
    ['Response', 'first run − arrival<br>How long until it <b>started</b>. What a user feels.'],
  ])}
${box('The textbook set', 'P1 arrives 0, needs 8 · P2 arrives 1, needs 4 · P3 arrives 2, needs 9 · P4 arrives 3, needs 5. All averages on the next slides come from the same engine as the simulator in the lesson.', 'lam')}` },

  { t: 'FCFS, SJF and SRTF on the textbook set', giua: true, body: `
${gantt([
    ['FCFS', 'P1 P1 P1 P1 P1 P1 P1 P1 P2 P2 P2 P2 P3 P3 P3 P3 P3 P3 P3 P3 P3 P4 P4 P4 P4 P4', 'avg wait 8.75'],
    ['SJF', 'P1 P1 P1 P1 P1 P1 P1 P1 P2 P2 P2 P2 P4 P4 P4 P4 P4 P3 P3 P3 P3 P3 P3 P3 P3 P3', 'avg wait 7.75'],
    ['SRTF', 'P1 P2 P2 P2 P2 P4 P4 P4 P4 P4 P1 P1 P1 P1 P1 P1 P1 P3 P3 P3 P3 P3 P3 P3 P3 P3', 'avg wait 6.5'],
  ], 26)}
${box('Read it', 'SJF puts P4 (5) before P3 (9). SRTF also preempts: when P2 (4) arrives at t = 1, P1 still needs 7, so P2 takes the CPU. Shortest-first minimises average waiting.', 'xanh')}` },

  { t: 'Round robin: worse waiting, much better response', giua: true, body: `
${gantt([
    ['RR q = 4', 'P1 P1 P1 P1 P2 P2 P2 P2 P3 P3 P3 P3 P4 P4 P4 P4 P1 P1 P1 P1 P3 P3 P3 P3 P4 P3', 'wait 11.75 · resp 4.5'],
    ['RR q = 2', 'P1 P1 P2 P2 P3 P3 P1 P1 P4 P4 P2 P2 P3 P3 P1 P1 P4 P4 P3 P3 P1 P1 P4 P3 P3 P3', 'wait 12.75 · resp 2.0'],
  ], 26, { rw: 230 })}
${box('The trade-off', 'Every job gets the CPU within a few units, so response is best. Each slice boundary is a context switch: 7 switches at q = 4, 12 at q = 2 — lesson 3.3 measures what each costs.', 'lam')}` },

  { t: 'The whole table: no policy wins everything', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th>Policy</th><th>Avg waiting</th><th>Avg response</th><th>Needs to know the future?</th></tr>
<tr><td>FCFS</td><td>8.75</td><td>8.75</td><td>no</td></tr>
<tr><td>SJF (non-preemptive)</td><td>7.75</td><td>7.75</td><td><b class="do">yes</b> — burst lengths</td></tr>
<tr><td>SRTF (preemptive)</td><td><b class="xanh">6.5</b></td><td>4.25</td><td><b class="do">yes</b></td></tr>
<tr><td>RR, quantum 4</td><td>11.75</td><td>4.5</td><td>no</td></tr>
<tr><td>RR, quantum 2</td><td>12.75</td><td><b class="xanh">2.0</b></td><td>no</td></tr>
</table>
${box('Law, not trivia', 'SRTF is optimal for average waiting but no OS knows how long a thread will run. RR is fair and responsive but pays in switches. Real schedulers approximate both.', '')}` },

  { t: 'FCFS and the convoy effect', giua: true, body: `
${gantt([
    ['FCFS', 'BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD curl ls git git', 'avg wait 10.25'],
    ['RR q = 2', 'BUILD BUILD curl ls git git BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD BUILD', 'avg wait 2.25'],
  ], 18, { lw: 130 })}
${box('Real-world version', 'One long build at the head of a queue makes three one-second commands wait 13–14 units. Any FIFO queue in your system — a single worker, a job queue, an event loop — has this shape.', 'do2')}` },

  { t: 'MLFQ: learn from behaviour instead of predicting', giua: true, body: two(
    steps([
      'New jobs start in the <b>top</b> queue (highest priority)',
      'Uses its <b>whole quantum</b> ⇒ probably batch work ⇒ <b>drop</b> one level',
      'Gives the CPU back early for <b>I/O</b> ⇒ interactive ⇒ <b>stay</b> high',
      'Periodically <b>boost</b> everyone back to the top — or long jobs starve',
    ]),
    box('Measured in the simulator', 'Editor (short bursts + I/O) vs video encoding vs backup: <b>MLFQ average response 1</b> unit, <b>FCFS 4.33</b>. The simulator has no boost on purpose, so you can see starvation.', 'xanh')) },

  { t: 'Linux: CFS (2007–2023), EEVDF since 6.6', giua: true, body: two(
    `<ul style="font-size:21px">
<li><b>CFS</b>: track each task’s <b>virtual runtime</b> (CPU used ÷ weight); always run the smallest</li>
<li><b>EEVDF</b> (Linux 6.6, 2023): same weights; each task gets a <b>slice</b> and a <b>virtual deadline</b>; among tasks still owed CPU, the earliest deadline runs</li>
<li>Weight from nice: <b>nice 0 = 1024</b>, each step ≈ ×1.25 (nice 5 = 335, nice 19 = 15)</li>
</ul>`,
    sh(`$ grep -E 'load.weight|^prio|se.slice|^policy' \\
      /proc/$!/sched
se.load.weight      :      343040
policy              :           0
prio                :         125
se.slice            :     2800000
$ chrt -p $!
pid 43's current scheduling policy: SCHED_OTHER
pid 43's current scheduling priority: 0
pid 43's current runtime parameter: 2800000`, { sm: true })) + box('Read the live values (kernel 7.0, nice 5)', 'weight 343040 = 335 × 1024 · prio 125 = 120 + nice 5 · slice 2 800 000 ns = 2.8 ms on this 10-CPU machine · policy 0 = SCHED_OTHER', 'lam') },

  { t: 'nice, measured: a share under contention', giua: true, body: `
${niceBars()}
${box('Exactly the weights', '1024 ÷ (1024 + 335) = 75.3% → measured 3.01 s vs 0.99 s. 1024 ÷ (1024 + 15) = 98.6% → 3.94 s vs 0.06 s. On free cores: 4.11 s each — nice changed nothing.', 'xanh')}` },

  { t: 'nice is a share, not a cap', to: true, giua: true, body: `
${vsd(`<ul><li>“I reniced the backup to 19, so it can’t hurt the API”</li><li>On a box with free cores it still takes a <b>whole core</b></li><li>nice does nothing for memory or disk contention</li></ul>`,
    `<ul><li>nice decides who wins when tasks share <b>the same CPU</b></li><li>Need a ceiling? Use a cgroup <b>quota</b>: <code class="i">cpu.max</code>, Docker <code class="i">--cpus</code> (lesson 3.4)</li></ul>`, '✗ Assumption', '✓ What nice really does')}` },

  { t: 'Waking up next to CPU hogs: p99 ≈ one slice', giua: true, body: `
${wakeBars()}
${box('How to read it', 'A thread that sleeps 1 ms and wakes, 2 000 times, on CPU 0. Next to nice-0 hogs it sometimes waits for a slice to end: <b>p99 3.0 ms ≈ the 2.8 ms slice</b>. Nice-19 hogs: 1.3 ms. SCHED_FIFO: 29 µs. “Alone” has a higher median because an idle core sleeps and takes time to wake.', 'lam')}` },

  { t: 'Real-time priority is not a speed button', to: true, giua: true, body: `
<ul>
<li><b>SCHED_FIFO</b> runs until it blocks or yields — it preempts every normal task at once</li>
<li>A spinning RT thread starves everything normal on that core</li>
<li>Safety valve: RT tasks may use <b>950 ms of every 1 000 ms</b> (<code class="i">sched_rt_runtime_us</code> / <code class="i">sched_rt_period_us</code>)</li>
</ul>
${box('Use it for', 'audio, control loops, measurement — short, bounded work. Never for a web server or a batch job.', 'do2')}` },

  { t: 'Cheat sheet — scheduling on a live system', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:44%">You want to…</th><th>Run</th></tr>
<tr><td>Start a job with lower priority</td><td><code class="i">nice -n 10 ./job</code></td></tr>
<tr><td>Lower a running process</td><td><code class="i">renice -n 10 -p PID</code></td></tr>
<tr><td>See policy, slice, weight</td><td><code class="i">chrt -p PID</code> · <code class="i">cat /proc/PID/sched</code></td></tr>
<tr><td>Force tasks to share one core (to test)</td><td><code class="i">taskset -c 0 ./job</code></td></tr>
<tr><td>Real-time (only with care)</td><td><code class="i">chrt -f 10 ./job</code></td></tr>
</table>
${box('Rule of thumb', 'Exams: compute FCFS/SJF/SRTF/RR. Production: Linux shares by weight with a few-ms slice; nice matters only under contention.', 'xanh')}` },
]);
