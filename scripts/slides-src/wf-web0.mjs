/** Web Foundations · Deck wf-web0 — Mục 0: Giới thiệu, nền tảng & cài đặt. */
import { code, F } from './_wf-chung.mjs';

export const deck = { key: 'wf-web0', code: 'WF · MỤC 0', title: 'Giới thiệu & nền tảng', sub: 'Nền tảng Lập trình Web · Mục 0' };

export const slides = [
  { kind: 'cover', t: 'Mục 0 — Bắt đầu từ đâu', sub: 'Web hoạt động thế nào · Cài máy · Cách học để không bỏ cuộc',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com</p>` },

  { t: 'Nội dung', body: `
    <ol class="toc">
      <li>Khoá này cho ai, và học xong làm được gì</li>
      <li>Một trang web hiện ra như thế nào</li>
      <li>Client và Server — hai vai, một cuộc đối thoại</li>
      <li>Frontend · Backend · Full-stack</li>
      <li>Cài máy: bốn phần mềm miễn phí</li>
      <li>Cách học để không bỏ cuộc</li>
    </ol>` },

  { t: 'Khoá này dành cho ai', body: `
    <div class="two">
      <div class="card"><b>Đúng người</b><p>Bạn từng mở một khoá React/Node và thấy "chả hiểu gì". Thường không phải vì bạn kém — mà vì khoá đó mặc định bạn đã biết HTML/CSS/JS.</p></div>
      <div class="card"><b>Học xong làm được</b><p>Đọc hiểu mã web, tự dựng một trang có form và gọi API, và <b>theo kịp môn FER202</b> mà không phải đoán.</p></div>
    </div>
    <div class="box ok">Không cần biết lập trình trước. Chỉ cần một máy tính nối mạng và chịu khó gõ lại từng ví dụ.</div>` },

  { t: 'Gõ một địa chỉ — rồi chuyện gì xảy ra?', body: `
    <div class="dg">
      <div class="bx">Trình duyệt</div><div class="ar">→<small>tên miền?</small></div>
      <div class="bx ext">DNS</div><div class="ar">→<small>địa chỉ IP</small></div>
      <div class="bx">Server</div><div class="ar">→<small>HTML/CSS/JS</small></div>
      <div class="bx st">Trang hiện ra</div>
    </div>
    <div class="steps">
      <div><span class="n">1</span><span><b>DNS</b> đổi <code>cuongthai.com</code> thành một địa chỉ IP — như tra danh bạ.</span></div>
      <div><span class="n">2</span><span>Trình duyệt gửi một <b>HTTP request</b> tới máy chủ ở địa chỉ đó.</span></div>
      <div><span class="n">3</span><span>Máy chủ trả về <b>HTML</b>; trình duyệt đọc rồi tải tiếp CSS, JS, ảnh.</span></div>
      <div><span class="n">4</span><span>Trình duyệt <b>dựng</b> trang và chạy JavaScript.</span></div>
    </div>` },

  { t: 'Client và Server', body: `
    <div class="two">
      <div class="card"><b>Client — máy bạn</b><p>Trình duyệt. Chạy HTML, CSS, JavaScript. Thấy được, xem được mã nguồn. <b>Không tin được.</b></p></div>
      <div class="card"><b>Server — máy ở xa</b><p>Giữ dữ liệu thật, kiểm tra mật khẩu, quyết định ai được xem gì. Người dùng không sửa được.</p></div>
    </div>
    <div class="box warn">Hệ quả quan trọng: <b>mọi thứ chạy ở client đều có thể bị sửa</b>. Kiểm tra dữ liệu ở trình duyệt là để người dùng đỡ khó chịu, KHÔNG phải để bảo mật — server vẫn phải kiểm lại.</div>` },

  { t: 'Frontend · Backend · Full-stack', body: `
    <div class="grid3">
      <div class="card"><b>Frontend</b><p>Phần người dùng nhìn thấy<br/>HTML · CSS · JavaScript · React</p></div>
      <div class="card"><b>Backend</b><p>Phần chạy trên máy chủ<br/>Node.js · API · cơ sở dữ liệu</p></div>
      <div class="card"><b>Full-stack</b><p>Làm được cả hai đầu<br/>và hiểu chỗ chúng gặp nhau</p></div>
    </div>
    <div class="box">${F()} FER202 là môn <b>frontend</b>: React chạy trong trình duyệt. Nhưng chương 6–8 của khoá này (HTTP, API, dữ liệu) vẫn cần — vì React phải nói chuyện với backend.</div>` },

  { t: 'Bốn phần mềm cần cài (đều miễn phí)', body: `
    <table class="t">
      <tr><th>Phần mềm</th><th>Để làm gì</th><th>Tải ở</th></tr>
      <tr><td><b>Trình duyệt Chrome</b></td><td>Chạy trang + DevTools (F12)</td><td>google.com/chrome</td></tr>
      <tr><td><b>VS Code</b></td><td>Trình soạn mã</td><td>code.visualstudio.com</td></tr>
      <tr><td><b>Node.js (LTS)</b></td><td>Chạy JS ngoài trình duyệt + npm</td><td>nodejs.org</td></tr>
      <tr><td><b>Git</b></td><td>Lưu phiên bản mã, đẩy lên GitHub</td><td>git-scm.com</td></tr>
    </table>
    <div class="box">Chọn bản <b>LTS</b> của Node, không lấy Current — LTS ổn định và được vá lâu dài.</div>` },

  { t: 'Kiểm đã cài xong chưa', body: `
    ${code(`node -v      # v22.x.x   ← Node đã cài và nằm trong PATH
npm -v       # 10.x.x    ← npm đi kèm Node
git --version # git version 2.x.x`, 'bash')}
    <div class="box warn">Báo <code>command not found</code> dù vừa cài? <b>Đóng terminal rồi mở lại</b> — cửa sổ đang mở vẫn giữ PATH cũ. Đây là lỗi bị hiểu nhầm nhiều nhất khi mới bắt đầu.</div>` },

  { t: 'DevTools — công cụ bạn sẽ dùng mỗi ngày', body: `
    <table class="t">
      <tr><th>Tab</th><th>Dùng để</th></tr>
      <tr><td><b>Console</b></td><td>Xem lỗi JavaScript · gõ thử một dòng mã</td></tr>
      <tr><td><b>Elements</b></td><td>Xem HTML thật của trang · sửa thử CSS tại chỗ</td></tr>
      <tr><td><b>Network</b></td><td>Xem từng request: URL, mã trạng thái, thời gian, kích thước</td></tr>
      <tr><td><b>Application</b></td><td>Cookie, localStorage — chương 7 dùng nhiều</td></tr>
    </table>
    <div class="box ok">Mở bằng <b>F12</b>. Gặp lỗi thì mở Console đọc <b>dòng đầu tiên</b> trước — nó có tên file và số dòng. Đoán mò trước khi đọc lỗi là cách chậm nhất.</div>` },

  { t: 'Cách học để không bỏ cuộc', body: `
    <div class="steps">
      <div><span class="n">1</span><span><b>Gõ lại bằng tay</b>, đừng copy. Gõ tay ép mắt đọc từng ký tự — đó là lúc bạn phát hiện mình chưa hiểu chỗ nào.</span></div>
      <div><span class="n">2</span><span><b>Cố ý phá</b>. Xoá một dấu chấm phẩy, đổi tên biến, bỏ một thẻ đóng — rồi xem lỗi trông như thế nào.</span></div>
      <div><span class="n">3</span><span><b>Tự làm một biến thể</b> không nhìn bài mẫu. Làm được mới tính là hiểu.</span></div>
      <div><span class="n">4</span><span><b>Mỗi ngày một ít còn hơn một buổi dài.</b> 45 phút đều đặn thắng 6 tiếng cuối tuần.</span></div>
    </div>` },

  { t: 'Bản đồ cả khoá', body: `
    <table class="t big2">
      <tr><th>Chương</th><th>Nội dung</th><th>FER202?</th></tr>
      <tr><td>0–1</td><td>Web hoạt động thế nào · công cụ</td><td>nền chung</td></tr>
      <tr><td>2–3</td><td>HTML · CSS</td><td>⭐ JSX &amp; Bootstrap</td></tr>
      <tr><td><b>4–5</b></td><td><b>JavaScript · bất đồng bộ</b></td><td><b>⭐⭐ quan trọng nhất</b></td></tr>
      <tr><td>6–7</td><td>HTTP &amp; API · xác thực</td><td>⭐ gọi API, đăng nhập</td></tr>
      <tr><td>8–10</td><td>SQL · TypeScript · tư duy &amp; gỡ lỗi</td><td>dùng về sau</td></tr>
    </table>
    <div class="box ok">Đang gấp vì môn FER202? Học <b>chương 4 và 5 trước</b>, rồi quay lại 2–3. Hai chương đó là phần React dựa vào nhiều nhất.</div>` },
];
