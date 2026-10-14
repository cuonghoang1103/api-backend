/** Bộ luyện bài 2.5 — Bảng, đa phương tiện và khả năng tiếp cận. Lược đồ: ./_luoc-do.mjs */
import { c, code } from './_luoc-do.mjs';

const KHUNG = (title, body, lang = 'vi') => `
<!DOCTYPE html>
<html lang="${lang}">
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
  slug: 'wf-2-5-tables-media-a11y',
  ten: '2.5 Bảng, đa phương tiện và khả năng tiếp cận',
  baiHoc: 'Nền tảng Web — Bài 2.5 Bảng, đa phương tiện và những điều cốt lõi về khả năng tiếp cận',
  ngonNgu: 'html',
  level: 'BEGINNER',
  moTa: 'table / thead / tbody / tr / th / td, video & audio có controls và phụ đề, danh sách kiểm khả năng tiếp cận — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Bảng giá đầu tiên: tr, th và td',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['table', 'tr', 'th', 'td', 'ô tiêu đề vs ô dữ liệu'],
      tienQuyet: ['phần tử lồng nhau'],
      the: ['html', 'table'],
      moTa: `<p>Bài 2.5: bảng dành cho <em>lưới dữ liệu thật</em> — bảng giá, thời khoá biểu. ${c('<tr>')} là một hàng, ${c('<th>')} là ô tiêu đề (in đậm, trình đọc màn hình đọc là "tiêu đề"), ${c('<td>')} là ô dữ liệu. Quán trà sữa đang viết bảng giá bằng các đoạn văn có dấu gạch đứng. Hãy dựng thành bảng thật.</p>
${code(`
Món            | Size M   | Size L
Trà sữa trân châu | 30.000đ | 38.000đ
Trà đào        | 28.000đ  | 35.000đ
Matcha latte   | 35.000đ  | 42.000đ
`)}`,
      yeuCau: [
        `Một ${c('<table>')} có 4 hàng ${c('<tr>')}: một hàng tiêu đề + 3 hàng món.`,
        `Hàng tiêu đề dùng 3 ô ${c('<th>')}: "Món", "Size M", "Size L".`,
        `Mỗi hàng món có 3 ô ${c('<td>')}.`,
        `Xoá các đoạn ${c('<p>')} giả bảng.`,
      ],
      dauVao: 'Bảng giá viết bằng 4 đoạn <p> với dấu "|".',
      dauRa: 'Bảng 3 cột × 4 hàng, hàng đầu in đậm.',
      rangBuoc: [
        'Mỗi hàng đúng 3 ô.',
        'Không dùng CSS.',
      ],
      viDu: [{
        input: '<tr>\n  <th>Món</th>\n  <th>Size M</th>\n  <th>Size L</th>\n</tr>',
        output: 'Món | Size M | Size L  (in đậm, căn giữa mặc định)',
        explanation: 'th là ô tiêu đề cột — trình đọc màn hình đọc "Size M" kèm mỗi giá khi người dùng đi dọc cột.',
      }],
      goiY: [
        'Khung: <table> rồi 4 × <tr>…</tr>. Trong hàng đầu dùng th, các hàng sau dùng td.',
        'Mỗi dấu "|" trong bản nháp là chỗ chuyển sang ô kế: <tr><td>Trà đào</td><td>28.000đ</td><td>35.000đ</td></tr>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Bảng giá', `    <h1>Bảng giá trà sữa</h1>
    <p>Món | Size M | Size L</p>
    <p>Trà sữa trân châu | 30.000đ | 38.000đ</p>
    <p>Trà đào | 28.000đ | 35.000đ</p>
    <p>Matcha latte | 35.000đ | 42.000đ</p>`),
      },
      loiGiai: {
        'index.html': KHUNG('Bảng giá', `    <h1>Bảng giá trà sữa</h1>
    <table>
      <!-- hàng tiêu đề: th = ô tiêu đề cột -->
      <tr>
        <th>Món</th>
        <th>Size M</th>
        <th>Size L</th>
      </tr>
      <!-- mỗi hàng dữ liệu: đúng 3 ô td, cùng thứ tự với tiêu đề -->
      <tr>
        <td>Trà sữa trân châu</td>
        <td>30.000đ</td>
        <td>38.000đ</td>
      </tr>
      <tr>
        <td>Trà đào</td>
        <td>28.000đ</td>
        <td>35.000đ</td>
      </tr>
      <tr>
        <td>Matcha latte</td>
        <td>35.000đ</td>
        <td>42.000đ</td>
      </tr>
    </table>`),
      },
      giaiThich: `<p>Bảng thật cho trình duyệt biết ô nào thuộc hàng nào, cột nào. Người dùng trình đọc màn hình có thể đi dọc cột "Size L" và nghe "Size L, 38.000đ", "Size L, 35.000đ" — với các đoạn ${c('<p>')} có dấu "|" thì chỉ nghe một chuỗi chữ dài kèm "gạch đứng".</p>
