/**
 * os-09-4 — khoá "Operating Systems for Developers", bài 9.4 "Journaling and crash consistency" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output + số đo đọc THẲNG từ lab/out/c94-journal.out.txt qua grab(). Giảng: giang/os-09-4.mjs.
 */
import { lamDeck, sh, box, cards, vsd, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-09-4', code: 'OS 9.4', title: 'Journaling and crash consistency', sub: 'Operating Systems · Chapter 9' };

const g = (pre, n = 1) => grab('c94-journal', pre, n);
const wrap = (t, max = 104) => t.split('\n').map((l) => {
  if (l.length <= max) return l;
  if (!l.startsWith('$ ')) { const out = []; let rest = l; while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 1); if (k < 20) k = max - 1; out.push(rest.slice(0, k)); rest = '      ' + rest.slice(k + 1); } return [...out, rest].join('\n'); }
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

/* một lần nối thêm = ba lần ghi */
const baGhi = () => {
  let s = T(555, 30, 'append 1 KiB to invoice.txt = three separate writes, in any order', 20, { a: 'middle', w: 800, f: '#444' });
  [['data block', 'the new bytes', BL], ['inode', 'size 2048 · block[1] = 7170', OR], ['block bitmap', 'mark 7170 as used', GR]].forEach(([n, d, c], i) => {
    const x = 40 + i * 360; s += R(x, 50, 320, 90, c + '14', c) + T(x + 160, 88, n, 22, { a: 'middle', w: 800, f: c }) + T(x + 160, 118, d, 17, { a: 'middle', m: 1 });
  });
  s += T(555, 182, 'power fails after only ONE of them reached the disk:', 19, { a: 'middle', w: 800, f: RD });
  const rows = [['only the data block', 'file unchanged, block still marked free — the write is simply lost', GY], ['only the bitmap', 'block 7170 used by nobody — a space leak fsck can find', OR], ['only the inode', 'inode points at block 7170, which holds OLD data — garbage or someone else’s secret', RD]];
  rows.forEach(([a, b, c], i) => { const y = 206 + i * 62; s += R(40, y, 1030, 50, c + '10', c, { rx: 4 }) + T(60, y + 32, a, 19, { w: 800, f: c }) + T(330, y + 32, b, 18, { f: '#333' }); });
  return svg(1110, 400, s);
};

/* ý tưởng journal */
const jIdea = () => {
  let s = '';
  s += T(40, 34, 'journal (reserved area on the same disk)', 19, { w: 800, f: '#555' });
  const blk = [['descriptor', BL], ['inode tbl', OR], ['bitmap', GR], ['dir block', PU], ['…', GY], ['COMMIT', RD]];
  blk.forEach(([n, c], i) => { const x = 40 + i * 150; s += R(x, 50, 136, 64, c + '18', c, { sw: n === 'COMMIT' ? 3 : 2 }) + T(x + 68, 89, n, 18, { a: 'middle', w: 800, f: c }); });
  s += T(40, 150, '① write the blocks you are about to change + a commit block → wait until it is on the device', 18, { f: '#333' });
  s += A(500, 166, 500, 214, GY) + T(520, 196, '② checkpoint: copy them to their real places', 18, { f: '#333' });
  s += R(40, 222, 1030, 60, '#fafafa', GY) + T(555, 260, 'main area: superblock · group descriptors · bitmaps · inode tables · directories · data', 18, { a: 'middle', f: '#555' });
  s += R(40, 310, 500, 90, GR + '12', GR) + T(60, 344, 'after a crash, transaction HAS a commit', 18, { w: 800, f: GR }) + T(60, 374, '→ replay it (writing twice is harmless)', 18);
  s += R(570, 310, 500, 90, RD + '10', RD) + T(590, 344, 'transaction has NO commit block', 18, { w: 800, f: RD }) + T(590, 374, '→ ignore it, as if it never started', 18);
  return svg(1110, 410, s);
};

/* giao dịch thật: khối journal → khối FS */
const txSvg = () => {
  const L = g("debugfs -R 'logdump -a'").split('\n').filter((l) => /FS block/.test(l)).map((l) => { const m = l.match(/FS block (\d+) logged at journal block (\d+)/); return [+m[1], +m[2]]; });
  const why = { 0: ['superblock', GY], 1: ['group descriptors', GY], 5: ['block bitmap', GR], 21: ['inode bitmap', GR], 37: ['inode table (inodes 1–16)', OR], 6: ['root directory block (inode 2)', PU], 1581: ['new uploads/ directory (inode 13)', PU] };
  let s = T(30, 28, 'journal', 18, { w: 800, f: BL }) + T(470, 28, 'real location on disk', 18, { w: 800, f: '#555' });
  s += R(30, 40, 230, 34, BL + '22', BL, { rx: 3 }) + T(42, 63, 'j1  descriptor', 17, { m: 1, w: 700, f: BL });
  L.forEach(([fsb, jb], i) => {
    const y = 80 + i * 44, [n, c] = why[fsb] || ['?', GY];
    s += R(30, y, 230, 38, '#fff', BL, { rx: 3 }) + T(42, y + 25, `j${jb}  copy of block ${fsb}`, 16, { m: 1 });
    s += A(262, y + 19, 452, y + 19, c) + R(456, y, 600, 38, c + '12', c, { rx: 3 }) + T(470, y + 25, `block ${fsb}`, 17, { m: 1, w: 800, f: c }) + T(600, y + 25, n, 17, { f: '#333' });
  });
  const y = 80 + L.length * 44;
  s += R(30, y, 230, 34, RD + '22', RD, { rx: 3, sw: 3 }) + T(42, y + 23, 'j9  COMMIT', 17, { m: 1, w: 800, f: RD });
  s += T(300, y + 23, '7 metadata blocks, 0 data blocks: the photos’ bytes are not in the journal (data=ordered)', 16, { f: '#555' });
  return svg(1110, y + 44, s);
};

/* cột: thiết bị nhận bao nhiêu KiB cho 32 MiB ghi */
const modeSvg = () => {
  const rows = g('for mode in ordered').split('\n').filter((l) => /^data=/.test(l)).map((l) => { const m = l.match(/data=(\w+): app wrote (\d+) KiB, the disk received (\d+) KiB/); return [m[1], +m[2], +m[3]]; });
  const X = 200, sx = (v) => v / 70000 * 640;
  let s = '';
  rows.forEach(([n, w, r], i) => {
    const y = 20 + i * 92, c = n === 'journal' ? RD : n === 'writeback' ? OR : GR;
    s += T(X - 14, y + 44, `data=${n}`, 20, { a: 'end', m: 1, w: 800, f: c });
    s += R(X, y + 6, sx(w), 30, '#eee', '#bbb', { rx: 3 }) + T(X + sx(w) + 10, y + 28, `app wrote ${w.toLocaleString('en-US')} KiB`, 16, { f: '#777' });
    s += R(X, y + 40, sx(r), 30, c + '33', c, { rx: 3 }) + T(X + sx(r) + 10, y + 62, `device got ${r.toLocaleString('en-US')} KiB`, 17, { w: 800, f: c });
  });
  s += T(X, 300, 'session_write_kbytes of the ext4 file system, 32 MiB written + sync, fresh 128 MB disk each time', 15, { f: '#777' });
  return svg(1110, 312, s);
};

/* 12 bản chép đĩa đang bận */
const copySvg = () => {
  const L = g('for k in $(seq 1 12)').split('\n').filter((l) => /^copy/.test(l)).map((l) => +l.match(/: (\d+) real/)[1]);
  const mx = Math.max(...L), X = 70, bw = 72, H = 230;
  let s = '';
  L.forEach((v, i) => {
    const x = X + i * 84, h = v ? Math.max(8, v / mx * H) : 4, c = v ? RD : GR;
    s += R(x, 20 + H - h, bw, h, c + '33', c, { rx: 3 }) + T(x + bw / 2, 20 + H - h - 8, String(v), 18, { a: 'middle', w: 800, f: c }) + T(x + bw / 2, 20 + H + 24, `#${i + 1}`, 16, { a: 'middle', f: '#666' });
  });
  const bad = L.filter((v) => v > 0).length;
  s += T(X, 20 + H + 60, `${bad} of ${L.length} copies still corrupt after e2fsck replayed the journal (errors per copy)`, 19, { w: 800, f: RD });
  return svg(1110, 20 + H + 72, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 9 — File systems', bai: '9.4',
}, [
  { cover: true, t: 'How a file system survives<br>a power cut mid-write', sub: 'Journaling and crash consistency' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why one small append is <b>three writes</b> — and what a crash between them does</li>
<li>A crash on <b>ext2</b> (no journal) that exposes another user’s data</li>
<li>The <b>journal</b>: a real ext4 transaction, block by block, and its replay</li>
<li><b>data=ordered / writeback / journal</b>, and what each fsync costs</li>
<li>Why copying a <b>running</b> disk is not a backup</li>
</ul>` },

  { t: 'One small append is three writes', body: baGhi() },

  { t: 'ext2, no journal: a deleted secret, a free block', giua: true, body: `
${tiny(g('truncate -s 8M /tmp/old.img', 4), 14)}
<p style="margin:0;font-size:21px">old-secret.txt is deleted, so block <b>7170</b> is free again — but its bytes are still there. Now we build the crash state by hand: only the <b>inode</b> of “append 1 KiB to invoice.txt” reaches the disk.</p>` },

  { t: 'After the “reboot”: someone’s password in the invoice', giua: true, body: `
${tiny(g('debugfs -w -R "sif /invoice.txt size 2048"'), 13.5)}
${sh(g('mount -o loop,ro /tmp/old.img'), { hl: [3] })}
${box('Nothing is “broken”', 'The inode simply points at block 7170, and 7170 holds whatever was there before. Stale data after a crash is a <b>security</b> bug.', 'do2')}` },

  { t: 'fsck finds the bitmap — never the garbage', giua: true, body: `
${tiny(g('e2fsck -fn /tmp/old.img'), 14)}
${vsd('fsck checks <b>metadata</b>: it would mark 7170 used and call the file system clean.', 'It cannot know the content is someone else’s data. On a big disk it also takes <b>hours</b> at boot.', '✗ What fsck sees', '✓ What it cannot see')}` },

  { t: 'The journal: write it down before you do it', body: jIdea() },

  { t: 'Our ext4 disk: a 4 MiB journal, commit every 5 s', giua: true, body: `
${tiny(g('dumpe2fs -h /tmp/vps.img') + '\n' + g("grep -E '^(data=") + '\n' + g('dumpe2fs /tmp/vps.img'), 13.5)}` },

  { t: 'A real transaction: uploads/ + three photos', giua: true, body: `
${tiny(g('mkdir /srv/data/uploads', 2) + '\n' + g("debugfs -R 'ls /' /tmp/crash.img", 2) + '\n' + g("debugfs -R 'logdump -a'"), 13)}` },

  { t: 'Seven metadata blocks and one commit block', body: txSvg() },

  { t: 'Mounting the copy replays the transaction', giua: true, body: `
${tiny(g('mount -o loop /tmp/crash.img', 2), 14)}
${cards([
    ['structure: back', 'uploads/ and three names exist again — the journal did its job.'],
    ['data: 0 bytes', 'Ordered mode guarantees no stale data, not durability. That is fsync’s job (9.3).'],
    ['icheck', 'Block 6 = root directory (inode 2); block 1581 = uploads/ (inode 13).'],
  ])}` },

  { t: 'Three data modes: data=journal writes everything twice', body: `
${modeSvg()}
${cards([
    ['ordered (default)', 'Data forced to disk before the metadata that points to it is committed.'],
    ['writeback', 'Metadata only — after a crash a file can show old blocks.'],
    ['journal', 'Data through the journal too: strongest, 2× the writes.'],
  ])}` },

  { t: 'Every fsync forces a commit (~0.5 ms here)', giua: true, body: `
${tiny(g('D=$(basename'), 14)}
${box('Group commit', '500 fsyncs → 500 “requested” transactions. When many processes fsync together, jbd2 lets them share one commit — the same trick PostgreSQL uses for its WAL.', 'lam')}` },

  { t: 'Copying a busy disk is not a backup', body: `
${copySvg()}
${box('Why the journal could not help', 'A real power cut stops all writes at one instant, in order. A copy that takes tens of ms reads the start and the end of the disk at different moments. Use snapshots (LVM/ZFS/cloud, fsfreeze) or pg_dump/pg_basebackup.', 'do2')}` },

  { t: 'The same idea, elsewhere', to: true, giua: true, body: cards([
    ['Copy-on-write file systems', 'Btrfs, ZFS, APFS never overwrite live blocks: write new ones, then switch one root pointer. Cheap snapshots. (Not measured in this lab.)'],
    ['PostgreSQL WAL', 'A journal for table pages; full_page_writes guards against a half-written 8 KiB page. Chapter 2 watched it replay: “redo done”.'],
  ], 2) },

  { t: 'Pitfall: a journal is only as honest as the disk’s flush', giua: true, to: true, body: vsd(
    '<b>nobarrier</b> “for speed”, a RAID cache without battery, an SSD that acknowledges a flush it has not done: the commit block can land before the blocks it commits.',
    'Keep barriers on (the default), and on your own hardware check that the disk really has power-loss protection.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>One append = <b>data + inode + bitmap</b>; a crash between leaves junk</li>
<li>Without a journal, stale data leaks and fsck cannot see it</li>
<li>ext4 logs changed blocks + a <b>commit</b>; mount <b>replays</b> it</li>
<li>ordered = no stale data; journal = 2× writes; each fsync = a commit</li>
<li>Back up with <b>snapshots</b>, never a copy of a busy disk</li>
</ul>` },
]);
