/** Bộ luyện bài 12.3 — Đặt tên và tổ chức CSS. Lược đồ: ./_luoc-do.mjs (loại 'dom'; đề cuối loại 'js'). kiem[].moTa = "EN|||VI".
 *  `chiTrinhDuyet: true` = jsdom không hiểu @layer / :where ⇒ bỏ qua ở jsdom, trình duyệt thật chấm. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 12.3 — Đặt tên và tổ chức CSS.</em> Máy chấm đọc giá trị CSS đã tính trên trang của bạn và soi <code>styles.css</code> tìm id, <code>!important</code> và selector lồng.</p>';
const trang = (body) => `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Bài 12.3</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${body}
</body>
</html>
`;
const KHONG_ID = { kiem: 'ma-nguon', tep: 'styles.css', khop: '(^|[\\s,}>+~])#[A-Za-z][\\w-]*[^;{]*\\{', phuDinh: true };
const KHONG_IMPORTANT = { kiem: 'ma-nguon', tep: 'styles.css', khop: '!important', phuDinh: true };

const NAV_CU = `  <nav id="nav">
    <ul>
      <li><a href="#" class="active">Trang chủ</a></li>
      <li><a href="#">Khoá học</a></li>
      <li><a href="#" class="nav-link-red">Khuyến mãi</a></li>
    </ul>
  </nav>`;
const NAV_BEM = `  <nav class="site-nav">
    <ul class="site-nav__list">
      <li><a href="#" class="site-nav__link site-nav__link--active">Trang chủ</a></li>
      <li><a href="#" class="site-nav__link">Khoá học</a></li>
      <li><a href="#" class="site-nav__link site-nav__link--sale">Khuyến mãi</a></li>
    </ul>
  </nav>`;

export default doiDau({
  slug: 'wf-12-3-css-architecture',
  ten: '12.3 Đặt tên và tổ chức CSS',
  baiHoc: 'Nền tảng Web — Bài 12.3 Đặt tên và tổ chức CSS',
  ngonNgu: 'html',
  level: 'INTERMEDIATE',
  moTa: 'Đổi tên theo BEM, gỡ id và !important khỏi thanh điều hướng, xếp lớp bằng @layer, giá trị mặc định dễ đè bằng :where(), sửa va chạm tên toàn cục, tự viết hàm tính độ đặc hiệu — 6 bài.',
  de: [
    {
      tieuDe: 'Thẻ sản phẩm theo BEM',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['BEM', 'block__element--modifier'], tienQuyet: ['class selector'], the: ['css', 'bem'],
      moTa: `${BAI}<p>HTML đã dùng tên BEM: khối ${c('.product-card')}, phần tử ${c('__title')}, ${c('__price')}, biến thể ${c('--featured')}. Code khởi đầu tạo kiểu bằng selector lồng theo thẻ (${c('.product-card h3')}…). Viết lại ${c('styles.css')} chỉ dùng MỘT class mỗi selector, giữ nguyên giao diện: tiêu đề 18px, giá màu ${c('rgb(22, 163, 74)')}, thẻ nổi bật viền ${c('rgb(245, 158, 11)')}.</p>`,
      yeuCau: ['Mỗi selector đúng một class (không thẻ, không lồng).', 'Tiêu đề 18px; giá xanh lá; thẻ --featured viền cam.', 'Không id, không !important.'],
      dauVao: 'index.html (đã có class BEM) + styles.css.', dauRa: 'CSS phẳng theo BEM.',
      rangBuoc: ['Không sửa HTML.'],
      viDu: [{ input: '.product-card__price { color: rgb(22, 163, 74); }', output: 'giá màu xanh lá', explanation: 'Một class, độ đặc hiệu (0,1,0).' }],
      goiY: ['Mỗi thứ cần tạo kiểu đã có class riêng trong HTML — dùng nó.', '.product-card__title { font-size: 18px; } .product-card--featured { border-color: rgb(245, 158, 11); }'],
      khoiDau: { 'index.html': trang(`  <article class="product-card">
    <h3 class="product-card__title">Bàn phím</h3>
    <div class="product-card__price">450.000đ</div>
  </article>
  <article class="product-card product-card--featured">
    <h3 class="product-card__title">Chuột</h3>
    <div class="product-card__price">250.000đ</div>
  </article>`), 'styles.css': `/* Bài 12.3 — selector lồng theo thẻ */
