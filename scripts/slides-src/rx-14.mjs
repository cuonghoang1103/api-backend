/**
 * React · Deck rx-14 — Chương 14: Lên production (chương cuối).
 *
 * MỌI số liệu/output trên slide là THẬT, chạy 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch14
 * (chép từ ảnh chụp sau-ch13, 181 test xanh → 208 test sau chương) —
 * react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · msw 2.15.0 · @tanstack/react-query 5.103.3 ·
 * zod 4.6.5 · rollup-plugin-visualizer 7.1.1 · Chromium 149 (playwright-core) · nginx 1.27.5 (Docker) · Node 22.21.0.
 *   src/shared/api/http.test.ts (401 → làm mới) · src/vi-du/ch14/lam-moi-ngay-tho.test.ts · src/app/phien.test.tsx
 *   src/app/do-ben.test.tsx · do/ch14-phien.mjs (Chromium) · do/ch14-header.sh · do/ch14-csp.mjs · do/ch14-base.mjs
 *   scripts/kiem-kich-thuoc.mjs · chay-ci.sh (các bước CI trên bản clone sạch)
 * Ảnh chụp: scripts/slides-src/rx-anh/rx-14/*.jpg.
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, anh, steps, kpis, bars, flow,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-14', code: 'REACT · CHƯƠNG 14', title: 'Lên production', sub: 'React · Chương 14' };

const t = (lines, title, fs = 14) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────── Slide 4 — đăng nhập trả HAI thứ, cất ở HAI nơi ───────── */
const haiToken = () => {
  let s = '';
  // cột trình duyệt
  s += R(10, 10, 560, 400, { c: 'dim', dash: true, r: 14 }) + T(290, 40, 'Trình duyệt', { fs: 18, c: 'mu', a: 'middle', b: true });
  s += R(30, 60, 520, 150, { c: 'rx' }) + T(50, 92, 'Mã JavaScript của app', { fs: 17, c: 'rx', b: true });
  s += T(50, 124, 'accessToken — biến trong bộ nhớ (Zustand)', { fs: 15.5 });
  s += T(50, 150, '• sống 15 phút · F5 là mất (cố ý)', { fs: 14.5, c: 'mu' });
  s += T(50, 174, '• gửi kèm: Authorization: Bearer …', { fs: 14.5, c: 'mu', mono: true });
  s += T(50, 198, '• script bị chèn (XSS) đọc được — nhưng chỉ 15 phút', { fs: 14, c: 'amb' });
  s += R(30, 232, 520, 158, { c: 'grn', fill: '#0f2a1a' }) + T(50, 264, 'Kho cookie của trình duyệt', { fs: 17, c: 'grn', b: true });
  s += T(50, 296, 'rt=… HttpOnly; Secure; SameSite=Strict; Path=/api', { fs: 15, mono: true });
  s += T(50, 322, '• sống 7 ngày · xoay vòng mỗi lần dùng', { fs: 14.5, c: 'mu' });
  s += T(50, 346, '• document.cookie KHÔNG thấy — JS không đọc được', { fs: 14.5, c: 'mu' });
  s += T(50, 370, '• trình duyệt tự gửi kèm khi gọi /api/…', { fs: 14.5, c: 'mu' });
  // máy chủ
  s += R(800, 110, 340, 190, { c: 'vio' }) + T(970, 145, 'Máy chủ', { fs: 18, c: 'vio', a: 'middle', b: true });
  s += T(820, 180, 'POST /api/dang-nhap trả:', { fs: 15, mono: true });
  s += T(820, 210, '① body JSON { accessToken, … }', { fs: 15 });
  s += T(820, 240, '② header Set-Cookie: rt=…', { fs: 15 });
  s += T(820, 276, 'refresh token KHÔNG có trong body', { fs: 14, c: 'amb' });
  s += A(795, 190, 556, 140, { c: 'rx' }) + T(640, 150, '①', { fs: 18, c: 'rx', b: true });
  s += A(795, 250, 556, 310, { c: 'grn' }) + T(640, 300, '②', { fs: 18, c: 'grn', b: true });
  return sv(1150, 420, s);
};

/* ───────── Slide 5 — ba request cùng 401, MỘT lần làm mới ───────── */
const motLanLamMoi = () => {
  let s = '';
  const cot = [[80, 'getLichHen ①'], [80, 'getLichHen ②'], [80, 'getLichHen ③']];
  cot.forEach((_, i) => {
    const y = 40 + i * 70;
    s += R(10, y, 200, 48, { c: 'rx', r: 10 }) + T(110, y + 30, `GET /lich-hen ${'①②③'[i]}`, { fs: 15, a: 'middle', mono: true });
    s += A(214, y + 24, 330, y + 24, { c: 'red' }) + T(272, y + 16, '401', { fs: 15, c: 'red', a: 'middle', b: true });
    s += A(505, 110, 335, y + 24, { c: 'amb', dash: true });
  });
  s += R(510, 70, 300, 84, { c: 'amb', fill: '#221c0c' }) + T(660, 102, 'dangLamMoi ??= lamMoi()', { fs: 15, c: 'amb', a: 'middle', mono: true });
  s += T(660, 132, 'MỘT promise, ba người chờ', { fs: 14.5, c: 'mu', a: 'middle' });
  s += A(815, 112, 900, 112, { c: 'grn' }) + R(905, 80, 230, 64, { c: 'grn' }) + T(1020, 108, 'POST /lam-moi-token', { fs: 14.5, a: 'middle', mono: true }) + T(1020, 132, '200 · token mới', { fs: 14, c: 'grn', a: 'middle' });
  s += R(10, 260, 1125, 60, { c: 'grn', fill: '#0f2a1a' }) + T(572, 297, 'cả ba gửi lại ĐÚNG MỘT lần với token mới ⇒ 200 · 200 · 200', { fs: 16.5, c: 'grn', a: 'middle', b: true });
  return sv(1150, 330, s);
};

