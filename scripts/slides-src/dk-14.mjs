/**
 * Docker · Deck dk-14 — Chương 14: Docker cho mọi việc (công cụ, CSDL một lệnh, tự host, GPU & AI).
 *
 * MỌI output terminal trên slide là output THẬT, chạy 24/09/2026:
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0, arm64
 *   • "máy Linux" = Fedora 44, Docker Engine 29.6.2, amd64, GPU RTX 3060 12 GB (driver 610.43),
 *                   KHÔNG cài NVIDIA Container Toolkit
 * Tên đối tượng trong output mang tiền tố dk14- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 * Phần Ollama / Docker Model Runner KHÔNG chạy model thật (máy GPU đang bận việc khác) — slide ghi rõ.
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, list, mindmap, layers, host, term as dkTerm, diagram, yaml, bars, esc, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });

export const deck = { key: 'dk-14', code: 'DOCKER · CHƯƠNG 14', title: 'Docker cho mọi việc', sub: 'Docker · Chương 14' };

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

/* Slide 3 — thư mục của bạn đi vào container dùng-xong-vứt */
const mountPic = () => sv(560, 400,
  R(6, 20, 250, 300, { c: 'tea', fill: 'rgba(45,212,191,.06)' }) +
  T(131, 50, 'MÁY BẠN', { fs: 17, a: 'middle', c: 'tea', b: true }) +
  T(131, 74, '~/thu-docker/tools', { fs: 15, a: 'middle', mono: true, c: 'mu' }) +
  ['demo.mp4', 'ghi-chu.md', 'diem.csv'].map((f, i) => R(30, 96 + i * 52, 202, 40, { c: 'dim', r: 8, sw: 2 }) + T(131, 122 + i * 52, f, { fs: 16, a: 'middle', mono: true })).join('') +
  T(131, 290, 'không cài ffmpeg, pandoc…', { fs: 14.5, a: 'middle', c: 'mu' }) +
  R(300, 20, 250, 300, { c: 'dk', dash: true, fill: 'rgba(36,150,237,.06)' }) +
  T(425, 50, 'CONTAINER --rm', { fs: 17, a: 'middle', c: 'dk', b: true }) +
  T(425, 74, 'ảnh có sẵn công cụ', { fs: 15, a: 'middle', c: 'mu' }) +
  R(322, 96, 206, 144, { c: 'amb', fill: '#0d1628', r: 10 }) +
  T(425, 124, '/w  (-w /w)', { fs: 17, a: 'middle', mono: true, b: true, c: 'amb' }) +
  T(425, 152, '= chính thư mục', { fs: 15, a: 'middle' }) + T(425, 174, 'bên trái, không', { fs: 15, a: 'middle' }) + T(425, 196, 'phải bản chép', { fs: 15, a: 'middle' }) +
  T(425, 268, 'chạy xong ⇒ tự xoá', { fs: 15, a: 'middle', c: 'red' }) +
  A(236, 170, 318, 170, { c: 'amb' }) + A(318, 196, 236, 196, { c: 'amb' }) +
  T(277, 160, '-v', { fs: 15, a: 'middle', c: 'amb', mono: true, b: true }) +
  T(280, 360, 'Kết quả (demo.gif, ghi-chu.html) nằm lại ở MÁY BẠN; container thì biến mất.', { fs: 15, a: 'middle', c: 'grn' }));

/* Slide 12 — vì sao initdb chỉ chạy một lần */
const initFlow = () => sv(1120, 250,
  R(0, 80, 210, 80, { c: 'dk' }) + T(105, 112, 'container khởi động', { fs: 16, a: 'middle', b: true }) + T(105, 136, 'docker-entrypoint.sh', { fs: 13.5, a: 'middle', mono: true, c: 'mu' }) +
  A(210, 120, 290, 120) +
  R(290, 70, 250, 100, { c: 'amb' }) + T(415, 104, 'thư mục dữ liệu', { fs: 16, a: 'middle', b: true }) + T(415, 128, '/var/lib/postgresql/data', { fs: 13, a: 'middle', mono: true, c: 'mu' }) + T(415, 150, 'đã có CSDL chưa?', { fs: 15, a: 'middle', c: 'amb' }) +
  A(540, 100, 640, 40, { c: 'grn' }) + T(588, 52, 'RỖNG', { fs: 14, a: 'middle', c: 'grn', b: true }) +
  A(540, 140, 640, 200, { c: 'red' }) + T(588, 196, 'ĐÃ CÓ', { fs: 14, a: 'middle', c: 'red', b: true }) +
  R(640, 4, 470, 92, { c: 'grn' }) + T(660, 34, 'initdb: tạo user, CSDL từ biến môi trường', { fs: 15.5, b: true }) + T(660, 58, 'chạy /docker-entrypoint-initdb.d/*.sql, *.sh', { fs: 14.5, mono: true, c: 'mu' }) + T(660, 82, 'theo thứ tự tên file: 01-…, 02-…', { fs: 14.5, c: 'mu' }) +
  R(640, 156, 470, 92, { c: 'red' }) + T(660, 186, '“Skipping initialization”', { fs: 15.5, b: true, mono: true }) + T(660, 210, 'POSTGRES_PASSWORD mới, file .sql mới', { fs: 14.5, c: 'mu' }) + T(660, 234, '⇒ bị BỎ QUA, không báo lỗi', { fs: 14.5, c: 'red' }));

/* Slide 16 — chuỗi chứng chỉ của tls internal */
const caChain = () => sv(600, 330,
  R(10, 10, 580, 70, { c: 'vio' }) + T(30, 40, 'Caddy Local Authority - 2026 ECC Root', { fs: 16, b: true }) + T(30, 64, 'CA riêng, sinh trong volume /data · hạn tới 08/2036', { fs: 14, c: 'mu' }) +
  A(300, 80, 300, 120, { c: 'vio' }) +
  R(10, 120, 580, 70, { c: 'blu' }) + T(30, 150, 'Caddy Local Authority - ECC Intermediate', { fs: 16, b: true }) + T(30, 174, 'CA trung gian, ký chứng chỉ cho từng tên miền', { fs: 14, c: 'mu' }) +
  A(300, 190, 300, 230, { c: 'blu' }) +
  R(10, 230, 580, 70, { c: 'grn' }) + T(30, 260, 'vault.localhost', { fs: 16, b: true, mono: true }) + T(30, 284, 'chứng chỉ lá · chỉ sống 12 GIỜ · Caddy tự gia hạn', { fs: 14, c: 'mu' }) +
  T(300, 324, 'trình duyệt / curl chỉ tin nếu bạn cho nó tin cái Root ở trên', { fs: 14, a: 'middle', c: 'amb' }));

