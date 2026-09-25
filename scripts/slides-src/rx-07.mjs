/**
 * React · Deck rx-07 — Chương 7: Định tuyến và cấu trúc.
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy dựng bài
 * (react 19.3.0 · react-router 8.4.0 · vite 8.3.1 · vitest 5.0.1 · typescript 6.0.3 · oxlint 1.85.0 · next 16.3.6):
 *   SCRATCH/rx/du-an/ch07      — npx vitest run src/vi-du (bai1 · bai2), npx tsc -p vi-du-sai, cấu trúc lại theo tính năng,
 *                                oxlint no-restricted-imports / import/no-cycle, vite build trước/sau
 *   SCRATCH/rx/du-an/ch07-thu  — Playwright + Chromium: Link vs a href; vite preview vs python3 -m http.server; cổng bọc cả trang đăng nhập
 *   SCRATCH/rx/du-an/ch07-thu-dom — npm install react-router-dom (7.18.4) trộn với react-router 8.4.0 ⇒ ảnh lỗi thật
 *   SCRATCH/rx/du-an/ch07-next — next build, next start + curl, lỗi useState thiếu 'use client'
 * Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-07/*.jpg (Chromium thật qua Playwright, scripts/rx-chup.mjs).
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, D, compTree, anh, kpis, bars, diagram, tree,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-07', code: 'REACT · CHƯƠNG 7', title: 'Định tuyến và cấu trúc', sub: 'React · Chương 7' };

const t = (lines, title, fs = 15, dir = '~/phong-kham') => rxTerm(lines, { title, dir, fs });
const chu = (s, c = D.mu) => `<div style="text-align:center;color:${c};font-size:16px;font-weight:700;margin-top:6px">${s}</div>`;

/* ───────── Slide 3 — router: URL → bảng route → component ───────── */
const soDoRouter = () => diagram({
  w: 1160, h: 350,
  nodes: [
    { id: 'link', x: 0, y: 0, w: 340, h: 96, t: '<Link to="/bac-si/bs-2">', d: 'click → preventDefault()\n→ history.pushState()', c: 'tea', mono: true },
    { id: 'back', x: 0, y: 250, w: 340, h: 80, t: 'Nút Back / Forward', d: 'sự kiện popstate', c: 'vio' },
    { id: 'url', x: 430, y: 120, w: 250, h: 96, t: 'Thanh địa chỉ', d: '/bac-si/bs-2', c: 'amb' },
    { id: 'bang', x: 800, y: 0, w: 340, h: 180, t: 'Bảng route', d: "'/' → TrangChu\n'/bac-si' → TrangDanhSach\n'/bac-si/:id' → TrangChiTiet\n'*' → TrangKhongThay", c: 'rx', mono: true },
    { id: 'comp', x: 800, y: 250, w: 340, h: 96, t: '<TrangChiTiet />', d: "useParams() → { id: 'bs-2' }", c: 'grn', mono: true },
  ],
  edges: [
    { from: 'link', to: 'url', c: 'tea' },
    { from: 'back', to: 'url', c: 'vio' },
    { from: 'url', to: 'bang', t: 'khớp mẫu', c: 'amb' },
    { from: 'bang', to: 'comp', t: 'vẽ', c: 'grn', fs: 'b', ts: 't' },
  ],
});

/* ───────── Slide 10 — route lồng = khung lồng ───────── */
const khungLong = () => {
  let s = '';
  // URL phía trên, mỗi đoạn một màu
  s += T(40, 34, 'URL:', { fs: 18, c: 'mu', b: true });
  s += T(100, 34, '/', { fs: 22, mono: true, b: true, c: 'rx' }) + T(118, 34, 'bac-si', { fs: 22, mono: true, b: true, c: 'vio' }) + T(208, 34, '/', { fs: 22, mono: true, c: 'mu' }) + T(226, 34, 'bs-4', { fs: 22, mono: true, b: true, c: 'grn' });
  s += T(330, 34, 'matches:  /  ›  bac-si  ›  :id', { fs: 17, mono: true, c: 'mu' });
  // khung ngoài
  s += R(40, 60, 1080, 380, { c: 'rx', fill: '#0c1424' }) + T(60, 90, '<KhungChinh />  path "/"', { fs: 16, mono: true, b: true, c: 'rx' });
  s += R(60, 104, 1040, 44, { c: 'dim', fill: '#111a2b', r: 8 }) + T(80, 132, 'header · menu (NavLink)  — vẽ MỘT lần', { fs: 16, c: 'mu' });
  s += R(60, 400, 1040, 30, { c: 'dim', fill: '#111a2b', r: 8 }) + T(80, 421, 'footer', { fs: 15, c: 'mu' });
  // khung bác sĩ
  s += R(60, 160, 1040, 230, { c: 'vio', fill: '#120f22' }) + T(80, 188, '<KhungBacSi />  path "bac-si"  — <Outlet /> của KhungChinh', { fs: 16, mono: true, b: true, c: 'vio' });
  ['BS. Nguyễn Minh An', 'BS. Trần Thu Hà', 'BS. Lê Quốc Bảo', 'BS. Phạm Ngọc Lan', 'BS. Hoàng Đức Huy'].forEach((n, i) => {
    const on = i === 3;
    s += R(80, 202 + i * 36, 300, 30, { c: on ? 'amb' : 'dim', fill: on ? '#221c0c' : '#0f182a', r: 6, sw: on ? 2.5 : 1.5 }) + T(96, 223 + i * 36, n, { fs: 15, c: on ? 'amb' : '#e6edf3' });
  });
  s += R(410, 202, 670, 176, { c: 'grn', fill: '#0c1c14' }) + T(430, 230, '<ChiTietBacSi />  path ":id"', { fs: 16, mono: true, b: true, c: 'grn' });
  s += T(430, 262, '— <Outlet /> của KhungBacSi', { fs: 15, c: 'mu', mono: true });
  s += T(430, 300, 'BS. Phạm Ngọc Lan', { fs: 22, b: true }) + T(430, 330, 'Răng hàm mặt · 15 năm', { fs: 16, c: 'mu' });
  s += T(430, 362, 'bấm bác sĩ khác ⇒ CHỈ khung xanh này đổi', { fs: 15, c: 'amb', b: true });
  return sv(1160, 446, s);
};

