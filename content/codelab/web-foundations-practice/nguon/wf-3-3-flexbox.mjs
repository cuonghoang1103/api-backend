/** Bộ luyện bài 3.3 — Flexbox. Lược đồ: ./_luoc-do.mjs */
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

export default {
  slug: 'wf-3-3-flexbox',
  ten: '3.3 Flexbox: xếp mọi thứ theo hàng hoặc cột',
  baiHoc: 'Nền tảng Web — Bài 3.3 Flexbox: xếp mọi thứ theo hàng hoặc cột',
  ngonNgu: 'css',
  level: 'BEGINNER',
  moTa: 'display: flex, gap, trục chính/trục phụ, justify-content, align-items, flex-direction, flex-wrap, flex: 1, căn giữa hoàn hảo, bẫy đổi trục — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Căn giữa hoàn hảo một khối theo cả hai chiều',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['display: flex', 'justify-content: center', 'align-items: center', 'min-height: 100vh'],
      tienQuyet: ['box model'],
      the: ['css', 'flexbox', 'centering'],
      moTa: `<p>Bài 3.3: <em>"Hai dòng căn giữa một phần tử con theo cả hai chiều — thứ trước kia phải dùng những chiêu xấu xí."</em> Màn chào của trang đăng nhập cần thẻ ${c('.hop-dang-nhap')} nằm <strong>chính giữa màn hình</strong>. Người viết trước dùng ${c('margin-top: 300px')} và ${c('margin-left: 40%')} — chỉ đúng trên đúng một màn hình. Thay bằng cú căn giữa của flexbox, đặt trên phần tử <em>cha</em> ${c('.hero')}.</p>`,
      yeuCau: [
        `${c('.hero')} là flex container: ${c('display: flex')}.`,
        `Căn giữa ngang (trục chính): ${c('justify-content: center')}.`,
        `Căn giữa dọc (trục phụ): ${c('align-items: center')}.`,
        `${c('.hero')} cao tối thiểu bằng màn hình: ${c('min-height: 100vh')}.`,
        `Xoá hai margin "đoán mò" trên ${c('.hop-dang-nhap')}.`,
      ],
      dauVao: '.hop-dang-nhap { margin-top: 300px; margin-left: 40%; … }',
      dauRa: 'Thẻ đăng nhập nằm chính giữa màn hình ở mọi kích thước cửa sổ.',
      rangBuoc: [
        'Thuộc tính căn chỉnh đặt trên CHA (.hero), không trên con.',
        'Không dùng position/transform (chưa học).',
      ],
      viDu: [{
        input: '.hero {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}',
        output: '┌─────────────────────────┐\n│                         │\n│       ┌─────────┐       │\n│       │ Đăng nhập│       │\n│       └─────────┘       │\n│                         │\n└─────────────────────────┘',
        explanation: 'justify-content lo chiều ngang (trục chính của hàng), align-items lo chiều dọc (trục phụ). min-height cho cha đủ cao để "giữa" có nghĩa.',
      }],
      goiY: [
        'Flexbox căn các CON của một vật chứa. Ai là vật chứa ở đây? .hero.',
        '.hero { display: flex; justify-content: center; align-items: center; min-height: 100vh; } — và xoá margin-top/margin-left của thẻ.',
      ],
      khoiDau: {
        'styles.css': `${BB}
body { margin: 0; }

.hero {
  background: #f1f5f9;
}

.hop-dang-nhap {
  margin-top: 300px;   /* đoán mò */
  margin-left: 40%;    /* đoán mò */
  width: 320px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
}
`,
        'index.html': TRANG('Đăng nhập', `    <div class="hero">
      <div class="hop-dang-nhap">
        <h1>Đăng nhập</h1>
        <p>Chào mừng bạn quay lại.</p>
      </div>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
body { margin: 0; }

/* Vật chứa: các thuộc tính căn chỉnh đặt trên CHA */
.hero {
  display: flex;            /* các con trực tiếp thành flex item */
  justify-content: center;  /* giữa theo trục chính (ngang, vì mặc định là row) */
  align-items: center;      /* giữa theo trục phụ (dọc) */
  min-height: 100vh;        /* cao ít nhất bằng màn hình — "giữa" mới có chỗ */
  background: #f1f5f9;
}

/* Con: không còn margin đoán mò */
.hop-dang-nhap {
  width: 320px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
}
`,
        'index.html': TRANG('Đăng nhập', `    <div class="hero">
      <div class="hop-dang-nhap">
        <h1>Đăng nhập</h1>
        <p>Chào mừng bạn quay lại.</p>
      </div>
    </div>`),
      },
      giaiThich: `<p>Margin "đoán mò" phụ thuộc kích thước màn hình: 300px từ trên là giữa với màn cao 700px, lệch hẳn với màn 1080px. Flexbox căn theo <em>không gian thật</em> của vật chứa nên luôn đúng. Hai thuộc tính ứng với hai trục: ${c('justify-content')} cho trục chính, ${c('align-items')} cho trục phụ.</p>
<p>${c('min-height: 100vh')} là mảnh hay quên: không có nó, ${c('.hero')} chỉ cao bằng nội dung, nên "giữa theo chiều dọc" chẳng có chỗ để giữa. Máy chấm đọc các giá trị computed của ${c('.hero')} và kiểm thẻ không còn margin đoán mò (iframe chấm cao 768px nên 100vh tính ra 768px).</p>`,
      loiHayGap: [
        `Đặt ${c('justify-content: center')} lên chính ${c('.hop-dang-nhap')} — thuộc tính căn chỉnh tác động lên CON của vật chứa flex.`,
        `Quên ${c('min-height')} — căn ngang chạy, căn dọc "không ăn".`,
        `Dùng ${c('height: 100vh')} — chạy được, nhưng nội dung dài hơn màn hình sẽ tràn; min-height cho phép nở ra.`,
      ],
      thamKhao: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
      kiem: [
        { moTa: '.hero là flex container', kiem: 'css', selector: '.hero', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: 'Căn giữa trục chính', kiem: 'css', selector: '.hero', thuocTinh: 'justify-content', giaTri: 'center' },
        { moTa: 'Căn giữa trục phụ', kiem: 'css', selector: '.hero', thuocTinh: 'align-items', giaTri: 'center' },
        { moTa: '.hero cao tối thiểu 100vh', kiem: 'css', selector: '.hero', thuocTinh: 'min-height', khop: '^(100vh|768px)$' },
        { moTa: 'Thẻ không còn margin-top đoán mò', kiem: 'css', selector: '.hop-dang-nhap', thuocTinh: 'margin-top', khop: '^0(px)?$' },
        { moTa: 'Thẻ không còn margin-left đoán mò', kiem: 'ma-nguon', tep: 'styles.css', khop: 'margin-left\\s*:\\s*40%', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Hàng nút bấm: display: flex và gap thay cho margin vá víu',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['flex container / flex item', 'gap', 'con trực tiếp'],
      tienQuyet: ['box model'],
      the: ['css', 'flexbox', 'gap'],
      moTa: `<p>Bài 3.3 mở đầu bằng đúng hai dòng: ${c('display: flex')} (các con nằm thành một hàng) và ${c('gap: 16px')} (khoảng cách đều giữa chúng). Hàng nút "Lưu / Huỷ / Xoá" đang xếp chồng dọc, và người viết trước định cho chúng cách nhau bằng ${c('margin-right')} — nút cuối thừa margin, chỗ thì 10px chỗ thì 12px. Làm lại bằng flex + gap.</p>`,
      yeuCau: [
        `${c('.hang-nut')} là flex container.`,
        `Khoảng cách giữa các nút đúng ${c('12px')} bằng ${c('gap')}.`,
        `Xoá mọi ${c('margin-right')} trên các nút.`,
        `Không sửa HTML.`,
      ],
      dauVao: 'Ba nút display:block chồng dọc, margin-right lộn xộn.',
      dauRa: '[ Lưu ] [ Huỷ ] [ Xoá ] — một hàng, cách nhau đều 12px, không thừa khoảng sau nút cuối.',
      rangBuoc: [
        'Không dùng margin để tạo khoảng giữa các nút.',
      ],
      viDu: [{
        input: '.hang-nut { display: flex; gap: 12px; }',
        output: '[Lưu]␣12px␣[Huỷ]␣12px␣[Xoá]',
        explanation: 'gap chỉ đặt khoảng GIỮA các item — không có ở đầu hay cuối hàng, khác với margin.',
      }],
      goiY: [
        'display: flex đặt lên CHA của các nút. Các nút (con trực tiếp) tự nằm thành hàng, kể cả khi chúng đang display: block.',
        '.hang-nut { display: flex; gap: 12px; } rồi xoá các quy tắc margin-right.',
      ],
      khoiDau: {
        'styles.css': `${BB}
.hang-nut button {
  display: block;
  padding: 8px 16px;
}
.nut-luu { margin-right: 10px; }
.nut-huy { margin-right: 12px; }
.nut-xoa { margin-right: 12px; }
`,
        'index.html': TRANG('Hàng nút', `    <div class="hang-nut">
      <button type="button" class="nut-luu">Lưu</button>
      <button type="button" class="nut-huy">Huỷ</button>
      <button type="button" class="nut-xoa">Xoá</button>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* Vật chứa: con trực tiếp (3 button) nằm thành một hàng */
.hang-nut {
  display: flex;
  gap: 12px;            /* khoảng đều GIỮA các nút — không thừa ở cuối */
}

.hang-nut button {
  display: block;       /* không còn quan trọng: con của flex container đều là flex item */
  padding: 8px 16px;
}
/* không còn margin-right vá víu */
`,
        'index.html': TRANG('Hàng nút', `    <div class="hang-nut">
      <button type="button" class="nut-luu">Lưu</button>
      <button type="button" class="nut-huy">Huỷ</button>
      <button type="button" class="nut-xoa">Xoá</button>
    </div>`),
      },
      giaiThich: `<p>${c('display: flex')} đổi cách bố trí <em>các con trực tiếp</em>: chúng thành flex item và xếp theo trục chính (mặc định ngang), bất kể trước đó là block hay inline. ${c('gap')} là khoảng cách do vật chứa quản lý — một con số duy nhất, chỉ nằm giữa các item, không cần nhớ "nút cuối thì bỏ margin".</p>
<p>Máy chấm kiểm ${c('display')} và ${c('gap')} computed của vật chứa, và margin-right của mọi nút bằng 0.</p>`,
      loiHayGap: [
        `Đặt ${c('display: flex')} lên từng button — mỗi nút thành vật chứa của chữ bên trong nó, các nút vẫn chồng dọc.`,
        `Giữ margin-right và thêm gap — khoảng cách cộng dồn thành 22–24px.`,
        `Viết ${c('gap')} trên button — gap là thuộc tính của vật chứa.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/gap',
      kiem: [
        { moTa: '.hang-nut là flex container', kiem: 'css', selector: '.hang-nut', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: '.hang-nut có gap 12px', kiem: 'css', selector: '.hang-nut', thuocTinh: 'gap', khop: '^12px( 12px)?$' },
        { moTa: 'Không nút nào còn margin-right', kiem: 'css', selector: '.hang-nut button', thuocTinh: 'margin-right', khop: '^0(px)?$' },
        { moTa: 'Không còn quy tắc margin-right trong styles.css', kiem: 'ma-nguon', tep: 'styles.css', khop: 'margin-right', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Đổi trục: flex-direction: column cho menu dọc',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['flex-direction', 'trục chính dọc', 'gap theo cột'],
      tienQuyet: ['display: flex, gap'],
      the: ['css', 'flexbox', 'flex-direction'],
      moTa: `<p>Bài 3.3, quyết định số 2: <em>"Trục chính đi hướng nào? ${c('flex-direction: row')} (mặc định) hoặc ${c('column')}."</em> Thanh bên tài khoản cần các liên kết xếp <strong>dọc</strong>, cách nhau 8px. Vì ${c('<a>')} là phần tử dòng nên hiện tại chúng nằm cùng một dòng. Dùng flex với trục chính dọc.</p>`,
      yeuCau: [
        `${c('.menu-doc')} là flex container với ${c('flex-direction: column')}.`,
        `Khoảng cách giữa các liên kết là ${c('gap: 8px')}.`,
        `Không dùng ${c('<br>')} hay ${c('display: block')} + margin cho từng liên kết.`,
      ],
      dauVao: 'Bốn <a> nằm cùng một dòng trong nav.menu-doc.',
      dauRa: 'Bốn liên kết xếp dọc, cách nhau 8px.',
      rangBuoc: [
        'Không sửa HTML.',
      ],
      viDu: [{
        input: '.menu-doc { display: flex; flex-direction: column; gap: 8px; }',
        output: 'Hồ sơ\n(8px)\nĐơn hàng\n(8px)\nCài đặt\n(8px)\nĐăng xuất',
        explanation: 'Trục chính giờ là trên→dưới; gap áp dọc theo trục đó.',
      }],
      goiY: [
        'Chỉ một thuộc tính khác với hàng nút ở bài trước: hướng của trục chính.',
        '.menu-doc { display: flex; flex-direction: column; gap: 8px; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
.menu-doc {
  width: 200px;
  padding: 16px;
  background: #f8fafc;
}
`,
        'index.html': TRANG('Tài khoản', `    <nav class="menu-doc">
      <a href="/ho-so">Hồ sơ</a>
      <a href="/don-hang">Đơn hàng</a>
      <a href="/cai-dat">Cài đặt</a>
      <a href="/dang-xuat">Đăng xuất</a>
    </nav>`),
      },
      loiGiai: {
        'styles.css': `${BB}
.menu-doc {
  display: flex;
  flex-direction: column;   /* trục chính: trên → dưới */
  gap: 8px;                 /* khoảng giữa các mục, theo trục chính (dọc) */
  width: 200px;
  padding: 16px;
  background: #f8fafc;
}
`,
        'index.html': TRANG('Tài khoản', `    <nav class="menu-doc">
      <a href="/ho-so">Hồ sơ</a>
      <a href="/don-hang">Đơn hàng</a>
      <a href="/cai-dat">Cài đặt</a>
      <a href="/dang-xuat">Đăng xuất</a>
    </nav>`),
      },
      giaiThich: `<p>Một thuộc tính đổi cả hệ trục: với ${c('column')}, trục chính đi từ trên xuống, nên các item chồng dọc và ${c('gap')} tạo khoảng dọc. Các ${c('<a>')} vốn là phần tử dòng nhưng khi là flex item chúng được xếp như khối — không cần ${c('display: block')} cho từng cái.</p>
<p>Ghi nhớ điều này cho bài 7 (khó): khi trục chính dọc, ${c('justify-content')} và ${c('align-items')} cũng đổi nghĩa.</p>`,
      loiHayGap: [
        `Viết ${c('flex-direction: vertical')} — không có giá trị đó; đúng là ${c('column')}.`,
        `Thêm ${c('display: block')} cho từng a rồi margin — chạy, nhưng là cách cũ, nhiều quy tắc hơn.`,
        `Quên ${c('display: flex')} — ${c('flex-direction')} một mình không có tác dụng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction',
      kiem: [
        { moTa: '.menu-doc là flex container', kiem: 'css', selector: '.menu-doc', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: 'Trục chính dọc (column)', kiem: 'css', selector: '.menu-doc', thuocTinh: 'flex-direction', giaTri: 'column' },
        { moTa: 'Khoảng cách gap 8px', kiem: 'css', selector: '.menu-doc', thuocTinh: 'gap', khop: '^8px( 8px)?$' },
        { moTa: 'Không dùng <br>', kiem: 'khong-ton-tai', selector: 'br' },
        { moTa: 'Không đặt margin riêng cho từng liên kết', kiem: 'css', selector: '.menu-doc a', thuocTinh: 'margin-bottom', khop: '^0(px)?$' },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Thanh điều hướng kinh điển: logo bên trái, menu bên phải, căn giữa dọc',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['justify-content: space-between', 'align-items: center', 'flex lồng flex', 'chỉ con trực tiếp'],
      tienQuyet: ['display: flex, gap'],
      the: ['css', 'flexbox', 'navbar'],
      moTa: `<p>Bài 3.3: <em>"${c('space-between')} là thanh điều hướng kinh điển: logo bên trái, các liên kết bên phải."</em> Thanh điều hướng có hai con trực tiếp: logo và ${c('<ul class="menu">')}. Menu lại có các ${c('<li>')} — con của <em>menu</em>, không phải của thanh. Bài học dặn: ${c('display: flex')} <em>"đổi cách các con TRỰC TIẾP được bố trí và chẳng làm gì với các cháu"</em> — nên bạn cần flex ở hai tầng.</p>`,
      yeuCau: [
        `${c('.navbar')}: flex, logo trái — menu phải (${c('space-between')}), căn giữa dọc (${c('align-items: center')}).`,
        `${c('.menu')}: flex, các mục cách nhau ${c('24px')}.`,
        `${c('.menu')} bỏ chấm đầu dòng và lề mặc định: ${c('list-style: none')}, ${c('margin: 0')}, ${c('padding: 0')}.`,
        `${c('.navbar')} có ${c('padding: 12px 24px')}.`,
      ],
      dauVao: 'header.navbar > a.logo + ul.menu > li × 4; styles.css chỉ có màu.',
      dauRa: '[CuongThai]                         Khoá học   Blog   Code Lab   Đăng nhập',
      rangBuoc: [
        'Không dùng margin-left: auto hay float (dùng đúng thuộc tính của bài).',
        'Không sửa HTML.',
      ],
      viDu: [{
        input: '.navbar { display: flex; justify-content: space-between; }\n/* nhưng .menu chưa flex */',
        output: '[CuongThai]                                    • Khoá học\n                                               • Blog\n                                               • …',
        explanation: 'Thanh đã chia trái–phải, nhưng các li vẫn chồng dọc: chúng là CHÁU của .navbar, flex của thanh không chạm tới.',
      }],
      goiY: [
        'Hai vật chứa, hai tầng: .navbar sắp xếp (logo, menu); .menu sắp xếp các li.',
        '.navbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; } .menu { display: flex; gap: 24px; list-style: none; margin: 0; padding: 0; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
body { margin: 0; }

.navbar {
  background: #0f172a;
}
.navbar a {
  color: #f8fafc;
  text-decoration: none;
}
.logo {
  font-weight: bold;
  font-size: 20px;
}
`,
        'index.html': TRANG('CuongThai', `    <header class="navbar">
      <a href="/" class="logo">CuongThai</a>
      <ul class="menu">
        <li><a href="/courses">Khoá học</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/code-lab">Code Lab</a></li>
        <li><a href="/login">Đăng nhập</a></li>
      </ul>
    </header>`),
      },
      loiGiai: {
        'styles.css': `${BB}
body { margin: 0; }

/* Tầng 1: con trực tiếp là logo và ul.menu */
.navbar {
  display: flex;
  justify-content: space-between;  /* logo dạt trái, menu dạt phải (trục chính ngang) */
  align-items: center;             /* logo cao 20px và menu thẳng hàng giữa (trục phụ dọc) */
  padding: 12px 24px;
  background: #0f172a;
}
.navbar a {
  color: #f8fafc;
  text-decoration: none;
}
.logo {
  font-weight: bold;
  font-size: 20px;
}

/* Tầng 2: con trực tiếp là các li — flex của .navbar KHÔNG chạm tới chúng */
.menu {
  display: flex;
  gap: 24px;
  list-style: none;   /* bỏ chấm đầu dòng */
  margin: 0;          /* bỏ lề mặc định của ul */
  padding: 0;
}
`,
        'index.html': TRANG('CuongThai', `    <header class="navbar">
      <a href="/" class="logo">CuongThai</a>
      <ul class="menu">
        <li><a href="/courses">Khoá học</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/code-lab">Code Lab</a></li>
        <li><a href="/login">Đăng nhập</a></li>
      </ul>
    </header>`),
      },
      giaiThich: `<p>Thanh điều hướng là bài toán hai tầng. Tầng ngoài chỉ có hai item (logo, menu) — ${c('space-between')} đẩy chúng ra hai mép, ${c('align-items: center')} canh chúng thẳng hàng theo chiều dọc dù cỡ chữ khác nhau. Tầng trong là các ${c('li')}, cần flex riêng. Đây là "Flexbox bên trong từng thanh" mà bài 3.4 nhắc lại.</p>
<p>${c('<ul>')} có lề và padding mặc định (để chừa chỗ cho chấm đầu dòng) — bỏ chấm thì cũng bỏ luôn khoảng đó, nếu không menu lệch vào trong. Máy chấm kiểm cả hai vật chứa và các giá trị reset của ul.</p>`,
      loiHayGap: [
        `Chỉ flex ${c('.navbar')} rồi thắc mắc vì sao các li vẫn chồng dọc.`,
        `Dùng ${c('space-around')} — logo và menu cách mép một khoảng, không sát mép như thiết kế.`,
        `Quên ${c('align-items: center')} — mặc định ${c('stretch')} kéo item cao bằng thanh, chữ menu nằm lệch lên trên so với logo.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content',
      kiem: [
        { moTa: '.navbar flex', kiem: 'css', selector: '.navbar', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: '.navbar space-between', kiem: 'css', selector: '.navbar', thuocTinh: 'justify-content', giaTri: 'space-between' },
        { moTa: '.navbar căn giữa dọc', kiem: 'css', selector: '.navbar', thuocTinh: 'align-items', giaTri: 'center' },
        { moTa: '.navbar padding 12px 24px', kiem: 'css', selector: '.navbar', thuocTinh: 'padding-left', giaTri: '24px' },
        { moTa: '.menu cũng là flex (tầng 2)', kiem: 'css', selector: '.menu', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: '.menu gap 24px', kiem: 'css', selector: '.menu', thuocTinh: 'gap', khop: '^24px( 24px)?$' },
        { moTa: '.menu bỏ chấm đầu dòng', kiem: 'css', selector: '.menu', thuocTinh: 'list-style-type', khop: '^none$' },
        { moTa: '.menu bỏ padding mặc định', kiem: 'css', selector: '.menu', thuocTinh: 'padding-left', khop: '^0(px)?$' },
        { moTa: 'Không dùng margin-left: auto hay float', kiem: 'ma-nguon', tep: 'styles.css', khop: 'margin-left\\s*:\\s*auto|float\\s*:', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Thanh bên rộng cố định, nội dung lấp phần còn lại với flex: 1',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['flex: 1', 'nở ra chia không gian dư', 'chiều rộng cố định', 'flex-shrink'],
      tienQuyet: ['display: flex'],
      the: ['css', 'flexbox', 'flex-grow', 'layout'],
      moTa: `<p>Bài 3.3, mục "Nở ra và co lại":</p>
${code(`
.sidebar { width: 240px; }   /* cố định */
.content { flex: 1; }        /* lấy hết không gian còn lại */
`)}
<p>Trang quản trị cần bố cục đó. Người viết trước đặt ${c('.content { width: 1000px }')} — vừa trên màn của họ, tràn trên laptop nhỏ. Hãy làm cho nội dung <em>tự</em> lấp phần còn lại ở mọi bề rộng, thanh bên giữ đúng 240px.</p>`,
      yeuCau: [
        `${c('.bo-cuc')} là flex container, khoảng cách giữa thanh bên và nội dung ${c('gap: 24px')}.`,
        `${c('.sidebar')} rộng đúng 240px và <strong>không bị co</strong> khi màn hẹp (${c('flex-shrink: 0')}).`,
        `${c('.content')} có ${c('flex: 1')}, bỏ ${c('width: 1000px')}.`,
      ],
      dauVao: '.bo-cuc chưa flex; .content width 1000px.',
      dauRa: '[ thanh bên 240px ] 24px [ nội dung lấp hết phần còn lại ] — ở mọi bề rộng cửa sổ.',
      rangBuoc: [
        'Không đặt width cho .content.',
        'Không dùng calc().',
      ],
      viDu: [{
        input: 'Cửa sổ 1280px (body margin 8px hai bên):\n.bo-cuc 1264px · .sidebar 240px · gap 24px',
        output: '.content = 1264 − 240 − 24 = 1000px',
        explanation: 'flex: 1 = "nở ra lấy hết không gian dư". Cửa sổ 1024px thì content tự còn 744px.',
      }],
      goiY: [
        'flex: 1 đặt trên ITEM cần nở (.content), không trên vật chứa.',
        '.bo-cuc { display: flex; gap: 24px; } .sidebar { width: 240px; flex-shrink: 0; } .content { flex: 1; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
.sidebar {
  width: 240px;
  padding: 16px;
  background: #f1f5f9;
}
.content {
  width: 1000px;
  padding: 16px;
}
`,
        'index.html': TRANG('Quản trị', `    <div class="bo-cuc">
      <aside class="sidebar">
        <p>Bảng điều khiển</p>
        <p>Người dùng</p>
        <p>Cài đặt</p>
      </aside>
      <main class="content">
        <h1>Bảng điều khiển</h1>
        <p>Hôm nay có 42 lượt đăng ký mới.</p>
      </main>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
.bo-cuc {
  display: flex;
  gap: 24px;           /* khoảng giữa thanh bên và nội dung */
}

.sidebar {
  width: 240px;        /* cố định */
  flex-shrink: 0;      /* màn hẹp cũng không bị co dưới 240px */
  padding: 16px;
  background: #f1f5f9;
}

.content {
  flex: 1;             /* = 1 1 0%: nở ra lấy HẾT không gian còn lại */
  padding: 16px;
}
`,
        'index.html': TRANG('Quản trị', `    <div class="bo-cuc">
      <aside class="sidebar">
        <p>Bảng điều khiển</p>
        <p>Người dùng</p>
        <p>Cài đặt</p>
      </aside>
      <main class="content">
        <h1>Bảng điều khiển</h1>
        <p>Hôm nay có 42 lượt đăng ký mới.</p>
      </main>
    </div>`),
      },
      giaiThich: `<p>${c('flex: 1')} là viết tắt của ${c('flex-grow: 1; flex-shrink: 1; flex-basis: 0%')}: bắt đầu từ 0 rồi nở ra lấy toàn bộ phần dư. Vì thanh bên không có flex-grow, toàn bộ phần dư đổ về ${c('.content')} — ở mọi bề rộng.</p>
<p>Chi tiết nhỏ mà quan trọng: flex item mặc định ${c('flex-shrink: 1')}, nên khi màn hẹp trình duyệt được phép co cả thanh bên dưới 240px. ${c('flex-shrink: 0')} giữ nó cố định đúng như thiết kế. Máy chấm kiểm flex-grow/basis của nội dung, flex-shrink và bề rộng của thanh bên, và không còn width cứng.</p>`,
      loiHayGap: [
        `Đặt ${c('flex: 1')} lên ${c('.bo-cuc')} — vật chứa không nở theo con của nó.`,
        `Giữ ${c('width: 1000px')} cùng ${c('flex: 1')} — flex-basis 0% thắng width trong hàng, nhưng mã gây hiểu lầm; xoá đi.`,
        `Đặt ${c('flex: 1')} cho cả thanh bên — hai cột chia đôi, thanh bên không còn 240px.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex',
      kiem: [
        { moTa: '.bo-cuc là flex', kiem: 'css', selector: '.bo-cuc', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: '.bo-cuc gap 24px', kiem: 'css', selector: '.bo-cuc', thuocTinh: 'gap', khop: '^24px( 24px)?$' },
        { moTa: 'Thanh bên rộng 240px', kiem: 'kich-thuoc', selector: '.sidebar', thuocTinh: 'width', giaTri: 240 },
        { moTa: 'Thanh bên không bị co', kiem: 'css', selector: '.sidebar', thuocTinh: 'flex-shrink', giaTri: '0' },
        { moTa: 'Nội dung nở ra (flex-grow 1)', kiem: 'css', selector: '.content', thuocTinh: 'flex-grow', giaTri: '1' },
        { moTa: 'Nội dung flex-basis 0% (flex: 1)', kiem: 'css', selector: '.content', thuocTinh: 'flex-basis', khop: '^0(%|px)?$' },
        { moTa: 'Không còn width cứng cho .content', kiem: 'ma-nguon', tep: 'styles.css', khop: '\\.content\\s*\\{[^}]*[{;\\s]width\\s*:', phuDinh: true },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Hàng thẻ co giãn và xuống dòng: flex-wrap với flex: 1 1 200px',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['flex-wrap', 'flex-grow / flex-shrink / flex-basis', 'flex rút gọn ba giá trị', 'gap hai chiều'],
      tienQuyet: ['flex: 1'],
      the: ['css', 'flexbox', 'flex-wrap', 'cards'],
      moTa: `<p>Bài 3.3 có dòng ${c('flex-wrap: wrap; /* cho các mục rớt xuống dòng mới nếu chật */')}. Ghép nó với ${c('flex: 1')} của mục "Nở ra và co lại", ta được hàng thẻ tự sắp xếp: mỗi thẻ <em>muốn</em> rộng 200px, nở ra chia đều phần dư, và khi chật thì rớt xuống dòng. Viết rút gọn đủ ba giá trị: ${c('flex: 1 1 200px')} = nở (grow) · co (shrink) · kích thước gốc (basis).</p>`,
      yeuCau: [
        `${c('.cards')}: flex, ${c('flex-wrap: wrap')}, ${c('gap: 16px')}.`,
        `Mỗi ${c('.card')}: ${c('flex: 1 1 200px')}.`,
        `Bỏ ${c('width: 23%')} và ${c('margin-right: 2%')} (cách cũ vỡ ở màn hẹp).`,
      ],
      dauVao: 'Năm .card với width 23% + margin-right 2%, không wrap.',
      dauRa: 'Màn rộng: 4 thẻ một hàng, thẻ thứ 5 rớt xuống và nở hết hàng. Màn hẹp: 2 thẻ/hàng, rồi 1 thẻ/hàng.',
      rangBuoc: [
        'Không dùng width hay margin phần trăm trên .card.',
        'Không media query (bài 3.5).',
      ],
      viDu: [{
        input: '.card { flex: 1 1 200px; }  ·  .cards rộng 900px, gap 16px',
        output: '4 thẻ cần 4×200 + 3×16 = 848 ≤ 900 ⇒ 4 thẻ hàng đầu, mỗi thẻ nở thành (900 − 48) / 4 = 213px\nThẻ 5 xuống hàng 2 và nở thành 900px',
        explanation: 'basis 200px quyết định bao nhiêu thẻ VỪA một hàng; grow 1 chia đều phần dư cho các thẻ trên hàng đó.',
      }],
      goiY: [
        'Ba việc trên vật chứa (flex, wrap, gap); một việc trên mỗi item (flex: 1 1 200px).',
        '.cards { display: flex; flex-wrap: wrap; gap: 16px; } .card { flex: 1 1 200px; padding: 16px; border: 1px solid #e2e8f0; }',
      ],
      khoiDau: {
        'styles.css': `${BB}
.cards {
  /* chưa flex */
}
.card {
  display: inline-block;
  width: 23%;
  margin-right: 2%;
  padding: 16px;
  border: 1px solid #e2e8f0;
}
`,
        'index.html': TRANG('Khoá học', `    <div class="cards">
      <div class="card">HTML</div>
      <div class="card">CSS</div>
      <div class="card">JavaScript</div>
      <div class="card">Git</div>
      <div class="card">Node.js</div>
    </div>`),
      },
      loiGiai: {
        'styles.css': `${BB}
.cards {
  display: flex;
  flex-wrap: wrap;   /* chật thì rớt xuống dòng mới */
  gap: 16px;         /* khoảng đều cả ngang lẫn dọc giữa các hàng */
}

.card {
  /* grow 1: nở chia đều phần dư · shrink 1: được co · basis 200px: kích thước mong muốn */
  flex: 1 1 200px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}
`,
        'index.html': TRANG('Khoá học', `    <div class="cards">
      <div class="card">HTML</div>
      <div class="card">CSS</div>
      <div class="card">JavaScript</div>
      <div class="card">Git</div>
      <div class="card">Node.js</div>
    </div>`),
      },
      giaiThich: `<p>${c('flex-basis: 200px')} là "kích thước mong muốn" dùng để quyết định bao nhiêu thẻ vừa một hàng; ${c('flex-grow: 1')} chia phần dư còn lại; ${c('flex-wrap: wrap')} cho phép xuống dòng thay vì ép co. Ba giá trị cùng nhau tạo hàng thẻ responsive không cần media query.</p>
<p>Một đặc điểm cần biết (và là lý do bài 3.4 có Grid): thẻ cuối nằm một mình trên hàng sẽ nở hết hàng — flex nghĩ theo <em>từng hàng</em>, không giữ các cột thẳng nhau. Khi cần cột thẳng hàng, dùng ${c('repeat(auto-fit, minmax(…))')} của Grid. Máy chấm kiểm wrap/gap của vật chứa và grow/shrink/basis của từng thẻ.</p>`,
      loiHayGap: [
        `Quên ${c('flex-wrap: wrap')} — năm thẻ bị ép co trên một hàng, chữ dài tràn ra.`,
        `Viết ${c('flex: 200px')} — một giá trị độ dài nghĩa là ${c('1 1 200px')}; chạy được, nhưng đề yêu cầu viết rõ ba giá trị để nhớ ý nghĩa.`,
        `Giữ ${c('margin-right: 2%')} cùng gap — khoảng cách cộng dồn, hàng bị lệch.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap',
      kiem: [
        { moTa: '.cards flex', kiem: 'css', selector: '.cards', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: '.cards flex-wrap: wrap', kiem: 'css', selector: '.cards', thuocTinh: 'flex-wrap', giaTri: 'wrap' },
        { moTa: '.cards gap 16px', kiem: 'css', selector: '.cards', thuocTinh: 'gap', khop: '^16px( 16px)?$' },
        { moTa: '.card flex-grow 1', kiem: 'css', selector: '.card', thuocTinh: 'flex-grow', giaTri: '1' },
        { moTa: '.card flex-shrink 1', kiem: 'css', selector: '.card', thuocTinh: 'flex-shrink', giaTri: '1' },
        { moTa: '.card flex-basis 200px', kiem: 'css', selector: '.card', thuocTinh: 'flex-basis', giaTri: '200px' },
        { moTa: 'Không còn width/margin phần trăm', kiem: 'ma-nguon', tep: 'styles.css', khop: '(width|margin-right)\\s*:\\s*\\d+%', phuDinh: true },
        { moTa: 'Viết đủ ba giá trị flex: 1 1 200px', kiem: 'ma-nguon', tep: 'styles.css', khop: 'flex\\s*:\\s*1\\s+1\\s+200px' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Bẫy đổi trục: sửa thanh bên column mà justify và align đang làm ngược việc',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['trục chính vs trục phụ khi column', 'justify-content dọc', 'align-items ngang', 'flex lồng nhau hai hướng'],
      tienQuyet: ['toàn bộ bài 3.3'],
      the: ['css', 'flexbox', 'axes', 'debug'],
      moTa: `<p>Bẫy cuối bài 3.3: <em>"Hai thuộc tính căn chỉnh đổi nghĩa cho nhau ngay khi bạn đặt ${c('flex-direction: column')}: justify-content giờ làm việc theo chiều dọc còn align-items theo chiều ngang."</em></p>
<p>Thanh công cụ dọc ${c('.khung')} cao 480px (trục chính dọc) có ba nhóm: logo, các nút công cụ, và thẻ người dùng ở dưới cùng. Người viết trước nghĩ theo hàng ngang nên viết ngược hết. Bên trong thẻ người dùng lại là một flex <em>hàng ngang</em> (ảnh + tên) — nơi justify/align mang nghĩa bình thường. Sửa để ra đúng thiết kế:</p>
${code(`
.khung (column, cao 480px)          .the-nguoi-dung (row)
┌──────────────┐                    ┌──────────────────────┐
│     LOGO     │ ← sát trên          │ (ảnh)  Minh Anh      │
│              │                    └──────────────────────┘
│    [ Bút ]   │                      ảnh và tên căn giữa DỌC,
│    [ Xoá ]   │ ← nhóm giữa           cách nhau 8px
│              │
│ [ảnh] Minh   │ ← sát dưới
└──────────────┘
mọi nhóm căn giữa NGANG trong khung
`)}`,
      yeuCau: [
        `${c('.khung')}: ba nhóm dàn đều từ sát trên xuống sát dưới (theo trục chính dọc) ⇒ ${c('justify-content: space-between')}.`,
        `${c('.khung')}: mọi nhóm căn giữa <strong>ngang</strong> ⇒ thuộc tính trục phụ nào?`,
        `${c('.cong-cu')}: các nút xếp dọc (column) cách nhau 8px.`,
        `${c('.the-nguoi-dung')}: hàng ngang, ảnh và tên căn giữa <strong>dọc</strong>, cách nhau 8px.`,
        `Ghi chú thích ở ${c('.khung')}: "column ⇒ justify là chiều …, align là chiều …".`,
      ],
      dauVao: 'styles.css viết theo "tư duy hàng ngang": .khung có justify-content: center, align-items: flex-end; .the-nguoi-dung có justify-content: center.',
      dauRa: 'Logo sát trên, nhóm nút ở giữa, thẻ người dùng sát dưới; tất cả giữa theo chiều ngang; trong thẻ, ảnh và tên thẳng hàng giữa.',
      rangBuoc: [
        'Không dùng margin auto, position hay height cố định cho từng nhóm.',
        'Không đổi flex-direction của .khung (thiết kế bắt buộc là cột).',
      ],
      viDu: [{
        input: '.khung { display: flex; flex-direction: column; justify-content: center; }',
        output: 'Ba nhóm DỒN vào giữa theo chiều DỌC (không phải giữa ngang như người viết nghĩ).',
        explanation: 'Với column, justify-content làm việc trên trục chính = dọc.',
      }],
      goiY: [
        'Nói thành lời trước khi gõ: ".khung là column ⇒ justify = DỌC, align = NGANG. .the-nguoi-dung là row ⇒ justify = NGANG, align = DỌC."',
        '.khung { justify-content: space-between; align-items: center; } .cong-cu { display: flex; flex-direction: column; gap: 8px; } .the-nguoi-dung { display: flex; align-items: center; gap: 8px; } — bỏ justify-content: center ở thẻ người dùng.',
      ],
      khoiDau: {
        'styles.css': `${BB}
.khung {
  display: flex;
  flex-direction: column;
  height: 480px;
  width: 200px;
  padding: 16px;
  background: #1e293b;
  color: #f8fafc;
  justify-content: center;    /* "căn giữa ngang"?? */
  align-items: flex-end;      /* "đẩy xuống dưới"?? */
}

.cong-cu {
  /* các nút nên xếp dọc, cách 8px */
}

.the-nguoi-dung {
  display: flex;
  justify-content: center;    /* "ảnh và tên giữa dọc"?? */
}

.anh {
  width: 32px;
  height: 32px;
}
`,
        'index.html': TRANG('Thanh công cụ', `    <nav class="khung">
      <div class="logo">LOGO</div>
      <div class="cong-cu">
        <button type="button">Bút</button>
        <button type="button">Xoá</button>
      </div>
      <div class="the-nguoi-dung">
        <img class="anh" src="minh-anh.png" alt="" width="32" height="32">
        <span>Minh Anh</span>
      </div>
    </nav>`),
      },
      loiGiai: {
        'styles.css': `${BB}
/* column ⇒ justify là chiều DỌC (trục chính), align là chiều NGANG (trục phụ) */
.khung {
  display: flex;
  flex-direction: column;
  height: 480px;
  width: 200px;
  padding: 16px;
  background: #1e293b;
  color: #f8fafc;
  justify-content: space-between;  /* DỌC: logo sát trên, thẻ người dùng sát dưới, nhóm nút ở giữa */
  align-items: center;             /* NGANG: mọi nhóm căn giữa trong khung */
}

/* nhóm nút: cột riêng, cách 8px */
.cong-cu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* row (mặc định) ⇒ justify NGANG, align DỌC */
.the-nguoi-dung {
  display: flex;
  align-items: center;   /* DỌC: ảnh 32px và dòng chữ thẳng hàng giữa */
  gap: 8px;              /* ảnh cách tên 8px */
}

.anh {
  width: 32px;
  height: 32px;
}
`,
        'index.html': TRANG('Thanh công cụ', `    <nav class="khung">
      <div class="logo">LOGO</div>
      <div class="cong-cu">
        <button type="button">Bút</button>
        <button type="button">Xoá</button>
      </div>
      <div class="the-nguoi-dung">
        <img class="anh" src="minh-anh.png" alt="" width="32" height="32">
        <span>Minh Anh</span>
      </div>
    </nav>`),
      },
      giaiThich: `<p>Người viết trước không sai cú pháp — họ sai <em>trục</em>. Với ${c('.khung')} là column, ${c('justify-content: center')} dồn mọi thứ vào giữa theo chiều dọc, còn ${c('align-items: flex-end')} đẩy mọi thứ sang <em>phải</em>. Đổi đúng nghĩa: trải dọc ⇒ justify (${c('space-between')} cho "sát trên — giữa — sát dưới" với ba item), căn giữa ngang ⇒ align.</p>
<p>Trang thật luôn lồng hai hướng: khung cột, bên trong có hàng. Mỗi vật chứa có hệ trục của riêng nó — ở ${c('.the-nguoi-dung')} (row), "giữa dọc" lại là ${c('align-items')}. Thói quen bài học dặn: nói hướng ra thành lời, hoặc bật lớp phủ flexbox của DevTools. Máy chấm kiểm 9 giá trị trên ba vật chứa và cấm các mẹo né (margin auto).</p>`,
      loiHayGap: [
        `Đổi ${c('.khung')} sang row cho "dễ" — sai thiết kế, đề cấm.`,
        `Dùng ${c('justify-content: space-around')} — logo và thẻ người dùng cách mép một khoảng, không sát.`,
        `Ở ${c('.the-nguoi-dung')} viết ${c('justify-content: center')} để "giữa dọc" — với row nó căn giữa NGANG.`,
        `Thêm ${c('margin-top: auto')} cho thẻ người dùng — đẩy được xuống đáy, nhưng nhóm nút không còn ở giữa.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox#flexbox_axes',
      kiem: [
        { moTa: '.khung vẫn là column', kiem: 'css', selector: '.khung', thuocTinh: 'flex-direction', giaTri: 'column' },
        { moTa: '.khung trải dọc: space-between', kiem: 'css', selector: '.khung', thuocTinh: 'justify-content', giaTri: 'space-between' },
        { moTa: '.khung căn giữa ngang: align-items center', kiem: 'css', selector: '.khung', thuocTinh: 'align-items', giaTri: 'center' },
        { moTa: '.cong-cu là flex column', kiem: 'css', selector: '.cong-cu', thuocTinh: 'flex-direction', giaTri: 'column' },
        { moTa: '.cong-cu gap 8px', kiem: 'css', selector: '.cong-cu', thuocTinh: 'gap', khop: '^8px( 8px)?$' },
        { moTa: '.cong-cu là flex container', kiem: 'css', selector: '.cong-cu', thuocTinh: 'display', giaTri: 'flex' },
        { moTa: '.the-nguoi-dung là hàng (row)', kiem: 'css', selector: '.the-nguoi-dung', thuocTinh: 'flex-direction', giaTri: 'row' },
        { moTa: '.the-nguoi-dung giữa dọc: align-items center', kiem: 'css', selector: '.the-nguoi-dung', thuocTinh: 'align-items', giaTri: 'center' },
        { moTa: '.the-nguoi-dung không còn justify-content: center', kiem: 'css', selector: '.the-nguoi-dung', thuocTinh: 'justify-content', khop: '^(normal|flex-start|start)$' },
        { moTa: '.the-nguoi-dung gap 8px', kiem: 'css', selector: '.the-nguoi-dung', thuocTinh: 'gap', khop: '^8px( 8px)?$' },
        { moTa: 'Không dùng margin auto / position', kiem: 'ma-nguon', tep: 'styles.css', khop: 'margin(-top|-bottom)?\\s*:[^;]*auto|position\\s*:', phuDinh: true },
        { moTa: 'Có chú thích nói rõ trục của column', kiem: 'ma-nguon', tep: 'styles.css', khop: 'column[^\\n]*justify[^\\n]*(dọc|DỌC)', giuChuThich: true },
      ],
    },
  ],
};
