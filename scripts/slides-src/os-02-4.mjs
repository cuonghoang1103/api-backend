/**
 * os-02-4 — khoá "Operating Systems for Developers", bài 2.4 "Disk full and slow I/O" (28/10/2026).
 * Khuôn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Output đọc THẲNG từ lab/out/c24-disk, c24-pg, c24-host,
 * c21-triage (chạy thật: loop ext4 64/96 MB trong container vứt đi; Postgres 17; Mac chỉ đọc) qua grab() — không chép tay.
 * Giảng: giang/os-02-4.mjs (walk()).
 */
import { lamDeck, sh, two as two0, box } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-02-4', code: 'OS 2.4', title: 'Disk full and slow I/O', sub: 'Operating Systems · Chapter 2' };

const cut = (t, n) => t.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const gd = (pre, n = 1, w = 200, o) => cut(grab('c24-disk', pre, n, o), w);
const gp = (pre, n = 1, w = 200, o) => cut(grab('c24-pg', pre, n, o), w);
const gh = (pre, n = 1, w = 200, o) => cut(grab('c24-host', pre, n, o), w);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', BR = '#b85a2b', GR = '#2f7d4f', GY = '#8a8a8a', RD = '#c0392b';
const MK = `<defs>${[['r', RD], ['g', GY], ['k', '#333']].map(([k, c]) => `<marker id="m24${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join('')}</defs>`;
const incident = (rows) => `<table class="t" style="font-size:21px">${rows.map(([k, v]) => `<tr><th style="width:140px">${k}</th><td>${v}</td></tr>`).join('')}</table>`;

/* Slide 5: năm lần đĩa VPS đầy, mỗi lần một bài học. */
const timeline = () => {
  const ev = [
    ['03/07', '100% · 39 GB', 'Postgres stuck in recovery; prune -af (no --volumes)'],
    ['12/07', '86% → 100%', 'next build ENOSPC on its cache; prod survived'],
    ['18/08', 'cache 7.6 GB', 'disk fell to 1.8 GB mid-build → builds moved home'],
    ['27/08', '509 MB left', 'old images TAGGED by SHA: image prune -f skips them'],
    ['05/09', '97% · 1.6 GB', 'weekly job "green", freed 0 B: 40 tagged images'],
  ];
  let s = `<svg viewBox="0 0 1110 270" width="1110" height="270" font-family="Arial">`;
  s += `<line x1="40" y1="60" x2="1070" y2="60" stroke="${GY}" stroke-width="4"/>`;
  ev.forEach(([d, n, l], i) => {
    const x = 40 + i * 218;
    s += `<circle cx="${x + 92}" cy="60" r="12" fill="${i === 0 ? RD : OR}"/>` + T(x + 92, 36, d, 22, { a: 'middle', w: 800, f: i === 0 ? RD : BR });
    s += R(x, 90, 186, 170, i === 0 ? '#fdf0ee' : '#fff7ef', i === 0 ? RD : OR);
    s += T(x + 93, 124, n, 19, { a: 'middle', w: 800 });
    // chữ chia dòng ~20 ký tự
    const words = l.split(' '); const lines = []; let cur = '';
    words.forEach((w) => { if ((cur + ' ' + w).trim().length > 19) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; });
    lines.push(cur.trim());
    lines.forEach((ln, j) => { s += T(x + 93, 164 + j * 28, ln, 18, { a: 'middle', f: '#444' }); });
  });
  return s + '</svg>';
};