.product-card { width: 220px; padding: 14px; border: 2px solid rgb(203, 213, 225); border-radius: 10px; }
.product-card h3 { font-size: 18px; margin: 0 0 6px; }
div.product-card div { color: rgb(22, 163, 74); font-weight: 700; }
article.product-card.product-card--featured { border-color: rgb(245, 158, 11); }
` },
      loiGiai: { 'index.html': trang(`  <article class="product-card">
    <h3 class="product-card__title">Bàn phím</h3>
    <div class="product-card__price">450.000đ</div>
  </article>
  <article class="product-card product-card--featured">
    <h3 class="product-card__title">Chuột</h3>
    <div class="product-card__price">250.000đ</div>
  </article>`), 'styles.css': `/* Bài 12.3 — BEM: một class mỗi selector, độ đặc hiệu phẳng (0,1,0) */
.product-card { width: 220px; padding: 14px; border: 2px solid rgb(203, 213, 225); border-radius: 10px; }
.product-card__title { font-size: 18px; margin: 0 0 6px; }          /* element */
.product-card__price { color: rgb(22, 163, 74); font-weight: 700; }  /* element */
.product-card--featured { border-color: rgb(245, 158, 11); }        /* modifier, đứng sau ⇒ thắng */
` },
      giaiThich: `<p>Khi mọi selector cùng trọng lượng (một class), luật đứng sau thắng — dễ đoán. Biến thể ${c('--featured')} đặt SAU khối nên ghi đè được viền mà không cần tăng độ đặc hiệu. Đổi ${c('h3')} thành ${c('h2')} cũng không vỡ gì.</p>`,
      loiHayGap: ['Viết .product-card .product-card__title — lồng không cần thiết.', 'Đặt modifier TRƯỚC khối — bị khối đè lại.'],
      thamKhao: 'https://getbem.com/introduction/',
      kiem: [
        { moTa: 'Title 18px|||Tiêu đề 18px', kiem: 'css', selector: '.product-card__title', thuocTinh: 'font-size', giaTri: '18px' },
        { moTa: 'Price is green|||Giá màu xanh lá', kiem: 'css', selector: '.product-card__price', thuocTinh: 'color', giaTri: 'rgb(22, 163, 74)' },
        { moTa: 'Featured card has an orange border|||Thẻ nổi bật viền cam', kiem: 'css', selector: '.product-card--featured', thuocTinh: 'border-top-color', giaTri: 'rgb(245, 158, 11)' },
        { moTa: 'No tag or nested selectors|||Không selector theo thẻ hay lồng', kiem: 'ma-nguon', tep: 'styles.css', khop: '(^|\\})\\s*[^{}]*(\\s[a-z][\\w-]*|[a-z]+\\.)[^{}]*\\{', phuDinh: true },
        { ...KHONG_ID, moTa: 'No id selectors|||Không selector id' },
      ],
    },
    {
      tieuDe: 'Gỡ id và !important khỏi thanh điều hướng',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['refactor', 'BEM', 'độ đặc hiệu'], tienQuyet: ['BEM'], the: ['css', 'bem', 'refactor'],
      moTa: `${BAI}<p>Bài luyện của bài học. Thanh điều hướng cũ dùng ${c('#nav ul li a')} và hai ${c('!important')}. Đổi HTML sang BEM (${c('.site-nav')}, ${c('.site-nav__list')}, ${c('.site-nav__link')}, ${c('--active')}, ${c('--sale')}) và viết lại CSS: list ngang (flex), link ${c('rgb(51, 65, 85)')}, link đang chọn ${c('rgb(37, 99, 235)')}, link khuyến mãi ${c('rgb(220, 38, 38)')}.</p>`,
      yeuCau: ['HTML dùng các class BEM như mô tả; không còn id="nav".', 'Màu ba loại link đúng; danh sách là flex.', 'CSS không còn id selector và !important.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Thanh điều hướng BEM.',
      rangBuoc: ['Giữ nguyên chữ và thứ tự các link.'],
      viDu: [{ input: '.site-nav__link--active { color: rgb(37, 99, 235); }', output: 'link đang chọn màu xanh', explanation: 'Modifier đứng sau link gốc.' }],
      goiY: ['Đặt modifier sau .site-nav__link để thắng bằng thứ tự, không cần !important.', '.site-nav__list { display: flex; gap: 8px; list-style: none; } .site-nav__link { color: rgb(51, 65, 85); }'],
      khoiDau: { 'index.html': trang(NAV_CU), 'styles.css': `/* Bài 12.3 — thanh điều hướng cũ */
