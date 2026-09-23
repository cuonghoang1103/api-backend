/**
 * Docker · Deck dk-10 — Chương 10: Compose trong đời thật (một stack giống cuongthai.com thu nhỏ).
 *
 * MỌI output terminal trên slide là output THẬT, chạy 24/09/2026 trên máy Mac M1:
 *   Docker Desktop 4.91 / Engine 29.8.0 arm64, Docker Compose v5.5.1.
 *   Stack thử (thư mục scratch, project `dk10-blog`): nginx 1.27 · Next.js 15.5 standalone · API Express 4 +
 *   Prisma 5.22 (TypeScript) · worker · migrate · seed · postgres:16.4-alpine · redis:7.4-alpine.
 *   Riêng thí nghiệm "sed -i trên bind mount một file" chạy thêm trên máy Linux nhà (Fedora 44, Engine 29.6.2).
 * Tên project/ảnh mang tiền tố dk10- (luật an toàn của khoá); trong bài người học dùng tên `blog`.
 * Mốc thời gian lấy từ `docker inspect -f '{{.State.StartedAt}} {{.State.FinishedAt}}'` của từng container.
 */
import { S, cover, cards, box, steps, table, vs, two, kpis, bars, mindmap, term as dkTerm, diagram, yaml, tree, D, sv, R, T, A } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });
const TCSS = '<style>.g-term pre{font-size:15px;line-height:1.45}</style>';

export const deck = { key: 'dk-10', code: 'DOCKER · CHƯƠNG 10', title: 'Compose trong đời thật', sub: 'Docker · Chương 10' };

/* ───────────── Hình tự vẽ ───────────── */

/** Slide 3 — bản vẽ của stack: 2 mạng, 1 cổng, volume có tên, đường đi của request */
const stackMap = () => {
  let s = '';
  // trình duyệt
  s += R(0, 70, 132, 96, { c: 'blu', fill: '#0d1628' }) + T(66, 108, 'Trình', { fs: 17, a: 'middle', b: true }) + T(66, 130, 'duyệt', { fs: 17, a: 'middle', b: true });
  s += T(66, 152, 'curl', { fs: 13.5, a: 'middle', c: 'mu', mono: true });
  // máy chủ
  s += R(150, 0, 1010, 520, { c: 'dim', dash: true, fill: 'rgba(17,26,43,.35)', r: 16 });
  s += T(170, 26, 'Máy chủ · Docker Engine · project dk10-blog', { fs: 15, c: 'mu', mono: true });
  // hai mạng
  s += R(168, 40, 974, 174, { c: 'blu', fill: 'rgba(88,166,255,.06)', r: 12, sw: 2 });
  s += T(184, 64, 'mạng public', { fs: 15, c: 'blu', b: true, mono: true });
  s += R(168, 236, 974, 272, { c: 'tea', fill: 'rgba(45,212,191,.06)', r: 12, sw: 2, dash: true });
  s += T(184, 500, 'mạng private · internal: true — không có đường ra Internet', { fs: 15, c: 'tea', b: true, mono: true });
  const box = (x, y, w, h, n, sub, c, o = {}) => R(x, y, w, h, { c, fill: '#0f182a', ...o }) +
    T(x + w / 2, y + (sub ? h / 2 - 3 : h / 2 + 6), n, { fs: 17, a: 'middle', b: true, mono: true }) +
    (sub ? T(x + w / 2, y + h / 2 + 20, sub, { fs: 13.5, a: 'middle', c: 'mu' }) : '');
  // cổng
  s += R(150, 96, 26, 44, { c: 'amb', fill: D.amb, r: 5 });
  s += A(136, 118, 196, 118, { c: 'amb' }) + T(164, 88, ':18100', { fs: 14, a: 'middle', c: 'amb', b: true, mono: true });
  s += box(200, 78, 180, 84, 'nginx', 'cổng DUY NHẤT mở', 'amb');
  s += box(462, 78, 190, 84, 'web', 'Next.js :3000', 'blu');
  s += R(740, 78, 190, 262, { c: 'dk', fill: '#0f182a' }) + T(835, 112, 'api', { fs: 17, a: 'middle', b: true, mono: true });
  s += T(835, 136, 'Express :3000', { fs: 13.5, a: 'middle', c: 'mu' });
  s += T(835, 222, 'ở CẢ HAI', { fs: 14.5, a: 'middle', c: 'dk', b: true }) + T(835, 242, 'mạng', { fs: 14.5, a: 'middle', c: 'dk', b: true });
  const dbx = (y, n, sub, vol, c) => R(990, y, 150, 78, { c, fill: '#0f182a' }) + T(1065, y + 26, n, { fs: 17, a: 'middle', b: true, mono: true }) +
    T(1065, y + 47, sub, { fs: 13.5, a: 'middle', c: 'mu' }) + T(1065, y + 68, vol, { fs: 12.5, a: 'middle', c: 'vio', mono: true });
  s += dbx(250, 'db', 'postgres 16', 'vol: pgdata', 'grn');
  s += dbx(342, 'cache', 'redis 7', 'vol: redisdata', 'vio');
  s += box(462, 274, 190, 72, 'worker', 'cùng ảnh với api', 'dk');
  s += box(200, 274, 180, 72, 'migrate', 'chạy 1 lần → exit 0', 'amb', { dash: true });
  s += T(290, 372, 'seed (profile) giống thế', { fs: 13.5, a: 'middle', c: 'mu' });
  // đường đi
  s += A(380, 104, 458, 104, { c: 'amb' }) + T(419, 96, '/', { fs: 14, a: 'middle', c: 'amb', mono: true });
  s += `<path d="M290 162 L290 190 L732 190" stroke="${D.amb}" stroke-width="3" fill="none" marker-end="url(#m-amb)"/>` + T(520, 184, '/api/ → api:3000', { fs: 14, a: 'middle', c: 'amb', mono: true });
  s += A(652, 128, 736, 128, { c: 'dk' }) + T(694, 120, 'SSR', { fs: 13.5, a: 'middle', c: 'dk', mono: true });
  s += A(930, 280, 986, 280, { c: 'grn' }) + A(930, 330, 986, 372, { c: 'vio' });
  s += `<path d="M557 346 L557 396 L986 396" stroke="${D.dk}" stroke-width="3" fill="none" stroke-dasharray="7 6" marker-end="url(#m-dk)"/>` + T(760, 388, 'worker lấy việc từ cache, ghi db', { fs: 13.5, a: 'middle', c: 'mu' });
  // nginx không tới được db
  s += T(560, 440, 'nginx → db: không phân giải nổi tên (khác mạng)', { fs: 14.5, a: 'middle', c: 'red', b: true });
  s += T(560, 464, 'db → Internet: wget: bad address', { fs: 14.5, a: 'middle', c: 'red', mono: true });
  return sv(1160, 520, s);
};

