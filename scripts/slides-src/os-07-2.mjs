/**
 * os-07-2 — khoá "Operating Systems for Developers", bài 7.2 "Paging, page tables and the TLB" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c72-trang.out.txt (chạy thật trong ảnh os-lab) qua grab();
 * sơ đồ tách địa chỉ dùng đúng dòng "code main()" của ./xlate, biểu đồ TLB lấy số từ output ./tlb. Giảng: giang/os-07-2.mjs.
 */
import { lamDeck, sh, two as two0, box, cards, vsd, flow } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-07-2', code: 'OS 7.2', title: 'Paging, page tables and the TLB', sub: 'Operating Systems · Chapter 7' };

const g = (pre, n = 1) => grab('c72-trang', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const A = (x1, y1, x2, y2, m = '#b85a2b') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${m}" stroke-width="2.5" marker-end="url(#ar)"/>`;
const DEFS = `<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4ea3';

/* dòng "code main()" thật của ./xlate */
const mainRow = () => {
  const l = g('./xlate').split('\n').find((x) => x.startsWith('code'));
  const f = l.trim().split(/\s+/); // code main() VA L0 L1 L2 L3 off yes PFN PA
  return { va: f[2], i: f.slice(3, 7), off: f[7], pfn: f[9], pa: f[10] };
};

/* Slide 4: tách địa chỉ + duyệt 4 cấp */
const walkSvg = () => {
  const r = mainRow();
  let s = `<svg viewBox="0 0 1110 430" width="1110" height="430" font-family="Arial">${DEFS}`;
  s += T(555, 26, `virtual address ${r.va}  (main)`, 22, { a: 'middle', w: 800, m: 1, f: '#333' });
  const parts = [['L0', '9 bits', r.i[0], BL], ['L1', '9 bits', r.i[1], BL], ['L2', '9 bits', r.i[2], BL], ['L3', '9 bits', r.i[3], BL], ['offset', '12 bits', r.off, OR]];
  const pw = 190, gap = 12, x0 = (1110 - (5 * pw + 4 * gap)) / 2;
  parts.forEach(([n, b, v, m], k) => {
    const x = x0 + k * (pw + gap);
    s += R(x, 44, pw, 74, m + '22', m);
    s += T(x + pw / 2, 72, `${n} · ${b}`, 17, { a: 'middle', f: '#555' });
    s += T(x + pw / 2, 104, v, 26, { a: 'middle', w: 800, m: 1, f: m });
  });
  // bảng 4 cấp
  const tw = 170, ty = 200, th = 120;
  for (let k = 0; k < 4; k++) {
    const x = x0 + k * (pw + gap) + (pw - tw) / 2;
    s += R(x, ty, tw, th, '#f7f9fc', BL, { sw: 2 });
    s += T(x + tw / 2, ty + 26, `table L${k}`, 17, { a: 'middle', w: 700, f: BL });
    s += T(x + tw / 2, ty + 50, '512 entries', 15, { a: 'middle', f: '#666' });
    s += R(x + 14, ty + 66, tw - 28, 32, BL + '33', BL, { rx: 5, sw: 1.5 });
    s += T(x + tw / 2, ty + 88, `[${r.i[k]}]`, 18, { a: 'middle', w: 800, m: 1, f: BL });
    s += A(x + tw / 2, 120, x + tw / 2, ty - 4);
    if (k < 3) s += A(x + tw - 14, ty + 82, x + tw + (pw + gap - tw) + 14, ty + 82);
  }
  const fx = x0 + 4 * (pw + gap) + (pw - tw) / 2;
  s += R(fx, ty, tw, th, GR + '22', GR, { sw: 2.5 });
  s += T(fx + tw / 2, ty + 30, 'frame (PFN)', 17, { a: 'middle', w: 700, f: GR });
  s += T(fx + tw / 2, ty + 68, r.pfn, 22, { a: 'middle', w: 800, m: 1, f: GR });
  s += A(x0 + 3 * (pw + gap) + (pw + tw) / 2 - 14, ty + 82, fx - 4, ty + 82);
  s += T(555, 372, `physical address = ${r.pfn} × 4096 + ${r.off} = ${r.pa}`, 24, { a: 'middle', w: 800, m: 1, f: GR });
  s += T(555, 408, 'CR3 (x86-64) / TTBR0 (arm64) points at table L0 of the running process', 17, { a: 'middle', f: '#666' });
  return s + '</svg>';
};

/* Slide 11: ns mỗi lần truy cập — số từ ./tlb */
const tlbChart = () => {
  const rows = g('for m in 1 8 64 1024').split('\n').slice(1).map((l) => {
    const m = l.trim().match(/^(\d+) MiB\s+(\d+) pages\s+(\w+)\s+([\d.]+) ns/); return m && { mib: m[1], mode: m[3], ns: +m[4] };
  }).filter(Boolean);
  if (rows.length !== 8) throw new Error('os-07-2: cần 8 dòng tlb');
  const max = Math.max(...rows.map((r) => r.ns)), H = 300, base = 340, gw = 250, bw = 80;
  let s = `<svg viewBox="0 0 1110 410" width="1110" height="410" font-family="Arial">`;
  s += `<line x1="70" y1="${base}" x2="1080" y2="${base}" stroke="#999" stroke-width="2"/>`;
  [0, 1, 2, 3].forEach((k) => {
    const gx = 90 + k * gw, pair = rows.filter((r) => r.mib === rows[k * 2].mib);
    pair.forEach((r, j) => {
      const h = Math.max(4, (r.ns / max) * H), x = gx + j * (bw + 14), m = r.mode === 'huge' ? GR : RD;
      s += `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="5" fill="${m}55" stroke="${m}" stroke-width="2"/>`;
      s += T(x + bw / 2, base - h - 10, `${r.ns}`, 20, { a: 'middle', w: 800, f: m });
    });
    s += T(gx + bw + 7, base + 30, `${pair[0].mib} MiB`, 22, { a: 'middle', w: 700 });
  });
  s += R(90, 20, 26, 20, RD + '55', RD, { rx: 4 }) + T(126, 37, '4 KiB pages', 19, { f: RD, w: 700 });
  s += R(90, 52, 26, 20, GR + '55', GR, { rx: 4 }) + T(126, 69, '2 MiB pages', 19, { f: GR, w: 700 });
  s += T(70, 398, 'ns per access, one cache line per page, random page order — bars from the real run', 17, { f: '#777' });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 7 — Memory', bai: '7.2',
}, [
  { cover: true, t: 'Paging, page tables<br>and the TLB', sub: 'Every access is translated —<br>so why isn’t memory twice as slow?' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Split a real address into <b>4 table indexes + an offset</b></li>
<li>Translate it by hand and check against the kernel’s <b>pagemap</b></li>
<li>Measure what page tables cost: <b>~2 MB per GiB</b></li>
<li>Measure the <b>TLB</b>: same loop, 2.5× faster with bigger pages</li>
<li>Know when <b>huge pages</b> help — and when they hurt</li>
</ul>` },

  { t: 'Pages of 4 KiB, page tables of 4 levels', giua: true, body: `
${sh(g('getconf PAGESIZE'))}
${sh(g('zcat /proc/config.gz'))}
${cards([
    ['page / frame', 'A 4 KiB block of virtual addresses / of RAM. The page table maps page → frame.'],
    ['offset', '4096 = 2<sup>12</sup>: the low 12 bits pass through translation unchanged.'],
    ['48-bit, 4 levels', '36 bits of page number = 4 × 9 bits. Same shape as x86-64.'],
  ])}` },

  { t: 'A virtual address is five numbers', body: walkSvg() },

  { t: 'Translating by hand, checked by the kernel', giua: true, body: `
${sh(g('./xlate'))}
<p style="margin:0;font-size:21px">The offset is identical on both sides. <b>page 2</b> was never touched: its address is valid, but there is <b>no frame</b> behind it yet (lesson 7.3).</p>` },

  { t: 'Physical frame numbers are hidden from users', giua: true, body: `
${sh(g('setpriv'))}
${box('Why', 'Since 2015 (Linux 4.0–4.2) only CAP_SYS_ADMIN sees real PFNs: knowing where your pages sit in RAM helped <b>Rowhammer</b> attacks aim at specific rows. The present bit still works for everyone. The lab ran this with <code class="i">--cap-add SYS_ADMIN</code>.', 'lam')}` },

  { t: 'Why a tree instead of one big table', to: true, giua: true, body: cards([
    ['One flat table', '2<sup>36</sup> entries × 8 bytes = <b>512 GiB</b> per process. Impossible.'],
    ['A 4-level tree', 'Each table = 512 entries × 8 B = exactly one 4 KiB page. Unused ranges have no tables at all.'],
    ['Cost follows use', 'An idle process needs a few table pages; you pay for what you touch.'],
  ]) },

  { t: 'Page tables cost about 2 MB per GiB touched', giua: true, body: `
${term(g('for m in 64 256 1024; do ./touch $m nohuge'))}
${box('The arithmetic', '1 GiB / 4 KiB = 262,144 entries × 8 B = <b>2 MiB</b> — measured 2,096 kB. 300 PostgreSQL backends mapping the same 32 GB <code class="i">shared_buffers</code> each build their own tables for it.', 'lam')}` },

  { t: 'The TLB caches recent translations', giua: true, body: `
${flow([
    { t: 'CPU: load', s: 'virtual address' },
    { t: 'TLB', s: 'hit ⇒ frame at once', mau: '#2f7d4f' },
    { t: 'miss: walk', s: '4 dependent reads', mau: '#c0392b' },
    { t: 'RAM / cache', s: 'the real data' },
  ], { fs: 22, h: 170 })}
${cards([
    ['Size', 'Tens of entries (L1) to a few thousand (L2) per core.'],
    ['TLB reach', 'entries × page size. ~2,000 × 4 KiB ≈ 8 MiB.'],
    ['Context switch', 'A new process = new page tables; old translations are useless (Chapter 3).'],
  ])}` },

  { t: 'Same loop — only the page size changes', giua: true, body: `
${sh(g('for m in 1 8 64 1024'))}
<p style="margin:0;font-size:22px">One cache line per 4 KiB page, random page order, each load depends on the previous one (pointer chasing). Pages are faulted in <b>before</b> timing, so the loop has no page faults — only translations.</p>` },

  { t: 'Past the TLB reach, every page costs a walk', body: `
${tlbChart()}
<p style="margin:0;font-size:20px">64 MiB: <b>47.3 → 19.3 ns</b> (32 huge-page entries cover it). 1 GiB: data misses the caches too; huge pages still save ~40 ns. Runs vary ±20%.</p>` },

  { t: 'perf in a VM: software counts, hardware does not', giua: true, body: `
${term(g('perf stat -e page-faults,dTLB-loads'))}
${term(g('perf stat -e cycles'))}
${cards([
    ['Software event', 'Counted by the kernel: page-faults, cpu-clock. Works everywhere.'],
    ['Hardware event', 'PMU registers in the CPU: cycles, dTLB misses, page walks. This VM does not pass them through.'],
    ['&lt;not supported&gt;', 'Means <b>unmeasured</b>, never zero. On a server with a PMU: <code class="i">perf stat -e dTLB-load-misses</code>.'],
  ])}` },

  { t: 'Transparent Huge Pages on this machine', giua: true, body: `
${sh(g('cat /sys/kernel/mm/transparent_hugepage/enabled'))}
${sh(g('cat /sys/kernel/mm/transparent_hugepage/defrag'))}
${sh(g("grep -E 'AnonHugePages"))}
<p style="margin:0;font-size:21px">[brackets] = active choice. <b>always</b>: the kernel uses 2 MiB pages for anonymous memory when it can (many distros: <b>madvise</b>, only regions that ask).</p>` },

  { t: 'One fault brings in 2 MiB instead of 4 KiB', giua: true, body: `
${term(g('for h in nohuge huge'))}
${cards([
    ['Faults', '65,538 → <b>130</b>: 500× fewer.'],
    ['Time', '61.5 → <b>5.1 ms</b> to touch 256 MiB.'],
    ['HugeTLB', 'Explicit reserved pages (<code class="i">vm.nr_hugepages</code>) — what PostgreSQL’s <code class="i">huge_pages</code> uses.'],
  ])}` },

  { t: 'Huge pages are not free', giua: true, body: vsd(
    `<ul style="font-size:24px"><li>Touch 1 byte ⇒ up to 2 MiB resident (RSS bloat — see glibc arenas in 7.4)</li><li>Assembling a 2 MiB block can stall a process (compaction)</li><li>Turning THP on “because a blog said so”</li></ul>`,
    `<ul style="font-size:24px"><li>Big, hot, randomly accessed memory: indexes, caches, JVM heaps</li><li>Redis turns THP off for itself; PostgreSQL uses HugeTLB</li><li>Measure your workload, like the table above</li></ul>`,
    '✗ Costs', '✓ Use when') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>48-bit address = 4 × 9-bit indexes + 12-bit offset</li>
<li><code class="i">pagemap</code> shows the real frame (PFN needs CAP_SYS_ADMIN)</li>
<li>A tree of tables: ~2 MB per GiB of touched 4 KiB pages</li>
<li>TLB reach decides: 47.3 vs 19.3 ns at 64 MiB</li>
<li>Huge pages: 500× fewer faults — measure before you switch</li>
</ul>` },
]);
