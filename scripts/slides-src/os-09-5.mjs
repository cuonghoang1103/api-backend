/**
 * os-09-5 — khoá "Operating Systems for Developers", bài 9.5 "Mount points and bind mounts" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c95-mount.out.txt qua grab(); số inode trong hình lấy từ chính file đó.
 * Giảng: giang/os-09-5.mjs.
 */
import { lamDeck, sh, box, cards, vsd, steps, sql, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-09-5', code: 'OS 9.5', title: 'Mount points and bind mounts', sub: 'Operating Systems · Chapter 9' };

const g = (pre, n = 1) => grab('c95-mount', pre, n);
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

/* số inode trước/sau sed -i, đọc từ output */
const inodes = () => {
  const t = g('stat -c', 99).split('\n').filter((l) => /inode=\d/.test(l)).map((l) => +l.match(/inode=(\d+)/)[1]);
  return { old: t[0], neu: t[4] };
};

/* mount che file bên dưới */
const hideSvg = () => {
  let s = '';
  s += R(30, 30, 480, 300, '#fafafa', GY) + T(270, 62, 'root file system ( / )', 20, { a: 'middle', w: 800, f: '#555' });
  s += R(70, 90, 400, 64, '#fff', GY) + T(90, 130, '/srv/uploads/', 20, { m: 1, w: 700 });
  s += R(110, 180, 340, 56, RD + '14', RD, { dash: 1 }) + T(130, 215, 'avatar-17.txt  (45 bytes)', 18, { m: 1, f: RD });
  s += T(270, 290, 'written while the data disk was NOT mounted', 16, { a: 'middle', f: RD });
  s += R(600, 60, 470, 110, BL + '14', BL) + T(835, 100, 'data disk (loop, ext4)', 20, { a: 'middle', w: 800, f: BL }) + T(835, 136, 'mounted on /srv/uploads', 17, { a: 'middle', m: 1 });
  s += A(598, 120, 472, 122, BL) + T(535, 108, 'covers', 15, { a: 'middle', f: BL });
  s += R(600, 210, 470, 120, GR + '12', GR) + T(835, 248, 'mount --bind / /tmp/rootview', 18, { a: 'middle', m: 1, w: 700, f: GR }) + T(835, 280, 'a view of / WITHOUT what is mounted on it', 16, { a: 'middle' }) + T(835, 308, '→ avatar-17.txt is still there', 16, { a: 'middle', w: 700, f: GR });
  s += T(30, 372, 'ls /srv/uploads shows only lost+found · du /srv/uploads cannot count it · df / still does', 18, { f: '#555' });
  return svg(1110, 386, s);
};

/* bind mount thư mục vs một file: sau sed -i */
const pinSvg = () => {
  const { old, neu } = inodes();
  let s = '';
  s += T(160, 30, 'host directory /host/nginx', 18, { a: 'middle', w: 800, f: '#555' });
  s += R(30, 46, 260, 50, '#fff', BL) + T(46, 78, 'nginx.conf → ' + neu, 19, { m: 1, w: 700, f: BL });
  s += R(420, 30, 300, 92, GR + '14', GR) + T(570, 64, `inode ${neu} (new)`, 20, { a: 'middle', w: 800, f: GR }) + T(570, 98, 'worker_connections 4096', 16, { a: 'middle', m: 1 });
  s += R(420, 176, 300, 92, RD + '10', RD, { dash: 1 }) + T(570, 210, `inode ${old} (old)`, 20, { a: 'middle', w: 800, f: RD }) + T(570, 244, 'no name left · //deleted', 16, { a: 'middle', m: 1, f: RD });
  s += A(292, 70, 416, 74, BL) + T(354, 58, 'name', 15, { a: 'middle', f: BL });
  s += R(810, 40, 280, 70, GR + '12', GR) + T(950, 70, '/ctr/conf.d (dir mount)', 17, { a: 'middle', w: 800, f: GR }) + T(950, 96, 'looks the NAME up each time', 15, { a: 'middle' });
  s += R(810, 190, 280, 70, RD + '10', RD) + T(950, 220, '/ctr/etc/nginx.conf', 17, { a: 'middle', w: 800, f: RD }) + T(950, 246, 'pinned the INODE at mount', 15, { a: 'middle' });
  s += A(808, 76, 724, 76, GR) + A(808, 224, 724, 222, RD);
  s += T(30, 160, 'sed -i =', 18, { w: 800, f: OR }) + T(30, 186, 'write sedXXXXXX', 17, { m: 1 }) + T(30, 210, '+ renameat() over', 17, { m: 1 }) + T(30, 234, 'nginx.conf', 17, { m: 1 });
  s += T(30, 300, 'nginx inside the container reads the deleted inode; nginx -t validates it; reload reloads it — all green, nothing changes', 17, { f: '#555' });
  return svg(1110, 316, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 9 — File systems', bai: '9.5',
}, [
  { cover: true, t: 'One tree, many file systems —<br>and a file that would not update', sub: 'Mount points and bind mounts' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>mount</b> is, and the files Docker bind-mounts into every container</li>
<li>How files <b>hide under a mount point</b> and still use the disk</li>
<li><b>Bind mounts</b>: a directory vs a single file</li>
<li>The <b>nginx.conf incident</b> (25/08/2026): why sed -i never reached the container</li>
<li><b>ro</b>, <b>noexec</b>, <b>nosuid</b>, <b>nodev</b> — and their limits</li>
</ul>` },

  { t: 'Every container gets three bind-mounted files', giua: true, body: `
${tiny(g('findmnt -lo TARGET,SOURCE,FSTYPE') + '\n' + g("grep ' /etc/hosts '"), 14)}
${cards([
    ['406 363 254:1', 'Mount ID, parent ID, device (major:minor).'],
    ['/docker/containers/&lt;id&gt;/hosts', 'The <b>root</b>: which file of the source file system is mounted.'],
    ['/etc/hosts · ext4 /dev/vda1', 'Mount point, type, source: a file on the VM’s disk.'],
  ])}` },

  { t: 'A mount hides what was underneath', giua: true, body: `
${tiny(g('mkdir -p /srv/uploads', 3), 14.5)}
${box('Gone from view, not from the disk', 'After the mount, <code class="i">ls</code> shows only the data disk’s lost+found. A bind mount of <code class="i">/</code> — which does not carry what is mounted on top — still finds the 45-byte file.', 'do2')}` },

  { t: 'Where avatar-17.txt really is', body: hideSvg() },

  { t: 'Bind mount a directory — or a single file', giua: true, body: `
${tiny(g('mkdir -p /host/nginx', 6), 14)}
${box('Same inode, three paths', 'Both mounts reach inode ' + inodes().old + '. Writing the file <b>in place</b> (O_TRUNC + write) changes that inode, so both views see 1024 at once.', 'lam')}` },

  { t: 'sed -i writes a new file and renames it', giua: true, body: `
${tiny(g('strace -f -e trace=openat,rename', 3), 13.5)}` },

  { t: 'Dir mount follows the name; file mount is pinned', body: pinSvg() },

  { t: '//deleted — and only a remount helps', giua: true, body: `
${tiny(g("grep '/ctr/etc/nginx.conf'") + '\n' + g("echo 'worker_connections 8192;'", 2), 14)}
${cards([
    ['//deleted', 'The inode the mount holds has no name any more.'],
    ['in-place write: too late', 'It now writes the NEW inode — the mount still shows 1024.'],
    ['remount', 'Re-resolves the name. For Docker: recreate the container.'],
  ])}` },

  { t: 'Do not guess what your editor does — check the inode', giua: true, body: `
${tiny(g('vi -es'), 14)}
${tbl(['how you change the file', 'inode', 'single-file mount sees it?'], [
    ['<code>echo … &gt; nginx.conf</code> / <code>cat new &gt; nginx.conf</code>', 'same (measured)', '✓ yes'],
    ['<code>sed -i</code>', 'new (measured)', '✗ no — //deleted'],
    ['<code>mv new nginx.conf</code>', 'new (a rename)', '✗ no'],
    ['<code>vim.tiny</code> in this image', 'same (measured)', '✓ yes — full vim: depends on backupcopy'],
    ['<code>rsync</code> (no --inplace), <code>git checkout</code>, Ansible copy', 'new (documented, not measured)', '✗ no'],
  ])}` },

  { t: 'What this project changed after 25/08/2026', giua: true, body: `
${steps(['Write the bind-mounted file <b>in place</b>: <code class="i">cat new &gt; nginx.conf</code> — never mv, rsync, sed -i', 'Verify <b>from inside</b> the container: sha256 on the host vs <code class="i">docker exec … sha256sum /etc/nginx/nginx.conf</code>', 'Different? Put the old file back and stop the deploy'])}
${vsd('“Written” = “the container sees it”.', 'Or avoid the trap: mount the <b>directory</b> (and write temp + rename inside it), or bake the config into the image.', '✗ The assumption', '✓ The fix')}` },

  { t: 'Read-only bind mounts protect your config', giua: true, to: true, body: `
${tiny(g('mount --bind -o ro'), 15)}
${box('In Docker', '<code class="i">-v ./nginx:/etc/nginx/conf.d:ro</code> — even root inside gets “Read-only file system”. Use :ro for every config you mount.', 'xanh')}` },

  { t: 'noexec, nosuid, nodev on an upload folder', giua: true, body: `
${tiny(g('mkdir -p /srv/public-uploads', 5), 14)}` },

  { t: 'Pitfall: noexec is a seatbelt, not a sandbox', giua: true, to: true, body: `
${vsd('<code class="i">sh shell.sh</code>, <code class="i">node evil.js</code>, <code class="i">python3 evil.py</code>: the interpreter is exec’d, the file is only <b>read</b> — noexec does not apply.',
    'Uploads outside the web root and code tree, server-generated names, content-type allow-list, nginx serving them as static files, an app user that cannot write its code.')}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>One tree, many file systems; Docker bind-mounts <b>/etc/hosts</b> & co. as single files</li>
<li>Mounting over a folder <b>hides</b> its files; they still use the lower disk</li>
<li>A single-file bind mount <b>pins one inode</b>; sed -i / mv / rsync install a new one</li>
<li>Update in place and <b>verify from inside</b> — or mount the directory, <b>:ro</b></li>
<li>noexec helps, but an interpreter can still run the file</li>
</ul>` },
]);
