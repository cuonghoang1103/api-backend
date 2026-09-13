/**
 * MAO303 — Optimization (Tối ưu hoá). Ngành Robotics & AI, FPTU — Kỳ 3.
 * Khung chất lượng, song ngữ (VI + EN), 8 chương. Bám sách chuẩn quốc tế:
 * Boyd & Vandenberghe "Convex Optimization" (+ Stanford EE364a),
 * Nocedal & Wright "Numerical Optimization"; công cụ scipy.optimize.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong HTML; "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mao303-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Boyd, Nocedal), khoá học mở, YouTube, công cụ (scipy/cvxpy), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">MAO303 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Optimization</strong> for Robotics &amp; AI — problem formulation, convexity, gradient and Newton methods, duality, linear/convex programming and applications — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks (the standard references)</h3>
<ul>
<li><a href="https://web.stanford.edu/~boyd/cvxbook/" target="_blank" rel="noopener"><em>Convex Optimization</em> — Boyd &amp; Vandenberghe</a> (free PDF, the reference for this course)</li>
<li><a href="https://www.math.uci.edu/~qnie/Publications/NumericalOptimization.pdf" target="_blank" rel="noopener"><em>Numerical Optimization</em> — Nocedal &amp; Wright</a> (gradient, Newton, quasi-Newton)</li>
</ul>
<h3>🌐 Free courses &amp; docs</h3>
<ul>
<li><a href="https://web.stanford.edu/class/ee364a/" target="_blank" rel="noopener">Stanford EE364a — Convex Optimization I</a> (lecture notes &amp; videos)</li>
<li><a href="https://docs.scipy.org/doc/scipy/reference/optimize.html" target="_blank" rel="noopener">scipy.optimize</a> — the workhorse solver library</li>
<li><a href="https://www.cvxpy.org/" target="_blank" rel="noopener">CVXPY</a> — model convex problems in Python</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PL3940DD956CDDE9895" target="_blank" rel="noopener">Stephen Boyd — Convex Optimization lectures</a></li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — gradient descent &amp; the geometry of it</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — write problems in standard form (min f(x) s.t. constraints); tell convex from non-convex.</li>
<li><strong>Unconstrained core</strong> — gradient, Hessian, optimality conditions; run gradient descent &amp; Newton by hand and in code.</li>
<li><strong>Constrained &amp; duality</strong> — Lagrangian, KKT conditions, LP/QP; solve with a solver.</li>
<li><strong>Job-ready</strong> — model a real task (least squares, SVM, path planning) and solve it with scipy.optimize / CVXPY.</li>
</ol></div>`,
    `<span class="eyebrow">MAO303 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Tối ưu hoá</strong> cho Robotics &amp; AI — dạng bài toán, tính lồi, phương pháp gradient và Newton, đối ngẫu, quy hoạch tuyến tính/lồi và ứng dụng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Sách chuẩn (tài liệu gốc)</h3>
<ul>
<li><a href="https://web.stanford.edu/~boyd/cvxbook/" target="_blank" rel="noopener"><em>Convex Optimization</em> — Boyd &amp; Vandenberghe</a> (PDF miễn phí, sách gốc của môn)</li>
<li><a href="https://www.math.uci.edu/~qnie/Publications/NumericalOptimization.pdf" target="_blank" rel="noopener"><em>Numerical Optimization</em> — Nocedal &amp; Wright</a> (gradient, Newton, tựa Newton)</li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://web.stanford.edu/class/ee364a/" target="_blank" rel="noopener">Stanford EE364a — Convex Optimization I</a> (ghi chú &amp; video)</li>
<li><a href="https://docs.scipy.org/doc/scipy/reference/optimize.html" target="_blank" rel="noopener">scipy.optimize</a> — thư viện giải toán chủ lực</li>
<li><a href="https://www.cvxpy.org/" target="_blank" rel="noopener">CVXPY</a> — mô hình hoá bài toán lồi bằng Python</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PL3940DD956CDDE9895" target="_blank" rel="noopener">Stephen Boyd — bài giảng Convex Optimization</a></li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — gradient descent &amp; hình học của nó</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — viết bài toán ở dạng chuẩn (min f(x) s.t. ràng buộc); phân biệt lồi và không lồi.</li>
<li><strong>Lõi không ràng buộc</strong> — gradient, Hessian, điều kiện tối ưu; chạy gradient descent &amp; Newton bằng tay và bằng code.</li>
<li><strong>Có ràng buộc &amp; đối ngẫu</strong> — Lagrangian, điều kiện KKT, LP/QP; giải bằng solver.</li>
<li><strong>Sẵn sàng đi làm</strong> — mô hình một bài thực tế (least squares, SVM, path planning) và giải bằng scipy.optimize / CVXPY.</li>
</ol></div>`,
  ]]);

const intro = doc('mao303-0-1-overview', 'Course overview: Optimization|||Tổng quan: Tối ưu hoá',
  'Tối ưu hoá là gì; vì sao nó là ngôn ngữ chung của ML & robot (huấn luyện mô hình, điều khiển, path planning); lộ trình: dạng bài toán → lồi → không ràng buộc → gradient/Newton → ràng buộc & đối ngẫu → LP/QP → ứng dụng.',
  [[
    `<span class="eyebrow">MAO303 · Lesson 0.1 · Overview</span>
<h2>What is optimization?</h2>
<p class="lead"><strong>Optimization</strong> is the art of choosing the <em>best</em> option under limits. Formally: pick the variable x that makes an <strong>objective</strong> f(x) as small (or large) as possible, while respecting <strong>constraints</strong>. It is the mathematical engine behind machine learning (fitting a model = minimizing a loss), robotics (planning a path = minimizing distance/energy) and engineering design.</p>
<h3>The one picture to keep</h3>
<pre><code>minimize    f(x)        &lt;- objective: what we want small
subject to  g_i(x) &lt;= 0   &lt;- inequality constraints
            h_j(x) = 0    &lt;- equality constraints
variable    x in R^n      &lt;- what we get to choose
</code></pre>
<h3>Why it matters for Robotics &amp; AI</h3>
<ul>
<li><strong>Training a model</strong> — minimize a loss (least squares, cross-entropy) over millions of weights via gradient descent.</li>
<li><strong>Control &amp; planning</strong> — a robot picks joint torques or a trajectory that minimizes energy subject to physical limits.</li>
<li><strong>Estimation</strong> — fuse noisy sensors by minimizing squared error (SLAM, Kalman filtering).</li>
</ul>
<h3>Roadmap</h3>
<p>Problem form &amp; classification → convex sets &amp; functions → unconstrained optimality → gradient methods → Newton &amp; quasi-Newton → constrained optimization (Lagrangian, KKT, duality) → LP/QP &amp; interior point → applications with scipy.</p>`,
    `<span class="eyebrow">MAO303 · Bài 0.1 · Tổng quan</span>
<h2>Tối ưu hoá là gì?</h2>
<p class="lead"><strong>Tối ưu hoá</strong> là nghệ thuật chọn phương án <em>tốt nhất</em> trong giới hạn. Chính thức: chọn biến x làm cho <strong>hàm mục tiêu</strong> f(x) nhỏ (hoặc lớn) nhất có thể, đồng thời tôn trọng các <strong>ràng buộc</strong>. Đây là bộ máy toán học đứng sau học máy (khớp mô hình = cực tiểu hoá mất mát), robot (lập đường đi = cực tiểu quãng đường/năng lượng) và thiết kế kỹ thuật.</p>
<h3>Một hình cần nhớ</h3>
<pre><code>minimize    f(x)        &lt;- mục tiêu: thứ ta muốn nhỏ
subject to  g_i(x) &lt;= 0   &lt;- ràng buộc bất đẳng thức
            h_j(x) = 0    &lt;- ràng buộc đẳng thức
variable    x in R^n      &lt;- thứ ta được chọn
</code></pre>
<h3>Vì sao quan trọng với Robotics &amp; AI</h3>
<ul>
<li><strong>Huấn luyện mô hình</strong> — cực tiểu hoá mất mát (least squares, cross-entropy) trên hàng triệu trọng số bằng gradient descent.</li>
<li><strong>Điều khiển &amp; lập kế hoạch</strong> — robot chọn mô-men khớp hoặc quỹ đạo tối thiểu năng lượng dưới giới hạn vật lý.</li>
<li><strong>Ước lượng</strong> — hợp nhất cảm biến nhiễu bằng cực tiểu bình phương sai số (SLAM, lọc Kalman).</li>
</ul>
<h3>Lộ trình</h3>
<p>Dạng &amp; phân loại bài toán → tập lồi &amp; hàm lồi → điều kiện tối ưu không ràng buộc → phương pháp gradient → Newton &amp; tựa Newton → tối ưu có ràng buộc (Lagrangian, KKT, đối ngẫu) → LP/QP &amp; interior point → ứng dụng với scipy.</p>`,
  ]]);

const c1 = doc('mao303-1-1-problem', '1.1 — The optimization problem|||1.1 — Bài toán tối ưu',
  'Dạng chuẩn min f(x) s.t. ràng buộc; biến quyết định, hàm mục tiêu, ràng buộc, miền khả thi; nghiệm tối ưu địa phương/toàn cục; phân loại bài toán.',
  [[
    `<span class="eyebrow">MAO303 · Chapter 1 · Lesson 1.1</span>
<h2>The optimization problem</h2>
<h3>Standard form</h3>
<p>Every optimization problem can be written in one <strong>standard form</strong>:</p>
<pre><code>minimize    f0(x)
subject to  fi(x) &lt;= 0,   i = 1..m   (inequalities)
            hj(x) = 0,    j = 1..p   (equalities)
</code></pre>
<ul>
<li><strong>Decision variable</strong> x in R^n — what we choose.</li>
<li><strong>Objective</strong> f0(x) — the cost we minimize (maximizing g is minimizing -g).</li>
<li><strong>Feasible set</strong> — all x that satisfy every constraint. A point is <em>feasible</em> if it lives there.</li>
<li><strong>Optimal value</strong> p* = min f0(x) over the feasible set; an <strong>optimal point</strong> x* attains it.</li>
</ul>
<h3>Local vs global</h3>
<p>A point is a <strong>global</strong> minimum if no feasible point is better anywhere; it is only <strong>local</strong> if it merely beats its neighbours. Non-convex problems can have many local minima that fool an algorithm.</p>
<h3>Classification</h3>
<p>By structure: linear (LP), quadratic (QP), convex, non-convex; by variables: continuous vs integer; constrained vs unconstrained. The class decides which algorithm can solve it and how reliably.</p>
<pre><code>Worked example (2 variables):
  minimize  f(x1,x2) = x1^2 + x2^2
  subject to           x1 + x2 = 1
  -> feasible line x2 = 1 - x1; substitute:
     f = x1^2 + (1-x1)^2 = 2*x1^2 - 2*x1 + 1
     f'(x1) = 4*x1 - 2 = 0  ->  x1 = 0.5, x2 = 0.5
  -> optimal point (0.5, 0.5), p* = 0.5
</code></pre>
<div class="callout"><span class="badge">Modeling is half the work</span> Getting a real task into standard form — naming the variable, the cost and the constraints — is often harder, and more valuable, than running the solver.</div>`,
    `<span class="eyebrow">MAO303 · Chương 1 · Bài 1.1</span>
<h2>Bài toán tối ưu</h2>
<h3>Dạng chuẩn</h3>
<p>Mọi bài toán tối ưu đều viết được về một <strong>dạng chuẩn</strong>:</p>
<pre><code>minimize    f0(x)
subject to  fi(x) &lt;= 0,   i = 1..m   (bất đẳng thức)
            hj(x) = 0,    j = 1..p   (đẳng thức)
</code></pre>
<ul>
<li><strong>Biến quyết định</strong> x in R^n — thứ ta chọn.</li>
<li><strong>Hàm mục tiêu</strong> f0(x) — chi phí cần cực tiểu (cực đại g chính là cực tiểu -g).</li>
<li><strong>Miền khả thi</strong> — mọi x thoả mọi ràng buộc. Một điểm <em>khả thi</em> nếu nằm trong đó.</li>
<li><strong>Giá trị tối ưu</strong> p* = min f0(x) trên miền khả thi; <strong>điểm tối ưu</strong> x* đạt được nó.</li>
</ul>
<h3>Địa phương và toàn cục</h3>
<p>Một điểm là cực tiểu <strong>toàn cục</strong> nếu không điểm khả thi nào tốt hơn ở bất cứ đâu; chỉ là <strong>địa phương</strong> nếu nó chỉ hơn các điểm lân cận. Bài toán không lồi có thể có nhiều cực tiểu địa phương đánh lừa thuật toán.</p>
<h3>Phân loại</h3>
<p>Theo cấu trúc: tuyến tính (LP), toàn phương (QP), lồi, không lồi; theo biến: liên tục hay nguyên; có ràng buộc hay không. Lớp bài toán quyết định thuật toán nào giải được và giải đáng tin đến đâu.</p>
<pre><code>Ví dụ giải (2 biến):
  minimize  f(x1,x2) = x1^2 + x2^2
  subject to           x1 + x2 = 1
  -> đường khả thi x2 = 1 - x1; thế vào:
     f = x1^2 + (1-x1)^2 = 2*x1^2 - 2*x1 + 1
     f'(x1) = 4*x1 - 2 = 0  ->  x1 = 0.5, x2 = 0.5
  -> điểm tối ưu (0.5, 0.5), p* = 0.5
</code></pre>
<div class="callout"><span class="badge">Mô hình hoá là nửa công việc</span> Đưa một bài thực tế về dạng chuẩn — đặt tên biến, chi phí và ràng buộc — thường khó hơn, và giá trị hơn, việc bấm solver.</div>`,
  ]]);

const c1q = quiz('mao303-quiz-1', 'Quiz 1 — Problem form|||Quiz 1 — Dạng bài toán', [
  { id: 'q1', question: 'Trong dạng chuẩn, hàm mục tiêu f0(x) được?', options: ['Cực đại hoá', 'Cực tiểu hoá', 'Giữ cố định', 'Bỏ qua'], correctIndex: 1, explanation: 'Dạng chuẩn luôn viết dưới dạng minimize f0(x); cực đại g = cực tiểu -g.' },
  { id: 'q2', question: 'Miền khả thi (feasible set) là?', options: ['Mọi x thoả tất cả ràng buộc', 'Mọi x trong R^n', 'Chỉ điểm tối ưu', 'Tập các hàm mục tiêu'], correctIndex: 0, explanation: 'Miền khả thi gồm mọi điểm thoả cả ràng buộc đẳng thức lẫn bất đẳng thức.' },
  { id: 'q3', question: 'Điểm cực tiểu chỉ hơn các điểm LÂN CẬN được gọi là?', options: ['Cực tiểu toàn cục', 'Cực tiểu địa phương', 'Điểm khả thi', 'Điểm yên ngựa'], correctIndex: 1, explanation: 'Cực tiểu địa phương chỉ tốt nhất trong lân cận; toàn cục tốt nhất trên toàn miền.' },
]);

const c2 = doc('mao303-2-1-convex', '2.1 — Convex sets & convex functions|||2.1 — Tập lồi & hàm lồi',
  'Tập lồi (đoạn thẳng nối 2 điểm nằm trong tập); hàm lồi (f(theta x + (1-theta)y) <= theta f(x)+(1-theta)f(y)); kiểm tra lồi (Hessian nửa xác định dương); vì sao lồi = cực tiểu địa phương là toàn cục.',
  [[
    `<span class="eyebrow">MAO303 · Chapter 2 · Lesson 2.1</span>
<h2>Convex sets &amp; convex functions</h2>
<h3>Convex set</h3>
<p>A set C is <strong>convex</strong> if the straight segment between any two points of C stays inside C:</p>
<pre><code>for all x, y in C and theta in [0,1]:
   theta*x + (1-theta)*y  is also in C
</code></pre>
<p>Lines, half-spaces (a^T x &lt;= b), balls and their intersections are convex; a crescent or a star is not.</p>
<h3>Convex function</h3>
<p>A function f is <strong>convex</strong> if its graph lies below every chord:</p>
<pre><code>f(theta*x + (1-theta)*y) &lt;= theta*f(x) + (1-theta)*f(y)
</code></pre>
<h3>How to check convexity</h3>
<ul>
<li><strong>Second-order test</strong> — for twice-differentiable f, f is convex on its domain iff the Hessian is positive semidefinite everywhere: the Hessian of f &gt;= 0 (all eigenvalues &gt;= 0).</li>
<li><strong>Building blocks</strong> — norms, x^2, e^x, -log(x) are convex; a nonnegative weighted sum of convex functions and the max of convex functions stay convex.</li>
</ul>
<pre><code>Example: is f(x) = x^2 - 2x + 3 convex?
  f''(x) = 2 &gt; 0 for all x  ->  convex (a bowl)
Example: is f(x) = x^3 convex?
  f''(x) = 6x, negative when x &lt; 0  ->  NOT convex on R
</code></pre>
<div class="callout"><span class="badge">Why convexity is the prize</span> For a convex problem, <strong>every local minimum is a global minimum</strong> — so a local method finds the true best answer. This one property is why the whole course leans on convexity.</div>`,
    `<span class="eyebrow">MAO303 · Chương 2 · Bài 2.1</span>
<h2>Tập lồi &amp; hàm lồi</h2>
<h3>Tập lồi</h3>
<p>Một tập C là <strong>lồi</strong> nếu đoạn thẳng nối hai điểm bất kỳ của C vẫn nằm trong C:</p>
<pre><code>với mọi x, y in C và theta in [0,1]:
   theta*x + (1-theta)*y  cũng thuộc C
</code></pre>
<p>Đường thẳng, nửa không gian (a^T x &lt;= b), hình cầu và giao của chúng là lồi; hình lưỡi liềm hay ngôi sao thì không.</p>
<h3>Hàm lồi</h3>
<p>Một hàm f là <strong>lồi</strong> nếu đồ thị của nó nằm dưới mọi dây cung:</p>
<pre><code>f(theta*x + (1-theta)*y) &lt;= theta*f(x) + (1-theta)*f(y)
</code></pre>
<h3>Cách kiểm tra tính lồi</h3>
<ul>
<li><strong>Kiểm tra bậc hai</strong> — với f khả vi hai lần, f lồi trên miền khi và chỉ khi Hessian nửa xác định dương ở mọi nơi: Hessian của f &gt;= 0 (mọi trị riêng &gt;= 0).</li>
<li><strong>Khối dựng</strong> — chuẩn (norm), x^2, e^x, -log(x) là lồi; tổng có trọng số không âm của hàm lồi và cực đại của hàm lồi vẫn lồi.</li>
</ul>
<pre><code>Ví dụ: f(x) = x^2 - 2x + 3 có lồi không?
  f''(x) = 2 &gt; 0 với mọi x  ->  lồi (hình bát)
Ví dụ: f(x) = x^3 có lồi không?
  f''(x) = 6x, âm khi x &lt; 0  ->  KHÔNG lồi trên R
</code></pre>
<div class="callout"><span class="badge">Vì sao tính lồi là phần thưởng</span> Với bài toán lồi, <strong>mọi cực tiểu địa phương đều là cực tiểu toàn cục</strong> — nên một phương pháp địa phương tìm ra đúng đáp án tốt nhất. Chính tính chất này khiến cả môn dựa vào tính lồi.</div>`,
  ]]);

const c2q = quiz('mao303-quiz-2', 'Quiz 2 — Convexity|||Quiz 2 — Tính lồi', [
  { id: 'q1', question: 'Với hàm khả vi hai lần, dấu hiệu f lồi là?', options: ['Đạo hàm bậc nhất = 0', 'Hessian nửa xác định dương (mọi trị riêng >= 0)', 'Hessian âm', 'Hàm giảm dần'], correctIndex: 1, explanation: 'f lồi khi và chỉ khi Hessian nửa xác định dương trên toàn miền.' },
  { id: 'q2', question: 'Lợi ích lớn nhất của bài toán LỒI là?', options: ['Không cần ràng buộc', 'Cực tiểu địa phương chính là toàn cục', 'Luôn có nghiệm nguyên', 'Không cần đạo hàm'], correctIndex: 1, explanation: 'Ở bài toán lồi, mọi cực tiểu địa phương đều là toàn cục.' },
  { id: 'q3', question: 'Tập nào sau đây là LỒI?', options: ['Hình ngôi sao', 'Hình lưỡi liềm', 'Nửa không gian a^T x <= b', 'Hai điểm rời nhau'], correctIndex: 2, explanation: 'Nửa không gian là lồi; đoạn nối hai điểm bất kỳ vẫn nằm trong nó.' },
]);

const c3 = doc('mao303-3-1-unconstrained', '3.1 — Unconstrained optimization|||3.1 — Tối ưu không ràng buộc',
  'Điều kiện tối ưu: gradient = 0 (bậc nhất) và Hessian nửa xác định dương (bậc hai); gradient chỉ hướng dốc lên; điểm dừng, cực tiểu, điểm yên ngựa.',
  [[
    `<span class="eyebrow">MAO303 · Chapter 3 · Lesson 3.1</span>
<h2>Unconstrained optimization</h2>
<p>With no constraints we simply minimize f(x) over all of R^n. Two derivatives tell us everything about a candidate point.</p>
<h3>The gradient</h3>
<p>The <strong>gradient</strong> grad f(x) is the vector of partial derivatives; it points in the direction of <em>steepest increase</em>, and its negative points downhill.</p>
<h3>Optimality conditions</h3>
<ul>
<li><strong>First-order (necessary):</strong> at a minimum, grad f(x*) = 0. Such a point is a <strong>stationary point</strong>.</li>
<li><strong>Second-order (sufficient):</strong> if additionally the Hessian H(x*) is positive definite, x* is a strict local minimum. If H is indefinite, x* is a <strong>saddle point</strong> (min in one direction, max in another).</li>
</ul>
<pre><code>Worked example:
  f(x) = x^2 - 4x + 7
  f'(x) = 2x - 4 = 0     ->  x* = 2   (stationary)
  f''(x) = 2 &gt; 0         ->  local (here global) minimum
  f(2) = 4 - 8 + 7 = 3   ->  p* = 3

Two variables: f(x,y) = x^2 + y^2 - 2x - 6y
  grad f = (2x - 2, 2y - 6) = (0,0)  ->  (x,y) = (1,3)
  Hessian = [[2,0],[0,2]]  (positive definite)  ->  minimum
</code></pre>
<div class="callout"><span class="badge">Gradient = 0 is not enough</span> A zero gradient only says "flat here" — it can be a min, a max or a saddle. The Hessian decides which. Saddle points are exactly what stall deep-learning training.</div>`,
    `<span class="eyebrow">MAO303 · Chương 3 · Bài 3.1</span>
<h2>Tối ưu không ràng buộc</h2>
<p>Không có ràng buộc, ta chỉ việc cực tiểu f(x) trên toàn R^n. Hai đạo hàm cho ta biết mọi thứ về một điểm ứng viên.</p>
<h3>Gradient</h3>
<p><strong>Gradient</strong> grad f(x) là vector các đạo hàm riêng; nó chỉ hướng <em>dốc lên nhanh nhất</em>, và số đối của nó chỉ hướng dốc xuống.</p>
<h3>Điều kiện tối ưu</h3>
<ul>
<li><strong>Bậc nhất (cần):</strong> tại cực tiểu, grad f(x*) = 0. Điểm như vậy gọi là <strong>điểm dừng</strong>.</li>
<li><strong>Bậc hai (đủ):</strong> nếu thêm vào đó Hessian H(x*) xác định dương thì x* là cực tiểu địa phương chặt. Nếu H không xác định dấu, x* là <strong>điểm yên ngựa</strong> (cực tiểu theo hướng này, cực đại theo hướng kia).</li>
</ul>
<pre><code>Ví dụ giải:
  f(x) = x^2 - 4x + 7
  f'(x) = 2x - 4 = 0     ->  x* = 2   (điểm dừng)
  f''(x) = 2 &gt; 0         ->  cực tiểu địa phương (ở đây là toàn cục)
  f(2) = 4 - 8 + 7 = 3   ->  p* = 3

Hai biến: f(x,y) = x^2 + y^2 - 2x - 6y
  grad f = (2x - 2, 2y - 6) = (0,0)  ->  (x,y) = (1,3)
  Hessian = [[2,0],[0,2]]  (xác định dương)  ->  cực tiểu
</code></pre>
<div class="callout"><span class="badge">Gradient = 0 chưa đủ</span> Gradient bằng 0 chỉ nói "phẳng ở đây" — có thể là cực tiểu, cực đại hoặc yên ngựa. Hessian mới quyết định. Điểm yên ngựa chính là thứ làm nghẽn huấn luyện học sâu.</div>`,
  ]]);

const c3q = quiz('mao303-quiz-3', 'Quiz 3 — Unconstrained|||Quiz 3 — Không ràng buộc', [
  { id: 'q1', question: 'Điều kiện tối ưu bậc nhất tại cực tiểu không ràng buộc là?', options: ['grad f(x*) = 0', 'Hessian = 0', 'f(x*) = 0', 'x* = 0'], correctIndex: 0, explanation: 'Điều kiện cần bậc nhất: gradient triệt tiêu tại điểm tối ưu.' },
  { id: 'q2', question: 'Gradient của f chỉ hướng?', options: ['Dốc xuống nhanh nhất', 'Dốc lên nhanh nhất', 'Vuông góc mọi hướng', 'Về gốc toạ độ'], correctIndex: 1, explanation: 'Gradient chỉ hướng tăng nhanh nhất; -gradient chỉ hướng giảm.' },
  { id: 'q3', question: 'Điểm có grad = 0 nhưng Hessian không xác định dấu là?', options: ['Cực tiểu chặt', 'Cực đại chặt', 'Điểm yên ngựa', 'Điểm khả thi'], correctIndex: 2, explanation: 'Hessian không xác định dấu → điểm yên ngựa (min hướng này, max hướng kia).' },
]);

const c4 = doc('mao303-4-1-gradient', '4.1 — Gradient methods|||4.1 — Phương pháp gradient',
  'Gradient descent x_{k+1} = x_k - alpha*grad f; chọn step size alpha (line search, quá lớn phân kỳ, quá nhỏ chậm); tốc độ hội tụ; momentum; SGD cho dữ liệu lớn.',
  [[
    `<span class="eyebrow">MAO303 · Chapter 4 · Lesson 4.1</span>
<h2>Gradient methods</h2>
<h3>Gradient descent</h3>
<p>The simplest iterative method: step downhill, repeat.</p>
<pre><code>x_{k+1} = x_k - alpha * grad f(x_k)
</code></pre>
<p>where <strong>alpha &gt; 0</strong> is the <strong>step size</strong> (learning rate).</p>
<h3>Choosing the step size</h3>
<ul>
<li><strong>Too large</strong> — the iterates overshoot and diverge (bounce out of the bowl).</li>
<li><strong>Too small</strong> — it converges, but painfully slowly.</li>
<li><strong>Line search</strong> — pick alpha each step to actually decrease f (e.g. backtracking / Armijo condition).</li>
</ul>
<h3>Convergence &amp; conditioning</h3>
<p>On a smooth convex function gradient descent converges; the speed depends on <strong>conditioning</strong> — a long narrow valley (ill-conditioned Hessian) makes it zig-zag slowly.</p>
<h3>Momentum &amp; SGD</h3>
<ul>
<li><strong>Momentum</strong> — add a fraction of the previous step to smooth the zig-zag and speed up: v = beta*v - alpha*grad f; x = x + v.</li>
<li><strong>Stochastic gradient descent (SGD)</strong> — estimate the gradient from a small random <em>mini-batch</em> instead of the whole dataset; cheap per step, the backbone of deep-learning training (Adam is a tuned variant).</li>
</ul>
<pre><code>One step, f(x) = x^2, grad = 2x, x0 = 3, alpha = 0.1:
  x1 = 3 - 0.1*(2*3)  = 3 - 0.6 = 2.4
  x2 = 2.4 - 0.1*(2*2.4) = 2.4 - 0.48 = 1.92  ...  -> 0
</code></pre>
<div class="callout"><span class="badge">The learning rate is everything</span> In practice most training failures are a step size that is too big (loss explodes) or too small (loss barely moves). Tune it first.</div>`,
    `<span class="eyebrow">MAO303 · Chương 4 · Bài 4.1</span>
<h2>Phương pháp gradient</h2>
<h3>Gradient descent</h3>
<p>Phương pháp lặp đơn giản nhất: bước xuống dốc, lặp lại.</p>
<pre><code>x_{k+1} = x_k - alpha * grad f(x_k)
</code></pre>
<p>trong đó <strong>alpha &gt; 0</strong> là <strong>bước nhảy</strong> (learning rate).</p>
<h3>Chọn bước nhảy</h3>
<ul>
<li><strong>Quá lớn</strong> — các bước vọt qua và phân kỳ (bật ra khỏi bát).</li>
<li><strong>Quá nhỏ</strong> — vẫn hội tụ, nhưng chậm đến khổ.</li>
<li><strong>Line search</strong> — chọn alpha mỗi bước sao cho f thực sự giảm (vd backtracking / điều kiện Armijo).</li>
</ul>
<h3>Hội tụ &amp; điều kiện số</h3>
<p>Trên hàm lồi trơn, gradient descent hội tụ; tốc độ phụ thuộc <strong>điều kiện số</strong> — một thung lũng dài hẹp (Hessian điều kiện xấu) khiến nó zig-zag chậm.</p>
<h3>Momentum &amp; SGD</h3>
<ul>
<li><strong>Momentum</strong> — cộng một phần bước trước để làm mượt zig-zag và tăng tốc: v = beta*v - alpha*grad f; x = x + v.</li>
<li><strong>SGD (gradient ngẫu nhiên)</strong> — ước lượng gradient từ một <em>mini-batch</em> ngẫu nhiên nhỏ thay vì toàn bộ dữ liệu; mỗi bước rẻ, là xương sống của huấn luyện học sâu (Adam là biến thể tinh chỉnh).</li>
</ul>
<pre><code>Một bước, f(x) = x^2, grad = 2x, x0 = 3, alpha = 0.1:
  x1 = 3 - 0.1*(2*3)  = 3 - 0.6 = 2.4
  x2 = 2.4 - 0.1*(2*2.4) = 2.4 - 0.48 = 1.92  ...  -> 0
</code></pre>
<div class="callout"><span class="badge">Learning rate là tất cả</span> Thực tế phần lớn thất bại khi huấn luyện là bước nhảy quá lớn (mất mát nổ) hoặc quá nhỏ (mất mát gần như đứng yên). Tinh chỉnh nó trước tiên.</div>`,
  ]]);

const c4q = quiz('mao303-quiz-4', 'Quiz 4 — Gradient methods|||Quiz 4 — Phương pháp gradient', [
  { id: 'q1', question: 'Công thức cập nhật của gradient descent là?', options: ['x = x + alpha*grad f', 'x = x - alpha*grad f', 'x = x - alpha*f', 'x = grad f'], correctIndex: 1, explanation: 'Đi ngược hướng gradient: x_{k+1} = x_k - alpha*grad f(x_k).' },
  { id: 'q2', question: 'Nếu bước nhảy alpha QUÁ LỚN thì?', options: ['Hội tụ nhanh và ổn định', 'Có thể vọt qua và phân kỳ', 'Luôn dừng ở cực tiểu', 'Không ảnh hưởng'], correctIndex: 1, explanation: 'Alpha quá lớn làm iterate vọt qua đáy và phân kỳ.' },
  { id: 'q3', question: 'SGD (stochastic gradient descent) tính gradient trên?', options: ['Toàn bộ dữ liệu mỗi bước', 'Một mini-batch ngẫu nhiên', 'Chỉ một điểm cố định', 'Hessian'], correctIndex: 1, explanation: 'SGD ước lượng gradient từ mini-batch nhỏ ngẫu nhiên → rẻ, hợp dữ liệu lớn.' },
]);

const c5 = doc('mao303-5-1-newton', '5.1 — Newton & quasi-Newton methods|||5.1 — Phương pháp Newton & tựa Newton',
  'Newton dùng Hessian: x_{k+1} = x_k - H^{-1} grad f; hội tụ bậc hai gần nghiệm nhưng đắt (nghịch đảo Hessian); tựa Newton (BFGS) xấp xỉ Hessian từ gradient.',
  [[
    `<span class="eyebrow">MAO303 · Chapter 5 · Lesson 5.1</span>
<h2>Newton &amp; quasi-Newton methods</h2>
<h3>Newton method</h3>
<p>Gradient descent uses only slope. <strong>Newton method</strong> also uses curvature (the Hessian H) to jump straight toward the minimum of a local quadratic model:</p>
<pre><code>x_{k+1} = x_k - H(x_k)^{-1} * grad f(x_k)
</code></pre>
<ul>
<li><strong>Convergence</strong> — <em>quadratic</em> near the solution: the number of correct digits roughly doubles each step. Far faster than gradient descent.</li>
<li><strong>Cost</strong> — you must form and invert the n x n Hessian every step (O(n^3)); for n in the millions (deep nets) that is impossible.</li>
</ul>
<h3>Quasi-Newton (BFGS)</h3>
<p><strong>Quasi-Newton</strong> methods keep Newton speed without the Hessian: they <em>build an approximation</em> of H (or its inverse) from successive gradients. <strong>BFGS</strong> is the classic; <strong>L-BFGS</strong> stores only a few vectors and is the go-to for large smooth problems (it is what scipy.optimize uses by default for many methods).</p>
<pre><code>One Newton step, f(x) = x^2 - 4x + 7:
  f'(x) = 2x - 4,  f''(x) = 2
  x1 = x0 - f'(x0)/f''(x0)
     = x0 - (2*x0 - 4)/2 = x0 - (x0 - 2) = 2   (exact in ONE step)
  -> for a quadratic, Newton lands on x* immediately
</code></pre>
<div class="callout"><span class="badge">Speed vs cost</span> Newton = fewest iterations, most work per iteration. Gradient descent = opposite. Quasi-Newton (L-BFGS) sits in the sweet spot for medium-sized smooth problems.</div>`,
    `<span class="eyebrow">MAO303 · Chương 5 · Bài 5.1</span>
<h2>Phương pháp Newton &amp; tựa Newton</h2>
<h3>Phương pháp Newton</h3>
<p>Gradient descent chỉ dùng độ dốc. <strong>Newton</strong> dùng thêm độ cong (Hessian H) để nhảy thẳng về cực tiểu của mô hình toàn phương địa phương:</p>
<pre><code>x_{k+1} = x_k - H(x_k)^{-1} * grad f(x_k)
</code></pre>
<ul>
<li><strong>Hội tụ</strong> — <em>bậc hai</em> gần nghiệm: số chữ số đúng gần như gấp đôi mỗi bước. Nhanh hơn hẳn gradient descent.</li>
<li><strong>Chi phí</strong> — phải lập và nghịch đảo Hessian n x n mỗi bước (O(n^3)); với n cỡ triệu (mạng học sâu) là bất khả.</li>
</ul>
<h3>Tựa Newton (BFGS)</h3>
<p>Phương pháp <strong>tựa Newton</strong> giữ tốc độ Newton mà không cần Hessian: chúng <em>dựng xấp xỉ</em> của H (hoặc nghịch đảo của nó) từ các gradient liên tiếp. <strong>BFGS</strong> là kinh điển; <strong>L-BFGS</strong> chỉ lưu vài vector và là lựa chọn hàng đầu cho bài toán trơn cỡ lớn (đó là thứ scipy.optimize dùng mặc định cho nhiều phương pháp).</p>
<pre><code>Một bước Newton, f(x) = x^2 - 4x + 7:
  f'(x) = 2x - 4,  f''(x) = 2
  x1 = x0 - f'(x0)/f''(x0)
     = x0 - (2*x0 - 4)/2 = x0 - (x0 - 2) = 2   (đúng trong MỘT bước)
  -> với hàm toàn phương, Newton chạm x* ngay lập tức
</code></pre>
<div class="callout"><span class="badge">Tốc độ và chi phí</span> Newton = ít vòng lặp nhất, nhiều việc mỗi vòng nhất. Gradient descent = ngược lại. Tựa Newton (L-BFGS) nằm ở điểm ngọt cho bài toán trơn cỡ vừa.</div>`,
  ]]);

const c5q = quiz('mao303-quiz-5', 'Quiz 5 — Newton methods|||Quiz 5 — Phương pháp Newton', [
  { id: 'q1', question: 'Bước Newton dùng thêm thông tin gì so với gradient descent?', options: ['Chỉ giá trị hàm', 'Hessian (độ cong)', 'Số vòng lặp', 'Learning rate'], correctIndex: 1, explanation: 'Newton dùng Hessian H: x_{k+1} = x_k - H^{-1} grad f.' },
  { id: 'q2', question: 'Nhược điểm chính của Newton với bài toán n rất lớn?', options: ['Hội tụ chậm', 'Phải lập & nghịch đảo Hessian n x n (O(n^3))', 'Không cần đạo hàm', 'Luôn phân kỳ'], correctIndex: 1, explanation: 'Nghịch đảo Hessian tốn O(n^3) → bất khả khi n cỡ triệu.' },
  { id: 'q3', question: 'BFGS / L-BFGS thuộc nhóm phương pháp?', options: ['Tựa Newton (xấp xỉ Hessian từ gradient)', 'Gradient descent thuần', 'Simplex', 'Interior point'], correctIndex: 0, explanation: 'Tựa Newton dựng xấp xỉ Hessian từ các gradient liên tiếp, giữ tốc độ mà rẻ hơn.' },
]);

const c6 = doc('mao303-6-1-constrained', '6.1 — Constrained optimization: Lagrangian, KKT & duality|||6.1 — Tối ưu có ràng buộc: Lagrangian, KKT & đối ngẫu',
  'Hàm Lagrangian L(x,lambda,nu) gộp ràng buộc vào mục tiêu; điều kiện KKT (stationarity, khả thi, bù, nhân tử >= 0); bài toán đối ngẫu và khoảng cách đối ngẫu.',
  [[
    `<span class="eyebrow">MAO303 · Chapter 6 · Lesson 6.1</span>
<h2>Constrained optimization: Lagrangian, KKT &amp; duality</h2>
<h3>The Lagrangian</h3>
<p>To handle constraints, fold them into the objective with multipliers:</p>
<pre><code>L(x, lambda, nu) = f0(x) + sum_i lambda_i * fi(x) + sum_j nu_j * hj(x)
   lambda_i &gt;= 0  (for inequalities fi(x) &lt;= 0)
   nu_j     free  (for equalities hj(x) = 0)
</code></pre>
<h3>KKT conditions</h3>
<p>For a convex problem the <strong>Karush-Kuhn-Tucker (KKT)</strong> conditions are necessary AND sufficient for x* to be optimal:</p>
<pre><code>1. Stationarity:      grad_x L = grad f0 + sum lambda_i grad fi + sum nu_j grad hj = 0
2. Primal feasible:   fi(x*) &lt;= 0,   hj(x*) = 0
3. Dual feasible:     lambda_i &gt;= 0
4. Complementary:     lambda_i * fi(x*) = 0   (either the constraint is tight, or its multiplier is 0)
</code></pre>
<h3>Duality</h3>
<p>The <strong>dual function</strong> g(lambda,nu) = min_x L gives a lower bound on p*. Its best bound is the <strong>dual problem</strong> max g. The gap p* - d* is the <strong>duality gap</strong>; for convex problems (under mild conditions, Slater) it is <strong>zero</strong> — strong duality — so solving the dual solves the primal.</p>
<pre><code>Example: minimize x^2  s.t.  x &gt;= 1
  L = x^2 + lambda*(1 - x),  lambda &gt;= 0
  dL/dx = 2x - lambda = 0  ->  x = lambda/2
  complementary: lambda*(1 - x) = 0.  Constraint is tight -> x* = 1
  -> lambda = 2, p* = 1
</code></pre>
<div class="callout"><span class="badge">KKT is the master key</span> Almost every constrained solver — and the SVM you meet in Chapter 8 — is really finding a point that satisfies KKT. Learn to write these four lines.</div>`,
    `<span class="eyebrow">MAO303 · Chương 6 · Bài 6.1</span>
<h2>Tối ưu có ràng buộc: Lagrangian, KKT &amp; đối ngẫu</h2>
<h3>Hàm Lagrangian</h3>
<p>Để xử lý ràng buộc, gộp chúng vào mục tiêu bằng các nhân tử:</p>
<pre><code>L(x, lambda, nu) = f0(x) + sum_i lambda_i * fi(x) + sum_j nu_j * hj(x)
   lambda_i &gt;= 0  (cho bất đẳng thức fi(x) &lt;= 0)
   nu_j     tự do (cho đẳng thức hj(x) = 0)
</code></pre>
<h3>Điều kiện KKT</h3>
<p>Với bài toán lồi, điều kiện <strong>Karush-Kuhn-Tucker (KKT)</strong> vừa CẦN vừa ĐỦ để x* tối ưu:</p>
<pre><code>1. Dừng (stationarity): grad_x L = grad f0 + sum lambda_i grad fi + sum nu_j grad hj = 0
2. Khả thi gốc:         fi(x*) &lt;= 0,   hj(x*) = 0
3. Khả thi đối ngẫu:    lambda_i &gt;= 0
4. Bù (complementary):  lambda_i * fi(x*) = 0   (hoặc ràng buộc chạm, hoặc nhân tử = 0)
</code></pre>
<h3>Đối ngẫu</h3>
<p><strong>Hàm đối ngẫu</strong> g(lambda,nu) = min_x L cho một cận dưới của p*. Cận tốt nhất là <strong>bài toán đối ngẫu</strong> max g. Khoảng cách p* - d* là <strong>khoảng cách đối ngẫu</strong>; với bài lồi (dưới điều kiện nhẹ, Slater) nó <strong>bằng 0</strong> — đối ngẫu mạnh — nên giải đối ngẫu là giải luôn bài gốc.</p>
<pre><code>Ví dụ: minimize x^2  s.t.  x &gt;= 1
  L = x^2 + lambda*(1 - x),  lambda &gt;= 0
  dL/dx = 2x - lambda = 0  ->  x = lambda/2
  bù: lambda*(1 - x) = 0.  Ràng buộc chạm -> x* = 1
  -> lambda = 2, p* = 1
</code></pre>
<div class="callout"><span class="badge">KKT là chìa khoá chủ</span> Gần như mọi solver có ràng buộc — và cả SVM ở Chương 8 — thực chất đang tìm điểm thoả KKT. Hãy học viết bốn dòng này.</div>`,
  ]]);

const c6q = quiz('mao303-quiz-6', 'Quiz 6 — Lagrangian & KKT|||Quiz 6 — Lagrangian & KKT', [
  { id: 'q1', question: 'Hàm Lagrangian dùng để?', options: ['Bỏ hàm mục tiêu', 'Gộp ràng buộc vào mục tiêu bằng nhân tử', 'Tính Hessian', 'Chọn learning rate'], correctIndex: 1, explanation: 'L(x,lambda,nu) cộng các ràng buộc nhân với nhân tử vào f0(x).' },
  { id: 'q2', question: 'Điều kiện bù (complementary slackness) trong KKT nói?', options: ['lambda_i * fi(x*) = 0', 'lambda_i < 0', 'grad f0 = 0', 'fi(x*) > 0'], correctIndex: 0, explanation: 'Hoặc ràng buộc chạm (fi=0), hoặc nhân tử của nó bằng 0.' },
  { id: 'q3', question: 'Với bài toán LỒI thoả điều kiện Slater, khoảng cách đối ngẫu?', options: ['Luôn dương', 'Bằng 0 (đối ngẫu mạnh)', 'Không xác định', 'Bằng số ràng buộc'], correctIndex: 1, explanation: 'Đối ngẫu mạnh: p* = d*, nên giải đối ngẫu là giải luôn bài gốc.' },
]);

const c7 = doc('mao303-7-1-lp-qp', '7.1 — Linear & convex programming|||7.1 — Quy hoạch tuyến tính & lồi',
  'LP (mục tiêu & ràng buộc tuyến tính, nghiệm ở đỉnh đa diện); simplex (đi theo cạnh giữa các đỉnh); QP (mục tiêu toàn phương); interior point (đi xuyên trong miền).',
  [[
    `<span class="eyebrow">MAO303 · Chapter 7 · Lesson 7.1</span>
<h2>Linear &amp; convex programming</h2>
<h3>Linear programming (LP)</h3>
<p>An <strong>LP</strong> has a linear objective and linear constraints:</p>
<pre><code>minimize    c^T x
subject to  A x &lt;= b,   x &gt;= 0
</code></pre>
<p>The feasible set is a <strong>polytope</strong> (a many-sided region). A key fact: an optimum always sits at a <strong>vertex</strong> (corner) of that polytope.</p>
<h3>The simplex method</h3>
<p><strong>Simplex</strong> exploits that fact — it walks along the <em>edges</em> from vertex to vertex, always to a better one, until no neighbour improves. Fast and reliable in practice (though worst-case exponential).</p>
<h3>Quadratic programming (QP)</h3>
<p>A <strong>QP</strong> keeps linear constraints but the objective is quadratic:</p>
<pre><code>minimize    (1/2) x^T Q x + c^T x
subject to  A x &lt;= b
   (convex when Q is positive semidefinite)
</code></pre>
<p>QPs cover least squares with bounds, portfolio choice and the SVM.</p>
<h3>Interior-point methods</h3>
<p>Instead of crawling the boundary, <strong>interior-point</strong> methods drive <em>through the inside</em> of the feasible region toward the optimum, using a barrier that blows up near the walls. They solve LP, QP and general convex problems in polynomial time and power modern solvers.</p>
<div class="callout"><span class="badge">Two ways to the corner</span> Simplex hops around the edges; interior-point cuts across the middle. Both reach the optimum — modern libraries pick whichever suits the problem size.</div>`,
    `<span class="eyebrow">MAO303 · Chương 7 · Bài 7.1</span>
<h2>Quy hoạch tuyến tính &amp; lồi</h2>
<h3>Quy hoạch tuyến tính (LP)</h3>
<p>Một <strong>LP</strong> có mục tiêu tuyến tính và ràng buộc tuyến tính:</p>
<pre><code>minimize    c^T x
subject to  A x &lt;= b,   x &gt;= 0
</code></pre>
<p>Miền khả thi là một <strong>đa diện (polytope)</strong>. Sự thật cốt lõi: nghiệm tối ưu luôn nằm ở một <strong>đỉnh</strong> (góc) của đa diện đó.</p>
<h3>Phương pháp đơn hình (simplex)</h3>
<p><strong>Simplex</strong> khai thác điều đó — nó đi theo <em>cạnh</em> từ đỉnh này sang đỉnh khác, luôn sang đỉnh tốt hơn, đến khi không đỉnh kề nào cải thiện. Nhanh và đáng tin trong thực tế (dù trường hợp xấu nhất là hàm mũ).</p>
<h3>Quy hoạch toàn phương (QP)</h3>
<p>Một <strong>QP</strong> giữ ràng buộc tuyến tính nhưng mục tiêu là toàn phương:</p>
<pre><code>minimize    (1/2) x^T Q x + c^T x
subject to  A x &lt;= b
   (lồi khi Q nửa xác định dương)
</code></pre>
<p>QP bao gồm least squares có chặn, chọn danh mục đầu tư và SVM.</p>
<h3>Phương pháp điểm trong (interior-point)</h3>
<p>Thay vì bò dọc biên, phương pháp <strong>điểm trong</strong> đi <em>xuyên qua bên trong</em> miền khả thi tiến về nghiệm, dùng một hàm rào chắn nổ lên khi tới gần tường. Chúng giải LP, QP và bài lồi tổng quát trong thời gian đa thức, làm động cơ cho các solver hiện đại.</p>
<div class="callout"><span class="badge">Hai đường tới góc</span> Simplex nhảy quanh cạnh; điểm trong cắt ngang qua giữa. Cả hai đều tới nghiệm — thư viện hiện đại chọn cách hợp với cỡ bài toán.</div>`,
  ]]);

const c7q = quiz('mao303-quiz-7', 'Quiz 7 — LP & QP|||Quiz 7 — LP & QP', [
  { id: 'q1', question: 'Nghiệm tối ưu của một LP luôn nằm ở?', options: ['Tâm miền khả thi', 'Một đỉnh của đa diện', 'Ngoài miền khả thi', 'Gốc toạ độ'], correctIndex: 1, explanation: 'Với LP, tối ưu luôn đạt tại một đỉnh (góc) của polytope.' },
  { id: 'q2', question: 'Phương pháp simplex hoạt động bằng cách?', options: ['Đi theo cạnh giữa các đỉnh tới đỉnh tốt hơn', 'Nghịch đảo Hessian', 'Lấy gradient ngẫu nhiên', 'Đi xuyên qua tâm'], correctIndex: 0, explanation: 'Simplex đi dọc cạnh từ đỉnh sang đỉnh tốt hơn cho tới khi không cải thiện.' },
  { id: 'q3', question: 'Khác biệt của QP so với LP là?', options: ['Ràng buộc phi tuyến', 'Hàm mục tiêu toàn phương', 'Không có ràng buộc', 'Chỉ có biến nguyên'], correctIndex: 1, explanation: 'QP giữ ràng buộc tuyến tính nhưng mục tiêu là toàn phương ((1/2)x^T Q x + c^T x).' },
]);

const c8 = doc('mao303-8-1-applications', '8.1 — Applications in ML & robotics|||8.1 — Ứng dụng trong ML & robot',
  'Least squares (khớp mô hình, min ||Ax-b||^2); SVM (QP tìm siêu phẳng lề lớn nhất); path planning (tối thiểu quãng đường/năng lượng dưới ràng buộc); giải bằng scipy.optimize.',
  [[
    `<span class="eyebrow">MAO303 · Chapter 8 · Lesson 8.1</span>
<h2>Applications in ML &amp; robotics</h2>
<h3>Least squares — the workhorse</h3>
<p>Fitting a line or a model to data is an unconstrained convex problem:</p>
<pre><code>minimize  || A x - b ||^2    (over x)
closed form:  x* = (A^T A)^{-1} A^T b   (the normal equations)
</code></pre>
<p>It powers linear regression, sensor calibration and state estimation.</p>
<h3>Support Vector Machine (SVM)</h3>
<p>Finding the maximum-margin separating hyperplane is a <strong>QP</strong>:</p>
<pre><code>minimize  (1/2) ||w||^2
subject to  y_i (w^T x_i + b) &gt;= 1   for every training point i
</code></pre>
<p>Its KKT conditions reveal the <em>support vectors</em> — the few points that touch the margin.</p>
<h3>Path planning &amp; control</h3>
<p>A robot trajectory is chosen to minimize length or energy subject to dynamics and obstacle/joint limits — a constrained problem solved by QP or nonlinear methods (model predictive control re-solves one every timestep).</p>
<h3>Solving with scipy</h3>
<pre><code>from scipy.optimize import minimize
def f(x):  return (x[0]-1)**2 + (x[1]-2.5)**2
cons = [{'type':'ineq','fun': lambda x: x[0] + x[1] - 2}]   # x0+x1 &gt;= 2
res = minimize(f, x0=[0,0], constraints=cons, method='SLSQP')
print(res.x)   # -> point near (1, 2.5) that also meets the constraint
</code></pre>
<div class="callout"><span class="badge">From theory to a solver</span> Model the task (variable, objective, constraints), check convexity, then hand it to scipy.optimize or CVXPY. The maths of Chapters 1-7 is exactly what tells you the answer can be trusted.</div>`,
    `<span class="eyebrow">MAO303 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng trong ML &amp; robot</h2>
<h3>Least squares — chủ lực</h3>
<p>Khớp một đường hay một mô hình vào dữ liệu là bài lồi không ràng buộc:</p>
<pre><code>minimize  || A x - b ||^2    (theo x)
dạng đóng:  x* = (A^T A)^{-1} A^T b   (phương trình chuẩn tắc)
</code></pre>
<p>Nó làm nền cho hồi quy tuyến tính, hiệu chuẩn cảm biến và ước lượng trạng thái.</p>
<h3>Máy vector hỗ trợ (SVM)</h3>
<p>Tìm siêu phẳng phân tách lề lớn nhất là một <strong>QP</strong>:</p>
<pre><code>minimize  (1/2) ||w||^2
subject to  y_i (w^T x_i + b) &gt;= 1   với mọi điểm huấn luyện i
</code></pre>
<p>Điều kiện KKT của nó chỉ ra các <em>vector hỗ trợ</em> — vài điểm chạm lề.</p>
<h3>Lập đường đi &amp; điều khiển</h3>
<p>Quỹ đạo robot được chọn để tối thiểu quãng đường hoặc năng lượng dưới ràng buộc động học và giới hạn vật cản/khớp — một bài có ràng buộc, giải bằng QP hoặc phương pháp phi tuyến (điều khiển dự báo mô hình giải lại một bài mỗi bước thời gian).</p>
<h3>Giải bằng scipy</h3>
<pre><code>from scipy.optimize import minimize
def f(x):  return (x[0]-1)**2 + (x[1]-2.5)**2
cons = [{'type':'ineq','fun': lambda x: x[0] + x[1] - 2}]   # x0+x1 &gt;= 2
res = minimize(f, x0=[0,0], constraints=cons, method='SLSQP')
print(res.x)   # -> điểm gần (1, 2.5) mà vẫn thoả ràng buộc
</code></pre>
<div class="callout"><span class="badge">Từ lý thuyết đến solver</span> Mô hình hoá bài toán (biến, mục tiêu, ràng buộc), kiểm tính lồi, rồi giao cho scipy.optimize hoặc CVXPY. Toán của Chương 1-7 chính là thứ cho biết đáp án có đáng tin không.</div>`,
  ]]);

const c8q = quiz('mao303-quiz-8', 'Quiz 8 — Applications|||Quiz 8 — Ứng dụng', [
  { id: 'q1', question: 'Bài toán least squares min ||Ax - b||^2 có nghiệm dạng đóng là?', options: ['x = A b', 'x = (A^T A)^{-1} A^T b', 'x = A^T A', 'x = b / A'], correctIndex: 1, explanation: 'Phương trình chuẩn tắc: x* = (A^T A)^{-1} A^T b.' },
  { id: 'q2', question: 'Huấn luyện SVM (lề cứng) là loại bài toán nào?', options: ['LP tuyến tính', 'QP (toàn phương có ràng buộc)', 'Không ràng buộc', 'Bài nguyên'], correctIndex: 1, explanation: 'SVM tối thiểu (1/2)||w||^2 dưới ràng buộc tuyến tính → một QP.' },
  { id: 'q3', question: 'Hàm nào của scipy dùng để giải bài tối ưu có ràng buộc?', options: ['numpy.dot', 'scipy.optimize.minimize (vd method SLSQP)', 'scipy.fft', 'pandas.merge'], correctIndex: 1, explanation: 'scipy.optimize.minimize với method như SLSQP xử lý ràng buộc.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'MAO303',
    slug: 'mao303-optimization',
    title: 'Optimization',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MAO303.webp',
    shortDescription: 'Optimization for Robotics & AI — problem form (min f(x) s.t. constraints), convex sets & functions, gradient descent, Newton & BFGS, Lagrangian & KKT duality, LP/QP, and ML/robotics applications. Bilingual, worked examples & quizzes.|||Tối ưu hoá cho Robotics & AI — dạng chuẩn (min f(x) s.t. ràng buộc), tập/hàm lồi, gradient descent, Newton & BFGS, Lagrangian & KKT đối ngẫu, LP/QP, ứng dụng ML/robot. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>MAO303 — Optimization (Tối ưu hoá)</strong> thuộc khung ngành Robotics &amp; AI, kỳ 3. Từ <strong>dạng bài toán &amp; phân loại</strong> (min f(x) s.t. ràng buộc) → <strong>tập lồi &amp; hàm lồi</strong> → <strong>tối ưu không ràng buộc</strong> (gradient, Hessian, điều kiện tối ưu) → <strong>phương pháp gradient</strong> (gradient descent, momentum, SGD) → <strong>Newton &amp; tựa Newton (BFGS)</strong> → <strong>ràng buộc: Lagrangian, KKT, đối ngẫu</strong> → <strong>LP/QP &amp; interior point</strong> → <strong>ứng dụng</strong> (least squares, SVM, path planning, scipy). Bám sách chuẩn Boyd &amp; Vandenberghe và Nocedal &amp; Wright, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Viết bài toán ở dạng chuẩn (min f(x) s.t. ràng buộc); phân biệt tập/hàm lồi (kiểm Hessian); điều kiện tối ưu không ràng buộc (grad = 0, Hessian); gradient descent, step size, momentum, SGD; Newton & tựa Newton (BFGS/L-BFGS); Lagrangian, điều kiện KKT, đối ngẫu; LP (simplex), QP, interior point; ứng dụng least squares, SVM, path planning và giải bằng scipy.optimize.',
    requirements: 'Giải tích nhiều biến (đạo hàm riêng, gradient), đại số tuyến tính (ma trận, trị riêng) và Python cơ bản. Xem điều kiện tiên quyết trong khung ngành Robotics & AI trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách Boyd & Nocedal, EE364a, scipy/cvxpy, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tối ưu hoá là gì; vai trò trong ML & robot.', lessons: [intro] },
    { title: 'Chương 1 — Bài toán tối ưu|||Chapter 1 — The optimization problem', description: 'Dạng chuẩn, biến/mục tiêu/ràng buộc, phân loại.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tập lồi & hàm lồi|||Chapter 2 — Convex sets & functions', description: 'Convex set/function, kiểm tra lồi.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tối ưu không ràng buộc|||Chapter 3 — Unconstrained optimization', description: 'grad = 0, Hessian, cực tiểu/yên ngựa.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phương pháp gradient|||Chapter 4 — Gradient methods', description: 'Gradient descent, step size, momentum, SGD.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Newton & tựa Newton|||Chapter 5 — Newton & quasi-Newton', description: 'Newton, hội tụ bậc hai, BFGS.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tối ưu có ràng buộc|||Chapter 6 — Constrained optimization', description: 'Lagrangian, KKT, đối ngẫu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — LP & lồi|||Chapter 7 — Linear & convex programming', description: 'LP, simplex, QP, interior point.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng|||Chapter 8 — Applications', description: 'Least squares, SVM, path planning, scipy.', lessons: [c8, c8q] },
  ],
};
