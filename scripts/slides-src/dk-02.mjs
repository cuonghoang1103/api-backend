/**
 * Docker · Deck dk-02 — Chương 2: Chạy container.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 23/09/2026:
 *   • "máy Mac"    = Mac M1, Docker Desktop 4.91 / Engine 29.8.0, arm64 (máy ảo 10 CPU, 7,7 GiB)
 *   • "máy Linux"  = Fedora 44, Docker Engine 29.6.2, amd64 (không sudo — soi nhân bằng container phụ)
 * Tên container trong output mang tiền tố dk02- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 *
 * Hình tự vẽ (SVG nội tuyến): anatomy() — giải phẫu một câu lệnh docker run, mỗi phần một mũi tên;
 * pubMap() — -p 0.0.0.0 so với 127.0.0.1; entryCmd() — ENTRYPOINT + CMD = lệnh cuối;
 * backoff() — dòng thời gian restart on-failure đo bằng docker events; healthLine() — vòng đời healthcheck.
 */
import { S, cover, cards, box, steps, table, vs, kpis, flow, two, mindmap, host, term as dkTerm, diagram, yaml, bars, layers, sv, R, T, A, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });

export const deck = { key: 'dk-02', code: 'DOCKER · CHƯƠNG 2', title: 'Chạy container', sub: 'Docker · Chương 2' };

/* ───────────── Slide 3 — giải phẫu một câu lệnh docker run ───────────── */
const anatomy = () => {
  const rows = [
    ['docker run', 'lệnh: TẠO + CHẠY một container mới', 'dk', 'LỆNH'],
    ['  -d', 'chạy nền, trả terminal lại cho bạn', 'grn', 'N1 · CHẠY'],
    ['  --name web', 'tên cố định để gọi lại: logs web, exec web', 'grn', 'N1 · CHẠY'],
    ['  --restart unless-stopped', 'tự dựng lại khi sập / khi máy khởi động', 'grn', 'N1 · CHẠY'],
    ['  -p 127.0.0.1:18025:80', 'cổng MÁY CHỦ (chỉ localhost) → cổng 80 CONTAINER', 'blu', 'N2 · MẠNG'],
    ['  -v "$PWD/web:/usr/share/nginx/html:ro"', 'thư mục của bạn hiện ra bên trong, chỉ đọc', 'vio', 'N3 · DỮ LIỆU'],
    ['  -e TZ=Asia/Ho_Chi_Minh', 'một biến môi trường cho tiến trình', 'tea', 'N4 · CẤU HÌNH'],
    ['  --memory 256m', 'trần RAM — vượt là bị giết (exit 137)', 'amb', 'N5 · GIỚI HẠN'],
    ['  nginx:1.27-alpine', 'ẢNH = tên:tag. Mọi thứ SAU chữ này là của container', 'red', 'ẢNH'],
    ['  (trống)', 'không ghi lệnh ⇒ dùng CMD có sẵn trong ảnh', 'pnk', 'N6 · LỆNH'],
  ];
  const y0 = 18, rh = 41;
  let s = '';
  rows.forEach(([c, d, col, k], i) => {
    const y = y0 + i * rh;
    s += R(0, y, 470, rh - 7, { c: col, fill: '#0b1322', r: 7, sw: 2 });
    s += T(12, y + 23, c, { fs: 15.5, mono: true, c: c.includes('(trống)') ? 'dim' : '#e6edf3', b: i === 0 || i === 8 });
    s += A(478, y + 17, 548, y + 17, { c: ['dk', 'amb', 'red', 'grn', 'tea', 'vio'].includes(col) ? col : 'dk', sw: 2.5 });
    s += R(556, y + 3, 128, rh - 13, { c: col, fill: D[col] || col, r: 6, sw: 0, op: 0.9 });
    s += T(620, y + 22, k, { fs: 12.5, a: 'middle', b: true, c: '#08101e' });
    s += T(698, y + 23, d, { fs: 16 });
  });
  // ranh giới sau tên ảnh
  const yb = y0 + 8 * rh - 4;
  s += `<line x1="0" y1="${yb}" x2="1150" y2="${yb}" stroke="${D.red}" stroke-width="2" stroke-dasharray="6 6"/>`;
  s += T(1148, yb - 6, 'trên đường này: cờ của Docker', { fs: 13, a: 'end', c: 'red' });
  return sv(1150, y0 + rows.length * rh + 4, s);
};

/* ───────────── Slide 7 — -p 0.0.0.0 so với 127.0.0.1 ───────────── */
const pubMap = () => sv(620, 430,
  R(170, 6, 444, 418, { c: 'dim', fill: 'rgba(17,26,43,.7)', r: 16 }) +
  T(186, 34, 'Máy Mac của bạn', { fs: 17, b: true }) +
  R(186, 56, 180, 60, { c: 'grn', fill: '#0d1628', r: 10 }) + T(276, 82, '192.168.1.101', { fs: 15, a: 'middle', mono: true }) + T(276, 102, 'card mạng LAN', { fs: 13, a: 'middle', c: 'mu' }) +
  R(186, 300, 180, 60, { c: 'tea', fill: '#0d1628', r: 10 }) + T(276, 326, '127.0.0.1', { fs: 15, a: 'middle', mono: true }) + T(276, 346, 'loopback: chỉ chính máy', { fs: 13, a: 'middle', c: 'mu' }) +
  R(420, 56, 196, 84, { c: 'dk', fill: '#0d1628', r: 10 }) + T(515, 82, 'web a', { fs: 16, a: 'middle', b: true }) + T(515, 104, '-p 18020:80', { fs: 13.5, a: 'middle', mono: true, c: 'mu' }) + T(515, 124, '0.0.0.0 = mọi card', { fs: 13, a: 'middle', c: 'amb' }) +
  R(420, 290, 196, 84, { c: 'dk', fill: '#0d1628', r: 10 }) + T(515, 316, 'web b', { fs: 16, a: 'middle', b: true }) + T(518, 338, '-p 127.0.0.1:18021:80', { fs: 12, a: 'middle', mono: true, c: 'mu' }) + T(515, 358, 'chỉ loopback', { fs: 13, a: 'middle', c: 'tea' }) +
  A(366, 86, 418, 92, { c: 'grn' }) + A(366, 322, 418, 326, { c: 'tea' }) + A(366, 316, 418, 110, { c: 'grn', dash: true }) +
  R(4, 60, 140, 52, { c: 'amb', fill: '#0d1628', r: 10 }) + T(74, 84, 'máy bạn cùng', { fs: 14, a: 'middle' }) + T(74, 102, 'nhóm (LAN)', { fs: 14, a: 'middle' }) +
  A(144, 86, 184, 86, { c: 'amb' }) +
  T(186, 160, '→ a: 200  ·  → b: KHÔNG tới', { fs: 15, c: 'amb', b: true }) +
  T(186, 184, '(b không nghe trên card LAN)', { fs: 13.5, c: 'mu' }) +
  T(186, 400, 'curl localhost:18020 và :18021 → đều 200', { fs: 14, c: 'tea' }));

