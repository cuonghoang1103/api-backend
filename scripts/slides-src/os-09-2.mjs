/**
 * os-09-2 — khoá "Operating Systems for Developers", bài 9.2 "File descriptors and the open-file table" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c92-fd.out.txt (chạy thật) qua grab(). Giảng: giang/os-09-2.mjs.
 */
import { lamDeck, sh, box, cards, vsd, steps } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-09-2', code: 'OS 9.2', title: 'File descriptors and the open-file table', sub: 'Operating Systems · Chapter 9' };

const g = (pre, n = 1) => grab('c92-fd', pre, n);
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

/* ba tầng bảng: fd table (2 tiến trình) → open file description → inode */
const baBang = () => {
  let s = '';
  s += T(130, 26, 'fd table (per process)', 19, { a: 'middle', w: 800, f: '#555' }) + T(555, 26, 'open file descriptions (kernel)', 19, { a: 'middle', w: 800, f: '#555' }) + T(960, 26, 'inodes', 19, { a: 'middle', w: 800, f: '#555' });
  const proc = (y, name, rows) => {
    s += R(20, y, 220, 34 + rows.length * 40, '#fafafa', GY) + T(130, y + 24, name, 18, { a: 'middle', w: 800 });
    rows.forEach(([fd, c], i) => { s += R(36, y + 34 + i * 40, 188, 32, '#fff', c, { rx: 4 }) + T(50, y + 56 + i * 40, `fd ${fd}`, 18, { m: 1, w: 700, f: c }); });
  };
  proc(46, 'worker A (pid 101)', [[3, BL], [4, BL]]);
  proc(214, 'child after fork (pid 102)', [[3, BL]]);
  proc(330, 'worker B (pid 103)', [[3, OR]]);
  s += R(390, 70, 330, 96, BL + '12', BL) + T(410, 100, 'description #1', 19, { w: 800, f: BL }) + T(410, 128, 'offset 39 · O_WRONLY', 18, { m: 1 }) + T(410, 154, 'shared by dup() and fork()', 16, { f: '#555' });
  s += R(390, 330, 330, 96, OR + '14', OR) + T(410, 360, 'description #2', 19, { w: 800, f: OR }) + T(410, 388, 'offset 13 · its own!', 18, { m: 1 }) + T(410, 414, 'created by a second open()', 16, { f: '#555' });
  s += A(224, 96, 386, 108, BL) + A(224, 136, 386, 126, BL) + A(224, 264, 386, 150, BL, { dash: 1 }) + A(224, 380, 386, 378, OR);
  s += R(820, 190, 270, 110, GR + '12', GR) + T(840, 222, 'inode of orders.log', 19, { w: 800, f: GR }) + T(840, 252, 'size · owner · blocks', 17, { m: 1 }) + T(840, 280, 'no offset here', 16, { f: RD, w: 700 });
  s += A(722, 120, 816, 220, GR) + A(722, 376, 816, 274, GR);
  s += T(20, 466, 'dup / fork → same description, same offset · second open() → new description, new offset → overwrites', 17, { f: '#555' });
  return svg(1110, 476, s, 0.98);
};

