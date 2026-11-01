/** Bộ luyện bài 12.1 — Position & stacking context. Lược đồ: ./_luoc-do.mjs (loại 'dom'). kiem[].moTa = "EN|||VI".
 *  Kiểm `chiTrinhDuyet: true` = jsdom bỏ qua (var()), máy chấm trình duyệt thật chấm đầy đủ. */
import { c } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 12.1 — Position và ngữ cảnh xếp chồng.</em> Máy chấm dựng trang của bạn trong khung 1024×768 rồi đọc giá trị CSS đã tính (getComputedStyle) và vị trí thật.</p>';
const trang = (body, css = 'styles.css') => `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Bài 12.1</title>
  <link rel="stylesheet" href="${css}">
</head>
<body>
${body}
</body>
</html>
`;

const CARD = `  <article class="card">
    <h3>Bàn phím cơ</h3>
    <p>450.000đ</p>
    <span class="badge">SALE</span>
  </article>`;

const PAGE_STICKY = `  <div class="page">
    <header class="site-header">CuongThai Shop</header>
    <main class="content">
      <p>Đoạn 1</p><p>Đoạn 2</p><p>Đoạn 3</p><p>Đoạn 4</p><p>Đoạn 5</p>
    </main>
  </div>`;

const MODAL_TRAP = `  <header class="site-header">Header</header>
  <main class="content">
    <p>Nội dung trang</p>
    <div class="modal" role="dialog">Xoá sản phẩm này?</div>
  </main>`;

const MODAL_FIX = `  <header class="site-header">Header</header>
  <main class="content">
    <p>Nội dung trang</p>
  </main>
  <!-- modal là con trực tiếp của body: cạnh tranh trực tiếp với header -->
  <div class="modal" role="dialog">Xoá sản phẩm này?</div>`;

