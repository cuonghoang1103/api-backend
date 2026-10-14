/** Bộ luyện bài 2.2 — Chữ, liên kết và ảnh. Lược đồ: ./_luoc-do.mjs */
import { c, code } from './_luoc-do.mjs';

const KHUNG = (title, body) => `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
  </head>
  <body>
${body}
  </body>
</html>
`;

export default {
  slug: 'wf-2-2-text-links-images',
  ten: '2.2 Chữ, liên kết và ảnh',
  baiHoc: 'Nền tảng Web — Bài 2.2 Chữ, liên kết và ảnh',
  ngonNgu: 'html',
  level: 'BEGINNER',
  moTa: 'Tiêu đề đúng cấp, đoạn văn, danh sách ul/ol, liên kết tương đối/tuyệt đối/neo, ảnh với alt — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Dàn ý công thức Bánh mì: tiêu đề đúng cấp, không nhảy cấp',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['h1–h6', 'dàn ý tài liệu', 'một h1 mỗi trang', 'p'],
      tienQuyet: ['bộ khung HTML5'],
      the: ['html', 'headings', 'outline'],
      moTa: `<p>Bài 2.2 dặn: <em>"Đừng nhảy cấp chỉ vì cỡ chữ."</em> Trang công thức dưới đây do một bạn viết theo cảm giác: tiêu đề trang dùng ${c('<h3>')} vì "h1 to quá", mục con dùng ${c('<h5>')} vì "nhỏ xinh", và một tiêu đề giả làm bằng ${c('<b>')}. Trình đọc màn hình và Google đọc ra một dàn ý méo. Hãy sắp lại cấp tiêu đề thành dàn ý thật.</p>`,
      yeuCau: [
        `Tiêu đề trang "Công thức Bánh mì" là ${c('<h1>')} — đúng một h1.`,
        `Ba mục "Nguyên liệu", "Các bước", "Mẹo nhỏ" là ${c('<h2>')}.`,
        `Mục con "Đồ chua" (thuộc "Nguyên liệu") là ${c('<h3>')}.`,
        `Bỏ tiêu đề giả ${c('<p><b>Mẹo nhỏ</b></p>')} — thay bằng tiêu đề thật.`,
        `Chữ thân bài nằm trong ${c('<p>')}.`,
      ],
      dauVao: 'index.html với tiêu đề sai cấp (h3, h5, b).',
      dauRa: 'Dàn ý: h1 Công thức Bánh mì → h2 Nguyên liệu → h3 Đồ chua → h2 Các bước → h2 Mẹo nhỏ.',
      rangBuoc: [
        'Không dùng CSS để chỉnh cỡ chữ — cỡ chữ không phải lý do chọn cấp.',
        'Giữ nguyên thứ tự và chữ của các mục.',
      ],
      viDu: [{
        input: '<h1>Công thức Bánh mì</h1>\n<h2>Nguyên liệu</h2>\n<h3>Đồ chua</h3>\n<h2>Các bước</h2>',
        output: 'Dàn ý (như trình đọc màn hình liệt kê):\n1 Công thức Bánh mì\n  2 Nguyên liệu\n    3 Đồ chua\n  2 Các bước',
        explanation: 'Mỗi cấp chỉ được sâu hơn cấp trước tối đa 1. Từ h3 quay về h2 thì được (đóng một mục con).',
      }],
      goiY: [
        'Viết dàn ý ra giấy trước: tên trang (cấp 1) → các phần lớn (cấp 2) → phần nhỏ bên trong phần lớn (cấp 3). Rồi mới gán thẻ.',
        'Đổi <h3>Công thức Bánh mì</h3> → <h1>, các <h5> mục lớn → <h2>, "Đồ chua" → <h3>, và <p><b>Mẹo nhỏ</b></p> → <h2>Mẹo nhỏ</h2>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Công thức Bánh mì', `    <h3>Công thức Bánh mì</h3>
    <h5>Nguyên liệu</h5>
    <p>Một ổ bánh mì, pa-tê, chả lụa, rau mùi.</p>
    <h6>Đồ chua</h6>
    <p>Cà rốt và củ cải ngâm giấm đường một đêm.</p>
    <h5>Các bước</h5>
    <p>Phết pa-tê, xếp chả, thêm đồ chua và rau.</p>
    <p><b>Mẹo nhỏ</b></p>
    <p>Nướng bánh hai phút cho vỏ giòn.</p>`),
      },
      loiGiai: {
        'index.html': KHUNG('Công thức Bánh mì', `    <!-- cấp 1: tên của cả trang — đúng MỘT h1 -->
    <h1>Công thức Bánh mì</h1>
    <!-- cấp 2: các phần lớn -->
    <h2>Nguyên liệu</h2>
    <p>Một ổ bánh mì, pa-tê, chả lụa, rau mùi.</p>
    <!-- cấp 3: phần nhỏ NẰM TRONG "Nguyên liệu" -->
    <h3>Đồ chua</h3>
    <p>Cà rốt và củ cải ngâm giấm đường một đêm.</p>
    <!-- quay về cấp 2: được phép (đóng mục con) -->
    <h2>Các bước</h2>
    <p>Phết pa-tê, xếp chả, thêm đồ chua và rau.</p>
    <!-- tiêu đề giả bằng b ⇒ tiêu đề thật -->
    <h2>Mẹo nhỏ</h2>
    <p>Nướng bánh hai phút cho vỏ giòn.</p>`),
      },
      giaiThich: `<p>Thẻ tiêu đề mô tả <strong>thứ bậc</strong>, không mô tả cỡ chữ. Người dùng trình đọc màn hình thường nghe danh sách tiêu đề trước để "lướt" trang — dàn ý đúng giúp họ nhảy thẳng tới "Các bước". Tiêu đề giả ${c('<p><b>…</b></p>')} nhìn đậm nhưng không có mặt trong dàn ý nào.</p>
<p>Máy chấm dùng kiểm ${c('tieu-de')}: đúng một h1, và không chỗ nào sâu hơn cấp trước quá 1 (h2 → h4 là trượt; h3 → h2 thì hợp lệ).</p>`,
      loiHayGap: [
        `Giữ ${c('<h3>')} cho tiêu đề trang vì "h1 to quá" — muốn nhỏ thì CSS ${c('font-size')}, không hạ cấp.`,
        `Đánh "Đồ chua" là ${c('<h2>')} — nó thành một phần ngang hàng "Nguyên liệu", mất quan hệ cha–con.`,
        `Dùng ${c('<strong>')} thay tiêu đề — strong là "quan trọng" trong câu, không phải tên một mục.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements',
      kiem: [
        { moTa: 'Đúng một h1 và không nhảy cấp tiêu đề', kiem: 'tieu-de' },
        { moTa: 'h1 là "Công thức Bánh mì"', kiem: 'text', selector: 'h1', giaTri: 'Công thức Bánh mì' },
        { moTa: 'Có đúng ba h2: Nguyên liệu, Các bước, Mẹo nhỏ', kiem: 'so-luong', selector: 'h2', giaTri: 3 },
        { moTa: 'h2 cuối là "Mẹo nhỏ"', kiem: 'text', selector: 'h2:last-of-type', giaTri: 'Mẹo nhỏ' },
        { moTa: '"Đồ chua" là h3', kiem: 'text', selector: 'h3', giaTri: 'Đồ chua' },
        { moTa: 'Không còn h4/h5/h6', kiem: 'khong-ton-tai', selector: 'h4, h5, h6' },
        { moTa: 'Không còn tiêu đề giả <p><b>', kiem: 'khong-ton-tai', selector: 'p > b:only-child' },
        { moTa: 'Bốn đoạn thân bài giữ nguyên', kiem: 'so-luong', selector: 'body > p', giaTri: 4 },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'ul hay ol? Danh sách nguyên liệu và các bước pha cà phê',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['ul', 'ol', 'li', 'thứ tự có ý nghĩa'],
      tienQuyet: ['tiêu đề và đoạn văn'],
      the: ['html', 'lists'],
      moTa: `<p>Bài 2.2: ${c('<ul>')} khi <em>thứ tự không quan trọng</em> (dấu chấm), ${c('<ol>')} khi <em>thứ tự quan trọng</em> (đánh số). Trang pha cà phê sữa đá đang viết danh sách bằng các dòng ${c('<p>')} có gạch đầu dòng gõ tay "- " và số gõ tay "1." — trông như danh sách nhưng với trình duyệt chỉ là chữ. Hãy đổi sang danh sách thật, chọn đúng loại.</p>`,
      yeuCau: [
        `Nguyên liệu (cà phê, sữa đặc, đá) thành ${c('<ul>')} — 3 mục ${c('<li>')}.`,
        `Các bước pha (4 bước) thành ${c('<ol>')} — 4 mục ${c('<li>')} theo đúng thứ tự.`,
        `Bỏ dấu "- " và số "1." gõ tay — trình duyệt tự vẽ.`,
        `Mọi ${c('<li>')} là con trực tiếp của ${c('<ul>')}/${c('<ol>')}.`,
      ],
      dauVao: 'index.html: 7 dòng <p> giả làm danh sách.',
      dauRa: 'Một danh sách chấm 3 mục và một danh sách đánh số 1–4.',
      rangBuoc: [
        'Không dùng <br> hay <p> bên trong danh sách để tạo dòng.',
        'Chữ của mỗi mục giữ nguyên (chỉ bỏ "- " và số đầu dòng).',
      ],
      viDu: [{
        input: '<ol>\n  <li>Pha cà phê phin</li>\n  <li>Cho sữa đặc vào ly</li>\n</ol>',
        output: '1. Pha cà phê phin\n2. Cho sữa đặc vào ly',
        explanation: 'Số do trình duyệt đánh: thêm/bớt một bước không phải sửa số tay.',
      }],
      goiY: [
        'Hỏi từng nhóm: "đổi thứ tự có làm sai ý không?" Nguyên liệu: không ⇒ ul. Các bước: có ⇒ ol.',
        'Khung: <ul><li>…</li> ×3</ul> và <ol><li>…</li> ×4</ol>. Xoá các <p> cũ.',
      ],
      khoiDau: {
        'index.html': KHUNG('Cà phê sữa đá', `    <h1>Cà phê sữa đá</h1>
    <h2>Nguyên liệu</h2>
    <p>- 25g cà phê phin</p>
    <p>- 2 thìa sữa đặc</p>
    <p>- Một ly đá viên</p>
    <h2>Cách pha</h2>
    <p>1. Pha cà phê phin trong 5 phút</p>
    <p>2. Cho sữa đặc vào ly</p>
    <p>3. Đổ cà phê vào, khuấy đều</p>
    <p>4. Thêm đá và thưởng thức</p>`),
      },
      loiGiai: {
        'index.html': KHUNG('Cà phê sữa đá', `    <h1>Cà phê sữa đá</h1>
    <h2>Nguyên liệu</h2>
    <!-- ul: đổi thứ tự không sai ý -->
    <ul>
      <li>25g cà phê phin</li>
      <li>2 thìa sữa đặc</li>
      <li>Một ly đá viên</li>
    </ul>
    <h2>Cách pha</h2>
    <!-- ol: thứ tự là nội dung; số do trình duyệt đánh -->
    <ol>
      <li>Pha cà phê phin trong 5 phút</li>
      <li>Cho sữa đặc vào ly</li>
      <li>Đổ cà phê vào, khuấy đều</li>
      <li>Thêm đá và thưởng thức</li>
    </ol>`),
      },
      giaiThich: `<p>Danh sách thật cho trình đọc màn hình nói "danh sách, 4 mục" trước khi đọc — người nghe biết còn bao nhiêu. Danh sách giả bằng ${c('<p>')} chỉ là bảy đoạn văn rời. ${c('<ol>')} còn tự đánh lại số khi bạn chèn bước mới, khỏi sửa tay.</p>
<p>Máy chấm kiểm cấu trúc (${c('ul > li')} ×3, ${c('ol > li')} ×4), kiểm chữ của mục đầu, và kiểm không còn dấu "- " hay "1." gõ tay trong chữ của mục.</p>`,
      loiHayGap: [
        `Để nguyên "1." trong ${c('<li>')} — hiện thành "1. 1. Pha cà phê".`,
        `Dùng ${c('<ol>')} cho nguyên liệu "cho có số" — số ngụ ý thứ tự mà nội dung không có.`,
        `Đặt chữ trực tiếp trong ${c('<ul>')} không có ${c('<li>')} — không hợp lệ, trình duyệt hiện lệch.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol',
      kiem: [
        { moTa: 'Có một ul với đúng 3 li', kiem: 'so-luong', selector: 'ul > li', giaTri: 3 },
        { moTa: 'Có một ol với đúng 4 li', kiem: 'so-luong', selector: 'ol > li', giaTri: 4 },
        { moTa: 'Mục đầu của ol là "Pha cà phê phin trong 5 phút"', kiem: 'text', selector: 'ol > li:first-child', giaTri: 'Pha cà phê phin trong 5 phút' },
        { moTa: 'Mục cuối của ol là bước thêm đá', kiem: 'text', selector: 'ol > li:last-child', giaTri: 'Thêm đá và thưởng thức' },
        { moTa: 'Không còn số gõ tay đầu mục', kiem: 'text', selector: 'li', khop: '^(?!\\d+\\.)' },
        { moTa: 'Không còn "- " gõ tay đầu mục', kiem: 'text', selector: 'li', khop: '^(?!-)' },
        { moTa: 'Không còn đoạn <p> giả làm danh sách', kiem: 'khong-ton-tai', selector: 'body > p' },
        { moTa: 'ul đứng trước ol (nguyên liệu trước cách pha)', kiem: 'thu-tu', cacSelector: ['ul', 'ol'] },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Ba kiểu liên kết: tương đối, tuyệt đối và mở tab mới an toàn',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['href tương đối', 'href tuyệt đối', 'target="_blank"', 'rel="noopener"'],
      tienQuyet: ['thuộc tính href'],
      the: ['html', 'links', 'a'],
      moTa: `<p>Bài 2.2 có bốn dòng liên kết mẫu: tương đối (${c('about.html')}), tuyệt đối (${c('https://…')}), neo (${c('#contact')}), và mở tab mới. Trang của câu lạc bộ cần một thanh liên kết gồm ba loại đầu và một liên kết ngoài mở tab mới. Người viết trước đã trộn lẫn: trang nội bộ viết bằng URL tuyệt đối tới localhost, trang ngoài lại thiếu ${c('https://')}.</p>`,
      yeuCau: [
        `"Giới thiệu" trỏ tới trang cùng site ${c('about.html')} bằng đường dẫn <strong>tương đối</strong>.`,
        `"Lịch sinh hoạt" trỏ tới ${c('lich.html')} (tương đối).`,
        `"Tài liệu MDN" trỏ tới ${c('https://developer.mozilla.org')} (tuyệt đối, có giao thức).`,
        `"Nhóm Facebook" trỏ tới ${c('https://facebook.com/groups/fcode')}, mở <strong>tab mới</strong> với ${c('target="_blank"')} và ${c('rel="noopener"')}.`,
      ],
      dauVao: 'Thanh liên kết 4 mục với href sai kiểu.',
      dauRa: 'Hai liên kết nội bộ tương đối, hai liên kết ngoài tuyệt đối; liên kết Facebook mở tab mới an toàn.',
      rangBuoc: [
        'Liên kết nội bộ không được chứa "localhost" hay "http".',
        'Chỉ liên kết Facebook mở tab mới (đừng ép mọi liên kết mở tab mới).',
      ],
      viDu: [{
        input: '<a href="developer.mozilla.org">Tài liệu MDN</a>',
        output: 'Bấm vào ⇒ trình duyệt mở https://cuongthai.com/clb/developer.mozilla.org ⇒ 404.',
        explanation: 'Thiếu "https://", trình duyệt coi đó là đường dẫn TƯƠNG ĐỐI tới một tệp tên "developer.mozilla.org" cạnh trang hiện tại.',
      }],
      goiY: [
        'Tương đối = chỉ tên tệp (tính từ thư mục của trang hiện tại). Tuyệt đối = bắt đầu bằng https://.',
        'Liên kết tab mới: <a href="https://facebook.com/groups/fcode" target="_blank" rel="noopener">Nhóm Facebook</a>.',
      ],
      khoiDau: {
        'index.html': KHUNG('CLB F-Code', `    <h1>CLB F-Code</h1>
    <!-- Sửa href của bốn liên kết -->
    <p>
      <a href="http://localhost:5500/about.html">Giới thiệu</a> ·
      <a href="http://localhost:5500/lich.html">Lịch sinh hoạt</a> ·
      <a href="developer.mozilla.org">Tài liệu MDN</a> ·
      <a href="facebook.com/groups/fcode">Nhóm Facebook</a>
    </p>`),
      },
      loiGiai: {
        'index.html': KHUNG('CLB F-Code', `    <h1>CLB F-Code</h1>
    <p>
      <!-- tương đối: tính từ thư mục của trang này, chạy được ở localhost lẫn trên mạng -->
      <a href="about.html">Giới thiệu</a> ·
      <a href="lich.html">Lịch sinh hoạt</a> ·
      <!-- tuyệt đối: site khác ⇒ phải có https:// -->
      <a href="https://developer.mozilla.org">Tài liệu MDN</a> ·
      <!-- tab mới: target="_blank"; rel="noopener" để trang mới không điều khiển được tab này -->
      <a href="https://facebook.com/groups/fcode" target="_blank" rel="noopener">Nhóm Facebook</a>
    </p>`),
      },
      giaiThich: `<p>Đường dẫn tương đối "đi theo" trang: chạy ở ${c('localhost:5500')} hay ở ${c('cuongthai.com')} đều đúng, vì nó tính từ thư mục hiện tại — đúng ý tưởng ${c('cd')} tương đối ở bài 1.1. Viết cứng ${c('http://localhost…')} thì lên mạng là hỏng hết.</p>
<p>Ngược lại, site khác bắt buộc có giao thức: thiếu ${c('https://')} thì chuỗi bị hiểu là tên tệp tương đối. ${c('rel="noopener"')} ngăn trang được mở dùng ${c('window.opener')} để đổi địa chỉ tab gốc (một kiểu lừa đảo gọi là reverse tabnabbing) — trình duyệt mới đã mặc định vậy, nhưng viết rõ là thói quen tốt và nhiều bộ kiểm vẫn đòi.</p>`,
      loiHayGap: [
        `Viết ${c('target="blank"')} (thiếu gạch dưới) — mở vào một tab tên "blank", lần bấm sau tái dùng tab đó.`,
        `Đặt ${c('target="_blank"')} cho mọi liên kết — người dùng mất nút Back quen thuộc.`,
        `Dùng ${c('/about.html')} (tương đối theo gốc) khi trang nằm trong thư mục con — trỏ nhầm về gốc site.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
      kiem: [
        { moTa: '"Giới thiệu" → about.html (tương đối)', kiem: 'ton-tai', selector: 'a[href="about.html"]' },
        { moTa: '"Lịch sinh hoạt" → lich.html (tương đối)', kiem: 'ton-tai', selector: 'a[href="lich.html"]' },
        { moTa: 'Không liên kết nào trỏ localhost', kiem: 'khong-ton-tai', selector: 'a[href*="localhost"]' },
        { moTa: 'MDN là URL tuyệt đối https://developer.mozilla.org', kiem: 'ton-tai', selector: 'a[href^="https://developer.mozilla.org"]' },
        { moTa: 'Facebook là URL tuyệt đối https://facebook.com/groups/fcode', kiem: 'ton-tai', selector: 'a[href="https://facebook.com/groups/fcode"]' },
        { moTa: 'Facebook mở tab mới (target="_blank")', kiem: 'thuoc-tinh', selector: 'a[href*="facebook.com"]', thuocTinh: 'target', giaTri: '_blank' },
        { moTa: 'Facebook có rel chứa noopener', kiem: 'thuoc-tinh', selector: 'a[href*="facebook.com"]', thuocTinh: 'rel', khop: '\\bnoopener\\b' },
        { moTa: 'Chỉ đúng một liên kết mở tab mới', kiem: 'so-luong', selector: 'a[target]', giaTri: 1 },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'alt có nghĩa hay alt rỗng? Sửa bộ ảnh của trang du lịch Đà Lạt',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['alt mang nội dung', 'alt="" cho ảnh trang trí', 'thiếu alt', 'width/height'],
      tienQuyet: ['thuộc tính src/alt'],
      the: ['html', 'img', 'alt', 'a11y'],
      moTa: `<p>Bẫy cuối bài 2.2: <em>${c('alt=""')} và thiếu hẳn ${c('alt')} mang ý nghĩa trái ngược nhau.</em> Alt rỗng là tuyên bố "ảnh trang trí, bỏ qua"; thiếu alt thì trình đọc màn hình đọc luôn tên tệp. Trang Đà Lạt có 5 ảnh: 3 ảnh mang nội dung, 1 đường viền hoa văn và 1 biểu tượng ngôi sao chỉ để đệm (chữ cạnh nó đã nói "Đánh giá 5 sao"). Hãy cho mỗi ảnh đúng loại alt.</p>`,
      yeuCau: [
        `Ba ảnh nội dung (${c('ho-xuan-huong.jpg')}, ${c('cho-dem.jpg')}, ${c('doi-che.jpg')}) có alt <strong>mô tả điều ảnh cho thấy</strong> (≥ 15 ký tự, không chứa "ảnh"/"hình" ở đầu, không là tên tệp).`,
        `Hai ảnh trang trí (${c('class="trang-tri"')}) có ${c('alt=""')} — rỗng nhưng <strong>có mặt</strong>.`,
        `Mọi ${c('<img>')} có ${c('width')} và ${c('height')}.`,
        `Không ${c('<img>')} nào thiếu thuộc tính ${c('alt')}.`,
      ],
      dauVao: '5 ảnh: vài cái thiếu alt, vài cái alt là tên tệp, ảnh trang trí có alt dài dòng.',
      dauRa: 'Trình đọc màn hình đọc 3 mô tả có ích và im lặng ở 2 ảnh trang trí.',
      rangBuoc: [
        'Không đổi src và class của ảnh.',
        'Không dùng title thay cho alt.',
      ],
      viDu: [{
        input: '<img src="doi-che.jpg">',
        output: 'Trình đọc màn hình: "doi gạch ngang che chấm j-p-g, hình ảnh".',
        explanation: 'Thiếu alt ⇒ nhiều trình đọc rơi về tên tệp.',
      }, {
        input: '<img src="vien-hoa-van.png" class="trang-tri" alt="">',
        output: 'Trình đọc màn hình: (im lặng, bỏ qua)',
        explanation: 'alt rỗng là chủ ý: ảnh không mang thông tin.',
      }],
      goiY: [
        'Với mỗi ảnh hỏi: "Nếu ảnh không tải, trang có mất thông tin không?" Có ⇒ viết alt mô tả. Không ⇒ alt="".',
        'alt tốt nói điều ảnh cho thấy trong ngữ cảnh: "Hồ Xuân Hương phủ sương sớm, hàng thông in bóng xuống mặt nước". Đừng mở đầu bằng "Ảnh của…" — trình đọc đã nói "hình ảnh" rồi.',
      ],
      khoiDau: {
        'index.html': KHUNG('Ba ngày ở Đà Lạt', `    <h1>Ba ngày ở Đà Lạt</h1>
    <img src="vien-hoa-van.png" class="trang-tri" alt="Đây là đường viền hoa văn trang trí màu xanh" width="600" height="24">
    <h2>Ngày 1: Hồ Xuân Hương</h2>
    <img src="ho-xuan-huong.jpg" width="600" height="400">
    <h2>Ngày 2: Chợ đêm</h2>
    <img src="cho-dem.jpg" alt="cho-dem.jpg" width="600" height="400">
    <h2>Ngày 3: Đồi chè Cầu Đất</h2>
    <img src="doi-che.jpg" alt="Ảnh">
    <p><img src="ngoi-sao.svg" class="trang-tri" width="16" height="16"> Đánh giá 5 sao</p>`),
      },
      loiGiai: {
        'index.html': KHUNG('Ba ngày ở Đà Lạt', `    <h1>Ba ngày ở Đà Lạt</h1>
    <!-- trang trí: alt rỗng CÓ MẶT ⇒ trình đọc bỏ qua -->
    <img src="vien-hoa-van.png" class="trang-tri" alt="" width="600" height="24">
    <h2>Ngày 1: Hồ Xuân Hương</h2>
    <!-- nội dung: mô tả điều ảnh cho thấy, không mở đầu bằng "ảnh" -->
    <img src="ho-xuan-huong.jpg" alt="Hồ Xuân Hương phủ sương sớm, hàng thông in bóng xuống mặt nước" width="600" height="400">
    <h2>Ngày 2: Chợ đêm</h2>
    <img src="cho-dem.jpg" alt="Dãy hàng nướng ở chợ đêm Đà Lạt đông người, khói bay dưới đèn vàng" width="600" height="400">
    <h2>Ngày 3: Đồi chè Cầu Đất</h2>
    <!-- thêm width/height để giữ chỗ khi ảnh tải -->
    <img src="doi-che.jpg" alt="Những luống chè xanh chạy vòng quanh sườn đồi Cầu Đất dưới trời nắng" width="600" height="400">
    <!-- ngôi sao chỉ đệm cho chữ đã nói "5 sao" ⇒ alt rỗng -->
    <p><img src="ngoi-sao.svg" class="trang-tri" alt="" width="16" height="16"> Đánh giá 5 sao</p>`),
      },
      giaiThich: `<p>Quy tắc quyết định: ảnh có mang thông tin mà chữ xung quanh chưa nói không? Ba ảnh phong cảnh có ⇒ cần mô tả. Viền hoa văn và ngôi sao thì không (chữ "Đánh giá 5 sao" đã nói hết) ⇒ ${c('alt=""')}. Viết alt dài cho ảnh trang trí làm người nghe phải ngồi nghe "đường viền hoa văn trang trí màu xanh" mỗi lần — tệ không kém thiếu alt.</p>
<p>Máy chấm phân biệt ba trạng thái: thiếu alt (${c('img:not([alt])')} phải rỗng), alt rỗng đúng chỗ (${c('img.trang-tri')} có alt bằng ""), và alt có nghĩa (dài ≥ 15 ký tự, không phải tên tệp, không mở đầu "Ảnh"/"Hình").</p>`,
      loiHayGap: [
        `Xoá hẳn alt của ảnh trang trí — trạng thái "thiếu alt", trình đọc đọc tên tệp "vien hoa van chấm png".`,
        `Viết ${c('alt="Ảnh hồ"')} — có alt nhưng gần như không có thông tin.`,
        `Lặp lại chú thích ngay dưới ảnh vào alt — người nghe nghe hai lần; alt nên bổ sung, không lặp.`,
      ],
      thamKhao: 'https://www.w3.org/WAI/tutorials/images/decision-tree/',
      kiem: [
        { moTa: 'Không ảnh nào thiếu thuộc tính alt', kiem: 'khong-ton-tai', selector: 'img:not([alt])' },
        { moTa: 'Hai ảnh trang trí có alt="" (rỗng)', kiem: 'thuoc-tinh', selector: 'img.trang-tri', thuocTinh: 'alt', giaTri: '' },
        { moTa: 'Đủ hai ảnh trang trí', kiem: 'so-luong', selector: 'img.trang-tri', giaTri: 2 },
        { moTa: 'Ba ảnh nội dung có alt ≥ 15 ký tự', kiem: 'thuoc-tinh', selector: 'img:not(.trang-tri)', thuocTinh: 'alt', khop: '^.{15,}$' },
        { moTa: 'alt ảnh nội dung không là tên tệp', kiem: 'thuoc-tinh', selector: 'img:not(.trang-tri)', thuocTinh: 'alt', khop: '^(?!.*\\.(jpe?g|png|svg|webp)\\b)' },
        { moTa: 'alt không mở đầu bằng "Ảnh"/"Hình"', kiem: 'thuoc-tinh', selector: 'img:not(.trang-tri)', thuocTinh: 'alt', khop: '^(?!\\s*(ảnh|hình)\\b)' },
        { moTa: 'Mọi ảnh có width', kiem: 'khong-ton-tai', selector: 'img:not([width])' },
        { moTa: 'Mọi ảnh có height', kiem: 'khong-ton-tai', selector: 'img:not([height])' },
        { moTa: 'Vẫn đủ 5 ảnh', kiem: 'so-luong', selector: 'img', giaTri: 5 },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Mục lục nhảy trong trang bằng href="#id"',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['liên kết neo', 'thuộc tính id', 'href="#…"', 'id duy nhất'],
      tienQuyet: ['liên kết tương đối/tuyệt đối', 'tiêu đề'],
      the: ['html', 'anchor', 'id', 'navigation'],
      moTa: `<p>Dòng thứ ba trong ví dụ liên kết của bài 2.2: ${c('<a href="#contact">Nhảy tới phần liên hệ</a>')} — liên kết tới một ${c('id')} trên cùng trang. Trang "Câu hỏi thường gặp" dài 4 mục, người đọc phải cuộn mãi. Hãy thêm mục lục ở đầu trang (mỗi dòng nhảy tới một mục) và nút "Về đầu trang" ở cuối mỗi mục.</p>`,
      yeuCau: [
        `Mỗi ${c('<h2>')} của 4 mục có một ${c('id')} ngắn, chữ thường, không dấu, nối bằng gạch ngang (vd ${c('id="hoc-phi"')}).`,
        `Đầu trang có ${c('<ul class="muc-luc">')} gồm 4 liên kết ${c('href="#…"')} trỏ đúng 4 id đó, đúng thứ tự.`,
        `${c('<h1>')} có ${c('id="dau-trang"')}; cuối mỗi mục có liên kết "Về đầu trang" trỏ ${c('#dau-trang')}.`,
        `Không có hai phần tử trùng id.`,
      ],
      dauVao: 'Trang FAQ 4 mục, chưa có id và mục lục.',
      dauRa: 'Bấm "Học phí" trong mục lục ⇒ trang cuộn tới mục Học phí; bấm "Về đầu trang" ⇒ cuộn lên tiêu đề.',
      rangBuoc: [
        'id không dấu, không khoảng trắng (khoảng trắng làm href khó viết và dễ hỏng).',
        'Mỗi id xuất hiện đúng một lần.',
        'Liên kết mục lục chỉ dùng #id, không viết tên tệp phía trước.',
      ],
      viDu: [{
        input: '<a href="#hoc-phi">Học phí</a>\n…\n<h2 id="hoc-phi">Học phí bao nhiêu?</h2>',
        output: 'Bấm "Học phí" ⇒ trang cuộn sao cho "Học phí bao nhiêu?" nằm ở mép trên; URL đổi thành …/faq.html#hoc-phi.',
        explanation: '# trong href nghĩa là "phần tử có id này trên trang hiện tại".',
      }],
      goiY: [
        'Làm hai bước: (1) gắn id cho 4 h2 và h1; (2) viết mục lục với href = "#" + đúng id đó. Chép id, đừng gõ lại — một chữ sai là neo chết.',
        'Mục lục: <ul class="muc-luc"><li><a href="#dang-ky">Đăng ký</a></li> … </ul>; cuối mục: <p><a href="#dau-trang">Về đầu trang</a></p>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Câu hỏi thường gặp', `    <h1>Câu hỏi thường gặp</h1>
    <!-- TODO: mục lục -->

    <h2>Đăng ký thế nào?</h2>
    <p>Điền biểu mẫu ở trang chủ, xác nhận email trong 24 giờ.</p>

    <h2>Học phí bao nhiêu?</h2>
    <p>Khoá nền tảng miễn phí; khoá nâng cao 199.000đ một tháng.</p>

    <h2>Có chứng chỉ không?</h2>
    <p>Có, sau khi hoàn thành bài kiểm tra cuối khoá.</p>

    <h2>Liên hệ ở đâu?</h2>
    <p>Gửi email tới hotro@vidu.com.</p>`),
      },
      loiGiai: {
        'index.html': KHUNG('Câu hỏi thường gặp', `    <!-- đích của "Về đầu trang" -->
    <h1 id="dau-trang">Câu hỏi thường gặp</h1>

    <!-- mục lục: href="#id" — đúng thứ tự các mục bên dưới -->
    <ul class="muc-luc">
      <li><a href="#dang-ky">Đăng ký</a></li>
      <li><a href="#hoc-phi">Học phí</a></li>
      <li><a href="#chung-chi">Chứng chỉ</a></li>
      <li><a href="#lien-he">Liên hệ</a></li>
    </ul>

    <!-- id: chữ thường, không dấu, nối bằng gạch ngang, duy nhất -->
    <h2 id="dang-ky">Đăng ký thế nào?</h2>
    <p>Điền biểu mẫu ở trang chủ, xác nhận email trong 24 giờ.</p>
    <p><a href="#dau-trang">Về đầu trang</a></p>

    <h2 id="hoc-phi">Học phí bao nhiêu?</h2>
    <p>Khoá nền tảng miễn phí; khoá nâng cao 199.000đ một tháng.</p>
    <p><a href="#dau-trang">Về đầu trang</a></p>

    <h2 id="chung-chi">Có chứng chỉ không?</h2>
    <p>Có, sau khi hoàn thành bài kiểm tra cuối khoá.</p>
    <p><a href="#dau-trang">Về đầu trang</a></p>

    <h2 id="lien-he">Liên hệ ở đâu?</h2>
    <p>Gửi email tới hotro@vidu.com.</p>
    <p><a href="#dau-trang">Về đầu trang</a></p>`),
      },
      giaiThich: `<p>Neo gồm hai nửa phải khớp từng ký tự: ${c('id="hoc-phi"')} trên đích và ${c('href="#hoc-phi"')} trên liên kết. Sai một chữ (vd ${c('#hocphi')}) thì bấm vào không có gì xảy ra — và không có thông báo lỗi nào. Vì vậy máy chấm dùng kiểm ${c('neo-hop-le')}: mọi ${c('href="#…"')} phải trỏ tới một id có thật.</p>
<p>id phải duy nhất trên trang: hai phần tử cùng id thì liên kết nhảy tới cái đầu tiên, và CSS/JS chọn theo id sẽ hành xử khó đoán. id không dấu, không khoảng trắng vì nó xuất hiện trong URL (${c('faq.html#hoc-phi')}) — người khác có thể chia sẻ đường dẫn nhảy thẳng vào mục.</p>`,
      loiHayGap: [
        `Đặt id lên ${c('<a>')} trong mục lục thay vì lên tiêu đề đích — liên kết nhảy tới chính nó.`,
        `Viết ${c('href="hoc-phi"')} thiếu dấu # — thành liên kết tương đối tới tệp "hoc-phi" ⇒ 404.`,
        `Dùng id có dấu cách ${c('id="hoc phi"')} — không hợp lệ, href phải mã hoá thành %20.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_element_on_the_same_page',
      kiem: [
        { moTa: 'Mục lục ul.muc-luc có 4 liên kết neo', kiem: 'so-luong', selector: 'ul.muc-luc a[href^="#"]', giaTri: 4 },
        { moTa: 'Mọi liên kết neo trỏ tới id có thật', kiem: 'neo-hop-le', selector: 'a[href^="#"]' },
        { moTa: 'Bốn h2 đều có id', kiem: 'so-luong', selector: 'h2[id]', giaTri: 4 },
        { moTa: 'id viết thường, không dấu, nối gạch ngang', kiem: 'thuoc-tinh', selector: '[id]', thuocTinh: 'id', khop: '^[a-z0-9]+(-[a-z0-9]+)*$' },
        { moTa: 'Mục lục đúng thứ tự: liên kết thứ 2 trỏ id của h2 thứ 2', kiem: 'ton-tai', selector: 'ul.muc-luc li:nth-child(2) a[href="#hoc-phi"]' },
        { moTa: 'h1 có id="dau-trang"', kiem: 'ton-tai', selector: 'h1#dau-trang' },
        { moTa: 'Có 4 liên kết "Về đầu trang"', kiem: 'so-luong', selector: 'a[href="#dau-trang"]', giaTri: 4 },
        { moTa: 'Mục lục nằm trước mục đầu tiên', kiem: 'thu-tu', cacSelector: ['h1', 'ul.muc-luc', 'h2'] },
        { moTa: 'Không có id trùng nhau (mỗi id một lần)', kiem: 'ma-nguon', tep: 'index.html', khop: '\\bid="([^"]+)"[\\s\\S]*\\bid="\\1"', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Trang hồ sơ cá nhân: tiêu đề, danh sách, liên kết ngoài và ảnh đại diện',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['h1–h3', 'ul/ol', 'a target rel', 'img alt width height', 'chọn thẻ theo nghĩa'],
      tienQuyet: ['các bài 1–5 của bộ này'],
      the: ['html', 'profile', 'tong-hop'],
      moTa: `<p>Bài tổng hợp của 2.2: dựng trang hồ sơ của bạn An từ bản nháp thuần chữ. Không có mã khởi đầu nào cho từng thẻ — bạn tự chọn thẻ theo <em>nghĩa</em> của từng mẩu nội dung, đúng tinh thần "đừng chọn thẻ theo vẻ ngoài". Bản nháp nằm trong chú thích của tệp.</p>
${code(`
An Nguyễn — Sinh viên Kỹ thuật phần mềm               ← tiêu đề trang
[ảnh an.jpg 160×160: An cười, đeo kính, áo đồng phục]
Giới thiệu                                             ← mục
  Mình học năm 2, thích làm web và chơi cầu lông.
Kỹ năng                                                ← mục
  HTML · CSS · Git                                     ← không cần thứ tự
Mục tiêu năm nay                                       ← mục
  Học xong Nền tảng Web → Làm 3 dự án → Đi thực tập    ← có thứ tự
  Chi tiết dự án                                       ← mục con của "Mục tiêu"
    (một đoạn ngắn tuỳ bạn)
Liên hệ                                                ← mục
  GitHub: https://github.com/an-nguyen  (mở tab mới)
  Email: mailto:an@vidu.com
`)}`,
      yeuCau: [
        `Đúng một ${c('<h1>')}; bốn mục là ${c('<h2>')}; "Chi tiết dự án" là ${c('<h3>')} nằm sau "Mục tiêu năm nay".`,
        `Ảnh ${c('an.jpg')} có alt mô tả, ${c('width="160"')}, ${c('height="160"')}.`,
        `Kỹ năng là ${c('<ul>')} 3 mục; mục tiêu là ${c('<ol>')} 3 mục.`,
        `Liên kết GitHub tuyệt đối, mở tab mới với ${c('rel="noopener"')}; liên kết email dùng ${c('href="mailto:an@vidu.com"')}.`,
        `Phần giới thiệu và chi tiết dự án là ${c('<p>')}.`,
      ],
      dauVao: 'index.html chỉ có bộ khung và bản nháp trong chú thích.',
      dauRa: 'Trang hồ sơ có dàn ý h1 → h2 ×4 (+ h3), ảnh đại diện, hai danh sách đúng loại, hai liên kết liên hệ.',
      rangBuoc: [
        'Không dùng <br> để xuống dòng giữa các mục danh sách.',
        'Không dùng <b> hay <font> làm tiêu đề.',
        'Liên kết email không mở tab mới.',
      ],
      viDu: [{
        input: '<a href="mailto:an@vidu.com">an@vidu.com</a>',
        output: 'Bấm vào ⇒ mở ứng dụng thư với người nhận an@vidu.com.',
        explanation: 'mailto: là một "giao thức" trong href giống https: — trình duyệt giao việc cho ứng dụng thư.',
      }],
      goiY: [
        'Gán thẻ cho từng dòng bản nháp trước khi gõ: tiêu đề trang → h1, mục → h2, mục con → h3, "không cần thứ tự" → ul, "có thứ tự" → ol, câu văn → p.',
        'Phần liên hệ có thể là <ul> hai mục, mỗi mục chứa một <a>. GitHub: <a href="https://github.com/an-nguyen" target="_blank" rel="noopener">GitHub</a>.',
      ],
      khoiDau: {
        'index.html': KHUNG('An Nguyễn — Hồ sơ', `    <!-- Dựng trang theo bản nháp trong đề bài. Bắt đầu từ h1. -->
`),
      },
      loiGiai: {
        'index.html': KHUNG('An Nguyễn — Hồ sơ', `    <!-- tiêu đề trang: đúng một h1 -->
    <h1>An Nguyễn — Sinh viên Kỹ thuật phần mềm</h1>
    <!-- ảnh mang nội dung: alt mô tả, width/height giữ chỗ -->
    <img src="an.jpg" alt="An cười tươi, đeo kính, mặc áo đồng phục trường" width="160" height="160">

    <h2>Giới thiệu</h2>
    <p>Mình học năm 2, thích làm web và chơi cầu lông.</p>

    <h2>Kỹ năng</h2>
    <!-- không cần thứ tự ⇒ ul -->
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>Git</li>
    </ul>

    <h2>Mục tiêu năm nay</h2>
    <!-- có thứ tự ⇒ ol -->
    <ol>
      <li>Học xong Nền tảng Web</li>
      <li>Làm 3 dự án</li>
      <li>Đi thực tập</li>
    </ol>
    <!-- mục con của "Mục tiêu" ⇒ h3 -->
    <h3>Chi tiết dự án</h3>
    <p>Một trang hồ sơ, một trang công thức nấu ăn và một trang quản lý chi tiêu nhỏ.</p>

    <h2>Liên hệ</h2>
    <ul>
      <!-- site ngoài: tuyệt đối + tab mới an toàn -->
      <li><a href="https://github.com/an-nguyen" target="_blank" rel="noopener">GitHub của An</a></li>
      <!-- mailto: mở ứng dụng thư, không cần tab mới -->
      <li><a href="mailto:an@vidu.com">an@vidu.com</a></li>
    </ul>`),
      },
      giaiThich: `<p>Không có thẻ nào được chọn vì vẻ ngoài: "HTML · CSS · Git" trong bản nháp viết trên một dòng nhưng nó là một <em>danh sách không thứ tự</em>; ba mục tiêu có mũi tên → nghĩa là có trình tự ⇒ ${c('<ol>')}. Ảnh đặt ngay sau h1 vì nó thuộc về cả trang.</p>
<p>Máy chấm kiểm dàn ý (một h1, không nhảy cấp, h3 nằm sau mục "Mục tiêu"), loại danh sách, thuộc tính của ảnh và liên kết. Liên kết email bị cấm ${c('target')} vì mở tab trống chỉ để gọi ứng dụng thư là trải nghiệm tệ.</p>`,
      loiHayGap: [
        `Viết kỹ năng là ${c('<p>HTML · CSS · Git</p>')} như bản nháp — mất cấu trúc danh sách.`,
        `Cho "Chi tiết dự án" là h2 — nó thành mục ngang hàng, không còn thuộc "Mục tiêu".`,
        `Viết ${c('href="an@vidu.com"')} thiếu ${c('mailto:')} — trình duyệt tìm tệp tên "an@vidu.com".`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/HTML_text_fundamentals',
      kiem: [
        { moTa: 'Đúng một h1 và không nhảy cấp tiêu đề', kiem: 'tieu-de' },
        { moTa: 'Bốn mục h2', kiem: 'so-luong', selector: 'h2', giaTri: 4 },
        { moTa: 'h3 "Chi tiết dự án" nằm sau h2 "Mục tiêu năm nay"', kiem: 'thu-tu', cacSelector: ['h2:nth-of-type(3)', 'h3'] },
        { moTa: 'Ảnh an.jpg có alt ≥ 10 ký tự', kiem: 'thuoc-tinh', selector: 'img[src="an.jpg"]', thuocTinh: 'alt', khop: '^.{10,}$' },
        { moTa: 'Ảnh có width="160" height="160"', kiem: 'ton-tai', selector: 'img[src="an.jpg"][width="160"][height="160"]' },
        { moTa: 'Kỹ năng là ul 3 mục', kiem: 'ton-tai', selector: 'ul:has(> li:nth-child(3):last-child)' },
        { moTa: 'Mục tiêu là ol 3 mục', kiem: 'so-luong', selector: 'ol > li', giaTri: 3 },
        { moTa: 'GitHub: tuyệt đối, tab mới, rel noopener', kiem: 'thuoc-tinh', selector: 'a[href="https://github.com/an-nguyen"][target="_blank"]', thuocTinh: 'rel', khop: '\\bnoopener\\b' },
        { moTa: 'Email dùng mailto:an@vidu.com', kiem: 'ton-tai', selector: 'a[href="mailto:an@vidu.com"]' },
        { moTa: 'Liên kết email không mở tab mới', kiem: 'khong-ton-tai', selector: 'a[href^="mailto:"][target]' },
        { moTa: 'Có ít nhất 2 đoạn p (giới thiệu, chi tiết dự án)', kiem: 'so-luong', selector: 'p', min: 2 },
        { moTa: 'Không dùng <br> hay <b> trong trang', kiem: 'khong-ton-tai', selector: 'br, b, font' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Mục lục khoá học lồng ba cấp với đường dẫn tương đối từ thư mục con',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['danh sách lồng nhau', 'li chứa ul/ol', 'đường dẫn tương đối ../', 'đường dẫn theo gốc /'],
      tienQuyet: ['ul/ol', 'đường dẫn tương đối (bài 1.1)'],
      the: ['html', 'nested-lists', 'relative-paths'],
      moTa: `<p>Trang này nằm ở ${c('/khoa-hoc/web/muc-luc.html')} trên site. Nó cần một mục lục ba cấp: chương (đánh số) → bài (đánh số) → tài liệu kèm theo (không thứ tự). Hai cái khó: (1) danh sách con phải nằm <strong>bên trong</strong> ${c('<li>')} của mục cha, không đứng cạnh nó; (2) mỗi liên kết phải viết đúng kiểu đường dẫn, tính từ thư mục ${c('/khoa-hoc/web/')}.</p>
${code(`
/                         (trang chủ)
/khoa-hoc/tai-lieu.html
/khoa-hoc/web/muc-luc.html          ← TRANG NÀY
/khoa-hoc/web/bai-1.html
/khoa-hoc/web/html/bai-2.html
/khoa-hoc/web/html/bai-3.html
/khoa-hoc/web/css/bai-4.html
`)}`,
      yeuCau: [
        `Danh sách ngoài cùng ${c('<ol class="muc-luc">')} có 2 chương: "Chương 1: HTML", "Chương 2: CSS".`,
        `Mỗi chương chứa một ${c('<ol>')} các bài <em>bên trong li của chương</em>: Chương 1 có bài 1, 2, 3; Chương 2 có bài 4.`,
        `Bài 2 chứa một ${c('<ul>')} (bên trong li của bài 2) gồm 2 tài liệu: "Tài liệu chung" → ${c('/khoa-hoc/tai-lieu.html')} viết <strong>tương đối</strong> bằng ${c('../')}, và "MDN" → ${c('https://developer.mozilla.org')}.`,
        `Liên kết bài viết tương đối từ thư mục hiện tại: ${c('bai-1.html')}, ${c('html/bai-2.html')}, ${c('html/bai-3.html')}, ${c('css/bai-4.html')}.`,
        `Cuối trang có liên kết "Trang chủ" viết theo gốc: ${c('href="/"')}.`,
      ],
      dauVao: 'Mục lục phẳng: ul/ol con đứng cạnh li (sai), đường dẫn viết tuyệt đối tới localhost.',
      dauRa: 'Mục lục thụt ba cấp đúng; mọi liên kết tới đúng tệp khi trang chạy ở bất kỳ tên miền nào.',
      rangBuoc: [
        'Không có <ul>/<ol> nào là con trực tiếp của <ul>/<ol> khác (phải nằm trong <li>).',
        'Không liên kết nội bộ nào chứa "http" hay "localhost".',
        'Không dùng ./ trước tên tệp (đúng nhưng thừa — giữ gọn).',
      ],
      viDu: [{
        input: '<ol>\n  <li>Chương 1</li>\n  <ol><li>Bài 1</li></ol>   ← sai: ol con đứng cạnh li\n</ol>',
        output: 'Nhìn gần giống, nhưng HTML không hợp lệ: ol chỉ được chứa li. Trình đọc màn hình đếm sai "danh sách 2 mục".',
        explanation: 'Đúng: <li>Chương 1 <ol><li>Bài 1</li></ol></li> — danh sách con là một phần nội dung của mục cha.',
      }, {
        input: 'Từ /khoa-hoc/web/muc-luc.html:\nhref="../tai-lieu.html"',
        output: '⇒ /khoa-hoc/tai-lieu.html',
        explanation: '../ lên một thư mục (web → khoa-hoc), y như cd .. ở bài 1.1.',
      }],
      goiY: [
        'Viết cấp 1 trước: <ol class="muc-luc"><li>Chương 1: HTML …</li><li>Chương 2: CSS …</li></ol>. Rồi chèn <ol> bài vào TRƯỚC </li> của mỗi chương, và chèn <ul> tài liệu vào trước </li> của bài 2.',
        'Đường dẫn: cùng thư mục ⇒ chỉ tên tệp; thư mục con ⇒ "html/bai-2.html"; thư mục cha ⇒ "../tai-lieu.html"; gốc site ⇒ "/".',
      ],
      khoiDau: {
        'index.html': KHUNG('Mục lục khoá Web', `    <h1>Mục lục khoá Web</h1>
    <ol class="muc-luc">
      <li>Chương 1: HTML</li>
      <ol>
        <li><a href="http://localhost:5500/khoa-hoc/web/bai-1.html">Bài 1: Phần tử và thẻ</a></li>
        <li><a href="http://localhost:5500/khoa-hoc/web/html/bai-2.html">Bài 2: Liên kết</a></li>
        <ul>
          <li><a href="http://localhost:5500/khoa-hoc/tai-lieu.html">Tài liệu chung</a></li>
          <li><a href="https://developer.mozilla.org">MDN</a></li>
        </ul>
        <li><a href="http://localhost:5500/khoa-hoc/web/html/bai-3.html">Bài 3: Ảnh</a></li>
      </ol>
      <li>Chương 2: CSS</li>
      <ol>
        <li><a href="http://localhost:5500/khoa-hoc/web/css/bai-4.html">Bài 4: Bộ chọn</a></li>
      </ol>
    </ol>
    <p><a href="http://localhost:5500/">Trang chủ</a></p>`),
      },
      loiGiai: {
        'index.html': KHUNG('Mục lục khoá Web', `    <h1>Mục lục khoá Web</h1>
    <!-- cấp 1: chương (có thứ tự) -->
    <ol class="muc-luc">
      <li>Chương 1: HTML
        <!-- cấp 2: ol NẰM TRONG li của chương, trước </li> -->
        <ol>
          <!-- cùng thư mục /khoa-hoc/web/ ⇒ chỉ tên tệp -->
          <li><a href="bai-1.html">Bài 1: Phần tử và thẻ</a></li>
          <!-- thư mục con html/ -->
          <li><a href="html/bai-2.html">Bài 2: Liên kết</a>
            <!-- cấp 3: tài liệu (không thứ tự) NẰM TRONG li của bài 2 -->
            <ul>
              <!-- thư mục cha: ../ (web → khoa-hoc) -->
              <li><a href="../tai-lieu.html">Tài liệu chung</a></li>
              <!-- site khác: tuyệt đối -->
              <li><a href="https://developer.mozilla.org">MDN</a></li>
            </ul>
          </li>
          <li><a href="html/bai-3.html">Bài 3: Ảnh</a></li>
        </ol>
      </li>
      <li>Chương 2: CSS
        <ol>
          <li><a href="css/bai-4.html">Bài 4: Bộ chọn</a></li>
        </ol>
      </li>
    </ol>
    <!-- theo gốc site: luôn về trang chủ dù trang này nằm sâu đến đâu -->
    <p><a href="/">Trang chủ</a></p>`),
      },
      giaiThich: `<p>Luật nội dung của HTML: ${c('<ul>')}/${c('<ol>')} chỉ được có con là ${c('<li>')}. Danh sách con là <em>một phần của mục cha</em> ("Bài 2, và đây là tài liệu của nó"), nên nó nằm trong ${c('<li>')} của mục cha, trước thẻ ${c('</li>')}. Đặt cạnh thì trình duyệt vẫn vẽ thụt lề (vì ul/ol có padding), nên lỗi này sống rất lâu trong mã — đến khi trình đọc màn hình đọc sai số mục hoặc CSS ${c('.muc-luc > li')} đếm hụt.</p>
<p>Ba kiểu đường dẫn có ba vai trò: tương đối theo tệp (${c('html/bai-2.html')}, ${c('../tai-lieu.html')}) đi theo vị trí trang; theo gốc (${c('/')}) luôn tính từ gốc tên miền; tuyệt đối (${c('https://…')}) cho site khác. Máy chấm kiểm cả cấu trúc lồng (${c('li > ol')}, cấm ${c('ol > ol')}/${c('ol > ul')}) và từng href.</p>`,
      loiHayGap: [
        `Đóng ${c('</li>')} của chương ngay sau chữ "Chương 1: HTML" rồi mới mở ${c('<ol>')} — ol con lại đứng cạnh li.`,
        `Viết ${c('href="/tai-lieu.html"')} — theo gốc thì trỏ tới ${c('/tai-lieu.html')}, không phải ${c('/khoa-hoc/tai-lieu.html')}.`,
        `Viết ${c('href="../html/bai-2.html"')} — lên một cấp rồi mới vào html/ ⇒ ${c('/khoa-hoc/html/bai-2.html')}, sai thư mục.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL',
      kiem: [
        { moTa: 'ol.muc-luc có đúng 2 chương (li con trực tiếp)', kiem: 'so-luong', selector: 'ol.muc-luc > li', giaTri: 2 },
        { moTa: 'Không có ul/ol là con trực tiếp của ul/ol', kiem: 'khong-ton-tai', selector: 'ul > ul, ul > ol, ol > ul, ol > ol' },
        { moTa: 'Chương 1 chứa ol 3 bài bên trong li', kiem: 'so-luong', selector: 'ol.muc-luc > li:nth-child(1) > ol > li', giaTri: 3 },
        { moTa: 'Chương 2 chứa ol 1 bài bên trong li', kiem: 'so-luong', selector: 'ol.muc-luc > li:nth-child(2) > ol > li', giaTri: 1 },
        { moTa: 'Bài 2 chứa ul 2 tài liệu bên trong li của nó', kiem: 'so-luong', selector: 'ol.muc-luc > li:nth-child(1) > ol > li:nth-child(2) > ul > li', giaTri: 2 },
        { moTa: 'Bài 1 → bai-1.html', kiem: 'ton-tai', selector: 'a[href="bai-1.html"]' },
        { moTa: 'Bài 2, 3 → html/bai-2.html, html/bai-3.html', kiem: 'so-luong', selector: 'a[href="html/bai-2.html"], a[href="html/bai-3.html"]', giaTri: 2 },
        { moTa: 'Bài 4 → css/bai-4.html', kiem: 'ton-tai', selector: 'a[href="css/bai-4.html"]' },
        { moTa: 'Tài liệu chung → ../tai-lieu.html', kiem: 'ton-tai', selector: 'a[href="../tai-lieu.html"]' },
        { moTa: 'Trang chủ → "/"', kiem: 'ton-tai', selector: 'a[href="/"]' },
        { moTa: 'Không còn liên kết localhost', kiem: 'khong-ton-tai', selector: 'a[href*="localhost"]' },
      ],
    },
  ],
};
