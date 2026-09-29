/**
 * Deploy lên VPS · Deck dv-13 — Chương 13: Deploy bằng container, registry và CI.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 29/09/2026 (hợp đồng mục 7b), trên Docker Desktop (Mac M1,
 * arm64) — container đều tên dv13-… và nhãn dvhoc=13, mạng riêng dv13-net:
 *   • dv13-vps = "VPS thí nghiệm": ubuntu:24.04 + sshd + Docker Engine 29.1.3 + Compose 2.40.3 chạy BÊN TRONG (Docker-in-
 *                Docker, --privileged ngắn hạn, --memory 2g), SSH từ Mac qua 127.0.0.1:19132 bằng khoá trong thư mục nháp.
 *                Dự án compose "dat-lich": api (Node, khởi động 1,5 s) + postgres:16-alpine + nginx:1.27-alpine.
 *   • dv13-reg = registry:2 cục bộ (Mac đẩy tới localhost:19135, VPS kéo từ dv13-reg:5000 — cùng kho, hai địa chỉ).
 *   • Máy dựng = chính Docker Desktop trên Mac (vai "máy nhà"/runner CI). Prisma 5.22.0 thật cho phần musl/glibc.
 * Không có `act` trên máy ⇒ workflow GitHub Actions KHÔNG chạy; YAML được kiểm bằng js-yaml và khối `run:` của bước
 * deploy được chạy nguyên văn với HOME giả trong thư mục nháp.
 * Số liệu production (502 bảy phút 18/08, cache 7,6 GB, OOM 137, hai workflow đua 03/07 + 06/07) lấy từ hồ sơ dự án.
 *
 * Hình tự vẽ (SVG nội tuyến): duongOng() đường deploy bằng ảnh · roiRequest() hai làn request khi tráo ·
 * hangDoi() concurrency chỉ xếp hàng · xanhLam() hai màu sau nginx.
 * Tô màu: sh() cho bash; yaml() cho compose/workflow/Dockerfile; conf() (chép dv-03 + dv-10) cho nginx.conf và authorized_keys.
 */
