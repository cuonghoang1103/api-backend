/**
 * os-09-6 — khoá "Operating Systems for Developers", bài 9.6 "How the kernel says no: rwx, umask, owners, who may
 * delete, setuid, setgid, sticky" (28/10/2026). Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c96-quyen.out.txt qua
 * grab(). Giảng: giang/os-09-6.mjs.
 */
import { lamDeck, sh, box, cards, vsd, sql } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';
import fs from 'node:fs';

export const deck = { key: 'os-09-6', code: 'OS 9.6', title: 'How the kernel says no', sub: 'Operating Systems · Chapter 9' };

const g = (pre, n = 1) => grab('c96-quyen', pre, n);
const SRC = (f) => fs.readFileSync(new URL(`../../content/courses/operating-systems-for-developers/lab/code/ch09/${f}`, import.meta.url), 'utf8');
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

/* 12 bit mode */
const bitsSvg = () => {
  const grp = [['special', ['setuid', 'setgid', 'sticky'], [4, 2, 1], PU, '4000 · 2000 · 1000'], ['owner (u)', ['r', 'w', 'x'], [4, 2, 1], BL, '400 · 200 · 100'], ['group (g)', ['r', 'w', 'x'], [4, 2, 1], GR, '40 · 20 · 10'], ['other (o)', ['r', 'w', 'x'], [4, 2, 1], OR, '4 · 2 · 1']];
  let s = '';
  grp.forEach(([n, b, v, c, oct], i) => {
    const x = 20 + i * 272;
    s += T(x + 124, 32, n, 20, { a: 'middle', w: 800, f: c });
    b.forEach((t, k) => { const bx = x + k * 84; s += R(bx, 46, 76, 64, c + '14', c) + T(bx + 38, 78, t, t.length > 1 ? 15 : 26, { a: 'middle', w: 800, f: c, m: 1 }) + T(bx + 38, 102, String(v[k]), 15, { a: 'middle', f: '#666' }); });
    s += T(x + 124, 136, oct, 15, { a: 'middle', m: 1, f: '#777' });
  });
  const ex = [['-rw-r--r--', '644', 'a normal file (.env before the fix)'], ['-rw-------', '600', 'a secret: only the owner'], ['drwxrwsr-x', '2775', 'team folder: setgid on a directory'], ['drwxrwxrwt', '1777', '/tmp: sticky'], ['-rwsr-xr-x', '4755', 'passwd, su: setuid root']];
  ex.forEach(([m, o, d], i) => { const y = 176 + i * 44; s += T(40, y, m, 22, { m: 1, w: 700 }) + T(280, y, o, 22, { m: 1, w: 800, f: BL }) + T(380, y, d, 19, { f: '#444' }); });
  return svg(1110, 394, s);
};

