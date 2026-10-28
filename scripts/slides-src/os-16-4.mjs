/**
 * os-16-4 — khoá "Operating Systems for Developers", bài 16.4 "Exam drills (2/3): memory" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c164-bo-nho.out.txt qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-16-4.mjs.
 */
import { lamDeck, sh, box, steps, vsd, two } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-16-4', code: 'OS 16.4', title: 'Exam drills (2/3): memory', sub: 'Operating Systems · Chapter 16 — Exams & interviews' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const M = (pre, n = 1) => grab('c164-bo-nho', pre, n, { drop: /^# / });

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 16 — Exams & interviews', bai: '16.4',
}, [
  { cover: true, t: 'Exam drills (2/3):<br>memory', sub: 'Page replacement, victims, address fields, page tables and the TLB — by hand, then checked' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>table method</b> for FIFO, LRU, OPT and Clock</li>
<li><b>Belady’s anomaly</b>, measured</li>
<li>Choosing a <b>victim</b> from a Loaded / Last-ref / R / M table</li>
<li>Splitting an address into <b>fields</b>, page-table size, segments</li>
<li><b>Effective access time</b> with a TLB</li>
</ul>` },

  { t: 'One column per reference, one row per frame', giua: true, to: true, body: steps([
    'Hit: no mark. Fault: write <b>F</b>; no free frame ⇒ cross out the victim',
    '<b>FIFO</b> evicts the page <b>loaded</b> earliest',
    '<b>LRU</b> evicts the page <b>used</b> least recently',
    '<b>OPT</b> evicts the page used <b>furthest in the future</b> (or never)',
    '<b>Clock</b> sweeps a hand, clearing R bits until it finds a 0',
  ]) },

  { t: 'M1: FIFO on 7 2 7 3 1 2 4 2 7 3 2 1 5 2, 3 frames', giua: true, body: term(M('python3 osgcalc.py page fifo 3'), 19) +
    box('', 'FIFO even evicts page 2 right after using it: <b>11 faults</b>.', 'lam') },

  { t: 'M1: LRU and OPT on the same string', giua: true, body: term(M('python3 osgcalc.py page lru 3'), 15) + term(M('python3 osgcalc.py page opt 3'), 15) },

  { t: 'M1 in one table — and LRU is not always better', giua: true, to: true, body: `<table class="t" style="font-size:26px"><tr><th>Algorithm</th><th>3 frames</th><th>4 frames</th></tr><tr><td>FIFO</td><td>11</td><td><b>8</b></td></tr><tr><td>LRU</td><td>10</td><td><b>9</b></td></tr><tr><td>OPT</td><td>8</td><td>—</td></tr><tr><td>Clock (new page R = 1)</td><td>10</td><td>—</td></tr></table>` +
    box('', 'With 4 frames FIFO beats LRU on this string. "LRU always causes fewer faults" is false.', 'do2') },

  { t: 'Belady: FIFO gets worse with more frames', giua: true, body: term(M('python3 osgcalc.py page fifo 3 "1 2 3 4', 3), 18) +
    box('', 'FIFO: 3 frames ⇒ 9, 4 frames ⇒ 10. LRU and OPT are stack algorithms: never worse with more frames.', 'lam') },

  { t: 'M3: each algorithm reads one column', giua: true, body: term(M('python3 osgcalc.py victim'), 20) +
    box('', 'FIFO ⇒ Loaded · LRU ⇒ Last ref · NRU ⇒ class 2R + M. Reading the wrong column is the trap.', 'lam') },

  { t: 'M4: write the binary first', giua: true, body: term(M('python3 osgcalc.py addr bits=10,10,12 0x12345678'), 19) +
    box('', '10-bit fields cut through hex digits: PT1 = 72, PT2 = 837 — not 0x12 and 0x345.', 'do2') },

  { t: 'M4: page-table size, address length, segments', giua: true, body: term(M('python3 osgcalc.py pagesize 32 8192 4', 4), 16) +
    box('', 'Offset bits fix the page size · page-number bits fix the count · check the limit <b>before</b> adding the base.', 'lam') },

  { t: 'M5: the TLB makes deep page tables affordable', giua: true, body: term(M('python3 osgcalc.py eat 10 80 0.95', 3), 17) +
    box('', 'EAT = hit × (TLB + mem) + miss × (TLB + levels × mem + mem). 95 % hits: 94 ns, or 106 ns with 4 levels.', 'lam') },

  { t: 'Pitfall: splitting at hex digits', giua: true, to: true, body: vsd(
    '0x12345678 with 10/10/12 ⇒ "PT1 = 0x12, PT2 = 0x345".',
    'Write 32 bits in groups of four, draw the 10/10/12 boundaries: PT1 = 72, PT2 = 837, offset 0x678.') },

  { t: 'Practice: two past-paper questions', giua: true, to: true, body: `
<ol>
<li>LRU, 3 frames: <code class="i">4 7 6 1 7 6 1 2 7 2</code></li>
<li>32-bit address split 10/11/11: page size?</li>
<li>Check: <code class="i">osgcalc.py page lru 3 "…"</code> and <code class="i">addr bits=10,11,11 0x0</code></li>
<li>EAT for TLB 20 ns, memory 100 ns, 98 % hits, 2 levels</li>
</ol>` + box('Done when', 'paper answers match the program; you can name the one column each algorithm uses.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>M1 (3 frames): FIFO 11 · LRU 10 · OPT 8 · Clock 10</li>
<li>4 frames: FIFO 8 beats LRU 9 — LRU is better on average, not always</li>
<li>Belady: FIFO 9 → 10 faults from 3 to 4 frames</li>
<li>Binary first: 0x12345678 (10/10/12) = 72, 837, 0x678</li>
<li>EAT 94 ns (1 level), 106 ns (4 levels) at 95 % hits</li>
</ul>` },
]);
