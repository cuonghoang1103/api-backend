/**
 * Linux & Bash · Deck lx-08 — Chương 8: Môi trường, PATH & file khởi động.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu"  = container ubuntu:24.04 (arm64, bash 5.2.21, sudo, cron, openssh-server) trên Mac M1,
 *                 người dùng `an` (uid 1001), máy tên `lab`. Dấu mốc `echo "  -> <file>" >&2` được chèn vào
 *                 DÒNG ĐẦU từng file khởi động của container vứt đi (và dòng cuối ~/.bashrc, SAU cái chốt).
 *                 `node` ở đây là script giả in số phiên bản — để thấy PATH chọn bản nào, không cần cài Node.
 *                 cron chạy thật (`* * * * * env > …`), ssh chạy thật (sshd trong container, ssh localhost).
 *   • "Mac"     = Mac M1, macOS 27, zsh 5.9, /bin/bash 3.2.57. File khởi động đo bằng
 *                 `ZDOTDIR=<scratch>/zdot zsh …` và `HOME=<scratch>/home /bin/bash …` — KHÔNG đụng dotfile thật.
 *   • "Fedora"  = linux-nha (Fedora 44, bash 5.3.9) — chỉ đọc /etc/skel và /etc/profile.
 *
 * Hình tự vẽ (SVG nội tuyến): timPath() shell tìm lệnh qua bảng băm rồi PATH trái → phải ·
 * bashNap() thứ tự nạp file khởi động của bash theo loại shell · zshNap() thứ tự của zsh + ma trận đo thật ·
 * xuatBien() biến shell vs biến môi trường khi fork/exec · annot() dòng PS1 có ngoặc chú thích (chép từ lx-05).
 */
