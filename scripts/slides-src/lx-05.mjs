/**
 * Linux & Bash · Deck lx-05 — Chương 5: Tiến trình, job & tín hiệu.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu"  = container ubuntu:24.04 (arm64, bash 5.2.21, procps-ng 4.0.4, tmux 3.4) trên Mac M1,
 *                 người dùng `an` (uid 1001), máy tên `lab`. PID 1 của container là `sleep infinity` (KHÔNG có init)
 *                 — chính vì vậy các tiến trình bị giết thành xác sống dưới PID 1 (slide 7), hiện tượng có thật.
 *   • "Fedora"  = máy linux-nha (Fedora 44, 12 nhân, 31 GiB RAM, nhân 7.1, OpenSSH mới có `sshd-session`)
 *   • "Mac"     = Mac M1, macOS 27, zsh 5.9, /bin/bash 3.2.57, ps/pgrep/xargs BSD, Docker Desktop (Engine 29.8)
 * Bấm phím thật (Ctrl-Z = 0x1a, Ctrl-C = 0x03) được gõ vào một pty bằng `script -qfc "bash -i"` — terminal thật,
 * không phải mô phỏng bằng kill.
 *
 * Hình tự vẽ (SVG nội tuyến): cayTT() cây tiến trình · forkExec() dòng thời gian fork/dup3/exec/wait ·
 * hangDoi() hàng đợi CPU của load average · ctrlC() đường đi của Ctrl-C · stopTimeline() docker stop ·
 * phien() phiên/nhóm tiến trình/terminal và SIGHUP · annot() dòng chữ có ngoặc chú thích (chép từ lx-01).
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, two, tree, seg, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-05', code: 'LINUX · CHƯƠNG 5', title: 'Tiến trình, job &amp; tín hiệu', sub: 'Linux & Bash · Chương 5' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;

/** annot(str, segs) — như lx-01: một dòng chữ đơn cách, ngoặc màu + nhãn dưới từng đoạn. */
const annot = (str, segs, { fs = 40, w = 1150, rowH = 58, y0 = 56, h } = {}) => {
  const cw = fs * 0.602;
  const x0 = Math.round((w - str.length * cw) / 2);
  let s = R(x0 - 22, y0 - fs - 6, str.length * cw + 44, fs + 28, { c: 'bd', fill: '#050806', r: 12, sw: 2 });
  let last = 0;
  const pieces = [];
  segs.slice().sort((a, b) => a.from - b.from).forEach((g) => {
    if (g.from > last) pieces.push([str.slice(last, g.from), '#e6edf3', last]);
    pieces.push([str.slice(g.from, g.to), c(g.c), g.from]);
    last = g.to;
  });
  if (last < str.length) pieces.push([str.slice(last), '#e6edf3', last]);
  pieces.forEach(([t, col, at]) => {
    s += `<text x="${(x0 + at * cw).toFixed(1)}" y="${y0}" font-size="${fs}" fill="${col}" font-family="${MONO}" font-weight="700" xml:space="preserve">${esc(t)}</text>`;
  });
  const rowsEnd = [];
  const by = y0 + 22;
  segs.forEach((g) => {
    const a = x0 + g.from * cw + 2, b = x0 + g.to * cw - 2, mid = (a + b) / 2;
    const half = Math.max(String(g.t).length * 17 * 0.56, String(g.d || '').length * 14.5 * 0.5) / 2 + 6;
    let r = 0;
    while (rowsEnd[r] !== undefined && rowsEnd[r] > mid - half - 8) r++;
    rowsEnd[r] = mid + half;
    const ly = by + 36 + r * rowH;
    const col = c(g.c);
    s += `<path d="M${a} ${by} L${a} ${by + 8} L${b} ${by + 8} L${b} ${by}" stroke="${col}" stroke-width="3" fill="none"/>`;
    s += `<path d="M${mid} ${by + 8} L${mid} ${ly - 18}" stroke="${col}" stroke-width="2" stroke-dasharray="4 4"/>`;
    s += T(mid, ly, g.t, { fs: 17, c: col, a: 'middle', b: true });
    if (g.d) s += T(mid, ly + 21, g.d, { fs: 14.5, c: 'mu', a: 'middle' });
  });
  return sv(w, h || by + 36 + rowsEnd.length * rowH + 4, s);
};

/* Slide 3 — cây tiến trình (tên + PID thật trên Fedora) */
const cayTT = () => {
  const N = (x, y, t, pid, col, hl = false) => R(x, y, 200, 50, { c: col, fill: hl ? 'rgba(245,183,0,.14)' : '#111812', r: 9 }) +
    T(x + 12, y + 22, t, { fs: 16, b: true, mono: true }) + T(x + 12, y + 41, `PID ${pid}`, { fs: 13.5, c: 'mu', mono: true });
  const L = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x1} ${y2} L${x2} ${y2}" stroke="${D.dim}" stroke-width="2" fill="none"/>`;
  let s = '';
  s += N(10, 8, 'systemd', '1', 'lx', true) + T(222, 38, '← gốc: mọi tiến trình đều từ đây', { fs: 14, c: 'lx' });
  s += L(30, 58, 60, 100) + N(60, 76, 'dockerd', '1620', 'blu');
  s += L(30, 58, 60, 170) + N(60, 146, 'sshd', '1041', 'tea');
  s += L(80, 196, 110, 238) + N(110, 214, 'sshd-session', '…287', 'tea');
  s += L(130, 264, 160, 306) + N(160, 282, 'sshd-session', '…290', 'tea');
  s += L(180, 332, 210, 374) + N(210, 350, 'bash', '…291', 'grn', true);
  s += L(230, 400, 260, 442) + N(260, 418, 'pstree', '…326', 'vio');
  s += T(420, 380, '← shell của bạn', { fs: 14, c: 'grn' });
  s += T(245, 448, 'lệnh bạn vừa gõ →', { fs: 14, c: 'vio', a: 'end' });
  s += T(280, 108, 'dịch vụ nền: con của PID 1', { fs: 14, c: 'mu' });
  return sv(560, 475, s);
};

/* Slide 4 — fork / dup3 / exec / wait trên một trục thời gian (strace thật) */
const forkExec = () => {
  let s = '';
  s += T(0, 44, 'CHA · bash 2922', { fs: 16, b: true, c: 'lx' }) + T(0, 64, 'shell của bạn', { fs: 13.5, c: 'mu' });
  s += T(0, 164, 'CON · PID 2923', { fs: 16, b: true, c: 'grn' }) + T(0, 184, 'sinh ra từ fork', { fs: 13.5, c: 'mu' });
  // cha
  s += `<rect x="170" y="34" width="150" height="26" rx="6" fill="${D.lx}" opacity=".35"/>` + T(245, 52, 'đọc lệnh', { fs: 14, a: 'middle' });
  s += `<path d="M320 47 L1010 47" stroke="${D.lx}" stroke-width="3" stroke-dasharray="7 6"/>` + T(660, 36, 'wait4(): ngủ, chờ con', { fs: 14.5, c: 'lx', a: 'middle' });
  s += `<rect x="1010" y="34" width="140" height="26" rx="6" fill="${D.lx}" opacity=".35"/>` + T(1080, 52, '$? = 0 · echo', { fs: 14, a: 'middle', mono: true });
  // fork
  s += A(320, 62, 356, 140, { c: 'grn' }) + T(300, 104, 'clone()', { fs: 14.5, c: 'grn', a: 'end', mono: true, b: true });
  const bx = [
    [360, 'bản sao bash', 'cùng mã, cùng fd', 'grn'],
    [520, 'openat ds.txt', '→ fd 3', 'blu'],
    [680, 'dup3(3, 1)', 'stdout → ds.txt', 'blu'],
    [840, 'execve ls', 'PID giữ nguyên', 'vio'],
  ];
  bx.forEach(([x, t, d, col], i) => {
    s += R(x, 142, 145, 58, { c: col, r: 9 }) + T(x + 72, 166, t, { fs: 14.5, a: 'middle', b: true, mono: true }) + T(x + 72, 188, d, { fs: 13, a: 'middle', c: 'mu' });
    if (i) s += A(x - 15, 171, x - 2, 171, { c: 'dim', sw: 2 });
  });
  s += R(1000, 142, 90, 58, { c: 'red', r: 9 }) + T(1045, 176, 'exit 0', { fs: 15, a: 'middle', b: true, mono: true });
  s += A(985, 171, 998, 171, { c: 'dim', sw: 2 });
  s += A(1045, 140, 1045, 64, { c: 'red' }) + T(1056, 110, 'đánh thức cha', { fs: 13.5, c: 'red' });
  s += T(600, 226, 'chuyển hướng > xảy ra ở đây — TRƯỚC khi ls tồn tại', { fs: 14.5, c: 'blu', a: 'middle' });
  return sv(1160, 236, s);
};