#nav ul { display: flex; list-style: none; }
#nav ul li a { color: rgb(51, 65, 85); padding: 8px; }
#nav ul li a.active { color: rgb(37, 99, 235) !important; }
.nav-link-red { color: rgb(220, 38, 38) !important; }
` },
      loiGiai: { 'index.html': trang(NAV_BEM), 'styles.css': `/* Bài 12.3 — thanh điều hướng BEM: không id, không !important */
.site-nav__list { display: flex; gap: 8px; list-style: none; margin: 0; padding: 0; }
.site-nav__link { color: rgb(51, 65, 85); padding: 8px; text-decoration: none; }
.site-nav__link--active { color: rgb(37, 99, 235); }   /* đứng sau ⇒ thắng bằng thứ tự */
.site-nav__link--sale { color: rgb(220, 38, 38); }
` },
      giaiThich: `<p>Cả ba luật màu đều nặng (0,1,0); modifier đứng sau nên thắng. ${c('!important')} không còn cần — nó chỉ từng cần vì ${c('#nav ul li a')} nặng (1,0,3).</p>`,
      loiHayGap: ['Giữ id="nav" trong HTML "cho chắc" — rồi ai đó lại tạo kiểu bằng nó.', 'Đặt modifier trước luật gốc.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity',
      kiem: [
        { moTa: 'BEM markup, no id="nav"|||HTML theo BEM, không còn id="nav"', kiem: 'khong-ton-tai', selector: '#nav' },
        { moTa: 'List is flex|||Danh sách là flex', kiem: 'css', selector: '.site-nav__list', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: 'Active link is blue|||Link đang chọn màu xanh', kiem: 'css', selector: '.site-nav__link--active', thuocTinh: 'color', giaTri: 'rgb(37, 99, 235)' },
        { moTa: 'Sale link is red, others slate|||Link khuyến mãi đỏ, còn lại xám', kiem: 'css', selector: '.site-nav__link--sale', thuocTinh: 'color', giaTri: 'rgb(220, 38, 38)' },
        { ...KHONG_ID, moTa: 'No id selectors|||Không selector id' },
        { ...KHONG_IMPORTANT, moTa: 'No !important|||Không !important' },
        { moTa: 'Hidden: plain link colour|||Ẩn: màu link thường', an: true, kiem: 'css', selector: '.site-nav__link:not(.site-nav__link--active):not(.site-nav__link--sale)', thuocTinh: 'color', giaTri: 'rgb(51, 65, 85)' },
      ],
    },
    {
      tieuDe: 'Xếp lớp bằng @layer',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['@layer', 'thứ tự lớp'], tienQuyet: ['độ đặc hiệu'], the: ['css', 'layer'],
      moTa: `${BAI}<p>Khai báo thứ tự ${c('@layer base, components, utilities;')} ở đầu file. Đưa kiểu chữ chung vào ${c('base')}, luật ${c('.site-nav__link')} (có ${c('display: inline-block')}) vào ${c('components')}, và utility ${c('.hidden { display: none; }')} vào ${c('utilities')}. Kết quả: link có thêm class ${c('hidden')} phải ẩn — dù luật component có độ đặc hiệu cao hơn (code khởi đầu cố ý viết ${c('.site-nav .site-nav__link')}).</p>`,
      yeuCau: ['Dòng khai báo thứ tự ba lớp.', 'Ba nhóm luật nằm trong đúng lớp.', 'Link có class hidden tính ra display: none; link khác inline-block.'],
      dauVao: 'index.html + styles.css.', dauRa: 'CSS có lớp.',
      rangBuoc: ['Không dùng !important.'],
      viDu: [{ input: '@layer utilities { .hidden { display: none } }', output: 'thắng .site-nav .site-nav__link', explanation: 'Giữa các lớp, thứ tự lớp thắng độ đặc hiệu.' }],
      goiY: ['@layer base, components, utilities; rồi @layer components { … } @layer utilities { … }', 'Không cần giảm độ đặc hiệu của component — lớp utilities đứng sau đã thắng.'],
      khoiDau: { 'index.html': trang(`  <nav class="site-nav">
    <a href="#" class="site-nav__link">Trang chủ</a>
    <a href="#" class="site-nav__link hidden">Quản trị</a>
  </nav>`), 'styles.css': `/* Bài 12.3 — chưa có lớp */
