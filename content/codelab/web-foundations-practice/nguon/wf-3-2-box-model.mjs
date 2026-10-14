/** Bộ luyện bài 3.2 — Box model. Lược đồ: ./_luoc-do.mjs */
import { c, code } from './_luoc-do.mjs';

const TRANG = (title, body) => `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
${body}
  </body>
</html>
`;

export default {
  slug: 'wf-3-2-box-model',
  ten: '3.2 Box model: mọi phần tử là một cái hộp',
  baiHoc: 'Nền tảng Web — Bài 3.2 Box model: mọi phần tử là một cái hộp',
  ngonNgu: 'css',
  level: 'BEGINNER',
  moTa: 'content / padding / border / margin, box-sizing: border-box, cú pháp rút gọn, margin dọc gộp, bẫy hai cột 50% — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Thẻ rộng đúng 300px dù có padding và viền',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['width chỉ tính content', 'box-sizing: border-box', 'bề rộng hiển thị'],
      tienQuyet: ['quy tắc CSS'],
      the: ['css', 'box-model', 'box-sizing'],
      moTa: `<p>Bài 3.2: <em>"Mặc định, ${c('width: 300px')} chỉ tính kích thước phần content. Trình duyệt rồi cộng thêm padding và border."</em> Nhà thiết kế cần thẻ hồ sơ rộng <strong>đúng 300px</strong> trên màn hình. Bạn đã viết ${c('width: 300px')} — DevTools đo ra 342px. Sửa bằng đúng một dòng mà bài học bảo "đặt ở đầu mọi bảng kiểu".</p>`,
      yeuCau: [
        `Thẻ ${c('.the')} có bề rộng hiển thị (gồm padding + viền) đúng <strong>300px</strong>.`,
        `Giữ nguyên ${c('width: 300px')}, ${c('padding: 20px')}, ${c('border: 1px solid #ddd')}.`,
        `Dùng quy tắc toàn cục ${c('*, *::before, *::after { box-sizing: border-box; }')} ở đầu tệp.`,
      ],
      dauVao: 'styles.css: .the { width: 300px; padding: 20px; border: 1px solid #ddd; }',
      dauRa: 'DevTools đo .the: 300 × … (trước khi sửa: 342 × …).',
      rangBuoc: [
        'Không đổi width thành 258px (tự trừ tay) — mục tiêu là học cách trình duyệt tính.',
        'Không bỏ padding hay viền.',
      ],
      viDu: [{
        input: '.the { width: 300px; padding: 20px; border: 1px solid #ddd; }',
        output: 'content-box (mặc định): 300 + 20×2 + 1×2 = 342px\nborder-box:              300px (content tự co còn 258px)',
        explanation: 'border-box đổi nghĩa của width: từ "bề rộng nội dung" thành "bề rộng cả hộp nhìn thấy".',
      }],
      goiY: [
        'Đừng tính tay. Có một thuộc tính đổi CÁCH trình duyệt hiểu width — bài 3.2 có nguyên một khối code cho nó.',
        'Thêm ở đầu styles.css: *, *::before, *::after { box-sizing: border-box; }',
      ],
      khoiDau: {
        'styles.css': `
.the {
  width: 300px;
  padding: 20px;
  border: 1px solid #ddd;
}
`,
        'index.html': TRANG('Hồ sơ', `    <div class="the">
      <h2>Minh</h2>
      <p>Sinh viên năm nhất, thích CSS.</p>
    </div>`),
      },
      loiGiai: {
        'styles.css': `
/* Đặt ở ĐẦU mọi bảng kiểu: width/height tính cả padding + border */
*, *::before, *::after {
  box-sizing: border-box;
}

.the {
  width: 300px;            /* với border-box: cả hộp nhìn thấy rộng 300px */
  padding: 20px;           /* lấy chỗ BÊN TRONG 300px */
  border: 1px solid #ddd;  /* cũng bên trong 300px ⇒ content còn 258px */
}
`,
        'index.html': TRANG('Hồ sơ', `    <div class="the">
      <h2>Minh</h2>
      <p>Sinh viên năm nhất, thích CSS.</p>
    </div>`),
      },
      giaiThich: `<p>Với ${c('content-box')} (mặc định), bề rộng hộp = width + padding hai bên + viền hai bên = 300 + 40 + 2 = 342. Với ${c('border-box')}, width <em>là</em> bề rộng hộp; trình duyệt tự thu content lại cho vừa (258px). Đó là lý do bài 3.2 gọi nó là "cuối cùng cũng dễ đoán".</p>
<p>Đặt cho ${c('*')} (và hai giả phần tử) để mọi hộp trong trang cùng một quy tắc — trộn hai kiểu tính trong một trang là nguồn lỗi bố cục khó thấy nhất. Máy chấm đo bề rộng hiển thị của thẻ (trình duyệt: ${c('getBoundingClientRect().width')}).</p>`,
      loiHayGap: [
        `Chỉ đặt ${c('box-sizing')} cho ${c('.the')} — chạy được ở bài này, nhưng mỗi thành phần mới lại phải nhớ thêm; quy tắc toàn cục là thói quen đúng.`,
        `Sửa thành ${c('width: 258px')} — đúng con số, sai cách: đổi padding là phải tính lại.`,
        `Viết ${c('box-sizing: border')} — giá trị không hợp lệ, bị bỏ qua lặng lẽ.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing',
      kiem: [
        { moTa: '.the rộng 300px trên màn hình', kiem: 'kich-thuoc', selector: '.the', thuocTinh: 'width', giaTri: 300 },
        { moTa: '.the có box-sizing: border-box', kiem: 'css', selector: '.the', thuocTinh: 'box-sizing', giaTri: 'border-box' },
        { moTa: 'Mọi phần tử border-box (quy tắc toàn cục)', kiem: 'css', selector: 'body, h2, p', thuocTinh: 'box-sizing', giaTri: 'border-box' },
        { moTa: 'Vẫn padding 20px', kiem: 'css', selector: '.the', thuocTinh: 'padding-left', giaTri: '20px' },
        { moTa: 'Vẫn viền 1px', kiem: 'css', selector: '.the', thuocTinh: 'border-right-width', giaTri: '1px' },
        { moTa: 'Vẫn width: 300px (không trừ tay)', kiem: 'css', selector: '.the', thuocTinh: 'width', giaTri: '300px' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Cú pháp rút gọn margin và padding: 1, 2 và 4 giá trị',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['margin/padding rút gọn', 'thứ tự trên-phải-dưới-trái', 'thuộc tính một cạnh'],
      tienQuyet: ['bốn lớp của hộp'],
      the: ['css', 'box-model', 'shorthand'],
      moTa: `<p>Bài 3.2:</p>
${code(`
margin: 10px;                 /* cả bốn cạnh */
margin: 10px 20px;            /* trên/dưới 10, trái/phải 20 */
margin: 10px 20px 30px 40px;  /* trên, phải, dưới, trái (theo chiều kim đồng hồ) */
padding-left: 8px;            /* chỉ một cạnh */
`)}
<p>Bảng kiểu dưới đây viết 12 dòng cho ba hộp. Viết lại mỗi hộp bằng <strong>đúng một</strong> dòng rút gọn, kết quả y hệt.</p>`,
      yeuCau: [
        `${c('.hop-a')}: margin 16px ở cả bốn cạnh — một dòng ${c('margin')}.`,
        `${c('.hop-b')}: padding trên/dưới 8px, trái/phải 24px — một dòng ${c('padding')} hai giá trị.`,
        `${c('.hop-c')}: margin trên 4px, phải 8px, dưới 12px, trái 16px — một dòng bốn giá trị.`,
        `Không còn thuộc tính một cạnh (${c('margin-top')}, ${c('padding-left')}…) trong styles.css.`,
      ],
      dauVao: 'styles.css 12 dòng margin-*/padding-*.',
      dauRa: 'Cùng khoảng cách, 3 dòng.',
      rangBuoc: [
        'Giá trị computed của từng cạnh giữ nguyên.',
      ],
      viDu: [{
        input: 'margin: 4px 8px 12px 16px;',
        output: 'margin-top 4px · margin-right 8px · margin-bottom 12px · margin-left 16px',
        explanation: 'Bốn giá trị đi theo chiều kim đồng hồ bắt đầu từ trên: Trên → Phải → Dưới → Trái (mẹo nhớ: "TRouBLe" — Top Right Bottom Left).',
      }],
      goiY: [
        'Hai giá trị = (trên/dưới) (trái/phải). Bốn giá trị = trên phải dưới trái.',
        '.hop-a { margin: 16px; } .hop-b { padding: 8px 24px; } .hop-c { margin: 4px 8px 12px 16px; }',
      ],
      khoiDau: {
        'styles.css': `
.hop-a {
  margin-top: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  margin-left: 16px;
}
.hop-b {
  padding-top: 8px;
  padding-right: 24px;
  padding-bottom: 8px;
  padding-left: 24px;
}
.hop-c {
  margin-top: 4px;
  margin-right: 8px;
  margin-bottom: 12px;
  margin-left: 16px;
}
`,
        'index.html': TRANG('Rút gọn', `    <div class="hop-a">Hộp A</div>
    <div class="hop-b">Hộp B</div>
    <div class="hop-c">Hộp C</div>`),
      },
      loiGiai: {
        'styles.css': `
/* 1 giá trị: cả bốn cạnh */
.hop-a { margin: 16px; }

/* 2 giá trị: trên/dưới 8px, trái/phải 24px */
.hop-b { padding: 8px 24px; }

/* 4 giá trị: trên, phải, dưới, trái — theo chiều kim đồng hồ */
.hop-c { margin: 4px 8px 12px 16px; }
`,
        'index.html': TRANG('Rút gọn', `    <div class="hop-a">Hộp A</div>
    <div class="hop-b">Hộp B</div>
    <div class="hop-c">Hộp C</div>`),
      },
      giaiThich: `<p>Thuộc tính rút gọn được trình duyệt "bung" ra thành bốn thuộc tính cạnh — DevTools tab Computed hiện đúng ${c('margin-top')}, ${c('margin-right')}… Vì vậy máy chấm đo từng cạnh computed: viết rút gọn hay viết dài đều ra cùng kết quả, chỉ khác độ dài tệp.</p>
<p>Còn dạng ba giá trị (${c('margin: 4px 8px 12px')} = trên, trái/phải, dưới) — ít dùng hơn và dễ nhầm, nên bài học bỏ qua. Ràng buộc "không còn thuộc tính một cạnh" kiểm trên mã nguồn để bạn thật sự luyện cú pháp rút gọn.</p>`,
      loiHayGap: [
        `Viết ${c('margin: 4px 16px 12px 8px')} — nhầm thứ tự thành trên–trái–dưới–phải.`,
        `Ngăn cách bằng dấu phẩy ${c('padding: 8px, 24px')} — sai cú pháp, cả dòng bị bỏ.`,
        `Viết ${c('padding: 24px 8px')} — đảo nghĩa: trên/dưới 24, trái/phải 8.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin',
      kiem: [
        { moTa: '.hop-a margin 16px cả bốn cạnh', kiem: 'css', selector: '.hop-a', thuocTinh: 'margin-left', giaTri: '16px' },
        { moTa: '.hop-a margin-top 16px', kiem: 'css', selector: '.hop-a', thuocTinh: 'margin-top', giaTri: '16px' },
        { moTa: '.hop-b padding trên 8px', kiem: 'css', selector: '.hop-b', thuocTinh: 'padding-top', giaTri: '8px' },
        { moTa: '.hop-b padding phải 24px', kiem: 'css', selector: '.hop-b', thuocTinh: 'padding-right', giaTri: '24px' },
        { moTa: '.hop-c margin phải 8px', kiem: 'css', selector: '.hop-c', thuocTinh: 'margin-right', giaTri: '8px' },
        { moTa: '.hop-c margin dưới 12px', kiem: 'css', selector: '.hop-c', thuocTinh: 'margin-bottom', giaTri: '12px' },
        { moTa: '.hop-c margin trái 16px', kiem: 'css', selector: '.hop-c', thuocTinh: 'margin-left', giaTri: '16px' },
        { moTa: 'Không còn thuộc tính một cạnh', kiem: 'ma-nguon', tep: 'styles.css', khop: '(margin|padding)-(top|right|bottom|left)\\s*:', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Khoảng cách giữa các thẻ bằng margin, không bằng <br>',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['margin là khoảng hở tới hàng xóm', 'padding là khoảng trống bên trong', 'tách nội dung và trình bày'],
      tienQuyet: ['bốn lớp của hộp'],
      the: ['css', 'box-model', 'margin', 'padding'],
      moTa: `<p>Mẹo nhớ của bài 3.2: <em>"padding là lớp bông độn bên trong áo khoác; margin là khoảng bạn đứng cách người khác."</em> Danh sách thông báo dưới đây tạo khoảng cách bằng các ${c('<br><br>')} chèn giữa các thẻ, và nội dung dính sát viền. Bỏ ${c('<br>')} và dùng đúng lớp của hộp cho từng loại khoảng trống.</p>`,
      yeuCau: [
        `Xoá mọi ${c('<br>')} trong index.html.`,
        `Mỗi ${c('.thong-bao')} cách thẻ kế tiếp 24px: ${c('margin-bottom: 24px')}.`,
        `Chữ cách viền thẻ 16px mọi phía: ${c('padding: 16px')}.`,
        `Thẻ có viền ${c('1px solid #cbd5e1')}.`,
      ],
      dauVao: 'Ba div.thong-bao xen kẽ <br><br>; styles.css chỉ có viền.',
      dauRa: 'Ba thẻ cách nhau đều 24px, chữ không dính viền.',
      rangBuoc: [
        'Không dùng <br> hay <p>&nbsp;</p> để tạo khoảng.',
        'Khoảng cách giữa thẻ là margin; khoảng đệm trong thẻ là padding.',
      ],
      viDu: [{
        input: '.thong-bao { padding: 16px; margin-bottom: 24px; border: 1px solid #cbd5e1; }',
        output: '┌──────────────┐\n│  (16px)      │\n│  Nội dung    │\n└──────────────┘\n      (24px)\n┌──────────────┐',
        explanation: 'padding nằm trong viền (mang màu nền của thẻ), margin nằm ngoài (luôn trong suốt).',
      }],
      goiY: [
        'Khoảng giữa hai thẻ là "đứng cách người khác" ⇒ margin. Khoảng giữa chữ và viền là "bông độn" ⇒ padding.',
        'Xoá các <br>, thêm vào .thong-bao: padding: 16px; margin-bottom: 24px;',
      ],
      khoiDau: {
        'styles.css': `
.thong-bao {
  border: 1px solid #cbd5e1;
}
`,
        'index.html': TRANG('Thông báo', `    <h1>Thông báo</h1>
    <div class="thong-bao">Lịch thi giữa kỳ đã có.</div>
    <br><br>
    <div class="thong-bao">Nộp bài tập lớn trước 23:59 thứ Sáu.</div>
    <br><br>
    <div class="thong-bao">Phòng 204 đổi sang phòng 306.</div>`),
      },
      loiGiai: {
        'styles.css': `
.thong-bao {
  border: 1px solid #cbd5e1;
  padding: 16px;        /* bông độn: chữ cách viền 16px, bên TRONG viền */
  margin-bottom: 24px;  /* đứng cách người khác: thẻ kế tiếp cách 24px, bên NGOÀI viền */
}
`,
        'index.html': TRANG('Thông báo', `    <h1>Thông báo</h1>
    <!-- không còn <br>: khoảng cách là việc của CSS -->
    <div class="thong-bao">Lịch thi giữa kỳ đã có.</div>
    <div class="thong-bao">Nộp bài tập lớn trước 23:59 thứ Sáu.</div>
    <div class="thong-bao">Phòng 204 đổi sang phòng 306.</div>`),
      },
      giaiThich: `<p>${c('<br><br>')} trộn trình bày vào nội dung: đổi khoảng cách là phải sửa HTML ở mọi chỗ, và khoảng cách phụ thuộc cỡ chữ của dòng trống. Margin thì nằm một chỗ trong CSS, chính xác từng pixel.</p>
<p>Chọn đúng lớp quan trọng khi thẻ có nền: padding mang màu nền của thẻ (khoảng đệm "thuộc về" thẻ), margin luôn trong suốt (khoảng trống "giữa" các thẻ). Máy chấm kiểm không còn ${c('<br>')}, và đo padding/margin computed.</p>`,
      loiHayGap: [
        `Dùng ${c('padding-bottom: 24px')} để tách thẻ — khoảng trống nằm TRONG viền, thẻ trông cao bất thường.`,
        `Dùng ${c('margin: 16px')} cho chữ cách viền — margin ở ngoài viền, chữ vẫn dính viền.`,
        `Thay ${c('<br>')} bằng ${c('<div class="cach"></div>')} rỗng — vẫn là chèn phần tử chỉ để tạo khoảng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
      kiem: [
        { moTa: 'Không còn <br>', kiem: 'khong-ton-tai', selector: 'br' },
        { moTa: '.thong-bao padding 16px', kiem: 'css', selector: '.thong-bao', thuocTinh: 'padding-top', giaTri: '16px' },
        { moTa: '.thong-bao padding trái 16px', kiem: 'css', selector: '.thong-bao', thuocTinh: 'padding-left', giaTri: '16px' },
        { moTa: '.thong-bao margin-bottom 24px', kiem: 'css', selector: '.thong-bao', thuocTinh: 'margin-bottom', giaTri: '24px' },
        { moTa: 'Viền 1px #cbd5e1', kiem: 'css', selector: '.thong-bao', thuocTinh: 'border-top-color', giaTri: 'rgb(203, 213, 225)' },
        { moTa: 'Không có phần tử rỗng chèn để tạo khoảng', kiem: 'khong-ton-tai', selector: 'body div:empty, body p:empty' },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Đọc sơ đồ hộp của DevTools rồi viết lại CSS sinh ra nó',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['sơ đồ box model DevTools', 'content-box', 'tính bề rộng hiển thị', 'padding 2 giá trị'],
      tienQuyet: ['bốn lớp', 'rút gọn'],
      the: ['css', 'box-model', 'devtools'],
      moTa: `<p>Bài 3.2: <em>"Mở DevTools (F12) → Elements → chọn một phần tử, bạn sẽ thấy đúng sơ đồ hộp này với bốn lớp được tô màu."</em> Đồng nghiệp gửi ảnh chụp sơ đồ hộp của một chiếc nút trên site cũ (không có mã nguồn). Viết CSS cho ${c('.nut')} tạo ra <strong>đúng</strong> sơ đồ này. Trang này KHÔNG dùng border-box — để bạn luyện cách tính mặc định.</p>
${code(`
┌──────────────────── margin 16 ────────────────────┐
│   ┌──────────────── border 2 ────────────────┐    │
│   │   ┌──────── padding 12 / 24 ─────────┐   │    │
│   │   │                                  │   │    │
│   │   │      content   200 × 24          │   │    │
│   │   │                                  │   │    │
│   │   └──────────────────────────────────┘   │    │
│   └──────────────────────────────────────────┘    │
└───────────────────────────────────────────────────┘
padding: trên/dưới 12, trái/phải 24 · viền 2px solid #0f766e
`)}`,
      yeuCau: [
        `${c('.nut')} có content rộng 200px, cao 24px (${c('box-sizing')} mặc định ${c('content-box')}).`,
        `padding trên/dưới 12px, trái/phải 24px (một dòng rút gọn).`,
        `Viền ${c('2px solid #0f766e')}; margin 16px bốn cạnh.`,
        `Ghi trong chú thích: bề rộng hiển thị của nút là bao nhiêu px (và máy chấm sẽ đo đúng con số đó).`,
      ],
      dauVao: 'index.html có <button class="nut">; styles.css trống.',
      dauRa: 'DevTools hiện đúng sơ đồ trên; bề rộng hiển thị (viền tới viền) = 200 + 24×2 + 2×2 = 252px.',
      rangBuoc: [
        'Không dùng border-box ở bài này.',
        'Nút là <button> — đặt display: block để width/height áp như hộp khối.',
      ],
      viDu: [{
        input: 'content 200 · padding 24 hai bên · viền 2 hai bên',
        output: 'Bề rộng hiển thị = 200 + 48 + 4 = 252px\nKhông tính margin (16) — margin nằm ngoài viền, không thuộc kích thước phần tử.',
        explanation: 'getBoundingClientRect đo từ mép ngoài viền này tới mép ngoài viền kia.',
      }],
      goiY: [
        'Với content-box, width/height chính là ô "content" trong sơ đồ. Mỗi lớp còn lại là một thuộc tính.',
        '.nut { display: block; width: 200px; height: 24px; padding: 12px 24px; border: 2px solid #0f766e; margin: 16px; }',
      ],
      khoiDau: {
        'styles.css': `
/* Viết CSS cho .nut theo sơ đồ hộp trong đề */
`,
        'index.html': TRANG('Nút', `    <button type="button" class="nut">Đăng ký</button>`),
      },
      loiGiai: {
        'styles.css': `
/* content-box (mặc định): width/height = ô content trong sơ đồ */
.nut {
  display: block;               /* button mặc định inline-block; block cho rõ kích thước hộp */
  box-sizing: content-box;      /* nói rõ: bài này tính kiểu mặc định */
  width: 200px;                 /* content rộng 200 */
  height: 24px;                 /* content cao 24 */
  padding: 12px 24px;           /* trên/dưới 12, trái/phải 24 */
  border: 2px solid #0f766e;
  margin: 16px;                 /* ngoài viền — không tính vào kích thước */
}
/* Bề rộng hiển thị = 200 + 24×2 + 2×2 = 252px
   Chiều cao hiển thị = 24 + 12×2 + 2×2 = 52px */
`,
        'index.html': TRANG('Nút', `    <button type="button" class="nut">Đăng ký</button>`),
      },
      giaiThich: `<p>Đọc sơ đồ từ trong ra: content (width/height), padding, border, margin — đúng thứ tự bốn lớp của bài 3.2. Với content-box, mỗi lớp cộng dồn vào kích thước hiển thị trừ margin: 200 + 48 + 4 = 252 ngang, 24 + 24 + 4 = 52 dọc.</p>
<p>Lưu ý nhỏ: ${c('<button>')} có vài kiểu mặc định của trình duyệt (padding, viền, và ở một số trình duyệt là ${c('box-sizing: border-box')}!) — nên lời giải ghi rõ ${c('box-sizing: content-box')} và đặt đủ padding/viền thay vì tin mặc định. Máy chấm đo bề rộng 252 và chiều cao 52.</p>`,
      loiHayGap: [
        `Đặt ${c('width: 252px')} — nhầm ô content với hộp hiển thị.`,
        `Cộng margin vào bề rộng (284px) — margin không thuộc kích thước phần tử.`,
        `Không ghi ${c('box-sizing: content-box')} trong khi trang có quy tắc ${c('* { box-sizing: border-box }')} ở chỗ khác — nút co còn 200px.`,
      ],
      thamKhao: 'https://developer.chrome.com/docs/devtools/css/reference#box-model',
      kiem: [
        { moTa: 'Nút dùng content-box', kiem: 'css', selector: '.nut', thuocTinh: 'box-sizing', giaTri: 'content-box' },
        { moTa: 'Bề rộng hiển thị 252px', kiem: 'kich-thuoc', selector: '.nut', thuocTinh: 'width', giaTri: 252 },
        { moTa: 'Chiều cao hiển thị 52px', kiem: 'kich-thuoc', selector: '.nut', thuocTinh: 'height', giaTri: 52 },
        { moTa: 'padding trên 12px', kiem: 'css', selector: '.nut', thuocTinh: 'padding-top', giaTri: '12px' },
        { moTa: 'padding trái 24px', kiem: 'css', selector: '.nut', thuocTinh: 'padding-left', giaTri: '24px' },
        { moTa: 'Viền 2px màu #0f766e', kiem: 'css', selector: '.nut', thuocTinh: 'border-top-color', giaTri: 'rgb(15, 118, 110)' },
        { moTa: 'margin 16px', kiem: 'css', selector: '.nut', thuocTinh: 'margin-bottom', giaTri: '16px' },
        { moTa: 'Có chú thích ghi bề rộng 252', kiem: 'ma-nguon', tep: 'styles.css', khop: '/\\*[^*]*252', giuChuThich: true },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Margin dọc gộp: vì sao 20 + 20 chỉ ra 20, và cách lấy đúng 40px',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['margin dọc gộp (collapse)', 'lấy cái lớn hơn', 'chỉ margin một chiều'],
      tienQuyet: ['margin'],
      the: ['css', 'box-model', 'margin-collapse'],
      moTa: `<p>Bài 3.2: <em>"Khi hai phần tử xếp chồng mỗi cái có margin dọc, trình duyệt dùng cái lớn hơn, không phải tổng."</em> Nhà thiết kế muốn các mục tin cách nhau <strong>40px</strong>. Bạn viết ${c('.muc { margin: 20px 0; }')} và tính "20 dưới + 20 trên = 40". Đo ra 20. Sửa sao cho khoảng giữa hai mục liền nhau đúng 40px, theo cách dễ đoán nhất: margin chỉ theo <em>một</em> chiều.</p>`,
      yeuCau: [
        `Khoảng hở giữa hai ${c('.muc')} liền nhau là 40px.`,
        `Chỉ dùng ${c('margin-bottom')} để tạo khoảng: ${c('margin-top')} của ${c('.muc')} bằng 0.`,
        `Ghi chú thích giải thích vì sao bản cũ chỉ ra 20px.`,
      ],
      dauVao: '.muc { margin: 20px 0; padding: 12px; border: 1px solid #e2e8f0; }',
      dauRa: 'Ba mục cách nhau 40px.',
      rangBuoc: [
        'Không dùng padding hay phần tử rỗng để bù khoảng.',
        'Không dùng flex/grid gap (học ở 3.3–3.4).',
      ],
      viDu: [{
        input: 'mục 1: margin-bottom 20px\nmục 2: margin-top 20px',
        output: 'Khoảng hở = max(20, 20) = 20px (không phải 40)',
        explanation: 'Hai margin dọc chạm nhau thì gộp làm một, lấy cái lớn hơn.',
      }, {
        input: 'mục 1: margin-bottom 40px\nmục 2: margin-top 0',
        output: 'Khoảng hở = max(40, 0) = 40px',
        explanation: 'Chỉ một phía có margin ⇒ không còn gì để gộp ⇒ kết quả đúng như viết.',
      }],
      goiY: [
        'Nếu cả hai phía đều có margin, chúng gộp. Vậy hãy để chỉ MỘT phía có margin.',
        '.muc { margin: 0 0 40px; } — trên 0, trái/phải 0, dưới 40.',
      ],
      khoiDau: {
        'styles.css': `
.muc {
  margin: 20px 0;   /* "20 + 20 = 40"? */
  padding: 12px;
  border: 1px solid #e2e8f0;
}
`,
        'index.html': TRANG('Tin mới', `    <h1>Tin mới</h1>
    <div class="muc">Khai giảng khoá Nền tảng Web.</div>
    <div class="muc">Hackathon F-Code 25/10.</div>
    <div class="muc">Thư viện mở cửa đến 22:00.</div>`),
      },
      loiGiai: {
        'styles.css': `
/* Bản cũ: margin 20px trên VÀ dưới. Giữa hai mục, margin-bottom (20) của mục trên chạm
   margin-top (20) của mục dưới ⇒ margin dọc GỘP, lấy cái lớn hơn: max(20, 20) = 20px.
   Cách dễ đoán: margin chỉ theo MỘT chiều (xuống dưới) ⇒ không còn gì để gộp. */
.muc {
  margin: 0 0 40px;   /* trên 0 · trái/phải 0 · dưới 40 */
  padding: 12px;
  border: 1px solid #e2e8f0;
}
`,
        'index.html': TRANG('Tin mới', `    <h1>Tin mới</h1>
    <div class="muc">Khai giảng khoá Nền tảng Web.</div>
    <div class="muc">Hackathon F-Code 25/10.</div>
    <div class="muc">Thư viện mở cửa đến 22:00.</div>`),
      },
      giaiThich: `<p>Gộp margin là hành vi có chủ đích (để đoạn văn liền nhau không cách gấp đôi), chỉ áp cho margin <em>dọc</em> của các khối xếp chồng. Nhiều đội CSS đặt luật "margin chỉ đi một chiều — xuống dưới" chính vì nó khiến khoảng cách luôn bằng đúng con số đã viết.</p>
<p>jsdom (bộ chạy thử) không dựng bố cục nên máy chấm kiểm giá trị margin computed (trên 0, dưới 40) thay vì đo khoảng hở; trình duyệt đợt 2 đo được cả khoảng hở thật.</p>`,
      loiHayGap: [
        `Đặt ${c('margin: 40px 0')} — gộp thành max(40, 40) = 40, đúng con số giữa các mục nhưng mục đầu cách tiêu đề 40 và vẫn hiểu sai cơ chế.`,
        `Bù bằng ${c('padding-bottom: 20px')} — khoảng hở nằm trong viền, thẻ phình ra.`,
        `Nghĩ margin ngang cũng gộp — margin ngang không bao giờ gộp.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing',
      kiem: [
        { moTa: '.muc margin-top 0', kiem: 'css', selector: '.muc', thuocTinh: 'margin-top', khop: '^0(px)?$' },
        { moTa: '.muc margin-bottom 40px', kiem: 'css', selector: '.muc', thuocTinh: 'margin-bottom', giaTri: '40px' },
        { moTa: 'Không dùng padding để bù (padding vẫn 12px)', kiem: 'css', selector: '.muc', thuocTinh: 'padding-bottom', giaTri: '12px' },
        { moTa: 'Không có phần tử rỗng chèn để tạo khoảng', kiem: 'khong-ton-tai', selector: 'body div:empty, br' },
        { moTa: 'Có chú thích giải thích việc gộp margin', kiem: 'ma-nguon', tep: 'styles.css', khop: '/\\*[\\s\\S]*(gộp|collapse)[\\s\\S]*\\*/', giuChuThich: true },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Hai cột 50% không nằm cạnh nhau nổi: sửa bẫy content-box',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['width phần trăm', 'padding cộng thêm vào %', 'box-sizing toàn cục', 'bố cục vỡ không báo lỗi'],
      tienQuyet: ['box-sizing'],
      the: ['css', 'box-model', 'percent', 'layout-bug'],
      moTa: `<p>Bẫy cuối bài 3.2: <em>"Hai cột ${c('width: 50%')} mà không nằm cạnh nhau nổi. Cho mỗi cái ${c('padding: 20px')}, thì mỗi cái thật ra rộng 50% + 40px — nên cộng lại vượt quá 100% và cái thứ hai rớt xuống hàng riêng."</em> Hàng hai cột dưới đây nằm trong khung 800px (phần ${c('display: flex')} + ${c('flex-wrap')} đã viết sẵn — bạn sẽ học ở bài 3.3). Sửa để hai cột nằm cạnh nhau, <strong>mỗi cột đúng 400px</strong>, giữ nguyên padding và viền.</p>`,
      yeuCau: [
        `Mỗi ${c('.cot')} rộng hiển thị đúng 400px (một nửa của 800px).`,
        `Giữ ${c('width: 50%')}, ${c('padding: 20px')}, ${c('border: 1px solid #94a3b8')}.`,
        `Sửa bằng quy tắc ${c('box-sizing')} toàn cục ở đầu tệp, không trừ tay.`,
        `Không sửa ${c('.hang')}.`,
      ],
      dauVao: 'styles.css: .hang (800px, flex, wrap) + .cot (50%, padding 20, viền 1) — cột 2 rớt dòng.',
      dauRa: 'Hai cột cạnh nhau, mỗi cột 400px.',
      rangBuoc: [
        'Không dùng calc(), không đổi 50% thành số khác.',
        'Không bỏ flex-wrap.',
      ],
      viDu: [{
        input: '.hang { width: 800px } · .cot { width: 50%; padding: 20px; border: 1px }',
        output: 'content-box: mỗi cột = 400 + 40 + 2 = 442px ⇒ 884 > 800 ⇒ cột 2 rớt xuống\nborder-box:  mỗi cột = 400px ⇒ 800 = 800 ⇒ vừa một hàng',
        explanation: 'Phần trăm tính trên bề rộng nội dung của cha; padding và viền cộng THÊM (content-box) hoặc nằm TRONG (border-box).',
      }],
      goiY: [
        'Đây chính là ví dụ "không lỗi nào cả; bố cục chỉ đơn giản là vỡ" của bài 3.2 — cách chữa một dòng ở đầu bảng kiểu.',
        '*, *::before, *::after { box-sizing: border-box; }',
      ],
      khoiDau: {
        'styles.css': `
/* đã có sẵn — KHÔNG sửa .hang (flexbox học ở bài 3.3) */
.hang {
  display: flex;
  flex-wrap: wrap;
  width: 800px;
}

.cot {
  width: 50%;
  padding: 20px;
  border: 1px solid #94a3b8;
}
`,
        'index.html': TRANG('Hai cột', `    <div class="hang">
      <div class="cot">Cột trái: giới thiệu khoá học.</div>
      <div class="cot">Cột phải: lịch học và học phí.</div>
    </div>`),
      },
      loiGiai: {
        'styles.css': `
/* MỘT dòng chữa bẫy: width (kể cả %) tính cả padding + viền */
*, *::before, *::after {
  box-sizing: border-box;
}

/* đã có sẵn — KHÔNG sửa .hang (flexbox học ở bài 3.3) */
.hang {
  display: flex;
  flex-wrap: wrap;
  width: 800px;
}

.cot {
  width: 50%;                   /* 50% của 800 = 400px — giờ là bề rộng CẢ HỘP */
  padding: 20px;                /* nằm trong 400px */
  border: 1px solid #94a3b8;    /* nằm trong 400px */
}
`,
        'index.html': TRANG('Hai cột', `    <div class="hang">
      <div class="cot">Cột trái: giới thiệu khoá học.</div>
      <div class="cot">Cột phải: lịch học và học phí.</div>
    </div>`),
      },
      giaiThich: `<p>Phần trăm là thứ khiến bẫy này nguy hiểm: ${c('50%')} trông như "một nửa", nhưng với content-box nó chỉ là một nửa <em>phần nội dung</em>, padding và viền vẫn cộng thêm. Ở khung 800px, mỗi cột thành 442px, tổng 884px, cột hai rớt dòng. Ở khung khác nhau thì số khác nhau — nên lỗi chỉ hiện ở vài độ rộng màn hình và trông như lỗi responsive.</p>
<p>${c('border-box')} khiến 50% nghĩa là 50% của cả hộp nhìn thấy. Máy chấm đo bề rộng hiển thị từng cột (400px) và kiểm giá trị khai báo vẫn là 50%.</p>`,
      loiHayGap: [
        `Đổi thành ${c('width: 45%')} — vừa ở 800px, vỡ lại ở khung khác.`,
        `Dùng ${c('calc(50% - 42px)')} — đúng nhưng phải sửa lại mỗi lần đổi padding.`,
        `Bỏ ${c('flex-wrap')} để ép hai cột cùng hàng — flex co cột lại, che mất lỗi thay vì sửa nó.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model#the_alternative_css_box_model',
      kiem: [
        { moTa: 'Mỗi cột rộng 400px', kiem: 'kich-thuoc', selector: '.cot', thuocTinh: 'width', giaTri: 400 },
        { moTa: 'Cột dùng border-box', kiem: 'css', selector: '.cot', thuocTinh: 'box-sizing', giaTri: 'border-box' },
        { moTa: 'Quy tắc toàn cục: body cũng border-box', kiem: 'css', selector: 'body', thuocTinh: 'box-sizing', giaTri: 'border-box' },
        { moTa: 'Vẫn width: 50%', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\.cot\\s*\\{[^}]*width:\\s*50%' },
        { moTa: 'Vẫn padding 20px', kiem: 'css', selector: '.cot', thuocTinh: 'padding-right', giaTri: '20px' },
        { moTa: 'Không dùng calc()', kiem: 'ma-nguon', tep: 'styles.css', khop: 'calc\\(', phuDinh: true },
        { moTa: '.hang giữ flex-wrap: wrap', kiem: 'css', selector: '.hang', thuocTinh: 'flex-wrap', giaTri: 'wrap' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Ba thẻ vừa khít khung 960px: tự tính width từ margin, padding và viền',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['tính toán box model', 'margin ngang không gộp', 'border-box hấp thụ viền', 'kích thước dễ đoán'],
      tienQuyet: ['toàn bộ bài 3.2'],
      the: ['css', 'box-model', 'calculation'],
      moTa: `<p>Khung ${c('.hang')} rộng 960px, xếp ba ${c('.the')} trên một hàng (flex đã viết sẵn, không cho co giãn). Mỗi thẻ có ${c('padding: 24px')}, viền ${c('2px')}, và ${c('margin: 0 10px')} để tạo khoảng hở. Thẻ thứ hai là thẻ nổi bật với viền dày ${c('4px')}. Yêu cầu của thiết kế: ba thẻ <strong>lấp đúng</strong> 960px, ba thẻ <strong>rộng bằng nhau</strong> kể cả thẻ viền dày. Bạn phải tự tính ${c('width')} — không calc(), không flex: 1.</p>
${code(`
|←10→|←── thẻ ──→|←10→|←10→|←── thẻ ──→|←10→|←10→|←── thẻ ──→|←10→|
|<───────────────────────────── 960px ─────────────────────────────>|
`)}`,
      yeuCau: [
        `Ba thẻ rộng hiển thị bằng nhau, và tổng (thẻ + margin) = 960px.`,
        `Ghi phép tính width trong chú thích.`,
        `Thẻ ${c('.noi-bat')} có ${c('border-width: 4px')} mà <strong>vẫn</strong> rộng bằng hai thẻ kia — không viết width riêng cho nó.`,
        `Không ${c('calc()')}, không ${c('flex')}/${c('flex-grow')} trên ${c('.the')}.`,
      ],
      dauVao: '.hang (960px, flex, nowrap, các thẻ không co) — .the chưa có width.',
      dauRa: 'Ba thẻ mỗi thẻ 300px, cách mép và cách nhau đều nhau, thẻ giữa viền dày vẫn 300px.',
      rangBuoc: [
        'Không calc(), không flex trên .the, không width riêng cho .noi-bat.',
        'margin 0 10px giữ nguyên.',
      ],
      viDu: [{
        input: 'content-box, width: 276px',
        output: 'thẻ thường: 276 + 48 + 4 = 328 ⇒ 3 × (328 + 20) = 1044 > 960 ✗\nthẻ nổi bật: 276 + 48 + 8 = 332 ⇒ to hơn hai thẻ kia ✗',
        explanation: 'Với content-box, mọi thay đổi padding/viền làm đổi kích thước — và đổi viền một thẻ làm lệch cả hàng.',
      }],
      goiY: [
        'Margin ngang KHÔNG gộp (gộp chỉ áp cho margin dọc). Tổng margin của một thẻ là 10 + 10 = 20 ⇒ phần còn lại cho 3 thẻ: 960 − 3×20 = 900.',
        'Với border-box, width là bề rộng hộp ⇒ width = 900 / 3 = 300px, và viền 4px của thẻ nổi bật nằm TRONG 300px — content của nó tự co lại 4px.',
      ],
      khoiDau: {
        'styles.css': `
/* đã có sẵn — không sửa */
.hang {
  display: flex;
  width: 960px;
}

.the {
  flex-shrink: 0;            /* không cho flex co thẻ — kích thước do bạn tính */
  padding: 24px;
  border: 2px solid #cbd5e1;
  margin: 0 10px;
  /* width: ? */
}

.the.noi-bat {
  border-width: 4px;
  border-color: #f59e0b;
}
`,
        'index.html': TRANG('Gói học', `    <div class="hang">
      <div class="the">Gói Cơ bản</div>
      <div class="the noi-bat">Gói Pro — phổ biến nhất</div>
      <div class="the">Gói Nhóm</div>
    </div>`),
      },
      loiGiai: {
        'styles.css': `
/* border-box: width = bề rộng cả hộp, padding + viền nằm bên trong */
*, *::before, *::after {
  box-sizing: border-box;
}

/* đã có sẵn — không sửa */
.hang {
  display: flex;
  width: 960px;
}

/* Phép tính:
   - margin ngang KHÔNG gộp: mỗi thẻ chiếm thêm 10 + 10 = 20px
   - 3 thẻ ⇒ 3 × 20 = 60px margin
   - còn lại cho 3 hộp: 960 − 60 = 900px ⇒ mỗi hộp 900 / 3 = 300px
   - border-box ⇒ width: 300px là bề rộng hộp, bất kể padding/viền */
.the {
  flex-shrink: 0;
  width: 300px;
  padding: 24px;
  border: 2px solid #cbd5e1;
  margin: 0 10px;
}

/* viền 4px nằm TRONG 300px (content tự co còn 300 − 48 − 8 = 244px)
   ⇒ không cần width riêng, thẻ vẫn bằng hai thẻ kia */
.the.noi-bat {
  border-width: 4px;
  border-color: #f59e0b;
}
`,
        'index.html': TRANG('Gói học', `    <div class="hang">
      <div class="the">Gói Cơ bản</div>
      <div class="the noi-bat">Gói Pro — phổ biến nhất</div>
      <div class="the">Gói Nhóm</div>
    </div>`),
      },
      giaiThich: `<p>Hai sự thật của bài 3.2 ghép lại: (1) margin <em>ngang</em> không gộp, nên 3 thẻ × 20px margin = 60px đã mất; (2) với border-box, width là cả hộp, nên 900 / 3 = 300px là đáp số trọn vẹn, không phải trừ thêm padding hay viền.</p>
<p>Điểm hay nhất là thẻ nổi bật: đổi viền 2 → 4px thì với content-box nó phình 4px và kéo lệch cả hàng; với border-box nó giữ 300px, chỉ phần content co lại. "Kích thước dễ đoán" nghĩa là vậy — thiết kế đổi chi tiết mà bố cục không vỡ. Máy chấm đo bề rộng từng thẻ (ước lượng trong Node, đo thật trong trình duyệt), margin, và cấm calc/flex trên thẻ.</p>`,
      loiHayGap: [
        `Tính margin gộp thành 10px giữa hai thẻ (như margin dọc) ⇒ width 306.67 — margin ngang không gộp.`,
        `Viết ${c('.noi-bat { width: 296px }')} để bù viền — đúng với content-box, nhưng là việc border-box làm giùm.`,
        `Dùng ${c('flex: 1')} — ra đúng kích thước nhưng bỏ qua toàn bộ bài học tính toán (đề cấm).`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Sizing_items_in_CSS',
      kiem: [
        { moTa: 'Mọi thẻ rộng 300px (kể cả thẻ viền dày)', kiem: 'kich-thuoc', selector: '.the', thuocTinh: 'width', giaTri: 300 },
        { moTa: 'Thẻ nổi bật rộng 300px', kiem: 'kich-thuoc', selector: '.the.noi-bat', thuocTinh: 'width', giaTri: 300 },
        { moTa: 'Thẻ nổi bật viền 4px', kiem: 'css', selector: '.the.noi-bat', thuocTinh: 'border-left-width', giaTri: '4px' },
        { moTa: 'margin trái/phải 10px', kiem: 'css', selector: '.the', thuocTinh: 'margin-right', giaTri: '10px' },
        { moTa: 'Thẻ dùng border-box', kiem: 'css', selector: '.the', thuocTinh: 'box-sizing', giaTri: 'border-box' },
        { moTa: 'Không calc()', kiem: 'ma-nguon', tep: 'styles.css', khop: 'calc\\(', phuDinh: true },
        { moTa: 'Không flex/flex-grow trên .the', kiem: 'css', selector: '.the', thuocTinh: 'flex-grow', giaTri: '0' },
        { moTa: 'Không width riêng cho .noi-bat', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\.noi-bat\\s*\\{[^}]*[{;\\s]width\\s*:', phuDinh: true },
        { moTa: 'Có chú thích phép tính (960, 900 hoặc 300)', kiem: 'ma-nguon', tep: 'styles.css', khop: '/\\*[\\s\\S]*960[\\s\\S]*300[\\s\\S]*\\*/', giuChuThich: true },
      ],
    },
  ],
};
