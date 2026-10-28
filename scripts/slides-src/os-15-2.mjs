/**
 * os-15-2 — khoá "Operating Systems for Developers", bài 15.2 "perf and flame graphs" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c152-perf.out.txt; flame graph = SVG thật lab/code/ch15/fg/*.svg.
 * Giảng: giang/os-15-2.mjs.
 */
import { lamDeck, box, cards, steps, flow } from './_pg-chung.mjs';
import { META, g, num, tiny, code, fg, bars, svg, T, R, SRC, dong, noCmt, BL, GR, RD, GY } from './os-15-chung.mjs';

export const deck = { key: 'os-15-2', code: 'OS 15.2', title: 'perf and flame graphs', sub: 'Operating Systems · Chapter 15' };

const F = 'c152-perf';
const before = +num(F, './hot 50000', /: (\d+) ms/);
const after = +num(F, './hot 50000 table', /: (\d+) ms/);
const crcPct = num(F, 'perf report -i hot.data --stdio --no-children --sort symbol 2', /([\d.]+)%\s+\[\.\] crc_bitwise/);
const dwarf = +num(F, 'perf record -q -F 999 --call-graph dwarf', /(\d+) dwarf\.data/);
const fp = +num(F, 'perf record -q -F 999 --call-graph dwarf', /(\d+) hot\.data/);
const nodePct = num(F, 'perf report -i node.data', /([\d.]+)%\s+\[\.\] Builtins_ArrayIncludesSmiOrObject/);
const fixed = g(F, 'perf script -i fixed.data');
const pick = (t, name) => +t.split('\n').find((l) => l.trim().startsWith(name)).trim().split(/\s+/).pop().replace('%', '');

/* Lấy mẫu: trục thời gian, các nhịp 999 Hz, mỗi nhịp chụp một ngăn xếp */
const sampling = () => {
  let s = T(20, 30, 'one thread over time →', 17, { w: 700, f: '#555' });
  const segs = [[60, 520, GR, 'on CPU: handle → crc_bitwise'], [520, 700, '#bbbbbb', 'off CPU (waiting)'], [700, 1060, GR, 'on CPU: handle → render_json']];
  segs.forEach(([a, b, c, t]) => { s += R(a, 50, b - a, 34, c + '55', c, { rx: 4 }) + T((a + b) / 2, 73, t, 15, { a: 'middle', w: 700 }); });
  for (let x = 80; x < 1060; x += 55) {
    const on = !(x > 520 && x < 700);
    s += `<line x1="${x}" y1="96" x2="${x}" y2="112" stroke="${on ? RD : '#bbbbbb'}" stroke-width="3"/>`;
  }
  s += T(80, 132, 'every tick (1/999 s of CPU time) the kernel records the stack of the running thread', 15, { f: RD, w: 700 });
  const stack = (x, fr, c) => fr.map((f, i) => R(x, 220 - i * 30, 200, 26, c + '22', c, { rx: 3, sw: 1.5 }) + T(x + 100, 238 - i * 30, f, 14, { a: 'middle', m: true })).join('');
  s += stack(90, ['main', 'handle', 'crc_bitwise'], BL) + stack(310, ['main', 'handle', 'crc_bitwise'], BL) + stack(800, ['main', 'handle', 'render_json'], BL);
  s += T(610, 190, 'no samples', 15, { a: 'middle', f: GY, w: 700 }) + T(610, 210, 'while waiting', 15, { a: 'middle', f: GY, w: 700 });
  return svg(1080, 260, s);
};

