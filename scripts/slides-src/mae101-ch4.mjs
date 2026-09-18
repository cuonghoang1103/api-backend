/** MAE101 · Deck mae4 — Chapter 4: Integrals. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae4', code: 'MAE4', title: 'Chapter 4 — Integrals', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 4 — Integrals', sub: 'Tích phân · Từ diện tích tới định lý cơ bản',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Stewart — <i>Essential Calculus</i>, Ch. 4–5</p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Bài toán diện tích &amp; tổng Riemann</li>
      <li>Tích phân xác định &amp; tính chất</li>
      <li>Định lý cơ bản của Giải tích (FTC1, FTC2)</li>
      <li>Nguyên hàm &amp; định lý biến thiên thuần</li>
      <li>Đổi biến &amp; tích phân từng phần</li>
      <li>Tích phân số &amp; tích phân suy rộng</li>
    </ol>` },

  { t: 'The area problem · Bài toán diện tích', body: `
    <p class="lead2">Xấp xỉ diện tích dưới đường cong bằng <b>n</b> hình chữ nhật, bề rộng ${k('\\Delta x = (b-a)/n')}.</p>
    ${K('L_n = \\sum_{i=1}^{n} f(x_{i-1})\\Delta x, R_n = \\sum_{i=1}^{n} f(x_i)\\Delta x')}
    <div class="two">
      <div><p class="nh">M(n)</p>${k('\\sum f(\\text{trung điểm})\\Delta x')}</div>
      <div><p class="nh">n \\to \\infty</p>${k('L_n, R_n, M_n \\to A')}</div>
    </div>
    <p class="note">n càng lớn ⇒ xấp xỉ càng chính xác.</p>` },

  { t: 'Riemann sum · Tổng Riemann', body: `
    <p class="lead2">Chọn điểm mẫu ${k('x_i^*')} bất kỳ trong mỗi đoạn con:</p>
    ${K('\\sum_{i=1}^{n} f(x_i^*)\\Delta x')}
    <div class="box"><b>Định nghĩa tích phân xác định:</b> ${k('\\int_a^b f(x) dx = \\lim_{n\\to\\infty} \\sum_{i=1}^{n} f(x_i^*)\\Delta x')}</div>
    <p class="note">Giới hạn tồn tại khi f liên tục trên ${k('[a,b]')}.</p>` },

  { t: 'Notation & meaning · Ký hiệu & ý nghĩa', body: `
    ${K('\\int_a^b f(x) dx')}
    <table class="t">
      <tr><th>f(x) ≥ 0</th><td>= <b>diện tích</b> giữa đồ thị và trục Ox</td></tr>
      <tr><th>f(x) &lt; 0</th><td>= <b>diện tích mang dấu âm</b> (dưới trục)</td></tr>
    </table>
    <div class="box ok">Tích phân = diện tích <b>có dấu</b> (net signed area), không phải diện tích hình học thuần.</div>` },

  { t: 'Properties of definite integrals · Tính chất', body: `
    <div class="grid2">
      <div class="f">${k('\\int_a^a f(x) dx = 0')}</div>
      <div class="f">${k('\\int_a^b f = -\\int_b^a f')}</div>
      <div class="f">${k('\\int_a^b [f \\pm g] = \\int_a^b f \\pm \\int_a^b g')}</div>
      <div class="f">${k('\\int_a^b c f(x) dx = c\\int_a^b f(x) dx')}</div>
      <div class="f">${k('\\int_a^c f + \\int_c^b f = \\int_a^b f')}</div>
      <div class="f">${k('\\int_a^b c dx = c(b-a)')}</div>
    </div>` },

  { t: 'FTC Part 1 · Định lý cơ bản (phần 1)', body: `
    <p class="lead2">Đặt ${k('g(x) = \\int_a^x f(t) dt')}. Nếu f liên tục:</p>
    ${K('g\'(x) = \\dfrac{d}{dx}\\int_a^x f(t) dt = f(x)')}
    <div class="box ok">Đạo hàm của tích phân theo cận trên = chính hàm f tại cận đó.</div>
    <p class="note">FTC1 liên kết <b>đạo hàm</b> và <b>tích phân</b> — hai phép toán ngược nhau.</p>` },

  { t: 'FTC Part 2 · Định lý cơ bản (phần 2)', body: `
    <p class="lead2">F là <b>một nguyên hàm</b> bất kỳ của f trên ${k('[a,b]')}:</p>
    ${K('\\int_a^b f(x) dx = F(b) - F(a) = \\big[F(x)\\big]_a^b')}
    <div class="steps">
      <div><span class="n">1</span> ${k('\\int_1^3 x^2 dx')} — nguyên hàm ${k('F(x)=x^3/3')}</div>
      <div><span class="n">2</span> ${k('F(3)-F(1) = 9 - 1/3')}</div>
      <div><span class="n">3</span> Đáp số: ${k('26/3')}</div>
    </div>` },

  { t: 'Basic antiderivatives · Bảng nguyên hàm cơ bản', body: `
    <table class="t">
      <tr><th>${k('\\int x^n dx')}</th><td>${k('\\frac{x^{n+1}}{n+1}+C, n\\neq-1')}</td></tr>
      <tr><th>${k('\\int \\frac{1}{x} dx')}</th><td>${k('\\ln|x|+C')}</td></tr>
      <tr><th>${k('\\int e^x dx')}</th><td>${k('e^x+C')}</td></tr>
      <tr><th>${k('\\int \\sin x dx')}</th><td>${k('-\\cos x+C')}</td></tr>
      <tr><th>${k('\\int \\cos x dx')}</th><td>${k('\\sin x+C')}</td></tr>
      <tr><th>${k('\\int \\sec^2 x dx')}</th><td>${k('\\tan x+C')}</td></tr>
    </table>
    <p class="note">Bảng này <b>phải thuộc</b> — nền tảng cho mọi kỹ thuật sau.</p>` },

  { t: 'Net Change Theorem · Định lý biến thiên thuần', body: `
    ${K('\\int_a^b F\'(x) dx = F(b) - F(a)')}
    <div class="box"><b>Ý nghĩa:</b> tích phân của <b>tốc độ thay đổi</b> = <b>tổng biến thiên</b>.</div>
    <table class="t">
      <tr><th>${k('\\int_{t_1}^{t_2} v(t) dt')}</th><td>độ dời (displacement)</td></tr>
      <tr><th>${k('\\int_{t_1}^{t_2} |v(t)| dt')}</th><td>quãng đường đi được</td></tr>
    </table>` },

  { t: 'Substitution method · Đổi biến', body: `
    <p class="lead2">Nhận diện hàm hợp — đặt ${k('u = g(x)')}, ${k('du = g\'(x) dx')}:</p>
    ${K('\\int f(g(x)) g\'(x) dx = \\int f(u) du')}
    <div class="steps">
      <div><span class="n">1</span> ${k('\\int 2x(x^2+1)^5 dx')} — đặt ${k('u=x^2+1')}</div>
      <div><span class="n">2</span> ${k('du = 2x dx')} ⇒ thay trực tiếp</div>
      <div><span class="n">3</span> ${k('\\int u^5 du = \\frac{u^6}{6}+C = \\frac{(x^2+1)^6}{6}+C')}</div>
    </div>` },

  { t: 'Substitution with definite integrals · Đổi biến & đổi cận', body: `
    ${K('\\int_0^1 2x(x^2+1)^5 dx, (u=x^2+1)')}
    <div class="steps">
      <div><span class="n">1</span> Đổi cận: ${k('x=0 \\Rightarrow u=1')}, ${k('x=1 \\Rightarrow u=2')}</div>
      <div><span class="n">2</span> ${k('\\int_1^2 u^5 du = \\big[\\frac{u^6}{6}\\big]_1^2')}</div>
      <div><span class="n">3</span> ${k('= \\frac{64}{6} - \\frac{1}{6} = \\frac{63}{6}')}</div>
    </div>
    <div class="box ok">Đổi cận theo u ⇒ <b>không cần</b> quay lại biến x.</div>` },

  { t: 'Integration by parts · Tích phân từng phần', body: `
    ${K('\\int u dv = uv - \\int v du')}
    <div class="box"><b>Chọn u theo LIATE:</b> Log, Inverse trig, Algebraic, Trig, Exponential (ưu tiên trước → sau).</div>
    <div class="steps">
      <div><span class="n">1</span> ${k('\\int x e^x dx')} — chọn ${k('u=x, dv=e^x dx')}</div>
      <div><span class="n">2</span> ${k('du=dx, v=e^x')}</div>
      <div><span class="n">3</span> ${k('= x e^x - \\int e^x dx = x e^x - e^x + C')}</div>
    </div>` },

  { t: 'Numerical integration · Tích phân số', body: `
    <p class="lead2">Khi không tìm được nguyên hàm dạng đóng — xấp xỉ bằng dữ liệu rời rạc:</p>
    <div class="two">
      <div><p class="nh">Hình thang</p>${K('T_n = \\frac{\\Delta x}{2}[f_0+2f_1+\\dots+2f_{n-1}+f_n]')}</div>
      <div><p class="nh">Simpson</p>${K('S_n = \\frac{\\Delta x}{3}[f_0+4f_1+2f_2+\\dots+f_n]')}</div>
    </div>
    <p class="note">Simpson (n chẵn) chính xác hơn hình thang cùng số điểm chia.</p>` },

  { t: 'Improper integrals — Type 1 · Cận vô hạn', body: `
    ${K('\\int_a^{\\infty} f(x) dx = \\lim_{t\\to\\infty} \\int_a^t f(x) dx')}
    <div class="steps">
      <div><span class="n">1</span> ${k('\\int_1^{\\infty} \\frac{1}{x^2} dx = \\lim_{t\\to\\infty}\\big[-\\frac{1}{x}\\big]_1^t')}</div>
      <div><span class="n">2</span> ${k('= \\lim_{t\\to\\infty} (-\\frac{1}{t}+1) = 1')}</div>
    </div>
    <div class="box ok">Giới hạn hữu hạn ⇒ <b>hội tụ</b> (bằng 1). Không tồn tại/±∞ ⇒ <b>phân kỳ</b>.</div>` },

  { t: 'Improper integrals — Type 2 · Hàm không bị chặn', body: `
    <p class="lead2">f có tiệm cận đứng tại cận tích phân — thay bằng giới hạn:</p>
    ${K('\\int_a^b f(x) dx = \\lim_{t\\to a^+} \\int_t^b f(x) dx')}
    <div class="steps">
      <div><span class="n">1</span> ${k('\\int_0^1 \\frac{1}{\\sqrt{x}} dx = \\lim_{t\\to 0^+}\\big[2\\sqrt{x}\\big]_t^1')}</div>
      <div><span class="n">2</span> ${k('= \\lim_{t\\to 0^+} (2 - 2\\sqrt{t}) = 2')}</div>
    </div>
    <div class="box warn">f không xác định/không bị chặn tại điểm trong ${k('[a,b]')} ⇒ vẫn phải tách giới hạn tại điểm đó.</div>` },

  { t: 'Summary · Tổng kết chương 4', body: `
    <ol class="big">
      <li>Diện tích ⇒ tổng Riemann ⇒ tích phân xác định (giới hạn)</li>
      <li>FTC nối đạo hàm &amp; tích phân — tính bằng nguyên hàm ${k('F(b)-F(a)')}</li>
      <li>Hàm hợp ⇒ <b>đổi biến</b>; tích của hai loại hàm khác nhau ⇒ <b>từng phần</b></li>
      <li>Không có nguyên hàm đóng ⇒ hình thang / Simpson</li>
      <li>Cận vô hạn hoặc hàm không bị chặn ⇒ tích phân suy rộng, xét giới hạn</li>
    </ol>` },
];
