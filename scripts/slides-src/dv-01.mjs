/**
 * Deploy lên VPS · Deck dv-01 — Chương 1: Tạo tác (quyết định chính xác thứ gì được gửi đi).
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026:
 *   • "VPS thí nghiệm" = container ubuntu:24.04 (arm64) dv01-vps có openssh-server, SSH từ Mac qua 127.0.0.1:19012
 *     bằng khoá tạo trong thư mục nháp (git 2.43.0, GNU tar 1.35, gzip 1.12, rsync 3.2.7, Node v18.19.1 + npm 9.2.0
 *     của apt Ubuntu). Dự án thử ~/du-an: 13 tệp src/, express 4.21.2 + typescript 5.6.3, .env, .env.production
 *     (CHƯA vào .gitignore), tai-len/, logs/, dist/, server.js.orig. Bản phát hành ở /srv/app/phat-hanh/.
 *   • "Mac" = Mac M1, macOS 27 (git 2.51.1, bsdtar 3.5.3, Apple gzip 487.0.1, openrsync, Node 22.21.0,
 *     Docker Desktop — build context đo bằng ảnh tạm dv01-ctx, đã xoá).
 *   Output CŨ của chương (3,8 MB/84 KB, 236 MB/49 MB, 4d0c4ac/962ceea, inode 992893…) giữ nguyên từ bài học.
 *
 * Hình tự vẽ (SVG nội tuyến): cayTaoTac() cây làm việc → tạo tác · gzHdr() 10 byte đầu gzip · gaDong() dòng
 * git archive → gzip -n → sha256 · tenBan() cắt nghĩa tên bản · gaTrung() tệp phiên bản gọi tên cha ·
 * inodeSvg() cp ghi tại chỗ / mv thay mục · diaDay() đĩa đầy vì cache build.
 */
import { S, cover, sh, yaml, term, mindmap, diagram, cards, box, steps, table, vs, kpis, two, bars, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-01', code: 'DEPLOY · CHƯƠNG 1', title: 'Tạo tác', sub: 'Deploy lên VPS · Chương 1' };

const MONO = 'SF Mono,Menlo,monospace';
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}</style>';

/* Slide 3 — cây làm việc → tạo tác: cái gì đi, cái gì ở lại, cái gì dựng lại trên máy đích */
const cayTaoTac = () => {
  let s = '';
  s += R(0, 0, 500, 412, { c: 'dv', fill: 'rgba(56,189,248,.04)', r: 14, dash: true });
  s += T(18, 30, '💻 ~/du-an — cây làm việc (27 MB)', { fs: 17, b: true, c: 'dv' });
  const rows = [
    ['src/ · package*.json', '60 KB · ĐÃ COMMIT', 'grn'],
    ['tests/ · docs/ · .github/', 'đã commit · export-ignore được', 'tea'],
    ['node_modules/', '27 MB · 743 tệp · SINH RA', 'blu'],
    ['dist/', 'SINH RA bởi bước build', 'blu'],
    ['.git/', '360 KB · lịch sử', 'dim'],
    ['.env · .env.production', 'MẬT KHẨU THẬT', 'red'],
    ['tai-len/ · logs/', '300 KB · dữ liệu người dùng', 'amb'],
    ['src/server.js.orig', 'rác của trình soạn thảo', 'dim'],
  ];
  rows.forEach(([n, d, col], i) => {
    const y = 48 + i * 45;
    s += R(14, y, 472, 38, { c: col, r: 8, sw: 2, fill: '#0b1220' });
    s += T(28, y + 25, n, { fs: 14.5, b: true, mono: true });
    s += T(474, y + 25, d, { fs: 13, c: col, a: 'end' });
  });
  // đích
  const B = (x, y, w, h, t, d1, d2, col) => R(x, y, w, h, { c: col, r: 12, fill: '#0b1220' }) +
    T(x + 16, y + 28, t, { fs: 16, b: true, c: col }) + T(x + 16, y + 52, d1, { fs: 14, mono: true }) + (d2 ? T(x + 16, y + 74, d2, { fs: 13.5, c: 'mu' }) : '');
  s += B(720, 22, 430, 92, '📦 TẠO TÁC = git archive HEAD', 'app-a937b99.tar.gz · 12 KB · 24 mục', 'chỉ thứ đã commit, tại MỘT commit', 'grn');
  s += B(720, 140, 430, 92, '🔨 DỰNG LẠI trên máy đích', 'npm ci → node_modules · npm run build', 'đúng hệ điều hành, đúng libc, đúng Node', 'blu');
  s += B(720, 258, 430, 92, '🖥 SỐNG TRÊN VPS, deploy không đụng', '/srv/app/chung/  .env  tai-len/  logs/', 'liên kết mềm vào từng bản phát hành', 'amb');
  s += R(720, 366, 430, 44, { c: 'dim', r: 10, dash: true }) + T(736, 394, '✗ không đi đâu: .git/ · *.orig', { fs: 14.5, c: 'mu' });
  // mũi tên
  s += A(490, 67, 714, 58, { c: 'grn' }) + A(490, 112, 714, 80, { c: 'tea', dash: true });
  s += A(490, 157, 714, 176, { c: 'blu', dash: true }) + A(490, 202, 714, 200, { c: 'blu', dash: true });
  s += A(490, 292, 714, 300, { c: 'red', dash: true }) + A(490, 337, 714, 322, { c: 'amb', dash: true });
  s += A(490, 247, 714, 380, { c: 'dim', dash: true }) + A(490, 382, 714, 392, { c: 'dim', dash: true });
  s += T(600, 50, 'đi', { fs: 13.5, c: 'grn', a: 'middle', b: true });
  s += T(610, 142, 'KHÔNG chép', { fs: 13.5, c: 'blu', a: 'middle', b: true });
  s += T(650, 276, 'đã có sẵn', { fs: 13.5, c: 'amb', a: 'middle', b: true });
  return sv(1150, 414, s);
};

/* Slide 10 — 10 byte đầu của một tệp gzip (RFC 1952), bốn lần nén THẬT */
const gzHdr = () => {
  const H = [['1f', 'ID1', 'dim'], ['8b', 'ID2', 'dim'], ['08', 'CM', 'dim'], ['FLG', 'cờ', 'vio'], ['', 'MTIME', 'red'], ['', '', 'red'], ['', '', 'red'], ['', '', 'red'], ['XFL', '', 'dim'], ['OS', '', 'dim']];
  const rows = [
    ['Ubuntu · echo hi | gzip', '1f 8b 08 00 00 00 00 00 00 03', 'grn', 'ống dẫn ⇒ MTIME = 0 ⇒ tái lập'],
    ['Ubuntu · gzip -c f.txt', '1f 8b 08 08 c3 0f bb 6a 00 03', 'red', 'tệp có tên ⇒ ghi mtime + tên'],
    ['Mac · echo hi | gzip', '1f 8b 08 00 bb 0f bb 6a 00 03', 'red', 'Apple gzip ghi GIỜ HIỆN TẠI'],
    ['cả hai · gzip -n', '1f 8b 08 00 00 00 00 00 00 03', 'grn', '-n: không tên, không giờ'],
  ];
  const W = 52, x0 = 290;
  let s = '';
  s += R(x0 + 4 * W + 2, 4, 4 * W - 4, 44, { c: 'red', r: 8, fill: 'rgba(248,81,73,.10)', sw: 2 });
  s += T(x0 + 6 * W, 32, 'byte 5–8 = MTIME', { fs: 15, b: true, a: 'middle', c: 'red' });
  [0, 1, 2, 3, 8, 9].forEach((i) => s += T(x0 + i * W + W / 2, 32, H[i][0] ? H[i][1] : '', { fs: 13, a: 'middle', c: H[i][2] === 'vio' ? 'vio' : 'mu' }));
  rows.forEach(([lb, hex, col, note], r) => {
    const y = 62 + r * 62;
    s += T(0, y + 26, lb, { fs: 14.5, b: true, mono: true });
    hex.split(' ').forEach((b, i) => {
      const hot = i >= 4 && i <= 7, fl = i === 3;
      const cc = hot ? (b === '00' ? 'grn' : 'red') : fl ? (b === '08' ? 'vio' : 'dim') : 'dim';
      s += R(x0 + i * W + 3, y, W - 6, 40, { c: cc, r: 6, sw: 1.8, fill: hot && b !== '00' ? 'rgba(248,81,73,.12)' : '#0b1220' });
      s += T(x0 + i * W + W / 2, y + 27, b, { fs: 17, b: true, a: 'middle', mono: true, c: cc === 'dim' ? '#e6edf3' : cc });
    });
    s += T(x0 + 10 * W + 18, y + 26, note, { fs: 14.5, c: col });
  });
  s += T(0, 318, 'FLG 08 = FNAME: có lưu tên tệp · MTIME đọc little-endian: 6a bb 0f c3 = 1790644163 = 29/09/2026 01:09 UTC', { fs: 13.5, c: 'mu' });
  return sv(1150, 326, s);
};