export default {
  slug: 'wf-12-1-position-stacking',
  ten: '12.1 Position và ngữ cảnh xếp chồng',
  baiHoc: 'Nền tảng Web — Bài 12.1 Position và stacking context',
  ngonNgu: 'html',
  level: 'INTERMEDIATE',
  moTa: 'Huy hiệu ở góc thẻ, header dính, thông báo cố định góc màn hình, lớp phủ toàn màn hình, đưa modal ra khỏi ngữ cảnh xếp chồng, thang z-index bằng token — 6 bài, chấm bằng giá trị CSS đã tính.',
  de: [
    {
      tieuDe: 'Huy hiệu SALE ở góc thẻ',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['position: absolute', 'position: relative', 'containing block'], tienQuyet: ['box model'], the: ['css', 'position'],
      moTa: `${BAI}<p>Huy hiệu ${c('.badge')} đang bay lên góc trang vì nó ${c('absolute')} mà thẻ không có định vị. Sửa ${c('styles.css')} để huy hiệu nằm cách góc trên-phải của ${c('.card')} 8px.</p>`,
      yeuCau: [`${c('.card')} có ${c('position: relative')}.`, `${c('.badge')} có ${c('position: absolute')}, ${c('top: 8px')}, ${c('right: 8px')}.`, 'Không đổi HTML.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Trang có huy hiệu đúng góc.',
      rangBuoc: ['Chỉ sửa styles.css.'],
      viDu: [{ input: '.card { position: relative }', output: 'Huy hiệu nằm trong thẻ', explanation: 'Thẻ thành khối chứa của huy hiệu.' }],
      goiY: ['absolute đo từ tổ tiên có định vị gần nhất.', '.card { position: relative; } .badge { position: absolute; top: 8px; right: 8px; }'],
      khoiDau: { 'index.html': trang(CARD), 'styles.css': `/* Bài 12.1 — huy hiệu */
.card { width: 260px; padding: 14px; border: 1px solid #cbd5e1; border-radius: 10px; margin: 60px; }
.badge { position: absolute; top: 8px; right: 8px; background: #dc2626; color: #fff; padding: 2px 10px; border-radius: 999px; }
` },
      loiGiai: { 'index.html': trang(CARD), 'styles.css': `/* Bài 12.1 — huy hiệu: cha relative, con absolute */
.card {
  position: relative;          /* thành khối chứa cho .badge, không xê dịch thẻ */
  width: 260px; padding: 14px; border: 1px solid #cbd5e1; border-radius: 10px; margin: 60px;
}
.badge {
  position: absolute;          /* rời luồng, đo từ .card */
  top: 8px;
  right: 8px;
  background: #dc2626; color: #fff; padding: 2px 10px; border-radius: 999px;
}
` },
      giaiThich: `<p>${c('absolute')} đi tìm tổ tiên gần nhất có ${c('position')} khác ${c('static')}. Không có ai thì nó đo từ trang. ${c('position: relative')} không có top/left không xê dịch thẻ chút nào, chỉ biến thẻ thành khối chứa.</p>`,
      loiHayGap: ['Đặt relative cho .badge thay vì cho .card.', 'Dùng margin âm để "kéo" huy hiệu vào — vỡ khi đổi kích thước thẻ.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position',
      kiem: [
        { moTa: '.card is positioned (relative)|||.card có định vị (relative)', kiem: 'css', selector: '.card', thuocTinh: 'position', giaTri: 'relative' },
        { moTa: '.badge is absolute|||.badge là absolute', kiem: 'css', selector: '.badge', thuocTinh: 'position', giaTri: 'absolute' },
        { moTa: '.badge 8px from the top and right|||.badge cách trên và phải 8px', kiem: 'css', selector: '.badge', thuocTinh: 'right', giaTri: '8px' },
        { moTa: 'Hidden: top is 8px|||Ẩn: top là 8px', an: true, kiem: 'css', selector: '.badge', thuocTinh: 'top', giaTri: '8px' },
      ],
    },
    {
      tieuDe: 'Header dính và bẫy overflow',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['position: sticky', 'overflow'], tienQuyet: ['position'], the: ['css', 'sticky'],
      moTa: `${BAI}<p>${c('.site-header')} phải dính ở đỉnh khi trang cuộn, nhưng code khởi đầu (1) thiếu ngưỡng ${c('top')} và (2) có ${c('.page { overflow: hidden }')} — một tổ tiên cuộn giả làm sticky vô hiệu. Sửa cả hai.</p>`,
      yeuCau: [`${c('.site-header')}: ${c('position: sticky')} và ${c('top: 0')}.`, `${c('.page')} không còn ${c('overflow: hidden')} (giá trị tính là ${c('visible')}).`, `Header có ${c('z-index: 10')} để nằm trên nội dung khi cuộn.`],
      dauVao: 'index.html + styles.css.', dauRa: 'Header dính thật.',
      rangBuoc: ['Chỉ sửa styles.css.'],
      viDu: [{ input: '.page { overflow: visible }', output: 'sticky dính theo cửa sổ', explanation: 'Không còn tổ tiên có overflow chen giữa.' }],
      goiY: ['Sticky dính trong tổ tiên cuộn gần nhất — mọi overflow khác visible đều tạo ra nó.', '.site-header { position: sticky; top: 0; z-index: 10; } — bỏ overflow: hidden ở .page.'],
      khoiDau: { 'index.html': trang(PAGE_STICKY), 'styles.css': `/* Bài 12.1 — header dính (đang hỏng) */
.page { overflow: hidden; }
.site-header { position: sticky; background: #1e293b; color: #fff; padding: 12px 16px; }
.content p { height: 300px; margin: 0; border-bottom: 1px solid #e5e7eb; }
` },
      loiGiai: { 'index.html': trang(PAGE_STICKY), 'styles.css': `/* Bài 12.1 — header dính: có ngưỡng top, không tổ tiên overflow chen giữa */
.page { }                       /* bỏ overflow: hidden — nó biến .page thành vùng cuộn không bao giờ cuộn */
.site-header {
  position: sticky;
  top: 0;                       /* ngưỡng: dính khi chạm đỉnh */
  z-index: 10;                  /* nằm trên nội dung đang cuộn bên dưới */
  background: #1e293b; color: #fff; padding: 12px 16px;
}
.content p { height: 300px; margin: 0; border-bottom: 1px solid #e5e7eb; }
` },
      giaiThich: `<p>Sticky cần một ngưỡng (${c('top')}) và cần tổ tiên cuộn gần nhất chính là thứ thật sự cuộn (ở đây là trang). ${c('overflow: hidden')} trên ${c('.page')} tạo một vùng cuộn mới không bao giờ cuộn, nên header không có chỗ để dính.</p>`,
      loiHayGap: ['Chỉ thêm top: 0 mà quên overflow của tổ tiên.', 'Đổi sang position: fixed — header rời luồng, đè lên nội dung đầu trang.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky_positioning',
      kiem: [
        { moTa: 'Header is sticky|||Header là sticky', kiem: 'css', selector: '.site-header', thuocTinh: 'position', giaTri: 'sticky' },
        { moTa: 'Threshold top: 0|||Ngưỡng top: 0', kiem: 'css', selector: '.site-header', thuocTinh: 'top', khop: '^0(px)?$' },
        { moTa: '.page no longer clips (overflow visible)|||.page không còn overflow hidden', kiem: 'css', selector: '.page', thuocTinh: 'overflow-y', giaTri: 'visible' },
        { moTa: 'Header z-index 10|||Header z-index 10', kiem: 'css', selector: '.site-header', thuocTinh: 'z-index', giaTri: '10' },
      ],
    },
    {
      tieuDe: 'Thông báo cố định ở góc màn hình',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['position: fixed', 'viewport'], tienQuyet: ['position'], the: ['css', 'fixed'],
      moTa: `${BAI}<p>Đặt ${c('.toast')} ở góc dưới-phải CỬA SỔ, cách hai cạnh 16px, nằm trên mọi thứ khác (${c('z-index: 500')}), rộng tối đa 320px. Nó phải đứng yên khi trang cuộn — tức là đo từ khung nhìn, không từ phần tử nào.</p>`,
      yeuCau: [`${c('position: fixed')}, ${c('right: 16px')}, ${c('bottom: 16px')}.`, `${c('z-index: 500')}; ${c('max-width: 320px')}.`, 'Mép phải của toast cách mép phải khung 1024px đúng 16px.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Toast ở góc dưới phải.',
      rangBuoc: ['Không dùng margin để căn.'],
      viDu: [{ input: 'right: 16px; bottom: 16px', output: 'cách góc 16px', explanation: 'fixed đo từ khung nhìn.' }],
      goiY: ['fixed rời luồng và đo từ cửa sổ.', '.toast { position: fixed; right: 16px; bottom: 16px; z-index: 500; max-width: 320px; }'],
      khoiDau: { 'index.html': trang(`  <main><p>Nội dung</p></main>
  <div class="toast" role="status">Đã lưu thay đổi ✓</div>`), 'styles.css': `/* Bài 12.1 — toast */
.toast { background: #16a34a; color: #fff; padding: 12px 16px; border-radius: 8px; }
` },
      loiGiai: { 'index.html': trang(`  <main><p>Nội dung</p></main>
  <div class="toast" role="status">Đã lưu thay đổi ✓</div>`), 'styles.css': `/* Bài 12.1 — toast cố định góc dưới phải khung nhìn */
.toast {
  position: fixed;     /* đo từ khung nhìn, đứng yên khi cuộn */
  right: 16px;
  bottom: 16px;
  z-index: 500;        /* tầng "toast" trong thang z-index */
  max-width: 320px;
  background: #16a34a; color: #fff; padding: 12px 16px; border-radius: 8px;
}
` },
      giaiThich: `<p>${c('fixed')} bỏ qua mọi tổ tiên (trừ khi tổ tiên có transform — bẫy trong bài) và đo từ khung nhìn. ${c('right')}/${c('bottom')} đặt mép phải và mép dưới. Máy chấm đo vị trí thật: mép phải toast = 1024 − 16.</p>`,
      loiHayGap: ['Dùng absolute — toast trôi theo trang khi cuộn.', 'Quên z-index — bị header sticky đè.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed_positioning',
      kiem: [
        { moTa: 'Toast is fixed|||Toast là fixed', kiem: 'css', selector: '.toast', thuocTinh: 'position', giaTri: 'fixed' },
        { moTa: '16px from right and bottom|||Cách phải và dưới 16px', kiem: 'css', selector: '.toast', thuocTinh: 'bottom', giaTri: '16px' },
        { moTa: 'z-index 500 and max-width 320px|||z-index 500 và max-width 320px', kiem: 'css', selector: '.toast', thuocTinh: 'max-width', giaTri: '320px' },
        { moTa: 'Hidden: z-index 500|||Ẩn: z-index 500', an: true, kiem: 'css', selector: '.toast', thuocTinh: 'z-index', giaTri: '500' },
        { moTa: 'Hidden: right is 16px|||Ẩn: right là 16px', an: true, kiem: 'css', selector: '.toast', thuocTinh: 'right', giaTri: '16px' },
      ],
    },
    {
      tieuDe: 'Lớp phủ toàn màn hình cho modal',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['inset', 'position: fixed', 'flex căn giữa'], tienQuyet: ['flexbox'], the: ['css', 'modal'],
      moTa: `${BAI}<p>${c('.overlay')} phải phủ KÍN cửa sổ (fixed, inset 0), nền đen mờ ${c('rgba(0, 0, 0, 0.5)')}, và căn ${c('.modal')} vào giữa bằng flexbox. ${c('.modal')} rộng 400px. Máy chấm đo kích thước thật của lớp phủ: 1024 × 768.</p>`,
      yeuCau: [`${c('.overlay')}: ${c('position: fixed')}, ${c('inset: 0')} (top/right/bottom/left 0).`, `Nền ${c('rgba(0, 0, 0, 0.5)')}; ${c('display: flex')} căn giữa hai chiều.`, `${c('.modal')} rộng 400px.`],
      dauVao: 'index.html + styles.css.', dauRa: 'Modal giữa màn hình.',
      rangBuoc: ['Không dùng giá trị pixel cố định cho kích thước lớp phủ.'],
      viDu: [{ input: 'inset: 0', output: 'top/right/bottom/left = 0', explanation: 'Viết tắt bốn cạnh.' }],
      goiY: ['inset: 0 = top: 0; right: 0; bottom: 0; left: 0.', '.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; }'],
      khoiDau: { 'index.html': trang(`  <main><p>Nội dung trang</p></main>
  <div class="overlay">
    <div class="modal" role="dialog">Xoá sản phẩm này? <button>Xoá</button></div>
  </div>`), 'styles.css': `/* Bài 12.1 — lớp phủ */
.overlay { position: absolute; width: 100%; background: #000; }
.modal { background: #fff; padding: 20px; border-radius: 10px; }
` },
      loiGiai: { 'index.html': trang(`  <main><p>Nội dung trang</p></main>
  <div class="overlay">
    <div class="modal" role="dialog">Xoá sản phẩm này? <button>Xoá</button></div>
  </div>`), 'styles.css': `/* Bài 12.1 — lớp phủ: fixed + inset 0 phủ kín khung nhìn, flex căn giữa */
.overlay {
  position: fixed;
  inset: 0;                         /* top/right/bottom/left = 0 */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;              /* giữa theo chiều dọc */
  justify-content: center;          /* giữa theo chiều ngang */
  z-index: 400;
}
.modal { width: 400px; background: #fff; padding: 20px; border-radius: 10px; box-sizing: border-box; }
` },
      giaiThich: `<p>${c('fixed')} + ${c('inset: 0')} kéo bốn cạnh của lớp phủ tới bốn cạnh khung nhìn — kích thước tự đúng ở mọi màn hình, không cần ${c('100vw')} (vốn tính cả thanh cuộn). Flex căn giữa hộp con theo hai trục.</p>`,
      loiHayGap: ['width: 100vw; height: 100vh — tràn ngang khi có thanh cuộn dọc.', 'absolute — lớp phủ chỉ phủ phần đầu trang.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/inset',
      kiem: [
        { moTa: 'Overlay is fixed|||Lớp phủ là fixed', kiem: 'css', selector: '.overlay', thuocTinh: 'position', giaTri: 'fixed' },
        { moTa: 'Overlay covers the viewport width|||Lớp phủ kín bề ngang', kiem: 'kich-thuoc', selector: '.overlay', thuocTinh: 'width', giaTri: 1024, chiTrinhDuyet: true },
        { moTa: 'Overlay covers the viewport height|||Lớp phủ kín bề dọc', kiem: 'kich-thuoc', selector: '.overlay', thuocTinh: 'height', giaTri: 768, chiTrinhDuyet: true },
        { moTa: 'Semi-transparent background|||Nền đen mờ 50%', kiem: 'css', selector: '.overlay', thuocTinh: 'background-color', giaTri: 'rgba(0, 0, 0, 0.5)' },
        { moTa: 'Flex centring|||Căn giữa bằng flex', kiem: 'css', selector: '.overlay', thuocTinh: 'justify-content', giaTri: 'center' },
        { moTa: 'Modal is 400px wide|||Modal rộng 400px', kiem: 'kich-thuoc', selector: '.modal', thuocTinh: 'width', giaTri: 400 },
      ],
    },
    {
      tieuDe: 'Đưa modal ra khỏi ngữ cảnh xếp chồng',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['stacking context', 'z-index'], tienQuyet: ['position'], the: ['css', 'z-index', 'html'],
      moTa: `${BAI}<p>Modal có ${c('z-index: 9999')} vẫn nằm dưới header (z-index 10), vì nó nằm trong ${c('main')} — mà ${c('main')} có ${c('z-index: 1')} nên là một ngữ cảnh xếp chồng. Đừng tăng con số: chuyển ${c('.modal')} ra làm con trực tiếp của ${c('body')} và cho nó ${c('position: fixed')}, ${c('z-index: 100')}. Giữ nguyên ${c('main')}.</p>`,
      yeuCau: [`${c('.modal')} là con trực tiếp của ${c('body')}, không còn nằm trong ${c('main')}.`, `${c('.modal')}: ${c('position: fixed')}, ${c('z-index: 100')} (không dùng 9999).`, `${c('main')} vẫn giữ ${c('z-index: 1')}.`],
      dauVao: 'index.html + styles.css.', dauRa: 'Modal nằm trên header.',
      rangBuoc: ['Không xoá z-index của main; không dùng số z-index > 1000.'],
      viDu: [{ input: '<body> … <div class="modal">', output: 'modal cạnh tranh trực tiếp với header', explanation: 'Cùng một ngữ cảnh (gốc).' }],
      goiY: ['Ngữ cảnh xếp chồng như tập hồ sơ: số trên tờ giấy không vượt được tập.', 'Cắt <div class="modal"> ra khỏi <main>, dán ngay trước </body>; .modal { position: fixed; z-index: 100; }'],
      khoiDau: { 'index.html': trang(MODAL_TRAP), 'styles.css': `/* Bài 12.1 — modal bị nhốt */
.site-header { position: relative; z-index: 10; background: #1e293b; color: #fff; padding: 14px; height: 60px; }
.content { position: relative; z-index: 1; padding: 16px; }
.modal { position: absolute; top: -30px; left: 120px; z-index: 9999; background: #fef3c7; padding: 16px; }
` },
      loiGiai: { 'index.html': trang(MODAL_FIX), 'styles.css': `/* Bài 12.1 — modal ở cấp body: cùng ngữ cảnh với header nên z-index 100 > 10 là đủ */
.site-header { position: relative; z-index: 10; background: #1e293b; color: #fff; padding: 14px; height: 60px; }
.content { position: relative; z-index: 1; padding: 16px; }
.modal {
  position: fixed;     /* đo từ khung nhìn */
  top: 40px; left: 120px;
  z-index: 100;        /* tầng modal — không cần 9999 */
  background: #dcfce7; padding: 16px;
}
` },
      giaiThich: `<p>z-index chỉ so trong cùng một ngữ cảnh xếp chồng. Trong ${c('main')} (z-index 1), mọi con cháu bị xếp chung ở tầng 1 so với header. Đưa modal lên làm con của ${c('body')} đặt nó vào ngữ cảnh gốc — cùng chỗ với header — và lúc đó 100 thắng 10. Đây là việc ${c('createPortal')} của React làm.</p>`,
      loiHayGap: ['Tăng z-index lên 99999 — vô ích.', 'Xoá z-index của main — chạy được ở đây nhưng sẽ vỡ chỗ khác đang dựa vào nó.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context',
      kiem: [
        { moTa: 'Modal is a direct child of body|||Modal là con trực tiếp của body', kiem: 'ton-tai', selector: 'body > .modal' },
        { moTa: 'Modal is no longer inside main|||Modal không còn trong main', kiem: 'khong-ton-tai', selector: 'main .modal' },
        { moTa: 'Modal is fixed with z-index 100|||Modal fixed, z-index 100', kiem: 'css', selector: '.modal', thuocTinh: 'z-index', giaTri: '100' },
        { moTa: 'main keeps z-index 1|||main giữ z-index 1', kiem: 'css', selector: 'main', thuocTinh: 'z-index', giaTri: '1' },
        { moTa: 'No z-index above 1000|||Không z-index nào trên 1000', kiem: 'ma-nguon', tep: 'styles.css', khop: 'z-index\\s*:\\s*\\d{4,}', phuDinh: true },
        { moTa: 'Hidden: modal position fixed|||Ẩn: modal position fixed', an: true, kiem: 'css', selector: '.modal', thuocTinh: 'position', giaTri: 'fixed' },
      ],
    },
    {
      tieuDe: 'Thang z-index bằng token',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['custom property', 'z-index scale', 'dropdown'], tienQuyet: ['position', 'var()'], the: ['css', 'z-index', 'token'],
      moTa: `${BAI}<p>Nhóm đang có z-index 9, 99, 999, 9999 rải khắp file. Định nghĩa thang trên ${c(':root')}: ${c('--z-dropdown: 100')}, ${c('--z-sticky: 200')}, ${c('--z-modal: 400')}, ${c('--z-toast: 500')}; rồi dùng ${c('var(...)')} cho header (sticky), menu thả xuống (absolute ngay dưới nút, trong ${c('.dropdown')} relative), modal và toast. Không còn số z-index viết tay ngoài ${c(':root')}.</p>`,
      yeuCau: ['Bốn token z-index trên :root với đúng giá trị.', 'Mọi khai báo z-index ngoài :root dùng var(--z-…).', `${c('.dropdown')} relative; ${c('.menu')} absolute, ${c('top: 100%')}, ${c('left: 0')}; giá trị z-index tính ra đúng thang.`],
      dauVao: 'index.html + styles.css.', dauRa: 'Trang dùng thang z-index.',
      rangBuoc: ['Không số z-index trực tiếp trong luật component.'],
      viDu: [{ input: '.modal { z-index: var(--z-modal) }', output: 'z-index tính ra 400', explanation: 'Trình duyệt thay token vào.' }],
      goiY: [':root { --z-dropdown: 100; --z-sticky: 200; --z-modal: 400; --z-toast: 500; }', '.menu { position: absolute; top: 100%; left: 0; z-index: var(--z-dropdown); } — .dropdown { position: relative; }'],
      khoiDau: { 'index.html': trang(`  <header class="site-header">
    <div class="dropdown"><button>Tài khoản ▾</button>
      <ul class="menu"><li>Hồ sơ</li><li>Đăng xuất</li></ul>
    </div>
  </header>
  <main><p>Nội dung</p></main>
  <div class="modal" role="dialog">Hộp thoại</div>
  <div class="toast" role="status">Đã lưu</div>`), 'styles.css': `/* Bài 12.1 — z-index rải rác */
.site-header { position: sticky; top: 0; z-index: 99; background: #1e293b; color: #fff; padding: 10px; }
.menu { position: absolute; z-index: 9; background: #fff; color: #000; margin: 0; padding: 8px; list-style: none; }
.modal { position: fixed; top: 80px; left: 80px; z-index: 9999; background: #fff; padding: 16px; }
.toast { position: fixed; right: 16px; bottom: 16px; z-index: 999; background: #16a34a; color: #fff; padding: 10px; }
` },
      loiGiai: { 'index.html': trang(`  <header class="site-header">
    <div class="dropdown"><button>Tài khoản ▾</button>
      <ul class="menu"><li>Hồ sơ</li><li>Đăng xuất</li></ul>
    </div>
  </header>
  <main><p>Nội dung</p></main>
  <div class="modal" role="dialog">Hộp thoại</div>
  <div class="toast" role="status">Đã lưu</div>`), 'styles.css': `/* Bài 12.1 — một thang z-index có tên, khai báo MỘT lần */
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 400;
  --z-toast: 500;
}
.site-header { position: sticky; top: 0; z-index: var(--z-sticky); background: #1e293b; color: #fff; padding: 10px; }
.dropdown { position: relative; }                 /* khối chứa cho menu */
.menu {
  position: absolute;
  top: 100%;                                      /* ngay dưới nút */
  left: 0;
  z-index: var(--z-dropdown);
  background: #fff; color: #000; margin: 0; padding: 8px; list-style: none;
}
.modal { position: fixed; top: 80px; left: 80px; z-index: var(--z-modal); background: #fff; padding: 16px; }
.toast { position: fixed; right: 16px; bottom: 16px; z-index: var(--z-toast); background: #16a34a; color: #fff; padding: 10px; }
` },
      giaiThich: `<p>Thang có tên biến "con số ma thuật" thành quyết định được ghi lại: ai muốn thứ gì nằm trên modal phải chọn tầng, không gõ 99999. Menu dùng ${c('top: 100%')} = ngay dưới cạnh dưới của ${c('.dropdown')}. Lưu ý: thang chỉ sắp thứ tự trong CÙNG ngữ cảnh — menu nằm trong header (đã là ngữ cảnh ở tầng 200) nên nó luôn trên nội dung trang.</p>`,
      loiHayGap: ['Quên .dropdown { position: relative } — menu đo từ header.', 'Đặt token trong .site-header thay vì :root — modal/toast không thấy.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/z-index',
      kiem: [
        { moTa: 'Tokens defined on :root|||Token định nghĩa trên :root', kiem: 'css', selector: 'html', thuocTinh: '--z-modal', giaTri: '400' },
        { moTa: 'Modal z-index resolves to 400|||z-index của modal tính ra 400', kiem: 'css', selector: '.modal', thuocTinh: 'z-index', giaTri: '400', chiTrinhDuyet: true },
        { moTa: 'Header resolves to 200, toast to 500|||Header ra 200, toast ra 500', kiem: 'css', selector: '.toast', thuocTinh: 'z-index', giaTri: '500', chiTrinhDuyet: true },
        { moTa: 'Menu sits right under the button|||Menu ngay dưới nút', kiem: 'css', selector: '.menu', thuocTinh: 'top', khop: '^(100%|\\d+(\\.\\d+)?px)$' },
        { moTa: '.dropdown is relative|||.dropdown là relative', kiem: 'css', selector: '.dropdown', thuocTinh: 'position', giaTri: 'relative' },
        { moTa: 'No literal z-index numbers in components|||Không số z-index viết tay trong component', kiem: 'ma-nguon', tep: 'styles.css', khop: 'z-index\\s*:\\s*\\d', phuDinh: true },
        { moTa: 'Hidden: header z-index 200|||Ẩn: header z-index 200', an: true, kiem: 'css', selector: '.site-header', thuocTinh: 'z-index', giaTri: '200', chiTrinhDuyet: true },
      ],
    },
  ],
};
