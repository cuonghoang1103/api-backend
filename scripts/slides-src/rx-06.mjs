/**
 * React · Deck rx-06 — Chương 6: Lấy dữ liệu.
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch06
 * (react 19.3.0 · @tanstack/react-query 5.103.2 · @tanstack/react-query-devtools 5.103.2 · msw 2.15.0 · vite 8.3.1 ·
 *  vitest 5.0.1 · typescript 6.0.3 · @testing-library/react 16.3.3 · jsdom 30.1.1 · Chromium của Playwright):
 *   npx msw init public --save
 *   npx vitest run --reporter=verbose        (bai1 · bai2 · bai3 · bai4 + test của dự án — 112 test)
 *   npx vite build                           (trước/sau chương)
 *   node do-cuoc-dua.mjs 30                  (Chromium thật + MSW trong trình duyệt, trễ ngẫu nhiên 100–1500 ms)
 *   node do-strict.mjs                       (vite dev + StrictMode: đếm request từng cách)
 *   node chup-app.mjs <kịch bản>             (ảnh chụp: khung xương, lỗi, rỗng, lưới giờ, giữ ngày cũ, đặt xong, huỷ lỗi, DevTools)
 * Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-06/*.jpg
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, D, compTree, anh, kpis, steps,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-06', code: 'REACT · CHƯƠNG 6', title: 'Lấy dữ liệu', sub: 'React · Chương 6' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────── Slide 3 — hai loại state ───────── */
const haiLoaiState = () => {
  let s = '';
  const cot = (x, c, tieuDe, phu, dong) => {
    s += R(x, 0, 555, 380, { c, fill: '#0f182a' }) + T(x + 24, 40, tieuDe, { fs: 22, b: true, c }) + T(x + 24, 70, phu, { fs: 15.5, c: 'mu' });
    dong.forEach(([a, b], i) => {
      const y = 100 + i * 66;
      s += R(x + 22, y, 511, 54, { c: 'dim', fill: '#0b1322', r: 10 }) + T(x + 40, y + 24, a, { fs: 17, b: true }) + T(x + 40, y + 45, b, { fs: 14, c: 'mu' });
    });
  };
  cot(0, 'grn', 'State CLIENT — của giao diện', 'chỉ trình duyệt này biết · bạn là chủ', [
    ['Bước đang ở của luồng đặt lịch', 'useReducer (Chương 5)'],
    ['Chip lọc, ô tìm', 'URL (Chương 5)'],
    ['Danh sách yêu thích', 'Zustand + persist (Chương 5)'],
    ['Thông báo nổi đang hiện', 'Zustand (bài này)'],
  ]);
  cot(585, 'rx', 'State SERVER — bản sao của dữ liệu ở xa', 'máy chủ là chủ · bạn chỉ giữ một bản chụp', [
    ['Danh sách bác sĩ', 'GET /api/bac-si'],
    ['Khung giờ còn trống', 'người khác đặt ⇒ đổi mà bạn không biết'],
    ['Lịch hẹn của tôi', 'GET /api/lich-hen · PATCH khi huỷ'],
    ['⇒ cần: tải, cache, làm mới, huỷ, thử lại', 'đó là việc của TanStack Query'],
  ]);
  return sv(1140, 384, s);
};

/* ───────── Slide 4 — MSW: đường đi của một request ───────── */
const duongMsw = () => {
  let s = '';
  const hop = (x, y, w, h, c, a, b, mono = false) => {
    s += R(x, y, w, h, { c, fill: '#0f182a' }) + T(x + w / 2, y + 34, a, { fs: 17, b: true, a: 'middle', c, mono }) + (b ? T(x + w / 2, y + 60, b, { fs: 14, a: 'middle', c: 'mu' }) : '');
  };
  s += T(0, 18, 'TRÌNH DUYỆT (npm run dev / preview)', { fs: 15, b: true, c: 'mu' });
  hop(0, 34, 230, 80, 'rx', '<KhuBacSi />', 'useBacSi()', true);
  hop(290, 34, 250, 80, 'tea', "fetch('/api/bac-si')", 'như gọi API thật', true);
  hop(600, 34, 250, 80, 'vio', 'Service Worker', 'public/mockServiceWorker.js');
  hop(910, 34, 230, 80, 'grn', 'handlers.ts', 'http.get(…) → JSON');
  s += A(234, 74, 286, 74, { c: 'mu' }) + A(544, 74, 596, 74, { c: 'mu' }) + A(854, 74, 906, 74, { c: 'mu' });
  s += `<path d="M1025 118 C1025 160 150 160 115 120" stroke="${D.grn}" stroke-width="2.5" fill="none" stroke-dasharray="7 5" marker-end="url(#m-grn)"/>`;
  s += T(570, 184, 'HttpResponse.json([...6 bác sĩ]) — trễ ngẫu nhiên 100–400 ms như mạng thật', { fs: 14.5, c: 'grn', a: 'middle' });
  s += T(0, 222, 'NODE (npx vitest run) — không có Service Worker', { fs: 15, b: true, c: 'mu' });
  hop(0, 238, 230, 70, 'rx', 'test', 'render(<KhuBacSi />)');
  hop(290, 238, 250, 70, 'tea', 'fetch của Node', 'undici');
  hop(600, 238, 250, 70, 'amb', 'setupServer()', 'msw/node chặn tầng mạng');
  hop(910, 238, 230, 70, 'grn', 'CÙNG handlers.ts', 'một nguồn cho cả hai');
  s += A(234, 273, 286, 273, { c: 'mu' }) + A(544, 273, 596, 273, { c: 'mu' }) + A(854, 273, 906, 273, { c: 'mu' });
  return sv(1140, 312, s);
};