/* thứ tự kiểm */
const checkSvg = () => {
  let s = '';
  const box2 = (x, y, w, h, t1, t2, c) => R(x, y, w, h, c + '12', c) + T(x + w / 2, y + 32, t1, 19, { a: 'middle', w: 800, f: c }) + (t2 ? T(x + w / 2, y + 58, t2, 16, { a: 'middle', f: '#444' }) : '');
  s += box2(30, 20, 300, 72, 'process uid == owner?', 'effective uid vs inode uid', BL);
  s += box2(30, 140, 300, 72, 'a group matches?', 'primary + supplementary groups', GR);
  s += box2(30, 260, 300, 72, 'everybody else', '', OR);
  s += A(180, 94, 180, 136, GY) + T(194, 122, 'no', 16, { f: '#666' }) + A(180, 214, 180, 256, GY) + T(194, 242, 'no', 16, { f: '#666' });
  s += A(332, 56, 470, 56, BL) + T(400, 46, 'yes', 16, { a: 'middle', f: BL }) + box2(474, 20, 300, 72, 'use ONLY owner bits', 'result is final', BL);
  s += A(332, 176, 470, 176, GR) + T(400, 166, 'yes', 16, { a: 'middle', f: GR }) + box2(474, 140, 300, 72, 'use ONLY group bits', 'result is final', GR);
  s += A(332, 296, 470, 296, OR) + box2(474, 260, 300, 72, 'use other bits', '', OR);
  s += A(776, 176, 846, 176, RD) + box2(850, 120, 240, 112, 'denied?', '', RD) + T(970, 196, 'capability check:', 15, { a: 'middle', f: '#444' }) + T(970, 218, 'CAP_DAC_OVERRIDE', 15, { a: 'middle', m: 1, w: 700, f: RD });
  s += `<line x1="776" y1="56" x2="810" y2="56" stroke="${RD}" stroke-width="2"/><line x1="810" y1="56" x2="810" y2="296" stroke="${RD}" stroke-width="2"/><line x1="776" y1="296" x2="810" y2="296" stroke="${RD}" stroke-width="2"/>`;
  s += T(30, 376, 'The first matching class decides — the kernel never falls through to a more generous one.', 18, { w: 700, f: '#444' });
  return svg(1110, 392, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 9 — File systems', bai: '9.6',
}, [
  { cover: true, t: 'How the kernel says<br>“Permission denied”', sub: 'rwx, umask, owners, who may delete, setuid, setgid, sticky' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>algorithm</b> the kernel runs on every open() — and its surprises</li>
<li><b>umask</b>: the bits you never asked for</li>
<li><b>r, w, x on a directory</b>, and who may <b>delete</b> a file</li>
<li><b>sticky</b>, <b>setgid</b> folders for a team, <b>setuid</b> programs</li>
<li>What root can and cannot do — before we take root apart (9.7)</li>
</ul>` },

  { t: 'Every process carries an identity', giua: true, body: `
${sh(g('id dev; id bob') + '\n' + g('ls -l /srv/app/.env'))}
${cards([
    ['uid · gid · groups', 'Numbers, inherited at fork and kept at exec — the kernel compares them with the inode.'],
    ['owner · group · mode', 'Each inode stores one uid, one gid and 12 mode bits.'],
    ['644', 'rw for the owner, r for the group, r for everyone else.'],
  ])}` },

  { t: 'Twelve mode bits', body: bitsSvg() },

  { t: 'The check, in order — the first match wins', body: checkSvg() },

  { t: 'The owner cannot read his own file — others can', giua: true, body: `
${sh(g('ls -l /tmp/own.txt', 3))}
${box('Why', 'Mode 077, owner dev. dev <b>is</b> the owner → only the owner bits (<code class="i">---</code>) count → denied. bob is neither owner nor in group dev → the “other” bits (<code class="i">rwx</code>) → allowed.', 'do2')}` },

  { t: 'umask removes bits from every new file', giua: true, body: `
${tiny(g('umask', 4), 14.5)}
${cards([
    ['022 → 644 / 755', 'The usual default: group and others lose w.'],
    ['077 → 600 / 700', 'Private: only the owner.'],
    ['even Node’s 0o666', 'came out 644. Set UMask= in systemd or umask in the entrypoint, or chmod after creating.'],
  ])}` },

  { t: 'On a directory, r lists names and x reaches inodes', giua: true, body: `
${tiny(g('chmod 744 /srv/box') + '\n' + g('chmod 711 /srv/box'), 14.5)}
${cards([
    ['r without x (744)', 'dev reads the NAMES (q3.txt) but cannot stat or open anything: ??????'],
    ['x without r (711)', 'dev cannot list, but opens a file whose exact name he knows.'],
    ['w (needs x)', 'Add, remove, rename names in this directory.'],
  ])}` },

  { t: 'Who may delete a file? The directory decides', giua: true, body: `
${sh(g('ls -l /srv/devdir/owned-by-root') + '\n' + g('ls -ld /srv/app; ls -l'))}
${vsd('dev <b>could not</b> delete his own dev-notes.txt: /srv/app (755, root) does not let him change its list of names.',
    'dev <b>did</b> delete a read-only file owned by root: it sat in his own directory. Deleting = editing the directory.', 'his file, root’s folder', 'root’s file, his folder')}` },

  { t: 'The sticky bit: in /tmp you delete only your own files', giua: true, body: `
${tiny(g('ls -ld /tmp', 2), 14.5)}
${cards([
    ['/tmp = 1777 (t)', 'Writable by all, but a name can be removed only by the file’s or the directory’s owner.'],
    ['EPERM, not EACCES', '“Operation not permitted” = a rule; “Permission denied” = the rwx bits.'],
    ['/srv/drop = 777', 'No sticky bit: dev deleted bob’s session file without any error.'],
  ])}` },

  { t: 'setgid on a directory: one group for the whole team', giua: true, body: `
${sh(g('mkdir /srv/team', 2))}
${box('2775 = setgid + rwxrwxr-x', 'New files inherit the <b>directory’s</b> group (team), not each creator’s primary group. Add <code class="i">umask 002</code> and the team can edit each other’s files.', 'xanh')}` },

  { t: 'setuid: run with the file owner’s identity', giua: true, body: `
${sql(SRC('ids.c').split('\n').filter((l) => !l.startsWith('//')).join('\n'), { lang: 'c', sm: true })}
${tiny(g('ls -l /usr/bin/passwd /usr/bin/su') + '\n' + g('chmod 600 /srv/app/.env; runuser -u dev -- ids', 2), 13.5)}` },

  { t: 'Every setuid-root program is a privilege boundary', giua: true, body: `
${sh(g('find / -xdev -perm -4000'))}
${cards([
    ['the usual few', 'passwd, su, mount, chsh… each one a reason to keep packages updated.'],
    ['/usr/local/bin/ids', 'Stands out — exactly what a backdoor looks like (Chapter 13).'],
    ['ignored when', 'The file is a #! script, or the file system is mounted nosuid (9.5).'],
  ])}` },

  { t: 'Root: reads a 000 file, cannot exec a file without x', giua: true, to: true, body: `
${sh(g('chmod 000 /srv/app/.env') + '\n' + g("printf '#!/bin/sh"))}
${box('Root is a set of capabilities', 'CAP_DAC_OVERRIDE overrides rwx for reading and writing; for executing it still needs at least one x bit somewhere in the mode. Lesson 9.7 takes root apart.', 'lam')}` },

  { t: 'Pitfall: chmod -R 777 “to fix Permission denied”', giua: true, to: true, body: vsd(
    'It works at once — and now every user and every process on the box, including a compromised dependency, can <b>write</b> your code and config, and delete anyone’s files.',
    'Find the component that refuses (<code class="i">namei&nbsp;-l</code>, 9.7), give the right <b>group</b> r/X or an <b>ACL</b>, keep others at nothing.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Owner, else group, else other — <b>only that class’s bits</b> count</li>
<li><b>umask</b> strips bits from every create</li>
<li>Directory: <b>r</b> lists, <b>x</b> traverses, <b>w</b> changes names</li>
<li>Deleting needs <b>w+x on the directory</b>; sticky adds an owner rule</li>
<li><b>setuid</b> borrows the owner’s uid — audit with find -perm -4000</li>
</ul>` },
]);
