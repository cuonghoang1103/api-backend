/**
 * Docker · Deck dk-04 — Chương 4: Dockerfile, từ cơ bản tới trôi chảy.
 *
 * MỌI output terminal và MỌI con số trên slide là THẬT, chạy 23/09/2026:
 *   • "máy Mac"    = Mac M1, Docker Desktop 4.91 / Engine 29.8.0 (BuildKit, buildx 0.37), arm64
 *   • "máy Linux"  = Fedora 44, Docker Engine 29.6.2, amd64 — dùng cho mọi phép đo THỜI GIAN dừng
 *                    (Docker Desktop trên Mac dừng container sau ~3 s chứ không phải 10 s, xem hợp đồng 7c)
 * Năm công thức của bài 4.5 đều được DỰNG và CHẠY thật; kích thước ảnh là cột DISK USAGE / CONTENT SIZE
 * của `docker images` (Docker 29, kho ảnh containerd). Tên ảnh/container trong output mang tiền tố dk04-.
 *
 * Hình tự vẽ (SVG nội tuyến): ctxAnatomy() — giải phẫu `docker build` + đường đi của ngữ cảnh;
 * argEnvTimeline() — ARG sống lúc dựng, ENV đi theo ảnh; concat() — ENTRYPOINT + CMD ghép thành lệnh cuối.
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, mindmap, layers, term as dkTerm, yaml, bars, sv, R, T, A, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });
const lbl = (t, c) => `<div style="font-size:17px;font-weight:800;color:${D[c] || c};margin:0 0 6px">${t}</div>`;
const small = (t) => `<p style="font-size:15px;color:${D.mu};margin:6px 0 0">${t}</p>`;

export const deck = { key: 'dk-04', code: 'DOCKER · CHƯƠNG 4', title: 'Dockerfile, từ cơ bản tới trôi chảy', sub: 'Docker · Chương 4' };

/* ───────────── Slide 4 — giải phẫu docker build + đường đi của ngữ cảnh ───────────── */
const ctxAnatomy = () => {
  let s = '';
  // dòng lệnh
  const parts = [
    ['docker build', 0, 'dk', 'LỆNH'],
    ['-t demo:1.0', 150, 'tea', 'TÊN ẢNH (tag)'],
    ['-f docker/api.Dockerfile', 300, 'amb', 'DOCKERFILE (tuỳ chọn)'],
    ['.', 595, 'red', 'NGỮ CẢNH'],
  ];
  s += R(0, 0, 640, 46, { c: 'bd', fill: '#070c16', r: 10, sw: 1.5 });
  parts.forEach(([t, x, c, k]) => {
    s += T(14 + x, 30, t, { fs: t === '.' ? 26 : 17, mono: true, b: t === '.', c: t === '.' ? 'red' : '#e6edf3' });
    const w = t === '.' ? 20 : t.length * 10.2;
    s += `<path d="M${14 + x} 54 L${14 + x} 60 L${14 + x + w} 60 L${14 + x + w} 54" stroke="${D[c]}" stroke-width="2" fill="none"/>`;
    s += T(14 + x + w / 2, 80, k, { fs: 13, a: 'middle', b: true, c });
  });
  // thư mục ngữ cảnh
  s += R(0, 110, 300, 250, { c: 'red', fill: 'rgba(255,92,108,.05)', r: 14 });
  s += T(16, 138, 'thư mục . (ngữ cảnh)', { fs: 17, b: true });
  [['package.json', 'grn'], ['package-lock.json', 'grn'], ['src/', 'grn'], ['node_modules/  328 MB', 'red'], ['.next/  85 MB', 'red'], ['.git/', 'red'], ['.env.local', 'red']].forEach(([f, c], i) => {
    s += T(34, 172 + i * 26, (c === 'grn' ? '✓ ' : '✗ ') + f, { fs: 15, mono: true, c: c === 'grn' ? 'grn' : 'red' });
  });
  s += R(330, 150, 200, 96, { c: 'amb', fill: '#0d1628', r: 10 });
  s += T(430, 180, '.dockerignore', { fs: 16, a: 'middle', mono: true, b: true, c: 'amb' });
  s += T(430, 204, 'lưới lọc: ✗ ở lại', { fs: 14, a: 'middle', c: 'mu' });
  s += T(430, 226, 'máy bạn', { fs: 14, a: 'middle', c: 'mu' });
  s += A(300, 198, 326, 198, { c: 'amb' });
  s += A(530, 198, 606, 198, { c: 'grn' });
  s += T(568, 186, 'gửi', { fs: 13, a: 'middle', c: 'grn' });
  // builder
  s += R(610, 110, 540, 250, { c: 'dk', fill: 'rgba(36,150,237,.06)', r: 14 });
  s += T(628, 138, 'BuildKit (bộ dựng) — trong dockerd', { fs: 17, b: true });
  s += T(628, 160, 'trên Mac: trong máy ảo · có thể ở máy khác hẳn', { fs: 13.5, c: 'mu' });
  s += R(632, 180, 250, 96, { c: 'grn', fill: '#0d1628', r: 10 });
  s += T(757, 206, 'bản sao ngữ cảnh', { fs: 15, a: 'middle', b: true });
  s += T(757, 230, 'package*.json · src/', { fs: 13.5, a: 'middle', mono: true, c: 'mu' });
  s += T(757, 252, '(chỉ những gì lọt lưới)', { fs: 13, a: 'middle', c: 'mu' });
  s += R(912, 180, 220, 96, { c: 'dk', fill: '#0d1628', r: 10 });
  s += T(1022, 210, 'COPY / ADD', { fs: 16, a: 'middle', mono: true, b: true });
  s += T(1022, 234, 'CHỈ đọc được', { fs: 14, a: 'middle', c: 'mu' });
  s += T(1022, 254, 'từ bản sao này', { fs: 14, a: 'middle', c: 'mu' });
  s += A(912, 228, 886, 228, { c: 'dk' });
  s += T(632, 312, 'COPY ../shared  ⇒  bị kẹp thành "/shared": not found', { fs: 14.5, mono: true, c: 'red' });
  s += T(632, 338, '".." không thể đi ra ngoài ngữ cảnh — chẳng có gì ngoài đó', { fs: 14, c: 'mu' });
  return sv(1150, 364, s);
};

/* ───────────── Slide 19 — ARG sống lúc dựng, ENV đi theo ảnh ───────────── */
const argEnvTimeline = () => {
  let s = '';
  s += R(0, 0, 560, 64, { c: 'amb', fill: 'rgba(255,194,51,.08)', r: 10 });
  s += T(280, 27, 'LÚC DỰNG — docker build', { fs: 17, a: 'middle', b: true, c: 'amb' });
  s += T(280, 50, 'FROM · RUN · COPY đang chạy', { fs: 14, a: 'middle', c: 'mu' });
  s += R(590, 0, 560, 64, { c: 'grn', fill: 'rgba(63,185,80,.08)', r: 10 });
  s += T(870, 27, 'LÚC CHẠY — docker run', { fs: 17, a: 'middle', b: true, c: 'grn' });
  s += T(870, 50, 'mọi container từ ảnh này, mãi mãi', { fs: 14, a: 'middle', c: 'mu' });
  s += `<line x1="575" y1="0" x2="575" y2="250" stroke="${D.dim}" stroke-width="2" stroke-dasharray="5 6"/>`;
  s += T(575, 262, 'ảnh được đóng gói', { fs: 13, a: 'middle', c: 'dim' });
  // ARG
  s += T(0, 100, 'ARG BUILD_ONLY=from-arg', { fs: 16, mono: true, b: true, c: 'amb' });
  s += `<rect x="0" y="112" width="560" height="26" rx="6" fill="${D.amb}" opacity=".3"/>`;
  s += T(12, 131, 'có mặt trong mọi RUN phía sau', { fs: 14 });
  s += T(590, 131, '✗ biến mất:  ARG=  (rỗng)', { fs: 15, mono: true, c: 'red', b: true });
  // ENV
  s += T(0, 180, 'ENV RUNTIME_TOO=from-env', { fs: 16, mono: true, b: true, c: 'grn' });
  s += `<rect x="0" y="192" width="1150" height="26" rx="6" fill="${D.grn}" opacity=".25"/>`;
  s += T(12, 211, 'có mặt lúc dựng', { fs: 14 });
  s += T(602, 211, 'VẪN CÒN: ENV=from-env · ghi đè được bằng docker run -e', { fs: 14 });
  s += R(0, 284, 1150, 54, { c: 'red', fill: 'rgba(255,92,108,.08)', r: 10 });
  s += T(575, 317, 'Cả hai đều ĐỌC ĐƯỢC từ ảnh: ARG nằm trong docker history, ENV nằm trong docker inspect', { fs: 16, a: 'middle', b: true });
  return sv(1150, 342, s);
};

