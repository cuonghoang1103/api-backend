/**
 * GitHub Actions · Deck ga-10 — Chương 10: Chẩn đoán bằng ca thật.
 *
 * Năm sự cố THẬT của api-backend (đọc từ CLAUDE.md + git log + `gh run view` — CHỈ ĐỌC), mỗi ca được dựng lại
 * bản thu nhỏ an toàn trên sân tập công khai github.com/cuonghoang1103/ga-san-tap, nhánh ch10-chan-doan,
 * chạy 24/09/2026 trên runner ubuntu-24.04 của GitHub:
 *   36018017458 ch10-ban-cu    — deploy --no-build giữ ảnh cũ: healthy nhưng /gifs 404; smoke-test bắt được
 *   36018893376 ch10-seed      — Prisma 5.22 + Postgres 16: tsc xanh (0 tệp prisma/), TS6059, TS2322, seed ✗ mà rc=0
 *   36018697476 ch10-bo-kiem   — chốt wget trong node:22-slim (không có wget): 25 s, xanh; bảng 4 bộ kiểm × 3 kịch bản
 *   36018797092 ch10-diet-cong — Next 14.2.35/15.5.26 × next start/npm start/standalone: public/ chốt lúc khởi động,
 *                                pkill theo tên, lsof -ti RỖNG trên runner, ss/fuser thấy
 *   36021526160 ch10-migration — db push rồi migrate deploy: P3018 42P07 → P3009 → "vá" → prod lệch môi trường mới;
 *                                Postgres cuộn lại cả migration; CONCURRENTLY để lại chỉ mục INVALID
 * Lịch sử api-backend: run 28335803831 (P3018), 28336160068 (P3009), 28336404042 (auto-resolve, xanh), 28335803829
 * (backend-vps db push 21:07:03). curl tới cuongthai.com: GET không xác thực, 24/09/2026.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, diagram, yaml, pipe, sv, R, T, A, steps } from './_ga-chung.mjs';

export const deck = { key: 'ga-10', code: 'GITHUB ACTIONS · CHƯƠNG 10', title: 'Chẩn đoán bằng ca thật', sub: 'GitHub Actions · Chương 10' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Hồ sơ sự cố: 5 hàng cố định ───────────── */
const hoSo = ({ ngay, rows }) => {
  const nhan = [['Triệu chứng', 'mu'], ['Chẩn đoán sai đầu tiên', 'amb'], ['Chẩn đoán đúng', 'grn'], ['Cách vá', 'blu'], ['Chốt chặn tái diễn', 'vio']];
  let s = T(0, 22, ngay, { fs: 17, b: true, c: 'dk', mono: true });
  rows.forEach((lines, i) => {
    const y = 38 + i * 88, [lab, c] = nhan[i];
    s += R(0, y, 1160, 78, { c, fill: '#0f182a', r: 10, sw: 2 }) +
      R(0, y, 250, 78, { c, fill: 'rgba(255,255,255,.03)', r: 10, sw: 2 }) +
      T(18, y + 45, lab, { fs: 18, b: true, c });
    lines.forEach((ln, k) => { s += T(272, y + (lines.length === 1 ? 46 : 32 + k * 28), ln, { fs: 17, c: k ? 'mu' : 'tx' }); });
  });
  return sv(1160, 480, s);
};

/* ───────────── Slide 3 — dòng thời gian năm sự cố ───────────── */
const dongThoiGian = () => {
  let s = A(20, 210, 1150, 210, { c: 'mu', sw: 2.5 });
  const x0 = 130, per = 950 / 59; // 60 ngày từ 10/06 tới 09/08
  const d = (ngay, thang) => x0 + ((thang === 6 ? ngay - 10 : thang === 7 ? 20 + ngay : 51 + ngay)) * per;
  const ev = [
    [d(11, 6), 'up', '11/06', 'chốt kiểm wget ra đời', '(và hỏng câm 7 tuần)', 'amb'],
    [d(28, 6), 'dn', '28/06', 'P3018 → P3009', 'workflow tự resolve', 'red'],
    [d(2, 7), 'up', '02/07', 'GIF 404: bản dựng cũ', 'smoke-test 17:07', 'blu'],
    [d(10, 7), 'dn', '10/07', 'bỏ auto-resolve', 'khỏi deploy-ghcr.yml', 'grn'],
    [d(30, 7), 'up', '30/07', '/playground kẹt tải', '+ vá chốt wget', 'vio'],
    [d(8, 8), 'dn', '08/08', 'seed vỡ 18:32', 'vá 18:39', 'pnk'],
  ];
  ev.forEach(([x, pos, ngay, a, b, c]) => {
    const up = pos === 'up';
    s += `<circle cx="${x}" cy="210" r="10" fill="${{ amb: '#ffc233', red: '#ff5c6c', blu: '#58a6ff', grn: '#3fb950', vio: '#bc8cff', pnk: '#f778ba' }[c]}"/>`;
    s += `<path d="M${x} ${up ? 198 : 222} L${x} ${up ? 150 : 270}" stroke="#2a3a55" stroke-width="2"/>`;
    const y = up ? 70 : 300;
    s += T(x, y, ngay, { fs: 20, b: true, a: 'middle', c, mono: true }) + T(x, y + 30, a, { fs: 17, a: 'middle' }) + T(x, y + 56, b, { fs: 15, a: 'middle', c: 'mu' });
  });
  s += T(580, 420, 'Năm ca của chương này đều nằm trong 60 ngày, cùng một kho, cùng một người — và bốn ca có chung một gốc:', { fs: 17, a: 'middle' });
  s += T(580, 448, 'một phép kiểm TRẢ LỜI "ổn" mà chưa ai từng thấy nó trả lời "hỏng".', { fs: 17, a: 'middle', c: 'amb', b: true });
  return sv(1160, 462, s);
};

