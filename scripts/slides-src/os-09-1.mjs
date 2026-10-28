/**
 * os-09-1 — khoá "Operating Systems for Developers", bài 9.1 "VFS, inodes, dentries and links" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c91-inode.out.txt (chạy thật) qua grab(). Giảng: giang/os-09-1.mjs.
 */
import { lamDeck, sh, box, cards, vsd, sql } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-09-1', code: 'OS 9.1', title: 'VFS, inodes, dentries and links', sub: 'Operating Systems · Chapter 9' };

const g = (pre, n = 1) => grab('c91-inode', pre, n);
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

/* VFS: một bộ syscall → VFS → bốn driver */
const vfsSvg = () => {
  let s = '';
  s += R(300, 10, 510, 70, '#f4f6fa', BL) + T(555, 54, 'open() · read() · write() · close()', 24, { a: 'middle', w: 700, f: BL });
  s += T(830, 40, 'your program: Node, Java, C…', 17, { f: '#666' }) + T(830, 64, 'the same calls for every path', 17, { f: '#666' });
  s += A(555, 82, 555, 132, BL);
  s += R(110, 136, 890, 88, BL + '18', BL, { sw: 3 }) + T(555, 176, 'VFS — superblock · inode · dentry · file', 26, { a: 'middle', w: 800, f: BL });
  s += T(555, 206, 'routes each call to the driver that owns the path', 18, { a: 'middle', f: '#555' });
  const d = [['proc', '/proc/loadavg', '0x9fa0', 'made on the fly'], ['tmpfs', '/dev/shm/…', '0x01021994', 'RAM only'], ['ext4', '/mnt/lab/…', '0xef53', 'blocks on a disk'], ['overlay', '/etc/os-release', '0x794c7630', 'image layers']];
  d.forEach(([n, p, m, why], i) => {
    const x = 20 + i * 272, c = [OR, GR, BL, PU][i];
    s += A(555, 226, x + 126, 290, GY);
    s += R(x, 294, 252, 156, c + '14', c) + T(x + 126, 336, n, 28, { a: 'middle', w: 800, f: c });
    s += T(x + 126, 372, p, 18, { a: 'middle', m: 1, f: '#333' }) + T(x + 126, 402, `f_type ${m}`, 17, { a: 'middle', m: 1, f: '#666' }) + T(x + 126, 432, why, 17, { a: 'middle', f: '#666' });
  });
  return svg(1110, 460, s);
};

/* hard link vs symlink: thư mục → inode */
const linkSvg = () => {
  let s = '';
  s += R(20, 20, 330, 250, '#fafafa', GY) + T(185, 50, 'directory /mnt/lab', 19, { a: 'middle', w: 800, f: '#555' });
  [['app.env', 14, BL], ['app.env.bak', 14, BL], ['current.env', 15, PU], ['status.txt', 13, GY]].forEach(([n, i, c], k) => {
    const y = 74 + k * 46; s += R(40, y, 290, 36, '#fff', c, { rx: 4 }) + T(54, y + 25, n, 18, { m: 1 }) + T(318, y + 25, `→ ${i}`, 18, { a: 'end', w: 800, m: 1, f: c });
  });
  s += A(332, 92, 520, 92, BL) + A(332, 138, 520, 110, BL) + A(332, 184, 520, 236, PU);
  s += R(525, 40, 560, 130, BL + '12', BL) + T(545, 72, 'inode 14 · regular file', 21, { w: 800, f: BL });
  s += T(545, 102, 'size 10 · mode 0644 · links 2 · uid 0', 18, { m: 1 }) + T(545, 130, 'data in block 1071 → "PORT=3000"', 18, { m: 1 }) + T(545, 158, 'no name stored here', 17, { f: RD, w: 700 });
  s += R(525, 196, 560, 112, PU + '12', PU) + T(545, 228, 'inode 15 · symlink', 21, { w: 800, f: PU });
  s += T(545, 258, 'content = the text "app.env" (7 bytes)', 18, { m: 1 }) + T(545, 286, 'resolved by NAME every time it is opened', 17, { f: '#555' });
  s += A(820, 196, 820, 172, PU, { dash: 1 }) + T(830, 188, 'follows the name', 15, { f: PU });
  s += T(20, 336, 'hard link = another entry → same inode (links 2) · soft link = new inode holding a path', 18, { f: '#555' });
  return svg(1110, 346, s, 0.86);
};

