/**
 * os-16-3 — khoá "Operating Systems for Developers", bài 16.3 "Exam drills (1/3): CPU scheduling" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c163-lich.out.txt + c16-engine.out.txt qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-16-3.mjs.
 */
import { lamDeck, sh, box, steps, vsd, two } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-16-3', code: 'OS 16.3', title: 'Exam drills (1/3): CPU scheduling', sub: 'Operating Systems · Chapter 16 — Exams & interviews' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const L = (pre, n = 1, o = {}) => grab('c163-lich', pre, n, o);
const noCs = { drop: /^(context switches|# )/ };

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 16 — Exams & interviews', bai: '16.3',
}, [
  { cover: true, t: 'Exam drills (1/3):<br>CPU scheduling', sub: 'Gantt charts, waiting and turnaround — drawn by hand, checked by two programs' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A <b>five-step method</b> that draws the Gantt chart the marker expects</li>
<li>The <b>tie rule</b> that decides round-robin answers</li>
<li>Three new problems in the OSG202 style: FCFS, SJF, SRTF, priority, RR</li>
<li>Every answer produced by <code class="i">osgcalc.py</code>, re-checked by the /os-lab engine</li>
</ul>` },

  { t: 'Five steps, no shortcuts', giua: true, to: true, body: steps([
    '<b>Table</b>: job, arrival, burst, priority — and which number is "high"',
    '<b>Time line</b>: arrivals in, preempt?, pick next — at every moment',
    '<b>Tie rules</b>: write them on the paper',
    '<b>Finish → turnaround → waiting</b> (and response)',
    '<b>Check</b>: chart length = sum of bursts; waiting ≥ 0',
  ]) },

  { t: 'The three formulas', giua: true, to: true, body: bang(['Measure', 'Formula'], [
    ['turnaround', 'finish − arrival'], ['waiting', 'turnaround − burst'], ['response', 'first run − arrival'],
  ], 26) + box('Round-robin tie rule', 'A job arriving at time t joins the queue <b>before</b> the job preempted at t (textbook rule — osgcalc.py and the /os-lab simulator follow it).', 'lam') },

  { t: 'S1: five batch jobs, all at time 0', giua: true, to: true, body: bang(['Job', 'A', 'B', 'C', 'D', 'E'], [
    ['burst (min)', '6', '3', '8', '2', '5'], ['priority (5 = highest)', '4', '1', '5', '2', '3'],
  ], 26) + box('', 'Asked: FCFS average turnaround · SJF average waiting · priority average waiting · RR (q = 2) average turnaround.', '') },

  { t: 'S1: FCFS and SJF', giua: true, body: two(term(L('python3 osgcalc.py sched fcfs "A:0:6:4', 1, noCs), 14, 540), term(L('python3 osgcalc.py sched sjf "A:0:6:4', 1, noCs), 14, 540)) +
    box('', 'FCFS turnaround 75 / 5 = <b>15</b> · SJF waiting 33 / 5 = <b>6.6</b>. Do not swap the two columns.', 'lam') },

  { t: 'S1: priority and round robin', giua: true, body: two(term(L('python3 osgcalc.py sched prio "A:0:6:4', 1, noCs), 14, 540), term(L('python3 osgcalc.py sched rr "A:0:6:4', 1, noCs), 13, 540)) +
    box('', 'Priority (5 high): C A E D B ⇒ waiting <b>12.4</b>. RR q=2 turnaround <b>17.2</b> — its waiting is also 12.4, a coincidence.', 'lam') },

  { t: 'S2: SJF without preemption', giua: true, body: term(L('python3 osgcalc.py sched sjf "P1:0:7', 1, noCs), 18) +
    box('', 'P1 alone at 0 runs to 7. Then shortest: P3, P5, then P2 (ties P4 on 4, arrived earlier).', 'lam') },

  { t: 'S2: SRTF re-decides at every arrival', giua: true, body: term(L('python3 osgcalc.py sched srtf "P1:0:7', 1, noCs), 18) +
    box('', 'P2 beats P1 at 1, P3 beats P2 at 2, P5 beats P4 at 6. Waiting 18 / 5 = <b>3.6</b>.', 'lam') },

  { t: 'S2: the quantum boundary at time 6', giua: true, body: term(L('python3 osgcalc.py sched rr "P1:0:7', 1, noCs), 16) +
    box('', 'P5 arrives exactly when P2’s slice ends ⇒ P5 queues first. P2 finishes at 17: turnaround <b>16</b>.', 'do2') },

  { t: 'S3: preemption changes the answer', giua: true, body: two(term(L('python3 osgcalc.py sched prio-p "P1:0:6:3', 1, noCs), 14, 540), term(L('python3 osgcalc.py sched prio "P1:0:6:3', 1, noCs), 14, 540)) +
    box('', 'Smaller number = higher. Preemptive: waiting <b>3.25</b>. Non-preemptive: 4.', 'lam') },

  { t: 'Every answer checked by a second program', giua: true, body: term(grab('c16-engine', 'node --experimental-strip-types kiem-engine.mts', 1, { max: 9 }), 15) +
    box('', 'osgcalc.py (Python) vs the /os-lab engines (TypeScript): <b>108 / 108</b> checks agree.', 'xanh') },

  { t: 'Pitfall: guessing the tie', giua: true, to: true, body: vsd(
    'Put the preempted job back first when a new one arrives at the same instant — without saying so.',
    'Write the rule at the top. If the result is not among the options, try the other order before anything else.') },

  { t: 'Practice: the past-paper RR question', giua: true, to: true, body: `
<ol>
<li>A–D arrive at 0, 1, 2, 3; bursts 8, 4, 9, 5; RR q = 4</li>
<li>Draw the chart; compute B’s turnaround and the average waiting</li>
<li>Check: <code class="i">python3 osgcalc.py sched rr "A:0:8 B:1:4 C:2:9 D:3:5" q=4</code></li>
<li>Explain why S1 gives the same averages under SRTF and SJF</li>
</ol>` + box('Done when', 'your chart matches the program slice for slice.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Table → time line → written tie rules → formulas → check</li>
<li>S1: FCFS TAT 15 · SJF wait 6.6 · priority wait 12.4 · RR TAT 17.2</li>
<li>S2: SJF order P1 P3 P5 P2 P4 · SRTF wait 3.6 · RR q=3 P2 TAT 16</li>
<li>S3: preemptive priority wait 3.25 vs 4</li>
<li>Two independent programs agree on every answer</li>
</ul>` },
]);