/* ───────────── Slide 17 — kiểm bộ kiểm: 4 × 3 ───────────── */
const luoiBoKiem = () => {
  const cot = ['sống (200)', 'lỗi 500', 'container chết'];
  const hang = [
    ['kiem-cu (wget, 11/06)', ['ok', 'sai', 'sai'], '25 s mỗi lần'],
    ['kiem-moi (node -e, 30/07)', ['ok', 'ok', 'ok'], '0–5 s'],
    ['smoke-404 (chỉ 404 là hỏng)', ['ok', 'sai', 'sai'], ''],
    ['smoke 200/401/403 (danh sách trắng)', ['ok', 'ok', 'ok'], ''],
  ];
  let s = '';
  cot.forEach((c, j) => { s += T(560 + j * 200, 26, c, { fs: 17, b: true, a: 'middle', c: j ? 'red' : 'grn' }); });
  s += T(560, 50, 'cần: XANH', { fs: 14, a: 'middle', c: 'mu' }) + T(760, 50, 'cần: ĐỎ', { fs: 14, a: 'middle', c: 'mu' }) + T(960, 50, 'cần: ĐỎ', { fs: 14, a: 'middle', c: 'mu' });
  hang.forEach(([ten, kq, ghi], i) => {
    const y = 66 + i * 78;
    s += R(0, y, 1160, 66, { c: 'dim', fill: i % 2 ? '#0f182a' : '#111a2b', r: 8, sw: 1 });
    s += T(16, y + 40, ten, { fs: 17, b: true, mono: true });
    kq.forEach((k, j) => {
      const x = 560 + j * 200, ok = k === 'ok';
      s += R(x - 80, y + 10, 160, 46, { c: ok ? 'grn' : 'red', fill: ok ? 'rgba(63,185,80,.10)' : 'rgba(255,92,108,.14)', r: 8 }) +
        T(x, y + 40, ok ? '✓ đúng' : '✗ báo XANH', { fs: 16, b: true, a: 'middle', c: ok ? 'grn' : 'red' });
    });
    if (ghi) s += T(1150, y + 40, ghi, { fs: 14, a: 'end', c: 'mu' });
  });
  s += T(0, 400, 'Run 36018697476 · một bộ kiểm TIN ĐƯỢC khi nó xanh ở cột đầu và ĐỎ ở hai cột sau.', { fs: 17 });
  s += T(0, 428, 'Hai bộ kiểm cũ xanh ở CẢ BA cột — tức là chúng không đo gì cả.', { fs: 17, c: 'amb', b: true });
  return sv(1160, 440, s);
};

/* ───────────── Slide 11 — tsc phủ gì ───────────── */
const phuTsc = () => {
  let s = '';
  s += R(0, 0, 540, 330, { c: 'grn', fill: 'rgba(63,185,80,.05)' }) + T(24, 38, 'tsconfig.json  (rootDir: ./src)', { fs: 18, b: true, c: 'grn', mono: true });
  s += R(30, 70, 480, 90, { c: 'grn', fill: '#0f182a' }) + T(52, 108, 'src/**', { fs: 20, b: true, mono: true }) + T(52, 138, 'dùng ContentType.CODE_REVIEW ✓', { fs: 16, c: 'mu' });
  s += T(30, 205, 'npx tsc --noEmit   → rc=0', { fs: 17, mono: true, c: 'grn' });
  s += T(30, 238, 'tsc --listFilesOnly: src/ 1 tệp · prisma/ 0 tệp', { fs: 16, mono: true });
  s += T(30, 272, '"exclude": [..., "prisma/**"]', { fs: 16, mono: true, c: 'mu' });
  s += T(30, 304, 'vì rootDir không chứa được prisma/ (TS6059)', { fs: 15, c: 'mu' });
  s += R(620, 0, 540, 330, { c: 'red', fill: 'rgba(255,92,108,.05)', dash: true }) + T(644, 38, 'NGOÀI vùng tsc nhìn', { fs: 18, b: true, c: 'red' });
  s += R(650, 70, 480, 90, { c: 'red', fill: '#0f182a' }) + T(672, 108, 'prisma/seed.ts', { fs: 20, b: true, mono: true }) + T(672, 138, "type Idea = 'VLOG' | 'CODE' | …   ← chép tay", { fs: 15, c: 'mu', mono: true });
  s += T(650, 205, "{ suggestedType: 'CODE' }", { fs: 17, mono: true, c: 'amb' });
  s += T(650, 238, 'không ai đọc → không ai so với enum thật', { fs: 16 });
  s += T(650, 272, 'npx prisma db seed → lỗi LÚC CHẠY', { fs: 16, mono: true, c: 'red' });
  s += T(650, 304, 'trên production, ở bước seed của deploy', { fs: 15, c: 'mu' });
  s += A(545, 165, 615, 165, { c: 'red', dash: true });
  s += T(580, 380, 'Một checklist xanh chỉ là bằng chứng cho những TỆP nó đã mở. Hỏi tsc nó mở tệp nào: --listFilesOnly.', { fs: 17, a: 'middle' });
  return sv(1160, 395, s);
};

/* ───────────── Slide 23 — ai đang giữ cổng? ───────────── */
const aiGiuCong = () => table(['Lệnh (runner ubuntu-24.04)', 'Kết quả đo', 'Diệt được?'], [
  ['<code>lsof -ti:19101</code>', '-<code>\'\'</code> · rc=1 — kể cả <code>sudo</code>', '-không: <code>xargs -r</code> im lặng bỏ qua'],
  ['<code>lsof -nP -iTCP:19101 -sTCP:LISTEN</code>', '-trống', '—'],
  ['<code>ss -ltnpH "sport = :19101"</code>', '+<code>pid=2256</code> (next-server)', '+dùng để XÁC NHẬN'],
  ['<code>fuser 19101/tcp</code>', '+<code>2256</code>', '+<code>fuser -k 19101/tcp</code> → cổng trống'],
  ['<code>lsof -ti:19102</code> trên Mac M1', '+PID đúng', '+<code>lsof -ti:PORT | xargs -r kill -9</code> chạy'],
], { sm: true }) + box('warn', 'Run 36018797092, cả 6 job. Luật “diệt theo cổng” của CLAUDE.md đúng trên Mac — và trên runner Linux, cùng một dòng lệnh <strong>không diệt gì</strong>, không báo lỗi. Chưa rõ vì sao lsof không thấy socket của tiến trình trong job; điều chắc chắn là: sau khi diệt, phải hỏi lại bằng một công cụ KHÁC (<code>ss</code>) xem cổng đã trống chưa.');