/* ───────────── Slide 8 — ENTRYPOINT + CMD = lệnh cuối cùng ───────────── */
const entryCmd = () => {
  const rows = [
    ['docker run alpine echo hi', '', '/bin/sh', 'echo hi', 'echo hi', 'CMD bị THAY'],
    ['docker run nginx:1.27-alpine nginx -v', '/docker-entrypoint.sh', 'nginx -g daemon off;', 'nginx -v', '/docker-entrypoint.sh nginx -v', 'script VẪN chạy trước'],
    ['docker run node:22-alpine -v', 'docker-entrypoint.sh', 'node', '-v', 'docker-entrypoint.sh -v → node -v', 'script tự thêm "node"'],
    ['docker run --entrypoint sh nginx:1.27-alpine -c "echo hi"', 'sh', 'nginx -g daemon off;', '-c "echo hi"', 'sh -c "echo hi"', 'thay CẢ HAI'],
  ];
  let s = T(0, 16, 'Bạn gõ', { fs: 14, c: 'mu', b: true }) + T(0, 16, '', {}) +
    T(470, 16, 'ENTRYPOINT', { fs: 14, c: 'amb', b: true, a: 'middle' }) + T(700, 16, 'CMD', { fs: 14, c: 'tea', b: true, a: 'middle' }) +
    T(1150, 16, 'Tiến trình thật chạy', { fs: 14, c: 'grn', b: true, a: 'end' });
  rows.forEach(([cmd, ep, oldCmd, newCmd, res, note], i) => {
    const y = 26 + i * 97;
    s += T(0, y + 20, cmd, { fs: 15, mono: true });
    s += R(370, y + 34, 200, 44, { c: 'amb', fill: '#1a1608', r: 8, sw: 2 }) + T(470, y + 61, ep || '(trống)', { fs: 14, a: 'middle', mono: true, c: ep ? '#e6edf3' : 'dim' });
    s += T(588, y + 62, '+', { fs: 24, b: true, c: 'mu', a: 'middle' });
    s += R(606, y + 34, 190, 44, { c: 'tea', fill: '#08191a', r: 8, sw: 2 }) +
      T(701, y + 52, oldCmd, { fs: 12, a: 'middle', mono: true, c: 'dim' }) +
      `<line x1="${701 - oldCmd.length * 3.6}" y1="${y + 48}" x2="${701 + oldCmd.length * 3.6}" y2="${y + 48}" stroke="${D.red}" stroke-width="1.6"/>` +
      T(701, y + 71, newCmd, { fs: 14, a: 'middle', mono: true, b: true });
    s += A(804, y + 56, 836, y + 56, { c: 'grn', sw: 2.5 });
    s += R(842, y + 34, 308, 44, { c: 'grn', fill: '#0b1a10', r: 8, sw: 2 }) + T(996, y + 61, res, { fs: 13.5, a: 'middle', mono: true });
    s += T(1150, y + 20, note, { fs: 13.5, a: 'end', c: i === 1 ? 'amb' : 'mu' });
  });
  return sv(1150, 418, s);
};

/* ───────────── Slide 28 — dòng thời gian restart on-failure:3 (docker events thật) ───────────── */
const backoff = () => {
  const X = (t) => 60 + t * 105; // 0..10 s
  let s = '';
  for (let t = 0; t <= 10; t++) s += `<line x1="${X(t)}" y1="20" x2="${X(t)}" y2="150" stroke="#1d2a40"/>` + T(X(t), 172, `${t}s`, { fs: 13.5, a: 'middle', c: 'dim', mono: true });
  const runs = [[0.09, 2.16], [2.26, 4.34], [4.53, 6.61], [7.00, 9.08]];
  runs.forEach(([a, b], i) => {
    s += `<rect x="${X(a)}" y="60" width="${X(b) - X(a)}" height="40" rx="6" fill="${D.dk}" opacity=".35" stroke="${D.dk}"/>` +
      T((X(a) + X(b)) / 2, 86, i ? `lần ${i + 1} · restart ${i}` : 'lần 1', { fs: 14, a: 'middle', b: true });
    s += `<circle cx="${X(b)}" cy="80" r="7" fill="${D.red}"/>`;
  });
  [[2.16, 2.26, '0,10 s'], [4.34, 4.53, '0,19 s'], [6.61, 7.00, '0,39 s']].forEach(([a, b, l]) => {
    s += T((X(a) + X(b)) / 2, 48, l, { fs: 14, a: 'middle', c: 'amb', b: true, mono: true });
  });
  s += T(X(9.08) + 12, 86, 'hết 3 lượt ⇒ exited', { fs: 14, c: 'red', b: true });
  s += T(60, 136, '● đỏ = die (exit 1) · số vàng = Docker CHỜ trước lần start kế — gấp đôi mỗi lần (tối đa 1 phút)', { fs: 14, c: 'mu' });
  return sv(1150, 182, s);
};

/* ───────────── Slide 29 — vòng đời healthcheck ───────────── */
const healthLine = () => {
  const box3 = (x, t, d, c) => R(x, 20, 300, 96, { c, fill: '#0d1628', r: 12 }) + T(x + 150, 54, t, { fs: 20, a: 'middle', b: true, c }) + T(x + 150, 84, d, { fs: 14.5, a: 'middle', c: 'mu' });
  return sv(1150, 190,
    box3(0, 'starting', 'trong start-period 10 s', 'amb') +
    box3(425, 'healthy', 'wget trả 0 · sau 12 s', 'grn') +
    box3(850, 'unhealthy', '3 lần liền trả 1 (403)', 'red') +
    A(302, 68, 423, 68, { c: 'grn' }) + T(362, 58, 'kiểm đạt', { fs: 14, a: 'middle', c: 'grn' }) +
    A(727, 68, 848, 68, { c: 'red' }) + T(787, 58, 'xoá index.html', { fs: 14, a: 'middle', c: 'red' }) +
    T(1000, 150, 'container VẪN Up · RestartCount=0', { fs: 17, a: 'middle', b: true, c: 'amb' }) +
    T(1000, 176, 'Docker trần chỉ BÁO, không làm gì', { fs: 14.5, a: 'middle', c: 'mu' }) +
    T(150, 150, 'mỗi 5 s: docker exec một lệnh kiểm', { fs: 14.5, a: 'middle', c: 'mu' }));
};