/* ───────── Slide 7 — dòng thời gian cuộc đua ───────── */
const dongThoiGianDua = () => {
  let s = '';
  const X = (ms) => 150 + ms * 0.8; // 0 → 150px, 1200 ms → 1110px
  s += A(150, 40, 1125, 40, { c: 'mu', sw: 2 }) + T(1125, 28, 'thời gian (ms)', { fs: 13.5, c: 'mu', a: 'end' });
  [0, 50, 150, 300, 950, 1200].forEach((m) => { s += `<line x1="${X(m)}" y1="34" x2="${X(m)}" y2="46" stroke="${D.mu}" stroke-width="2"/>` + T(X(m), 64, String(m), { fs: 13, c: 'mu', a: 'middle' }); });
  s += R(X(0), 80, X(950) - X(0), 30, { c: 'amb', fill: 'rgba(255,194,51,.12)', r: 7, sw: 2 }) + T(X(0) + 10, 101, 'GET bs-1 · 900 ms (chậm)', { fs: 14.5, c: 'amb' });
  s += R(X(50), 118, X(150) - X(50), 30, { c: 'grn', fill: 'rgba(63,185,80,.14)', r: 7, sw: 2 }) + T(X(150) + 10, 139, 'GET bs-2 · 100 ms (nhanh)', { fs: 14.5, c: 'grn' });
  s += T(X(50), 176, '↑ lễ tân bấm sang bs-2', { fs: 13.5, c: 'mu', a: 'middle' });
  const hang = (y, ten, c, o300, o1200, c1200) => {
    s += R(0, y, 1140, 64, { c: 'dim', fill: '#0f182a', r: 12 }) + T(18, y + 38, ten, { fs: 16.5, b: true, c });
    s += T(X(300), y + 38, o300, { fs: 15, a: 'middle' }) + T(X(1200) - 10, y + 38, o1200, { fs: 15.5, a: 'end', b: true, c: c1200 });
  };
  s += T(X(300), 206, 'màn hình lúc 300 ms', { fs: 13.5, c: 'mu', a: 'middle' }) + T(X(1200) - 10, 206, 'lúc 1200 ms', { fs: 13.5, c: 'mu', a: 'end' });
  hang(218, 'Không dọn dẹp', 'red', 'Trần Thu Hà ✓', 'Nguyễn Minh An ✗ (bs-1 về sau, đè lên)', 'red');
  hang(290, 'Cờ bỏ qua', 'grn', 'Trần Thu Hà ✓', 'Trần Thu Hà ✓ (bs-1 về, bị lờ đi)', 'grn');
  hang(362, 'AbortController', 'grn', 'Trần Thu Hà ✓', 'Trần Thu Hà ✓ (bs-1 bị HUỶ lúc 50 ms)', 'grn');
  return sv(1140, 430, s);
};

/* ───────── Slide 10 — cây query key ───────── */
const cayKey = () => {
  let s = '';
  const nut = (x, y, w, txt, c, sub) => { s += R(x, y, w, 46, { c, fill: '#0f182a', r: 10 }) + T(x + w / 2, y + 29, txt, { fs: 15, a: 'middle', mono: true, b: true }) + (sub ? T(x + w + 12, y + 29, sub, { fs: 13.5, c: 'mu' }) : ''); };
  nut(330, 0, 200, "['bac-si']", 'rx', 'danh sách 6 bác sĩ');
  nut(40, 80, 250, "['bac-si','bs-1']", 'tea', 'hồ sơ bs-1');
  nut(610, 80, 250, "['bac-si','bs-2']", 'tea', '(chỉ là tiền tố)');
  nut(0, 160, 440, "['bac-si','bs-1','khung-gio','2026-10-01']", 'vio');
  nut(570, 160, 440, "['bac-si','bs-2','khung-gio','2026-10-02']", 'vio');
  s += A(400, 50, 190, 76, { c: 'mu', sw: 2 }) + A(460, 50, 720, 76, { c: 'mu', sw: 2 }) + A(165, 130, 165, 156, { c: 'mu', sw: 2 }) + A(735, 130, 735, 156, { c: 'mu', sw: 2 });
  nut(900, 0, 200, "['lich-hen']", 'amb');
  s += T(900, 70, 'cây riêng: lịch hẹn', { fs: 13.5, c: 'mu' });
  return sv(1140, 212, s);
};

/* ───────── Slide 11 — vòng đời một mục cache ───────── */
const vongDoi = () => {
  let s = '';
  const doan = (x, w, c, a, b) => { s += R(x, 40, w, 80, { c, fill: '#0f182a', r: 10 }) + T(x + w / 2, 72, a, { fs: 17, b: true, a: 'middle', c }) + T(x + w / 2, 100, b, { fs: 14, a: 'middle', c: 'mu' }); };
  doan(0, 200, 'amb', 'đang tải', 'status pending');
  doan(210, 300, 'grn', 'TƯƠI (fresh)', 'trong staleTime: dùng cache, KHÔNG gọi');
  doan(520, 330, 'ora', 'CŨ (stale)', 'vẫn hiện ngay · gọi lại ở nền khi…');
  doan(860, 280, 'dim', 'KHÔNG AI XEM', 'hết gcTime (5 phút) ⇒ xoá');
  s += T(0, 24, 'component gắn ⇒ fetch', { fs: 14, c: 'mu' }) + T(210, 24, 'dữ liệu về', { fs: 14, c: 'mu' }) + T(520, 24, 'hết staleTime (mặc định 0 ms!)', { fs: 14, c: 'mu' }) + T(860, 24, 'component cuối cùng tháo ra', { fs: 14, c: 'mu' });
  const ly = [['component MỚI gắn vào', 'refetchOnMount'], ['người dùng quay lại tab', 'refetchOnWindowFocus'], ['có mạng lại', 'refetchOnReconnect'], ['bạn gọi invalidateQueries', 'sau khi ghi (Bài 6.3)']];
  ly.forEach(([a, b], i) => { const y = 150 + i * 44; s += T(560, y + 20, '• ' + a, { fs: 15.5 }) + T(1130, y + 20, b, { fs: 14, c: 'tea', a: 'end', mono: true }); });
  s += A(685, 124, 685, 148, { c: 'ora', sw: 2 });
  s += R(0, 150, 510, 170, { c: 'dim', fill: '#0b1322', r: 12 });
  s += T(20, 182, 'Dự án đặt theo độ "hay đổi" của dữ liệu:', { fs: 15.5, b: true });
  s += T(20, 214, 'bác sĩ   staleTime 5 phút  (ít khi đổi)', { fs: 14.5, mono: true, c: 'grn' });
  s += T(20, 242, 'giờ khám staleTime 30 giây (người khác đặt)', { fs: 14.5, mono: true, c: 'amb' });
  s += T(20, 270, 'lịch hẹn staleTime 0       (mặc định)', { fs: 14.5, mono: true, c: 'mu' });
  s += T(20, 302, 'Đo thật: mở lại trong 5 phút ⇒ 0 request mới.', { fs: 14.5, c: 'mu' });
  return sv(1140, 330, s);
};

