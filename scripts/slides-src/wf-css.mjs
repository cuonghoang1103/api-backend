/** Web Foundations · Deck wf-css — Chương 3: CSS & responsive. */
import { code, F, FH } from './_wf-chung.mjs';

export const deck = { key: 'wf-css', code: 'WF · CH3', title: 'CSS & responsive', sub: 'Nền tảng Lập trình Web · Chương 3' };

export const slides = [
  { kind: 'cover', t: 'Chương 3 — CSS & thiết kế responsive', sub: 'Bộ chọn · Box model · Flexbox · Grid · Breakpoint',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>Hiểu chương này thì các class của Bootstrap ở FER202 không còn là phép thuật</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Bộ chọn, thuộc tính, và sự "xếp tầng"</li>
      <li>Box model — mọi phần tử là một cái hộp</li>
      <li>Flexbox — xếp theo hàng hoặc cột ⭐</li>
      <li>CSS Grid — dàn trang hai chiều</li>
      <li>Responsive — một trang, mọi màn hình ⭐⭐</li>
    </ol>` },

  { t: 'Ba cách gắn CSS — chỉ nên dùng một', body: `
    ${code(`<!-- 1. File riêng — CÁCH NÊN DÙNG -->
<link rel="stylesheet" href="style.css" />

<!-- 2. Trong thẻ style — chỉ khi thử nhanh -->
<style> p { color: red; } </style>

<!-- 3. Inline — tránh: khó sửa, khó ghi đè -->
<p style="color: red">Chữ đỏ</p>`, 'xml')}
    <div class="box">Tách ra file riêng thì một chỗ sửa, cả trang đổi. Inline thì phải đi sửa từng thẻ, và nó thắng mọi quy tắc khác nên rất khó ghi đè.</div>` },

  { t: 'Bộ chọn — bốn loại dùng nhiều nhất', body: `
    ${code(`p            { color: #333; }      /* theo TÊN THẺ — mọi thẻ p */
.card        { padding: 16px; }    /* theo CLASS — dùng nhiều nhất */
#tieu-de     { font-size: 32px; }  /* theo ID — duy nhất trên trang */
.card p      { margin: 0; }        /* p NẰM TRONG .card */
.card > p    { margin: 0; }        /* p là CON TRỰC TIẾP của .card */
a:hover      { color: blue; }      /* khi rê chuột */
input:focus  { outline: 2px solid; }/* khi đang gõ */`, 'css')}
    <div class="box ok">Gần như luôn dùng <b>class</b>. ID chỉ dành cho thứ duy nhất, và nó mạnh tới mức hay gây rắc rối khi cần ghi đè.</div>` },

  { t: 'Xếp tầng & độ ưu tiên — vì sao CSS "không ăn"', body: `
    <table class="t big2">
      <tr><th>Loại</th><th>Điểm ưu tiên</th></tr>
      <tr><td>Thẻ — <code>p</code></td><td>1</td></tr>
      <tr><td>Class — <code>.card</code></td><td>10</td></tr>
      <tr><td>ID — <code>#main</code></td><td>100</td></tr>
      <tr><td>Inline — <code>style="..."</code></td><td>1000</td></tr>
      <tr><td><code>!important</code></td><td>thắng hết — <b>đừng dùng</b></td></tr>
    </table>
    <div class="box warn">Điểm bằng nhau thì <b>quy tắc viết sau thắng</b>. Nên thứ tự file CSS quan trọng: đặt CSS của bạn SAU Bootstrap thì mới ghi đè được.</div>` },

  { t: 'Box model — và một dòng chữa hết mọi phiền', body: `
    ${code(`/* Mặc định: width chỉ tính phần nội dung.
   Thêm padding và border là hộp PHÌNH TO ra ngoài số bạn đặt. */
.hop { width: 200px; padding: 20px; border: 2px solid; }
/* → chiếm thật 244px */

/* Đặt dòng này ở đầu mọi dự án: */
*, *::before, *::after { box-sizing: border-box; }
/* → giờ width: 200px NGHĨA LÀ 200px, padding tính vào trong */`, 'css')}
    <div class="box ok">Mọi framework hiện đại (kể cả Bootstrap) đều đặt <code>border-box</code> sẵn. Biết vì sao thì lúc tự viết CSS bạn không mất buổi chiều đi tìm 44px thừa.</div>` },

  { t: `Flexbox — xếp theo MỘT chiều ${F()}`, body: `
    ${code(`.hang {
  display: flex;               /* con xếp thành HÀNG NGANG */
  flex-direction: row;         /* đổi thành column là xếp DỌC */
  justify-content: space-between; /* dàn theo TRỤC CHÍNH (ngang) */
  align-items: center;         /* canh theo TRỤC PHỤ (dọc) */
  gap: 16px;                   /* khoảng cách giữa các con */
  flex-wrap: wrap;             /* chật thì xuống dòng */
}`, 'css')}
    <div class="grid2">
      <div class="f"><b>justify-content</b><br/>flex-start · center · space-between · space-around</div>
      <div class="f"><b>align-items</b><br/>stretch · center · flex-start · flex-end</div>
    </div>
    <div class="box">${F()} Bootstrap gói đúng cái này thành class: <code>d-flex</code>, <code>justify-content-between</code>, <code>align-items-center</code>, <code>gap-2</code>.</div>` },

  { t: 'Canh giữa — bài toán kinh điển', body: `
    ${code(`/* Canh giữa cả ngang lẫn dọc — ba dòng */
.giua {
  display: flex;
  justify-content: center;   /* giữa theo ngang */
  align-items: center;       /* giữa theo dọc */
  min-height: 100vh;         /* cao bằng màn hình */
}

/* Canh giữa một khối theo chiều ngang, cách cũ vẫn dùng */
.hop { max-width: 900px; margin: 0 auto; }`, 'css')}
    <div class="box ok">Học Flexbox nhanh nhất bằng <b>flexboxfroggy.com</b> — 24 màn chơi, khoảng 30 phút, nhớ lâu hơn đọc lý thuyết nhiều.</div>` },

  { t: 'CSS Grid — dàn trang HAI chiều', body: `
    ${code(`.luoi {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 cột đều nhau */
  gap: 20px;
}

/* Responsive KHÔNG cần media query: */
.tu-dong {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}`, 'css')}
    <div class="two">
      <div class="card"><b>Flexbox</b><p>Một chiều — một hàng hoặc một cột. Hợp với thanh nav, nhóm nút.</p></div>
      <div class="card"><b>Grid</b><p>Hai chiều — hàng và cột cùng lúc. Hợp với dàn cả trang, lưới thẻ.</p></div>
    </div>` },

  { t: `Responsive — mobile first ${FH()}`, body: `
    ${code(`/* Viết cho ĐIỆN THOẠI trước — không cần media query */
.the { width: 100%; }

/* Rồi mới thêm cho màn to hơn */
@media (min-width: 768px)  { .the { width: 50%; } }
@media (min-width: 1200px) { .the { width: 33.33%; } }`, 'css')}
    <table class="t">
      <tr><th>Breakpoint Bootstrap 5</th><th>Từ</th></tr>
      <tr><td>sm</td><td>576px</td></tr>
      <tr><td>md</td><td>768px</td></tr>
      <tr><td>lg</td><td>992px</td></tr>
      <tr><td>xl · xxl</td><td>1200px · 1400px</td></tr>
    </table>
    <div class="box">${F()} <code>col-12 col-md-8</code> nghĩa là "mặc định chiếm 12/12; từ 768px trở lên chiếm 8/12" — chính là media query đóng gói sẵn.</div>` },

  { t: 'Đơn vị — dùng cái nào khi nào', body: `
    <table class="t big2">
      <tr><th>Đơn vị</th><th>Nghĩa</th><th>Dùng cho</th></tr>
      <tr><td><code>px</code></td><td>Cố định</td><td>Viền, bo góc</td></tr>
      <tr><td><code>rem</code></td><td>Theo cỡ chữ gốc (16px)</td><td>Cỡ chữ, khoảng cách — co giãn theo cài đặt người dùng</td></tr>
      <tr><td><code>%</code></td><td>Theo phần tử cha</td><td>Chiều rộng</td></tr>
      <tr><td><code>vh / vw</code></td><td>Theo màn hình</td><td>Khối cao bằng màn hình</td></tr>
      <tr><td><code>fr</code></td><td>Phần còn lại (chỉ Grid)</td><td>Chia cột</td></tr>
    </table>` },

  { t: 'Biến CSS — đổi màu cả trang bằng một dòng', body: `
    ${code(`:root {
  --mau-chinh: #1b5fa8;
  --khoang-cach: 16px;
}

.nut   { background: var(--mau-chinh); padding: var(--khoang-cach); }
.tieude{ color: var(--mau-chinh); }

/* Chế độ tối: khai lại đúng những biến đó */
@media (prefers-color-scheme: dark) {
  :root { --mau-chinh: #7ab8f5; }
}`, 'css')}
    <div class="box ok">Đây là cách làm chế độ sáng/tối mà không phải viết lại toàn bộ CSS: chỉ khai lại giá trị biến.</div>` },

  { t: 'Bốn lỗi CSS hay gặp', body: `
    <div class="grid2">
      <div class="f"><b>Sửa mà không ăn</b><br/>Quy tắc khác ưu tiên cao hơn → F12 → Elements xem cái nào bị gạch</div>
      <div class="f"><b>Hộp to hơn số đã đặt</b><br/>Thiếu <code>box-sizing: border-box</code></div>
      <div class="f"><b>Không responsive trên điện thoại</b><br/>Thiếu <code>meta viewport</code> trong HTML</div>
      <div class="f"><b>Khoảng trắng thừa dưới ảnh</b><br/>Ảnh là inline → thêm <code>display: block</code></div>
    </div>
    <div class="box ok">Công cụ gỡ CSS tốt nhất: <b>F12 → Elements</b>. Cột bên phải liệt kê mọi quy tắc đang áp, cái nào bị thắng thì bị gạch ngang.</div>` },

  { t: 'Tự luyện', body: `
    <div class="steps">
      <div><span class="n">1</span><span>Lấy trang HTML bạn viết ở chương 2, thêm CSS: đặt <code>border-box</code>, chọn phông và màu chữ.</span></div>
      <div><span class="n">2</span><span>Dùng Flexbox dựng thanh nav: logo bên trái, menu bên phải, canh giữa theo chiều dọc.</span></div>
      <div><span class="n">3</span><span>Dùng Grid dựng lưới 3 thẻ, dùng <code>auto-fit</code> để nó tự xuống 1 cột trên màn hẹp.</span></div>
      <div><span class="n">4</span><span>Kéo hẹp cửa sổ, kiểm layout đổi ở đúng 768px.</span></div>
      <div><span class="n">5</span><span>Khai ba biến CSS cho màu và dùng lại ở ít nhất ba chỗ.</span></div>
    </div>` },
];
