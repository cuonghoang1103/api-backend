/** Bộ luyện bài 2.3 — Cấu trúc ngữ nghĩa. Lược đồ: ./_luoc-do.mjs */
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
  slug: 'wf-2-3-semantic-html',
  ten: '2.3 Cấu trúc ngữ nghĩa',
  baiHoc: 'Nền tảng Web — Bài 2.3 Cấu trúc ngữ nghĩa: cho trang một ý nghĩa thật',
  ngonNgu: 'html',
  level: 'BEGINNER',
  moTa: 'header / nav / main / section / article / aside / footer, strong/em/time/code, button thay div bấm được — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Từ "div soup" sang landmark: header, nav, main, footer',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['landmark', 'header', 'nav', 'main', 'footer', 'div vô nghĩa'],
      tienQuyet: ['bộ khung HTML5'],
      the: ['html', 'semantic', 'landmarks'],
      moTa: `<p>Bài 2.3 so sánh hai cách viết cùng một trang: bằng ${c('<div class="header">')}, ${c('<div class="nav">')}… và bằng phần tử ngữ nghĩa. <em>"Trên màn hình y hệt, nhưng bản ngữ nghĩa nói cho máy móc và con người biết mỗi phần là gì."</em> Trang blog dưới đây là bản div. Hãy đổi bốn cái hộp vô nghĩa thành bốn landmark — giữ nguyên nội dung bên trong.</p>`,
      yeuCau: [
        `${c('<div class="header">')} → ${c('<header>')}.`,
        `${c('<div class="nav">')} (nằm trong header) → ${c('<nav>')}.`,
        `${c('<div class="main">')} → ${c('<main>')} — đúng một main.`,
        `${c('<div class="footer">')} → ${c('<footer>')}.`,
        `Bỏ các class header/nav/main/footer (thẻ đã nói lên vai trò).`,
      ],
      dauVao: 'index.html: bốn div mang class header/nav/main/footer.',
      dauRa: 'Cùng giao diện, nhưng trình đọc màn hình liệt kê được 4 landmark: banner, navigation, main, contentinfo.',
      rangBuoc: [
        'Không đổi nội dung chữ, liên kết, tiêu đề.',
        'nav vẫn nằm trong header.',
        'Không còn div nào trong trang (bài này không cần hộp vô nghĩa).',
      ],
      viDu: [{
        input: '<div class="nav">\n  <a href="/">Trang chủ</a>\n</div>',
        output: '<nav>\n  <a href="/">Trang chủ</a>\n</nav>\n(trình đọc màn hình: "navigation" — phím tắt nhảy tới được)',
        explanation: 'Tên class không có nghĩa gì với trình duyệt; tên thẻ thì có.',
      }],
      goiY: [
        'Đổi cả thẻ mở lẫn thẻ đóng: <div class="header"> … </div> ⇒ <header> … </header>. Cẩn thận đổi đúng </div> tương ứng.',
        'Thứ tự trong body: <header> (chứa h1 + <nav>), <main> (chứa article), <footer>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Blog của tôi', `    <div class="header">
      <h1>Blog của tôi</h1>
      <div class="nav">
        <a href="/">Trang chủ</a>
        <a href="/about">Giới thiệu</a>
      </div>
    </div>
    <div class="main">
      <h2>Bài viết đầu tiên</h2>
      <p>Hôm nay tôi học HTML ngữ nghĩa.</p>
    </div>
    <div class="footer">
      <p>© 2026 Blog của tôi</p>
    </div>`),
      },
      loiGiai: {
        'index.html': KHUNG('Blog của tôi', `    <!-- banner của trang: logo/tiêu đề + điều hướng chính -->
    <header>
      <h1>Blog của tôi</h1>
      <!-- khối liên kết điều hướng chính -->
      <nav>
        <a href="/">Trang chủ</a>
        <a href="/about">Giới thiệu</a>
      </nav>
    </header>
    <!-- nội dung riêng của trang này: đúng MỘT main -->
    <main>
      <h2>Bài viết đầu tiên</h2>
      <p>Hôm nay tôi học HTML ngữ nghĩa.</p>
    </main>
    <!-- chân trang: bản quyền, liên hệ -->
    <footer>
      <p>© 2026 Blog của tôi</p>
    </footer>`),
      },
      giaiThich: `<p>Bốn landmark này ánh xạ thẳng sang "vai trò" (role) mà trình đọc màn hình hiểu: ${c('header')} cấp trang ⇒ <em>banner</em>, ${c('nav')} ⇒ <em>navigation</em>, ${c('main')} ⇒ <em>main</em>, ${c('footer')} cấp trang ⇒ <em>contentinfo</em>. Người dùng có thể bấm một phím để nhảy thẳng tới main, bỏ qua thanh điều hướng — với div thì không có gì để nhảy tới.</p>
<p>Máy chấm kiểm có đủ bốn phần tử, nav nằm trong header, đúng một main, đúng thứ tự header → main → footer, và không còn div.</p>`,
      loiHayGap: [
        `Đổi thẻ mở thành ${c('<header>')} nhưng quên đổi ${c('</div>')} đóng — trình duyệt đóng header ở chỗ khác, cây méo.`,
        `Giữ ${c('class="header"')} trên ${c('<header>')} — không sai, nhưng thừa; tạo kiểu bằng bộ chọn ${c('header')} là đủ.`,
        `Bọc ${c('<main>')} trong ${c('<header>')} — header chỉ là phần mở đầu.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html',
      kiem: [
        { moTa: 'Có <header> là con của body', kiem: 'ton-tai', selector: 'body > header' },
        { moTa: '<nav> nằm trong <header>', kiem: 'so-luong', selector: 'header > nav a', giaTri: 2 },
        { moTa: 'Đúng một <main>', kiem: 'so-luong', selector: 'main', giaTri: 1 },
        { moTa: 'Có <footer> là con của body', kiem: 'ton-tai', selector: 'body > footer' },
        { moTa: 'Thứ tự header → main → footer', kiem: 'thu-tu', cacSelector: ['body > header', 'body > main', 'body > footer'] },
        { moTa: 'Không còn <div> nào', kiem: 'khong-ton-tai', selector: 'div' },
        { moTa: 'Nội dung giữ nguyên: h2 trong main', kiem: 'text', selector: 'main > h2', giaTri: 'Bài viết đầu tiên' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Ngữ nghĩa cấp chữ: strong, em, time và code thay cho b, i và chữ trơn',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['strong', 'em', 'time datetime', 'code', 'b/i chỉ là hình thức'],
      tienQuyet: ['phần tử và thuộc tính'],
      the: ['html', 'semantic', 'inline'],
      moTa: `<p>Bài 2.3: <em>"Ưu tiên ${c('<strong>')}/${c('<em>')} hơn ${c('<b>')}/${c('<i>')} vốn chỉ mang tính hình thức"</em>, và có cả ${c('<time>')}, ${c('<code>')}. Thông báo bảo trì của câu lạc bộ đang dùng toàn ${c('<b>')} và ${c('<i>')}. Đổi từng chỗ theo <strong>nghĩa</strong> của nó.</p>`,
      yeuCau: [
        `"Quan trọng:" là lời cảnh báo ⇒ ${c('<strong>')}.`,
        `Chữ "không" được nhấn giọng ⇒ ${c('<em>')}.`,
        `Ngày "Thứ Bảy 18/10/2026" ⇒ ${c('<time datetime="2026-10-18">')} (máy đọc được dạng năm-tháng-ngày).`,
        `Lệnh ${c('git pull')} ⇒ ${c('<code>')}.`,
        `Không còn ${c('<b>')} hay ${c('<i>')} nào.`,
      ],
      dauVao: 'Một đoạn thông báo dùng <b>, <i> và chữ trơn.',
      dauRa: 'Đoạn văn trông gần như cũ, nhưng mỗi mẩu được đánh dấu đúng nghĩa.',
      rangBuoc: [
        'datetime theo định dạng YYYY-MM-DD.',
        'Chữ hiển thị của ngày giữ nguyên "Thứ Bảy 18/10/2026".',
      ],
      viDu: [{
        input: '<time datetime="2026-10-18">Thứ Bảy 18/10/2026</time>',
        output: 'Người đọc thấy: Thứ Bảy 18/10/2026\nMáy (lịch, công cụ tìm kiếm) đọc: 2026-10-18',
        explanation: 'Chữ dành cho người, datetime dành cho máy — hai thứ có thể viết khác nhau.',
      }],
      goiY: [
        'Hỏi cho mỗi chỗ đậm/nghiêng: đây là "quan trọng" (strong), "nhấn giọng khi đọc" (em), hay chỉ là kiểu chữ? Trong đoạn này cả hai chỗ đều có nghĩa.',
        'Ngày: bọc chữ ngày trong <time datetime="2026-10-18">…</time>. Lệnh: <code>git pull</code>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Thông báo bảo trì', `    <h1>Thông báo bảo trì</h1>
    <p>
      <b>Quan trọng:</b> máy chủ CLB sẽ bảo trì vào Thứ Bảy 18/10/2026.
      Các bạn <i>không</i> đẩy code trong thời gian đó.
      Sau bảo trì, nhớ chạy git pull trước khi làm tiếp.
    </p>`),
      },
      loiGiai: {
        'index.html': KHUNG('Thông báo bảo trì', `    <h1>Thông báo bảo trì</h1>
    <p>
      <!-- strong: nội dung QUAN TRỌNG (không chỉ là chữ đậm) -->
      <strong>Quan trọng:</strong> máy chủ CLB sẽ bảo trì vào
      <!-- time: chữ cho người, datetime cho máy -->
      <time datetime="2026-10-18">Thứ Bảy 18/10/2026</time>.
      <!-- em: nhấn giọng — đổi nghĩa câu khi đọc to -->
      Các bạn <em>không</em> đẩy code trong thời gian đó.
      <!-- code: một đoạn mã / lệnh -->
      Sau bảo trì, nhớ chạy <code>git pull</code> trước khi làm tiếp.
    </p>`),
      },
      giaiThich: `<p>${c('<b>')} và ${c('<i>')} chỉ nói "in đậm/nghiêng"; ${c('<strong>')} nói "quan trọng", ${c('<em>')} nói "nhấn giọng". Khác biệt lộ ra khi không có màn hình: một số trình đọc đổi ngữ điệu với em/strong, và công cụ tóm tắt hay tìm kiếm biết đâu là ý chính.</p>
<p>${c('<time datetime>')} tách chữ hiển thị khỏi giá trị máy đọc — "Thứ Bảy 18/10/2026" có thể viết bằng bất kỳ ngôn ngữ nào, còn ${c('2026-10-18')} là định dạng chuẩn ISO mà lịch hay công cụ tìm kiếm hiểu. ${c('<code>')} cho biết đây là mã: trình duyệt dùng phông đơn cách, và công cụ dịch tự động sẽ không dịch nó.</p>`,
      loiHayGap: [
        `Viết ${c('datetime="18/10/2026"')} — không phải định dạng máy hiểu; phải là ${c('2026-10-18')}.`,
        `Đổi mọi chữ đậm thành strong kể cả chỗ chỉ để trang trí — strong khi đó mất giá trị.`,
        `Dùng ${c('<em>')} vì "muốn chữ nghiêng" cho tên tác phẩm — đó là việc của CSS hoặc ${c('<cite>')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time',
      kiem: [
        { moTa: '"Quan trọng:" nằm trong <strong>', kiem: 'text', selector: 'p strong', giaTri: 'Quan trọng:' },
        { moTa: '"không" nằm trong <em>', kiem: 'text', selector: 'p em', giaTri: 'không' },
        { moTa: 'Có <time datetime="2026-10-18">', kiem: 'thuoc-tinh', selector: 'time', thuocTinh: 'datetime', giaTri: '2026-10-18' },
        { moTa: 'Chữ của <time> giữ nguyên "Thứ Bảy 18/10/2026"', kiem: 'text', selector: 'time', giaTri: 'Thứ Bảy 18/10/2026' },
        { moTa: '"git pull" nằm trong <code>', kiem: 'text', selector: 'code', giaTri: 'git pull' },
        { moTa: 'Không còn <b> hay <i>', kiem: 'khong-ton-tai', selector: 'b, i' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Nút thật thay cho div bấm được',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['button', 'type="button"', 'tiêu điểm bàn phím', 'div onclick'],
      tienQuyet: ['landmark'],
      the: ['html', 'button', 'a11y', 'keyboard'],
      moTa: `<p>Bẫy cuối bài 2.3: <em>"Một ${c('<div>')} bấm được thì chạy với bạn và hỏng với mọi người khác."</em> Không tới được bằng Tab, không phản hồi Enter/Space, trình đọc màn hình đọc như chữ thường. Thanh công cụ ghi chú dưới đây có ba "nút" làm bằng div. Đổi chúng thành nút thật.</p>`,
      yeuCau: [
        `Ba ${c('<div class="nut" onclick="…">')} → ba ${c('<button type="button">')}, giữ nguyên ${c('onclick')} và chữ.`,
        `Giữ ${c('class="nut"')} để CSS cũ vẫn ăn.`,
        `Không còn phần tử nào có ${c('onclick')} mà không phải ${c('<button>')}.`,
        `Không dùng ${c('role="button"')}/${c('tabindex')} — dùng thẻ đúng thì khỏi cần.`,
      ],
      dauVao: 'Thanh công cụ 3 div bấm được.',
      dauRa: 'Ba nút bấm thật: Tab tới được, Enter/Space kích hoạt, trình đọc nói "nút Lưu".',
      rangBuoc: [
        'type="button" bắt buộc (nút trong form mặc định là submit).',
        'Không thêm JavaScript mới.',
      ],
      viDu: [{
        input: '<div class="nut" onclick="luu()">Lưu</div>',
        output: 'Chuột: bấm được. Bàn phím: Tab nhảy qua luôn. Trình đọc: "Lưu" (như chữ thường).',
        explanation: 'div không có hành vi tương tác nào sẵn.',
      }, {
        input: '<button type="button" class="nut" onclick="luu()">Lưu</button>',
        output: 'Chuột: bấm được. Tab: dừng ở nút, có vòng tiêu điểm. Enter/Space: gọi luu(). Trình đọc: "Lưu, nút".',
        explanation: 'Mọi hành vi đó đi kèm miễn phí với <button>.',
      }],
      goiY: [
        'Chỉ cần đổi tên thẻ (mở và đóng) và thêm type="button"; các thuộc tính khác giữ nguyên.',
        '<button type="button" class="nut" onclick="luu()">Lưu</button> — làm tương tự cho Xoá và Chia sẻ.',
      ],
      khoiDau: {
        'index.html': KHUNG('Ghi chú', `    <h1>Ghi chú của tôi</h1>
    <div class="thanh-cong-cu">
      <div class="nut" onclick="luu()">Lưu</div>
      <div class="nut" onclick="xoa()">Xoá</div>
      <div class="nut" onclick="chiaSe()">Chia sẻ</div>
    </div>
    <p>Nội dung ghi chú…</p>`),
      },
      loiGiai: {
        'index.html': KHUNG('Ghi chú', `    <h1>Ghi chú của tôi</h1>
    <!-- div bọc ngoài thì ổn: nó chỉ là hộp để dàn trang -->
    <div class="thanh-cong-cu">
      <!-- button: tới được bằng Tab, Enter/Space kích hoạt, tự xưng là "nút" -->
      <!-- type="button": không vô tình gửi form nếu sau này nằm trong form -->
      <button type="button" class="nut" onclick="luu()">Lưu</button>
      <button type="button" class="nut" onclick="xoa()">Xoá</button>
      <button type="button" class="nut" onclick="chiaSe()">Chia sẻ</button>
    </div>
    <p>Nội dung ghi chú.</p>`),
      },
      giaiThich: `<p>Để một div bấm được "tử tế", bạn nợ nó ${c('role="button"')} (để trình đọc biết), ${c('tabindex="0"')} (để Tab tới), và hai handler phím cho Enter và Space — như bài 2.3 nói, <em>"đó chính là trình duyệt đang bảo bạn hãy dùng cái button"</em>. ${c('<button>')} có sẵn tất cả.</p>
<p>${c('type="button"')} quan trọng vì mặc định của ${c('<button>')} là ${c('submit')}: đặt ba nút này vào một form ở bài 2.4 thì bấm "Xoá" sẽ gửi form. Máy chấm kiểm 3 button có type="button", không còn ${c('[onclick]')} nào ngoài button, và không có role/tabindex chắp vá.</p>`,
      loiHayGap: [
        `Thêm ${c('tabindex="0"')} vào div rồi coi là xong — Tab tới được nhưng Enter/Space vẫn không làm gì.`,
        `Đổi sang ${c('<a href="#">')} — liên kết là để <em>đi tới</em> đâu đó; hành động là việc của button.`,
        `Quên ${c('type="button"')} — mọi thứ chạy cho tới ngày nút nằm trong một form.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
      kiem: [
        { moTa: 'Có đúng 3 <button class="nut">', kiem: 'so-luong', selector: 'button.nut', giaTri: 3 },
        { moTa: 'Mọi button có type="button"', kiem: 'thuoc-tinh', selector: 'button', thuocTinh: 'type', giaTri: 'button' },
        { moTa: 'Không còn phần tử nào khác button mang onclick', kiem: 'khong-ton-tai', selector: '[onclick]:not(button)' },
        { moTa: 'Không dùng role="button" hay tabindex chắp vá', kiem: 'khong-ton-tai', selector: '[role="button"], [tabindex]' },
        { moTa: 'Nút đầu ghi "Lưu" và gọi luu()', kiem: 'thuoc-tinh', selector: 'button.nut:first-child', thuocTinh: 'onclick', giaTri: 'luu()' },
        { moTa: 'Chữ ba nút giữ nguyên', kiem: 'text', selector: '.thanh-cong-cu', khop: '^Lưu Xoá Chia sẻ$' },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Một bài blog đầy đủ: article, section và aside đúng chỗ',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['article', 'section', 'aside', 'header trong article', 'time'],
      tienQuyet: ['landmark header/nav/main/footer'],
      the: ['html', 'semantic', 'article', 'section'],
      moTa: `<p>Bài 2.3 phân biệt: ${c('<article>')} là mẩu <em>đứng một mình vẫn có nghĩa</em> (một bài blog), ${c('<section>')} là <em>nhóm theo chủ đề, thường có tiêu đề riêng</em>, ${c('<aside>')} là <em>nội dung bên lề</em>. ${c('<header>')} không chỉ dùng cho đầu trang — nó cũng là "phần mở đầu" của một bài. Trang bài viết dưới đây toàn div; hãy gán đúng vai.</p>`,
      yeuCau: [
        `Bài viết là một ${c('<article>')} nằm trong ${c('<main>')}.`,
        `Phần mở đầu của bài (tiêu đề ${c('<h2>')} + ngày đăng) là ${c('<header>')} bên trong article; ngày dùng ${c('<time datetime="2026-10-12">')}.`,
        `Hai phần "Vì sao" và "Bắt đầu thế nào" là hai ${c('<section>')} trong article, mỗi cái mở đầu bằng ${c('<h3>')}.`,
        `Khối "Bài liên quan" là ${c('<aside>')} nằm trong main nhưng <strong>ngoài</strong> article.`,
      ],
      dauVao: 'Trang có header + nav + footer sẵn; phần thân bài viết toàn div.',
      dauRa: 'main > article (header, 2 section) + aside "Bài liên quan".',
      rangBuoc: [
        'Không còn div trong main.',
        'Mỗi section có tiêu đề riêng.',
        'Giữ dàn ý: h1 (tên blog) → h2 (tên bài) → h3 (các phần) — aside dùng h2.',
      ],
      viDu: [{
        input: '<article>\n  <header>\n    <h2>Học HTML ngữ nghĩa</h2>\n    <p>Đăng ngày <time datetime="2026-10-12">12/10/2026</time></p>\n  </header>\n  <section><h3>Vì sao</h3>…</section>\n</article>',
        output: 'Trình đọc màn hình: "article, Học HTML ngữ nghĩa" — người nghe biết đây là một bài trọn vẹn.',
        explanation: 'header bên trong article là phần mở đầu của BÀI, không phải banner của trang.',
      }],
      goiY: [
        'Thử câu hỏi của bài học: khối này đem sang trang khác (vd chia sẻ, RSS) mà vẫn có nghĩa? Có ⇒ article. Chỉ là một phần có tiêu đề của thứ lớn hơn ⇒ section. Bên lề, liên quan nhưng không thiết yếu ⇒ aside.',
        'Khung: <main><article><header>h2 + p/time</header><section>h3 + p</section><section>h3 + p</section></article><aside>h2 + ul</aside></main>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Blog của Tú', `    <header>
      <h1>Blog của Tú</h1>
      <nav><a href="/">Trang chủ</a> <a href="/bai-viet">Bài viết</a></nav>
    </header>
    <main>
      <div class="bai">
        <div class="dau-bai">
          <h2>Học HTML ngữ nghĩa trong một buổi tối</h2>
          <p>Đăng ngày 12/10/2026</p>
        </div>
        <div class="phan">
          <h3>Vì sao</h3>
          <p>Trình đọc màn hình và Google dựa vào tên thẻ để hiểu trang.</p>
        </div>
        <div class="phan">
          <h3>Bắt đầu thế nào</h3>
          <p>Thay từng div bằng phần tử ngữ nghĩa phù hợp nhất.</p>
        </div>
      </div>
      <div class="ben-le">
        <h2>Bài liên quan</h2>
        <ul>
          <li><a href="/bai-viet/the-a">Liên kết và ảnh</a></li>
          <li><a href="/bai-viet/bieu-mau">Biểu mẫu</a></li>
        </ul>
      </div>
    </main>
    <footer><p>© 2026 Blog của Tú</p></footer>`),
      },
      loiGiai: {
        'index.html': KHUNG('Blog của Tú', `    <header>
      <h1>Blog của Tú</h1>
      <nav><a href="/">Trang chủ</a> <a href="/bai-viet">Bài viết</a></nav>
    </header>
    <main>
      <!-- article: đứng một mình vẫn có nghĩa (chia sẻ, RSS) -->
      <article>
        <!-- header của BÀI: tiêu đề + thông tin đăng -->
        <header>
          <h2>Học HTML ngữ nghĩa trong một buổi tối</h2>
          <p>Đăng ngày <time datetime="2026-10-12">12/10/2026</time></p>
        </header>
        <!-- section: một phần có tiêu đề riêng của bài -->
        <section>
          <h3>Vì sao</h3>
          <p>Trình đọc màn hình và Google dựa vào tên thẻ để hiểu trang.</p>
        </section>
        <section>
          <h3>Bắt đầu thế nào</h3>
          <p>Thay từng div bằng phần tử ngữ nghĩa phù hợp nhất.</p>
        </section>
      </article>
      <!-- aside: bên lề, liên quan nhưng không thuộc bài ⇒ nằm NGOÀI article -->
      <aside>
        <h2>Bài liên quan</h2>
        <ul>
          <li><a href="/bai-viet/the-a">Liên kết và ảnh</a></li>
          <li><a href="/bai-viet/bieu-mau">Biểu mẫu</a></li>
        </ul>
      </aside>
    </main>
    <footer><p>© 2026 Blog của Tú</p></footer>`),
      },
      giaiThich: `<p>Ba phép thử phân vai: <strong>article</strong> — tách ra khỏi trang vẫn trọn nghĩa (bài viết đi vào RSS, thẻ bài viết chia sẻ lên mạng xã hội); <strong>section</strong> — một phần có tiêu đề của một thứ lớn hơn (nếu không đặt được tiêu đề, có lẽ nó là div); <strong>aside</strong> — bên lề, bỏ đi thì nội dung chính không thiếu gì.</p>
<p>Đặt aside <em>trong</em> article sẽ nói "đây là ghi chú bên lề của bài này" — khác nghĩa với "bài liên quan của trang". Máy chấm kiểm ${c('main > article')}, ${c('article > header > time[datetime]')}, hai ${c('article > section')} có h3, và ${c('main > aside')} không nằm trong article.</p>`,
      loiHayGap: [
        `Biến cả trang thành một section lớn — section không thay được main.`,
        `Dùng section cho khối không có tiêu đề chỉ để "bớt div" — section không tiêu đề là dấu hiệu nên dùng div.`,
        `Bỏ ${c('<header>')} trong article vì "header chỉ có một" — một trang có thể có nhiều header (của trang, của từng bài).`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article',
      kiem: [
        { moTa: 'Có main > article', kiem: 'so-luong', selector: 'main > article', giaTri: 1 },
        { moTa: 'article có header chứa h2', kiem: 'ton-tai', selector: 'article > header > h2' },
        { moTa: 'Ngày đăng là <time datetime="2026-10-12">', kiem: 'thuoc-tinh', selector: 'article > header time', thuocTinh: 'datetime', giaTri: '2026-10-12' },
        { moTa: 'article có 2 section, mỗi cái mở đầu bằng h3', kiem: 'so-luong', selector: 'article > section > h3:first-child', giaTri: 2 },
        { moTa: 'aside là con của main', kiem: 'ton-tai', selector: 'main > aside' },
        { moTa: 'aside KHÔNG nằm trong article', kiem: 'khong-ton-tai', selector: 'article aside' },
        { moTa: 'Không còn div trong main', kiem: 'khong-ton-tai', selector: 'main div' },
        { moTa: 'Dàn ý tiêu đề không nhảy cấp, một h1', kiem: 'tieu-de' },
        { moTa: 'article đứng trước aside', kiem: 'thu-tu', cacSelector: ['main > article', 'main > aside'] },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Lưới thẻ bài viết: mỗi thẻ là một article có ngày giờ máy đọc được',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['article lặp lại', 'section có tiêu đề', 'time datetime', 'liên kết mô tả rõ'],
      tienQuyet: ['article / section'],
      the: ['html', 'semantic', 'cards'],
      moTa: `<p>Trang chủ blog có khối "Bài mới" gồm 3 thẻ xem trước. Mỗi thẻ đứng một mình vẫn có nghĩa (tiêu đề, ngày, tóm tắt, liên kết đọc tiếp) ⇒ mỗi thẻ là một ${c('<article>')}. Liên kết "Đọc tiếp" lặp ba lần là chữ mơ hồ với trình đọc màn hình — bài 2.5 sẽ nhắc lại: <em>"chữ mô tả rõ, không phải bấm vào đây"</em>. Hãy viết khối này từ đầu theo dữ liệu.</p>
${code(`
Bài mới
  1. "Flexbox trong 10 phút"      — 03/10/2026 — Căn giữa không còn là ác mộng.     → /bai/flexbox
  2. "Grid cho người mới"          — 07/10/2026 — Hai chiều, một dòng CSS.           → /bai/grid
  3. "Responsive từ điện thoại"    — 11/10/2026 — Mobile-first và media query.       → /bai/responsive
`)}`,
      yeuCau: [
        `Một ${c('<section class="bai-moi">')} mở đầu bằng ${c('<h2>Bài mới</h2>')}.`,
        `Ba ${c('<article>')} trong section, mỗi cái có ${c('<h3>')} (tên bài), ${c('<time>')} có ${c('datetime')} dạng YYYY-MM-DD đúng ngày, một ${c('<p>')} tóm tắt, và một liên kết.`,
        `Chữ liên kết mô tả rõ: "Đọc bài Flexbox trong 10 phút" (không phải "Đọc tiếp" hay "bấm vào đây").`,
        `href đúng như dữ liệu.`,
      ],
      dauVao: 'Trang có header/main/footer; main còn trống chỗ cho khối Bài mới.',
      dauRa: 'Khối "Bài mới" gồm 3 thẻ article, mỗi thẻ đọc riêng vẫn đủ nghĩa.',
      rangBuoc: [
        'Không dùng div cho thẻ.',
        'datetime phải khớp ngày hiển thị (03/10/2026 ⇒ 2026-10-03).',
        'Chữ của mỗi liên kết là duy nhất trong trang.',
      ],
      viDu: [{
        input: '<article>\n  <h3>Flexbox trong 10 phút</h3>\n  <time datetime="2026-10-03">03/10/2026</time>\n  <p>Căn giữa không còn là ác mộng.</p>\n  <a href="/bai/flexbox">Đọc bài Flexbox trong 10 phút</a>\n</article>',
        output: 'Một thẻ: tên bài, ngày, câu tóm tắt, liên kết.\nDanh sách liên kết của trình đọc màn hình: "Đọc bài Flexbox trong 10 phút" (thay vì ba lần "Đọc tiếp").',
        explanation: 'Người dùng trình đọc thường lướt danh sách liên kết tách khỏi ngữ cảnh — chữ liên kết phải tự đủ nghĩa.',
      }],
      goiY: [
        'Viết trọn một article đúng trước, kiểm, rồi chép thành ba và sửa dữ liệu. Chú ý datetime đổi chỗ ngày–tháng–năm thành năm-tháng-ngày.',
        'Thứ tự trong mỗi article: h3 → time → p → a. Liên kết: <a href="/bai/grid">Đọc bài Grid cho người mới</a>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Blog của Tú', `    <header><h1>Blog của Tú</h1></header>
    <main>
      <!-- Viết khối "Bài mới" ở đây: section > h2 + 3 article -->
      <div class="the">
        <b>Flexbox trong 10 phút</b> 03/10/2026
        Căn giữa không còn là ác mộng. <a href="/bai/flexbox">Đọc tiếp</a>
      </div>
    </main>
    <footer><p>© 2026 Blog của Tú</p></footer>`),
      },
      loiGiai: {
        'index.html': KHUNG('Blog của Tú', `    <header><h1>Blog của Tú</h1></header>
    <main>
      <!-- section: một nhóm theo chủ đề, có tiêu đề riêng -->
      <section class="bai-moi">
        <h2>Bài mới</h2>
        <!-- mỗi thẻ đứng một mình vẫn đủ nghĩa ⇒ article -->
        <article>
          <h3>Flexbox trong 10 phút</h3>
          <!-- datetime YYYY-MM-DD: máy đọc; chữ dd/mm/yyyy: người đọc -->
          <time datetime="2026-10-03">03/10/2026</time>
          <p>Căn giữa không còn là ác mộng.</p>
          <!-- chữ liên kết tự đủ nghĩa khi bị tách khỏi thẻ -->
          <a href="/bai/flexbox">Đọc bài Flexbox trong 10 phút</a>
        </article>
        <article>
          <h3>Grid cho người mới</h3>
          <time datetime="2026-10-07">07/10/2026</time>
          <p>Hai chiều, một dòng CSS.</p>
          <a href="/bai/grid">Đọc bài Grid cho người mới</a>
        </article>
        <article>
          <h3>Responsive từ điện thoại</h3>
          <time datetime="2026-10-11">11/10/2026</time>
          <p>Mobile-first và media query.</p>
          <a href="/bai/responsive">Đọc bài Responsive từ điện thoại</a>
        </article>
      </section>
    </main>
    <footer><p>© 2026 Blog của Tú</p></footer>`),
      },
      giaiThich: `<p>Một trang có thể có nhiều article: mỗi thẻ xem trước là một đơn vị độc lập (đúng phép thử "đem sang chỗ khác vẫn có nghĩa"). Section bọc ngoài vì "Bài mới" là một nhóm theo chủ đề và có tiêu đề riêng. Dàn ý vì thế gọn: h1 tên blog → h2 Bài mới → h3 từng bài.</p>
<p>Máy chấm đối chiếu từng ${c('datetime')} với đúng ngày (chuyển dd/mm/yyyy ⇒ yyyy-mm-dd là chỗ hay nhầm), đếm đủ phần trong mỗi article, và kiểm không có chữ liên kết mơ hồ ("Đọc tiếp", "Xem thêm", "bấm vào đây").</p>`,
      loiHayGap: [
        `Viết ${c('datetime="2026-03-10"')} cho ngày 03/10 — đảo nhầm tháng và ngày.`,
        `Dùng ${c('<h2>')} cho tên từng bài — ngang hàng với "Bài mới", mất quan hệ cha–con.`,
        `Bọc cả thẻ trong ${c('<a>')} rồi vẫn thêm liên kết "Đọc tiếp" bên trong — liên kết lồng liên kết là không hợp lệ.`,
      ],
      thamKhao: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
      kiem: [
        { moTa: 'section.bai-moi mở đầu bằng h2 "Bài mới"', kiem: 'text', selector: 'section.bai-moi > h2:first-child', giaTri: 'Bài mới' },
        { moTa: 'Có 3 article trong section', kiem: 'so-luong', selector: 'section.bai-moi > article', giaTri: 3 },
        { moTa: 'Mỗi article có h3', kiem: 'so-luong', selector: 'section.bai-moi > article > h3', giaTri: 3 },
        { moTa: 'Mỗi article có <time> với datetime YYYY-MM-DD', kiem: 'thuoc-tinh', selector: 'article time', thuocTinh: 'datetime', khop: '^\\d{4}-\\d{2}-\\d{2}$' },
        { moTa: 'Ngày 03/10/2026 ⇒ datetime 2026-10-03', kiem: 'ton-tai', selector: 'article:nth-of-type(1) time[datetime="2026-10-03"]' },
        { moTa: 'Ngày 11/10/2026 ⇒ datetime 2026-10-11', kiem: 'ton-tai', selector: 'article:nth-of-type(3) time[datetime="2026-10-11"]' },
        { moTa: 'Mỗi article có một đoạn tóm tắt', kiem: 'so-luong', selector: 'article > p', giaTri: 3 },
        { moTa: 'Ba liên kết đúng href', kiem: 'so-luong', selector: 'a[href="/bai/flexbox"], a[href="/bai/grid"], a[href="/bai/responsive"]', giaTri: 3 },
        { moTa: 'Không có chữ liên kết mơ hồ', kiem: 'text', selector: 'a', khop: '^(?!(đọc tiếp|xem thêm|bấm vào đây|tại đây)$).{12,}$' },
        { moTa: 'Không dùng div cho thẻ', kiem: 'khong-ton-tai', selector: 'main div' },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Bắt lỗi ngữ nghĩa: hai main, section câm, footer lạc và div bấm được',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['một main mỗi trang', 'section cần tiêu đề', 'footer của trang', 'button', 'strong'],
      tienQuyet: ['các bài 1–5 của bộ này'],
      the: ['html', 'semantic', 'review', 'debug'],
      moTa: `<p>Bạn đang review mã (code review) cho một bạn cùng nhóm. Trang dùng phần tử ngữ nghĩa nhưng dùng <em>sai</em> — tệ hơn cả div, vì nó nói dối máy móc về cấu trúc. Có đúng năm lỗi, mỗi lỗi vi phạm một câu trong bài 2.3.</p>
<ol>
  <li>Trang có <strong>hai</strong> ${c('<main>')} ("Mỗi trang chỉ một").</li>
  <li>Một ${c('<section>')} không có tiêu đề nào, chỉ bọc ảnh để dàn trang ("thường có tiêu đề riêng" — không có thì nó là div).</li>
  <li>Footer bản quyền của <em>cả trang</em> nằm lọt trong main.</li>
  <li>Nút "Đăng ký nhận tin" là ${c('<div onclick>')}.</li>
  <li>Câu cảnh báo dùng ${c('<b>')} thay vì ${c('<strong>')}.</li>
</ol>`,
      yeuCau: [
        `Gộp thành <strong>một</strong> ${c('<main>')} chứa cả hai phần nội dung.`,
        `Đổi ${c('<section class="khung-anh">')} không tiêu đề thành ${c('<div class="khung-anh">')}.`,
        `Đưa ${c('<footer>')} ra làm con trực tiếp của ${c('<body>')}, sau main.`,
        `Đổi div bấm được thành ${c('<button type="button">')} (giữ onclick, chữ, class).`,
        `Đổi ${c('<b>')} cảnh báo thành ${c('<strong>')}.`,
      ],
      dauVao: 'Trang khuyến mãi khoá học với 5 lỗi ngữ nghĩa.',
      dauRa: 'body > header, main (một), footer; mọi section có tiêu đề; nút là button; cảnh báo là strong.',
      rangBuoc: [
        'Không xoá nội dung chữ hay ảnh nào.',
        'Section còn lại đều có tiêu đề h2 là con đầu tiên.',
      ],
      viDu: [{
        input: '<main>…</main>\n<main>…</main>',
        output: 'Trình đọc màn hình: phím "nhảy tới main" chỉ tới cái đầu; nội dung thứ hai coi như ở ngoài.',
        explanation: 'Landmark main là "nội dung chính, riêng của trang" — chỉ có một nội dung chính.',
      }],
      goiY: [
        'Đi từ ngoài vào: body nên có đúng 3 con là header, main, footer. Mọi thứ khác nằm trong main.',
        'Xoá </main><main> ở giữa (gộp), di chuyển khối <footer> xuống sau </main>, đổi <section class="khung-anh"> … </section> thành div.',
      ],
      khoiDau: {
        'index.html': KHUNG('Khoá học Web', `    <header>
      <h1>Khoá học Nền tảng Web</h1>
    </header>
    <main>
      <section>
        <h2>Bạn sẽ học gì</h2>
        <p>HTML, CSS, JavaScript và cách đưa trang lên mạng.</p>
      </section>
      <section class="khung-anh">
        <img src="lop-hoc.jpg" alt="Lớp học buổi tối với 20 bạn đang gõ máy" width="600" height="300">
      </section>
    </main>
    <main>
      <section>
        <h2>Đăng ký</h2>
        <p><b>Chú ý:</b> chỉ còn 10 suất học bổng.</p>
        <div class="nut" onclick="dangKy()">Đăng ký nhận tin</div>
      </section>
      <footer>
        <p>© 2026 CuongThai</p>
      </footer>
    </main>`),
      },
      loiGiai: {
        'index.html': KHUNG('Khoá học Web', `    <header>
      <h1>Khoá học Nền tảng Web</h1>
    </header>
    <!-- (1) MỘT main chứa toàn bộ nội dung chính -->
    <main>
      <section>
        <h2>Bạn sẽ học gì</h2>
        <p>HTML, CSS, JavaScript và cách đưa trang lên mạng.</p>
      </section>
      <!-- (2) chỉ là hộp dàn trang, không có tiêu đề ⇒ div -->
      <div class="khung-anh">
        <img src="lop-hoc.jpg" alt="Lớp học buổi tối với 20 bạn đang gõ máy" width="600" height="300">
      </div>
      <section>
        <h2>Đăng ký</h2>
        <!-- (5) cảnh báo là nội dung quan trọng ⇒ strong -->
        <p><strong>Chú ý:</strong> chỉ còn 10 suất học bổng.</p>
        <!-- (4) hành động ⇒ button thật -->
        <button type="button" class="nut" onclick="dangKy()">Đăng ký nhận tin</button>
      </section>
    </main>
    <!-- (3) footer của CẢ TRANG: con trực tiếp của body, sau main -->
    <footer>
      <p>© 2026 CuongThai</p>
    </footer>`),
      },
      giaiThich: `<p>Phần tử ngữ nghĩa dùng sai là một lời nói dối có cấu trúc: hai ${c('main')} nói "trang có hai nội dung chính", footer trong main bị hiểu là chân của <em>phần</em> đó chứ không phải của trang (mất vai trò contentinfo), section không tiêu đề thành một vùng không tên trong danh sách vùng của trình đọc. Vì vậy quy tắc bỏ túi của bài 2.3 là "tìm phần tử ngữ nghĩa trước" — <em>nhưng chỉ khi nó đúng</em>; không đúng thì hạ xuống div mà không áy náy.</p>
<p>Máy chấm kiểm từng lỗi: một main, ${c('body > footer')} sau main, mọi ${c('section')} có ${c('h2')} đầu tiên, ${c('.khung-anh')} là div, không còn ${c('[onclick]')} ngoài button, không còn ${c('b')}.</p>`,
      loiHayGap: [
        `Xoá main thứ hai cùng nội dung bên trong — mất phần Đăng ký.`,
        `Thêm một tiêu đề giả vào section khung ảnh để "giữ section" — tiêu đề phải có nghĩa thật; ở đây khối không có chủ đề riêng.`,
        `Đưa footer ra ngoài nhưng đặt trước main — chân trang phải ở cuối.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main',
      kiem: [
        { moTa: 'Đúng một <main>', kiem: 'so-luong', selector: 'main', giaTri: 1 },
        { moTa: 'body có đúng 3 con: header, main, footer', kiem: 'so-luong', selector: 'body > header, body > main, body > footer', giaTri: 3 },
        { moTa: 'footer là con của body, đứng sau main', kiem: 'thu-tu', cacSelector: ['body > main', 'body > footer'] },
        { moTa: 'Không có footer trong main', kiem: 'khong-ton-tai', selector: 'main footer' },
        { moTa: '.khung-anh là div (không còn section câm)', kiem: 'ton-tai', selector: 'div.khung-anh > img' },
        { moTa: 'Mọi section mở đầu bằng h2', kiem: 'khong-ton-tai', selector: 'section:not(:has(> h2:first-child))' },
        { moTa: 'Nút đăng ký là button type="button"', kiem: 'thuoc-tinh', selector: 'button.nut', thuocTinh: 'type', giaTri: 'button' },
        { moTa: 'Không còn phần tử nào khác button mang onclick', kiem: 'khong-ton-tai', selector: '[onclick]:not(button)' },
        { moTa: '"Chú ý:" nằm trong strong, không còn <b>', kiem: 'text', selector: 'section strong', giaTri: 'Chú ý:' },
        { moTa: 'Không còn <b>', kiem: 'khong-ton-tai', selector: 'b' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Từ bản vẽ khung tới trang tin tức ngữ nghĩa hoàn chỉnh, không một div',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['landmark đầy đủ', 'article lồng section', 'aside', 'dàn ý tiêu đề', 'time', 'chọn phần tử theo nghĩa'],
      tienQuyet: ['toàn bộ bài 2.1–2.3'],
      the: ['html', 'semantic', 'wireframe', 'tong-hop'],
      moTa: `<p>Nhà thiết kế đưa bạn bản vẽ khung (wireframe) của trang tin tức một bài. Không có mã khởi đầu nào ngoài bộ khung tài liệu. Bạn phải tự quyết định phần tử cho từng ô — và trang hoàn chỉnh <strong>không được dùng một ${c('<div>')} nào</strong>: mọi khối ở đây đều có một phần tử ngữ nghĩa hợp.</p>
${code(`
┌───────────────────────────────────────────────────────────┐
│ [logo.svg]  Tin Công Nghệ                    ← tên trang   │
│ Trang chủ · Lập trình · AI · Phần cứng       ← điều hướng  │
├──────────────────────────────────────────┬────────────────┤
│ CSS Grid tròn 10 tuổi        ← tên bài    │ Đọc nhiều      │
│ Hà Linh · 14/10/2026 09:30   ← tác giả,   │ • Flexbox 101  │
│                                 giờ đăng  │ • Git cho...   │
│ ─ Ra đời thế nào ─           ← phần 1    │ • ...          │
│   đoạn văn                                │ (3 liên kết)   │
│ ─ Ngày nay ─                 ← phần 2    │                │
│   đoạn văn                                │                │
│ [Chia sẻ]                    ← hành động  │                │
├──────────────────────────────────────────┴────────────────┤
│ © 2026 Tin Công Nghệ · Liên hệ               ← chân trang  │
└───────────────────────────────────────────────────────────┘
`)}`,
      yeuCau: [
        `Landmark cấp trang: ${c('<header>')} (logo + h1 "Tin Công Nghệ" + ${c('<nav>')} 4 liên kết), một ${c('<main>')}, ${c('<footer>')} — đúng thứ tự.`,
        `Bài viết là ${c('<article>')} trong main, có ${c('<header>')} riêng với ${c('<h2>')} tên bài, tác giả, và ${c('<time datetime="2026-10-14T09:30">')}.`,
        `Hai phần của bài là hai ${c('<section>')} có ${c('<h3>')}.`,
        `"Chia sẻ" là ${c('<button type="button">')} nằm trong article.`,
        `"Đọc nhiều" là ${c('<aside>')} trong main, ngoài article, có ${c('<h2>')} và danh sách 3 liên kết.`,
        `Logo là ${c('<img>')} có ${c('alt=""')} (chữ "Tin Công Nghệ" ngay cạnh đã nói tên) — hoặc alt mô tả nếu bạn để logo đứng một mình.`,
      ],
      dauVao: 'Chỉ có bộ khung tài liệu HTML.',
      dauRa: 'Một trang tin tức có đủ 5 loại landmark/khối (header, nav, main, article+section, aside, footer), dàn ý h1 → h2 → h3, không div.',
      rangBuoc: [
        'Không dùng <div> hay <span>.',
        'Đúng một h1, dàn ý không nhảy cấp.',
        'datetime có cả giờ: YYYY-MM-DDTHH:MM.',
        'Liên kết trong nav là 4 liên kết; trong aside là 3.',
      ],
      viDu: [{
        input: '<time datetime="2026-10-14T09:30">14/10/2026 09:30</time>',
        output: 'Người đọc: 14/10/2026 09:30 — máy: 2026-10-14 lúc 09:30',
        explanation: 'Chữ "T" ngăn ngày và giờ theo chuẩn ISO 8601.',
      }],
      goiY: [
        'Vẽ cây trước khi gõ: body → header(img, h1, nav) · main(article(header(h2, p+time), section(h3,p), section(h3,p), button), aside(h2, ul)) · footer(p). Mỗi ô trong bản vẽ đúng một nút.',
        'Tác giả + giờ đặt trong một <p> bên trong header của article: <p>Hà Linh · <time datetime="2026-10-14T09:30">14/10/2026 09:30</time></p>. Dấu "─ Ra đời thế nào ─" là tiêu đề h3 của section, không phải đường kẻ.',
      ],
      khoiDau: {
        'index.html': KHUNG('CSS Grid tròn 10 tuổi — Tin Công Nghệ', `    <!-- Dựng trang theo bản vẽ khung trong đề. Không dùng div/span. -->
    <h1>Tin Công Nghệ</h1>`),
      },
      loiGiai: {
        'index.html': KHUNG('CSS Grid tròn 10 tuổi — Tin Công Nghệ', `    <!-- banner của trang -->
    <header>
      <!-- logo đứng cạnh chữ tên trang ⇒ ảnh chỉ đệm, alt rỗng -->
      <img src="logo.svg" alt="" width="40" height="40">
      <h1>Tin Công Nghệ</h1>
      <nav>
        <a href="/">Trang chủ</a>
        <a href="/lap-trinh">Lập trình</a>
        <a href="/ai">AI</a>
        <a href="/phan-cung">Phần cứng</a>
      </nav>
    </header>

    <main>
      <!-- bài viết: đứng một mình vẫn trọn nghĩa -->
      <article>
        <header>
          <h2>CSS Grid tròn 10 tuổi</h2>
          <!-- datetime có giờ: chữ T ngăn ngày và giờ -->
          <p>Hà Linh · <time datetime="2026-10-14T09:30">14/10/2026 09:30</time></p>
        </header>
        <section>
          <h3>Ra đời thế nào</h3>
          <p>Đặc tả Grid được các trình duyệt lớn hỗ trợ cùng lúc vào năm 2017.</p>
        </section>
        <section>
          <h3>Ngày nay</h3>
          <p>Hầu hết bố cục trang hiện đại dùng Grid cho bộ khung và Flexbox bên trong.</p>
        </section>
        <!-- hành động ⇒ button -->
        <button type="button">Chia sẻ</button>
      </article>

      <!-- bên lề: liên quan nhưng không thuộc bài ⇒ ngoài article -->
      <aside>
        <h2>Đọc nhiều</h2>
        <ul>
          <li><a href="/bai/flexbox-101">Flexbox 101</a></li>
          <li><a href="/bai/git-cho-nguoi-moi">Git cho người mới</a></li>
          <li><a href="/bai/html-ngu-nghia">HTML ngữ nghĩa</a></li>
        </ul>
      </aside>
    </main>

    <!-- chân của CẢ TRANG -->
    <footer>
      <p>© 2026 Tin Công Nghệ · <a href="mailto:lienhe@vidu.com">Liên hệ</a></p>
    </footer>`),
      },
      giaiThich: `<p>Mỗi ô của bản vẽ có một câu hỏi: "nó là gì?" chứ không phải "nó nằm ở đâu?". Cột phải không phải là "sidebar" theo vị trí — nó là ${c('aside')} vì nội dung của nó là bên lề. "─ Ra đời thế nào ─" trông như đường kẻ nhưng là tiêu đề của một phần ⇒ ${c('section')} + ${c('h3')}. "Chia sẻ" là hành động ⇒ ${c('button')}.</p>
<p>Ràng buộc "không div" buộc bạn nghĩ về nghĩa của từng khối; trong dự án thật div vẫn hợp lệ cho hộp dàn trang (như bài 2.3 nói), nhưng ở trang này mọi khối đều có tên. Máy chấm kiểm 13 điều: landmark, thứ tự, dàn ý, datetime có giờ, số liên kết ở nav và aside, vị trí của aside và button.</p>`,
      loiHayGap: [
        `Dùng ${c('<h1>')} cho tên bài vì "nó là tiêu đề to nhất trong nội dung" — h1 đã là tên trang; tên bài là h2 (hoặc đổi thiết kế cho tên bài là h1 và tên trang thành phần tử khác — nhưng không bao giờ hai h1).`,
        `Đặt ${c('<aside>')} trong ${c('<article>')} vì nó "nằm cạnh bài" — vị trí trên màn hình là việc của CSS (bài 3.4).`,
        `Bọc tác giả + giờ trong ${c('<span>')} để "giữ một dòng" — ${c('<p>')} là đủ; xuống dòng hay không là chuyện CSS.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure',
      kiem: [
        { moTa: 'body có header → main → footer', kiem: 'thu-tu', cacSelector: ['body > header', 'body > main', 'body > footer'] },
        { moTa: 'header trang có h1 "Tin Công Nghệ"', kiem: 'text', selector: 'body > header > h1', giaTri: 'Tin Công Nghệ' },
        { moTa: 'nav trong header có 4 liên kết', kiem: 'so-luong', selector: 'body > header nav a', giaTri: 4 },
        { moTa: 'Đúng một main', kiem: 'so-luong', selector: 'main', giaTri: 1 },
        { moTa: 'main > article có header riêng với h2', kiem: 'ton-tai', selector: 'main > article > header > h2' },
        { moTa: 'Giờ đăng: time datetime="2026-10-14T09:30"', kiem: 'thuoc-tinh', selector: 'article > header time', thuocTinh: 'datetime', khop: '^2026-10-14T09:30(:00)?$' },
        { moTa: 'article có 2 section, mỗi cái có h3', kiem: 'so-luong', selector: 'article > section > h3', giaTri: 2 },
        { moTa: '"Chia sẻ" là button type="button" trong article', kiem: 'text', selector: 'article button[type="button"]', giaTri: 'Chia sẻ' },
        { moTa: 'aside trong main, ngoài article, có h2 + 3 liên kết', kiem: 'so-luong', selector: 'main > aside li a', giaTri: 3 },
        { moTa: 'aside không nằm trong article', kiem: 'khong-ton-tai', selector: 'article aside' },
        { moTa: 'Logo có thuộc tính alt', kiem: 'khong-ton-tai', selector: 'img:not([alt])' },
        { moTa: 'Không dùng div hay span', kiem: 'khong-ton-tai', selector: 'div, span' },
        { moTa: 'Một h1, dàn ý không nhảy cấp', kiem: 'tieu-de' },
      ],
    },
  ],
};
