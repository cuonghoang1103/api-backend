/**
 * MAE101 · Chương 3 — Applications of Derivatives (Ứng dụng đạo hàm), học theo từng slide.
 * Deck 'mae3' (MAE3), 17 slide, render sẵn lên CDN images/academy/MAE101/v1/mae3/NNN.webp.
 * Nội dung bám scripts/slides-src/mae101-ch3.mjs + Stewart "Essential Calculus" ch.3–4.
 * Mọi phép tính trong phần giảng đều đã kiểm tay:
 *   Thang: x²+y²=100, x=6 ⇒ y=8, 2(6)(1)+2(8)y'=0 ⇒ y'=−0,75 m/s
 *   L(x)=f(a)+f'(a)(x−a): √4,1 ≈ 2 + (1/4)(0,1) = 2,025 (giá trị thật 2,0248…)
 *   f=x³−3x: f'=3(x−1)(x+1), cực đại f(−1)=2, cực tiểu f(1)=−2, f''=6x, uốn (0,0)
 *   Closed interval f=x³−3x+1 trên [0,3]: f(0)=1, f(1)=−1, f(3)=19
 *   Hộp: V=x(12−2x)², V'=12(x−6)(x−2), x=2, V''(2)=−48, V(2)=128 cm³
 *   Newton f=x²−2, x₁=1,5 ⇒ x₂=1,41666…, x₃=1,4142157, √2=1,4142136.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae3';

export default {
  title: '3.0 — Slide bài giảng: Ứng dụng đạo hàm (17 slide)|||3.0 — Slide bài giảng: Ứng dụng đạo hàm (17 slide)',
  slug: 'mae101-3-0-slides-ung-dung-dao-ham',
  type: 'VIDEO',
  description: 'Toàn bộ 17 slide Chương 3 MAE101 — tốc độ liên quan, xấp xỉ tuyến tính và vi phân, cực trị và điểm tới hạn, định lý Rolle và giá trị trung bình, tăng/giảm, lồi/lõm và điểm uốn, khảo sát vẽ đồ thị, bài toán tối ưu hoá, quy tắc L\'Hôpital, phương pháp Newton và nguyên hàm — mỗi slide kèm giảng song ngữ, ví dụ giải từng bước và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Chapter 3 — Applications of Derivatives (cover)',
        `<p class="y-chinh">🎯 Chapter 3 puts the derivative to work: it measures rates, finds the best value, and reads the shape of a graph.</p>
<ul>
<li><strong>From "how to differentiate" to "what for"</strong> — Chapter 2 built the machine, Chapter 3 drives it. Every section here answers a real question: how fast, how big, where does it turn, where is the root.</li>
<li><strong>Four jobs of f'</strong> — (1) a rate of change linked to another rate (related rates); (2) a slope that gives a local straight-line copy of f (linear approximation); (3) a sign that says increasing or decreasing; (4) a zero that marks a candidate extremum.</li>
<li><strong>Two jobs of f''</strong> — the sign of f'' says concave up or concave down, and at a critical point it decides maximum versus minimum in one line.</li>
<li><strong>What this deck covers</strong> — 17 slides: related rates, differentials, extreme values, critical points, Rolle and the MVT, monotonicity, concavity, curve sketching, optimization, L'Hôpital, Newton's Method and antiderivatives.</li>
</ul>
<p class="meo">💡 One sentence carries the whole chapter: <em>the sign of f' tells you where f goes, the sign of f'' tells you how it bends.</em></p>`,
        `<p class="y-chinh">🎯 Chương 3 đưa đạo hàm vào việc: nó đo tốc độ, tìm giá trị tốt nhất, và đọc được dáng của đồ thị.</p>
<ul>
<li><strong>Từ "đạo hàm thế nào" sang "đạo hàm để làm gì"</strong> — Chương 2 dựng cỗ máy, Chương 3 lái nó. Mỗi phần ở đây trả lời một câu hỏi thật: nhanh bao nhiêu, lớn nhất bằng bao nhiêu, quay đầu ở đâu, nghiệm nằm đâu.</li>
<li><strong>Bốn việc của f'</strong> — (1) một tốc độ gắn với tốc độ khác (tốc độ liên quan); (2) một hệ số góc cho bản sao đường thẳng của f quanh một điểm (xấp xỉ tuyến tính); (3) một cái dấu cho biết hàm tăng hay giảm; (4) một chỗ triệt tiêu đánh dấu ứng viên cực trị.</li>
<li><strong>Hai việc của f''</strong> — dấu của f'' cho biết đồ thị lõm lên hay lõm xuống, và tại một điểm tới hạn nó quyết định cực đại hay cực tiểu chỉ trong một dòng.</li>
<li><strong>Bộ slide này gồm</strong> — 17 slide: tốc độ liên quan, vi phân, cực trị, điểm tới hạn, Rolle và định lý giá trị trung bình, tăng/giảm, lồi/lõm, khảo sát đồ thị, tối ưu hoá, L'Hôpital, phương pháp Newton và nguyên hàm.</li>
</ul>
<p class="meo">💡 Một câu gói trọn cả chương: <em>dấu của f' cho biết hàm đi về đâu, dấu của f'' cho biết hàm cong thế nào.</em></p>`],

      [2, 'Contents — six blocks of Chapter 3',
        `<p class="y-chinh">🎯 Chapter 3 runs through six blocks; the first three build the tools, the last three spend them.</p>
<ol>
<li><strong>Related rates &amp; linear approximation</strong> — slides 3–5: differentiate a relation with respect to t, and replace a curve by its tangent line near one point.</li>
<li><strong>Extreme values &amp; critical points</strong> — slides 6–7: local versus absolute, the Extreme Value Theorem, and the Closed Interval Method.</li>
<li><strong>Rolle's Theorem &amp; the Mean Value Theorem</strong> — slide 8: the bridge that turns the sign of f' into a statement about f itself.</li>
<li><strong>Increasing/decreasing, concavity &amp; curve sketching</strong> — slides 9–11: the First and Second Derivative Tests, inflection points, and the full sketching checklist.</li>
<li><strong>Optimization &amp; L'Hôpital's Rule</strong> — slides 12–14: reduce to one variable then maximise; and kill 0/0 or ∞/∞ by differentiating top and bottom.</li>
<li><strong>Newton's Method &amp; antiderivatives</strong> — slides 15–16: approximate a root by repeated tangent lines, then run differentiation backwards, which opens Chapter 4.</li>
</ol>
<p class="meo">💡 Notice the arc: slides 6–10 all answer "where and what kind of turning point", each with a sharper tool than the last.</p>`,
        `<p class="y-chinh">🎯 Chương 3 chạy qua sáu khối; ba khối đầu dựng công cụ, ba khối sau đem ra dùng.</p>
<ol>
<li><strong>Tốc độ liên quan &amp; xấp xỉ tuyến tính</strong> — slide 3–5: đạo hàm một hệ thức theo t, và thay đường cong bằng tiếp tuyến của nó quanh một điểm.</li>
<li><strong>Cực trị &amp; điểm tới hạn</strong> — slide 6–7: địa phương so với tuyệt đối, định lý giá trị cực trị, và phương pháp đoạn đóng.</li>
<li><strong>Định lý Rolle &amp; định lý giá trị trung bình</strong> — slide 8: cây cầu biến dấu của f' thành một khẳng định về chính f.</li>
<li><strong>Tăng/giảm, lồi/lõm &amp; khảo sát đồ thị</strong> — slide 9–11: test cấp 1 và cấp 2, điểm uốn, và bảng kiểm khảo sát đầy đủ.</li>
<li><strong>Tối ưu hoá &amp; quy tắc L'Hôpital</strong> — slide 12–14: đưa về một biến rồi tìm cực trị; và khử 0/0 hay ∞/∞ bằng cách đạo hàm tử và mẫu.</li>
<li><strong>Phương pháp Newton &amp; nguyên hàm</strong> — slide 15–16: xấp xỉ nghiệm bằng cách kẻ tiếp tuyến liên tiếp, rồi chạy ngược phép đạo hàm, mở đường sang Chương 4.</li>
</ol>
<p class="meo">💡 Để ý mạch bài: slide 6–10 đều trả lời câu "điểm quay đầu nằm ở đâu và thuộc loại nào", công cụ sau sắc hơn công cụ trước.</p>`],

      [3, 'Related rates — the 5-step method',
        `<p class="y-chinh">🎯 Two quantities both change with time and are tied by one equation; differentiate that equation with respect to t and one rate gives you the other.</p>
<ul>
<li><strong>Step 1 — draw and name</strong> — sketch the picture, give every changing length a letter, and write down which derivative is <em>given</em> and which is <em>wanted</em>, e.g. given dx/dt = 1 m/s, want dy/dt.</li>
<li><strong>Step 2 — write the relation</strong> — one equation linking the variables, valid at <em>every</em> time, not just the instant asked about. Usual suppliers: Pythagoras x² + y² = c², areas A = πr², volumes V = πr²h/3, similar triangles, trigonometry tan θ = y/x.</li>
<li><strong>Step 3 — differentiate with respect to t</strong> — every variable is a function of t, so the Chain Rule attaches its own rate: d/dt (x²) = 2x·dx/dt, d/dt (πr²) = 2πr·dr/dt, d/dt (xy) = x·dy/dt + y·dx/dt.</li>
<li><strong>Step 4 — substitute the instant</strong> — only now put in the numbers that hold at that particular moment, including any missing length found from the relation itself.</li>
<li><strong>Step 5 — solve and read the sign</strong> — a positive rate means the quantity is growing, a negative rate means it is shrinking. State the units: m/s, cm³/s, rad/s.</li>
<li><strong>Constants versus variables</strong> — a length that never changes (the 10 m ladder, the fixed cone angle) may be substituted early; anything that moves must stay a letter until after Step 3.</li>
</ul>
<p class="meo">💡 Write the question as a formula before you start: "given dx/dt, find dy/dt when x = 6". That one line tells you which equation you need and stops you solving the wrong unknown.</p>
<p class="pitfall">⚠️ The number-one error: substituting x = 6 <em>before</em> differentiating. Then x² becomes the constant 36, its derivative is 0, and the whole relation collapses. Numbers go in at Step 4, never at Step 2.</p>`,
        `<p class="y-chinh">🎯 Hai đại lượng cùng biến thiên theo thời gian và bị buộc bởi một phương trình; đạo hàm phương trình đó theo t thì từ tốc độ này suy ra tốc độ kia.</p>
<ul>
<li><strong>Bước 1 — vẽ hình và đặt tên</strong> — vẽ hình, đặt chữ cho mọi độ dài đang thay đổi, và ghi rõ đạo hàm nào <em>đã cho</em>, đạo hàm nào <em>cần tìm</em>, ví dụ cho dx/dt = 1 m/s, tìm dy/dt.</li>
<li><strong>Bước 2 — viết hệ thức liên hệ</strong> — một phương trình nối các biến, đúng ở <em>mọi</em> thời điểm chứ không riêng thời điểm đề hỏi. Nguồn quen thuộc: Pythagoras x² + y² = c², diện tích A = πr², thể tích V = πr²h/3, tam giác đồng dạng, lượng giác tan θ = y/x.</li>
<li><strong>Bước 3 — đạo hàm hai vế theo t</strong> — mọi biến đều là hàm của t, nên quy tắc dây chuyền gắn thêm tốc độ riêng của nó: d/dt (x²) = 2x·dx/dt, d/dt (πr²) = 2πr·dr/dt, d/dt (xy) = x·dy/dt + y·dx/dt.</li>
<li><strong>Bước 4 — thay số của thời điểm</strong> — đến giờ mới thay các số đúng tại thời điểm đó, kể cả độ dài còn thiếu mà chính hệ thức giúp tìm ra.</li>
<li><strong>Bước 5 — giải và đọc dấu</strong> — tốc độ dương nghĩa là đại lượng đang tăng, âm nghĩa là đang giảm. Nhớ ghi đơn vị: m/s, cm³/s, rad/s.</li>
<li><strong>Hằng số so với biến số</strong> — độ dài không bao giờ đổi (thang 10 m, góc nón cố định) thì được thay số sớm; thứ gì còn chuyển động phải giữ nguyên chữ cho tới sau Bước 3.</li>
</ul>
<p class="meo">💡 Viết đề bài thành một dòng công thức trước khi làm: "cho dx/dt, tìm dy/dt khi x = 6". Đúng một dòng đó cho biết cần hệ thức nào và chặn việc giải nhầm ẩn.</p>
<p class="pitfall">⚠️ Lỗi số một: thay x = 6 <em>trước khi</em> đạo hàm. Khi đó x² thành hằng số 36, đạo hàm bằng 0, và cả hệ thức sụp đổ. Số liệu vào ở Bước 4, tuyệt đối không vào ở Bước 2.</p>`],

      [4, 'Related rates — the sliding ladder',
        `<p class="y-chinh">🎯 A 10 m ladder leans on a wall, its foot slides out at dx/dt = 1 m/s; when x = 6 m the top slides down at 0.75 m/s.</p>
<ul>
<li><strong>Set up</strong> — let x be the distance from the wall to the foot and y the height of the top. Given dx/dt = 1 m/s, wanted dy/dt at the instant x = 6.</li>
<li><strong>Step 1 — the relation</strong> — the ladder, the wall and the ground form a right triangle with the ladder as hypotenuse: x² + y² = 10² = <strong>100</strong>. The 10 is a genuine constant, so it may be written as a number straight away.</li>
<li><strong>Step 2 — differentiate with respect to t</strong> — 2x·(dx/dt) + 2y·(dy/dt) = 0, since the derivative of the constant 100 is 0.</li>
<li><strong>Step 3 — find the missing length</strong> — at the instant x = 6: y = √(100 − 36) = √64 = <strong>8</strong> m. This number could not be used earlier, only here.</li>
<li><strong>Step 4 — substitute</strong> — 2(6)(1) + 2(8)(dy/dt) = 0 ⇒ 12 + 16·(dy/dt) = 0 ⇒ dy/dt = −12/16 = <strong>−0.75 m/s</strong>.</li>
<li><strong>Step 5 — read the answer</strong> — the minus sign means y is <em>decreasing</em>: the top of the ladder slides <strong>down</strong> at 0.75 m/s while the foot slides out at 1 m/s.</li>
<li><strong>Sanity check on the physics</strong> — divide the relation by 2: x·(dx/dt) = −y·(dy/dt). With x &lt; y the top moves slower than the foot; as x → 10 and y → 0 the ratio x/y blows up, so |dy/dt| → ∞ — the top accelerates dramatically at the end of the fall.</li>
</ul>
<p class="meo">💡 Keep the relation in the form 2x·x' + 2y·y' = 0 and only then substitute; you can reuse the same line for any other instant of the same problem, for example x = 8 ⇒ y = 6 ⇒ dy/dt = −8/6 ≈ −1.33 m/s.</p>
<p class="pitfall">⚠️ Two traps here: writing y = 8 into the relation before differentiating (kills the dy/dt term), and reporting the answer as +0.75 m/s. The sign is part of the answer — it is the difference between rising and falling.</p>`,
        `<p class="y-chinh">🎯 Thang dài 10 m tựa tường, chân thang trượt ra với dx/dt = 1 m/s; khi x = 6 m thì đỉnh thang tụt xuống với tốc độ 0,75 m/s.</p>
<ul>
<li><strong>Đặt biến</strong> — gọi x là khoảng cách từ tường tới chân thang, y là chiều cao của đỉnh thang. Cho dx/dt = 1 m/s, cần tìm dy/dt tại thời điểm x = 6.</li>
<li><strong>Bước 1 — hệ thức</strong> — thang, tường và mặt đất tạo thành tam giác vuông có thang là cạnh huyền: x² + y² = 10² = <strong>100</strong>. Số 10 là hằng số thật nên được viết thành số ngay.</li>
<li><strong>Bước 2 — đạo hàm theo t</strong> — 2x·(dx/dt) + 2y·(dy/dt) = 0, vì đạo hàm của hằng số 100 bằng 0.</li>
<li><strong>Bước 3 — tìm độ dài còn thiếu</strong> — tại thời điểm x = 6: y = √(100 − 36) = √64 = <strong>8</strong> m. Con số này không được dùng sớm hơn, chỉ dùng ở đây.</li>
<li><strong>Bước 4 — thay số</strong> — 2(6)(1) + 2(8)(dy/dt) = 0 ⇒ 12 + 16·(dy/dt) = 0 ⇒ dy/dt = −12/16 = <strong>−0,75 m/s</strong>.</li>
<li><strong>Bước 5 — đọc kết quả</strong> — dấu trừ nghĩa là y đang <em>giảm</em>: đỉnh thang trượt <strong>xuống</strong> với tốc độ 0,75 m/s trong khi chân thang trượt ra với 1 m/s.</li>
<li><strong>Kiểm lại bằng ý nghĩa vật lý</strong> — chia hệ thức cho 2: x·(dx/dt) = −y·(dy/dt). Khi x &lt; y thì đỉnh thang đi chậm hơn chân thang; càng về sau x → 10 và y → 0 nên tỉ số x/y vọt lên, kéo |dy/dt| → ∞ — đỉnh thang lao xuống rất nhanh ở cuối cú đổ.</li>
</ul>
<p class="meo">💡 Giữ hệ thức ở dạng 2x·x' + 2y·y' = 0 rồi mới thay số; đúng dòng đó dùng lại được cho mọi thời điểm khác của cùng bài, ví dụ x = 8 ⇒ y = 6 ⇒ dy/dt = −8/6 ≈ −1,33 m/s.</p>
<p class="pitfall">⚠️ Hai cái bẫy ở đây: thay y = 8 vào hệ thức trước khi đạo hàm (làm mất hẳn số hạng dy/dt), và ghi đáp số là +0,75 m/s. Dấu là một phần của đáp số — nó chính là khác biệt giữa đi lên và đi xuống.</p>`],

      [5, 'Linear approximation and differentials',
        `<p class="y-chinh">🎯 Near x = a the tangent line is an excellent stand-in for the curve: L(x) = f(a) + f'(a)(x − a).</p>
<ul>
<li><strong>The formula</strong> — L is called the <em>linearization</em> of f at a. It is just the tangent line written as a function, and f(x) ≈ L(x) for x close to a.</li>
<li><strong>Why it works</strong> — the derivative was defined as the limit of the difference quotient, so f(x) − f(a) ≈ f'(a)(x − a) exactly when x − a is small. Linear approximation is the definition of the derivative read backwards.</li>
<li><strong>Worked example — estimate √4.1</strong> — take f(x) = √x and a = 4, because 4 is the nearest point where the root is exact.</li>
<li><strong>Step 1</strong> — f(4) = 2 and f'(x) = 1/(2√x), so f'(4) = 1/(2·2) = 1/4.</li>
<li><strong>Step 2</strong> — L(x) = 2 + (1/4)(x − 4); therefore √4.1 ≈ L(4.1) = 2 + (1/4)(0.1) = <strong>2.025</strong>.</li>
<li><strong>Step 3 — how good is it</strong> — the true value is 2.024845…, so the error is about 0.00015, roughly 0.008 %. Halving the step to 4.05 cuts the error about fourfold: the error behaves like (Δx)².</li>
<li><strong>Differentials</strong> — write dy = f'(x)·dx. Here dx = Δx is the exact change in x that you choose, and dy is the change <em>along the tangent line</em>, while Δy = f(x + Δx) − f(x) is the true change along the curve. Small Δx ⇒ Δy ≈ dy.</li>
<li><strong>Where it is used</strong> — error propagation. If a sphere's radius r = 10 cm is measured with dr = 0.1 cm, then V = (4/3)πr³ gives dV = 4πr²·dr = 4π(100)(0.1) ≈ 125.7 cm³, and the relative error dV/V = 3·dr/r = 3 %.</li>
</ul>
<p class="meo">💡 Choose a to be the nearest "nice" point where f(a) and f'(a) are exact — 4 for √4.1, 0 for sin(0.02), 1 for ln(1.03), 8 for the cube root of 8.1.</p>
<p class="pitfall">⚠️ The approximation is only local. Using L(x) = 2 + (x − 4)/4 at x = 9 gives 3.25 instead of 3 — an 8 % error. And its direction is predictable: where f is concave down (f'' &lt; 0) the tangent lies above the curve, so L over-estimates, which is why 2.025 &gt; √4.1.</p>`,
        `<p class="y-chinh">🎯 Gần x = a thì tiếp tuyến thay thế rất tốt cho đường cong: L(x) = f(a) + f'(a)(x − a).</p>
<ul>
<li><strong>Công thức</strong> — L gọi là <em>hàm tuyến tính hoá</em> của f tại a. Nó chính là tiếp tuyến viết dưới dạng hàm số, và f(x) ≈ L(x) với x gần a.</li>
<li><strong>Vì sao dùng được</strong> — đạo hàm được định nghĩa bằng giới hạn của tỉ sai phân, nên f(x) − f(a) ≈ f'(a)(x − a) đúng khi x − a nhỏ. Xấp xỉ tuyến tính chính là định nghĩa đạo hàm đọc ngược lại.</li>
<li><strong>Ví dụ đã giải — ước lượng √4,1</strong> — lấy f(x) = √x và a = 4, vì 4 là điểm gần nhất mà căn ra số chẵn.</li>
<li><strong>Bước 1</strong> — f(4) = 2 và f'(x) = 1/(2√x), nên f'(4) = 1/(2·2) = 1/4.</li>
<li><strong>Bước 2</strong> — L(x) = 2 + (1/4)(x − 4); do đó √4,1 ≈ L(4,1) = 2 + (1/4)(0,1) = <strong>2,025</strong>.</li>
<li><strong>Bước 3 — sai số bao nhiêu</strong> — giá trị thật là 2,024845…, nên sai số khoảng 0,00015, tức chừng 0,008 %. Giảm bước còn 4,05 thì sai số nhỏ đi khoảng bốn lần: sai số hành xử như (Δx)².</li>
<li><strong>Vi phân</strong> — viết dy = f'(x)·dx. Ở đây dx = Δx là mức thay đổi của x do ta chọn, dy là mức thay đổi <em>dọc theo tiếp tuyến</em>, còn Δy = f(x + Δx) − f(x) là mức thay đổi thật dọc theo đường cong. Δx nhỏ ⇒ Δy ≈ dy.</li>
<li><strong>Dùng vào đâu</strong> — truyền sai số phép đo. Quả cầu bán kính r = 10 cm đo với sai số dr = 0,1 cm thì từ V = (4/3)πr³ có dV = 4πr²·dr = 4π(100)(0,1) ≈ 125,7 cm³, và sai số tương đối dV/V = 3·dr/r = 3 %.</li>
</ul>
<p class="meo">💡 Chọn a là điểm "đẹp" gần nhất mà f(a) và f'(a) tính ra chính xác — 4 cho √4,1; 0 cho sin(0,02); 1 cho ln(1,03); 8 cho căn bậc ba của 8,1.</p>
<p class="pitfall">⚠️ Phép xấp xỉ chỉ đúng tại chỗ. Dùng L(x) = 2 + (x − 4)/4 tại x = 9 cho 3,25 thay vì 3 — sai 8 %. Và chiều lệch đoán được: nơi f lõm xuống (f'' &lt; 0) thì tiếp tuyến nằm trên đường cong nên L ước lượng dư, đó là lý do 2,025 &gt; √4,1.</p>`],

      [6, 'Extreme values and the Extreme Value Theorem',
        `<p class="y-chinh">🎯 Local extremum = best in a neighbourhood; absolute extremum = best on the whole domain — and a continuous function on a closed interval always has both.</p>
<ul>
<li><strong>Local maximum</strong> — f(c) ≥ f(x) for every x in some open interval around c. Only the immediate neighbourhood is compared; the graph may climb much higher elsewhere.</li>
<li><strong>Local minimum</strong> — f(c) ≤ f(x) for every x near c. Local extrema are also called <em>relative</em> extrema.</li>
<li><strong>Absolute maximum / minimum</strong> — f(c) ≥ f(x), or f(c) ≤ f(x), for every x in the whole domain. This is the value an optimization problem is really asking for.</li>
<li><strong>How the two relate</strong> — every absolute extremum in the <em>interior</em> of the domain is also a local one, but not conversely; and an absolute extremum can also sit at an endpoint, where "local" does not even apply.</li>
<li><strong>Extreme Value Theorem</strong> — if f is continuous on the closed interval [a, b], then f attains both an absolute maximum and an absolute minimum somewhere on [a, b]. The theorem guarantees existence; it does not say where.</li>
<li><strong>Both hypotheses are needed — continuity</strong> — f(x) = 1/x on (0, 1] is continuous on its domain but the interval is not closed, and f has no maximum: values run to +∞ as x → 0⁺.</li>
<li><strong>Both hypotheses are needed — closed interval</strong> — f(x) = x on the open interval (0, 1) reaches neither 0 nor 1, so it has no absolute extremum at all, even though it is continuous.</li>
<li><strong>A broken function</strong> — define f(x) = x on [0, 1) and f(1) = 0. It is defined on a closed interval but is discontinuous at 1, and it has no maximum: the supremum 1 is never attained.</li>
</ul>
<p class="meo">💡 Read the theorem as a promise plus a search plan: "an answer exists" (EVT) and "it must be a critical point or an endpoint" (slide 7). The two together turn optimization into a finite check.</p>
<p class="pitfall">⚠️ Two mix-ups: calling every local maximum the absolute maximum without comparing all candidates, and confusing the point c with the value f(c). The extremum is the <em>value</em> f(c); c is only where it happens.</p>`,
        `<p class="y-chinh">🎯 Cực trị địa phương = tốt nhất trong lân cận; cực trị tuyệt đối = tốt nhất trên toàn miền — và hàm liên tục trên đoạn đóng thì luôn có cả hai.</p>
<ul>
<li><strong>Cực đại địa phương</strong> — f(c) ≥ f(x) với mọi x thuộc một khoảng mở nào đó quanh c. Chỉ so trong lân cận sát bên; đồ thị vẫn có thể leo cao hơn nhiều ở chỗ khác.</li>
<li><strong>Cực tiểu địa phương</strong> — f(c) ≤ f(x) với mọi x gần c. Cực trị địa phương còn gọi là cực trị <em>tương đối</em>.</li>
<li><strong>Giá trị lớn nhất / nhỏ nhất tuyệt đối</strong> — f(c) ≥ f(x), hoặc f(c) ≤ f(x), với mọi x trên toàn miền xác định. Đây mới là thứ mà bài toán tối ưu hoá thật sự hỏi.</li>
<li><strong>Hai loại liên hệ thế nào</strong> — mọi cực trị tuyệt đối nằm <em>bên trong</em> miền xác định đều đồng thời là cực trị địa phương, nhưng chiều ngược lại thì không; và cực trị tuyệt đối còn có thể nằm ở đầu mút, nơi khái niệm "địa phương" không áp dụng.</li>
<li><strong>Định lý giá trị cực trị</strong> — nếu f liên tục trên đoạn đóng [a, b] thì f đạt cả giá trị lớn nhất lẫn nhỏ nhất tuyệt đối tại đâu đó trên [a, b]. Định lý bảo đảm sự tồn tại; nó không nói chỗ nào.</li>
<li><strong>Cần cả hai giả thiết — tính liên tục</strong> — f(x) = 1/x trên (0; 1] liên tục trên miền của nó nhưng khoảng không đóng, và f không có giá trị lớn nhất: giá trị chạy ra +∞ khi x → 0⁺.</li>
<li><strong>Cần cả hai giả thiết — đoạn đóng</strong> — f(x) = x trên khoảng mở (0; 1) không chạm được 0 lẫn 1, nên chẳng có cực trị tuyệt đối nào, dù nó liên tục.</li>
<li><strong>Một hàm bị "phá"</strong> — đặt f(x) = x trên [0; 1) và f(1) = 0. Nó xác định trên một đoạn đóng nhưng gián đoạn tại 1, và không có giá trị lớn nhất: cận trên đúng bằng 1 không bao giờ đạt được.</li>
</ul>
<p class="meo">💡 Hãy đọc định lý như một lời hứa kèm kế hoạch tìm kiếm: "chắc chắn có đáp án" (định lý cực trị) và "nó phải là điểm tới hạn hoặc đầu mút" (slide 7). Hai thứ cộng lại biến tối ưu hoá thành một phép kiểm hữu hạn.</p>
<p class="pitfall">⚠️ Hai chỗ hay lẫn: coi mọi cực đại địa phương là giá trị lớn nhất tuyệt đối mà không so hết các ứng viên, và lẫn điểm c với giá trị f(c). Cực trị là <em>giá trị</em> f(c); còn c chỉ là nơi nó xảy ra.</p>`],

      [7, 'Critical points and the Closed Interval Method',
        `<p class="y-chinh">🎯 c is a critical point when f'(c) = 0 or f'(c) does not exist — and every interior extremum must be one.</p>
<ul>
<li><strong>Definition</strong> — c in the domain of f is critical if f'(c) = 0 (horizontal tangent) or f'(c) fails to exist (corner, cusp, vertical tangent). Both kinds must be hunted.</li>
<li><strong>Fermat's Theorem</strong> — if f has a local extremum at an interior point c and f'(c) exists, then f'(c) = 0. This is why critical points are the complete candidate list for the interior.</li>
<li><strong>The converse is false</strong> — f(x) = x³ has f'(0) = 0, yet 0 is not an extremum: the function keeps increasing straight through. A critical point is a <em>candidate</em>, never a conclusion.</li>
<li><strong>The f' does-not-exist case</strong> — f(x) = |x| has a corner at 0: f'(0) does not exist, yet 0 is clearly the absolute minimum. Forgetting this family is a classic way to lose the real answer.</li>
<li><strong>Closed Interval Method, step 1</strong> — find every critical point of f lying inside the open interval (a, b).</li>
<li><strong>Step 2</strong> — evaluate f at those critical points and at both endpoints a and b.</li>
<li><strong>Step 3</strong> — compare the list of numbers: the largest is the absolute maximum, the smallest the absolute minimum. No derivative tests needed — comparison settles it.</li>
<li><strong>Worked example</strong> — f(x) = x³ − 3x + 1 on [0, 3]. f'(x) = 3x² − 3 = 3(x − 1)(x + 1) = 0 ⇒ x = 1 or x = −1, but −1 is outside [0, 3] so it is discarded. Then f(0) = 1, f(1) = 1 − 3 + 1 = <strong>−1</strong>, f(3) = 27 − 9 + 1 = <strong>19</strong>. Absolute maximum 19 at x = 3 (an endpoint), absolute minimum −1 at x = 1.</li>
</ul>
<p class="meo">💡 The method is a three-column table: candidate x · reason (critical / endpoint) · value f(x). Filling it in makes the comparison mechanical and the marking scheme easy to follow.</p>
<p class="pitfall">⚠️ Three habitual slips: forgetting the endpoints (in the example above the maximum <em>is</em> an endpoint), keeping a critical point that lies outside the interval, and solving f(x) = 0 instead of f'(x) = 0.</p>`,
        `<p class="y-chinh">🎯 c là điểm tới hạn khi f'(c) = 0 hoặc f'(c) không tồn tại — và mọi cực trị nằm bên trong đều phải là một điểm như vậy.</p>
<ul>
<li><strong>Định nghĩa</strong> — c thuộc miền xác định của f là điểm tới hạn nếu f'(c) = 0 (tiếp tuyến nằm ngang) hoặc f'(c) không tồn tại (điểm góc, điểm nhọn, tiếp tuyến thẳng đứng). Phải săn cả hai loại.</li>
<li><strong>Định lý Fermat</strong> — nếu f có cực trị địa phương tại điểm trong c và f'(c) tồn tại thì f'(c) = 0. Đây là lý do danh sách điểm tới hạn là danh sách ứng viên đầy đủ cho phần bên trong.</li>
<li><strong>Chiều ngược lại sai</strong> — f(x) = x³ có f'(0) = 0 mà 0 không phải cực trị: hàm cứ tăng xuyên qua. Điểm tới hạn là <em>ứng viên</em>, không bao giờ là kết luận.</li>
<li><strong>Trường hợp f' không tồn tại</strong> — f(x) = |x| có điểm góc tại 0: f'(0) không tồn tại, vậy mà 0 rõ ràng là giá trị nhỏ nhất tuyệt đối. Bỏ quên nhóm này là cách kinh điển để đánh mất đáp án thật.</li>
<li><strong>Phương pháp đoạn đóng, bước 1</strong> — tìm mọi điểm tới hạn của f nằm trong khoảng mở (a, b).</li>
<li><strong>Bước 2</strong> — tính f tại các điểm tới hạn đó và tại cả hai đầu mút a, b.</li>
<li><strong>Bước 3</strong> — so sánh dãy số thu được: lớn nhất là GTLN tuyệt đối, nhỏ nhất là GTNN tuyệt đối. Không cần test cấp 1 hay cấp 2 — chỉ cần so sánh là xong.</li>
<li><strong>Ví dụ đã giải</strong> — f(x) = x³ − 3x + 1 trên [0; 3]. f'(x) = 3x² − 3 = 3(x − 1)(x + 1) = 0 ⇒ x = 1 hoặc x = −1, nhưng −1 nằm ngoài [0; 3] nên loại. Rồi f(0) = 1, f(1) = 1 − 3 + 1 = <strong>−1</strong>, f(3) = 27 − 9 + 1 = <strong>19</strong>. GTLN tuyệt đối 19 tại x = 3 (một đầu mút), GTNN tuyệt đối −1 tại x = 1.</li>
</ul>
<p class="meo">💡 Phương pháp này là một bảng ba cột: ứng viên x · lý do (tới hạn / đầu mút) · giá trị f(x). Điền bảng xong thì việc so sánh thành máy móc và bài trình bày cũng dễ chấm.</p>
<p class="pitfall">⚠️ Ba lỗi thành nếp: quên hai đầu mút (ở ví dụ trên GTLN <em>chính là</em> đầu mút), giữ lại điểm tới hạn nằm ngoài đoạn, và giải f(x) = 0 thay vì giải f'(x) = 0.</p>`],

      [8, "Rolle's Theorem and the Mean Value Theorem",
        `<p class="y-chinh">🎯 On a nice interval there is always a point where the tangent is parallel to the chord — that single fact powers most of Chapter 3.</p>
<ul>
<li><strong>Rolle's Theorem</strong> — if f is continuous on [a, b], differentiable on (a, b) and f(a) = f(b), then ∃ c ∈ (a, b) with f'(c) = 0. Go up and come back to the same height and you must level off somewhere.</li>
<li><strong>Rolle worked</strong> — f(x) = x² − 4x + 3 on [1, 3]: f(1) = 1 − 4 + 3 = 0 and f(3) = 9 − 12 + 3 = 0, so the hypotheses hold. f'(x) = 2x − 4 = 0 ⇒ c = <strong>2</strong>, which indeed lies in (1, 3).</li>
<li><strong>Mean Value Theorem</strong> — if f is continuous on [a, b] and differentiable on (a, b), then ∃ c ∈ (a, b) with f'(c) = [f(b) − f(a)]/(b − a). The MVT is Rolle applied to f minus the chord.</li>
<li><strong>MVT worked</strong> — f(x) = x² on [0, 2]: the chord slope is (4 − 0)/(2 − 0) = 2, and f'(c) = 2c = 2 ⇒ c = <strong>1</strong>, the midpoint. For x² the point c is always the midpoint of the interval.</li>
<li><strong>Everyday reading</strong> — drive 100 km in 1 hour and your average speed is 100 km/h; the MVT says that at some instant the speedometer read exactly 100 km/h. Average rate is realised as an instantaneous rate somewhere.</li>
<li><strong>Consequence 1</strong> — if f'(x) = 0 on an interval, then f is constant there. Proof: for any two points apply the MVT, the slope is 0, so the values agree.</li>
<li><strong>Consequence 2</strong> — if f'(x) = g'(x) on an interval, then f − g is a constant. This is exactly why antiderivatives (slide 16) carry a "+ C" and why the C is the <em>only</em> freedom.</li>
<li><strong>Consequence 3</strong> — f' &gt; 0 on an interval ⇒ f is increasing there; f' &lt; 0 ⇒ decreasing. That is slide 9, and the MVT is its proof.</li>
</ul>
<p class="meo">💡 Check the hypotheses in order: continuous on the closed interval, differentiable on the open one, and for Rolle the extra f(a) = f(b). Most exam items about these theorems are really about spotting a failed hypothesis.</p>
<p class="pitfall">⚠️ Differentiability is required on the open interval only, but genuinely required there. f(x) = |x| on [−1, 1] satisfies f(−1) = f(1) = 1 yet never has f'(c) = 0 — the corner at 0 breaks the hypothesis, so Rolle simply does not apply.</p>`,
        `<p class="y-chinh">🎯 Trên một khoảng "đẹp" luôn có một điểm mà tiếp tuyến song song với dây cung — đúng một sự kiện đó chống đỡ gần hết Chương 3.</p>
<ul>
<li><strong>Định lý Rolle</strong> — nếu f liên tục trên [a, b], khả vi trên (a, b) và f(a) = f(b) thì ∃ c ∈ (a, b) với f'(c) = 0. Đi lên rồi quay về đúng độ cao cũ thì thế nào cũng có chỗ đi ngang.</li>
<li><strong>Rolle giải mẫu</strong> — f(x) = x² − 4x + 3 trên [1; 3]: f(1) = 1 − 4 + 3 = 0 và f(3) = 9 − 12 + 3 = 0, nên giả thiết thoả. f'(x) = 2x − 4 = 0 ⇒ c = <strong>2</strong>, đúng là nằm trong (1; 3).</li>
<li><strong>Định lý giá trị trung bình</strong> — nếu f liên tục trên [a, b] và khả vi trên (a, b) thì ∃ c ∈ (a, b) với f'(c) = [f(b) − f(a)]/(b − a). Định lý này chính là Rolle áp cho f trừ đi dây cung.</li>
<li><strong>Giá trị trung bình giải mẫu</strong> — f(x) = x² trên [0; 2]: hệ số góc dây cung là (4 − 0)/(2 − 0) = 2, và f'(c) = 2c = 2 ⇒ c = <strong>1</strong>, đúng trung điểm. Với x² thì c luôn là trung điểm của đoạn.</li>
<li><strong>Cách hiểu đời thường</strong> — chạy 100 km trong 1 giờ thì vận tốc trung bình là 100 km/h; định lý nói rằng có một thời điểm kim đồng hồ chỉ đúng 100 km/h. Tốc độ trung bình luôn được hiện thực hoá thành tốc độ tức thời ở đâu đó.</li>
<li><strong>Hệ quả 1</strong> — nếu f'(x) = 0 trên một khoảng thì f là hằng số trên đó. Chứng minh: lấy hai điểm bất kỳ rồi áp định lý, hệ số góc bằng 0 nên hai giá trị bằng nhau.</li>
<li><strong>Hệ quả 2</strong> — nếu f'(x) = g'(x) trên một khoảng thì f − g là hằng số. Đây đúng là lý do nguyên hàm (slide 16) phải kèm "+ C" và vì sao C là tự do <em>duy nhất</em>.</li>
<li><strong>Hệ quả 3</strong> — f' &gt; 0 trên một khoảng ⇒ f tăng trên đó; f' &lt; 0 ⇒ f giảm. Đó chính là slide 9, và định lý giá trị trung bình là phần chứng minh của nó.</li>
</ul>
<p class="meo">💡 Kiểm giả thiết theo đúng thứ tự: liên tục trên đoạn đóng, khả vi trên khoảng mở, riêng Rolle thêm f(a) = f(b). Phần lớn câu hỏi thi về hai định lý này thực chất là hỏi xem giả thiết nào bị hỏng.</p>
<p class="pitfall">⚠️ Tính khả vi chỉ đòi trên khoảng mở, nhưng ở đó thì đòi thật. f(x) = |x| trên [−1; 1] có f(−1) = f(1) = 1 mà không bao giờ có f'(c) = 0 — điểm góc tại 0 phá giả thiết, nên Rolle đơn giản là không áp dụng được.</p>`],

      [9, 'Increasing, decreasing and the First Derivative Test',
        `<p class="y-chinh">🎯 The sign of f' reads the direction of f, and a change of that sign at a critical point names the extremum.</p>
<ul>
<li><strong>The sign table</strong> — f' &gt; 0 on an interval ⇒ f is <strong>increasing</strong> there; f' &lt; 0 ⇒ f is <strong>decreasing</strong>; f' = 0 at a point ⇒ a horizontal tangent, a stationary point.</li>
<li><strong>Why it is true</strong> — take x₁ &lt; x₂ and apply the MVT: f(x₂) − f(x₁) = f'(c)(x₂ − x₁). The bracket is positive, so the sign of the difference is exactly the sign of f'(c).</li>
<li><strong>First Derivative Test at a critical point c</strong> — (1) f' changes + → − ⇒ c is a <strong>local maximum</strong>; (2) f' changes − → + ⇒ c is a <strong>local minimum</strong>; (3) f' keeps the same sign ⇒ c is <strong>not</strong> an extremum.</li>
<li><strong>How to build the sign table</strong> — find all critical points and all points where f is undefined, mark them on the number line, pick one test value inside each resulting interval, and record the sign of f' there.</li>
<li><strong>Worked example</strong> — f(x) = x³ − 3x, so f'(x) = 3x² − 3 = 3(x − 1)(x + 1), critical points x = −1 and x = 1.</li>
<li><strong>Testing the three intervals</strong> — at x = −2: f'(−2) = 3(−3)(−1) = 9 &gt; 0 · at x = 0: f'(0) = 3(−1)(1) = −3 &lt; 0 · at x = 2: f'(2) = 3(1)(3) = 9 &gt; 0.</li>
<li><strong>Reading the table</strong> — increasing on (−∞, −1), decreasing on (−1, 1), increasing on (1, ∞). At x = −1 the sign goes + → − ⇒ local maximum f(−1) = −1 + 3 = <strong>2</strong>. At x = 1 it goes − → + ⇒ local minimum f(1) = 1 − 3 = <strong>−2</strong>.</li>
<li><strong>The non-extremum case</strong> — f(x) = x³ has f'(x) = 3x² ≥ 0 everywhere, so the sign never changes at 0; the point is a horizontal inflection, not an extremum.</li>
</ul>
<p class="meo">💡 Draw little arrows on the sign table — ↗ for +, ↘ for −. A peak ↗↘ is a maximum, a valley ↘↗ is a minimum. You can then read every extremum off the picture without re-reading the algebra.</p>
<p class="pitfall">⚠️ Points where f is undefined must go on the number line too, even though they are not critical points. For f(x) = 1/x the sign of f' can only be discussed separately on (−∞, 0) and (0, ∞) — f is decreasing on each, but <em>not</em> decreasing on their union.</p>`,
        `<p class="y-chinh">🎯 Dấu của f' đọc ra chiều đi của f, và việc dấu đó đổi tại một điểm tới hạn sẽ gọi tên loại cực trị.</p>
<ul>
<li><strong>Bảng dấu</strong> — f' &gt; 0 trên một khoảng ⇒ f <strong>tăng</strong> trên đó; f' &lt; 0 ⇒ f <strong>giảm</strong>; f' = 0 tại một điểm ⇒ tiếp tuyến nằm ngang, điểm dừng.</li>
<li><strong>Vì sao đúng</strong> — lấy x₁ &lt; x₂ rồi áp định lý giá trị trung bình: f(x₂) − f(x₁) = f'(c)(x₂ − x₁). Ngoặc sau dương nên dấu của hiệu chính là dấu của f'(c).</li>
<li><strong>Test cấp 1 tại điểm tới hạn c</strong> — (1) f' đổi + → − ⇒ c là <strong>cực đại</strong> địa phương; (2) f' đổi − → + ⇒ c là <strong>cực tiểu</strong> địa phương; (3) f' không đổi dấu ⇒ c <strong>không</strong> là cực trị.</li>
<li><strong>Lập bảng dấu thế nào</strong> — tìm mọi điểm tới hạn và mọi điểm f không xác định, đánh dấu lên trục số, chọn một giá trị thử trong từng khoảng con, rồi ghi dấu của f' ở đó.</li>
<li><strong>Ví dụ đã giải</strong> — f(x) = x³ − 3x, nên f'(x) = 3x² − 3 = 3(x − 1)(x + 1), điểm tới hạn x = −1 và x = 1.</li>
<li><strong>Thử ba khoảng</strong> — tại x = −2: f'(−2) = 3(−3)(−1) = 9 &gt; 0 · tại x = 0: f'(0) = 3(−1)(1) = −3 &lt; 0 · tại x = 2: f'(2) = 3(1)(3) = 9 &gt; 0.</li>
<li><strong>Đọc bảng</strong> — tăng trên (−∞; −1), giảm trên (−1; 1), tăng trên (1; ∞). Tại x = −1 dấu đi + → − ⇒ cực đại địa phương f(−1) = −1 + 3 = <strong>2</strong>. Tại x = 1 dấu đi − → + ⇒ cực tiểu địa phương f(1) = 1 − 3 = <strong>−2</strong>.</li>
<li><strong>Trường hợp không phải cực trị</strong> — f(x) = x³ có f'(x) = 3x² ≥ 0 ở khắp nơi, nên dấu không hề đổi tại 0; điểm đó là điểm uốn nằm ngang chứ không phải cực trị.</li>
</ul>
<p class="meo">💡 Vẽ mũi tên nhỏ lên bảng dấu — ↗ cho dấu +, ↘ cho dấu −. Đỉnh ↗↘ là cực đại, đáy ↘↗ là cực tiểu. Nhìn hình là đọc ra mọi cực trị mà không phải đọc lại phần đại số.</p>
<p class="pitfall">⚠️ Những điểm mà f không xác định cũng phải lên trục số, dù chúng không phải điểm tới hạn. Với f(x) = 1/x thì dấu của f' chỉ bàn được riêng trên (−∞; 0) và (0; ∞) — f giảm trên từng khoảng, nhưng <em>không</em> giảm trên hợp của hai khoảng đó.</p>`],

      [10, 'Concavity, inflection and the Second Derivative Test',
        `<p class="y-chinh">🎯 The sign of f'' tells you how the graph bends, and at a critical point it settles maximum versus minimum in a single line.</p>
<ul>
<li><strong>The sign table</strong> — f'' &gt; 0 on an interval ⇒ the graph is <strong>concave up</strong> (holds water, tangent lines lie below the curve); f'' &lt; 0 ⇒ <strong>concave down</strong> (spills water, tangent lines lie above).</li>
<li><strong>What f'' really measures</strong> — f'' is the rate of change of the slope. Concave up means the slope is increasing (it may still be negative, just less negative); concave down means the slope is decreasing.</li>
<li><strong>Inflection point</strong> — a point where f is continuous and f'' <em>changes sign</em>. The bending reverses there; it is the steepest or flattest part of a rise, not a peak.</li>
<li><strong>Second Derivative Test</strong> — at a critical point c with f'(c) = 0: (1) f''(c) &gt; 0 ⇒ <strong>local minimum</strong>; (2) f''(c) &lt; 0 ⇒ <strong>local maximum</strong>; (3) f''(c) = 0 ⇒ no conclusion, fall back on the First Derivative Test.</li>
<li><strong>Worked example</strong> — f(x) = x³ − 3x: f'(x) = 3x² − 3 with critical points ±1, and f''(x) = 6x.</li>
<li><strong>Applying the test</strong> — f''(−1) = −6 &lt; 0 ⇒ local maximum at x = −1, value 2. f''(1) = 6 &gt; 0 ⇒ local minimum at x = 1, value −2. Same answers as slide 9, obtained in two substitutions instead of a whole sign table.</li>
<li><strong>Concavity of the same function</strong> — f''(x) = 6x &lt; 0 for x &lt; 0 and &gt; 0 for x &gt; 0, so the curve is concave down on (−∞, 0), concave up on (0, ∞), with an <strong>inflection point at (0, 0)</strong>.</li>
<li><strong>When case 3 bites</strong> — f(x) = x⁴ has f'(0) = 0 and f''(0) = 0, yet 0 is a genuine minimum; f(x) = x³ has f'(0) = f''(0) = 0 and is not an extremum at all. Identical test output, opposite truths — which is exactly why the test refuses to answer.</li>
</ul>
<p class="meo">💡 Choose the tool by cost: the Second Derivative Test is faster when f'' is easy to compute and nonzero; the First Derivative Test never fails, so it is the safe fallback and the right choice when f' is not differentiable.</p>
<p class="pitfall">⚠️ f''(c) = 0 does <em>not</em> make c an inflection point — the sign must actually change. For f(x) = x⁴ we get f''(0) = 0, but f'' = 12x² ≥ 0 on both sides, so the curve is concave up throughout and (0, 0) is no inflection.</p>`,
        `<p class="y-chinh">🎯 Dấu của f'' cho biết đồ thị cong theo kiểu nào, và tại một điểm tới hạn nó phân định cực đại hay cực tiểu chỉ trong một dòng.</p>
<ul>
<li><strong>Bảng dấu</strong> — f'' &gt; 0 trên một khoảng ⇒ đồ thị <strong>lõm lên</strong> (hứng được nước, tiếp tuyến nằm dưới đường cong); f'' &lt; 0 ⇒ <strong>lõm xuống</strong> (đổ nước, tiếp tuyến nằm trên).</li>
<li><strong>f'' thật ra đo cái gì</strong> — f'' là tốc độ biến thiên của hệ số góc. Lõm lên nghĩa là hệ số góc đang tăng (vẫn có thể âm, chỉ là bớt âm đi); lõm xuống nghĩa là hệ số góc đang giảm.</li>
<li><strong>Điểm uốn</strong> — là điểm mà f liên tục và f'' <em>đổi dấu</em>. Chiều cong đảo lại ở đó; nó là chỗ dốc nhất hoặc thoải nhất của một đoạn lên, không phải một đỉnh.</li>
<li><strong>Test cấp 2</strong> — tại điểm tới hạn c có f'(c) = 0: (1) f''(c) &gt; 0 ⇒ <strong>cực tiểu</strong> địa phương; (2) f''(c) &lt; 0 ⇒ <strong>cực đại</strong> địa phương; (3) f''(c) = 0 ⇒ chưa kết luận được, quay về test cấp 1.</li>
<li><strong>Ví dụ đã giải</strong> — f(x) = x³ − 3x: f'(x) = 3x² − 3 với điểm tới hạn ±1, và f''(x) = 6x.</li>
<li><strong>Áp dụng test</strong> — f''(−1) = −6 &lt; 0 ⇒ cực đại tại x = −1, giá trị 2. f''(1) = 6 &gt; 0 ⇒ cực tiểu tại x = 1, giá trị −2. Cùng đáp án với slide 9 nhưng chỉ tốn hai phép thay số thay vì cả một bảng dấu.</li>
<li><strong>Tính lồi lõm của chính hàm đó</strong> — f''(x) = 6x &lt; 0 khi x &lt; 0 và &gt; 0 khi x &gt; 0, nên đường cong lõm xuống trên (−∞; 0), lõm lên trên (0; ∞), với <strong>điểm uốn tại (0; 0)</strong>.</li>
<li><strong>Khi nào trường hợp 3 cắn</strong> — f(x) = x⁴ có f'(0) = 0 và f''(0) = 0, vậy mà 0 là cực tiểu thật; f(x) = x³ cũng có f'(0) = f''(0) = 0 mà chẳng phải cực trị. Cùng một kết quả test, hai sự thật trái ngược — chính vì thế test từ chối trả lời.</li>
</ul>
<p class="meo">💡 Chọn công cụ theo chi phí: test cấp 2 nhanh hơn khi f'' dễ tính và khác 0; test cấp 1 không bao giờ hỏng nên là đường lùi an toàn, và là lựa chọn đúng khi f' không khả vi.</p>
<p class="pitfall">⚠️ f''(c) = 0 <em>không</em> biến c thành điểm uốn — dấu phải thật sự đổi. Với f(x) = x⁴ thì f''(0) = 0, nhưng f'' = 12x² ≥ 0 ở cả hai phía, nên đường cong lõm lên suốt và (0; 0) không phải điểm uốn.</p>`],

      [11, 'Curve sketching — the full checklist',
        `<p class="y-chinh">🎯 Sketching a curve is five ordered questions; answer them in order and the graph draws itself.</p>
<ul>
<li><strong>Step 1 — domain, intercepts, symmetry</strong> — where is f defined; y-intercept f(0); x-intercepts from f(x) = 0; f(−x) = f(x) means even (symmetric about Oy), f(−x) = −f(x) means odd (symmetric about the origin), and a period lets you draw one window only.</li>
<li><strong>Step 2 — asymptotes</strong> — vertical where the denominator vanishes and the numerator does not; horizontal from lim(x→±∞) f(x) (Chapter 1); a slant asymptote when the numerator's degree is exactly one more than the denominator's, found by polynomial division.</li>
<li><strong>Step 3 — f'</strong> — intervals of increase and decrease, critical points, and local extrema via the First Derivative Test.</li>
<li><strong>Step 4 — f''</strong> — intervals of concavity and the inflection points.</li>
<li><strong>Step 5 — assemble</strong> — put everything into one variation table, plot the special points (extrema, inflections, intercepts), draw the asymptotes as dashed lines, and join with the correct direction and bending.</li>
<li><strong>Worked example — f(x) = x³ − 3x</strong> — domain ℝ; f(0) = 0; f(x) = x(x² − 3) = 0 ⇒ x = 0, ±√3 ≈ ±1.73; f(−x) = −x³ + 3x = −f(x) so the curve is odd.</li>
<li><strong>Its asymptotes and derivatives</strong> — no asymptotes (a polynomial); f' = 3(x − 1)(x + 1): up on (−∞, −1), down on (−1, 1), up on (1, ∞), local maximum (−1, 2), local minimum (1, −2); f'' = 6x: concave down then up, inflection (0, 0).</li>
<li><strong>The resulting shape</strong> — rise to the peak (−1, 2), fall through the origin to the valley (1, −2), then rise again; the curve crosses Ox at −√3, 0 and √3, and behaves like x³ at both ends.</li>
</ul>
<p class="meo">💡 Mark the special points before drawing a single stroke: extrema, inflections, intercepts, asymptotes. The curve then only has to connect known dots with the right slope sign and the right bending.</p>
<p class="pitfall">⚠️ Sketching from f' alone gives the right ups and downs but the wrong curvature, and sketching from f'' alone gives the right bending in the wrong place. And the variation table must list the points where f is undefined too, or a vertical asymptote will be drawn as if it were an ordinary interval.</p>`,
        `<p class="y-chinh">🎯 Khảo sát đồ thị là năm câu hỏi theo thứ tự; trả lời đúng thứ tự thì đồ thị tự hiện ra.</p>
<ul>
<li><strong>Bước 1 — tập xác định, giao trục, đối xứng</strong> — f xác định ở đâu; giao Oy là f(0); giao Ox từ f(x) = 0; f(−x) = f(x) là hàm chẵn (đối xứng qua Oy), f(−x) = −f(x) là hàm lẻ (đối xứng qua gốc), còn có chu kỳ thì chỉ cần vẽ một cửa sổ.</li>
<li><strong>Bước 2 — tiệm cận</strong> — tiệm cận đứng ở chỗ mẫu triệt tiêu mà tử không; tiệm cận ngang từ lim(x→±∞) f(x) (Chương 1); tiệm cận xiên khi bậc tử lớn hơn bậc mẫu đúng một đơn vị, tìm bằng phép chia đa thức.</li>
<li><strong>Bước 3 — f'</strong> — các khoảng tăng và giảm, các điểm tới hạn, và cực trị địa phương bằng test cấp 1.</li>
<li><strong>Bước 4 — f''</strong> — các khoảng lồi lõm và các điểm uốn.</li>
<li><strong>Bước 5 — ráp lại</strong> — đưa tất cả vào một bảng biến thiên, chấm các điểm đặc biệt (cực trị, điểm uốn, giao trục), vẽ tiệm cận bằng nét đứt, rồi nối lại với đúng chiều đi và đúng chiều cong.</li>
<li><strong>Ví dụ đã giải — f(x) = x³ − 3x</strong> — tập xác định ℝ; f(0) = 0; f(x) = x(x² − 3) = 0 ⇒ x = 0; ±√3 ≈ ±1,73; f(−x) = −x³ + 3x = −f(x) nên đồ thị là hàm lẻ.</li>
<li><strong>Tiệm cận và đạo hàm của nó</strong> — không có tiệm cận (đa thức); f' = 3(x − 1)(x + 1): tăng trên (−∞; −1), giảm trên (−1; 1), tăng trên (1; ∞), cực đại (−1; 2), cực tiểu (1; −2); f'' = 6x: lõm xuống rồi lõm lên, điểm uốn (0; 0).</li>
<li><strong>Dáng đồ thị thu được</strong> — leo lên đỉnh (−1; 2), tụt xuống xuyên qua gốc toạ độ tới đáy (1; −2), rồi lại leo lên; đường cong cắt Ox tại −√3; 0 và √3, và ở hai đầu hành xử như x³.</li>
</ul>
<p class="meo">💡 Chấm các điểm đặc biệt trước khi kẻ một nét nào: cực trị, điểm uốn, giao trục, tiệm cận. Khi đó đường cong chỉ còn việc nối các chấm đã biết với đúng dấu hệ số góc và đúng chiều cong.</p>
<p class="pitfall">⚠️ Vẽ chỉ dựa vào f' thì đúng chiều lên xuống nhưng sai độ cong, còn chỉ dựa vào f'' thì đúng chiều cong nhưng đặt sai chỗ. Và bảng biến thiên phải ghi cả những điểm f không xác định, nếu không sẽ vẽ tiệm cận đứng như thể đó là một khoảng bình thường.</p>`],

      [12, 'Optimization — the 6-step method',
        `<p class="y-chinh">🎯 Turn the story into one function of one variable on one interval, then find its extremum with the tools of slides 7, 9 and 10.</p>
<ul>
<li><strong>Step 1 — read and draw</strong> — sketch the situation, label every length, and name the quantity to be made biggest or smallest.</li>
<li><strong>Step 2 — name the objective</strong> — write the objective function, e.g. area A, volume V, cost C, distance d. At this stage it may still involve two variables.</li>
<li><strong>Step 3 — use the constraint to eliminate</strong> — the problem always supplies one relation (fixed perimeter, fixed amount of material, a point on a given curve). Solve it for one variable and substitute, so the objective becomes a function of a <em>single</em> variable.</li>
<li><strong>Step 4 — state the domain</strong> — a physically meaningful interval: lengths must be positive, and a cut cannot exceed half the side. The domain decides whether endpoints need checking.</li>
<li><strong>Step 5 — optimise</strong> — find the critical points; use the First or Second Derivative Test on an open interval, or the Closed Interval Method when the domain is [a, b].</li>
<li><strong>Step 6 — answer the question asked</strong> — report the quantity the problem wanted, with units, and check that the number makes sense.</li>
<li><strong>Quick example</strong> — a rectangle of perimeter 100 m: constraint 2x + 2y = 100 ⇒ y = 50 − x; objective A(x) = x(50 − x) = 50x − x², domain 0 &lt; x &lt; 50; A'(x) = 50 − 2x = 0 ⇒ x = 25, and A''= −2 &lt; 0 ⇒ maximum. So y = 25 and A = <strong>625 m²</strong>: the square is the best rectangle.</li>
<li><strong>Distance shortcut</strong> — minimising a distance √(…) is the same as minimising the expression under the root, since the square root is increasing. It saves a very messy derivative.</li>
</ul>
<p class="meo">💡 Write the constraint and the objective on two separate lines before touching any derivative. Most lost marks come from mixing them up, i.e. differentiating the constraint by mistake.</p>
<p class="pitfall">⚠️ Three habits to fight: differentiating while two variables are still present, forgetting the domain endpoints (a maximum may live at one), and answering "x = 25" when the question asked for the area. Also check the found critical point is really a maximum, not a minimum.</p>`,
        `<p class="y-chinh">🎯 Biến đề bài thành một hàm một biến trên một khoảng, rồi tìm cực trị bằng công cụ của slide 7, 9 và 10.</p>
<ul>
<li><strong>Bước 1 — đọc đề và vẽ hình</strong> — phác lại tình huống, ghi tên mọi độ dài, và gọi tên đại lượng cần làm lớn nhất hoặc nhỏ nhất.</li>
<li><strong>Bước 2 — đặt hàm mục tiêu</strong> — viết hàm mục tiêu, ví dụ diện tích A, thể tích V, chi phí C, khoảng cách d. Ở bước này nó vẫn có thể còn hai biến.</li>
<li><strong>Bước 3 — dùng ràng buộc để khử bớt biến</strong> — đề luôn cho sẵn một hệ thức (chu vi cố định, lượng vật liệu cố định, điểm nằm trên một đường cho trước). Giải hệ thức đó theo một biến rồi thay vào, để hàm mục tiêu chỉ còn <em>một</em> biến.</li>
<li><strong>Bước 4 — nêu tập xác định</strong> — một khoảng có nghĩa vật lý: độ dài phải dương, và nhát cắt không thể vượt quá nửa cạnh. Tập xác định quyết định có phải kiểm đầu mút hay không.</li>
<li><strong>Bước 5 — tìm cực trị</strong> — tìm điểm tới hạn; dùng test cấp 1 hoặc cấp 2 nếu là khoảng mở, hoặc phương pháp đoạn đóng khi miền là [a, b].</li>
<li><strong>Bước 6 — trả lời đúng câu hỏi</strong> — nêu đại lượng mà đề hỏi, kèm đơn vị, và kiểm xem con số có hợp lý không.</li>
<li><strong>Ví dụ nhanh</strong> — hình chữ nhật chu vi 100 m: ràng buộc 2x + 2y = 100 ⇒ y = 50 − x; mục tiêu A(x) = x(50 − x) = 50x − x², miền 0 &lt; x &lt; 50; A'(x) = 50 − 2x = 0 ⇒ x = 25, và A'' = −2 &lt; 0 ⇒ cực đại. Vậy y = 25 và A = <strong>625 m²</strong>: hình vuông là hình chữ nhật tốt nhất.</li>
<li><strong>Mẹo với khoảng cách</strong> — làm nhỏ nhất một khoảng cách √(…) tương đương làm nhỏ nhất biểu thức dưới căn, vì hàm căn là hàm tăng. Mẹo này tiết kiệm một phép đạo hàm rất rối.</li>
</ul>
<p class="meo">💡 Viết ràng buộc và hàm mục tiêu thành hai dòng riêng biệt trước khi động tới đạo hàm. Phần lớn điểm mất là do lẫn hai thứ đó, tức đạo hàm nhầm vào ràng buộc.</p>
<p class="pitfall">⚠️ Ba thói quen phải bỏ: đạo hàm khi biểu thức còn hai biến, quên đầu mút của miền (cực trị có thể nằm ngay đó), và trả lời "x = 25" trong khi đề hỏi diện tích. Ngoài ra phải kiểm điểm tới hạn tìm được đúng là cực đại chứ không phải cực tiểu.</p>`],

      [13, 'Optimization — the open box of maximum volume',
        `<p class="y-chinh">🎯 From a 12 cm square sheet, cutting corner squares of side x = 2 cm gives the largest open box, of volume 128 cm³.</p>
<ul>
<li><strong>The problem</strong> — cut an x by x square from each of the four corners of a 12 cm by 12 cm sheet, fold the flaps up, and ask which x makes the volume greatest.</li>
<li><strong>Step 1 — the objective</strong> — the base becomes a square of side 12 − 2x and the height is x, so V(x) = x(12 − 2x)². Only one variable already, because the geometry supplied the constraint.</li>
<li><strong>Step 2 — the domain</strong> — x must be positive and the base side 12 − 2x must be positive, so <strong>0 &lt; x &lt; 6</strong>. At both ends the volume degenerates to 0.</li>
<li><strong>Step 3 — differentiate</strong> — by the Product and Chain Rules, V'(x) = (12 − 2x)² + x·2(12 − 2x)(−2) = (12 − 2x)[(12 − 2x) − 4x] = (12 − 2x)(12 − 6x) = <strong>12(x − 6)(x − 2)</strong>.</li>
<li><strong>Step 4 — critical points</strong> — V'(x) = 0 ⇒ x = 6 or x = 2. Reject x = 6: it is outside the open domain and gives V = 0 anyway. The only candidate is x = 2.</li>
<li><strong>Step 5 — confirm it is a maximum</strong> — expand V' = 12x² − 96x + 144, so V''(x) = 24x − 96 and V''(2) = 48 − 96 = <strong>−48 &lt; 0</strong> ⇒ local maximum. The First Derivative Test agrees: V'(1) = 12(−5)(−1) = 60 &gt; 0 and V'(3) = 12(−3)(1) = −36 &lt; 0, a + → − change.</li>
<li><strong>Step 6 — the answer</strong> — V(2) = 2·(12 − 4)² = 2·64 = <strong>128 cm³</strong>, with a box 8 cm by 8 cm by 2 cm. Cut corners of <strong>2 cm</strong>.</li>
<li><strong>Why it is the absolute maximum</strong> — V is continuous on [0, 6] and V(0) = V(6) = 0, so by the Closed Interval Method the only interior candidate x = 2 must carry the absolute maximum.</li>
</ul>
<p class="meo">💡 Factor V' instead of expanding it: (12 − 2x)(12 − 6x) hands you both roots instantly, whereas 12x² − 96x + 144 needs the quadratic formula for the same information.</p>
<p class="pitfall">⚠️ Two mistakes to avoid: keeping x = 6 as an answer (the base would have side 0, so there is no box), and reporting x = 2 as the volume. The question asked for the maximum volume — that is 128 cm³, and x = 2 cm is only where it happens.</p>`,
        `<p class="y-chinh">🎯 Từ tấm bìa vuông cạnh 12 cm, cắt bốn góc hình vuông cạnh x = 2 cm cho chiếc hộp hở lớn nhất, thể tích 128 cm³.</p>
<ul>
<li><strong>Đề bài</strong> — cắt bốn hình vuông cạnh x ở bốn góc tấm bìa 12 cm × 12 cm, gấp mép lên, và hỏi x bằng bao nhiêu thì thể tích lớn nhất.</li>
<li><strong>Bước 1 — hàm mục tiêu</strong> — đáy thành hình vuông cạnh 12 − 2x, chiều cao là x, nên V(x) = x(12 − 2x)². Đã chỉ còn một biến, vì chính hình học đã cung cấp ràng buộc.</li>
<li><strong>Bước 2 — tập xác định</strong> — x phải dương và cạnh đáy 12 − 2x cũng phải dương, nên <strong>0 &lt; x &lt; 6</strong>. Ở hai đầu, thể tích suy biến về 0.</li>
<li><strong>Bước 3 — đạo hàm</strong> — dùng quy tắc tích và dây chuyền, V'(x) = (12 − 2x)² + x·2(12 − 2x)(−2) = (12 − 2x)[(12 − 2x) − 4x] = (12 − 2x)(12 − 6x) = <strong>12(x − 6)(x − 2)</strong>.</li>
<li><strong>Bước 4 — điểm tới hạn</strong> — V'(x) = 0 ⇒ x = 6 hoặc x = 2. Loại x = 6: nó nằm ngoài miền mở và dù sao cũng cho V = 0. Ứng viên duy nhất là x = 2.</li>
<li><strong>Bước 5 — xác nhận là cực đại</strong> — khai triển V' = 12x² − 96x + 144, nên V''(x) = 24x − 96 và V''(2) = 48 − 96 = <strong>−48 &lt; 0</strong> ⇒ cực đại. Test cấp 1 cũng đồng ý: V'(1) = 12(−5)(−1) = 60 &gt; 0 và V'(3) = 12(−3)(1) = −36 &lt; 0, tức đổi dấu + → −.</li>
<li><strong>Bước 6 — đáp số</strong> — V(2) = 2·(12 − 4)² = 2·64 = <strong>128 cm³</strong>, tương ứng chiếc hộp 8 cm × 8 cm × 2 cm. Vậy cắt góc <strong>2 cm</strong>.</li>
<li><strong>Vì sao đó là cực đại tuyệt đối</strong> — V liên tục trên [0; 6] và V(0) = V(6) = 0, nên theo phương pháp đoạn đóng, ứng viên bên trong duy nhất x = 2 bắt buộc phải mang giá trị lớn nhất tuyệt đối.</li>
</ul>
<p class="meo">💡 Hãy phân tích nhân tử V' thay vì khai triển: (12 − 2x)(12 − 6x) cho ngay cả hai nghiệm, trong khi 12x² − 96x + 144 còn phải giải phương trình bậc hai mới ra đúng ngần ấy thông tin.</p>
<p class="pitfall">⚠️ Hai lỗi cần tránh: giữ x = 6 làm đáp án (đáy sẽ có cạnh bằng 0, không có hộp nào cả), và ghi x = 2 như thể đó là thể tích. Đề hỏi thể tích lớn nhất — con số đó là 128 cm³, còn x = 2 cm chỉ là nơi nó đạt được.</p>`],

      [14, "L'Hôpital's Rule",
        `<p class="y-chinh">🎯 For the forms 0/0 and ∞/∞, differentiate the top and the bottom <em>separately</em> and take the limit again.</p>
<ul>
<li><strong>The statement</strong> — if f and g are differentiable near a, g'(x) ≠ 0 near a, and lim f/g has the form 0/0 or ∞/∞, then lim(x→a) f(x)/g(x) = lim(x→a) f'(x)/g'(x), whenever the right-hand limit exists.</li>
<li><strong>It works at infinity too</strong> — a may be a real number, a⁻, a⁺, +∞ or −∞; the rule is the same in every case.</li>
<li><strong>Worked example, step by step</strong> — (1) lim(x→0) (sin x)/x: substituting gives 0/0, an indeterminate form; (2) differentiate top and bottom separately: (cos x)/1; (3) substitute x = 0: cos 0 = <strong>1</strong>.</li>
<li><strong>A second example</strong> — lim(x→0) (eˣ − 1)/x is 0/0 ⇒ lim eˣ/1 = e⁰ = <strong>1</strong>. And lim(x→∞) (ln x)/x is ∞/∞ ⇒ lim (1/x)/1 = <strong>0</strong>, which shows ln x grows more slowly than x.</li>
<li><strong>Repeat when needed</strong> — lim(x→∞) x²/eˣ is ∞/∞ ⇒ 2x/eˣ, still ∞/∞ ⇒ 2/eˣ → <strong>0</strong>. Exponentials always beat powers.</li>
<li><strong>Other indeterminate forms must be converted first</strong> — 0·∞: rewrite as a quotient, e.g. x·ln x = (ln x)/(1/x). ∞ − ∞: combine over a common denominator. 1^∞, 0⁰, ∞⁰: take logarithms, apply the rule, then exponentiate the answer.</li>
<li><strong>Worked conversion</strong> — lim(x→0⁺) x·ln x = lim (ln x)/(1/x), which is −∞/∞ ⇒ lim (1/x)/(−1/x²) = lim (−x) = <strong>0</strong>.</li>
<li><strong>Stop at the right moment</strong> — apply the rule only while the form is still indeterminate. Once substitution gives a real number, that number is the answer; one extra round would corrupt it.</li>
</ul>
<p class="meo">💡 Check the form every single time before differentiating again; writing "0/0" or "∞/∞" beside each line is both a guard and the justification a marker looks for.</p>
<p class="pitfall">⚠️ Two fatal errors: applying the Quotient Rule instead of differentiating numerator and denominator separately — they are different formulas; and using the rule on something that is not indeterminate, e.g. lim(x→0) (x + 1)/(x + 2) = 1/2, whereas the rule would wrongly produce 1/1 = 1.</p>`,
        `<p class="y-chinh">🎯 Với dạng 0/0 và ∞/∞, hãy đạo hàm tử và mẫu <em>riêng rẽ</em> rồi lấy giới hạn lại.</p>
<ul>
<li><strong>Phát biểu</strong> — nếu f và g khả vi quanh a, g'(x) ≠ 0 quanh a, và lim f/g có dạng 0/0 hoặc ∞/∞ thì lim(x→a) f(x)/g(x) = lim(x→a) f'(x)/g'(x), miễn là giới hạn vế phải tồn tại.</li>
<li><strong>Dùng được cả ở vô cực</strong> — a có thể là số thực, a⁻, a⁺, +∞ hay −∞; quy tắc vẫn y nguyên trong mọi trường hợp.</li>
<li><strong>Ví dụ giải từng bước</strong> — (1) lim(x→0) (sin x)/x: thay số ra 0/0, là dạng vô định; (2) đạo hàm tử và mẫu riêng rẽ: (cos x)/1; (3) thay x = 0: cos 0 = <strong>1</strong>.</li>
<li><strong>Ví dụ thứ hai</strong> — lim(x→0) (eˣ − 1)/x là 0/0 ⇒ lim eˣ/1 = e⁰ = <strong>1</strong>. Còn lim(x→∞) (ln x)/x là ∞/∞ ⇒ lim (1/x)/1 = <strong>0</strong>, cho thấy ln x tăng chậm hơn x.</li>
<li><strong>Lặp lại khi cần</strong> — lim(x→∞) x²/eˣ là ∞/∞ ⇒ 2x/eˣ, vẫn ∞/∞ ⇒ 2/eˣ → <strong>0</strong>. Hàm mũ luôn thắng hàm luỹ thừa.</li>
<li><strong>Các dạng vô định khác phải biến đổi trước</strong> — 0·∞: viết lại thành thương, ví dụ x·ln x = (ln x)/(1/x). ∞ − ∞: quy về cùng mẫu. 1^∞, 0⁰, ∞⁰: lấy logarit, áp quy tắc, rồi mũ hoá kết quả.</li>
<li><strong>Một phép biến đổi mẫu</strong> — lim(x→0⁺) x·ln x = lim (ln x)/(1/x), là dạng −∞/∞ ⇒ lim (1/x)/(−1/x²) = lim (−x) = <strong>0</strong>.</li>
<li><strong>Dừng đúng lúc</strong> — chỉ áp quy tắc khi dạng vẫn còn vô định. Khi thay số đã ra một số thực thì số đó là đáp án; làm thêm một vòng nữa là hỏng.</li>
</ul>
<p class="meo">💡 Kiểm lại dạng trước mỗi lần đạo hàm tiếp; ghi "0/0" hay "∞/∞" bên cạnh từng dòng vừa là chốt chặn cho mình vừa là phần lập luận mà người chấm tìm.</p>
<p class="pitfall">⚠️ Hai lỗi chí mạng: dùng quy tắc đạo hàm của thương thay vì đạo hàm tử và mẫu riêng rẽ — đó là hai công thức khác nhau; và áp quy tắc cho thứ không hề vô định, ví dụ lim(x→0) (x + 1)/(x + 2) = 1/2, trong khi quy tắc sẽ cho ra sai là 1/1 = 1.</p>`],

      [15, "Newton's Method",
        `<p class="y-chinh">🎯 Slide down the tangent line to the x-axis, and repeat: x(n+1) = x(n) − f(x(n))/f'(x(n)) converges very fast on a root of f(x) = 0.</p>
<ul>
<li><strong>Where the formula comes from</strong> — the tangent at (xₙ, f(xₙ)) is y = f(xₙ) + f'(xₙ)(x − xₙ). Setting y = 0 and solving for x gives exactly x = xₙ − f(xₙ)/f'(xₙ), the next estimate.</li>
<li><strong>The recipe</strong> — pick a starting guess x₁ near the root (a sketch or the Intermediate Value Theorem finds one), then iterate until two successive values agree to the precision you need.</li>
<li><strong>Worked example — approximate √2</strong> — take f(x) = x² − 2, whose positive root is √2; f'(x) = 2x, and choose x₁ = 1.5.</li>
<li><strong>Iteration 1</strong> — x₂ = 1.5 − (1.5² − 2)/(2·1.5) = 1.5 − 0.25/3 = 1.5 − 0.08333 = <strong>1.41666…</strong></li>
<li><strong>Iteration 2</strong> — x₃ = 1.41666 − (2.006944 − 2)/2.83333 = 1.41666 − 0.002451 = <strong>1.4142157</strong>, already correct to 5 decimal places since √2 = 1.4142136.</li>
<li><strong>Iteration 3</strong> — x₄ ≈ 1.41421356, correct to 8 decimals. The number of correct digits roughly <em>doubles</em> each step; this is called quadratic convergence.</li>
<li><strong>The general square-root form</strong> — for f(x) = x² − A the recurrence simplifies to x(n+1) = (xₙ + A/xₙ)/2, the averaging rule that calculators and the ancient Babylonians both use.</li>
<li><strong>When it fails</strong> — f'(xₙ) ≈ 0 makes the tangent nearly horizontal and throws the next estimate far away; a bad starting guess may converge to a different root or diverge; and some functions cycle forever, e.g. the method on x³ − 2x + 2 starting at x₁ = 0 bounces between 0 and 1.</li>
</ul>
<p class="meo">💡 Choose x₁ with the IVT: find a and b where f changes sign, then start from the midpoint. Two safe digits at the start typically buy full machine precision within three iterations.</p>
<p class="pitfall">⚠️ Three traps: dividing by f'(xₙ) when it is 0 or tiny; stopping after one iteration and calling it the root; and rounding hard in the middle — Newton's Method amplifies your own arithmetic slips as diligently as it amplifies accuracy.</p>`,
        `<p class="y-chinh">🎯 Trượt theo tiếp tuyến xuống trục hoành rồi lặp lại: x(n+1) = x(n) − f(x(n))/f'(x(n)) hội tụ rất nhanh về nghiệm của f(x) = 0.</p>
<ul>
<li><strong>Công thức từ đâu ra</strong> — tiếp tuyến tại (xₙ, f(xₙ)) là y = f(xₙ) + f'(xₙ)(x − xₙ). Cho y = 0 rồi giải theo x thì được đúng x = xₙ − f(xₙ)/f'(xₙ), tức giá trị xấp xỉ kế tiếp.</li>
<li><strong>Quy trình</strong> — chọn dự đoán ban đầu x₁ gần nghiệm (vẽ phác hoặc dùng định lý giá trị trung gian để tìm), rồi lặp cho tới khi hai giá trị liên tiếp trùng nhau ở độ chính xác cần thiết.</li>
<li><strong>Ví dụ đã giải — xấp xỉ √2</strong> — lấy f(x) = x² − 2, nghiệm dương của nó là √2; f'(x) = 2x, và chọn x₁ = 1,5.</li>
<li><strong>Vòng lặp 1</strong> — x₂ = 1,5 − (1,5² − 2)/(2·1,5) = 1,5 − 0,25/3 = 1,5 − 0,08333 = <strong>1,41666…</strong></li>
<li><strong>Vòng lặp 2</strong> — x₃ = 1,41666 − (2,006944 − 2)/2,83333 = 1,41666 − 0,002451 = <strong>1,4142157</strong>, đã đúng tới 5 chữ số thập phân vì √2 = 1,4142136.</li>
<li><strong>Vòng lặp 3</strong> — x₄ ≈ 1,41421356, đúng tới 8 chữ số. Số chữ số đúng gần như <em>gấp đôi</em> sau mỗi bước; người ta gọi đó là hội tụ bậc hai.</li>
<li><strong>Dạng tổng quát cho căn bậc hai</strong> — với f(x) = x² − A thì công thức truy hồi rút gọn thành x(n+1) = (xₙ + A/xₙ)/2, đúng quy tắc lấy trung bình mà máy tính bỏ túi và người Babylon cổ đại đều dùng.</li>
<li><strong>Khi nào nó hỏng</strong> — f'(xₙ) ≈ 0 làm tiếp tuyến gần như nằm ngang và ném giá trị kế tiếp đi rất xa; dự đoán ban đầu xấu có thể hội tụ về nghiệm khác hoặc phân kỳ; và có hàm khiến nó quay vòng mãi, ví dụ áp cho x³ − 2x + 2 với x₁ = 0 thì nó nhảy qua lại giữa 0 và 1.</li>
</ul>
<p class="meo">💡 Chọn x₁ bằng định lý giá trị trung gian: tìm a và b mà f đổi dấu, rồi xuất phát từ trung điểm. Hai chữ số đúng lúc đầu thường mua được độ chính xác tối đa của máy chỉ sau ba vòng lặp.</p>
<p class="pitfall">⚠️ Ba cái bẫy: chia cho f'(xₙ) khi nó bằng 0 hoặc quá nhỏ; dừng sau một vòng rồi coi đó là nghiệm; và làm tròn mạnh tay ở giữa chừng — phương pháp Newton khuếch đại lỗi tính toán của chính bạn chăm chỉ y như nó khuếch đại độ chính xác.</p>`],

      [16, 'Antiderivatives',
        `<p class="y-chinh">🎯 F is an antiderivative of f when F'(x) = f(x); every other one differs only by a constant, hence the "+ C".</p>
<ul>
<li><strong>Definition and the constant</strong> — if F' = f on an interval, the general antiderivative is F(x) + C. Two functions with the same derivative differ by a constant — that is Consequence 2 of the Mean Value Theorem from slide 8.</li>
<li><strong>The power rule backwards</strong> — the antiderivative of xⁿ is x^(n+1)/(n + 1) + C for n ≠ −1. Check by differentiating: (n + 1)x^n/(n + 1) = xⁿ. The excluded case n = −1 would divide by zero.</li>
<li><strong>The missing case</strong> — the antiderivative of 1/x is ln|x| + C. The absolute value matters, because 1/x is defined for negative x too.</li>
<li><strong>Trigonometric pair</strong> — the antiderivative of sin x is −cos x + C, and of cos x is sin x + C. The minus sign lands on the cosine; differentiate to confirm, since (−cos x)' = sin x.</li>
<li><strong>Exponential</strong> — the antiderivative of eˣ is eˣ + C, the one function that is its own antiderivative up to the constant. More generally the antiderivative of e^(kx) is e^(kx)/k + C.</li>
<li><strong>Linearity</strong> — antiderivatives respect sums and constant multiples: work term by term. Example: f(x) = 3x² − 4 sin x + 5 gives F(x) = x³ + 4 cos x + 5x + C.</li>
<li><strong>Fixing C with an initial condition</strong> — given f'(x) = 2x and f(1) = 5: f(x) = x² + C, then 1 + C = 5 ⇒ C = 4, so f(x) = <strong>x² + 4</strong>. One data point pins the whole family down to one curve.</li>
<li><strong>Physics reading</strong> — position s, velocity v = s', acceleration a = v'. Going backwards: from a = −9.8 m/s², v(t) = −9.8t + v₀ and s(t) = −4.9t² + v₀t + s₀, where the two constants are exactly the initial velocity and the initial height.</li>
</ul>
<p class="meo">💡 Every antiderivative can be checked in one line — differentiate your answer and compare with f. Unlike most of Chapter 3, the verification is easier than the work itself, so always do it.</p>
<p class="pitfall">⚠️ Three habitual slips: dropping the "+ C" (it costs a mark and makes the initial-condition step impossible); writing xⁿ → x^(n−1)/(n − 1), i.e. differentiating by mistake; and forgetting that there is no product rule in reverse — the antiderivative of a product is <em>not</em> the product of the antiderivatives.</p>`,
        `<p class="y-chinh">🎯 F là nguyên hàm của f khi F'(x) = f(x); mọi nguyên hàm khác chỉ sai khác một hằng số, nên mới có "+ C".</p>
<ul>
<li><strong>Định nghĩa và hằng số C</strong> — nếu F' = f trên một khoảng thì họ nguyên hàm là F(x) + C. Hai hàm có cùng đạo hàm thì sai khác một hằng số — đó chính là Hệ quả 2 của định lý giá trị trung bình ở slide 8.</li>
<li><strong>Quy tắc luỹ thừa chạy ngược</strong> — nguyên hàm của xⁿ là x^(n+1)/(n + 1) + C với n ≠ −1. Kiểm bằng cách đạo hàm lại: (n + 1)x^n/(n + 1) = xⁿ. Trường hợp bị loại n = −1 sẽ khiến mẫu bằng 0.</li>
<li><strong>Trường hợp còn thiếu</strong> — nguyên hàm của 1/x là ln|x| + C. Dấu trị tuyệt đối là quan trọng, vì 1/x còn xác định với x âm.</li>
<li><strong>Cặp lượng giác</strong> — nguyên hàm của sin x là −cos x + C, còn của cos x là sin x + C. Dấu trừ rơi vào cosin; đạo hàm lại là thấy ngay, vì (−cos x)' = sin x.</li>
<li><strong>Hàm mũ</strong> — nguyên hàm của eˣ là eˣ + C, hàm duy nhất là nguyên hàm của chính nó sai khác hằng số. Tổng quát hơn, nguyên hàm của e^(kx) là e^(kx)/k + C.</li>
<li><strong>Tính tuyến tính</strong> — nguyên hàm tôn trọng phép cộng và phép nhân hằng số: cứ làm từng số hạng. Ví dụ: f(x) = 3x² − 4 sin x + 5 cho F(x) = x³ + 4 cos x + 5x + C.</li>
<li><strong>Chốt C bằng điều kiện đầu</strong> — cho f'(x) = 2x và f(1) = 5: f(x) = x² + C, rồi 1 + C = 5 ⇒ C = 4, vậy f(x) = <strong>x² + 4</strong>. Một dữ kiện là đủ ghim cả họ hàm về đúng một đường cong.</li>
<li><strong>Cách đọc theo vật lý</strong> — quãng đường s, vận tốc v = s', gia tốc a = v'. Đi ngược lại: từ a = −9,8 m/s² có v(t) = −9,8t + v₀ và s(t) = −4,9t² + v₀t + s₀, trong đó hai hằng số chính là vận tốc ban đầu và độ cao ban đầu.</li>
</ul>
<p class="meo">💡 Mọi nguyên hàm đều kiểm lại được trong một dòng — đạo hàm đáp án của mình rồi so với f. Khác với phần lớn Chương 3, ở đây việc kiểm còn dễ hơn việc làm, nên hãy luôn kiểm.</p>
<p class="pitfall">⚠️ Ba lỗi thành nếp: rơi mất "+ C" (vừa mất điểm vừa không làm được bước điều kiện đầu); viết xⁿ → x^(n−1)/(n − 1), tức là đạo hàm nhầm; và quên rằng không có quy tắc tích chạy ngược — nguyên hàm của một tích <em>không</em> phải là tích các nguyên hàm.</p>`],

      [17, 'Summary — six things to carry out of Chapter 3',
        `<p class="y-chinh">🎯 Six statements. If you can say all six without notes, Chapter 3 is done.</p>
<ol>
<li><strong>Related rates: differentiate with respect to t, substitute last</strong> — write the relation, apply the Chain Rule to every variable, and only then put in the instant's numbers. The ladder: x² + y² = 100, dx/dt = 1, x = 6 ⇒ y = 8 ⇒ dy/dt = −0.75 m/s, the minus meaning the top slides down.</li>
<li><strong>The tangent line is the local copy of f</strong> — L(x) = f(a) + f'(a)(x − a) and dy = f'(x)dx. With f = √x and a = 4, √4.1 ≈ 2.025 against a true 2.024845, an error of 0.008 %.</li>
<li><strong>Extrema live at critical points or endpoints</strong> — c is critical when f'(c) = 0 or f'(c) does not exist. The Extreme Value Theorem promises an absolute maximum and minimum for a continuous f on [a, b]; the Closed Interval Method finds them by comparing values, as with x³ − 3x + 1 on [0, 3] giving 19 and −1.</li>
<li><strong>The MVT connects the sign of f' to f itself</strong> — f'(c) = [f(b) − f(a)]/(b − a) for some c, hence f' &gt; 0 ⇒ increasing, f' &lt; 0 ⇒ decreasing, f' = 0 throughout ⇒ constant. The First Derivative Test reads + → − as a maximum and − → + as a minimum; the Second Derivative Test reads f'' &lt; 0 as a maximum and f'' &gt; 0 as a minimum, and refuses to answer when f'' = 0.</li>
<li><strong>Sketching and optimizing are the same five questions</strong> — domain and intercepts, asymptotes, f' for direction, f'' for bending, then assemble. Optimization adds the constraint that reduces everything to one variable: the box V = x(12 − 2x)² gives x = 2 and V = 128 cm³.</li>
<li><strong>L'Hôpital, Newton, antiderivatives</strong> — 0/0 or ∞/∞ ⇒ differentiate top and bottom separately, e.g. sin x / x → 1; x(n+1) = xₙ − f(xₙ)/f'(xₙ) turns tangent lines into roots, e.g. √2 ≈ 1.4142157 after two steps from 1.5; and F' = f with the general answer F + C, which opens Chapter 4.</li>
</ol>
<p class="meo">💡 One workflow for any Chapter 3 question: name the variables → write the relation or objective → differentiate (with respect to t, or with respect to x) → find where the derivative is 0 or undefined → decide the type with a sign change or with f'' → answer in the units the question used.</p>
<p class="pitfall">⚠️ The marks lost most often: substituting numbers before differentiating in related rates; forgetting the endpoints in an absolute-extremum question; treating f'(c) = 0 as proof of an extremum; using L'Hôpital on a form that is not indeterminate; and dropping the "+ C".</p>`,
        `<p class="y-chinh">🎯 Sáu câu. Nói được cả sáu câu mà không cần nhìn tài liệu là xong Chương 3.</p>
<ol>
<li><strong>Tốc độ liên quan: đạo hàm theo t, thay số sau cùng</strong> — viết hệ thức, áp quy tắc dây chuyền cho mọi biến, rồi mới thay số của thời điểm. Bài thang: x² + y² = 100, dx/dt = 1, x = 6 ⇒ y = 8 ⇒ dy/dt = −0,75 m/s, dấu trừ nghĩa là đỉnh thang trượt xuống.</li>
<li><strong>Tiếp tuyến là bản sao tại chỗ của f</strong> — L(x) = f(a) + f'(a)(x − a) và dy = f'(x)dx. Với f = √x và a = 4 thì √4,1 ≈ 2,025 so với giá trị thật 2,024845, sai số 0,008 %.</li>
<li><strong>Cực trị chỉ nằm ở điểm tới hạn hoặc đầu mút</strong> — c là điểm tới hạn khi f'(c) = 0 hoặc f'(c) không tồn tại. Định lý giá trị cực trị hứa có GTLN và GTNN tuyệt đối cho f liên tục trên [a, b]; phương pháp đoạn đóng tìm ra chúng bằng cách so sánh giá trị, như x³ − 3x + 1 trên [0; 3] cho 19 và −1.</li>
<li><strong>Định lý giá trị trung bình nối dấu của f' với chính f</strong> — có c sao cho f'(c) = [f(b) − f(a)]/(b − a), từ đó f' &gt; 0 ⇒ tăng, f' &lt; 0 ⇒ giảm, f' = 0 suốt ⇒ hằng số. Test cấp 1 đọc + → − là cực đại và − → + là cực tiểu; test cấp 2 đọc f'' &lt; 0 là cực đại và f'' &gt; 0 là cực tiểu, và từ chối trả lời khi f'' = 0.</li>
<li><strong>Khảo sát đồ thị và tối ưu hoá là cùng năm câu hỏi</strong> — tập xác định và giao trục, tiệm cận, f' cho chiều đi, f'' cho chiều cong, rồi ráp lại. Tối ưu hoá thêm một ràng buộc để đưa mọi thứ về một biến: bài hộp V = x(12 − 2x)² cho x = 2 và V = 128 cm³.</li>
<li><strong>L'Hôpital, Newton, nguyên hàm</strong> — gặp 0/0 hoặc ∞/∞ ⇒ đạo hàm tử và mẫu riêng rẽ, ví dụ sin x / x → 1; x(n+1) = xₙ − f(xₙ)/f'(xₙ) biến tiếp tuyến thành nghiệm, ví dụ √2 ≈ 1,4142157 chỉ sau hai bước từ 1,5; và F' = f với đáp án tổng quát F + C, mở đường sang Chương 4.</li>
</ol>
<p class="meo">💡 Một quy trình cho mọi câu hỏi Chương 3: đặt tên biến → viết hệ thức hoặc hàm mục tiêu → đạo hàm (theo t, hoặc theo x) → tìm chỗ đạo hàm bằng 0 hoặc không xác định → phân loại bằng đổi dấu hoặc bằng f'' → trả lời theo đúng đơn vị mà đề dùng.</p>
<p class="pitfall">⚠️ Những điểm mất nhiều nhất: thay số trước khi đạo hàm ở bài tốc độ liên quan; quên đầu mút khi hỏi cực trị tuyệt đối; coi f'(c) = 0 là bằng chứng có cực trị; dùng L'Hôpital cho dạng không hề vô định; và làm rơi mất "+ C".</p>`],
    ]),
  ].join('\n'),
};