/* Slide 21 — đường đi của GPU vào container */
const gpuPath = () => sv(1130, 330,
  R(0, 250, 1130, 70, { c: 'red', fill: 'rgba(255,92,108,.08)' }) + T(565, 280, 'Nhân Linux + DRIVER NVIDIA của máy chủ (610.43)', { fs: 18, a: 'middle', b: true }) + T(565, 304, '/dev/nvidia0 · /dev/nvidiactl · /dev/nvidia-uvm · libcuda.so trên máy chủ', { fs: 14.5, a: 'middle', mono: true, c: 'mu' }) +
  R(0, 120, 520, 104, { c: 'amb' }) + T(20, 152, 'NVIDIA Container Toolkit', { fs: 18, b: true, c: 'amb' }) + T(20, 178, 'nvidia-ctk cdi generate ⇒ /var/run/cdi/nvidia.yaml', { fs: 14.5, mono: true, c: 'mu' }) + T(20, 202, '“muốn GPU thì gắn những file nào vào”', { fs: 14.5, c: 'mu' }) +
  A(260, 224, 260, 248, { c: 'amb' }) +
  R(600, 120, 530, 104, { c: 'dk', dash: true, fill: 'rgba(36,150,237,.06)' }) + T(620, 152, 'container: docker run --gpus all …', { fs: 16, b: true, mono: true }) + T(620, 178, 'thấy /dev/nvidia0 + libcuda.so được gắn vào', { fs: 14.5, c: 'mu' }) + T(620, 202, 'ảnh CHỈ cần thư viện CUDA phía người dùng', { fs: 14.5, c: 'mu' }) +
  A(520, 172, 596, 172, { c: 'grn' }) + T(558, 160, 'gắn', { fs: 14, a: 'middle', c: 'grn', b: true }) +
  R(0, 0, 1130, 92, { c: 'dim', fill: '#0d1628' }) + T(20, 32, 'dockerd nhận --gpus all', { fs: 17, b: true, mono: true }) +
  T(20, 60, 'Docker 29: hỏi CDI “có GPU nào đăng ký không?” — chưa có file CDI nào ⇒', { fs: 15, c: 'mu' }) +
  T(20, 82, 'failed to discover GPU vendor from CDI: no known GPU vendor found', { fs: 15, mono: true, c: 'red' }) +
  A(760, 92, 760, 118, { c: 'mu', dash: true }));

/* Slide 23 — Mac: GPU ở ngoài máy ảo */
const macGpu = () => sv(1130, 300,
  R(0, 0, 1130, 300, { c: 'tea', fill: 'rgba(45,212,191,.04)' }) + T(20, 30, 'macOS trên chip M1 — GPU Apple chỉ nói Metal', { fs: 17, b: true, c: 'tea' }) +
  R(20, 50, 520, 230, { c: 'dk', dash: true, fill: 'rgba(36,150,237,.06)' }) + T(40, 80, 'Máy ảo Linux của Docker Desktop', { fs: 16, b: true, c: 'dk' }) +
  R(40, 100, 480, 70, { c: 'dim', r: 9 }) + T(60, 130, 'container ollama/ollama', { fs: 15.5, mono: true }) + T(60, 154, 'chỉ thấy CPU ảo — KHÔNG có GPU', { fs: 14.5, c: 'red' }) +
  T(40, 206, 'Docker Desktop chỉ cho GPU vào container', { fs: 14.5, c: 'mu' }) + T(40, 228, 'trên Windows + WSL2 + NVIDIA.', { fs: 14.5, c: 'mu' }) +
  R(590, 50, 520, 105, { c: 'grn' }) + T(610, 80, 'Ollama bản cài cho macOS', { fs: 16, b: true }) + T(610, 106, 'tiến trình macOS thường ⇒ dùng Metal', { fs: 14.5, c: 'mu' }) + T(610, 130, 'container gọi nó qua host.docker.internal', { fs: 14.5, c: 'mu', mono: false }) +
  R(590, 175, 520, 105, { c: 'grn' }) + T(610, 205, 'Docker Model Runner', { fs: 16, b: true }) + T(610, 231, 'llama.cpp chạy NGAY trên macOS (ngoài VM)', { fs: 14.5, c: 'mu' }) + T(610, 255, 'container gọi model-runner.docker.internal', { fs: 14.5, c: 'mu' }) +
  A(540, 135, 586, 100, { c: 'grn' }) + A(540, 150, 586, 220, { c: 'grn' }));

