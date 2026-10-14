/** Bộ luyện bài 4.5 — DOM và sự kiện. Lược đồ: ./_luoc-do.mjs (loại 'dom' + chayScript). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const TRANG = (title, body, script = '<script src="app.js" defer></script>') => `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
    ${script}
  </head>
  <body>
${body}
  </body>
</html>
`;

const DEM_HTML = `    <main class="bo-dem">
      <h1>Bộ đếm</h1>
      <p>Giá trị: <span id="dem">0</span></p>
      <button type="button" id="giam">−1</button>
      <button type="button" id="tang">+1</button>
      <button type="button" id="dat-lai">Đặt lại</button>
    </main>`;

const DEM_CSS = `.bo-dem { font-family: system-ui, sans-serif; padding: 16px; }
.bo-dem button { padding: 8px 14px; }
`;

const VIEC_HTML = `    <main>
      <h1>Việc cần làm</h1>
      <form id="them-viec" novalidate>
        <label for="viec-moi">Việc mới</label>
        <input id="viec-moi" name="viec" autocomplete="off">
        <button type="submit">Thêm</button>
      </form>
      <ul id="ds-viec">
        <li><span class="ten">Học Bài 4.5</span> <button type="button" class="xoa">Xoá</button></li>
        <li><span class="ten">Làm bài tập DOM</span> <button type="button" class="xoa">Xoá</button></li>
        <li><span class="ten">Đẩy code lên GitHub</span> <button type="button" class="xoa">Xoá</button></li>
      </ul>
    </main>`;

export default doiDau({
  slug: 'wf-4-5-dom-events',
  ten: '4.5 DOM: làm cho HTML tương tác',
  baiHoc: 'Nền tảng Web — Bài 4.5 DOM: làm cho HTML tương tác',
  ngonNgu: 'javascript',
  loaiKiem: 'dom',
  level: 'BEGINNER',
  moTa: 'querySelector, textContent, classList, value, addEventListener, defer, preventDefault cho form, sự kiện nổi bọt và ủy quyền sự kiện (event delegation) — 7 bài từ dễ đến khó, máy chấm bấm nút/gõ phím thật trên trang.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Bộ đếm sống: ba nút và một con số',
      doKho: 'EASY', phut: 10, chayScript: true,
      khaiNiem: ['querySelector', 'addEventListener("click")', 'textContent', 'let'],
      tienQuyet: ['biến', 'hàm'],
      the: ['javascript', 'dom', 'events'],
      moTa: `<p>Bài 4.5 ghép mọi thứ của Chương 4 vào "một bộ đếm sống trong mười hai dòng". Trang có ba nút ${c('#giam')}, ${c('#tang')}, ${c('#dat-lai')} và con số ${c('#dem')}. Code khởi đầu có hai lỗi: chọn sai id (${c('#count')} không tồn tại ⇒ ${c('null')} ⇒ ${c('TypeError')}), và tăng biến nhưng quên đưa giá trị lên trang. Sửa ${c('app.js')} để cả ba nút chạy đúng.</p>`,
      yeuCau: [
        `${c('#tang')} tăng 1, ${c('#giam')} giảm 1 (được xuống số âm), ${c('#dat-lai')} về 0.`,
        `Sau mỗi cú bấm, ${c('#dem')} hiển thị đúng giá trị (đặt bằng ${c('textContent')}).`,
        'Trang chạy không có lỗi JavaScript nào trong console.',
      ],
      dauVao: 'Ba cú bấm bất kỳ của người dùng.',
      dauRa: '#dem luôn hiện đúng con số.',
      rangBuoc: ['Không sửa index.html.', 'Không dùng onclick="…" trong HTML — gắn bằng addEventListener.'],
      viDu: [
        { input: 'Bấm +1 ba lần', output: 'Giá trị: 3', explanation: 'Mỗi lần bấm: dem = dem + 1, rồi out.textContent = dem.' },
        { input: 'Bấm +1 hai lần, −1 một lần', output: 'Giá trị: 1', explanation: 'Cả hai nút sửa cùng một biến.' },
        { input: '(code khởi đầu) mở trang', output: "TypeError: Cannot read properties of null (reading 'textContent')", explanation: 'querySelector("#count") không tìm thấy gì.' },
      ],
      goiY: [
        'querySelector trả về null khi không có phần tử khớp — so id trong app.js với id trong index.html.',
        'Mỗi handler hai bước: đổi biến dem, rồi out.textContent = dem; — viết một hàm hienThi() dùng chung cho ba nút cho gọn.',
      ],
      khoiDau: {
        'index.html': TRANG('Bộ đếm', DEM_HTML),
        'styles.css': DEM_CSS,
        'app.js': `// Bài 4.5 — Bộ đếm sống
let dem = 0;
const out = document.querySelector("#count");
out.textContent = dem;

document.querySelector("#tang").addEventListener("click", () => {
  dem = dem + 1;
});
`,
      },
      loiGiai: {
        'index.html': TRANG('Bộ đếm', DEM_HTML),
        'styles.css': DEM_CSS,
        'app.js': `// Bài 4.5 — Bộ đếm sống
let dem = 0;                                    // trạng thái: con số hiện tại
const out = document.querySelector("#dem");     // đúng id trong index.html

// Một chỗ duy nhất đưa trạng thái lên trang
function hienThi() {
  out.textContent = dem;
}

document.querySelector("#tang").addEventListener("click", () => {
  dem = dem + 1;
  hienThi();                                    // đổi biến thôi chưa đủ — phải cập nhật DOM
});

document.querySelector("#giam").addEventListener("click", () => {
  dem = dem - 1;
  hienThi();
});

document.querySelector("#dat-lai").addEventListener("click", () => {
  dem = 0;
  hienThi();
});

hienThi();
`,
      },
      giaiThich: `<p>Biến ${c('dem')} trong JavaScript và chữ trên trang là hai thứ riêng biệt: đổi biến KHÔNG tự đổi trang. Mỗi lần trạng thái đổi phải tự đẩy nó lên DOM — gom việc đó vào một hàm ${c('hienThi()')} để không quên ở nút nào. (React ra đời để làm hộ đúng bước này.)</p>
<p>${c('querySelector')} trả về ${c('null')} khi selector không khớp, và lỗi chỉ nổ ở dòng <em>dùng</em> nó. Máy chấm mở trang thật, bấm các nút theo nhiều kịch bản và đọc ${c('#dem')}.</p>`,
      loiHayGap: [
        'Sửa id nhưng vẫn quên cập nhật textContent trong handler — con số đứng yên ở 0.',
        `Dùng ${c('innerHTML')} cho một con số — chạy được, nhưng ${c('textContent')} đúng việc và an toàn hơn.`,
        `Gắn ${c('onclick="…"')} trong HTML — trộn logic vào trang, đề cấm.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener',
      kiem: [
        { moTa: 'Trang mở không lỗi JavaScript', kiem: 'khong-loi-js' },
        { moTa: 'Ban đầu hiện 0', kiem: 'text', selector: '#dem', giaTri: '0' },
        { moTa: 'Bấm +1 ba lần → 3', kiem: 'text', selector: '#dem', giaTri: '3', truoc: [{ hanhDong: 'click', selector: '#tang', lan: 3 }] },
        { moTa: '+1 hai lần, −1 một lần → 1', kiem: 'text', selector: '#dem', giaTri: '1', truoc: [{ hanhDong: 'click', selector: '#tang', lan: 2 }, { hanhDong: 'click', selector: '#giam' }] },
        { moTa: 'Giảm xuống số âm', kiem: 'text', selector: '#dem', giaTri: '-2', truoc: [{ hanhDong: 'click', selector: '#giam', lan: 2 }] },
        { moTa: 'Đặt lại về 0', kiem: 'text', selector: '#dem', giaTri: '0', truoc: [{ hanhDong: 'click', selector: '#tang', lan: 4 }, { hanhDong: 'click', selector: '#dat-lai' }] },
        { moTa: 'Không dùng onclick trong HTML', kiem: 'ma-nguon', tep: 'index.html', khop: 'onclick\\s*=', phuDinh: true, an: true },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Script trong <head> chạy quá sớm: sửa bằng defer',
      doKho: 'EASY', phut: 8, chayScript: true,
      khaiNiem: ['thứ tự phân tích HTML', 'defer', 'null từ querySelector'],
      tienQuyet: ['querySelector'],
      the: ['javascript', 'dom', 'defer'],
      moTa: `<p>Bài 4.5, mục <em>"Bẫy — một thẻ script nằm trong head chạy trước khi các phần tử tồn tại"</em>. Code JavaScript của trang này <strong>đúng</strong> — nhưng trang báo ${c("Cannot read properties of null (reading 'addEventListener')")}, vì trình duyệt chạy ${c('app.js')} ngay khi gặp thẻ script, lúc ${c('<body>')} còn chưa được đọc. Sửa <strong>HTML</strong> (không sửa app.js) để script chạy sau khi trang đã phân tích xong.</p>`,
      yeuCau: [
        `Thêm thuộc tính ${c('defer')} vào thẻ ${c('<script src="app.js">')} (hoặc dời thẻ xuống ngay trước ${c('</body>')} — ${c('defer')} được khuyên hơn).`,
        'Trang mở không còn lỗi JavaScript.',
        `Bấm ${c('#doi-loi-chao')} đổi chữ của ${c('#loi-chao')} thành ${c('"Chào mừng quay lại!"')}.`,
      ],
      dauVao: 'index.html có thẻ script trong head; app.js đúng.',
      dauRa: 'Trang chạy không lỗi, nút hoạt động.',
      rangBuoc: ['Không sửa app.js.', 'Không bọc code trong DOMContentLoaded — sửa đúng chỗ gây ra vấn đề.'],
      viDu: [
        { input: '<script src="app.js"></script>  (trong head)', output: "TypeError: Cannot read properties of null (reading 'addEventListener')", explanation: 'Lúc script chạy, #doi-loi-chao chưa tồn tại.' },
        { input: '<script src="app.js" defer></script>', output: 'Không lỗi; bấm nút ⇒ "Chào mừng quay lại!"', explanation: 'defer: tải song song, CHẠY sau khi HTML phân tích xong.' },
      ],
      goiY: [
        'Lỗi "reading addEventListener of null" có nghĩa phần tử chưa có — không phải code sai.',
        '<script src="app.js" defer></script> — một chữ, giữ thẻ ở chỗ người đọc vẫn tìm.',
      ],
      khoiDau: {
        'index.html': TRANG('Lời chào', `    <main>
      <h1 id="loi-chao">Xin chào!</h1>
      <button type="button" id="doi-loi-chao">Tôi đã từng ghé</button>
    </main>`, '<script src="app.js"></script>'),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; }
`,
        'app.js': `// Bài 4.5 — app.js này ĐÚNG, đừng sửa
const nut = document.querySelector("#doi-loi-chao");
const tieuDe = document.querySelector("#loi-chao");

nut.addEventListener("click", () => {
  tieuDe.textContent = "Chào mừng quay lại!";
});
`,
      },
      loiGiai: {
        'index.html': TRANG('Lời chào', `    <main>
      <h1 id="loi-chao">Xin chào!</h1>
      <button type="button" id="doi-loi-chao">Tôi đã từng ghé</button>
    </main>`, '<!-- defer: tải ngay nhưng CHẠY sau khi toàn bộ HTML đã được phân tích -->\n    <script src="app.js" defer></script>'),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; }
`,
        'app.js': `// Bài 4.5 — app.js này ĐÚNG, đừng sửa
const nut = document.querySelector("#doi-loi-chao");
const tieuDe = document.querySelector("#loi-chao");

nut.addEventListener("click", () => {
  tieuDe.textContent = "Chào mừng quay lại!";
});
`,
      },
      giaiThich: `<p>Trình duyệt đọc HTML từ trên xuống. Thẻ script thường <em>dừng</em> việc đọc, tải và chạy script ngay — nên script ở ${c('<head>')} chạy khi chưa có phần tử nào của ${c('<body>')}; ${c('querySelector')} trả về ${c('null')}. ${c('defer')} đổi thời điểm: tải song song, chạy sau khi đọc xong HTML. Code đúng, chỉ thời điểm sai.</p>
<p>Máy chấm mô phỏng đúng thứ tự đó: script không ${c('defer')} chạy tại chỗ gặp nó. Nó mở trang, kiểm không còn lỗi JS, bấm nút và đọc tiêu đề, và kiểm app.js không bị sửa.</p>`,
      loiHayGap: [
        `Thêm ${c('async')} thay vì ${c('defer')} — async chạy ngay khi tải xong, có thể vẫn trước khi HTML đọc xong.`,
        'Sửa app.js thêm if (nut) — che lỗi, nút vẫn không bao giờ chạy.',
        `Viết ${c('defer="false"')} — thuộc tính boolean có mặt là bật, bất kể giá trị.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer',
      kiem: [
        { moTa: 'Trang mở không lỗi JavaScript', kiem: 'khong-loi-js' },
        { moTa: 'Bấm nút đổi lời chào', kiem: 'text', selector: '#loi-chao', giaTri: 'Chào mừng quay lại!', truoc: [{ hanhDong: 'click', selector: '#doi-loi-chao' }] },
        { moTa: 'Script có defer hoặc nằm cuối body', kiem: 'ma-nguon', tep: 'index.html', khop: '<script[^>]*\\bdefer\\b|<script[^>]*src=[^>]*>\\s*</script>\\s*</body>' },
        { moTa: 'app.js không bị sửa (không thêm DOMContentLoaded / if)', kiem: 'ma-nguon', tep: 'app.js', khop: 'DOMContentLoaded|\\bif\\s*\\(', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Đọc ô nhập và chào bằng textContent',
      doKho: 'EASY', phut: 12, chayScript: true,
      khaiNiem: ['input.value', 'trim()', 'textContent', 'classList.add / remove', 'XSS'],
      tienQuyet: ['querySelector', 'addEventListener'],
      the: ['javascript', 'dom', 'forms', 'security'],
      moTa: `<p>Bài 4.5: <em>"value cho ô nhập, textContent cho chữ."</em> Gõ tên vào ${c('#ten')}, bấm ${c('#chao')}, đoạn ${c('#loi-chao')} hiện ${c('"Xin chào, <tên>!"')}. Code khởi đầu đọc ${c('input.textContent')} — với ô nhập thì luôn là chuỗi rỗng — và đưa kết quả lên trang bằng ${c('innerHTML')}, nên ai đó gõ ${c('<b>Lan</b>')} là chèn được HTML vào trang của bạn.</p>`,
      yeuCau: [
        `Đọc ${c('value')} của ô nhập, bỏ khoảng trắng hai đầu bằng ${c('.trim()')}.`,
        `Có tên → ${c('#loi-chao')} hiện ${c('"Xin chào, <tên>!"')} và KHÔNG có class ${c('loi')}.`,
        `Ô trống (hoặc chỉ toàn dấu cách) → hiện ${c('"Hãy nhập tên của bạn."')} và thêm class ${c('loi')}.`,
        `Gán chữ bằng ${c('textContent')}: gõ ${c('<b>Lan</b>')} phải hiện nguyên văn các ký tự đó, không thành chữ đậm.`,
      ],
      dauVao: 'Chữ người dùng gõ vào #ten.',
      dauRa: 'Nội dung và class của #loi-chao.',
      rangBuoc: ['Không dùng innerHTML.'],
      viDu: [
        { input: 'Gõ "  Lan  ", bấm Chào', output: 'Xin chào, Lan!', explanation: 'trim() bỏ dấu cách thừa.' },
        { input: 'Để trống, bấm Chào', output: 'Hãy nhập tên của bạn.  (đoạn có class "loi")', explanation: 'classList.add("loi") để CSS tô đỏ.' },
        { input: 'Gõ "<b>Lan</b>", bấm Chào', output: 'Xin chào, <b>Lan</b>!', explanation: 'textContent coi mọi thứ là chữ — không có thẻ <b> nào được tạo.' },
      ],
      goiY: [
        'const ten = oTen.value.trim(); — rồi if (ten === "") { … } else { … }.',
        'Nhánh lỗi: loiChao.textContent = "Hãy nhập tên của bạn."; loiChao.classList.add("loi"); — nhánh đúng nhớ classList.remove("loi") để xoá lỗi cũ.',
      ],
      khoiDau: {
        'index.html': TRANG('Lời chào', `    <main>
      <label for="ten">Tên của bạn</label>
      <input id="ten" autocomplete="off">
      <button type="button" id="chao">Chào</button>
      <p id="loi-chao"></p>
    </main>`),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; }
.loi { color: rgb(185, 28, 28); }
`,
        'app.js': `// Bài 4.5 — Đọc ô nhập
const oTen = document.querySelector("#ten");
const loiChao = document.querySelector("#loi-chao");

document.querySelector("#chao").addEventListener("click", () => {
  const ten = oTen.textContent;
  loiChao.innerHTML = "Xin chào, " + ten + "!";
});
`,
      },
      loiGiai: {
        'index.html': TRANG('Lời chào', `    <main>
      <label for="ten">Tên của bạn</label>
      <input id="ten" autocomplete="off">
      <button type="button" id="chao">Chào</button>
      <p id="loi-chao"></p>
    </main>`),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; }
.loi { color: rgb(185, 28, 28); }
`,
        'app.js': `// Bài 4.5 — Đọc ô nhập
const oTen = document.querySelector("#ten");
const loiChao = document.querySelector("#loi-chao");

document.querySelector("#chao").addEventListener("click", () => {
  // Ô nhập: thứ người dùng gõ nằm ở .value (textContent của <input> luôn rỗng)
  const ten = oTen.value.trim();

  if (ten === "") {
    loiChao.textContent = "Hãy nhập tên của bạn.";
    loiChao.classList.add("loi");          // đổi giao diện bằng class, CSS lo màu
    return;
  }

  // textContent: mọi ký tự là CHỮ — "<b>" hiện ra đúng là "<b>", không thành thẻ
  loiChao.textContent = ´Xin chào, @{ten}!´;
  loiChao.classList.remove("loi");         // xoá trạng thái lỗi của lần bấm trước
});
`,
      },
      giaiThich: `<p>Ô nhập giữ chữ người dùng gõ ở thuộc tính ${c('value')}; ${c('textContent')} của một ${c('<input>')} luôn rỗng vì input không có nội dung con. Ngược lại, để <em>hiển thị</em> chữ thì dùng ${c('textContent')}, không phải ${c('innerHTML')}: ${c('innerHTML')} phân tích chuỗi thành HTML, nên dữ liệu người dùng gõ có thể chèn thẻ (và cả script) vào trang — lỗ hổng XSS.</p>
<p>Máy chấm gõ bốn kiểu tên (có dấu cách thừa, trống, toàn dấu cách, có thẻ HTML), đọc chữ, đếm class ${c('loi')} và đếm thẻ ${c('<b>')} trong đoạn.</p>`,
      loiHayGap: [
        'Quên classList.remove("loi") — sau một lần để trống, lời chào đúng vẫn hiện màu đỏ.',
        `Kiểm ${c('if (!ten)')} TRƯỚC khi trim — "   " là truthy, lọt qua.`,
        'Dùng innerHTML vì "ngắn hơn" — mở cửa cho XSS.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innerhtml',
      kiem: [
        { moTa: 'Gõ "  Lan  " → "Xin chào, Lan!"', kiem: 'text', selector: '#loi-chao', giaTri: 'Xin chào, Lan!', truoc: [{ hanhDong: 'nhap', selector: '#ten', giaTri: '  Lan  ' }, { hanhDong: 'click', selector: '#chao' }] },
        { moTa: 'Ô trống → thông báo lỗi', kiem: 'text', selector: '#loi-chao', giaTri: 'Hãy nhập tên của bạn.', truoc: [{ hanhDong: 'click', selector: '#chao' }] },
        { moTa: 'Ô toàn dấu cách → có class loi', kiem: 'so-luong', selector: '#loi-chao.loi', giaTri: 1, truoc: [{ hanhDong: 'nhap', selector: '#ten', giaTri: '   ' }, { hanhDong: 'click', selector: '#chao' }] },
        { moTa: 'Lỗi rồi nhập đúng → class loi được gỡ', kiem: 'so-luong', selector: '#loi-chao.loi', giaTri: 0, truoc: [{ hanhDong: 'click', selector: '#chao' }, { hanhDong: 'nhap', selector: '#ten', giaTri: 'Minh' }, { hanhDong: 'click', selector: '#chao' }] },
        { moTa: 'Gõ thẻ HTML → hiện nguyên văn', kiem: 'text', selector: '#loi-chao', giaTri: 'Xin chào, <b>Lan</b>!', truoc: [{ hanhDong: 'nhap', selector: '#ten', giaTri: '<b>Lan</b>' }, { hanhDong: 'click', selector: '#chao' }] },
        { moTa: 'Không có thẻ <b> nào bị chèn', kiem: 'so-luong', selector: '#loi-chao b', giaTri: 0, truoc: [{ hanhDong: 'nhap', selector: '#ten', giaTri: '<b>Lan</b>' }, { hanhDong: 'click', selector: '#chao' }], an: true },
        { moTa: 'Không dùng innerHTML', kiem: 'ma-nguon', tep: 'app.js', khop: 'innerHTML', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Nút mở menu: classList.toggle và aria-expanded',
      doKho: 'MEDIUM', phut: 15, chayScript: true,
      khaiNiem: ['classList.toggle', 'setAttribute', 'aria-expanded', 'tách JS khỏi CSS'],
      tienQuyet: ['addEventListener', 'class CSS'],
      the: ['javascript', 'dom', 'classList', 'a11y'],
      moTa: `<p>Bài 4.5: <em>"Hãy ưu tiên bật/tắt một class hơn là đặt từng thuộc tính style một."</em> Trên điện thoại, menu ${c('#menu')} ẩn sau nút ${c('#nut-menu')}. Code cũ gán ${c('menu.style.display = "block"')} — mở được nhưng không đóng lại được, và trình đọc màn hình không biết menu đang mở hay đóng. Làm lại bằng một class và thuộc tính ${c('aria-expanded')}.</p>`,
      yeuCau: [
        `Mỗi lần bấm ${c('#nut-menu')}: bật/tắt class ${c('mo')} trên ${c('#menu')} bằng ${c('classList.toggle')}.`,
        `CSS: ${c('#menu')} mặc định ${c('display: none')}; ${c('#menu.mo')} là ${c('display: block')}.`,
        `Nút có ${c('aria-expanded')} = ${c('"true"')} khi menu mở, ${c('"false"')} khi đóng (ban đầu ${c('"false"')} trong HTML).`,
        `Chữ trên nút: ${c('"Mở menu"')} khi đóng, ${c('"Đóng menu"')} khi mở.`,
        `Không đặt ${c('.style.')} trực tiếp trong app.js.`,
      ],
      dauVao: 'Các cú bấm vào #nut-menu.',
      dauRa: 'Trạng thái class, aria-expanded và chữ của nút luôn khớp nhau.',
      rangBuoc: ['Không dùng element.style trong JS.'],
      viDu: [
        { input: 'Bấm nút một lần', output: '#menu có class "mo" (hiện ra), nút: aria-expanded="true", chữ "Đóng menu"', explanation: 'toggle thêm class khi chưa có.' },
        { input: 'Bấm nút hai lần', output: 'Trở về như ban đầu', explanation: 'toggle gỡ class khi đã có.' },
      ],
      goiY: [
        'classList.toggle("mo") TRẢ VỀ true nếu sau lệnh class đang có — dùng luôn giá trị đó cho aria-expanded và chữ trên nút.',
        'const dangMo = menu.classList.toggle("mo"); nut.setAttribute("aria-expanded", String(dangMo)); nut.textContent = dangMo ? "Đóng menu" : "Mở menu";',
      ],
      khoiDau: {
        'index.html': TRANG('Menu', `    <header>
      <button type="button" id="nut-menu" aria-controls="menu" aria-expanded="false">Mở menu</button>
      <nav id="menu">
        <a href="#gioi-thieu">Giới thiệu</a>
        <a href="#khoa-hoc">Khoá học</a>
        <a href="#lien-he">Liên hệ</a>
      </nav>
    </header>`),
        'styles.css': `header { font-family: system-ui, sans-serif; padding: 16px; }
#menu { display: none; }
#menu a { display: block; padding: 8px 0; }
`,
        'app.js': `// Bài 4.5 — Nút menu
const nut = document.querySelector("#nut-menu");
const menu = document.querySelector("#menu");

nut.addEventListener("click", () => {
  menu.style.display = "block";
});
`,
      },
      loiGiai: {
        'index.html': TRANG('Menu', `    <header>
      <button type="button" id="nut-menu" aria-controls="menu" aria-expanded="false">Mở menu</button>
      <nav id="menu">
        <a href="#gioi-thieu">Giới thiệu</a>
        <a href="#khoa-hoc">Khoá học</a>
        <a href="#lien-he">Liên hệ</a>
      </nav>
    </header>`),
        'styles.css': `header { font-family: system-ui, sans-serif; padding: 16px; }
#menu { display: none; }
/* JS chỉ bật/tắt class; CSS quyết định "mở" trông như thế nào */
#menu.mo { display: block; }
#menu a { display: block; padding: 8px 0; }
`,
        'app.js': `// Bài 4.5 — Nút menu