import { S, cover, sh, yaml, term, mindmap, diagram, cards, box, steps, table, two, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-13', code: 'DEPLOY · CHƯƠNG 13', title: 'Container, registry và CI', sub: 'Deploy lên VPS · Chương 13' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.c-code{margin:0}.c-grid+*{margin-top:12px}.c-box+.c-box{margin-top:12px}.c-card p{font-size:15px}' +
  '.g-term+.g-term{margin-top:12px}.l-sh+.c-box,.g-term+.c-box,.c-t+.c-box,.d-yml+.c-box,.d-yml+.g-term,.g-term+.d-yml,.c-t+.g-term,.l-sh+.g-term,.g-term+.l-sh{margin-top:12px}svg{max-width:100%;height:auto}</style>';

/* ─────────── tô màu cấu hình: nginx.conf và dòng authorized_keys — chép từ dv-03/dv-10, cùng khung .d-yml ─────────── */
const conf = (lines, { fs = 15, lang = 'nginx' } = {}) => {
  const hl = (raw) => {
    const ci = raw.search(/(^|\s)#/);
    let body = raw, tail = '';
    if (ci >= 0) { const at = raw[ci] === '#' ? ci : ci + 1; tail = `<span class="cm">${esc(raw.slice(at))}</span>`; body = raw.slice(0, at); }
    let m;
    if (lang === 'keys') {
      if ((m = body.match(/^(\S+)(\s+)(ssh-\S+)(.*)$/))) {
        const opt = esc(m[1]).replace(/(&quot;[^&]*&quot;|"[^"]*")/g, '\u0001$1\u0002').replace(/([a-z-]+)(=)/g, '<span class="k">$1</span>$2')
          .replace(/\u0001/g, '<span class="s">').replace(/\u0002/g, '</span>');
        return `${opt}${m[2]}<span class="sx">${esc(m[3])}</span>${esc(m[4])}${tail}`;
      }
      return esc(body) + tail;
    }
    if ((m = body.match(/^(\s*)([a-z_]+)(\s.*)?$/))) {
      const rest = esc(m[3] || '').replace(/("[^"]*")/g, '<span class="s">$1</span>')
        .replace(/(\d+\.\d+\.\d+\.\d+)(:\d+)?/g, '<span class="nu">$1$2</span>')
        .replace(/(\$[a-z_]+)/g, '<span class="sx">$1</span>')
        .replace(/\b(http_\d{3}|error|timeout|off|on)\b/g, '<span class="sx">$1</span>');
      return `${m[1]}<span class="k">${esc(m[2])}</span>${rest}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── Slide 3: đường deploy bằng ảnh — ai làm gì, ở đâu ─────────── */
const duongOng = () => diagram({
  w: 1160, h: 330,
  nodes: [
    { id: 'dev', x: 0, y: 30, w: 170, h: 86, t: 'git push', d: 'máy dev', ic: '💻', c: 'blu' },
    { id: 'build', x: 300, y: 30, w: 230, h: 86, t: 'build + CHỐT', d: 'máy nhà / runner CI', ic: '🏗', c: 'vio' },
    { id: 'reg', x: 660, y: 30, w: 170, h: 86, t: 'registry', d: 'GHCR · registry:2', ic: '📦', c: 'amb' },
    { id: 'vps', x: 950, y: 30, w: 210, h: 86, t: 'VPS: pull + tráo', d: 'không build, không npm', ic: '🖥', c: 'dv' },
    { id: 'ng', x: 950, y: 210, w: 210, h: 86, t: 'nginx → api', d: 'healthcheck · smoke', ic: '🚦', c: 'grn' },
    { id: 'cu', x: 580, y: 210, w: 260, h: 86, t: 'ảnh cũ vẫn trên đĩa', d: 'lùi = đổi tag, không kéo', ic: '↩', c: 'tea', dash: true },
  ],
  edges: [
    { from: 'dev', to: 'build', t: 'commit', off: 8 },
    { from: 'build', to: 'reg', t: 'push :sha', c: 'amb', off: 8 },
    { from: 'reg', to: 'vps', t: 'pull', c: 'dv', off: 8 },
    { from: 'vps', to: 'ng', t: 'up -d --wait', c: 'grn', off: 8 },
    { from: 'vps', to: 'cu', c: 'tea', dash: true, fs: 'b', ts: 'r' },
  ],
});

/* ─────────── Slide 23: hai làn request — compose up -d vs xanh/lam (số đo thật) ─────────── */
const roiRequest = () => {
  const x0 = 170, k = 0.085; // 1 ms = 0,085 px ⇒ 9.000 ms ≈ 765 px
  const X = (ms) => x0 + ms * k;
  let s = '';
  s += T(0, 58, 'docker compose', { fs: 15, b: true, c: 'red' }) + T(0, 78, 'up -d api', { fs: 15, b: true, c: 'red', mono: true });
  s += R(X(0), 40, 2033 * k, 40, { c: 'grn', fill: 'rgba(63,185,80,.18)', r: 6 });
  s += R(X(2033), 40, (4407 - 2033) * k, 40, { c: 'red', fill: 'rgba(255,92,108,.30)', r: 6 });
  s += R(X(4407), 40, (9000 - 4407) * k, 40, { c: 'grn', fill: 'rgba(63,185,80,.18)', r: 6 });
  s += T(X(3220), 66, '502 × 89', { fs: 16, b: true, a: 'middle', c: '#fff' });
  s += T(X(2033), 30, '2.033', { fs: 12.5, a: 'middle', c: 'red', mono: true }) + T(X(4407), 30, '4.407 ms', { fs: 12.5, a: 'middle', c: 'red', mono: true });
  s += T(X(6700), 66, '200', { fs: 15, b: true, a: 'middle', c: 'grn' }) + T(X(1000), 66, '200', { fs: 15, b: true, a: 'middle', c: 'grn' });
  s += T(0, 158, 'xanh/lam', { fs: 15, b: true, c: 'grn' }) + T(0, 178, 'sau nginx', { fs: 15, b: true, c: 'grn' });
  s += R(X(0), 140, 9000 * k, 40, { c: 'grn', fill: 'rgba(63,185,80,.18)', r: 6 });
  s += T(X(4500), 166, '940 / 940 request = 200 · không rơi cái nào', { fs: 16, b: true, a: 'middle', c: 'grn' });
  s += `<path d="M${X(0)} 214 L${X(9000)} 214" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 2000, 4000, 6000, 8000].forEach((t) => { s += `<path d="M${X(t)} 209 L${X(t)} 219" stroke="${D.dim}" stroke-width="2"/>` + T(X(t), 238, `${t / 1000} s`, { fs: 12.5, a: 'middle', c: 'mu', mono: true }); });
  s += T(x0, 266, 'một request mỗi ~10 ms, mỗi request một kết nối mới — VPS thí nghiệm, lần đo 4/4 (làn trên)', { fs: 13.5, c: 'dim' });
  return sv(960, 276, s);
};

/* ─────────── Slide 21: concurrency của GitHub Actions — xếp hàng trong MỘT nhóm, không chặn nhóm khác ─────────── */
const hangDoi = () => {
  let s = '';
  const hop = (x, y, w, t, d, c, dash = false) => R(x, y, w, 58, { c, fill: '#0b1220', r: 10, dash }) + T(x + w / 2, y + 25, t, { fs: 15, a: 'middle', b: true, c }) + T(x + w / 2, y + 45, d, { fs: 12.5, a: 'middle', c: 'mu' });
  s += R(0, 0, 700, 186, { c: 'dv', fill: 'rgba(56,189,248,.05)', r: 14 }) + T(16, 26, 'group: deploy-production', { fs: 15, b: true, c: 'dv', mono: true });
  s += hop(16, 44, 200, 'run A', 'ĐANG CHẠY', 'grn');
  s += hop(248, 44, 200, 'run B', 'pending → BỊ HUỶ', 'red', true);
  s += hop(480, 44, 200, 'run C', 'pending, chạy SAU A', 'amb');
  s += A(216, 73, 244, 73, { c: 'dim', sw: 2 }) + A(448, 73, 476, 73, { c: 'dim', sw: 2 });
  s += T(16, 130, 'Tối đa 1 đang chạy + 1 chờ. Run mới tới thì run đang CHỜ bị huỷ', { fs: 13.5, c: 'mu' });
  s += T(16, 152, '(mặc định). Không run nào chạy CHỒNG trong cùng nhóm.', { fs: 13.5, c: 'mu' });
  s += T(16, 174, 'queue: max ⇒ giữ tới 100 run chờ thay vì huỷ.', { fs: 13.5, c: 'mu' });
  s += R(0, 206, 700, 86, { c: 'red', fill: 'rgba(255,92,108,.06)', r: 14 });
  s += T(16, 232, 'workflow KHÁC (group khác, hoặc không khai)', { fs: 15, b: true, c: 'red' });
  s += hop(470, 220, 210, 'run X', 'chạy SONG SONG với A', 'red');
  s += T(16, 262, 'concurrency không thấy nó ⇒ hai lần tráo', { fs: 13.5, c: 'mu' }) + T(16, 282, 'trên MỘT VPS cùng lúc (chuyện 03/07, 06/07)', { fs: 13.5, c: 'mu' });
  return sv(700, 296, s);
};

/* ─────────── Slide 25: xanh/lam sau nginx ─────────── */
const xanhLam = () => diagram({
  w: 1160, h: 300,
  nodes: [
    { id: 'kh', x: 0, y: 110, w: 170, h: 80, t: 'người dùng', ic: '🌐', c: 'blu' },
    { id: 'ng', x: 250, y: 100, w: 260, h: 100, t: 'nginx (web)', d: 'upstream api {\nserver api_xanh:3000; }', mono: false, c: 'dv' },
    { id: 'xa', x: 640, y: 10, w: 290, h: 90, t: 'api_xanh · v4', d: 'đang phục vụ → drain 5 s → stop', c: 'blu' },
    { id: 'la', x: 640, y: 200, w: 290, h: 90, t: 'api_lam · v5', d: 'up -d --wait → smoke 401', c: 'grn' },
    { id: 'db', x: 1000, y: 110, w: 150, h: 80, t: 'db', d: 'dùng chung', ic: '🗄', c: 'vio' },
  ],
  edges: [
    { from: 'kh', to: 'ng', c: 'blu' },
    { from: 'ng', to: 'xa', t: '① trước', c: 'blu', off: 8 },
    { from: 'ng', to: 'la', t: '② sau reload', c: 'grn', off: 8 },
    { from: 'xa', to: 'db', c: 'vio', dash: true },
    { from: 'la', to: 'db', c: 'vio', dash: true },
  ],
});

export const slides = S([
  cover({ t: 'Chương 13 — Deploy bằng container, registry và CI', sub: 'compose trên VPS · ảnh ghim theo commit · build ở máy khác + chốt kiểm ảnh · GitHub Actions qua một khoá SSH chỉ chạy được một lệnh · tráo container không rơi request', chap: 'CHƯƠNG 13' }),

  { t: 'Bản đồ chương: ảnh dựng một lần, chạy mọi nơi', body: mindmap('Container + CI', 'VPS chỉ kéo về và tráo', [
    { t: '13.1 Compose trên VPS', d: 'tag theo commit · env_file · restart · log/RAM có trần · bind-mount giữ inode', c: 'blu' },
    { t: '13.2 Registry', d: 'build ở máy khác · musl vs glibc · chốt kiểm ảnh · arm64→amd64 · dọn ảnh', c: 'amb' },
    { t: '13.3 GitHub Actions', d: 'build → chốt → push → ssh · khoá một-lệnh · known_hosts · concurrency', c: 'vio' },
    { t: '13.4 Không rơi request', d: 'up -d rơi 83–134 · --wait · start_interval · xanh/lam · IP cũ', c: 'grn' },
    { t: 'Nối tiếp', d: 'Ch2 ảnh/digest · Ch3 tráo · Ch6 lùi bằng ảnh · Ch8 OOM/đĩa', c: 'tea' },
  ]) },

  { t: 'Một đường ống: build một lần, VPS chỉ tráo', body: `${duongOng()}
    ${cards([
      { t: 'Vì sao', d: 'VPS 6 GB build tuần tự ~15 phút, song song thì <strong>OOM 137</strong>; cache build phình <strong>7,6 GB</strong> trên đĩa chứa Postgres (Ch8).', c: 'red' },
      { t: 'Được gì', d: 'build 3–6 phút ở máy mạnh; VPS không cần npm, không mã nguồn; lùi bản = ảnh cũ đã có sẵn.', c: 'grn' },
      { t: 'Trả gì', d: 'thêm registry, thêm máy dựng, thêm một cửa hỏng: ảnh <strong>dựng xanh mà chạy chết</strong> (13.2).', c: 'amb' },
    ], 3)}` },

  /* ───────────── 13.1 ───────────── */
  { t: 'compose.yaml của một VPS, từng dòng', body: two(
    yaml([
      ['name: dat-lich', 'tên dự án cố định'],
      ['services:', ''],
      ['  api:', ''],
      ['    image: dv13-reg:5000/dat-lich:${TAG:?chua dat TAG}', 'tag = mã commit'],
      ['    env_file: [/home/deploy/bi-mat/api.env]', 'bí mật NGOÀI ảnh'],
      ['    restart: unless-stopped', 'tự dậy sau reboot'],
      ['    mem_limit: 256m', 'trần RAM'],
      ['    healthcheck:', ''],
      ['      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/api/health"]', ''],
      ['      interval: 2s', ''],
      ['      start_period: 10s', ''],
      ['    logging:', ''],
      ['      options: { max-size: "1m", max-file: "3" }', 'log có trần'],
      ['    depends_on:', ''],
      ['      db: { condition: service_healthy }', 'đợi db KHOẺ'],
      ['  db:', ''],
      ['    image: postgres:16-alpine', ''],
      ['    volumes: [pgdata:/var/lib/postgresql/data]', 'volume CÓ TÊN'],
      ['  web:', ''],
      ['    image: nginx:1.27-alpine', ''],
      ['    ports: ["127.0.0.1:8080:80"]', ''],
      ['    volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]', 'NGOÀI ảnh'],
      ['volumes:', ''],
      ['  pgdata:', ''],
    ], { fs: 13.5 }),
    `${term([
      '$ mv .env .env.bak && docker compose up -d',
      '! error while interpolating services.api.image: required variable',
      '! TAG is missing a value: chua dat TAG - ghi vao .env',
      'ma thoat 1',
      '$ docker compose up -d',
      ' Container dat-lich-db-1  Healthy',
      ' Container dat-lich-api-1  Healthy',
      ' Container dat-lich-web-1  Started',
      'real	0m8.939s',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13 })}
    ${box('tip', '<code>\${TAG:?…}</code>: thiếu tag thì compose <b>từ chối</b> thay vì lặng lẽ kéo <code>:latest</code>. Dockerfile/Compose cơ bản: <code>/courses/docker</code>.')}`, 'l') },

  { t: ':latest trỏ bản mới, VPS vẫn chạy bản cũ', body: two(
    term([
      '# may dung vua day dat-lich:latest = v5 (co /api/phong-kham)',
      '$ docker compose up -d --wait api      # TAG=latest',
      ' Container dat-lich-api-1  Healthy',
      '$ curl …/api/ban',
      '! v1',
      '$ smoke-test',
      '  /api/lich        -> 401',
      '!   /api/phong-kham  -> 404',
      '$ docker compose pull api && docker compose up -d --wait api',
      ' Container dat-lich-api-1  Healthy',
      '$ curl …/api/ban',
      '= v5',
      '  /api/phong-kham  -> 401',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13.5 }),
    `${box('bad', 'Ảnh <code>:latest</code> đã có trên đĩa ⇒ <code>up -d</code> <b>không kéo</b>. Healthy, xanh, và đang chạy <b>v1</b>. Đúng hình dạng sự cố 02/07 (deploy <code>--no-build</code>, route mới 404) — lần này bằng container.')}
    ${cards([
      { t: 'Tag = mã commit', d: '<code>TAG=2bed0bb</code>: tên đổi ⇒ compose BUỘC phải có đúng ảnh đó; nhìn <code>docker ps</code> là biết đang chạy commit nào.', c: 'grn' },
      { t: '404 = ảnh cũ', d: 'smoke-test một route MỚI của bản này: 401/200 là có route, 404 là ảnh cũ (Ch3.5).', c: 'amb' },
    ], 1)}`, 'l') },

  { t: 'Bí mật nằm NGOÀI ảnh, không trong Dockerfile', body: two(
    `${yaml([
      ['FROM alpine:3.20', ''],
      ['ARG DB_PASS', 'lọt vào lịch sử'],
      ['ENV JWT_SECRET=xxxx', 'lọt vào cấu hình ảnh'],
      ['RUN echo "ket noi bang $DB_PASS" > /dev/null', ''],
    ], { fs: 14.5, lang: 'docker' })}
    ${term([
      '$ docker build --build-arg DB_PASS=12345 -t dv13-ro .',
      '$ docker history --no-trunc --format "{{.CreatedBy}}" dv13-ro | head -3',
      'CMD ["true"]',
      '! RUN |1 DB_PASS=12345 /bin/sh -c echo "ket noi bang $DB_PASS" …',
      '! ENV JWT_SECRET=xxxx',
      '$ docker inspect -f "{{.Config.Env}}" dv13-ro',
      '! [PATH=… JWT_SECRET=xxxx]',
    ], { title: 'Mac — output thật', fs: 13 })}`,
    `${box('bad', 'Ai kéo được ảnh là đọc được bí mật — kể cả khi ảnh nằm trên registry "riêng tư" và bạn đổi mật khẩu sau đó: lớp cũ vẫn ở đó.')}
    ${term([
      '$ docker compose config | grep -A3 "environment:"',
      '    environment:',
      '      DATABASE_URL: postgres://app:12345@db:5432/app',
      '      JWT_SECRET: xxxx',
    ], { title: 'VPS — env_file được nạp lúc CHẠY', fs: 13 })}
    ${cards([
      { t: '.env cạnh compose.yaml', d: 'cho compose <strong>thay biến</strong> (<code>\${TAG}</code>) — không tự vào container', c: 'blu' },
      { t: 'env_file:', d: 'biến cho <strong>container</strong>, <code>chmod 600</code>, ngoài git, ngoài ảnh', c: 'grn' },
    ], 2)}
    ${box('warn', '<code>docker compose config</code> IN RA bí mật — đừng chạy nó trong log CI công khai.')}`, 'l') },

  { t: 'Sau reboot: ai tự dậy, ai nằm im', body: two(
    term([
      '# sau khi dockerd khoi dong lai (nhu VPS vua reboot)',
      '$ docker ps -a --filter name=r- --format "table {{.Names}}\\t{{.Status}}"',
      'NAMES              STATUS',
      '= r-always           Up 4 seconds',
      '= r-unless-stopped   Up 4 seconds',
      '! r-no               Exited (137) 2 minutes ago',
      '+ r-al-dung          Up 4 seconds',
      'r-us-dung          Exited (137) 2 minutes ago',
      '$ docker compose ps --format "{{.Service}} {{.Status}}"',
      'api Up 5 seconds (health: starting)',
      'db Up 5 seconds (healthy)',
      'web Up 5 seconds',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13.5 }),
    `${table(['restart:', 'đang chạy lúc reboot', 'đã <code>stop</code> bằng tay'], [
      ['<code>no</code> (MẶC ĐỊNH)', '-<span>nằm im</span>', 'nằm im'],
      ['<code>unless-stopped</code>', '+dậy', '+nằm im — đúng ý bạn'],
      ['<code>always</code>', '+dậy', '!dậy lại dù bạn đã dừng'],
      ['<code>on-failure</code>', 'chỉ khi thoát ≠ 0', 'nằm im'],
    ], { sm: true })}
    ${box('bad', 'Quên dòng <code>restart:</code> thì VPS khởi động lại lúc 3 giờ sáng là web <b>chết tới khi bạn thức dậy</b> — không lỗi, không log, <code>Exited (137)</code>.')}
    ${box('info', 'Đo: sau khi dockerd khởi động lại, cả ba dịch vụ lên <b>cùng lúc</b> — thứ tự <code>depends_on</code> chỉ áp khi bạn chạy <code>docker compose up</code>.')}`, 'l') },

  { t: 'Log và RAM phải có trần', body: two(
    `${term([
      '# on-co: --log-opt max-size=1m --log-opt max-file=3',
      '== on-khong',
      '! 215M 6f35abdfc1d5…-json.log',
      '== on-co',
      '655K 91c1da6ca620…-json.log',
      '977K 91c1da6ca620…-json.log.1',
      '977K 91c1da6ca620…-json.log.2',
    ], { title: 'VPS — yes in log đúng 4 giây, output thật', fs: 13.5 })}
    ${term([
      '$ docker stats --no-stream \\',
      '    --format "table {{.Name}}\\t{{.MemUsage}}"',
      'NAME             MEM USAGE / LIMIT',
      'dat-lich-api-1   20.5MiB / 256MiB',
      '! dat-lich-web-1   2.281MiB / 7.748GiB',
      'dat-lich-db-1    31.11MiB / 512MiB',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13.5 })}`,
    `${box('bad', '<b>215 MB trong 4 giây</b>: driver <code>json-file</code> mặc định không xoay vòng. Một vòng lặp lỗi in log là cách nhanh nhất làm đầy đĩa của Postgres (Ch8.4).')}
    ${box('warn', 'Không <code>mem_limit</code> ⇒ giới hạn = <b>cả máy</b> (7,7 GiB ở đây). Một dịch vụ rò bộ nhớ kéo OOM killer vào những dịch vụ khác (Ch8.2).')}
    ${yaml([
      ['    mem_limit: 256m', 'trần cho TỪNG dịch vụ'],
      ['    logging:', ''],
      ['      driver: json-file', ''],
      ['      options: { max-size: "1m", max-file: "3" }', '≤ 3 MB/container'],
    ], { fs: 14 })}`, 'l') },

  { t: 'Sửa nginx.conf bằng mv: container không thấy', body: two(
    term([
      '$ (so van tay: tren may chu va trong container)',
      '  may chu : 594c96609a32  inode 169253',
      '  web     : 594c96609a32',
      '$ cp /tmp/nginx.moi nginx.conf.tam && mv nginx.conf.tam nginx.conf',
      '+   may chu : 2531e4327f82  inode 169336',
      '!   web     : 594c96609a32',
      '$ docker compose exec web nginx -t && … nginx -s reload',
      'nginx: configuration file /etc/nginx/nginx.conf test is successful',
      '$ curl -s -o /dev/null -w "%{http_code}" 127.0.0.1:8080/conf',
      '! 404',
      '$ docker compose up -d web',
      '!  Container dat-lich-web-1  Running',
      '# --- cach dung: ghi DE TAI CHO, giu inode ---',
      '$ cat /tmp/nginx.moi > nginx.conf && … nginx -s reload',
      '$ sleep 1; curl -s 127.0.0.1:8080/conf',
      '= conf-moi-2',
    ], { title: 'VPS thí nghiệm — output thật (cắt dòng)', fs: 12.5 }),
    `${box('bad', 'Bind-mount <b>một tệp</b> gắn theo <b>inode</b> lúc container khởi động. <code>mv</code>, <code>sed -i</code>, <code>rsync</code>, <code>:w</code> của vim đều tạo inode MỚI ⇒ <code>nginx -t</code> kiểm bản CŨ, reload nạp bản CŨ, script báo OK. Chuyện thật 23–25/08.')}
    ${cards([
      { t: 'Ghi đè tại chỗ', d: '<code>cat mới &gt; nginx.conf</code> giữ inode. Kiểm bằng sha256 <strong>bên trong</strong> container.', c: 'grn' },
      { t: 'Hoặc gắn cả THƯ MỤC', d: '<code>./nginx:/etc/nginx/conf.d</code> — đo: <code>mv</code> trong thư mục thì container thấy ngay.', c: 'blu' },
      { t: 'Ảnh không mang nó', d: 'đẩy ảnh mới KHÔNG đụng tệp bind-mount — script deploy phải đồng bộ nó riêng.', c: 'amb' },
    ], 1)}`, 'l') },

  { t: 'down giữ dữ liệu; down -v xoá sạch', body: two(
    term([
      '$ docker compose exec db psql -U app -Atc "select count(*) from lich"',
      '1',
      '$ docker compose down',
      ' Container dat-lich-db-1  Removed',
      ' Network dat-lich_default  Removed',
      '$ docker volume ls --format "{{.Name}}"',
      '= dat-lich_pgdata',
      '$ docker compose up -d --wait && … select count(*) from lich',
      '= 1',
      '$ docker compose down -v',
      '!  Volume dat-lich_pgdata  Removed',
      '$ docker compose up -d --wait && … select count(*) from lich',
      '! ERROR:  relation "lich" does not exist',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13 }),
    `${box('bad', '<code>-v</code> = xoá cả volume CÓ TÊN của dự án. Một dòng "dọn cho sạch" trong script deploy là mất trắng CSDL — không hỏi lại.')}
    ${cards([
      { t: 'Volume có tên', d: '<code>pgdata:</code> sống qua <code>down</code>, qua đổi ảnh, qua <code>up --force-recreate</code>.', c: 'grn' },
      { t: 'Không phải sao lưu', d: 'volume nằm trên CÙNG đĩa VPS. Sao lưu là Ch10: <code>pg_dump</code> + ra khỏi máy.', c: 'amb' },
      { t: 'Script deploy', d: 'chỉ <code>up -d --no-build &lt;dịch vụ&gt;</code>. Không <code>down</code>, không <code>-v</code>, không <code>prune</code> không filter.', c: 'red' },
    ], 1)}`, 'l') },

  /* ───────────── 13.2 ───────────── */
  { t: 'Build ở máy mạnh, VPS chỉ kéo về', body: two(
    table(['', 'build TRÊN VPS (deploy.sh)', 'build ở MÁY NHÀ (deploy-nha.sh)'], [
      ['thời gian', '~15 phút, buộc tuần tự', '+3–6 phút, song song'],
      ['RAM', '-<span>song song ⇒ OOM 137 (06/07)</span>', '+31 GB, không đụng VPS'],
      ['đĩa VPS', '-<span>cache 7,6 GB ⇒ ENOSPC (18/08)</span>', '+không có cache build'],
      ['thứ lên prod', 'cây làm việc (cả tệp gõ dở)', '+chỉ thứ đã commit'],
      ['khi máy dựng tắt', 'vẫn chạy', '!lùi về deploy.sh'],
    ], { sm: true }),
    `${sh([
      ['TAG=$(git rev-parse --short HEAD)', 'tag = commit'],
      ['docker build -f Dockerfile.backend -t $KHO/api:$TAG .', 'ĐÚNG Dockerfile'],
      ['./chot-kiem-anh.sh $KHO/api:$TAG', 'TRƯỚC khi đẩy'],
      ['docker push $KHO/api:$TAG', 'chỉ lớp đổi đi (Ch2.3)'],
      ['ssh vps "deploy $TAG"', 'VPS: pull + tráo'],
    ], { fs: 14 })}
    ${box('info', 'Tập với <code>registry:2</code> cục bộ; GHCR chỉ khác địa chỉ và bước đăng nhập. Ở đây: Mac đẩy tới <code>localhost:19135</code>, VPS kéo từ <code>dv13-reg:5000</code> — cùng một kho.')}
    ${box('warn', 'Máy dựng khác máy chạy ⇒ phải CHỨNG MINH ảnh chạy được trên máy chạy. Bốn slide tới là vì sao.')}`, 'l') },

  { t: 'Build xanh, ảnh chết: glibc chép sang musl', body: two(
    `${yaml([
      ['# SAI: dung o glibc, chay o musl', ''],
      ['FROM node:22-slim AS dung', 'Debian = glibc'],
      ['RUN apt-get install -y openssl', ''],
      ['RUN npm install && npx prisma generate', 'engine cho glibc'],
      ['FROM node:22-alpine', 'Alpine = musl'],
      ['RUN apk add --no-cache openssl', ''],
      ['COPY --from=dung /app/node_modules ./node_modules', 'chép engine SAI'],
    ], { fs: 14, lang: 'docker' })}
    ${box('bad', 'Chuyện thật 18/08: <code>docker build .</code> lấy nhầm <code>Dockerfile</code> (kết thúc ở Alpine) thay vì <code>Dockerfile.backend</code>. Build xanh, đẩy xanh, tráo xanh — rồi backend restart vô tận và <b>API 502 bảy phút</b>.')}`,
    `${term([
      '$ docker run --rm -e DATABASE_URL=…@khong-co:5432/app …:sai',
      '! PrismaClientInitializationError: Prisma Client could not locate the',
      '! Query Engine for runtime "linux-musl-arm64-openssl-3.0.x".',
      '! This happened because Prisma Client was generated for',
      '! "linux-arm64-openssl-3.0.x", but the actual deployment required',
      '! "linux-musl-arm64-openssl-3.0.x".',
      'ma thoat 1',
      '$ docker run --rm -e DATABASE_URL=…@khong-co:5432/app …:dung',
      '= PrismaClientInitializationError: Can\'t reach database server at',
      '= `khong-co:5432`',
      'ma thoat 1',
    ], { title: 'Mac · Prisma 5.22.0 — thật, xuống dòng cho vừa', fs: 12.5 })}
    ${box('info', 'Cả hai thoát <b>1</b>. Chỉ đọc NỘI DUNG mới phân biệt: "không tìm thấy engine" = ảnh hỏng; "không với tới CSDL" = engine nạp được, ảnh lành.')}`, 'r') },

  { t: 'Restarting (1): cái vòng không ai nhìn thấy', body: two(
    term([
      '$ docker run -d --restart unless-stopped … dat-lich-api:sai',
      '$ sleep 25',
      '$ docker ps --filter name=api-sai --format "{{.Names}}  {{.Status}}"',
      '! api-sai  Restarting (1) 8 seconds ago',
      '$ docker inspect -f "{{.RestartCount}}" api-sai',
      '! 8',
      '$ docker logs --tail 1 api-sai',
      '! PrismaClientInitializationError: Prisma Client could not locate …',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13.5 }) + box('tip', 'Mọi bước xanh vì không bước nào hỏi "ảnh này <b>chạy</b> được không". Câu hỏi đó phải có chỗ đứng riêng — trước <code>docker push</code>.'),
    `${steps([
      ['build xanh', 'Dockerfile không có bước nào CHẠY engine'],
      ['push xanh', 'registry nhận byte, không chạy gì'],
      ['<code>up -d</code> xanh', 'container "Started" rồi mới chết'],
      ['restart vô tận', '<code>restart: unless-stopped</code> làm đúng việc của nó'],
      ['nginx 502', 'tới khi có người đọc log và lùi bản'],
    ])}`, 'l') },

  { t: 'Chốt kiểm ảnh: chạy engine trước khi đẩy', body: `${sh([
      ['ANH=${1:?can ten anh}', ''],
      ['read -r LIBC ENGINE < <(docker run --rm --entrypoint sh "$ANH" -c \'', ''],
      ['  if ls /lib/ld-musl-* >/dev/null 2>&1; then printf "musl "', 'libc của ảnh'],
      ['  else printf "glibc "; fi', ''],
      ['  ls node_modules/.prisma/client/ | grep -o "libquery_engine-[^ ]*"\')', 'engine trong ảnh'],
      ['case "$ENGINE" in *musl*) E=musl ;; *) E=glibc ;; esac', ''],
      ['[ "$LIBC" = "$E" ] || { echo "HONG: nen $LIBC mang engine $E"; exit 1; }', 'chốt 1: tên'],
      ['OUT=$(docker run --rm -e DATABASE_URL=postgres://x:x@127.0.0.1:1/x "$ANH" \\', ''],
      ['      node -e "…PrismaClient().$connect()…" 2>&1 || true)', 'chốt 2: NẠP THẬT'],
      ['case "$OUT" in *"Can\'t reach database server"*) echo OK ;;', 'lỗi mong đợi'],
      ['  *) echo "HONG: engine khong nap duoc"; exit 1 ;; esac', ''],
    ], { fs: 12.5 })}
    ${two(term([
      '$ ./chot-kiem-anh.sh localhost:19135/dat-lich-api:sai',
      'anh: musl · engine: glibc (libquery_engine-linux-arm64-openssl-3.0.x.so.node)',
      '! HONG: nen musl mang engine glibc',
      'ma thoat 1',
      '$ ./chot-kiem-anh.sh localhost:19135/dat-lich-api:dung',
      'anh: musl · engine: musl (libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node)',
      '= OK: engine nap duoc (loi con lai chi la khong co CSDL)',
      'ma thoat 0',
    ], { title: 'Mac — output thật', fs: 12 }),
    box('bad', '<b>Đừng dùng <code>ldd</code></b> cho tệp <code>.node</code>: đo được <code>ldd</code> thoát <b>127</b> với CẢ engine sai lẫn đúng (65 và 62 dòng <code>napi_*: symbol not found</code> — hàm do tiến trình node cấp, không thuộc thư viện nào). Luôn đỏ = không phân biệt được gì.'), 'l2')}` },

  { t: 'Mac arm64 → VPS amd64: build xanh vẫn sai', body: two(
    `${term([
      '$ uname -m',
      'arm64',
      '$ docker build --platform linux/amd64 -f Dockerfile.run .',
      '! #5 0.329 exec /bin/sh: exec format error',
      '! #5 ERROR: process "/bin/sh -c uname -m > /kien-truc" … exit code: 255',
    ], { title: 'Mac M1, Docker Desktop CHƯA bật giả lập — output thật', fs: 13 })}
    ${yaml([
      ['FROM --platform=$BUILDPLATFORM node:22-alpine AS dung', 'chạy ở kiến trúc MÁY DỰNG'],
      ['RUN npm install && npx prisma generate', ''],
      ['FROM node:22-alpine', 'kiến trúc ĐÍCH'],
      ['COPY --from=dung /app/node_modules ./node_modules', 'tầng cuối KHÔNG có RUN'],
    ], { fs: 13.5, lang: 'docker' })}`,
    `${term([
      '$ docker build --platform linux/amd64 \\',
      '    -f Dockerfile.cheo -t …:cheo .',
      '#18 DONE 2.8s',
      'ma thoat 0',
      '$ docker image inspect \\',
      '    -f "{{.Os}}/{{.Architecture}}" …:cheo',
      '= linux/amd64',
      '$ … | tar -t | grep node$',
      '! client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node',
      '# schema.prisma: binaryTargets =',
      '#   ["native", "linux-musl-openssl-3.0.x"]',
      '$ … | tar -t | grep node$',
      'client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node',
      '= client/libquery_engine-linux-musl-openssl-3.0.x.so.node',
    ], { title: 'Mac — output thật', fs: 12.5 })}
    ${box('bad', 'Ảnh <b>amd64</b> mang engine <b>arm64</b>: build 2,8 s, xanh. Trên VPS x86 nó chết như slide 13. Mẹo <code>$BUILDPLATFORM</code> chỉ an toàn khi mọi thứ tầng dựng tạo ra không phụ thuộc CPU — hoặc khai <code>binaryTargets</code>.')}`, 'r') },

  { t: 'Dọn ảnh cũ mà vẫn còn đường lùi', body: two(
    `${sh([
      ['GIU_LAI=$(tac ~/dat-lich/da-len.log | awk \'{print $2}\' \\', 'bản ĐÃ LÊN TỐT'],
      ['          | awk \'!thay[$0]++\' | head -n "$GIU")', 'mới nhất, không trùng'],
      ['DANG=$(docker inspect -f \'{{.Config.Image}}\' dat-lich-api-1)', ''],
      ['for T in $(docker images "$KHO" --format \'{{.Tag}}\'); do', ''],
      ['  [ "$T" = "${DANG##*:}" ] && continue', 'không xoá cái đang chạy'],
      ['  grep -qx "$T" <<< "$GIU_LAI" && { echo "giu $T"; continue; }', ''],
      ['  echo "xoa $T"; docker rmi "$KHO:$T" >/dev/null', 'rmi theo TÊN, không prune -a'],
      ['done', ''],
    ], { fs: 13 })}
    ${term([
      '$ ~/bin/don-anh.sh 3',
      '! xoa 19efddb',
      'giu 2bed0bb',
      'xoa 02f98c0',
      'giu 241f233',
      'xoa 2374533',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13 })}
    ${box('bad', 'Bản đầu giữ theo <b>ngày tạo</b> — và giữ đúng <code>19efddb</code>, bản HỎNG mới nhất. Giữ theo sổ <code>da-len.log</code> (chỉ ghi khi smoke-test đạt).')}`,
    `${term([
      '# registry dang SAP',
      '$ docker pull dv13-reg:5000/dat-lich:2bed0bb',
      '! Error response from daemon: failed to resolve reference …',
      '$ … TAG=2bed0bb && docker compose up -d \\',
      '    --pull never --wait api',
      '=  Container dat-lich-api-1  Healthy',
      '=   (6734 ms) — v5',
      '$ … TAG=02f98c0 && docker compose up -d \\',
      '    --pull never --wait api',
      '! Error response from daemon: No such image:',
      '! dv13-reg:5000/dat-lich:02f98c0',
    ], { title: 'VPS thí nghiệm — output thật', fs: 12.5 })}
    ${box('good', 'Ảnh còn trên đĩa ⇒ lùi được khi registry sập (Ch6.1).')}`, 'l') },

  /* ───────────── 13.3 ───────────── */
  { t: 'Workflow (1/2): build, chốt kiểm rồi mới push', body: two(
    yaml([
      ['name: deploy', ''],
      ['on:', ''],
      ['  workflow_dispatch:', 'bấm tay'],
      ['permissions:', ''],
      ['  contents: read', ''],
      ['  packages: write', 'đẩy GHCR'],
      ['concurrency:', ''],
      ['  group: deploy-production', 'chung mọi workflow'],
      ['  cancel-in-progress: false', 'để tráo xong'],
      ['jobs:', ''],
      ['  build:', ''],
      ['    runs-on: ubuntu-24.04', 'x86-64 như VPS'],
      ['    env:', ''],
      ['      IMG: ghcr.io/${{ github.repository }}/api', ''],
      ['    outputs:', ''],
      ['      tag: ${{ steps.tag.outputs.tag }}', ''],
      ['    steps:', ''],
      ['      - uses: actions/checkout@v7', ''],
      ['      - id: tag', ''],
      ['        run: |', ''],
      ['          echo "tag=${GITHUB_SHA::7}" >> "$GITHUB_OUTPUT"', '7 ký tự'],
      ['          echo "TAG=${GITHUB_SHA::7}" >> "$GITHUB_ENV"', ''],
    ], { fs: 12 }),
    yaml([
      ['      - uses: docker/setup-buildx-action@v4', ''],
      ['      - uses: docker/login-action@v4', ''],
      ['        with:', ''],
      ['          registry: ghcr.io', ''],
      ['          username: ${{ github.actor }}', ''],
      ['          password: ${{ secrets.GITHUB_TOKEN }}', 'không PAT'],
      ['      - uses: docker/build-push-action@v7', ''],
      ['        with:', ''],
      ['          file: Dockerfile.backend', 'ghi RÕ tên'],
      ['          platforms: linux/amd64', ''],
      ['          load: true', 'CHƯA đẩy'],
      ['          tags: ${{ env.IMG }}:${{ env.TAG }}', ''],
      ['          cache-from: type=gha', ''],
      ['          cache-to: type=gha,mode=max', ''],
      ['      - name: Chot kiem anh truoc khi day', ''],
      ['        run: ./scripts/chot-kiem-anh.sh "$IMG:$TAG"', 'slide 14'],
      ['      - name: Day anh', ''],
      ['        run: docker push "$IMG:$TAG"', 'khi chốt đạt'],
    ], { fs: 12 }), '') },

  { t: 'Workflow (2/2): một khoá, một lệnh, một máy', body: two(
    `${yaml([
      ['  deploy:', ''],
      ['    needs: build', ''],
      ['    runs-on: ubuntu-24.04', ''],
      ['    environment: production', 'duyệt tay; secret mở SAU khi duyệt'],
      ['    timeout-minutes: 10', ''],
      ['    steps:', ''],
      ['      - name: Tra anh tren VPS qua SSH', ''],
      ['        env:', ''],
      ['          KHOA: ${{ secrets.VPS_CI_KEY }}', 'khoá RIÊNG cho CI'],
      ['          KNOWN_HOSTS: ${{ secrets.VPS_KNOWN_HOSTS }}', 'vân tay VPS đã ghim'],
      ['          VPS: ${{ vars.VPS_HOST }}', ''],
      ['          TAG: ${{ needs.build.outputs.tag }}', ''],
      ['        run: |', ''],
      ['          install -m 700 -d ~/.ssh', ''],
      ['          printf \'%s\\n\' "$KHOA" > ~/.ssh/ci && chmod 600 ~/.ssh/ci', ''],
      ['          printf \'%s\\n\' "$KNOWN_HOSTS" > ~/.ssh/known_hosts', ''],
      ['          ssh -i ~/.ssh/ci -o StrictHostKeyChecking=yes \\', 'lạ ⇒ từ chối'],
      ['              "deploy@$VPS" "deploy $TAG"', 'một lệnh, một tham số'],
    ], { fs: 12 })}`,
    `${term([
      '# khoi run: cua buoc deploy, HOME gia',
      '$ HOME=… KHOA=… KNOWN_HOSTS=… VPS=127.0.0.1 \\',
      '    TAG=72f5fb8 bash -e buoc-deploy.sh',
      '[08:26:36] 2bed0bb -> 72f5fb8',
      '= [08:26:44] OK: dang chay 72f5fb8',
      'ma thoat 0',
    ], { title: 'Mac → VPS (thêm -p 19132) — thật', fs: 12.5 })}
    ${box('info', 'Không có <code>act</code>, không chạy trên GitHub thật: YAML kiểm bằng js-yaml (2 job, 7+1 bước); khối <code>run:</code> của bước deploy chạy thật như trên (chỉ thêm cổng 19132).')}
    ${box('warn', 'Người duyệt cho <code>environment</code>: repo <b>riêng tư</b> cần gói Pro/Team (09/2026). Cú pháp: <code>/courses/github-actions</code>.')}`, 'l') },

  { t: 'Khoá CI chỉ chạy được MỘT lệnh', body: two(
    `${conf([
      ['command="/home/deploy/bin/trien-khai-ci",restrict ssh-ed25519 AAAA… dv13-ci', ''],
    ], { fs: 13, lang: 'keys' })}
    ${sh([
      ['read -r VIEC TAG THUA <<< "${SSH_ORIGINAL_COMMAND:-}"', 'thứ CI XIN chạy'],
      ['[ "$VIEC" = deploy ] && [ -z "${THUA:-}" ] || { echo "tu choi: …"; exit 2; }', ''],
      ['[[ "$TAG" =~ ^[0-9a-f]{7,40}$ ]] || { echo "tu choi: tag …"; exit 2; }', 'chỉ mã commit'],
      ['exec 9> /tmp/trien-khai.khoa', ''],
      ['flock -n 9 || { echo "dang co … khac chay"; exit 75; }', 'một lần một'],
      ['docker pull -q "dv13-reg:5000/dat-lich:$TAG"', ''],
      ['sed -i "s/^TAG=.*/TAG=$TAG/" .env', ''],
      ['if ! docker compose up -d --no-build --wait --wait-timeout 30 api \\', ''],
      ['   || [ "$(curl … /api/lich)" != 401 ]; then …lùi về $CU…; exit 1; fi', 'hỏng ⇒ lùi'],
      ['echo "$(date -Is) $TAG" >> da-len.log', 'sổ bản đã lên'],
    ], { fs: 12.5 })}`,
    `${term([
      '$ ssh -i ci_key deploy@vps deploy 241f233',
      '[08:22:39] 2bed0bb -> 241f233',
      '= [08:22:47] OK: dang chay 241f233',
      '$ ssh -i ci_key deploy@vps \\',
      '    "deploy 241f233; rm -rf ~"',
      '! tu choi: deploy 241f233; rm -rf ~',
      '$ ssh -i ci_key deploy@vps "deploy latest"',
      '! tu choi: tag \'latest\' khong phai ma commit',
      '$ ssh -i ci_key deploy@vps          (xin shell)',
      '! tu choi: (shell)',
      '$ ssh -i ci_key -N -L 19139:db:5432 deploy@vps',
      '! channel 2: open failed:',
      '! administratively prohibited: open failed',
    ], { title: 'khoá dv13-ci — output thật', fs: 12.5 })}
    ${box('good', 'Secret CI bị lộ thì kẻ lấy được nó chỉ <b>deploy lại một commit</b> — không shell, không đường hầm tới Postgres, không xoá gì.')}`, 'l') },

  { t: 'known_hosts ghim: máy lạ thì không nói chuyện', body: two(
    term([
      '$ ssh-keyscan -p 19132 -t ed25519 127.0.0.1',
      '# 127.0.0.1:19132 SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13.19',
      '[127.0.0.1]:19132 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDyKEPXTBtrxF48V…',
      '$ ssh -o StrictHostKeyChecking=yes -o UserKnownHostsFile=/dev/null …',
      '! No ED25519 host key is known for [127.0.0.1]:19132 and you have',
      '! requested strict checking.',
      '! Host key verification failed.',
      'ma thoat 255',
      '$ ssh -o UserKnownHostsFile=kh-gia …   # khoa ghim KHONG khop',
      '! @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
      '! @    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @',
      '! @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
      'ma thoat 255',
    ], { title: 'Mac → VPS thí nghiệm — output thật', fs: 12.5 }),
    `${cards([
      { t: 'Chạy ssh-keyscan MỘT lần', d: 'từ máy bạn tin (hoặc đọc tệp <code>.pub</code> trong <code>/etc/ssh/</code> của VPS), dán vào secret <code>VPS_KNOWN_HOSTS</code>.', c: 'grn' },
      { t: 'KHÔNG keyscan trong workflow', d: 'quét ngay lúc chạy = tin bất cứ ai đang trả lời địa chỉ đó. Đó là <code>StrictHostKeyChecking=no</code> đội lốt.', c: 'red' },
      { t: 'Dựng lại VPS', d: 'khoá máy chủ đổi ⇒ deploy DỪNG với cảnh báo trên. Đúng ý: cập nhật secret có chủ đích.', c: 'amb' },
      { t: 'Khoá riêng cho CI', d: 'không dùng khoá cá nhân; thu hồi = xoá MỘT dòng <code>authorized_keys</code>.', c: 'blu' },
    ], 2)}`, 'l') },

  { t: 'concurrency chỉ xếp hàng trong MỘT nhóm', body: two(
    hangDoi() + box('tip', 'Khoá phải nằm ở nơi <b>bị tranh</b> — trên VPS — vì mọi đường deploy (CI, script tay, deploy-nha) đều đi qua đó.'),
    `${term([
      '$ (TAG=72f5fb8 docker compose up -d --no-build api) & \\',
      '  (TAG=02f98c0 docker compose up -d --no-build api) & wait',
      '== lan 1',
      '! A (72f5fb8) ma thoat 1',
      'B (02f98c0) ma thoat 0',
      '! Error response from daemon: Conflict. The container name',
      '! "/f5573b04ffbf_dat-lich-api-1" is already in use by container "3ad…',
      '== lan 2',
      'B ma thoat 0 · A ma thoat 0 → dang chay 72f5fb8',
      '== lan 3',
      'A ma thoat 0 · B ma thoat 0 → dang chay 02f98c0',
    ], { title: 'VPS — hai lần tráo cùng lúc, thật (gộp dòng)', fs: 12.5 })}
    ${term([
      'B: dang co mot lan deploy khac chay — thoat, khong chen ngang',
      'B: ma thoat 75',
      'A: [08:22:59] 241f233 -> 72f5fb8',
      '= A: [08:23:06] OK: dang chay 72f5fb8',
    ], { title: 'cùng việc đó qua trien-khai-ci (flock trên VPS)', fs: 12.5 })}`, 'l') },

  { t: 'Vì sao dự án bỏ push-to-deploy', body: two(
    `${table(['Ngày', 'Chuyện gì', 'Bài học'], [
      ['03/07', 'hai workflow deploy (<code>deploy-ghcr</code>, <code>backend-vps</code>) cùng chạy khi push <code>main</code>, đua nhau ⇒ feed 500 vì schema lệch ảnh', 'hai workflow = hai nhóm concurrency'],
      ['06/07', 'hai lần tráo đua ⇒ <code>Exited (137)</code> + container mồ côi; cứu bằng <code>docker start</code> tay', 'đúng cú Conflict ở slide 21'],
      ['sau đó', 'cả hai workflow chỉ còn <code>workflow_dispatch</code>; deploy = <code>deploy-nha.sh</code> chạy tay', 'push không bao giờ là deploy'],
    ], { sm: true })}
    ${box('info', 'Push lên <code>main</code> giờ chỉ chạy lint + type-check. Kiểm lại bằng một lệnh: <code>grep -A4 \'^on:\' .github/workflows/*.yml</code>.')}`,
    `${cards([
      { t: 'Push-to-deploy hợp khi', d: 'MỘT workflow duy nhất đụng production · có <code>concurrency</code> chung · có khoá trên máy chủ · migration nằm trong CHÍNH bước deploy.', c: 'grn' },
      { t: 'Không hợp khi', d: 'nhiều workflow/nhiều người cùng có đường vào VPS · migration chạy riêng · chưa có smoke-test + lùi tự động.', c: 'red' },
      { t: 'Ở giữa', d: '<code>environment: production</code> + người duyệt: build tự động, <strong>tráo</strong> chờ một cú bấm.', c: 'amb' },
    ], 1)}`, 'l') },

  /* ───────────── 13.4 ───────────── */
  { t: 'docker compose up -d rơi 83–134 request', body: `${roiRequest()}
    ${two(
      table(['Lần (tráo api, nginx đứng trước)', '502', 'Cửa sổ hỏng', 'up -d trả về sau'], [
        ['1', '134 / 363', '3.105 ms', '4.431 ms'],
        ['2', '103 / 470', '2.458 ms', '2.017 ms'],
        ['3', '83 / 515', '2.325 ms', '1.200 ms'],
        ['4', '89 / 514', '2.374 ms', '1.033 ms'],
      ], { sm: true }),
      box('bad', '<code>up -d</code> <b>dừng bản cũ TRƯỚC</b>, rồi mới tạo bản mới; app cần ~1,5 s để nghe cổng ⇒ nginx trả 502 suốt 2,3–3,1 s. Và lệnh trả về <b>trước</b> khi app sẵn sàng: script tiếp theo tưởng đã xong.'), 'l')}` },

  { t: '--wait sửa script, không sửa request', body: two(
    `${term([
      '$ docker compose up -d --no-build --wait api',
      ' Container dat-lich-api-1  Recreate',
      ' Container dat-lich-api-1  Started',
      ' Container dat-lich-api-1  Waiting',
      ' Container dat-lich-api-1  Healthy',
      '(up -d tra ve sau 7009 ms)',
      '! tong 470 request · 200: 373 · 502: 97',
      '! hong tu 1896 ms toi 4357 ms · cua so dai nhat 2461 ms',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13 })}
    ${term([
      'khong start_interval: 6161 ms',
      'khong start_interval: 5995 ms',
      '= start_interval 500ms: 2685 ms',
      '= start_interval 500ms: 2553 ms',
    ], { title: 'thời gian up -d --wait tới Healthy — output thật', fs: 13 })}`,
    `${box('info', '<code>--wait</code> chỉ cho <b>script</b> biết lúc nào an toàn để smoke-test. Vẫn 97 request 502 — bản cũ đã bị dừng từ trước.')}
    ${box('warn', 'Trong <code>start_period</code> Docker thăm dò theo <code>start_interval</code> — <b>mặc định 5 s</b>, không phải <code>interval</code>. App sẵn sàng sau 1,5 s mà phải chờ lần thăm dò lúc 5 s.')}
    ${yaml([
      ['    healthcheck:       # test: như slide 4', ''],
      ['      interval: 1s', 'sau khi đã khoẻ'],
      ['      start_period: 10s', 'lỗi trong này không tính'],
      ['      start_interval: 500ms', 'thăm dò dày lúc khởi động'],
    ], { fs: 13 })}
    ${box('tip', '<code>start_interval</code> cần Docker Engine 25+. Health phải kiểm thứ app CẦN (CSDL, cấu hình) — không chỉ "cổng đang mở".')}`, 'l') },

  { t: 'Xanh/lam sau nginx: 940/940 request 200', body: `${xanhLam()}
    ${two(term([
      '[1 ms] dang chay: api_lam · se len: api_xanh (2bed0bb)',
      '[2861 ms] api_xanh khoe (healthcheck)',
      '[3054 ms] smoke api_xanh /api/lich -> 401',
      '[3505 ms] nginx da tro sang api_xanh',
      '[9025 ms] da dung api_lam',
      '= tong 940 request · 200: 940',
      '= khong rot request nao',
    ], { title: 'tra-xanh-lam.sh 2bed0bb — VPS thí nghiệm, output thật', fs: 13 }),
    box('good', 'Hai dịch vụ <code>api_xanh</code>/<code>api_lam</code> trong CÙNG compose; nginx trỏ một màu qua tệp <code>dang-chay.inc</code>. Màu mới lên, khoẻ, qua smoke-test <b>rồi</b> mới nhận request; màu cũ được 5 s để trả nốt request đang dở. Ch3.3 làm việc này với tiến trình; đây là bản container.'), 'l')}` },

  { t: 'Bản hỏng không bao giờ nhận request', body: two(
    sh([
      ['CU=$(grep -o \'api_[a-z]*\' nginx/dang-chay.inc)', 'màu đang chạy'],
      ['[ "$CU" = api_xanh ] && MOI=api_lam || MOI=api_xanh', ''],
      ['sed -i "s/^$BIEN=.*/$BIEN=$TAG/" .env', 'TAG_XANH / TAG_LAM'],
      ['docker compose up -d --no-build --wait --wait-timeout 20 "$MOI" \\', ''],
      ['  || { echo "HONG — giu $CU"; docker compose stop "$MOI"; exit 1; }', ''],
      ['MA=$(docker compose exec -T web curl -s -o /dev/null \\', 'smoke qua mạng'],
      ['     -w \'%{http_code}\' "http://$MOI:3000/api/lich")', 'nội bộ'],
      ['[ "$MA" = 401 ] || { docker compose stop "$MOI"; exit 1; }', ''],
      ['echo "upstream api { server $MOI:3000; }" > nginx/dang-chay.inc', ''],
      ['docker compose exec -T web nginx -t && … nginx -s reload', 'hỏng -t ⇒ dừng'],
      ['sleep 5; docker compose stop "$CU"', 'drain rồi mới tắt'],
    ], { fs: 12 }),
    `${term([
      '# 19efddb = v6: thieu mot bien moi, sap luc khoi dong',
      '$ bash /tmp/doB.sh 19efddb',
      '[0 ms] dang chay: api_xanh · se len: api_lam (19efddb)',
      '! [887 ms] HONG: api_lam khong khoe — giu api_xanh',
      'ma thoat 1',
      '= tong 1653 request · 200: 1653',
      '= khong rot request nao',
      '$ docker compose ps -a \\',
      '    --format "{{.Service}} {{.Status}}"',
      'api_lam Exited (1) Less than a second ago',
      'api_xanh Up About a minute (healthy)',
    ], { title: 'VPS — output thật (gộp hai lần chạy)', fs: 12 })}
    ${box('good', 'So với 18/08: bản không nạp nổi engine sẽ chết ở bước <code>--wait</code>, nginx <b>chưa từng</b> trỏ sang nó. Người dùng không thấy gì; người deploy thấy <code>ma thoat 1</code>.')}
    ${box('warn', 'Giá: hai bản cùng chạy vài giây (gấp đôi RAM api); migration phải hợp cả hai (Ch5).')}`, 'l') },

  { t: 'nginx nhớ IP cũ tới khi được reload', body: two(
    `${term([
      '$ (IP cua api) 172.18.0.3',
      '$ docker compose rm -sf api && docker run -d --name chiem … sleep 1d',
      '  chiem lay IP 172.18.0.3',
      '$ docker compose up -d --wait api',
      '  api moi: 172.18.0.5',
      '$ curl -s -o /dev/null -w "%{http_code}" 127.0.0.1:8080/api/ban',
      '! 502 502 502',
      '$ docker compose logs web | grep -m1 connect',
      '! [error] … connect() failed (111: Connection refused) while connecting',
      '! to upstream … upstream: "http://172.18.0.3:3000/api/ban"',
      '$ docker compose exec web nginx -s reload',
      '= 200',
    ], { title: 'VPS thí nghiệm — output thật (xuống dòng cho vừa)', fs: 12.5 })}`,
    `${box('bad', '<code>proxy_pass http://api:3000</code> phân giải tên <b>MỘT lần</b> lúc nginx khởi động ⇒ container đổi IP thì nginx gõ cửa IP cũ (Ch3.3).')}
    ${conf([
      ['resolver 127.0.0.11 valid=5s;', 'DNS nội bộ của Docker'],
      ['location / {', ''],
      ['  set $api http://api:3000;', 'biến ⇒ phân giải lúc CHẠY'],
      ['  proxy_pass $api;', ''],
      ['}', ''],
    ], { fs: 14 })}
    ${term([
      '  chiem2 lay IP 172.18.0.5',
      '  api moi: 172.18.0.6',
      '$ (moi giay mot curl, KHONG reload nginx)',
      '= 200 200 200 200 200 200 200',
    ], { title: 'cùng phép thử, có resolver — output thật', fs: 13 })}
    ${box('tip', 'Xanh/lam không dính: mỗi lần tráo đã có sẵn <code>nginx -s reload</code>.')}`, 'l') },

  /* ───────────── cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 13', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Deploy "xong", route mới 404', 'tag <code>:latest</code> đã có trên đĩa ⇒ không kéo', 'tag = mã commit; smoke một route MỚI'],
    ['Build/push/tráo xanh, rồi <code>Restarting (1)</code>', 'engine glibc trong nền musl (hoặc arm64 trong amd64)', 'chốt kiểm ảnh: NẠP engine trước <code>push</code>'],
    ['Sửa nginx.conf, reload OK, không đổi gì', 'bind-mount một tệp giữ inode cũ', '<code>cat &gt;</code> tại chỗ, hoặc gắn thư mục; kiểm sha256 trong container'],
    ['Sau reboot web không lên', 'thiếu <code>restart:</code> (mặc định <code>no</code>)', '<code>restart: unless-stopped</code>'],
    ['Đĩa VPS đầy vì log', '<code>json-file</code> không trần', '<code>max-size</code>/<code>max-file</code>'],
    ['Mất sạch CSDL sau "dọn dẹp"', '<code>docker compose down -v</code>', 'script chỉ <code>up -d --no-build &lt;dịch vụ&gt;</code>'],
    ['Mỗi lần deploy 2–3 s toàn 502', '<code>up -d</code> dừng cũ trước khi mới sẵn sàng', 'xanh/lam sau nginx + healthcheck'],
    ['502 sau khi container được tạo lại', 'nginx giữ IP cũ', '<code>nginx -s reload</code> hoặc <code>resolver</code> + biến'],
    ['Hai deploy cùng lúc, Conflict / sai bản', 'concurrency chỉ trong một nhóm', '<code>flock</code> trên VPS'],
    ['Secret CI lộ = mất VPS', 'khoá CI mở shell', '<code>command="…",restrict</code> + known_hosts ghim'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 13 (1/2): compose và ảnh', body: two(
    sh([
      ['docker compose config --images', 'ảnh sẽ chạy (sau thay biến)'],
      ['docker compose up -d --no-build --wait api', 'tráo MỘT dịch vụ, chờ khoẻ'],
      ['docker compose up -d --pull never api', 'lùi khi registry sập'],
      ['docker compose pull api', 'kéo trước, tráo sau'],
      ['docker compose ps --format "{{.Service}} {{.Status}}"', ''],
      ['docker inspect -f \'{{.Config.Image}}\' dat-lich-api-1', 'đang chạy tag nào'],
      ['docker inspect -f \'{{.RestartCount}}\' dat-lich-api-1', 'vòng restart?'],
      ['docker compose exec -T web sha256sum /etc/nginx/nginx.conf', 'container thấy gì'],
      ['docker build --platform linux/amd64 -f Dockerfile.backend …', 'ĐÚNG tệp, ĐÚNG CPU'],
      ['docker image inspect -f \'{{.Os}}/{{.Architecture}}\' ANH', ''],
      ['./chot-kiem-anh.sh ANH && docker push ANH', 'chốt TRƯỚC khi đẩy'],
      ['docker rmi KHO:TAG', 'xoá theo tên, không prune -a'],
    ], { fs: 13 }),
    table(['Dòng compose', 'Vì sao'], [
      ['<code>image: …:\${TAG:?}</code>', 'thiếu tag ⇒ từ chối'],
      ['<code>env_file:</code> ngoài git', 'bí mật không vào ảnh'],
      ['<code>restart: unless-stopped</code>', 'dậy sau reboot'],
      ['<code>mem_limit</code>', 'trần RAM từng dịch vụ'],
      ['<code>logging.options.max-size</code>', 'log không ăn đĩa'],
      ['<code>healthcheck</code> + <code>start_interval</code>', 'biết khi nào khoẻ, sớm'],
      ['<code>depends_on: condition: service_healthy</code>', 'thứ tự lúc <code>up</code>'],
      ['volume CÓ TÊN cho DB', 'sống qua <code>down</code> (không <code>-v</code>)'],
      ['bind-mount THƯ MỤC cấu hình', 'khỏi bẫy inode'],
    ], { sm: true }), 'l') },

  { t: 'Bảng tra nhanh Chương 13 (2/2): CI và tráo', body: two(
    `${yaml([
      ['on: { workflow_dispatch: }', 'bấm tay'],
      ['permissions: { contents: read, packages: write }', ''],
      ['concurrency: { group: deploy-production, cancel-in-progress: false }', ''],
      ['environment: production', 'duyệt + secret riêng'],
      ['ssh -o StrictHostKeyChecking=yes … "deploy $TAG"', ''],
    ], { fs: 12.5 })}
    ${conf([
      ['command="/home/deploy/bin/trien-khai-ci",restrict ssh-ed25519 AAAA… ci', ''],
    ], { fs: 12.5, lang: 'keys' })}
    ${conf([
      ['upstream api { server api_lam:3000; }', 'dang-chay.inc'],
      ['resolver 127.0.0.11 valid=5s;', 'khi proxy tới TÊN container'],
    ], { fs: 13 })}
    ${box('info', 'Khoá <code>flock</code> quanh cả năm bước. Lùi = chạy lại đúng các bước với tag trong <code>da-len.log</code>.')}`,
    `${steps([
      ['Kéo ảnh (tag = commit)', 'lỗi ở đây: chưa đụng gì'],
      ['Lên màu ĐANG NGHỈ, <code>--wait</code>', 'hỏng ⇒ stop nó, giữ màu cũ'],
      ['Smoke-test vào màu mới', '401/200 đạt · 404 ảnh cũ'],
      ['Ghi <code>dang-chay.inc</code> → <code>nginx -t</code> → reload', ''],
      ['Drain vài giây, stop màu cũ', 'ghi <code>da-len.log</code>'],
    ])}`, 'l') },

  { t: 'Thực hành Chương 13 (45 phút): đường ống trọn', body: `
    ${steps([
      ['VPS thí nghiệm có Docker + <code>registry:2</code>; compose <code>dat-lich</code> với TAG = commit', '<code>docker compose ps</code>: api/db <code>healthy</code>'],
      ['Dựng ảnh SAI (glibc → musl) và ĐÚNG; chạy <code>chot-kiem-anh.sh</code> cả hai', 'mã thoát 1 và 0, ghi dòng lỗi'],
      ['Cài khoá CI <code>command=…,restrict</code>; thử <code>deploy &lt;sha&gt;</code>, <code>deploy latest</code>, xin shell, <code>-L</code>', 'một OK, ba từ chối'],
      ['Đo <code>up -d</code> dưới tải bằng <code>do.mjs</code>, rồi đo <code>tra-xanh-lam.sh</code>', 'số 502 của mỗi cách'],
      ['Tráo sang bản cố tình hỏng bằng xanh/lam; rồi tắt registry và lùi <code>--pull never</code>', '0 request rơi · lùi thành công khi registry sập'],
    ])}
    ${box('good', '<b>Đạt khi:</b> có số 502 của <code>up -d</code> vs 0 của xanh/lam, một ảnh hỏng bị chặn TRƯỚC khi đẩy, một khoá CI một-lệnh — và <code>docker ps -a --filter name=dv13-</code> rỗng.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
