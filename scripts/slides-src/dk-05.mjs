/**
 * Docker · Deck dk-05 — Chương 5: Tầng ảnh, cache & dựng nhanh.
 *
 * MỌI output terminal và MỌI con số thời gian trên slide là ĐO THẬT, 23/09/2026, trên
 *   • "máy Mac" = Mac M1 Max, Docker Desktop 4.91 / Engine 29.8.0 (BuildKit v0.33, buildx v0.37), arm64,
 *                 kho ảnh containerd. Mạng gia đình — npm ci phụ thuộc mạng nên dao động mạnh (ghi rõ trên slide).
 *   • "backend thật" = package.json + package-lock.json của một dự án sinh viên (898 gói trong lockfile),
 *                 cài bằng `npm ci --omit=dev --ignore-scripts`.
 *   • builder riêng `dk05-*` (driver docker-container) dùng cho mọi phép đo cần cache SẠCH — không prune builder chung.
 * Tên ảnh trong output mang tiền tố dk05- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 *
 * Hình tự vẽ (SVG nội tuyến): keyChain() — chuỗi khoá cache; cacheStack() — chồng tầng HIT (xanh) / MISS (đỏ),
 * hình TRUNG TÂM của chương (trước/sau khi đổi thứ tự COPY package.json); mountVsLayer(); ciFlow().
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, mindmap, term as dkTerm, diagram, yaml, bars, layers, sv, R, T, A, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });

export const deck = { key: 'dk-05', code: 'DOCKER · CHƯƠNG 5', title: 'Tầng ảnh, cache & dựng nhanh', sub: 'Docker · Chương 5' };

/* ───────────── Slide 3 — chuỗi khoá cache ───────────── */
const keyChain = () => {
  const steps_ = [
    ['FROM node:22-alpine', 'digest của ảnh nền', 'tea'],
    ['WORKDIR /app', 'chuỗi chỉ thị', 'dim'],
    ['COPY package*.json ./', 'mã băm NỘI DUNG 2 file', 'blu'],
    ['RUN npm ci', 'CHUỖI lệnh "npm ci"', 'amb'],
    ['COPY app.js ./', 'mã băm NỘI DUNG app.js', 'blu'],
  ];
  let s = '';
  const x0 = 10, w = 214, gap = 18;
  steps_.forEach(([t, k, c], i) => {
    const x = x0 + i * (w + gap);
    s += R(x, 20, w, 64, { c, fill: '#0f182a' }) + T(x + w / 2, 58, t, { fs: 15.5, a: 'middle', b: true, mono: true });
    s += R(x, 130, w, 110, { c: 'dk', fill: 'rgba(36,150,237,.07)', dash: true });
    s += T(x + w / 2, 158, `khoá ${i + 1} =`, { fs: 16, a: 'middle', c: 'dk', b: true });
    s += T(x + w / 2, 186, i ? `khoá ${i}` : '(bắt đầu)', { fs: 15, a: 'middle', c: i ? 'amb' : 'mu', b: !!i });
    s += T(x + w / 2, 214, `+ ${k}`, { fs: 13.5, a: 'middle', c: 'mu' });
    s += A(x + w / 2, 86, x + w / 2, 126, { c: 'dim', sw: 2 });
    if (i < steps_.length - 1) s += A(x + w - 10, 196, x + w + gap + 38, 186, { c: 'amb', sw: 2.5 });
  });
  s += T(580, 286, 'khoá của bước sau CHỨA khoá của bước trước ⇒ một bước đổi là mọi bước SAU nó đổi khoá theo', { fs: 17, a: 'middle', c: 'amb', b: true });
  s += T(580, 316, 'tìm thấy khoá trong cache ⇒ HIT, in chữ CACHED, không chạy gì · không thấy ⇒ MISS, chạy thật', { fs: 15.5, a: 'middle', c: 'mu' });
  return sv(1160, 330, s);
};

/* ───────────── Hình trung tâm — chồng tầng HIT / MISS ─────────────
 * rows: DƯỚI → TRÊN (FROM ở đáy, như ảnh thật). st: 'hit' | 'miss' | 'meta'. */
const cacheStack = ({ title, sub, rows, w = 540, verdict, vc = 'grn', edit }) => {
  const rh = 48, gap = 8, top = 64, n = rows.length;
  const H = top + n * (rh + gap) + 58;
  let s = T(0, 24, title, { fs: 19, b: true }) + T(0, 48, sub, { fs: 14.5, c: 'mu' });
  const firstMiss = rows.findIndex((r) => r.st === 'miss');
  rows.forEach((r, i) => {
    const y = top + (n - 1 - i) * (rh + gap);
    const ok = r.st === 'hit' || r.st === 'base';
    const c = ok ? 'grn' : r.st === 'miss' ? 'red' : 'dim';
    const fill = ok ? 'rgba(63,185,80,.13)' : r.st === 'miss' ? 'rgba(255,92,108,.15)' : '#0f182a';
    s += R(0, y, w - 150, rh, { c, fill, r: 9 }) + T(14, y + 30, r.t, { fs: 15.5, mono: true });
    const tag = r.st === 'hit' ? 'HIT · CACHED' : r.st === 'base' ? 'CÓ SẴN' : r.st === 'miss' ? 'MISS' : 'chỉ ghi JSON';
    s += T(w - 138, y + 22, tag, { fs: 14, c, b: true }) + (r.tm ? T(w - 138, y + 40, r.tm, { fs: 13.5, c: 'mu', mono: true }) : '');
  });
  if (firstMiss >= 0) {
    const yTop = top, yMiss = top + (n - 1 - firstMiss) * (rh + gap) + rh;
    s += `<path d="M${w - 4} ${yMiss} L${w - 4} ${yTop + 4}" stroke="${D.red}" stroke-width="3" marker-end="url(#m-red)"/>`;
  }
  if (edit) s += T(w - 150, top + (n - 1 - edit.at) * (rh + gap) - 6, edit.t, { fs: 13.5, c: 'amb', a: 'end' });
  s += T(0, H - 16, verdict, { fs: 17, c: vc, b: true });
  return sv(w + 10, H, s);
};

