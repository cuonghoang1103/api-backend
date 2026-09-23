/**
 * Docker · Deck dk-12 — Chương 12: Chẩn đoán container (sách công thức + kết khoá).
 *
 * MỌI output terminal trên slide là output THẬT, chạy 24/09/2026 (giờ máy +07, container UTC):
 *   • "máy Mac"   = Mac M1, Docker Desktop / Engine 29.8.0 arm64, Compose v5.5.1, buildx v0.37.0
 *   • "máy Linux" = Fedora, Docker Engine 29.6.2 amd64 (ssh linux-nha)
 * Tên đối tượng trong output mang tiền tố dk12- (luật an toàn của khoá); cổng 18120–18129, chỉ 127.0.0.1.
 *
 * Hình tự vẽ (SVG nội tuyến, dùng sv/R/T/A của _dk-chung): decide() — cây quyết định
 * "triệu chứng → câu hỏi → nhánh → lệnh"; backoff() — dòng thời gian vòng lặp restart; courseMap() — bản đồ toàn khoá.
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, mindmap, layers, term as dkTerm, diagram, yaml, bars, D, sv, R, T, A } from './_dk-chung.mjs';

const term = (lines, o = {}) => dkTerm(lines, { dir: '~', fs: 15, ...o });
const TCSS = '<style>.g-term pre{font-size:15px;line-height:1.45}</style>';

export const deck = { key: 'dk-12', code: 'DOCKER · CHƯƠNG 12', title: 'Chẩn đoán container', sub: 'Docker · Chương 12' };

const MONO = 'SF Mono,Menlo,monospace';

/**
 * Cây quyết định: một hộp gốc bên trái → mỗi nhánh một hàng: [từ khoá / triệu chứng] → nghĩa + lệnh hỏi tiếp.
 * rows: [{ k, c, m, cmd }] — k: chữ trong hộp nhánh (mono), m: kết luận, cmd: lệnh kế tiếp (mono).
 */
const decide = ({ root, rootSub = '', q = '', rows, w = 1160, rw = 220, kx = 300, kw = 330, rh = 54, gap = 8, top = 0 }) => {
  const H = top + rows.length * (rh + gap) - gap;
  const cy = top + H / 2 - top / 2;
  const tx = kx + kw + 34;
  let s = R(0, cy - 70, rw, 140, { c: 'dk', fill: 'rgba(36,150,237,.10)' }) +
    root.split('\n').map((ln, i) => T(rw / 2, cy - 28 + i * 24, ln, { fs: 18, a: 'middle', b: true })).join('') +
    rootSub.split('\n').filter(Boolean).map((ln, i) => T(rw / 2, cy + 24 + i * 20, ln, { fs: 14, a: 'middle', c: 'mu' })).join('');
  if (q) s += T(rw + 8, top - 6 > 0 ? top - 6 : 14, q, { fs: 14, c: 'amb', b: true });
  rows.forEach((r, i) => {
    const y = top + i * (rh + gap), my = y + rh / 2, c = r.c || 'dk';
    const sy = cy - 52 + (rows.length > 1 ? (104 * i) / (rows.length - 1) : 52);
    s += `<path d="M${rw} ${sy} C ${rw + 40} ${sy}, ${kx - 40} ${my}, ${kx - 4} ${my}" stroke="${D[c] || c}" stroke-width="2.2" fill="none" opacity=".75" marker-end="url(#m-${D[c] ? c : 'dk'})"/>`;
    s += R(kx, y, kw, rh, { c, fill: '#0f182a', r: 9 }) + T(kx + 14, my + 6, r.k, { fs: r.kfs || 15, mono: true, b: true });
    s += A(kx + kw + 4, my, tx - 6, my, { c: 'mu', sw: 2 });
    s += T(tx, y + 22, r.m, { fs: 15.5 }) + T(tx, y + 44, r.cmd, { fs: 14, mono: true, c: 'tea' });
  });
  return sv(w, H + 4, s);
};

/* Slide 3 — bốn tầng có thể hỏng */
const fourLayers = () => layers({ w: 640, cap: 'đọc từ DƯỚI lên: tầng dưới hỏng thì tầng trên không bao giờ chạy tới', rows: [
  { k: 'TẦNG 1', t: '<b>Ảnh</b> — <code>not found</code> · <code>denied</code> · <code>exec format error</code>', c: 'tea' },
  { k: 'TẦNG 2', t: '<b>Cấu hình container</b> — lệnh · env · mount · cổng · tên', c: 'blu' },
  { k: 'TẦNG 3', t: '<b>Tiến trình của bạn</b> — stack trace · exit 1 · vòng lặp', c: 'amb' },
  { k: 'TẦNG 4', t: '<b>Môi trường</b> — mạng · DNS · RAM · đĩa · container khác', c: 'red' },
] });

