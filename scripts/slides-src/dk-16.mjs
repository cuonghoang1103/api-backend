/**
 * Docker · Deck dk-16 — Chương 16: Dự án cuối khoá — đóng gói và đưa "Đặt lịch phòng khám" lên production.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 24/09/2026 trên một bản thu nhỏ của app dựng trong thư mục
 * scratch (Next.js 16.3.6 + Express 5 / Prisma 6.19.3 + Postgres 16.4 + Redis 7.4 + nginx 1.27):
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0, arm64, Compose v5.5.1
 *   • "máy Linux" = Fedora 44, Docker Engine 29.6.2, amd64 (thí nghiệm bind mount + mv)
 * Tên thật trong lúc đo mang tiền tố dk16- (luật an toàn của khoá); registry "GHCR" trong phần diễn tập là
 * registry:2 cục bộ ở localhost:18165 — workflow GitHub Actions viết đầy đủ nhưng KHÔNG chạy lên GitHub.
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, list, mindmap, diagram, yaml, bars, code, term as dkTerm, sv, R, T, A } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });

export const deck = { key: 'dk-16', code: 'DOCKER · CHƯƠNG 16', title: 'Dự án cuối khoá', sub: 'Docker · Chương 16' };

/* Slide 3 — kiến trúc app: hai mạng, một cửa vào */
const archPic = () => sv(1160, 440,
  // vùng mạng
  R(200, 20, 470, 410, { c: 'tea', dash: true, fill: 'rgba(45,212,191,.04)' }) + T(220, 48, 'mạng front', { fs: 16, c: 'tea', b: true }) +
  R(610, 160, 540, 270, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.05)' }) + T(1130, 150, 'mạng back · internal: true', { fs: 16, c: 'vio', b: true, a: 'end' }) +
  // trình duyệt
  R(0, 195, 160, 80, { c: 'dim' }) + T(80, 230, 'Trình duyệt', { fs: 17, a: 'middle', b: true }) + T(80, 254, 'bệnh nhân', { fs: 14, a: 'middle', c: 'mu' }) +
  A(160, 235, 226, 235, { c: 'amb' }) + T(193, 220, ':80', { fs: 14, a: 'middle', c: 'amb', mono: true }) +
  // nginx
  R(230, 190, 150, 90, { c: 'grn' }) + T(305, 225, 'nginx', { fs: 19, a: 'middle', b: true }) + T(305, 250, 'cửa DUY NHẤT', { fs: 14, a: 'middle', c: 'grn' }) + T(305, 270, 'có ports:', { fs: 13.5, a: 'middle', c: 'mu' }) +
  // web
  R(420, 60, 230, 80, { c: 'dk' }) + T(535, 94, 'web · Next.js', { fs: 17, a: 'middle', b: true }) + T(535, 118, 'standalone · 328 MB', { fs: 14, a: 'middle', c: 'mu' }) +
  // api
  R(420, 300, 230, 90, { c: 'amb' }) + T(535, 334, 'api · Express', { fs: 17, a: 'middle', b: true }) + T(535, 358, 'Prisma · 664 MB', { fs: 14, a: 'middle', c: 'mu' }) + T(535, 378, 'ở CẢ HAI mạng', { fs: 13.5, a: 'middle', c: 'amb' }) +
  A(380, 212, 418, 130, { c: 'grn' }) + T(388, 160, '/', { fs: 15, c: 'grn', mono: true, b: true }) +
  A(380, 258, 418, 320, { c: 'grn' }) + T(392, 306, '/api/', { fs: 15, c: 'grn', mono: true, b: true, a: 'end' }) +
  A(535, 140, 535, 298, { c: 'dk', dash: true }) + T(525, 226, 'http://api:3000', { fs: 13.5, c: 'dk', mono: true, a: 'end' }) +
  // back
  R(800, 175, 320, 62, { c: 'dim', dash: true }) + T(960, 202, 'migrate — chạy 1 lần', { fs: 16, a: 'middle', b: true }) + T(960, 225, 'prisma migrate deploy', { fs: 13.5, a: 'middle', mono: true, c: 'mu' }) +
  R(800, 262, 320, 66, { c: 'blu' }) + T(960, 290, 'db · postgres:16.4-alpine', { fs: 16, a: 'middle', b: true }) + T(960, 314, 'volume pgdata', { fs: 13.5, a: 'middle', mono: true, c: 'vio' }) +
  R(800, 350, 320, 66, { c: 'red' }) + T(960, 378, 'cache · redis:7.4-alpine', { fs: 16, a: 'middle', b: true }) + T(960, 402, 'volume redisdata', { fs: 13.5, a: 'middle', mono: true, c: 'vio' }) +
  A(650, 325, 798, 298, { c: 'amb' }) + A(650, 370, 798, 380, { c: 'amb' }) + A(960, 237, 960, 260, { c: 'mu', dash: true }) +
  T(1140, 60, 'web KHÔNG ở mạng back:', { fs: 14, c: 'mu', a: 'end' }) + T(1140, 82, 'không gọi thẳng được db', { fs: 14, c: 'mu', a: 'end' }));

/* Slide 22 — bind mount một file: container giữ inode */
const inodePic = () => sv(600, 340,
  T(125, 24, 'MÁY CHỦ (đường dẫn)', { fs: 15, c: 'tea', b: true, a: 'middle' }) + T(475, 24, 'CONTAINER', { fs: 15, c: 'dk', b: true, a: 'middle' }) +
  R(10, 40, 230, 56, { c: 'tea' }) + T(125, 74, 'default.conf', { fs: 16, a: 'middle', mono: true }) +
  R(360, 40, 230, 56, { c: 'dk' }) + T(475, 74, '/etc/nginx/conf.d/…', { fs: 14, a: 'middle', mono: true }) +
  R(10, 180, 230, 64, { c: 'grn', fill: 'rgba(63,185,80,.08)' }) + T(125, 208, 'inode 5516765', { fs: 16, a: 'middle', mono: true, b: true }) + T(125, 232, 'phien-ban-2 (MỚI)', { fs: 14, a: 'middle', c: 'mu' }) +
  R(360, 180, 230, 64, { c: 'red', fill: 'rgba(255,92,108,.08)' }) + T(475, 208, 'inode 5516764', { fs: 16, a: 'middle', mono: true, b: true }) + T(475, 232, 'phien-ban-1 (CŨ)', { fs: 14, a: 'middle', c: 'mu' }) +
  A(125, 96, 125, 176, { c: 'grn' }) + T(135, 142, 'sau mv', { fs: 14, c: 'grn' }) +
  A(475, 96, 475, 176, { c: 'red' }) + T(485, 142, 'vẫn giữ', { fs: 14, c: 'red' }) +
  A(240, 90, 356, 196, { c: 'mu', dash: true }) + T(258, 84, 'trước mv', { fs: 13.5, c: 'mu' }) +
  T(300, 284, 'mv = ghi file MỚI rồi đổi tên ⇒ đường dẫn trỏ inode mới,', { fs: 14.5, c: 'amb', a: 'middle' }) +
  T(300, 308, 'còn container đã gắn theo inode lúc nó khởi động.', { fs: 14.5, c: 'amb', a: 'middle' }) +
  T(300, 332, 'docker restart mới gắn lại theo đường dẫn.', { fs: 14.5, c: 'amb', a: 'middle' }));

