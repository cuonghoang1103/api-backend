/** Web Foundations · Deck wf-html — Chương 2: HTML. */
import { code, F, FH } from './_wf-chung.mjs';

export const deck = { key: 'wf-html', code: 'WF · CH2', title: 'HTML', sub: 'Nền tảng Lập trình Web · Chương 2' };

export const slides = [
  { kind: 'cover', t: 'Chương 2 — HTML', sub: 'Cấu trúc của mọi trang web',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>JSX của React là HTML với vài luật khác — học chắc chương này thì JSX gần như miễn phí</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Phần tử, thẻ, thuộc tính</li>
      <li>Chữ, liên kết, ảnh</li>
      <li>Cấu trúc ngữ nghĩa ⭐</li>
      <li>Biểu mẫu — cách web thu dữ liệu ⭐⭐</li>
      <li>Bảng, media và khả năng tiếp cận</li>
    </ol>` },

  { t: 'Một phần tử HTML gồm gì', body: `
    ${code(`<a href="https://cuongthai.com" target="_blank">Trang chủ</a>
 │   │                                │              │       │
 │   └─ thuộc tính (attribute)        │              │       └─ thẻ đóng
 └─ tên thẻ                           │              └─ nội dung
                                      └─ thuộc tính thứ hai`, 'xml')}
    ${code(`<img src="anh.jpg" alt="Mô tả ảnh" />   <!-- thẻ RỖNG: tự đóng -->
<br />                                  <!-- xuống dòng -->
<input type="text" />                   <!-- ô nhập -->`, 'xml')}
    <div class="box">${F()} Trong JSX mọi thẻ rỗng <b>bắt buộc</b> tự đóng: <code>&lt;br /&gt;</code> chứ không phải <code>&lt;br&gt;</code>.</div>` },

  { t: 'Bộ khung một trang', body: `
    ${code(`<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Tiêu đề hiện trên tab</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Nội dung người dùng nhìn thấy</h1>
    <script src="app.js"></script>
  </body>
</html>`, 'xml', 'sm')}
    <div class="box warn">Thiếu <code>meta viewport</code> thì trang <b>không responsive</b> trên điện thoại — dù CSS đã viết đúng. Đây là lỗi im lặng hay gặp nhất khi làm giao diện di động.</div>` },

  { t: 'Chữ, liên kết, ảnh', body: `
    ${code(`<h1>Tiêu đề lớn nhất</h1>   <!-- MỖI TRANG chỉ nên có MỘT h1 -->
<h2>Tiêu đề mục</h2>         <!-- đi đúng thứ tự h1 → h2 → h3 -->
<p>Một đoạn văn.</p>
<strong>quan trọng</strong> · <em>nhấn mạnh</em>

<ul><li>Không thứ tự</li></ul>
<ol><li>Có thứ tự</li></ol>

<a href="/gioi-thieu">Liên kết nội bộ</a>
<a href="https://x.com" target="_blank" rel="noopener">Mở tab mới</a>

<img src="/anh/pizza.jpg" alt="Pizza hải sản trên khay gỗ" />`, 'xml', 'sm')}
    <div class="box">Thuộc tính <code>alt</code> không phải để trang trí: người khiếm thị nghe nó, và nó hiện ra khi ảnh hỏng. Ảnh trang trí thuần thì để <code>alt=""</code>.</div>` },

  { t: 'Thẻ ngữ nghĩa — đặt tên đúng cho từng vùng', body: `
    ${code(`<header>  <!-- đầu trang: logo, menu -->
<nav>     <!-- khối điều hướng -->
<main>    <!-- nội dung chính — MỘT trang một cái -->
<section> <!-- một mục có tiêu đề -->
<article> <!-- nội dung đứng riêng được: bài viết, thẻ sản phẩm -->
<aside>   <!-- nội dung phụ: sidebar -->
<footer>  <!-- chân trang -->`, 'xml')}
    <div class="two">
      <div class="card"><b>Vì sao không dùng div hết</b><p>Google đọc cấu trúc để hiểu trang. Trình đọc màn hình nhảy theo vùng. Và mã dễ đọc hơn hẳn.</p></div>
      <div class="card"><b>Khi nào dùng div</b><p>Khi chỉ cần một cái hộp để gom lại cho CSS — không mang ý nghĩa gì.</p></div>
    </div>` },

  { t: `Biểu mẫu — phần quan trọng nhất chương này ${FH()}`, body: `
    ${code(`<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="lop">Lớp</label>
  <select id="lop" name="lop">
    <option value="">-- Chọn --</option>
    <option value="SE2059">SE2059</option>
  </select>

  <textarea name="loi-nhan" rows="3"></textarea>

  <input type="checkbox" id="ok" name="ok" />
  <label for="ok">Đồng ý</label>

  <button type="submit">Gửi</button>
</form>`, 'xml', 'sm')}
    <div class="box ok"><code>label</code> phải có <code>for</code> trỏ đúng <code>id</code> của ô. Làm vậy thì bấm vào chữ cũng focus được ô — và trình đọc màn hình mới biết ô đó tên gì.</div>` },

  { t: 'Các loại input hay dùng', body: `
    <div class="grid2">
      <div class="f"><b>text</b> · chữ thường</div>
      <div class="f"><b>email</b> · bàn phím có @ trên điện thoại</div>
      <div class="f"><b>password</b> · che ký tự</div>
      <div class="f"><b>number</b> · chỉ số</div>
      <div class="f"><b>date</b> · lịch chọn ngày</div>
      <div class="f"><b>file</b> · tải tệp lên</div>
      <div class="f"><b>checkbox</b> · chọn nhiều</div>
      <div class="f"><b>radio</b> · chọn một (chung <code>name</code>)</div>
    </div>
    <div class="box warn">${F()} Ô input <b>luôn trả về chuỗi</b>, kể cả <code>type="number"</code>. Trong React nhớ <code>Number(e.target.value)</code> trước khi tính toán.</div>` },

  { t: `HTML khác JSX ở bốn chỗ ${F()}`, body: `
    <table class="t big2">
      <tr><th>HTML</th><th>JSX (React)</th></tr>
      <tr><td><code>class="card"</code></td><td><code>className="card"</code></td></tr>
      <tr><td><code>for="email"</code></td><td><code>htmlFor="email"</code></td></tr>
      <tr><td><code>&lt;br&gt;</code> để trần được</td><td><code>&lt;br /&gt;</code> bắt buộc tự đóng</td></tr>
      <tr><td>Trả nhiều thẻ ngang hàng được</td><td>Phải bọc trong một thẻ gốc hoặc <code>&lt;&gt;...&lt;/&gt;</code></td></tr>
      <tr><td><code>onclick="f()"</code></td><td><code>onClick={f}</code> — camelCase, truyền HÀM</td></tr>
    </table>
    <div class="box ok">Nắm bảng này là bạn đã biết 90% JSX rồi. Nó đúng là HTML với vài luật của JavaScript.</div>` },

  { t: 'Bảng và media', body: `
    ${code(`<table>
  <thead><tr><th>Món</th><th>Giá</th></tr></thead>
  <tbody><tr><td>Margherita</td><td>149.000đ</td></tr></tbody>
</table>

<video src="phim.mp4" controls width="600"></video>
<audio src="tieng.mp3" controls></audio>`, 'xml')}
    <div class="box warn">Bảng chỉ dùng cho <b>dữ liệu dạng bảng</b>. Dùng bảng để dàn trang là lối làm từ những năm 2000 — giờ dùng Flexbox/Grid (chương 3).</div>` },

  { t: 'Khả năng tiếp cận — bốn việc rẻ mà hiệu quả', body: `
    <div class="steps">
      <div><span class="n">1</span><span>Mọi ảnh có <code>alt</code>. Ảnh trang trí thì <code>alt=""</code>.</span></div>
      <div><span class="n">2</span><span>Mọi ô nhập có <code>&lt;label&gt;</code> gắn đúng <code>id</code>.</span></div>
      <div><span class="n">3</span><span>Tiêu đề đi đúng bậc: <code>h1 → h2 → h3</code>, không nhảy cóc vì chữ trông to hơn.</span></div>
      <div><span class="n">4</span><span>Dùng <code>&lt;button&gt;</code> cho nút, không dùng <code>&lt;div onclick&gt;</code> — nút thật bấm được bằng phím Tab và Enter.</span></div>
    </div>` },

  { t: 'Tự luyện', body: `
    <div class="steps">
      <div><span class="n">1</span><span>Viết một trang có <code>header / nav / main / footer</code>, một <code>h1</code>, hai đoạn văn và một ảnh có <code>alt</code>.</span></div>
      <div><span class="n">2</span><span>Thêm form liên hệ: họ tên, email, lớp (select), lời nhắn (textarea), checkbox đồng ý, nút Gửi. Mỗi ô một <code>label</code>.</span></div>
      <div><span class="n">3</span><span>Mở bằng Chrome, nhấn <b>F12 → Elements</b>, tìm đúng phần tử mình vừa viết trong cây DOM.</span></div>
      <div><span class="n">4</span><span>Cố ý xoá một thẻ đóng rồi xem trang vỡ thế nào — nhớ cảm giác đó, sau này gặp lại sẽ đoán ra ngay.</span></div>
    </div>` },
];
