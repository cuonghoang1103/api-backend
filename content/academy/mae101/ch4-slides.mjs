/**
 * MAE101 · Chương 4 — Integrals (Tích phân), học theo từng slide.
 * Deck 'mae4' (MAE4), 17 slide, render sẵn lên CDN images/academy/MAE101/v1/mae4/NNN.webp.
 * Nội dung bám đúng scripts/slides-src/mae101-ch4.mjs + Stewart "Essential Calculus" ch.4–5.
 * Mọi phép tính trong phần giảng đều đã kiểm tay:
 *   ∫₁³x²dx = 9 − 1/3 = 26/3 · R₄ của ∫₀¹x²dx = 15/32, L₄ = 7/32 (thật = 1/3)
 *   ∫2x(x²+1)⁵dx = (x²+1)⁶/6 + C · ∫₀¹ cùng hàm = 64/6 − 1/6 = 63/6 = 21/2
 *   ∫xeˣdx = xeˣ − eˣ + C · ∫ln x dx = x ln x − x + C
 *   v(t)=t²−4 trên [0,3]: độ dời = −3, quãng đường = 16/3 + 7/3 = 23/3
 *   ∫₁²(1/x)dx: T₄ = 0,697024 · S₄ = 0,693254 · thật ln2 = 0,693147
 *   ∫₁^∞ x⁻²dx = 1 · ∫₀¹ x^(−1/2)dx = 2.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae4';

export default {
  title: '4.0 — Slide bài giảng: Tích phân (17 slide)|||4.0 — Slide bài giảng: Tích phân (17 slide)',
  slug: 'mae101-4-0-slides-tich-phan',
  type: 'VIDEO',
  description: 'Toàn bộ 17 slide Chương 4 MAE101 — bài toán diện tích và tổng Riemann, định nghĩa tích phân xác định, sáu tính chất, hai phần của Định lý cơ bản, bảng nguyên hàm, định lý biến thiên thuần, đổi biến (kèm đổi cận), tích phân từng phần với LIATE, hình thang và Simpson, tích phân suy rộng loại 1 và loại 2 — mỗi slide kèm giảng song ngữ, ví dụ giải từng bước và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Chapter 4 — Integrals (cover)',
        `<p class="y-chinh">🎯 Chapter 4 of MAE101: the <strong>integral</strong> — the operation that undoes the derivative and measures accumulated quantity.</p>
<ul>
<li><strong>Two faces, one object</strong> — the definite integral is born as an <em>area</em> (a limit of sums of rectangles) but is computed as an <em>antiderivative</em>. The Fundamental Theorem of Calculus is the bridge between those two faces.</li>
<li><strong>Why it matters</strong> — distance from velocity, work from force, charge from current, total cost from marginal cost: every "total from a rate" question in engineering is an integral.</li>
<li><strong>What this deck covers</strong> — 17 slides: the area problem, Riemann sums, the definition and properties, FTC parts 1 and 2, the antiderivative table, the Net Change Theorem, substitution, integration by parts, numerical methods, and improper integrals.</li>
</ul>
<p class="meo">💡 Read the symbol out loud: ∫ is a stretched letter S for "sum", and dx is the width of one slice. The notation itself tells you it means "add up infinitely many infinitely thin slices".</p>`,
        `<p class="y-chinh">🎯 Chương 4 của MAE101: <strong>tích phân</strong> — phép toán ngược của đạo hàm và là công cụ đo lượng tích luỹ.</p>
<ul>
<li><strong>Hai bộ mặt, một đối tượng</strong> — tích phân xác định sinh ra như một <em>diện tích</em> (giới hạn của tổng các hình chữ nhật) nhưng lại được tính bằng <em>nguyên hàm</em>. Định lý cơ bản của Giải tích chính là cây cầu nối hai bộ mặt đó.</li>
<li><strong>Vì sao quan trọng</strong> — quãng đường từ vận tốc, công từ lực, điện lượng từ dòng điện, tổng chi phí từ chi phí biên: mọi câu hỏi "tổng suy từ tốc độ" trong kỹ thuật đều là một tích phân.</li>
<li><strong>Bộ slide này gồm</strong> — 17 slide: bài toán diện tích, tổng Riemann, định nghĩa và tính chất, FTC phần 1 và phần 2, bảng nguyên hàm, định lý biến thiên thuần, đổi biến, tích phân từng phần, tích phân số, và tích phân suy rộng.</li>
</ul>
<p class="meo">💡 Hãy đọc ký hiệu thành lời: ∫ là chữ S kéo dài của "sum" (tổng), còn dx là bề rộng một lát cắt. Chính ký hiệu đã nói rằng nó nghĩa là "cộng vô số lát cắt mỏng vô hạn".</p>`],

      [2, 'Contents — six blocks of Chapter 4',
        `<p class="y-chinh">🎯 Chapter 4 runs through six blocks, each one the tool the next block needs.</p>
<ol>
<li><strong>The area problem &amp; Riemann sums</strong> — slides 3–4: rectangles of width Δx = (b − a)/n, then let n → ∞.</li>
<li><strong>The definite integral &amp; its properties</strong> — slides 5–6: signed area, and the six algebra rules.</li>
<li><strong>The Fundamental Theorem (FTC1, FTC2)</strong> — slides 7–8: differentiation and integration are inverse operations, and F(b) − F(a) computes the integral.</li>
<li><strong>Antiderivatives &amp; the Net Change Theorem</strong> — slides 9–10: the table you must memorise, and "integral of a rate = total change".</li>
<li><strong>Substitution &amp; integration by parts</strong> — slides 11–13: the two techniques that cover most exam items.</li>
<li><strong>Numerical &amp; improper integrals</strong> — slides 14–16: trapezoid and Simpson when no closed form exists; limits when a bound is ∞ or the function blows up.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 4 chạy qua sáu khối, khối trước là công cụ mà khối sau cần đến.</p>
<ol>
<li><strong>Bài toán diện tích &amp; tổng Riemann</strong> — slide 3–4: các hình chữ nhật bề rộng Δx = (b − a)/n, rồi cho n → ∞.</li>
<li><strong>Tích phân xác định &amp; tính chất</strong> — slide 5–6: diện tích có dấu, và sáu quy tắc đại số.</li>
<li><strong>Định lý cơ bản (FTC1, FTC2)</strong> — slide 7–8: đạo hàm và tích phân là hai phép toán ngược nhau, và F(b) − F(a) tính ra tích phân.</li>
<li><strong>Nguyên hàm &amp; định lý biến thiên thuần</strong> — slide 9–10: bảng bắt buộc phải thuộc, và "tích phân của tốc độ = tổng biến thiên".</li>
<li><strong>Đổi biến &amp; tích phân từng phần</strong> — slide 11–13: hai kỹ thuật phủ gần hết các câu trong đề.</li>
<li><strong>Tích phân số &amp; tích phân suy rộng</strong> — slide 14–16: hình thang và Simpson khi không có dạng đóng; dùng giới hạn khi cận là ∞ hoặc hàm không bị chặn.</li>
</ol>`],

      [3, 'The area problem',
        `<p class="y-chinh">🎯 Approximate the area under a curve with n rectangles of width Δx = (b − a)/n, then push n → ∞ to get the exact value.</p>
<ul>
<li><strong>The setup</strong> — cut [a, b] into n equal pieces. Each piece has width Δx = (b − a)/n, and the division points are x₀ = a, x₁ = a + Δx, x₂ = a + 2Δx, …, xₙ = b.</li>
<li><strong>Left endpoints</strong> — Lₙ = Σ f(x_(i−1))Δx for i = 1…n: the height of each rectangle is taken at the left edge of its strip.</li>
<li><strong>Right endpoints</strong> — Rₙ = Σ f(x_i)Δx: the height is taken at the right edge instead.</li>
<li><strong>Midpoints</strong> — Mₙ = Σ f(midpoint)Δx, usually the most accurate of the three for the same n.</li>
<li><strong>Worked example</strong> — area under f(x) = x² on [0, 1] with n = 4, so Δx = 1/4 and the cut points are 0, 1/4, 1/2, 3/4, 1.</li>
<li><strong>Right sum</strong> — R₄ = (1/4)[(1/4)² + (1/2)² + (3/4)² + 1²] = (1/4)(1/16 + 4/16 + 9/16 + 16/16) = (1/4)(30/16) = <strong>15/32 ≈ 0,469</strong>.</li>
<li><strong>Left sum</strong> — L₄ = (1/4)[0 + 1/16 + 4/16 + 9/16] = (1/4)(14/16) = <strong>7/32 ≈ 0,219</strong>. The true area 1/3 ≈ 0,333 sits between them.</li>
<li><strong>The limit</strong> — as n → ∞, Lₙ, Rₙ and Mₙ all squeeze onto the same number A. Bigger n ⇒ better approximation.</li>
</ul>
<p class="meo">💡 If f is increasing on [a, b], then Lₙ ≤ A ≤ Rₙ automatically; if f is decreasing the inequality flips. That gives you a free sanity bracket for any numeric answer.</p>
<p class="pitfall">⚠️ Δx = (b − a)/n, not b/n. Forgetting to subtract a is the single most common arithmetic slip on this slide, and it silently scales every rectangle.</p>`,
        `<p class="y-chinh">🎯 Xấp xỉ diện tích dưới đường cong bằng n hình chữ nhật bề rộng Δx = (b − a)/n, rồi cho n → ∞ để ra giá trị chính xác.</p>
<ul>
<li><strong>Cách dựng</strong> — chia [a, b] thành n phần bằng nhau. Mỗi phần rộng Δx = (b − a)/n, các điểm chia là x₀ = a, x₁ = a + Δx, x₂ = a + 2Δx, …, xₙ = b.</li>
<li><strong>Điểm mút trái</strong> — Lₙ = Σ f(x_(i−1))Δx với i = 1…n: chiều cao mỗi hình chữ nhật lấy tại mép trái của dải.</li>
<li><strong>Điểm mút phải</strong> — Rₙ = Σ f(x_i)Δx: chiều cao lấy tại mép phải.</li>
<li><strong>Điểm giữa</strong> — Mₙ = Σ f(trung điểm)Δx, thường chính xác nhất trong ba cách với cùng một n.</li>
<li><strong>Ví dụ đã giải</strong> — diện tích dưới f(x) = x² trên [0, 1] với n = 4, nên Δx = 1/4 và các điểm chia là 0; 1/4; 1/2; 3/4; 1.</li>
<li><strong>Tổng phải</strong> — R₄ = (1/4)[(1/4)² + (1/2)² + (3/4)² + 1²] = (1/4)(1/16 + 4/16 + 9/16 + 16/16) = (1/4)(30/16) = <strong>15/32 ≈ 0,469</strong>.</li>
<li><strong>Tổng trái</strong> — L₄ = (1/4)[0 + 1/16 + 4/16 + 9/16] = (1/4)(14/16) = <strong>7/32 ≈ 0,219</strong>. Diện tích thật 1/3 ≈ 0,333 nằm giữa hai số đó.</li>
<li><strong>Giới hạn</strong> — khi n → ∞ thì Lₙ, Rₙ và Mₙ cùng bị ép về một số A. n càng lớn ⇒ xấp xỉ càng chính xác.</li>
</ul>
<p class="meo">💡 Nếu f đồng biến trên [a, b] thì tự khắc Lₙ ≤ A ≤ Rₙ; f nghịch biến thì bất đẳng thức đảo chiều. Đó là một cái kẹp kiểm tra miễn phí cho mọi đáp số bằng số.</p>
<p class="pitfall">⚠️ Δx = (b − a)/n chứ không phải b/n. Quên trừ a là lỗi tính toán hay gặp nhất ở slide này, và nó âm thầm làm sai tỉ lệ của mọi hình chữ nhật.</p>`],

      [4, 'Riemann sum',
        `<p class="y-chinh">🎯 Let the sample point x_i* be <em>anywhere</em> inside each strip; the limit of Σ f(x_i*)Δx as n → ∞ defines the definite integral.</p>
<ul>
<li><strong>The general sum</strong> — Σ (i = 1 to n) f(x_i*)Δx, where x_i* is any chosen point in the i-th subinterval. Left, right and midpoint sums are just three particular choices of x_i*.</li>
<li><strong>The definition</strong> — ∫ₐᵇ f(x) dx = lim (n→∞) Σ f(x_i*)Δx. The integral is <em>defined</em> as this limit, not as an antiderivative; that identification comes later, in FTC2.</li>
<li><strong>When the limit exists</strong> — it is guaranteed whenever f is continuous on [a, b]. It also survives finitely many jump discontinuities, so piecewise-continuous functions are still integrable.</li>
<li><strong>Why the choice of x_i* does not matter</strong> — as Δx → 0 each strip becomes so thin that f barely changes across it, so every choice of sample point converges to the same number.</li>
<li><strong>Reading the notation</strong> — a and b are the limits of integration, f(x) is the integrand, and x is a dummy variable: ∫ₐᵇ f(x) dx and ∫ₐᵇ f(t) dt are the same number.</li>
<li><strong>Sums you need for exact limits</strong> — Σ i = n(n+1)/2 and Σ i² = n(n+1)(2n+1)/6. With these, the limit of Rₙ for x² on [0, 1] works out to (1/3)(1 + 1/n)(1 + 1/(2n)) → <strong>1/3</strong>, matching slide 3.</li>
</ul>
<p class="meo">💡 Match the pieces one to one: Σ becomes ∫, f(x_i*) becomes f(x), and Δx becomes dx. The integral sign is literally a Riemann sum with the discreteness erased.</p>
<p class="pitfall">⚠️ A Riemann sum is a <em>number</em> for each n, not a function of x. Writing "Σ f(x)Δx" with a free x is meaningless — the index i is what moves.</p>`,
        `<p class="y-chinh">🎯 Cho điểm mẫu x_i* nằm <em>bất kỳ</em> trong mỗi dải; giới hạn của Σ f(x_i*)Δx khi n → ∞ chính là định nghĩa tích phân xác định.</p>
<ul>
<li><strong>Tổng tổng quát</strong> — Σ (i = 1 đến n) f(x_i*)Δx, với x_i* là điểm tuỳ chọn trong đoạn con thứ i. Tổng trái, tổng phải và tổng điểm giữa chỉ là ba cách chọn cụ thể của x_i*.</li>
<li><strong>Định nghĩa</strong> — ∫ₐᵇ f(x) dx = lim (n→∞) Σ f(x_i*)Δx. Tích phân được <em>định nghĩa</em> bằng giới hạn này chứ không phải bằng nguyên hàm; sự đồng nhất đó đến sau, ở FTC2.</li>
<li><strong>Khi nào giới hạn tồn tại</strong> — bảo đảm tồn tại khi f liên tục trên [a, b]. Nó vẫn sống sót qua hữu hạn điểm gián đoạn kiểu nhảy bậc, nên hàm liên tục từng khúc vẫn khả tích.</li>
<li><strong>Vì sao cách chọn x_i* không quan trọng</strong> — khi Δx → 0, mỗi dải mỏng tới mức f gần như không đổi trên đó, nên mọi cách chọn điểm mẫu đều hội tụ về cùng một số.</li>
<li><strong>Đọc ký hiệu</strong> — a và b là cận tích phân, f(x) là hàm dưới dấu tích phân, còn x là biến câm: ∫ₐᵇ f(x) dx và ∫ₐᵇ f(t) dt là cùng một số.</li>
<li><strong>Công thức tổng cần cho giới hạn chính xác</strong> — Σ i = n(n+1)/2 và Σ i² = n(n+1)(2n+1)/6. Với chúng, giới hạn của Rₙ cho x² trên [0, 1] ra (1/3)(1 + 1/n)(1 + 1/(2n)) → <strong>1/3</strong>, khớp với slide 3.</li>
</ul>
<p class="meo">💡 Ghép từng mảnh một–một: Σ thành ∫, f(x_i*) thành f(x), và Δx thành dx. Dấu tích phân đúng nghĩa là một tổng Riemann đã xoá đi tính rời rạc.</p>
<p class="pitfall">⚠️ Tổng Riemann là một <em>con số</em> ứng với mỗi n, không phải hàm theo x. Viết "Σ f(x)Δx" với x tự do là vô nghĩa — thứ chạy là chỉ số i.</p>`],

      [5, 'Notation and meaning — signed area',
        `<p class="y-chinh">🎯 ∫ₐᵇ f(x) dx is <strong>net signed area</strong>: area above the x-axis counts positive, area below counts negative.</p>
<ul>
<li><strong>When f(x) ≥ 0</strong> — the integral equals the geometric area between the graph and the x-axis, a genuinely positive number.</li>
<li><strong>When f(x) &lt; 0</strong> — every rectangle has negative height f(x_i*) times positive width Δx, so those strips contribute negatively. The integral is the area <em>with a minus sign</em>.</li>
<li><strong>Mixed sign</strong> — the integral is (area above) − (area below). It can be zero even though the region clearly has area.</li>
<li><strong>Worked example</strong> — ∫₀^(2π) sin x dx. The hump on [0, π] has area 2, the dip on [π, 2π] has area 2, so the integral is 2 − 2 = <strong>0</strong>, while the total geometric area is 4.</li>
<li><strong>Geometric area formula</strong> — to get real, unsigned area you must integrate the absolute value: ∫ₐᵇ |f(x)| dx. In practice that means splitting at every zero of f and flipping the sign on the negative pieces.</li>
<li><strong>Shortcut via geometry</strong> — if the graph is made of lines and circular arcs you can read the integral straight off the picture; e.g. ∫₀³ x dx is a triangle of base 3 and height 3, so it equals 9/2.</li>
</ul>
<p class="meo">💡 Two different exam phrasings: "evaluate the integral" wants the <em>signed</em> value; "find the area of the region" wants the <em>unsigned</em> one. Underline which word the question used before you start.</p>
<p class="pitfall">⚠️ Answering "area = 0" for sin x on [0, 2π]. The integral is 0, but the area is 4. Confusing the two loses the mark even when every line of algebra is right.</p>`,
        `<p class="y-chinh">🎯 ∫ₐᵇ f(x) dx là <strong>diện tích có dấu</strong>: phần trên trục Ox tính dương, phần dưới trục tính âm.</p>
<ul>
<li><strong>Khi f(x) ≥ 0</strong> — tích phân bằng đúng diện tích hình học giữa đồ thị và trục Ox, là một số dương thật sự.</li>
<li><strong>Khi f(x) &lt; 0</strong> — mỗi hình chữ nhật có chiều cao âm f(x_i*) nhân bề rộng dương Δx, nên các dải đó đóng góp giá trị âm. Tích phân là diện tích <em>mang dấu trừ</em>.</li>
<li><strong>Khi dấu lẫn lộn</strong> — tích phân bằng (diện tích trên) − (diện tích dưới). Nó có thể bằng 0 dù miền rõ ràng có diện tích.</li>
<li><strong>Ví dụ đã giải</strong> — ∫₀^(2π) sin x dx. Bướu trên [0, π] có diện tích 2, hõm trên [π, 2π] có diện tích 2, nên tích phân bằng 2 − 2 = <strong>0</strong>, trong khi tổng diện tích hình học là 4.</li>
<li><strong>Công thức diện tích hình học</strong> — muốn diện tích thật, không dấu, phải lấy tích phân trị tuyệt đối: ∫ₐᵇ |f(x)| dx. Thực hành nghĩa là tách tại mọi nghiệm của f rồi đổi dấu các mảnh âm.</li>
<li><strong>Đường tắt bằng hình học</strong> — nếu đồ thị ghép từ đoạn thẳng và cung tròn thì đọc thẳng tích phân trên hình; ví dụ ∫₀³ x dx là tam giác đáy 3 cao 3, nên bằng 9/2.</li>
</ul>
<p class="meo">💡 Hai kiểu hỏi khác nhau trong đề: "tính tích phân" đòi giá trị <em>có dấu</em>; "tính diện tích hình phẳng" đòi giá trị <em>không dấu</em>. Gạch chân xem đề dùng chữ nào trước khi làm.</p>
<p class="pitfall">⚠️ Trả lời "diện tích = 0" cho sin x trên [0, 2π]. Tích phân bằng 0, còn diện tích bằng 4. Lẫn hai thứ này là mất điểm dù mọi dòng biến đổi đều đúng.</p>`],

      [6, 'Properties of definite integrals',
        `<p class="y-chinh">🎯 Six algebra rules let you split, reverse and rescale an integral before ever finding an antiderivative.</p>
<ul>
<li><strong>1. Zero width</strong> — ∫ₐᵃ f(x) dx = 0. No interval, no area, whatever f does.</li>
<li><strong>2. Swapping the limits</strong> — ∫ₐᵇ f = −∫ᵦᵃ f. Reversing direction flips the sign; that is the convention that keeps rule 5 true for every ordering.</li>
<li><strong>3. Sum and difference</strong> — ∫ₐᵇ [f ± g] = ∫ₐᵇ f ± ∫ₐᵇ g. Integration is linear, exactly like differentiation.</li>
<li><strong>4. Constant multiple</strong> — ∫ₐᵇ c·f(x) dx = c·∫ₐᵇ f(x) dx. A constant walks straight out through the integral sign.</li>
<li><strong>5. Additivity over intervals</strong> — ∫ₐᶜ f + ∫_c^b f = ∫ₐᵇ f. This is the rule you use to split |f| at its zeros, and to handle piecewise definitions.</li>
<li><strong>6. Integral of a constant</strong> — ∫ₐᵇ c dx = c(b − a): a rectangle of height c and width b − a.</li>
<li><strong>Comparison rules</strong> — if f(x) ≥ 0 on [a, b] then ∫ₐᵇ f ≥ 0; if f ≥ g then ∫ f ≥ ∫ g; and if m ≤ f(x) ≤ M then m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a), a fast way to bound an integral you cannot compute.</li>
</ul>
<p class="meo">💡 Rule 5 works even when c is <em>outside</em> [a, b], thanks to rule 2. So ∫₀⁵ = ∫₀⁷ + ∫₇⁵ is perfectly legal algebra.</p>
<p class="pitfall">⚠️ There is no product rule and no quotient rule for integrals: ∫ f·g ≠ (∫f)(∫g). Products need substitution or integration by parts — slides 11 and 13.</p>`,
        `<p class="y-chinh">🎯 Sáu quy tắc đại số cho phép tách, đảo và co giãn một tích phân trước khi phải đi tìm nguyên hàm.</p>
<ul>
<li><strong>1. Cận trùng nhau</strong> — ∫ₐᵃ f(x) dx = 0. Không có khoảng thì không có diện tích, bất kể f là gì.</li>
<li><strong>2. Đổi chỗ hai cận</strong> — ∫ₐᵇ f = −∫ᵦᵃ f. Đảo chiều thì đổi dấu; đó là quy ước giúp quy tắc 5 luôn đúng với mọi thứ tự cận.</li>
<li><strong>3. Tổng và hiệu</strong> — ∫ₐᵇ [f ± g] = ∫ₐᵇ f ± ∫ₐᵇ g. Phép tích phân là tuyến tính, y hệt phép đạo hàm.</li>
<li><strong>4. Hằng nhân</strong> — ∫ₐᵇ c·f(x) dx = c·∫ₐᵇ f(x) dx. Hằng số đi thẳng ra ngoài dấu tích phân.</li>
<li><strong>5. Cộng theo khoảng</strong> — ∫ₐᶜ f + ∫_c^b f = ∫ₐᵇ f. Đây là quy tắc dùng để tách |f| tại các nghiệm, và để xử lý hàm cho theo từng khúc.</li>
<li><strong>6. Tích phân hằng số</strong> — ∫ₐᵇ c dx = c(b − a): một hình chữ nhật cao c rộng b − a.</li>
<li><strong>Quy tắc so sánh</strong> — nếu f(x) ≥ 0 trên [a, b] thì ∫ₐᵇ f ≥ 0; nếu f ≥ g thì ∫ f ≥ ∫ g; và nếu m ≤ f(x) ≤ M thì m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a), cách chặn nhanh một tích phân không tính nổi.</li>
</ul>
<p class="meo">💡 Quy tắc 5 vẫn đúng cả khi c nằm <em>ngoài</em> [a, b], nhờ quy tắc 2. Nên ∫₀⁵ = ∫₀⁷ + ∫₇⁵ là phép biến đổi hoàn toàn hợp lệ.</p>
<p class="pitfall">⚠️ Không có quy tắc tích và cũng không có quy tắc thương cho tích phân: ∫ f·g ≠ (∫f)(∫g). Gặp tích thì phải đổi biến hoặc tích phân từng phần — slide 11 và 13.</p>`],

      [7, 'FTC Part 1 — the derivative of an integral',
        `<p class="y-chinh">🎯 If g(x) = ∫ₐˣ f(t) dt with f continuous, then g′(x) = f(x): differentiating an accumulation gives back the rate.</p>
<ul>
<li><strong>The statement</strong> — d/dx ∫ₐˣ f(t) dt = f(x). The lower limit a only shifts g by a constant, so it does not affect the derivative.</li>
<li><strong>Why the dummy variable changes</strong> — inside the integral the variable is t because x is already taken: x is the moving upper limit, t sweeps from a to x.</li>
<li><strong>What it buys you</strong> — every continuous function <em>has</em> an antiderivative, namely g(x) = ∫ₐˣ f(t) dt, even when no formula in elementary functions exists. That is how erf(x) and Si(x) are defined.</li>
<li><strong>Example 1 — plain</strong> — g(x) = ∫₀ˣ √(1 + t³) dt ⇒ g′(x) = √(1 + x³). No integration needed at all; you just read f off and substitute x.</li>
<li><strong>Example 2 — with the chain rule</strong> — h(x) = ∫₁^(x²) sin t dt. Put u = x²: h = g(u) with g′ = sin, so h′ = sin(u)·u′ = <strong>sin(x²)·2x</strong>.</li>
<li><strong>Variable lower limit</strong> — d/dx ∫ₓᵇ f(t) dt = −f(x), because swapping the limits introduces a minus sign (property 2 of slide 6).</li>
<li><strong>Both limits moving</strong> — d/dx ∫_(u(x))^(v(x)) f(t) dt = f(v)·v′ − f(u)·u′. Split at any interior constant and apply the two cases above.</li>
</ul>
<p class="meo">💡 One sentence to remember FTC1: "differentiation and integration undo each other". FTC1 does derivative-of-integral; FTC2 (next slide) does integral-of-derivative.</p>
<p class="pitfall">⚠️ Forgetting the chain-rule factor. d/dx ∫₁^(x²) sin t dt is <em>not</em> sin(x²); the extra 2x is mandatory because the upper limit moves at rate 2x, not 1.</p>`,
        `<p class="y-chinh">🎯 Nếu g(x) = ∫ₐˣ f(t) dt với f liên tục thì g′(x) = f(x): lấy đạo hàm của lượng tích luỹ sẽ trả về chính tốc độ.</p>
<ul>
<li><strong>Phát biểu</strong> — d/dx ∫ₐˣ f(t) dt = f(x). Cận dưới a chỉ dịch g đi một hằng số nên không ảnh hưởng tới đạo hàm.</li>
<li><strong>Vì sao phải đổi biến câm</strong> — bên trong tích phân biến là t vì x đã bị dùng rồi: x là cận trên di động, còn t quét từ a tới x.</li>
<li><strong>Nó cho ta cái gì</strong> — mọi hàm liên tục đều <em>có</em> nguyên hàm, chính là g(x) = ∫ₐˣ f(t) dt, kể cả khi không có công thức sơ cấp nào. Hàm erf(x) và Si(x) được định nghĩa đúng theo cách này.</li>
<li><strong>Ví dụ 1 — dạng thẳng</strong> — g(x) = ∫₀ˣ √(1 + t³) dt ⇒ g′(x) = √(1 + x³). Không cần tích phân gì cả; chỉ đọc f ra rồi thay x vào.</li>
<li><strong>Ví dụ 2 — kèm quy tắc dây chuyền</strong> — h(x) = ∫₁^(x²) sin t dt. Đặt u = x²: h = g(u) với g′ = sin, nên h′ = sin(u)·u′ = <strong>sin(x²)·2x</strong>.</li>
<li><strong>Cận dưới di động</strong> — d/dx ∫ₓᵇ f(t) dt = −f(x), vì đổi chỗ hai cận sinh ra dấu trừ (tính chất 2 ở slide 6).</li>
<li><strong>Cả hai cận cùng chạy</strong> — d/dx ∫_(u(x))^(v(x)) f(t) dt = f(v)·v′ − f(u)·u′. Tách tại một hằng số bất kỳ ở giữa rồi áp hai trường hợp trên.</li>
</ul>
<p class="meo">💡 Một câu để nhớ FTC1: "đạo hàm và tích phân khử lẫn nhau". FTC1 lo vụ đạo-hàm-của-tích-phân; FTC2 (slide sau) lo vụ tích-phân-của-đạo-hàm.</p>
<p class="pitfall">⚠️ Quên thừa số của quy tắc dây chuyền. d/dx ∫₁^(x²) sin t dt <em>không</em> phải sin(x²); thừa số 2x là bắt buộc vì cận trên chạy với tốc độ 2x chứ không phải 1.</p>`],

      [8, 'FTC Part 2 — evaluating with an antiderivative',
        `<p class="y-chinh">🎯 If F is <em>any</em> antiderivative of f on [a, b], then ∫ₐᵇ f(x) dx = F(b) − F(a) — no Riemann sums required.</p>
<ul>
<li><strong>The statement</strong> — ∫ₐᵇ f(x) dx = F(b) − F(a) = [F(x)]ₐᵇ, where F′ = f and f is continuous on [a, b].</li>
<li><strong>Why "any" antiderivative works</strong> — two antiderivatives differ by a constant C, and (F(b) + C) − (F(a) + C) = F(b) − F(a). The C cancels, which is why definite integrals carry no + C.</li>
<li><strong>Worked example, step 1</strong> — evaluate ∫₁³ x² dx. An antiderivative of x² is F(x) = x³/3 (check: F′ = 3x²/3 = x² ✓).</li>
<li><strong>Step 2</strong> — F(3) − F(1) = 27/3 − 1/3 = 9 − 1/3.</li>
<li><strong>Step 3 — answer</strong> — 9 − 1/3 = 27/3 − 1/3 = <strong>26/3 ≈ 8,67</strong>.</li>
<li><strong>Sanity check</strong> — x² on [1, 3] is between 1 and 9, so by the comparison rule the integral lies between 1·2 = 2 and 9·2 = 18. 8,67 fits comfortably.</li>
<li><strong>The whole algorithm</strong> — find F, evaluate at the top, evaluate at the bottom, subtract. Three lines replace an infinite limit of sums; that is why FTC2 is the most-used theorem in the course.</li>
</ul>
<p class="meo">💡 Write the bracket notation [F(x)]ₐᵇ before you substitute anything. It keeps b and a in the right order and stops the sign error that eats so many marks.</p>
<p class="pitfall">⚠️ FTC2 requires f continuous on the <em>whole</em> [a, b]. Applying it blindly to ∫₋₁¹ (1/x²) dx gives [−1/x]₋₁¹ = −1 − 1 = −2, an impossible negative answer for a positive function — see slide 16.</p>`,
        `<p class="y-chinh">🎯 Nếu F là <em>một</em> nguyên hàm bất kỳ của f trên [a, b] thì ∫ₐᵇ f(x) dx = F(b) − F(a) — không cần tổng Riemann nữa.</p>
<ul>
<li><strong>Phát biểu</strong> — ∫ₐᵇ f(x) dx = F(b) − F(a) = [F(x)]ₐᵇ, với F′ = f và f liên tục trên [a, b].</li>
<li><strong>Vì sao "bất kỳ" nguyên hàm nào cũng được</strong> — hai nguyên hàm chỉ lệch nhau một hằng số C, mà (F(b) + C) − (F(a) + C) = F(b) − F(a). Hằng C triệt tiêu, nên tích phân xác định không mang + C.</li>
<li><strong>Ví dụ đã giải, bước 1</strong> — tính ∫₁³ x² dx. Một nguyên hàm của x² là F(x) = x³/3 (kiểm lại: F′ = 3x²/3 = x² ✓).</li>
<li><strong>Bước 2</strong> — F(3) − F(1) = 27/3 − 1/3 = 9 − 1/3.</li>
<li><strong>Bước 3 — đáp số</strong> — 9 − 1/3 = 27/3 − 1/3 = <strong>26/3 ≈ 8,67</strong>.</li>
<li><strong>Kiểm tra hợp lý</strong> — x² trên [1, 3] nằm giữa 1 và 9, nên theo quy tắc so sánh tích phân nằm giữa 1·2 = 2 và 9·2 = 18. Số 8,67 nằm gọn trong đó.</li>
<li><strong>Toàn bộ thuật toán</strong> — tìm F, thay cận trên, thay cận dưới, trừ đi. Ba dòng thay cho cả một giới hạn vô hạn của các tổng; đó là lý do FTC2 là định lý được dùng nhiều nhất trong môn này.</li>
</ul>
<p class="meo">💡 Hãy viết ký hiệu ngoặc [F(x)]ₐᵇ trước khi thay bất cứ số nào. Nó giữ đúng thứ tự b rồi a và chặn đứng lỗi sai dấu vốn ngốn rất nhiều điểm.</p>
<p class="pitfall">⚠️ FTC2 đòi f liên tục trên <em>toàn bộ</em> [a, b]. Áp máy móc vào ∫₋₁¹ (1/x²) dx sẽ ra [−1/x]₋₁¹ = −1 − 1 = −2, một đáp số âm vô lý cho hàm dương — xem slide 16.</p>`],

      [9, 'Basic antiderivatives — the table you must know',
        `<p class="y-chinh">🎯 Six formulas that every later technique reduces to; know them in both directions, forwards as derivatives and backwards as integrals.</p>
<ul>
<li><strong>Power rule</strong> — ∫ xⁿ dx = x^(n+1)/(n+1) + C, valid for n ≠ −1. Raise the exponent by one, divide by the new exponent.</li>
<li><strong>The excluded case</strong> — ∫ (1/x) dx = ln|x| + C. The absolute value matters: 1/x is defined for negative x too, and d/dx ln|x| = 1/x on both branches.</li>
<li><strong>Exponential</strong> — ∫ eˣ dx = eˣ + C, the function that is its own antiderivative. More generally ∫ aˣ dx = aˣ/ln a + C.</li>
<li><strong>Sine</strong> — ∫ sin x dx = −cos x + C. The minus sign is the one people drop; check by differentiating: d/dx(−cos x) = sin x ✓.</li>
<li><strong>Cosine</strong> — ∫ cos x dx = sin x + C, with no sign change.</li>
<li><strong>Secant squared</strong> — ∫ sec²x dx = tan x + C. Companions worth memorising: ∫ 1/(1 + x²) dx = arctan x + C and ∫ 1/√(1 − x²) dx = arcsin x + C.</li>
<li><strong>Linear inside</strong> — if the argument is ax + b, divide by a: ∫ e^(3x) dx = e^(3x)/3 + C, ∫ sin 5x dx = −cos(5x)/5 + C. This is substitution done in your head.</li>
</ul>
<p class="meo">💡 Every antiderivative can be verified in one line by differentiating your answer. On an exam that check costs five seconds and catches nearly every sign and coefficient error.</p>
<p class="pitfall">⚠️ Two constant traps: writing ∫ x⁻¹ dx = x⁰/0 (division by zero — that is exactly why n ≠ −1), and dropping <strong>+ C</strong> on an indefinite integral. Without + C the answer is one antiderivative, not the family, and it is marked wrong.</p>`,
        `<p class="y-chinh">🎯 Sáu công thức mà mọi kỹ thuật về sau đều quy về; phải thuộc theo hai chiều, xuôi là đạo hàm và ngược là tích phân.</p>
<ul>
<li><strong>Quy tắc luỹ thừa</strong> — ∫ xⁿ dx = x^(n+1)/(n+1) + C, đúng với n ≠ −1. Tăng số mũ lên một rồi chia cho số mũ mới.</li>
<li><strong>Trường hợp bị loại trừ</strong> — ∫ (1/x) dx = ln|x| + C. Dấu trị tuyệt đối là bắt buộc: 1/x xác định cả với x âm, và d/dx ln|x| = 1/x trên cả hai nhánh.</li>
<li><strong>Hàm mũ</strong> — ∫ eˣ dx = eˣ + C, hàm duy nhất là nguyên hàm của chính nó. Tổng quát hơn: ∫ aˣ dx = aˣ/ln a + C.</li>
<li><strong>Sin</strong> — ∫ sin x dx = −cos x + C. Dấu trừ là thứ hay bị rơi; kiểm bằng cách lấy đạo hàm: d/dx(−cos x) = sin x ✓.</li>
<li><strong>Cos</strong> — ∫ cos x dx = sin x + C, không đổi dấu.</li>
<li><strong>Sec bình phương</strong> — ∫ sec²x dx = tan x + C. Hai người bạn nên thuộc kèm: ∫ 1/(1 + x²) dx = arctan x + C và ∫ 1/√(1 − x²) dx = arcsin x + C.</li>
<li><strong>Bên trong là hàm bậc nhất</strong> — nếu đối số là ax + b thì chia cho a: ∫ e^(3x) dx = e^(3x)/3 + C, ∫ sin 5x dx = −cos(5x)/5 + C. Đây là phép đổi biến làm nhẩm trong đầu.</li>
</ul>
<p class="meo">💡 Mọi nguyên hàm đều kiểm lại được trong một dòng bằng cách lấy đạo hàm kết quả. Trong phòng thi phép kiểm đó tốn năm giây và bắt được gần hết lỗi dấu lẫn lỗi hệ số.</p>
<p class="pitfall">⚠️ Hai cái bẫy kinh niên: viết ∫ x⁻¹ dx = x⁰/0 (chia cho 0 — đúng là lý do phải có n ≠ −1), và làm rơi <strong>+ C</strong> ở tích phân bất định. Thiếu + C thì đáp án chỉ là một nguyên hàm chứ không phải cả họ, và bị chấm sai.</p>`],

      [10, 'Net Change Theorem',
        `<p class="y-chinh">🎯 ∫ₐᵇ F′(x) dx = F(b) − F(a): integrating a <strong>rate of change</strong> gives the <strong>total change</strong> of the quantity.</p>
<ul>
<li><strong>The statement</strong> — it is FTC2 read from right to left. Nothing new mathematically; everything new in interpretation.</li>
<li><strong>Displacement</strong> — ∫_(t₁)^(t₂) v(t) dt = s(t₂) − s(t₁), the <em>net</em> change of position. Backward motion subtracts, so this can be negative or zero.</li>
<li><strong>Distance travelled</strong> — ∫_(t₁)^(t₂) |v(t)| dt, always ≥ 0, obtained by splitting at every time where v changes sign.</li>
<li><strong>Worked example</strong> — v(t) = t² − 4 m/s on [0, 3]. First find where v = 0: t = 2 (inside the interval), with v &lt; 0 on [0, 2) and v &gt; 0 on (2, 3].</li>
<li><strong>Displacement</strong> — ∫₀³ (t² − 4) dt = [t³/3 − 4t]₀³ = (9 − 12) − 0 = <strong>−3 m</strong>: the particle ends 3 m behind where it started.</li>
<li><strong>Distance, piece 1</strong> — on [0, 2] speed is 4 − t²: ∫₀² (4 − t²) dt = [4t − t³/3]₀² = 8 − 8/3 = 16/3.</li>
<li><strong>Distance, piece 2</strong> — on [2, 3]: ∫₂³ (t² − 4) dt = [t³/3 − 4t]₂³ = (9 − 12) − (8/3 − 8) = −3 + 16/3 = 7/3.</li>
<li><strong>Total distance</strong> — 16/3 + 7/3 = <strong>23/3 ≈ 7,67 m</strong>, much larger than the 3 m of net displacement.</li>
<li><strong>Other readings</strong> — ∫ C′(x) dx = total cost change from marginal cost; ∫ I(t) dt = charge from current; ∫ r(t) dt = volume from flow rate. Same theorem, different units.</li>
</ul>
<p class="meo">💡 Units are the fastest check: (m/s)·(s) = m, (A)·(s) = C. If the units of integrand × dx do not match the units of the answer you expected, you set up the wrong integral.</p>
<p class="pitfall">⚠️ Answering the "distance travelled" question with the plain integral of v. Any time v changes sign inside the interval the two answers differ — here 23/3 versus −3. Always solve v(t) = 0 first.</p>`,
        `<p class="y-chinh">🎯 ∫ₐᵇ F′(x) dx = F(b) − F(a): lấy tích phân của <strong>tốc độ thay đổi</strong> sẽ ra <strong>tổng biến thiên</strong> của đại lượng.</p>
<ul>
<li><strong>Phát biểu</strong> — đây chính là FTC2 đọc từ phải sang trái. Về toán thì không có gì mới; cái mới nằm ở cách diễn giải.</li>
<li><strong>Độ dời</strong> — ∫_(t₁)^(t₂) v(t) dt = s(t₂) − s(t₁), là biến thiên <em>thuần</em> của vị trí. Chuyển động lùi bị trừ đi, nên số này có thể âm hoặc bằng 0.</li>
<li><strong>Quãng đường đi được</strong> — ∫_(t₁)^(t₂) |v(t)| dt, luôn ≥ 0, tính bằng cách tách tại mọi thời điểm v đổi dấu.</li>
<li><strong>Ví dụ đã giải</strong> — v(t) = t² − 4 m/s trên [0, 3]. Trước hết tìm chỗ v = 0: t = 2 (nằm trong khoảng), với v &lt; 0 trên [0, 2) và v &gt; 0 trên (2, 3].</li>
<li><strong>Độ dời</strong> — ∫₀³ (t² − 4) dt = [t³/3 − 4t]₀³ = (9 − 12) − 0 = <strong>−3 m</strong>: vật kết thúc ở phía sau điểm xuất phát 3 m.</li>
<li><strong>Quãng đường, mảnh 1</strong> — trên [0, 2] tốc độ là 4 − t²: ∫₀² (4 − t²) dt = [4t − t³/3]₀² = 8 − 8/3 = 16/3.</li>
<li><strong>Quãng đường, mảnh 2</strong> — trên [2, 3]: ∫₂³ (t² − 4) dt = [t³/3 − 4t]₂³ = (9 − 12) − (8/3 − 8) = −3 + 16/3 = 7/3.</li>
<li><strong>Tổng quãng đường</strong> — 16/3 + 7/3 = <strong>23/3 ≈ 7,67 m</strong>, lớn hơn hẳn độ dời thuần 3 m.</li>
<li><strong>Các cách đọc khác</strong> — ∫ C′(x) dx = tổng biến thiên chi phí suy từ chi phí biên; ∫ I(t) dt = điện lượng suy từ dòng điện; ∫ r(t) dt = thể tích suy từ lưu lượng. Cùng một định lý, khác đơn vị.</li>
</ul>
<p class="meo">💡 Đơn vị là cách kiểm nhanh nhất: (m/s)·(s) = m, (A)·(s) = C. Nếu đơn vị của hàm dưới dấu tích phân nhân dx không khớp đơn vị đáp số mong đợi thì bạn đã lập sai tích phân.</p>
<p class="pitfall">⚠️ Trả lời câu "quãng đường đi được" bằng tích phân trơn của v. Hễ v đổi dấu bên trong khoảng là hai đáp số khác nhau — ở đây 23/3 so với −3. Luôn giải v(t) = 0 trước đã.</p>`],

      [11, 'Substitution method',
        `<p class="y-chinh">🎯 Spot a composite function: put u = g(x), du = g′(x) dx, and ∫ f(g(x))·g′(x) dx becomes the simple ∫ f(u) du.</p>
<ul>
<li><strong>The rule</strong> — ∫ f(g(x))·g′(x) dx = ∫ f(u) du with u = g(x). It is the chain rule for derivatives, run backwards.</li>
<li><strong>How to choose u</strong> — take the "inside" function: what sits under a root, inside a power, in an exponent, or in a denominator. Then check that its derivative appears (up to a constant factor) elsewhere in the integrand.</li>
<li><strong>Worked example, step 1</strong> — ∫ 2x(x² + 1)⁵ dx. The inside function is x² + 1, so set u = x² + 1.</li>
<li><strong>Step 2</strong> — du = 2x dx, and 2x dx is exactly the rest of the integrand. The substitution is a perfect fit, nothing left over.</li>
<li><strong>Step 3</strong> — the integral becomes ∫ u⁵ du = u⁶/6 + C.</li>
<li><strong>Step 4 — back-substitute</strong> — u = x² + 1 gives <strong>(x² + 1)⁶/6 + C</strong>. Check by differentiating: 6(x² + 1)⁵·2x/6 = 2x(x² + 1)⁵ ✓.</li>
<li><strong>When the constant does not match</strong> — for ∫ x(x² + 1)⁵ dx, du = 2x dx means x dx = du/2, so the answer is (x² + 1)⁶/12 + C. Constants can always be fixed; a missing variable factor cannot.</li>
<li><strong>Classic patterns</strong> — ∫ g′/g dx = ln|g| + C · ∫ e^(g)·g′ dx = e^(g) + C · ∫ tan x dx = −ln|cos x| + C (u = cos x).</li>
</ul>
<p class="meo">💡 Substitution only works if du absorbs <em>every</em> leftover x. If an x survives after substituting, either solve x in terms of u, or the substitution was the wrong choice.</p>
<p class="pitfall">⚠️ Leaving the answer in terms of u on an indefinite integral. The question was asked in x, so the answer must be in x — always back-substitute, and never forget the + C.</p>`,
        `<p class="y-chinh">🎯 Nhận diện hàm hợp: đặt u = g(x), du = g′(x) dx, và ∫ f(g(x))·g′(x) dx trở thành ∫ f(u) du đơn giản.</p>
<ul>
<li><strong>Quy tắc</strong> — ∫ f(g(x))·g′(x) dx = ∫ f(u) du với u = g(x). Đây chính là quy tắc dây chuyền của đạo hàm chạy ngược.</li>
<li><strong>Chọn u thế nào</strong> — lấy hàm "bên trong": thứ nằm dưới căn, trong luỹ thừa, trên số mũ, hoặc dưới mẫu. Rồi kiểm xem đạo hàm của nó có xuất hiện (sai khác một hằng số) ở chỗ khác trong biểu thức không.</li>
<li><strong>Ví dụ đã giải, bước 1</strong> — ∫ 2x(x² + 1)⁵ dx. Hàm bên trong là x² + 1, nên đặt u = x² + 1.</li>
<li><strong>Bước 2</strong> — du = 2x dx, mà 2x dx đúng bằng phần còn lại của biểu thức. Phép đặt khớp hoàn hảo, không thừa gì cả.</li>
<li><strong>Bước 3</strong> — tích phân thành ∫ u⁵ du = u⁶/6 + C.</li>
<li><strong>Bước 4 — trả về biến cũ</strong> — u = x² + 1 cho <strong>(x² + 1)⁶/6 + C</strong>. Kiểm bằng đạo hàm: 6(x² + 1)⁵·2x/6 = 2x(x² + 1)⁵ ✓.</li>
<li><strong>Khi hằng số không khớp</strong> — với ∫ x(x² + 1)⁵ dx thì du = 2x dx nghĩa là x dx = du/2, nên đáp số là (x² + 1)⁶/12 + C. Hằng số luôn chỉnh được; thiếu một thừa số chứa biến thì không.</li>
<li><strong>Các dạng kinh điển</strong> — ∫ g′/g dx = ln|g| + C · ∫ e^(g)·g′ dx = e^(g) + C · ∫ tan x dx = −ln|cos x| + C (đặt u = cos x).</li>
</ul>
<p class="meo">💡 Đổi biến chỉ chạy được khi du nuốt trọn <em>mọi</em> chữ x còn sót. Nếu sau khi thay mà vẫn còn x, thì hoặc phải giải x theo u, hoặc phép đặt đã chọn sai.</p>
<p class="pitfall">⚠️ Để nguyên đáp án theo u ở tích phân bất định. Đề hỏi theo x thì đáp án phải theo x — luôn trả về biến cũ, và đừng bao giờ quên + C.</p>`],

      [12, 'Substitution with definite integrals — change the limits',
        `<p class="y-chinh">🎯 With a definite integral you may convert the limits to u as well; then you never return to x.</p>
<ul>
<li><strong>The rule</strong> — ∫ₐᵇ f(g(x))g′(x) dx = ∫_(g(a))^(g(b)) f(u) du. The limits travel through g just like the variable does.</li>
<li><strong>Worked example</strong> — ∫₀¹ 2x(x² + 1)⁵ dx with u = x² + 1, du = 2x dx (the same substitution as slide 11).</li>
<li><strong>Step 1 — new limits</strong> — x = 0 ⇒ u = 0² + 1 = 1, and x = 1 ⇒ u = 1² + 1 = 2. The limits become 1 and 2, not 0 and 1.</li>
<li><strong>Step 2</strong> — the integral is now ∫₁² u⁵ du = [u⁶/6]₁².</li>
<li><strong>Step 3</strong> — 2⁶/6 − 1⁶/6 = 64/6 − 1/6 = <strong>63/6 = 21/2 = 10,5</strong>.</li>
<li><strong>Cross-check the other way</strong> — back-substituting instead gives [(x² + 1)⁶/6]₀¹ = 64/6 − 1/6 = 63/6. Same answer, more writing.</li>
<li><strong>Which method to pick</strong> — changing the limits is shorter and avoids the messy back-substitution; keeping x is safer if you already wrote the antiderivative in x.</li>
<li><strong>Symmetry bonus</strong> — over a symmetric interval [−a, a]: if f is even then ∫₋ₐᵃ f = 2∫₀ᵃ f; if f is odd then ∫₋ₐᵃ f = 0. Checking parity first can end the problem in one line.</li>
</ul>
<p class="meo">💡 Once the limits are in u, write them immediately as ∫₁² — before doing any integration. Delaying that step is exactly when people forget it.</p>
<p class="pitfall">⚠️ The signature error: substituting u but keeping the old limits, i.e. writing [u⁶/6]₀¹ = 1/6. Either change <em>both</em> the variable and the limits, or change neither and back-substitute.</p>`,
        `<p class="y-chinh">🎯 Với tích phân xác định, bạn có thể đổi luôn cả cận sang u; khi đó không cần quay lại biến x nữa.</p>
<ul>
<li><strong>Quy tắc</strong> — ∫ₐᵇ f(g(x))g′(x) dx = ∫_(g(a))^(g(b)) f(u) du. Hai cận đi qua g y như biến số đi qua g.</li>
<li><strong>Ví dụ đã giải</strong> — ∫₀¹ 2x(x² + 1)⁵ dx với u = x² + 1, du = 2x dx (đúng phép đặt của slide 11).</li>
<li><strong>Bước 1 — cận mới</strong> — x = 0 ⇒ u = 0² + 1 = 1, và x = 1 ⇒ u = 1² + 1 = 2. Hai cận thành 1 và 2, không còn là 0 và 1.</li>
<li><strong>Bước 2</strong> — tích phân giờ là ∫₁² u⁵ du = [u⁶/6]₁².</li>
<li><strong>Bước 3</strong> — 2⁶/6 − 1⁶/6 = 64/6 − 1/6 = <strong>63/6 = 21/2 = 10,5</strong>.</li>
<li><strong>Đối chiếu bằng cách kia</strong> — nếu trả về biến cũ thì được [(x² + 1)⁶/6]₀¹ = 64/6 − 1/6 = 63/6. Cùng đáp số, chỉ viết dài hơn.</li>
<li><strong>Chọn cách nào</strong> — đổi cận thì ngắn hơn và tránh được bước trả biến lằng nhằng; giữ x thì an toàn hơn nếu bạn đã lỡ viết nguyên hàm theo x.</li>
<li><strong>Phần thưởng đối xứng</strong> — trên khoảng đối xứng [−a, a]: nếu f chẵn thì ∫₋ₐᵃ f = 2∫₀ᵃ f; nếu f lẻ thì ∫₋ₐᵃ f = 0. Kiểm tính chẵn lẻ trước có thể kết thúc bài trong một dòng.</li>
</ul>
<p class="meo">💡 Vừa đổi cận sang u xong thì viết ngay thành ∫₁² — trước khi tính bất cứ thứ gì. Chính lúc trì hoãn bước đó là lúc người ta quên.</p>
<p class="pitfall">⚠️ Lỗi đặc trưng: đã thay u mà vẫn giữ cận cũ, tức viết [u⁶/6]₀¹ = 1/6. Hoặc đổi <em>cả hai</em> biến lẫn cận, hoặc không đổi gì rồi trả về biến cũ.</p>`],

      [13, 'Integration by parts',
        `<p class="y-chinh">🎯 ∫ u dv = uv − ∫ v du turns a hard product into an easier one; choose u by the LIATE order.</p>
<ul>
<li><strong>Where it comes from</strong> — the product rule (uv)′ = u′v + uv′, integrated and rearranged. It is to products what substitution is to compositions.</li>
<li><strong>LIATE — the priority for choosing u</strong> — <strong>L</strong>ogarithmic, <strong>I</strong>nverse trig, <strong>A</strong>lgebraic, <strong>T</strong>rigonometric, <strong>E</strong>xponential. Whichever type appears earlier in that list becomes u; the rest is dv.</li>
<li><strong>Why that order works</strong> — u should get <em>simpler</em> when differentiated and dv should be easy to integrate. ln x and arctan x have no elementary antiderivative but nice derivatives, so they must be u.</li>
<li><strong>Worked example, step 1</strong> — ∫ x eˣ dx. Algebraic (x) beats Exponential (eˣ) in LIATE, so u = x and dv = eˣ dx.</li>
<li><strong>Step 2</strong> — du = dx and v = ∫ eˣ dx = eˣ.</li>
<li><strong>Step 3</strong> — apply the formula: x eˣ − ∫ eˣ dx = <strong>x eˣ − eˣ + C</strong> = eˣ(x − 1) + C. Check: eˣ(x − 1) + eˣ = x eˣ ✓.</li>
<li><strong>The ln trick</strong> — ∫ ln x dx looks like a single function, but take u = ln x, dv = dx: then du = dx/x, v = x, giving x ln x − ∫ 1 dx = <strong>x ln x − x + C</strong>.</li>
<li><strong>Repeat when needed</strong> — ∫ x² eˣ dx needs parts twice (the power drops by one each time) and gives eˣ(x² − 2x + 2) + C. For definite integrals the formula reads [uv]ₐᵇ − ∫ₐᵇ v du.</li>
</ul>
<p class="meo">💡 If the new integral ∫ v du looks <em>worse</em> than the original, you picked u and dv the wrong way round. Swap them and try again before doing anything clever.</p>
<p class="pitfall">⚠️ Two frequent losses: forgetting the minus sign in front of ∫ v du, and on a definite integral evaluating only the ∫ v du part while leaving uv un-evaluated at the limits.</p>`,
        `<p class="y-chinh">🎯 ∫ u dv = uv − ∫ v du biến một tích khó thành một tích dễ hơn; chọn u theo thứ tự LIATE.</p>
<ul>
<li><strong>Nó từ đâu ra</strong> — từ quy tắc tích (uv)′ = u′v + uv′, lấy tích phân rồi chuyển vế. Nó dành cho tích, đúng như đổi biến dành cho hàm hợp.</li>
<li><strong>LIATE — thứ tự ưu tiên chọn u</strong> — <strong>L</strong>ogarit, <strong>I</strong>nverse (lượng giác ngược), <strong>A</strong>lgebraic (đa thức), <strong>T</strong>rig (lượng giác), <strong>E</strong>xponential (hàm mũ). Loại nào đứng trước trong danh sách thì làm u; phần còn lại là dv.</li>
<li><strong>Vì sao thứ tự đó đúng</strong> — u phải <em>đơn giản đi</em> khi lấy đạo hàm, còn dv phải dễ lấy tích phân. ln x và arctan x không có nguyên hàm sơ cấp nhưng đạo hàm rất đẹp, nên bắt buộc làm u.</li>
<li><strong>Ví dụ đã giải, bước 1</strong> — ∫ x eˣ dx. Đa thức (x) đứng trước hàm mũ (eˣ) trong LIATE, nên u = x và dv = eˣ dx.</li>
<li><strong>Bước 2</strong> — du = dx và v = ∫ eˣ dx = eˣ.</li>
<li><strong>Bước 3</strong> — áp công thức: x eˣ − ∫ eˣ dx = <strong>x eˣ − eˣ + C</strong> = eˣ(x − 1) + C. Kiểm lại: eˣ(x − 1) + eˣ = x eˣ ✓.</li>
<li><strong>Mẹo với ln</strong> — ∫ ln x dx nhìn như chỉ có một hàm, nhưng lấy u = ln x, dv = dx: khi đó du = dx/x, v = x, cho x ln x − ∫ 1 dx = <strong>x ln x − x + C</strong>.</li>
<li><strong>Lặp lại khi cần</strong> — ∫ x² eˣ dx phải dùng từng phần hai lần (bậc giảm một mỗi lần) và ra eˣ(x² − 2x + 2) + C. Với tích phân xác định thì công thức là [uv]ₐᵇ − ∫ₐᵇ v du.</li>
</ul>
<p class="meo">💡 Nếu tích phân mới ∫ v du trông còn <em>tệ hơn</em> cái ban đầu thì bạn đã chọn ngược u và dv. Hãy đổi chỗ chúng rồi thử lại trước khi nghĩ ra mẹo gì cao siêu.</p>
<p class="pitfall">⚠️ Hai chỗ mất điểm thường xuyên: quên dấu trừ trước ∫ v du, và ở tích phân xác định chỉ tính phần ∫ v du mà để nguyên uv chưa thay cận.</p>`],

      [14, 'Numerical integration — trapezoid and Simpson',
        `<p class="y-chinh">🎯 When no closed-form antiderivative exists, approximate the integral from sampled values with the trapezoid or Simpson rule.</p>
<ul>
<li><strong>Why it is needed</strong> — functions like e^(−x²), (sin x)/x and √(1 + x³) have no elementary antiderivative at all. Tabulated experimental data has no formula either.</li>
<li><strong>Trapezoid rule</strong> — Tₙ = (Δx/2)[f₀ + 2f₁ + 2f₂ + … + 2f_(n−1) + fₙ]. Coefficients are 1, 2, 2, …, 2, 1: only the two ends are single.</li>
<li><strong>Simpson's rule</strong> — Sₙ = (Δx/3)[f₀ + 4f₁ + 2f₂ + 4f₃ + … + 4f_(n−1) + fₙ], with alternating 4 and 2, and <strong>n must be even</strong>. It fits parabolas through triples of points instead of straight lines.</li>
<li><strong>Worked example</strong> — approximate ∫₁² (1/x) dx with n = 4, so Δx = 0,25 and the nodes are 1; 1,25; 1,5; 1,75; 2 with f = 1; 0,8; 0,666667; 0,571429; 0,5.</li>
<li><strong>Trapezoid</strong> — T₄ = (0,25/2)[1 + 2(0,8) + 2(0,666667) + 2(0,571429) + 0,5] = 0,125 × 5,576190 = <strong>0,697024</strong>.</li>
<li><strong>Simpson</strong> — S₄ = (0,25/3)[1 + 4(0,8) + 2(0,666667) + 4(0,571429) + 0,5] = 0,083333 × 8,319048 = <strong>0,693254</strong>.</li>
<li><strong>Compare to the truth</strong> — the exact value is ln 2 = 0,693147. Simpson is off by 0,0001, the trapezoid by 0,0039: about 36 times better for the same five data points.</li>
<li><strong>Error behaviour</strong> — trapezoid error shrinks like 1/n², Simpson like 1/n⁴. Doubling n divides the trapezoid error by 4 and Simpson's by 16.</li>
</ul>
<p class="meo">💡 Check the coefficient pattern before you multiply: trapezoid 1-2-2-…-2-1 divided by 2, Simpson 1-4-2-4-…-4-1 divided by 3. The coefficients must sum to 2n (trapezoid) and 3n (Simpson).</p>
<p class="pitfall">⚠️ Using Simpson with an odd n, or starting the alternation with 2 instead of 4. Both wreck the answer silently, since the sum still looks perfectly plausible.</p>`,
        `<p class="y-chinh">🎯 Khi không tìm được nguyên hàm dạng đóng, hãy xấp xỉ tích phân từ các giá trị lấy mẫu bằng quy tắc hình thang hoặc Simpson.</p>
<ul>
<li><strong>Vì sao cần đến</strong> — những hàm như e^(−x²), (sin x)/x và √(1 + x³) hoàn toàn không có nguyên hàm sơ cấp. Dữ liệu thực nghiệm dạng bảng cũng chẳng có công thức nào.</li>
<li><strong>Quy tắc hình thang</strong> — Tₙ = (Δx/2)[f₀ + 2f₁ + 2f₂ + … + 2f_(n−1) + fₙ]. Hệ số là 1, 2, 2, …, 2, 1: chỉ hai đầu mút mang hệ số 1.</li>
<li><strong>Quy tắc Simpson</strong> — Sₙ = (Δx/3)[f₀ + 4f₁ + 2f₂ + 4f₃ + … + 4f_(n−1) + fₙ], hệ số 4 và 2 xen kẽ, và <strong>n bắt buộc chẵn</strong>. Nó khớp parabol qua từng bộ ba điểm thay vì khớp đường thẳng.</li>
<li><strong>Ví dụ đã giải</strong> — xấp xỉ ∫₁² (1/x) dx với n = 4, nên Δx = 0,25 và các nút là 1; 1,25; 1,5; 1,75; 2 với f = 1; 0,8; 0,666667; 0,571429; 0,5.</li>
<li><strong>Hình thang</strong> — T₄ = (0,25/2)[1 + 2(0,8) + 2(0,666667) + 2(0,571429) + 0,5] = 0,125 × 5,576190 = <strong>0,697024</strong>.</li>
<li><strong>Simpson</strong> — S₄ = (0,25/3)[1 + 4(0,8) + 2(0,666667) + 4(0,571429) + 0,5] = 0,083333 × 8,319048 = <strong>0,693254</strong>.</li>
<li><strong>So với giá trị thật</strong> — giá trị chính xác là ln 2 = 0,693147. Simpson lệch 0,0001, hình thang lệch 0,0039: chính xác hơn khoảng 36 lần với cùng năm điểm dữ liệu.</li>
<li><strong>Cách sai số giảm</strong> — sai số hình thang giảm theo 1/n², của Simpson theo 1/n⁴. Tăng n gấp đôi thì sai số hình thang chia 4, còn Simpson chia 16.</li>
</ul>
<p class="meo">💡 Kiểm bộ hệ số trước khi nhân: hình thang 1-2-2-…-2-1 chia cho 2, Simpson 1-4-2-4-…-4-1 chia cho 3. Tổng các hệ số phải bằng 2n (hình thang) và 3n (Simpson).</p>
<p class="pitfall">⚠️ Dùng Simpson với n lẻ, hoặc bắt đầu chuỗi xen kẽ bằng 2 thay vì 4. Cả hai đều làm hỏng đáp số một cách im lặng, vì tổng nhìn vẫn hợp lý như thường.</p>`],

      [15, 'Improper integrals — Type 1: infinite limits',
        `<p class="y-chinh">🎯 When a limit of integration is ±∞, replace it by a finite t, integrate, then take the limit as t → ∞.</p>
<ul>
<li><strong>The definition</strong> — ∫ₐ^∞ f(x) dx = lim (t→∞) ∫ₐᵗ f(x) dx. Symmetrically, ∫_(−∞)^b f(x) dx = lim (t→−∞) ∫ₜᵇ f(x) dx.</li>
<li><strong>Converge or diverge</strong> — if the limit is a finite number the integral <strong>converges</strong> to that number; if the limit is ±∞ or does not exist, it <strong>diverges</strong>.</li>
<li><strong>Worked example, step 1</strong> — ∫₁^∞ (1/x²) dx = lim (t→∞) ∫₁ᵗ x⁻² dx = lim (t→∞) [−1/x]₁ᵗ.</li>
<li><strong>Step 2</strong> — [−1/x]₁ᵗ = −1/t + 1, so the limit is lim (t→∞) (1 − 1/t) = <strong>1</strong>. The integral converges, and the infinite region has finite area 1.</li>
<li><strong>Contrast</strong> — ∫₁^∞ (1/x) dx = lim (t→∞) [ln x]₁ᵗ = lim ln t = ∞, so it <strong>diverges</strong>, even though 1/x → 0 too. Tending to zero is not enough; it must tend to zero fast enough.</li>
<li><strong>The p-test</strong> — ∫₁^∞ x^(−p) dx converges ⟺ p &gt; 1, and the value is 1/(p − 1). Here p = 2 gives 1/(2 − 1) = 1 ✓, while p = 1 is the borderline divergent case.</li>
<li><strong>Both limits infinite</strong> — ∫_(−∞)^∞ f = ∫_(−∞)^c f + ∫_c^∞ f for any c, and it converges only if <em>both</em> halves converge separately.</li>
<li><strong>Comparison test</strong> — if 0 ≤ f ≤ g and ∫ g converges, then ∫ f converges; if ∫ f diverges, so does ∫ g. That settles e^(−x²) ≤ e^(−x) on [1, ∞) without any antiderivative.</li>
</ul>
<p class="meo">💡 Always write the "lim (t→∞)" symbol on every line until you actually take the limit. Examiners give marks for that notation, and it stops you substituting ∞ as if it were a number.</p>
<p class="pitfall">⚠️ Writing [−1/x]₁^∞ = 0 + 1 directly. It gets the right number here but is not a valid argument, and on ∫_(−∞)^∞ x dx the same shortcut produces the wrong answer 0 for a divergent integral.</p>`,
        `<p class="y-chinh">🎯 Khi một cận tích phân là ±∞, hãy thay nó bằng số hữu hạn t, lấy tích phân, rồi cho t → ∞.</p>
<ul>
<li><strong>Định nghĩa</strong> — ∫ₐ^∞ f(x) dx = lim (t→∞) ∫ₐᵗ f(x) dx. Đối xứng lại: ∫_(−∞)^b f(x) dx = lim (t→−∞) ∫ₜᵇ f(x) dx.</li>
<li><strong>Hội tụ hay phân kỳ</strong> — nếu giới hạn là số hữu hạn thì tích phân <strong>hội tụ</strong> về số đó; nếu giới hạn là ±∞ hoặc không tồn tại thì tích phân <strong>phân kỳ</strong>.</li>
<li><strong>Ví dụ đã giải, bước 1</strong> — ∫₁^∞ (1/x²) dx = lim (t→∞) ∫₁ᵗ x⁻² dx = lim (t→∞) [−1/x]₁ᵗ.</li>
<li><strong>Bước 2</strong> — [−1/x]₁ᵗ = −1/t + 1, nên giới hạn là lim (t→∞) (1 − 1/t) = <strong>1</strong>. Tích phân hội tụ, và miền vô hạn đó có diện tích hữu hạn bằng 1.</li>
<li><strong>Đối chiếu</strong> — ∫₁^∞ (1/x) dx = lim (t→∞) [ln x]₁ᵗ = lim ln t = ∞, nên nó <strong>phân kỳ</strong>, dù 1/x cũng → 0. Tiến về 0 thôi chưa đủ; phải tiến về 0 đủ nhanh.</li>
<li><strong>Tiêu chuẩn p</strong> — ∫₁^∞ x^(−p) dx hội tụ ⟺ p &gt; 1, và giá trị bằng 1/(p − 1). Ở đây p = 2 cho 1/(2 − 1) = 1 ✓, còn p = 1 đúng là trường hợp ranh giới phân kỳ.</li>
<li><strong>Cả hai cận đều vô hạn</strong> — ∫_(−∞)^∞ f = ∫_(−∞)^c f + ∫_c^∞ f với c bất kỳ, và nó chỉ hội tụ khi <em>cả hai</em> nửa cùng hội tụ riêng rẽ.</li>
<li><strong>Tiêu chuẩn so sánh</strong> — nếu 0 ≤ f ≤ g và ∫ g hội tụ thì ∫ f hội tụ; nếu ∫ f phân kỳ thì ∫ g cũng phân kỳ. Điều đó giải quyết e^(−x²) ≤ e^(−x) trên [1, ∞) mà không cần nguyên hàm nào.</li>
</ul>
<p class="meo">💡 Luôn viết ký hiệu "lim (t→∞)" ở mọi dòng cho tới khi thật sự lấy giới hạn. Giám khảo cho điểm ở chính ký hiệu đó, và nó ngăn bạn thay ∞ vào như thể ∞ là một con số.</p>
<p class="pitfall">⚠️ Viết thẳng [−1/x]₁^∞ = 0 + 1. Ở đây ra đúng số nhưng lập luận không hợp lệ, và với ∫_(−∞)^∞ x dx thì đúng đường tắt ấy cho đáp số sai là 0 cho một tích phân phân kỳ.</p>`],

      [16, 'Improper integrals — Type 2: unbounded integrand',
        `<p class="y-chinh">🎯 When f blows up at an endpoint, pull that endpoint back to t and take a one-sided limit.</p>
<ul>
<li><strong>The definition</strong> — if f has a vertical asymptote at a, then ∫ₐᵇ f(x) dx = lim (t→a⁺) ∫ₜᵇ f(x) dx. If the blow-up is at b, use lim (t→b⁻) ∫ₐᵗ instead.</li>
<li><strong>Worked example, step 1</strong> — ∫₀¹ (1/√x) dx. The integrand → ∞ as x → 0⁺, so this is improper at the lower limit: rewrite as lim (t→0⁺) ∫ₜ¹ x^(−1/2) dx.</li>
<li><strong>Step 2</strong> — an antiderivative of x^(−1/2) is 2√x, so the inner integral is [2√x]ₜ¹ = 2 − 2√t.</li>
<li><strong>Step 3</strong> — lim (t→0⁺) (2 − 2√t) = <strong>2</strong>. It converges: an infinitely tall region with finite area 2.</li>
<li><strong>Contrast</strong> — ∫₀¹ (1/x) dx = lim (t→0⁺) [ln x]ₜ¹ = lim (0 − ln t) = +∞, so it diverges.</li>
<li><strong>The p-test, mirrored</strong> — ∫₀¹ x^(−p) dx converges ⟺ p &lt; 1, the exact opposite of the Type 1 rule on slide 15. Here p = 1/2 &lt; 1 ✓ converges, p = 1 diverges.</li>
<li><strong>Blow-up inside the interval</strong> — if the trouble point c is strictly between a and b, split: ∫ₐᵇ f = ∫ₐᶜ f + ∫_c^b f, and both pieces must converge on their own.</li>
<li><strong>Why splitting is not optional</strong> — for ∫₋₁¹ (1/x²) dx, blind use of FTC2 gives [−1/x]₋₁¹ = −1 − 1 = −2, negative for a strictly positive function. Splitting at 0 shows both halves diverge, so the integral <strong>diverges</strong>.</li>
</ul>
<p class="meo">💡 Before integrating anything, scan for two danger signs: an infinite limit (Type 1) and a zero denominator or a root of zero inside [a, b] (Type 2). Only then choose your method.</p>
<p class="pitfall">⚠️ Not noticing the integral is improper at all. The FTC2 bracket notation happily produces a finite-looking number for a divergent integral — that −2 above is the classic exam trap, and it costs the whole question.</p>`,
        `<p class="y-chinh">🎯 Khi f vọt lên vô cực tại một đầu mút, hãy kéo đầu mút đó lùi về t rồi lấy giới hạn một phía.</p>
<ul>
<li><strong>Định nghĩa</strong> — nếu f có tiệm cận đứng tại a thì ∫ₐᵇ f(x) dx = lim (t→a⁺) ∫ₜᵇ f(x) dx. Nếu chỗ vọt nằm ở b thì dùng lim (t→b⁻) ∫ₐᵗ.</li>
<li><strong>Ví dụ đã giải, bước 1</strong> — ∫₀¹ (1/√x) dx. Hàm dưới dấu tích phân → ∞ khi x → 0⁺, nên đây là tích phân suy rộng ở cận dưới: viết lại thành lim (t→0⁺) ∫ₜ¹ x^(−1/2) dx.</li>
<li><strong>Bước 2</strong> — một nguyên hàm của x^(−1/2) là 2√x, nên tích phân bên trong bằng [2√x]ₜ¹ = 2 − 2√t.</li>
<li><strong>Bước 3</strong> — lim (t→0⁺) (2 − 2√t) = <strong>2</strong>. Nó hội tụ: một miền cao vô hạn mà diện tích hữu hạn bằng 2.</li>
<li><strong>Đối chiếu</strong> — ∫₀¹ (1/x) dx = lim (t→0⁺) [ln x]ₜ¹ = lim (0 − ln t) = +∞, nên nó phân kỳ.</li>
<li><strong>Tiêu chuẩn p, soi gương</strong> — ∫₀¹ x^(−p) dx hội tụ ⟺ p &lt; 1, ngược hẳn với quy tắc loại 1 ở slide 15. Ở đây p = 1/2 &lt; 1 ✓ nên hội tụ, còn p = 1 thì phân kỳ.</li>
<li><strong>Chỗ vọt nằm bên trong khoảng</strong> — nếu điểm xấu c nằm hẳn giữa a và b thì phải tách: ∫ₐᵇ f = ∫ₐᶜ f + ∫_c^b f, và cả hai mảnh đều phải hội tụ riêng.</li>
<li><strong>Vì sao tách là bắt buộc</strong> — với ∫₋₁¹ (1/x²) dx, dùng FTC2 một cách mù quáng cho [−1/x]₋₁¹ = −1 − 1 = −2, tức số âm cho một hàm dương ngặt. Tách tại 0 sẽ thấy cả hai nửa cùng phân kỳ, nên tích phân <strong>phân kỳ</strong>.</li>
</ul>
<p class="meo">💡 Trước khi tính bất cứ thứ gì, hãy quét hai dấu hiệu nguy hiểm: cận vô hạn (loại 1) và mẫu bằng 0 hoặc căn của 0 nằm trong [a, b] (loại 2). Xong rồi mới chọn phương pháp.</p>
<p class="pitfall">⚠️ Không nhận ra tích phân là suy rộng ngay từ đầu. Ký hiệu ngoặc của FTC2 vẫn vui vẻ nhả ra một con số trông hữu hạn cho tích phân phân kỳ — số −2 ở trên là bẫy kinh điển trong đề, và nó lấy trọn điểm câu đó.</p>`],

      [17, 'Summary — five things to carry out of Chapter 4',
        `<p class="y-chinh">🎯 Five statements. If you can say all five without notes, Chapter 4 is done.</p>
<ol>
<li><strong>Area ⇒ Riemann sum ⇒ definite integral</strong> — cut [a, b] into n strips of width Δx = (b − a)/n, sum f(x_i*)Δx, let n → ∞. For x² on [0, 1] the sums L₄ = 7/32 and R₄ = 15/32 bracket the exact value 1/3. The integral is <em>signed</em> area, which is why ∫₀^(2π) sin x dx = 0 while the geometric area is 4.</li>
<li><strong>FTC links derivative and integral</strong> — FTC1: d/dx ∫ₐˣ f(t) dt = f(x), with a chain-rule factor when the upper limit moves (sin(x²)·2x). FTC2: ∫ₐᵇ f = F(b) − F(a), so ∫₁³ x² dx = 9 − 1/3 = 26/3. Read backwards it is the Net Change Theorem: ∫ v dt = displacement (−3 m), ∫ |v| dt = distance (23/3 m).</li>
<li><strong>Composite ⇒ substitution; product of two different types ⇒ by parts</strong> — u = x² + 1 turns ∫ 2x(x² + 1)⁵ dx into (x² + 1)⁶/6 + C; on a definite integral change the limits too (1 → 2) and get 63/6. LIATE picks u for ∫ u dv = uv − ∫ v du, giving ∫ x eˣ dx = x eˣ − eˣ + C and ∫ ln x dx = x ln x − x + C.</li>
<li><strong>No closed form ⇒ trapezoid or Simpson</strong> — Tₙ uses coefficients 1-2-…-2-1 over 2, Sₙ uses 1-4-2-…-4-1 over 3 with n even. For ∫₁²(1/x)dx with n = 4: T₄ = 0,697024, S₄ = 0,693254, exact ln 2 = 0,693147.</li>
<li><strong>Infinite limit or unbounded function ⇒ improper, take a limit</strong> — ∫₁^∞ x⁻² dx = 1 converges (p &gt; 1) while ∫₁^∞ x⁻¹ dx diverges; ∫₀¹ x^(−1/2) dx = 2 converges (p &lt; 1) while ∫₀¹ x⁻¹ dx diverges. Split at any interior blow-up before applying FTC2.</li>
</ol>
<p class="meo">💡 One workflow for any integral: check for improperness first → try the basic table → look for an inside function whose derivative is present (substitution) → look for a product of two types (parts) → if nothing works, go numerical.</p>
<p class="pitfall">⚠️ The four marks lost most often: dropping + C on an indefinite integral, keeping the old limits after substituting u, confusing signed integral with geometric area, and applying FTC2 across a point where the integrand is undefined.</p>`,
        `<p class="y-chinh">🎯 Năm câu. Nói được cả năm câu mà không cần nhìn tài liệu là xong Chương 4.</p>
<ol>
<li><strong>Diện tích ⇒ tổng Riemann ⇒ tích phân xác định</strong> — chia [a, b] thành n dải bề rộng Δx = (b − a)/n, cộng f(x_i*)Δx, rồi cho n → ∞. Với x² trên [0, 1], hai tổng L₄ = 7/32 và R₄ = 15/32 kẹp lấy giá trị chính xác 1/3. Tích phân là diện tích <em>có dấu</em>, nên ∫₀^(2π) sin x dx = 0 trong khi diện tích hình học bằng 4.</li>
<li><strong>FTC nối đạo hàm và tích phân</strong> — FTC1: d/dx ∫ₐˣ f(t) dt = f(x), kèm thừa số dây chuyền khi cận trên di động (sin(x²)·2x). FTC2: ∫ₐᵇ f = F(b) − F(a), nên ∫₁³ x² dx = 9 − 1/3 = 26/3. Đọc ngược lại chính là định lý biến thiên thuần: ∫ v dt = độ dời (−3 m), ∫ |v| dt = quãng đường (23/3 m).</li>
<li><strong>Hàm hợp ⇒ đổi biến; tích của hai loại hàm khác nhau ⇒ từng phần</strong> — đặt u = x² + 1 biến ∫ 2x(x² + 1)⁵ dx thành (x² + 1)⁶/6 + C; với tích phân xác định thì đổi luôn cận (1 → 2) và được 63/6. LIATE chọn u cho ∫ u dv = uv − ∫ v du, cho ∫ x eˣ dx = x eˣ − eˣ + C và ∫ ln x dx = x ln x − x + C.</li>
<li><strong>Không có dạng đóng ⇒ hình thang hoặc Simpson</strong> — Tₙ dùng hệ số 1-2-…-2-1 chia 2, Sₙ dùng 1-4-2-…-4-1 chia 3 với n chẵn. Với ∫₁²(1/x)dx và n = 4: T₄ = 0,697024, S₄ = 0,693254, giá trị thật ln 2 = 0,693147.</li>
<li><strong>Cận vô hạn hoặc hàm không bị chặn ⇒ suy rộng, phải lấy giới hạn</strong> — ∫₁^∞ x⁻² dx = 1 hội tụ (p &gt; 1) còn ∫₁^∞ x⁻¹ dx phân kỳ; ∫₀¹ x^(−1/2) dx = 2 hội tụ (p &lt; 1) còn ∫₀¹ x⁻¹ dx phân kỳ. Hãy tách tại mọi điểm vọt nằm bên trong trước khi áp FTC2.</li>
</ol>
<p class="meo">💡 Một quy trình cho mọi tích phân: kiểm xem có suy rộng không trước đã → thử bảng nguyên hàm cơ bản → tìm hàm bên trong mà đạo hàm của nó có mặt (đổi biến) → tìm tích của hai loại hàm (từng phần) → không được nữa thì chuyển sang tích phân số.</p>
<p class="pitfall">⚠️ Bốn chỗ mất điểm nhiều nhất: rơi + C ở tích phân bất định, giữ cận cũ sau khi đã thay u, lẫn tích phân có dấu với diện tích hình học, và áp FTC2 xuyên qua điểm mà hàm dưới dấu tích phân không xác định.</p>`],
    ]),
  ].join('\n'),
};