/* ───────────── Slide 14 — ENTRYPOINT + CMD ghép thành lệnh cuối ───────────── */
const concat = () => {
  let s = '';
  const row = (y, ep, cmd, cli, out, note) => {
    s += R(0, y, 250, 50, { c: 'vio', fill: '#0d1628', r: 9 }) + T(125, y + 31, ep, { fs: 15, a: 'middle', mono: true });
    s += T(270, y + 32, '+', { fs: 24, a: 'middle', b: true, c: 'mu' });
    s += R(290, y, 230, 50, { c: cli ? 'dim' : 'tea', fill: '#0d1628', r: 9, dash: !!cli }) + T(405, y + 31, cmd, { fs: 15, a: 'middle', mono: true, c: cli ? 'dim' : '#e6edf3' });
    if (cli) s += `<line x1="300" y1="${y + 25}" x2="510" y2="${y + 25}" stroke="${D.red}" stroke-width="2.5"/>`;
    s += R(540, y, 200, 50, { c: cli ? 'amb' : 'dim', fill: '#0d1628', r: 9, dash: !cli }) + T(640, y + 31, cli || '(không gõ gì)', { fs: 15, a: 'middle', mono: true, c: cli ? '#e6edf3' : 'dim' });
    s += A(748, y + 25, 800, y + 25, { c: 'grn' });
    s += R(808, y, 342, 50, { c: 'grn', fill: 'rgba(63,185,80,.1)', r: 9 }) + T(979, y + 31, out, { fs: 15.5, a: 'middle', mono: true, b: true });
    if (note) s += T(0, y + 72, note, { fs: 14, c: 'mu' });
  };
  s += T(125, 16, 'ENTRYPOINT', { fs: 14, a: 'middle', b: true, c: 'vio' }) + T(405, 16, 'CMD', { fs: 14, a: 'middle', b: true, c: 'tea' }) +
    T(640, 16, 'tham số sau tên ảnh', { fs: 14, a: 'middle', b: true, c: 'amb' }) + T(979, 16, 'lệnh THẬT chạy (PID 1)', { fs: 14, a: 'middle', b: true, c: 'grn' });
  row(30, '["echo"]', '["hello"]', '', 'echo hello', 'Không gõ gì: ENTRYPOINT + CMD ghép lại.');
  row(122, '["echo"]', '["hello"]', 'goodbye', 'echo goodbye', 'Có gõ: tham số THAY CMD, còn ENTRYPOINT ở nguyên.');
  row(214, '(không có)', '["echo","hello"]', 'echo goodbye', 'echo goodbye', 'Không có ENTRYPOINT: tham số thay CẢ lệnh.');
  return sv(1150, 300, s);
};