const nut = document.querySelector("#nut-menu");
const menu = document.querySelector("#menu");

nut.addEventListener("click", () => {
  // toggle: chưa có thì thêm, có rồi thì gỡ — và trả về trạng thái SAU lệnh
  const dangMo = menu.classList.toggle("mo");

  // Báo cho trình đọc màn hình biết menu đang mở hay đóng
  nut.setAttribute("aria-expanded", String(dangMo));
  nut.textContent = dangMo ? "Đóng menu" : "Mở menu";
});
`,
      },
      giaiThich: `<p>Đặt ${c('style.display')} bằng JS rải thông tin giao diện vào code: muốn đổi hiệu ứng mở (trượt, mờ dần) phải sửa JS. Bật/tắt <em>class</em> tách việc: JS nói "đang mở", CSS nói "mở trông thế nào". ${c('classList.toggle')} trả về trạng thái mới, nên một biến ${c('dangMo')} điều khiển cả ba thứ phải khớp nhau (class, aria, chữ) — không thể lệch.</p>
<p>${c('aria-expanded')} là cách nút nói với trình đọc màn hình (Bài 2.5) — người không nhìn thấy menu vẫn biết nó đang mở. Máy chấm bấm 1, 2 và 3 lần, kiểm class, ${c('display')} computed, ${c('aria-expanded')} và chữ của nút.</p>`,
      loiHayGap: [
        `${c('setAttribute("aria-expanded", dangMo)')} với boolean — được ép thành chuỗi "true"/"false", nhưng viết ${c('String(...)')} rõ ý hơn.`,
        'Dùng hai biến riêng cho class và aria — sớm muộn sẽ lệch nhau.',
        `Quên quy tắc ${c('#menu.mo')} trong CSS — class bật rồi mà menu vẫn ẩn.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle',
      kiem: [
        { moTa: 'Ban đầu menu ẩn', kiem: 'css', selector: '#menu', thuocTinh: 'display', giaTri: 'none' },
        { moTa: 'Bấm một lần: #menu có class mo', kiem: 'so-luong', selector: '#menu.mo', giaTri: 1, truoc: [{ hanhDong: 'click', selector: '#nut-menu' }] },
        { moTa: 'Bấm một lần: menu hiện (display block)', kiem: 'css', selector: '#menu', thuocTinh: 'display', giaTri: 'block', truoc: [{ hanhDong: 'click', selector: '#nut-menu' }] },
        { moTa: 'Bấm một lần: aria-expanded="true", chữ "Đóng menu"', kiem: 'thuoc-tinh', selector: '#nut-menu', thuocTinh: 'aria-expanded', giaTri: 'true', truoc: [{ hanhDong: 'click', selector: '#nut-menu' }] },
        { moTa: 'Bấm một lần: chữ nút là "Đóng menu"', kiem: 'text', selector: '#nut-menu', giaTri: 'Đóng menu', truoc: [{ hanhDong: 'click', selector: '#nut-menu' }] },
        { moTa: 'Bấm hai lần: menu đóng lại, aria-expanded="false"', kiem: 'thuoc-tinh', selector: '#nut-menu', thuocTinh: 'aria-expanded', giaTri: 'false', truoc: [{ hanhDong: 'click', selector: '#nut-menu', lan: 2 }] },
        { moTa: 'Bấm hai lần: không còn class mo', kiem: 'so-luong', selector: '#menu.mo', giaTri: 0, truoc: [{ hanhDong: 'click', selector: '#nut-menu', lan: 2 }] },
        { moTa: 'Bấm ba lần: mở lại', kiem: 'text', selector: '#nut-menu', giaTri: 'Đóng menu', truoc: [{ hanhDong: 'click', selector: '#nut-menu', lan: 3 }], an: true },
        { moTa: 'Không đặt .style trong app.js', kiem: 'ma-nguon', tep: 'app.js', khop: '\\.style\\b', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Form đăng ký: preventDefault, kiểm email và báo lỗi',
      doKho: 'MEDIUM', phut: 20, chayScript: true,
      khaiNiem: ['sự kiện submit', 'event.preventDefault()', 'form.reset()', 'kiểm tra phía client'],
      tienQuyet: ['input.value', 'textContent'],
      the: ['javascript', 'dom', 'forms', 'events'],
      moTa: `<p>Bài 4.5: <em>"Handler nhận một object sự kiện có target, currentTarget và preventDefault()."</em> Form nhận bản tin ${c('#dang-ky')} cần xử lý bằng JavaScript. Bản cũ gắn handler vào sự kiện <em>click</em> của nút — nhưng nhấn Enter trong ô nhập cũng gửi form mà không có click nào, và không có ${c('preventDefault()')} nên trình duyệt <strong>tải lại trang</strong>: thông báo vừa hiện biến mất ngay.</p>`,
      yeuCau: [
        `Lắng nghe sự kiện ${c('submit')} của ${c('#dang-ky')} (không phải click của nút), gọi ${c('event.preventDefault()')}.`,
        `Email (đã ${c('trim')}) rỗng hoặc không chứa ${c('"@"')} → ${c('#loi')} hiện ${c('"Email không hợp lệ."')}, ${c('#ket-qua')} rỗng.`,
        `Hợp lệ → ${c('#ket-qua')} hiện ${c('"Đã đăng ký: <email>"')}, ${c('#loi')} rỗng, và ô nhập được xoá trắng (${c('form.reset()')}).`,
      ],
      dauVao: 'Chữ người dùng gõ vào #email, rồi gửi form (bấm nút hoặc Enter).',
      dauRa: 'Nội dung #loi / #ket-qua; trang không tải lại.',
      rangBuoc: ['Form có novalidate — kiểm tra bằng JS của bạn.', 'Không dùng innerHTML.'],
      viDu: [
        { input: 'Gõ "lan@example.com", bấm Đăng ký', output: '#ket-qua: "Đã đăng ký: lan@example.com", ô nhập trống', explanation: 'preventDefault giữ trang lại; form.reset() xoá ô.' },
        { input: 'Gõ "lan.example.com", bấm Đăng ký', output: '#loi: "Email không hợp lệ."', explanation: 'Thiếu @.' },
        { input: '(code khởi đầu) bấm Đăng ký', output: 'Trang tải lại, mọi thông báo mất', explanation: 'Không có preventDefault ⇒ trình duyệt gửi form thật.' },
      ],
      goiY: [
        'form.addEventListener("submit", (e) => { e.preventDefault(); … }); — submit bắt được cả Enter lẫn click.',
        'const email = oEmail.value.trim(); if (email === "" || !email.includes("@")) { loi.textContent = "Email không hợp lệ."; ketQua.textContent = ""; return; } — nhánh đúng rồi form.reset();',
      ],
      khoiDau: {
        'index.html': TRANG('Nhận bản tin', `    <main>
      <h1>Nhận bản tin</h1>
      <form id="dang-ky" action="/dang-ky" method="post" novalidate>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email">
        <button type="submit">Đăng ký</button>
      </form>
      <p id="loi" role="alert"></p>
      <p id="ket-qua"></p>
    </main>`),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; }
#loi { color: rgb(185, 28, 28); }
`,
        'app.js': `// Bài 4.5 — Form đăng ký
const oEmail = document.querySelector("#email");
const ketQua = document.querySelector("#ket-qua");

document.querySelector("#dang-ky button").addEventListener("click", () => {
  ketQua.textContent = "Đã đăng ký: " + oEmail.value;
});
`,
      },
      loiGiai: {
        'index.html': TRANG('Nhận bản tin', `    <main>
      <h1>Nhận bản tin</h1>
      <form id="dang-ky" action="/dang-ky" method="post" novalidate>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email">
        <button type="submit">Đăng ký</button>
      </form>
      <p id="loi" role="alert"></p>
      <p id="ket-qua"></p>
    </main>`),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; }
#loi { color: rgb(185, 28, 28); }
`,
        'app.js': `// Bài 4.5 — Form đăng ký
const form = document.querySelector("#dang-ky");
const oEmail = document.querySelector("#email");
const loi = document.querySelector("#loi");
const ketQua = document.querySelector("#ket-qua");

// "submit" bắt MỌI cách gửi form: bấm nút, nhấn Enter trong ô nhập
form.addEventListener("submit", (e) => {
  e.preventDefault();               // chặn trình duyệt gửi form thật + tải lại trang

  const email = oEmail.value.trim();
  if (email === "" || !email.includes("@")) {
    loi.textContent = "Email không hợp lệ.";
    ketQua.textContent = "";        // xoá kết quả cũ (nếu có)
    return;
  }

  loi.textContent = "";             // xoá lỗi cũ (nếu có)
  ketQua.textContent = ´Đã đăng ký: @{email}´;
  form.reset();                     // đưa mọi ô của form về giá trị ban đầu
});
`,
      },
      giaiThich: `<p>Hành vi mặc định của form là gửi dữ liệu tới ${c('action')} rồi tải trang mới. Khi JavaScript tự xử lý, ${c('preventDefault()')} là dòng đầu tiên của handler. Lắng nghe ${c('submit')} trên chính form (không phải click của nút) bắt được mọi đường gửi — bàn phím, nút, trình đọc màn hình.</p>
<p>Máy chấm mô phỏng trình duyệt: submit không bị chặn ⇒ trang được dựng lại từ đầu và mọi thông báo mất — đúng điều người dùng thấy. Nó gửi form bằng nút và bằng ${c('requestSubmit')}, thử email trống / thiếu @ / hợp lệ, và kiểm lỗi cũ được xoá khi lần sau nhập đúng. (Kiểm "có @" chỉ là lớp đầu cho người dùng — máy chủ ở Chương 6 vẫn phải kiểm lại.)</p>`,
      loiHayGap: [
        'Gắn handler vào click của nút — Enter trong ô nhập không qua đó.',
        `Gọi ${c('e.preventDefault')} thiếu ${c('()')} — không làm gì.`,
        'Không xoá thông báo lỗi khi lần sau nhập đúng — trang hiện cùng lúc "không hợp lệ" và "đã đăng ký".',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event',
      kiem: [
        { moTa: 'Bấm Đăng ký: trang không tải lại', kiem: 'khong-tai-lai', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan@example.com' }, { hanhDong: 'click', selector: '#dang-ky button' }] },
        { moTa: 'Email hợp lệ → "Đã đăng ký: lan@example.com"', kiem: 'text', selector: '#ket-qua', giaTri: 'Đã đăng ký: lan@example.com', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan@example.com' }, { hanhDong: 'click', selector: '#dang-ky button' }] },
        { moTa: 'Ô nhập được xoá sau khi đăng ký', kiem: 'thuoc-tinh-js', selector: '#email', thuocTinh: 'value', giaTri: '', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan@example.com' }, { hanhDong: 'gui', selector: '#dang-ky' }] },
        { moTa: 'Thiếu @ → "Email không hợp lệ."', kiem: 'text', selector: '#loi', giaTri: 'Email không hợp lệ.', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan.example.com' }, { hanhDong: 'gui', selector: '#dang-ky' }] },
        { moTa: 'Trống → lỗi, không có kết quả', kiem: 'text', selector: '#ket-qua', giaTri: '', truoc: [{ hanhDong: 'gui', selector: '#dang-ky' }] },
        { moTa: 'Gửi bằng Enter (requestSubmit) cũng được xử lý', kiem: 'khong-tai-lai', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'a@b.vn' }, { hanhDong: 'gui', selector: '#dang-ky' }] },
        { moTa: 'Sai rồi đúng → lỗi cũ được xoá', kiem: 'text', selector: '#loi', giaTri: '', truoc: [{ hanhDong: 'gui', selector: '#dang-ky' }, { hanhDong: 'nhap', selector: '#email', giaTri: 'minh@fpt.edu.vn' }, { hanhDong: 'gui', selector: '#dang-ky' }], an: true },
        { moTa: 'Dùng preventDefault()', kiem: 'ma-nguon', tep: 'app.js', khop: '\\.preventDefault\\(\\s*\\)' },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Ủy quyền sự kiện: một listener cho cả danh sách',
      doKho: 'MEDIUM', phut: 20, chayScript: true,
      khaiNiem: ['event bubbling', 'event delegation', 'event.target', 'closest()', 'createElement'],
      tienQuyet: ['addEventListener', 'submit + preventDefault'],
      the: ['javascript', 'dom', 'event-delegation'],
      moTa: `<p>Bài 4.5: <em>"Sự kiện nổi bọt lên trên. Chính điều đó cho phép một listener trên danh sách xử lý cú bấm của cả trăm dòng."</em> Danh sách việc có nút ${c('.xoa')} ở mỗi dòng và form thêm việc mới. Code khởi đầu gắn listener cho <em>từng</em> nút lúc tải trang — nên những việc thêm SAU đó có nút Xoá bấm không ăn. Viết lại bằng một listener duy nhất trên ${c('#ds-viec')}.</p>`,
      yeuCau: [
        `Một ${c('addEventListener("click", …)')} trên ${c('#ds-viec')}; dùng ${c('e.target.closest(".xoa")')} để biết cú bấm có trúng nút Xoá không, rồi xoá ${c('<li>')} chứa nó.`,
        `Form ${c('#them-viec')}: chặn gửi, việc mới (đã trim, khác rỗng) thêm vào CUỐI danh sách với cùng cấu trúc ${c('<li><span class="ten">…</span> <button type="button" class="xoa">Xoá</button></li>')}; ô nhập xoá trắng.`,
        'Việc vừa thêm cũng xoá được (đó là lý do phải ủy quyền).',
        `Tên việc gán bằng ${c('textContent')}.`,
      ],
      dauVao: 'Các cú bấm Xoá và các lần thêm việc.',
      dauRa: 'Danh sách <li> cập nhật đúng.',
      rangBuoc: ['Không gắn listener cho từng nút .xoa.', 'Không dùng innerHTML để dựng dòng mới (dữ liệu người dùng gõ).'],
      viDu: [
        { input: 'Bấm Xoá ở dòng 2', output: 'Còn 2 việc: "Học Bài 4.5", "Đẩy code lên GitHub"', explanation: 'Cú bấm nổi bọt từ nút lên <ul>; listener của <ul> tìm <li> gần nhất và xoá.' },
        { input: 'Thêm "Ôn Chương 4", rồi bấm Xoá của chính nó', output: 'Còn 3 việc ban đầu', explanation: 'Nút mới không cần listener riêng.' },
      ],
      goiY: [
        'ds.addEventListener("click", (e) => { const nut = e.target.closest(".xoa"); if (!nut) return; nut.closest("li").remove(); });',
        'Dựng dòng mới: const li = document.createElement("li"); const ten = document.createElement("span"); ten.className = "ten"; ten.textContent = viec; … li.append(ten, " ", nut); ds.append(li);',
      ],
      khoiDau: {
        'index.html': TRANG('Việc cần làm', VIEC_HTML),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; }
#ds-viec li { padding: 4px 0; }
`,
        'app.js': `// Bài 4.5 — Ủy quyền sự kiện
const ds = document.querySelector("#ds-viec");
const form = document.querySelector("#them-viec");
const oViec = document.querySelector("#viec-moi");

// Gắn cho TỪNG nút lúc tải trang
document.querySelectorAll(".xoa").forEach((nut) => {
  nut.addEventListener("click", () => {
    nut.closest("li").remove();
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const li = document.createElement("li");
  li.textContent = oViec.value;
  ds.append(li);
});
`,
      },
      loiGiai: {
        'index.html': TRANG('Việc cần làm', VIEC_HTML),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; }
#ds-viec li { padding: 4px 0; }
`,
        'app.js': `// Bài 4.5 — Ủy quyền sự kiện
const ds = document.querySelector("#ds-viec");
const form = document.querySelector("#them-viec");
const oViec = document.querySelector("#viec-moi");

// MỘT listener trên danh sách: cú bấm vào bất kỳ nút con nào cũng nổi bọt lên đây,
// kể cả nút của những dòng được thêm SAU khi listener này đã gắn.
ds.addEventListener("click", (e) => {
  const nut = e.target.closest(".xoa");   // trúng nút Xoá (hoặc phần tử bên trong nó)?
  if (!nut) return;                        // bấm vào chỗ khác của danh sách: bỏ qua
  nut.closest("li").remove();
});

// Dựng một dòng mới bằng DOM — textContent cho phần chữ người dùng gõ
function taoDong(viec) {
  const li = document.createElement("li");
  const ten = document.createElement("span");
  ten.className = "ten";
  ten.textContent = viec;
  const nut = document.createElement("button");
  nut.type = "button";
  nut.className = "xoa";
  nut.textContent = "Xoá";
  li.append(ten, " ", nut);
  return li;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const viec = oViec.value.trim();
  if (viec === "") return;                 // không thêm dòng trống
  ds.append(taoDong(viec));                // thêm vào CUỐI danh sách
  form.reset();
});
`,
      },
      giaiThich: `<p>Một cú bấm vào nút đi ngược lên cây DOM: nút → ${c('<li>')} → ${c('<ul>')} → … → ${c('document')}; mọi listener trên đường đi đều được gọi. Ủy quyền tận dụng điều đó: đặt listener ở tổ tiên chung, rồi hỏi ${c('e.target')} (phần tử thật bị bấm) xem có phải thứ mình quan tâm không. ${c('closest(".xoa")')} đi ngược lên từ ${c('target')} — vẫn đúng khi nút có icon bên trong.</p>
<p>Lợi ích: một listener thay cho trăm cái, và phần tử thêm sau tự được phục vụ. Máy chấm xoá dòng giữa, thêm hai việc (một việc toàn dấu cách bị bỏ), xoá việc vừa thêm, và kiểm mã không còn ${c('querySelectorAll(".xoa")')}.</p>`,
      loiHayGap: [
        `So ${c('e.target.className === "xoa"')} — vỡ ngay khi nút có thêm class hoặc có phần tử con.`,
        `Xoá ${c('e.target')} thay vì ${c('<li>')} — chỉ mất cái nút, dòng còn nguyên.`,
        `Dựng dòng bằng ${c('innerHTML = ´<span>@{viec}</span>…´')} — chữ người dùng gõ thành HTML.`,
      ],
      thamKhao: 'https://javascript.info/event-delegation',
      kiem: [
        { moTa: 'Ban đầu có 3 việc', kiem: 'so-luong', selector: '#ds-viec li', giaTri: 3 },
        { moTa: 'Xoá dòng 2 → còn 2', kiem: 'so-luong', selector: '#ds-viec li', giaTri: 2, truoc: [{ hanhDong: 'click', selector: '#ds-viec li:nth-child(2) .xoa' }] },
        { moTa: 'Xoá đúng dòng 2', kiem: 'text', selector: '#ds-viec li:nth-child(2) .ten', giaTri: 'Đẩy code lên GitHub', truoc: [{ hanhDong: 'click', selector: '#ds-viec li:nth-child(2) .xoa' }] },
        { moTa: 'Thêm việc → cuối danh sách, đúng cấu trúc', kiem: 'text', selector: '#ds-viec li:last-child .ten', giaTri: 'Ôn Chương 4', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: '  Ôn Chương 4 ' }, { hanhDong: 'gui', selector: '#them-viec' }] },
        { moTa: 'Việc vừa thêm xoá được', kiem: 'so-luong', selector: '#ds-viec li', giaTri: 3, truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'Ôn Chương 4' }, { hanhDong: 'gui', selector: '#them-viec' }, { hanhDong: 'click', selector: '#ds-viec li:last-child .xoa' }] },
        { moTa: 'Việc toàn dấu cách không được thêm', kiem: 'so-luong', selector: '#ds-viec li', giaTri: 3, truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: '   ' }, { hanhDong: 'gui', selector: '#them-viec' }] },
        { moTa: 'Ô nhập được xoá sau khi thêm', kiem: 'thuoc-tinh-js', selector: '#viec-moi', thuocTinh: 'value', giaTri: '', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'X' }, { hanhDong: 'gui', selector: '#them-viec' }], an: true },
        { moTa: 'Không gắn listener cho từng nút .xoa', kiem: 'ma-nguon', tep: 'app.js', khop: 'querySelectorAll\\(\\s*["\']\\.xoa', phuDinh: true },
        { moTa: 'Không dùng innerHTML', kiem: 'ma-nguon', tep: 'app.js', khop: 'innerHTML', phuDinh: true, an: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Danh sách việc cần làm hoàn chỉnh: thêm, đánh dấu xong, xoá, đếm',
      doKho: 'HARD', phut: 35, chayScript: true,
      khaiNiem: ['trạng thái → giao diện', 'event delegation', 'sự kiện change', 'classList.toggle(…, force)', 'createElement'],
      tienQuyet: ['event delegation', 'submit + preventDefault', 'classList'],
      the: ['javascript', 'dom', 'project', 'event-delegation'],
      moTa: `<p>Bài tổng hợp Chương 4: dựng một ứng dụng việc cần làm thật sự chạy từ trang HTML trống. Mỗi dòng có ô đánh dấu, tên việc và nút xoá; đầu danh sách có dòng đếm ${c('#dem')}. Viết toàn bộ ${c('app.js')} (HTML và CSS có sẵn).</p>
<p>Cấu trúc một dòng (máy chấm đọc đúng cấu trúc này):</p>
<pre><code>&lt;li&gt;
  &lt;input type="checkbox" class="xong-chua" aria-label="Đánh dấu xong: Học DOM"&gt;
  &lt;span class="ten"&gt;Học DOM&lt;/span&gt;
  &lt;button type="button" class="xoa"&gt;Xoá&lt;/button&gt;
&lt;/li&gt;</code></pre>`,
      yeuCau: [
        `Thêm việc qua form ${c('#form-viec')} / ô ${c('#viec-moi')}: chặn gửi, trim, bỏ qua việc rỗng, thêm vào cuối, xoá ô nhập.`,
        `Tích ô ${c('.xong-chua')} → ${c('<li>')} có class ${c('xong')}; bỏ tích → gỡ class (dùng sự kiện ${c('change')}).`,
        `Nút ${c('.xoa')} xoá dòng — một listener ủy quyền trên ${c('#ds-viec')} cho cả click lẫn change.`,
        `${c('#dem')} luôn hiện ${c('"<n> việc chưa xong"')} — n là số dòng chưa có class ${c('xong')}; danh sách rỗng hiện ${c('"Không còn việc nào 🎉"')}. Cập nhật sau MỌI thay đổi, kể cả lúc tải trang.`,
        `Tên việc gán bằng ${c('textContent')}; ô đánh dấu có ${c('aria-label')} như mẫu.`,
      ],
      dauVao: 'Thao tác của người dùng: thêm, tích/bỏ tích, xoá.',
      dauRa: 'Danh sách <li> và dòng đếm luôn đúng.',
      rangBuoc: ['Không dùng innerHTML.', 'Không gắn listener riêng cho từng dòng.', 'Không có lỗi JS khi tải trang.'],
      viDu: [
        { input: 'Tải trang', output: '#dem: "Không còn việc nào 🎉"', explanation: 'Danh sách ban đầu trống.' },
        { input: 'Thêm "Học DOM", thêm "Làm bài 4.5"', output: '#dem: "2 việc chưa xong"', explanation: 'Hai dòng chưa xong.' },
        { input: 'Tích dòng 1', output: '<li class="xong">…, #dem: "1 việc chưa xong"', explanation: 'change nổi bọt lên #ds-viec.' },
      ],
      goiY: [
        'Viết một hàm capNhatDem() đếm ds.querySelectorAll("li:not(.xong)").length và tổng số li — gọi nó sau MỌI thay đổi và một lần lúc tải.',
        'Hai listener trên #ds-viec: "click" (tìm .xoa → xoá li) và "change" (tìm .xong-chua → li.classList.toggle("xong", e.target.checked)). Mỗi cái kết thúc bằng capNhatDem().',
      ],
      khoiDau: {
        'index.html': TRANG('Việc cần làm', `    <main>
      <h1>Việc cần làm</h1>
      <form id="form-viec" novalidate>
        <label for="viec-moi">Việc mới</label>
        <input id="viec-moi" autocomplete="off">
        <button type="submit">Thêm</button>
      </form>
      <p id="dem" aria-live="polite"></p>
      <ul id="ds-viec"></ul>
    </main>`),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; max-width: 480px; }
#ds-viec { list-style: none; padding: 0; }
#ds-viec li { display: flex; gap: 8px; align-items: center; padding: 6px 0; }
#ds-viec li.xong .ten { text-decoration: line-through; color: rgb(100, 116, 139); }
`,
        'app.js': `// Bài 4.5 — Việc cần làm (viết toàn bộ ở đây)
const ds = document.querySelector("#ds-viec");
`,
      },
      loiGiai: {
        'index.html': TRANG('Việc cần làm', `    <main>
      <h1>Việc cần làm</h1>
      <form id="form-viec" novalidate>
        <label for="viec-moi">Việc mới</label>
        <input id="viec-moi" autocomplete="off">
        <button type="submit">Thêm</button>
      </form>
      <p id="dem" aria-live="polite"></p>
      <ul id="ds-viec"></ul>
    </main>`),
        'styles.css': `main { font-family: system-ui, sans-serif; padding: 16px; max-width: 480px; }
#ds-viec { list-style: none; padding: 0; }
#ds-viec li { display: flex; gap: 8px; align-items: center; padding: 6px 0; }
#ds-viec li.xong .ten { text-decoration: line-through; color: rgb(100, 116, 139); }
`,
        'app.js': `// Bài 4.5 — Việc cần làm
const ds = document.querySelector("#ds-viec");
const form = document.querySelector("#form-viec");
const oViec = document.querySelector("#viec-moi");
const dem = document.querySelector("#dem");

// Đưa "trạng thái" (các <li> và class xong) lên dòng đếm. Gọi sau MỌI thay đổi.
function capNhatDem() {
  const tong = ds.querySelectorAll("li").length;
  const chuaXong = ds.querySelectorAll("li:not(.xong)").length;
  dem.textContent = tong === 0 ? "Không còn việc nào 🎉" : ´@{chuaXong} việc chưa xong´;
}

// Dựng một dòng bằng DOM — chữ người dùng gõ chỉ đi qua textContent / setAttribute
function taoDong(viec) {
  const li = document.createElement("li");

  const o = document.createElement("input");
  o.type = "checkbox";
  o.className = "xong-chua";
  o.setAttribute("aria-label", ´Đánh dấu xong: @{viec}´);

  const ten = document.createElement("span");
  ten.className = "ten";
  ten.textContent = viec;

  const nut = document.createElement("button");
  nut.type = "button";
  nut.className = "xoa";
  nut.textContent = "Xoá";

  li.append(o, ten, nut);
  return li;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();                       // xử lý bằng JS, không tải lại trang
  const viec = oViec.value.trim();
  if (viec === "") return;
  ds.append(taoDong(viec));
  form.reset();
  capNhatDem();
});

