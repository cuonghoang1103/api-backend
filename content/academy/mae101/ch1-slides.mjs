/**
 * MAE101 · Chương 1 — Limits (Giới hạn), học theo từng slide.
 * Deck 'mae1' (MAE1), 17 slide, render sẵn lên CDN images/academy/MAE101/v1/mae1/NNN.webp.
 * Nội dung bám syllabus FLM (sylID 13137) + Stewart "Essential Calculus" ch.1.
 * Mọi phép tính trong phần giảng đều đã kiểm tay:
 *   lim(x→2)(x²+3x−1)=4+6−1=9 · (x²−9)/(x−3)→6 · (√(x+1)−1)/x→1/2
 *   x²sin(1/x)→0 · sin5x/x→5 · (3x²+5)/(2x²−x)→3/2 · x³−x−1: f(1)=−1, f(2)=5.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae1';

export default {
  title: '1.0 — Slide bài giảng: Giới hạn (17 slide)|||1.0 — Slide bài giảng: Giới hạn (17 slide)',
  slug: 'mae101-1-0-slides-gioi-han',
  type: 'DOCUMENT',
  description: 'Toàn bộ 17 slide Chương 1 MAE101 — ý tưởng giới hạn, giới hạn một phía, 6 luật giới hạn, khử dạng 0/0 bằng phân tích và liên hợp, định lý kẹp, giới hạn lượng giác, giới hạn ở vô cực & tiệm cận, tính liên tục và định lý giá trị trung gian — mỗi slide kèm giảng song ngữ, ví dụ giải từng bước và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Chapter 1 — Limits (cover)',
        `<p class="y-chinh">🎯 Chapter 1 of MAE101: <strong>limits</strong>, the foundation every later idea in calculus stands on.</p>
<ul>
<li><strong>Why it comes first</strong> — the derivative is a limit (lim of a difference quotient), the definite integral is a limit (of Riemann sums), continuity is defined by a limit. Break limits and everything after breaks.</li>
<li><strong>The one-sentence idea</strong> — a limit describes where f(x) is <em>heading</em> as x approaches a, not what f does <em>at</em> a.</li>
<li><strong>What this deck covers</strong> — 17 slides: the idea, one-sided limits, the limit laws, the 0/0 techniques, the Squeeze Theorem, limits at infinity, asymptotes, continuity and the Intermediate Value Theorem.</li>
</ul>
<p class="meo">💡 Read every "lim" out loud as "is heading toward", never as "equals at". That habit alone fixes most Chapter 1 mistakes.</p>`,
        `<p class="y-chinh">🎯 Chương 1 của MAE101: <strong>giới hạn</strong>, nền móng mà mọi khái niệm Giải tích về sau đứng lên.</p>
<ul>
<li><strong>Vì sao học đầu tiên</strong> — đạo hàm là một giới hạn (giới hạn của tỉ sai phân), tích phân xác định là một giới hạn (của tổng Riemann), tính liên tục được định nghĩa bằng giới hạn. Hỏng giới hạn là hỏng hết phần sau.</li>
<li><strong>Ý tưởng trong một câu</strong> — giới hạn mô tả f(x) đang <em>đi về đâu</em> khi x tiến tới a, chứ không phải f <em>bằng gì tại</em> a.</li>
<li><strong>Bộ slide này gồm</strong> — 17 slide: ý tưởng, giới hạn một phía, các luật giới hạn, kỹ thuật khử 0/0, định lý kẹp, giới hạn ở vô cực, tiệm cận, tính liên tục và định lý giá trị trung gian.</li>
</ul>
<p class="meo">💡 Hãy đọc mọi ký hiệu "lim" thành "đang tiến về", đừng đọc thành "bằng tại". Chỉ riêng thói quen này đã chữa hầu hết lỗi sai của Chương 1.</p>`],

      [2, 'Contents — six blocks of Chapter 1',
        `<p class="y-chinh">🎯 Chapter 1 runs through six blocks, each building on the one before.</p>
<ol>
<li><strong>The limit idea &amp; one-sided limits</strong> — slides 3–5: what lim(x→a) f(x) = L means, left vs right, when a limit fails to exist.</li>
<li><strong>Limit laws &amp; direct substitution</strong> — slides 6–7: the six algebra rules and the fastest method.</li>
<li><strong>Killing the 0/0 form</strong> — slides 8–9: factoring and the conjugate trick.</li>
<li><strong>Squeeze Theorem &amp; trig limits</strong> — slides 10–11: sin x / x = 1 and friends.</li>
<li><strong>Infinity &amp; asymptotes</strong> — slides 12–13: degree comparison, vertical and horizontal asymptotes.</li>
<li><strong>Continuity &amp; the IVT</strong> — slides 14–16: the 3 conditions, 3 types of break, and root-finding.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 1 chạy qua sáu khối, khối sau dựa trên khối trước.</p>
<ol>
<li><strong>Ý tưởng giới hạn &amp; giới hạn một phía</strong> — slide 3–5: lim(x→a) f(x) = L nghĩa là gì, trái vs phải, khi nào giới hạn không tồn tại.</li>
<li><strong>Luật giới hạn &amp; thay trực tiếp</strong> — slide 6–7: sáu quy tắc đại số và cách tính nhanh nhất.</li>
<li><strong>Khử dạng 0/0</strong> — slide 8–9: phân tích nhân tử và mẹo nhân liên hợp.</li>
<li><strong>Định lý kẹp &amp; giới hạn lượng giác</strong> — slide 10–11: sin x / x = 1 và họ hàng.</li>
<li><strong>Vô cực &amp; tiệm cận</strong> — slide 12–13: so bậc, tiệm cận đứng và tiệm cận ngang.</li>
<li><strong>Liên tục &amp; định lý giá trị trung gian</strong> — slide 14–16: 3 điều kiện, 3 kiểu đứt, và tìm nghiệm.</li>
</ol>`],

      [3, 'What is a limit?',
        `<p class="y-chinh">🎯 lim(x→a) f(x) = L means: f(x) can be made as close to L as we like, by taking x close enough to a — but x ≠ a.</p>
<ul>
<li><strong>Read the notation</strong> — "the limit of f(x), as x approaches a, is L". The arrow → means <em>approaches</em>, never <em>reaches</em>.</li>
<li><strong>x ≠ a is part of the definition</strong> — we deliberately exclude the point itself. That is exactly why a limit can exist where the function is undefined.</li>
<li><strong>The table on the slide</strong> — f(x) = x + 3, x → 2: x = 1.9 → 4.9 · 1.99 → 4.99 · 1.999 → 4.999 · then from the right 2.001 → 5.001 · 2.01 → 5.01 · 2.1 → 5.1.</li>
<li><strong>Reading the table</strong> — squeezing x toward 2 from both sides squeezes f(x) toward <strong>5</strong>. So lim(x→2) (x + 3) = 5.</li>
<li><strong>Distance language</strong> — |x − 2| = 0.001 gives |f(x) − 5| = 0.001: pick any tolerance ε &gt; 0 and there is a δ &gt; 0 that achieves it. That is the formal ε–δ definition in plain words.</li>
</ul>
<p class="meo">💡 A numeric table is a <em>guess</em>, not a proof. Use it to see where the function heads, then confirm with algebra (the limit laws on slide 6).</p>
<p class="pitfall">⚠️ Exam trap: students answer "f(2) = 5" and call it the limit. For f(x) = (x² − 9)/(x − 3) at x = 3, f(3) does not even exist, yet the limit is 6. Value at a point and limit at a point are different questions.</p>`,
        `<p class="y-chinh">🎯 lim(x→a) f(x) = L nghĩa là: f(x) có thể gần L tuỳ ý, miễn lấy x đủ gần a — nhưng x ≠ a.</p>
<ul>
<li><strong>Đọc ký hiệu</strong> — "giới hạn của f(x) khi x tiến tới a bằng L". Mũi tên → nghĩa là <em>tiến tới</em>, không bao giờ là <em>đạt tới</em>.</li>
<li><strong>x ≠ a là một phần của định nghĩa</strong> — ta cố tình loại chính điểm đó ra. Đây đúng là lý do giới hạn vẫn tồn tại ở nơi hàm số không xác định.</li>
<li><strong>Bảng trên slide</strong> — f(x) = x + 3, x → 2: x = 1,9 → 4,9 · 1,99 → 4,99 · 1,999 → 4,999 · rồi từ bên phải 2,001 → 5,001 · 2,01 → 5,01 · 2,1 → 5,1.</li>
<li><strong>Đọc bảng</strong> — ép x về 2 từ cả hai phía thì f(x) bị ép về <strong>5</strong>. Vậy lim(x→2) (x + 3) = 5.</li>
<li><strong>Nói bằng khoảng cách</strong> — |x − 2| = 0,001 cho |f(x) − 5| = 0,001: chọn sai số ε &gt; 0 bất kỳ thì luôn có δ &gt; 0 đáp ứng được. Đó chính là định nghĩa ε–δ diễn đạt bằng lời.</li>
</ul>
<p class="meo">💡 Bảng số chỉ là <em>phỏng đoán</em>, không phải chứng minh. Dùng nó để thấy hàm đang đi về đâu, rồi khẳng định lại bằng đại số (luật giới hạn ở slide 6).</p>
<p class="pitfall">⚠️ Bẫy thi: nhiều bạn trả lời "f(2) = 5" rồi coi đó là giới hạn. Với f(x) = (x² − 9)/(x − 3) tại x = 3 thì f(3) còn không tồn tại, vậy mà giới hạn vẫn bằng 6. Giá trị tại một điểm và giới hạn tại điểm đó là hai câu hỏi khác nhau.</p>`],

      [4, 'One-sided limits',
        `<p class="y-chinh">🎯 Approach a from the left and from the right separately; the two-sided limit exists only if the two agree.</p>
<ul>
<li><strong>Left-hand limit</strong> — lim(x→a⁻) f(x) = L: x approaches a through values <em>smaller</em> than a (x = a − 0.1, a − 0.01, …).</li>
<li><strong>Right-hand limit</strong> — lim(x→a⁺) f(x) = L: x approaches a through values <em>larger</em> than a (x = a + 0.1, a + 0.01, …).</li>
<li><strong>The existence condition</strong> — lim(x→a) f(x) = L ⟺ lim(x→a⁻) f(x) = L <em>and</em> lim(x→a⁺) f(x) = L. Both must exist, both must be the same number.</li>
<li><strong>Classic example</strong> — f(x) = |x| / x at 0: for x &gt; 0 it is +1, for x &lt; 0 it is −1. Right limit = 1, left limit = −1, 1 ≠ −1 ⇒ lim(x→0) does not exist.</li>
<li><strong>Where one-sided limits are the only option</strong> — endpoints of a domain. For f(x) = √x, lim(x→0⁻) is meaningless (no domain there), so only lim(x→0⁺) √x = 0 makes sense.</li>
<li><strong>Piecewise functions</strong> — at every seam of a piecewise definition you must compute both sides with their own formulas, then compare.</li>
</ul>
<p class="meo">💡 The superscript marks the <em>side x comes from</em>, not the sign of x. lim(x→−3⁺) means x = −2.9, −2.99 — numbers bigger than −3.</p>
<p class="pitfall">⚠️ Exam trap: computing only one side and declaring the limit exists. If the question gives a piecewise function or an absolute value, checking both sides is the whole point of the question.</p>`,
        `<p class="y-chinh">🎯 Tiến tới a từ bên trái và bên phải riêng rẽ; giới hạn hai phía chỉ tồn tại khi hai bên trùng nhau.</p>
<ul>
<li><strong>Giới hạn trái</strong> — lim(x→a⁻) f(x) = L: x tiến tới a qua các giá trị <em>nhỏ hơn</em> a (x = a − 0,1; a − 0,01; …).</li>
<li><strong>Giới hạn phải</strong> — lim(x→a⁺) f(x) = L: x tiến tới a qua các giá trị <em>lớn hơn</em> a (x = a + 0,1; a + 0,01; …).</li>
<li><strong>Điều kiện tồn tại</strong> — lim(x→a) f(x) = L ⟺ lim(x→a⁻) f(x) = L <em>và</em> lim(x→a⁺) f(x) = L. Cả hai phải tồn tại và phải bằng cùng một số.</li>
<li><strong>Ví dụ kinh điển</strong> — f(x) = |x| / x tại 0: với x &gt; 0 thì bằng +1, với x &lt; 0 thì bằng −1. Giới hạn phải = 1, giới hạn trái = −1, mà 1 ≠ −1 ⇒ lim(x→0) không tồn tại.</li>
<li><strong>Chỗ chỉ dùng được giới hạn một phía</strong> — đầu mút của tập xác định. Với f(x) = √x thì lim(x→0⁻) vô nghĩa (bên đó không có tập xác định), chỉ lim(x→0⁺) √x = 0 là có nghĩa.</li>
<li><strong>Hàm cho theo từng khoảng</strong> — tại mỗi mối nối của định nghĩa từng khoảng, bắt buộc tính hai bên bằng hai công thức riêng rồi so sánh.</li>
</ul>
<p class="meo">💡 Dấu mũ chỉ <em>phía mà x đi tới</em>, không phải dấu của x. lim(x→−3⁺) nghĩa là x = −2,9; −2,99 — những số lớn hơn −3.</p>
<p class="pitfall">⚠️ Bẫy thi: chỉ tính một phía rồi kết luận giới hạn tồn tại. Đề mà cho hàm từng khoảng hoặc trị tuyệt đối thì việc kiểm cả hai phía chính là trọng tâm câu hỏi.</p>`],

      [5, 'When a limit fails to exist',
        `<p class="y-chinh">🎯 Three standard ways a limit dies: a jump, a blow-up to ±∞, and endless oscillation.</p>
<ul>
<li><strong>1. Jump discontinuity</strong> — left and right limits both exist but differ. Example: the step / sign function at 0, left = −1, right = +1. The graph literally jumps.</li>
<li><strong>2. Infinite behaviour</strong> — f(x) = 1/x² at 0: both sides grow without bound, so we write lim(x→0) 1/x² = +∞. Saying "= ∞" describes <em>how</em> it fails; the limit still does not exist as a finite number.</li>
<li><strong>Related case</strong> — f(x) = 1/x at 0: left → −∞, right → +∞. The two sides disagree <em>and</em> both are infinite.</li>
<li><strong>3. Oscillation</strong> — f(x) = sin(1/x) at 0. As x → 0 the argument 1/x runs to ∞, so sin(1/x) sweeps the whole band from −1 to 1 infinitely many times in any interval around 0. It never settles on one value.</li>
<li><strong>How to argue oscillation</strong> — choose two sequences heading to 0: x = 1/(2kπ) gives f = 0, x = 1/(2kπ + π/2) gives f = 1. Two different answers on the same approach ⇒ no limit.</li>
</ul>
<p class="meo">💡 Memorise the three exhibits: jump = <em>sign(x)</em> · blow-up = <em>1/x²</em> · oscillation = <em>sin(1/x)</em>. Exams re-use these three shapes constantly.</p>
<p class="pitfall">⚠️ Writing "lim = ∞" and then treating ∞ as a number in later algebra. ∞ is not a value you can add or cancel — it is shorthand for "grows without bound".</p>`,
        `<p class="y-chinh">🎯 Ba kiểu chuẩn khiến giới hạn không tồn tại: nhảy bậc, tiến ra ±∞, và dao động không dừng.</p>
<ul>
<li><strong>1. Nhảy bậc (jump)</strong> — giới hạn trái và phải đều tồn tại nhưng khác nhau. Ví dụ: hàm bậc thang / hàm dấu tại 0, trái = −1, phải = +1. Đồ thị nhảy đúng nghĩa đen.</li>
<li><strong>2. Tiến ra vô cực</strong> — f(x) = 1/x² tại 0: cả hai phía tăng không chặn, nên ta viết lim(x→0) 1/x² = +∞. Viết "= ∞" là để mô tả <em>cách</em> nó hỏng; giới hạn vẫn không tồn tại dưới dạng một số hữu hạn.</li>
<li><strong>Trường hợp họ hàng</strong> — f(x) = 1/x tại 0: bên trái → −∞, bên phải → +∞. Hai phía vừa khác nhau <em>vừa</em> đều vô cực.</li>
<li><strong>3. Dao động</strong> — f(x) = sin(1/x) tại 0. Khi x → 0 thì đối số 1/x chạy ra ∞, nên sin(1/x) quét trọn dải từ −1 đến 1 vô số lần trong bất kỳ khoảng nào quanh 0. Nó không bao giờ đậu lại ở một giá trị.</li>
<li><strong>Cách lập luận dao động</strong> — chọn hai dãy cùng tiến về 0: x = 1/(2kπ) cho f = 0, còn x = 1/(2kπ + π/2) cho f = 1. Cùng một hướng tiến mà ra hai đáp số ⇒ không có giới hạn.</li>
</ul>
<p class="meo">💡 Thuộc ba "vật mẫu": nhảy bậc = <em>sign(x)</em> · tiến vô cực = <em>1/x²</em> · dao động = <em>sin(1/x)</em>. Đề thi dùng đi dùng lại đúng ba dáng này.</p>
<p class="pitfall">⚠️ Viết "lim = ∞" rồi coi ∞ như một con số để cộng trừ rút gọn ở bước sau. ∞ không phải giá trị để tính toán — nó chỉ là cách viết tắt của "tăng không chặn".</p>`],

      [6, 'Limit laws',
        `<p class="y-chinh">🎯 If lim(x→a) f(x) and lim(x→a) g(x) both exist, limits pass straight through the ordinary algebra operations.</p>
<ul>
<li><strong>1. Sum / difference</strong> — lim (f ± g) = lim f ± lim g.</li>
<li><strong>2. Product</strong> — lim (f · g) = (lim f) · (lim g).</li>
<li><strong>3. Quotient</strong> — lim (f / g) = (lim f) / (lim g), <em>provided</em> lim g ≠ 0. This proviso is the whole reason slides 8–9 exist.</li>
<li><strong>4. Constant multiple</strong> — lim (c · f) = c · lim f, for any constant c.</li>
<li><strong>5. Power</strong> — lim (f)ⁿ = (lim f)ⁿ for positive integer n.</li>
<li><strong>6. Root</strong> — lim ⁿ√f = ⁿ√(lim f), valid when the root is defined (for even n we need lim f ≥ 0).</li>
<li><strong>Worked chain</strong> — lim(x→2) (x² + 3x − 1) = lim x² + 3·lim x − lim 1 = 2² + 3·2 − 1 = 4 + 6 − 1 = <strong>9</strong>, using laws 1, 4, 5 plus lim(x→a) c = c and lim(x→a) x = a.</li>
</ul>
<p class="meo">💡 The laws are one sentence: "the limit of an expression is the expression of the limits" — as long as every piece has a limit and no denominator hits 0.</p>
<p class="pitfall">⚠️ The laws need <em>both</em> limits to exist first. lim(x→0) [ (1/x) · x ] = 1 is correct, but you may not split it into (lim 1/x)·(lim x) — the first factor has no limit.</p>`,
        `<p class="y-chinh">🎯 Nếu lim(x→a) f(x) và lim(x→a) g(x) đều tồn tại thì giới hạn đi xuyên qua các phép toán đại số thông thường.</p>
<ul>
<li><strong>1. Tổng / hiệu</strong> — lim (f ± g) = lim f ± lim g.</li>
<li><strong>2. Tích</strong> — lim (f · g) = (lim f) · (lim g).</li>
<li><strong>3. Thương</strong> — lim (f / g) = (lim f) / (lim g), <em>với điều kiện</em> lim g ≠ 0. Chính điều kiện này là lý do tồn tại của slide 8–9.</li>
<li><strong>4. Hằng nhân</strong> — lim (c · f) = c · lim f, với hằng số c bất kỳ.</li>
<li><strong>5. Luỹ thừa</strong> — lim (f)ⁿ = (lim f)ⁿ với n nguyên dương.</li>
<li><strong>6. Căn</strong> — lim ⁿ√f = ⁿ√(lim f), đúng khi căn có nghĩa (với n chẵn cần lim f ≥ 0).</li>
<li><strong>Chuỗi ví dụ</strong> — lim(x→2) (x² + 3x − 1) = lim x² + 3·lim x − lim 1 = 2² + 3·2 − 1 = 4 + 6 − 1 = <strong>9</strong>, dùng luật 1, 4, 5 cộng với lim(x→a) c = c và lim(x→a) x = a.</li>
</ul>
<p class="meo">💡 Các luật gói trong một câu: "giới hạn của biểu thức bằng biểu thức của các giới hạn" — miễn là từng mảnh đều có giới hạn và không có mẫu nào bằng 0.</p>
<p class="pitfall">⚠️ Các luật đòi <em>cả hai</em> giới hạn phải tồn tại trước đã. lim(x→0) [ (1/x) · x ] = 1 là đúng, nhưng không được tách thành (lim 1/x)·(lim x) — thừa số đầu không có giới hạn.</p>`],

      [7, 'Direct substitution',
        `<p class="y-chinh">🎯 For polynomials, rational functions and most elementary functions, just plug a in — if the result is a real number, that is the limit.</p>
<ul>
<li><strong>The rule</strong> — if f is continuous at a (slide 14), then lim(x→a) f(x) = f(a). Every polynomial is continuous everywhere; a rational function is continuous wherever its denominator ≠ 0.</li>
<li><strong>Worked example</strong> — lim(x→2) (x² + 3x − 1): substitute x = 2 → 2² + 3·2 − 1 = 4 + 6 − 1 = <strong>9</strong>. One line, done.</li>
<li><strong>Second example</strong> — lim(x→1) (x + 4)/(x + 2) = 5/3, because the denominator 1 + 2 = 3 ≠ 0.</li>
<li><strong>Three possible outcomes</strong> — (a) a real number ⇒ that <em>is</em> the answer; (b) nonzero / 0, e.g. 5/0 ⇒ the limit is infinite, check each side for the sign; (c) <strong>0/0</strong> ⇒ indeterminate, substitution has told you nothing.</li>
<li><strong>What 0/0 actually means</strong> — numerator and denominator share the factor (x − a). The limit may be any number, or may not exist; you must do algebra first. That is slides 8 and 9.</li>
</ul>
<p class="meo">💡 Always <em>try substitution first</em>. It costs one line and settles the majority of exam items; only when 0/0 appears do you reach for the heavier tools.</p>
<p class="pitfall">⚠️ 0/0 is not "0", not "1", and not "undefined limit". It is an <strong>indeterminate form</strong>: a signal that more work is needed. Writing "0/0 ⇒ no limit" loses the mark, since (x² − 9)/(x − 3) gives 0/0 yet has limit 6.</p>`,
        `<p class="y-chinh">🎯 Với đa thức, hàm hữu tỉ và hầu hết hàm sơ cấp, cứ thay a vào — ra số thực thì đó chính là giới hạn.</p>
<ul>
<li><strong>Quy tắc</strong> — nếu f liên tục tại a (slide 14) thì lim(x→a) f(x) = f(a). Mọi đa thức liên tục khắp nơi; hàm hữu tỉ liên tục ở mọi chỗ có mẫu ≠ 0.</li>
<li><strong>Ví dụ đã giải</strong> — lim(x→2) (x² + 3x − 1): thay x = 2 → 2² + 3·2 − 1 = 4 + 6 − 1 = <strong>9</strong>. Một dòng là xong.</li>
<li><strong>Ví dụ thứ hai</strong> — lim(x→1) (x + 4)/(x + 2) = 5/3, vì mẫu 1 + 2 = 3 ≠ 0.</li>
<li><strong>Ba kết cục có thể xảy ra</strong> — (a) ra một số thực ⇒ đó <em>chính là</em> đáp án; (b) số khác 0 chia 0, ví dụ 5/0 ⇒ giới hạn vô cực, phải xét dấu từng phía; (c) <strong>0/0</strong> ⇒ dạng vô định, phép thay chưa cho biết gì cả.</li>
<li><strong>0/0 thực chất nghĩa là gì</strong> — tử và mẫu cùng chứa nhân tử (x − a). Giới hạn có thể là số bất kỳ, hoặc không tồn tại; phải biến đổi đại số trước đã. Đó là slide 8 và 9.</li>
</ul>
<p class="meo">💡 Luôn <em>thử thay trực tiếp trước</em>. Nó tốn một dòng và giải quyết phần lớn câu hỏi trong đề; chỉ khi hiện ra 0/0 mới cần đến công cụ nặng hơn.</p>
<p class="pitfall">⚠️ 0/0 không phải "0", không phải "1", và cũng không phải "giới hạn không tồn tại". Nó là <strong>dạng vô định</strong>: tín hiệu báo còn phải làm tiếp. Viết "0/0 ⇒ không có giới hạn" là mất điểm, vì (x² − 9)/(x − 3) cho 0/0 mà giới hạn vẫn bằng 6.</p>`],

      [8, 'Indeterminate 0/0 — the factoring method',
        `<p class="y-chinh">🎯 When substitution gives 0/0 in a rational function, factor both parts, cancel the common (x − a), then substitute again.</p>
<ul>
<li><strong>The problem</strong> — lim(x→3) (x² − 9)/(x − 3). Substituting x = 3: top = 9 − 9 = 0, bottom = 3 − 3 = 0 ⇒ 0/0, blocked.</li>
<li><strong>Step 1 — factor</strong> — x² − 9 is a difference of squares: x² − 9 = (x − 3)(x + 3). The bottom is already (x − 3).</li>
<li><strong>Step 2 — cancel</strong> — (x − 3)(x + 3)/(x − 3) = x + 3. Legal because x → 3 means x ≠ 3, so the factor (x − 3) is nonzero and may be divided out.</li>
<li><strong>Step 3 — substitute</strong> — lim(x→3) (x + 3) = 3 + 3 = <strong>6</strong>.</li>
<li><strong>What the graph looks like</strong> — the graph is the line y = x + 3 with a single hole punched at (3, 6). The function is undefined at 3, but everything around 3 heads to 6 — the limit is 6 regardless of the hole.</li>
<li><strong>Useful factorings</strong> — a² − b² = (a − b)(a + b) · a³ − b³ = (a − b)(a² + ab + b²) · a³ + b³ = (a + b)(a² − ab + b²) · and for a general quadratic, the root x = a guarantees (x − a) is a factor, so polynomial division always works.</li>
</ul>
<p class="meo">💡 0/0 guarantees (x − a) divides both numerator and denominator. So you already know one factor before you start — that turns factoring into division rather than guessing.</p>
<p class="pitfall">⚠️ After cancelling, students sometimes write "so f(3) = 6". No: f(3) is still undefined. Only the <em>limit</em> is 6. Keep the word "lim" in every line until you substitute at the last step.</p>`,
        `<p class="y-chinh">🎯 Khi thay trực tiếp ra 0/0 ở hàm hữu tỉ, hãy phân tích cả tử lẫn mẫu, rút gọn nhân tử chung (x − a), rồi thay lại.</p>
<ul>
<li><strong>Bài toán</strong> — lim(x→3) (x² − 9)/(x − 3). Thay x = 3: tử = 9 − 9 = 0, mẫu = 3 − 3 = 0 ⇒ 0/0, tắc.</li>
<li><strong>Bước 1 — phân tích</strong> — x² − 9 là hiệu hai bình phương: x² − 9 = (x − 3)(x + 3). Mẫu sẵn là (x − 3).</li>
<li><strong>Bước 2 — rút gọn</strong> — (x − 3)(x + 3)/(x − 3) = x + 3. Được phép vì x → 3 nghĩa là x ≠ 3, nên nhân tử (x − 3) khác 0 và chia được.</li>
<li><strong>Bước 3 — thay số</strong> — lim(x→3) (x + 3) = 3 + 3 = <strong>6</strong>.</li>
<li><strong>Đồ thị trông thế nào</strong> — đồ thị là đường thẳng y = x + 3 bị khoét đúng một lỗ tại (3, 6). Hàm không xác định tại 3, nhưng mọi thứ quanh 3 đều tiến về 6 — giới hạn bằng 6 bất kể cái lỗ.</li>
<li><strong>Các hằng đẳng thức hay dùng</strong> — a² − b² = (a − b)(a + b) · a³ − b³ = (a − b)(a² + ab + b²) · a³ + b³ = (a + b)(a² − ab + b²) · và với tam thức bậc hai bất kỳ, nghiệm x = a bảo đảm (x − a) là nhân tử, nên chia đa thức luôn ra.</li>
</ul>
<p class="meo">💡 Dạng 0/0 bảo đảm (x − a) chia hết cả tử lẫn mẫu. Nghĩa là bạn đã biết sẵn một nhân tử trước khi bắt đầu — việc phân tích biến thành phép chia chứ không còn là đoán mò.</p>
<p class="pitfall">⚠️ Rút gọn xong, nhiều bạn viết "vậy f(3) = 6". Không phải: f(3) vẫn không xác định. Chỉ có <em>giới hạn</em> bằng 6. Hãy giữ chữ "lim" ở mọi dòng cho tới bước thay số cuối cùng.</p>`],

      [9, 'Indeterminate 0/0 — the conjugate method',
        `<p class="y-chinh">🎯 When a square root creates the 0/0, multiply top and bottom by the conjugate to turn the root into a difference of squares.</p>
<ul>
<li><strong>The problem</strong> — lim(x→0) (√(x + 1) − 1)/x. Substituting 0: top = √1 − 1 = 0, bottom = 0 ⇒ 0/0. Factoring is useless here, the root blocks it.</li>
<li><strong>Step 1 — multiply by the conjugate</strong> — the conjugate of √(x + 1) − 1 is √(x + 1) + 1. Multiply numerator and denominator by it (that is multiplying by 1, so the value is unchanged).</li>
<li><strong>Step 2 — expand the top</strong> — (√(x+1) − 1)(√(x+1) + 1) = (x + 1) − 1 = x. The root has vanished, which is the whole purpose.</li>
<li><strong>Step 3 — cancel</strong> — the expression is now x / [ x · (√(x+1) + 1) ] = 1/(√(x+1) + 1), legal since x ≠ 0.</li>
<li><strong>Step 4 — substitute</strong> — 1/(√(0+1) + 1) = 1/(1 + 1) = <strong>1/2</strong>.</li>
<li><strong>When the root is downstairs</strong> — same move, but multiply by the conjugate of the <em>denominator</em>; e.g. for x/(√(x+4) − 2) use √(x+4) + 2, which gives limit 4 at x = 0.</li>
</ul>
<p class="meo">💡 The pattern to spot: a difference containing exactly one square root, going to 0/0. Change only the <em>sign between the two terms</em> to get the conjugate, and never expand the side you want to keep as a factor.</p>
<p class="pitfall">⚠️ Two common slips: (1) multiplying only the numerator by the conjugate — that changes the value of the expression; (2) expanding the denominator (√(x+1) + 1) into something messy, when leaving it whole is exactly what makes the cancelling obvious.</p>`,
        `<p class="y-chinh">🎯 Khi căn bậc hai sinh ra dạng 0/0, hãy nhân cả tử lẫn mẫu với biểu thức liên hợp để biến căn thành hiệu hai bình phương.</p>
<ul>
<li><strong>Bài toán</strong> — lim(x→0) (√(x + 1) − 1)/x. Thay 0: tử = √1 − 1 = 0, mẫu = 0 ⇒ 0/0. Phân tích nhân tử vô dụng ở đây vì căn chắn đường.</li>
<li><strong>Bước 1 — nhân liên hợp</strong> — liên hợp của √(x + 1) − 1 là √(x + 1) + 1. Nhân cả tử và mẫu với nó (tức nhân với 1, nên giá trị không đổi).</li>
<li><strong>Bước 2 — khai triển tử</strong> — (√(x+1) − 1)(√(x+1) + 1) = (x + 1) − 1 = x. Căn biến mất, đó chính là mục đích.</li>
<li><strong>Bước 3 — rút gọn</strong> — biểu thức thành x / [ x · (√(x+1) + 1) ] = 1/(√(x+1) + 1), hợp lệ vì x ≠ 0.</li>
<li><strong>Bước 4 — thay số</strong> — 1/(√(0+1) + 1) = 1/(1 + 1) = <strong>1/2</strong>.</li>
<li><strong>Khi căn nằm dưới mẫu</strong> — vẫn nước đi đó, nhưng nhân với liên hợp của <em>mẫu</em>; ví dụ x/(√(x+4) − 2) thì dùng √(x+4) + 2, cho giới hạn bằng 4 tại x = 0.</li>
</ul>
<p class="meo">💡 Dấu hiệu nhận dạng: một hiệu chứa đúng một căn bậc hai, dẫn tới 0/0. Chỉ cần đổi <em>dấu giữa hai số hạng</em> là ra liên hợp, và tuyệt đối đừng khai triển vế mà bạn muốn giữ nguyên làm nhân tử.</p>
<p class="pitfall">⚠️ Hai lỗi hay gặp: (1) chỉ nhân liên hợp vào tử — làm vậy là đổi giá trị biểu thức; (2) khai triển tung cái mẫu (√(x+1) + 1) cho rối, trong khi để nguyên nó mới là thứ khiến phép rút gọn hiện ra rõ ràng.</p>`],

      [10, 'The Squeeze Theorem',
        `<p class="y-chinh">🎯 If a function is trapped between two others that go to the same L, it has no choice but to go to L too.</p>
<ul>
<li><strong>Statement</strong> — if g(x) ≤ f(x) ≤ h(x) for all x near a (except possibly at a), and lim(x→a) g(x) = lim(x→a) h(x) = L, then lim(x→a) f(x) = L.</li>
<li><strong>Why we need it</strong> — for functions with no limit of their own inside them, such as sin(1/x), the limit laws simply do not apply. Squeezing sidesteps the missing limit entirely.</li>
<li><strong>Worked example</strong> — lim(x→0) x² sin(1/x).</li>
<li><strong>Step 1 — bound the wild part</strong> — for every x ≠ 0, −1 ≤ sin(1/x) ≤ 1. This is true no matter how fast the argument oscillates.</li>
<li><strong>Step 2 — multiply by x² ≥ 0</strong> — multiplying an inequality by a non-negative number keeps its direction: −x² ≤ x² sin(1/x) ≤ x².</li>
<li><strong>Step 3 — take limits of the two walls</strong> — lim(x→0) (−x²) = 0 and lim(x→0) x² = 0. Both walls arrive at 0.</li>
<li><strong>Step 4 — conclude</strong> — by the Squeeze Theorem, lim(x→0) x² sin(1/x) = <strong>0</strong>, even though sin(1/x) alone has no limit at 0.</li>
</ul>
<p class="meo">💡 Recipe for "bounded × something → 0": if |f| ≤ M and g → 0, then f·g → 0. That single line handles x·cos(1/x), x² sin(5/x), and most exam variants.</p>
<p class="pitfall">⚠️ Multiplying the inequality by x when x may be negative flips the signs and makes the "walls" cross. Use x² (always ≥ 0), or split into x &gt; 0 and x &lt; 0 and handle each side separately.</p>`,
        `<p class="y-chinh">🎯 Nếu một hàm bị kẹp giữa hai hàm cùng tiến về L thì nó không còn lựa chọn nào khác ngoài việc cũng tiến về L.</p>
<ul>
<li><strong>Phát biểu</strong> — nếu g(x) ≤ f(x) ≤ h(x) với mọi x gần a (trừ có thể tại chính a), và lim(x→a) g(x) = lim(x→a) h(x) = L, thì lim(x→a) f(x) = L.</li>
<li><strong>Vì sao cần đến nó</strong> — với những hàm bên trong chứa thứ không có giới hạn như sin(1/x), các luật giới hạn đơn giản là không dùng được. Phép kẹp né hẳn cái giới hạn thiếu đó.</li>
<li><strong>Ví dụ đã giải</strong> — lim(x→0) x² sin(1/x).</li>
<li><strong>Bước 1 — chặn phần "hoang dã"</strong> — với mọi x ≠ 0, −1 ≤ sin(1/x) ≤ 1. Điều này luôn đúng dù nó dao động nhanh đến đâu.</li>
<li><strong>Bước 2 — nhân với x² ≥ 0</strong> — nhân bất đẳng thức với số không âm thì giữ nguyên chiều: −x² ≤ x² sin(1/x) ≤ x².</li>
<li><strong>Bước 3 — lấy giới hạn hai bức tường</strong> — lim(x→0) (−x²) = 0 và lim(x→0) x² = 0. Cả hai tường cùng về 0.</li>
<li><strong>Bước 4 — kết luận</strong> — theo định lý kẹp, lim(x→0) x² sin(1/x) = <strong>0</strong>, dù riêng sin(1/x) không hề có giới hạn tại 0.</li>
</ul>
<p class="meo">💡 Công thức bỏ túi cho "bị chặn × thứ tiến về 0": nếu |f| ≤ M và g → 0 thì f·g → 0. Chỉ một dòng đó xử lý được x·cos(1/x), x² sin(5/x) và hầu hết biến thể trong đề.</p>
<p class="pitfall">⚠️ Nhân bất đẳng thức với x trong khi x có thể âm sẽ làm đổi chiều và hai "bức tường" cắt chéo nhau. Hãy dùng x² (luôn ≥ 0), hoặc tách riêng x &gt; 0 và x &lt; 0 rồi xử lý từng phía.</p>`],

      [11, 'Trigonometric limits',
        `<p class="y-chinh">🎯 Two special limits, both proved with the Squeeze Theorem, unlock every trig limit in this course.</p>
<ul>
<li><strong>The first</strong> — lim(x→0) (sin x)/x = <strong>1</strong>, with x in <em>radians</em>. Direct substitution gives 0/0, so this result must be proved, not computed.</li>
<li><strong>The second</strong> — lim(x→0) (1 − cos x)/x = <strong>0</strong>. Derived from the first by multiplying by the conjugate (1 + cos x): (1 − cos²x)/[x(1 + cos x)] = (sin x / x)·(sin x /(1 + cos x)) → 1 · 0/2 = 0.</li>
<li><strong>Related result</strong> — lim(x→0) (tan x)/x = 1, since tan x / x = (sin x / x)·(1/cos x) → 1 · 1 = 1.</li>
<li><strong>The scaling trick, worked</strong> — lim(x→0) (sin 5x)/x. Rewrite as 5 · (sin 5x)/(5x). Put u = 5x; as x → 0 also u → 0, so (sin u)/u → 1 and the whole thing → 5 · 1 = <strong>5</strong>.</li>
<li><strong>General form</strong> — lim(x→0) (sin kx)/x = k, and lim(x→0) (sin ax)/(sin bx) = a/b (divide top and bottom by x first).</li>
<li><strong>Why radians matter</strong> — in degrees the limit becomes π/180 ≈ 0.01745, not 1. Every calculus formula for sin and cos assumes radians.</li>
</ul>
<p class="meo">💡 The rule for the pattern: sin(box)/box → 1, whatever the box is, as long as the <em>same</em> box appears in both places and the box → 0. Force the match by multiplying and dividing by the constant.</p>
<p class="pitfall">⚠️ Writing lim(x→0) (sin 5x)/x = 1 because "sin over x is always 1". The arguments must match: sin 5x needs 5x underneath, which is why the factor 5 appears out front.</p>`,
        `<p class="y-chinh">🎯 Hai giới hạn đặc biệt, đều chứng minh bằng định lý kẹp, mở khoá mọi giới hạn lượng giác trong môn này.</p>
<ul>
<li><strong>Giới hạn thứ nhất</strong> — lim(x→0) (sin x)/x = <strong>1</strong>, với x tính bằng <em>radian</em>. Thay trực tiếp ra 0/0, nên kết quả này phải chứng minh chứ không tính ra được.</li>
<li><strong>Giới hạn thứ hai</strong> — lim(x→0) (1 − cos x)/x = <strong>0</strong>. Suy ra từ cái đầu bằng cách nhân liên hợp (1 + cos x): (1 − cos²x)/[x(1 + cos x)] = (sin x / x)·(sin x /(1 + cos x)) → 1 · 0/2 = 0.</li>
<li><strong>Kết quả họ hàng</strong> — lim(x→0) (tan x)/x = 1, vì tan x / x = (sin x / x)·(1/cos x) → 1 · 1 = 1.</li>
<li><strong>Mẹo chỉnh hệ số, giải đủ bước</strong> — lim(x→0) (sin 5x)/x. Viết lại thành 5 · (sin 5x)/(5x). Đặt u = 5x; khi x → 0 thì u → 0, nên (sin u)/u → 1 và cả biểu thức → 5 · 1 = <strong>5</strong>.</li>
<li><strong>Dạng tổng quát</strong> — lim(x→0) (sin kx)/x = k, và lim(x→0) (sin ax)/(sin bx) = a/b (chia cả tử lẫn mẫu cho x trước).</li>
<li><strong>Vì sao phải là radian</strong> — tính bằng độ thì giới hạn thành π/180 ≈ 0,01745 chứ không phải 1. Mọi công thức Giải tích cho sin và cos đều ngầm hiểu là radian.</li>
</ul>
<p class="meo">💡 Quy tắc nhận dạng: sin(ô)/ô → 1, ô là gì cũng được, miễn <em>cùng một</em> ô xuất hiện ở cả hai chỗ và ô → 0. Ép cho khớp bằng cách nhân rồi chia cho hằng số.</p>
<p class="pitfall">⚠️ Viết lim(x→0) (sin 5x)/x = 1 vì "sin chia x thì luôn bằng 1". Hai đối số phải khớp nhau: sin 5x cần 5x ở dưới, và đó là lý do hệ số 5 nhảy ra ngoài.</p>`],

      [12, 'Limits at infinity',
        `<p class="y-chinh">🎯 For a rational function as x → ±∞, only the highest-degree term of the top and of the bottom matters — compare the two degrees.</p>
<ul>
<li><strong>The three cases</strong> — let the numerator have degree n and the denominator degree m.</li>
<li><strong>n &lt; m (top smaller)</strong> — the limit is <strong>0</strong>. The denominator outgrows the numerator; example: lim(x→∞) (2x + 1)/(x² + 3) = 0.</li>
<li><strong>n = m (equal)</strong> — the limit is the <strong>ratio of the leading coefficients</strong>. Example on the slide below.</li>
<li><strong>n &gt; m (top bigger)</strong> — the limit is <strong>+∞ or −∞</strong>; the sign comes from the leading coefficients and the parity of n − m when x → −∞.</li>
<li><strong>Worked example</strong> — lim(x→∞) (3x² + 5)/(2x² − x). Degrees are equal (2 and 2).</li>
<li><strong>Step 1</strong> — divide every term by the highest power in the denominator, x²: (3 + 5/x²)/(2 − 1/x).</li>
<li><strong>Step 2</strong> — as x → ∞, 5/x² → 0 and 1/x → 0. Note lim(x→±∞) 1/xᵏ = 0 for every k &gt; 0; that is the engine of the whole method.</li>
<li><strong>Step 3</strong> — the limit is (3 + 0)/(2 − 0) = <strong>3/2</strong>, exactly the ratio of leading coefficients 3 and 2.</li>
</ul>
<p class="meo">💡 Shortcut for exams: cover everything except the two leading terms. (3x² + 5)/(2x² − x) behaves like 3x²/2x² = 3/2. Dividing by xᵐ is the written proof of that shortcut.</p>
<p class="pitfall">⚠️ Roots hide their degree. √(x⁴ + 1) has degree 2, not 4. And for x → −∞, √(x²) = |x| = −x, so a sign appears that x → +∞ never shows — this is the classic trap in limits of (ax + b)/√(cx² + d).</p>`,
        `<p class="y-chinh">🎯 Với hàm hữu tỉ khi x → ±∞, chỉ số hạng bậc cao nhất của tử và của mẫu là có ý nghĩa — hãy so hai bậc đó.</p>
<ul>
<li><strong>Ba trường hợp</strong> — gọi bậc tử là n, bậc mẫu là m.</li>
<li><strong>n &lt; m (tử nhỏ hơn)</strong> — giới hạn bằng <strong>0</strong>. Mẫu lớn nhanh hơn tử; ví dụ: lim(x→∞) (2x + 1)/(x² + 3) = 0.</li>
<li><strong>n = m (bằng nhau)</strong> — giới hạn bằng <strong>tỉ số hai hệ số bậc cao nhất</strong>. Ví dụ ngay bên dưới.</li>
<li><strong>n &gt; m (tử lớn hơn)</strong> — giới hạn bằng <strong>+∞ hoặc −∞</strong>; dấu phụ thuộc hệ số dẫn đầu và tính chẵn lẻ của n − m khi x → −∞.</li>
<li><strong>Ví dụ đã giải</strong> — lim(x→∞) (3x² + 5)/(2x² − x). Hai bậc bằng nhau (2 và 2).</li>
<li><strong>Bước 1</strong> — chia mọi số hạng cho luỹ thừa cao nhất ở mẫu là x²: (3 + 5/x²)/(2 − 1/x).</li>
<li><strong>Bước 2</strong> — khi x → ∞ thì 5/x² → 0 và 1/x → 0. Nhớ lim(x→±∞) 1/xᵏ = 0 với mọi k &gt; 0; đó là động cơ của cả phương pháp.</li>
<li><strong>Bước 3</strong> — giới hạn bằng (3 + 0)/(2 − 0) = <strong>3/2</strong>, đúng bằng tỉ số hai hệ số dẫn đầu 3 và 2.</li>
</ul>
<p class="meo">💡 Mẹo làm đề: che hết chỉ chừa hai số hạng bậc cao nhất. (3x² + 5)/(2x² − x) hành xử như 3x²/2x² = 3/2. Phép chia cho xᵐ chính là bản chứng minh viết ra của mẹo đó.</p>
<p class="pitfall">⚠️ Căn thức giấu bậc. √(x⁴ + 1) có bậc 2 chứ không phải 4. Và khi x → −∞ thì √(x²) = |x| = −x, nên xuất hiện một dấu trừ mà trường hợp x → +∞ không bao giờ có — đây là bẫy kinh điển ở giới hạn dạng (ax + b)/√(cx² + d).</p>`],

      [13, 'Asymptotes',
        `<p class="y-chinh">🎯 Asymptotes are limits drawn as lines: vertical ones come from x → a, horizontal ones from x → ±∞.</p>
<ul>
<li><strong>Vertical asymptote x = a</strong> — exists when at least one of lim(x→a⁻) f(x) or lim(x→a⁺) f(x) is +∞ or −∞.</li>
<li><strong>How to find one in a rational function</strong> — solve denominator = 0, then check the numerator at that value: denominator = 0 <em>and</em> numerator ≠ 0 ⇒ vertical asymptote. If both are 0, cancel first — it is usually a hole, not an asymptote.</li>
<li><strong>Example</strong> — f(x) = 1/(x − 2): at x = 2 the denominator is 0 and the numerator is 1 ≠ 0, so x = 2 is a vertical asymptote, with left limit −∞ and right limit +∞.</li>
<li><strong>Hole versus asymptote</strong> — (x² − 9)/(x − 3) has denominator 0 at x = 3, but the numerator is 0 too; after cancelling we get x + 3, so there is a <em>hole</em> at (3, 6) and no asymptote.</li>
<li><strong>Horizontal asymptote y = L</strong> — exists when lim(x→+∞) f(x) = L or lim(x→−∞) f(x) = L. A curve may have up to two different horizontal asymptotes, one per direction.</li>
<li><strong>Example</strong> — for (3x² + 5)/(2x² − x) the limit is 3/2 in both directions, so y = 3/2 is the single horizontal asymptote.</li>
<li><strong>How many of each</strong> — vertical asymptotes: as many as there are bad zeros of the denominator. Horizontal: at most 2 (one as x → +∞, one as x → −∞).</li>
</ul>
<p class="meo">💡 Mnemonic: <em>vertical = denominator dies</em>, <em>horizontal = x runs away</em>. Two different questions, two different limits.</p>
<p class="pitfall">⚠️ "A graph can never cross its asymptote" is false for horizontal asymptotes. f(x) = (sin x)/x crosses y = 0 infinitely often and still has it as a horizontal asymptote; the no-crossing rule holds only for vertical ones.</p>`,
        `<p class="y-chinh">🎯 Tiệm cận là giới hạn được vẽ thành đường thẳng: tiệm cận đứng sinh ra từ x → a, tiệm cận ngang sinh ra từ x → ±∞.</p>
<ul>
<li><strong>Tiệm cận đứng x = a</strong> — tồn tại khi ít nhất một trong lim(x→a⁻) f(x) hoặc lim(x→a⁺) f(x) bằng +∞ hoặc −∞.</li>
<li><strong>Cách tìm ở hàm hữu tỉ</strong> — giải mẫu = 0, rồi kiểm tử tại giá trị đó: mẫu = 0 <em>và</em> tử ≠ 0 ⇒ có tiệm cận đứng. Nếu cả hai cùng bằng 0 thì rút gọn trước — thường đó là một lỗ thủng chứ không phải tiệm cận.</li>
<li><strong>Ví dụ</strong> — f(x) = 1/(x − 2): tại x = 2 mẫu bằng 0 còn tử bằng 1 ≠ 0, nên x = 2 là tiệm cận đứng, giới hạn trái là −∞ và giới hạn phải là +∞.</li>
<li><strong>Lỗ thủng khác tiệm cận</strong> — (x² − 9)/(x − 3) có mẫu bằng 0 tại x = 3, nhưng tử cũng bằng 0; rút gọn xong còn x + 3, nên chỗ đó là <em>lỗ thủng</em> tại (3, 6) chứ không có tiệm cận.</li>
<li><strong>Tiệm cận ngang y = L</strong> — tồn tại khi lim(x→+∞) f(x) = L hoặc lim(x→−∞) f(x) = L. Một đường cong có thể có tới hai tiệm cận ngang khác nhau, mỗi hướng một cái.</li>
<li><strong>Ví dụ</strong> — với (3x² + 5)/(2x² − x) thì giới hạn bằng 3/2 ở cả hai hướng, nên y = 3/2 là tiệm cận ngang duy nhất.</li>
<li><strong>Có được bao nhiêu cái</strong> — tiệm cận đứng: bao nhiêu nghiệm "xấu" của mẫu thì bấy nhiêu. Tiệm cận ngang: nhiều nhất 2 (một khi x → +∞, một khi x → −∞).</li>
</ul>
<p class="meo">💡 Câu thần chú: <em>đứng = mẫu chết</em>, <em>ngang = x chạy ra xa</em>. Hai câu hỏi khác nhau, hai giới hạn khác nhau.</p>
<p class="pitfall">⚠️ "Đồ thị không bao giờ cắt tiệm cận" là SAI với tiệm cận ngang. f(x) = (sin x)/x cắt y = 0 vô số lần mà vẫn nhận nó làm tiệm cận ngang; quy tắc không cắt chỉ đúng cho tiệm cận đứng.</p>`],

      [14, 'Continuity at a point',
        `<p class="y-chinh">🎯 f is continuous at a when three things hold together — and each one can fail on its own.</p>
<ul>
<li><strong>Condition 1</strong> — f(a) is <em>defined</em>; a belongs to the domain of f.</li>
<li><strong>Condition 2</strong> — lim(x→a) f(x) <em>exists</em>; that is, the left and right limits both exist and are equal (slide 4).</li>
<li><strong>Condition 3</strong> — lim(x→a) f(x) = f(a); where the function is heading is exactly where it is.</li>
<li><strong>The picture</strong> — you can draw the graph through x = a without lifting the pen. Any hole, jump or blow-up breaks one of the three.</li>
<li><strong>Which condition fails, and what you see</strong> — condition 1 fails ⇒ a hole with no dot; condition 2 fails ⇒ a jump or a blow-up; condition 3 fails ⇒ a hole with the dot parked somewhere else.</li>
<li><strong>Continuity on an interval</strong> — f is continuous on (a, b) if it is continuous at every point inside; on [a, b] we additionally require lim(x→a⁺) f(x) = f(a) and lim(x→b⁻) f(x) = f(b), i.e. one-sided continuity at the ends.</li>
<li><strong>Which functions are continuous</strong> — polynomials everywhere; rational functions wherever the denominator ≠ 0; sin and cos everywhere; √x on [0, ∞); and any sum, product, quotient or composition of continuous functions on the shared domain.</li>
</ul>
<p class="meo">💡 Continuity is the licence to use direct substitution (slide 7). Every time you "just plug a in", you are silently invoking continuity at a.</p>
<p class="pitfall">⚠️ For a piecewise function asked to be continuous, you must set left limit = right limit = f(a) and solve for the parameter. Matching only the two one-sided limits satisfies condition 2 but can still miss condition 3.</p>`,
        `<p class="y-chinh">🎯 f liên tục tại a khi ba điều cùng đúng — và mỗi điều đều có thể hỏng riêng lẻ.</p>
<ul>
<li><strong>Điều kiện 1</strong> — f(a) <em>xác định</em>; a thuộc tập xác định của f.</li>
<li><strong>Điều kiện 2</strong> — lim(x→a) f(x) <em>tồn tại</em>; tức là giới hạn trái và phải đều tồn tại và bằng nhau (slide 4).</li>
<li><strong>Điều kiện 3</strong> — lim(x→a) f(x) = f(a); nơi hàm đang tiến tới đúng là nơi hàm đang đứng.</li>
<li><strong>Hình dung</strong> — bạn vẽ được đồ thị đi qua x = a mà không nhấc bút. Bất kỳ lỗ thủng, bước nhảy hay chỗ vọt vô cực nào cũng phá vỡ một trong ba điều kiện.</li>
<li><strong>Hỏng điều kiện nào thì nhìn thấy gì</strong> — hỏng điều kiện 1 ⇒ lỗ thủng không có chấm; hỏng điều kiện 2 ⇒ bước nhảy hoặc vọt vô cực; hỏng điều kiện 3 ⇒ lỗ thủng với cái chấm đậu ở chỗ khác.</li>
<li><strong>Liên tục trên một khoảng</strong> — f liên tục trên (a, b) nếu liên tục tại mọi điểm bên trong; trên [a, b] còn đòi thêm lim(x→a⁺) f(x) = f(a) và lim(x→b⁻) f(x) = f(b), tức liên tục một phía ở hai đầu mút.</li>
<li><strong>Những hàm nào liên tục</strong> — đa thức khắp nơi; hàm hữu tỉ ở mọi chỗ mẫu ≠ 0; sin và cos khắp nơi; √x trên [0, ∞); và mọi tổng, tích, thương, hợp của các hàm liên tục trên tập xác định chung.</li>
</ul>
<p class="meo">💡 Tính liên tục chính là "giấy phép" để thay trực tiếp (slide 7). Mỗi lần bạn "cứ thay a vào", bạn đang ngầm dùng tính liên tục tại a.</p>
<p class="pitfall">⚠️ Với hàm từng khoảng mà đề bắt liên tục, phải đặt giới hạn trái = giới hạn phải = f(a) rồi giải tìm tham số. Chỉ khớp hai giới hạn một phía thì mới thoả điều kiện 2, vẫn có thể trượt điều kiện 3.</p>`],

      [15, 'Types of discontinuity',
        `<p class="y-chinh">🎯 Three named breaks, each identified by which of the three continuity conditions failed.</p>
<ul>
<li><strong>1. Removable discontinuity (a hole)</strong> — lim(x→a) f(x) exists, but f(a) is undefined or has a different value. Condition 1 or 3 fails; condition 2 holds.</li>
<li><strong>Example</strong> — f(x) = (x² − 9)/(x − 3) at x = 3: the limit is 6 but f(3) does not exist. Redefining f(3) = 6 repairs it — hence "removable".</li>
<li><strong>2. Jump discontinuity</strong> — both one-sided limits exist but differ, so lim(x→a) f(x) does not exist. Condition 2 fails and nothing can repair it by redefining a single point.</li>
<li><strong>Example</strong> — the sign function at 0: left = −1, right = +1, gap of size 2.</li>
<li><strong>3. Infinite discontinuity</strong> — at least one one-sided limit is ±∞, so the graph runs off the screen at a vertical asymptote.</li>
<li><strong>Example</strong> — f(x) = 1/(x − 2) at x = 2: left → −∞, right → +∞.</li>
<li><strong>Diagnostic order for an exam</strong> — (1) compute both one-sided limits; (2) if they are ±∞ ⇒ infinite; (3) if they exist but differ ⇒ jump; (4) if they are equal ⇒ removable, and compare with f(a) to decide whether anything is broken at all.</li>
</ul>
<p class="meo">💡 Three words, three pictures: hole (a dot missing) · step (two flat pieces at different heights) · wall (the vertical asymptote).</p>
<p class="pitfall">⚠️ oscillatory breaks such as sin(1/x) at 0 fit none of the three: the one-sided limits do not exist and are not infinite. Do not force it into the "jump" box — just say the limit does not exist.</p>`,
        `<p class="y-chinh">🎯 Ba kiểu đứt có tên, mỗi kiểu nhận diện bằng việc điều kiện liên tục nào bị hỏng.</p>
<ul>
<li><strong>1. Đứt khử được (lỗ thủng)</strong> — lim(x→a) f(x) tồn tại, nhưng f(a) không xác định hoặc mang giá trị khác. Hỏng điều kiện 1 hoặc 3; điều kiện 2 vẫn đúng.</li>
<li><strong>Ví dụ</strong> — f(x) = (x² − 9)/(x − 3) tại x = 3: giới hạn bằng 6 nhưng f(3) không tồn tại. Định nghĩa lại f(3) = 6 là vá xong — nên gọi là "khử được".</li>
<li><strong>2. Đứt nhảy bậc</strong> — hai giới hạn một phía đều tồn tại nhưng khác nhau, nên lim(x→a) f(x) không tồn tại. Hỏng điều kiện 2, và không thể vá bằng cách định nghĩa lại một điểm.</li>
<li><strong>Ví dụ</strong> — hàm dấu tại 0: trái = −1, phải = +1, khoảng hở rộng 2 đơn vị.</li>
<li><strong>3. Đứt vô cực</strong> — ít nhất một giới hạn một phía bằng ±∞, nên đồ thị chạy ra khỏi màn hình tại một tiệm cận đứng.</li>
<li><strong>Ví dụ</strong> — f(x) = 1/(x − 2) tại x = 2: trái → −∞, phải → +∞.</li>
<li><strong>Thứ tự chẩn đoán khi thi</strong> — (1) tính hai giới hạn một phía; (2) nếu bằng ±∞ ⇒ đứt vô cực; (3) nếu tồn tại mà khác nhau ⇒ nhảy bậc; (4) nếu bằng nhau ⇒ khử được, rồi so với f(a) để xem có thật sự hỏng gì không.</li>
</ul>
<p class="meo">💡 Ba chữ, ba hình: lỗ thủng (thiếu một chấm) · bậc thang (hai mảnh phẳng lệch độ cao) · bức tường (tiệm cận đứng).</p>
<p class="pitfall">⚠️ Kiểu đứt dao động như sin(1/x) tại 0 không rơi vào cả ba: giới hạn một phía không tồn tại mà cũng chẳng vô cực. Đừng cố nhét nó vào ô "nhảy bậc" — cứ nói thẳng là giới hạn không tồn tại.</p>`],

      [16, 'The Intermediate Value Theorem',
        `<p class="y-chinh">🎯 A continuous function cannot skip values: on [a, b] it hits every height between f(a) and f(b).</p>
<ul>
<li><strong>Statement</strong> — if f is continuous on the closed interval [a, b] and N is any number strictly between f(a) and f(b), then ∃ c ∈ (a, b) such that f(c) = N.</li>
<li><strong>The three hypotheses matter</strong> — continuity, a <em>closed</em> interval [a, b], and N genuinely between the two endpoint values. Drop continuity and the theorem dies: the sign function on [−1, 1] never takes the value 1/2.</li>
<li><strong>Root-finding corollary</strong> — if f(a) and f(b) have <em>opposite signs</em>, then N = 0 lies between them, so f has at least one root in (a, b).</li>
<li><strong>Worked example</strong> — show x³ − x − 1 = 0 has a root in (1, 2).</li>
<li><strong>Step 1</strong> — f(x) = x³ − x − 1 is a polynomial, hence continuous on [1, 2].</li>
<li><strong>Step 2</strong> — f(1) = 1 − 1 − 1 = <strong>−1</strong> and f(2) = 8 − 2 − 1 = <strong>5</strong>.</li>
<li><strong>Step 3</strong> — N = 0 lies between −1 and 5, so by the IVT ∃ c ∈ (1, 2) with f(c) = 0. The equation has a root there.</li>
<li><strong>Narrowing it down</strong> — f(1.5) = 3.375 − 1.5 − 1 = 0.875 &gt; 0, so the root is in (1, 1.5); repeat and you have the bisection method, which is the IVT turned into an algorithm.</li>
</ul>
<p class="meo">💡 The IVT is pure existence: it proves a c <em>exists</em> but never tells you its value. If a question says "show that the equation has a solution", it is asking for the IVT.</p>
<p class="pitfall">⚠️ Two overreaches: claiming the root is <em>unique</em> (the IVT says at least one; uniqueness needs monotonicity), and using the theorem backwards — same signs at the endpoints does <em>not</em> prove there is no root, since a curve may dip below 0 and come back.</p>`,
        `<p class="y-chinh">🎯 Hàm liên tục không thể nhảy cóc qua giá trị nào: trên [a, b] nó đi qua mọi độ cao nằm giữa f(a) và f(b).</p>
<ul>
<li><strong>Phát biểu</strong> — nếu f liên tục trên đoạn đóng [a, b] và N là số bất kỳ nằm thực sự giữa f(a) và f(b), thì ∃ c ∈ (a, b) sao cho f(c) = N.</li>
<li><strong>Ba giả thiết đều quan trọng</strong> — tính liên tục, đoạn <em>đóng</em> [a, b], và N thật sự nằm giữa hai giá trị đầu mút. Bỏ tính liên tục là định lý chết: hàm dấu trên [−1, 1] không bao giờ nhận giá trị 1/2.</li>
<li><strong>Hệ quả tìm nghiệm</strong> — nếu f(a) và f(b) <em>trái dấu</em> thì N = 0 nằm giữa chúng, nên f có ít nhất một nghiệm trong (a, b).</li>
<li><strong>Ví dụ đã giải</strong> — chứng minh x³ − x − 1 = 0 có nghiệm trong (1, 2).</li>
<li><strong>Bước 1</strong> — f(x) = x³ − x − 1 là đa thức, nên liên tục trên [1, 2].</li>
<li><strong>Bước 2</strong> — f(1) = 1 − 1 − 1 = <strong>−1</strong> và f(2) = 8 − 2 − 1 = <strong>5</strong>.</li>
<li><strong>Bước 3</strong> — N = 0 nằm giữa −1 và 5, nên theo định lý giá trị trung gian ∃ c ∈ (1, 2) với f(c) = 0. Phương trình có nghiệm ở đó.</li>
<li><strong>Thu hẹp khoảng</strong> — f(1,5) = 3,375 − 1,5 − 1 = 0,875 &gt; 0, vậy nghiệm nằm trong (1; 1,5); lặp lại là ra phương pháp chia đôi, tức định lý giá trị trung gian được biến thành thuật toán.</li>
</ul>
<p class="meo">💡 Định lý này thuần tuý về sự tồn tại: nó chứng minh có c <em>tồn tại</em> chứ không bao giờ cho biết c bằng bao nhiêu. Đề mà ghi "chứng minh phương trình có nghiệm" là đang hỏi định lý này.</p>
<p class="pitfall">⚠️ Hai kiểu suy quá: khẳng định nghiệm là <em>duy nhất</em> (định lý chỉ nói có ít nhất một; muốn duy nhất phải thêm tính đơn điệu), và dùng ngược định lý — hai đầu mút cùng dấu <em>không</em> chứng minh được là vô nghiệm, vì đường cong có thể lún xuống dưới 0 rồi ngoi lên lại.</p>`],

      [17, 'Summary — five things to carry out of Chapter 1',
        `<p class="y-chinh">🎯 Five statements. If you can say all five without notes, Chapter 1 is done.</p>
<ol>
<li><strong>A limit is about approach, not arrival</strong> — lim(x→a) f(x) = L describes where f heads as x → a, with x ≠ a. It may exist where f(a) does not, and may differ from f(a) where both exist.</li>
<li><strong>Two-sided means both sides agree</strong> — lim exists ⟺ lim(x→a⁻) = lim(x→a⁺) = L. The three standard failures are the jump, the blow-up (1/x²) and the oscillation (sin(1/x)).</li>
<li><strong>Substitute first, then fix 0/0</strong> — the six limit laws let you plug a in. If it gives 0/0, factor (x² − 9)/(x − 3) → 6, or multiply by the conjugate (√(x+1) − 1)/x → 1/2.</li>
<li><strong>Squeeze and the two trig limits</strong> — g ≤ f ≤ h with both walls → L forces f → L; that gives x² sin(1/x) → 0, sin x / x → 1, (1 − cos x)/x → 0, sin 5x / x → 5.</li>
<li><strong>Infinity, asymptotes, continuity, IVT</strong> — compare degrees for x → ±∞ (smaller ⇒ 0, equal ⇒ ratio of leading coefficients such as 3/2, larger ⇒ ±∞); vertical asymptote where denominator = 0 and numerator ≠ 0; continuity = f(a) defined + limit exists + they are equal; and a continuous sign change on [a, b] guarantees a root, as with x³ − x − 1 on (1, 2).</li>
</ol>
<p class="meo">💡 One workflow for any limit question: substitute → if 0/0, factor or conjugate → if trig, reshape into sin(box)/box → if x → ±∞, compare degrees → if something bounded times something → 0, squeeze.</p>
<p class="pitfall">⚠️ The three marks lost most often in the exam: confusing f(a) with lim f(x); treating ∞ as a number; and forgetting that the limit laws and every cancelling step require x ≠ a.</p>`,
        `<p class="y-chinh">🎯 Năm câu. Nói được cả năm câu mà không cần nhìn tài liệu là xong Chương 1.</p>
<ol>
<li><strong>Giới hạn nói về sự tiến tới, không nói về sự đạt tới</strong> — lim(x→a) f(x) = L mô tả f đi về đâu khi x → a, với x ≠ a. Nó có thể tồn tại ở nơi f(a) không tồn tại, và có thể khác f(a) ngay cả khi cả hai cùng tồn tại.</li>
<li><strong>Hai phía nghĩa là hai bên phải khớp nhau</strong> — lim tồn tại ⟺ lim(x→a⁻) = lim(x→a⁺) = L. Ba kiểu hỏng chuẩn là nhảy bậc, vọt vô cực (1/x²) và dao động (sin(1/x)).</li>
<li><strong>Thay trực tiếp trước, gặp 0/0 thì mới xử lý</strong> — sáu luật giới hạn cho phép thay a vào. Nếu ra 0/0 thì phân tích nhân tử (x² − 9)/(x − 3) → 6, hoặc nhân liên hợp (√(x+1) − 1)/x → 1/2.</li>
<li><strong>Định lý kẹp và hai giới hạn lượng giác</strong> — g ≤ f ≤ h với hai tường cùng → L thì ép f → L; từ đó có x² sin(1/x) → 0, sin x / x → 1, (1 − cos x)/x → 0, sin 5x / x → 5.</li>
<li><strong>Vô cực, tiệm cận, liên tục, định lý giá trị trung gian</strong> — so bậc khi x → ±∞ (tử nhỏ hơn ⇒ 0, bằng nhau ⇒ tỉ số hệ số dẫn đầu như 3/2, tử lớn hơn ⇒ ±∞); tiệm cận đứng ở chỗ mẫu = 0 và tử ≠ 0; liên tục = f(a) xác định + giới hạn tồn tại + hai thứ bằng nhau; và một hàm liên tục đổi dấu trên [a, b] thì chắc chắn có nghiệm, như x³ − x − 1 trên (1, 2).</li>
</ol>
<p class="meo">💡 Một quy trình dùng cho mọi câu hỏi giới hạn: thay trực tiếp → ra 0/0 thì phân tích hoặc nhân liên hợp → gặp lượng giác thì nắn về dạng sin(ô)/ô → x → ±∞ thì so bậc → gặp "bị chặn nhân với thứ tiến về 0" thì dùng định lý kẹp.</p>
<p class="pitfall">⚠️ Ba điểm mất nhiều nhất khi thi: lẫn f(a) với lim f(x); coi ∞ như một con số; và quên rằng các luật giới hạn cùng mọi bước rút gọn đều cần điều kiện x ≠ a.</p>`],
    ]),
  ].join('\n'),
};
