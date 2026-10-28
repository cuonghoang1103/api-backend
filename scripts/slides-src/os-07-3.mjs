/**
 * os-07-3 — khoá "Operating Systems for Developers", bài 7.3 "Page faults, demand paging, copy-on-write" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c73-fault.out.txt và lab/out/c73-redis.out.txt (chạy thật) qua grab();
 * sơ đồ COW dùng đúng số khung của ./cowpfn, biểu đồ COW lấy số từ ./cow. Giảng: giang/os-07-3.mjs.
 */
import { lamDeck, sh, two as two0, box, cards, vsd, flow } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-07-3', code: 'OS 7.3', title: 'Page faults, demand paging, copy-on-write', sub: 'Operating Systems · Chapter 7' };

const g = (pre, n = 1) => grab('c73-fault', pre, n);
const gr = (pre, n = 1) => grab('c73-redis', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const tiny = (t) => sh(t, { sm: true }).replace('<pre>', '<pre style="font-size:12.4px;line-height:1.36">');
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const A = (x1, y1, x2, y2, m = '#b85a2b', d = false) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${m}" stroke-width="2.5"${d ? ' stroke-dasharray="7 5"' : ''} marker-end="url(#ar${m.slice(1)})"/>`;
const mk = (m) => `<marker id="ar${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', BR = '#b85a2b', GY = '#8a8a8a';
const DEFS = `<defs>${[BR, BL, GR, RD, GY, OR].map(mk).join('')}</defs>`;

/* Slide 6: trang số 0 — dùng số thật của ./demand */
const zeroSvg = () => {
  const L = g('./demand').split('\n').slice(1).map((l) => l.match(/RSS\s+(\d+) kB.*?present\s+(\d+).*?so far\s+(\d+)/));
  const [a, b, c] = L.map((m) => ({ rss: +m[1], pres: +m[2], f: +m[3] }));
  let s = `<svg viewBox="0 0 1110 360" width="1110" height="360" font-family="Arial">${DEFS}`;
  const panel = (x, title, sub, m) => R(x, 8, 520, 344, m + '0d', m, { sw: 2 }) + T(x + 260, 40, title, 22, { a: 'middle', w: 800, f: m }) + T(x + 260, 66, sub, 16, { a: 'middle', f: '#555' });
  s += panel(10, 'after reading every page', `faults +${b.f - a.f} · RSS +${b.rss - a.rss} kB`, BL);
  s += panel(580, 'after writing every page', `faults +${c.f - b.f} · RSS +${Math.round((c.rss - b.rss) / 1024)} MiB`, GR);
  for (let i = 0; i < 6; i++) {
    const y = 92 + i * 40;
    s += R(40, y, 150, 30, '#ffffff', BL, { rx: 5, sw: 1.5 }) + T(115, y + 21, i < 5 ? `virtual page ${i}` : '… 16,384', 15, { a: 'middle', m: 1, f: BL });
    s += A(192, y + 15, 352, 214, BL);
    s += R(610, y, 150, 30, '#ffffff', GR, { rx: 5, sw: 1.5 }) + T(685, y + 21, i < 5 ? `virtual page ${i}` : '… 16,384', 15, { a: 'middle', m: 1, f: GR });
    s += A(762, y + 15, 892, y + 15, GR);
    s += R(896, y, 150, 30, GR + '33', GR, { rx: 5, sw: 1.5 }) + T(971, y + 21, i < 5 ? `own frame ${i}` : '… 16,384', 15, { a: 'middle', m: 1, f: GR });
  }
  s += R(356, 172, 150, 84, '#eef2f7', BL, { sw: 2.5 }) + T(431, 206, 'ONE zero page', 17, { a: 'middle', w: 800, f: BL }) + T(431, 232, 'read-only, shared', 15, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* Slide 11: copy-on-write — số khung thật của ./cowpfn */
const cowSvg = () => {
  const L = g('./cowpfn').split('\n').slice(1);
  const fr = (k) => L.find((l) => l.startsWith(k)).match(/frame (0x[0-9a-f]+)/)[1];
  const f0 = fr('parent  before'), f1 = fr('child   after its');
  let s = `<svg viewBox="0 0 1110 390" width="1110" height="390" font-family="Arial">${DEFS}`;
  const box2 = (x, y, w, h, t, sub, m) => R(x, y, w, h, m + '1a', m, { sw: 2.5 }) + T(x + w / 2, y + h / 2 - 4, t, 19, { a: 'middle', w: 800, f: m }) + T(x + w / 2, y + h / 2 + 20, sub, 15, { a: 'middle', f: '#555' });
  // trái: ngay sau fork
  s += T(270, 26, '1 · right after fork()', 20, { a: 'middle', w: 800, f: '#333' });
  s += box2(20, 52, 220, 70, 'parent page table', 'entry: read-only', BL);
  s += box2(300, 52, 220, 70, 'child page table', 'entry: read-only', OR);
  s += box2(160, 230, 220, 90, `frame ${f0}`, "holds 'P'", GR);
  s += A(130, 124, 240, 226, BL) + A(410, 124, 300, 226, OR);
  // phải: sau khi con ghi
  s += T(830, 26, "2 · child writes 'C' → 1 page fault", 20, { a: 'middle', w: 800, f: '#333' });
  s += box2(580, 52, 220, 70, 'parent page table', 'read-only, frame now its own', BL);
  s += box2(860, 52, 220, 70, 'child page table', 'entry: writable', OR);
  s += box2(580, 230, 220, 90, `frame ${f0}`, "still 'P'", GR);
  s += box2(860, 230, 220, 90, `frame ${f1}`, "new copy: 'C'", RD);
  s += A(690, 124, 690, 226, BL) + A(970, 124, 970, 226, OR);
  s += `<line x1="555" y1="20" x2="555" y2="360" stroke="#ddd" stroke-width="2"/>`;
  s += T(830, 350, 'the kernel copied exactly one 4 KiB page;', 16, { a: 'middle', f: '#555' }) + T(830, 372, 'a later parent write needs no copy, only the permission bit', 16, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* Slide 13: MiB bị chép theo % trang bị ghi — từ ./cow */
const cowChart = () => {
  const rows = g('for w in 0 1 10 50 100').split('\n').slice(1).map((l) => {
    const m = l.match(/fork\s+([\d.]+) ms \| wrote\s+(\d+)% .*Private\s+(\d+) MiB/); return m && { fork: +m[1], pct: +m[2], priv: +m[3] };
  }).filter(Boolean);
  if (rows.length !== 5) throw new Error('os-07-3: cần 5 dòng cow');
  const X = 230, W = 660;
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  rows.forEach((r, i) => {
    const y = 10 + i * 60, w = Math.max(3, (r.priv / 512) * W);
    s += T(X - 16, y + 36, `${r.pct}% written`, 21, { a: 'end', w: 700 });
    s += R(X, y + 10, w, 38, RD + '44', RD, { rx: 5 });
    s += T(X + w + 12, y + 37, `${r.priv} MiB copied`, 20, { w: 800, f: RD });
  });
  s += T(X, 322, 'parent’s Private memory during the “save” of a 512 MiB dataset — bars from the real run', 16, { f: '#777' });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 7 — Memory', bai: '7.3',
}, [
  { cover: true, t: 'Page faults, demand paging<br>and copy-on-write', sub: 'What Redis BGSAVE does to your RAM' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Count page faults with <code class="i">/usr/bin/time -v</code> and <code class="i">perf stat</code></li>
<li>Watch <b>demand paging</b> and the shared <b>zero page</b></li>
<li>Measure a <b>major fault</b>: ~52 µs vs ~0.2 µs warm</li>
<li>Choose between <b>mmap</b> and <b>read</b></li>
<li>See <b>copy-on-write</b> by frame number — then in a real Redis save</li>
<li>Page replacement: FIFO, LRU, Clock, OPT</li>
</ul>` },

  { t: 'A page fault is a trap the kernel may fix', giua: true, body: `
${flow([
    { t: 'load / store', s: 'virtual address' },
    { t: 'no valid entry', s: 'or wrong permission', mau: '#c0392b' },
    { t: 'trap → kernel', s: 'is the address valid?', mau: '#e08a1e' },
    { t: 'fix + retry', s: 'or SIGSEGV', mau: '#2f7d4f' },
  ], { fs: 22, h: 170 })}
${cards([
    ['Minor fault', 'No disk I/O: a zero page, or a page already in RAM / page cache. About a microsecond or less.'],
    ['Major fault', 'The kernel must read from disk (file or swap) first. Costs what the disk costs.'],
    ['Invalid', 'No mapping or a forbidden access ⇒ SIGSEGV, exit 139.'],
  ])}` },

  { t: 'Counting faults: one per touched page', giua: true, body: `
${sh(g('/usr/bin/time -v ./touch'))}
${sh(g('perf stat -e page-faults,minor-faults'))}` },

  { t: 'Demand paging: nothing is real until touched', giua: true, body: `
${sh(g('./demand'))}
${cards([
    ['mmap', '0 of 16,384 pages present: only a promise.'],
    ['read every page', 'All present, ~16,400 faults — RSS +324 kB only.'],
    ['write every page', 'Another 16,386 faults — now RSS +64 MiB.'],
  ])}` },

  { t: 'Unwritten memory reads from one zero page', body: zeroSvg() },

  { t: 'A major fault costs ~52 µs', giua: true, body: `
${sh(g('/usr/bin/time -v ./filemap rand'))}
${sh(g('./filemap rand'))}
${box('Same code, same data', 'Cold (pages on disk, read-ahead off): <b>65,536 major faults, 3.4 s</b>. Warm (pages in the page cache): <b>0 major, 11.6 ms</b> — ~300× faster. Random access = a database index lookup.', 'do2')}` },

  { t: 'Sequential reads hide it: read-ahead', giua: true, body: `
${sh(g('./filemap evict /tmp/data; ./filemap mmap'))}
${cards([
    ['1 major fault', 'The first fault sees a sequential pattern and starts read-ahead; later faults find pages arriving.'],
    ['3,941 minor', '≈ 65,536 / 16: on each fault the kernel maps 16 neighbouring cached pages (fault-around).'],
    ['Random defeats it', 'Working set > RAM + random access ⇒ every miss is a disk read (page cache: Chapter 8).'],
  ])}` },

  { t: 'mmap or read?', giua: true, body: `
${sh(g('./filemap evict /tmp/data; ./filemap read'))}
${two(`${cards([
    ['read()', 'Copies page cache → your buffer. No faults on the file, one syscall per chunk. Errors are return codes.'],
  ], 1)}`, `${cards([
    ['mmap()', 'Maps the page cache itself. No copy, no syscalls; faults + TLB entries instead. I/O error ⇒ <b>SIGBUS</b>.'],
  ], 1)}`)}
<p style="margin:0;font-size:20px">Warm: mmap 19.4 ms vs read 23.4 ms. Cold: both ~34 ms (same disk). SQLite/LMDB/Lucene map files; PostgreSQL uses read/write into its own buffers.</p>` },

  { t: 'Copy-on-write, watched by frame number', giua: true, body: `
${sh(g('./cowpfn'))}
<p style="margin:0;font-size:21px">After <code class="i">fork</code> both processes map the <b>same frame</b>. The child’s first write costs exactly <b>1 page fault</b> and gets a new frame; the parent never notices.</p>` },

  { t: 'Shared until someone writes', body: cowSvg() },

  { t: 'The BGSAVE pattern: fork, then keep writing', giua: true, body: `
${tiny(g('for w in 0 1 10 50 100'))}
${tiny(g('./cow 512 10 huge'))}
<p style="margin:0;font-size:20px">fork copies page tables, not data (~4 ms; 0.3 ms with huge pages). Each first write to a shared page = 1 fault = one 4 KiB copy. Since Linux 5.8 a write into a shared huge page copies only 4 KiB.</p>` },

  { t: 'COW cost follows pages written, not bytes', body: cowChart() },

  { t: 'A real Redis: fill it, BGSAVE, keep writing', giua: true, body: `
${tiny(gr('redis-benchmark -q -t set -n 600000', 3))}
${tiny(gr('redis-cli BGSAVE', 2))}
<p style="margin:0;font-size:21px">Redis 7.4 in a throw-away container: ~260 k keys of 1 KiB (336 MB), a background save, and <b>30,000 SETs</b> (~30 MB of new data) while the child is still writing the snapshot.</p>` },

  { t: 'Redis reports 124 MB of copied pages', giua: true, body: `
${tiny(gr('redis-cli INFO persistence', 3))}
${box('Headroom rule', 'fork took 2,967 µs. 30 MB of writes ⇒ <b>124 MB</b> of copies: each SET touches several scattered pages. Peak ≈ dataset + dataset × fraction of pages rewritten during the save. No headroom ⇒ swap or the OOM killer (Chapter 8).', 'do2')}` },

  { t: 'When RAM is full: who gets evicted?', giua: true, body: `
${sh(g('python3 repl.py 3 7'))}
${sh(g('for n in 3 4'))}
${sh(g('for n in 4 5'))}
<p style="margin:0;font-size:20px">Classic exam string, 3 frames: <b>FIFO 15 · LRU 12 · OPT 9</b>. Clock approximates LRU with one reference bit (here 14). Linux uses an LRU approximation (active/inactive lists, MGLRU).</p>` },

  { t: 'Two surprises: Bélády and the working-set cliff', to: true, giua: true, body: cards([
    ['Bélády’s anomaly', 'FIFO: 3 frames → 9 faults, 4 frames → <b>10</b>. More RAM, more faults. LRU and OPT never do this.'],
    ['Working-set cliff', 'Loop over 5 pages: 5 frames → 5 faults; 4 frames → <b>20 of 20</b> references fault. Thrashing in miniature.'],
    ['Next: Chapter 8', 'Swap, thrashing, PSI and the OOM killer — when it happens to the whole machine.'],
  ]) },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>One fault per first touch of a 4 KiB page; minor vs major</li>
<li>Demand paging: reads map the zero page; writes get frames</li>
<li>Major fault ≈ 52 µs here; read-ahead hides sequential reads</li>
<li>COW: fork shares frames, copies per page on write</li>
<li>Real Redis: 30,000 SETs ⇒ 124 MB of copies during BGSAVE</li>
</ul>` },
]);
