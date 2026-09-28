/**
 * Linux & Bash · Deck lx-01 — Chương 1: Shell & hệ thống file.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu"  = container ubuntu:24.04 (24.04.5, bash 5.2.21, coreutils 9.4, less 590, arm64) trên Mac M1,
 *                 người dùng `an`, máy tên `lab`, đã cài lại man-db/manpages (ảnh Docker bị "minimize" bỏ trang man)
 *   • "Fedora"  = máy linux-nha (Fedora 44, bash 5.3.9, / là btrfs, /tmp là tmpfs)
 *   • "Mac"     = Mac M1, macOS 27, zsh 5.9, /bin/bash 3.2.57, công cụ BSD
 * Trên VPS x86-64, `file /usr/bin/ls` in "x86-64" thay cho "ARM aarch64" — còn lại giống hệt.
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): annot() — một dòng chữ đơn cách có ngoặc chú thích từng
 * đoạn (dấu nhắc, câu lệnh, một dòng ls -l); cayDuongDan() — cây thư mục có mũi tên đường đi;
 * motCay() — Windows nhiều cây vs Linux một cây; inodeSvg() — tên → inode → khối dữ liệu.
 */
import { S, cover, sh, perms, term, mindmap, diagram, cards, box, steps, table, vs, kpis, two, list, tree, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-01', code: 'LINUX · CHƯƠNG 1', title: 'Shell & hệ thống file', sub: 'Linux & Bash · Chương 1' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;

/**
 * annot(str, segs, {fs, w, top}) — vẽ `str` bằng chữ đơn cách cỡ fs, dưới mỗi đoạn [from, to) một ngoặc màu
 * và nhãn (2 dòng). Nhãn tự xếp sang hàng dưới nếu đụng nhãn trước.
 */
const annot = (str, segs, { fs = 40, w = 1150, lw = 170, rowH = 64, y0 = 56, h, num = false } = {}) => {
  const cw = fs * 0.602;
  const x0 = Math.round((w - str.length * cw) / 2);
  let s = '';
  // nền dòng chữ
  s += R(x0 - 22, y0 - fs - 6, str.length * cw + 44, fs + 28, { c: 'bd', fill: '#050806', r: 12, sw: 2 });
  // tô màu từng đoạn
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
  // ngoặc + nhãn
  const rowsEnd = [];
  const by = y0 + 22;
  if (num) {
    segs.forEach((g, k) => {
      const a = x0 + g.from * cw + 2, b = x0 + g.to * cw - 2, mid = (a + b) / 2, col = c(g.c);
      s += `<path d="M${a} ${by} L${a} ${by + 8} L${b} ${by + 8} L${b} ${by}" stroke="${col}" stroke-width="3" fill="none"/>`;
      s += `<circle cx="${mid}" cy="${by + 30}" r="15" fill="${col}"/>` + T(mid, by + 36, String(k + 1), { fs: 17, a: 'middle', b: true, c: '#0a0f0c' });
    });
    return sv(w, h || by + 52, s);
  }
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
  const H = h || by + 36 + rowsEnd.length * rowH + 4;
  return sv(w, H, s);
};

/* Slide 5 — cây ~/projects/api với các bước cd */
const cayCd = () => {
  const N = (x, y, t, col = 'blu', hl = false) => R(x, y, 170, 44, { c: col, fill: hl ? 'rgba(245,183,0,.14)' : '#111812', r: 9 }) + T(x + 85, y + 29, t, { fs: 17, a: 'middle', mono: true, b: hl });
  const L = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x1} ${y2 - 22} L${x2} ${y2 - 22} L${x2} ${y2}" stroke="${D.dim}" stroke-width="2" fill="none"/>`;
  let s = '';
  s += N(20, 10, '/home/an', 'tea');
  s += L(105, 54, 305, 96) + N(220, 96, 'projects/', 'blu');
  s += L(305, 140, 305, 182) + N(220, 182, 'api/', 'lx', true);
  s += L(305, 226, 165, 280) + L(305, 226, 445, 280);
  s += N(80, 280, 'src/', 'blu') + N(360, 280, 'tests/', 'blu');
  s += T(305, 176, 'bạn đang đứng đây', { fs: 13.5, c: 'lx', a: 'middle' });
  // mũi tên thao tác
  s += A(220, 204, 70, 56, { c: 'grn' }) + T(60, 150, 'cd ~', { fs: 16, c: 'grn', mono: true, b: true });
  s += A(475, 204, 475, 290, { c: 'amb' }) + T(485, 250, 'cd tests', { fs: 16, c: 'amb', mono: true, b: true });
  s += `<path d="M250 302 C 250 360, 400 360, 420 326" stroke="${D.vio}" stroke-width="3" fill="none" marker-end="url(#m-vio)"/>` + T(330, 372, 'cd ../tests', { fs: 16, c: 'vio', mono: true, b: true, a: 'middle' });
  s += A(390, 182, 390, 142, { c: 'pnk' }) + T(398, 168, 'cd ..', { fs: 16, c: 'pnk', mono: true, b: true });
  return sv(560, 390, s);
};

/* Slide 10 — Windows nhiều cây, Linux một cây */
const motCay = () => {
  let s = '';
  const box2 = (x, y, w, t, col, sub) => R(x, y, w, 40, { c: col, r: 9 }) + T(x + w / 2, y + 26, t, { fs: 16.5, a: 'middle', mono: true, b: true }) + (sub ? T(x + w / 2, y + 58, sub, { fs: 13.5, a: 'middle', c: 'mu' }) : '');
  // Windows
  s += T(20, 26, 'Windows: mỗi ổ một cây', { fs: 19, b: true, c: 'blu' });
  s += box2(20, 50, 110, 'C:\\', 'blu') + box2(170, 50, 110, 'D:\\', 'blu') + box2(320, 50, 110, 'E:\\', 'dim', 'USB');
  s += A(60, 90, 55, 150, { c: 'dim', sw: 2 }) + box2(10, 150, 90, 'Users', 'dim');
  s += A(95, 90, 155, 150, { c: 'dim', sw: 2 }) + box2(110, 150, 100, 'Windows', 'dim');
  s += A(265, 90, 285, 150, { c: 'dim', sw: 2 }) + box2(235, 150, 100, 'Games', 'dim');
  s += `<line x1="470" y1="10" x2="470" y2="380" stroke="${D.bd}" stroke-width="2"/>`;
  // Linux
  s += T(500, 26, 'Linux: MỘT cây, gốc là /', { fs: 19, b: true, c: 'lx' });
  s += box2(760, 50, 80, '/', 'lx');
  const kids = [['home/', 540, 'tea'], ['etc/', 650, 'dim'], ['var/', 745, 'dim'], ['mnt/', 840, 'grn'], ['media/', 950, 'grn'], ['proc/', 1060, 'dim']];
  kids.forEach(([n, x, col]) => { s += A(800, 90, x + 45, 150, { c: col === 'dim' ? 'dim' : col, sw: 2 }) + box2(x, 150, 90, n, col); });
  s += A(885, 190, 885, 250, { c: 'grn', sw: 2 }) + box2(830, 250, 110, 'usb/', 'grn', 'đĩa thứ 2 = 1 thư mục');
  s += A(995, 190, 1040, 250, { c: 'grn', sw: 2 }) + box2(985, 250, 150, 'an/USB-32G/', 'grn', 'desktop tự gắn');
  s += A(585, 190, 585, 250, { c: 'tea', sw: 2 }) + box2(530, 250, 110, 'an/', 'tea');
  s += T(500, 350, 'WSL: ổ C: của Windows hiện ra ở /mnt/c', { fs: 15.5, c: 'blu' });
  s += T(500, 374, 'macOS: USB hiện ra ở /Volumes/<tên>', { fs: 15.5, c: 'vio' });
  return sv(1150, 385, s);
};