/* Slide 8 — đường đi: commit → git archive → gzip -n → tệp + .sha256 */
const gaDong = () => diagram({
  w: 1150, h: 170,
  nodes: [
    { id: 'c', x: 0, y: 40, w: 190, h: 84, t: 'commit a937b99', d: 'cây tệp đã chốt', c: 'vio', mono: true },
    { id: 'a', x: 280, y: 40, w: 230, h: 84, t: 'git archive', d: 'chỉ tệp ĐÃ commit\nmtime = giờ commit', c: 'grn', mono: true },
    { id: 'g', x: 600, y: 40, w: 200, h: 84, t: 'gzip -n', d: 'không tên, không giờ', c: 'blu', mono: true },
    { id: 'f', x: 890, y: 40, w: 260, h: 84, t: 'app-a937b99.tar.gz', d: '+ tệp .sha256 đi kèm', c: 'dv', mono: true },
  ],
  edges: [
    { from: 'c', to: 'a', t: 'HEAD', c: 'vio' },
    { from: 'a', to: 'g', t: 'tar', c: 'grn' },
    { from: 'g', to: 'f', t: '> tệp', c: 'blu' },
  ],
});

/* Slide 19 — tên bản cắt nghĩa */
const tenBan = () => {
  const str = '20260929-011106-9310ba1';
  const fs = 44, cw = fs * 0.602, x0 = Math.round((1150 - str.length * cw) / 2);
  let s = R(x0 - 24, 4, str.length * cw + 48, 68, { c: 'bd', fill: '#05080d', r: 12, sw: 2 });
  const parts = [[0, 8, 'dv', 'NGÀY (UTC)', 'YYYYMMDD — năm trước'], [9, 15, 'blu', 'GIỜ (UTC)', 'HHMMSS — không đụng múi giờ'], [16, 23, 'grn', 'COMMIT', 'git rev-parse --short HEAD']];
  let last = 0;
  parts.forEach(([a, b, col]) => {
    if (a > last) s += `<text x="${(x0 + last * cw).toFixed(1)}" y="54" font-size="${fs}" fill="#6b7b70" font-family="${MONO}" font-weight="700" xml:space="preserve">${esc(str.slice(last, a))}</text>`;
    s += `<text x="${(x0 + a * cw).toFixed(1)}" y="54" font-size="${fs}" fill="${D[col]}" font-family="${MONO}" font-weight="700">${esc(str.slice(a, b))}</text>`;
    last = b;
  });
  parts.forEach(([a, b, col, t, d]) => {
    const x1 = x0 + a * cw + 2, x2 = x0 + b * cw - 2, mid = (x1 + x2) / 2;
    s += `<path d="M${x1} 82 L${x1} 90 L${x2} 90 L${x2} 82" stroke="${D[col]}" stroke-width="3" fill="none"/>`;
    s += T(mid, 116, t, { fs: 17, b: true, a: 'middle', c: col }) + T(mid, 138, d, { fs: 14, a: 'middle', c: 'mu' });
  });
  return sv(1150, 146, s);
};

/* Slide 20 — tệp phiên bản commit vào kho luôn gọi tên CHA */
const gaTrung = () => {
  let s = '';
  const C = (x, h, msg, file, col) => R(x, 20, 330, 150, { c: col, r: 14, fill: '#0b1220' }) +
    T(x + 18, 52, `● ${h}`, { fs: 20, b: true, mono: true, c: col }) + T(x + 18, 78, msg, { fs: 14.5, c: 'mu' }) +
    R(x + 18, 94, 294, 58, { c: 'bd', r: 8, fill: '#05080d', sw: 1.5 }) + T(x + 30, 118, 'src/phien-ban.json', { fs: 13, c: 'mu', mono: true }) +
    T(x + 30, 142, file, { fs: 15, mono: true, b: true, c: col === 'red' ? 'red' : 'tx' });
  s += C(0, '4d0c4ac', 'bo export-ignore', '{"commit":"…cha của nó…"}', 'dim');
  s += C(410, '962ceea', 'them /version  ← ĐANG CHẠY', '{"commit":"4d0c4ac"}', 'red');
  s += A(406, 96, 334, 96, { c: 'dim' }) + T(370, 88, 'cha', { fs: 13, a: 'middle', c: 'mu' });
  s += `<path d="M${560} 172 C 560 230, 170 230, 165 176" stroke="${D.red}" stroke-width="3" fill="none" stroke-dasharray="7 6" marker-end="url(#m-red)"/>`;
  s += T(365, 238, 'tệp trong 962ceea gọi tên 4d0c4ac', { fs: 15, a: 'middle', c: 'red', b: true });
  s += R(800, 20, 350, 220, { c: 'amb', r: 14, fill: 'rgba(210,153,34,.07)' });
  s += T(818, 50, 'Con gà – quả trứng', { fs: 17, b: true, c: 'amb' });
  ['1. muốn ghi mã băm vào tệp', '2. mã băm tính TỪ nội dung,', '    gồm cả chính tệp đó', '3. ghi xong ⇒ mã băm ĐỔI', '⇒ tệp mãi gọi tên commit trước'].forEach((l, i) =>
    s += T(818, 84 + i * 30, l, { fs: 15, c: i === 4 ? 'red' : 'tx', b: i === 4 }));
  return sv(1150, 250, s);
};

/* Slide 24 — cp ghi TẠI CHỖ (giữ inode) / mv thay MỤC THƯ MỤC (inode mới) */
const inodeSvg = () => {
  let s = '';
  const P = (x, title, col, bNode, aTxt, bTxt, note) => {
    s += R(x, 0, 360, 300, { c: col, r: 14, fill: 'rgba(255,255,255,.02)', dash: true });
    s += T(x + 18, 30, title, { fs: 17, b: true, mono: true, c: col });
    s += R(x + 20, 56, 120, 40, { c: 'blu', r: 8 }) + T(x + 80, 82, 'a.txt', { fs: 15, a: 'middle', mono: true, b: true });
    s += R(x + 20, 176, 120, 40, { c: 'blu', r: 8 }) + T(x + 80, 202, 'b.txt', { fs: 15, a: 'middle', mono: true, b: true });
    s += R(x + 200, 56, 140, 70, { c: 'vio', r: 10 }) + T(x + 270, 82, 'inode 992893', { fs: 13.5, a: 'middle', mono: true }) + T(x + 270, 108, aTxt, { fs: 15, a: 'middle', b: true, c: aTxt === 'GOC' ? 'grn' : 'red', mono: true });
    s += A(x + 142, 76, x + 196, 86, { c: 'blu' });
    if (bNode) {
      s += R(x + 200, 166, 140, 70, { c: 'grn', r: 10 }) + T(x + 270, 192, 'inode 1886675', { fs: 13.5, a: 'middle', mono: true }) + T(x + 270, 218, bTxt, { fs: 15, a: 'middle', b: true, c: 'grn', mono: true });
      s += A(x + 142, 196, x + 196, 200, { c: 'grn' });
    } else s += A(x + 142, 196, x + 206, 128, { c: 'red' });
    s += T(x + 18, 264, note[0], { fs: 14.5, c: col, b: true }) + T(x + 18, 286, note[1], { fs: 13.5, c: 'mu' });
  };
  P(0, '>> b.txt', 'red', false, 'GOC THEM', '', ['ghi nối: a.txt đổi theo', 'hai tên, MỘT bộ khối dữ liệu']);
  P(395, 'cp moi b.txt', 'red', false, 'TU CP', '', ['cp mở rồi CẮT TRẮNG tại chỗ', 'inode giữ nguyên ⇒ a.txt đổi theo']);
  P(790, 'mv moi b.txt', 'grn', true, 'GOC', 'mới', ['mv thay MỤC THƯ MỤC', 'b.txt sang inode mới, a.txt nguyên']);
  return sv(1150, 302, s);
};