/* ───────── Slide 11 — Idempotency-Key: câu trả lời bị mất, lần gửi lại không đặt thêm ───────── */
const idem = () => {
  let s = '';
  s += R(20, 10, 200, 44, { c: 'rx' }) + T(120, 38, 'Trình duyệt', { fs: 16, a: 'middle', b: true });
  s += R(900, 10, 230, 44, { c: 'vio' }) + T(1015, 38, 'Máy chủ', { fs: 16, a: 'middle', b: true });
  s += A(120, 58, 120, 330, { c: 'dim', dash: true, sw: 2 }) + A(1015, 58, 1015, 330, { c: 'dim', dash: true, sw: 2 });
  s += A(124, 90, 1010, 90, { c: 'rx' }) + T(560, 82, 'POST /api/lich-hen · Idempotency-Key: K', { fs: 15, a: 'middle', mono: true });
  s += R(1030, 100, 110, 40, { c: 'grn' }) + T(1085, 126, 'tạo lh-1', { fs: 14.5, a: 'middle' });
  s += A(1010, 160, 520, 160, { c: 'red', dash: true }) + T(500, 166, '✕', { fs: 22, c: 'red', a: 'middle', b: true }) + T(770, 152, '201 lh-1 — mất trên đường về (hết giờ)', { fs: 14.5, c: 'red', a: 'middle' });
  s += A(124, 220, 1010, 220, { c: 'amb' }) + T(560, 212, 'thử lại: POST … Idempotency-Key: K (CÙNG khoá)', { fs: 15, a: 'middle', mono: true, c: 'amb' });
  s += R(1030, 232, 110, 40, { c: 'amb' }) + T(1085, 258, 'đã có K', { fs: 14.5, a: 'middle' });
  s += A(1010, 295, 124, 295, { c: 'grn' }) + T(560, 287, '201 lh-1 — đúng lịch cũ, KHÔNG đặt thêm', { fs: 15, c: 'grn', a: 'middle', b: true });
  return sv(1150, 330, s);
};

/* ───────── Slide 18 — nginx: location có add_header thì bỏ add_header của server ───────── */
const nginxKe = () => {
  let s = '';
  s += R(10, 10, 540, 250, { c: 'red' }) + T(30, 42, 'SAI — header ở server {}', { fs: 17, c: 'red', b: true });
  s += T(30, 76, 'server {', { fs: 15, mono: true }) + T(50, 100, 'include bao-mat.conf;   # CSP…', { fs: 15, mono: true, c: 'amb' });
  s += T(50, 128, 'location /assets/ {', { fs: 15, mono: true }) + T(70, 152, 'add_header Cache-Control …;', { fs: 15, mono: true }) + T(50, 176, '}', { fs: 15, mono: true });
  s += T(30, 212, '⇒ location có add_header riêng', { fs: 15, c: 'mu' }) + T(30, 238, '⇒ header của server BỊ BỎ: 0/4', { fs: 15.5, c: 'red', b: true });
  s += R(600, 10, 540, 250, { c: 'grn' }) + T(620, 42, 'ĐÚNG — include trong từng location', { fs: 17, c: 'grn', b: true });
  s += T(620, 76, 'location /assets/ {', { fs: 15, mono: true }) + T(640, 100, 'add_header Cache-Control …;', { fs: 15, mono: true }) + T(640, 124, 'include bao-mat.conf;', { fs: 15, mono: true, c: 'grn' }) + T(620, 148, '}', { fs: 15, mono: true });
  s += T(620, 176, 'location ~ \\.map$ { return 404; }', { fs: 15, mono: true });
  s += T(620, 212, '⇒ mọi trả lời đều mang đủ header', { fs: 15, c: 'mu' }) + T(620, 238, '⇒ đo: 4/4 · file .map ⇒ 404', { fs: 15.5, c: 'grn', b: true });
  return sv(1150, 270, s);
};

