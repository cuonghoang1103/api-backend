/**
 * os-11-4 — khoá "Operating Systems for Developers", bài 11.4 "What a syscall costs" (28/10/2026).
 * Khuôn _pg-chung.mjs. Mọi số đo đọc THẲNG từ lab/out/c114-chi-phi.out.txt qua grab(); biểu đồ vẽ từ chính các dòng đó.
 * Giảng: content/courses/operating-systems-for-developers/giang/os-11-4.mjs.
 */
import { lamDeck, sh, box, cards, vsd, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-11-4', code: 'OS 11.4', title: 'What a syscall costs', sub: 'Operating Systems · Chapter 11' };

const g = (pre, n = 1) => grab('c114-chi-phi', pre, n);
const wrap = (t, max) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 14) => sh(wrap(t, Math.floor(1060 / (fs * 0.602))), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 3}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4fa0';
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto">${inner}</svg>`;

/* ns mỗi lời gọi, thang log, từ ./cost */
const costRows = g('gcc -O2 -Wall cost.c').split('\n').slice(1).map((l) => { const m = l.match(/^(.*?)\s+([\d.]+) ns$/); return [m[1].replace(/\s+/g, ' '), +m[2]]; });
const costSvg = () => {
  const X = 400, W = 600, lo = Math.log10(1), hi = Math.log10(400), sx = (v) => X + (Math.log10(v) - lo) / (hi - lo) * W;
  let s = '';
  [1, 10, 100].forEach((v) => { s += `<line x1="${sx(v)}" y1="18" x2="${sx(v)}" y2="${24 + costRows.length * 46}" stroke="#ddd"/>` + T(sx(v), 14, `${v} ns`, 14, { a: 'middle', f: '#888' }); });
  costRows.forEach(([n, v], i) => {
    const y = 24 + i * 46, c = /plain/.test(n) ? GR : /vDSO/.test(n) ? BL : RD;
    s += T(X - 12, y + 26, n, 16, { a: 'end', m: 1 }) + R(X, y + 6, sx(v) - X, 30, c + '33', c) + T(sx(v) + 10, y + 28, `${v} ns`, 18, { w: 800, f: c });
  });
  return svg(1110, 30 + costRows.length * 46, s);
};

/* 100 000 dòng, bốn cách */
const batchRows = g('gcc -O2 -Wall batch.c').split('\n').slice(1).map((l) => { const p = l.trim().split(/ +/); return [p[0], +p[1]]; });
const callRows = Object.fromEntries(g('for m in line writev stdio big; do strace').split('\n').slice(1).map((l) => [l.split(':')[0], l.split(':')[1].trim()]));
const batchSvg = () => {
  const X = 140, W = 700, max = Math.max(...batchRows.map((r) => r[1])), sx = (v) => X + v / max * W;
  let s = '';
  batchRows.forEach(([n, v], i) => {
    const y = 10 + i * 70, c = n === 'line' ? RD : GR;
    s += T(X - 12, y + 32, n, 20, { a: 'end', m: 1, w: 700 }) + R(X, y + 8, Math.max(4, sx(v) - X), 38, c + '33', c) + T(sx(v) + 12, y + 34, `${v} ms`, 20, { w: 800, f: c }) + T(1090, y + 34, callRows[n], 17, { a: 'end', m: 1, f: '#555' });
  });
  return svg(1110, 290, s);
};

