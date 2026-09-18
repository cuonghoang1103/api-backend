/**
 * MAE101 · Chương 2 — Derivatives (Đạo hàm), học theo từng slide.
 * Deck 'mae2' (MAE2), 17 slide, render sẵn lên CDN images/academy/MAE101/v1/mae2/NNN.webp.
 * Nội dung bám đúng scripts/slides-src/mae101-ch2.mjs + Stewart "Essential Calculus" ch.2–3.
 * Mọi phép tính trong phần giảng đều đã kiểm tay:
 *   (3x⁴−5x²+7)' = 12x³−10x · (x² sin x)' = 2x sin x + x² cos x
 *   ((x²−1)/(x²+1))' : 2x(x²+1) − (x²−1)·2x = 4x ⇒ 4x/(x²+1)²
 *   ((3x+1)⁵)' = 15(3x+1)⁴ · (sin(3x²+1))' = 6x cos(3x²+1)
 *   x²+y²=25 ⇒ y' = −x/y · (x^x)' = x^x(ln x + 1)
 *   f(x)=x⁴ ⇒ 4x³, 12x², 24x, 24, 0 · ((3+h)²−9)/h = 6+h → 6.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae2';

export default {
  title: '2.0 — Slide bài giảng: Đạo hàm (17 slide)|||2.0 — Slide bài giảng: Đạo hàm (17 slide)',
  slug: 'mae101-2-0-slides-dao-ham',
  type: 'DOCUMENT',
  description: 'Toàn bộ 17 slide Chương 2 MAE101 — tốc độ thay đổi, định nghĩa đạo hàm bằng giới hạn, đạo hàm là hàm số, khi nào không khả vi, quy tắc cơ bản, tích, thương, đạo hàm lượng giác, quy tắc dây chuyền một và nhiều tầng, hàm mũ và log, đạo hàm ẩn, đạo hàm logarit và đạo hàm cấp cao — mỗi slide kèm giảng song ngữ, ví dụ giải từng bước và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Chapter 2 — Derivatives (cover)',
        `<p class="y-chinh">🎯 Chapter 2 of MAE101: the <strong>derivative</strong> — one limit that measures how fast anything changes.</p>
<ul>
<li><strong>Built straight on Chapter 1</strong> — the derivative is nothing but a limit of a quotient: lim(h→0) [f(a+h) − f(a)]/h. Every skill from limits gets reused here.</li>
<li><strong>Two problems, one answer</strong> — the tangent problem (slope of a curve) and the velocity problem (distance over time) collapse into the same limit, which is why one tool solves both.</li>
<li><strong>What this deck covers</strong> — 17 slides: rates of change, the definition, the derivative as a function, non-differentiable points, the basic rules, product and quotient, trig derivatives, the chain rule in one and many layers, exponentials and logs, implicit and logarithmic differentiation, and higher-order derivatives.</li>
</ul>
<p class="meo">💡 Read every derivative as a rate: f'(a) answers "if x grows by 1 unit right now, roughly how much does f grow?" Keeping that sentence in mind makes every rule below feel inevitable.</p>`,
        `<p class="y-chinh">🎯 Chương 2 của MAE101: <strong>đạo hàm</strong> — một giới hạn duy nhất dùng để đo tốc độ thay đổi của mọi thứ.</p>
<ul>
<li><strong>Dựng thẳng trên Chương 1</strong> — đạo hàm chẳng qua là giới hạn của một thương: lim(h→0) [f(a+h) − f(a)]/h. Mọi kỹ năng về giới hạn đều được dùng lại ở đây.</li>
<li><strong>Hai bài toán, một đáp số</strong> — bài toán tiếp tuyến (độ dốc đường cong) và bài toán vận tốc (quãng đường theo thời gian) rơi về cùng một giới hạn, nên chỉ một công cụ giải được cả hai.</li>
<li><strong>Bộ slide này gồm</strong> — 17 slide: tốc độ thay đổi, định nghĩa, đạo hàm là hàm số, những điểm không khả vi, quy tắc cơ bản, tích và thương, đạo hàm lượng giác, quy tắc dây chuyền một tầng và nhiều tầng, hàm mũ và log, đạo hàm ẩn, đạo hàm logarit, và đạo hàm cấp cao.</li>
</ul>
<p class="meo">💡 Hãy đọc mọi đạo hàm thành một tốc độ: f'(a) trả lời câu "ngay lúc này, x tăng 1 đơn vị thì f tăng khoảng bao nhiêu?". Giữ câu đó trong đầu thì mọi quy tắc phía dưới đều thành hiển nhiên.</p>`],

      [2, 'Contents — six blocks of Chapter 2',
        `<p class="y-chinh">🎯 Chapter 2 runs through six blocks, each one adding a new class of function you can differentiate.</p>
<ol>
<li><strong>Rates of change &amp; the definition</strong> — slides 3–4: average vs instantaneous rate, and the limit that defines f'(a).</li>
<li><strong>The derivative as a function &amp; differentiability</strong> — slides 5–6: f' as a new function with its own domain, and the three ways differentiability fails.</li>
<li><strong>Rules: sum, product, quotient</strong> — slides 7–9: constant, power, constant multiple, sum, then (uv)' and (u/v)'.</li>
<li><strong>Trig derivatives &amp; the chain rule</strong> — slides 10–12: sin, cos, tan, then composites in one and several layers.</li>
<li><strong>Exponentials, logs, implicit &amp; logarithmic differentiation</strong> — slides 13–15.</li>
<li><strong>Higher-order derivatives</strong> — slide 16: f'', f''' and what they mean physically, then the summary on slide 17.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 2 chạy qua sáu khối, mỗi khối thêm một lớp hàm số mới mà bạn lấy đạo hàm được.</p>
<ol>
<li><strong>Tốc độ thay đổi &amp; định nghĩa</strong> — slide 3–4: tốc độ trung bình so với tốc độ tức thời, và giới hạn định nghĩa f'(a).</li>
<li><strong>Đạo hàm là hàm số &amp; tính khả vi</strong> — slide 5–6: f' là một hàm mới có miền xác định riêng, và ba kiểu mất tính khả vi.</li>
<li><strong>Quy tắc: tổng, tích, thương</strong> — slide 7–9: hằng số, luỹ thừa, hằng nhân, tổng, rồi (uv)' và (u/v)'.</li>
<li><strong>Đạo hàm lượng giác &amp; quy tắc dây chuyền</strong> — slide 10–12: sin, cos, tan, rồi hàm hợp một tầng và nhiều tầng.</li>
<li><strong>Hàm mũ, log, đạo hàm ẩn &amp; đạo hàm logarit</strong> — slide 13–15.</li>
<li><strong>Đạo hàm cấp cao</strong> — slide 16: f'', f''' và ý nghĩa vật lý, rồi phần tổng kết ở slide 17.</li>
</ol>`],

      [3, 'Rates of change',
        `<p class="y-chinh">🎯 The tangent problem and the velocity problem lead to exactly the same limit — that is why one idea serves both.</p>
<ul>
<li><strong>Average rate of change</strong> — [f(a+h) − f(a)]/h. Geometrically it is the slope of the <em>secant</em> line through the two points (a, f(a)) and (a+h, f(a+h)).</li>
<li><strong>Instantaneous rate of change</strong> — lim(h→0) [f(a+h) − f(a)]/h. Geometrically it is the slope of the <em>tangent</em> line at a: let the second point slide into the first and the secant becomes the tangent.</li>
<li><strong>Why a limit is unavoidable</strong> — putting h = 0 directly gives 0/0, an indeterminate form (Chapter 1, slide 7). "Speed at one instant" literally cannot be computed by division; it has to be approached.</li>
<li><strong>The same fraction in other words</strong> — with Δx = h and Δy = f(a+h) − f(a), the average rate is Δy/Δx and the instantaneous rate is lim(Δx→0) Δy/Δx = dy/dx.</li>
<li><strong>Velocity reading</strong> — if s(t) is position, then [s(t+h) − s(t)]/h is average velocity over h seconds, and its limit is the speedometer reading at time t.</li>
<li><strong>Numeric example</strong> — f(x) = x², a = 3: with h = 1 the average rate is (16 − 9)/1 = 7; h = 0.1 gives (9.61 − 9)/0.1 = 6.1; h = 0.01 gives 6.01. The numbers march toward <strong>6</strong>, which is f'(3).</li>
</ul>
<p class="meo">💡 Units tell you what the derivative is. Position in metres over time in seconds ⇒ m/s. Cost in dollars over quantity in units ⇒ dollars per unit, i.e. marginal cost.</p>
<p class="pitfall">⚠️ Exam trap: reporting the average rate when the question says "at the instant", or the reverse. "Between t = 1 and t = 3" means one subtraction and one division; "at t = 1" means a derivative.</p>`,
        `<p class="y-chinh">🎯 Bài toán tiếp tuyến và bài toán vận tốc dẫn về đúng cùng một giới hạn — vì thế một ý tưởng phục vụ được cả hai.</p>
<ul>
<li><strong>Tốc độ thay đổi trung bình</strong> — [f(a+h) − f(a)]/h. Về hình học đó là độ dốc <em>dây cung</em> đi qua hai điểm (a, f(a)) và (a+h, f(a+h)).</li>
<li><strong>Tốc độ thay đổi tức thời</strong> — lim(h→0) [f(a+h) − f(a)]/h. Về hình học đó là độ dốc <em>tiếp tuyến</em> tại a: cho điểm thứ hai trượt về trùng điểm thứ nhất thì dây cung hoá thành tiếp tuyến.</li>
<li><strong>Vì sao bắt buộc phải có giới hạn</strong> — thay thẳng h = 0 sẽ ra 0/0, một dạng vô định (Chương 1, slide 7). "Vận tốc tại một thời điểm" đúng nghĩa đen là không chia ra được; phải tiến tới nó.</li>
<li><strong>Cùng một phân số nói theo cách khác</strong> — đặt Δx = h và Δy = f(a+h) − f(a) thì tốc độ trung bình là Δy/Δx, còn tốc độ tức thời là lim(Δx→0) Δy/Δx = dy/dx.</li>
<li><strong>Đọc theo nghĩa vận tốc</strong> — nếu s(t) là quãng đường thì [s(t+h) − s(t)]/h là vận tốc trung bình trong h giây, và giới hạn của nó là số đang hiện trên đồng hồ tốc độ tại thời điểm t.</li>
<li><strong>Ví dụ bằng số</strong> — f(x) = x², a = 3: với h = 1 thì tốc độ trung bình là (16 − 9)/1 = 7; h = 0,1 cho (9,61 − 9)/0,1 = 6,1; h = 0,01 cho 6,01. Dãy số đang tiến về <strong>6</strong>, đúng bằng f'(3).</li>
</ul>
<p class="meo">💡 Đơn vị nói cho bạn biết đạo hàm là cái gì. Quãng đường mét chia thời gian giây ⇒ m/s. Chi phí đồng chia số lượng sản phẩm ⇒ đồng trên mỗi sản phẩm, tức chi phí biên.</p>
<p class="pitfall">⚠️ Bẫy thi: đề hỏi "tại thời điểm" mà lại trả lời bằng tốc độ trung bình, hoặc ngược lại. "Từ t = 1 đến t = 3" chỉ cần một phép trừ và một phép chia; "tại t = 1" mới cần đạo hàm.</p>`],

      [4, 'The definition of the derivative',
        `<p class="y-chinh">🎯 f'(a) = lim(h→0) [f(a+h) − f(a)]/h — the derivative at a is the limit of the average rate of change.</p>
<ul>
<li><strong>The formula, read aloud</strong> — "f prime of a equals the limit, as h approaches zero, of f of a plus h minus f of a, all over h".</li>
<li><strong>Geometric meaning</strong> — f'(a) is the <strong>slope of the tangent line</strong> to the graph of f at the point (a, f(a)). From it, the tangent line itself is y − f(a) = f'(a)(x − a).</li>
<li><strong>Worked example, step 1</strong> — take f(x) = x² and a = 3. Then f(3+h) = (3+h)² = 9 + 6h + h², and f(3) = 9.</li>
<li><strong>Step 2 — form the quotient</strong> — [f(3+h) − f(3)]/h = (9 + 6h + h² − 9)/h = (6h + h²)/h.</li>
<li><strong>Step 3 — cancel h</strong> — legal because h → 0 means h ≠ 0: (6h + h²)/h = 6 + h.</li>
<li><strong>Step 4 — take the limit</strong> — lim(h→0) (6 + h) = <strong>6</strong>. So f'(3) = 6, and the tangent at (3, 9) is y − 9 = 6(x − 3), i.e. y = 6x − 9.</li>
<li><strong>When the limit fails</strong> — if that limit does not exist, f simply <em>has no derivative</em> at a. Slide 6 lists the three usual reasons.</li>
<li><strong>Equivalent form</strong> — f'(a) = lim(x→a) [f(x) − f(a)]/(x − a), obtained by writing x = a + h. Some exam questions hand you this version instead.</li>
</ul>
<p class="meo">💡 Every derivative computed from the definition follows the same four beats: expand f(a+h) → subtract f(a) → cancel one factor of h → let h → 0. If h will not cancel, recheck the expansion.</p>
<p class="pitfall">⚠️ Two classic slips: writing (3+h)² = 9 + h² (the cross term 6h is exactly the part that survives), and setting h = 0 before cancelling, which turns the whole thing into 0/0 and blocks the computation.</p>`,
        `<p class="y-chinh">🎯 f'(a) = lim(h→0) [f(a+h) − f(a)]/h — đạo hàm tại a là giới hạn của tốc độ thay đổi trung bình.</p>
<ul>
<li><strong>Đọc công thức thành lời</strong> — "f phẩy của a bằng giới hạn, khi h tiến tới 0, của f của a cộng h trừ f của a, tất cả chia h".</li>
<li><strong>Ý nghĩa hình học</strong> — f'(a) là <strong>hệ số góc của tiếp tuyến</strong> với đồ thị f tại điểm (a, f(a)). Từ đó phương trình tiếp tuyến là y − f(a) = f'(a)(x − a).</li>
<li><strong>Ví dụ giải đủ bước, bước 1</strong> — lấy f(x) = x² và a = 3. Khi đó f(3+h) = (3+h)² = 9 + 6h + h², còn f(3) = 9.</li>
<li><strong>Bước 2 — lập thương</strong> — [f(3+h) − f(3)]/h = (9 + 6h + h² − 9)/h = (6h + h²)/h.</li>
<li><strong>Bước 3 — rút gọn h</strong> — được phép vì h → 0 nghĩa là h ≠ 0: (6h + h²)/h = 6 + h.</li>
<li><strong>Bước 4 — lấy giới hạn</strong> — lim(h→0) (6 + h) = <strong>6</strong>. Vậy f'(3) = 6, và tiếp tuyến tại (3, 9) là y − 9 = 6(x − 3), tức y = 6x − 9.</li>
<li><strong>Khi giới hạn không tồn tại</strong> — nếu giới hạn đó không tồn tại thì f đơn giản là <em>không có đạo hàm</em> tại a. Slide 6 liệt kê ba lý do thường gặp.</li>
<li><strong>Dạng tương đương</strong> — f'(a) = lim(x→a) [f(x) − f(a)]/(x − a), có được bằng cách đặt x = a + h. Một số đề đưa cho bạn đúng dạng này.</li>
</ul>
<p class="meo">💡 Mọi phép tính đạo hàm bằng định nghĩa đều theo bốn nhịp: khai triển f(a+h) → trừ f(a) → rút gọn một thừa số h → cho h → 0. Nếu h không rút được thì hãy kiểm lại bước khai triển.</p>
<p class="pitfall">⚠️ Hai lỗi kinh điển: viết (3+h)² = 9 + h² (chính số hạng chéo 6h mới là phần còn sống sót), và thay h = 0 trước khi rút gọn, biến tất cả thành 0/0 và tắc luôn.</p>`],

      [5, 'The derivative as a function',
        `<p class="y-chinh">🎯 Replace the fixed number a by a variable x and the derivative stops being one number — it becomes a whole new function f'.</p>
<ul>
<li><strong>The definition again, now with x</strong> — f'(x) = lim(h→0) [f(x+h) − f(x)]/h. For every x where that limit exists, f'(x) is a value; together they form a function.</li>
<li><strong>Its own domain</strong> — the domain of f' is a <em>subset</em> of the domain of f. Example: f(x) = |x| is defined for all real x, but f' is defined only for x ≠ 0.</li>
<li><strong>Four notations, one concept</strong> — the table on the slide lines them up: f'(x) · dy/dx · df/dx · Df(x). All are read "the derivative of f with respect to x" and mean exactly the same thing.</li>
<li><strong>Who uses which</strong> — f'(x) (Lagrange) is compact for pure computation; dy/dx (Leibniz) shows <em>which variable</em> you differentiate by, which matters for the chain rule and implicit differentiation; Df(x) (Euler) appears in operator-style writing.</li>
<li><strong>Value at a point in Leibniz form</strong> — f'(a) is written dy/dx evaluated at x = a, often as (dy/dx)|(x=a). Do not drop the evaluation bar: dy/dx alone is a function, not a number.</li>
<li><strong>Worked example</strong> — f(x) = x²: [f(x+h) − f(x)]/h = (x² + 2xh + h² − x²)/h = 2x + h → f'(x) = <strong>2x</strong>. Feeding x = 3 back in gives 6, matching slide 4.</li>
<li><strong>Reading f' off a graph</strong> — where f rises, f' &gt; 0; where f falls, f' &lt; 0; at a peak or a valley of f, f' = 0. That correspondence is the whole of Chapter 3.</li>
</ul>
<p class="meo">💡 Leibniz notation is a memory aid that works: dy/dx really does behave like a fraction in the chain rule, dy/dx = (dy/du)·(du/dx), with du appearing to cancel.</p>
<p class="pitfall">⚠️ dy/dx is a single symbol, not a division of d by x. Never "cancel the d". And f'(x) is a function while f'(2) is a number — an exam answer that leaves x in it when a number was asked for loses the mark.</p>`,
        `<p class="y-chinh">🎯 Thay số cố định a bằng biến x thì đạo hàm không còn là một con số — nó trở thành hẳn một hàm số mới f'.</p>
<ul>
<li><strong>Vẫn định nghĩa đó, giờ viết theo x</strong> — f'(x) = lim(h→0) [f(x+h) − f(x)]/h. Với mỗi x mà giới hạn đó tồn tại, f'(x) là một giá trị; gộp lại thành một hàm số.</li>
<li><strong>Có miền xác định riêng</strong> — miền xác định của f' là <em>tập con</em> của miền xác định của f. Ví dụ: f(x) = |x| xác định với mọi x thực, nhưng f' chỉ xác định với x ≠ 0.</li>
<li><strong>Bốn ký hiệu, một khái niệm</strong> — bảng trên slide xếp chúng cạnh nhau: f'(x) · dy/dx · df/dx · Df(x). Tất cả đều đọc là "đạo hàm của f theo x" và nghĩa giống hệt nhau.</li>
<li><strong>Ai hay dùng cái nào</strong> — f'(x) (Lagrange) gọn khi tính thuần tuý; dy/dx (Leibniz) cho thấy <em>đang lấy đạo hàm theo biến nào</em>, điều rất quan trọng ở quy tắc dây chuyền và đạo hàm ẩn; Df(x) (Euler) xuất hiện khi viết theo kiểu toán tử.</li>
<li><strong>Giá trị tại một điểm viết theo Leibniz</strong> — f'(a) được viết là dy/dx tính tại x = a, thường ghi (dy/dx)|(x=a). Đừng bỏ vạch đánh dấu đó: riêng dy/dx là một hàm chứ không phải một số.</li>
<li><strong>Ví dụ giải đủ bước</strong> — f(x) = x²: [f(x+h) − f(x)]/h = (x² + 2xh + h² − x²)/h = 2x + h → f'(x) = <strong>2x</strong>. Thay x = 3 vào lại ra 6, khớp với slide 4.</li>
<li><strong>Đọc f' từ đồ thị</strong> — chỗ f đi lên thì f' &gt; 0; chỗ f đi xuống thì f' &lt; 0; tại đỉnh hoặc đáy của f thì f' = 0. Mối tương ứng đó chính là toàn bộ Chương 3.</li>
</ul>
<p class="meo">💡 Ký hiệu Leibniz là một mẹo nhớ thật sự hiệu quả: dy/dx quả thật hành xử như một phân số trong quy tắc dây chuyền, dy/dx = (dy/du)·(du/dx), với du trông như được rút gọn.</p>
<p class="pitfall">⚠️ dy/dx là một ký hiệu nguyên khối, không phải phép chia d cho x. Đừng bao giờ "rút gọn chữ d". Và f'(x) là một hàm còn f'(2) là một số — đề hỏi số mà đáp án còn chữ x là mất điểm.</p>`],

      [6, 'Where f is not differentiable',
        `<p class="y-chinh">🎯 Three shapes kill the derivative: a corner, a break in the graph, and a vertical tangent.</p>
<ul>
<li><strong>1. Corner (sharp point)</strong> — the graph bends abruptly, so the left and right limits of the difference quotient are different numbers. The two-sided limit fails, exactly as in Chapter 1 slide 4.</li>
<li><strong>The standard exhibit</strong> — f(x) = |x| at 0: for h &gt; 0 the quotient is |h|/h = +1, for h &lt; 0 it is |h|/h = −1. Since 1 ≠ −1 the limit does not exist, so f'(0) does not exist even though the graph is unbroken there.</li>
<li><strong>2. Discontinuity</strong> — if f is not continuous at a (a jump, a hole, a blow-up), it cannot be differentiable at a. A tangent line needs a point to touch.</li>
<li><strong>3. Vertical tangent</strong> — the slope tends to +∞ or −∞. Example on the slide: the cube root, f(x) = ∛x at 0; here f'(x) = 1/(3∛(x²)) → ∞ as x → 0, so the tangent is the vertical line x = 0 and has no finite slope.</li>
<li><strong>The one-way theorem</strong> — <strong>differentiable ⇒ continuous</strong>. If f'(a) exists, then f is continuous at a; so any function with a jump at a is instantly disqualified.</li>
<li><strong>The converse is false</strong> — continuous does <em>not</em> imply differentiable, and |x| at 0 is the counterexample: continuous everywhere, differentiable everywhere except one point.</li>
<li><strong>How to test in an exam</strong> — for a piecewise function, check continuity at the seam first, then compute the one-sided derivatives with each branch's own formula and compare them.</li>
</ul>
<p class="meo">💡 Picture test: differentiable means the curve looks like a straight line when you zoom far enough in. Corners stay corners no matter how much you zoom, which is precisely why they have no slope.</p>
<p class="pitfall">⚠️ Exam trap: a piecewise function whose two branches merely <em>meet</em> is often declared differentiable. Meeting only gives continuity; you must also match the two one-sided slopes. Typical questions ask you to solve for a and b so that both conditions hold.</p>`,
        `<p class="y-chinh">🎯 Ba dáng đồ thị giết chết đạo hàm: góc nhọn, chỗ đứt gãy, và tiếp tuyến thẳng đứng.</p>
<ul>
<li><strong>1. Góc nhọn</strong> — đồ thị gấp khúc đột ngột, nên giới hạn trái và giới hạn phải của tỉ sai phân ra hai số khác nhau. Giới hạn hai phía không tồn tại, đúng như Chương 1 slide 4.</li>
<li><strong>Vật mẫu chuẩn</strong> — f(x) = |x| tại 0: với h &gt; 0 thương bằng |h|/h = +1, với h &lt; 0 thương bằng |h|/h = −1. Vì 1 ≠ −1 nên giới hạn không tồn tại, vậy f'(0) không tồn tại dù đồ thị ở đó vẫn liền mạch.</li>
<li><strong>2. Gián đoạn</strong> — nếu f không liên tục tại a (nhảy bậc, lỗ thủng, vọt vô cực) thì chắc chắn không khả vi tại a. Tiếp tuyến cần một điểm để chạm vào.</li>
<li><strong>3. Tiếp tuyến đứng</strong> — độ dốc tiến ra +∞ hoặc −∞. Ví dụ trên slide: hàm căn bậc ba, f(x) = ∛x tại 0; ở đây f'(x) = 1/(3∛(x²)) → ∞ khi x → 0, nên tiếp tuyến là đường thẳng đứng x = 0 và không có hệ số góc hữu hạn.</li>
<li><strong>Định lý một chiều</strong> — <strong>khả vi ⇒ liên tục</strong>. Nếu f'(a) tồn tại thì f liên tục tại a; nên hàm nào nhảy bậc tại a là bị loại ngay lập tức.</li>
<li><strong>Chiều ngược lại SAI</strong> — liên tục <em>không</em> suy ra khả vi, và |x| tại 0 chính là phản ví dụ: liên tục khắp nơi, khả vi khắp nơi trừ đúng một điểm.</li>
<li><strong>Cách kiểm khi thi</strong> — với hàm cho theo từng khoảng, kiểm tính liên tục ở mối nối trước, rồi tính đạo hàm một phía bằng công thức riêng của từng nhánh và so sánh hai kết quả.</li>
</ul>
<p class="meo">💡 Phép thử bằng hình: khả vi nghĩa là phóng to đủ mức thì đường cong trông như một đường thẳng. Góc nhọn thì phóng bao nhiêu vẫn là góc nhọn, đó đúng là lý do nó không có độ dốc.</p>
<p class="pitfall">⚠️ Bẫy thi: hàm từng khoảng mà hai nhánh chỉ <em>gặp nhau</em> thường bị kết luận vội là khả vi. Gặp nhau mới chỉ cho tính liên tục; còn phải khớp thêm hai độ dốc một phía nữa. Đề hay bắt giải tìm a và b để cả hai điều kiện cùng thoả.</p>`],

      [7, 'Basic differentiation rules',
        `<p class="y-chinh">🎯 Four rules replace the limit definition for every polynomial you will ever meet.</p>
<ul>
<li><strong>Constant rule</strong> — (c)' = 0. A constant function is a horizontal line; its slope is 0 everywhere.</li>
<li><strong>Power rule</strong> — (xⁿ)' = n·xⁿ⁻¹. Bring the exponent down in front, then drop it by one. It holds for <em>every</em> real n, not just positive integers.</li>
<li><strong>Constant multiple rule</strong> — (c·f)' = c·f'. Constants sit still and wait outside the derivative.</li>
<li><strong>Sum / difference rule</strong> — (f ± g)' = f' ± g'. Differentiate term by term; this is what makes polynomials trivial.</li>
<li><strong>Worked example from the slide</strong> — (3x⁴ − 5x² + 7)'. Term 1: 3·(x⁴)' = 3·4x³ = 12x³. Term 2: −5·(x²)' = −5·2x = −10x. Term 3: (7)' = 0. Total: <strong>12x³ − 10x</strong>.</li>
<li><strong>Power rule beyond integers</strong> — 1/x = x⁻¹ ⇒ derivative −1·x⁻² = −1/x². And √x = x^(1/2) ⇒ derivative (1/2)x^(−1/2) = 1/(2√x).</li>
<li><strong>Special case n = 1</strong> — (x)' = 1·x⁰ = 1, which simply says the line y = x has slope 1.</li>
</ul>
<p class="meo">💡 Rewrite before you differentiate. Roots and fractions become powers: ∛(x²) = x^(2/3), 5/x³ = 5x⁻³. Once everything is xⁿ, the power rule alone finishes the job and you never need the quotient rule for those.</p>
<p class="pitfall">⚠️ (x⁴)' is 4x³, not 4x⁴ and not x³. And the constant 7 differentiates to 0, not to 7 — students who "carry the constant along" lose marks on nearly every such item.</p>`,
        `<p class="y-chinh">🎯 Bốn quy tắc thay thế hẳn định nghĩa bằng giới hạn cho mọi đa thức bạn sẽ gặp.</p>
<ul>
<li><strong>Quy tắc hằng số</strong> — (c)' = 0. Hàm hằng là một đường nằm ngang; độ dốc bằng 0 ở khắp nơi.</li>
<li><strong>Quy tắc luỹ thừa</strong> — (xⁿ)' = n·xⁿ⁻¹. Hạ số mũ xuống làm hệ số, rồi giảm số mũ đi một. Nó đúng với <em>mọi</em> số thực n, không chỉ số nguyên dương.</li>
<li><strong>Quy tắc hằng nhân</strong> — (c·f)' = c·f'. Hằng số cứ đứng yên chờ ở ngoài dấu đạo hàm.</li>
<li><strong>Quy tắc tổng / hiệu</strong> — (f ± g)' = f' ± g'. Lấy đạo hàm từng số hạng; chính điều này khiến đa thức trở nên dễ như không.</li>
<li><strong>Ví dụ trên slide, giải đủ bước</strong> — (3x⁴ − 5x² + 7)'. Số hạng 1: 3·(x⁴)' = 3·4x³ = 12x³. Số hạng 2: −5·(x²)' = −5·2x = −10x. Số hạng 3: (7)' = 0. Tổng: <strong>12x³ − 10x</strong>.</li>
<li><strong>Quy tắc luỹ thừa vượt ra ngoài số nguyên</strong> — 1/x = x⁻¹ ⇒ đạo hàm −1·x⁻² = −1/x². Và √x = x^(1/2) ⇒ đạo hàm (1/2)x^(−1/2) = 1/(2√x).</li>
<li><strong>Trường hợp riêng n = 1</strong> — (x)' = 1·x⁰ = 1, tức chỉ nói rằng đường thẳng y = x có độ dốc bằng 1.</li>
</ul>
<p class="meo">💡 Viết lại trước khi lấy đạo hàm. Căn và phân số đều đưa về luỹ thừa: ∛(x²) = x^(2/3), 5/x³ = 5x⁻³. Khi mọi thứ đã thành xⁿ thì riêng quy tắc luỹ thừa là đủ, không cần đụng tới quy tắc thương.</p>
<p class="pitfall">⚠️ (x⁴)' là 4x³, không phải 4x⁴ và cũng không phải x³. Và hằng số 7 lấy đạo hàm ra 0 chứ không phải ra 7 — bạn nào "khiêng hằng số đi theo" là mất điểm ở gần như mọi câu dạng này.</p>`],

      [8, 'The product rule',
        `<p class="y-chinh">🎯 (uv)' = u'v + uv' — the derivative of a product is NOT the product of the derivatives.</p>
<ul>
<li><strong>The rule in words</strong> — differentiate the first factor and keep the second, then keep the first and differentiate the second, and add the two pieces.</li>
<li><strong>Why it is not u'v'</strong> — one-line disproof: take u = v = x. Then (x·x)' = (x²)' = 2x, but u'v' = 1·1 = 1, and 2x ≠ 1. The wrong rule fails at the simplest possible test.</li>
<li><strong>Worked example from the slide</strong> — y = x² sin x.</li>
<li><strong>Step 1 — name the parts</strong> — u = x² ⇒ u' = 2x, and v = sin x ⇒ v' = cos x.</li>
<li><strong>Step 2 — apply the pattern</strong> — y' = u'v + uv' = (2x)(sin x) + (x²)(cos x).</li>
<li><strong>Step 3 — the answer</strong> — y' = <strong>2x sin x + x² cos x</strong>. Leave it factored as x(2 sin x + x cos x) if the next question needs its roots.</li>
<li><strong>Three or more factors</strong> — (uvw)' = u'vw + uv'w + uvw': differentiate one factor at a time and keep the others. The pattern extends to any number of factors.</li>
<li><strong>When you do not need it</strong> — if the product multiplies out easily, expanding first is faster. (x² + 1)(x − 3) = x³ − 3x² + x − 3 ⇒ derivative 3x² − 6x + 1, no rule required.</li>
</ul>
<p class="meo">💡 Chant it: "first-prime second, plus first second-prime". Because addition is commutative the order of the two terms does not matter — unlike the quotient rule on the next slide, where order decides the sign.</p>
<p class="pitfall">⚠️ Writing (x² sin x)' = 2x·cos x is the single most common error in this chapter: it differentiates both factors at once. The product rule always produces <em>two</em> terms joined by a plus sign; if your answer has only one term, you skipped half the rule.</p>`,
        `<p class="y-chinh">🎯 (uv)' = u'v + uv' — đạo hàm của một tích KHÔNG phải là tích các đạo hàm.</p>
<ul>
<li><strong>Quy tắc nói bằng lời</strong> — lấy đạo hàm thừa số thứ nhất giữ nguyên thừa số thứ hai, rồi giữ nguyên thừa số thứ nhất lấy đạo hàm thừa số thứ hai, xong cộng hai phần lại.</li>
<li><strong>Vì sao không phải u'v'</strong> — bác bỏ chỉ một dòng: lấy u = v = x. Khi đó (x·x)' = (x²)' = 2x, còn u'v' = 1·1 = 1, mà 2x ≠ 1. Quy tắc sai đổ ngay ở phép thử đơn giản nhất.</li>
<li><strong>Ví dụ trên slide, giải đủ bước</strong> — y = x² sin x.</li>
<li><strong>Bước 1 — đặt tên các phần</strong> — u = x² ⇒ u' = 2x, và v = sin x ⇒ v' = cos x.</li>
<li><strong>Bước 2 — áp công thức</strong> — y' = u'v + uv' = (2x)(sin x) + (x²)(cos x).</li>
<li><strong>Bước 3 — kết quả</strong> — y' = <strong>2x sin x + x² cos x</strong>. Nếu câu sau cần tìm nghiệm thì để dạng phân tích x(2 sin x + x cos x).</li>
<li><strong>Từ ba thừa số trở lên</strong> — (uvw)' = u'vw + uv'w + uvw': mỗi lượt lấy đạo hàm đúng một thừa số, giữ nguyên các thừa số còn lại. Quy luật này mở rộng cho số thừa số bất kỳ.</li>
<li><strong>Khi nào không cần dùng nó</strong> — nếu nhân tung ra dễ thì khai triển trước lại nhanh hơn. (x² + 1)(x − 3) = x³ − 3x² + x − 3 ⇒ đạo hàm 3x² − 6x + 1, chẳng cần quy tắc nào.</li>
</ul>
<p class="meo">💡 Đọc thành vè: "nhất phẩy nhân nhì, cộng nhất nhân nhì phẩy". Vì phép cộng giao hoán nên thứ tự hai số hạng không quan trọng — khác hẳn quy tắc thương ở slide sau, nơi thứ tự quyết định dấu.</p>
<p class="pitfall">⚠️ Viết (x² sin x)' = 2x·cos x là lỗi phổ biến nhất của cả chương này: nó lấy đạo hàm cả hai thừa số cùng lúc. Quy tắc tích luôn sinh ra <em>hai</em> số hạng nối bằng dấu cộng; đáp án chỉ có một số hạng nghĩa là bạn đã bỏ mất nửa quy tắc.</p>`],

      [9, 'The quotient rule',
        `<p class="y-chinh">🎯 (u/v)' = (u'v − uv')/v² — note the MINUS sign and the square on the denominator.</p>
<ul>
<li><strong>The rule in words</strong> — "derivative of the top times the bottom, minus the top times the derivative of the bottom, all over the bottom squared".</li>
<li><strong>Order is not free here</strong> — subtraction is not commutative, so swapping the two products flips the sign of the whole answer. This is the difference from the product rule.</li>
<li><strong>Worked example from the slide</strong> — y = (x² − 1)/(x² + 1).</li>
<li><strong>Step 1 — name the parts</strong> — u = x² − 1 ⇒ u' = 2x, and v = x² + 1 ⇒ v' = 2x.</li>
<li><strong>Step 2 — build the numerator</strong> — u'v − uv' = 2x(x² + 1) − (x² − 1)(2x) = (2x³ + 2x) − (2x³ − 2x) = <strong>4x</strong>.</li>
<li><strong>Step 3 — the answer</strong> — y' = 4x/(x² + 1)². Since (x² + 1)² &gt; 0 always, the sign of y' is the sign of x: the curve falls for x &lt; 0 and rises for x &gt; 0.</li>
<li><strong>Do not expand the denominator</strong> — leaving (x² + 1)² factored keeps the expression readable and makes sign analysis in Chapter 3 immediate.</li>
<li><strong>Cheaper alternatives</strong> — for a constant numerator, rewrite instead: 5/x³ = 5x⁻³ ⇒ derivative −15x⁻⁴. For a constant denominator, pull it out: (x² + 1)/4 ⇒ derivative x/2.</li>
</ul>
<p class="meo">💡 Memory hook: the answer must reduce correctly when v = 1. Then (u/1)' = (u'·1 − u·0)/1 = u'. If your remembered version fails that check, you have the terms the wrong way round.</p>
<p class="pitfall">⚠️ Three habitual errors: writing plus instead of minus in the numerator; forgetting the square on v; and putting the terms in the order uv' − u'v, which delivers the correct expression with the wrong sign — here it would give −4x/(x² + 1)².</p>`,
        `<p class="y-chinh">🎯 (u/v)' = (u'v − uv')/v² — chú ý dấu TRỪ và mẫu số được bình phương.</p>
<ul>
<li><strong>Quy tắc nói bằng lời</strong> — "đạo hàm tử nhân mẫu, trừ tử nhân đạo hàm mẫu, tất cả chia mẫu bình phương".</li>
<li><strong>Thứ tự ở đây không tuỳ tiện được</strong> — phép trừ không giao hoán, nên đổi chỗ hai tích là đổi dấu cả đáp án. Đây chính là chỗ khác với quy tắc tích.</li>
<li><strong>Ví dụ trên slide, giải đủ bước</strong> — y = (x² − 1)/(x² + 1).</li>
<li><strong>Bước 1 — đặt tên các phần</strong> — u = x² − 1 ⇒ u' = 2x, và v = x² + 1 ⇒ v' = 2x.</li>
<li><strong>Bước 2 — dựng tử số</strong> — u'v − uv' = 2x(x² + 1) − (x² − 1)(2x) = (2x³ + 2x) − (2x³ − 2x) = <strong>4x</strong>.</li>
<li><strong>Bước 3 — kết quả</strong> — y' = 4x/(x² + 1)². Vì (x² + 1)² &gt; 0 với mọi x nên dấu của y' đúng bằng dấu của x: đường cong nghịch biến khi x &lt; 0 và đồng biến khi x &gt; 0.</li>
<li><strong>Đừng khai triển mẫu</strong> — để nguyên dạng (x² + 1)² thì biểu thức dễ nhìn và việc xét dấu ở Chương 3 làm được ngay.</li>
<li><strong>Đường vòng rẻ hơn</strong> — tử là hằng số thì viết lại: 5/x³ = 5x⁻³ ⇒ đạo hàm −15x⁻⁴. Mẫu là hằng số thì rút ra ngoài: (x² + 1)/4 ⇒ đạo hàm x/2.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: công thức phải rút đúng khi v = 1. Khi đó (u/1)' = (u'·1 − u·0)/1 = u'. Nếu bản bạn nhớ không qua nổi phép thử này thì bạn đang xếp hai số hạng ngược nhau.</p>
<p class="pitfall">⚠️ Ba lỗi thành nếp: viết dấu cộng thay cho dấu trừ ở tử; quên bình phương mẫu; và xếp thành uv' − u'v, cho ra đúng biểu thức nhưng sai dấu — ở đây sẽ ra −4x/(x² + 1)².</p>`],

      [10, 'Derivatives of trigonometric functions',
        `<p class="y-chinh">🎯 Three results to memorise: (sin x)' = cos x, (cos x)' = −sin x, (tan x)' = sec²x.</p>
<ul>
<li><strong>The table on the slide</strong> — sin x → cos x · cos x → −sin x · tan x → sec²x = 1/cos²x. Only the middle one carries a minus sign, and that is the one exams test.</li>
<li><strong>Where sin comes from</strong> — the definition plus the two Chapter 1 limits: lim(h→0) (sin h)/h = 1 and lim(h→0) (1 − cos h)/h = 0. Expanding sin(x + h) = sin x cos h + cos x sin h and dividing by h gives exactly cos x.</li>
<li><strong>Deriving tan yourself</strong> — write tan x = sin x/cos x and use the quotient rule: [cos x·cos x − sin x·(−sin x)]/cos²x = (cos²x + sin²x)/cos²x = 1/cos²x = sec²x.</li>
<li><strong>The other three</strong> — (cot x)' = −csc²x · (sec x)' = sec x tan x · (csc x)' = −csc x cot x. Notice the pattern: every "co-" function picks up a minus sign.</li>
<li><strong>The four-step cycle</strong> — differentiating sin repeatedly gives sin → cos → −sin → −cos → sin. After four derivatives you are back where you started, which makes higher-order trig derivatives easy (slide 16).</li>
<li><strong>Radians are compulsory</strong> — these formulas rely on lim (sin x)/x = 1, which only holds in radians. In degrees you would get (sin x)' = (π/180)·cos x.</li>
<li><strong>Combined example</strong> — y = x² sin x was slide 8; y = sin x/x needs the quotient rule: y' = (x cos x − sin x)/x².</li>
</ul>
<p class="meo">💡 Memory hook: the derivative of cos is "negative sin" because cosine starts at its maximum and immediately falls. Checking the graph at x = 0 (cos flat at height 1, slope 0 = −sin 0) confirms the sign in two seconds.</p>
<p class="pitfall">⚠️ (sin x)' = cos x does <em>not</em> extend to (sin 2x)' = cos 2x. A composite needs the chain rule (next slide), which supplies the factor 2: (sin 2x)' = 2 cos 2x.</p>`,
        `<p class="y-chinh">🎯 Ba kết quả phải thuộc: (sin x)' = cos x, (cos x)' = −sin x, (tan x)' = sec²x.</p>
<ul>
<li><strong>Bảng trên slide</strong> — sin x → cos x · cos x → −sin x · tan x → sec²x = 1/cos²x. Chỉ dòng giữa mang dấu trừ, và đó đúng là dòng đề thi hay xoáy vào.</li>
<li><strong>sin lấy từ đâu ra</strong> — từ định nghĩa cộng với hai giới hạn của Chương 1: lim(h→0) (sin h)/h = 1 và lim(h→0) (1 − cos h)/h = 0. Khai triển sin(x + h) = sin x cos h + cos x sin h rồi chia cho h sẽ ra đúng cos x.</li>
<li><strong>Tự suy ra tan</strong> — viết tan x = sin x/cos x rồi dùng quy tắc thương: [cos x·cos x − sin x·(−sin x)]/cos²x = (cos²x + sin²x)/cos²x = 1/cos²x = sec²x.</li>
<li><strong>Ba hàm còn lại</strong> — (cot x)' = −csc²x · (sec x)' = sec x tan x · (csc x)' = −csc x cot x. Để ý quy luật: cứ hàm nào có tiền tố "co-" là nhận thêm dấu trừ.</li>
<li><strong>Vòng lặp bốn bước</strong> — lấy đạo hàm sin liên tiếp cho sin → cos → −sin → −cos → sin. Sau bốn lần là quay về chỗ cũ, khiến đạo hàm cấp cao của hàm lượng giác trở nên dễ (slide 16).</li>
<li><strong>Bắt buộc dùng radian</strong> — các công thức này dựa vào lim (sin x)/x = 1, mà điều đó chỉ đúng với radian. Tính bằng độ thì sẽ ra (sin x)' = (π/180)·cos x.</li>
<li><strong>Ví dụ kết hợp</strong> — y = x² sin x đã làm ở slide 8; còn y = sin x/x thì cần quy tắc thương: y' = (x cos x − sin x)/x².</li>
</ul>
<p class="meo">💡 Mẹo nhớ: đạo hàm của cos là "trừ sin" vì cosin xuất phát ở giá trị lớn nhất và lập tức đi xuống. Nhìn đồ thị tại x = 0 (cos nằm phẳng ở độ cao 1, độ dốc 0 = −sin 0) là kiểm được dấu trong hai giây.</p>
<p class="pitfall">⚠️ (sin x)' = cos x <em>không</em> suy rộng thành (sin 2x)' = cos 2x. Hàm hợp phải dùng quy tắc dây chuyền (slide kế), thứ cấp cho ta hệ số 2: (sin 2x)' = 2 cos 2x.</p>`],

      [11, 'The chain rule',
        `<p class="y-chinh">🎯 [f(g(x))]' = f'(g(x))·g'(x) — differentiate the outer function, keep the inside untouched, then multiply by the derivative of the inside.</p>
<ul>
<li><strong>What a composite is</strong> — a function inside another function. In (3x + 1)⁵ the outer operation is "raise to the fifth power" and the inner one is 3x + 1.</li>
<li><strong>The rule in Leibniz form</strong> — with u = g(x), dy/dx = (dy/du)·(du/dx). Written this way it looks like fractions cancelling, which is exactly why Leibniz notation is worth learning.</li>
<li><strong>Worked example from the slide</strong> — y = (3x + 1)⁵.</li>
<li><strong>Step 1 — split it</strong> — outer u⁵ with derivative 5u⁴; inner u = 3x + 1 with u' = 3.</li>
<li><strong>Step 2 — multiply</strong> — y' = 5(3x + 1)⁴·3.</li>
<li><strong>Step 3 — the answer</strong> — y' = <strong>15(3x + 1)⁴</strong>. Note the inside stays exactly as it was; only the exponent changed.</li>
<li><strong>Sanity check by expansion</strong> — for the smaller case y = (3x + 1)² = 9x² + 6x + 1, direct differentiation gives 18x + 6, and the chain rule gives 2(3x + 1)·3 = 18x + 6. They agree, which is the proof that the extra factor 3 belongs there.</li>
<li><strong>The factor you keep forgetting</strong> — that "·g'(x)" is the whole content of the rule. Drop it and every composite answer is off by a constant, or by a whole function.</li>
</ul>
<p class="meo">💡 Peel it like an onion: ask "what is the last operation I would perform if I plugged in a number?" That operation is the outer function, and everything under it is the inside.</p>
<p class="pitfall">⚠️ Exam trap: writing [(3x + 1)⁵]' = 5(3x + 1)⁴ and stopping. It looks finished, but the inner derivative 3 is missing, so the answer is three times too small. Any time the inside is not simply x, there must be a multiplication at the end.</p>`,
        `<p class="y-chinh">🎯 [f(g(x))]' = f'(g(x))·g'(x) — lấy đạo hàm hàm ngoài, giữ nguyên phần bên trong, rồi nhân với đạo hàm của phần bên trong.</p>
<ul>
<li><strong>Hàm hợp là gì</strong> — một hàm nằm trong một hàm khác. Ở (3x + 1)⁵ thì phép ngoài là "luỹ thừa bậc năm" còn phần trong là 3x + 1.</li>
<li><strong>Quy tắc viết theo Leibniz</strong> — đặt u = g(x) thì dy/dx = (dy/du)·(du/dx). Viết kiểu này trông như hai phân số rút gọn cho nhau, và đó đúng là lý do nên học ký hiệu Leibniz.</li>
<li><strong>Ví dụ trên slide, giải đủ bước</strong> — y = (3x + 1)⁵.</li>
<li><strong>Bước 1 — tách ra</strong> — ngoài là u⁵ với đạo hàm 5u⁴; trong là u = 3x + 1 với u' = 3.</li>
<li><strong>Bước 2 — nhân lại</strong> — y' = 5(3x + 1)⁴·3.</li>
<li><strong>Bước 3 — kết quả</strong> — y' = <strong>15(3x + 1)⁴</strong>. Để ý phần bên trong giữ nguyên y hệt; chỉ số mũ thay đổi.</li>
<li><strong>Kiểm lại bằng khai triển</strong> — với trường hợp nhỏ hơn y = (3x + 1)² = 9x² + 6x + 1, lấy đạo hàm trực tiếp ra 18x + 6, còn quy tắc dây chuyền cho 2(3x + 1)·3 = 18x + 6. Hai kết quả trùng nhau, đó là bằng chứng rằng hệ số 3 phải có mặt.</li>
<li><strong>Thừa số hay bị quên nhất</strong> — chính cái "·g'(x)" mới là toàn bộ nội dung của quy tắc. Bỏ nó là mọi đáp án hàm hợp đều sai lệch một hằng số, hoặc lệch nguyên một hàm.</li>
</ul>
<p class="meo">💡 Bóc như bóc củ hành: tự hỏi "nếu thay một con số vào thì phép tính cuối cùng tôi làm là phép gì?". Phép đó là hàm ngoài, còn tất cả những gì nằm dưới nó là phần trong.</p>
<p class="pitfall">⚠️ Bẫy thi: viết [(3x + 1)⁵]' = 5(3x + 1)⁴ rồi dừng. Trông như đã xong, nhưng thiếu đạo hàm trong bằng 3, nên đáp án nhỏ hơn ba lần. Hễ phần trong không đơn thuần là x thì cuối cùng bắt buộc phải có một phép nhân.</p>`],

      [12, 'The chain rule with several layers',
        `<p class="y-chinh">🎯 For three or more nested layers, peel from the OUTSIDE IN and multiply every inner derivative as you go.</p>
<ul>
<li><strong>The general shape</strong> — for y = f(g(h(x))), the derivative is f'(g(h(x)))·g'(h(x))·h'(x). One factor per layer, in outside-in order.</li>
<li><strong>Worked example from the slide</strong> — y = sin(3x² + 1).</li>
<li><strong>Step 1 — identify the layers</strong> — outer sin(u) with derivative cos(u); inner u = 3x² + 1 with u' = 6x.</li>
<li><strong>Step 2 — multiply</strong> — y' = cos(3x² + 1)·6x.</li>
<li><strong>Step 3 — the answer</strong> — y' = <strong>6x cos(3x² + 1)</strong>, with the argument of cos left exactly as it was.</li>
<li><strong>A genuine three-layer example</strong> — y = sin²(3x) = [sin(3x)]². Layer 1: outer square ⇒ 2 sin(3x). Layer 2: sin ⇒ cos(3x). Layer 3: inner 3x ⇒ 3. Multiply all three: y' = 2 sin(3x)·cos(3x)·3 = 6 sin(3x) cos(3x) = 3 sin(6x).</li>
<li><strong>How to keep track</strong> — write the layers as a list before differentiating, then produce one factor per line. The number of multiplication signs in your answer should equal the number of layers minus one at least.</li>
<li><strong>The rule of thumb</strong> — the more nesting, the more times you multiply by "the derivative of the inside". Nothing else changes.</li>
</ul>
<p class="meo">💡 Combine rules calmly: a product whose factors are composites needs the product rule <em>outside</em> and the chain rule <em>inside</em> each factor. Do the outer decision first, then handle each piece.</p>
<p class="pitfall">⚠️ Two traps here: stopping after two layers in a three-layer function, and writing sin²(3x) as sin(sin(3x)). The notation sin²A means (sin A)², a square on the outside — a different composite with a different derivative.</p>`,
        `<p class="y-chinh">🎯 Với ba tầng lồng nhau trở lên, hãy bóc từ NGOÀI VÀO TRONG và nhân dồn từng đạo hàm trong dọc đường.</p>
<ul>
<li><strong>Dạng tổng quát</strong> — với y = f(g(h(x))), đạo hàm là f'(g(h(x)))·g'(h(x))·h'(x). Mỗi tầng một thừa số, xếp theo thứ tự từ ngoài vào trong.</li>
<li><strong>Ví dụ trên slide, giải đủ bước</strong> — y = sin(3x² + 1).</li>
<li><strong>Bước 1 — nhận diện các tầng</strong> — ngoài là sin(u) với đạo hàm cos(u); trong là u = 3x² + 1 với u' = 6x.</li>
<li><strong>Bước 2 — nhân lại</strong> — y' = cos(3x² + 1)·6x.</li>
<li><strong>Bước 3 — kết quả</strong> — y' = <strong>6x cos(3x² + 1)</strong>, đối số của cos giữ nguyên y như cũ.</li>
<li><strong>Một ví dụ ba tầng thật sự</strong> — y = sin²(3x) = [sin(3x)]². Tầng 1: bình phương ở ngoài ⇒ 2 sin(3x). Tầng 2: sin ⇒ cos(3x). Tầng 3: trong cùng 3x ⇒ 3. Nhân cả ba: y' = 2 sin(3x)·cos(3x)·3 = 6 sin(3x) cos(3x) = 3 sin(6x).</li>
<li><strong>Cách khỏi lạc</strong> — liệt kê các tầng ra giấy trước khi lấy đạo hàm, rồi mỗi dòng sinh đúng một thừa số. Số dấu nhân trong đáp án ít nhất phải bằng số tầng trừ một.</li>
<li><strong>Quy luật bỏ túi</strong> — càng nhiều tầng lồng thì càng nhiều lần nhân với "đạo hàm của phần trong". Ngoài ra không có gì thay đổi.</li>
</ul>
<p class="meo">💡 Phối hợp các quy tắc một cách bình tĩnh: một tích mà mỗi thừa số lại là hàm hợp thì dùng quy tắc tích ở <em>ngoài</em> và quy tắc dây chuyền ở <em>trong</em> từng thừa số. Quyết định lớp ngoài trước, rồi mới xử từng mảnh.</p>
<p class="pitfall">⚠️ Hai bẫy ở đây: dừng lại sau hai tầng trong khi hàm có ba tầng, và hiểu sin²(3x) thành sin(sin(3x)). Ký hiệu sin²A nghĩa là (sin A)², bình phương nằm ở ngoài — đó là hàm hợp khác với đạo hàm khác.</p>`],

      [13, 'Exponential and logarithmic derivatives',
        `<p class="y-chinh">🎯 Four formulas: (eˣ)' = eˣ, (aˣ)' = aˣ ln a, (ln x)' = 1/x, (log_a x)' = 1/(x ln a).</p>
<ul>
<li><strong>The unique function</strong> — eˣ is its own derivative. That single property is what makes e ≈ 2.71828 the natural base of calculus, and why growth and decay models use it.</li>
<li><strong>General base</strong> — (aˣ)' = aˣ ln a. Check it against the first formula: for a = e, ln e = 1 and the extra factor disappears. For a = 2, (2ˣ)' = 2ˣ ln 2 ≈ 0.693·2ˣ.</li>
<li><strong>Natural log</strong> — (ln x)' = 1/x for x &gt; 0. This is the missing case of the power rule: nothing of the form xⁿ ever differentiates to x⁻¹, and ln x fills that gap.</li>
<li><strong>General log</strong> — (log_a x)' = 1/(x ln a), which follows from the change of base log_a x = ln x/ln a and the constant multiple rule.</li>
<li><strong>Combined with the chain rule — example 1</strong> — (e³ˣ)': outer eᵘ ⇒ e³ˣ, inner u = 3x ⇒ u' = 3, so the answer is <strong>3e³ˣ</strong>.</li>
<li><strong>Combined with the chain rule — example 2</strong> — (ln(x² + 1))': outer ln u ⇒ 1/u = 1/(x² + 1), inner u' = 2x, so the answer is <strong>2x/(x² + 1)</strong>.</li>
<li><strong>The general pattern</strong> — (e^u)' = u'·e^u and (ln u)' = u'/u. Remembering these two compressed forms saves rewriting the chain rule every time.</li>
<li><strong>Useful trick</strong> — a logarithm of a product or power can be split before differentiating: ln(x³(x + 1)) = 3 ln x + ln(x + 1), whose derivative 3/x + 1/(x + 1) is far easier than the quotient-and-chain version.</li>
</ul>
<p class="meo">💡 (ln u)' = u'/u reads as "derivative of the inside over the inside". Once that sentence is automatic, every logarithmic derivative in the course takes one line.</p>
<p class="pitfall">⚠️ Do not apply the power rule to eˣ: (eˣ)' is eˣ, never x·e^(x−1). The power rule is for a <em>variable base with a constant exponent</em> (xⁿ); the exponential rule is for a <em>constant base with a variable exponent</em> (aˣ). When both are variable, as in xˣ, neither applies — that is slide 15.</p>`,
        `<p class="y-chinh">🎯 Bốn công thức: (eˣ)' = eˣ, (aˣ)' = aˣ ln a, (ln x)' = 1/x, (log_a x)' = 1/(x ln a).</p>
<ul>
<li><strong>Hàm số độc nhất</strong> — eˣ có đạo hàm bằng chính nó. Riêng tính chất đó khiến e ≈ 2,71828 trở thành cơ số tự nhiên của Giải tích, và là lý do các mô hình tăng trưởng, phân rã đều dùng nó.</li>
<li><strong>Cơ số tổng quát</strong> — (aˣ)' = aˣ ln a. Kiểm lại với công thức đầu: với a = e thì ln e = 1 nên thừa số phụ biến mất. Với a = 2 thì (2ˣ)' = 2ˣ ln 2 ≈ 0,693·2ˣ.</li>
<li><strong>Log tự nhiên</strong> — (ln x)' = 1/x với x &gt; 0. Đây chính là trường hợp còn thiếu của quy tắc luỹ thừa: không có xⁿ nào lấy đạo hàm ra được x⁻¹, và ln x lấp đúng chỗ trống đó.</li>
<li><strong>Log cơ số bất kỳ</strong> — (log_a x)' = 1/(x ln a), suy ra từ công thức đổi cơ số log_a x = ln x/ln a cộng quy tắc hằng nhân.</li>
<li><strong>Kết hợp dây chuyền — ví dụ 1</strong> — (e³ˣ)': ngoài là eᵘ ⇒ e³ˣ, trong u = 3x ⇒ u' = 3, vậy đáp án là <strong>3e³ˣ</strong>.</li>
<li><strong>Kết hợp dây chuyền — ví dụ 2</strong> — (ln(x² + 1))': ngoài là ln u ⇒ 1/u = 1/(x² + 1), trong u' = 2x, vậy đáp án là <strong>2x/(x² + 1)</strong>.</li>
<li><strong>Dạng tổng quát</strong> — (e^u)' = u'·e^u và (ln u)' = u'/u. Nhớ hai dạng rút gọn này thì khỏi phải viết lại quy tắc dây chuyền mỗi lần.</li>
<li><strong>Mẹo hữu ích</strong> — log của tích hoặc của luỹ thừa có thể tách trước khi lấy đạo hàm: ln(x³(x + 1)) = 3 ln x + ln(x + 1), đạo hàm là 3/x + 1/(x + 1), dễ hơn hẳn cách dùng quy tắc thương kèm dây chuyền.</li>
</ul>
<p class="meo">💡 (ln u)' = u'/u đọc thành "đạo hàm của phần trong chia cho phần trong". Khi câu đó thành phản xạ thì mọi đạo hàm logarit trong môn này chỉ tốn một dòng.</p>
<p class="pitfall">⚠️ Đừng áp quy tắc luỹ thừa cho eˣ: (eˣ)' bằng eˣ, không bao giờ là x·e^(x−1). Quy tắc luỹ thừa dành cho <em>cơ số là biến, số mũ là hằng</em> (xⁿ); quy tắc hàm mũ dành cho <em>cơ số là hằng, số mũ là biến</em> (aˣ). Khi cả hai cùng là biến, như xˣ, thì không quy tắc nào dùng được — đó là slide 15.</p>`],

      [14, 'Implicit differentiation',
        `<p class="y-chinh">🎯 When y cannot be isolated, differentiate BOTH sides with respect to x, treating y as a function of x.</p>
<ul>
<li><strong>When you need it</strong> — equations like x² + y² = 25, x³ + y³ = 6xy or sin(xy) = x, where solving for y is impossible or ugly.</li>
<li><strong>The one new habit</strong> — every time a y is differentiated, the chain rule attaches a dy/dx. So (y²)' = 2y·dy/dx, (y³)' = 3y²·dy/dx, (sin y)' = cos y·dy/dx.</li>
<li><strong>Worked example from the slide</strong> — x² + y² = 25, the circle of radius 5.</li>
<li><strong>Step 1 — differentiate both sides</strong> — (x²)' = 2x, (y²)' = 2y·dy/dx, (25)' = 0, giving 2x + 2y·dy/dx = 0.</li>
<li><strong>Step 2 — isolate dy/dx</strong> — 2y·dy/dx = −2x.</li>
<li><strong>Step 3 — the answer</strong> — dy/dx = <strong>−x/y</strong>, valid wherever y ≠ 0.</li>
<li><strong>Reading the answer</strong> — the result contains both x and y, which is normal for implicit differentiation. At the point (3, 4) on the circle, the slope is −3/4; at (3, −4) it is +3/4. The formula serves both branches at once.</li>
<li><strong>Why the answer makes sense</strong> — a radius drawn to (3, 4) has slope 4/3, and the tangent is perpendicular to it, so its slope must be −3/4. The algebra and the geometry agree.</li>
<li><strong>Products of x and y</strong> — a term like xy needs the product rule as well: (xy)' = 1·y + x·dy/dx = y + x·dy/dx.</li>
</ul>
<p class="meo">💡 Set out the work in two columns: differentiate everything first without simplifying, then collect every term containing dy/dx on one side and factor it out. Doing both jobs at once is where the errors creep in.</p>
<p class="pitfall">⚠️ The signature mistake is writing (y²)' = 2y. That is the derivative with respect to <em>y</em>, not to x. You are differentiating with respect to x, so the factor dy/dx must appear — dropping it makes every later step wrong.</p>`,
        `<p class="y-chinh">🎯 Khi không tách riêng được y, hãy lấy đạo hàm CẢ HAI VẾ theo x, coi y là một hàm của x.</p>
<ul>
<li><strong>Khi nào cần đến nó</strong> — những phương trình như x² + y² = 25, x³ + y³ = 6xy hay sin(xy) = x, nơi việc giải ra y là bất khả hoặc rất xấu.</li>
<li><strong>Thói quen mới duy nhất</strong> — cứ mỗi lần lấy đạo hàm một chữ y là quy tắc dây chuyền gắn thêm dy/dx. Nên (y²)' = 2y·dy/dx, (y³)' = 3y²·dy/dx, (sin y)' = cos y·dy/dx.</li>
<li><strong>Ví dụ trên slide, giải đủ bước</strong> — x² + y² = 25, đường tròn bán kính 5.</li>
<li><strong>Bước 1 — đạo hàm hai vế</strong> — (x²)' = 2x, (y²)' = 2y·dy/dx, (25)' = 0, cho ra 2x + 2y·dy/dx = 0.</li>
<li><strong>Bước 2 — tách dy/dx</strong> — 2y·dy/dx = −2x.</li>
<li><strong>Bước 3 — kết quả</strong> — dy/dx = <strong>−x/y</strong>, đúng ở mọi chỗ có y ≠ 0.</li>
<li><strong>Đọc kết quả</strong> — đáp án chứa cả x lẫn y, đó là chuyện bình thường của đạo hàm ẩn. Tại điểm (3; 4) trên đường tròn, độ dốc là −3/4; tại (3; −4) là +3/4. Một công thức phục vụ cả hai nhánh cùng lúc.</li>
<li><strong>Vì sao kết quả hợp lý</strong> — bán kính nối tới (3; 4) có độ dốc 4/3, mà tiếp tuyến vuông góc với nó, nên độ dốc tiếp tuyến phải là −3/4. Đại số và hình học khớp nhau.</li>
<li><strong>Tích của x và y</strong> — số hạng dạng xy còn cần thêm quy tắc tích: (xy)' = 1·y + x·dy/dx = y + x·dy/dx.</li>
</ul>
<p class="meo">💡 Trình bày làm hai nhịp: lấy đạo hàm hết mọi thứ trước mà chưa rút gọn, sau đó gom mọi số hạng chứa dy/dx về một vế rồi đặt nó làm nhân tử chung. Làm gộp hai việc một lúc chính là chỗ sai hay chui vào.</p>
<p class="pitfall">⚠️ Lỗi đặc trưng là viết (y²)' = 2y. Đó là đạo hàm theo <em>y</em>, không phải theo x. Bạn đang lấy đạo hàm theo x, nên bắt buộc phải hiện ra thừa số dy/dx — bỏ nó là mọi bước sau đều sai.</p>`],

      [15, 'Logarithmic differentiation',
        `<p class="y-chinh">🎯 When the variable sits in BOTH the base and the exponent, take ln of both sides first — no other rule applies.</p>
<ul>
<li><strong>The blocked case</strong> — y = f(x)^g(x), such as xˣ or (sin x)^x. The power rule needs a constant exponent and the exponential rule needs a constant base; here neither holds.</li>
<li><strong>Step 1 — take ln of both sides</strong> — ln y = ln[f(x)^g(x)] = g(x)·ln f(x). The exponent has come down to the front, which is the whole purpose of the move.</li>
<li><strong>Step 2 — differentiate implicitly</strong> — the left side gives y'/y (slide 14 in action), and the right side is a product, so the product rule applies: y'/y = g'(x)·ln f(x) + g(x)·f'(x)/f(x).</li>
<li><strong>Step 3 — multiply by y</strong> — y' = y·[ln f(x)·g'(x) + g(x)·f'(x)/f(x)], then substitute y = f(x)^g(x) so nothing is left undefined.</li>
<li><strong>The standard example — y = xˣ</strong> — Step 1: ln y = x ln x. Step 2: y'/y = 1·ln x + x·(1/x) = ln x + 1. Step 3: y' = <strong>xˣ(ln x + 1)</strong>, for x &gt; 0.</li>
<li><strong>A sanity check</strong> — at x = 1, y' = 1·(0 + 1) = 1, so y = xˣ passes through (1, 1) with slope 1. The curve also has a minimum where ln x + 1 = 0, i.e. x = 1/e.</li>
<li><strong>Second use of the method</strong> — it also tames long products and quotients. For y = x²(x + 1)³/(x − 4), ln turns it into 2 ln x + 3 ln(x + 1) − ln(x − 4), giving y'/y = 2/x + 3/(x + 1) − 1/(x − 4) — far shorter than product and quotient rules combined.</li>
</ul>
<p class="meo">💡 Trigger for the method: an exponent containing x, or a product or quotient of three or more factors. In both cases ln converts multiplication into addition, and addition is easy to differentiate.</p>
<p class="pitfall">⚠️ Two errors: writing (xˣ)' = x·x^(x−1) (power rule misused) or = xˣ ln x (exponential rule misused). Both are wrong; the correct answer has <em>both</em> pieces, xˣ(ln x + 1). And never forget the final multiplication by y — stopping at y'/y leaves the answer incomplete.</p>`,
        `<p class="y-chinh">🎯 Khi biến nằm ở CẢ cơ số lẫn số mũ, hãy lấy ln hai vế trước — không quy tắc nào khác dùng được.</p>
<ul>
<li><strong>Trường hợp tắc đường</strong> — y = f(x)^g(x), chẳng hạn xˣ hay (sin x)^x. Quy tắc luỹ thừa đòi số mũ là hằng, quy tắc hàm mũ đòi cơ số là hằng; ở đây không cái nào thoả.</li>
<li><strong>Bước 1 — lấy ln hai vế</strong> — ln y = ln[f(x)^g(x)] = g(x)·ln f(x). Số mũ đã tụt xuống thành thừa số phía trước, đó chính là mục đích của nước đi này.</li>
<li><strong>Bước 2 — đạo hàm ẩn</strong> — vế trái cho y'/y (đúng kỹ thuật slide 14), vế phải là một tích nên dùng quy tắc tích: y'/y = g'(x)·ln f(x) + g(x)·f'(x)/f(x).</li>
<li><strong>Bước 3 — nhân y lại</strong> — y' = y·[ln f(x)·g'(x) + g(x)·f'(x)/f(x)], rồi thay y = f(x)^g(x) để không còn ký hiệu nào chưa xác định.</li>
<li><strong>Ví dụ chuẩn — y = xˣ</strong> — Bước 1: ln y = x ln x. Bước 2: y'/y = 1·ln x + x·(1/x) = ln x + 1. Bước 3: y' = <strong>xˣ(ln x + 1)</strong>, với x &gt; 0.</li>
<li><strong>Kiểm lại cho chắc</strong> — tại x = 1 thì y' = 1·(0 + 1) = 1, vậy y = xˣ đi qua (1; 1) với độ dốc 1. Đường cong còn có cực tiểu ở chỗ ln x + 1 = 0, tức x = 1/e.</li>
<li><strong>Công dụng thứ hai của phương pháp</strong> — nó còn thuần hoá được tích và thương dài. Với y = x²(x + 1)³/(x − 4), lấy ln biến nó thành 2 ln x + 3 ln(x + 1) − ln(x − 4), cho y'/y = 2/x + 3/(x + 1) − 1/(x − 4) — ngắn hơn hẳn việc gộp quy tắc tích với quy tắc thương.</li>
</ul>
<p class="meo">💡 Dấu hiệu dùng phương pháp này: số mũ có chứa x, hoặc một tích/thương từ ba thừa số trở lên. Cả hai trường hợp, ln đều biến phép nhân thành phép cộng, mà phép cộng thì lấy đạo hàm rất dễ.</p>
<p class="pitfall">⚠️ Hai lỗi: viết (xˣ)' = x·x^(x−1) (dùng sai quy tắc luỹ thừa) hoặc = xˣ ln x (dùng sai quy tắc hàm mũ). Cả hai đều sai; đáp án đúng chứa <em>cả hai</em> mảnh, xˣ(ln x + 1). Và tuyệt đối đừng quên phép nhân y ở bước cuối — dừng ở y'/y là đáp án còn dang dở.</p>`],

      [16, 'Higher-order derivatives',
        `<p class="y-chinh">🎯 Differentiate the derivative: f'' is the rate of change of the rate of change.</p>
<ul>
<li><strong>Notation</strong> — f'(x), f''(x), f'''(x), then f⁽⁴⁾(x) and generally f⁽ⁿ⁾(x). In Leibniz form: dy/dx, d²y/dx², d³y/dx³.</li>
<li><strong>Physical meaning (the slide's table)</strong> — with s(t) as position, s' is <strong>velocity</strong>, s'' is <strong>acceleration</strong>, and s''' is <strong>jerk</strong>, the rate at which acceleration itself changes.</li>
<li><strong>Geometric meaning</strong> — f''(x) &gt; 0 means the graph is concave up (holding water); f''(x) &lt; 0 means concave down. A point where f'' changes sign is an inflection point, the core tool of Chapter 3.</li>
<li><strong>Worked example</strong> — f(x) = x⁴. Then f' = 4x³, f'' = 12x², f''' = 24x, f⁽⁴⁾ = 24, and f⁽⁵⁾ = <strong>0</strong>. A polynomial of degree n dies at the (n+1)-th derivative.</li>
<li><strong>Trig example</strong> — (sin x)' = cos x, (sin x)'' = −sin x, (sin x)''' = −cos x, (sin x)⁽⁴⁾ = sin x. The cycle has period 4, so for the n-th derivative you only need n mod 4.</li>
<li><strong>Exponential example</strong> — every derivative of eˣ is eˣ, and (e²ˣ)⁽ⁿ⁾ = 2ⁿe²ˣ, since each pass multiplies by the inner derivative 2.</li>
<li><strong>Reading a graph triple</strong> — f rising and concave up ⇒ f' &gt; 0 and f'' &gt; 0; f rising but flattening ⇒ f' &gt; 0 and f'' &lt; 0. Being able to say which of the three curves is which is a standard exam item.</li>
</ul>
<p class="meo">💡 Car analogy: position is where you are, velocity is the speedometer, acceleration is the push in your back, jerk is the lurch when the driver changes that push. Four levels, four derivatives.</p>
<p class="pitfall">⚠️ Do not confuse f''(x) with [f'(x)]² or with f(x)². The double prime means "differentiate twice"; for f(x) = x³ we get f'' = 6x, while [f']² = 9x⁴ — completely different objects.</p>`,
        `<p class="y-chinh">🎯 Lấy đạo hàm của đạo hàm: f'' là tốc độ thay đổi của tốc độ thay đổi.</p>
<ul>
<li><strong>Ký hiệu</strong> — f'(x), f''(x), f'''(x), rồi f⁽⁴⁾(x) và tổng quát là f⁽ⁿ⁾(x). Theo Leibniz: dy/dx, d²y/dx², d³y/dx³.</li>
<li><strong>Ý nghĩa vật lý (bảng trên slide)</strong> — với s(t) là quãng đường, s' là <strong>vận tốc</strong>, s'' là <strong>gia tốc</strong>, còn s''' là <strong>độ giật (jerk)</strong>, tức tốc độ thay đổi của chính gia tốc.</li>
<li><strong>Ý nghĩa hình học</strong> — f''(x) &gt; 0 nghĩa là đồ thị lồi lên (hứng được nước); f''(x) &lt; 0 nghĩa là lõm xuống. Điểm mà f'' đổi dấu là điểm uốn, công cụ cốt lõi của Chương 3.</li>
<li><strong>Ví dụ giải đủ bước</strong> — f(x) = x⁴. Khi đó f' = 4x³, f'' = 12x², f''' = 24x, f⁽⁴⁾ = 24, và f⁽⁵⁾ = <strong>0</strong>. Đa thức bậc n thì chết ở đạo hàm cấp (n+1).</li>
<li><strong>Ví dụ lượng giác</strong> — (sin x)' = cos x, (sin x)'' = −sin x, (sin x)''' = −cos x, (sin x)⁽⁴⁾ = sin x. Chu kỳ của vòng lặp là 4, nên muốn đạo hàm cấp n chỉ cần lấy n chia 4 lấy dư.</li>
<li><strong>Ví dụ hàm mũ</strong> — mọi đạo hàm của eˣ đều là eˣ, còn (e²ˣ)⁽ⁿ⁾ = 2ⁿe²ˣ, vì mỗi lượt lại nhân thêm đạo hàm trong bằng 2.</li>
<li><strong>Đọc bộ ba đồ thị</strong> — f đi lên và lồi lên ⇒ f' &gt; 0 và f'' &gt; 0; f vẫn đi lên nhưng đang thoải dần ⇒ f' &gt; 0 và f'' &lt; 0. Chỉ ra được đường nào trong ba đường là đường nào chính là một câu hỏi chuẩn trong đề.</li>
</ul>
<p class="meo">💡 Ví von với chiếc xe: quãng đường là bạn đang ở đâu, vận tốc là kim đồng hồ tốc độ, gia tốc là cái đẩy vào lưng, độ giật là cú xóc khi tài xế đổi lực đẩy đó. Bốn tầng, bốn đạo hàm.</p>
<p class="pitfall">⚠️ Đừng nhầm f''(x) với [f'(x)]² hay với f(x)². Hai dấu phẩy nghĩa là "lấy đạo hàm hai lần"; với f(x) = x³ thì f'' = 6x, trong khi [f']² = 9x⁴ — hai thứ hoàn toàn khác nhau.</p>`],

      [17, 'Summary — the whole of Chapter 2 on one page',
        `<p class="y-chinh">🎯 Five statements. If you can write all five from memory, Chapter 2 is done.</p>
<ol>
<li><strong>The definition is the source of everything</strong> — f'(a) = lim(h→0) [f(a+h) − f(a)]/h, read as a tangent slope or an instantaneous rate. Worked example: f(x) = x² at a = 3 gives (6h + h²)/h = 6 + h → 6.</li>
<li><strong>Four basic rules cover polynomials</strong> — (c)' = 0 · (xⁿ)' = n xⁿ⁻¹ · (cf)' = cf' · (f ± g)' = f' ± g'. Together: (3x⁴ − 5x² + 7)' = 12x³ − 10x.</li>
<li><strong>Product and quotient have fixed shapes</strong> — (uv)' = u'v + uv', so (x² sin x)' = 2x sin x + x² cos x. And (u/v)' = (u'v − uv')/v², so [(x² − 1)/(x² + 1)]' = 4x/(x² + 1)². Minus sign and squared denominator, always.</li>
<li><strong>The chain rule handles every composite</strong> — [f(g(x))]' = f'(g(x))·g'(x). Hence ((3x + 1)⁵)' = 15(3x + 1)⁴ and (sin(3x² + 1))' = 6x cos(3x² + 1). The library: (sin x)' = cos x, (cos x)' = −sin x, (tan x)' = sec²x, (eˣ)' = eˣ, (aˣ)' = aˣ ln a, (ln x)' = 1/x, (log_a x)' = 1/(x ln a).</li>
<li><strong>Implicit and logarithmic differentiation are techniques, not new formulas</strong> — both send you straight back to the rules above. x² + y² = 25 ⇒ dy/dx = −x/y, and y = xˣ ⇒ y' = xˣ(ln x + 1). Higher-order derivatives just repeat the process: for x⁴ you get 4x³, 12x², 24x, 24, 0.</li>
</ol>
<p class="meo">💡 One workflow for any derivative: identify the outermost structure first (sum? product? quotient? composite?), apply that rule, then treat each piece the same way. Structure first, formulas second.</p>
<p class="pitfall">⚠️ The four marks lost most often in this chapter: writing (uv)' = u'v' · losing the minus sign in the quotient rule · forgetting the inner factor g'(x) in the chain rule · and dropping dy/dx when differentiating y implicitly.</p>`,
        `<p class="y-chinh">🎯 Năm câu. Viết lại được cả năm câu mà không cần nhìn tài liệu là xong Chương 2.</p>
<ol>
<li><strong>Định nghĩa là nguồn của mọi thứ</strong> — f'(a) = lim(h→0) [f(a+h) − f(a)]/h, đọc là hệ số góc tiếp tuyến hoặc tốc độ thay đổi tức thời. Ví dụ đã giải: f(x) = x² tại a = 3 cho (6h + h²)/h = 6 + h → 6.</li>
<li><strong>Bốn quy tắc cơ bản lo trọn đa thức</strong> — (c)' = 0 · (xⁿ)' = n xⁿ⁻¹ · (cf)' = cf' · (f ± g)' = f' ± g'. Gộp lại: (3x⁴ − 5x² + 7)' = 12x³ − 10x.</li>
<li><strong>Tích và thương có dáng cố định</strong> — (uv)' = u'v + uv', nên (x² sin x)' = 2x sin x + x² cos x. Và (u/v)' = (u'v − uv')/v², nên [(x² − 1)/(x² + 1)]' = 4x/(x² + 1)². Dấu trừ và mẫu bình phương, luôn luôn.</li>
<li><strong>Quy tắc dây chuyền xử mọi hàm hợp</strong> — [f(g(x))]' = f'(g(x))·g'(x). Nhờ đó ((3x + 1)⁵)' = 15(3x + 1)⁴ và (sin(3x² + 1))' = 6x cos(3x² + 1). Kho công thức: (sin x)' = cos x, (cos x)' = −sin x, (tan x)' = sec²x, (eˣ)' = eˣ, (aˣ)' = aˣ ln a, (ln x)' = 1/x, (log_a x)' = 1/(x ln a).</li>
<li><strong>Đạo hàm ẩn và đạo hàm logarit là kỹ thuật, không phải công thức mới</strong> — cả hai đều đẩy bạn quay về đúng các quy tắc trên. x² + y² = 25 ⇒ dy/dx = −x/y, và y = xˣ ⇒ y' = xˣ(ln x + 1). Đạo hàm cấp cao chỉ là lặp lại quá trình: với x⁴ ta được 4x³, 12x², 24x, 24, 0.</li>
</ol>
<p class="meo">💡 Một quy trình cho mọi câu đạo hàm: nhận diện cấu trúc ngoài cùng trước đã (tổng? tích? thương? hàm hợp?), áp quy tắc tương ứng, rồi xử từng mảnh theo đúng cách đó. Cấu trúc trước, công thức sau.</p>
<p class="pitfall">⚠️ Bốn điểm mất nhiều nhất ở chương này: viết (uv)' = u'v' · đánh rơi dấu trừ trong quy tắc thương · quên thừa số trong g'(x) của quy tắc dây chuyền · và bỏ mất dy/dx khi lấy đạo hàm ẩn theo y.</p>`],
    ]),
  ].join('\n'),
};
