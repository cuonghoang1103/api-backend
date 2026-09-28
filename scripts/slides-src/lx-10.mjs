/**
 * Linux & Bash · Deck lx-10 — Chương 10: Đĩa, gói phần mềm & log.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu"  = container ubuntu:24.04 (arm64, coreutils 9.4, apt 2.8.3, dpkg 1.22, logrotate 3.21, gnupg 2.4.4)
 *                 trên Mac M1. /data là tmpfs 64M giới hạn 2000 inode (docker --tmpfs …,nr_inodes=2000);
 *                 /vps là cây thư mục giả lập một VPS (file ngẫu nhiên đúng cỡ). Ổ gắn đè: container ngắn hạn
 *                 --cap-add SYS_ADMIN, hai tmpfs chồng nhau.
 *   • "Ubuntu + systemd" = cùng ảnh đó chạy /sbin/init (--privileged, ngắn hạn), hostname `vps`, systemd 255:
 *                 unit myapp.service (python in 3 mức log rồi thoát 3, Restart=on-failure) và anram.service
 *                 (MemoryMax=60M ⇒ bị OOM giết). journalctl/logger/journald.conf đo ở đây.
 *   • "Fedora"  = máy linux-nha (Fedora 44, btrfs, systemd 259, dnf5 5.4), người thường, không sudo.
 *   • "Mac"     = Mac M1, macOS 27, du/df/sort BSD, /sbin/sha256sum (Darwin) 1.0, shasum, Docker Desktop.
 *
 * Hình tự vẽ (SVG nội tuyến): dfDu() vì sao df ≠ du · dfCot() annot một dòng df · duCay() lần xuống nhánh lớn nhất ·
 * moXoa() tên → inode ← fd trước/sau rm · gandE() ổ gắn đè che dữ liệu · suCo() dòng thời gian sự cố đĩa đầy ·
 * aptDuong() 4 chặng của apt · tinCay() chuỗi tin cậy khoá → InRelease → Packages → .deb · haiDuong() journald và
 * file log · mucUT() 8 mức ưu tiên · xoay() ba cách xoay vòng log · annot() (chép lx-05).
 */