import { S, cover, sh, term, mindmap, cards, box, steps, table, two, tree, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-08', code: 'LINUX · CHƯƠNG 8', title: 'Môi trường, PATH &amp; file khởi động', sub: 'Linux & Bash · Chương 8' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;

/** annot(str, segs) — như lx-05: một dòng chữ đơn cách, ngoặc màu + nhãn dưới từng đoạn. */
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

/* Slide 3 — gõ `node`: bảng băm trước, rồi PATH từ trái qua phải */
const timPath = () => {
  let s = '';
  // hàng 1: lệnh gõ → bảng băm
  s += R(0, 14, 150, 64, { c: 'lx', fill: '#050806' }) + T(75, 54, '$ node', { fs: 22, a: 'middle', b: true, mono: true, c: 'lx' });
  s += A(152, 46, 206, 46, { c: 'lx' });
  s += R(210, 8, 270, 76, { c: 'vio' }) + T(345, 38, '① bảng băm (hash)', { fs: 17, a: 'middle', b: true, c: 'vio' }) +
    T(345, 64, 'node → ? (chưa nhớ)', { fs: 15, a: 'middle', mono: true, c: 'mu' });
  s += A(482, 32, 560, 32, { c: 'grn' }) + T(572, 38, 'TRÚNG → chạy luôn đường đã nhớ, KHÔNG tìm lại', { fs: 15.5, c: 'grn', b: true });
  s += T(572, 66, 'đường đó bị xoá/dời ⇒ “No such file or directory” · chữa: hash -r', { fs: 14.5, c: 'mu' });
  s += A(300, 86, 150, 152, { c: 'red' }) + T(222, 114, 'TRƯỢT', { fs: 15, c: 'red', b: true, a: 'end' });
  // chuỗi PATH
  s += T(560, 128, 'PATH=/home/an/.local/bin:/usr/local/bin:/usr/bin:/bin', { fs: 17, a: 'middle', mono: true, c: '#cfe8d6' });
  // hàng 2: 4 thư mục
  const dirs = [
    ['② /home/an/.local/bin', '✗ không có node', 'red', false],
    ['③ /usr/local/bin', '✓ node — THẮNG', 'grn', false],
    ['/usr/bin', 'node ở đây cũng vô ích', 'amb', true],
    ['/bin', 'không được xét tới', 'dim', true],
  ];
  dirs.forEach(([t, d, col, dash], i) => {
    const x = i * 285;
    s += R(x, 156, 265, 78, { c: col, dash, fill: i === 1 ? 'rgba(63,185,80,.13)' : '#111812' }) +
      T(x + 132, 188, t, { fs: 16, a: 'middle', b: true, mono: true, c: dash ? 'mu' : '#e6edf3' }) + T(x + 132, 216, d, { fs: 15, a: 'middle', c: col });
    if (i < 3) s += A(x + 266, 195, x + 283, 195, { c: i === 0 ? 'lx' : 'dim', sw: 2.5, dash: i > 0 });
  });
  // hàng 3: kết quả
  s += A(417, 236, 417, 272, { c: 'grn' });
  s += R(160, 276, 520, 52, { c: 'grn', fill: 'rgba(63,185,80,.10)' }) + T(420, 298, 'exec /usr/local/bin/node', { fs: 16, a: 'middle', b: true, mono: true }) +
    T(420, 319, '+ GHI vào ① — lần sau khỏi tìm', { fs: 14.5, a: 'middle', c: 'vio', b: true });
  s += R(700, 276, 440, 52, { c: 'red', fill: 'rgba(255,77,94,.08)' }) + T(920, 300, 'hết PATH mà không thấy ⇒', { fs: 15, a: 'middle', c: 'mu' }) +
    T(920, 320, 'command not found · $? = 127', { fs: 15, a: 'middle', b: true, mono: true, c: 'red' });
  return sv(1150, 336, s);
};

/* Slide 10 — bash nạp file nào, theo loại shell (đo thật trên Ubuntu 24.04) */
const bashNap = () => {
  let s = '';
  const lane = (y, h, t, d, col) => {
    s += R(0, y, 1150, h, { c: col, fill: 'rgba(255,255,255,.015)', r: 12, sw: 1.5, dash: true });
    s += T(16, y + 30, t, { fs: 17, b: true, c: col }) + T(16, y + 54, d, { fs: 13.5, c: 'mu', mono: true });
  };
  const F = (x, y, w, t, d, col, { dash = false, h = 50 } = {}) => {
    s += R(x, y, w, h, { c: col, dash, r: 9 }) + T(x + w / 2, y + (d ? 21 : 31), t, { fs: 15.5, a: 'middle', b: true, mono: true });
    if (d) s += T(x + w / 2, y + 40, d, { fs: 12.5, a: 'middle', c: 'mu' });
  };
  // Làn 1: đăng nhập
  lane(0, 128, 'ĐĂNG NHẬP', 'bash -l · ssh vps · su -', 'lx');
  F(250, 40, 170, '/etc/profile', '+ /etc/profile.d/*.sh', 'lx');
  s += A(422, 65, 452, 65, { c: 'lx' });
  s += R(456, 6, 230, 116, { c: 'amb', fill: 'rgba(245,158,11,.06)', r: 10, sw: 1.5 });
  s += T(571, 25, 'chỉ CÁI ĐẦU TIÊN có mặt:', { fs: 13.5, a: 'middle', c: 'amb', b: true });
  ['1 ~/.bash_profile', '2 ~/.bash_login', '3 ~/.profile'].forEach((t, i) => {
    s += R(470, 34 + i * 29, 202, 25, { c: 'amb', r: 6, sw: 1.5 }) + T(571, 51 + i * 29, t, { fs: 14, a: 'middle', mono: true });
  });
  s += A(688, 65, 730, 65, { c: 'lx', dash: true }) + T(709, 54, 'gọi', { fs: 13, a: 'middle', c: 'mu' });
  F(734, 40, 190, '~/.bashrc', 'Ubuntu: ~/.profile source nó', 'grn', { dash: true });
  s += A(926, 65, 956, 65, { c: 'dim', dash: true });
  F(960, 40, 180, '~/.bash_logout', 'lúc exit', 'dim', { dash: true });
  // Làn 2: tương tác, không đăng nhập
  lane(138, 76, 'TƯƠNG TÁC', 'tab mới · bash · tmux', 'grn');
  F(250, 151, 200, '/etc/bash.bashrc', '', 'grn');
  s += A(452, 176, 486, 176, { c: 'grn' });
  F(490, 151, 200, '~/.bashrc', '', 'grn');
  s += T(712, 172, 'KHÔNG đọc file profile nào', { fs: 15, c: 'grn', b: true }) + T(712, 194, '⇒ export PATH trong ~/.profile không tới đây — đã thừa kế từ cha', { fs: 13.5, c: 'mu' });
  // Làn 3: không tương tác
  lane(224, 76, 'KHÔNG TƯƠNG TÁC', 'script · bash -c · cron', 'red');
  F(250, 237, 220, '$BASH_ENV', 'chỉ khi biến này được đặt', 'red', { dash: true });
  s += T(492, 258, 'ngoài ra: KHÔNG ĐỌC GÌ CẢ', { fs: 17, c: 'red', b: true }) + T(492, 281, 'bí danh, PATH thêm trong rc… đều vắng mặt', { fs: 14, c: 'mu' });
  // Làn 4: ssh host 'lệnh'
  lane(310, 90, "ssh host 'lệnh'", 'không tương tác, KHÔNG login', 'blu');
  F(250, 330, 200, '/etc/bash.bashrc', '', 'blu');
  s += A(452, 355, 486, 355, { c: 'blu' });
  F(490, 330, 200, '~/.bashrc', 'dòng đầu vẫn chạy', 'blu');
  s += A(692, 355, 726, 355, { c: 'red' });
  F(730, 330, 200, 'case $- … return', 'cái chốt: dừng ở đây', 'red');
  s += T(950, 340, 'nvm thêm PATH', { fs: 14, c: 'amb', b: true }) + T(950, 360, 'ở CUỐI .bashrc', { fs: 14, c: 'amb' }) + T(950, 380, '⇒ không bao giờ tới', { fs: 14, c: 'red', b: true });
  return sv(1150, 402, s);
};

/* Slide 13 — zsh: bốn file, và ai đọc file nào (đo thật trên Mac) */
const zshNap = () => {
  let s = '';
  const files = [
    ['.zshenv', 'MỌI zsh, kể cả script', 'vio'],
    ['.zprofile', 'login · macOS: /etc/zprofile', 'lx'],
    ['.zshrc', 'tương tác', 'grn'],
    ['.zlogin', 'login, SAU .zshrc', 'amb'],
    ['.zlogout', 'login, lúc thoát', 'dim'],
  ];
  const X0 = 250, W = 168, G = 12;
  files.forEach(([t, d, col], i) => {
    const x = X0 + i * (W + G);
    s += R(x, 0, W, 64, { c: col, r: 9 }) + T(x + W / 2, 28, t, { fs: 17, a: 'middle', b: true, mono: true }) + T(x + W / 2, 50, d, { fs: 12.5, a: 'middle', c: 'mu' });
    if (i < 4) s += A(x + W + 1, 32, x + W + G - 1, 32, { c: 'dim', sw: 2 });
  });
  s += T(0, 28, 'thứ tự đọc →', { fs: 16, b: true, c: 'lx' }) + T(0, 50, '(trong $ZDOTDIR, mặc định ~)', { fs: 13, c: 'mu' });
  const rows = [
    ['zsh -c "lệnh"', 'script, ssh host lệnh', [1, 0, 0, 0, 0]],
    ['zsh -i -c true', 'gõ zsh trong zsh', [1, 0, 1, 0, 0]],
    ['zsh -l -c true', 'login không tương tác', [1, 1, 0, 1, 0]],
    ['zsh -l -i  → exit', 'tab Terminal / iTerm', [1, 1, 1, 1, 1]],
  ];
  rows.forEach(([cmd, d, on], r) => {
    const y = 86 + r * 58;
    s += R(0, y, 1150, 50, { c: 'bd', fill: r % 2 ? '#0d140f' : '#101812', r: 8, sw: 1 });
    s += T(14, y + 22, cmd, { fs: 15.5, b: true, mono: true }) + T(14, y + 41, d, { fs: 12.5, c: 'mu' });
    on.forEach((v, i) => {
      const cx = X0 + i * (W + G) + W / 2;
      s += v ? `<circle cx="${cx}" cy="${y + 25}" r="13" fill="${D[files[i][2]]}"/>` + T(cx, y + 31, '✓', { fs: 16, a: 'middle', b: true, c: '#0a0f0c' })
        : T(cx, y + 31, '—', { fs: 18, a: 'middle', c: 'dim' });
    });
  });
  return sv(1150, 322, s);
};

/* Slide 15 — biến shell vs biến môi trường khi fork/exec */
const xuatBien = () => {
  let s = '';
  // cha
  s += R(0, 0, 470, 255, { c: 'lx', r: 14 });
  s += T(20, 30, 'CHA · bash (PID 4102)', { fs: 18, b: true, c: 'lx' });
  s += R(20, 44, 430, 80, { c: 'dim', dash: true, r: 10 }) + T(36, 68, 'biến SHELL — chỉ shell này thấy', { fs: 15, b: true, c: 'mu' });
  s += T(36, 92, 'MAU=do', { fs: 16, mono: true }) + T(36, 113, 'i=3   PS1=…   (declare --)', { fs: 15, mono: true, c: 'mu' });
  s += R(20, 136, 430, 106, { c: 'grn', r: 10 }) + T(36, 160, 'MÔI TRƯỜNG — đã export (declare -x)', { fs: 15, b: true, c: 'grn' });
  s += T(36, 184, 'PATH=/usr/local/bin:/usr/bin:…', { fs: 15.5, mono: true }) + T(36, 206, 'HOME=/home/an   LANG=C.UTF-8', { fs: 15.5, mono: true }) +
    T(36, 228, 'SO=1', { fs: 15.5, mono: true, c: 'grn' });
  // mũi tên
  s += A(472, 190, 676, 190, { c: 'grn' }) + T(574, 176, 'fork + exec', { fs: 15, a: 'middle', c: 'grn', b: true, mono: true });
  s += T(574, 214, 'CHÉP một bản', { fs: 14, a: 'middle', c: 'mu' });
  s += A(452, 84, 628, 84, { c: 'red', dash: true }) + T(540, 72, 'không đi theo', { fs: 14, a: 'middle', c: 'red' });
  s += `<text x="640" y="95" font-size="28" fill="${D.red}" font-weight="800">✗</text>`;
  s += `<path d="M700 257 C 640 292, 530 292, 474 260" stroke="${D.red}" stroke-width="2.5" fill="none" stroke-dasharray="7 6" marker-end="url(#m-red)"/>`;
  s += T(575, 250, 'KHÔNG ghi ngược', { fs: 14, a: 'middle', c: 'red', b: true });
  // con
  s += R(680, 0, 470, 255, { c: 'grn', r: 14 });
  s += T(700, 30, 'CON · node server.js (PID 4150)', { fs: 18, b: true, c: 'grn' });
  s += T(700, 68, 'echo $MAU  →  (rỗng)', { fs: 16, mono: true, c: 'red' });
  s += T(700, 100, 'đọc được: /proc/4150/environ', { fs: 14.5, c: 'mu', mono: true });
  s += R(700, 136, 430, 106, { c: 'grn', r: 10 }) + T(716, 160, 'bản sao môi trường của cha', { fs: 15, b: true, c: 'grn' });
  s += T(716, 184, 'PATH=… HOME=… LANG=…', { fs: 15.5, mono: true }) + T(716, 206, 'SO=1', { fs: 15.5, mono: true, c: 'grn' });
  s += T(716, 228, 'ĐÓNG BĂNG từ lúc exec', { fs: 14.5, c: 'amb', b: true });
  return sv(1150, 292, s);
};

export const slides = S([
  cover({ t: 'Chương 8 — Môi trường, PATH &amp; file khởi động', sub: 'PATH &amp; bảng băm · file khởi động bash/zsh · cron không đọc gì · export · .env · bí mật · bí danh, PS1, lịch sử', chap: 'CHƯƠNG 8' }),

  { t: 'Bản đồ chương: lệnh nào chạy, và nó thấy biến nào', body: mindmap('Môi trường', 'mỗi tiến trình mang theo một túi biến', [
    { t: '8.1 PATH', d: 'trái → phải · type -a · hash -r · thêm đầu/cuối · dấu . nguy hiểm · sudo secure_path', c: 'lx' },
    { t: '8.1 Nguồn của PATH', d: '/etc/environment · /etc/profile.d · macOS path_helper', c: 'amb' },
    { t: '8.2 File khởi động', d: 'login × tương tác · profile đầu tiên thắng · cái chốt · zsh .zshenv→.zlogin', c: 'grn' },
    { t: '8.2 cron / ssh / systemd', d: 'PATH=/usr/bin:/bin · ssh host lệnh · không phải phiên shell', c: 'red' },
    { t: '8.3 Biến môi trường', d: 'export · con không sửa cha · env -i/-u · .env + set -a · /proc/PID/environ', c: 'blu' },
    { t: '8.4 Tuỳ biến shell', d: 'alias vs hàm · PS1 · histappend · HISTCONTROL · inputrc', c: 'vio' },
  ]) },

  /* ───────────── 8.1 ───────────── */
  { t: 'Shell tìm lệnh: bảng băm trước, rồi PATH trái → phải', body: `
    ${timPath()}
    ${two(
      term(['$ echo "$PATH" | tr \':\' \'\\n\' | head -3', '/home/an/.local/bin', '/usr/local/sbin', '/usr/local/bin'], { title: 'Ubuntu — đọc PATH như một danh sách', fs: 14 }),
      term(['$ khongco', '! bash: khongco: command not found', '$ echo $?', '= 127'], { title: 'Ubuntu — tìm hết mà không thấy', fs: 14 }))}` },

  { t: 'Trước PATH còn bí danh, hàm, lệnh dựng sẵn', body: two(
    `${steps([
      ['<b>Bí danh</b> (alias) — chỉ shell tương tác', '<code>ls</code> → <code>ls --color=auto</code>'],
      ['<b>Hàm</b> (function) — đè mọi chương trình cùng tên', '<code>ls() { … }</code> che <code>/usr/bin/ls</code>'],
      ['<b>Dựng sẵn</b> (builtin) — một phần của bash', '<code>cd</code> · <code>echo</code> · <code>export</code>'],
      ['<b>Bảng băm</b> — đường đã tìm thấy lần trước', '<code>hash</code> xem · <code>hash -r</code> xoá'],
      ['<b>PATH</b> — từng thư mục, trái → phải', 'không thấy: 127'],
    ])}`,
    `${term(['$ type ls', "ls is aliased to `ls --color=auto'", '$ type -a echo', 'echo is a shell builtin', 'echo is /usr/bin/echo', 'echo is /bin/echo', '$ type -t cd; type -t ls', 'builtin', 'alias', '$ command -v cd; command -v ls', 'cd', "alias ls='ls --color=auto'", '$ type -P ls', '= /usr/bin/ls', '$ which cd; echo $?', '! 1'], { title: 'Ubuntu 24.04 — bash tương tác, output thật', fs: 14 })}
    ${box('info', '<code>type</code> cho NGƯỜI đọc · <code>command -v</code> cho SCRIPT · <code>which</code> là chương trình ngoài, không thấy bí danh/hàm/builtin.')}`, 'r') },

  { t: 'Bảng băm nhớ đường CŨ — hash -r bắt tìm lại', body: two(
    term(['$ PATH=~/b1:~/b2:$PATH', '$ xin', 'toi o /home/an/b1/xin', '$ hash', 'hits    command', '+    1    /home/an/b1/xin', '$ mv ~/b1/xin ~/b2/', '$ xin', '! bash: /home/an/b1/xin: No such file or directory', '$ echo $?', '127', '$ hash -t xin', '/home/an/b1/xin', '$ hash -r', '$ xin', '= toi o /home/an/b2/xin'], { title: 'Ubuntu — dời file giữa hai thư mục ĐỀU có trong PATH', fs: 14 }),
    `${table(['Lệnh', 'Làm gì'], [
      ['<code>hash</code>', 'xem bảng: số lần trúng + đường'],
      ['<code>hash -t node</code>', 'đường đang nhớ cho <code>node</code>'],
      ['<code>hash -d node</code>', 'quên riêng <code>node</code>'],
      ['<code>hash -r</code>', '+quên TẤT CẢ'],
      ['<code>hash -l</code>', 'in dạng dán lại được'],
      ['<code>PATH=$PATH</code>', 'gán PATH cũng xoá sạch bảng'],
    ], { sm: true })}
    ${box('warn', '<b>Đo thật:</b> ĐỔI PATH là bash tự xoá bảng băm. Bảng cũ chỉ cắn khi file dời chỗ mà PATH <b>giữ nguyên</b> — vd. gỡ bản ở <code>/usr/local/bin</code>, còn bản ở <code>/usr/bin</code>.')}`, 'r') },

  { t: 'Thứ tự trong PATH chọn phiên bản — đừng thay cả PATH', body: two(
    `${sh([
      ['export PATH="$HOME/.local/bin:$PATH"', 'thêm ĐẦU: bản của bạn thắng'],
      ['export PATH="$PATH:/opt/tools/bin"', 'thêm CUỐI: chỉ khi thiếu'],
      ['PATH="/opt/bin"', 'SAI: xoá cả danh sách'],
      ['case ":$PATH:" in', 'chỉ thêm nếu chưa có'],
      ['  *":$HOME/.local/bin:"*) ;;', ''],
      ['  *) PATH="$HOME/.local/bin:$PATH" ;;', ''],
      ['esac', ''],
    ], { fs: 14.5 })}
    ${term(['$ PATH="/opt/bin"', '$ ls', '! bash: ls: command not found', '$ export PATH=/usr/bin:/bin   # cứu', '$ ls -d /tmp', '= /tmp'], { title: 'Ubuntu — thay cả PATH', fs: 14 })}`,
    `${term(['# có node ở ~/.local/bin (v22) VÀ /usr/local/bin (v20)', '$ PATH="$PATH:$HOME/.local/bin" bash -c \'node --version\'', 'v20.11.1', '$ PATH="$HOME/.local/bin:$PATH" bash -c \'node --version\'', '= v22.6.0', '$ PATH="$HOME/.local/bin:$PATH" bash -c \'type -a node\'', '+ node is /home/an/.local/bin/node', 'node is /usr/local/bin/node'], { title: 'Ubuntu — node là script giả in số phiên bản', fs: 13.5 })}
    ${box('tip', '<b>Thêm đầu</b> cho nvm/pyenv và script của bạn — cố ý che bản hệ thống. <b>Thêm cuối</b> cho công cụ phụ không được phép đè lệnh hệ thống.')}`) },

  { t: 'Dấu “.” hay mục rỗng trong PATH = chạy file của người lạ', body: two(
    `${term(['$ cd /tmp/du-an-tai-ve; /usr/bin/ls', 'README.md  ls  setup.sh', '$ PATH=".:$PATH"', '$ ls', '! BAN VUA CHAY ./ls CUA NGUOI LA (uid=1001)', '$ PATH="$PATH:"          # dấu : ở cuối', '$ type -a ls | tail -1', '! ls is ./ls'], { title: 'Ubuntu — một repo tải về có file tên ls', fs: 14 })}
    ${box('bad', 'Kẻ tấn công không phá gì cả: chỉ cần bạn <code>cd</code> vào thư mục của họ rồi gõ một lệnh bình thường. Vì thế script ở thư mục hiện tại phải gọi <code>./script.sh</code>.')}`,
    `${sh([['echo "$PATH" | grep -qE \'(^|:)(\\.)?(:|$)\' \\', ''], ['  && echo "CO . hoac muc rong"', '']], { fs: 14.5 })}
    ${table(['PATH', 'Kết quả'], [
      ['<code>.:/usr/bin</code>', '-CÓ . hoặc mục rỗng'],
      ['<code>/usr/bin:</code>', '-CÓ (: cuối = thư mục hiện tại)'],
      ['<code>:/usr/bin</code>', '-CÓ (: đầu)'],
      ['<code>/usr/bin::/bin</code>', '-CÓ (:: ở giữa)'],
      ['<code>/usr/bin:/bin</code>', '+sạch'],
    ], { sm: true })}`) },

  { t: 'PATH đến từ đâu — và macOS xếp lại nó bằng path_helper', body: two(
    `${table(['Nguồn', 'Ai đọc', 'Ghi chú'], [
      ['<code>/etc/environment</code>', 'PAM, lúc đăng nhập', 'chỉ <code>KEY="giá trị"</code>, không phải script'],
      ['<code>/etc/profile</code> + <code>profile.d/*.sh</code>', 'shell login', 'gói cài thả file vào đây'],
      ['<code>~/.profile</code>', 'shell login', '+chỗ ĐÚNG cho PATH riêng'],
      ['<code>~/.bashrc</code>', 'shell tương tác', 'chạy lại mỗi shell ⇒ trùng'],
      ['crontab · unit systemd', '-không file nào ở trên', 'tự khai PATH'],
    ], { sm: true })}
    ${term(['$ cat /etc/environment', 'PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin', ':/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"'], { title: 'Ubuntu 24.04 — một dòng, bẻ đôi cho vừa', fs: 13 })}`,
    `${term(['$ cat /etc/paths', '/usr/local/bin', '/System/Cryptexes/App/usr/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin', '$ cat /etc/paths.d/homebrew', '/opt/homebrew/bin', '$ env -i PATH="/Users/an/.nvm/bin:/usr/bin:/bin" \\', '    /usr/libexec/path_helper -s', 'PATH="/usr/local/bin:…:/usr/bin:/bin:/usr/sbin:/sbin:…', '! :/opt/homebrew/bin:/Users/an/.nvm/bin"; export PATH;'], { title: 'Mac M1 (macOS 27) — output thật, cắt bớt …', fs: 13.5 })}
    ${box('warn', '<code>/etc/zprofile</code> và <code>/etc/profile</code> của Mac gọi <code>path_helper</code>: <code>/etc/paths</code> lên ĐẦU, thứ bạn thêm từ trước bị đẩy xuống CUỐI ⇒ <code>/usr/bin</code> thắng nvm. Thêm PATH ở <code>~/.zprofile</code>/<code>~/.zshrc</code> (đọc SAU).')}`) },

  { t: 'sudo dùng secure_path — sudo -E cũng không cứu PATH', body: two(
    term(['$ node --version', 'v22.6.0', '$ sudo node --version', '! sudo: node: command not found', '$ sudo -E node --version', '! sudo: node: command not found', '$ sudo env | grep ^PATH', 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:…:/snap/bin', '$ sudo "$(command -v node)" --version', '= v22.6.0', '$ sudo env PATH="$PATH" node --version', '= v22.6.0'], { title: 'Ubuntu 24.04, sudo 1.9 — node nằm trong ~/.nvm-gia/bin', fs: 14 }),
    `${term(['$ grep secure_path /etc/sudoers', 'Defaults  secure_path="/usr/local/sbin:', '  /usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"'], { title: 'Ubuntu — nguồn của PATH khi sudo (bẻ dòng)', fs: 13 })}
    ${table(['Cách', 'Kết quả'], [
      ['<code>sudo -E node</code>', '-vẫn không thấy: -E giữ biến khác, PATH thì KHÔNG'],
      ['<code>sudo "$(command -v node)"</code>', '+chạy — đường tuyệt đối'],
      ['<code>sudo env PATH="$PATH" node</code>', '+chạy — PATH cho đúng một lệnh'],
      ['thêm <code>~/.nvm/…</code> vào secure_path', '-ĐỪNG: root chạy file bạn ghi được'],
    ], { sm: true })}
    ${box('info', 'Lỗi của <code>sudo</code> là <code>sudo: node: command not found</code> và <b>exit 1</b> — không phải 127 như bash.')}`) },

  /* ───────────── 8.2 ───────────── */
  { t: 'Ba loại shell — hỏi thẳng bằng login_shell và $-', body: `
    ${cards([
      { ic: '🔑', t: 'Đăng nhập (login)', d: '<code>ssh vps</code> · <code>bash -l</code> · <code>su -</code> · tab Terminal trên Mac. Đọc file <strong>profile</strong>, một lần đầu phiên.', c: 'amb' },
      { ic: '⌨️', t: 'Tương tác, không login', d: 'tab mới trên Linux · gõ <code>bash</code> · ô <code>tmux</code>. Đọc <strong>~/.bashrc</strong>. Có dấu nhắc, có TTY.', c: 'grn' },
      { ic: '🤖', t: 'Không tương tác', d: 'script · <code>bash -c</code> · cron · <code>ssh host \'lệnh\'</code>. Gần như <strong>không đọc gì</strong>.', c: 'red' },
    ], 3)}
    ${two(
      sh([['shopt -q login_shell && echo login', 'login hay không'], ['[[ $- == *i* ]] && echo tuong-tac', 'i trong $- = tương tác'], ['echo "$0"', '-bash (gạch đầu) = login']], { fs: 14.5 }),
      term(['$ bash -c "$Q"', 'khong-login · khong-tuong-tac · $0=bash', '$ bash -l -c "$Q"', '+ login · khong-tuong-tac · $0=bash', '$ bash -i            # rồi gõ $Q', '= khong-login · tuong-tac', '$ su - an -c \'echo $0\'', '-bash'], { title: 'Ubuntu — Q là hai phép thử bên trái', fs: 13.5 }), 'l')}` },

  { t: 'bash đọc file nào: tuỳ loại shell (đo thật)', body: `${bashNap()}
    ${box('info', 'Login <b>tương tác</b> (<code>ssh vps</code>) đi CẢ hai đường: <code>/etc/profile</code> → <code>/etc/bash.bashrc</code>, <code>~/.profile</code> → <code>~/.bashrc</code>.')}` },

  { t: 'Đo bằng dấu mốc: mỗi cách gọi, một kết quả', body: two(
    term(['$ bash -l -c true', '+   -> /etc/profile', '+   -> ~/.profile', '  -> ~/.bashrc (dòng 1, TRƯỚC cái chốt)', '$ bash -l -i -c true', '+   -> /etc/profile', '  -> /etc/bash.bashrc', '+   -> ~/.profile', '  -> ~/.bashrc (dòng 1, TRƯỚC cái chốt)', '=   -> ~/.bashrc (cuối file, SAU cái chốt)', '$ bash -i -c true', '  -> /etc/bash.bashrc', '  -> ~/.bashrc (dòng 1, TRƯỚC cái chốt)', '=   -> ~/.bashrc (cuối file, SAU cái chốt)', '$ bash -c true', '# (không in gì)'], { title: 'Ubuntu 24.04 — HOME=~/thu-home, dấu mốc ra stderr', fs: 13.5 }),
    `${term(['$ BASH_ENV=~/.benv bash -c true', '+   -> BASH_ENV', '$ sh -l -c true          # dash', '  -> /etc/profile', '  -> ~/.profile', '$ echo \'echo "  -> ~/.bash_profile" >&2\' > ~/.bash_profile', '$ bash -l -c true', '  -> /etc/profile', '!   -> ~/.bash_profile    # ~/.profile bị BỎ QUA'], { title: 'Ubuntu — BASH_ENV, sh, và profile đầu tiên thắng', fs: 13.5 })}
    ${box('warn', 'Một trình cài đặt lỡ tạo <code>~/.bash_profile</code> ⇒ <code>~/.profile</code> im lặng thôi được đọc. Có cả hai thì <code>~/.bash_profile</code> phải tự <code>. ~/.profile</code>.')}`) },

  { t: "ssh host 'lệnh' đọc .bashrc — rồi dừng ở cái chốt", body: two(
    `${term(['$ ssh lab \'node --version\'', '  -> /etc/bash.bashrc', '  -> ~/.bashrc (dòng 1, TRƯỚC cái chốt)', '! bash: line 1: node: command not found', '$ ssh lab \'bash -lc "node --version"\'', '  -> /etc/profile', '  -> ~/.profile', '  -> ~/.bashrc (dòng 1, TRƯỚC cái chốt)', '! bash: line 1: node: command not found', '$ ssh lab \'~/.nvm-gia/bin/node --version\'', '= v22.6.0'], { title: 'Ubuntu — sshd thật, PATH của nvm ở CUỐI ~/.bashrc', fs: 13.5 })}`,
    `${sh([['# ~/.bashrc của Ubuntu', ''], ['case $- in', ''], ['    *i*) ;;', 'tương tác: đọc tiếp'], ['      *) return;;', 'còn lại: DỪNG ở đây'], ['esac', ''], ['…', ''], ['export NVM_DIR="$HOME/.nvm"', 'nvm cài thêm ở CUỐI'], ['. "$NVM_DIR/nvm.sh"', 'ssh lệnh không bao giờ tới']], { fs: 14 })}
    ${box('tip', 'Bash của Debian/Ubuntu đọc <code>~/.bashrc</code> cả khi sshd gọi nó không tương tác — chính vì thế mới có cái chốt. <code>bash -lc</code> cũng KHÔNG cứu được nvm. Dùng đường tuyệt đối, hoặc đưa PATH lên <code>~/.profile</code>.')}
    ${box('bad', 'Thứ gì <b>IN RA</b> đặt TRÊN cái chốt sẽ lọt vào luồng của <code>scp</code>/<code>rsync</code>/<code>git</code> ⇒ lỗi giao thức.')}`, 'l') },

  { t: 'zsh (mặc định trên Mac): .zshenv → .zprofile → .zshrc → .zlogin', body: `
    ${zshNap()}
    ${two(
      box('info', 'Đo trên Mac bằng <code>ZDOTDIR=~/thu/zdot zsh …</code> — mỗi file một dòng <code>echo</code>, không đụng file thật. <code>ps</code> thấy <code>-zsh</code>: Terminal/iTerm mở shell <b>login</b> ở MỌI tab.'),
      box('tip', 'Biến cho mọi zsh (cả script) → <code>.zshenv</code> (giữ thật ngắn). PATH → <code>.zprofile</code>. Bí danh, prompt → <code>.zshrc</code>. Bash 3.2 của Mac: tab là login ⇒ đọc <code>~/.bash_profile</code>, không đọc <code>~/.bashrc</code>.'))}` },

  { t: 'cron chỉ cho 6 biến: PATH=/usr/bin:/bin, SHELL=/bin/sh', body: two(
    `${term(['$ crontab -l', '* * * * * env > /tmp/cron-env.txt; mytool > /tmp/cron-out.txt 2>&1; …', '$ cat /tmp/cron-env.txt', 'HOME=/home/an', 'LOGNAME=an', '! PATH=/usr/bin:/bin', 'LANG=C.UTF-8', '! SHELL=/bin/sh', 'PWD=/home/an', '$ cat /tmp/cron-out.txt', '! /bin/sh: 1: mytool: not found', 'exit=127', '$ mytool          # gõ tay', '= mytool chay ok'], { title: 'Ubuntu 24.04 — cron chạy thật, mytool ở /usr/local/bin', fs: 13.5 })}`,
    `${sh([
      ['# 1. Tốt nhất: script tự lo', ''],
      ['PATH=/usr/local/bin:/usr/bin:/bin', 'đầu script'],
      ['export PATH', ''],
      ['# 2. Khai trong crontab (mọi dòng dưới)', ''],
      ['PATH=/usr/local/bin:/usr/bin:/bin', ''],
      ['0 3 * * * /srv/app/backup.sh', 'đường TUYỆT ĐỐI'],
      ['# 3. Mô phỏng cron trước khi tin', ''],
      ['env -i HOME="$HOME" PATH=/usr/bin:/bin \\', ''],
      ['    /bin/sh -c /srv/app/backup.sh', ''],
    ], { fs: 14 })}
    ${box('warn', 'systemd cũng không đọc file shell nào: khai bằng <code>Environment=</code> / <code>EnvironmentFile=</code> (Chương 11).')}`, 'l') },

  /* ───────────── 8.3 ───────────── */
  { t: 'Chỉ biến đã export mới đi theo sang tiến trình con', body: `
    ${xuatBien()}
    ${two(
      term(['$ MAU=do; bash -c \'echo "con thay [$MAU]"\'', '! con thay []', '$ export MAU; bash -c \'echo "con thay [$MAU]"\'', '= con thay [do]'], { title: 'Ubuntu — output thật', fs: 13.5 }),
      term(['$ declare -p MAU', '+ declare -x MAU="do"', '$ export -n MAU; declare -p MAU', 'declare -- MAU="do"'], { title: 'Ubuntu — -x = đã export · export -n = thu hồi', fs: 13.5 }))}` },

  { t: 'Con không sửa được cha — môi trường đóng băng lúc exec', body: two(
    `${term(['$ export SO=1', '$ bash -c \'SO=2; export SO; echo "trong con: $SO"\'', 'trong con: 2', '$ echo "cha van: $SO"', '= cha van: 1', '$ ( SO=3 ); echo "$SO"', '= 1', '$ sleep 300 & P=$!', '$ export TOKEN_MOI=abc', '$ tr \'\\0\' \'\\n\' < /proc/$P/environ | grep -c TOKEN_MOI', '! 0'], { title: 'Ubuntu — output thật', fs: 14 })}`,
    `${cards([
      { ic: '⬇️', t: 'Chỉ chảy XUỐNG', d: 'cha → con, lúc <code>fork</code>+<code>exec</code>. Không có đường ngược lên.', c: 'blu' },
      { ic: '🧊', t: 'Đóng băng', d: 'sửa <code>.env</code>/<code>export</code> SAU khi tiến trình chạy: nó không bao giờ thấy. Khởi động lại nó.', c: 'amb' },
      { ic: '📜', t: 'Muốn đổi shell hiện tại?', d: '<code>source file</code> (chạy trong CHÍNH shell này), không phải <code>bash file</code>.', c: 'grn' },
    ], 1)}`, 'l') },

  { t: 'Đặt biến cho đúng MỘT lệnh: tiền tố và env', body: two(
    `${sh([
      ['NODE_ENV=production node server.js', 'chỉ lần chạy này'],
      ['LC_ALL=C sort data.txt', 'đổi locale một lệnh'],
      ['TZ=Asia/Ho_Chi_Minh date', 'đổi múi giờ một lệnh'],
      ['env NODE_ENV=production node app.js', 'như trên, tường minh'],
      ['env -u DEBUG node app.js', 'GỠ một biến'],
      ['env -i PATH=/usr/bin node app.js', 'môi trường RỖNG'],
      ['env | sort', 'toàn bộ môi trường'],
      ['printenv HOME', 'một biến; thiếu ⇒ exit 1'],
      ['export -p | head', 'dạng declare -x'],
      ['unset MAU', 'xoá hẳn biến'],
    ], { fs: 14.5 })}`,
    `${term(['$ env -u SO bash -c \'echo "SO=[${SO-unset}]"\'', 'SO=[unset]', '$ env -i bash -c \'echo "HOME=[$HOME] PATH=[$PATH]"\'', 'HOME=[] PATH=[/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin]', '$ env -i bash -c env', 'PWD=/home/an', 'SHLVL=0', '_=/usr/bin/env', '$ printenv KHONGCO; echo $?', '! 1'], { title: 'Ubuntu — env -i: bash tự đặt PATH mặc định nhưng KHÔNG export', fs: 13 })}
    ${table(['', 'Thấy biến gì'], [['<code>env</code> / <code>printenv</code>', 'chỉ biến MÔI TRƯỜNG (đã export)'], ['<code>set</code>', 'mọi biến + hàm của shell'], ['<code>declare -p X</code>', 'một biến kèm cờ <code>-x</code>']], { sm: true })}`) },

  { t: '.env không tự vào tiến trình nào — nạp nó cho đúng', body: two(
    `${term(['$ cat .env', 'DB_URL=postgres://app:mat khau@localhost/app', 'PORT=3000', '$ echo "[$DB_URL]"', '! []', '$ env $(grep -v \'^#\' .env | xargs) node app.js', "! env: 'khau@localhost/app': No such file or directory", '$ . ./.env', '! ./.env: line 1: khau@localhost/app: No such file or directory'], { title: 'Ubuntu — giá trị có DẤU CÁCH, không nháy', fs: 13.5 })}
    ${box('bad', 'Cách <code>xargs</code> cắt từ ở dấu cách; <code>source</code> thì CHẠY file như mã bash — dòng lạ trong .env là lệnh thật.')}`,
    `${sh([
      ['# .env: có nháy khi giá trị có dấu cách', ''],
      ['DB_URL="postgres://app:mat khau@localhost/app"', ''],
      ['set -a', 'mọi phép gán tự export'],
      ['. ./.env', 'shell tự phân tích'],
      ['set +a', 'tắt lại'],
      ['bash -c \'echo "[$DB_URL]"\'', 'con thấy đủ'],
    ], { fs: 14 })}
    ${term(['set -a: DB_URL=[postgres://app:mat khau@localhost/app] PORT=[3000]', '# không set -a: shell thấy PORT=3000, con thấy PORT=[]'], { title: 'Ubuntu — output thật', fs: 13 })}
    ${box('tip', 'Tốt hơn nữa: để ứng dụng tự đọc (<code>node --env-file=.env</code>, dotenv, Prisma, <code>docker compose</code>).')}`) },

  { t: 'Bí mật trong môi trường lộ ở 7 chỗ', body: two(
    table(['Chỗ lộ', 'Ai thấy', 'Chặn bằng'], [
      ['dòng lệnh <code>-pMẬTKHẨU</code>', '-MỌI người dùng qua <code>ps</code>', 'file cấu hình, <code>~/.pgpass</code>'],
      ['<code>/proc/PID/environ</code>', 'chủ tiến trình + root', 'đọc file 600 lúc khởi động'],
      ['tiến trình con', 'mọi thứ bạn chạy sau đó', '<code>env -u</code>, đừng export bừa'],
      ['<code>~/.bash_history</code>', 'ai đọc/sao lưu được file', '<code>HISTCONTROL=ignorespace</code>'],
      ['<code>export TOKEN=</code> trong <code>.bashrc</code> + commit', '-cả thế giới, vĩnh viễn', '<code>.gitignore</code>, xoay khoá NGAY'],
      ['<code>ENV</code>/<code>ARG</code> trong Dockerfile', 'ai kéo được image', 'truyền lúc chạy, secret mount'],
      ['<code>set -x</code> trong script', 'log, email của cron', '<code>set +x</code> quanh chỗ dùng'],
    ], { sm: true }),
    `${sh([
      ['install -m 600 /dev/null ~/.config/app.env', 'tạo file 600 ngay'],
      ['# dotfiles đưa lên git: bí mật để file RIÊNG', ''],
      ['[ -r ~/.secrets ] && . ~/.secrets', 'trong ~/.bashrc'],
      ["echo '.secrets' >> .gitignore", ''],
      ['git log -p | grep -n "sk-live"', 'đã lỡ commit?'],
    ], { fs: 14 })}
    ${box('warn', 'Lỡ commit một khoá: xoá khỏi lịch sử vẫn CHƯA đủ — bản clone/fork đã có nó. <b>Xoay khoá trước</b>, dọn lịch sử sau.')}`, 'l') },

  /* ───────────── 8.4 ───────────── */
  { t: 'Bí danh là phép thay chữ — cần tham số thì viết hàm', body: two(
    `${term(['$ cat a.sh', 'alias ll="ls -l"', 'll /etc/hostname', '$ bash a.sh', '! a.sh: line 2: ll: command not found', '$ alias mkcd="mkdir -p $1 && cd $1"', '$ mkcd newdir', '! mkdir: missing operand', "Try 'mkdir --help' for more information."], { title: 'Ubuntu — output thật', fs: 14 })}
    ${box('info', 'Bí danh TẮT trong shell không tương tác (bật bằng <code>shopt -s expand_aliases</code> — đừng). Và nó chỉ thay chữ ở ĐẦU lệnh: <code>$1</code> rỗng, <code>newdir</code> rơi xuống cuối.')}`,
    `${sh([
      ["alias ll='ls -alF'", 'viết tắt 2 chữ'],
      ["alias gs='git status -sb'", ''],
      ['\\ls · command ls', 'bỏ qua bí danh 1 lần'],
      ['unalias ll', 'gỡ'],
      ['mkcd() { mkdir -p -- "$1" && cd -- "$1"; }', 'hàm: có $1'],
      ['d() { docker "$@"; }', 'giữ mọi tham số'],
      ['gl() { git log --oneline -"${1:-20}"; }', 'mặc định 20'],
      ['type mkcd · declare -f mkcd', 'xem thân hàm'],
    ], { fs: 14 })}
    ${table(['Dùng', 'Khi'], [['bí danh', 'viết tắt, tham số tự nhiên ở cuối'], ['hàm', 'có <code>$1</code>, điều kiện, nhiều lệnh'], ['script trong <code>~/.local/bin</code>', 'dài, cần cho cron/người khác']], { sm: true })}`) },

  { t: 'PS1: đọc từng ký hiệu — mã màu phải bọc \\[ \\]', body: `
    ${annot("PS1='\\[\\e[32m\\]\\u@\\h\\[\\e[0m\\]:\\w\\$ '", [
      { from: 5, to: 15, t: '\\[ màu xanh \\]', d: 'không chiếm chỗ', c: 'grn' },
      { from: 15, to: 17, t: '\\u', d: 'tên người dùng', c: 'lx' },
      { from: 18, to: 20, t: '\\h', d: 'tên máy ngắn', c: 'blu' },
      { from: 20, to: 29, t: '\\[ tắt màu \\]', d: 'trả màu gốc', c: 'grn' },
      { from: 30, to: 32, t: '\\w', d: 'thư mục, có ~', c: 'vio' },
      { from: 32, to: 34, t: '\\$', d: '$ thường · # root', c: 'amb' },
    ], { fs: 30, rowH: 56 })}
    ${two(
      term(['bash-5.2$ PS1=\'${?#0}\\u@\\h:\\w\\$ \'', 'an@lab:~$ false', '! 1an@lab:~$ ls /khong', "ls: cannot access '/khong': No such file or directory", '! 2an@lab:~$ true', '= an@lab:~$'], { title: 'Ubuntu — ${?#0}: hiện mã thoát khi ≠ 0', fs: 14 }),
      box('warn', 'Thiếu <code>\\[ \\]</code> quanh mã màu: bash đếm sai độ dài dấu nhắc ⇒ dòng dài bẻ sai chỗ, <code>Ctrl-R</code> vẽ đè chữ. Trông như lỗi terminal, thật ra thiếu một cặp ngoặc. zsh viết khác: <code>%n@%m:%~%#</code>.'), 'l')}` },

  { t: 'Lịch sử: ghi NGAY mỗi lệnh, và giữ bí mật ra ngoài', body: two(
    `${sh([
      ['HISTSIZE=100000', 'dòng trong bộ nhớ'],
      ['HISTFILESIZE=200000', 'dòng trong file'],
      ['HISTCONTROL=ignoreboth:erasedups', 'bỏ trùng + dòng có dấu cách đầu'],
      ["HISTTIMEFORMAT='%F %T '", 'gắn giờ'],
      ['shopt -s histappend', 'NỐI THÊM, không ghi đè'],
      ["PROMPT_COMMAND='history -a'", 'ghi sau mỗi lệnh'],
    ], { fs: 14.5 })}
    ${term(['$ HISTFILE=/tmp/hist; HISTCONTROL=ignorespace', '$ echo lenh-thuong', '$  export TOKEN=sk-live-bimat     # dấu cách đầu', '$ echo $TOKEN', 'sk-live-bimat', '# … thoát shell, rồi:', '$ cat /tmp/hist', 'HISTFILE=/tmp/hist; HISTCONTROL=ignorespace', 'echo lenh-thuong', '= echo $TOKEN          # dòng export KHÔNG có mặt'], { title: 'Ubuntu — bash tương tác, output thật', fs: 13 })}`,
    `${table(['Máy', 'Mặc định', 'Dấu cách đầu'], [
      ['Ubuntu', '<code>HISTCONTROL=ignoreboth</code> (skel .bashrc)', '+không lưu'],
      ['Fedora 44', '<code>ignoredups</code> (/etc/profile)', '-LƯU'],
      ['macOS zsh', 'không bật gì', '-LƯU — thêm <code>setopt HIST_IGNORE_SPACE</code>'],
    ], { sm: true })}
    ${table(['Gõ', 'Làm gì'], [['<code>Ctrl-R</code>', 'tìm ngược trong lịch sử'], ['<code>!!</code> · <code>sudo !!</code>', 'lệnh vừa rồi'], ['<code>!$</code> · <code>Alt-.</code>', 'tham số cuối'], ['<code>history -d N</code>', 'xoá một dòng lỡ lưu'], ['<code>history -a</code> · <code>-n</code>', 'ghi ra · đọc vào từ file']], { sm: true })}
    ${box('info', 'Dấu cách chỉ giữ bí mật khỏi FILE lịch sử — giá trị vẫn nằm trong môi trường và <code>/proc</code>.')}`, 'l') },

  { t: 'Dotfile gọn gàng: mỗi thứ một chỗ', body: two(
    `${tree(`~/
.profile            # PATH, EDITOR, LANG — export
.bashrc             # chốt → alias, hàm, PS1, HIST*
.bashrc.d/
  10-alias.sh
  20-prompt.sh
  30-may-nay.sh     # riêng máy này
.inputrc            # phím: bash, psql, python…
.secrets            # chmod 600, trong .gitignore
.zprofile           # macOS: PATH
.zshrc              # macOS: alias, prompt, setopt`)}`,
    `${sh([
      ['for f in ~/.bashrc.d/*.sh; do', 'nạp từng mảnh'],
      ['  [[ -r $f ]] && . "$f"', ''],
      ['done; unset f', ''],
      ['# ~/.inputrc', ''],
      ['"\\e[A": history-search-backward', 'phím Lên lọc theo'],
      ['"\\e[B": history-search-forward', 'chữ đã gõ'],
      ['set completion-ignore-case on', ''],
      ['shopt -s globstar checkwinsize', 'bật tuỳ chọn'],
      ['shopt -p globstar', 'xem trạng thái'],
    ], { fs: 14 })}
    ${box('tip', 'Sửa xong: <code>source ~/.bashrc</code> (chồng thêm) hoặc <code>exec bash -l</code> (sạch từ đầu). Fedora có sẵn vòng <code>~/.bashrc.d</code> trong skel.')}`) },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 8', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Chạy tay được, cron báo <code>not found</code>', 'cron: <code>PATH=/usr/bin:/bin</code>, không đọc rc', 'đường tuyệt đối / PATH đầu script'],
    ['<code>ssh vps \'node -v\'</code> báo 127', '<code>.bashrc</code> dừng ở cái chốt, nvm ở cuối', 'đường tuyệt đối / PATH trong <code>.profile</code>'],
    ['<code>sudo node</code>: command not found', '<code>secure_path</code> — cả <code>sudo -E</code>', '<code>sudo "$(command -v node)"</code>'],
    ['Dời file xong: <code>No such file</code> với đường CŨ', 'bảng băm còn nhớ', '<code>hash -r</code>'],
    ['Sửa <code>~/.profile</code> mà SSH không nhận', 'có <code>~/.bash_profile</code> ⇒ nó thắng', '<code>.bash_profile</code> gọi <code>.profile</code>'],
    ['<code>scp</code>/<code>rsync</code> lỗi giao thức', 'rc in chữ TRÊN cái chốt', 'dời xuống dưới / ra stderr'],
    ['Con không thấy biến vừa đặt', 'chưa <code>export</code>', '<code>export X</code> / <code>set -a</code>'],
    ['Sửa <code>.env</code>, app vẫn giá trị cũ', 'môi trường đóng băng lúc khởi động', 'khởi động lại tiến trình'],
    ['Token lộ trên GitHub', '<code>export TOKEN=</code> trong <code>.bashrc</code> đã commit', 'xoay khoá, <code>~/.secrets</code> 600'],
  ], { sm: true }) },

  { t: 'Ubuntu · Fedora · macOS: file khởi động khác nhau', body: table(['Việc', 'Ubuntu 24.04', 'Fedora 44', 'macOS'], [
    ['Shell mặc định', 'bash 5.2', 'bash 5.3', '!zsh 5.9 (bash 3.2 ở /bin/bash)'],
    ['Tab terminal mới (desktop)', 'không login ⇒ <code>~/.bashrc</code>', 'không login ⇒ <code>~/.bashrc</code>', '!LOGIN ⇒ <code>.zprofile</code> + <code>.zshrc</code>'],
    ['File login riêng', '<code>~/.profile</code> (gọi .bashrc)', '<code>~/.bash_profile</code> (gọi .bashrc)', '<code>~/.zprofile</code>'],
    ['PATH riêng (~/.local/bin)', 'thêm trong <code>~/.profile</code>', 'thêm trong <code>~/.bashrc</code>', 'tự thêm; Homebrew: <code>/opt/homebrew/bin</code>'],
    ['PATH hệ thống', '<code>/etc/environment</code>', '<code>/etc/profile</code>', '<code>/etc/paths</code> + <code>paths.d</code> (path_helper)'],
    ['Cái chốt tương tác trong rc', 'có (<code>case $-</code>)', '-không có trong skel', 'zsh: .zshrc chỉ đọc khi tương tác'],
    ['Dấu cách đầu giữ khỏi history', '+có (ignoreboth)', '-không (ignoredups)', '-không (cần setopt)'],
    ['Lập lịch', 'cron / systemd timer', 'cron (cronie) / systemd timer', 'launchd (Chương 15)'],
  ], { sm: true }) + box('info', '<b>WSL2</b> = nhân Linux thật + Ubuntu thật ⇒ theo cột Ubuntu. Không chắc cửa sổ nào là login? Hỏi thẳng: <code>shopt -q login_shell &amp;&amp; echo login</code>.') },

  { t: 'Bảng tra nhanh Chương 8 (1/2): PATH &amp; file khởi động', body: two(
    sh([
      ['echo "$PATH" | tr : \'\\n\'', 'đọc PATH'],
      ['type -a node · type -t ls', 'mọi bản · loại'],
      ['command -v node', 'cho script'],
      ['hash · hash -r · hash -d x', 'bảng băm'],
      ['export PATH="$HOME/.local/bin:$PATH"', 'thêm đầu'],
      ['export PATH="$PATH:/opt/x/bin"', 'thêm cuối'],
      ['sudo "$(command -v node)"', 'qua secure_path'],
      ['cat /etc/environment', 'PATH hệ thống'],
      ['/usr/libexec/path_helper -s', 'macOS'],
    ], { fs: 16.5 }),
    sh([
      ['shopt -q login_shell && echo login', 'login?'],
      ['[[ $- == *i* ]] && echo tt', 'tương tác?'],
      ['bash -l -c · bash -i -c · bash -c', 'ba loại'],
      ['bash -lx -c true 2>&1 | grep profile', 'lần theo'],
      ['source ~/.bashrc · exec bash -l', 'nạp lại'],
      ['BASH_ENV=f bash -c ...', 'rc cho script'],
      ['HOME=/tmp/h bash -l -c true', 'thử file khác'],
      ['ZDOTDIR=/tmp/z zsh -i -c true', 'thử zsh'],
      ['env -i PATH=/usr/bin:/bin sh -c ...', 'giả cron'],
    ], { fs: 16.5 })) },

  { t: 'Bảng tra nhanh Chương 8 (2/2): biến, bí mật, tuỳ biến', body: two(
    sh([
      ['export X=1 · export -n X · unset X', 'cấp · thu · xoá'],
      ['declare -p X · export -p', 'cờ -x?'],
      ['env | sort · printenv X', 'môi trường'],
      ['X=1 cmd · env -u X cmd · env -i cmd', 'một lệnh'],
      ['set -a; . ./.env; set +a', 'nạp .env'],
      ["tr '\\0' '\\n' < /proc/PID/environ", 'tiến trình có gì'],
      ['docker exec app env | sort', 'container có gì'],
      ['systemctl show app -p Environment', 'unit có gì'],
      ['install -m 600 /dev/null f.env', 'file bí mật'],
    ], { fs: 16.5 }),
    sh([
      ["alias ll='ls -alF' · unalias ll", 'bí danh'],
      ['f() { cmd "$@"; } · declare -f f', 'hàm'],
      ["PS1='\\u@\\h:\\w\\$ '", 'dấu nhắc'],
      ['HISTCONTROL=ignoreboth', 'lờ dấu cách đầu'],
      ["shopt -s histappend", 'nối thêm'],
      ["PROMPT_COMMAND='history -a'", 'ghi ngay'],
      ['history -d N · Ctrl-R · !!', 'sửa · tìm · lặp'],
      ['shopt -s globstar · shopt -p', 'tuỳ chọn'],
      ['bind -P | head', 'phím readline'],
    ], { fs: 16.5 })) },

  { t: 'Thực hành Chương 8 (40 phút): “chạy tay được, cron thì hỏng”', body: `
    ${steps([
      ['Container <code>ubuntu:24.04</code> + <code>cron sudo</code>; tạo người dùng <code>an</code>, một <code>mytool</code> ở <code>/usr/local/bin</code>', 'gõ tay thấy chạy'],
      ['Đặt dấu mốc vào <code>/etc/profile</code>, <code>~/.profile</code>, <code>~/.bashrc</code> (đầu + cuối); đo <code>bash -l -c</code>, <code>-i -c</code>, <code>-c</code>', 'vẽ lại sơ đồ bằng tay, khớp output'],
      ['crontab <code>* * * * * env &gt; /tmp/e; mytool &gt; /tmp/o 2&gt;&amp;1</code>', 'đọc được vì sao 127'],
      ['Sửa bằng PATH đầu script + đường tuyệt đối; kiểm lại bằng <code>env -i … sh -c</code> TRƯỚC khi đợi cron', 'cron in <code>mytool chay ok</code>'],
      ['<code>.env</code> có dấu cách → nạp bằng <code>set -a</code>; con thấy, tiến trình chạy TRƯỚC thì không', 'giải thích bằng “đóng băng”'],
    ])}
    ${box('good', '<b>Đạt khi:</b> nói được mỗi dòng dấu mốc đến từ đâu, cron chạy xanh, và giải thích được vì sao <code>sudo -E</code> không cứu PATH.')}` },
]);
