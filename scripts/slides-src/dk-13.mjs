/**
 * Docker · Deck dk-13 — Chương 13: Docker trong vòng lặp phát triển hằng ngày.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 24/09/2026:
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0 arm64, Compose v5.5.1, Node 22,
 *                   @devcontainers/cli 0.89.0, testcontainers 12.1.0
 *   • "máy Linux" = Fedora 44, Docker Engine 29.6.2 amd64 (ổ NVMe, btrfs)
 * Tên đối tượng trong output mang tiền tố dk13- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, list, mindmap, layers, term as dkTerm, diagram, yaml, bars, esc, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });

export const deck = { key: 'dk-13', code: 'DOCKER · CHƯƠNG 13', title: 'Docker trong vòng lặp phát triển', sub: 'Docker · Chương 13' };

/* ───────────── SVG nhỏ tự vẽ ───────────── */
const MONO = 'SF Mono,Menlo,monospace';
const sv = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;margin:0 auto"><defs>` +
  ['dk', 'amb', 'red', 'grn', 'mu', 'tea', 'vio'].map((k) => `<marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${D[k]}"/></marker>`).join('') +
  `</defs>${inner}</svg>`;
const R = (x, y, w, h, { c = 'dk', fill = '#111a2b', dash = false, r = 12, sw = 2.5, op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${D[c] || c}" stroke-width="${sw}"${dash ? ' stroke-dasharray="9 7"' : ''} opacity="${op}"/>`;
const T = (x, y, s, { fs = 17, c = '#e6edf3', a = 'start', b = false, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" fill="${D[c] || c}" text-anchor="${a}"${b ? ' font-weight="800"' : ''}${mono ? ` font-family="${MONO}"` : ''}>${esc(s)}</text>`;
const A = (x1, y1, x2, y2, { c = 'dk', dash = false, sw = 3 } = {}) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${D[c]}" stroke-width="${sw}" fill="none"${dash ? ' stroke-dasharray="7 6"' : ''} marker-end="url(#m-${c})"/>`;

/* Slide 3 — dev container: mã ở máy bạn, công cụ ở trong container */
const devcPic = () => sv(1150, 400,
  R(0, 10, 360, 380, { c: 'dim', dash: true, fill: 'rgba(107,122,147,.06)' }) +
  T(20, 42, '💻 MÁY BẠN (Mac / Windows / Linux)', { fs: 17, b: true, c: 'mu' }) +
  R(24, 64, 312, 90, { c: 'blu' }) + T(180, 98, 'VS Code (giao diện)', { fs: 18, a: 'middle', b: true }) +
  T(180, 126, 'chỉ vẽ màn hình + bàn phím', { fs: 14.5, a: 'middle', c: 'mu' }) +
  R(24, 184, 312, 90, { c: 'grn' }) + T(180, 218, '~/swp391-api/  (mã nguồn)', { fs: 17, a: 'middle', b: true, mono: true }) +
  T(180, 246, 'vẫn là file thật, git ở đây', { fs: 14.5, a: 'middle', c: 'mu' }) +
  R(24, 304, 312, 70, { c: 'amb' }) + T(180, 336, '.devcontainer/devcontainer.json', { fs: 15, a: 'middle', mono: true }) +
  T(180, 360, 'công thức môi trường — commit vào repo', { fs: 13.5, a: 'middle', c: 'amb' }) +
  R(560, 10, 590, 380, { c: 'dk', fill: 'rgba(36,150,237,.06)' }) +
  T(580, 42, '🐳 CONTAINER dev (node:22-bookworm-slim)', { fs: 17, b: true, c: 'dk' }) +
  R(584, 64, 542, 90, { c: 'blu' }) + T(855, 98, 'VS Code Server + extension', { fs: 18, a: 'middle', b: true }) +
  T(855, 126, 'ESLint, Prettier… cài TRONG container', { fs: 14.5, a: 'middle', c: 'mu' }) +
  R(584, 184, 542, 90, { c: 'grn' }) + T(855, 218, '/workspaces/swp391-api', { fs: 17, a: 'middle', b: true, mono: true }) +
  T(855, 246, 'cùng thư mục đó, gắn vào (bind mount)', { fs: 14.5, a: 'middle', c: 'mu' }) +
  R(584, 304, 542, 70, { c: 'tea' }) + T(855, 336, 'node 22 · npm · git · psql — cùng phiên bản', { fs: 16, a: 'middle', b: true }) +
  T(855, 360, 'cả nhóm, mọi máy', { fs: 13.5, a: 'middle', c: 'tea' }) +
  A(336, 109, 580, 109, { c: 'dk' }) + T(458, 98, 'kết nối', { fs: 14, a: 'middle', c: 'blu' }) +
  A(336, 229, 580, 229, { c: 'grn' }) + T(458, 218, 'bind mount', { fs: 14, a: 'middle', c: 'grn' }) +
  A(336, 339, 580, 339, { c: 'amb', dash: true }) + T(458, 328, 'dựng ra', { fs: 14, a: 'middle', c: 'amb' }));

/* Slide 10 — bind mount đè thư mục node_modules của ảnh */
const nmPic = () => sv(620, 380,
  T(0, 22, 'Ảnh có /app/node_modules (npm ci lúc build)', { fs: 15.5, c: 'mu' }) +
  R(0, 36, 280, 150, { c: 'dk' }) + T(140, 64, '/app trong ẢNH', { fs: 17, a: 'middle', b: true }) +
  T(20, 96, 'package.json', { fs: 15, mono: true }) + T(20, 122, 'src/', { fs: 15, mono: true }) +
  T(20, 148, 'node_modules/ ✔ express', { fs: 15, mono: true, c: 'grn' }) + T(20, 172, '(Linux, arm64)', { fs: 13, c: 'mu' }) +
  R(340, 36, 280, 150, { c: 'amb', dash: true }) + T(480, 64, '. trên MÁY BẠN', { fs: 17, a: 'middle', b: true }) +
  T(360, 96, 'package.json', { fs: 15, mono: true }) + T(360, 122, 'src/', { fs: 15, mono: true }) +
  T(360, 148, '(không có node_modules)', { fs: 15, mono: true, c: 'red' }) +
  A(480, 190, 330, 236, { c: 'amb' }) + T(500, 222, '-v .:/app PHỦ lên', { fs: 14.5, c: 'amb' }) +
  R(0, 240, 620, 132, { c: 'red', fill: 'rgba(255,92,108,.07)' }) +
  T(20, 270, 'Container thấy: /app = thư mục của máy bạn', { fs: 16.5, b: true }) +
  T(20, 298, 'node_modules của ảnh bị CHE (vẫn còn, nhưng không thấy)', { fs: 15, c: 'mu' }) +
  T(20, 330, "Error: Cannot find module 'express'", { fs: 16, mono: true, c: 'red', b: true }) +
  T(20, 358, 'sửa: thêm - /app/node_modules (volume) che lại lần nữa', { fs: 15, c: 'grn' }));

/* Slide 16 — Postgres khởi động HAI lần */
const pgTwice = () => {
  const X = (ms) => 40 + ms * 1.9; // 0..~560 ms
  let s = '';
  for (let t = 0; t <= 550; t += 50) s += `<line x1="${X(t)}" y1="40" x2="${X(t)}" y2="250" stroke="#1d2a40"/>` + T(X(t), 272, `${t}`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  s += T(X(0), 296, 'ms kể từ dòng log đầu tiên của máy chủ tạm (00:31:21.660)', { fs: 13.5, c: 'dim' });
  s += `<rect x="${X(0)}" y="70" width="${X(112) - X(0)}" height="40" rx="7" fill="${D.amb}" opacity=".25"/>`;
  s += T(X(0) + 8, 62, 'máy chủ TẠM: chỉ socket, đang chạy initdb + seed', { fs: 14.5, c: 'amb' });
  s += `<rect x="${X(219)}" y="150" width="${X(550) - X(219)}" height="40" rx="7" fill="${D.grn}" opacity=".25"/>`;
  s += T(X(219) + 8, 142, 'máy chủ THẬT: nghe 0.0.0.0:5432', { fs: 14.5, c: 'grn' });
  s += `<circle cx="${X(3)}" cy="90" r="8" fill="${D.amb}"/>` + T(X(3) + 14, 96, 'ready (lần 1)', { fs: 14, c: '#fff', mono: true });
  s += `<circle cx="${X(112)}" cy="90" r="8" fill="${D.red}"/>` + T(X(112) + 14, 96, 'shut down', { fs: 14, c: 'red', mono: true });
  s += `<circle cx="${X(224)}" cy="170" r="8" fill="${D.grn}"/>` + T(X(224) + 14, 176, 'ready (lần 2) ← chờ cái NÀY', { fs: 14, c: '#fff', mono: true, b: true });
  s += T(X(0), 228, 'pg_isready -U postgres (qua socket) có thể báo “sẵn sàng” ngay ở lần 1', { fs: 14.5, c: 'red' });
  s += T(X(0), 248, 'pg_isready -h 127.0.0.1 (qua TCP) chỉ báo sẵn sàng ở lần 2', { fs: 14.5, c: 'grn' });
  return sv(1150, 305, s);
};

/* Slide 21 — Docker trên Mac/Windows là một máy ảo */
const vmPic = () => sv(560, 420,
  R(0, 6, 560, 408, { c: 'dim', dash: true, fill: 'rgba(107,122,147,.05)' }) +
  T(20, 36, 'macOS (nhân Darwin 27) · RAM 32 GB', { fs: 16, b: true, c: 'mu' }) +
  R(20, 52, 180, 56, { c: 'blu' }) + T(110, 86, 'docker (CLI)', { fs: 16, a: 'middle', mono: true }) +
  R(220, 52, 320, 56, { c: 'grn' }) + T(380, 78, '~/swp391-api (mã)', { fs: 15.5, a: 'middle', mono: true }) + T(380, 98, 'ổ APFS của Mac', { fs: 13, a: 'middle', c: 'mu' }) +
  R(20, 130, 520, 270, { c: 'dk', fill: 'rgba(36,150,237,.07)' }) +
  T(40, 160, 'MÁY ẢO Linux — nhân 7.0.12-linuxkit', { fs: 16.5, b: true, c: 'dk' }) +
  T(40, 182, '10 CPU · 7,7 GiB RAM · đĩa Docker.raw', { fs: 14.5, c: 'mu' }) +
  R(40, 196, 170, 50, { c: 'vio' }) + T(125, 227, 'dockerd', { fs: 16, a: 'middle', mono: true }) +
  R(230, 196, 290, 50, { c: 'tea' }) + T(375, 227, 'container: api, db…', { fs: 15.5, a: 'middle' }) +
  R(40, 262, 480, 56, { c: 'amb' }) + T(280, 288, 'volume = ext4 BÊN TRONG máy ảo (nhanh)', { fs: 15.5, a: 'middle' }) +
  T(280, 308, '/dev/vda1 ext4', { fs: 13, a: 'middle', c: 'mu', mono: true }) +
  R(40, 332, 480, 56, { c: 'red' }) + T(280, 358, 'bind mount = virtiofs, đi XUYÊN vách máy ảo', { fs: 15.5, a: 'middle' }) +
  T(280, 378, 'mỗi thao tác file là một chuyến qua lại', { fs: 13, a: 'middle', c: 'mu' }) +
  A(110, 108, 110, 128, { c: 'dk' }) + A(470, 108, 470, 332, { c: 'red', dash: true }));

/* Slide 23 — WSL2: hai hệ file */
const wslPic = () => sv(1150, 330,
  R(0, 10, 540, 300, { c: 'red', fill: 'rgba(255,92,108,.05)' }) +
  T(20, 42, '❌ Mã ở ổ Windows: C:\\Users\\an\\swp391', { fs: 17, b: true, c: 'red' }) +
  T(20, 70, 'trong WSL thấy là /mnt/c/Users/an/swp391', { fs: 15, c: 'mu', mono: true }) +
  R(20, 90, 500, 56, { c: 'dim' }) + T(270, 124, 'NTFS (Windows)', { fs: 16, a: 'middle' }) +
  A(270, 146, 270, 196, { c: 'red' }) + T(282, 178, 'cầu 9P chậm', { fs: 14, c: 'red' }) +
  R(20, 198, 500, 56, { c: 'dk' }) + T(270, 232, 'container (-v /mnt/c/…:/app)', { fs: 16, a: 'middle', mono: true }) +
  T(20, 288, 'chậm + KHÔNG có sự kiện inotify ⇒ hot reload chết', { fs: 15, c: 'red' }) +
  R(610, 10, 540, 300, { c: 'grn', fill: 'rgba(63,185,80,.05)' }) +
  T(630, 42, '✅ Mã trong WSL: ~/swp391 (Ubuntu)', { fs: 17, b: true, c: 'grn' }) +
  T(630, 70, 'code . mở từ terminal WSL', { fs: 15, c: 'mu', mono: true }) +
  R(630, 90, 500, 56, { c: 'grn' }) + T(880, 124, 'ext4 của distro WSL (Linux)', { fs: 16, a: 'middle' }) +
  A(880, 146, 880, 196, { c: 'grn' }) + T(892, 178, 'đường ngắn', { fs: 14, c: 'grn' }) +
  R(630, 198, 500, 56, { c: 'dk' }) + T(880, 232, 'container (-v ~/swp391:/app)', { fs: 16, a: 'middle', mono: true }) +
  T(630, 288, 'nhanh + inotify chạy ⇒ nodemon / next dev reload', { fs: 15, c: 'grn' }));

export const slides = S([
  cover({ t: 'Chương 13 — Docker trong vòng lặp phát triển hằng ngày', sub: 'Dev Containers · sửa mã thấy ngay + debugger · CSDL thật cho test · Docker trên Mac &amp; Windows', chap: 'CHƯƠNG 13' }),

  { t: 'Bản đồ chương: Docker không chỉ để deploy', body: mindmap('Vòng lặp dev', 'sửa → chạy → test → sửa', [
    { t: '13.1 Dev Containers', d: 'cả nhóm một môi trường: devcontainer.json trong repo', c: 'dk' },
    { t: '13.2 Hot reload &amp; debug', d: 'bind mount vs compose watch, bẫy node_modules, --inspect', c: 'tea' },
    { t: '13.3 CSDL thật cho test', d: 'Postgres dùng-một-lần, tmpfs, Testcontainers, CI', c: 'amb' },
    { t: '13.4 Mac &amp; Windows', d: 'thật ra là một máy ảo: VirtioFS, WSL2, arm64/amd64, license', c: 'vio' },
  ]) },

  /* ───────────── 13.1 ───────────── */
  { t: 'Dev Container: mã ở máy bạn, CÔNG CỤ ở trong container', body: `${devcPic()}
    ${box('info', 'Không ai phải cài Node 22, psql hay ESLint đúng phiên bản nữa: mở repo là VS Code dựng container theo <code>devcontainer.json</code> rồi làm việc <b>bên trong</b> nó.')}` },

  { t: 'devcontainer.json: vài dòng là cả nhóm chung một môi trường', body: two(
    yaml([
      ['{', ''],
      ['  "name": "swp391-api",', 'tên hiện trên VS Code'],
      ['  "image": "node:22-bookworm-slim",', 'môi trường = ảnh này'],
      ['  "features": { … },', 'ghép thêm công cụ (tuỳ)'],
      ['  "forwardPorts": [3000],', 'VS Code chuyển cổng ra máy'],
      ['  "postCreateCommand": "npm ci",', 'chạy MỘT lần khi tạo'],
      ['  "customizations": { "vscode": {', ''],
      ['    "extensions": ["dbaeumer.vscode-eslint"]', 'cài trong container'],
      ['  } }', ''],
      ['}', ''],
    ], { fs: 15.5 }),
    `${list([
      'File nằm ở <code>.devcontainer/devcontainer.json</code> và được <b>commit</b>.',
      'Mở repo bằng VS Code (có extension Dev Containers) → “Reopen in Container”.',
      'Mã nguồn được gắn vào <code>/workspaces/&lt;tên-thư-mục&gt;</code>.',
      'Sửa file này ⇒ “Rebuild Container” để áp dụng.',
    ])}
    ${box('warn', '<code>forwardPorts</code> là việc của <b>VS Code</b>. Dựng bằng CLI thì cổng KHÔNG được mở — cần <code>appPort</code> hoặc <code>runArgs: ["-p", …]</code>.')}`, 'l') },

  { t: 'Chạy thật bằng CLI: 2,4 s lần đầu, 0,95 s lần sau', body: two(
    term(['$ npx @devcontainers/cli up --workspace-folder .', '… docker run … --mount type=bind,source=…/devc,', '    target=/workspaces/devc … node:22-bookworm-slim', 'Running the postCreateCommand from devcontainer.json...', 'v22.23.2', '10.9.8', '= {"outcome":"success","remoteUser":"root",', '=  "remoteWorkspaceFolder":"/workspaces/devc"}', '# real 2.43 s', '$ npx @devcontainers/cli exec --workspace-folder . pwd', '/workspaces/devc'], { title: 'output thật — máy Mac, @devcontainers/cli 0.89.0' }),
    `${term(['$ docker ps --filter name=dk13-devc \\', '    --format \'{{.Names}} {{.Status}} {{.Ports}}\'', 'dk13-devc Up 8 seconds', '# cột Ports RỖNG: forwardPorts không mở cổng'], { title: 'máy Mac' })}
    ${table(['Lần chạy', 'Thời gian', 'Vì sao'], [
      ['Lần đầu, ảnh có sẵn', '2,43 s', 'tạo container + postCreate'],
      ['Lần sau', '+0,95 s', 'container đã có ⇒ dùng lại'],
      ['Có 1 feature (lần đầu)', '!56,5 s', 'dựng ảnh mới: apt-get cài gói'],
      ['Có feature, cache ấm', '4,9 s', 'BuildKit dùng lại tầng'],
    ], { sm: true })}`, 'l') },

  { t: 'Ba cách khai môi trường: image, Dockerfile, compose', body: `${table(['Khai bằng', 'Dòng trong devcontainer.json', 'Hợp khi', 'Giá phải trả'], [
      ['<b>image</b>', '<code>"image": "node:22-bookworm-slim"</code>', 'Chỉ cần một ngôn ngữ + vài công cụ', '+Nhanh nhất, không build'],
      ['<b>Dockerfile</b>', '<code>"build": { "dockerfile": "Dockerfile" }</code>', 'Cần thêm gói hệ thống (openssl, python cho node-gyp…)', 'Dựng ảnh lần đầu; sửa ⇒ Rebuild'],
      ['<b>compose</b>', '<code>"dockerComposeFile": "compose.yaml",</code><br><code>"service": "app"</code>', 'Cần kèm Postgres/Redis như đồ án thật', '!Phải lo thứ tự khởi động (slide sau)'],
      ['<b>features</b> (ghép thêm)', '<code>"features": { "ghcr.io/devcontainers/features/…": {} }</code>', 'Thêm git, gh, docker-in-docker… không viết Dockerfile', '-Ảnh 349 MB → 641 MB, lần đầu 56 s'],
    ], { sm: true })}
    ${box('tip', 'Bắt đầu bằng <b>image</b>. Chỉ lên Dockerfile khi thiếu gói hệ thống, và chỉ lên compose khi app cần dịch vụ đi kèm. Đo trên máy Mac của khoá, 24/09/2026.')}` },

  { t: 'postCreateCommand chạy TRƯỚC khi Postgres sẵn sàng', body: two(
    `${term(['$ npx @devcontainers/cli up --workspace-folder .', 'Running the postCreateCommand from devcontainer.json...', '! ECONNREFUSED', '! postCreateCommand from devcontainer.json failed', '!   with exit code 1. Skipping any further', '!   user-provided commands.'], { title: 'lần 1 — không healthcheck (máy Mac)' })}
    ${term(['# thêm healthcheck + depends_on: service_healthy', '$ npx @devcontainers/cli up --workspace-folder .', 'Running the postCreateCommand from devcontainer.json...', '= db:5432 mở', '# real 3.84 s'], { title: 'lần 2 — có healthcheck' })}`,
    yaml([
      ['services:', ''],
      ['  app:', 'container bạn làm việc'],
      ['    command: sleep infinity', 'giữ nó sống'],
      ['    depends_on:', ''],
      ['      db: { condition: service_healthy }', 'CHỜ db khoẻ'],
      ['  db:', ''],
      ['    image: postgres:16-alpine', ''],
      ['    tmpfs: [/var/lib/postgresql/data]', 'dev: dữ liệu dùng-một-lần'],
      ['    healthcheck:', ''],
      ['      test: ["CMD", "pg_isready",', ''],
      ['             "-U", "postgres"]', 'xem 13.3: nên thêm -h'],
      ['      interval: 1s', ''],
    ], { fs: 14.5 }), 'l') },

  { t: 'Dev Container đáng dùng khi nào — và khi nào KHÔNG', body: two(
    vs({
      no: { t: 'Không đáng', items: ['Bài tập một file, chạy <code>node a.js</code> là xong', 'Máy yếu 8 GB RAM: máy ảo Docker và VS Code Server cùng giành RAM', 'App iOS/Android, app desktop cần GPU hay màn hình', 'Nhóm không ai dùng VS Code/JetBrains'] },
      yes: { t: 'Rất đáng', items: ['Đồ án nhóm SWP391: 4–5 máy Mac/Windows khác nhau', 'Cần công cụ hệ thống khó cài trên Windows (openssl, make, psql)', 'Người mới vào nhóm: clone → mở → chạy, 10 phút', 'Muốn dùng GitHub Codespaces (cùng file cấu hình)'] },
    }),
    `${table(['', 'Dev Container trên máy', 'GitHub Codespaces'], [
      ['Chạy ở đâu', 'Máy ảo Docker của bạn', 'Máy ảo của GitHub'],
      ['Cần cài Docker', 'Có', '+Không — chỉ cần trình duyệt'],
      ['Giá', 'Miễn phí', '120 giờ-lõi/tháng miễn phí (tài khoản Free, 09/2026)'],
      ['Dùng file', '<code>.devcontainer/</code>', '<code>.devcontainer/</code> — y nguyên'],
    ], { sm: true })}`, 'l') },

  /* ───────────── 13.2 ───────────── */
  { t: 'Hai đường đưa mã mới vào container', body: `${diagram({ w: 1160, h: 330, nodes: [
      { id: 'ed', x: 10, y: 120, w: 230, h: 90, t: 'Bạn bấm Lưu', d: 'src/msg.js trên máy', c: 'blu', ic: '💾' },
      { id: 'bm', x: 380, y: 20, w: 330, h: 100, t: 'bind mount  -v .:/app', d: 'container đọc THẲNG thư mục của bạn\nkhông chép gì cả', c: 'grn' },
      { id: 'cw', x: 380, y: 210, w: 330, h: 100, t: 'compose watch  (action: sync)', d: 'Compose CHÉP file vừa đổi vào container\n/app trong container là bản riêng', c: 'amb' },
      { id: 'rl', x: 850, y: 120, w: 300, h: 90, t: 'Trình theo dõi file', d: 'node --watch · nodemon · next dev\nthấy file đổi ⇒ khởi động lại', c: 'tea' },
    ], edges: [
      { from: 'ed', to: 'bm', t: 'tức thì', c: 'grn' }, { from: 'ed', to: 'cw', t: 'chép', c: 'amb' },
      { from: 'bm', to: 'rl', c: 'grn' }, { from: 'cw', to: 'rl', c: 'amb' },
    ] })}
    ${table(['', 'bind mount', 'compose watch'], [
      ['Hợp với', 'Máy Linux; Mac/Windows khi dự án nhỏ', 'Mac/Windows; dự án nhiều file; cần <code>rebuild</code> khi đổi package.json'],
      ['Bẫy', 'Che mất <code>node_modules</code> của ảnh (slide sau)', 'Bản chép thay file bằng đổi tên ⇒ một số trình theo dõi mất dấu'],
    ], { sm: true })}` },

  { t: 'Bẫy node_modules: bind mount PHỦ lên thư mục của ảnh', body: two(
    nmPic(),
    `${term(['$ docker compose -f compose.bind.yaml logs api', "! Error: Cannot find module 'express'", '! Require stack:', '! - /app/src/server.js', "Failed running 'src/server.js'. Waiting for file", 'changes before restarting...'], { title: 'output thật — máy Mac' })}
    ${yaml([
      ['    volumes:', ''],
      ['      - .:/app', 'mã của bạn'],
      ['      - /app/node_modules', 'volume ẩn danh che lại'],
    ], { fs: 15.5 })}
    ${box('good', 'Volume ẩn danh mới được <b>chép sẵn</b> nội dung <code>/app/node_modules</code> của ảnh ⇒ express có mặt. Dọn: <code>compose down -v</code>.')}`, 'r') },

  { t: 'node_modules cài trên Mac KHÔNG chạy được trong Linux', body: two(
    term(['$ npm i esbuild             # cài trên Mac', '$ ls node_modules/@esbuild/', 'darwin-arm64', '$ docker run --rm -v "$PWD":/app -w /app node:22-alpine \\', '    node -e "require(\'esbuild\').buildSync(…)"', '! Error:', '! You installed esbuild for another platform than the one', "! you're currently using.", '! … the "@esbuild/darwin-arm64" package is present but', '! this platform needs the "@esbuild/linux-arm64"', '! package instead.'], { title: 'output thật — máy Mac' }),
    `${list([
      'Gói có mã máy (esbuild, bcrypt, sharp, Prisma engine…) cài theo <b>hệ điều hành + CPU</b> của nơi chạy <code>npm install</code>.',
      'Mac = <code>darwin-arm64</code>. Container = <code>linux-arm64</code> (hoặc <code>linux-x64</code> trên máy Windows/VPS).',
      'Bind mount cả thư mục ⇒ container dùng nhầm bản của Mac.',
    ])}
    ${box('tip', '<b>Luật:</b> <code>node_modules</code> của container phải được cài <b>trong</b> container (lúc build, hoặc <code>docker compose exec api npm ci</code>) và nằm trong volume riêng.')}`, 'l') },

  { t: 'compose watch: ba hành động cho ba loại thay đổi', body: two(
    yaml([
      ['services:', ''],
      ['  api:', ''],
      ['    build: .', 'watch cần có build'],
      ['    init: true', 'restart nhanh (slide sau)'],
      ['    develop:', ''],
      ['      watch:', ''],
      ['        - action: sync', 'chép file vào'],
      ['          path: ./src', 'trên máy bạn'],
      ['          target: /app/src', 'trong container'],
      ['        - action: rebuild', 'dựng lại ảnh'],
      ['          path: package.json', 'khi thêm thư viện'],
    ], { fs: 15.5 }),
    `${table(['action', 'Làm gì', 'Dùng cho'], [
      ['<code>sync</code>', 'Chép file đổi vào container', 'Mã có trình theo dõi (nodemon, next dev)'],
      ['<code>sync+restart</code>', 'Chép rồi restart container', 'Mã/cấu hình KHÔNG tự reload'],
      ['<code>rebuild</code>', 'Build ảnh mới, thay container', '<code>package.json</code>, Dockerfile'],
    ], { sm: true })}
    ${term(['$ docker compose watch', 'Watch enabled', 'Syncing service "api" after 1 changes were detected', 'Rebuilding service(s) ["api"] after changes were detected...'], { title: 'máy Mac · Compose v5.5.1' })}`, 'l') },

  { t: 'Đo thật: từ lúc Lưu tới lúc thấy chữ mới', body: `${bars([
      { l: 'watch sync+restart', sub: 'không init — chờ SIGTERM vô ích', v: 4.7, txt: '4,7 s', c: 'red' },
      { l: 'watch sync+restart', sub: 'init: true', v: 1.67, txt: '1,67 s', c: 'amb' },
      { l: 'watch sync + nodemon', sub: 'nodemon theo dõi thư mục', v: 0.65, txt: '0,65 s', c: 'grn' },
      { l: 'bind mount + node --watch', sub: 'Docker Desktop chuyển sự kiện file', v: 0.31, txt: '0,31 s', c: 'grn' },
      { l: 'watch rebuild', sub: 'thêm dayjs vào package.json', v: 6.5, txt: '6,5 s', c: 'blu' },
    ], { lw: 330 })}
    ${box('warn', '<b>watch sync + <code>node --watch</code>: chỉ lần sửa ĐẦU TIÊN được nạp</b> — 4 lần sau chờ 20 s vẫn chữ cũ. Compose thay file bằng cách đổi tên, còn <code>node --watch</code> bám theo từng file nên mất dấu. Dùng <code>nodemon</code> (hoặc bind mount).')}
    <p class="c-note">Bốn thanh đầu: trung bình 5 lần sửa; rebuild: 1 lần. Máy Mac M1, Docker Desktop 4.91, app Express nhỏ — 24/09/2026.</p>` },

  { t: 'Debugger: 0.0.0.0 bên trong, 127.0.0.1 bên ngoài', body: two(
    `${term(['$ docker run -p 127.0.0.1:9229:9229 … node --inspect server.js', 'Debugger listening on ws://127.0.0.1:9229/c9d3…', '$ curl localhost:9229/json/list', '! curl: (52) Empty reply from server'], { title: 'SAI — chỉ nghe loopback CỦA CONTAINER' })}
    ${term(['$ docker run -p 127.0.0.1:9229:9229 … \\', '    node --inspect=0.0.0.0:9229 server.js', '$ node inspect localhost:9229', "debug> setBreakpoint('/app/server.js', 4)", 'break in /app/server.js:4', 'debug> exec tong', '+ 6', "debug> exec req.method + ' ' + req.url", "+ 'GET /'", 'debug> exec process.pid', '+ 1'], { title: 'ĐÚNG — output thật, máy Mac (cổng 18132 trong khoá)' })}`,
    `${yaml([
      ['{', '.vscode/launch.json'],
      ['  "type": "node",', ''],
      ['  "request": "attach",', 'gắn vào, không tự chạy'],
      ['  "name": "Gắn vào container",', ''],
      ['  "address": "localhost",', ''],
      ['  "port": 9229,', 'cổng đã -p ra'],
      ['  "localRoot": "${workspaceFolder}",', 'mã trên máy'],
      ['  "remoteRoot": "/app"', 'mã trong container'],
      ['}', ''],
    ], { fs: 14.5 })}
    ${box('bad', 'Luôn <code>-p 127.0.0.1:9229:9229</code>. Mở cổng debug ra mạng = cho người cùng Wi-Fi <b>chạy mã tuỳ ý</b> trong app của bạn.')}`, 'l') },

  /* ───────────── 13.3 ───────────── */
  { t: 'Test tích hợp cần Postgres THẬT — dùng một lần rồi vứt', body: `${steps([
      ['<code>docker compose -f compose.test.yaml up -d --wait</code>', 'bật Postgres trên tmpfs, CHỜ healthcheck xanh — 1,8 s trên máy Mac'],
      ['Seed tự chạy từ <code>/docker-entrypoint-initdb.d</code>', 'file <code>.sql</code>/<code>.sh</code> chạy MỘT lần khi thư mục dữ liệu còn trống'],
      ['<code>DATABASE_URL=… node --test</code>', 'test chạm vào ràng buộc thật: UNIQUE, khoá ngoại, giao dịch'],
      ['<code>docker compose -f compose.test.yaml down</code>', 'tmpfs mất theo container ⇒ lần sau sạch tinh, không volume mồ côi'],
    ], { row: false })}
    ${two(box('bad', '<b>Giả lập CSDL</b> (mock) không bắt được lỗi <code>23505 unique_violation</code>, sai kiểu cột hay migration hỏng — những lỗi làm sập demo đồ án.'),
      box('good', '<b>Postgres thật trong container</b>: khởi động &lt; 1 s, đúng phiên bản production, không đụng CSDL dev của bạn.'))}` },

  { t: 'Postgres khởi động HAI lần — hãy chờ lần thứ hai', body: `${pgTwice()}
    ${two(term(['$ docker logs pg | grep -E "is ready to accept|is shut down"', '… [42] LOG:  database system is ready to accept connections', '… [42] LOG:  database system is shut down', '+ … [1] LOG:  database system is ready to accept connections'], { title: 'output thật — máy Mac, postgres:16-alpine' }),
      yaml([
        ['healthcheck:', ''],
        ['  test: ["CMD", "pg_isready",', ''],
        ['         "-h", "127.0.0.1",', 'ép đi TCP'],
        ['         "-U", "postgres"]', ''],
        ['  interval: 1s', 'đừng để mặc định 30s'],
        ['  retries: 30', ''],
      ], { fs: 14.5 }), 'l')}` },

  { t: 'tmpfs: nhanh 15× trên Linux — không khác gì trên Mac', body: two(
    `<p class="c-cap"><b>pgbench</b> 8 giây, 1 kết nối (mỗi giao dịch một lần COMMIT) — số giao dịch/giây</p>
    ${bars([
      { l: 'Linux · volume trên NVMe', v: 468, txt: '468', c: 'red' },
      { l: 'Linux · tmpfs (RAM)', v: 7328, txt: '7 328', c: 'grn' },
      { l: 'Linux · volume + fsync=off', v: 7214, txt: '7 214', c: 'tea' },
      { l: 'Mac · volume', v: 2745, txt: '2 745', c: 'blu' },
      { l: 'Mac · tmpfs', v: 2120, txt: '2 120', c: 'blu' },
    ], { lw: 290 })}`,
    `${list([
      'Trên Linux, mỗi COMMIT đợi đĩa ghi xong (<code>fsync</code>). RAM thì không phải đợi ⇒ <b>15,7×</b>.',
      'Trên Mac, đĩa của máy ảo Docker Desktop trả lời fsync rất nhanh ⇒ tmpfs không thắng.',
      '<b>Runner CI là Linux</b> — nơi bộ test của bạn chạy nhiều nhất.',
      'Khởi động thì như nhau: ~0,9–1,0 s tới khi TCP sẵn sàng (đo 3 lần mỗi kiểu).',
    ])}
    ${box('bad', 'tmpfs và <code>fsync=off</code> CHỈ cho test. Mất điện = mất sạch — đúng thứ bạn muốn ở test, thảm hoạ ở production.')}`, 'l') },

  { t: 'compose.test.yaml + node --test: từ số 0 tới test xanh', body: two(
    yaml([
      ['name: phongkham-test', ''],
      ['services:', ''],
      ['  db:', ''],
      ['    image: postgres:16-alpine', 'CÙNG bản với production'],
      ['    environment:', ''],
      ['      POSTGRES_PASSWORD: test', ''],
      ['      POSTGRES_DB: phongkham', ''],
      ['    ports: ["127.0.0.1:5433:5432"]', 'tránh đụng 5432 dev'],
      ['    tmpfs: [/var/lib/postgresql/data]', 'không volume nào'],
      ['    volumes:', ''],
      ['      - ./seed:/docker-entrypoint-initdb.d:ro', 'schema + dữ liệu mẫu'],
      ['    healthcheck: …pg_isready -h 127.0.0.1…', ''],
    ], { fs: 14 }),
    term(['$ docker compose -f compose.test.yaml up -d --wait', ' Container dk13-itest-db-1 Started', ' Container dk13-itest-db-1 Waiting', '= Container dk13-itest-db-1 Healthy', '# 1.794 total', '$ DATABASE_URL=postgres://postgres:test@\\', '127.0.0.1:5433/phongkham node --test \\', '    --test-reporter=spec test/lichhen.test.mjs', '= ✔ dữ liệu seed có mặt (12.1ms)', '= ✔ không cho đặt trùng giờ cùng bác sĩ (1.3ms)', 'ℹ pass 2', 'ℹ fail 0', '$ docker compose -f compose.test.yaml down'], { title: 'output thật — máy Mac (khoá dùng cổng 18135)', fs: 14 }), 'r') },

  { t: 'Testcontainers: bộ test tự bật và tự dọn Postgres', body: two(
    `${yaml([
      ["import { PostgreSqlContainer }", ''],
      ["  from '@testcontainers/postgresql';", ''],
      ['', ''],
      ['before(async () => {', ''],
      ["  pgc = await new PostgreSqlContainer(", ''],
      ["      'postgres:16-alpine')", 'ảnh bạn chọn'],
      ["    .withTmpFs({ '/var/lib/postgresql/data': 'rw' })", ''],
      ["    .withCopyDirectoriesToContainer([…seed…])", ''],
      ['    .start();', 'chờ healthcheck giùm'],
      ['  db = new pg.Client({', ''],
      ['    connectionString: pgc.getConnectionUri() });', 'cổng ngẫu nhiên'],
      ['});', ''],
      ['after(() => pgc.stop());', 'xoá container'],
    ], { fs: 13.5, lang: 'js' })}`,
    `${term(['$ npm i -D pg testcontainers @testcontainers/postgresql', '$ node --test --test-reporter=spec test/tc.test.mjs', '+ Postgres sẵn sàng sau 1052 ms ở localhost:18136', '= ✔ dữ liệu seed có mặt (1073.4ms)', '= ✔ không cho đặt trùng giờ cùng bác sĩ (2.6ms)', 'ℹ pass 2'], { title: 'output thật — máy Mac, testcontainers 12.1.0 (khoá ghim cổng 18136)', fs: 14 })}
    ${table(['Cách', 'Ai bật DB', 'Hợp khi'], [
      ['compose.test.yaml', 'Bạn / script npm', 'Cả nhóm dùng chung một DB test'],
      ['Testcontainers', '+Chính mã test', 'Mỗi bộ test một DB riêng, chạy song song'],
      ['service container CI', 'GitHub Actions', 'Chỉ trong CI (xem khoá GitHub Actions)'],
    ], { sm: true })}`, 'r') },

  { t: 'Trong CI: service container thay cho compose', body: two(
    yaml([
      ['jobs:', '.github/workflows/test.yml'],
      ['  test:', ''],
      ['    runs-on: ubuntu-latest', 'máy Linux ⇒ tmpfs có lợi'],
      ['    services:', ''],
      ['      postgres:', ''],
      ['        image: postgres:16-alpine', ''],
      ['        env: { POSTGRES_PASSWORD: test }', ''],
      ['        ports: ["5432:5432"]', ''],
      ['        options: >-', 'cờ của docker create'],
      ['          --health-cmd "pg_isready -h 127.0.0.1"', ''],
      ['          --health-interval 2s --health-retries 20', ''],
      ['          --tmpfs /var/lib/postgresql/data', ''],
      ['    steps:', ''],
      ['      - run: npm ci && npm test', 'DATABASE_URL trỏ localhost'],
    ], { fs: 14 }),
    `${list([
      'Runner bật container theo <code>services:</code>, <b>chờ healthcheck xanh</b>, rồi mới chạy các bước.',
      'Job xong là container bị xoá — đúng tinh thần dùng-một-lần.',
      'Ở máy bạn: chạy cùng bộ test bằng <code>compose.test.yaml</code> — cùng ảnh, cùng seed.',
    ])}
    ${box('info', 'Workflow viết đầy đủ, chưa chạy lên GitHub trong bài này. Chi tiết runner, cache, matrix: khoá <b>/courses/github-actions</b>.')}`, 'l') },

  /* ───────────── 13.4 ───────────── */
  { t: 'Trên Mac và Windows, Docker chạy trong một MÁY ẢO Linux', body: two(
    vmPic(),
    `${term(['$ docker info', ' Operating System: Docker Desktop', ' Kernel Version: 7.0.12-linuxkit', ' Architecture: aarch64', ' CPUs: 10', '+ Total Memory: 7.748GiB        # Mac có 32 GB', '$ ls -lsh ~/Library/Containers/com.docker.docker/\\', '    Data/vms/0/data/Docker.raw', '… 926G … Docker.raw           # cỡ “khai”', '$ du -sh …/Docker.raw', '+ 75G                          # cỡ THẬT trên SSD'], { title: 'output thật — máy Mac' })}
    ${box('warn', 'Container chỉ thấy RAM/CPU <b>của máy ảo</b>. Đĩa ảo là file thưa (sparse): <code>ls</code> báo 926G, chiếm thật 75G. Dọn nó bằng <code>docker system df</code> + prune có chủ đích (Ch.11).')}`, 'l') },

  { t: 'Bind mount đi qua VirtioFS: file nhỏ chậm tới 15 lần', body: two(
    `<p class="c-cap">3 000 file .js nhỏ, Node 22 trong container — mili giây (trung bình 3 lần)</p>
    ${table(['Thư mục', 'Ghi', 'stat', 'Đọc', 'Xoá'], [
      ['-bind mount (virtiofs)', '808', '150', '308', '442'],
      ['+volume (ext4 trong máy ảo)', '53', '9', '20', '34'],
      ['tầng ghi của container', '78', '10', '20', '38'],
      ['Mac gốc (APFS, không Docker)', '218', '8', '54', '152'],
    ], { center: [1, 2, 3, 4] })}
    ${term(['$ docker run --rm -v "$PWD":/w -v data:/v alpine \\', '    grep -E " /w | /v " /proc/mounts', '/dev/vda1 /v ext4 rw,relatime,discard 0 0', '! virtiofs2 /w virtiofs rw,nosuid,nodev,…'], { title: 'output thật — máy Mac' })}`,
    `${list([
      '<code>npm ci</code>, <code>next build</code>, Prisma generate đều là <b>hàng nghìn file nhỏ</b> ⇒ đặt chúng trong volume.',
      'Mã nguồn bạn sửa (vài trăm file) để bind mount vẫn ổn.',
      'VirtioFS là mặc định của Docker Desktop (tài liệu Docker: nhanh hơn tới 98% so với cách chia sẻ file cũ).',
    ])}
    ${box('tip', 'Công thức chuẩn: <code>- .:/app</code> + <code>- /app/node_modules</code> + <code>- /app/.next</code> ⇒ mã đi bind mount, rác build ở trong máy ảo.')}`, 'l') },

  { t: 'Windows + WSL2: để mã trong hệ file Linux, không ở /mnt/c', body: `${wslPic()}
    ${two(box('info', 'Tài liệu Docker: container chỉ nhận sự kiện inotify khi file gốc <b>nằm trong hệ file Linux</b> của WSL. Mở mã từ đó: <code>cd ~/swp391 &amp;&amp; code .</code> (VS Code tự nối vào WSL).'),
      box('warn', 'Chưa đo trên Windows trong khoá này (không có máy). Chuyển thư mục: <code>git clone</code> lại bên trong Ubuntu của WSL — đừng copy từ ổ C (mất quyền thực thi, sai xuống dòng CRLF).'))}` },

  { t: 'host.docker.internal: Mac có sẵn, Linux phải xin thêm', body: two(
    `${term(['# Mac: python -m http.server 18137 --bind 127.0.0.1', '$ docker run --rm alpine sh -c \\', '  \'getent hosts host.docker.internal;', '   wget -qO- http://host.docker.internal:18137/\'', '192.168.65.254  host.docker.internal', '= xin chào từ máy Mac', '$ docker run --rm alpine wget -qO- -T 2 http://localhost:18137/', "! wget: can't connect to remote host: Connection refused"], { title: 'output thật — máy Mac' })}
    ${term(['$ docker run --rm alpine getent hosts host.docker.internal', '# (không in gì) — echo $? ⇒ 2: tên không tồn tại', '$ docker run --rm --add-host=host.docker.internal:host-gateway \\', '    alpine getent hosts host.docker.internal', '+ 172.17.0.1      host.docker.internal'], { title: 'output thật — máy Linux, Docker 29.6' })}`,
    `${list([
      '<code>localhost</code> trong container là <b>chính container</b> (Ch.8) — không phải máy bạn.',
      'Docker Desktop (Mac/Windows) tự có tên <code>host.docker.internal</code>, và chuyển được tới cả dịch vụ chỉ nghe 127.0.0.1 của Mac.',
      'Linux: thêm <code>--add-host=host.docker.internal:host-gateway</code> (compose: <code>extra_hosts</code>), và dịch vụ trên máy phải nghe trên cầu <code>docker0</code>, không chỉ 127.0.0.1.',
    ])}
    ${box('tip', 'Ghi <code>extra_hosts: ["host.docker.internal:host-gateway"]</code> vào compose ⇒ cùng một file chạy được cả Mac, Windows lẫn Linux.')}`, 'l') },

  { t: 'arm64 và amd64: --platform, và Rosetta dịch giùm', body: two(
    `${term(['$ docker run --rm alpine:3 uname -m', 'aarch64', '$ docker run --rm --platform linux/amd64 alpine:3 uname -m', '+ x86_64', '$ docker run --rm --platform linux/amd64 alpine:3 \\', '    head -2 /proc/cpuinfo | tail -1', 'vendor_id\t: VirtualApple        # CPU “ảo” của Rosetta 2', '$ docker image ls alpine:3 --tree', '… ├─ linux/amd64    12.9MB', '  ├─ linux/arm64/v8 13.5MB'], { title: 'output thật — máy Mac M1' })}`,
    `${table(['Tình huống', 'Làm gì'], [
      ['Ảnh chỉ có bản amd64 (ảnh cũ, ảnh nội bộ)', '<code>--platform linux/amd64</code> — qua Rosetta; đo sha256 500 MB: 3,05 s → 3,40 s'],
      ['Dựng trên Mac M1, chạy trên VPS amd64', 'Build đa nền tảng (<code>buildx --platform</code>, Ch.15) hoặc build trên CI'],
      ['Bạn cùng nhóm máy Windows Intel', 'Ảnh chính thức đa nền tảng ⇒ không cần làm gì'],
      ['Gói native trong node_modules', 'Cài trong container đúng nền tảng (13.2)'],
    ], { sm: true })}
    ${box('warn', '<code>exec format error</code> khi chạy ảnh = ảnh sai kiến trúc CPU. Kiểm: <code>docker image inspect -f \'{{.Architecture}}\' &lt;ảnh&gt;</code>.')}`, 'l') },

  { t: 'Docker Desktop, OrbStack hay Colima?', body: `${table(['', 'Docker Desktop', 'OrbStack (chỉ Mac)', 'Colima (Mac + Linux)'], [
      ['Giá (tính đến 09/2026)', 'Miễn phí: cá nhân, học tập, OSS phi thương mại, công ty &lt; 250 người <b>và</b> &lt; 10 triệu USD/năm', 'Miễn phí cho cá nhân phi thương mại; Pro 8 USD/người/tháng', '+Mã nguồn mở MIT, miễn phí'],
      ['Có giao diện', '+Có', '+Có, nhẹ', '-Chỉ dòng lệnh'],
      ['Chạy trên Windows', '+Có (WSL2)', '-Không', '-Không'],
      ['Đổi RAM/CPU máy ảo', 'Settings → Resources', 'Settings của app', '<code>colima start --cpu 4 --memory 6</code>'],
      ['Chia sẻ file từ Mac', 'VirtioFS (mặc định)', 'VirtioFS + bộ đệm riêng', 'chọn lúc <code>colima start</code>'],
      ['amd64 trên M1', 'Rosetta (tuỳ chọn trong Settings)', 'Rosetta', '<code>--vm-type=vz --vz-rosetta</code>'],
    ], { sm: true })}
    ${two(box('info', 'Sinh viên dùng cho học tập và đồ án ⇒ Docker Desktop miễn phí. Đi thực tập ở công ty lớn: hỏi công ty đã mua giấy phép chưa.'),
      box('tip', 'Cả ba đều nói cùng một <code>docker</code> CLI và chạy cùng file compose. Đổi qua lại bằng <code>docker context use &lt;tên&gt;</code>.'))}` },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 13', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ["<code>Cannot find module 'express'</code> khi chạy với <code>-v .:/app</code>", 'Bind mount che <code>node_modules</code> của ảnh', 'Thêm volume <code>- /app/node_modules</code>'],
    ['<code>installed esbuild for another platform</code>', 'node_modules cài trên Mac đem vào Linux', 'Cài deps trong container'],
    ['Sửa lần 1 thì reload, lần 2 thì không', 'compose watch sync + <code>node --watch</code>', 'Dùng nodemon, hoặc bind mount'],
    ['<code>sync+restart</code> mất ~5 s mỗi lần lưu', 'PID 1 bỏ qua SIGTERM, Docker chờ rồi mới giết', '<code>init: true</code> hoặc bắt SIGTERM'],
    ['<code>curl: (52) Empty reply</code> tới cổng 9229', '<code>--inspect</code> chỉ nghe 127.0.0.1 của container', '<code>--inspect=0.0.0.0:9229</code> + <code>-p 127.0.0.1:…</code>'],
    ['postCreateCommand / test báo <code>ECONNREFUSED</code>', 'Postgres chưa lên hẳn (còn máy chủ tạm)', 'healthcheck <code>pg_isready -h 127.0.0.1</code> + chờ'],
    ['npm ci trong container chậm như rùa trên Mac/Windows', 'Hàng nghìn file qua bind mount / <code>/mnt/c</code>', 'node_modules trong volume; mã trong WSL'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 13', body: table(['Muốn…', 'Gõ'], [
    ['Dựng dev container không cần VS Code', '<code>npx @devcontainers/cli up --workspace-folder .</code>'],
    ['Chạy lệnh trong dev container', '<code>npx @devcontainers/cli exec --workspace-folder . npm test</code>'],
    ['Sửa mã tự đồng bộ + dựng lại khi đổi deps', '<code>docker compose watch</code> (khai <code>develop.watch</code>)'],
    ['Giữ node_modules của container', '<code>volumes: [".:/app", "/app/node_modules"]</code>'],
    ['Gắn debugger Node', '<code>node --inspect=0.0.0.0:9229</code> + <code>-p 127.0.0.1:9229:9229</code>'],
    ['Postgres dùng-một-lần cho test', '<code>docker run --rm -d --tmpfs /var/lib/postgresql/data -e POSTGRES_PASSWORD=test -p 127.0.0.1:5433:5432 postgres:16-alpine</code>'],
    ['Bật DB test và CHỜ nó khoẻ', '<code>docker compose -f compose.test.yaml up -d --wait</code>'],
    ['Gọi dịch vụ trên máy từ container', '<code>host.docker.internal</code> (+ <code>--add-host=host.docker.internal:host-gateway</code> trên Linux)'],
    ['Chạy ảnh amd64 trên Mac M1', '<code>docker run --platform linux/amd64 …</code>'],
    ['Máy ảo Docker có bao nhiêu RAM/CPU', '<code>docker info --format \'{{.NCPU}} {{.MemTotal}}\'</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 13 (45 phút)', body: `
    ${steps([
      ['Viết <code>.devcontainer/devcontainer.json</code> cho một repo Node và dựng bằng <code>npx @devcontainers/cli up</code>', 'đọc dòng <code>docker run … --mount type=bind</code> trong log: mã được gắn vào đâu?'],
      ['Gây bẫy <code>Cannot find module</code> bằng <code>-v .:/app</code>, rồi sửa bằng volume <code>/app/node_modules</code>', 'giải thích vì sao volume mới lại có sẵn express'],
      ['Bật <code>docker compose watch</code>, sửa một file, đo thời gian thấy chữ mới — có và không có <code>init: true</code>', 'con số của bạn so với 4,7 s / 1,67 s?'],
      ['Đặt một breakpoint trong handler qua cổng 9229 đã <code>-p 127.0.0.1</code>', 'bằng VS Code “Attach” hoặc <code>node inspect</code>'],
      ['Viết <code>compose.test.yaml</code> (tmpfs + seed + healthcheck -h) và một test chạm ràng buộc UNIQUE', '<code>up -d --wait</code> → test xanh → <code>down</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> test xanh trên DB mới tinh mỗi lần chạy, và <code>docker ps -a</code> + <code>docker volume ls -f dangling=true</code> không còn thứ gì của bạn sau khi dọn.')}` },
]);