export const slides = S([
  cover({ t: 'Chương 4 — Dockerfile, từ cơ bản tới trôi chảy', sub: 'Ngữ cảnh dựng &amp; .dockerignore · 18 chỉ thị · CMD &amp; ENTRYPOINT · ARG &amp; ENV · 5 công thức đã dựng thật', chap: 'CHƯƠNG 4' }),

  { t: 'Bản đồ chương: viết một Dockerfile bạn hiểu TỪNG DÒNG', body: mindmap('Dockerfile', 'công thức dựng ra một ảnh', [
    { t: '4.1 Dockerfile đầu tiên', d: 'từng dòng làm gì · dấu chấm = ngữ cảnh · .dockerignore', c: 'dk' },
    { t: '4.2 Mọi chỉ thị', d: 'RUN · COPY/ADD · VOLUME · USER · STOPSIGNAL — và cái giá của từng cái', c: 'tea' },
    { t: '4.3 CMD &amp; ENTRYPOINT', d: 'lệnh cuối = ENTRYPOINT + CMD · exec vs shell · exec "$@"', c: 'amb' },
    { t: '4.4 ARG &amp; ENV', d: 'lúc dựng vs lúc chạy · phạm vi stage · bí mật · NODE_ENV', c: 'vio' },
    { t: '4.5 Năm công thức', d: 'Node · Next.js standalone · Python · Go · trang tĩnh — đã dựng thật', c: 'grn' },
  ]) },

  /* ───────────── 4.1 ───────────── */
  { t: 'Dockerfile đầu tiên — mỗi dòng là một bước, đọc từ trên xuống', body: two(
    yaml([
      ['FROM node:22-alpine', 'ảnh nền: hệ file khởi điểm (Node + Alpine)'],
      ['', ''],
      ['WORKDIR /app', 'cd vào /app cho MỌI dòng sau (tự tạo thư mục)'],
      ['', ''],
      ['COPY package.json package-lock.json ./', 'chỉ chép danh sách thư viện TRƯỚC'],
      ['RUN npm ci --omit=dev', 'chạy LÚC DỰNG → kết quả thành một tầng'],
      ['', ''],
      ['COPY src ./src', 'mã nguồn SAU CÙNG — thứ đổi nhiều nhất'],
      ['', ''],
      ['EXPOSE 3000', 'chỉ là ghi chú — KHÔNG mở cổng nào'],
      ['CMD ["node", "src/server.js"]', 'lệnh mặc định khi chạy (dạng exec)'],
    ], { lang: 'docker', fs: 15 }),
    `${layers({ w: 400, cap: 'ảnh demo:1.0 — tầng nào sinh ra từ dòng nào', rows: [
      { t: 'node:22-alpine', sz: '229MB', k: 'NỀN', c: 'tea' },
      { t: 'WORKDIR /app', sz: '8.19kB', c: 'dim' },
      { t: 'COPY package*.json', sz: '45.1kB', c: 'blu' },
      { t: 'RUN npm ci', sz: '9.64MB', c: 'dk' },
      { t: 'COPY src', sz: '16.4kB', c: 'grn' },
    ] })}
    ${term(['$ docker build -t demo:1.0 .', '$ docker run -d -p 18040:3000 demo:1.0', '$ curl -s localhost:18040/health', '= {"ok":true,"node":"v22.23.2"}'], { title: 'output thật — máy Mac' })}`, 'l') },

  { t: 'Dấu chấm cuối lệnh là NGỮ CẢNH — không phải Dockerfile', body: `
    ${ctxAnatomy()}
    ${box('info', 'Trước khi chạy dòng nào, CLI gửi thư mục ngữ cảnh cho <b>bộ dựng</b> (có thể ở máy khác, trên Mac là trong máy ảo). <code>COPY</code> chỉ nhìn thấy bản gửi lên — không bao giờ thấy ổ đĩa của bạn.')}` },

  { t: 'Không có .dockerignore: 398 MB bị gửi đi — kèm cả .env và .git', body: two(
    `${bars([
      { l: 'Không .dockerignore', sub: 'gửi 397.69MB · cả lượt 21,1 s', v: 21.1, txt: '21,1 s', c: 'red' },
      { l: 'Có .dockerignore', sub: 'gửi 32.25kB · cả lượt 2,2 s', v: 2.2, txt: '2,2 s', c: 'grn' },
    ], { lw: 260, max: 22 })}
    ${term(['$ docker build -f- . <<\'EOF\'', 'FROM busybox', 'COPY . /ctx', 'RUN du -sh /ctx && ls -A /ctx', 'EOF', '! => transferring context: 397.69MB   4.2s', '! 414.0M  /ctx', '! .env.local  .git  .next  node_modules  app …'], { title: 'output thật — dự án Next.js, máy Mac' })}`,
    `${kpis([{ v: '11.582', l: 'file bị gửi', c: 'red' }, { v: '8', l: 'file cần thật', c: 'grn' }])}
    ${table(['Hậu quả', 'Vì sao'], [
      ['-🐢 Chậm', 'Gửi + chép 414 MB vào một tầng ở MỖI lượt dựng, cả trong CI'],
      ['-🔑 Lộ bí mật', '<code>COPY . .</code> nướng <code>.env.local</code> và <code>.git</code> vào ảnh'],
      ['-💥 Sai nền tảng', '<code>node_modules</code> dựng trên macOS lọt vào ảnh Linux'],
    ], { sm: true })}`, 'l2') },

  { t: '.dockerignore — danh sách những thứ KHÔNG được lên xe', body: two(
    yaml([
      ['# .dockerignore — cùng luật mẫu với .gitignore', ''],
      ['node_modules', 'npm ci tự cài lại bên trong'],
      ['.next', 'kết quả build ở máy bạn'],
      ['dist', ''],
      ['.git', '.gitignore không bao giờ nhắc cái này'],
      ['.env*', 'bí mật: KHÔNG BAO GIỜ vào ảnh'],
      ['*.log', 'đổi liên tục ⇒ phá cache'],
      ['.DS_Store', ''],
      ['Dockerfile*', 'sửa Dockerfile không phá cache COPY'],
      ['.dockerignore', ''],
      ['!src/templates/.env.example', '! = nhận lại thứ đã loại'],
    ], { fs: 15 }),
    `${term(['$ docker build -f- . <<\'EOF\'  # cùng lệnh soi ngữ cảnh', '…', '= => transferring context: 32.25kB', '= 72.0K  /ctx', '= 8     (số file)'], { title: 'output thật — sau khi thêm .dockerignore' })}
    ${box('tip', '<b>Viết <code>.dockerignore</code> TRƯỚC Dockerfile.</b> Bắt đầu từ <code>.gitignore</code>, thêm <code>.git</code> và <code>.env*</code>.')}
    ${box('info', 'Mẹo soi ngữ cảnh: dựng tạm một ảnh <code>busybox</code> chỉ có <code>COPY . /ctx</code> rồi <code>du</code> và <code>ls</code> — thấy tận mắt thứ gì bị gửi.')}`, 'l') },

  { t: 'BuildKit chỉ gửi thứ COPY cần — và chỉ gửi phần đã đổi', body: two(
    table(['Tình huống (máy Mac, dự án demo)', 'transferring context'], [
      ['<code>COPY package*.json</code> + <code>COPY src</code>, có <code>node_modules</code> 3,9 MB nằm đó', '+29.59kB — node_modules KHÔNG bị gửi'],
      ['<code>COPY . .</code>, lần dựng đầu', '!2.39MB — gửi hết'],
      ['<code>COPY . .</code>, dựng lại không đổi gì', '+41.03kB — chỉ gửi siêu dữ liệu'],
      ['<code>COPY . .</code> ở máy CI sạch', '-lần nào cũng như lần đầu'],
    ], { sm: true }),
    `${term(['$ docker build --progress=plain -t demo:1.1 .', '#5 [internal] load build context', '#5 transferring context: 29.96kB done', '#6 [3/5] COPY package.json package-lock.json ./', '= #6 CACHED', '#7 [4/5] RUN npm ci --omit=dev', '= #7 CACHED'], { title: 'output thật — đọc log dựng' })}
    ${box('warn', 'Đừng suy ra “node_modules không sao” từ máy bạn: <code>COPY . .</code> vẫn chép nó VÀO ẢNH, và CI luôn gửi lại từ đầu. <code>.dockerignore</code> vẫn bắt buộc.')}`, 'l2') },

  /* ───────────── 4.2 ───────────── */
  { t: '18 chỉ thị — nhóm theo cái giá mỗi chỉ thị phải trả', body: `
    ${cards([
      { ic: '🧱', t: 'Tạo TẦNG (tốn byte)', d: '<code>RUN</code> · <code>COPY</code> · <code>ADD</code><br>Mỗi dòng thêm byte vào ảnh và một mục cache. Xếp thứ ít đổi lên trước.', c: 'red' },
      { ic: '🏷', t: 'Chỉ siêu dữ liệu (0 B)', d: '<code>ENV</code> · <code>WORKDIR</code> · <code>EXPOSE</code> · <code>LABEL</code> · <code>USER</code> · <code>VOLUME</code><br>Không tốn byte, nhưng đổi là phá cache mọi dòng dưới.', c: 'blu' },
      { ic: '▶️', t: 'Chỉ có tác dụng LÚC CHẠY', d: '<code>CMD</code> · <code>ENTRYPOINT</code> · <code>HEALTHCHECK</code> · <code>STOPSIGNAL</code><br>Ghi vào cấu hình ảnh, đọc khi container khởi động.', c: 'grn' },
      { ic: '🔧', t: 'Chỉ có tác dụng LÚC DỰNG', d: '<code>FROM</code> · <code>ARG</code> · <code>SHELL</code> · <code>ONBUILD</code><br><code>ARG</code> biến mất khỏi ảnh cuối (Bài 4.4).', c: 'amb' },
    ], 2)}
    ${box('info', 'Tài liệu chính thức liệt kê <b>18</b> chỉ thị, trong đó <code>MAINTAINER</code> đã lỗi thời (dùng <code>LABEL org.opencontainers.image.authors</code>). Dòng đầu nên là <code># syntax=docker/dockerfile:1</code> — mở khoá heredoc, cache mount, secret mount.')}` },

  { t: 'RUN: mỗi dòng một shell MỚI — và lỗi giữa ống dẫn bị nuốt', body: two(
    `${lbl('① cd không sống qua dòng sau', 'amb')}
    ${term(['RUN mkdir /app && cd /app', 'RUN pwd', '! #6 0.076 /', 'WORKDIR /app', 'RUN pwd', '= #8 0.079 /app'], { title: 'output thật — máy Mac' })}
    ${lbl('② heredoc không có set -e: lỗi bị bỏ qua', 'amb')}
    ${term(['RUN <<SCRIPT', 'apk add --no-cache goi-khong-ton-tai', 'echo "dòng sau vẫn chạy"', 'SCRIPT', '! ERROR: unable to select packages: …', '! dòng sau vẫn chạy — bước này XANH'], { title: 'output thật' })}`,
    `${lbl('③ lỗi ở đầu ống dẫn: bản dựng vẫn xanh', 'red')}
    ${term(['RUN wget -qO- http://…/install.sh | sh', '! wget: server returned error: HTTP/1.1 404 Not Found', '! #5 DONE 0.1s      ← sh đọc đầu vào rỗng, thoát 0', 'SHELL ["/bin/sh", "-eo", "pipefail", "-c"]', 'RUN wget -qO- http://…/install.sh | sh', '= ERROR: … did not complete successfully: exit code: 1'], { title: 'output thật — alpine (busybox có pipefail)' })}
    ${box('tip', 'Heredoc: dòng đầu luôn là <code>set -eux</code>. Ống dẫn: đặt <code>SHELL [… "-o", "pipefail" …]</code> một lần, áp cho mọi <code>RUN</code> sau.')}`) },

  { t: 'COPY làm đúng điều bạn nói — ADD làm thêm hai việc bất ngờ', body: two(
    `${term(['COPY data.tar.gz /copy/', 'ADD  data.tar.gz /add/', 'RUN find /copy /add', '/copy/data.tar.gz', '! /add/data/a.txt       ← ADD tự GIẢI NÉN', '! /add/data/b.txt'], { title: 'output thật — một file tar, hai kết quả' })}
    ${term(['ADD http://…/v.txt /v.txt   # lần 1: "phien ban 1"', '# máy chủ đổi nội dung file, dựng lại:', '! #7 0.073 phien ban 2      ← lặng lẽ đổi byte', 'ADD --checksum=sha256:e4c3…1 http://…/w.txt /w.txt', '= ERROR: digest mismatch sha256:d839…'], { title: 'output thật — ADD một URL' })}`,
    `${table(['Cần', 'Dùng'], [
      ['Chép file/thư mục từ ngữ cảnh', '+<code>COPY</code>'],
      ['Chép từ stage khác / ảnh khác', '+<code>COPY --from=build</code>'],
      ['Tải file từ mạng', '!<code>ADD --checksum=sha256:…</code> hoặc <code>RUN curl</code> + <code>sha256sum -c</code>'],
      ['Chép một file tar nguyên vẹn', '-<code>ADD</code> sẽ giải nén mất'],
    ], { sm: true })}
    ${box('info', 'BuildKit <b>có</b> kiểm lại URL mỗi lượt dựng (nội dung đổi ⇒ tầng dựng lại) — nên thiếu <code>--checksum</code> là bản dựng không tái lập được: cùng Dockerfile, byte khác nhau.')}`, 'l2') },

  { t: 'RUN chown -R sau COPY = nhân đôi 160 MB chỉ để đổi quyền', body: two(
    `${lbl('❌ COPY rồi RUN chown -R', 'red')}
    ${layers({ w: 520, rows: [
      { t: 'node:22-alpine', sz: '229MB', k: 'NỀN', c: 'tea' },
      { t: 'COPY node_modules (4.467 file)', sz: '160MB', c: 'dk' },
      { t: 'RUN chown -R node:node /app', sz: '160MB', c: 'red', k: 'BẢN SAO' },
    ] })}
    ${small('Đổi chủ sở hữu cũng là GHI ⇒ mọi file bị chép lên tầng mới (Bài 1.2). DISK USAGE: <b>638MB</b>.')}`,
    `${lbl('✅ COPY --chown', 'grn')}
    ${layers({ w: 520, rows: [
      { t: 'node:22-alpine', sz: '229MB', k: 'NỀN', c: 'tea' },
      { t: 'COPY --chown=node:node node_modules', sz: '160MB', c: 'grn' },
    ] })}
    ${small('Quyền được đặt ngay lúc ghi. DISK USAGE: <b>433MB</b> — nhẹ hơn 205MB.')}
    ${term(['$ docker history chown-a --format \'{{.Size}}\\t{{.CreatedBy}}\' | head -2', '! 160MB   RUN /bin/sh -c chown -R node:node /app', '160MB   COPY /app/node_modules ./node_modules'], { title: 'output thật — máy Mac' })}`) },

  { t: 'VOLUME trong ảnh: mỗi lần run đẻ một volume vô danh', body: two(
    `${term(['FROM alpine', 'VOLUME /data', 'RUN echo hello > /data/file.txt', '! /bin/sh: can\'t create /data/file.txt: nonexistent directory', '# BuildKit KHÔNG tạo thư mục cho VOLUME lúc dựng', '', 'RUN mkdir -p /data && echo hello > /data/file.txt', '$ docker run --name vt1 voltest', '= hello                  ← BuildKit GIỮ file', '$ docker inspect vt1 --format \'{{range .Mounts}}…\'', '+ volume 6fb8fab50e07… -> /data'], { title: 'output thật — máy Mac, BuildKit (Docker 29)' })}`,
    `${table(['', 'Bộ dựng cũ (legacy)', 'BuildKit (mặc định)'], [
      ['RUN ghi vào đường dẫn VOLUME', '-bị VỨT', '+được GIỮ'],
      ['Mỗi <code>docker run</code>', '-thêm 1 volume vô danh', '-thêm 1 volume vô danh'],
    ], { sm: true })}
    ${box('warn', 'Volume vô danh không ai dọn: <code>docker volume ls</code> trên máy khoá tăng 74 → 75 sau một lần chạy. Xoá kèm: <code>docker rm -v</code>.')}
    ${box('tip', '<code>VOLUME</code> hợp với ảnh CSDL công bố cho người khác. Ảnh ứng dụng của bạn: bỏ đi — ai cần thì tự <code>-v</code>.')}`, 'l2') },

  { t: 'Chỉ thị siêu dữ liệu: 0 byte nhưng quyết định lúc chạy', body: `
    ${table(['Chỉ thị', 'Thật ra làm gì (đã kiểm)', 'Hay hiểu nhầm'], [
      ['<code>EXPOSE 80</code>', '<code>docker ps</code> chỉ ghi <code>80/tcp</code>. Với <code>-P</code> mới được cổng ngẫu nhiên: <code>80/tcp -&gt; 0.0.0.0:55001</code>', '-“mở cổng” — KHÔNG, vẫn cần <code>-p</code>'],
      ['<code>STOPSIGNAL</code>', 'Tín hiệu <code>docker stop</code> gửi đầu tiên. <code>nginx:1.27-alpine</code> → <b>SIGQUIT</b> (dừng êm); <code>postgres:16-alpine</code> → <b>SIGINT</b> (fast shutdown)', '-SIGQUIT với Postgres = dừng NGAY, lần sau phải phục hồi'],
      ['<code>USER 1000:1000</code>', 'Mọi <code>RUN</code>/<code>CMD</code> sau nó chạy bằng user đó. Đặt MUỘN, sau các RUN cần root', '!Dùng số UID: hợp với <code>runAsNonRoot</code>'],
      ['<code>HEALTHCHECK</code>', 'Lệnh chạy định kỳ trong container ⇒ <code>Up 8 minutes (healthy)</code>', '!Lệnh đó phải CÓ trong ảnh (wget/curl)'],
      ['<code>WORKDIR</code>', 'Như <code>cd</code> có nhớ, tự tạo thư mục', ''],
      ['<code>LABEL</code>', '0 B, lọc được: <code>docker images --filter label=…</code>', ''],
    ], { sm: true })}` },

  /* ───────────── 4.3 ───────────── */
  { t: 'Lệnh cuối = ENTRYPOINT + CMD — tham số gõ thêm thay CMD', body: `
    ${concat()}
    ${two(term(['$ docker run --rm tt     # ENTRYPOINT ["echo"] CMD ["hello"]', '= hello', '$ docker run --rm tt goodbye', '= goodbye', '$ docker run --rm --entrypoint echo tt', '                 ← --entrypoint XOÁ luôn CMD: in dòng trống'], { title: 'output thật — máy Mac' }),
      box('info', '<b>ENTRYPOINT = chương trình, CMD = tham số mặc định.</b> Khai ENTRYPOINT mới cũng xoá CMD thừa hưởng từ ảnh nền (<code>Cmd = null</code>).'), 'l2')}` },

  { t: 'Bảng CMD × ENTRYPOINT: lệnh nào THẬT SỰ chạy', body: `
    ${table(['', 'Không có ENTRYPOINT', 'ENTRYPOINT exec_entry p1_entry', 'ENTRYPOINT ["exec_entry", "p1_entry"]'], [
      ['<b>Không có CMD</b>', '-lỗi: <code>no command specified</code>', '<code>/bin/sh -c exec_entry p1_entry</code>', '+<code>exec_entry p1_entry</code>'],
      ['<b>CMD ["exec_cmd", "p1_cmd"]</b>', '+<code>exec_cmd p1_cmd</code>', '!<code>/bin/sh -c exec_entry p1_entry</code> — CMD bị BỎ', '+<code>exec_entry p1_entry exec_cmd p1_cmd</code>'],
      ['<b>CMD exec_cmd p1_cmd</b>', '<code>/bin/sh -c exec_cmd p1_cmd</code>', '!<code>/bin/sh -c exec_entry p1_entry</code> — CMD bị BỎ', '-<code>exec_entry p1_entry /bin/sh -c exec_cmd p1_cmd</code>'],
    ], { sm: true })}
    ${two(box('good', '<b>Cột phải + hàng giữa</b> là tổ hợp dùng nhiều nhất: <code>ENTRYPOINT ["docker-entrypoint.sh"]</code> + <code>CMD ["postgres"]</code>. Người dùng chỉ đổi tham số.'),
      box('bad', '<b>ENTRYPOINT dạng shell</b> nuốt mất CMD và tham số: đã kiểm, <code>ENTRYPOINT echo from-entrypoint</code> + <code>docker run img goodbye</code> ⇒ in <code>from-entrypoint</code>.'))}` },

  { t: 'Dạng shell: Alpine tự exec giùm — Debian thì KHÔNG', body: two(
    bars([
      { l: 'CMD ["node","server.js"]', sub: 'exec · node:22-alpine', v: 0.15, txt: '0,15 s · exit 0', c: 'grn' },
      { l: 'CMD node server.js', sub: 'shell · alpine (busybox exec)', v: 0.12, txt: '0,12 s · exit 0', c: 'grn' },
      { l: 'CMD node server.js', sub: 'shell · node:22-slim (dash)', v: 10.19, txt: '10,19 s · exit 137', c: 'red' },
      { l: 'CMD node server.js; echo x', sub: 'shell · alpine, 2 lệnh', v: 10.18, txt: '10,18 s · exit 137', c: 'red' },
      { l: 'CMD ["npm","start"]', sub: 'npm 10.9 CÓ chuyển SIGTERM', v: 0.18, txt: '0,18 s · exit 0', c: 'amb' },
      { l: 'CMD ["sleep","600"]', sub: 'exec, nhưng sleep không bắt SIGTERM', v: 10.18, txt: '10,18 s · exit 137', c: 'red' },
    ], { lw: 290, max: 11 }),
    `${term(['# node:22-slim, CMD node server.js', '! 1 /bin/sh -c node server.js', '  8 node server.js', '# node:22-alpine, cùng dòng CMD', '= 1 node server.js'], { title: 'output thật — ai là PID 1 (máy Linux)' })}
    ${box('warn', 'Cùng một dòng <code>CMD</code>, đổi ảnh nền là đổi hành vi dừng. <b>Luôn viết dạng exec</b> — khỏi phải nhớ shell nào exec giùm.')}
    ${small('Đo bằng <code>docker stop</code> trên máy Linux (Engine 29.6); server.js có bắt SIGTERM.')}`, 'l') },

  { t: 'Nháy ĐƠN không phải JSON ⇒ lặng lẽ thành dạng shell', body: two(
    term(['$ printf "FROM alpine\\nCMD [\'echo\', \'hi\']\\n" | docker build -t sq -', '+ WARN: JSONArgsRecommended: JSON arguments recommended', '+       for CMD to prevent unintended behavior … (line 2)', '$ docker run --rm sq', '! /bin/sh: [echo,: not found', '$ echo $?', '! 127', '$ docker image inspect sq --format \'{{json .Config.Cmd}}\'', '! ["/bin/sh","-c","[\'echo\', \'hi\']"]'], { title: 'output thật — máy Mac' }),
    `${table(['Viết', 'Cmd trong ảnh'], [
      ['<code>CMD ["echo", "hi"]</code>', '+<code>["echo","hi"]</code>'],
      ['<code>CMD [\'echo\', \'hi\']</code>', '-<code>["/bin/sh","-c","[\'echo\', \'hi\']"]</code>'],
      ['<code>CMD echo hi</code>', '!<code>["/bin/sh","-c","echo hi"]</code>'],
    ], { sm: true })}
    ${box('tip', 'BuildKit giờ CÓ cảnh báo <code>JSONArgsRecommended</code> — đừng bỏ qua dòng WARN màu vàng. Kiểm chắc chắn bằng <code>docker image inspect … {{json .Config.Cmd}}</code>.')}
    ${box('info', 'Cần biến môi trường trong CMD? Dạng exec KHÔNG thay <code>$NAME</code> (in <code>hi $NAME</code>). Viết rõ: <code>CMD ["sh","-c","exec echo hi $NAME"]</code>.')}`, 'l2') },

  { t: 'Entrypoint: chuẩn bị xong, exec "$@" — app thành PID 1', body: two(
    yaml([
      ['#!/bin/sh', ''],
      ['set -e', 'một bước hỏng ⇒ container dừng luôn'],
      ['if [ -n "$DB_HOST" ]; then', 'chỉ chờ khi được chỉ chỗ CSDL'],
      ['  until nc -z "$DB_HOST" "$DB_PORT"; do', 'thử mở cổng TCP'],
      ['    echo "waiting…" >&2; sleep 1', 'log ra stderr'],
      ['  done', ''],
      ['fi', ''],
      ['if [ "$RUN_MIGRATIONS" = "true" ]; then', 'việc một lần: migration'],
      ['  npx prisma migrate deploy', ''],
      ['fi', ''],
      ['exec "$@"', 'THAY shell bằng CMD — dòng quan trọng nhất'],
    ], { fs: 14 }),
    `${yaml([
      ['ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]', 'chạy trước'],
      ['CMD ["node", "src/server.js"]', 'thành "$@"'],
    ], { lang: 'docker', fs: 14 })}
    ${term(['# có exec "$@"', '= 1 node src/server.js', '# thiếu exec (chỉ "$@")', '! 1 /bin/sh /usr/local/bin/entrypoint.sh node src/server.js', '  7 node src/server.js', '$ docker run --rm ep node --version  # đổi CMD', 'v22.23.2'], { title: 'output thật — docker exec … ps -o pid,args' })}`, 'l2') },

  /* ───────────── 4.4 ───────────── */
  { t: 'ARG chỉ sống lúc DỰNG — ENV đi theo ảnh tới mọi container', body: `
    ${argEnvTimeline()}
    ${two(term(['RUN echo "at build: ARG=$BUILD_ONLY ENV=$RUNTIME_TOO"', '#5 0.066 at build: ARG=from-arg ENV=from-env', '$ docker run --rm argenv', '! at run:   ARG= ENV=from-env'], { title: 'output thật — máy Mac' }),
      term(['$ docker history argenv --no-trunc --format \'{{.CreatedBy}}\' | grep -i build_only', '+ RUN |1 BUILD_ONLY=from-arg /bin/sh -c echo …', '+ ARG BUILD_ONLY=from-arg'], { title: 'output thật — ARG không bí mật' }))}` },

  { t: 'ARG trước FROM chỉ dùng được trong dòng FROM', body: two(
    yaml([
      ['ARG ALPINE_VERSION=3.22', 'NGOÀI mọi stage: chỉ dòng FROM thấy'],
      ['', ''],
      ['FROM alpine:${ALPINE_VERSION} AS build', 'dùng được ở đây'],
      ['ARG ALPINE_VERSION', 'khai LẠI, không giá trị = lấy giá trị ngoài'],
      ['RUN echo "stage build thấy: ${ALPINE_VERSION}"', ''],
      ['', ''],
      ['FROM alpine:${ALPINE_VERSION}', ''],
      ['COPY --from=build /msg /msg', 'để stage build được dựng'],
      ['RUN echo "stage cuối thấy: ${ALPINE_VERSION}"', 'không khai lại ⇒ RỖNG'],
    ], { lang: 'docker', fs: 14.5 }),
    `${term(['= #7 0.074 stage build thấy: \'3.22\'', '! #9 0.080 stage cuối thấy: \'\''], { title: 'output thật — máy Mac' })}
    ${box('warn', '<b>Hai cú lừa khi thử bằng <code>NODE_VERSION</code>:</b> ảnh <code>node</code> tự đặt <code>ENV NODE_VERSION=22.23.2</code> nên stage không khai lại vẫn in <code>22.23.2</code>; và stage không được stage cuối dùng tới thì BuildKit <b>bỏ qua, không chạy</b>.')}
    ${box('info', 'Mỗi stage cần biến nào thì <code>ARG TÊN</code> lại trong stage đó. Không lỗi, không cảnh báo — chỉ là chuỗi rỗng.')}`, 'l2') },

  { t: 'Bí mật qua --build-arg ở lại trong ảnh — dùng secret mount', body: two(
    `${lbl('❌ --build-arg NPM_TOKEN=…', 'red')}
    ${term(['$ docker build --build-arg NPM_TOKEN=npm_SuperSecret123 -t leaky -', '+ WARN: SecretsUsedInArgOrEnv: Do not use ARG or ENV', '+   instructions for sensitive data (ARG "NPM_TOKEN")', '$ docker history leaky --no-trunc --format \'{{.CreatedBy}}\' | grep -i token', '! RUN |1 NPM_TOKEN=npm_SuperSecret123 /bin/sh -c echo …', '! ARG NPM_TOKEN=npm_SuperSecret123'], { title: 'output thật — máy Mac' })}`,
    `${lbl('✅ RUN --mount=type=secret', 'grn')}
    ${yaml([
      ['RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \\', 'file chỉ tồn tại'],
      ['    npm ci --omit=dev', 'trong đúng RUN này'],
    ], { lang: 'docker', fs: 14 })}
    ${term(['$ docker build --secret id=npmrc,src=$HOME/.npmrc -t safe .', '$ docker history safe --no-trunc --format \'{{.CreatedBy}}\' | grep -ci token', '= 0', '$ docker run --rm safe ls /root/.npmrc', '= ls: /root/.npmrc: No such file or directory'], { title: 'output thật' })}`) },

  { t: 'ENV NODE_ENV=production đặt quá sớm ⇒ tsc: not found', body: two(
    yaml([
      ['FROM node:22-alpine', ''],
      ['ENV NODE_ENV=production', 'đặt QUÁ SỚM'],
      ['WORKDIR /app', ''],
      ['COPY package*.json ./', ''],
      ['RUN npm ci', 'đọc NODE_ENV ⇒ BỎ devDependencies'],
      ['COPY . .', ''],
      ['RUN npm run build', 'typescript nằm trong devDependencies…'],
    ], { lang: 'docker', fs: 15 }),
    `${term(['#8 4.514 added 68 packages, and audited 69 packages in 4s', '#10 0.172 > demo@1.0.0 build', '#10 0.172 > tsc -p tsconfig.json', '! #10 0.176 sh: tsc: not found', '! ERROR: … "npm run build" did not complete successfully: exit code: 127'], { title: 'output thật — máy Mac' })}
    ${box('good', '<b>Sửa:</b> dựng CÓ devDependencies, chỉ đặt <code>NODE_ENV=production</code> ở <b>stage cuối</b> (công thức Node, Bài 4.5).')}
    ${box('warn', 'Một dòng <code>ENV</code> đổi hành vi MỌI <code>RUN</code> phía dưới. Đặt sớm được: <code>PYTHONUNBUFFERED=1</code>, <code>NEXT_TELEMETRY_DISABLED=1</code> — thứ không đổi cách cài thư viện.')}`, 'l2') },

  { t: 'ARG có sẵn miễn phí — và --build-arg gõ sai thì BuildKit im lặng', body: two(
    `${yaml([
      ['FROM --platform=$BUILDPLATFORM alpine', 'chạy trên CPU thật của máy dựng'],
      ['ARG TARGETPLATFORM TARGETOS TARGETARCH BUILDPLATFORM', 'khai là dùng được'],
      ['RUN echo "building on $BUILDPLATFORM for $TARGETPLATFORM"', ''],
    ], { lang: 'docker', fs: 14 })}
    ${term(['$ docker build -f plat.Dockerfile .', 'building on linux/arm64 for linux/arm64 (linux/arm64)', '$ docker build --platform linux/amd64 -f plat.Dockerfile .', '= building on linux/arm64 for linux/amd64 (linux/amd64)'], { title: 'output thật — máy Mac M1' })}`,
    `${term(['# Dockerfile khai ARG API_URL, lệnh gõ nhầm tên:', '$ docker build --build-arg API_ULR=https://api.example.com …', '! #5 0.082 []           ← API_URL rỗng', '$ … 2>&1 | grep -ci API_ULR', '! 0                     ← không một chữ cảnh báo'], { title: 'output thật — máy Mac, BuildKit' })}
    ${table(['ARG có sẵn', 'Nghĩa'], [
      ['<code>TARGETOS/ARCH/PLATFORM</code>', 'dựng CHO máy nào'],
      ['<code>BUILDOS/ARCH/PLATFORM</code>', 'dựng TRÊN máy nào'],
      ['<code>HTTP(S)_PROXY</code>, <code>NO_PROXY</code>', 'có sẵn, KHÔNG ghi vào history'],
    ], { sm: true })}`) },

  /* ───────────── 4.5 ───────────── */
  { t: '5 công thức dựng thật: ảnh cuối nhẹ hơn stage dựng 3–27 lần', body: two(
    bars([
      { l: 'Next.js — stage build', sub: 'node_modules + .next đầy đủ', v: 979, txt: '979MB', c: 'red' },
      { l: 'Python — stage build', sub: 'gcc + libpq-dev', v: 675, txt: '675MB', c: 'red' },
      { l: 'golang:1.23-alpine', sub: 'bộ công cụ Go', v: 365, txt: '365MB', c: 'red' },
      { l: 'Next.js standalone', sub: 'ảnh cuối', v: 328, txt: '328MB', c: 'grn' },
      { l: 'Node API (Express + TS)', sub: 'ảnh cuối', v: 240, txt: '240MB', c: 'grn' },
      { l: 'Python FastAPI', sub: 'ảnh cuối · slim', v: 232, txt: '232MB', c: 'grn' },
      { l: 'Trang tĩnh (nginx)', sub: 'ảnh cuối', v: 76, txt: '76MB', c: 'grn' },
      { l: 'Go + distroless', sub: 'ảnh cuối', v: 13.6, txt: '13.6MB', c: 'grn' },
    ], { lw: 250, max: 1000 }),
    `${steps([
      ['Thư viện TRƯỚC, mã nguồn SAU', '<code>COPY package*.json</code> → cài → <code>COPY . .</code>'],
      ['Công cụ dựng ở lại stage dựng', 'trình biên dịch, devDependencies không lên ảnh cuối'],
      ['Nghe trên 0.0.0.0', 'không phải 127.0.0.1 của riêng container'],
      ['USER không phải root, đặt muộn', 'node · app · nonroot'],
      ['CMD dạng exec + HEALTHCHECK', 'dừng êm, Compose biết lúc nào sẵn sàng'],
    ])}
    ${small('Cột DISK USAGE của <code>docker images</code>, máy Mac arm64.')}`, 'l') },

  { t: 'Công thức 1 · API Node + TypeScript — đọc từng dòng', body: yaml([
    ['# syntax=docker/dockerfile:1', 'bật tính năng BuildKit mới'],
    ['FROM node:22-alpine AS deps', 'stage 1: thư viện CHẠY'],
    ['WORKDIR /app', ''],
    ['COPY package.json package-lock.json ./', ''],
    ['RUN npm ci --omit=dev', 'chỉ dependencies, không devDependencies'],
    ['FROM node:22-alpine AS build', 'stage 2: biên dịch'],
    ['WORKDIR /app', ''],
    ['COPY package.json package-lock.json ./', ''],
    ['RUN npm ci', 'CÓ devDependencies — cần tsc'],
    ['COPY . .', ''],
    ['RUN npm run build', 'tsc → dist/'],
    ['FROM node:22-alpine', 'stage cuối: chỉ thứ cần để CHẠY'],
    ['ENV NODE_ENV=production', 'đặt ở đây, sau khi đã build'],
    ['WORKDIR /app', ''],
    ['COPY --from=deps  --chown=node:node /app/node_modules ./node_modules', 'thư viện chạy, đã đổi chủ'],
    ['COPY --from=build --chown=node:node /app/dist ./dist', 'JS đã biên dịch, không có .ts'],
    ['COPY --chown=node:node package.json ./', ''],
    ['USER node', 'UID 1000 có sẵn trong ảnh node'],
    ['EXPOSE 3000', ''],
    ['HEALTHCHECK --interval=30s --timeout=3s --start-period=15s \\', '⇒ (healthy) sau ~30 s'],
    ['  CMD wget -qO- http://127.0.0.1:3000/health || exit 1', 'busybox wget có sẵn'],
    ['CMD ["node", "dist/index.js"]', 'dạng exec: node là PID 1'],
  ], { lang: 'docker', fs: 13.5 }) },

  { t: 'Công thức 2 · Next.js với output: \'standalone\'', body: two(
    yaml([
      ['FROM node:22-alpine AS deps', ''],
      ['WORKDIR /app', ''],
      ['COPY package.json package-lock.json ./', ''],
      ['RUN npm ci', 'đủ cả devDependencies'],
      ['FROM node:22-alpine AS build', ''],
      ['WORKDIR /app', ''],
      ['COPY --from=deps /app/node_modules ./node_modules', ''],
      ['COPY . .', ''],
      ['ARG NEXT_PUBLIC_API_URL', 'NƯỚNG vào JS lúc dựng'],
      ['ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}', ''],
      ['ENV NEXT_TELEMETRY_DISABLED=1', ''],
      ['RUN npm run build', '→ .next/standalone'],
      ['FROM node:22-alpine', ''],
      ['ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0', 'đè HOSTNAME Docker đặt'],
      ['WORKDIR /app', ''],
      ['COPY --from=build … /app/.next/standalone ./', 'server.js + node_modules đã tỉa'],
      ['COPY --from=build … /app/.next/static ./.next/static', 'standalone KHÔNG có'],
      ['COPY --from=build … /app/public ./public', 'standalone KHÔNG có'],
      ['USER node', ''],
      ['CMD ["node", "server.js"]', ''],
    ], { lang: 'docker', fs: 13 }),
    `${yaml([['module.exports = { output: \'standalone\' };', 'next.config.js']], { fs: 13.5 })}
    ${kpis([{ v: '979MB', l: 'stage build', c: 'red' }, { v: '328MB', l: 'ảnh standalone', c: 'grn' }])}
    ${small('Next.js 16.3.6 · <code>/app/node_modules</code> trong ảnh cuối chỉ còn <b>64.5M</b> (máy bạn: 328M).')}`, 'l') },

  { t: 'Ba cái bẫy Next.js trong container — đã thử tận tay', body: two(
    `${term(['# 1. Thiếu ENV HOSTNAME=0.0.0.0 — Docker đặt HOSTNAME=<ID container>', '$ docker logs web', '- Network:       http://d3f8c095b712:3000', '$ docker exec web netstat -tln | grep 3000', '! tcp  0  0 172.17.0.8:3000   0.0.0.0:*   LISTEN', '$ curl localhost:18045/            # từ máy Mac qua -p', '= 200', '$ docker exec web wget -qO- http://127.0.0.1:3000/', '! wget: can\'t connect to remote host (127.0.0.1): Connection refused'], { title: 'output thật — ⇒ HEALTHCHECK luôn hỏng' })}
    ${term(['# 2. Quên COPY .next/static và public', '$ curl -o /dev/null -w \'%{http_code}\' …/_next/static/chunks/…css', '! 404', '$ curl -o /dev/null -w \'%{http_code}\' …/logo.svg', '! 404'], { title: 'output thật — trang / vẫn 200, mất hết CSS + ảnh' })}`,
    `${term(['# 3. NEXT_PUBLIC_* nướng lúc DỰNG', '$ docker build --build-arg NEXT_PUBLIC_API_URL=https://api.vidu.vn …', '$ docker run -e NEXT_PUBLIC_API_URL=https://DOI-LUC-CHAY.vn …', '$ curl -s localhost:18044/ | grep -o \'API: .*vn\'', '! API: <!-- -->https://api.vidu.vn'], { title: 'output thật — -e lúc chạy vô tác dụng' })}
    ${table(['Triệu chứng', 'Sửa'], [
      ['healthcheck đỏ, <code>-p</code> vẫn chạy', '<code>ENV HOSTNAME=0.0.0.0</code>'],
      ['CSS, ảnh 404', 'COPY <code>.next/static</code> + <code>public</code>'],
      ['đổi <code>-e</code> không ăn', 'dựng lại, mỗi môi trường một ảnh'],
    ], { sm: true })}`, 'l2') },

  { t: 'Công thức 3 · Python: slim, hai stage, PYTHONUNBUFFERED', body: two(
    yaml([
      ['FROM python:3.12-slim AS build', 'Debian ⇒ wheel glibc chạy ngay'],
      ['ENV PIP_DISABLE_PIP_VERSION_CHECK=1 PIP_NO_CACHE_DIR=1', ''],
      ['WORKDIR /app', ''],
      ['RUN apt-get update && apt-get install -y \\', ''],
      ['      --no-install-recommends build-essential libpq-dev \\', 'gcc để dựng psycopg2'],
      [' && rm -rf /var/lib/apt/lists/*', 'dọn trong CÙNG RUN'],
      ['COPY requirements.txt ./', ''],
      ['RUN pip install --prefix=/install -r requirements.txt', 'cài vào /install riêng'],
      ['FROM python:3.12-slim', 'stage cuối: không gcc'],
      ['ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1', 'log ra ngay'],
      ['RUN apt-get update && apt-get install -y \\', ''],
      ['      --no-install-recommends libpq5 \\', 'chỉ thư viện CHẠY'],
      [' && rm -rf /var/lib/apt/lists/* && useradd -u 1000 -m app', ''],
      ['WORKDIR /app', ''],
      ['COPY --from=build /install /usr/local', ''],
      ['COPY --chown=app:app . .', ''],
      ['USER app', ''],
      ['CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]', 'uvicorn mặc định 127.0.0.1'],
    ], { lang: 'docker', fs: 12.5 }),
    `${term(['$ docker logs py        # ảnh gốc', '= app đang khởi động', 'INFO:     Started server process [1]', '$ docker run -e PYTHONUNBUFFERED= … py2', '$ docker logs py2', '! INFO:     Started server process [1]', '# dòng print() đâu mất — nằm trong bộ đệm'], { title: 'output thật — máy Mac' })}
    ${kpis([{ v: '675MB', l: 'stage build', c: 'red' }, { v: '232MB', l: 'ảnh cuối', c: 'grn' }])}`, 'l') },

  { t: 'Công thức 4 &amp; 5 · Go 13,6 MB và trang tĩnh sau nginx', body: two(
    `${yaml([
      ['FROM --platform=$BUILDPLATFORM golang:1.23-alpine AS build', 'luôn CPU thật'],
      ['WORKDIR /src', ''],
      ['COPY go.mod go.sum ./', ''],
      ['RUN go mod download', 'tầng thư viện riêng'],
      ['COPY . .', ''],
      ['ARG TARGETOS TARGETARCH', ''],
      ['RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH \\', 'không libc'],
      ['    go build -ldflags="-s -w" -o /out/server ./cmd/server', '7,7 → 5,2 MB'],
      ['FROM gcr.io/distroless/static-debian12:nonroot', 'không shell'],
      ['COPY --from=build /out/server /server', ''],
      ['USER nonroot:nonroot', 'UID 65532'],
      ['ENTRYPOINT ["/server"]', ''],
    ], { lang: 'docker', fs: 12.5 })}
    ${term(['$ docker build --platform linux/amd64 -t goapp .  # 7 s', '$ curl -s localhost:18047/health', '= {"arch":"arm64","go":"go1.23.12","ok":true}'], { title: 'output thật — máy Mac' })}`,
    `${yaml([
      ['FROM node:22-alpine AS build', ''],
      ['WORKDIR /app', ''],
      ['COPY package.json package-lock.json ./', ''],
      ['RUN npm ci', ''],
      ['COPY . .', ''],
      ['RUN npm run build', 'vite → dist/'],
      ['FROM nginx:1.27-alpine', 'không cần CMD'],
      ['COPY nginx.conf /etc/nginx/conf.d/default.conf', ''],
      ['COPY --from=build /app/dist /usr/share/nginx/html', ''],
    ], { lang: 'docker', fs: 12.5 })}
    ${term(['# nginx.conf: try_files $uri $uri/ /index.html;', '$ curl -o /dev/null -w \'%{http_code}\' localhost:18048/dang-nhap', '= 200            ← SPA fallback', '$ curl -sI …/assets/index-AxA_Pi8B.js | grep -i cache', 'Cache-Control: public, immutable'], { title: 'output thật — 76MB' })}`) },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 4', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Build chậm, ảnh có <code>.env</code> / <code>.git</code>', 'Không có <code>.dockerignore</code> + <code>COPY . .</code>', 'Viết <code>.dockerignore</code> trước tiên'],
    ['<code>COPY ../shared</code> → <code>"/shared": not found</code>', 'Ngoài ngữ cảnh thì bộ dựng không thấy', 'Lùi ngữ cảnh lên thư mục cha, dùng <code>-f</code>'],
    ['RUN chạy nhầm thư mục', '<code>RUN cd</code> không sống qua dòng sau', '<code>WORKDIR</code>'],
    ['Build xanh mà ảnh thiếu thứ', 'Lỗi giữa ống dẫn / heredoc không <code>set -e</code>', '<code>SHELL [… pipefail …]</code>, <code>set -eux</code>'],
    ['Ảnh phình gấp đôi', '<code>RUN chown -R</code> sau <code>COPY</code>', '<code>COPY --chown</code>'],
    ['<code>docker stop</code> luôn 10 s', 'Shell làm PID 1 (dash, nhiều lệnh), app không bắt SIGTERM', 'CMD dạng exec; entrypoint kết thúc <code>exec "$@"</code>'],
    ['<code>[node,: not found</code>, exit 127', 'CMD viết nháy đơn', 'Nháy kép; đọc WARN <code>JSONArgsRecommended</code>'],
    ['Biến rỗng trong stage', 'ARG trước FROM không khai lại', '<code>ARG TÊN</code> trong từng stage'],
    ['<code>sh: tsc: not found</code>', '<code>ENV NODE_ENV=production</code> trước <code>npm ci</code>', 'Chỉ đặt ở stage cuối'],
    ['Healthcheck Next.js đỏ', 'Thiếu <code>HOSTNAME=0.0.0.0</code>', 'Thêm vào <code>ENV</code> stage cuối'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 4', body: table(['Muốn…', 'Gõ / viết'], [
    ['Soi ngữ cảnh chứa gì', '<code>printf \'FROM busybox\\nCOPY . /ctx\\nRUN du -sh /ctx; ls -A /ctx\' | docker build --no-cache --progress=plain -f- .</code>'],
    ['Dockerfile ở chỗ khác', '<code>docker build -f docker/api.Dockerfile -t api:1 .</code>'],
    ['Xem MỌI dòng output của RUN', '<code>docker build --progress=plain .</code>'],
    ['Dựng lại từ đầu · kéo ảnh nền mới', '<code>--no-cache</code> · <code>--pull</code>'],
    ['Xem lệnh thật của ảnh', '<code>docker image inspect img --format \'{{json .Config.Entrypoint}} {{json .Config.Cmd}}\'</code>'],
    ['Đè ENTRYPOINT để gỡ lỗi', '<code>docker run --rm -it --entrypoint sh img</code>'],
    ['Truyền giá trị lúc dựng', '<code>--build-arg API_URL=https://…</code> (+ <code>ARG API_URL</code> trong stage)'],
    ['Truyền bí mật lúc dựng', '<code>--secret id=npmrc,src=$HOME/.npmrc</code> + <code>RUN --mount=type=secret,id=npmrc,…</code>'],
    ['Dựng cho máy khác', '<code>docker build --platform linux/amd64 .</code>'],
    ['Dựng một stage', '<code>docker build --target build -t app:build .</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 4 (45 phút)', body: `
    ${steps([
      ['Viết <code>.dockerignore</code> cho một dự án thật của bạn, đo ngữ cảnh trước/sau', 'lệnh soi ngữ cảnh ở bảng tra — ghi lại MB và số file'],
      ['Dockerize API Node của nhóm theo công thức 1, chạy ở cổng 18040', '<code>curl /health</code> trả JSON, <code>docker exec … id</code> ra <code>uid=1000(node)</code>'],
      ['Làm cho <code>docker stop</code> mất 10 s rồi sửa về &lt; 1 s', 'đổi CMD sang dạng shell trên <code>node:22-slim</code>, đo, rồi sửa dạng exec'],
      ['Viết entrypoint chờ CSDL + <code>exec "$@"</code>', '<code>docker exec … ps</code>: PID 1 phải là <code>node</code>'],
      ['Tái hiện <code>tsc: not found</code> rồi sửa bằng stage cuối', 'và kiểm <code>docker history</code> không có token nào'],
    ])}
    ${box('good', '<b>Đạt khi:</b> ảnh của bạn không chứa <code>.env</code>/<code>.git</code> (<code>docker run --rm img ls -A</code>), dừng dưới 1 s, chạy bằng user không phải root, và bạn đọc to được từng dòng Dockerfile của mình.')}` },
]);