export const slides = S([
  cover({ t: 'Chương 16 — Dự án cuối khoá', sub: 'Đóng gói “Đặt lịch phòng khám” · Compose dev &amp; prod · CI → GHCR → VPS · tuần đầu trên production', chap: 'CHƯƠNG 16' }),

  { t: 'Bản đồ chương: một app thật, từ laptop tới production', body: mindmap('Đặt lịch phòng khám', 'Next.js · Express/Prisma · Postgres · Redis · nginx', [
    { t: '16.1 Đóng gói', d: '.dockerignore · multi-stage · đúng libc · không root · healthcheck', c: 'dk' },
    { t: '16.2 Compose dev &amp; prod', d: 'watch, Mailpit · restart, RAM, xoay log, hai mạng, migrate', c: 'tea' },
    { t: '16.3 CI → GHCR → VPS', d: 'tag theo commit · đa nền tảng · pull + up --wait + smoke', c: 'amb' },
    { t: '16.4 Tuần đầu', d: 'sao lưu/khôi phục · 8 sự cố kinh điển', c: 'red' },
    { t: '16.5 Bài thi cuối khoá', d: '20 câu tình huống, Mục 0 → Chương 16', c: 'vio' },
  ]) },

  /* ───────────── 16.1 ───────────── */
  { t: 'Sáu dịch vụ, hai mạng, đúng MỘT cổng mở ra ngoài', body: `${archPic()}
    ${box('info', 'Bản thu nhỏ dựng thật cho chương này: mã tối giản nhưng chạy được — đặt lịch, chống trùng giờ (409), cache Redis 30 giây, gửi thư xác nhận. Mọi con số trong chương đo trên chính nó.')}` },

  { t: 'Ngày 0: Dockerfile “cho chạy được” nặng 2,2 GB', body: two(
    `${yaml([
      ['FROM node:22.23-bookworm', 'ảnh nền ĐẦY ĐỦ: 1,63 GB'],
      ['WORKDIR /app', ''],
      ['COPY . .', 'chở CẢ node_modules của Mac'],
      ['RUN npm install', '“up to date” — không cài lại'],
      ['RUN npm run build', 'tsc, next build'],
      ['EXPOSE 3000', ''],
      ['CMD ["npm", "start"]', 'npm làm PID 1'],
    ], { fs: 17, lang: 'docker' })}
    ${box('bad', 'Không có <code>.dockerignore</code>: <code>transferring context: 346.98MB</code> cho một API mà phần thật sự cần gửi chỉ 60 kB.')}`,
    `${kpis([{ v: '347 MB', l: 'ngữ cảnh gửi đi (api)', c: 'red' }, { v: '2,2 GB', l: 'ảnh api', c: 'red' }, { v: '2,63 GB', l: 'ảnh web', c: 'red' }])}
    ${box('warn', 'Build XANH cả hai. Cái giá chưa hiện ra: mỗi lần deploy VPS kéo về 542 MB (api) + 685 MB (web) dữ liệu nén, và api thì… không chạy (slide sau).')}`, 'l') },

  { t: 'Quên .dockerignore: engine Prisma của Mac lọt vào container', body: `${term([
    '$ docker build -f Dockerfile.ngay0 -t api:ngay0 ./api',
    '#4 transferring context: 346.98MB 3.7s done',
    '#8 4.277 up to date, audited 126 packages in 4s',
    '$ docker run --rm --network thu -e DATABASE_URL=… api:ngay0',
    '! PrismaClientInitializationError: Prisma Client could not locate the Query Engine',
    '! for runtime "linux-arm64-openssl-3.0.x".',
    '! This happened because Prisma Client was generated for "darwin-arm64",',
    '! but the actual deployment required "linux-arm64-openssl-3.0.x".',
    'The following locations have been searched:',
    '  /app/node_modules/.prisma/client',
    '  /private/tmp/…/phongkham/api/node_modules/@prisma/client',
  ], { title: 'output thật — máy Mac', fs: 14.5 })}
    ${two(box('info', '<code>COPY . .</code> chở <code>node_modules</code> đã sinh cho macOS vào ảnh; <code>npm install</code> thấy đủ gói nên không cài lại. Lỗi còn khai cả đường dẫn trên máy bạn.'),
    box('good', 'Thêm <code>.dockerignore</code> (<code>node_modules</code>, <code>dist</code>, <code>.env*</code>…): ngữ cảnh <b>347 MB → 60 kB</b>, và gói được cài lại ĐÚNG hệ điều hành trong ảnh.'))}` },

  { t: 'Ba stage: cài → dựng → chỉ mang phần chạy đi', body: two(
    yaml([
      ['FROM node:22.23-alpine3.24 AS deps', 'CÙNG nền với runtime'],
      ['COPY package.json package-lock.json ./', 'đổi ít ⇒ cache lâu'],
      ['COPY prisma ./prisma', 'postinstall cần schema'],
      ['RUN --mount=type=cache,… npm ci', 'sinh engine musl'],
      ['FROM deps AS dev', 'target cho compose dev'],
      ['COPY src ./src', ''],
      ['RUN npm run build', 'tsc → dist/'],
      ['FROM dev AS build', ''],
      ['RUN npm prune --omit=dev', 'bỏ devDependencies'],
      ['FROM node:22.23-alpine3.24 AS runtime', 'ảnh ĐEM ĐI'],
      ['RUN apk add --no-cache tini', 'PID 1 chuyển tín hiệu'],
      ['COPY --from=build --chown=node:node …', 'node_modules, dist, prisma'],
      ['USER node', 'không chạy root'],
      ['HEALTHCHECK … wget -qO- …/health', '“khoẻ” = trả lời được'],
      ['ENTRYPOINT ["/sbin/tini", "--"]', ''],
      ['CMD ["node", "dist/index.js"]', 'dạng exec'],
    ], { fs: 14.5, lang: 'docker' }),
    `${steps([
      ['<code>deps</code> — chỉ package*.json + prisma', 'đổi mã nguồn không làm mất cache npm ci'],
      ['<code>dev</code> — có mã + tsc', 'compose dev dùng <code>target: dev</code>'],
      ['<code>build</code> — prune dev deps', 'không bao giờ được ship'],
      ['<code>runtime</code> — ảnh nền sạch + 4 thứ COPY', 'không có tsc, không có src'],
    ])}`, 'l') },

  { t: 'Engine Prisma đi theo nơi chạy prisma generate', body: `${table(['Nơi chạy <code>prisma generate</code>', 'Engine sinh ra', 'Chạy trên', 'Kết quả (đo thật)'], [
    ['Mac (node_modules chở vào ảnh)', '<code>darwin-arm64</code>', 'Debian arm64', '-crash lúc khởi động'],
    ['<code>node:22.23-bookworm-slim</code> (thiếu openssl)', '<code>linux-arm64-openssl-1.1.x</code>', 'Alpine (musl)', '-API 502, restart vòng lặp'],
    ['<code>node:22.23-alpine3.24</code> — stage deps', '<code>linux-musl-arm64-openssl-3.0.x</code>', 'Alpine (musl)', '+chạy, healthy'],
  ])}
  ${two(yaml([
    ['generator client {', ''],
    ['  provider      = "prisma-client-js"', ''],
    ['  binaryTargets = ["native",', 'nơi generate'],
    ['    "linux-musl-openssl-3.0.x",', 'VPS amd64'],
    ['    "linux-musl-arm64-openssl-3.0.x"]', 'Mac arm64'],
    ['}', ''],
  ], { fs: 15 }),
  box('tip', 'Luật đơn giản nhất: stage chạy <code>npm ci</code> và stage <code>runtime</code> dùng <b>CÙNG một ảnh nền</b>. <code>binaryTargets</code> chỉ là lưới đỡ (+17,5 MB/engine). Bookworm-slim không có openssl ⇒ Prisma đoán “1.1.x” mà build vẫn XANH.'), 'l')}` },

  { t: 'Trước và sau: nhỏ hơn 3–8 lần, không root, dừng trong 0,14 s', body: two(
    bars([
      { l: 'api — ngày 0', sub: 'bookworm, không ignore', v: 2200, txt: '2,2 GB', c: 'red' },
      { l: 'api — 3 stage', sub: 'alpine + Prisma CLI', v: 664, txt: '664 MB', c: 'grn' },
      { l: 'web — ngày 0', sub: 'bookworm, next start', v: 2630, txt: '2,63 GB', c: 'red' },
      { l: 'web — standalone', sub: 'server.js + .next/static', v: 328, txt: '328 MB', c: 'grn' },
    ], { lw: 250 }),
    `${term([
      '$ docker exec api sh -c \'id; touch /app/x\'',
      'uid=1000(node) gid=1000(node) groups=1000(node)',
      '! touch: /app/x: Permission denied',
      '$ docker top api -o pid,user,args',
      'PID      USER     COMMAND',
      '88789    1000     /sbin/tini -- node dist/index.js',
      '88813    1000     node dist/index.js',
      '$ time docker stop dk16-phongkham-api-1',
      '… 0.143 total',
      '$ docker logs --tail 1 dk16-phongkham-api-1',
      '= SIGTERM — đóng server',
    ], { title: 'output thật — máy Mac', fs: 14 })}
    ${box('info', 'DISK USAGE / CONTENT SIZE (nén) của Docker 29: api 664 / 167 MB, web 328 / 85,6 MB.')}`, 'r') },

  /* ───────────── 16.2 ───────────── */
  { t: 'Ba file compose: nền dùng chung, dev tự nạp, prod gọi tên', body: `${diagram({ w: 1160, h: 250, nodes: [
    { id: 'n', x: 440, y: 10, w: 280, h: 90, t: 'compose.yaml', d: 'ảnh, mạng, volume, healthcheck,\ndepends_on, biến môi trường', c: 'dk' },
    { id: 'd', x: 0, y: 150, w: 290, h: 90, t: 'compose.override.yaml', d: 'dev: build target dev, watch,\ncổng 127.0.0.1, Mailpit', c: 'tea' },
    { id: 'p', x: 900, y: 150, w: 260, h: 90, t: 'compose.prod.yaml', d: 'prod: restart, RAM,\nxoay log, chỉ nginx có ports', c: 'amb' },
    { id: 'u1', x: 380, y: 165, w: 215, h: 60, t: 'docker compose up', c: 'tea', mono: true },
    { id: 'u2', x: 625, y: 165, w: 185, h: 60, t: '-f … -f … up', c: 'amb', mono: true },
  ], edges: [
    { from: 'n', to: 'u1', c: 'dk', fs: 'b', ts: 't' }, { from: 'd', to: 'u1', c: 'tea', t: 'tự nạp' },
    { from: 'n', to: 'u2', c: 'dk', fs: 'b', ts: 't' }, { from: 'p', to: 'u2', c: 'amb', t: 'gọi tên' },
  ] })}
  ${two(term(['$ docker compose -f compose.yaml -f compose.prod.yaml \\', '    config api | grep -A3 limits', '        limits:', '          memory: "268435456"'], { title: 'output thật — máy Mac', fs: 14.5 }),
    box('tip', 'VPS KHÔNG được có <code>compose.override.yaml</code> — nếu lỡ chép lên, <code>docker compose up</code> trơn sẽ trộn cấu hình dev vào production. Luôn <code>config</code> trước khi deploy (Bài 9.5).'))}` },

  { t: 'Hai mạng: nginx không thấy db, db không ra được Internet', body: two(
    `${yaml([
      ['networks:', ''],
      ['  front:', 'nginx, web, api'],
      ['  back:', 'api, migrate, db, cache'],
      ['    internal: true', 'không có đường ra ngoài'],
      ['services:', ''],
      ['  api:', ''],
      ['    networks: [front, back]', 'cầu nối DUY NHẤT'],
    ], { fs: 16 })}
    ${box('info', 'Tên dịch vụ chỉ phân giải được trong mạng mà hai container cùng ở. Chia mạng = viết chính sách “ai được gọi ai” thành thứ Docker THI HÀNH.')}`,
    term([
      '$ docker compose exec nginx wget -qO- -T 3 http://db:5432',
      '! wget: bad address \'db:5432\'',
      '$ docker compose exec db wget -qO- -T 3 http://example.com',
      '! wget: bad address \'example.com\'',
      '$ docker compose exec api wget -qO- http://127.0.0.1:3000/health',
      '= {"ok":true,"version":"4679b20"}',
      '$ docker network inspect dk16-phongkham_back -f \'internal={{.Internal}}\'',
      'internal=true',
    ], { title: 'output thật — máy Mac', fs: 14 }), 'r') },

  { t: 'Thứ tự khởi động do healthcheck quyết định, không do thứ tự trong file', body: two(
    `${steps([
      ['<code>db</code> + <code>cache</code> Healthy', '<code>pg_isready</code>, <code>redis-cli ping</code>'],
      ['<code>migrate</code> Exited (0)', '<code>service_completed_successfully</code>'],
      ['<code>api</code> Healthy', 'chờ cả ba điều kiện trên'],
      ['<code>web</code> Healthy', 'chờ api healthy'],
      ['<code>nginx</code> Healthy', 'chờ web + api — nginx phân giải upstream lúc khởi động'],
    ])}`,
    `${term([
      '$ docker compose up -d --build --wait',
      ' Container dk16-phongkham-migrate-1 Exited',
      ' Container dk16-phongkham-api-1 Waiting',
      '! Container dk16-phongkham-api-1 Error dependency api failed to start',
      '! dependency failed to start: container dk16-phongkham-api-1',
      '! has no healthcheck configured',
    ], { title: 'output thật — lần chạy dev ĐẦU TIÊN', fs: 14 })}
    ${box('warn', '<code>HEALTHCHECK</code> nằm ở stage <code>runtime</code>; compose dev build <code>target: dev</code> nên ảnh dev KHÔNG có nó. Sửa: đặt <code>healthcheck:</code> trong <code>compose.yaml</code> — đúng cho mọi target.')}
    ${kpis([{ v: '25,6 s', l: 'dev: up --wait (ảnh có sẵn)', c: 'tea' }, { v: '29,2 s', l: 'prod: lần đầu trên “VPS”', c: 'amb' }])}`, 'r') },

  { t: 'Dev: Lưu file → API chạy mã mới sau 1,8 giây; thư đi vào Mailpit', body: two(
    yaml([
      ['services:', ''],
      ['  api:', ''],
      ['    build: { context: ./api, target: dev }', ''],
      ['    environment: { SMTP_HOST: mailpit }', 'thư KHÔNG ra ngoài'],
      ['    ports: ["127.0.0.1:18162:3000"]', 'chỉ máy mình'],
      ['    develop:', ''],
      ['      watch:', ''],
      ['        - action: sync', 'chép file vào container'],
      ['          path: ./api/src', ''],
      ['          target: /app/src', 'tsc -w + node --watch'],
      ['        - action: rebuild', 'đổi gói ⇒ dựng lại'],
      ['          path: ./api/package.json', ''],
      ['  mailpit:', ''],
      ['    image: axllent/mailpit:v1.27', 'UI :8025, SMTP :1025'],
    ], { fs: 14.5 }),
    term([
      '$ docker compose watch --no-up',
      'Watch enabled',
      '# sửa api/src/index.ts rồi Lưu',
      'Syncing service "api" after 2 changes were detected',
      '$ docker compose logs api --since 30s',
      'api-1 | File change detected. Starting incremental compilation...',
      'api-1 | Found 0 errors. Watching for file changes.',
      'api-1 | Restarting \'dist/index.js\'',
      'api-1 | SIGTERM — đóng server',
      'api-1 | api dev nghe cổng 3000',
      '= curl thấy mã mới sau 1.82 s',
      '$ curl -s 127.0.0.1:18163/api/v1/messages | jq -r \\',
      '    \'.messages[] | "\\(.Subject) | \\(.To[0].Address)"\'',
      'Đã đặt lịch #7 | benhnhan@example.test',
    ], { title: 'output thật — máy Mac', fs: 13.5 }), 'l') },

  { t: 'Prod: viết một lần trong compose.prod.yaml, kiểm lại bằng docker inspect', body: `${two(
    yaml([
      ['x-log: &log', 'khai một lần, dùng lại bằng *log'],
      ['  driver: json-file', ''],
      ['  options: { max-size: "10m", max-file: "3" }', '≤ 30 MB log/container'],
      ['services:', ''],
      ['  api:', ''],
      ['    restart: unless-stopped', 'sống lại sau reboot'],
      ['    deploy: { resources: { limits: { memory: 256m } } }', ''],
      ['    logging: *log', ''],
    ], { fs: 14 }),
    box('tip', '“Đã viết trong YAML” chưa phải “đang có hiệu lực”. Một vòng <code>docker inspect</code> mất 2 giây và trả lời dứt khoát. <code>mem=0</code> của nginx = không giới hạn — cố ý, nó chỉ tốn vài MB.'), 'l2')}
    ${term([
      '$ for c in api web db cache nginx; do docker inspect -f \\',
      '  \'{{.Name}} mem={{.HostConfig.Memory}} restart=… log=…\' dk16-phongkham-$c-1; done',
      '/dk16-phongkham-api-1 mem=268435456 restart=unless-stopped log=json-file 10mx3',
      '/dk16-phongkham-web-1 mem=268435456 restart=unless-stopped log=json-file 10mx3',
      '/dk16-phongkham-db-1 mem=536870912 restart=unless-stopped log=json-file 10mx3',
      '/dk16-phongkham-cache-1 mem=134217728 restart=unless-stopped log=json-file 10mx3',
      '/dk16-phongkham-nginx-1 mem=0 restart=unless-stopped log=json-file 10mx3',
    ], { title: 'output thật — máy Mac', fs: 14 })}` },

  /* ───────────── 16.3 ───────────── */
  { t: 'Một commit đi tới production qua sáu trạm', body: `${diagram({ w: 1160, h: 300, nodes: [
    { id: 'g', x: 0, y: 20, w: 170, h: 80, t: 'git push', d: 'nhánh main', c: 'dim', ic: '💻' },
    { id: 'a', x: 230, y: 20, w: 250, h: 80, t: 'GitHub Actions', d: 'build amd64 + arm64\ncache type=gha', c: 'dk' },
    { id: 'r', x: 540, y: 20, w: 250, h: 80, t: 'GHCR', d: 'phongkham-api:03c9ee3\nphongkham-api:main', c: 'vio' },
    { id: 'v', x: 850, y: 20, w: 300, h: 80, t: 'VPS: deploy.sh 03c9ee3', d: 'git checkout file compose + nginx', c: 'amb' },
    { id: 'u', x: 850, y: 180, w: 300, h: 80, t: 'pull → up -d --wait', d: 'nginx -t && nginx -s reload', c: 'tea' },
    { id: 's', x: 480, y: 180, w: 300, h: 80, t: 'smoke.sh', d: '/healthz · /api/slots · /', c: 'grn' },
    { id: 'b', x: 60, y: 180, w: 340, h: 80, t: 'HỎNG ⇒ TAG cũ, up lại', d: 'quay lui tự động < 20 s', c: 'red' },
  ], edges: [
    { from: 'g', to: 'a' }, { from: 'a', to: 'r', c: 'vio', t: 'push' }, { from: 'r', to: 'v', c: 'amb', t: 'ssh' },
    { from: 'v', to: 'u', c: 'tea' }, { from: 'u', to: 's', c: 'grn' }, { from: 's', to: 'b', c: 'red', t: 'mã ≠ 200' },
  ] })}
  ${box('info', 'Cả chuỗi diễn tập thật trên máy Mac: registry cục bộ <code>registry:2</code> có mật khẩu đóng vai GHCR, một thư mục chỉ có file compose đóng vai VPS. Riêng bước GitHub Actions: workflow viết đủ và qua <code>actionlint</code> 1.7.12, nhưng không đẩy lên GitHub. Chi tiết: <code>/courses/github-actions</code>, <code>/courses/deploy-vps</code>.')}` },

  { t: 'Workflow: build hai kiến trúc có cache, rồi gọi đúng một script trên VPS', body: two(
    yaml([
      ['on: { push: { branches: [main] } }', ''],
      ['concurrency: { group: production }', 'một deploy mỗi lúc'],
      ['permissions: { packages: write }', 'GITHUB_TOKEN đẩy GHCR'],
      ['jobs:', ''],
      ['  build:', ''],
      ['    strategy: { matrix: { service: [api, web] } }', ''],
      ['    steps:', ''],
      ['      - uses: docker/setup-qemu-action@v4', 'giả lập arm64'],
      ['      - uses: docker/setup-buildx-action@v4', ''],
      ['      - uses: docker/login-action@v4', 'ghcr.io'],
      ['      - run: echo "sha=${GITHUB_SHA::7}" >> …', '7 ký tự đầu'],
      ['      - uses: docker/build-push-action@v7', ''],
      ['        with:', ''],
      ['          target: runtime', ''],
      ['          platforms: linux/amd64,linux/arm64', ''],
      ['          tags: …-api:<sha>, …-api:main', 'KHÔNG chỉ latest'],
      ['          cache-to: type=gha,mode=max,scope=api', ''],
      ['  deploy:', ''],
      ['    needs: build', 'build hỏng ⇒ không deploy'],
      ['    environment: production', 'có thể bắt duyệt tay'],
      ['    steps: [ appleboy/ssh-action@v1.2.5 … ]', './deploy.sh <sha>'],
    ], { fs: 13 }),
    `${list([
      '<code>concurrency</code>: hai lần push liền nhau không đua nhau vào VPS (bài học thật: hai workflow deploy chạy song song từng làm sập API).',
      '<code>scope</code> riêng cho api và web: không ghi đè cache của nhau.',
      'Deploy chạy <code>deploy.sh</code> — cùng một script bạn gõ tay được khi GitHub hỏng.',
      'VPS cần <code>docker login ghcr.io</code> một lần bằng token chỉ <code>read:packages</code> nếu package để private.',
    ])}`, 'l') },

  { t: 'Tag theo commit: một tag, hai kiến trúc, và luôn có đường quay lui', body: two(
    term([
      '$ git log --oneline',
      '03c9ee3 nginx: gan thu muc; deploy.sh + smoke.sh',
      '12c9b80 compose: dua JWT_SECRET vao api',
      '0fa642f api: bat buoc JWT_SECRET (chuan bi dang nhap)',
      'c2f59c1 api: them GET /api/doctors',
      '4679b20 phongkham v1: dat lich + nginx + compose',
      '$ docker buildx build --platform linux/amd64,linux/arm64 \\',
      '    --target runtime -t localhost:18165/…-api:12c9b80 --push ./api',
      '… 43.520 total',
      '$ docker buildx imagetools inspect localhost:18165/…-api:12c9b80',
      'MediaType: application/vnd.oci.image.index.v1+json',
      '  Platform:    linux/amd64',
      '  Platform:    linux/arm64',
      '  Platform:    unknown/unknown   # attestation',
    ], { title: 'output thật — máy Mac', fs: 13.5 }),
    vs({
      no: { t: ':latest', items: ['“bản nào đang chạy?” — không ai biết', 'quay lui = dựng lại bản cũ (15 phút)', 'pull hôm nay khác pull hôm qua'] },
      yes: { t: ':&lt;sha commit&gt;', items: ['<code>git show 03c9ee3</code> = đúng mã đang chạy', 'quay lui = đổi một dòng <code>TAG=</code>', 'ảnh cũ vẫn nằm trong registry'] },
    }), 'l') },

  { t: 'deploy.sh: kéo → lên → kiểm → hỏng thì tự quay về tag cũ', body: two(
    code(`MOI=$1
CU=$(sed -n 's/^TAG=//p' .env)
TAG=$MOI docker compose $C pull -q || exit 1
dat_tag "$MOI"
if docker compose $C up -d --wait --wait-timeout 90 \\
   && docker compose $C exec -T nginx nginx -t -q \\
   && docker compose $C exec -T nginx nginx -s reload \\
   && ./smoke.sh; then
  echo "== OK: đang chạy $MOI"
else
  echo "!! $MOI hỏng — quay lui về $CU"
  docker compose $C logs --tail 5 api
  dat_tag "$CU"
  docker compose $C up -d --wait && ./smoke.sh
  exit 1
fi`, 'bash'),
    `${steps([
      ['<code>pull</code> TRƯỚC khi đổi gì', 'không kéo được ⇒ dừng, bản cũ vẫn chạy'],
      ['<code>up --wait</code>', 'trả lỗi nếu có dịch vụ không healthy'],
      ['nạp lại nginx', '<code>up</code> không tạo lại nginx khi chỉ đổi file cấu hình'],
      ['<code>smoke.sh</code> qua CỬA NGOÀI', 'healthy bên trong chưa chắc gọi được từ ngoài'],
    ])}`, 'l') },

  { t: 'Bản hỏng lên, chưa tới 20 giây sau bản cũ đã chạy lại — không ai phải thức dậy', body: two(
    term([
      '$ ./deploy.sh 0fa642f',
      '== deploy 0fa642f (đang chạy: c2f59c1)',
      '! !! 0fa642f hỏng — quay lui về c2f59c1',
      'api-1  | thiếu biến môi trường JWT_SECRET — dừng',
      'api-1  | thiếu biến môi trường JWT_SECRET — dừng',
      'api-1  | thiếu biến môi trường JWT_SECRET — dừng',
      '/healthz                     200 (cần 200)',
      '/api/slots?day=2026-10-01    200 (cần 200)',
      '/                            200 (cần 200)',
      '= == đã quay lui: đang chạy c2f59c1',
      './deploy.sh 0fa642f  … 19.774 total',
    ], { title: 'output thật — máy Mac (diễn tập VPS)', fs: 14 }),
    `${term([
      '# cùng bản hỏng, deploy TAY không kiểm:',
      '$ ./smoke.sh',
      '/healthz                     200 (cần 200)',
      '! /api/slots?day=2026-10-01    502 (cần 200)',
      '! /                            504 (cần 200)',
    ], { title: 'output thật', fs: 14 })}
    ${kpis([{ v: '19,8 s', l: 'deploy hỏng + tự quay lui', c: 'amb' }, { v: '13,8 s', l: 'quay lui tay: đổi TAG, up --wait', c: 'grn' }])}
    ${box('info', '<code>/healthz</code> của nginx vẫn 200 khi API chết — smoke test phải gọi tới tận API.')}`, 'l') },

  /* ───────────── 16.4 ───────────── */
  { t: 'Sao lưu chỉ có giá trị khi đã khôi phục thử thành công', body: two(
    term([
      '$ docker compose exec -T db pg_dump -U phongkham -Fc phongkham \\',
      '    > backup/phongkham-2026-09-24.dump',
      '$ ls -l backup/',
      '-rw-r--r--  1 admin  wheel  4699 Sep 24 08:24 phongkham-2026-09-24.dump',
      '# khôi phục vào một Postgres dùng-một-lần',
      '$ docker run -d --rm --name restore -e POSTGRES_PASSWORD=thu \\', '    postgres:16.4-alpine',
      '$ docker exec restore createdb -U postgres khoiphuc',
      '$ docker exec -i restore pg_restore -U postgres -d khoiphuc \\', '    --no-owner < backup/phongkham-2026-09-24.dump',
      '$ docker exec restore psql -U postgres -d khoiphuc \\',
      '    -c \'select id, patient_name, doctor, slot from bookings order by id\'',
      ' id | patient_name |     doctor     |        slot',
      '----+--------------+----------------+---------------------',
      '  1 | Nguyễn Văn A | BS. Lan (Nhi)  | 2026-10-01 01:00:00',
      '  3 | Bệnh nhân 09 | BS. Minh (Nội) | 2026-10-01 02:00:00',
      '…',
      '(5 rows)',
    ], { title: 'output thật — máy Mac', fs: 13.5 }),
    `${list([
      '<code>-T</code>: KHÔNG cấp TTY, nếu không dump nhị phân bị hỏng (Bài 7.5).',
      '<code>-Fc</code>: định dạng nén, khôi phục chọn lọc được bằng <code>pg_restore</code>.',
      'Khôi phục vào container <code>--rm</code> khác, rồi ĐẾM dòng so với bản gốc (5 = 5).',
      'id 2 không có: cú đặt trùng giờ (409) đã tiêu một số của sequence — dữ liệu thật có lịch sử.',
      'Chép file dump RA KHỎI VPS (máy nhà, R2/S3). Bản sao lưu nằm cạnh CSDL thì cháy cùng CSDL.',
    ])}`, 'l') },

  { t: 'Tám sự cố kinh điển: triệu chứng nào, gõ lệnh gì trước', body: table(['Sự cố', 'Triệu chứng', 'Lệnh đầu tiên', 'Chương'], [
    ['OOM', '<code>Exited (137)</code>, restart', '<code>inspect -f {{.State.OOMKilled}}</code>', '2.5 · 11.2'],
    ['Sai libc', 'build xanh, API 502', '<code>logs api</code> → <code>PrismaClientInitializationError</code>', '6.2 · 12.4'],
    ['Đĩa đầy', '<code>no space left on device</code>', '<code>docker system df</code>', '3.5 · 11.5'],
    ['Restart vòng lặp', '<code>Restarting (1)</code>', '<code>logs --tail 20</code>, <code>RestartCount</code>', '11.1 · 12.3'],
    ['Cổng DB lộ', 'Postgres trả lời từ Internet', '<code>docker ps</code> cột PORTS có <code>0.0.0.0</code>', '8.2'],
    ['Bind mount file + mv', 'sửa cấu hình, reload OK, không đổi gì', 'so <code>sha256sum</code> trong/ngoài', '7.3 · 10.5'],
    ['.env không vào', 'app báo thiếu biến', '<code>compose config</code>, <code>exec … printenv</code>', '9.4'],
    ['Múi giờ UTC', 'log lệch 7 giờ, lịch hẹn sai ngày', '<code>exec … date</code>', '2.4'],
  ], { sm: true }) },

  { t: 'Hai kiểu chết: 137 là bị GIẾT, 1 là tự thoát', body: two(
    term([
      '$ docker run --name oom --memory 128m \\',
      '    --memory-swap 128m --entrypoint node <ảnh api> \\',
      '    -e \'…Buffer.alloc(20e6)…\'',
      'đã giữ 60 MB',
      'đã giữ 80 MB',
      'đã giữ 100 MB',
      'đã giữ 120 MB',
      '$ docker inspect oom -f \\',
      '    \'{{.State.ExitCode}} {{.State.OOMKilled}}\'',
      '! 137 true',
    ], { title: 'output thật — máy Mac', fs: 14 }),
    `${term([
      '# ảnh build trên Debian, chạy trên Alpine:',
      '$ docker compose ps api --format \'{{.Service}} {{.Image}} {{.Status}}\'',
      '! api localhost:18165/…-api:sai-libc Restarting (1) 3 seconds ago',
      '$ for i in 1 2 3; do curl -s -o /dev/null -w \'%{http_code} \' \\',
      '    "http://127.0.0.1:18160/api/slots?day=2026-10-01"; sleep 1; done',
      '! 502 502 502',
      '$ docker compose logs api',
      'api sai-libc nghe cổng 3000',
      '! PrismaClientInitializationError: … Query Engine for runtime',
      '! "linux-musl-arm64-openssl-3.0.x". … generated for',
      '! "linux-arm64-openssl-1.1.x"',
      '$ docker logs nginx 2>&1 | grep upstream | tail -2',
      '… connect() failed (111: Connection refused) while connecting to upstream …',
      '… connect() failed (113: Host is unreachable) while connecting to upstream …',
    ], { title: 'output thật — máy Mac', fs: 13 })}
    ${box('tip', '137 ⇒ tăng RAM hoặc giảm dùng (build ở máy khác). 1 + log đỏ ⇒ đọc log, KHÔNG tăng RAM.')}`, 'r') },

  { t: 'Sửa file cấu hình bằng mv: reload “thành công”, không gì thay đổi', body: two(
    inodePic(),
    `${term([
      '$ sed "s/phien-ban-1/phien-ban-2/" default.conf > default.conf.moi \\',
      '    && mv default.conf.moi default.conf',
      '$ docker exec ng nginx -t 2>&1 | tail -1',
      'nginx: configuration file /etc/nginx/nginx.conf test is successful',
      '$ docker exec ng nginx -s reload 2>/dev/null; sleep 1',
      '$ curl -s 127.0.0.1:18167',
      '! phien-ban-1',
      'host      inode=5516765 3155f529d56d',
      'container inode=5516764 366391d755d7',
      '$ docker restart ng >/dev/null; sleep 2; curl -s 127.0.0.1:18167',
      '= phien-ban-2',
    ], { title: 'output thật — máy Linux (Engine 29.6)', fs: 13 })}
    ${box('good', 'Phòng: gắn THƯ MỤC (<code>./nginx:/etc/nginx/conf.d:ro</code>). <code>git pull</code>, <code>sed -i</code>, vim đều ghi file mới rồi đổi tên — đo được: <code>git checkout</code> đổi inode mỗi lần.')}`, 'l') },

  { t: 'ports: không ghi IP là mở cho MỌI mạng — trừ khi dịch vụ chỉ ở mạng internal', body: two(
    `${term([
      '# lo-cong.yaml: ports: ["18166:5432"] — chỉ đọc config, KHÔNG chạy',
      '$ docker compose … -f lo-cong.yaml config db | grep -A4 \' ports:\'',
      '    ports:',
      '      - mode: ingress',
      '        target: 5432',
      '        published: "18166"',
      '        protocol: tcp',
      '# an-toan.yaml: ports: ["127.0.0.1:18166:5432"]',
      '$ docker compose … -f an-toan.yaml config db | grep host_ip',
      '        host_ip: 127.0.0.1',
      '$ docker ps --filter name=cuong_pg_new --format \'{{.Names}} [{{.Ports}}]\'',
      '+ cuong_pg_new [0.0.0.0:5434->5432/tcp, [::]:5434->5432/tcp]',
    ], { title: 'output thật — máy Mac', fs: 13.5 })}`,
    `${term([
      '# db CHỈ ở mạng back (internal: true) + ports 127.0.0.1:18166',
      '$ docker compose ps db --format \'{{.Status}} [{{.Ports}}]\'',
      'Up 9 seconds (healthy) [5432/tcp]',
      '$ nc -z -w 3 127.0.0.1 18166 || echo đóng',
      '= đóng',
    ], { title: 'output thật — máy Mac', fs: 13.5 })}
    <div style="margin-top:16px">${list([
      'Không có <code>host_ip</code> = <code>0.0.0.0</code>: mọi giao diện. Trên Linux, luật iptables của Docker đi TRƯỚC <code>ufw</code> (Bài 8.2).',
      'Mạng <code>internal: true</code> lặng lẽ bỏ qua <code>ports:</code> — chính nó là lưới an toàn.',
      'Cần psql từ laptop? <code>ssh -L 5432:… vps</code>, không mở cổng.',
    ])}</div>`) },

  { t: '.env chỉ để Compose nội suy; container mặc định sống ở UTC', body: two(
    term([
      '# .env trên VPS đã có JWT_SECRET=…',
      '$ docker compose … config | grep -c JWT',
      '! 0',
      '$ docker compose … config --environment | grep JWT',
      'JWT_SECRET=thu-bi-mat-64-ky-tu',
      '# thêm vào compose.yaml:  JWT_SECRET: ${JWT_SECRET:?thiếu …}',
      '$ ./deploy.sh 0fa642f',
      '= == OK: đang chạy 0fa642f',
      '$ docker compose … exec api printenv JWT_SECRET',
      'thu-bi-mat-64-ky-tu',
    ], { title: 'output thật — máy Mac', fs: 13.5 }),
    `${term([
      '$ date \'+%F %T %Z\'            # máy Mac',
      '2026-09-24 08:24:41 +07',
      '$ docker run --rm --entrypoint sh <ảnh api> -c \'date; node -e …\'',
      'Thu Sep 24 01:24:41 UTC 2026',
      'Thu Sep 24 2026 01:24:41 GMT+0000 (Coordinated Universal Time)',
      '$ docker run --rm -e TZ=Asia/Ho_Chi_Minh --entrypoint sh <ảnh api> -c \'…\'',
      '! Thu Sep 24 01:24:41 UTC 2026        # busybox: thiếu tzdata',
      '= Thu Sep 24 2026 08:24:41 GMT+0700 (Indochina Time)',
    ], { title: 'output thật — máy Mac', fs: 13 })}
    ${box('tip', 'Lưu DB theo UTC (Postgres: <code>show timezone</code> → <code>UTC</code>), đổi sang giờ Việt Nam lúc HIỂN THỊ. <code>TZ</code> đủ cho Node; <code>date</code>, cron cần thêm gói <code>tzdata</code>.')}`) },

  { t: 'Đĩa đầy: đo trước, dọn có chọn lọc, và đừng bao giờ -a trên máy chủ lúc hoảng', body: two(
    `${term([
      '$ docker system df',
      'TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE',
      'Images          69        17        37.01GB   24.82GB (67%)',
      'Containers      30        4         882.5MB   553.7MB (62%)',
      'Local Volumes   70        23        9.125GB   4.086GB (44%)',
      '! Build Cache     587       15        36.45GB   20.26GB',
    ], { title: 'output thật — máy Mac soạn khoá (chỉ đo, không dọn)', fs: 14 })}
    ${box('warn', 'Ở đây Build Cache (36 GB) lớn hơn cả ảnh. Trên VPS mà build tại chỗ, đó là thứ lấp đầy cái đĩa chung với Postgres — rồi <code>next build</code> chết giữa chừng vì <code>no space left on device</code>.')}`,
    `${steps([
      ['<code>df -h /</code> và <code>docker system df</code>', 'biết cái gì to trước khi xoá'],
      ['<code>docker builder prune --filter until=168h</code>', 'cache cũ hơn 7 ngày'],
      ['<code>docker image prune --filter until=168h</code>', 'KHÔNG <code>-a</code>: giữ ảnh tag cũ để quay lui'],
      ['Volume: KHÔNG prune trên máy chủ', 'chỉ xoá theo tên sau khi đã sao lưu'],
      ['Phòng: build ở CI/máy khác, VPS chỉ pull', 'và <code>max-size</code> cho log'],
    ])}`, 'l') },

  /* ───────────── 16.5 & tổng kết ───────────── */
  { t: 'Cả khoá trong sáu cụm — bài thi cuối khoá phủ đều cả sáu', body: cards([
    { ic: '🧭', t: 'Nền tảng · Mục 0–3', d: 'container = tiến trình + namespace + cgroup; tầng ảnh; tag vs digest; registry; đa kiến trúc; dọn đĩa' },
    { ic: '🏗️', t: 'Dựng ảnh · Ch.4–6', d: 'Dockerfile, ngữ cảnh, CMD/ENTRYPOINT, ARG/ENV, cache, cache mount, multi-stage, musl/glibc, không root' },
    { ic: '💾', t: 'Dữ liệu &amp; mạng · Ch.7–8', d: 'volume vs bind mount vs tmpfs, sao lưu; bridge tự tạo, DNS nội bộ, -p và tường lửa, localhost' },
    { ic: '🧩', t: 'Compose &amp; vận hành · Ch.9–12', d: 'healthcheck, depends_on, .env, nhiều file, stack thật, restart, 137, log, quay lui, chẩn đoán' },
    { ic: '🧰', t: 'Mở rộng · Ch.13–15', d: 'Dev Containers, watch, Testcontainers, Docker Desktop là VM; công cụ không cài, tự host, GPU; buildx, rootless, Swarm, K8s' },
    { ic: '🚀', t: 'Dự án · Ch.16', d: 'đóng gói → compose dev/prod → CI → GHCR → VPS → sao lưu → tám sự cố' },
  ], 3) },

  { t: 'Sai lầm hay gặp khi đưa app thật lên production', body: cards([
    { ic: '📦', t: 'Quên .dockerignore', d: 'node_modules của Mac lọt vào ảnh, ngữ cảnh 347 MB, engine sai hệ điều hành', c: 'red' },
    { ic: '🧬', t: 'Build một nền, chạy nền khác', d: 'Debian → Alpine: build xanh, API 502 và restart vòng lặp', c: 'red' },
    { ic: '🏷️', t: 'Chỉ có :latest', d: 'không biết bản nào đang chạy, quay lui phải dựng lại', c: 'amb' },
    { ic: '🚪', t: 'ports: cho Postgres', d: 'không IP = 0.0.0.0; iptables của Docker đi trước ufw', c: 'amb' },
    { ic: '📄', t: 'Gắn file đơn rồi git pull', d: 'git ghi file mới ⇒ container đọc inode cũ; gắn thư mục', c: 'vio' },
    { ic: '🧪', t: 'Sao lưu chưa từng khôi phục', d: 'file dump hỏng hay rỗng chỉ lộ ra đúng ngày bạn cần nó', c: 'vio' },
  ], 3) },

  { t: 'Bảng tra nhanh Chương 16', body: table(['Việc', 'Lệnh / chỗ viết'], [
    ['Đo ngữ cảnh gửi đi', '<code>docker build --progress=plain … | grep "transferring context"</code>'],
    ['Dựng đúng stage', '<code>docker build --target runtime -t …:$(git rev-parse --short HEAD) ./api</code>'],
    ['Dev có nạp nóng', '<code>docker compose up -d --wait</code> rồi <code>docker compose watch</code>'],
    ['Xem prod THẬT SỰ chạy gì', '<code>docker compose -f compose.yaml -f compose.prod.yaml config</code>'],
    ['Deploy an toàn', '<code>pull</code> → <code>up -d --wait</code> → <code>nginx -s reload</code> → <code>smoke.sh</code>'],
    ['Quay lui', 'đổi <code>TAG=</code> trong <code>.env</code> → <code>up -d --wait</code> (13,8 s)'],
    ['Sao lưu / khôi phục', '<code>exec -T db pg_dump -Fc</code> · <code>exec -i … pg_restore -d …</code>'],
    ['Có bị giết vì RAM?', '<code>docker inspect -f "{{.State.OOMKilled}}" &lt;c&gt;</code>'],
    ['Biến có vào container?', '<code>compose config</code> · <code>compose exec api printenv TÊN</code>'],
  ], { sm: true }) },

  { t: 'Thực hành Chương 16: một buổi 45 phút, từ thư mục trống tới “deploy hỏng tự quay lui”', body: steps([
    ['Viết <code>.dockerignore</code> + Dockerfile ba stage cho API của nhóm; ghi kích thước trước/sau', '10 phút · Đạt: ảnh &lt; 1/3 bản ngày 0, <code>id</code> không phải root'],
    ['Ghép <code>compose.yaml</code> + <code>compose.override.yaml</code>; <code>up --wait</code> xanh; sửa một file thấy đổi', '10 phút · Đạt: <code>docker compose ps</code> toàn healthy'],
    ['Chạy <code>registry:2</code> cục bộ; build + push hai tag theo commit', '10 phút · Đạt: <code>/v2/…/tags/list</code> có 2 tag'],
    ['Viết <code>deploy.sh</code> + <code>smoke.sh</code>; deploy một bản cố ý hỏng', '10 phút · Đạt: script tự quay lui, smoke 200'],
    ['<code>pg_dump</code> rồi khôi phục vào container <code>--rm</code>; đếm dòng', '5 phút · Đạt: số dòng khớp'],
  ]) },
]);
