/**
 * os-12-3 — khoá "Operating Systems for Developers", bài 12.3 "Image layers are an overlay mount" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c123-overlay|c123-host|c126-host.out.txt (chạy thật) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-12-3.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, two, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-12-3', code: 'OS 12.3', title: 'Image layers are an overlay mount', sub: 'Operating Systems · Chapter 12 — Containers' };

const g = (pre, n = 1) => grab('c123-overlay', pre, n);
const h = (pre, n = 1) => grab('c123-host', pre, n);
const cut = (t, w) => t.split('\n').map((l) => (l.length > w ? l.slice(0, w - 1) + '…' : l)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.d ? ' stroke-dasharray="7 5"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b', GY = '#777777';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">${inner}</svg>`;
const dockerfile = fs.readFileSync(new URL('../../content/courses/operating-systems-for-developers/lab/code/ch12/cache-demo/Dockerfile', import.meta.url), 'utf8')
  .split('\n').filter((l) => !l.startsWith('#')).join('\n').trim();

/* chồng lớp overlay: 4 hàng × 4 cột file */
const stack = () => {
  const X = 230, cw = 205, rows = [
    ['merged (what the container sees)', BL, ['app.conf  8080+', 'server.js', 'os-release', '— (deleted)']],
    ['upper (this container only)', GR, ['app.conf  copy-up', '', '', 'legacy.conf  c 0,0']],
    ['lower: app  (like COPY)', OR, ['app.conf  8080', 'server.js', '', '']],
    ['lower: base (like FROM)', GY, ['app.conf  80', '', 'os-release', 'legacy.conf']],
  ];
  let s = '';
  ['etc/app.conf', 'server.js', 'os-release', 'etc/legacy.conf'].forEach((f, j) => { s += T(X + j * cw + cw / 2, 22, f, 17, { a: 'middle', m: 1, w: 700, f: '#555' }); });
  rows.forEach(([name, c, cells], i) => {
    const y = 36 + i * 86;
    s += T(X - 14, y + 42, name.split(' (')[0], 19, { a: 'end', w: 700, f: c }) + (name.includes('(') ? T(X - 14, y + 64, '(' + name.split(' (')[1], 14, { a: 'end', f: '#777' }) : '');
    cells.forEach((v, j) => {
      const x = X + j * cw;
      if (!v) { s += R(x + 4, y + 8, cw - 8, 60, '#fafafa', '#ddd', { d: 1 }); return; }
      const wh = /c 0,0|deleted/.test(v);
      s += R(x + 4, y + 8, cw - 8, 60, wh ? '#fdecea' : c + '18', wh ? RD : c) + T(x + cw / 2, y + 45, v, 16, { a: 'middle', m: 1, w: 700, f: wh ? RD : '#333' });
    });
  });
  s += T(X + 2 * cw, 392, 'a read comes from the topmost layer that has the name; a whiteout hides it', 18, { a: 'middle', w: 700 });
  return svg(1110, 405, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 12 — Containers', bai: '12.3',
}, [
  { cover: true, t: 'Image layers are<br>an overlay mount', sub: 'lower, upper, work — copy-up, whiteouts and the build cache' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why every container’s <b>/</b> is an overlay of the image layers</li>
<li>An overlay mounted <b>by hand</b>: reads, writes, deletes</li>
<li>The price of <b>copy-up</b>, measured</li>
<li>docker history and docker diff with the same eyes</li>
<li>The <b>build cache</b>: what invalidates it, and how it fills disks</li>
</ul>` },

  { t: 'A container’s / : 14 lowerdirs and one upperdir', giua: true, body: term(g("cat /proc/self/mountinfo | grep -E ' / / ' | grep -oE 'lowerdir", 2) + '\n' + h('docker image inspect os-lab -f') + '\n' + grab('c126-host', 'docker run --rm --label oslab=1 alpine:latest sh -c "grep'), 16) +
    box('', 'One lowerdir per image layer (13 for os-lab, 1 for alpine) <b>+ one init layer</b> Docker adds per container. One private <b>upper</b>, one <b>work</b> directory.', 'lam') },

  { t: 'How the merged view is built', giua: true, body: stack() },

  { t: 'Mount an overlay by hand', giua: true, body: term(g('mkdir /ovl', 4) + '\n' + g('mount -t overlay', 2), 16) +
    box('', 'Everything on a tmpfs: an <b>upperdir cannot live on another overlay</b> — and the lab’s own root is one.', 'lam') },

  { t: 'The leftmost lowerdir wins', giua: true, to: true, body: term(g('ls merged merged/etc'), 20) +
    box('', '<code class="i">lowerdir=app:base</code> → app is on top: <b>8080</b> hides base’s 80. That is why a later Dockerfile instruction overrides an earlier one.', 'xanh') },

  { t: 'Writes go up: new files, and copy-up', giua: true, body: term(g('echo "GET /" > merged/access.log') + '\n' + g('echo "workers=4"', 2), 18) +
    box('', 'Modifying a lower file copies the <b>whole file</b> into upper, then changes it there. The lower layers stay untouched — one image, any number of containers.', 'lam') },

  { t: 'Deletes are whiteouts; replaced dirs are opaque', giua: true, body: term(g('rm merged/etc/legacy.conf') + '\n' + g('rm -rf merged/etc'), 18) +
    box('', 'Whiteout = character device <b>0,0</b> in upper. The file still sits in base, hidden — so <code class="i">RUN rm</code> in a later layer never shrinks an image.', 'do2') },

  { t: 'Copy-up has a price: one byte costs 200 MB', giua: true, to: true, body: term(g('du -sm upper', 2), 20) +
    box('', 'First append: <b>0.93 s</b> and upper 1 → <b>201 MB</b>. Second append: 1 ms — the file is already up.', 'do2') },

  { t: 'Pitfall: data inside the container layer', giua: true, to: true, body: vsd(
    'An image ships a SQLite file or a filled data dir; the first write copies it all into the container layer — slow, double the disk, gone with <code class="i">docker rm</code>.',
    'Mutable data on a <b>volume</b> or bind mount: a plain directory over that path, no overlay, survives the container (lesson 9.6).') },

  { t: 'docker history: one layer per instruction', giua: true, body: term(h('docker history'), 17) +
    box('', 'Two layers are most of the 1.9 GB: <b>apt-get install</b> 719 MB and the base JDK 309 MB.', 'lam') },

  { t: 'docker diff is the upper directory', giua: true, to: true, body: term(h('docker run --name os-c123-diff', 2), 17) +
    cards([['A', 'added — a new file in upper'], ['C', 'changed — a directory or file copied up'], ['D', 'deleted — a whiteout in upper']]) },

  { t: 'The build cache: a key per instruction', giua: true, body:
    sql(dockerfile, { lang: 'dockerfile' }).replace('<pre class="vs">', '<pre class="vs" style="white-space:pre-wrap;font-size:21px;line-height:1.5">') +
    box('Cache key', 'parent layer + instruction text + (for COPY) a checksum of the copied files. A new key re-runs that step <b>and every later one</b>.', 'lam') },

  { t: 'What re-runs: a source change vs a dependency change', giua: true, body: term(h('echo "console.log', 2).split('\n').slice(1).join('\n') + '\n' + h("echo '{\"name\":\"demo\",\"version\":\"1.0.1\"}'", 2).split('\n').slice(1).join('\n'), 13.5) +
    box('', 'Copy the dependency manifest and install <b>first</b>, copy the source <b>last</b>. <code class="i">COPY . .</code> first = npm ci on every commit.', 'xanh') },

  { t: 'The cache keeps growing — remember lesson 2.4', giua: true, to: true, body: term(h('docker system df'), 20) +
    box('', 'Every rebuild leaves layers: 115 entries, 5.7 GB on this Mac. On a server that is the incident where build cache filled the disk that also held Postgres. Prune with a filter, or do not build on production.', 'do2') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>/ of a container = <b>overlay</b>: image layers below, one private upper</li>
<li>Reads: topmost layer wins. Writes: <b>upper</b>. Lower never changes</li>
<li>Modify = <b>copy-up</b> of the whole file; delete = <b>whiteout</b></li>
<li>Mutable data on <b>volumes</b>, not in the container layer</li>
<li>Build cache: <b>manifest first, source last</b>; prune before the disk fills</li>
</ul>` },
]);