/* Slide 10 — load average = hàng đợi */
const hangDoi = () => {
  let s = '';
  const row = (y, lb, sub, run, wait, col) => {
    s += T(0, y + 22, lb, { fs: 16, b: true, c: col }) + T(0, y + 44, sub, { fs: 13.5, c: 'mu' });
    for (let k = 0; k < 4; k++) {
      s += R(195 + k * 62, y, 54, 50, { c: 'bd', fill: '#0c130f', r: 8 });
      if (k < run) s += `<circle cx="${222 + k * 62}" cy="${y + 25}" r="15" fill="${D.grn}"/>`;
    }
    s += T(315, y + 68, '4 nhân (nproc = 4)', { fs: 12.5, c: 'dim', a: 'middle' });
    for (let k = 0; k < wait; k++) s += `<circle cx="${480 + k * 36}" cy="${y + 25}" r="15" fill="${D[col]}" opacity=".85"/>`;
    if (wait) s += T(462, y - 6, 'xếp hàng chờ CPU', { fs: 13, c: col });
  };
  row(20, 'tải 2 / 4 nhân', 'dư một nửa', 2, 0, 'grn');
  row(125, 'tải 4 / 4 nhân', 'vừa khít, không ai chờ', 4, 0, 'amb');
  row(230, 'tải 8 / 4 nhân', 'mỗi việc chậm ~2 lần', 4, 4, 'red');
  s += T(0, 365, 'tải 12, CPU rỗi', { fs: 16, b: true, c: 'vio' }) + T(0, 387, 'tiến trình D chờ đĩa', { fs: 13.5, c: 'mu' });
  for (let k = 0; k < 4; k++) s += R(195 + k * 62, 345, 54, 50, { c: 'bd', fill: '#0c130f', r: 8 });
  for (let k = 0; k < 5; k++) s += R(466 + k * 34, 356, 28, 28, { c: 'vio', fill: 'rgba(188,140,255,.2)', r: 6 }) + T(480 + k * 34, 376, 'D', { fs: 14, a: 'middle', b: true, c: 'vio' });
  s += T(462, 340, 'kẹt đĩa/NFS — vẫn bị ĐẾM', { fs: 13, c: 'vio' });
  return sv(640, 405, s);
};

/* Slide 16 — đường đi của Ctrl-C */
const ctrlC = () => diagram({ w: 1160, h: 200, nodes: [
  { id: 'k', x: 0, y: 60, w: 170, h: 80, t: '⌨ Ctrl-C', d: 'byte 0x03', c: 'lx' },
  { id: 't', x: 240, y: 60, w: 210, h: 80, t: 'driver terminal', d: 'stty: intr = ^C', c: 'blu' },
  { id: 'n', x: 520, y: 60, w: 210, h: 80, t: 'nhân', d: 'SIGINT cho CẢ nhóm\ntiến trình tiền cảnh', c: 'vio' },
  { id: 'p', x: 800, y: 0, w: 360, h: 60, t: 'cat app.log  (chết)', c: 'red', mono: true },
  { id: 'q', x: 800, y: 70, w: 360, h: 60, t: 'grep ERROR  (chết)', c: 'red', mono: true },
  { id: 'r', x: 800, y: 140, w: 360, h: 60, t: 'wc -l  (chết) → $? = 130', c: 'red', mono: true },
], edges: [{ from: 'k', to: 't' }, { from: 't', to: 'n', c: 'blu' }, { from: 'n', to: 'p', c: 'red' }, { from: 'n', to: 'q', c: 'red' }, { from: 'n', to: 'r', c: 'red' }] });