/* Slide 11 — tuyệt đối vs tương đối trên cùng một cây */
const cayDuongDan = () => {
  let s = '';
  const N = (x, y, t, col, w = 130) => R(x, y, w, 40, { c: col, r: 9 }) + T(x + w / 2, y + 26, t, { fs: 16, a: 'middle', mono: true, b: true });
  s += N(30, 10, '/', 'lx', 70);
  s += N(160, 70, 'home/', 'lx') + N(160, 170, 'var/', 'dim');
  s += N(330, 70, 'an/', 'lx');
  s += N(500, 70, 'projects/', 'lx', 150);
  s += N(700, 70, 'api/', 'grn');
  s += N(880, 100, 'src/', 'grn') + N(880, 170, 'tests/', 'dim');
  s += N(1030, 100, 'app.ts', 'grn', 110);
  s += T(765, 132, 'pwd = đây', { fs: 14, a: 'middle', c: 'grn', b: true });
  // tuyệt đối (vàng) từ gốc
  s += A(100, 30, 160, 86, { c: 'lx' }) + A(290, 90, 330, 90, { c: 'lx' }) + A(460, 90, 500, 90, { c: 'lx' }) + A(650, 90, 700, 90, { c: 'lx' }) + A(830, 100, 878, 116, { c: 'lx' }) + A(1010, 120, 1030, 120, { c: 'lx' });
  s += A(100, 40, 160, 186, { c: 'dim', sw: 2 }) + A(800, 110, 880, 186, { c: 'dim', sw: 2 });
  // tương đối (xanh) — cung phía trên, bắt đầu từ api
  s += `<path d="M800 70 C 830 10, 930 10, 950 96" stroke="${D.grn}" stroke-width="3" fill="none" stroke-dasharray="7 5" marker-end="url(#m-grn)"/>` + T(960, 36, 'tương đối bắt đầu ở pwd', { fs: 14.5, c: 'grn', b: true });
  s += R(20, 222, 1120, 48, { c: 'lx', fill: 'rgba(245,183,0,.08)', r: 10 }) + T(40, 253, 'TUYỆT ĐỐI', { fs: 16, b: true, c: 'lx' }) + T(160, 253, '/home/an/projects/api/src/app.ts', { fs: 19, mono: true, b: true }) + T(1125, 253, 'đứng đâu cũng đúng', { fs: 15, c: 'mu', a: 'end' });
  s += R(20, 278, 1120, 48, { c: 'grn', fill: 'rgba(63,185,80,.08)', r: 10 }) + T(40, 309, 'TƯƠNG ĐỐI', { fs: 16, b: true, c: 'grn' }) + T(160, 309, 'src/app.ts', { fs: 19, mono: true, b: true }) + T(1125, 309, 'chỉ đúng khi pwd = /home/an/projects/api', { fs: 15, c: 'mu', a: 'end' });
  return sv(1150, 330, s);
};

/* Slide 26 — tên → inode → dữ liệu, và tiến trình giữ file */
const inodeSvg = () => {
  let s = '';
  s += T(10, 22, 'THƯ MỤC /srv/log', { fs: 15, c: 'mu', b: true });
  s += R(10, 34, 250, 46, { c: 'red', dash: true, r: 9 }) + T(135, 63, 'access.log  ✗ đã rm', { fs: 16, a: 'middle', mono: true, c: 'red' });
  s += R(10, 150, 250, 64, { c: 'amb', r: 9 }) + T(135, 176, 'sleep (PID 4087)', { fs: 16, a: 'middle', mono: true, b: true }) + T(135, 200, 'fd 3 vẫn mở file', { fs: 14, a: 'middle', c: 'mu' });
  s += R(390, 70, 240, 110, { c: 'lx', r: 12 }) + T(510, 104, 'inode 61724', { fs: 19, a: 'middle', mono: true, b: true }) + T(510, 132, 'số tên (NLINK) = 0', { fs: 15, a: 'middle', c: 'red' }) + T(510, 156, 'số người mở = 1', { fs: 15, a: 'middle', c: 'amb' });
  s += `<path d="M260 57 L390 100" stroke="${D.red}" stroke-width="2.5" stroke-dasharray="6 6"/>` + T(318, 70, 'đứt', { fs: 13.5, c: 'red' });
  s += A(260, 182, 388, 150, { c: 'amb' });
  s += R(760, 60, 380, 130, { c: 'vio', r: 12, fill: 'rgba(188,140,255,.08)' });
  for (let i = 0; i < 12; i++) s += `<rect x="${780 + (i % 6) * 58}" y="${80 + Math.floor(i / 6) * 48}" width="48" height="38" rx="5" fill="${D.vio}" opacity=".55"/>`;
  s += T(950, 212, '500 MB khối dữ liệu — CHƯA được trả', { fs: 15, a: 'middle', c: 'vio' });
  s += A(630, 125, 758, 125, { c: 'vio' });
  return sv(1150, 222, s);
};

