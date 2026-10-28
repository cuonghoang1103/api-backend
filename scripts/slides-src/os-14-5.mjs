/**
 * os-14-5 — khoá "Operating Systems for Developers", bài 14.5 "File systems and permissions on three systems" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c145-mac.out.txt (Mac thật, đã ẩn danh) và c145-lx.out.txt (container lab,
 * thư mục Mac gắn vào /mac qua virtiofs) qua grab(). Windows (NTFS, ADS, icacls, MAX_PATH): theo tài liệu — ghi "per the docs".
 * Giảng: content/courses/operating-systems-for-developers/giang/os-14-5.mjs.
 */
import { lamDeck, sh, two, box, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-14-5', code: 'OS 14.5', title: 'File systems and permissions on three systems', sub: 'Operating Systems · Chapter 14 — Windows & macOS' };

const m = (pre, n = 1) => grab('c145-mac', pre, n);
const l = (pre, n = 1) => grab('c145-lx', pre, n);
const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const A = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#m1)"/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const c = (t) => `<code class="i">${t}</code>`;

/* số liệu clone, tính từ output */
const CL = m('dd if=/dev/urandom', 6);
const free = [...CL.matchAll(/free MiB: (\d+)/g)].map((x) => +x[1]);
const reals = [...CL.matchAll(/real\s+0m([\d.]+)s/g)].map((x) => x[1]);
const du = CL.match(/^(\d+)\s+\.$/m)[1];

/* hai góc nhìn cùng một cặp tên */
const caseView = () => {
  let s = '';
  s += R(10, 10, 520, 250, '#f3faf5', GR) + T(270, 44, 'Linux /tmp  (overlay on ext4)', 21, { a: 'middle', w: 700, f: GR });
  s += R(60, 80, 200, 56, '#fff', GR) + T(160, 116, 'README.md', 20, { a: 'middle', m: 1 });
  s += R(280, 80, 200, 56, '#fff', GR) + T(380, 116, 'Readme.md', 20, { a: 'middle', m: 1 });
  s += T(270, 190, 'two names → two files', 21, { a: 'middle', w: 700 }) + T(270, 222, 'case-sensitive', 18, { a: 'middle', f: '#555' });
  s += R(580, 10, 520, 250, '#f4f8fc', BL) + T(840, 44, '/mac  (virtiofs → APFS on the Mac)', 21, { a: 'middle', w: 700, f: BL });
  s += R(740, 80, 200, 56, '#fff', BL) + T(840, 116, 'Readme.md', 20, { a: 'middle', m: 1 });
  s += T(840, 190, 'two names → one file', 21, { a: 'middle', w: 700, f: RD }) + T(840, 222, 'the Mac decides, inside a Linux VM', 18, { a: 'middle', f: '#555' });
  return svg(1110, 270, s);
};

/* clone vs copy: chỗ trống trên đĩa */
const cloneBars = () => {
  const drop = (a, b) => a - b;
  const rows = [['cp -c (clone)', reals[0], drop(free[0], free[1]), GR], ['cp (copy)', reals[1], drop(free[1], free[2]), RD]];
  let s = '';
  rows.forEach(([lab, t, d, col], i) => {
    const y = 14 + i * 70, w = Math.max(6, Math.abs(d) * 1.2);
    s += T(10, y + 32, lab, 21, { w: 700, m: 1 }) + T(250, y + 32, `${t} s`, 21, { m: 1 });
    s += R(380, y, w, 46, col + '33', col) + T(380 + w + 14, y + 32, `${d <= 1 ? '0' : d} MiB of free space used`, 20, { f: col, w: 700 });
  });
  return svg(1110, 156, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 14 — Windows & macOS', bai: '14.5',
}, [
  { cover: true, t: 'File systems and permissions<br>on three systems', sub: 'ext4, APFS and NTFS — case, paths, clones, hidden streams, ACLs and SIP' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Where <b>ext4, APFS, NTFS</b> differ in ways that reach your code</li>
<li><b>Case-insensitivity</b> — and how it leaks into Docker on a Mac</li>
<li>APFS <b>clones</b>: a 512 MiB copy that costs nothing</li>
<li>Hidden data: resource forks, <b>alternate data streams</b>, quarantine</li>
<li>Permissions: mode bits, <b>ACLs</b>, and SIP that stops even root</li>
</ul>` },

  { t: 'Three file systems side by side', giua: true, body: bang(['', 'ext4 (Linux)', 'APFS (macOS)', 'NTFS (per the docs)'], [
    ['case', '<b>sensitive</b>', 'insensitive, case-preserving', 'insensitive, case-preserving'],
    ['separator', c('/'), c('/'), c('\\') + ' (Win32 accepts ' + c('/') + ')'],
    ['forbidden in names', c('/') + ' and NUL', c('/') + ' and NUL', c('&lt; &gt; : " / \\ | ? *') + ', CON, NUL, COM1…'],
    ['longest path', '4096', '1024', '260 (MAX_PATH) unless opted in'],
    ['copy-on-write copies', 'no (btrfs/xfs: reflink)', '<b>clones</b>, snapshots', 'no (ReFS: block cloning)'],
    ['extra data per file', 'xattrs', 'xattrs + resource fork', 'alternate data streams'],
    ['permissions', 'mode bits + POSIX ACL', 'mode + ACL + flags + SIP', 'ACLs only, no execute bit'],
  ], 22) },

  { t: 'macOS boots from a sealed, read-only system', giua: true, body: term(m('mount | grep', 4), 20) +
    box('', 'The system volume is a <b>signed snapshot</b>; your files live on a separate data volume. SIP and Gatekeeper are on. Path limit <b>1024</b> bytes (Linux: 4096).', 'lam') },

  { t: 'APFS ignores case — but keeps the spelling', giua: true, to: true, body: term(m('touch Readme.md'), 24) +
    box('', 'Asking for <code class="i">readme.md</code> found <code class="i">Readme.md</code>. Creating <code class="i">README.md</code> created nothing — it opened the same file, which kept its first spelling.', 'lam') +
    bang(['code that asks for…', 'ext4 (Linux)', 'APFS / NTFS (default)'], [
      [c('open("readme.md")') + ' when the file is Readme.md', '✗ not found', '✓ opens it'],
      ['two files Readme.md + README.md', '✓ two files', '✗ one file'],
      ['rename Readme.md → README.md', 'a real rename', 'Git does not notice (lesson 14.8)'],
    ], 22) },

  { t: 'The Mac’s case rules leak into a Linux container', giua: true, body: term(l('mount | grep', 3), 18) + caseView() },

  { t: 'A 512 MiB clone in 0.003 s, using no space', giua: true, body: two(
    term(CL.replace(/\n\n/g, '\n'), 14, 560),
    '<div>' + bang(['command', 'time', 'free space used'], [
      [c('cp -c'), `${reals[0]} s`, `${Math.max(0, free[0] - free[1])} MiB`],
      [c('cp'), `${reals[1]} s`, `${free[1] - free[2]} MiB`],
    ], 22) +
    box('', `<code class="i">du</code> still says <b>${du} MiB</b> for three files: it adds sizes and cannot see that two share every block.`, 'do2') +
    box('', 'Copy-on-write at the file level — the same idea as fork in lesson 14.2.', 'lam') + '</div>') },

  { t: 'Linux’s ext4 has no clones', giua: true, to: true, body: term(l('head -c 1M /dev/urandom'), 21) +
    bang(['file system', 'copy-on-write copy', 'command'], [
      ['ext4 (and overlay on it)', '✗ not supported', c('cp --reflink=always') + ' fails'],
      ['btrfs, xfs', '✓ reflink', c('cp --reflink')],
      ['APFS', '✓ clone', c('cp -c')],
      ['NTFS / ReFS (per the docs)', '✗ / ✓ block cloning', '—'],
    ], 22) },

  { t: 'Hidden data: a resource fork and a quarantine flag', giua: true, body: term(m("echo 'echo hi' > tool.sh", 3), 17) +
    box('', c('ls -l') + ' says 8 bytes — yet the file carries 13 more in its <b>resource fork</b>. ' + c('com.apple.quarantine') + ' is what makes Gatekeeper check a download.', 'lam') +
    box('', 'NTFS (per the docs): <b>alternate data streams</b> — ' + c('notes.txt:hidden') + '; downloads carry a ' + c('Zone.Identifier') + ' stream ("Mark of the Web") checked by SmartScreen.', 'lam') },

  { t: 'One ACL entry stops even the owner', giua: true, body: term(m('chmod +a', 2), 18) + two(
    term(l('echo hi > f'), 17, 540),
    '<div>' + box('', 'macOS checks ACL entries <b>before</b> the mode bits — even the owner gets "Permission denied".', 'lam') +
    box('', 'Linux: optional POSIX ACLs on top of mode bits (' + c('setfacl') + ', ' + c('getfacl') + ').', 'lam') + '</div>') +
    box('', 'Windows (per the docs): ACLs are the whole model — ' + c('icacls file /deny Everyone:(D)') + ' is the same "deny delete"; no mode bits, no execute bit.', 'xanh') },

  { t: 'SIP: protection even from root', giua: true, to: true, body: term(m('ls -lO /usr/bin/true', 2), 21) +
    box('', 'System binaries carry the <b>restricted</b> flag, the system volume is sealed, and SIP refuses writes to /System, /usr and /bin — with or without sudo. The same wall stopped dtruss in lesson 14.3.', 'do2') +
    bang(['', 'Linux', 'macOS', 'Windows (per the docs)'], [
      ['can root change system binaries?', 'yes', '<b>no</b> — sealed volume + SIP', 'full access only for TrustedInstaller (WRP), not admins'],
    ], 21) },

  { t: 'Windows names and paths that break a clone', giua: true, body: bang(['rule (per the docs)', 'example that fails on Windows'], [
    ['forbidden characters ' + c('&lt; &gt; : " | ? *'), c('report:v2.txt') + ', ' + c('what?.md')],
    ['reserved device names', c('con.js') + ', ' + c('aux/') + ', ' + c('nul.txt')],
    ['no trailing dot or space', c('notes.') + ', ' + c('build ')],
    ['MAX_PATH = 260 characters', 'deep ' + c('node_modules') + ' paths → "Filename too long"'],
    ['long paths need <b>both</b>', 'registry ' + c('LongPathsEnabled=1') + ' + app manifest ' + c('longPathAware')],
  ], 22) },

  { t: 'Pitfall: "tests pass in Docker on my Mac"', giua: true, to: true, body: vsd(
    'Bind-mount the project into Docker on the Mac, run the tests, ship. The virtiofs share keeps APFS’s case rules, so <code class="i">Config.properties</code> vs <code class="i">config.properties</code> never fails.',
    '<code class="i">COPY . .</code> into the image when you test, keep file-name case exact in code and resources, and add a Linux CI job. Check the repo for names that differ only by case.') +
    box('', 'Measured in this lesson: in ' + c('/tmp') + ' of the container two names made two files; in the bind-mounted ' + c('/mac') + ' they made one.', 'lam') },

  { t: 'Practice: will this repo survive three file systems?', giua: true, body: `
<ol>
<li>Case collisions: ${c("git ls-files | tr 'A-Z' 'a-z' | sort | uniq -d")}</li>
<li>Windows-illegal names and reserved names: ${c('git ls-files | grep -E …')}</li>
<li>Paths too long: ${c("git ls-files | awk 'length &gt; 200'")}</li>
<li>100 MiB file, ${c('cp -c')}, compare ${c('df -m .')} with ${c('du -sm .')}</li>
<li>${c('chmod +a "everyone deny delete"')}, then undo; write the ${c('icacls')} line</li>
</ol>` + box('Done when', 'no case collisions, no Windows-illegal names, no path over 200 characters — and you can explain why du and df disagree after a clone.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>ext4 is case-sensitive; APFS and NTFS are not — and virtiofs carries that into containers</li>
<li>Paths: 4096 (Linux), 1024 (macOS), 260 on Windows unless opted in</li>
<li>APFS clones copy 512 MiB in ${reals[0]} s for free; <code class="i">du</code> still counts them</li>
<li>Hidden data: resource forks, ADS, quarantine / Mark of the Web</li>
<li>Mode bits (+ACL) · mode + ACL + SIP · ACLs only</li>
</ul>` },
]);
