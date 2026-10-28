/**
 * os-04-6 — khoá "Operating Systems for Developers", bài 4.6 "False sharing: when private data is not private" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c46-false.out.txt qua grab(). Giảng: giang/os-04-6.mjs.
 */
import { lamDeck, sql, box, vsd } from './_pg-chung.mjs';
import { META, grab, term, two, hbars, T, R, BL, GR, RD, OR, PU, GY } from './os-04-chung.mjs';

export const deck = { key: 'os-04-6', code: 'OS 4.6', title: 'False sharing: when private data is not private', sub: 'Operating Systems · Chapter 4' };

const F = 'c46-false';
const g = (p, n = 1) => grab(F, p, n);
const rows = (p) => g(p).split('\n').map((l) => l.match(/^threads=(\d+) (\S+)\s+sum=\d+\s+(\d+) ms/)).filter(Boolean).map((m) => ({ t: +m[1], gap: m[2], ms: +m[3] }));
const r1 = rows('for g in 8 64 128 256; do ./best3.sh taskset -c 0 ./fs 1'), r4 = rows('for g in 8 64 128 256; do ./best3.sh taskset -c 0-3 ./fs 4'), r8 = rows('for g in 8 64 128 256; do ./best3.sh taskset -c 0-7 ./fs 8');
const loc = rows('./best3.sh taskset -c 0-7 ./fs 8 local')[0];
const at = (r, gap) => r.find((x) => x.gap === String(gap)).ms;
const java = g('taskset -c 0-3 java giai/FalseShare.java').split('\n').map((l) => l.match(/^(\w+)\s+sum=[\d,]+\s+(\d+) ms/)).filter(Boolean).map((m) => ({ mode: m[1], ms: +m[2] }));
const perfCmd = (gap) => `perf stat -e task-clock,context-switches taskset -c 0-3 ./fs 4 ${gap} `;
const perf = (gap) => { const s = g(perfCmd(gap)); return { ms: +s.match(/(\d+) ms/)[1], clock: s.match(/([\d,.]+) msec task-clock/)[1], cs: s.match(/(\d+)\s+context-switches/)[1] }; };
const p8 = perf(8), p128 = perf(128);

/* Hình dòng cache 128 byte: bốn bộ đếm 8 byte sát nhau nằm chung một dòng; cách 128 byte thì mỗi bộ đếm một dòng */
const lines = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  const cell = 16, x0 = 90; // 1 ô = 8 byte; một dòng cache 128 B = 16 ô
  const draw = (y, label, pos, color) => {
    s += T(x0 - 12, y + 26, label, 17, { a: 'end', w: 700, f: color });
    for (let L = 0; L < 4; L++) {
      const lx = x0 + L * (cell * 15 + 18);
      s += R(lx, y, cell * 15, 40, '#f7f7f7', '#bbb', { rx: 4, sw: 1.5 });
      s += T(lx + cell * 7.5, y + 60, `cache line ${L} (128 B)`, 13, { a: 'middle', f: '#888' });
    }
    pos.forEach(([L, k], i) => {
      const lx = x0 + L * (cell * 15 + 18) + 4 + k * 15;
      s += R(lx, y + 5, 13, 30, color + '55', color, { rx: 2, sw: 1.5 });
      if (pos[0][0] !== pos[pos.length - 1][0]) s += T(lx + 6.5, y - 6, `T${i}`, 13, { a: 'middle', w: 800, f: color });
    });
    if (pos[0][0] === pos[pos.length - 1][0]) s += T(x0 + 4, y - 6, 'T0 T1 T2 T3 — all in one line', 13, { w: 800, f: color });
  };
  draw(30, 'gap 8 B', [[0, 0], [0, 1], [0, 2], [0, 3]], RD);
  draw(180, 'gap 128 B', [[0, 0], [1, 0], [2, 0], [3, 0]], GR);
  return s + '</svg>';
};

