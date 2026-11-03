/** Bộ luyện bài 12.4 — Design token & theme. Lược đồ: ./_luoc-do.mjs (loại 'dom'; đề cuối 'js'). kiem[].moTa = "EN|||VI".
 *  `chiTrinhDuyet: true` = cần var() được giải ⇒ jsdom bỏ qua, máy chấm trình duyệt thật chấm. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 12.4 — Token thiết kế và chế độ sáng/tối.</em> Máy chấm đọc token trên <code>:root</code> và màu đã tính (sau khi trình duyệt thay <code>var()</code>) của các phần tử.</p>';
const trang = (body, htmlAttr = '') => `<!doctype html>
<html lang="vi"${htmlAttr}>
<head>
  <meta charset="utf-8">
  <title>Bài 12.4</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${body}
</body>
</html>
`;
const THE = `  <div class="card">
    <h3 class="card__title">Đơn hàng #1024</h3>
    <p class="card__meta">Đã giao hôm qua</p>
    <button class="btn">Theo dõi</button>
  </div>`;

export default doiDau({
  slug: 'wf-12-4-tokens-theming',
  ten: '12.4 Token thiết kế và chế độ sáng/tối',
  baiHoc: 'Nền tảng Web — Bài 12.4 Design token và theming',
  ngonNgu: 'html',
  level: 'INTERMEDIATE',
  moTa: 'Khai báo token trên :root, component chỉ dùng token, sửa bẫy thiếu đơn vị, theme tối bằng [data-theme], nút chuyển theme bằng JavaScript, hàm tính tỉ lệ tương phản WCAG — 6 bài.',
  de: [
    {
      tieuDe: 'Khai báo token trên :root',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['custom property', ':root'], tienQuyet: ['selector'], the: ['css', 'token'],
      moTa: `${BAI}<p>Khai báo năm token ngữ nghĩa trên ${c(':root')}: ${c('--color-bg: #f8fafc')}, ${c('--color-text: #0f172a')}, ${c('--color-muted: #334155')}, ${c('--color-primary: #2563eb')}, ${c('--radius-md: 10px')}. Code khởi đầu đặt chúng trong ${c('.card')} — nên ${c('body')} và các phần tử ngoài thẻ không thấy.</p>`,
      yeuCau: ['Năm token nằm trên :root (phần tử html).', 'Đúng giá trị như đề.', 'body dùng --color-bg và --color-text.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Token toàn trang.',
      rangBuoc: ['Tên token đúng như đề.'],
      viDu: [{ input: ':root { --color-primary: #2563eb; }', output: 'mọi phần tử đọc được var(--color-primary)', explanation: 'Custom property được kế thừa xuống cả trang.' }],
      goiY: [':root là phần tử <html> — khai ở đó thì mọi con cháu kế thừa.', ':root { --color-bg: #f8fafc; … } body { background: var(--color-bg); color: var(--color-text); }'],
      khoiDau: { 'index.html': trang(THE), 'styles.css': `/* Bài 12.4 — token đặt sai chỗ */
