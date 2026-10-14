/** Bộ luyện bài 3.4 — CSS Grid. Lược đồ: ./_luoc-do.mjs */
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

const BB = `*, *::before, *::after { box-sizing: border-box; }
`;
const THE = (n, ten = 'Ảnh') => Array.from({ length: n }, (_, i) => `      <div class="o">${ten} ${i + 1}</div>`).join('\n');

export default {
  slug: 'wf-3-4-css-grid',
  ten: '3.4 CSS Grid: dàn trang hai chiều',
  baiHoc: 'Nền tảng Web — Bài 3.4 CSS Grid: dàn trang hai chiều',
  ngonNgu: 'css',
  level: 'BEGINNER',
  moTa: 'display: grid, grid-template-columns, đơn vị fr, repeat(), cột cố định + linh hoạt, repeat(auto-fit/auto-fill, minmax()), Grid cho khung trang + Flexbox bên trong — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Thư viện ảnh ba cột bằng nhau với đơn vị fr',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['display: grid', 'grid-template-columns', 'đơn vị fr', 'gap'],
      tienQuyet: ['box model'],
      the: ['css', 'grid', 'fr'],
      moTa: `<p>Ví dụ đầu tiên của bài 3.4:</p>
${code(`
.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* ba cột bằng nhau */
  gap: 16px;
}
`)}
<p>Thư viện ảnh của câu lạc bộ đang dùng phần trăm (${c('width: 32%')} + margin) và hàng cuối lệch. Chuyển sang Grid: ba cột bằng nhau, khoảng cách 16px, không phần trăm nào.</p>`,
      yeuCau: [
        `${c('.gallery')} là grid container ba cột bằng nhau: ${c('1fr 1fr 1fr')}.`,
        `${c('gap: 16px')} giữa các ô (cả hàng lẫn cột).`,
        `Bỏ ${c('width')} và ${c('margin')} phần trăm trên ${c('.o')}.`,
      ],
      dauVao: 'Sáu .o với width 32% + margin-right 2% (hàng lệch).',
      dauRa: 'Lưới 3 cột × 2 hàng, mọi ô bằng nhau, khoảng cách đều 16px.',
      rangBuoc: [
        'Không dùng phần trăm hay calc().',
        'Không sửa HTML.',
      ],
      viDu: [{
        input: 'grid-template-columns: 1fr 1fr 1fr;  ·  vùng rộng 960px, gap 16px',
        output: 'Mỗi cột = (960 − 2×16) / 3 = 309,33px',
        explanation: 'fr chia phần không gian CÒN LẠI sau khi trừ gap — khác % (tính trên cả bề rộng, rồi gap làm tràn).',
      }],
      goiY: [
        'Thuộc tính đặt trên vật chứa .gallery; các .o tự rơi vào ô lần lượt.',
        '.gallery { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; } — và xoá width/margin của .o.',
      ],
      khoiDau: {
        'styles.css': `${BB}
.o {
  display: inline-block;
  width: 32%;
  margin-right: 2%;
  padding: 24px;
  background: #e0f2fe;
}
`,
        'index.html': TRANG('Thư viện ảnh', `    <div class="gallery">
${THE(6)}
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* ba cột, mỗi cột một phần bằng nhau của chỗ trống */
  gap: 16px;                           /* khoảng cách giữa hàng VÀ cột */
}

/* ô không cần tự tính kích thước nữa */
.o {
  padding: 24px;
  background: #e0f2fe;
}
`,
        'index.html': TRANG('Thư viện ảnh', `    <div class="gallery">
${THE(6)}
    </div>`),
      },
      giaiThich: `<p>${c('fr')} là "một phần của không gian trống" — trình duyệt trừ gap trước rồi mới chia, nên ba cột luôn vừa khít. Với phần trăm, ${c('32% × 3 + 2% × 2')} phải cộng đúng 100% và vẫn vỡ khi thêm viền hay padding (bẫy của bài 3.2).</p>
<p>Grid định nghĩa cột trên vật chứa; các ô chỉ việc rơi vào chỗ — đó là "bố cục quyết định kích thước" trong bảng so sánh của bài 3.4. Máy chấm kiểm ${c('display: grid')}, đếm 3 cột, tỉ lệ cột 1:1, gap, và không còn phần trăm.</p>`,
      loiHayGap: [
        `Viết ${c('grid-template-columns: 3fr')} — một cột chiếm ba phần, không phải ba cột.`,
        `Giữ ${c('width: 32%')} trên ô — % giờ tính theo ô lưới, ảnh co lại còn 1/3 ô.`,
        `Quên ${c('display: grid')} — grid-template-columns không có tác dụng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns',
      kiem: [
        { moTa: '.gallery là grid', kiem: 'css', selector: '.gallery', thuocTinh: 'display', giaTri: 'grid' },
        { moTa: 'Lưới có ba cột', kiem: 'so-cot', selector: '.gallery', giaTri: 3 },
        { moTa: 'Cột 1 rộng bằng cột 2 (1fr : 1fr)', kiem: 'ti-le-cot', selector: '.gallery', giaTri: 1 },
        { moTa: 'gap 16px', kiem: 'css', selector: '.gallery', thuocTinh: 'gap', khop: '^16px( 16px)?$' },
        { moTa: 'Không còn width/margin phần trăm', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\d+%', phuDinh: true },
        { moTa: 'Dùng đơn vị fr', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\dfr' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'repeat(): bốn cột sản phẩm mà không gõ lặp 1fr',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['repeat()', 'đổi số cột một chỗ'],
      tienQuyet: ['grid-template-columns, fr'],
      the: ['css', 'grid', 'repeat'],
      moTa: `<p>Bài 3.4: <em>"repeat() — đừng gõ mười hai lần"</em>: ${c('repeat(3, 1fr)')} giống ${c('1fr 1fr 1fr')}. Trang cửa hàng cần lưới <strong>bốn</strong> cột sản phẩm. Viết bằng ${c('repeat()')} để sau này đổi số cột chỉ phải sửa một con số.</p>`,
      yeuCau: [
        `${c('.san-pham')}: grid bốn cột bằng nhau viết bằng ${c('repeat(4, 1fr)')}.`,
        `${c('gap: 20px')}.`,
      ],
      dauVao: '.san-pham chưa có bố cục; 8 sản phẩm.',
      dauRa: 'Lưới 4 cột × 2 hàng.',
      rangBuoc: [
        'Bắt buộc dùng repeat().',
      ],
      viDu: [{
        input: 'grid-template-columns: repeat(4, 1fr);',
        output: 'Giống hệt 1fr 1fr 1fr 1fr — DevTools hiện 4 rãnh cột.',
        explanation: 'repeat(số lần, mẫu rãnh). Mẫu có thể nhiều rãnh: repeat(2, 1fr 2fr) = 1fr 2fr 1fr 2fr.',
      }],
      goiY: [
        'Cú pháp: repeat(số-lần, kích-thước).',
        '.san-pham { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
.o {
  padding: 16px;
  border: 1px solid #e2e8f0;
}
`,
        'index.html': TRANG('Cửa hàng', `    <div class="san-pham">
${THE(8, 'Sản phẩm')}
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
.san-pham {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* 4 cột bằng nhau — đổi số cột: sửa đúng chữ số 4 */
  gap: 20px;
}

.o {
  padding: 16px;
  border: 1px solid #e2e8f0;
}
`,
        'index.html': TRANG('Cửa hàng', `    <div class="san-pham">
${THE(8, 'Sản phẩm')}
    </div>`),
      },
      giaiThich: `<p>${c('repeat()')} không thêm khả năng gì mới — nó chỉ là cách viết gọn và ít lỗi hơn (gõ năm lần "1fr" rất dễ thành bốn). Quan trọng hơn: nó là cửa ngõ cho chiêu ${c('repeat(auto-fit, …)')} ở bài 5 của bộ này, nơi số lần lặp do trình duyệt tự tính.</p>`,
      loiHayGap: [
        `Viết ${c('repeat(4 1fr)')} thiếu dấu phẩy — không hợp lệ, cả dòng bị bỏ.`,
        `Viết ${c('repeat(1fr, 4)')} — đảo thứ tự tham số.`,
        `Quên ${c('display: grid')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/repeat',
      kiem: [
        { moTa: '.san-pham là grid', kiem: 'css', selector: '.san-pham', thuocTinh: 'display', giaTri: 'grid' },
        { moTa: 'Lưới có bốn cột', kiem: 'so-cot', selector: '.san-pham', giaTri: 4 },
        { moTa: 'Các cột bằng nhau', kiem: 'ti-le-cot', selector: '.san-pham', giaTri: 1 },
        { moTa: 'Viết bằng repeat(4, …)', kiem: 'ma-nguon', tep: 'styles.css', khop: 'repeat\\(\\s*4\\s*,\\s*1fr\\s*\\)' },
        { moTa: 'gap 20px', kiem: 'css', selector: '.san-pham', thuocTinh: 'gap', khop: '^20px( 20px)?$' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Thanh bên cố định 240px và nội dung linh hoạt bằng Grid',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['trộn px và fr', '240px 1fr', 'bộ khung trang'],
      tienQuyet: ['grid-template-columns'],
      the: ['css', 'grid', 'layout'],
      moTa: `<p>Bài 3.4 có dòng ${c('grid-template-columns: 240px 1fr; /* thanh bên cố định + nội dung linh hoạt */')}. Bài 3.3 bạn đã làm bố cục này bằng flex (${c('flex: 1')}); giờ làm bằng Grid — chỉ <strong>một</strong> quy tắc trên vật chứa, các con không cần gì.</p>`,
      yeuCau: [
        `${c('.trang')}: grid hai cột ${c('240px 1fr')}, ${c('gap: 24px')}.`,
        `Không đặt width hay flex trên ${c('aside')} và ${c('main')}.`,
      ],
      dauVao: 'aside + main xếp chồng dọc.',
      dauRa: '[ aside 240px ] 24px [ main lấp phần còn lại ]',
      rangBuoc: [
        'Không dùng flex ở bài này.',
      ],
      viDu: [{
        input: 'grid-template-columns: 240px 1fr; gap: 24px;  ·  .trang rộng 1000px',
        output: 'cột 1 = 240px, cột 2 = 1000 − 240 − 24 = 736px',
        explanation: 'Rãnh px cố định được trừ trước, 1fr nhận toàn bộ phần còn lại.',
      }],
      goiY: [
        'Khác flex: kích thước nằm ở vật chứa (bố cục quyết định), không ở từng con.',
        '.trang { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
aside { padding: 16px; background: #f1f5f9; }
main  { padding: 16px; }
`,
        'index.html': TRANG('Tài liệu', `    <div class="trang">
      <aside>
        <p>Mục lục</p>
      </aside>
      <main>
        <h1>Bắt đầu với Grid</h1>
        <p>Grid dàn cả hàng lẫn cột cùng lúc.</p>
      </main>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* bộ khung trang: MỘT quy tắc trên vật chứa */
.trang {
  display: grid;
  grid-template-columns: 240px 1fr;  /* thanh bên cố định + nội dung linh hoạt */
  gap: 24px;
}

aside { padding: 16px; background: #f1f5f9; }
main  { padding: 16px; }
`,
        'index.html': TRANG('Tài liệu', `    <div class="trang">
      <aside>
        <p>Mục lục</p>
      </aside>
      <main>
        <h1>Bắt đầu với Grid</h1>
        <p>Grid dàn cả hàng lẫn cột cùng lúc.</p>
      </main>
    </div>`),
      },
      giaiThich: `<p>So với flex ở bài 3.3 (thanh bên ${c('width')} + ${c('flex-shrink: 0')}, nội dung ${c('flex: 1')}), Grid gom quyết định về một chỗ: vật chứa khai rãnh, con rơi vào. Đây là lý do bài 3.4 nói "Grid cho bộ khung tổng thể của trang". Máy chấm đếm 2 cột, kiểm rãnh đầu 240px, và không có kích thước trên con.</p>`,
      loiHayGap: [
        `Viết ${c('grid-template-columns: 240px auto')} — thường cũng chạy, nhưng auto co theo nội dung; 1fr mới là "lấy phần còn lại".`,
        `Đặt thêm ${c('width: 240px')} lên aside — thừa, và lệch khi đổi rãnh.`,
        `Viết ${c('240 1fr')} thiếu đơn vị — không hợp lệ.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids',
      kiem: [
        { moTa: '.trang là grid', kiem: 'css', selector: '.trang', thuocTinh: 'display', giaTri: 'grid' },
        { moTa: 'Lưới có hai cột', kiem: 'so-cot', selector: '.trang', giaTri: 2 },
        { moTa: 'Rãnh đầu 240px', kiem: 'css', selector: '.trang', thuocTinh: 'grid-template-columns', khop: '^240px ' },
        { moTa: 'gap 24px', kiem: 'css', selector: '.trang', thuocTinh: 'gap', khop: '^24px( 24px)?$' },
        { moTa: 'Không width/flex trên aside và main', kiem: 'ma-nguon', tep: 'styles.css', khop: '(aside|main)\\s*\\{[^}]*([{;\\s]width|flex)\\s*:', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Bài viết và thanh bên tỉ lệ 2:1, phần đầu và chân trang trải hết bề ngang',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['2fr 1fr', 'tỉ lệ cột', 'grid lồng trong khối thường', 'grid chỉ cho vùng cần'],
      tienQuyet: ['fr, gap'],
      the: ['css', 'grid', 'fr', 'layout'],
      moTa: `<p>Bài 3.4: <em>"${c('2fr 1fr')} làm cột đầu rộng gấp đôi cột sau."</em> Trang blog có ba tầng: ${c('<header>')} trải hết bề ngang, vùng ${c('.than')} gồm bài viết + thanh bên theo tỉ lệ <strong>2:1</strong>, và ${c('<footer>')} trải hết bề ngang. Bạn chưa học cách cho một ô trải nhiều cột — và không cần: chỉ biến <em>đúng vùng cần chia cột</em> thành grid.</p>`,
      yeuCau: [
        `${c('.than')}: grid ${c('2fr 1fr')}, ${c('gap: 32px')} — bài viết rộng gấp đôi thanh bên ở mọi bề rộng.`,
        `${c('header')} và ${c('footer')} không nằm trong grid (vẫn là khối thường, rộng hết hàng).`,
        `${c('.than')} rộng tối đa ${c('1080px')}.`,
      ],
      dauVao: 'header, div.than (article + aside), footer — chưa có bố cục.',
      dauRa: 'header ▬▬▬▬▬\n[ article ──── 2 phần ─── ] [ aside 1 phần ]\nfooter ▬▬▬▬▬',
      rangBuoc: [
        'Không dùng phần trăm.',
        'Không biến body thành grid.',
      ],
      viDu: [{
        input: '.than { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; max-width: 1080px; }',
        output: 'article = (1080 − 32) × 2/3 ≈ 698,67px · aside ≈ 349,33px',
        explanation: '2fr 1fr = 3 phần; article lấy 2, aside lấy 1 — tỉ lệ giữ nguyên khi bề rộng đổi.',
      }],
      goiY: [
        'Câu hỏi của bài 3.4: "Một chiều hay hai chiều?" — ở đây chỉ vùng thân bài cần chia cột; header/footer cứ để là khối.',
        '.than { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; max-width: 1080px; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
header, footer { padding: 16px; background: #0f172a; color: #f8fafc; }
article { padding: 16px; }
aside   { padding: 16px; background: #f8fafc; }
`,
        'index.html': TRANG('Blog', `    <header><h1>Blog Lập trình</h1></header>
    <div class="than">
      <article>
        <h2>Grid tròn 10 tuổi</h2>
        <p>Bài viết chính chiếm hai phần ba bề ngang.</p>
      </article>
      <aside>
        <h2>Đọc thêm</h2>
        <p>Thanh bên chiếm một phần ba.</p>
      </aside>
    </div>
    <footer><p>© 2026 Blog Lập trình</p></footer>`),
      },
      loiGiai: {
        'styles.css': `${BB}
header, footer { padding: 16px; background: #0f172a; color: #f8fafc; }

/* chỉ VÙNG cần chia cột mới là grid; header/footer vẫn là khối rộng hết hàng */
.than {
  display: grid;
  grid-template-columns: 2fr 1fr;  /* bài viết : thanh bên = 2 : 1 ở mọi bề rộng */
  gap: 32px;
  max-width: 1080px;
}

article { padding: 16px; }
aside   { padding: 16px; background: #f8fafc; }
`,
        'index.html': TRANG('Blog', `    <header><h1>Blog Lập trình</h1></header>
    <div class="than">
      <article>
        <h2>Grid tròn 10 tuổi</h2>
        <p>Bài viết chính chiếm hai phần ba bề ngang.</p>
      </article>
      <aside>
        <h2>Đọc thêm</h2>
        <p>Thanh bên chiếm một phần ba.</p>
      </aside>
    </div>
    <footer><p>© 2026 Blog Lập trình</p></footer>`),
      },
      giaiThich: `<p>${c('fr')} là tỉ lệ, nên ${c('2fr 1fr')} giữ đúng "gấp đôi" ở mọi bề rộng — điều mà ${c('66% 33%')} không làm được khi có gap. Bài cũng tập một thói quen của bài 3.4: hỏi câu hỏi về chiều cho <em>từng vật chứa</em>, không cho cả trang. Header/footer là chuyện một chiều (xếp chồng) — khối thường làm sẵn; chỉ ${c('.than')} cần hai cột.</p>
<p>Máy chấm đo tỉ lệ cột 1 / cột 2 = 2 (trình duyệt: chia hai bề rộng px), gap, max-width, và kiểm header/footer không bị biến thành ô lưới.</p>`,
      loiHayGap: [
        `Biến ${c('body')} thành grid ${c('2fr 1fr')} — header và footer bị nhét vào một ô mỗi cái.`,
        `Viết ${c('1fr 2fr')} — thanh bên rộng gấp đôi bài viết.`,
        `Dùng ${c('66% 34%')} + gap — tổng vượt 100%, tràn ngang.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex_value',
      kiem: [
        { moTa: '.than là grid', kiem: 'css', selector: '.than', thuocTinh: 'display', giaTri: 'grid' },
        { moTa: 'Lưới có hai cột', kiem: 'so-cot', selector: '.than', giaTri: 2 },
        { moTa: 'Bài viết rộng gấp đôi thanh bên (2:1)', kiem: 'ti-le-cot', selector: '.than', giaTri: 2 },
        { moTa: 'gap 32px', kiem: 'css', selector: '.than', thuocTinh: 'gap', khop: '^32px( 32px)?$' },
        { moTa: 'max-width 1080px', kiem: 'css', selector: '.than', thuocTinh: 'max-width', giaTri: '1080px' },
        { moTa: 'body không là grid', kiem: 'css', selector: 'body', thuocTinh: 'display', giaTri: 'block' },
        { moTa: 'header vẫn là khối thường', kiem: 'css', selector: 'header', thuocTinh: 'display', giaTri: 'block' },
        { moTa: 'Không dùng phần trăm', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\d%', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Lưới thẻ tự đổi số cột: repeat(auto-fit, minmax(220px, 1fr))',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['auto-fit', 'minmax()', 'responsive không media query', 'số cột theo bề rộng'],
      tienQuyet: ['repeat()'],
      the: ['css', 'grid', 'auto-fit', 'minmax', 'responsive'],
      moTa: `<p><em>"Chiêu lưới responsive đáng học thuộc"</em> của bài 3.4 — một dòng tạo lưới thẻ vừa đủ nhiều cột nhất có thể, tự sắp lại trên màn nhỏ, không cần media query. Trang khoá học đang có ba media query để đổi 1/2/3/4 cột. Thay cả ba bằng một dòng, rồi tự tính trước: ở mỗi bề rộng màn hình, lưới sẽ có mấy cột?</p>
${code(`
body  : margin 8px mặc định
.cards: max-width 1000px, gap 16px, 6 thẻ
cột   : minmax(220px, 1fr)

Màn 1280px → vùng .cards = min(1280 − 16, 1000) = 1000 → ? cột
Màn  768px → vùng .cards = 768 − 16 = 752                → ? cột
Màn  360px → vùng .cards = 360 − 16 = 344                → ? cột
`)}`,
      yeuCau: [
        `${c('.cards')}: grid ${c('repeat(auto-fit, minmax(220px, 1fr))')}, ${c('gap: 16px')}, ${c('max-width: 1000px')}.`,
        `Xoá mọi ${c('@media')} trong styles.css.`,
        `Ghi vào chú thích số cột bạn tính được ở 1280 / 768 / 360px (máy chấm sẽ đo đúng ba bề rộng đó).`,
      ],
      dauVao: 'styles.css: grid 1 cột + 3 media query 600/900/1200px.',
      dauRa: '1280px: 4 cột · 768px: 3 cột · 360px: 1 cột — tự động.',
      rangBuoc: [
        'Không media query.',
        'Không đổi số thẻ.',
      ],
      viDu: [{
        input: 'vùng rộng 1000px, gap 16px, mỗi cột tối thiểu 220px',
        output: 'Số cột = số lớn nhất n sao cho n×220 + (n−1)×16 ≤ 1000\nn = 4: 880 + 48 = 928 ≤ 1000 ✓ · n = 5: 1100 + 64 = 1164 > 1000 ✗ ⇒ 4 cột, mỗi cột nở thành (1000 − 48)/4 = 238px',
        explanation: 'minmax(220px, 1fr): không bé hơn 220px, nhưng nở ra để chia phần dư.',
      }],
      goiY: [
        'Công thức gọn: n = floor((vùng + gap) / (220 + gap)). Với 752: (752 + 16) / 236 ≈ 3,25 ⇒ 3.',
        '.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; max-width: 1000px; } — xoá ba khối @media.',
      ],
      khoiDau: {
        'styles.css': `${BB}
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 1000px;
}
@media (min-width: 600px)  { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 900px)  { .cards { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1200px) { .cards { grid-template-columns: repeat(4, 1fr); } }

.o { padding: 16px; border: 1px solid #e2e8f0; }
`,
        'index.html': TRANG('Khoá học', `    <div class="cards">
${THE(6, 'Khoá')}
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* Một dòng thay ba media query:
   auto-fit       — nhồi nhiều cột nhất mà bề rộng cho phép
   minmax(220,1fr)— mỗi cột ≥ 220px, nở ra chia phần dư
   Tính trước (vùng = min(màn − 16, 1000), n = floor((vùng + 16) / 236)):
     1280px → 1000 → 4 cột
      768px →  752 → 3 cột
      360px →  344 → 1 cột */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  max-width: 1000px;
}

.o { padding: 16px; border: 1px solid #e2e8f0; }
`,
        'index.html': TRANG('Khoá học', `    <div class="cards">
${THE(6, 'Khoá')}
    </div>`),
      },
      giaiThich: `<p>Ba media query cũ chọn số cột theo <em>bề rộng màn hình</em>; ${c('auto-fit')} chọn theo <em>bề rộng thật của vật chứa</em> — tốt hơn, vì cùng thành phần đặt trong cột hẹp hay rộng đều tự đúng. Số cột là n lớn nhất thoả n×220 + (n−1)×16 ≤ vùng; ở 1280px vùng bị ${c('max-width')} chặn còn 1000px ⇒ 4 cột chứ không phải 5.</p>
<p>Máy chấm đo số cột ở ba bề rộng iframe (1280, 768, 360). Trình duyệt đếm rãnh có bề rộng > 0 (auto-fit gập rãnh rỗng về 0px); trong Node, script ước lượng bằng đúng công thức ở gợi ý.</p>`,
      loiHayGap: [
        `Viết ${c('repeat(auto-fit, 220px)')} — cột cứng 220px, không nở, lưới lệch về bên trái với khoảng trống bên phải.`,
        `Quên ${c('max-width')} rồi tính 5 cột ở 1280px.`,
        `Giữ lại một media query "cho chắc" — nó sẽ đè auto-fit ở bề rộng đó.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/minmax',
      kiem: [
        { moTa: '.cards dùng auto-fit + minmax(220px, 1fr)', kiem: 'ma-nguon', tep: 'styles.css', khop: 'repeat\\(\\s*auto-fit\\s*,\\s*minmax\\(\\s*220px\\s*,\\s*1fr\\s*\\)\\s*\\)' },
        { moTa: 'Không còn media query', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media', phuDinh: true },
        { moTa: 'Màn 1280px ⇒ 4 cột', kiem: 'so-cot', selector: '.cards', giaTri: 4, beRong: 1280 },
        { moTa: 'Màn 768px ⇒ 3 cột', kiem: 'so-cot', selector: '.cards', giaTri: 3, beRong: 768 },
        { moTa: 'Màn 360px ⇒ 1 cột', kiem: 'so-cot', selector: '.cards', giaTri: 1, beRong: 360 },
        { moTa: 'gap 16px', kiem: 'css', selector: '.cards', thuocTinh: 'gap', khop: '^16px( 16px)?$' },
        { moTa: 'Có chú thích ghi số cột tính trước (4, 3, 1)', kiem: 'ma-nguon', tep: 'styles.css', khop: '/\\*[\\s\\S]*4 cột[\\s\\S]*3 cột[\\s\\S]*1 cột[\\s\\S]*\\*/', giuChuThich: true },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Grid cho bộ khung, Flexbox bên trong: trang quản trị hai tầng bố cục',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['Grid hay Flexbox', 'grid cho khung trang', 'flex trong từng vùng', 'câu hỏi về chiều'],
      tienQuyet: ['Flexbox (bài 3.3)', 'grid-template-columns'],
      the: ['css', 'grid', 'flexbox', 'layout'],
      moTa: `<p>Bẫy cuối bài 3.4: <em>"coi grid và flexbox là đối thủ rồi chọn một cái cho cả dự án"</em>. Đáp án tự nhiên là grid cho bộ khung trang, flexbox bên trong từng vùng. Trang quản trị dưới đây đang dùng flex cho mọi thứ — kể cả khung trang, nơi người viết phải đặt width cứng để các cột thẳng hàng. Hãy hỏi câu hỏi về chiều cho <strong>từng</strong> vật chứa và chọn lại.</p>
${code(`
Vật chứa            Bố cục mong muốn                      Một chiều hay hai?
.khung              thanh bên 220px | nội dung 1fr         → ?
.thanh-cong-cu      tiêu đề trái ... nút phải, giữa dọc    → ?
.chi-so             4 ô số liệu bằng nhau, thẳng cột       → ?
.hang-nut           các nút cạnh nhau, cách 8px            → ?
`)}`,
      yeuCau: [
        `${c('.khung')}: grid ${c('220px 1fr')}, gap 24px (bỏ width cứng của hai con).`,
        `${c('.thanh-cong-cu')}: flex, ${c('space-between')}, ${c('align-items: center')}.`,
        `${c('.chi-so')}: grid ${c('repeat(4, 1fr)')}, gap 16px.`,
        `${c('.hang-nut')}: flex, gap 8px.`,
      ],
      dauVao: 'Mọi vật chứa đều display: flex; .khung dùng width cứng 220px/860px.',
      dauRa: 'Khung trang bằng grid; thanh công cụ và hàng nút bằng flex; bốn ô chỉ số thẳng cột bằng grid.',
      rangBuoc: [
        'Không width cứng trên .thanh-ben và .noi-dung.',
        'Không phần trăm.',
      ],
      viDu: [{
        input: '.chi-so { display: flex; } .o { flex: 1; }',
        output: 'Bốn ô bằng nhau… cho tới khi một ô có số dài ("1.250.000đ") — flex chia theo nội dung, ô đó phình ra, các cột lệch.',
        explanation: 'Bốn ô cần THẲNG CỘT với nhau ⇒ bố cục quyết định kích thước ⇒ Grid.',
      }],
      goiY: [
        'Dùng bảng quyết định của bài 3.4: hai chiều/khung cố định ⇒ grid; một hàng mà nội dung quyết định ⇒ flex.',
        '.khung → grid 220px 1fr · .thanh-cong-cu → flex space-between center · .chi-so → grid repeat(4, 1fr) · .hang-nut → flex gap 8px.',
      ],
      khoiDau: {
        'styles.css': `${BB}
.khung { display: flex; }
.thanh-ben { width: 220px; padding: 16px; background: #f1f5f9; }
.noi-dung  { width: 860px; padding: 16px; }

.thanh-cong-cu { display: flex; }
.chi-so { display: flex; }
.chi-so .o { padding: 16px; border: 1px solid #e2e8f0; }
.hang-nut { display: flex; }
`,
        'index.html': TRANG('Quản trị', `    <div class="khung">
      <aside class="thanh-ben">Menu</aside>
      <main class="noi-dung">
        <div class="thanh-cong-cu">
          <h1>Tổng quan</h1>
          <div class="hang-nut">
            <button type="button">Xuất CSV</button>
            <button type="button">Làm mới</button>
          </div>
        </div>
        <div class="chi-so">
          <div class="o">Người dùng: 1.204</div>
          <div class="o">Doanh thu: 1.250.000đ</div>
          <div class="o">Bài nộp: 87</div>
          <div class="o">Lỗi: 0</div>
        </div>
      </main>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* KHUNG TRANG — hai chiều, bố cục quyết định kích thước ⇒ GRID */
.khung {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
}
.thanh-ben { padding: 16px; background: #f1f5f9; }   /* không width cứng */
.noi-dung  { padding: 16px; }

/* thanh công cụ — MỘT hàng, trái/phải ⇒ FLEX */
.thanh-cong-cu {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* bốn ô chỉ số phải thẳng cột dù nội dung dài ngắn ⇒ GRID */
.chi-so {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.chi-so .o { padding: 16px; border: 1px solid #e2e8f0; }

/* hàng nút — một chiều, nội dung quyết định ⇒ FLEX */
.hang-nut {
  display: flex;
  gap: 8px;
}
`,
        'index.html': TRANG('Quản trị', `    <div class="khung">
      <aside class="thanh-ben">Menu</aside>
      <main class="noi-dung">
        <div class="thanh-cong-cu">
          <h1>Tổng quan</h1>
          <div class="hang-nut">
            <button type="button">Xuất CSV</button>
            <button type="button">Làm mới</button>
          </div>
        </div>
        <div class="chi-so">
          <div class="o">Người dùng: 1.204</div>
          <div class="o">Doanh thu: 1.250.000đ</div>
          <div class="o">Bài nộp: 87</div>
          <div class="o">Lỗi: 0</div>
        </div>
      </main>
    </div>`),
      },
      giaiThich: `<p>Bốn vật chứa, bốn câu trả lời. ${c('.khung')} và ${c('.chi-so')} có "bộ khung cố định" mà phần tử phải rơi vào ⇒ Grid; ${c('.thanh-cong-cu')} và ${c('.hang-nut')} là một đường, nội dung quyết định ⇒ Flexbox. Triệu chứng của chọn sai mà bài 3.4 kể ra có mặt ngay trong mã khởi đầu: "một bố cục flexbox đầy chiều rộng cố định cố làm các hàng thẳng nhau" (220px/860px).</p>
<p>Máy chấm kiểm display và các thuộc tính của từng vật chứa, đếm cột ở hai lưới, và cấm width cứng trên hai vùng của khung.</p>`,
      loiHayGap: [
        `Dùng grid cho cả ${c('.hang-nut')} — chạy được, nhưng phải khai số cột; thêm nút là phải sửa CSS.`,
        `Giữ ${c('width: 860px')} trên nội dung — tràn ngang trên laptop 1024px.`,
        `Bốn ô chỉ số bằng ${c('flex: 1')} — lệch cột khi một số dài.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids#grid_and_flexbox',
      kiem: [
        { moTa: '.khung là grid', kiem: 'css', selector: '.khung', thuocTinh: 'display', giaTri: 'grid' },
        { moTa: '.khung hai cột, rãnh đầu 220px', kiem: 'css', selector: '.khung', thuocTinh: 'grid-template-columns', khop: '^220px ' },
        { moTa: '.khung gap 24px', kiem: 'css', selector: '.khung', thuocTinh: 'gap', khop: '^24px( 24px)?$' },
        { moTa: '.thanh-cong-cu là flex space-between', kiem: 'css', selector: '.thanh-cong-cu', thuocTinh: 'justify-content', giaTri: 'space-between' },
        { moTa: '.thanh-cong-cu căn giữa dọc', kiem: 'css', selector: '.thanh-cong-cu', thuocTinh: 'align-items', giaTri: 'center' },
        { moTa: '.chi-so là grid 4 cột', kiem: 'so-cot', selector: '.chi-so', giaTri: 4 },
        { moTa: '.chi-so cột bằng nhau', kiem: 'ti-le-cot', selector: '.chi-so', giaTri: 1 },
        { moTa: '.hang-nut là flex', kiem: 'css', selector: '.hang-nut', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: '.hang-nut gap 8px', kiem: 'css', selector: '.hang-nut', thuocTinh: 'gap', khop: '^8px( 8px)?$' },
        { moTa: 'Không width cứng trên .thanh-ben/.noi-dung', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\.(thanh-ben|noi-dung)\\s*\\{[^}]*[{;\\s]width\\s*:', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Lưới lồng lưới: thư viện auto-fill trong cột 1fr, tính đúng số cột ở ba màn hình',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['grid lồng grid', 'auto-fill', 'bề rộng rãnh 1fr', 'max-width', 'tính toán trước khi gõ'],
      tienQuyet: ['toàn bộ bài 3.4'],
      the: ['css', 'grid', 'auto-fill', 'calculation'],
      moTa: `<p>Bài 3.4 có hai biến thể: ${c('auto-fit')} (bài 5) và ${c('auto-fill')} (khối code cuối bài, "số cột tự thêm vào và bớt đi khi vật chứa rộng ra hay hẹp lại"). Ở đây thư viện ảnh ${c('auto-fill')} không nằm trong cả trang mà trong <strong>cột 1fr</strong> của một grid khác — nên bề rộng nó nhận được phụ thuộc vào grid ngoài. Viết CSS theo đặc tả rồi <strong>tính trước</strong> số cột thư viện ở ba màn hình; máy chấm đo đúng ba màn đó.</p>
${code(`
body          margin 8px (mặc định)
.trang        grid: 260px 1fr · gap 24px · max-width 1200px
  aside       (cột 260px)
  main        (cột 1fr)
    .thu-vien grid: repeat(auto-fill, minmax(180px, 1fr)) · gap 12px · 8 ảnh

Màn 1400px · 1024px · 800px  →  .thu-vien có ? · ? · ? cột
`)}`,
      yeuCau: [
        `${c('.trang')} và ${c('.thu-vien')} đúng đặc tả (cột, gap, max-width).`,
        `Ghi phép tính ba trường hợp trong chú thích, theo chuỗi: màn → vùng .trang → cột main → số cột.`,
        `Số cột thực tế khớp phép tính của bạn ở cả ba màn hình.`,
        `Không media query, không phần trăm.`,
      ],
      dauVao: 'HTML có sẵn .trang > aside + main > .thu-vien (8 ảnh); styles.css trống.',
      dauRa: '1400px: 4 cột · 1024px: 3 cột · 800px: 2 cột.',
      rangBuoc: [
        'Không media query, không %, không calc().',
        'Dùng auto-fill (không phải auto-fit) cho thư viện.',
      ],
      viDu: [{
        input: 'Màn 1400px',
        output: '.trang = min(1400 − 16, 1200) = 1200\nmain = 1200 − 260 − 24 = 916\ncột = floor((916 + 12) / (180 + 12)) = floor(4,83) = 4',
        explanation: 'Rãnh 1fr của grid ngoài nhận phần còn lại sau rãnh px và gap — đó là "vùng" của grid trong.',
      }],
      goiY: [
        'Làm ba bước cho mỗi màn: (1) vùng .trang = min(màn − 16, 1200); (2) main = vùng − 260 − 24; (3) n = floor((main + 12) / 192).',
        'CSS: .trang { display: grid; grid-template-columns: 260px 1fr; gap: 24px; max-width: 1200px; } .thu-vien { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
/* Viết .trang và .thu-vien theo đặc tả, kèm phép tính số cột */
aside { padding: 16px; background: #f1f5f9; }
.o { padding: 24px; background: #fef3c7; }
`,
        'index.html': TRANG('Thư viện', `    <div class="trang">
      <aside>Album</aside>
      <main>
        <h1>Chuyến đi Đà Lạt</h1>
        <div class="thu-vien">
${THE(8)}
        </div>
      </main>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* Grid NGOÀI: bộ khung trang */
.trang {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  max-width: 1200px;
}

/* Grid TRONG: nằm trong rãnh 1fr của grid ngoài
   n = floor((cột main + 12) / (180 + 12))
   Màn 1400: .trang = min(1384, 1200) = 1200 → main = 1200 − 260 − 24 = 916 → (928 / 192) = 4,83 → 4 cột
   Màn 1024: .trang = 1008                    → main = 1008 − 284 = 724       → (736 / 192) = 3,83 → 3 cột
   Màn  800: .trang = 784                     → main =  784 − 284 = 500       → (512 / 192) = 2,67 → 2 cột */
.thu-vien {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

aside { padding: 16px; background: #f1f5f9; }
.o { padding: 24px; background: #fef3c7; }
`,
        'index.html': TRANG('Thư viện', `    <div class="trang">
      <aside>Album</aside>
      <main>
        <h1>Chuyến đi Đà Lạt</h1>
        <div class="thu-vien">
${THE(8)}
        </div>
      </main>
    </div>`),
      },
      giaiThich: `<p>Grid trong không biết màn hình rộng bao nhiêu — nó chỉ biết rãnh mà grid ngoài trao cho nó. Vì vậy chuỗi tính có ba mắt: màn hình → vùng ${c('.trang')} (bị max-width chặn ở màn lớn) → rãnh 1fr của main (trừ rãnh 260px và gap 24px) → số cột thư viện. Ở màn 1400px, nếu quên max-width bạn sẽ tính 5 cột; nếu quên trừ thanh bên, 6 cột.</p>
<p>${c('auto-fill')} khác ${c('auto-fit')} chỉ khi ảnh <em>ít hơn</em> số cột vừa: auto-fill giữ rãnh rỗng (ảnh không nở hết hàng), auto-fit gập rãnh rỗng. Với 8 ảnh ở đây, hai cái cho cùng số cột — nhưng thư viện ảnh thường muốn ảnh giữ cỡ khi album chỉ có 2 tấm, nên auto-fill là lựa chọn hợp. Máy chấm đo số cột ở ba bề rộng iframe; trong Node script ước lượng bằng chính chuỗi tính này.</p>`,
      loiHayGap: [
        `Tính theo bề rộng màn hình thay vì bề rộng main — ra 6–7 cột ở 1400px.`,
        `Quên gap của grid ngoài (24px) — lệch một cột ở ranh giới.`,
        `Dùng ${c('repeat(auto-fill, 180px)')} — cột cứng, thừa khoảng trống bên phải.`,
      ],
      thamKhao: 'https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/',
      kiem: [
        { moTa: '.trang grid 260px 1fr', kiem: 'css', selector: '.trang', thuocTinh: 'grid-template-columns', khop: '^260px ' },
        { moTa: '.trang max-width 1200px', kiem: 'css', selector: '.trang', thuocTinh: 'max-width', giaTri: '1200px' },
        { moTa: '.trang gap 24px', kiem: 'css', selector: '.trang', thuocTinh: 'gap', khop: '^24px( 24px)?$' },
        { moTa: '.thu-vien dùng auto-fill + minmax(180px, 1fr)', kiem: 'ma-nguon', tep: 'styles.css', khop: 'repeat\\(\\s*auto-fill\\s*,\\s*minmax\\(\\s*180px\\s*,\\s*1fr\\s*\\)\\s*\\)' },
        { moTa: '.thu-vien gap 12px', kiem: 'css', selector: '.thu-vien', thuocTinh: 'gap', khop: '^12px( 12px)?$' },
        { moTa: 'Màn 1400px ⇒ 4 cột', kiem: 'so-cot', selector: '.thu-vien', giaTri: 4, beRong: 1400 },
        { moTa: 'Màn 1024px ⇒ 3 cột', kiem: 'so-cot', selector: '.thu-vien', giaTri: 3, beRong: 1024 },
        { moTa: 'Màn 800px ⇒ 2 cột', kiem: 'so-cot', selector: '.thu-vien', giaTri: 2, beRong: 800 },
        { moTa: 'Không media query, %, calc()', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media|\\d%|calc\\(', phuDinh: true },
        { moTa: 'Có chú thích phép tính cho cả ba màn', kiem: 'ma-nguon', tep: 'styles.css', khop: '1400[\\s\\S]*1024[\\s\\S]*800', giuChuThich: true },
      ],
    },
  ],
};
