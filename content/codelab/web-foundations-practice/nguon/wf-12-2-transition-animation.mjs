/** Bộ luyện bài 12.2 — Transition & animation. Lược đồ: ./_luoc-do.mjs (loại 'dom'). kiem[].moTa = "EN|||VI".
 *  `chiTrinhDuyet: true` = jsdom không tách shorthand transition/animation ⇒ bỏ qua ở jsdom, trình duyệt thật chấm. */
import { c } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 12.2 — Chuyển cảnh và hoạt hình.</em> Máy chấm đọc giá trị đã tính của các thuộc tính <code>transition-*</code> / <code>animation-*</code> và soi mã nguồn tìm những thói quen cần tránh.</p>';
const trang = (body) => `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Bài 12.2</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${body}
</body>
</html>
`;
const FAQ = `  <div class="faq">
    <div class="item">
      <button class="question">Giao hàng mất bao lâu? <span class="icon">▾</span></button>
      <div class="answer"><div><p>Hai đến bốn ngày làm việc.</p></div></div>
    </div>
    <div class="item open">
      <button class="question">Đổi trả thế nào? <span class="icon">▾</span></button>
      <div class="answer"><div><p>Trong 7 ngày, còn nguyên tem.</p></div></div>
    </div>
  </div>`;

export default {
  slug: 'wf-12-2-transition-animation',
  ten: '12.2 Chuyển cảnh và hoạt hình',
  baiHoc: 'Nền tảng Web — Bài 12.2 Transition và animation',
  ngonNgu: 'html',
  level: 'INTERMEDIATE',
  moTa: 'Nút đổi màu mượt, gọi tên thuộc tính thay vì all, accordion bằng grid 0fr→1fr, spinner @keyframes, ngăn kéo trượt bằng transform, khối prefers-reduced-motion — 6 bài.',
  de: [
    {
      tieuDe: 'Nút đổi màu mượt khi hover',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['transition', 'duration', 'easing'], tienQuyet: [':hover'], the: ['css', 'transition'],
      moTa: `${BAI}<p>Nút ${c('.btn')} đổi màu nền khi hover nhưng "giật" từ màu này sang màu kia. Thêm transition CHỈ cho ${c('background-color')}, thời lượng 200ms, đường cong ${c('ease-out')}.</p>`,
      yeuCau: [`${c('transition-property')} là ${c('background-color')}.`, `${c('transition-duration')} là ${c('200ms')} (trình duyệt báo ${c('0.2s')}).`, `${c('transition-timing-function')} là ${c('ease-out')}.`],
      dauVao: 'index.html + styles.css.', dauRa: 'Nút đổi màu mượt.',
      rangBuoc: ['Không dùng transition: all.'],
      viDu: [{ input: 'transition: background-color 200ms ease-out', output: 'màu đổi trong 0,2 giây', explanation: 'Cú pháp rút gọn: thuộc tính, thời lượng, đường cong.' }],
      goiY: ['Viết rút gọn: transition: <thuộc tính> <thời lượng> <đường cong>;', '.btn { transition: background-color 200ms ease-out; }'],
      khoiDau: { 'index.html': trang('  <button class="btn">Mua ngay</button>'), 'styles.css': `/* Bài 12.2 — nút */
.btn { background: #2563eb; color: #fff; border: 0; padding: 10px 18px; border-radius: 8px; }
.btn:hover { background: #1d4ed8; }
` },
      loiGiai: { 'index.html': trang('  <button class="btn">Mua ngay</button>'), 'styles.css': `/* Bài 12.2 — nút: chỉ animate đúng thuộc tính đổi */
.btn {
  background: #2563eb; color: #fff; border: 0; padding: 10px 18px; border-radius: 8px;
  transition: background-color 200ms ease-out;   /* thuộc tính · thời lượng · đường cong */
}
.btn:hover { background: #1d4ed8; }
` },
      giaiThich: `<p>Transition đặt trên trạng thái THƯỜNG (${c('.btn')}), không phải ${c(':hover')}, để cả lúc vào lẫn lúc ra đều mượt. 200ms là khoảng hợp cho tương tác nhỏ; ${c('ease-out')} phản hồi nhanh ngay đầu.</p>`,
      loiHayGap: ['Đặt transition trong :hover — rời chuột ra thì giật.', 'Viết 200 (thiếu ms) — cả khai báo bị bỏ.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/transition',
      kiem: [
        { moTa: 'Only background-color is transitioned|||Chỉ background-color có transition', kiem: 'css', selector: '.btn', thuocTinh: 'transition-property', giaTri: 'background-color', chiTrinhDuyet: true },
        { moTa: 'Duration 200ms|||Thời lượng 200ms', kiem: 'css', selector: '.btn', thuocTinh: 'transition-duration', giaTri: '0.2s', chiTrinhDuyet: true },
        { moTa: 'ease-out curve|||Đường cong ease-out', kiem: 'css', selector: '.btn', thuocTinh: 'transition-timing-function', giaTri: 'ease-out', chiTrinhDuyet: true },
        { moTa: 'transition declared on .btn (not :hover)|||transition khai trên .btn (không phải :hover)', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\.btn\\s*\\{[^}]*transition' },
      ],
    },
    {
      tieuDe: 'Bỏ transition: all',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['transition-property', 'nhiều transition'], tienQuyet: ['transition'], the: ['css', 'transition'],
      moTa: `${BAI}<p>Thẻ ${c('.card')} khi hover thì nổi lên (${c('transform')}) và đậm bóng (${c('box-shadow')}). Code khởi đầu dùng ${c('transition: all 300ms')} — nó animate cả những thứ không định (ví dụ màu nền khi đổi theme). Viết lại thành HAI transition có tên, cùng 300ms ${c('ease')}.</p>`,
      yeuCau: [`Không còn ${c('all')} trong transition.`, `${c('transition-property')} là ${c('transform, box-shadow')}.`, 'Mỗi cái 300ms.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Thẻ nổi lên mượt.',
      rangBuoc: ['Giữ nguyên hiệu ứng hover.'],
      viDu: [{ input: 'transition: transform 300ms ease, box-shadow 300ms ease', output: 'hai thuộc tính', explanation: 'Phân cách bằng dấu phẩy.' }],
      goiY: ['Nhiều transition cách nhau bằng dấu phẩy.', '.card { transition: transform 300ms ease, box-shadow 300ms ease; }'],
      khoiDau: { 'index.html': trang('  <article class="card"><h3>Áo khoác</h3><p>590.000đ</p></article>'), 'styles.css': `/* Bài 12.2 — thẻ */
.card { width: 240px; padding: 16px; border-radius: 10px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.15); transition: all 300ms; }
.card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,.2); }
` },
      loiGiai: { 'index.html': trang('  <article class="card"><h3>Áo khoác</h3><p>590.000đ</p></article>'), 'styles.css': `/* Bài 12.2 — thẻ: gọi tên đúng hai thuộc tính thay đổi */
.card {
  width: 240px; padding: 16px; border-radius: 10px; background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
  transition: transform 300ms ease, box-shadow 300ms ease;   /* không dùng all */
}
.card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0, 0, 0, .2); }
` },
      giaiThich: `<p>Gọi tên thuộc tính giúp người đọc biết cái gì chuyển động, và trình duyệt không phải theo dõi mọi thuộc tính. ${c('transform')} (không phải ${c('top')}) để nổi lên — rẻ cho trình duyệt.</p>`,
      loiHayGap: ['transition: transform, box-shadow 300ms — transform không có thời lượng (0s).', 'Dùng top: -4px thay vì transform — phải tính lại bố cục mỗi khung.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property',
      kiem: [
        { moTa: 'No transition: all|||Không còn transition: all', kiem: 'ma-nguon', tep: 'styles.css', khop: 'transition[^;]*\\ball\\b', phuDinh: true },
        { moTa: 'Properties: transform, box-shadow|||Thuộc tính: transform, box-shadow', kiem: 'css', selector: '.card', thuocTinh: 'transition-property', giaTri: 'transform, box-shadow', chiTrinhDuyet: true },
        { moTa: 'Each lasts 300ms|||Mỗi cái 300ms', kiem: 'css', selector: '.card', thuocTinh: 'transition-duration', giaTri: '0.3s, 0.3s', chiTrinhDuyet: true },
        { moTa: 'Hover still lifts with transform|||Hover vẫn nổi bằng transform', kiem: 'ma-nguon', tep: 'styles.css', khop: ':hover\\s*\\{[^}]*transform' },
      ],
    },
    {
      tieuDe: 'Accordion: animate chiều cao bằng grid',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['grid-template-rows', '0fr → 1fr', 'min-height: 0'], tienQuyet: ['grid', 'transition'], the: ['css', 'transition', 'grid'],
      moTa: `${BAI}<p>${c('height: auto')} không animate được. Dùng mẹo grid: ${c('.answer')} là grid một hàng ${c('0fr')}; khi ${c('.item')} có class ${c('open')} thì ${c('1fr')}; con trực tiếp của ${c('.answer')} có ${c('min-height: 0')} và ${c('overflow: hidden')}; transition ${c('grid-template-rows')} 300ms. Icon ${c('.icon')} của mục mở xoay 180° bằng ${c('transform')}. Mục thứ hai trong HTML đang mở sẵn.</p>`,
      yeuCau: [`${c('.answer')}: ${c('display: grid')}, đóng thì cao 0px.`, `Mục ${c('.open')}: câu trả lời cao hơn 0 (đo thật).`, `${c('.answer > div')}: ${c('min-height: 0')}, ${c('overflow: hidden')}; icon mở xoay bằng transform.`],
      dauVao: 'index.html + styles.css.', dauRa: 'Accordion có chiều cao chuyển động.',
      rangBuoc: ['Không dùng height/max-height để animate.'],
      viDu: [{ input: '.item.open .answer { grid-template-rows: 1fr }', output: 'mở ra mượt', explanation: 'fr là số nên nội suy được.' }],
      goiY: ['.answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms ease; } .item.open .answer { grid-template-rows: 1fr; }', '.answer > div { min-height: 0; overflow: hidden; } .item.open .icon { transform: rotate(180deg); }'],
      khoiDau: { 'index.html': trang(FAQ), 'styles.css': `/* Bài 12.2 — accordion (đang dùng height) */
.question { display: block; width: 100%; text-align: left; padding: 10px; }
.answer { height: 0; overflow: hidden; transition: height 300ms; }
.item.open .answer { height: auto; }
.icon { display: inline-block; }
` },
      loiGiai: { 'index.html': trang(FAQ), 'styles.css': `/* Bài 12.2 — accordion bằng grid: fr là số ⇒ trình duyệt nội suy được */
.question { display: block; width: 100%; text-align: left; padding: 10px; }
.answer {
  display: grid;
  grid-template-rows: 0fr;                         /* đóng: hàng cao 0 */
  transition: grid-template-rows 300ms ease;
}
.item.open .answer { grid-template-rows: 1fr; }    /* mở: cao bằng nội dung */
.answer > div {
  min-height: 0;                                   /* cho phép co nhỏ hơn nội dung */
  overflow: hidden;
}
.icon { display: inline-block; transition: transform 300ms ease; }
.item.open .icon { transform: rotate(180deg); }
` },
      giaiThich: `<p>Hàng ${c('0fr')} chiếm 0 phần chỗ trống còn lại ⇒ cao 0; ${c('1fr')} ⇒ cao vừa nội dung. Vì đều là số, transition chạy mượt. ${c('min-height: 0')} rất quan trọng: mặc định một grid item không co nhỏ hơn nội dung của nó.</p>`,
      loiHayGap: ['Quên min-height: 0 — hàng 0fr vẫn cao bằng nội dung.', 'Dùng max-height: 1000px — tốc độ sai và bị cắt nếu nội dung dài.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows',
      kiem: [
        { moTa: '.answer is a grid|||.answer là grid', kiem: 'css', selector: '.answer', thuocTinh: 'display', giaTri: 'grid' },
        { moTa: 'Closed answer is 0px tall|||Câu trả lời đóng cao 0px', kiem: 'kich-thuoc', selector: '.item:not(.open) .answer', thuocTinh: 'height', giaTri: 0, chiTrinhDuyet: true },
        { moTa: 'Inner block may shrink (min-height 0)|||Khối trong được co (min-height 0)', kiem: 'css', selector: '.answer > div', thuocTinh: 'min-height', khop: '^0(px)?$' },
        { moTa: 'Uses 0fr / 1fr|||Dùng 0fr / 1fr', kiem: 'ma-nguon', tep: 'styles.css', khop: '0fr[\\s\\S]*1fr' },
        { moTa: 'No height animation|||Không animate height', kiem: 'ma-nguon', tep: 'styles.css', khop: 'transition[^;]*\\b(max-)?height\\b', phuDinh: true },
        { moTa: 'Open icon rotated|||Icon mục mở đã xoay', kiem: 'css', selector: '.item.open .icon', thuocTinh: 'transform', khop: '^(matrix\\(-1, 0, 0, -1, 0, 0\\)|matrix\\(-1, 1\\.2\\d*e-16, -1\\.2\\d*e-16, -1, 0, 0\\)|rotate\\(180deg\\))$' },
      ],
    },
    {
      tieuDe: 'Spinner bằng @keyframes',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['@keyframes', 'animation', 'infinite'], tienQuyet: ['transform'], the: ['css', 'animation'],
      moTa: `${BAI}<p>Viết ${c('@keyframes spin')} xoay từ 0 tới ${c('rotate(360deg)')}, rồi gắn cho ${c('.spinner')}: tên ${c('spin')}, 800ms, ${c('linear')}, lặp vô hạn. Spinner là hình tròn 40×40px viền 4px, viền trên khác màu. Có ${c('role="status"')} và ${c('aria-label')} sẵn trong HTML.</p>`,
      yeuCau: [`${c('@keyframes spin')} có ${c('rotate(360deg)')}.`, `${c('animation-name: spin')}, ${c('animation-duration: 0.8s')}, ${c('linear')}, ${c('infinite')}.`, `${c('.spinner')} 40×40px, ${c('border-radius: 50%')}.`],
      dauVao: 'index.html + styles.css.', dauRa: 'Spinner xoay.',
      rangBuoc: ['Không dùng JavaScript.'],
      viDu: [{ input: 'animation: spin 800ms linear infinite', output: 'xoay một vòng mỗi 0,8 giây', explanation: 'Rút gọn: tên, thời lượng, đường cong, số lần.' }],
      goiY: ['@keyframes spin { to { transform: rotate(360deg); } }', '.spinner { animation: spin 800ms linear infinite; }'],
      khoiDau: { 'index.html': trang('  <div class="spinner" role="status" aria-label="Đang tải"></div>'), 'styles.css': `/* Bài 12.2 — spinner */
.spinner { width: 40px; height: 40px; border: 4px solid #cbd5e1; border-top-color: #2563eb; }
` },
      loiGiai: { 'index.html': trang('  <div class="spinner" role="status" aria-label="Đang tải"></div>'), 'styles.css': `/* Bài 12.2 — spinner: một vòng mỗi 800ms, đều tốc, lặp mãi */
.spinner {
  width: 40px; height: 40px; box-sizing: border-box;
  border: 4px solid #cbd5e1;
  border-top-color: #2563eb;      /* một cung khác màu ⇒ thấy được chuyển động */
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }   /* from mặc định = trạng thái hiện tại (0deg) */
}
` },
      giaiThich: `<p>Keyframes chỉ cần ${c('to')}: ${c('from')} mặc định là giá trị đang có. ${c('linear')} để tốc độ đều — ${c('ease')} sẽ làm spinner "khựng" mỗi vòng. Animation dùng transform nên không gây layout.</p>`,
      loiHayGap: ['Đặt tên khác nhau ở @keyframes và animation-name.', 'Quên border-radius — một hình vuông xoay.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes',
      kiem: [
        { moTa: '@keyframes spin rotates 360deg|||@keyframes spin xoay 360deg', kiem: 'ma-nguon', tep: 'styles.css', khop: '@keyframes\\s+spin\\s*\\{[\\s\\S]*rotate\\(\\s*360deg\\s*\\)' },
        { moTa: 'animation-name is spin|||animation-name là spin', kiem: 'css', selector: '.spinner', thuocTinh: 'animation-name', giaTri: 'spin', chiTrinhDuyet: true },
        { moTa: '0.8s, linear, infinite|||0,8s, linear, vô hạn', kiem: 'css', selector: '.spinner', thuocTinh: 'animation-iteration-count', giaTri: 'infinite', chiTrinhDuyet: true },
        { moTa: 'Duration 0.8s|||Thời lượng 0,8s', kiem: 'css', selector: '.spinner', thuocTinh: 'animation-duration', giaTri: '0.8s', chiTrinhDuyet: true },
        { moTa: 'Round 40×40|||Tròn 40×40', kiem: 'css', selector: '.spinner', thuocTinh: 'border-radius', giaTri: '50%' },
        { moTa: 'Hidden: 40px wide|||Ẩn: rộng 40px', an: true, kiem: 'kich-thuoc', selector: '.spinner', thuocTinh: 'width', giaTri: 40 },
      ],
    },
    {
      tieuDe: 'Ngăn kéo trượt bằng transform',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['transform', 'translateX', 'thuộc tính rẻ'], tienQuyet: ['position: fixed', 'transition'], the: ['css', 'hiệu năng'],
      moTa: `${BAI}<p>Ngăn kéo ${c('.drawer')} (rộng 280px, fixed bên trái) đang trượt bằng ${c('left: -280px → 0')} — mỗi khung hình phải tính lại bố cục. Viết lại: luôn ${c('left: 0')}, đóng thì ${c('transform: translateX(-100%)')}, ${c('.drawer.open')} thì ${c('transform: none')}, transition ${c('transform')} 250ms. Trong HTML ngăn kéo đang ĐÓNG.</p>`,
      yeuCau: [`Không animate ${c('left')}; ${c('left')} luôn là 0.`, `Đóng: ${c('translateX(-100%)')}; mở: ${c('none')}.`, `Transition trên ${c('transform')}.`],
      dauVao: 'index.html + styles.css.', dauRa: 'Ngăn kéo trượt mượt.',
      rangBuoc: ['Không dùng JavaScript để đặt vị trí.'],
      viDu: [{ input: 'transform: translateX(-100%)', output: 'dịch sang trái đúng bằng bề rộng của nó', explanation: '% của transform tính theo chính phần tử.' }],
      goiY: ['% trong translateX là % bề rộng CỦA CHÍNH phần tử.', '.drawer { left: 0; transform: translateX(-100%); transition: transform 250ms ease; } .drawer.open { transform: none; }'],
      khoiDau: { 'index.html': trang('  <aside class="drawer"><nav>Menu</nav></aside>\n  <main><p>Nội dung</p></main>'), 'styles.css': `/* Bài 12.2 — ngăn kéo (đang animate left) */
.drawer { position: fixed; top: 0; bottom: 0; width: 280px; left: -280px; background: #0f172a; color: #fff; transition: left 250ms ease; }
.drawer.open { left: 0; }
` },
      loiGiai: { 'index.html': trang('  <aside class="drawer"><nav>Menu</nav></aside>\n  <main><p>Nội dung</p></main>'), 'styles.css': `/* Bài 12.2 — ngăn kéo: vị trí cố định, chỉ transform thay đổi ⇒ không layout mỗi khung */
.drawer {
  position: fixed; top: 0; bottom: 0; left: 0;
  width: 280px; background: #0f172a; color: #fff;
  transform: translateX(-100%);            /* đóng: dịch sang trái đúng bằng bề rộng */
  transition: transform 250ms ease;
}
.drawer.open { transform: none; }          /* mở */
` },
      giaiThich: `<p>${c('left')} là thuộc tính bố cục: đổi nó mỗi khung kéo theo layout, paint, composite. ${c('transform')} chỉ cần composite. ${c('translateX(-100%)')} dùng % theo chính ngăn kéo nên đổi bề rộng cũng không phải sửa.</p>`,
      loiHayGap: ['translateX(-280px) cứng — đổi width là vỡ.', 'Vẫn để transition: left.'],
      thamKhao: 'https://web.dev/articles/animations-guide',
      kiem: [
        { moTa: 'left is always 0|||left luôn là 0', kiem: 'css', selector: '.drawer', thuocTinh: 'left', khop: '^0(px)?$' },
        { moTa: 'Closed drawer is translated left|||Ngăn kéo đóng dịch sang trái', kiem: 'css', selector: '.drawer', thuocTinh: 'transform', khop: '^(matrix\\(1, 0, 0, 1, -280, 0\\)|translateX\\(-100%\\))$' },
        { moTa: 'Transition on transform, not left|||Transition trên transform, không phải left', kiem: 'ma-nguon', tep: 'styles.css', khop: 'transition\\s*:\\s*transform' },
        { moTa: 'No left in any transition|||Không có left trong transition', kiem: 'ma-nguon', tep: 'styles.css', khop: 'transition[^;]*\\bleft\\b', phuDinh: true },
        { moTa: 'Hidden: .open resets transform|||Ẩn: .open đặt lại transform', an: true, kiem: 'ma-nguon', tep: 'styles.css', khop: '\\.drawer\\.open\\s*\\{[^}]*transform\\s*:\\s*(none|translateX\\(0\\))' },
      ],
    },
    {
      tieuDe: 'Tôn trọng prefers-reduced-motion',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['prefers-reduced-motion', 'media query', 'khả năng tiếp cận'], tienQuyet: ['@media', 'animation'], the: ['css', 'a11y'],
      moTa: `${BAI}<p>Trang có spinner, toast trượt vào và thẻ phóng to khi hover. Thêm một khối ${c('@media (prefers-reduced-motion: reduce)')} áp cho MỌI phần tử (cả ${c('::before')}/${c('::after')}): ${c('animation-duration')} và ${c('transition-duration')} ${c('0.01ms')}, ${c('animation-iteration-count: 1')}, đều ${c('!important')} (ngoại lệ hợp lý duy nhất của !important trong khoá này). Ở chế độ bình thường mọi thứ phải giữ nguyên.</p>`,
      yeuCau: ['Có khối @media (prefers-reduced-motion: reduce).', 'Trong khối: selector phủ *, *::before, *::after; ba thuộc tính như mô tả.', 'Chế độ bình thường: spinner vẫn 0,8s lặp vô hạn.'],
      dauVao: 'index.html + styles.css.', dauRa: 'Trang tôn trọng cài đặt giảm chuyển động.',
      rangBuoc: ['Không xoá animation gốc.'],
      viDu: [{ input: 'Bật "Reduce motion" trong hệ điều hành', output: 'spinner chạy 1 vòng 0,01ms', explanation: 'Gần như tắt, nhưng animationend vẫn bắn.' }],
      goiY: ['Dùng 0.01ms thay vì none để sự kiện kết thúc vẫn bắn.', '@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }'],
      khoiDau: { 'index.html': trang('  <div class="spinner"></div>\n  <div class="toast">Đã lưu</div>\n  <article class="card">Thẻ</article>'), 'styles.css': `/* Bài 12.2 — chuyển động */
.spinner { width: 40px; height: 40px; border: 4px solid #cbd5e1; border-top-color: #2563eb; border-radius: 50%; animation: spin 800ms linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.toast { animation: slide-in 600ms ease-out both; }
@keyframes slide-in { from { opacity: 0; transform: translateY(20px); } }
.card { transition: transform 300ms ease; }
.card:hover { transform: scale(1.05); }
` },
      loiGiai: { 'index.html': trang('  <div class="spinner"></div>\n  <div class="toast">Đã lưu</div>\n  <article class="card">Thẻ</article>'), 'styles.css': `/* Bài 12.2 — chuyển động + chế độ giảm chuyển động */
.spinner { width: 40px; height: 40px; border: 4px solid #cbd5e1; border-top-color: #2563eb; border-radius: 50%; animation: spin 800ms linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.toast { animation: slide-in 600ms ease-out both; }
@keyframes slide-in { from { opacity: 0; transform: translateY(20px); } }
.card { transition: transform 300ms ease; }
.card:hover { transform: scale(1.05); }

/* người dùng bật "giảm chuyển động" trong hệ điều hành */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;        /* gần như tức thì, nhưng animationend vẫn bắn */
    animation-iteration-count: 1 !important;      /* spinner không lặp */
    transition-duration: 0.01ms !important;
  }
}
` },
      giaiThich: `<p>Khối media chỉ có hiệu lực khi hệ điều hành bật giảm chuyển động. ${c('!important')} ở đây có lý: nó phải thắng MỌI luật animation của trang, kể cả của thư viện. Thời lượng 0.01ms thay vì ${c('none')} giữ cho JavaScript đang chờ ${c('animationend')}/${c('transitionend')} không bị treo.</p>`,
      loiHayGap: ['Đặt animation: none — code chờ animationend treo mãi.', 'Quên ::before/::after — spinner vẽ bằng giả phần tử vẫn quay.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion',
      kiem: [
        { moTa: 'Has a prefers-reduced-motion: reduce block|||Có khối prefers-reduced-motion: reduce', kiem: 'ma-nguon', tep: 'styles.css', khop: '@media\\s*\\(\\s*prefers-reduced-motion\\s*:\\s*reduce\\s*\\)' },
        { moTa: 'Covers *, *::before, *::after|||Phủ *, *::before, *::after', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\*\\s*,\\s*\\*::before\\s*,\\s*\\*::after' },
        { moTa: 'Durations near zero, one iteration|||Thời lượng gần 0, một vòng', kiem: 'ma-nguon', tep: 'styles.css', khop: 'animation-iteration-count\\s*:\\s*1\\s*!important[\\s\\S]*transition-duration\\s*:\\s*0?\\.01ms\\s*!important|transition-duration\\s*:\\s*0?\\.01ms\\s*!important[\\s\\S]*animation-iteration-count\\s*:\\s*1\\s*!important' },
        { moTa: 'Normal mode unchanged: spinner 0.8s|||Chế độ thường giữ nguyên: spinner 0,8s', kiem: 'css', selector: '.spinner', thuocTinh: 'animation-duration', giaTri: '0.8s', chiTrinhDuyet: true },
        { moTa: 'Hidden: animation-duration near zero inside the block|||Ẩn: animation-duration gần 0 trong khối', an: true, kiem: 'ma-nguon', tep: 'styles.css', khop: 'animation-duration\\s*:\\s*0?\\.01ms\\s*!important' },
      ],
    },
  ],
};