/* Slide 15 — backoff của vòng lặp restart (số đo thật từ docker logs -t, máy Mac) */
const backoff = () => {
  const pts = [0, 1, 1, 1, 2, 4, 7.3, 13.7, 26.6];
  const X = (t) => 40 + t * 38;
  let s = `<line x1="${X(0)}" y1="90" x2="${X(28.5)}" y2="90" stroke="${D.bd}" stroke-width="3"/>`;
  for (let t = 0; t <= 24; t += 4) s += `<line x1="${X(t)}" y1="84" x2="${X(t)}" y2="96" stroke="${D.dim}" stroke-width="2"/>` + T(X(t), 122, `${t}s`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  pts.forEach((t, i) => { s += `<circle cx="${X(t)}" cy="90" r="${i > 5 ? 11 : 8}" fill="${D.red}" opacity="${i > 5 ? 1 : 0.8}"/>`; });
  s += T(X(0), 50, '6 lần chết đầu: dồn trong ~4 s', { fs: 15, c: 'red' });
  s += T(X(7.3), 50, '+3,3 s', { fs: 15, a: 'middle', c: 'amb', b: true, mono: true });
  s += T(X(13.7), 50, '+6,5 s', { fs: 15, a: 'middle', c: 'amb', b: true, mono: true });
  s += T(X(26.6), 50, '+12,9 s', { fs: 15, a: 'middle', c: 'amb', b: true, mono: true });
  s += T(X(0), 150, 'Mỗi lần chết, Docker chờ GẤP ĐÔI rồi mới khởi động lại. Lần thứ 19: "Restarting (1) 59 seconds ago".', { fs: 15.5, c: 'mu' });
  return sv(1160, 158, s);
};

/* Slide 27 — bản đồ toàn khoá: 13 phần */
const courseMap = () => {
  const P = [
    ['Mục 0', 'Docker giải quyết gì', 'môi trường lệch · cài đặt', 'dim'],
    ['Ch 1', 'Mô hình tư duy', 'tiến trình + namespace + cgroup', 'dk'],
    ['Ch 2', 'Chạy container', 'run · ps · logs · exec', 'dk'],
    ['Ch 3', 'Image &amp; registry', 'tag trôi, digest là sự thật', 'dk'],
    ['Ch 4', 'Dockerfile', 'từng chỉ thị · ENTRYPOINT/CMD', 'tea'],
    ['Ch 5', 'Tầng &amp; cache', 'ít đổi để dưới', 'tea'],
    ['Ch 6', 'Ảnh nhỏ, an toàn', 'multi-stage · non-root', 'tea'],
    ['Ch 7', 'Dữ liệu', 'volume · bind · tmpfs · backup', 'vio'],
    ['Ch 8', 'Mạng', 'tên dịch vụ · cổng · localhost', 'vio'],
    ['Ch 9', 'Compose', 'một file mô tả cả stack', 'grn'],
    ['Ch 10', 'Compose đời thật', 'healthcheck · migrate · proxy', 'grn'],
    ['Ch 11', 'Production', 'hạn mức · log · deploy · rollback', 'amb'],
    ['Ch 12', 'Chẩn đoán', '4 tầng · mã thoát · sách công thức', 'red'],
  ];
  const cw = 276, ch = 92, gx = 18, gy = 16;
  let s = '';
  P.forEach(([n, t, d, c], i) => {
    const col = i === 0 ? 0 : (i - 1) % 4, row = i === 0 ? 0 : 1 + Math.floor((i - 1) / 4);
    const x = i === 0 ? 0 : col * (cw + gx), y = row * (ch + gy);
    if (i === 0) {
      s += R(0, 0, 4 * cw + 3 * gx, ch - 30, { c, fill: '#0f182a', r: 10 }) + T(16, 38, `${n} · ${t.replace('&amp;', '&')}`, { fs: 18, b: true }) + T(4 * cw + 3 * gx - 16, 38, d, { fs: 15, c: 'mu', a: 'end' });
      return;
    }
    const yy = y - 30;
    s += R(x, yy, cw, ch, { c, fill: '#0f182a', r: 10 }) +
      T(x + 14, yy + 30, n, { fs: 14, c, b: true, mono: true }) + T(x + 74, yy + 30, t.replace('&amp;', '&'), { fs: 17, b: true }) +
      T(x + 14, yy + 62, d, { fs: 14.5, c: 'mu' });
  });
  const hy = 4 * (ch + gy) - 30 + 6;
  s += T(0, hy + 8, 'ẢNH (1, 3–6)  →  CONTAINER (1, 2, 7, 8)  →  STACK (9, 10)  →  VẬN HÀNH (11)  →  KHI HỎNG (12)', { fs: 15, c: 'tea', b: true });
  return sv(1160, hy + 16, s);
};

export const slides = S([
  cover({ t: 'Chương 12 — Chẩn đoán container', sub: 'Một phương pháp · không khởi động được · khởi động rồi chết · build hỏng &amp; chỉ hỏng trên CI · giờ bạn biết những gì', chap: 'CHƯƠNG 12' }),

  { t: 'Bản đồ chương: gọi tên TẦNG hỏng trước, rồi mới tra công thức', body: mindmap('Chẩn đoán', 'tầng nào hỏng? ⇒ mở đúng trang', [
    { t: '12.1 Phương pháp', d: '4 tầng · 3 lệnh đầu · bảng mã thoát · soi khi không có shell', c: 'dk' },
    { t: '12.2 Không khởi động', d: 'Created, logs rỗng: 127/126/255, cổng, mount, env', c: 'tea' },
    { t: '12.3 Lên rồi chết', d: 'Restarting, 0 ngay, 137 OOM, unhealthy', c: 'amb' },
    { t: '12.4 Build hỏng', d: 'đọc BuildKit, COPY/ngữ cảnh, cache, hoa-thường, xanh mà chết', c: 'red' },
    { t: '12.5 Giờ bạn biết', d: 'bản đồ 13 phần · 12 luật · sự cố thật → phép kiểm', c: 'vio' },
    { t: '12.6 Kiểm tra', d: '10 ca hỏng thật: tầng nào, lệnh nào', c: 'grn' },
  ]) },

  /* ───────────── 12.1 ───────────── */
  { t: 'Bốn tầng có thể hỏng — gọi tên tầng TRƯỚC khi sửa', body: two(
    fourLayers(),
    `${cards([
      { ic: '🙊', t: 'Mã của bạn CHƯA chạy', d: 'Tầng 1–2. <code>docker logs</code> rỗng; lỗi nằm ở stderr của lệnh <code>docker</code>. STATUS: <code>Created</code>.', c: 'blu' },
      { ic: '🗣️', t: 'Mã của bạn ĐÃ chạy', d: 'Tầng 3–4. Log có lời: đọc dòng lỗi ĐẦU TIÊN. STATUS: <code>Exited (n)</code>, <code>Restarting</code>, <code>unhealthy</code>.', c: 'amb' },
    ], 1)}
    ${box('tip', 'Gọi đúng tên tầng là loại được ~3/4 khả năng mà chưa chạy công cụ nào.')}`, 'l') },

  { t: 'Ba lệnh đầu tiên trả lời “tầng nào” trong 5 giây', body: `
    ${term(['$ docker compose ps -a --format \'table {{.Service}}\\t{{.Status}}\'', 'SERVICE   STATUS', '! api       Restarting (1) 1 second ago', '$ docker inspect -f \'exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}\' dk12-blog-api-1', '+ exit=1 oom=false restarts=7', '$ docker compose logs --timestamps --tail 4 api', 'api-1  | 2026-09-23T19:27:33.111308421Z 2026-09-23T19:27:33.109Z boot: connecting to cache:6379', '! api-1  | 2026-09-23T19:27:33.121498379Z Error: ENOTFOUND getaddrinfo ENOTFOUND cache', 'api-1  | 2026-09-23T19:27:36.426613339Z 2026-09-23T19:27:36.424Z boot: connecting to cache:6379', '! api-1  | 2026-09-23T19:27:36.436421005Z Error: ENOTFOUND getaddrinfo ENOTFOUND cache'], { title: 'output thật — máy Mac, stack compose dk12-blog: api chạy khi cache chưa có' })}
    ${cards([
      { ic: '1', t: 'STATUS: Restarting (1)', d: 'Đang lặp: chết → chờ → lên lại. Mã của bạn CÓ chạy.', c: 'blu' },
      { ic: '2', t: 'exit=1, oom=false', d: 'App tự thoát báo lỗi — không bị nhân giết.', c: 'amb' },
      { ic: '3', t: 'ENOTFOUND cache', d: 'Tầng 3 đang BÁO lỗi của tầng 4: không phân giải được tên. Xem mạng/dịch vụ, đừng sửa code.', c: 'red' },
    ], 3)}` },

  { t: 'Bảng mã thoát: con số kể lại chuyện gì đã xảy ra', body: table(['Mã', 'Tự gây thật (máy Mac, Docker 29.8)', 'Nghĩa là', 'STATUS', 'Hỏi tiếp bằng'], [
    ['<code>0</code>', '<code>alpine true</code>', 'Thoát sạch — service mà 0 là tự dừng khi không nên', 'Exited (0)', '<code>inspect … .Config.Cmd</code>'],
    ['<code>1</code>', '<code>node -e \'throw …\'</code>', 'App tự báo lỗi', 'Exited (1)', '<code>docker logs</code>'],
    ['!<code>125</code>', '<code>--badflag</code> · cổng bận · tên trùng', 'Docker từ chối trước khi chạy', '— / Created', 'stderr của lệnh docker'],
    ['!<code>126</code>', '<code>alpine /etc/hosts</code>', 'Có file mà không exec được', 'Created', '<code>ls -l</code>, <code>COPY --chmod</code>'],
    ['!<code>127</code>', '<code>alpine nosuchcommand</code>', 'Không có lệnh đó TRONG ảnh', 'Created', '<code>command -v</code> trong ảnh'],
    ['<code>130</code>', '<code>--init sleep</code> + <code>kill -s INT</code>', 'SIGINT (Ctrl-C) = 128 + 2', 'Exited (130)', 'ai bấm Ctrl-C?'],
    ['-<code>137</code>', '<code>dd bs=200M</code>, trần 128m', 'SIGKILL vì OOM', 'Exited (137)', '<code>OOMKilled=true</code>'],
    ['-<code>137</code>', '<code>docker kill</code>', 'SIGKILL từ người / công cụ', 'Exited (137)', '<code>OOMKilled=false</code> → <code>events</code>'],
    ['-<code>139</code>', '<code>python ctypes.string_at(0)</code>', 'SIGSEGV = 128 + 11: đọc sai bộ nhớ', 'Exited (139)', 'thư viện native, libc'],
    ['<code>143</code>', '<code>docker stop</code> (có <code>--init</code>)', 'SIGTERM = 128 + 15, đã tuân', 'Exited (143)', 'ai đang dừng nó?'],
    ['!<code>255</code>', 'ảnh arm64 trên amd64 · shebang CRLF', 'exec hỏng SAU khi tạo (lỗi nằm trong logs)', 'Exited (255)', '<code>docker logs</code>'],
  ], { sm: true }) },

  { t: 'Cột STATUS là ngã ba đầu tiên của mọi ca hỏng', body: two(
    term(['$ docker ps -a --filter label=dkhoc=12 \\', '    --format \'table {{.Names}}\\t{{.Status}}\'', 'NAMES        STATUS', '! dk12-oom     Exited (137) 1 second ago', '! dk12-crash   Exited (1) 1 second ago', '+ dk12-typo    Created', 'dk12-goapi   Up About a minute', '+ dk12-hc      Up 10 minutes (unhealthy)', '! dk12-loop    Restarting (1) 59 seconds ago', '…', '$ docker logs dk12-typo 2>&1 | wc -l', '       0'], { title: 'output thật — máy Mac' }),
    decide({ w: 640, rw: 150, kx: 190, kw: 200, rh: 60, gap: 10, root: 'STATUS\nnói gì?', rootSub: 'docker ps -a', rows: [
      { k: 'Created', c: 'blu', m: 'chưa từng chạy', cmd: '→ 12.2' },
      { k: 'Exited (0)', c: 'tea', m: 'tự dừng / chạy nền', cmd: '→ 12.3' },
      { k: 'Exited (1…)', c: 'amb', m: 'app báo lỗi', cmd: 'docker logs' },
      { k: 'Exited (137)', c: 'red', m: 'bị giết', cmd: '.State.OOMKilled' },
      { k: 'Restarting', c: 'ora', m: 'vòng lặp', cmd: 'logs -t: lần đầu' },
      { k: 'Up (unhealthy)', c: 'vio', kfs: 14, m: 'bộ kiểm báo hỏng', cmd: '.State.Health' },
    ] }), 'l2') },

  { t: 'Không có shell vẫn soi được: cp, create, mượn namespace', body: two(
    term(['# dk12-goapi: ảnh distroless, KHÔNG có sh', '$ docker exec dk12-goapi sh', '! OCI runtime exec failed: exec failed: unable to start', '! container process: exec: "sh": executable file not', '! found in $PATH', '$ docker cp dk12-goapi:/tmp/last-start.json - | tar -xO', '= {"phase":"startup","listen":":8080"}', '$ docker run --rm --pid container:dk12-goapi \\', '    --network container:dk12-goapi nicolaka/netshoot \\', '    sh -c \'ps -o pid,user,args; ss -lntp | tail -1\'', 'PID   USER     COMMAND', '+     1 65532    /api', '   18 root     sh -c ps -o pid,user,args; ss -lntp …', 'LISTEN 0      4096               *:8080            *:*'], { title: 'output thật — máy Mac' }),
    cards([
      { ic: '🐚', t: '--entrypoint sh', d: 'Ảnh CÓ shell: <code>docker run --rm -it --entrypoint sh &lt;ảnh&gt;</code> — soi mà không chạy lệnh đang hỏng.', c: 'blu' },
      { ic: '📦', t: 'create + cp', d: '<code>cid=$(docker create &lt;ảnh&gt;)</code> → <code>docker cp $cid:/đường/dẫn -</code>. Không bao giờ chạy entrypoint.', c: 'tea' },
      { ic: '🔭', t: 'Mượn công cụ', d: '<code>--pid</code>/<code>--network container:&lt;tên&gt;</code> + netshoot: thấy tiến trình, cổng của container kia.', c: 'vio' },
    ], 1), 'l') },

  /* ───────────── 12.2 ───────────── */
  { t: 'Container không lên: đọc TỪ KHOÁ trong dòng lỗi rồi rẽ nhánh', body: decide({ root: 'Không lên', rootSub: 'lỗi in ngay khi run\nCreated · Exited (255)', rw: 200, kx: 250, kw: 380, rh: 52, gap: 9, rows: [
    { k: 'not found · denied · no such host', c: 'tea', kfs: 14, m: 'Ảnh: sai tag · chưa login · DNS của máy chủ', cmd: 'docker buildx imagetools inspect <ảnh>' },
    { k: 'executable file not found (127)', c: 'amb', kfs: 14, m: 'Lệnh không có trong ảnh — hoặc gõ sai', cmd: "docker run --rm --entrypoint sh <ảnh> -c 'command -v X'" },
    { k: 'permission denied (126)', c: 'ora', kfs: 14, m: 'Có file mà không exec được: thiếu +x, là thư mục', cmd: 'COPY --chmod=755 … ; git update-index --chmod=+x' },
    { k: 'exec format error (255)', c: 'red', kfs: 14, m: 'Sai kiến trúc: ảnh arm64 trên máy amd64', cmd: "docker image inspect -f '{{.Architecture}}' <ảnh>" },
    { k: 'no such file or directory (255)', c: 'red', kfs: 14, m: 'File CÓ mà vẫn báo: shebang CRLF, thiếu loader glibc', cmd: 'file entrypoint.sh ; ldd <binary>' },
    { k: 'port is already allocated', c: 'blu', kfs: 14, m: 'Cổng máy chủ đã có container khác / tiến trình khác giữ', cmd: 'docker ps --filter publish=18120 ; lsof -i :18120' },
    { k: 'Conflict … name … in use', c: 'vio', kfs: 14, m: 'Tên trùng một container Exited / Created cũ', cmd: 'docker ps -a --filter name=… ; docker rm' },
    { k: 'bind source … does not exist', c: 'grn', kfs: 14, m: 'Mount / biến env sai: compose cho xem bản cuối cùng', cmd: 'docker compose config' },
  ] }) },

  { t: '127 “không có lệnh” khác 126 “có mà không chạy được”', body: `
    ${term(['$ docker run --name dk12-c127 alpine:3.20 nosuchcommand; echo "exit=$?"', '! docker: Error response from daemon: failed to create task for container: … error during container init:', '!   exec: "nosuchcommand": executable file not found in $PATH', '+ exit=127', '$ docker run --name dk12-c126c alpine:3.20 /etc/hosts; echo "exit=$?"', '! docker: Error response from daemon: … error during container init: exec: "/etc/hosts": permission denied', '+ exit=126', '$ docker run --name dk12-c126b alpine:3.20 /etc; echo "exit=$?"', '! docker: … exec: "/etc": is a directory: permission denied', '+ exit=126', '$ docker ps -a --filter name=dk12-c12 --format "table {{.Names}}\\t{{.Status}}"; docker logs dk12-c127 | wc -l', 'NAMES        STATUS', 'dk12-c126b   Created', 'dk12-c126c   Created', 'dk12-c127    Created', '       0'], { title: 'output thật — máy Mac (dòng lỗi dài được cắt bằng …)' })}
    ${two(box('info', '<b>Created + logs rỗng</b>: runc từ chối lúc tạo. Đọc stderr, hoặc <code>inspect -f \'{{.State.Error}}\'</code>.'),
    box('warn', 'Bind-mount file thiếu +x từ <b>Mac</b>: exit <b>255</b>, Exited. Máy <b>Linux</b>: <b>126</b>, Created. Đọc chữ, đừng chỉ nhìn số.'))}` },

  { t: '“no such file or directory” trong khi file NẰM ĐÓ: shebang CRLF', body: two(
    term(['$ file entrypoint.sh', '! entrypoint.sh: POSIX shell script text executable, ASCII text, with CRLF line terminators', '$ docker build -q -t dk12-crlf:1 . && echo "build ✓"', '= build ✓', '$ docker run --name dk12-crlf dk12-crlf:1; echo "exit=$?"', '! exec /entrypoint.sh: no such file or directory', '+ exit=255', '$ docker run --rm --entrypoint sh dk12-crlf:1 -c \\', '    \'ls -l /entrypoint.sh; head -1 /entrypoint.sh | od -c | head -1\'', '-rwxr-xr-x    1 root     root            48 Sep 23 19:30 /entrypoint.sh', '+ 0000000   #   !   /   b   i   n   /   s   h  \\r  \\n', "$ sed -i '' $'s/\\r$//' entrypoint.sh && docker build -q -t dk12-crlf:2 .", '$ docker run --rm dk12-crlf:2', '= api starting'], { title: 'output thật — máy Mac' }),
    `${diagram({ w: 470, h: 250, nodes: [
      { id: 'k', x: 0, y: 0, w: 470, h: 70, t: '#!/bin/sh\\r', d: 'nhân đi tìm trình thông dịch tên "sh\\r"', c: 'red', mono: true },
      { id: 'e', x: 0, y: 150, w: 470, h: 70, t: 'ENOENT: no such file', d: 'nói về "sh\\r" — không phải file của bạn', c: 'amb' },
    ], edges: [{ from: 'k', to: 'e', c: 'red', t: 'không có /bin/sh\\r' }] })}
    ${box('good', 'Chặn tận gốc: <code>.gitattributes</code> với <code>*.sh text eol=lf</code> — bạn cùng nhóm dùng Windows sẽ không bao giờ đẩy CRLF lên nữa.')}`, 'l2') },

  { t: 'exec format error: ảnh arm64 từ Mac chạy trên máy amd64', body: `
    ${diagram({ w: 1160, h: 120, nodes: [
      { id: 'm', x: 0, y: 20, w: 250, h: 80, t: 'Mac M1 · arm64', d: 'docker build (không --platform)', c: 'blu' },
      { id: 'i', x: 320, y: 20, w: 250, h: 80, t: 'dk12-api:mac', d: 'linux/arm64 · build XANH', c: 'tea' },
      { id: 'v', x: 720, y: 20, w: 190, h: 80, t: 'Linux · amd64', d: 'docker run', c: 'dim' },
      { id: 'x', x: 970, y: 20, w: 190, h: 80, t: 'exit 255', d: 'exec format error', c: 'red' },
    ], edges: [{ from: 'm', to: 'i', c: 'blu' }, { from: 'i', to: 'v', c: 'tea', t: 'save | ssh load' }, { from: 'v', to: 'x', c: 'red' }] })}
    ${two(
    term(['$ docker save dk12-api:mac | ssh linux-nha docker load', '$ ssh linux-nha docker run --name dk12-arch dk12-api:mac', '+ WARNING: The requested image\'s platform (linux/arm64) does not', '+ match the detected host platform (linux/amd64/v3) …', '! exec /usr/local/bin/docker-entrypoint.sh: exec format error', '$ ssh linux-nha docker image inspect dk12-api:mac -f \'{{.Os}}/{{.Architecture}}\'', 'linux/arm64'], { title: 'output thật — build trên Mac, chạy trên máy Linux' }),
    term(['$ docker build -q --platform linux/amd64 \\', '    -t dk12-api:amd64 .', '$ docker save dk12-api:amd64 | \\', '    ssh linux-nha docker load', '$ ssh linux-nha docker run --rm dk12-api:amd64', '= x64', '# Mac vẫn chạy được ảnh amd64 (giả lập):', '$ docker run --rm dk12-api:amd64', '+ WARNING: … (linux/amd64) does not match …', 'x64'], { title: 'sửa: ghim --platform của máy ĐÍCH' }), 'l')}` },

  { t: 'Cổng bận: HAI câu báo lỗi, HAI thủ phạm khác nhau', body: `
    ${term(['$ docker run -d --name dk12-web1 -p 127.0.0.1:18120:80 nginx:1.27-alpine', '$ docker run -d --name dk12-web2 -p 127.0.0.1:18120:80 nginx:1.27-alpine', '! docker: … on endpoint dk12-web2 (…): Bind for 127.0.0.1:18120 failed: port is already allocated', '$ docker ps --filter publish=18120 --format \'{{.Names}} {{.Ports}}\'', '+ dk12-web1 127.0.0.1:18120->80/tcp', '# cổng 18122 do python3 (không phải Docker) giữ — máy Linux:', '! docker: … failed to bind host port 127.0.0.1:18122/tcp: address already in use', '$ ss -lntp "sport = :18122" | tail -1', '+ LISTEN 0      5          127.0.0.1:18122      0.0.0.0:*    users:(("python3",pid=514366,fd=3))', '$ docker ps -a --filter name=dk12-web2 --format \'{{.Names}} {{.Status}}\'', '+ dk12-web2 Created'], { title: 'output thật — Mac (cổng 18120) và máy Linux (cổng 18122)' })}
    ${cards([
      { t: '<code>port is already allocated</code>', d: 'Một container khác ĐANG CHẠY giữ cổng. Tìm: <code>docker ps --filter publish=P</code>', c: 'blu' },
      { t: '<code>address already in use</code>', d: 'Tiến trình NGOÀI Docker giữ cổng. Tìm: <code>lsof -i :P</code> / <code>ss -lntp</code>', c: 'amb' },
      { t: 'Created bị bỏ lại', d: 'Chạy lại y lệnh ⇒ <code>Conflict. The container name … is already in use</code>. Container DỪNG thì không giữ cổng.', c: 'red' },
    ], 3)}` },

  { t: 'Hai kiểu hỏng IM LẶNG: -v và biến env thiếu', body: `
    ${term(['$ docker run --rm --mount type=bind,src=$PWD/khong-co,dst=/app alpine:3.20 true', '! docker: … invalid mount config for type "bind": bind source path does not exist: /host_mnt/private/tmp/…/ch12/khong-co', '$ docker run --rm -v $PWD/khong-co:/app alpine:3.20 ls -la /app', 'total 4', 'drwxr-xr-x    2 root     root            64 Sep 23 19:26 .', '$ ls -ld khong-co', '+ drwxr-xr-x  2 admin  wheel  64 Sep 24 02:26 khong-co        # ← -v vừa TẠO nó, rỗng, không báo gì'], { title: 'output thật — máy Mac: --mount từ chối, -v lặng lẽ tạo thư mục', fs: 14 })}
    ${term(['$ docker compose config 2>&1 | grep -E \'warn|image:|DATABASE_URL\'', '+ time="2026-09-24T02:27:20+07:00" level=warning msg="The \\"NODE_TAG\\" variable is not set. Defaulting to a blank string."', '      DATABASE_URL: postgresql://blog:@db:5432/blog', '!     image: \'node:\'', '$ docker compose up -d', "! unable to get image 'node:': Error response from daemon: invalid reference format", '# sửa: image: node:${NODE_TAG:?đặt NODE_TAG trong .env, vd 22-alpine}', '$ docker compose config', '= error while interpolating services.api.image: required variable NODE_TAG is missing a value: đặt NODE_TAG trong .env, vd 22-alpine'], { title: 'output thật — Compose v5.5.1: biến thiếu thành chuỗi rỗng, :? biến nó thành lỗi rõ ràng', fs: 14 })}` },

  /* ───────────── 12.3 ───────────── */
  { t: 'Lên rồi chết: hỏi MÃ THOÁT trước, đọc log sau', body: decide({ root: 'Lên rồi chết', rootSub: 'mã của bạn ĐÃ chạy\nlog có lời', rw: 200, kx: 250, kw: 330, rh: 54, gap: 9, rows: [
    { k: 'Exited (0) ngay', c: 'tea', m: 'Tự chạy nền (nginx, redis --daemonize) · việc 1 lần · sh không -it', cmd: "docker inspect -f '{{.Config.Entrypoint}} {{.Config.Cmd}}'" },
    { k: 'Exited (1) · Restarting (1)', c: 'amb', kfs: 14, m: 'App báo lỗi: đọc lần hỏng ĐẦU TIÊN, không phải thứ 100', cmd: 'docker logs --timestamps --since 5m <c>' },
    { k: '137 · OOMKilled=true', c: 'red', m: 'Chạm trần RAM của chính nó (--memory / mem_limit)', cmd: "docker stats --no-stream ; heap của runtime?" },
    { k: '137 · OOMKilled=false', c: 'ora', m: 'Có người SIGKILL: docker kill, stop quá hạn, deploy khác', cmd: 'docker events --filter container=<c>' },
    { k: '139', c: 'pnk', m: 'SIGSEGV: thư viện native sai libc / sai kiến trúc', cmd: '--platform ; ảnh nền glibc hay musl?' },
    { k: '143 · 130', c: 'blu', m: 'Có người gửi SIGTERM / SIGINT — ai đang dừng nó?', cmd: 'docker events ; systemd, cron, deploy chồng' },
    { k: 'Up (unhealthy)', c: 'vio', m: 'Bộ kiểm báo hỏng — kiểm BỘ KIỂM trước', cmd: "docker inspect -f '{{json .State.Health}}' <c>" },
  ] }) },

  { t: 'Vòng lặp restart: Docker chờ GẤP ĐÔI mỗi lần', body: `
    ${backoff()}
    ${two(
    term(['$ docker run -d --name dk12-loop \\', '    --restart on-failure alpine:3.20 sh -c \\', '    \'date +%T; echo "Error: connect ECONNREFUSED 10.0.0.5:6379"; exit 1\'', '$ docker logs -t dk12-loop | grep -v Error | awk \'{print $2}\'', '19:23:55', '19:23:56', '…', '19:23:59', '+ 19:24:02', '+ 19:24:09', '+ 19:24:22'], { title: 'output thật — máy Mac' }),
    `${box('warn', '<code>restart: always</code> không SỬA gì — nó chỉ làm container “vỗ cánh” mãi: log đầy cùng một lỗi, healthcheck nhảy qua lại.')}
    ${box('tip', 'Có mốc giờ (<code>-t</code>) mới biết dòng nào là lần thử nào. Muốn chạy một lần có tay trên bàn phím: <code>docker compose run --rm --entrypoint sh &lt;svc&gt;</code>.')}`, 'l2')}` },

  { t: 'Exit 0 ngay lập tức: tiến trình đã tự chạy NỀN', body: two(
    term(['$ docker run -d --name dk12-quiet nginx:1.27-alpine nginx', '$ docker ps -a --filter name=dk12-quiet --format \'{{.Status}}\'', '! Exited (0) 12 seconds ago', '$ docker logs dk12-quiet | tail -5', '2026/09/23 19:23:56 [notice] 1#1: OS: Linux 7.0.12-linuxkit', '2026/09/23 19:23:56 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576', '+ 2026/09/23 19:23:56 [notice] 30#30: start worker processes', '2026/09/23 19:23:56 [notice] 30#30: start worker process 31', '2026/09/23 19:23:56 [notice] 30#30: start worker process 32', '$ docker inspect -f \'{{.Config.Entrypoint}} + {{.Config.Cmd}}\' \\', '    dk12-quiet', '[/docker-entrypoint.sh] + [nginx]', '$ docker run -d --name dk12-sh alpine:3.20 sh   # → Exited (0)'], { title: 'output thật — máy Mac' }),
    `${box('info', '<b>Log KHÔNG rỗng:</b> nginx lên bình thường, rồi dòng log đổi từ <b>1#1</b> sang <b>30#30</b> — tiến trình gốc đã <code>fork</code> ra nền và thoát ⇒ PID 1 chết ⇒ Exited (0).')}
    ${table(['Nguyên nhân', 'Sửa'], [
      ['Tự chạy nền', '<code>nginx -g "daemon off;"</code> · <code>redis-server</code> không <code>--daemonize</code>'],
      ['Việc chạy 1 lần', '<code>CMD ["npm","run","build"]</code>: 0 là đúng — đừng gọi nó là service'],
      ['Không có stdin', '<code>docker run -d alpine sh</code> ⇒ thêm <code>-it</code> hoặc giao việc'],
      ['ENTRYPOINT + CMD ghép sai', '<code>inspect .Config</code> in đúng thứ đã chạy'],
    ], { sm: true })}`, 'l2') },

  { t: '137 có hai nghĩa — OOMKilled phân xử; 143/130/139 là tín hiệu', body: two(
    term(['$ docker run --name dk12-c137 --memory 128m --memory-swap 128m \\', '    alpine:3.20 dd if=/dev/zero of=/dev/null bs=200M count=1', '$ docker inspect -f \\', '    \'{{.State.ExitCode}} oom={{.State.OOMKilled}}\' dk12-c137', '! 137 oom=true', '$ docker run -d --name dk12-c137k alpine:3.20 sleep 600', '$ docker kill dk12-c137k', '$ docker inspect -f \'…\' dk12-c137k   # cùng mẫu như trên', '+ 137 oom=false', '$ docker run -d --name dk12-c143 --init alpine:3.20 sleep 600', '$ docker stop dk12-c143   # → 143 oom=false', '$ docker run -d --name dk12-c130 --init alpine:3.20 sleep 600', '$ docker kill -s INT dk12-c130   # → 130 oom=false', '$ docker run --name dk12-c139 python:3.12-alpine \\', '    python -c \'import ctypes; ctypes.string_at(0)\'', '! exit=139'], { title: 'output thật — máy Mac' }),
    `${kpis([{ v: '137', l: '128 + 9 SIGKILL', c: 'red' }, { v: '143', l: '128 + 15 SIGTERM', c: 'amb' }, { v: '130', l: '128 + 2 SIGINT', c: 'blu' }, { v: '139', l: '128 + 11 SIGSEGV', c: 'pnk' }])}
    ${box('warn', '<code>docker ps</code> in <b>Exited (137)</b> y hệt cho OOM và cho <code>docker kill</code>. Chỉ <code>.State.OOMKilled</code> phân biệt được.')}
    ${box('info', 'Không <code>--init</code>, <code>kill -s INT</code> vào <code>sleep</code> (PID 1) bị <b>vứt</b>: container vẫn <code>running 0</code> (Chương 1).')}`, 'l') },

  { t: 'unhealthy mà app vẫn trả lời: BỘ KIỂM hỏng chứ không phải app', body: two(
    term(['$ docker ps --filter name=dk12-hc \\', '    --format \'{{.Names}} {{.Status}}\'', '! dk12-hc Up 7 seconds (unhealthy)', '$ docker inspect dk12-hc -f \\', '  \'{{range .State.Health.Log}}{{.ExitCode}}: {{.Output}}{{end}}\'', '! 127: /bin/sh: curl: not found', '$ docker exec dk12-hc wget -qO- http://localhost:3000/', '= ok', '# compose: proxy depends_on web (service_healthy)', '$ docker compose up -d', '! dependency failed to start: container dk12-hc-web-1 is unhealthy', '# đổi test sang node -e (ảnh node luôn có node)', '$ docker compose up -d && docker compose ps -a', '= proxy     Up 1 second', '= web       Up 3 seconds (healthy)'], { title: 'output thật — node:22-alpine: có wget, KHÔNG có curl' }),
    `<div style="font-size:16px;font-weight:800;color:${D.red};margin-bottom:4px">❌ gọi thứ ảnh không có</div>
    ${yaml([['healthcheck:', ''], ['  test: ["CMD-SHELL", "curl -fsS http://localhost:3000/"]', ''], ['  interval: 2s', ''], ['  retries: 2', '']], { fs: 14 })}
    <div style="font-size:16px;font-weight:800;color:${D.grn};margin:8px 0 4px">✅ dùng thứ chắc chắn có trong ảnh</div>
    ${yaml([['  test: ["CMD", "node", "-e", "require(\'http\').get(', ''], ['    \'http://localhost:3000\', r => process.exit(', ''], ['    r.statusCode == 200 ? 0 : 1)).on(\'error\',', ''], ['    () => process.exit(1))"]', '']], { fs: 14 })}
    ${box('tip', 'Mã 127 trong Health.Log = <b>lệnh kiểm không tồn tại</b>. Chạy thử nó bằng <code>docker exec</code> trước khi tin phán quyết.')}`, 'l') },

  { t: 'compose run: đúng cấu hình service, thêm một cái shell', body: two(
    term(['$ docker compose run --rm --no-deps --entrypoint sh api -c \\', '    \'echo "REDIS_HOST=$REDIS_HOST"; getent hosts cache || \\', '     echo "cache: không phân giải được"; node server.js\'', ' Container dk12-blog-api-run-fe6f620d5fcc Created', 'REDIS_HOST=cache', '! cache: không phân giải được', '2026-09-23T19:27:37.869Z boot: connecting to cache:6379', '! Error: ENOTFOUND getaddrinfo ENOTFOUND cache', '# nguyên nhân: service cache chưa chạy. Bật nó lên:', '$ docker compose up -d cache; sleep 15', '$ docker compose ps --format \'table {{.Service}}\\t{{.Status}}\'', 'SERVICE   STATUS', '= api       Up 2 seconds', '= cache     Up 15 seconds', '$ docker compose logs --tail 1 api', '= api-1  | redis ok, listening on 3000'], { title: 'output thật — máy Mac, Compose v5.5.1' }),
    `${table(['Cờ', 'Làm gì'], [
      ['<code>--rm</code>', 'xoá container chạy thử khi xong'],
      ['<code>--no-deps</code>', 'KHÔNG kéo các service phụ thuộc lên — thấy đúng lỗi'],
      ['<code>--entrypoint sh</code>', 'thay lệnh hỏng bằng shell'],
      ['<code>--service-ports</code>', 'mở cả cổng như service thật (mặc định KHÔNG)'],
    ], { sm: true })}
    ${box('good', 'Tên container chạy thử: <code>&lt;project&gt;-&lt;svc&gt;-run-&lt;12 hex&gt;</code>. Bỏ <code>--rm</code> nếu muốn <code>docker cp</code> file ra sau khi nó chết.')}`, 'l') },

  /* ───────────── 12.4 ───────────── */
  { t: 'Build hỏng: hỏng ở đâu, và chỉ hỏng ở CI hay cả máy bạn?', body: decide({ root: 'docker build\nhỏng', rootSub: 'hoặc xanh mà\nảnh chết', rw: 210, kx: 260, kw: 350, rh: 56, gap: 10, rows: [
    { k: 'COPY … "/x": not found', c: 'tea', m: 'x không nằm trong NGỮ CẢNH: sai đường dẫn, .dockerignore, ../', cmd: 'docker build --check .' },
    { k: 'lỗi trong một RUN', c: 'amb', m: 'Đọc từ DƯỚI lên; khối tóm tắt chỉ giữ ~10 dòng cuối', cmd: 'docker build --progress=plain … 2>&1 | less' },
    { k: 'máy xanh, CI đỏ', c: 'red', m: 'cache cũ · file chưa commit · hoa-thường · kiến trúc', cmd: 'git stash -u; build --no-cache --pull --platform …' },
    { k: 'exit 137 khi build', c: 'ora', m: 'Máy build / runner hết RAM — không phải container', cmd: 'giảm song song ; dựng tuần tự' },
    { k: 'chậm, context 100s MB', c: 'blu', m: 'COPY . . kéo cả node_modules, .git, dump', cmd: '.dockerignore đặt cạnh GỐC ngữ cảnh' },
    { k: 'build xanh, run chết', c: 'pnk', m: 'Sai libc / arch / thiếu file: build không chạy thử gì cả', cmd: 'docker run --rm <ảnh> <lệnh nhỏ nhất> || exit 1' },
  ] }) },

  { t: 'BuildKit: đọc từ DƯỚI lên — dòng lỗi thật nằm phía TRÊN', body: two(
    term(['$ docker build -t dk12-build:1 . 2>&1', '#10 [6/6] RUN npm run build', '#10 0.183 > node build.js', '#10 0.205 node:internal/modules/cjs/loader:1433', '! #10 0.205 Error: Cannot find module \'./Auth.routes\'', '#10 0.205 Require stack:', '…', '------', ' > [6/6] RUN npm run build:', '0.205   code: \'MODULE_NOT_FOUND\',', '…', '0.205 Node.js v22.23.2', '------', '+ Dockerfile:6', '   5 |     COPY . .', '+   6 | >>> RUN npm run build', '! ERROR: failed to build: failed to solve:', '!   process "/bin/sh -c npm run build"', '!   did not complete successfully: exit code: 1'], { title: 'output thật — máy Mac, BuildKit (buildx v0.37)' }),
    steps([
      ['<b>Dòng cuối</b>: lệnh nào hỏng, mã gì', '<code>exit code: 1</code> ⇒ lệnh của BẠN báo lỗi'],
      ['<b>Khối Dockerfile:6</b>: đúng dòng, kèm ngữ cảnh', '<code>&gt;&gt;&gt;</code> chỉ vào chỉ thị hỏng'],
      ['<b>Khối <code>&gt; [6/6]</code></b>: CHỈ ~10 dòng cuối output', 'ở đây toàn stack trace — thiếu mất dòng lỗi'],
      ['<b>Cuộn lên / <code>--progress=plain</code></b>', 'mới thấy <code>Cannot find module \'./Auth.routes\'</code>'],
    ]), 'l2') },

  { t: 'COPY … not found: file không nằm trong NGỮ CẢNH', body: two(
    term(['# 1) file chưa có', '$ docker build -f Dockerfile.copy -t dk12-copy:1 .', '! ERROR: … failed to compute cache key: … "/config.json": not found', '# 2) file CÓ trên đĩa, nhưng .dockerignore loại nó', '$ ls -l config.json', '-rw-r--r--@ 1 admin  wheel  3 Sep 24 02:29 config.json', '$ docker build -f Dockerfile.copy -t dk12-copy:1 .', '! ERROR: … "/config.json": not found', '# 3) COPY ra ngoài ngữ cảnh', '# Dockerfile.up có dòng: COPY ../secrets.env /etc/', '$ docker build -f Dockerfile.up -t dk12-copy:2 .', '! ERROR: … "/secrets.env": not found', '$ docker build --check -f Dockerfile.copy .', '+  - CopyIgnoredFile: Attempting to Copy file "config.json" that is', '+    excluded by .dockerignore (line 2)'], { title: 'output thật — máy Mac' }),
    `${diagram({ w: 460, h: 320, nodes: [
      { id: 'd', x: 0, y: 0, w: 460, h: 72, t: 'Thư mục trên đĩa', d: 'mọi file, kể cả ../ và thứ bị ignore', c: 'dim' },
      { id: 'c', x: 40, y: 128, w: 380, h: 70, t: 'NGỮ CẢNH gửi cho BuildKit', d: '= thư mục − .dockerignore', c: 'dk' },
      { id: 'k', x: 90, y: 252, w: 280, h: 60, t: 'COPY chỉ thấy cái này', c: 'grn' },
    ], edges: [{ from: 'd', to: 'c', c: 'dim', t: 'cắt' }, { from: 'c', to: 'k', c: 'grn' }] })}
    ${box('tip', 'Đường dẫn trong COPY tính từ GỐC ngữ cảnh (dấu <code>/</code> đầu trong thông báo), không từ Dockerfile.')}`, 'l') },

  { t: 'Hoa-thường: Mac chạy được, Docker build (và CI) thì không', body: `
    ${term(['$ ls src                                   # src/index.js có dòng: require(\'./Auth.routes\')', 'auth.routes.js  index.js', '$ node build.js                            # ngay trên macOS — APFS không phân biệt hoa-thường', '= routes: /login /logout', '= build ok', '$ docker run --rm -v "$PWD":/app -w /app node:22-alpine node build.js', '= build ok                                 # bind mount MƯỢN ổ đĩa của Mac ⇒ vẫn qua!', '$ docker build -t dk12-build:1 .', "! #10 0.205 Error: Cannot find module './Auth.routes'", '# soi tầng NGAY TRƯỚC bước hỏng (Dockerfile.ci tách riêng stage "src")', '$ docker build -q -f Dockerfile.ci --target src -t dk12-build:src .', '$ docker run --rm dk12-build:src sh -c \'ls src | grep -i auth\'', '+ auth.routes.js'], { title: 'output thật — máy Mac' })}
    ${cards([
      { ic: '❌', t: 'KHÔNG tái hiện được', d: '<code>node build.js</code> trên Mac · container bind-mount thư mục Mac · build còn cache cũ', c: 'red' },
      { ic: '✅', t: 'Tái hiện như CI', d: '<code>git stash -u</code> rồi <code>docker build --no-cache --pull --platform linux/amd64</code>', c: 'grn' },
      { ic: 'ℹ️', t: '--target có giới hạn', d: 'Chỉ giúp khi bước hỏng nằm ở stage SAU ⇒ tách nó ra: <code>FROM src AS build</code>', c: 'blu' },
    ], 3)}` },

  { t: 'Cache khoá theo CHUỖI lệnh, không theo thế giới bên ngoài', body: two(
    term(['$ cat Dockerfile.cache', 'FROM alpine:3.20', 'RUN date +%T > /built-at', 'RUN wget -qO- https://dl-cdn.alpinelinux.org/… | grep … > /alpine-latest', '$ docker run --rm dk12-cache:1 cat /built-at /alpine-latest', '19:29:28', '  version: 3.24.2', '$ docker build -f Dockerfile.cache -t dk12-cache:1 . \\', '    | grep -c CACHED', '! 0          # tiến độ BuildKit đi ra STDERR!', '$ docker build -f Dockerfile.cache -t dk12-cache:1 . \\', '    2>&1 | grep -c CACHED', '+ 2', '$ docker run --rm dk12-cache:1 cat /built-at', '+ 19:29:28   # vẫn giờ cũ: RUN không chạy lại', '$ docker build -q --no-cache -f Dockerfile.cache … \\', '    && docker run --rm dk12-cache:1 cat /built-at', '= 19:29:34'], { title: 'output thật — máy Mac (giờ trong container là UTC)' }),
    `${cards([
      { ic: '🔑', t: 'Khoá cache của RUN', d: 'chuỗi lệnh + tầng cha. Kết quả mạng, giờ, gói mới trên mirror: KHÔNG tính.', c: 'amb' },
      { ic: '🧪', t: 'Phép thử', d: '<code>--no-cache --pull</code> qua mà build thường hỏng ⇒ cache là thủ phạm.', c: 'blu' },
      { ic: '🛠', t: 'Sửa', d: '<code>apt-get update &amp;&amp; install</code> cùng một RUN · ghim phiên bản · <code>ARG</code> để phá cache có chủ đích.', c: 'grn' },
    ], 1)}`, 'l2') },

  { t: 'Ngữ cảnh 220 MB → 446 B: .dockerignore phải đặt ĐÚNG chỗ', body: two(
    bars([
      { l: 'không .dockerignore', sub: 'COPY . .', v: 220.26, txt: '220.26MB · 1.9s', c: 'red' },
      { l: '.dockerignore ở gốc ngữ cảnh', sub: 'node_modules, data, .git', v: 0.5, txt: '446B', c: 'grn' },
      { l: '.dockerignore cạnh docker/Dockerfile', sub: 'ngữ cảnh vẫn là .', v: 220.26, txt: '220.26MB — bị bỏ qua', c: 'red' },
      { l: 'docker/Dockerfile.dockerignore', sub: 'tên = &lt;Dockerfile&gt;.dockerignore', v: 0.5, txt: '529B', c: 'grn' },
    ], { lw: 330, max: 230 }),
    `${term(['$ du -sh node_modules data', '150M	node_modules', ' 60M	data', '$ docker build --no-cache -f Dockerfile.ctx . \\', '    2>&1 | grep transferring', '! #6 transferring context: 220.26MB 1.9s done', '# thêm .dockerignore ở gốc ngữ cảnh', '= #6 transferring context: 446B 0.0s done'], { title: 'output thật — máy Mac' })}
    ${box('info', 'BuildKit chỉ gửi file mà COPY cần: <code>COPY package.json</code> ⇒ 123B dù thư mục 210 MB. Ngữ cảnh phình khi có <code>COPY . .</code>.')}`, 'l') },

  { t: 'Build xanh, ảnh chết: file có, quyền có, vẫn “no such file”', body: two(
    `${yaml([['FROM debian:bookworm-slim AS tool', 'glibc'], ['RUN cp /usr/bin/stat /usr/local/bin/report', ''], ['', ''], ['FROM alpine:3.20', 'musl'], ['COPY --from=tool /usr/local/bin/report /usr/local/bin/', 'binary glibc'], ['CMD ["report", "/etc/hostname"]', '']], { lang: 'docker', fs: 14.5 })}
    ${term(['$ docker build -q -f Dockerfile.libc -t dk12-libc:1 . \\', '    && echo "build ✓"', '= build ✓', '$ docker run --name dk12-libc dk12-libc:1; echo "exit=$?"', '! exec /usr/local/bin/report: no such file or directory', '+ exit=255', '$ docker run --rm --entrypoint sh dk12-libc:1 -c \\', '    \'ls -l /usr/local/bin/report; ls /lib/ld-*\'', '-rwxr-xr-x    1 root     root        134320 … /usr/local/bin/report', '+ /lib/ld-musl-aarch64.so.1', '$ docker run --rm debian:bookworm-slim \\', '    sh -c \'ldd /usr/bin/stat | grep ld-linux\'', '!         /lib/ld-linux-aarch64.so.1 (0x0000ffffbafc0000)'], { title: 'output thật — máy Mac' })}`,
    `${diagram({ w: 460, h: 230, nodes: [
      { id: 'b', x: 0, y: 0, w: 460, h: 64, t: 'report (glibc)', d: 'cần loader /lib/ld-linux-aarch64.so.1', c: 'red', mono: true },
      { id: 'a', x: 0, y: 150, w: 460, h: 64, t: 'alpine chỉ có', d: '/lib/ld-musl-aarch64.so.1', c: 'amb' },
    ], edges: [{ from: 'b', to: 'a', c: 'red', t: 'không có ⇒ ENOENT' }] })}
    ${box('good', 'Chốt trước khi push, một dòng:<br><code>docker run --rm &lt;ảnh&gt; report --version || { echo "KHÔNG đẩy"; exit 1; }</code>')}
    ${box('warn', 'Đúng hình dạng sự cố 502 của một dự án sinh viên: engine Prisma glibc trong ảnh Alpine. Xanh ở build, push, tráo.')}`, 'l') },

  /* ───────────── 12.5 ───────────── */
  { t: 'Bản đồ toàn khoá: 13 phần, mỗi phần một câu', body: courseMap() },

  { t: 'Mười hai luật — mỗi luật chặn một kiểu hỏng', body: table(['#', 'Luật', 'Chặn kiểu hỏng nào', '#', 'Luật', 'Chặn kiểu hỏng nào'], [
    ['1', 'Ghim phiên bản ảnh nền', 'tag trôi, “hôm qua còn chạy”', '7', 'Chỉ proxy công bố cổng', 'cổng bận, CSDL lộ ra ngoài'],
    ['2', 'Chạy thử ảnh trước khi push', 'build xanh, ảnh chết', '8', 'Lắng nghe <code>0.0.0.0</code>, gọi bằng tên', 'ECONNREFUSED, ENOTFOUND'],
    ['3', 'Xếp chỉ thị theo tần suất đổi', 'build chậm, cache nói dối', '9', 'Healthcheck chạy được trong ảnh', 'unhealthy giả, 127'],
    ['4', 'Multi-stage', 'ảnh to, thiếu/thừa thư viện', '10', 'Hạn mức cho mọi thứ', '137 OOM lan cả máy'],
    ['5', 'Non-root, chỉ đọc', 'hậu khai thác', '11', 'Xoay log, dọn theo lịch', 'đĩa đầy'],
    ['6', 'Volume có tên + khôi phục thử', '“mất” dữ liệu', '12', 'Tag theo commit, deploy có chủ đích', 'không biết cái gì đang chạy'],
  ], { sm: true }) },

  { t: 'Sự cố thật: xanh ở MỌI cửa → một phép kiểm mới', body: `
    ${table(['Sự cố (dự án sinh viên)', 'Cửa nào xanh', 'Thật ra hỏng ở tầng', 'Phép kiểm sinh ra'], [
      ['API 502 bảy phút: engine Prisma glibc trong ảnh Alpine', 'build · push · tráo', '1 · Ảnh (libc)', '+Chốt libc ↔ engine trước khi push'],
      ['Tính năng 404 mấy ngày, container vẫn khoẻ', 'deploy <code>--no-build</code>', '1 · Ảnh cũ', '+Smoke-test mỗi module, 404 là đỏ'],
      ['Deploy chết giữa chừng, đĩa còn 1,8 GB', 'mọi thứ trước đó', '4 · Đĩa (cache build 7,6 GB)', '+Dựng ở máy khác, VPS chỉ kéo ảnh'],
      ['Mỗi deploy mất ~25 s kiểm… không gì cả', 'healthcheck “chạy”', '2 · Bộ kiểm gọi <code>wget</code> không có', '+Kiểm bộ kiểm bằng <code>docker exec</code>'],
      ['Sửa <code>nginx.conf</code> mà container không thấy', '<code>nginx -t</code>, reload', '2 · Bind-mount file đơn theo inode', '+Ghi đè tại chỗ + so sha256 trong container'],
    ], { sm: true })}
    ${box('good', '<b>Một sự cố chưa xong</b> cho tới khi nó đẻ ra một phép kiểm lẽ ra đã bắt được nó.')}` },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 12', body: table(['Làm', 'Vì sao sai', 'Làm thay bằng'], [
    ['Mở <code>docker logs</code> đầu tiên', 'Container <code>Created</code> có log rỗng — lỗi ở stderr', '<code>docker ps -a</code> → STATUS trước'],
    ['Thấy 137 là tăng RAM', 'Có thể là <code>docker kill</code> / stop quá hạn', '<code>.State.OOMKilled</code> rồi mới quyết'],
    ['Thêm <code>restart: always</code> cho “hết lỗi”', 'Chỉ làm nó vỗ cánh, trôi mất lần hỏng đầu', 'Đọc lần đầu: <code>logs -t</code>, <code>compose run</code>'],
    ['Tin <code>unhealthy</code> là app hỏng', 'Health.Log 127 = lệnh kiểm không có', '<code>docker exec</code> chạy thử lệnh kiểm'],
    ['“File có mà báo not found” ⇒ build lại', 'CRLF / loader musl-glibc / sai arch', '<code>file</code>, <code>ldd</code>, <code>.Architecture</code>'],
    ['<code>docker build … | grep</code>', 'Tiến độ BuildKit ở stderr', '<code>2&gt;&amp;1 | grep</code>'],
    ['Đổi 5 thứ rồi restart', 'Chạy lại được mà không biết vì sao', 'Đổi MỘT thứ, kiểm, ghi lại'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 12', body: table(['Muốn…', 'Gõ'], [
    ['Trạng thái + mã + số lần restart', '<code>docker inspect -f \'{{.State.Status}} {{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}\' c</code>'],
    ['Lỗi lúc tạo (container Created)', '<code>docker inspect -f \'{{.State.Error}}\' c</code>'],
    ['Log có mốc giờ, vài phút gần nhất', '<code>docker logs -t --since 5m c</code>'],
    ['Lịch sử kiểm sức khoẻ', '<code>docker inspect -f \'{{json .State.Health}}\' c</code>'],
    ['Ai giết / dừng nó', '<code>docker events --filter container=c --since 10m</code>'],
    ['Shell với đúng cấu hình service', '<code>docker compose run --rm --no-deps --entrypoint sh svc</code>'],
    ['Soi ảnh không shell', '<code>docker create</code> + <code>docker cp $cid:/path -</code> · netshoot <code>--pid/--network container:c</code>'],
    ['Kiến trúc của ảnh', '<code>docker image inspect -f \'{{.Os}}/{{.Architecture}}\' img</code>'],
    ['Ai giữ cổng', '<code>docker ps --filter publish=18120</code> · <code>lsof -i :18120</code>'],
    ['Compose thật sự hiểu file thế nào', '<code>docker compose config</code>'],
    ['Build như CI', '<code>git stash -u; docker build --no-cache --pull --platform linux/amd64 --progress=plain .</code>'],
    ['Lint Dockerfile + .dockerignore', '<code>docker build --check .</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 12 (45 phút): làm hỏng rồi chẩn đoán', body: `
    ${steps([
      ['Gây đủ 6 mã: 0, 1, 126, 127, 137 (OOM), 143 — dự đoán STATUS trước khi nhìn', 'so với bảng mã thoát; cái nào <code>Created</code>, cái nào <code>Exited</code>?'],
      ['Dựng stack api + cache, chạy api một mình ⇒ vòng lặp; đọc lần hỏng đầu bằng <code>logs -t</code>', 'rồi <code>compose run --rm --no-deps --entrypoint sh api</code> tìm ra ENOTFOUND'],
      ['Healthcheck gọi <code>curl</code> trong ảnh node ⇒ unhealthy; chứng minh app vẫn chạy rồi sửa bằng <code>node -e</code>', 'Health.Log phải từ 127 thành 0'],
      ['Build một app có <code>require(\'./Auth.routes\')</code>: qua trên Mac, đỏ trong <code>docker build</code>', 'đọc BuildKit từ dưới lên, tìm dòng lỗi thật'],
      ['Chép binary glibc vào ảnh alpine ⇒ build xanh, run 255; thêm chốt smoke-run', 'chốt phải trả mã ≠ 0 để CI dừng'],
    ])}
    ${box('good', '<b>Đạt khi:</b> với mỗi ca bạn nói được tầng (1–4) và lệnh hỏi đầu tiên TRƯỚC khi sửa; <code>docker ps -a --filter name=thu-</code> rỗng sau khi dọn.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));