/* ───────── Slide 15 — luồng một mutation ───────── */
const luongMutation = () => {
  let s = '';
  const hop = (x, w, c, a, b) => { s += R(x, 0, w, 96, { c, fill: '#0f182a' }) + T(x + w / 2, 38, a, { fs: 16.5, b: true, a: 'middle', c, mono: true }) + T(x + w / 2, 70, b, { fs: 14, a: 'middle', c: 'mu' }); };
  hop(0, 200, 'rx', 'mutate(yc)', 'bấm Xác nhận');
  hop(240, 230, 'amb', 'POST /api/lich-hen', 'isPending = true');
  hop(510, 260, 'grn', 'onSettled', 'được hay lỗi đều chạy');
  hop(810, 330, 'vio', 'invalidateQueries', "['bac-si','bs-2','khung-gio']");
  s += A(204, 48, 236, 48, { c: 'mu' }) + A(474, 48, 506, 48, { c: 'mu' }) + A(774, 48, 806, 48, { c: 'mu' });
  s += `<path d="M975 100 C975 160 560 160 360 104" stroke="${D.vio}" stroke-width="2.5" fill="none" stroke-dasharray="7 5" marker-end="url(#m-vio)"/>`;
  s += T(700, 176, 'query đang có người xem ⇒ tự GET lại ⇒ 14:00 hiện “(kín)”', { fs: 14.5, c: 'vio', a: 'middle' });
  return sv(1140, 186, s);
};

/* ───────── Slide 19 — nháy ngược khi thiếu cancelQueries ───────── */
const nhayNguoc = () => {
  let s = '';
  const X = (ms) => 200 + ms * 0.8;
  s += A(200, 30, 1130, 30, { c: 'mu', sw: 2 }) + T(1130, 18, 'ms sau khi bấm Huỷ', { fs: 13.5, c: 'mu', a: 'end' });
  [0, 22, 303, 932].forEach((m) => { s += `<line x1="${X(m)}" y1="24" x2="${X(m)}" y2="36" stroke="${D.mu}" stroke-width="2"/>`; });
  const o = (x, y, w, c, txt) => { s += R(x, y, w, 44, { c, fill: '#0b1322', r: 9 }) + T(x + w / 2, y + 28, txt, { fs: 14.5, a: 'middle', b: true, c }); };
  s += R(0, 56, 1140, 118, { c: 'red', fill: '#0f182a', r: 12 }) + T(18, 88, 'Thiếu', { fs: 17, b: true, c: 'red' }) + T(18, 112, 'cancelQueries', { fs: 15, c: 'red', mono: true });
  o(X(0), 72, X(22) - X(0) + 30, 'mu', 'chờ');
  o(X(22) + 34, 72, X(303) - X(22) - 40, 'grn', 'Đã huỷ (lạc quan)');
  o(X(303), 72, X(932) - X(303) - 6, 'red', 'Chờ xác nhận ← GET cũ về đè!');
  o(X(932), 72, 1140 - X(932) - 8, 'grn', 'Đã huỷ');
  s += T(X(303), 160, '303 ms: lần tải lại đã bay TRƯỚC khi bấm Huỷ về tới, mang dữ liệu cũ', { fs: 14, c: 'mu' });
  s += R(0, 196, 1140, 92, { c: 'grn', fill: '#0f182a', r: 12 }) + T(18, 228, 'Có', { fs: 17, b: true, c: 'grn' }) + T(18, 252, 'cancelQueries', { fs: 15, c: 'grn', mono: true });
  o(X(0), 212, X(22) - X(0) + 30, 'mu', 'chờ');
  o(X(22) + 34, 212, 1140 - X(22) - 42, 'grn', 'Đã huỷ — từ 23 ms trở đi, không nháy lần nào');
  return sv(1140, 296, s);
};