/* Slide 27 — đĩa đầy vì cache build (chuyện thật 18/08/2026) */
const diaDay = () => {
  let s = '';
  const bar = (y, lb, segs, note, nc) => {
    s += T(0, y + 24, lb, { fs: 15, b: true });
    let x = 250;
    segs.forEach(([w, t, col, fill]) => {
      s += R(x, y, w, 38, { c: col, r: 6, fill: fill || 'rgba(255,255,255,.04)', sw: 2 });
      if (t) s += T(x + w / 2, y + 25, t, { fs: 14, a: 'middle', b: true, c: col });
      x += w + 4;
    });
    s += T(250, y + 62, note, { fs: 14, c: nc || 'mu' });
  };
  bar(10, 'Đĩa VPS — thường ngày', [[250, 'Postgres + hệ thống', 'vio'], [220, 'ảnh đang chạy', 'blu'], [330, 'cache build 7,6 GB', 'amb', 'rgba(210,153,34,.14)'], [80, 'trống', 'grn']],
    'cache build: tầng trung gian của MỌI lần build cũ, không ai dọn — cùng đĩa với Postgres', 'amb');
  bar(110, 'Giữa lúc next build', [[250, 'Postgres + hệ thống', 'vio'], [220, 'ảnh đang chạy', 'blu'], [330, 'cache build 7,6 GB', 'amb', 'rgba(210,153,34,.14)'], [80, 'build mới', 'red', 'rgba(248,81,73,.16)']],
    'đĩa tụt còn 1,8 GB ⇒ "no space left on device" ⇒ deploy chết giữa chừng, Postgres suýt chết theo', 'red');
  bar(210, 'Sau khi sửa', [[250, 'Postgres + hệ thống', 'vio'], [220, 'ảnh đang chạy', 'blu'], [120, 'ảnh cũ N bản', 'tea'], [290, 'TRỐNG', 'grn', 'rgba(63,185,80,.10)']],
    'build ở máy nhà, VPS chỉ kéo ảnh về · dọn cache theo nhãn/thời gian · giữ N bản lùi (Ch13)', 'grn');
  s += T(250, 302, '(bề rộng chỉ minh hoạ — con số THẬT duy nhất là 7,6 GB và 1,8 GB, CLAUDE.md của dự án)', { fs: 12.5, c: 'dim' });
  return sv(1150, 310, s);
};

