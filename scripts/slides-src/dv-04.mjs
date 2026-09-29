/**
 * Deploy lên VPS · Deck dv-04 — Chương 4: Cấu hình và bí mật.
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026:
 *   • "VPS thí nghiệm" = container ubuntu:24.04 (arm64) dv04-vps chạy systemd 255 làm PID 1 + openssh-server,
 *     SSH từ Mac qua 127.0.0.1:19042 bằng khoá tạo trong thư mục nháp (bash 5.2.21, người dùng deploy + khach).
 *     Ứng dụng thử "dat-lich" ở /opt/datlich (.env, repo/, unit thu-env.service đọc EnvironmentFile=).
 *   • "Mac" = Mac M1 macOS 27: Node 22.21.0 (node --env-file), Docker 29.8 + Compose v5.5.1 (docker run --env-file,
 *     compose env_file, docker build --build-arg / --secret, ảnh tạm dv04-argthu — đã xoá), openrsync → VPS,
 *     Next.js 15.5.26 dựng trong thư mục nháp (next start ở cổng 19043), git 2.51.1, gitleaks 8.30.1,
 *     git-filter-repo; máy chủ token thử (node) ở cổng 19044.
 *   • PostgreSQL 16 (postgres:16-alpine, dv04-pg) trên mạng dv04-net — đổi mật khẩu vs hai user.
 * Output CŨ của chương (v1/v2 đọc .env qua symlink, bốn giai đoạn xoay khoá) giữ nguyên từ bài học.
 *
 * Hình tự vẽ (SVG nội tuyến): motTaoTac() một tạo tác, nhiều tệp cấu hình · giuaDeploy() thêm biến giữa lúc deploy ·
 * haiLuc() lúc dựng vs lúc chạy · bonGiaiDoan() bốn giai đoạn xoay khoá trên trục thời gian.
 */
import { S, cover, sh, yaml, term, mindmap, diagram, cards, box, steps, table, two, code, sv, R, T, A, D } from './_dv-chung.mjs';

export const deck = { key: 'dv-04', code: 'DEPLOY · CHƯƠNG 4', title: 'Cấu hình và bí mật', sub: 'Deploy lên VPS · Chương 4' };

// Giá trị THẬT đã đo (khoá giả, không mở được gì) — tách ra hằng để quét bí mật không bắt nhầm từng dòng dùng nó.
const K_CU = 'NEXT_PUBLIC_GIPHY_KEY=khoa-CU-12345'; // gitleaks:allow
const K_MOI = 'NEXT_PUBLIC_GIPHY_KEY=khoa-MOI-12345'; // gitleaks:allow
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}.c-code{font-size:14.5px;line-height:1.5}</style>';

/* Slide 3 — một tạo tác, nhiều môi trường: cấu hình đứng NGOÀI */
const motTaoTac = () => {
  let s = '';
  s += R(0, 70, 230, 110, { c: 'vio', r: 12 }) + T(115, 110, '📦 git commit', { fs: 17, a: 'middle', b: true }) + T(115, 140, 'c84837c', { fs: 16, a: 'middle', mono: true, c: 'mu' });
  s += A(236, 125, 318, 125, { c: 'vio' }) + T(277, 112, 'dựng 1 lần', { fs: 13.5, a: 'middle', c: 'mu' });
  s += R(324, 50, 300, 150, { c: 'dv', r: 12, fill: 'rgba(56,189,248,.07)' });
  s += T(474, 88, 'TẠO TÁC dat-lich:c84837c', { fs: 17, a: 'middle', b: true, c: 'dv' });
  s += T(474, 118, 'mã đã dựng + node_modules', { fs: 15, a: 'middle', c: 'tx' });
  s += T(474, 146, 'KHÔNG có .env', { fs: 16, a: 'middle', b: true, c: 'grn' });
  s += T(474, 176, 'cùng byte ở mọi nơi', { fs: 14, a: 'middle', c: 'mu' });
  // hai môi trường
  const env = (y, ten, tep, gt, c) => R(740, y, 410, 112, { c, r: 12 }) +
    T(760, y + 30, ten, { fs: 17, b: true, c }) + T(760, y + 60, tep, { fs: 15, mono: true, c: 'tx' }) + T(760, y + 88, gt, { fs: 14, mono: true, c: 'mu' });
  s += env(0, '🧪 staging (VPS thử)', '/opt/datlich/.env', 'DATABASE_URL=…/datlich_thu', 'amb');
  s += env(138, '🌐 production (VPS thật)', '/opt/datlich/.env', 'DATABASE_URL=…/datlich', 'grn');
  s += A(630, 110, 734, 60, { c: 'amb' }) + A(630, 140, 734, 192, { c: 'grn' });
  s += T(0, 286, 'Cấu hình = mọi thứ KHÁC nhau giữa các nơi chạy.', { fs: 16, c: 'tx', b: true });
  s += T(0, 312, 'Nó sống trên máy chủ, cạnh tạo tác — không bao giờ bên trong.', { fs: 15, c: 'mu' });
  s += T(1150, 286, '12-factor, yếu tố III — Heroku, ~2011', { fs: 15, a: 'end', c: 'dv' });
  s += T(1150, 312, 'phép thử: công khai kho mã ngay lúc này có lộ gì không?', { fs: 14, a: 'end', c: 'mu' });
  return sv(1150, 322, s);
};