export const slides = S([
  cover({ t: 'Chương 1 — Shell &amp; hệ thống file', sub: 'Dấu nhắc &amp; ba lệnh đầu · tự tra cứu man/less · đường dẫn · cây thư mục FHS · nhìn kỹ một file', chap: 'CHƯƠNG 1' }),

  { t: 'Bản đồ chương: nền móng cho mọi lệnh về sau', body: mindmap('Shell &amp; file', 'một cây, một chỗ đứng, một cách đọc', [
    { t: '1.1 Dấu nhắc &amp; 3 lệnh', d: 'pwd · ls · cd · hình dạng câu lệnh · Tab · history', c: 'lx' },
    { t: '1.1 Tự tra cứu', d: 'type · help · man (mục 1/5/8) · less · apropos · --help', c: 'amb' },
    { t: '1.2 Đường dẫn', d: 'tuyệt đối vs tương đối · . .. ~ - · ./script · bọc nháy', c: 'grn' },
    { t: '1.3 Cây FHS', d: '/etc · /var · /home · /usr/local/bin · /proc ảo · /tmp', c: 'tea' },
    { t: '1.4 ls -l · stat · file', d: '7 cột · 3 dấu thời gian · nội dung thắng đuôi tên', c: 'blu' },
    { t: '1.4 inode', d: 'xoá mà đĩa không trống: lsof +L1', c: 'vio' },
  ]) },

  /* ───────────── 1.1 ───────────── */
  { t: 'Dấu nhắc là thanh trạng thái: đọc 4 mẩu trước khi gõ', body: `
    ${annot('an@lab:~/projects/api$ ', [
      { from: 0, to: 2, t: 'an', d: 'bạn là ai (Chương 4)', c: 'tea' },
      { from: 3, to: 6, t: 'lab', d: 'máy nào — qua SSH là sống còn', c: 'blu' },
      { from: 7, to: 21, t: '~/projects/api', d: 'đang đứng ở đâu (pwd)', c: 'grn', lw: 230 },
      { from: 21, to: 22, t: '$', d: 'người thường · # = root', c: 'lx', lw: 200 },
    ], { fs: 42 })}
    ${two(
      box('bad', '<code>root@vps-1:/var/log#</code> — dấu <b>#</b> nghĩa là KHÔNG còn phép kiểm quyền nào: <code>rm -rf</code> gõ nhầm sẽ THÀNH CÔNG. Thấy <b>#</b> thì đọc lại lệnh trước khi Enter.'),
      term(['$ echo "$PS1"', '${debian_chroot:+($debian_chroot)}\\u@\\h:\\w\\$', '# \\u = user · \\h = host · \\w = thư mục · \\$ = $ hoặc #'], { title: 'Ubuntu 24.04 — dấu nhắc được ghép từ biến PS1 (Chương 8)' }), 'r')}` },

  { t: 'Mọi câu lệnh cùng một hình dạng — và dấu cách là dao chẻ', body: `
    ${annot('ls -l --sort=size /var/log', [
      { from: 0, to: 2, t: 'lệnh', d: 'chương trình được chạy', c: 'lx', lw: 190 },
      { from: 3, to: 5, t: 'cờ ngắn', d: '1 gạch · ghép được -lah', c: 'blu', lw: 200 },
      { from: 6, to: 17, t: 'cờ dài', d: '2 gạch · thường có =giá trị', c: 'vio', lw: 240 },
      { from: 18, to: 26, t: 'tham số', d: 'tác động lên cái gì', c: 'grn', lw: 200 },
    ], { fs: 40 })}
    ${two(
      table(['Bạn gõ', 'Shell chẻ thành', 'Kết quả'], [
        ['<code>ls-l</code>', '1 từ: <code>ls-l</code>', '-lệnh không tồn tại (127)'],
        ['<code>ls My Documents</code>', '3 từ: <code>ls</code> · <code>My</code> · <code>Documents</code>', '-tìm HAI thư mục'],
        ['<code>ls "My Documents"</code>', '2 từ: <code>ls</code> · <code>My Documents</code>', '+đúng một thư mục'],
        ['<code>ls -l -a -h</code> = <code>ls -lah</code>', 'cờ ngắn gộp được', '+như nhau'],
      ], { sm: true }),
      box('tip', 'Shell chẻ dòng theo khoảng trắng <b>TRƯỚC</b> khi chương trình thấy gì. Tên có dấu cách ⇒ luôn bọc nháy kép.'), 'l2')}` },

  { t: 'pwd hỏi “tôi ở đâu”, cd di chuyển — và cd - quay lại chỗ cũ', body: two(
    cayCd(),
    `${term(['$ cd ~/projects/api/src', '$ cd ../tests && pwd', '/home/an/projects/api/tests', '$ cd -', '+ /home/an/projects/api/src', '$ cd', '$ pwd', '/home/an', '# cd không in gì — chỉ cd - in thư mục vừa về'], { title: 'Ubuntu 24.04 — output thật', dir: '' })}
    ${table(['Gõ', 'Đi tới'], [['<code>cd</code> / <code>cd ~</code>', 'nhà: /home/an'], ['<code>cd ..</code>', 'lên 1 cấp'], ['<code>cd -</code>', 'thư mục TRƯỚC ĐÓ (như Alt-Tab)'], ['<code>cd /var/log</code>', 'tuyệt đối: đứng đâu cũng tới']], { sm: true })}`, 'r') },

  { t: 'ls giấu file dấu chấm — thư mục “trống” vẫn có thể chứa .env', body: two(
    term(['$ ls', 'README.md  package.json  src  tests', '$ ls -A', '+ .env  .git  README.md  package.json  src  tests', '$ ls -lah', 'total 32K', 'drwxrwxr-x 5 an an 4.0K Sep 28 08:40 .', 'drwxrwxr-x 3 an an 4.0K Sep 28 08:40 ..', '-rw-rw-r-- 1 an an    9 Sep 28 08:40 .env', 'drwxrwxr-x 2 an an 4.0K Sep 28 08:40 .git', '-rw-rw-r-- 1 an an    3 Sep 28 08:40 README.md', '…'], { title: 'Ubuntu 24.04 — ~/projects/api', dir: '~/projects/api' }),
    `${table(['Cờ', 'Nghĩa', 'Ví dụ'], [
      ['<code>-l</code>', 'dạng dài: loại, quyền, chủ, cỡ, giờ', '<code>ls -l</code>'],
      ['<code>-a</code> / <code>-A</code>', 'cả file ẩn / như -a nhưng bỏ <code>.</code> <code>..</code>', '<code>ls -A</code>'],
      ['<code>-h</code>', 'cỡ dễ đọc 4.0K, 2.1M (đi với -l)', '<code>ls -lh</code>'],
      ['<code>-t</code> · <code>-r</code>', 'mới nhất trước · đảo chiều', '<code>ls -ltr</code>'],
      ['<code>-d</code>', 'nói về CHÍNH thư mục, không vào trong', '<code>ls -ld /tmp</code>'],
    ], { sm: true })}
    ${sh([['cd pro<Tab>', 'tự thành projects/'], ['history | tail -5', '5 lệnh vừa chạy'], ['sudo !!', 'chạy lại lệnh trước kèm sudo'], ['!543', 'lệnh số 543 trong lịch sử']], { fs: 15, so: false })}`, 'r') },

  { t: 'Trước khi tra cứu, hỏi type: lệnh này là LOẠI gì?', body: two(
    term(['$ type -a ls', 'ls is aliased to `ls --color=auto\'', 'ls is /usr/bin/ls', 'ls is /bin/ls', '$ type cd', '+ cd is a shell builtin', '$ man cd', '! No manual entry for cd', '$ help cd | head -2', 'cd: cd [-L|[-P [-e]] [-@]] [dir]', '    Change the shell working directory.'], { title: 'Ubuntu 24.04 — bash tương tác, output thật' }),
    `${table(['type báo', 'Là gì', 'Tra bằng'], [
      ['<code>alias</code>', 'tên tắt do shell định nghĩa', '<code>alias ls</code>'],
      ['!<code>shell builtin</code>', 'nằm TRONG bash (cd, pwd, echo, type)', '<code>help cd</code>'],
      ['<code>/usr/bin/ls</code>', 'một chương trình (file) thật', '<code>man ls</code> · <code>ls --help</code>'],
      ['<code>function</code>', 'hàm shell (Chương 6)', '<code>type tên</code> in cả thân hàm'],
    ], { sm: true })}
    ${box('info', '<code>cd</code> không thể là chương trình riêng: một tiến trình con không đổi được thư mục của shell cha. Vì vậy nó là builtin — và <code>man cd</code> không có trang. Chương 8 đào sâu <code>type</code> / <code>command -v</code> / <code>which</code>.')}`, 'l') },

  { t: 'man chia mục: passwd(1) là lệnh, passwd(5) là định dạng file', body: two(
    `${table(['Mục', 'Chứa gì', 'Ví dụ bạn sẽ đọc'], [
      ['!1', 'lệnh người dùng', '<code>man ls</code> · <code>man 1 passwd</code>'],
      ['2 · 3', 'lời gọi hệ thống · thư viện C', '<code>man 2 open</code>'],
      ['4', 'file thiết bị trong /dev', '<code>man 4 null</code>'],
      ['!5', 'định dạng file cấu hình', '<code>man 5 passwd</code> · <code>man 5 crontab</code>'],
      ['7', 'tổng quan, quy ước', '<code>man 7 hier</code> · <code>man 7 man-pages</code>'],
      ['!8', 'lệnh quản trị (thường cần root)', '<code>man 8 mount</code> · <code>man 8 sshd</code>'],
    ], { sm: true })}`,
    `${term(['$ man -f passwd            # = whatis passwd', 'passwd (1)           - change user password', 'passwd (1ssl)        - OpenSSL application commands', '+ passwd (5)           - the password file', '$ man 5 passwd | head -3', 'PASSWD(5)   File Formats and Configuration   PASSWD(5)', 'NAME', '       passwd - the password file'], { title: 'Ubuntu 24.04' })}
    ${box('tip', 'Gõ <code>man passwd</code> trơn ⇒ ra trang ĐẦU TIÊN theo thứ tự tra (mục 1 đứng trước 5). Muốn file <code>/etc/passwd</code> ⇒ phải ghi số mục. Trong tài liệu, <code>crontab(5)</code> nghĩa là “trang crontab, mục 5”.')}`, 'r') },

  { t: 'man mở trong less: / tìm, n tới, q thoát — và cách đọc SYNOPSIS', body: two(
    `${table(['Phím trong less', 'Làm gì'], [
      ['<code>Space</code> / <code>b</code>', 'xuống / lên một trang'],
      ['<code>/chuỗi</code> rồi <code>Enter</code>', 'tìm xuôi (<code>?chuỗi</code> tìm ngược)'],
      ['<code>n</code> · <code>N</code>', 'kết quả kế tiếp · kết quả trước'],
      ['<code>g</code> · <code>G</code>', 'về đầu · xuống cuối file'],
      ['<code>&amp;chuỗi</code>', 'chỉ hiện dòng khớp (lọc)'],
      ['<code>F</code>', 'theo dõi như <code>tail -f</code> (Ctrl-C để dừng)'],
      ['<code>h</code> · <code>q</code>', 'trợ giúp · THOÁT'],
    ], { sm: true })}`,
    `${annot('ls [OPTION]... [FILE]...', [
      { from: 3, to: 11, t: '[ ] = tuỳ chọn', d: 'có thể bỏ', c: 'blu', lw: 170 },
      { from: 11, to: 14, t: '... = lặp', d: 'nhiều cái cũng được', c: 'vio', lw: 170 },
      { from: 15, to: 21, t: 'CHỮ HOA', d: 'thay bằng thứ của bạn', c: 'grn', lw: 190 },
    ], { fs: 26, w: 560 })}
    ${sh([['man -k compress', '= apropos: tìm theo mô tả'], ['man ls | less +/--sort', 'mở và nhảy tới --sort'], ['less -N -S app.log', 'số dòng · không bẻ dòng'], ['less +F app.log', 'theo dõi log đang ghi']], { fs: 14.5, so: false })}
    ${box('info', 'Tìm trong man: <code>/^ *-r</code> nhảy thẳng tới dòng định nghĩa cờ <code>-r</code> (dấu <code>^</code> = đầu dòng).')}`) },

  { t: 'Không nhớ tên lệnh? apropos. Nhớ tên, quên cờ? --help | grep', body: two(
    term(['$ apropos -s 1 compress | wc -l', '51', '$ apropos -s 1 compress | grep -E "^(gzip|xz|zstd) "', '+ gzip (1)   - compress or expand files', '+ xz (1)     - Compress or decompress .xz and .lzma files', '+ zstd (1)   - zstd, zstdmt, unzstd, zstdcat - Compress…', '$ ls --help | grep -i "by file size"', '  -S                 sort by file size, largest first', '$ help -d cd pwd', 'cd - Change the shell working directory.', 'pwd - Print the name of the current working directory.'], { title: 'Ubuntu 24.04 — output thật (cắt bớt)' }),
    steps([
      ['Không biết tên lệnh', '<code>apropos &lt;từ khoá&gt;</code> — tìm trong dòng mô tả của mọi trang man'],
      ['Biết tên, cần nhanh', '<code>lệnh --help</code> (+ <code>| grep -i từ</code>) — 1 giây, đủ 80% lần'],
      ['Cần hiểu kỹ / ví dụ', '<code>man lệnh</code> → <code>/EXAMPLES</code> · bản web: man7.org'],
      ['Là builtin của bash', '<code>help lệnh</code> (man không có)'],
      ['Muốn ví dụ ngắn gọn', '<code>tldr lệnh</code> hoặc trang tldr.sh (cộng đồng viết)'],
    ]), 'l') },

  /* ───────────── 1.2 ───────────── */
  { t: 'Linux có MỘT cây, gốc là / — ổ đĩa thứ hai chỉ là một thư mục', body: `
    ${motCay()}
    ${box('info', 'Gắn (mount) = treo một đĩa vào một thư mục của cây. Ra khỏi thư mục đó là ra khỏi đĩa đó — Chương 10 dạy <code>mount</code>/<code>df</code>.')}` },

  { t: 'Tuyệt đối đi từ gốc, tương đối đi từ chỗ bạn đang đứng', body: `
    ${cayDuongDan()}
    ${two(
      term(['$ cd /tmp', '$ cat src/app.ts', '! cat: src/app.ts: No such file or directory', '$ cat /home/an/projects/api/src/app.ts', '= x'], { title: 'Ubuntu — đổi chỗ đứng, chỉ bản tuyệt đối còn đúng', dir: '/tmp' }),
      box('warn', 'Script chạy tay được mà chạy bằng <b>cron / systemd</b> hỏng ⇒ chúng khởi động ở thư mục khác. Gõ tay: tương đối. <b>Tự động: tuyệt đối.</b>'), 'l')}` },

  { t: 'Bốn lối tắt . .. ~ - do SHELL khai triển, không phải lệnh', body: two(
    table(['Ký hiệu', 'Nghĩa', 'Ví dụ'], [
      ['<code>.</code>', 'thư mục hiện tại', '<code>cp /etc/hosts .</code> = chép về đây'],
      ['<code>..</code>', 'thư mục cha, xếp chồng được', '<code>cd ../../etc</code>'],
      ['<code>~</code> · <code>~root</code>', 'nhà của bạn · nhà của user khác', '<code>~/notes</code> → /home/an/notes'],
      ['<code>-</code>', 'CHỈ với cd: thư mục trước đó', '<code>cd -</code>'],
      ['<code>/</code> đứng đầu', 'bắt đầu từ gốc', '<code>/var/log</code>'],
    ], { sm: true }),
    `${term(['$ echo ~', '/home/an', '$ echo "~"', '+ ~', '$ echo ~root', '/root', '$ realpath ../../projects/./api//src', '/home/an/projects/api/src'], { title: 'Ubuntu — bằng chứng: bọc nháy thì ~ đứng yên', dir: '~/projects/api' })}
    ${box('tip', 'echo không hề hiểu <code>~</code>. Shell viết lại dòng lệnh TRƯỚC (<code>~</code>, <code>*</code>, <code>$VAR</code>) — chương trình chỉ thấy kết quả.')}`, 'l') },

  { t: './deploy.sh cần ./ vì thư mục hiện tại KHÔNG nằm trong PATH', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'a', x: 0, y: 20, w: 250, h: 70, t: 'deploy.sh', d: 'từ trần ⇒ tra trong PATH', c: 'red' },
      { id: 'p', x: 330, y: 0, w: 430, h: 110, t: 'PATH (6 thư mục, lần lượt)', d: '/usr/local/sbin · /usr/local/bin · /usr/sbin\n/usr/bin · /sbin · /bin — KHÔNG có “.”', c: 'amb' },
      { id: 'x', x: 900, y: 20, w: 250, h: 70, t: 'exit 127', d: 'command not found', c: 'red' },
      { id: 'b', x: 0, y: 170, w: 250, h: 70, t: './deploy.sh', d: 'có dấu / ⇒ KHÔNG tra PATH', c: 'grn' },
      { id: 'r', x: 900, y: 170, w: 250, h: 70, t: 'chạy file ngay đây', d: 'deploy OK', c: 'grn' },
    ], edges: [{ from: 'a', to: 'p', c: 'red' }, { from: 'p', to: 'x', c: 'red', t: 'hết danh sách' }, { from: 'b', to: 'r', c: 'grn', t: 'đi thẳng' }] })}
    ${two(
      term(['$ ./deploy.sh', '= deploy OK', '$ deploy.sh', '! bash: deploy.sh: command not found', '$ echo $?', '127'], { title: 'Ubuntu 24.04 — output thật', dir: '~/projects/api' }),
      box('bad', 'Nếu <code>.</code> nằm trong PATH, kẻ xấu chỉ cần thả một file tên <code>ls</code> vào thư mục dùng chung rồi chờ bạn <code>cd</code> vào gõ <code>ls</code>. Hai ký tự <code>./</code> biến việc chạy file cục bộ thành hành động CÓ CHỦ Ý.'), 'l')}` },

  { t: 'Tên có dấu cách hay bắt đầu bằng “-”: bọc nháy, hoặc ./ và --', body: two(
    `${sh([
      ['cd My Documents', '✗ too many arguments'],
      ['cd "My Documents"', '✓ nháy kép — thói quen'],
      ["cd 'My Documents'", '✓ nháy đơn'],
      ['cd My\\ Documents', '✓ thoát dấu cách'],
      ['rm -weird-file', '✗ invalid option -- \'w\''],
      ['rm ./-weird-file', '✓ ./ làm nó thành đường dẫn'],
      ['rm -- -weird-file', '✓ -- = hết cờ từ đây'],
    ], { fs: 16 })}
    ${term(['$ rm -weird-file', "! rm: invalid option -- 'w'", "Try 'rm ./-weird-file' to remove the file '-weird-file'."], { title: 'Ubuntu — rm tự gợi ý cách sửa' })}`,
    `${table(['Lệnh', 'Vào', 'Ra (thật)'], [
      ['<code>realpath</code>', '<code>src/app.ts</code>', '/home/an/projects/api/src/app.ts'],
      ['<code>basename</code>', '/var/log/nginx/error.log', 'error.log'],
      ['<code>basename f .ts</code>', 'src/app.ts .ts', 'app'],
      ['<code>dirname</code>', '/var/log/nginx/error.log', '/var/log/nginx'],
      ['<code>readlink -f</code>', '/bin/sh', '/usr/bin/dash'],
    ], { sm: true })}
    ${box('tip', '<code>basename</code>/<code>dirname</code> chỉ xử lý CHUỖI, không cần file tồn tại. Chương 7 dùng chúng để script tự biết mình nằm đâu.')}`) },

  /* ───────────── 1.3 ───────────── */
  { t: 'Cây FHS: mỗi thư mục gốc có một nhiệm vụ', body: '<style>.c-tree{font-size:15.5px;line-height:1.5}</style>' + two(
    tree(`/