/* Slide 8: chuỗi sập của Postgres khi đĩa đầy. */
const panicChain = () => {
  const st = [
    ['INSERT', 'could not extend file', OR],
    ['checkpoint', 'PANIC: could not write', RD],
    ['postmaster', 'kills all backends', RD],
    ['recovery', 'FATAL: xlogtemp', RD],
    ['shut down', 'Restarting (1) …', GY],
  ];
  let s = `<svg viewBox="0 0 1110 196" width="1110" height="196" font-family="Arial">${MK}`;
  st.forEach(([a, b, c], i) => {
    const x = 6 + i * 222;
    s += R(x, 20, 186, 110, c + '18', c, { sw: 2.5 });
    s += T(x + 93, 66, a, 22, { a: 'middle', w: 800, f: c });
    s += T(x + 93, 98, b, 16, { a: 'middle', f: '#333' });
    if (i < st.length - 1) s += `<line x1="${x + 188}" y1="75" x2="${x + 220}" y2="75" stroke="#333" stroke-width="3" marker-end="url(#m24k)"/>`;
  });
  s += `<path d="M1070,132 C1070,170 625,170 625,138" fill="none" stroke="${GY}" stroke-width="2.5" stroke-dasharray="7 5" marker-end="url(#m24g)"/>`;
  s += T(848, 186, 'docker restarts it → same failure, again and again', 17, { a: 'middle', f: '#555', w: 700 });
  return s + '</svg>';
};

/* Slide 11: Docker.raw — kích thước biểu kiến vs khối thật. */
const sparse = () => {
  let s = `<svg viewBox="0 0 1110 150" width="1110" height="150" font-family="Arial">`;
  const W = 900, max = 926;
  s += T(180, 50, 'ls -lh (apparent)', 20, { a: 'end', w: 700 }) + R(195, 22, W, 42, '#f2f2f2', GY, { dash: 1 }) + T(195 + W - 12, 51, '926 GB', 21, { a: 'end', w: 800, f: '#444' });
  s += T(180, 118, 'du -h (real blocks)', 20, { a: 'end', w: 700 }) + R(195, 90, (47 / max) * W, 42, BL + '33', BL) + T(195 + (47 / max) * W + 12, 119, '47 GB — the Mac has only 39 GB free', 21, { w: 800, f: BL });
  return s + '</svg>';
};

/* Slide 13: df vs du khi file đã xoá còn mở. */
const dfDu = () => {
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">${MK}`;
  // thư mục (tên) và inode
  s += R(30, 30, 260, 70, '#f2f2f2', GY, { dash: 1 }) + T(160, 60, 'name app.log', 20, { a: 'middle', w: 700, f: '#777' }) + T(160, 86, 'removed by rm', 17, { a: 'middle', f: RD, w: 700 });
  s += R(430, 60, 260, 110, BL + '1f', BL, { sw: 2.5 }) + T(560, 100, 'inode 14 · 30 MB', 21, { a: 'middle', w: 800, f: BL }) + T(560, 130, 'blocks still allocated', 17, { a: 'middle', f: BL });
  s += R(30, 140, 260, 70, OR + '22', OR) + T(160, 170, 'python3 fd 3', 20, { a: 'middle', w: 800, f: BR }) + T(160, 196, 'still open (3w)', 17, { a: 'middle', f: BR });
  s += `<line x1="292" y1="66" x2="426" y2="96" stroke="${GY}" stroke-width="3" stroke-dasharray="6 5"/>` + T(355, 66, '✗', 26, { a: 'middle', f: RD, w: 800 });
  s += `<line x1="292" y1="174" x2="426" y2="140" stroke="${OR}" stroke-width="3" marker-end="url(#m24k)"/>`;
  s += T(760, 80, 'df counts blocks → 31M used', 21, { w: 800, f: BL }) + T(760, 116, 'du walks names → 4.0K', 21, { w: 800, f: '#555' }) + T(760, 152, 'lsof +L1 → NLINK 0', 21, { w: 800, f: BR });
  return s + '</svg>';
};

