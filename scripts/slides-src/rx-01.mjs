/**
 * React · Deck rx-01 — Chương 1: Component và props.
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử `phong-kham`
 * (react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.1 · @testing-library/react 16.3.3):
 *   npx tsc -b (lỗi cố ý: tên viết thường, props sai kiểu, import type, props.key)
 *   npx vitest run --reporter=verbose (src/vi-du/*.test.tsx: thuần khiết, lồng định nghĩa, 0 &&, .sort(),
 *   thiếu key, key={index}, key ngẫu nhiên, key không phải prop; src/components/*.test.tsx)
 * Ảnh chụp giao diện thật (scripts/rx-chup.mjs, Chromium của Playwright): rx-anh/rx-01/*.jpg.
 */
import { S, cover, cards, box, table, vs, two, list, mindmap, term as rxTerm, yaml, diagram, compTree, renderFlow, anh, sv, R, T, A, D } from './_rx-chung.mjs';

export const deck = { key: 'rx-01', code: 'REACT · CHƯƠNG 1', title: 'Component và props', sub: 'React · Chương 1' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────────── Slide 18 — React ghép cũ/mới theo key ───────────── */
const ghepKey = () => {
  let s = '';
  const cot = (x, tieuDe, c) => T(x + 250, 24, tieuDe, { fs: 19, b: true, a: 'middle', c, mono: true });
  const o = (x, y, chu, c, phu = '') => R(x, y, 190, 46, { c, fill: '#0f182a', r: 9 }) + T(x + 12, y + 29, chu, { fs: 15.5, mono: true }) +
    (phu ? T(x + 180, y + 29, phu, { fs: 14, c: 'amb', a: 'end', b: true }) : '');
  const nhom = (x0, c, keys, sau, ghep, nhan) => {
    let g = cot(x0, nhan, c);
    g += T(x0 + 95, 58, 'lần vẽ trước', { fs: 14, c: 'mu', a: 'middle' }) + T(x0 + 405, 58, 'lần vẽ sau', { fs: 14, c: 'mu', a: 'middle' });
    keys.forEach((k, i) => { g += o(x0, 72 + i * 60, k[0], 'dim', k[1]); });
    sau.forEach((k, i) => { g += o(x0 + 310, 72 + i * 60, k[0], k[2] || 'dim', k[1]); });
    ghep.forEach(([a, b, cc]) => { g += A(x0 + 194, 95 + a * 60, x0 + 306, 95 + b * 60, { c: cc, sw: 2.6 }); });
    return g;
  };
  // key={index}: 0,1,2 cũ ghép với 0,1,2 mới — ô input (chữ) ở vị trí 0 được GIỮ cho người mới
  s += nhom(0, 'red', [['0 · Minh An', '✎'], ['1 · Thu Hà'], ['2 · Quốc Bảo']],
    [['0 · Thanh Tâm', '✎', 'red'], ['1 · Minh An'], ['2 · Thu Hà'], ['3 · Quốc Bảo', '', 'grn']],
    [[0, 0, 'red'], [1, 1, 'mu'], [2, 2, 'mu']], 'key={index}');
  s += nhom(600, 'grn', [['bs-1 · Minh An', '✎'], ['bs-2 · Thu Hà'], ['bs-3 · Quốc Bảo']],
    [['bs-7 · Thanh Tâm', '', 'grn'], ['bs-1 · Minh An', '✎'], ['bs-2 · Thu Hà'], ['bs-3 · Quốc Bảo']],
    [[0, 1, 'grn'], [1, 2, 'grn'], [2, 3, 'grn']], 'key={bs.id}');
  s += R(0, 330, 1160, 92, { c: 'amb', fill: 'rgba(255,194,51,.07)' }) +
    T(20, 364, 'React ghép phần tử cũ với phần tử mới CÓ CÙNG KEY, rồi giữ nguyên DOM (và chữ ✎ trong ô input) của nó.', { fs: 17, b: true, c: 'amb' }) +
    T(20, 398, 'key = vị trí ⇒ ô ✎ ở vị trí 0 ở lại vị trí 0, thành của người mới.   key = id ⇒ ô ✎ đi theo bs-1.   Ô viền xanh = tạo MỚI.', { fs: 16 });
  return sv(1160, 425, s);
};

/* Font mono mặc định (SF Mono/Menlo → monospace = DejaVu Sans Mono trên máy dựng) vỡ dấu chồng (ố, ầ, ỗ, ử…) — output THẬT của bài
 * có rất nhiều chữ như vậy ⇒ deck này ép chữ mono sang Liberation Mono (đủ glyph tiếng Việt; DejaVu Sans Mono — thứ "monospace" trỏ tới — thiếu dải U+1EA2…). Chỉ trong deck rx-01. */
const MONO_VN = '<style>.g-term pre,.g-term .tb span,.d-yml .c,.slide .bd code,.c-code{font-family:"Liberation Mono",monospace!important}' +
  'svg text[font-family]{font-family:"Liberation Mono",monospace}</style>';
const SV = (arr) => S(arr).map((x) => ({ ...x, body: MONO_VN + x.body }));

export const slides = SV([
  /* 1 */ cover({ t: 'Chương 1 — Component và props', sub: 'chia giao diện thành mảnh ghép · props có kiểu · danh sách có key · cây component có test', chap: 'CHƯƠNG 1' }),

  /* 2 */ { t: 'Bản đồ chương: từ một hàm tới cả trang chủ phòng khám', body: mindmap('Component', 'mảnh giao diện = một hàm nhận props, trả JSX', [
    { t: '1.1 Component là hàm', d: 'tên viết hoa · một file một component · thuần khiết · không lồng định nghĩa', c: 'rx' },
    { t: '1.2 Props có kiểu', d: 'interface · dấu ? · giá trị mặc định · children · props chỉ đọc', c: 'tea' },
    { t: '1.3 Danh sách và key', d: 'map · key từ dữ liệu · bug key={index} · key không phải prop', c: 'vio' },
    { t: '1.4 Tư duy component', d: 'mock-up → hộp → cây · tách khi nào · dữ liệu một chiều · test', c: 'amb' },
    { t: '🛠 Dự án An Tâm', d: 'Header · Footer · TheBacSi · DanhSachBacSi', c: 'grn' },
    { t: '✅ Kiểm tra', d: '10 câu tình huống, 15 phút', c: 'pnk' },
  ]) },

  /* ───── 1.1 ───── */
  /* 3 */ { t: 'Component là một hàm JavaScript trả về JSX', body: two(
    yaml([
      ['// src/components/Header.tsx', ''],
      ['export function Header() {', 'tên VIẾT HOA'],
      ['  return (', ''],
      ['    <header className="header">', 'JSX: trông như HTML'],
      ['      <h1>Phòng khám An Tâm</h1>', ''],
      ['      <p>Mở cửa 7:30–20:00</p>', ''],
      ['    </header>', ''],
      ['  );', 'MỘT phần tử gốc'],
      ['}', ''],
      ['', ''],
      ['// src/App.tsx — dùng như một thẻ', ''],
      ['<Header />', 'React GỌI Header()'],
    ], { fs: 16 }),
    diagram({
      w: 520, h: 420,
      nodes: [
        { id: 'h', x: 110, y: 0, w: 300, h: 76, t: 'function Header()', d: 'hàm của bạn', c: 'rx', mono: true },
        { id: 'j', x: 110, y: 170, w: 300, h: 76, t: 'JSX (object mô tả)', d: '{ type: "header", props: … }', c: 'vio' },
        { id: 'd', x: 110, y: 340, w: 300, h: 76, t: 'DOM thật', d: '<header><h1>…</h1></header>', c: 'grn', mono: true },
      ],
      edges: [{ from: 'h', to: 'j', t: 'return' }, { from: 'j', to: 'd', t: 'React dựng / sửa DOM' }],
    }), 'l') },

  /* 4 */ { t: 'Tên viết HOA là component, viết thường là thẻ HTML', body: two(
    t([
      '$ npx tsc -b',
      '! src/vi-du/LoiChuThuong.tsx(6,10): error TS2339:',
      "!   Property 'theBacSi' does not exist on type",
      "!   'JSX.IntrinsicElements'.",
      '# chạy thử bằng Vitest (jsdom), bỏ qua lỗi tsc:',
      'DOM: <thebacsi></thebacsi>',
      '! <theBacSi /> is using incorrect casing. Use',
      '!   PascalCase for React components, or lowercase',
      '!   for HTML elements.',
      '! The tag <theBacSi> is unrecognized in this browser.',
    ], 'tsc + vitest · 25/09/2026', 14.5),
    list([
      '<code>&lt;header&gt;</code> chữ thường ⇒ React tạo <strong>thẻ HTML</strong> tên đó.',
      '<code>&lt;Header /&gt;</code> chữ hoa ⇒ React <strong>gọi hàm</strong> <code>Header</code>.',
      'Viết <code>&lt;theBacSi /&gt;</code>: hàm của bạn <strong>không bao giờ chạy</strong>, trang có một thẻ lạ rỗng.',
      'TypeScript bắt ngay lúc gõ (TS2339); không có TS thì chỉ còn hai dòng cảnh báo trên console.',
    ]), 'l') },

  /* 5 */ { t: 'Mỗi component một file, export có tên, import nơi dùng', body: two(
    yaml([
      ['src/', ''],
      ['  types.ts', 'kiểu dùng chung: BacSi…'],
      ['  du-lieu/bac-si.ts', '6 bác sĩ mẫu'],
      ['  du-lieu/chuyen-khoa.ts', 'noi → Nội tổng quát'],
      ['  components/', ''],
      ['    Header.tsx', 'export function Header'],
      ['    Footer.tsx', 'export function Footer'],
      ['    TheBacSi.tsx', 'export function TheBacSi'],
      ['    DanhSachBacSi.tsx', '+ DanhSachBacSi.test.tsx'],
      ['  App.tsx', 'export default App'],
      ['  main.tsx', 'createRoot(…).render(<App />)'],
    ], { fs: 16 }),
    diagram({
      w: 500, h: 430,
      nodes: [
        { id: 'm', x: 150, y: 0, w: 200, h: 56, t: 'main.tsx', c: 'dim', mono: true },
        { id: 'a', x: 150, y: 100, w: 200, h: 56, t: 'App.tsx', c: 'rx', mono: true },
        { id: 'h', x: 0, y: 220, w: 150, h: 56, t: 'Header', c: 'tea', mono: true },
        { id: 'l', x: 175, y: 220, w: 150, h: 56, t: 'DanhSach…', c: 'vio', mono: true },
        { id: 'f', x: 350, y: 220, w: 150, h: 56, t: 'Footer', c: 'tea', mono: true },
        { id: 't', x: 175, y: 350, w: 150, h: 56, t: 'TheBacSi', c: 'amb', mono: true },
      ],
      edges: [{ from: 'm', to: 'a' }, { from: 'a', to: 'h' }, { from: 'a', to: 'l' }, { from: 'a', to: 'f' }, { from: 'l', to: 't' }],
    }), 'l') },

  /* 6 */ { t: 'React tự GỌI hàm của bạn — ở pha Render, và có thể nhiều lần', body: renderFlow({ hl: 1, h: 250 }) + two(
    box('info', '<strong>Bạn không gọi <code>Header()</code>.</strong> Bạn viết <code>&lt;Header /&gt;</code>; React quyết định lúc nào gọi và gọi bao nhiêu lần: lần đầu hiện trang, mỗi khi cha vẽ lại, và <strong>hai lần</strong> mỗi lượt trong chế độ phát triển có <code>&lt;StrictMode&gt;</code>.'),
    box('tip', 'Vì vậy thân hàm component chỉ được <strong>tính ra JSX</strong>. Gọi API, sửa biến bên ngoài, ghi localStorage… để ở handler sự kiện (Ch2) hoặc effect (Ch4).')) },

  /* 7 */ { t: 'Component phải thuần: bản sửa biến ngoài ra #2, #4, #6', body: two(
    yaml([
      ['let soKhach = 0;', 'biến NGOÀI component'],
      ['', ''],
      ['export function KhachSai() {', ''],
      ['  soKhach = soKhach + 1;', '✗ sửa thứ bên ngoài'],
      ['  return <p>Khách số #{soKhach}</p>;', ''],
      ['}', ''],
      ['', ''],
      ['export function KhachDung({ so }) {', '✓ chỉ đọc props'],
      ['  return <p>Khách số #{so}</p>;', ''],
      ['}', ''],
    ], { fs: 16 }),
    t([
      '$ npx vitest run \\',
      '    src/vi-du/ThuanKhiet --reporter=verbose',
      "StrictMode + KhachSai  → [ 'Khách số #2',",
      "  'Khách số #4', 'Khách số #6' ]",
      "StrictMode + KhachDung → [ 'Khách số #1',",
      "  'Khách số #2', 'Khách số #3' ]",
      '+ ✓ bản KHÔNG thuần trong StrictMode: 2, 4, 6',
      '+ ✓ bản thuần trong StrictMode: 1, 2, 3',
      '# StrictMode gọi mỗi component HAI lần (chỉ khi dev)',
      '#   ⇒ lỗi "không thuần" lộ ra ngay trên màn hình',
    ], 'vitest 5.0.1 · jsdom', 14.5)) },

  /* 8 */ { t: 'Định nghĩa component bên trong component: chữ đang gõ mất', body: two(
    yaml([
      ['export function FormSai() {', ''],
      ['  const [dem, setDem] = useState(0);', 'Ch2 — bấm ⇒ vẽ lại'],
      ['  function ONhap() {', '✗ hàm MỚI mỗi lần vẽ'],
      ['    return <input aria-label="Ghi chú" />;', ''],
      ['  }', ''],
      ['  return (<div>', ''],
      ['    <ONhap />', 'React: "component khác"'],
      ['    <button onClick={…}>Bấm</button>', ''],
      ['  </div>);', ''],
      ['}', ''],
    ], { fs: 15.5 }),
    t([
      '$ npx vitest run \\',
      '    src/vi-du/LongDinhNghia --reporter=verbose',
      'FormSai : trước khi bấm "đau đầu"',
      '          → sau khi bấm ""',
      'FormDung: sau khi bấm "đau đầu"',
      '+ ✓ định nghĩa bên trong: chữ BIẾN MẤT',
      '+ ✓ định nghĩa bên ngoài: chữ còn nguyên',
    ], 'vitest 5.0.1', 15) + box('good', 'Sửa: đưa <code>function ONhap()</code> ra <strong>cấp cao nhất của file</strong>. Cần dữ liệu của cha thì truyền bằng props.')) },

  /* ───── 1.2 ───── */
  /* 9 */ { t: 'Props là MỘT object cha đưa xuống con', body: diagram({
    w: 1160, h: 440,
    nodes: [
      { id: 'cha', x: 0, y: 30, w: 520, h: 110, t: 'Cha viết (JSX)', d: '<TheBacSi bacSi={bs} noiBat />', c: 'rx', mono: true },
      { id: 'obj', x: 640, y: 30, w: 520, h: 110, t: 'React gom thành MỘT object', d: '{ bacSi: { id: "bs-4", … }, noiBat: true }', c: 'vio', mono: true },
      { id: 'con', x: 640, y: 250, w: 520, h: 110, t: 'Con nhận làm tham số', d: 'function TheBacSi({ bacSi, noiBat })', c: 'grn', mono: true },
      { id: 'js', x: 0, y: 250, w: 520, h: 150, t: 'JS nhắc nhanh: destructuring', d: '({ bacSi, noiBat }) ≡\nconst bacSi = props.bacSi;\nconst noiBat = props.noiBat;', c: 'amb', mono: true },
    ],
    edges: [{ from: 'cha', to: 'obj', t: 'gọi hàm' }, { from: 'obj', to: 'con', t: 'đối số thứ nhất' }, { from: 'con', to: 'js', t: 'viết tắt của', dash: true }],
  }) },

  /* 10 */ { t: 'Kiểu props: interface, dấu ? và giá trị mặc định', body: two(
    yaml([
      ["import type { BacSi } from '../types';", 'chỉ nhập KIỂU'],
      ['', ''],
      ['interface TheBacSiProps {', 'hợp đồng của component'],
      ['  bacSi: BacSi;', 'bắt buộc'],
      ['  noiBat?: boolean;', '? = được bỏ trống'],
      ['}', ''],
      ['', ''],
      ['export function TheBacSi(', ''],
      ['  { bacSi, noiBat = false }: TheBacSiProps', 'mặc định false'],
      [') {', ''],
      ['  return <article aria-label={bacSi.ten}>…', ''],
    ], { fs: 15.5 }),
    list([
      '<code>interface</code> mô tả <strong>hình dạng</strong> object props — tên trường và kiểu.',
      '<code>noiBat?</code>: cha có thể không truyền; khi đó giá trị là <code>undefined</code> ⇒ <code>= false</code> thay vào.',
      '<code>&lt;TheBacSi bacSi={bs} noiBat /&gt;</code>: viết tên không có giá trị nghĩa là <code>true</code>.',
      'Chuỗi viết trong nháy: <code>ten="An"</code>. Mọi thứ khác (số, object, biến) trong ngoặc nhọn: <code>nam={12}</code>.',
    ]), 'l') },

  /* 11 */ { t: 'tsc bắt lỗi props trước khi trình duyệt kịp chạy', body: t([
    '$ npx tsc -b',
    "! (7,8):   error TS2741: Property 'bacSi' is missing in type '{}' but required in type 'TheBacSiProps'.",
    "! (8,42):  error TS2322: Type 'string' is not assignable to type 'boolean | undefined'.",
    "! (9,42):  error TS2322: Type '{ bacSi: BacSi; noiBac: true; }' is not assignable to",
    "!          type 'IntrinsicAttributes & TheBacSiProps'.",
    "!          Property 'noiBac' does not exist on type 'IntrinsicAttributes & TheBacSiProps'. Did you mean 'noiBat'?",
    "! (10,47): error TS2322: Type 'string' is not assignable to type 'number'.",
    '# (bỏ tiền tố src/vi-du/LoiProps.tsx ở đầu mỗi dòng lỗi cho gọn)',
    '# dòng 7:  <TheBacSi />                                   ← quên prop bắt buộc',
    '# dòng 8:  <TheBacSi bacSi={…} noiBat="true" />           ← chuỗi "true" không phải boolean',
    '# dòng 9:  <TheBacSi bacSi={…} noiBac />                  ← gõ nhầm tên prop',
    "# dòng 10: bacSi={{ ...bs, namKinhNghiem: '12' }}         ← '12' là chuỗi, cần số",
  ], 'src/vi-du/LoiProps.tsx · typescript 6.0.3', 14.5) + box('info', 'PropTypes (FER202) chỉ kêu <strong>lúc chạy</strong> và từ React 19 thì <strong>bị bỏ qua hẳn</strong> — đo thật: truyền <code>namKinhNghiem="mười hai"</code>, 0 lần <code>console.error</code>.') },

  /* 12 */ { t: 'children: thứ nằm giữa thẻ mở và thẻ đóng', body: two(
    yaml([
      ["import type { ReactNode } from 'react';", ''],
      ['', ''],
      ['interface KhungProps {', ''],
      ['  tieuDe: string;', ''],
      ['  children: ReactNode;', 'chữ, số, JSX, mảng…'],
      ['}', ''],
      ['export function Khung({ tieuDe, children }: KhungProps) {', ''],
      ['  return <section><h2>{tieuDe}</h2>{children}</section>;', ''],
      ['}', ''],
      ['', ''],
      ['<Khung tieuDe="Giờ mở cửa">', ''],
      ['  <p>Thứ Hai – thứ Bảy: 7:30–20:00</p>', 'đây là children'],
      ['</Khung>', ''],
    ], { fs: 14.5 }),
    t([
      '# quên chữ "type" khi nhập ReactNode:',
      "$ npx tsc -b",
      "! src/vi-du/LoiImport.tsx(1,10): error TS1484:",
      "!   'ReactNode' is a type and must be imported",
      "!   using a type-only import when",
      "!   'verbatimModuleSyntax' is enabled.",
      '# dự án Vite bật verbatimModuleSyntax sẵn',
      '#   ⇒ kiểu thì luôn: import type { … }',
    ], 'typescript 6.0.3', 14.5), 'r') },

  /* 13 */ { t: 'Bẫy {soLich && …}: số 0 hiện ra màn hình', body: two(
    anh('rx-01', 'so-khong.jpg', { w: 640, url: 'localhost:5113/vi-du.html?bai=so-khong', cap: 'Ảnh chụp thật · Chromium · soLich = 0' }),
    list([
      '<code>0 &amp;&amp; x</code> trả về <strong><code>0</code></strong> (không phải <code>false</code>). React bỏ qua <code>false/null/undefined</code> nhưng <strong>vẽ số 0</strong>.',
      'Đo bằng test: bản sai ra <code>"&lt;div&gt;0&lt;/div&gt;"</code>, bản đúng ra <code>"&lt;div&gt;&lt;/div&gt;"</code>.',
      'Sửa: điều kiện phải là boolean thật — <code>soLich &gt; 0 &amp;&amp; …</code>, hoặc dùng <code>? … : null</code>.',
    ]), 'l') },

  /* 14 */ { t: 'Props chỉ đọc: .sort() đảo luôn mảng của cha', body: two(
    yaml([
      ['function TheoKinhNghiemSai({ danhSach }) {', ''],
      ['  const sx = danhSach.sort(', '✗ sort SỬA mảng gốc'],
      ['    (a, b) => b.namKinhNghiem - a.namKinhNghiem);', ''],
      ['  …', ''],
      ['}', ''],
      ['function TheoKinhNghiemDung({ danhSach }) {', ''],
      ['  const sx = danhSach.toSorted(', '✓ trả mảng MỚI'],
      ['    (a, b) => b.namKinhNghiem - a.namKinhNghiem);', ''],
      ['  …', ''],
      ['}', '(hoặc [...danhSach].sort(…))'],
    ], { fs: 15 }),
    t([
      '$ npx vitest run \\',
      '    src/vi-du/SapXep --reporter=verbose',
      'trước render: bs-1 bs-2 bs-3 bs-4 bs-5 bs-6',
      '! sau render  : bs-6 bs-4 bs-1 bs-2 bs-3 bs-5',
      'toSorted, sau render: bs-1 bs-2 bs-3 bs-4 bs-5 bs-6',
      '+ ✓ .sort() trong component làm đổi thứ tự mảng của CHA',
      '+ ✓ .toSorted() để nguyên mảng của cha',
    ], 'vitest 5.0.1', 14) + box('warn', 'Mảng/object trong props là <strong>của cha</strong> (cùng một vùng nhớ). Sửa nó là sửa dữ liệu của mọi component khác đang dùng chung.'), 'l') },

  /* ───── 1.3 ───── */
  /* 15 */ { t: 'map biến mảng dữ liệu thành mảng JSX', body: diagram({
    w: 1160, h: 430,
    nodes: [
      { id: 'd', x: 0, y: 20, w: 330, h: 170, t: 'danhSachBacSi (dữ liệu)', d: '{ id: "bs-1", ten: … }\n{ id: "bs-2", ten: … }\n…\n{ id: "bs-6", ten: … }', c: 'vio', mono: true },
      { id: 'm', x: 415, y: 50, w: 330, h: 110, t: '.map((bs) => …)', d: 'gọi hàm cho TỪNG phần tử,\ngom kết quả thành mảng mới', c: 'amb', mono: true },
      { id: 'j', x: 830, y: 20, w: 330, h: 170, t: 'mảng JSX', d: '<TheBacSi key="bs-1" … />\n<TheBacSi key="bs-2" … />\n…\n<TheBacSi key="bs-6" … />', c: 'grn', mono: true },
      { id: 'x', x: 0, y: 270, w: 1160, h: 140, t: 'Trong DanhSachBacSi.tsx', d: '{danhSach.map((bs) => (\n  <TheBacSi key={bs.id} bacSi={bs} noiBat={bs.namKinhNghiem >= 15} />\n))}', c: 'rx', mono: true },
    ],
    edges: [{ from: 'd', to: 'm' }, { from: 'm', to: 'j' }],
  }) },

  /* 16 */ { t: 'Quên key: vẫn vẽ đủ 6 dòng, React cảnh báo trên console', body: t([
    '$ npx vitest run src/vi-du/ThieuKey --reporter=verbose',
    'stdout | src/vi-du/ThieuKey.test.tsx > thiếu key: vẫn vẽ đủ, nhưng React cảnh báo trên console',
    '! Each child in a list should have a unique "key" prop.',
    '! Check the render method of `DanhSachThieuKey`. See https://react.dev/link/warning-keys for more information.',
    '+ ✓ src/vi-du/ThieuKey.test.tsx > thiếu key: vẫn vẽ đủ, nhưng React cảnh báo trên console',
    '',
    '# {danhSachBacSi.map((bs) => <li>{bs.ten}</li>)}      ← thiếu key',
    '# {danhSachBacSi.map((bs) => <li key={bs.id}>{bs.ten}</li>)}   ← hết cảnh báo',
  ], 'react 19.3.0 · vitest 5.0.1', 15) + box('info', 'Chỉ là <strong>cảnh báo</strong>: trang vẫn đúng lúc đầu. Nó thành bug khi danh sách <strong>đổi thứ tự, chèn, xoá</strong> — slide kế tiếp.') },

  /* 17 */ { t: 'key={index} + chèn lên đầu: ghi chú dính sang người khác', body: anh('rx-01', 'key-index-sau.jpg', { w: 1000, url: 'localhost:5111/vi-du.html?bai=key-index', cap: 'Ảnh chụp thật: gõ “dị ứng penicillin” cho BS. Nguyễn Minh An ở CẢ hai cột, rồi bấm “Thêm bác sĩ lên đầu”. Cột trái: ghi chú nhảy sang BS. Đỗ Thanh Tâm.' }) },

  /* 18 */ { t: 'React ghép phần tử cũ và mới theo key, không theo vị trí', body: ghepKey() },

  /* 19 */ { t: 'Key tốt nhất là id có sẵn trong dữ liệu', body: table(['Nguồn key', 'Ổn định qua các lần vẽ?', 'Khi chèn / xoá / sắp xếp', 'Dùng khi'], [
    ['<code>bs.id</code> (id từ CSDL / API)', '+có', '+đi đúng theo phần tử', 'hầu như mọi lúc'],
    ['<code>crypto.randomUUID()</code> lúc TẠO dữ liệu', '+có (lưu cùng dữ liệu)', '+đúng', 'dữ liệu tạo ở client chưa có id'],
    ['<code>index</code>', '!chỉ khi thứ tự không đổi', '-state/DOM dính sai phần tử', 'danh sách tĩnh, không sửa, không lọc'],
    ['<code>Math.random()</code> trong JSX', '-không — mỗi lần vẽ key mới', '-mọi dòng bị dựng lại, mất chữ', 'không bao giờ'],
    ['<code>bs.ten</code>', '!thường có, nhưng tên có thể trùng', '!trùng tên ⇒ hai dòng cùng key', 'khi chắc chắn duy nhất'],
  ], { sm: true }) + box('tip', 'Luật: key <strong>duy nhất giữa các anh em</strong> trong cùng một mảng, và <strong>không đổi</strong> giữa các lần vẽ. Đo thật với <code>Math.random()</code>: sau một lần vẽ lại, ô input là một thẻ MỚI (<code>cùng một ô input? false</code>) và chữ đã gõ mất.') },

  /* 20 */ { t: 'key đặt ở chỗ gọi map, và KHÔNG đi vào props', body: two(
    yaml([
      ['// ✓ key trên phần tử mà map TRẢ VỀ', ''],
      ['{danhSach.map((bs) => (', ''],
      ['  <TheBacSi key={bs.id} bacSi={bs} />', 'đúng chỗ'],
      ['))}', ''],
      ['', ''],
      ['// ✗ key trong TheBacSi — quá muộn', ''],
      ['<article key={bacSi.id}>…</article>', 'vô ích ở đây'],
      ['', ''],
      ['// cần id bên trong thì truyền thêm prop', ''],
      ['<DongBacSi key={bs.id} id={bs.id} ten={bs.ten} />', ''],
    ], { fs: 15 }),
    t([
      '# component đọc props.key:',
      '$ npx tsc -b',
      "! src/vi-du/LoiKey.tsx(2,34): error TS2339:",
      "!   Property 'key' does not exist",
      "!   on type '{ ten: string; }'.",
      '# lúc chạy, truyền key="bs-1" id="bs-1" ten=…:',
      'props nhận được:',
      '  {"id":"bs-1","ten":"BS. Nguyễn Minh An"}',
      '# ⇒ key bị React giữ lại, không nằm trong props',
    ], 'tsc + vitest', 14.5)) },

  /* ───── 1.4 ───── */
  /* 21 */ { t: 'Từ mock-up: khoanh hộp, đặt tên, mỗi hộp một component', body: two(
    anh('rx-01', 'trang-chu.jpg', { w: 700, url: 'localhost:5110', cap: 'Trang chủ sau Chương 1 — ảnh chụp thật (vite build + vite preview)' }),
    list([
      '<strong style="color:#2dd4bf">Header</strong> — dải xanh trên cùng: tên, giờ mở cửa.',
      '<strong style="color:#bc8cff">DanhSachBacSi</strong> — tiêu đề “Đội ngũ bác sĩ (6)” + lưới.',
      '<strong style="color:#ffc233">TheBacSi</strong> — MỘT thẻ, lặp 6 lần với 6 bộ props.',
      '<strong style="color:#2dd4bf">Footer</strong> — địa chỉ, hotline.',
      'Hộp lặp lại ⇒ gần như chắc chắn là một component nhận props.',
    ]), 'l2') },

  /* 22 */ { t: 'Cây component trang chủ: dữ liệu đi từ gốc xuống', body: compTree({
    w: 1160, h: 420, bw: 200,
    root: { n: 'App', s: 'import danhSachBacSi', kids: [
      { n: 'Header', s: 'không props' },
      { n: 'DanhSachBacSi', s: 'danhSach: BacSi[]', c: 'vio', kids: [
        { n: 'TheBacSi', s: 'bs-1 · noiBat=false', c: 'amb' },
        { n: 'TheBacSi', s: 'bs-4 · noiBat=true', c: 'amb' },
        { n: 'TheBacSi', s: '… bs-6', c: 'amb' },
      ] },
      { n: 'Footer', s: 'không props' },
    ] },
  }) + box('info', 'Chương 1 chưa có state (● và ↻ xuất hiện từ Chương 2). Cây này chỉ trả lời: <strong>ai chứa ai</strong>, và <strong>dữ liệu đi đường nào</strong>.') },

  /* 23 */ { t: 'Tách khi có một việc riêng, không tách cho nhiều file', body: vs({
    no: { t: 'Đừng tách', items: [
      '<code>&lt;TenBacSi /&gt;</code> chỉ bọc một <code>&lt;h3&gt;</code> — thêm một file, không thêm ý nghĩa.',
      'Tách mà phải truyền 8 props từ cha xuống chỉ để con vẽ lại y chang.',
      'Tách “cho gọn” khi cả trang mới 40 dòng và chưa có gì lặp lại.',
      'Đặt tên theo hình dạng: <code>BoxXanh</code>, <code>Cot2</code>.',
    ] },
    yes: { t: 'Nên tách', items: [
      'Phần <strong>lặp lại</strong>: mỗi bác sĩ một thẻ ⇒ <code>TheBacSi</code>.',
      'Phần có <strong>một việc riêng</strong> đọc tên là hiểu: <code>Header</code>, <code>DanhSachBacSi</code>.',
      'Phần bạn muốn <strong>test riêng</strong> với dữ liệu giả (danh sách rỗng, 200 bác sĩ).',
      'File dài quá một màn hình và có ranh giới rõ; đặt tên theo <strong>nghĩa</strong>.',
    ] },
  }) },

  /* 24 */ { t: 'Dữ liệu đi MỘT chiều: cha đưa xuống, con chỉ đọc', body: diagram({
    w: 1160, h: 440,
    nodes: [
      { id: 'dl', x: 0, y: 20, w: 330, h: 80, t: 'du-lieu/bac-si.ts', d: 'nguồn tạm (Ch6: API)', c: 'vio', mono: true },
      { id: 'app', x: 430, y: 20, w: 300, h: 80, t: 'App', d: 'import rồi truyền xuống', c: 'rx', mono: true },
      { id: 'ds', x: 430, y: 180, w: 300, h: 80, t: 'DanhSachBacSi', d: 'nhận danhSach, lặp, chọn key', c: 'vio', mono: true },
      { id: 'the', x: 430, y: 340, w: 300, h: 80, t: 'TheBacSi', d: 'nhận bacSi, chỉ hiển thị', c: 'amb', mono: true },
      { id: 'test', x: 860, y: 180, w: 300, h: 80, t: 'Test', d: 'truyền [] hoặc dữ liệu giả', c: 'grn' },
      { id: 'sai', x: 0, y: 260, w: 300, h: 110, t: '✗ con tự import dữ liệu', d: 'khó test danh sách rỗng,\nkhó đổi sang API', c: 'red' },
    ],
    edges: [
      { from: 'dl', to: 'app', t: 'import' },
      { from: 'app', to: 'ds', t: 'danhSach={…}' },
      { from: 'ds', to: 'the', t: 'bacSi={bs}' },
      { from: 'test', to: 'ds', t: 'danhSach={[]}', dash: true },
    ],
  }) },

  /* 25 */ { t: 'Test component: vẽ với dữ liệu giả, hỏi như người dùng', body: two(
    yaml([
      ["test('danh sách rỗng thì báo, không vẽ lưới', () => {", ''],
      ['  render(<DanhSachBacSi danhSach={[]} />);', 'dữ liệu giả'],
      ['  expect(', ''],
      ["    screen.getByText('Chưa có bác sĩ nào.')", 'tìm theo CHỮ'],
      ['  ).toBeInTheDocument();', ''],
      ['  expect(', ''],
      ["    screen.queryByRole('article')", 'tìm theo VAI TRÒ'],
      ['  ).not.toBeInTheDocument();', ''],
      ['});', ''],
    ], { fs: 15 }),
    t([
      '$ npx vitest run --reporter=verbose',
      '# (rút gọn: bỏ đường dẫn tệp, cắt ngắn vài tên test)',
      '+ ✓ TheBacSi > hiện tên, chuyên khoa bằng tiếng Việt',
      '+     và số năm kinh nghiệm',
      '+ ✓ TheBacSi > không có nhãn khi noiBat không truyền',
      '+ ✓ TheBacSi > có nhãn "Bác sĩ lâu năm" khi noiBat',
      '+ ✓ DanhSachBacSi > mỗi bác sĩ một thẻ, đúng thứ tự',
      '+ ✓ DanhSachBacSi > từ 15 năm kinh nghiệm được đánh dấu',
      '+ ✓ DanhSachBacSi > danh sách rỗng thì báo, không vẽ lưới',
      '+ ✓ App > trang chủ có tiêu đề phòng khám',
      '+ ✓ App > trang chủ hiện đủ 6 bác sĩ',
      ' Test Files  3 passed (3)',
      '      Tests  8 passed (8)',
    ], 'dự án phong-kham · vitest 5.0.1', 13.5)) },

  /* 26 */ { t: 'Thiếu cleanup: test sau thấy cả thẻ của test trước', body: two(
    t([
      '$ npx vitest run',
      '! FAIL  src/App.test.tsx > trang chủ hiện đủ 6 bác sĩ',
      '! AssertionError: expected [ <article …(2)>…(4)',
      '!   </article>, …(11) ] to have a length of 6',
      '!   but got 12',
      ' - Expected',
      ' + Received',
      ' - 6',
      ' + 12',
      '!  Tests  3 failed | 5 passed (8)',
    ], 'trước khi sửa setup.ts', 14.5),
    yaml([
      ['// src/test/setup.ts', ''],
      ["import '@testing-library/jest-dom/vitest';", ''],
      ["import { cleanup } from '@testing-library/react';", ''],
      ["import { afterEach } from 'vitest';", ''],
      ['', ''],
      ['afterEach(() => {', 'dọn DOM sau MỖI test'],
      ['  cleanup();', ''],
      ['});', ''],
    ], { fs: 15 }) + box('warn', 'Testing Library chỉ <strong>tự</strong> dọn khi <code>afterEach</code> là biến toàn cục. Vitest mặc định <code>globals: false</code> ⇒ không có ⇒ phải tự gọi. Mục 0 chỉ có 1 test nên chưa lộ.')) },

  /* 27 */ { t: 'Sai lầm hay gặp ở Chương 1', body: cards([
    { ic: '🔡', t: 'Tên component viết thường', d: '<code>&lt;theBacSi /&gt;</code> thành thẻ HTML lạ, hàm không chạy. Tên luôn viết hoa.', c: 'red' },
    { ic: '🪆', t: 'Định nghĩa component trong component', d: 'Mỗi lần vẽ là component “mới” ⇒ mất chữ, mất state. Đưa ra cấp cao nhất.', c: 'ora' },
    { ic: '0️⃣', t: '<code>{soLuong &amp;&amp; …}</code>', d: 'Số 0 hiện ra màn hình. Dùng <code>soLuong &gt; 0 &amp;&amp;</code>.', c: 'amb' },
    { ic: '✂️', t: 'Sửa props tại chỗ', d: '<code>.sort()</code>, <code>.push()</code>, gán <code>props.x = …</code> đều sửa dữ liệu của cha.', c: 'vio' },
    { ic: '🔑', t: '<code>key={index}</code> cho danh sách thay đổi', d: 'Ghi chú, ô tick, chữ đang gõ dính sang phần tử khác. Dùng id.', c: 'blu' },
    { ic: '🧹', t: 'Quên cleanup trong Vitest', d: 'Test sau đếm cả DOM của test trước (12 thay vì 6).', c: 'pnk' },
  ], 3) },

  /* 28 */ { t: 'Bảng tra nhanh Chương 1', body: table(['Muốn', 'Viết'], [
    ['Tạo component', '<code>export function TheBacSi(props) { return &lt;article&gt;…&lt;/article&gt;; }</code> — tên viết hoa, một file'],
    ['Dùng component', '<code>import { TheBacSi } from \'./components/TheBacSi\';</code> rồi <code>&lt;TheBacSi … /&gt;</code>'],
    ['Khai kiểu props', '<code>interface P { bacSi: BacSi; noiBat?: boolean }</code> + <code>({ bacSi, noiBat = false }: P)</code>'],
    ['Nhận JSX lồng bên trong', '<code>children: ReactNode</code> — nhập bằng <code>import type { ReactNode } from \'react\'</code>'],
    ['Hiện có điều kiện', '<code>{dieuKien &amp;&amp; &lt;X /&gt;}</code> (điều kiện là boolean) · <code>{a ? &lt;X /&gt; : &lt;Y /&gt;}</code>'],
    ['Vẽ danh sách', '<code>{ds.map((x) =&gt; &lt;Dong key={x.id} … /&gt;)}</code>'],
    ['Sắp xếp mà không sửa props', '<code>ds.toSorted(…)</code> hoặc <code>[...ds].sort(…)</code>'],
    ['Test một component', '<code>render(&lt;X … /&gt;)</code> · <code>screen.getByRole / getByText</code> · <code>afterEach(cleanup)</code>'],
  ], { sm: true }) },

  /* 29 */ { t: 'Tự gõ tiếp dự án: trang chủ An Tâm có đội ngũ bác sĩ', body: two(list([
    '<strong>1.</strong> <code>src/types.ts</code> (6 kiểu cố định) và <code>src/du-lieu/bac-si.ts</code> (6 bác sĩ <code>bs-1…bs-6</code>).',
    '<strong>2.</strong> <code>Header</code> và <code>Footer</code> — chuyển tên + giờ mở cửa của Mục 0 vào <code>Header</code>.',
    '<strong>3.</strong> <code>TheBacSi</code> — props <code>bacSi: BacSi</code>, <code>noiBat?: boolean</code>; chuyên khoa hiện tiếng Việt.',
    '<strong>4.</strong> <code>DanhSachBacSi</code> — props <code>danhSach</code>, <code>key={bs.id}</code>, rỗng thì báo; từ 15 năm thì <code>noiBat</code>.',
    '<strong>5.</strong> Ghép trong <code>App</code>; thêm <code>cleanup</code> vào <code>setup.ts</code>; viết 3 tệp test.',
  ]), box('good', '<strong>Đạt khi</strong>: <code>npx tsc -b</code> không in gì; <code>npx vitest run</code> ra <code>Tests 8 passed (8)</code> (hoặc nhiều hơn); console trình duyệt không có cảnh báo key; trang giống ảnh chụp ở slide 21 — 6 thẻ, 2 thẻ viền cam.<br><br>Lời giải đầy đủ ở cuối Bài 1.4.')) },
]);