export const slides = lamDeck({ ...META, bai: '4.6' }, [
  { cover: true, t: 'False sharing', sub: `Every thread writes only its own counter —<br>and eight of them still run ${(at(r8, 8) / at(r8, 128)).toFixed(0)}× slower` },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A program where threads share <b>nothing</b> — and still slow each other down</li>
<li>What a <b>cache line</b> is, and why the CPU moves memory in 64- or 128-byte blocks</li>
<li>The gap between counters, swept from 8 to 256 bytes, on 1, 4 and 8 threads</li>
<li>Why <code class="i">getconf</code> said 64 and the right padding here was <b>128</b></li>
<li>You fix the same problem in Java: padding, <code class="i">LongAdder</code>, a local variable</li>
</ul>` },

  { t: 'The program: each thread has its own counter', giua: true, body: two(
    sql(`static char *base; /* one block */
static long gap;   /* bytes apart */

void *work(void *p) {
  long id = (long)p;
  volatile long *mine =
    (volatile long *)(base + id*gap);
  /* load + store, 100 million times */
  for (long i = 0; i < ITERS; i++)
    (*mine)++;
  return NULL;
}`, { lang: 'c', sm: true }),
    `${box('No sharing in the code', 'Thread 0 writes counter 0, thread 1 writes counter 1… Nobody reads or writes anybody else’s counter. No lock, no race, the sums are always right.', 'lam')}
${box('The only thing that changes', 'How many bytes apart the counters sit: 8 (side by side), 64, 128 or 256.', '')}`, 'r46') },

  { t: 'One thread: the gap does not matter', giua: true, body: `
${term(g('for g in 8 64 128 256; do ./best3.sh taskset -c 0 ./fs 1'))}
${box('Baseline', `About ${r1[0].ms} ms for 100 million increments, whatever the gap. Keep this number in mind.`, 'lam')}` },

  { t: 'Four threads: 8 bytes apart is ' + (at(r4, 8) / at(r4, 128)).toFixed(1) + '× slower', giua: true, body: two(
    term(g('for g in 8 64 128 256; do ./best3.sh taskset -c 0-3 ./fs 4')),
    hbars(r4.map((r) => ({ label: `gap ${r.gap} B`, v: r.ms, color: r.gap === '8' ? RD : r.gap === '64' ? OR : GR })), { w: 420, lw: 120, rowH: 62, fs: 18 }), 'r64') },

  { t: 'The CPU does not move bytes — it moves cache lines', giua: true, body: `
${lines()}
<ul style="font-size:21px">
<li>Caches hold memory in <b>lines</b>; to write a line a core must own it <b>exclusively</b> (MESI-style coherence)</li>
<li>Four counters in one line ⇒ every increment steals the line from another core: it ping-pongs between caches</li>
<li>One counter per line ⇒ each core keeps its line and writes at L1 speed</li>
</ul>` },

  { t: 'getconf says 64 — the hardware says 128', giua: true, body: two(
    term(`${g('getconf LEVEL1_DCACHE_LINESIZE')}`),
    `<table class="t" style="font-size:22px">
<tr><th>4 threads, gap</th><th>time</th></tr>
<tr><td>8 B (same line)</td><td><b class="do">${at(r4, 8)} ms</b></td></tr>
<tr><td>64 B (what getconf suggests)</td><td><b>${at(r4, 64)} ms</b></td></tr>
<tr><td>128 B</td><td><b class="xanh">${at(r4, 128)} ms</b></td></tr>
<tr><td>256 B</td><td>${at(r4, 256)} ms</td></tr>
</table>
${box('Measure, do not trust a constant', `Apple M1 keeps coherence in 128-byte lines (the Mac itself: sysctl hw.cachelinesize = 128). Padding to 64 B still put two counters in each line: +${Math.round((at(r4, 64) / at(r4, 128) - 1) * 100)}% with 4 threads, +${Math.round((at(r8, 64) / at(r8, 128) - 1) * 100)}% with 8. Pad to 128 B on Apple Silicon — many x86 servers also fetch 64-B lines in pairs.`, 'do2')}`, 'r37') },

  { t: 'Eight threads: it gets worse with every thread', giua: true, body: two(
    term(`${g('for g in 8 64 128 256; do ./best3.sh taskset -c 0-7 ./fs 8')}\n${g('./best3.sh taskset -c 0-7 ./fs 8 local')}`),
    hbars([
      { label: 'gap 8 B', v: at(r8, 8), color: RD },
      { label: 'gap 64 B', v: at(r8, 64), color: OR },
      { label: 'gap 128 B', v: at(r8, 128), color: GR },
      { label: 'local var', v: loc.ms, color: BL },
    ], { w: 420, lw: 120, rowH: 62, fs: 18 }), 'r64') },

  { t: 'Busy CPU, no useful work', giua: true, body: two(
    term(`${g(perfCmd(8))}\n${g(perfCmd(128))}`.replace(/ 2>&1 \| grep .*$/gm, '')),
    `<ul style="font-size:22px">
<li>gap 8: <b>${p8.clock} ms</b> of CPU for ${p8.ms} ms of wall time</li>
<li>gap 128: <b>${p128.clock} ms</b> of CPU for the same work</li>
<li>${p8.cs} vs ${p128.cs} context switches: nobody slept — the cores were stalled waiting for a cache line</li>
<li>Top would show 400% CPU in both cases: false sharing hides inside “busy” <span class="nho">(perf output filtered with grep)</span></li>
</ul>`, 'r64') },

  { t: 'Where false sharing hides in real code', to: true, giua: true, body: `
<ul>
<li>An array of per-thread counters or stats: <code class="i">long hits[NTHREADS]</code></li>
<li>Per-worker structs allocated back to back; a “thread-local” slot in a shared array</li>
<li>A hot counter next to a hot lock or flag in the same struct</li>
<li>Java: fields of one object, <code class="i">AtomicLongArray</code> slots; the JDK pads its own hot fields (<code class="i">@Contended</code>, used inside <code class="i">LongAdder</code>)</li>
</ul>` },

  { t: 'Write it yourself: the same bug in Java', giua: true, body: two(
    term(g('taskset -c 0-3 java giai/FalseShare.java')),
    hbars(java.map((r) => ({ label: r.mode, v: r.ms, color: r.mode === 'adjacent' ? RD : r.mode === 'padded' ? OR : r.mode === 'adder' ? GR : BL, mono: true })), { w: 520, lw: 130, rowH: 64, fs: 18 }), 'r46') },

  { t: 'Three fixes, in order of preference', giua: true, body: `
${vsd(`<ul><li>Per-thread slots side by side in one array</li><li>Atomic increments on a shared counter in a hot loop</li><li>Trusting “64 bytes” on every CPU</li></ul>`,
    `<ul><li><b>Do not share</b>: accumulate in a local variable, publish once (${loc.ms} ms with 8 threads)</li><li>Use a striped counter: Java <code class="i">LongAdder</code>, per-CPU counters</li><li>If a shared array is unavoidable: pad each slot to <b>128 B</b> (measure!)</li></ul>`, '✗ Slow', '✓ Fast')}` },

  { t: 'Cheat sheet — false sharing', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:40%">You want to…</th><th>Do</th></tr>
<tr><td>Know the line size</td><td><code class="i">getconf LEVEL1_DCACHE_LINESIZE</code> — then <b>measure</b> with a gap sweep</td></tr>
<tr><td>Spot it</td><td>speedup collapses as threads are added, CPU stays at 100%, no locks in the hot loop</td></tr>
<tr><td>Fix it in C</td><td>local accumulation; <code class="i">alignas(128)</code> / padding per-thread structs</td></tr>
<tr><td>Fix it in Java</td><td><code class="i">LongAdder</code>, local variables; pad array slots by 16 longs</td></tr>
<tr><td>Read more</td><td>kernel.org: “False sharing” in the kernel-hacking docs</td></tr>
</table>` },
]);