import { S, cover, sh, term, mindmap, box, steps, table, two, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-10', code: 'LINUX · CHƯƠNG 10', title: 'Đĩa, gói phần mềm &amp; log', sub: 'Linux & Bash · Chương 10' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15.5px}.c-t.sm td,.c-t.sm th{padding:6px 10px}</style>';

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

/* Slide 3 — df đếm KHỐI đã cấp, du cộng file nó NHÌN THẤY: khoảng chênh là ba thứ vô hình */
const dfDu = () => {
  const K = 9.2, X0 = 250; // 1G = 9,2px
  let s = '';
  const seg = (x, y, g, col, t, { dash = false, h = 50, op = 0.85 } = {}) => {
    const w = g * K;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${D[col]}" opacity="${op}"${dash ? ` stroke="${D[col]}" stroke-dasharray="6 5" fill-opacity=".25"` : ''}/>`;
    if (t) s += T(x + w / 2, y + 31, t, { fs: 15, a: 'middle', b: true, c: '#0a0f0c' });
    return x + w;
  };
  s += T(0, 38, 'df -h /', { fs: 18, b: true, mono: true, c: 'lx' }) + T(0, 60, 'hệ thống file đếm KHỐI', { fs: 14, c: 'mu' });
  let x = X0;
  x = seg(x, 14, 40, 'grn', 'du thấy: 40G');
  x = seg(x, 14, 30, 'red', 'đã xoá, còn mở 30G');
  x = seg(x, 14, 5, 'vio', '');
  const xAv = seg(x, 14, 1.8, 'dim', '');
  seg(xAv, 14, 2.2, 'amb', '', { op: 0.35 });
  s += T(X0, 90, 'Used 75G', { fs: 14.5, mono: true, c: 'tx' }) + T(xAv + 8, 112, '← Avail 1.8G', { fs: 13.5, mono: true, c: 'mu' });
  s += T(X0 + 79 * K + 10, 76, 'Size 79G', { fs: 14.5, mono: true, c: 'tx' });
  s += `<path d="M${x - 2.5 * K} 70 L${x - 2.5 * K} 118" stroke="${D.vio}" stroke-width="2"/>` + T(x - 2.5 * K - 6, 124, 'dưới điểm gắn 5G', { fs: 14, c: 'vio', a: 'end' });
  s += T(X0 + 79 * K + 10, 30, '← dự trữ cho root', { fs: 14, c: 'amb' }) + T(X0 + 79 * K + 10, 50, '(5% mặc định ext4)', { fs: 13, c: 'mu' });
  s += T(0, 178, 'du -shx /', { fs: 18, b: true, mono: true, c: 'grn' }) + T(0, 200, 'cộng file nó NHÌN THẤY', { fs: 14, c: 'mu' });
  seg(X0, 154, 40, 'grn', '40G');
  s += `<path d="M${X0 + 40 * K} 146 L${X0 + 40 * K} 212" stroke="${D.red}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += T(X0 + 40 * K + 12, 186, '← khoảng chênh 35G: chính nó là manh mối', { fs: 16, c: 'red', b: true });
  const card = (cx, t, how, col) => {
    s += R(cx, 236, 370, 104, { c: col, r: 10 });
    s += T(cx + 16, 264, t, { fs: 16, b: true, c: col });
    how.forEach((h, i) => { s += T(cx + 16, 290 + i * 22, h, { fs: 14.5, mono: i === 0, c: i === 0 ? 'tx' : 'mu' }); });
  };
  card(0, '① File đã xoá mà còn mở', ['lsof +L1', 'tên mất, inode còn: tiến trình giữ fd'], 'red');
  card(390, '② Dữ liệu dưới điểm gắn', ['mount --bind / /mnt/goc', 'ghi TRƯỚC khi gắn ổ ⇒ bị che'], 'vio');
  card(780, '③ Khối dự trữ cho root', ['tune2fs -l /dev/sda1', 'người thường hết chỗ sớm hơn root'], 'amb');
  return sv(1150, 344, s);
};

/* Slide 5 — lần theo nhánh lớn nhất: bốn lần du, số THẬT từ cây /vps */
const duCay = () => {
  const cols = [
    ['du -h -d1 .', [['home', 12], ['usr', 49], ['var', 207]]],
    ['du -h -d1 var', [['cache', 3.1], ['log', 40], ['lib', 165]]],
    ['du -h -d1 var/lib', [['postgresql', 23], ['docker', 143]]],
    ['du -h -d1 var/lib/docker', [['overlay2', 67], ['buildkit', 77]]],
  ];
  const W = 270, GAP = 23, MAXW = 170;
  let s = '';
  cols.forEach(([cmd, rows], i) => {
    const x = i * (W + GAP);
    s += R(x, 0, W, 250, { c: i === 3 ? 'red' : 'bd', r: 12, fill: '#0d1410' });
    s += T(x + 14, 30, cmd, { fs: 14, b: true, mono: true, c: 'lx' });
    s += T(x + 14, 50, '| sort -h  (nhỏ → LỚN)', { fs: 12.5, mono: true, c: 'mu' });
    const mx = Math.max(...rows.map((r) => r[1]));
    rows.forEach(([n, v], k) => {
      const y = 70 + k * 56;
      const last = k === rows.length - 1;
      const col = last ? (i === 3 ? 'red' : 'amb') : 'dim';
      s += `<rect x="${x + 14}" y="${y}" width="${Math.max(6, (v / mx) * MAXW)}" height="26" rx="4" fill="${D[col]}" opacity="${last ? 0.9 : 0.55}"/>`;
      s += T(x + 14, y + 44, n, { fs: 14.5, mono: true, c: last ? 'tx' : 'mu', b: last });
      s += T(x + W - 14, y + 19, `${v}M`, { fs: 14.5, mono: true, a: 'end', c: last ? col : 'mu', b: last });
    });
    if (i < 3) s += A(x + W - 4, 236, x + W + GAP + 10, 236, { c: 'amb', sw: 2.5 });
  });
  s += T(3 * (W + GAP) + 14, 236, 'buildkit = cache build', { fs: 13.5, c: 'red', b: true });
  s += T(0, 282, 'Mỗi bước chỉ nhìn DÒNG CUỐI (lớn nhất) rồi cd vào đó — 4 lệnh từ 266M của cả máy xuống đúng thủ phạm 77M.', { fs: 15, c: 'lx' });
  return sv(1150, 292, s);
};

/* Slide 7 — tên → inode ← fd: vì sao rm không trả chỗ */
const moXoa = () => {
  let s = '';
  const panel = (x, title, sau) => {
    s += R(x, 0, 540, 250, { c: sau ? 'red' : 'grn', r: 14, fill: 'rgba(255,255,255,.02)', dash: true });
    s += T(x + 18, 30, title, { fs: 17, b: true, c: sau ? 'red' : 'grn' });
    // tên trong thư mục
    s += R(x + 20, 60, 190, 56, { c: sau ? 'dim' : 'blu', r: 10, dash: sau });
    s += T(x + 115, 84, 'log/access.log', { fs: 14.5, a: 'middle', mono: true, b: true, c: sau ? 'dim' : 'tx' });
    s += T(x + 115, 105, sau ? 'đã gỡ (unlink)' : 'TÊN trong thư mục', { fs: 13, a: 'middle', c: sau ? 'red' : 'mu' });
    if (sau) s += `<path d="M${x + 30} ${70} L${x + 200} ${106}" stroke="${D.red}" stroke-width="3"/>`;
    // tiến trình
    s += R(x + 20, 160, 190, 56, { c: 'vio', r: 10 });
    s += T(x + 115, 184, 'sleep (PID 5748)', { fs: 14.5, a: 'middle', mono: true, b: true });
    s += T(x + 115, 205, 'fd 3 → mở để GHI', { fs: 13, a: 'middle', c: 'mu' });
    // inode
    s += R(x + 320, 90, 200, 100, { c: 'lx', r: 12, fill: 'rgba(245,183,0,.10)' });
    s += T(x + 420, 120, 'inode 2003', { fs: 16, a: 'middle', b: true, mono: true });
    s += T(x + 420, 144, '40 MB dữ liệu', { fs: 14, a: 'middle', c: 'lx' });
    s += T(x + 420, 168, sau ? 'NLINK 0 · vẫn giữ chỗ' : 'NLINK 1', { fs: 13.5, a: 'middle', mono: true, c: sau ? 'red' : 'mu', b: sau });
    if (!sau) s += A(x + 212, 88, x + 316, 118, { c: 'blu' });
    else s += A(x + 212, 88, x + 316, 118, { c: 'dim', dash: true });
    s += A(x + 212, 188, x + 316, 164, { c: 'vio' });
  };
  panel(0, 'TRƯỚC rm — 2 đường tới dữ liệu', false);
  panel(600, 'SAU rm — còn 1 đường: fd của tiến trình', true);
  s += T(575, 278, 'Chỗ chỉ được trả khi đường CUỐI CÙNG đứt: tiến trình đóng file / thoát — hoặc bạn cắt trắng qua /proc/PID/fd/3.', { fs: 15, a: 'middle', c: 'lx' });
  return sv(1150, 288, s);
};

/* Slide 8 — ổ gắn đè che dữ liệu đã ghi trước đó */
const gandE = () => {
  let s = '';
  s += R(0, 0, 560, 270, { c: 'blu', r: 14, fill: 'rgba(88,166,255,.05)' });
  s += T(18, 30, 'ổ gốc: tmpfs 100M gắn ở /srv', { fs: 16, b: true, c: 'blu' });
  s += T(18, 52, 'df -h /srv ⇒ Used 30M', { fs: 14.5, mono: true, c: 'mu' });
  s += R(30, 150, 500, 90, { c: 'red', r: 10, dash: true, fill: 'rgba(248,81,73,.08)' });
  s += T(50, 180, 'docker/cu-truoc-khi-gan.img  30M', { fs: 15, mono: true, b: true, c: 'red' });
  s += T(50, 204, 'ghi vào /srv/docker TRƯỚC khi gắn ổ mới', { fs: 13.5, c: 'mu' });
  s += T(50, 226, 'không tên nào tới được ⇒ du không thấy', { fs: 13.5, c: 'red' });
  s += R(60, 76, 440, 62, { c: 'grn', r: 10, fill: '#101c14' });
  s += T(80, 102, 'ổ MỚI 200M gắn đè lên /srv/docker', { fs: 15, b: true, c: 'grn' });
  s += T(80, 124, 'moi.img 5M — đây là thứ ls/du nhìn thấy', { fs: 13.5, c: 'mu' });
  s += A(280, 140, 280, 158, { c: 'grn', sw: 2.5 });
  s += R(620, 0, 530, 270, { c: 'lx', r: 14, fill: 'rgba(245,183,0,.04)' });
  s += T(640, 30, 'Nhìn XUỐNG DƯỚI mà không tháo ổ', { fs: 16, b: true, c: 'lx' });
  const rows = [['du -sh /srv', '5.0M', 'đi qua điểm gắn, thấy ổ MỚI', 'grn'], ['du -shx /srv', '0', '-x: dừng ở ranh giới, bỏ ổ mới', 'dim'],
    ['mount --bind /srv /mnt/goc', '', 'gắn lại ổ gốc, KHÔNG kèm ổ con', 'lx'], ['du -sh /mnt/goc/docker', '30M', '⇐ phần bị che, lộ ra', 'red']];
  rows.forEach(([cmd, v, d, col], i) => {
    const y = 66 + i * 50;
    s += T(640, y, cmd, { fs: 14.5, mono: true, b: true });
    if (v) s += T(1132, y, v, { fs: 15, mono: true, b: true, a: 'end', c: col });
    s += T(640, y + 20, d, { fs: 13, c: col === 'dim' ? 'mu' : col });
  });
  return sv(1150, 274, s);
};

/* Slide 9 — dòng thời gian sự cố thật (dự án sinh viên, 18/08/2026) */
const suCo = () => {
  let s = '';
  const ev = [
    [0, 'nhiều tuần', 'cache build phình dần', '→ 7,6 GB, CÙNG đĩa với Postgres', 'amb'],
    [290, 'deploy 18/08', 'next build ghi tầng mới', 'đĩa tụt còn 1,8 GB', 'ora'],
    [580, 'giữa chừng', 'no space left on device', 'bản dựng chết, ảnh ghi dở', 'red'],
    [870, 'cùng lúc', 'Postgres không ghi được', 'app lỗi 500 — trông như lỗi CSDL', 'red'],
  ];
  s += `<path d="M10 58 L1140 58" stroke="${D.bd}" stroke-width="4"/>`;
  ev.forEach(([x, when, t, d, col]) => {
    s += `<circle cx="${x + 20}" cy="58" r="11" fill="${D[col]}"/>`;
    s += T(x + 20, 30, when, { fs: 14.5, c: col, b: true });
    s += R(x, 84, 270, 76, { c: col, r: 10 });
    s += T(x + 14, 112, t, { fs: 15, b: true });
    s += T(x + 14, 138, d, { fs: 13.5, c: 'mu' });
  });
  return sv(1150, 164, s);
};

/* Slide 10 — bốn chặng của apt, đường dẫn và cỡ THẬT (Ubuntu 24.04 arm64) */
const aptDuong = () => {
  let s = '';
  const B = (x, y, w, h, n, t, lines, col) => {
    s += R(x, y, w, h, { c: col, r: 12 });
    s += `<circle cx="${x + 24}" cy="${y + 26}" r="14" fill="${D[col]}"/>` + T(x + 24, y + 32, n, { fs: 15, a: 'middle', b: true, c: '#0a0f0c' });
    s += T(x + 46, y + 32, t, { fs: 16, b: true, c: col });
    lines.forEach((l, i) => { s += T(x + 16, y + 60 + i * 21, l, { fs: 13.5, mono: i < 2, c: i < 2 ? 'tx' : 'mu' }); });
  };
  B(0, 0, 270, 150, '1', 'Kho (nguồn)', ['/etc/apt/sources.list.d/', '  ubuntu.sources', 'định dạng deb822, Signed-By', 'noble · -updates · -security'], 'blu');
  B(292, 0, 270, 150, '2', 'Danh mục', ['/var/lib/apt/lists/', '  *InRelease *Packages.lz4', '55 MB · chưa cài gì', 'chỉ "biết có gì, bản nào"'], 'vio');
  B(584, 0, 270, 150, '3', 'Bộ đệm .deb', ['/var/cache/apt/archives/', '  jq_1.7.1…_arm64.deb', 'apt clean xoá sạch chỗ này', 'ảnh Docker tự xoá (docker-clean)'], 'amb');
  B(876, 0, 274, 150, '4', 'dpkg cài', ['/var/lib/dpkg/status', '/var/lib/dpkg/info/jq.list', '157 gói · 725 file ghi chép', 'biết file nào của gói nào'], 'grn');
  const L = (x1, x2, t) => { s += A(x1, 186, x2, 186, { c: 'lx', sw: 2.5 }) + T((x1 + x2) / 2, 176, t, { fs: 14, a: 'middle', mono: true, b: true, c: 'lx' }); };
  s += `<path d="M135 152 L135 186" stroke="${D.lx}" stroke-width="2.5"/>`;
  L(135, 420, 'apt update');
  L(430, 712, 'apt install (tải)');
  L(722, 1010, 'dpkg -i (giải nén)');
  s += `<path d="M420 186 L427 186 M427 186 L427 154" stroke="${D.lx}" stroke-width="2.5"/>`;
  s += T(0, 232, 'update chỉ đi chặng 1→2. install đi 2→3→4. Dockerfile: "update && install … && rm -rf /var/lib/apt/lists/*" trong MỘT RUN.', { fs: 14.5, c: 'mu' });
  return sv(1150, 240, s);
};

/* Slide 15 — chuỗi tin cậy của apt: hash thật, chữ ký thật */
const tinCay = () => {
  let s = '';
  const B = (x, w, t, l1, l2, col) => {
    s += R(x, 0, w, 118, { c: col, r: 12 });
    s += T(x + 14, 30, t, { fs: 15.5, b: true, c: col });
    s += T(x + 14, 58, l1, { fs: 13, mono: true });
    s += T(x + 14, 82, l2, { fs: 13, c: 'mu' });
  };
  B(0, 260, '🔑 khoá công khai', 'ubuntu-archive-keyring.gpg', 'Signed-By trỏ vào ĐÚNG file này', 'lx');
  B(296, 270, '✍ InRelease (có chữ ký)', 'gpgv: Good signature', '"Archive Automatic Signing Key (2018)"', 'grn');
  B(602, 250, '📋 Packages', 'SHA256 của jq .deb', 'd26709d7…c8c1dc', 'blu');
  B(888, 262, '📦 jq_1.7.1…_arm64.deb', 'sha256sum = d26709d7…', 'khớp ⇒ apt mới cho dpkg cài', 'vio');
  s += A(262, 59, 292, 59, { c: 'lx' }) + A(568, 59, 598, 59, { c: 'grn' }) + A(854, 59, 884, 59, { c: 'blu' });
  s += T(0, 150, 'InRelease ghi hash của file Packages; Packages ghi hash của từng .deb ⇒ MỘT chữ ký bảo vệ cả chuỗi.', { fs: 14.5, c: 'lx' });
  return sv(1150, 158, s);
};

/* Slide 17 — hai đường đi của log */
const haiDuong = () => {
  let s = '';
  const B = (x, y, w, h, t, d, col, mono = true) => {
    s += R(x, y, w, h, { c: col, r: 10 });
    s += T(x + w / 2, y + 28, t, { fs: 15.5, b: true, a: 'middle', mono });
    if (d) s += T(x + w / 2, y + 50, d, { fs: 13.5, a: 'middle', c: 'mu' });
  };
  B(0, 20, 230, 64, 'myapp.service', 'print() ra stdout/stderr', 'lx');
  B(0, 190, 230, 64, 'nginx · ghi file', 'tự mở /var/log/nginx/…', 'ora');
  B(0, 105, 230, 60, 'logger -t deploy', 'script, cron', 'tea');
  B(330, 40, 250, 70, 'systemd-journald', 'hứng MỌI unit + logger', 'blu');
  B(680, 20, 240, 64, '/var/log/journal/', 'nhị phân, có chỉ mục', 'blu');
  B(680, 104, 240, 60, '/run/log/journal/', 'thiếu thư mục trên ⇒ RAM', 'red');
  B(330, 190, 250, 64, '/var/log/nginx/*.log', 'văn bản thường', 'ora');
  B(680, 190, 240, 64, 'logrotate (hằng ngày)', '.1 · .2.gz · … rotate 14', 'amb');
  B(960, 40, 190, 64, 'journalctl', '-u -p --since -f', 'grn');
  B(960, 190, 190, 64, 'less · grep · zgrep', 'Chương 3', 'grn', false);
  s += A(232, 52, 326, 66, { c: 'lx' }) + A(232, 135, 326, 90, { c: 'tea' });
  s += A(582, 66, 676, 52, { c: 'blu' }) + A(582, 90, 676, 132, { c: 'red', dash: true });
  s += A(232, 222, 326, 222, { c: 'ora' }) + A(582, 222, 676, 222, { c: 'amb' });
  s += A(922, 52, 956, 66, { c: 'grn' }) + A(922, 222, 956, 222, { c: 'grn' });
  s += T(0, 290, 'Ubuntu server có thêm rsyslog chép journal ra /var/log/syslog, auth.log (ForwardToSyslog=yes) — hai nơi, CÙNG một dòng.', { fs: 14.5, c: 'mu' });
  return sv(1150, 298, s);
};

/* Slide 19 — 8 mức ưu tiên; -p X = X và NGHIÊM TRỌNG hơn */
const mucUT = () => {
  const L = [['0', 'emerg', 'máy không dùng được', 'dim'], ['1', 'alert', 'phải xử lý ngay', 'dim'], ['2', 'crit', 'hỏng nghiêm trọng', 'dim'],
    ['3', 'err', 'ERROR connection refused', 'red'], ['4', 'warning', "Failed … 'oom-kill'", 'amb'], ['5', 'notice', 'killed by the OOM killer', 'ora'],
    ['6', 'info', 'Started myapp.service', 'blu'], ['7', 'debug', 'chi tiết gỡ lỗi', 'dim']];
  let s = '';
  L.forEach(([n, name, ex, col], i) => {
    const y = i * 42;
    s += R(0, y, 400, 36, { c: col, r: 8, fill: i === 5 ? 'rgba(255,166,87,.14)' : '#111812', sw: i === 5 ? 3 : 2 });
    s += T(16, y + 25, n, { fs: 17, b: true, mono: true, c: col });
    s += T(44, y + 25, name, { fs: 15, b: true, mono: true });
    s += T(146, y + 24, ex, { fs: 13, c: 'mu', mono: i >= 3 && i <= 6 });
  });
  const br = (y2, x, t, col) => { s += `<path d="M${x} 4 L${x + 10} 4 L${x + 10} ${y2} L${x} ${y2}" stroke="${D[col]}" stroke-width="3" fill="none"/>` + `<path d="M${x + 10} ${y2} L494 ${y2}" stroke="${D[col]}" stroke-width="1.5" stroke-dasharray="4 4"/>` + T(500, y2 + 5, t, { fs: 14.5, c: col, b: true, mono: true }); };
  br(158, 410, '-p err', 'red');
  br(200, 432, '-p warning', 'amb');
  br(242, 454, '-p notice', 'ora');
  s += T(0, 360, '⇒ -p err BỎ SÓT dòng OOM (mức 5)', { fs: 15, c: 'ora', b: true });
  return sv(610, 368, s);
};

/* Slide 22 — ba cách xoay vòng một file đang mở (đo thật: số dòng sau 2 giây) */
const xoay = () => {
  let s = '';
  const col3 = [
    ['create, KHÔNG postrotate', 'red', [['app.log', 'inode MỚI', '0 dòng', 'red'], ['app.log.1', 'inode CŨ', '10 → 20 dòng', 'amb']], 'app vẫn ghi vào inode cũ'],
    ['copytruncate', 'amb', [['app.log', 'inode CŨ, cắt về 0', '10 dòng', 'grn'], ['app.log.1', 'bản CHÉP', '5 dòng', 'dim']], 'dòng ghi lúc đang chép có thể mất'],
    ['create + postrotate (USR1)', 'grn', [['app.log', 'inode MỚI', '10 dòng', 'grn'], ['app.log.1', 'inode CŨ, đã đóng', '5 dòng', 'dim']], 'app được BẢO mở lại file'],
  ];
  col3.forEach(([t, col, files, foot], i) => {
    const x = i * 390;
    s += R(x, 0, 370, 240, { c: col, r: 14, fill: 'rgba(255,255,255,.02)' });
    s += T(x + 18, 32, t, { fs: 16, b: true, c: col, mono: true });
    files.forEach(([f, d, n, fc], k) => {
      const y = 54 + k * 74;
      s += R(x + 18, y, 334, 60, { c: fc, r: 8 });
      s += T(x + 34, y + 26, f, { fs: 15, b: true, mono: true });
      s += T(x + 34, y + 47, d, { fs: 13, c: 'mu' });
      s += T(x + 338, y + 36, n, { fs: 15, b: true, a: 'end', mono: true, c: fc });
    });
    s += T(x + 18, 222, foot, { fs: 13.5, c: col });
  });
  return sv(1150, 244, s);
};

export const slides = S([
  cover({ t: 'Chương 10 — Đĩa, gói phần mềm &amp; log', sub: 'df · du · df -i · lsof +L1 · apt/dpkg · apt-mark · sha256sum · gpg · journalctl · logrotate · UTC và +07', chap: 'CHƯƠNG 10' }),

  { t: 'Bản đồ chương: ba việc bảo trì, ba cái bẫy lúc 3 giờ sáng', body: mindmap('Bảo trì máy', 'đo trước, xoá sau', [
    { t: '10.1 Đĩa đầy', d: 'df -h · df -i · du -d1 | sort -h · ncdu', c: 'lx' },
    { t: '10.1 Chỗ vô hình', d: 'file xoá còn mở · ổ gắn đè · 5% dự trữ', c: 'red' },
    { t: '10.2 apt / dpkg', d: 'update ≠ upgrade · remove/purge · dpkg -S/-L · hold', c: 'blu' },
    { t: '10.2 Tin ai?', d: 'signed-by · PPA · sha256sum -c · gpg --verify', c: 'vio' },
    { t: '10.3 journalctl', d: '-u · -p · --since · -f · -o json · -k', c: 'grn' },
    { t: '10.3 Log file', d: 'logrotate · postrotate/copytruncate · UTC vs +07', c: 'amb' },
  ]) },

  /* ───────────── 10.1 ───────────── */
  { t: 'df đếm khối đã cấp, du cộng file nó THẤY được', body: `
    ${dfDu()}
    ${two(
      term(['$ truncate -s 1G /tmp/sparse     # file thưa: có cỡ, chưa có khối', '$ ls -lh /tmp/sparse', '-rw-r--r-- 1 root root 1.0G … /tmp/sparse', '$ du -h /tmp/sparse; du -h --apparent-size /tmp/sparse', '= 0\t/tmp/sparse', '+ 1.0G\t/tmp/sparse'], { title: 'Ubuntu — chiều ngược lại: du < ls', fs: 12.5 }),
      box('info', 'Lệch theo chiều nào cũng có lý do. <code>df</code> &gt; <code>du</code>: có chỗ bị giữ mà không có tên. <code>ls</code> &gt; <code>du</code>: file thưa (ảnh đĩa VM, CSDL) — <code>--apparent-size</code> đếm cỡ khai báo, không phải khối thật.'), 'l')}` },

  { t: 'Đọc df từng cột — và df -i là con số thứ hai', body: `
    ${(() => {
      const L = '/dev/vda1   79G   75G  1.8G  98%  /';
      const at = (x, k = 0) => L.indexOf(x, k);
      return annot(L, [
        { from: 0, to: 9, t: 'thiết bị', d: 'ổ / phân vùng', c: 'blu' },
        { from: at('79G'), to: at('79G') + 3, t: 'Size', d: 'tổng', c: 'dim' },
        { from: at('75G'), to: at('75G') + 3, t: 'Used', d: 'khối đã cấp', c: 'lx' },
        { from: at('1.8G'), to: at('1.8G') + 4, t: 'Avail', d: 'cho người THƯỜNG', c: 'grn' },
        { from: at('98%'), to: at('98%') + 3, t: 'Use%', d: 'Used÷(Used+Avail)', c: 'red' },
        { from: L.length - 1, to: L.length, t: 'gắn ở', d: '', c: 'vio' },
      ], { fs: 30, rowH: 52 });
    })()}
    ${two(
      term(['$ df -h --output=source,fstype,size,avail,pcent,ipcent,target / /data', 'Filesystem     Type     Size Avail Use% IUse% Mounted on', 'overlay        overlay  911G  842G   3%    1% /', 'tmpfs          tmpfs     64M   64M   0%    1% /data', '$ df -BG --output=avail /data     # còn 2 MB thật', '!    1G      # -BG làm tròn LÊN', '$ df -BM --output=avail /data', '=    2M'], { title: 'Ubuntu — output thật', fs: 12.5 }),
      term(['$ df -i / /boot', 'Filesystem     Inodes IUsed  IFree IUse% Mounted on', '+ /dev/nvme0n1p1      0     0      0     - /', '/dev/sda2      131072    40 131032    1% /boot'], { title: 'Fedora 44 — btrfs cấp inode động: "-"', fs: 12.5 }) +
      box('warn', 'Chốt “còn ≥ 5 GB mới deploy” viết bằng <code>-BG</code> sẽ cho qua cả đĩa còn 4,01 GB. So bằng <code>-BM</code> (hoặc <code>-B1</code>).'), 'l')}` },

  { t: 'du -d1 | sort -h: lần theo nhánh lớn nhất', body: `
    ${duCay()}
    ${two(
      sh([
        ['sudo du -xh -d1 / 2>/dev/null | sort -h | tail', '-x: ở lại MỘT ổ'],
        ['sudo find / -xdev -type f -size +500M \\', 'file lớn đơn lẻ'],
        ['  -exec ls -lh {} + 2>/dev/null', ''],
        ['sudo ncdu -x /', 'cây tương tác, bấm ↑↓'],
      ], { fs: 13.5 }),
      term(['$ du -h -d1 var | sort      # thiếu -h', '165M\tvar/lib', '207M\tvar', '! 3.1M\tvar/cache', '! 40M\tvar/log'], { title: 'Ubuntu — sort thường so CHỮ: 3.1M "lớn" nhất', fs: 13 }), 'l')}` },

  { t: 'Hết inode: còn 64M trống mà không tạo nổi file', body: two(
    term(['$ df -h /data; df -i /data', 'Filesystem      Size  Used Avail Use% Mounted on', 'tmpfs            64M     0   64M   0% /data', 'Filesystem     Inodes IUsed IFree IUse% Mounted on', 'tmpfs            2000     1  1999    1% /data', '$ i=0; while touch sess/s$i; do i=$((i+1)); done', "! touch: cannot touch 'sess/s1998': No space left on device", '$ df -h /data | tail -1', '= tmpfs            64M     0   64M   0% /data', '$ df -i /data | tail -1', '! tmpfs            2000  2000     0  100% /data', '$ echo x > /data/moi.txt', '! bash: /data/moi.txt: No space left on device'], { title: 'Ubuntu — tmpfs 64M, 2000 inode, output thật', fs: 12.5 }),
    `${term(['$ du --inodes -x /data | sort -n | tail -3', '1999\t/data/sess', '2000\t/data'], { title: 'Thư mục nào giữ nhiều FILE nhất', fs: 13 })}
    ${table(['Hết byte', 'Hết inode'], [
      ['<code>df -h</code> ≈ 100%', '<code>df -h</code> trông ổn, <code>df -i</code> 100%'],
      ['vài file KHỔNG LỒ', 'hàng triệu file TÍ HON (phiên, cache, mail)'],
      ['xoá / cắt trắng file lớn', 'xoá THẬT NHIỀU file, hoặc tạo lại fs'],
    ], { sm: true })}
    ${box('tip', 'Phản xạ: “No space left” mà <code>df -h</code> còn trống ⇒ <code>df -i</code> trước mọi thứ khác.')}`, 'l') },

  { t: 'rm một file log đang mở: df không nhúc nhích', body: `
    ${moXoa()}
    ${two(
      term(['$ rm log/access.log; df -h /data | tail -1', '! tmpfs            64M   40M   24M  63% /data', '$ du -sh /data', '0\t/data', '$ lsof -nP +L1', 'COMMAND  PID USER FD TYPE DEVICE SIZE/OFF NLINK NODE NAME', '+ sleep   5748 root 3w REG 0,94  41943040     0 2003 /data/log/access.log (deleted)'], { title: 'Ubuntu — output thật', fs: 12 }),
      `${term(['$ truncate -s 0 /proc/5748/fd/3', '$ df -h /data | tail -1', '= tmpfs            64M     0   64M   0% /data'], { title: 'Cắt trắng QUA fd — không cần restart', fs: 12.5 })}
      ${box('good', 'File log đang mở: <code>truncate -s 0 file</code>, đừng <code>rm</code>. Đã lỡ <code>rm</code>: <code>reload</code> dịch vụ, hoặc cắt trắng qua <code>/proc/PID/fd/N</code>.')}`, 'l')}` },

  { t: 'Ổ gắn đè che dữ liệu cũ — mount --bind để nhìn xuống', body: `
    ${gandE()}
    ${two(
      term(['$ df -h /srv /srv/docker', 'Filesystem      Size  Used Avail Use% Mounted on', '! tmpfs           100M   30M   70M  30% /srv', 'tmpfs           200M  5.0M  195M   3% /srv/docker', '$ findmnt /srv/docker', 'TARGET      SOURCE FSTYPE OPTIONS', '/srv/docker tmpfs  tmpfs  rw,relatime,size=204800k'], { title: 'Ubuntu — hai tmpfs chồng nhau, output thật', fs: 12.5 }),
      box('info', 'Hay gặp nhất: app ghi vào <code>/var/lib/docker</code> (hoặc <code>/mnt/data</code>) trong lúc ổ dữ liệu CHƯA gắn — lúc khởi động, hoặc khi <code>/etc/fstab</code> sai. Gắn xong, vài chục GB nằm dưới, vô hình, vẫn tính vào <code>df /</code>.'), 'l')}` },

  { t: 'Sự cố thật: cache build 7,6 GB và Postgres cùng một đĩa', body: `
    ${suCo()}
    ${two(
      table(['Dọn theo thứ tự', 'Lệnh', 'Rủi ro'], [
        ['1 · Đo', '<code>df -h</code> · <code>df -i</code> · <code>du -xh -d1 | sort -h</code>', '+không xoá gì'],
        ['2 · Bộ đệm', '<code>apt clean</code> · <code>docker builder prune</code> · <code>journalctl --vacuum-size=500M</code>', '+tự sinh lại'],
        ['3 · Log', '<code>truncate -s 0</code> (không <code>rm</code>) rồi sửa logrotate', '+app không hay biết'],
        ['4 · Ảnh', '<code>docker image prune -a</code>', '!phải kéo lại'],
        ['5 · Bản cũ', '<code>find … -mtime +30</code> in ra TRƯỚC, rồi mới xoá', '!đọc trước'],
        ['6 · Dữ liệu', 'chỉ khi có bản sao lưu ĐÃ kiểm', '-cuối cùng'],
      ], { sm: true }),
      `${term(['$ docker system df', 'TYPE            TOTAL  ACTIVE  SIZE     RECLAIMABLE', 'Images          23     19      12.29GB  1.862GB (15%)', 'Containers      33     7       1.554GB  553.7MB (35%)', '! Local Volumes   71     22      8.939GB  4.174GB (46%)', 'Build Cache     19     15      1.267GB  179.1MB'], { title: 'Mac, Docker Desktop — output thật', fs: 12.5 })}
      ${sh([
        ['avail_mb=$(df -BM --output=avail / | tail -1 | tr -dc 0-9)', ''],
        ['(( avail_mb >= 5120 )) || die "còn ${avail_mb}MB — từ chối deploy"', ''],
      ], { fs: 12.5, so: false })}
      ${box('bad', 'Volume “reclaimable” = ổ của container ĐANG DỪNG — có thể là Postgres.')}`, '')}` },

  /* ───────────── 10.2 ───────────── */
  { t: 'apt đi 4 chặng: kho → danh mục → .deb → dpkg', body: `
    ${aptDuong()}
    ${two(
      term(['$ cat /etc/apt/sources.list.d/ubuntu.sources', 'Types: deb', 'URIs: http://ports.ubuntu.com/ubuntu-ports/', 'Suites: noble noble-updates noble-backports', 'Components: main universe restricted multiverse', '+ Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg'], { title: 'Ubuntu 24.04 — nguồn kiểu deb822', fs: 12.5 }),
      term(['$ cat /etc/apt/apt.conf.d/docker-clean', 'DPkg::Post-Invoke { "rm -f /var/cache/apt/archives/*.deb …" };', '$ du -sh /var/lib/apt/lists', '55M\t/var/lib/apt/lists'], { title: 'Ảnh ubuntu:24.04 tự dọn bộ đệm .deb', fs: 12.5 }), '')}` },

  { t: 'update làm mới danh mục — upgrade mới là cài', body: two(
    `${table(['Lệnh', 'Làm gì', 'Có gỡ gói?'], [
      ['<code>apt update</code>', 'tải danh mục mới (chặng 1→2)', '-không cài gì'],
      ['<code>apt upgrade</code>', 'nâng bản các gói ĐÃ có', 'không bao giờ'],
      ['!<code>apt full-upgrade</code>', 'nâng bản, chấp nhận gỡ/thêm gói', 'CÓ — đọc kỹ'],
      ['<code>-s upgrade</code>', 'mô phỏng: in kế hoạch, không đổi', '—'],
      ['<code>apt</code> vs <code>apt-get</code>', 'cho người (màu, tiến độ) vs cho script (ổn định)', '—'],
    ], { sm: true })}
    ${sh([
      ['export DEBIAN_FRONTEND=noninteractive', 'script: không hỏi, không treo'],
      ['apt-get update', ''],
      ['apt-get install -y --no-install-recommends jq', 'bỏ gói "gợi ý"'],
      ['apt-get -s upgrade | grep ^Inst', 'đọc trước khi làm'],
    ], { fs: 13.5 })}`,
    term(['$ apt update', 'Hit:1 http://ports.ubuntu.com/… noble InRelease', 'Hit:2 http://ports.ubuntu.com/… noble-updates InRelease', 'Hit:3 http://ports.ubuntu.com/… noble-backports InRelease', 'Hit:4 http://ports.ubuntu.com/… noble-security InRelease', '+ 3 packages can be upgraded. Run \'apt list --upgradable\' …', '$ apt list --upgradable', 'libaudit-common/noble-updates 1:3.1.2-2.1ubuntu0.1 all […]', 'libaudit1/noble-updates 1:3.1.2-2.1ubuntu0.1 arm64 […]', 'perl-base/noble-updates,noble-security 5.38.2-3.2ubuntu0.6 …', '# Hit = danh mục không đổi · Get = tải bản mới'], { title: 'Ubuntu — output thật', fs: 12 }), 'l') },

  { t: 'remove giữ cấu hình, purge xoá — dữ liệu thì không ai xoá', body: two(
    term(['$ apt-get remove -y nginx-light', 'The following packages were automatically installed and are no longer required:', 'Use \'apt autoremove\' to remove them.', 'Removing nginx-light (1.24.0-2ubuntu7.18) ...', '$ dpkg -l | grep nginx', '+ ii  nginx         1.24.0-2ubuntu7.18   # gói phụ thuộc còn nguyên', '+ ii  nginx-common  1.24.0-2ubuntu7.18', '$ apt-get autoremove --purge -y', 'Removing nginx (1.24.0-2ubuntu7.18) ...', 'Removing nginx-common (1.24.0-2ubuntu7.18) ...', '= Purging configuration files for nginx-common (1.24.0-2ubuntu7.18) ...', '$ ls -d /etc/nginx', "! ls: cannot access '/etc/nginx': No such file or directory"], { title: 'Ubuntu — output thật', fs: 12 }),
    `${table(['Hai chữ đầu dòng <code>dpkg -l</code>', 'Nghĩa (mong muốn · thực tế)'], [
      ['<code>ii</code>', 'muốn cài · đã cài và cấu hình xong'],
      ['!<code>rc</code>', 'đã gỡ · còn file CẤU HÌNH (sau <code>remove</code>)'],
      ['<code>un</code>', 'chưa từng cài (đo thật: <code>systemd-sysv</code>)'],
      ['-<code>iU</code> · <code>iF</code>', 'giải nén dở · cấu hình dở ⇒ <code>dpkg --configure -a</code>'],
    ], { sm: true })}
    ${table(['Lệnh', 'Chương trình', 'Cấu hình /etc', 'Dữ liệu /var/lib'], [
      ['<code>remove</code>', 'xoá', '+giữ (<code>rc</code>)', '+giữ'],
      ['<code>purge</code>', 'xoá', '-xoá', '+giữ'],
      ['<code>autoremove</code>', 'gỡ phụ thuộc mồ côi', 'tuỳ <code>--purge</code>', '+giữ'],
    ], { sm: true })}`, 'l') },

  { t: 'Gói nào sở hữu file này — bản nào, từ kho nào, có bị giữ?', body: two(
    `${term(['$ dpkg -S /usr/sbin/nginx /etc/nginx/nginx.conf', 'nginx: /usr/sbin/nginx', 'nginx-common: /etc/nginx/nginx.conf', '$ dpkg -S /usr/local/bin/foo; echo rc=$?', '! dpkg-query: no path found matching pattern /usr/local/bin/foo', 'rc=1          # /usr/local là của BẠN', '$ dpkg -L nginx | head -4', '/.', '/usr', '/usr/sbin', '/usr/sbin/nginx'], { title: 'Ubuntu — output thật', fs: 12.5 })}
    ${term(['$ apt-mark hold perl-base; apt-get -s upgrade', 'perl-base set on hold.', '+ The following packages have been kept back:', '+   perl-base', '2 upgraded, 0 newly installed, 0 to remove and 1 not upgraded.'], { title: 'hold: đứng yên — kể cả bản vá an ninh', fs: 12.5 })}`,
    `${term(['$ apt policy nginx', 'nginx:', '  Installed: 1.24.0-2ubuntu7.18', '  Candidate: 1.24.0-2ubuntu7.18', '  Version table:', '= *** 1.24.0-2ubuntu7.18 500', '        500 http://ports.ubuntu.com/… noble-updates/main arm64 Packages', '        500 http://ports.ubuntu.com/… noble-security/main arm64 Packages', '        100 /var/lib/dpkg/status', '     1.24.0-2ubuntu7 500', '        500 http://ports.ubuntu.com/… noble/main arm64 Packages'], { title: 'Ubuntu — output thật', fs: 12 })}
    ${table(['Đọc', 'Nghĩa'], [
      ['<code>***</code>', 'bản ĐANG cài'],
      ['<code>Candidate</code>', 'bản <code>install</code>/<code>upgrade</code> sẽ chọn'],
      ['<code>500</code> · <code>100</code>', 'độ ưu tiên kho: số lớn thắng; 100 = đã cài'],
    ], { sm: true })}`, '') },

  { t: 'Một chữ ký bảo vệ cả chuỗi — signed-by giới hạn khoá', body: `
    ${tinCay()}
    ${two(
      term(['$ gpgv --keyring /usr/share/keyrings/ubuntu-archive-keyring.gpg \\', '    …noble-security_InRelease', 'gpgv: Signature made Mon Sep 28 14:43:42 2026 UTC', 'gpgv:                using RSA key F6ECB3762474EDA9D21B7022871920D1991BC93C', '= gpgv: Good signature from "Ubuntu Archive Automatic Signing Key (2018) …"', '$ sha256sum jq_1.7.1-3ubuntu0.24.04.2_arm64.deb', 'd26709d728bf14016eac6ec5e56f88027b1751dffe1471e8cda3f6f8a0c8c1dc  jq_…deb', '$ apt-key list', '! Warning: apt-key is deprecated. Manage keyring files in trusted.gpg.d instead'], { title: 'Ubuntu — tự kiểm như apt kiểm, output thật', fs: 11.5 }),
      table(['Cách thêm kho', 'Đánh giá'], [
        ['<code>signed-by=…/x.gpg</code>', '+khoá chỉ ký được kho ĐÓ'],
        ['-<code>apt-key add</code> / <code>trusted.gpg.d</code>', '-khoá ký được MỌI gói, cả <code>openssh-server</code>'],
        ['<code>add-apt-repository ppa:…</code>', '!được — nhưng PPA = máy dựng của một người lạ, quyền root'],
        ['PPA an toàn hơn', 'của dự án chính thức · còn cập nhật · đúng bản Ubuntu · ghi lý do'],
      ], { sm: true }), 'l')}` },

  { t: 'File tải về: sha256sum -c, rồi gpg --verify file tổng', body: two(
    term(['$ curl -fLO …/jq-1.8.1/jq-linux-arm64', '$ curl -fLO …/jq-1.8.1/sha256sum.txt', '$ sha256sum -c --ignore-missing sha256sum.txt', '= jq-linux-arm64: OK', '$ printf x >> jq-linux-arm64          # giả lập file hỏng/bị tráo', '$ sha256sum -c --ignore-missing sha256sum.txt; echo exit=$?', '! jq-linux-arm64: FAILED', '! sha256sum: WARNING: 1 computed checksum did NOT match', 'exit=1', '# ─── Ubuntu ISO: file tổng CÓ chữ ký ───', '$ gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 843938DF…EFE21092', '$ gpg --verify SHA256SUMS.gpg SHA256SUMS', '= gpg: Good signature from "Ubuntu CD Image Automatic Signing Key (2012) …"', '+ gpg: WARNING: This key is not certified with a trusted signature!', '$ sed -i "s/^97f3/07f3/" SHA256SUMS; gpg --verify SHA256SUMS.gpg SHA256SUMS', '! gpg: BAD signature from "Ubuntu CD Image Automatic Signing Key (2012) …"'], { title: 'Ubuntu — output thật', fs: 12 }),
    `${table(['Kiểm', 'Chống được', 'Không chống được'], [
      ['<code style="white-space:nowrap">sha256sum -c</code>', 'tải hỏng, đứt giữa chừng', '-kẻ tráo CẢ file lẫn file tổng'],
      ['<code style="white-space:nowrap">gpg --verify</code>', 'file tổng bị sửa, máy chủ bị chiếm', '-khoá giả (phải so VÂN TAY)'],
    ], { sm: true })}
    ${box('warn', '“not certified” = gpg chưa biết khoá này của AI ⇒ so vân tay <code>8439 38DF … EFE2 1092</code> với trang hướng dẫn của Ubuntu.')}
    ${box('bad', '<b>Mac:</b> dùng <code>shasum -a 256 -c</code>. Đo thật: <code>sha256sum</code> BSD + <code>--ignore-missing</code>, không file nào có mặt ⇒ im lặng, <b>exit 0</b> (GNU: exit 1).')}`, 'l') },

  { t: 'Cùng việc, bốn trình quản lý gói', body: `
    ${table(['Việc', 'Ubuntu / Debian / WSL', 'Fedora / RHEL (dnf5)', 'macOS (Homebrew)'], [
      ['Làm mới danh mục', '<code>apt update</code>', '<code>dnf check-update</code> (tự làm mới)', '<code>brew update</code>'],
      ['Nâng cấp tất cả', '<code>apt upgrade</code>', '<code>dnf upgrade</code>', '<code>brew upgrade</code>'],
      ['Cài / gỡ', '<code>apt install X</code> · <code>apt purge X</code>', '<code>dnf install X</code> · <code>dnf remove X</code>', '<code>brew install X</code> · <code>brew uninstall X</code>'],
      ['File này của gói nào', '<code>dpkg -S /đường/dẫn</code>', '<code>rpm -qf /đường/dẫn</code>', '<code>ls -l $(which X)</code> (link vào Cellar)'],
      ['Gói cài những file nào', '<code>dpkg -L X</code>', '<code>rpm -ql X</code>', '<code>brew list X</code>'],
      ['Gói nào CÓ file này', '<code>apt-file search</code>', '<code>dnf provides</code>', '—'],
      ['Giữ phiên bản', '<code>apt-mark hold X</code>', '<code>dnf versionlock add X</code>', '<code>brew pin X</code>'],
      ['Lịch sử · hoàn tác', '<code>/var/log/apt/history.log</code>', '+<code>dnf history</code> · <code>history undo N</code>', '—'],
      ['Dọn bộ đệm', '<code>apt clean</code> · <code>autoremove</code>', '<code>dnf clean all</code> · <code>autoremove</code>', '<code>brew cleanup</code>'],
    ], { sm: true })}
    ${two(
      term(['$ rpm -qf /usr/bin/bash', 'bash-5.3.9-3.fc44.x86_64', '$ dnf history list | head -3', 'ID Command line                  Date and time       Altered', '30 dnf install -y tailscale      2026-09-19 13:15:21       1', '29 dnf install -y tesseract      2026-08-24 09:43:19       5'], { title: 'Fedora 44 — output thật', fs: 12 }),
      box('warn', 'Không <code>sudo pip install</code> / <code>sudo npm -g</code>: ghi vào <code>/usr</code> mà dpkg không biết. Python mới báo <code>externally-managed-environment</code> (PEP 668) ⇒ <code>venv</code> / <code>pipx</code>.'), 'l')}` },

  /* ───────────── 10.3 ───────────── */
  { t: 'Hai đường của log: journald hứng, file tự ghi', body: `
    ${haiDuong()}
    ${term(['$ ls -ld /var/log/journal /run/log/journal', 'drwxr-sr-x  2 root systemd-journal   40 … /run/log/journal', '= drwxr-sr-x+ 1 root systemd-journal 4096 … /var/log/journal     # có ⇒ log sống qua reboot'], { title: 'Ubuntu + systemd — output thật', fs: 12.5 })}` },

  { t: 'journalctl lọc theo 4 trục: unit · thời gian · mức · theo dõi', body: two(
    sh([
      ['journalctl -u myapp', 'một unit'],
      ['journalctl -u myapp -n 50', '50 dòng cuối'],
      ['journalctl -u myapp -f', 'theo dõi như tail -f'],
      ['journalctl -u myapp --since "10 min ago"', 'khung thời gian'],
      ['journalctl --since "2026-09-28 22:22" --until "22:23"', ''],
      ['journalctl -u myapp -p warning..err', 'KHOẢNG mức'],
      ['journalctl -u myapp -u nginx', 'nhiều -u = HOẶC'],
      ['journalctl -b -1 -p err', 'lần khởi động TRƯỚC'],
      ['journalctl -k --since "30 min ago"', 'chỉ nhân (OOM, I/O)'],
      ['journalctl -t deploy', 'thẻ của logger -t'],
      ['journalctl -u myapp -f | grep --line-buffered ERR', 'Bài 3.2'],
    ], { fs: 13 }),
    `${term(['$ journalctl -u myapp -n 7 --no-pager', '! Sep 28 16:04:00 vps python3[350]: ERROR connection refused (db:5432)', 'Sep 28 16:04:01 vps systemd[1]: myapp.service: Main process exited, …', "+ Sep 28 16:04:01 vps systemd[1]: myapp.service: Failed with result …", 'Sep 28 16:04:04 vps systemd[1]: myapp.service: Scheduled restart …', 'Sep 28 16:04:04 vps systemd[1]: Started myapp.service - Demo app cho …', 'Sep 28 16:04:04 vps python3[353]: listening on 127.0.0.1:3000', '+ Sep 28 16:04:05 vps python3[353]: slow query: 2300 ms (SELECT …'], { title: 'Ubuntu + systemd — output thật (cắt cuối dòng)', fs: 11.5 })}
    ${term(['$ journalctl -u myapp + -u nginx', '! "+" can only be used between terms', '$ journalctl _SYSTEMD_UNIT=myapp.service \\', '    + SYSLOG_IDENTIFIER=deploy      # chạy được'], { title: '"+" (HOẶC) chỉ đặt giữa các TRƯỜNG=giá trị', fs: 12 })}`, '') },

  { t: 'Mức ưu tiên 0–7: -p err bỏ sót cả lần bị OOM giết', body: two(
    mucUT(),
    `${term(['$ journalctl -u anram -o json | jq -r "[.PRIORITY,.MESSAGE]|@tsv"', '6\tStarted anram.service - Tien trinh an RAM (demo OOM).', '6\tbat dau nap du lieu', '+ 5\tanram.service: A process of this unit has been killed …', "4\tanram.service: Main process exited, code=killed, …", "4\tanram.service: Failed with result 'oom-kill'.", '$ journalctl -u anram -p err', '! -- No entries --', '$ journalctl -k | grep "Killed process"', '= … kernel: Memory cgroup out of memory: Killed process 64868 (python3) …'], { title: 'Ubuntu + systemd — MemoryMax=60M, output thật', fs: 12 })}
    ${box('tip', 'App bị GIẾT thì không kịp ghi gì. Log dừng giữa chừng, không lỗi ⇒ <code>journalctl -k</code> (nhân ghi OOM ở mức err) và <code>-u</code> không kèm <code>-p</code>.')}`, 'r') },

  { t: '-o json: mỗi dòng log là một bản ghi có trường', body: two(
    term(['$ journalctl -t deploy -p err -o json-pretty -n 1', '{', '        "__REALTIME_TIMESTAMP" : "1790611498019750",', '        "_EXE" : "/usr/bin/logger",', '        "SYSLOG_IDENTIFIER" : "deploy",', '        "_HOSTNAME" : "vps",', '        "_BOOT_ID" : "6057b14370764ba893825ba704227696",', '        "MESSAGE" : "rollback: healthcheck 502",', '        "_PID" : "362",', '        "_TRANSPORT" : "syslog",', '        "PRIORITY" : "3",', '        … (26 trường)', '}'], { title: 'Ubuntu + systemd — output thật (lọc bớt trường)', fs: 12.5 }),
    `${table(['Định dạng <code>-o</code>', 'Dùng khi'], [
      ['<code>short</code> (mặc định)', 'đọc bằng mắt'],
      ['<code>short-iso</code>', 'có năm + múi giờ: <code>2026-09-28T15:22:54+00:00</code>'],
      ['<code>cat</code>', 'chỉ MESSAGE — đưa vào <code>grep</code>/<code>sort</code>'],
      ['<code>json</code> · <code>json-pretty</code>', 'mỗi dòng một JSON — đưa vào <code>jq</code>'],
      ['<code>verbose</code>', 'xem MỌI trường để biết lọc bằng gì'],
    ], { sm: true })}
    ${sh([
      ['journalctl _PID=163', 'mọi thứ PID đó ghi'],
      ['journalctl -F _SYSTEMD_UNIT', 'liệt kê giá trị một trường'],
      ['journalctl -u myapp -o json --since today \\', ''],
      ['  | jq -r "select(.PRIORITY==\\"3\\") | .MESSAGE" \\', ''],
      ['  | sort | uniq -c | sort -rn', 'đếm lỗi theo nội dung'],
    ], { fs: 13 })}`, '') },

  { t: 'Journal cần trần: mặc định 10% đĩa, tối đa 4G', body: two(
    `${term(['$ journalctl --disk-usage', 'Archived and active journals take up 8.0M in the file system.', '$ journalctl --vacuum-size=1M', 'Deleted archived journal /var/log/journal/…/system@….journal (4.4M).', '= Vacuuming done, freed 4.4M of archived journals from /var/log/journal/….', '# không có drop-in nào — mặc định:', '$ journalctl -u systemd-journald | grep "System Journal"', '+ … System Journal (/var/log/journal/…) is 8.0M, max 4.0G, 3.9G free.', '# thêm drop-in 10-gioi-han.conf rồi restart:', '= … System Journal (/var/log/journal/…) is 8.0M, max 500.0M, 492.0M free.'], { title: 'Ubuntu + systemd — output thật', fs: 12 })}`,
    `${sh([
      ['# /etc/systemd/journald.conf.d/10-gioi-han.conf', ''],
      ['[Journal]', ''],
      ['SystemMaxUse=500M', 'trần tổng'],
      ['MaxRetentionSec=1month', 'giữ tối đa 1 tháng'],
    ], { fs: 14, so: false })}
    ${sh([
      ['sudo systemctl restart systemd-journald', 'áp dụng'],
      ['systemd-analyze cat-config systemd/journald.conf', 'xem cấu hình GỘP'],
      ['sudo journalctl --vacuum-time=14d', 'dọn ngay, theo tuổi'],
    ], { fs: 13 })}
    ${box('warn', 'Mặc định = 10% cỡ hệ thống file, <b>chặn trên 4G</b> (journald.conf(5)). Thiếu <code>/var/log/journal</code> ⇒ journal nằm trong RAM, reboot là mất bằng chứng.')}`, '') },

  { t: 'logrotate đổi tên file — app vẫn ghi vào inode cũ', body: `
    ${xoay()}
    ${two(
      sh([
        ['/srv/app/log/app.log {', ''],
        ['    daily', 'hoặc: size 100M'],
        ['    rotate 14', 'giữ 14 bản = trần dung lượng'],
        ['    compress', ''],
        ['    delaycompress', 'bản .1 chưa nén'],
        ['    missingok', ''],
        ['    notifempty', ''],
        ['    create 0640 root root', ''],
        ['    postrotate', ''],
        ['        kill -USR1 "$(cat /run/app.pid)"', 'bảo app MỞ LẠI'],
        ['    endscript', ''],
        ['}', ''],
      ], { fs: 12.5 }),
      `${term(['$ logrotate -d -s /tmp/st lr-create.conf', '! warning: logrotate in debug mode does nothing except printing debug messages!', 'considering log /srv/app/log/app.log', '  log does not need rotating (log size is below the \'size\' threshold)', '$ logrotate -f -v -s /tmp/st3 lr-post.conf', 'renaming /srv/app/log/app.log to /srv/app/log/app.log.1', 'creating new /srv/app/log/app.log mode = 0640 uid = 0 gid = 0', '= running postrotate script'], { title: 'Ubuntu, logrotate 3.21 — output thật', fs: 11.5 })}`, 'r')}` },

  { t: 'Container giờ UTC, máy +07: lệch đúng 7 tiếng', body: two(
    `${term(['$ date                                  # trên Mac', 'Mon Sep 28 22:23:52 +07 2026', '$ docker run --rm ubuntu:24.04 date', '+ Mon Sep 28 15:23:52 UTC 2026', '# ảnh ubuntu:24.04 KHÔNG có tzdata:', '$ docker run --rm -e TZ=Asia/Ho_Chi_Minh ubuntu:24.04 date', '! Mon Sep 28 15:23:57 Asia 2026     # vẫn UTC, không báo lỗi', '$ … -e TZ=UTC-7 …', '+ Mon Sep 28 22:23:57 UTC 2026      # POSIX: dấu NGƯỢC, nhãn sai', '$ … -e TZ=UTC+7 …', '! Mon Sep 28 08:23:57 UTC 2026      # lệch 14 tiếng'], { title: 'Mac + Ubuntu — output thật', fs: 12 })}`,
    `${term(['$ journalctl -t deploy -n 1', 'Sep 28 22:22:57 vps deploy[168]: rollback: healthcheck 502', '$ journalctl -t deploy -n 1 --utc', 'Sep 28 15:22:57 vps deploy[168]: rollback: healthcheck 502', '$ journalctl -t deploy -n 1 -o short-iso', '= 2026-09-28T22:22:57+07:00 vps deploy[168]: rollback: …'], { title: 'Ubuntu + systemd, múi giờ máy = Asia/Ho_Chi_Minh', fs: 12 })}
    ${table(['Chỗ', 'Làm đúng'], [
      ['Dockerfile', 'cài <code>tzdata</code> rồi <code>ENV TZ=Asia/Ho_Chi_Minh</code>'],
      ['Máy chủ', '<code>timedatectl set-timezone Asia/Ho_Chi_Minh</code>'],
      ['cron trong container', 'giờ UTC ⇒ “7 giờ sáng” = <code>0 0 * * *</code>'],
      ['Log / CSDL', 'LƯU UTC, chỉ HIỂN THỊ giờ địa phương'],
    ], { sm: true })}`, '') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 10', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['“No space left” mà <code>df -h</code> còn trống', 'hết INODE', '<code>df -i</code> · <code>du --inodes</code>'],
    ['<code>rm</code> file 30 GB, <code>df</code> không đổi', 'tiến trình còn giữ file mở', '<code>lsof +L1</code> · <code>truncate -s 0</code>'],
    ['<code>df</code> và <code>du</code> lệch hàng chục GB', 'dữ liệu nằm dưới điểm gắn', '<code>mount --bind / /mnt/goc</code>'],
    ['Chốt “≥ 5 GB” cho qua đĩa gần đầy', '<code>df -BG</code> làm tròn LÊN', '<code>df -BM</code> / <code>-B1</code>'],
    ['<code>docker system prune --volumes</code> mất CSDL', 'volume của container ĐANG DỪNG', '<code>image prune -a</code> · <code>builder prune</code>'],
    ['Gói không bao giờ lên bản vá', 'quên <code>apt-mark hold</code>', '<code>apt-mark showhold</code> khi rà máy'],
    ['Script cài gói treo mãi', 'gói hỏi câu hỏi', '<code>DEBIAN_FRONTEND=noninteractive</code> · <code>apt-get -y</code>'],
    ['<code>-p err</code> không thấy gì mà app chết', 'OOM ghi ở mức notice/nhân', '<code>journalctl -k</code> · bỏ <code>-p</code>'],
    ['Sau logrotate, <code>app.log</code> rỗng mãi', 'app ghi vào inode CŨ', '<code>postrotate</code> gửi USR1 · <code>copytruncate</code>'],
    ['Cron trong container chạy lệch 7 tiếng', 'giờ UTC · thiếu tzdata', 'cài <code>tzdata</code> + <code>TZ</code>'],
  ], { sm: true }) },

  { t: 'Ubuntu · Fedora · macOS · WSL: cùng việc, khác lệnh', body: table(['Việc', 'Ubuntu 24.04 / WSL2', 'Fedora 44', 'macOS (đo trên Mac M1)'], [
    ['<code>du</code> theo tầng', '<code>du -h --max-depth=1</code> = <code>-d1</code>', 'như Ubuntu', '-<code>--max-depth</code>: unrecognized · dùng <code>du -h -d 1</code>'],
    ['Đếm inode', '<code>df -i</code> · <code>du --inodes</code>', '!btrfs: <code>df -i</code> ra 0 và “-”', '<code>df</code> in sẵn cột <code>iused</code>'],
    ['Ổ thật', '<code>/</code> trên <code>/dev/vda1</code>…', '<code>/</code> và <code>/home</code> CÙNG một btrfs', '!<code>/</code> là snapshot hệ thống: xem <code>/System/Volumes/Data</code>'],
    ['Checksum', '<code>sha256sum -c</code>', 'như Ubuntu', '+<code>shasum -a 256 -c</code> (<code>sha256sum</code> BSD lệch mã thoát)'],
    ['Gói', '<code>apt</code> / <code>dpkg</code>', '<code>dnf</code> / <code>rpm</code>', '<code>brew</code> (Homebrew 7.0)'],
    ['Log hệ thống', '<code>journalctl</code> + <code>/var/log</code>', '<code>journalctl</code> (1.7G trên máy thật)', '-không journalctl: <code>log show --last 1h --predicate …</code>'],
    ['Xoay vòng log', 'logrotate 3.21', 'logrotate 3.22', 'newsyslog'],
    ['Đĩa WSL2', '!<code>df</code> báo cỡ TỐI ĐA của ổ ảo (mặc định 1 TB), không phải chỗ trống thật của C:', '—', '—'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 10 (1/2): đĩa và gói', body: two(
    sh([
      ['df -h · df -i · df -hT', 'byte · inode · loại fs'],
      ['df -BM --output=avail /', 'số cho script'],
      ['sudo du -xh -d1 / 2>/dev/null | sort -h', 'lần theo nhánh lớn'],
      ['du --inodes -x /var | sort -n | tail', 'thư mục nhiều file'],
      ['find / -xdev -type f -size +500M', 'file lớn đơn lẻ'],
      ['sudo ncdu -x /', 'tương tác'],
      ['sudo lsof +L1', 'đã xoá còn mở'],
      ['truncate -s 0 file.log', 'cắt trắng, đừng rm'],
      ['lsblk · findmnt · cat /etc/fstab', 'ổ và điểm gắn'],
      ['mount --bind / /mnt/goc', 'nhìn dưới điểm gắn'],
      ['docker system df · builder prune', 'Docker chiếm gì'],
    ], { fs: 14.5 }),
    sh([
      ['apt update · apt list --upgradable', 'làm mới · xem'],
      ['apt-get -s upgrade', 'mô phỏng'],
      ['apt install -y --no-install-recommends X', 'cài gọn'],
      ['apt remove X · apt purge X', 'giữ / xoá cấu hình'],
      ['apt autoremove --purge · apt clean', 'dọn'],
      ['apt policy X · apt show X', 'bản nào, kho nào'],
      ['dpkg -S /path · dpkg -L X', 'file ⇄ gói'],
      ['apt-mark hold X · apt-mark showhold', 'giữ bản'],
      ['sudo fuser -v /var/lib/dpkg/lock-frontend', 'ai giữ khoá'],
      ['sudo dpkg --configure -a', 'hoàn tất phần dở'],
      ['grep -r ^deb /etc/apt/sources.list*', 'đang tin kho nào'],
    ], { fs: 14.5 })) },

  { t: 'Bảng tra nhanh Chương 10 (2/2): checksum và log', body: two(
    sh([
      ['sha256sum file', 'in mã băm'],
      ['sha256sum -c SHA256SUMS', 'kiểm cả danh sách'],
      ['sha256sum -c --ignore-missing SUMS', 'chỉ file đang có'],
      ['echo "HASH  file" | sha256sum -c -', 'so một mã dán tay'],
      ['shasum -a 256 -c SUMS', 'macOS'],
      ['gpg --recv-keys VÂN_TAY', 'lấy khoá'],
      ['gpg --verify SUMS.gpg SUMS', 'kiểm chữ ký'],
      ['logger -t deploy -p user.err "…"', 'ghi vào journal'],
      ['sudo logrotate -d /etc/logrotate.d/x', 'chạy thử'],
      ['sudo logrotate -f -v /etc/logrotate.d/x', 'ép xoay ngay'],
      ['TZ=Asia/Ho_Chi_Minh date', 'cần tzdata'],
    ], { fs: 14.5 }),
    sh([
      ['journalctl -u X -n 50 --no-pager', 'dòng cuối'],
      ['journalctl -u X -f', 'theo dõi'],
      ['journalctl -u X --since "30 min ago"', 'khung giờ'],
      ['journalctl -p err -b · -b -1', 'lỗi · lần boot trước'],
      ['journalctl -k | grep -i oom', 'nhân: OOM, I/O'],
      ['journalctl -o cat · -o json | jq', 'chỉ chữ · có trường'],
      ['journalctl _PID=N · -t TAG', 'theo trường'],
      ['journalctl --utc · -o short-iso', 'múi giờ rõ ràng'],
      ['journalctl --disk-usage', 'journal chiếm bao nhiêu'],
      ['sudo journalctl --vacuum-size=500M', 'dọn ngay'],
      ['journalctl --list-boots', 'các lần khởi động'],
    ], { fs: 14.5 })) },

  { t: 'Thực hành Chương 10 (45 phút): một VPS giả, năm việc', body: `
    ${steps([
      ['Container có <code>--tmpfs /data:size=64m,nr_inodes=2000</code>; tạo file đến khi “No space left”', 'chứng minh bằng <code>df -h</code> + <code>df -i</code> đó là inode'],
      ['Ghi file 40M, giữ mở bằng <code>sleep 3000 3&gt;&gt;file &amp;</code>, <code>rm</code> nó', 'tìm bằng <code>lsof +L1</code>, trả chỗ bằng <code>truncate</code> qua <code>/proc</code>'],
      ['<code>apt-get install jq</code>; <code>dpkg -S $(which jq)</code>, <code>apt policy jq</code>, <code>apt-mark hold</code> rồi <code>-s upgrade</code>', 'đọc được từng dòng output'],
      ['Tải <code>jq</code> + <code>sha256sum.txt</code> từ GitHub, <code>sha256sum -c --ignore-missing</code>; sửa 1 byte, kiểm lại', 'thấy OK rồi FAILED, exit 1'],
      ['Script ghi log bằng fd 3; logrotate <code>create</code> không postrotate ⇒ đếm dòng; thêm postrotate gửi USR1', 'app.log hết rỗng'],
    ])}
    ${box('good', '<b>Đạt khi:</b> có output thật cho cả 5 bước, giải thích được <code>df</code> ≠ <code>du</code> ở bước 2, và đã <code>docker rm -f</code> container.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