export const slides = S([
  cover({ t: 'Chương 14 — Docker cho mọi việc', sub: 'Công cụ không cần cài · CSDL một lệnh · tự host có HTTPS · GPU &amp; AI cục bộ', chap: 'CHƯƠNG 14' }),

  { t: 'Bản đồ chương: Docker như một hộp đồ nghề', body: mindmap('Docker cho mọi việc', 'không chỉ để deploy app của bạn', [
    { t: '14.1 Công cụ không cần cài', d: 'docker run --rm -v "$PWD":/w — node, ffmpeg, pandoc, sqlite', c: 'dk' },
    { t: '14.2 CSDL một lệnh', d: 'Postgres, MySQL, Mongo, Redis, MinIO, Mailpit, RabbitMQ', c: 'tea' },
    { t: '14.3 Tự host', d: 'Caddy tự cấp HTTPS · Vaultwarden, Uptime Kuma, n8n · sao lưu', c: 'amb' },
    { t: '14.4 GPU &amp; AI cục bộ', d: 'NVIDIA Container Toolkit · Ollama · Docker Model Runner', c: 'vio' },
  ]) },

  /* ───────────── 14.1 ───────────── */
  { t: 'Một lệnh thay cho một lần cài', body: two(
    `${yaml([
      ['docker run', 'chạy một container'],
      ['  --rm', 'xong việc thì tự xoá'],
      ['  -v "$PWD":/w', 'thư mục hiện tại → /w'],
      ['  -w /w', 'đứng ở /w khi chạy lệnh'],
      ['  mwader/static-ffmpeg:9.0.2', 'ảnh CÓ SẴN công cụ, ghim bản'],
      ['  -i demo.mp4 demo.gif', 'tham số của ffmpeg'],
    ], { fs: 17, lang: 'docker' })}
    ${box('tip', 'Thêm <code>-it</code> khi công cụ cần hỏi đáp (REPL, <code>psql</code>). Trong script/CI thì BỎ <code>-t</code>, kẻo gặp <code>cannot attach stdin to a TTY-enabled container</code>.')}`,
    mountPic(), 'r') },

  { t: 'Hai bản Node cạnh nhau — không đụng tới bản đã cài', body: `
    ${term(['$ cat ver.js', 'console.log(`Node ${process.version} | Iterator: ${typeof Iterator} | Set.union: ${typeof new Set().union}`);', '$ docker run --rm -v "$PWD":/w -w /w node:20-alpine node ver.js', '! Node v20.20.2 | Iterator: undefined | Set.union: undefined', '$ docker run --rm -v "$PWD":/w -w /w node:22-alpine node ver.js', '= Node v22.23.2 | Iterator: function | Set.union: function', '$ node ver.js          # bản cài bằng nvm trên Mac', 'Node v22.21.0 | Iterator: function | Set.union: function'], { title: 'output thật — máy Mac' })}
    ${kpis([{ v: '0,01 s', l: '<code>node -v</code> cài sẵn', c: 'grn' }, { v: '0,24 s', l: 'qua container (Mac)', c: 'blu' }, { v: '0,45 s', l: 'qua container (Linux nhà)', c: 'amb' }, { v: '49 MB', l: 'tải về cho node:20-alpine', c: 'vio' }])}` },

  { t: 'Hộp đồ nghề: mỗi việc một ảnh nhỏ, ghim phiên bản', body: two(
    `${table(['Việc', 'Ảnh (đã ghim tag)', 'Tải / đĩa'], [
      ['Cắt, đổi video', '<code>mwader/static-ffmpeg:9.0.2</code>', '122 / 381 MB'],
      ['Markdown → HTML, Word', '<code>pandoc/minimal:3.11</code>', '33 / 190 MB'],
      ['CSV → truy vấn SQL', '<code>keinos/sqlite3:3.53.4</code>', '5 / 16 MB'],
      ['Soát Dockerfile', '<code>hadolint/hadolint:v2.15.1-alpine</code>', '18 / 87 MB'],
      ['Python dùng một lần', '<code>python:3.12-alpine</code>', '19 / 80 MB'],
    ], { sm: true })}
    ${box('info', '“Tải” = CONTENT SIZE, “đĩa” = DISK USAGE trong <code>docker images</code> của Docker 29 (máy Mac, arm64).')}`,
    term(['$ docker run --rm -v "$PWD":/w -w /w \\', '    keinos/sqlite3:3.53.4 sqlite3 :memory: \\', '    -cmd ".mode csv" -cmd ".import diem.csv diem" \\', '    -cmd ".mode table" \\', '    "select ten, diem from diem', '     where cast(diem as real) >= 7 order by 2 desc;"', '+-------+------+', '|  ten  | diem |', '+-------+------+', '| Cuong | 9    |', '| An    | 8.5  |', '+-------+------+'], { title: 'máy Mac — không cài sqlite', fs: 14 }), '') },

  { t: 'Trên Linux, quên -u là file thuộc root', body: two(
    term(['$ docker run --rm -v "$PWD":/w -w /w alpine:3 sh -c \\', '    "echo xin chao > bao-cao.txt; mkdir dist; \\', '     echo x > dist/app.js"', '$ ls -l', '+ -rw-r--r--. 1 root root  9 bao-cao.txt', '+ drwxr-xr-x. 2 root root 60 dist', '$ echo them >> bao-cao.txt', '! zsh:1: permission denied: bao-cao.txt', '$ rm -rf dist', '! rm: cannot remove \'dist/app.js\': Permission denied', '# sửa: chạy bằng CHÍNH uid:gid của bạn', '$ docker run --rm -u "$(id -u):$(id -g)" \\', '    -v "$PWD":/w -w /w alpine:3 id', '= uid=1000 gid=1000 groups=1000'], { title: 'output thật — máy Linux (không có sudo)', fs: 14 }),
    `${table(['Máy', 'File container tạo ra thuộc về'], [
      ['Linux (Engine thật)', '-<b>root</b> — uid 0 trong = uid 0 ngoài'],
      ['Mac (Docker Desktop)', '+<b>bạn</b> — lớp chia sẻ file tự đổi chủ'],
      ['Windows + WSL2', '!như Linux nếu mã nằm trong WSL'],
    ], { sm: true })}
    ${box('warn', 'Đã lỡ tay? Không cần sudo — để chính một container root trả lại quyền:<br><code>docker run --rm -v "$PWD":/w alpine:3 \\</code><br><code>&nbsp;&nbsp;chown -R "$(id -u):$(id -g)" /w</code>')}`, 'l') },

  { t: 'Gói lệnh dài thành hàm zsh — và giữ cache lại', body: two(
    `${yaml([
      ['# ~/.zshrc', ''],
      ['node20() {', 'tên lệnh bạn gõ'],
      ['  docker run --rm -it \\', ''],
      ['    -v "$PWD":/w -w /w \\', 'thư mục hiện tại'],
      ['    -v dk-npm:/root/.npm \\', 'cache npm SỐNG LẠI'],
      ['    node:20-alpine node "$@"', '"$@" = mọi tham số'],
      ['}', ''],
    ], { fs: 16 })}
    ${term(['$ node20 -v', 'v20.20.2', '$ type node20', 'node20 is a shell function from zsh'], { title: 'máy Mac' })}`,
    `${bars([
      { l: 'npx cowsay — không cache', sub: 'lần 1', v: 2.73, txt: '2,73 s', c: 'red' },
      { l: 'npx cowsay — không cache', sub: 'lần 2', v: 2.62, txt: '2,62 s', c: 'red' },
      { l: 'có volume cache npm', sub: 'lần 1 (đổ đầy cache)', v: 2.36, txt: '2,36 s', c: 'amb' },
      { l: 'có volume cache npm', sub: 'lần 2', v: 0.97, txt: '0,97 s', c: 'grn' },
    ], { lw: 260 })}
    ${box('info', 'Container <code>--rm</code> quên sạch sau mỗi lần chạy — kể cả gói npm vừa tải. Một volume có tên cho thư mục cache giữ lại thứ đáng giữ.')}`, 'l') },

  { t: 'Khi nào dùng container, khi nào cài thật', body: `
    ${table(['Câu hỏi', 'Cài thật khi…', 'Chạy bằng container khi…'], [
      ['Dùng thường xuyên cỡ nào?', 'gõ hàng trăm lần mỗi ngày: <code>git</code>, <code>node</code> của dự án chính', '+vài lần mỗi tháng: ffmpeg, pandoc, <code>aws</code>'],
      ['Cần phiên bản nào?', 'đúng bản đang cài là đủ', '+cần bản KHÁC (Node 20 cho đồ án cũ, Postgres 14 của thầy)'],
      ['Ai khác phải ra cùng kết quả?', 'chỉ mình bạn', '+cả nhóm và CI: cùng ảnh, cùng tag'],
      ['Có đọc/ghi hàng vạn file không?', '!có — bind mount trên Mac/Windows chậm hơn đĩa thật', 'ít file: không ai nhận ra chênh lệch'],
      ['Editor có phải gọi thẳng nó không?', '!có — ESLint, TypeScript server, Prettier trong VS Code', 'không — chỉ bạn gõ ở terminal'],
      ['Cần GPU (trên Mac) hay giao diện đồ hoạ?', '!có — container trên Mac không có GPU, không có cửa sổ', 'không'],
    ])}
    ${box('tip', 'Quy tắc ngón tay cái: công cụ bạn <b>dùng hằng ngày</b> thì cài; công cụ bạn <b>cần đúng một lần</b> hoặc cần <b>đúng một phiên bản</b> thì mượn qua container.')}` },

  /* ───────────── 14.2 ───────────── */
  { t: 'Tám dịch vụ, tám lệnh — mỗi cái ăn bao nhiêu RAM', body: two(
    term(['$ docker ps --format \'table {{.Names}}\\t{{.Image}}\\t{{.Ports}}\'', 'NAMES          IMAGE                          PORTS', 'dk14-rabbit    rabbitmq:4.3-management-alpine 127.0.0.1:18149->15672/tcp', 'dk14-adminer   adminer:6.1.0                  127.0.0.1:18148->8080/tcp', 'dk14-minio     quay.io/minio/minio:latest     127.0.0.1:18144->9000/tcp, …', 'dk14-mail      axllent/mailpit:v1.31          127.0.0.1:18147->1025/tcp, …', 'dk14-redis     redis:7-alpine                 127.0.0.1:18143->6379/tcp', 'dk14-mongo     mongo:7                        127.0.0.1:18142->27017/tcp', 'dk14-mysql     mysql:8.0                      127.0.0.1:18141->3306/tcp', 'dk14-pg        postgres:16-alpine             127.0.0.1:18140->5432/tcp'], { title: 'output thật — máy Mac', fs: 13 }),
    `${bars([
      { l: 'mysql:8.0', v: 368, txt: '368 MiB · sẵn sàng 8 s', c: 'red' },
      { l: 'minio', v: 167, txt: '167 MiB', c: 'amb' },
      { l: 'rabbitmq', v: 103, txt: '103 MiB · 2,6 s', c: 'amb' },
      { l: 'mongo:7', v: 87, txt: '87 MiB · 6 s', c: 'blu' },
      { l: 'adminer', v: 53, txt: '53 MiB', c: 'blu' },
      { l: 'postgres:16', v: 42, txt: '42 MiB · 1 s', c: 'grn' },
      { l: 'mailpit', v: 20, txt: '20 MiB', c: 'grn' },
      { l: 'redis:7', v: 5, txt: '5 MiB · 1 s', c: 'grn' },
    ], { lw: 150 })}
    ${box('tip', 'Mọi cổng gắn vào <code>127.0.0.1</code>: chỉ máy bạn gọi được, người cùng Wi-Fi quán cà phê thì không.')}`, 'l') },

  { t: 'Postgres một lệnh: biến môi trường + thư mục init', body: two(
    yaml([
      ['docker run -d --name pg \\', ''],
      ['  -e POSTGRES_PASSWORD=matkhau \\', 'BẮT BUỘC, không có là thoát'],
      ['  -e POSTGRES_DB=phongkham \\', 'tạo sẵn CSDL này'],
      ['  -p 127.0.0.1:18140:5432 \\', 'chỉ máy mình'],
      ['  -v pgdata:/var/lib/postgresql/data \\', 'volume CÓ TÊN'],
      ['  -v "$PWD/init":/docker-entrypoint-initdb.d:ro \\', 'script chạy lần đầu'],
      ['  postgres:16-alpine', 'ghim bản chính'],
    ], { fs: 14 }),
    term(['$ cat init/01-schema.sql', 'CREATE TABLE lich_hen (id serial PRIMARY KEY, …);', 'INSERT INTO lich_hen … (\'An\', …), (\'Binh\', …);', '$ docker logs pg 2>&1 | grep initdb.d', '+ …running /docker-entrypoint-initdb.d/01-schema.sql', '$ docker exec pg psql -U postgres \\', '    -d phongkham -c "select * from lich_hen"', ' id | benh_nhan |          gio', '----+-----------+------------------------', '  1 | An        | 2026-09-25 01:00:00+00', '  2 | Binh      | 2026-09-25 02:30:00+00'], { title: 'output thật — máy Mac', fs: 13.5 }), '') },

  { t: 'Script khởi tạo chỉ chạy khi thư mục dữ liệu RỖNG', body: `
    ${initFlow()}
    ${term(['$ echo "INSERT … (\'Cuong\', now());" > init/02-them.sql', '$ docker stop pg && docker run … (y hệt lệnh cũ, cùng volume pgdata)', '$ docker logs pg 2>&1 | head -2', '+ PostgreSQL Database directory appears to contain a database; Skipping initialization', '$ docker exec pg psql -U postgres -d phongkham -tAc "select count(*) from lich_hen"', '2                                   # vẫn 2 dòng: 02-them.sql không hề chạy'], { title: 'output thật — máy Mac', fs: 14 })}` },

  { t: 'Dump/restore qua docker exec — dùng pg_dump CỦA container', body: two(
    `${term(['$ pg_dump -h 127.0.0.1 -p 18140 -U postgres phongkham', '! pg_dump: error: server version: 16.14; pg_dump version: 14.19 (Homebrew)', '! pg_dump: error: aborting because of server version mismatch'], { title: 'pg_dump cài trên Mac — bản 14', fs: 14 })}
    ${term(['$ docker exec pg pg_dump -U postgres -d phongkham \\', '    --clean --if-exists > pk.sql', '$ docker exec pg createdb -U postgres khoiphuc', '$ docker exec -i pg psql -U postgres -d khoiphuc -q < pk.sql', '$ docker exec pg psql -U postgres -d khoiphuc -tAc \\', '    "select benh_nhan from lich_hen"', '= An', '= Binh'], { title: 'đúng cách — công cụ trong container', fs: 14 })}`,
    `${diagram({ w: 480, h: 290, nodes: [
      { id: 'pg', x: 0, y: 0, w: 210, h: 84, t: 'container pg', d: 'pg_dump 16 = server 16', c: 'dk' },
      { id: 'mac', x: 270, y: 103, w: 210, h: 84, t: 'Máy bạn', d: 'pk.sql / pk.dump', c: 'tea' },
      { id: 'db2', x: 0, y: 206, w: 210, h: 84, t: 'CSDL khoiphuc', d: 'psql đọc stdin', c: 'grn' },
    ], edges: [
      { from: 'pg', to: 'mac', t: 'stdout >', c: 'amb', fs: 'r', ts: 't' },
      { from: 'mac', to: 'db2', t: 'stdin < (-i)', c: 'grn', fs: 'b', ts: 'r' },
    ] })}
    ${box('tip', 'Dữ liệu chảy qua <b>stdout/stdin</b> của <code>docker exec</code>. Đưa file VÀO thì cần <code>-i</code>. Đừng thêm <code style="white-space:nowrap">-t</code>: terminal giả đổi ký tự xuống dòng, file dump hỏng.')}`, 'l') },

  { t: 'Mailpit bắt thư, MinIO giả làm S3 — app không biết là “dev”', body: two(
    `${diagram({ w: 560, h: 330, nodes: [
      { id: 'app', x: 0, y: 120, w: 170, h: 90, t: 'app của bạn', d: 'Nodemailer · S3 SDK', c: 'dk' },
      { id: 'mail', x: 330, y: 0, w: 230, h: 100, t: 'Mailpit', d: 'SMTP :1025\nweb :8025', c: 'grn' },
      { id: 's3', x: 330, y: 220, w: 230, h: 100, t: 'MinIO', d: 'API S3 :9000\nconsole :9001', c: 'amb' },
    ], edges: [
      { from: 'app', to: 'mail', t: 'SMTP', c: 'grn' },
      { from: 'app', to: 's3', t: 'S3 API', c: 'amb' },
    ] })}`,
    `${term(['$ curl -s smtp://127.0.0.1:18147 -T mail.txt \\', '    --mail-from phongkham@vidu.test --mail-rcpt an@vidu.test', '$ curl -s 127.0.0.1:18146/api/v1/messages | …', '= total: 1', '= phongkham@vidu.test -> an@vidu.test | Xac nhan lich hen 25/09', '$ rclone copy pk.sql s3:anh-benh-nhan/sao-luu/   # qua container', '$ rclone ls s3:anh-benh-nhan', '     2348 sao-luu/pk.sql'], { title: 'output thật — máy Mac', fs: 13.5 })}
    ${box('info', 'Thư không bao giờ ra Internet: bạn cùng nhóm test “quên mật khẩu” 50 lần mà không ai nhận được email rác.')}`, 'r') },

  { t: 'Ảnh của bên thứ ba có thể biến mất: chuyện MinIO 2025–2026', body: two(
    `${term(['$ docker pull minio/minio:latest', '! Error response from daemon: pull access denied for minio/minio,', '! repository does not exist or may require \'docker login\'', '$ docker logs dk14-minio | grep Version', 'Version: RELEASE.2025-09-07T16-13-09Z (go1.24.6 linux/arm64)'], { title: 'output thật — máy Mac, 24/09/2026', fs: 14 })}
    ${table(['Nơi', 'Tình trạng (kiểm 24/09/2026)'], [
      ['<code>minio/minio</code> trên Docker Hub', '-không kéo được nữa'],
      ['<code>quay.io/minio/minio</code>', '!còn, bản cuối 09/2025 + vài bản vá'],
      ['kho GitHub <code>minio/minio</code>', '!lưu trữ (archived) 25/04/2026'],
      ['bản cộng đồng', '!chỉ còn mã nguồn, tự build'],
    ], { sm: true })}`,
    `${cards([
      { ic: '📌', t: 'Ghim tag, đừng ghim “latest”', d: 'Biết mình đang chạy bản nào để còn tìm lại được.', c: 'blu' },
      { ic: '🏷', t: 'Ưu tiên ảnh Docker Official Image', d: '<code>postgres</code>, <code>redis</code>, <code>caddy</code>… do cộng đồng Docker duy trì.', c: 'grn' },
      { ic: '🔁', t: 'Có đường lùi', d: 'Giữ bản sao ảnh trong registry của mình; biết dịch vụ nào thay thế được.', c: 'amb' },
    ], 1)}`, 'l') },

  /* ───────────── 14.3 ───────────── */
  { t: 'Caddy: bốn dòng thay cho cả khối nginx + certbot', body: two(
    `${yaml([
      ['vault.localhost:18140 {', 'tên miền (+ cổng) của site'],
      ['    tls internal', 'CA riêng — KHÔNG ra Internet'],
      ['    reverse_proxy vaultwarden:80', 'đẩy tiếp vào container'],
      ['}', ''],
    ], { fs: 17 })}
    ${term(['$ docker compose logs caddy | grep -o \'"msg":"[^"]*"\'', '"msg":"installing root certificate (you might be prompted for password)"', '"msg":"certificate installed properly in linux trusts"', '= "msg":"certificate obtained successfully"'], { title: 'output thật — máy Mac', fs: 13.5 })}`,
    `${table(['', 'nginx (Ch.10)', 'Caddy'], [
      ['Chứng chỉ HTTPS', 'certbot riêng + cron gia hạn', '+tự lấy &amp; tự gia hạn'],
      ['HTTP → HTTPS', 'tự viết server :80', '+mặc định'],
      ['HTTP/2, HTTP/3', 'bật tay', '+mặc định'],
      ['Cấu hình proxy', '5–10 dòng', '+1 dòng'],
      ['Tinh chỉnh sâu, tài liệu, bài mẫu', '+rất nhiều', '!ít hơn'],
    ], { sm: true })}
    ${box('info', 'Trên VPS có tên miền thật: bỏ <code>tls internal</code>, mở 80/443 ⇒ Caddy tự xin chứng chỉ Let’s Encrypt. Ở đây chạy chế độ nội bộ.')}`, 'l') },

  { t: 'tls internal: HTTPS thật, nhưng chỉ ai tin CA của Caddy mới tin', body: two(
    caChain(),
    `${term(['$ curl https://vault.localhost:18140/', '! curl: (60) SSL certificate problem: unable to get local', '! issuer certificate', '$ docker compose cp \\', '    caddy:/data/caddy/pki/authorities/local/root.crt .', '$ curl --cacert root.crt -sI \\', '    https://vault.localhost:18140/', '= HTTP/2 200', 'alt-svc: h3=":18140"; ma=2592000', 'server: Rocket', 'via: 1.1 Caddy'], { title: 'output thật — máy Mac', fs: 14 })}
    ${box('warn', '“installed properly in linux trusts” là kho tin cậy BÊN TRONG container. Máy Mac của bạn chưa tin gì cả — trình duyệt sẽ cảnh báo tới khi bạn tự thêm <code>root.crt</code>.')}`, 'l') },

  { t: 'Ba dịch vụ đáng tự host — ảnh chính thức, đã kiểm', body: `
    ${table(['Dịch vụ', 'Để làm gì', 'Ảnh (09/2026)', 'Tải về', 'Cổng · dữ liệu', 'Lưu ý'], [
      ['<b>Vaultwarden</b>', 'Kho mật khẩu cho nhóm, dùng app Bitwarden', '<code>vaultwarden/server:1.37.3-alpine</code>', '64 MB', '80 · <code>/data</code>', '!BẮT BUỘC HTTPS (Web Crypto)'],
      ['<b>Uptime Kuma</b>', 'Canh web đồ án sống/chết, báo qua Telegram…', '<code>louislam/uptime-kuma:2</code>', '602 MB (<code>2-slim</code> 182 MB)', '3001 · <code>/app/data</code>', '!không đặt dữ liệu trên NFS'],
      ['<b>n8n</b>', 'Tự động hoá: form → sheet → email', '<code>n8nio/n8n</code> (ghim tag)', '267 MB', '5678 · <code>/home/node/.n8n</code>', '!giấy phép Sustainable Use, không phải OSI'],
    ], { sm: true })}
    ${two(term(['$ curl --cacert root.crt https://vault.localhost:18140/alive', '"2026-09-24T00:28:27.540365Z"', '$ docker compose ps --format \'{{.Service}} {{.Status}}\'', 'caddy Up 16 seconds', 'vaultwarden Up 16 seconds (health: starting)'], { title: 'Caddy + Vaultwarden — chạy thật trên Mac', fs: 14 }),
      box('tip', 'Kiểm ảnh chính thức: trang GitHub/tài liệu của CHÍNH dự án ghi tên ảnh nào. Tên na ná trên Docker Hub (thêm đuôi <code>-server</code>, <code>-official</code>, tên người dùng lạ…) là của người khác — có thể cài sẵn mã độc.'))}` },

  { t: 'Sao lưu = tar qua container phụ; cập nhật = đổi tag có chủ đích', body: two(
    `${term(['$ docker compose stop vaultwarden', '$ docker run --rm -v dk14-tuhost_vw_data:/data:ro \\', '    -v "$PWD":/backup alpine:3 \\', '    tar czf /backup/vw-2026-09-24.tgz -C /data .', '$ docker compose start vaultwarden', '$ tar tzf vw-2026-09-24.tgz', './', './rsa_key.pem', './db.sqlite3-wal', './db.sqlite3-shm', './db.sqlite3', './tmp/'], { title: 'output thật — máy Mac', fs: 14 })}`,
    `${steps([
      ['Dừng dịch vụ ghi vào volume', 'SQLite đang ghi dở + tar = bản sao lưu hỏng'],
      ['<code>tar</code> volume ra một file có ngày', '<code>:ro</code> — container phụ chỉ được đọc'],
      ['Chép file đó RA KHỎI máy', 'máy chết thì bản sao lưu nằm cạnh nó cũng chết'],
      ['Đổi tag trong compose → <code>pull</code> → <code>up -d</code>', 'đọc ghi chú phát hành trước; giữ tag cũ để quay lui'],
      ['Thử KHÔI PHỤC một lần', 'chưa thử khôi phục thì chưa có bản sao lưu'],
    ])}`, 'l') },

  { t: 'Sửa Caddyfile bằng mv: container thấy “No such file”', body: two(
    `${term(['# compose gắn MỘT FILE: ./Caddyfile:/etc/caddy/Caddyfile:ro', '$ mv Caddyfile.moi Caddyfile        # editor/sed -i cũng làm thế', '$ docker compose exec caddy grep -c ping /etc/caddy/Caddyfile', '! grep: /etc/caddy/Caddyfile: No such file or directory', '$ docker compose exec caddy caddy reload \\', '    --config /etc/caddy/Caddyfile', '! Error: reading config from file: open /etc/caddy/Caddyfile:', '! no such file or directory', '# sửa: gắn CẢ THƯ MỤC ./caddy:/etc/caddy:ro', '$ mv caddy/Caddyfile.moi caddy/Caddyfile', '$ docker compose exec caddy caddy reload \\', '    --config /etc/caddy/Caddyfile', '$ curl --cacert root.crt https://vault.localhost:18140/ping', '= pong v2'], { title: 'output thật — máy Mac', fs: 13.5 })}`,
    `${table(['Máy', 'Sau khi <code>mv</code> đè file đã gắn'], [
      ['Mac (Docker Desktop)', '-container thấy file BIẾN MẤT'],
      ['Linux', '-container vẫn đọc bản CŨ (giữ inode cũ)'],
    ], { sm: true })}
    ${box('bad', 'Cả hai đều “reload thành công” với cấu hình cũ, hoặc hỏng hẳn ở lần khởi động lại sau. Một dự án sinh viên từng mất cả buổi với đúng lỗi này ở nginx (Ch.7).')}
    ${box('good', 'Gắn <b>thư mục</b>, không gắn file đơn — đổi tên file bên trong thư mục thì container thấy ngay.')}`, 'l2') },

  { t: 'Mở cổng ra Internet: -p đi vòng qua tường lửa', body: two(
    host({ t: 'VPS · Docker Engine', ctrs: [
      { n: 'caddy', im: 'caddy:2.11-alpine', items: ['cổng <code>80</code> và <code>443</code>', 'CỬA DUY NHẤT ra ngoài'], c: 'grn', port: '443' },
      { n: 'vaultwarden', im: 'vaultwarden/server', items: ['không <code>ports:</code>', 'chỉ Caddy gọi tới'], c: 'dk' },
      { n: 'postgres', im: 'postgres:16-alpine', items: ['<code>-p 5432:5432</code> ⇒ LỘ', 'dù <code>ufw deny 5432</code>'], c: 'red' },
    ], side: [{ t: 'mạng nội bộ compose', c: 'dk' }, { t: 'iptables của Docker đứng TRƯỚC ufw', c: 'red' }] }),
    `${list([
      'Docker tự viết luật iptables cho <code>-p</code>; luật của <code>ufw</code> không chặn được chúng.',
      'Chỉ công bố 80/443 của proxy. CSDL, bảng quản trị: không <code>ports:</code>, hoặc <code>127.0.0.1:</code>.',
      'Bảng quản trị (Adminer, n8n, Uptime Kuma) phải có mật khẩu mạnh — tốt hơn là chỉ vào qua VPN/SSH tunnel.',
      'Theo dõi phiên bản: dịch vụ tự host bỏ quên 6 tháng là cửa sau.',
    ])}`, 'l') },

  /* ───────────── 14.4 ───────────── */
  { t: 'Container thấy GPU nhờ một mảnh ghép ở MÁY CHỦ', body: `${gpuPath()}
    ${box('info', 'Driver NVIDIA luôn nằm ở máy chủ, không bao giờ trong ảnh. Toolkit chỉ làm một việc: gắn đúng file thiết bị và thư viện driver vào container lúc khởi động.')}` },

  { t: 'Có GPU mà thiếu toolkit: --gpus báo lỗi ngay', body: two(
    term(['$ nvidia-smi --query-gpu=name,memory.total,memory.used \\', '    --format=csv', 'name, memory.total [MiB], memory.used [MiB]', 'NVIDIA GeForce RTX 3060, 12288 MiB, 7369 MiB', '$ docker info --format \'{{json .Runtimes}}\' | grep -o nvidia', '# (không in gì: chưa có runtime nvidia)', '$ docker run --rm --gpus all alpine:3 true', '! docker: Error response from daemon: failed to discover GPU', '! vendor from CDI: no known GPU vendor found', '$ echo $?', '125'], { title: 'output thật — máy Linux (không sudo)', fs: 14 }),
    `${steps([
      ['Cài gói <code>nvidia-container-toolkit</code>', 'cần sudo — KHÔNG làm trên máy này'],
      ['<code>nvidia-ctk runtime configure --runtime=docker</code>', 'ghi runtime nvidia vào daemon.json'],
      ['<code>systemctl restart docker</code>', 'mọi container đang chạy sẽ dừng!'],
      ['<code>docker run --rm --gpus all ubuntu nvidia-smi</code>', 'lệnh kiểm mẫu trong tài liệu Docker/NVIDIA'],
    ])}
    ${box('warn', 'Mã 125 = Docker từ chối trước khi container kịp chạy. 5,9 GB VRAM ở trên là <code>llama-server</code> chạy thẳng trên máy (không container) — đừng giành GPU với việc đang chạy.')}`, 'l') },

  { t: 'Trên Mac: GPU không vào được container — chạy AI ở ngoài', body: `${macGpu()}
    ${term(['$ docker run --rm --gpus all alpine:3 true', '! docker: Error response from daemon: failed to discover GPU vendor from CDI: no known GPU vendor found'], { title: 'output thật — máy Mac', fs: 14 })}` },

  { t: 'Ollama trong Docker: ảnh vài GB, model để trong volume', body: two(
    `${yaml([
      ['services:', ''],
      ['  ollama:', ''],
      ['    image: ollama/ollama:0.34.3', 'ghim bản, đừng “latest”'],
      ['    ports: ["127.0.0.1:11434:11434"]', 'API chỉ cho máy mình'],
      ['    volumes: [ollama:/root/.ollama]', 'model nằm ĐÂY'],
      ['    deploy:', ''],
      ['      resources:', ''],
      ['        reservations:', ''],
      ['          devices:', 'xin GPU (cần toolkit)'],
      ['            - driver: nvidia', ''],
      ['              count: all', ''],
      ['              capabilities: [gpu]', 'BẮT BUỘC có'],
      ['volumes:', ''],
      ['  ollama:', 'down -v = tải lại vài GB'],
    ], { fs: 13.5 })}
    ${box('warn', 'Không chạy thật trong bài: máy GPU của khoá đang bận việc AI khác. Lệnh lấy từ trang ảnh <code>ollama/ollama</code> trên Docker Hub.')}`,
    `${bars([
      { l: 'ảnh ollama/ollama', sub: 'amd64 (kèm thư viện CUDA)', v: 3710, txt: '3,7 GB', c: 'amb' },
      { l: 'ảnh ollama/ollama', sub: 'arm64', v: 2787, txt: '2,8 GB', c: 'amb' },
      { l: 'model llama3.2:3b', sub: 'trong volume', v: 2000, txt: '2,0 GB', c: 'vio' },
      { l: 'model llama3.2:1b', sub: 'trong volume', v: 1300, txt: '1,3 GB', c: 'vio' },
      { l: 'postgres:16-alpine', sub: 'để so sánh', v: 116, txt: '0,1 GB', c: 'grn' },
    ], { lw: 250 })}
    ${box('tip', 'Tách ảnh (thay được) khỏi model (tải lâu). Đổi bản Ollama = kéo ảnh mới, volume model giữ nguyên.')}`, 'r') },

  { t: 'Docker Model Runner: model là artifact OCI, API kiểu OpenAI', body: two(
    `${term(['$ docker model version', 'Client:', ' Version:    v1.2.6', ' OS/Arch:    darwin/arm64', 'Server:', '! Version:    (not reachable)', ' Engine:     Docker Desktop', '$ docker model status', '! Docker Model Runner is not running', '+ Enable Docker Model Runner via the CLI → docker desktop enable model-runner'], { title: 'output thật — máy Mac (chưa bật DMR)', fs: 13 })}`,
    `${table(['', 'Docker Model Runner (GA từ 09/2025)'], [
      ['Kéo / chạy', '<code>docker model pull ai/smollm2</code> · <code>docker model run ai/smollm2</code>'],
      ['API từ máy', '<code>http://localhost:12434/engines/v1/chat/completions</code>'],
      ['API từ container', '<code>http://model-runner.docker.internal</code>'],
      ['Compose', 'khối <code>models:</code> ⇒ tự bơm <code>LLM_URL</code>, <code>LLM_MODEL</code> (Compose ≥ 2.38)'],
      ['Mac M-series', '+llama.cpp chạy ngay trên macOS ⇒ dùng GPU Apple'],
      ['Linux', 'gói <code>docker-model-plugin</code>; NVIDIA/AMD/Vulkan'],
    ], { sm: true })}
    ${box('info', 'Mô tả theo docs.docker.com (kiểm 24/09/2026); bài KHÔNG tải model nào.')}`, 'l') },

  { t: 'Chọn đường nào cho AI cục bộ?', body: table(['Tình huống', 'Nên dùng', 'Vì sao'], [
    ['Mac M1, muốn thử model nhanh', '+Ollama bản macOS hoặc Docker Model Runner', 'chạy ngoài máy ảo ⇒ có GPU Apple'],
    ['Mac, app trong compose cần gọi model', '+DMR (<code>models:</code>) hoặc Ollama native + <code>host.docker.internal</code>', 'container chỉ GỌI, không chạy model'],
    ['Linux có NVIDIA, server dùng chung', '+<code>ollama/ollama</code> + toolkit + <code>--gpus</code>', 'đóng gói được, khởi động lại cùng Docker'],
    ['Máy đang chạy việc AI khác trên GPU', '!kiểm <code>nvidia-smi</code> trước', '12 GB VRAM không đủ cho hai model lớn cùng lúc'],
    ['Máy không có GPU / VPS rẻ', '-model 1–3B trên CPU, hoặc gọi API', 'chạy được nhưng chậm; đừng hứa “real-time”'],
    ['Windows + WSL2 + NVIDIA', '+Docker Desktop hỗ trợ <code>--gpus</code>', 'nền tảng duy nhất Desktop cho GPU vào container'],
  ], { sm: true }) },

  /* ───────────── chung ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 14', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['<code>Permission denied</code> với file container vừa tạo (Linux)', 'Container chạy uid 0, file thuộc root', '<code>-u "$(id -u):$(id -g)"</code>; lỡ rồi: <code>chown</code> qua container'],
    ['<code>cannot attach stdin to a TTY-enabled container</code>', 'Có <code>-t</code> trong script/CI, không có terminal thật', 'Bỏ <code>-t</code>, giữ <code>-i</code> nếu cần stdin'],
    ['Đổi <code>POSTGRES_PASSWORD</code> mà không có tác dụng', 'Volume đã có dữ liệu ⇒ Skipping initialization', '<code>ALTER USER</code>, hoặc xoá volume (mất dữ liệu!)'],
    ['<code>pg_dump: server version mismatch</code>', 'pg_dump trên máy cũ hơn server', '<code>docker exec pg pg_dump …</code>'],
    ['<code>pull access denied for minio/minio</code>', 'Nhà phát hành rút ảnh khỏi Docker Hub', 'Ghim tag, có registry riêng, có phương án thay'],
    ['Sửa Caddyfile/nginx.conf mà không ăn', 'Gắn file đơn + editor ghi bằng đổi tên', 'Gắn cả thư mục'],
    ['<code>failed to discover GPU vendor from CDI</code>', 'Chưa cài NVIDIA Container Toolkit (hoặc đang ở Mac)', 'Cài toolkit; trên Mac chạy AI native'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 14', body: table(['Muốn…', 'Gõ'], [
    ['Chạy công cụ trên thư mục hiện tại', '<code>docker run --rm -v "$PWD":/w -w /w &lt;ảnh:tag&gt; &lt;lệnh&gt;</code>'],
    ['… và file ra thuộc về mình (Linux)', 'thêm <code>-u "$(id -u):$(id -g)"</code>'],
    ['Postgres dùng ngay', '<code>docker run -d -e POSTGRES_PASSWORD=… -p 127.0.0.1:5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16-alpine</code>'],
    ['Chờ Postgres sẵn sàng thật', '<code>pg_isready -h 127.0.0.1</code> (qua TCP, không qua socket)'],
    ['Dump / restore', '<code>docker exec pg pg_dump … &gt; f.sql</code> · <code>docker exec -i pg psql … &lt; f.sql</code>'],
    ['Bắt email khi dev', '<code>axllent/mailpit</code> — SMTP 1025, web 8025'],
    ['HTTPS nội bộ bằng Caddy', '<code>tls internal</code> + lấy <code>/data/caddy/pki/authorities/local/root.crt</code>'],
    ['Sao lưu một volume', '<code>docker run --rm -v vol:/data:ro -v "$PWD":/b alpine tar czf /b/x.tgz -C /data .</code>'],
    ['GPU cho container (Linux + NVIDIA)', 'cài toolkit → <code>docker run --gpus all …</code>'],
    ['Model cục bộ qua Docker', '<code>docker model pull/run</code> · API <code>localhost:12434/engines/v1</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 14 (45 phút)', body: `
    ${steps([
      ['Chuyển một video và một file Markdown mà KHÔNG cài gì', '<code>mwader/static-ffmpeg</code> + <code>pandoc/minimal</code>, ghim tag; viết hàm zsh cho một trong hai'],
      ['Dựng Postgres + Mailpit cho đồ án bằng một file compose', 'cổng <code>127.0.0.1</code>, volume có tên, <code>initdb.d</code> tạo bảng mẫu'],
      ['Dump CSDL ra file, xoá volume, dựng lại, khôi phục', 'dùng <code>pg_dump</code> của container; đếm dòng trước/sau'],
      ['Đặt Caddy <code>tls internal</code> trước một dịch vụ', 'lấy <code>root.crt</code>, <code>curl --cacert</code> ra 200'],
      ['Sao lưu volume của dịch vụ đó ra file .tgz rồi dọn sạch', '<code>docker compose down -v</code> chỉ SAU khi đã có bản sao lưu'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bạn khôi phục được CSDL từ file dump vào một volume mới tinh, <code>curl --cacert</code> trả 200, và <code>docker ps -a</code> không còn container nào của bài tập.')}` },
]);
