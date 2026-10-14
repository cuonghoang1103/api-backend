/** Bộ luyện bài 3.5 — Thiết kế responsive. Lược đồ: ./_luoc-do.mjs */
import { c, code } from './_luoc-do.mjs';

const VIEWPORT = '    <meta name="viewport" content="width=device-width, initial-scale=1">\n';
const TRANG = (title, body, viewport = true) => `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
${viewport ? VIEWPORT : ''}    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
${body}
  </body>
</html>
`;

const BB = `*, *::before, *::after { box-sizing: border-box; }
`;
const THE = (n, ten = 'Sản phẩm') => Array.from({ length: n }, (_, i) => `      <div class="o">${ten} ${i + 1}</div>`).join('\n');

export default {
  slug: 'wf-3-5-responsive',
  ten: '3.5 Thiết kế responsive: một trang, mọi màn hình',
  baiHoc: 'Nền tảng Web — Bài 3.5 Thiết kế responsive: một trang, mọi màn hình',
  ngonNgu: 'css',
  level: 'BEGINNER',
  moTa: 'Thẻ viewport, đơn vị tương đối (%, rem, vw/vh), img max-width: 100%, media query min-width, mobile-first, điểm ngắt theo nội dung — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Bước 0 của responsive: thẻ viewport và ảnh không bao giờ tràn',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['meta viewport', 'img max-width: 100%', 'tràn ngang trên điện thoại'],
      tienQuyet: ['bộ khung HTML5', 'quy tắc CSS'],
      the: ['css', 'responsive', 'viewport', 'images'],
      moTa: `<p>Bài 3.5, bước 0: <em>"Thiếu thẻ viewport, điện thoại giả vờ là một desktop rộng và thu nhỏ cả trang tới mức không đọc nổi."</em> Và trong bảng đơn vị: <em>"${c('img { max-width: 100%; }')} ngăn ảnh tràn ra trên màn hình nhỏ — bắt buộc."</em> Trang du lịch dưới đây thiếu cả hai: trên điện thoại chữ tí hon, và ảnh rộng 1200px kéo cả trang tràn ngang. Sửa đúng hai dòng.</p>`,
      yeuCau: [
        `Thêm ${c('<meta name="viewport" content="width=device-width, initial-scale=1">')} vào ${c('<head>')}.`,
        `Mọi ${c('<img>')} có ${c('max-width: 100%')} (và ${c('height: auto')} để giữ tỉ lệ khi ảnh co).`,
        `Giữ nguyên thuộc tính ${c('width="1200" height="800"')} trên ảnh (chúng giữ chỗ, bài 2.2).`,
      ],
      dauVao: 'index.html không có viewport; ảnh 1200×800; styles.css trống.',
      dauRa: 'Trên điện thoại 375px: chữ đọc được ngay, ảnh co còn ~359px, không còn thanh cuộn ngang.',
      rangBuoc: [
        'Không xoá width/height của ảnh.',
        'Không dùng overflow: hidden để giấu phần tràn.',
      ],
      viDu: [{
        input: 'img { max-width: 100%; height: auto; }  ·  màn 375px, body margin 8px',
        output: 'Ảnh 1200×800 hiển thị 359 × 239px — vừa khít, đúng tỉ lệ.',
        explanation: 'max-width: 100% = "không bao giờ rộng hơn vật chứa". height: auto tính lại chiều cao theo tỉ lệ gốc thay vì giữ 800px.',
      }],
      goiY: [
        'Một dòng HTML trong head, một quy tắc CSS cho img.',
        'img { max-width: 100%; height: auto; } — height: auto quan trọng vì thuộc tính height="800" sẽ giữ chiều cao 800px nếu không đè.',
      ],
      khoiDau: {
        'styles.css': `${BB}
/* Ảnh tràn ngang trên điện thoại — thêm một quy tắc */
`,
        'index.html': TRANG('Đà Lạt', `    <h1>Ba ngày ở Đà Lạt</h1>
    <img src="ho-xuan-huong.jpg" alt="Hồ Xuân Hương phủ sương sớm" width="1200" height="800">
    <p>Ngày đầu tiên dạo quanh hồ lúc sáu giờ sáng.</p>`, false),
      },
      loiGiai: {
        'styles.css': `${BB}
/* bắt buộc trong mọi trang responsive: ảnh không bao giờ rộng hơn vật chứa */
img {
  max-width: 100%;  /* co lại khi màn hẹp hơn ảnh */
  height: auto;     /* tính lại chiều cao theo tỉ lệ (đè height="800" của thuộc tính) */
}
`,
        'index.html': TRANG('Đà Lạt', `    <h1>Ba ngày ở Đà Lạt</h1>
    <!-- width/height giữ nguyên: trình duyệt dùng chúng để giữ chỗ đúng TỈ LỆ trước khi ảnh tải -->
    <img src="ho-xuan-huong.jpg" alt="Hồ Xuân Hương phủ sương sớm" width="1200" height="800">
    <p>Ngày đầu tiên dạo quanh hồ lúc sáu giờ sáng.</p>`),
      },
      giaiThich: `<p>Thẻ viewport bảo điện thoại "bề rộng trang = bề rộng màn hình thật" — thiếu nó, điện thoại giả vờ rộng 980px rồi thu nhỏ, và mọi media query bạn sẽ viết ở các bài sau đo nhầm thứ. ${c('max-width: 100%')} khiến ảnh co theo vật chứa nhưng không phóng to quá kích thước gốc.</p>
<p>${c('height: auto')} là mảnh hay quên: thuộc tính ${c('height="800"')} trên thẻ img trở thành chiều cao CSS, nên ảnh co ngang mà vẫn cao 800px — méo hình. Trình duyệt hiện đại vẫn dùng cặp width/height để tính <em>tỉ lệ</em> giữ chỗ, nên giữ chúng là đúng. Máy chấm kiểm meta viewport và ${c('max-width')}/${c('height')} computed của ảnh; trong trình duyệt nó đo thêm bề rộng ảnh ở màn 375px.</p>`,
      loiHayGap: [
        `Viết ${c('img { width: 100%; }')} — ảnh nhỏ (icon 32px) cũng bị kéo căng hết hàng.`,
        `Xoá width/height của thẻ img để "hết méo" — mất chỗ giữ, trang nhảy khi ảnh tải.`,
        `Thêm ${c('overflow-x: hidden')} cho body — giấu triệu chứng, ảnh vẫn bị cắt.`,
      ],
      thamKhao: 'https://web.dev/learn/design/media',
      kiem: [
        { moTa: 'Có meta viewport width=device-width, initial-scale=1', kiem: 'thuoc-tinh', selector: 'head meta[name="viewport"]', thuocTinh: 'content', khop: '^width=device-width,\\s*initial-scale=1(\\.0)?$' },
        { moTa: 'Ảnh có max-width: 100%', kiem: 'css', selector: 'img', thuocTinh: 'max-width', giaTri: '100%' },
        { moTa: 'Ảnh có height: auto', kiem: 'css', selector: 'img', thuocTinh: 'height', khop: '^(auto|\\d+(\\.\\d+)?px)$' },
        { moTa: 'Quy tắc height: auto có trong CSS', kiem: 'ma-nguon', tep: 'styles.css', khop: 'img[^{]*\\{[^}]*height\\s*:\\s*auto' },
        { moTa: 'Vẫn giữ width="1200" height="800" trên ảnh', kiem: 'ton-tai', selector: 'img[width="1200"][height="800"]' },
        { moTa: 'Không giấu phần tràn bằng overflow', kiem: 'ma-nguon', tep: 'styles.css', khop: 'overflow', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Đổi px sang rem để chữ và khoảng cách co giãn cùng nhau',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['rem', '1rem = 16px mặc định', 'đơn vị tương đối', 'tôn trọng cỡ chữ người dùng chọn'],
      tienQuyet: ['quy tắc CSS'],
      the: ['css', 'responsive', 'rem', 'units'],
      moTa: `<p>Bài 3.5: <em>"rem — tương đối theo cỡ chữ gốc. 1rem = 16px mặc định. Dùng cho cỡ chữ và khoảng cách để mọi thứ co giãn cùng nhau."</em> Bảng kiểu dưới đây khoá mọi cỡ chữ bằng px — người dùng đặt cỡ chữ trình duyệt lớn hơn (vì mắt kém) thì trang vẫn y nguyên. Đổi sang rem: ở cỡ mặc định trang trông <strong>y hệt</strong>, nhưng giờ nó tôn trọng lựa chọn của người dùng.</p>`,
      yeuCau: [
        `${c('h1')}: 32px ⇒ ${c('2rem')}; ${c('p')}: 16px ⇒ ${c('1rem')}; ${c('.ghi-chu')}: 14px ⇒ ${c('0.875rem')}.`,
        `${c('.the')}: padding 24px ⇒ ${c('1.5rem')}; margin-bottom 16px ⇒ ${c('1rem')}.`,
        `Không còn đơn vị ${c('px')} nào trong font-size, padding, margin của tệp.`,
        `Giá trị tính ra ở cỡ mặc định giữ nguyên (32px, 16px, 14px, 24px, 16px).`,
      ],
      dauVao: 'styles.css dùng px cho cỡ chữ và khoảng cách.',
      dauRa: 'Trông y hệt ở cỡ chữ mặc định; phóng to cỡ chữ trình duyệt thì chữ và khoảng cách cùng lớn theo.',
      rangBuoc: [
        'Viền 1px giữ nguyên px (đường kẻ mảnh không cần co giãn).',
      ],
      viDu: [{
        input: 'h1 { font-size: 2rem; }',
        output: 'Cỡ mặc định (16px): h1 = 32px\nNgười dùng đặt cỡ chữ 20px: h1 = 40px',
        explanation: 'rem = bội số của cỡ chữ gốc (html). px thì cố định, bỏ qua cài đặt của người dùng.',
      }],
      goiY: [
        'Chia cho 16: 32/16 = 2, 24/16 = 1,5, 14/16 = 0,875.',
        'Viết số thập phân bằng dấu chấm: 1.5rem, 0.875rem.',
      ],
      khoiDau: {
        'styles.css': `${BB}
h1 { font-size: 32px; }
p  { font-size: 16px; }
.ghi-chu { font-size: 14px; }
.the {
  padding: 24px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}
`,
        'index.html': TRANG('Cỡ chữ', `    <h1>Thực đơn tuần này</h1>
    <div class="the">
      <p>Thứ Hai: bún chả.</p>
      <p class="ghi-chu">Giá đã gồm nước chấm.</p>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* 1rem = cỡ chữ gốc (mặc định 16px) — chia giá trị px cho 16 */
h1 { font-size: 2rem; }          /* 32 / 16 */
p  { font-size: 1rem; }          /* 16 / 16 */
.ghi-chu { font-size: 0.875rem; } /* 14 / 16 */
.the {
  padding: 1.5rem;               /* 24 / 16 — khoảng cách co giãn cùng chữ */
  margin-bottom: 1rem;           /* 16 / 16 */
  border: 1px solid #e2e8f0;     /* đường kẻ mảnh: px là đúng */
}
`,
        'index.html': TRANG('Cỡ chữ', `    <h1>Thực đơn tuần này</h1>
    <div class="the">
      <p>Thứ Hai: bún chả.</p>
      <p class="ghi-chu">Giá đã gồm nước chấm.</p>
    </div>`),
      },
      giaiThich: `<p>Ở cỡ mặc định, rem và px cho cùng con số — nên thiết kế không đổi. Khác biệt lộ ra khi người dùng đổi cỡ chữ trong cài đặt trình duyệt: px làm ngơ, rem lớn theo. Khoảng cách cũng dùng rem để chữ to ra không bị "chật" trong hộp cũ.</p>
<p>Máy chấm kiểm giá trị computed (trình duyệt luôn trả về px: 2rem ⇒ 32px) và kiểm mã nguồn không còn px trong font-size/padding/margin. Viền giữ px vì một đường kẻ 1px không cần dày lên theo chữ.</p>`,
      loiHayGap: [
        `Dùng ${c('em')} thay rem cho cỡ chữ lồng nhau — em tính theo cha, lồng hai tầng 0.875em là 0.766 lần.`,
        `Viết ${c('0,875rem')} với dấu phẩy — CSS chỉ nhận dấu chấm.`,
        `Đặt ${c('html { font-size: 62.5% }')} cho "dễ tính" — ghi đè cỡ người dùng chọn, đúng thứ ta muốn tránh.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#relative_length_units',
      kiem: [
        { moTa: 'h1 tính ra 32px', kiem: 'css', selector: 'h1', thuocTinh: 'font-size', giaTri: '32px' },
        { moTa: 'p tính ra 16px', kiem: 'css', selector: 'p:not(.ghi-chu)', thuocTinh: 'font-size', giaTri: '16px' },
        { moTa: '.ghi-chu tính ra 14px', kiem: 'css', selector: '.ghi-chu', thuocTinh: 'font-size', giaTri: '14px' },
        { moTa: '.the padding tính ra 24px', kiem: 'css', selector: '.the', thuocTinh: 'padding-top', giaTri: '24px' },
        { moTa: '.the margin-bottom tính ra 16px', kiem: 'css', selector: '.the', thuocTinh: 'margin-bottom', giaTri: '16px' },
        { moTa: 'Không còn px trong font-size/padding/margin', kiem: 'ma-nguon', tep: 'styles.css', khop: '(font-size|padding|margin)[\\w-]*\\s*:[^;]*\\dpx', phuDinh: true },
        { moTa: 'Dùng rem', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\d(\\.\\d+)?rem' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Media query đầu tiên: rộng tay hơn từ 768px trở lên',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['@media (min-width)', 'điểm ngắt', 'kiểu nền cho điện thoại'],
      tienQuyet: ['rem / px'],
      the: ['css', 'responsive', 'media-query'],
      moTa: `<p>Bài 3.5: <em>"Một media query áp một khối CSS chỉ khi một điều kiện đúng — thường là chiều rộng màn hình tối thiểu, gọi là một điểm ngắt (breakpoint)."</em> Trang bài viết dùng ${c('padding: 48px')} cho mọi màn — đẹp trên laptop, nhưng trên điện thoại 375px chữ bị ép còn một dải hẹp. Viết kiểu nền cho điện thoại, rồi "nới" ra từ 768px.</p>`,
      yeuCau: [
        `Kiểu nền: ${c('.container')} có ${c('padding: 16px')}, tiêu đề ${c('font-size: 1.5rem')}.`,
        `Từ ${c('768px')} trở lên (${c('@media (min-width: 768px)')}): ${c('padding: 48px')}, tiêu đề ${c('2.25rem')}.`,
        `Không dùng max-width trong media query.`,
      ],
      dauVao: '.container padding 48px, h1 2.25rem cho mọi màn.',
      dauRa: '375px: padding 16px, tiêu đề 24px · 1024px: padding 48px, tiêu đề 36px.',
      rangBuoc: [
        'Kiểu nền (ngoài media query) là kiểu điện thoại.',
      ],
      viDu: [{
        input: '.container { padding: 16px; }\n@media (min-width: 768px) {\n  .container { padding: 48px; }\n}',
        output: 'Màn 767px: padding 16px\nMàn 768px: padding 48px',
        explanation: 'min-width: 768px nghĩa là "bề rộng ≥ 768px". Quy tắc trong media query đứng sau nên thắng kiểu nền khi điều kiện đúng.',
      }],
      goiY: [
        'Viết kiểu điện thoại trước, ngoài mọi media query. Rồi mở @media (min-width: 768px) { … } và chỉ ghi những gì THAY ĐỔI.',
        '.container { padding: 16px; } .container h1 { font-size: 1.5rem; } @media (min-width: 768px) { .container { padding: 48px; } .container h1 { font-size: 2.25rem; } }',
      ],
      khoiDau: {
        'styles.css': `${BB}
.container {
  padding: 48px;
}
.container h1 {
  font-size: 2.25rem;
}
`,
        'index.html': TRANG('Bài viết', `    <div class="container">
      <h1>Thiết kế cho điện thoại trước</h1>
      <p>Hơn một nửa lượt truy cập web là trên điện thoại.</p>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* KIỂU NỀN = điện thoại (mobile-first) */
.container {
  padding: 16px;
}
.container h1 {
  font-size: 1.5rem;     /* 24px */
}

/* từ tablet trở lên: chỉ ghi thứ THAY ĐỔI */
@media (min-width: 768px) {
  .container {
    padding: 48px;
  }
  .container h1 {
    font-size: 2.25rem;  /* 36px */
  }
}
`,
        'index.html': TRANG('Bài viết', `    <div class="container">
      <h1>Thiết kế cho điện thoại trước</h1>
      <p>Hơn một nửa lượt truy cập web là trên điện thoại.</p>
    </div>`),
      },
      giaiThich: `<p>Media query không phải "một tệp CSS khác cho điện thoại" — nó là một khối quy tắc chỉ bật khi điều kiện đúng, và vì đứng sau nên nó đè kiểu nền có cùng độ đặc hiệu (bài 3.1: hoà thì đứng sau thắng). Kiểu nền viết cho màn nhỏ nhất, media query chỉ <em>thêm</em> cho màn lớn hơn.</p>
<p>Máy chấm dựng trang ở hai bề rộng iframe (375 và 1024px) và đọc padding/cỡ chữ computed ở mỗi bề rộng — đúng như thao tác kéo cửa sổ trong DevTools mà bài 3.5 dặn.</p>`,
      loiHayGap: [
        `Đặt media query LÊN TRÊN kiểu nền — kiểu nền đứng sau sẽ đè, media query vô hiệu.`,
        `Viết ${c('@media (min-width = 768px)')} — cú pháp đúng là dấu hai chấm.`,
        `Chép lại mọi thuộc tính vào media query — chỉ cần thứ thay đổi.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries',
      kiem: [
        { moTa: 'Màn 375px: padding 16px', kiem: 'css', selector: '.container', thuocTinh: 'padding-left', giaTri: '16px', beRong: 375 },
        { moTa: 'Màn 375px: tiêu đề 24px', kiem: 'css', selector: '.container h1', thuocTinh: 'font-size', giaTri: '24px', beRong: 375 },
        { moTa: 'Màn 1024px: padding 48px', kiem: 'css', selector: '.container', thuocTinh: 'padding-left', giaTri: '48px', beRong: 1024 },
        { moTa: 'Màn 1024px: tiêu đề 36px', kiem: 'css', selector: '.container h1', thuocTinh: 'font-size', giaTri: '36px', beRong: 1024 },
        { moTa: 'Ranh giới 767px vẫn là kiểu điện thoại', kiem: 'css', selector: '.container', thuocTinh: 'padding-left', giaTri: '16px', beRong: 767, an: true },
        { moTa: 'Ranh giới 768px đã là kiểu tablet', kiem: 'css', selector: '.container', thuocTinh: 'padding-left', giaTri: '48px', beRong: 768, an: true },
        { moTa: 'Không dùng max-width trong media query', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media[^{]*max-width', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Mobile-first đúng như bài học: 1 cột → 2 cột từ 768px → 3 cột từ 1024px',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['mobile-first', 'nhiều điểm ngắt', 'grid trong media query', 'chỉ thêm, không gỡ'],
      tienQuyet: ['media query', 'grid repeat()'],
      the: ['css', 'responsive', 'mobile-first', 'grid'],
      moTa: `<p>Ví dụ chính của bài 3.5 có ba tầng: kiểu nền 1 cột, ${c('@media (min-width: 768px)')} 2 cột, ${c('@media (min-width: 1024px)')} 3 cột. Trang sản phẩm dưới đây mới có 3 cột cứng — trên điện thoại mỗi thẻ hẹp còn 100px. Dựng lại theo đúng ba tầng, mỗi tầng chỉ <strong>thêm</strong> vào tầng trước.</p>`,
      yeuCau: [
        `Kiểu nền: ${c('.cards')} là grid ${c('1fr')}, ${c('gap: 16px')}.`,
        `${c('@media (min-width: 768px)')}: ${c('repeat(2, 1fr)')}.`,
        `${c('@media (min-width: 1024px)')}: ${c('repeat(3, 1fr)')}.`,
        `Hai khối media query xếp theo thứ tự tăng dần.`,
      ],
      dauVao: '.cards grid repeat(3, 1fr) cho mọi màn.',
      dauRa: '375px: 1 cột · 800px: 2 cột · 1200px: 3 cột.',
      rangBuoc: [
        'Không max-width trong media query.',
        'Không auto-fit (bài này luyện media query).',
      ],
      viDu: [{
        input: 'Màn 1200px: cả hai điều kiện min-width: 768px VÀ min-width: 1024px đều đúng.',
        output: 'Cả hai khối cùng áp; khối 1024px đứng sau nên thắng ⇒ 3 cột.',
        explanation: 'Vì thế thứ tự tăng dần là bắt buộc với min-width. Đảo ngược: màn 1200px ra 2 cột.',
      }],
      goiY: [
        'Ba tầng = ba quy tắc .cards: một ngoài media query, hai trong media query, nhỏ trước lớn sau.',
        '.cards { display: grid; grid-template-columns: 1fr; gap: 16px; } @media (min-width: 768px) { .cards { grid-template-columns: repeat(2, 1fr); } } @media (min-width: 1024px) { .cards { grid-template-columns: repeat(3, 1fr); } }',
      ],
      khoiDau: {
        'styles.css': `${BB}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.o { padding: 16px; border: 1px solid #e2e8f0; }
`,
        'index.html': TRANG('Sản phẩm', `    <div class="cards">
${THE(6)}
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* tầng 1 — kiểu nền: điện thoại, MỘT cột */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* tầng 2 — từ tablet: thêm cột */
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

/* tầng 3 — từ desktop: thêm cột nữa. Đứng SAU tầng 2 vì ở ≥ 1024px cả hai cùng đúng */
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}

.o { padding: 16px; border: 1px solid #e2e8f0; }
`,
        'index.html': TRANG('Sản phẩm', `    <div class="cards">
${THE(6)}
    </div>`),
      },
      giaiThich: `<p>Mobile-first đọc như một câu chuyện tăng dần: điện thoại (đơn giản nhất) → tablet thêm một cột → desktop thêm một cột nữa. Không tầng nào phải "gỡ" thứ gì của tầng trước — đó là lý do bài 3.5 nói cách này "dễ suy luận hơn và ít code hơn".</p>
<p>Điểm hay vấp: ở màn 1200px <em>cả hai</em> media query đều đúng, nên thứ tự quyết định (lại là luật "hoà thì đứng sau thắng"). Máy chấm đếm cột ở 375/800/1200px và ở hai ranh giới 767/1024px.</p>`,
      loiHayGap: [
        `Viết khối 1024px trước khối 768px — ở màn lớn, khối 768px đứng sau đè lại thành 2 cột.`,
        `Lặp lại ${c('display: grid')} và ${c('gap')} trong mỗi media query — thừa, chỉ cần thứ thay đổi.`,
        `Dùng ${c('max-width: 767px')} cho điện thoại — đó là desktop-first, bài sau sẽ chuyển ngược.`,
      ],
      thamKhao: 'https://web.dev/learn/design/media-queries',
      kiem: [
        { moTa: 'Màn 375px ⇒ 1 cột', kiem: 'so-cot', selector: '.cards', giaTri: 1, beRong: 375 },
        { moTa: 'Màn 800px ⇒ 2 cột', kiem: 'so-cot', selector: '.cards', giaTri: 2, beRong: 800 },
        { moTa: 'Màn 1200px ⇒ 3 cột', kiem: 'so-cot', selector: '.cards', giaTri: 3, beRong: 1200 },
        { moTa: 'Ranh giới 767px ⇒ 1 cột', kiem: 'so-cot', selector: '.cards', giaTri: 1, beRong: 767, an: true },
        { moTa: 'Ranh giới 1024px ⇒ 3 cột', kiem: 'so-cot', selector: '.cards', giaTri: 3, beRong: 1024, an: true },
        { moTa: 'Có media query min-width: 768px và 1024px', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media\\s*\\(\\s*min-width\\s*:\\s*768px\\s*\\)[\\s\\S]*@media\\s*\\(\\s*min-width\\s*:\\s*1024px\\s*\\)' },
        { moTa: 'Không max-width trong media query, không auto-fit', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media[^{]*max-width|auto-fit', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Lật ngược bảng kiểu desktop-first thành mobile-first mà kết quả y nguyên',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['desktop-first vs mobile-first', 'max-width → min-width', 'ranh giới điểm ngắt', 'tái cấu trúc'],
      tienQuyet: ['mobile-first ba tầng'],
      the: ['css', 'responsive', 'mobile-first', 'refactor'],
      moTa: `<p>Bài 3.5: viết bố cục điện thoại làm CSS nền rồi dùng min-width để thêm — <em>"dễ suy luận hơn và ít code hơn so với bắt đầu từ màn hình rộng rồi lược bớt"</em>. Bảng kiểu dưới đây làm ngược lại: kiểu nền là desktop, rồi ${c('max-width')} lược dần. Viết lại theo mobile-first, và kết quả ở <strong>mọi</strong> bề rộng phải y như cũ — kể cả đúng ranh giới.</p>
${code(`
Hành vi hiện tại (phải giữ):
  bề rộng      .luoi     .menu (flex-direction)   h1
  ≤ 767px      1 cột     column                   1.5rem
  768–1023px   2 cột     row                      2rem
  ≥ 1024px     4 cột     row                      2rem
`)}`,
      yeuCau: [
        `Kiểu nền (ngoài media query) là cột "≤ 767px" của bảng.`,
        `Chỉ dùng ${c('@media (min-width: …)')} — không còn ${c('max-width')} trong media query.`,
        `Ranh giới đúng: 767px vẫn là kiểu điện thoại, 768px đã là kiểu tablet; 1023px còn 2 cột, 1024px là 4 cột.`,
        `Số khối media query ≤ 2.`,
      ],
      dauVao: 'Kiểu nền desktop + @media (max-width: 1023px) + @media (max-width: 767px).',
      dauRa: 'Cùng hành vi, viết theo mobile-first.',
      rangBuoc: [
        'Không đổi HTML.',
        'Không dùng auto-fit.',
      ],
      viDu: [{
        input: '@media (max-width: 767px)  ⟷  @media (min-width: 768px)',
        output: 'max-width: 767px đúng với 0…767; min-width: 768px đúng với 768…∞ — hai nửa không chồng nhau.',
        explanation: 'Lật max-width X thành min-width X+1. Lật nhầm thành min-width: 767px là chồng một pixel — ở đúng 767px cả hai cách viết cho kết quả khác nhau.',
      }],
      goiY: [
        'Ba hàng của bảng = kiểu nền + hai khối min-width. Ranh giới: max-width 767 ⇒ min-width 768; max-width 1023 ⇒ min-width 1024.',
        'Trong khối 768px: .luoi 2 cột, .menu row, h1 2rem. Trong khối 1024px: chỉ .luoi 4 cột (menu và h1 không đổi nữa).',
      ],
      khoiDau: {
        'styles.css': `${BB}
/* desktop-first: nền là desktop, lược dần xuống */
.menu {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
h1 { font-size: 2rem; }
.luoi {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1023px) {
  .luoi { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 767px) {
  .menu { flex-direction: column; }
  h1 { font-size: 1.5rem; }
  .luoi { grid-template-columns: 1fr; }
}
.o { padding: 16px; border: 1px solid #e2e8f0; }
`,
        'index.html': TRANG('Cửa hàng', `    <nav class="menu">
      <a href="/">Trang chủ</a>
      <a href="/san-pham">Sản phẩm</a>
      <a href="/lien-he">Liên hệ</a>
    </nav>
    <h1>Sản phẩm mới</h1>
    <div class="luoi">
${THE(8)}
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* MOBILE-FIRST — kiểu nền là điện thoại (≤ 767px) */
.menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
h1 { font-size: 1.5rem; }
.luoi {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* max-width: 767px cũ ⇒ min-width: 768px (không chồng pixel nào) */
@media (min-width: 768px) {
  .menu { flex-direction: row; }
  h1 { font-size: 2rem; }
  .luoi { grid-template-columns: repeat(2, 1fr); }
}

/* max-width: 1023px cũ ⇒ min-width: 1024px; chỉ lưới đổi tiếp */
@media (min-width: 1024px) {
  .luoi { grid-template-columns: repeat(4, 1fr); }
}
.o { padding: 16px; border: 1px solid #e2e8f0; }
`,
        'index.html': TRANG('Cửa hàng', `    <nav class="menu">
      <a href="/">Trang chủ</a>
      <a href="/san-pham">Sản phẩm</a>
      <a href="/lien-he">Liên hệ</a>
    </nav>
    <h1>Sản phẩm mới</h1>
    <div class="luoi">
${THE(8)}
    </div>`),
      },
      giaiThich: `<p>Tái cấu trúc an toàn = kết quả không đổi ở mọi đầu vào. Với CSS responsive, "đầu vào" là bề rộng màn hình, và chỗ dễ vỡ nhất là đúng ranh giới. ${c('max-width: 767px')} phủ 0…767, nên phần bù của nó là ${c('min-width: 768px')} — không phải 767. Máy chấm vì vậy đo ở 7 bề rộng gồm cả bốn pixel ranh giới 767/768/1023/1024.</p>
<p>Bản mobile-first ngắn hơn ở chỗ khối thứ hai chỉ còn một dòng: từ 1024px, menu và tiêu đề không đổi gì nữa — chúng đã được "thêm" ở tầng 768px. Bản desktop-first phải lặp lại ${c('.luoi')} ở cả hai khối vì mỗi khối "gỡ" một phần.</p>`,
      loiHayGap: [
        `Lật ${c('max-width: 767px')} thành ${c('min-width: 767px')} — ở đúng 767px ra kiểu tablet.`,
        `Giữ kiểu nền desktop và chỉ đổi chữ max thành min — hành vi đảo lộn hoàn toàn.`,
        `Đặt khối 1024px trước khối 768px — màn lớn ra 2 cột.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design#media_queries',
      kiem: [
        { moTa: 'Màn 375px: 1 cột', kiem: 'so-cot', selector: '.luoi', giaTri: 1, beRong: 375 },
        { moTa: 'Màn 375px: menu dọc', kiem: 'css', selector: '.menu', thuocTinh: 'flex-direction', giaTri: 'column', beRong: 375 },
        { moTa: 'Màn 375px: h1 24px', kiem: 'css', selector: 'h1', thuocTinh: 'font-size', giaTri: '24px', beRong: 375 },
        { moTa: 'Ranh giới 767px: vẫn kiểu điện thoại', kiem: 'css', selector: '.menu', thuocTinh: 'flex-direction', giaTri: 'column', beRong: 767 },
        { moTa: 'Ranh giới 768px: menu ngang', kiem: 'css', selector: '.menu', thuocTinh: 'flex-direction', giaTri: 'row', beRong: 768 },
        { moTa: 'Ranh giới 768px: h1 32px', kiem: 'css', selector: 'h1', thuocTinh: 'font-size', giaTri: '32px', beRong: 768 },
        { moTa: 'Ranh giới 1023px: 2 cột', kiem: 'so-cot', selector: '.luoi', giaTri: 2, beRong: 1023 },
        { moTa: 'Ranh giới 1024px: 4 cột', kiem: 'so-cot', selector: '.luoi', giaTri: 4, beRong: 1024 },
        { moTa: 'Màn 1440px: menu vẫn ngang', kiem: 'css', selector: '.menu', thuocTinh: 'flex-direction', giaTri: 'row', beRong: 1440, an: true },
        { moTa: 'Không còn max-width trong media query', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media[^{]*max-width', phuDinh: true },
        { moTa: 'Tối đa 2 khối media query', kiem: 'ma-nguon', tep: 'styles.css', khop: '(@media[\\s\\S]*){3}', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Thanh điều hướng xếp dọc trên điện thoại, nằm ngang từ 768px',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['flex-direction đổi theo điểm ngắt', 'vùng chạm 44px', 'rem cho khoảng cách', 'mobile-first'],
      tienQuyet: ['Flexbox (bài 3.3)', 'media query'],
      the: ['css', 'responsive', 'navbar', 'flexbox'],
      moTa: `<p>Bẫy cuối bài 3.5: <em>"một đầu ngón tay rộng chừng 44px, nên các liên kết cách nhau 8px là một trò may rủi."</em> Thanh điều hướng của site đang nằm ngang ở mọi màn, liên kết sát nhau, trên điện thoại bấm trượt liên tục. Thiết kế lại theo mobile-first: điện thoại xếp dọc với mỗi liên kết là một vùng chạm cao ít nhất 44px; từ 768px chuyển thành hàng ngang logo trái — menu phải.</p>`,
      yeuCau: [
        `Kiểu nền: ${c('.navbar')} flex ${c('column')}, ${c('gap: 0.5rem')}; ${c('.menu')} flex ${c('column')}.`,
        `Kiểu nền: mỗi ${c('.menu a')} là vùng chạm: ${c('display: block')}, ${c('min-height: 44px')}, ${c('padding: 0.75rem 1rem')}.`,
        `Từ 768px: ${c('.navbar')} thành ${c('row')}, ${c('justify-content: space-between')}, ${c('align-items: center')}; ${c('.menu')} thành ${c('row')}, ${c('gap: 1.5rem')}.`,
        `Từ 768px: liên kết bỏ min-height (${c('min-height: 0')}) và padding gọn ${c('0.5rem')}.`,
      ],
      dauVao: '.navbar và .menu flex row ở mọi màn, liên kết không padding.',
      dauRa: '375px: logo trên, menu dọc từng dòng cao 44px · 1024px: logo trái, menu ngang bên phải.',
      rangBuoc: [
        'Không max-width trong media query.',
        'Không ẩn menu (chưa học JavaScript để mở/đóng).',
      ],
      viDu: [{
        input: '.menu a { display: block; min-height: 44px; padding: 0.75rem 1rem; }',
        output: 'Mỗi liên kết là một dải cao ≥ 44px, rộng hết hàng — bấm chỗ nào trong dải cũng trúng.',
        explanation: 'display: block để padding dọc có tác dụng và vùng bấm phủ cả hàng.',
      }],
      goiY: [
        'Viết trọn bản điện thoại trước (column, vùng chạm 44px). Rồi mở @media (min-width: 768px) và chỉ ghi những gì đổi.',
        'Trong media query: .navbar { flex-direction: row; justify-content: space-between; align-items: center; } .menu { flex-direction: row; gap: 1.5rem; } .menu a { min-height: 0; padding: 0.5rem; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
.navbar {
  display: flex;
  padding: 1rem;
  background: #0f172a;
}
.menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar a {
  color: #f8fafc;
  text-decoration: none;
}
`,
        'index.html': TRANG('CuongThai', `    <header class="navbar">
      <a href="/" class="logo">CuongThai</a>
      <ul class="menu">
        <li><a href="/courses">Khoá học</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/code-lab">Code Lab</a></li>
      </ul>
    </header>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* KIỂU NỀN — điện thoại: mọi thứ xếp dọc, vùng chạm lớn */
.navbar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #0f172a;
}
.menu {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar a {
  color: #f8fafc;
  text-decoration: none;
}
.menu a {
  display: block;          /* padding dọc có tác dụng, vùng bấm phủ cả dòng */
  min-height: 44px;        /* bề rộng một đầu ngón tay */
  padding: 0.75rem 1rem;
}

/* TỪ 768px — chỉ ghi thứ thay đổi */
@media (min-width: 768px) {
  .navbar {
    flex-direction: row;
    justify-content: space-between;  /* logo trái, menu phải */
    align-items: center;
  }
  .menu {
    flex-direction: row;
    gap: 1.5rem;
  }
  .menu a {
    min-height: 0;         /* có chuột: không cần vùng chạm 44px */
    padding: 0.5rem;
  }
}
`,
        'index.html': TRANG('CuongThai', `    <header class="navbar">
      <a href="/" class="logo">CuongThai</a>
      <ul class="menu">
        <li><a href="/courses">Khoá học</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/code-lab">Code Lab</a></li>
      </ul>
    </header>`),
      },
      giaiThich: `<p>Responsive không chỉ là "co cho vừa" — trên điện thoại thứ hữu hạn là đầu ngón tay, không phải điểm ảnh. Vùng chạm 44px (con số trong hướng dẫn của Apple và WCAG) biến danh sách liên kết thành những dải dễ bấm. Từ 768px trở lên, chuột chính xác hơn nên ta thu gọn lại.</p>
<p>Đây là bài 3.3 (flex) gặp bài 3.5 (media query): cùng một vật chứa đổi ${c('flex-direction')} theo điểm ngắt, và nhớ bẫy đổi trục — ở bản column, ${c('justify-content')} không còn là trái/phải. Máy chấm đọc giá trị computed ở 375px và 1024px (min-height ở 375px là 44px).</p>`,
      loiHayGap: [
        `Đặt min-height lên ${c('<li>')} thay vì ${c('<a>')} — dải cao 44px nhưng chỉ chữ là bấm được.`,
        `Quên ${c('display: block')} trên liên kết — padding dọc của phần tử dòng không đẩy dòng, vùng bấm vẫn bé.`,
        `Viết ${c('justify-content: space-between')} ở kiểu nền column — với column nó trải theo chiều dọc.`,
      ],
      thamKhao: 'https://www.w3.org/WAI/WCAG21/Understanding/target-size.html',
      kiem: [
        { moTa: '375px: .navbar xếp dọc', kiem: 'css', selector: '.navbar', thuocTinh: 'flex-direction', giaTri: 'column', beRong: 375 },
        { moTa: '375px: .menu xếp dọc', kiem: 'css', selector: '.menu', thuocTinh: 'flex-direction', giaTri: 'column', beRong: 375 },
        { moTa: '375px: liên kết menu cao tối thiểu 44px', kiem: 'css', selector: '.menu a', thuocTinh: 'min-height', giaTri: '44px', beRong: 375 },
        { moTa: '375px: liên kết menu là khối', kiem: 'css', selector: '.menu a', thuocTinh: 'display', giaTri: 'block', beRong: 375 },
        { moTa: '375px: padding liên kết 12px 16px', kiem: 'css', selector: '.menu a', thuocTinh: 'padding-top', giaTri: '12px', beRong: 375 },
        { moTa: '1024px: .navbar hàng ngang, space-between', kiem: 'css', selector: '.navbar', thuocTinh: 'justify-content', giaTri: 'space-between', beRong: 1024 },
        { moTa: '1024px: .navbar căn giữa dọc', kiem: 'css', selector: '.navbar', thuocTinh: 'align-items', giaTri: 'center', beRong: 1024 },
        { moTa: '1024px: .menu hàng ngang, gap 24px', kiem: 'css', selector: '.menu', thuocTinh: 'gap', khop: '^24px( 24px)?$', beRong: 1024 },
        { moTa: '1024px: liên kết bỏ min-height', kiem: 'css', selector: '.menu a', thuocTinh: 'min-height', khop: '^(0(px)?|auto)$', beRong: 1024 },
        { moTa: 'Không max-width trong media query', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media[^{]*max-width', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Trang sản phẩm responsive trọn vẹn: 1 cột < 600px, 2 cột 600–899px, 3 cột + thanh lọc ≥ 900px',
      doKho: 'HARD', phut: 35,
      khaiNiem: ['thẻ viewport', 'mobile-first nhiều điểm ngắt', 'grid khung trang theo điểm ngắt', 'ẩn/hiện vùng', 'rem', 'kiểm ranh giới'],
      tienQuyet: ['toàn bộ Chương 3'],
      the: ['css', 'responsive', 'tong-hop', 'grid', 'media-query'],
      moTa: `<p>Bài tổng hợp của Chương 3: trang danh sách sản phẩm theo đặc tả của nhà thiết kế, đúng thứ tự quan trọng mà bài 3.5 liệt kê — viewport trước, bố cục điện thoại làm mặc định, thêm min-width khi màn rộng ra, và ngắt ở chỗ thiết kế vỡ (ở đây nhà thiết kế đã thử và chốt 600px, 900px). Máy chấm đo ở <strong>tám</strong> bề rộng, gồm cả bốn pixel ranh giới.</p>
${code(`
                 < 600px            600–899px           ≥ 900px
.khung           1 cột              1 cột               grid 240px 1fr, gap 1.5rem
.loc (thanh lọc) ẨN (display:none)  ẨN                  HIỆN (display:block)
.luoi            1 cột              repeat(2, 1fr)      repeat(3, 1fr)
h1               1.5rem             1.75rem             2rem
.o (thẻ)         padding 1rem       padding 1rem        padding 1.25rem
img              max-width 100%, height auto — mọi bề rộng
`)}`,
      yeuCau: [
        `Thêm thẻ viewport vào ${c('<head>')}.`,
        `Viết đúng bảng đặc tả theo mobile-first: kiểu nền = cột "< 600px", hai khối ${c('@media (min-width: 600px)')} và ${c('@media (min-width: 900px)')}.`,
        `Ranh giới chuẩn xác: 599px là điện thoại, 600px là 2 cột; 899px vẫn ẩn thanh lọc, 900px hiện.`,
        `Ảnh không tràn ở mọi bề rộng; cỡ chữ và padding dùng rem.`,
        `Không ${c('max-width')} trong media query, không ${c('!important')}.`,
      ],
      dauVao: 'index.html chưa có viewport; styles.css chỉ có màu sắc.',
      dauRa: 'Điện thoại: danh sách 1 cột, không thanh lọc · Tablet: 2 cột · Desktop: thanh lọc bên trái + lưới 3 cột.',
      rangBuoc: [
        'Mobile-first, chỉ min-width.',
        'Không !important, không px cho font-size/padding.',
        'Đúng 2 khối media query.',
      ],
      viDu: [{
        input: 'Màn 900px',
        output: '.khung = grid 240px 1fr → thanh lọc 240px bên trái, vùng sản phẩm bên phải\n.luoi = 3 cột trong vùng sản phẩm\nh1 = 32px',
        explanation: 'Cả hai khối media query cùng đúng; khối 900px đứng sau nên đè .luoi và h1 của khối 600px.',
      }],
      goiY: [
        'Dịch bảng theo cột: cột "< 600px" thành kiểu nền; cột giữa thành khối min-width: 600px (chỉ ghi ô KHÁC cột trước: .luoi, h1); cột phải thành khối min-width: 900px (.khung, .loc, .luoi, h1, .o).',
        'Ẩn/hiện: .loc { display: none; } ở nền, .loc { display: block; } trong khối 900px. Khung: .khung { display: grid; grid-template-columns: 240px 1fr; gap: 1.5rem; } trong khối 900px.',
      ],
      khoiDau: {
        'styles.css': `${BB}
/* Viết trang theo bảng đặc tả — mobile-first */
.loc { background: #f1f5f9; padding: 1rem; }
.o { border: 1px solid #e2e8f0; }
`,
        'index.html': TRANG('Sản phẩm', `    <h1>Bàn phím cơ</h1>
    <div class="khung">
      <aside class="loc">
        <h2>Bộ lọc</h2>
        <p>Giá · Thương hiệu · Kết nối</p>
      </aside>
      <div class="luoi">
        <div class="o"><img src="ban-phim-1.jpg" alt="Bàn phím cơ 87 phím, keycap trắng" width="800" height="600"><p>K87 — 890.000đ</p></div>
        <div class="o"><img src="ban-phim-2.jpg" alt="Bàn phím cơ không dây, đèn nền RGB" width="800" height="600"><p>K68 — 1.150.000đ</p></div>
        <div class="o"><img src="ban-phim-3.jpg" alt="Bàn phím cơ 104 phím, vỏ nhôm xám" width="800" height="600"><p>K104 — 1.490.000đ</p></div>
      </div>
    </div>`, false),
      },
      loiGiai: {
        'styles.css': `${BB}
/* ── KIỂU NỀN: điện thoại (< 600px) ─────────────────────────── */
img {
  max-width: 100%;   /* ảnh không bao giờ tràn */
  height: auto;
}
h1 { font-size: 1.5rem; }
.loc {
  display: none;     /* thanh lọc ẩn trên màn nhỏ */
  background: #f1f5f9;
  padding: 1rem;
}
.luoi {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.o {
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

/* ── TỪ 600px: chỉ ghi ô KHÁC cột trước ───────────────────── */
@media (min-width: 600px) {
  h1 { font-size: 1.75rem; }
  .luoi { grid-template-columns: repeat(2, 1fr); }
}

/* ── TỪ 900px: khung hai cột, hiện thanh lọc, lưới 3 cột ───── */
@media (min-width: 900px) {
  h1 { font-size: 2rem; }
  .khung {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 1.5rem;
  }
  .loc { display: block; }
  .luoi { grid-template-columns: repeat(3, 1fr); }
  .o { padding: 1.25rem; }
}
`,
        'index.html': TRANG('Sản phẩm', `    <h1>Bàn phím cơ</h1>
    <div class="khung">
      <aside class="loc">
        <h2>Bộ lọc</h2>
        <p>Giá · Thương hiệu · Kết nối</p>
      </aside>
      <div class="luoi">
        <div class="o"><img src="ban-phim-1.jpg" alt="Bàn phím cơ 87 phím, keycap trắng" width="800" height="600"><p>K87 — 890.000đ</p></div>
        <div class="o"><img src="ban-phim-2.jpg" alt="Bàn phím cơ không dây, đèn nền RGB" width="800" height="600"><p>K68 — 1.150.000đ</p></div>
        <div class="o"><img src="ban-phim-3.jpg" alt="Bàn phím cơ 104 phím, vỏ nhôm xám" width="800" height="600"><p>K104 — 1.490.000đ</p></div>
      </div>
    </div>`),
      },
      giaiThich: `<p>Bảng đặc tả là một hàm của bề rộng màn hình, và mobile-first là cách viết hàm đó gọn nhất: cột trái làm mặc định, mỗi cột sau chỉ ghi những ô <em>khác</em> cột trước nó. Khối 600px chỉ có hai dòng; khối 900px gánh phần thay đổi lớn (khung hai cột, hiện thanh lọc). Thứ tự hai khối là bắt buộc vì ở ≥ 900px cả hai cùng đúng.</p>
<p>Ẩn bằng ${c('display: none')} ở nền rồi hiện ở 900px là cách "chỉ thêm" đúng nghĩa — không cần gỡ gì ở màn lớn. Máy chấm đo tám bề rộng (360, 599, 600, 750, 899, 900, 1280 và cả ảnh ở 360) cho ${c('.luoi')}, ${c('.loc')}, ${c('.khung')}, h1 và padding thẻ; viewport và ảnh kiểm riêng. Đây cũng là nền của ${c('sm:')}/${c('md:')}/${c('lg:')} trong Tailwind mà bài 3.5 nhắc tới.</p>`,
      loiHayGap: [
        `Đặt ${c('.loc { display: none }')} trong media query max-width cho màn nhỏ — desktop-first lén quay lại.`,
        `Ở khối 600px lặp lại toàn bộ kiểu nền — dài gấp đôi, đổi một chỗ phải sửa ba chỗ.`,
        `Dùng ${c('min-width: 899px')} — ở đúng 899px thanh lọc hiện ra sớm một pixel.`,
        `Quên thẻ viewport — trên điện thoại thật mọi media query đo nhầm 980px, hiện bản desktop thu nhỏ.`,
      ],
      thamKhao: 'https://web.dev/learn/design/',
      kiem: [
        { moTa: 'Có meta viewport', kiem: 'thuoc-tinh', selector: 'head meta[name="viewport"]', thuocTinh: 'content', khop: 'width=device-width' },
        { moTa: 'Ảnh max-width 100%', kiem: 'css', selector: 'img', thuocTinh: 'max-width', giaTri: '100%', beRong: 360 },
        { moTa: '360px: lưới 1 cột', kiem: 'so-cot', selector: '.luoi', giaTri: 1, beRong: 360 },
        { moTa: '360px: thanh lọc ẩn', kiem: 'css', selector: '.loc', thuocTinh: 'display', giaTri: 'none', beRong: 360 },
        { moTa: '360px: h1 24px', kiem: 'css', selector: 'h1', thuocTinh: 'font-size', giaTri: '24px', beRong: 360 },
        { moTa: '599px: vẫn 1 cột', kiem: 'so-cot', selector: '.luoi', giaTri: 1, beRong: 599 },
        { moTa: '600px: 2 cột', kiem: 'so-cot', selector: '.luoi', giaTri: 2, beRong: 600 },
        { moTa: '750px: h1 28px', kiem: 'css', selector: 'h1', thuocTinh: 'font-size', giaTri: '28px', beRong: 750 },
        { moTa: '899px: thanh lọc vẫn ẩn', kiem: 'css', selector: '.loc', thuocTinh: 'display', giaTri: 'none', beRong: 899 },
        { moTa: '900px: thanh lọc hiện', kiem: 'css', selector: '.loc', thuocTinh: 'display', giaTri: 'block', beRong: 900 },
        { moTa: '900px: khung grid 240px 1fr', kiem: 'css', selector: '.khung', thuocTinh: 'grid-template-columns', khop: '^240px ', beRong: 900 },
        { moTa: '900px: lưới 3 cột', kiem: 'so-cot', selector: '.luoi', giaTri: 3, beRong: 900 },
        { moTa: '1280px: thẻ padding 20px (1.25rem)', kiem: 'css', selector: '.o', thuocTinh: 'padding-top', giaTri: '20px', beRong: 1280 },
        { moTa: '899px: lưới 2 cột', kiem: 'so-cot', selector: '.luoi', giaTri: 2, beRong: 899, an: true },
        { moTa: 'Mobile-first: không max-width trong media query, không !important', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media[^{]*max-width|!important', phuDinh: true },
        { moTa: 'Không px cho font-size/padding', kiem: 'ma-nguon', tep: 'styles.css', khop: '(font-size|padding)[\\w-]*\\s*:[^;]*\\dpx', phuDinh: true },
        { moTa: 'Đúng 2 khối media query, 600px rồi 900px', kiem: 'ma-nguon', tep: 'styles.css', khop: '^(?![\\s\\S]*(@media[\\s\\S]*){3})[\\s\\S]*@media\\s*\\(\\s*min-width\\s*:\\s*600px\\s*\\)[\\s\\S]*@media\\s*\\(\\s*min-width\\s*:\\s*900px\\s*\\)' },
      ],
    },
  ],
};