/* ───────────── Slide 26 — hai workflow đua nhau 28/06 ───────────── */
const duaNhau = () => {
  let s = '';
  const x = (hh, mm) => 180 + ((hh - 20) * 60 + mm - 45) * (960 / 45); // 20:45 → 21:30
  s += T(0, 70, 'backend-vps.yml', { fs: 16, b: true, mono: true, c: 'vio' }) + T(0, 180, 'deploy-ghcr.yml', { fs: 16, b: true, mono: true, c: 'blu' });
  s += A(180, 64, 1150, 64, { c: 'dim', sw: 2 }) + A(180, 174, 1150, 174, { c: 'dim', sw: 2 });
  [[20, 49], [21, 0], [21, 10], [21, 20], [21, 30]].forEach(([h, m]) => {
    const xx = x(h, m); s += T(xx, 250, `${h}:${String(m).padStart(2, '0')}`, { fs: 14, a: 'middle', c: 'mu', mono: true }) + `<path d="M${xx} 228 L${xx} 236" stroke="#6b7a93" stroke-width="2"/>`;
  });
  const dot = (xx, y, c, lab, sub, up = true) => {
    s += `<circle cx="${xx}" cy="${y}" r="9" fill="${c}"/>` + T(xx, y + (up ? -18 : 32), lab, { fs: 15, a: 'middle', b: true }) + (sub ? T(xx, y + (up ? -38 : 52), sub, { fs: 13.5, a: 'middle', c: 'mu' }) : '');
  };
  dot(x(21, 7), 64, '#bc8cff', 'db push 21:07:03', '"now in sync" → TẠO bảng');
  dot(x(20, 51), 174, '#ff5c6c', 'TS2353', '', false);
  dot(x(21, 9), 174, '#ff5c6c', 'P3018 · 42P07', 'relation already exists', false);
  dot(x(21, 18), 174, '#ff5c6c', 'P3009', '', false);
  dot(x(21, 28), 174, '#3fb950', '21:28 xanh', 'resolve --rolled-back', false);
  s += R(0, 290, 1160, 150, { c: 'amb', fill: 'rgba(255,194,51,.05)', dash: true });
  s += T(20, 322, 'Cả hai workflow chạy trên CÙNG commit 63d5d7aa (push 20:59). backend-vps dùng db push --accept-data-loss:', { fs: 16 });
  s += T(20, 350, 'nó tạo bảng note_subject_shares theo schema.prisma mà không ghi lịch sử migration. Hai phút sau deploy-ghcr', { fs: 16 });
  s += T(20, 378, 'chạy migrate deploy, và câu CREATE TABLE đầu tiên của migration đâm vào bảng vừa được tạo.', { fs: 16 });
  s += T(20, 414, 'Lỗi không nằm trong migration. Nó nằm ở chỗ HAI công cụ cùng quản một schema.', { fs: 17, b: true, c: 'amb' });
  return sv(1160, 445, s);
};

/* ───────────── Slide 28 — prod vs môi trường mới ───────────── */
const prodVsMoi = () => two(
  t(['# prod: db push trước, rồi migration "IF NOT EXISTS"', '$ select indexname from pg_indexes …', 'idx_note_subject_share_recipient', 'note_subject_shares_pkey', '! note_subject_shares_subject_id_recipient_id_key', '! uk_note_subject_share', '$ select conname … pg_constraint', 'fk_note_subject_share_recipient', '! note_subject_shares_recipient_id_fkey', 'uk_note_subject_share'], 'DB "prod" · 4 chỉ mục, 2 khoá ngoại', 13.5),
  t(['# môi trường MỚI: chỉ chạy thư mục migrations', '$ select indexname from pg_indexes …', 'idx_note_subject_share_recipient', 'note_subject_shares_pkey', '+ uk_note_subject_share', '', '$ select conname … pg_constraint', 'fk_note_subject_share_recipient', 'note_subject_shares_pkey', '+ uk_note_subject_share'], 'DB "moi" · 3 chỉ mục, 1 khoá ngoại', 13.5)) +
  box('bad', 'Run 36021526160. Bản “IF NOT EXISTS” làm deploy xanh — và để lại HAI chỉ mục duy nhất cùng một cặp cột, HAI khoá ngoại cùng một cột, chỉ trên prod. Mọi môi trường dựng từ đầu (máy dev, staging, khôi phục thảm hoạ) sẽ KHÁC prod. Không phép kiểm xanh nào nói ra điều đó.');