/* ───────────── Slide 13 — tầng cache vs cache mount ───────────── */
const mountVsLayer = () => {
  let s = '';
  s += T(0, 26, 'TẦNG CACHE — khoá khớp thì BỎ QUA hẳn', { fs: 18, c: 'grn', b: true });
  s += R(0, 44, 520, 70, { c: 'grn', fill: 'rgba(63,185,80,.1)' }) + T(20, 76, 'RUN npm ci', { fs: 18, mono: true, b: true }) + T(20, 100, 'khoá khớp ⇒ 0 giây · lệch 1 byte lockfile ⇒ làm lại TỪ ĐẦU', { fs: 14.5, c: 'mu' });
  s += T(0, 160, 'Được ăn cả, ngã về không: thêm 1 thư viện ⇒ tải lại cả 898 gói', { fs: 15.5, c: 'red' });
  s += T(620, 26, 'CACHE MOUNT — bước VẪN chạy, đồ đã tải nằm sẵn', { fs: 18, c: 'vio', b: true });
  s += R(620, 44, 520, 70, { c: 'amb', fill: 'rgba(255,194,51,.08)' }) + T(640, 76, 'RUN --mount=type=cache,target=/root/.npm npm ci', { fs: 14.5, mono: true, b: true }) + T(640, 100, 'MISS vẫn chạy — nhưng chỉ tải gói MỚI', { fs: 14.5, c: 'mu' });
  s += R(700, 150, 360, 60, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.08)' }) + T(880, 178, '/root/.npm — sống qua các lượt dựng', { fs: 15, a: 'middle', c: 'vio', b: true }) + T(880, 199, 'NẰM NGOÀI mọi tầng · 165,5 MB đo thật', { fs: 13.5, a: 'middle', c: 'mu' });
  s += `<path d="M880 150 L880 118" stroke="${D.vio}" stroke-width="3" marker-end="url(#m-vio)" stroke-dasharray="6 5"/>`;
  s += R(0, 240, 1140, 64, { c: 'dk', fill: 'rgba(36,150,237,.07)' });
  s += T(570, 268, 'Hai thứ giải HAI nửa bài toán: thứ tự đúng làm MISS hiếm, cache mount làm MISS rẻ — dùng CẢ HAI', { fs: 17, a: 'middle', b: true });
  s += T(570, 292, 'Không gì trong mount lọt vào ảnh: tốt cho bộ đệm tải về, CHẾT cho kết quả dựng (dist/)', { fs: 15, a: 'middle', c: 'amb' });
  return sv(1150, 310, s);
};

/* ───────────── Slide 19 — CI: máy mới tinh, cache đi đâu ───────────── */
const ciFlow = () => diagram({ w: 1160, h: 300, nodes: [
  { id: 'r1', x: 10, y: 20, w: 270, h: 88, t: 'Lượt CI #1 (máy mới)', d: 'dựng nguội: 58–70 s\n--cache-to …,mode=max', c: 'amb' },
  { id: 'st', x: 440, y: 110, w: 290, h: 96, t: 'Kho cache', d: 'type=gha · registry · local\n(331 MB với backend thật)', c: 'vio' },
  { id: 'r2', x: 880, y: 20, w: 270, h: 88, t: 'Lượt CI #2 (máy mới)', d: 'ĐỌC cache: 17,8 s\n--cache-from …', c: 'grn' },
  { id: 'lap', x: 880, y: 196, w: 270, h: 88, t: 'Laptop của bạn', d: 'cũng đọc được nếu\nlà type=registry', c: 'blu', dash: true },
  { id: 'loc', x: 10, y: 196, w: 270, h: 88, t: 'Cache trong máy CI', d: 'BIẾN MẤT khi\nmáy bị huỷ sau job', c: 'red', dash: true },
], edges: [
  { from: 'r1', to: 'st', t: 'xuất (ghi)', c: 'amb' },
  { from: 'st', to: 'r2', t: 'nhập (đọc)', c: 'grn' },
  { from: 'st', to: 'lap', c: 'blu', dash: true },
  { from: 'r1', to: 'loc', c: 'red', dash: true, t: 'cục bộ' },
] });

