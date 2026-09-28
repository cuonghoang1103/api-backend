/**
 * Linux & Bash · Deck lx-12 — Chương 12: Chẩn đoán một máy chủ thật.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu" = container ubuntu:24.04 (arm64, bash 5.2.21, procps-ng 4.0.4, util-linux 2.39.3, curl 8.5.0,
 *                OpenSSL 3.0.13, nginx 1.24.0, python3 3.12) tên lx12-u, --memory 512m. Sự cố được DỰNG LẠI thật:
 *                đĩa đầy (tmpfs 40M), inode cạn (tmpfs nr_inodes=2000), file đã xoá còn mở, cổng bị chiếm,
 *                refused/timeout/reset/tên không có, nginx 502/504, CPU 100% (regex backtracking), chờ đĩa (dd
 *                O_DIRECT), OOM 137, hàng chờ accept đầy, namei, CRLF, tiến trình chạy bản cũ, TLS + faketime,
 *                zombie do PID 1 là `sleep infinity`.
 *   • "Ubuntu + systemd" = container ubuntu:24.04 chạy systemd 255 thật (--privileged, ngắn hạn, lx12-sd):
 *                203/EXEC · 200/CHDIR · 217/USER · 1/FAILURE, cuộc quét 60 giây, sshd "bad ownership or modes".
 *   • "Docker" = Docker 29.8 trên Mac: OOMKilled/137, Restarting (1), exit 127/255, --init dọn zombie.
 *   • "Mac" = Mac M1, macOS 27: load 462 trên 10 nhân mà CPU rảnh 34%, ổ đĩa không phân biệt hoa/thường, date -j.
 *
 * Hình tự vẽ (SVG nội tuyến): cay() cây quyết định chết/chậm/lạ · vong() vòng lặp 6 bước · mocTg() mốc thời gian ·
 * bonKieu() refused/timeout/reset/tên · taiSvg() load = hàng chạy + hàng chờ D · pha() curl -w chia pha ·
 * cuMoi() tiến trình giữ bản cũ · zombieSvg() cha không wait() · annot() (chép lx-09).
 */