/* chuyển hướng = dup2: bảng fd của shell con, từng bước */
const dup2Svg = () => {
  let s = '';
  const col = (x, title, rows, hl) => {
    s += T(x + 120, 30, title, 18, { a: 'middle', w: 800, f: '#444' });
    rows.forEach(([fd, to, c], i) => { const y = 48 + i * 50; s += R(x, y, 240, 40, i === hl ? c + '22' : '#fff', c, { rx: 4, sw: i === hl ? 3 : 2 }) + T(x + 12, y + 27, `${fd} → ${to}`, 17, { m: 1, w: i === hl ? 800 : 400, f: c }); });
  };
  col(10, 'start (child of the shell)', [[1, 'terminal', GY], [2, 'terminal', GY], [3, '—', GY]], -1);
  col(290, 'openat → 3', [[1, 'terminal', GY], [2, 'terminal', GY], [3, 'out.txt', BL]], 2);
  col(570, 'dup3(3, 1)  "> out.txt"', [[1, 'out.txt', BL], [2, 'terminal', GY], [3, 'out.txt', BL]], 0);
  col(850, 'dup3(1, 2)  "2>&amp;1"', [[1, 'out.txt', BL], [2, 'out.txt', BL], [3, '(closed)', GY]], 1);
  [260, 540, 820].forEach((x) => { s += A(x, 98, x + 26, 98, OR); });
  s += T(10, 236, 'then execve("ls") — ls just writes to 1 and 2. Written as  2>&amp;1 > out.txt  the dup3(1, 2) runs FIRST, while 1 is still the terminal.', 17, { f: '#555' });
  return svg(1110, 250, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 9 — File systems', bai: '9.2',
}, [
  { cover: true, t: 'Three tables between<br>“fd 3” and the disk', sub: 'File descriptors and the open-file table' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>file descriptor</b> is — and what the kernel keeps behind it</li>
<li><b>/proc/PID/fd</b> and <b>fdinfo</b>: offsets and flags, read live</li>
<li>Why two workers <b>overwrite</b> each other’s log lines — and how <b>O_APPEND</b> fixes it</li>
<li>Why <code class="i">2&gt;&amp;1 &gt; f</code> is not <code class="i">&gt; f 2&gt;&amp;1</code>: redirection is <b>dup2</b></li>
<li>How a secret leaks into a child program — and <b>O_CLOEXEC</b></li>
</ul>` },

  { t: 'Every process has a descriptor table', giua: true, body: `
${sh(g('ls -l /proc/$$/fd'))}
${cards([
    ['0 · 1 · 2', 'stdin, stdout, stderr. Here 1 and 2 are the same pipe.'],
    ['255', 'Where bash keeps the script it is reading.'],
    ['lowest free number', 'Your first open() is almost always fd 3.'],
  ])}` },

  { t: 'Behind fd 3: an offset the kernel keeps', giua: true, body: `
${sh(g('exec 3< /tmp/users.txt') + '\n' + g('read -r first', 3) + '\n' + g('read -r second'))}
<p style="margin:0;font-size:21px"><b>pos: 13</b> after "alice:x:1001\\n", <b>24</b> after the next line. The offset lives neither in the inode nor in your program — it lives in the <b>open file description</b> created by open().</p>` },

  { t: 'fd table → open file description → inode', body: baBang() },

  { t: 'dup(): two fds, one description, one offset', giua: true, body: `
${sh(g('./ofd dup'))}
${box('Same description', 'fd 3 and fd 4 both report <b>pos 39</b>: the second write continued where the first stopped. Nothing is lost.', 'xanh')}` },

  { t: 'open() twice: two offsets — and an order is destroyed', giua: true, body: `
${sh(g('./ofd twice'), { hl: [4, 5] })}
${box('Silent overwrite', 'B’s description started at offset 0, so “worker B: hi\\n” landed <b>on top of</b> A’s line. What is left: <code class="i">worker B: hi</code> + the tail <code class="i">er 1001 paid</code>. No error anywhere.', 'do2')}` },

  { t: 'O_APPEND: every write jumps to the end first', giua: true, body: `
${sh(g('./ofd append'))}
${cards([
    ['one atomic step', 'Move the offset to end-of-file and write — inside the kernel, per write().'],
    ['Node', '<code class="i">createWriteStream(p, { flags: \'a\' })</code>, <code class="i">appendFileSync</code> use it; the default \'w\' does not (and truncates).'],
    ['better still', 'Log to stdout: one writer, one offset, collected by Docker/systemd.'],
  ])}` },

  { t: 'fork(): the child copies the table, shares the description', giua: true, body: `
${sh(g('./ofd fork'))}
${box('Why (build; test) &gt; ci.log works', 'The child wrote two lines (offset 28); the parent’s next write continued at 28, not 0 — final offset 42, three lines intact. Every child of a shell shares stdout’s offset.', 'lam')}` },

  { t: 'Redirection is dup2(), applied left to right', giua: true, body: `
${tiny(g('strace -f -e trace=openat,dup2,dup3,close,execve bash'), 13)}
${dup2Svg()}` },

  { t: 'So the order of redirections matters', to: true, giua: true, body: `
${sh(g('ls /nope > /tmp/out.txt 2>&1', 2))}
${steps([
    '<code class="i">&gt; f 2&gt;&amp;1</code>: fd 1 → file, then fd 2 → <i>whatever fd 1 is now</i> = file ✓',
    '<code class="i">2&gt;&amp;1 &gt; f</code>: fd 2 → <i>whatever fd 1 is now</i> = terminal, then fd 1 → file ✗',
  ])}` },

  { t: 'exec() keeps open fds — a secret walks into a child', giua: true, body: `
${sh(g('./leak', 2), { hl: [6] })}
<p style="margin:0;font-size:21px">Without <b>O_CLOEXEC</b>, the third-party <code class="i">ls</code> received fd 3 open on <code class="i">/tmp/app/.env</code> without ever opening it. With O_CLOEXEC the kernel closes it during exec.</p>` },

  { t: 'Node (and Python ≥ 3.4) close-on-exec by default', giua: true, body: `
${tiny(g('node -e'), 14)}
${vsd('In C, Go’s raw syscalls, or any <code class="i">open()</code> you call yourself: forgetting O_CLOEXEC hands your files to every program you launch.',
    'Node opens everything with O_CLOEXEC: the child sees only its own pipes/sockets 0–2.', '✗ Your job', '✓ Done for you')}` },

  { t: 'Pitfall: several workers, one log, no O_APPEND', giua: true, to: true, body: `
${vsd('PM2 cluster, gunicorn workers, two cron jobs: each <b>open()s</b> the log itself → its own description and offset → lines overwrite each other, no error.',
    'Open with <b>O_APPEND</b> (flags \'a\'), or log to <b>stdout</b> and let one collector write the file.')}
${box('How to see it live', '<code class="i">grep pos /proc/PID/fdinfo/*</code> for each worker: different offsets on the same file = trouble.', 'lam')}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li><b>fd → open file description → inode</b>: three levels, three owners</li>
<li>dup and fork <b>share</b> an offset; a second open() gets its own</li>
<li><b>O_APPEND</b> for every shared log</li>
<li>Redirection = <b>dup2 left to right</b></li>
<li>exec keeps fds — <b>O_CLOEXEC</b> keeps secrets home</li>
</ul>` },
]);