/* Slide 6 — thêm biến vào .env trong lúc deploy đang chạy */
const giuaDeploy = () => {
  const X = (t) => 150 + t * 150; // giây → px
  let s = '';
  s += T(0, 46, 'deploy.sh', { fs: 16, b: true, c: 'dv', mono: true });
  s += T(0, 120, 'người thêm', { fs: 16, b: true, c: 'amb' }) + T(0, 140, 'biến (tay)', { fs: 14, c: 'mu' });
  s += T(0, 196, 'container', { fs: 16, b: true, c: 'grn', mono: true });
  s += `<rect x="${X(0)}" y="26" width="${X(0.35) - X(0)}" height="34" rx="6" fill="${D.vio}" opacity=".9"/>`;
  s += T(X(0) + 6, 16, 'set -a; . app.env', { fs: 13.5, c: 'vio', mono: true });
  s += `<rect x="${X(0.4)}" y="26" width="${X(4.4) - X(0.4)}" height="34" rx="6" fill="${D.dv}" opacity=".8"/>`;
  s += T((X(0.4) + X(4.4)) / 2, 49, 'dựng ảnh… (4 s) — dùng env ĐÃ NẠP', { fs: 14.5, a: 'middle', b: true, c: '#04111c' });
  s += `<circle cx="${X(4.5)}" cy="43" r="9" fill="${D.grn}"/>` + T(X(4.5) + 14, 49, 'compose up -d', { fs: 14, c: 'grn', mono: true });
  s += `<circle cx="${X(1)}" cy="114" r="9" fill="${D.amb}"/>` + T(X(1) + 16, 120, '>> app.env  GIPHY_API_KEY="xxxx12345"', { fs: 14.5, c: 'amb', mono: true });
  s += A(X(1), 104, X(1), 70, { c: 'amb', dash: true, sw: 2 }) + T(X(1) + 10, 90, 'quá muộn: env đã nạp ở giây 0', { fs: 13.5, c: 'red' });
  s += R(X(4.5), 176, X(6.9) - X(4.5), 34, { c: 'red', r: 6, fill: 'rgba(255,92,108,.14)' }) + T(X(4.5) + 10, 199, 'GIPHY_API_KEY=[]  (rỗng)', { fs: 14, c: 'red', mono: true, b: true });
  s += `<path d="M${X(0)} 238 L${X(6.9)} 238" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 1, 2, 3, 4, 5, 6].forEach((t) => { s += `<path d="M${X(t)} 232 L${X(t)} 244" stroke="${D.dim}" stroke-width="2"/>` + T(X(t), 262, `${t} s`, { fs: 13.5, a: 'middle', c: 'mu', mono: true }); });
  return sv(1150, 270, s);
};

/* Slide 9 — lúc DỰNG vs lúc CHẠY */
const haiLuc = () => {
  let s = '';
  s += R(0, 0, 520, 250, { c: 'vio', r: 14, fill: 'rgba(167,139,250,.06)' });
  s += T(20, 32, '🔨 LÚC DỰNG — máy nhà / CI', { fs: 17, b: true, c: 'vio' });
  s += T(20, 64, K_CU + ' next build', { fs: 13.5, mono: true, c: 'tx' });
  s += T(20, 100, 'bundler THAY chữ process.env.NEXT_PUBLIC_…', { fs: 15, c: 'tx' });
  s += T(20, 124, 'bằng CHUỖI "khoa-CU-12345"', { fs: 15, c: 'amb', b: true });
  s += R(20, 146, 480, 46, { c: 'amb', r: 8, fill: '#16130a' }) + T(260, 175, '.next/static/…/page-12c1e399….js', { fs: 14.5, a: 'middle', mono: true, c: 'amb' });
  s += T(20, 226, 'tên biến không còn trong gói — chỉ còn giá trị', { fs: 14, c: 'mu' });
  s += A(528, 170, 624, 170, { c: 'dv' }) + T(576, 156, 'tạo tác', { fs: 13.5, a: 'middle', c: 'dv' });
  s += R(630, 0, 520, 250, { c: 'grn', r: 14, fill: 'rgba(63,185,80,.06)' });
  s += T(650, 32, '🚀 LÚC CHẠY — VPS', { fs: 17, b: true, c: 'grn' });
  s += T(650, 64, 'API_URL=… NEXT_PUBLIC_GIPHY_KEY=khoa-MOI next start', { fs: 13, mono: true, c: 'tx' });
  s += T(650, 100, '✓ server đọc process.env.API_URL', { fs: 15, c: 'grn' });
  s += T(674, 124, 'MỖI request ⇒ đổi env + restart là ăn', { fs: 14, c: 'mu' });
  s += T(650, 160, '✗ trình duyệt tải page-12c1e399….js', { fs: 15, c: 'red' });
  s += T(674, 184, 'vẫn "khoa-CU-12345" — env lúc chạy vô nghĩa', { fs: 14, c: 'mu' });
  s += T(650, 226, 'muốn đổi ⇒ DỰNG LẠI + deploy lại', { fs: 15, c: 'amb', b: true });
  return sv(1150, 252, s);
};

/* Slide 24 — xoay khoá ký bốn giai đoạn */
const bonGiaiDoan = () => {
  const x0 = 190, cw = 235;
  const X = (i) => x0 + i * cw;
  let s = '';
  ['GĐ 1', 'GĐ 2 — thêm', 'GĐ 3 — đổi thứ tự', 'GĐ 4 — bỏ cũ'].forEach((t, i) => {
    s += T(X(i) + cw / 2, 22, t, { fs: 16, a: 'middle', b: true, c: i === 3 ? 'red' : 'dv' });
    s += `<path d="M${X(i)} 34 L${X(i)} 300" stroke="${D.bd}" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  });
  s += `<path d="M${X(4)} 34 L${X(4)} 300" stroke="${D.bd}" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  const bar = (y, a, b, c, txt) => `<rect x="${X(a) + 6}" y="${y}" width="${X(b) - X(a) - 12}" height="30" rx="6" fill="${D[c]}" opacity=".85"/>` + T((X(a) + X(b)) / 2, y + 21, txt, { fs: 14, a: 'middle', b: true, c: '#07101a' });
  s += T(0, 70, 'KÝ bằng', { fs: 15, b: true, c: 'tx' });
  s += bar(50, 0, 2, 'amb', 'k0801 (cũ)') + bar(50, 2, 4, 'grn', 'k0929 (mới)');
  s += T(0, 124, 'CHẤP NHẬN', { fs: 15, b: true, c: 'tx' });
  s += bar(96, 0, 3, 'amb', 'k0801') + bar(130, 1, 4, 'grn', 'k0929');
  s += T(0, 206, 'token cũ', { fs: 15, b: true, c: 'amb' });
  s += bar(188, 0, 3, 'amb', 'HỢP LỆ') + `<rect x="${X(3) + 6}" y="188" width="${cw - 12}" height="30" rx="6" fill="rgba(255,92,108,.18)" stroke="${D.red}" stroke-width="2"/>` + T(X(3) + cw / 2, 209, 'TỪ CHỐI (đúng lúc)', { fs: 14, a: 'middle', b: true, c: 'red' });
  s += T(0, 252, 'token mới', { fs: 15, b: true, c: 'grn' });
  s += bar(234, 2, 4, 'grn', 'HỢP LỆ');
  s += T(X(3) - 6, 286, '⏳ chờ ≥ tuổi thọ token dài nhất (vd 7 ngày)', { fs: 14, a: 'end', c: 'mu' });
  return sv(1150, 300, s);
};

export const slides = S([
  cover({ t: 'Chương 4 — Cấu hình và bí mật', sub: 'cấu hình sống ngoài tạo tác · lúc dựng vs lúc chạy · .env không phải một định dạng · bí mật trong lịch sử git · xoay bí mật không gián đoạn', chap: 'CHƯƠNG 4' }),

  { t: 'Bản đồ chương: thứ KHÁC nhau giữa các máy', body: mindmap('Cấu hình', 'cùng tạo tác · khác tệp .env', [
    { t: '4.1 Sống ngoài tạo tác', d: '12-factor III · /opt/app/.env · rsync loại .env* · thiếu biến thì dừng', c: 'blu' },
    { t: '4.2 Lúc dựng vs lúc chạy', d: 'NEXT_PUBLIC_* bị nướng · khoá GIPHY · ARG lộ trong history · /proc/PID/environ', c: 'vio' },
    { t: '4.3 .env nhiều phương ngữ', d: 'bash · systemd · docker · compose · node — # $ nháy export CRLF', c: 'amb' },
    { t: '4.4 Bí mật trong git', d: 'git log -S · gitleaks · filter-repo · xoay trước, dọn sau', c: 'red' },
    { t: '4.5 Xoay không gián đoạn', d: 'ký 1 khoá, nhận cả danh sách · kid · hai user CSDL · token cũ phải 401', c: 'grn' },
    { t: 'Chuyện thật', d: 'khoá GIPHY nướng lúc build ⇒ 403 · thêm biến giữa deploy ⇒ container không thấy', c: 'tea' },
  ]) },

  /* ───────────── 4.1 ───────────── */
  { t: 'Một tạo tác, nhiều môi trường', body: `
    ${motTaoTac()}
    ${two(
      box('bad', '<b>.env đi TRONG tạo tác</b> ⇒ mỗi môi trường một bản dựng; thứ bạn thử ở staging không phải thứ lên production — và mật khẩu thật nằm trong mọi bản sao của ảnh.'),
      box('good', '<b>.env đứng NGOÀI</b> ⇒ dựng một lần, chạy mọi nơi; đổi thiết lập = sửa một tệp trên máy chủ + khởi động lại, không cần dựng lại.'))}` },

  { t: 'Deploy, đổi cấu hình, lùi bản: đo cả ba', body: two(
    `<div class="c-code" style="font-size:14.5px;white-space:pre;line-height:1.5">/srv/app/