import { S, cover, sh, perms, term, mindmap, diagram, cards, box, steps, table, two, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-12', code: 'LINUX · CHƯƠNG 12', title: 'Chẩn đoán máy chủ', sub: 'Linux & Bash · Chương 12' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}</style>';

/** annot(str, segs) — một dòng chữ đơn cách, ngoặc màu + nhãn dưới từng đoạn (chép lx-09). */
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

/* Slide 3 — cây quyết định: triệu chứng → nhánh → câu hỏi → lệnh đầu tiên */
const cay = () => {
  let s = '';
  s += R(455, 0, 240, 56, { c: 'lx', fill: 'rgba(245,183,0,.14)', r: 28 }) + T(575, 35, '🚨 “Web có vấn đề”', { fs: 19, b: true, a: 'middle' });
  const nh = [
    { x: 0, t: 'NÓ CHẾT', d: 'không trả lời / lỗi ngay', col: 'red', bai: 'Bài 12.2', la: [
      ['unit lên không?', 'systemctl status X'],
      ['có ai nghe cổng?', 'ss -tlnp'],
      ['refused / timeout?', 'nc -vz -w3 host port'],
      ['proxy báo gì?', 'tail error.log (502)'],
      ['container quay vòng?', 'docker inspect …ExitCode'],
    ] },
    { x: 395, t: 'NÓ CHẬM', d: 'trả lời, nhưng lâu', col: 'amb', bai: 'Bài 12.3', la: [
      ['load so với nproc?', 'uptime; nproc'],
      ['tính hay chờ?', 'vmstat 1 5 (us / wa)'],
      ['RAM thật còn?', 'free -h → available'],
      ['đĩa / inode đầy?', 'df -h; df -i'],
      ['chờ ai?', "curl -w · ss -tan"],
    ] },
    { x: 790, t: 'NÓ LẠ', d: 'lẽ ra phải chạy', col: 'vio', bai: 'Bài 12.4', la: [
      ['quyền đúng mà denied?', 'namei -l đường-dẫn'],
      ['file có mà not found?', 'head -1 f | cat -A'],
      ['deploy rồi vẫn cũ?', 'ls -l /proc/PID/cwd'],
      ['lỗi chứng chỉ?', 'date; openssl x509 -dates'],
      ['đống <defunct>?', "ps -eo stat,pid,ppid"],
    ] },
  ];
  nh.forEach((b) => {
    s += A(575, 58, b.x + 180, 92, { c: b.col, sw: 2.5 });
    s += R(b.x, 96, 360, 62, { c: b.col, fill: `color-mix(in srgb,${D[b.col]} 16%,#0d130f)` });
    s += T(b.x + 18, 124, b.t, { fs: 20, b: true, c: b.col }) + T(b.x + 18, 148, b.d, { fs: 14.5, c: 'mu' });
    s += T(b.x + 342, 124, b.bai, { fs: 14, a: 'end', c: b.col });
    b.la.forEach(([q, cmd], i) => {
      const y = 176 + i * 58;
      s += `<path d="M${b.x + 14} ${y - 18} L${b.x + 14} ${y + 22} L${b.x + 26} ${y + 22}" stroke="${D[b.col]}" stroke-width="2" fill="none" opacity=".6"/>`;
      s += R(b.x + 28, y, 332, 48, { c: 'bd', r: 8, sw: 1.5 });
      s += T(b.x + 40, y + 20, q, { fs: 14.5, c: 'tx' }) + T(b.x + 40, y + 40, cmd, { fs: 13.5, c: b.col, mono: true });
    });
  });
  s += T(575, 478, 'Chưa biết nhánh nào? Chạy cuộc quét 60 giây TRƯỚC — nó chỉ đọc, và nó chọn nhánh giúp bạn.', { fs: 15, a: 'middle', c: 'lx' });
  return sv(1150, 488, s);
};

/* Slide 4 — vòng lặp 6 bước */
const vong = () => {
  const B = [
    [40, 30, '1 · Quan sát', 'quét 60 giây, CHƯA sửa gì', 'blu'],
    [420, 30, '2 · Mốc thời gian', 'bắt đầu lúc nào? trước đó đổi gì?', 'tea'],
    [800, 30, '3 · Thu hẹp', 'máy · mạng · app · dữ liệu', 'grn'],
    [800, 230, '4 · MỘT giả thuyết', 'nói được thành một câu', 'lx'],
    [420, 230, '5 · Đổi MỘT thứ', 'ghi lại lệnh, rồi kiểm lại', 'amb'],
    [40, 230, '6 · Sửa gốc + “vì sao im?”', 'cảnh báo, logrotate, việc sau', 'vio'],
  ];
  let s = '';
  B.forEach(([x, y, t, d, col]) => {
    s += R(x, y, 310, 92, { c: col, fill: `color-mix(in srgb,${D[col]} 12%,#0d130f)` });
    s += T(x + 18, y + 38, t, { fs: 19, b: true, c: col }) + T(x + 18, y + 68, d, { fs: 15, c: 'mu' });
  });
  s += A(352, 76, 416, 76, { c: 'tea' }) + A(732, 76, 796, 76, { c: 'grn' });
  s += A(955, 124, 955, 226, { c: 'lx' }) + A(798, 276, 734, 276, { c: 'amb' }) + A(418, 276, 354, 276, { c: 'vio' });
  s += `<path d="M1112 300 L1135 300 L1135 390 L20 390 L20 60 L36 60" stroke="${D.red}" stroke-width="2.5" fill="none" stroke-dasharray="8 6" marker-end="url(#m-red)"/>`;
  s += T(578, 380, 'giả thuyết SAI (kiểm xong không khớp) ⇒ quay về bước 1 với dữ kiện mới, đừng đổi thêm thứ thứ hai', { fs: 14.5, a: 'middle', c: 'red' });
  s += T(578, 190, '“khởi động lại thử xem” nhảy thẳng tới bước 5 — và xoá sạch bằng chứng của bước 1', { fs: 15, a: 'middle', c: 'lx' });
  return sv(1150, 400, s);
};

/* Slide 7 — mốc thời gian của một sự cố */
const mocTg = () => {
  const X = (m) => 60 + (m - 15) * 52; // phút 15 = 13:55 … phút 35 = 14:15
  let s = '';
  s += `<path d="M40 150 L1120 150" stroke="${D.dim}" stroke-width="3"/>`;
  [[15, '13:55'], [20, '14:00'], [25, '14:05'], [30, '14:10'], [35, '14:15']].forEach(([m, t]) => {
    s += `<path d="M${X(m)} 144 L${X(m)} 156" stroke="${D.dim}" stroke-width="2"/>` + T(X(m), 176, t, { fs: 14, a: 'middle', c: 'mu', mono: true });
  });
  // [phút, trên/dưới, chữ, nguồn, màu, tầng, hướng chữ]
  const ev = [
    [24.97, 'up', '14:04:58 sudo systemctl restart backend', 'nguồn: journalctl _COMM=sudo', 'blu', 0, 'end'],
    [25.18, 'dn', '14:05:11 deploy 8fbd829 (cache TTL 30d)', 'nguồn: git log --date=iso', 'grn', 1, 'end'],
    [27.03, 'up', '14:07:02 sudo nano sites-enabled/app.conf', 'nguồn: ls -lt /etc/nginx/…', 'amb', 1, 'start'],
    [27.2, 'dn', '14:07 người dùng báo 502', 'TRIỆU CHỨNG', 'red', 0, 'start'],
  ];
  ev.forEach(([m, side, t, d, col, lv, a]) => {
    const x = X(m), up = side === 'up';
    const y = up ? 96 - lv * 58 : 214 + lv * 58;
    s += `<circle cx="${x}" cy="150" r="8" fill="${D[col]}"/>`;
    s += `<path d="M${x} ${up ? 142 : 158} L${x} ${up ? y + 26 : y - 18}" stroke="${D[col]}" stroke-width="2" stroke-dasharray="4 4"/>`;
    const tx = a === 'end' ? x - 12 : x + 12;
    s += T(tx, y, t, { fs: 15.5, b: true, c: col, mono: true, a }) + T(tx, y + 20, d, { fs: 14, c: 'mu', a });
  });
  s += R(60, 318, 1060, 44, { c: 'lx', fill: 'rgba(245,183,0,.08)', r: 8 });
  s += T(590, 346, 'Triệu chứng 14:07 + file sửa 14:07:02 ⇒ nghi phạm số 1 — kiểm bằng nginx -t và diff trong 10 giây', { fs: 15.5, a: 'middle', c: 'lx', b: true });
  return sv(1150, 368, s);
};

/* Slide 11 — bốn kiểu "không kết nối được": gói tin dừng ở đâu */
const bonKieu = () => {
  const rows = [
    ['Name or service not known', 'curl: (6) · nc: getaddrinfo', 'vio', 'dns', 'chưa có IP — chưa gửi gói nào', 'DNS: dig · getent · /etc/hosts'],
    ['Connection refused', 'curl: (7) · nc … failed', 'red', 'rst', 'máy TRẢ LỜI “không ai nghe” (RST)', 'MÁY CHỦ: ss -tlnp · unit'],
    ['Connection timed out', 'curl: (28) · nc -w3 … timed out', 'amb', 'drop', 'không ai trả lời — gói rơi vào hố', 'MẠNG: tường lửa · sai IP · máy tắt'],
    ['Connection reset by peer', 'curl: (56) · nc -z vẫn “succeeded”!', 'pnk', 'reset', 'kết nối XONG rồi mới bị cắt', 'APP / PROXY: log ở đúng giây đó'],
  ];
  let s = '';
  s += T(160, 18, 'máy khách', { fs: 14, a: 'middle', c: 'mu' }) + T(560, 18, 'đường đi', { fs: 14, a: 'middle', c: 'mu' }) + T(800, 18, 'máy chủ', { fs: 14, a: 'middle', c: 'mu' });
  rows.forEach(([t, d, col, kind, why, fix], i) => {
    const y = 26 + i * 84;
    s += R(0, y, 330, 76, { c: col, r: 10 });
    s += T(14, y + 25, t, { fs: 16, b: true, c: col }) + T(14, y + 47, d, { fs: 13, c: 'mu', mono: true }) + T(14, y + 67, why, { fs: 13.5, c: 'tx' });
    s += R(740, y + 8, 120, 60, { c: 'dim', r: 8, sw: 1.5 }) + T(800, y + 43, '🖥 :3000', { fs: 14, a: 'middle', mono: true });
    if (kind === 'dns') {
      s += `<path d="M336 ${y + 42} L420 ${y + 42}" stroke="${D.vio}" stroke-width="3"/>` + T(430, y + 48, '✗ dừng ở tên', { fs: 15, c: 'vio', b: true });
    } else if (kind === 'rst') {
      s += A(336, y + 32, 734, y + 32, { c: 'dim' }) + T(535, y + 26, 'SYN →', { fs: 13, a: 'middle', c: 'mu', mono: true });
      s += A(734, y + 56, 336, y + 56, { c: 'red' }) + T(535, y + 74, '← RST (ngay, 0 ms)', { fs: 13.5, a: 'middle', c: 'red', mono: true });
    } else if (kind === 'drop') {
      s += `<path d="M336 ${y + 42} L600 ${y + 42}" stroke="${D.amb}" stroke-width="3" stroke-dasharray="8 6"/>` + T(612, y + 48, '🕳 DROP', { fs: 15, c: 'amb', b: true });
      s += T(470, y + 70, '… im lặng tới hết giờ', { fs: 13, a: 'middle', c: 'mu' });
    } else {
      s += A(336, y + 30, 734, y + 30, { c: 'grn' }) + T(535, y + 24, 'bắt tay xong ✓', { fs: 13, a: 'middle', c: 'grn' });
      s += A(734, y + 56, 336, y + 56, { c: 'pnk' }) + T(535, y + 74, '← RST giữa cuộc trò chuyện', { fs: 13.5, a: 'middle', c: 'pnk' });
    }
    s += T(876, y + 43, fix, { fs: 13.5, c: col });
  });
  return sv(1150, 360, s);
};

/* Slide 15 — load average = hàng đang chạy + hàng chờ D */
const taiSvg = () => {
  let s = '';
  s += R(0, 10, 540, 250, { c: 'lx', fill: 'rgba(245,183,0,.05)', r: 14, dash: true });
  s += T(20, 40, 'load average đếm CẢ HAI hàng', { fs: 17, b: true, c: 'lx' });
  s += R(20, 60, 240, 180, { c: 'grn', r: 10 }) + T(36, 88, 'R — đang chạy / chờ CPU', { fs: 15, b: true, c: 'grn' });
  ['python3 regex', 'node', ''].forEach((t, i) => { if (t) s += R(36, 104 + i * 42, 208, 32, { c: 'grn', r: 6, sw: 1.5 }) + T(48, 126 + i * 42, t, { fs: 14, mono: true }); });
  s += T(36, 226, 'đo bằng: us · sy trong vmstat', { fs: 13.5, c: 'mu' });
  s += R(280, 60, 240, 180, { c: 'blu', r: 10 }) + T(296, 88, 'D — ngủ không ngắt được', { fs: 15, b: true, c: 'blu' });
  ['dd …big1', 'dd …big2', 'dd …big3', 'dd …big4'].forEach((t, i) => { s += R(296, 98 + i * 28, 208, 24, { c: 'blu', r: 6, sw: 1.5 }) + T(308, 115 + i * 28, t, { fs: 13, mono: true }); });
  s += T(296, 226, 'đo bằng: wa · /proc/pressure/io', { fs: 13.5, c: 'mu' });
  s += T(560, 60, 'Linux: load = R + D', { fs: 18, b: true, c: 'lx' });
  s += T(560, 88, '⇒ load cao chưa chắc CPU bận', { fs: 15.5, c: 'tx' });
  s += T(560, 124, 'So với nproc:', { fs: 15, c: 'mu' });
  s += T(560, 150, '6,8 trên 2 nhân = hàng đợi dài', { fs: 15, c: 'red', mono: true });
  s += T(560, 176, '6,8 trên 16 nhân = ngày thường', { fs: 15, c: 'grn', mono: true });
  s += T(560, 214, 'Mac đo lúc viết bài:', { fs: 15, c: 'mu' });
  s += T(560, 240, 'load 462 / 10 nhân, CPU rảnh 34%', { fs: 15, c: 'vio', mono: true });
  s += T(560, 262, 'macOS đếm khác — đừng so với Linux', { fs: 13.5, c: 'mu' });
  return sv(1150, 270, s);
};

/* Slide 20 — curl -w chia một request thành pha (đo thật: app 1 luồng, hàng chờ accept đầy) */
const pha = () => {
  const X = (s) => 150 + s * 38.5;
  let s = '';
  s += T(0, 58, 'GET /slow', { fs: 15, b: true, mono: true }) + T(0, 78, 'một mình', { fs: 13, c: 'mu' });
  s += `<rect x="${X(0)}" y="40" width="4" height="40" fill="${D.vio}"/>`;
  s += `<rect x="${X(0.0016)}" y="40" width="${X(3.69) - X(0.0016)}" height="40" rx="6" fill="${D.red}" opacity=".85"/>` + T((X(0) + X(3.69)) / 2, 66, 'CHỜ app 3,69 s', { fs: 14.5, b: true, a: 'middle', c: '#0a0f0c' });
  s += T(X(3.69) + 10, 66, 'connect=0,0016 · ttfb=3,69', { fs: 13.5, c: 'mu', mono: true });
  s += T(0, 148, 'GET /', { fs: 15, b: true, mono: true }) + T(0, 168, 'giữa 15 request', { fs: 13, c: 'mu' });
  s += `<rect x="${X(0)}" y="130" width="${X(7.2) - X(0)}" height="40" rx="6" fill="${D.amb}" opacity=".85"/>` + T((X(0) + X(7.2)) / 2, 156, 'connect 7,2 s (SYN chờ)', { fs: 14.5, b: true, a: 'middle', c: '#0a0f0c' });
  s += `<rect x="${X(7.2)}" y="130" width="${X(24.82) - X(7.2)}" height="40" rx="6" fill="${D.red}" opacity=".85"/>` + T((X(7.2) + X(24.82)) / 2, 156, 'chờ tới lượt trong app: 17,6 s', { fs: 14.5, b: true, a: 'middle', c: '#0a0f0c' });
  s += T(X(24.82), 196, 'total 24,8 s — cho một trang trả lời trong 0 ms', { fs: 14, a: 'end', c: 'red', b: true });
  [0, 5, 10, 15, 20, 25].forEach((t) => { s += `<path d="M${X(t)} 206 L${X(t)} 214" stroke="${D.dim}" stroke-width="2"/>` + T(X(t), 232, `${t}s`, { fs: 13, a: 'middle', c: 'mu', mono: true }); });
  return sv(1150, 240, s);
};

/* Slide 23 — tiến trình vẫn đứng trong thư mục bản CŨ */
const cuMoi = () => {
  let s = '';
  s += R(0, 20, 330, 90, { c: 'dim', r: 10 }) + T(16, 50, '/srv/releases/v1', { fs: 16, b: true, mono: true }) + T(16, 76, 'bản cũ — 15:28:28 khởi động', { fs: 14, c: 'mu' }) + T(16, 98, 'python3 app.py (PID 4004)', { fs: 13.5, c: 'red', mono: true });
  s += R(0, 150, 330, 90, { c: 'grn', r: 10 }) + T(16, 180, '/srv/releases/v2', { fs: 16, b: true, mono: true }) + T(16, 206, 'bản mới — 15:28:31 chép lên', { fs: 14, c: 'grn' }) + T(16, 228, 'chưa ai chạy nó', { fs: 13.5, c: 'mu' });
  s += R(480, 150, 300, 70, { c: 'lx', r: 10 }) + T(496, 180, '/srv/app/current', { fs: 16, b: true, mono: true }) + T(496, 204, 'symlink đã trỏ sang v2', { fs: 14, c: 'lx' });
  s += A(476, 185, 336, 195, { c: 'lx' });
  s += R(480, 20, 300, 90, { c: 'red', r: 10 }) + T(496, 50, '/proc/4004/cwd', { fs: 16, b: true, mono: true }) + T(496, 76, 'vẫn → /srv/releases/v1', { fs: 14, c: 'red' }) + T(496, 98, 'cwd khoá lúc KHỞI ĐỘNG', { fs: 13.5, c: 'mu' });
  s += A(476, 65, 336, 65, { c: 'red' });
  s += T(830, 50, 'Ba câu hỏi, ba lệnh:', { fs: 16, b: true, c: 'lx' });
  s += T(830, 84, '① chạy từ đâu?', { fs: 15 }) + T(830, 106, 'ls -l /proc/PID/cwd', { fs: 14, c: 'tea', mono: true });
  s += T(830, 140, '② lên lúc nào?', { fs: 15 }) + T(830, 162, 'ps -o lstart= -p PID', { fs: 14, c: 'tea', mono: true });
  s += T(830, 196, '③ mã mới lúc nào?', { fs: 15 }) + T(830, 218, "stat -c '%y' file", { fs: 14, c: 'tea', mono: true });
  s += T(830, 246, 'lstart < mtime ⇒ chưa restart', { fs: 14.5, c: 'red', b: true });
  return sv(1150, 256, s);
};

/* Slide 25 — zombie: cha không wait(), PID 1 là `sleep` */
const zombieSvg = () => {
  let s = '';
  s += R(0, 20, 300, 76, { c: 'blu', r: 10 }) + T(16, 50, 'PID 1: sleep infinity', { fs: 16, b: true, mono: true }) + T(16, 76, 'không bao giờ gọi wait()', { fs: 14, c: 'red' });
  s += R(0, 150, 300, 76, { c: 'vio', r: 10, dash: true }) + T(16, 180, 'bash (đã thoát)', { fs: 16, b: true, mono: true }) + T(16, 204, 'cha thật — mất ⇒ con mồ côi', { fs: 14, c: 'mu' });
  s += R(470, 90, 320, 90, { c: 'red', r: 10 }) + T(486, 120, 'Z 3630 [python3] <defunct>', { fs: 15, b: true, mono: true, c: 'red' }) + T(486, 146, 'đã chết, chỉ còn mã thoát', { fs: 14, c: 'mu' }) + T(486, 168, 'kill -9 3630 ⇒ không đổi gì', { fs: 13.5, c: 'amb', mono: true });
  s += A(302, 190, 466, 160, { c: 'vio', dash: true }) + T(330, 204, 'nhận nuôi', { fs: 13.5, c: 'vio' });
  s += A(466, 104, 302, 62, { c: 'red' }) + T(318, 104, 'chờ được “nhận xác”', { fs: 13.5, c: 'red' });
  s += R(810, 20, 340, 206, { c: 'grn', r: 10, fill: 'rgba(63,185,80,.06)' });
  s += T(826, 50, 'Chữa đúng chỗ', { fs: 17, b: true, c: 'grn' });
  s += T(826, 80, '• sửa CHA: wait() / SIGCHLD', { fs: 14.5 });
  s += T(826, 108, '• giết cha ⇒ PID 1 dọn giúp', { fs: 14.5 });
  s += T(826, 136, '• container: docker run --init', { fs: 14.5 });
  s += T(826, 158, '  (tini làm PID 1, biết wait)', { fs: 13.5, c: 'mu' });
  s += T(826, 188, 'Zombie tốn 1 dòng bảng tiến trình,', { fs: 13.5, c: 'mu' });
  s += T(826, 208, 'không tốn RAM/CPU — nguy khi hàng nghìn', { fs: 13.5, c: 'mu' });
  return sv(1150, 236, s);
};

export const slides = S([
  cover({ t: 'Chương 12 — Chẩn đoán một máy chủ thật', sub: 'phương pháp · cây quyết định chết/chậm/lạ · USE · systemd exit code · ss/nc/curl -w · vmstat/iostat/free · namei · /proc/PID · zombie', chap: 'CHƯƠNG 12' }),

  { t: 'Bản đồ chương: từ “web sập rồi” tới một câu có tên', body: mindmap('Chẩn đoán', 'quan sát trước, đổi sau', [
    { t: '12.1 Phương pháp', d: 'vòng 6 bước · quét 60 giây · mốc thời gian · USE nhập môn', c: 'lx' },
    { t: '12.2 Nó chết', d: '203/EXEC · cổng bị chiếm · refused/timeout/reset · 502 · 137', c: 'red' },
    { t: '12.3 Nó chậm', d: 'load ≠ CPU · vmstat · iostat · available · đĩa/inode · curl -w', c: 'amb' },
    { t: '12.4 Nó lạ', d: 'namei · CRLF · /proc/PID/cwd · TLS và đồng hồ · zombie', c: 'vio' },
    { t: '12.5 Tổng kết', d: 'bốn cung đường · Ch13–16 · năm thói quen', c: 'grn' },
    { t: 'Dựng lại thật', d: 'mọi sự cố tái hiện trong container Ubuntu 24.04', c: 'tea' },
  ]) },

  /* ───────────── 12.1 ───────────── */
  { t: 'Cây quyết định: nó chết, nó chậm, hay nó lạ?', body: cay() },

  { t: 'Vòng lặp chẩn đoán: đổi MỘT thứ mỗi lần', body: `${vong()}
    ${box('tip', 'Giả thuyết tốt nói được thành một câu kiểm được bằng một lệnh: <em>“nginx còn sống, backend không nghe cổng 3000”</em> — kiểm bằng <code>ss&nbsp;-tlnp&nbsp;|&nbsp;grep&nbsp;:3000</code>. Không nói được thành câu = đang đoán.')}` },

  { t: 'Cuộc quét 60 giây: chỉ đọc, dán một phát', body: two(
    sh([
      ['{', ''],
      ['  uptime; last reboot | head -3', 'tải · khởi động lúc nào'],
      ['  systemctl --failed --no-legend', 'unit nào chết'],
      ['  journalctl -p err -b --no-pager | tail -15', 'lỗi từ lần boot này'],
      ["  df -h | grep -vE 'tmpfs|udev'; df -i | head -3", 'đĩa VÀ inode'],
      ['  free -h', 'đọc cột available'],
      ['  ps aux --sort=-%cpu | head -6', 'ngốn CPU'],
      ['  ps aux --sort=-%mem | head -6', 'ngốn RAM'],
      ['  ss -tlnp 2>/dev/null | head -12', 'ai nghe cổng nào'],
      ['  dmesg -T 2>/dev/null | tail -10', 'nhân nói gì'],
      ['} 2>&1 | tee /tmp/sweep-$(date +%H%M%S).txt', 'LƯU lại để so sau'],
    ], { fs: 13.5 }),
    `${term(['=== failed units ===', '! ● be-exec.service loaded failed failed Node API', '=== errors this boot ===', '! … kernel: Memory cgroup out of memory: Killed', '!   process 68619 (python3) … anon-rss:514264kB', '=== disk ===', 'overlay   911G   25G  840G   3% /', '=== memory ===', '        total  used  free  buff/cache available', 'Mem:    7.7Gi 2.9Gi 113Mi      5.1Gi     4.9Gi', '=== listening ===', 'LISTEN 0 4096  0.0.0.0:22  users:(("sshd",…))', '+ real 0m0.031s'], { title: 'Ubuntu + systemd — output thật (cắt bớt)', fs: 12.5 })}
    ${box('info', 'Chạy không sudo trên Fedora: <code>dmesg</code> báo <em>Operation not permitted</em> — dùng <code>sudo journalctl -k</code>. Thiếu một dòng ≠ máy ổn.')}`, 'l') },

  { t: 'USE: mỗi tài nguyên hỏi ba câu — dùng, nghẽn, lỗi', body: `
    ${table(['Tài nguyên', 'U — Dùng bao nhiêu?', 'S — Có hàng chờ không?', 'E — Có lỗi không?'], [
      ['CPU', '<code>vmstat 1</code> → <code>us+sy</code> · <code>top</code>', '<code>vmstat</code> cột <code>r</code> &gt; nproc · load / nproc', '<code>dmesg</code> (hiếm)'],
      ['Bộ nhớ', '<code>free -h</code> → available', '<code>vmstat</code> <code>si/so</code> ≠ 0 · PSI memory', '<code>dmesg | grep -i oom</code> · <code>memory.events</code>'],
      ['Đĩa (I/O)', '<code>iostat -xz 1</code> → <code>%util</code>', '<code>aqu-sz</code> · <code>w_await</code> · tiến trình <code>D</code>', '<code>dmesg</code> “I/O error” · ro remount'],
      ['Dung lượng', '<code>df -h</code> · <code>df -i</code>', '—', '“No space left on device”'],
      ['Mạng', '<code>ip -s link</code> · <code>ss -s</code>', '<code>ss -lnt</code> Recv-Q ≥ Send-Q', '<code>ip -s link</code> errors/dropped'],
    ], { sm: true })}
    ${two(box('tip', 'USE (Brendan Gregg): đi hết bảng TRƯỚC khi đào sâu một ô — để tìm cái ĐÃ CẠN chứ không phải cái THÚ VỊ. Bản đầy đủ: Chương 14.2.'),
      box('warn', 'Mọi ô đều bình thường mà vẫn chậm ⇒ máy vô can: đi đếm KẾT NỐI (Bài 12.3, công thức 6).'))}` },

  { t: '“Cái gì đã đổi?” thường giải xong sự cố trước', body: `${mocTg()}
    ${sh([
      ["journalctl --since '2 hours ago' -p warning --no-pager", 'nhân + dịch vụ kêu gì'],
      ["grep -E ' (install|upgrade|remove) ' /var/log/dpkg.log | tail", 'gói vừa đổi'],
      ['ls -lt /etc /etc/nginx/sites-enabled | head', 'cấu hình vừa sửa'],
      ['sudo journalctl _COMM=sudo --since today | tail', 'ai chạy gì bằng sudo'],
      ["git -C /srv/app log -5 --date=iso --pretty='%h %ad %s'", 'vừa deploy gì'],
    ], { fs: 13.5 })}` },

  { t: 'Buộc phải restart? Thu 15 giây bằng chứng trước', body: two(
    sh([
      ['T=/tmp/evidence-$(date +%H%M%S); mkdir -p "$T"', ''],
      ['ps auxww        > "$T/ps.txt"', 'ai đang chạy'],
      ['ss -tanp        > "$T/sockets.txt" 2>/dev/null', 'kết nối lúc đó'],
      ['{ free -h; df -h; df -i; } > "$T/res.txt"', 'tài nguyên'],
      ['sudo journalctl -u backend -n 500 > "$T/be.log"', 'lời trăng trối'],
      ['sudo journalctl -k -b | tail -200 > "$T/k.log"', 'OOM, I/O error'],
      ['ls -l "$T"', ''],
    ], { fs: 13.5 }),
    `${table(['Giờ', 'Loại', 'Ghi đúng cái gì'], [
      ['18:41', 'quan sát', 'dán output: “load 6,8; OOM giết postgres 18:34”'],
      ['18:43', 'giả thuyết', 'MỘT câu kiểm được'],
      ['18:45', '!thay đổi', 'đúng lệnh đã gõ — để hoàn tác được'],
      ['18:47', '+xác nhận', 'lệnh CHỨNG MINH + output (<code>curl</code> = 200)'],
      ['18:52', 'việc sau', 'swap · logrotate · cảnh báo 80% đĩa'],
    ], { sm: true })}
    ${box('warn', 'Bẫy thật (bản cũ của bài này): <code>free -h; df -h; df -i &gt; f</code> chỉ ghi <code>df -i</code> vào file — chuyển hướng gắn với lệnh CUỐI. Bọc <code>{ …; }</code> như bên trái.')}`, 'l') },

  /* ───────────── 12.2 ───────────── */
  { t: 'Mã thoát systemd là chẩn đoán: 203 thì log rỗng', body: two(
    `${term(['$ systemctl status be-exec --no-pager | head -6', '! × be-exec.service - Node API (be-exec)', '     Loaded: loaded (/etc/systemd/system/be-exec.service)', '! Active: failed (Result: exit-code) since …; 2s ago', '    Process: 146 ExecStart=/usr/local/bin/node dist/index.js', '+            (code=exited, status=203/EXEC)', '$ journalctl -u be-exec -o cat', 'Started be-exec.service - Node API (be-exec).', 'be-exec.service: Main process exited, …status=203/EXEC', "be-exec.service: Failed with result 'exit-code'.", '# ← không một chữ nào từ ứng dụng'], { title: 'Ubuntu + systemd 255 — output thật', fs: 12.5 })}
    ${box('tip', 'Chạy tay đúng ExecStart dưới đúng User — 5 giây tách “unit sai” khỏi “app hỏng”:<br><code>sudo -u deploy /usr/bin/node /srv/app/dist/index.js</code>')}`,
    `${table(['Mã', 'Nghĩa', 'Journal nói thêm'], [
      ['!<code>203/EXEC</code>', 'không chạy được file trong ExecStart', 'KHÔNG gì cả — kiểm <code>ls -l</code> đường dẫn'],
      ['<code>200/CHDIR</code>', 'WorkingDirectory không vào được', '“Changing to the requested working directory failed”'],
      ['<code>217/USER</code>', 'User= không tồn tại', '“Failed to determine user credentials”'],
      ['<code>226/NAMESPACE</code>', 'hộp cát (ProtectSystem…) không dựng được', 'đường dẫn trong ReadWritePaths'],
      ['+<code>1/FAILURE</code>', 'app ĐÃ chạy rồi thoát ≠ 0', 'lỗi của app — giờ mới đọc log'],
      ['<code>137</code> / <code>143</code>', 'SIGKILL / SIGTERM (128 + 9 / 15)', 'OOM? <code>journalctl -k</code>'],
    ], { sm: true })}`, '') },

  { t: '“Address already in use”: tìm ai giữ cổng, rồi TERM', body: two(
    `${term(['$ python3 -m http.server 19120', '    self.socket.bind(self.server_address)', '! OSError: [Errno 98] Address already in use', "$ ss -tlnp 'sport = :19120'", 'State  Recv-Q Send-Q Local Address:Port …Process', '+ LISTEN 0  5  0.0.0.0:19120 … users:(("python3",pid=3716,fd=3))', '$ fuser -v -n tcp 19120', '                     USER   PID ACCESS COMMAND', '19120/tcp:           root  3716 F....  python3', '$ ps -o pid,ppid,etime,cmd -p 3716', '   3716  3710  00:01 python3 -m http.server 19120', '$ kill 3716          # SIGTERM trước', "$ ss -tlnp 'sport = :19120' | tail -n +2 \\", "    | grep . || echo 'port free'", '= port free'], { title: 'Ubuntu — dựng lại thật', fs: 12.5 })}`,
    `${sh([
      ["sudo ss -tlnp 'sport = :3000'", 'ai nghe + PID (cần sudo)'],
      ['sudo fuser -v -n tcp 3000', 'ngắn gọn, psmisc'],
      ['sudo lsof -nP -iTCP:3000 -sTCP:LISTEN', 'có cả trên macOS'],
      ['ps -o pid,ppid,etime,cmd -p PID', 'PPID 1 = mồ côi'],
      ['kill PID; sleep 2; kill -0 PID && kill -9 PID', 'TERM rồi mới KILL'],
    ], { fs: 13.5 })}
    ${table(['Trông giống', 'Thật ra là'], [
      ['<code>TIME_WAIT</code> hàng chục dòng', 'không ai nghe — bind vẫn được'],
      ['<code>EADDRNOTAVAIL</code>', 'IP không có trên máy này (<code>ip addr</code>)'],
      ['Mac: cổng 5000 bận', 'AirPlay Receiver (ControlCenter)'],
    ], { sm: true })}`, 'l') },

  { t: 'Refused · timeout · reset · tên: bốn chỗ gói tin dừng', body: `${bonKieu()}
    ${term(['$ nc -vz -w 3 127.0.0.1 19122        # server này nhận rồi cắt', '= Connection to 127.0.0.1 19122 port [tcp/*] succeeded!', '$ curl -sS -m 3 http://127.0.0.1:19122/; echo exit=$?', '! curl: (56) Recv failure: Connection reset by peer', 'exit=56'], { title: 'Ubuntu — nc -z chỉ bắt tay nên KHÔNG thấy reset', fs: 12.5 })}` },

  { t: '502: app chết hoặc từ chối — 504: app CHẬM', body: two(
    `${term(["$ curl -s -o /dev/null -w '%{http_code}\\n' \\", '    http://127.0.0.1:19123/api/posts', '! 502', '$ tail -1 /var/log/nginx/error.log', '… connect() failed (111: Connection refused) while', '  connecting to upstream, … upstream: "http://127.0.0.1:19124/posts"', "$ curl -s -o /dev/null -w '%{http_code}\\n' …:19123/slow/", '+ 504', '… upstream timed out (110: Connection timed out) while', '  reading response header from upstream …'], { title: 'Ubuntu, nginx 1.24 — output thật', fs: 12 })}
    ${term(['# /v6/ → proxy_pass http://localhost:19125 (app chỉ nghe 127.0.0.1)', "$ for i in 1 2 3; do curl -s -o /dev/null -w '%{http_code} ' …/v6/; done", '= 200 200 200', '! … connect() failed (111: …) upstream: "http://[::1]:19125/"', '# /v4/ → proxy_pass http://127.0.0.1:19126 (app chỉ nghe [::1])', '! 502'], { title: 'Bẫy localhost/IPv6 — đo thật', fs: 12 })}`,
    `${table(['Dòng trong error.log', 'Nghĩa', 'Đi đâu tiếp'], [
      ['!<code>111: Connection refused</code>', 'upstream không nghe', 'unit / container (công thức 1, 5)'],
      ['<code>110: …timed out</code> (connecting)', 'gói rơi / app treo accept', '<code>ss -lnt</code> hàng chờ'],
      ['<code>upstream timed out</code> (reading)', '→ 504: app chậm', 'Bài 12.3 · <code>proxy_read_timeout</code>'],
      ['<code>13: Permission denied</code>', 'socket Unix, sai quyền', '<code>namei -l</code> đường socket'],
      ['<code>prematurely closed</code>', 'app sập giữa chừng', 'log app đúng giây đó'],
    ], { sm: true })}
    ${box('info', '<code>localhost</code> ra <em>hai</em> địa chỉ ⇒ nginx thử <code>[::1]</code>, bị từ chối, <b>chuyển sang 127.0.0.1</b>: vẫn 200 nhưng mỗi request thêm một dòng lỗi. 502 thật là chiều ngược lại: app chỉ nghe <code>::1</code>.')}`, '') },

  { t: 'Container quay vòng: đọc ExitCode + OOMKilled trước', body: two(
    `${term(['$ docker ps -a --format "table {{.Names}}\\t{{.Status}}"', 'NAMES       STATUS', '! lx12-loop   Restarting (1) Less than a second ago', '$ docker logs --tail 2 lx12-loop', '15:24:58 backend starting', '! Error: DATABASE_URL is not set', "$ docker inspect lx12-loop \\", "    --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'", '1 false 5', '$ docker inspect lx12-oom  --format …   # --memory 64m', '! 137 true 0', '$ docker run --rm ubuntu:24.04 node dist/index.js; echo $?', '! … exec: "node": executable file not found in $PATH', '127'], { title: 'Docker 29.8 — output thật', fs: 12 })}`,
    `${table(['Mã thoát', 'Nghĩa', 'Nhìn đâu'], [
      ['<code>1</code> · OOMKilled false', 'app tự thoát khi khởi động', '<code>docker logs</code> — thiếu env, DB'],
      ['!<code>137</code> · OOMKilled true', 'chạm trần RAM (128 + 9)', '<code>docker stats</code> · nâng trần / sửa rò'],
      ['<code>137</code> · OOMKilled false', 'bị <code>kill -9</code> / hết giờ dừng', 'ai đã stop nó'],
      ['<code>143</code>', 'SIGTERM — dừng bình thường', '—'],
      ['<code>127</code>', 'lệnh không có trong ảnh', '<code>--entrypoint sh</code> vào xem'],
      ['<code>126</code> / <code>255</code>', 'có mà không chạy được', 'thiếu <code>+x</code>, CRLF (Docker 29: 255)'],
    ], { sm: true })}
    ${sh([['docker run --rm -it --entrypoint sh IMAGE', 'vào ảnh, bỏ qua entrypoint']], { fs: 13.5, so: false })}`, 'l') },

  { t: 'Không SSH được: máy khách nói mơ hồ, máy chủ nói rõ', body: two(
    steps([
      ['<code>ping -c3 IP</code> · console nhà cung cấp', 'có phản hồi ⇒ máy sống, định tuyến được'],
      ['<code>nc -vz -w 3 IP 22</code>', 'refused = sshd chết · timeout = tường lửa'],
      ['<code>ssh -v user@IP</code>', 'đã chào khoá nào, rơi xuống mật khẩu chưa'],
      ['console web → <code>journalctl -u ssh</code>', 'lý do THẬT nằm ở phía máy chủ'],
      ['sửa quyền / <code>sshd -T</code>, giữ phiên cũ mở', 'thử lại từ terminal THỨ HAI'],
    ]),
    `${term(['$ chmod 777 /home/deploy/.ssh     # lỗi hay gặp', '$ ssh -v -i ~/.ssh/id_lab deploy@127.0.0.1 true', 'debug1: Offering public key: /root/.ssh/id_lab ED25519 …', 'debug1: Authentications that can continue: publickey,password', '! deploy@127.0.0.1: Permission denied (publickey,password).'], { title: 'Máy khách — chỉ biết là bị từ chối', fs: 12.5 })}
    ${term(["$ journalctl -u ssh -n 20 | grep -iE 'refused|bad'", '! sshd[314]: Authentication refused: bad ownership or modes', '!           for directory /home/deploy/.ssh', '$ chmod 700 /home/deploy/.ssh; ssh … "echo ok again"', '= ok again'], { title: 'Máy chủ (Ubuntu + systemd) — nói đúng tên lỗi', fs: 12.5 })}`, 'l') },

  /* ───────────── 12.3 ───────────── */
  { t: 'Load average không phải % CPU: nó đếm cả hàng CHỜ', body: `${taiSvg()}
    ${two(
      term(['$ ps -eo state,pid,cmd | awk \'$1=="D"\'', 'D    3885 dd if=/dev/zero of=/root/big1 … oflag=direct,dsync', 'D    3886 dd if=/dev/zero of=/root/big2 …', '$ cat /proc/pressure/io', '+ some avg10=10.88 avg60=2.32 avg300=0.86', '+ full avg10=10.88 avg60=2.31 avg300=0.84'], { title: 'Ubuntu — 4 tiến trình dd đang chờ đĩa', fs: 12.5 }),
      box('tip', '<code>/proc/pressure/{cpu,io,memory}</code> (PSI, nhân ≥ 4.20): <code>full avg10=10.88</code> = 10,9% của 10 giây qua MỌI tác vụ đều kẹt chờ I/O. Một lần đọc, hết đoán.'), '')}` },

  { t: 'CPU 100%: một tiến trình, một luồng, kẹt vĩnh viễn', body: two(
    `${term(['$ top -b -n1 | head -8', '%Cpu(s):  9.4 us,  0.9 sy, 89.6 id,  0.0 wa …', 'MiB Mem : 7934.1 total, 385.1 free, … 5004.1 avail Mem', '    PID USER  PR NI  VIRT  RES S  %CPU  TIME+ COMMAND', '+    3845 root  20  0 88600 9664 S  90.9 0:20.30 python3', '$ top -H -b -n1 -p 3845 | tail -2', '+    3847 root  20  0 88600 9664 R  99.9 0:20.41 python3', '     3845 root  20  0 88600 9664 S   0.0 0:00.10 python3', '$ for i in 1 2 3; do ps -o etimes=,times= -p 3845; \\', '    sleep 5; done', '     20       20', '     25       25', '     30       30'], { title: 'Ubuntu — regex (a+)+$ “nổ” lùi, output thật', fs: 12.5 })}`,
    `${table(['Đọc', 'Kết luận'], [
      ['<code>%Cpu(s) 9.4 us</code> mà tiến trình 90,9%', 'máy 10 nhân: 1 nhân kịch = 10% tổng'],
      ['<code>-H</code>: luồng 3847 là <code>R</code>', 'MỘT luồng làm việc, luồng chính ngủ'],
      ['!giây CPU tăng = giây đồng hồ', 'đốt liên tục — vòng lặp/regex, không phải tải'],
      ['<code>%CPU</code> &gt; 100', 'bình thường: 400% = 4 nhân'],
    ], { sm: true })}
    ${sh([
      ['ps -eo pid,ppid,%cpu,etime,stat,cmd --sort=-%cpu | head', ''],
      ['top -H -b -n1 -p PID', 'theo LUỒNG'],
      ['sudo strace -c -f -p PID  # Ctrl-C sau 10 s', 'syscall nào (khi sy cao)'],
    ], { fs: 13.5 })}`, 'l') },

  { t: 'Chờ đĩa: CPU rảnh 66% mà load vẫn tăng', body: `
    ${term(['$ vmstat 1 5', 'procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------', ' r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu', '+ 5  0 437832 400060 1572788 3471764    0    0     0 49532 24482 29865 10  7 66 17  0  0', '+ 1  3 437832 390988 1584160 3471768    0    0     0 35828 18969 21948 10  6 67 17  0  0', '$ iostat -xz 1 2 | tail -4      # (đã bỏ bớt cột d_* và rrqm)', 'Device     r/s     w/s    wkB/s  w_await  aqu-sz  %util', '+ vda       0.00 3720.00 42788.00     0.30    1.48  85.10'], { title: 'Ubuntu — 4 × dd oflag=direct,dsync, output thật', fs: 12.5 })}
    ${table(['Cột', 'Đọc thế nào', 'Ở đây'], [
      ['<code>b</code> (vmstat)', 'số tiến trình đang chờ I/O (trạng thái D)', '3 — bốn dd thay nhau chờ'],
      ['!<code>wa</code>', '% thời gian CPU rảnh VÌ chờ đĩa', '17 — thủ phạm là đĩa, không phải CPU'],
      ['<code>bo</code> · <code>wkB/s</code>', 'KB ghi ra mỗi giây', '~45–50 MB/s'],
      ['<code>w_await</code>', 'ms một lần ghi phải chờ', '0,30 — SSD Mac nhanh; VPS nghẽn: 100+'],
      ['<code>%util</code>', 'thiết bị bận bao nhiêu % thời gian', '85 — trên SSD đọc kèm await'],
      ['<code>st</code>', 'CPU bị máy ảo hàng xóm “mượn”', 'VPS: &gt; 10 liên tục = đổi gói'],
    ], { sm: true })}` },

  { t: 'Bộ nhớ: đọc available — và OOM thì giết im lặng', body: two(
    `${term(['$ free -h', '               total        used        free      shared  buff/cache   available', 'Mem:           7.7Gi       2.8Gi  ' + '     370Mi        88Mi       4.8Gi       4.9Gi', 'Swap:          1.0Gi       427Mi       596Mi'], { title: 'Ubuntu — cùng một máy ảo 8 GB', fs: 11.5 })}
    ${table(['Cột', 'Đọc thế nào'], [
      ['-<code>free</code> 370Mi', 'RAM chưa ai đụng — nhỏ là BÌNH THƯỜNG'],
      ['<code>buff/cache</code> 4.8Gi', 'đệm đĩa, nhân trả lại ngay khi app xin'],
      ['+<code>available</code> 4.9Gi', 'CON SỐ THẬT: app còn xin được bao nhiêu'],
      ['<code>Swap used</code>', 'đã từng thiếu; đang thiếu thì xem <code>si/so</code>'],
    ], { sm: true })}
    ${box('warn', 'Sức ép THẬT = <code>si</code>/<code>so</code> trong <code>vmstat</code> khác 0 liên tục (đang tráo ra đĩa), không phải <code>free</code> nhỏ.')}`,
    `${term(['$ cat /sys/fs/cgroup/memory.max', '536870912', '$ python3 -c "b = b\\"x\\" * (1200*1024*1024)"; echo exit=$?', '! bash: line 1:  3918 Killed    python3 -c …', '! exit=137', '$ grep oom /sys/fs/cgroup/memory.events', '+ oom 1', '+ oom_kill 1', '# phía máy chủ (journalctl -k):', '! Memory cgroup out of memory: Killed process 68619 (python3)', '!   total-vm:1243200kB, anon-rss:514264kB …'], { title: 'Ubuntu, --memory 512m — output thật', fs: 12.5 })}
    ${box('info', 'Chữ <code>Killed</code> do SHELL in, không phải chương trình — nạn nhân không kịp nói gì. Tìm lý do ở <code>journalctl -k</code> / <code>dmesg -T</code>, không ở log app.')}`, 'l') },

  { t: 'Đĩa “đầy mà du thấy trống”: file đã xoá vẫn mở', body: two(
    `${term(['$ df -h /day', '! tmpfs  40M  40M  0  100% /day', '$ rm /day/logs/app.log        # cách sửa “hiển nhiên”', '$ df -h /day', '! tmpfs  40M  40M  0  100% /day', '$ du -sh /day', '0       /day', '$ lsof -nP +L1', 'COMMAND  PID USER FD TYPE  SIZE/OFF NLINK NAME', '+ python3 3682 root 3w REG 41943040     0 /day/logs/app.log (deleted)', '$ : > /proc/3682/fd/3            # cắt cụt qua fd', '$ df -h /day', '= tmpfs  40M  68K  40M    1% /day'], { title: 'Ubuntu — dựng lại thật trên tmpfs 40M', fs: 12.5 })}`,
    `${term(['$ echo hello > /inode/report.txt', '! /inode/report.txt: No space left on device', '$ df -h /inode', '+ tmpfs   40M     0   40M    0% /inode', '$ df -i /inode', 'Filesystem Inodes IUsed IFree IUse% Mounted on', '! tmpfs        2000  2000     0  100% /inode', '$ find /inode -xdev -type f | cut -d/ -f1-3 | sort | uniq -c', '   1998 /inode/sessions'], { title: 'Ubuntu — inode cạn khi dung lượng còn 100%', fs: 12.5 })}
    ${table(['Triệu chứng', 'Lệnh đầu tiên'], [
      ['<code>df</code> đầy, <code>du</code> không thấy', '<code>lsof -nP +L1</code>'],
      ['“No space” mà <code>df -h</code> còn trống', '<code>df -i</code>'],
      ['thư mục nào to', '<code>du -xh -d1 / | sort -rh</code>'],
      ['log đang mở', '<code>truncate -s 0</code>, KHÔNG <code>rm</code>'],
    ], { sm: true })}`, 'l') },

  { t: 'Chậm mà chẳng gì bận: đếm hàng chờ, không đếm CPU', body: `${pha()}
    ${two(
      term(["$ ss -lnt 'sport = :19125'", 'State  Recv-Q Send-Q Local Address:Port', '! LISTEN 6      5          127.0.0.1:19125', "$ ss -tan state syn-sent '( dport = :19125 )' | tail -n +2 | wc -l", '! 8', '$ top -b -n1 | sed -n 3p', '= %Cpu(s): 10.2 us,  0.9 sy,  0.0 ni, 88.0 id,  0.0 wa'], { title: 'Ubuntu — app 1 luồng, 15 request cùng lúc', fs: 12.5 }),
      table(['Pha dài', 'Nghi gì'], [
        ['<code>time_namelookup</code>', 'DNS: resolver chết thêm 5 s'],
        ['<code>time_connect</code>', 'hàng chờ accept đầy · mạng'],
        ['<code>time_appconnect</code>', 'TLS'],
        ['!<code>ttfb − appconnect</code>', 'APP nghĩ / chờ CSDL, pool, API'],
        ['<code>total − ttfb</code>', 'thân phản hồi to / máy khách chậm'],
      ], { sm: true }), '')}` },

  /* ───────────── 12.4 ───────────── */
  { t: '“Permission denied” mà file 755: thủ phạm ở thư mục cha', body: two(
    `${term(['$ ls -l /srv/app/run.sh', '-rwxr-xr-x 1 deploy deploy 26 … /srv/app/run.sh', '$ su deploy -c /srv/app/run.sh', '! bash: line 1: /srv/app/run.sh: Permission denied', '$ namei -l /srv/app/run.sh', 'f: /srv/app/run.sh', 'drwxr-xr-x root   root   /', '! drwxr-x--- root   root   srv', 'drwxr-xr-x deploy deploy app', '-rwxr-xr-x deploy deploy run.sh', '$ chmod 755 /srv; su deploy -c /srv/app/run.sh', '= app ok'], { title: 'Ubuntu, util-linux 2.39 — output thật', fs: 13 })}`,
    `<style>.l-pm .ch{width:44px;height:52px;font-size:26px}.l-pm>.row{gap:18px}.l-pm{gap:10px}.l-pm .raw{font-size:16px;padding:6px 14px}</style>${perms('drwxr-x---', { raw: 'drwxr-x--- root root /srv' })}
    ${table(['Nếu namei sạch mà vẫn denied', 'Lệnh'], [
      ['phân vùng gắn <code>noexec</code> / <code>ro</code>', '<code>findmnt -T /srv/app</code>'],
      ['hộp cát systemd (226/NAMESPACE)', '<code>systemctl cat app</code>'],
      ['AppArmor (Ubuntu) / SELinux (Fedora)', '<code>journalctl -k | grep -i denied</code>'],
      ['thuộc tính bất biến', '<code>lsattr file</code> → <code>i</code>'],
    ], { sm: true })}`, 'l') },

  { t: 'File có thật mà “not found”: \\r trong dòng shebang', body: two(
    `${term(['$ ./deploy.sh; echo "exit=$?"', '! ./deploy.sh: cannot execute: required file not found', 'exit=127', '$ file deploy.sh', '+ deploy.sh: … script, ASCII text executable, with CRLF line terminators', '$ head -1 deploy.sh | cat -A', '#!/bin/bash^M$', '$ bash crlf2.sh', "! crlf2.sh: line 1: cd: $'/srv/app\\r': No such file or directory", "! crlf2.sh: line 2: $'ls\\r': command not found", '$ dos2unix deploy.sh && ./deploy.sh', '= deploying'], { title: 'Ubuntu, bash 5.2 — output thật', fs: 12.5 })}`,
    `${table(['Mã', 'Câu lỗi', 'Nghĩa'], [
      ['!<code>127</code>', '<code>command not found</code>', 'không có trong PATH'],
      ['<code>127</code>', '<code>No such file or directory</code>', 'sai đường dẫn'],
      ['!<code>127</code>', '<code>required file not found</code>', 'file CÓ — trình thông dịch / bộ nạp thì không (CRLF, glibc trên musl)'],
      ['<code>126</code>', '<code>Permission denied</code>', 'thiếu <code>+x</code> / <code>noexec</code>'],
      ['<code>137</code> · <code>143</code>', '<code>Killed</code> · (im)', 'SIGKILL · SIGTERM'],
    ], { sm: true })}
    ${sh([['git config --global core.autocrlf input', 'Windows: không đổi LF→CRLF'], ['echo "*.sh text eol=lf" >> .gitattributes', 'chốt cho cả nhóm']], { fs: 13.5 })}`, 'l') },

  { t: 'Deploy rồi mà hành vi cũ: tiến trình vẫn chạy bản cũ', body: `${cuMoi()}
    ${term(['$ ls -l /srv/app/current', 'lrwxrwxrwx 1 root root 16 Sep 28 15:28 /srv/app/current -> /srv/releases/v2', '$ ls -l /proc/4004/cwd', '! lrwxrwxrwx 1 root root 0 Sep 28 15:28 /proc/4004/cwd -> /srv/releases/v1', "$ stat -c '%y %n' /srv/app/current/app.py", '2026-09-28 15:28:31.339050004 +0000 /srv/app/current/app.py', '$ ps -o pid,lstart,etime,cmd -p 4004', '    PID                  STARTED     ELAPSED CMD', '!   4004 Mon Sep 28 15:28:28 2026       00:02 python3 app.py 0.0.0.0 19127'], { title: 'Ubuntu — đổi symlink mà quên restart, output thật', fs: 12.5 })}` },

  { t: 'Lỗi chứng chỉ thường là lỗi ĐỒNG HỒ của máy khách', body: two(
    `${term(['$ echo | openssl s_client -connect example.com:443 \\', '    -servername example.com 2>/dev/null \\', '    | openssl x509 -noout -dates -subject', 'notBefore=Sep 26 22:49:11 2026 GMT', 'notAfter=Dec 25 22:56:35 2026 GMT', 'subject=CN = example.com', "$ faketime '2020-01-01' curl -sS -o /dev/null https://example.com/", '! curl: (60) SSL certificate problem: certificate is not yet valid', "$ faketime '2030-01-01' curl -sS -o /dev/null https://example.com/", '! curl: (60) SSL certificate problem: certificate has expired', '$ … | openssl x509 -noout -checkend $((30*86400)); echo exit=$?', '= Certificate will not expire', 'exit=0'], { title: 'Ubuntu, OpenSSL 3.0.13 + libfaketime — output thật', fs: 12 })}`,
    `${table(['Câu lỗi', 'Nhìn đâu trước'], [
      ['!<code>not yet valid</code>', 'đồng hồ MÁY KHÁCH (<code>timedatectl</code>)'],
      ['<code>has expired</code>', '<code>notAfter</code>, rồi timer gia hạn (certbot)'],
      ['<code>unable to get local issuer</code>', 'máy chủ thiếu chứng chỉ trung gian'],
      ['<code>hostname mismatch</code>', 'quên <code>-servername</code> / sai vhost'],
      ['curl được, app không', 'kho CA riêng của runtime / thiếu <code>ca-certificates</code>'],
    ], { sm: true })}
    ${sh([['openssl x509 -noout -checkend 2592000', 'exit 1 nếu hết hạn trong 30 ngày'], ['timedatectl; chronyc tracking', 'NTP có đồng bộ không']], { fs: 13.5 })}`, 'l') },

  { t: 'Zombie: đã chết, không giết được — sửa ở tiến trình CHA', body: `${zombieSvg()}
    ${two(
      term(["$ ps -eo stat,pid,ppid,etime,cmd | awk 'NR==1 || $1 ~ /^Z/'", 'STAT     PID    PPID     ELAPSED CMD', '! Z       3630       1       04:10 [python3] <defunct>', '! Z       3664       1       03:46 [python3] <defunct>', '$ ps -o pid,cmd -p 1', '      1 sleep infinity', '$ kill -9 3630; ps -o stat,pid -p 3630', '! Z       3630'], { title: 'Ubuntu — zombie thật trong container lx12-u', fs: 12.5 }),
      term(['# cùng việc, hai container:', '$ docker run … ubuntu:24.04 sleep infinity', '! Zs  11  1  [sleep] <defunct>', '$ docker run --init … ubuntu:24.04 sleep infinity', '      1 /sbin/docker-init -- sleep infinity', '= (không còn dòng Z nào)'], { title: 'Docker — --init dọn giúp', fs: 12.5 }), '')}` },

  { t: '“Máy tôi chạy được”: sáu thứ khác nhau giữa hai máy', body: two(
    `${table(['Khác biệt', 'Kiểm bằng', 'Ví dụ thật'], [
      ['!Hoa/thường tên file', '<code>touch A_; ls a_</code>', 'Mac tìm ra <code>report_a.txt</code> — Linux thì không'],
      ['Múi giờ', '<code>date</code> · <code>timedatectl</code>', 'container UTC, Mac +07 ⇒ cron lệch 7 giờ'],
      ['Locale', '<code>locale</code> · <code>LC_ALL=C</code>', '<code>sort</code>, dấu thập phân khác'],
      ['Biến môi trường', '<code>systemctl show app -p Environment</code>', 'systemd/cron không đọc <code>~/.bashrc</code>'],
      ['Phiên bản', '<code>node -v; openssl version</code>', 'Mac: OpenSSL 3.6 (brew) + LibreSSL 3.3.6'],
      ['File git không mang', '<code>git status --ignored</code>', '<code>.env</code>, <code>uploads/</code>'],
    ], { sm: true })}`,
    `${term(['$ touch Report_A.txt; ls report_a.txt', '= report_a.txt', '# ⇒ ổ đĩa Mac KHÔNG phân biệt hoa/thường', '$ date -d "Dec 25 22:56:35 2026 GMT" +%s', '! date: illegal option -- d', '$ date -j -f "%b %d %T %Y %Z" "Dec 25 22:56:35 2026 GMT" +%s', '= 1798239395'], { title: 'Mac M1, macOS 27 — output thật', fs: 12.5 })}
    ${box('tip', 'Chạy cùng một khối “in môi trường” trên cả hai máy rồi <code>diff</code> — 20 giây, chấm dứt phần lớn cuộc cãi “máy tôi chạy mà”.')}`, 'l') },

  /* ───────────── 12.5 ───────────── */
  { t: 'Khoá chưa hết: bốn cung đường + bốn chương nâng cao', body: cards([
    { ic: '🧭', t: 'Cung 1 · Ch0–2', d: 'Đi lại được: shell, cây file, đường dẫn, file và thư mục', c: 'blu' },
    { ic: '🔗', t: 'Cung 2 · Ch3–6', d: 'Ghép nối: ống dẫn, grep/sed/awk, quyền, tiến trình, biến', c: 'tea' },
    { ic: '🛠', t: 'Cung 3 · Ch7–9', d: 'Dựng và vươn ra: script, PATH, mạng, SSH, rsync', c: 'grn' },
    { ic: '🖥', t: 'Cung 4 · Ch10–12', d: 'Chạy thật: đĩa, log, systemd, cron, chẩn đoán', c: 'amb' },
    { ic: '⚡', t: 'Ch13 · Bash nâng cao', d: 'mảng kết hợp, <code>&lt;(…)</code>, <code>xargs -P</code>, <code>trap ERR</code>, bats', c: 'vio' },
    { ic: '🔬', t: 'Ch14 · Linux chuyên sâu', d: 'syscall, namespaces, cgroups, <strong>USE đầy đủ</strong>, LVM, nftables', c: 'pnk' },
    { ic: '🍎', t: 'Ch15 · macOS &amp; Windows', d: 'zsh, BSD vs GNU, Homebrew, launchd, WSL2, PowerShell', c: 'ora' },
    { ic: '🏁', t: 'Ch16 · Dự án cuối khoá', d: 'dựng + deploy + giám sát một máy chủ; thi 20 câu', c: 'red' },
  ], 4) },

  { t: 'Chẩn đoán trên macOS và WSL: cùng câu hỏi, khác lệnh', body: table(['Câu hỏi', 'Ubuntu / WSL2', 'macOS (đo trên Mac M1, macOS 27)'], [
    ['Tải, số nhân', '<code>uptime</code> · <code>nproc</code>', '<code>uptime</code> · <code>sysctl -n hw.ncpu</code> — load 462 / 10 nhân vẫn chạy mượt'],
    ['Ai ngốn CPU', '<code>top -b -n1</code> · <code>ps --sort</code>', '!<code>top -l 2 -o cpu</code> (mẫu đầu của <code>-l 1</code> luôn 0%)'],
    ['RAM', '<code>free -h</code> · <code>vmstat 1</code>', '-không có <code>free</code>/<code>vmstat</code>: <code>vm_stat</code> · <code>memory_pressure</code>'],
    ['Đĩa chờ', '<code>iostat -xz 1</code>', '<code>iostat -c 2 -w 1</code> (BSD, ít cột hơn)'],
    ['Ai nghe cổng', '<code>ss -tlnp</code> · <code>fuser</code>', '-không có <code>ss</code>: <code>lsof -nP -iTCP -sTCP:LISTEN</code>'],
    ['Quyền theo đường dẫn', '<code>namei -l</code>', '-không có <code>namei</code>: <code>ls -ld</code> từng thư mục cha'],
    ['Log hệ thống', '<code>journalctl</code> · <code>dmesg -T</code>', '!<code>/usr/bin/log show --last 1h</code> — trong zsh, <code>log</code> là lệnh KHÁC'],
    ['Tính ngày còn lại', '<code>date -d "…" +%s</code>', '!<code>date -j -f "%b %d %T %Y %Z" "…" +%s</code>'],
    ['WSL2', 'như Ubuntu, nhưng mô tả MÁY ẢO; systemd chỉ khi bật trong <code>/etc/wsl.conf</code>', '—'],
  ], { sm: true }) },

  { t: 'Sai lầm hay gặp khi chẩn đoán', body: table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['Restart ngay khi thấy lỗi', 'mất sạch bằng chứng, lỗi quay lại', 'quét 60 s + thu bằng chứng 15 s'],
    ['Đọc log app khi status = 203/EXEC', 'app chưa từng chạy — log rỗng', '<code>ls -l</code> đường dẫn ExecStart'],
    ['<code>kill -9</code> thẳng tay', 'không cho dọn dẹp, file dở', '<code>kill</code> (TERM), 2 s sau mới <code>-9</code>'],
    ['<code>rm</code> log to đang được ghi', 'dung lượng không trả lại', '<code>truncate -s 0</code> · <code>: &gt; /proc/PID/fd/N</code>'],
    ['Thấy <code>free</code> 200Mi, đi mua thêm RAM', 'buff/cache trả lại được', 'đọc available · <code>si/so</code>'],
    ['<code>nc -z</code> “succeeded” ⇒ kết luận app ổn', 'nc chỉ bắt tay TCP, không thấy reset', '<code>curl -sS -w</code> lấy mã thật'],
    ['<code>kill -9</code> zombie', 'nó đã chết rồi', 'sửa/giết cha · <code>--init</code>'],
    ['Đổi hai thứ cùng lúc', 'không biết cái nào có tác dụng', 'một thay đổi — một lần kiểm — một dòng nhật ký'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): triệu chứng → lệnh đầu tiên → đọc gì', body: table(['Triệu chứng', 'Lệnh ĐẦU TIÊN', 'Đọc output thế nào'], [
    ['Dịch vụ không lên', '<code>systemctl status X</code>', '<code>status=203/200/217</code> ⇒ unit sai, log rỗng · <code>1/FAILURE</code> ⇒ đọc journal'],
    ['Address already in use', "<code>ss -tlnp 'sport = :P'</code>", 'cột Process có PID · PPID 1 = mồ côi'],
    ['Không kết nối được', '<code>nc -vz -w 3 host P</code>', 'refused = máy chủ · timed out = mạng · getaddrinfo = DNS'],
    ['502 / 504', '<code>tail /var/log/nginx/error.log</code>', '111 refused ⇒ app chết · upstream timed out ⇒ app chậm'],
    ['Container Restarting', "<code>docker inspect -f '{{.State.ExitCode}} {{.State.OOMKilled}}'</code>", '137 true = OOM · 1 = app · 127 = thiếu lệnh'],
    ['Máy ì', '<code>vmstat 1 5</code>', '<code>r</code> &gt; nproc = CPU · <code>wa</code>, <code>b</code> cao = đĩa · <code>si/so</code> = RAM'],
    ['“No space left”', '<code>df -h; df -i</code>', 'dung lượng hay inode · <code>du</code> ≠ <code>df</code> ⇒ <code>lsof +L1</code>'],
    ['Chậm mà rảnh', "<code>curl -w '…%{time_starttransfer}'</code>", 'pha nào dài · <code>ss -lnt</code> Recv-Q ≥ Send-Q'],
    ['Denied mà quyền đúng', '<code>namei -l path</code>', 'thư mục cha thiếu <code>x</code>'],
    ['Deploy rồi vẫn cũ', '<code>ls -l /proc/PID/cwd</code>', '<code>lstart</code> trước <code>mtime</code> ⇒ chưa restart'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (2/2): lệnh và cờ của chương', body: two(
    sh([
      ['uptime; nproc; last reboot | head -3', 'tải · nhân · boot'],
      ['systemctl --failed · systemctl cat X', 'unit chết · unit đã nạp'],
      ['journalctl -u X -n 50 --since "10 min ago"', 'log một dịch vụ'],
      ['journalctl -p err -b · journalctl -k', 'lỗi lần boot · nhân'],
      ['ss -tlnp · ss -tanp state established', 'nghe · đang nối'],
      ['fuser -v -n tcp P · lsof -nP -iTCP:P', 'ai giữ cổng'],
      ['nc -vz -w 3 host P', 'cổng: refused/timeout'],
      ["curl -sS -m 5 -o /dev/null -w '%{http_code}'", 'mã thật, có hạn giờ'],
      ['docker inspect C -f "{{.State.ExitCode}}"', 'container chết vì sao'],
      ['ps -eo pid,ppid,stat,etime,cmd --sort=-%cpu', 'ai ngốn · trạng thái'],
      ['top -H -b -n1 -p PID', 'theo luồng'],
    ], { fs: 13.5 }),
    sh([
      ['vmstat 1 5 · iostat -xz 1 3', 'r b si so wa · await %util'],
      ['free -h · cat /proc/pressure/io', 'available · PSI'],
      ['df -h · df -i · du -xh --max-depth=1 /', 'dung lượng · inode · ai to'],
      ['lsof -nP +L1', 'đã xoá mà còn mở'],
      ['namei -l PATH · findmnt -T PATH', 'quyền từng cấp · gắn kiểu gì'],
      ['file f · head -1 f | cat -A · dos2unix f', 'CRLF'],
      ['ls -l /proc/PID/cwd /proc/PID/exe', 'đang chạy bản nào'],
      ['ps -o lstart= -p PID', 'lên lúc nào'],
      ['openssl x509 -noout -dates -checkend N', 'chứng chỉ'],
      ["ps -eo stat,pid,ppid,cmd | awk '$1~/^Z/'", 'zombie + cha'],
      ['getent hosts tên · dig +short tên', 'như app · DNS thuần'],
    ], { fs: 13.5 })) },

  { t: 'Thực hành Chương 12 (45 phút): năm sự cố, một container', body: `
    ${steps([
      ['<code>docker run -d --name lab12 -m 256m --memory-swap 256m --tmpfs /data:size=20m ubuntu:24.04 sleep infinity</code>', 'cài procps lsof psmisc python3 · quét 60 giây ra file'],
      ['Python ghi mãi vào <code>/data/app.log</code> tới đầy; <code>rm</code> file, đo lại <code>df</code>', 'giải phóng bằng <code>lsof +L1</code> + <code>/proc/PID/fd</code>'],
      ['Chạy <code>python3 -m http.server 19120</code> hai lần', 'tìm PID giữ cổng, TERM nó, không dùng -9'],
      ['Chạy <code>python3 -c "b=b\'x\'*(400*1024*1024)"</code>', 'đọc mã 137 + <code>memory.events</code>'],
      ['Tạo <code>deploy.sh</code> CRLF và một thư mục cha <code>750</code>', 'gọi tên lỗi bằng <code>cat -A</code> và <code>namei -l</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> mỗi sự cố có nhật ký 5 cột, dòng “xác nhận” dán output thật; đã <code>docker rm -f lab12</code>.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