/* Slide 17 — docker stop: SIGTERM → chờ → SIGKILL (đo thật trên Mac, docker stop -t 10) */
const stopTimeline = () => {
  const X = (t) => 250 + t * 78;
  let s = '';
  for (let t = 0; t <= 11; t++) s += `<line x1="${X(t)}" y1="14" x2="${X(t)}" y2="250" stroke="#1d2a24" stroke-width="1"/>` + T(X(t), 270, `${t}s`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  const row = (y, name, sub, endT, endLbl, col) => {
    s += T(0, y + 10, name, { fs: 17, b: true }) + T(0, y + 32, sub, { fs: 14, c: 'mu' });
    s += `<rect x="${X(0)}" y="${y - 6}" width="${Math.max(6, X(endT) - X(0))}" height="30" rx="6" fill="${D[col]}" opacity=".22"/>`;
    s += `<circle cx="${X(0)}" cy="${y + 9}" r="7" fill="${D.amb}"/>`;
    s += `<circle cx="${X(endT)}" cy="${y + 9}" r="8" fill="${D[col]}"/>` + T(X(endT) + 14, y + 15, endLbl, { fs: 16, c: col, b: true, mono: true });
  };
  row(46, 'sleep làm PID 1', 'không có hàm bắt TERM', 10.1, '', 'red');
  s += T(X(0) + 14, 38, 'SIGTERM… PID 1 vứt đi', { fs: 14.5, c: 'amb' });
  s += `<path d="M${X(10)} 22 L${X(10)} 80" stroke="${D.red}" stroke-width="3"/>` + T(X(10) - 8, 16, 'SIGKILL → mã 137 · 10,2 s', { fs: 15, c: 'red', b: true, mono: true, a: 'end' });
  row(124, 'sleep + --init', 'tini chuyển TERM cho sleep', 0.1, 'mã 143 · 0,1 s', 'grn');
  row(200, 'bash có trap TERM', 'dọn dẹp rồi exit 0', 0.1, 'mã 0 · 0,1 s', 'grn');
  s += T(X(0), 298, '● = lúc gõ docker stop -t 10 (gửi SIGTERM). Không có -t: tài liệu nói chờ 10 s; Docker Desktop trên Mac đo ~3 s', { fs: 14.5, c: 'amb' });
  return sv(1150, 306, s);
};

/* Slide 23 — phiên, nhóm tiến trình, terminal điều khiển; ai lãnh SIGHUP */
const phien = () => {
  let s = '';
  s += R(0, 30, 700, 284, { c: 'tea', fill: 'rgba(45,212,191,.05)', r: 14, dash: true });
  s += T(18, 58, 'PHIÊN 3504 · terminal điều khiển pts/0', { fs: 16, b: true, c: 'tea' });
  s += R(20, 76, 190, 60, { c: 'lx', r: 9 }) + T(115, 102, 'bash -i', { fs: 16, a: 'middle', b: true, mono: true }) + T(115, 124, 'trưởng phiên', { fs: 13.5, a: 'middle', c: 'mu' });
  const job = (x, y, t, d, col, ok) => {
    s += R(x, y, 210, 62, { c: col, r: 9 }) + T(x + 105, y + 27, t, { fs: 15, a: 'middle', b: true, mono: true }) + T(x + 105, y + 49, d, { fs: 13, a: 'middle', c: ok ? 'grn' : 'red' });
  };
  job(250, 170, 'sleep 501 &', 'chết ✗', 'red', false);
  job(470, 170, 'nohup sleep 502 &', 'sống ✓ lờ HUP', 'grn', true);
  job(250, 240, 'sleep 503 & disown -h', 'sống ✓ không bị gửi', 'grn', true);
  s += A(210, 110, 262, 168, { c: 'red' }) + A(210, 118, 480, 168, { c: 'red', dash: true });
  s += T(330, 124, 'chuyển tiếp SIGHUP', { fs: 13.5, c: 'red' });
  s += R(760, 170, 250, 62, { c: 'vio', r: 9 }) + T(885, 197, 'setsid sleep 504', { fs: 15, a: 'middle', b: true, mono: true }) + T(885, 219, 'phiên RIÊNG, không tty ✓', { fs: 13, a: 'middle', c: 'grn' });
  s += T(760, 150, 'nằm ngoài phiên → HUP không với tới', { fs: 13.5, c: 'vio' });
  s += R(760, 30, 250, 62, { c: 'red', r: 9 }) + T(885, 57, 'terminal mất', { fs: 15, a: 'middle', b: true }) + T(885, 79, 'SSH rớt · đóng cửa sổ', { fs: 13, a: 'middle', c: 'mu' });
  s += A(758, 70, 214, 96, { c: 'red' }) + T(480, 72, 'nhân: SIGHUP', { fs: 14, c: 'red', b: true, mono: true });
  return sv(1020, 320, s);
};

export const slides = S([
  cover({ t: 'Chương 5 — Tiến trình, job &amp; tín hiệu', sub: 'Cây tiến trình · fork/exec · trạng thái · top, tải, bộ nhớ, ulimit · tín hiệu &amp; 128+N · job, nohup, tmux', chap: 'CHƯƠNG 5' }),

  { t: 'Bản đồ chương: máy đang làm gì, và dừng nó đúng cách', body: mindmap('Tiến trình', 'mỗi thứ đang chạy là một con số', [
    { t: '5.1 Tiến trình là gì', d: 'PID/PPID · cây · fork → exec → wait · ps · trạng thái R S D T Z · /proc', c: 'lx' },
    { t: '5.1 Xác sống &amp; PID 1', d: 'không giết được Z · cha phải wait · --init', c: 'vio' },
    { t: '5.2 Nhìn máy đang chạy', d: 'top · load ÷ nproc · us sy wa st · nice', c: 'grn' },
    { t: '5.2 Bộ nhớ &amp; giới hạn', d: 'available · OOM = 137 · ulimit -n · Too many open files', c: 'tea' },
    { t: '5.3 Tín hiệu', d: 'INT 2 · TERM 15 · KILL 9 · HUP 1 · 128+N · trap · diệt theo cổng', c: 'red' },
    { t: '5.4 Job &amp; chạy nền', d: 'Ctrl-Z · jobs · fg · bg · &amp; · $! · wait · nohup · disown · setsid · tmux', c: 'blu' },
  ]) },

  /* ───────────── 5.1 ───────────── */
  { t: 'Cả máy là MỘT cây tiến trình — ai cũng có cha, gốc là PID 1', body: two(
    cayTT(),
    `${term(['$ echo $$ $PPID', '1605291 1605290', '$ ps -o pid,ppid,stat,comm -p $$,$PPID', '    PID    PPID STAT COMMAND', '+ 1605290 1605287 S    sshd-session', '= 1605291 1605290 Ss   bash', '$ pstree -psA $$', 'systemd(1)---sshd(1041)---sshd-session(…287)', '  ---sshd-session(…290)---bash(…291)---pstree(…326)'], { title: 'Fedora 44 — qua SSH, output thật (PID dài cắt …)', fs: 14 })}
    ${table(['Khái niệm', 'Nghĩa'], [
      ['<code>$$</code> · PID', 'số của shell này — duy nhất trên máy lúc này'],
      ['<code>$PPID</code> · PPID', 'số của cha — kẻ đã sinh ra nó'],
      ['PID 1', 'systemd trên máy thật; <code>launchd</code> trên Mac'],
    ], { sm: true })}
    ${box('info', 'Ubuntu 24.04 (OpenSSH 9.6) in <code>sshd---sshd---bash</code>; OpenSSH 9.8+ tách ra <code>sshd-session</code>. Cùng một ý: SSH rớt ⇒ cả nhánh dưới nó mất gốc.')}`, 'r') },

  { t: 'Shell fork ra một bản sao, bản sao exec thành lệnh của bạn', body: `
    ${forkExec()}
    ${term(['$ strace -f -e trace=clone,openat,dup3,execve,wait4 bash -c "ls > ds.txt; echo xong"', 'clone(child_stack=NULL, flags=…|SIGCHLD) = 2923', '[pid  2922] wait4(-1,  <unfinished ...>', '+ [pid  2923] openat(AT_FDCWD, "ds.txt", O_WRONLY|O_CREAT|O_TRUNC, 0666) = 3', '+ [pid  2923] dup3(3, 1, 0)               = 1', '= [pid  2923] execve("/usr/bin/ls", ["ls"], …) = 0', '[pid  2923] +++ exited with 0 +++', '<... wait4 resumed>[{WIFEXITED(s) && WEXITSTATUS(s) == 0}], 0, NULL) = 2923'], { title: 'Ubuntu 24.04 arm64 — strace thật (lọc bớt dòng thư viện; x86-64 in dup2 thay dup3)', fs: 13.5 })}` },

  { t: 'ps aux: RSS là RAM thật, TIME là giây CPU — không phải tuổi', body: `
    ${term(['$ ps aux', 'USER   PID %CPU %MEM   VSZ   RSS TTY STAT START  TIME COMMAND', 'an    2964  0.0  0.0  2280  1288 ?   S    09:45  0:00 sleep 1002', 'an    2966  1.4  0.2 25764 18588 ?   S    09:45  0:00 python3 -m http.server 19050', '+ an    2967  100  0.0  2392  1520 ?   R    09:45  0:02 sh -c while :; do :; done', '! an    2968  0.0  0.0     0     0 ?   Z    09:45  0:00 [sleep] <defunct>'], { title: 'Ubuntu 24.04 — 4 dòng thật (cột dồn lại cho vừa)', fs: 14.5 })}
    ${two(
      table(['Cột', 'Đọc là'], [
        ['<code>%CPU</code>', '100 = đốt trọn MỘT nhân (4 nhân tối đa 400)'],
        ['<code>VSZ</code>', '-bộ nhớ ẢO đã ánh xạ — bỏ qua'],
        ['<code>RSS</code>', '+RAM THẬT đang giữ (KB) — con số cần xem'],
        ['<code>TTY</code>', '<code>?</code> = không gắn terminal (daemon, job đã tách)'],
        ['<code>STAT</code>', 'trạng thái + cờ: <code>s</code> trưởng phiên · <code>+</code> tiền cảnh · <code>N</code> nice'],
        ['<code>TIME</code>', '!tổng giây CPU đã tiêu — tuổi thì xem <code>etime</code>'],
      ], { sm: true }),
      sh([
        ['ps aux --sort=-%cpu | head', 'ai đốt CPU nhất'],
        ['ps aux --sort=-rss | head', 'ai giữ RAM nhất'],
        ['ps -ef', 'kiểu UNIX: có PPID'],
        ['ps -o pid,etime,cmd -p 2966', 'chọn cột, một PID'],
        ['ps -u an -o pid,stat,cmd', 'của một người'],
        ['ps -C nginx', 'theo tên lệnh'],
        ['ps -e --forest -o pid,cmd', 'vẽ cây (GNU)'],
      ], { fs: 14.5 }), 'l')}` },

  { t: 'Năm trạng thái: R chạy · S ngủ · D kẹt đĩa · T dừng · Z xác sống', body: two(
    diagram({ w: 700, h: 470, nodes: [
      { id: 'f', x: 0, y: 20, w: 170, h: 64, t: 'fork()', d: 'sinh ra', c: 'dim' },
      { id: 'r', x: 260, y: 180, w: 190, h: 90, t: 'R · chạy', d: 'đang chạy hoặc\nchờ tới lượt CPU', c: 'grn' },
      { id: 's', x: 510, y: 20, w: 190, h: 80, t: 'S · ngủ', d: 'chờ mạng, phím, timer\nngắt được', c: 'blu' },
      { id: 'd', x: 510, y: 180, w: 190, h: 90, t: 'D · kẹt I/O', d: 'chờ đĩa/NFS\nkill -9 cũng vô ích', c: 'vio' },
      { id: 't', x: 0, y: 180, w: 190, h: 90, t: 'T · dừng', d: 'Ctrl-Z / SIGSTOP\nđóng băng, 0% CPU', c: 'amb' },
      { id: 'z', x: 260, y: 370, w: 190, h: 80, t: 'Z · xác sống', d: 'đã exit, cha\nchưa wait()', c: 'red' },
      { id: 'x', x: 530, y: 370, w: 150, h: 80, t: 'biến mất', d: 'PID được trả', c: 'dim' },
    ], edges: [
      { from: 'f', to: 'r', c: 'dim' },
      { from: 'r', to: 's', t: 'chờ ⇄ có việc', fs: 't', ts: 'l', c: 'blu', both: true },
      { from: 'r', to: 'd', c: 'vio', both: true },
      { from: 'r', to: 't', t: 'STOP', c: 'amb', off: -12 },
      { from: 't', to: 'r', fs: 'b', ts: 'b', c: 'amb', bend: 60, t: 'CONT' },
      { from: 'r', to: 'z', t: 'exit()', c: 'red' },
      { from: 'z', to: 'x', t: 'wait()', c: 'dim' },
    ] }),
    `${term(['$ ps -o pid,ppid,stat,cmd -u an', '    PID    PPID STAT CMD', '   2961    2955 S    sleep 1000', '+    2962    2955 T    sleep 1001', '   2966    2955 S    python3 -m http…', '=    2967    2965 R    sh -c while :; do…', '!    2968    2964 Z    [sleep] <defunct>'], { title: 'Ubuntu — dựng đủ 4 trạng thái', fs: 14 })}
    ${table(['Hậu tố', 'Nghĩa'], [['<code>s</code>', 'trưởng phiên (session leader)'], ['<code>+</code>', 'đang ở tiền cảnh terminal'], ['<code>N</code> · <code>&lt;</code>', 'ưu tiên thấp · cao'], ['<code>l</code>', 'nhiều luồng (thread)']], { sm: true })}
    ${box('warn', 'Nhiều <b>D</b> + tải cao + CPU rỗi = đĩa/NFS hỏng, không phải máy bận. Hàng D không chết vì kill -9.')}`, 'l2') },

  { t: 'Xác sống không giết được — PID 1 không dọn thì xác chất đống', body: two(
    `${term(['$ pkill -KILL -u an        # giết hết tiến trình của an', '$ ps -o pid,ppid,stat,cmd -p 1', '    PID    PPID STAT CMD', '!       1       0 Ss   sleep infinity', '$ ps -o pid,ppid,stat,cmd --ppid 1 | head -5', '    PID    PPID STAT CMD', '!    2930       1 Z    [sleep] <defunct>', '!    2931       1 Z    [bash] <defunct>', '!    2932       1 Z    [sleep] <defunct>', '!    2933       1 Z    [timeout] <defunct>', '$ ps -eo stat | grep -c ^Z', '8'], { title: 'Ubuntu — container PID 1 là sleep (KHÔNG init)', fs: 13.5 })}`,
    `${term(['$ docker run -d --init … sleep infinity', '$ docker exec … bash -c "sleep 500 & sleep 501 &"', '$ pkill -x -n sleep       # giết sleep 501', '$ ps -o pid,ppid,stat,cmd -e', '    PID    PPID STAT CMD', '=       1       0 Ss   /sbin/docker-init -- sleep infinity', '      6       1 S    sleep infinity', '     13       1 S    sleep 500'], { title: 'Ubuntu — cùng việc, có --init (tini)', fs: 13.5 })}
    ${steps([
      ['<code>kill -9</code> xác sống: vô ích', 'đã chết, chỉ còn giữ một ô PID'],
      ['Tìm cha, sửa/khởi động lại CHA', '<code>ps -o ppid= -p &lt;PID Z&gt;</code> · cha chết ⇒ init dọn'],
      ['Container: <code>docker run --init</code>', 'compose: <code>init: true</code>'],
    ])}`) },

  { t: '/proc/PID: hồ sơ sống của tiến trình, đọc thẳng bằng cat', body: two(
    tree(`/proc/2966/
├── cmdline   # tham số, cách nhau bởi NUL
├── status    # tên, trạng thái, PPid, VmRSS
├── cwd -> /home/an
├── exe -> /usr/bin/python3.12
├── fd/       # mọi file đang mở: 0 1 2 3…
├── environ   # biến môi trường (chỉ chủ/root)
├── limits    # giới hạn ulimit (bài 5.2)
└── oom_score # điểm “bị OOM chọn” (bài 5.2)`),
    `${term(['$ tr "\\0" " " < /proc/2966/cmdline; echo', 'python3 -m http.server 19050', '$ grep -E "^(State|PPid|VmRSS|SigIgn)" /proc/2966/status', 'State:  S (sleeping)', 'PPid:   2955', 'VmRSS:     18588 kB', 'SigIgn: 0000000001001006', '$ ls -l /proc/2966/fd', 'lr-x------ 1 an an 64 Sep 28 09:49 0 -> /dev/null', 'l-wx------ 1 an an 64 Sep 28 09:49 1 -> /dev/null', 'l-wx------ 1 an an 64 Sep 28 09:49 2 -> /dev/null', '+ lrwx------ 1 an an 64 Sep 28 09:49 3 -> socket:[2992912]'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })}
    ${box('warn', '<b>macOS không có /proc.</b> <code>ls /proc</code> → <code>No such file or directory</code>. Dùng <code>ps -o …</code>, <code>lsof -p PID</code> (file đang mở) và Activity Monitor (⌘+Space, gõ “Activity”).')}`, 'r') },

  /* ───────────── 5.2 ───────────── */
  { t: 'top: 5 dòng đầu là cả sức khoẻ của máy', body: `
    ${term(['$ top -bn1 | head -12', 'top - 16:53:14 up 3 days, 23:56,  1 user,  load average: 0.20, 0.55, 0.67', 'Tasks: 389 total, 1 running, 388 sleep, 0 d-sleep, 0 stopped, 0 zombie', '%Cpu(s):  0.7 us,  0.7 sy,  0.0 ni, 97.8 id,  0.0 wa,  0.4 hi,  0.4 si,  0.0 st', 'MiB Mem :  31915.6 total,    671.4 free,  14265.7 used,  17505.9 buff/cache', 'MiB Swap:   8192.0 total,   3899.2 free,   4292.8 used.  17650.0 avail Mem', '', '    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND', '      1 root      20   0   39620  13716   9568 S   0.0   0.0   0:48.69 systemd'], { title: 'Fedora 44, 12 nhân — output thật', fs: 14.5 })}
    ${two(table(['Dòng', 'Trả lời câu hỏi'], [
      ['1 · <code>load</code>', 'bao nhiêu việc đòi CPU (1·5·15 phút)'],
      ['2 · <code>Tasks</code>', 'có Z (xác sống) / D (kẹt) không?'],
      ['3 · <code>%Cpu</code>', 'thời gian đổ đi đâu: <code>wa</code>, <code>st</code>!'],
      ['4 · <code>Mem</code>', 'đọc <code>avail Mem</code>, không đọc <code>free</code>'],
      ['5 · <code>Swap</code>', 'đang dùng bao nhiêu (xem thêm <code>vmstat</code>)'],
    ], { sm: true }),
    table(['Phím trong top', 'Làm gì'], [['<code>P</code> · <code>M</code>', 'xếp theo CPU · RAM'], ['<code>1</code> · <code>c</code>', 'từng nhân · cả dòng lệnh'], ['<code>k</code> · <code>r</code>', 'gửi tín hiệu · đổi nice'], ['<code>q</code>', 'thoát']], { sm: true }), 'l2')}` },

  { t: 'Load average đếm HÀNG ĐỢI, không phải % — hãy chia cho nproc', body: two(
    hangDoi(),
    `${term(['$ uptime', ' 16:53:14 up 3 days, 23:56,  1 user,  load average: 0.20, 0.55, 0.67', '$ nproc', '12', '$ cat /proc/loadavg', '0.20 0.55 0.67 1/1101 1607625'], { title: 'Fedora — 0,2 trên 12 nhân: gần rỗi', fs: 12.5 })}
    ${box('tip', '<code>0.20 0.55 0.67</code> = 1·5·15 phút, đang GIẢM. <code>4.10 1.30 0.90</code> = có chuyện từ ~1 phút trước. <code>1/1101</code> = đang chạy / tổng luồng.')}
    ${box('info', 'Mac đang build Xcode lúc đo: <code>sysctl -n vm.loadavg</code> → <b>236</b> trên 10 nhân. Không có <code>nproc</code>: dùng <code>sysctl -n hw.ncpu</code>.')}`, 'l') },

  { t: 'Dòng %Cpu: wa = chờ đĩa, st = bị máy chủ vật lý lấy mất', body: `
    ${annot('%Cpu(s): 4.2 us, 1.1 sy, 0.0 ni, 93.9 id, 0.7 wa, 0.0 st', [
      { from: 9, to: 15, t: 'us', d: 'mã ứng dụng', c: 'grn' },
      { from: 17, to: 23, t: 'sy', d: 'trong nhân', c: 'blu' },
      { from: 25, to: 31, t: 'ni', d: 'việc đã nice', c: 'tea' },
      { from: 33, to: 40, t: 'id', d: 'rỗi', c: 'dim' },
      { from: 42, to: 48, t: 'wa', d: 'CHỜ ĐĨA', c: 'vio' },
      { from: 50, to: 56, t: 'st', d: 'BỊ LẤY (VPS)', c: 'red' },
    ], { fs: 30 })}
    ${two(
      table(['Mẫu', 'Chẩn đoán', 'Hướng sửa'], [
        ['us cao', 'mã ứng dụng tốn CPU', 'tối ưu / thêm nhân'],
        ['!wa cao, id cao', 'nghẽn ĐĨA', '<code>iostat -x 1</code> (Ch12)'],
        ['-st &gt; 0 kéo dài', 'nhà cung cấp VPS bóp', 'gọi nhà cung cấp / đổi gói'],
        ['sy cao', 'quá nhiều syscall vụn', '<code>strace -c</code>'],
      ], { sm: true }),
      `${sh([['nice -n 10 ./backup.sh', 'ưu tiên THẤP (-20 gắt … 19 hiền)'], ['sudo renice -n -5 -p 3580', 'chỉ root mới NÂNG được']], { fs: 14.5 })}
      ${term(['$ nice -n 10 sleep 600 &', '$ ps -o pid,ni,stat,cmd -p $!', '    PID  NI STAT CMD', '   3580  10 SN   sleep 600', '$ renice -n 15 -p 3580', '3580 (process ID) old priority 10, new priority 15', '$ renice -n 5 -p 3580', '! renice: failed to set priority for 3580 (process ID):', '! Permission denied'], { title: 'Ubuntu, người thường (không sudo)', fs: 13 })}`, 'l')}` },

  { t: 'free: “free” gần 0 là KHOẺ — con số cần đọc là available', body: `
    ${term(['$ free -h', '               total        used        free      shared  buff/cache   available', 'Mem:            31Gi        13Gi       884Mi        69Mi        16Gi        17Gi', 'Swap:          8.0Gi       4.2Gi       3.8Gi'], { title: 'Fedora 44, 31 GiB — output thật', fs: 15 })}
    ${seg([
      { t: 'used 13Gi', d: 'tiến trình đang giữ', w: 13, c: 'red' },
      { t: 'buff/cache 16Gi', d: 'đệm đĩa — MƯỢN, trả ngay khi cần', w: 16, c: 'blu' },
      { t: 'free', d: '0,9', w: 1.4, c: 'dim' },
    ], ['0', '13', '29', '31'])}
    ${two(
      box('good', '<b>available 17Gi</b> ≈ free + phần đệm thu hồi được = chỗ một chương trình MỚI lấy được mà không phải tráo swap. Cảnh báo giám sát đặt trên con số này.'),
      box('warn', 'Swap ĐÃ dùng 4,2 GiB không đáng sợ. Đáng sợ là swap đang CHẠY: <code>vmstat 1</code> cột <code>si</code>/<code>so</code> khác 0 liên tục. Mac không có <code>free</code>: dùng <code>vm_stat</code>, <code>memory_pressure</code>.'))}` },

  { t: 'Hết RAM: nhân giết bằng SIGKILL — dấu vết duy nhất là mã 137', body: two(
    `${term(['$ docker run --name lx05-oom --memory 64m \\', '    --memory-swap 64m ubuntu:24.04 bash -c \\', "    'echo \"bắt đầu ăn RAM\"; head -c 300M /dev/zero | tail -n 1 >/dev/null'", 'bắt đầu ăn RAM', 'bash: line 1:     6 Broken pipe             head -c 300M /dev/zero', '!          7 Killed                  | tail -n 1 > /dev/null', '$ echo $?', '! 137', "$ docker inspect -f '{{.State.OOMKilled}}' lx05-oom", '! true'], { title: 'Mac, Docker Desktop — dựng OOM thật trong 64 MB', fs: 12.5 })}
    ${sh([['sudo dmesg -T | grep -i "killed process"', 'nhân ghi lại nạn nhân'], ['sudo journalctl -k | grep -i oom', 'cùng tin, qua journald'], ['cat /proc/PID/oom_score', 'điểm “bị chọn” hiện tại']], { fs: 14.5 })}`,
    `${steps([
      ['<code>tail -n 1</code> giữ cả “dòng” 300 MB', 'không có ký tự xuống dòng ⇒ phình mãi'],
      ['Vượt trần 64 MB của cgroup', 'nhân gọi OOM killer'],
      ['SIGKILL — không bắt được', 'không log, không dọn dẹp, câu log dừng giữa chừng'],
      ['Shell/Docker báo 137', '= 128 + 9 ⇒ “chết vì tín hiệu 9”'],
    ])}
    ${box('bad', 'Dịch vụ “biến mất không để lại lỗi” ⇒ kiểm <code>dmesg</code> TRƯỚC khi đọc code. Dự án thật: build song song trên VPS 6 GB chết <code>Exited(137)</code> đúng kiểu này.')}`) },

  { t: 'ulimit: vượt trần số file mở ⇒ “Too many open files”', body: two(
    `${term(['$ ulimit -n                       # trần mềm hiện tại', '1024', '$ ulimit -Hn                      # trần cứng', '524288'], { title: 'Fedora 44 — mặc định của phiên SSH', fs: 14 })}
    ${term(['$ ( ulimit -n 16; python3 -c "', 'fs=[]', 'while True: fs.append(open(\'/etc/hostname\'))" )', '! OSError: [Errno 24] Too many open files: \'/etc/hostname\'', '$ ulimit -Sn 1024; ulimit -Hn 4096; ulimit -Hn 8192', '! bash: line 1: ulimit: open files: cannot modify limit: Operation not permitted', '$ prlimit --pid 2966 --nofile=2048:1048576; prlimit --pid 2966 --nofile', 'RESOURCE DESCRIPTION              SOFT    HARD UNITS', '= NOFILE   max number of open files 2048 1048576 files'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 })}`,
    `${table(['Lệnh', 'Nghĩa'], [
      ['<code>ulimit -a</code>', 'xem mọi trần của shell này'],
      ['<code>ulimit -n 4096</code>', 'đặt trần số file mở (mềm)'],
      ['<code>-S</code> · <code>-H</code>', 'mềm (tự nâng tới cứng) · cứng (chỉ root nâng)'],
      ['<code>-u</code> · <code>-s</code>', 'số tiến trình · cỡ ngăn xếp'],
      ['<code>/proc/PID/limits</code>', 'trần của một tiến trình ĐANG chạy'],
      ['<code>prlimit --pid</code>', 'đổi trần tiến trình đang chạy'],
    ], { sm: true })}
    ${box('warn', '<code>ulimit</code> chỉ tác động shell này và con của nó. Dịch vụ systemd dùng <code>LimitNOFILE=</code> (Ch11), container dùng <code>--ulimit nofile=256:512</code>.')}`, 'l') },

  /* ───────────── 5.3 ───────────── */
  { t: 'Những tín hiệu đáng thuộc — chỉ KILL và STOP là không bắt được', body: `
    ${table(['Tín hiệu', 'Số (Linux)', 'Ai gửi', 'Mặc định', 'Bắt / lờ được?', 'Chết thì $?'], [
      ['<code>SIGHUP</code>', '1', 'terminal mất · <code>kill -HUP</code> (daemon: nạp lại)', 'kết thúc', '+có', '129'],
      ['<code>SIGINT</code>', '2', '<code>Ctrl-C</code>', 'kết thúc', '+có', '130'],
      ['<code>SIGQUIT</code>', '3', '<code>Ctrl-\\</code>', 'kết thúc + core', '+có', '131'],
      ['!<code>SIGKILL</code>', '9', '<code>kill -9</code> · OOM killer', 'kết thúc NGAY', '-KHÔNG', '137'],
      ['<code>SIGSEGV</code>', '11', 'nhân: truy cập bộ nhớ sai', 'kết thúc + core', '+có', '139'],
      ['!<code>SIGTERM</code>', '15', '<code>kill</code> · <code>docker stop</code> · <code>systemctl stop</code>', 'kết thúc', '+có — nên bắt', '143'],
      ['<code>SIGSTOP</code> · <code>SIGTSTP</code>', '19 · 20', '<code>kill -STOP</code> · <code>Ctrl-Z</code>', 'đóng băng', '-STOP: không · TSTP: có', '—'],
      ['<code>SIGCONT</code>', '18', '<code>fg</code> · <code>bg</code> · <code>kill -CONT</code>', 'chạy tiếp', '+có', '—'],
    ], { sm: true })}
    ${two(
      term(['$ kill -l 15; kill -l 143', 'TERM', 'TERM'], { title: 'Ubuntu — kill -l đổi số ⇄ tên, hiểu cả mã thoát', fs: 14 }),
      box('warn', '<b>Mac khác số!</b> <code>kill -l 17 18 19</code> trên macOS → STOP · TSTP · CONT (Linux: CHLD · CONT · STOP). Luôn viết TÊN: <code>kill -STOP</code>, đừng <code>kill -19</code> (trên Mac đó là CONT).'), 'r')}` },

  { t: 'Ctrl-C: terminal gửi SIGINT cho CẢ nhóm tiền cảnh — $? = 128 + 2', body: `
    ${ctrlC()}
    ${two(
      term(['$ set -m; for s in INT TERM KILL HUP QUIT SEGV; do', '    sleep 100 & p=$!; sleep 0.2; kill -$s $p; wait $p', '    echo "SIG$s → \\$? = $?"; done', 'SIGINT → $? = 130', 'SIGTERM → $? = 143', '! SIGKILL → $? = 137', 'SIGHUP → $? = 129', 'SIGQUIT → $? = 131', 'SIGSEGV → $? = 139'], { title: 'Ubuntu — đo thật: mã = 128 + số tín hiệu', fs: 13.5 }),
      `${box('warn', '<b>Bẫy đo được:</b> bỏ <code>set -m</code> thì dòng đầu in <code>SIGINT → $? = 0</code> — trong script không tương tác, job nền <b>lờ SIGINT và SIGQUIT</b> (bash tự đặt vậy; xem <code>SigIgn</code> ở slide 8).')}
      ${box('info', 'CI: <code>137</code> bị giết (OOM/hết giờ) · <code>143</code> TERM · <code>130</code> Ctrl-C.')}`, 'l')}` },

  { t: 'Leo thang có chủ ý: TERM → chờ → kiểm → mới tới KILL', body: `
    ${stopTimeline()}
    ${two(
      sh([
        ['kill "$pid"', '1. SIGTERM: xin tắt'],
        ['for i in 1 2 3 4 5; do', ''],
        ['  kill -0 "$pid" 2>/dev/null || break', '2. còn sống? (tín hiệu 0)'],
        ['  sleep 1', ''],
        ['done', ''],
        ['kill -0 "$pid" 2>/dev/null && kill -KILL "$pid"', '3. hết kiên nhẫn mới KILL'],
      ], { fs: 15.5 }),
      box('bad', '<code>kill -9</code> trước: không xả bộ đệm, không đóng giao dịch, file khoá/PID cũ nằm lại, Postgres phải tự phục hồi lần sau. Và nó vẫn thua trạng thái <b>D</b> và <b>Z</b>.'), 'l')}` },

  { t: 'trap: chương trình tự quyết làm gì khi nhận tín hiệu', body: two(
    `${sh([
      ['#!/bin/bash', ''],
      ['lock=/tmp/deploy.lock', ''],
      ['don_dep() {', ''],
      ['  echo "nhận tín hiệu — dọn dẹp"', ''],
      ['  rm -f "$lock"', 'không để khoá cũ chặn lần sau'],
      ['}', ''],
      ['trap don_dep EXIT', 'chạy khi thoát bằng BẤT KỲ đường nào'],
      ["trap 'exit 143' TERM INT", 'TERM/INT ⇒ thoát ⇒ EXIT chạy'],
      ["trap '' HUP", 'chuỗi rỗng = LỜ HUP'],
      ['touch "$lock"; sleep 300 & wait', 'wait để trap chạy NGAY'],
    ], { fs: 14.5 })}
    ${term(['$ bash -c \'trap "echo bye" TERM; trap "" HUP; grep -E "SigIgn|SigCgt" /proc/$$/status\'', 'SigIgn:\t0000000000000005', 'SigCgt:\t0000000000014002'], { title: 'Ubuntu — soi bitmask tín hiệu', fs: 13 })}`,
    `${table(['Mặt nạ', 'Bit bật', 'Tín hiệu'], [
      ['<code>SigIgn …05</code>', 'bit 0, 2', 'HUP (1) · QUIT (3) — bị LỜ'],
      ['<code>SigCgt …14002</code>', 'bit 1, 14, 16', 'INT (2) · TERM (15) · CHLD (17) — có hàm BẮT'],
    ], { sm: true })}
    ${box('info', 'Bit <b>n</b> ứng với tín hiệu <b>n+1</b>. Tiến trình không chịu chết vì TERM? Nhìn <code>SigIgn</code>/<code>SigCgt</code> trước: nó đang LỜ hay đang KẸT — hai bệnh, hai cách chữa.')}
    ${term(['$ ./don.sh & p=$!', '$ kill -HUP $p; kill -0 $p && echo "HUP: vẫn sống"', '= HUP: vẫn sống', '$ kill $p; wait $p; echo "mã thoát: $?"', '+ nhận tín hiệu — dọn dẹp', 'mã thoát: 143', '$ ls /tmp/deploy.lock', "ls: cannot access '/tmp/deploy.lock': No such file or directory"], { title: 'Ubuntu — chạy thật script bên trái', fs: 12.5 })}`, 'l') },

  { t: 'pkill -f khớp cả dòng lệnh — kể cả dòng lệnh của CHÍNH bạn', body: two(
    `${term(['$ bash -c \'pgrep -af "sleep 1000"; echo ---\'', '2961 sleep 1000', '! 3041 bash -c pgrep -af "sleep 1000"; echo ---', '---', '$ bash -c \'pkill -f "sleep 9999"; echo "dòng này có in không?"\'', '$ echo $?', '! 143', '# echo không chạy: pkill đã giết luôn CHÍNH shell chứa nó'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })}
    ${box('bad', 'Cùng cơ chế: vòng chờ <code>while pgrep -f deploy-nha; do sleep 5; done</code> chạy trong <code>bash -c "…deploy-nha…"</code> ⇒ nó tự khớp chính nó và chờ MÃI.')}`,
    `${table(['Cách', 'Khớp với'], [
      ['<code>pgrep nginx</code>', 'TÊN tiến trình (comm, ≤ 15 ký tự)'],
      ['<code>pgrep -x nginx</code>', '+đúng tên, không khớp một phần'],
      ['<code>pgrep -f "mẫu"</code>', '!cả dòng lệnh — mạnh và nguy hiểm'],
      ['<code>pgrep -u an -n node</code>', 'thu hẹp: của an, cái mới nhất'],
      ['<code>pidof nginx</code>', 'chỉ PID (Linux; Mac không có)'],
    ], { sm: true })}
    ${steps([
      ['Luôn <code>pgrep -af</code> trước', 'đọc danh sách — đúng thứ pkill sẽ giết'],
      ['Mẫu nằm trong script/biến, không trong <code>bash -c</code>', 'hoặc mẹo <code>"[s]leep 1000"</code> trong một lệnh RIÊNG'],
      ['Có PID file / cổng? dùng nó', 'chính xác hơn mọi mẫu tên'],
    ])}
`) },

  { t: 'Tiến trình đổi tên thì pkill hụt — diệt theo CỔNG: lsof -ti:PORT', body: two(
    `${sh([
      ["process.title = 'next-server (v15.5.4)'", 'Node tự đổi tên (như Next.js)'],
      ["require('http').createServer(…).listen(19051)", ''],
    ], { fs: 14.5, so: false })}
    ${term(['$ node start.js --port 19051 &', '$ pkill -f "next start"; echo "rc=$?"', '! rc=1', '$ ps -o pid,comm,args -p $(lsof -ti:19051)', '  PID COMM             ARGS', '+ 78187 next-server (v15 next-server (v15.5.4)', '$ lsof -nP -i:19051', 'COMMAND   PID  USER   FD   TYPE  … NAME', 'node    78187 admin   12u  IPv6  … TCP *:19051 (LISTEN)', '$ lsof -ti:19051 | xargs kill; lsof -ti:19051 || echo "cổng trống"', '= cổng trống'], { title: 'Mac M1 — dựng lại sự cố thật, output thật', fs: 13 })}`,
    `${table(['Cách tìm', 'Hỏi theo', 'Hụt khi'], [
      ['<code>pkill -f "next start"</code>', 'chữ trong dòng lệnh', '-tiến trình tự đổi tên'],
      ['<code>pkill node</code>', 'tên chương trình', '-giết nhầm mọi app Node'],
      ['<code>lsof -ti:3000</code>', '+CỔNG nó đang giữ', 'không bao giờ — cổng chỉ 1 chủ'],
      ['<code>ss -ltnp "sport = :3000"</code>', '+cổng (Linux)', 'cần quyền để thấy tên của người khác'],
    ], { sm: true })}
    ${sh([['lsof -ti:3000 | xargs -r kill', 'xin tắt kẻ giữ cổng 3000'], ['fuser -k 3000/tcp', 'cách Linux (psmisc)']], { fs: 14.5 })}
    ${box('info', '<code>-t</code> = chỉ in PID (để ống sang kill) · <code>-i:3000</code> = kết nối ở cổng đó · <code>xargs -r</code> = không chạy kill khi rỗng.')}`, 'l') },

  /* ───────────── 5.4 ───────────── */
  { t: 'Ctrl-Z, bg, fg: một terminal xoay xở nhiều việc', body: two(
    diagram({ w: 560, h: 440, nodes: [
      { id: 'f', x: 180, y: 0, w: 200, h: 84, t: 'TIỀN CẢNH', d: 'giữ terminal\nnhận phím + Ctrl-C', c: 'lx' },
      { id: 't', x: 0, y: 200, w: 200, h: 84, t: 'DỪNG (T)', d: 'đóng băng\n0% CPU', c: 'amb' },
      { id: 'b', x: 360, y: 200, w: 200, h: 84, t: 'HẬU CẢNH', d: 'chạy tiếp, trả\ndấu nhắc cho bạn', c: 'grn' },
      { id: 'x', x: 180, y: 350, w: 200, h: 84, t: 'kết thúc', d: 'Ctrl-C khi ở tiền cảnh\nDone / Terminated', c: 'dim' },
    ], edges: [
      { from: 'f', to: 't', t: 'Ctrl-Z', fs: 'l', ts: 't', c: 'amb' },
      { from: 't', to: 'b', t: 'bg', c: 'grn' },
      { from: 'b', to: 'f', t: 'fg', fs: 't', ts: 'r', c: 'lx' },
      { from: 't', to: 'f', t: 'fg', fs: 'r', ts: 'b', c: 'lx', off: 20 },
      { from: 'b', to: 'x', t: 'kill %2', fs: 'b', ts: 'r', c: 'red' },
    ] }),
    `${term(['$ sleep 300', '^Z', '+ [1]+  Stopped                 sleep 300', '$ jobs -l', '[1]+  3475 Stopped                 sleep 300', '$ bg', '= [1]+ sleep 300 &', '$ sleep 400 &', '[2] 3480', '$ jobs', '[1]-  Running                 sleep 300 &', '[2]+  Running                 sleep 400 &', '$ fg %1', 'sleep 300', '^C', '$ echo $?', '! 130', '$ kill %2; sleep 0.2; jobs', '[2]+  Terminated              sleep 400'], { title: 'Ubuntu — gõ phím thật vào một pty', fs: 13, dir: '' })}`, 'r') },

  { t: '& chạy nền, $! lấy PID — wait TỪNG PID mới bắt được lỗi', body: two(
    `${sh([
      ['( sleep 1; echo "build-api xong" )    & p1=$!', ''],
      ['( sleep 2; echo "build-web xong" )    & p2=$!', ''],
      ['( sleep 1; echo "test hỏng"; exit 3 ) & p3=$!', ''],
      ['loi=0', ''],
      ['for p in $p1 $p2 $p3; do', 'wait TỪNG PID'],
      ['  wait "$p" || { echo "PID $p hỏng, mã $?"; loi=1; }', ''],
      ['done; echo "tổng kết → $loi"', ''],
    ], { fs: 14 })}
    ${term(['build-api xong', 'test hỏng', 'build-web xong', '! PID 3680 hỏng, mã 3', 'tổng kết → 1', '# cùng 3 job, nhưng gọi "wait" trần trước vòng for:', '! wait trần  → 0', '! bash: line 7: wait: pid 3665 is not a child of this shell'], { title: 'Ubuntu — output thật của hai phiên bản', fs: 13 })}`,
    `${table(['Ký hiệu', 'Nghĩa'], [
      ['<code>lệnh &amp;</code>', 'chạy nền, shell không chờ'],
      ['<code>$!</code>', 'PID của job nền GẦN NHẤT'],
      ['<code>wait</code>', '-chờ tất cả — trả 0 và QUÊN mọi PID'],
      ['<code>wait $pid</code>', '+trả đúng mã thoát của PID đó'],
      ['<code>jobs -l</code> · <code>jobs -p</code>', 'kèm PID · chỉ PID'],
      ['<code>%1</code> <code>%+</code> <code>%-</code>', 'job số 1 · mới nhất · trước đó'],
    ], { sm: true })}
    ${box('warn', 'Job nền vẫn in ra terminal của bạn ⇒ luôn <code>./build.sh &gt; build.log 2&gt;&amp;1 &amp;</code>. Job nền mà đọc bàn phím sẽ bị dừng bằng <code>SIGTTIN</code>.')}`, 'l') },

  { t: 'Đóng terminal = SIGHUP cho cả phiên — & KHÔNG phải tách rời', body: `
    ${phien()}
    ${term(['$ kill -HUP $$            # làm đúng việc nhân làm khi terminal mất', 'Hangup', '# từ shell khác: ps -o pid,ppid,sid,tty,stat,cmd -C sleep — 501 chết, 502·503·504 sống', '!    3507       1    3504 ?        Z    [sleep] <defunct>', '=    3509       1    3504 ?        S    sleep 502', '=    3510       1    3504 ?        S    sleep 503', '=    3515       1    3515 ?        Ss   sleep 504'], { title: 'Ubuntu — bash -i trong pty thật, output thật', fs: 12.5 })}` },

  { t: 'nohup · disown · setsid · tmux · systemd: sống sót tới đâu?', body: `
    ${table(['Cách', 'Làm gì', 'Quyết lúc nào', 'Sống khi SSH rớt', 'Quay lại xem/gõ', 'Sống khi reboot'], [
      ['<code>lệnh &amp;</code>', 'chỉ trả dấu nhắc', 'lúc chạy', '-KHÔNG', '-không', '-không'],
      ['<code>nohup lệnh &amp;</code>', 'LỜ SIGHUP, output → <code>nohup.out</code>', 'TRƯỚC khi chạy', '+có', '-không (chỉ đọc log)', '-không'],
      ['<code>disown -h %1</code>', 'shell KHÔNG gửi HUP cho job đó', '+SAU khi đã chạy', '+có', '-không', '-không'],
      ['<code>setsid lệnh</code>', 'phiên MỚI, không terminal', 'trước', '+có', '-không', '-không'],
      ['!<code>tmux</code>', 'terminal sống TRÊN máy chủ', 'trước (thói quen)', '+có', '+CÓ — attach lại', '-không'],
      ['!unit systemd', 'trình quản lý dịch vụ (Ch11)', 'khi cài đặt', '+có', 'qua <code>journalctl</code>', '+CÓ, tự bật lại'],
    ], { sm: true })}
    ${two(
      sh([['nohup ./build.sh > build.log 2>&1 &', 'quyết từ trước'], ['# quên rồi? Ctrl-Z rồi:', ''], ['bg; disown -h %1', 'cứu job đang chạy'], ['setsid ./job.sh > job.log 2>&1 < /dev/null &', 'cắt hẳn']], { fs: 14 }),
      box('info', '<b>macOS không có <code>setsid</code></b> (và không có <code>timeout</code>, <code>pidof</code>). <code>nohup</code>, <code>disown</code> dùng được; tmux cài bằng Homebrew.'), 'l')}` },

  { t: 'tmux: terminal sống trên máy chủ — rớt mạng thì gắn lại', body: two(
    `${sh([
      ['tmux new -s deploy', 'mở phiên có tên'],
      ['# … chạy việc dài …  Ctrl-B rồi D', 'tách ra, việc vẫn chạy'],
      ['tmux ls', 'đang có phiên nào'],
      ['tmux attach -t deploy', 'gắn lại, từ máy nào cũng được'],
      ['tmux new -d -s bk "./backup.sh"', 'tạo phiên nền chạy sẵn lệnh'],
      ['tmux kill-session -t deploy', 'xong việc thì dọn'],
      ['tmux attach || tmux new', 'thói quen đầu mỗi lần SSH'],
    ], { fs: 14.5 })}
    ${term(['$ tmux new -d -s deploy "sleep 600"', '$ tmux ls', 'deploy: 1 windows (created Mon Sep 28 09:59:11 2026)', '$ tmux kill-session -t deploy; tmux ls', '! no server running on /tmp/tmux-1001/default'], { title: 'Ubuntu 24.04, tmux 3.4 — output thật', fs: 13.5 })}`,
    `${table(['Phím (sau Ctrl-B)', 'Làm gì'], [
      ['<code>d</code>', '+tách ra (detach)'],
      ['<code>c</code> · <code>0</code>…<code>9</code>', 'cửa sổ mới · nhảy tới cửa sổ'],
      ['<code>%</code> · <code>"</code>', 'chia dọc · chia ngang'],
      ['<code>←↑→↓</code>', 'đi giữa các ô'],
      ['<code>[</code>', 'cuộn lại xem output (<code>q</code> thoát)'],
      ['<code>?</code>', 'danh sách mọi phím'],
    ], { sm: true })}
    ${box('good', 'Đường deploy qua SSH đúng: <code>ssh vps \'tmux new -d -s deploy ./deploy.sh\'</code> — rồi <code>ssh -t vps tmux attach -t deploy</code> xem tiếp.')}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 5', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Đọc <code>TIME 0:31</code> là “mới chạy 31 giây”', 'TIME = giây CPU, không phải tuổi', '<code>ps -o etime= -p PID</code>'],
    ['<code>kill -9</code> hai mươi lần vẫn không chết', 'trạng thái D (kẹt đĩa) hoặc Z (đã chết)', 'D: sửa đĩa/NFS · Z: xử lý CHA'],
    ['“Load 8 — máy sập rồi!”', 'không chia cho số nhân', '<code>nproc</code>; nhìn thêm <code>wa</code>'],
    ['Báo động RAM mỗi ngày, máy vẫn khoẻ', 'đọc cột <code>free</code>', 'đọc <code>available</code>, <code>vmstat si/so</code>'],
    ['Dịch vụ biến mất, log không có lỗi', 'OOM killer — SIGKILL, mã 137', '<code>dmesg -T | grep -i killed</code>'],
    ['<code>Too many open files</code>', 'chạm trần <code>ulimit -n</code> (thường 1024)', 'đóng file rò / <code>LimitNOFILE=</code>'],
    ['<code>pkill -f</code> giết luôn script của mình / không khớp gì', 'khớp chính dòng lệnh / tiến trình đã đổi tên', '<code>pgrep -af</code> trước · <code>lsof -ti:PORT</code>'],
    ['Build qua SSH chết khi gập máy', '<code>&amp;</code> vẫn nằm trong phiên ⇒ SIGHUP', '<code>tmux</code> · <code>nohup</code> · <code>disown -h</code>'],
    ['App <code>nohup</code> mất sau khi VPS reboot', 'không gì dựng nó dậy', 'unit systemd (Chương 11)'],
  ], { sm: true }) },

  { t: 'Ba máy, ba bộ công cụ: Ubuntu · Fedora · macOS · WSL', body: `
    ${table(['Việc', 'Ubuntu 24.04 / WSL2', 'Fedora 44', 'macOS (BSD)'], [
      ['PID 1', '<code>systemd</code> (WSL: có khi bật trong wsl.conf)', '<code>systemd</code>', '!<code>launchd</code>'],
      ['<code>/proc</code>', 'có', 'có', '-KHÔNG có'],
      ['<code>ps --sort</code> · <code>--forest</code>', 'có (GNU procps)', 'có', '-<code>illegal option -- -</code> ⇒ <code>ps aux -r</code> / <code>-m</code>'],
      ['In dòng lệnh khi tìm', '<code>pgrep -af</code>', '<code>pgrep -af</code>', '!<code>pgrep -lf</code> (<code>-a</code> = tổ tiên)'],
      ['<code>pidof</code> · <code>setsid</code> · <code>timeout</code>', 'có', 'có', '-không có cả ba'],
      ['Số tín hiệu STOP/CONT', '19 / 18', '19 / 18', '!17 / 19 — dùng TÊN'],
      ['Bộ nhớ', '<code>free -h</code>', '<code>free -h</code>', '<code>vm_stat</code> · <code>memory_pressure</code>'],
      ['Số nhân · top một lần', '<code>nproc</code> · <code>top -bn1</code>', 'như Ubuntu', '<code>sysctl -n hw.ncpu</code> · <code>top -l 1</code>'],
      ['<code>ulimit -n</code> mặc định', 'thường 1024 · Docker: 1048576', '1024 / cứng 524288', 'tuỳ phiên (máy đo: 1048576) · launchd mềm 256'],
      ['Xem bằng giao diện', '<code>htop</code> (apt)', '<code>htop</code> (dnf)', 'Activity Monitor'],
    ], { sm: true })}` },

  { t: 'Bảng tra nhanh Chương 5 (1/2): nhìn tiến trình &amp; nhìn máy', body: two(
    sh([
      ['echo $$ $PPID', 'PID shell · PID cha'],
      ['ps aux --sort=-%cpu | head', 'ai đốt CPU'],
      ['ps aux --sort=-rss | head', 'ai giữ RAM'],
      ['ps -ef · ps -e --forest', 'có PPID · vẽ cây'],
      ['ps -o pid,ppid,stat,etime,cmd -p N', 'chọn cột'],
      ['pstree -p · pstree -ps $$', 'cây · tổ tiên của tôi'],
      ['pgrep -af mẫu · pgrep -x tên', 'tìm theo dòng lệnh · đúng tên'],
      ['pidof nginx', 'chỉ PID'],
      ['ls -l /proc/N/fd · cat /proc/N/status', 'file đang mở · hồ sơ'],
      ['ps -o ppid= -p <Z>', 'cha của xác sống'],
    ], { fs: 15.5 }),
    sh([
      ['top · htop · top -bn1 | head -12', 'nhìn sống · một lát cắt'],
      ['uptime · nproc · cat /proc/loadavg', 'tải ÷ số nhân'],
      ['free -h', 'đọc available'],
      ['vmstat 1 5', 'si/so: swap đang chạy?'],
      ['sudo dmesg -T | grep -i killed', 'OOM đã giết ai'],
      ['nice -n 10 cmd · renice -n 15 -p N', 'hạ ưu tiên'],
      ['ulimit -a · ulimit -n 4096', 'xem · đặt trần'],
      ['cat /proc/N/limits', 'trần của tiến trình chạy'],
      ['prlimit --pid N --nofile=S:H', 'đổi trần khi đang chạy'],
      ['lsof -p N | wc -l', 'đang mở bao nhiêu file'],
    ], { fs: 15.5 })) },

  { t: 'Bảng tra nhanh Chương 5 (2/2): tín hiệu &amp; job', body: two(
    sh([
      ['kill PID · kill -TERM PID', 'xin tắt (15)'],
      ['kill -HUP PID', 'daemon: nạp lại cấu hình'],
      ['kill -KILL PID', 'phương án CUỐI (9)'],
      ['kill -0 PID', 'còn sống không? (không gửi gì)'],
      ['kill -l · kill -l 143', 'bảng tín hiệu · 143 = TERM'],
      ['pkill -x tên · pkill -u an node', 'giết theo tên · theo người'],
      ['killall nginx', 'mọi tiến trình tên nginx'],
      ['lsof -ti:3000 | xargs -r kill', 'giết kẻ giữ cổng'],
      ["trap 'dọn' EXIT · trap '' HUP", 'bắt · lờ tín hiệu'],
      ['grep Sig /proc/N/status', 'nó lờ/bắt gì'],
    ], { fs: 15.5 }),
    sh([
      ['Ctrl-C · Ctrl-Z · Ctrl-\\', 'INT · TSTP · QUIT'],
      ['jobs -l', 'job của shell này + PID'],
      ['fg %1 · bg %1 · kill %1', 'kéo lên · đẩy xuống · giết'],
      ['cmd > log 2>&1 &', 'chạy nền, output vào file'],
      ['echo $! · wait $pid', 'PID vừa chạy · chờ lấy mã'],
      ['nohup cmd > log 2>&1 &', 'lờ SIGHUP'],
      ['disown -h %1', 'cứu job đang chạy'],
      ['setsid cmd < /dev/null &', 'phiên riêng (Linux)'],
      ['tmux new -s x · Ctrl-B d', 'phiên tmux · tách ra'],
      ['tmux attach || tmux new', 'thói quen mỗi lần SSH'],
    ], { fs: 15.5 })) },

  { t: 'Thực hành Chương 5 (40 phút): chữa một “máy chủ ốm”', body: `
    ${steps([
      ['Container <code>ubuntu:24.04</code> + procps lsof python3 tmux; dựng 4 tiến trình S/T/R/Z + server cổng 19050', 'đoán trạng thái từng dòng <code>ps</code> TRƯỚC khi đọc'],
      ['Đọc <code>top -bn1</code>, <code>free -h</code>, <code>nproc</code>: máy đang nghẽn CPU hay không?', 'giải thích bằng 3 con số'],
      ['<code>ulimit -n 16</code> trong subshell, làm Python báo Errno 24', 'thấy đúng <code>Too many open files</code>'],
      ['Tìm và dừng server theo CỔNG (không theo tên), leo thang TERM → kiểm → KILL; đọc $? của từng cái chết', 'ghép được mã 130 / 137 / 143 với tín hiệu'],
      ['Treo, đẩy nền, kéo lên một job; rồi thử <code>&amp;</code>, <code>nohup</code>, <code>disown -h</code>, <code>setsid</code> trước <code>kill -HUP $$</code>', 'đoán TRƯỚC cái nào sống sót, rồi kiểm'],
    ])}
    ${box('good', '<b>Đạt khi:</b> nói được vì sao xác sống không chết bằng <code>kill -9</code>, dự đoán đúng 3/4 tiến trình sống sót sau SIGHUP, và dừng server mà không cần biết tên nó.')}` },
]);
