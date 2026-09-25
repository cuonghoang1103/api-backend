/**
 * React · Deck rx-00 — Mục 0: Vì sao React (bắt đầu tại đây, cài đặt, JSX, JavaScript cho React).
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy ảo soạn bài (Node 22.22.2, npm 10.9.7):
 *   npm create vite@latest (create-vite 9.2.1) · react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.1
 *   npx create-react-app@latest (5.1.0, react-scripts 5.0.1) — để đo so sánh, cùng máy, cùng ngày.
 *   jQuery 3.7.1 + jsdom 30.1.1 cho minh hoạ "giao diện lệch dữ liệu".
 * Mốc lịch sử kiểm trên react.dev/blog (bản clone), CHANGELOG.md của facebook/react và legacy.reactjs.org/blog.
 * Ảnh chụp (Playwright): rx-anh/rx-00/vite-mac-dinh.jpg · trang-chu.jpg · loi-overlay.jpg.
 */
import {
  S, cover, cards, box, steps, table, vs, kpis, flow, two, list, mindmap, term as rxTerm, diagram, yaml, sv, R, T, A, D,
  compTree, renderFlow, anh, tree,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-00', code: 'REACT · MỤC 0', title: 'Vì sao React', sub: 'React · Mục 0' };

const t = (lines, title, fs = 15, dir = '~/phong-kham') => rxTerm(lines, { title, dir, fs });

/* ───────────── Slide 3 — UI = f(state) ───────────── */
const uiLaHam = () => {
  let s = '';
  s += R(0, 60, 370, 250, { c: 'grn', fill: '#0f1d17' }) + T(185, 100, 'STATE (dữ liệu)', { fs: 20, b: true, c: 'grn', a: 'middle' });
  [[0, 'khungGio = ['], [1, "{ gio: '08:00', conTrong: false },"], [1, "{ gio: '08:30', conTrong: true },"], [1, "{ gio: '09:00', conTrong: true },"], [0, ']']]
    .forEach(([th, ln], i) => { s += T(20 + th * 22, 140 + i * 28, ln, { fs: 13.5, mono: true, c: '#cfe9dc' }); });
  s += A(376, 185, 424, 185, { c: 'rx', sw: 4 });
  s += R(430, 110, 280, 150, { c: 'rx', fill: '#0c1a26' }) + T(570, 160, 'Component', { fs: 22, b: true, a: 'middle' }) +
    T(570, 192, 'một HÀM của React', { fs: 16, c: 'mu', a: 'middle' }) + T(570, 222, 'f(state) → JSX', { fs: 18, mono: true, c: 'rx', a: 'middle' });
  s += A(720, 185, 830, 185, { c: 'rx', sw: 4 });
  s += R(840, 40, 320, 290, { c: 'blu', fill: '#fff' });
  s += T(862, 82, 'Còn 2 khung trống', { fs: 20, b: true, c: '#111' });
  [['08:00', 'Đã đặt', '#9ca3af'], ['08:30', 'Đặt', '#0e8a7e'], ['09:00', 'Đặt', '#0e8a7e']].forEach(([g, nut, c], i) => {
    const y = 110 + i * 62;
    s += T(862, y + 30, g, { fs: 19, c: '#111' }) + `<rect x="1030" y="${y + 8}" width="104" height="34" rx="8" fill="${c}"/>` + T(1082, y + 31, nut, { fs: 16, c: '#fff', a: 'middle', b: true });
  });
  s += T(1000, 360, 'UI (màn hình)', { fs: 18, b: true, c: 'blu', a: 'middle' });
  s += R(0, 392, 1160, 70, { c: 'amb', fill: 'rgba(255,194,51,.07)' }) +
    T(20, 425, 'Bạn KHÔNG sửa màn hình. Bạn sửa state — React gọi lại hàm và tự vẽ lại phần khác đi.', { fs: 19, b: true, c: 'amb' }) +
    T(20, 451, 'Cùng state ⇒ cùng màn hình. Muốn biết vì sao màn hình sai: nhìn state, không đi dò từng thẻ.', { fs: 16, c: 'mu' });
  return sv(1160, 465, s);
};

/* ───────────── Slide 4 — Dòng thời gian (mốc KIỂM NGUỒN) ───────────── */
const dongThoiGian = () => {
  let s = '';
  const X0 = 40, X1 = 1130, y = 230;
  s += `<line x1="${X0}" y1="${y}" x2="${X1}" y2="${y}" stroke="${D.mu}" stroke-width="3"/>`;
  const moc = [
    [2012, '03/2012', 'FaxJS → FBolt → “React”', 'vào mã Facebook', 'dim', -1],
    [2013.4, '29/05/2013', 'Mở mã nguồn', 'v0.3.0 “Initial public release”', 'rx', 1],
    [2015.2, '03/2015', 'React Native mở mã', '(công bố 01/2015)', 'vio', -1],
    [2016.55, '07/2016', 'Create React App', 'ra đời', 'amb', 1],
    [2017.7, '26/09/2017', 'React 16 — Fiber', 'viết lại lõi', 'tea', -1],
    [2019.1, '06/02/2019', 'React 16.8 — Hooks', 'function component', 'grn', 1],
    [2022.25, '29/03/2022', 'React 18', 'concurrent', 'blu', -1],
    [2024.93, '05/12/2024', 'React 19', 'Actions, use()', 'rx', 1],
    [2025.12, '14/02/2025', 'CRA bị khai tử', '→ Vite / framework', 'red', -1],
    [2025.77, '07/10/2025', 'Compiler 1.0', 'tự memo', 'pnk', 1],
    [2026.15, '24/02/2026', 'React Foundation', '(Linux Foundation)', 'ora', -1],
    [2026.7, '09/09/2026', 'React 19.3', 'bản mới nhất', 'grn', 1],
  ];
  const X = (yr) => X0 + (yr - 2012) / (2026.9 - 2012) * (X1 - X0);
  [2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026].forEach((yr) => { s += T(X(yr), y + 30, String(yr), { fs: 14, c: 'dim', a: 'middle', mono: true }); });
  const lanes = { '-1': [0, 0], 1: [0, 0] };
  moc.forEach(([yr, d, a, b, c, side], i) => {
    const x = X(yr), up = side < 0;
    const lvl = (i % 4 < 2) ? 0 : 1;
    const ty = up ? y - 50 - lvl * 78 : y + 62 + lvl * 78;
    s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${up ? ty + 40 : ty - 24}" stroke="${D[c]}" stroke-width="2" stroke-dasharray="4 4"/>`;
    s += `<circle cx="${x}" cy="${y}" r="8" fill="${D[c]}"/>`;
    const anchor = x < 110 ? 'start' : x > 1060 ? 'end' : 'middle';
    s += T(x, ty - 6, d, { fs: 13.5, c: 'mu', a: anchor, mono: true }) + T(x, ty + 14, a, { fs: 15.5, b: true, c, a: anchor }) + T(x, ty + 32, b, { fs: 13, c: 'mu', a: anchor });
    void lanes;
  });
  s += T(580, 470, 'Nguồn: react.dev/blog · CHANGELOG.md (facebook/react) · legacy.reactjs.org/blog — kiểm 09/2026', { fs: 14, c: 'dim', a: 'middle' });
  return sv(1160, 478, s);
};

/* ───────────── Slide 8 — jQuery: giao diện lệch dữ liệu (log THẬT) ───────────── */
const jqLech = () => two(
  t(['$ node dat-lich-jquery.cjs', 'Mở trang', '  màn hình: "Còn 3 khung trống" · "Lịch của tôi (0)"', '  nút "Đặt" còn bấm được: 3 · mảng dữ liệu conTrong: 3',
    'Đặt 08:00 và 08:30', '  màn hình: "Còn 1 khung trống" · "Lịch của tôi (2)"', '  nút "Đặt" còn bấm được: 1 · mảng dữ liệu conTrong: 1',
    'Huỷ 08:00', '! màn hình: "Còn 1 khung trống" · "Lịch của tôi (1)"', '! nút "Đặt" còn bấm được: 2 · mảng dữ liệu conTrong: 1'], 'jQuery 3.7.1 + jsdom · chạy thật', 13.5, '~/minh-hoa'),
  `${list([
    'Nút <strong>Đặt</strong> (tuần 1) sửa <strong>bốn chỗ</strong> trên DOM + một chỗ trong mảng.',
    'Nút <strong>Huỷ</strong> (tuần 3, người khác viết) sửa ba chỗ — <strong>quên</strong> ô “Còn N khung trống” và mảng dữ liệu.',
    'Kết quả: màn hình nói <strong>1</strong>, số nút bấm được là <strong>2</strong>, mảng nói <strong>1</strong>. Ba “sự thật” khác nhau, không có lỗi nào hiện ra.',
  ])}<div style="height:14px"></div>${box('bad', 'Mỗi tính năng mới = thêm một chỗ phải nhớ sửa. Lỗi không nằm ở jQuery — nó nằm ở chỗ <strong>dữ liệu và màn hình được giữ riêng</strong>.')}`);

/* ───────────── Slide 9 — React: một nguồn sự thật ───────────── */
const reactMotNguon = () => two(
  yaml([
    ['const [khungGio, setKhungGio] = useState(BAN_DAU)', 'MỘT nguồn'],
    ['const conTrong = khungGio.filter((k) => k.conTrong)', 'tính ra'],
    ['const cuaToi   = khungGio.filter((k) => !k.conTrong)', 'tính ra'],
    ['', ''],
    ['const doi = (id, giaTri) =>', ''],
    ['  setKhungGio(khungGio.map((k) =>', 'mảng MỚI'],
    ['    k.id === id ? { ...k, conTrong: giaTri } : k))', ''],
    ['', ''],
    ['<p>Còn {conTrong.length} khung trống</p>', ''],
    ['<p>Lịch của tôi ({cuaToi.length})</p>', ''],
  ], { fs: 14.5 }),
  `${t(['$ npx vitest run src/minh-hoa', ' ✓ đặt hai khung rồi huỷ một:', '   mọi con số vẫn khớp nhau 239ms', '', ' Test Files  1 passed (1)', '      Tests  1 passed (1)'], 'Vitest 5.0.1 · cùng kịch bản', 14, '~/phong-kham')}<div style="height:14px"></div>
   ${box('good', 'Nút Huỷ chỉ đổi <strong>một</strong> trường trong state. Ô đếm, danh sách “của tôi”, trạng thái nút đều <strong>tính lại</strong> từ state ⇒ không thể quên.')}`);

/* ───────────── Slide 15 — index.html → main.tsx → App.tsx ───────────── */
const luongKhoiDong = () => diagram({
  w: 1160, h: 420,
  nodes: [
    { id: 'h', x: 0, y: 20, w: 330, h: 110, t: 'index.html', d: '<div id="root"></div>\n<script src="/src/main.tsx">', c: 'amb', mono: true },
    { id: 'm', x: 415, y: 20, w: 330, h: 110, t: 'src/main.tsx', d: 'createRoot(#root)\n  .render(<App />)', c: 'rx', mono: true },
    { id: 'a', x: 830, y: 20, w: 330, h: 110, t: 'src/App.tsx', d: 'function App() {\n  return <div>…</div> }', c: 'grn', mono: true },
    { id: 'v', x: 40, y: 270, w: 380, h: 110, t: 'Vite (máy chủ dev)', d: 'dịch TSX → JS khi trình duyệt xin\nHMR: sửa file, trang cập nhật ~100ms', c: 'vio' },
    { id: 'b', x: 740, y: 270, w: 380, h: 110, t: 'Trình duyệt', d: 'chạy JS, React tạo DOM\ntrong <div id="root">', c: 'blu' },
  ],
  edges: [{ from: 'h', to: 'm', t: 'script' }, { from: 'm', to: 'a', t: 'import' }, { from: 'v', to: 'b', t: 'JS đã dịch' }, { from: 'b', to: 'h', t: 'GET /', dash: true, fs: 't', ts: 'b' }],
});

/* ───────────── Slide 18 — JSX thành gì ───────────── */
const jsxThanhGi = () => two(
  `${yaml([
    ['// the-bac-si.tsx', 'bạn viết'],
    ['<div className="the">', ''],
    ['  <h2>{ten}</h2>', ''],
    ['  <p>Nhi · 8 năm</p>', ''],
    ['</div>', ''],
  ], { fs: 16 })}
  <div style="height:14px"></div>
  ${yaml([
    ['// tsc --jsx react  (runtime cũ)', ''],
    ['React.createElement("div", { className: "the" },', ''],
    ['  React.createElement("h2", null, ten),', ''],
    ['  React.createElement("p", null, "Nhi · 8 năm"))', 'cần import React'],
  ], { fs: 14 })}`,
  `${yaml([
    ['// tsc --jsx react-jsx  (runtime mới, React 17+)', ''],
    ['import { jsx as _jsx, jsxs as _jsxs }', ''],
    ['  from "react/jsx-runtime";', 'tự thêm import'],
    ['_jsxs("div", { className: "the", children: [', ''],
    ['  _jsx("h2", { children: ten }),', ''],
    ['  _jsx("p", { children: "Nhi · 8 năm" }) ] })', ''],
  ], { fs: 14 })}<div style="height:14px"></div>
  ${box('info', 'JSX <strong>không phải HTML</strong>: nó là cú pháp viết tắt cho <strong>lời gọi hàm</strong>. Vite (plugin React, dùng Oxc) dịch nó lúc bạn lưu file; trình duyệt không bao giờ thấy JSX.')}`);

/* ───────────── Slide 23 — destructuring & spread ───────────── */
const destructSpread = () => two(
  `${yaml([
    ['const { ten, chuyenKhoa } = bs', 'rút trường'],
    ['const { namKinhNghiem: soNam } = bs', 'đổi tên'],
    ["const { anh = '/mac-dinh.png' } = bs", 'mặc định'],
    ['const [dau, thuHai, ...conLai] = ids', 'theo VỊ TRÍ'],
    ['const [dem, setDem] = useState(0)', '= y hệt'],
    ['function The({ ten, namKinhNghiem }) {}', 'props'],
  ], { fs: 15 })}<div style="height:12px"></div>
  ${t(['$ node 2-destructuring.ts', 'BS. Trần Thu Hà | nhi', '8 | /anh-mac-dinh.png', "bs-1 bs-2 [ 'bs-3', 'bs-4', 'bs-5', 'bs-6' ]"], 'Node 22 · chạy thật', 14, '~/js')}`,
  `${yaml([
    ['const moi = { ...goc, namKinhNghiem: 13 }', 'copy + ghi đè'],
    ['const ds2 = [...ds, bacSiMoi]', 'mảng MỚI'],
    ['const tong = (...so) => so.reduce(…)', 'rest: gom lại'],
  ], { fs: 15 })}<div style="height:12px"></div>
  ${t(['$ node 3-spread.ts', '12 13 false       # goc giữ nguyên', "[ 'BS. Nguyễn Minh An', 'BS. Trần Thu Hà', 'BS. Mới' ]", 'Mai true          # spread chỉ copy 1 tầng!', '25'], 'Node 22 · chạy thật', 14, '~/js')}
  ${box('warn', 'Spread copy <strong>một tầng</strong>: object lồng bên trong vẫn là CÙNG một object. Sửa nó là sửa cả bản gốc.')}`);

/* ───────────── Slide 24 — map / filter / reduce trên danh sách bác sĩ ───────────── */
const mangBacSi = () => {
  let s = '';
  const ds = [['bs-1', 'noi', 12], ['bs-2', 'nhi', 8], ['bs-3', 'da-lieu', 5], ['bs-4', 'rang-ham-mat', 15], ['bs-5', 'noi', 3], ['bs-6', 'nhi', 20]];
  const col = { noi: 'blu', nhi: 'grn', 'da-lieu': 'amb', 'rang-ham-mat': 'vio' };
  s += T(0, 22, 'danhSachBacSi (6 phần tử)', { fs: 16, b: true, c: 'mu' });
  ds.forEach(([id, ck, n], i) => { const y = 36 + i * 58; s += R(0, y, 250, 48, { c: col[ck], fill: '#0f182a', r: 9 }) + T(14, y + 30, `${id} · ${ck} · ${n}`, { fs: 14.5, mono: true }); });
  const khoi = (x, y, h, tieuDe, dong, ketQua, c) => {
    s += R(x, y, 850, h, { c, fill: 'rgba(255,255,255,.02)' }) + T(x + 16, y + 28, tieuDe, { fs: 16, b: true, mono: true, c });
    dong.forEach((d, k) => { s += T(x + 16, y + 56 + k * 24, d, { fs: 15.5, c: 'mu' }); });
    s += T(x + 834, y + 28, ketQua, { fs: 16, a: 'end', b: true });
  };
  s += A(262, 120, 296, 60, { c: 'mu' }) + A(262, 190, 296, 175, { c: 'mu' }) + A(262, 260, 296, 290, { c: 'mu' }) + A(262, 330, 296, 395, { c: 'mu' });
  khoi(305, 10, 88, '.map((b) => b.id)', ['biến TỪNG phần tử thành thứ khác · 6 vào → 6 ra'], "['bs-1', …, 'bs-6']", 'blu');
  khoi(305, 110, 88, '.filter((b) => b.namKinhNghiem >= 10)', ['giữ phần tử thoả điều kiện · 6 vào → 3 ra'], 'bs-1, bs-4, bs-6', 'grn');
  khoi(305, 210, 112, '.find((b) => b.chuyenKhoa === "da-lieu")', ['phần tử ĐẦU TIÊN thoả · không có ⇒ undefined', '.some(…) → true/false · .findIndex(…) → số'], 'BS. Lê Quốc Bảo', 'amb');
  khoi(305, 338, 88, '.reduce((tong, b) => tong + b.namKinhNghiem, 0)', ['gộp cả mảng thành MỘT giá trị (0 là giá trị ban đầu)'], '63', 'vio');
  s += R(0, 440, 1160, 44, { c: 'red', fill: 'rgba(255,92,108,.07)' }) +
    T(16, 468, 'Bẫy: .sort() SỬA mảng gốc (đo thật: ids gốc đổi thành bs-6 … bs-1). Trong React dùng .toSorted() hoặc [...ds].sort().', { fs: 15.5, c: 'red', b: true });
  return sv(1160, 488, s);
};

/* ───────────── Slide 27 — async/await: thứ tự in ra ───────────── */
const asyncThuTu = () => {
  let s = '';
  const X = (ms) => 120 + ms * 5.4;
  s += `<line x1="${X(0)}" y1="300" x2="${X(190)}" y2="300" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 50, 100, 150].forEach((m) => { s += T(X(m), 322, `${m} ms`, { fs: 13.5, c: 'dim', a: 'middle', mono: true }); });
  const moc = (ms, y, txt, c) => `<circle cx="${X(ms)}" cy="300" r="7" fill="${D[c]}"/>` +
    `<line x1="${X(ms)}" y1="300" x2="${X(ms)}" y2="${y + 8}" stroke="${D[c]}" stroke-width="1.6" stroke-dasharray="4 4"/>` + T(X(ms) + 8, y, txt, { fs: 16, c });
  s += moc(0, 30, '1. bắt đầu', 'mu');
  s += moc(0.5, 70, '2. đã gọi, p là [object Promise]', 'blu');
  s += moc(1, 110, '3. dòng này chạy TRƯỚC khi có kết quả', 'amb');
  s += moc(50, 150, '4. có kết quả: BS. Nguyễn Minh An', 'grn');
  s += moc(60, 190, '5. bắt lỗi: 404: không có bác sĩ bs-99', 'red');
  s += moc(160, 230, '6. Promise.all ≈100 ms', 'vio');
  s += T(0, 360, 'await = “tạm dừng HÀM NÀY chờ Promise”, không dừng cả chương trình. Dòng 3 in ra trước dòng 4.', { fs: 17, b: true });
  s += T(0, 392, 'try/catch bắt lỗi của await · Promise.all chạy song song: 2 lời gọi × 100 ms ⇒ ≈100 ms, không phải 200.', { fs: 16, c: 'mu' });
  s += T(0, 424, 'Chương 6 dùng đúng thứ này để gọi API — nhưng qua TanStack Query, không tự viết useEffect + fetch.', { fs: 16, c: 'mu' });
  return sv(1160, 430, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Mục 0 — Vì sao React', sub: 'React là gì · lịch sử · Vite + TypeScript · JSX · JavaScript bạn cần', chap: 'MỤC 0' }),

  /* 2 */ { t: 'Bản đồ Mục 0: năm bài trước khi viết component đầu tiên', body: mindmap('Mục 0', 'từ “vì sao” tới dự án phong-kham chạy được', [
    { t: 'Bắt đầu 1/2', d: 'React là gì · lịch sử có mốc · vì sao vẫn tuyển · so sánh', c: 'rx' },
    { t: 'Bắt đầu 2/2', d: 'giao diện lệch dữ liệu · lộ trình · dự án xuyên suốt', c: 'tea' },
    { t: '0.1 Cài đặt', d: 'npm create vite · cấu trúc · HMR · tsc/build/test', c: 'vio' },
    { t: '0.2 JSX', d: 'thành lời gọi hàm · {biểu thức} · điều kiện · Fragment', c: 'amb' },
    { t: '0.3 JS cho React', d: 'destructuring · spread · map/filter · ?. ?? · async', c: 'grn' },
    { t: 'Quiz 0.4', d: '10 câu tình huống', c: 'pnk' },
  ]) },

  /* ───── Bắt đầu 1/2 ───── */
  /* 3 */ { t: 'React: giao diện là một hàm của dữ liệu', body: uiLaHam() },
  /* 4 */ { t: 'Mười hai mốc, mỗi mốc có nguồn kiểm được', body: dongThoiGian() },
  /* 5 */ { t: 'Bốn lựa chọn phổ biến, bốn triết lý khác nhau', body: table(['', 'React', 'Vue', 'Angular', 'Svelte'], [
    ['Bản trên npm (09/2026)', '!19.3.0', '3.5.43', '22.2.0', '5.57.1'],
    ['Là gì', 'thư viện UI', 'framework “lũy tiến”', 'framework trọn gói', 'trình biên dịch'],
    ['Viết giao diện bằng', 'JSX (JS thuần)', 'template trong .vue', 'template HTML + class TS', 'file .svelte'],
    ['Router, form, gọi API', 'tự chọn thư viện', 'chính hãng (Vue Router, Pinia)', 'có sẵn trong bộ', 'SvelteKit'],
    ['Làm app di động', '+React Native', '—', '—', '—'],
    ['Học đầu tiên', 'JS nhiều, “ma thuật” ít', 'dễ bắt đầu', 'nhiều khái niệm', 'ít mã nhất'],
  ], { sm: true }) },
  /* 6 */ { t: 'FER202 dạy nền đúng — công ty dùng bộ công cụ mới hơn', body: table(['Ở FER202', 'Ở công ty (2026)', 'Khoá này dạy ở'], [
    ['Create React App', '+Vite + TypeScript', 'Bài 0.1'],
    ['PropTypes', '+TypeScript (kiểm lúc gõ, không lúc chạy)', 'Chương 1'],
    ['class component + lifecycle', '+function component + hook', 'Chương 2, 4'],
    ['Redux (+ thunk)', '+Zustand (state client) · TanStack Query (state server)', 'Chương 5, 6'],
    ['fetch trong componentDidMount', '+TanStack Query', 'Chương 6'],
    ['form tự viết', '+React Hook Form + Zod', 'Chương 3'],
    ['React-Bootstrap', '+Tailwind / CSS Modules', 'Chương 13'],
    ['Enzyme (tài liệu cũ)', '+Testing Library + Vitest', 'Chương 9'],
  ], { sm: true }) },
  /* 7 */ { t: 'Khoá đưa bạn từ trang tĩnh tới app đặt lịch lên production', body: flow([
    { e: '0', t: 'Mục 0', d: 'Vite + TS, trang chủ tĩnh, 1 test', c: 'blu' },
    { e: '1–5', t: 'Nền tảng', d: 'component, state, form, effect, chia sẻ state', c: 'tea' },
    { e: '6–9', t: 'App thật', d: 'API, router, hiệu năng, test', c: 'grn' },
    { e: '10', t: 'Giữa khoá', d: 'tự dựng xong app đặt lịch', c: 'amb' },
    { e: '11–14', t: 'Nâng cao', d: 'bên trong React, React 19, kiến trúc, production', c: 'vio' },
  ]) + `<div style="height:18px"></div>` + box('tip', 'Mỗi chương kết thúc bằng <strong>🛠 Tự gõ tiếp dự án</strong>: đề bài, tiêu chí đạt (test xanh hoặc ảnh giống), lời giải đóng sẵn. Tới Chương 10 bạn đã <strong>tự gõ</strong> xong “Đặt lịch phòng khám An Tâm”.') },

  /* ───── Bắt đầu 2/2 ───── */
  /* 8 */ { t: 'jQuery sửa DOM bằng tay: màn hình lệch dữ liệu sau một lần Huỷ', body: jqLech() },
  /* 9 */ { t: 'Cùng kịch bản bằng React: mọi con số tính từ một mảng', body: reactMotNguon() },
  /* 10 */ { t: 'Học không kiệt sức: tối thiểu trước, đầy đủ sau', body: two(
    steps([
      ['<strong>Lộ trình tối thiểu</strong> (xin thực tập)', 'Mục 0 → Ch1 → Ch2 → Ch3 → Ch6 → Ch7 → Ch9 → Ch10'],
      ['<strong>Lộ trình đầy đủ</strong> (lên middle)', 'thêm Ch4, Ch5, Ch8, rồi Ch11–14'],
      ['<strong>Mỗi buổi 60–90 phút</strong>', 'một bài: đọc → chạy ví dụ → 🧪 → 🛠'],
    ]),
    list([
      'Gõ lại code, <strong>đừng dán</strong>. Gõ sai và đọc lỗi thật là một nửa bài học.',
      'Bí quá 20 phút ⇒ mở lời giải, đọc, <strong>đóng lại</strong>, gõ lại từ đầu.',
      'Không học hai thư viện state cùng lúc. Không học Next.js trước khi xong Ch7.',
      'Mỗi chương xong: <code>npx tsc -b</code> sạch + <code>npx vitest run</code> xanh + commit.',
    ])) },
  /* 11 */ { t: 'Dự án xuyên suốt: “Đặt lịch phòng khám An Tâm”', body: two(
    anh('rx-00', 'trang-chu.jpg', { w: 600, h: 390, url: 'localhost:5101 · vite preview · hết Mục 0', cap: 'Ảnh chụp THẬT dự án sau Mục 0 (Playwright)' }),
    list([
      '<strong>6 bác sĩ, 4 chuyên khoa</strong> — <code>src/du-lieu/bac-si.ts</code>, kiểu trong <code>src/types.ts</code> (tên cố định cả khoá).',
      'Ch1–5: danh sách, lọc, form đặt lịch, luồng 4 bước.',
      'Ch6–9: API giả bằng MSW, TanStack Query, router, test đầy đủ.',
      'Ch10: ghép hoàn chỉnh + Playwright. Ch11–14: React 19, bảo mật, đăng nhập, CI.',
    ])) },

  /* ───── 0.1 Cài đặt ───── */
  /* 12 */ { t: 'npm create vite: hai câu hỏi, dưới một giây', body: two(
    t(['$ npm create vite@latest phong-kham -- \\', '    --template react-ts', '> npx', '> create-vite phong-kham --template react-ts', '*  Which linter to use?', '|  > Oxlint', '|    ESLint', '*  Install with npm and start now?', '|    Yes / > No', 'o  Scaffolding project in …/phong-kham...', '—  Done. Now run:', '  cd phong-kham', '  npm install', '  npm run dev'], 'create-vite 9.2.1 · tương tác', 14, '~'),
    t(['$ npm install', 'added 27 packages, and audited 28 packages in 8s', 'found 0 vulnerabilities', '$ npm run dev', '  VITE v8.3.1  ready in 400 ms', '  ➜  Local:   http://localhost:5173/', '  ➜  Network: use --host to expose', '$ npm ls react typescript vite', '+-- react@19.3.0', '+-- typescript@6.0.3', '`-- vite@8.3.1'], 'npm 10.9.7 · Node 22.22.2', 14)) },
  /* 13 */ { t: 'Cùng máy, cùng ngày: Vite nhẹ và nhanh hơn CRA nhiều lần', body: `${table(['Đo 25/09/2026', 'create-react-app 5.1.0', 'create-vite 9.2.1 (react-ts)'], [
    ['Gói cài', '1292 gói · 48 s', '+27 gói · 8 s'],
    ['node_modules', '361 MB', '+90 MB'],
    ['npm audit lúc cài', '28 lỗ hổng (14 high)', '+0'],
    ['Máy chủ dev sẵn sàng', '~7,1 s (webpack)', '+0,27–0,4 s'],
    ['Build production', '8,8 s (70 kB gzip)', '0,17 s (69 kB gzip)'],
    ['Dòng đầu tiên in ra', '!create-react-app is deprecated.', 'Scaffolding project…'],
  ])}<div style="height:12px"></div>${box('info', 'CRA vẫn chạy được (vẫn cài React 19.3.0). Nhưng react.dev đã khai tử nó ngày 14/02/2025 — dự án mới dùng Vite hoặc một framework.')}` },
  /* 14 */ { t: 'Cấu trúc dự án: bạn chỉ sống trong src/', body: two(
    tree(`phong-kham/
  index.html          # trang DUY NHẤT, có <div id="root">
  package.json        # scripts: dev, build, lint, preview
  vite.config.ts      # plugin React (+ test của Vitest)
  tsconfig.json       # chỉ trỏ tới 2 file dưới
  tsconfig.app.json   # kiểm code trong src/
  tsconfig.node.json  # kiểm vite.config.ts
  public/
    favicon.svg       # chép nguyên vào dist/
  src/
    main.tsx          # điểm vào: createRoot(...).render
    App.tsx           # component đầu tiên
    index.css`),
    list([
      '<code>public/</code>: file phục vụ nguyên xi theo đường dẫn <code>/favicon.svg</code>.',
      '<code>src/assets/</code> (template có sẵn): file được <code>import</code> ⇒ Vite gắn mã băm vào tên, vd <code>hero-CLDdwZDr.png</code>.',
      '<code>.tsx</code> = TypeScript + JSX. <code>.ts</code> = TypeScript thuần (không JSX).',
      'Không có <code>webpack.config.js</code>, không có <code>eject</code>. Cấu hình là một file 7 dòng.',
    ])) },
  /* 15 */ { t: 'Từ index.html tới App: ba file, một chuỗi import', body: luongKhoiDong() },
  /* 16 */ { t: 'Trang mặc định của Vite: chạy được là bước một', body: two(
    anh('rx-00', 'vite-mac-dinh.jpg', { w: 640, h: 400, url: 'localhost:5100 · npm run dev', cap: 'Ảnh chụp THẬT: template react-ts, create-vite 9.2.1' }),
    list([
      'Thấy trang này = Node, npm, Vite, React đều ổn.',
      'Sửa chữ trong <code>src/App.tsx</code>, lưu: trang đổi sau <strong>~100 ms</strong> mà không tải lại (đo bằng Playwright). Log: <code>[vite] (client) hmr update /src/App.tsx</code>.',
      'Console trình duyệt gợi ý cài <strong>React DevTools</strong> — tiện ích xem cây component và props.',
      'Bước kế tiếp: dọn template (xoá logo, <code>App.css</code>, <code>icons.svg</code>).',
    ])) },
  /* 17 */ { t: 'vite build KHÔNG kiểm kiểu — tsc -b mới kiểm', body: two(
    t(['# gõ sai: const namNay: string = new Date().getFullYear()', '$ npx tsc -b', '! src/App.tsx(13,9): error TS2322: Type \'number\' is', '!   not assignable to type \'string\'.', '$ npx vite build', 'dist/assets/index-CcUL7llf.js  222.07 kB', '✓ built in 363ms          # xanh!', '$ npm run build           # tsc -b && vite build', '! src/App.tsx(13,9): error TS2322: …'], 'một bug, ba lệnh', 13.5),
    `${list([
      'Vite chỉ <strong>bóc</strong> kiểu TypeScript cho nhanh, không kiểm.',
      'Vì thế script <code>build</code> của template là <code>tsc -b &amp;&amp; vite build</code>.',
      'Ba lệnh chạy trước mỗi commit: <code>npx tsc -b</code> · <code>npx vitest run</code> · <code>npx vite build</code>.',
    ])}<div style="height:12px"></div>${box('warn', 'Template <strong>không</strong> kèm Vitest: tự cài (<code>npm i -D vitest jsdom @testing-library/react …</code>, 7,5 s) và thêm khối <code>test</code> vào <code>vite.config.ts</code>.')}`) },

  /* ───── 0.2 JSX ───── */
  /* 18 */ { t: 'JSX biến thành lời gọi hàm trước khi tới trình duyệt', body: jsxThanhGi() },
  /* 19 */ { t: 'Một phần tử JSX chỉ là một object mô tả', body: two(
    t(['$ node out/phan-tu.js', 'typeof: object', '{', "  '$$typeof': Symbol(react.transitional.element),", "  type: 'h1',", '  key: null,', "  props: { className: 'to',", "           children: 'Phòng khám An Tâm' },", '  _owner: null,', '  _store: {}', '}'], 'react 19.3.0 · chạy thật', 14.5, '~/thu-jsx'),
    list([
      'Tạo phần tử <strong>chưa</strong> tạo DOM nào. Nó là bản mô tả: <code>type</code> + <code>props</code>.',
      '<code>children</code> chỉ là một prop như mọi prop khác.',
      'React đọc các object này, so với lần trước, rồi mới sửa DOM thật (Chương 2, 11).',
      'Vì là giá trị JS nên JSX gán được vào biến, trả từ hàm, nằm trong mảng.',
    ])) },
  /* 20 */ { t: 'Bốn luật JSX — tsc báo lỗi trước khi bạn mở trình duyệt', body: cards([
    { ic: '①', t: 'Một phần tử gốc', d: '<code>TS2657: JSX expressions must have one parent element.</code> ⇒ bọc bằng <code>&lt;&gt;…&lt;/&gt;</code> (Fragment).', c: 'red' },
    { ic: '②', t: 'className, onClick', d: '<code>Property \'class\' does not exist … Did you mean \'className\'?</code> Thuộc tính viết kiểu camelCase.', c: 'amb' },
    { ic: '③', t: 'Thẻ nào cũng phải đóng', d: '<code>TS17008: JSX element \'img\' has no corresponding closing tag.</code> ⇒ <code>&lt;img … /&gt;</code>', c: 'vio' },
    { ic: '④', t: '{ } chứa BIỂU THỨC', d: '<code>{if (mo) …}</code> ⇒ <code>TS1109: Expression expected.</code> Dùng <code>? :</code> hoặc <code>&amp;&amp;</code>. <code>style</code> nhận object: <code>{{ color: \'red\' }}</code>.', c: 'blu' },
  ], 2) },
  /* 21 */ { t: 'Trong { }: số 0 hiện ra, true/false/null biến mất', body: two(
    t(["$ node out/phan-tu.js", "A <p>0</p>            # {soLichHen && <b>…</b>}", 'B <p></p>             # {soLichHen > 0 && …}', 'C <p></p>             # {true}{false}{null}{undefined}', "D <p>Chưa có ai</p>   # {ds.length ? … : 'Chưa có ai'}", 'E <p>&lt;b&gt;đậm?&lt;/b&gt;</p>  # chuỗi bị THOÁT', 'F <ul><li>Nội</li><li>Nhi</li></ul>  # mảng JSX', '', '# {bacSi} (cả object):', '! Objects are not valid as a React child', '! (found: object with keys {ten, namKinhNghiem})'], 'renderToStaticMarkup · chạy thật', 13.5, '~/thu-jsx'),
    `${list([
      '<code>&amp;&amp;</code> trả về <strong>vế trái</strong> khi vế trái falsy. <code>0</code> là falsy nhưng React <strong>vẽ số 0</strong>.',
      'Viết điều kiện thành boolean thật: <code>n &gt; 0 &amp;&amp;</code>, <code>ds.length &gt; 0 &amp;&amp;</code>.',
      'Chuỗi có <code>&lt;b&gt;</code> được hiện <strong>đúng từng chữ</strong> — React tự thoát HTML (lá chắn XSS, Chương 13).',
    ])}<div style="height:12px"></div>${box('bad', 'Object không vẽ được: in <code>{bacSi.ten}</code>, không in <code>{bacSi}</code>. TypeScript bắt trước: <code>TS2322 … not assignable to type \'ReactNode\'</code>.')}`) },
  /* 22 */ { t: 'Lỗi cú pháp JSX hiện ngay trên trang, chỉ đúng dòng', body: two(
    anh('rx-00', 'loi-overlay.jpg', { w: 660, h: 420, url: 'localhost:5104 · npm run dev', cap: 'Ảnh chụp THẬT: quên đóng &lt;img&gt;, Vite hiện lớp phủ lỗi' }),
    list([
      'Một thẻ quên đóng ⇒ <strong>4 lỗi</strong> dây chuyền. Đọc lỗi <strong>đầu tiên</strong>, sửa, lưu, xem lại.',
      '<code>Opened here</code> chỉ chỗ mở thẻ; <code>Expected &lt;/img&gt;</code> chỉ chỗ parser bỏ cuộc.',
      'Sửa xong, lớp phủ tự biến mất (HMR).',
      'Lớp phủ này là của <strong>Vite</strong> (plugin Oxc), không phải của React.',
    ])) },

  /* ───── 0.3 JS cho React ───── */
  /* 23 */ { t: 'Destructuring và spread: có mặt trong mọi component', body: destructSpread() },
  /* 24 */ { t: 'map, filter, find, reduce: bốn hàm thay cho vòng for', body: mangBacSi() },
  /* 25 */ { t: '?. dừng khi không có, ?? chỉ thay null và undefined', body: two(
    t(['$ node 5-optional.ts', '?.  → undefined', '??  → Không tìm thấy', "không ?. → Cannot read properties of", "           undefined (reading 'ten')", 'soPhong || 99 = 99 · soPhong ?? 99 = 0', "ghiChu || 'trống' = trống · ghiChu ?? 'trống' = \"\""], 'Node 22 · chạy thật', 14, '~/js'),
    table(['Giá trị', 'if (v)', 'v || x', 'v ?? x'], [
      ['<code>undefined</code>, <code>null</code>', 'falsy', 'x', 'x'],
      ['<code>0</code>', 'falsy', '!x', '!0'],
      ["<code>''</code>", 'falsy', '!x', "!<code>''</code>"],
      ['<code>NaN</code>', 'falsy', 'x', 'NaN'],
      ['<code>[]</code>, <code>{}</code>', '+truthy', '[] / {}', '[] / {}'],
      ["<code>'0'</code>", '+truthy', "'0'", "'0'"],
    ], { sm: true })) },
  /* 26 */ { t: 'import/export: đúng tên, đúng loại, không thì hỏng ngay', body: two(
    `${yaml([
      ['// tien-ich.ts', ''],
      ["export const TEN_PHONG_KHAM = 'Phòng khám An Tâm'", 'có tên'],
      ['export function dinhDangGio(gio: string) {…}', 'có tên'],
      ['export default function chao() {…}', 'mặc định'],
      ['', ''],
      ['// dung.ts', ''],
      ["import chao, { TEN_PHONG_KHAM, dinhDangGio as gio }", ''],
      ["  from './tien-ich.ts'", ''],
    ], { fs: 14.5 })}`,
    `${t(['$ node mod/dung.ts', 'Xin chào! Phòng khám An Tâm 08:00 (giờ VN)', "# sai: import { chao } from './tien-ich.ts'", '$ node mod/sai.ts', "! SyntaxError: The requested module './tien-ich.ts'", "!   does not provide an export named 'chao'", '$ npx tsc … mod/sai.ts', "! TS2614: Module has no exported member 'chao'.", "!   Did you mean to use 'import chao from …'?"], 'Node 22 · tsc 6.0.3', 13.5, '~/js')}<div style="height:14px"></div>
    ${box('tip', 'Component thường <code>export default</code> một cái mỗi file; hàm tiện ích và kiểu dùng <code>export</code> có tên. Kiểu: <code>import type { BacSi }</code>.')}`) },
  /* 27 */ { t: 'async/await: chờ trong hàm, phần còn lại vẫn chạy', body: asyncThuTu() },

  /* ───── Cuối mục ───── */
  /* 28 */ { t: 'Sai lầm hay gặp ở Mục 0', body: cards([
    { ic: '🧱', t: 'Vẫn tạo dự án bằng CRA', d: '“create-react-app is deprecated.” 1292 gói, 28 lỗ hổng. Dùng <code>npm create vite@latest</code>.', c: 'red' },
    { ic: '🔍', t: 'Tin vite build là đã kiểm', d: 'Vite không kiểm kiểu. Chạy <code>npx tsc -b</code> (hoặc <code>npm run build</code>).', c: 'amb' },
    { ic: '0️⃣', t: '{n &amp;&amp; …} với n = 0', d: 'Trang hiện chữ “0”. Viết <code>n &gt; 0 &amp;&amp; …</code>.', c: 'ora' },
    { ic: '🧬', t: 'Tưởng spread copy sâu', d: 'Object lồng vẫn dùng chung. Copy từng tầng mình sửa.', c: 'vio' },
    { ic: '🔀', t: 'Dùng .sort() trên state', d: 'Sửa mảng gốc. Dùng <code>.toSorted()</code> hoặc <code>[...ds].sort()</code>.', c: 'blu' },
    { ic: '🧹', t: 'Quên dọn DOM giữa hai test', d: 'Vitest không bật globals ⇒ thêm <code>afterEach(cleanup)</code> vào <code>setup.ts</code>.', c: 'pnk' },
  ], 3) },
  /* 29 */ { t: 'Bảng tra nhanh Mục 0', body: table(['Muốn', 'Gõ / viết'], [
    ['Tạo dự án', '<code>npm create vite@latest phong-kham -- --template react-ts</code>'],
    ['Chạy / kiểm / build', '<code>npm run dev</code> · <code>npx tsc -b</code> · <code>npx vite build</code> · <code>npx vitest run</code>'],
    ['Nhiều phần tử, một gốc', '<code>&lt;&gt;…&lt;/&gt;</code> (Fragment)'],
    ['Chèn giá trị', '<code>{ten}</code> · <code>{`BS. ${ten}`}</code> · <code>className=</code> · <code>style={{ … }}</code>'],
    ['Điều kiện', '<code>{ok ? &lt;A /&gt; : &lt;B /&gt;}</code> · <code>{n &gt; 0 &amp;&amp; &lt;A /&gt;}</code>'],
    ['Danh sách', '<code>{ds.map((x) =&gt; &lt;li key={x.id}&gt;…&lt;/li&gt;)}</code>'],
    ['Copy + sửa', '<code>{ ...obj, truong: moi }</code> · <code>[...mang, moi]</code> · <code>.filter</code> để xoá'],
    ['Không chắc có', '<code>bs?.ten ?? \'Không tìm thấy\'</code>'],
    ['Chờ Promise', '<code>const x = await f()</code> trong <code>async function</code>, bọc <code>try/catch</code>'],
  ], { sm: true }) },
  /* 30 */ { t: 'Tự gõ tiếp dự án: trang chủ tĩnh + test đầu tiên', body: two(list([
    '<strong>1.</strong> <code>npm create vite@latest phong-kham -- --template react-ts</code>, <code>npm install</code>, <code>npm run dev</code>.',
    '<strong>2.</strong> Dọn template: xoá <code>App.css</code>, <code>src/assets/</code>, <code>public/icons.svg</code>; <code>lang="vi"</code>, tiêu đề tab.',
    '<strong>3.</strong> <code>types.ts</code> + <code>du-lieu/bac-si.ts</code> (<code>danhSachBacSi</code>) + <code>chuyen-khoa.ts</code> + <code>tien-ich.ts</code>.',
    '<strong>4.</strong> <code>App.tsx</code>: tên phòng khám, “6 bác sĩ · 4 chuyên khoa”, bảng giờ mở cửa, chip chuyên khoa.',
    '<strong>5.</strong> Cài Vitest + Testing Library, <code>setup.ts</code> có <code>afterEach(cleanup)</code>, test thấy tiêu đề.',
  ]), box('good', '<strong>Đạt khi</strong>: <code>npx tsc -b</code> không in gì · <code>npx vitest run</code> → <code>Tests 6 passed (6)</code> · trang giống ảnh slide 11.<br><br>Lời giải đầy đủ nằm cuối Bài 0.3, trong khối “Lời giải” đóng sẵn.')) },
]);
