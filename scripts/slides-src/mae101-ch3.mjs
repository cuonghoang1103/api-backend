/** MAE101 · Deck mae3 — Chapter 3: Applications of Derivatives. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae3', code: 'MAE3', title: 'Chapter 3 — Applications of Derivatives', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 3 — Applications of Derivatives', sub: 'Ứng dụng đạo hàm · Tốc độ, cực trị, tối ưu hoá, vẽ đồ thị',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Stewart — <i>Essential Calculus</i>, Ch. 3–4</p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Tốc độ liên quan &amp; xấp xỉ tuyến tính</li>
      <li>Cực trị &amp; điểm tới hạn</li>
      <li>Định lý Rolle &amp; Giá trị trung bình</li>
      <li>Tăng/giảm, lồi/lõm &amp; khảo sát hàm số</li>
      <li>Tối ưu hoá &amp; quy tắc L'Hôpital</li>
      <li>Phương pháp Newton &amp; nguyên hàm</li>
    </ol>` },

  { t: 'Related Rates · Tốc độ liên quan', body: `
    <p class="lead2">Hai (hay nhiều) đại lượng biến thiên theo <b>thời gian</b>, liên hệ bởi một phương trình — biết tốc độ này, tìm tốc độ kia.</p>
    <ol class="big">
      <li>Vẽ hình, đặt tên biến &amp; đạo hàm theo t đã biết/cần tìm</li>
      <li>Viết phương trình liên hệ các biến</li>
      <li>Đạo hàm hai vế theo t (Chain Rule)</li>
      <li>Thay số liệu <b>tại thời điểm cụ thể</b></li>
      <li>Giải ra tốc độ cần tìm</li>
    </ol>
    <div class="box warn">Chỉ thay số <b>sau khi</b> đạo hàm — thay sớm sẽ mất biến.</div>` },

  { t: 'Related Rates — Example · Ví dụ thang trượt', body: `
    <p class="lead2">Thang dài 10m tựa tường, chân thang trượt ra với ${k('dx/dt = 1')} m/s. Khi ${k('x=6')}m, tìm ${k('dy/dt')}.</p>
    <div class="steps">
      <div><span class="n">1</span> Liên hệ: ${k('x^2+y^2=10^2=100')}</div>
      <div><span class="n">2</span> Đạo hàm theo t: ${k('2x\\frac{dx}{dt}+2y\\frac{dy}{dt}=0')}</div>
      <div><span class="n">3</span> Tại ${k('x=6')}: ${k('y=\\sqrt{100-36}=8')}</div>
      <div><span class="n">4</span> Thay: ${k('6(1)+8\\frac{dy}{dt}=0 \\Rightarrow \\frac{dy}{dt}=-0.75')} m/s</div>
    </div>
    <div class="box ok">Đỉnh thang trượt <b>xuống</b> với tốc độ 0.75 m/s.</div>` },

  { t: 'Linear Approximation & Differentials · Xấp xỉ tuyến tính', body: `
    <p class="lead2">Gần điểm a, đường tiếp tuyến xấp xỉ tốt đồ thị hàm số:</p>
    ${K("L(x) = f(a) + f'(a)(x-a)")}
    <div class="two">
      <div><p class="nh">Vi phân</p>${K("dy = f'(x) dx")}</div>
      <div><p class="nh">Ví dụ</p><p>${k('f(x)=\\sqrt{x},  a=4')}<br/>${k('\\sqrt{4.1}\\approx L(4.1)=2+\\tfrac{1}{4}(0.1)=2.025')}</p></div>
    </div>
    <div class="note">${k('\\Delta x')} nhỏ ⇒ ${k('\\Delta y \\approx dy')}.</div>` },

  { t: 'Extreme Values · Cực trị', body: `
    <div class="two">
      <div><p class="nh">Địa phương (Local)</p><p>${k('f(c)')} lớn/nhỏ nhất trong <b>lân cận</b> c</p></div>
      <div><p class="nh">Tuyệt đối (Absolute)</p><p>${k('f(c)')} lớn/nhỏ nhất trên <b>toàn miền xác định</b></p></div>
    </div>
    <div class="box ok"><b>Extreme Value Theorem:</b> f liên tục trên ${k('[a,b]')} ⇒ f đạt cả GTLN &amp; GTNN tuyệt đối trên ${k('[a,b]')}.</div>
    <p class="note">Thiếu liên tục hoặc thiếu đoạn đóng ⇒ định lý có thể không còn đúng.</p>` },

  { t: 'Critical Points · Điểm tới hạn', body: `
    ${K("c \\text{ là điểm tới hạn} \\iff f'(c)=0 \\text{ hoặc } f'(c) \\text{ không tồn tại}")}
    <p class="lead2">Quy trình tìm GTLN/GTNN tuyệt đối trên ${k('[a,b]')} (Closed Interval Method):</p>
    <ol class="big">
      <li>Tìm tất cả điểm tới hạn trong ${k('(a,b)')}</li>
      <li>Tính f tại các điểm tới hạn &amp; tại 2 đầu mút ${k('a, b')}</li>
      <li>So sánh — lớn nhất là GTLN, nhỏ nhất là GTNN</li>
    </ol>` },

  { t: "Rolle's Theorem & MVT · Giá trị trung bình", body: `
    <div class="two">
      <div><p class="nh">Rolle</p><p>f liên tục ${k('[a,b]')}, khả vi ${k('(a,b)')}, ${k('f(a)=f(b)')}</p>${K("\\exists c \\in (a,b): f'(c)=0")}</div>
      <div><p class="nh">MVT</p><p>f liên tục ${k('[a,b]')}, khả vi ${k('(a,b)')}</p>${K("\\exists c \\in (a,b): f'(c) = \\frac{f(b)-f(a)}{b-a}")}</div>
    </div>
    <div class="box">Ý nghĩa: có một điểm mà <b>tiếp tuyến song song</b> với dây cung nối hai đầu mút.</div>` },

  { t: 'Increasing/Decreasing · Hàm tăng, giảm', body: `
    <table class="t">
      <tr><th>Dấu f'</th><td>${k("f'>0")}</td><td>${k("f'<0")}</td><td>${k("f'=0")}</td></tr>
      <tr><th>Hàm f</th><td class="hl">Tăng</td><td class="hl">Giảm</td><td>Nằm ngang (điểm dừng)</td></tr>
    </table>
    <p class="lead2"><b>First Derivative Test</b> — f' đổi dấu tại c:</p>
    <ol class="big">
      <li>${k('+ \\to -')}: c là <b>cực đại</b> địa phương</li>
      <li>${k('- \\to +')}: c là <b>cực tiểu</b> địa phương</li>
      <li>Không đổi dấu: c <b>không</b> là cực trị</li>
    </ol>` },

  { t: 'Concavity & Inflection · Lồi, lõm, điểm uốn', body: `
    <table class="t">
      <tr><th>Dấu f''</th><td>${k("f''>0")}</td><td>${k("f''<0")}</td></tr>
      <tr><th>Đồ thị</th><td class="hl">Lõm lên (concave up)</td><td class="hl">Lõm xuống (concave down)</td></tr>
    </table>
    <div class="box ok"><b>Điểm uốn</b> (inflection point): ${k("f''")} đổi dấu tại c.</div>
    <p class="lead2"><b>Second Derivative Test</b> tại điểm tới hạn c (${k("f'(c)=0")}):</p>
    <ol class="big">
      <li>${k("f''(c)>0")} ⇒ <b>cực tiểu</b> địa phương</li>
      <li>${k("f''(c)<0")} ⇒ <b>cực đại</b> địa phương</li>
      <li>${k("f''(c)=0")} ⇒ chưa kết luận được, dùng test cấp 1</li>
    </ol>` },

  { t: 'Curve Sketching · Khảo sát &amp; vẽ đồ thị', body: `
    <ol class="big">
      <li>Tập xác định, giao Ox/Oy, tính đối xứng (chẵn/lẻ/tuần hoàn)</li>
      <li>Tiệm cận đứng &amp; ngang (giới hạn Chương 1)</li>
      <li>${k("f'")}: khoảng tăng/giảm, cực trị (First Derivative Test)</li>
      <li>${k("f''")}: khoảng lồi/lõm, điểm uốn</li>
      <li>Tổng hợp bảng biến thiên &amp; vẽ đồ thị</li>
    </ol>
    <div class="note">Bảng biến thiên gộp cả dấu ${k("f'")} và ${k("f''")} là công cụ trung tâm.</div>` },

  { t: 'Optimization Problems · Bài toán tối ưu hoá', body: `
    <ol class="big">
      <li>Đọc đề, vẽ hình, đặt tên biến</li>
      <li>Xác định đại lượng cần tối ưu (hàm mục tiêu)</li>
      <li>Viết hàm mục tiêu theo <b>một biến duy nhất</b> (dùng ràng buộc)</li>
      <li>Xác định miền xác định hợp lý của biến</li>
      <li>Tìm điểm tới hạn, dùng test cấp 1/2 hoặc Closed Interval Method</li>
      <li>Kết luận &amp; kiểm tra nghĩa thực tế</li>
    </ol>` },

  { t: 'Optimization — Example · Ví dụ hộp thể tích lớn nhất', body: `
    <p class="lead2">Tấm bìa vuông cạnh 12cm, cắt 4 góc hình vuông cạnh x, gấp thành hộp. Tìm x để thể tích lớn nhất.</p>
    <div class="steps">
      <div><span class="n">1</span> Hàm mục tiêu: ${k('V(x) = x(12-2x)^2')}, ${k('0<x<6')}</div>
      <div><span class="n">2</span> ${k("V'(x) = 12(x-6)(x-2)")}</div>
      <div><span class="n">3</span> ${k("V'(x)=0 \\Rightarrow x=2")} (loại ${k('x=6')} vì V=0)</div>
      <div><span class="n">4</span> ${k("V''(2)<0")} ⇒ cực đại. ${k('V(2) = 2(8)^2 = 128')} cm³</div>
    </div>
    <div class="box ok">Cắt góc <b>x=2cm</b> cho thể tích lớn nhất <b>128 cm³</b>.</div>` },

  { t: "L'Hôpital's Rule · Quy tắc L'Hôpital", body: `
    <p class="lead2">Dạng vô định ${k('0/0')} hoặc ${k('\\infty/\\infty')}, f, g khả vi quanh a:</p>
    ${K("\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f'(x)}{g'(x)}")}
    <div class="steps">
      <div><span class="n">1</span> ${k('\\lim_{x\\to 0} \\frac{\\sin x}{x}')} → dạng ${k('0/0')}</div>
      <div><span class="n">2</span> Đạo hàm tử &amp; mẫu: ${k('\\frac{\\cos x}{1}')}</div>
      <div><span class="n">3</span> Thay ${k('x=0')}: ${k('\\cos 0 = 1')}</div>
    </div>
    <div class="box warn">Chỉ áp dụng khi ĐÚNG dạng ${k('0/0')} hay ${k('\\infty/\\infty')} — không phải mọi phân số.</div>` },

  { t: "Newton's Method · Phương pháp Newton", body: `
    ${K("x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}")}
    <p class="lead2">Tìm nghiệm gần đúng của ${k('f(x)=0')} từ dự đoán ban đầu ${k('x_1')}.</p>
    <div class="steps">
      <div><span class="n">1</span> ${k('f(x)=x^2-2')}, chọn ${k('x_1=1.5')}</div>
      <div><span class="n">2</span> ${k('x_2 = 1.5 - \\frac{1.5^2-2}{2(1.5)} = 1.41\\overline{6}')}</div>
      <div><span class="n">3</span> ${k('x_3 \\approx 1.41421')} → hội tụ nhanh về ${k('\\sqrt{2}')}</div>
    </div>
    <div class="box warn">Có thể <b>không hội tụ</b> nếu ${k("f'(x_n)")} gần 0 hoặc dự đoán ban đầu xấu.</div>` },

  { t: 'Antiderivatives · Nguyên hàm', body: `
    <p class="lead2">F là nguyên hàm của f nếu ${k("F'(x)=f(x)")}. Họ nguyên hàm luôn kèm hằng số C.</p>
    <table class="t big2">
      <tr><th>${k('x^n (n\\ne -1)')}</th><td>${k('\\frac{x^{n+1}}{n+1}+C')}</td></tr>
      <tr><th>${k('1/x')}</th><td>${k('\\ln|x|+C')}</td></tr>
      <tr><th>${k('\\sin x')}</th><td>${k('-\\cos x + C')}</td></tr>
      <tr><th>${k('\\cos x')}</th><td>${k('\\sin x + C')}</td></tr>
      <tr><th>${k('e^x')}</th><td>${k('e^x + C')}</td></tr>
    </table>
    <div class="note">Đảo ngược của đạo hàm — nền tảng cho tích phân ở chương sau.</div>` },

  { t: 'Summary · Tổng kết chương 3', body: `
    <ol class="big">
      <li>Related rates: đạo hàm hai vế theo t, thay số <b>sau cùng</b></li>
      <li>Cực trị: điểm tới hạn (${k("f'=0")} hoặc không tồn tại) + test cấp 1/2</li>
      <li>MVT liên kết dấu ${k("f'")} với tăng/giảm của f</li>
      <li>Khảo sát hàm: kết hợp ${k("f'")}, ${k("f''")}, tiệm cận</li>
      <li>Tối ưu hoá: đưa về hàm một biến rồi tìm cực trị</li>
      <li>L'Hôpital khử ${k('0/0')}, ${k('\\infty/\\infty')}; Newton tìm nghiệm gần đúng</li>
    </ol>` },
];