/* ───────── Slide 11 — lỗi nằm trong khung ───────── */
const loiTrongKhung = () => {
  let s = '';
  s += R(0, 0, 560, 318, { c: 'vio', fill: '#120f22' }) + T(16, 26, '/bac-si/bs-99', { fs: 16, mono: true, b: true, c: 'vio' });
  ['BS. Nguyễn Minh An', 'BS. Trần Thu Hà', 'BS. Lê Quốc Bảo', 'BS. Phạm Ngọc Lan', 'BS. Hoàng Đức Huy', 'BS. Vũ Thảo Vy'].forEach((n, i) => {
    s += R(16, 44 + i * 40, 220, 32, { c: 'dim', fill: '#0f182a', r: 6, sw: 1.5 }) + T(30, 66 + i * 40, n, { fs: 14.5 });
  });
  s += R(256, 44, 288, 232, { c: 'red', fill: '#200d12' });
  s += T(400, 120, 'ErrorBoundary', { fs: 18, b: true, a: 'middle', c: 'red', mono: true }) + T(400, 150, 'của route :id', { fs: 15, a: 'middle', c: 'mu' });
  s += T(400, 200, '404 — Không có', { fs: 19, b: true, a: 'middle' }) + T(400, 228, 'bác sĩ bs-99', { fs: 19, b: true, a: 'middle' });
  s += T(126, 302, 'danh sách vẫn bấm được ✓', { fs: 14, a: 'middle', c: 'grn', b: true });
  return sv(560, 322, s);
};

/* ───────── Slide 12 — luồng gác cổng ───────── */
const luongGac = () => diagram({
  w: 1160, h: 400,
  nodes: [
    { id: 'u', x: 0, y: 150, w: 200, h: 80, t: 'Mở /lich-hen', d: 'bấm menu, F5, link', c: 'amb' },
    { id: 'g', x: 270, y: 140, w: 260, h: 100, t: '<YeuCauDangNhap />', d: 'layout route KHÔNG path\nđọc useDangNhapStore', c: 'rx', mono: true },
    { id: 'o', x: 620, y: 0, w: 260, h: 90, t: 'đã đăng nhập', d: '<Outlet /> → TrangLichHen', c: 'grn' },
    { id: 'n', x: 620, y: 290, w: 300, h: 100, t: 'chưa đăng nhập', d: '<Navigate to="/dang-nhap"\n replace state={{ tu }} />', c: 'red' },
    { id: 'd', x: 960, y: 150, w: 200, h: 90, t: 'TrangDangNhap', d: "navigate(tu,\n{ replace: true })", c: 'vio' },
  ],
  edges: [
    { from: 'u', to: 'g' },
    { from: 'g', to: 'o', c: 'grn', fs: 't', ts: 'l' },
    { from: 'g', to: 'n', c: 'red', fs: 'b', ts: 'l' },
    { from: 'n', to: 'd', c: 'red', fs: 'r', ts: 'b' },
    { from: 'd', to: 'o', t: 'đăng nhập xong', c: 'vio', fs: 't', ts: 'r' },
  ],
});

/* ───────── Slide 13 — hai chồng lịch sử ───────── */
const chongLichSu = () => {
  let s = '';
  const chong = (x, tieuDe, muc, c, soBack) => {
    let k = T(x + 120, 26, tieuDe, { fs: 18, b: true, a: 'middle', c });
    muc.forEach((m, i) => {
      const y = 290 - i * 58, top = i === muc.length - 1;
      k += R(x, y, 240, 46, { c: top ? c : 'dim', fill: top ? '#10202a' : '#0f182a', r: 8, sw: top ? 3 : 1.6 }) + T(x + 120, y + 30, m, { fs: 17, mono: true, a: 'middle', c: top ? '#fff' : '#e6edf3' });
    });
    k += T(x + 120, 372, soBack, { fs: 18, b: true, a: 'middle', c });
    return k;
  };
  s += chong(10, 'replace: true', ['/', '/lich-hen'], 'grn', 'Back 1 lần ⇒ /');
  s += chong(300, 'quên replace', ['/', '/lich-hen', '/dang-nhap', '/lich-hen'], 'red', 'Back 3 lần mới về /');
  s += T(130, 150, 'đỉnh = trang đang xem', { fs: 14, c: 'mu', a: 'middle' }) + A(130, 160, 130, 222, { c: 'grn' });
  return sv(560, 390, s);
};

/* ───────── Slide 23 — server / client ───────── */
const serverClient = () => compTree({
  w: 560, h: 330, bw: 230, root: { n: 'RootLayout', s: 'Server · <html><body>', kids: [
    { n: 'TrangChiTiet', s: 'Server · async, await params', kids: [
      { n: 'NutYeuThich', s: "'use client' · useState", c: 'amb', st: true },
    ] },
  ] },
});

