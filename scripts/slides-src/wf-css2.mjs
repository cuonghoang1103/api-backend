/** Web Foundations · Deck wf-css2 — Chương 12: CSS nâng cao. */
import { code, F } from './_wf-chung.mjs';

export const deck = { key: 'wf-css2', code: 'WF · CH12', title: 'CSS nâng cao', sub: 'Nền tảng Lập trình Web · Chương 12' };

export const slides = [
  { kind: 'cover', t: 'Chương 12 — CSS nâng cao', sub: 'Position & stacking context · Transition & animation · Kiến trúc CSS · Token',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Position và ngữ cảnh xếp chồng</li>
      <li>Transition và animation — và hiệu năng ⭐</li>
      <li>Đặt tên và tổ chức CSS (BEM)</li>
      <li>Token thiết kế và chế độ sáng/tối</li>
    </ol>` },

  { t: 'Năm giá trị của position', body: `
    <table class="t big2">
      <tr><th>Giá trị</th><th>Nghĩa</th></tr>
      <tr><td><code>static</code></td><td>Mặc định. <code>top/left</code> không có tác dụng.</td></tr>
      <tr><td><code>relative</code></td><td>Vẫn trong dòng chảy, dịch được — và làm MỐC cho con absolute.</td></tr>
      <tr><td><code>absolute</code></td><td>Rời dòng chảy. Neo vào tổ tiên gần nhất KHÔNG static.</td></tr>
      <tr><td><code>fixed</code></td><td>Neo vào khung nhìn. Cuộn vẫn đứng yên.</td></tr>
      <tr><td><code>sticky</code></td><td>Bình thường tới ngưỡng thì dính. PHẢI có <code>top</code>.</td></tr>
    </table>
    <div class="box warn">Phần tử absolute bay lên góc trang = không tổ tiên nào được định vị. Thêm <code>position: relative</code> vào đúng cái hộp muốn neo vào.</div>` },

  { t: 'Vì sao z-index: 9999 vẫn thua', body: `
    ${code(`.modal   { z-index: 9999; }   /* mà vẫn nằm DƯỚI */
.lop-phu { z-index: 1; }`, 'css')}
    <p class="lead2"><code>z-index</code> chỉ so sánh trong <b>CÙNG một ngữ cảnh xếp chồng</b>. Cha của modal đã tạo ngữ cảnh riêng ⇒ 9999 chỉ là 9999 <i>bên trong cha đó</i>.</p>
    ${code(`/* Thứ ÂM THẦM tạo ngữ cảnh xếp chồng: */
position: fixed | sticky
position: relative/absolute + z-index khác auto
opacity nhỏ hơn 1
transform, filter, perspective, will-change`, 'css', 'sm')}
    <div class="box warn">Thêm <code>transform</code> cho hiệu ứng hover là dropdown hôm qua còn chạy nay hiện ra sau phần tử bên cạnh. Khi z-index "không ăn", soi <b>TỔ TIÊN</b>, đừng soi chính phần tử.</div>` },

  { t: 'Thang z-index có tên', body: `
    ${code(`:root {
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    300;
  --z-toast:    400;
}`, 'css')}
    <div class="box ok">Một trang mà mọi z-index đều là 9999 là trang không ai suy luận được về thứ tự lớp nữa. Bốn mức có tên hơn hẳn bốn mươi con số ngẫu nhiên. Và vẽ lớp phủ ở <b>tầng trên cùng</b> — React làm việc này bằng <code>createPortal</code>.</div>` },

  { t: 'Transition', body: `
    ${code(`.nut {
  transition: background 200ms ease, transform 200ms ease;
}
.nut:hover { transform: translateY(-2px); }
/* thứ tự: thuộc-tính  thời-lượng  gia-tốc  độ-trễ */`, 'css')}
    <div class="grid2">
      <div class="f"><b>150–250ms</b><br/>Khoảng đẹp cho hover</div>
      <div class="f"><b>ease-out</b><br/>Mặc định tốt cho thứ đang xuất hiện</div>
    </div>
    <div class="box warn">⛔ Đừng dùng <code>transition: all</code> — nó làm động cả thuộc tính bố cục bạn không định, và đó là nguồn của hiện tượng giật khó hiểu.</div>` },

  { t: `Chỉ HAI thuộc tính là rẻ để làm động ${F()}`, body: `
    ${code(`/* ✅ NHANH — bộ hợp thành lo, không tính lại bố cục */
transform   (translate, scale, rotate)
opacity

/* ❌ CHẬM — buộc đo lại cả trang MỖI khung hình */
width  height  top  left  margin  padding  font-size`, 'css')}
    <div class="box ok">Làm động <code>left</code> = tính lại bố cục 60 lần/giây. Làm động <code>transform: translateX()</code> = GPU dịch một lớp đã vẽ sẵn. Nhìn giống hệt, chi phí khác một trời một vực.</div>
    ${code(`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`, 'css', 'sm')}` },

  { t: 'BEM — Block, Element, Modifier', body: `
    ${code(`.card              /* Block: một thứ đứng độc lập */
.card__title       /* Element: bộ phận — HAI gạch dưới */
.card--featured    /* Modifier: biến thể — HAI gạch ngang */`, 'css')}
    ${code(`/* ❌ sâu và mong manh */
.page .content .card .card-body h3 { font-size: 20px; }

/* ✅ phẳng — một class, dễ ghi đè */
.card__title { font-size: 20px; }`, 'css', 'sm')}
    <div class="box">Tên dài là chủ đích: <code>.card__title</code> chỉ mang đúng một nghĩa và grep ra được. Còn <code>.title</code> sẽ đụng với thứ gì đó trong vòng một tháng.</div>` },

  { t: 'Ba cách cô lập CSS', body: `
    <div class="grid3">
      <div class="card"><b>BEM viết tay</b><p>Chạy ở đâu cũng được, không cần công cụ. Cần kỷ luật.</p></div>
      <div class="card"><b>CSS Modules</b><p>Công cụ dựng tự đổi tên class ⇒ không thể đụng nhau. Có sẵn trong CRA.</p></div>
      <div class="card"><b>Class tiện ích</b><p>Tailwind, Bootstrap <code>d-flex p-3</code>. Không đặt tên gì cả.</p></div>
    </div>
    <div class="box warn">Ví dụ CÓ THẬT từ chính trang này: một file CSS có <code>.card</code> và <code>button</code> ở phạm vi toàn cục — hai cái tên đó cũng là của Bootstrap, nên mọi card mất viền và mọi nút mất màu, ở những trang chẳng liên quan gì. Tên chung chung toàn cục không phải vấn đề nhỏ; nó <b>chính là</b> vấn đề.</div>` },

  { t: 'Token thiết kế — hai tầng', body: `
    ${code(`:root {
  /* nguyên thuỷ — tên theo nó LÀ GÌ */
  --blue-600: #1b5fa8;

  /* ngữ nghĩa — tên theo nó DÙNG ĐỂ LÀM GÌ */
  --color-primary: var(--blue-600);
  --color-surface: #ffffff;
  --color-text:    #11243d;
}
.btn { background: var(--color-primary); }`, 'css')}
    <div class="box">Đổi màu thương hiệu thì sửa MỘT dòng. Thêm chế độ tối thì chỉ khai lại tầng ngữ nghĩa.</div>` },

  { t: 'Chế độ tối làm cho tử tế', body: `
    ${code(`/* 1. theo hệ điều hành */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface: #11151b;
    --color-text:    #e6edf3;
  }
}
/* 2. cho người dùng ghi đè */
:root[data-theme="dark"] { --color-surface: #11151b; }`, 'css')}
    ${code(`document.documentElement.dataset.theme = 'dark';   // cái công tắc`, 'javascript', 'sm')}
    <div class="box warn">Khai lại <b>token</b>, đừng chép lại 400 quy tắc. Và nhớ đặt <code>background</code> rõ ràng cho <code>body</code> — thiếu nó thì chữ sáng rơi trên nền trắng mặc định.</div>` },

  { t: 'Tự luyện', body: `
    <div class="steps">
      <div><span class="n">1</span><span>Dựng một thẻ card có nhãn "MỚI" ở góc — dùng <code>relative</code> + <code>absolute</code>.</span></div>
      <div><span class="n">2</span><span>Cố ý thêm <code>transform: scale(1.02)</code> vào cha rồi xem dropdown bị che thế nào.</span></div>
      <div><span class="n">3</span><span>Làm một nút có hiệu ứng hover CHỈ dùng <code>transform</code> và <code>opacity</code>.</span></div>
      <div><span class="n">4</span><span>Đổi tên class của card sang BEM đầy đủ.</span></div>
      <div><span class="n">5</span><span>Khai 6 token màu rồi làm chế độ tối chỉ bằng cách khai lại chúng.</span></div>
    </div>` },
];
