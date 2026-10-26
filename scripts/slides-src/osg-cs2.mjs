/**
 * osg-cs2 — OSG202 · ⭐ Advanced 2 "File descriptors & I/O plumbing" (deck tự dựng, slide EN, khuôn _pg-chung.mjs, 26/10/2026).
 * Đề cương: REPO/OSG202/CHUYEN-SAU.md mục 2. MỌI output = CHẠY THẬT bằng runner của gen (ảnh osg202-lab: Debian 12.15 aarch64,
 *   nhân 7.0.12-linuxkit, gcc 12.2, Node v22.23.4, Temurin 21.0.12.1; --network none), chương trình + output ở
 *   REPO/OSG202/gen/code/cs2/*.{c,sh,js,java} + *.out.txt (slide chép nguyên output, chỉ cắt cột/dòng có ghi chú).
 * Nguồn tra: man7 pipe(7) (65 536 byte, PIPE_BUF 4096, EOF khi mọi đầu ghi đóng, SIGPIPE/EPIPE), open(2) (O_CLOEXEC, fd thấp nhất),
 *   dup(2), getrlimit(2), proc(5) (fd/, fdinfo/), fsync(2); postgresql.org docs data_sync_retry + release notes 11.2 (14/02/2019:
 *   panic thay vì thử lại sau lỗi fsync); systemd NEWS v240 (LimitNOFILE mặc định 1024 mềm / 512K cứng); nodejs.org fs (DEP0137).
 * Dự án thật: nginx/nginx.conf (worker_rlimit_nofile 65535, worker_connections 4096, use epoll).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, steps, kw, vsd } from './_pg-chung.mjs';

export const deck = { key: 'cs2', code: 'CS.2', title: 'File descriptors & I/O plumbing', sub: 'OSG202 · ⭐ Advanced' };

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
const tw = (s, fs) => Math.ceil(String(s).length * 0.602 * fs); // bề rộng chữ SVG (công thức khuôn)
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
const L = (x1, y1, x2, y2, c, id, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="6 5"' : ''}${id ? ` marker-end="url(#${id})"` : ''}/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', GY = '#8a8a8a';

/* ── Slide 3: phòng gửi áo ── */
const cloak = () => {
  let s = `<svg viewBox="0 0 1110 200" width="1110" height="200" font-family="Arial"><defs>${MK('osg-a', BR)}</defs>`;
  s += R(10, 30, 250, 140, '#fff7ef', OR, { rx: 12, sw: 2.5 });
  s += T(135, 66, 'YOU (a process)', 20, { a: 'middle', w: 800, f: BR });
  s += T(135, 100, 'holds tickets 3, 4, 5', 17, { a: 'middle' });
  s += T(135, 128, 'never touches the coats', 16, { a: 'middle', f: '#666' });
  s += L(266, 100, 420, 100, BR, 'osg-a');
  s += T(343, 88, 'read(4)', 16, { a: 'middle', f: BR, w: 700, m: 1 });
  s += R(430, 12, 300, 176, '#eef4fa', BL, { rx: 12, sw: 2.5 });
  s += T(580, 44, 'CLOAKROOM (the kernel)', 20, { a: 'middle', w: 800, f: BL });
  [['3', 'coat = a file'], ['4', 'bag = a pipe'], ['5', 'phone = a socket']].forEach(([n, t], i) => {
    s += R(452, 60 + i * 40, 46, 30, '#fff', BL, { rx: 6 });
    s += T(475, 81 + i * 40, n, 18, { a: 'middle', w: 800, f: BL });
    s += T(512, 81 + i * 40, t, 17);
  });
  s += R(760, 30, 340, 140, '#fdf0ee', RD, { rx: 12, sw: 2 });
  s += T(930, 64, 'only N hooks', 20, { a: 'middle', w: 800, f: RD });
  s += T(930, 96, 'ulimit -n = how many tickets', 16, { a: 'middle' });
  s += T(930, 122, 'one person may hold', 16, { a: 'middle' });
  s += T(930, 152, 'no hook left: EMFILE', 17, { a: 'middle', w: 700, f: RD, m: 1 });
  return s + '</svg>';
};

/* ── Slide 4: ba tầng — bảng fd → open file description → inode/pipe/socket ── */
const threeLayers = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial"><defs>${MK('osg-b', BL)}${MK('osg-o', OR)}</defs>`;
  s += T(110, 22, 'per process: fd table', 17, { a: 'middle', w: 800, f: BR });
  s += T(560, 22, 'kernel: open file descriptions', 17, { a: 'middle', w: 800, f: BL });
  s += T(950, 22, 'the object', 17, { a: 'middle', w: 800, f: GR });
  const proc = (y, name, rows) => {
    s += R(10, y, 200, 34 + rows.length * 30, '#fff7ef', OR, { rx: 10 });
    s += T(110, y + 24, name, 16, { a: 'middle', w: 800, f: BR });
    rows.forEach(([fd], i) => { s += R(30, y + 34 + i * 30, 160, 26, '#fff', OR, { rx: 4, sw: 1.5 }); s += T(44, y + 53 + i * 30, `fd ${fd}`, 16, { m: 1 }); });
  };
  proc(36, 'process A (pid 12)', [['0'], ['1'], ['3']]);
  proc(176, 'process B = fork(A)', [['1'], ['3']]);
  const ofd = [[60, 'offset 0 · O_RDONLY', 'stdin'], [118, 'offset 0 · O_WRONLY', 'stdout'], [176, 'offset 4096 · O_RDWR', 'data.db'], [234, 'O_RDONLY · O_NONBLOCK', 'socket']];
  ofd.forEach(([y, t]) => { s += R(420, y - 22, 280, 40, '#eef4fa', BL, { rx: 8 }); s += T(560, y + 4, t, 16, { a: 'middle', m: 1 }); });
  // mũi tên A
  s += L(192, 83, 416, 60, BL, 'osg-b'); s += L(192, 113, 416, 118, BL, 'osg-b'); s += L(192, 143, 416, 176, BL, 'osg-b');
  // B (fork) chia sẻ cùng mô tả
  s += L(192, 223, 416, 122, OR, 'osg-o', { dash: 1 }); s += L(192, 253, 416, 180, OR, 'osg-o', { dash: 1 });
  const obj = [[60, '/dev/pts/0 (terminal)'], [118, 'pipe → docker logs'], [176, 'inode 1842 on ext4'], [234, 'TCP 10.0.0.5:5432']];
  obj.forEach(([y, t]) => { s += R(800, y - 22, 300, 40, '#f1f9f4', GR, { rx: 8 }); s += T(950, y + 4, t, 16, { a: 'middle' }); s += L(702, y, 796, y, GR, null, { sw: 2 }); });
  s += T(300, 292, 'after fork(), A and B SHARE one description (dashed) → same offset', 15, { a: 'middle', f: OR, w: 700 });
  s += T(950, 292, 'file · pipe · socket · device', 15, { a: 'middle', f: GR, w: 700 });
  return s + '</svg>';
};

