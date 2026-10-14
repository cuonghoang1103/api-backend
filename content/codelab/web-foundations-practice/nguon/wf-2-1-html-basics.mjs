/** Bộ luyện bài 2.1 — HTML là gì: phần tử, thẻ, thuộc tính. Lược đồ: ./_luoc-do.mjs */
import { c, code } from './_luoc-do.mjs';

export default {
  slug: 'wf-2-1-html-basics',
  ten: '2.1 HTML là gì: phần tử, thẻ, thuộc tính',
  baiHoc: 'Nền tảng Web — Bài 2.1 HTML là gì: phần tử, thẻ, thuộc tính',
  ngonNgu: 'html',
  level: 'BEGINNER',
  moTa: 'Phần tử, thẻ mở/đóng, thuộc tính, phần tử rỗng, lồng nhau và bộ khung một tài liệu HTML hợp lệ — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Bộ khung trang HTML5 đầu tiên',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['DOCTYPE', 'html lang', 'head và body', 'meta charset', 'meta viewport', 'title'],
      tienQuyet: ['mở được tệp .html bằng Live Server'],
      the: ['html', 'boilerplate', 'bo-khung'],
      moTa: `<p>Mọi trang web bắt đầu từ cùng một bộ khung. Trong bài 2.1 bạn đã thấy nó: dòng ${c('<!DOCTYPE html>')}, phần tử ${c('<html>')} bọc ngoài cùng, ${c('<head>')} chứa thông tin người xem không thấy, ${c('<body>')} chứa mọi thứ hiển thị. Hãy tự gõ lại bộ khung đó cho trang hồ sơ của bạn Minh — không chép, gõ từng dòng để tay nhớ.</p>`,
      yeuCau: [
        `Dòng đầu tiên là ${c('<!DOCTYPE html>')}.`,
        `Phần tử ${c('<html>')} có thuộc tính ${c('lang="vi"')} (trang viết tiếng Việt).`,
        `Trong ${c('<head>')}: ${c('<meta charset="UTF-8">')}, thẻ viewport ${c('<meta name="viewport" content="width=device-width, initial-scale=1">')} và ${c('<title>')} có chữ <strong>Hồ sơ của Minh</strong>.`,
        `Trong ${c('<body>')}: đúng một ${c('<h1>')} ghi <strong>Xin chào, mình là Minh</strong> và ít nhất một đoạn ${c('<p>')} giới thiệu.`,
      ],
      dauVao: 'Tệp index.html gần như trống (chỉ có chú thích hướng dẫn).',
      dauRa: 'Một tài liệu HTML hợp lệ: tab trình duyệt ghi "Hồ sơ của Minh", trang hiện một tiêu đề lớn và một đoạn văn, chữ có dấu hiển thị đúng.',
      rangBuoc: [
        'Không dùng CSS hay JavaScript — bài này chỉ có HTML.',
        'Chỉ đúng một <h1> trên trang.',
        'Thẻ <title> phải nằm trong <head>, không nằm trong <body>.',
      ],
      viDu: [{
        input: '<!DOCTYPE html>\n<html lang="vi">\n  <head> …meta, title… </head>\n  <body>\n    <h1>Xin chào, mình là Minh</h1>\n    <p>Mình đang học làm web.</p>\n  </body>\n</html>',
        output: 'Tab trình duyệt: "Hồ sơ của Minh".\nTrang: dòng chữ to đậm "Xin chào, mình là Minh", bên dưới là đoạn "Mình đang học làm web."',
        explanation: 'Phần trong <head> không hiện trên trang — title hiện ở tab. Mọi thứ nhìn thấy nằm trong <body>.',
      }],
      goiY: [
        'Bộ khung có hai tầng: <html> bọc <head> và <body>. Viết bốn thẻ khung đó trước (mở và đóng ngay), rồi mới điền vào bên trong.',
        'Trong <head> cần ba dòng: <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1">, rồi <title>Hồ sơ của Minh</title>. Trong <body> là <h1> rồi <p>.',
      ],
      khoiDau: {
        'index.html': `
<!-- Gõ bộ khung HTML5 ở đây.
     1) DOCTYPE
     2) <html lang="vi"> bọc <head> và <body>
     3) <head>: meta charset, meta viewport, title "Hồ sơ của Minh"
     4) <body>: một <h1> và ít nhất một <p> -->
<h1>Xin chào, mình là Minh</h1>
`,
      },
      loiGiai: {
        'index.html': `
<!DOCTYPE html>                       <!-- 1. luôn là dòng đầu: "đây là HTML hiện đại" -->
<html lang="vi">                      <!-- 2. lang giúp trình đọc màn hình phát âm tiếng Việt -->
  <head>                              <!-- 3. phần không hiện trên trang -->
    <meta charset="UTF-8">            <!-- gõ được ă, ơ, ư, đ mà không vỡ chữ -->
    <meta name="viewport" content="width=device-width, initial-scale=1">  <!-- vừa màn hình điện thoại -->
    <title>Hồ sơ của Minh</title>     <!-- chữ hiện trên tab trình duyệt -->
  </head>
  <body>                              <!-- 4. mọi thứ người xem thấy -->
    <h1>Xin chào, mình là Minh</h1>   <!-- đúng MỘT h1: tiêu đề của cả trang -->
    <p>Mình là sinh viên năm nhất, đang học làm web từ con số 0.</p>
  </body>
</html>
`,
      },
      giaiThich: `<p>Lời giải đi đúng thứ tự trình duyệt đọc: ${c('<!DOCTYPE html>')} báo "chế độ chuẩn" (thiếu nó trình duyệt rơi vào <em>quirks mode</em> — tính kích thước hộp kiểu cũ những năm 1990, CSS ở Chương 3 sẽ chạy sai khó hiểu). ${c('<html lang="vi">')} là gốc của cây DOM; ${c('lang')} cho trình đọc màn hình chọn giọng tiếng Việt.</p>
<p>${c('<head>')} gom thông tin "về" trang: ${c('charset')} phải nằm sớm (trong 1024 byte đầu) để trình duyệt giải mã đúng ngay từ đầu; viewport khiến điện thoại không giả vờ rộng 980px; ${c('<title>')} là chữ ở tab, ở dấu trang và ở kết quả Google. ${c('<body>')} chứa phần nhìn thấy, với đúng một ${c('<h1>')} làm tiêu đề trang.</p>
<p>Máy chấm kiểm từng điều đó trên cây DOM đã dựng: có doctype, ${c('html[lang="vi"]')}, meta charset là UTF-8, meta viewport có ${c('width=device-width')}, title đúng chữ, đúng một h1.</p>`,
      loiHayGap: [
        `Quên ${c('<!DOCTYPE html>')} — trang vẫn hiện, nhưng trình duyệt chạy quirks mode, và lỗi chỉ lộ ra khi học box model.`,
        `Đặt ${c('<title>')} trong ${c('<body>')}: trình duyệt tự dời nó lên head nên trông như chạy được — nhưng đó là trình duyệt vá giùm, không phải bạn viết đúng.`,
        `Gõ ${c('charset="UTF8"')} (thiếu gạch) hoặc để meta charset sau một đoạn dài — chữ tiếng Việt thành "Xin chÃ o".`,
        `Hai ${c('<h1>')} vì "muốn chữ to" — chữ to là việc của CSS, h1 là "tiêu đề của trang".`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started',
      kiem: [
        { moTa: 'Có <!DOCTYPE html>', kiem: 'doctype' },
        { moTa: '<html> có lang="vi"', kiem: 'thuoc-tinh', selector: 'html', thuocTinh: 'lang', giaTri: 'vi' },
        { moTa: 'Có <meta charset> là UTF-8 trong <head>', kiem: 'thuoc-tinh', selector: 'head meta[charset]', thuocTinh: 'charset', khop: '^utf-8$' },
        { moTa: 'Có meta viewport với width=device-width', kiem: 'thuoc-tinh', selector: 'head meta[name="viewport"]', thuocTinh: 'content', khop: 'width\\s*=\\s*device-width' },
        { moTa: '<title> trong <head> ghi "Hồ sơ của Minh"', kiem: 'text', selector: 'head > title', giaTri: 'Hồ sơ của Minh' },
        { moTa: 'Viết <title> trong <head> ngay từ mã nguồn (không để trình duyệt dời giùm)', kiem: 'ma-nguon', tep: 'index.html', khop: '<head[^>]*>(?:(?!</head>)[\\s\\S])*<title>' },
        { moTa: 'Đúng một <h1> với chữ "Xin chào, mình là Minh"', kiem: 'text', selector: 'body h1', giaTri: 'Xin chào, mình là Minh' },
        { moTa: 'Chỉ một <h1> trên trang', kiem: 'so-luong', selector: 'h1', giaTri: 1 },
        { moTa: 'Có ít nhất một đoạn <p> trong <body>', kiem: 'so-luong', selector: 'body p', min: 1 },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Thuộc tính đầu tiên: cho liên kết một đích, cho ảnh một nguồn và lời mô tả',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['thuộc tính', 'href', 'src', 'alt', 'tên="giá trị"'],
      tienQuyet: ['bộ khung HTML5'],
      the: ['html', 'attribute', 'a', 'img'],
      moTa: `<p>Một thẻ ${c('<a>')} không có ${c('href')} chỉ là chữ thường — bấm không đi đâu cả. Một ${c('<img>')} không có ${c('src')} là cái khung trống. <strong>Thuộc tính</strong> (dạng ${c('tên="giá trị"')} nằm trong thẻ mở) là thứ cấu hình phần tử. Trang dưới đây đã có đủ phần tử nhưng thiếu hết thuộc tính — hãy điền vào.</p>`,
      yeuCau: [
        `Liên kết "Ghé thăm CuongThai" trỏ tới ${c('https://cuongthai.com')} (thuộc tính ${c('href')}).`,
        `Liên kết "Tài liệu MDN" trỏ tới ${c('https://developer.mozilla.org')}.`,
        `Ảnh dùng tệp ${c('meo.jpg')} (thuộc tính ${c('src')}) và có ${c('alt')} mô tả ảnh bằng chữ (không để trống — đây là ảnh mang nội dung).`,
        `Ảnh có thêm ${c('width="320"')} và ${c('height="240"')} để trình duyệt giữ chỗ trước khi ảnh tải xong.`,
      ],
      dauVao: 'index.html có sẵn hai thẻ <a> và một thẻ <img> chưa có thuộc tính nào.',
      dauRa: 'Hai liên kết bấm được đúng địa chỉ; ảnh con mèo hiện ra (hoặc hiện chữ alt nếu tệp ảnh hỏng).',
      rangBuoc: [
        'Giá trị thuộc tính đặt trong dấu nháy kép: href="…".',
        'Không thêm phần tử mới, chỉ thêm thuộc tính.',
        '<img> là phần tử rỗng: không có thẻ đóng </img>.',
      ],
      viDu: [{
        input: '<a>Ghé thăm CuongThai</a>',
        output: 'Chữ "Ghé thăm CuongThai" màu đen, bấm không có gì xảy ra.',
        explanation: 'Thiếu href nên trình duyệt không coi đây là liên kết thật (không gạch chân, không đổi con trỏ).',
      }, {
        input: '<a href="https://cuongthai.com">Ghé thăm CuongThai</a>',
        output: 'Chữ xanh gạch chân, bấm vào mở cuongthai.com.',
        explanation: 'Cùng phần tử, chỉ thêm một thuộc tính — hành vi thay đổi hoàn toàn.',
      }],
      goiY: [
        'Thuộc tính luôn nằm TRONG thẻ mở, sau tên thẻ và một dấu cách: <a href="…">, không bao giờ ở thẻ đóng.',
        'Ảnh cần bốn thuộc tính: <img src="meo.jpg" alt="Một con mèo mướp đang ngủ trên bàn phím" width="320" height="240">.',
      ],
      khoiDau: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Góc nhỏ của Minh</title>
  </head>
  <body>
    <h1>Góc nhỏ của Minh</h1>
    <!-- Thêm thuộc tính cho hai liên kết và tấm ảnh dưới đây -->
    <p><a>Ghé thăm CuongThai</a></p>
    <p><a>Tài liệu MDN</a></p>
    <img>
  </body>
</html>
`,
      },
      loiGiai: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Góc nhỏ của Minh</title>
  </head>
  <body>
    <h1>Góc nhỏ của Minh</h1>
    <!-- href = liên kết đi đâu (URL tuyệt đối vì là site khác) -->
    <p><a href="https://cuongthai.com">Ghé thăm CuongThai</a></p>
    <p><a href="https://developer.mozilla.org">Tài liệu MDN</a></p>
    <!-- src = nạp tệp nào; alt = ảnh NÓI GÌ (trình đọc màn hình đọc to, hiện khi ảnh hỏng);
         width/height = giữ chỗ để chữ phía dưới không nhảy khi ảnh đang tải -->
    <img src="meo.jpg" alt="Một con mèo mướp đang ngủ trên bàn phím" width="320" height="240">
  </body>
</html>
`,
      },
      giaiThich: `<p>Mỗi thuộc tính trả lời một câu hỏi: ${c('href')} — "bấm vào thì đi đâu?", ${c('src')} — "nạp tệp nào?" (mỗi src là một request mạng nữa), ${c('alt')} — "ảnh nói gì?". Thiếu ${c('href')} thì ${c('<a>')} không tới được bằng phím Tab và không bấm được; thiếu ${c('src')} thì không có gì để vẽ.</p>
<p>${c('alt')} không phải điểm cộng: người khiếm thị "thấy" ảnh chỉ qua alt, và nếu thiếu hẳn thuộc tính, nhiều trình đọc sẽ đọc luôn tên tệp. ${c('width')}/${c('height')} cho trình duyệt biết khung ảnh trước khi ảnh về, nên đoạn chữ bên dưới không bị đẩy xuống giữa chừng.</p>`,
      loiHayGap: [
        `Viết thuộc tính vào thẻ đóng: ${c('</a href="…">')} — trình duyệt bỏ qua, liên kết vẫn chết.`,
        `Quên dấu nháy đóng: ${c('<a href="https://cuongthai.com>')} — phần còn lại của dòng bị nuốt vào giá trị href.`,
        `Viết ${c('alt="image"')} hoặc ${c('alt="meo.jpg"')} — có alt nhưng chẳng mô tả gì; hãy viết điều tấm ảnh thật sự cho thấy.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img',
      kiem: [
        { moTa: 'Liên kết thứ nhất trỏ tới https://cuongthai.com', kiem: 'thuoc-tinh', selector: 'a', thuocTinh: 'href', giaTri: 'https://cuongthai.com', tatCa: false },
        { moTa: 'Liên kết thứ hai trỏ tới https://developer.mozilla.org', kiem: 'thuoc-tinh', selector: 'a', thuocTinh: 'href', khop: '^https://developer\\.mozilla\\.org/?$', tatCa: false },
        { moTa: 'Mọi <a> đều có href', kiem: 'khong-ton-tai', selector: 'a:not([href])' },
        { moTa: 'Ảnh có src="meo.jpg"', kiem: 'thuoc-tinh', selector: 'img', thuocTinh: 'src', giaTri: 'meo.jpg' },
        { moTa: 'Ảnh có alt mô tả (ít nhất 10 ký tự, không phải tên tệp)', kiem: 'thuoc-tinh', selector: 'img', thuocTinh: 'alt', khop: '^(?!.*\\.(jpe?g|png|gif|webp)$).{10,}$' },
        { moTa: 'Ảnh có width="320" và height="240"', kiem: 'so-luong', selector: 'img[width="320"][height="240"]', giaTri: 1 },
        { moTa: 'Không viết thẻ đóng </img>', kiem: 'ma-nguon', tep: 'index.html', khop: '</img>', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Phần tử rỗng: ngắt dòng địa chỉ bằng <br> mà không đóng thẻ',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['phần tử rỗng (void)', 'br', 'img', 'hr', 'phần tử vs thẻ'],
      tienQuyet: ['thẻ mở / thẻ đóng'],
      the: ['html', 'void-elements', 'br'],
      moTa: `<p>Bài 2.1 nói: hầu hết phần tử có thẻ mở + nội dung + thẻ đóng, nhưng <strong>phần tử rỗng</strong> như ${c('<img>')} và ${c('<br>')} thì không có nội dung và không có thẻ đóng. Một tiệm phở cần chân trang ghi địa chỉ ba dòng. Người viết trước đã tách thành ba đoạn ${c('<p>')} (giữa các dòng hở to) và còn viết ${c('</br>')}. Hãy viết lại cho đúng.</p>`,
      yeuCau: [
        `Địa chỉ nằm trong <strong>một</strong> đoạn ${c('<p class="dia-chi">')}, ba dòng ngắt bằng hai thẻ ${c('<br>')}.`,
        `Không có ${c('</br>')} hay ${c('</img>')} nào trong mã.`,
        `Phía trên địa chỉ có một đường kẻ ngang ${c('<hr>')} (cũng là phần tử rỗng) ngăn với phần thực đơn.`,
        `Giữ nguyên ảnh logo, thêm ${c('alt="Logo Phở Hà Nội"')}.`,
      ],
      dauVao: 'index.html: một trang thực đơn ngắn, cuối trang có địa chỉ viết thành ba <p>.',
      dauRa: 'Cuối trang: một đường kẻ ngang, dưới là khối địa chỉ ba dòng sát nhau (không hở như ba đoạn văn).',
      rangBuoc: [
        'Không dùng CSS để ép khoảng cách — chỉ sửa HTML.',
        'Chỉ dùng <br> cho chỗ ngắt dòng có nghĩa (địa chỉ, thơ), không dùng để tạo khoảng trống.',
      ],
      viDu: [{
        input: '<p class="dia-chi">\n  Phở Hà Nội<br>\n  12 Hàng Bạc, Hoàn Kiếm<br>\n  Mở cửa 6:00 – 22:00\n</p>',
        output: 'Phở Hà Nội\n12 Hàng Bạc, Hoàn Kiếm\nMở cửa 6:00 – 22:00\n(ba dòng sát nhau trong cùng một đoạn)',
        explanation: '<br> chỉ ngắt dòng bên trong đoạn; ba <p> là ba đoạn văn riêng nên có khoảng hở giữa chúng.',
      }],
      goiY: [
        'Gộp ba <p> thành một <p class="dia-chi">, đặt <br> ở cuối dòng thứ nhất và dòng thứ hai.',
        'Phần tử rỗng chỉ có thẻ mở: viết <br>, <hr>, <img …> — tuyệt đối không có </br>.',
      ],
      khoiDau: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Phở Hà Nội</title>
  </head>
  <body>
    <img src="logo-pho.png"></img>
    <h1>Thực đơn hôm nay</h1>
    <p>Phở bò tái — 55.000đ</p>
    <p>Phở gà — 50.000đ</p>
    <!-- Sửa phần địa chỉ dưới đây -->
    <p>Phở Hà Nội</br></p>
    <p>12 Hàng Bạc, Hoàn Kiếm</br></p>
    <p>Mở cửa 6:00 – 22:00</p>
  </body>
</html>
`,
      },
      loiGiai: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Phở Hà Nội</title>
  </head>
  <body>
    <!-- img là phần tử rỗng: không có </img>; alt mô tả logo -->
    <img src="logo-pho.png" alt="Logo Phở Hà Nội">
    <h1>Thực đơn hôm nay</h1>
    <p>Phở bò tái — 55.000đ</p>
    <p>Phở gà — 50.000đ</p>
    <hr>  <!-- đường kẻ ngang: rỗng, không đóng -->
    <!-- MỘT đoạn, ba dòng: br chỉ ngắt dòng bên trong đoạn -->
    <p class="dia-chi">
      Phở Hà Nội<br>
      12 Hàng Bạc, Hoàn Kiếm<br>
      Mở cửa 6:00 – 22:00
    </p>
  </body>
</html>
`,
      },
      giaiThich: `<p>Phần tử rỗng không có chỗ để chứa nội dung, nên đặc tả HTML không cho nó thẻ đóng. Trình duyệt gặp ${c('</br>')} sẽ <em>đoán</em> bạn muốn một ${c('<br>')} nữa (một trong những chỗ "âm thầm vá lỗi" ở bài 2.1) — nên trang của người viết trước có ngắt dòng thừa mà nhìn mã không hiểu vì sao. ${c('</img>')} thì bị bỏ qua lặng lẽ.</p>
<p>Ba dòng địa chỉ là <em>một</em> khối thông tin, nên một ${c('<p>')} với hai ${c('<br>')} đúng ý nghĩa hơn ba đoạn văn. ${c('<hr>')} mang nghĩa "chuyển chủ đề" — vừa đúng chỗ giữa thực đơn và địa chỉ.</p>`,
      loiHayGap: [
        `Viết ${c('<br/>')} rồi lo là sai — dấu ${c('/')} trước ${c('>')} được phép (di sản XHTML) và bị bỏ qua; cái sai là ${c('</br>')}.`,
        `Dùng năm ${c('<br>')} liên tiếp để tạo khoảng trống — đó là việc của ${c('margin')} trong CSS (bài 3.2).`,
        `Gắn class vào ${c('<br>')} hay cố đặt chữ giữa ${c('<br>')} và ${c('</br>')} — br không chứa gì cả.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Void_element',
      kiem: [
        { moTa: 'Có đúng một đoạn p.dia-chi', kiem: 'so-luong', selector: 'p.dia-chi', giaTri: 1 },
        { moTa: 'p.dia-chi chứa đúng hai <br>', kiem: 'so-luong', selector: 'p.dia-chi br', giaTri: 2 },
        { moTa: 'Địa chỉ đủ ba dòng chữ', kiem: 'text', selector: 'p.dia-chi', khop: 'Phở Hà Nội.*12 Hàng Bạc, Hoàn Kiếm.*Mở cửa 6:00' },
        { moTa: 'Không có </br> trong mã', kiem: 'ma-nguon', tep: 'index.html', khop: '</br\\s*>', phuDinh: true },
        { moTa: 'Không có </img> trong mã', kiem: 'ma-nguon', tep: 'index.html', khop: '</img\\s*>', phuDinh: true },
        { moTa: 'Có đường kẻ <hr> đứng trước khối địa chỉ', kiem: 'thu-tu', cacSelector: ['hr', 'p.dia-chi'] },
        { moTa: 'Logo có alt="Logo Phở Hà Nội"', kiem: 'thuoc-tinh', selector: 'img[src="logo-pho.png"]', thuocTinh: 'alt', giaTri: 'Logo Phở Hà Nội' },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Cứu trang tiếng Việt bị vỡ chữ và tí hon trên điện thoại',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['meta charset', 'meta viewport', 'html lang', 'head vs body', 'quirks mode'],
      tienQuyet: ['bộ khung HTML5'],
      the: ['html', 'debug', 'charset', 'viewport'],
      moTa: `<p>Một bạn gửi trang "Câu lạc bộ Lập trình" kèm ba lời phàn nàn: <em>(1) mở trên điện thoại chữ bé như con kiến, phải phóng to mới đọc được; (2) trình đọc màn hình đọc tiếng Việt bằng giọng Anh nghe rất buồn cười; (3) tab trình duyệt không có tên.</em> Ngoài ra trang không có dòng DOCTYPE. Mỗi lời phàn nàn ứng với đúng một dòng trong bộ khung ở bài 2.1. Hãy chẩn đoán và sửa — không viết lại từ đầu.</p>`,
      yeuCau: [
        `Thêm ${c('<!DOCTYPE html>')} ở dòng đầu (thoát quirks mode).`,
        `Sửa ${c('lang')} của ${c('<html>')} cho khớp ngôn ngữ của trang (lời phàn nàn 2).`,
        `Thêm thẻ viewport để trang vừa màn hình điện thoại (lời phàn nàn 1).`,
        `Dời ${c('<title>')} đang nằm lạc trong ${c('<body>')} về ${c('<head>')} (lời phàn nàn 3), giữ nguyên chữ "Câu lạc bộ Lập trình".`,
        `Đổi meta charset đang khai sai ${c('ISO-8859-1')} thành ${c('UTF-8')}.`,
      ],
      dauVao: 'index.html có bộ khung sai năm chỗ (thiếu DOCTYPE, lang="en", thiếu viewport, title lạc trong body, charset ISO-8859-1).',
      dauRa: 'Trang y hệt về nội dung, nhưng: tab có tên, đọc được ngay trên điện thoại, trình đọc màn hình dùng giọng Việt, chữ có dấu không vỡ.',
      rangBuoc: [
        'Không đổi nội dung nhìn thấy (h1, các đoạn văn giữ nguyên).',
        'Chỉ một <title>, nằm trong <head>.',
        'meta charset là phần tử đầu tiên trong <head>.',
      ],
      viDu: [{
        input: '<html lang="en">\n  <head><meta charset="ISO-8859-1"></head>\n  <body><title>Câu lạc bộ Lập trình</title> …',
        output: 'Tab trình duyệt: "index.html" (hoặc trống)\nChữ "Câu lạc bộ" có thể hiện thành "CÃ¢u láº¡c bá»™"\nTrình đọc màn hình: đọc "Cau lac bo" theo giọng Anh',
        explanation: 'Mỗi triệu chứng là một dòng khai sai trong head — không cần CSS hay JS để sửa.',
      }],
      goiY: [
        'Ghép từng lời phàn nàn với một dòng: chữ bé trên điện thoại → viewport; giọng đọc sai → lang; tab không tên → title; chữ vỡ dấu → charset.',
        'Sau khi sửa, <head> nên có đúng thứ tự: <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1">, <title>Câu lạc bộ Lập trình</title>.',
      ],
      khoiDau: {
        'index.html': `
<html lang="en">
  <head>
    <meta charset="ISO-8859-1">
  </head>
  <body>
    <title>Câu lạc bộ Lập trình</title>
    <h1>Câu lạc bộ Lập trình F-Code</h1>
    <p>Sinh hoạt tối thứ Năm hằng tuần tại phòng 204.</p>
    <p>Năm nay câu lạc bộ học HTML, CSS và JavaScript từ con số 0.</p>
  </body>
</html>
`,
      },
      loiGiai: {
        'index.html': `
<!DOCTYPE html>                       <!-- (0) thoát quirks mode -->
<html lang="vi">                      <!-- (2) giọng đọc tiếng Việt, đúng ngôn ngữ của nội dung -->
  <head>
    <meta charset="UTF-8">            <!-- (4) đứng ĐẦU head: giải mã đúng chữ có dấu ngay từ byte đầu -->
    <meta name="viewport" content="width=device-width, initial-scale=1">  <!-- (1) vừa màn hình điện thoại -->
    <title>Câu lạc bộ Lập trình</title>  <!-- (3) title thuộc về head -->
  </head>
  <body>
    <h1>Câu lạc bộ Lập trình F-Code</h1>
    <p>Sinh hoạt tối thứ Năm hằng tuần tại phòng 204.</p>
    <p>Năm nay câu lạc bộ học HTML, CSS và JavaScript từ con số 0.</p>
  </body>
</html>
`,
      },
      giaiThich: `<p>Bài này dạy thói quen chẩn đoán: <strong>triệu chứng → dòng khai báo</strong>. Điện thoại không có viewport sẽ giả vờ rộng 980px rồi thu nhỏ cả trang — chữ bé là hậu quả. ${c('lang="en"')} nói với trình đọc màn hình "đây là tiếng Anh", nên nó đọc chữ Việt bằng luật phát âm tiếng Anh. ${c('<title>')} trong body: trình duyệt hiện đại thường dời nó lên head khi dựng DOM, nhưng đó là cơ chế vá lỗi — bạn đừng dựa vào nó.</p>
<p>Charset phải khớp với cách tệp được lưu: VS Code lưu UTF-8, nên khai ${c('ISO-8859-1')} là bảo trình duyệt đọc mỗi byte thành một ký tự Latin — chữ "â" (2 byte UTF-8) thành hai ký tự rác. Meta charset đứng đầu head vì trình duyệt chỉ dò nó trong 1024 byte đầu tiên.</p>`,
      loiHayGap: [
        `Thêm title mới trong head nhưng quên xoá title cũ trong body — trang có hai title.`,
        `Viết ${c('lang="vn"')} — mã ngôn ngữ tiếng Việt là ${c('vi')} (vn là mã quốc gia).`,
        `Viết viewport thành ${c('content="width=device-width; initial-scale=1"')} với dấu chấm phẩy — dấu phân cách đúng là dấu phẩy.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag',
      kiem: [
        { moTa: 'Có <!DOCTYPE html>', kiem: 'doctype' },
        { moTa: '<html lang="vi">', kiem: 'thuoc-tinh', selector: 'html', thuocTinh: 'lang', giaTri: 'vi' },
        { moTa: 'meta charset là UTF-8', kiem: 'thuoc-tinh', selector: 'meta[charset]', thuocTinh: 'charset', khop: '^utf-8$' },
        { moTa: 'meta charset là phần tử đầu tiên trong <head>', kiem: 'ton-tai', selector: 'head > meta[charset]:first-of-type:first-child' },
        { moTa: 'Có meta viewport width=device-width, initial-scale=1', kiem: 'thuoc-tinh', selector: 'meta[name="viewport"]', thuocTinh: 'content', khop: '^width=device-width,\\s*initial-scale=1(\\.0)?$' },
        { moTa: 'Đúng một <title> trong mã nguồn', kiem: 'ma-nguon', tep: 'index.html', khop: '<title>[\\s\\S]*<title>', phuDinh: true },
        { moTa: '<title> viết trong <head> (không lạc trong body)', kiem: 'ma-nguon', tep: 'index.html', khop: '<body[^>]*>[\\s\\S]*<title>', phuDinh: true },
        { moTa: 'Title ghi "Câu lạc bộ Lập trình"', kiem: 'text', selector: 'title', giaTri: 'Câu lạc bộ Lập trình' },
        { moTa: 'Nội dung giữ nguyên: h1 và hai đoạn văn', kiem: 'so-luong', selector: 'body > p', giaTri: 2 },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Dựng đúng cây DOM theo sơ đồ cho trước',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['cây DOM', 'lồng nhau', 'cha / con trực tiếp', 'đóng thẻ theo thứ tự ngược'],
      tienQuyet: ['phần tử và thuộc tính'],
      the: ['html', 'dom', 'nesting'],
      moTa: `<p>Bài 2.1 nói: trình duyệt không giữ tệp của bạn, nó dựng một <strong>cây DOM</strong>, và CSS/JS làm việc trên cây đó. Bài này đi ngược lại: cho sẵn cây, bạn viết HTML sinh ra đúng cây ấy. Đọc kỹ ai là con trực tiếp của ai — ${c('<strong>')} nằm trong đoạn thứ hai, không nằm cạnh nó.</p>
${code(`
body
├── h1                 "Nhật ký học web"
├── p                  "Hôm nay mình học về cây DOM."
├── p
│   ├── (chữ)          "Tài liệu hay nhất là "
│   ├── a  href="https://developer.mozilla.org"   "MDN"
│   ├── (chữ)          ", nhớ đọc mục "
│   └── strong         "Introduction to HTML"
└── div  class="ghi-chu"
    ├── p              "Mẹo: mở DevTools → Elements để soi cây."
    └── img  src="devtools.png"  alt="Tab Elements của DevTools"
`)}`,
      yeuCau: [
        `${c('<body>')} có đúng bốn con trực tiếp theo thứ tự: ${c('h1')}, ${c('p')}, ${c('p')}, ${c('div.ghi-chu')}.`,
        `Đoạn thứ hai chứa liên kết ${c('<a>')} tới MDN <em>và</em> ${c('<strong>')} — cả hai là con trực tiếp của đoạn đó.`,
        `${c('div.ghi-chu')} chứa một ${c('<p>')} và một ${c('<img>')} có đủ ${c('src')} và ${c('alt')} như sơ đồ.`,
        `Chữ trong từng phần tử đúng như sơ đồ.`,
      ],
      dauVao: 'index.html có bộ khung trống và sơ đồ cây dán trong chú thích.',
      dauRa: 'Tab Elements của DevTools hiện đúng cây trong sơ đồ.',
      rangBuoc: [
        'Không thêm phần tử bọc nào khác vào <body> (không div bọc ngoài cùng).',
        'Đóng thẻ theo thứ tự ngược: mở sau, đóng trước.',
      ],
      viDu: [{
        input: '<p>Tài liệu hay nhất là <a href="https://developer.mozilla.org">MDN</a>, nhớ đọc mục <strong>Introduction to HTML</strong></p>',
        output: 'Một đoạn văn: "Tài liệu hay nhất là MDN, nhớ đọc mục Introduction to HTML" — chữ MDN là liên kết, cụm cuối in đậm.',
        explanation: 'a và strong là CON của p (nằm giữa <p> và </p>), xen giữa các mẩu chữ — đúng nhánh thứ ba của sơ đồ.',
      }],
      goiY: [
        'Viết theo từng tầng: bốn con của body trước (mở + đóng ngay), rồi mới điền con của đoạn thứ hai và của div.ghi-chu.',
        'Mẩu "(chữ)" trong sơ đồ là nút văn bản, không phải thẻ — bạn chỉ việc gõ chữ đó vào giữa các thẻ a và strong.',
      ],
      khoiDau: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nhật ký học web</title>
  </head>
  <body>
    <!-- Viết HTML sinh ra đúng cây trong đề bài.
         Gợi ý: body có 4 con trực tiếp: h1, p, p, div.ghi-chu -->
    <h1>Nhật ký học web</h1>
  </body>
</html>
`,
      },
      loiGiai: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nhật ký học web</title>
  </head>
  <body>
    <!-- con 1 của body -->
    <h1>Nhật ký học web</h1>
    <!-- con 2 -->
    <p>Hôm nay mình học về cây DOM.</p>
    <!-- con 3: một p có 4 con — chữ, a, chữ, strong -->
    <p>Tài liệu hay nhất là <a href="https://developer.mozilla.org">MDN</a>, nhớ đọc mục <strong>Introduction to HTML</strong></p>
    <!-- con 4: div bọc một p và một img (img rỗng, không đóng) -->
    <div class="ghi-chu">
      <p>Mẹo: mở DevTools → Elements để soi cây.</p>
      <img src="devtools.png" alt="Tab Elements của DevTools">
    </div>
  </body>
</html>
`,
      },
      giaiThich: `<p>Thụt lề trong lời giải phản chiếu đúng độ sâu trong cây: mỗi lần thụt vào là xuống một tầng. Đó là lý do lập trình viên giữ thụt lề cẩn thận — nhìn mã là thấy cây.</p>
<p>Trong đoạn thứ ba, chữ và thẻ xen kẽ nhau: DOM gọi đó là các <em>nút văn bản</em> nằm cạnh các <em>nút phần tử</em>. Máy chấm dùng bộ chọn con trực tiếp ${c('body > p:nth-of-type(2) > a')} — nếu bạn lỡ đóng ${c('</p>')} trước ${c('<strong>')}, strong thành con của body và kiểm đó đỏ.</p>`,
      loiHayGap: [
        `Bọc mọi thứ trong một ${c('<div>')} cho "gọn" — body khi đó chỉ còn một con, sai sơ đồ.`,
        `Đặt ${c('<strong>')} sau ${c('</p>')} — nhìn trên trang gần như giống, nhưng cây khác: strong không còn thuộc đoạn văn.`,
        `Gõ class thành ${c('class="ghi chu"')} (dấu cách) — đó là HAI class "ghi" và "chu", bộ chọn ${c('.ghi-chu')} không khớp.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
      kiem: [
        { moTa: 'body có đúng 4 con trực tiếp', kiem: 'so-luong', selector: 'body > *', giaTri: 4 },
        { moTa: 'Thứ tự con của body: h1 → p → p → div.ghi-chu', kiem: 'thu-tu', cacSelector: ['body > h1', 'body > p:nth-of-type(1)', 'body > p:nth-of-type(2)', 'body > div.ghi-chu'] },
        { moTa: 'h1 ghi "Nhật ký học web"', kiem: 'text', selector: 'body > h1', giaTri: 'Nhật ký học web' },
        { moTa: 'Đoạn 1 ghi "Hôm nay mình học về cây DOM."', kiem: 'text', selector: 'body > p:nth-of-type(1)', giaTri: 'Hôm nay mình học về cây DOM.' },
        { moTa: 'Liên kết MDN là con trực tiếp của đoạn 2', kiem: 'thuoc-tinh', selector: 'body > p:nth-of-type(2) > a', thuocTinh: 'href', khop: '^https://developer\\.mozilla\\.org/?$' },
        { moTa: '<strong> "Introduction to HTML" là con trực tiếp của đoạn 2', kiem: 'text', selector: 'body > p:nth-of-type(2) > strong', giaTri: 'Introduction to HTML' },
        { moTa: 'Đoạn 2 đọc liền mạch đúng câu', kiem: 'text', selector: 'body > p:nth-of-type(2)', giaTri: 'Tài liệu hay nhất là MDN, nhớ đọc mục Introduction to HTML' },
        { moTa: 'div.ghi-chu chứa một p và một img', kiem: 'so-luong', selector: 'div.ghi-chu > p, div.ghi-chu > img', giaTri: 2 },
        { moTa: 'Ảnh có src="devtools.png" và alt đúng sơ đồ', kiem: 'thuoc-tinh', selector: 'div.ghi-chu > img[src="devtools.png"]', thuocTinh: 'alt', giaTri: 'Tab Elements của DevTools' },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Sửa 5 lỗi lồng thẻ mà trình duyệt đã lặng lẽ vá giùm',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['lồng nhau', 'thẻ chưa đóng', 'phần tử rỗng', 'trình duyệt tự vá lỗi', 'block trong inline'],
      tienQuyet: ['dựng cây DOM'],
      the: ['html', 'debug', 'nesting', 'validator'],
      moTa: `<p>HTML không bao giờ báo lỗi — trình duyệt tự vá rồi hiện ra <em>một</em> trang, chỉ là không phải trang bạn viết. Trang giới thiệu dưới đây có đúng <strong>năm</strong> lỗi lồng thẻ kinh điển. Trên màn hình nó trông "gần đúng", nên rất dễ bỏ qua; nhưng chỉ cần thêm CSS ở chương sau là vỡ. Tìm và sửa cả năm.</p>
<p>Năm lỗi thuộc năm loại: (1) đóng chéo thẻ, (2) quên đóng liên kết, (3) đóng nhầm cấp tiêu đề, (4) ${c('<div>')} nằm trong ${c('<p>')}, (5) đóng một phần tử rỗng.</p>`,
      yeuCau: [
        `Sửa chỗ đóng chéo ${c('<strong><em>…</strong></em>')} thành lồng đúng: mở sau, đóng trước.`,
        `Đóng liên kết MDN để chỉ chữ "Tài liệu MDN" là liên kết.`,
        `Thẻ ${c('<h2>')} phải đóng bằng ${c('</h2>')}.`,
        `Đưa ${c('<div class="the">')} ra khỏi đoạn ${c('<p>')} (p chỉ được chứa nội dung dòng; giữ div ngay sau đoạn văn).`,
        `Bỏ ${c('</img>')}.`,
      ],
      dauVao: 'index.html có 5 lỗi lồng thẻ (mỗi loại một lỗi).',
      dauRa: 'Mã nguồn lồng đúng, và cây DOM đúng như mã: chỉ một liên kết ngắn, thẻ .the là anh em của đoạn văn.',
      rangBuoc: [
        'Không xoá nội dung chữ nào; chỉ sửa thẻ.',
        'Kiểm lại bằng W3C validator (validator.w3.org/nu) nếu muốn — sau khi sửa không còn lỗi nào.',
      ],
      viDu: [{
        input: '<p>Tôi học <strong><em>HTML</strong></em> mỗi ngày.</p>',
        output: 'Nhìn trên trang: chữ "HTML" đậm nghiêng — giống hệt bản đúng.\nTrong DevTools: trình duyệt phải tạo thêm một <em> rỗng để "vá" chỗ đóng chéo.',
        explanation: 'Đây chính là lý do lỗi lồng thẻ khó thấy: trang trông đúng, cây thì không.',
      }, {
        input: '<p>Giới thiệu <div class="the">Thẻ</div></p>',
        output: 'Trong DevTools: <p>Giới thiệu </p><div class="the">Thẻ</div><p></p>',
        explanation: 'Gặp <div>, trình duyệt tự đóng <p> trước nó; </p> còn lại thành một đoạn rỗng thứ hai.',
      }],
      goiY: [
        'Đọc mã theo cặp: mỗi thẻ mở phải gặp đúng thẻ đóng của NÓ trước khi thẻ cha đóng. Lỗi 2 là chỗ thẻ mở <a> không bao giờ gặp </a>.',
        'Lỗi 4: <p> chỉ chứa chữ và phần tử dòng (a, strong, em, img…). Đóng </p> trước <div class="the">, và xoá </p> thừa sau </div>.',
      ],
      khoiDau: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Giới thiệu bản thân</title>
  </head>
  <body>
    <h1>Mình là Lan</h1>
    <p>Mình đang học <strong><em>HTML</strong></em> mỗi ngày.</p>
    <p>Mình hay tra <a href="https://developer.mozilla.org">Tài liệu MDN mỗi khi quên một thẻ.</p>
    <h2>Kỹ năng</h3>
    <p>Giới thiệu nhanh:
      <div class="the">HTML · CSS · Git</div>
    </p>
    <img src="lan.jpg" alt="Ảnh chân dung của Lan"></img>
  </body>
</html>
`,
      },
      loiGiai: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Giới thiệu bản thân</title>
  </head>
  <body>
    <h1>Mình là Lan</h1>
    <!-- (1) mở strong rồi em ⇒ đóng em rồi strong (mở sau, đóng trước) -->
    <p>Mình đang học <strong><em>HTML</em></strong> mỗi ngày.</p>
    <!-- (2) đóng </a> ngay sau chữ của liên kết -->
    <p>Mình hay tra <a href="https://developer.mozilla.org">Tài liệu MDN</a> mỗi khi quên một thẻ.</p>
    <!-- (3) h2 đóng bằng /h2 -->
    <h2>Kỹ năng</h2>
    <!-- (4) p chỉ chứa nội dung dòng: đóng p TRƯỚC div -->
    <p>Giới thiệu nhanh:</p>
    <div class="the">HTML · CSS · Git</div>
    <!-- (5) img là phần tử rỗng: không có thẻ đóng -->
    <img src="lan.jpg" alt="Ảnh chân dung của Lan">
  </body>
</html>
`,
      },
      giaiThich: `<p>Năm lỗi, năm cơ chế vá khác nhau của trình duyệt: (1) đóng chéo ⇒ trình duyệt đóng ${c('<em>')} giùm rồi mở lại một ${c('<em>')} rỗng; (2) thiếu ${c('</a>')} ⇒ liên kết nuốt hết phần chữ phía sau (và trong trang thật có thể nuốt luôn cả các đoạn kế tiếp); (3) ${c('</h3>')} không khớp ⇒ trình duyệt đóng tiêu đề đang mở giùm; (4) ${c('<div>')} trong ${c('<p>')} ⇒ đoạn văn bị đóng sớm, ${c('</p>')} thừa sinh ra một đoạn rỗng; (5) ${c('</img>')} ⇒ bị bỏ qua.</p>
<p>Máy chấm kiểm cả hai phía: <strong>mã nguồn</strong> không còn mẫu sai (vì trình duyệt đã vá thì DOM có khi trông đúng), và <strong>cây DOM</strong> đúng ý (liên kết chỉ chứa "Tài liệu MDN", ${c('.the')} là anh em của đoạn văn, không có đoạn rỗng).</p>`,
      loiHayGap: [
        `Sửa lỗi (4) bằng cách đổi ${c('<div>')} thành ${c('<span>')} nhưng vẫn để trong p — hợp lệ, nhưng làm mất khối "thẻ" riêng mà CSS sẽ tạo kiểu ở chương sau; đề yêu cầu đưa div ra ngoài.`,
        `Thêm ${c('</a>')} ở cuối đoạn thay vì ngay sau chữ "Tài liệu MDN" — liên kết vẫn dài cả câu.`,
        `Tin rằng "trang hiện đúng là xong" — luôn mở DevTools → Elements so cây với mã.`,
      ],
      thamKhao: 'https://validator.w3.org/nu/',
      kiem: [
        { moTa: 'Không còn đóng chéo </strong></em>', kiem: 'ma-nguon', tep: 'index.html', khop: '<strong><em>[^<]*</strong>', phuDinh: true },
        { moTa: 'strong bọc em, em bọc chữ "HTML"', kiem: 'text', selector: 'strong > em', giaTri: 'HTML' },
        { moTa: 'Không có <em> rỗng do trình duyệt vá', kiem: 'khong-ton-tai', selector: 'em:empty' },
        { moTa: 'Liên kết chỉ chứa đúng "Tài liệu MDN"', kiem: 'text', selector: 'a[href^="https://developer.mozilla.org"]', giaTri: 'Tài liệu MDN' },
        { moTa: 'Không còn </h3> lạc', kiem: 'ma-nguon', tep: 'index.html', khop: '</h3>', phuDinh: true },
        { moTa: 'h2 "Kỹ năng" đóng đúng', kiem: 'ma-nguon', tep: 'index.html', khop: '<h2>\\s*Kỹ năng\\s*</h2>' },
        { moTa: 'Không có <div> viết bên trong <p> trong mã', kiem: 'ma-nguon', tep: 'index.html', khop: '<p[^>]*>(?:(?!</p>)[\\s\\S])*<div', phuDinh: true },
        { moTa: '.the là con trực tiếp của body (anh em của đoạn văn)', kiem: 'ton-tai', selector: 'body > div.the' },
        { moTa: 'Không có đoạn <p> rỗng nào', kiem: 'khong-ton-tai', selector: 'p:empty' },
        { moTa: 'Không có </img>', kiem: 'ma-nguon', tep: 'index.html', khop: '</img\\s*>', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Chân trang chui vào thanh bên: truy ra thẻ </div> bị thiếu',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['thẻ chưa đóng', 'cây DOM vs mã nguồn', 'DevTools Elements', 'đếm cặp thẻ'],
      tienQuyet: ['sửa lỗi lồng thẻ', 'cây DOM'],
      the: ['html', 'debug', 'dom', 'div'],
      moTa: `<p>Đây đúng là cái bẫy cuối bài 2.1: <em>"Quên một ${c('</div>')} là trình duyệt tự đóng giùm — ở đâu đó. Cái footer của bạn kết thúc bên trong thanh bên, bộ chọn CSS thôi khớp, và bạn mất một tiếng với một bảng kiểu vốn đã đúng."</em></p>
<p>Trang blog dưới đây có bố cục 3 khối nằm trong ${c('div.trang')}: ${c('div.thanh-ben')}, ${c('div.noi-dung')}, ${c('div.chan-trang')}. Nhưng mở DevTools thì thấy nội dung và chân trang đều nằm <strong>bên trong</strong> thanh bên. Mã dài, lồng nhiều tầng, và chỉ thiếu đúng một thẻ đóng. Tìm nó bằng cách đếm, đừng đoán.</p>`,
      yeuCau: [
        `${c('div.trang')} có đúng ba con trực tiếp theo thứ tự: ${c('.thanh-ben')}, ${c('.noi-dung')}, ${c('.chan-trang')}.`,
        `Không phần tử nào của ${c('.noi-dung')} hay ${c('.chan-trang')} nằm trong ${c('.thanh-ben')}.`,
        `Thanh bên vẫn giữ đủ ${c('<h2>')} "Chuyên mục" và danh sách 3 liên kết của nó.`,
        `Sửa bằng cách thêm <strong>đúng một</strong> thẻ đóng vào đúng chỗ — không xoá, không viết lại khối nào.`,
      ],
      dauVao: 'index.html: trang blog ~40 dòng, thiếu đúng một </div> trong thanh bên.',
      dauRa: 'Cây DOM: div.trang > [div.thanh-ben, div.noi-dung, div.chan-trang] — ba anh em, không ai nằm trong ai.',
      rangBuoc: [
        'Tổng số thẻ <div mở bằng tổng số </div> sau khi sửa.',
        'Không dùng CSS hay JS để "che" lỗi.',
        'Chỉ thêm một dòng </div>.',
      ],
      viDu: [{
        input: '<div class="trang">\n  <div class="thanh-ben">\n    <div class="hop">…\n    </div>\n  <!-- thiếu </div> của thanh-ben ở đây -->\n  <div class="noi-dung">…</div>\n  <div class="chan-trang">…</div>\n</div>',
        output: 'DevTools: div.trang > div.thanh-ben > [div.hop, div.noi-dung, div.chan-trang]\nTrên màn hình (khi đã có CSS): nội dung và chân trang bị bóp vào cột thanh bên hẹp.',
        explanation: '</div> cuối cùng (vốn của .trang) bị trình duyệt dùng để đóng .thanh-ben; .trang tự đóng ở cuối body.',
      }],
      goiY: [
        'Đếm: số "<div" và số "</div>" trong tệp lệch nhau đúng 1. Rồi đi từ trên xuống, giữ một con số độ sâu: gặp <div +1, gặp </div> −1. Ngay trước <div class="noi-dung">, độ sâu phải trở về 1 (chỉ còn .trang đang mở).',
        'Trong .thanh-ben có hai hộp con (.hop). Hộp thứ hai đã đóng; chính thanh-ben chưa đóng — thêm </div> ngay sau </div> của hộp thứ hai, trước dòng <div class="noi-dung">.',
      ],
      khoiDau: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Blog của Tú</title>
  </head>
  <body>
    <div class="trang">
      <div class="thanh-ben">
        <div class="hop">
          <h2>Chuyên mục</h2>
          <div class="danh-sach">
            <p><a href="/html">HTML</a></p>
            <p><a href="/css">CSS</a></p>
            <p><a href="/js">JavaScript</a></p>
          </div>
        </div>
        <div class="hop">
          <h2>Theo dõi</h2>
          <p><a href="https://github.com">GitHub của Tú</a></p>
        </div>

      <div class="noi-dung">
        <h1>Tuần đầu học HTML</h1>
        <div class="bai-viet">
          <p>Tuần này mình học phần tử, thẻ và thuộc tính.</p>
          <p>Bài học lớn nhất: luôn soi cây DOM trong DevTools.</p>
        </div>
      </div>

      <div class="chan-trang">
        <p>© 2026 Blog của Tú</p>
      </div>
    </div>
  </body>
</html>
`,
      },
      loiGiai: {
        'index.html': `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Blog của Tú</title>
  </head>
  <body>
    <div class="trang">                         <!-- độ sâu 1 -->
      <div class="thanh-ben">                   <!-- độ sâu 2 -->
        <div class="hop">                       <!-- 3 -->
          <h2>Chuyên mục</h2>
          <div class="danh-sach">               <!-- 4 -->
            <p><a href="/html">HTML</a></p>
            <p><a href="/css">CSS</a></p>
            <p><a href="/js">JavaScript</a></p>
          </div>                                <!-- về 3 -->
        </div>                                  <!-- về 2 -->
        <div class="hop">                       <!-- 3 -->
          <h2>Theo dõi</h2>
          <p><a href="https://github.com">GitHub của Tú</a></p>
        </div>                                  <!-- về 2 -->
      </div>                                    <!-- THẺ BỊ THIẾU: đóng .thanh-ben, về 1 -->

      <div class="noi-dung">                    <!-- 2: anh em của thanh-ben -->
        <h1>Tuần đầu học HTML</h1>
        <div class="bai-viet">
          <p>Tuần này mình học phần tử, thẻ và thuộc tính.</p>
          <p>Bài học lớn nhất: luôn soi cây DOM trong DevTools.</p>
        </div>
      </div>                                    <!-- về 1 -->

      <div class="chan-trang">                  <!-- 2 -->
        <p>© 2026 Blog của Tú</p>
      </div>                                    <!-- về 1 -->
    </div>                                      <!-- về 0: đóng .trang -->
  </body>
</html>
`,
      },
      giaiThich: `<p>Kỹ thuật "đếm độ sâu" biến việc dò lỗi thành việc máy móc: mỗi ${c('<div')} cộng 1, mỗi ${c('</div>')} trừ 1. Ở mã khởi đầu, đến dòng ${c('<div class="noi-dung">')} độ sâu đang là 2 (vẫn trong thanh bên) trong khi bố cục muốn nó là 1. Thẻ thiếu vì thế phải nằm <em>trước</em> dòng đó và <em>sau</em> thẻ đóng của hộp thứ hai.</p>
<p>Vì sao trình duyệt không báo lỗi? Thiếu ${c('</div>')} không phải lỗi cú pháp trong HTML: khi gặp ${c('</div>')} cuối cùng, trình duyệt đóng phần tử div đang mở gần nhất (là ${c('.thanh-ben')}), rồi tự đóng ${c('.trang')} khi hết body. Trang vẫn hiện — chỉ là cây sai. Máy chấm vì vậy kiểm <strong>cây</strong>: ${c('.trang > .noi-dung')} phải tồn tại và ${c('.thanh-ben .chan-trang')} không được tồn tại.</p>`,
      loiHayGap: [
        `Thêm ${c('</div>')} ở cuối tệp — số thẻ cân bằng, nhưng nội dung và chân trang vẫn nằm trong thanh bên.`,
        `Xoá một ${c('<div class="hop">')} cho "cân" — mất cấu trúc hộp, sai yêu cầu "chỉ thêm một thẻ đóng".`,
        `Đếm bằng mắt trên mã thụt lề sai — thụt lề không phải là cây; hãy tin DevTools Elements (hoặc phép đếm), không tin khoảng trắng.`,
      ],
      thamKhao: 'https://developer.chrome.com/docs/devtools/dom',
      kiem: [
        { moTa: 'div.trang có đúng 3 con trực tiếp', kiem: 'so-luong', selector: 'div.trang > *', giaTri: 3 },
        { moTa: 'Thứ tự: .thanh-ben → .noi-dung → .chan-trang (đều là con của .trang)', kiem: 'thu-tu', cacSelector: ['.trang > .thanh-ben', '.trang > .noi-dung', '.trang > .chan-trang'] },
        { moTa: '.noi-dung KHÔNG nằm trong .thanh-ben', kiem: 'khong-ton-tai', selector: '.thanh-ben .noi-dung' },
        { moTa: '.chan-trang KHÔNG nằm trong .thanh-ben', kiem: 'khong-ton-tai', selector: '.thanh-ben .chan-trang' },
        { moTa: 'Thanh bên vẫn có h2 "Chuyên mục" và 3 liên kết chuyên mục', kiem: 'so-luong', selector: '.thanh-ben .danh-sach a', giaTri: 3 },
        { moTa: 'Thanh bên có đúng 2 hộp .hop', kiem: 'so-luong', selector: '.thanh-ben > .hop', giaTri: 2 },
        { moTa: 'Đủ 8 thẻ đóng </div> cho 8 thẻ <div> mở', kiem: 'ma-nguon', tep: 'index.html', khop: '(?:[\\s\\S]*?</div>){8}' },
        { moTa: 'h1 thuộc .noi-dung', kiem: 'ton-tai', selector: '.trang > .noi-dung > h1' },
      ],
    },
  ],
};
