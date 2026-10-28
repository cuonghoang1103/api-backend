/**
 * os-08-1 — khoá "Operating Systems for Developers", bài 8.1 "Page cache and why free memory is near zero" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c81-cache.out.txt (chạy thật) qua grab(); biểu đồ free/available và
 * mốc watermark lấy số từ chính file đó. Giảng: giang/os-08-1.mjs.
 */
import { lamDeck, sh, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-08-1', code: 'OS 8.1', title: 'Page cache and why free memory is near zero', sub: 'Operating Systems · Chapter 8' };

const g = (pre, n = 1) => grab('c81-cache', pre, n);
const wrap = (t, max = 104) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf('|', max - 2); if (k < 20) k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 13.5) => sh(wrap(t, Math.round(104 * 13 / fs)), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 4}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', GY = '#9a9a9a';
const mk = (m) => `<marker id="ar${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;

/* ba dòng "Mem:" của free -m: trước khi đọc 1 GB, sau khi đọc, sau drop_caches */
const memRows = () => {
  const L = grab('c81-cache', 'free -m', 99).split('\n').filter((l) => l.startsWith('Mem:')).map((l) => l.trim().split(/ +/).slice(1).map(Number));
  if (L.length < 4) throw new Error('os-08-1: cần ≥4 dòng Mem:');
  return [['before reading 1 GB', L[1]], ['after reading 1 GB', L[2]], ['after drop_caches', L[3]]];
};
const freeSvg = () => {
  const X = 260, W = 790, sc = W / 7934;
  let s = `<svg viewBox="0 0 1110 470" width="1110" height="470" font-family="Arial">`;
  memRows().forEach(([n, [total, used, free, shared, cache, avail]], i) => {
    const y = 20 + i * 140;
    s += T(X - 16, y + 38, n, 21, { a: 'end', w: 800 });
    let x = X;
    const seg = (v, col, lab) => { const w = v * sc; s += R(x, y + 10, w, 50, col + '33', col, { rx: 3 }) + (w > 110 ? T(x + w / 2, y + 42, `${lab} ${v}`, 18, { a: 'middle', w: 700, f: col }) : w > 40 ? T(x + w / 2, y + 42, `${v}`, 18, { a: 'middle', w: 700, f: col }) : ''); x += w; };
    seg(used, GY, 'used'); seg(cache, OR, 'buff/cache'); seg(free, GR, 'free');
    s += R(X + (total - avail) * sc, y + 70, avail * sc, 24, BL + '22', BL, { rx: 3, dash: 1 }) + T(X + total * sc - 8, y + 88, `available ${avail}`, 17, { a: 'end', w: 800, f: BL });
  });
  s += T(X, 462, 'MiB on the lab VM (7,934 total) — from three real free -m runs', 15, { f: '#777' });
  return s + '</svg>';
};

/* watermark của zone Normal (trang 4 KiB → MiB) */
const wmSvg = () => {
  const t = g("grep -A5 'zone   Normal'");
  const v = (k) => +t.match(new RegExp(`${k} +(\\d+)`))[1] * 4 / 1024;
  const min = v('min'), low = v('low'), high = v('high');
  const X = 120, W = 560, Y = 40, H = 380, top = 60, sy = (m) => Y + H - (m / top) * H;
  let s = `<svg viewBox="0 0 1110 450" width="1110" height="450" font-family="Arial"><defs>${[RD, OR, GR, BL].map(mk).join('')}</defs>`;
  s += R(X, Y, W, H, '#fafafa', '#ccc', { rx: 6 }) + T(X + W / 2, Y - 12, 'free memory in zone Normal (MiB)', 17, { a: 'middle', f: '#555' });
  [[high, GR, 'high'], [low, OR, 'low'], [min, RD, 'min']].forEach(([m, c, n]) => {
    s += `<line x1="${X}" y1="${sy(m)}" x2="${X + W}" y2="${sy(m)}" stroke="${c}" stroke-width="3"/>` + T(X - 10, sy(m) + 6, `${n} ${m.toFixed(1)}`, 17, { a: 'end', w: 800, f: c });
  });
  // đường cong bộ nhớ trống đi xuống rồi được kswapd kéo lên
  const pts = [[0, 57], [90, 50], [180, 43], [230, low - 1.2], [300, 42], [370, high + 0.6], [430, 44], [480, 36], [520, min - 2], [560, 33]];
  s += `<polyline fill="none" stroke="${BL}" stroke-width="3.5" points="${pts.map(([x, m]) => `${X + x},${sy(m)}`).join(' ')}"/>`;
  s += T(X + 230, sy(low - 1.2) + 30, 'kswapd wakes', 16, { a: 'middle', w: 800, f: OR }) + T(X + 370, sy(high + 0.6) - 12, 'kswapd sleeps', 16, { a: 'middle', w: 800, f: GR });
  s += T(X + 520, sy(min - 2) + 26, 'direct reclaim', 16, { a: 'middle', w: 800, f: RD });
  const C = 730;
  s += T(C, 80, 'below low →', 20, { w: 800, f: OR }) + T(C, 106, 'kswapd reclaims in the', 18, { f: '#333' }) + T(C, 128, 'background until high', 18, { f: '#333' });
  s += T(C, 196, 'below min →', 20, { w: 800, f: RD }) + T(C, 222, 'the allocating task must', 18, { f: '#333' }) + T(C, 244, 'reclaim itself (allocstall):', 18, { f: '#333' }) + T(C, 266, 'your request waits', 18, { w: 700, f: RD });
  s += T(C, 334, 'in a cgroup at memory.max →', 20, { w: 800, f: BL }) + T(C, 360, 'always direct: pgscan_direct,', 18, { f: '#333' }) + T(C, 382, 'pgscan_kswapd stays 0', 18, { f: '#333' });
  s += T(X, 444, `min_free_kbytes → per-zone min ${min.toFixed(1)} MiB; low = min × 1.25, high = min × 1.5 (real zoneinfo)`, 14, { f: '#777' });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 8 — Memory pressure', bai: '8.1',
}, [
  { cover: true, t: 'Page cache and why<br>“free” memory is near zero', sub: 'free vs available, reclaim and kswapd' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read <b>free</b> and <b>/proc/meminfo</b>: which number means “running out”</li>
<li>Why <b>free</b> inside a container shows the wrong machine</li>
<li>Watch files fill the <b>page cache</b> — and get evicted</li>
<li>Cold vs warm reads, measured</li>
<li><b>Reclaim</b>: kswapd, watermarks, direct reclaim</li>
<li><b>drop_caches</b>: what it really does (and why not to cron it)</li>
</ul>` },

  { t: 'Four columns, one that matters', giua: true, body: `
${sh(g('free -m'))}
${cards([
    ['used', 'Process memory (heap, stacks…) + kernel. Cannot be dropped.'],
    ['free', 'RAM holding <b>nothing at all</b>. On a healthy box it trends to zero.'],
    ['buff/cache', 'File data kept in RAM: the <b>page cache</b>. Reclaimable on demand.'],
    ['available', 'Estimate of what new programs can get <b>without swapping</b>. Watch this one.'],
  ], 4)}` },

  { t: '/proc/meminfo: the source behind free', giua: true, body: `
${tiny(g("grep -E '^(MemTotal"), 14)}
${box('How available is estimated', 'MemAvailable ≈ MemFree + the reclaimable part of the page cache (Active(file) + Inactive(file)) + reclaimable slab − the kernel’s low watermarks. Active/Inactive(anon) is process memory: it can only leave RAM through swap (lesson 8.2).', 'lam')}` },

  { t: 'Inside a container, free shows the wrong machine', giua: true, body: `
${sh(g('cat /sys/fs/cgroup/memory.max') + '\n' + g("grep -E '^(anon|file|file_dirty|active_file"))}
${vsd('<code class="i">free -m</code> in this container printed <b>7,934 MiB total</b> — the whole VM. /proc/meminfo is not namespaced.',
    'The container’s truth is in its cgroup: <b>memory.max</b> = 1 GiB, <b>memory.current</b>, and <b>memory.stat</b> (anon vs file).',
    '✗ free / top inside a container', '✓ /sys/fs/cgroup/memory.*')}` },

  { t: 'Writing a file fills the page cache', giua: true, body: `
${sh(g('dd if=/dev/urandom') + '\n' + g('./incore /tmp/big') + '\n' + g("grep -E '^(anon|file|file_dirty) '") + '\n' + g('sync;'))}
<p style="margin:0;font-size:21px">200 MiB written ⇒ <b>200 MiB of file pages</b> charged to the container, 100% of the file resident. The page cache is not a separate pool: it is ordinary RAM the kernel lends to files.</p>` },

  { t: 'Cold vs warm: why the cache exists', giua: true, body: `
${sh(g('./incore /tmp/big evict', 4))}
${box('15× here — far more on a real disk', 'Cold read 0.044 s, warm 0.003 s. This VM’s disk is a file on the Mac that macOS itself caches, so “cold” is still fast. On a VPS SSD or a network disk the gap is what Chapter 7 measured: ~52 µs per random 4 KiB page vs ~0.2 µs warm.', 'xanh')}` },

  { t: 'Read 1 GB: free drops, available does not', body: freeSvg() },

  { t: 'Under a cgroup limit, cache never causes an OOM', giua: true, body: `
${sh(g('./incore /tmp/big; ./incore /tmp/huge') + '\n' + g('cat /sys/fs/cgroup/memory.current') + '\n' + g('cat /sys/fs/cgroup/memory.events'))}` },

  { t: 'Who reclaimed it? Not kswapd', giua: true, body: `
${sh(g("grep -E '^(pgscan|pgsteal") + '\n' + g("grep -E '^(pgscan_kswapd|pgscan_direct|allocstall"))}
${cards([
    ['In the cgroup', '<b>pgscan_direct</b> 134,910, kswapd 0: at memory.max the task that allocates reclaims for itself.'],
    ['On the whole VM', 'Since boot kswapd scanned 738,648 pages, direct reclaim 119,569: global pressure is mostly handled in the background.'],
    ['refault', 'workingset_refault_file: evicted pages that were needed again — the first sign of a cache too small.'],
  ])}` },

  { t: 'Watermarks: when kswapd wakes up', body: wmSvg() },

  { t: 'Four LRU lists decide what goes first', to: true, giua: true, body: cards([
    ['inactive file', 'Read once, not touched since. <b>First to go</b>: drop it, re-read if needed.'],
    ['active file', 'Re-read recently (a hot binary, an index). Demoted to inactive before eviction.'],
    ['dirty file', 'Must be written back first — writeback turns reclaim into disk I/O.'],
    ['anon (both lists)', 'Heap, stacks. Only removable to swap; swappiness sets its price (8.2).'],
  ], 2) },

  { t: 'drop_caches: what it really does', giua: true, body: `
${sh(g('sync; echo 1 > /proc/sys/vm/drop_caches', 2))}
${vsd('A cron job <code class="i">echo 3 &gt; drop_caches</code> “to free RAM”: free jumps, then every hot file is read from disk again. Nothing was gained.',
    'Use it only to <b>measure cold reads</b> on a test box. Per-file eviction (<code class="i">./incore f evict</code> = fadvise DONTNEED) touches nothing else.')}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Watch <b>available</b>, not free: free → 0 is normal and healthy</li>
<li>The page cache is reclaimable RAM lent to files; cache alone never OOMs</li>
<li>In a container read <b>memory.current / memory.stat</b>, not free</li>
<li>kswapd reclaims between the low and high watermarks; below min, or at memory.max, your task reclaims itself</li>
<li>drop_caches discards work; measure with it, never “optimize” with it</li>
</ul>` },
]);