/* ───────── Slide 22 — thử lại theo thời gian ───────── */
const thuLai = () => {
  let s = '';
  const X = (ms) => 40 + ms * 0.145;
  s += A(20, 60, 1130, 60, { c: 'mu', sw: 2 });
  const moc = [[31, 'lần 1 · 500'], [1042, 'thử lại 1 · 500'], [3047, 'thử lại 2 · 500'], [7050, 'thử lại 3 · 500']];
  moc.forEach(([m, nhan], i) => {
    s += `<circle cx="${X(m)}" cy="60" r="10" fill="${D.red}"/>` + T(X(m), 36, `${m} ms`, { fs: 14.5, a: 'middle', mono: true, c: 'amb' }) + T(X(m), 94, nhan, { fs: 14, a: 'middle', c: 'mu' });
    if (i) { const a = moc[i - 1][0]; s += T((X(a) + X(m)) / 2, 128, ['chờ 1 s', 'chờ 2 s', 'chờ 4 s'][i - 1], { fs: 15, a: 'middle', b: true, c: 'vio' }); }
  });
  s += T(X(7050), 128, '⇒ error', { fs: 15, a: 'middle', b: true, c: 'red' });
  return sv(1140, 140, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 6 — Lấy dữ liệu', sub: 'API giả bằng MSW · fetch trong effect và cuộc đua · TanStack Query: cache, làm mới, trạng thái · mutation và cập nhật lạc quan · đang tải, lỗi, rỗng', chap: 'CHƯƠNG 6' }),

  /* 2 */ { t: 'Bản đồ chương: dữ liệu của máy chủ, giữ bằng đúng công cụ', body: mindmap('Lấy dữ liệu', 'state server: không phải của bạn, chỉ là bản sao', [
    { t: '6.1 Fetch trong effect', d: 'MSW · res.ok · cuộc đua · AbortController', c: 'rx' },
    { t: '6.2 TanStack Query', d: 'useQuery · key · staleTime/gcTime · status', c: 'tea' },
    { t: '6.3 Mutation', d: 'useMutation · invalidate · lạc quan · hoàn tác', c: 'vio' },
    { t: '6.4 Tải, lỗi, rỗng', d: 'skeleton · retry · ranh giới lỗi · thông báo', c: 'amb' },
  ]) },

  /* ───── 6.1 ───── */
  /* 3 */ { t: 'State server không phải của bạn — bạn chỉ giữ một bản chụp', body: haiLoaiState() },

  /* 4 */ { t: 'MSW trả lời thay máy chủ — app không biết đó là API giả', body: `${duongMsw()}
    ${two(
    t(['$ npx msw init public --save', 'Worker script successfully copied!', '  - public', 'Updating "msw.workerDirectory" at ".../package.json"...'], 'msw 2.15.0 · đo thật', 14),
    list([
      'Sáu API của hợp đồng: <code>GET /api/bac-si</code>, <code>/:id</code>, <code>/:id/khung-gio?ngay=</code>, <code>POST /api/lich-hen</code>, <code>GET</code>, <code>PATCH /:id</code>.',
      '<code>delay()</code> không số: 100–400 ms ngẫu nhiên trên trình duyệt, 5 ms trong Node.',
    ]))}` },

  /* 5 */ { t: 'fetch chỉ ném lỗi khi mất mạng — 404 vẫn là “thành công”', body: two(
    yaml([
      ['export async function goiApi<T>(duongDan, init?) {', ''],
      ['  const res = await fetch(duongDan, init);', 'đợi câu trả lời'],
      ['  if (!res.ok) {', '404, 500… → ok = false'],
      ['    const than = await res.json().catch(() => null);', ''],
      ['    throw new LoiApi(res.status, than?.loi', 'TỰ ném'],
      ['      ?? `HTTP ${res.status}`);', ''],
      ['  }', ''],
      ['  return (await res.json()) as T;', ''],
      ['}', ''],
    ], { fs: 14 }),
    `${t(["[fetch 404] { ok: false, status: 404,", "  body: { loi: 'Không có bác sĩ bs-99' } }", '# fetch KHÔNG ném — code chạy tiếp như không có gì', '[goiApi 404] true 404 Không có bác sĩ bs-99', '# LoiApi mang status ⇒ giao diện & retry biết đường xử'], 'vitest · src/vi-du/bai1.test.tsx', 14)}
     ${box('warn', 'Quên kiểm <code>res.ok</code> ⇒ <code>setBacSi({ loi: … })</code>: màn hình vẽ một “bác sĩ” không có tên, không lỗi nào hiện ra.')}`) },

  /* 6 */ { t: 'Bấm nhanh qua các bác sĩ: 18/30 lần hiện SAI người', body: two(
    anh('rx-06', 'cuoc-dua.jpg', { w: 610, h: 320, url: 'localhost:5161/vi-du.html?tre=ngau-nhien', cap: 'Ảnh chụp thật: đang chọn Lan, ô ① hiện Bảo' }),
    `${t(['vòng  1: Bảo → Hà → Lan · chọn Lan', '!   ① hiện Lê Quốc Bảo   ② ✓  ③ ✓  ④ ✓', 'vòng  3: Bảo → An → Vy · chọn Vy', '+   ① ✓  ② ✓  ③ ✓  ④ ✓', '# … 30 vòng, trễ 100–1500 ms cho từng câu trả lời', '① fetch, không dọn dẹp    18/30 sai', '② cờ bỏ qua               0/30', '③ AbortController         0/30', '④ useQuery                0/30'], 'Chromium · MSW trong trình duyệt', 14)}
     ${box('info', 'Wi-Fi văn phòng nhanh và đều ⇒ không ai tái hiện được. Mạng di động chậm, lệch nhau ⇒ bệnh nhân thấy hồ sơ nhầm bác sĩ.')}`) },

  /* 7 */ { t: 'Câu trả lời về SAU CÙNG thì thắng — dù nó là câu trả lời cũ', body: dongThoiGianDua() },

  /* 8 */ { t: 'Tự viết cho đủ: 30 dòng useFetch — vẫn còn thiếu năm thứ', body: two(
    table(['Việc', 'fetch + effect', 'useFetch tự viết', 'TanStack'], [
      ['Chống cuộc đua', '-không', '+có (abort)', '+có'],
      ['Đang tải / lỗi', '-tự làm', '+có', '+có'],
      ['Cache: mở lại hiện ngay', '-không', '-không (đo: tải lại)', '+có'],
      ['Gộp request trùng', '-không', '-không', '+có'],
      ['Thử lại khi 5xx', '-không', '-không', '+3 lần'],
      ['Làm mới khi quay lại tab', '-không', '-không', '+có'],
      ['Làm cũ sau khi ghi', '-không', '-không', '+invalidate'],
    ], { sm: true }),
    `${t(['[vite dev + <StrictMode>] mở trang, đếm request:', '  ① fetch, không dọn dẹp        2', '  ② cờ bỏ qua                  2', '  ③ AbortController            2', '  ④ useQuery (có signal)       2', '  ⑤ useQuery (không signal)    1'], 'Chromium · đo thật', 14)}
     ${box('tip', 'StrictMode gắn–tháo–gắn lại mỗi component khi <strong>dev</strong> để lộ effect thiếu dọn dẹp. Hai request ở dev là bình thường — StrictMode chỉ chạy khi dev (react.dev).')}`) },

  /* ───── 6.2 ───── */
  /* 9 */ { t: 'useQuery: một key, một hàm tải — thư viện lo phần còn lại', body: two(
    yaml([
      ['// main.tsx — MỘT client, tạo ngoài component', ''],
      ['const queryClient = taoQueryClient();', ''],
      ['<QueryClientProvider client={queryClient}>', ''],
      ['  <App />', ''],
      ['</QueryClientProvider>', ''],
      ['', ''],
      ['// hooks/useBacSi.ts', ''],
      ['export function useBacSi() {', ''],
      ['  return useQuery({', ''],
      ["    queryKey: ['bac-si'],", 'địa chỉ trong cache'],
      ['    queryFn: ({ signal }) =>', 'hàm tải'],
      ['      api.danhSachBacSi(signal),', 'huỷ được'],
      ['    staleTime: 5 * 60_000,', 'tươi 5 phút'],
      ['  });', ''],
      ['}', ''],
    ], { fs: 14 }),
    `${yaml([
      ['const { data, isPending, error,', ''],
      ['        refetch } = useBacSi();', ''],
      ['if (isPending) return <DanhSachBacSiKhung />;', 'đang tải'],
      ['if (!data) return <LoiTaiDuLieu …/>;', 'lỗi'],
      ['if (data.length === 0) return <p>…</p>;', 'rỗng'],
      ['return <DanhSachBacSi danhSach={data} />;', 'có dữ liệu'],
    ], { fs: 13.5 })}
     ${list([
      'Không <code>useState</code>, không <code>useEffect</code>, không cờ <code>boQua</code>.',
      'Đo thật: đổi <code>bs-1</code> → <code>bs-2</code> giữa chừng ⇒ hiện đúng Hà, request <code>bs-1</code> bị huỷ.',
      'Quên Provider ⇒ <code>No QueryClient set, use QueryClientProvider to set one</code>.',
    ])}`) },

  /* 10 */ { t: 'Query key là địa chỉ trong cache — xếp từ chung tới riêng', body: `${cayKey()}
    ${two(
    t(["[invalidate ['bac-si','bs-1']] tải lại:", '  /api/bac-si/bs-1/khung-gio?ngay=2026-10-01', "[invalidate ['bac-si']] tải lại:", '  /api/bac-si', '  /api/bac-si/bs-1/khung-gio?ngay=2026-10-01', '  /api/bac-si/bs-2/khung-gio?ngay=2026-10-02'], 'vitest · khớp theo TIỀN TỐ', 13.5),
    `${box('tip', 'Mọi thứ query dùng (<code>bacSiId</code>, <code>ngay</code>) phải nằm TRONG key — key đổi thì là một mục cache khác, không bao giờ lẫn.')}
     ${box('info', 'Gom mọi key vào MỘT file <code>api/khoa.ts</code> (“query key factory”): gõ sai một chữ trong key là một mục cache khác, không báo lỗi nào.')}`)}` },

  /* 11 */ { t: 'Tươi → cũ → không ai xem → xoá: vòng đời một mục cache', body: vongDoi() },

  /* 12 */ { t: 'status: đã CÓ dữ liệu chưa · fetchStatus: đang GỌI mạng không', body: two(
    table(['Lúc', 'status', 'fetchStatus', 'isPending', 'isFetching', 'isLoading'], [
      ['Tải lần đầu', '!pending', '!fetching', 'true', 'true', 'true'],
      ['Có dữ liệu', '+success', 'idle', 'false', 'false', 'false'],
      ['Làm mới ở nền', '+success', '!fetching', 'false', 'true', 'false'],
      ['enabled: false', '!pending', 'idle', 'true', 'false', '-false'],
    ], { sm: true }),
    `${t(['pending/fetching isPending=true isFetching=true isLoading=true data=—', 'success/idle isPending=false isFetching=false isLoading=false data=6', "— invalidateQueries(['bac-si']) —", 'success/fetching isPending=false isFetching=true isLoading=false data=6', '[chưa chọn bác sĩ] status=pending fetchStatus=idle', '  isPending=true isLoading=false · request: 0'], 'vitest · renderHook', 12.5)}
     ${list([
      '<code>isPending</code> = chưa có dữ liệu ⇒ vẽ skeleton.',
      '<code>isFetching</code> = đang gọi (kể cả làm mới nền) ⇒ chỉ báo nhỏ.',
      '<code>isLoading</code> = cả hai. Query bị tắt: pending mãi, nhưng KHÔNG loading.',
    ])}`) },

  /* 13 */ { t: 'Cùng key ⇒ một request · còn tươi ⇒ không request nào', body: `${kpis([
    { v: '1', l: 'request cho 3 component cùng gọi useBacSi()', c: 'grn' },
    { v: '0', l: 'request mới khi mở lại trong staleTime 5 phút', c: 'grn' },
    { v: '1', l: 'request NỀN khi staleTime 0 — dữ liệu cũ vẫn hiện ngay', c: 'amb' },
    { v: '0', l: 'request khi quay lại tab mà query còn tươi', c: 'tea' },
  ])}
    ${t(['[gộp trùng] 3 component dùng useBacSi() ⇒ 1 request: /api/bac-si', '[staleTime 5 phút] lần 2 render đầu tiên: "Lần 2: 6 bác sĩ" · tổng request: 1', '[staleTime 0] lần 2 render đầu tiên: "Lần 2: 6 bác sĩ (đang làm mới)" · tổng request: 2', '[focus, cả hai còn tươi] request: 0', '[focus, khung giờ đã cũ] request: /api/bac-si/bs-1/khung-gio?ngay=2026-10-01', '[gcTime 100ms] ngay khi tháo: còn · sau 150ms: đã xoá'], 'vitest · src/vi-du/bai2.test.tsx', 14)}` },

  /* 14 */ { t: 'DevTools cho thấy cache thật: key, tươi, cũ, bị tắt', body: `${anh('rx-06', 'devtools.jpg', { w: 1080, url: 'localhost:5163 · sau khi đặt một lịch · npm run dev', cap: 'Ảnh chụp thật: @tanstack/react-query-devtools 5.103.2' })}
    ${two(
    list([
      'Số bên trái = số component đang xem mục đó (<code>["bac-si"]</code>: 3).',
      'Xanh = tươi, vàng = cũ (<code>["lich-hen"]</code>, staleTime 0), xám = không ai xem.',
    ]),
    list([
      '<code>["bac-si","","khung-gio",…]</code> <em>disabled</em>: query bị tắt vẫn có mục cache.',
      'Chỉ có mặt khi dev — build production tự bỏ (<code>NODE_ENV</code>).',
    ]))}` },

  /* ───── 6.3 ───── */
  /* 15 */ { t: 'Ghi lên máy chủ là mutation — rồi báo cache chỗ nào đã cũ', body: `${luongMutation()}
    ${two(
    yaml([
      ['export function useDatLich() {', ''],
      ['  const queryClient = useQueryClient();', ''],
      ['  return useMutation({', ''],
      ['    mutationFn: (yc) => api.datLich(yc),', 'POST'],
      ['    onSettled: (_kq, _loi, yc) => Promise.all([', ''],
      ['      queryClient.invalidateQueries({ queryKey:', ''],
      ["        ['bac-si', yc.bacSiId, 'khung-gio'] }),", 'giờ vừa kín'],
      ['      queryClient.invalidateQueries({ queryKey:', ''],
      ["        ['lich-hen'] }),", 'thêm 1 lịch'],
      ['    ]),', 'trả Promise'],
      ['  });', ''],
      ['}', ''],
    ], { fs: 13 }),
    t(['[mutate] status: idle → pending → success · data.id=lh-1', '[mutate] request:', '  GET /api/bac-si/bs-2/khung-gio', '  → POST /api/lich-hen', '  → GET /api/bac-si/bs-2/khung-gio', '  · 14:00 conTrong=false'], 'vitest · src/vi-du/bai3.test.tsx', 13.5))}` },

  /* 16 */ { t: '409 nghĩa là lưới giờ đã cũ — làm mới ở onSettled', body: two(
    `${yaml([
      ['// ✗ chỉ làm mới khi THÀNH CÔNG', ''],
      ['onSuccess: (_kq, yc) => invalidate(…)', ''],
      ['', ''],
      ['// ✓ được hay hỏng đều làm mới', ''],
      ['onSettled: (_kq, _loi, yc) => invalidate(…)', ''],
    ], { fs: 15 })}
     ${steps([
      ['14:00 trống lúc chọn · người khác đặt mất', 'lưới giờ nằm trong cache, còn tươi 30 giây'],
      ['Bấm Xác nhận ⇒ 409', '“Khung giờ này vừa có người đặt”'],
      ['Quay lại bước 2', 'onSuccess: vẫn hiện 14:00 trống — cache cũ'],
    ])}`,
    `${t(['$ npx vitest run src/components/LuongDatLich.test.tsx', '! × người khác đặt mất khung giờ trong lúc mình điền', '!   form ⇒ 409, lưới giờ tải lại thấy "kín" 1321ms', '!  Tests  1 failed | 5 passed (6)', '# đổi onSuccess → onSettled:', '+  Tests  6 passed (6)'], 'vitest · đo thật', 14)}
     ${box('warn', 'Lỗi 409 (xung đột) nghĩa là <strong>dữ liệu trên màn hình đã cũ</strong>. Nó là lý do để làm mới, không phải lý do để im lặng.')}`) },

  /* 17 */ { t: 'Mutation không gộp trùng: gọi hai lần là hai POST', body: two(
    `${t(['[bấm đúp] 2 POST · được | ✗ Khung giờ này vừa có người đặt', '[mutate] không ném · error.message = "Không có khung giờ này"', '[mutateAsync] ném: "Không có khung giờ này"'], 'vitest · src/vi-du/bai3.test.tsx', 14)}
     ${table(['', 'mutate(x)', 'await mutateAsync(x)'], [
      ['Trả về', 'không gì', 'Promise dữ liệu'],
      ['Lỗi', '+nằm trong <code>error</code>', '!NÉM — phải try/catch'],
      ['Dùng khi', 'bấm nút là xong', 'cần đợi rồi làm tiếp (đóng hộp thoại…)'],
    ], { sm: true })}`,
    list([
      '<code>useQuery</code> gộp request trùng; <code>useMutation</code> thì KHÔNG — mỗi lần <code>mutate</code> là một lần ghi thật.',
      'Giao diện: <code>disabled={datLich.isPending}</code> + chữ “Đang gửi…” (Bài 3.3 đã đo vì sao cần cả ref).',
      'Máy chủ: đặt lịch phải <strong>luỹ đẳng</strong> hoặc từ chối trùng — ở đây 409 “vừa có người đặt”.',
      '<code>mutate</code> dùng được cho hầu hết nút bấm: lỗi đã nằm sẵn trong <code>error</code>, không có Promise nào bị bỏ rơi.',
    ])) },

  /* 18 */ { t: 'Cập nhật lạc quan: sửa cache trước, gửi sau, lỗi thì hoàn tác', body: two(
    yaml([
      ['onMutate: async (lh) => {', ''],
      ['  await queryClient.cancelQueries(', '① chặn GET đang bay'],
      ["    { queryKey: ['lich-hen'] });", ''],
      ['  const truoc = queryClient', '② chụp lại'],
      ["    .getQueryData(['lich-hen']);", ''],
      ["  queryClient.setQueryData(['lich-hen'],", '③ sửa cache NGAY'],
      ["    (cu) => cu?.map(… 'da-huy' …));", ''],
      ['  return { truoc };', ''],
      ['},', ''],
      ['onError: (_l, _v, kq) =>', '④ lỗi ⇒ trả lại'],
      ["  queryClient.setQueryData(['lich-hen'], kq?.truoc),", ''],
      ['onSettled: () => invalidate(…),', '⑤ khớp máy chủ'],
    ], { fs: 13.5 }),
    `${t(['[lạc quan] "Đã huỷ" sau 2 ms · máy chủ: cho-xac-nhan', '[lạc quan] máy chủ xác nhận sau ~400 ms: da-huy', '[hoàn tác] bấm Huỷ: Đã huỷ → sau khi 500 về: Chờ xác nhận', '  → thông báo: "Không huỷ được lịch hẹn — đã hoàn tác"'], 'vitest · đo thật', 13.5)}
     ${box('tip', 'Chỉ lạc quan với việc <strong>gần như luôn thành công</strong> và <strong>hoàn tác được</strong> (huỷ, yêu thích, đánh dấu đã đọc). Đặt lịch — thứ máy chủ hay từ chối (409) — thì chờ máy chủ trả lời.')}`) },

  /* 19 */ { t: 'Thiếu cancelQueries: “Đã huỷ” → “Chờ xác nhận” → “Đã huỷ”', body: `${nhayNguoc()}
    ${t(['[thiếu cancelQueries] 0ms cho-xac-nhan → 22ms da-huy → 303ms cho-xac-nhan → 932ms da-huy', '[có cancelQueries]    0ms cho-xac-nhan → 23ms da-huy'], 'vitest · một GET đang bay (chậm 300 ms) lúc bấm Huỷ', 14)}` },

  /* ───── 6.4 ───── */
  /* 20 */ { t: 'Tải lần đầu: skeleton đúng hình, không phải vòng xoay', body: two(
    anh('rx-06', 'khung-xuong.jpg', { w: 640, h: 356, url: 'localhost:5164/?tre=vo-han', cap: 'Ảnh chụp thật: API giả treo mãi' }),
    list([
      'Thẻ xương <strong>cùng kích thước</strong> thẻ thật ⇒ dữ liệu về, trang không nhảy (không layout shift).',
      '<code>aria-busy="true"</code> + một dòng chữ ẩn “Đang tải danh sách bác sĩ…” cho trình đọc màn hình.',
      'Chỉ khi <code>isPending</code> (chưa có gì). Làm mới nền (<code>isFetching</code>) thì GIỮ dữ liệu cũ.',
      '<code>prefers-reduced-motion</code> ⇒ tắt hiệu ứng lấp lánh.',
      'Phần không phụ thuộc dữ liệu (chip lọc, ô tìm, yêu thích) vẽ ngay.',
    ])) },

  /* 21 */ { t: 'Lỗi và rỗng là hai chuyện — mỗi cái một câu, một lối thoát', body: two(
    `${anh('rx-06', 'loi.jpg', { w: 560, h: 184, url: 'localhost:5164/?loi=bac-si', cap: 'Lỗi: nói chuyện gì hỏng + nút Thử lại' })}`,
    `${anh('rx-06', 'rong.jpg', { w: 560, url: 'localhost:5164/?rong=1', cap: 'Rỗng: API trả [] — không có gì sai cả' })}`) + box('info', 'Hộp lỗi hiện sau <strong>7492 ms</strong> trong Chromium (đo thật): TanStack đã lặng lẽ thử lại 3 lần trước khi báo. Rỗng thì hiện ngay.') },

  /* 22 */ { t: 'Mặc định thử lại 3 lần: 1 s → 2 s → 4 s, hộp lỗi hiện sau ~7 giây', body: `${thuLai()}
    ${two(
    yaml([
      ['// query-client.ts — luật của dự án', ''],
      ['export function nenThuLai(lan: number, loi: Error) {', ''],
      ['  if (loi instanceof LoiApi', ''],
      ['      && loi.status >= 400 && loi.status < 500)', '4xx: thử lại vô ích'],
      ['    return false;', ''],
      ['  return lan < 3;', 'mạng, 5xx: 3 lần'],
      ['}', ''],
    ], { fs: 14 }),
    `${t(['[retry mặc định] gọi lúc (ms): 31, 1042, 3047, 7050', '  failureCount: 0→1→2→3→4', '[nenThuLai] 404: gọi 1 lần', '[nenThuLai] 500: gọi 4 lần'], 'vitest · đo thật', 14)}
     ${box('tip', 'Trong test đặt <code>retry: false</code> — không thì mỗi test lỗi đợi 7 giây.')}`)}` },

  /* 23 */ { t: 'Có dữ liệu rồi mà làm mới lỗi: giữ dữ liệu, đừng thay bằng hộp lỗi', body: two(
    `${anh('rx-06', 'giu-ngay-cu.jpg', { w: 560, url: 'localhost:5164/?tre=1500', cap: 'Đổi sang 02/10: giờ của 01/10 mờ đi, khoá bấm (keepPreviousData)' })}
     ${t(['[vừa đổi sang 02/10] isPlaceholderData=true', '  isPending=false data[0]=2026-10-01T08:00…', '[ngày mới về] data[0]=2026-10-02T08:00…'], 'vitest', 13.5)}`,
    `${t(['[làm mới lỗi] status=error · data còn 6 bác sĩ', '  error="Máy chủ đang bận, thử lại sau"'], 'vitest · src/vi-du/bai4.test.tsx', 13.5)}
     ${list([
      'Làm mới hỏng ⇒ <code>status</code> thành <code>error</code> nhưng <code>data</code> VẪN còn.',
      'Viết <code>if (isError) return &lt;Loi /&gt;</code> ⇒ xoá mất 6 bác sĩ đang hiện. Hỏi <code>!data</code> trước.',
      'Có dữ liệu + lỗi ⇒ dải vàng “đang hiện bản đã tải lúc trước”.',
      '<code>placeholderData: keepPreviousData</code> ⇒ đổi key mà không nháy trắng.',
    ])}`) },

  /* 24 */ { t: 'Ranh giới lỗi: một khu hỏng, cả trang không trắng', body: two(
    compTree({ w: 570, h: 330, bw: 186, root: { n: 'App', kids: [
      { n: 'RanhGioiLoi', c: 'amb', kids: [{ n: 'KhuBacSi', s: '✗ bug khi render', c: 'red' }] },
      { n: 'RanhGioiLoi', c: 'amb', kids: [{ n: 'LuongDatLich', s: 'vẫn chạy', c: 'grn' }] },
      { n: 'RanhGioiLoi', c: 'amb', kids: [{ n: 'LichHenCuaToi', s: 'vẫn chạy', c: 'grn' }] },
    ] } }),
    `${t(['[ranh giới lỗi] Phần này gặp sự cố.', "  Cannot read properties of undefined (reading 'slice')", '  | khu bên cạnh: "Khu lịch hẹn vẫn chạy"', '[throwOnError] số lần gọi API: 2  # bấm “Tải lại phần này”'], 'vitest · đo thật', 13.5)}
     ${list([
      'Bắt lỗi ném ra <strong>lúc render</strong>. KHÔNG bắt lỗi trong onClick, setTimeout, Promise.',
      'React 19 vẫn chưa có cách viết bằng function ⇒ một class <code>RanhGioiLoi</code> (hoặc gói <code>react-error-boundary</code>).',
      '<code>throwOnError: true</code> + <code>QueryErrorResetBoundary</code> ⇒ lỗi query lên ranh giới, bấm tải lại là gọi lại thật.',
    ])}`) },

  /* 25 */ { t: 'Lỗi của mutation: một thông báo nổi, đăng ký một chỗ cho cả app', body: two(
    anh('rx-06', 'huy-loi.jpg', { w: 600, h: 244, url: 'localhost:5164/?loi=huy', cap: 'Ảnh chụp thật: huỷ lỗi ⇒ hoàn tác + thông báo góc dưới' }),
    `${yaml([
      ['mutationCache: new MutationCache({', ''],
      ['  onError: (loi, _b, _kq, mutation) => {', 'mọi mutation'],
      ['    if (mutation.meta?.tuXuLyLoi) return;', 'tự hiện tại chỗ'],
      ['    thongBao.hien(', ''],
      ['      mutation.meta?.thongBaoLoi', 'câu riêng'],
      ['        ?? loi.message);', ''],
      ['  },', ''],
      ['}),', ''],
    ], { fs: 13.5 })}
     ${list([
      'Query lỗi ⇒ hiện <strong>tại chỗ</strong> (hộp lỗi trong khu). Mutation lỗi ⇒ thông báo nổi: người dùng vừa bấm, cần biết ngay.',
      'Đặt lịch lỗi thì hiện trong luồng (<code>meta.tuXuLyLoi</code>) — không báo hai lần.',
      '<code>role="status"</code> để trình đọc màn hình đọc thông báo.',
    ])}`) },

  /* 26 */ { t: 'Sai lầm hay gặp ở Chương 6', body: cards([
    { ic: '🏁', t: 'Fetch trong effect không dọn dẹp', d: 'Câu trả lời cũ về sau đè câu mới: 18/30 lần sai người (đo thật).', c: 'red' },
    { ic: '📭', t: 'Không kiểm <code>res.ok</code>', d: '404/500 vẫn “thành công” với fetch. Tự ném <code>LoiApi</code>.', c: 'amb' },
    { ic: '🗝', t: 'Key thiếu tham số', d: 'Dùng <code>bacSiId</code> mà key không có ⇒ mọi bác sĩ chung một mục cache.', c: 'ora' },
    { ic: '🔁', t: 'Chép dữ liệu server vào store', d: 'Hai bản sao ⇒ “màn này 2, màn kia 3”. Cache của TanStack là nơi duy nhất.', c: 'vio' },
    { ic: '🧊', t: 'Chỉ invalidate ở onSuccess', d: '409 nghĩa là màn hình đã cũ — dùng <code>onSettled</code>.', c: 'pnk' },
    { ic: '⚡', t: 'Lạc quan thiếu <code>cancelQueries</code>', d: 'GET đang bay về đè lên: màn hình nháy ngược (đo: 303 ms).', c: 'blu' },
  ]) },

  /* 27 */ { t: 'Bảng tra nhanh Chương 6', body: table(['Muốn', 'Viết'], [
    ['Đọc dữ liệu', "<code>useQuery({ queryKey: ['bac-si', id], queryFn: ({ signal }) =&gt; api.bacSi(id, signal) })</code>"],
    ['Chưa đủ tham số', '<code>enabled: bacSiId !== null</code>'],
    ['Bớt gọi lại', '<code>staleTime: 5 * 60_000</code> · mặc định 0 · <code>gcTime</code> mặc định 5 phút'],
    ['Đổi key không nháy', '<code>placeholderData: keepPreviousData</code> · đọc <code>isPlaceholderData</code>'],
    ['Ghi', '<code>useMutation({ mutationFn, onSettled: () =&gt; queryClient.invalidateQueries({ queryKey }) })</code>'],
    ['Lạc quan', '<code>onMutate</code>: cancelQueries → getQueryData → setQueryData → return · <code>onError</code>: trả lại'],
    ['Trạng thái', '<code>isPending</code> (chưa có gì) · <code>isFetching</code> (đang gọi) · <code>!data</code> trước <code>isError</code>'],
    ['Thử lại', '<code>retry: (lan, loi) =&gt; …</code> · test: <code>retry: false</code>'],
    ['API giả', "<code>http.get('/api/bac-si', () =&gt; HttpResponse.json(ds))</code> · test: <code>server.use(…)</code>"],
    ['Lỗi render', 'class <code>RanhGioiLoi</code> (getDerivedStateFromError) · <code>throwOnError</code> + <code>QueryErrorResetBoundary</code>'],
  ], { sm: true }) },

  /* 28 */ { t: 'Kết quả chương: phòng khám nói chuyện với API', body: two(
    anh('rx-06', 'dat-xong.jpg', { w: 640, h: 262, url: 'localhost:5164 · sau Chương 6', cap: 'Ảnh chụp thật: đặt 14:00 với BS. Trần Thu Hà' }),
    `${t(['$ npx tsc -b && npx vitest run', '+  Test Files  21 passed (21)', '+       Tests  81 passed (81)', '# trước chương: 19 file · 72 test', '$ npx vite build', '  index-….js     391.80 kB │ gzip: 121.97 kB', '  browser-….js   425.52 kB │ gzip: 160.22 kB', '# trước: 350.90 kB │ gzip: 109.80 kB'], 'đo thật', 13.5)}
     ${box('info', '<code>browser-….js</code> là MSW, tách riêng nhờ <code>import()</code> động. Dự án có máy chủ thật chỉ bật khi dev ⇒ file này biến mất khỏi build.')}`) },

  /* 29 */ { t: 'Tự gõ tiếp dự án: MSW + TanStack Query cho phòng khám', body: two(
    steps([
      ['<code>src/mocks/</code>', 'co-so-du-lieu · handlers (6 API) · browser · node · <code>npx msw init public</code>'],
      ['<code>src/api/</code>', '<code>goiApi</code> + <code>LoiApi</code> · <code>api</code> · <code>khoa</code>'],
      ['<code>useBacSi</code> · <code>useKhungGio</code>', 'KhuBacSi 4 trạng thái · lưới giờ theo ngày'],
      ['<code>useDatLich</code> (mutation)', 'reducer bỏ dangGui/loiGui/daDat · onSettled'],
      ['<code>useLichHen</code> + huỷ lạc quan', 'lichHen RỜI store · thông báo nổi · ranh giới lỗi'],
    ]),
    `${t(['$ npx tsc -b && npx vitest run', ' RUN  v5.0.1 ~/phong-kham', '+  Test Files  21 passed (21)', '+       Tests  81 passed (81)', '# mới: handlers 4 · LichHenCuaToi 3', '#   LuongDatLich 6 · KhuBacSi đợi API'], 'Đạt khi — test cho sẵn trong bài', 14.5)}
     ${box('tip', 'Test là đề bài: chép file test trong bài vào dự án TRƯỚC, chạy thấy đỏ, rồi viết mã cho tới khi xanh.')}`) },
]);