/* ── Slide 9: một ống giữa hai tiến trình ── */
const pipeSvg = () => {
  let s = `<svg viewBox="0 0 1110 170" width="1110" height="170" font-family="Arial"><defs>${MK('osg-a', BR)}</defs>`;
  s += R(10, 40, 230, 92, '#fff7ef', OR, { rx: 12, sw: 2.5 });
  s += T(125, 76, 'echo hi', 20, { a: 'middle', w: 800, f: BR, m: 1 });
  s += T(125, 106, 'fd 1 = write end', 16, { a: 'middle' });
  s += L(244, 86, 356, 86, BR, 'osg-a', { sw: 3 });
  s += T(300, 74, 'write()', 15, { a: 'middle', f: BR, m: 1 });
  s += R(362, 46, 386, 80, '#eef4fa', BL, { rx: 40, sw: 3 });
  s += T(555, 80, 'PIPE — a kernel buffer', 19, { a: 'middle', w: 800, f: BL });
  s += T(555, 106, '64 KiB · FIFO · no name on disk', 15, { a: 'middle', f: '#555' });
  s += L(752, 86, 864, 86, BR, 'osg-a', { sw: 3 });
  s += T(808, 74, 'read()', 15, { a: 'middle', f: BR, m: 1 });
  s += R(870, 40, 230, 92, '#fff7ef', OR, { rx: 12, sw: 2.5 });
  s += T(985, 76, 'tr a-z A-Z', 20, { a: 'middle', w: 800, f: BR, m: 1 });
  s += T(985, 106, 'fd 0 = read end', 16, { a: 'middle' });
  s += T(555, 160, 'full → the writer blocks · empty → the reader blocks · no writer left → read() = 0 (EOF) · no reader left → SIGPIPE', 15, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* ── Slide 16: đồ thị số fd theo số request (số thật từ ro-ri-ket-noi.out.txt) ── */
const leakChart = () => {
  const W = 560, H = 300, x0 = 60, y0 = 250, sx = (W - 90) / 600, sy = 200 / 140;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" font-family="Arial">`;
  s += L(x0, y0, W - 20, y0, '#999', null, { sw: 1.5 }) + L(x0, y0, x0, 30, '#999', null, { sw: 1.5 });
  [0, 32, 64, 96, 128].forEach((v) => { const y = y0 - v * sy; s += T(x0 - 8, y + 5, v, 14, { a: 'end', f: '#777' }); s += `<line x1="${x0}" y1="${y}" x2="${W - 20}" y2="${y}" stroke="#eee"/>`; });
  [0, 100, 200, 300, 400, 500, 600].forEach((v) => s += T(x0 + v * sx, y0 + 20, v, 14, { a: 'middle', f: '#777' }));
  s += T((x0 + W) / 2, y0 + 44, 'requests (1 in 5 fails)', 15, { a: 'middle', f: '#555' });
  const ly = y0 - 128 * sy;
  s += L(x0, ly, W - 20, ly, RD, null, { sw: 2, dash: 1 });
  s += T(x0 + 8, ly - 8, 'ulimit -n 128', 15, { f: RD, w: 700 });
  const bug = [[0, 21], [100, 41], [200, 61], [300, 81], [400, 101], [500, 121], [540, 128]];
  const fix = [[0, 21], [100, 22], [200, 22], [300, 22], [400, 21], [500, 21], [600, 22]];
  const path = (d, c) => `<polyline fill="none" stroke="${c}" stroke-width="3.5" points="${d.map(([a, b]) => `${x0 + a * sx},${y0 - b * sy}`).join(' ')}"/>` + d.map(([a, b]) => `<circle cx="${x0 + a * sx}" cy="${y0 - b * sy}" r="4.5" fill="${c}"/>`).join('');
  s += path(bug, RD) + path(fix, GR);
  s += T(x0 + 540 * sx, ly + 26, 'EMFILE', 16, { a: 'middle', f: RD, w: 800 });
  s += T(x0 + 230 * sx, y0 - 70 * sy, 'leaky: +1 fd per failed request', 15, { a: 'middle', f: RD, w: 700 });
  s += T(x0 + 330 * sx, y0 - 30 * sy, 'fixed: flat at 21–22', 15, { a: 'middle', f: GR, w: 700 });
  return s + '</svg>';
};

/* ── Slide 19: đường đi của một lần ghi ── */
const writePath = () => {
  let s = `<svg viewBox="0 0 1110 205" width="1110" height="205" font-family="Arial"><defs>${MK('osg-a', BR)}${MK('osg-g', GR)}</defs>`;
  const box2 = (x, w, t, sub, c, f) => { s += R(x, 40, w, 92, f, c, { rx: 12, sw: 2.5 }); s += T(x + w / 2, 76, t, 19, { a: 'middle', w: 800, f: c }); s += T(x + w / 2, 104, sub, 15, { a: 'middle', f: '#555' }); };
  box2(10, 200, 'your buffer', 'printf / BufferedWriter', OR, '#fff7ef');
  box2(290, 250, 'page cache (RAM)', 'pages marked "Dirty"', BL, '#eef4fa');
  box2(640, 200, 'disk / SSD', 'durable, survives power', GR, '#f1f9f4');
  s += L(214, 86, 284, 86, BR, 'osg-a', { sw: 3 });
  s += T(249, 30, 'write()', 16, { a: 'middle', f: BR, w: 800, m: 1 });
  s += T(249, 160, 'returns HERE', 15, { a: 'middle', f: BR, w: 700 });
  s += L(544, 86, 634, 86, GR, 'osg-g', { sw: 3 });
  s += T(589, 30, 'writeback', 15, { a: 'middle', f: GR, w: 800 });
  s += T(589, 160, '~5–30 s later', 15, { a: 'middle', f: GR });
  s += R(870, 26, 230, 120, '#fdf0ee', RD, { rx: 12, sw: 2 });
  s += T(985, 58, 'fsync(fd)', 19, { a: 'middle', f: RD, w: 800, m: 1 });
  s += T(985, 86, 'forces writeback NOW', 15, { a: 'middle' });
  s += T(985, 110, 'and waits until the', 15, { a: 'middle' });
  s += T(985, 132, 'device confirms', 15, { a: 'middle' });
  s += T(555, 196, 'power cut between write() and writeback = data the app thought was saved is gone', 16, { a: 'middle', f: RD, w: 700 });
  return s + '</svg>';
};

/* ── Slide 21: COMMIT của PostgreSQL ── */
const pgCommit = () => {
  let s = `<svg viewBox="0 0 1110 210" width="1110" height="210" font-family="Arial"><defs>${MK('osg-a', BR)}${MK('osg-g', GR)}</defs>`;
  const st = [[20, 'UPDATE …', 'edits pages in RAM', BL], [300, 'WAL record', 'appended to pg_wal/', OR], [580, 'COMMIT', 'fdatasync(WAL) — wait', RD], [860, '"COMMIT" to client', 'WAL is on the disk', GR]];
  st.forEach(([x, t, d, c], i) => {
    s += R(x, 30, 230, 86, '#fff', c, { rx: 12, sw: 2.5 });
    s += T(x + 115, 64, t, 19, { a: 'middle', w: 800, f: c });
    s += T(x + 115, 96, d, 16, { a: 'middle', f: '#444' });
    if (i < 3) s += L(x + 234, 73, x + 276, 73, BR, 'osg-a', { sw: 3 });
  });
  s += R(20, 140, 1070, 56, '#f1f9f4', GR, { rx: 10, sw: 1.5, dash: 1 });
  s += T(555, 165, 'Data files (tables, indexes) are written LATER by the checkpointer — one fsync for many changes.', 16, { a: 'middle', f: GR, w: 700 });
  s += T(555, 187, 'Crash before that? Replay the WAL. That is why the WAL fsync must never lie.', 16, { a: 'middle', f: '#444' });
  return s + '</svg>';
};

/* ── Slide 24: 3 giờ sáng ── */
const nightTL = () => {
  let s = `<svg viewBox="0 0 1110 150" width="1110" height="150" style="flex:none" font-family="Arial">`;
  s += L(20, 70, 1090, 70, '#bfbfbf', null, { sw: 4 });
  const ev = [[80, 'Mon 10:00', 'deploy v2.3', GY], [270, 'all day', 'fds +1 / failed req.', OR], [470, 'Tue 03:07', 'EMFILE: accept, DB,', RD], [690, '03:08', 'health check fails', RD], [880, '03:15', 'restart → "fixed"', BL], [1040, 'Wed 03:0x', 'again', RD]];
  ev.forEach(([x, t, d, c]) => {
    s += `<circle cx="${x}" cy="70" r="11" fill="#fff" stroke="${c}" stroke-width="5"/>`;
    s += T(x, 42, t, 16, { a: 'middle', w: 800, f: c });
    s += T(x, 102, d, 15, { a: 'middle' });
  });
  s += T(470, 124, 'logs, files, sockets', 15, { a: 'middle' });
  s += T(880, 124, 'kernel closes every fd', 15, { a: 'middle', f: '#666' });
  return s + '</svg>';
};

export const slides = lamDeck({ khoa: 'Operating Systems', duong: 'academy/osg202', bieuTuong: '🐧', khau: 'from zero to real backend work',
  chuong: '⭐ Advanced 2 — File descriptors & I/O plumbing', bai: 'CS.2' }, [

  /* 1 */
  { cover: true, t: 'File descriptors<br>&amp; I/O plumbing', sub: 'fd table · redirection &amp; pipes · sockets ·<br>ulimit &amp; EMFILE · O_CLOEXEC · page cache &amp; fsync' },

  /* 2 */
  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>See the <b>file descriptor table</b> of any process: <code class="i">/proc/&lt;pid&gt;/fd</code>, 0/1/2</li>
<li>Explain <b>&gt;</b>, <b>2&gt;&amp;1</b> and <b>|</b> as plain system calls: <b>open + dup2</b>, <b>pipe + fork</b> — and write a mini shell in C</li>
<li>Find who holds a <b>socket</b>: <code class="i">lsof</code>, <code class="i">ss -p</code>, <code class="i">fdinfo</code></li>
<li>Create <b>“Too many open files” (EMFILE)</b> on purpose, find the <b>leak</b>, fix it (Node, Java)</li>
<li><b>O_CLOEXEC</b>, the <b>page cache</b>, <b>fsync</b> and why PostgreSQL bets everything on it</li>
<li>Why <code class="i">printf</code> + <code class="i">fork</code> can print a line <b>twice</b></li>
</ul>
${box('Beyond the school slides', 'Lesson 5.A taught the I/O hardware and lesson 4.A files and directories. This deck shows the <b>process side</b> of I/O on a real Linux server. Every output is a real run: Debian 12, kernel 7.0 (ARM64), gcc 12.2, Node 22.23, Java 21.0.12.', 'lam')}` },

  /* 3 */
  { t: 'First, a picture: the cloakroom ticket', giua: true, body: `
${cloak()}
<table class="t" style="font-size:20px">
<tr><th style="width:45%">At the cloakroom</th><th>In Linux</th></tr>
<tr><td>You hand in a coat, you get <b>ticket 3</b></td><td><code class="i">open()</code> returns a <b>file descriptor</b>: a small int</td></tr>
<tr><td>The ticket is just a number — the coat stays inside</td><td>the kernel keeps the file; your process only has the number</td></tr>
<tr><td>Next free ticket = the <b>lowest</b> free number</td><td>a new fd is always the lowest unused one</td></tr>
<tr><td>Give the ticket back</td><td><code class="i">close(fd)</code> — forget it and the hooks run out</td></tr>
</table>` },

  /* 4 */
  { t: 'What a file descriptor really is', giua: true, body: `
${threeLayers()}
<p style="margin:0;font-size:21px">${kw('fd', 'index into your fd table')} ${kw('open file description', 'offset + flags, in the kernel')} ${kw('inode / pipe / socket', 'the real object')}</p>
<p style="margin:0;font-size:20px"><code class="i">read</code>, <code class="i">write</code>, <code class="i">close</code>, <code class="i">fstat</code> take the <b>number</b>. Two separate <code class="i">open()</code> calls → two descriptions with separate offsets; <code class="i">fork()</code> and <code class="i">dup()</code> → <b>shared</b> offset.</p>` },

  /* 5 */
  { t: 'Every process has its own fd table', body: two(
    `${term(`$ ls -l /proc/self/fd
lr-x------ 1 root root 64 … 0 -> pipe:[6668280]
l-wx------ 1 root root 64 … 1 -> pipe:[6668281]
l-wx------ 1 root root 64 … 2 -> pipe:[6668281]
lr-x------ 1 root root 64 … 3 -> /proc/8/fd

$ ls -l /proc/self/fd < /etc/hostname \\
        > fds.txt 2> /dev/null
$ cat fds.txt
lr-x------ 1 root root 64 … 0 -> /etc/hostname
l-wx------ 1 root root 64 … 1 -> /w/fds.txt
l-wx------ 1 root root 64 … 2 -> /dev/null
lr-x------ 1 root root 64 … 3 -> /proc/11/fd`, { title: 'bang-fd.sh (dates cut, line wrapped)', hl: [10, 11, 12] })}
${box('Why a backend dev cares', '<code class="i">docker logs</code> and <code class="i">journalctl</code> are simply whatever your process writes to <b>fd 1 and fd 2</b>. In a container, log to stdout/stderr — not to a file nobody collects.', 'xanh')}`,
    `<table class="t" style="font-size:19px">
<tr><th>fd</th><th>Name</th><th>C / Node / Java</th></tr>
<tr><td><b>0</b></td><td>stdin</td><td><code class="i">STDIN_FILENO</code> · <code class="i">process.stdin</code> · <code class="i">System.in</code></td></tr>
<tr><td><b>1</b></td><td>stdout</td><td><code class="i">printf</code> · <code class="i">console.log</code> · <code class="i">System.out</code></td></tr>
<tr><td><b>2</b></td><td>stderr</td><td><code class="i">perror</code> · <code class="i">console.error</code> · <code class="i">System.err</code></td></tr>
</table>
<ul style="font-size:20px">
<li><code class="i">self</code> = the process that reads it — here <code class="i">ls</code>; its fd 3 is the directory it is listing</li>
<li>The program never changed — the <b>shell</b> rewired 0, 1, 2 before starting it</li>
<li>In this container 0/1/2 are <b>pipes</b>; in a terminal they are <code class="i">/dev/pts/0</code></li>
<li>A child <b>inherits a copy</b> of the table at <code class="i">fork()</code> — that is how every command you start gets 0/1/2</li>
</ul>`, 'r46') },

  /* 6 */
  { t: '“Everything is a file”: one number, many kinds', giua: true, body: `
${C(`int f   = open("/etc/hostname", O_RDONLY);          // a file on disk
int d   = open("/dev/null", O_WRONLY);              // a device
int p[2]; pipe(p);                                  // a pipe = TWO fds
int s   = socket(AF_INET, SOCK_STREAM, 0);          // a TCP socket
int u   = socket(AF_UNIX, SOCK_STREAM, 0);          // a Unix socket
int dir = open("/proc", O_RDONLY | O_DIRECTORY);    // a directory`)}
${two(out(`open(file)         fd 3  regular file  -> /etc/hostname
open(/dev/null)    fd 4  char device   -> /dev/null
pipe() read end    fd 5  pipe (FIFO)   -> pipe:[6671140]
pipe() write end   fd 6  pipe (FIFO)   -> pipe:[6671140]
socket(INET)       fd 7  socket        -> socket:[6671141]
socket(UNIX)       fd 8  socket        -> socket:[6671142]
open(dir)          fd 9  directory     -> /proc
hello through a pipe
after close(4), open() returned 4: always the LOWEST free number`, { title: 'moi-thu-la-tep.c', hl: [9], sm: false }),
    `<ul style="font-size:21px">
<li>Same <code class="i">read</code> / <code class="i">write</code> / <code class="i">close</code> / <code class="i">fstat</code> for all of them — that is the Unix idea</li>
<li>Not literally everything: a socket cannot <code class="i">lseek</code>, and you <code class="i">accept()</code> it — but it lives in the <b>same table</b></li>
<li>Numbers are reused: <b>lowest free first</b></li>
</ul>`, 'r64')}` },

  /* 7 */
  { t: 'Redirection is just open + dup2 before exec', giua: true, body: two(
    `${C(`pid_t pid = fork();
if (pid == 0) {                    /* child */
    int fd = open("out.txt",
              O_WRONLY | O_CREAT | O_TRUNC, 0644);
    dup2(fd, 1);     /* 1 -> where 3 points */
    close(fd);       /* 3 not needed any more */
    execlp("ls", "ls", "/nope", "/etc/hostname",
           NULL);
    _exit(127);
}
waitpid(pid, &st, 0);`, { hl: [5] })}
${out(`ls: cannot access '/nope': No such file or directory
parent: ls exited with 2; out.txt contains:
/etc/hostname`, { title: 'chuyen-huong.c — the shell’s ls … > out.txt' })}`,
    `${term(`== process 14   (the child that becomes tr)
dup3(3, 0, 0)                   = 0
close(3)                        = 0
openat(AT_FDCWD, "out.txt",
  O_WRONLY|O_CREAT|O_TRUNC, 0666) = 3
dup3(3, 1, 0)                   = 1
close(3)                        = 0
execve("/usr/bin/tr", ["tr", "a-z", "A-Z"], …)`, { title: 'strace -ff bash -c "echo hi | tr a-z A-Z > out.txt"', hl: [4, 6] })}
<ul style="font-size:19px">
<li><b>dup2(old, new)</b>: make <i>new</i> refer to the same open file as <i>old</i></li>
<li>exec keeps the fd table → <code class="i">ls</code> just writes to fd 1, unaware</li>
<li>stderr (fd 2) was <b>not</b> redirected, so the error still reached the screen</li>
<li>ARM64 has no <code class="i">dup2</code> syscall: glibc uses <b>dup3</b>. On x86-64 strace shows <code class="i">dup2</code></li>
</ul>`) },

  /* 8 */
  { t: 'Trap: redirections run left to right', giua: true, body: `
${two(term(`$ ls /nope /etc/hostname > a.txt 2>&1
$ cat a.txt
ls: cannot access '/nope': No such file or directory
/etc/hostname

$ ls /nope /etc/hostname 2>&1 > b.txt
ls: cannot access '/nope': No such file or directory
$ cat b.txt
/etc/hostname`, { title: 'thu-tu-2-1.sh', hl: [6] }),
    `<table class="t" style="font-size:19px">
<tr><th>Written</th><th>Step by step (dup2)</th><th>Errors go to</th></tr>
<tr><td style="white-space:nowrap"><code class="i">&gt; f 2&gt;&amp;1</code></td><td>1 → f, then 2 → <i>where 1 is now</i> = f</td><td class="xanh">the file</td></tr>
<tr><td style="white-space:nowrap"><code class="i">2&gt;&amp;1 &gt; f</code></td><td>2 → <i>where 1 is now</i> = screen, then 1 → f</td><td class="do">the screen</td></tr>
</table>
${box('Read 2>&1 as dup2(1, 2)', 'It copies where fd 1 points <b>at that moment</b> — it is not a permanent link between 2 and 1.', 'lam')}`)}
${term(`$ echo first > log.txt; echo second >> log.txt; cat log.txt          # >> = O_APPEND
first
second
$ exec 3> app.log; echo "line via fd 3" >&3; exec 3>&-; cat app.log  # your own fd 3
line via fd 3`)}` },

  /* 9 */
  { t: 'A pipe is two fds and a kernel buffer', giua: true, body: `
${pipeSvg()}
${two(term(`== process 12   (bash, the parent)
pipe2([3, 4], 0)                = 0
close(4)                        = 0
close(3)                        = 0
== process 13   (child: echo hi)
close(3)                        = 0
dup3(4, 1, 0)                   = 1
close(4)                        = 0
== process 14   (child: tr)
dup3(3, 0, 0)                   = 0
close(3)                        = 0`, { title: 'strace -ff bash -c "echo hi | tr a-z A-Z > out.txt"', hl: [2, 7, 10] }),
    `<ul style="font-size:20px">
<li><code class="i">pipe()</code> returns <b>[read end, write end]</b> = fds 3 and 4</li>
<li>each child <b>dup2</b>s its end onto 0 or 1, then <b>closes both</b> originals</li>
<li>the parent closes <b>both</b> too — it only waits</li>
<li>a <code class="i">|</code> in bash, <code class="i">spawn()</code> with <code class="i">stdio: 'pipe'</code> in Node, <code class="i">ProcessBuilder</code> in Java: the same three calls</li>
</ul>`)}` },

  /* 10 */
  { t: 'Build it: a mini shell with | and > in C', giua: true, body: two(
    zm(C(`for (int i = 0; i < nseg; i++) {
  int p[2] = { -1, -1 };
  if (i < nseg - 1) pipe(p);     /* to the next cmd */
  if ((kids[i] = fork()) == 0) {
    if (prev != -1) { dup2(prev, 0); close(prev); }
    if (p[1] != -1) { dup2(p[1], 1); close(p[1]); close(p[0]); }
    if (i == nseg - 1 && outfile) {   /* > file */
      int fd = open(outfile, O_WRONLY|O_CREAT|O_TRUNC,
                    0644);
      dup2(fd, 1); close(fd);
    }
    execvp(argv[0], argv); perror(argv[0]); _exit(127);
  }
  if (prev != -1) close(prev);   /* parent lets go */
  if (p[1] != -1) close(p[1]);
  prev = p[0];
}`, { hl: [3, 5, 6, 14, 15] }), .85),
    out(`msh> echo hello world | tr a-z A-Z
HELLO WORLD
msh> seq 1 10 | sort -rn | head -3
10
9
8
msh> cat /etc/passwd | grep nologin | wc -l
16
msh> readlink /proc/self/fd/0 /proc/self/fd/1 | cat
/w/mini-shell.in
pipe:[6671218]
msh> echo saved by msh > saved.txt
msh> cat saved.txt
saved by msh
msh> seq 1 1000000 | head -2
1
2`, { title: 'mini-shell.c (≈ 60 lines) < mini-shell.in', hl: [2, 10, 11] })) + `<p class="nho" style="margin:0">The whole shell is fork + pipe + dup2 + execvp + waitpid. <code class="i">seq 1 1000000 | head -2</code> ends at once: when <code class="i">head</code> exits, <code class="i">seq</code>’s next write gets <b>SIGPIPE</b>.</p>` },

  /* 11 */
  { t: 'Trap: one forgotten close() and the reader waits forever', giua: true, body: `
${C(`pipe(p);
if (fork() == 0) { dup2(p[1], 1); close(p[0]); close(p[1]); execlp("seq", "seq", "3", NULL); }
if (fork() == 0) { dup2(p[0], 0); close(p[0]); close(p[1]); execlp("wc", "wc", "-l", NULL); }
close(p[0]);
/* BUG: the parent forgot close(p[1]) */
signal(SIGALRM, on_alarm); alarm(2);       /* the handler closes p[1] after 2 s */
while (n < 2) if (wait(&st) > 0) n++;`, { hl: [5] })}
${two(`${out(`parent: 2 s passed, wc is still waiting -> now I close MY write end
3
parent: both children finished`, { title: 'quen-dong-ong.c', hl: [1] })}
${box('The rule (pipe(7))', '<code class="i">read()</code> returns 0 = <b>end of file</b> only when <b>every</b> write end in <b>every</b> process is closed. <code class="i">seq</code> finished at once, but the parent still held a write end — so <code class="i">wc</code> waited.', 'lam')}`,
    `<table class="t" style="font-size:18px">
<tr><th>Situation</th><th>Result</th></tr>
<tr><td>pipe empty, a writer still open</td><td>reader <b>blocks</b></td></tr>
<tr><td>pipe empty, no writer left</td><td><code class="i">read() = 0</code> (EOF)</td></tr>
<tr><td>pipe full (64 KiB)</td><td>writer <b>blocks</b> — back-pressure</td></tr>
<tr><td>no reader left</td><td>writer gets <b>SIGPIPE</b> / <code class="i">EPIPE</code> → 141</td></tr>
</table>`, 'r64')}` },

  /* 12 */
  { t: 'A socket is a file descriptor too', body: `
${term(`$ node _server.js &        # an idle API: TCP 127.0.0.1:3000 + Unix socket /tmp/api.sock
$ ls -lv /proc/$P/fd | awk …
 0 -> pipe:[6682936]          5 -> pipe:[6685722]            10 -> pipe:[6677467]            15 -> pipe:[6685724]
 1 -> pipe:[6682937]          6 -> pipe:[6685723]            11 -> pipe:[6677467]            16 -> anon_inode:[eventfd]
 2 -> pipe:[6682937]          7 -> pipe:[6685723]            12 -> anon_inode:[eventfd]      17 -> /dev/null
 3 -> anon_inode:[eventpoll]  8 -> anon_inode:[eventfd]      13 -> anon_inode:[eventpoll]    18 -> socket:[6682947]
 4 -> pipe:[6685722]          9 -> anon_inode:[eventpoll]    14 -> pipe:[6685724]            19 -> socket:[6682948]`, { title: 'socket-la-fd.sh (20 lines shown in four columns)' })}
${two(term(`$ lsof -p $P -a -d 17-19
FD  TYPE NODE    NAME
17r CHR  5       /dev/null
18u unix 6682947 /tmp/api.sock type=STREAM (LISTEN)
19u IPv4 TCP     localhost:3000 (LISTEN)
$ ss -ltnp
LISTEN 127.0.0.1:3000 users:(("node",pid=9,fd=19))
$ cat /proc/$P/fdinfo/19
pos:	0
flags:	02004002   # O_RDWR|O_NONBLOCK|O_CLOEXEC`, { title: 'lsof · ss · fdinfo (columns trimmed)', hl: [5, 7] }),
    `<ul style="font-size:20px">
<li>An idle Node app already holds <b>20 fds</b>: libuv’s <b>epoll</b>, <b>eventfd</b>s, pipes</li>
<li>Every <b>connection</b> = one more fd: accepted client, DB, Redis, outgoing HTTP</li>
<li>Same socket inode in <code class="i">/proc</code>, <code class="i">lsof</code> and <code class="i">ss</code> → you can always find <b>who owns a port</b></li>
<li><code class="i">ss -lxp</code> shows the Unix one: <code class="i">/tmp/api.sock … fd=18</code></li>
</ul>`, 'r64')}` },

  /* 13 */
  { t: 'Counting: every connection costs a descriptor', giua: true, body: `
<table class="t" style="font-size:20px">
<tr><th style="width:34%">Who</th><th>fds it holds</th><th>Limit you hit first</th></tr>
<tr><td><b>Node / Spring Boot API</b></td><td>~20 base + 1 per client connection + 1 per pooled DB connection + log files</td><td>soft <code class="i">ulimit -n</code></td></tr>
<tr><td><b>nginx reverse proxy</b></td><td><b>2 per proxied request</b>: client side + upstream side</td><td><code class="i">worker_connections</code>, <code class="i">worker_rlimit_nofile</code></td></tr>
<tr><td><b>PostgreSQL</b></td><td>one <b>process</b> per connection, each opening table and WAL files</td><td><code class="i">max_connections</code> (100), <code class="i">max_files_per_process</code> (1000)</td></tr>
<tr><td><b>A WebSocket server</b></td><td>1 per connected browser tab, held for hours</td><td>ulimit, then memory</td></tr>
</table>
${two(box('cuongthai.com: nginx/nginx.conf', '<code class="i">worker_rlimit_nofile 65535;</code> raises the limit of each worker; <code class="i">worker_connections 4096;</code> caps connections per worker — proxied requests count twice. <code class="i">use epoll;</code> is the topic of CS.4.', 'xanh'),
    box('The arithmetic of an outage', '1 000 open WebSocket tabs + a DB pool of 10 + 20 base = <b>1 030 fds</b>. With the classic soft limit <b>1024</b> the 1 001st tab fails — and so does opening a log file.', 'do2'))}` },

  /* 14 */
  { t: 'ulimit -n: the soft and the hard limit', body: two(
    `${term(`$ ulimit -Sn; ulimit -Hn
1048576
1048576
$ grep 'Max open files' /proc/self/limits
Max open files     1048576     1048576     files
$ ( ulimit -Sn 64; node -e "…" )   # soft only
node sees: Max open files     1048576
$ ( ulimit -n 64; node -e "…" )    # soft + hard
node sees: Max open files     64
$ ( ulimit -n 64; ulimit -Hn 128 )
bash: ulimit: open files: cannot modify limit:
      Operation not permitted`, { title: 'gioi-han.sh (spacing shortened)', hl: [7, 9, 11] })}
${box('To test a limit on Node or Java', 'Lower the <b>hard</b> limit (<code class="i">ulimit -n 128</code>, <code class="i">docker run --ulimit nofile=128:128</code>), or the runtime will quietly raise soft back up.', 'do2')}`,
    `<ul style="font-size:20px">
<li><b>soft</b> = what is enforced now; <b>hard</b> = the ceiling. A process may move soft up to hard; only root raises hard</li>
<li><b>Node and the JVM raise soft → hard at start-up</b> (proved left) — so a soft limit does not cap them</li>
<li>This Docker Desktop gives <b>1 048 576</b>. A systemd service gets <b>1024 soft / 524 288 hard</b> by default (systemd ≥ 240)</li>
</ul>
<table class="t" style="font-size:17px">
<tr><th>Where you set it</th><th>How</th></tr>
<tr><td>shell / script</td><td><code class="i">ulimit -n 65535</code></td></tr>
<tr><td>systemd unit</td><td><code class="i">LimitNOFILE=65535</code></td></tr>
<tr><td>docker / compose</td><td><code class="i">--ulimit nofile=65535:65535</code> · <code class="i">ulimits:</code></td></tr>
<tr><td>running process</td><td><code class="i">prlimit --pid P --nofile=…</code></td></tr>
</table>`, 'r46') },

  /* 15 */
  { t: '“Too many open files” — created for real', giua: true, body: `
${two(C(`struct rlimit rl; getrlimit(RLIMIT_NOFILE, &rl);
printf("limit: soft %ld, hard %ld\\n",
       rl.rlim_cur, rl.rlim_max);
int n = 0, last = -1, fd;
while ((fd = open("/etc/hostname", O_RDONLY)) >= 0) {
    n++; last = fd;            /* never closed */
}
printf("opened %d files (fds 3..%d), then open() = -1, "
       "errno %d %s: %s\\n", n, last, errno,
       errno == EMFILE ? "EMFILE" : "?", strerror(errno));`, { hl: [5] }),
    term(`$ ( ulimit -Sn 1024; ./mo-tep )
limit: soft 1024, hard 1048576
opened 1021 files (fds 3..1023),
then open() = -1, errno 24 EMFILE:
Too many open files

$ ( ulimit -Sn 64; ./mo-tep )
limit: soft 64, hard 1048576
opened 61 files (fds 3..63),
then open() = -1, errno 24 EMFILE:
Too many open files`, { title: 'gioi-han.sh + _mo-tep.c (lines wrapped)', hl: [4, 10] }))}
${cards([
    ['EMFILE (errno 24)', '<b>This process</b> reached its own limit. 64 − 3 (stdin/out/err) = 61. Fix the leak, or raise the limit.'],
    ['ENFILE (errno 23)', 'The <b>whole system</b> is out of file handles (<code class="i">/proc/sys/fs/file-max</code>). Rare today.'],
    ['Not only open()', '<code class="i">accept()</code>, <code class="i">socket()</code>, <code class="i">pipe()</code>, <code class="i">epoll_create</code> fail the same way — the server stops taking clients.'],
  ])}` },

  /* 16 */
  { t: 'An fd leak, measured: one failed request = one lost fd', body: two(
    `${zm(js(`http.createServer(async (req, res) => {
  let conn;
  try {
    conn = await connect();             // +1 fd
    await query(conn);
    if (req.url.includes('bad')) throw new Error('validation failed');
    res.end('ok');
    conn.end();                         // BUG: happy path only
  } catch (e) {
    res.statusCode = 500; res.end(e.code || e.message);
  }
});`, { hl: [6, 8] }), .82)}
${zm(out(`requests |  200 |  500 | API fds | last error
     100 |   80 |   20 |      41 | -
     200 |  160 |   40 |      61 | -
     300 |  240 |   60 |      81 | -
     400 |  320 |   80 |     101 | -
     500 |  400 |  100 |     121 | -
     600 |  431 |  169 |  EMFILE | 500 EMFILE
db: 108 client connections still open`, { title: 'ro-ri-ket-noi.sh · 🎲 one real run', hl: [7, 8] }), .92)}`,
    `${leakChart()}
<ul style="font-size:19px">
<li>The leak is <b>linear</b>: +20 fds per 100 requests, nobody notices for hours</li>
<li>At the limit <b>healthy</b> requests fail too: the DB <code class="i">connect()</code> gets EMFILE</li>
<li>The other side leaks as well: the database keeps <b>108 idle connections</b></li>
</ul>`) },

  /* 17 */
  { t: 'Fixing leaks: close in finally, try-with-resources', giua: true, body: two(
    `${js(`} finally {
  if (conn) conn.end();      // ALWAYS, whatever happened
}`, { hl: [2] })}
${out(`requests |  200 |  500 | API fds | last error
     100 |   80 |   20 |      22 | -
     300 |  240 |   60 |      22 | -
     600 |  480 |  120 |      22 | -
db: 0 client connections still open`, { title: 'the same load, FIXED=1 (rows trimmed)', hl: [4, 5] })}
<ul style="font-size:19px">
<li>Better still: a <b>pool</b> (<code class="i">pg.Pool</code>, HikariCP, Prisma) with <code class="i">release()</code> in <code class="i">finally</code> and a <b>max size</b></li>
<li>Node streams: <code class="i">stream.pipeline()</code> closes every stream on error</li>
</ul>`,
    `${java(`try (var in = new FileInputStream("data.txt");
     var db = new DbConn("db-conn")) {
    throw new IllegalStateException("query failed");
} catch (IllegalStateException e) {
    System.out.println("caught: " + e.getMessage() + …);
}`, { hl: [1, 2] })}
${out(`open fds at start: 6 (limit 256)
after 252 streams: data.txt (Too many open files)
closed them all, open fds: 6
1000 reads with try-with-resources, open fds: 6
  close() db-conn (runs before the catch block)
caught: query failed, open fds: 6`, { title: 'TaiNguyen.java · docker --ulimit nofile=256:256', hl: [2, 5] })}
<p style="font-size:19px;margin:0">Resources close in <b>reverse order</b>, <b>before</b> the catch, even on an exception. Never rely on the GC.</p>`) },

  /* 18 */
  { t: 'O_CLOEXEC: don’t let children inherit your fds', giua: true, body: two(
    `${C(`int s = socket(AF_INET, SOCK_STREAM
               | (cloexec ? SOCK_CLOEXEC : 0), 0);
bind(s, 127.0.0.1:8080); listen(s, 16);
if (fork() == 0)                 /* a helper process */
    execlp("sleep", "sleep", "30", NULL);
puts("server: exiting (a restart is coming)");`, { hl: [2] })}
${box('The rule (open(2), execve(2))', 'fds <b>survive exec</b> unless they carry the <b>close-on-exec</b> flag: <code class="i">O_CLOEXEC</code>, <code class="i">SOCK_CLOEXEC</code>, <code class="i">fcntl(fd, F_SETFD, FD_CLOEXEC)</code>. Set atomically at open — no window for another thread to fork.', 'lam')}`,
    `${term(`$ ./nghe; sleep 0.3
server (no CLOEXEC): listening on :8080 as fd 3,
        starting helper 'sleep 30'
server: exiting (a restart is coming)
$ ss -ltnp | grep 8080
LISTEN 127.0.0.1:8080 users:(("sleep",pid=17,fd=3))
$ ./nghe
server: bind 127.0.0.1:8080: Address already in use

$ ./nghe cloexec; sleep 0.3      # after pkill sleep
server (SOCK_CLOEXEC): listening on :8080 as fd 3, …
$ ss -ltnp | grep 8080
$ ./nghe cloexec
server (SOCK_CLOEXEC): listening on :8080 as fd 3, …`, { title: 'cloexec.sh (long lines wrapped)', hl: [6, 8] })}
<p style="font-size:19px;margin:0">The server is gone, yet <b>sleep</b> owns port 8080. Node (libuv), Java and Python ≥ 3.4 set CLOEXEC for you; raw C and old code do not.</p>`) },

  /* 19 */
  { t: 'The page cache: write() is not “on disk”', giua: true, body: `
${writePath()}
${two(term(`$ echo "before:      $(grep '^Dirty:' /proc/meminfo)"
before:      Dirty:               152 kB
$ dd if=/dev/zero of=/tmp/big.dat bs=1M count=100
$ echo "after write: $(grep '^Dirty:' /proc/meminfo)"
after write: Dirty:            102556 kB
$ sync /tmp/big.dat
$ echo "after sync:  $(grep '^Dirty:' /proc/meminfo)"
after sync:  Dirty:               156 kB`, { title: 'trang-dem.sh · 🎲 one real run', hl: [5, 8] }),
    `<ul style="font-size:20px">
<li><b>Dirty</b> = changed in RAM, not yet written to the device: 100 MB right after <code class="i">dd</code> “finished”</li>
<li><code class="i">sync</code> / <code class="i">fsync</code> pushes them down and waits</li>
<li>The same cache makes <b>reads</b> fast: a file read twice comes from RAM (cs5: <code class="i">buff/cache</code>)</li>
</ul>`)}` },

  /* 20 */
  { t: 'Measured: write vs write + fsync', giua: true, body: `
${C(`for (int i = 0; i < 500; i++) {
    write(fd, block, 4096);              /* like appending one WAL record */
    if (mode == 1) fsync(fd);            /* ... and wait until it is on the disk */
    if (mode == 2) fdatasync(fd);        /* data only, skip unchanged metadata */
}`)}
${out(`write only        :      2.2 us per 4 KiB record,     1.1 ms for 500 records
write + fsync     :    877.1 us per 4 KiB record,   438.5 ms for 500 records
write + fdatasync :    889.7 us per 4 KiB record,   444.9 ms for 500 records`, { title: 'fsync-do.c · 🎲 one real run · Docker Desktop VM disk', sm: false, hl: [2] })}
${two(box('≈ 400× slower', 'A write that waits for the device costs ~0.9 ms here — so at most ~1 100 durable writes per second from one thread. A laptop NVMe, a cloud volume and a RAID controller give very different numbers: <b>measure yours</b>.', 'do2'),
    box('So databases batch', '<b>Group commit</b>: one fsync makes many transactions durable at once. Your own code: write logs without fsync, but fsync anything you promise to keep (an uploaded file before replying 200).', 'xanh'))}` },

  /* 21 */
  { t: 'Why PostgreSQL needs fsync and the WAL', giua: true, body: `
${pgCommit()}
${cards([
    ['synchronous_commit = on', 'Default. The client hears “COMMIT” only after the WAL is flushed: a power cut loses nothing acknowledged.'],
    ['synchronous_commit = off', 'Reply before the flush: much faster, may lose the last few hundred ms of commits — never corrupts. OK for logs, not for payments.'],
    ['fsync = off', 'Never flush at all. A crash can leave the database <b>corrupted</b>. Only for throw-away test DBs.'],
  ])}
${box('Real history: “fsyncgate” (2018)', 'PostgreSQL found that Linux could drop dirty pages after a failed write-back and report the error only once — a retried fsync then “succeeded” on lost data. Since 11.2 (14 Feb 2019) PostgreSQL <b>panics</b> on an fsync failure and recovers from the WAL (<code class="i">data_sync_retry = off</code>).', 'lam')}` },

  /* 22 */
  { t: 'Buffered vs unbuffered: printf + fork prints twice', body: two(
    `${C(`printf("A: printf, ends with a newline\\n");
printf("B: printf, no newline yet ... ");
write(1, "C: write(), straight to the kernel\\n", 35);
if (fix) fflush(stdout);     /* empty the buffer */
fork();
printf("D: after fork\\n");`, { hl: [5] })}
<table class="t" style="font-size:18px">
<tr><th>stdout is…</th><th>stdio buffering</th></tr>
<tr><td>a terminal</td><td><b>line</b> buffered: flushed at each <code class="i">\\n</code></td></tr>
<tr><td>a pipe / file (Docker logs!)</td><td><b>fully</b> buffered: flushed at 4 KiB or exit</td></tr>
<tr><td>stderr</td><td><b>unbuffered</b></td></tr>
</table>
<p style="font-size:19px;margin:0">fork copies the process — <b>including the unflushed buffer</b>. Both copies flush it at exit.</p>`,
    `${term(`$ ./pf | cat                       # stdout = a pipe
C: write(), straight to the kernel
A: printf, ends with a newline
B: printf, no newline yet ... D: after fork
A: printf, ends with a newline
B: printf, no newline yet ... D: after fork
$ script -qc ./pf /dev/null        # stdout = a terminal
A: printf, ends with a newline
C: write(), straight to the kernel
B: printf, no newline yet ... D: after fork
B: printf, no newline yet ... D: after fork
$ ./pf fix | cat                   # fflush before fork
C: write(), straight to the kernel
A: printf, ends with a newline
B: printf, no newline yet ... D: after fork
D: after fork`, { title: 'printf-fork.sh', hl: [5, 6, 11] })}
<p style="font-size:19px;margin:0">Also why <b>C</b> jumps ahead of A: <code class="i">write()</code> skips the buffer. Python in Docker shows the same: use <code class="i">PYTHONUNBUFFERED=1</code>.</p>`) },

  /* 23 */
  { t: 'Node.js fs and streams: one fd, constant memory', giua: true, body: `
${two(js(`const src = fs.createReadStream('/tmp/big.log');  // 100 MB
src.on('open', (fd) => console.log(\`stream opened fd \${fd}\`));
await pipeline(src, crypto.createHash('sha256'));  // closes fd
const all = fs.readFileSync('/tmp/big.log');      // all in RAM`, { hl: [3] }),
    out(`stream opened fd 17, open fds now 19
stream       : rss +34 MB, 1600 chunks of 64 KiB,
               open fds after: 19
readFileSync : rss +100 MB, one Buffer of 100 MB`, { title: 'luong-node.js · 🎲 one real run (wrapped)', hl: [2, 4] }), 'r64')}
${two(term(`$ node --expose-gc _fh.js
open fds: 18 before, 21 after 3 leaked FileHandles (fds 17, 18, 19)
(node:9) Warning: Closing file descriptor 17 on garbage collection
(node:9) [DEP0137] DeprecationWarning: Closing a FileHandle object on
  garbage collection is deprecated. Please close FileHandle objects
  explicitly using FileHandle.prototype.close(). In the future, an
  error will be thrown if a file descriptor is closed during garbage
  collection.
(node:9) Warning: Closing file descriptor 18 on garbage collection
(node:9) Warning: Closing file descriptor 19 on garbage collection`, { title: 'filehandle-gc.sh — fs.promises.open() without close() (wrapped)', hl: [3, 9, 10] }),
    `<ul style="font-size:19px">
<li>A stream reads <b>64 KiB</b> at a time: memory stays flat for 100 MB or 10 GB</li>
<li><code class="i">pipeline()</code> closes the fd on success <b>and</b> on error</li>
<li>A <b>FileHandle</b> needs <code class="i">await fh.close()</code> in <code class="i">finally</code> — the GC may run in an hour, and Node will make this an <b>error</b></li>
</ul>`, 'r64')}` },

  /* 24 */
  { t: '🧭 Real incident: EMFILE at 3 a.m.', body: `
${nightTL()}
${two(`<div style="font-size:19px">${steps([
    'Count: <code class="i">ls /proc/$PID/fd | wc -l</code> vs <code class="i">/proc/$PID/limits</code>',
    'Group: <code class="i">lsof -p $PID | awk \'{print $5}\' | sort | uniq -c</code>',
    'Peers: <code class="i">ss -tanp | grep pid=$PID</code> — 100 × :5432 = DB pool leak',
    'Repeat step 1 every minute: a straight line = a leak, a plateau = just busy',
  ])}</div>`, `${box('Fix in the right order', '1. Restart buys hours (a dead process’s fds are all closed). 2. Find the error path that skips <code class="i">close</code>/<code class="i">release</code>. 3. Then raise <code class="i">LimitNOFILE</code> / <code class="i" style="white-space:nowrap">--ulimit</code>. 4. Alert on <b>fds / limit &gt; 80 %</b> (prom-client: <code class="i">process_open_fds</code>).', 'xanh')}
${box('Why 3 a.m.?', 'The leak crosses the limit when enough traffic has passed since the last restart — not when anyone is awake.', '')}`)}` },

  /* 25 */
  { t: '🎤 Interview questions you will be asked', to: true, giua: true, body: cards([
    ['What is a file descriptor?', 'A small int, an index into the process’s fd table, pointing to a kernel open-file description (offset, flags) → inode, pipe or socket.'],
    ['How does the shell do cmd > f 2>&1?', 'fork; in the child open f, dup2 it onto 1, then dup2(1, 2); exec. Order matters: 2>&1 > f sends errors to the screen.'],
    ['How does a pipe work?', 'pipe() gives two fds over a 64 KiB kernel buffer; each child dup2s one end onto 0/1 and closes the rest. EOF only when every write end is closed.'],
    ['“Too many open files” — what do you do?', 'Count fds vs limit, group with lsof, find the leak (missing close/release on an error path), then raise LimitNOFILE.'],
    ['Does write() mean the data is on disk?', 'No — it is in the page cache. fsync/fdatasync waits for the device. Databases fsync the WAL at COMMIT.'],
    ['Why does printf + fork print twice?', 'The stdio buffer is in the process memory; fork copies it; both processes flush it. fflush before fork, or write().'],
  ], 3) },

  /* 26 */
  { t: 'Check yourself', giua: true, to: true, body: `
<ol>
<li>A process has fds 0, 1, 2, 3, 5 open. It calls <code class="i">open()</code>. Which number does it get?</li>
<li><code class="i">node app.js 2&gt;&amp;1 &gt; app.log</code> — where do <code class="i">console.error</code> lines go?</li>
<li>An API in Docker logs <code class="i">EMFILE</code> after 2 days, and a restart “fixes” it. Name the first two commands you run next time, before restarting.</li>
</ol>
${box('Answers', '1) <b>4</b> — the lowest free number. 2) To the <b>terminal</b> (or <code class="i">docker logs</code>): 2 copied fd 1 while it still pointed there; only stdout goes to app.log. 3) <code class="i">ls /proc/PID/fd | wc -l</code> compared with <code class="i">/proc/PID/limits</code>, then <code class="i">lsof -p PID</code> (or <code class="i">ss -tanp</code>) grouped by type/peer to see <i>what</i> leaks — a restart erases the evidence.', 'xanh')}` },

  /* 27 */
  { t: 'Summary', to: true, body: `
<ul>
<li>An <b>fd</b> is a small int → open file description → file, pipe, socket, device; 0/1/2 = stdin/out/err</li>
<li><b>&gt;</b> = open + dup2, <b>|</b> = pipe + fork + dup2, applied <b>left to right</b>; close every unused end</li>
<li>Sockets are fds: <code class="i">/proc/PID/fd</code>, <code class="i">fdinfo</code>, <code class="i">lsof</code>, <code class="i">ss -p</code></li>
<li><b>EMFILE</b> = your process hit <code class="i">ulimit -n</code>: find the leak, close in <b>finally</b> / try-with-resources, then raise the limit</li>
<li><b>O_CLOEXEC</b> keeps fds out of exec’d children</li>
<li><b>write()</b> lands in the page cache; <b>fsync</b> makes it durable — the WAL depends on it</li>
</ul>
${box('Next', '<b>CS.3 — Threads in backend: thread pool vs event loop</b>: the threads inside these processes, and what the event loop does with all those fds.', 'lam')}` },
]);