export const slides = lamDeck(META('15.2'), [
  { cover: true, t: 'perf and flame graphs', sub: 'Sample the CPU, read the hot path,<br>fix it — and measure again' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>How a <b>sampling profiler</b> sees a program — and what it cannot see</li>
<li><b>perf stat → record → report → script</b> on a C request handler</li>
<li>Folded stacks and <b>flame graphs</b>: what width, height and colour mean</li>
<li>Down to one instruction with <b>perf annotate</b>; fix, re-profile, diff</li>
<li>Three ways to break the picture; <b>Node</b> under perf with a map file</li>
</ul>` },

  { t: 'Sampling: 999 stack snapshots per CPU-second', giua: true, body: `
${sampling()}
${box('Three consequences', '<b>Statistical</b>: 87% of samples ≈ 87% of CPU time. <b>On-CPU only</b>: waiting threads are never sampled (lesson 15.3). <b>Needs symbols + frame pointers</b> to name and walk the stack.', 'lam')}` },

  { t: 'The program: a request handler with a slow checksum', body: `
${code(noCmt(dong(SRC('hot.c'), 20, 27)) + '\n' + noCmt(dong(SRC('hot.c'), 34, 37)) + '\n' + noCmt(dong(SRC('hot.c'), 48, 52)), 'c', 14)}
${box('Deliberately slow', 'crc_bitwise runs <b>8 loop iterations for every byte</b> of every 1.5 KB request. Every function is noinline so it keeps its own stack frame.', '')}` },

  { t: 'perf stat first: is it an on-CPU problem?', giua: true, body: `
${tiny(g(F, 'perf stat'), 16)}
${box('Shape first', `task-clock ${num(F, 'perf stat', /([\d.]+) msec task-clock/)} ms ≈ elapsed ${(+num(F, 'perf stat', /([\d.]+) seconds time elapsed/) * 1000).toFixed(0)} ms, almost no context switches ⇒ the program is on a CPU all the time ⇒ a CPU profiler is the right tool.`, 'xanh')}` },

  { t: `perf report: ${crcPct}% of the samples are in crc_bitwise`, body: tiny([
    g(F, 'perf record -F 999 -g -o hot.data'),
    g(F, 'perf report -i hot.data --stdio --no-children --sort symbol 2'),
    g(F, 'perf report -i hot.data --stdio --no-children --sort symbol --symbols'),
  ].join('\n'), 14) },

  { t: 'From samples to folded stacks', body: `
${flow([{ t: 'perf script', s: 'one stack per sample' }, { t: 'stackcollapse-perf.pl', s: 'root;…;leaf  count' }, { t: 'flamegraph.pl', s: 'draws boxes (SVG)' }], { h: 130, fs: 19 })}
${tiny([g(F, 'perf script -i hot.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | perl', 2)].join('\n'), 14)}
${box('The folded text IS the flame graph', 'flamegraph.pl only draws it. 915 samples → 17 distinct stacks; the top line alone has 795 samples.', 'lam')}` },

  { t: 'The flame graph of hot.c', body: `${fg('hot', { h: 430 })}
<div class="cap" style="text-align:center">Real SVG drawn by flamegraph.pl from the 915 samples above (lab/code/ch15/fg/hot.svg).</div>
${box('One plateau', `crc_bitwise on top of handle → main covers ${crcPct}% of the width. On the right: render_json → __sprintf_chk → printf internals; the narrow “p…” box is parse_headers.`, 'lam')}` },

  { t: 'How to read a flame graph', to: true, giua: true, body: cards([
    ['↕ y-axis = stack depth', 'a box sits on top of the function that called it'],
    ['↔ x-axis is NOT time', 'boxes are sorted alphabetically so equal stacks merge'],
    ['▭ width = share of samples', 'crc_bitwise covers 87% of the width'],
    ['▔ top edge = on CPU', 'wide flat tops (plateaus) are where the CPU is'],
  ], 2) },

  { t: 'perf annotate: down to one instruction', giua: true, body: `
${tiny(g(F, 'perf annotate'), 16)}
${box('Read it as a neighbourhood', `<b>${num(F, 'perf annotate', /^\s+([\d.]+) :.*sbfx/m)}%</b> on <code>sbfx</code> (builds the mask −(c &amp; 1)) and ${num(F, 'perf annotate', /^\s+([\d.]+) :.*b\.ne/m)}% on the branch that closes the 8-step bit loop. Samples “skid” to the next instruction, so trust the loop, not the exact address.`, '')}` },

  { t: `Fix, then measure again: ${before} → ${after} ms`, giua: true, body: `
${bars([
    ['before — crc bitwise', before, RD, `${before} ms`],
    ['after — crc table', after, GR, `${after} ms (${(before / after).toFixed(1)}× faster)`],
  ], { label: 260, rowH: 52 })}
${cards([
    ['Why not 8×?', `the checksum was ${crcPct}% of the time; the rest did not change (Amdahl, lesson 4.5)`],
    ['The next to-do list', `new profile: crc_table ${pick(fixed, 'crc_table')}%, render_json ${fixed.split('TOTAL')[1].split('\n').find((l) => l.includes('render_json')).trim().split(/\s+/).pop()} total`],
  ], 2)}` },

  { t: 'Differential flame graph: what changed', body: `${fg('hot-diff', { h: 420 })}
<div class="cap" style="text-align:center">difffolded.pl -n hot.folded fixed.folded | flamegraph.pl</div>
${box('Read it with care', 'Widths are the <b>AFTER</b> profile; red = more samples than before, blue = fewer (-n normalises the totals). crc_bitwise vanished, so it cannot appear at all, and the renamed crc_table shows as all-new red. Draw the reverse diff too.', '')}` },

  { t: 'Three ways to break the picture', to: true, giua: true, body: cards([
    ['Stripped binary', `<code>gcc -s</code>: the hot spot became <b>0x…e2c</b> — no name, nothing to act on`],
    ['No frame pointers', 'arm64 (measured): stacks still complete. x86-64 -O2: broken stacks <i>(per docs, not measured)</i>'],
    ['--call-graph dwarf', `works without frame pointers, but the file was <b>${(dwarf / fp).toFixed(0)}×</b> bigger (${(dwarf / 1e6).toFixed(1)} MB vs ${(fp / 1e3).toFixed(0)} KB)`],
  ], 3) },

  { t: `Node under perf: ${nodePct}% in Array.prototype.includes`, body: `${fg('node', { h: 430, win: ['Builtins_ArrayIncludesSmiOrObject', 'uv_run'] })}
<div class="cap" style="text-align:center">node --perf-basic-prof orders.js under load — the band from uv_run up to includes of lab/code/ch15/fg/node.svg (the full SVG is 1542 px tall: a few rare V8 stacks are very deep).</div>` },

  { t: 'With and without the map file', body: tiny([
    g(F, "awk '{n = $NF; $NF = \"\"; print n, $0}' node.folded"),
    g(F, "awk '{n = $NF; $NF = \"\"; print n, $0}' nomap.folded"),
  ].join('\n'), 16) + box('Without --perf-basic-prof', 'The built-in keeps its name (it is inside the node binary), but every JavaScript caller becomes [perf-PID.map]: you know WHAT is hot, not WHO called it.', 'do2') },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>Check the shape with <b>perf stat</b> before you profile</li>
<li><b>record → report → script → fold → flame graph</b>; the folded text is the data</li>
<li>Width = share; the x-axis is <b>not</b> time</li>
<li>After a fix, <b>profile again</b>: ${before} → ${after} ms, and a new top item</li>
<li>Keep symbols and frame pointers; give JITs a <b>map file</b></li>
</ul>` },
]);