├── bin → usr/bin        # lối tắt lịch sử
├── boot/                # nhân + bootloader
├── dev/                 # file thiết bị
├── etc/                 # CẤU HÌNH (văn bản)
├── home/                # nhà của người dùng
├── opt/                 # phần mềm tự đóng gói
├── proc/                # ảo: tiến trình
├── root/                # nhà của root
├── run/                 # ảo: trạng thái từ lúc bật
├── srv/                 # dữ liệu dịch vụ phục vụ
├── sys/                 # ảo: thiết bị, driver
├── tmp/                 # tạm, ai cũng ghi
├── usr/                 # chương trình + thư viện
└── var/                 # dữ liệu PHÌNH RA: log, CSDL`),
    `${term(['$ ls /', 'bin   dev  home  media  opt   root  sbin  sys  usr', 'boot  etc  lib   mnt    proc  run   srv   tmp  var'], { title: 'Ubuntu 24.04 — 18 mục ở gốc' })}
    ${table(['Ba chỗ dùng hằng ngày', 'Ví dụ'], [
      ['!⚙️ <code>/etc</code> — cấu hình người sửa tay', '<code>/etc/nginx/</code> · <code>/etc/ssh/sshd_config</code>'],
      ['-📈 <code>/var</code> — tự phình, thủ phạm đầy đĩa', '<code>/var/log</code> · <code>/var/lib/postgresql</code>'],
      ['+🏠 <code>/home</code> — mỗi người một nhà', '<code>/home/an</code> · root ở <code>/root</code>'],
    ], { sm: true })}
    ${box('tip', 'Máy chủ lạ? Nhìn 4 chỗ: cấu hình <code>/etc</code>, log <code>/var/log</code>, dữ liệu <code>/var/lib</code>, đang chạy <code>/proc</code>.')}`, 'l') },

  { t: 'Đặt file đúng chỗ = trả lời 2 câu: AI ghi vào, cài lại có mất không?', body: table(['Thư mục', 'Ai ghi vào', 'Tự phình?', 'Cài lại OS', 'Sao lưu?'], [
    ['<code>/etc</code>', 'quản trị viên (bạn)', 'không', '-mất bản sửa', '+CÓ — cấu hình máy'],
    ['<code>/var/lib</code>', 'dịch vụ (postgres, docker)', '!có', '-mất', '+CÓ — dữ liệu thật'],
    ['<code>/var/log</code>', 'dịch vụ', '!có — rất nhanh', '-mất', 'tuỳ'],
    ['<code>/home</code>', 'từng người dùng', 'có', 'thường giữ (phân vùng riêng)', '+CÓ'],
    ['<code>/usr</code>', 'trình quản lý gói (apt/dnf)', 'không', 'cài lại được', 'không cần'],
    ['<code>/usr/local</code> · <code>/opt</code>', 'bạn, cài ngoài apt', 'không', '-mất', 'ghi lại cách cài'],
    ['<code>/tmp</code>', 'mọi người', 'có', 'mất', '-KHÔNG BAO GIỜ'],
  ], { sm: true }) },

  { t: '/bin chỉ là lối tắt vào /usr/bin; script của bạn ở /usr/local/bin', body: two(
    term(['$ ls -l / | grep -- "->"', 'lrwxrwxrwx   1 root root    7 Apr 22  2024 bin -> usr/bin', 'lrwxrwxrwx   1 root root    7 Apr 22  2024 lib -> usr/lib', 'lrwxrwxrwx   1 root root    8 Apr 22  2024 sbin -> usr/sbin', '$ type -a ls', 'ls is aliased to `ls --color=auto\'', 'ls is /usr/bin/ls', '+ ls is /bin/ls          # cùng MỘT file, hai đường tới', '$ echo $PATH', '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'], { title: 'Ubuntu 24.04 — output thật' }),
    table(['Thư mục', 'Ai quản lý', 'Đặt gì'], [
      ['<code>/usr/bin</code>', '-apt/dnf — ghi đè khi nâng cấp', 'ĐỪNG đặt gì tay'],
      ['<code>/usr/sbin</code>', 'apt/dnf', 'sshd, useradd (root)'],
      ['<code>/usr/local/bin</code>', '+BẠN — gói không đụng', 'script của bạn ✓'],
      ['<code>/opt/&lt;app&gt;</code>', 'bạn / nhà cung cấp', 'phần mềm mang cây riêng'],
      ['<code>~/.local/bin</code>', 'chỉ một người dùng', 'công cụ cá nhân'],
    ], { sm: true }), 'l') },

  { t: '/proc, /sys, /dev không nằm trên đĩa — nhân sinh ra lúc đọc', body: two(
    term(['$ ls -ld /proc /sys', 'dr-xr-xr-x 266 root root 0 Sep 28 08:39 /proc', 'dr-xr-xr-x  11 root root 0 Sep 28 08:39 /sys', '$ cat /proc/uptime            # giây từ lúc bật', '402878.46 3995441.44', '$ cat /sys/class/net/eth0/address', 'ea:e8:9c:1d:4c:5d', '$ ls -l /dev/null /dev/zero', 'crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null', 'crw-rw-rw- 1 root root 1, 5 Sep 28 08:39 /dev/zero'], { title: 'Ubuntu 24.04 — kích thước 0, vẫn đọc được' }),
    cards([
      { ic: '🧠', t: '/proc', d: 'mỗi tiến trình một thư mục <code>/proc/&lt;PID&gt;</code> (Chương 5)', c: 'vio' },
      { ic: '🔌', t: '/sys', d: 'thiết bị &amp; driver: địa chỉ MAC, độ sáng, cgroup', c: 'blu' },
      { ic: '🕳️', t: '/dev', d: '<code>c</code> ký tự: <code>/dev/null</code> sọt rác · <code>b</code> khối: <code>/dev/sda</code> đĩa', c: 'tea' },
      { ic: '⚡', t: '/run', d: 'PID, socket — trong RAM, mất khi khởi động lại', c: 'amb' },
    ], 2), 'l') },

  { t: 'Ba máy, ba bản đồ: Ubuntu · Fedora · macOS', body: `
    ${table(['', 'Ubuntu 24.04 (VPS)', 'Fedora 44 (máy nhà)', 'macOS (Mac M1)'], [
      ['Nhà', '<code>/home/an</code>', '<code>/home/an</code>', '!<code>/Users/admin</code>'],
      ['Cấu hình', '<code>/etc</code>', '<code>/etc</code>', '<code>/etc → private/etc</code>'],
      ['<code>/tmp</code>', 'trên đĩa; xoá lúc boot + file &gt; 30 ngày', '!tmpfs (RAM) + file &gt; 10 ngày', '<code>/tmp → private/tmp</code>'],
      ['<code>/var/tmp</code>', 'không tự dọn', 'file &gt; 30 ngày', '<code>/var → private/var</code>'],
      ['<code>/bin</code>', 'lối tắt → usr/bin', 'lối tắt → usr/bin', '!thư mục THẬT, không phải lối tắt'],
      ['Phần mềm tự cài', '<code>/usr/local/bin</code>', '<code>/usr/local/bin</code>', '<code>/opt/homebrew/bin</code>'],
      ['Ổ gắn thêm', '<code>/mnt</code>, <code>/media</code>', '<code>/mnt</code>, <code>/run/media</code>', '<code>/Volumes</code>'],
      ['Hệ thống file /', 'ext4 (VPS thường gặp)', 'btrfs', 'APFS'],
    ], { sm: true })}
    ${box('info', 'Đọc thật từ <code>/usr/lib/tmpfiles.d/tmp.conf</code>: Ubuntu <code>D /tmp 1777 root root 30d</code> · Fedora <code>q /tmp … 10d</code>, <code>q /var/tmp … 30d</code>. Kết luận chung: thứ cần giữ thì đừng để ở /tmp.')}` },

  { t: 'File mới đi đâu? 5 câu hỏi — và du chỉ ra ai đang ăn đĩa', body: two(
    steps([
      ['Cấu hình người sửa tay?', '<code>/etc/&lt;app&gt;/</code> · một người: <code>~/.config/</code>'],
      ['Phình ra khi dịch vụ chạy?', 'log <code>/var/log/&lt;app&gt;</code> · dữ liệu <code>/var/lib/&lt;app&gt;</code>'],
      ['Chương trình cài tay?', '<code>/usr/local/bin</code> · mang cây riêng: <code>/opt</code>'],
      ['Của riêng bạn?', '<code>/home/bạn</code> — không đâu khác'],
      ['Vứt đi được?', '<code>/tmp</code> qua <code>mktemp</code> (Chương 7)'],
    ]),
    `${sh([['du -sh /var/* 2>/dev/null | sort -rh | head -5', '']], { fs: 15, so: false })}
    ${term(['61M     /var/lib', '2.9M    /var/cache', '404K    /var/log', '4.0K    /var/tmp', '4.0K    /var/spool'], { title: 'Ubuntu (container mới) — trên VPS thật /var/lib hay lên hàng GB' })}
    ${table(['Mẩu', 'Nghĩa'], [['<code>du -s</code> · <code>-h</code>', 'tổng mỗi mục · đơn vị dễ đọc'], ['<code>2&gt;/dev/null</code>', 'vứt lỗi “Permission denied”'], ['<code>sort -rh</code>', 'sắp theo cỡ “người đọc”, lớn trước']], { sm: true })}`, 'r') },

  /* ───────────── 1.4 ───────────── */
  { t: 'ls -l in 7 cột — đọc từng cột một', body: `
    ${annot('-rwxr-xr-x 1 an an 12 Sep 28 08:41 deploy.sh', [
      { from: 0, to: 1, c: 'vio' }, { from: 1, to: 10, c: 'lx' }, { from: 11, to: 12, c: 'pnk' }, { from: 13, to: 15, c: 'tea' },
      { from: 16, to: 18, c: 'grn' }, { from: 19, to: 21, c: 'blu' }, { from: 22, to: 34, c: 'amb' }, { from: 35, to: 44, c: 'ora' },
    ], { fs: 32, num: true })}
    ${table(['#', 'Cột', 'Đọc là', '#', 'Cột', 'Đọc là'], [
      ['1', '<b style="color:#bc8cff">loại</b>', '<code>-</code> file · <code>d</code> thư mục · <code>l</code> liên kết', '5', '<b style="color:#3fb950">nhóm</b>', 'group sở hữu (Chương 4)'],
      ['2', '<b style="color:#f5b700">quyền</b>', 'rwx của chủ · nhóm · người khác', '6', '<b style="color:#58a6ff">cỡ</b>', 'byte — với thư mục ≠ nội dung'],
      ['3', '<b style="color:#f778ba">số liên kết</b>', 'số TÊN trỏ vào inode này', '7', '<b style="color:#ffc233">mtime</b>', 'lần sửa NỘI DUNG cuối'],
      ['4', '<b style="color:#2dd4bf">chủ</b>', 'user sở hữu', '8', '<b style="color:#ff8a4c">tên</b>', 'nằm trong thư mục, không trong inode'],
    ], { sm: true, center: [0, 3] })}
    ${two(
      box('warn', 'Thư mục ghi <b>4096</b> = cái DANH SÁCH chiếm 1 khối 4 KB (ext4), không phải dung lượng bên trong ⇒ đo bằng <code>du -sh</code>.'),
      box('info', 'Trong 6 tháng hiện giờ <code>Sep 28 08:41</code>; cũ hơn hiện năm <code>Apr 22  2024</code>. Đủ: <code>--time-style=long-iso</code>.'))}` },

  { t: 'Ký tự đầu là LOẠI file — một thư mục có đủ cả 6 loại', body: `${perms('-rwxr-xr-x', { raw: '-rwxr-xr-x 1 an an 12 deploy.sh' })}
    ${two(
    term(['$ ls -la', '-rw-r--r-- 1 an an   10 Sep 28 08:41 .env', '-rwxr-xr-x 1 an an   12 Sep 28 08:41 deploy.sh', '+ lrwxrwxrwx 1 an an   12 Sep 28 08:41 latest -> logs/app.log', 'drwxr-xr-x 2 an an 4096 Sep 28 08:41 logs', '+ prw-r--r-- 1 an an    0 Sep 28 08:41 ong', '+ srwxr-xr-x 1 an an    0 Sep 28 08:41 sock', '$ ls -l /dev/null', '+ crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null'], { title: 'Ubuntu — mkfifo, ln -s, socket', dir: '~/xem', fs: 14 }),
    `${table(['Ký tự', 'Loại'], [['<code>-</code> · <code>d</code> · <code>l</code>', 'file thường · thư mục · liên kết mềm'], ['<code>c</code> · <code>b</code>', 'thiết bị ký tự · khối (đĩa)'], ['<code>p</code> · <code>s</code>', 'ống có tên · socket']], { sm: true })}`, 'l2')}` },

  { t: 'Sắp xếp để trả lời một câu hỏi: -S to nhất, -t mới nhất, -r đảo', body: two(
    `${sh([
      ['ls -lhS /var/log | head -5', 'cái gì đang ăn chỗ?'],
      ['ls -lt  /var/log | head -5', 'vừa rồi cái gì đổi?'],
      ['ls -ltr /var/log | tail -5', 'mới nhất nằm SÁT dấu nhắc'],
      ['ls -ld  /tmp', 'chính thư mục, không vào trong'],
      ['ls -li  deploy.sh', 'kèm số inode'],
      ['ls -l --time=ctime f', 'hiện ctime thay mtime (GNU)'],
      ['ls -l --full-time f', 'giờ đủ tới nano giây (GNU)'],
    ], { fs: 15.5 })}`,
    `${table(['Cờ', 'Nghĩa'], [
      ['<code>-S</code>', 'theo cỡ, lớn nhất trước'],
      ['<code>-t</code>', 'theo mtime, mới nhất trước'],
      ['<code>-r</code>', 'đảo thứ tự bất kỳ'],
      ['<code>-h</code>', '4.0K, 2.5M thay cho byte'],
      ['<code>-d</code> · <code>-i</code>', 'chính thư mục · số inode'],
      ['<code>-F</code>', 'đuôi ký hiệu: <code>/</code> <code>*</code> <code>@</code> <code>|</code> <code>=</code>'],
    ], { sm: true })}
    ${box('warn', '<b>macOS (BSD ls):</b> không có <code>--sort</code>, <code>--time</code>, <code>--full-time</code>, <code>--version</code> ⇒ <code>ls: unrecognized option</code>. Cờ một chữ <code>-lhStr</code> thì dùng chung được.')}`, 'r') },

  { t: 'stat: ba dấu thời gian — chmod đổi ctime, KHÔNG đổi mtime', body: two(
    term(['$ touch -d "2025-03-01 09:00" ghi-chu.txt', '$ chmod 600 ghi-chu.txt', '$ stat ghi-chu.txt | tail -4', 'Access: 2026-09-28 08:42:13.189790008 +0000', '= Modify: 2025-03-01 09:00:00.000000000 +0000', '+ Change: 2026-09-28 08:42:13.189572466 +0000', ' Birth: 2026-09-28 08:42:13.188089341 +0000', '$ ls -l ghi-chu.txt', '-rw------- 1 an an 3 Mar  1  2025 ghi-chu.txt', '$ stat -c "%A %a %U %s %n" deploy.sh', '-rwxr-xr-x 755 an 12 deploy.sh'], { title: 'Ubuntu 24.04 — output thật (UTC trong container)', dir: '~/thu-linux/xem' }),
    `${table(['Dấu', 'Đổi khi', 'Ai dùng'], [
      ['atime', 'đọc nội dung (thường bị <code>relatime</code> hạn chế)', 'ít ai tin'],
      ['!mtime', 'SỬA NỘI DUNG', '<code>ls -l</code>, <code>find -mtime</code>, make'],
      ['!ctime', 'đổi INODE: quyền, chủ, tên, cả nội dung', 'phát hiện đổi quyền'],
      ['Birth', 'lúc tạo (ext4/btrfs mới có)', 'đừng để script phụ thuộc'],
    ], { sm: true })}
    ${box('warn', 'ctime = <b>change</b> time, KHÔNG phải creation time. Mac: <code>stat -c</code> báo <code>illegal option</code> ⇒ dùng <code>stat -f "%Sp %Lp %Su %z %N"</code> hoặc <code>stat -x</code>.')}`, 'l') },

  { t: 'file đọc NỘI DUNG — đuôi tên chỉ là lời hứa của người đặt', body: two(
    term(['$ file anh.jpg bao-cao.txt hoa-don.pdf du-lieu.bin', '! anh.jpg:     POSIX shell script, ASCII text executable', '! bao-cao.txt: gzip compressed data, was "services", …', 'hoa-don.pdf: PDF document, version 1.7', 'du-lieu.bin: data', '$ file -i anh.jpg', 'anh.jpg: text/x-shellscript; charset=us-ascii', '$ head -c 16 bao-cao.txt | od -A x -t x1z', '+ 000000 1f 8b 08 08 99 b2 5f 60 …  >......_`..servic<', '$ file /usr/bin/ls', '/usr/bin/ls: ELF 64-bit LSB pie executable, ARM aarch64, …'], { title: 'Ubuntu — cùng một thư mục, ba cái tên nói dối', dir: '~/thu-linux/xem' }),
    `${steps([
      ['Đọc vài byte đầu', 'mỗi định dạng có “chữ ký”: gzip <code>1f 8b</code>, PDF <code>%PDF</code>, ELF <code>7f 45 4c 46</code>'],
      ['Tra bảng magic', '<code>/usr/share/misc/magic</code> — hàng nghìn mẫu'],
      ['Không khớp mẫu nào', 'in <code>data</code> = nhị phân lạ, đừng <code>cat</code>'],
    ])}
    ${box('bad', 'File tải về không rõ ⇒ <code>file</code> trước, <code>head</code> sau, <code>cat</code> sau cùng. Linux không bao giờ chạy file vì đuôi <code>.sh</code> — quyền <code>x</code> + shebang mới quyết (Chương 7).')}`, 'l') },

  { t: 'Xoá file mà đĩa không trống: inode vẫn còn người giữ', body: `
    ${inodeSvg()}
    ${two(
      term(['$ df -m --output=used /     # 500 MB log vừa ghi', '24073', '$ rm /srv/log/access.log; du -sh /srv/log', '4.0K    /srv/log', '$ df -m --output=used /', '! 24073                       # KHÔNG giảm', '$ lsof +L1', 'COMMAND  PID  FD  SIZE/OFF  NLINK NAME', '+ sleep  4087  3w  524288000     0 /srv/log/access.log (deleted)', '$ kill 4087; df -m --output=used /', '= 23573                       # trả đủ 500 MB'], { title: 'Ubuntu 24.04 — dựng lại thật trong container', fs: 13.5 }),
      box('good', 'Nhân chỉ trả chỗ khi <b>số tên</b> VÀ <b>số người mở</b> cùng về 0. <b>df</b> đếm khối đang bị chiếm; <b>du</b> đi theo TÊN. Tên mất mà khối còn ⇒ hai con số lệch. Sửa: khởi động lại tiến trình giữ file — hoặc lần sau làm rỗng thay vì xoá: <code>: &gt; access.log</code>.'), 'l')}` },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 1', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Lệnh “chẳng làm gì”, file “không tồn tại”', 'Đứng sai thư mục, đường dẫn tương đối', '<code>pwd</code> trước; Tab để tự hoàn thành'],
    ['<code>deploy.sh: command not found</code> (127)', '<code>.</code> không nằm trong PATH', '<code>./deploy.sh</code>'],
    ['Chạy tay được, chạy cron thì hỏng', 'cron khởi động ở thư mục khác', 'Đường dẫn tuyệt đối trong mọi thứ tự động'],
    ['<code>cd: too many arguments</code>', 'Tên có dấu cách không bọc nháy', '<code>cd "My Documents"</code>'],
    ['Xoá thư mục “trống” mất luôn <code>.env</code>', '<code>ls</code> giấu file dấu chấm', '<code>ls -A</code> trước khi xoá'],
    ['<code>man cd</code> → No manual entry', '<code>cd</code> là builtin của bash', '<code>type cd</code> rồi <code>help cd</code>'],
    ['Script tự viết biến mất sau <code>apt upgrade</code>', 'Đặt trong <code>/usr/bin</code> của apt', '<code>/usr/local/bin</code>'],
    ['Xoá log 40 GB mà df vẫn đầy', 'Tiến trình còn mở file đã xoá', '<code>lsof +L1</code> → restart tiến trình đó'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 1 (1/2): di chuyển &amp; tự tra cứu', body: two(
    sh([
      ['pwd', 'tôi đang ở đâu'],
      ['ls -lah', 'tất cả, dạng dài, cỡ dễ đọc'],
      ['ls -A', 'cả file ẩn, bỏ . và ..'],
      ['cd dir · cd .. · cd ~ · cd -', 'vào · lên · nhà · quay lại'],
      ['cd "My Documents"', 'tên có dấu cách'],
      ['./script.sh', 'chạy file ở đây'],
      ['history | tail -5 · !! · !543', 'lịch sử · lặp lại'],
      ['realpath · basename · dirname', 'xử lý đường dẫn'],
    ], { fs: 16.5 }),
    sh([
      ['type -a ls', 'alias? builtin? file nào?'],
      ['help cd', 'tra builtin của bash'],
      ['man ls · man 5 passwd', 'trang man · chọn mục'],
      ['man -f passwd', '= whatis: có ở mục nào'],
      ['man -k compress', '= apropos: tìm theo mô tả'],
      ['ls --help | grep -i size', 'tìm cờ nhanh'],
      ['less -N -S file · less +F log', 'số dòng · theo dõi log'],
      ['# trong less: /  n  N  g  G  q', 'tìm·tới·lùi·đầu·cuối·thoát'],
    ], { fs: 16.5 })) },

  { t: 'Bảng tra nhanh Chương 1 (2/2): cây thư mục &amp; nhìn kỹ một file', body: sh([
      ['ls /', '18 mục gốc (FHS)'],
      ['ls -ld /bin /tmp', 'chính thư mục, không vào trong'],
      ['tree -L 2 -d /etc', 'cây, 2 cấp, chỉ thư mục'],
      ['du -sh /var/* 2>/dev/null | sort -rh', 'ai ăn đĩa'],
      ['cat /proc/uptime', 'đọc file ảo của nhân'],
      ['ls -lhS · ls -ltr', 'to nhất · mới nhất cuối'],
      ['ls -li · ls -l --full-time', 'inode · giờ đủ (GNU)'],
    ], { fs: 16, so: false }) + '<div style="height:14px"></div>' + sh([
      ['stat file', 'mọi thứ hệ thống file biết'],
      ['stat -c "%A %a %U %s %n" f', 'định dạng tuỳ ý (GNU)'],
      ['stat -f "%Sp %Lp %Su %z %N" f', 'bản macOS/BSD'],
      ['file x · file -i x', 'loại thật · kiểu MIME'],
      ['head -c 16 x | od -A x -t x1z', 'xem byte đầu (chữ ký)'],
      ['wc -l f · wc -c f', 'đếm dòng · đếm byte'],
      ['lsof +L1', 'file đã xoá mà còn bị giữ'],
    ], { fs: 16, so: false }) },

  { t: 'Thực hành Chương 1 (40 phút): dựng và soi một “máy chủ nhỏ”', body: `
    ${steps([
      ['Dựng <code>~/thu-linux/ch1</code> có <code>src/</code>, <code>logs/</code>, <code>.env</code>, <code>"Bao cao"</code>', 'đi lại chỉ bằng cd tương đối, cd -, Tab — kiểm bằng pwd'],
      ['Tra cứu không Google: <code>apropos</code> tìm lệnh nén, <code>--help</code> tìm cờ “theo cỡ”, <code>man 5 passwd</code>', 'ghi mục man của 3 trang vào sổ'],
      ['Vẽ tay cây FHS rồi đối chiếu <code>ls /</code>, <code>ls -l /</code>: mục nào là lối tắt, mục nào có cỡ 0?', 'giải thích vì sao <code>/proc</code> cỡ 0 mà đọc được'],
      ['Tạo 3 file “nói dối” (đuôi sai) + 1 fifo + 1 symlink; đọc <code>ls -la</code> và <code>file</code>', 'gọi đúng loại từng dòng trước khi nhìn output'],
      ['<code>chmod</code> một file rồi so mtime/ctime bằng <code>stat</code>; dựng sự cố “xoá mà không trả chỗ” trong container', '<code>lsof +L1</code> thấy <code>(deleted)</code>, kill xong df giảm'],
    ])}
    ${box('good', '<b>Đạt khi:</b> nói được bằng lời từng cột của một dòng <code>ls -l</code>, chỉ ra passwd(1) khác passwd(5), và con số <code>df</code> trước/sau <code>kill</code> khớp với cỡ file bạn đã xoá.')}` },
]);