export const slides = S([
  cover({ t: 'Chương 2 — Chạy container', sub: 'docker run &amp; sáu nhóm cờ · quan sát · vào bên trong · môi trường &amp; người dùng · giới hạn, restart, healthcheck', chap: 'CHƯƠNG 2' }),

  { t: 'Bản đồ chương: 5 bài, từ gõ lệnh tới giữ nó sống', body: mindmap('Chạy container', 'cờ nào · nhìn đâu · vào đâu', [
    { t: '2.1 docker run', d: 'giải phẫu câu lệnh · 6 nhóm cờ · ENTRYPOINT + CMD', c: 'dk' },
    { t: '2.2 Quan sát', d: 'logs · inspect · stats · top · diff · events', c: 'tea' },
    { t: '2.3 Vào bên trong', d: 'exec ≠ attach · -i/-t · ảnh không có shell', c: 'vio' },
    { t: '2.4 Môi trường &amp; user', d: '-e · --env-file · bí mật · -u · múi giờ', c: 'amb' },
    { t: '2.5 Giới hạn &amp; restart', d: '--memory · --cpus · restart · healthcheck', c: 'red' },
  ]) },

  /* ───────────── 2.1 ───────────── */
  { t: 'Giải phẫu một câu lệnh docker run: mỗi mẩu một việc', body: `
    ${anatomy()}
    <p style="font-size:15px;color:${D.mu};text-align:center;margin-top:-4px">Output thật (máy Mac): in ra <code>8776815f28ab</code> · <code>curl localhost:18025</code> → <code>&lt;h1&gt;xin chao&lt;/h1&gt;</code> · <code>docker ps</code> → <code>127.0.0.1:18025-&gt;80/tcp</code></p>` },

  { t: 'Mọi thứ SAU tên ảnh thuộc về container — kể cả “-it”', body: two(
    term(['$ docker run --rm alpine echo hello', '= hello', '$ docker run --name x alpine -it', '! docker: Error response from daemon: failed to create', '! task … exec: "-it": executable file not found in $PATH', '$ echo $?', '! 127', '$ docker ps -a --filter name=x --format \'{{.Names}} {{.Status}}\'', '+ x Created', '$ docker run --rm -it alpine sh -c \'echo ok\'', '= ok'], { title: 'output thật — máy Mac, Docker 29.8' }),
    `${steps([
      ['<code>docker run [CỜ] ẢNH [LỆNH] [THAM SỐ]</code>', 'cờ của Docker ⟵ tên ảnh ⟶ của tiến trình bên trong'],
      ['<code>alpine -it</code> ⇒ tìm chương trình <code>-it</code>', 'không có ⇒ exit 127, container kẹt ở Created'],
      ['Cờ “không ăn”? Nhìn nó nằm bên nào của tên ảnh', 'đây là lỗi số 1 của người mới'],
    ])}
    ${box('tip', 'Container <b>Created</b> vẫn chiếm tên <code>x</code>: lần chạy sau sẽ báo <code>Conflict. The container name "/x" is already in use</code> ⇒ <code>docker rm x</code>.')}`, 'l') },

  { t: 'Bảng cờ (1/2): chạy · mạng · dữ liệu', body: table(['Cờ', 'Nghĩa', 'Ví dụ', 'Khi nào dùng'], [
    ['<code>-d</code>', 'Chạy nền, in ID', '<code>-d nginx</code>', 'Dịch vụ chạy lâu (web, CSDL)'],
    ['<code>-it</code>', 'Giữ stdin + cấp terminal', '<code>-it alpine sh</code>', 'Bạn ngồi gõ vào shell'],
    ['<code>--rm</code>', 'Xoá container khi thoát', '<code>--rm alpine date</code>', 'Lệnh chạy một lần; KHÔNG cho dịch vụ'],
    ['<code>--name</code>', 'Đặt tên (duy nhất trên máy)', '<code>--name db</code>', 'Mọi thứ bạn sẽ gọi lại'],
    ['<code>--restart</code>', 'Tự dựng lại khi thoát', '<code>--restart unless-stopped</code>', 'Dịch vụ trên máy chủ (Bài 2.5)'],
    ['<code>--init</code>', 'tini làm PID 1', '<code>--init node app.js</code>', 'App không tự bắt SIGTERM (Bài 1.3)'],
    ['<code>-p</code>', 'Mở cổng máy chủ → container', '<code>-p 127.0.0.1:5432:5432</code>', 'Truy cập từ trình duyệt / máy bạn'],
    ['<code>--network</code>', 'Gắn vào mạng riêng', '<code>--network app</code>', 'Container gọi nhau bằng TÊN (Ch.8)'],
    ['<code>-v tên:/đg</code>', 'Volume có tên', '<code>-v pgdata:/var/lib/postgresql/data</code>', 'Dữ liệu phải sống qua <code>rm</code>'],
    ['<code>-v /đg:/đg:ro</code>', 'Bind mount thư mục máy bạn', '<code>-v "$PWD:/app"</code>', 'Mã nguồn khi dev, file cấu hình'],
    ['<code>--tmpfs</code>', 'Thư mục trong RAM', '<code>--tmpfs /tmp:size=64m</code>', 'File tạm, không muốn chạm đĩa'],
  ], { sm: true }) },

  { t: 'Bảng cờ (2/2): cấu hình · giới hạn · ghi đè ảnh', body: table(['Cờ', 'Nghĩa', 'Ví dụ', 'Khi nào dùng'], [
    ['<code>-e</code>', 'Đặt biến môi trường', '<code>-e NODE_ENV=production</code>', 'Cấu hình khác nhau giữa máy'],
    ['<code>--env-file</code>', 'Nạp cả file biến', '<code>--env-file .env</code>', 'Nhiều biến; ⚠ đọc NGUYÊN VĂN'],
    ['<code>-w</code>', 'Thư mục làm việc', '<code>-w /app</code>', 'Chạy lệnh ở đúng thư mục dự án'],
    ['<code>-u</code>', 'Chạy dưới UID:GID', '<code>-u "$(id -u):$(id -g)"</code>', 'File ghi ra bind mount không thuộc root'],
    ['<code>--memory</code>', 'Trần RAM (cứng)', '<code>--memory 256m</code>', 'MỌI dịch vụ trên máy chủ'],
    ['<code>--cpus</code>', 'Hạn ngạch CPU', '<code>--cpus 0.5</code>', 'Không cho một container ăn hết CPU'],
    ['<code>--pids-limit</code>', 'Trần số tiến trình', '<code>--pids-limit 100</code>', 'Chặn bom fork'],
    ['<code>--health-cmd</code>', 'Lệnh tự kiểm sức khoẻ', '<code>--health-cmd "wget -qO- …"</code>', 'Để Compose/deploy biết lúc nào “sẵn sàng”'],
    ['(sau tên ảnh)', 'THAY CMD của ảnh', '<code>nginx:1.27-alpine nginx -v</code>', 'Chạy lệnh khác trong cùng ảnh'],
    ['<code>--entrypoint</code>', 'THAY ENTRYPOINT', '<code>--entrypoint ""</code>', 'Entrypoint chắn đường khi gỡ lỗi'],
  ], { sm: true }) },

  { t: '-p 18020:80 mở cho cả LAN — thêm 127.0.0.1: là chỉ mình bạn', body: two(
    pubMap(),
    `${term(['# a: -p 18020:80   ·   b: -p 127.0.0.1:18021:80', '$ docker port a ; docker port b', '80/tcp -> 0.0.0.0:18020', '80/tcp -> [::]:18020', '80/tcp -> 127.0.0.1:18021', '$ IP=192.168.1.101      # địa chỉ LAN của chính máy', '$ curl -so /dev/null -w \'%{http_code}\' $IP:18020', '= 200', '$ curl -so /dev/null -w \'%{http_code}\' $IP:18021', '! 000          # curl exit 7: không kết nối được'], { title: 'output thật — máy Mac', fs: 14 })}
    ${box('warn', 'Trên VPS, <code>-p 5432:5432</code> = CSDL ra internet — và luật cổng của Docker nằm TRƯỚC ufw (Chương 8).')}`, 'r') },

  { t: 'ENTRYPOINT + CMD = lệnh thật chạy; tham số chỉ thay CMD', body: `
    ${entryCmd()}
    ${box('info', 'Xem hai nửa bằng <code>docker image inspect</code> (bảng tra nhanh). <code>--entrypoint ""</code> xoá trắng nửa đầu — lối thoát khi script chắn đường.')}` },

  /* ───────────── 2.2 ───────────── */
  { t: 'Sáu câu hỏi khi container “có vấn đề” — mỗi câu một lệnh', body: `
    ${flow([
      { e: '🗣', t: 'Nó NÓI gì?', d: 'docker logs --since 10m --tail 50', c: 'dk' },
      { e: '🪪', t: 'Nó LÀ gì?', d: 'docker inspect --format', c: 'tea' },
      { e: '📈', t: 'Nó DÙNG bao nhiêu?', d: 'docker stats --no-stream', c: 'amb' },
      { e: '⚙️', t: 'Nó CHẠY gì?', d: 'docker top', c: 'vio' },
      { e: '📝', t: 'Nó ĐỔI gì?', d: 'docker diff', c: 'grn' },
      { e: '🕰', t: 'Đã XẢY RA gì?', d: 'docker events --since 1h', c: 'red' },
    ])}
    ${term(['$ docker events --since 40s --until 0s --filter container=api --format \'{{.Action}}\' | head -7', 'create', 'start', '! oom', '! die', 'start', '! oom', '! die            # … lặp tới restarts=4 — cả câu chuyện trong 7 dòng'], { title: 'output thật — máy Mac' })}` },

  { t: 'docker logs = stdout + stderr của PID 1, cất trong một file JSON', body: two(
    `${term(['$ docker logs web 2>/dev/null | tail -1        # chỉ stdout', '192.168.65.1 - - [23/Sep/2026:14:03:41 +0000] "GET /missing', 'HTTP/1.1" 404 153 "-" "curl/8.7.1" "-"', '$ docker logs web 2>&1 >/dev/null | tail -1   # chỉ stderr', '! 2026/09/23 14:03:41 [error] 33#33: *2 open() "/usr/share/', '! nginx/html/missing" failed (2: No such file or directory)', '$ docker inspect -f \'{{.HostConfig.LogConfig.Type}}\' web', 'json-file'], { title: 'output thật — máy Mac' })}
    ${term(['# máy Linux: đọc file log qua container phụ (không sudo)', '-rw-r-----  1 root root  3.8K … 84b81865…-json.log', '{"log":"172.17.0.1 - - [23/Sep/2026:14:16:32 +0000] \\"GET / …', '\\n","stream":"stdout","time":"2026-09-23T14:16:32.660289774Z"}'], { title: 'máy Linux — /var/lib/docker/containers/<ID>/' })}`,
    `${table(['Cờ', 'Làm gì'], [
      ['<code>--tail 50</code>', '50 dòng cuối'],
      ['<code>-f</code>', 'bám theo (Ctrl-C thoát, app KHÔNG sao)'],
      ['<code>--since 10m</code>', 'từ 10 phút trước'],
      ['<code>--until …</code>', 'tới mốc giờ (khoanh sự cố)'],
      ['<code>-t</code>', 'kèm giờ Docker nhận dòng'],
    ], { sm: true })}
    ${box('warn', '<code>json-file</code> mặc định <b>không có trần</b>. Đặt <code>max-size</code>/<code>max-file</code> trong <code>daemon.json</code> trước khi đĩa đầy.')}`, 'l') },

  { t: 'File log và bộ đệm làm docker logs trống trơn', body: two(
    term(['$ docker run -d --name filelog alpine sh -c \\', '    \'while true; do echo "to a file" >> /var/log/app.log; sleep 2; done\'', '$ docker logs filelog', '# (không có dòng nào)', '$ docker exec filelog tail -2 /var/log/app.log', '= to a file', '= to a file', '$ docker exec web ls -l /var/log/nginx/', 'access.log -> /dev/stdout', 'error.log -> /dev/stderr'], { title: 'output thật — máy Mac', fs: 14 }),
    `${bars([
      { l: 'python, print() mặc định', sub: 'stdout không phải TTY ⇒ đệm', v: 0.15, txt: '0 dòng', c: 'red' },
      { l: 'python + PYTHONUNBUFFERED=1', sub: 'ghi ngay từng dòng', v: 5, txt: '5 dòng', c: 'grn' },
    ], { lw: 220, max: 5 })}
    <p style="font-size:15px;color:${D.mu}">Cùng một script in “tick” mỗi giây, đếm <code>docker logs | wc -l</code> sau 4 giây (máy Mac).</p>
    ${box('tip', 'Luật của container: <b>log ra stdout/stderr</b>. Framework đòi đường dẫn file? Trỏ nó vào <code>/dev/stdout</code> — đúng như ảnh nginx.')}`, 'l2') },

  { t: 'docker inspect: một dòng phân loại mọi container', body: `
    ${term(['$ docker inspect $(docker ps -aq) --format \\', '    \'{{.Name}} {{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}\'', '! /api exited exit=137 oom=true restarts=4', '/filelog running exit=0 oom=false restarts=0', '/web running exit=0 oom=false restarts=0', '/db running exit=0 oom=false restarts=0'], { title: 'output thật — máy Mac' })}
    ${two(
    term(['$ docker inspect web --format \'{{.NetworkSettings.IPAddress}}\'', '! template parsing error: … map has no entry for key "IPAddress"', '$ docker inspect web --format \\', '    \'{{range $n, $c := .NetworkSettings.Networks}}{{$n}} {{$c.IPAddress}}{{end}}\'', '= bridge 172.17.0.5'], { title: 'Docker 29 đã bỏ trường cũ — hướng dẫn cũ trên mạng sẽ hỏng', fs: 13.5 }),
    table(['Trường', 'Trả lời'], [
      ['<code>.State.ExitCode</code>', 'chết vì sao'],
      ['<code>.State.OOMKilled</code>', 'có phải hết RAM'],
      ['<code>.RestartCount</code>', 'đang sập lặp?'],
      ['<code>.State.Health.Status</code>', 'healthcheck nói gì'],
      ['<code>.Mounts</code> · <code>.Config.Env</code>', 'dữ liệu · cấu hình'],
    ], { sm: true }), 'l2')}` },

  { t: 'stats · top · port · diff: đọc output từng cột', body: two(
    `${term(['$ docker stats --no-stream --format \\', '  \'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.PIDs}}\'', 'NAME       CPU %   MEM USAGE / LIMIT     PIDS', '+ web        0.00%   9.699MiB / 7.748GiB   11', '= l          0.00%   8.422MiB / 256MiB     11', '$ docker top web -o pid,user,args', 'PID     USER    COMMAND', '20449   root    nginx: master process nginx -g daemon off;', '+ 20492   statd   nginx: worker process', '$ docker diff web | head -3', 'C /var', 'C /var/cache', 'A /var/cache/nginx/client_temp'], { title: 'output thật — máy Mac' })}`,
    `${table(['Thấy', 'Đọc là'], [
      ['<code>/7.7GiB</code>', '!KHÔNG có trần RAM (đó là RAM máy ảo Docker Desktop)'],
      ['<code>/256MiB</code>', '+Có <code>--memory 256m</code>'],
      ['<code>PIDS 11</code>', '1 master + 10 worker (một worker/CPU)'],
      ['USER <code>statd</code>', '!UID 101 (nginx) tra theo <code>/etc/passwd</code> của MÁY CHỦ'],
      ['<code>A C D</code>', 'thêm · đổi · xoá trong tầng ghi'],
    ], { sm: true })}
    ${box('info', '<code>docker port web</code> trả lời nhanh “cổng nào đang mở ra máy chủ”.')}`, 'l') },

  { t: 'Cuộc quét 30 giây — và cái bẫy: hai --filter khác loại là “VÀ”', body: two(
    term(['$ docker ps -a --filter status=exited --filter health=unhealthy', '# (trống — không container nào vừa exited VỪA unhealthy)', '$ docker ps -a --filter health=unhealthy --format \'{{.Names}}\'', '! hc', '$ docker ps -a --filter status=exited --format \'{{.Names}}\'', '! api', '# cùng loại (vd hai --filter name=) thì mới là “HOẶC”'], { title: 'output thật — máy Mac', fs: 14 }),
    steps([
      ['<code>docker ps</code> — cái gì đang chạy, cổng nào', 'cột STATUS có “(unhealthy)”, “Restarting”'],
      ['exited · unhealthy', 'HAI lệnh <code>ps -a -f</code> riêng'],
      ['<code>inspect</code> restarts · oom', 'lọc dòng khác 0/false'],
      ['<code>stats</code> · <code>system df</code>', 'CPU/RAM · đĩa'],
      ['<code>logs --since 15m</code> + grep', 'lỗi gần đây từng container'],
    ]), 'l2') },

  /* ───────────── 2.3 ───────────── */
  { t: 'exec mở tiến trình MỚI — attach nối vào chính PID 1', body: `
    ${diagram({ w: 1160, h: 300, nodes: [
      { id: 'ta', x: 10, y: 20, w: 260, h: 90, t: 'Terminal A', d: 'docker attach web', c: 'red', ic: '💻' },
      { id: 'tb', x: 10, y: 190, w: 260, h: 90, t: 'Terminal B', d: 'docker exec -it web sh', c: 'grn', ic: '💻' },
      { id: 'p1', x: 480, y: 20, w: 300, h: 90, t: 'PID 1 · nginx master', d: 'stdin/stdout của CHÍNH app', c: 'amb' },
      { id: 'p2', x: 480, y: 190, w: 300, h: 90, t: 'PID 29 · sh (mới)', d: 'cùng namespace, không phải PID 1', c: 'tea' },
      { id: 'r1', x: 890, y: 20, w: 260, h: 90, t: 'Ctrl-C ⇒ SIGINT', d: 'app thoát ⇒ container Exited', c: 'red' },
      { id: 'r2', x: 890, y: 190, w: 260, h: 90, t: 'exit / Ctrl-C', d: 'chỉ sh chết · web vẫn Up', c: 'grn' },
    ], edges: [
      { from: 'ta', to: 'p1', t: 'nối stdio', c: 'red' }, { from: 'tb', to: 'p2', t: 'tạo tiến trình', c: 'grn' },
      { from: 'p1', to: 'r1', c: 'red' }, { from: 'p2', to: 'r2', c: 'grn' },
    ] })}
    ${box('tip', 'Lỡ attach mà muốn rời đi không giết gì: <b>Ctrl-P rồi Ctrl-Q</b> (chỉ khi container chạy với <code>-it</code>). Xem log thì dùng <code>docker logs -f</code>; cần dấu nhắc thì dùng <code>exec</code>.')}` },

  { t: 'Đo thật: tín hiệu gửi vào docker attach đi thẳng tới app', body: two(
    table(['Gửi tới <code>docker attach</code>', 'Container', 'Chuyện gì xảy ra'], [
      ['SIGINT (= Ctrl-C) · vòng lặp <code>sh</code>', '-Exited (130)', 'sh làm PID 1 nhận SIGINT và thoát: 128 + 2'],
      ['SIGINT (= Ctrl-C) · nginx', '-Exited (0)', 'nginx: <code>signal 2 (SIGINT) received, exiting</code>'],
      ['SIGTERM · vòng lặp <code>sh</code>', '!Vẫn Up', 'PID 1 không bắt SIGTERM ⇒ bị vứt; attach TREO, phải SIGKILL nó'],
      ['Ctrl-P Ctrl-Q (container có <code>-it</code>)', '+Vẫn Up', 'tách ra an toàn'],
    ], { sm: true }),
    term(['$ timeout -k 3 -s INT 2 docker attach ng', '2026/09/23 14:08:27 [notice] 1#1:', '! signal 2 (SIGINT) received, exiting', '$ docker ps -a --filter name=ng \\', '    --format \'{{.Names}} {{.Status}}\'', '! ng Exited (0) 1 second ago', '$ timeout -k 3 4 docker attach t', '! Killed            # SIGTERM không làm attach thoát', '$ docker ps -a --filter name=t --format …', '= t Up 7 seconds'], { title: 'output thật — máy Linux (timeout giả lập Ctrl-C)' }), 'l') },

  { t: '-i giữ stdin, -t cấp terminal — dùng sai là hỏng im lặng', body: two(
    table(['Cờ', 'Thử thật (máy Mac)', 'Kết quả'], [
      ['(không cờ)', '<code>echo \'{"b":2,"a":1}\' | docker run --rm ghcr.io/jqlang/jq -S .</code>', '-Không in gì, exit 0 — stdin bị đóng, hỏng CÂM'],
      ['<code>-i</code>', 'cùng lệnh, thêm <code>-i</code>', '+In JSON đã sắp khoá'],
      ['<code>-t</code>', '<code>docker run --rm -t alpine echo hi | cat -v</code>', '!<code>hi^M</code> — TTY đổi \\n thành \\r\\n, thêm mã màu'],
      ['<code>-it</code>', 'trong script / CI (stdin không phải terminal)', '-<code>cannot attach stdin to a TTY-enabled container because stdin is not a terminal</code>'],
    ], { sm: true }),
    `${term(['$ docker run --rm alpine sh -c \\', '    \'[ -t 1 ] && echo TTY || echo KHONG\'', 'KHONG', '$ docker run --rm -t alpine sh -c \\', '    \'[ -t 1 ] && echo TTY || echo KHONG\'', '+ TTY'], { title: 'app tự dò: có TTY không?' })}
    ${box('good', '<b>Người gõ:</b> <code>-it</code>. <b>Ống dẫn, script, CI:</b> chỉ <code>-i</code> (hoặc không cờ nếu không đọc stdin).')}`, 'l') },

  { t: 'Ảnh không có shell? Cho một container phụ ngồi cạnh', body: two(
    `${term(['$ docker run -d --name api -p 18023:80 traefik/whoami', '$ docker exec api sh', '! OCI runtime exec failed: … exec: "sh": executable file', '! not found in $PATH', '$ docker run --rm --pid=container:api --net=container:api \\', '    nicolaka/netshoot \\', '    sh -c \'ps -o pid,args; ls /proc/1/root; ss -tlnp\'', 'PID   COMMAND', '+     1 /whoami', '   45 sh -c ps -o pid,args; ls /proc/1/root; ss -tlnp', '   50 ps -o pid,args', '+ dev  etc  proc  sys  usr  whoami     # (6 dòng, gộp lại)', 'LISTEN 0  4096  *:80  *:*  users:(("whoami",pid=1,fd=4))'], { title: 'output thật — máy Mac', fs: 14 })}`,
    `${diagram({ w: 470, h: 330, nodes: [
      { id: 'a', x: 10, y: 10, w: 210, h: 84, t: 'api', d: 'chỉ có /whoami\n4.73 MB, không sh', c: 'dk' },
      { id: 'n', x: 250, y: 10, w: 210, h: 84, t: 'netshoot', d: 'ps · ss · curl · dig\ntcpdump', c: 'tea' },
      { id: 'ns', x: 60, y: 200, w: 350, h: 110, t: 'CHUNG namespace PID + mạng', d: '/proc/1/root = cây file của api\nlocalhost = localhost của api', c: 'amb' },
    ], edges: [{ from: 'a', to: 'ns', c: 'dk' }, { from: 'n', to: 'ns', c: 'tea', t: '--pid/--net=container:api' }] })}`, 'l') },

  { t: 'Bốn đường vào một container — chọn theo cái bạn có', body: `
    ${cards([
      { ic: '🚪', t: 'docker exec', d: 'Có shell (<code>sh</code>, không phải lúc nào cũng có <code>bash</code>). <code>-u root</code> khi ảnh chạy user thường.', c: 'grn' },
      { ic: '🧰', t: 'Container phụ', d: '<code>--pid=container:X --net=container:X nicolaka/netshoot</code> — ảnh nào cũng được, không cài gì vào X.', c: 'tea' },
      { ic: '🔎', t: 'docker debug', d: 'Của Docker Desktop: gắn hộp công cụ vào container bất kỳ. Chạy được trên máy Mac của khoá (4.91).', c: 'dk' },
      { ic: '📤', t: 'Lôi bằng chứng ra', d: '<code>docker cp X:/đg -</code> + <code>inspect</code> — chạy được cả khi X đã CHẾT.', c: 'amb' },
    ], 4)}
    ${term(['# máy Linux, KHÔNG sudo: nsenter từ một container phụ đặc quyền, chỉ vào namespace MẠNG', '$ docker run --rm --privileged --pid=host alpine nsenter -t $PID -n netstat -tln', 'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN', '$ docker run --rm --privileged --pid=host alpine nsenter -t $PID -n ip -4 -o addr', '2: eth0    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0'], { title: 'output thật — máy Linux, Docker 29.6' })}
    ${box('bad', '<code>docker exec … apk add curl</code> để <b>vá</b> là vá vào tầng ghi — mất ở lần deploy sau. exec để TÌM lỗi; sửa trong Dockerfile/compose.')}` },

  /* ───────────── 2.4 ───────────── */
  { t: 'Bốn nguồn biến môi trường — nguồn sau đè nguồn trước', body: two(
    layers({ w: 520, cap: 'đọc từ DƯỚI lên — tầng trên thắng', rows: [
      { t: '<b>ENV</b> trong ảnh — <code>PATH</code>, <code>NGINX_VERSION</code>', k: '1', c: 'dim' },
      { t: '<code>--env-file a.env --env-file b.env</code> — file sau đè file trước', k: '2', c: 'tea' },
      { t: '<code>-e MODE=flag</code> — thắng file, bất kể viết trước hay sau', k: '3', c: 'dk' },
      { t: 'script entrypoint — chạy cuối, bên trong container', k: '4', c: 'amb' },
    ] }),
    `${term(['$ docker run --rm --env-file a.env --env-file b.env \\', '    -e MODE=flag alpine sh -c \'echo "MODE=$MODE SHARED=$SHARED"\'', '= MODE=flag SHARED=from-second-file', '$ docker run --rm -e MODE=flag --env-file a.env \\', '    alpine sh -c \'echo $MODE\'', '= flag', '$ unset NAME', '$ docker run --rm -e NAME alpine \\', '    sh -c \'echo "[${NAME-KHONG_CO}]"\'', '! [KHONG_CO]'], { title: 'output thật — máy Mac', fs: 14 })}
    ${box('warn', '<code>-e NAME</code> (không dấu =) chép biến từ shell của bạn. Shell không có ⇒ container <b>không có luôn</b>, không phải chuỗi rỗng — CI hay dính.')}`, 'r') },

  { t: '--env-file không phải shell: giữ NGUYÊN VĂN mọi thứ', body: two(
    yaml([
      ['PASSWORD="p@ss word"', 'nhận: "p@ss word" KÈM nháy'],
      ['GREETING=hello world', 'nhận: hello world (ổn)'],
      ['URL=postgres://${USER}@db/app', 'KHÔNG khai triển ${USER}'],
      ['TRAIL=abc ', 'nhận: "abc " — dấu cách cuối'],
      ['X=1 # not a comment', 'nhận: "1 # not a comment"'],
      ['# comment line', 'chú thích: chỉ khi đứng riêng dòng'],
    ], { fs: 16 }),
    `${term(['$ docker run --rm --env-file q.env alpine \\', '    sh -c \'… in từng biến trong [ ] …\'', 'PASSWORD=["p@ss word"]', 'GREETING=[hello world]', 'URL=[postgres://${USER}@db/app]', 'TRAIL=[abc ]', 'X=[1 # not a comment]'], { title: 'output thật — máy Mac' })}
    ${box('tip', 'Mật khẩu “đúng mà đăng nhập hỏng” trong nhóm SWP391? Kiểm bằng <code>docker exec c env</code> — thấy dấu nháy là thủ phạm.')}`, 'l') },

  { t: 'Biến môi trường KHÔNG bí mật: ai gõ docker cũng đọc được', body: two(
    term(['$ docker run -d --name db \\', '    -e POSTGRES_PASSWORD=hunter2 postgres:16-alpine', '$ docker inspect db --format \'{{json .Config.Env}}\' \\', '    | tr \',\' \'\\n\' | grep -i pass', '! ["POSTGRES_PASSWORD=hunter2"', '$ docker exec db env | grep -i pass', '! POSTGRES_PASSWORD=hunter2', '# quy ước _FILE: bí mật thành một ĐƯỜNG DẪN', '$ docker run -d --name db \\', '    -v "$PWD/pgpass:/run/secrets/pgpass:ro" \\', '    -e POSTGRES_PASSWORD_FILE=/run/secrets/pgpass \\', '    postgres:16-alpine', '$ docker inspect db … | grep -i pass       # lệnh như trên', '= ["POSTGRES_PASSWORD_FILE=/run/secrets/pgpass"'], { title: 'output thật — máy Mac', fs: 14 }),
    cards([
      { ic: '🔍', t: 'docker inspect', d: 'In MỌI biến. Nhóm docker ≈ root.', c: 'red' },
      { ic: '🧬', t: 'Tiến trình con', d: 'Thừa kế cả môi trường; báo cáo lỗi hay đổ nó ra SaaS.', c: 'amb' },
      { ic: '📄', t: '_FILE + mount :ro', d: '<code>inspect</code> chỉ còn thấy đường dẫn.', c: 'grn' },
    ], 1), 'l') },

  { t: 'root trong container ghi file ⇒ trên Linux file thuộc root thật', body: two(
    term(['$ docker run --rm -v "$PWD/out:/out" alpine sh -c \\', '    \'echo hi > /out/root-made.txt; mkdir -p /out/build; \\', '     echo x > /out/build/app.js\'', '$ docker run --rm -u "$(id -u):$(id -g)" \\', '    -v "$PWD/out:/out" alpine sh -c \'echo hi > /out/me-made.txt\'', '$ ls -l out/', '! drwxr-xr-x. 2 root      root      60 build', '= -rw-r--r--. 1 Cuong03dx Cuong03dx  3 me-made.txt', '! -rw-r--r--. 1 root      root       3 root-made.txt', '$ echo more >> out/root-made.txt', '! bash: out/root-made.txt: Permission denied', '$ rm -rf out/build', "! rm: cannot remove 'out/build/app.js': Permission denied"], { title: 'output thật — máy Linux', fs: 14 }),
    `${table(['Máy', 'File do root trong container tạo'], [
      ['Linux / VPS', '-Thuộc <code>root</code> — không sửa được, thư mục con không xoá được'],
      ['Mac (Docker Desktop)', '+Hiện là <code>admin</code> — Desktop dịch chủ sở hữu, nên bạn KHÔNG thấy lỗi'],
      ['Windows + WSL2', '!Như Linux nếu dự án nằm trong WSL'],
    ], { sm: true })}
    ${box('good', '<code>-u "$(id -u):$(id -g)"</code> khi dev. Lâu dài: <code>USER</code> trong Dockerfile (Chương 6). Đã lỡ: xoá bằng chính một container: <code>docker run --rm -v "$PWD/out:/out" alpine rm -rf /out/build</code>.')}`, 'l') },

  { t: 'Container chạy giờ UTC — TZ chỉ ăn khi ảnh có tzdata', body: two(
    term(['$ date', 'Wed Sep 23 21:16:16 +07 2026', '$ docker run --rm alpine date', 'Wed Sep 23 14:16:16 UTC 2026', '$ docker run --rm -e TZ=Asia/Ho_Chi_Minh alpine date', '! Wed Sep 23 14:16:17 UTC 2026   # không tzdata', '$ docker exec web2 date     # nginx + TZ', '= Wed Sep 23 21:16:16 +07 2026', '$ docker run --rm -v /etc/localtime:/etc/localtime:ro \\', '    alpine date', '= Wed Sep 23 21:16:17 +07 2026'], { title: 'output thật — máy Mac', fs: 14 }),
    `${table(['<code>-e TZ=Asia/Ho_Chi_Minh</code> với ảnh…', 'date in ra'], [
      ['<code>nginx:1.27-alpine</code> · <code>postgres:16-alpine</code> · <code>python:3.12-alpine</code> · <code>node:22-slim</code>', '+21:23 +07 — có tzdata'],
      ['<code>alpine</code> · <code>node:22-alpine</code>', '-vẫn 14:23 UTC — lờ đi, KHÔNG báo lỗi'],
      ['<code>ubuntu:24.04</code>', '-in 14:23 “Asia” — hiểu sai tên múi giờ'],
    ], { sm: true })}
    <p style="font-size:15px;color:${D.mu}">Thiếu tzdata: <code>apk add tzdata</code> / <code>apt-get install tzdata</code> trong Dockerfile, hoặc gắn <code>/etc/localtime</code>.</p>
    ${box('info', 'Đồng hồ vẫn là MỘT (Bài 1.1) — chỉ cách hiển thị đổi. CSDL và log nên để UTC; đổi múi giờ lúc hiển thị.')}`) },
  /* ───────────── 2.5 ───────────── */
  { t: 'Không có --memory = container được lấy cả cái máy', body: two(
    `${term(['$ docker run -d --name unbounded nginx:1.27-alpine', '$ docker run -d --name bounded --memory 256m \\', '    --memory-reservation 128m nginx:1.27-alpine', '$ docker stats --no-stream unbounded bounded --format \'{{.Name}} {{.MemUsage}}\'', '! unbounded 12.91MiB / 7.748GiB', '= bounded 9.621MiB / 256MiB'], { title: 'output thật — máy Mac' })}
    ${box('warn', 'VPS 6 GB chạy Postgres + API + <code>next build</code>: một tiến trình rò bộ nhớ không trần là nhân OOM có thể giết nhầm… Postgres.')}`,
    table(['Cờ', 'Nghĩa', 'Khi nào'], [
      ['<code>--memory 256m</code>', 'Trần CỨNG ⇒ vượt là exit 137', 'Mọi dịch vụ'],
      ['<code>--memory-swap 256m</code>', 'Tổng RAM + swap; BẰNG --memory = tắt swap', 'Dịch vụ cần nhanh, thà chết còn hơn ì'],
      ['<code>--memory-reservation</code>', 'Mức MỀM, chỉ ép khi máy thiếu RAM', 'Đặt ≈ mức dùng thường'],
      ['<code>--oom-kill-disable</code>', 'Treo thay vì chết', '-Gần như KHÔNG BAO GIỜ'],
    ], { sm: true }), 'l') },

  { t: 'Thử chạm trần: phải cấp phát thật và tắt swap mới thấy OOM', body: two(
    term(['$ docker run --name t1 --memory 64m alpine sh -c \\', '    \'head -c 200m /dev/zero | tail -c 1 > /dev/null\'', '$ echo "exit=$?"', '= exit=0            # tail -c 1 chỉ giữ 1 byte cuối', '$ docker run --name t2 --memory 128m --memory-swap 128m \\', '    alpine dd if=/dev/zero of=/dev/null bs=200M count=1', '$ echo "exit=$?"', '! exit=137', '$ docker inspect t2 --format \'{{.State.OOMKilled}}\'', '! true', '# máy Linux, không sudo: nhật ký nhân qua container đặc quyền', '$ docker run --rm --privileged alpine dmesg | grep -i killed', '+ Memory cgroup out of memory: Killed process 393902 (dd)', '+ total-vm:206436kB, anon-rss:130472kB …'], { title: 'output thật — Mac (t1, t2) và Linux (dmesg)', fs: 14 }),
    `${kpis([{ v: '137', l: '= 128 + 9 (SIGKILL)', c: 'red' }, { v: 'true', l: '.State.OOMKilled', c: 'amb' }])}
    ${box('info', '137 một mình là mập mờ: <code>docker kill</code>, <code>stop</code> quá hạn hay OOM đều ra 137. <code>OOMKilled</code> mới phân xử.')}`, 'l2') },

  { t: '--cpus là hạn ngạch cứng — và app tự đo lại chính nó', body: two(
    `${bars([
      { l: '--cpus 0.5', sub: 'vòng lặp vô tận', v: 49.77, txt: '49.77%', c: 'amb' },
      { l: 'không giới hạn', sub: 'vòng lặp vô tận', v: 99.89, txt: '99.89%', c: 'red' },
    ], { lw: 200, max: 100 })}
    <p style="font-size:15px;color:${D.mu}">docker stats sau 4 s, máy Mac (một luồng = tối đa 100%).</p>
    ${table(['Cờ', 'Là gì'], [
      ['<code>--cpus 1.5</code>', 'Hạn ngạch: ≤ 1,5 nhân, cả khi máy rảnh'],
      ['<code>--cpu-shares 512</code>', 'Trọng số, CHỈ có tác dụng khi tranh chấp'],
      ['<code>--cpuset-cpus 0,1</code>', 'Ghim vào nhân cụ thể'],
      ['<code>--pids-limit 20</code>', '<code>sh: can\'t fork: Resource temporarily unavailable</code>'],
    ], { sm: true })}`,
    `${table(['Đo trong container (máy Mac, 10 CPU)', 'Không cờ', 'Có cờ'], [
      ['Node <code>os.cpus().length</code>', '10', '!10 (<code>--cpus 1</code>)'],
      ['Node <code>os.availableParallelism()</code>', '10', '+1 (<code>--cpus 1</code>)'],
      ['Node heap tối đa', '2096 MB', '+259 MB (<code>--memory 256m</code>)'],
      ['Python <code>os.cpu_count()</code>', '10', '!10 (<code>--cpus 1</code>)'],
    ], { sm: true })}
    ${box('tip', 'Tự chia worker theo <code>os.cpus()</code> ⇒ 10 worker giành nhau 1 nhân. Dùng <code>availableParallelism()</code>.')}`, 'l') },

  { t: 'restart lùi dần 0,1 → 0,2 → 0,4 s — và chỉ nhìn mã thoát', body: `
    ${backoff()}
    ${table(['Chính sách', 'Khởi động lại khi…', 'Sau khi bạn docker stop', 'Dùng cho'], [
      ['<code>no</code> (mặc định)', 'không bao giờ', '—', 'Việc chạy một lần, migration'],
      ['<code>on-failure[:N]</code>', 'thoát KHÁC 0, tối đa N lần', 'nằm yên', 'Job nên thử lại vài lần'],
      ['<code>always</code>', 'mọi lần thoát', '-dockerd khởi động lại là nó LÊN LẠI', 'Hiếm khi là lựa chọn đúng'],
      ['<code>unless-stopped</code>', 'mọi lần thoát', '+nằm yên, kể cả qua khởi động lại máy', 'Dịch vụ trên VPS'],
    ], { sm: true })}` },

  { t: 'Healthcheck chỉ BÁO — unhealthy mà vẫn Up', body: `
    ${healthLine()}
    ${two(
    term(['$ docker ps --filter name=hc --format \'{{.Names}} {{.Status}}\'', '! hc Up 37 seconds (unhealthy)', '$ docker inspect hc --format \\', '    \'{{.State.Health.Status}} · restarts={{.RestartCount}}\'', '! unhealthy · restarts=0', '$ docker inspect hc --format \\', '    \'{{(index .State.Health.Log 0).Output}}\'', 'wget: server returned error: HTTP/1.1 403 Forbidden'], { title: 'output thật — máy Mac', fs: 14 }),
    list3(), 'l')}` },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 2', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['<code>exec: "-it": executable file not found</code>', 'Cờ đặt SAU tên ảnh', 'Cờ luôn TRƯỚC tên ảnh'],
    ['CSDL bị quét từ internet dù ufw chặn', '<code>-p 5432:5432</code> mở mọi card', '<code>-p 127.0.0.1:5432:5432</code>'],
    ['<code>docker logs</code> trống', 'App ghi file, hoặc Python đệm stdout', 'Log ra stdout; <code>PYTHONUNBUFFERED=1</code>'],
    ['Script pipe JSON vào container không ra gì', 'Thiếu <code>-i</code> — stdin đóng, lỗi CÂM', '<code>docker run -i</code>'],
    ['Ctrl-C trong attach làm sập web', 'attach nối vào PID 1', '<code>logs -f</code> / <code>exec</code>; thoát: Ctrl-P Ctrl-Q'],
    ['Mật khẩu “đúng” mà đăng nhập hỏng', '<code>--env-file</code> giữ nguyên dấu nháy', 'Viết giá trị trần; kiểm <code>docker exec c env</code>'],
    ['File <code>build/</code> của root, không xoá được', 'root trong container = root ngoài (Linux)', '<code>-u "$(id -u):$(id -g)"</code>'],
    ['Container unhealthy mãi mà không ai sửa', 'Docker trần không hành động theo health', 'Compose <code>service_healthy</code>, script deploy'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 2', body: table(['Muốn…', 'Gõ'], [
    ['Chạy dịch vụ chuẩn', '<code>docker run -d --name web --restart unless-stopped -p 127.0.0.1:8080:80 --memory 256m nginx:1.27-alpine</code>'],
    ['Lệnh chạy một lần', '<code>docker run --rm -it alpine sh</code>'],
    ['Xem ENTRYPOINT/CMD của ảnh', '<code>docker image inspect ẢNH --format \'{{.Config.Entrypoint}} {{.Config.Cmd}}\'</code>'],
    ['Log khoanh vùng', '<code>docker logs --since 10m --tail 100 -f web</code>'],
    ['Phân loại mọi container', '<code>docker inspect $(docker ps -aq) --format \'{{.Name}} {{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}\'</code>'],
    ['Tài nguyên · tiến trình · cổng', '<code>docker stats --no-stream</code> · <code>docker top web</code> · <code>docker port web</code>'],
    ['Vào trong', '<code>docker exec -it web sh</code> · <code>-u root</code>'],
    ['Ảnh không có shell', '<code>docker run --rm -it --pid=container:web --net=container:web nicolaka/netshoot</code>'],
    ['Pipe dữ liệu vào', '<code>cat data.json | docker run --rm -i ghcr.io/jqlang/jq .</code>'],
    ['File ghi ra không thuộc root', '<code>-u "$(id -u):$(id -g)"</code>'],
    ['Có bị OOM không', '<code>docker inspect -f \'{{.State.OOMKilled}}\' web</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 2 (40 phút): dựng — soi — vào — giới hạn', body: `
    ${steps([
      ['Chạy nginx phục vụ thư mục <code>~/thu-docker/web</code>, chỉ mở ra localhost, có tên, restart, trần RAM', 'đúng câu lệnh ở slide 3 — rồi <code>curl</code> và <code>docker port</code>'],
      ['Gây một lỗi 404 rồi tìm nó bằng <code>docker logs</code>, tách stdout khỏi stderr', '<code>2&gt;/dev/null</code> và <code>2&gt;&amp;1 &gt;/dev/null</code>'],
      ['Chạy <code>traefik/whoami</code> (không shell), dùng container phụ tìm cổng nó nghe', '<code>--pid=container:</code> + <code>ss -tlnp</code>'],
      ['Đưa mật khẩu qua <code>--env-file</code> có dấu nháy, thấy nó sai, sửa bằng <code>_FILE</code>', 'kiểm bằng <code>docker exec … env</code> và <code>inspect</code>'],
      ['Gây OOM có chủ đích; thêm healthcheck rồi phá trang chủ', '<code>OOMKilled=true</code>; <code>(unhealthy)</code> mà <code>restarts=0</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> giải thích được từng kết quả bằng lời, và <code>docker ps -a --filter name=thu-</code> trống sau khi dọn.')}` },
]).map((x) => x);

/** danh sách "ai tiêu thụ healthcheck" (dùng ở slide 29) — hàm để S() gọi được trước khi khai báo mảng */
function list3() {
  return box('info', '<b>Ai tiêu thụ health?</b><br>🧩 Compose <code>depends_on: condition: service_healthy</code> — API chờ DB khoẻ (Ch.9)<br>🚀 Script deploy: chờ <code>healthy</code> rồi mới chuyển lưu lượng (Ch.11)<br>☸️ Swarm / Kubernetes mới tự thay container không khoẻ');
}
