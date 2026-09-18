/** MAE101 · Deck mae1 — Chapter 1: Limits. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae1', code: 'MAE1', title: 'Chapter 1 — Limits', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 1 — Limits', sub: 'Giới hạn · Nền móng của toàn bộ Giải tích',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Stewart — <i>Essential Calculus</i>, Ch. 1–2</p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Ý tưởng giới hạn &amp; giới hạn một phía</li>
      <li>Luật giới hạn &amp; thay trực tiếp</li>
      <li>Khử dạng vô định 0/0</li>
      <li>Định lý kẹp &amp; giới hạn lượng giác</li>
      <li>Giới hạn tại vô cực &amp; tiệm cận</li>
      <li>Tính liên tục &amp; Định lý IVT</li>
    </ol>` },

  { t: 'What is a limit? · Giới hạn là gì?', body: `
    <p class="lead2">Giới hạn mô tả hàm <b>tiến tới đâu</b> khi x tiến gần a — <b>không cần</b> f(a) tồn tại.</p>
    ${K('\\lim_{x \\to a} f(x) = L')}
    <table class="t">
      <tr><th>x</th><td>1.9</td><td>1.99</td><td>1.999</td><td>→ 2 ←</td><td>2.001</td><td>2.01</td></tr>
      <tr><th>f(x)=x+3</th><td>4.9</td><td>4.99</td><td>4.999</td><td class="hl">5</td><td>5.001</td><td>5.01</td></tr>
    </table>
    <p class="note">Hai phía cùng tiến về <b>5</b> ⇒ giới hạn bằng 5.</p>` },

  { t: 'One-sided limits · Giới hạn một phía', body: `
    <div class="two">
      <div><p class="nh">Từ bên trái</p>${K('\\lim_{x \\to a^-} f(x)')}</div>
      <div><p class="nh">Từ bên phải</p>${K('\\lim_{x \\to a^+} f(x)')}</div>
    </div>
    <div class="box ok"><b>Điều kiện tồn tại:</b> ${k('\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = L')}</div>
    <p class="note">Trái ≠ phải ⇒ giới hạn <b>không tồn tại</b>.</p>` },

  { t: 'When a limit fails · Khi giới hạn không tồn tại', body: `
    <ol class="big">
      <li><b>Nhảy bậc</b> — trái ≠ phải (hàm bậc thang, |x|/x)</li>
      <li><b>Tiến ra vô cực</b> — ${k('\\lim_{x\\to 0} 1/x^2 = +\\infty')}</li>
      <li><b>Dao động</b> — ${k('\\sin(1/x)')} khi ${k('x \\to 0')}</li>
    </ol>` },

  { t: 'Limit laws · Luật giới hạn', body: `
    <p class="lead2">Nếu ${k('\\lim f(x)')} và ${k('\\lim g(x)')} tồn tại:</p>
    <div class="grid2">
      <div class="f">${k('\\lim [f \\pm g] = \\lim f \\pm \\lim g')}</div>
      <div class="f">${k('\\lim [f \\cdot g] = \\lim f \\cdot \\lim g')}</div>
      <div class="f">${k('\\lim \\frac{f}{g} = \\frac{\\lim f}{\\lim g},  \\lim g \\neq 0')}</div>
      <div class="f">${k('\\lim [c \\cdot f] = c \\cdot \\lim f')}</div>
      <div class="f">${k('\\lim f^n = (\\lim f)^n')}</div>
      <div class="f">${k('\\lim \\sqrt[n]{f} = \\sqrt[n]{\\lim f}')}</div>
    </div>` },

  { t: 'Step 1 — Direct substitution · Thay trực tiếp', body: `
    <p class="lead2">Hàm đa thức / hữu tỉ liên tục tại a ⇒ <b>thay thẳng a vào</b>.</p>
    ${K('\\lim_{x \\to 2}(x^2 + 3x - 1) = 2^2 + 3(2) - 1 = 9')}
    <div class="box warn">Nếu ra ${k('\\tfrac{0}{0}')} ⇒ <b>dạng vô định</b>, phải biến đổi (slide sau).</div>` },

  { t: 'Indeterminate 0/0 — Factor · Phân tích nhân tử', body: `
    ${K('\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}  \\Rightarrow  \\frac{0}{0}')}
    <div class="steps">
      <div><span class="n">1</span> Phân tích: ${k('x^2-9=(x-3)(x+3)')}</div>
      <div><span class="n">2</span> Rút gọn: ${k('\\frac{(x-3)(x+3)}{x-3} = x+3')}</div>
      <div><span class="n">3</span> Thay: ${k('3+3 = 6')}</div>
    </div>
    <div class="box ok">Đáp số: <b>6</b></div>` },

  { t: 'Indeterminate 0/0 — Conjugate · Nhân liên hợp', body: `
    ${K('\\lim_{x \\to 0} \\frac{\\sqrt{x+1}-1}{x}')}
    <div class="steps">
      <div><span class="n">1</span> Nhân liên hợp ${k('(\\sqrt{x+1}+1)')} tử &amp; mẫu</div>
      <div><span class="n">2</span> Tử: ${k('(x+1)-1 = x')}</div>
      <div><span class="n">3</span> ${k('\\frac{x}{x(\\sqrt{x+1}+1)} = \\frac{1}{\\sqrt{x+1}+1}')}</div>
      <div><span class="n">4</span> Thay x=0 ⇒ ${k('\\frac{1}{2}')}</div>
    </div>` },

  { t: 'Squeeze Theorem · Định lý kẹp', body: `
    <p class="lead2">Nếu ${k('g(x) \\le f(x) \\le h(x)')} quanh a và hai biên cùng tiến về L:</p>
    ${K('\\lim_{x\\to a} g(x) = \\lim_{x\\to a} h(x) = L  \\Rightarrow  \\lim_{x\\to a} f(x) = L')}
    <div class="box ok"><b>Ví dụ:</b> ${k('-x^2 \\le x^2\\sin(1/x) \\le x^2')} ⇒ ${k('\\lim_{x\\to 0} x^2\\sin(1/x) = 0')}</div>` },

  { t: 'Trig limits · Giới hạn lượng giác', body: `
    <div class="two">
      <div>${K('\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1')}</div>
      <div>${K('\\lim_{x \\to 0} \\frac{1-\\cos x}{x} = 0')}</div>
    </div>
    <p class="note">Hai công thức <b>phải thuộc</b> — nền của đạo hàm sin, cos.</p>
    <div class="box">Mẹo: ${k('\\lim_{x\\to 0}\\frac{\\sin 5x}{x} = 5')} (nhân/chia cho 5 để về dạng chuẩn).</div>` },

  { t: 'Limits at infinity · Giới hạn tại vô cực', body: `
    <p class="lead2">Hàm hữu tỉ ${k('\\frac{P(x)}{Q(x)}')} khi ${k('x \\to \\pm\\infty')} — so <b>bậc</b>:</p>
    <table class="t big2">
      <tr><th>deg P &lt; deg Q</th><td>${k('\\to 0')}</td></tr>
      <tr><th>deg P = deg Q</th><td>tỉ số <b>hệ số bậc cao nhất</b></td></tr>
      <tr><th>deg P &gt; deg Q</th><td>${k('\\to \\pm\\infty')}</td></tr>
    </table>
    <div class="box ok">${k('\\lim_{x\\to\\infty} \\frac{3x^2+5}{2x^2-x} = \\frac{3}{2}')}</div>` },

  { t: 'Asymptotes · Tiệm cận', body: `
    <div class="two">
      <div><p class="nh">Tiệm cận ĐỨNG</p>${K('\\lim_{x\\to a^\\pm} f(x) = \\pm\\infty')}<p class="note">Mẫu = 0, tử ≠ 0 ⇒ x = a</p></div>
      <div><p class="nh">Tiệm cận NGANG</p>${K('\\lim_{x\\to\\pm\\infty} f(x) = L')}<p class="note">⇒ đường y = L</p></div>
    </div>` },

  { t: 'Continuity · Tính liên tục', body: `
    <p class="lead2">f liên tục tại a khi <b>đủ cả 3</b>:</p>
    <ol class="big">
      <li>${k('f(a)')} <b>xác định</b></li>
      <li>${k('\\lim_{x\\to a} f(x)')} <b>tồn tại</b></li>
      <li>${k('\\lim_{x\\to a} f(x) = f(a)')}</li>
    </ol>
    <div class="box warn">Thiếu 1 trong 3 ⇒ <b>gián đoạn</b> tại a.</div>` },

  { t: 'Types of discontinuity · Ba loại gián đoạn', body: `
    <div class="grid3">
      <div class="card"><b>Khử được</b><p>Có lỗ thủng; giới hạn tồn tại nhưng ≠ f(a)</p></div>
      <div class="card"><b>Nhảy bậc</b><p>Trái ≠ phải, cả hai hữu hạn</p></div>
      <div class="card"><b>Vô cực</b><p>Tiến ±∞ — có tiệm cận đứng</p></div>
    </div>` },

  { t: 'Intermediate Value Theorem · Định lý IVT', body: `
    <p class="lead2">f liên tục trên ${k('[a,b]')}, N nằm giữa ${k('f(a)')} và ${k('f(b)')}:</p>
    ${K('\\exists  c \\in (a,b): f(c) = N')}
    <div class="box ok"><b>Dùng để chứng minh có nghiệm:</b> ${k('f(x)=x^3-x-1')}, ${k('f(1)=-1<0')}, ${k('f(2)=5>0')} ⇒ có nghiệm trong ${k('(1,2)')}.</div>` },

  { t: 'Summary · Tổng kết chương 1', body: `
    <ol class="big">
      <li>Thay trực tiếp trước — ra số là xong</li>
      <li>Ra ${k('0/0')} ⇒ phân tích / liên hợp / quy đồng</li>
      <li>Kẹp cho hàm dao động; thuộc ${k('\\sin x/x = 1')}</li>
      <li>${k('x\\to\\infty')} ⇒ so bậc tử–mẫu</li>
      <li>Liên tục = 3 điều kiện; IVT ⇒ chứng minh có nghiệm</li>
    </ol>` },
];
