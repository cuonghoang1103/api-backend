/**
 * osg-cs5 — OSG202 · ⭐ Advanced 5 "Memory on a real server" (deck tự dựng, slide EN, khuôn _pg-chung.mjs, 26/10/2026).
 * Đề cương: REPO/OSG202/CHUYEN-SAU.md mục 5. MỌI output = CHẠY THẬT bằng runner của gen (ảnh osg202-lab: Debian 12.15 aarch64,
 *   nhân 7.0.12-linuxkit trong máy ảo Docker Desktop 7,7 GiB RAM + 1 GiB swap, procps-ng 4.0.2, gcc 12.2, Node v22.23.4,
 *   Temurin 21.0.12.1; --network none), chương trình + output ở REPO/OSG202/gen/code/cs5/* + *.out.txt (slide chép nguyên output,
 *   chỉ cắt dòng/cột có ghi chú trên thanh tiêu đề khung).
 * Nguồn tra: kernel fs/proc/base.c proc_oom_score ((1000 + badness·1000/totalpages)·2/3) + __set_oom_adj (hạ dưới
 *   oom_score_adj_min cần CAP_SYS_RESOURCE); mm/oom_kill.c oom_badness (rss + swap + page tables + adj·totalpages/1000);
 *   mm/util.c __vm_enough_memory (mode 0: từ chối khi pages > RAM + swap); docs.kernel.org mm/overcommit-accounting (3 chế độ,
 *   MAP_NORESERVE); Documentation/filesystems/proc.rst (CommitLimit = RAM·ratio/100 + swap); man7 free(1) (used = total − available).
 * Dự án thật: deploy.sh (Step 2a build tuần tự, exit 137 06/07 + 07/07), Dockerfile.backend (heap 1536 MB ≈ 75 % trần 2G, tsc
 *   exit 134 22/10), frontend/Dockerfile (heap 3072→4096→6144→12288, exit 134 23/07, 24/09, 11/10), docker-compose.yml
 *   (trần từng dịch vụ; postgres shm_size 256mb 26/10), CLAUDE.md (đĩa đầy 18/08).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, steps, kw, vsd } from './_pg-chung.mjs';

export const deck = { key: 'cs5', code: 'CS.5', title: 'Memory on a real server', sub: 'OSG202 · ⭐ Advanced' };

const out = (t, o = {}) => psql(t, { title: 'output', sm: true, ...o });
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const C = (s, o = {}) => sql(s, { lang: 'c', sm: true, ...o });
const js = (s, o = {}) => sql(s, { lang: 'javascript', sm: true, ...o });
const java = (s, o = {}) => sql(s, { lang: 'java', sm: true, ...o });
const zm = (h, z) => `<div style="zoom:${z}">${h}</div>`;
/* two() của khuôn đặt a, b thẳng vào lưới ⇒ cột nhiều phần tử vỡ lưới: bọc mỗi cột một div */
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const MK = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
const L = (x1, y1, x2, y2, c, id, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="6 5"' : ''}${id ? ` marker-end="url(#${id})"` : ''}/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', GY = '#8a8a8a';

/* ── Slide 3: hãng bay bán vượt số ghế ── */
const airline = () => {
  let s = `<svg viewBox="0 0 1110 190" width="1110" height="190" font-family="Arial"><defs>${MK('osg-a', BR)}</defs>`;
  const bx = [[10, 'TICKETS SOLD', '200 promised', 'malloc() · VSZ', OR, '#fff7ef'], [290, 'PASSENGERS AT THE GATE', '170 really show up', 'touched pages · RSS', BL, '#eef4fa'],
    [570, 'SEATS ON THE PLANE', '160 seats', 'RAM + swap', GR, '#f1f9f4'], [850, 'BUMPED', '10 must stay behind', 'the OOM killer picks', RD, '#fdf0ee']];
  bx.forEach(([x, h, a, b, c, f], i) => {
    s += R(x, 20, 250, 130, f, c, { rx: 12, sw: 2.5 });
    s += T(x + 125, 54, h, 17, { a: 'middle', w: 800, f: c });
    s += T(x + 125, 90, a, 21, { a: 'middle', w: 700 });
    s += T(x + 125, 124, b, 17, { a: 'middle', f: '#555', m: 1 });
    if (i < 3) s += L(x + 254, 85, x + 286, 85, BR, 'osg-a', { sw: 3 });
  });
  s += T(555, 180, 'It works because most people who book never show up — exactly like most of the memory programs ask for.', 16, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* ── Slide 4: không gian địa chỉ ảo → khung trang vật lý ── */
const addrSpace = () => {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial"><defs>${MK('osg-b', BL)}${MK('osg-o', OR)}</defs>`;
  s += T(125, 20, 'process A — virtual pages', 16, { a: 'middle', w: 800, f: BR });
  s += T(555, 20, 'physical RAM — frames', 16, { a: 'middle', w: 800, f: GR });
  s += T(985, 20, 'process B — virtual pages', 16, { a: 'middle', w: 800, f: BR });
  const rowsA = [['libc code', 'sh'], ['heap', 'ok'], ['heap', 'ok'], ['heap (never touched)', 'no'], ['heap (never touched)', 'no'], ['stack', 'ok']];
  const rowsB = [['libc code', 'sh'], ['heap', 'ok'], ['stack', 'ok'], ['mmap (never touched)', 'no']];
  const frames = ['libc code (shared)', 'A heap', 'A heap', 'A stack', 'B heap', 'B stack'];
  const fy = (i) => 36 + i * 44;
  frames.forEach((t, i) => { s += R(440, fy(i), 230, 34, i === 0 ? '#fff3c4' : '#f1f9f4', GR, { rx: 6 }); s += T(555, fy(i) + 23, t, 15, { a: 'middle' }); });
  const col2 = (x, rows, map, side) => rows.forEach(([t, k], i) => {
    const y = 36 + i * 44, no = k === 'no';
    s += R(x, y, 210, 34, no ? '#fafafa' : k === 'sh' ? '#fff3c4' : '#fff7ef', no ? '#bdbdbd' : OR, { rx: 6, dash: no });
    s += T(x + 105, y + 23, t, 15, { a: 'middle', f: no ? '#999' : '#333' });
    if (map[i] !== undefined) {
      const fyy = fy(map[i]) + 17;
      s += side === 'L' ? L(x + 212, y + 17, 436, fyy, k === 'sh' ? OR : BL, k === 'sh' ? 'osg-o' : 'osg-b', { sw: 2 })
        : L(x - 2, y + 17, 674, fyy, k === 'sh' ? OR : BL, k === 'sh' ? 'osg-o' : 'osg-b', { sw: 2 });
    }
  });
  col2(20, rowsA, { 0: 0, 1: 1, 2: 2, 5: 3 }, 'L');
  col2(880, rowsB, { 0: 0, 1: 4, 2: 5 }, 'R');
  s += R(880, 220, 210, 104, '#eef4fa', BL, { rx: 10, sw: 1.5 });
  s += T(895, 246, 'VSZ(B) = 4 pages', 15, { m: 1 });
  s += T(895, 272, 'RSS(B) = 3 pages', 15, { m: 1 });
  s += T(895, 298, 'PSS(B) = 2.5 pages', 15, { m: 1, w: 700, f: BL });
  s += T(895, 316, 'libc counts 1/2', 13, { f: '#666' });
  s += R(440, 304, 230, 22, '#fff', '#fff', { rx: 0, sw: 0 });
  s += T(20, 318, 'VSZ(A) = 6   RSS(A) = 4   PSS(A) = 3.5   (libc counts 1/2)', 15, { m: 1, w: 700, f: BR });
  return s + '</svg>';
};

/* ── Slide 7: thanh free -m ── */
const freeBar = () => {
  const W = 1060, x0 = 25, tot = 7934, k = W / tot;
  const seg = [['used, not cache', 2670, '#e9b7ae', RD], ['cache that cannot be dropped (tmpfs…)', 404, '#f3d9a6', OR], ['reclaimable cache', 2343, '#cfe0f0', BL], ['free', 2516, '#d3ecdc', GR]];
  let s = `<svg viewBox="0 0 1110 205" width="1110" height="205" font-family="Arial">`;
  let x = x0;
  const xs = [];
  seg.forEach(([t, v, f, c], i) => {
    const w = v * k; xs.push([x, w]);
    s += `<rect x="${x}" y="62" width="${w}" height="52" fill="${f}" stroke="${c}" stroke-width="2"${i === 1 ? ' stroke-dasharray="5 3"' : ''}/>`;
    if (w > 150) s += T(x + w / 2, 94, `${t} ${v}`, 16, { a: 'middle', w: 700, f: c });
    x += w;
  });
  s += T(xs[1][0] + xs[1][1] / 2, 94, '404', 15, { a: 'middle', w: 700, f: OR });
  const brTop = (a, b, t, c) => { s += `<path d="M${a},54 L${a},44 L${b},44 L${b},54" fill="none" stroke="${c}" stroke-width="2.5"/>`; s += T((a + b) / 2, 36, t, 17, { a: 'middle', w: 800, f: c }); };
  const brBot = (a, b, t, c, y = 124) => { s += `<path d="M${a},${y} L${a},${y + 10} L${b},${y + 10} L${b},${y}" fill="none" stroke="${c}" stroke-width="2.5"/>`; s += T((a + b) / 2, y + 32, t, 17, { a: 'middle', w: 800, f: c }); };
  brTop(xs[1][0], xs[2][0] + xs[2][1], 'buff/cache 2747', BL);
  brBot(x0, xs[1][0] + xs[1][1], 'used 3074 = total − available', RD);
  brBot(xs[2][0], x0 + W, 'available 4859 = free + reclaimable cache', GR);
  s += T(x0, 196, 'total 7934 MiB · 404 = cache not counted as available (tmpfs/shmem, pages in use) · procps-ng 4.0.2, after a 500 MiB write', 15, { f: '#666' });
  return s + '</svg>';
};

/* ── Slide 15: bộ nhớ JVM trong container 512 MiB ── */
const jvmBar = () => {
  const W = 1060, x0 = 25, k = W / 512;
  const seg = [['Java heap (committed)', 173, '#cfe0f0', BL], ['direct', 64, '#f3d9a6', OR], ['threads 6 · code 7 · GC, symbols 2 · …', 30, '#e9d5f0', '#7a4b94']];
  let s = `<svg viewBox="0 0 1110 175" width="1110" height="175" font-family="Arial">`;
  s += `<rect x="${x0}" y="50" width="${W}" height="56" fill="#fafafa" stroke="#999" stroke-width="2" stroke-dasharray="6 4"/>`;
  let x = x0;
  seg.forEach(([t, v, f, c]) => {
    const w = v * k;
    s += `<rect x="${x}" y="50" width="${w}" height="56" fill="${f}" stroke="${c}" stroke-width="2"/>`;
    s += T(x + w / 2, 84, v >= 60 ? `${t} ${v}` : `${v}`, 16, { a: 'middle', w: 700, f: c });
    x += w;
  });
  s += T(x + 14, 84, 'still free in the container: 245 MiB', 16, { w: 700, f: GR });
  s += T(x0, 36, 'NMT "committed" total 267 MiB · RSS 210 MiB · -XX:MaxRAMPercentage=50 ⇒ max heap 256 MiB', 16, { w: 700, f: '#444' });
  s += `<path d="M${x0},116 L${x0},126 L${x0 + 267 * k},126 L${x0 + 267 * k},116" fill="none" stroke="#7a4b94" stroke-width="2.5"/>`;
  s += T(x0 + 267 * k / 2, 148, 'non-heap = 94 MiB on top of the heap (35 %)', 16, { a: 'middle', w: 800, f: '#7a4b94' });
  s += T(x0 + W, 148, 'memory.max 512 MiB', 16, { a: 'end', w: 800, f: RD });
  return s + '</svg>';
};

/* ── Slide 20: đồ thị rò bộ nhớ (số thật ro-ri-node.out.txt, RoRiJava.out.txt) ── */
const leakChart = () => {
  const W = 580, H = 330, x0 = 62, y0 = 270, sx = (W - 92) / 50000, sy = 220 / 60;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" font-family="Arial">`;
  s += L(x0, y0, W - 20, y0, '#999', null, { sw: 1.5 }) + L(x0, y0, x0, 36, '#999', null, { sw: 1.5 });
  [0, 20, 40, 60].forEach((v) => { const y = y0 - v * sy; s += T(x0 - 8, y + 5, v, 14, { a: 'end', f: '#777' }); s += `<line x1="${x0}" y1="${y}" x2="${W - 20}" y2="${y}" stroke="#eee"/>`; });
  [0, 10000, 20000, 30000, 40000, 50000].forEach((v) => s += T(x0 + v * sx, y0 + 20, v / 1000 + 'k', 14, { a: 'middle', f: '#777' }));
  s += T((x0 + W) / 2, y0 + 46, 'requests handled', 15, { a: 'middle', f: '#555' });
  s += T(14, 26, 'heap used after a full GC (MB)', 15, { f: '#555' });
  const node = [6, 11, 16, 22, 27, 33, 39, 44, 50, 55].map((v, i) => [(i + 1) * 5000, v]);
  const lru = node.map(([a]) => [a, 1]);
  const jv = [11, 22, 33, 43, 55].map((v, i) => [(i + 1) * 10000, v]);
  const line = (d, c, dash) => `<polyline fill="none" stroke="${c}" stroke-width="3.5"${dash ? ' stroke-dasharray="7 5"' : ''} points="${[[0, 0], ...d].map(([a, b]) => `${x0 + a * sx},${y0 - b * sy}`).join(' ')}"/>`;
  const dots = (d, c, r = 4.5) => d.map(([a, b]) => `<circle cx="${x0 + a * sx}" cy="${y0 - b * sy}" r="${r}" fill="${c}"/>`).join('');
  s += line(node, RD) + dots(node, RD) + line(lru, GR) + dots(lru, GR);
  s += dots(jv, BL, 6.5).replace(/fill="#336791"/g, 'fill="none" stroke="#336791" stroke-width="3"');
  s += T(x0 + 14000 * sx, y0 - 34 * sy, 'Node, unbounded Map', 15, { a: 'middle', f: RD, w: 700 });
  s += T(x0 + 14000 * sx, y0 - 29 * sy, '+1.1 MB / 1 000 requests', 15, { a: 'middle', f: RD });
  s += T(x0 + 38000 * sx, y0 - 18 * sy, '○ = Java HashMap: same slope', 15, { a: 'middle', f: BL, w: 700 });
  s += T(x0 + 33000 * sx, y0 - 5 * sy, 'Node, LRU of 1 000: flat at 1 MB', 15, { a: 'middle', f: GR, w: 700 });
  return s + '</svg>';
};

/* ── Slide 25: dòng thời gian sự cố bộ nhớ của chính repo này ── */
const repoTL = () => {
  let s = `<svg viewBox="0 0 1110 200" width="1110" height="200" font-family="Arial">`;
  s += L(20, 86, 1090, 86, '#bfbfbf', null, { sw: 4 });
  const ev = [[70, '06–07 Jul', '137 ×2', 'next build in', 'parallel', RD], [200, '14 Jul', 'VPS 8 GB', 'backend heap', '1536 of 2G', BL],
    [330, '23 Jul', '134', 'next build', 'heap 3072→4096', OR], [460, '18 Aug', 'ENOSPC', 'build cache', 'filled the disk', GY],
    [590, '24 Sep', '134', 'heap', '4096→6144', OR], [720, '11 Oct', '134', 'heap 6144→', '12288 at home', OR],
    [850, '22 Oct', '134', 'tsc build', 'heap 6144', OR], [980, '26 Oct', 'shm', 'postgres', 'shm_size 256mb', GR]];
  ev.forEach(([x, d, k, a, b, c]) => {
    s += `<circle cx="${x}" cy="86" r="11" fill="#fff" stroke="${c}" stroke-width="5"/>`;
    s += T(x, 30, d, 15, { a: 'middle', w: 800, f: '#555' });
    s += T(x, 60, k, 18, { a: 'middle', w: 800, f: c });
    s += T(x, 122, a, 15, { a: 'middle' });
    s += T(x, 144, b, 15, { a: 'middle' });
  });
  s += T(555, 186, '137 = SIGKILL from the kernel (cgroup or VM out of RAM)  ·  134 = SIGABRT from V8 (JS heap limit)  ·  ENOSPC = disk, not RAM', 15, { a: 'middle', f: '#555', w: 700 });
  return s + '</svg>';
};

export const slides = lamDeck({ khoa: 'Operating Systems', duong: 'academy/osg202', bieuTuong: '🐧', khau: 'from zero to real backend work',
  chuong: '⭐ Advanced 5 — Memory on a real server', bai: 'CS.5' }, [

  /* 1 */
  { cover: true, t: 'Memory on<br>a real server', sub: 'VSZ · RSS · PSS · free -m · page cache · swap ·<br>overcommit · OOM killer · JVM &amp; Node heaps · leaks · /dev/shm' },

  /* 2 */
  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read <b>VSZ, RSS and PSS</b> in <code class="i">ps</code>, <code class="i">/proc/&lt;pid&gt;/status</code>, <code class="i">smaps_rollup</code> — and know which one to trust</li>
<li>Read <code class="i">free -m</code> correctly: <b>buff/cache</b>, <b>available</b>, swap, <code class="i">vm.swappiness</code></li>
<li>See <b>overcommit</b> for real: 100 GiB promised on a 7.7 GiB machine</li>
<li>Predict the <b>OOM killer</b>: <code class="i">oom_score</code>, <code class="i">oom_score_adj</code>, exit <b>137</b></li>
<li>Size the <b>JVM</b> and <b>Node</b> heaps for a container; tell <b>137 / 134 / 1</b> apart</li>
<li>Measure a <b>memory leak</b>; use <b>mmap</b> and <b>/dev/shm</b> without surprises</li>
</ul>
${box('Beyond the school slides', 'Lessons 3.A–3.B taught paging, page tables and replacement algorithms. This deck shows what those ideas look like on a Linux server running Node, Java and PostgreSQL. Every output is a real run: Debian 12, kernel 7.0 (ARM64) in a 7.7 GiB VM, Node 22.23, Java 21.0.12.', 'lam')}` },

  /* 3 */
  { t: 'First, a picture: an airline that overbooks', giua: true, body: `
${airline()}
<table class="t" style="font-size:20px">
<tr><th style="width:42%">The airline</th><th>Linux memory</th></tr>
<tr><td>Selling a ticket costs nothing</td><td><code class="i">malloc()</code> / <code class="i">mmap()</code> only <b>reserve addresses</b> (VSZ)</td></tr>
<tr><td>A seat is needed only when the passenger boards</td><td>a RAM frame is given only when a page is <b>first touched</b> (RSS)</td></tr>
<tr><td>Overbooking works most days</td><td><b>overcommit</b>: promises can exceed RAM + swap</td></tr>
<tr><td>Too many show up → someone is bumped</td><td>the <b>OOM killer</b> chooses a process and sends <b>SIGKILL</b></td></tr>
</table>` },

  /* 4 */
  { t: 'Virtual pages, resident pages: VSZ, RSS, PSS', giua: true, body: `
${addrSpace()}
<p style="margin:0;font-size:20px">${kw('VSZ', 'all virtual memory mapped')} ${kw('RSS', 'pages now in RAM')} ${kw('PSS', 'RSS with shared pages split')} ${kw('USS', 'pages only this process has')}</p>
<p style="margin:0;font-size:20px">A dashed page has an address but <b>no frame</b>: it costs nothing until touched. The libc frame is used by both, so RSS counts it <b>twice</b> and PSS gives each process <b>half</b>.</p>` },

  /* 5 */
  { t: 'Measured: malloc() grows VSZ, touching grows RSS', giua: true, body: two(
    `${C(`char *p = malloc(512 * MiB);      /* ask for 512 MiB */
show("after malloc(512 MiB)");
memset(p, 1, 200 * MiB);          /* write to 200 MiB */
show("after touching 200 MiB");
memset(p, 1, 512 * MiB);
show("after touching all 512 MiB");
free(p);                          /* big block: munmap */
show("after free()");`, { hl: [1, 3] })}
${out(`start                        VmSize     2 MiB   VmRSS    1 MiB
after malloc(512 MiB)        VmSize   514 MiB   VmRSS    1 MiB
after touching 200 MiB       VmSize   514 MiB   VmRSS  202 MiB
after touching all 512 MiB   VmSize   514 MiB   VmRSS  513 MiB
after free()                 VmSize     2 MiB   VmRSS    1 MiB`, { title: 'vsz-rss.c — show() reads /proc/self/status', hl: [2, 3] })}`,
    `${term(`$ ps -o pid,vsz,rss,comm -p $P
    PID    VSZ   RSS COMMAND
      9 483752 42268 node
$ grep -E '^(Vm…|Rss…|Threads)' /proc/$P/status
VmPeak:	  484004 kB
VmSize:	  483752 kB
VmRSS:	   42268 kB
RssAnon:	    6364 kB
RssFile:	   35904 kB
RssShmem:	       0 kB
VmSwap:	       0 kB
Threads:	7`, { title: 'ps-node.sh — an idle node · 🎲 one real run', hl: [3, 7] })}
<ul style="font-size:19px">
<li><code class="i">ps</code> VSZ and RSS are in <b>KiB</b>; <code class="i">top</code> calls them VIRT and RES</li>
<li>RSS = <b>RssAnon</b> (heap, stack) + <b>RssFile</b> (code, libraries) + <b>RssShmem</b></li>
</ul>`, 'r64') },

  /* 6 */
  { t: 'PSS: RSS lies when pages are shared', giua: true, body: two(
    `${out(`(1) right after fork: the 120 MiB is shared by all three
  process       Rss      Pss  Private_Dirty
  parent     121 MiB    40 MiB          0 MiB
  child 1    120 MiB    40 MiB          0 MiB
  child 2    120 MiB    40 MiB          0 MiB
  SUM        362 MiB   120 MiB
(2) each child has written to 60 MiB of it
  process       Rss      Pss  Private_Dirty
  parent     121 MiB    80 MiB         60 MiB
  child 1    120 MiB    80 MiB         60 MiB
  child 2    120 MiB    80 MiB         60 MiB
  SUM        362 MiB   240 MiB`, { title: 'pss.c — reads /proc/PID/smaps_rollup of each process', hl: [6, 12], sm: false })}`,
    `<ul style="font-size:20px">
<li>After <code class="i">fork()</code> the child <b>shares</b> the parent’s pages: <b>copy-on-write</b> (CS.1)</li>
<li>Adding up RSS says <b>362 MiB</b>; the machine really uses <b>120</b> — that is the PSS sum</li>
<li>A write <b>copies</b> the page: each child now owns 60 MiB privately → real total 240</li>
<li>Where it matters: PostgreSQL backends, gunicorn/PM2 workers, nginx workers — all <b>forked</b> from one parent</li>
</ul>
${box('Which number to use', 'One process: <b>RSS</b>. Many forked workers: sum <b>PSS</b> (<code class="i">smaps_rollup</code>, <code class="i">smem</code>). A container: <code class="i">memory.current</code> of its cgroup.', 'xanh')}`, 'r64') },

  /* 7 */
  { t: 'free -m, read correctly', giua: true, body: `
${freeBar()}
${two(term(`$ free -m
         total   used   free  shared  buff/cache  available
Mem:      7934   3106   2991     206        2236       4827
$ dd if=/dev/zero of=/tmp/big.dat bs=1M count=500
$ free -m
Mem:      7934   3074   2516     206        2747       4859
buff/cache grew by 511 MiB, available changed by 21 MiB
$ rm /tmp/big.dat
after rm: buff/cache back by 511 MiB`, { title: 'free-cache.sh · 🎲 one real run (spacing shortened)', hl: [6, 7] }),
    `<ul style="font-size:19px">
<li><b>available</b> is the number to watch: what new programs can get <b>without swapping</b></li>
<li><b>free</b> is RAM nobody uses — low is <b>normal</b>; Linux fills spare RAM with file cache</li>
<li>procps 4: <b>used = total − available</b>. Older <code class="i">free</code> computed it differently</li>
</ul>`, 'r64')}` },

  /* 8 */
  { t: 'In a container: cache is reclaimable, heap is not', giua: true, body: two(
    `${term(`$ cat /sys/fs/cgroup/memory.max
67108864
$ grep MemTotal /proc/meminfo
MemTotal:        8124516 kB
$ for i in $(seq 15); do dd … >> big.dat
    sync big.dat; done      # 20 MiB × 15
write exit code: 0
300M /tmp/big.dat
$ grep -E '^(anon|file) ' memory.stat
anon 1069056
file 59768832
$ ./an | tail -1     # malloc + memset
allocated 60 MiB
exit code: 137
$ grep -E '^(max|oom_kill) ' memory.events
max 337
oom_kill 1`, { title: 'cache-cgroup.sh · 64 MiB, no swap · 🎲 (loop shortened)', hl: [4, 7, 11, 14, 17] })}`,
    `<ul style="font-size:19px">
<li><code class="i">free</code> / <code class="i">/proc/meminfo</code> inside a container show the <b>whole machine</b> (8 GB here), not your 64 MiB</li>
<li>Writing <b>300 MiB</b> in 64 MiB works: file pages are <b>charged</b> to the cgroup, and once written back (<code class="i">sync</code>) the kernel <b>drops</b> them — <code class="i">max 337</code> reclaims</li>
<li><b>Anonymous</b> memory (heap) has nowhere to go without swap → <b>OOM kill</b>, exit 137</li>
<li>Caveat: <b>dirty</b> pages must reach the disk first — one 300 MiB <code class="i">dd</code> burst got the container killed in 2 of 6 tries</li>
</ul>
${box('Already in CS.6', 'How <code class="i">docker --memory</code> writes <code class="i">memory.max</code>, and why <code class="i">--memory</code> alone also grants the same amount of swap.', 'lam')}`, 'r46') },

  /* 9 */
  { t: 'Swap and vm.swappiness', giua: true, body: two(
    `${term(`$ swapon --show
NAME          TYPE  SIZE  USED PRIO
/var/lib/swap file 1024M 18.6M   -1
$ cat /proc/sys/vm/swappiness
60
$ sysctl -w vm.swappiness=10
sysctl: permission denied on key "vm.swappiness"
$ echo 10 > /proc/sys/vm/swappiness
bash: /proc/sys/vm/swappiness: Read-only file system
$ cat /sys/fs/cgroup/memory.swap.max
max`, { title: 'swap.sh (inside the course container)', hl: [5, 7, 9] })}
${box('Honest note', 'A container shares <b>one kernel</b> (CS.6): <code class="i">vm.*</code> settings belong to the whole machine, so Docker mounts <code class="i">/proc/sys</code> read-only. Change them on the <b>host</b> (<code class="i">/etc/sysctl.d/</code>).', 'do2')}`,
    `<ul style="font-size:20px">
<li><b>Swap</b> = disk space for <b>anonymous</b> pages the kernel moves out of RAM. File pages need no swap: they are just dropped and re-read</li>
<li><b>swappiness</b> (0–200, default <b>60</b>) = how willing the kernel is to swap anon pages instead of dropping cache</li>
<li>Low (1–10) on database hosts: keep the heap in RAM, sacrifice cache</li>
<li>Swap <b>delays</b> an OOM kill but a server that swaps hard is <b>slow</b> — watch <code class="i">si</code>/<code class="i">so</code> in <code class="i">vmstat 1</code> (CS.7)</li>
<li>cgroup v2 has no per-container swappiness: control swap with <code class="i">memory.swap.max</code> (<code class="i">--memory-swap</code>)</li>
</ul>`) },

  /* 10 */
  { t: 'Overcommit: the kernel promises more than it has', giua: true, body: `
<table class="t" style="font-size:19px">
<tr><th style="width:24%">vm.overcommit_memory</th><th>Rule (kernel docs, mm/util.c)</th><th style="width:30%">Where you meet it</th></tr>
<tr><td><b>0</b> — heuristic (default)</td><td>refuse only an <b>obvious</b> overcommit: one request larger than <b>RAM + swap</b></td><td>stock Ubuntu / Debian servers</td></tr>
<tr><td><b>1</b> — always</td><td>never refuse; the OOM killer settles the bill later</td><td>this Docker Desktop VM; Redis recommends it</td></tr>
<tr><td><b>2</b> — never</td><td>total promises ≤ <b>CommitLimit</b> = RAM × ratio/100 + swap</td><td>strict hosts that prefer NULL to a kill</td></tr>
</table>
${two(out(`vm.overcommit_memory = 1, vm.overcommit_ratio = 50
RAM 7934 MiB, swap 1023 MiB, CommitLimit 4991 MiB
malloc(10 GiB)      -> OK, not NULL`, { title: 'overcommit.c (first lines)', hl: [3], sm: false }),
    `<ul style="font-size:20px">
<li>CommitLimit = 7934 × 50 % + 1023 ≈ <b>4991</b> ✓ — computed even here, enforced only in mode 2</li>
<li>In mode <b>0</b> this same <code class="i">malloc(10 GiB)</code> would return <b>NULL</b>: 10 GiB &gt; 7.7 + 1</li>
</ul>`)}
${box('Cannot switch modes here', '<code class="i">overcommit_memory</code> is kernel-wide: changing it from a privileged container would change it for every container on this VM. Modes 0 and 2 come from the kernel docs and source, not from a run.', 'lam')}` },

  /* 11 */
  { t: '100 GiB promised — paid at first touch', giua: true, body: two(
    `${C(`char *p = malloc(10 * GiB);
for (int i = 0; i < 9; i++) if (malloc(10 * GiB)) n++;
void *q = mmap(NULL, 1024 * GiB, PROT_READ | PROT_WRITE,
     MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);`)}
${out(`malloc(10 GiB)      -> OK, not NULL
10 x malloc(10 GiB) -> 10 succeeded = 100 GiB promised
VmSize 100 GiB, VmRSS 1 MiB, Committed_AS grew by 100 GiB
mmap(1 TiB, MAP_NORESERVE) -> OK`, { title: 'overcommit.c — on a 7.7 GiB VM', hl: [2, 3] })}
<p style="font-size:19px;margin:0"><b>Committed_AS</b> in <code class="i">/proc/meminfo</code> = all promises; here it exceeds CommitLimit. <code class="i">MAP_NORESERVE</code> is not even counted — the JVM reserves its heap address space this way.</p>`,
    `${out(`malloc(1 GiB) inside a 64 MiB container: OK
touched 10 MiB
touched 20 MiB
touched 30 MiB
touched 40 MiB
touched 50 MiB
touched 60 MiB
Killed
[exit code 137]`, { title: 'malloc-roi-cham.c · --memory 64m --memory-swap 64m · 🎲', hl: [1, 8], sm: false })}
${box('The lesson', '<code class="i">malloc</code> almost never fails on Linux, so “check for NULL” does not protect a server. The failure arrives later, at a <b>page fault</b>, as a <b>SIGKILL</b> you cannot catch.', 'do2')}`) },

  /* 12 */
  { t: 'The OOM killer’s score: oom_score and oom_score_adj', giua: true, body: two(
    `${term(`$ cat /proc/self/oom_score_adj /proc/self/oom_score
0
666
$ ./an 1000 > /dev/null &        # holds 1000 MiB
$ ps -o pid,rss,comm -p $P
    PID   RSS COMMAND
     19 1025676 an
$ echo "score with adj 0: $(cat /proc/$P/oom_score)"
score with adj 0: 741
RSS + swap + page tables = 1027728 kB
formula: (1000 + 1027728*1000/9173088) * 2/3 = 741
$ echo 500 > /proc/$P/oom_score_adj
score after adj 500: 1074
$ echo -500 > /proc/$P/oom_score_adj
bash: echo: write error: Permission denied
no CAP_SYS_RESOURCE in this container`, { title: 'oom-diem.sh · 🎲 (two commands shortened)', hl: [9, 11, 13, 15] })}`,
    `<ul style="font-size:19px">
<li><b>badness</b> = RSS + swap + page tables (pages) + <b>adj × total/1000</b> (mm/oom_kill.c)</li>
<li><code class="i">oom_score</code> = (1000 + badness·1000/(RAM+swap)) × 2/3 → <b>0–2000</b>; a tiny process shows <b>666</b></li>
<li><code class="i">oom_score_adj</code> −1000…1000: <b>+</b> = kill me first, <b>−1000</b> = never kill me</li>
<li>Anyone may <b>raise</b> it; <b>lowering</b> needs <b>CAP_SYS_RESOURCE</b> — even root in a container lacks it</li>
</ul>
${box('Who uses it', 'systemd <code class="i">OOMScoreAdjust=</code>, Kubernetes (Guaranteed pods −997, BestEffort 1000), Chrome tabs. Protect the database, sacrifice the batch job.', 'xanh')}`) },

  /* 13 */
  { t: 'Who dies? The highest score — not the last one to ask', giua: true, body: two(
    `${term(`$ cat /sys/fs/cgroup/memory.max
134217728
$ ./an 50 &
holding 50 MiB
$ echo 1000 > /proc/$A/oom_score_adj …
A: holds 50 MiB, oom_score_adj 1000, oom_score 1336
$ ./an 100 &
holding 100 MiB
bash:    19 Killed                  ./an 50
B: oom_score_adj 0, VmRSS 103704 kB, still alive
$ kill -0 $A
bash: kill: (19) - No such process
$ grep -E '^(max|oom|oom_kill) ' memory.events
max 42
oom 2
oom_kill 1
$ dmesg | tail -1
dmesg: read kernel buffer failed: Operation not permitted`, { title: 'oom-nan-nhan.sh · 128 MiB, no swap · 🎲 (some commands cut)', hl: [9, 10, 16] })}`,
    `<ul style="font-size:20px">
<li>B asked for memory when 50 + 100 MiB no longer fit in 128 MiB — but <b>A</b> had the highest score, so <b>A</b> was killed and B got its pages</li>
<li>Inside a cgroup the killer chooses <b>only among that cgroup’s processes</b></li>
<li><code class="i">oom 2</code>, <code class="i">oom_kill 1</code>: two OOM events, one kill — the second waited for A’s memory to be freed</li>
<li><code class="i">dmesg</code> needs privileges; a host shows <code class="i">Killed process … (an) … oom_score_adj:1000</code></li>
</ul>
${box('Honest note: a race', 'In about half of our re-runs B was killed <b>too</b>, under 1 ms after A, before A’s memory had been returned. A — the highest score — always went <b>first</b>.', 'do2')}`) },

  /* 14 */
  { t: 'The JVM in a container: 25 % of the limit by default', giua: true, body: two(
    `${term(`$ cat /sys/fs/cgroup/memory.max
536870912
$ java -XshowSettings:system -version 2>&1 | grep …
    Provider: cgroupv2
    Memory Limit: 512.00M
    Memory & Swap Limit: 512.00M
$ java -XX:+PrintFlagsFinal -version | grep …
   size_t MaxHeapSize        = 134217728   {ergonomic}
   double MaxRAMPercentage   = 25.000000   {default}
     bool UseContainerSupport = true       {default}
     bool UseG1GC            = false       {default}
     bool UseSerialGC        = true        {ergonomic}
$ java -XX:MaxRAMPercentage=75 … | grep MaxHeapSize
   size_t MaxHeapSize        = 402653184   {ergonomic}
$ java -Xmx1g … | grep MaxHeapSize
   size_t MaxHeapSize        = 1073741824  {command line}`, { title: 'jvm-container.sh · --memory 512m (columns shortened)', hl: [8, 14, 16] })}`,
    `<ul style="font-size:20px">
<li><b>UseContainerSupport</b> (on since JDK 10, backported to 8u191): the JVM reads <code class="i">memory.max</code>, not the host’s RAM</li>
<li>Default heap = <b>25 %</b> → 128 MiB of 512: safe but often wasteful</li>
<li><code class="i">-XX:MaxRAMPercentage=75</code> → 384 MiB, and it <b>follows</b> the limit when ops resize the container</li>
<li>Under ~2 GB or 2 CPUs the JVM picks <b>SerialGC</b>, not G1</li>
<li><code class="i">-Xmx1g</code> in 512 MiB is accepted <b>without a warning</b> — slide 16 shows what happens next</li>
</ul>`) },

  /* 15 */
  { t: 'Heap is not the whole JVM: native memory', giua: true, body: `
${jvmBar()}
${two(term(`$ java -XX:NativeMemoryTracking=summary -XX:MaxRAMPercentage=50 DichVu &
ready: 100 MiB in the heap, 64 MiB direct buffer, 50 threads
$ jcmd $P VM.native_memory summary scale=MB | grep …
Total: reserved=1796MB, committed=267MB
-  Java Heap (reserved=256MB, committed=173MB)
-      Class (reserved=1024MB, committed=0MB)
-     Thread (reserved=126MB, committed=6MB)
-       Code (reserved=242MB, committed=7MB)
-      Other (reserved=64MB, committed=64MB)
RSS of the JVM process: 210 MB`, { title: 'jvm-native.sh · --memory 512m · 🎲 (indent shortened)', hl: [5, 9, 10] }),
    `<ul style="font-size:19px">
<li><b>Other</b> = <code class="i">ByteBuffer.allocateDirect</code>: Netty, NIO, gRPC buffers live <b>off-heap</b></li>
<li>Each thread <b>reserves</b> its stack — 2 MiB on ARM64, 1 MiB on x86-64 (126 MB here) — but touches little: reserved ≠ used</li>
<li>Rule of thumb: heap ≈ <b>50–75 %</b> of the limit, the rest for native</li>
</ul>`, 'r64')}` },

  /* 16 */
  { t: 'Two endings: OutOfMemoryError or SIGKILL', giua: true, body: two(
    `${java(`List<byte[]> keep = new ArrayList<>();
for (int mib = 1; ; mib++) {
    byte[] b = new byte[1 << 20];
    java.util.Arrays.fill(b, (byte) 1);
    keep.add(b);
    if (mib % 32 == 0) System.out.println(
        "live data: " + mib + " MiB");
}`, { hl: [5] })}
${box('Read it in the logs', '<b>-Xlog:gc</b> prints every collection: <code class="i">Pause Full … 60M-&gt;60M(61M)</code> = a full GC freed <b>nothing</b>. Several in a row means the heap is full of live data: a leak or a heap that is too small.', 'lam')}`,
    `${term(`$ cat /sys/fs/cgroup/memory.max
268435456
$ java -Xmx64m -Xlog:gc HetHeap 2>&1 | tail -6
[0.045s] GC(10) Pause Young (Allocation Failure) 47M->60M(61M) 2.289ms
[0.048s] GC(11) Pause Full (Allocation Failure) 60M->47M(61M) 3.097ms
[0.051s] GC(12) Pause Full (Allocation Failure) 60M->60M(61M) 1.883ms
[0.054s] GC(13) Pause Full (Allocation Failure) 60M->60M(61M) 2.717ms
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at HetHeap.main(HetHeap.java:10)
exit code: 1
$ java -Xmx1g HetHeap 2>&1 | tail -3
live data: 160 MiB
live data: 192 MiB
live data: 224 MiB
exit code: 137
$ grep -E '^oom_kill ' memory.events
oom_kill 1`, { title: 'java-oom.sh · 256 MiB, no swap · 🎲 ([info][gc] tags cut)', hl: [7, 9, 14] })}
<ul style="font-size:19px">
<li><b>-Xmx below the limit</b>: the JVM fails politely — exception, stack trace, exit 1, heap dump possible</li>
<li><b>-Xmx above the limit</b>: the kernel kills it silently — <b>no Java log at all</b></li>
</ul>`, 'r46') },

  /* 17 */
  { t: 'Node.js memory: heap limit and memoryUsage()', giua: true, body: `
${term(`$ cat /sys/fs/cgroup/memory.max
536870912
$ node -e '… v8.getHeapStatistics().heap_size_limit … process.constrainedMemory() … os.totalmem() …'
heap_size_limit 259 MB, constrainedMemory 512 MB, os.totalmem 7934 MB
$ node --max-old-space-size=64 -e '…'
with --max-old-space-size=64: heap_size_limit 67 MB
$ node _bo-nho.js
start                      rss   40  heapTotal    5  heapUsed    3  external    1  arrayBuffers    0
1 000 000 JS objects       rss  136  heapTotal   87  heapUsed   84  external    1  arrayBuffers    0
+ Buffer.alloc(200 MB)     rss  334  heapTotal   86  heapUsed   81  external  201  arrayBuffers  200`, { title: 'node-heap.sh · docker --memory 512m · 🎲 one real run (node -e bodies shortened)', hl: [4, 6, 10] })}
${cards([
    ['heap_size_limit', 'Node 22 read the cgroup: <b>259 MB</b> for a 512 MiB container (2096 MB with no limit on this VM). <code class="i">--max-old-space-size</code> sets the old space in MB.'],
    ['heapUsed vs rss', '<b>heapUsed</b> = live JS objects. <b>rss</b> = everything: heap + code + <b>Buffers</b> + native addons. The container limit sees <b>rss</b>.'],
    ['external / arrayBuffers', 'A <code class="i">Buffer</code> lives <b>outside</b> the V8 heap: 200 MB here did not move heapUsed. Big uploads, images, sharp: watch rss.'],
  ])}` },

  /* 18 */
  { t: '“JavaScript heap out of memory”: exit 134', giua: true, body: two(
    `${js(`const cache = new Map();   // never cleaned
let req = 0;
setInterval(() => {
  for (let i = 0; i < 2000; i++, req++)
    cache.set(\`req-\${req}\`,
              'x'.repeat(1000) + req);
  // … log every 20 000 requests
}, 1);`, { hl: [1] })}
${box('Exit codes are 128 + signal', '<b>134</b> = 128 + 6 = <b>SIGABRT</b>: V8 aborted the process itself. <b>137</b> = 128 + 9 = <b>SIGKILL</b>: the kernel did it. Different culprit, different fix.', 'lam')}`,
    `${term(`$ node --max-old-space-size=32 _ro.js 2>&1 | … | tail -9
requests 20000, heapUsed 14 MB
requests 40000, heapUsed 24 MB
requests 60000, heapUsed 34 MB
<--- Last few GCs --->
[9:0xffffac100000]  73 ms: Mark-Compact 23.2 (52.9) -> 22.0 (56.0) MB …
[9:0xffffac100000] 123 ms: Mark-Compact 35.7 (56.0) -> 33.5 (67.6) MB …
<--- JS stacktrace --->
FATAL ERROR: Reached heap limit Allocation failed
             - JavaScript heap out of memory
----- Native stack trace -----
exit code: 134`, { title: 'node-oom.sh · 🎲 one real run (long lines cut or wrapped, native frames filtered)', hl: [9, 10, 12] })}
<ul style="font-size:19px">
<li>Mark-Compact after Mark-Compact frees almost nothing → V8 gives up</li>
<li>Raising <code class="i">--max-old-space-size</code> helps a <b>big build</b>; it only delays a <b>leak</b></li>
</ul>`, 'r46') },

  /* 19 */
  { t: '137, 134 or 1? Read the exit code first', giua: true, body: `
<table class="t" style="font-size:18px">
<tr><th style="width:17%">Exit code</th><th style="width:24%">Who stopped it</th><th>What you see</th><th style="width:28%">Where to look</th></tr>
<tr><td><b class="do">137</b> (128+9)</td><td>the <b>kernel</b>: SIGKILL from the OOM killer</td><td>nothing from the app; <code class="i">Killed</code>; container restarts</td><td><code class="i">docker inspect … OOMKilled</code>, <code class="i">memory.events</code>, <code class="i">dmesg</code></td></tr>
<tr><td><b class="do">134</b> (128+6)</td><td><b>V8</b> aborts: JS heap limit</td><td><code class="i">FATAL ERROR: … JavaScript heap out of memory</code></td><td>stderr; heapUsed over time</td></tr>
<tr><td><b class="do">1</b></td><td>the <b>JVM</b>: uncaught OutOfMemoryError</td><td><code class="i">java.lang.OutOfMemoryError: Java heap space</code> + stack</td><td>GC log; a heap dump (<code class="i">HeapDumpOnOutOfMemoryError</code>)</td></tr>
<tr><td>— (NULL)</td><td><b>malloc</b> fails: ENOMEM</td><td><code class="i">Cannot allocate memory</code></td><td>mode 2 overcommit, <code class="i">ulimit -v</code> — rare</td></tr>
</table>
${two(box('Exit 137 is not always memory', 'It only says <b>SIGKILL</b>. <code class="i">docker kill</code>, a <code class="i">docker stop</code> that timed out, a watchdog — all give 137. Confirm with <code class="i">OOMKilled=true</code> or <code class="i">oom_kill</code> in <code class="i">memory.events</code>.', 'do2'),
    box('Make the polite ending happen', 'Keep the runtime limit <b>below</b> the container limit (heap 50–75 %). Then a leak ends as an exception with a stack trace, not as a silent kill.', 'xanh'))}` },

  /* 20 */
  { t: 'A memory leak, measured', giua: true, body: two(
    `${js(`const leaky = new Map();     // BUG: never cleaned
function handleLeaky(id) {
  leaky.set(id, { id, html: page() });   // ~1 KB
}
const MAX = 1000;              // FIX: bounded LRU
function handleLru(id) {
  lru.delete(id); lru.set(id, { id, html: page() });
  if (lru.size > MAX) lru.delete(lru.keys().next().value);
}`, { hl: [1, 8] })}
${out(`requests | leaky Map: heap MB | LRU(1000): heap MB
    5000 |                  6 |                  1
   25000 |                 27 |                  1
   50000 |                 55 |                  1`, { title: 'ro-ri-node.js · node --expose-gc · 🎲 (rows trimmed)', hl: [4] })}`,
    `${leakChart()}
<ul style="font-size:19px">
<li>Measure <b>after a GC</b>: a straight line that never comes down = leak; a curve that flattens = a warm cache</li>
<li>Common leaks: maps keyed by user/request, listeners never removed, closures holding big objects, unbounded queues</li>
</ul>`) },

  /* 21 */
  { t: 'Finding the leak: class histogram and heap dumps', giua: true, body: two(
    `${java(`record Session(String user, byte[] data) { }
static final Map<String, Session> SESSIONS =
        new HashMap<>();                  // BUG
static void handle(int req) {   // on login...
    String user = "user-" + req;
    SESSIONS.put(user,                   // ...never removed
        new Session(user, new byte[1000]));
}`, { hl: [2, 6] })}
${out(`requests | used heap after GC, MB
   10000 |    11
   20000 |    22
   30000 |    33
   40000 |    43
   50000 |    55`, { title: 'RoRiJava.java · 🎲 one real run' })}`,
    `${term(`$ jcmd <pid> GC.class_histogram | head
 num  #instances    #bytes  class name (module)
--------------------------------------------------
   1:     109606  52830800  [B (java.base@21.0.12.1)
   2:      52440   1678080  java.util.HashMap$Node
   3:      59487   1427688  java.lang.String
   4:      50000   1200000  RoRiJava$Session
   5:       1160    785680  [Ljdk.internal.vm.FillerElement;`, { title: 'printed by RoRiJava.java itself (columns shortened)', hl: [7] })}
<table class="t" style="font-size:17px">
<tr><th>Runtime</th><th>Quick look</th><th>Full evidence</th></tr>
<tr><td>Java</td><td><code class="i">jcmd PID GC.class_histogram</code></td><td><code class="i">jcmd PID GC.heap_dump f.hprof</code> → Eclipse MAT</td></tr>
<tr><td>Node</td><td><code class="i">process.memoryUsage()</code> over time</td><td><code class="i">--heapsnapshot-signal=SIGUSR2</code>, <code class="i">v8.writeHeapSnapshot()</code> → Chrome DevTools</td></tr>
</table>
<p style="font-size:19px;margin:0">Exactly <b>50 000</b> Session objects after 50 000 requests: the count that matches the request count is your suspect.</p>`) },

  /* 22 */
  { t: 'mmap: private vs shared mappings', giua: true, body: two(
    `${C(`char *priv = mmap(NULL, 4096, PROT_READ|PROT_WRITE,
                  MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);
char *shar = mmap(NULL, 4096, PROT_READ|PROT_WRITE,
                  MAP_SHARED|MAP_ANONYMOUS, -1, 0);
strcpy(priv, "parent's text");
strcpy(shar, "parent's text");
/* child_writes() = fork, then strcpy in the child */
child_writes(priv, "child wrote here");
child_writes(shar, "child wrote here");
int fd = shm_open("/orders-cache",
                  O_CREAT | O_RDWR, 0600);
ftruncate(fd, 8 << 20);
char *m = mmap(NULL, 8 << 20, PROT_READ|PROT_WRITE,
               MAP_SHARED, fd, 0);`, { hl: [2, 4, 10] })}
${out(`MAP_PRIVATE: parent reads "parent's text"
MAP_SHARED : parent reads "child wrote here"
shm_open + mmap: 8 MiB written, now visible as a file:
  8388608 orders-cache
  /dev/shm size 64M used 8.0M`, { title: 'mmap-chia-se.c', hl: [1, 2] })}`,
    `<ul style="font-size:20px">
<li><b>MAP_PRIVATE</b>: copy-on-write — the child’s write made a private copy (slide 6)</li>
<li><b>MAP_SHARED</b>: one set of frames for everyone — the fastest IPC there is</li>
<li><b>File mappings</b>: your program’s code and every <code class="i">.so</code> are mmapped files → that is <b>RssFile</b></li>
<li><code class="i">shm_open</code> creates a file in <b>/dev/shm</b> (a <b>tmpfs</b> = files that live in RAM)</li>
<li>Who uses it: <b>PostgreSQL</b> (shared buffers + parallel queries), Chrome, Python <code class="i">multiprocessing</code></li>
</ul>`) },

  /* 23 */
  { t: '/dev/shm in Docker: 64 MiB, and PostgreSQL notices', giua: true, body: two(
    `${term(`$ df -h /dev/shm
Filesystem      Size  Used Avail Use% Mounted on
shm              64M     0   64M   0% /dev/shm
$ dd if=/dev/zero of=/dev/shm/segment bs=1M count=100
dd: error writing '/dev/shm/segment': No space left on device
exit code: 1`, { title: 'shm-64.sh — docker run (default)', hl: [5] })}
${term(`$ df -h /dev/shm
shm             256M     0  256M   0% /dev/shm
$ dd if=/dev/zero of=/dev/shm/segment bs=1M count=100
exit code: 0
$ grep -E '^shmem ' /sys/fs/cgroup/memory.stat
shmem 104857600`, { title: 'shm-256.sh — docker run --shm-size 256m', hl: [4, 6] })}`,
    `<ul style="font-size:20px">
<li>PostgreSQL puts parallel-query and index-build memory in <b>/dev/shm</b>. At 64 MiB it fails with<br><code class="i">could not resize shared memory segment … No space left on device</code></li>
<li>Fix: <code class="i">--shm-size 256m</code>, compose <code class="i">shm_size: 256mb</code>, Kubernetes an <code class="i">emptyDir</code> with <code class="i">medium: Memory</code></li>
<li>The 100 MiB shows up as <b>shmem</b> in the cgroup: /dev/shm is <b>RAM</b>, counted against <code class="i">memory.max</code> — and <b>not</b> reclaimable</li>
</ul>
${box('This repo, 26 Oct 2026', '<code class="i">docker-compose.yml</code> → postgres: <code class="i">shm_size: 256mb</code> after HNSW index builds (pgvector) hit the 64 MB default.', 'xanh')}`) },

  /* 24 */
  { t: 'Traps', giua: true, body: vsd(`<ul style="font-size:19px">
<li>“VSZ is 480 MB, Node uses 480 MB” — VSZ counts <b>reserved</b> addresses</li>
<li>“free is 200 MB, the server is out of RAM” — look at <b>available</b></li>
<li>Adding up the RSS of 20 forked workers</li>
<li>“malloc returned non-NULL, so the memory is mine”</li>
<li><code class="i">-Xmx</code> equal to the container limit</li>
<li>Reading <code class="i">free</code> inside a container to size the app</li>
<li>Fixing a leak by raising <code class="i">--max-old-space-size</code></li>
<li>Every 137 = “memory”</li>
</ul>`, `<ul style="font-size:19px">
<li>Trust <b>RSS</b> for one process, <b>PSS</b> for a group</li>
<li><b>available</b> already counts cache the kernel can drop</li>
<li>Sum <b>PSS</b>, or read the cgroup’s <code class="i">memory.current</code></li>
<li>Pages are given at <b>first touch</b>; the bill is a SIGKILL later</li>
<li>Heap <b>50–75 %</b> of the limit — threads, code, buffers live outside</li>
<li>Read <code class="i">/sys/fs/cgroup/memory.max</code></li>
<li>Measure heapUsed after GC; a line that never falls = leak</li>
<li>Confirm with <code class="i">OOMKilled</code> / <code class="i">memory.events</code></li>
</ul>`) },

  /* 25 */
  { t: '🧭 On the real server: cuongthai.com and its exit codes', body: `
${repoTL()}
${two(`<ul style="font-size:18px">
<li><b>06–07 Jul</b>: 6 GB VPS, live stack running; backend and frontend images built <b>in parallel</b> with a cold cache ⇒ <code class="i">next build</code> <b>137</b>. Fix in <code class="i">deploy.sh</code>: build <b>one image at a time</b> (CS.6)</li>
<li><b>Backend</b>: compose limit <b>2G</b>, <code class="i">--max-old-space-size=1536</code> ≈ <b>75 %</b>, the rest for buffers, sharp, an ONNX model (Dockerfile.backend)</li>
</ul>`, `<ul style="font-size:18px">
<li><code class="i">next build</code> hit <b>134</b> three times as the app grew: heap 3072 → 4096 → 6144 → <b>12288 MB</b>, built on a 31 GB home machine (<code class="i">deploy-nha.sh</code>); <code class="i">tsc</code> once (22 Oct)</li>
<li><b>Limits sum to 9.5 GB</b> on an 8 GB VPS (postgres 2G, backend 2G, frontend 2G, tts 2.5G, redis 512M, …): limits are <b>ceilings, not reservations</b> — overcommit again</li>
</ul>`)}
${box('What the repo learned — copy it', '<b>1.</b> One heavy job at a time on a small box. <b>2.</b> Runtime heap ≈ 75 % of the container limit; raise <b>both</b> together. <b>3.</b> Move big builds off the production machine. <b>4.</b> Read the exit code first: 137 → RAM / cgroup, 134 → heap flag, ENOSPC → disk.', 'xanh')}` },

  /* 26 */
  { t: '🎤 Interview questions you will be asked', to: true, giua: true, body: cards([
    ['VSZ vs RSS vs PSS?', 'VSZ: all mapped virtual memory. RSS: pages now in RAM, shared ones counted fully. PSS: shared pages divided among the sharers — the honest sum.'],
    ['free shows 100 MB free. Problem?', 'Usually not: look at available. Linux uses spare RAM as page cache and drops it on demand.'],
    ['What is overcommit?', 'The kernel grants address space beyond RAM + swap, betting most is never touched. Modes 0/1/2. The bill: an OOM kill at page-fault time.'],
    ['How does the OOM killer choose?', 'Highest badness: RSS + swap + page tables, plus oom_score_adj. Within a cgroup only its own tasks. SIGKILL ⇒ exit 137.'],
    ['Java app in a 1 GB container keeps dying with 137. Fix?', 'Heap + native exceeded the limit. Use MaxRAMPercentage ≈ 60–75, check NMT, direct buffers, thread count; get a GC log.'],
    ['How do you find a memory leak?', 'Heap after GC over time; a rising line = leak. Then a histogram or heap dump: the class whose count grows with requests.'],
  ], 3) },

  /* 27 */
  { t: 'Check yourself', giua: true, to: true, body: `
<ol>
<li>Three workers forked from one parent each show RSS 300 MB in <code class="i">ps</code>. Can you conclude they use 900 MB?</li>
<li>A container has <code class="i">--memory 1g</code> and runs <code class="i">java -Xmx1g</code>. What happens when the heap fills up, and what exit code do you expect?</li>
<li>A Node API exits with <b>134</b> after six hours. Name the message you will find in its logs and the first thing you measure.</li>
</ol>
${box('Answers', '1) No — shared pages are counted in each RSS; sum the <b>PSS</b> (or read the cgroup’s memory.current). 2) Heap + native passes 1 GiB before the heap is “full”: the kernel kills it, <b>137</b>, no Java error. Use MaxRAMPercentage ≈ 75. 3) <code class="i">FATAL ERROR: … JavaScript heap out of memory</code>; measure heapUsed after GC over time — a straight rising line is a leak.', 'xanh')}` },

  /* 28 */
  { t: 'Summary', giua: true, body: `
<div style="font-size:26px">
<ul>
<li><b>VSZ</b> = promised, <b>RSS</b> = in RAM, <b>PSS</b> = fair share; pages arrive at <b>first touch</b></li>
<li><code class="i">free</code>: watch <b>available</b>; page cache is RAM on loan, file pages are reclaimable, anon needs swap</li>
<li><b>Overcommit</b>: malloc rarely fails; the bill is the <b>OOM killer</b> — highest score, SIGKILL, <b>137</b></li>
<li>Runtimes: JVM heap 25 % by default → set <b>MaxRAMPercentage</b>; Node heap follows the cgroup; native lives outside</li>
<li><b>137</b> kernel · <b>134</b> V8 · <b>1</b> JVM exception; leaks = a line that never falls after GC</li>
<li><b>mmap</b> private/shared, <b>/dev/shm</b> is RAM — 64 MiB in Docker</li>
</ul></div>
${box('Next', '<b>CS.6 — Containers = namespaces + cgroups</b>: how <code class="i">memory.max</code>, <code class="i">pids.max</code> and <code class="i">cpu.max</code> are enforced — the walls around everything you measured here.', 'lam')}` },
]);
