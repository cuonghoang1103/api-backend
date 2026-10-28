/**
 * os-07-4 — khoá "Operating Systems for Developers", bài 7.4 "Allocators and garbage collectors" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c74-cap-phat.out.txt (chạy thật trong ảnh os-lab) qua grab();
 * biểu đồ phân mảnh và heapUsed lấy số từ chính output đó. Giảng: giang/os-07-4.mjs.
 */
import { lamDeck, sh, two as two0, box, cards, vsd, flow } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-07-4', code: 'OS 7.4', title: 'Allocators and garbage collectors', sub: 'Operating Systems · Chapter 7' };

const g = (pre, n = 1) => grab('c74-cap-phat', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const tiny = (t) => sh(t, { sm: true }).replace('<pre>', '<pre style="font-size:12.6px;line-height:1.36">');
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', GY = '#9a9a9a';

/* Slide 9: dữ liệu sống vs RSS qua 6 bước — số từ ./frag */
const fragChart = () => {
  const rows = g('./frag').split('\n').slice(2).map((l) => {
    const m = l.match(/^(\d)\.\s.*?live data\s+([\d.]+) MB\s+RSS\s+([\d.]+) MB/); return m && { k: m[1], live: +m[2], rss: +m[3] };
  }).filter(Boolean);
  if (rows.length !== 6) throw new Error('os-07-4: cần 6 bước frag');
  const lab = ['malloc 1M × 100 B', 'free every other', 'malloc_trim(0)', '+500k × 200 B', 'free all but last', 'malloc_trim(0)'];
  const max = 230, H = 270, base = 320, gw = 172, bw = 62;
  let s = `<svg viewBox="0 0 1110 400" width="1110" height="400" font-family="Arial">`;
  s += `<line x1="40" y1="${base}" x2="1090" y2="${base}" stroke="#999" stroke-width="2"/>`;
  rows.forEach((r, i) => {
    const gx = 60 + i * gw;
    [[r.live, GR], [r.rss, RD]].forEach(([v, m], j) => {
      const h = Math.max(3, (v / max) * H), x = gx + j * (bw + 8);
      s += `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="4" fill="${m}55" stroke="${m}" stroke-width="2"/>`;
      s += T(x + bw / 2, base - h - 8, v.toFixed(v < 10 ? 1 : 0), 17, { a: 'middle', w: 800, f: m });
    });
    s += T(gx + bw + 4, base + 26, `${r.k}`, 20, { a: 'middle', w: 800 });
    s += T(gx + bw + 4, base + 50, lab[i], 15, { a: 'middle', f: '#555' });
  });
  s += R(760, 14, 24, 18, GR + '55', GR, { rx: 4 }) + T(792, 30, 'live data (MB)', 18, { f: GR, w: 700 });
  s += R(760, 42, 24, 18, RD + '55', RD, { rx: 4 }) + T(792, 58, 'RSS (MB)', 18, { f: RD, w: 700 });
  s += T(40, 394, 'bars from the real run of frag.c', 15, { f: '#777' });
  return s + '</svg>';
};

/* Slide 17: heapUsed sau GC — bug vs fixed — số từ leak.js */
const leakChart = () => {
  const pts = (mode) => g(`node --expose-gc leak.js ${mode}`).split('\n').slice(1).map((l) => {
    const m = l.match(/after\s+(\d+) requests: heapUsed\s+([\d.]+) MB/); return m && { req: +m[1], mb: +m[2] };
  }).filter(Boolean);
  const bug = pts('bug'), fix = pts('fixed');
  const X0 = 120, Y0 = 300, W = 900, H = 250, mx = 200000, my = 50;
  const px = (r) => X0 + (r / mx) * W, py = (v) => Y0 - (v / my) * H;
  let s = `<svg viewBox="0 0 1110 360" width="1110" height="360" font-family="Arial">`;
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#999" stroke-width="2"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H - 10}" stroke="#999" stroke-width="2"/>`;
  [0, 25, 50].forEach((v) => { s += T(X0 - 10, py(v) + 6, `${v} MB`, 16, { a: 'end', f: '#666' }); });
  [50000, 100000, 150000, 200000].forEach((r) => { s += T(px(r), Y0 + 26, `${r / 1000}k`, 16, { a: 'middle', f: '#666' }); });
  s += T(X0 + W / 2, Y0 + 52, 'requests served (heapUsed measured right after a forced GC)', 16, { a: 'middle', f: '#666' });
  [[bug, RD], [fix, GR]].forEach(([p, m]) => {
    s += `<polyline fill="none" stroke="${m}" stroke-width="4" points="${p.map((q) => `${px(q.req)},${py(q.mb)}`).join(' ')}"/>`;
    p.forEach((q) => { s += `<circle cx="${px(q.req)}" cy="${py(q.mb)}" r="7" fill="${m}"/>` + T(px(q.req), py(q.mb) - 14, q.mb, 16, { a: 'middle', w: 800, f: m }); });
  });
  s += `<line x1="${X0 + 24}" y1="34" x2="${X0 + 64}" y2="34" stroke="${RD}" stroke-width="4"/>` + T(X0 + 74, 40, 'bug: cache grows forever', 19, { w: 800, f: RD });
  s += `<line x1="${X0 + 24}" y1="64" x2="${X0 + 64}" y2="64" stroke="${GR}" stroke-width="4"/>` + T(X0 + 74, 70, 'fixed: 1,000-entry LRU', 19, { w: 800, f: GR });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 7 — Memory', bai: '7.4',
}, [
  { cover: true, t: 'Allocators and<br>garbage collectors', sub: 'malloc, arenas, fragmentation, V8, JVM —<br>and finding real leaks' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>See what <code class="i">malloc</code> asks the kernel for — and when it asks nothing</li>
<li>Measure glibc <b>arenas</b>: 100 threads, 164 MB for 293 kB</li>
<li>Watch <b>fragmentation</b> keep 120 MB with nothing live</li>
<li>Hit V8’s heap limit; compare <b>G1</b> and <b>ZGC</b> pauses</li>
<li>Find leaks with <b>valgrind</b>, <b>ASan</b> and Node’s heap-after-GC</li>
</ul>` },

  { t: 'malloc is a library between you and the kernel', giua: true, body: `
${flow([
    { t: 'your code', s: 'malloc(100) / free' },
    { t: 'glibc malloc', s: 'bins, arenas, top chunk', mau: '#e08a1e' },
    { t: 'brk / mmap', s: 'only when it needs pages', mau: '#c0392b' },
    { t: 'kernel', s: 'pages (lessons 7.1–7.3)', mau: '#2f7d4f' },
  ], { fs: 22, h: 170 })}
${cards([
    ['brk', 'Moves the end of the heap. One contiguous region that can only shrink from the top.'],
    ['mmap', 'A separate region per big block; <code class="i">free</code> returns it with <code class="i">munmap</code>.'],
    ['Most calls', 'Are served from memory malloc already holds: no syscall at all.'],
  ])}` },

  { t: 'strace: which mallocs reach the kernel', giua: true, body: `
${tiny(g('strace -e trace=brk'))}
${cards([
    ['malloc(100) ×2', 'First grows the heap (to a 2 MiB boundary); second: <b>no syscall</b>.'],
    ['malloc(200 KiB)', 'Fits in the heap’s free top: no syscall.'],
    ['malloc(4 MiB)', 'Own <code class="i">mmap</code>; <code class="i">free</code> ⇒ <code class="i">munmap</code>.'],
    ['…again', 'From <code class="i">brk</code>: the mmap threshold rose to 4 MiB after that free.'],
  ], 4)}` },

  { t: 'Arenas: one heap per thread group', giua: true, body: `
${tiny(g('for n in 1 4 16 100'))}
${tiny(g('MALLOC_ARENA_MAX=2'))}
${cards([
    ['80 arenas', '8 × 10 cores. Each reserves 64 MiB of address space ⇒ 6 GB VSZ.'],
    ['164 MB RSS', 'For 293 kB of data: each arena’s first block became a 2 MiB huge page (7.2).'],
    ['MALLOC_ARENA_MAX=2', '4.3 MB. The classic fix for “JVM RSS far above -Xmx” (Netty, zip, TLS under the JVM).'],
  ])}` },

  { t: 'Fragmentation, step by step', giua: true, body: `
${tiny(g('./frag'))}
<p style="margin:0;font-size:20px">100-byte blocks occupy 112 bytes. Holes of 112 B cannot hold 200 B. The heap shrinks only from its top, and one live block at the top pins everything below it.</p>` },

  { t: 'Free memory you cannot give back', body: fragChart() },

  { t: '“RSS never comes down” is not a leak', giua: true, body: vsd(
    `<ul style="font-size:24px"><li>Fragmentation: 120.6 MB with 0 live</li><li>Arenas + THP: 164 MB for 293 kB</li><li>Freed memory kept for reuse</li></ul>`,
    `<ul style="font-size:24px"><li>Live data <b>after GC</b> grows with work done</li><li>Same objects pile up in a heap snapshot</li><li>Bounded by nothing in the code</li></ul>`,
    '✗ Looks like a leak', '✓ Is a leak') },

  { t: 'V8 has its own heap limit', giua: true, body: two(
    tiny(g('node gc.js limits')),
    `${term(g('node --max-old-space-size=64'))}${cards([
      ['Default', '2,096 MB here, chosen from the machine’s RAM.'],
      ['--max-old-space-size=64', 'Old space 64 MB; the reported 112 MB includes the young generation.'],
    ], 1)}`) },

  { t: 'Heap full: V8 aborts itself, exit 134', giua: true, body: `
${sh(g('node --max-old-space-size=64 gc.js grow'))}
${cards([
    ['exit 134', '128 + 6 = SIGABRT from V8 — not the kernel. RAM was still free.'],
    ['rss ≫ heapUsed', '138 vs 62 MB: code, young generation, Node’s C++ memory, buffers.'],
    ['In a container', 'A memory limit below V8’s idea ⇒ the kernel kills first: exit 137 (Chapter 8).'],
  ])}` },

  { t: 'A heap snapshot names the suspect', giua: true, body: `
${sh(g('node gc.js snapshot'))}
${box('Next step', 'Open the same file in Chrome DevTools → Memory. <b>Retainers</b> shows what keeps the 100,000 <code class="i">Session</code> objects alive; <b>Comparison</b> between two snapshots shows what grew. On a live server: <code class="i">node --heapsnapshot-signal=SIGUSR2</code>.', 'lam')}` },

  { t: 'JVM defaults: 25% of RAM, G1', giua: true, body: `
${tiny(g('java -XX:+PrintFlagsFinal'))}
${sh(g('java -Xmx256m -XX:+UseG1GC Gc'))}
${tiny(g('java -Xmx256m -XX:+UseG1GC -Xlog'))}
<p style="margin:0;font-size:20px">G1: 100 young collections, ~1 ms each, 97 ms of stop-the-world pauses in total.</p>` },

  { t: 'ZGC: microsecond pauses, paid in CPU', giua: true, body: `
${sh(g('java -Xmx256m -XX:+UseZGC -XX:+ZGenerational Gc'))}
${tiny(g('java -Xmx256m -XX:+UseZGC -XX:+ZGenerational -Xlog'))}
${cards([
    ['Pauses', '348 pauses, ~1 ms in total; each 5–12 µs.'],
    ['Concurrent work', '292 + 247 ms of GC work on GC threads beside your code.'],
    ['Choose', 'G1 by default; ZGC when p99 latency matters more than CPU.'],
  ])}` },

  { t: 'C leaks: valgrind and ASan point at the line', giua: true, body: `
${tiny(g('valgrind'))}
${tiny(g('./leak-asan 2'))}
<p style="margin:0;font-size:20px"><b>valgrind</b>: simulated CPU, no rebuild, 10–50× slower. <b>ASan</b>: <code class="i">-fsanitize=address</code>, ~2×, also catches overflows and use-after-free. Both name <code class="i">leak.c:7</code>.</p>` },

  { t: 'Use-after-free, stopped on the exact read', giua: true, body: `
${tiny(g('./leak-asan uaf'))}
${box('Why it matters', 'Without ASan this read silently returns stale bytes — or becomes a security hole (Chapter 13). ASan names both lines: the read (<code class="i">leak.c:20</code>) and the <code class="i">free</code> (<code class="i">leak.c:19</code>).', 'do2')}` },

  { t: 'A Node leak: heap-after-GC grows with traffic', body: `
${leakChart()}
<p style="margin:0;font-size:20px">A module-level <code class="i">Map</code> keyed per request: <b>14 → 47 MB</b>, <code class="i">cache.size</code> = requests. With a 1,000-entry bound: flat at <b>3.7 MB</b>.</p>` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li><code class="i">malloc</code> rarely calls the kernel: brk heap, mmap for big blocks</li>
<li>Arenas trade memory for less locking: <code class="i">MALLOC_ARENA_MAX</code></li>
<li>Fragmentation keeps RSS high with nothing live</li>
<li>V8 aborts at its heap limit (134); G1 ~1 ms vs ZGC ~10 µs pauses</li>
<li>Leak = heap-after-GC growing with work; prove it before fixing</li>
</ul>` },
]);
