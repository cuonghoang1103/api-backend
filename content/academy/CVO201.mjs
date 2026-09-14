/**
 * CVO201 — Convex Optimization (Tối ưu lồi). Ngành Khoa học Máy tính, kỳ 3.
 * Giáo trình: Boyd & Vandenberghe "Convex Optimization" + Stanford EE364a;
 * Nocedal & Wright "Numerical Optimization"; CVXPY docs. Song ngữ + ví dụ
 * Python/CVXPY. ⚠️ KHÔNG backtick/${; công thức chữ Latin; "<" -> &lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cvo201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chuẩn (Boyd & Vandenberghe, Nocedal & Wright), khoá Stanford EE364a, tài liệu CVXPY, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">CVO201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Convex Optimization</strong> — convex sets &amp; functions, standard-form problems (LP/QP/SOCP/SDP), Lagrange duality &amp; KKT, unconstrained and constrained algorithms, and machine-learning applications — in one place. All resources below are free and legal.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><a href="https://web.stanford.edu/~boyd/cvxbook/" target="_blank" rel="noopener"><em>Convex Optimization</em> — Boyd &amp; Vandenberghe</a> (full PDF free)</li>
<li><a href="https://www.math.uci.edu/~qnie/Publications/NumericalOptimization.pdf" target="_blank" rel="noopener"><em>Numerical Optimization</em> — Nocedal &amp; Wright</a></li>
</ul>
<h3>🎓 Course &amp; lectures</h3>
<ul>
<li><a href="https://web.stanford.edu/class/ee364a/" target="_blank" rel="noopener">Stanford EE364a — Convex Optimization I</a> (slides, homework, exams)</li>
<li><a href="https://www.youtube.com/playlist?list=PL3940DD956CDF0622" target="_blank" rel="noopener">Stephen Boyd — EE364a video lectures</a></li>
</ul>
<h3>🌐 Official documentation</h3>
<ul>
<li><a href="https://www.cvxpy.org/" target="_blank" rel="noopener">CVXPY docs — modeling &amp; examples</a></li>
<li><a href="https://www.cvxpy.org/examples/index.html" target="_blank" rel="noopener">CVXPY example gallery (LP, QP, SVM, portfolio)</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.cvxpy.org/" target="_blank" rel="noopener">CVXPY</a> — Python modeling language for convex problems</li>
<li><a href="https://numpy.org/" target="_blank" rel="noopener">NumPy</a> — arrays &amp; linear algebra</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — run CVXPY in the browser, no install</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what an optimization problem is, convex sets &amp; convex functions (the whole subject rests here).</li>
<li><strong>Model</strong> — recognise LP/QP/SOCP/SDP and write them in CVXPY.</li>
<li><strong>Theory</strong> — Lagrange duality and KKT conditions (why a point is optimal).</li>
<li><strong>Algorithms</strong> — gradient descent, Newton, interior-point, and SGD for machine learning.</li>
</ol></div>`,
    `<span class="eyebrow">CVO201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Tối ưu lồi</strong> — tập lồi &amp; hàm lồi, bài toán chuẩn (LP/QP/SOCP/SDP), đối ngẫu Lagrange &amp; KKT, thuật toán không ràng buộc và có ràng buộc, ứng dụng học máy — gom về một chỗ. Tất cả nguồn dưới đây miễn phí và hợp pháp.</p>
<h3>📘 Sách chuẩn</h3>
<ul>
<li><a href="https://web.stanford.edu/~boyd/cvxbook/" target="_blank" rel="noopener"><em>Convex Optimization</em> — Boyd &amp; Vandenberghe</a> (PDF đầy đủ miễn phí)</li>
<li><a href="https://www.math.uci.edu/~qnie/Publications/NumericalOptimization.pdf" target="_blank" rel="noopener"><em>Numerical Optimization</em> — Nocedal &amp; Wright</a></li>
</ul>
<h3>🎓 Khoá học &amp; bài giảng</h3>
<ul>
<li><a href="https://web.stanford.edu/class/ee364a/" target="_blank" rel="noopener">Stanford EE364a — Convex Optimization I</a> (slide, bài tập, đề thi)</li>
<li><a href="https://www.youtube.com/playlist?list=PL3940DD956CDF0622" target="_blank" rel="noopener">Stephen Boyd — bài giảng video EE364a</a></li>
</ul>
<h3>🌐 Tài liệu chính thức</h3>
<ul>
<li><a href="https://www.cvxpy.org/" target="_blank" rel="noopener">Tài liệu CVXPY — mô hình hoá &amp; ví dụ</a></li>
<li><a href="https://www.cvxpy.org/examples/index.html" target="_blank" rel="noopener">Bộ ví dụ CVXPY (LP, QP, SVM, danh mục đầu tư)</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.cvxpy.org/" target="_blank" rel="noopener">CVXPY</a> — ngôn ngữ mô hình hoá Python cho bài toán lồi</li>
<li><a href="https://numpy.org/" target="_blank" rel="noopener">NumPy</a> — mảng &amp; đại số tuyến tính</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy CVXPY trên trình duyệt, không cần cài</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — bài toán tối ưu là gì, tập lồi &amp; hàm lồi (cả môn dựa trên đây).</li>
<li><strong>Mô hình hoá</strong> — nhận diện LP/QP/SOCP/SDP và viết chúng bằng CVXPY.</li>
<li><strong>Lý thuyết</strong> — đối ngẫu Lagrange và điều kiện KKT (vì sao một điểm là tối ưu).</li>
<li><strong>Thuật toán</strong> — gradient descent, Newton, interior-point, và SGD cho học máy.</li>
</ol></div>`,
  ]]);

const intro = doc('cvo201-0-1-overview', 'Course overview: Convex Optimization|||Tổng quan: Tối ưu lồi',
  'Tối ưu hoá là gì; vì sao "lồi" là ranh giới giữa bài toán giải được và bài toán khó; lộ trình: tập/hàm lồi → LP/QP/SOCP/SDP → đối ngẫu & KKT → thuật toán → ứng dụng học máy.',
  [[
    `<span class="eyebrow">CVO201 · Lesson 0.1 · Overview</span>
<h2>Convex Optimization</h2>
<p class="lead">Optimization is the science of <strong>choosing the best decision under constraints</strong>. This course studies the special class of <strong>convex</strong> problems, where a locally optimal solution is guaranteed to be <em>globally</em> optimal and reliable algorithms find it fast.</p>
<h3>Why "convex" is the dividing line</h3>
<p>Boyd &amp; Vandenberghe put it sharply: the real frontier in optimization is not linear vs. nonlinear, it is <strong>convex vs. non-convex</strong>. Convex problems can be solved to global optimality; general problems can trap an algorithm in a poor local minimum.</p>
<pre><code>General optimization problem:
  minimize    f0(x)
  subject to  fi(x) &lt;= 0,   i = 1..m
              hi(x) = 0,    i = 1..p
It is CONVEX when f0 and every fi are convex
and every hi is affine (linear + constant).
</code></pre>
<h3>Roadmap</h3>
<p>Convex sets &amp; functions -&gt; standard convex problems (LP, QP, SOCP, SDP) -&gt; Lagrange duality &amp; KKT conditions -&gt; unconstrained algorithms (gradient descent, Newton) -&gt; constrained algorithms (interior-point, projected gradient) -&gt; stochastic optimization &amp; SGD -&gt; applications in machine learning and signal processing. Bilingual, with worked math and CVXPY code.</p>`,
    `<span class="eyebrow">CVO201 · Bài 0.1 · Tổng quan</span>
<h2>Tối ưu lồi</h2>
<p class="lead">Tối ưu hoá là khoa học của việc <strong>chọn quyết định tốt nhất trong ràng buộc</strong>. Môn này học lớp bài toán <strong>lồi (convex)</strong> đặc biệt, nơi nghiệm tối ưu địa phương chắc chắn là tối ưu <em>toàn cục</em> và thuật toán đáng tin tìm ra nó nhanh.</p>
<h3>Vì sao "lồi" là ranh giới</h3>
<p>Boyd &amp; Vandenberghe nói thẳng: ranh giới thật trong tối ưu không phải tuyến tính hay phi tuyến, mà là <strong>lồi hay không lồi</strong>. Bài toán lồi giải được tới tối ưu toàn cục; bài toán tổng quát có thể kẹt thuật toán ở cực tiểu địa phương tồi.</p>
<pre><code>Bài toán tối ưu tổng quát:
  minimize    f0(x)
  subject to  fi(x) &lt;= 0,   i = 1..m
              hi(x) = 0,    i = 1..p
Nó LỒI khi f0 và mọi fi lồi,
và mọi hi affine (tuyến tính + hằng số).
</code></pre>
<h3>Lộ trình</h3>
<p>Tập lồi &amp; hàm lồi -&gt; bài toán lồi chuẩn (LP, QP, SOCP, SDP) -&gt; đối ngẫu Lagrange &amp; điều kiện KKT -&gt; thuật toán không ràng buộc (gradient descent, Newton) -&gt; thuật toán có ràng buộc (interior-point, projected gradient) -&gt; tối ưu ngẫu nhiên &amp; SGD -&gt; ứng dụng học máy và xử lý tín hiệu. Song ngữ, có toán mẫu và mã CVXPY.</p>`,
  ]]);

const c1 = doc('cvo201-1-1-intro', '1.1 — Optimization & the standard-form problem|||1.1 — Tối ưu & bài toán tối ưu chuẩn',
  'Biến quyết định, hàm mục tiêu, ràng buộc; bài toán tối ưu dạng chuẩn; miền khả thi, nghiệm tối ưu, tối ưu địa phương vs toàn cục; ví dụ mô hình hoá.',
  [[
    `<span class="eyebrow">CVO201 · Chapter 1 · Lesson 1.1</span>
<h2>Optimization &amp; the standard-form problem</h2>
<h3>The vocabulary</h3>
<ul>
<li><strong>Decision variable</strong> x — the quantity we get to choose (a vector in R^n).</li>
<li><strong>Objective</strong> f0(x) — the cost we minimize (or negate to maximize).</li>
<li><strong>Constraints</strong> — inequalities fi(x) &lt;= 0 and equalities hi(x) = 0 that x must satisfy.</li>
<li><strong>Feasible set</strong> — all x that satisfy every constraint. The <strong>optimal value</strong> is the lowest f0 over that set.</li>
</ul>
<h3>Local vs global</h3>
<p>A point is a <strong>local minimum</strong> if nothing nearby is better; it is a <strong>global minimum</strong> if nothing anywhere is better. The whole payoff of convexity (next chapters) is that for convex problems <em>every local minimum is global</em>.</p>
<pre><code>Modeling example (a diet problem):
  choose amounts x &gt;= 0 of foods
  minimize    cost = c^T x
  subject to  nutrition:  A x &gt;= b
              budget:     sum(x) &lt;= B
c = price per food, A = nutrients per food, b = daily needs.
</code></pre>
<div class="callout"><span class="badge">First skill</span> Most of the work is <strong>modeling</strong> — turning a real decision into variables, one objective, and constraints. Do this cleanly and the solver does the rest.</div>`,
    `<span class="eyebrow">CVO201 · Chương 1 · Bài 1.1</span>
<h2>Tối ưu &amp; bài toán tối ưu chuẩn</h2>
<h3>Bộ từ vựng</h3>
<ul>
<li><strong>Biến quyết định</strong> x — đại lượng ta được chọn (vector trong R^n).</li>
<li><strong>Hàm mục tiêu</strong> f0(x) — chi phí cần cực tiểu (hoặc đổi dấu để cực đại).</li>
<li><strong>Ràng buộc</strong> — bất đẳng thức fi(x) &lt;= 0 và đẳng thức hi(x) = 0 mà x phải thoả.</li>
<li><strong>Miền khả thi</strong> — mọi x thoả mọi ràng buộc. <strong>Giá trị tối ưu</strong> là f0 nhỏ nhất trên miền đó.</li>
</ul>
<h3>Địa phương vs toàn cục</h3>
<p>Một điểm là <strong>cực tiểu địa phương</strong> nếu không điểm lân cận nào tốt hơn; là <strong>cực tiểu toàn cục</strong> nếu không điểm nào ở đâu tốt hơn. Cái lợi lớn của tính lồi (các chương sau) là với bài toán lồi <em>mọi cực tiểu địa phương đều là toàn cục</em>.</p>
<pre><code>Ví dụ mô hình hoá (bài toán khẩu phần):
  chọn lượng x &gt;= 0 của các món ăn
  minimize    chi phí = c^T x
  subject to  dinh dưỡng:  A x &gt;= b
              ngân sách:   sum(x) &lt;= B
c = giá mỗi món, A = dinh dưỡng mỗi món, b = nhu cầu ngày.
</code></pre>
<div class="callout"><span class="badge">Kỹ năng đầu tiên</span> Phần lớn công việc là <strong>mô hình hoá</strong> — biến một quyết định thật thành biến, một mục tiêu, và ràng buộc. Làm gọn phần này thì solver lo phần còn lại.</div>`,
  ]]);

const c1q = quiz('cvo201-quiz-1', 'Quiz 1 — Standard form|||Quiz 1 — Dạng chuẩn', [
  { id: 'q1', question: 'Trong bài toán tối ưu chuẩn, "miền khả thi" là gì?', options: ['Tập mọi giá trị của hàm mục tiêu', 'Tập mọi x thoả TẤT CẢ ràng buộc', 'Tập nghiệm tối ưu duy nhất', 'Tập các biến đối ngẫu'], correctIndex: 1, explanation: 'Miền khả thi gồm mọi x thoả đồng thời mọi ràng buộc bất đẳng thức và đẳng thức.' },
  { id: 'q2', question: 'Lợi ích lớn nhất của bài toán LỒI so với bài toán tổng quát là?', options: ['Luôn có nghiệm dạng đóng', 'Mọi cực tiểu địa phương đều là toàn cục', 'Không cần ràng buộc', 'Giải được bằng tay'], correctIndex: 1, explanation: 'Với bài toán lồi, cực tiểu địa phương chính là cực tiểu toàn cục — nên thuật toán không kẹt ở nghiệm tồi.' },
  { id: 'q3', question: 'Để CỰC ĐẠI một hàm f0(x) bằng bộ giải cực tiểu, ta?', options: ['Bình phương f0', 'Cực tiểu hoá -f0(x)', 'Đảo dấu ràng buộc', 'Lấy nghịch đảo f0'], correctIndex: 1, explanation: 'maximize f0 tương đương minimize -f0; đó là quy ước dạng chuẩn.' },
]);

const c2 = doc('cvo201-2-1-convex-sets-functions', '2.1 — Convex sets & convex functions|||2.1 — Tập lồi & hàm lồi',
  'Tổ hợp lồi, tập lồi (nửa không gian, đa diện, hình cầu chuẩn); hàm lồi & bất đẳng thức Jensen; kiểm tra bằng đạo hàm bậc 1/2; toán tử bảo toàn tính lồi.',
  [[
    `<span class="eyebrow">CVO201 · Chapter 2 · Lesson 2.1</span>
<h2>Convex sets &amp; convex functions</h2>
<h3>Convex set</h3>
<p>A set C is <strong>convex</strong> if the line segment between any two of its points stays inside C: for x, y in C and t in [0,1], the point t x + (1-t) y is also in C. Examples: hyperplanes, halfspaces, norm balls, and <strong>polyhedra</strong> (intersections of halfspaces).</p>
<h3>Convex function</h3>
<pre><code>f is convex if, for all x, y and t in [0,1]:
  f( t x + (1-t) y )  &lt;=  t f(x) + (1-t) f(y)
(the chord lies above the graph = Jensen's inequality)

Tests:
  first-order:  f(y) &gt;= f(x) + grad_f(x)^T (y - x)
  second-order: Hessian  H(x)  is positive semidefinite
</code></pre>
<h3>Operations that preserve convexity</h3>
<ul>
<li>Nonnegative weighted sum of convex functions.</li>
<li>Composition with an affine map: f(A x + b).</li>
<li>Pointwise maximum of convex functions.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> You rarely prove convexity from scratch — you build a function from known convex pieces using rules that <strong>preserve</strong> convexity. That is the everyday skill.</div>`,
    `<span class="eyebrow">CVO201 · Chương 2 · Bài 2.1</span>
<h2>Tập lồi &amp; hàm lồi</h2>
<h3>Tập lồi</h3>
<p>Tập C là <strong>lồi</strong> nếu đoạn thẳng nối hai điểm bất kỳ của nó nằm trọn trong C: với x, y trong C và t trong [0,1], điểm t x + (1-t) y cũng thuộc C. Ví dụ: siêu phẳng, nửa không gian, hình cầu chuẩn, và <strong>đa diện</strong> (giao của các nửa không gian).</p>
<h3>Hàm lồi</h3>
<pre><code>f lồi nếu, với mọi x, y và t trong [0,1]:
  f( t x + (1-t) y )  &lt;=  t f(x) + (1-t) f(y)
(dây cung nằm trên đồ thị = bất đẳng thức Jensen)

Cách kiểm:
  bậc 1:  f(y) &gt;= f(x) + grad_f(x)^T (y - x)
  bậc 2:  ma trận Hessian H(x) nửa xác định dương
</code></pre>
<h3>Phép toán bảo toàn tính lồi</h3>
<ul>
<li>Tổng có trọng số không âm của các hàm lồi.</li>
<li>Hợp với ánh xạ affine: f(A x + b).</li>
<li>Lấy cực đại theo điểm của các hàm lồi.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Hiếm khi bạn chứng minh tính lồi từ đầu — bạn dựng hàm từ các mảnh lồi đã biết bằng những quy tắc <strong>bảo toàn</strong> tính lồi. Đó là kỹ năng dùng hằng ngày.</div>`,
  ]]);

const c2q = quiz('cvo201-quiz-2', 'Quiz 2 — Convex sets & functions|||Quiz 2 — Tập & hàm lồi', [
  { id: 'q1', question: 'Tập C là lồi khi?', options: ['Mọi điểm của C nằm trên một đường thẳng', 'Đoạn thẳng nối hai điểm bất kỳ của C nằm trọn trong C', 'C bị chặn', 'C có tâm đối xứng'], correctIndex: 1, explanation: 'Định nghĩa tập lồi: với x, y thuộc C thì t x + (1-t) y thuộc C với mọi t trong [0,1].' },
  { id: 'q2', question: 'Bất đẳng thức Jensen cho hàm lồi nói dây cung so với đồ thị thế nào?', options: ['Dây cung nằm dưới đồ thị', 'Dây cung nằm trên (hoặc trùng) đồ thị', 'Dây cung cắt đồ thị hai lần', 'Không liên quan'], correctIndex: 1, explanation: 'f(t x+(1-t)y) <= t f(x)+(1-t) f(y): dây cung nối hai điểm nằm trên đồ thị.' },
  { id: 'q3', question: 'Cách kiểm tính lồi bằng đạo hàm bậc 2 cho hàm khả vi hai lần là?', options: ['Gradient bằng 0', 'Hessian nửa xác định dương', 'Hessian âm', 'Đạo hàm bậc nhất hằng số'], correctIndex: 1, explanation: 'Hàm khả vi hai lần là lồi khi và chỉ khi Hessian nửa xác định dương trên miền.' },
]);

const c3 = doc('cvo201-3-1-lp-qp-socp-sdp', '3.1 — Convex problem classes: LP, QP, SOCP, SDP|||3.1 — Lớp bài toán lồi: LP, QP, SOCP, SDP',
  'Bốn lớp bài toán lồi chuẩn: tuyến tính (LP), toàn phương (QP), nón bậc hai (SOCP), nửa xác định (SDP); dạng tổng quát, quan hệ bao hàm; mô hình bằng CVXPY.',
  [[
    `<span class="eyebrow">CVO201 · Chapter 3 · Lesson 3.1</span>
<h2>Convex problem classes: LP, QP, SOCP, SDP</h2>
<p>Most convex problems fall into a hierarchy of named classes. Each is a special case of the next.</p>
<pre><code>LP  (Linear Program):
  minimize c^T x   subject to  A x &lt;= b

QP  (Quadratic Program):
  minimize (1/2) x^T P x + q^T x   s.t. A x &lt;= b   (P psd)

SOCP (Second-Order Cone Program):
  minimize c^T x   s.t.  norm(Ai x + bi) &lt;= ci^T x + di

SDP (Semidefinite Program):
  minimize c^T x   s.t.  x1 F1 + ... + xn Fn + G  is psd
</code></pre>
<p>Nesting: <strong>LP &lt;= QP &lt;= SOCP &lt;= SDP</strong> — a solver for the bigger class handles the smaller ones.</p>
<pre><code># CVXPY: a tiny LP
import cvxpy as cp
x = cp.Variable(2)
prob = cp.Problem(cp.Minimize(x[0] + x[1]),
                  [x &gt;= 0, x[0] + 2*x[1] &gt;= 3])
prob.solve()
print(prob.value, x.value)
</code></pre>
<div class="callout"><span class="badge">Recognise, then model</span> Naming the class tells you which solver runs and how fast. CVXPY figures the class out for you if you write the problem from convex atoms.</div>`,
    `<span class="eyebrow">CVO201 · Chương 3 · Bài 3.1</span>
<h2>Lớp bài toán lồi: LP, QP, SOCP, SDP</h2>
<p>Phần lớn bài toán lồi rơi vào một hệ phân lớp có tên. Mỗi lớp là trường hợp riêng của lớp kế tiếp.</p>
<pre><code>LP  (Quy hoạch tuyến tính):
  minimize c^T x   subject to  A x &lt;= b

QP  (Quy hoạch toàn phương):
  minimize (1/2) x^T P x + q^T x   s.t. A x &lt;= b   (P psd)

SOCP (Quy hoạch nón bậc hai):
  minimize c^T x   s.t.  norm(Ai x + bi) &lt;= ci^T x + di

SDP (Quy hoạch nửa xác định):
  minimize c^T x   s.t.  x1 F1 + ... + xn Fn + G  nửa xác định dương
</code></pre>
<p>Bao hàm: <strong>LP &lt;= QP &lt;= SOCP &lt;= SDP</strong> — bộ giải cho lớp lớn hơn xử lý được lớp nhỏ hơn.</p>
<pre><code># CVXPY: một LP nhỏ
import cvxpy as cp
x = cp.Variable(2)
prob = cp.Problem(cp.Minimize(x[0] + x[1]),
                  [x &gt;= 0, x[0] + 2*x[1] &gt;= 3])
prob.solve()
print(prob.value, x.value)
</code></pre>
<div class="callout"><span class="badge">Nhận diện rồi mô hình hoá</span> Gọi đúng tên lớp cho biết solver nào chạy và nhanh cỡ nào. CVXPY tự suy ra lớp nếu bạn viết bài toán từ các "nguyên tử" lồi.</div>`,
  ]]);

const c3q = quiz('cvo201-quiz-3', 'Quiz 3 — Problem classes|||Quiz 3 — Lớp bài toán', [
  { id: 'q1', question: 'Bài toán "minimize c^T x subject to A x <= b" thuộc lớp nào?', options: ['LP (quy hoạch tuyến tính)', 'SDP', 'Bài toán phi lồi', 'SOCP'], correctIndex: 0, explanation: 'Mục tiêu và ràng buộc đều tuyến tính (affine) → đó là quy hoạch tuyến tính LP.' },
  { id: 'q2', question: 'Quan hệ bao hàm đúng giữa các lớp là?', options: ['SDP <= SOCP <= QP <= LP', 'LP <= QP <= SOCP <= SDP', 'QP <= LP <= SDP <= SOCP', 'Chúng độc lập, không bao nhau'], correctIndex: 1, explanation: 'Mỗi lớp là trường hợp riêng của lớp sau: LP là QP đặc biệt, QP là SOCP đặc biệt, SOCP là SDP đặc biệt.' },
  { id: 'q3', question: 'Trong QP "minimize (1/2) x^T P x + q^T x", để bài toán LỒI thì P phải?', options: ['Khả nghịch', 'Nửa xác định dương (psd)', 'Đường chéo', 'Âm xác định'], correctIndex: 1, explanation: 'Hàm toàn phương lồi khi ma trận P nửa xác định dương.' },
]);

const c4 = doc('cvo201-4-1-duality-kkt', '4.1 — Lagrange duality & KKT conditions|||4.1 — Đối ngẫu Lagrange & điều kiện KKT',
  'Hàm Lagrange, hàm đối ngẫu, bài toán đối ngẫu; đối ngẫu yếu/mạnh & khe đối ngẫu; điều kiện Slater; bốn điều kiện KKT và ý nghĩa tối ưu.',
  [[
    `<span class="eyebrow">CVO201 · Chapter 4 · Lesson 4.1</span>
<h2>Lagrange duality &amp; KKT conditions</h2>
<h3>The Lagrangian</h3>
<p>Attach a multiplier to each constraint and fold them into the objective:</p>
<pre><code>Lagrangian:
  L(x, lam, nu) = f0(x) + sum_i lam_i fi(x) + sum_j nu_j hj(x)
  with  lam_i &gt;= 0

Dual function: g(lam, nu) = inf over x of L(x, lam, nu)
  -&gt; always CONCAVE, and g(lam,nu) &lt;= p*  (p* = optimal value)

Dual problem:  maximize g(lam, nu)  subject to lam &gt;= 0
</code></pre>
<h3>Weak vs strong duality</h3>
<p>The best dual value d* always satisfies <strong>d* &lt;= p*</strong> (weak duality); the gap p* - d* is the <strong>duality gap</strong>. For convex problems that meet <strong>Slater's condition</strong> (a strictly feasible point exists) the gap is zero — <strong>strong duality</strong> holds.</p>
<h3>KKT conditions</h3>
<pre><code>At an optimum (with strong duality), x*, lam*, nu* satisfy:
  1. primal feasible:   fi(x*) &lt;= 0,  hj(x*) = 0
  2. dual feasible:     lam_i* &gt;= 0
  3. complementary:     lam_i* fi(x*) = 0
  4. stationarity:      grad f0 + sum lam_i grad fi + sum nu_j grad hj = 0
</code></pre>
<div class="callout"><span class="badge">Why KKT matters</span> For a convex problem, the KKT conditions are <strong>necessary and sufficient</strong> for optimality — they are how solvers certify an answer.</div>`,
    `<span class="eyebrow">CVO201 · Chương 4 · Bài 4.1</span>
<h2>Đối ngẫu Lagrange &amp; điều kiện KKT</h2>
<h3>Hàm Lagrange</h3>
<p>Gắn một nhân tử cho mỗi ràng buộc và gộp vào hàm mục tiêu:</p>
<pre><code>Hàm Lagrange:
  L(x, lam, nu) = f0(x) + sum_i lam_i fi(x) + sum_j nu_j hj(x)
  với  lam_i &gt;= 0

Hàm đối ngẫu: g(lam, nu) = inf theo x của L(x, lam, nu)
  -&gt; luôn LÕM, và g(lam,nu) &lt;= p*  (p* = giá trị tối ưu)

Bài toán đối ngẫu:  maximize g(lam, nu)  subject to lam &gt;= 0
</code></pre>
<h3>Đối ngẫu yếu vs mạnh</h3>
<p>Giá trị đối ngẫu tốt nhất d* luôn thoả <strong>d* &lt;= p*</strong> (đối ngẫu yếu); hiệu p* - d* là <strong>khe đối ngẫu</strong>. Với bài toán lồi thoả <strong>điều kiện Slater</strong> (tồn tại điểm khả thi ngặt) thì khe bằng 0 — <strong>đối ngẫu mạnh</strong> đúng.</p>
<h3>Điều kiện KKT</h3>
<pre><code>Tại tối ưu (có đối ngẫu mạnh), x*, lam*, nu* thoả:
  1. khả thi gốc:      fi(x*) &lt;= 0,  hj(x*) = 0
  2. khả thi đối ngẫu: lam_i* &gt;= 0
  3. bù nhau:          lam_i* fi(x*) = 0
  4. dừng:             grad f0 + sum lam_i grad fi + sum nu_j grad hj = 0
</code></pre>
<div class="callout"><span class="badge">Vì sao KKT quan trọng</span> Với bài toán lồi, điều kiện KKT là <strong>cần và đủ</strong> cho tối ưu — đó là cách solver chứng nhận một đáp án.</div>`,
  ]]);

const c4q = quiz('cvo201-quiz-4', 'Quiz 4 — Duality & KKT|||Quiz 4 — Đối ngẫu & KKT', [
  { id: 'q1', question: 'Đối ngẫu yếu (weak duality) khẳng định điều gì?', options: ['d* = p* luôn luôn', 'd* <= p* luôn luôn', 'd* >= p* luôn luôn', 'Không có quan hệ nào'], correctIndex: 1, explanation: 'Giá trị đối ngẫu tối ưu d* luôn không vượt giá trị gốc tối ưu p*; hiệu p*-d* là khe đối ngẫu.' },
  { id: 'q2', question: 'Điều kiện Slater (điểm khả thi ngặt tồn tại) trong bài toán lồi bảo đảm?', options: ['Bài toán vô nghiệm', 'Đối ngẫu mạnh (khe đối ngẫu = 0)', 'Hàm mục tiêu tuyến tính', 'Không cần ràng buộc'], correctIndex: 1, explanation: 'Slater là điều kiện đủ cho đối ngẫu mạnh: khi đó d* = p*.' },
  { id: 'q3', question: 'Điều kiện "bù nhau" (complementary slackness) của KKT là?', options: ['grad f0 = 0', 'lam_i * fi(x*) = 0 với mỗi i', 'lam_i < 0', 'hj(x*) > 0'], correctIndex: 1, explanation: 'Với mỗi ràng buộc: hoặc nhân tử lam_i = 0, hoặc ràng buộc chạm biên fi(x*) = 0.' },
]);

const c5 = doc('cvo201-5-1-unconstrained', '5.1 — Unconstrained algorithms: gradient descent & Newton|||5.1 — Thuật toán không ràng buộc: gradient descent & Newton',
  'Điều kiện tối ưu grad = 0; hướng giảm & tìm bước (backtracking line search); gradient descent và tốc độ hội tụ; phương pháp Newton dùng Hessian; đánh đổi.',
  [[
    `<span class="eyebrow">CVO201 · Chapter 5 · Lesson 5.1</span>
<h2>Unconstrained algorithms: gradient descent &amp; Newton</h2>
<h3>Optimality &amp; descent</h3>
<p>For a smooth convex f, x* is optimal iff <strong>grad f(x*) = 0</strong>. Iterative methods pick a <strong>descent direction</strong> and a <strong>step size</strong> t (often via <em>backtracking line search</em>) and move.</p>
<h3>Gradient descent</h3>
<pre><code>repeat:
  d = - grad f(x)              # steepest descent direction
  choose step t &gt; 0 (line search)
  x = x + t * d
until  norm(grad f(x)) &lt;= tol
</code></pre>
<p>Simple and cheap per step, but can zig-zag and converge slowly on ill-conditioned problems.</p>
<h3>Newton's method</h3>
<pre><code>repeat:
  solve   H(x) * dnt = - grad f(x)   # H = Hessian
  x = x + t * dnt
Uses curvature -&gt; very fast (quadratic) near the optimum,
but each step costs a Hessian solve (O(n^3)).
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> Gradient descent: cheap steps, many of them. Newton: expensive steps, few of them. Real solvers blend the two (quasi-Newton, e.g. BFGS).</div>`,
    `<span class="eyebrow">CVO201 · Chương 5 · Bài 5.1</span>
<h2>Thuật toán không ràng buộc: gradient descent &amp; Newton</h2>
<h3>Điều kiện tối ưu &amp; hướng giảm</h3>
<p>Với f lồi trơn, x* là tối ưu khi và chỉ khi <strong>grad f(x*) = 0</strong>. Phương pháp lặp chọn một <strong>hướng giảm</strong> và một <strong>bước</strong> t (thường bằng <em>backtracking line search</em>) rồi di chuyển.</p>
<h3>Gradient descent</h3>
<pre><code>lặp:
  d = - grad f(x)              # hướng giảm dốc nhất
  chọn bước t &gt; 0 (line search)
  x = x + t * d
đến khi  norm(grad f(x)) &lt;= tol
</code></pre>
<p>Đơn giản và rẻ mỗi bước, nhưng có thể lượn zic-zac và hội tụ chậm khi bài toán bị "méo" (điều kiện xấu).</p>
<h3>Phương pháp Newton</h3>
<pre><code>lặp:
  giải   H(x) * dnt = - grad f(x)   # H = Hessian
  x = x + t * dnt
Dùng độ cong -&gt; rất nhanh (bậc hai) gần tối ưu,
nhưng mỗi bước tốn một lần giải Hessian (O(n^3)).
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> Gradient descent: bước rẻ, nhiều bước. Newton: bước đắt, ít bước. Solver thật trộn cả hai (quasi-Newton, vd BFGS).</div>`,
  ]]);

const c5q = quiz('cvo201-quiz-5', 'Quiz 5 — Unconstrained methods|||Quiz 5 — Không ràng buộc', [
  { id: 'q1', question: 'Với hàm lồi trơn f, điều kiện tối ưu (không ràng buộc) là?', options: ['f(x) = 0', 'grad f(x*) = 0', 'Hessian = 0', 'x* = 0'], correctIndex: 1, explanation: 'Điểm dừng gradient bằng 0; với hàm lồi đó cũng là cực tiểu toàn cục.' },
  { id: 'q2', question: 'Gradient descent chọn hướng đi mỗi bước là?', options: ['+ grad f(x)', '- grad f(x)', 'Hessian nghịch đảo', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'Hướng giảm dốc nhất là ngược chiều gradient: d = - grad f(x).' },
  { id: 'q3', question: 'So với gradient descent, phương pháp Newton?', options: ['Bước rẻ hơn nhưng cần nhiều bước hơn', 'Dùng Hessian, hội tụ nhanh gần tối ưu nhưng mỗi bước đắt', 'Không cần đạo hàm', 'Chỉ chạy cho bài toán tuyến tính'], correctIndex: 1, explanation: 'Newton dùng độ cong (Hessian) → hội tụ bậc hai gần nghiệm, nhưng mỗi bước tốn O(n^3) để giải hệ.' },
]);

const c6 = doc('cvo201-6-1-constrained', '6.1 — Constrained algorithms: interior-point & projected gradient|||6.1 — Thuật toán có ràng buộc: interior-point & projected gradient',
  'Hàm chắn logarithmic barrier; phương pháp interior-point (central path); projected gradient descent cho ràng buộc đơn giản; toán tử chiếu; ý tưởng ADMM.',
  [[
    `<span class="eyebrow">CVO201 · Chapter 6 · Lesson 6.1</span>
<h2>Constrained algorithms: interior-point &amp; projected gradient</h2>
<h3>Interior-point (barrier) method</h3>
<p>Turn inequality constraints into a smooth penalty that blows up at the boundary, then solve a sequence of unconstrained problems by Newton's method.</p>
<pre><code>Log-barrier for fi(x) &lt;= 0:
  minimize  f0(x) + (1/s) * sum_i ( - log( -fi(x) ) )
Increase s each round -&gt; the solution traces the
"central path" toward the true optimum.
</code></pre>
<p>This is the engine inside modern LP/QP/SOCP/SDP solvers — polynomial-time and very reliable.</p>
<h3>Projected gradient descent</h3>
<pre><code>When the feasible set C has an easy projection:
  y = x - t * grad f(x)       # ordinary gradient step
  x = project_C(y)            # snap back into C
Great when C is a box, a ball, or the simplex.
</code></pre>
<p>Related first-order methods (proximal gradient, <strong>ADMM</strong>) split a hard problem into pieces each of which is easy to handle — the workhorses for large-scale and machine-learning problems.</p>
<div class="callout"><span class="badge">Pick by structure</span> Interior-point for medium, high-accuracy problems; projected/proximal &amp; ADMM when the data is huge and the constraint set projects cheaply.</div>`,
    `<span class="eyebrow">CVO201 · Chương 6 · Bài 6.1</span>
<h2>Thuật toán có ràng buộc: interior-point &amp; projected gradient</h2>
<h3>Phương pháp interior-point (hàm chắn)</h3>
<p>Biến ràng buộc bất đẳng thức thành một phạt trơn tăng vọt ở biên, rồi giải một dãy bài toán không ràng buộc bằng phương pháp Newton.</p>
<pre><code>Hàm chắn log cho fi(x) &lt;= 0:
  minimize  f0(x) + (1/s) * sum_i ( - log( -fi(x) ) )
Tăng s mỗi vòng -&gt; nghiệm men theo
"đường trung tâm" (central path) tới tối ưu thật.
</code></pre>
<p>Đây là động cơ bên trong các solver LP/QP/SOCP/SDP hiện đại — thời gian đa thức và rất đáng tin.</p>
<h3>Projected gradient descent</h3>
<pre><code>Khi miền khả thi C có phép chiếu dễ:
  y = x - t * grad f(x)       # bước gradient thường
  x = project_C(y)            # kéo về trong C
Rất hợp khi C là hộp, hình cầu, hoặc simplex.
</code></pre>
<p>Các phương pháp bậc nhất liên quan (proximal gradient, <strong>ADMM</strong>) tách bài toán khó thành từng mảnh dễ xử lý — chủ lực cho bài toán quy mô lớn và học máy.</p>
<div class="callout"><span class="badge">Chọn theo cấu trúc</span> Interior-point cho bài toán vừa, cần độ chính xác cao; projected/proximal &amp; ADMM khi dữ liệu khổng lồ và miền ràng buộc chiếu rẻ.</div>`,
  ]]);

const c6q = quiz('cvo201-quiz-6', 'Quiz 6 — Constrained methods|||Quiz 6 — Có ràng buộc', [
  { id: 'q1', question: 'Phương pháp interior-point xử lý ràng buộc fi(x) <= 0 bằng cách?', options: ['Bỏ qua ràng buộc', 'Thêm hàm chắn log (barrier) tăng vọt ở biên', 'Chiếu về biên mỗi bước', 'Đổi sang bài toán đối ngẫu'], correctIndex: 1, explanation: 'Barrier method cộng - (1/s) log(-fi(x)) vào mục tiêu, giải dãy bài toán không ràng buộc, tăng s dần theo central path.' },
  { id: 'q2', question: 'Projected gradient descent thêm bước nào sau bước gradient thường?', options: ['Nhân với Hessian', 'Chiếu điểm về lại miền khả thi C', 'Đảo dấu gradient', 'Chuẩn hoá về 1'], correctIndex: 1, explanation: 'Sau y = x - t grad f(x), ta chiếu y về C: x = project_C(y). Hiệu quả khi phép chiếu rẻ (hộp, cầu, simplex).' },
  { id: 'q3', question: 'Khi dữ liệu rất lớn và miền ràng buộc chiếu rẻ, phương pháp nào thường phù hợp hơn?', options: ['Newton với Hessian đầy đủ', 'Phương pháp bậc nhất: projected/proximal gradient, ADMM', 'Giải trực tiếp bằng nghịch đảo ma trận', 'Vét cạn'], correctIndex: 1, explanation: 'Bài toán quy mô lớn ưu tiên phương pháp bậc nhất (projected/proximal, ADMM) vì mỗi bước rẻ, tránh giải Hessian O(n^3).' },
]);

const c7 = doc('cvo201-7-1-stochastic-sgd', '7.1 — Stochastic optimization & SGD for ML|||7.1 — Tối ưu ngẫu nhiên & SGD cho học máy',
  'Bài toán rủi ro thực nghiệm (ERM); vì sao gradient trên toàn tập tốn kém; SGD & mini-batch; lịch trình bước học, momentum, Adam; đánh đổi phương sai/tốc độ.',
  [[
    `<span class="eyebrow">CVO201 · Chapter 7 · Lesson 7.1</span>
<h2>Stochastic optimization &amp; SGD for machine learning</h2>
<h3>Empirical risk minimization</h3>
<p>Training a model minimizes an average loss over N data points:</p>
<pre><code>minimize  F(w) = (1/N) * sum_{i=1..N} loss_i(w)
Full gradient  grad F(w) = (1/N) sum grad loss_i(w)
costs one pass over ALL N points -&gt; expensive when N is huge.
</code></pre>
<h3>Stochastic gradient descent (SGD)</h3>
<pre><code>repeat:
  pick a random sample i (or a mini-batch B)
  g = grad loss_i(w)          # cheap, noisy estimate of grad F
  w = w - t * g
</code></pre>
<p>Each step uses one (or a few) examples: much cheaper, and the noise even helps escape flat regions. The price is a <strong>noisy path</strong>, so the step size t (learning rate) is usually <strong>decayed</strong> over time.</p>
<h3>Practical variants</h3>
<ul>
<li><strong>Mini-batch SGD</strong> — average over a small batch to cut variance.</li>
<li><strong>Momentum</strong> — accumulate past gradients to smooth the path.</li>
<li><strong>Adam</strong> — per-parameter adaptive step sizes; the default for deep nets.</li>
</ul>
<div class="callout"><span class="badge">Convex vs deep</span> SGD's theory is cleanest on convex losses (logistic/linear), but the same algorithm trains non-convex neural networks — this course gives you the convex foundation it rests on.</div>`,
    `<span class="eyebrow">CVO201 · Chương 7 · Bài 7.1</span>
<h2>Tối ưu ngẫu nhiên &amp; SGD cho học máy</h2>
<h3>Cực tiểu rủi ro thực nghiệm</h3>
<p>Huấn luyện mô hình là cực tiểu mất mát trung bình trên N điểm dữ liệu:</p>
<pre><code>minimize  F(w) = (1/N) * sum_{i=1..N} loss_i(w)
Gradient toàn phần  grad F(w) = (1/N) sum grad loss_i(w)
tốn một lượt qua TOÀN BỘ N điểm -&gt; đắt khi N lớn.
</code></pre>
<h3>Gradient descent ngẫu nhiên (SGD)</h3>
<pre><code>lặp:
  chọn ngẫu nhiên mẫu i (hoặc mini-batch B)
  g = grad loss_i(w)          # ước lượng rẻ, có nhiễu của grad F
  w = w - t * g
</code></pre>
<p>Mỗi bước dùng một (hoặc vài) mẫu: rẻ hơn nhiều, và nhiễu còn giúp thoát vùng phẳng. Cái giá là <strong>đường đi có nhiễu</strong>, nên bước t (learning rate) thường được <strong>giảm dần</strong> theo thời gian.</p>
<h3>Biến thể thực dụng</h3>
<ul>
<li><strong>Mini-batch SGD</strong> — lấy trung bình trên một batch nhỏ để giảm phương sai.</li>
<li><strong>Momentum</strong> — tích luỹ gradient quá khứ để làm mượt đường đi.</li>
<li><strong>Adam</strong> — bước học thích nghi theo từng tham số; mặc định cho mạng sâu.</li>
</ul>
<div class="callout"><span class="badge">Lồi vs sâu</span> Lý thuyết SGD sạch nhất trên mất mát lồi (logistic/tuyến tính), nhưng cùng thuật toán đó huấn luyện mạng nơ-ron không lồi — môn này cho bạn nền lồi mà nó dựa trên.</div>`,
  ]]);

const c7q = quiz('cvo201-quiz-7', 'Quiz 7 — Stochastic optimization|||Quiz 7 — Tối ưu ngẫu nhiên', [
  { id: 'q1', question: 'Vì sao SGD dùng gradient trên một mẫu (hoặc mini-batch) thay vì toàn tập?', options: ['Vì nó chính xác hơn', 'Vì gradient toàn phần tốn một lượt qua toàn bộ N điểm, quá đắt khi N lớn', 'Vì không tính được gradient toàn phần', 'Vì hàm mất mát không lồi'], correctIndex: 1, explanation: 'grad F trên toàn bộ N mẫu tốn một epoch mỗi bước; SGD ước lượng rẻ bằng một/mini-batch mẫu.' },
  { id: 'q2', question: 'Vì đường đi của SGD có nhiễu, bước học (learning rate) thường được?', options: ['Giữ cố định mãi mãi', 'Giảm dần theo thời gian', 'Tăng dần', 'Đặt bằng 0'], correctIndex: 1, explanation: 'Learning rate giảm dần giúp bù nhiễu và cho SGD hội tụ ổn định.' },
  { id: 'q3', question: 'Biến thể nào tích luỹ gradient quá khứ để làm mượt đường đi?', options: ['Mini-batch', 'Momentum', 'Chiếu (projection)', 'Barrier'], correctIndex: 1, explanation: 'Momentum cộng dồn hướng các bước trước để giảm dao động và tăng tốc theo hướng ổn định.' },
]);

const c8 = doc('cvo201-8-1-applications', '8.1 — Applications: regression, SVM, ML & signal processing|||8.1 — Ứng dụng: hồi quy, SVM, học máy & xử lý tín hiệu',
  'Hồi quy bình phương nhỏ nhất & Ridge/Lasso; SVM lề mềm là QP; regularization; ứng dụng xử lý tín hiệu (khử nhiễu total-variation, nén cảm biến); mã CVXPY.',
  [[
    `<span class="eyebrow">CVO201 · Chapter 8 · Lesson 8.1</span>
<h2>Applications: regression, SVM, ML &amp; signal processing</h2>
<h3>Regression as convex optimization</h3>
<pre><code>Least squares:  minimize  norm(A w - b)^2
Ridge (L2):     minimize  norm(A w - b)^2 + lam * norm(w)^2
Lasso (L1):     minimize  norm(A w - b)^2 + lam * norm(w, 1)
L1 drives weights to exactly zero -&gt; feature selection.
</code></pre>
<h3>Support Vector Machine (a QP)</h3>
<pre><code>Soft-margin SVM:
  minimize  (1/2) norm(w)^2 + C * sum_i xi_i
  subject to  y_i ( w^T x_i + b ) &gt;= 1 - xi_i,   xi_i &gt;= 0
This is a Quadratic Program - solved to global optimality.
</code></pre>
<pre><code># CVXPY: ridge regression
import cvxpy as cp
w = cp.Variable(n)
lam = 0.1
cost = cp.sum_squares(A @ w - b) + lam * cp.sum_squares(w)
cp.Problem(cp.Minimize(cost)).solve()
</code></pre>
<h3>Signal processing</h3>
<p>Total-variation denoising, compressed sensing (recover a sparse signal from few measurements via L1), and filter design are all convex programs. Convexity is why these methods come with guarantees, not just heuristics.</p>
<div class="callout"><span class="badge">The payoff</span> Regularization (Ridge/Lasso), SVMs, and sparse recovery are convex — model them once, and a solver returns the global optimum every time.</div>`,
    `<span class="eyebrow">CVO201 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng: hồi quy, SVM, học máy &amp; xử lý tín hiệu</h2>
<h3>Hồi quy như một bài toán lồi</h3>
<pre><code>Bình phương nhỏ nhất:  minimize  norm(A w - b)^2
Ridge (L2):            minimize  norm(A w - b)^2 + lam * norm(w)^2
Lasso (L1):            minimize  norm(A w - b)^2 + lam * norm(w, 1)
L1 ép trọng số về đúng 0 -&gt; chọn đặc trưng (feature selection).
</code></pre>
<h3>Máy vector hỗ trợ SVM (là một QP)</h3>
<pre><code>SVM lề mềm:
  minimize  (1/2) norm(w)^2 + C * sum_i xi_i
  subject to  y_i ( w^T x_i + b ) &gt;= 1 - xi_i,   xi_i &gt;= 0
Đây là một Quy hoạch toàn phương - giải tới tối ưu toàn cục.
</code></pre>
<pre><code># CVXPY: hồi quy ridge
import cvxpy as cp
w = cp.Variable(n)
lam = 0.1
cost = cp.sum_squares(A @ w - b) + lam * cp.sum_squares(w)
cp.Problem(cp.Minimize(cost)).solve()
</code></pre>
<h3>Xử lý tín hiệu</h3>
<p>Khử nhiễu total-variation, nén cảm biến (khôi phục tín hiệu thưa từ ít phép đo qua L1), và thiết kế bộ lọc đều là bài toán lồi. Chính tính lồi khiến các phương pháp này có bảo đảm, không chỉ là heuristic.</p>
<div class="callout"><span class="badge">Thành quả</span> Regularization (Ridge/Lasso), SVM, và khôi phục thưa đều lồi — mô hình hoá một lần, solver trả về tối ưu toàn cục mỗi lần.</div>`,
  ]]);

const c8q = quiz('cvo201-quiz-8', 'Quiz 8 — Applications|||Quiz 8 — Ứng dụng', [
  { id: 'q1', question: 'So với Ridge (L2), phạt Lasso (L1) có đặc điểm nổi bật là?', options: ['Làm trọng số lớn hơn', 'Ép nhiều trọng số về đúng 0 → chọn đặc trưng', 'Không đổi nghiệm', 'Chỉ dùng cho phân loại'], correctIndex: 1, explanation: 'Chuẩn L1 tạo nghiệm thưa: nhiều hệ số bằng đúng 0, nên Lasso vừa hồi quy vừa chọn đặc trưng.' },
  { id: 'q2', question: 'Bài toán SVM lề mềm thuộc lớp tối ưu nào?', options: ['LP tuyến tính', 'QP (quy hoạch toàn phương)', 'SDP', 'Bài toán không lồi'], correctIndex: 1, explanation: 'Mục tiêu có (1/2) norm(w)^2 (toàn phương) với ràng buộc tuyến tính → là QP, giải tới tối ưu toàn cục.' },
  { id: 'q3', question: 'Vì sao nén cảm biến (compressed sensing) dùng chuẩn L1?', options: ['Vì L1 nhanh hơn L2', 'Vì L1 khuyến khích nghiệm thưa, hợp với tín hiệu ít thành phần khác 0', 'Vì L1 luôn cho nghiệm dạng đóng', 'Vì tín hiệu luôn dày đặc'], correctIndex: 1, explanation: 'Tối thiểu L1 (lồi) thúc đẩy nghiệm thưa, cho phép khôi phục tín hiệu thưa từ ít phép đo.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CVO201',
    slug: 'cvo201-convex-optimization',
    title: 'Convex Optimization',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CVO201.webp',
    shortDescription: 'Convex optimization end to end — convex sets & functions, standard problems (LP/QP/SOCP/SDP), Lagrange duality & KKT, gradient/Newton & interior-point methods, SGD, and ML applications (regression, SVM). Bilingual, with worked math & CVXPY code.|||Tối ưu lồi trọn vẹn — tập & hàm lồi, bài toán chuẩn (LP/QP/SOCP/SDP), đối ngẫu Lagrange & KKT, gradient/Newton & interior-point, SGD, ứng dụng học máy (hồi quy, SVM). Song ngữ, có toán mẫu & mã CVXPY.',
    description: 'Môn <strong>CVO201 — Convex Optimization</strong> (Tối ưu lồi, kỳ 3, ngành Khoa học Máy tính) dạy lớp bài toán tối ưu <strong>lồi</strong> — nơi cực tiểu địa phương là toàn cục và thuật toán tìm nghiệm đáng tin. Từ <strong>bài toán chuẩn &amp; tập/hàm lồi</strong> → <strong>LP, QP, SOCP, SDP</strong> → <strong>đối ngẫu Lagrange &amp; KKT</strong> → <strong>thuật toán không &amp; có ràng buộc</strong> (gradient descent, Newton, interior-point, projected gradient) → <strong>SGD cho học máy</strong> → <strong>ứng dụng</strong> (hồi quy Ridge/Lasso, SVM, xử lý tín hiệu). Bám Boyd &amp; Vandenberghe + Stanford EE364a và Nocedal &amp; Wright, song ngữ, có ví dụ toán và mã CVXPY, quiz mỗi chương.',
    whatYouLearn: 'Dựng bài toán tối ưu dạng chuẩn; nhận diện &amp; kiểm tập lồi, hàm lồi (Jensen, Hessian psd); mô hình hoá LP/QP/SOCP/SDP bằng CVXPY; xây hàm Lagrange, hàm đối ngẫu, đối ngẫu yếu/mạnh &amp; điều kiện KKT; gradient descent &amp; Newton; interior-point (barrier) &amp; projected gradient; SGD/mini-batch/momentum/Adam; hồi quy bình phương nhỏ nhất, Ridge, Lasso, SVM lề mềm, và bài toán xử lý tín hiệu lồi.',
    requirements: 'Đại số tuyến tính (vector, ma trận, chuẩn, trị riêng), giải tích nhiều biến (gradient, Hessian), và Python cơ bản. Nên cài CVXPY + NumPy hoặc dùng Google Colab.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách Boyd & Vandenberghe, Nocedal & Wright; Stanford EE364a; CVXPY; YouTube; công cụ; lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tối ưu là gì, vì sao "lồi" là ranh giới, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Bài toán tối ưu chuẩn|||Chapter 1 — Standard-form problem', description: 'Biến, mục tiêu, ràng buộc; miền khả thi; địa phương vs toàn cục.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tập lồi & hàm lồi|||Chapter 2 — Convex sets & functions', description: 'Tổ hợp lồi, Jensen, kiểm Hessian, phép toán bảo toàn tính lồi.', lessons: [c2, c2q] },
    { title: 'Chương 3 — LP, QP, SOCP, SDP|||Chapter 3 — Problem classes', description: 'Bốn lớp bài toán lồi chuẩn, bao hàm, mô hình CVXPY.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đối ngẫu & KKT|||Chapter 4 — Duality & KKT', description: 'Lagrange, hàm đối ngẫu, Slater, bốn điều kiện KKT.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thuật toán không ràng buộc|||Chapter 5 — Unconstrained', description: 'Gradient descent, line search, Newton, đánh đổi.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thuật toán có ràng buộc|||Chapter 6 — Constrained', description: 'Interior-point (barrier), projected gradient, ADMM.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tối ưu ngẫu nhiên & SGD|||Chapter 7 — Stochastic & SGD', description: 'ERM, SGD/mini-batch, learning rate, momentum, Adam.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng học máy & tín hiệu|||Chapter 8 — Applications', description: 'Hồi quy Ridge/Lasso, SVM (QP), xử lý tín hiệu, CVXPY.', lessons: [c8, c8q] },
  ],
};
