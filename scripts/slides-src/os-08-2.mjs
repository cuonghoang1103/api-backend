/**
 * os-08-2 — khoá "Operating Systems for Developers", bài 8.2 "Swap, swappiness and thrashing" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c82-swap.out.txt và c82-file.out.txt (chạy thật) qua grab();
 * biểu đồ swappiness và ns/trang lấy số từ chính các file đó. Giảng: giang/os-08-2.mjs.
 */
import { lamDeck, sh, box, cards, flow } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-08-2', code: 'OS 8.2', title: 'Swap, swappiness and thrashing', sub: 'Operating Systems · Chapter 8' };

const g = (pre, n = 1) => grab('c82-swap', pre, n);
const gf = (pre, n = 1) => grab('c82-file', pre, n);
const tiny = (t) => sh(t, { sm: true }).replace('<pre>', '<pre style="font-size:13px;line-height:1.36">');
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e';
const MiB = (b) => +b / 1048576;

/* Slide 6: anon / file / swap qua ba bước memory.reclaim — số thật */
const swappinessSvg = () => {
  const snap = (txt) => {
    const a = txt.match(/anon (\d+)/)[1], f = txt.match(/file (\d+)/)[1], s = txt.trim().split('\n').pop();
    return { a: MiB(a), f: MiB(f), s: MiB(s) };
  };
  // năm lần grep anon/file: đầu, sau 200M@0 (EAGAIN), sau 10M@200, sau khi thêm file 20 MiB, sau 10M@0
  const all = [];
  const lines = grab('c82-swap', 'swapon', 99).split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("$ grep -E '^(anon|file) '")) all.push(snap(lines.slice(i + 1, i + 4).join('\n')));
  }
  if (all.length !== 5) throw new Error('os-08-2: cần 5 ảnh chụp anon/file');
  const pickd = [all[0], all[1], all[2], all[4]];
  const lab = ['start: 40 MiB process + cache', '200M at swappiness=0 → EAGAIN', '10M at swappiness=200', '+20 MiB file, 10M at swappiness=0'];
  const X = 420, W = 620, sc = W / 84;
  let s = `<svg viewBox="0 0 1110 480" width="1110" height="480" font-family="Arial">`;
  pickd.forEach((v, i) => {
    const y = 6 + i * 112;
    s += T(X - 18, y + 32, lab[i], 20, { a: 'end', w: 700 });
    let x = X;
    const seg = (mb, col, name) => { if (mb < 0.5) return; const w = mb * sc; s += R(x, y + 6, w, 44, col + '33', col, { rx: 4 }) + (w > 100 ? T(x + w / 2, y + 35, `${name} ${mb.toFixed(1)}`, 19, { a: 'middle', w: 700, f: col }) : T(x + w + 8, y + 35, `${name} ${mb.toFixed(1)}`, 19, { w: 700, f: col })); x += w; };
    seg(v.a, BL, 'anon'); seg(v.f, GR, 'file');
    if (v.f < 0.5) s += T(x + 14, y + 35, 'file 0', 19, { w: 700, f: GR });
    s += T(X - 18, y + 70, `swap ${v.s.toFixed(1)} MiB`, 18, { a: 'end', f: v.s > 0.5 ? RD : '#888', w: 700 });
    if (v.s > 0.5) s += R(X, y + 56, v.s * sc, 22, RD + '33', RD, { rx: 4 });
  });
  s += T(X, 472, 'MiB charged to the container — bars drawn from memory.stat / memory.swap.current of the real run', 15, { f: '#777' });
  return s + '</svg>';
};