export const slides = S([
  /* 1 */ cover({ t: 'Chương 10 — Chẩn đoán bằng ca thật', sub: 'năm sự cố thật của kho này: bản dựng cũ · seed vỡ · bộ kiểm hỏng · diệt cổng · migration', chap: 'CHƯƠNG 10' }),

  /* 2 */ { t: 'Bản đồ chương: năm sự cố, năm kiểu chẩn đoán', body: mindmap('Chẩn đoán bằng ca thật', 'đo từng triệu chứng, rồi biến bài học thành một phép kiểm tự động', [
    { t: '10.1 Bản dựng cũ', d: '404 hay 401 · smoke-test sau deploy', c: 'blu' },
    { t: '10.2 Seed vỡ', d: 'checklist chỉ phủ tệp nó mở', c: 'pnk' },
    { t: '10.3 Bộ kiểm hỏng', d: 'bắt bộ kiểm đi qua đường SAI', c: 'amb' },
    { t: '10.4 Diệt cổng', d: 'public/ chốt lúc khởi động · pkill trượt', c: 'vio' },
    { t: '10.5 Migration', d: 'P3018 → P3009 · đừng tự resolve', c: 'red' },
  ]) },

  /* 3 */ { t: 'Năm sự cố trong 60 ngày của cùng một kho', body: dongThoiGian() },

  /* 4 */ { t: 'Mỗi ca đọc theo một khuôn: năm câu hỏi', body: steps([
    ['<strong>Triệu chứng</strong> — người dùng / log THẤY gì, chính xác từng chữ', 'không phải “web lỗi” mà “/api/v1/gifs trả 404, /messages/threads trả 401”'],
    ['<strong>Chẩn đoán sai đầu tiên</strong> — giả thuyết hợp lý nhất, và vì sao nó hấp dẫn', 'ghi lại để lần sau nhận ra nó sớm hơn'],
    ['<strong>Chẩn đoán đúng</strong> — phép đo NÀO đã bác bỏ giả thuyết sai', 'một lệnh curl, một psql, một ss — không phải một cảm giác'],
    ['<strong>Cách vá</strong> — sửa đúng tầng hỏng, không sửa triệu chứng', 'deploy đầy đủ · import enum · node -e · diệt theo cổng · dừng lại'],
    ['<strong>Chốt chặn tái diễn</strong> — phép kiểm tự động, đã thấy nó ĐỎ một lần', 'smoke-test · typecheck:seed · kiểm bộ kiểm · fail loud'],
  ]) },

  /* ───── 10.1 ───── */
  /* 5 */ { t: 'Hồ sơ 10.1 — GIF chết, tin nhắn “biến mất”', body: hoSo({ ngay: '02/07/2026 · api-backend · commit e9c36ead (17:07)', rows: [
    ['GIF picker chết và danh sách chat “biến mất” — cùng lúc, sống sót qua đăng nhập lại.'],
    ['“Chắc lỗi phiên đăng nhập chung” — hai triệu chứng chồng đúng chỗ auth sẽ chồng.'],
    ['curl không xác thực: /api/v1/gifs → 404 (route không có), /messages/threads → 401 (route có).', 'Hai lỗi KHÁC NHAU: ảnh backend cũ + bộ lọc deletedAt theo từng người xem.'],
    ['Deploy lại ĐẦY ĐỦ (không --no-build) để dựng ảnh mới có routes/gifs.'],
    ['deploy.sh gọi từng route lõi không token: 404 ⇒ exit 1. 3 route lúc 17:07, 13 route lúc 18:04.', 'Hôm nay (24/09/2026): 67 route trong danh sách.'],
  ] }) },

  /* 6 */ { t: '401 nghĩa là route CÓ; 404 nghĩa là route KHÔNG có', body: two(
    t(['$ curl -s -o /dev/null -w "%{http_code}" \\', '    https://cuongthai.com/api/v1/gifs', '+ 401', '$ curl -s https://cuongthai.com/api/v1/gifs', '{"success":false,"message":"No authentication', ' token provided","code":"UNAUTHORIZED"}', '$ curl -s …/api/v1/khong-ton-tai-xyz', '! {"success":false,"message":"Route GET', '!  /api/v1/khong-ton-tai-xyz not found"}', '$ curl -s -o /dev/null -w … api.cuongthai.com/messages/threads', '! 404      # thiếu /api/v1 — đúng đường là 401'], 'prod · 24/09/2026 · không token', 13.5),
    table(['Mã', 'Nói gì về bản dựng'], [
      ['<code>200</code>', '+route có, công khai'],
      ['<code>401</code>', '+route CÓ, đòi đăng nhập'],
      ['<code>403</code>', '+route có, bạn bị từ chối'],
      ['<code>404</code>', '-route KHÔNG có — hoặc gõ sai đường'],
      ['<code>500</code>', '!route có, code bên trong vỡ'],
      ['<code>000</code>', '-không ai trả lời: container/tiến trình chết'],
    ], { sm: true })) },

  /* 7 */ { t: 'Tái lập: deploy --no-build thì healthy mà vẫn 404', body: pipe({
    w: 1160, h: 250,
    cols: [[{ n: 'anh cu', s: 'ok', d: '3 route' }], [{ n: 'no-build', s: 'ok', d: 'healthy' }, { n: 'build', s: 'ok', d: 'healthy' }], [{ n: 'smoke ✗', s: 'fail', d: '404' }, { n: 'smoke ✓', s: 'ok', d: '401' }]],
    needs: [['anh cu', 'no-build'], ['anh cu', 'build'], ['no-build', 'smoke ✗'], ['build', 'smoke ✓']],
  }) + t(['deploy (no-build)   health: healthy · mounted: courses messages/threads profile', '! /api/v1/gifs  404  {"message":"Route GET /api/v1/gifs not found"}', 'deploy (day-du)     health: healthy · mounted: courses gifs messages/threads profile', '+ /api/v1/gifs  401  {"code":"UNAUTHORIZED"}'], 'run 36018017458 · ch10-ban-cu', 14) },

  /* 8 */ { t: 'Healthcheck hỏi MỘT route; smoke-test hỏi TỪNG route', body: two(
    yaml([
      ['HEALTHCHECK CMD node -e "…/health…"', 'chỉ /health'],
      ['# anh cu: /health 200 → healthy', 'không biết /gifs'],
      ['for route in gifs messages/threads \\', 'danh sách route lõi'],
      ['             profile courses; do', ''],
      ['  code=$(docker exec api node -e …)', 'gọi TỪ TRONG container'],
      ['  if [ "$code" = "404" ]; then', '404 = chưa mount'],
      ['    smoke_failed=true', ''],
      ['done', ''],
      ['if [ "$smoke_failed" = true ]; then exit 1; fi', 'deploy ĐỎ'],
    ], { fs: 15 }),
    t(['! ✗ Route /api/v1/gifs → 404 (NOT mounted —', '!     stale/partial build)', '+ ✓ Route /api/v1/messages/threads mounted (HTTP 401)', '+ ✓ Route /api/v1/profile mounted (HTTP 401)', '+ ✓ Route /api/v1/courses mounted (HTTP 200)', '! ##[error]route loi 404 → anh dang chay la', '!   ban dung CU. Chay lai deploy DAY DU', '! ##[error]Process completed with exit code 1.'], 'deploy (no-build) · smoke-test', 13.5)) +
    box('tip', 'Thêm route mới vào danh sách smoke-test ngay trong commit thêm route đó — bằng không, lần bản dựng cũ kế tiếp sẽ lại chỉ hiện ra qua báo lỗi của người dùng.') },

  /* ───── 10.2 ───── */
  /* 9 */ { t: 'Hồ sơ 10.2 — đổi tên một giá trị enum', body: hoSo({ ngay: '08/08/2026 · commit 1da59865 (18:17) → f2f36e1f (18:39)', rows: [
    ['Deploy 18:32 in “Seed reported errors (rc=0)” ở bước Content Creator; deploy vẫn đi tiếp.'],
    ['“Checklist đã xanh hết, chắc dữ liệu prod lạ” — tsc, build frontend, prisma generate đều qua.'],
    ["seed.ts tự khai union 'VLOG' | … | 'CODE' | …; tsconfig.json exclude prisma/** nên tsc", 'chưa bao giờ mở seed.ts. Giá trị CODE không còn trong enum → Prisma ném lỗi lúc CHẠY.'],
    ['import { ContentType } from \'@prisma/client\' — xoá bản chép tay; đổi CODE → CODE_REVIEW.'],
    ['tsconfig.seed.json + npm run typecheck:seed + npx prisma db seed vào checklist khi đổi schema.'],
  ] }) },

  /* 10 */ { t: 'tsc xanh vì nó chưa bao giờ mở seed.ts', body: phuTsc() },

  /* 11 */ { t: 'Chép tsconfig “ngây thơ” thì gặp TS6059 ngay', body: two(
    t(['$ cat tsconfig.seed.ngay-tho.json', '{ "extends": "./tsconfig.json",', '  "include": ["prisma/**/*.ts"], "exclude": [] }', '$ npx tsc -p tsconfig.seed.ngay-tho.json --noEmit', "! error TS6059: File '…/prisma/seed.ts' is not", "!   under 'rootDir' '…/src'.", '  → rc=2'], 'ch10-seed · bước 2', 13.5),
    t(['$ cat tsconfig.seed.json          # bản thật', '{ "extends": "./tsconfig.json",', '  "compilerOptions": { "noEmit": true,', '                       "rootDir": "." },', '  "include": ["prisma/**/*.ts", "src/**/*"] }', '$ npm run typecheck:seed', "! seed.ts(17,41): error TS2322: Type 'Idea' is", '!   not assignable … Type \'"CODE"\' is not', "!   assignable to type 'ContentType | null'", '  → rc=2'], 'ch10-seed · bước 3', 13.5)) +
    box('info', 'Hai điều đo được: cần <code>rootDir: "."</code> + <code>noEmit</code>, và ngay cả khi CÒN union chép tay, tsc vẫn bắt được — vì chỗ gọi <code>prisma.contentIdea.create()</code> so union đó với kiểu thật. Chỉ là lỗi báo ở dòng gọi, không phải dòng có chữ <code>CODE</code>.') },

  /* 12 */ { t: 'Seed hỏng một dòng, in ✗, và vẫn thoát 0', body: two(
    t(['$ npx prisma db seed', 'Running seed command `tsx prisma/seed.ts` ...', '+ ✓ Vlog mot ngay hoc', '! ✗ Review PR dau tien — Invalid value for', '!   argument `suggestedType`. Expected ContentType.', '+ ✓ Y tuong chua phan loai', 'seed xong: 2/3', '🌱  The seed command has been executed.', '  → rc=0', '$ select suggested_type, title from content_ideas', 'VLOG | Vlog mot ngay hoc', '     | Y tuong chua phan loai     (2 rows)'], 'ch10-seed · bước 4', 13.5),
    list([
      'Lỗi đến từ <strong>Prisma Client</strong> (kiểm enum trước khi gửi SQL), không phải từ Postgres.',
      'Seed bắt lỗi từng dòng rồi đi tiếp ⇒ rc=0. Bước deploy chỉ biết nhờ dò chữ <code>✗</code>, và chỉ <strong>cảnh báo</strong>.',
      'Kết quả trên prod: thiếu đúng các dòng có giá trị cũ — không ai thấy nếu không đếm.',
      'Bản vá thứ ba (chương này thêm): seed hỏng thì <code>process.exitCode = 1</code>.',
    ])) },

  /* 13 */ { t: 'Ba lớp vá, mỗi lớp chặn một chỗ khác', body: cards([
    { ic: '🧬', t: '1 · Một nguồn sự thật', d: '<code>import { ContentType } from \'@prisma/client\'</code>. Lỗi báo ngay dòng <code>\'CODE\'</code>: TS2322 ở seed.ts(7,34).', c: 'grn' },
    { ic: '🔭', t: '2 · Mở rộng vùng kiểm', d: '<code>tsconfig.seed.json</code> (noEmit, rootDir “.”) + <code>npm run typecheck:seed</code> trong checklist và CI.', c: 'blu' },
    { ic: '🏃', t: '3 · CHẠY nó, và để nó đỏ', d: '<code>npx prisma db seed</code> trên DB thật (service container). Seed hỏng phải thoát khác 0.', c: 'amb' },
  ], 3) + yaml([
    ['services: { postgres: { image: postgres:16, … } }', 'DB thật trong job'],
    ['- run: npx prisma migrate deploy', 'schema mới nhất'],
    ['- run: npm run typecheck:seed', 'lớp 2'],
    ['- run: npx prisma db seed', 'lớp 3 — rc≠0 là đỏ'],
  ], { fs: 15 }) },

  /* ───── 10.3 ───── */
  /* 14 */ { t: 'Hồ sơ 10.3 — chốt kiểm frontend không kiểm gì', body: hoSo({ ngay: '11/06/2026 (ea0126ce) → 30/07/2026 (0fd0c0c6) · deploy.sh', rows: [
    ['Không có triệu chứng nào — đó chính là vấn đề. Mỗi deploy chỉ chậm thêm ~25 giây.'],
    ['“Vòng thử 6 lần là để chờ frontend khởi động” — nghe như một tính năng bền bỉ.'],
    ['Ảnh frontend cố ý KHÔNG cài wget lẫn curl (healthcheck compose dùng node).', 'wget luôn “không tìm thấy”, vòng lặp cạn, và sau vòng lặp không có dòng nào báo hỏng.'],
    ['Đổi sang node -e + require("http"), thêm cờ frontend_ok, hết 6 lần thì fail.'],
    ['Kiểm BỘ KIỂM: cho nó đi qua trang 500 và container chết — phải thấy ĐỎ trước khi tin.'],
  ] }) },

  /* 15 */ { t: 'Vòng thử cạn trong im lặng: 25 giây, bước vẫn xanh', body: two(
    yaml([
      ['set -euo pipefail', 'vẫn không cứu'],
      ['for i in $(seq 1 6); do', ''],
      ['  if docker exec frontend \\', ''],
      ['     sh -c "wget -qO- …/ >/dev/null 2>&1"; then', 'wget: not found'],
      ['    ok "Frontend healthy"; break', 'không bao giờ tới'],
      ['  fi', ''],
      ['  [ "$i" -lt 6 ] && sleep 5', '5 × 5 s = 25 s'],
      ['done', 'hết vòng: KHÔNG gì cả'],
      ['# Step 4b: …', 'deploy đi tiếp'],
    ], { fs: 15 }),
    t(['$ docker exec ch10-web-song sh -c \\', '    \'command -v wget curl node\'', '! wget  (KHONG CO)', '! curl  (KHONG CO)', 'node  /usr/local/bin/node', 'Checking frontend...', '→ sang buoc 4b', '+ rc=0 · mat 25 giay', '# không một dòng "Frontend healthy"', '# nhưng cũng không một dòng lỗi'], 'run 36018697476 · kiem-cu', 14)) +
    box('warn', '<code>set -e</code> không dừng được: lệnh hỏng nằm trong điều kiện của <code>if</code>, và <code>[ … ] &amp;&amp; sleep</code> là một danh sách <code>&amp;&amp;</code> — cả hai đều được bash miễn trừ. Bản vá 30/07 ghi chú đúng cái bẫy ngược lại: <code>[ … ] &amp;&amp; fail</code> sẽ giết deploy ĐÚNG LÚC frontend khoẻ.') },

  /* 16 */ { t: 'Kiểm bộ kiểm: 4 bộ kiểm × 3 kịch bản', body: luoiBoKiem() },

  /* 17 */ { t: '“Chỉ 404 là hỏng” cho qua cả trang 500 lẫn container chết', body: two(
    t(['# smoke-404.sh — logic của deploy.sh', 'if [ "$code" = "404" ]; then exit 1; fi', 'echo "✓ mounted (HTTP ${code})"', '# kịch bản lỗi 500:', '+ ✓ /api/v1/gifs mounted (HTTP 500)', '# kịch bản container đã dừng:', '+ ✓ /api/v1/gifs mounted (HTTP )', '# cả hai → XANH'], 'danh sách ĐEN', 14),
    t(['# smoke-danh-sach-trang.sh', 'case "$code" in', '  200|401|403) echo "✓ mounted" ;;', '  *) echo "✗ \'${code:-rong}\'"; exit 1 ;;', 'esac', '! ✗ /api/v1/gifs → \'500\'', "! ✗ /api/v1/gifs → 'rong'", '# sống → ✓ (HTTP 401)'], 'danh sách TRẮNG', 14)) +
    box('tip', 'Liệt kê những gì được coi là KHOẺ, đừng liệt kê những gì là HỎNG — thứ hỏng bạn chưa nghĩ tới (000, chuỗi rỗng, 502 của nginx) luôn nhiều hơn. Trong deploy.sh thật, vòng chờ backend đứng trước nên ca “chết hẳn” đã bị chặn sớm hơn; ca 500 thì vẫn lọt.') },

  /* ───── 10.4 ───── */
  /* 18 */ { t: 'Hồ sơ 10.4 — /playground kẹt màn hình tải', body: hoSo({ ngay: '30/07/2026 · máy dev · hai phiên làm việc', rows: [
    ['Sân chơi 3D quay màn hình tải mãi. Console không lỗi. Network: HTML 200, preload .ktx 200.'],
    ['“Tại minify / tại trình duyệt” — commit 0fd0c0c6 ghi: “hoá ra không phải minify”.'],
    ['Next chốt danh sách tệp public/ lúc SERVER KHỞI ĐỘNG. Dựng lại sân chơi ⇒ gói JS đổi tên', '(mã băm) ⇒ server đang chạy trả 404 dù tệp có thật trên đĩa. Không JS nào chạy, không lỗi nào hiện.'],
    ['Khởi động lại Next. Nhưng pkill -f "next start" không diệt được server ⇒ EADDRINUSE.'],
    ['deploy.sh bước 4c: kiểm index.html 200 VÀ gói JS có mã băm tải được. Prod: mỗi deploy là container mới.'],
  ] }) },

  /* 19 */ { t: 'Tệp có trên đĩa, server vẫn trả 404', body: t([
    '# next build xong, public/cu.txt đã có; khởi động server',
    'cu.txt  (co truoc khi khoi dong): HTTP 200',
    '$ echo "tep MOI, ghi sau khi server da chay" > public/moi.txt',
    '! moi.txt (ghi SAU khi khoi dong): HTTP 404',
    '+ tren dia: 36 byte public/moi.txt',
    '# … sau khi diệt server cũ THẬT và khởi động lại:',
    '+ moi.txt sau khi khoi dong lai: HTTP 200',
    '# như nhau trên cả 6 tổ hợp: Next 14.2.35 / 15.5.26 × next start / npm start / standalone',
  ], 'run 36018797092 · ch10-diet-cong', 16) + box('info', 'Chẩn đoán rút ra: tài sản tĩnh 404 + <code>ls</code> thấy tệp ⇒ tiến trình đang phục vụ giữ một ảnh chụp cũ. Khởi động lại TRƯỚC khi điều tra gì khác. Frontend của kho chạy Next <strong>14.2.35</strong> (không phải 15) — hành vi đo được giống nhau ở cả hai.') },

  /* 20 */ { t: 'next-server tự đổi tên: pkill -f "next start" trượt', body: table(['Cách chạy', 'Cây tiến trình đo được', '<code>pkill -f</code>', 'Sau 3 s'], [
    ['<code>next start -p 19101</code>', '<code>next-server (v14.2.35)</code> — MỘT tiến trình', '-rc=1 (không khớp gì)', '-server còn nguyên'],
    ['<code>npm start</code>', '<code>npm start</code> → <code>sh -c next start …</code> → <code>next-server</code>', '!rc=0 — diệt được <code>sh</code>', '-next-server còn, cha = PID 1'],
    ['<code>node …/standalone/server.js</code>', '<code>next-server (v14.2.35)</code>', '-rc=1', '-server còn nguyên'],
    ['(cả ba, Next 15.5.26)', '<code>next-server (v15.5.26)</code>', 'giống hệt', 'giống hệt'],
  ], { sm: true }) + box('bad', 'Next ghi đè <code>process.title</code> thành <code>next-server (vX)</code>, và trên Linux ghi đè ấy thay cả dòng lệnh mà <code>pkill -f</code> đọc. Tệ nhất là ca <code>npm start</code>: pkill báo <strong>thành công</strong> (rc=0) vì nó giết được lớp vỏ <code>sh</code>, còn server thật thành con mồ côi và tiếp tục giữ cổng. Khởi động lại ngay: <code>EADDRINUSE</code>.') },

  /* 21 */ { t: 'Diệt theo cổng — rồi hỏi lại xem cổng đã trống chưa', body: aiGiuCong() },

  /* 22 */ { t: 'Quy trình khởi động lại có hậu điều kiện', body: steps([
    ['<strong>Ai giữ cổng?</strong> <code>ss -ltnp "sport = :3000"</code> (Linux) · <code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code> (Mac)', 'ghi lại PID — đây là tiến trình bạn muốn chết'],
    ['<strong>Diệt theo cổng</strong>: <code>fuser -k 3000/tcp</code> (Linux) · <code>lsof -ti:3000 | xargs -r kill -9</code> (Mac)', 'không bao giờ theo tên — Node tự đổi tên được'],
    ['<strong>Hậu điều kiện 1</strong>: hỏi lại bằng lệnh ở bước 1 — phải KHÔNG còn ai', 'lệnh diệt thoát 0 chưa phải bằng chứng; run 36018797092 là ví dụ'],
    ['<strong>Khởi động</strong> server mới, chờ nó trả lời', 'PID MỚI khác PID cũ (2256 → 2352)'],
    ['<strong>Hậu điều kiện 2</strong>: tệp mới trả 200', 'moi.txt: 404 → 200 — đó mới là “đã khởi động lại”'],
  ]) },

  /* ───── 10.5 ───── */
  /* 23 */ { t: 'Hồ sơ 10.5 — migration P3018 rồi P3009', body: hoSo({ ngay: '28/06/2026 20:49–21:28 UTC (29/06 giờ VN) · deploy-ghcr.yml', rows: [
    ['migrate deploy: P3018, 42P07 relation "note_subject_shares" already exists; lần sau: P3009.'],
    ['“Migration không idempotent” → thêm IF NOT EXISTS; “migration kẹt” → workflow tự resolve --rolled-back.'],
    ['backend-vps.yml chạy db push --accept-data-loss 2 phút TRƯỚC trên cùng commit — nó đã tạo', 'bảng. Hai workflow cùng quản một schema; migration chỉ là chỗ va chạm lộ ra.'],
    ['10/07 (d09e5f20): bỏ db push, bỏ auto-resolve; migrate hỏng thì in lỗi và exit 1.'],
    ['Migration Failure Protocol trong CLAUDE.md: DỪNG, đo, báo người — không resolve, không reset.'],
  ] }) },

  /* 24 */ { t: 'Hai workflow, một commit, một schema: 28/06 tối', body: duaNhau() },

  /* 25 */ { t: 'Tái lập: db push trước, migrate deploy sau', body: t([
    '$ prisma db push --accept-data-loss --skip-generate      # vai backend-vps.yml',
    '+ 🚀  Your database is now in sync with your Prisma schema. Done in 69ms',
    '$ prisma migrate deploy                                   # vai deploy-ghcr.yml',
    'Applying migration `20260709120000_add_notes_subject_share`',
    '! Error: P3018   Database error code: 42P07',
    '! ERROR: relation "note_subject_shares" already exists',
    '$ prisma migrate deploy                                   # commit kế tiếp',
    '! Error: P3009   migrate found failed migrations in the target database',
    '$ prisma migrate resolve --rolled-back 0_init             # vòng lặp "vá" 684742b2',
    '! Error: P3012   Migration `0_init` cannot be rolled back because it is not in a failed state.',
    '# prod 28/06: 27 lệnh resolve · 24 lần P3012 bị || true nuốt · 3 lần "marked as rolled back"',
  ], 'run 36021526160 · ch10-migration · dua-nhau', 14) },

  /* 26 */ { t: 'Postgres cuộn lại CẢ migration — trừ CONCURRENTLY', body: two(
    t(['# 3 câu: CREATE TABLE tags; CREATE INDEX; ALTER TABLE khong_ton_tai', '! Error: P3018 · 42P01 relation "khong_ton_tai" does not exist', "$ select to_regclass('public.tags'), to_regclass('idx_tags_name')", '+  |              # cả hai NULL — không câu nào ở lại', 'applied_steps_count = 0', '# ALTER + CREATE INDEX CONCURRENTLY', '! 25001 CONCURRENTLY cannot run inside a transaction block', "+ cot_slug_con = f   # ALTER cũng bị cuộn lại"], 'giao-dich · bước 1–7a', 13),
    t(['# MỘT câu: CREATE UNIQUE INDEX CONCURRENTLY', '#          trên dữ liệu trùng (git, git)', '! 23505 could not create unique index "tags_name_key"', '$ select relname, indisvalid …', '! tags_name_key | f          ← chỉ mục INVALID ở lại', '$ prisma migrate resolve --rolled-back …', '$ prisma migrate deploy', '! 42P07 relation "tags_name_key" already exists', '# trạng thái dở dang THẬT: rolled-back là SAI'], 'giao-dich · bước 7b–7c', 13)) +
    box('info', 'Bài 10.5 cũ mô tả “3 trên 5 câu đã chạy”. Đo trên Postgres 16 + Prisma 5.22: một migration nhiều câu chạy trong MỘT giao dịch, hỏng ở đâu cũng cuộn lại hết. Trạng thái dở dang có thật — nhưng chỉ với lệnh ngoài giao dịch như <code>CONCURRENTLY</code>, hoặc với CSDL không có DDL giao dịch (MySQL).') },

  /* 27 */ { t: '“IF NOT EXISTS” làm deploy xanh và làm prod khác mọi nơi', body: prodVsMoi() },

  /* 28 */ { t: 'Câu migrate diff trong CLAUDE.md không chạy nguyên văn', body: table(['Lệnh (Prisma 5.22.0)', 'Kết quả đo'], [
    ['<code>migrate diff --from-migrations … --to-database-url "$DB" --script</code>', '-<code>unknown or unexpected option: --to-database-url</code>'],
    ['<code>… --from-migrations … --to-url "$DB" --script</code>', '-<code>You must pass the --shadow-database-url …</code>'],
    ['<code>… --to-url "$DB" --shadow-database-url "$SHADOW" --script</code>', '+in SQL lệch: thêm FK <code>…_recipient_id_fkey</code>, đổi tên chỉ mục'],
    ['như trên, khi migration HỎNG còn trong thư mục', '-<code>P3006</code> — nó phát lại migration hỏng vào shadow DB'],
    ['<code>… --from-schema-datamodel prisma/schema.prisma --to-url "$DB"</code>', '+chạy được, không cần shadow: “DB lệch gì so với mô hình”'],
  ], { sm: true }) + box('warn', 'Phải ĐO cả lệnh đo. Câu gợi ý trong Migration Failure Protocol dùng một tên cờ không có ở Prisma 5.22 và thiếu shadow DB — tức là ngày cần nó nhất, nó sẽ in trang trợ giúp. Chạy thử trên một bản sao TRƯỚC ngày đó.') },

  /* 29 */ { t: 'Workflow đúng: migrate hỏng thì dừng to, không tự vá', body: two(
    yaml([
      ['set +e', ''],
      ['OUT=$(npx prisma migrate deploy 2>&1); RC=$?', 'giữ mã thoát THẬT'],
      ['set -e', ''],
      ['echo "$OUT"', 'in đủ lỗi vào log'],
      ['if [ "$RC" -ne 0 ]; then', ''],
      ['  echo "[FAIL] prisma migrate deploy failed"', ''],
      ['  echo "NOT auto-resolving — a human must…"', 'không resolve'],
      ['  exit 1', 'deploy ĐỎ, dừng hẳn'],
      ['fi', ''],
    ], { fs: 15 }),
    list([
      'Đây là khối thật trong <code>deploy-ghcr.yml</code> từ 10/07 (d09e5f20) — thay cho vòng <code>resolve --rolled-back</code> + <code>db push --accept-data-loss</code>.',
      'Không <code>continue-on-error</code>, không <code>|| true</code>: lần deploy sau cũng đỏ trên cùng trạng thái, tới khi người đọc xong.',
      'Chỉ MỘT công cụ được đổi schema prod: <code>migrate deploy</code>. <code>db push</code> ra khỏi mọi workflow.',
      'Hai workflow deploy chỉ còn <code>workflow_dispatch</code> — không còn đua trên một push.',
    ])) },

  /* 30 */ { t: 'Sai lầm hay gặp ở Chương 10', body: cards([
    { ic: '🌐', t: 'Chẩn đoán bằng trình duyệt', d: 'Mọi thứ đều là “không chạy”. <code>curl -s -o /dev/null -w "%{http_code}"</code> tách 401 khỏi 404 trong một lệnh.', c: 'blu' },
    { ic: '✅', t: 'Tin checklist vì nó xanh', d: 'tsc mở 0 tệp trong prisma/. Hỏi <code>--listFilesOnly</code> trước khi tin.', c: 'pnk' },
    { ic: '🔁', t: 'Vòng thử không có kết cục', d: 'Hết lượt thử mà không <code>exit 1</code> = bộ kiểm luôn xanh. 25 s × mọi deploy × 7 tuần.', c: 'amb' },
    { ic: '🏷️', t: 'Diệt theo tên', d: '<code>next-server</code> không có chữ “next start”. Và lệnh diệt thoát 0 chưa là bằng chứng — hỏi lại bằng <code>ss</code>.', c: 'vio' },
    { ic: '🩹', t: 'Làm migration “idempotent”', d: 'Deploy xanh, prod thêm 1 chỉ mục + 1 khoá ngoại mà môi trường mới không có.', c: 'red' },
    { ic: '🤖', t: 'Để workflow tự resolve', d: '27 lệnh <code>resolve --rolled-back</code>: 24 lần P3012 bị <code>|| true</code> nuốt, 3 migration bị đánh dấu mà không ai đọc vì sao.', c: 'ora' },
  ], 3) },

  /* 31 */ { t: 'Bảng tra nhanh Chương 10', body: table(['Muốn biết', 'Lệnh'], [
    ['Route có trong bản dựng đang chạy?', '<code>curl -s -o /dev/null -w "%{http_code}" …/api/v1/X</code> — 401/200 có, 404 không'],
    ['tsc có mở tệp này không?', '<code>npx tsc --listFilesOnly | grep prisma/</code>'],
    ['Seed có chạy được với schema mới?', '<code>npm run typecheck:seed &amp;&amp; npx prisma db seed</code> (DB thật)'],
    ['Bộ kiểm có biết đỏ không?', 'chạy nó qua trang 500 + container dừng; phải thoát ≠ 0'],
    ['Ai đang giữ cổng?', '<code>ss -ltnp "sport = :3000"</code> · Mac: <code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code>'],
    ['Diệt theo cổng', '<code>fuser -k 3000/tcp</code> · Mac: <code>lsof -ti:3000 | xargs -r kill -9</code> — rồi hỏi lại'],
    ['Migration nào đang hỏng?', '<code>npx prisma migrate status</code> · bảng <code>_prisma_migrations</code>'],
    ['DB lệch gì so với mô hình?', '<code>prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-url "$DB" --script</code>'],
    ['Chỉ mục dở dang sau CONCURRENTLY?', '<code>select relname from pg_index i join pg_class c on c.oid=i.indexrelid where not indisvalid</code>'],
  ], { sm: true }) },

  /* 32 */ { t: 'Thực hành Chương 10 (60–90 phút) trên kho của bạn', body: two(list([
    '<strong>1.</strong> Viết smoke-test danh sách TRẮNG cho 3 route; chạy nó qua ảnh cũ (thiếu 1 route), trang 500, container dừng.',
    '<strong>2.</strong> <code>tsc --listFilesOnly</code>: tìm mọi thư mục có mã mà tsc KHÔNG mở. Thêm một tsconfig noEmit cho chúng.',
    '<strong>3.</strong> Chạy seed (hoặc script dữ liệu bất kỳ) trong job có service <code>postgres:16</code>; làm nó hỏng một dòng, bắt nó thoát ≠ 0.',
    '<strong>4.</strong> Dựng Next: thêm tệp vào <code>public/</code> sau khi khởi động → 404; diệt theo cổng; xác nhận bằng <code>ss</code>; → 200.',
    '<strong>5.</strong> Tái lập P3018 → P3009 bằng <code>db push</code> rồi <code>migrate deploy</code>; đọc <code>_prisma_migrations</code>; KHÔNG resolve.',
  ]), box('good', '<strong>Đạt khi</strong> bạn có: bảng 3 bộ kiểm × 3 kịch bản với đúng một cột xanh; số tệp tsc mở trước/sau; một run seed ĐỎ vì thoát ≠ 0; PID server trước/sau khi diệt khác nhau; và log P3009 kèm dòng <code>_prisma_migrations</code> của migration hỏng.<br><br>Dọn: xoá workflow thử, <code>docker rm -f</code> container đã đặt tên.')) },
]);