/* Slide 15: inode vs khối — 15% byte, 100% inode. */
const inodes = () => {
  let s = `<svg viewBox="0 0 1110 140" width="1110" height="140" font-family="Arial">`;
  const W = 820;
  s += T(230, 46, 'bytes (df -h)', 21, { a: 'end', w: 700 }) + R(245, 20, W, 40, '#f2f2f2', GY) + R(245, 20, W * 0.15, 40, GR + '44', GR) + T(245 + W * 0.15 + 12, 48, '15% used (8.2M of 60M)', 20, { w: 800, f: GR });
  s += T(230, 110, 'inodes (df -i)', 21, { a: 'end', w: 700 }) + R(245, 84, W, 40, RD + '33', RD) + T(245 + W / 2, 112, '100% — 2 048 of 2 048: no new file possible', 20, { a: 'middle', w: 800, f: RD });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 2 — Observing Linux', bai: '2.4',
}, [
  { cover: true, t: 'Disk full and slow I/O', sub: 'df, du, inodes, lsof —<br>and the night Postgres died' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read <b>df -h</b>, <b>df -i</b> and the 5% that ext4 keeps for root</li>
<li>Replay the incident: <b>build cache fills the disk, Postgres dies</b></li>
<li>Why the dev Mac filled up — and Docker's <b>926 GB</b> file</li>
<li>Three disk-full disguises: <b>du</b>, <b>deleted-but-open</b>, <b>inodes</b></li>
<li>Slow disks: <b>await</b> and <b>aqu-sz</b> in iostat</li>
</ul>
${box('Safe by construction', 'Every disk filled here is a 64–96 MB ext4 file on a loop device inside a throw-away container — never a real disk.', 'lam')}` },

  { t: 'df: space, inodes, and the 5% kept for root', giua: true, body: two(
    term(gd('df -h /mnt/vps', 3)),
    `<ul style="font-size:22px">
<li>64 MB file → <b>Size 60M</b> (metadata), <b>Avail 55M</b></li>
<li><b>819 × 4 KB</b> reserved: root can still log in and clean up</li>
<li>A database running as <code class="i">postgres</code> hits "no space" a few % <b>before</b> root does</li>
<li><code class="i">df -i</code>: <b>inodes</b>, one per file — here only 2 048</li>
</ul>`, 'r64') },

  { t: 'Incident: build cache fills the disk, Postgres dies', giua: true, body: incident([
    ['Symptom', '03/07/2026: deploy fails with <b>no space left on device</b>; every DB route returns 500 (<code class="i">the database system is not yet accepting connections</code>); the homepage still returns 200.'],
    ['Measure', '<code class="i">df -h /</code>: 39G 38G 0 <b>100%</b> · <code class="i">docker system df</code>: images ≈ 19 GB, build cache ≈ 4.5 GB · postgres <b>Up (unhealthy)</b>.'],
    ['Cause', 'Postgres shares the root disk with /var/lib/docker; images and cache grew every deploy; Postgres could not write WAL and could not finish recovery.'],
    ['Fix', '<code class="i">docker system prune -af</code> + <code class="i">builder prune -af</code> (~10 GB, never <code class="i">--volumes</code>) · restart Postgres → healthy in &lt; 1 min.'],
    ['Prevent', 'Weekly cleanup by <b>free space</b>, keep 3 tagged images · builds off the VPS · alert at 85%.'],
  ]) },

  { t: 'It came back four more times — each with a new lesson', giua: true, body: `
${timeline()}
${box('The common thread', 'Disk is shared by everything on the box. Anything that grows with every deploy — images, cache, logs — needs a cleanup that is <b>checked against free space</b>, not just "ran green".', 'do2')}` },

  { t: 'Replay: Postgres and a build cache on one 96 MB disk', giua: true, body: `
${term(gp('docker exec os-c24-pg df -h'))}
${term(gp("docker exec os-c24-pg psql -U postgres -qc", 1, 110))}
${term(gp("docker exec os-c24-pg bash -c 'mkdir", 1, 110))}` },

  { t: 'Writes fail first: could not extend file', giua: true, body: `
${term(gp('docker exec os-c24-pg psql -U postgres -c "insert into orders(note) select', 2, 120))}
${box('The app starts failing on every write', 'Each INSERT gets <b>could not extend file … No space left on device</b>. The server itself is still up — the crash comes at the next checkpoint, when Postgres must write and cannot.', 'do2')}` },

  { t: 'Then a checkpoint PANICs and recovery cannot finish', giua: true, body: `
${panicChain()}
${term(gp('sleep 4', 2, 118))}` },

  { t: 'Free rebuildable space: Postgres recovers, no row lost', giua: true, body: `
${term(gp('docker stop os-c24-pg', 1, 118).split('\n').slice(1).join('\n'), { title: 'stop the crash loop, then look inside the disk' })}
${term(gp('docker start os-c24-pg', 3, 118))}
<p style="margin:0;font-size:21px">The space must come from <b>rebuildable</b> things — cache, old images, old logs. Never delete files in the database directory, never prune <code class="i">--volumes</code>.</p>` },

  { t: 'docker system df: size vs reclaimable', giua: true, body: `
${sh(gh('docker system df'))}
<table class="t" style="font-size:22px">
<tr><th style="width:24%">Column</th><th>Meaning</th></tr>
<tr><td><b>SIZE</b></td><td>space each kind of object uses</td></tr>
<tr><td><b>ACTIVE</b></td><td>how many are in use by a container</td></tr>
<tr><td><b>RECLAIMABLE</b></td><td>not used by anything now — prune candidates (but volumes may hold databases)</td></tr>
</table>` },

  { t: 'Docker’s disk on the Mac: a 926 GB sparse file', giua: true, body: `
${term(gh('df -h') + '\n' + gh('ls -lh', 2, 112))}
${sparse()}
<p style="margin:0;font-size:20px">October 2026: <b>ENOSPC</b> on 27/10, Docker Desktop hung on 28/10. Culprits found that month: 235 compressed videos (≈ 25 GB), ~12 GB render bundles in <code class="i">$TMPDIR</code>, a 109 GB webpack cache.</p>` },

  { t: 'du finds who uses the space', to: true, giua: true, body: two(
    sh(gd('du -xh --max-depth=1')) + sh(grab('c27-mac', 'du -sh frontend'), { title: 'the same idea on the dev Mac (lesson 2.7)' }),
    `<ul style="font-size:24px">
<li><code class="i">-x</code> stay on one filesystem</li>
<li><code class="i">--max-depth=1</code> one line per folder</li>
<li><code class="i">sort -h</code> understands K/M/G</li>
<li>Descend into the biggest, repeat</li>
<li><code class="i">ncdu -x /</code> does it interactively — install it <b>before</b> the disk is full</li>
</ul>`) },

  { t: 'Deleted but still open: df says 31M, du says 4K', giua: true, body: `
${dfDu()}
${term(gd('rm /mnt/vps/log/app.log', 3, 118))}` },

  { t: 'Truncate through /proc/PID/fd: space back, no restart', giua: true, body: `
${term(gd('ls -l /proc', 2, 118))}
${box('Name and descriptor', 'A file is freed when its last <b>name</b> and its last <b>open fd</b> are gone. Truncating a live log (<code>truncate -s 0</code>, <code>: &gt; file</code>) beats <code>rm</code> — the VPS cleanup job truncates container logs for exactly this reason.', 'xanh')}` },

  { t: '"No space left" with 85% free: the inodes ran out', giua: true, body: `
${inodes()}
${term(gd('mkdir /mnt/vps/sessions', 4, 118) + '\n' + gd('for d in /mnt/vps', 1, 118))}` },

  { t: 'Cheat sheet — disks on a live system', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:38%">Symptom</th><th>Run</th></tr>
<tr><td>Disk full</td><td><code class="i">df -h</code> → <code class="i">du -xh --max-depth=1 / | sort -h</code> · <code class="i">docker system df</code></td></tr>
<tr><td>df ≫ du after deleting</td><td><code class="i">lsof +L1</code> → <code class="i">: &gt; /proc/PID/fd/N</code></td></tr>
<tr><td>"No space" but df has room</td><td><code class="i">df -i</code> → count files per folder</td></tr>
<tr><td>Disk slow</td><td><code class="i">iostat -dxz 1</code> (await, aqu-sz) · <code class="i">pidstat -d 1</code></td></tr>
</table>
${term(grab('c21-triage', 'iostat -dxyz').split('\n').slice(1).join('\n'), { title: 'iostat from lesson 2.1: 175 ms per write, 27 requests queued' })}
${box('Never to free space', '<code>docker system prune --volumes</code> · deleting files in the database directory · <code>rm</code> on a live log.', 'do2')}` },
]);