<p>Máy chấm đếm cấu trúc: 4 hàng, 3 ${c('th')} ở hàng đầu, 9 ${c('td')}, mọi hàng đúng 3 ô, và nội dung một ô mẫu.</p>`,
      loiHayGap: [
        `Dùng ${c('<td><strong>Món</strong></td>')} thay vì ${c('<th>')} — nhìn đậm như nhau, nhưng không còn là tiêu đề với trình đọc.`,
        `Quên một ${c('<td>')} ở một hàng — cả cột sau lệch sang trái.`,
        `Đặt chữ trực tiếp trong ${c('<tr>')} không qua ô — không hợp lệ, trình duyệt đẩy chữ ra ngoài bảng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics',
      kiem: [
        { moTa: 'Có một bảng 4 hàng', kiem: 'so-luong', selector: 'table tr', giaTri: 4 },
        { moTa: 'Hàng đầu có 3 ô th', kiem: 'so-luong', selector: 'table tr:first-child > th', giaTri: 3 },
        { moTa: 'Có 9 ô td', kiem: 'so-luong', selector: 'table td', giaTri: 9 },
        { moTa: 'Mọi hàng đúng 3 ô', kiem: 'khong-ton-tai', selector: 'table tr:not(:has(> :nth-child(3):last-child))' },
        { moTa: 'Ô tiêu đề thứ 3 là "Size L"', kiem: 'text', selector: 'table tr:first-child > th:nth-child(3)', giaTri: 'Size L' },
        { moTa: 'Giá Trà đào size L là 35.000đ', kiem: 'text', selector: 'table tr:nth-child(3) > td:nth-child(3)', giaTri: '35.000đ' },
        { moTa: 'Không còn đoạn p giả bảng', kiem: 'khong-ton-tai', selector: 'body > p' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Chia bảng làm hai phần: thead cho tiêu đề, tbody cho dữ liệu',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['thead', 'tbody', 'cấu trúc bảng', 'th trong thead'],
      tienQuyet: ['tr, th, td'],
      the: ['html', 'table', 'thead', 'tbody'],
      moTa: `<p>Ví dụ bảng trong bài 2.5 có hai vùng: ${c('<thead>')} bọc hàng tiêu đề, ${c('<tbody>')} bọc các hàng dữ liệu. Bảng các ngôn ngữ lập trình dưới đây có đủ hàng nhưng không chia vùng, và hàng tiêu đề lại dùng ${c('<td>')}. Hãy chia vùng và đổi ô tiêu đề cho đúng.</p>`,
      yeuCau: [
        `Hàng tiêu đề nằm trong ${c('<thead>')} và dùng ${c('<th>')}.`,
        `Ba hàng dữ liệu nằm trong ${c('<tbody>')}.`,
        `${c('<thead>')} đứng trước ${c('<tbody>')}.`,
        `Không đổi chữ trong ô.`,
      ],
      dauVao: 'Bảng 4 hàng ngay dưới <table>, hàng đầu dùng td.',
      dauRa: 'table > thead (1 hàng th) + tbody (3 hàng td).',
      rangBuoc: [
        'Chỉ một thead và một tbody.',
        'thead không chứa td.',
      ],
      viDu: [{
        input: '<table>\n  <thead><tr><th>Ngôn ngữ</th><th>Năm</th></tr></thead>\n  <tbody><tr><td>JavaScript</td><td>1995</td></tr></tbody>\n</table>',
        output: 'Ngôn ngữ | Năm\nJavaScript | 1995',
        explanation: 'Bảng dài in ra nhiều trang giấy: trình duyệt lặp lại thead ở đầu mỗi trang. CSS và JS cũng chọn riêng được vùng dữ liệu (tbody tr).',
      }],
      goiY: [
        'Bọc <tr> đầu tiên trong <thead>…</thead>, ba <tr> còn lại trong <tbody>…</tbody>.',
        'Trong hàng của thead, đổi <td> thành <th> (cả thẻ mở và đóng).',
      ],
      khoiDau: {
        'index.html': KHUNG('Ngôn ngữ lập trình', `    <h1>Ngôn ngữ lập trình và năm ra đời</h1>
    <table>
      <tr>
        <td>Ngôn ngữ</td>
        <td>Năm</td>
        <td>Dùng nhiều cho</td>
      </tr>
      <tr><td>JavaScript</td><td>1995</td><td>Web</td></tr>
      <tr><td>Python</td><td>1991</td><td>Dữ liệu, AI</td></tr>
      <tr><td>Java</td><td>1995</td><td>Doanh nghiệp, Android</td></tr>
    </table>`),
      },
      loiGiai: {
        'index.html': KHUNG('Ngôn ngữ lập trình', `    <h1>Ngôn ngữ lập trình và năm ra đời</h1>
    <table>
      <!-- vùng tiêu đề: một hàng th -->
      <thead>
        <tr>
          <th>Ngôn ngữ</th>
          <th>Năm</th>
          <th>Dùng nhiều cho</th>
        </tr>
      </thead>
      <!-- vùng dữ liệu: các hàng td -->
      <tbody>
        <tr><td>JavaScript</td><td>1995</td><td>Web</td></tr>
        <tr><td>Python</td><td>1991</td><td>Dữ liệu, AI</td></tr>
        <tr><td>Java</td><td>1995</td><td>Doanh nghiệp, Android</td></tr>
      </tbody>
    </table>`),
      },
      giaiThich: `<p>Thật ra trình duyệt luôn tự thêm một ${c('<tbody>')} vào cây DOM nếu bạn không viết — bạn có thể thấy nó trong DevTools. Vì vậy máy chấm không chỉ kiểm "có tbody" mà kiểm "hàng tiêu đề nằm trong thead và dùng th": đó là phần trình duyệt không thể đoán giùm.</p>
<p>Chia vùng giúp ba việc: in bảng dài (thead lặp lại mỗi trang giấy), tạo kiểu riêng (${c('thead th')} và ${c('tbody tr')}), và cho công nghệ trợ giúp biết đâu là tiêu đề cột.</p>`,
      loiHayGap: [
        `Bọc thead nhưng giữ ${c('<td>')} bên trong — có vùng tiêu đề mà ô không phải tiêu đề.`,
        `Đặt ${c('<thead>')} sau ${c('<tbody>')} — sai thứ tự nội dung của bảng.`,
        `Mỗi hàng một ${c('<tbody>')} — hợp lệ nhưng vô nghĩa ở đây; nhiều tbody dùng khi chia nhóm hàng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead',
      kiem: [
        { moTa: 'Có table > thead', kiem: 'so-luong', selector: 'table > thead', giaTri: 1 },
        { moTa: 'thead có 1 hàng với 3 th', kiem: 'so-luong', selector: 'thead > tr > th', giaTri: 3 },
        { moTa: 'thead không chứa td', kiem: 'khong-ton-tai', selector: 'thead td' },
        { moTa: 'tbody có 3 hàng', kiem: 'so-luong', selector: 'table > tbody > tr', giaTri: 3 },
        { moTa: 'thead đứng trước tbody', kiem: 'thu-tu', cacSelector: ['table > thead', 'table > tbody'] },
        { moTa: 'Viết thead trong mã nguồn (không phải trình duyệt tự thêm)', kiem: 'ma-nguon', tep: 'index.html', khop: '<thead>' },
        { moTa: 'Chữ ô giữ nguyên: tiêu đề cột 3', kiem: 'text', selector: 'thead th:nth-child(3)', giaTri: 'Dùng nhiều cho' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Video và audio có nút điều khiển, chữ dự phòng và phụ đề',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['video', 'audio', 'controls', 'nội dung dự phòng', 'track phụ đề'],
      tienQuyet: ['phần tử và thuộc tính'],
      the: ['html', 'media', 'video', 'audio', 'a11y'],
      moTa: `<p>Bài 2.5: <em>"Thuộc tính ${c('controls')} hiện nút phát/dừng. Chữ bên trong là phương án dự phòng nếu media không tải được. Thêm phụ đề cho video bằng phần tử ${c('<track>')}."</em> Trang bài giảng có một video tự phát, không có nút, không phụ đề, và một file âm thanh người dùng không có cách nào bấm nghe. Sửa cả hai.</p>`,
      yeuCau: [
        `${c('<video src="bai-giang.mp4">')} có ${c('controls')} và ${c('width="640"')}; bỏ ${c('autoplay')}.`,
        `Bên trong video có chữ dự phòng "Trình duyệt của bạn không phát được video này."`,
        `Bên trong video có ${c('<track kind="captions" src="phu-de.vtt" srclang="vi" label="Tiếng Việt">')}.`,
        `${c('<audio src="tom-tat.mp3">')} có ${c('controls')} và chữ dự phòng.`,
      ],
      dauVao: 'video autoplay không controls, audio không controls.',
      dauRa: 'Video có thanh điều khiển và nút CC bật phụ đề tiếng Việt; audio có trình phát nhỏ.',
      rangBuoc: [
        'Không dùng autoplay (nội dung tự phát gây khó chịu và chặn trình đọc màn hình).',
        'track là con của video, không phải anh em.',
      ],
      viDu: [{
        input: '<audio src="tom-tat.mp3"></audio>',
        output: '(không hiện gì trên trang — không bấm nghe được)',
        explanation: 'Không có controls, audio là vô hình.',
      }, {
        input: '<audio src="tom-tat.mp3" controls>Trình duyệt của bạn không phát được âm thanh này.</audio>',
        output: '[▶ 0:00 / 2:15 ─────○ 🔊]',
        explanation: 'controls hiện trình phát mặc định của trình duyệt.',
      }],
      goiY: [
        'controls và autoplay là thuộc tính boolean: có mặt là bật, không cần giá trị. Xoá chữ autoplay đi là tắt.',
        'Cấu trúc: <video src="…" controls width="640"><track kind="captions" src="phu-de.vtt" srclang="vi" label="Tiếng Việt">Chữ dự phòng</video>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Bài giảng 2.5', `    <h1>Bài giảng 2.5</h1>
    <video src="bai-giang.mp4" autoplay></video>
    <h2>Bản tóm tắt nghe</h2>
    <audio src="tom-tat.mp3"></audio>`),
      },
      loiGiai: {
        'index.html': KHUNG('Bài giảng 2.5', `    <h1>Bài giảng 2.5</h1>
    <!-- controls: nút phát/dừng/âm lượng; không autoplay -->
    <video src="bai-giang.mp4" controls width="640">
      <!-- phụ đề: kind captions, ngôn ngữ vi, tên hiện trong menu CC -->
      <track kind="captions" src="phu-de.vtt" srclang="vi" label="Tiếng Việt">
      <!-- chữ dự phòng: chỉ hiện khi trình duyệt không phát được -->
      Trình duyệt của bạn không phát được video này.
    </video>
    <h2>Bản tóm tắt nghe</h2>
    <audio src="tom-tat.mp3" controls>
      Trình duyệt của bạn không phát được âm thanh này.
    </audio>`),
      },
      giaiThich: `<p>${c('controls')} trao quyền cho người dùng: dừng, tua, chỉnh âm lượng, toàn màn hình — dùng được cả bằng bàn phím. ${c('autoplay')} làm ngược lại: âm thanh tự phát đè lên giọng của trình đọc màn hình, và nhiều trình duyệt chặn nó luôn. Chữ dự phòng là "alt" của media.</p>
<p>${c('<track kind="captions">')} cho người khiếm thính (và người xem nơi công cộng không bật loa) đọc được lời. Máy chấm kiểm: có controls, không autoplay, track nằm <em>trong</em> video với đủ thuộc tính, và chữ dự phòng.</p>`,
      loiHayGap: [
        `Viết ${c('controls="false"')} để tắt — thuộc tính boolean có mặt là bật, kể cả giá trị "false".`,
        `Đặt ${c('<track>')} ngoài ${c('</video>')} — nó không gắn với video nào.`,
        `Viết ${c('</track>')} — track là phần tử rỗng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track',
      kiem: [
        { moTa: 'video có controls', kiem: 'ton-tai', selector: 'video[src="bai-giang.mp4"][controls]' },
        { moTa: 'video rộng 640', kiem: 'thuoc-tinh', selector: 'video', thuocTinh: 'width', giaTri: '640' },
        { moTa: 'Không còn autoplay', kiem: 'khong-ton-tai', selector: '[autoplay]' },
        { moTa: 'track phụ đề tiếng Việt là con của video', kiem: 'ton-tai', selector: 'video > track[kind="captions"][src="phu-de.vtt"][srclang="vi"][label]' },
        { moTa: 'video có chữ dự phòng', kiem: 'text', selector: 'video', khop: 'không phát được video' },
        { moTa: 'audio có controls', kiem: 'ton-tai', selector: 'audio[src="tom-tat.mp3"][controls]' },
        { moTa: 'audio có chữ dự phòng', kiem: 'text', selector: 'audio', khop: '\\S{3,}' },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Gỡ bảng dàn trang kiểu thập niên 90 thành landmark',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['bảng không dùng để dàn trang', 'landmark', 'aside', 'main'],
      tienQuyet: ['bài 2.3 cấu trúc ngữ nghĩa'],
      the: ['html', 'table', 'layout', 'semantic', 'refactor'],
      moTa: `<p>Bài 2.5 nói thẳng: <em>"Đừng bao giờ dùng bảng để dàn trang. Đó là chiêu của thập niên 1990."</em> Trang cũ của câu lạc bộ dàn đầu trang, cột trái, nội dung, chân trang bằng một ${c('<table>')} 3 hàng. Trình đọc màn hình đọc nó như một bảng dữ liệu ("bảng, 3 hàng, 2 cột") — hoàn toàn sai. Gỡ bảng và dùng landmark của bài 2.3; vị trí cột trái sẽ do CSS lo ở Chương 3.</p>`,
      yeuCau: [
        `Không còn ${c('<table>')}, ${c('<tr>')}, ${c('<td>')} nào.`,
        `Ô đầu trang ⇒ ${c('<header>')} (h1 + nav), ô cột trái ⇒ ${c('<aside>')}, ô nội dung ⇒ ${c('<main>')}, ô cuối ⇒ ${c('<footer>')}.`,
        `Giữ nguyên toàn bộ nội dung bên trong các ô.`,
        `Thứ tự trong body: header → main → aside → footer (nội dung chính trước nội dung bên lề — vị trí trái/phải là việc của CSS).`,
      ],
      dauVao: 'Trang dàn bằng table: hàng 1 (colspan 2) đầu trang, hàng 2 hai ô (menu | nội dung), hàng 3 chân trang.',
      dauRa: 'body > header, main, aside, footer — không còn bảng.',
      rangBuoc: [
        'Không dùng div thay cho các ô — mỗi ô có một landmark phù hợp.',
        'Không mất liên kết nào trong menu.',
      ],
      viDu: [{
        input: '<table>\n  <tr><td colspan="2"><h1>CLB</h1></td></tr>\n  <tr><td>menu</td><td>nội dung</td></tr>\n</table>',
        output: 'Trình đọc màn hình: "bảng, 2 hàng, 2 cột. Hàng 1, cột 1: CLB…"',
        explanation: 'Bảng nói với công nghệ trợ giúp rằng đây là dữ liệu dạng lưới — người nghe bị bắt đi theo hàng/cột vô nghĩa.',
      }],
      goiY: [
        'Làm từng ô: lấy NỘI DUNG bên trong <td> (không lấy td), bọc vào landmark tương ứng, rồi xoá cả bảng.',
        'Ô cột trái chứa danh sách liên kết "Liên quan" ⇒ aside. Đặt aside sau main trong mã; Chương 3 sẽ đưa nó sang trái bằng Grid.',
      ],
      khoiDau: {
        'index.html': KHUNG('CLB F-Code', `    <table width="100%" border="0">
      <tr>
        <td colspan="2">
          <h1>CLB F-Code</h1>
          <nav><a href="/">Trang chủ</a> · <a href="/su-kien">Sự kiện</a></nav>
        </td>
      </tr>
      <tr>
        <td width="200">
          <h2>Liên quan</h2>
          <ul>
            <li><a href="/thanh-vien">Thành viên</a></li>
            <li><a href="/tai-lieu">Tài liệu</a></li>
          </ul>
        </td>
        <td>
          <h2>Tuần này</h2>
          <p>Workshop HTML ngữ nghĩa tối thứ Năm.</p>
        </td>
      </tr>
      <tr>
        <td colspan="2"><p>© 2026 CLB F-Code</p></td>
      </tr>
    </table>`),
      },
      loiGiai: {
        'index.html': KHUNG('CLB F-Code', `    <!-- ô đầu trang ⇒ header (banner) -->
    <header>
      <h1>CLB F-Code</h1>
      <nav><a href="/">Trang chủ</a> · <a href="/su-kien">Sự kiện</a></nav>
    </header>
    <!-- nội dung chính đứng TRƯỚC trong mã: người dùng bàn phím/trình đọc gặp nó sớm -->
    <main>
      <h2>Tuần này</h2>
      <p>Workshop HTML ngữ nghĩa tối thứ Năm.</p>
    </main>
    <!-- cột trái cũ ⇒ aside; nằm bên trái hay phải là việc của CSS (bài 3.4) -->
    <aside>
      <h2>Liên quan</h2>
      <ul>
        <li><a href="/thanh-vien">Thành viên</a></li>
        <li><a href="/tai-lieu">Tài liệu</a></li>
      </ul>
    </aside>
    <!-- ô cuối ⇒ footer (contentinfo) -->
    <footer>
      <p>© 2026 CLB F-Code</p>
    </footer>`),
      },
      giaiThich: `<p>Bảng dàn trang gộp hai việc khác nhau vào một: <em>cấu trúc</em> (đây là đầu trang, đây là menu) và <em>vị trí</em> (menu bên trái, rộng 200px). HTML hiện đại tách chúng: landmark nói cấu trúc, CSS (Grid ở bài 3.4) nói vị trí. Nhờ vậy thứ tự trong mã được chọn theo ý nghĩa — main trước aside — mà trên màn hình aside vẫn nằm bên trái được.</p>
<p>Máy chấm kiểm không còn phần tử bảng nào, đủ bốn landmark là con của body đúng thứ tự, và nội dung (liên kết, tiêu đề) còn nguyên.</p>`,
      loiHayGap: [
        `Đổi ${c('<td>')} thành ${c('<div>')} và giữ ${c('<tr>')} — vẫn là bảng trá hình, lại thêm HTML không hợp lệ.`,
        `Giữ thuộc tính ${c('width="200"')} chuyển sang aside — kích thước là việc của CSS.`,
        `Đặt aside trước main "cho giống màn hình" — cấu trúc nên theo ý nghĩa, không theo vị trí.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics#when_should_you_not_use_html_tables',
      kiem: [
        { moTa: 'Không còn table/tr/td', kiem: 'khong-ton-tai', selector: 'table, tr, td' },
        { moTa: 'header có h1 và nav', kiem: 'ton-tai', selector: 'body > header > h1 + nav' },
        { moTa: 'main chứa "Tuần này"', kiem: 'text', selector: 'body > main > h2', giaTri: 'Tuần này' },
        { moTa: 'aside chứa danh sách 2 liên kết', kiem: 'so-luong', selector: 'body > aside li > a', giaTri: 2 },
        { moTa: 'Thứ tự header → main → aside → footer', kiem: 'thu-tu', cacSelector: ['body > header', 'body > main', 'body > aside', 'body > footer'] },
        { moTa: 'Không dùng div thay ô', kiem: 'khong-ton-tai', selector: 'div' },
        { moTa: 'Không còn thuộc tính dàn trang width/border/colspan', kiem: 'khong-ton-tai', selector: '[width], [border], [colspan]' },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Thời khoá biểu: bảng có tiêu đề cột và tiêu đề hàng',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['th làm tiêu đề hàng', 'thead / tbody', 'ô trống', 'đọc bảng hai chiều'],
      tienQuyet: ['thead / tbody'],
      the: ['html', 'table', 'schedule'],
      moTa: `<p>Thời khoá biểu là ví dụ "lưới dữ liệu thật" mà bài 2.5 nêu tên. Khác bảng giá, mỗi ô ở đây cần <strong>hai</strong> tiêu đề để hiểu: "Thứ Ba" (cột) và "Ca 2" (hàng). Vì vậy ô đầu của mỗi hàng trong tbody cũng là ${c('<th>')}. Dựng thời khoá biểu từ dữ liệu sau.</p>
${code(`
          Thứ Hai     Thứ Ba      Thứ Tư      Thứ Năm     Thứ Sáu
Ca 1      PRF192      MAE101      PRF192      (trống)     CEA201
Ca 2      CSI104      (trống)     CSI104      MAE101      SSL101c
Ca 3      (trống)     CEA201      (trống)     SSL101c     (trống)
`)}`,
      yeuCau: [
        `${c('<thead>')} có một hàng 6 ô ${c('<th>')}: ô góc trên trái để trống, rồi 5 ngày.`,
        `${c('<tbody>')} có 3 hàng; ô đầu mỗi hàng là ${c('<th>')} ("Ca 1", "Ca 2", "Ca 3"), 5 ô còn lại là ${c('<td>')}.`,
        `Ô "(trống)" là ${c('<td></td>')} rỗng — không bỏ ô (bỏ là lệch cột).`,
        `Mã môn đúng vị trí như bảng.`,
      ],
      dauVao: 'Chỉ có tiêu đề trang và <table> rỗng.',
      dauRa: 'Lưới 6 cột × 4 hàng, hàng đầu và cột đầu đều là ô tiêu đề.',
      rangBuoc: [
        'Mỗi hàng đúng 6 ô.',
        'Không viết chữ "(trống)" vào ô.',
      ],
      viDu: [{
        input: '<tr>\n  <th>Ca 2</th>\n  <td>CSI104</td>\n  <td></td>\n  …\n</tr>',
        output: 'Trình đọc màn hình ở ô CSI104: "Ca 2, Thứ Hai, CSI104".',
        explanation: 'Có tiêu đề cột (thead th) và tiêu đề hàng (th đầu hàng) — người nghe biết ô đó ở đâu.',
      }],
      goiY: [
        'Đếm trước: mỗi hàng 6 ô. Hàng thead: <th></th> + 5 ngày. Mỗi hàng tbody: <th>Ca n</th> + 5 ô td.',
        'Ô trống vẫn phải có <td></td> — nếu bỏ, các môn phía sau sẽ dồn sang trái một cột.',
      ],
      khoiDau: {
        'index.html': KHUNG('Thời khoá biểu', `    <h1>Thời khoá biểu học kỳ 1</h1>
    <table>
      <!-- thead: ô góc + 5 ngày; tbody: 3 ca -->
    </table>`),
      },
      loiGiai: {
        'index.html': KHUNG('Thời khoá biểu', `    <h1>Thời khoá biểu học kỳ 1</h1>
    <table>
      <thead>
        <tr>
          <th></th>          <!-- ô góc: không là tiêu đề của gì cả -->
          <th>Thứ Hai</th>
          <th>Thứ Ba</th>
          <th>Thứ Tư</th>
          <th>Thứ Năm</th>
          <th>Thứ Sáu</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Ca 1</th>      <!-- tiêu đề HÀNG: th ở đầu hàng -->
          <td>PRF192</td>
          <td>MAE101</td>
          <td>PRF192</td>
          <td></td>          <!-- ô trống vẫn phải có, nếu không cả hàng lệch cột -->
          <td>CEA201</td>
        </tr>
        <tr>
          <th>Ca 2</th>
          <td>CSI104</td>
          <td></td>
          <td>CSI104</td>
          <td>MAE101</td>
          <td>SSL101c</td>
        </tr>
        <tr>
          <th>Ca 3</th>
          <td></td>
          <td>CEA201</td>
          <td></td>
          <td>SSL101c</td>
          <td></td>
        </tr>
      </tbody>
    </table>`),
      },
      giaiThich: `<p>Bảng hai chiều cần tiêu đề ở cả hai trục. ${c('<th>')} không chỉ dành cho hàng đầu: đặt ở đầu mỗi hàng, nó làm tiêu đề hàng — trình duyệt tự suy ra (với bảng đơn giản như thế này) rằng th trong thead là tiêu đề cột, th đầu hàng trong tbody là tiêu đề hàng.</p>
<p>Ô trống là chỗ người mới hay sai: bảng HTML không có "toạ độ", vị trí một ô là <em>thứ tự</em> của nó trong hàng. Bỏ một ${c('<td>')} là mọi ô sau trượt sang trái. Máy chấm kiểm mỗi hàng đúng 6 ô và kiểm vị trí từng môn bằng ${c(':nth-child')}.</p>`,
      loiHayGap: [
        `Bỏ ô trống — MAE101 của Thứ Năm, Ca 2 trượt sang cột Thứ Ba.`,
        `Ghi chữ "trống" hay "-" vào ô — trình đọc đọc "gạch ngang"; ô rỗng là đủ nghĩa.`,
        `Dùng ${c('<td><strong>Ca 1</strong></td>')} cho tiêu đề hàng — mất vai trò tiêu đề.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics#adding_headers_with_th_elements',
      kiem: [
        { moTa: 'thead có 6 ô th', kiem: 'so-luong', selector: 'thead > tr > th', giaTri: 6 },
        { moTa: 'Ô góc trên trái rỗng', kiem: 'ton-tai', selector: 'thead > tr > th:first-child:empty' },
        { moTa: 'tbody có 3 hàng', kiem: 'so-luong', selector: 'tbody > tr', giaTri: 3 },
        { moTa: 'Ô đầu mỗi hàng tbody là th', kiem: 'so-luong', selector: 'tbody > tr > th:first-child', giaTri: 3 },
        { moTa: 'Mọi hàng đúng 6 ô', kiem: 'khong-ton-tai', selector: 'table tr:not(:has(> :nth-child(6):last-child))' },
        { moTa: 'Ca 2 – Thứ Năm là MAE101', kiem: 'text', selector: 'tbody > tr:nth-child(2) > :nth-child(5)', giaTri: 'MAE101' },
        { moTa: 'Ca 3 – Thứ Ba là CEA201', kiem: 'text', selector: 'tbody > tr:nth-child(3) > :nth-child(3)', giaTri: 'CEA201' },
        { moTa: 'Ca 1 – Thứ Năm là ô trống', kiem: 'ton-tai', selector: 'tbody > tr:nth-child(1) > td:nth-child(5):empty' },
        { moTa: 'Không ghi chữ "trống" vào ô', kiem: 'text', selector: 'td', khop: '^(?!.*trống)' },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Placeholder không phải nhãn, "bấm vào đây" không phải liên kết',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['placeholder vs label', 'chữ liên kết mô tả', 'html lang', 'ví dụ định dạng'],
      tienQuyet: ['label for/id (bài 2.4)'],
      the: ['html', 'a11y', 'forms', 'links'],
      moTa: `<p>Hai mục trong danh sách kiểm của bài 2.5 — <em>"Mọi input: một ${c('<label>')} khớp với nó"</em> và <em>"Liên kết: chữ mô tả rõ, không phải bấm vào đây"</em> — cộng với bẫy cuối bài: placeholder biến mất khi người dùng gõ, nên không thể làm nhãn. Form nhận bản tin dưới đây vi phạm cả ba, thêm một lỗi ${c('lang')}.</p>`,
      yeuCau: [
        `Mỗi ô có ${c('<label for>')} thật: "Họ tên", "Email".`,
        `Placeholder chỉ còn làm ví dụ định dạng: ô email giữ ${c('placeholder="ban@vidu.com"')}; ô họ tên bỏ placeholder.`,
        `Liên kết "bấm vào đây" đổi thành chữ mô tả đích: "Đọc chính sách bảo mật".`,
        `${c('<html>')} có ${c('lang="vi"')}.`,
      ],
      dauVao: 'Form 2 ô chỉ có placeholder; một liên kết "bấm vào đây"; html lang="en".',
      dauRa: 'Người dùng bị ngắt quãng giữa chừng quay lại vẫn biết ô nào là gì; danh sách liên kết của trình đọc đọc lên có nghĩa.',
      rangBuoc: [
        'Không dùng aria-label thay nhãn hiển thị — nhãn thấy được giúp cả người nhìn.',
        'Giữ nguyên href của liên kết.',
      ],
      viDu: [{
        input: '<input type="email" placeholder="Email">',
        output: 'Trước khi gõ: ô ghi "Email" (chữ xám).\nĐang gõ dở "lan@": chữ "Email" biến mất — ô nào cũng chỉ là một khung có chữ.',
        explanation: 'Placeholder là gợi ý tạm thời; nhãn phải ở lại.',
      }],
      goiY: [
        'Thêm <label for="ho-ten">Họ tên</label> trước ô và id="ho-ten" cho ô; làm tương tự với email.',
        'Chữ liên kết trả lời câu "bấm vào thì tới đâu?": <a href="/bao-mat">Đọc chính sách bảo mật</a>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Nhận bản tin', `    <h1>Nhận bản tin hằng tuần</h1>
    <form action="/ban-tin" method="post">
      <input type="text" name="hoTen" placeholder="Họ tên">
      <input type="email" name="email" placeholder="Email">
      <button type="submit">Đăng ký</button>
    </form>
    <p>Muốn biết chúng tôi dùng email thế nào? <a href="/bao-mat">Bấm vào đây</a>.</p>`, 'en'),
      },
      loiGiai: {
        'index.html': KHUNG('Nhận bản tin', `    <h1>Nhận bản tin hằng tuần</h1>
    <form action="/ban-tin" method="post">
      <!-- nhãn thật: ở lại khi gõ, bấm được, trình đọc đọc tin cậy -->
      <label for="ho-ten">Họ tên</label>
      <input type="text" id="ho-ten" name="hoTen">
      <label for="email">Email</label>
      <!-- placeholder chỉ còn là VÍ DỤ định dạng -->
      <input type="email" id="email" name="email" placeholder="ban@vidu.com">
      <button type="submit">Đăng ký</button>
    </form>
    <!-- chữ liên kết tự nói đích đến, kể cả khi bị tách khỏi câu -->
    <p>Muốn biết chúng tôi dùng email thế nào? <a href="/bao-mat">Đọc chính sách bảo mật</a>.</p>`),
      },
      giaiThich: `<p>Placeholder thất bại ở ba chỗ: biến mất khi gõ, trình đọc màn hình đọc không nhất quán, và chữ xám thường trượt tương phản 4,5:1. Nhãn thật thì ở lại, được đọc tin cậy, và mở rộng vùng chạm. Placeholder vẫn có chỗ dùng: một <em>ví dụ</em> định dạng như ${c('ban@vidu.com')}.</p>
<p>"Bấm vào đây" vô nghĩa khi người dùng trình đọc mở danh sách liên kết của trang (một tính năng phổ biến) — họ nghe "bấm vào đây, bấm vào đây…". Máy chấm kiểm nhãn của mọi ô, placeholder không trùng tên trường, chữ liên kết không thuộc danh sách chữ mơ hồ, và ${c('lang')}.</p>`,
      loiHayGap: [
        `Giữ ${c('placeholder="Email"')} cạnh nhãn "Email" — lặp lại vô ích; placeholder nên là ví dụ.`,
        `Đổi chữ liên kết thành "tại đây" hay "link" — vẫn mơ hồ.`,
        `Thêm nhãn nhưng ẩn bằng CSS "cho gọn" — người nhìn mất nhãn, quay về vấn đề cũ.`,
      ],
      thamKhao: 'https://www.w3.org/WAI/tutorials/forms/instructions/#placeholder-text',
      kiem: [
        { moTa: 'html lang="vi"', kiem: 'thuoc-tinh', selector: 'html', thuocTinh: 'lang', giaTri: 'vi' },
        { moTa: 'Mọi ô nhập có nhãn', kiem: 'co-nhan', selector: 'input' },
        { moTa: 'Nhãn là <label> thấy được (không dùng aria-label)', kiem: 'khong-ton-tai', selector: '[aria-label]' },
        { moTa: 'Ô họ tên không còn placeholder', kiem: 'khong-ton-tai', selector: 'input[name="hoTen"][placeholder]' },
        { moTa: 'Placeholder email là ví dụ ban@vidu.com', kiem: 'thuoc-tinh', selector: 'input[type="email"]', thuocTinh: 'placeholder', giaTri: 'ban@vidu.com' },
        { moTa: 'Liên kết /bao-mat có chữ "Đọc chính sách bảo mật"', kiem: 'text', selector: 'a[href="/bao-mat"]', giaTri: 'Đọc chính sách bảo mật' },
        { moTa: 'Không còn chữ liên kết mơ hồ', kiem: 'text', selector: 'a', khop: '^(?!(bấm vào đây|tại đây|click here|link)$)' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Kiểm a11y năm phút: soát trang thật theo 8 dòng danh sách kiểm',
      doKho: 'HARD', phut: 35,
      khaiNiem: ['danh sách kiểm a11y', 'alt', 'label', 'dàn ý tiêu đề', 'landmark', 'button', 'lang', 'chữ liên kết', 'media controls'],
      tienQuyet: ['toàn bộ Chương 2'],
      the: ['html', 'a11y', 'audit', 'tong-hop'],
      moTa: `<p>Bạn được giao "kiểm khả năng tiếp cận trong năm phút" cho trang sự kiện của câu lạc bộ trước khi nó lên mạng. Không ai nói cho bạn lỗi nằm ở đâu — chỉ biết <strong>mỗi dòng</strong> trong danh sách kiểm dưới đây (bài 2.5, cộng hai dòng từ bài trước) đều bị vi phạm ít nhất một lần, tổng cộng chín chỗ phải sửa. Đây là cách review thật: đọc mã với danh sách kiểm trong tay.</p>
${code(`
Danh sách kiểm (bài 2.5)
□ Mọi ảnh:     alt có nghĩa (hoặc alt="" nếu chỉ trang trí)
□ Mọi input:   một <label> khớp với nó
□ Tiêu đề:     đúng thứ tự, không nhảy cấp — một dàn ý thật
□ Landmark:    header / nav / main / footer
□ Liên kết:    chữ mô tả rõ, không phải "bấm vào đây"
□ lang:        <html lang="vi">
+ từ bài 2.3:  hành động là <button>, không phải <div onclick>
+ từ bài 2.5:  media có controls, không tự phát
`)}`,
      yeuCau: [
        `Soát lần lượt 8 dòng danh sách kiểm và sửa mọi vi phạm (dòng "Mọi ảnh" có hai ảnh sai theo hai chiều ngược nhau — tổng 9 chỗ).`,
        `Không xoá nội dung: ảnh, video, ô nhập, liên kết vẫn còn đủ.`,
        `Trang sau khi sửa có: một h1 và dàn ý không nhảy cấp; đủ header/nav/main/footer; mọi ảnh có alt; mọi ô có nhãn.`,
      ],
      dauVao: 'Trang sự kiện ~35 dòng, vi phạm cả 8 dòng danh sách kiểm (9 chỗ sửa).',
      dauRa: 'Trang qua đủ danh sách kiểm; Lighthouse (DevTools) không còn lỗi khả năng tiếp cận nào về nhãn, alt, lang, thứ tự tiêu đề.',
      rangBuoc: [
        'Ảnh poster mang nội dung (giờ, địa điểm) ⇒ alt phải nói nội dung đó.',
        'Đường kẻ hoa văn chỉ trang trí ⇒ alt rỗng.',
        'Không dùng aria-* để vá chỗ có thể sửa bằng thẻ đúng.',
      ],
      viDu: [{
        input: '<h1>Hackathon</h1>\n<h3>Lịch trình</h3>',
        output: 'Lỗi "Tiêu đề": h1 → h3 nhảy cấp.',
        explanation: 'Sửa: h3 ⇒ h2 (chọn cấp theo thứ bậc, đổi cỡ chữ bằng CSS).',
      }],
      goiY: [
        'Đi từ trên xuống, từ ngoài vào: <html> (lang) → khung trang (landmark) → tiêu đề (dàn ý) → từng ảnh → từng ô → từng liên kết/nút → media. Đánh dấu từng ô trong danh sách khi xong.',
        'Chín chỗ: lang="en"; div.dau-trang/div.menu thay header/nav; h1 → h3 (ba lần); poster thiếu alt; hoa văn có alt dài; ô email chỉ có placeholder; liên kết "bấm vào đây"; nút đăng ký là div; video autoplay không controls.',
      ],
      khoiDau: {
        'index.html': KHUNG('Hackathon F-Code 2026', `    <div class="dau-trang">
      <h1>Hackathon F-Code 2026</h1>
      <div class="menu">
        <a href="/">Trang chủ</a>
        <a href="/su-kien">Sự kiện</a>
      </div>
    </div>
    <main>
      <img src="hoa-van.png" alt="Đường kẻ hoa văn màu cam trang trí đầu trang" width="800" height="20">
      <h3>Thông tin</h3>
      <img src="poster.jpg" width="600" height="800">
      <p>Đội 3–5 người, 24 giờ, đề bài công bố lúc khai mạc.</p>
      <h3>Video năm ngoái</h3>
      <video src="hackathon-2025.mp4" autoplay muted width="640"></video>
      <h3>Đăng ký</h3>
      <form action="/hackathon/dang-ky" method="post">
        <input type="email" name="email" placeholder="Email trưởng nhóm">
        <div class="nut" onclick="dangKy()">Đăng ký đội</div>
      </form>
      <p>Thể lệ chi tiết: <a href="/hackathon/the-le">bấm vào đây</a></p>
    </main>
    <footer>
      <p>© 2026 CLB F-Code</p>
    </footer>`, 'en'),
      },
      loiGiai: {
        'index.html': KHUNG('Hackathon F-Code 2026', `    <!-- (1) lang="vi" ở thẻ html — xem bộ khung phía trên -->
    <!-- (2) Landmark: div.dau-trang ⇒ header, div.menu ⇒ nav -->
    <header>
      <h1>Hackathon F-Code 2026</h1>
      <nav>
        <a href="/">Trang chủ</a>
        <a href="/su-kien">Sự kiện</a>
      </nav>
    </header>
    <main>
      <!-- (3) ảnh trang trí ⇒ alt rỗng (có mặt) -->
      <img src="hoa-van.png" alt="" width="800" height="20">
      <!-- (4) tiêu đề: h1 → h2, không nhảy cấp -->
      <h2>Thông tin</h2>
      <!-- (5) poster mang nội dung ⇒ alt nói nội dung đó -->
      <img src="poster.jpg" alt="Poster Hackathon F-Code 2026: 8 giờ sáng thứ Bảy 25/10 tại hội trường A" width="600" height="800">
      <p>Đội 3–5 người, 24 giờ, đề bài công bố lúc khai mạc.</p>
      <h2>Video năm ngoái</h2>
      <!-- (6) media: có controls, không tự phát -->
      <video src="hackathon-2025.mp4" controls width="640">
        Trình duyệt của bạn không phát được video này.
      </video>
      <h2>Đăng ký</h2>
      <form action="/hackathon/dang-ky" method="post">
        <!-- (7) ô có nhãn thật; placeholder thành ví dụ -->
        <label for="email-truong-nhom">Email trưởng nhóm</label>
        <input type="email" id="email-truong-nhom" name="email" placeholder="ban@vidu.com">
        <!-- (8) hành động ⇒ button (trong form: type submit để gửi) -->
        <button type="submit" class="nut">Đăng ký đội</button>
      </form>
      <!-- (9) chữ liên kết mô tả đích -->
      <p>Thể lệ chi tiết: <a href="/hackathon/the-le">Đọc thể lệ Hackathon</a></p>
    </main>
    <footer>
      <p>© 2026 CLB F-Code</p>
    </footer>`),
      },
      giaiThich: `<p>Đây là bài 2.5 áp lên một trang thật: mỗi dòng danh sách kiểm tìm ra một lỗi. Lưu ý hai lỗi "ngược chiều" nhau về ảnh — poster <em>thiếu</em> alt dù mang thông tin quan trọng nhất trang (giờ, địa điểm), còn hoa văn lại có alt <em>dài</em> dù chẳng mang gì. Cả hai đều làm người nghe khổ.</p>
<p>Nút đăng ký nằm trong form nên dùng ${c('type="submit"')} (khác bài 2.3 dùng ${c('type="button"')} cho hành động không gửi form). Video ${c('autoplay muted')} đỡ hơn tự phát có tiếng, nhưng không có controls thì người dùng không dừng được chuyển động — vi phạm cả thói quen tốt lẫn hướng dẫn WCAG về nội dung chuyển động. Máy chấm kiểm 12 điều phủ cả 8 dòng danh sách kiểm.</p>`,
      loiHayGap: [
        `Sửa poster bằng ${c('alt="poster"')} — có alt nhưng người nghe vẫn không biết giờ và địa điểm.`,
        `Thêm ${c('role="banner"')} cho div đầu trang thay vì đổi sang ${c('<header>')} — aria là lối thoát cuối cùng, không phải cách sửa đầu tiên.`,
        `Đổi h3 thành h2 cho "Thông tin" nhưng sót hai h3 còn lại — dàn ý vẫn nhảy cấp ở chỗ khác.`,
        `Giữ ${c('<div onclick>')} và thêm ${c('tabindex="0"')} — vẫn không phản hồi Enter/Space, và không gửi được form khi tắt JavaScript.`,
      ],
      thamKhao: 'https://www.w3.org/WAI/test-evaluate/preliminary/',
      kiem: [
        { moTa: 'html lang="vi"', kiem: 'thuoc-tinh', selector: 'html', thuocTinh: 'lang', giaTri: 'vi' },
        { moTa: 'Có header chứa nav (landmark)', kiem: 'ton-tai', selector: 'body > header nav' },
        { moTa: 'Đủ header, main, footer là con của body', kiem: 'thu-tu', cacSelector: ['body > header', 'body > main', 'body > footer'] },
        { moTa: 'Không còn div làm khung trang/menu', kiem: 'khong-ton-tai', selector: 'div.dau-trang, div.menu' },
        { moTa: 'Một h1, dàn ý không nhảy cấp', kiem: 'tieu-de' },
        { moTa: 'Mọi ảnh có alt', kiem: 'khong-ton-tai', selector: 'img:not([alt])' },
        { moTa: 'Hoa văn trang trí có alt rỗng', kiem: 'thuoc-tinh', selector: 'img[src="hoa-van.png"]', thuocTinh: 'alt', giaTri: '' },
        { moTa: 'Poster có alt nêu nội dung (≥ 20 ký tự)', kiem: 'thuoc-tinh', selector: 'img[src="poster.jpg"]', thuocTinh: 'alt', khop: '^.{20,}$' },
        { moTa: 'Mọi ô nhập có nhãn', kiem: 'co-nhan', selector: 'input' },
        { moTa: 'Nút đăng ký là <button>, không còn div onclick', kiem: 'khong-ton-tai', selector: '[onclick]:not(button)' },
        { moTa: 'Form có nút button gửi', kiem: 'ton-tai', selector: 'form button' },
        { moTa: 'Không còn liên kết "bấm vào đây"', kiem: 'text', selector: 'a', khop: '^(?!(bấm vào đây|tại đây|click here)$)' },
        { moTa: 'Video có controls và không tự phát', kiem: 'ton-tai', selector: 'video[controls]:not([autoplay])' },
        { moTa: 'Nội dung còn đủ: 2 ảnh, 1 video, 1 ô, 3 liên kết', kiem: 'so-luong', selector: 'img, video, input, a', giaTri: 7 },
      ],
    },
  ],
};