.card { --color-bg: #f8fafc; --color-text: #0f172a; --color-muted: #334155; --color-primary: #2563eb; --radius-md: 10px; }
body { background: var(--color-bg); color: var(--color-text); }
` },
      loiGiai: { 'index.html': trang(THE), 'styles.css': `/* Bài 12.4 — token ngữ nghĩa trên :root ⇒ cả trang kế thừa */
:root {
  --color-bg: #f8fafc;
  --color-text: #0f172a;
  --color-muted: #334155;
  --color-primary: #2563eb;
  --radius-md: 10px;
}
body { background: var(--color-bg); color: var(--color-text); }
` },
      giaiThich: `<p>Custom property kế thừa từ cha xuống con như ${c('color')}. Khai trên ${c('.card')} thì chỉ thẻ và con của nó thấy; ${c('body')} là cha của thẻ nên không thấy gì. ${c(':root')} là gốc của cây, khai ở đó là toàn trang.</p>`,
      loiHayGap: ['Viết -color-bg (một gạch) — không phải custom property.', 'Viết hoa tên khi đọc — custom property phân biệt hoa thường.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:root',
      kiem: [
        { moTa: '--color-primary on :root|||--color-primary trên :root', kiem: 'css', selector: 'html', thuocTinh: '--color-primary', giaTri: '#2563eb' },
        { moTa: '--color-bg and --radius-md on :root|||--color-bg và --radius-md trên :root', kiem: 'css', selector: 'html', thuocTinh: '--radius-md', giaTri: '10px' },
        { moTa: 'body background resolves to #f8fafc|||Nền body tính ra #f8fafc', kiem: 'css', selector: 'body', thuocTinh: 'background-color', giaTri: 'rgb(248, 250, 252)', chiTrinhDuyet: true },
        { moTa: 'Hidden: --color-muted|||Ẩn: --color-muted', an: true, kiem: 'css', selector: 'html', thuocTinh: '--color-muted', giaTri: '#334155' },
      ],
    },
    {
      tieuDe: 'Component chỉ dùng token',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['var()', 'token ngữ nghĩa'], tienQuyet: ['custom property'], the: ['css', 'token'],
      moTa: `${BAI}<p>Token đã có trên ${c(':root')}. CSS component (${c('.card')}, ${c('.card__meta')}, ${c('.btn')}) đang viết mã màu trực tiếp. Thay MỌI mã màu và bán kính trong component bằng ${c('var(--…)')}: viền thẻ ${c('--color-border')}, chữ phụ ${c('--color-muted')}, nút nền ${c('--color-primary')} chữ ${c('--color-bg')}, bo góc ${c('--radius-md')}.</p>`,
      yeuCau: ['Ngoài :root, styles.css không còn mã màu # nào.', 'Màu tính ra đúng như trước (nút xanh #2563eb).', 'Bo góc thẻ dùng --radius-md.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Component dùng token.',
      rangBuoc: ['Không đổi giá trị token.'],
      viDu: [{ input: '.btn { background: var(--color-primary); }', output: 'rgb(37, 99, 235)', explanation: 'Đổi theme ⇒ nút tự đổi theo.' }],
      goiY: ['Tìm mọi # ngoài :root và thay bằng token tương ứng.', '.btn { background: var(--color-primary); color: var(--color-bg); }'],
      khoiDau: { 'index.html': trang(THE), 'styles.css': `/* Bài 12.4 — token có sẵn nhưng component chưa dùng */
:root { --color-bg: #f8fafc; --color-text: #0f172a; --color-muted: #334155; --color-border: #cbd5e1; --color-primary: #2563eb; --radius-md: 10px; }
body { background: var(--color-bg); color: var(--color-text); }
.card { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; }
.card__meta { color: #334155; }
.btn { background: #2563eb; color: #f8fafc; border: 0; padding: 8px 14px; border-radius: 8px; }
` },
      loiGiai: { 'index.html': trang(THE), 'styles.css': `/* Bài 12.4 — component chỉ nói "vai trò", token nói "giá trị" */
:root { --color-bg: #f8fafc; --color-text: #0f172a; --color-muted: #334155; --color-border: #cbd5e1; --color-primary: #2563eb; --radius-md: 10px; }
body { background: var(--color-bg); color: var(--color-text); }
.card { border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px; }
.card__meta { color: var(--color-muted); }
.btn { background: var(--color-primary); color: var(--color-bg); border: 0; padding: 8px 14px; border-radius: 8px; }
` },
      giaiThich: `<p>Khi component chỉ đọc token ngữ nghĩa, đổi giao diện (hay thêm theme tối) là sửa giá trị token — không đụng tới component nào. Máy chấm kiểm cả màu tính ra (sau khi trình duyệt thay ${c('var()')}) lẫn mã nguồn.</p>`,
      loiHayGap: ['Sót một mã màu trong :hover hay border.', 'Dùng token nguyên thuỷ (--blue-600) trong component — theme tối không đổi được.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/var',
      kiem: [
        { moTa: 'No hex colours outside :root|||Không mã màu # ngoài :root', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\}[^}]*#[0-9a-fA-F]{3,8}\\b', phuDinh: true },
        { moTa: 'Button resolves to the primary blue|||Nút tính ra màu xanh chính', kiem: 'css', selector: '.btn', thuocTinh: 'background-color', giaTri: 'rgb(37, 99, 235)', chiTrinhDuyet: true },
        { moTa: 'Muted text resolves to slate|||Chữ phụ tính ra màu xám', kiem: 'css', selector: '.card__meta', thuocTinh: 'color', giaTri: 'rgb(51, 65, 85)', chiTrinhDuyet: true },
        { moTa: 'Card radius uses --radius-md|||Bo góc thẻ dùng --radius-md', kiem: 'ma-nguon', tep: 'styles.css', khop: 'border-radius\\s*:\\s*var\\(--radius-md\\)' },
      ],
    },
    {
      tieuDe: 'Sửa bẫy token thiếu đơn vị',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['invalid at computed-value time', 'calc()'], tienQuyet: ['var()'], the: ['css', 'token'],
      moTa: `${BAI}<p>${c('--sidebar-width: 240')} không có đơn vị nên ${c('width: var(--sidebar-width)')} không hợp lệ và sidebar bung hết bề ngang — không có lỗi nào hiện ra. Sửa để ${c('.sidebar')} rộng đúng 240px VÀ ${c('.content')} có ${c('margin-left')} bằng chính token đó cộng 16px (dùng ${c('calc()')}). Giữ một chỗ khai báo duy nhất.</p>`,
      yeuCau: ['.sidebar rộng 240px (đo thật).', '.content margin-left 256px, tính từ token bằng calc().', 'Token khai một lần trên :root.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Bố cục đúng.',
      rangBuoc: ['Không viết số 240 ở chỗ thứ hai.'],
      viDu: [{ input: '--sidebar-width: 240px', output: 'width: 240px', explanation: 'Đơn vị nằm trong token.' }],
      goiY: ['Cách 1: --sidebar-width: 240px. Cách 2: calc(var(--sidebar-width) * 1px).', '.content { margin-left: calc(var(--sidebar-width) + 16px); }'],
      khoiDau: { 'index.html': trang('  <aside class="sidebar">Menu</aside>\n  <main class="content">Nội dung</main>'), 'styles.css': `/* Bài 12.4 — token thiếu đơn vị */
:root { --sidebar-width: 240; }
.sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: var(--sidebar-width); background: #0f172a; color: #fff; }
.content { margin-left: 256px; }
` },
      loiGiai: { 'index.html': trang('  <aside class="sidebar">Menu</aside>\n  <main class="content">Nội dung</main>'), 'styles.css': `/* Bài 12.4 — đơn vị nằm TRONG token; mọi chỗ khác tính từ token */
:root { --sidebar-width: 240px; }
.sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: var(--sidebar-width);
  background: #0f172a; color: #fff;
}
.content { margin-left: calc(var(--sidebar-width) + 16px); }   /* 240px + 16px = 256px */
` },
      giaiThich: `<p>Custom property lưu chữ thô; ${c('240')} không phải độ dài, nên ${c('width: 240')} bị coi là "không hợp lệ lúc tính giá trị" và trình duyệt dùng giá trị khởi đầu (auto). ${c('calc()')} cộng được token với hằng số, nên khoảng cách luôn đi theo bề rộng sidebar.</p>`,
      loiHayGap: ['Sửa width thành 240px trực tiếp — token vô dụng, margin lệch khi đổi.', 'calc(var(--sidebar-width)+16px) thiếu khoảng trắng quanh + — calc không hợp lệ.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties#invalid_custom_properties',
      kiem: [
        { moTa: 'Sidebar is 240px wide|||Sidebar rộng 240px', kiem: 'kich-thuoc', selector: '.sidebar', thuocTinh: 'width', giaTri: 240, chiTrinhDuyet: true },
        { moTa: 'Content margin-left 256px|||margin-left của content 256px', kiem: 'css', selector: '.content', thuocTinh: 'margin-left', giaTri: '256px', chiTrinhDuyet: true },
        { moTa: 'margin-left derived from the token with calc()|||margin-left tính từ token bằng calc()', kiem: 'ma-nguon', tep: 'styles.css', khop: 'margin-left\\s*:\\s*calc\\([^)]*var\\(--sidebar-width\\)' },
        { moTa: 'The number 240 appears only once|||Số 240 chỉ xuất hiện một lần', kiem: 'ma-nguon', tep: 'styles.css', khop: '240[\\s\\S]*240', phuDinh: true },
      ],
    },
    {
      tieuDe: 'Theme tối bằng [data-theme]',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['data-theme', 'token ngữ nghĩa'], tienQuyet: ['attribute selector', 'token'], the: ['css', 'theme', 'dark mode'],
      moTa: `${BAI}<p>Trang được mở với ${c('<html data-theme="dark">')}. Thêm khối ${c(':root[data-theme="dark"]')} định nghĩa lại các token ngữ nghĩa: nền ${c('#0f172a')}, chữ ${c('#f8fafc')}, chữ phụ ${c('#cbd5e1')}, màu chính ${c('#93c5fd')}. KHÔNG sửa luật component nào; KHÔNG dùng ${c('filter: invert')}.</p>`,
      yeuCau: ['Có khối :root[data-theme="dark"] với bốn token.', 'Ở theme tối: nền body tính ra rgb(15, 23, 42), nút tính ra rgb(147, 197, 253).', 'Luật component giữ nguyên.'],
      dauVao: 'index.html (data-theme="dark") + styles.css.', dauRa: 'Theme tối.',
      rangBuoc: ['Không đổi khối component.'],
      viDu: [{ input: ':root[data-theme="dark"] { --color-bg: #0f172a; }', output: 'nền tối', explanation: 'Chỉ tầng ngữ nghĩa đổi.' }],
      goiY: [':root[data-theme="dark"] đặc hiệu hơn :root nên đè được.', ':root[data-theme="dark"] { --color-bg: #0f172a; --color-text: #f8fafc; --color-muted: #cbd5e1; --color-primary: #93c5fd; }'],
      khoiDau: { 'index.html': trang(THE, ' data-theme="dark"'), 'styles.css': `/* Bài 12.4 — chưa có theme tối */
:root { --color-bg: #f8fafc; --color-text: #0f172a; --color-muted: #334155; --color-primary: #2563eb; }
body { background: var(--color-bg); color: var(--color-text); }
.card__meta { color: var(--color-muted); }
.btn { background: var(--color-primary); color: var(--color-bg); border: 0; padding: 8px 14px; border-radius: 8px; }
` },
      loiGiai: { 'index.html': trang(THE, ' data-theme="dark"'), 'styles.css': `/* Bài 12.4 — theme tối = tráo tầng token ngữ nghĩa, component không đổi */
:root { --color-bg: #f8fafc; --color-text: #0f172a; --color-muted: #334155; --color-primary: #2563eb; }
:root[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-text: #f8fafc;
  --color-muted: #cbd5e1;
  --color-primary: #93c5fd;      /* xanh NHẠT hơn để còn đọc được trên nền tối */
}
body { background: var(--color-bg); color: var(--color-text); }
.card__meta { color: var(--color-muted); }
.btn { background: var(--color-primary); color: var(--color-bg); border: 0; padding: 8px 14px; border-radius: 8px; }
` },
      giaiThich: `<p>${c(':root[data-theme="dark"]')} khớp phần tử html có thuộc tính đó và nặng hơn ${c(':root')} nên các token bị đè. Mọi component đọc token nên tự đổi theo. Muốn theo hệ điều hành thì đặt cùng các khai báo đó trong ${c('@media (prefers-color-scheme: dark)')}.</p>`,
      loiHayGap: ['Viết [data-theme=dark] lên body thay vì html — :root[...] không khớp.', 'Sửa luật .btn cho theme tối — nhân đôi CSS.'],
      thamKhao: 'https://web.dev/articles/prefers-color-scheme',
      kiem: [
        { moTa: 'Dark tokens defined|||Có token tối', kiem: 'css', selector: 'html', thuocTinh: '--color-bg', giaTri: '#0f172a' },
        { moTa: 'Body background resolves dark|||Nền body tính ra màu tối', kiem: 'css', selector: 'body', thuocTinh: 'background-color', giaTri: 'rgb(15, 23, 42)', chiTrinhDuyet: true },
        { moTa: 'Button uses the lighter primary|||Nút dùng màu chính nhạt hơn', kiem: 'css', selector: '.btn', thuocTinh: 'background-color', giaTri: 'rgb(147, 197, 253)', chiTrinhDuyet: true },
        { moTa: 'No filter: invert|||Không dùng filter: invert', kiem: 'ma-nguon', tep: 'styles.css', khop: 'invert\\(', phuDinh: true },
        { moTa: 'Component rule unchanged|||Luật component giữ nguyên', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\.btn\\s*\\{\\s*background:\\s*var\\(--color-primary\\)' },
      ],
    },
    {
      tieuDe: 'Nút chuyển theme bằng JavaScript',
      doKho: 'MEDIUM', phut: 15, chayScript: true,
      khaiNiem: ['dataset', 'addEventListener', 'try/catch localStorage'], tienQuyet: ['DOM', 'theme bằng data-theme'], the: ['javascript', 'theme'],
      moTa: `${BAI}<p>Viết script cho nút ${c('#toggle')}: mỗi lần bấm đổi ${c('document.documentElement.dataset.theme')} giữa ${c('"light"')} và ${c('"dark"')} (lần đầu: đang light ⇒ dark), cập nhật chữ của nút thành ${c('"Light mode"')} khi đang tối và ${c('"Dark mode"')} khi đang sáng, và CỐ GẮNG lưu vào ${c('localStorage')} — bọc trong ${c('try/catch')} vì bộ nhớ có thể bị chặn (máy chấm chạy trong khung hộp cát).</p>`,
      yeuCau: ['Bấm 1 lần ⇒ html data-theme="dark", nút ghi "Light mode".', 'Bấm 2 lần ⇒ "light", nút ghi "Dark mode".', 'Không lỗi JavaScript nào kể cả khi localStorage bị chặn.'],
      dauVao: 'index.html (có sẵn CSS theme).', dauRa: 'Nút chuyển theme.',
      rangBuoc: ['Không dùng thư viện.'],
      viDu: [{ input: 'bấm #toggle', output: '<html data-theme="dark">', explanation: 'CSS :root[data-theme="dark"] tráo token.' }],
      goiY: ['const root = document.documentElement; const next = root.dataset.theme === "dark" ? "light" : "dark";', 'try { localStorage.setItem("theme", next); } catch {} — đặt chữ nút sau khi đổi.'],
      khoiDau: { 'index.html': `<!doctype html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="utf-8">
  <title>Bài 12.4</title>
  <style>
    :root { --color-bg: #f8fafc; --color-text: #0f172a; }
    :root[data-theme="dark"] { --color-bg: #0f172a; --color-text: #f8fafc; }
    body { background: var(--color-bg); color: var(--color-text); }
  </style>
</head>
<body>
  <button id="toggle">Dark mode</button>
  <script>
    document.getElementById('toggle').addEventListener('click', () => {
      localStorage.setItem('theme', 'dark');
    });
  </script>
</body>
</html>
` },
      loiGiai: { 'index.html': `<!doctype html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="utf-8">
  <title>Bài 12.4</title>
  <style>
    :root { --color-bg: #f8fafc; --color-text: #0f172a; }
    :root[data-theme="dark"] { --color-bg: #0f172a; --color-text: #f8fafc; }
    body { background: var(--color-bg); color: var(--color-text); }
  </style>
</head>
<body>
  <button id="toggle">Dark mode</button>
  <script>
    const root = document.documentElement;
    const button = document.getElementById('toggle');
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;                       // CSS :root[data-theme="dark"] tráo token
      button.textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
      try {
        localStorage.setItem('theme', next);           // có thể bị chặn (ẩn danh, hộp cát)
      } catch (e) {
        // không lưu được thì thôi — trang vẫn phải chạy
      }
    });
  </script>
</body>
</html>
` },
      giaiThich: `<p>${c('dataset.theme')} đọc/ghi thuộc tính ${c('data-theme')} của ${c('<html>')}; CSS lo phần còn lại. ${c('localStorage')} ném ${c('SecurityError')} khi bộ nhớ bị chặn — không bọc try/catch thì cả handler dừng giữa chừng và nút "hỏng" chỉ với một số người dùng.</p>`,
      loiHayGap: ['Gọi localStorage trước khi đổi theme mà không try/catch — lỗi chặn mất bước đổi theme.', 'So sánh với class thay vì data-theme — CSS không khớp.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset',
      kiem: [
        { moTa: 'One click ⇒ dark|||Bấm một lần ⇒ tối', kiem: 'thuoc-tinh', selector: 'html', thuocTinh: 'data-theme', giaTri: 'dark', truoc: [{ hanhDong: 'click', selector: '#toggle' }] },
        { moTa: 'Button says Light mode when dark|||Nút ghi Light mode khi đang tối', kiem: 'text', selector: '#toggle', giaTri: 'Light mode', truoc: [{ hanhDong: 'click', selector: '#toggle' }] },
        { moTa: 'Two clicks ⇒ light again|||Bấm hai lần ⇒ sáng lại', kiem: 'thuoc-tinh', selector: 'html', thuocTinh: 'data-theme', giaTri: 'light', truoc: [{ hanhDong: 'click', selector: '#toggle', lan: 2 }] },
        { moTa: 'No JavaScript errors|||Không lỗi JavaScript', kiem: 'khong-loi-js', truoc: [{ hanhDong: 'click', selector: '#toggle', lan: 3 }] },
        { moTa: 'localStorage guarded by try/catch|||localStorage được bọc try/catch', kiem: 'ma-nguon', tep: 'index.html', khop: 'try\\s*\\{[^}]*localStorage' },
      ],
    },
    {
      tieuDe: 'Hàm tính tỉ lệ tương phản WCAG',
      doKho: 'HARD', phut: 20, loaiKiem: 'js', ngonNgu: 'javascript',
      khaiNiem: ['relative luminance', 'contrast ratio', 'WCAG AA'], tienQuyet: ['parseInt hex', 'Math'], the: ['javascript', 'a11y'],
      moTa: `${BAI}<p>Viết ${c('contrastRatio(fg, bg)')} nhận hai màu dạng ${c('"#rrggbb"')} và trả tỉ lệ tương phản WCAG làm tròn 2 chữ số (number). Rồi ${c('passesAA(fg, bg, large = false)')}: true khi tỉ lệ ≥ 4.5 (chữ thường) hoặc ≥ 3 (chữ lớn). Công thức: mỗi kênh c = giá trị/255; c ≤ 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4; L = 0.2126 R + 0.7152 G + 0.0722 B; tỉ lệ = (Lsáng + 0.05)/(Ltối + 0.05).</p>`,
      yeuCau: [`${c('contrastRatio("#000000", "#ffffff")')} là 21; thứ tự hai màu không quan trọng.`, `${c('contrastRatio("#9ca3af", "#ffffff")')} là 2.54.`, 'passesAA đúng ngưỡng 4.5 / 3.'],
      dauVao: 'fg, bg: chuỗi "#rrggbb"; large: boolean.', dauRa: 'number; boolean.',
      rangBuoc: ['Không dùng thư viện màu.'],
      viDu: [{ input: 'contrastRatio("#2563eb", "#f8fafc")', output: '4.94', explanation: 'Nút xanh trên nền sáng — vừa đạt AA.' }],
      goiY: ['Tách kênh: hex.match(/\\w\\w/g).map((h) => parseInt(h, 16) / 255)', 'Sắp xếp hai độ chói giảm dần trước khi chia; Math.round(r * 100) / 100.'],
      khoiDau: { 'main.js': `// Bài 12.4 — tương phản (chưa xong)
function contrastRatio(fg, bg) {
  return 1;
}
function passesAA(fg, bg, large = false) {
  return true;
}
` },
      loiGiai: { 'main.js': `// Bài 12.4 — tỉ lệ tương phản theo WCAG 2.x
function luminance(hex) {
  const [r, g, b] = hex.replace('#', '').match(/\\w\\w/g)
    .map((h) => parseInt(h, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));   // tuyến tính hoá sRGB
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;                                 // mắt nhạy với xanh lá nhất
}

function contrastRatio(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);       // sáng / tối
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

function passesAA(fg, bg, large = false) {
  return contrastRatio(fg, bg) >= (large ? 3 : 4.5);
}
` },
      giaiThich: `<p>Độ chói tương đối đo độ sáng mà mắt cảm nhận, không phải trung bình cộng ba kênh — xanh lá chiếm 71,5%. Sắp xếp hai độ chói để thứ tự tham số không quan trọng. Ngưỡng AA: 4,5:1 cho chữ thường, 3:1 cho chữ lớn (≥ 24px, hoặc 18,66px đậm).</p>`,
      loiHayGap: ['Quên bước tuyến tính hoá — kết quả lệch.', 'Chia Lfg/Lbg trực tiếp — thiếu +0.05 và phụ thuộc thứ tự.'],
      thamKhao: 'https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio',
      kiem: [
        { moTa: 'Black on white is 21|||Đen trên trắng là 21', goi: 'contrastRatio("#000000", "#ffffff")', mongDoi: 21 },
        { moTa: 'Light grey on white fails: 2.54|||Xám nhạt trên trắng trượt: 2,54', goi: 'contrastRatio("#9ca3af", "#ffffff")', mongDoi: 2.54 },
        { moTa: 'Order does not matter|||Thứ tự không quan trọng', goi: '[contrastRatio("#2563eb", "#f8fafc"), contrastRatio("#f8fafc", "#2563eb")]', mongDoi: [4.94, 4.94] },
        { moTa: 'passesAA thresholds|||Ngưỡng của passesAA', goi: '[passesAA("#2563eb", "#f8fafc"), passesAA("#9ca3af", "#ffffff"), passesAA("#9ca3af", "#ffffff", true)]', mongDoi: [true, false, false] },
        { moTa: 'Hidden: dark theme pair|||Ẩn: cặp theme tối', an: true, goi: 'contrastRatio("#0f172a", "#93c5fd")', mongDoi: 9.9 },
      ],
    },
  ],
});