/* chép 256 MiB */
const copyRows = g('for m in rw4k rw128k sendfile cfr; do ./copy').split('\n').slice(1).map((l) => { const p = l.trim().split(/ +/); return [p[0], +p[4], +p[6], +p[8]]; });
const NAMES = { rw4k: 'read+write 4 KiB', rw128k: 'read+write 128 KiB', sendfile: 'sendfile()', cfr: 'copy_file_range()' };
const copySvg = () => {
  const X = 250, W = 560, max = Math.max(...copyRows.map((r) => r[1])), sx = (v) => X + v / max * W;
  let s = T(X, 18, 'seconds to copy 256 MiB (page cache warm)', 15, { f: '#888' }) + T(1090, 18, 'syscalls', 15, { a: 'end', f: '#888' });
  copyRows.forEach(([m, sec, mbs, n], i) => {
    const y = 30 + i * 66, c = /^rw/.test(m) ? RD : GR;
    s += T(X - 12, y + 32, NAMES[m], 18, { a: 'end', m: 1, w: 700 }) + R(X, y + 8, sx(sec) - X, 38, c + '33', c) +
      T(sx(sec) + 10, y + 34, `${sec} s · ${mbs.toLocaleString('en')} MiB/s`, 18, { w: 800, f: c }) + T(1090, y + 34, n.toLocaleString('en'), 19, { a: 'end', m: 1, w: 700, f: '#444' });
  });
  return svg(1110, 300, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 11 — System calls', bai: '11.4',
}, [
  { cover: true, t: 'What a syscall costs —<br>and how to pay less often', sub: 'Round trip measured, the vDSO, writev, buffered streams, sendfile, copy_file_range' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The price of one kernel round trip, <b>measured</b> nine ways</li>
<li>Why reading the clock is <b>10× cheaper</b>: the vDSO</li>
<li>Batching: <b>100,000 writes</b> vs 1,563 vs 783</li>
<li>Copying a file <b>without</b> copying it through your program</li>
</ul>` },

  { t: 'One round trip ≈ 180 ns; a clock read ≈ 18 ns', body: costSvg() },

  { t: 'The cost is the boundary, not libc', giua: true, body: `
${tiny(g('gcc -O2 -Wall cost.c'), 15)}
${box('', 'libc wrapper, generic syscall() and our own svc cost the same ~175 ns: almost all of it is entering and leaving the kernel. Doing real work (write to /dev/null) adds only ~20 ns.', 'lam')}` },

  { t: 'strace proves it: vDSO calls never arrive', giua: true, body: `
${tiny(g('strace -c -o cost.sc'), 15)}
${box('', '10,000 loops × three getppid variants = <b>30,000</b>. Three clock functions ran 10,000 times each — only the <b>forced syscall()</b> one reached the kernel.', 'xanh')}` },

  { t: 'The vDSO: a tiny library the kernel maps into you', giua: true, body: `
${tiny(g('gcc -O2 vdso.c') + '\n' + g('cat /sys/devices/system/clocksource'), 15)}
${cards([
    ['8 KiB of kernel code', 'Read-only, in every process, exported as __kernel_* functions.'],
    ['reads a shared clock page', 'The kernel updates the time; your process reads it without a trap.'],
    ['needs a readable clock', 'arch_sys_counter here, tsc on x86. Some VM clocksources cannot be read from user space.'],
  ])}` },

  { t: 'Node, Python, Java clocks: 0 syscalls', giua: true, body: `
${tiny(g("strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt node") + '\n' + g("strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt python3") + '\n' + g('javac Clock.java'), 13.5)}
${box('', 'Date.now(), performance.now(), time.time(), System.nanoTime() — two million reads each, zero kernel entries. Timestamps in logs and metrics are almost free.', 'xanh')}` },

  { t: 'Pitfall: when the clock is not readable, vDSO falls back', giua: true, to: true, body: vsd(
    'On some cloud VMs the clocksource (e.g. <b>xen</b>, <b>hpet</b>) cannot be read from user space: every clock_gettime becomes a <b>real syscall</b>, 10× slower — and a service that timestamps every request pays it millions of times.',
    'Check <code class="i">current_clocksource</code> and <code class="i">available_clocksource</code>; measure with strace -c as here. tsc / kvm-clock / arch_sys_counter keep the vDSO fast.') },

  { t: '100,000 log lines, four ways', body: batchSvg() + box('', 'One write() per line: <b>31.7 ms</b>. Batched — writev of 64 lines, stdio’s 4 KiB buffer, or one big write — about <b>1.6–2.2 ms</b>: 15–20× faster for the same bytes.', 'xanh') },

  { t: 'Counted: 100,001 vs 1,563 vs 783 vs 2', giua: true, body: `
${tiny(g('for m in line writev stdio big; do strace'), 15)}
${box('', 'The extra <b>1 write</b> in each line is the program printing its result. stdio’s 783 = 3.2 MB ÷ 4,096 bytes per flush.', 'lam')}` },

  { t: 'Java: FileOutputStream vs BufferedOutputStream', giua: true, body: `
${tiny(g('javac Ghi.java') + '\n' + g('strace -f -qq -c -e trace=write -o g.sc java Ghi raw', 2), 14)}
${cards([
    ['raw stream', 'Every out.write() is a write() syscall: 100,000 of them.'],
    ['buffered (8 KiB)', 'Same bytes in under 400 syscalls — 5.8× faster here.'],
    ['in real code', 'Wrap streams in Buffered*; loggers and PrintWriter buffer for you — and flush on close.'],
  ])}` },

  { t: 'Copying 256 MiB: let the kernel do it', giua: true, body: copySvg() + box('', 'read/write copies every byte into your buffer and back. <b>sendfile</b> and <b>copy_file_range</b> move it inside the kernel in one call (the file was in the page cache; Ch9).', 'lam') },

  { t: 'Your runtime already uses copy_file_range', giua: true, body: `
${tiny(g("strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o n.sc node") + '\n' + g("strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o p.sc python3") + '\n' + g('javac Chep.java'), 12.5)}
${box('', 'fs.copyFileSync, shutil.copyfile and Files.copy all asked the kernel to copy. nginx uses <b>sendfile</b> for static files the same way — Chapter 10.', 'xanh')}` },

  { t: 'A budget you can do in your head', giua: true, to: true, body: tbl(['', 'cost here', '1 million per second costs'], [
    ['function call', '~2 ns', '0.2% of one core'],
    ['vDSO clock read', '~18 ns', '1.8% of one core'],
    ['syscall round trip', '~180–200 ns', '<b>18–20% of one core</b>'],
    ['context switch (lesson 3.3)', '~1 µs (same core)', '<b>a whole core</b>'],
  ]) + box('Example', 'Node at 10,000 req/s × 3 syscalls = 30,000/s × 0.18 µs ≈ <b>0.5% of a core</b>. The JDK server’s 15 per request ≈ 2.7%. Syscalls hurt when you make one per <b>byte</b> or per <b>line</b>, not one per request.', 'lam') },

  { t: 'Pitfall: buffering makes it fast — not safe', giua: true, to: true, body: vsd(
    'Batching 1,000 writes into one is fast, but the data sits in <b>your</b> buffer first, then in the page cache. A crash loses the first; a power cut can lose the second.',
    'Flush where it matters (end of a request, before acknowledging), and <b>fsync</b> what must survive power loss — lesson 9.3. Fast and durable are two different decisions.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A syscall ≈ <b>180 ns</b> here: ~85× a call, ~10× a vDSO clock read</li>
<li>Clocks are <b>vDSO</b>: no kernel entry — unless the clocksource forbids it</li>
<li><b>Batch</b>: writev, stdio/Buffered streams, one big write — 15–20× faster</li>
<li><b>sendfile / copy_file_range</b>: copy without touching user space</li>
<li>Fast ≠ durable: flush and fsync are separate choices</li>
</ul>` },
]);
