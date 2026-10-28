/**
 * os-09-3 — khoá "Operating Systems for Developers", bài 9.3 "write() is not on disk: buffering, fsync, O_DIRECT,
 * atomic rename" (28/10/2026). Khuôn _pg-chung.mjs. Output + số đo đọc THẲNG từ lab/out/c93-fsync.out.txt qua grab();
 * biểu đồ cột lấy số từ chính lượt wbench đầu tiên. Giảng: giang/os-09-3.mjs.
 */
import { lamDeck, sh, box, cards, vsd, steps, sql, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';
import fs from 'node:fs';

export const deck = { key: 'os-09-3', code: 'OS 9.3', title: 'write() is not on disk', sub: 'Operating Systems · Chapter 9' };

const g = (pre, n = 1) => grab('c93-fsync', pre, n);
const SRC = (f) => fs.readFileSync(new URL(`../../content/courses/operating-systems-for-developers/lab/code/ch09/${f}`, import.meta.url), 'utf8');
const wrap = (t, max = 104) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 13.5) => sh(wrap(t, Math.round(104 * 13 / fs)), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const A = (x1, y1, x2, y2, c, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="6 5"' : ''} marker-end="url(#ar${c.slice(1)})"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', GY = '#8a8a8a', PU = '#7b4fa0';
const mk = (m) => `<marker id="ar${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const svg = (w, h, inner, sc = 1) => `<svg viewBox="0 0 ${w} ${h}" width="${Math.round(w * sc)}" height="${Math.round(h * sc)}" font-family="Arial" style="display:block;margin:0 auto"><defs>${[BL, GR, RD, OR, GY, PU].map(mk).join('')}</defs>${inner}</svg>`;

/* đường đi của một lần write() */
const pathSvg = () => {
  let s = '';
  s += R(20, 40, 230, 110, BL + '12', BL) + T(135, 82, 'your app', 22, { a: 'middle', w: 800, f: BL }) + T(135, 112, 'write() returns', 17, { a: 'middle' }) + T(135, 136, 'after a memory copy', 17, { a: 'middle', f: '#555' });
  s += A(252, 95, 362, 95, BL);
  s += R(366, 30, 330, 130, OR + '14', OR) + T(531, 70, 'page cache', 22, { a: 'middle', w: 800, f: OR }) + T(531, 100, 'pages marked DIRTY', 17, { a: 'middle', m: 1 }) + T(531, 128, '“newer than the disk”', 17, { a: 'middle', f: '#555' });
  s += A(698, 95, 836, 95, GR) + T(767, 78, 'writeback', 16, { a: 'middle', w: 700, f: GR });
  s += R(840, 40, 250, 110, GR + '12', GR) + T(965, 82, 'the device', 22, { a: 'middle', w: 800, f: GR }) + T(965, 112, 'survives power loss', 17, { a: 'middle' }) + T(965, 136, '(after its cache flush)', 16, { a: 'middle', f: '#555' });
  s += `<path d="M135,152 C135,300 965,300 965,152" fill="none" stroke="${RD}" stroke-width="2.5" stroke-dasharray="7 5" marker-end="url(#ar${RD.slice(1)})"/>` + T(550, 300, 'fsync() / fdatasync(): wait until it is on the device', 18, { a: 'middle', w: 800, f: RD });
  const k = [['flusher wakes every', 'dirty_writeback_centisecs = 15 s here (kernel default 5 s)'], ['writes pages dirty longer than', 'dirty_expire_centisecs = 30 s'], ['starts early above', 'dirty_background_ratio = 10% of RAM'], ['makes writers WAIT above', 'dirty_ratio = 20% of RAM']];
  k.forEach(([a, b], i) => { s += T(40, 352 + i * 34, a, 18, { w: 700, f: '#444' }) + T(380, 352 + i * 34, b, 18, { m: 1 }); });
  return svg(1110, 470, s);
};

/* cột: µs mỗi lần ghi, thang log, lượt wbench đầu tiên */
const barSvg = () => {
  const rows = g('./wbench /srv/data/bench.dat 2000').split('\n').filter((l) => /writes/.test(l)).map((l) => { const p = l.trim().split(/ +/); return [p[0], +p[p.length - 2]]; });
  const X = 230, W = 820, lo = Math.log10(1), hi = Math.log10(20000), sx = (v) => X + (Math.log10(v) - lo) / (hi - lo) * W;
  let s = '';
  [1, 10, 100, 1000, 10000].forEach((v) => { s += `<line x1="${sx(v)}" y1="20" x2="${sx(v)}" y2="${30 + rows.length * 58}" stroke="#ddd"/>` + T(sx(v), 18, v >= 1000 ? `${v / 1000} ms` : `${v} µs`, 15, { a: 'middle', f: '#888' }); });
  rows.forEach(([n, v], i) => {
    const y = 34 + i * 58, c = n === 'buffered' ? GR : n === 'O_DIRECT' ? OR : RD;
    s += T(X - 12, y + 30, n, 19, { a: 'end', m: 1, w: 700 }) + R(X, y + 8, sx(v) - X, 34, c + '33', c, { rx: 3 }) + T(sx(v) + 10, y + 32, `${v} µs`, 19, { w: 800, f: c });
  });
  s += T(X, 34 + rows.length * 58 + 16, '2,000 × 4 KiB writes to ext4, µs per write, log scale — first run of wbench (three more runs: same shape)', 15, { f: '#777' });
  return svg(1110, 34 + rows.length * 58 + 26, s);
};

/* dòng thời gian "rút điện" */
const crashSvg = () => {
  const L = g('echo "order #1001 paid"', 3).split('\n').filter((l) => /after crash/.test(l)).map((l) => l.replace(/^ *after crash: orders.log +/, ''));
  const X = 60, W = 1000, sx = (t) => X + t / 45 * W;
  let s = `<line x1="${X}" y1="120" x2="${X + W}" y2="120" stroke="#999" stroke-width="3"/>`;
  [0, 5, 10, 15, 20, 25, 30, 35, 40, 45].forEach((t) => { s += `<line x1="${sx(t)}" y1="114" x2="${sx(t)}" y2="126" stroke="#999" stroke-width="2"/>` + T(sx(t), 146, `${t}s`, 14, { a: 'middle', f: '#888' }); });
  s += R(sx(5) - 4, 60, sx(35) - sx(5), 46, OR + '14', OR, { rx: 4, dash: 1 }) + T(sx(20), 89, 'name + empty inode committed (journal, every 5 s) — data still only in RAM', 15, { a: 'middle', f: OR, w: 700 });
  s += R(sx(35), 60, sx(45) - sx(35), 46, GR + '14', GR, { rx: 4 }) + T(sx(40), 89, 'written back', 15, { a: 'middle', f: GR, w: 700 });
  s += T(sx(0), 46, 'write() returns', 16, { a: 'start', w: 800, f: BL }) + `<line x1="${sx(0)}" y1="52" x2="${sx(0)}" y2="114" stroke="${BL}" stroke-width="3"/>`;
  const pts = [[0, L[0], RD], [6, L[1], OR], [40, L[2], GR]];
  pts.forEach(([t, , c], i) => { const x = sx(t), y = 190 + i * 74; s += `<line x1="${x}" y1="128" x2="${x}" y2="${y - 6}" stroke="${c}" stroke-width="2" stroke-dasharray="5 4"/>` + `<circle cx="${x}" cy="120" r="8" fill="${c}"/>`; });
  pts.forEach(([t, r, c], i) => {
    const x = sx(t), y = 190 + i * 74;
    const txt = `⚡ crash at ${t} s → ${r}`, w = Math.round(txt.length * 0.62 * 18) + 30, bx = Math.min(x - 10, 1100 - w);
    s += R(bx, y, w, 50, '#fff', '#fff', { rx: 5 }) + R(bx, y, w, 50, c + '12', c, { rx: 5 }) + T(bx + 14, y + 32, txt.replace(/&/g, '&amp;').replace(/</g, '&lt;'), 18, { m: 1, w: 700, f: c });
  });
  return svg(1110, 420, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 9 — File systems', bai: '9.3',
}, [
  { cover: true, t: 'write() returned —<br>so where is your data?', sub: 'Buffering, fsync, O_DIRECT and the atomic rename' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Where <b>write()</b> really puts your bytes, and for how long</li>
<li>The price of durability: <b>six ways to write</b>, measured</li>
<li><b>O_DIRECT</b>: what it skips, what it does not guarantee</li>
<li><b>Pulling the power</b> safely — and finding a <b>0-byte</b> file</li>
<li>The four-step <b>atomic + durable</b> write, and readers that see half a file</li>
</ul>` },

  { t: 'write() copies into the page cache — and returns', body: pathSvg() },

  { t: 'Measured: 24 MiB waits in RAM, dirty', giua: true, body: `
${sh(g('sysctl vm.dirty_expire_centisecs') + '\n' + g("grep -E '^(Dirty|Writeback):' /proc/meminfo", 3))}` },

  { t: 'Six ways to write, measured', body: barSvg() },

  { t: 'Four runs, one shape: durability costs ~500×', giua: true, body: `
${tiny(g('for run in 1 2 3'), 13.5)}
${tiny(g('./wbench /dev/shm/bench.dat 2000'), 13.5)}
${cards([
    ['buffered ≈ 1.8 µs', 'A memory copy into the page cache.'],
    ['fsync / fdatasync / O_DSYNC ≈ 0.65–1.1 ms', 'Wait for the device flush (+ a journal commit on ext4). Batch these.'],
    ['tmpfs fsync 1.4 µs', 'Nothing to flush — and nothing survives a reboot.'],
  ])}` },

  { t: 'What each mode guarantees', giua: true, body: tbl(['mode', 'skips page cache', 'waits for device', 'used by'], [
    ['buffered write()', 'no', 'no', 'everything, by default'],
    ['fsync()', 'no', 'yes — data + metadata', 'saving a file you must not lose'],
    ['fdatasync()', 'no', 'yes — data + size', 'DB logs on preallocated files'],
    ['O_DSYNC', 'no', 'yes, every write()', 'WAL-style append logs'],
    ['O_DIRECT', '<b>yes</b>', '<b>no</b>', 'DBs with their own cache (InnoDB)'],
    ['O_DIRECT + fdatasync', 'yes', 'yes', 'durable + no double caching'],
  ], { hl: [4] }) },

  { t: 'O_DIRECT: no cache, strict alignment', giua: true, body: `
${tiny(g('head -c 8M /dev/urandom > /srv/data/a.bin', 2), 14)}
${tiny(g('./wbench /srv/data/bench.dat 2000').split('\n').filter((l) => /odd address/.test(l)).join('\n'), 14)}
${cards([
    ['0% cached', 'GNU dd oflag=direct left no page in RAM; a normal write left all 2,048.'],
    ['aligned or EINVAL', 'Buffer address, offset and length must be multiples of the block size.'],
    ['no read-ahead', 'Sequential reads are fast only if you issue large reads yourself.'],
  ])}` },

  { t: 'Pitfall: “oflag=direct” that was not direct', giua: true, body: `
${tiny(g('dd --version', 2), 14)}
${vsd('uutils <b>dd</b> got EINVAL for its unaligned buffer, silently dropped O_DIRECT with <code class="i">fcntl(F_SETFL)</code>, wrote through the cache — <b>100% cached</b>, no warning.',
    'Verify with a cache check (fincore/incore) or strace; use <b>gnudd</b> (GNU coreutils) when you need real O_DIRECT.')}` },

  { t: 'Pulling the power, safely: copy the idle disk image', giua: true, body: `
${sql(SRC('crash.sh').split('\n').filter((l) => !l.startsWith('#')).join('\n'), { lang: 'bash', sm: true }).replace('<pre class="vs sm">', '<pre class="vs sm" style="font-size:11.5px">')}
${box('Why this is a faithful crash', 'The copy holds exactly what reached the “device” — nothing that is only in the page cache. Mounting it replays the journal, like a reboot after a power cut. Copy only while the file system is <b>idle</b> (lesson 9.4 shows why).', 'lam')}` },

  { t: 'The same tiny write, crashed at three moments', body: crashSvg() },

  { t: 'Replacing a file: three ways Node code does it', giua: true, body: `
${sql(SRC('luu.js').split('\n').slice(8, 22).map((l) => l.replace(/ +\/\/.*$/, '')).join('\n'), { lang: 'javascript', sm: true })}
${cards([
    ['inplace', 'writeFileSync = open with O_TRUNC, then write. The most common — and the riskiest.'],
    ['rename', 'Write a temp file, renameSync over the old one. Atomic, not yet durable.'],
    ['safe', 'Temp → fsync → rename → fsync the directory. Atomic and durable.'],
  ])}` },

  { t: 'rename() is atomic: old or new, never half', giua: true, body: `
${tiny(g("node luu.js rename /srv/data/config.json", 2), 15)}
${box('Atomic ≠ durable', 'Crash at 0 s → the <b>old</b> version, complete. At 6 s → the new one. But that durability came from an ext4 heuristic (<code class="i">auto_da_alloc</code>, added in 2009 after exactly this pattern produced empty files). Turn it off…', '')}` },

  { t: '…and rename without fsync leaves a 0-byte file', giua: true, body: `
${tiny(g('mount -o remount,noauto_da_alloc', 3), 15)}
${box('Neither old nor new', 'The rename (metadata) was committed by the journal; the data was not written yet. XFS and other file systems never had the heuristic. Your app restarts with an <b>empty config</b>.', 'do2')}` },

  { t: 'The safe pattern: temp → fsync → rename → fsync dir', giua: true, body: `
${steps(['write <b>config.json.tmp</b>', '<b>fsync</b> the temp file — data is on the device', '<b>rename</b> it over config.json — atomic switch', '<b>fsync the directory</b> — the new name itself is durable'])}
${tiny(g('node luu.js safe'), 15)}` },

  { t: 'Readers see half-written files too', giua: true, body: `
${tiny(g('node doc-ghi.js inplace', 2), 15)}
${cards([
    ['in place (O_TRUNC + write)', 'The reader saw an empty file 374,998 times and broken JSON 165 times. Any number above 0 is a bug.'],
    ['write temp + rename', '0 empty, 0 broken. The only way to swap a whole file under a running reader.'],
    ['side effect → 9.5', 'rename installs a NEW inode. A single-file bind mount keeps the old one.'],
  ])}` },

  { t: 'Pitfall: check fsync() — and never just retry it', giua: true, to: true, body: `
${vsd('Writeback errors (disk full on a thin volume, I/O error) often surface only at the next <b>fsync()</b>. In 2018 PostgreSQL found a retried fsync could <b>succeed after the data was lost</b> (“fsyncgate”).',
    'Since 2019 PostgreSQL PANICs and recovers from WAL. In your code: if fsync fails, treat the file as lost and rewrite it from a trusted source.')}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>write() returns at the <b>page cache</b>; writeback can lag ~30–45 s</li>
<li>A durable write costs a <b>device flush</b> (~1 ms here) — batch them</li>
<li><b>O_DIRECT</b> skips the cache but is not durable</li>
<li>Crash results: <b>no file → 0 bytes → complete</b></li>
<li>Replace files with <b>temp → fsync → rename → fsync dir</b></li>
</ul>` },
]);
