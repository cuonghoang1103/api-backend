/**
 * os-16-5 — khoá "Operating Systems for Developers", bài 16.5 "Exam drills (3/3): deadlock, disks, semaphores" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c165-banker-dia.out.txt qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-16-5.mjs.
 */
import { lamDeck, sh, box, steps, vsd, two } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-16-5', code: 'OS 16.5', title: 'Exam drills (3/3): deadlock, disks, semaphores', sub: 'Operating Systems · Chapter 16 — Exams & interviews' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
const B = (pre, n = 1) => grab('c165-banker-dia', pre, n, { drop: /^# / });
const bank = B('python3 osgcalc.py banker "1,0,1 2,1,1').split('\n');

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 16 — Exams & interviews', bai: '16.5',
}, [
  { cover: true, t: 'Exam drills (3/3):<br>deadlock, disks, semaphores', sub: 'Banker, detection, disk-arm scheduling, cylinder skew — and every interleaving of three processes' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Banker’s algorithm as a <b>four-line routine</b>: safe? grant?</li>
<li>The smallest x, the Has/Max tables, <b>detection</b> with a Request matrix</li>
<li>Disk arm: <b>FCFS, SSTF, SCAN, LOOK, C-SCAN, C-LOOK</b></li>
<li>Cylinder skew in one line of arithmetic</li>
<li>Which outputs can semaphores print — <b>enumerated</b></li>
</ul>` },

  { t: 'Banker in four lines', giua: true, to: true, body: steps([
    '<b>Need = Max − Allocation</b>, row by row — write it out',
    '<b>Work = Available</b>; first Pi with Need ≤ Work finishes: Work += Alloc',
    'Everyone finished ⇒ <b>safe</b> (that order is a safe sequence)',
    '<b>Request</b>: ≤ Need? ≤ Available? pretend, run step 2, grant only if safe',
  ]) },

  { t: 'B1: Need, then the scan', giua: true, body: term(bank.slice(0, 14).join('\n'), 18) +
    box('', 'Only P1 fits Work (2,1,1). Then P2, P3, P4 in the same scan, P0 last: <b>&lt;P1, P2, P3, P4, P0&gt;</b>.', 'xanh') },

  { t: 'B1: deny P4, then grant P1', giua: true, body: term(bank.slice(14).join('\n'), 16) +
    box('', 'P4’s request passes both checks but leaves (1,1,0): nobody fits ⇒ <b>wait</b>. P1’s (1,0,0) stays safe ⇒ <b>grant</b>.', 'lam') },

  { t: 'B2–B3: smallest x, and one free unit', giua: true, body: two(term(B('python3 osgcalc.py banker-x').split('\n').slice(0, 10).join('\n'), 13, 540), term(B('python3 osgcalc.py banker "2 1 3 2" "7 4 5 8" "1"'), 13, 540)) +
    box('', 'x = 1: Need ≤ Work includes equality. Has/Max with 1 free: <b>unsafe</b> — yet nobody is deadlocked.', 'lam') },

  { t: 'B4: detection uses Request, not Need', giua: true, body: term(B('python3 osgcalc.py detect', 2), 14) +
    box('', 'Nothing free ⇒ all four deadlocked. One free B ⇒ P0 finishes and unblocks the rest.', 'lam') },

  { t: 'K1: head at 80, moving up — six algorithms', giua: true, body: term(B('python3 osgcalc.py disk fcfs 80', 6).split('\n').filter((l) => !l.startsWith('$')).join('\n'), 15) },

  { t: 'K1: read the order, name the algorithm', giua: true, to: true, body: `<table class="t" style="font-size:24px"><tr><th>Algorithm</th><th>Total</th><th>Tell-tale</th></tr>
<tr><td>FCFS</td><td>708</td><td>queue order</td></tr><tr><td>SSTF</td><td>237</td><td>starts with the nearest (67)</td></tr>
<tr><td>SCAN · LOOK</td><td>306 · 270</td><td>up to 199 · up to 181, then back down</td></tr>
<tr><td>C-SCAN · C-LOOK</td><td>385 · 325</td><td>jump to 0 · jump to 12, then up again</td></tr></table>` +
    box('', '80, 98, 132, 140, 181, 12, 30, 45, 67 ⇒ <b>C-LOOK</b>. C-SCAN counts the 199-cylinder return (186 without it) — say your rule.', 'lam') },

  { t: 'K1–K2: direction matters; skew is one division', giua: true, body: term(B('python3 osgcalc.py disk look 80 "45 132 12 98 181 67 140 30" down', 2), 17) +
    box('', 'LOOK moving down = SSTF here (237). Skew: 8.33 ms per turn / 300 sectors ⇒ 36 sectors pass in a 1 ms seek.', 'lam') },

  { t: 'Y1: every interleaving, enumerated', giua: true, body: term(B('python3 osgcalc.py sem'), 18) +
    box('', 'DACB is impossible: P3 takes S first, P1 can never get S — that run blocks forever after "D".', 'do2') },

  { t: 'Pitfall: "unsafe" written as "deadlocked"', giua: true, to: true, body: vsd(
    'B3 with one free unit: "the processes are deadlocked".',
    '"Unsafe: no completion is guaranteed." Deadlock is a fact about blocked processes now — that is detection (B4).') },

  { t: 'Practice: two classics, then a variation', giua: true, to: true, body: `
<ol>
<li>Banker: Available (3,3,2), the textbook 5 × 3 table — safe?</li>
<li>Disk: head 53, queue 98, 37, 14, 65, 67 — SSF, then LOOK up</li>
<li>Check both with <code class="i">osgcalc.py banker …</code> and <code class="i">disk sstf 53 …</code></li>
<li>Y1 with P3 doing <code class="i">wait(T)</code>: predict, then run</li>
</ol>` + box('Done when', 'your paper matches the program and you can name each trap.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>B1: safe &lt;P1, P2, P3, P4, P0&gt;; deny P4 (1,0,1), grant P1 (1,0,0)</li>
<li>B2: x = 1 · B3: 2 free safe, 1 free unsafe · B4: all four / none</li>
<li>Disk from 80 up: 708 · 237 · 306 · 270 · 385 (186) · 325</li>
<li>Skew at 7,200 RPM, 300 sectors, 1 ms seek: 36</li>
<li>Semaphores: enumerate — DACB impossible, that branch deadlocks</li>
</ul>` },
]);