body { font-family: system-ui, sans-serif; }
.hidden { display: none; }
.site-nav .site-nav__link { display: inline-block; padding: 8px; }
` },
      loiGiai: { 'index.html': trang(`  <nav class="site-nav">
    <a href="#" class="site-nav__link">Trang chủ</a>
    <a href="#" class="site-nav__link hidden">Quản trị</a>
  </nav>`), 'styles.css': `/* Bài 12.3 — thứ tự lớp khai báo MỘT lần: lớp sau thắng, bất kể độ đặc hiệu */
@layer base, components, utilities;

@layer base {
  body { font-family: system-ui, sans-serif; }
}
@layer components {
  .site-nav .site-nav__link { display: inline-block; padding: 8px; }
}
@layer utilities {
  .hidden { display: none; }      /* một class vẫn thắng component (0,2,0) vì lớp đứng sau */
}
` },
      giaiThich: `<p>Không có lớp, ${c('.site-nav .site-nav__link')} (0,2,0) thắng ${c('.hidden')} (0,1,0) nên link "Quản trị" vẫn hiện. Trong lớp, so sánh đi theo THỨ TỰ LỚP trước: utilities khai báo sau components nên thắng, độ đặc hiệu chỉ còn ý nghĩa bên trong một lớp.</p>`,
      loiHayGap: ['Quên dòng khai báo thứ tự — lớp được sắp theo lần đầu xuất hiện.', 'Thêm !important cho .hidden — đúng là chạy, nhưng mở lại chiến tranh.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@layer',
      kiem: [
        { moTa: 'Layer order declared|||Có khai báo thứ tự lớp', kiem: 'ma-nguon', tep: 'styles.css', khop: '@layer\\s+base\\s*,\\s*components\\s*,\\s*utilities\\s*;' },
        { moTa: 'Hidden link computes display: none|||Link hidden tính ra display: none', kiem: 'css', selector: '.site-nav__link.hidden', thuocTinh: 'display', giaTri: 'none', chiTrinhDuyet: true },
        { moTa: 'Other links stay inline-block|||Link khác vẫn inline-block', kiem: 'css', selector: '.site-nav__link:not(.hidden)', thuocTinh: 'display', giaTri: 'inline-block', chiTrinhDuyet: true },
        { moTa: '.hidden lives in @layer utilities|||.hidden nằm trong @layer utilities', kiem: 'ma-nguon', tep: 'styles.css', khop: '@layer\\s+utilities\\s*\\{[^}]*\\.hidden' },
        { ...KHONG_IMPORTANT, moTa: 'No !important|||Không !important' },
      ],
    },
    {
      tieuDe: 'Giá trị mặc định dễ đè bằng :where()',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: [':where()', ':is()', 'độ đặc hiệu 0'], tienQuyet: ['độ đặc hiệu'], the: ['css', 'where'],
      moTa: `${BAI}<p>Bạn viết "thư viện" ${c('lib.css')} có giá trị mặc định cho ${c('.lib-card')}: tiêu đề ${c('h3')} màu đỏ, đoạn ${c('p')} cỡ 14px. Người dùng thư viện viết ${c('styles.css')} với luật đơn giản ${c('h3 { color: rgb(37, 99, 235) }')} và ${c('p { font-size: 16px }')} — và họ phải THẮNG. Sửa ${c('lib.css')} bằng ${c(':where()')} (không sửa styles.css, không đổi thứ tự file).</p>`,
      yeuCau: ['Luật trong lib.css bọc trong :where(…).', 'h3 trong .lib-card tính ra màu xanh của người dùng; p 16px.', 'Không !important.'],
      dauVao: 'index.html + lib.css + styles.css.', dauRa: 'Thư viện dễ tuỳ biến.',
      rangBuoc: ['Không sửa styles.css.'],
      viDu: [{ input: ':where(.lib-card h3) { color: red }', output: 'độ đặc hiệu (0,0,0)', explanation: 'Mọi luật của người dùng đều thắng.' }],
      goiY: [':where(.lib-card h3) — cả selector nằm trong :where ⇒ (0,0,0).', ':where(.lib-card) h3 cũng được: (0,0,1), bằng h3 của người dùng và thua vì lib.css nạp trước.'],
      khoiDau: { 'index.html': `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Bài 12.3</title>
  <link rel="stylesheet" href="lib.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="lib-card"><h3>Tiêu đề</h3><p>Mô tả ngắn.</p></div>