/* khối thư mục thật: chú thích một bản ghi */
const dirSvg = () => {
  const raw = g('debugfs -R "bd').split('\n').filter((l) => /^\d{4}  /.test(l));
  let s = '';
  raw.forEach((l, i) => { s += T(30, 34 + i * 30, l.replace(/&/g, '&amp;').replace(/</g, '&lt;'), 19, { m: 1, f: i === 5 || i === 6 ? '#222' : '#777' }); });
  s += R(22, 34 + 4 * 30 + 9, 1060, 62, 'none', OR, { rx: 4, dash: 1 });
  const y = 290;
  s += T(30, y, 'one record (offset 0120):', 19, { w: 800, f: OR });
  const parts = [['0e00 0000', 'inode 14', BL], ['1400', 'rec_len 20', GR], ['0b', 'name_len 11', PU], ['01', 'type: regular', RD], ['app.env.bak', 'the name', '#555555']];
  let x = 30;
  parts.forEach(([b, n, c]) => { const w = Math.max(b.length * 13 + 30, 150); s += R(x, y + 14, w, 44, c + '14', c, { rx: 4 }) + T(x + w / 2, y + 43, b, 19, { a: 'middle', m: 1, w: 700, f: c }) + T(x + w / 2, y + 82, n, 16, { a: 'middle', f: c }); x += w + 14; });
  s += T(30, y + 122, 'deleted app.env (offset 0100) = zeros: rm grew status.txt’s record (rec_len 0x24 = 36) to swallow it', 17, { f: '#555' });
  return svg(1110, 430, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 9 — File systems', bai: '9.1',
}, [
  { cover: true, t: 'A file name is only a pointer', sub: 'VFS, inodes, dentries and links' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why <b>one set of system calls</b> reads proc, tmpfs, ext4 and overlay — the <b>VFS</b></li>
<li>What an <b>inode</b> holds — and why the name is not in it</li>
<li><b>Hard links</b> vs <b>symbolic links</b>, link counts, what <b>rm</b> really removes</li>
<li>The real bytes of a directory, read with <b>debugfs</b></li>
<li>EXDEV, mv across disks, inode reuse, and the kernel’s <b>dentry cache</b></li>
</ul>` },

  { t: 'One interface, many file systems: the VFS', body: vfsSvg() },

  { t: 'Same three system calls, four different drivers', giua: true, body: `
${tiny(g('strace -e trace=openat,read,close'), 14)}
<p style="margin:0;font-size:21px">Our C program reads one file from each mount with <b>openat → read → close</b>; <code class="i">fstatfs()</code> reveals which file system answered. (Ubuntu 26.04’s <code class="i">cat</code> is uutils and uses <b>splice()</b>, so we use our own program.)</p>` },

  { t: 'The inode: everything except the name', giua: true, body: `
${sh(g('ls -li app.env') + '\n' + g('stat app.env'))}
${cards([
    ['Inode 14', 'The file’s number on this file system — <b>ls -i</b> prints it first.'],
    ['Size 10 · Blocks 8', 'Bytes of data; blocks counted in 512-byte units = one 4 KiB block.'],
    ['Links 1 · 0644 · uid 0', 'How many names, permission bits, owner — and four timestamps. <b>No name.</b>'],
  ])}` },

  { t: 'Hard links and symbolic links', body: `
${tiny(g('ln app.env app.env.bak', 3), 13)}
${linkSvg()}` },

  { t: 'rm removes a name; data dies at two zeros', giua: true, body: `
${sh(g('rm app.env', 4))}
${cards([
    ['link count → 0', 'No directory entry points to the inode any more.'],
    ['open count → 0', 'No process holds it open — Chapter 2’s deleted-but-open log (lsof +L1).'],
    ['only then', 'The kernel frees the inode and its blocks. The symlink just dangles.'],
  ])}` },

  { t: 'Directory link counts: names + . + every child’s ..', to: true, giua: true, body: `
${sh(g('mkdir -p releases', 2))}
${box('Read it like this', '<b>releases/v1</b>: its name in <i>releases</i> + its own <b>.</b> = 2. <b>releases</b>: its name + its <b>.</b> + the <b>..</b> of v1 and v2 = 4. On ext4, links − 2 = number of subdirectories.', 'lam')}` },

  { t: 'debugfs: a directory is a list of name → inode', giua: true, body: `
${sh(g("debugfs -R 'ls -l /'"))}
${cards([
    ['name → inode', 'app.env is gone from the list; app.env.bak → 14 and current.env → 15 remain.'],
    ['(1) (2) (7)', 'The entry’s file type: regular file, directory, symlink.'],
    ['nothing else', 'A directory block holds only names and inode numbers — no sizes, no data.'],
  ])}` },

  { t: 'debugfs: an inode on disk, and a fast symlink', giua: true, body: `
${sh(g("debugfs -R 'stat /app.env.bak'").split('\n').filter((l) => /^\$|Inode:|Size:|Links:|EXTENTS|^\(0\)/.test(l)).join('\n'))}
${sh(g("debugfs -R 'stat /current.env'").split('\n').filter((l) => /^\$|Inode:|Blockcount|Fast link/.test(l)).join('\n'))}
<p style="margin:0;font-size:21px">Inode 14: size, <b>Links: 1</b> now, data in physical block <b>1071</b> — still no name. The symlink uses <b>0 blocks</b>: its 7-byte target lives in the inode itself.</p>` },

  { t: 'The raw bytes of the root directory (block 3)', body: dirSvg() },

  { t: 'Hard-link limits, and mv across disks', giua: true, body: `
${tiny(g('ln /mnt/lab/app.env.bak', 3), 14)}
${cards([
    ['EXDEV', 'An inode number only means something inside one file system.'],
    ['no directory hard links', 'They could create cycles that find, du and path lookup never escape.'],
    ['mv across file systems', 'rename fails with EXDEV → <b>copy + delete</b>: slow, new inode, not atomic.'],
  ])}` },

  { t: 'Inode numbers get reused', to: true, giua: true, body: `
${sh(g('rm /mnt/lab/current.env'))}
${vsd('Caching “has this file changed?” by <b>inode number</b> alone: after delete + create, a new file can carry the old number (14 again here).',
    'Use (device, inode, ctime), the ext4 <b>generation</b> number, or a content hash.')}` },

  { t: 'The kernel caches names and inodes', giua: true, body: `
${tiny(g('cat /proc/sys/fs/dentry-state', 2), 14)}
${cards([
    ['dentry cache', '240,480 entries × 192 B ≈ 46 MB on this VM: name → inode lookups without reading disk.'],
    ['negative dentries', '48,950 cached “no such file” answers — module resolution and $PATH probes stay fast.'],
    ['inode cache', '172,872 ext4 inodes × 1,128 B ≈ 195 MB — reclaimable slab, counted in <b>available</b> (8.1).'],
  ])}` },

  { t: 'Pitfall: a relative symlink resolves next to the link', giua: true, body: `
${sql(['cd /home/deploy', 'ln -s releases/v2 /srv/app/current   # stores the TEXT "releases/v2"', '# the kernel resolves it next to the LINK: /srv/app/releases/v2', '# — not /home/deploy/releases/v2, where you were standing'].join('\n'), { lang: 'bash' })}
${vsd('Moving the link, <code class="i">COPY</code>-ing it into an image, or creating it from another directory: it silently points at nothing.',
    'Use absolute targets for deploy links (or cd first) and check with <b>readlink -f</b>.')}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>The <b>VFS</b> gives every file system the same open/read/write/lookup</li>
<li>An <b>inode</b> is the file; a directory is a list of <b>name → inode</b></li>
<li>Hard link = another name; symlink = a tiny file holding a path</li>
<li>Data is freed when <b>link count</b> and <b>open count</b> both hit 0</li>
<li>mv within a file system renames; across them it copies (EXDEV)</li>
</ul>` },
]);

