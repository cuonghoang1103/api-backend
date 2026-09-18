/** MAE101 · Deck mae2 — Chapter 2: Derivatives. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae2', code: 'MAE2', title: 'Chapter 2 — Derivatives', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 2 — Derivatives', sub: 'Đạo hàm · Đo tốc độ thay đổi',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Stewart — <i>Essential Calculus</i>, Ch. 2–3</p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Tốc độ thay đổi &amp; định nghĩa đạo hàm</li>
      <li>Đạo hàm là hàm số &amp; tính khả vi</li>
      <li>Quy tắc tính đạo hàm: tổng, tích, thương</li>
      <li>Đạo hàm hàm lượng giác &amp; quy tắc dây chuyền</li>
      <li>Hàm mũ, log, đạo hàm ẩn, đạo hàm logarit</li>
      <li>Đạo hàm cấp cao</li>
    </ol>` },

  { t: 'Rates of change · Tốc độ thay đổi', body: `
    <p class="lead2">Bài toán <b>tiếp tuyến</b> (độ dốc) và bài toán <b>vận tốc</b> (quãng đường theo thời gian) đều dẫn về cùng một giới hạn.</p>
    <div class="two">
      <div><p class="nh">Tốc độ TRUNG BÌNH</p>${K('\\frac{f(a+h)-f(a)}{h}')}<p class="note">Độ dốc dây cung qua 2 điểm</p></div>
      <div><p class="nh">Tốc độ TỨC THỜI</p>${K('\\lim_{h \\to 0} \\frac{f(a+h)-f(a)}{h}')}<p class="note">Độ dốc tiếp tuyến tại a</p></div>
    </div>` },

  { t: 'The derivative · Định nghĩa đạo hàm', body: `
    <p class="lead2">Đạo hàm của f tại a là giới hạn của tốc độ thay đổi trung bình:</p>
    ${K("f'(a) = \\lim_{h \\to 0} \\frac{f(a+h)-f(a)}{h}")}
    <div class="box ok"><b>Ý nghĩa hình học:</b> ${k("f'(a)")} = hệ số góc của <b>tiếp tuyến</b> đồ thị f tại điểm ${k('(a, f(a))')}.</div>
    <p class="note">Giới hạn không tồn tại ⇒ f <b>không có đạo hàm</b> tại a.</p>` },

  { t: 'Derivative as a function · Đạo hàm là một hàm', body: `
    <p class="lead2">Thay a bằng x bất kỳ ⇒ ${k("f'")} là một hàm số mới, có miền xác định riêng.</p>
    ${K("f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}")}
    <table class="t">
      <tr><th>Ký hiệu</th><td>${k("f'(x)")}</td><td>${k('\\frac{dy}{dx}')}</td><td>${k('\\frac{df}{dx}')}</td><td>${k('Df(x)')}</td></tr>
      <tr><th>Đọc là</th><td colspan="4">"f phẩy của x" — tất cả cùng một khái niệm</td></tr>
    </table>` },

  { t: 'Where f is not differentiable · Khi nào KHÔNG khả vi', body: `
    <div class="grid3">
      <div class="card"><b>Góc nhọn</b><p>Đồ thị gấp khúc — giới hạn trái/phải của độ dốc khác nhau</p></div>
      <div class="card"><b>Gián đoạn</b><p>f không liên tục tại a ⇒ chắc chắn không khả vi</p></div>
      <div class="card"><b>Tiếp tuyến đứng</b><p>Độ dốc tiến ra ±∞ (vd ${k('\\sqrt[3]{x}')} tại 0)</p></div>
    </div>
    <div class="box warn"><b>Khả vi ⇒ liên tục</b>, nhưng <b>chiều ngược lại SAI</b> — ví dụ ${k('f(x)=|x|')} liên tục nhưng không khả vi tại 0.</div>` },

  { t: 'Basic rules · Quy tắc cơ bản', body: `
    <div class="grid2">
      <div class="f"><b>Hằng số</b> ${k("(c)' = 0")}</div>
      <div class="f"><b>Luỹ thừa</b> ${k("(x^n)' = n x^{n-1}")}</div>
      <div class="f"><b>Hằng nhân</b> ${k("(c f)' = c f'")}</div>
      <div class="f"><b>Tổng/hiệu</b> ${k("(f \\pm g)' = f' \\pm g'")}</div>
    </div>
    <div class="box ok"><b>Ví dụ:</b> ${k("(3x^4 - 5x^2 + 7)' = 12x^3 - 10x")}</div>` },

  { t: 'Product rule · Quy tắc tích', body: `
    ${K("(uv)' = u'v + uv'")}
    <p class="lead2">Ví dụ: ${k('y = x^2 \\sin x')}</p>
    <div class="steps">
      <div><span class="n">1</span> Đặt ${k('u=x^2 \\Rightarrow u\'=2x')}, ${k("v=\\sin x \\Rightarrow v'=\\cos x")}</div>
      <div><span class="n">2</span> Áp dụng: ${k("y' = u'v + uv'")}</div>
      <div><span class="n">3</span> Kết quả: ${k("y' = 2x\\sin x + x^2\\cos x")}</div>
    </div>` },

  { t: 'Quotient rule · Quy tắc thương', body: `
    ${K("\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}")}
    <p class="lead2">Ví dụ: ${k('y = \\frac{x^2-1}{x^2+1}')}</p>
    <div class="steps">
      <div><span class="n">1</span> ${k("u=x^2-1, u'=2x")} · ${k("v=x^2+1, v'=2x")}</div>
      <div><span class="n">2</span> Tử: ${k("2x(x^2+1) - (x^2-1)2x = 4x")}</div>
      <div><span class="n">3</span> Kết quả: ${k("y' = \\frac{4x}{(x^2+1)^2}")}</div>
    </div>` },

  { t: 'Trigonometric derivatives · Đạo hàm lượng giác', body: `
    <table class="t big2">
      <tr><th>${k('\\sin x')}</th><td>${k('\\cos x')}</td></tr>
      <tr><th>${k('\\cos x')}</th><td>${k('-\\sin x')}</td></tr>
      <tr><th>${k('\\tan x')}</th><td>${k('\\sec^2 x')}</td></tr>
    </table>
    <div class="box"><b>Ghi nhớ:</b> đạo hàm sin/cos xoay vòng có dấu; tan đưa về ${k('\\sin x/\\cos x')} rồi dùng quy tắc thương.</div>` },

  { t: 'Chain rule · Quy tắc dây chuyền', body: `
    <p class="lead2">Đạo hàm hàm hợp — nhân đạo hàm "ngoài" với đạo hàm "trong":</p>
    ${K("[f(g(x))]' = f'(g(x)) \\cdot g'(x)")}
    <p class="lead2">Ví dụ: ${k('y = (3x+1)^5')}</p>
    <div class="steps">
      <div><span class="n">1</span> Ngoài: ${k('u^5')} → đạo hàm ${k('5u^4')}, trong ${k('u=3x+1 \\Rightarrow u\'=3')}</div>
      <div><span class="n">2</span> Nhân lại: ${k("y' = 5(3x+1)^4 \\cdot 3")}</div>
      <div><span class="n">3</span> Kết quả: ${k("y' = 15(3x+1)^4")}</div>
    </div>` },

  { t: 'Chain rule — multi-layer · Nhiều tầng', body: `
    <p class="lead2">Hàm hợp từ 3 tầng trở lên — bóc từ <b>ngoài vào trong</b>, nhân dồn từng đạo hàm.</p>
    <p class="lead2">Ví dụ: ${k('y = \\sin(3x^2+1)')}</p>
    <div class="steps">
      <div><span class="n">1</span> Ngoài: ${k('\\sin(u)')} → ${k('\\cos(u)')}, trong ${k('u = 3x^2+1 \\Rightarrow u\'=6x')}</div>
      <div><span class="n">2</span> Nhân lại: ${k("y' = \\cos(3x^2+1) \\cdot 6x")}</div>
      <div><span class="n">3</span> Kết quả: ${k("y' = 6x\\cos(3x^2+1)")}</div>
    </div>
    <div class="box ok">Hàm càng nhiều tầng ⇒ càng nhiều lần nhân "đạo hàm của trong".</div>` },

  { t: 'Exponential & log derivatives · Hàm mũ &amp; log', body: `
    <div class="grid2">
      <div class="f">${k('(e^x)\' = e^x')}</div>
      <div class="f">${k("(a^x)' = a^x \\ln a")}</div>
      <div class="f">${k("(\\ln x)' = \\frac{1}{x}")}</div>
      <div class="f">${k("(\\log_a x)' = \\frac{1}{x \\ln a}")}</div>
    </div>
    <div class="box ok"><b>Kết hợp chain rule:</b> ${k("(e^{3x})' = 3e^{3x}")}, ${k("(\\ln(x^2+1))' = \\frac{2x}{x^2+1}")}</div>` },

  { t: 'Implicit differentiation · Đạo hàm ẩn', body: `
    <p class="lead2">Dùng khi y không tách riêng theo x — đạo hàm cả 2 vế theo x, coi y là hàm của x.</p>
    <p class="lead2">Ví dụ: ${k('x^2 + y^2 = 25')}</p>
    <div class="steps">
      <div><span class="n">1</span> Đạo hàm 2 vế: ${k("2x + 2y\\frac{dy}{dx} = 0")}</div>
      <div><span class="n">2</span> Tách ${k('dy/dx')}: ${k("2y\\frac{dy}{dx} = -2x")}</div>
      <div><span class="n">3</span> Kết quả: ${k("\\frac{dy}{dx} = -\\frac{x}{y}")}</div>
    </div>` },

  { t: 'Logarithmic differentiation · Đạo hàm logarit', body: `
    <p class="lead2">Dùng khi ${k('y = f(x)^{g(x)}')} — số mũ cũng chứa biến, không áp dụng được quy tắc luỹ thừa thường.</p>
    <div class="steps">
      <div><span class="n">1</span> Lấy ln 2 vế: ${k('\\ln y = g(x)\\ln f(x)')}</div>
      <div><span class="n">2</span> Đạo hàm ẩn 2 vế theo x</div>
      <div><span class="n">3</span> Nhân y lại: ${k("y' = y \\cdot [\\ln f(x) \\cdot g'(x) + g(x)\\frac{f'(x)}{f(x)}]")}</div>
    </div>
    <div class="box">Ví dụ điển hình: ${k('y = x^x')}.</div>` },

  { t: 'Higher-order derivatives · Đạo hàm cấp cao', body: `
    <p class="lead2">Đạo hàm của đạo hàm — lặp lại phép lấy đạo hàm nhiều lần.</p>
    <table class="t">
      <tr><th>${k("f'(x)")}</th><td>Cấp 1 — vận tốc</td></tr>
      <tr><th>${k("f''(x)")}</th><td>Cấp 2 — gia tốc, độ cong đồ thị</td></tr>
      <tr><th>${k("f'''(x)")}</th><td>Cấp 3 — độ giật (jerk)</td></tr>
    </table>
    <div class="box ok">${k("f''(x) > 0")} ⇒ đồ thị lồi lên (concave up); ${k("f''(x) < 0")} ⇒ lõm xuống.</div>` },

  { t: 'Summary · Tổng kết chương 2', body: `
    <table class="t big2">
      <tr><th>${k('(x^n)\'')}</th><td>${k('n x^{n-1}')}</td></tr>
      <tr><th>${k('(uv)\'')}</th><td>${k("u'v+uv'")}</td></tr>
      <tr><th>${k('(u/v)\'')}</th><td>${k("(u'v-uv')/v^2")}</td></tr>
      <tr><th>${k('[f(g(x))]\'')}</th><td>${k("f'(g(x))g'(x)")}</td></tr>
      <tr><th>${k('(e^x)\', (\\ln x)\'')}</th><td>${k('e^x,   1/x')}</td></tr>
    </table>
    <div class="box ok">Đạo hàm ẩn &amp; đạo hàm logarit là <b>công cụ</b>, không phải công thức riêng — quay lại các quy tắc trên.</div>` },
];
