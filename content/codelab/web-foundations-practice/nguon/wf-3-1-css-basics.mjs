/** Bộ luyện bài 3.1 — CSS căn bản: bộ chọn, thuộc tính, xếp tầng. Lược đồ: ./_luoc-do.mjs */
import { c, code } from './_luoc-do.mjs';

/** index.html nối styles.css (cách thứ ba của bài 3.1 — external) */
const TRANG = (title, body, links = '    <link rel="stylesheet" href="styles.css">') => `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
${links}
  </head>
  <body>
${body}
  </body>
</html>
`;

export default {
  slug: 'wf-3-1-css-basics',
  ten: '3.1 CSS căn bản: bộ chọn, thuộc tính, xếp tầng',
  baiHoc: 'Nền tảng Web — Bài 3.1 CSS căn bản: bộ chọn, thuộc tính, và sự "xếp tầng"',
  ngonNgu: 'css',
  level: 'BEGINNER',
  moTa: 'Ba cách gắn CSS, hình dạng một quy tắc, bộ chọn thẻ/class/id/con cháu, độ đặc hiệu và thứ tự nguồn, vì sao tránh !important — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Dọn style nội dòng ra một tệp styles.css riêng',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['inline / internal / external', 'link rel="stylesheet"', 'quy tắc CSS', 'khai báo'],
      tienQuyet: ['bộ khung HTML5'],
      the: ['css', 'link', 'external-stylesheet'],
      moTa: `<p>Bài 3.1 có ba cách gắn CSS: inline (${c('style="…"')} trên phần tử — "nhanh nhưng khó quản, tránh"), internal (khối ${c('<style>')}), và external (tệp ${c('.css')} riêng, nối bằng ${c('<link>')} — "chuẩn mực"). Trang dưới đây trộn cả hai cách đầu. Hãy dọn hết sang ${c('styles.css')} để một tệp tạo kiểu cho cả site.</p>`,
      yeuCau: [
        `Trong ${c('<head>')} có ${c('<link rel="stylesheet" href="styles.css">')}.`,
        `Không còn thuộc tính ${c('style="…"')} nào và không còn khối ${c('<style>')} nào trong index.html.`,
        `${c('styles.css')} có quy tắc cho ${c('p')}: ${c('color: #333')}, ${c('font-size: 16px')}, ${c('line-height: 1.6')} (đúng ví dụ của bài).`,
        `Và quy tắc cho ${c('h1')}: ${c('color: navy')}.`,
      ],
      dauVao: 'index.html có <style> trong head và style="…" trên h1; styles.css trống.',
      dauRa: 'Giao diện y như cũ, nhưng mọi kiểu nằm trong styles.css.',
      rangBuoc: [
        'Không đổi nội dung HTML ngoài việc xoá style/thêm link.',
        'Mỗi khai báo kết thúc bằng dấu chấm phẩy.',
      ],
      viDu: [{
        input: 'styles.css:\np {\n  color: #333;\n  font-size: 16px;\n  line-height: 1.6;\n}',
        output: 'Mọi đoạn văn: chữ xám đậm, cỡ 16px, giãn dòng 1,6 lần cỡ chữ.',
        explanation: 'bộ_chọn { thuộc_tính: giá_trị; } — một quy tắc áp cho MỌI phần tử khớp bộ chọn.',
      }],
      goiY: [
        'Chép phần bên trong <style>…</style> sang styles.css, rồi chuyển nội dung style="color: navy" của h1 thành một quy tắc h1 { … }.',
        'Thêm <link rel="stylesheet" href="styles.css"> vào <head>, xoá khối <style> và thuộc tính style.',
      ],
      khoiDau: {
        'styles.css': `
/* Dọn kiểu từ index.html sang đây */
`,
        'index.html': TRANG('Câu lạc bộ', `    <h1 style="color: navy;">Câu lạc bộ F-Code</h1>
    <p>Sinh hoạt tối thứ Năm hằng tuần.</p>
    <p>Năm nay học HTML, CSS và JavaScript.</p>`, `    <style>
      p { color: #333; font-size: 16px; line-height: 1.6; }
    </style>`),
      },
      loiGiai: {
        'styles.css': `
/* Một tệp tạo kiểu cho cả site — nối từ <head> bằng <link> */

/* bộ chọn thẻ: mọi <h1> */
h1 {
  color: navy;
}

/* bộ chọn thẻ: mọi <p> — đúng ví dụ của bài 3.1 */
p {
  color: #333;        /* xám đậm, dễ đọc hơn đen tuyền */
  font-size: 16px;
  line-height: 1.6;   /* không đơn vị: 1,6 lần cỡ chữ */
}
`,
        'index.html': TRANG('Câu lạc bộ', `    <h1>Câu lạc bộ F-Code</h1>
    <p>Sinh hoạt tối thứ Năm hằng tuần.</p>
    <p>Năm nay học HTML, CSS và JavaScript.</p>`),
      },
      giaiThich: `<p>Tệp ngoài tách nội dung (HTML) khỏi hình thức (CSS) — đúng "điều cốt lõi" mở đầu bài 3.1. Lợi ích thực tế: mười trang cùng nối một ${c('styles.css')} thì đổi màu tiêu đề một lần là cả site đổi; trình duyệt tải tệp CSS một lần rồi lưu đệm cho mọi trang.</p>
<p>Máy chấm kiểm cả mã nguồn (có link, không còn ${c('style=')} hay ${c('<style>')}) và kết quả: màu/cỡ chữ <em>computed</em> của ${c('p')} và ${c('h1')} — tức là CSS của bạn thật sự được áp, không chỉ "có mặt".</p>`,
      loiHayGap: [
        `Viết ${c('<link href="styles.css">')} thiếu ${c('rel="stylesheet"')} — trình duyệt không biết đó là bảng kiểu, bỏ qua.`,
        `Chép cả thẻ ${c('<style>')} vào tệp .css — tệp CSS chỉ chứa quy tắc, không có thẻ HTML.`,
        `Quên dấu ${c(';')} giữa hai khai báo — khai báo thứ hai bị nuốt vào giá trị của khai báo đầu, cả hai cùng hỏng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/Getting_started',
      kiem: [
        { moTa: 'head có <link rel="stylesheet" href="styles.css">', kiem: 'ton-tai', selector: 'head link[rel="stylesheet"][href="styles.css"]' },
        { moTa: 'Không còn thuộc tính style="…"', kiem: 'khong-ton-tai', selector: '[style]' },
        { moTa: 'Không còn khối <style> trong index.html', kiem: 'ma-nguon', tep: 'index.html', khop: '<style', phuDinh: true },
        { moTa: 'p có màu #333 (rgb(51, 51, 51))', kiem: 'css', selector: 'p', thuocTinh: 'color', giaTri: 'rgb(51, 51, 51)' },
        { moTa: 'p cỡ chữ 16px', kiem: 'css', selector: 'p', thuocTinh: 'font-size', giaTri: '16px' },
        { moTa: 'p giãn dòng 1.6', kiem: 'css', selector: 'p', thuocTinh: 'line-height', khop: '^(1\\.6|25\\.6px)$' },
        { moTa: 'h1 màu navy (rgb(0, 0, 128))', kiem: 'css', selector: 'h1', thuocTinh: 'color', giaTri: 'rgb(0, 0, 128)' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Ba bộ chọn dùng hằng ngày: theo thẻ, theo class, theo id',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['bộ chọn thẻ', 'bộ chọn .class', 'bộ chọn #id', 'tái dùng class'],
      tienQuyet: ['quy tắc CSS'],
      the: ['css', 'selectors'],
      moTa: `<p>Ba dòng ví dụ của bài 3.1:</p>
${code(`
h1        { color: navy; }      /* theo tên thẻ: mọi <h1> */
.card     { padding: 16px; }    /* theo class: mọi phần tử có class="card" */
#site-nav { background: #eee; } /* theo id: phần tử duy nhất id="site-nav" */
`)}
<p>HTML đã có sẵn các class và id. Viết ${c('styles.css')} để tạo kiểu đúng phần tử, mỗi yêu cầu dùng đúng loại bộ chọn được chỉ định.</p>`,
      yeuCau: [
        `<strong>Theo thẻ</strong>: mọi ${c('h2')} màu ${c('teal')}.`,
        `<strong>Theo class</strong>: mọi phần tử ${c('class="card"')} có ${c('padding: 16px')} và ${c('border: 1px solid #ccc')} — có ba thẻ, một quy tắc.`,
        `<strong>Theo id</strong>: thanh ${c('id="site-nav"')} có nền ${c('#eee')}.`,
        `Thẻ có thêm class ${c('noi-bat')} (một thẻ có hai class) có chữ đậm: ${c('font-weight: bold')}.`,
      ],
      dauVao: 'index.html có h2, ba div.card (một cái thêm .noi-bat), nav#site-nav; styles.css trống.',
      dauRa: 'Ba thẻ cùng khung viền, thẻ nổi bật chữ đậm, thanh điều hướng nền xám nhạt, tiêu đề mục màu xanh mòng két.',
      rangBuoc: [
        'Không sửa index.html.',
        'Không dùng style nội dòng.',
        'Không viết ba quy tắc riêng cho ba thẻ — một class, một quy tắc.',
      ],
      viDu: [{
        input: '<div class="card noi-bat">…</div>',
        output: 'Thẻ này nhận CẢ quy tắc .card (khung, padding) LẪN .noi-bat (chữ đậm).',
        explanation: 'class="card noi-bat" là hai class, cách nhau dấu cách. Mỗi bộ chọn class khớp độc lập.',
      }],
      goiY: [
        'Bốn quy tắc: h2 { … }, .card { … }, #site-nav { … }, .noi-bat { … }. Dấu chấm = class, dấu thăng = id.',
        'background: #eee; hoặc background-color: #eee; đều được. border viết gọn: 1px solid #ccc.',
      ],
      khoiDau: {
        'styles.css': `
/* Viết 4 quy tắc: theo thẻ, theo class, theo id, và class thứ hai */
`,
        'index.html': TRANG('Khoá học', `    <nav id="site-nav"><a href="/">Trang chủ</a> · <a href="/khoa-hoc">Khoá học</a></nav>
    <h1>Khoá học nổi bật</h1>
    <h2>Lập trình web</h2>
    <div class="card">Nền tảng Web</div>
    <div class="card noi-bat">React — đang giảm giá</div>
    <div class="card">Node.js</div>
    <h2>Dữ liệu</h2>
    <p>Sắp ra mắt.</p>`),
      },
      loiGiai: {
        'styles.css': `
/* theo THẺ: mọi <h2> trên trang */
h2 {
  color: teal;
}

/* theo CLASS: mọi phần tử có class="card" — một quy tắc cho cả ba thẻ */
.card {
  padding: 16px;
  border: 1px solid #ccc;
}

/* class thứ hai trên cùng phần tử: cộng thêm, không thay thế .card */
.noi-bat {
  font-weight: bold;
}

/* theo ID: phần tử duy nhất id="site-nav" — dùng dè sẻn */
#site-nav {
  background: #eee;
}
`,
        'index.html': TRANG('Khoá học', `    <nav id="site-nav"><a href="/">Trang chủ</a> · <a href="/khoa-hoc">Khoá học</a></nav>
    <h1>Khoá học nổi bật</h1>
    <h2>Lập trình web</h2>
    <div class="card">Nền tảng Web</div>
    <div class="card noi-bat">React — đang giảm giá</div>
    <div class="card">Node.js</div>
    <h2>Dữ liệu</h2>
    <p>Sắp ra mắt.</p>`),
      },
      giaiThich: `<p>Mỗi loại bộ chọn có tầm khác nhau: thẻ thì rộng (mọi h2), class thì tái dùng được (mọi thẻ mang ${c('card')}), id thì chỉ một phần tử. Bài 3.1 khuyên "ưu tiên class" — công cụ hằng ngày — và dùng id dè sẻn, vì id có độ đặc hiệu rất cao (bài 5 của bộ này sẽ cho thấy cái giá).</p>
<p>Một phần tử nhiều class nhận kiểu từ mọi class của nó: thẻ React vừa có khung của ${c('.card')} vừa có chữ đậm của ${c('.noi-bat')}. Máy chấm kiểm giá trị computed trên từng phần tử, kể cả kiểm âm: hai thẻ thường <em>không</em> được đậm.</p>`,
      loiHayGap: [
        `Viết ${c('card { … }')} thiếu dấu chấm — đó là bộ chọn thẻ tìm phần tử tên "card", không khớp gì.`,
        `Viết ${c('.site-nav')} cho id — dấu chấm là class; id dùng ${c('#')}.`,
        `Viết ${c('.card.noi-bat')} hay ${c('.card .noi-bat')} lẫn lộn — có dấu cách nghĩa là "con cháu", không dấu cách nghĩa là "cùng phần tử".`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors',
      kiem: [
        { moTa: 'Mọi h2 màu teal (rgb(0, 128, 128))', kiem: 'css', selector: 'h2', thuocTinh: 'color', giaTri: 'rgb(0, 128, 128)' },
        { moTa: 'Mọi .card có padding 16px', kiem: 'css', selector: '.card', thuocTinh: 'padding-top', giaTri: '16px' },
        { moTa: 'Mọi .card có viền 1px', kiem: 'css', selector: '.card', thuocTinh: 'border-left-width', giaTri: '1px' },
        { moTa: 'Viền .card màu #ccc', kiem: 'css', selector: '.card', thuocTinh: 'border-top-color', giaTri: 'rgb(204, 204, 204)' },
        { moTa: '#site-nav nền #eee', kiem: 'css', selector: '#site-nav', thuocTinh: 'background-color', giaTri: 'rgb(238, 238, 238)' },
        { moTa: '.noi-bat chữ đậm', kiem: 'css', selector: '.noi-bat', thuocTinh: 'font-weight', khop: '^(bold|700)$' },
        { moTa: 'Thẻ thường KHÔNG đậm', kiem: 'css', selector: '.card:not(.noi-bat)', thuocTinh: 'font-weight', khop: '^(normal|400)$' },
        { moTa: 'Một quy tắc .card cho cả ba thẻ (không quy tắc riêng từng thẻ)', kiem: 'ma-nguon', tep: 'styles.css', khop: ':nth-child|:first-child|:last-child', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Bộ chọn con cháu: chỉ tô liên kết nằm trong thanh điều hướng',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['bộ chọn con cháu (descendant)', 'kết hợp bộ chọn', 'nav a'],
      tienQuyet: ['bộ chọn thẻ/class'],
      the: ['css', 'selectors', 'descendant'],
      moTa: `<p>Bài 3.1: <em>"Bạn có thể kết hợp: ${c('nav a')} nghĩa là mọi ${c('<a>')} bên trong một ${c('<nav>')}."</em> Trang có liên kết ở ba chỗ: thanh điều hướng, thân bài và chân trang. Người viết trước dùng ${c('a { … }')} nên cả ba chỗ đổi màu trắng — liên kết trong thân bài (nền trắng) biến mất. Chỉ tô liên kết trong nav, không sửa HTML.</p>`,
      yeuCau: [
        `Liên kết trong ${c('nav')}: chữ trắng, không gạch chân (${c('text-decoration: none')}).`,
        `${c('nav')} có nền ${c('#1e293b')} để chữ trắng đọc được.`,
        `Liên kết trong thân bài và chân trang giữ màu mặc định của trình duyệt (không bị quy tắc nào của bạn chạm tới).`,
        `Không thêm class vào HTML.`,
      ],
      dauVao: 'styles.css có quy tắc a { color: white; text-decoration: none; } áp lên mọi liên kết.',
      dauRa: 'Thanh điều hướng nền tối, liên kết trắng; liên kết trong bài vẫn xanh gạch chân như mặc định.',
      rangBuoc: [
        'Không sửa index.html.',
        'Không dùng id hay !important.',
      ],
      viDu: [{
        input: 'nav a { color: white; }',
        output: '<nav><a>Trang chủ</a></nav> ⇒ trắng\n<main><a>MDN</a></main> ⇒ không đổi',
        explanation: 'Dấu cách giữa nav và a nghĩa là "a nằm đâu đó bên trong nav" (con, cháu, chắt… đều khớp).',
      }],
      goiY: [
        'Bộ chọn hiện tại (a) quá rộng. Thu hẹp bằng cách thêm "ngữ cảnh" phía trước, cách một dấu cách.',
        'Đổi a { … } thành nav a { … } và thêm nav { background: #1e293b; }.',
      ],
      khoiDau: {
        'styles.css': `
/* Quy tắc này đang tô MỌI liên kết — sửa cho chỉ tô liên kết trong nav */
a {
  color: white;
  text-decoration: none;
}
`,
        'index.html': TRANG('Blog', `    <nav>
      <a href="/">Trang chủ</a>
      <a href="/bai-viet">Bài viết</a>
    </nav>
    <main>
      <p>Tài liệu hay nhất là <a href="https://developer.mozilla.org">MDN</a>.</p>
    </main>
    <footer>
      <p><a href="/lien-he">Liên hệ</a></p>
    </footer>`),
      },
      loiGiai: {
        'styles.css': `
/* nền tối cho thanh điều hướng để chữ trắng đọc được */
nav {
  background: #1e293b;
}

/* con cháu: chỉ những <a> nằm BÊN TRONG <nav> */
nav a {
  color: white;
  text-decoration: none;
}

/* liên kết ở main/footer không bị quy tắc nào chạm tới ⇒ giữ mặc định */
`,
        'index.html': TRANG('Blog', `    <nav>
      <a href="/">Trang chủ</a>
      <a href="/bai-viet">Bài viết</a>
    </nav>
    <main>
      <p>Tài liệu hay nhất là <a href="https://developer.mozilla.org">MDN</a>.</p>
    </main>
    <footer>
      <p><a href="/lien-he">Liên hệ</a></p>
    </footer>`),
      },
      giaiThich: `<p>Bộ chọn con cháu thu hẹp phạm vi bằng <em>vị trí trong cây DOM</em> thay vì bằng class — HTML không cần đổi gì. Đây là lý do bài 2.3 quan trọng: có ${c('<nav>')} ngữ nghĩa thì CSS chọn "liên kết trong thanh điều hướng" được ngay; với div không tên thì phải thêm class.</p>
<p>Máy chấm kiểm cả hai chiều: liên kết trong nav trắng và không gạch chân, liên kết trong main/footer <em>không</em> trắng (vẫn là màu mặc định, khác rgb(255, 255, 255)).</p>`,
      loiHayGap: [
        `Viết ${c('nav, a')} (có dấu phẩy) — dấu phẩy nghĩa là "nav VÀ mọi a", vẫn tô mọi liên kết.`,
        `Viết ${c('nav > a')} — trong bài này cũng chạy (a là con trực tiếp), nhưng hỏng ngay khi menu được bọc trong ul/li.`,
        `Thêm ${c('main a { color: blue; }')} để "đè lại" — chữa triệu chứng, quy tắc gốc vẫn quá rộng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator',
      kiem: [
        { moTa: 'nav có nền #1e293b', kiem: 'css', selector: 'nav', thuocTinh: 'background-color', giaTri: 'rgb(30, 41, 59)' },
        { moTa: 'Liên kết trong nav chữ trắng', kiem: 'css', selector: 'nav a', thuocTinh: 'color', giaTri: 'rgb(255, 255, 255)' },
        { moTa: 'Liên kết trong nav không gạch chân', kiem: 'css', selector: 'nav a', thuocTinh: 'text-decoration-line', khop: '^none$' },
        { moTa: 'Liên kết trong main KHÔNG trắng', kiem: 'css', selector: 'main a', thuocTinh: 'color', khop: '^(?!rgb\\(255, 255, 255\\)$)' },
        { moTa: 'Liên kết trong footer KHÔNG trắng', kiem: 'css', selector: 'footer a', thuocTinh: 'color', khop: '^(?!rgb\\(255, 255, 255\\)$)' },
        { moTa: 'Không thêm class vào HTML', kiem: 'khong-ton-tai', selector: '[class]' },
        { moTa: 'Không dùng !important', kiem: 'ma-nguon', tep: 'styles.css', khop: '!important', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Style "không ăn": tìm luật đặc hiệu hơn đang đè lên và cân bằng lại',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['độ đặc hiệu (specificity)', 'id thắng class thắng thẻ', 'DevTools Styles', 'không dùng !important'],
      tienQuyet: ['ba loại bộ chọn'],
      the: ['css', 'cascade', 'specificity', 'debug'],
      moTa: `<p>Bài 3.1: <em>"Một id thắng bao nhiêu class cũng thắng."</em> Menu dưới đây cần liên kết của trang hiện tại (class ${c('active')}) màu đỏ, các liên kết khác màu xám. Bạn đã viết ${c('.active { color: crimson; }')} ở cuối tệp nhưng nó "không ăn". Mở DevTools ra sẽ thấy nó bị gạch ngang bởi ${c('#menu a')}. Sửa tận gốc: <strong>hạ</strong> độ đặc hiệu của luật gây chuyện — không dùng ${c('!important')}, không thêm id.</p>`,
      yeuCau: [
        `Liên kết ${c('.active')} màu ${c('crimson')}; các liên kết khác trong menu màu ${c('gray')}.`,
        `Thay bộ chọn ${c('#menu a')} bằng bộ chọn dùng class (nav đã có ${c('class="menu"')}).`,
        `Không có ${c('!important')}, không có bộ chọn id nào trong styles.css.`,
        `Không sửa index.html.`,
      ],
      dauVao: 'styles.css: #menu a { color: gray; } … .active { color: crimson; } (thua).',
      dauRa: '"Khoá học" (trang hiện tại) màu đỏ thẫm, ba liên kết còn lại màu xám.',
      rangBuoc: [
        'Không !important, không #id trong bộ chọn.',
        'Không viết lại thành bộ chọn dài hơn cần thiết (vd không cần .menu a.active nếu thứ tự đã giải quyết được).',
      ],
      viDu: [{
        input: '#menu a   { color: gray; }      /* (1,0,1) */\n.active   { color: crimson; }   /* (0,1,0) */',
        output: 'Liên kết .active: XÁM. Quy tắc .active bị gạch ngang trong DevTools.',
        explanation: 'Một id (1,0,1) thắng mọi số class. Thứ tự (viết sau) chỉ phân định khi độ đặc hiệu HOÀ.',
      }, {
        input: '.menu a   { color: gray; }      /* (0,1,1) */\n.menu .active { color: crimson; } /* (0,2,0) */',
        output: 'Liên kết .active: ĐỎ.',
        explanation: '(0,2,0) > (0,1,1): hai class thắng một class + một thẻ.',
      }],
      goiY: [
        'Tính điểm (id, class, thẻ): #menu a = (1,0,1); .active = (0,1,0). Muốn .active thắng mà không leo thang, hãy hạ luật kia xuống mức class.',
        'Đổi #menu a thành .menu a = (0,1,1). Lúc này .active (0,1,0) vẫn THUA (0,1,1)! Hãy viết .menu .active (0,2,0), hoặc .menu a.active (0,2,1).',
      ],
      khoiDau: {
        'styles.css': `
#menu a {
  color: gray;
  text-decoration: none;
}

/* liên kết của trang hiện tại — "không ăn"?! */
.active {
  color: crimson;
}
`,
        'index.html': TRANG('Khoá học', `    <nav id="menu" class="menu">
      <a href="/">Trang chủ</a>
      <a href="/khoa-hoc" class="active">Khoá học</a>
      <a href="/blog">Blog</a>
      <a href="/lien-he">Liên hệ</a>
    </nav>`),
      },
      loiGiai: {
        'styles.css': `
/* hạ từ #menu a (1,0,1) xuống .menu a (0,1,1) — class thay id */
.menu a {
  color: gray;
  text-decoration: none;
}

/* .menu .active = (0,2,0) > (0,1,1) ⇒ thắng mà không cần !important */
.menu .active {
  color: crimson;
}
`,
        'index.html': TRANG('Khoá học', `    <nav id="menu" class="menu">
      <a href="/">Trang chủ</a>
      <a href="/khoa-hoc" class="active">Khoá học</a>
      <a href="/blog">Blog</a>
      <a href="/lien-he">Liên hệ</a>
    </nav>`),
      },
      giaiThich: `<p>Độ đặc hiệu so theo cột, từ trái sang: (id, class, thẻ). Cột id thắng là thắng, không cần nhìn tiếp — nên ${c('#menu a')} (1,0,1) đè ${c('.active')} (0,1,0) dù ${c('.active')} viết sau. Thứ tự nguồn chỉ là trọng tài khi <em>hoà</em>.</p>
<p>Cách sửa đúng tinh thần bài 3.1 là đưa mọi thứ về cùng "hạng cân" class rồi để cấu trúc bộ chọn quyết định. Bẫy tinh tế: chỉ đổi sang ${c('.menu a')} (0,1,1) thì ${c('.active')} (0,1,0) <em>vẫn thua</em> vì thua ở cột thẻ — phải viết ${c('.menu .active')}. Máy chấm kiểm màu computed của từng liên kết, và cấm ${c('!important')} lẫn bộ chọn id.</p>`,
      loiHayGap: [
        `Thêm ${c('!important')} vào .active — chạy ngay, và từ đó mỗi lần đổi màu active phải có thêm một !important nữa.`,
        `Viết ${c('#menu .active')} — thắng, nhưng leo thang id: luật sau muốn đè lại phải có id.`,
        `Chỉ đổi ${c('#menu a')} → ${c('.menu a')} rồi tưởng xong — .active vẫn xám vì (0,1,0) < (0,1,1).`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity',
      kiem: [
        { moTa: 'Liên kết .active màu crimson (rgb(220, 20, 60))', kiem: 'css', selector: 'a.active', thuocTinh: 'color', giaTri: 'rgb(220, 20, 60)' },
        { moTa: 'Các liên kết khác màu gray (rgb(128, 128, 128))', kiem: 'css', selector: '.menu a:not(.active)', thuocTinh: 'color', giaTri: 'rgb(128, 128, 128)' },
        { moTa: 'Không dùng !important', kiem: 'ma-nguon', tep: 'styles.css', khop: '!important', phuDinh: true },
        { moTa: 'Không có bộ chọn id trong styles.css', kiem: 'ma-nguon', tep: 'styles.css', khop: '#[A-Za-z_][\\w-]*[^;{}]*\\{', phuDinh: true },
        { moTa: 'Liên kết không gạch chân (giữ kiểu cũ)', kiem: 'css', selector: '.menu a', thuocTinh: 'text-decoration-line', khop: '^none$' },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Hai tệp CSS, một trận hoà: thứ tự thẻ <link> quyết định ai thắng',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['thứ tự nguồn', 'hoà độ đặc hiệu', 'nhiều bảng kiểu', 'theme đè base'],
      tienQuyet: ['độ đặc hiệu'],
      the: ['css', 'cascade', 'source-order'],
      moTa: `<p>Bài 3.1, bước 3: <em>"Cùng độ đặc hiệu thì thứ tự trong mã quyết định — đó là lý do thứ tự các thẻ ${c('<link>')} có ý nghĩa."</em> Site có ${c('base.css')} (kiểu chung) và ${c('theme.css')} (giao diện "Hoàng hôn" đè lên một số màu). Hai tệp dùng <em>đúng cùng bộ chọn</em>, nên luôn hoà. Nhưng giao diện mới không hiện ra. Tìm nguyên nhân và sửa chỉ bằng HTML.</p>`,
      yeuCau: [
        `${c('theme.css')} phải thắng ${c('base.css')} ở mọi thuộc tính hai tệp cùng khai báo.`,
        `Kết quả: ${c('body')} nền ${c('#fff7ed')}, ${c('h1')} màu ${c('#c2410c')}, ${c('.nut')} nền ${c('#ea580c')}.`,
        `Thuộc tính chỉ base.css có (vd ${c('.nut')} padding 8px 16px) vẫn còn.`,
        `Không sửa base.css hay theme.css — chỉ sửa index.html.`,
      ],
      dauVao: 'index.html nối theme.css TRƯỚC base.css.',
      dauRa: 'Trang mang màu cam "Hoàng hôn"; nút vẫn giữ padding từ base.',
      rangBuoc: [
        'Không thêm !important, không đổi bộ chọn.',
        'Không gộp hai tệp.',
      ],
      viDu: [{
        input: '<link rel="stylesheet" href="theme.css">\n<link rel="stylesheet" href="base.css">',
        output: 'h1 màu của base.css — theme bị đè.',
        explanation: 'Hai tệp ghép lại thành một dòng chảy: tệp nối sau đứng sau. Cùng bộ chọn h1 ⇒ hoà ⇒ luật đứng sau (base) thắng.',
      }],
      goiY: [
        'Hai luật có cùng bộ chọn thì độ đặc hiệu bằng nhau. Câu hỏi duy nhất còn lại: luật nào đứng sau trong "dòng chảy" CSS?',
        'Đổi chỗ hai thẻ <link>: base.css trước (nền móng), theme.css sau (lớp phủ).',
      ],
      khoiDau: {
        'base.css': `
/* base.css — KHÔNG sửa tệp này */
body { background: #ffffff; font-family: sans-serif; }
h1   { color: #111827; }
.nut { background: #2563eb; color: #ffffff; padding: 8px 16px; border: 0; }
`,
        'theme.css': `
/* theme.css — giao diện "Hoàng hôn" — KHÔNG sửa tệp này */
body { background: #fff7ed; }
h1   { color: #c2410c; }
.nut { background: #ea580c; }
`,
        'index.html': TRANG('Hoàng hôn', `    <h1>Giao diện Hoàng hôn</h1>
    <button type="button" class="nut">Thử ngay</button>`, `    <link rel="stylesheet" href="theme.css">
    <link rel="stylesheet" href="base.css">`),
      },
      loiGiai: {
        'base.css': `
/* base.css — KHÔNG sửa tệp này */
body { background: #ffffff; font-family: sans-serif; }
h1   { color: #111827; }
.nut { background: #2563eb; color: #ffffff; padding: 8px 16px; border: 0; }
`,
        'theme.css': `
/* theme.css — giao diện "Hoàng hôn" — KHÔNG sửa tệp này */
body { background: #fff7ed; }
h1   { color: #c2410c; }
.nut { background: #ea580c; }
`,
        'index.html': TRANG('Hoàng hôn', `    <h1>Giao diện Hoàng hôn</h1>
    <button type="button" class="nut">Thử ngay</button>`, `    <!-- nền móng trước ... -->
    <link rel="stylesheet" href="base.css">
    <!-- ... lớp phủ sau: cùng bộ chọn ⇒ hoà độ đặc hiệu ⇒ luật đứng sau thắng -->
    <link rel="stylesheet" href="theme.css">`),
      },
      giaiThich: `<p>Trình duyệt coi mọi bảng kiểu của trang như một dòng chảy nối đuôi theo thứ tự xuất hiện. ${c('h1')} trong base.css và ${c('h1')} trong theme.css có cùng độ đặc hiệu (0,0,1) ⇒ hoà ⇒ cái đứng sau thắng. Chỉ những thuộc tính <em>cùng được khai báo</em> mới tranh nhau: padding của ${c('.nut')} chỉ base.css có nên vẫn áp.</p>
<p>Đây là mô hình của mọi hệ thống giao diện: base/reset trước, component sau, theme/override cuối cùng. Máy chấm kiểm màu computed của ba phần tử, padding còn nguyên, và thứ tự hai thẻ link trong head.</p>`,
      loiHayGap: [
        `Thêm ${c('!important')} vào theme.css — chạy, nhưng đề cấm sửa tệp, và đó là chữa sai chỗ.`,
        `Xoá link base.css — theme thắng, nhưng nút mất padding, chữ trắng, phông chữ.`,
        `Đổi thành ${c('body h1')} trong theme "cho mạnh hơn" — leo thang đặc hiệu thay vì dùng đúng thứ tự.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#source_order',
      kiem: [
        { moTa: 'base.css được nối trước theme.css', kiem: 'thu-tu', cacSelector: ['link[href="base.css"]', 'link[href="theme.css"]'] },
        { moTa: 'body nền #fff7ed', kiem: 'css', selector: 'body', thuocTinh: 'background-color', giaTri: 'rgb(255, 247, 237)' },
        { moTa: 'h1 màu #c2410c', kiem: 'css', selector: 'h1', thuocTinh: 'color', giaTri: 'rgb(194, 65, 12)' },
        { moTa: '.nut nền #ea580c', kiem: 'css', selector: '.nut', thuocTinh: 'background-color', giaTri: 'rgb(234, 88, 12)' },
        { moTa: '.nut vẫn có padding 8px 16px từ base.css', kiem: 'css', selector: '.nut', thuocTinh: 'padding-left', giaTri: '16px' },
        { moTa: 'Không thêm !important', kiem: 'ma-nguon', khop: '!important', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Gỡ năm cái !important mà trang vẫn y nguyên',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['!important', 'cân bằng độ đặc hiệu', 'thứ tự nguồn', 'tái cấu trúc CSS'],
      tienQuyet: ['độ đặc hiệu', 'thứ tự nguồn'],
      the: ['css', 'cascade', 'refactor', 'important'],
      moTa: `<p>Bẫy cuối bài 3.1: <em>"Hai tháng sau, một bảng kiểu có mười lăm cái như thế, và đổi một màu bất kỳ đòi phải thêm cái thứ mười sáu."</em> Bảng kiểu thẻ sản phẩm dưới đây đang ở tháng thứ hai: năm cái ${c('!important')} chồng nhau. Nhiệm vụ: gỡ cả năm mà <strong>giá trị computed của mọi phần tử giữ nguyên</strong> — tức là một cuộc tái cấu trúc (refactor), không phải đổi giao diện.</p>
${code(`
Giao diện phải giữ nguyên:
.the            nền #ffffff, viền 1px solid #e5e7eb
.the h3         màu #111827
.gia            màu #16a34a, đậm
.the.het-hang   nền #f3f4f6
.het-hang .gia  màu #9ca3af (giá xám khi hết hàng), gạch ngang
`)}`,
      yeuCau: [
        `Không còn ${c('!important')} nào.`,
        `Năm dòng giao diện ở trên giữ đúng giá trị (máy chấm đo từng cái).`,
        `Không dùng bộ chọn id.`,
        `Không sửa index.html.`,
      ],
      dauVao: 'styles.css với 5 !important và vài bộ chọn id/thẻ lộn xộn.',
      dauRa: 'Cùng giao diện, bảng kiểu chỉ dùng class + thứ tự nguồn.',
      rangBuoc: [
        'Tối đa 2 class trong một bộ chọn.',
        'Không !important, không #id.',
      ],
      viDu: [{
        input: '.gia { color: #16a34a !important; }\n.het-hang .gia { color: #9ca3af !important; }',
        output: 'Hai !important đánh nhau ⇒ lại quay về so độ đặc hiệu (0,2,0) > (0,1,0) ⇒ xám thắng.',
        explanation: 'Khi cả hai cùng !important, !important vô tác dụng — chỉ thêm rác. Bỏ cả hai, kết quả y hệt.',
      }],
      goiY: [
        'Viết lại bảng kiểu theo thứ tự "chung trước, riêng sau": .the → .the h3 → .gia → .het-hang → .het-hang .gia. Rồi kiểm: luật riêng có độ đặc hiệu ≥ luật chung và đứng sau không?',
        'Thay #kho … bằng class sẵn có trong HTML (.kho), và để .the.het-hang (0,2,0) đè .the (0,1,0) cho màu nền.',
      ],
      khoiDau: {
        'styles.css': `
#kho .the {
  background: #ffffff;
  border: 1px solid #e5e7eb;
}
.het-hang {
  background: #f3f4f6 !important;
}
.the h3 {
  color: #111827 !important;
}
h3 {
  color: #374151;
}
.gia {
  color: #16a34a !important;
  font-weight: bold !important;
}
.het-hang .gia {
  color: #9ca3af !important;
  text-decoration: line-through;
}
`,
        'index.html': TRANG('Cửa hàng', `    <section id="kho" class="kho">
      <div class="the">
        <h3>Bàn phím cơ</h3>
        <p class="gia">890.000đ</p>
      </div>
      <div class="the het-hang">
        <h3>Chuột không dây</h3>
        <p class="gia">350.000đ</p>
      </div>
    </section>`),
      },
      loiGiai: {
        'styles.css': `
/* Chung trước, riêng sau — mọi luật đều là class, không !important */

/* (0,1,0) thẻ sản phẩm thường */
.the {
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

/* (0,1,1) tiêu đề trong thẻ — không còn luật h3 trần nào tranh */
.the h3 {
  color: #111827;
}

/* (0,1,0) giá */
.gia {
  color: #16a34a;
  font-weight: bold;
}

/* (0,2,0) thẻ hết hàng: hai class thắng .the (0,1,0) */
.the.het-hang {
  background: #f3f4f6;
}

/* (0,2,0) giá trong thẻ hết hàng: thắng .gia (0,1,0) */
.het-hang .gia {
  color: #9ca3af;
  text-decoration: line-through;
}
`,
        'index.html': TRANG('Cửa hàng', `    <section id="kho" class="kho">
      <div class="the">
        <h3>Bàn phím cơ</h3>
        <p class="gia">890.000đ</p>
      </div>
      <div class="the het-hang">
        <h3>Chuột không dây</h3>
        <p class="gia">350.000đ</p>
      </div>
    </section>`),
      },
      giaiThich: `<p>Mỗi ${c('!important')} trong tệp gốc đang "chữa" một trận thua đặc hiệu: ${c('.het-hang')} (0,1,0) thua ${c('#kho .the')} (1,1,0) nên phải !important; ${c('.the h3')} thì chẳng cần (nó đã thắng ${c('h3')}); hai cái ở ${c('.gia')} và ${c('.het-hang .gia')} triệt tiêu nhau. Gỡ id đi là gỡ được nguyên nhân gốc, và bốn cái còn lại hoá ra thừa.</p>
<p>Bảng kiểu mới đọc từ trên xuống như một câu chuyện: thẻ thường, tiêu đề, giá, rồi các trạng thái đặc biệt — mỗi trạng thái có độ đặc hiệu cao hơn đúng một bậc và đứng sau. Máy chấm đo năm giá trị trên cả thẻ thường lẫn thẻ hết hàng.</p>`,
      loiHayGap: [
        `Xoá hết !important mà giữ ${c('#kho .the')} — thẻ hết hàng mất nền xám (bị id đè).`,
        `Giữ quy tắc ${c('h3 { color: #374151 }')} và đặt nó cuối tệp — vẫn thua ${c('.the h3')} nên vô hại, nhưng là mã chết; xoá đi.`,
        `Viết ${c('.kho .the.het-hang .gia')} "cho chắc" — bộ chọn dài vô cớ là leo thang kiểu mới.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/important',
      kiem: [
        { moTa: 'Không còn !important', kiem: 'ma-nguon', tep: 'styles.css', khop: '!important', phuDinh: true },
        { moTa: 'Không có bộ chọn id', kiem: 'ma-nguon', tep: 'styles.css', khop: '#[A-Za-z_][\\w-]*[^;{}]*\\{', phuDinh: true },
        { moTa: 'Thẻ thường nền trắng', kiem: 'css', selector: '.the:not(.het-hang)', thuocTinh: 'background-color', giaTri: 'rgb(255, 255, 255)' },
        { moTa: 'Mọi thẻ viền 1px #e5e7eb', kiem: 'css', selector: '.the', thuocTinh: 'border-top-color', giaTri: 'rgb(229, 231, 235)' },
        { moTa: 'Tiêu đề thẻ màu #111827', kiem: 'css', selector: '.the h3', thuocTinh: 'color', giaTri: 'rgb(17, 24, 39)' },
        { moTa: 'Giá thường màu #16a34a, đậm', kiem: 'css', selector: '.the:not(.het-hang) .gia', thuocTinh: 'color', giaTri: 'rgb(22, 163, 74)' },
        { moTa: 'Giá đậm ở mọi thẻ', kiem: 'css', selector: '.gia', thuocTinh: 'font-weight', khop: '^(bold|700)$' },
        { moTa: 'Thẻ hết hàng nền #f3f4f6', kiem: 'css', selector: '.the.het-hang', thuocTinh: 'background-color', giaTri: 'rgb(243, 244, 246)' },
        { moTa: 'Giá hết hàng màu #9ca3af', kiem: 'css', selector: '.het-hang .gia', thuocTinh: 'color', giaTri: 'rgb(156, 163, 175)' },
        { moTa: 'Giá hết hàng gạch ngang', kiem: 'css', selector: '.het-hang .gia', thuocTinh: 'text-decoration-line', giaTri: 'line-through' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Cuộc chiến xếp tầng: dự đoán người thắng rồi đưa sáu phần tử về đúng màu',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['tính độ đặc hiệu (id, class, thẻ)', 'thứ tự nguồn', 'bộ chọn kết hợp', 'kế thừa màu chữ', 'chỉ thêm, không xoá'],
      tienQuyet: ['các bài 1–6 của bộ này'],
      the: ['css', 'cascade', 'specificity', 'puzzle'],
      moTa: `<p>Bảng kiểu ${c('khoa.css')} là CSS của bên thứ ba — bạn <strong>không được sửa</strong> nó (đúng trường hợp bài 3.1 nói là duy nhất có lý do để đụng tới !important — nhưng ở đây bạn sẽ làm được mà không cần). Bạn chỉ được viết thêm vào ${c('styles.css')}, nối sau ${c('khoa.css')}. Sáu phần tử phải ra đúng màu trong bảng. Muốn ít mã nhất, bạn phải tính được trước luật nào đang thắng ở từng phần tử và luật mới cần "nặng" tới đâu.</p>
${code(`
khoa.css (KHÔNG sửa):
  #trang .noi-dung p      { color: #6b7280; }   /* (1,1,1) */
  .noi-dung .ghi-chu      { color: #2563eb; }   /* (0,2,0) */
  p.canh-bao              { color: #d97706; }   /* (0,1,1) */
  nav a                   { color: #111827; }   /* (0,0,2) */
  .the h2                 { color: #7c3aed; }   /* (0,1,1) */

Phải ra (computed color):
  (1) .noi-dung p.thuong     → #374151
  (2) .noi-dung p.ghi-chu    → #059669
  (3) .noi-dung p.canh-bao   → #dc2626
  (4) nav a                  → #0f766e
  (5) nav a.dang-xem         → #be123c
  (6) .the h2                → #1d4ed8
`)}`,
      yeuCau: [
        `Sáu phần tử ra đúng sáu màu trong bảng.`,
        `Chỉ sửa ${c('styles.css')}; ${c('khoa.css')} và ${c('index.html')} giữ nguyên.`,
        `Không ${c('!important')}, không style nội dòng. Được dùng bộ chọn id — nhưng chỉ ở đúng chỗ thật sự cần (hãy tính xem đó là những phần tử nào).`,
        `Mỗi quy tắc bạn viết có chú thích độ đặc hiệu (vd ${c('/* (1,2,1) */')}).`,
      ],
      dauVao: 'khoa.css (5 luật, cố định), styles.css trống, index.html có sẵn id="trang".',
      dauRa: 'Sáu phần tử đúng màu; styles.css ngắn, mỗi luật vừa đủ nặng để thắng.',
      rangBuoc: [
        'Không sửa khoa.css, index.html.',
        'Không !important.',
        'Tối đa 6 quy tắc trong styles.css.',
      ],
      viDu: [{
        input: '/* muốn (2) ghi-chu → #059669 */\n.noi-dung .ghi-chu { color: #059669; }   /* (0,2,0) */',
        output: 'Vẫn XÁM #6b7280.',
        explanation: 'p.ghi-chu cũng khớp #trang .noi-dung p (1,1,1) — có id nên thắng (0,2,0) dù đứng sau. Muốn thắng phải có id: #trang .noi-dung .ghi-chu (1,2,0).',
      }],
      goiY: [
        'Với mỗi phần tử, liệt kê MỌI luật của khoa.css khớp nó (một phần tử có thể khớp nhiều luật) và tìm luật mạnh nhất. Ba đoạn trong .noi-dung đều bị #trang .noi-dung p (1,1,1) phủ ⇒ luật mới cho chúng phải có id. nav a và .the h2 thì không dính id.',
        'Đáp số độ nặng: (1) #trang .noi-dung p (1,1,1) — hoà, đứng sau thắng; (2) #trang .noi-dung .ghi-chu (1,2,0); (3) #trang .noi-dung .canh-bao (1,2,0); (4) nav a (0,0,2) — hoà, đứng sau thắng; (5) nav .dang-xem (0,1,1); (6) .the h2 (0,1,1) — hoà.',
      ],
      khoiDau: {
        'khoa.css': `
/* khoa.css — CSS của bên thứ ba. KHÔNG SỬA. */
#trang .noi-dung p { color: #6b7280; }
.noi-dung .ghi-chu { color: #2563eb; }
p.canh-bao         { color: #d97706; }
nav a              { color: #111827; }
.the h2            { color: #7c3aed; }
`,
        'styles.css': `
/* Viết thêm ở đây (nối SAU khoa.css). Mỗi luật ghi độ đặc hiệu. */
`,
        'index.html': TRANG('Cuộc chiến xếp tầng', `    <div id="trang">
      <nav>
        <a href="/">Trang chủ</a>
        <a href="/khoa" class="dang-xem">Khoá học</a>
      </nav>
      <div class="noi-dung">
        <p class="thuong">Đoạn văn thường.</p>
        <p class="ghi-chu">Ghi chú của giảng viên.</p>
        <p class="canh-bao">Cảnh báo: hạn nộp bài tối nay.</p>
      </div>
      <div class="the">
        <h2>Thẻ khoá học</h2>
      </div>
    </div>`, `    <link rel="stylesheet" href="khoa.css">
    <link rel="stylesheet" href="styles.css">`),
      },
      loiGiai: {
        'khoa.css': `
/* khoa.css — CSS của bên thứ ba. KHÔNG SỬA. */
#trang .noi-dung p { color: #6b7280; }
.noi-dung .ghi-chu { color: #2563eb; }
p.canh-bao         { color: #d97706; }
nav a              { color: #111827; }
.the h2            { color: #7c3aed; }
`,
        'styles.css': `
/* styles.css nối SAU khoa.css ⇒ khi HOÀ độ đặc hiệu, luật ở đây thắng */

/* (1) mọi p trong .noi-dung bị #trang .noi-dung p (1,1,1) phủ.
       Viết đúng bộ chọn đó (1,1,1): hoà ⇒ đứng sau thắng */
#trang .noi-dung p { color: #374151; }

/* (2) ghi-chu: luật mạnh nhất đang khớp là (1,1,1) ⇒ cần ≥ (1,1,1) mà vẫn riêng cho ghi-chu:
       (1,2,0) > (1,1,1) và > luật (1) ở trên */
#trang .noi-dung .ghi-chu { color: #059669; }

/* (3) canh-bao: tương tự (1,2,0) */
#trang .noi-dung .canh-bao { color: #dc2626; }

/* (4) nav a (0,0,2) — hoà với khoa.css, đứng sau ⇒ thắng */
nav a { color: #0f766e; }

/* (5) liên kết đang xem: (0,1,1) > (0,0,2) — không cần id */
nav .dang-xem { color: #be123c; }

/* (6) .the h2 (0,1,1) — hoà, đứng sau ⇒ thắng */
.the h2 { color: #1d4ed8; }
`,
        'index.html': TRANG('Cuộc chiến xếp tầng', `    <div id="trang">
      <nav>
        <a href="/">Trang chủ</a>
        <a href="/khoa" class="dang-xem">Khoá học</a>
      </nav>
      <div class="noi-dung">
        <p class="thuong">Đoạn văn thường.</p>
        <p class="ghi-chu">Ghi chú của giảng viên.</p>
        <p class="canh-bao">Cảnh báo: hạn nộp bài tối nay.</p>
      </div>
      <div class="the">
        <h2>Thẻ khoá học</h2>
      </div>
    </div>`, `    <link rel="stylesheet" href="khoa.css">
    <link rel="stylesheet" href="styles.css">`),
      },
      giaiThich: `<p>Chìa khoá là thấy rằng <em>một phần tử khớp nhiều luật</em>: đoạn ghi-chú khớp cả ${c('#trang .noi-dung p')} (1,1,1) lẫn ${c('.noi-dung .ghi-chu')} (0,2,0) — và luật có id thắng, nên trong khoa.css nó vốn đã xám chứ không xanh. Mọi luật mới cho ba đoạn văn vì thế phải "mang" một id; còn nav và thẻ không nằm dưới luật id nào nên chỉ cần hoà và đứng sau.</p>
<p>Đây chính là bài học "đọc DevTools thay vì đoán" của bài 3.1, làm bằng tay: liệt kê luật khớp → tính điểm → chọn luật nhẹ nhất đủ thắng. Máy chấm đo sáu màu computed và cấm !important; bộ chọn id được phép vì CSS bên thứ ba đã dùng id — bạn chỉ "đấu cùng hạng cân", không leo thang thêm.</p>`,
      loiHayGap: [
        `Viết ${c('.ghi-chu { color: #059669; }')} rồi thắc mắc vì sao vẫn xám — quên rằng đoạn đó cũng khớp luật có id.`,
        `Gắn id cho cả nav và thẻ "cho đồng bộ" — leo thang không cần thiết, sau này đè lại sẽ khổ.`,
        `Đặt luật (1) ${c('#trang .noi-dung p')} SAU luật (2) — (1,2,0) vẫn thắng (1,1,1) nên không sao; nhưng nếu bạn viết (2) bằng (1,1,1) như ${c('#trang .noi-dung p.ghi-chu')}… thật ra đó là (1,2,1). Hãy luôn tính điểm, đừng đoán.`,
      ],
      thamKhao: 'https://specificity.keegan.st/',
      kiem: [
        { moTa: '(1) p.thuong → #374151', kiem: 'css', selector: '.noi-dung p.thuong', thuocTinh: 'color', giaTri: 'rgb(55, 65, 81)' },
        { moTa: '(2) p.ghi-chu → #059669', kiem: 'css', selector: '.noi-dung p.ghi-chu', thuocTinh: 'color', giaTri: 'rgb(5, 150, 105)' },
        { moTa: '(3) p.canh-bao → #dc2626', kiem: 'css', selector: '.noi-dung p.canh-bao', thuocTinh: 'color', giaTri: 'rgb(220, 38, 38)' },
        { moTa: '(4) nav a thường → #0f766e', kiem: 'css', selector: 'nav a:not(.dang-xem)', thuocTinh: 'color', giaTri: 'rgb(15, 118, 110)' },
        { moTa: '(5) nav a.dang-xem → #be123c', kiem: 'css', selector: 'nav a.dang-xem', thuocTinh: 'color', giaTri: 'rgb(190, 18, 60)' },
        { moTa: '(6) .the h2 → #1d4ed8', kiem: 'css', selector: '.the h2', thuocTinh: 'color', giaTri: 'rgb(29, 78, 216)' },
        { moTa: 'Không dùng !important', kiem: 'ma-nguon', khop: '!important', phuDinh: true },
        { moTa: 'Không style nội dòng', kiem: 'khong-ton-tai', selector: '[style]' },
        { moTa: 'khoa.css nối trước styles.css', kiem: 'thu-tu', cacSelector: ['link[href="khoa.css"]', 'link[href="styles.css"]'] },
        { moTa: 'nav và thẻ không cần id (không có #trang nav/#trang .the)', kiem: 'ma-nguon', tep: 'styles.css', khop: '#trang\\s+(nav|\\.the)', phuDinh: true },
      ],
    },
  ],
};