/** Slide 6 — dòng thời gian `docker compose up -d` lần đầu (số đo thật, giây kể từ container đầu tiên start) */
const upTimeline = () => {
  const X = (t) => 210 + t * 38; // 0..24 s
  let s = '';
  for (let t = 0; t <= 24; t += 2) s += `<line x1="${X(t)}" y1="10" x2="${X(t)}" y2="350" stroke="#1d2a40"/>` + T(X(t), 372, `${t}s`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  const rows = [
    ['cache', 'redis', 0.0, 5.5, null, 'vio'],
    ['db', 'postgres', 0.09, 5.68, null, 'grn'],
    ['migrate', 'prisma migrate deploy', 5.68, null, 11.07, 'amb'],
    ['worker', 'không healthcheck', 11.25, 11.25, null, 'dk'],
    ['api', 'đợi migrate exit 0', 11.32, 16.91, null, 'dk'],
    ['web', 'đợi api healthy', 16.91, 22.48, null, 'blu'],
    ['nginx', 'đợi web + api healthy', 22.48, 22.48, null, 'amb'],
  ];
  rows.forEach(([n, sub, st, hl, ex, c], i) => {
    const y = 18 + i * 47;
    s += T(0, y + 12, n, { fs: 17, b: true, mono: true }) + T(0, y + 32, sub, { fs: 13, c: 'mu' });
    if (ex) {
      s += `<rect x="${X(st)}" y="${y}" width="${X(ex) - X(st)}" height="26" rx="6" fill="${D[c]}" opacity=".55"/>`;
      s += T(X(ex) + 10, y + 19, `exit 0 · ${(ex - st).toFixed(1).replace('.', ',')} s`, { fs: 14.5, c: 'grn', b: true, mono: true });
      return;
    }
    if (hl > st) s += `<rect x="${X(st)}" y="${y}" width="${X(hl) - X(st)}" height="26" rx="6" fill="${D[c]}" opacity=".22"/>`;
    s += `<rect x="${X(hl)}" y="${y}" width="${X(24.5) - X(hl)}" height="26" rx="6" fill="${D[c]}" opacity=".6"/>`;
    s += `<circle cx="${X(st)}" cy="${y + 13}" r="6" fill="${D.amb}"/>`;
  });
  s += T(X(5.68) + 4, 108, '↑ db healthy ⇒ migrate chạy', { fs: 13.5, c: 'grn' });
  s += T(X(24.5), 396, 'nhạt = đang chờ healthcheck · đậm = healthy / đang chạy', { fs: 14, a: 'end', c: 'mu' });
  return sv(1160, 402, s);
};

/** Slide 16 — deploy làm mất API khi migrate hỏng: dòng thời gian của một lệnh up */
const failFlow = () => {
  let s = '';
  const st = (x, n, sub, c, o = {}) => R(x, 20, 250, 96, { c, fill: '#0f182a', ...o }) + T(x + 125, 58, n, { fs: 17, a: 'middle', b: true }) + T(x + 125, 86, sub, { fs: 14, a: 'middle', c: 'mu', mono: true });
  s += st(0, '1 · Recreate', 'db · migrate · api · worker', 'amb');
  s += st(300, '2 · xoá api CŨ', 'Container … Recreated', 'red');
  s += st(600, '3 · migrate chạy', 'P1000 → exit 1', 'red');
  s += st(900, '4 · api MỚI: Created', 'không bao giờ start', 'red', { dash: true });
  [[250, 296], [550, 596], [850, 896]].forEach(([a, b]) => { s += A(a, 68, b, 68, { c: 'red' }); });
  return sv(1150, 124, s);
};

/** Slide 29 — ba lần khởi động cùng stack */
const startBars = () => bars([
  { l: 'Như file cũ', sub: 'interval 5s · npx prisma', v: 22.48, txt: '22,5 s tới lúc nginx start', c: 'red' },
  { l: '+ start_interval: 1s', sub: 'healthcheck dày lúc khởi động', v: 10.52, txt: '10,5 s', c: 'amb' },
  { l: '+ bỏ npx', sub: './node_modules/.bin/prisma', v: 5.42, txt: '5,4 s', c: 'grn' },
], { lw: 290, max: 24 });

export const slides = S([
  cover({ t: 'Chương 10 — Compose trong đời thật', sub: 'Bản vẽ stack · Postgres + Redis · API + worker + migration · Next.js · nginx đứng trước — dựng và chạy thật', chap: 'CHƯƠNG 10' }),

  { t: 'Bản đồ chương: một stack thật, năm bài', body: mindmap('Stack dk10-blog', '7 dịch vụ · 2 mạng · 1 cổng', [
    { t: '10.1 Bản vẽ', d: 'ai nói với ai, mạng nào, cổng nào — trước khi viết dịch vụ', c: 'dk' },
    { t: '10.2 Tầng dữ liệu', d: 'Postgres + Redis: khởi tạo MỘT lần, lưu lâu dài, nâng bản', c: 'grn' },
    { t: '10.3 API · worker · migrate', d: 'một ảnh ba vai, migration là cổng chặn', c: 'amb' },
    { t: '10.4 Next.js', d: 'standalone, NEXT_PUBLIC nướng lúc dựng, HOSTNAME', c: 'blu' },
    { t: '10.5 nginx + cả file', d: 'proxy, dấu / cuối, bind mount, deploy + smoke test', c: 'vio' },
  ]) },

  /* ───────────── 10.1 ───────────── */
  { t: 'Bảy dịch vụ, hai mạng — và CHỈ nginx mở cổng', body: stackMap() },

  { t: 'Hai mạng là một chính sách: nginx không thấy nổi db', body: two(
    term(['$ for s in nginx web api worker; do', '>   docker compose exec $s getent hosts db \\', '>     || echo "$s: không phân giải được"; done', '! nginx: không phân giải được', '! web: không phân giải được', '= 172.22.0.2        db  db', '= 172.22.0.2        db  db', '$ docker compose exec db wget -T 3 -qO- http://example.com', "! wget: bad address 'example.com'", '$ docker compose exec api \\', '>   wget -T 3 -qO- http://example.com >/dev/null \\', '>   && echo "api ra được Internet"', 'api ra được Internet'], { title: 'output thật — stack dk10-blog, máy Mac' }),
    `${table(['Dịch vụ', 'Mạng', 'Cổng ra máy chủ'], [
      ['nginx', 'public', '!127.0.0.1:18100→80'],
      ['web', 'public', '-không'],
      ['api', '+public + private', '-không'],
      ['worker · migrate', 'private', '-không'],
      ['db · cache', 'private', '-không'],
    ], { sm: true })}
    ${box('info', '<b>Luật chọn mạng:</b> một dịch vụ vào một mạng chỉ khi nó phải <b>chủ động mở</b> kết nối trên mạng đó. api là cái DUY NHẤT nối hai thế giới.')}`, 'l') },

  { t: 'compose.yaml đọc như một bản vẽ: mạng trước, dịch vụ sau', body: two(
    yaml([
      ['name: dk10-blog', 'tên project ⇒ tiền tố mọi thứ'],
      ['services:', ''],
      ['  nginx:   { networks: [public] }', 'mở cổng 18100'],
      ['  web:     { networks: [public] }', ''],
      ['  api:     { networks: [public, private] }', 'cầu nối duy nhất'],
      ['  worker:  { networks: [private] }', ''],
      ['  migrate: { networks: [private] }', 'restart: "no"'],
      ['  db:      { networks: [private] }', ''],
      ['  cache:   { networks: [private] }', ''],
      ['networks:', ''],
      ['  public:', 'bridge thường'],
      ['  private:', ''],
      ['    internal: true', 'không có cổng ra ngoài'],
      ['volumes: { pgdata: {}, redisdata: {} }', 'sống qua down'],
    ], { fs: 15 }),
    `${term(['$ docker compose ps --format \\', ">   'table {{.Service}}\\t{{.Ports}}'", 'SERVICE   PORTS', 'api       3000/tcp', 'cache     6379/tcp', 'db        5432/tcp', '+ nginx     127.0.0.1:18100->80/tcp', 'web       3000/tcp', 'worker    3000/tcp'], { title: 'output thật' })}
    ${box('tip', '<code>3000/tcp</code> không có mũi tên = chỉ là <code>EXPOSE</code> ghi trong ảnh, KHÔNG mở ra máy chủ. worker hiện 3000 vì dùng chung ảnh với api.')}`, 'l') },

  { t: 'depends_on + healthcheck = thứ tự khởi động CÓ ĐIỀU KIỆN', body: `
    ${upTimeline()}
    ${box('info', 'Đo thật lần <code>up -d</code> đầu tiên: db healthy thì migrate mới chạy; migrate <b>exit 0</b> thì api + worker mới start; api healthy thì web; web healthy thì nginx. Tổng 22,5 s — slide 29 rút còn 5,4 s.')}` },

  { t: 'Cây thư mục và bốn quyết định định hình mọi thứ', body: two(
    tree(`blog/
├── compose.yaml          # bản vẽ: 7 dịch vụ
├── .env                  # KHÔNG commit
├── Dockerfile.backend    # api · worker · migrate · seed
├── package.json
├── src/                  # index.ts · worker.ts · seed.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── frontend/
│   ├── Dockerfile        # Next.js standalone
│   └── app/
└── ops/
    ├── nginx.conf
    └── postgres-init/`),
    cards([
      { ic: '1', t: 'Một cổng', d: 'Chỉ nginx publish. Không có cổng DB nào để quên.', c: 'amb' },
      { ic: '2', t: 'Migration là dịch vụ', d: 'api chỉ start khi migrate <strong>exit 0</strong>.', c: 'grn' },
      { ic: '3', t: 'Một ảnh, nhiều vai', d: 'api · worker · migrate · seed khác nhau đúng <code>command</code>.', c: 'blu' },
      { ic: '4', t: 'Mạng là quyền', d: 'Viết <code>networks:</code> trước, dịch vụ sau.', c: 'vio' },
    ], 2), 'r') },

  /* ───────────── 10.2 ───────────── */
  { t: 'Dịch vụ db: mỗi dòng trả lời một câu hỏi', body: yaml([
    ['db:', ''],
    ['  image: postgres:16.4-alpine', 'ghim bản phụ: 17 KHÔNG đọc được dữ liệu 16'],
    ['  environment:', ''],
    ['    POSTGRES_USER: ${POSTGRES_USER:-blog}', 'thiếu thì dùng "blog"'],
    ['    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?set it}', 'thiếu ⇒ compose DỪNG, báo lỗi'],
    ['    PGDATA: /var/lib/postgresql/data/pgdata', 'thư mục con: lost+found không phá initdb'],
    ['    TZ: Asia/Ho_Chi_Minh', 'giờ trong log là +07'],
    ['  volumes:', ''],
    ['    - pgdata:/var/lib/postgresql/data', 'volume CÓ TÊN, sống qua down'],
    ['    - ./ops/postgres-init:/docker-entrypoint-initdb.d:ro', 'chạy MỘT lần, khi rỗng'],
    ['  healthcheck:', ''],
    ['    test: ["CMD-SHELL", "pg_isready -U blog -d blog"]', 'nhận kết nối chưa?'],
    ['    interval: 5s   retries: 10   start_period: 30s', ''],
    ['  command: ["postgres", "-c", "max_connections=100",', 'tham số qua -c,'],
    ['            "-c", "log_min_duration_statement=500"]', 'log truy vấn > 0,5 s'],
    ['  networks: [private]', 'không cổng, không Internet'],
  ], { fs: 15 }) },

  { t: 'initdb.d chạy ĐÚNG MỘT lần — lúc thư mục dữ liệu còn rỗng', body: two(
    term(['$ docker compose up -d db   # volume mới tinh', '$ docker compose logs db --no-log-prefix | grep -E \\', ">     'initdb.d|EXTENSION|init process|ready to'", '… [42] LOG:  database system is ready to accept…', '+ …: running /docker-entrypoint-initdb.d/01-exten…', 'CREATE EXTENSION', 'CREATE EXTENSION', 'CREATE EXTENSION', 'PostgreSQL init process complete; ready for start up.', '= … [1] LOG:  database system is ready to accept…'], { title: 'lần 1 — output thật' }),
    `${term(['$ docker compose restart db', '$ docker compose logs db --no-log-prefix --since 20s', '! PostgreSQL Database directory appears to contain', '! a database; Skipping initialization', '… [1] LOG:  starting PostgreSQL 16.4 on aarch64…'], { title: 'lần 2 — output thật' })}
    ${box('warn', 'Hai dòng "ready to accept": <b>[42]</b> là máy chủ TẠM lúc khởi tạo (chỉ nghe socket), <b>[1]</b> mới là máy chủ thật. Thêm extension vào script sau này ⇒ DB cũ <b>không bao giờ</b> thấy.')}`) },

  { t: 'Đổi POSTGRES_PASSWORD trong .env: DB phớt lờ, site 502', body: two(
    term(['$ sed -i \'\' \'s/dk10-mat-khau-thu/dk10-mat-khau-MOI/g\' .env', '$ docker compose up -d', ' Container dk10-blog-db-1 Recreate', ' Container dk10-blog-api-1 Recreate', '! Container dk10-blog-migrate-1 Error service "migrate"', "!   didn't complete successfully: exit 1", '$ docker compose logs migrate --no-log-prefix | grep P1000', '! Error: P1000: Authentication failed against database', '!   server at `db`, the provided database credentials…', '$ curl -s -o /dev/null -w \'%{http_code}\' …/api/v1/posts', '! 502'], { title: 'output thật' }),
    `${steps([
      ['<code>POSTGRES_PASSWORD</code> chỉ đọc lúc <b>initdb</b>', 'volume cũ vẫn giữ mật khẩu cũ'],
      ['Sửa bằng SQL, không bằng <code>down -v</code>', '<code>docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD \'…\'"</code> → <code>ALTER ROLE</code>'],
      ['<code>docker compose up -d</code> lại', 'migrate exit 0 → api healthy → <code>posts 200</code>'],
    ])}
    ${box('bad', '<code>down -v</code> “cho sạch” = <b>xoá cả cơ sở dữ liệu</b>. Lệnh <code>psql</code> trong container không cần mật khẩu (socket nội bộ được tin).')}`, 'l') },

  { t: 'Redis: lưu lâu dài + maxmemory — hai quyết định bắt buộc', body: two(
    `${yaml([
      ['cache:', ''],
      ['  image: redis:7.4-alpine', ''],
      ['  command: ["redis-server",', ''],
      ['    "--appendonly", "yes",', 'AOF: ghi mỗi lệnh ra đĩa'],
      ['    "--maxmemory", "256mb",', 'trần bộ nhớ'],
      ['    "--maxmemory-policy", "allkeys-lru",', 'đầy ⇒ đẩy khoá cũ'],
      ['    "--save", "300 10"]', 'RDB: 5 phút/10 lần ghi'],
      ['  volumes: [redisdata:/data]', ''],
      ['  healthcheck: { test: ["CMD", "redis-cli", "ping"] }', ''],
    ], { fs: 14.5 })}
    ${table(['Chế độ', 'Mất gì khi sập', 'Hợp với'], [['Không lưu', '-Tất cả', 'cache tính lại được'], ['RDB (<code>--save</code>)', '!Từ lần chụp cuối', 'cache muốn giữ'], ['AOF (<code>--appendonly</code>)', '+~1 giây', 'phiên đăng nhập, hàng đợi']], { sm: true })}`,
    term(['$ docker compose exec cache \\', '>   redis-cli info memory | grep -E \\', ">   'used_memory_human|maxmemory_human|policy'", 'used_memory_human:1.07M', 'maxmemory_human:256.00M', '+ maxmemory_policy:allkeys-lru', '$ docker compose exec cache \\', '>   ls /data/appendonlydir', 'appendonly.aof.1.base.rdb', 'appendonly.aof.1.incr.aof', 'appendonly.aof.manifest', '$ docker compose exec cache \\', '>   redis-server --version', 'Redis server v=7.4.11 sha=00000000:0 …'], { title: 'output thật' }), 'l') },

  { t: 'Nâng 16 → 17: dữ liệu KHÔNG tự đi theo — phải đổ ra, đổ lại', body: two(
    term(['# đổi tag sang 17 trên volume cũ:', '! FATAL:  database files are incompatible with server', '! DETAIL:  The data directory was initialized by', '!   PostgreSQL version 16, which is not compatible', '!   with this version 17.6.', '# cách đúng: đổ ra bằng bản 16, đổ vào bản 17', '$ docker exec -i dk10-pg16 pg_dumpall -U blog > dump.sql', '# xoá dk10-pg16, volume MỚI, chạy postgres:17.6-alpine', '$ docker exec -i dk10-pg17 psql -U blog -d postgres < dump.sql', '+ ERROR:  role "blog" already exists', '+ ERROR:  database "blog" already exists', '$ docker exec dk10-pg17 psql -U blog -tAc \\', ">   'select count(*) from post'", '= 1284'], { title: 'output thật — dump 19,7 kB, 1284 dòng' }),
    `${box('info', 'Hai dòng <b>ERROR</b> là <b>bình thường</b>: ảnh 17 đã tự tạo role và DB <code>blog</code> từ <code>POSTGRES_USER/DB</code>. Kiểm bằng <code>count(*)</code>, đừng bằng mắt.')}
    ${box('warn', '<b>postgres:18</b> đổi chỗ cất dữ liệu: <code>PGDATA=/var/lib/postgresql/18/docker</code>, VOLUME ở <code>/var/lib/postgresql</code>. Gắn volume vào <code>…/data</code> như bản 16 ⇒ container <b>từ chối khởi động</b> (đo thật: exit 1).')}`, 'l') },

  /* ───────────── 10.3 ───────────── */
  { t: 'Dockerfile.backend: ba tầng, chỉ tầng cuối được ship', body: yaml([
    ['FROM node:22.11-alpine AS deps', 'tầng 1: chỉ cài thư viện'],
    ['COPY package.json package-lock.json ./', ''],
    ['COPY prisma ./prisma', 'TRƯỚC npm ci: postinstall cần schema'],
    ['RUN --mount=type=cache,target=/root/.npm npm ci', 'cache npm giữa các lần build'],
    ['FROM node:22.11-alpine AS build', 'tầng 2: biên dịch'],
    ['COPY --from=deps /app/node_modules ./node_modules', ''],
    ['COPY . .', ''],
    ['RUN npm run build', 'tsc: src/ → dist/ (có cả seed.ts)'],
    ['RUN npm prune --omit=dev', 'bỏ typescript, tsx, @types'],
    ['FROM node:22.11-alpine AS production', 'tầng 3: thứ được ship'],
    ['RUN apk add --no-cache tini', 'init 135 kB làm PID 1'],
    ['COPY --from=build --chown=node:node /app/node_modules ./node_modules', '121 MB'],
    ['COPY --from=build --chown=node:node /app/dist ./dist', '24,6 kB'],
    ['COPY --from=build --chown=node:node /app/prisma ./prisma', 'migrations đi theo ảnh'],
    ['USER node', 'không chạy bằng root'],
    ['ENTRYPOINT ["/sbin/tini", "--"]', ''],
    ['CMD ["node", "dist/index.js"]', 'vai mặc định: api'],
  ], { fs: 14.5, lang: 'docker' }) },

  { t: 'Một ảnh, bốn vai — khác nhau đúng một dòng command', body: two(
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${[
      ['api', 'CMD mặc định', 'node dist/index.js', 'dk'],
      ['worker', 'command:', 'node dist/worker.js', 'blu'],
      ['migrate', 'restart: "no"', 'prisma migrate deploy', 'amb'],
      ['seed', 'profiles: [seed]', 'prisma db seed', 'vio'],
    ].map(([n, k, c, co]) => `<div style="border:2px solid ${D[co]};border-radius:12px;padding:10px 14px;background:#0d1628"><div style="font-weight:800;font-size:19px">${n}</div><div style="font-size:14px;color:${D.mu}">${k}</div><code style="font-size:14.5px">${c}</code></div>`).join('')}</div>
    <p style="font-size:16px;color:${D.mu};margin-top:12px;text-align:center">image: <code>dk10-api:1.0.2</code> — cả bốn</p>`,
    `${term(['$ docker compose exec api ps -o pid,user,args', 'PID   USER     COMMAND', '+     1 node     /sbin/tini -- node dist/index.js', '    7 node     node dist/index.js', '$ curl -s -X POST localhost:18100/api/v1/jobs', '{"queued":1}', '$ curl -s -X POST localhost:18100/api/v1/jobs', '{"queued":1}', '$ docker compose logs worker --no-log-prefix', 'worker: waiting for jobs', '= worker: done job #1 (resize)', '= worker: done job #2 (resize)'], { title: 'output thật' })}
    ${box('good', 'Dựng MỘT lần ⇒ worker không thể chạy mã cũ hơn api.')}`) },

  { t: 'Engine Prisma phải khớp libc VÀ kiến trúc của ảnh chạy', body: two(
    term(['$ docker compose exec api sh -c \\', ">   'ls node_modules/.prisma/client/*.node; uname -m'", '+ …/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node', '…/libquery_engine-linux-musl-openssl-3.0.x.so.node', 'aarch64', '$ docker compose exec api node -e \\', '>   "fetch(\'http://127.0.0.1:3000/health\')…"', "= { ok: true, version: '1.0.2' }"], { title: 'đúng — deps/build/production đều alpine' }),
    `${term(['# deps + build trên node:22.11-bookworm-slim,', '# production trên alpine — đúng kiểu sự cố 502', '…/libquery_engine-linux-arm64-openssl-1.1.x.so.node', '…/libquery_engine-linux-musl-openssl-3.0.x.so.node', '! Prisma Client could not locate the Query Engine for', '!   runtime "linux-musl-arm64-openssl-3.0.x".', '! …generated for "linux-arm64-openssl-1.1.x", but the', '!   actual deployment required "linux-musl-arm64-…"'], { title: 'sai — ảnh dk10-api:sai, output thật' })}
    ${box('warn', 'Build xanh, ảnh vẫn chết. <code>native</code> = nơi chạy <code>npm ci</code> (ở đây Debian glibc, thiếu openssl ⇒ 1.1.x). <code>linux-musl-openssl-3.0.x</code> là Alpine <b>amd64</b> — cứu VPS, không cứu Mac M1.')}`) },

  { t: 'Migration hỏng: cổng chặn giữ schema, KHÔNG giữ site', body: `
    ${failFlow()}
    ${two(
    vs({
      no: { t: '<code>docker compose up -d</code> thẳng', items: ['Compose xoá api cũ TRƯỚC khi biết migrate có qua không', 'api mới nằm <code>Created</code>, nginx báo <b>502</b>', 'web healthcheck gọi <code>/</code> (SSR → api) ⇒ web cũng <b>unhealthy</b>'] },
      yes: { t: 'Chạy migrate RIÊNG trước', items: ['<code>TAG=1.0.1 docker compose run --rm migrate</code>', 'hỏng ⇒ exit 1, api 1.0.0 vẫn chạy: <b>posts 200</b>', 'qua ⇒ mới <code>docker compose up -d</code>'] },
    }),
    box('info', 'Đo thật trên stack dk10-blog. <code>service_completed_successfully</code> chỉ hứa: <b>không có gì chạy trên schema dở dang</b>. Nó không hứa site còn sống.'), 'l')}` },

  { t: 'P3018 rồi P3009: một migration hỏng chặn MỌI lần deploy sau', body: two(
    term(['# migration: ADD COLUMN "slug" TEXT NOT NULL', '$ TAG=1.0.1 docker compose run --rm migrate', 'Applying migration `20260924100000_add_slug`', '! Error: P3018', '! ERROR: column "slug" of relation "Post" contains', '!   null values', '$ TAG=1.0.1 docker compose run --rm migrate  # thử lại', '! Error: P3009', '! migrate found failed migrations in the target', '!   database, new migrations will not be applied.'], { title: 'output thật' }),
    `${steps([
      ['Đọc bảng <code>_prisma_migrations</code>', '<code>finished_at</code> rỗng = migration dở. ĐỪNG sửa tay.'],
      ['Đánh dấu đã lùi — CHỈ khi chắc nó chưa áp gì', '<code>… run --rm migrate prisma migrate resolve --rolled-back 20260924100000_add_slug</code>'],
      ['Viết migration MỚI đúng cách', 'thêm cột cho phép NULL → <code>UPDATE</code> điền → <code>SET NOT NULL</code>'],
      ['Build 1.0.2 → <code>run --rm migrate</code> → <code>up -d</code>', '<code>All migrations have been successfully applied.</code>'],
    ])}
    ${box('warn', 'Trên production: dừng, báo người phụ trách, KHÔNG tự <code>resolve</code> khi chưa biết migration đã áp tới đâu.')}`, 'l') },

  { t: 'Seed nằm sau profile — và cái bẫy: tsx đã bị prune', body: two(
    term(['$ docker compose run --rm seed', 'Running seed command `tsx prisma/seed.ts` ...', '! An error occurred while running the seed command:', '! Error: Command failed with ENOENT: tsx prisma/seed.ts', '! spawn tsx ENOENT', '# sửa: seed vào src/, tsc biên dịch, seed = node dist/seed.js', '$ docker compose run --rm seed', 'Running seed command `node dist/seed.js` ...', '= seeded 3 posts', '🌱  The seed command has been executed.'], { title: 'output thật' }),
    `${term(['# thêm cột slug bắt buộc vào schema, build lại:', '! src/seed.ts(5,5): error TS2741: Property \'slug\' is', "!   missing in type '{ title: string; }' but required", "!   in type 'PostCreateManyInput'."], { title: 'build DỪNG — output thật' })}
    ${box('good', 'Seed nằm trong <code>src/</code> ⇒ <code>tsc</code> kiểm nó mỗi lần build. Đổi schema mà quên seed thì <b>build đỏ ở máy bạn</b>, không phải seed đỏ trên production.')}`, 'l') },

  /* ───────────── 10.4 ───────────── */
  { t: 'frontend/Dockerfile: standalone chỉ cần chép BA thứ', body: yaml([
    ['FROM node:22.11-alpine AS deps', ''],
    ['RUN --mount=type=cache,target=/root/.npm npm ci', ''],
    ['FROM node:22.11-alpine AS build', ''],
    ['ARG NEXT_PUBLIC_SITE_URL', 'nhận từ build.args của compose'],
    ['ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}', 'next build ĐỌC nó ở đây — nướng vào JS'],
    ['COPY --from=deps /app/node_modules ./node_modules', ''],
    ['COPY . .', ''],
    ['RUN npm run build', 'next.config.js: output: "standalone"'],
    ['FROM node:22.11-alpine AS production', ''],
    ['ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000', 'HOSTNAME: slide 23'],
    ['COPY --from=build /app/public ./public', '① ảnh, logo, favicon'],
    ['COPY --from=build --chown=node:node /app/.next/standalone ./', '② server.js + node_modules đã tỉa'],
    ['COPY --from=build --chown=node:node /app/.next/static ./.next/static', '③ JS/CSS có mã băm'],
    ['USER node', ''],
    ['CMD ["node", "server.js"]', 'không cần next start'],
  ], { fs: 14.5, lang: 'docker' }) },

  { t: 'standalone: cùng trang web, ảnh nhỏ đi hơn ba lần', body: two(
    `${kpis([{ v: '1.01GB', l: 'dừng ở tầng build', c: 'red' }, { v: '318MB', l: 'ảnh standalone', c: 'grn' }])}
    ${term(['$ docker images --filter reference=\'dk10-web*\'', 'IMAGE                 ID             DISK USAGE   CONTENT SIZE   EXTRA', '! dk10-web-full:1.0.2   050f7a053c70       1.01GB          228MB', 'dk10-web:1.0.0        67e0e04205b0        318MB         78.2MB   U', '+ dk10-web:1.0.2        362bb21e989f        318MB         78.2MB   U'], { title: 'output thật — Next.js 15.5', fs: 13 })}`,
    `${term(['$ docker run --rm dk10-web:1.0.2 du -sh /app', '= 72.7M  /app', '$ docker run --rm dk10-web-full:1.0.2 \\', '>   du -sh /app/node_modules /app/.next', '! 477.1M /app/node_modules', '114.6M /app/.next', '$ docker compose exec web node -e \\', '>   "…require(\'sharp\').versions…"', '+ sharp 0.35.4 libvips 8.18.6'], { title: 'output thật' })}
    ${box('info', 'Phần còn lại của 318 MB là ảnh nền node:alpine. Next 15 tự mang <b>sharp</b> vào standalone — không cần <code>apk add vips-dev</code>.')}`, 'l') },

  { t: 'NEXT_PUBLIC_* nướng vào JS lúc BUILD — env lúc chạy vô ích', body: two(
    term(['$ docker compose exec web sh -c \\', '>   \'grep -rl "http://localhost:18100" .next/static/chunks\'', '+ .next/static/chunks/app/page-112490d1d7e185aa.js', '$ docker run --rm -e NEXT_PUBLIC_SITE_URL=https://khac.example \\', '>   dk10-web:1.0.2 sh -c \\', '>   \'grep -rl "khac.example" .next/static/chunks | wc -l\'', '! 0'], { title: 'output thật' }),
    `${table(['', 'Biến server (INTERNAL_API_URL)', 'NEXT_PUBLIC_*'], [
      ['Đọc lúc', '+CHẠY — <code>process.env</code>', '!BUILD — thành chuỗi hằng'],
      ['Đổi giá trị', 'sửa env, tạo lại container', '-phải build lại ảnh'],
      ['Ai thấy', 'chỉ server', '-MỌI trình duyệt'],
      ['Khai ở compose', '<code>environment:</code>', '<code>build.args:</code>'],
    ], { sm: true })}
    ${box('bad', 'Khoá API bên thứ ba mang tiền tố <code>NEXT_PUBLIC_</code> = <b>công bố</b> khoá. Dùng proxy ở backend.')}`, 'l') },

  { t: 'SSR gọi api:3000, trình duyệt gọi /api — hai URL, một API', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'b', x: 10, y: 30, w: 210, h: 76, t: 'Trình duyệt', d: "fetch('/api/v1/posts')", c: 'blu' },
      { id: 'n', x: 340, y: 30, w: 210, h: 76, t: 'nginx', d: 'localhost:18100', c: 'amb', mono: true },
      { id: 'a', x: 920, y: 30, w: 230, h: 76, t: 'api:3000', d: 'Express', c: 'dk', mono: true },
      { id: 'w', x: 600, y: 164, w: 230, h: 76, t: 'web (Next.js)', d: 'INTERNAL_API_URL', c: 'blu' },
    ], edges: [
      { from: 'b', to: 'n', t: 'cùng origin', c: 'blu' },
      { from: 'n', to: 'a', t: 'location /api/', c: 'amb' },
      { from: 'n', to: 'w', t: 'location /', c: 'amb', fs: 'b', ts: 'l' },
      { from: 'w', to: 'a', t: 'SSR: http://api:3000', c: 'dk', fs: 'r', ts: 'b', off: 22 },
    ] })}
    ${term(['$ curl -s localhost:18100/ | sed \'s/<!-- -->//g\' | grep -o \'SSR qua [^<]*\' | head -1', '= SSR qua http://api:3000: 6 bài', "$ curl -s localhost:18100/api/v1/posts | head -c 60", '[{"id":1,"title":"Docker cho người mới","slug":"bai-1",…'], { title: 'output thật — cả hai đường cùng trả dữ liệu' })}` },

  { t: 'HOSTNAME: Docker tự đặt nó = ID container, Next nghe theo nó', body: two(
    term(['$ docker run --rm alpine printenv HOSTNAME', 'f21c25392e1e                 # Docker tự đặt', '$ docker run --rm dk10-web:1.0.2 grep -n HOSTNAME server.js', "9:const hostname = process.env.HOSTNAME || '0.0.0.0'", '# chạy web với HOSTNAME = tên container:', '$ docker exec dk10-webtest netstat -tln | grep 3000', '! tcp  0  0 172.22.0.5:3000   0.0.0.0:*   LISTEN', '$ docker exec dk10-webtest node -e \\', '>   "fetch(\'http://127.0.0.1:3000/\')…"', '! 127.0.0.1 → ECONNREFUSED', '$ docker exec dk10-blog-web-1 netstat -tln | grep 3000', '= tcp  0  0 0.0.0.0:3000      0.0.0.0:*   LISTEN'], { title: 'output thật (khoảng trắng của netstat đã thu gọn)' }),
    `${steps([
      ['Không có <code>ENV HOSTNAME</code> trong ảnh', 'Docker điền ID container ⇒ Next chỉ nghe <b>một</b> IP'],
      ['Healthcheck gọi <code>127.0.0.1:3000</code>', '<b>ECONNREFUSED</b> ⇒ unhealthy ⇒ nginx (depends_on healthy) không lên'],
      ['Container ở hai mạng', 'chỉ mạng có IP đó gọi được — mạng kia 502'],
    ])}
    ${box('good', '<code>ENV HOSTNAME=0.0.0.0</code> trong ảnh (hoặc <code>environment:</code>) ⇒ nghe mọi giao diện.')}`, 'l') },

  /* ───────────── 10.5 ───────────── */
  { t: 'ops/nginx.conf: từng dòng làm một việc', body: yaml([
    ['upstream api { server api:3000; keepalive 32; }', 'tên dịch vụ + giữ kết nối'],
    ['upstream web { server web:3000; keepalive 32; }', ''],
    ['server {', ''],
    ['  listen 80;', 'CHỈ IPv4 — healthcheck gọi 127.0.0.1'],
    ['  client_max_body_size 25m;', 'mặc định 1m ⇒ 413'],
    ['  location = /healthz { return 200 "ok\\n"; }', 'cho healthcheck của nginx'],
    ['  location /api/ {', ''],
    ['    proxy_pass http://api;', 'KHÔNG có / cuối: giữ /api/…'],
    ['    proxy_http_version 1.1;', 'cần cho keepalive + WebSocket'],
    ['    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;', 'IP thật của khách'],
    ['    proxy_set_header X-Forwarded-Proto $scheme;', 'http hay https'],
    ['    proxy_read_timeout 300s; }', 'luồng AI dài'],
    ['  location /_next/static/ { proxy_pass http://web; }', 'Next đã tự gửi cache 1 năm'],
    ['  location / { proxy_pass http://web; … }', 'mọi thứ còn lại'],
    ['}', ''],
  ], { fs: 14.5 }) },

  { t: 'Dấu / cuối proxy_pass cắt mất /api — backend khoẻ vẫn 404', body: two(
    term(['# sửa proxy_pass http://api;  →  http://api/;', '$ docker compose exec nginx nginx -t', 'nginx: configuration file … test is successful', '$ docker compose exec nginx nginx -s reload', '2026/09/23 19:26:52 [notice] 492#492: signal process started', '$ curl -s localhost:18100/api/v1/posts', '! … <pre>Cannot GET /v1/posts</pre> …', '# ghi lại bản không có dấu /, nginx -t, reload:', '$ curl -s -o /dev/null -w \'posts %{http_code}\\n\' …/api/v1/posts', '= posts 200'], { title: 'output thật' }),
    `${table(['<code>proxy_pass</code>', 'Khách gọi', 'api nhận'], [
      ['<code>http://api;</code>', '<code>/api/v1/posts</code>', '+<code>/api/v1/posts</code>'],
      ['<code>http://api/;</code>', '<code>/api/v1/posts</code>', '-<code>/v1/posts</code> → 404'],
    ], { sm: true })}
    ${box('tip', '<code>nginx -t</code> xanh chỉ nghĩa là <b>cú pháp</b> đúng. Chốt bằng <code>curl</code> vào một tuyến có thật. <code>reload</code> không rớt kết nối nào.')}`, 'l') },

  { t: 'sed -i + bind mount một file: Linux đọc bản CŨ, Mac mất file', body: two(
    term(['$ ls -i a.conf', '5496092 a.conf', '$ sed -i s/ban-cu/ban-moi/ a.conf; ls -i a.conf', '! 5496093 a.conf              # inode MỚI', '# sha256 (16 ký tự đầu) + nội dung, hai phía:', 'host:      736431d512879281  ban-moi', '! container: 5bebcdeea2e4cda0  ban-cu', '$ docker exec dk10-ngx nginx -t', '! …test is successful         # kiểm bản CŨ, vẫn xanh'], { title: 'máy Linux nhà — Engine 29.6, output thật' }),
    `${term(['$ sed -i \'\' \'s#http://api;#http://api/;#\' ops/nginx.conf', '$ docker compose exec nginx nginx -t', '! [emerg] open() "/etc/nginx/conf.d/default.conf"', '!   failed (2: No such file or directory)', '$ docker compose exec nginx ls -la /etc/nginx/conf.d', '-rw-r--r--    0 root  root  1196 … default.conf'], { title: 'máy Mac — Docker Desktop, output thật' })}
    ${box('good', 'Ghi ĐÈ TẠI CHỖ: <code>cat bản-mới &gt; ops/nginx.conf</code> (giữ inode), hoặc gắn cả THƯ MỤC. Rồi <code>nginx -t</code> + <code>reload</code>.')}`) },

  { t: 'Một request qua ba ranh giới — header nào đi theo', body: two(
    `${steps([
      ['<b>Khách → nginx</b> (cổng 18100)', 'thân &gt; 25 MB bị chặn ngay: <code>POST 30MB: 413</code>'],
      ['<b>nginx → api</b> (mạng public)', 'gắn <code>X-Forwarded-For</code>, <code>X-Forwarded-Proto</code>'],
      ['<b>api → db / cache</b> (mạng private)', 'chỉ api có giao diện ở đây'],
    ])}
    ${box('warn', '<code>trust proxy 1</code> = tin ĐÚNG một lớp proxy: khách tự gửi <code>X-Forwarded-For</code> vẫn không giả được <code>req.ip</code>.')}
    ${box('info', 'Hai dòng <code>Cache-Control</code>: Next đã tự gửi, <code>add_header</code> của nginx gửi THÊM lần nữa ⇒ bỏ dòng đó.')}`,
    term(['$ curl -s -H \'X-Forwarded-For: 1.2.3.4\' \\', '>   localhost:18100/api/v1/whoami', '{"ip":"172.22.0.1","protocol":"http",', '+  "xff":"1.2.3.4, 172.22.0.1"}', '$ head -c 30000000 /dev/zero | curl -s \\', ">   -o /dev/null -w 'POST 30MB: %{http_code}\\n' \\", '>   --data-binary @- …/api/v1/jobs', '! POST 30MB: 413', '$ curl -sI …/_next/static/chunks/main-7e3e….js \\', '>   | grep -i cache-control', '! Cache-Control: public, max-age=31536000, immutable', '! Cache-Control: public, max-age=31536000, immutable'], { title: 'output thật', fs: 14 }), 'l') },

  { t: 'Deploy: build → migrate RIÊNG → up → smoke test', body: two(
    steps([
      ['<code>TAG=1.0.2 docker compose build api web</code>', 'build tuần tự; gắn tag theo phiên bản/commit'],
      ['<code>TAG=1.0.2 docker compose run --rm migrate</code>', 'hỏng ở đây ⇒ bản cũ vẫn phục vụ'],
      ['<code>TAG=1.0.2 docker compose up -d</code>', 'chỉ tạo lại container có ảnh/cấu hình đổi'],
      ['Vòng <code>curl</code> qua nginx', '404 trên tuyến có thật = ảnh cũ / build dở'],
    ]),
    term(['$ for r in posts auth/me whoami nope; do', ">   printf '%-8s %s\\n' $r \"$(curl -s -o /dev/null \\", ">     -w '%{http_code}' localhost:18100/api/v1/$r)\"; done", '= posts    200', '+ auth/me  401', '= whoami   200', '! nope     404', '$ docker compose ps -a --format \\', ">   'table {{.Service}}\\t{{.Status}}'", 'SERVICE   STATUS', 'api       Up 3 seconds (healthy)', '…', 'migrate   Exited (0) 3 seconds ago', 'nginx     Up Less than a second (health: starting)', '…'], { title: 'output thật' }), 'r') },

  { t: 'Khởi động 22,5 s → 5,4 s: đo, đừng đoán', body: `
    ${startBars()}
    ${two(
    term(['$ docker run --rm --network dk10-blog_private dk10-api:1.0.2 \\', '>   node -e "…time npx prisma --version vs .bin/prisma…"', '! dk10-blog_private    npx: 5323 ms · .bin/prisma: 266 ms', 'dk10-blog_public     npx: 606 ms  · .bin/prisma: 262 ms'], { title: 'output thật — npx chờ mạng trên mạng internal' }),
    box('tip', '<code>npx</code> hỏi registry trước khi chạy; mạng <code>internal</code> không có Internet ⇒ chờ hết giờ <b>~5 s</b> mỗi lần migrate. Gọi thẳng <code>./node_modules/.bin/prisma</code>. <code>start_interval</code> đã học ở Bài 9.3.'), 'l')}` },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 10', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Đổi <code>POSTGRES_PASSWORD</code>, migrate <code>P1000</code>', 'Chỉ đọc lúc initdb', '<code>ALTER USER … PASSWORD</code>; không <code>down -v</code>'],
    ['Migration hỏng ⇒ site 502', '<code>up -d</code> xoá api cũ trước', '<code>run --rm migrate</code> TRƯỚC <code>up</code>'],
    ['Deploy nào cũng <code>P3009</code>', 'Một migration dở trong <code>_prisma_migrations</code>', 'Điều tra → <code>resolve --rolled-back</code> → migration mới'],
    ['<code>spawn tsx ENOENT</code> khi seed', '<code>npm prune --omit=dev</code> bỏ tsx', 'Seed trong <code>src/</code>, chạy <code>node dist/seed.js</code>'],
    ['Engine Prisma "could not locate"', 'Build glibc / chạy musl, hoặc sai kiến trúc', 'Ba tầng cùng ảnh nền; đủ <code>binaryTargets</code>'],
    ['Next <code>unhealthy</code>, 127.0.0.1 bị từ chối', 'Docker đặt <code>HOSTNAME</code> = ID container', '<code>ENV HOSTNAME=0.0.0.0</code>'],
    ['Đổi <code>NEXT_PUBLIC_*</code> mà web y nguyên', 'Đã nướng vào JS lúc build', 'build arg + build lại, hoặc URL tương đối'],
    ['api 404 dù đang chạy', 'Dấu <code>/</code> cuối <code>proxy_pass</code>', 'Bỏ <code>/</code> hoặc sửa route; kiểm bằng curl'],
    ['Sửa nginx.conf, reload “xanh” mà không đổi', '<code>sed -i</code> thay inode của bind mount file', 'Ghi đè tại chỗ, hoặc gắn thư mục'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 10', body: table(['Muốn…', 'Gõ'], [
    ['Ai ở mạng nào', '<code>docker inspect -f \'{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}\' &lt;c&gt;</code>'],
    ['Kiểm cô lập mạng', '<code>docker compose exec nginx getent hosts db</code> (rỗng = tốt)'],
    ['Thứ tự khởi động thật', '<code>docker inspect -f \'{{.State.StartedAt}} {{.State.FinishedAt}}\' &lt;c&gt;</code>'],
    ['Migrate trước khi thay api', '<code>TAG=x docker compose run --rm migrate</code> rồi <code>up -d</code>'],
    ['Đổi mật khẩu Postgres đang chạy', '<code>docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD \'…\'"</code>'],
    ['Nâng bản chính Postgres', '<code>exec -T db pg_dumpall</code> → volume mới → <code>exec -T db psql &lt; dump</code>'],
    ['Seed có chủ đích', '<code>docker compose run --rm seed</code> (profile <code>seed</code>)'],
    ['Giá trị đã nướng vào Next', '<code>grep -rl "&lt;giá trị&gt;" .next/static/chunks</code>'],
    ['Kiểm + nạp lại nginx', '<code>docker compose exec nginx nginx -t &amp;&amp; … nginx -s reload</code>'],
    ['Smoke test sau deploy', '<code>curl -s -o /dev/null -w \'%{http_code}\' …/api/v1/&lt;tuyến&gt;</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 10 (45 phút)', body: `
    ${steps([
      ['Dựng stack bảy dịch vụ, <code>up -d</code>, vẽ lại dòng thời gian từ <code>docker inspect</code>', 'ai đợi ai? migrate chạy mấy giây?'],
      ['Chứng minh cô lập: <code>getent hosts db</code> từ nginx và từ api; <code>wget</code> ra Internet từ db', 'giải thích vì sao api là cầu nối duy nhất'],
      ['Gây P1000 bằng cách đổi mật khẩu trong <code>.env</code>, rồi sửa bằng <code>ALTER USER</code>', 'đo xem site 502 bao lâu'],
      ['Viết một migration NOT NULL hỏng, thấy P3018 → P3009, sửa đúng quy trình', 'lần này chạy <code>run --rm migrate</code> trước ⇒ site không chết'],
      ['Đổi <code>proxy_pass</code> sang có <code>/</code> cuối bằng cách ghi đè tại chỗ, <code>nginx -t</code>, reload, curl', 'thấy 404 rồi trả lại'],
    ])}
    ${box('good', '<b>Đạt khi:</b> smoke test ra <code>200 · 401 · 200 · 404</code>, và sau <code>down -v</code> thì <code>docker ps -a --filter name=blog-</code> rỗng.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));