export const slides = S([
  /* 1 */ cover({ t: 'Chương 7 — Định tuyến và cấu trúc', sub: 'React Router 8 · layout lồng · chặn truy cập · cấu trúc theo tính năng · sang Next.js', chap: 'CHƯƠNG 7' }),

  /* 2 */ { t: 'Bản đồ chương: từ một trang dài thành bảy route có cấu trúc', body: mindmap('Định tuyến & cấu trúc', 'một URL, một màn hình — và mã xếp theo tính năng', [
    { t: '7.1 React Router', d: 'bảng route · Link · useParams · NavLink · useSearchParams', c: 'rx' },
    { t: '7.2 Layout & cổng', d: 'Outlet · route lồng · ErrorBoundary · chặn đăng nhập', c: 'vio' },
    { t: '7.3 Cấu trúc', d: 'features/ · shared/ · index.ts · lint chặn import', c: 'grn' },
    { t: '7.4 Sang Next.js', d: 'HTML rỗng vs có sẵn · app/ · Server Component', c: 'amb' },
    { t: '🛠 Dự án', d: '/ · /bac-si · /bac-si/:id · /dat-lich/:khungGioId · /lich-hen', c: 'tea' },
  ]) },

  /* ───── 7.1 ───── */
  /* 3 */ { t: 'Router đọc URL rồi chọn component — không tải lại trang', body: `${soDoRouter()}
    ${box('info', 'Máy chủ chỉ được hỏi <strong>một lần</strong> (<code>index.html</code> + gói JS). Sau đó “đổi trang” = <code>pushState</code> + vẽ component khác.')}` },

  /* 4 */ { t: 'Link giữ app sống — a href tải lại từ đầu (đo trên Chromium)', body: two(
    `${bars([
      { l: '&lt;Link to="/bac-si"&gt;', sub: 'bộ đếm useState: 3 → 3', v: 0.08, txt: '0 request', c: 'grn' },
      { l: '&lt;a href="/bac-si"&gt;', sub: 'bộ đếm useState: 3 → 0', v: 3, txt: '3 request', c: 'red' },
    ], { lw: 250, max: 3 })}
     <div style="height:26px"></div>
     ${box('good', '<code>Link</code> vẽ ra một thẻ <code>&lt;a&gt;</code> THẬT: Ctrl-click mở tab mới, sao chép link, trình đọc màn hình đều chạy. Chỉ cú click thường bị chặn lại.')}`,
    `${t(['$ node do-link.mjs   # vite preview · Chromium', '[truoc]       Số lần tải trang: 1 · Bộ đếm useState: 3', '+ [sau <Link>]  Số lần tải trang: 1 · Bộ đếm useState: 3', '+   · request: 0', '! [sau <a>]     Số lần tải trang: 2 · Bộ đếm useState: 0', '!   · request: 3 ["document /bac-si",', '    "script /assets/index-CQM_6-Wp.js",', '    "stylesheet /assets/index-DOCfO5vB.css"]'], 'Chromium thật (Playwright)', 13.5)}
     ${box('tip', '<code>&lt;a href&gt;</code> trần chỉ dành cho link RA NGOÀI app: web khác, file PDF, trang của app khác.')}`) },

  /* 5 */ { t: 'React Router 8 chỉ còn gói react-router — trộn bản 7 là sập', body: two(
    `${t(['$ npm view react-router dist-tags.latest', '+ 8.4.0', '$ npm view react-router-dom dist-tags.latest', '! 7.18.4', '$ npm install react-router-dom   # chép bài cũ', '$ npm ls react-router react-router-dom', '+-- react-router-dom@7.18.4', '| `-- react-router@7.18.4', '`-- react-router@8.4.0', '# ⇒ HAI router, hai context'], 'npm · 25/09/2026', 14)}
     ${table(['Bản 6 (FER202, bài cũ)', 'Bản 8 (2026)'], [
      ["<code>'react-router-dom'</code>", "+<code>'react-router'</code>"],
      ['<code>&lt;BrowserRouter&gt;&lt;Routes&gt;</code>', '+<code>createBrowserRouter([...])</code>'],
      ['—', "+<code>RouterProvider</code> từ <code>'react-router/dom'</code>"],
    ], { sm: true })}`,
    `${anh('rx-07', 'tron-dom.jpg', { w: 560, h: 250, url: 'localhost:5172 · Link từ react-router-dom', cap: 'Trang lỗi mặc định của React Router — không một chữ nào nhắc tới phiên bản' })}
     ${box('bad', 'Kiểm: <code>npm ls react-router</code> thấy HAI bản ⇒ <code>npm uninstall react-router-dom</code>, đổi import sang <code>\'react-router\'</code>.')}`) },

  /* 6 */ { t: 'Bảng route: mỗi mẫu URL một component, :id là tham số, * là 404', body: two(
    `${yaml([
      ['export const routesBai1: RouteObject[] = [', ''],
      ["  { path: '/',            Component: TrangChu },", ''],
      ["  { path: '/bac-si',      Component: TrangDanhSach },", ''],
      ["  { path: '/bac-si/:id',  Component: TrangChiTiet },", ':id = đoạn động'],
      ["  { path: '/lich-hen',    Component: TrangLichHen },", ''],
      ["  { path: '*',            Component: TrangKhongThay },", 'bắt tất = 404'],
      ['];', ''],
      ['', ''],
      ["const { id } = useParams<'id'>();", 'string | undefined'],
      ['<NavLink to="/" end>Trang chủ</NavLink>', 'end: chỉ đúng "/"'],
    ], { fs: 13.5 })}`,
    `${t(['# render ở /bac-si/bs-2', '[7.1 navlink] Trang chủ       class="" aria-current=null', '+ [7.1 navlink] Đội ngũ bác sĩ  class="active" aria-current=page', '[7.1 navlink] Lịch hẹn        class="" aria-current=null'], 'vitest · bai1.test.tsx', 13)}
     ${t(['$ npx tsc -p vi-du-sai --noEmit', '! use-params.tsx(10,26): error TS2345: Argument of type', "!   'string | undefined' is not assignable to parameter", "!   of type 'string'."], 'timBacSi(id) với id từ useParams', 13)}
     ${box('tip', '<code>/bac-si/bs-99</code> KHỚP route, chỉ thiếu dữ liệu ⇒ trang tự báo. <code>/khong-co</code> không khớp gì ⇒ route <code>*</code>.')}`) },

  /* 7 */ { t: 'useSearchParams: chip thì push, ô tìm thì replace', body: two(
    yaml([
      ['const [sp, setSp] = useSearchParams();', ''],
      ["const ck = sp.get('ck');", 'string | null'],
      ["const q = sp.get('q') ?? '';", ''],
      ['', ''],
      ['// chip: thêm mục lịch sử', ''],
      ['setSp((prev) => {', 'sửa TỪ bản hiện tại'],
      ['  const p = new URLSearchParams(prev);', ''],
      ["  p.set('ck', moi);", 'giữ nguyên ?q='],
      ['  return p;', ''],
      ['});', ''],
      ['', ''],
      ['// ô tìm: thay mục hiện tại', ''],
      ['setSp(capNhat, { replace: true });', 'không đầy lịch sử'],
    ], { fs: 14 }),
    `${t(['[7.1 search] sau chip Nhi: ?ck=nhi PUSH', '  → Tìm thấy 2 bác sĩ', '[7.1 search] sau gõ "vy": ?ck=nhi&q=vy REPLACE', '  → Tìm thấy 1 bác sĩ', '+ [7.1 search] sau 1 lần Back: (rỗng)', '+   → Tìm thấy 6 bác sĩ'], 'vitest · createMemoryRouter', 14.5)}
     ${box('good', 'Thay cả hook <code>useBoLocUrl</code> tự viết ở Bài 5.4: không listener <code>popstate</code>, không bẫy “pushState không render lại”.')}
     ${box('warn', 'Vẫn phải KIỂM giá trị: <code>?ck=tim-mach</code> là URL người dùng gõ tay — giữ <code>docBoLoc</code> của Chương 5.')}`) },

  /* 8 */ { t: 'F5 ở /bac-si/bs-2: máy chủ tĩnh trả 404 nếu không có fallback', body: two(
    `${t(['$ npx vite preview --port 5170', 'vite preview GET / → 200', '+ vite preview GET /bac-si/bs-2 → 200', 'vite preview GET /khong-co → 200', '# lùi về index.html, router vẽ 404 sau'], 'dist/ · vite preview', 14.5)}
     ${t(['$ cd dist && python3 -m http.server 5171', 'python3 -m http.server GET / → 200', '! python3 -m http.server GET /bac-si → 404', '! python3 -m http.server GET /bac-si/bs-2 → 404', '# không có file tên bac-si ⇒ app không kịp tải'], 'dist/ · máy chủ tĩnh trần', 14.5)}`,
    `${box('bad', 'Chỉ hỏng <strong>sau khi deploy</strong>: bấm qua lại vẫn chạy (điều hướng ở trình duyệt), chỉ F5 / mở link chia sẻ mới ra 404.')}
     ${table(['Host', 'Luật SPA fallback'], [
      ['nginx', '<code>try_files $uri /index.html;</code>'],
      ['Netlify', '<code>_redirects</code>: <code>/* /index.html 200</code>'],
      ['Vercel / Cloudflare Pages', 'chế độ SPA hoặc luật rewrite'],
    ], { sm: true })}
     ${box('tip', 'Sau mỗi lần deploy: mở THẲNG URL một trang con. 200 là đạt.')}`) },

  /* ───── 7.2 ───── */
  /* 9 */ { t: 'Layout route: khung vẽ một lần, Outlet đổi phần ruột', body: `${compTree({
    w: 1100, h: 300, bw: 200, legend: true, root: { n: 'KhungChinh', w: 330, s: 'header · nav · <Outlet /> · footer', st: false, kids: [
      { n: 'TrangChu', s: 'index: true' },
      { n: 'KhungBacSi', s: "path 'bac-si'", kids: [{ n: 'ChiTietBacSi', s: "path ':id'", r: true }] },
      { n: 'TrangLichHen', s: "path 'lich-hen'" },
      { n: 'TrangKhongThay', s: "path '*'" },
    ] },
  })}
    ${two(t(['[7.2 layout] 4 lần đổi trang · KhungChinh mount: 1 lần'], 'vitest · bai2.test.tsx', 14.5),
      box('tip', 'Ô tìm đang có chữ, dropdown đang mở trong header: <strong>vẫn nguyên</strong> khi đổi trang — cùng một instance component.'))}` },

  /* 10 */ { t: 'Cây route lồng nhau = cây giao diện lồng nhau', body: khungLong() },

  /* 11 */ { t: 'ErrorBoundary theo route: lỗi ở chi tiết, danh sách vẫn sống', body: two(
    yaml([
      ['export function taiBacSi({ params }) {', 'chạy TRƯỚC khi vẽ'],
      ['  const bs = danhSachBacSi.find(', ''],
      ['    (b) => b.id === params.id);', ''],
      ['  if (!bs) throw data(', 'ném "response lỗi"'],
      ['    `Không có bác sĩ ${params.id}`,', ''],
      ['    { status: 404 });', ''],
      ['  return bs;', '→ useLoaderData()'],
      ['}', ''],
      ['', ''],
      ["{ path: ':id', loader: taiBacSi,", ''],
      ['  Component: ChiTietBacSi,', ''],
      ['  ErrorBoundary: LoiChiTiet }', 'useRouteError()'],
    ], { fs: 13.5 }),
    `${loiTrongKhung()}
     ${t(['[7.2 loi] alert = 404 — Không có bác sĩ bs-99', '+   · danh sách còn: true'], 'vitest · bai2.test.tsx', 13.5)}`) },

  /* 12 */ { t: 'Chặn trang cần đăng nhập bằng một layout route gác cổng', body: `${luongGac()}
    ${box('warn', 'Trang đăng nhập, 404 và mọi trang công khai phải nằm NGOÀI cổng. Đo: cổng bọc cả <code>/dang-nhap</code> ⇒ URL đổi, màn hình là <code>&lt;div&gt;&lt;/div&gt;</code> rỗng, không lỗi nào.')}` },

  /* 13 */ { t: 'Quên replace: đăng nhập xong phải bấm Back ba lần', body: two(
    chongLichSu(),
    `${t(['[7.2 chan replace=true] /dang-nhap · /lich-hen', '+   · Back→/ ⇒ 1 lần Back', '[7.2 chan replace=false] /dang-nhap · /lich-hen', '!   · Back→/dang-nhap · Back→/lich-hen', '!   · Back→/ ⇒ 3 lần Back'], 'vitest · createMemoryRouter', 13.5)}
     ${box('tip', 'Hai chỗ cần <code>replace</code>: <code>&lt;Navigate replace&gt;</code> của cổng và <code>navigate(tu, { replace: true })</code> sau khi đăng nhập.')}`) },

  /* 14 */ { t: 'Middleware chặn trước loader — cổng component thì không', body: two(
    `${yaml([
      ['export const canDangNhap: MiddlewareFunction =', ''],
      ['  ({ request }) => {', ''],
      ['    if (!useDangNhapStore.getState().nguoiDung) {', 'đọc store ngoài React'],
      ['      const tu = new URL(request.url).pathname;', ''],
      ['      throw redirect(`/dang-nhap?tu=${', 'huỷ lượt chuyển trang'],
      ['        encodeURIComponent(tu)}`);', ''],
      ['    }', ''],
      ['  };', ''],
      ['', ''],
      ['{ middleware: [canDangNhap],', ''],
      ['  children: [lichHen] }', ''],
    ], { fs: 13.5 })}
     ${t(['[7.2 middleware] loader lịch hẹn đã chạy:', '!   component = 1 lần', '+   middleware = 0 lần', '  · URL = /dang-nhap?tu=%2Flich-hen'], 'vitest · bai2.test.tsx', 13.5)}`,
    `${table(['', 'Component <code>&lt;Navigate&gt;</code>', 'Middleware'], [
      ['Chạy lúc', 'đang vẽ, SAU loader', '+trước loader'],
      ['Loader trang bảo vệ', '-chạy 1 lần', '+chạy 0 lần'],
      ['Đăng xuất khi đang xem', '+tự chuyển', '-chờ lượt sau'],
      ['“Đường quay về”', 'location.state', '+?tu= trên URL'],
      ['Declarative Mode', '+có', '-không'],
    ], { sm: true })}
     ${box('bad', 'Cả hai chỉ là TRẢI NGHIỆM. Bảo mật thật: API trả 401/403 khi thiếu token.')}`) },

  /* ───── 7.3 ───── */
  /* 15 */ { t: 'Xếp theo loại file → xếp theo tính năng', body: two(
    `${tree(`src/   # trước Chương 7
├─ components/   # 24 file
├─ hooks/        # 13 file
├─ logic/        # 9 file
├─ store/        # 3 file
├─ schema/  api/  dat-lich/  mocks/
└─ App.tsx  main.tsx  types.ts`)}
     ${chu('sửa tính năng “bác sĩ” = mở 4 thư mục: components/ hooks/ logic/ store/', D.amb)}`,
    `${tree(`src/   # sau Chương 7
├─ app/        # router, layout, Header
├─ pages/      # 7 route = 7 trang
├─ features/
│  ├─ bac-si/      # thẻ, lọc, store
│  ├─ dat-lich/    # chọn giờ, form
│  ├─ lich-hen/    # danh sách, huỷ
│  └─ dang-nhap/   # store, cổng
├─ shared/     # api ui hooks logic
└─ du-lieu/  mocks/  test/  types.ts`)}
     ${chu('sửa “bác sĩ” = mở 1 thư mục · xoá tính năng = xoá 1 thư mục', D.grn)}`) },

  /* 16 */ { t: 'Luật phụ thuộc một chiều: app → pages → features → shared', body: `${diagram({
    w: 1160, h: 400,
    nodes: [
      { id: 'app', x: 400, y: 0, w: 360, h: 64, t: 'app/', d: 'router.tsx · KhungTrang · Header', c: 'vio' },
      { id: 'pages', x: 400, y: 104, w: 360, h: 64, t: 'pages/', d: 'mỗi route một trang, GHÉP các tính năng', c: 'blu' },
      { id: 'bs', x: 0, y: 214, w: 240, h: 64, t: 'features/bac-si', c: 'rx', mono: true },
      { id: 'dl', x: 320, y: 214, w: 240, h: 64, t: 'features/dat-lich', c: 'rx', mono: true },
      { id: 'lh', x: 640, y: 214, w: 240, h: 64, t: 'features/lich-hen', c: 'rx', mono: true },
      { id: 'dn', x: 920, y: 214, w: 240, h: 64, t: 'features/dang-nhap', c: 'rx', mono: true },
      { id: 'sh', x: 250, y: 330, w: 660, h: 64, t: 'shared/ · du-lieu/ · types.ts', d: 'api · ui · hooks · logic — KHÔNG biết tính năng nào tồn tại', c: 'grn' },
    ],
    edges: [
      { from: 'app', to: 'pages', c: 'mu' },
      { from: 'pages', to: 'bs', c: 'mu', fs: 'b', ts: 't' }, { from: 'pages', to: 'dl', c: 'mu', fs: 'b', ts: 't' },
      { from: 'pages', to: 'lh', c: 'mu', fs: 'b', ts: 't' }, { from: 'pages', to: 'dn', c: 'mu', fs: 'b', ts: 't' },
      { from: 'bs', to: 'sh', c: 'grn', fs: 'b', ts: 't' }, { from: 'dn', to: 'sh', c: 'grn', fs: 'b', ts: 't' },
      { from: 'dl', to: 'bs', t: '✗', c: 'red', dash: true, fs: 'l', ts: 'r' },
    ],
  })}
    ${box('tip', 'Trang lịch hẹn cần TÊN bác sĩ? Tính năng lịch hẹn không import bác sĩ — <strong>trang</strong> lấy <code>useBacSi()</code> rồi truyền <code>tenBacSi</code> xuống.')}` },

  /* 17 */ { t: 'Mỗi tính năng một cửa index.ts — lint chặn đi cửa sau', body: two(
    `${yaml([
      ['// src/features/bac-si/index.ts', ''],
      ["export { KhuBacSi } from './KhuBacSi';", ''],
      ["export { ChiTietBacSi } from './components/…';", ''],
      ["export { useBacSi } from './hooks/useBacSi';", ''],
      ["export { useChiTietBacSi } from './hooks/…';", ''],
      ["export { useDatLichStore } from './dat-lich-store';", ''],
      ['', ''],
      ['// .oxlintrc.json (trích)', ''],
      ['"no-restricted-imports": ["error", { "patterns": [', ''],
      ['  { "group": ["@/features/*/**"] },', 'cửa sau'],
      ['  { "group": ["../../**"] } ] }]', '../../../'],
      ['overrides: features/** cấm "@/features/*"', 'xuyên tính năng'],
      ['overrides: shared/** cấm features, pages, app', 'đi ngược'],
    ], { fs: 13 })}`,
    `${t(['$ npx oxlint src   # cố tình phạm 4 luật', '! TheBacSi.tsx: \'../../../du-lieu/chuyen-khoa\'', "    help: Lên hai cấp thư mục trở lên thì viết '@/…'.", "! DanhSachLichHen.tsx: '@/features/bac-si'", '    help: Tính năng không import tính năng khác', "! LoiTaiDuLieu.tsx: '@/features/dang-nhap'", '    help: shared/ là tầng dưới cùng', "! TrangChiTietBacSi.tsx:", "    '@/features/bac-si/hooks/useBacSi'", "    help: Chỉ đi qua cửa của tính năng", '# gỡ ra ⇒ 0 lỗi, exit 0'], 'oxlint 1.85.0 · rút gọn', 13)}`) },

  /* 18 */ { t: 'Alias @/: build xanh chưa chắc dev và test xanh', body: two(
    `${t(['$ npx vite build   # chỉ có "paths" trong tsconfig', '+ dist/assets/index-2EJGV3h_.js  491.06 kB', '+ ✓ built in 734ms', '$ npx vitest run', '! Error: Failed to resolve import "@/features/dang-nhap"', '!   from "src/test/setup.ts". Does the file exist?', '!  Test Files  20 failed (20)', '$ npx vite --port 5176', '! GET /src/pages/TrangChu.tsx → 500'], 'vite 8.3.1 · vitest 5.0.1', 13.5)}`,
    `${yaml([
      ['// tsconfig.app.json', 'MỘT nguồn'],
      ['"paths": { "@/*": ["./src/*"] }', 'tsc hiểu @/'],
      ['', ''],
      ['// vite.config.ts', ''],
      ['resolve: { tsconfigPaths: true },', 'dev + Vitest đọc paths'],
    ], { fs: 14.5 })}
     ${t(['$ npx vitest run', '+  Test Files  20 passed (20)', '+       Tests  83 passed (83)'], 'sau khi thêm tsconfigPaths', 14)}
     ${box('info', 'Build dùng Rolldown, tự đọc <code>paths</code>; dev server và Vitest thì KHÔNG (mặc định <code>tsconfigPaths: false</code>). Kiểm cả ba lệnh.')}`) },

  /* 19 */ { t: 'Barrel vòng tròn: tsc và Vitest không thấy, trình duyệt thì sập', body: two(
    `${yaml([
      ['// lich-hen/schema.ts', ''],
      ["import { benhNhanSchema } from '@/features/dat-lich';", 'lich-hen → dat-lich'],
      ['export const lichHenSchema = z.object({', 'chạy NGAY lúc import'],
      ['  id: z.string(), benhNhan: benhNhanSchema });', ''],
      ['', ''],
      ['// dat-lich/useDatLich.ts', ''],
      ["import { useLichHen } from '@/features/lich-hen';", 'dat-lich → lich-hen'],
    ], { fs: 13.5 })}
     ${table(['Công cụ', 'Kết quả'], [
      ['<code>tsc -b</code>', '+0 lỗi'],
      ['<code>vitest run</code>', '+21 file, 94 test xanh'],
      ['<code>vite build</code> + Chromium', '+chạy được'],
      ['<code>vite</code> dev + Chromium', '-trang trắng'],
      ['<code>oxlint</code> import/no-cycle', '!4 lỗi — bắt được'],
    ], { sm: true })}`,
    `${t(["[vite dev] h2 đầu tiên = null · pageerror =", "!   Cannot access 'benhNhanSchema' before initialization", '[vite build + preview] h2 đầu tiên =', '+   "Đội ngũ bác sĩ (6)" · pageerror = (không có)'], 'Chromium thật', 13)}
     ${t(['[vong vitest] lichHenSchema.shape.benhNhan = undefined', '! Error: Invalid element at key "benhNhan":', '!   expected a Zod schema'], 'Vitest — chỉ khi có test đụng tới', 13)}
     ${box('tip', 'Chữa: không import xuyên tính năng. Thứ cả hai bên cùng cần (schema bệnh nhân) thì chuyển xuống <code>shared/</code>.')}`) },

  /* ───── 7.4 ───── */
  /* 20 */ { t: 'SPA gửi HTML rỗng — Next.js gửi HTML có sẵn nội dung', body: two(
    `${t(['$ curl -s localhost:5174/bac-si/bs-2 \\', '    | grep -c "<h1>"', '! 0', '$ curl -s localhost:5174/bac-si/bs-2 \\', "    | sed -n '/<body>/,/<\\/body>/p'", '  <body>', '!     <div id="root"></div>', '  </body>'], 'Vite SPA · vite preview', 14, '~/ch07-thu')}
     ${chu('tên bác sĩ chỉ có SAU khi tải + chạy 313 kB JS', D.red)}`,
    `${t(['$ curl -s localhost:5173/bac-si/bs-2 \\', '    | grep -o "<h1>[^<]*</h1>"', '+ <h1>BS. Trần Thu Hà</h1>', '$ curl -s -o /dev/null -w "%{http_code}" \\', '    localhost:5173/bac-si/bs-99', '+ 404'], 'Next.js 16.3.6 · next start', 14, '~/ch07-next')}
     ${chu('nội dung có sẵn trong HTML · 404 là 404 thật', D.grn)}
     ${table(['', 'SPA (CSR)', 'Next.js (SSG)'], [['&lt;h1&gt; trong HTML', '-không có', '+có tên bác sĩ'], ['GET /bac-si/bs-99', '-trả 200', '+trả 404']], { sm: true })}`) },

  /* 21 */ { t: 'Route của React Router ↔ thư mục app/ của Next.js', body: table(['React Router 8 (Data Mode)', 'Next.js 16 App Router'], [
    ["<code>{ index: true }</code> ở <code>/</code>", '<code>app/page.tsx</code>'],
    ["<code>{ path: 'bac-si/:id' }</code> + <code>useParams()</code>", '<code>app/bac-si/[id]/page.tsx</code> + prop <code>params</code> (Promise)'],
    ['layout route + <code>&lt;Outlet /&gt;</code>', '<code>layout.tsx</code> + <code>{children}</code>'],
    ['<code>ErrorBoundary</code> · <code>HydrateFallback</code>', '<code>error.tsx</code> · <code>loading.tsx</code>'],
    ["<code>{ path: '*' }</code> · <code>throw data(…, 404)</code>", '<code>not-found.tsx</code> · <code>notFound()</code>'],
    ['cổng / <code>middleware</code>', 'kiểm ở server trong layout/page · <code>proxy.ts</code> (Next 16 đổi tên từ middleware.ts)'],
    ['<code>&lt;Link to&gt;</code> · <code>useNavigate()</code>', '<code>&lt;Link href&gt;</code> (next/link) · <code>useRouter()</code> (next/navigation)'],
    ['<code>useSearchParams()</code>', '<code>useSearchParams()</code> (chỉ đọc) hoặc prop <code>searchParams</code>'],
  ], { sm: true }) },

  /* 22 */ { t: 'next build dựng sẵn sáu trang bác sĩ', body: two(
    `${yaml([
      ['// app/bac-si/[id]/page.tsx', ''],
      ['export function generateStaticParams() {', 'đường dẫn cần dựng sẵn'],
      ['  return danhSachBacSi.map((bs) => ({ id: bs.id }));', ''],
      ['}', ''],
      ['export default async function TrangChiTiet(', 'Server Component'],
      ['  { params }: { params: Promise<{ id: string }> }) {', 'được phép async'],
      ['  const { id } = await params;', 'Next 15+: Promise'],
      ['  const bs = danhSachBacSi.find((b) => b.id === id);', 'đọc dữ liệu THẲNG'],
      ['  if (!bs) notFound();', '→ 404 thật'],
      ['  return <article><h1>{bs.ten}</h1>…', 'không useQuery'],
      ['}', ''],
    ], { fs: 13 })}`,
    t(['$ npx next build', '▲ Next.js 16.3.6 (Turbopack)', '✓ Compiled successfully in 3.9s', '✓ Generating static pages using 3 workers (10/10)', 'Route (app)', '┌ ○ /', '├ ○ /_not-found', '├ ○ /bac-si', '└   /bac-si/[id]', '+   ├ ● /bac-si/bs-1', '+   ├ ● /bac-si/bs-2', '+   ├ ● /bac-si/bs-3', '+   └ ● [+3 more paths]', '○  (Static)  prerendered as static content', '●  (SSG)     prerendered as static HTML', '           (uses generateStaticParams)'], 'next build', 14, '~/ch07-next')) },

  /* 23 */ { t: "Server Component mặc định, 'use client' khi cần tương tác", body: two(
    `${serverClient()}
     ${box('tip', 'Đẩy tương tác xuống LÁ: trang, danh sách ở máy chủ; nút ♡, chip lọc, form đặt lịch là client.')}`,
    `${t(['# chép nguyên component Vite, quên \'use client\'', '$ npx next build', '! > Build error occurred', '! Error: Turbopack build failed with 1 error:', '! ./app/thu-loi/page.tsx:1:10', "! You're importing a module that depends on", '! `useState` into a React Server Component module.', '! This API is only available in Client Components.', '  To fix, mark the file (or its parent) with the', '  `"use client"` directive.'], 'next build · Next.js 16.3.6', 13.5, '~/ch07-next')}
     ${box('warn', 'Mọi component của app khoá này đều dùng useState / useEffect / onClick / TanStack Query / Zustand ⇒ bên Next.js đều phải ở dưới một ranh giới <code>\'use client\'</code>.')}`) },

  /* 24 */ { t: 'Khi nào cần Next.js — khi nào Vite SPA là đủ', body: table(['Câu hỏi', 'Vite SPA + React Router', 'Next.js (hoặc RR Framework Mode)'], [
    ['Trang cần được tìm thấy / xem trước khi chia sẻ?', '+Không: quản trị, dashboard, sau đăng nhập', '!Có: sản phẩm, hồ sơ bác sĩ, blog'],
    ['Deploy ở đâu?', '+Host tĩnh / CDN, chỉ là file', '!Máy chủ Node (static export thì mất tính năng server)'],
    ['Ai giữ backend?', 'Đội API riêng (Spring, .NET, Node)', 'Frontend muốn có mã server sát giao diện'],
    ['Lần tải đầu trên máy yếu?', 'Ít quan trọng: mở một lần rồi ở lại', 'Quan trọng: lần ghé nào cũng “lạnh”'],
    ['Nhóm phải học thêm', 'Không', 'Ranh giới server/client, cache, deploy mới'],
    ['App phòng khám của khoá', '+Luồng đặt lịch, lịch hẹn của tôi', '!Trang bác sĩ công khai ⇒ khoá /courses/nextjs'],
  ], { sm: true }) },

  /* ───── dự án ───── */
  /* 25 */ { t: 'Dự án sau Chương 7: bảy trang dưới một layout', body: two(
    `${anh('rx-07', 'danh-sach.jpg', { w: 560, h: 230, url: 'localhost:5177/bac-si?ck=nhi', cap: '/bac-si — bộ lọc trên URL, “Xem chi tiết” là link' })}
     ${table(['URL', 'Trang'], [['<code>/</code> · <code>/bac-si</code> · <code>/bac-si/:id</code>', 'chủ · danh sách · hồ sơ + chọn giờ'], ['🔒 <code>/dat-lich/:khungGioId</code> · <code>/lich-hen</code>', 'form đặt lịch · lịch hẹn'], ['<code>/dang-nhap</code> · <code>*</code>', 'đăng nhập · 404 (trong layout)']], { sm: true })}`,
    `${anh('rx-07', 'chi-tiet.jpg', { w: 560, h: 450, url: 'localhost:5177/bac-si/bs-2', cap: 'Tiêu đề tab: “BS. Trần Thu Hà · Phòng khám An Tâm” · 09:30 đã kín' })}`) },

  /* 26 */ { t: 'Đặt lịch đi theo URL: chọn giờ → đăng nhập → form → lịch hẹn', body: two(
    `${anh('rx-07', 'dat-lich.jpg', { w: 560, h: 420, url: '/dat-lich/bs-2-2026-10-01-1400?bacSi=bs-2&ngay=2026-10-01', cap: 'Mọi thứ trang cần đều nằm trên URL ⇒ F5, Back, gửi link đều đúng' })}`,
    `${anh('rx-07', 'lich-hen.jpg', { w: 560, h: 170, url: 'localhost:5177/lich-hen', cap: 'Sau khi gửi: navigate(…, { replace: true, state: { vuaDat } })' })}
     ${t(['[bấm 14:00, chưa đăng nhập] URL = /dang-nhap', '[đăng nhập xong] URL = /dat-lich/bs-2-2026-10-01-1400', '    ?bacSi=bs-2&ngay=2026-10-01', '+ [Back từ /lich-hen] URL = /bac-si/bs-2'], 'Chromium thật · một lần Back', 13)}`) },

  /* 27 */ { t: 'Sai lầm hay gặp ở Chương 7', body: cards([
    { ic: '📦', t: 'Cài react-router-dom theo bài cũ', d: 'Gói đứng ở 7.18.4 ⇒ hai router ⇒ “…useContext(…) as it is null”.', c: 'red' },
    { ic: '🔗', t: '&lt;a href&gt; cho link trong app', d: '3 request, bộ đếm về 0 — mất state, store, cache.', c: 'amb' },
    { ic: '🌐', t: 'Quên SPA fallback khi deploy', d: 'F5 ở /bac-si/bs-2 ⇒ 404 của máy chủ, app không kịp tải.', c: 'ora' },
    { ic: '🔙', t: 'Chuyển hướng không replace', d: 'Đăng nhập xong phải Back 3 lần mới về trang chủ.', c: 'vio' },
    { ic: '🚪', t: 'Đăng xuất: xoá store trước, navigate sau', d: 'Cổng vẽ lại trước ⇒ đi tới /dang-nhap thay vì /.', c: 'pnk' },
    { ic: '🔄', t: 'Import xuyên tính năng qua barrel', d: 'tsc + Vitest xanh, dev server trắng trang (TDZ).', c: 'blu' },
  ]) },

  /* 28 */ { t: 'Bảng tra nhanh Chương 7', body: table(['Muốn', 'Viết'], [
    ['Cài / import', "<code>npm i react-router</code> · <code>RouterProvider</code> từ <code>'react-router/dom'</code>, còn lại từ <code>'react-router'</code>"],
    ['Bảng route', '<code>createBrowserRouter([{ path, Component, children, ErrorBoundary }])</code> — tạo NGOÀI component'],
    ['Link · link biết đang chọn', '<code>&lt;Link to&gt;</code> · <code>&lt;NavLink to end&gt;</code> ⇒ <code>.active</code> + <code>aria-current</code>'],
    ['Tham số · query', "<code>const { id } = useParams&lt;'id'&gt;()</code> · <code>const [sp, setSp] = useSearchParams()</code>"],
    ['Điều hướng bằng code', "<code>navigate(to, { replace: true, state })</code> · <code>navigate(-1)</code> · <code>await navigate(…)</code>"],
    ['Layout · trang mặc định · 404', '<code>&lt;Outlet /&gt;</code> · <code>{ index: true }</code> · <code>{ path: \'*\' }</code> trong layout'],
    ['Chặn trang', 'layout route: <code>&lt;Navigate to="/dang-nhap" replace state={{ tu }} /&gt;</code> · hoặc <code>middleware</code> ném <code>redirect()</code>'],
    ['Test', '<code>createMemoryRouter(routes, { initialEntries: [url] })</code> · <code>router.state.location</code>'],
    ['Cấu trúc', '<code>app/ → pages/ → features/*/index.ts → shared/</code> · alias <code>@/</code> + <code>resolve.tsconfigPaths</code> · lint chặn'],
  ], { sm: true }) },

  /* 29 */ { t: 'Tự gõ tiếp dự án: route, layout, cổng và thư mục theo tính năng', body: two(
    list([
      '<code>app/router.tsx</code> — 7 route dưới <code>KhungTrang</code> (Outlet, ScrollRestoration, ErrorBoundary)',
      '<code>app/Header.tsx</code> — NavLink, số lịch hẹn, đăng xuất đúng thứ tự',
      '<code>features/dang-nhap</code> — store persist, <code>YeuCauDangNhap</code>, form',
      '<code>pages/TrangChiTietBacSi</code> + <code>features/dat-lich/ChonKhungGio</code> — ngày trên <code>?ngay=</code>',
      '<code>pages/TrangDatLich</code> — mọi thứ trên URL, gửi xong <code>replace</code> sang <code>/lich-hen</code>',
      'Dời file sang <code>features/</code> + <code>shared/</code>, alias <code>@/</code>, luật oxlint',
    ]),
    `${t(['$ npx tsc -b && npx vitest run', '+  Test Files  19 passed (19)', '+       Tests  80 passed (80)', '# 11 test mới ở app/router.test.tsx', '$ npx oxlint src; echo "exit $?"', 'exit 0', '# 0 lỗi (5 cảnh báo cũ ở FormDatLich.test)'], 'Đạt khi · dự án sau Chương 7', 14)}
     ${anh('rx-07', 'khong-co.jpg', { w: 540, h: 170, url: 'localhost:5177/bac-si/bs-99', cap: 'id không có ⇒ trang tự báo, menu vẫn còn' })}`) },
]);