export const slides = S([
  cover({ t: 'Chương 1 — Tạo tác', sub: 'thứ gì được gửi đi · git archive · tái lập tới từng byte · npm ci · tên bản phát hành · giữ bản cũ mà không đầy đĩa', chap: 'CHƯƠNG 1' }),

  { t: 'Bản đồ chương: tạo tác là một HÀM của commit', body: mindmap('Tạo tác', 'cùng commit ⇒ cùng byte', [
    { t: '1.1 Cây làm việc có gì', d: 'nguồn · dẫn xuất · trạng thái · cấu hình · bốn file loại trừ', c: 'blu' },
    { t: '1.2 Tái lập được', d: 'git archive · gzip -n · SOURCE_DATE_EPOCH · sha256', c: 'grn' },
    { t: '1.3 Khi phải DỰNG', d: 'npm ci ≠ npm install · nền tảng · set -e', c: 'vio' },
    { t: '1.4 Tên bản + /version', d: 'UTC + commit · đóng dấu lúc dựng', c: 'tea' },
    { t: '1.5 Giữ bản cũ', d: 'liên kết cứng · cp vs mv · dọn · đĩa đầy', c: 'amb' },
    { t: 'Ch13: tạo tác là ẢNH', d: 'digest · registry · build đúng nền tảng', c: 'pnk' },
  ]) },

  /* ───────────── 1.1 ───────────── */
  { t: 'Cây làm việc ≠ tạo tác: cái gì đi, cái gì ở', body: cayTaoTac() },

  { t: 'Gói ngây thơ chở theo mật khẩu và rác', body: FIX + two(
    term([
      '$ tar czf tho.tgz .                      # cả cây',
      '$ tar czf ex.tgz --exclude=.git --exclude=node_modules \\',
      '    --exclude=.env --exclude=tai-len --exclude=logs --exclude=dist .',
      '$ git archive --format=tar.gz HEAD > ga.tgz',
      '# cỡ   · số mục · tệp nguy hiểm lọt vào',
      '! tho    5.0M  1012 muc  ./.env ./.env.production ./src/server.js.orig',
      '+ ex      12K    27 muc  ./.env.production ./src/server.js.orig',
      '= ga      12K    24 muc',
    ], { title: 'VPS thí nghiệm — Ubuntu 24.04, GNU tar 1.35', fs: 12.5 }),
    `${bars([
      { l: 'tar cả cây', sub: '1012 mục', v: 5000, txt: '5,0 MB', c: 'red' },
      { l: 'tar --exclude ×6', sub: '27 mục', v: 12, txt: '12 KB ⚠ .env.prod', c: 'amb' },
      { l: 'git archive HEAD', sub: '24 mục', v: 12, txt: '12 KB ✓', c: 'grn' },
    ], { lw: 190 })}
    ${box('bad', 'Danh sách loại trừ viết tay đã nhớ <code>.env</code> — và quên <code>.env.production</code> tạo tuần sau. <code>git archive</code> không cần nhớ: tệp chưa commit thì không có mặt.')}`, 'l') },

  { t: 'Phép thử: xoá trên máy chủ thì có mất gì?', body: `${cards([
    { ic: '📄', t: 'NGUỒN — đi', d: '<code>src/</code>, migration, <code>package.json</code>, <strong>lockfile</strong>. Xoá? <strong>Không mất</strong> — nó ở trong git.', c: 'grn' },
    { ic: '🔨', t: 'DẪN XUẤT — dựng lại', d: '<code>node_modules</code>, <code>dist</code>, <code>.next</code>. Xoá? <strong>Không mất</strong> — chạy <code>npm ci</code>, <code>npm run build</code> TRÊN máy đích.', c: 'blu' },
    { ic: '🗃', t: 'TRẠNG THÁI — ở VPS', d: 'ảnh tải lên, log, SQLite, cache. Xoá? <strong>MẤT VĨNH VIỄN</strong> ⇒ để ở <code>chung/</code>, ngoài mọi bản.', c: 'amb' },
    { ic: '🔑', t: 'CẤU HÌNH — ở VPS', d: '<code>.env</code>, chứng chỉ, khoá. Xoá? <strong>Web dừng</strong>. Không bao giờ nằm trong tạo tác (Ch4).', c: 'red' },
  ], 4)}
  ${box('tip', 'Không cần thuộc danh sách — chỉ cần hỏi đúng câu cho từng đường dẫn. Trả lời "có mất" ⇒ nó KHÔNG được nằm trong thứ một lần deploy ghi đè.')}` },

  { t: 'Bốn file loại trừ, bốn luật khác nhau', body: FIX + table(['Công cụ', 'Đọc file nào', 'Đo thật trên ~/du-an', 'Bẫy'], [
    ['<code>git archive</code>', 'chỉ tệp đã commit · <code>.gitattributes</code> <code>export-ignore</code>', '+24 mục, 12 KB · không <code>.env*</code>', 'tệp chưa commit KHÔNG đi — kể cả tệp bạn cần'],
    ['<code>rsync --exclude-from=.gitignore</code>', 'mẫu rsync (GẦN giống gitignore)', 'bỏ được <code>node_modules/</code> · <code>.env</code>', '-gửi <code>.env.production</code> (chưa có trong .gitignore)'],
    ['<code>tar --exclude-vcs-ignores</code>', '<code>.gitignore</code> theo luật của TAR', 'bỏ <code>.env</code>, bỏ <code>.git</code>', '-GIỮ <code>node_modules/</code>: 892 mục — mẫu có <code>/</code> cuối không khớp'],
    ['<code>.dockerignore</code>', 'build context của <code>docker build</code>', '<code>/app</code>: 27M → 132K', '<code>.gitignore</code> KHÔNG có tác dụng ở đây'],
    ['<code>.gitignore</code>', 'chỉ <code>git add</code> / <code>git status</code>', '—', '-rsync, tar, scp, docker: KHÔNG đọc'],
  ], { sm: true }) + box('warn', 'Cú pháp mẫu của rsync, tar, Docker chỉ <strong>giao nhau</strong> với gitignore. Viết một danh sách rồi tin nó đúng cho cả bốn là cách <code>node_modules</code> 27 MB lọt vào gói.') },

  { t: 'Kiểm kê 5 phút: thứ git cố tình không nhìn', body: FIX + two(
    sh([
      ['du -sh */ .git | sort -rh | head', 'cái gì to nhất'],
      ['git status --porcelain --ignored', '?? chưa theo dõi · !! bị bỏ qua'],
      ["find . -name '.env*' -not -path './.git/*'", 'bí mật nằm đâu'],
      ['git archive HEAD | tar t | head -20', 'tạo tác sẽ chứa gì'],
    ], { fs: 14.5 }) +
    table(['Mã', 'Nghĩa', 'Làm gì'], [
      ['<code>??</code>', 'chưa commit, CHƯA bị bỏ qua', '!quyết định: commit hay thêm vào .gitignore'],
      ['<code>!!</code>', 'bị .gitignore bỏ qua', 'không vào tạo tác — có nên ở máy chủ?'],
    ], { sm: true }),
    term([
      '$ du -sh */ .git | sort -rh | head -4',
      '27M	node_modules/',
      '360K	.git',
      '300K	tai-len/',
      '60K	src/',
      '$ git status --porcelain --ignored',
      '! ?? .env.production',
      '! ?? src/server.js.orig',
      '!! .env',
      '!! dist/',
      '!! logs/',
      '!! node_modules/',
      '!! tai-len/',
      "$ find . -name '.env*' -not -path './.git/*'",
      './.env',
      './.env.production',
    ], { title: 'VPS thí nghiệm — ~/du-an', fs: 13.5 }), 'l') },

  /* ───────────── 1.2 ───────────── */
  { t: 'git archive: bắt đầu từ SỐ KHÔNG', body: FIX + `${gaDong()}
    ${two(
      sh([
        ['git archive --format=tar HEAD | gzip -n > app.tar.gz', 'một commit, nén tái lập'],
        ['git archive --format=tar.gz v2.1.0 > v2.1.0.tar.gz', 'tag/nhánh/commit đều được'],
        ['git archive --prefix=app/ HEAD | tar t | head', 'thêm thư mục gốc · xem trước'],
        ['git archive HEAD src/ package*.json | tar t', 'chỉ vài đường dẫn'],
      ], { fs: 13.5 }),
      table(['Cờ', 'Làm gì'], [
        ['<code>--format=tar|tar.gz|zip</code>', 'định dạng (tar.gz: git tự nén)'],
        ['<code>--prefix=app/</code>', 'mọi mục nằm trong <code>app/</code>'],
        ['<code>--worktree-attributes</code>', 'đọc .gitattributes ở cây làm việc'],
        ['<code>HEAD</code> · <code>v2.1.0</code> · <code>a937b99</code>', 'CHỤP cái gì — tệp chưa commit không đi'],
      ], { sm: true }), 'l')}` },

  { t: 'Cùng commit, Mac và Ubuntu: cùng sha256', body: FIX + two(
    term([
      '$ git clone -q du-an b1; sleep 2; git clone -q du-an b2',
      '$ for b in b1 b2; do (cd $b && git archive --format=tar.gz \\',
      '    --prefix=app/ HEAD > /tmp/o/ga-$b.tgz); done',
      '$ sha256sum ga-*.tgz',
      '= 5319192c9d739e77b5660f016e5b960bf5d6300f255003cb4f0a38955df8081c  ga-b1.tgz',
      '= 5319192c9d739e77b5660f016e5b960bf5d6300f255003cb4f0a38955df8081c  ga-b2.tgz',
      '$ git --version',
      'git version 2.43.0',
    ], { title: 'VPS thí nghiệm — hai bản clone, cách nhau 2 giây', fs: 12.5 }) +
    term([
      '$ git archive --format=tar.gz --prefix=app/ HEAD | shasum -a 256',
      '= 5319192c9d739e77b5660f016e5b960bf5d6300f255003cb4f0a38955df8081c  -',
      '$ git --version',
      'git version 2.51.1',
    ], { title: 'Mac M1 — cùng commit, git khác phiên bản', fs: 12.5 }),
    `${box('good', '<strong>Vì sao giống:</strong> git lấy nội dung, quyền, đường dẫn từ đối tượng commit; mtime trong header tar là <strong>giờ commit</strong>; <code>tar.gz</code> dùng bộ nén gzip dựng sẵn của git, MTIME = 0. Không có gì của cái máy hay cái khoảnh khắc lọt vào.')}
    ${box('warn', '<strong>Windows:</strong> <code>core.autocrlf=true</code> (mặc định của Git for Windows) làm <code>git archive</code> xuất <strong>CRLF</strong> — đo trên Mac với <code>-c core.autocrlf=true</code>: sha đổi từ <code>4c0653cc…</code> thành <code>e4ce4bda…</code>. Sửa: <code>* text=auto eol=lf</code> trong <code>.gitattributes</code> ⇒ về lại <code>4c0653cc…</code>.')}`, 'l') },

  { t: 'Byte 5–8 của gzip là GIỜ — Mac luôn ghi', body: FIX + `${gzHdr()}
    ${two(
      box('bad', 'Câu "nén từ ống dẫn thì tái lập" chỉ đúng với <strong>GNU gzip</strong> (Ubuntu, Fedora). <strong>Apple gzip</strong> trên Mac ghi giờ hiện tại cả khi đọc từ ống: hai lần <code>echo hi | gzip</code> cách 1,2 s cho hai sha256 khác nhau.'),
      box('good', 'Một cờ chữa cả ba trường hợp: <strong><code>gzip -n</code></strong> — không lưu tên, không lưu giờ. Hoặc để <code>git archive --format=tar.gz</code> tự nén (MTIME = 0 ở mọi máy).'))}` },

  { t: 'tar thường khác nhau mỗi lần clone', body: FIX + two(
    term([
      '$ (cd b1 && tar czf ../tar-b1.tgz --exclude=.git .)',
      '$ (cd b2 && tar czf ../tar-b2.tgz --exclude=.git .)',
      '$ sha256sum tar-b*.tgz',
      '! 93349a07…ffde6d  tar-b1.tgz',
      '! 023236e1…4e5476  tar-b2.tgz',
      '$ tar tvzf tar-b1.tgz --full-time ./package.json',
      '-rw-rw-r-- deploy/deploy 149 2026-09-29 01:08:47 ./package.json',
      '$ tar tvzf tar-b2.tgz --full-time ./package.json',
      '-rw-rw-r-- deploy/deploy 149 2026-09-29 01:08:49 ./package.json',
      '$ cmp -l <(zcat tar-b1.tgz) <(zcat tar-b2.tgz) | wc -l',
      '94',
    ], { title: 'VPS thí nghiệm — hai bản clone', fs: 12.5 }),
    `${sh([
      ['export SOURCE_DATE_EPOCH=$(git log -1 --format=%ct)', 'giờ commit, giây Unix'],
      ['PAX=exthdr.name=%d/PaxHeaders/%f,delete=atime,delete=ctime', ''],
      ['tar --sort=name \\', 'thứ tự không theo đĩa'],
      ['  --mtime="@$SOURCE_DATE_EPOCH" \\', 'mọi tệp một giờ'],
      ['  --owner=0 --group=0 --numeric-owner \\', 'bỏ tên người build'],
      ['  --pax-option="$PAX" \\', 'bỏ atime/ctime'],
      ['  --exclude=.git -cf - . | gzip -n > rep.tgz', ''],
    ], { fs: 12.5 })}
    ${term(['$ sha256sum rep-b*.tgz', '= 2afd2824…80d522ab  rep-b1.tgz', '= 2afd2824…80d522ab  rep-b2.tgz', '$ tar tvzf rep-b1.tgz --full-time ./package.json', '-rw-rw-r-- 0/0 149 2026-09-29 01:00:00 ./package.json'], { title: 'Cùng hai bản clone — giờ thì GIỐNG', fs: 12.5 })}`, 'l') },

  { t: 'Bảng cờ tar tái lập được — bsdtar không có', body: FIX + two(
    table(['Thứ rò rỉ vào tar', 'Cờ GNU tar chặn nó', 'Nếu thiếu'], [
      ['mtime của từng tệp', '<code>--mtime="@$SOURCE_DATE_EPOCH"</code>', 'clone/checkout = giờ hiện tại'],
      ['thứ tự đọc thư mục', '<code>--sort=name</code> (tar ≥ 1.28)', 'theo readdir — khác giữa hai đĩa'],
      ['tên + số người dùng', '<code>--owner=0 --group=0 --numeric-owner</code>', '"deploy/deploy" · uid 1000'],
      ['atime/ctime trong header PAX', '<code>--pax-option=…delete=atime,delete=ctime</code>', 'đổi mỗi lần đọc tệp'],
      ['MTIME của gzip', '<code>| gzip -n</code>', 'giờ nén (Mac, tệp có tên)'],
      ['thứ tự sắp theo locale', '<code>LC_ALL=C</code> nếu dùng <code>find | sort</code>', 'máy tiếng Việt sắp khác máy C'],
    ], { sm: true }),
    `${term(['$ tar --sort=name -cf /dev/null .', '! tar: Option --sort=name is not supported', '$ tar --mtime=@1790643600 -cf /dev/null .', '! tar: Option --mtime=@1790643600 is not supported', '$ tar --version', 'bsdtar 3.5.3 - libarchive 3.7.4 …'], { title: 'Mac M1 — tar của macOS là bsdtar', fs: 12.5 })}
    ${box('tip', '<strong>SOURCE_DATE_EPOCH</strong> là quy ước chung của reproducible-builds.org: một biến môi trường chứa "giờ của mã nguồn" — thường là giờ commit — mà nhiều công cụ dựng tự đọc thay cho giờ hiện tại. Trên Mac: <code>git archive</code> (không cần tar), hoặc <code>brew install gnu-tar</code> → <code>gtar</code>.')}`, 'l') },

  { t: 'Script đóng gói TỪ CHỐI cây bẩn', body: FIX + two(
    sh([
      ['#!/bin/bash', ''],
      ['set -euo pipefail', 'lỗi ⇒ dừng; biến rỗng ⇒ dừng'],
      ['COMMIT=$(git rev-parse --short HEAD)', 'a937b99'],
      ['TEN="app-${COMMIT}.tar.gz"', ''],
      ['if [ -n "$(git status --porcelain)" ]; then', 'có gì chưa commit?'],
      ['  echo "Cay lam viec con thay doi chua commit. Dung." >&2', ''],
      ['  git status --porcelain >&2', 'in ra CÁI GÌ bẩn'],
      ['  exit 1', ''],
      ['fi', ''],
      ['git archive --format=tar --prefix=app/ HEAD | gzip -n > "$TEN"', ''],
      ['sha256sum "$TEN" | tee "${TEN}.sha256"', 'mã băm đi KÈM tệp'],
    ], { fs: 13.5 }),
    `${term(['$ bash dong-goi.sh; echo "ma thoat: $?"', '! Cay lam viec con thay doi chua commit. Dung.', '! ?? .env.production', '! ?? src/server.js.orig', 'ma thoat: 1'], { title: 'VPS thí nghiệm — ~/du-an (bẩn)', fs: 13 })}
    ${term(['$ bash dong-goi.sh', '= c8253eaa…c47744fc  app-a937b99.tar.gz'], { title: 'bản clone sạch b1', fs: 13 })}
    ${box('warn', 'Thiếu phép kiểm này, tên tệp nói <code>a937b99</code> mà nội dung là <code>a937b99</code> + thứ chưa commit — mọi câu hỏi "máy nào chạy bản nào" về sau đều được trả lời SAI một cách lặng lẽ.')}`, 'l') },

  /* ───────────── 1.3 ───────────── */
  { t: 'npm ci từ chối — npm install tự ý sửa', body: FIX + `${vs({
    no: { t: 'npm install trên máy chủ', items: [
      'package.json đòi <code>semver ^6</code>, lockfile ghim <code>7.8.5</code>',
      '<code>changed 1 package</code> — cài <strong>6.3.1</strong>, khác MAJOR',
      '<strong>GHI LẠI</strong> <code>package-lock.json</code> trong thư mục bản',
      'thoát <strong>0</strong> ⇒ deploy báo XANH, chạy thứ chưa ai kiểm',
    ] },
    yes: { t: 'npm ci trên máy chủ', items: [
      'đọc ĐÚNG lockfile, không giải phụ thuộc',
      '<code>npm error code EUSAGE</code> — nêu đích danh chỗ lệch',
      'không ghi gì; xoá <code>node_modules</code> rồi cài lại từ đầu',
      'thoát <strong>1</strong> ⇒ <code>set -e</code> dừng deploy TRƯỚC khi tráo',
    ] },
  })}
  ${table(['Hệ sinh thái', 'Lệnh "cài đúng lockfile, sai thì hỏng"'], [
    ['npm · yarn 1 · pnpm', '<code>npm ci</code> · <code>yarn install --frozen-lockfile</code> · <code>pnpm install --frozen-lockfile</code>'],
    ['PHP · Python · Ruby', '<code>composer install</code> (không <code>update</code>) · <code>pip install -r</code> bản ghim · <code>bundle install</code> với <code>deployment true</code>'],
  ], { sm: true })}` },

  { t: 'node_modules chép từ Mac chết trên Linux', body: FIX + two(
    term([
      '# node_modules cài trên Mac M1, chép lên VPS',
      '$ ls node_modules/@esbuild',
      'darwin-arm64',
      '$ node -e \'require("esbuild").transformSync("let a=1")\'',
      '! Error:',
      '! You installed esbuild for another platform than the one',
      "! you're currently using. …",
      '! Specifically the "@esbuild/darwin-arm64" package is present',
      '! but this platform needs the "@esbuild/linux-arm64" package',
      '# cài lại TRÊN máy đích, cùng lockfile',
      '$ npm ci',
      'added 2 packages in 5s',
      '$ ls node_modules/@esbuild',
      '= linux-arm64',
    ], { title: 'VPS thí nghiệm — esbuild 0.24.0', fs: 12.5 }),
    `${sh([
      ['grep -c \'"node_modules/@esbuild/\' package-lock.json', ''],
      ['24', '24 nền tảng trong MỘT lockfile'],
    ], { fs: 14, so: false })}
    ${table(['Lockfile ghim', 'Lockfile KHÔNG ghim'], [
      ['+phiên bản + mã băm <code>integrity</code>', '-hệ điều hành / CPU (chọn lúc cài)'],
      ['+cây phụ thuộc chính xác', '-libc: glibc hay musl (Alpine)'],
      ['+nguồn tải <code>resolved</code>', '-phiên bản Node · npm'],
    ], { sm: true })}
    ${box('bad', 'Cùng hình dạng với sự cố thật 18/08: ảnh Alpine (musl) mang engine Prisma <code>debian-openssl-3.0.x</code> (glibc) — build xanh, đẩy xanh, tráo xanh, rồi <strong>API 502 bảy phút</strong>.')}`, 'l') },

  { t: 'Hai lần npm ci: cùng một cây tới từng byte', body: FIX + two(
    `${sh([
      ['bam() { find node_modules -type f -print0 | sort -z |', 'mã băm của'],
      ['  xargs -0 sha256sum | sha256sum | cut -c1-16; }', 'MỌI tệp đã cài'],
    ], { fs: 13, so: false })}
    ${term([
      '$ bash npm.sh      # npm ci ×2 rồi --omit=dev, in bam',
      'added 70 packages in 983ms',
      '= lan 1: 6d234c86513366d5  743 tep',
      'added 70 packages in 714ms',
      '= lan 2: 6d234c86513366d5',
      'added 69 packages in 448ms',
      '+ omit=dev: 6c444d08bf053094  622 tep, 4.4M',
], { title: 'VPS thí nghiệm — express 4.21.2 + typescript 5.6.3', fs: 12.5 })}`,
    `${table(['Cờ của <code>npm ci</code>', 'Làm gì — dùng khi nào'], [
      ['<code>--omit=dev</code>', 'bỏ devDependencies (27M → 4.4M) — khi build KHÔNG cần chúng'],
      ['<code>--ignore-scripts</code>', 'không chạy <code>postinstall</code> — nếu phụ thuộc sống được'],
      ['<code>--no-audit --no-fund</code>', 'bớt lượt gọi mạng + chữ thừa — luôn, trong script'],
      ['<code>--prefer-offline</code>', 'dùng cache <code>~/.npm</code> trước — máy chủ mạng chậm'],
      ['<code>--loglevel=error</code>', 'chỉ in lỗi — log deploy gọn'],
    ], { sm: true })}
    ${box('tip', 'Build cần TypeScript (dev)? <code>npm ci</code> → <code>npm run build</code> → <code>npm prune --omit=dev</code>. Làm ngược thứ tự là build hỏng TRÊN máy chủ, chạy tốt ở mọi nơi khác.')}`, 'l') },

  { t: 'set -e tắt trong danh sách || và &&', body: FIX + two(
    sh([
      '# A — subshell trong danh sách ||',
      '( set -e; npm ci; echo "di tiep" ) || echo "dung lai"',
      '# B — set -e đầu tệp, lệnh đứng một mình',
      'set -e',
      'npm ci          # hỏng ⇒ dừng, thoát 1',
      'echo "di tiep"',
      '# C — "cảnh báo cho chắc"',
      'set -e',
      'npm ci || echo "canh bao: npm ci hong"',
      'echo "di tiep sang buoc build"',
    ], { fs: 14 }),
    `${term([
      '# package.json: express ^3.0.0 · lock: 4.21.2', '$ bash sete.sh',
      '== A: ( set -e; npm ci; echo di tiep ) || echo dung lai',
      '! di tiep — npm ci da hong ma KHONG ai dung',
      '== B: set -e o dau tep, npm ci dung mot minh',
      '= ma thoat cua B: 1',
      '== C: set -e + "|| echo canh bao"',
      'canh bao: npm ci hong',
      '! di tiep sang buoc build',
      '! ma thoat cua C: 0',
    ], { title: 'VPS thí nghiệm — bash 5.2', fs: 12.5 })}
    ${box('bad', '<code>man bash</code>: <code>-e</code> không áp cho lệnh nằm trong danh sách <code>&amp;&amp;</code>/<code>||</code> (trừ lệnh cuối), trong điều kiện <code>if</code>/<code>while</code>, hay sau <code>!</code>. Muốn cảnh báo mà vẫn dừng: <code>npm ci || { echo "…" &gt;&amp;2; exit 1; }</code>.')}`, 'l') },

  { t: 'Dựng ở đâu: khớp NỀN TẢNG, không phải vị trí', body: FIX + `${table(['Nơi dựng', 'Nền tảng khớp?', 'Giá', 'Dùng khi'], [
    ['+① Trên máy đích (<code>npm ci</code> ở VPS)', '+luôn khớp', 'CPU/RAM của VPS — Ch8 đo bị giết', 'mặc định, dự án nhỏ'],
    ['+② Trong ẢNH dựng cho máy đích', '+khớp nếu đúng ảnh nền + <code>--platform</code>', 'cần registry (Ch13)', 'cuongthai.com: build ở nhà → GHCR → VPS tráo'],
    ['!③ Máy dựng giống máy đích', '!nếu OS, CPU, libc, Node đều khớp', 'bốn thứ tự trôi lệch', 'có CI riêng, kiểm kỹ'],
    ['-④ Laptop rồi chép lên', '-macOS/Windows → Linux: SAI', 'hỏng lúc chạy, không lúc build', 'KHÔNG BAO GIỜ (trừ JS thuần + chốt)'],
  ], { sm: true })}
  ${two(
    sh([
      ['set -euo pipefail', ''],
      ['node --version | grep -q "^v22\\." || {', 'CHỐT runtime trước'],
      ['  echo "Sai phien ban Node: $(node --version)" >&2; exit 1; }', ''],
      ['npm ci --omit=dev', ''],
    ], { fs: 13.5 }),
    term(['$ bash D.sh; echo "ma thoat: $?"', '! Sai phien ban Node: v18.19.1', 'ma thoat: 1', '# apt Ubuntu 24.04: Node 18 · máy dev: Node 22'], { title: 'VPS thí nghiệm — chốt runtime', fs: 13 }), 'l')}` },

  /* ───────────── 1.4 ───────────── */
  { t: 'Tên bản: thời gian UTC + commit', body: FIX + `${tenBan()}
    ${two(
      term([
        '# chỉ mã băm: ls sắp theo chữ cái — VÔ NGHĨA',
        '0f92aa  a3f1c9  b8e402  c1d773',
        '# chỉ số đếm: "10" < "9" khi sắp theo chữ',
        '! 10  11  12  9',
        '# thời gian + commit: sắp chữ = sắp thời gian',
        '= 20260929-011058-fdba636',
        '= 20260929-011101-08cd63e',
        '= 20260929-011106-9310ba1',
      ], { title: 'VPS thí nghiệm — ls -1 /srv/app/phat-hanh', fs: 13 }),
      `${sh([
        ['TEN="$(date -u +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"', ''],
        ['git describe --tags --always --dirty', 'nhãn cho NGƯỜI đọc'],
      ], { fs: 12.5, so: false })}
      ${term(['$ git describe --tags --always --dirty', 'v1.0.0-6-g9310ba1', '$ git status --porcelain | head -1', '! ?? .env.production', '$ echo x >> src/m2.js; git describe --tags --always --dirty', '= v1.0.0-6-g9310ba1-dirty'], { title: 'VPS thí nghiệm — --dirty bỏ qua tệp ??', fs: 12.5 })}`, 'l')}` },

  { t: 'Tệp phiên bản commit vào kho gọi tên CHA', body: FIX + `${gaTrung()}
    ${two(
      term(['  HEAD hien tai:                       962ceea', '  commit ghi trong src/phien-ban.json: 4d0c4ac', '  → cha cua HEAD:                      4d0c4ac', '! ❌ LECH: tep phien ban goi ten commit KHAC'], { title: 'output của bài 1.4', fs: 13 }),
      box('good', '<strong>Sửa:</strong> đóng dấu <em>sau</em> khi giải nén tạo tác, lúc DỰNG; thêm <code>src/phien-ban.json</code> vào <code>.gitignore</code> — nó là tệp DẪN XUẤT. Với ảnh container: nhãn <code>org.opencontainers.image.revision</code> (Ch13).'), 'l')}` },

  { t: 'Đóng dấu lúc dựng, hỏi tiến trình /version', body: FIX + two(
    sh([
      ['TAM=$(mktemp -d)', ''],
      ['git archive HEAD | tar x -C "$TAM"', '1. tạo tác từ commit'],
      ["printf '{\"commit\":\"%s\",\"dung_luc\":\"%s\"}\\n' \\", '2. RỒI mới đóng dấu'],
      ['  "$(git rev-parse --short HEAD)" \\', ''],
      ['  "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$TAM/src/phien-ban.json"', ''],
      ['rsync -a --link-dest="$GOC/$TRUOC" "$TAM/" "$GOC/$TEN/"', '3. vào bản phát hành'],
      ['ln -sfn "$GOC/$TEN" /srv/app/hien-tai', '4. tráo'],
    ], { fs: 13 }),
    `${term(['$ curl -s localhost:19013/version', '= {"commit":"9310ba1","dung_luc":"2026-09-29T01:11:07Z"}'], { title: 'VPS thí nghiệm — node đọc tệp lúc khởi động', fs: 12 })}
    ${table(['Trường', 'Trả lời câu nào'], [
      ['<code>commit</code>', '!máy này chạy ĐÚNG mã nào — thứ duy nhất đem so'],
      ['<code>dung_luc</code>', 'tạo tác cũ bất thường? (cache không ai ngờ)'],
      ['nhánh / tag', 'production có đang chạy nhánh tính năng?'],
      ['KHÔNG gì khác', '-endpoint công khai: thêm gì là CÔNG BỐ nấy'],
    ], { sm: true })}`, 'l') },

  { t: 'Trỏ symlink xong chưa chắc đang chạy bản đó', body: FIX + term([
      '# lùi bản: trỏ hien-tai về 20260929-011104-f342eb9 … nhưng KHÔNG khởi động lại tiến trình',
      '$ ln -sfn /srv/app/phat-hanh/20260929-011104-f342eb9 /srv/app/hien-tai',
      'mong doi: f342eb9   dang chay: 9310ba1',
      '! LECH — da trao symlink nhung tien trinh CHUA khoi dong lai',
      '$ pkill -f may-chu.mjs; nohup node /srv/app/chung/may-chu.mjs &',
      'sau khi khoi dong lai: f342eb9',
      '= KHOP',
    ], { title: 'VPS thí nghiệm — đo thật', fs: 14 }) + two(
    sh([
      ['MONG=$(basename "$(readlink -f /srv/app/hien-tai)" | cut -d- -f3)', 'symlink trỏ commit nào'],
      ['THAT=$(curl -s localhost:19013/version | jq -r .commit)', 'tiến trình ĐANG CHẠY gì'],
      ['[ "$THAT" = "$MONG" ] && echo "KHOP" \\', ''],
      ['  || echo "LECH — chua khoi dong lai"', ''],
    ], { fs: 13.5 }),
    box('tip', 'Đặt phép kiểm này ở CUỐI script deploy. Phép kiểm sức khoẻ không bắt được ca này: web vẫn trả 200 — chỉ là mã CŨ.'), 'l') },

  /* ───────────── 1.5 ───────────── */
  { t: 'Liên kết cứng: 6 bản 30 MB thay vì 158 MB', body: FIX + two(
    `${bars([
      { l: '6 bản, chép đầy đủ', sub: 'cp -a từng bản', v: 158, txt: '158 MB', c: 'red' },
      { l: '6 bản, --link-dest', sub: 'rsync -a', v: 30, txt: '30 MB', c: 'grn' },
      { l: 'một bản riêng lẻ', sub: 'du -sh từng bản', v: 27, txt: 'vẫn báo 27 MB', c: 'blu' },
    ], { lw: 200 })}
    ${box('info', '<code>du</code> đếm khối chung MỘT lần mỗi lần chạy ⇒ tổng các bản (6 × 27) lớn hơn thư mục cha (30). Mỗi bản vẫn là một cây ĐẦY ĐỦ chạy được, không phải bản vá.')}`,
    term([
      '$ du -sh /srv/app/phat-hanh',
      '= 30M	/srv/app/phat-hanh',
      '$ stat -c "%h lien ket  inode %i  %n" \\',
      '    */node_modules/express/package.json',
      '+ 6 lien ket  inode 172746  20260929-011058-fdba636/…',
      '+ 6 lien ket  inode 172746  20260929-011101-08cd63e/…',
      '+ 6 lien ket  inode 172746  20260929-011102-efe37e8/…',
      '# chép đầy đủ cả 6 để so',
      '$ du -sh /tmp/sao',
      '! 158M	/tmp/sao',
    ], { title: 'VPS thí nghiệm — 6 bản phát hành của ~/du-an', fs: 13 }), 'l') },

  { t: 'cp ghi tại chỗ làm bẩn MỌI bản — mv thì không', body: FIX + `${inodeSvg()}
    ${box('warn', '<strong>Hai luật:</strong> thư mục bản phát hành là CHỈ ĐỌC từ lúc tạo ra — không "sửa nhanh trên production"; mọi thứ có ghi (tải lên, log, cache) ở <code>chung/</code>. <code>rsync</code> an toàn vì ghi tệp tạm rồi đổi tên — trừ khi thêm <code>--inplace</code>.')}` },

  { t: '--link-dest chỉ nối khi cả mtime cũng giống', body: FIX + two(
    `${term([
      '# 2 bản, mỗi bản tự chạy npm ci (npm 9 đặt mtime = lúc cài)',
      '$ stat -c "%y %a %s %n" /tmp/rel2/r*/node_modules/express/package.json',
      '2026-09-29 01:12:06.168172001 +0000 664 2806 …/r1/…',
      '2026-09-29 01:12:07.338172002 +0000 664 2806 …/r2/…',
      '$ for opt in "-a" "-a --checksum" "-rlpc"; do …',
      '    rsync $opt --link-dest=$H/r1 r2/ $H/r2/; du -sh $H; done',
      '! rsync -a --link-dest: 53M',
      '! rsync -a --checksum --link-dest: 53M',
      '= rsync -rlpc --link-dest: 27M',
    ], { title: 'VPS thí nghiệm — nội dung giống, mtime khác', fs: 12.5 })}
    ${box('info', '<code>--link-dest</code> chỉ tạo liên kết khi tệp giống cả nội dung LẪN thuộc tính sẽ ghi (<code>-t</code> giờ, <code>-p</code> quyền, <code>-o/-g</code> chủ). Bỏ <code>-t</code>, so bằng <code>-c</code> ⇒ nối được.')}`,
    table(['Cờ rsync', 'Làm gì'], [
      ['<code>-a</code>', '= <code>-rlptgoD</code>: đệ quy, link, quyền, GIỜ, nhóm, chủ'],
      ['<code>-c</code> / <code>--checksum</code>', 'so nội dung thay vì cỡ + giờ'],
      ['<code>--link-dest=DIR</code>', 'tệp giống DIR ⇒ liên kết cứng'],
      ['<code>--delete</code>', 'xoá ở đích thứ nguồn không có'],
      ['<code>--exclude-from=FILE</code>', 'mẫu loại trừ đọc từ tệp'],
      ['<code>-n</code> · <code>-i</code>', 'chạy thử · in lý do từng tệp'],
      ['-<code>--inplace</code>', 'ghi đè TẠI CHỖ — phá liên kết cứng'],
    ], { sm: true }), 'l') },

  { t: 'Dọn theo số lượng — chừa bản đang chạy', body: FIX + two(
    sh([
      ['GOC=/srv/app/phat-hanh; GIU=${GIU:-5}', ''],
      ['DANG_DUNG=$(basename "$(readlink -f /srv/app/hien-tai)")', 'đọc symlink TRƯỚC'],
      ['ls -1 "$GOC" | sort | head -n -"$GIU" |', 'tất cả trừ GIU bản cuối'],
      ['while read -r ban; do', ''],
      ['  if [ "$ban" = "$DANG_DUNG" ]; then', ''],
      ['    echo "bo qua $ban — dang duoc dung" >&2; continue', 'không xoá đích symlink'],
      ['  fi', ''],
      ['  rm -rf "${GOC:?}/$ban"', ':? — GOC rỗng thì DỪNG'],
      ['  echo "da xoa $ban"', ''],
      ['done', ''],
    ], { fs: 13.5 }),
    `${term([
      '# hôm qua đã lùi về bản thứ 2',
      'hien-tai -> 20260929-011101-08cd63e',
      'truoc: 6 ban, 30M',
      '$ GIU=3 bash don.sh',
      'da xoa 20260929-011058-fdba636',
      '+ bo qua 20260929-011101-08cd63e — dang duoc dung',
      'da xoa 20260929-011102-efe37e8',
      '! sau:   4 ban, 29M',
    ], { title: 'VPS thí nghiệm — đo thật', fs: 13 })}
    ${box('warn', 'Xoá 2 bản chỉ trả lại ~1 MB: phần lớn khối vẫn còn tên ở bản khác. Với liên kết cứng, <strong>đếm bản không phải đếm đĩa</strong> — đĩa nhỏ thì dọn theo <code>df</code>, và dọn TRƯỚC khi deploy.')}`, 'l') },

  { t: 'Đĩa đầy thật: cache build 7,6 GB', body: FIX + `${diaDay()}
    ${two(
      box('bad', '<strong>18/08/2026, cuongthai.com:</strong> <code>deploy.sh</code> build ngay trên VPS; cache build phình tới 7,6 GB trên chính cái đĩa chứa Postgres; <code>next build</code> đang chạy thì đĩa còn 1,8 GB ⇒ <code>no space left on device</code>.'),
      box('good', '<strong>Bài học cho tạo tác:</strong> thứ "giữ lại cho nhanh" (cache, ảnh cũ, bản cũ) cũng là tạo tác — phải có TRẦN và có người dọn. Dọn theo dung lượng, và build ở nơi mà đĩa đầy không kéo cơ sở dữ liệu chết theo.'), 'l')}` },

  { t: 'Tarball hay ảnh container: cùng một ý', body: FIX + `${table(['Câu hỏi', 'Tạo tác = tarball + thư mục bản', 'Tạo tác = ảnh container (Ch13)'], [
    ['Định danh chính xác', '<code>sha256sum app-a937b99.tar.gz</code>', 'digest <code>sha256:…</code> của ảnh'],
    ['Tên cho người đọc', '<code>20260929-011106-9310ba1</code>', 'tag <code>:9310ba1</code> — không <code>:latest</code>'],
    ['Phụ thuộc cài ở đâu', '<code>npm ci</code> TRÊN VPS', 'lúc build ảnh, đúng ảnh nền + <code>--platform</code>'],
    ['Loại trừ bằng', '<code>git archive</code> / <code>.gitattributes</code>', '<code>.dockerignore</code> (27M → 132K ở đây)'],
    ['Cấu hình / trạng thái', '<code>chung/.env</code> · <code>chung/tai-len</code>', '<code>env_file</code> · volume — NGOÀI ảnh'],
    ['Giữ bản cũ', 'thư mục + liên kết cứng', 'ảnh cũ theo tag, tầng dùng chung'],
    ['Lùi bản', 'đổi symlink + restart', '<code>up -d</code> với tag cũ'],
    ['Dọn', '<code>don.sh</code> chừa bản đang chạy', '<code>image prune --filter</code> chừa đường lùi'],
  ], { sm: true })}
  ${box('tip', 'Đổi hình thức, không đổi nguyên tắc: <strong>một commit ⇒ một tạo tác bất biến, có mã băm, có tên truy về commit, không chứa bí mật, dựng đúng nền tảng.</strong>')}` },

  { t: 'Sai lầm hay gặp với tạo tác', body: FIX + table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['rsync/tar cả cây với <code>--exclude</code> viết tay', 'quên một mục mới (<code>.env.production</code>)', '<code>git archive</code> — bao gồm, không loại trừ'],
    ['Tin <code>.gitignore</code> bảo vệ lần deploy', 'rsync, tar, docker KHÔNG đọc nó', 'đúng file loại trừ cho đúng công cụ'],
    ['Chép <code>node_modules</code> từ laptop', 'nhị phân native sai nền tảng', '<code>npm ci</code> trên máy đích / trong ảnh'],
    ['<code>npm install</code> trên máy chủ', 'tự giải lại, ghi lockfile, thoát 0', '<code>npm ci</code> — lệch thì hỏng'],
    ['<code>gzip tệp</code> hoặc gzip trên Mac', 'MTIME vào header ⇒ sha đổi', '<code>gzip -n</code>'],
    ['<code>lenh || echo "canh bao"</code>', '<code>set -e</code> bị tắt, deploy đi tiếp', '<code>|| { echo …; exit 1; }</code>'],
    ['Commit tệp phiên bản', 'luôn gọi tên commit cha', 'đóng dấu lúc dựng, <code>.gitignore</code> nó'],
    ['Sửa tệp trong bản phát hành', 'liên kết cứng ⇒ bẩn mọi bản', 'bản là chỉ đọc; ghi vào <code>chung/</code>'],
    ['Dọn "N bản cũ nhất" không kiểm', 'xoá đích symlink ⇒ web chết', 'đọc <code>readlink -f</code> trước'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): đóng gói và tái lập', body: FIX + two(
    sh([
      ['git status --porcelain --ignored', 'thứ không vào tạo tác'],
      ['git archive --format=tar --prefix=app/ HEAD \\', ''],
      ['  | gzip -n > app-$(git rev-parse --short HEAD).tar.gz', 'tạo tác tái lập'],
      ['git archive HEAD | tar t | head', 'xem trước'],
      ['sha256sum app-*.tar.gz  # Mac: shasum -a 256', 'mã băm đi kèm'],
      ['sha256sum -c app-*.sha256', 'kiểm ở máy nhận'],
      ['export SOURCE_DATE_EPOCH=$(git log -1 --format=%ct)', 'giờ của mã nguồn'],
      ['tar --sort=name --mtime="@$SOURCE_DATE_EPOCH" \\', ''],
      ['  --owner=0 --group=0 --numeric-owner -cf - .', 'tar tái lập (GNU)'],
      ["xxd -l 10 app.tar.gz", 'byte 5–8 = MTIME'],
    ], { fs: 13 }),
    table(['Tệp', 'Ai đọc', 'Ghi chú'], [
      ['<code>.gitignore</code>', 'git add / status', 'không bảo vệ deploy'],
      ['<code>.gitattributes</code>', '<code>git archive</code>', '<code>export-ignore</code> · <code>eol=lf</code>'],
      ['<code>.dockerignore</code>', '<code>docker build</code>', 'build context'],
      ['<code>--exclude-from=</code>', 'rsync', 'mẫu rsync ≈ gitignore'],
      ['<code>--exclude=</code>', 'tar', 'mỗi mẫu một cờ'],
      ['<code>package-lock.json</code>', '<code>npm ci</code>', 'commit nó · không ghim nền tảng'],
      ['<code>.nvmrc</code> · <code>engines</code>', 'nvm · npm', 'ghim Node — kiểm trong deploy'],
    ], { sm: true }), 'l') },

  { t: 'Bảng tra nhanh (2/2): dựng, đặt tên, giữ bản', body: sh([
    ['npm ci --omit=dev --no-audit --no-fund', 'cài ĐÚNG lockfile, lệch thì thoát 1'],
    ['npm ci && npm run build && npm prune --omit=dev', 'khi build cần devDependencies'],
    ['node --version | grep -q "^v22\\." || exit 1', 'chốt runtime trước khi cài'],
    ['TEN="$(date -u +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"', 'tên bản: UTC + commit'],
    ['git describe --tags --always --dirty', 'nhãn cho người đọc (bỏ qua ??)'],
    ['curl -s host/version | jq -r .commit', 'tiến trình đang CHẠY bản nào'],
    ['rsync -a --link-dest="$GOC/$TRUOC" src/ "$GOC/$TEN/"', 'bản mới chia sẻ tệp giống'],
    ['rsync -rlpc --link-dest="$GOC/$TRUOC" src/ "$GOC/$TEN/"', 'khi mtime khác (npm ci)'],
    ['ln -sfn "$GOC/$TEN" /srv/app/hien-tai', 'tráo'],
    ['readlink -f /srv/app/hien-tai', 'đang trỏ đâu — đọc TRƯỚC khi dọn'],
    ['stat -c "%h %i %n" FILE', 'số liên kết · inode'],
    ['ls -1 "$GOC" | sort | head -n -5', 'ứng viên dọn (GNU head)'],
    ['rm -rf "${GOC:?}/$ban"', 'GOC rỗng ⇒ dừng, không rm -rf /'],
    ['df -h /srv; du -sh "$GOC"', 'đĩa còn · bản phát hành chiếm'],
  ], { fs: 15 }) },

  { t: 'Thực hành chương 1 (45 phút, VPS thí nghiệm)', body: FIX + table(['Bước', 'Làm gì', 'Đạt khi'], [
    ['<strong>1. Kiểm kê</strong> · 8′', '<code>git status --porcelain --ignored</code> + <code>find . -name ".env*"</code> trên dự án của bạn', 'gọi tên được mọi dòng <code>??</code>'],
    ['<strong>2. Đóng gói</strong> · 10′', '<code>dong-goi.sh</code> trên hai bản clone cách nhau 2 giây', '+hai sha256 trùng; cây bẩn ⇒ thoát 1'],
    ['<strong>3. npm ci</strong> · 8′', 'sửa tay một phiên bản trong <code>package.json</code>, chạy <code>npm ci</code> rồi <code>npm install</code>', 'ghi được thoát 1 / 0 và lockfile có bị ghi lại'],
    ['<strong>4. Tên + /version</strong> · 10′', '3 bản <code>ngày-giờ-commit</code>, đóng dấu, lùi bản KHÔNG restart', '+phép kiểm in LECH, restart xong in KHOP'],
    ['<strong>5. Giữ và dọn</strong> · 9′', '<code>du -sh</code> có/không <code>--link-dest</code>; lùi bản rồi <code>GIU=2 bash don.sh</code>', '+bản đang chạy được chừa lại'],
  ], { sm: true }) + two(
    box('info', '<strong>VPS thí nghiệm</strong> = container Ubuntu 24.04 có sshd: <code>docker run -d --name dv01-vps -p 127.0.0.1:19012:22 …</code>, SSH bằng khoá tạo riêng. Xong: <code>docker rm -f dv01-vps</code>.'),
    box('warn', 'Đừng thử <code>rsync --delete</code>, <code>rm -rf</code> hay dọn bản trên VPS THẬT khi chưa chạy <code>-n</code> và in <code>readlink -f</code>.')) },
]);
