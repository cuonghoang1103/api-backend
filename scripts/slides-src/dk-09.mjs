/**
 * Docker · Deck dk-09 — Chương 9: Docker Compose.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 24/09/2026 trên máy Mac M1:
 *   Docker Desktop 4.91 / Engine 29.8.0 arm64, Docker Compose v5.5.1 (máy Linux nhà: Compose v5.3.1).
 * Tên project mang tiền tố dk09- (luật an toàn của khoá); đường dẫn dài của thư mục thử được cắt thành "…/".
 * Mốc thời gian (ms) lấy từ `docker compose events --json` và `docker compose logs -t`.
 */
import { S, cover, cards, box, steps, table, vs, two, mindmap, term as dkTerm, diagram, yaml, tree, esc, D, sv, R, T, A } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });
const TCSS = '<style>.g-term pre{font-size:15px;line-height:1.45}</style>';

export const deck = { key: 'dk-09', code: 'DOCKER · CHƯƠNG 9', title: 'Docker Compose', sub: 'Docker · Chương 9' };

/* ───────────── Hình tự vẽ ───────────── */

/** Slide 4 — một file compose → những thứ Compose tạo thật */
const whatCreated = () => {
  let s = '';
  s += R(0, 20, 240, 230, { c: 'dk', fill: '#0d1628' }) + T(120, 54, 'compose.yaml', { fs: 19, a: 'middle', b: true, mono: true });
  s += T(120, 82, 'name: dk09-blog', { fs: 14.5, a: 'middle', c: 'amb', mono: true });
  ['services: db api proxy', 'volumes: pgdata', 'networks: private,', 'public'].forEach((t, i) => { s += T(i === 3 ? 105 : 18, 124 + i * 30, t, { fs: 14.5, mono: true, c: 'mu' }); });
  s += A(246, 135, 312, 135, { c: 'dk' }) + T(279, 122, 'up', { fs: 14, a: 'middle', c: 'dk', mono: true });
  s += R(320, 0, 560, 118, { c: 'tea', dash: true, fill: 'rgba(45,212,191,.05)' }) + T(336, 24, 'mạng dk09-blog_private · internal', { fs: 15, c: 'tea', mono: true });
  s += R(320, 136, 560, 118, { c: 'blu', dash: true, fill: 'rgba(88,166,255,.05)' }) + T(336, 246, 'mạng dk09-blog_public', { fs: 15, c: 'blu', mono: true });
  const ctr = (x, y, n, sub, c) => R(x, y, 240, 64, { c, fill: '#111a2b' }) + T(x + 120, y + 28, n, { fs: 16, a: 'middle', b: true, mono: true }) + T(x + 120, y + 50, sub, { fs: 13.5, a: 'middle', c: 'mu' });
  s += ctr(340, 38, 'dk09-blog-db-1', 'DNS: db', 'grn');
  s += ctr(620, 95, 'dk09-blog-api-1', 'DNS: api · ở CẢ HAI mạng', 'dk');
  s += ctr(340, 158, 'dk09-blog-proxy-1', 'DNS: proxy', 'amb');
  s += R(930, 30, 220, 76, { c: 'vio', fill: 'rgba(188,140,255,.08)', dash: true }) + T(1040, 60, 'dk09-blog_pgdata', { fs: 15, a: 'middle', mono: true, c: 'vio', b: true }) + T(1040, 86, 'volume, ngoài mạng', { fs: 13.5, a: 'middle', c: 'mu' });
  s += `<path d="M580 70 L924 70" stroke="${D.vio}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  s += R(930, 158, 220, 76, { c: 'amb', fill: 'rgba(255,194,51,.08)' }) + T(1040, 188, 'máy Mac :18090', { fs: 15, a: 'middle', mono: true, c: 'amb', b: true }) + T(1040, 214, '→ proxy:80', { fs: 13.5, a: 'middle', c: 'mu', mono: true });
  s += A(924, 196, 586, 192, { c: 'amb' });
  return sv(1150, 256, s);
};

/** Slide 13 — cuộc đua khi depends_on trần (số đo thật, ms tính từ lúc db start) */
const raceLine = () => {
  const X = (ms) => 190 + ms * 1.05; // 0..900 ms
  let s = '';
  for (let t = 0; t <= 900; t += 100) s += `<line x1="${X(t)}" y1="20" x2="${X(t)}" y2="215" stroke="#1d2a40"/>` + T(X(t), 236, `${t}`, { fs: 13.5, a: 'middle', c: 'dim', mono: true });
  s += T(X(450), 258, 'mili giây kể từ lúc container db start', { fs: 14, a: 'middle', c: 'dim' });
  const row = (y, n, sub) => T(0, y + 6, n, { fs: 17, b: true }) + T(0, y + 27, sub, { fs: 13.5, c: 'mu' });
  s += row(60, 'db', 'postgres:16-alpine') + row(150, 'api', 'depends_on: [db]');
  s += `<rect x="${X(0)}" y="50" width="${X(866) - X(0)}" height="26" rx="6" fill="${D.amb}" opacity=".25"/>` + T(X(10), 68, 'initdb + máy chủ tạm (chưa nghe TCP)', { fs: 14, c: 'amb' });
  s += `<rect x="${X(866)}" y="50" width="${X(900) - X(866) + 30}" height="26" rx="6" fill="${D.grn}" opacity=".5"/>`;
  s += `<circle cx="${X(866)}" cy="63" r="8" fill="${D.grn}"/>` + T(X(866) - 10, 38, '866 ms: ready to accept connections', { fs: 14.5, c: 'grn', a: 'end', b: true });
  s += `<circle cx="${X(108)}" cy="163" r="8" fill="${D.dk}"/>` + T(X(108) + 14, 142, '108 ms: api start', { fs: 14.5, c: 'dk', mono: true });
  s += `<circle cx="${X(274)}" cy="163" r="9" fill="${D.red}"/>` + T(X(274) + 14, 188, '274 ms: ECONNREFUSED → die 1', { fs: 15, c: 'red', b: true, mono: true });
  s += `<rect x="${X(108)}" y="156" width="${X(274) - X(108)}" height="14" rx="5" fill="${D.dk}" opacity=".45"/>`;
  s += `<path d="M${X(274)} 150 L${X(274)} 80" stroke="${D.red}" stroke-width="2" stroke-dasharray="5 5"/>`;
  return sv(1150, 265, s);
};

/** Slide 14 — cùng healthcheck, có và không có start_interval (số đo thật) */
const hcLine = () => {
  const X = (s) => 200 + s * 150; // 0..6 s
  let s = '';
  for (let t = 0; t <= 6; t++) s += `<line x1="${X(t)}" y1="20" x2="${X(t)}" y2="236" stroke="#1d2a40"/>` + T(X(t), 258, `${t}s`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  const row = (y, n, sub, checks, healthy, apiT) => {
    s += T(0, y + 6, n, { fs: 17, b: true }) + T(0, y + 28, sub, { fs: 13.5, c: 'mu', mono: true });
    s += `<rect x="${X(0)}" y="${y - 6}" width="${X(0.87) - X(0)}" height="22" rx="5" fill="${D.amb}" opacity=".25"/>`;
    s += `<rect x="${X(0.87)}" y="${y - 6}" width="${X(healthy) - X(0.87)}" height="22" rx="5" fill="${D.grn}" opacity=".13"/>`;
    checks.forEach((c) => { s += `<path d="M${X(c)} ${y - 12} L${X(c)} ${y + 22}" stroke="${D.tea}" stroke-width="3"/>`; });
    s += `<circle cx="${X(healthy)}" cy="${y + 5}" r="8" fill="${D.grn}"/>` + T(X(healthy) + 14, y + 11, `healthy ${healthy.toFixed(1).replace('.', ',')} s`, { fs: 15, c: 'grn', b: true, mono: true });
    s += `<circle cx="${X(apiT)}" cy="${y + 44}" r="7" fill="${D.dk}"/>` + T(apiT > 4 ? X(apiT) - 14 : X(apiT) + 14, y + 50, `api start ${apiT.toFixed(2).replace('.', ',')} s`, { fs: 14, c: 'dk', mono: true, a: apiT > 4 ? 'end' : 'start' });
  };
  row(50, 'interval: 5s', 'không start_interval', [5.0], 5.03, 5.59);
  row(160, 'start_interval: 1s', 'trong start_period', [1.0], 1.03, 1.58);
  s += T(X(0.87) / 2 + X(0) / 2 + 40, 32, 'db sẵn sàng thật ở ~0,87 s', { fs: 13.5, c: 'amb' });
  return sv(1150, 268, s);
};

/** Slide 15 — bốn trường healthcheck trên một trục thời gian */
const hcFields = () => {
  const X = (s) => 30 + s * 30; // 0..36 s
  let s = '';
  s += `<line x1="${X(0)}" y1="150" x2="${X(36)}" y2="150" stroke="${D.mu}" stroke-width="2"/>`;
  for (let t = 0; t <= 36; t += 6) s += T(X(t), 176, `${t}s`, { fs: 13.5, a: 'middle', c: 'dim', mono: true });
  s += `<rect x="${X(0)}" y="60" width="${X(30) - X(0)}" height="36" rx="8" fill="${D.amb}" opacity=".16" stroke="${D.amb}" stroke-dasharray="7 6"/>`;
  s += T(X(15), 84, 'start_period: 30s — lần hỏng KHÔNG bị đếm', { fs: 16, a: 'middle', c: 'amb', b: true });
  [1, 2, 3, 4].forEach((t) => { s += `<circle cx="${X(t)}" cy="150" r="6" fill="${D.red}"/>`; });
  s += `<circle cx="${X(5)}" cy="150" r="8" fill="${D.grn}"/>` + T(X(5), 128, 'đạt ⇒ healthy', { fs: 14, a: 'middle', c: 'grn', b: true });
  s += T(X(2.5), 205, 'start_interval: 1s', { fs: 14, a: 'middle', c: 'tea', mono: true });
  [10, 15, 20, 25, 30, 35].forEach((t) => { s += `<circle cx="${X(t)}" cy="150" r="6" fill="${D.tea}"/>`; });
  s += T(X(12.5), 205, '↔ interval: 5s', { fs: 14, a: 'middle', c: 'tea', mono: true });
  s += R(X(19.5), 222, 330, 60, { c: 'red', fill: 'rgba(255,92,108,.08)' }) + T(X(19.5) + 14, 246, 'SAU start_period: hỏng retries lần', { fs: 14.5, c: 'red', b: true }) + T(X(19.5) + 14, 268, 'LIÊN TIẾP ⇒ unhealthy', { fs: 14.5, c: 'red', b: true });
  s += R(0, 222, 330, 60, { c: 'blu', fill: 'rgba(88,166,255,.08)' }) + T(14, 246, 'timeout: 3s — một lần kiểm chạy', { fs: 14.5, c: 'blu', b: true }) + T(14, 268, 'quá 3 s thì tính là hỏng', { fs: 14.5, c: 'blu', b: true });
  return sv(1150, 290, s);
};

/** Slide 19 — hai cái .env, hai người đọc */
const twoEnv = () => diagram({ w: 1160, h: 240, nodes: [
  { id: 'e', x: 10, y: 20, w: 250, h: 80, t: '.env', d: 'cạnh compose.yaml', c: 'amb', mono: true },
  { id: 'c', x: 420, y: 20, w: 300, h: 80, t: 'docker compose', d: 'thay ${TAG} … trong YAML', c: 'dk' },
  { id: 'y', x: 880, y: 20, w: 270, h: 80, t: 'image: api:1.4.2', d: 'ports · tên ảnh · đường dẫn', c: 'tea', mono: true },
  { id: 'f', x: 10, y: 150, w: 250, h: 80, t: 'api.env', d: 'env_file: của MỘT dịch vụ', c: 'vio', mono: true },
  { id: 'k', x: 420, y: 150, w: 300, h: 80, t: 'container api', d: 'thành biến môi trường', c: 'grn' },
  { id: 'n', x: 880, y: 150, w: 270, h: 80, t: '${HTTP_PORT} ⇒ ""', d: 'không có đường nào\ntừ api.env tới YAML', c: 'red', mono: true },
], edges: [
  { from: 'e', to: 'c', t: 'compose đọc', c: 'amb' },
  { from: 'c', to: 'y', t: 'nội suy', c: 'dk' },
  { from: 'f', to: 'k', t: 'container nhận', c: 'vio' },
] });

export const slides = S([
  cover({ t: 'Chương 9 — Docker Compose', sub: 'Một file mô tả cả stack · tên dự án · healthcheck &amp; thứ tự khởi động · biến &amp; profile · nhiều file dev/prod', chap: 'CHƯƠNG 9' }),

  { t: 'Bản đồ chương: từ 7 lệnh docker run tới một file chạy mọi nơi', body: mindmap('Docker Compose', 'một file · một lệnh', [
    { t: '9.1 File đầu tiên', d: 'services · networks · volumes; tên dự án; up / down / down -v', c: 'dk' },
    { t: '9.2 Tra cứu dịch vụ', d: 'cờ docker run ⇒ khoá YAML; YAML tự đổi kiểu; compose config', c: 'tea' },
    { t: '9.3 Thứ tự khởi động', d: 'depends_on chỉ chờ START; healthcheck chờ SẴN SÀNG; job migrate', c: 'amb' },
    { t: '9.4 Biến &amp; profile', d: 'hai cái .env; ${VAR:-…} ${VAR:?…}; thứ tự ưu tiên; profile', c: 'vio' },
    { t: '9.5 Nhiều file', d: 'override tự nạp; -f xếp chồng; luật hợp nhất; !reset !override', c: 'grn' },
  ]) },

  /* ───────────── 9.1 ───────────── */
  { t: 'Giải phẫu compose.yaml: mỗi dòng là một cờ bạn khỏi phải nhớ', body: yaml([
    ['name: dk09-blog', 'tên dự án: tiền tố của MỌI thứ'],
    ['services:', 'mỗi khoá con = một container'],
    ['  db:', 'tên dịch vụ = tên DNS trong mạng'],
    ['    image: postgres:16-alpine', 'kéo ảnh có sẵn'],
    ['    environment: { POSTGRES_PASSWORD: secret }', '= -e POSTGRES_PASSWORD=…'],
    ['    volumes: [pgdata:/var/lib/postgresql/data]', '= -v pgdata:… (volume có tên)'],
    ['    networks: [private]', '= --network private'],
    ['  api:', ''],
    ['    build: .', 'tự docker build từ ./Dockerfile'],
    ['    networks: [private, public]', '= run + network connect'],
    ['    depends_on: [db]', 'chỉ xếp thứ tự START (xem 9.3)'],
    ['  proxy:', ''],
    ['    image: nginx:alpine', ''],
    ['    ports: ["18090:80"]', '= -p 18090:80 (bọc nháy)'],
    ['    volumes: [./nginx.conf:/etc/nginx/nginx.conf:ro]', 'bind mount, tính từ thư mục FILE'],
    ['volumes: { pgdata: }', 'khai báo ⇒ compose tự tạo'],
    ['networks: { private: { internal: true }, public: }', 'internal = không ra Internet'],
  ], { fs: 14.5 }) },

  { t: 'Một lệnh up: 2 mạng, 1 volume, 3 container — tên đều có tiền tố', body: `
    ${whatCreated()}
    ${term(['$ docker compose up -d', '[+] up 6/6', ' ✔ Network dk09-blog_private   Created           0.0s', ' ✔ Volume dk09-blog_pgdata     Created           0.0s', ' ✔ Network dk09-blog_public    Created           0.0s', ' ✔ Container dk09-blog-db-1    Started           0.3s', '…'], { title: 'output thật — Mac, Compose v5.5.1 (2 dòng Container … Started cắt bớt)', fs: 14 })}` },

  { t: 'Đổi tên thư mục ⇒ tên dự án đổi ⇒ stack THỨ HAI, volume rỗng', body: two(
    term(['$ cd dk09-shop && docker compose up -d', ' ✔ Volume dk09-shop_data       Created', '$ docker compose exec db \\', '    sh -c \'echo "don hang 42" > /data/note.txt\'', '$ cd .. && mv dk09-shop dk09-shop-api && cd dk09-shop-api', '$ docker compose up -d', '! ✔ Volume dk09-shop-api_data   Created', '$ docker compose exec db cat /data/note.txt', "! cat: can't open '/data/note.txt': No such file or directory", '$ docker volume ls --filter name=dk09-shop', 'local     dk09-shop-api_data', '+ local     dk09-shop_data        # dữ liệu cũ VẪN còn'], { title: 'output thật — máy Mac' }),
    `${table(['Tên dự án lấy từ', 'Mạnh hơn'], [
      ['<code>-p tên</code> trên dòng lệnh', '+mạnh nhất'],
      ['biến <code>COMPOSE_PROJECT_NAME</code>', ''],
      ['khoá <code>name:</code> đầu file', '+nên dùng'],
      ['tên thư mục chứa file', '-mặc định, dễ vỡ'],
    ], { sm: true })}
    ${box('good', 'Thêm <code>name: dk09-shop</code> vào đầu file, <code>up -d</code> lại ⇒ in ra <b>don hang 42</b>: volume cũ được gắn lại. Dọn stack lạc: <code>docker compose -p dk09-shop-api down</code>.')}`, 'l') },

  { t: '“✔ Started” chỉ nghĩa là ĐÃ KHỞI ĐỘNG — không phải đang chạy', body: two(
    term(['$ docker compose up -d', '[+] up 6/6', '+ ✔ Container dk09-blog-db-1    Started   0.3s', '+ ✔ Container dk09-blog-api-1   Started   0.4s', '+ ✔ Container dk09-blog-proxy-1 Started   0.4s', '$ docker compose ps -a --format \'table {{.Name}}\\t{{.Status}}\'', 'NAME                STATUS', '! dk09-blog-api-1     Exited (1) 2 seconds ago', 'dk09-blog-db-1      Up 2 seconds', '! dk09-blog-proxy-1   Exited (1) 2 seconds ago', '$ docker compose logs api proxy | grep -E "Error|nginx: \\[emerg"', 'api-1  | Error: connect ECONNREFUSED 172.22.0.2:5432', 'proxy-1  | nginx: [emerg] host not found in upstream "api" in …'], { title: 'output thật — đúng file ở slide 3' }),
    `${steps([
      ['<code>up</code> xanh hết', 'nó chỉ báo lệnh <b>start</b> đã gửi thành công'],
      ['api chết sau 0,17 s', 'Postgres chưa nhận kết nối (đo ở slide 13)'],
      ['proxy chết theo', 'nginx không phân giải được <code>api</code> — container đã chết'],
    ])}
    ${box('tip', 'Sau mỗi <code>up</code>: <code>docker compose ps -a</code>. Thiếu <code>-a</code> thì container đã chết <b>biến khỏi danh sách</b>.')}`, 'l') },

  { t: 'Lệnh hằng ngày — và một chữ -v là mất cơ sở dữ liệu', body: two(
    table(['Muốn…', 'Gõ', 'Ghi chú'], [
      ['Dựng / cập nhật', '<code>up -d</code>', 'chỉ tạo lại dịch vụ có cấu hình đổi'],
      ['Xem còn sống không', '<code>ps -a</code>', '<code>-a</code> để thấy cả cái đã chết'],
      ['Đọc log', '<code>logs -f --tail 50 api</code>', 'bỏ tên dịch vụ = mọi dịch vụ'],
      ['Vào container đang chạy', '<code>exec db psql -U postgres</code>', 'cần dịch vụ đang lên'],
      ['Chạy việc một lần', '<code>run --rm api npm test</code>', 'container MỚI: <code>…-api-run-27a9…</code>'],
      ['Dừng + xoá', '<code>down</code>', '+giữ volume có tên'],
      ['Dừng + xoá + DỮ LIỆU', '<code>down -v</code>', '-xoá volume, không hỏi lại'],
    ], { sm: true }),
    term(['$ docker compose down', '[+] down 2/2', ' ✔ Container dk09-shop-db-1  Removed    3.1s', ' ✔ Network dk09-shop_default Removed    0.1s', '$ docker compose up -d && docker compose exec db cat /data/note.txt', '= don hang 42', '$ docker compose down -v', '[+] down 3/3', ' ✔ Container dk09-shop-db-1  Removed    3.2s', '! ✔ Volume dk09-shop_data     Removed    0.0s', ' ✔ Network dk09-shop_default Removed    0.1s'], { title: 'output thật — máy Mac' }), 'l') },

  /* ───────────── 9.2 ───────────── */
  { t: 'Hầu hết khoá dịch vụ = một cờ docker run, viết bằng YAML', body: table(['Cờ docker run', 'Khoá compose', 'Ghi chú'], [
    ['<code>--name</code>', '(tự sinh) <code>&lt;project&gt;-&lt;service&gt;-1</code>', '<code>container_name:</code> có, nhưng chặn scale'],
    ['<code>-p 18090:80</code>', '<code>ports: ["18090:80"]</code>', 'dạng dài: <code>target/published/host_ip</code>'],
    ['<code>-e K=V</code> · <code>--env-file</code>', '<code>environment:</code> · <code>env_file:</code>', 'dạng map dễ đọc hơn dạng list'],
    ['<code>-v tên:/đích</code>', '<code>volumes:</code> + khai ở cuối file', 'đường dẫn tương đối tính từ FILE'],
    ['<code>--network</code>', '<code>networks:</code>', 'mặc định: mạng <code>&lt;project&gt;_default</code>'],
    ['<code>--restart unless-stopped</code>', '<code>restart: unless-stopped</code>', '<code>"no"</code>: nên bọc nháy cho chắc'],
    ['<code>--memory 512m --cpus 1.5</code>', '<code>deploy.resources.limits</code>', 'có hiệu lực với <code>up</code> thường'],
    ['<code>--init</code> · <code>--user</code> · <code>-w</code>', '<code>init:</code> · <code>user:</code> · <code>working_dir:</code>', ''],
    ['ảnh + <code>CMD</code> · <code>ENTRYPOINT</code>', '<code>image:</code> · <code>command:</code> · <code>entrypoint:</code>', 'ghi đè của ảnh'],
    ['!(không có)', '!<code>depends_on</code> · <code>profiles</code> · <code>extends</code> · <code>build</code>', '!phần compose THÊM vào'],
  ], { sm: true }) },

  { t: 'image, build, hay cả hai — và luôn ghi rõ dockerfile:', body: `
    ${two(yaml([
      ['services:', ''],
      ['  api:', ''],
      ['    build:', 'dựng từ mã nguồn'],
      ['      context: .', 'thư mục gửi cho BuildKit'],
      ['      dockerfile: Dockerfile.backend', 'KHÔNG phải Dockerfile mặc định'],
      ['      target: production', 'dừng ở stage này (Ch.6)'],
      ['    image: ghcr.io/me/api:1.4.2', 'tên gắn cho kết quả dựng'],
      ['    pull_policy: missing', 'missing · always · never · build'],
    ], { fs: 15 }),
    box('bad', 'Chuyện thật: script dựng ảnh NGOÀI compose quên <code>-f Dockerfile.backend</code> ⇒ ảnh Alpine (musl) mang engine Prisma bản glibc ⇒ dựng xanh, đẩy xanh, rồi API <b>502 suốt bảy phút</b>.'), 'l')}
    ${cards([
      { ic: '📦', t: 'Chỉ image', d: 'Kéo về rồi chạy: postgres, redis, nginx — thứ bạn không tự dựng.', c: 'blu' },
      { ic: '🔨', t: 'Chỉ build', d: 'Ảnh mang tên tự sinh — đo thật: <code>dk09-blog-api</code>. Khó đẩy lên registry.', c: 'tea' },
      { ic: '🏷', t: 'Cả hai', d: 'Dựng rồi gắn tên <code>image</code> ⇒ <code>compose build</code> rồi <code>compose push</code>.', c: 'grn' },
    ], 3)}` },

  { t: 'YAML tự đổi kiểu dữ liệu: 0755 thành 493, 1.10 thành 1.1', body: two(
    yaml([
      ['environment:', 'container nhận được'],
      ['  PORT: 3000', '"3000" (vô hại)'],
      ['  DEBUG: true', '"true"'],
      ['  RATIO: 0.50', '"0.5"'],
      ['  H_VER: 1.10', '"1.1"  ⚠ phiên bản sai'],
      ['  E_OCT: 0755', '"493"  ⚠ đọc như bát phân!'],
      ['  C_HEX: 0x1F', '"31"'],
      ['  D_EXP: 1e3', '"1000"'],
      ['  I_Q: "012"', '"012"  ✔ bọc nháy'],
      ['ports: [22:22]', 'cổng 22 → 22  ✔ Compose v2+'],
    ], { fs: 15.5 }),
    `${term(['$ docker compose exec web env | grep -E "^[CDEHI]_" | sort', 'C_HEX=31', 'D_EXP=1000', '! E_OCT=493', '! H_VER=1.1', '= I_Q=012'], { title: 'output thật — giá trị container nhận' })}
    ${box('warn', '<code>22:22</code> hoá số hệ 60 là chuyện của YAML 1.1 (docker-compose v1). Compose v2+ đọc đúng — nhưng <b>giá trị trông như số</b> vẫn bị đổi. Luật đơn giản: <b>bọc nháy mọi giá trị</b>.')}`, 'l') },

  { t: 'deploy.resources và restart có hiệu lực thật với compose up', body: two(
    `${yaml([
      ['    restart: unless-stopped', ''],
      ['    deploy:', ''],
      ['      resources:', ''],
      ['        limits: { cpus: "0.5", memory: 128M }', 'trần cgroup (Ch.1)'],
    ], { fs: 15 })}
    ${term(['$ docker inspect dk09-ref-web-1 \\', '    -f \'Memory={{.HostConfig.Memory}} NanoCpus={{.HostConfig.NanoCpus}}\'', '+ Memory=134217728 NanoCpus=500000000'], { title: 'output thật — 128 MiB, nửa nhân' })}`,
    table(['restart:', 'Sập (exit ≠ 0)', 'Thoát sạch', 'Sau khi bạn stop'], [
      ['<code>"no"</code> (mặc định)', '-nằm im', 'nằm im', 'nằm im'],
      ['<code>on-failure</code>', '+lên lại', 'nằm im', 'nằm im'],
      ['<code>unless-stopped</code>', '+lên lại', '+lên lại', '!nằm im, kể cả reboot'],
      ['<code>always</code>', '+lên lại', '+lên lại', '!lên lại khi dockerd khởi động'],
    ], { sm: true }), 'l') },

  { t: 'docker compose config: xem file ĐÚNG như compose sẽ làm', body: two(
    term(['$ cd ~ && docker compose -f …/ch09/blog/compose.yaml config \\', '    | grep -E "source:|context:"', '      context: …/ch09/blog', '        source: pgdata', '+        source: …/ch09/blog/nginx.conf', '$ docker compose config | sed -n \'/^  api:/,/labels/p\'', '  api:', '…', '    depends_on:', '      db:', '        condition: service_healthy', '+        required: true', '…'], { title: 'output thật — máy Mac' }),
    cards([
      { ic: '📍', t: 'Đường dẫn tương đối', d: 'Tính từ thư mục FILE, không từ shell ⇒ gọi từ đâu cũng gắn đúng.', c: 'tea' },
      { ic: '🔓', t: 'Bung dạng ngắn', d: '<code>"18090:80"</code> thành <code>target / published / protocol</code>.', c: 'blu' },
      { ic: '🔤', t: 'Đã thay biến', d: 'Mọi <code>&#36;{VAR}</code> đã nội suy; <code>--no-interpolate</code> để xem bản gốc.', c: 'vio' },
      { ic: '⚠️', t: 'In cả bí mật', d: 'Đừng dán output vào chat nhóm khi có mật khẩu.', c: 'red' },
    ], 2), 'l2') },

  /* ───────────── 9.3 ───────────── */
  { t: 'depends_on trần: api chết TRƯỚC khi Postgres sẵn sàng', body: `
    ${raceLine()}
    ${two(
      term(['$ docker compose events --json   # rút gọn: giờ · dịch vụ · sự kiện', '01:38:14.540 db   start', '01:38:14.648 api  start', '! 01:38:14.814 api  die    exitCode=1', '$ docker compose logs -t db | grep "ready to accept" | tail -1', '+ …18:38:15.406… database system is ready to accept connections', '# logs -t in giờ UTC: 18:38 UTC = 01:38 giờ Việt Nam'], { title: 'output thật — máy Mac, volume mới', fs: 14 }),
      box('info', '<code>depends_on: [db]</code> chỉ chờ lệnh <b>start</b> của db trả về. Postgres còn phải chạy <code>initdb</code>, bật một máy chủ tạm, tắt nó, rồi mới nghe cổng 5432.'), 'l2')}` },

  { t: 'healthcheck + service_healthy: api chờ tới khi phép kiểm ĐẠT', body: `
    ${hcLine()}
    ${two(
      yaml([
        ['healthcheck:', ''],
        ['  test: ["CMD-SHELL", "pg_isready -h 127.0.0.1 -U postgres -d blog"]', ''],
        ['  interval: 5s', ''],
        ['  start_period: 30s', ''],
        ['  start_interval: 1s', 'kiểm dày lúc khởi động'],
      ], { fs: 13 }),
      term(['[+] up 6/6', '…', '+ ✔ Container dk09-blog-db-1  Healthy  1.8s', ' ✔ Container dk09-blog-api-1 Started  1.8s', '…'], { title: 'output thật — có start_interval', fs: 14 }), 'r2')}` },

  { t: 'Năm con số của healthcheck — hay quên nhất là start_period', body: `
    ${hcFields()}
    ${table(['Trường', 'Đặt bao nhiêu', 'Sai thì sao'], [
      ['<code>interval</code>', '5–30 s', 'Lần kiểm ĐẦU TIÊN cũng chờ đủ interval ⇒ up chậm vô cớ (slide 14)'],
      ['<code>timeout</code>', 'ngắn hơn interval', 'Không có ⇒ một phép kiểm treo giữ trạng thái cũ'],
      ['<code>retries</code>', '3–10', 'Quá thấp ⇒ một cú giật mạng là unhealthy'],
      ['<code>start_period</code> + <code>start_interval</code>', 'bằng thời gian khởi động xấu nhất', 'Thiếu ⇒ app khởi động chậm (Next.js, JVM) bị đánh unhealthy'],
    ], { sm: true })}` },

  { t: 'pg_isready qua socket báo “sẵn sàng” khi còn đang initdb', body: two(
    term(['# hỏi 2 cách, liên tục, trên container Postgres vừa tạo', '$ docker exec dk09-pgt pg_isready -U postgres -d blog', '$ docker exec dk09-pgt pg_isready -h 127.0.0.1 \\', '    -U postgres -d blog', '# 40 lượt, gộp dòng trùng bằng uniq -c:', '   6 01:38:36.778 sock=[no response] tcp=[no response]', '!   2 01:38:37.341 sock=[accepting connections] tcp=[no response]', '   1 01:38:37.538 sock=[no response] tcp=[accepting connections]', '=  31 01:38:37.633 sock=[accepting connections] tcp=[accepting connections]'], { title: 'output thật — máy Mac, postgres:16-alpine', fs: 14 }),
    `${steps([
      ['Máy chủ TẠM của initdb chỉ nghe unix socket', 'check không có <code>-h</code> ⇒ “accepting” quá sớm'],
      ['Nó tắt đi rồi máy chủ thật mới nghe TCP', 'app kết nối qua mạng ⇒ vẫn ECONNREFUSED'],
      ['Sửa: kiểm đúng đường app đi', '<code>pg_isready -h 127.0.0.1 …</code>'],
    ])}
    ${box('warn', 'Phép kiểm phải <b>chạy được</b> trong ảnh: gọi <code>curl</code> trong ảnh không có curl ⇒ unhealthy mãi. Ảnh Node dùng <code>node -e "fetch(…)"</code>; kiểm trước bằng <code>docker compose exec</code>.')}`, 'l2') },

  { t: 'Job migrate phải thoát 0 thì api mới được start', body: two(
    `${term(['$ docker compose up -d', '[+] up 7/7', ' ✔ Container dk09-blog-db-1      Healthy   2.5s', '+ ✔ Container dk09-blog-migrate-1 Exited    2.4s', ' ✔ Container dk09-blog-api-1     Started   2.4s'], { title: 'output thật — migrate thành công', fs: 14 })}
    ${term(['# migrate lỗi (ALTER TABLE posts … — bảng không tồn tại)', '! ✘ Container dk09-blog-migrate-1 Error service "migrate" didn\'t comple…', '  ✔ Container dk09-blog-api-1     Created', '! service "migrate" didn\'t complete successfully: exit 1', '$ echo $?', '! 1'], { title: 'output thật — migrate thất bại', fs: 14 })}`,
    `${table(['condition:', 'Chờ tới khi'], [
      ['<code>service_started</code>', 'container được start (mặc định)'],
      ['<code>service_healthy</code>', 'healthcheck đạt — không có healthcheck thì lỗi: <code>has no healthcheck configured</code>'],
      ['<code>service_completed_successfully</code>', 'container thoát với mã 0'],
    ], { sm: true })}
    ${box('warn', 'api nằm ở <b>Created</b>, không chạy trên schema dở dang. Nhưng: migrate <b>chạy lại ở MỌI lần up</b> (log ghi 3 lần <code>CREATE TABLE</code>) ⇒ migration phải chạy lặp được.')}`, 'l') },

  { t: 'Thứ tự khởi động chỉ đúng MỘT lần — app vẫn phải tự thử lại', body: two(
    `${vs({
      no: { t: 'Healthcheck KHÔNG chữa', items: ['db khởi động lại lúc 3 giờ sáng', 'mạng chập chờn, chuyển dự phòng', '<code>docker compose restart db</code> khi api đang chạy'] },
      yes: { t: 'Ứng dụng tự lo', items: ['Thử lại có lùi dần (200 ms, 400 ms… trần 5 s)', 'Bể kết nối tự mở lại kết nối hỏng', 'Thoát mã ≠ 0 khi hết lượt ⇒ <code>restart:</code> kéo lên'] },
    })}`,
    `${yaml([
      ['async function connectWithRetry(n = 1) {', ''],
      ['  try { return await prisma.$connect(); }', ''],
      ['  catch (err) {', ''],
      ['    if (n >= 10) throw err;', 'hết lượt ⇒ chết'],
      ['    const wait = Math.min(2 ** n * 100, 5000);', 'lùi dần, có trần'],
      ['    await new Promise(r => setTimeout(r, wait));', ''],
      ['    return connectWithRetry(n + 1);', ''],
      ['  } }', ''],
    ], { fs: 14 })}
    ${box('tip', 'Tránh <code>sleep 15</code> trong entrypoint: quá ngắn trên CI tải nặng, phí 15 s ở mọi lần khác.')}`, 'r') },

  /* ───────────── 9.4 ───────────── */
  { t: 'Hai cái .env, hai người đọc khác nhau', body: `
    ${twoEnv()}
    ${term(['$ cat api.env', 'HTTP_PORT=18096', '$ docker compose config   # ports: ["${HTTP_PORT}:80"] + env_file: [./api.env]', '! level=warning msg="The \\"HTTP_PORT\\" variable is not set. Defaulting to a blank string."', '$ docker compose up -d && docker compose ps --format \'{{.Ports}}\'', '! 0.0.0.0:58721->80/tcp          # cổng NGẪU NHIÊN, không phải 18096'], { title: 'output thật — máy Mac', fs: 14 })}` },

  { t: 'Sáu dạng nội suy — :- và - khác nhau đúng ở biến RỖNG', body: two(
    table(['Viết', 'Kết quả thật', 'Khi nào dùng'], [
      ['<code>&#36;{EMPTY:-mac-dinh}</code>', '+<code>mac-dinh</code>', 'giá trị có dự phòng — dùng nhiều nhất'],
      ['<code>&#36;{EMPTY-mac-dinh}</code>', '!<code>""</code> (rỗng)', 'chỉ thay khi CHƯA đặt'],
      ['<code>&#36;{UNSET-mac-dinh}</code>', '+<code>mac-dinh</code>', ''],
      ['<code>&#36;{SET:+--verbose}</code>', '<code>--verbose</code>', 'thêm cờ khi biến có'],
      ['<code>&#36;{UNSET:+--verbose}</code>', '<code>""</code>', ''],
      ['<code>&#36;{DB_PASS:?thông báo}</code>', '-dừng, exit 1', 'mật khẩu, khoá bắt buộc'],
      ['<code>$$HOSTNAME</code>', '<code>$HOSTNAME</code> tới container', 'biến của shell TRONG container'],
    ], { sm: true }),
    term(['# bảng bên trái: EMPTY= SET=1 docker compose config', '$ docker compose -f c2.yaml config', '! error while interpolating services.db.environment.', '! POSTGRES_PASSWORD: required variable DB_PASS is', '! missing a value: dat DB_PASS trong .env truoc da', '$ echo $?', '1', '# command: ["sh", "-c", "echo host=$$HOSTNAME"]', '$ docker compose run --rm api', '= host=55a5ac83d5db'], { title: 'output thật — máy Mac', fs: 14 }), 'l2') },

  { t: 'Nội suy: shell > --env-file > .env > mặc định trong YAML', body: two(
    term(['# compose.yaml: image: dk09-api:${TAG:-latest}', '$ docker compose config | grep image          # 4. chưa có .env', 'image: dk09-api:latest', '$ echo TAG=1.4.2 > .env; docker compose config | grep image', 'image: dk09-api:1.4.2', '$ echo TAG=2.0.0 > .env.prod', '$ docker compose --env-file .env.prod config | grep image', 'image: dk09-api:2.0.0', '$ TAG=9.9.9 docker compose --env-file .env.prod \\', '    config | grep image', '+ image: dk09-api:9.9.9'], { title: 'output thật — chứng minh từng tầng' }),
    `${steps([
      ['<b>Shell</b>: <code>TAG=… docker compose …</code>', 'CI truyền mã commit mà không sửa file'],
      ['<b><code>--env-file</code></b>: THAY hẳn .env', 'GREETING có trong .env bị rơi về mặc định YAML — đo được'],
      ['<b>.env</b> cạnh compose.yaml', 'không commit; commit <code>.env.example</code>'],
      ['<b>Mặc định trong YAML</b> <code>&#36;{TAG:-latest}</code>', 'để bản clone mới chạy được ngay'],
    ])}
    ${box('tip', 'Nhiều <code>--env-file</code> cùng lúc: file SAU thắng — <code>--env-file .env --env-file .env.prod</code>.')}`, 'l') },

  { t: 'Biến vào CONTAINER: năm tầng, tầng trên thắng', body: two(
    term(['# cùng một biến LEVEL, thêm dần từng tầng', '$ docker compose run --rm a', 'LEVEL=5-anh-ENV', '# + env_file: [app.env]', 'LEVEL=4-env_file', '# + environment: { LEVEL: ${LEVEL:-3-environment} }', 'LEVEL=3-environment', '$ LEVEL=2-shell docker compose run --rm a', 'LEVEL=2-shell', '$ LEVEL=2-shell docker compose run --rm -e LEVEL=1-run-e a', '+ LEVEL=1-run-e'], { title: 'output thật — máy Mac' }),
    table(['#', 'Nguồn', 'Ví dụ'], [
      ['1', '<code>compose run -e</code>', 'sửa tạm một lần chạy'],
      ['2', '<code>environment:</code> có <code>&#36;{…}</code> lấy từ shell/.env', 'giá trị theo máy'],
      ['3', '<code>environment:</code> ghi thẳng', 'NODE_ENV'],
      ['4', '<code>env_file:</code>', 'nhiều biến cho một dịch vụ'],
      ['5', '<code>ENV</code> trong Dockerfile', 'mặc định của ảnh'],
    ], { sm: true }), 'l') },

  { t: 'Profile: tắt cho tới khi được gọi — down cũng phải gọi nó', body: two(
    term(['$ docker compose config --services      # không bật profile', 'db', '$ docker compose config --profiles', 'seed', 'tools', '$ docker compose --profile tools up -d', ' ✔ Container dk09-prof-adminer-1 Started', '$ docker compose run --rm seed          # bỏ qua profile', '…', '    42', '$ docker compose down                   # quên --profile', ' ✔ Container dk09-prof-db-1  Removed', '! ! Network dk09-prof_default Resource is still in use', '$ docker ps --filter name=dk09-prof --format \'{{.Names}}\'', '! dk09-prof-adminer-1                  # vẫn chạy!'], { title: 'output thật — máy Mac' }),
    `${yaml([
      ['  adminer:', ''],
      ['    image: adminer:latest', ''],
      ['    ports: ["18097:8080"]', ''],
      ['    profiles: [tools]', 'mặc định KHÔNG chạy'],
      ['  seed:', ''],
      ['    profiles: [seed]', 'chạy bằng run --rm'],
    ], { fs: 15 })}
    ${box('good', 'Dọn cả phần có profile: <code>docker compose --profile "*" down</code>. Bật nhiều profile: <code>COMPOSE_PROFILES=tools,seed</code>.')}
    ${box('info', 'Dịch vụ thường <code>depends_on</code> dịch vụ có profile ⇒ lỗi <code>depends on undefined service</code>, trừ khi <code>required: false</code>.')}`, 'l') },

  { t: 'secrets: bí mật là FILE, không lộ ra docker inspect', body: two(
    `${yaml([
      ['services:', ''],
      ['  api:', ''],
      ['    secrets: [jwt_key]', '⇒ /run/secrets/jwt_key'],
      ['    environment:', ''],
      ['      JWT_KEY_FILE: /run/secrets/jwt_key', 'truyền ĐƯỜNG DẪN'],
      ['      JWT_KEY_LO: "dan-thang-vao-env"', 'để so sánh'],
      ['secrets:', ''],
      ['  jwt_key: { file: ./jwt.key }', 'chmod 600 trên máy'],
    ], { fs: 14 })}`,
    term(['$ docker compose exec api ls -l /run/secrets/', '-rw-------    1 root     root    65 Sep 23 18:42 jwt_key', '$ docker inspect dk09-sec-api-1 \\', '    -f \'{{range .Config.Env}}{{println .}}{{end}}\' | grep JWT', 'JWT_KEY_FILE=/run/secrets/jwt_key', '! JWT_KEY_LO=dan-thang-vao-env', '$ docker inspect dk09-sec-api-1 \\', '    -f \'{{range .Mounts}}{{.Type}} {{.Destination}} RW={{.RW}}{{end}}\'', '+ bind /run/secrets/jwt_key RW=false', '$ docker compose config | grep -c "$(cat jwt.key)"', '= 0'], { title: 'output thật — máy Mac', fs: 14 }), 'r') },

  /* ───────────── 9.5 ───────────── */
  { t: 'compose.override.yaml tự nạp — viết -f là tắt nó', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'b', x: 10, y: 0, w: 330, h: 70, t: 'compose.yaml', d: 'nền = thứ prod chạy', c: 'dk', mono: true },
      { id: 'o', x: 10, y: 88, w: 330, h: 70, t: 'compose.override.yaml', d: 'dev: build, mount, cổng debug', c: 'amb', mono: true },
      { id: 'p', x: 10, y: 176, w: 330, h: 70, t: 'compose.prod.yaml', d: 'prod: giới hạn, log, loopback', c: 'grn', mono: true },
      { id: 'd', x: 780, y: 20, w: 370, h: 80, t: 'docker compose up', d: 'nền + override — TỰ ĐỘNG', c: 'amb' },
      { id: 's', x: 780, y: 150, w: 370, h: 80, t: '-f compose.yaml -f compose.prod.yaml', d: 'override bị BỎ QUA', c: 'grn' },
    ], edges: [
      { from: 'b', to: 'd', c: 'dk', fs: 'r', ts: 'l' }, { from: 'o', to: 'd', c: 'amb', fs: 'r', ts: 'l' },
      { from: 'b', to: 's', c: 'dk', dash: true, fs: 'r', ts: 'l' }, { from: 'p', to: 's', c: 'grn', fs: 'r', ts: 'l' },
    ] })}
    ${term(['$ docker compose config | grep -E "NODE_ENV|published"', '      NODE_ENV: development', '        published: "18098"', '        published: "18099"', '$ docker compose -f compose.yaml config | grep -E "NODE_ENV|published"', '+      NODE_ENV: production', '        published: "18098"'], { title: 'output thật — máy Mac', fs: 14 })}` },

  { t: 'Luật hợp nhất: THAY, GỘP theo khoá, hay NỐI thêm', body: `${table(['Kiểu', 'Ví dụ khoá', 'Nền + ghi đè', 'Kết quả thật (Compose v5.5.1)'], [
    ['Giá trị đơn', '<code>image</code> <code>restart</code> <code>command</code>', 'command a.js rồi b.js', '+chỉ còn <code>b.js</code> (không nối)'],
    ['Map', '<code>environment</code> <code>labels</code>', 'NODE_ENV: development', '+NODE_ENV đổi, LOG_LEVEL/DB_ADDR giữ nguyên'],
    ['ports — khoá: ip+target+published', '<code>"18098:3000"</code> lặp lại', 'trùng hệt ở hai file', '+gộp thành MỘT, không lỗi'],
    ['ports khác cổng ngoài', '<code>"18097:3000"</code>', 'thêm vào', '!công bố CẢ HAI 18098 và 18097'],
    ['volumes — khoá: đích', '<code>./a:/data</code> rồi <code>./b:/data</code>', 'cùng đích <code>/data</code>', '+chỉ còn <code>./b</code> — file sau thay'],
    ['Danh sách khác', '<code>dns</code> <code>expose</code>', 'hai phần tử khác nhau', 'nối thêm (theo tài liệu merge)'],
  ], { sm: true })}
    ${box('tip', 'Đừng ngồi suy luận luật gộp: <code>docker compose -f a.yaml -f b.yaml config</code> in ra đúng thứ compose sẽ chạy. Mọi dòng “kết quả thật” ở trên đều đọc từ lệnh đó.')}` },

  { t: '!reset xoá cái thừa kế, !override thay trọn — không nối nữa', body: two(
    `${yaml([
      ['# compose.prod.yaml', ''],
      ['services:', ''],
      ['  api:', ''],
      ['    ports: !override', 'thay trọn danh sách'],
      ['      - "127.0.0.1:18098:3000"', 'chỉ loopback'],
      ['# r.yaml', ''],
      ['services:', ''],
      ['  api:', ''],
      ['    ports: !reset []', 'xoá sạch cổng'],
      ['    environment:', ''],
      ['      LOG_LEVEL: !reset null', 'xoá MỘT khoá'],
    ], { fs: 14 })}`,
    term(['$ docker compose -f compose.yaml \\', '    -f compose.prod.yaml config | grep -E "host_ip|published"', '+        host_ip: 127.0.0.1', '        published: "18098"', '$ docker compose -f compose.yaml -f r.yaml config \\', '    | grep -E "published|LOG_LEVEL|NODE_ENV|DB_ADDR"', '      DB_ADDR: db:5432', '      NODE_ENV: production', '# không còn published, không còn LOG_LEVEL', '$ docker compose -f compose.yaml -f o.yaml config \\', '    | grep -E "NODE|LOG|DB_"', '!      NODE_ENV: staging     # environment: !override'], { title: 'output thật — máy Mac', fs: 14 }), 'r') },

  { t: 'include ghép nguyên FILE, extends thừa kế MỘT dịch vụ', body: two(
    `${yaml([
      ['name: dk09-inc', ''],
      ['include:', ''],
      ['  - path: ./monitoring/compose.yaml', 'mang theo .env của nó'],
      ['services:', ''],
      ['  worker:', ''],
      ['    extends: { file: ./common.yaml, service: api-base }', ''],
      ['    command: ["node", "worker.js"]', ''],
      ['  scheduler:', ''],
      ['    extends: { file: ./common.yaml, service: api-base }', ''],
      ['    environment: { LOG_LEVEL: debug }', 'ghi đè 1 khoá'],
    ], { fs: 13 })}
    ${box('warn', '<code>extends</code> mang theo CẢ <code>depends_on</code> (đo trên v5.5.1): kéo từ file khác mà thiếu dịch vụ đích ⇒ lỗi <code>depends on undefined service</code>. Ba file là vừa; chín file lồng nhau thì chỉ <code>config</code> biết cái gì chạy.')}`,
    term(['$ docker compose config --services', 'scheduler', '+ uptime       # từ monitoring/compose.yaml', 'worker', '$ docker compose config \\', '    | grep -E "^  [a-z]|js|LOG|TARGET"', '  scheduler:', '      - cron.js', '      LOG_LEVEL: debug', '  uptime:', '+      TARGET: http://api:3000  # monitoring/.env', '  worker:', '      - worker.js', '      LOG_LEVEL: info', '  default:            # mạng default của dự án'], { title: 'output thật — máy Mac', fs: 14 }), 'l') },

  { t: 'Nền + dev + prod, và đọc config TRƯỚC khi deploy', body: two(
    `${tree('blog/\ncompose.yaml             # nền: ảnh, mạng, volume, healthcheck\ncompose.override.yaml    # dev: build, bind mount, cổng\ncompose.prod.yaml        # prod: limits, log, loopback\n.env.example             # commit, không giá trị thật\n.env                     # .gitignore')}
    ${yaml([
      ['# máy dev', ''],
      ['docker compose up -d', 'nền + override'],
      ['# máy chủ, trong script deploy', ''],
      ['docker compose -f compose.yaml -f compose.prod.yaml pull', ''],
      ['docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build --wait', ''],
    ], { fs: 13 })}`,
    `${term(['$ docker compose -f compose.yaml \\', '    -f compose.prod.yaml config \\', '    | grep -A3 limits', '        limits:', '          cpus: 1.5', '+          memory: "536870912"', '$ docker compose up -d --wait \\', '    >/dev/null; echo $?', '= 0'], { title: 'output thật — máy Mac', fs: 14 })}
    ${box('good', 'Script deploy luôn ghi <code>-f</code> tường minh (hoặc <code>COMPOSE_FILE=</code>) ⇒ override của máy dev không bao giờ lên server. <code>--wait</code>: chỉ trả về khi mọi dịch vụ running/healthy.')}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 9', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['api <code>Exited (1)</code> dù <code>up</code> báo ✔ Started', '<code>depends_on</code> trần chỉ chờ START', 'healthcheck + <code>condition: service_healthy</code>'],
    ['“Dữ liệu biến mất” sau khi đổi tên thư mục', 'Tên dự án đổi ⇒ volume mới', '<code>name:</code> đầu file; volume cũ vẫn còn'],
    ['CSDL dev mất trắng', 'Gõ <code>down -v</code> theo thói quen', 'Chỉ <code>down</code>; sao lưu trước (Ch.7)'],
    ['Cổng ngẫu nhiên, ảnh <code>api:</code> rỗng', 'Biến chỉ có trong <code>env_file</code>', 'Đưa vào <code>.env</code>; dùng <code>&#36;{VAR:?…}</code>'],
    ['Container luôn unhealthy, app vẫn ổn', 'Check gọi curl/wget không có trong ảnh', 'Dùng runtime của ảnh; thử bằng <code>exec</code>'],
    ['Override đổi cổng mà cổng cũ vẫn mở', 'ports nối thêm theo khoá riêng', '<code>ports: !override</code> hoặc để ports ở một tầng'],
    ['<code>down</code> xong mạng “still in use”', 'Dịch vụ có profile vẫn chạy', '<code>--profile "*" down</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 9', body: table(['Muốn…', 'Gõ'], [
    ['Dựng/cập nhật, chờ healthy', '<code>docker compose up -d --wait</code>'],
    ['Xem mọi container kể cả đã chết', '<code>docker compose ps -a</code>'],
    ['Log có giờ của một dịch vụ', '<code>docker compose logs -t --tail 50 api</code>'],
    ['File sau khi hợp nhất + thay biến', '<code>docker compose config</code> · <code>--services</code> · <code>--profiles</code>'],
    ['Kiểm cú pháp, im lặng', '<code>docker compose config -q</code>'],
    ['Dòng thời gian start/die/health', '<code>docker compose events --json</code>'],
    ['Trạng thái + lịch sử healthcheck', '<code>docker inspect -f \'{{json .State.Health}}\' &lt;ctr&gt;</code>'],
    ['Việc một lần (migration, test)', '<code>docker compose run --rm api npm test</code>'],
    ['Stack của một project bất kỳ', '<code>docker compose ls</code> · <code>-p tên down</code>'],
    ['Dev vs prod', '<code>docker compose -f compose.yaml -f compose.prod.yaml up -d</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 9 (45 phút)', body: `
    ${steps([
      ['Biến 3 lệnh <code>docker run</code> (db, api, proxy) thành <code>compose.yaml</code> có <code>name: thu-blog</code>', 'đoán trước tên mạng/volume/container rồi mới <code>up -d</code>'],
      ['Tái hiện cuộc đua: <code>depends_on</code> trần ⇒ api <code>Exited (1)</code>', 'đo bằng <code>compose events</code> + <code>logs -t</code>'],
      ['Sửa bằng healthcheck <code>-h 127.0.0.1</code> + <code>service_healthy</code> + job migrate', 'thử cả trường hợp migrate lỗi: api phải nằm ở Created'],
      ['Chuyển mật khẩu sang <code>.env</code> với <code>&#36;{DB_PASS:?…}</code>, chứng minh thứ tự ưu tiên', 'shell > --env-file > .env > mặc định'],
      ['Tách <code>compose.override.yaml</code> (dev) và <code>compose.prod.yaml</code> (<code>!override</code> cổng loopback)', 'đọc <code>config</code> của từng tổ hợp'],
    ])}
    ${box('good', '<b>Đạt khi:</b> từ volume rỗng, <code>up -d --wait</code> xong là <code>curl</code> trả lời; <code>-p thu-blog down -v</code> dọn sạch.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));