/* Slide 8: ns mỗi trang (thang log) — số thật */
const thrashSvg = () => {
  const pick = (txt) => { const m = [...txt.matchAll(/(\d+) ns\/page/g)].map((x) => +x[1]).slice(1); return Math.round(m.reduce((a, b) => a + b, 0) / m.length); };
  const rows = [
    ['anon 64 MiB (fits)', pick(g('./ws 64 3 rand')), GR],
    ['anon 160 MiB, sequential', pick(g('./ws 160 3 seq')), OR],
    ['anon 160 MiB, random', pick(g('./ws 160 3 rand')), RD],
    ['file 200 MiB, no swap', pick(gf('./ws 200 3 rand')), '#7a1f1f'],
  ];
  const X = 330, W = 650, lg = (v) => Math.log10(Math.max(v, 1)) / 7 * W;
  let s = `<svg viewBox="0 0 1110 470" width="1110" height="470" font-family="Arial">`;
  [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7].forEach((v, i) => {
    const x = X + lg(v);
    s += `<line x1="${x}" y1="8" x2="${x}" y2="410" stroke="#e3e3e3" stroke-width="1.5"/>` + T(x, 434, ['1 ns', '10', '100', '1 µs', '10 µs', '100 µs', '1 ms', '10 ms'][i], 15, { a: 'middle', f: '#888' });
  });
  rows.forEach(([n, v, col], i) => {
    const y = 14 + i * 100;
    s += T(X - 16, y + 40, n, 22, { a: 'end', w: 700 }) + R(X, y + 10, lg(v), 50, col + '44', col, { rx: 4 });
    s += T(X + lg(v) + 10, y + 43, `${v.toLocaleString('en-US')} ns`, 19, { w: 800, f: col });
  });
  s += T(X, 464, 'time to touch one page (passes 2–3, after warm-up), 128 MiB container — log scale, from the real ws runs', 15, { f: '#777' });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 8 — Memory pressure', bai: '8.2',
}, [
  { cover: true, t: 'Swap, swappiness<br>and thrashing', sub: 'When swap saves you — and when the machine crawls' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why <b>anonymous</b> memory needs swap and file pages do not</li>
<li><b>swappiness</b> as a price: watch it choose file vs anon pages</li>
<li><b>Thrashing</b> measured: ~12 ns → ~35 µs per page</li>
<li>Swap that <b>helps</b>: idle memory out, hot memory in</li>
<li>Thrashing <b>without</b> swap, and <b>PSI</b> — the pressure number</li>
<li>zram, zswap and what to run on a server</li>
</ul>` },

  { t: 'Only anonymous pages need swap', giua: true, body: `
${flow([
    { t: 'RAM is full', s: 'something must go', mau: RD },
    { t: 'clean file page', s: 'drop it — re-read later', mau: GR },
    { t: 'dirty file page', s: 'write back, then drop', mau: OR },
    { t: 'anon page', s: 'heap, stack: no file!', mau: BL },
  ], { fs: 21, h: 160 })}
${cards([
    ['File pages', 'Code, libraries, the page cache. The file on disk <b>is</b> the backup: evicting costs a re-read later.'],
    ['Anonymous pages', 'malloc, the JS heap, the JVM heap. No file behind them — without swap they can <b>never</b> leave RAM.'],
    ['Swap', 'A file or partition that gives anon pages a place to go. Not "extra RAM": a parking lot, 1000× slower.'],
  ])}` },

  { t: 'The lab: 128 MiB of RAM, 256 MiB of swap', giua: true, body: `
${sh(g('swapon --show') + '\n' + g('cat /proc/sys/vm/swappiness') + '\n' + g('cat /sys/fs/cgroup/memory.max'))}
${box('docker run --memory 128m --memory-swap 384m', '<code class="i">--memory-swap</code> is the TOTAL (RAM + swap): 384 − 128 = <b>256 MiB of swap</b> for this container, taken from the VM’s 1 GiB swap file. Every fill test runs inside this cap — never on the host.', 'lam')}` },

  { t: 'swappiness is a price, not a percentage', giua: true, body: `
${sh([g('./hold 40 &'), g("grep -E '^(anon|file) '", 1), g('echo "200M swappiness=0"'), g('echo "10M swappiness=200"'), g('dd if=/dev/zero of=/tmp/f'), g('echo "10M swappiness=0"')].join('\n'), { sm: true })}
${cards([
    ['swappiness=0', 'Reclaim <b>file pages only</b>. Asked for 200M, it dropped every file page, then failed (EAGAIN) rather than touch anon.'],
    ['60 (default)', 'Anon pages are priced higher than file pages: cache goes first, the heap last.'],
    ['200', 'Anon costs the same as file. With no cache left, the 10M came from the process: 11 MiB went to swap.'],
  ])}` },

  { t: 'swappiness decides who pays: cache or the process', body: swappinessSvg() },

  { t: 'Thrashing, measured', giua: true, body: `
${tiny(g('./ws 64 3 rand') + '\n' + g('./ws 160 3 rand') + '\n' + g("grep -E '^(pswpin"))}
<p style="margin:0;font-size:21px">64 MiB fits: every pass is 0.2 ms. 160 MiB in 128 MiB of RAM: <b>15,000–19,000 major faults per pass</b> — each one a read back from swap — and every page access costs <b>thousands of times</b> more.</p>` },

  { t: 'Past the edge, a page costs thousands of times more', body: thrashSvg() },

  { t: 'Swap that helps: idle memory out, hot memory in', giua: true, body: `
${sh(g('./hold 150 &') + '\n' + g('./ws 80 3 rand') + '\n' + g("grep -E 'VmRSS|VmSwap'"))}
${box('This is what swap is for', 'A 150 MiB process that never touches its memory again + an 80 MiB hot loop, in 128 MiB: the kernel moved <b>107 MiB of the idle one</b> to swap and the hot loop ran at full speed — 0 major faults. Without swap, the same pair is an OOM kill.', 'xanh')}` },

  { t: 'No swap ≠ no thrashing: file pages thrash too', giua: true, body: `
${tiny(gf('cat /sys/fs/cgroup/memory.swap.max') + '\n' + gf('./ws 64 3 rand') + '\n' + gf('./ws 200 3 rand') + '\n' + gf("grep -E '^(workingset"))}
${box('A minute per pass, and no OOM kill', 'Same 128 MiB, swap off, a 200 MiB <b>file</b> read at random: ~1 ms per page. The kernel re-read evicted pages <b>91 million times</b> for 153,600 touches — read-ahead pulls neighbours in, the tiny cgroup throws them out before use. Nothing is unreclaimable, so the OOM killer never fires: the box just crawls.', 'do2')}` },

  { t: 'PSI: the one number for “how bad is it”', giua: true, body: `
${sh(gf('cat /sys/fs/cgroup/memory.pressure'))}
${cards([
    ['some', 'Share of wall time in which <b>at least one</b> task was stalled waiting for memory (reclaim, refaults, swap-in).'],
    ['full', 'Share of time in which <b>all</b> non-idle tasks were stalled — nothing useful ran at all.'],
    ['avg10 / 60 / 300', 'Moving averages over 10 s, 1 min, 5 min; total = µs stalled since start. Same file: /proc/pressure/memory.'],
  ])}
<p style="margin:0;font-size:20px">File thrash above: <b>35% of every second</b> lost to memory stalls — and <code class="i">oom 0</code>. The kernel OOM killer never came.</p>` },

  { t: 'zram and zswap: compress before you swap', to: true, giua: true, body: cards([
    ['zram', 'A RAM block device that compresses what you write to it, used as swap. Default swap on Fedora (since 33), ChromeOS and Android. No disk I/O at all.'],
    ['zswap', 'A compressed cache <b>in front of</b> a real swap device: pages are compressed first, only the coldest reach disk. Per-cgroup: memory.zswap.max.'],
    ['In this lab', 'zswap is built into the VM kernel but disabled; the zram module is absent. Turning either on is a <b>global</b> change to a shared VM, so we did not — not measured here.'],
  ]) },

  { t: 'What to run on a server', to: true, giua: true, body: cards([
    ['Have a little swap', '0.5–2 GB on SSD, or zram. It soaks up memory that is allocated once and never touched again, freeing RAM for cache.'],
    ['Watch PSI, not swap used', '“Swap used: 800 MB” can be perfectly healthy. some avg10 above ~10–20% for minutes is not.'],
    ['Never size RAM by swap', 'If the hot working set does not fit in RAM, swap only converts the crash into a crawl.'],
  ]) },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>File pages can always be dropped; anon pages need swap to leave RAM</li>
<li>swappiness = relative price of reclaiming anon vs file (0–200)</li>
<li>Working set > RAM ⇒ ~15,000–19,000 swap-ins per pass, thousands of times slower</li>
<li>Swap helps when it holds <b>idle</b> memory; it cannot fix a hot set that does not fit</li>
<li>Without swap, file pages thrash instead; PSI measures the damage</li>
</ul>` },
]);