// Ủy quyền 1: nút Xoá của MỌI dòng, kể cả dòng thêm sau
ds.addEventListener("click", (e) => {
  const nut = e.target.closest(".xoa");
  if (!nut) return;
  nut.closest("li").remove();
  capNhatDem();
});

// Ủy quyền 2: sự kiện change của ô đánh dấu cũng nổi bọt lên danh sách
ds.addEventListener("change", (e) => {
  if (!e.target.matches(".xong-chua")) return;
  // toggle(class, force): force = true ⇒ thêm, false ⇒ gỡ — khớp đúng trạng thái ô
  e.target.closest("li").classList.toggle("xong", e.target.checked);
  capNhatDem();
});

capNhatDem();                               // trạng thái lúc vừa tải trang
`,
      },
      giaiThich: `<p>Bài này gom mọi ý của Chương 4 và thêm một nguyên tắc cho mọi giao diện: <strong>giao diện là hàm của trạng thái</strong>. Thay vì cộng/trừ biến đếm ở từng chỗ (dễ lệch), ${c('capNhatDem()')} <em>tính lại</em> từ DOM mỗi lần — một nguồn sự thật. React tổng quát hoá đúng ý này.</p>
<p>${c('change')} cũng nổi bọt, nên một listener trên danh sách xử lý mọi ô đánh dấu. ${c('classList.toggle("xong", checked)')} có tham số thứ hai ép trạng thái — class luôn khớp với ô, không phụ thuộc số lần bấm. Máy chấm chạy 9 kịch bản: thêm (có việc rỗng, có thẻ HTML), tích, bỏ tích, xoá dòng đã xong, xoá hết, và kiểm cấu trúc dòng + ${c('aria-label')}.</p>`,
      loiHayGap: [
        'Quên gọi capNhatDem() lúc tải trang — #dem trống cho tới thao tác đầu.',
        `Giữ biến đếm riêng (${c('let soViec')}) rồi quên trừ khi xoá một dòng đã xong.`,
        `Dùng ${c('classList.toggle("xong")')} không có force — lệch với ô khi trạng thái bị đổi bằng cách khác.`,
        'Gắn listener cho checkbox lúc tạo dòng — chạy được, nhưng trái yêu cầu ủy quyền và tốn bộ nhớ khi danh sách dài.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation',
      kiem: [
        { moTa: 'Tải trang không lỗi, đếm ban đầu "Không còn việc nào 🎉"', kiem: 'text', selector: '#dem', giaTri: 'Không còn việc nào 🎉' },
        { moTa: 'Không có lỗi JavaScript qua cả kịch bản', kiem: 'khong-loi-js', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'A' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'click', selector: '#ds-viec .xong-chua' }, { hanhDong: 'click', selector: '#ds-viec .xoa' }] },
        { moTa: 'Thêm hai việc → "2 việc chưa xong"', kiem: 'text', selector: '#dem', giaTri: '2 việc chưa xong', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'Học DOM' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'Làm bài 4.5' }, { hanhDong: 'gui', selector: '#form-viec' }] },
        { moTa: 'Cấu trúc dòng: checkbox có aria-label', kiem: 'thuoc-tinh', selector: '#ds-viec li .xong-chua', thuocTinh: 'aria-label', giaTri: 'Đánh dấu xong: Học DOM', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: ' Học DOM ' }, { hanhDong: 'gui', selector: '#form-viec' }] },
        { moTa: 'Tích dòng 1 → li.xong, đếm giảm', kiem: 'text', selector: '#dem', giaTri: '1 việc chưa xong', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'A' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'B' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'click', selector: '#ds-viec li:first-child .xong-chua' }] },
        { moTa: 'Tích dòng 1 → đúng dòng 1 có class xong', kiem: 'so-luong', selector: '#ds-viec li:first-child.xong', giaTri: 1, truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'A' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'B' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'click', selector: '#ds-viec li:first-child .xong-chua' }] },
        { moTa: 'Tích rồi bỏ tích → gỡ class', kiem: 'so-luong', selector: '#ds-viec li.xong', giaTri: 0, truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'A' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'click', selector: '#ds-viec .xong-chua', lan: 2 }] },
        { moTa: 'Xoá dòng đã xong → đếm vẫn đúng', kiem: 'text', selector: '#dem', giaTri: '1 việc chưa xong', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'A' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'B' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'click', selector: '#ds-viec li:first-child .xong-chua' }, { hanhDong: 'click', selector: '#ds-viec li:first-child .xoa' }] },
        { moTa: 'Xoá hết → "Không còn việc nào 🎉"', kiem: 'text', selector: '#dem', giaTri: 'Không còn việc nào 🎉', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: 'A' }, { hanhDong: 'gui', selector: '#form-viec' }, { hanhDong: 'click', selector: '#ds-viec .xoa' }] },
        { moTa: 'Việc rỗng không được thêm', kiem: 'so-luong', selector: '#ds-viec li', giaTri: 0, truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: '   ' }, { hanhDong: 'gui', selector: '#form-viec' }] },
        { moTa: 'Tên có thẻ HTML hiện nguyên văn', kiem: 'text', selector: '#ds-viec .ten', giaTri: '<img src=x>', truoc: [{ hanhDong: 'nhap', selector: '#viec-moi', giaTri: '<img src=x>' }, { hanhDong: 'gui', selector: '#form-viec' }], an: true },
        { moTa: 'Không dùng innerHTML', kiem: 'ma-nguon', tep: 'app.js', khop: 'innerHTML', phuDinh: true },
      ],
    },
  ],
});