</body>
</html>
`, 'lib.css': `/* lib.css — giá trị mặc định của "thư viện" */
.lib-card h3 { color: rgb(220, 38, 38); }
.lib-card p { font-size: 14px; }
`, 'styles.css': `/* styles.css — người dùng thư viện (không sửa) */
h3 { color: rgb(37, 99, 235); }
p { font-size: 16px; }
` },
      loiGiai: { 'index.html': `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Bài 12.3</title>
  <link rel="stylesheet" href="lib.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="lib-card"><h3>Tiêu đề</h3><p>Mô tả ngắn.</p></div>
</body>
</html>
`, 'lib.css': `/* lib.css — mặc định bọc trong :where() ⇒ độ đặc hiệu 0, người dùng đè bằng selector đơn giản nhất */
:where(.lib-card h3) { color: rgb(220, 38, 38); }
:where(.lib-card p) { font-size: 14px; }
`, 'styles.css': `/* styles.css — người dùng thư viện (không sửa) */
h3 { color: rgb(37, 99, 235); }
p { font-size: 16px; }
` },
      giaiThich: `<p>${c('.lib-card h3')} nặng (0,1,1) nên thắng ${c('h3')} (0,0,1) của người dùng dù đứng trước. Bọc trong ${c(':where()')} đưa độ đặc hiệu về 0 — bất kỳ luật nào của người dùng cũng thắng. Đây là cách các bộ reset hiện đại (và nhiều thư viện) viết giá trị mặc định.</p>`,
      loiHayGap: ['Dùng :is() — giữ độ đặc hiệu của .lib-card, vẫn thua.', 'Sửa styles.css thêm .lib-card — đẩy chiến tranh sang phía người dùng.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:where',
      kiem: [
        { moTa: 'User colour wins inside .lib-card|||Màu của người dùng thắng trong .lib-card', kiem: 'css', selector: '.lib-card h3', thuocTinh: 'color', giaTri: 'rgb(37, 99, 235)', chiTrinhDuyet: true },
        { moTa: 'User font size wins|||Cỡ chữ của người dùng thắng', kiem: 'css', selector: '.lib-card p', thuocTinh: 'font-size', giaTri: '16px', chiTrinhDuyet: true },
        { moTa: 'lib.css uses :where()|||lib.css dùng :where()', kiem: 'ma-nguon', tep: 'lib.css', khop: ':where\\(' },
        { moTa: 'styles.css unchanged|||styles.css không đổi', kiem: 'ma-nguon', tep: 'styles.css', khop: '^\\s*h3\\s*\\{\\s*color:\\s*rgb\\(37, 99, 235\\);\\s*\\}\\s*p\\s*\\{\\s*font-size:\\s*16px;\\s*\\}\\s*$' },
        { moTa: 'No !important|||Không !important', kiem: 'ma-nguon', khop: '!important', phuDinh: true },
      ],
    },
    {
      tieuDe: 'Sửa va chạm tên toàn cục',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['không gian tên', 'BEM'], tienQuyet: ['class selector'], the: ['css', 'bem'],
      moTa: `${BAI}<p>Thẻ sản phẩm và footer cùng dùng ${c('.title')}; luật của footer (viết sau) làm hỏng tiêu đề thẻ. Đổi tên trong CẢ HTML và CSS: ${c('.product-card__title')} (20px, ${c('rgb(37, 99, 235)')}) và ${c('.site-footer__title')} (12px, chữ hoa, ${c('rgb(156, 163, 175)')}). Không còn class nào tên trần ${c('title')}.</p>`,
      yeuCau: ['Không phần tử nào còn class "title".', 'Tiêu đề thẻ 20px xanh; tiêu đề footer 12px xám chữ hoa.', 'Selector một class, không lồng.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Hai tiêu đề độc lập.',
      rangBuoc: ['Giữ nguyên chữ hiển thị.'],
      viDu: [{ input: '.site-footer__title { font-size: 12px }', output: 'không ảnh hưởng thẻ', explanation: 'Tiền tố khối là không gian tên.' }],
      goiY: ['Tên khối làm tiền tố: product-card__, site-footer__.', 'Đổi class trong HTML trước, rồi đổi selector trong CSS.'],
      khoiDau: { 'index.html': trang(`  <article class="product-card"><h3 class="title">Bàn phím</h3></article>
  <footer class="site-footer"><span class="title">Liên hệ</span></footer>`), 'styles.css': `/* Bài 12.3 — va chạm */