├── phat-hanh/
│   ├── 2026-08-24-0902-c1d773/
│   │   └── .env  → /srv/app/chung/.env
│   └── 2026-08-24-1147-0f92aa/
│       └── .env  → /srv/app/chung/.env
├── hien-tai → phat-hanh/…-0f92aa
└── chung/        <span style="color:#6a9955"># deploy KHÔNG đụng</span>
    ├── .env
    └── tai-len/</div>
    ${sh([
      ['ln -sfn /srv/app/chung/.env "$BAN/.env"', 'SAU giải nén, TRƯỚC tráo'],
      ['ln -sfn /srv/app/chung/tai-len "$BAN/tai-len"', ''],
    ], { fs: 14 })}`,
    `${term(['  v1 doc duoc: DATABASE_URL=postgres://prod', '  --- deploy v2 (doi symlink) ---', '  v2 doc duoc: DATABASE_URL=postgres://prod', '  --- doi cau hinh o CHUNG ---', '= v2 doc duoc: DATABASE_URL=postgres://prod-MOI', '  --- LUI ve v1 ---', '+ v1 doc duoc: DATABASE_URL=postgres://prod-MOI', '+   ← cau hinh KHONG bi lui theo'], { title: 'đo ở Bài 4.1 — v1/v2 đọc .env qua symlink', fs: 14 })}
    ${box('warn', 'Lùi bản <b>không</b> lùi cấu hình. Thường là đúng — nhưng nếu v2 đổi tên <code>DB_URL</code> → <code>DATABASE_URL</code> thì v1 lùi về tìm không thấy. Đổi cấu hình phải <b>cộng thêm</b>: thêm tên mới, deploy mã đọc cả hai, deploy SAU mới bỏ tên cũ.')}`, 'r') },

  { t: 'Loại .env* khỏi rsync: .env sống qua deploy', body: two(
    term(['# vps: /opt/datlich/repo/.env = DATABASE_URL="postgres://app@db/datlich"', '# laptop: repo/.env = DATABASE_URL="postgres://localhost/dev"', '$ rsync -a --delete ./ vps:/opt/datlich/repo/', '! (vps) repo/.env sau: DATABASE_URL="postgres://localhost/dev"', '  . .. .env .env.example .env.local src', "$ rsync -a --delete --exclude='.env*' ./ vps:/opt/datlich/repo/", '= (vps) repo/.env sau: DATABASE_URL="postgres://app@db/datlich"', '  . .. .env .env.example src'], { title: 'Mac (openrsync) → VPS thí nghiệm — output thật', fs: 13.5 }),
    `${box('bad', 'Không loại trừ: <code>.env</code> của laptop <b>ghi đè</b> .env production — web trỏ vào <code>localhost/dev</code> ngay lần deploy đó.')}
    ${box('info', '<b>Chuyện thật (cuongthai.com):</b> env production sống ở <code>/opt/&lt;app&gt;/.env</code>, NGOÀI thư mục repo; <code>deploy.sh</code> nạp nó mỗi lần deploy, rsync có <code>--exclude=\'.env*\'</code> ⇒ giá trị sống qua mọi deploy.')}
    ${box('tip', 'Loại trừ theo mẫu <code>.env*</code> nuốt cả <code>.env.example</code> — vô hại, nhưng đừng ngạc nhiên khi tệp mẫu không lên máy chủ.')}`, 'l') },

  { t: 'Thêm biến giữa lúc deploy: container không thấy', body: `
    ${giuaDeploy()}
    ${two(
      term(['$ docker exec dv04-web-1 sh -c \'echo "[$GIPHY_API_KEY]"\'', '! []', '$ docker compose restart web', '! []                   # restart KHÔNG nạp lại env', '$ set -a; . ./app.env; set +a; docker compose up -d web', ' Container dv04-web-1 Started', '= [xxxx12345]          # tạo LẠI container'], { title: 'Docker 29.8 + Compose v5.5 — output thật', fs: 13.5 }),
      box('warn', 'Env của container chốt lúc <b>TẠO</b> container. <code>restart</code> chạy lại đúng container cũ; phải <code>up -d</code> với env đã nạp lại (Compose thấy cấu hình đổi ⇒ tạo lại). Chuyện thật: thêm biến vào <code>/opt/…/.env</code> khi deploy đang chạy ⇒ lần deploy đó <b>không</b> mang biến theo.'), 'l')}` },

  { t: 'Thiếu biến thì DỪNG, đừng chạy với undefined', body: two(
    `${code(`// server.js — dòng đầu tiên, TRƯỚC khi nghe cổng
const BAT_BUOC = ['DATABASE_URL', 'JWT_SECRET', 'R2_BUCKET'];
const thieu = BAT_BUOC.filter(k => !process.env[k]);
if (thieu.length) {
  console.error('Thieu bien moi truong bat buoc:',
                thieu.join(', '));
  process.exit(1);   // khác 0 ⇒ không tráo
}`, 'javascript')}
    ${term(['$ env -i DATABASE_URL=postgres://app@db/datlich node server.js', '! Thieu bien moi truong bat buoc: JWT_SECRET, R2_BUCKET', '! exit=1', '$ env -i DATABASE_URL=… JWT_SECRET=xxxx \\', '    R2_BUCKET=anh node server.js', '= dang nghe cong 3000'], { title: 'Mac, Node 22.21 — output thật', fs: 13.5 })}`,
    `${sh([
      ['# có trong .env.example mà THIẾU trên máy chủ', ''],
      ["comm -23 <(grep -oE '^[A-Z_]+' .env.example | sort -u) \\", ''],
      ["  <(ssh vps \"grep -oE '^[A-Z_]+' /opt/datlich/.env\" | sort -u)", ''],
      ['# chỉ có trên máy chủ, không ai ghi lại: comm -13', ''],
    ], { fs: 13.5, so: false })}
    ${term(['$ comm -23 …', '! GIPHY_API_KEY', '$ comm -13 …', '+ OLD_SMTP_PASS'], { title: 'laptop ↔ VPS thí nghiệm — output thật', fs: 13.5 })}
    ${box('good', 'Thiếu biến ⇒ <b>deploy hỏng</b> (bản cũ vẫn chạy) thay vì <b>web hỏng</b> (500 cho mọi người).')}`, 'l') },

  { t: 'Cái gì là cấu hình — và ai thắng khi trùng', body: two(
    cards([
      { ic: '✓', t: 'Khác nhau giữa các nơi', d: 'URL CSDL, tên bucket, mức log, số worker, cờ tính năng.', c: 'grn' },
      { ic: '🔑', t: 'Bí mật', d: 'Mật khẩu, token, khoá ký — tập con của cấu hình, xử lý ngặt hơn (4.4).', c: 'amb' },
      { ic: '✗', t: 'Giống nhau mọi nơi', d: 'Tuyến, hằng số timeout, luật kiểm dữ liệu ⇒ để trong <strong>mã</strong>.', c: 'red' },
      { ic: '✗', t: 'Chỉ có một đáp án đúng', d: 'Sai là vỡ ⇒ thuộc về mã, nơi được review và test.', c: 'red' },
    ], 2),
    `${table(['Compose: cùng một biến đặt ở…', 'Thắng?'], [
      ['<code>docker compose run -e X=…</code>', '+1 — cao nhất'],
      ['<code>environment:</code> lấy từ shell / tệp <code>.env</code> dự án (<code>\${X}</code>)', '2'],
      ['<code>environment:</code> ghi thẳng giá trị', '3'],
      ['<code>env_file:</code>', '4'],
      ['<code>ENV</code> trong Dockerfile', '-5 — thấp nhất'],
    ], { sm: true })}
    ${box('info', 'Thứ tự theo tài liệu Docker Compose (09/2026). Có giá trị "lạ" trong container ⇒ đi từ trên xuống, đừng đoán.')}`, 'r') },

  /* ───────────── 4.2 ───────────── */
  { t: 'Hai thời điểm: lúc DỰNG và lúc CHẠY', body: `
    ${haiLuc()}
    ${table(['Framework', 'Tiền tố bị nướng lúc dựng', 'Đọc lúc chạy (chỉ phía server)'], [
      ['Next.js', '!<code>NEXT_PUBLIC_*</code>', '<code>process.env.X</code> trong server component / API'],
      ['Vite', '!<code>VITE_*</code>', 'không có — gói là tệp tĩnh'],
      ['Create React App', '!<code>REACT_APP_*</code>', 'không có — gói là tệp tĩnh'],
    ], { sm: true })}` },

  { t: 'Đổi NEXT_PUBLIC_* rồi restart: vẫn khoá cũ', body: two(
    term(['$ ' + K_CU + ' next build', '$ grep -rl "khoa-CU-12345" .next/static', '+ .next/static/chunks/app/page-12c1e399c4ed7646.js', '$ grep -rc "NEXT_PUBLIC_GIPHY_KEY" .next/static | grep -v ":0"', '# (không còn tên biến nào — chỉ còn giá trị)', '$ API_URL=https://api.MOI.example \\', '  ' + K_MOI + ' next start', '= server doc luc CHAY: https://api.MOI.example', '  trinh duyet tai /_next/static/chunks/app/page-12c1e399c4ed7646.js:', '!     khoa-CU-12345'], { title: 'Next.js 15.5 trên Mac — output thật', fs: 13.5 }),
    `${term(['$ ' + K_MOI + ' next build', '$ next start', '  /_next/static/chunks/app/page-58311785cffc528f.js', '= khoa-MOI-12345'], { title: 'chỉ DỰNG LẠI mới đổi — output thật', fs: 13.5 })}
    ${box('warn', 'Không lỗi, không log nào báo. Bạn sửa <code>.env</code>, restart, thử — thấy giá trị CŨ, và đi kiểm nhầm chỗ ("restart không ăn").')}
    ${box('tip', 'Tên tệp gói đổi (<code>12c1e…</code> → <code>58311…</code>) vì nội dung đổi: đó là dấu hiệu giá trị nằm TRONG tạo tác.')}`, 'l') },

  { t: 'Khoá bên thứ ba đi qua backend, không qua trình duyệt', body: diagram({
    w: 1160, h: 470,
    nodes: [
      { id: 'b1', x: 0, y: 20, w: 300, h: 96, t: 'Trình duyệt', d: 'gói JS chứa NEXT_PUBLIC_GIPHY_KEY\nai mở DevTools cũng đọc được', ic: '🌐', c: 'red' },
      { id: 'g1', x: 820, y: 20, w: 340, h: 96, t: 'GIPHY API', d: 'khoá thiếu lúc build ⇒ thư viện dùng\nkhoá demo đã bị thu hồi ⇒ 403', ic: '🎞', c: 'red' },
      { id: 'b2', x: 0, y: 250, w: 300, h: 96, t: 'Trình duyệt', d: 'gọi /api/v1/gifs của CHÍNH bạn\nkhông cầm khoá nào', ic: '🌐', c: 'grn' },
      { id: 'be', x: 410, y: 250, w: 320, h: 96, t: 'Backend (có đăng nhập)', d: 'đọc GIPHY_API_KEY lúc CHẠY\n+ lưu đệm phản hồi', ic: '⚙️', c: 'dv' },
      { id: 'g2', x: 840, y: 250, w: 320, h: 96, t: 'GIPHY API', d: 'khoá chỉ sống trên máy chủ', ic: '🎞', c: 'grn' },
      { id: 'kq', x: 120, y: 390, w: 920, h: 64, t: 'Xoay khoá = sửa /opt/…/.env + tạo lại container — không dựng lại, không lộ', d: 'mẫu này ở src/routes/gifs.routes.ts của dự án thật', c: 'grn' },
    ],
    edges: [
      { from: 'b1', to: 'g1', t: '✗ khoá nằm trong gói', c: 'red' },
      { from: 'b2', to: 'be', t: 'cookie phiên', c: 'grn' },
      { from: 'be', to: 'g2', t: 'khoá', c: 'dv' },
    ],
  }) },

  { t: 'ARG lộ trong docker history, secret mount thì không', body: two(
    `${yaml([
      ['FROM alpine:latest', ''],
      ['ARG NPM_TOKEN', 'lúc DỰNG — vào history!'],
      ['ENV NODE_ENV=production', 'nướng vào ảnh, ai kéo cũng đọc'],
      ['RUN echo "token dai ${#NPM_TOKEN}" > /dung.txt', ''],
      ['RUN --mount=type=secret,id=npmrc \\', 'bí mật lúc dựng: đúng cách'],
      ['    cat /run/secrets/npmrc | wc -c > /secret-len.txt', ''],
    ], { lang: 'docker', fs: 14 })}
    ${sh([
      ['docker build --build-arg NPM_TOKEN=xxxx12345-bi-mat-that \\', ''],
      ['  --secret id=npmrc,src=npmrc.txt -t dv04-argthu .', ''],
    ], { fs: 14, so: false })}`,
    `${term(['$ docker history --no-trunc \\', '    --format "{{.CreatedBy}}" dv04-argthu', '! RUN |1 NPM_TOKEN=xxxx12345-bi-mat-that /bin/sh …', '! RUN |1 NPM_TOKEN=xxxx12345-bi-mat-that /bin/sh …', 'ENV NODE_ENV=production', '! ARG NPM_TOKEN=xxxx12345-bi-mat-that', '$ docker run --rm dv04-argthu sh -c \\', '    "cat /secret-len.txt; ls /run/secrets"', '= 22', 'ls: /run/secrets: No such file or directory'], { title: 'Docker 29.8 — output thật', fs: 13 })}
    ${box('bad', '<code>--build-arg</code> <b>không</b> phải cơ chế bí mật: giá trị nằm trong cấu hình ảnh, ai kéo được ảnh là đọc được.')}`, 'r') },

  { t: '/proc/PID/environ: tiến trình thật sự thấy gì', body: two(
    `${term(['$ tr "\\0" "\\n" < /proc/$PID/environ | grep ^DATABASE_URL', 'DATABASE_URL=postgres://app@db/datlich', '$ sed -i "s#db/#db-moi/#" p.env; grep DATABASE p.env', '+ DATABASE_URL="postgres://app@db-moi/datlich"', '$ tr "\\0" "\\n" < /proc/$PID/environ | grep ^DATABASE_URL', '! DATABASE_URL=postgres://app@db/datlich      # vẫn CŨ', "$ … | awk -F= '/^DB_PASS/{print \"do dai:\", length($2)}'", '= do dai: 31', '$ su khach -c "cat /proc/$PID/environ"', '! cat: /proc/462/environ: Permission denied'], { title: 'VPS thí nghiệm (Ubuntu 24.04) — output thật', fs: 13.5 })}`,
    `${steps([
      ['<code>/proc/&lt;pid&gt;/environ</code> = env lúc tiến trình <b>khởi động</b>', 'sửa .env sau đó không đổi được nó'],
      ['Các mục ngăn nhau bằng byte <code>\\0</code>', 'nên cần <code>tr "\\0" "\\n"</code>'],
      ['In <b>độ dài</b>, đừng in bí mật', 'không lọt vào lịch sử shell'],
      ['Chỉ chủ tiến trình và root đọc được', 'người dùng khác: Permission denied'],
      ['Trong container: <code>docker exec … printenv X</code>', 'cùng câu trả lời, từ bên trong'],
    ])}`, 'l') },

  /* ───────────── 4.3 ───────────── */
  { t: 'Một tệp .env, năm bộ nạp, năm cách đọc', body: `<style>.t14 .c-t.sm td,.t14 .c-t.sm th{padding:4px 9px;font-size:14.5px}</style><div class="t14">${table(['Dòng trong tệp', 'bash <code>source</code>', 'systemd <code>EnvironmentFile=</code>', 'docker <code>--env-file</code>', 'compose <code>env_file:</code>', 'node <code>--env-file</code>'], [
      ['<code>KHOANG=xin chao</code>', '-lỗi "chao: command not found"; KHÔNG có biến', 'xin chao', 'xin chao', 'xin chao', 'xin chao'],
      ['<code>NHAY_KEP="co&nbsp; hai khoang"</code>', 'co&nbsp; hai khoang', 'co&nbsp; hai khoang', '!"co&nbsp; hai khoang" (giữ nháy)', 'co&nbsp; hai khoang', 'co&nbsp; hai khoang'],
      ["<code>NHAY_DON='gia$tri'</code>", 'gia$tri', 'gia$tri', "!'gia$tri' (giữ nháy)", 'gia$tri', 'gia$tri'],
      ['<code>DAU_THANG=mat#khau</code>', 'mat#khau', 'mat#khau', 'mat#khau', 'mat#khau', '-mat (cắt ở #)'],
      ['<code>DOLLAR=$HOME/duong-dan</code>', '!/home/deploy/duong-dan', '$HOME/duong-dan', '$HOME/duong-dan', '!/home/an/… (HOME máy chạy compose)', '$HOME/duong-dan'],
      ['<code>NOI=${DON_GIAN}-them</code>', '!abc-them', '${DON_GIAN}-them', '${DON_GIAN}-them', '!abc-them', '${DON_GIAN}-them'],
      ['<code>export CO_EXPORT=co-export</code>', 'co-export', '-bỏ qua + cảnh báo', '-TỪ CHỐI CẢ TỆP', 'co-export', 'co-export'],
      ['<code>CRLF=windows\\r</code>', '-windows\\r (giữ \\r)', 'windows', 'windows', 'windows', 'windows'],
    ], { sm: true })}</div>
    ${box('info', 'Đo thật 29/09/2026, CÙNG một tệp 9 dòng: bash 5.2, systemd 255 (VPS thí nghiệm), Docker 29.8, Compose v5.5, Node 22.21 (Mac). Ô vàng/đỏ = khác số đông; tên biến viết gọn. <b>Không có đặc tả chung cho .env.</b>')}` },

  { t: 'Sai GIÁ TRỊ chứ không báo lỗi: # và $', body: two(
    `${term(['# DB_PASS=mat#khau-dai-32-ky-tu-xxxxxxxxx  (không nháy)', '$ bash: set -a; . p.env; …  do dai', '= do dai: 31', '$ node --env-file=p.env -e "…DB_PASS.length"', '! node --env-file  do dai: 3', '# DB_PASS="mat#khau-dai-32-ky-tu-xxxxxxxxx"  (nháy kép)', '$ node --env-file=q.env -e "…"', '= co nhay kep      do dai: 31'], { title: 'dấu # — output thật', fs: 13.5 })}
    ${term(['# A="$y"   (nháy KÉP, $y không tồn tại)', '! bash nhay kep $y  do dai: 0', "# A='$y'   (nháy ĐƠN)", '= bash nhay don $y  => [$y]'], { title: 'dấu $ dưới bash — output thật', fs: 13.5 })}`,
    `${box('bad', 'Mật khẩu bị cắt còn 3 ký tự hay bị bung thành rỗng vẫn là một chuỗi <b>trông hợp lệ</b>. App khởi động, kết nối, bị từ chối — và cuộc điều tra đi về CSDL, mạng, người dùng… cuối cùng mới tới cái tệp <i>trông vẫn đúng</i>.')}
    ${box('warn', 'Bộ sinh ngẫu nhiên và base64 nhả ra <code>#</code>, <code>$</code>, <code>/</code>, <code>=</code> thường xuyên. Sinh bí mật cho .env: <code>openssl rand -hex 32</code> — chỉ 0-9a-f, không bộ nạp nào hiểu sai.')}`, 'l') },

  { t: 'CRLF: ký tự \\r vô hình ở cuối giá trị', body: two(
    term(['$ file win.env', '! win.env: ASCII text, with CRLF line terminators', '$ set -a; . ./win.env; set +a', '$ printf %s "$DB_NAME" | od -c', '0000000   d   a   t   l   i   c   h  \\r', '! KHONG khop: do dai 8 (mong doi 7)', "  ⇒ ten CSDL that la: 'datlich\\r'", '$ sed -i "s/\\r$//" win.env; file win.env', '= win.env: ASCII text', '= khop, do dai 7'], { title: 'VPS thí nghiệm (bash 5.2) — output thật', fs: 14 }),
    `${box('bad', 'Tệp .env soạn trên Windows (Notepad, hoặc git <code>core.autocrlf=true</code>) mang <code>\\r\\n</code>. bash giữ <code>\\r</code> trong giá trị ⇒ <code>database "datlich\\r" does not exist</code> — lỗi mà mắt không thấy ký tự sai.')}
    ${table(['Máy', 'Việc cần làm'], [
      ['Windows', '<code>git config --global core.autocrlf input</code>; VS Code: góc dưới chọn <b>LF</b>'],
      ['WSL / Linux', '<code>sed -i \'s/\\r$//\' .env</code> · kiểm bằng <code>file .env</code>'],
      ['macOS', '<code>sed -i \'\' \'s/\\r$//\' .env</code> (BSD sed cần <code>\'\'</code>)'],
      ['Kho mã', '<code>.gitattributes</code>: <code>*.env* text eol=lf</code>'],
    ], { sm: true })}`, 'l') },

  { t: 'docker --env-file: không nháy, không export', body: two(
    `${term(['$ docker run --rm --env-file test.env ubuntu:24.04 bash /in.sh', "! docker: --env-file: invalid env file (test.env): variable 'export CO_EXPORT' contains whitespaces", '# bỏ dòng export rồi chạy lại:', '! TRONG_NHAY_KEP   ["co  hai khoang"]', "! NHAY_DON         ['gia$tri']", '  CO_DOLLAR        [$HOME/duong-dan]', '  CO_CRLF          [windows]'], { title: 'Docker 29.8 — output thật', fs: 13.5 })}
    ${term(['$ systemctl start thu-env    # EnvironmentFile=/opt/datlich/test.env', "+ thu-env.service: Ignoring invalid environment assignment 'export CO_EXPORT=co-export'", '  TRONG_NHAY_KEP   [co  hai khoang]', '  CO_DOLLAR        [$HOME/duong-dan]', '= Result=success'], { title: 'systemd 255 — output thật', fs: 13.5 })}`,
    `${steps([
      ['<code>docker --env-file</code>: một dòng sai là <b>cả tệp</b> bị từ chối', 'và dấu nháy thành một phần giá trị'],
      ['systemd: bỏ qua dòng lạ, ghi <b>một dòng</b> vào journal', 'dịch vụ vẫn chạy, thiếu biến'],
      ['compose <code>env_file:</code>: bung <code>$HOME</code> từ máy <b>chạy lệnh compose</b>', 'muốn chữ $ thật: viết <code>$$</code>'],
      ['bash: <code>export</code> thì hiểu, dấu cách thì chạy thành lệnh', 'tệp .env là một script!'],
    ])}`, 'l') },

  { t: 'Luật viết .env sống qua mọi bộ nạp', body: two(
    `${sh([
      ['# /opt/datlich/.env — chmod 600, chủ là người chạy dịch vụ', ''],
      ['DATABASE_URL="postgres://app@db:5432/datlich"', 'luôn nháy KÉP'],
      ['JWT_SECRET="3f9c…e1"', 'openssl rand -hex 32'],
      ['R2_BUCKET="anh-datlich"', ''],
      ['LOG_LEVEL="info"', ''],
      ['TLS_KEY_FILE="/opt/datlich/tls/khoa.pem"', 'nhiều dòng ⇒ ĐƯỜNG DẪN'],
      ['# KHÔNG: export · ${X} · khoảng trắng quanh = · CRLF', ''],
    ], { fs: 14.5 })}
    ${term(['$ ./so-hai-bo-nap.sh .env', '= hai bo nap DONG Y tren 3 bien', '$ ./so-hai-bo-nap.sh xau.env      # DB_PASS=mat#khau, DUONG=$HOME/x', '! < DB_PASS=mat', '! < DUONG=$HOME/x', '  ---', '+ > DB_PASS=mat#khau', '+ > DUONG=/home/an/x'], { title: 'node --env-file (<) vs bash source (>) — output thật', fs: 13.5 })}
    ${box('warn', 'Nháy kép <b>không</b> chặn bash bung <code>$</code>. Giá trị buộc phải có <code>$</code> thật mà tệp có thể bị <code>source</code> ⇒ đừng để nó trong .env.')}`,
    `${cards([
      { ic: '1', t: 'Nháy kép mọi giá trị', d: 'bỏ cả lớp lỗi dấu cách và <code>#</code>.', c: 'grn' },
      { ic: '2', t: 'Không nối chuỗi', d: '<code>${X}</code>: bung chỗ này, chữ chỗ kia.', c: 'blu' },
      { ic: '3', t: 'Không <code>export</code>', d: 'docker từ chối cả tệp.', c: 'amb' },
      { ic: '4', t: 'Bí mật chỉ hex', d: 'không <code>#</code> <code>$</code> nháy.', c: 'vio' },
    ], 2)}`, 'l') },

  /* ───────────── 4.4 ───────────── */
  { t: 'Xoá tệp không xoá lịch sử', body: two(
    term(['# commit 1: them .env · commit 2: git rm --cached .env + .gitignore', '$ git log --all --format="%h %s" -- .env', '  08fe263 bo .env khoi kho, them gitignore', '  d639afe them cau hinh', '$ git show HEAD~1:.env | head -2', '! DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod', '! STRIPE_KEY=sk_live_12345xxxx', '$ git log -p -S "MatKhauThatSu" --format="%h %s" \\', '    | grep -E "^[0-9a-f]{7} |DATABASE"', '08fe263 bo .env khoi kho, them gitignore', '-DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod', 'd639afe them cau hinh', '+DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod'], { title: 'kho thử trên Mac, git 2.51 — output thật', fs: 13.5 }),
    `${table(['Lệnh', 'Trả lời câu hỏi'], [
      ['<code>git log --all -- .env</code>', 'tệp này TỪNG được theo dõi?'],
      ['<code>git log -p -S "chuỗi"</code>', 'commit nào THÊM/BỎ chuỗi này (pickaxe)'],
      ['<code>git log -G "regex"</code>', 'commit nào có dòng đổi khớp regex'],
      ['<code>git show &lt;commit&gt;:.env</code>', 'đọc nguyên tệp — việc kẻ tấn công làm'],
    ], { sm: true })}
    ${box('bad', '<code>.gitignore</code> chỉ ngăn LẦN SAU. Commit cũ vẫn còn trong mọi bản clone, fork, bản sao lưu và cache CI.')}`, 'l') },

  { t: 'gitleaks: cây làm việc sạch, lịch sử thì không', body: two(
    term(['$ gitleaks dir .              # chỉ các tệp HIỆN CÓ', '= INF no leaks found', '$ gitleaks git . --redact -v    # TOÀN BỘ lịch sử', '! Finding:     JWT_SECRET=REDACTED', '  RuleID:      generic-api-key', '  File:        .env', '  Commit:      d639afe9b32fb61648cc19723320854e099abca1', '  INF 3 commits scanned.', '! WRN leaks found: 1', '$ echo $?', '! 1'], { title: 'gitleaks 8.30.1 — output thật', fs: 13.5 }),
    `${box('warn', '<b>Máy quét có điểm mù.</b> Cùng tệp đó có <code>postgres://app:MatKhauThatSu123@…</code> — gitleaks <b>không</b> bắt (không có luật cho mật khẩu trong URL). Quét xanh ≠ không có bí mật.')}
    ${sh([
      ['gitleaks git . --redact -v', 'toàn lịch sử, che giá trị'],
      ['gitleaks git . --log-opts="--since=2026-09-01"', 'một khoảng commit'],
      ['gitleaks dir . --no-banner', 'cây làm việc'],
      ['gitleaks git --pre-commit --staged', 'dùng trong hook'],
    ], { fs: 14 })}
    ${box('tip', 'Tiếp quản một dự án: chạy <code>gitleaks git</code> MỘT lần trên toàn lịch sử trước khi làm gì khác.')}`, 'l') },

  { t: 'Lộ khoá: XOAY trước, dọn lịch sử sau', body: two(
    `${steps([
      ['<b>Xoay</b>: thu hồi khoá cũ ở nhà cung cấp, cấp mới, deploy', 'rồi THỬ khoá cũ — phải bị từ chối'],
      ['<b>Soi log</b> truy cập từ lúc commit tới lúc xoay', '"đã kiểm" tốt hơn "không biết"'],
      ['<b>Dọn lịch sử</b> bằng <code>git filter-repo</code>', 'mọi hash đổi ⇒ cả nhóm clone lại'],
      ['<b>Chặn lần sau</b>: hook + CI + push protection', 'slide sau'],
    ])}
    ${box('good', 'Bí mật lộ hết nguy hiểm khi nó hết <b>HIỆU LỰC</b> — không phải khi nó hết <b>NHÌN THẤY</b>.')}`,
    term(['$ git filter-repo --invert-paths --path .env --force', 'New history written in 0.10 seconds; …', '$ git log --all --oneline -- .env', '= (rỗng)', '$ git log --oneline', '  7ec3d00 bo .env khoi kho, them gitignore', '  35bf8af khoi tao', '# bản clone cũ của bạn cùng nhóm:', '$ git show d639afe:.env | head -1', '! DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod'], { title: 'git-filter-repo trên Mac — output thật', fs: 13.5 }), 'r') },

  { t: 'Ba lớp chặn: máy bạn, GitHub, CI', body: `${diagram({
    w: 1160, h: 300,
    nodes: [
      { id: 'dev', x: 0, y: 20, w: 330, h: 110, t: 'pre-commit hook (máy bạn)', d: 'nhanh, nhưng KHÔNG đi theo clone\n--no-verify là qua', ic: '💻', c: 'amb' },
      { id: 'gh', x: 415, y: 20, w: 330, h: 110, t: 'GitHub push protection', d: 'bật mặc định khi push lên kho\nCÔNG KHAI (09/2026) · bỏ qua được', ic: '🛡', c: 'blu' },
      { id: 'ci', x: 830, y: 20, w: 330, h: 110, t: 'Job CI: gitleaks git', d: 'chạy ở nơi người commit KHÔNG\nkiểm soát ⇒ cổng thật', ic: '⚙️', c: 'grn' },
      { id: 'kq', x: 160, y: 200, w: 840, h: 76, t: 'Không lớp nào đủ một mình — và không lớp nào thay được việc XOAY khoá khi đã lọt', d: 'kho riêng tư vẫn cần: nó bị clone, bị fork, bị mở công khai "tạm thời"', c: 'red' },
    ],
    edges: [
      { from: 'dev', to: 'gh', t: 'git push', c: 'amb' },
      { from: 'gh', to: 'ci', t: 'on: push', c: 'blu' },
    ],
  })}
    ${term(['$ git add -f .env.production && git commit -m "cau hinh prod"', '! TU CHOI: dang commit mot tep .env', '$ git commit --no-verify -m "cau hinh prod"', '+ c4ffe2a cau hinh prod          # đi qua, không hỏi', '$ git clone . ../clone-moi && ls ../clone-moi/.git/hooks | grep -c "^pre-commit$"', '! 0'], { title: 'hook pre-commit của Bài 4.4 — output thật', fs: 13.5 })}` },

  { t: 'Bí mật trên máy chủ: 600, và thử đọc', body: two(
    term(['$ stat -c "%a %U:%G" /opt/datlich/.env', '! 644 deploy:deploy', '$ su khach -c "cat /opt/datlich/.env | head -1"', '! DATABASE_URL="x"          # người dùng KHÁC đọc được', '$ chmod 600 /opt/datlich/.env', '$ stat -c "%a %U:%G" /opt/datlich/.env', '= 600 deploy:deploy', '$ su khach -c "cat /opt/datlich/.env"', '= cat: /opt/datlich/.env: Permission denied'], { title: 'VPS thí nghiệm — output thật', fs: 14 }),
    `${table(['Bí mật sống ở…', 'Hợp khi', 'Cái giá'], [
      ['+tệp 600 trên máy chủ, ngoài tạo tác', '1–2 máy chủ (mức nền)', 'văn bản thuần, không ai tự xoay'],
      ['Secrets của CI (GitHub Actions)', 'thứ lần DEPLOY cần: khoá SSH, token registry', 'mọi workflow chạy được đều đọc được'],
      ['Trình quản lý bí mật (Vault…)', 'nhiều bí mật, nhiều máy', 'thêm một thứ phải sống lúc khởi động'],
      ['Mã hoá trong kho (SOPS, git-crypt)', 'cấu hình cần review', 'dời bài toán sang "khoá giải mã ở đâu"'],
    ], { sm: true })}
    ${box('tip', 'Có dịch vụ systemd: <code>EnvironmentFile=</code> cho tệp chỉ root đọc được — systemd đọc TRƯỚC khi hạ quyền, ứng dụng không cần quyền đọc tệp.')}`, 'l') },

  /* ───────────── 4.5 ───────────── */
  { t: 'Xoay khoá ký bốn giai đoạn, không ai bị đá ra', body: `
    ${bonGiaiDoan()}
    ${two(
      box('bad', '<b>Đổi thẳng</b> (GĐ 1 → 4): mọi token đang lưu hành bị từ chối cùng lúc ⇒ cả nghìn người đăng nhập lại, đúng lúc bạn đang làm việc tinh vi.'),
      box('warn', '<b>Khoá đã LỘ</b> thì KHÔNG chờ: làm GĐ 3 + 4 cùng lúc, chấp nhận đá mọi người ra — phiên ký bằng khoá kẻ gian đang cầm là phiên giả mạo được.'))}` },

  { t: 'Ký bằng khoá đầu, kiểm theo kid', body: two(
    `${code(`// SIGNING_KEYS="k0929:…,k0801:…"
// khoá ĐẦU để ký, cả danh sách để kiểm
const keys = process.env.SIGNING_KEYS
  .split(',').map(x => x.split(':'))
  .map(([kid, k]) => ({ kid, k }));

const ky = (sub) => {
  // ghi TÊN khoá vào phần đầu token
  const h = b64({ alg: 'HS256', kid: keys[0].kid });
  const p = b64({ sub });
  return \`\${h}.\${p}.\${hmac(h + '.' + p, keys[0].k)}\`;
};
const kiem = (t) => {
  const [h, p, s] = t.split('.');
  // tra khoá theo kid, không thử lần lượt
  const key = keys.find(x => x.kid === doc(h).kid);
  return !!key && hmac(h + '.' + p, key.k) === s;
};`, 'javascript')}`,
    term(['$ node xoay.mjs', 'GD 1: chi co khoa cu — ky bang k0801', '  token cu:  HOP LE (kid=k0801)', 'GD 2: THEM khoa moi (van ky bang cu) — ky bang k0801', '  token cu:  HOP LE (kid=k0801)', 'GD 3: DOI THU TU (ky bang moi) — ky bang k0929', '= token cu:  HOP LE (kid=k0801)', '= token moi: HOP LE (kid=k0929)', 'GD 4: BO khoa cu — ky bang k0929', '! token cu:  TU CHOI (khong biet kid=k0801)', '= token moi: HOP LE (kid=k0929)', 'DOI THANG (ngay tho): SIGNING_KEYS=k0929:…', '!   token cu: TU CHOI (khong biet kid=k0801)'], { title: 'Mac, Node 22 — output thật', fs: 13.5 }), 'l') },

  { t: 'Mật khẩu CSDL: thêm user mới, đừng đổi user cũ', body: two(
    term(['# 1) đổi THẲNG mật khẩu của user đang dùng', "$ ALTER ROLE app_0801 PASSWORD 'mk-moi-…'   # 02:01:34", '  kết nối MỚI, mật khẩu cũ:', '! FATAL:  password authentication failed for user "app_0801"', '  phien cu mo luc 02:01:33', '+ phien cu VAN chay luc 02:01:38', '# 2) HAI user', "$ CREATE ROLE app_0929 LOGIN PASSWORD '…' IN ROLE datlich_rw", '= app_0801 (bản đang chạy): ghi duoc, id=1', '= app_0929 (bản mới):       ghi duoc, id=2', '$ ALTER ROLE app_0801 NOLOGIN      # sau khi bản cũ tắt hẳn', '! FATAL:  role "app_0801" is not permitted to log in'], { title: 'PostgreSQL 16 (dv04-pg) — output thật, giờ UTC', fs: 13 }),
    `${box('warn', 'Đổi mật khẩu <b>không</b> cắt các phiên đã mở — chúng chạy tiếp tới khi tự đóng. Còn mọi kết nối <b>mới</b> của bản cũ (pool mở thêm, tiến trình restart) thì hỏng ngay.')}
    ${box('good', 'Tráo xanh-lam (Ch3) chạy <b>hai bản cùng lúc</b> ⇒ CSDL phải nhận CẢ HAI tín vật trong cửa sổ đó ⇒ hai user cùng quyền (<code>IN ROLE datlich_rw</code>), khoá user cũ sau.')}
    ${box('tip', 'Muốn cắt hẳn phiên cũ: <code>SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE usename=\'app_0801\'</code>.')}`, 'l') },

  { t: 'Kiểm lần xoay: token cũ PHẢI ra 401', body: two(
    term(['# lấy token TRƯỚC khi xoay:', '$ TOKEN_CU=$(curl -s localhost:19044/dang-nhap)', '# giai doan 3: SIGNING_KEYS=k0929:…,k0801:…', "$ curl -s -o /dev/null -w '%{http_code}\\n' \\", '    -H "Authorization: Bearer $TOKEN_CU" localhost:19044/toi', '= 200', '# giai doan 4: SIGNING_KEYS=k0929:…', '$ curl … (cùng lệnh)', '= 401', '# giai doan 4, nhưng MÁY 2 bị sót: SIGNING_KEYS=k0929:…,k0801:…', '$ curl … (cùng lệnh)', '! 200            ← khoá cũ VẪN sống'], { title: 'máy chủ token thử (Node) — output thật', fs: 13.5 }),
    `${term(['# tìm theo TÊN biến:', '$ grep -rl JWT_SECRET /opt/datlich /home/deploy/bin', '/opt/datlich/.env', '# tìm theo GIÁ TRỊ:', '$ grep -rlF "$GIA_TRI_CU" /opt/datlich /home/deploy/bin', '! /opt/datlich/worker.env', '  /opt/datlich/.env', '! /home/deploy/bin/don-phien.sh'], { title: 'VPS thí nghiệm — output thật', fs: 13.5 })}
    ${box('info', 'Trước khi xoay: tìm theo <b>GIÁ TRỊ</b>, không theo tên — cùng một bí mật hay nằm dưới ba cái tên. Sau khi xoay: một <code>curl</code> với token cũ, đáp án đúng là <code>401</code>.')}`, 'l') },

  { t: 'Bí mật nào xoay thế nào', body: table(['Loại bí mật', 'Ai đang giữ bản sao?', 'Cách xoay', 'Cái bẫy'], [
    ['Mật khẩu CSDL', 'chỉ ứng dụng', '+user thứ hai cùng quyền → deploy → <code>NOLOGIN</code> user cũ', 'đổi thẳng: bản cũ mở kết nối mới là hỏng'],
    ['Khoá API bên thứ ba', 'ứng dụng + job nền', '+cấp khoá 2 → deploy → kiểm lưu lượng → thu hồi khoá 1', 'job chạy mỗi đêm vẫn cầm khoá 1'],
    ['Khoá ký JWT / cookie phiên', 'MỌI token người dùng đang cầm', '!bốn giai đoạn, chờ hết tuổi thọ token', 'bỏ khoá cũ sớm = đá mọi người ra'],
    ['Khoá mã hoá dữ liệu', 'mọi dòng đã mã hoá', '-migration mã hoá lại, lưu mã khoá cạnh dữ liệu', 'xoay khoá KHÔNG mã hoá lại dữ liệu'],
    ['Khoá SSH deploy / token registry', 'secrets của CI, máy dev', 'thêm khoá mới vào authorized_keys → đổi secret CI → gỡ khoá cũ', 'quên gỡ khoá cũ trên VPS'],
    ['Khoá bị LỘ (bất kỳ loại nào)', 'cả kẻ gian', '-vô hiệu NGAY, chấp nhận gián đoạn', 'chờ "cho êm" là cho kẻ gian thêm thời gian'],
  ], { sm: true }) },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 4', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Sau deploy web trỏ vào CSDL dev', '<code>.env</code> của laptop đi theo rsync / nằm trong ảnh', '<code>--exclude=\'.env*\'</code> · .env ở <code>/opt/&lt;app&gt;/</code>'],
    ['Đổi <code>NEXT_PUBLIC_*</code>, restart, không đổi gì', 'giá trị đã nướng vào gói lúc dựng', 'dựng lại · khoá bí mật đi qua backend'],
    ['Thêm biến vào .env mà app không thấy', 'container giữ env lúc TẠO; deploy đã nạp env từ trước', '<code>up -d</code> với env mới (tạo lại), không <code>restart</code>'],
    ['"Sai mật khẩu" với tệp trông đúng', '<code>#</code> cắt cụt (node) · <code>$</code> bung (bash) · <code>\\r</code> (CRLF)', 'nháy kép · bí mật hex · <code>file .env</code> · kiểm độ dài'],
    ['<code>docker run --env-file</code> từ chối cả tệp', 'một dòng <code>export …</code>', 'bỏ <code>export</code>; một định dạng cho mọi bộ nạp'],
    ['Đã xoá .env mà bí mật vẫn đọc được', 'lịch sử git còn commit cũ', 'XOAY khoá, rồi filter-repo'],
    ['Token lộ qua ảnh Docker', '<code>--build-arg</code> nằm trong history', '<code>RUN --mount=type=secret</code>'],
    ['Xoay xong vẫn có máy nhận khoá cũ', 'bản sao dưới tên khác / máy 2 bị sót', '<code>grep -rlF</code> theo giá trị · curl token cũ = 401'],
    ['Lùi bản xong web vẫn hỏng', 'v2 đổi tên biến; .env dùng chung không lùi', 'đổi cấu hình kiểu cộng thêm, bỏ tên cũ ở deploy sau'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 4 (1/2): cấu hình', body: two(
    sh([
      ["rsync -a --delete --exclude='.env*' ./ vps:$DICH/", '.env sống qua deploy'],
      ['ln -sfn /srv/app/chung/.env "$BAN/.env"', '.env dùng chung'],
      ['set -a; . /opt/app/.env; set +a', 'nạp .env vào shell'],
      ['docker compose up -d web', 'tạo lại ⇒ env MỚI'],
      ['docker exec web printenv X', 'container thấy gì'],
      ['tr "\\0" "\\n" < /proc/$PID/environ', 'tiến trình thấy gì'],
      ["… | awk -F= '/^DB_PASS/{print length($2)}'", 'độ dài, không lộ'],
      ["comm -23 <(… .env.example) <(… .env)", 'biến thiếu trên máy'],
      ['file .env; sed -i "s/\\r$//" .env', 'bắt và sửa CRLF'],
      ['openssl rand -hex 32', 'bí mật an toàn cho .env'],
      ['grep -rl "giá trị" .next/static', 'giá trị nướng vào gói?'],
    ], { fs: 13.5 }),
    table(['Chỗ đặt', 'Lúc nào có hiệu lực'], [
      ['<code>NEXT_PUBLIC_*</code> / <code>VITE_*</code>', '!lúc DỰNG — công khai'],
      ['Dockerfile <code>ARG</code>', '!lúc dựng ảnh — lộ trong history'],
      ['Dockerfile <code>ENV</code>', 'trong ảnh — ai kéo cũng đọc'],
      ['compose <code>environment</code>/<code>env_file</code>', '+lúc TẠO container'],
      ['systemd <code>EnvironmentFile=</code>', '+lúc (re)start dịch vụ'],
      ['<code>.env</code> đọc bằng thư viện', '+lúc tiến trình khởi động'],
    ], { sm: true }), 'l2') },

  { t: 'Bảng tra nhanh Chương 4 (2/2): bí mật', body: two(
    sh([
      ['git log --all --oneline -- .env', '.env từng vào kho?'],
      ['git log -p -S "chuỗi"', 'commit thêm/bỏ chuỗi'],
      ['git show <commit>:.env', 'đọc tệp ở commit cũ'],
      ['gitleaks git . --redact -v', 'quét toàn lịch sử'],
      ['gitleaks dir .', 'quét cây làm việc'],
      ['git filter-repo --invert-paths --path .env', 'dọn lịch sử (SAU khi xoay)'],
      ['git commit --no-verify', 'vì sao hook không đủ'],
      ['chmod 600 .env; stat -c "%a %U:%G" .env', 'chỉ chủ đọc được'],
      ['docker build --secret id=npmrc,src=npmrc.txt …', 'bí mật lúc dựng'],
      ['grep -rlF "$GIA_TRI_CU" /opt /home', 'mọi bản sao của khoá'],
      ["curl -s -o /dev/null -w '%{http_code}' -H \"Authorization: Bearer $TOKEN_CU\" …", 'phải 401'],
    ], { fs: 13 }),
    steps([
      ['<b>GĐ 1</b> ký k1 · nhận k1', ''],
      ['<b>GĐ 2</b> ký k1 · nhận k1,k2', 'an toàn, làm lúc nào cũng được'],
      ['<b>GĐ 3</b> ký k2 · nhận k2,k1', 'cú chuyển thật'],
      ['<b>chờ</b> ≥ tuổi thọ token dài nhất', ''],
      ['<b>GĐ 4</b> ký k2 · nhận k2', 'token cũ → 401'],
    ]), 'l2') },

  { t: 'Thực hành Chương 4 (45 phút): một .env, năm cú đánh', body: `
    ${steps([
      ['Dựng VPS thí nghiệm có systemd; tạo <code>/opt/datlich/.env</code> <code>chmod 600</code>; rsync repo có và không <code>--exclude=\'.env*\'</code>', '.env production còn nguyên sau lần thứ hai'],
      ['Tệp thử 9 dòng qua bash, systemd, docker, compose, node: điền bảng năm cột của riêng bạn', 'giải thích được từng ô khác màu'],
      ['Next.js: dựng với <code>NEXT_PUBLIC_X=cu</code>, chạy với <code>=moi</code>, <code>grep</code> gói; rồi dựng lại', 'chỉ ra tên tệp gói đổi'],
      ['Kho thử: commit .env, xoá, <code>git log -S</code>, <code>gitleaks git</code>, <code>filter-repo</code>; clone cũ vẫn đọc được', 'kể được vì sao phải XOAY trước'],
      ['Máy chủ token: bốn giai đoạn; giữ một token cũ và <code>curl</code> sau GĐ 4', '401 — và 200 nếu cố tình "sót máy 2"'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bảng năm bộ nạp · token cũ 401 ở GĐ 4 · <code>gitleaks git</code> sạch · đã xoá <code>dv04-</code>.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