export const slides = S([
  cover({ t: 'Chương 5 — Tầng ảnh, cache &amp; dựng nhanh', sub: 'Khoá cache · thứ tự chỉ thị · cache mount · chia sẻ cache với CI · chẩn đoán lượt dựng chậm', chap: 'CHƯƠNG 5' }),

  { t: 'Bản đồ chương: dựng lại 138 giây → 5 giây', body: mindmap('Dựng nhanh', 'đo thật trên backend 898 gói', [
    { t: '5.1 Cache quyết định thế nào', d: 'khoá = bước trước + chuỗi lệnh / nội dung file', c: 'dk' },
    { t: '5.2 Thứ tự chỉ thị', d: 'ít đổi ở dưới · một MISS kéo cả phần trên', c: 'grn' },
    { t: '5.3 Cache mount', d: 'MISS vẫn rẻ: 63 s → 9 s', c: 'vio' },
    { t: '5.4 Cache cho CI', d: 'máy mới tinh: --cache-from / --cache-to, mode=max', c: 'amb' },
    { t: '5.5 Chẩn đoán dựng chậm', d: '3 phép đo · sắp dòng DONE · --check', c: 'red' },
  ]) },

  /* ───────────── 5.1 ───────────── */
  { t: 'Mỗi chỉ thị là một bước có KHOÁ — khoá sau chứa khoá trước', body: `
    ${keyChain()}
    ${box('info', 'Trước khi chạy một bước, BuildKit tính khoá rồi đi tìm trong cache. Đây là LUẬT DUY NHẤT của cả chương — mọi mẹo phía sau chỉ là cách giữ cho khoá không đổi.')}` },

  { t: 'RUN nhìn CHUỖI lệnh — COPY nhìn NỘI DUNG file, không nhìn giờ sửa', body: two(
    table(['Chỉ thị', 'Khoá gồm', 'MISS khi'], [
      ['<code>RUN</code>', 'chuỗi lệnh (+ ARG/ENV đang có)', 'sửa 1 ký tự trong lệnh'],
      ['<code>COPY</code> / <code>ADD</code>', 'mã băm nội dung + đường dẫn + quyền', 'sửa 1 byte file được chép'],
      ['<code>FROM</code>', 'digest của ảnh nền', 'tag trỏ sang digest mới'],
      ['<code>ENV</code> <code>CMD</code> <code>LABEL</code>…', 'chuỗi chỉ thị', 'chỉ ghi JSON, gần 0 giây'],
      ['!<code>touch app.js</code>', 'không đổi', '-KHÔNG MISS (bỏ qua mtime)'],
    ], { sm: true }),
    term(['$ touch app.js', '$ docker build --progress=plain -t c:4 . 2>&1 \\', '    | grep -c CACHED', '= 5', '$ printf \'\\n\' >> app.js       # thêm 1 byte', '$ docker build --progress=plain -t c:5 . 2>&1 \\', '    | grep -c CACHED', '! 4', '# 1 trong 5 dòng CACHED là ảnh docker/dockerfile:1', '# (dòng # syntax) — không phải một bước của bạn'], { title: 'output thật — máy Mac' }), 'r') },

  { t: 'Đổi package.json ⇒ bước 3 MISS kéo bước 4, 5 MISS theo', body: two(
    cacheStack({ title: 'Sau khi thêm một thư viện', sub: 'package.json đổi · app.js KHÔNG đổi mà vẫn chép lại', w: 520,
      rows: [
        { t: 'FROM node:22-alpine', st: 'base', tm: 'DONE 0.0s' },
        { t: 'WORKDIR /app', st: 'hit' },
        { t: 'COPY package*.json ./', st: 'miss', tm: 'DONE 0.0s' },
        { t: 'RUN npm ci --omit=dev', st: 'miss', tm: 'DONE 2.8s' },
        { t: 'COPY app.js ./', st: 'miss', tm: 'DONE 0.0s' },
      ], verdict: '▲ từ tầng MISS đầu tiên trở lên: MISS hết', vc: 'red' }),
    term(['$ npm install --package-lock-only dotenv@^16.4.5', '$ docker build --progress=plain -t c:3 . 2>&1 \\', '    | grep -E \'^#[0-9]+ (\\[|CACHED|DONE)\'', '# … (bỏ các dòng [internal])', '#7 [1/5] FROM docker.io/library/node:22-alpine@sha256:b6f2…', '#7 DONE 0.0s', '#8 [2/5] WORKDIR /app', '= #8 CACHED', '#9 [3/5] COPY package.json package-lock.json ./', '! #9 DONE 0.0s', '#10 [4/5] RUN npm ci --omit=dev', '! #10 DONE 2.8s', '#11 [5/5] COPY app.js ./', '! #11 DONE 0.0s', '# #N = số thứ tự việc · [3/5] = bước 3 trên 5', '# CACHED = HIT · DONE x.xs = đã chạy thật'], { title: 'output thật — máy Mac, Engine 29.8' }), 'r') },

  { t: 'ARG đổi giá trị ⇒ MỌI lệnh RUN sau nó chạy lại, dù không dùng nó', body: two(
    `${yaml([
      ['FROM node:22-alpine', ''],
      ['ARG BUILD_DATE', '❌ khai báo ở ĐẦU'],
      ['WORKDIR /app', 'HIT'],
      ['COPY package*.json ./', 'HIT'],
      ['RUN npm ci --omit=dev', 'MISS — ARG là biến môi trường của RUN'],
      ['COPY app.js ./', 'MISS theo'],
      ['LABEL built=$BUILD_DATE', 'chỗ DUY NHẤT dùng nó'],
    ], { lang: 'docker', fs: 15 })}
    ${box('good', 'Sửa: dời <code>ARG BUILD_DATE</code> xuống <b>ngay trên</b> dòng <code>LABEL</code> cuối cùng — chỉ dòng đó đổi.')}`,
    term(['$ docker build --build-arg BUILD_DATE=1 -t c:arg .', '$ docker build --build-arg BUILD_DATE=2 \\', '    --progress=plain -t c:arg . 2>&1 | grep …', '#8 [2/5] WORKDIR /app', '= #8 CACHED', '#9 [3/5] COPY package.json package-lock.json ./', '= #9 CACHED', '#10 [4/5] RUN npm ci --omit=dev', '! #10 DONE 1.1s', '#11 [5/5] COPY app.js ./', '! #11 DONE 0.0s'], { title: 'output thật — máy Mac' }), 'l') },

  { t: 'apt-get update đứng riêng một RUN = danh mục gói cũ mãi mãi', body: `
    ${vs({
      no: { t: 'Hai RUN: update bị lưu đệm vĩnh viễn', items: ['<code>RUN apt-get update</code> — chuỗi lệnh không bao giờ đổi ⇒ luôn HIT', '<code>RUN apt-get install -y curl git</code> — thêm <code>git</code> chỉ đổi dòng NÀY', 'Danh mục cũ hàng tuần ⇒ <code>404 Not Found</code>: trông như lỗi mạng, thật ra là lỗi CACHE'] },
      yes: { t: 'Một RUN: hai lệnh cùng MISS', items: ['<code>RUN apt-get update \\</code>', '<code>&amp;&amp; apt-get install -y --no-install-recommends curl \\</code>', '<code>&amp;&amp; rm -rf /var/lib/apt/lists/*</code>', 'Áp cho mọi cặp "làm mới danh mục rồi dùng": <code>apk</code>, <code>dnf</code>…'] },
    })}
    ${box('warn', 'Cùng họ bẫy: <code>RUN git clone …</code> hay <code>RUN curl -O …/latest.tar.gz</code> — chuỗi lệnh cố định nên kết quả ĐÚNG theo luật cache mà SAI thực tế. Ghim phiên bản ngay trong lệnh.')}` },

  { t: 'Sáu thứ ÂM THẦM phá cache — chẳng ai sửa Dockerfile mà vẫn chậm', body: cards([
    { ic: '📦', t: 'COPY . . đặt sớm', d: 'Sửa README cũng cài lại thư viện. Nguyên nhân số 1 (Bài 5.2).', c: 'red' },
    { ic: '🗂', t: 'Thư mục .git', d: 'Đổi ở MỌI commit. Không có trong <code>.dockerignore</code> ⇒ mọi <code>COPY .</code> đều MISS.', c: 'ora' },
    { ic: '🕒', t: 'File sinh ra mỗi lượt', d: '<code>version.json</code>, <code>.env</code> CI ghi, báo cáo coverage — chép SAU CÙNG hoặc bỏ khỏi ngữ cảnh.', c: 'amb' },
    { ic: '🏷', t: 'ARG đổi giá trị', d: 'Mọi <code>RUN</code> sau nó chạy lại. <code>--build-arg BUILD_DATE=$(date)</code> ở đầu = tắt cache.', c: 'vio' },
    { ic: '🔧', t: 'Builder khác', d: 'Mỗi builder một cache riêng. Máy CI mới tinh = nguội (Bài 5.4).', c: 'blu' },
    { ic: '⬇️', t: '--pull / tag dịch đi', d: 'Digest ảnh nền mới ⇒ MISS tất cả. Đúng và cần — nhưng chỉ nên chạy theo lịch.', c: 'tea' },
  ], 3) },

  /* ───────────── 5.2 ───────────── */
  { t: 'Đổi CHỖ một dòng COPY: sửa mã xong dựng lại 138 s → 3,6 s', body: `<div style="display:flex;gap:36px;justify-content:center">
    ${cacheStack({ title: '❌ COPY . . đứng trên npm ci', sub: 'sửa src/index.js rồi dựng lại', w: 520,
      rows: [
        { t: 'FROM node:22-alpine', st: 'base' },
        { t: 'WORKDIR /app', st: 'hit' },
        { t: 'COPY . .', st: 'miss', tm: 'src đã đổi' },
        { t: 'RUN npm ci  (898 gói)', st: 'miss', tm: 'chạy lại' },
        { t: 'CMD ["node", …]', st: 'meta' },
      ], verdict: '138,6 s · 237,5 s · 110,7 s', vc: 'red' })}
    ${cacheStack({ title: '✅ chép file khai báo TRƯỚC', sub: 'cùng một lần sửa src/index.js', w: 520,
      rows: [
        { t: 'FROM node:22-alpine', st: 'base' },
        { t: 'WORKDIR /app', st: 'hit' },
        { t: 'COPY package*.json ./', st: 'hit', tm: 'không đổi' },
        { t: 'RUN npm ci  (898 gói)', st: 'hit', tm: '0 giây' },
        { t: 'COPY src ./src', st: 'miss', tm: 'rẻ: ~0,2 s' },
      ], verdict: '3,6 s · 4,8 s · 5,4 s', vc: 'grn' })}
    </div>
    <p style="text-align:center;font-size:15px;color:${D.mu};margin-top:4px">Ba lần đo liên tiếp mỗi bên — máy Mac, backend thật 898 gói, builder mặc định. Không thêm cờ nào: chỉ đổi thứ tự.</p>` },

  { t: 'Đo thật: tỉ lệ giữ nguyên, con số tuyệt đối lớn theo dự án', body: two(
    bars([
      { l: 'Backend thật · COPY . . trước', sub: 'trung vị 3 lần', v: 138.6, txt: '138,6 s', c: 'red' },
      { l: 'Backend thật · manifest trước', sub: 'trung vị 3 lần', v: 4.8, txt: '4,8 s', c: 'grn' },
      { l: 'Đồ chơi 3 thư viện · chậm', sub: 'trung vị 5 lần', v: 6.3, txt: '6,3 s', c: 'red' },
      { l: 'Đồ chơi 3 thư viện · nhanh', sub: 'trung vị 5 lần', v: 1.8, txt: '1,8 s', c: 'grn' },
    ], { lw: 290, max: 145 }),
    `${kpis([{ v: '29×', l: 'backend thật', c: 'grn' }, { v: '3,5×', l: 'dự án đồ chơi', c: 'amb' }])}
    ${box('info', 'Lượt dựng "nhanh" không bao giờ về 0: ~1 s là để hỏi Docker Hub digest mới của <code>node:22-alpine</code> và <code>docker/dockerfile:1</code>. Bỏ dòng <code># syntax</code> thì lượt ấm đo được 0,31 s.')}
    ${box('warn', 'npm ci đo được từ 29 s tới 150 s cho CÙNG lockfile — mạng và registry npm dao động. Luôn đo vài lần.')}`, 'l') },

  { t: 'Luật xếp: ít đổi ở dưới, hay đổi ở trên — mọi ngôn ngữ cùng một hình', body: two(
    layers({ w: 500, cap: 'đọc từ DƯỚI lên = thứ tự trong Dockerfile', rows: [
      { t: 'FROM · apk/apt add', k: 'THÁNG', c: 'tea' },
      { t: 'COPY package*.json · prisma/', k: 'TUẦN', c: 'dk' },
      { t: 'RUN npm ci · prisma generate', k: 'TUẦN', c: 'dk' },
      { t: 'COPY src ./src', k: 'GIỜ', c: 'amb' },
      { t: 'RUN npm run build · CMD', k: 'MỖI LẦN SỬA', c: 'red' },
    ] }),
    `${table(['Ngôn ngữ', 'Chép trước', 'Rồi cài'], [
      ['Node', '<code>package*.json</code>', '<code>npm ci</code>'],
      ['Python', '<code>requirements.txt</code>', '<code>pip install -r …</code>'],
      ['Go', '<code>go.mod go.sum</code>', '<code>go mod download</code>'],
      ['Java/Maven', '<code>pom.xml</code>', '<code>mvn dependency:go-offline</code>'],
      ['Monorepo npm', 'MỌI <code>packages/*/package.json</code>', '<code>npm ci</code> ở gốc'],
    ], { sm: true })}
    ${box('tip', 'Prisma: <code>COPY prisma ./prisma</code> + <code>prisma generate</code> thuộc nhóm THƯ VIỆN — schema đổi ít hơn mã hẳn.')}`, 'r') },

  { t: 'Gộp RUN hay tách? Gộp theo TẦN SUẤT ĐỔI, không phải "càng ít tầng càng tốt"', body: `
    ${vs({
      no: { t: 'A · gộp một RUN: ảnh nhỏ, cache thô', items: ['<code>apk add python3 make g++ &amp;&amp; npm ci &amp;&amp; apk del …</code>', 'Thêm 1 thư viện ⇒ cài lại luôn cả trình biên dịch', 'Hợp cho stage CUỐI, nơi kích thước là tiền'] },
      yes: { t: 'B · tách RUN: cache mịn, ảnh nặng hơn', items: ['<code>RUN apk add --virtual .build python3 make g++</code>', '<code>RUN npm ci</code> — MISS riêng khi đổi thư viện', 'Hợp cho stage DỰNG, nơi kích thước không quan trọng'] },
    })}
    ${box('good', '<b>Dựng nhiều tầng (Chương 6) xoá cuộc đánh đổi:</b> tách RUN thoải mái ở stage dựng, rồi chỉ <code>COPY --from</code> kết quả sang một stage cuối sạch. Tối ưu cache và multi-stage luôn đi cùng nhau.')}` },

  /* ───────────── 5.3 ───────────── */
  { t: 'Tầng cache: được ăn cả ngã về không — cache mount: MISS vẫn rẻ', body: mountVsLayer() },

  { t: 'Thêm MỘT thư viện: không mount 63 s — có cache mount 9 s', body: two(
    bars([
      { l: 'Nguội · không mount', sub: 'builder mới tinh', v: 81.4, txt: '81,4 s', c: 'dim' },
      { l: 'Nguội · có mount', sub: 'lần đầu lấp đầy mount', v: 103.6, txt: '103,6 s', c: 'dim' },
      { l: 'Thêm is-odd · không mount', sub: 'tải lại 898 gói', v: 63.4, txt: '63,4 s', c: 'red' },
      { l: 'Thêm is-odd · có mount', sub: 'chỉ tải gói mới', v: 9.3, txt: '9,3 s', c: 'grn' },
      { l: 'Thêm is-even · không mount', sub: '', v: 56.9, txt: '56,9 s', c: 'red' },
      { l: 'Thêm is-even · có mount', sub: '', v: 10.3, txt: '10,3 s', c: 'grn' },
    ], { lw: 290, max: 110 }),
    `${yaml([
      ['# syntax=docker/dockerfile:1', ''],
      ['FROM node:22-alpine', ''],
      ['WORKDIR /app', ''],
      ['COPY package*.json ./', ''],
      ['RUN --mount=type=cache,target=/root/.npm \\', 'kho gói tar của npm'],
      ['    npm ci --omit=dev', 'KHÔNG phải node_modules'],
    ], { lang: 'docker', fs: 14.5 })}
    ${box('info', 'Đo thật trên máy Mac, builder riêng <code>dk05-builder</code>, backend 898 gói. Lượt nguội có mount chậm hơn chút vì còn phải ghi đầy 165 MB vào mount.')}`, 'l') },

  { t: 'Gắn đúng THƯ MỤC TẢI VỀ của từng trình quản lý gói', body: `
    ${table(['Hệ sinh thái', 'target=', 'Ghi chú'], [
      ['npm', '<code>/root/.npm</code>', 'không bao giờ <code>node_modules</code>'],
      ['pnpm', '<code>/pnpm/store</code>', 'kho theo nội dung'],
      ['yarn berry', '<code>/root/.yarn/berry/cache</code>', ''],
      ['pip', '<code>/root/.cache/pip</code>', ''],
      ['Go', '<code>/go/pkg/mod</code> + <code>/root/.cache/go-build</code>', 'cái thứ hai (bộ đệm biên dịch) lời nhất'],
      ['Maven / Gradle', '<code>/root/.m2</code> · <code>/root/.gradle</code>', ''],
      ['apk (Alpine)', '<code>/var/cache/apk</code>', 'lời ít — gói apk vốn nhỏ'],
    ], { sm: true })}
    ${box('bad', '<code>--mount=type=cache,target=/app/node_modules</code> ⇒ ảnh cuối KHÔNG có thư viện nào: mount được gỡ khi bước kết thúc, không gì trong nó thành tầng.')}` },

  { t: 'apt cần gỡ docker-clean, và khoá sharing=locked', body: two(
    yaml([
      ['FROM debian:bookworm-slim', ''],
      ['RUN rm -f /etc/apt/apt.conf.d/docker-clean \\', 'file này XOÁ .deb ngay'],
      [' && echo \'Binary::apt::APT::Keep-Downloaded-Packages "true";\' \\', 'giữ .deb lại'],
      ['    > /etc/apt/apt.conf.d/keep-cache', ''],
      ['RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \\', 'gói .deb'],
      ['    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \\', 'danh mục'],
      ['    apt-get update && apt-get install -y curl', 'KHÔNG rm lists'],
    ], { lang: 'docker', fs: 13.5 }),
    table(['sharing=', 'Nghĩa', 'Dùng cho'], [
      ['<code>shared</code> (mặc định)', 'nhiều lượt dựng dùng cùng lúc', 'npm, pip, Go, Cargo'],
      ['<code>locked</code>', 'mỗi lúc một lượt, lượt kia CHỜ', 'apt, dnf — thứ có khoá/CSDL'],
      ['<code>private</code>', 'mỗi lượt song song một bản riêng', 'hiếm'],
      ['<code>id=…</code>', 'mặc định = đường dẫn đích', 'tách cache hai dự án'],
    ], { sm: true }), 'l') },

  { t: 'Hai cú hỏng im lặng: kết quả dựng biến mất, và Permission denied', body: two(
    term(['# RUN --mount=type=cache,target=/app/dist \\', '#     sh -c \'echo built > /app/dist/index.js && ls /app/dist\'', '# RUN ls -la /app/dist', '#8 [stage-0 3/4] RUN --mount=type=cache,target=/app/dist …', '= #8 0.039 index.js', '#9 [stage-0 4/4] RUN ls -la /app/dist', '! #9 0.038 ls: /app/dist: No such file or directory'], { title: 'output thật — ghi dist/ vào cache mount' }),
    `${term(['# USER node rồi mount /home/node/.npm, KHÔNG uid:', '! touch: /home/node/.npm/x: Permission denied', '! ERROR: failed to build: … exit code: 1', '# thêm ,uid=1000,gid=1000 vào --mount:', '= #9 0.044 ok'], { title: 'output thật — bước chạy bằng USER node' })}
    ${box('warn', 'Mount mới tạo thuộc root. Bước chạy bằng <code>USER node</code> phải khai <code>uid=1000,gid=1000</code> — đây là lý do số 1 khiến cache mount "chẳng làm gì".')}`, 'l') },

  { t: 'Cache mount phình mãi: xem bằng buildx du, chặn trần bằng GC', body: two(
    term(['$ docker buildx du --builder dk05-builder \\', '    --filter type=exec.cachemount', 'ID                           RECLAIMABLE   SIZE      LAST ACCESSED', 'wqn0dcd5booh54o9rmt5ssf7n*   true          165.5MB   3 hours ago', '$ docker buildx du --builder dk05-builder --verbose \\', '    | grep cachemount -B8 | grep Description', 'Description:  cached mount /root/.npm from exec /bin/sh -c', '              npm ci … with id "//root/.npm"', '$ docker system df --format \'table {{.Type}}\\t{{.Size}}…\'', '! Build Cache     33.71GB   18.24GB'], { title: 'output thật — máy Mac' }),
    `${kpis([{ v: '33,7 GB', l: 'cache dựng trên máy Mac của khoá', c: 'red' }, { v: '165 MB', l: 'một cache mount npm', c: 'vio' }])}
    ${box('tip', 'Cache mount không thuộc ảnh nào ⇒ <code>docker image prune</code> không đụng tới. Đặt trần GC của BuildKit trong <code>daemon.json</code>, hoặc dùng builder riêng rồi <code>docker buildx rm</code> nó.')}
    ${box('bad', 'Đừng <code>docker builder prune</code> bừa trên máy dùng chung: nó xoá cache của MỌI dự án.')}`, 'l') },

  /* ───────────── 5.4 ───────────── */
  { t: 'Máy CI mới tinh có cache RỖNG — phải cất cache ra ngoài máy', body: `
    ${ciFlow()}
    ${box('info', '<code>--cache-to</code> ghi cache ra một kho sau lượt dựng; <code>--cache-from</code> đọc nó trước lượt dựng. Không có kho đó thì mọi mẹo ở 5.1–5.3 vô dụng trong CI.')}` },

  { t: 'mode=min chỉ xuất tầng của ẢNH CUỐI — stage dựng đắt tiền bị bỏ', body: two(
    `<div style="display:flex;gap:18px;justify-content:center">
    ${layers({ w: 270, cap: '<b>mode=min</b> (mặc định) · 58 MB', rows: [
      { t: '[build] npm ci', c: 'red', k: 'KHÔNG' }, { t: '[build] COPY src', c: 'red', k: 'KHÔNG' }, { t: 'ảnh cuối: COPY --from', c: 'grn', k: 'CÓ' }] })}
    ${layers({ w: 270, cap: '<b>mode=max</b> · 332 MB', rows: [
      { t: '[build] npm ci', c: 'grn', k: 'CÓ' }, { t: '[build] COPY src', c: 'grn', k: 'CÓ' }, { t: 'ảnh cuối: COPY --from', c: 'grn', k: 'CÓ' }] })}
    </div>`,
    `${term(['# builder MỚI TINH, --cache-from, sau khi sửa src:', '# ── mode=min', '#11 [build 4/6] RUN npm ci --omit=dev --ignore-scripts', '! #11 DONE 30.7s', '# ── mode=max', '#11 [build 4/6] RUN npm ci --omit=dev --ignore-scripts', '= #11 CACHED'], { title: 'output thật — Dockerfile 2 stage, backend thật' })}
    ${kpis([{ v: '38,9 s', l: 'mode=min', c: 'red' }, { v: '19,8 s', l: 'mode=max', c: 'grn' }])}`, 'r') },

  { t: 'Bốn kho cache — chọn theo nơi CI của bạn chạy', body: `
    ${table(['Backend', 'Cache nằm ở', 'Hợp khi', 'Lưu ý'], [
      ['<code>type=gha</code>', 'dịch vụ cache GitHub Actions', 'Dùng Actions, một kho', '10 GB/kho (hơn thì tính tiền), xoá sau 7 ngày không dùng'],
      ['<code>type=registry</code>', 'một tag riêng <code>:buildcache</code>', 'Nhiều hệ CI, cả laptop', 'Tag riêng — đừng trỏ vào <code>:latest</code>'],
      ['<code>type=local</code>', 'một thư mục trên đĩa', 'Máy CI tự dựng có đĩa bền', 'Tự dọn, không thì phình'],
      ['<code>type=inline</code>', 'nhúng trong chính ảnh', 'Ảnh một stage, lười cấu hình', '!Chỉ có mode=min'],
    ], { sm: true })}
    ${box('good', '<b>Docker 29 + kho ảnh containerd:</b> builder mặc định (driver <code>docker</code>) XUẤT được cache <code>local/registry/gha/inline</code> — đã thử <code>--cache-to type=local</code> trên máy Mac: <code>exporting cache to client directory … done</code>. Engine cũ dùng overlay2 thì không, phải tạo builder <code>docker-container</code>.')}` },

  { t: 'Một workflow GitHub Actions đủ dùng (phiên bản action tính đến 09/2026)', body: yaml([
    ['jobs:', ''],
    ['  docker:', ''],
    ['    runs-on: ubuntu-latest', ''],
    ['    permissions: { contents: read, packages: write }', 'đẩy GHCR bằng GITHUB_TOKEN'],
    ['    steps:', ''],
    ['      - uses: actions/checkout@v7', ''],
    ['      - uses: docker/setup-buildx-action@v4', 'tạo builder docker-container'],
    ['      - uses: docker/login-action@v4', 'registry: ghcr.io'],
    ['      - uses: docker/metadata-action@v6', 'id: meta → tag sha/nhánh/semver'],
    ['      - uses: docker/build-push-action@v7', ''],
    ['        with:', ''],
    ['          push: ${{ github.event_name != \'pull_request\' }}', 'PR chỉ dựng, không đẩy'],
    ['          tags: ${{ steps.meta.outputs.tags }}', ''],
    ['          cache-from: type=gha', 'đọc: nhánh này → nhánh gốc'],
    ['          cache-to: type=gha,mode=max', 'ghi MỌI stage'],
  ], { fs: 14.5 }) },

  { t: 'Phép thử trung thực: xoá builder, tạo cái mới, xem còn CACHED không', body: two(
    term(['$ docker buildx create --name ci1 --driver docker-container', '$ docker buildx build --builder ci1 \\', '    --cache-to type=local,dest=./bc,mode=max …', '+ 69.92s   (nguội + xuất 331 MB)', '$ docker buildx rm ci1', '$ docker buildx build --builder ci2 …  # builder mới ci2', '! 57.95s   (máy mới, không có cache — để so)', '$ docker buildx rm ci2 && docker buildx create --name ci3 …', '$ docker buildx build --builder ci3 \\', '    --cache-from type=local,src=./bc …', '= 17.82s   — 5 dòng CACHED, có "importing cache manifest"'], { title: 'output thật — máy Mac, backend 898 gói' }),
    `${bars([
      { l: 'Máy mới, không cache', v: 57.95, txt: '58,0 s', c: 'red' },
      { l: 'Máy mới + --cache-from', v: 17.82, txt: '17,8 s', c: 'grn' },
    ], { lw: 200, max: 60 })}
    ${box('info', 'Builder mới KHÔNG có cache cục bộ ⇒ mọi dòng CACHED chỉ có thể đến từ cache đã xuất — đúng thứ máy CI trải qua. Còn 17,8 s là thời gian KÉO tầng từ kho cache về.')}
    ${box('warn', 'Cache mount (5.3) KHÔNG đi theo <code>--cache-to</code>: trong CI, MISS tầng cài vẫn tải lại toàn bộ gói.')}`, 'l') },

  /* ───────────── 5.5 ───────────── */
  { t: 'Ba phép đo trước khi kết luận: nguội · ấm · sau-một-lần-sửa', body: `
    ${table(['Nguội', 'Ấm', 'Sau khi sửa', 'Chẩn đoán', 'Đi tới'], [
      ['+chậm', '+&lt; 2 s', '+nhanh', 'Khoẻ. Nguội chỉ đáng lo trong CI', 'Bài 5.4'],
      ['chậm', '-chậm', '-chậm', 'Có gì phá cache dù không đổi gì: ARG, file sinh ra, <code>--pull</code>/<code>--no-cache</code> sót trong script', 'Bài 5.1'],
      ['chậm', '+nhanh', '-chậm', 'THỨ TỰ: mã được chép trước bước cài — hay gặp nhất', 'Bài 5.2'],
      ['-rất chậm', '-chậm', '-chậm', 'Ngoài cache: ngữ cảnh khổng lồ, giả lập kiến trúc, bước thật sự chậm', 'slide sau'],
    ], { sm: true })}
    ${term(['# backend thật, Dockerfile "nhanh", máy Mac — ba con số của một dự án khoẻ:', '$ time docker build --no-cache -q -t app:m .   → 117.87s', '$ time docker build -q -t app:m .              → ~1.3s', '$ echo \'// x\' >> src/index.js && time docker build -q -t app:m .   → 3.57s'], { title: 'output thật — đã rút gọn chỉ còn thời gian thực (real)' })}` },

  { t: 'Sắp dòng DONE theo giây: thường MỘT bước là cả vấn đề', body: two(
    term(['$ docker build --no-cache --progress=plain -f Dockerfile.ms \\', '    -t app:m . > build.log 2>&1', '$ grep -E \'^#[0-9]+ (DONE|CACHED)\' build.log \\', '    | sort -t\' \' -k3 -hr | head -6', '! #10 DONE 29.2s', '#2 DONE 1.2s', '#4 DONE 1.1s', '#11 DONE 0.2s', '#14 DONE 0.1s', '#12 DONE 0.1s', '$ grep -E \'^#10 \\[\' build.log', '+ #10 [build 4/6] RUN npm ci --omit=dev --ignore-scripts'], { title: 'output thật — máy Mac, Dockerfile 2 stage' }),
    `${bars([
      { l: '#10 RUN npm ci', v: 29.2, txt: '29,2 s', c: 'red' },
      { l: '#2 tải frontend dockerfile:1', v: 1.2, txt: '1,2 s', c: 'dim' },
      { l: '#4 hỏi metadata node:22-alpine', v: 1.1, txt: '1,1 s', c: 'dim' },
      { l: 'mọi bước còn lại', v: 0.5, txt: '≤ 0,2 s', c: 'dim' },
    ], { lw: 250, max: 30 })}
    ${box('tip', '<b>Đo rồi mới sửa.</b> Gộp mấy lệnh RUN trông "kém" không nhanh thêm giây nào — thời gian nằm hết ở <code>npm ci</code>.')}`, 'l') },

  { t: 'Bảy nguyên nhân dựng chậm — mỗi cái có một DẤU HIỆU riêng', body: table(['#', 'Nguyên nhân', 'Dấu hiệu nhìn thấy', 'Chữa'], [
    ['1', 'Ngữ cảnh khổng lồ', '<code>transferring context: 515.15MB 7.7s</code>', '<code>.dockerignore</code> (Bài 4.1)'],
    ['2', '<code>COPY . .</code> trên bước cài', 'ấm nhanh, sửa mã thì chậm', 'chép manifest trước (5.2)'],
    ['3', 'Không cache mount', 'thêm 1 thư viện = tải lại tất cả', '<code>--mount=type=cache</code> (5.3)'],
    ['4', 'ARG / file đổi mỗi lượt', 'ấm mà vẫn chậm', 'dời xuống cuối / bỏ khỏi ngữ cảnh'],
    ['5', 'Giả lập kiến trúc', 'chậm 5–20× so với máy khác', 'dựng native, biên dịch chéo (3.4)'],
    ['6', '<code>--pull</code>/<code>--no-cache</code> trong script', 'mọi lượt đều nguội', 'chỉ để cho lượt dựng theo lịch'],
    ['7', 'Bước thật sự chậm', 'một dòng DONE áp đảo', 'việc của ứng dụng + cache mount cho nó'],
  ], { sm: true }) },

  { t: 'Hai thủ phạm ngoài cache: ngữ cảnh 515 MB và giả lập amd64', body: two(
    term(['# COPY . . và KHÔNG có .dockerignore (node_modules 590 MB):', '! #8 transferring context: 515.15MB 7.7s done', '# thêm node_modules và .git vào .dockerignore:', '= #7 transferring context: 212B 0.5s done', '# builder cũ gửi phần CHÊNH LỆCH ở lần sau (3.03MB 1.1s)', '# — máy CI mới tinh thì lần nào cũng gửi TRỌN'], { title: 'output thật — máy Mac, builder mới' }),
    `${term(['# RUN node -e "…2e8 vòng lặp…"  (--no-cache)', '$ docker build --platform linux/arm64 …', '= #5 DONE 0.4s', '$ docker build --platform linux/amd64 …', '! #5 DONE 3.8s'], { title: 'output thật — Mac M1 Max (arm64)' })}
    ${kpis([{ v: '9,5×', l: 'chậm hơn khi giả lập amd64', c: 'red' }])}
    ${box('info', 'Kiểm: <code>docker version --format \'{{.Server.Arch}}\'</code> → <code>arm64</code>. Dựng ảnh amd64 cho VPS trên Mac là đang giả lập.')}`, 'l') },

  { t: 'docker build --check bắt lỗi mà KHÔNG dựng — và stage độc lập chạy song song', body: two(
    term(['$ docker build --check -t app .', 'Check complete, 4 warnings have been found!', '! WARNING: FromAsCasing', '! WARNING: LegacyKeyValueFormat', '  "ENV key=value" should be used instead of …', '! WARNING: CopyIgnoredFile', '  Attempting to Copy file "secrets.txt" that is', '  excluded by .dockerignore', '! WARNING: JSONArgsRecommended', '$ echo $?', '+ 1              # CI tự đỏ khi có cảnh báo', '# gõ sai --from=biuld ⇒ … (did you mean build?)'], { title: 'output thật — máy Mac, Engine 29.8 (đã rút gọn)' }),
    `${diagram({ w: 520, h: 250, nodes: [
      { id: 'a', x: 0, y: 10, w: 230, h: 64, t: 'stage a', d: 'RUN sleep 3', c: 'tea' },
      { id: 'b', x: 290, y: 10, w: 230, h: 64, t: 'stage b', d: 'RUN sleep 3', c: 'vio' },
      { id: 'f', x: 130, y: 170, w: 260, h: 70, t: 'stage cuối', d: 'COPY --from=a · --from=b', c: 'grn' },
    ], edges: [{ from: 'a', to: 'f', c: 'tea' }, { from: 'b', to: 'f', c: 'vio' }] })}
    ${kpis([{ v: '3,61 s', l: 'tổng — không phải 6 s', c: 'grn' }])}
    ${box('tip', 'BuildKit dựng một ĐỒ THỊ: stage không phụ thuộc nhau chạy cùng lúc (đo thật, máy Mac).')}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 5', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Sửa README mà npm ci chạy lại', '<code>COPY . .</code> đứng trên bước cài', 'Chép <code>package*.json</code> → cài → rồi mới chép mã'],
    ['<code>apt-get install</code> 404 dù mạng ổn', '<code>apt-get update</code> riêng một RUN, bị lưu đệm', 'update + install trong CÙNG một RUN'],
    ['Lượt ấm vẫn chạy lại npm ci', '<code>ARG BUILD_DATE</code> khai ở đầu file', 'Dời ARG xuống ngay trên dòng dùng nó'],
    ['Ảnh không có <code>dist/</code>, container thoát ngay', 'Ghi kết quả dựng vào cache mount', 'Cache mount chỉ cho bộ đệm tải về'],
    ['Cache mount "chẳng làm gì"', '<code>USER node</code> + mount thuộc root', 'Thêm <code>uid=1000,gid=1000</code>'],
    ['CI lần nào cũng nguội dù có <code>--cache-to</code>', 'mode=min với Dockerfile nhiều stage', '<code>mode=max</code>; kiểm dòng <code>exporting cache</code>'],
    ['Đĩa đầy dần vì cache dựng', 'Cache mount + tầng cũ không ai dọn', 'Trần GC / builder riêng rồi <code>buildx rm</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 5', body: table(['Muốn…', 'Gõ'], [
    ['Xem bước nào CACHED, bước nào chạy', '<code>docker build --progress=plain -t app . 2&gt;&amp;1 | grep -E \'^#[0-9]+ (\\[|CACHED|DONE)\'</code>'],
    ['Đo thời gian dựng nguội thật', '<code>time docker build --no-cache -q -t app .</code>'],
    ['Bước nào tốn thời gian nhất', '<code>… | grep -E \'^#[0-9]+ DONE\' | sort -t\' \' -k3 -hr | head</code>'],
    ['Soát lỗi Dockerfile, không dựng', '<code>docker build --check .</code>'],
    ['Cache mount cho npm', '<code>RUN --mount=type=cache,target=/root/.npm npm ci</code>'],
    ['Xuất / nhập cache', '<code>--cache-to type=local,dest=./bc,mode=max</code> · <code>--cache-from type=local,src=./bc</code>'],
    ['Builder riêng cho thử nghiệm', '<code>docker buildx create --name thu --driver docker-container</code> … <code>docker buildx rm thu</code>'],
    ['Cache đang chiếm bao nhiêu', '<code>docker buildx du</code> · <code>docker system df</code>'],
    ['Dựng lại riêng một stage', '<code>--no-cache-filter build</code> · dừng ở một stage: <code>--target build</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 5 (45 phút)', body: `
    ${steps([
      ['Dựng Dockerfile "chậm" (<code>COPY . .</code> trước <code>npm ci</code>), sửa 1 dòng mã, ĐO ba lần', 'ghi lại số giây và đếm dòng CACHED'],
      ['Đổi thứ tự sang "nhanh", đo lại với cùng lần sửa', 'vẽ chồng tầng HIT/MISS của cả hai bản'],
      ['Thêm một thư viện: đo có và không có cache mount <code>/root/.npm</code>', 'trên builder riêng <code>thu-cache</code>'],
      ['Giả lập máy CI: xuất cache <code>mode=max</code>, xoá builder, tạo builder mới, nhập cache', 'đạt: có dòng CACHED ở bước npm ci'],
      ['Chạy <code>docker build --check</code> trên Dockerfile đồ án nhóm, sửa hết cảnh báo', 'đạt: <code>echo $?</code> in 0'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bạn có bảng số đo của riêng máy mình cho 4 phép thử, giải thích được từng số bằng luật khoá cache, và <code>docker buildx ls</code> không còn builder <code>thu-*</code> nào.')}` },
]);