.title { font-size: 20px; color: rgb(37, 99, 235); }
.title { font-size: 12px; color: rgb(156, 163, 175); text-transform: uppercase; }
` },
      loiGiai: { 'index.html': trang(`  <article class="product-card"><h3 class="product-card__title">Bàn phím</h3></article>
  <footer class="site-footer"><span class="site-footer__title">Liên hệ</span></footer>`), 'styles.css': `/* Bài 12.3 — mỗi khối một không gian tên: không thể va nhau */
.product-card__title { font-size: 20px; color: rgb(37, 99, 235); }
.site-footer__title { font-size: 12px; color: rgb(156, 163, 175); text-transform: uppercase; }
` },
      giaiThich: `<p>Mọi class trong một trang chung một bảng tên; tên chung chung như ${c('title')} sớm muộn sẽ bị ai đó dùng lại. Tiền tố khối biến tên thành duy nhất mà không cần công cụ. CSS Modules làm đúng việc này tự động bằng hậu tố băm.</p>`,
      loiHayGap: ['Sửa bằng .product-card .title — vẫn để lại tên chung cho người sau va.', 'Chỉ đổi CSS mà quên HTML.'],
      thamKhao: 'https://getbem.com/naming/',
      kiem: [
        { moTa: 'No bare "title" class left|||Không còn class "title" trần', kiem: 'khong-ton-tai', selector: '.title' },
        { moTa: 'Card title 20px blue|||Tiêu đề thẻ 20px xanh', kiem: 'css', selector: '.product-card__title', thuocTinh: 'font-size', giaTri: '20px' },
        { moTa: 'Footer title uppercase grey|||Tiêu đề footer chữ hoa xám', kiem: 'css', selector: '.site-footer__title', thuocTinh: 'text-transform', giaTri: 'uppercase' },
        { moTa: 'Hidden: card title colour|||Ẩn: màu tiêu đề thẻ', an: true, kiem: 'css', selector: '.product-card__title', thuocTinh: 'color', giaTri: 'rgb(37, 99, 235)' },
      ],
    },
    {
      tieuDe: 'Tự viết hàm tính độ đặc hiệu',
      doKho: 'HARD', phut: 20, loaiKiem: 'js', ngonNgu: 'javascript',
      khaiNiem: ['specificity', 'regex', ':where'], tienQuyet: ['regex', 'mảng'], the: ['css', 'javascript', 'specificity'],
      moTa: `${BAI}<p>Viết ${c('specificity(selector)')} trả về mảng ${c('[a, b, c]')} cho một selector ĐƠN (không có dấu phẩy): ${c('a')} = số id (${c('#x')}), ${c('b')} = số class (${c('.x')}), thuộc tính (${c('[type=x]')}) và pseudo-class (${c(':hover')}), ${c('c')} = số thẻ (${c('div')}) và pseudo-element (${c('::before')}). ${c(':where(…)')} và nội dung của nó đóng góp 0; ${c('*')} và các dấu nối (${c('> + ~')}, khoảng trắng) đóng góp 0. Rồi viết ${c('compare(s1, s2)')} trả ${c('1')} nếu s1 thắng, ${c('-1')} nếu s2 thắng, ${c('0')} nếu bằng.</p>`,
      yeuCau: [`${c('specificity("#nav ul li a.active")')} là ${c('[1, 1, 3]')}.`, ':where(…) đóng góp 0; ::before tính vào c; :hover tính vào b.', 'compare so a trước, rồi b, rồi c.'],
      dauVao: 'selector: string (một selector đơn, không có :is/:not).', dauRa: '[a, b, c]; -1 | 0 | 1.',
      rangBuoc: ['Không cần xử lý :is(), :not(), :has().'],
      viDu: [{ input: 'specificity(".btn:hover::before")', output: '[0, 2, 1]', explanation: '.btn và :hover là b; ::before là c.' }],
      goiY: ['Bỏ :where(...) trước, rồi đếm: /#[\\w-]+/g, /\\.[\\w-]+|\\[[^\\]]+\\]|(?<!:):(?!:)[\\w-]+/g, /::[\\w-]+|(^|[\\s>+~])[a-zA-Z][\\w-]*/g.', 'compare: lặp i = 0..2, nếu x[i] !== y[i] trả Math.sign(x[i] - y[i]).'],
      khoiDau: { 'main.js': `// Bài 12.3 — độ đặc hiệu (chưa xong: chỉ đếm class)