/* ───────── Slide 20 — pipeline CI ───────── */
const ongCi = () => {
  let s = '';
  const buoc = ['npm ci', 'tsc -b', 'vitest run', 'vite build', 'ngân sách', 'xoá .map'];
  s += R(10, 20, 1130, 110, { c: 'rx', dash: true }) + T(26, 46, 'job kiem-tra — mọi push và PR', { fs: 16, c: 'rx', b: true });
  buoc.forEach((b, i) => {
    const x = 30 + i * 185;
    s += R(x, 64, 160, 50, { c: i === 4 ? 'amb' : 'blu', r: 10 }) + T(x + 80, 95, b, { fs: 15.5, a: 'middle', mono: true });
    if (i < buoc.length - 1) s += A(x + 162, 89, x + 183, 89, { c: 'mu', sw: 2.5 });
  });
  s += A(575, 134, 575, 170, { c: 'grn' }) + T(590, 158, 'xanh + push lên main', { fs: 14.5, c: 'grn' });
  const buoc2 = ['build demo --base=/repo/', 'cp index.html 404.html', 'upload-pages-artifact@v5', 'deploy-pages@v5'];
  s += R(10, 175, 1130, 110, { c: 'grn', dash: true }) + T(26, 201, 'job deploy — cần kiem-tra · quyền pages: write, id-token: write', { fs: 16, c: 'grn', b: true });
  buoc2.forEach((b, i) => {
    const x = 30 + i * 278;
    s += R(x, 220, 255, 50, { c: 'grn', r: 10 }) + T(x + 127, 251, b, { fs: 14, a: 'middle', mono: true });
    if (i < buoc2.length - 1) s += A(x + 257, 245, x + 276, 245, { c: 'mu', sw: 2.5 });
  });
  return sv(1150, 295, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 14 — Lên production', sub: 'Đăng nhập & token · 401 → làm mới · lỗi mạng & báo lỗi · biến môi trường · build & đo bundle · CSP · CI/CD · phỏng vấn middle · thi cuối khoá', chap: 'CHƯƠNG 14' }),

  /* 2 */ { t: 'Bản đồ chương: từ máy của bạn tới người dùng thật', body: mindmap('Lên production', 'app đặt lịch · 181 → 208 test · chương cuối', [
    { t: '14.1 Xác thực', d: 'token · cookie HttpOnly · 401 → làm mới · mọi tab', c: 'rx' },
    { t: '14.2 API thật', d: 'hết giờ · thử lại có trần · offline · báo lỗi · env', c: 'vio' },
    { t: '14.3 Build & deploy', d: 'bỏ MSW · đo bundle · CSP · CI · Pages', c: 'grn' },
    { t: '14.4 Phỏng vấn', d: 'checklist middle · 15 câu có ý trả lời', c: 'amb' },
    { t: '🎓 Thi cuối khoá', d: '20 câu · 30 phút · Mục 0 → Ch14', c: 'tea' },
  ]) },

  /* ───── 14.1 ───── */
  /* 3 */ { t: 'Cất token: bộ nhớ + cookie HttpOnly, không localStorage', body: table(['Chỗ cất', 'Script bị chèn (XSS) đọc được?', 'Sống qua F5?', 'Tự gửi kèm (CSRF)?', 'Hợp cho'], [
    ['<code>localStorage</code>', 'CÓ — lấy đi dùng ở máy khác', '+có', '+không', 'dữ liệu không nhạy cảm (tên để chào)'],
    ['<code>sessionStorage</code>', 'CÓ', 'có (cùng tab)', '+không', 'nháp form một tab'],
    ['biến trong bộ nhớ', 'CÓ nhưng chỉ lúc trang còn mở', 'không', '+không', '+<strong>access token</strong> (15 phút)'],
    ['cookie <code>HttpOnly</code>', '+KHÔNG', '+có', 'có ⇒ cần <code>SameSite</code>', '+<strong>refresh token</strong> (7 ngày)'],
  ], { sm: true }) + box('tip', 'Không cách nào “an toàn trước XSS” nếu XSS đã chạy — nó gọi API ngay trong trang. Mục tiêu: <strong>token dài hạn không bị lấy mang đi</strong>, và thiệt hại có hạn (15 phút).') },

  /* 4 */ { t: 'Đăng nhập trả hai thứ, cất ở hai nơi khác nhau', body: haiToken() },

  /* 5 */ { t: '401 → làm mới MỘT lần chung → gửi lại MỘT lần', body: `${motLanLamMoi()}
    ${t(['$ npx vitest run src/shared/api/http.test.ts', '[14.1] GET /api/lich-hen → POST /api/lam-moi-token → GET /api/lich-hen', '+[14.1] ba request cùng lúc: GET 6 lần, làm mới 1 lần', '-[14.1] phiên hết thật: GET /api/lich-hen → POST /api/lam-moi-token ⇒ LoiApi: Phiên đăng nhập đã hết hạn', '+      Tests  8 passed (8)'], '8 test tầng gọi API', 13)}` },

  /* 6 */ { t: 'Bản ngây thơ: ba lần làm mới, bị đăng xuất oan', body: two(
    t(['$ npx vitest run src/vi-du/ch14', '# mỗi request tự gọi lamMoiToken(), không ai chờ ai', '- [ngây thơ] mã trả về của 3 request: 200, 401, 401', '-   | làm mới: 3 lần | còn đăng nhập? false', '', '# http.ts: dangLamMoi ??= … (dùng chung)', '+ ba request cùng lúc: GET 6 lần, làm mới 1 lần'], 'cùng tình huống, hai cách viết', 13.5),
    `${box('bad', 'Refresh token <strong>xoay vòng</strong>: dùng một lần là bị thu hồi. Lần làm mới thứ 1 thắng; lần 2 và 3 mang token ĐÃ thu hồi ⇒ 401 ⇒ app tưởng phiên hết ⇒ đá người dùng ra.')}
     ${box('good', 'Một promise dùng chung (<em>single-flight</em>): ai tới sau chỉ <code>await</code> cùng promise đang chạy.')}
     ${box('warn', 'Chặn vòng lặp: gửi lại <strong>tối đa một lần</strong>; <code>/api/dang-nhap</code>, <code>/api/lam-moi-token</code> gọi với <code>xacThuc: false</code> — sai mật khẩu KHÔNG phải token hết hạn.')}`) },

  /* 7 */ { t: 'Chromium thật: token hết hạn, F5, đăng xuất tab kia', body: two(
    anh('rx-14', 'da-dang-nhap.jpg', { w: 540, url: 'localhost:4173/lich-hen?het-han=5', cap: 'bản demo · đăng nhập 0901234567' }),
    t(['[2] document.cookie = ""', '    cookie THẬT của trình duyệt: (không có)', '    __msw-cookie-store__ chứa "rt=" · httpOnly: true', '[3] sau 5,5 giây, mở /lich-hen:', '+   GET 401 → POST /api/lam-moi-token 200 → GET 200', '[4] F5 ở /lich-hen:', '+   GET 401 → … → POST lam-moi-token 200 → GET 200', '[5] tab A đăng xuất ⇒ tab B tự sang: /dang-nhap', '    · POST /api/dang-xuat 204'], 'node do/ch14-phien.mjs · Chromium 149', 12.5), 'w45') },

  /* 8 */ { t: 'Đăng xuất không dọn cache: Nam thấy lịch của Ánh', body: two(
    t(['$ npx vitest run src/app/phien.test.tsx', '# Ánh đăng xuất · Nam đăng nhập trên cùng máy', '- KHÔNG ketNoiPhien — Nam thấy:', '-   {"ngayKhiVao":"BS. Trần Thu Hà",', '-    "sau1Giay":"BS. Trần Thu Hà"}', '+ CÓ ketNoiPhien — Nam thấy:', '+   {"ngayKhiVao":"(chưa có)",', '+    "sau1Giay":"BS. Phạm Ngọc Lan"}', '+ tab B đăng xuất ⇒ tab A: {"nguoiDung":null,', '+   "accessToken":null}'], 'lịch của Ánh là BS. Trần Thu Hà', 13),
    `${box('bad', 'Cache <code>["lich-hen"]</code> còn dữ liệu của Ánh ⇒ vẽ ngay. Tệ hơn: một GET mang token của Ánh còn đang bay; Nam vào trang, TanStack <strong>gộp</strong> vào đúng request đó.')}
     ${box('good', '<code>ketNoiPhien</code>: nghe store — <code>nguoiDung</code> từ có → null ⇒ <code>removeQueries({ queryKey: khoa.lichHen })</code>.')}
     ${box('tip', 'Chắc hơn nữa: đưa id người dùng vào query key (<code>[\'lich-hen\', sdt]</code>) ⇒ không bao giờ gộp nhầm người.')}`) },

  /* ───── 14.2 ───── */
  /* 9 */ { t: 'Ba kiểu hỏng khác nhau, bắt thành ba lỗi khác nhau', body: two(
    table(['Chuyện xảy ra', 'fetch làm gì', 'goiApi ném'], [
      ['Máy chủ trả 4xx/5xx', 'resolve, <code>res.ok = false</code>', '<code>LoiApi(status)</code>'],
      ['Không tới được máy chủ', 'reject <code>TypeError</code>', '<code>LoiMang(\'mat-mang\')</code>'],
      ['Chờ quá 10 giây', 'reject (TimeoutError)', '<code>LoiMang(\'het-gio\')</code>'],
      ['Người gọi huỷ (rời trang)', 'reject <code>AbortError</code>', 'để nguyên — không phải lỗi'],
    ], { sm: true }),
    yaml([
      ['const henGio = AbortSignal.timeout(10_000);', 'hết giờ'],
      ['const tinHieu = signal', 'TanStack huỷ'],
      ['  ? AbortSignal.any([signal, henGio])', 'gộp hai lý do'],
      ['  : henGio;', ''],
      ['try { return await fetch(url, { signal:', ''],
      ['      tinHieu, credentials: "include" }) }', 'gửi cookie'],
      ['catch (loi) {', ''],
      ['  if (signal?.aborted) throw loi;', 'tự huỷ'],
      ['  if (henGio.aborted) throw new LoiMang("het-gio"…)', ''],
      ['  throw new LoiMang("mat-mang"…)', ''],
      ['}', ''],
    ], { fs: 13.5, lang: 'tsx' }), 'w50') },

  /* 10 */ { t: 'Thử lại có trần, có jitter, chỉ lỗi có thể tự khỏi', body: two(
    `${table(['Lỗi', 'Thử lại?'], [
      ['<code>LoiMang</code> (mất mạng, hết giờ)', '+có'],
      ['5xx · 408 · 429', '+có'],
      ['401 (http.ts đã làm mới rồi)', 'không'],
      ['400 · 404 · 409', 'không — thử lại vẫn vậy'],
      ['sau 3 lần', 'dừng, báo người dùng'],
    ], { sm: true })}
     ${box('tip', 'Chờ: 1 s → 2 s → 4 s (trần 8 s), mỗi lần <strong>nửa cố định + nửa ngẫu nhiên</strong> — 10.000 trình duyệt không thử lại cùng một mili giây.')}`,
    t(['$ npx vitest run src/app/do-ben.test.tsx', '# máy chủ trả 503, 503 rồi mới 200', '+[14.2] số request: 3 · failureCount lúc xong: 0', '+       · bác sĩ: 6', '', '$ npx vitest run src/app/query-client.test.ts', '# treThuLai(n): chờ ít nhất · nhiều nhất (ms)', '0 · 501 · 998', '1 · 1000 · 2000', '2 · 2003 · 3999', '3 · 4006 · 8000', '4 · 4005 · 7997', '5 · 4005 · 7995'], 'đo 1000 lần mỗi mức', 13.5)) },

  /* 11 */ { t: 'Lệnh GHI chỉ được thử lại khi có Idempotency-Key', body: `${idem()}
    ${t(['$ npx vitest run src/app/do-ben.test.tsx -t Idempotency', '+[14.2] cùng khoá: lh-1 lh-1 · số lịch trong CSDL: 1', '-        không khoá: 409 Khung giờ này vừa có người đặt'], 'lần gửi lại không khoá bị coi là lịch mới ⇒ người dùng thấy lỗi dù đã đặt được', 13)}` },

  /* 12 */ { t: 'Mất mạng: báo cho người, TanStack tạm dừng query', body: two(
    anh('rx-14', 'mat-mang.jpg', { w: 580, url: 'localhost:4173/bac-si', cap: 'context.setOffline(true) — Chromium 149' }),
    `${t(['[14.2] offline 300 ms: status=pending', '        · fetchStatus=paused · request đã gửi: 0', '+[14.2] online lại: status=success', '+        · request đã gửi: 1'], 'onlineManager.setOnline(false)', 13.5)}
     ${list(['<code>useSyncExternalStore</code> + sự kiện <code>online</code>/<code>offline</code>', '<code>onLine === false</code> chắc chắn mất; <code>true</code> chưa chắc tới được máy chủ', 'TanStack v5 mặc định coi là có mạng, chỉ đổi khi có sự kiện'])}`, 'w50') },

  /* 13 */ { t: 'Báo lỗi: lỗi phải tự về tới đội, không nằm ở console', body: two(
    yaml([
      ['createRoot(root, {', 'React 19'],
      ['  onCaughtError: (loi, info) =>', 'boundary đã bắt'],
      ['    baoLoi(loi, "react", info.componentStack),', ''],
      ['  onUncaughtError: (loi, info) =>', 'không ai bắt'],
      ['    baoLoi(loi, "react-khong-ai-bat", …),', ''],
      ['});', ''],
      ['window "error" · "unhandledrejection"', 'ngoài React'],
      ['', ''],
      ['baoLoi: bỏ LoiMang, 4xx, AbortError', 'nhiễu'],
      ['       trùng ⇒ bỏ · tối đa 10/trang', 'vòng lặp lỗi'],
      ['       + phienBan + pathname (không ?query)', ''],
      ['       ⇒ navigator.sendBeacon(URL, json)', 'kể cả khi đóng tab'],
    ], { fs: 13.5, lang: 'tsx' }),
    `${t(['[14.2] báo cáo: {"ten":"TypeError","noi":"react",', ' "duongDan":"/","phienBan":"dev", …', ' "componentStack":"at NoTung (…)"}', '+ ✓ lỗi render bị RanhGioiLoi bắt ⇒ React 19 gọi', '+   onCaughtError ⇒ baoLoi gửi MỘT báo cáo có componentStack', '+ ✓ baoLoi bỏ nhiễu: mất mạng, 4xx, lỗi trùng', '#   (50 lần cùng một lỗi ⇒ 1 báo cáo)'], 'src/app/do-ben.test.tsx', 13)}
     ${box('info', 'Sentry / GlitchTip / Datadog làm đúng việc này ở quy mô lớn: gom nhóm, source map, phiên bản, cảnh báo.')}`, 'w55') },

  /* 14 */ { t: 'Biến VITE_ nằm nguyên văn trong bundle: không bí mật', body: two(
    t(['# .env.local (thử)', 'VITE_KHOA_GIPHY=gph_ThuNghiem_123', 'KHOA_DB=postgres://admin:matkhau@db:5432/…', '', '$ npx tsc -b   # env.d.ts bật strictImportMetaEnv', "- main.tsx(68,39): TS2339: Property 'VITE_KHOA_GIPHY'", "-   does not exist on type 'ImportMetaEnv'.", '', '$ npx vite build && grep …', '- dist/assets/index-….js:gph_ThuNghiem_123', '- console.log(`giphy:`,`gph_ThuNghiem_123`,`· db:`,void 0)'], 'đo thật — Vite 8.3.1', 13),
    `${list(['<code>VITE_*</code> được <strong>thay chữ</strong> vào JS lúc build ⇒ ai cũng đọc được bằng View Source', 'biến không có tiền tố ⇒ <code>undefined</code> ở trình duyệt, chỉ dùng trong <code>vite.config</code> (<code>loadEnv</code>)', 'đổi <code>.env</code> ⇒ phải <strong>build lại</strong>, restart không đủ', '<code>.env</code>, <code>.env.[mode]</code> commit được; <code>*.local</code> thì không'])}
     ${box('warn', 'Khoá bên thứ ba (bản đồ, AI, gửi mail…) ⇒ gọi qua <strong>backend của bạn</strong>, khoá nằm ở máy chủ.')}`) },

  /* ───── 14.3 ───── */
  /* 15 */ { t: 'Hai bản build: production bỏ MSW, bản demo giữ lại', body: `${bars([
    { l: 'production — tổng JS', v: 600.9, txt: '600,9 kB · gzip 196,3', c: 'grn' },
    { l: 'demo (MSW) — tổng JS', v: 1031.3, txt: '1.031,3 kB · gzip 356,8', c: 'amb' },
    { l: 'chunk MSW (browser-*.js)', v: 430.46, txt: '430,5 kB — chỉ ở demo', c: 'red' },
  ], { lw: 300 })}
    ${two(yaml([
      ['if (!import.meta.env.DEV', 'false lúc build'],
      ['    && import.meta.env.VITE_API_GIA !== "1")', 'undefined lúc build'],
      ['  return;', ''],
      ["const { worker } = await import('./mocks/browser');", ''],
    ], { fs: 13.5, lang: 'tsx' }), t(['# bản production, đã rút gọn:', '+ async function el(){}', '# cả nhánh MSW và import() biến mất', '# public/mockServiceWorker.js vẫn bị chép', '#   ⇒ plugin bo-worker-msw xoá nó sau build'], 'dist/assets/index-*.js', 13))}` },

  /* 16 */ { t: 'Mổ bundle: react-dom và router chiếm phần lớn', body: two(
    anh('rx-14', 'phan-tich.jpg', { w: 640, url: 'bao-cao/phan-tich.html', cap: 'rollup-plugin-visualizer 7.1.1 · treemap' }),
    t(['$ node do/phan-tich-bundle.mjs dist/assets/index-*.js', 'index-B-6GtYu3.js — 379.8 kB', '  react-dom              207.2 kB', '  react-router            95.4 kB', '  src/ (mã của app)       47.6 kB', '  @tanstack/query-core    20.4 kB', '+ @tanstack/react-query-devtools 0.0 kB', '', 'TrangDatLich-….js — 119.9 kB (tải lười)', '  zod                     77.4 kB', '  react-hook-form         29.6 kB'], 'đọc source map', 13), 'w55') },

  /* 17 */ { t: 'Ngân sách kích thước: CI đỏ khi lỡ bỏ tải lười', body: two(
    t(['$ node scripts/kiem-kich-thuoc.mjs', 'Tải lúc đầu (4 file JS): 129.6 kB gzip / trần 140 kB', '+ ✓ trong ngân sách', '', '# "lỡ tay": TrangDatLich import thẳng, bỏ lazy', '$ npx vite build --outDir dist-vuot', '- dist-vuot/assets/index-B1tjswCy.js 514.62 kB │ gzip: 163.35 kB', '$ node scripts/kiem-kich-thuoc.mjs dist-vuot', '- Tải lúc đầu (3 file JS): 165.9 kB gzip / trần 140 kB', '- ✗ VƯỢT NGÂN SÁCH: tải lúc đầu 165.9 kB > 140 kB', '- exit=1'], 'đo gzip — thứ thật sự đi qua mạng', 13),
    `${list(['“tải lúc đầu” = mọi <code>.js</code> mà <code>index.html</code> trỏ tới', 'trần cao hơn hiện tại một chút: bắt <strong>tăng đột biến</strong>, không ép từng byte', 'chunk lười có trần riêng (60 kB gzip)'])}
     ${box('good', 'Chạy trong CI ⇒ PR làm bundle phình 36 kB bị chặn ngay khi review, không phải sau khi người dùng than chậm.')}`) },

  /* 18 */ { t: 'nginx: add_header trong location xoá header của server', body: `${nginxKe()}
    ${t(['$ bash do/ch14-header.sh   # nginx 1.27.5 · Docker', '- sai : /bac-si/bs-2 → 0 header bảo mật · /assets/index-….js → 0', '+ đúng: /bac-si/bs-2 → 4                · /assets/index-….js → 4', '+ đúng: /assets/index-….js.map → 404      - sai: → 200 (lộ mã nguồn)'], 'curl -sI … | grep -ciE "content-security|nosniff|referrer|permissions"', 13)}` },

  /* 19 */ { t: 'CSP đo thật: Zod 4 gây vi phạm cho tới khi tắt JIT', body: two(
    t(['$ node do/ch14-csp.mjs   # bản demo sau nginx + CSP', '- đi qua 4 trang + đăng nhập: 3 vi phạm, 0 lỗi trang', '-   script-src ← eval   (×3)', '', "# schema.ts: z.config({ jitless: true })", '+ đi qua 4 trang + đăng nhập: 0 vi phạm, 0 lỗi trang', '', '# chèn thử <img onerror> + fetch ra ngoài:', '+ window.__xss = undefined', '+   script-src-attr ← inline', '+   connect-src ← https://example.com/lay-du-lieu'], 'Chromium 149 · securitypolicyviolation', 13),
    `${box('info', "<code>script-src 'self'</code>: chỉ chạy file JS của chính site. Bản build Vite không có script inline nào ⇒ không cần <code>'unsafe-inline'</code>.")}
     ${box('warn', 'Zod 4 thử <code>new Function("")</code> một lần để xem có sinh mã nhanh được không. Bị CSP chặn thì Zod vẫn chạy — nhưng mỗi lần là một vi phạm trong báo cáo.')}
     ${box('good', 'CSP là lớp <strong>thứ hai</strong> sau React thoát ký tự + DOMPurify (Bài 13.4): mã lạ lọt vào DOM vẫn không chạy.')}`) },

  /* 20 */ { t: 'CI/CD: kiểm trên mọi PR, deploy khi main xanh', body: `${ongCi()}
    ${t(['$ bash chay-ci.sh   # đúng các bước job kiem-tra, trên bản clone SẠCH', '+ npm ci 2 s · tsc -b 3 s · vitest 208 passed 15 s · vite build 2 s · ngân sách ✓ 1 s · .map còn: 0'], 'máy dựng bài · Node 22.21', 13)}` },

  /* 21 */ { t: 'Thư mục con: base của Vite + basename của Router', body: two(
    t(['$ npx vite build --mode demo --base=/phong-kham/', '  src="/phong-kham/assets/index-C6wqMOAo.js"', '', '$ node do/ch14-base.mjs dist-base "có basename"', '+ /phong-kham/bac-si ⇒ h2 "Đội ngũ bác sĩ (6)"', '+   link "Bác sĩ" href=/phong-kham/bac-si', '', '# cùng build, THIẾU basename', '- /phong-kham/bac-si ⇒ "404 — Không có trang', '-   “/phong-kham/bac-si”" · href=/bac-si'], 'vite preview --base /phong-kham/ · Chromium', 13),
    `${list(['GitHub Pages: <code>https://&lt;user&gt;.github.io/&lt;repo&gt;/</code>', '<code>base</code> sửa đường dẫn FILE (JS, CSS); <code>basename</code> sửa đường dẫn TRANG', '<code>createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })</code>', 'Pages không có rewrite ⇒ chép <code>index.html</code> thành <code>404.html</code>'])}
     ${box('tip', 'Host có rewrite (Netlify <code>_redirects</code>, Vercel, nginx) — xem Bài 10.4. Deploy Next.js: khoá Next.js Chương 20.')}`) },

  /* ───── 14.4 ───── */
  /* 22 */ { t: 'Checklist production: mỗi dòng đều kiểm được', body: cards([
    { ic: '🔐', t: 'Phiên đăng nhập', d: 'token trong bộ nhớ, refresh HttpOnly, 401 → làm mới một lần, đăng xuất dọn cache.', c: 'rx' },
    { ic: '🌐', t: 'Lỗi mạng', d: 'timeout, thử lại có trần, mất mạng có báo, lệnh ghi có Idempotency-Key.', c: 'vio' },
    { ic: '🚨', t: 'Báo lỗi', d: 'onCaughtError/onUncaughtError + window ⇒ dịch vụ báo lỗi, có phiên bản.', c: 'red' },
    { ic: '🔑', t: 'Biến môi trường', d: 'không bí mật trong VITE_*; env.d.ts có kiểu; .env.local không commit.', c: 'amb' },
    { ic: '📦', t: 'Bundle', d: 'không MSW/devtools ở production, ngân sách trong CI, route tải lười.', c: 'grn' },
    { ic: '🛡', t: 'Header', d: 'CSP, nosniff, Referrer-Policy, frame-ancestors; .map không công khai.', c: 'tea' },
  ], 3) + box('info', 'Cộng bốn dòng đã có từ Chương 10: SPA fallback, cache <code>/assets/</code> 1 năm + <code>index.html</code> no-cache, tab cũ sau deploy, axe sạch.') },

  /* 23 */ { t: 'Middle: tự làm trọn một tính năng, từ API tới deploy', body: table(['Mảng', 'Junior', 'Middle — người phỏng vấn muốn nghe'], [
    ['Render & state', 'dùng useState, useEffect', 'vì sao render lại, state để đâu, khi nào KHÔNG cần effect'],
    ['Dữ liệu', 'fetch trong effect', 'cache, invalidate, lạc quan, race, huỷ request'],
    ['Hiệu năng', '“dùng useMemo cho nhanh”', 'đo bằng Profiler trước, rồi memo/lazy/virtualize'],
    ['Chất lượng', 'test thử vài cái', 'test theo hành vi, MSW, a11y, CI đỏ khi hỏng'],
    ['Production', 'npm run build', 'auth + 401, lỗi mạng, env, bundle, CSP, deploy'],
    ['Giao tiếp', 'làm theo ticket', 'hỏi lại yêu cầu, ước lượng, nói được đánh đổi'],
  ], { sm: true }) },

  /* 24 */ { t: 'Trả lời theo khung: ý chính, cơ chế, số đo, đánh đổi', body: two(
    steps([
      ['1 · Ý chính một câu', '“Access token để trong bộ nhớ, refresh token trong cookie HttpOnly.”'],
      ['2 · Cơ chế', 'vì sao: XSS đọc được localStorage; cookie HttpOnly thì không; SameSite chặn CSRF.'],
      ['3 · Ví dụ thật có số', '“Ba request cùng 401 làm mới ba lần ⇒ bị đăng xuất oan; sửa bằng một promise chung.”'],
      ['4 · Đánh đổi', 'cookie cần cùng site hoặc CORS có credentials; F5 phải gọi làm mới một lần.'],
    ]),
    `${box('good', 'Dự án đặt lịch này là câu chuyện của bạn: mỗi chương để lại <strong>một con số</strong> đo thật để kể.')}
     ${box('warn', 'Không biết thì nói “chưa làm, nhưng tôi sẽ tìm hiểu bằng cách…” — bịa là mất điểm nhanh nhất.')}`, 'w55') },

  /* 25 */ { t: '15 câu phỏng vấn của bài 14.4 rải khắp khoá', body: cards([
    { ic: '⚛', t: 'Nền tảng (1–4)', d: 'render/commit · key · state bất biến · khi nào không cần effect', c: 'rx' },
    { ic: '🗂', t: 'State & dữ liệu (5–8)', d: 'đặt state ở đâu · Zustand vs Context · TanStack Query · race', c: 'vio' },
    { ic: '⚡', t: 'Hiệu năng (9–10)', d: 'đo trước khi memo · Compiler, lazy, virtualize', c: 'grn' },
    { ic: '🧪', t: 'Chất lượng (11–12)', d: 'test gì · a11y và XSS', c: 'amb' },
    { ic: '🚀', t: 'Production (13–15)', d: 'token & 401 · env & bundle · CI/CD và deploy', c: 'red' },
  ], 3) },

  /* 26 */ { t: 'Sai lầm hay gặp ở Chương 14', body: cards([
    { ic: '🗝', t: 'Token trong localStorage', d: 'một script bị chèn là mang token đi dùng ở máy khác.', c: 'red' },
    { ic: '🔁', t: 'Mỗi request tự làm mới', d: 'refresh xoay vòng ⇒ 200, 401, 401 ⇒ đăng xuất oan.', c: 'amb' },
    { ic: '👀', t: 'Đăng xuất không dọn cache', d: 'Nam thấy lịch của Ánh.', c: 'vio' },
    { ic: '♻', t: 'Thử lại POST không khoá', d: 'đặt được mà người dùng thấy 409.', c: 'pnk' },
    { ic: '🔓', t: 'Bí mật trong VITE_*', d: 'nằm nguyên văn trong file JS công khai.', c: 'ora' },
    { ic: '🧱', t: 'add_header ở server {}', d: 'location nào có add_header riêng là mất CSP.', c: 'blu' },
  ], 3) },

  /* 27 */ { t: 'Bảng tra nhanh Chương 14', body: table(['Cần…', 'Dùng', 'Nhớ'], [
    ['Cất token', 'access: bộ nhớ · refresh: cookie HttpOnly', 'không localStorage; SameSite'],
    ['401', 'làm mới MỘT lần chung, gửi lại MỘT lần', 'auth endpoint <code>xacThuc: false</code>'],
    ['Đăng xuất', 'API thu hồi + xoá phiên + <code>BroadcastChannel</code>', 'dọn cache riêng tư'],
    ['Hết giờ', '<code>AbortSignal.timeout</code> + <code>AbortSignal.any</code>', 'tự huỷ ≠ lỗi mạng'],
    ['Thử lại', 'mạng/5xx/408/429, trần 3, jitter', 'POST cần Idempotency-Key'],
    ['Mất mạng', '<code>useSyncExternalStore</code> + onlineManager', 'fetchStatus paused'],
    ['Báo lỗi', '<code>onCaughtError</code>/<code>onUncaughtError</code> + window', 'bỏ nhiễu, có phiên bản'],
    ['Biến môi trường', '<code>VITE_*</code> + <code>env.d.ts</code>', 'công khai; đổi là build lại'],
    ['Bundle', 'visualizer · ngân sách trong CI', 'không MSW ở production'],
    ['Header', 'CSP, nosniff… include TỪNG location', '<code>.map</code> ⇒ 404'],
    ['Deploy thư mục con', '<code>--base</code> + <code>basename</code>', 'Pages: 404.html'],
  ], { sm: true }) },

  /* 28 */ { t: 'Tự gõ tiếp dự án: bốn bước, 27 test mới, 181 → 208', body: two(
    steps([
      ['14.1 — phiên thật', 'mock <code>/api/dang-nhap</code>, <code>/lam-moi-token</code>, <code>/dang-xuat</code> · <code>http.ts</code> 401 → làm mới · <code>ketNoiPhien</code>'],
      ['14.2 — độ bền', '<code>LoiMang</code> · <code>thongDiepLoi</code> · jitter · Idempotency-Key · dải mất mạng · <code>baoLoi</code> · <code>env.d.ts</code>'],
      ['14.3 — build & deploy', 'MSW chỉ dev/demo · visualizer · ngân sách · CSP · <code>ci.yml</code> · <code>basename</code>'],
      ['14.4 — hoàn thiện', 'README cho nhà tuyển dụng · <code>npm run kiem</code> · tự chấm'],
    ]),
    t(['$ npm run kiem', '+  Test Files  48 passed (48)', '+       Tests  208 passed (208)', '  index-B-6GtYu3.js 379.82 kB │ gzip: 121.24 kB', '+ Tải lúc đầu (4 file JS): 129.6 kB gzip / trần 140 kB', '+ ✓ trong ngân sách', '$ npx vitest run --coverage', '+ All files | 91.23 | 84.94 | 92.36 | 95.42'], 'tiêu chí đạt', 13)) },

  /* 29 */ { t: 'Thi cuối khoá: 20 câu, 30 phút, Mục 0 → Chương 14', body: `${kpis([
    { v: '20', l: 'câu tình huống', c: 'rx' },
    { v: '30 phút', l: 'một lượt làm', c: 'amb' },
    { v: '15', l: 'chương được hỏi', c: 'vio' },
    { v: '5/5/5/5', l: 'đáp án rải đều A/B/C/D', c: 'grn' },
  ])}
    ${flow([
      { t: 'Mục 0–2', d: 'JSX · component · props · key · state' },
      { t: 'Ch3–5', d: 'form · effect · chia sẻ state' },
      { t: 'Ch6–9', d: 'dữ liệu · router · hiệu năng · test' },
      { t: 'Ch10–13', d: 'dự án · bên trong · React 19 · mẫu' },
      { t: 'Ch14', d: 'token · lỗi mạng · build · deploy' },
    ])}` },
]);