function specificity(selector) {
  const b = (selector.match(/\\.[\\w-]+/g) || []).length;
  return [0, b, 0];
}
function compare(s1, s2) {
  return 0;
}
` },
      loiGiai: { 'main.js': `// Bài 12.3 — độ đặc hiệu [a, b, c] của một selector đơn
function specificity(selector) {
  // :where(...) luôn đóng góp 0 ⇒ bỏ hẳn phần đó trước khi đếm
  const s = selector.replace(/:where\\([^)]*\\)/g, ' ');
  const a = (s.match(/#[\\w-]+/g) || []).length;                         // id
  const b = (s.match(/\\.[\\w-]+|\\[[^\\]]+\\]|(?<!:):(?!:)[\\w-]+/g) || []).length; // class, [attr], :pseudo-class (không phải ::)
  const pseudoEl = (s.match(/::[\\w-]+/g) || []).length;                  // ::before, ::after
  // thẻ: chữ cái đứng đầu chuỗi hoặc ngay sau khoảng trắng / dấu nối (không phải sau . # : [)
  const tags = (s.match(/(^|[\\s>+~])[a-zA-Z][\\w-]*/g) || []).length;
  return [a, b, pseudoEl + tags];
}

function compare(s1, s2) {
  const x = specificity(s1), y = specificity(s2);
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return Math.sign(x[i] - y[i]);   // cột trái quyết định trước
  }
  return 0;
}
` },
      giaiThich: `<p>Độ đặc hiệu là ba cột so từ trái sang: một id thắng mọi số class, một class thắng mọi số thẻ. Bỏ ${c(':where(...)')} trước vì nó luôn bằng 0. Regex thẻ chỉ đếm chữ cái ở đầu hoặc sau dấu nối, để ${c('a.active')} đếm ${c('a')} là thẻ còn ${c('.active')} là class.</p>`,
      loiHayGap: ['Cộng ba số thành một tổng — 11 class không thắng 1 id.', 'Đếm ::before thành pseudo-class (cột b).'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity',
      kiem: [
        { moTa: 'Id + class + tags|||Id + class + thẻ', goi: 'specificity("#nav ul li a.active")', mongDoi: [1, 1, 3] },
        { moTa: 'Pseudo-class and pseudo-element|||Pseudo-class và pseudo-element', goi: 'specificity(".btn:hover::before")', mongDoi: [0, 2, 1] },
        { moTa: ':where() counts zero|||:where() tính 0', goi: '[specificity(":where(.lib-card) h3"), specificity(":where(#a .b)")]', mongDoi: [[0, 0, 1], [0, 0, 0]] },
        { moTa: 'Attributes count as classes; * and combinators zero|||Thuộc tính tính như class; * và dấu nối tính 0', goi: 'specificity("form > input[type=email] + *")', mongDoi: [0, 1, 2] },
        { moTa: 'compare: one id beats eleven classes|||compare: một id thắng mười một class', goi: '[compare("#x", ".a.b.c.d.e.f.g.h.i.j.k"), compare("p", "div"), compare(".a", ".a .b")]', mongDoi: [1, 0, -1] },
        { moTa: 'Hidden: BEM selector|||Ẩn: selector BEM', an: true, goi: 'specificity(".product-card__button--disabled")', mongDoi: [0, 1, 0] },
      ],
    },
  ],
});
