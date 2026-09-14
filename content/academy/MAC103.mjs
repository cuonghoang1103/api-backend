/**
 * MAC103 — Calculus (Giải tích). Ngành Robotics & AI, FPTU, Kỳ 1.
 * Khung 8 chương song ngữ VI+EN. Nguồn: Stewart "Calculus: Early
 * Transcendentals"; Thomas "Calculus"; MIT 18.01/18.02 OCW; Paul's Online
 * Math Notes; 3Blue1Brown "Essence of Calculus".
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; công thức
 * viết bằng chữ Latin (lim, dx, integral, delta), KHÔNG ký tự Hy Lạp/Cyrillic.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mac103-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Stewart, Thomas), MIT OCW, Paul\'s Notes, 3Blue1Brown, công cụ (SymPy, Desmos), lộ trình tự học.',
  [[
    `<span class="eyebrow">MAC103 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Calculus</strong> — limits, derivatives, integrals, series and multivariable calculus — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MAC103 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>James Stewart — <em>Calculus: Early Transcendentals</em> (the primary reference for this course)</li>
<li>George B. Thomas — <em>Thomas' Calculus</em></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" target="_blank" rel="noopener">MIT 18.01 — Single Variable Calculus (OCW)</a></li>
<li><a href="https://ocw.mit.edu/courses/18-02-multivariable-calculus-fall-2007/" target="_blank" rel="noopener">MIT 18.02 — Multivariable Calculus (OCW)</a></li>
<li><a href="https://tutorial.math.lamar.edu/" target="_blank" rel="noopener">Paul's Online Math Notes</a> — clear, worked examples</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" target="_blank" rel="noopener">3Blue1Brown — Essence of Calculus</a> — the visual intuition</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — step-by-step practice</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos Graphing Calculator</a> — plot functions instantly</li>
<li><a href="https://www.sympy.org/" target="_blank" rel="noopener">SymPy</a> — symbolic maths in Python (differentiate/integrate)</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — check answers &amp; steps</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — limits &amp; continuity, the derivative and its rules.</li>
<li><strong>Practice</strong> — differentiate and integrate by hand, then verify with SymPy/Desmos.</li>
<li><strong>Go deeper</strong> — optimization, series (Taylor), and multivariable calculus.</li>
<li><strong>Job-ready (AI/robotics)</strong> — gradients and gradient descent, the engine behind machine learning.</li>
</ol></div>`,
    `<span class="eyebrow">MAC103 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Giải tích</strong> — giới hạn, đạo hàm, tích phân, chuỗi và giải tích nhiều biến — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MAC103 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>James Stewart — <em>Calculus: Early Transcendentals</em> (giáo trình chính của môn)</li>
<li>George B. Thomas — <em>Thomas' Calculus</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" target="_blank" rel="noopener">MIT 18.01 — Giải tích một biến (OCW)</a></li>
<li><a href="https://ocw.mit.edu/courses/18-02-multivariable-calculus-fall-2007/" target="_blank" rel="noopener">MIT 18.02 — Giải tích nhiều biến (OCW)</a></li>
<li><a href="https://tutorial.math.lamar.edu/" target="_blank" rel="noopener">Paul's Online Math Notes</a> — ví dụ mẫu rõ ràng</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" target="_blank" rel="noopener">3Blue1Brown — Essence of Calculus</a> — trực giác bằng hình ảnh</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — luyện tập từng bước</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos Graphing Calculator</a> — vẽ đồ thị hàm số tức thì</li>
<li><a href="https://www.sympy.org/" target="_blank" rel="noopener">SymPy</a> — toán ký hiệu trong Python (lấy đạo hàm/tích phân)</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — kiểm tra đáp án &amp; các bước</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — giới hạn &amp; liên tục, đạo hàm và các quy tắc tính.</li>
<li><strong>Luyện tập</strong> — lấy đạo hàm và tích phân bằng tay, rồi kiểm lại bằng SymPy/Desmos.</li>
<li><strong>Đào sâu</strong> — bài toán tối ưu, chuỗi (Taylor), và giải tích nhiều biến.</li>
<li><strong>Sẵn sàng đi làm (AI/robotics)</strong> — gradient và gradient descent, động cơ đằng sau machine learning.</li>
</ol></div>`,
  ]]);

const intro = doc('mac103-0-1-overview', 'Course overview: Calculus|||Tổng quan: Giải tích',
  'Giải tích nghiên cứu sự thay đổi (đạo hàm) và tích luỹ (tích phân); hai ý tưởng nối nhau bằng định lý cơ bản. Lộ trình: giới hạn → đạo hàm & ứng dụng → tích phân → chuỗi → nhiều biến → gradient descent cho AI.',
  [[
    `<span class="eyebrow">MAC103 · Lesson 0.1 · Overview</span>
<h2>Calculus — the mathematics of change</h2>
<p class="lead">Calculus is the study of <strong>change</strong> and <strong>accumulation</strong>. It answers two questions that appear everywhere in robotics and AI: <em>how fast is something changing right now?</em> (the derivative) and <em>how much has accumulated over an interval?</em> (the integral).</p>
<h3>The two big ideas</h3>
<ul>
<li><strong>Differentiation</strong> — zoom in on a curve until it looks straight; the slope of that line is the <strong>rate of change</strong>. Velocity is the derivative of position.</li>
<li><strong>Integration</strong> — add up infinitely many tiny slices to get a total: area under a curve, distance from velocity, probability from a density.</li>
</ul>
<p>The <strong>Fundamental Theorem of Calculus</strong> says these two are inverses of each other — differentiation and integration undo one another.</p>
<h3>Why it matters for AI &amp; robotics</h3>
<p>Training a neural network is <strong>minimising a loss function</strong>, and the tool that does it is <strong>gradient descent</strong> — pure calculus. A robot arm's motion, a control loop, and probability itself all rest on derivatives and integrals.</p>
<h3>Roadmap</h3>
<p>Limits &amp; continuity → derivatives &amp; rules → applications (optimization) → integrals → techniques &amp; applications → series (Taylor) → multivariable &amp; the gradient → multiple integrals &amp; gradient descent. Bilingual, with worked examples and Python/SymPy.</p>`,
    `<span class="eyebrow">MAC103 · Bài 0.1 · Tổng quan</span>
<h2>Giải tích — toán học của sự thay đổi</h2>
<p class="lead">Giải tích nghiên cứu <strong>sự thay đổi</strong> và <strong>sự tích luỹ</strong>. Nó trả lời hai câu hỏi có mặt khắp nơi trong robotics và AI: <em>ngay lúc này một thứ đang thay đổi nhanh cỡ nào?</em> (đạo hàm) và <em>đã tích luỹ được bao nhiêu trên một khoảng?</em> (tích phân).</p>
<h3>Hai ý tưởng lớn</h3>
<ul>
<li><strong>Đạo hàm (differentiation)</strong> — phóng to một đường cong đến khi nó trông thẳng; độ dốc của đường thẳng đó là <strong>tốc độ thay đổi</strong>. Vận tốc là đạo hàm của vị trí.</li>
<li><strong>Tích phân (integration)</strong> — cộng vô số lát cắt bé xíu để ra tổng: diện tích dưới đường cong, quãng đường từ vận tốc, xác suất từ mật độ.</li>
</ul>
<p><strong>Định lý cơ bản của giải tích</strong> nói hai phép này ngược nhau — đạo hàm và tích phân hoàn tác lẫn nhau.</p>
<h3>Vì sao quan trọng với AI &amp; robotics</h3>
<p>Huấn luyện một mạng nơ-ron chính là <strong>cực tiểu hoá hàm mất mát (loss)</strong>, và công cụ làm việc đó là <strong>gradient descent</strong> — giải tích thuần tuý. Chuyển động của cánh tay robot, vòng điều khiển, và cả xác suất đều dựa trên đạo hàm và tích phân.</p>
<h3>Lộ trình</h3>
<p>Giới hạn &amp; liên tục → đạo hàm &amp; quy tắc → ứng dụng (tối ưu) → tích phân → kỹ thuật &amp; ứng dụng → chuỗi (Taylor) → nhiều biến &amp; gradient → tích phân bội &amp; gradient descent. Song ngữ, có ví dụ mẫu và Python/SymPy.</p>`,
  ]]);

const c1 = doc('mac103-1-1-limits', '1.1 — Functions, limits & continuity|||1.1 — Hàm số, giới hạn & tính liên tục',
  'Hàm số (miền/tập giá trị); giới hạn (giá trị hàm tiến tới khi x tiến tới a), giới hạn một bên; tính liên tục; giới hạn quan trọng (sin x)/x → 1.',
  [[
    `<span class="eyebrow">MAC103 · Chapter 1 · Lesson 1.1</span>
<h2>Functions, limits &amp; continuity</h2>
<h3>Functions</h3>
<p>A <strong>function</strong> f maps each input x (from its <em>domain</em>) to exactly one output f(x) (in its <em>range</em>). Think of it as a machine: put x in, get f(x) out.</p>
<h3>The limit — the heart of calculus</h3>
<p>The <strong>limit</strong> "lim x -&gt; a of f(x) = L" means: as x gets arbitrarily close to a, f(x) gets arbitrarily close to L. The value f(a) itself may not even exist — the limit is about the <em>approach</em>, not the destination.</p>
<pre><code>Example: lim x -&gt; 2 of (x^2 - 4)/(x - 2)
  At x = 2 the formula is 0/0 (undefined).
  Factor: (x^2 - 4)/(x - 2) = (x-2)(x+2)/(x-2) = x + 2
  So the limit = 2 + 2 = 4  (even though f(2) is undefined)
</code></pre>
<p><strong>One-sided limits</strong> approach from the left (x -&gt; a-) or right (x -&gt; a+); the two-sided limit exists only when both agree.</p>
<h3>Continuity</h3>
<p>f is <strong>continuous</strong> at a when lim x -&gt; a of f(x) = f(a) — no jumps, holes or breaks. Intuitively you can draw it without lifting the pen.</p>
<div class="callout"><span class="badge">Key limit</span> lim x -&gt; 0 of (sin x)/x = 1. It is the reason the derivative of sin is cos, and it appears all over signal processing.</div>`,
    `<span class="eyebrow">MAC103 · Chương 1 · Bài 1.1</span>
<h2>Hàm số, giới hạn &amp; tính liên tục</h2>
<h3>Hàm số</h3>
<p>Một <strong>hàm số</strong> f gán mỗi đầu vào x (thuộc <em>miền xác định</em>) đúng một đầu ra f(x) (thuộc <em>tập giá trị</em>). Hãy hình dung như một cỗ máy: bỏ x vào, nhận f(x) ra.</p>
<h3>Giới hạn — trái tim của giải tích</h3>
<p><strong>Giới hạn</strong> "lim x -&gt; a của f(x) = L" nghĩa là: khi x tiến sát a tuỳ ý, f(x) tiến sát L tuỳ ý. Bản thân giá trị f(a) có thể không tồn tại — giới hạn nói về <em>sự tiến tới</em>, không phải điểm đích.</p>
<pre><code>Ví dụ: lim x -&gt; 2 của (x^2 - 4)/(x - 2)
  Tại x = 2 biểu thức là 0/0 (không xác định).
  Phân tích: (x^2 - 4)/(x - 2) = (x-2)(x+2)/(x-2) = x + 2
  Vậy giới hạn = 2 + 2 = 4  (dù f(2) không xác định)
</code></pre>
<p><strong>Giới hạn một bên</strong> tiến từ trái (x -&gt; a-) hoặc phải (x -&gt; a+); giới hạn hai bên chỉ tồn tại khi cả hai bằng nhau.</p>
<h3>Tính liên tục</h3>
<p>f <strong>liên tục</strong> tại a khi lim x -&gt; a của f(x) = f(a) — không nhảy, không lỗ hổng, không đứt. Trực giác: vẽ được mà không nhấc bút.</p>
<div class="callout"><span class="badge">Giới hạn quan trọng</span> lim x -&gt; 0 của (sin x)/x = 1. Đây là lý do đạo hàm của sin là cos, và nó xuất hiện khắp xử lý tín hiệu.</div>`,
  ]]);

const c1q = quiz('mac103-quiz-1', 'Quiz 1 — Limits & continuity|||Quiz 1 — Giới hạn & liên tục', [
  { id: 'q1', question: 'Giới hạn "lim x -> a của f(x) = L" mô tả điều gì?', options: ['Giá trị f(a) chính xác', 'Giá trị f tiến tới khi x tiến sát a', 'Độ dốc tại a', 'Diện tích dưới đồ thị'], correctIndex: 1, explanation: 'Giới hạn nói về giá trị hàm tiến tới khi x tiến sát a, không nhất thiết bằng f(a).' },
  { id: 'q2', question: 'Tính lim x -> 2 của (x^2 - 4)/(x - 2).', options: ['0', '2', '4', 'Không tồn tại'], correctIndex: 2, explanation: 'Phân tích (x-2)(x+2)/(x-2) = x + 2; thay x = 2 được 4.' },
  { id: 'q3', question: 'Hàm f liên tục tại a khi nào?', options: ['f(a) tồn tại là đủ', 'lim x -> a của f(x) = f(a)', 'f có đạo hàm tại a', 'Đồ thị đi qua gốc toạ độ'], correctIndex: 1, explanation: 'Liên tục tại a đòi hỏi giới hạn tồn tại và bằng đúng giá trị hàm f(a).' },
]);

const c2 = doc('mac103-2-1-derivatives', '2.1 — Derivatives & rules of differentiation|||2.1 — Đạo hàm & quy tắc tính đạo hàm',
  'Đạo hàm là độ dốc tiếp tuyến / tốc độ thay đổi (giới hạn của tỉ số sai phân); quy tắc: luỹ thừa, tích, thương, hàm hợp (chain rule).',
  [[
    `<span class="eyebrow">MAC103 · Chapter 2 · Lesson 2.1</span>
<h2>Derivatives &amp; rules of differentiation</h2>
<h3>What a derivative is</h3>
<p>The <strong>derivative</strong> f'(x) is the instantaneous rate of change of f — the slope of the tangent line. It is the limit of a difference quotient as the gap shrinks to zero:</p>
<pre><code>f'(x) = lim h -&gt; 0 of [ f(x + h) - f(x) ] / h

Example (power rule from the definition):
  f(x) = x^2
  f'(x) = lim h-&gt;0 of [ (x+h)^2 - x^2 ] / h
        = lim h-&gt;0 of [ 2xh + h^2 ] / h
        = lim h-&gt;0 of ( 2x + h ) = 2x
</code></pre>
<h3>The rules you use every day</h3>
<ul>
<li><strong>Power rule:</strong> d/dx of x^n = n * x^(n-1)</li>
<li><strong>Constant multiple / sum:</strong> derivatives are linear.</li>
<li><strong>Product rule:</strong> (u*v)' = u'*v + u*v'</li>
<li><strong>Quotient rule:</strong> (u/v)' = (u'*v - u*v') / v^2</li>
<li><strong>Chain rule:</strong> if y = f(g(x)) then dy/dx = f'(g(x)) * g'(x)</li>
</ul>
<pre><code>Python (SymPy):
  from sympy import symbols, diff, sin
  x = symbols('x')
  diff(sin(x**2), x)      # -&gt; 2*x*cos(x**2)   (chain rule)
</code></pre>
<div class="callout"><span class="badge">Chain rule = backprop</span> Backpropagation in neural networks is just the chain rule applied layer by layer.</div>`,
    `<span class="eyebrow">MAC103 · Chương 2 · Bài 2.1</span>
<h2>Đạo hàm &amp; quy tắc tính đạo hàm</h2>
<h3>Đạo hàm là gì</h3>
<p><strong>Đạo hàm</strong> f'(x) là tốc độ thay đổi tức thời của f — độ dốc của tiếp tuyến. Nó là giới hạn của tỉ số sai phân khi khoảng cách co về 0:</p>
<pre><code>f'(x) = lim h -&gt; 0 của [ f(x + h) - f(x) ] / h

Ví dụ (quy tắc luỹ thừa từ định nghĩa):
  f(x) = x^2
  f'(x) = lim h-&gt;0 của [ (x+h)^2 - x^2 ] / h
        = lim h-&gt;0 của [ 2xh + h^2 ] / h
        = lim h-&gt;0 của ( 2x + h ) = 2x
</code></pre>
<h3>Các quy tắc dùng hằng ngày</h3>
<ul>
<li><strong>Quy tắc luỹ thừa:</strong> d/dx của x^n = n * x^(n-1)</li>
<li><strong>Hằng số nhân / tổng:</strong> đạo hàm có tính tuyến tính.</li>
<li><strong>Quy tắc tích:</strong> (u*v)' = u'*v + u*v'</li>
<li><strong>Quy tắc thương:</strong> (u/v)' = (u'*v - u*v') / v^2</li>
<li><strong>Quy tắc hàm hợp (chain rule):</strong> nếu y = f(g(x)) thì dy/dx = f'(g(x)) * g'(x)</li>
</ul>
<pre><code>Python (SymPy):
  from sympy import symbols, diff, sin
  x = symbols('x')
  diff(sin(x**2), x)      # -&gt; 2*x*cos(x**2)   (quy tắc hàm hợp)
</code></pre>
<div class="callout"><span class="badge">Chain rule = backprop</span> Lan truyền ngược (backpropagation) trong mạng nơ-ron chính là quy tắc hàm hợp áp dụng từng lớp.</div>`,
  ]]);

const c2q = quiz('mac103-quiz-2', 'Quiz 2 — Derivatives|||Quiz 2 — Đạo hàm', [
  { id: 'q1', question: 'Đạo hàm f\'(x) biểu diễn điều gì về hình học?', options: ['Diện tích dưới đồ thị', 'Độ dốc tiếp tuyến tại điểm', 'Giá trị lớn nhất của hàm', 'Chu kỳ của hàm'], correctIndex: 1, explanation: 'Đạo hàm là độ dốc tiếp tuyến, tức tốc độ thay đổi tức thời của hàm.' },
  { id: 'q2', question: 'Theo quy tắc luỹ thừa, đạo hàm của x^3 là?', options: ['3x', 'x^2', '3x^2', 'x^3/3'], correctIndex: 2, explanation: 'd/dx của x^n = n*x^(n-1); với n = 3 được 3x^2.' },
  { id: 'q3', question: 'Đạo hàm của hàm hợp f(g(x)) theo chain rule là?', options: ['f\'(x)*g\'(x)', 'f\'(g(x)) * g\'(x)', 'f(g\'(x))', 'f\'(g(x)) + g\'(x)'], correctIndex: 1, explanation: 'Chain rule: dy/dx = f\'(g(x)) * g\'(x) — đạo hàm ngoài nhân đạo hàm trong.' },
]);

const c3 = doc('mac103-3-1-applications', '3.1 — Applications of derivatives|||3.1 — Ứng dụng đạo hàm',
  'Điểm tới hạn (f\' = 0), test đạo hàm bậc nhất/bậc hai để tìm cực đại/cực tiểu; bài toán tối ưu; đồ thị (tăng/giảm, lồi/lõm).',
  [[
    `<span class="eyebrow">MAC103 · Chapter 3 · Lesson 3.1</span>
<h2>Applications of derivatives</h2>
<h3>Finding maxima &amp; minima</h3>
<p>At a peak or valley the tangent is flat, so f'(x) = 0. Such x are <strong>critical points</strong>. To classify them:</p>
<ul>
<li><strong>First-derivative test:</strong> f' goes + to - at a local <em>maximum</em>; - to + at a local <em>minimum</em>.</li>
<li><strong>Second-derivative test:</strong> if f'(x) = 0 and f''(x) &gt; 0 it is a minimum (curve opens up); if f''(x) &lt; 0 a maximum.</li>
</ul>
<h3>Shape of a graph</h3>
<p>f' &gt; 0 means <strong>increasing</strong>, f' &lt; 0 <strong>decreasing</strong>. f'' &gt; 0 means <strong>concave up</strong> (cup), f'' &lt; 0 <strong>concave down</strong> (cap); where concavity flips is an <strong>inflection point</strong>.</p>
<h3>Optimization — a worked example</h3>
<pre><code>Fence 20 m along a wall to enclose the largest rectangle.
  Let width = x, so height = (20 - 2x) each side... solve:
  Area A(x) = x * (20 - 2x) = 20x - 2x^2
  A'(x) = 20 - 4x = 0  ->  x = 5
  A''(x) = -4 &lt; 0  ->  maximum
  Best: x = 5 m, area = 50 m^2
</code></pre>
<div class="callout"><span class="badge">Minimising loss</span> Setting the derivative to zero to find a minimum is exactly what training an ML model tries to do — but numerically, via gradient descent.</div>`,
    `<span class="eyebrow">MAC103 · Chương 3 · Bài 3.1</span>
<h2>Ứng dụng đạo hàm</h2>
<h3>Tìm cực đại &amp; cực tiểu</h3>
<p>Tại đỉnh hoặc đáy tiếp tuyến nằm ngang, nên f'(x) = 0. Những x đó là <strong>điểm tới hạn</strong>. Để phân loại:</p>
<ul>
<li><strong>Test đạo hàm bậc nhất:</strong> f' đổi từ + sang - tại <em>cực đại</em>; từ - sang + tại <em>cực tiểu</em>.</li>
<li><strong>Test đạo hàm bậc hai:</strong> nếu f'(x) = 0 và f''(x) &gt; 0 thì là cực tiểu (cong hướng lên); nếu f''(x) &lt; 0 thì là cực đại.</li>
</ul>
<h3>Dạng của đồ thị</h3>
<p>f' &gt; 0 nghĩa là <strong>đồng biến (tăng)</strong>, f' &lt; 0 <strong>nghịch biến (giảm)</strong>. f'' &gt; 0 là <strong>lồi hướng lên</strong> (lõm chén), f'' &lt; 0 <strong>lồi hướng xuống</strong>; chỗ đổi chiều lồi lõm là <strong>điểm uốn</strong>.</p>
<h3>Bài toán tối ưu — ví dụ mẫu</h3>
<pre><code>Dùng 20 m rào dọc một bức tường để quây hình chữ nhật lớn nhất.
  Gọi chiều rộng = x, chiều còn lại = (20 - 2x)... giải:
  Diện tích A(x) = x * (20 - 2x) = 20x - 2x^2
  A'(x) = 20 - 4x = 0  ->  x = 5
  A''(x) = -4 &lt; 0  ->  cực đại
  Tối ưu: x = 5 m, diện tích = 50 m^2
</code></pre>
<div class="callout"><span class="badge">Cực tiểu hoá loss</span> Đặt đạo hàm bằng 0 để tìm cực tiểu chính là điều huấn luyện mô hình ML hướng tới — nhưng làm bằng số, qua gradient descent.</div>`,
  ]]);

const c3q = quiz('mac103-quiz-3', 'Quiz 3 — Applications of derivatives|||Quiz 3 — Ứng dụng đạo hàm', [
  { id: 'q1', question: 'Điểm tới hạn của hàm f xuất hiện ở đâu?', options: ['Nơi f = 0', 'Nơi f\'(x) = 0 (hoặc f\' không xác định)', 'Nơi f\'\' = 0', 'Ở hai đầu miền'], correctIndex: 1, explanation: 'Điểm tới hạn là nơi đạo hàm bậc nhất bằng 0 hoặc không xác định — ứng viên cho cực trị.' },
  { id: 'q2', question: 'Nếu f\'(x) = 0 và f\'\'(x) > 0 tại x thì điểm đó là?', options: ['Cực đại', 'Cực tiểu', 'Điểm uốn', 'Không kết luận được'], correctIndex: 1, explanation: 'f\'\' > 0 nghĩa là đồ thị lồi hướng lên (lõm chén) nên điểm tới hạn là cực tiểu.' },
  { id: 'q3', question: 'Với A(x) = 20x - 2x^2, diện tích lớn nhất đạt tại x bằng?', options: ['2', '4', '5', '10'], correctIndex: 2, explanation: 'A\'(x) = 20 - 4x = 0 cho x = 5; A\'\' = -4 < 0 nên đó là cực đại.' },
]);

const c4 = doc('mac103-4-1-integrals', '4.1 — Indefinite & definite integrals|||4.1 — Tích phân bất định & xác định',
  'Nguyên hàm (đảo của đạo hàm) + hằng số C; tích phân xác định = diện tích có dấu (giới hạn tổng Riemann); định lý cơ bản của giải tích.',
  [[
    `<span class="eyebrow">MAC103 · Chapter 4 · Lesson 4.1</span>
<h2>Indefinite &amp; definite integrals</h2>
<h3>The antiderivative (indefinite integral)</h3>
<p>Integration reverses differentiation. The <strong>indefinite integral</strong> "integral of f(x) dx" is the family of functions whose derivative is f. Because the derivative of a constant is 0, we always add <strong>+ C</strong>:</p>
<pre><code>integral of x^n dx = x^(n+1)/(n+1) + C     (n != -1)
integral of 1/x dx  = ln|x| + C
integral of cos x dx = sin x + C
</code></pre>
<h3>The definite integral — signed area</h3>
<p>The <strong>definite integral</strong> "integral from a to b of f(x) dx" is the <em>signed area</em> between the curve and the x-axis. It is defined as the limit of a <strong>Riemann sum</strong> — chop [a,b] into n strips of width delta-x, add up f(x)*delta-x, and let n go to infinity.</p>
<h3>The Fundamental Theorem of Calculus</h3>
<p>The bridge between the two: if F is an antiderivative of f, then</p>
<pre><code>integral from a to b of f(x) dx = F(b) - F(a)

Example:
  integral from 0 to 3 of x^2 dx = [ x^3/3 ] from 0 to 3
                                  = 27/3 - 0 = 9
</code></pre>
<div class="callout"><span class="badge">Why +C matters</span> Every function with slope f differs only by a constant — the definite integral cancels C out, which is why F(b) - F(a) gives one number.</div>`,
    `<span class="eyebrow">MAC103 · Chương 4 · Bài 4.1</span>
<h2>Tích phân bất định &amp; xác định</h2>
<h3>Nguyên hàm (tích phân bất định)</h3>
<p>Tích phân đảo ngược đạo hàm. <strong>Tích phân bất định</strong> "integral của f(x) dx" là họ các hàm có đạo hàm bằng f. Vì đạo hàm của hằng số là 0, ta luôn cộng <strong>+ C</strong>:</p>
<pre><code>integral của x^n dx = x^(n+1)/(n+1) + C     (n != -1)
integral của 1/x dx  = ln|x| + C
integral của cos x dx = sin x + C
</code></pre>
<h3>Tích phân xác định — diện tích có dấu</h3>
<p><strong>Tích phân xác định</strong> "integral từ a đến b của f(x) dx" là <em>diện tích có dấu</em> giữa đường cong và trục x. Nó được định nghĩa là giới hạn của <strong>tổng Riemann</strong> — chia [a,b] thành n dải rộng delta-x, cộng f(x)*delta-x, rồi cho n tiến tới vô cực.</p>
<h3>Định lý cơ bản của giải tích</h3>
<p>Cầu nối giữa hai khái niệm: nếu F là nguyên hàm của f, thì</p>
<pre><code>integral từ a đến b của f(x) dx = F(b) - F(a)

Ví dụ:
  integral từ 0 đến 3 của x^2 dx = [ x^3/3 ] từ 0 đến 3
                                 = 27/3 - 0 = 9
</code></pre>
<div class="callout"><span class="badge">Vì sao cần +C</span> Mọi hàm có độ dốc f chỉ khác nhau một hằng số — tích phân xác định triệt tiêu C, nên F(b) - F(a) cho ra một con số duy nhất.</div>`,
  ]]);

const c4q = quiz('mac103-quiz-4', 'Quiz 4 — Integrals|||Quiz 4 — Tích phân', [
  { id: 'q1', question: 'Vì sao tích phân bất định luôn kèm "+ C"?', options: ['Để làm tròn số', 'Vì đạo hàm của hằng số bằng 0 nên có vô số nguyên hàm', 'Vì C là diện tích', 'Vì quy ước ký hiệu'], correctIndex: 1, explanation: 'Đạo hàm của hằng số là 0, nên mọi nguyên hàm chỉ khác nhau một hằng số C.' },
  { id: 'q2', question: 'Tích phân xác định "integral từ a đến b của f(x) dx" biểu diễn?', options: ['Độ dốc tại b', 'Diện tích có dấu giữa đường cong và trục x trên [a,b]', 'Giá trị f(b)', 'Số điểm tới hạn'], correctIndex: 1, explanation: 'Đó là diện tích có dấu, định nghĩa qua giới hạn tổng Riemann.' },
  { id: 'q3', question: 'Tính integral từ 0 đến 3 của x^2 dx.', options: ['3', '9', '18', '27'], correctIndex: 1, explanation: 'Nguyên hàm x^3/3; thay cận: 27/3 - 0 = 9 (định lý cơ bản của giải tích).' },
]);

const c5 = doc('mac103-5-1-techniques', '5.1 — Integration techniques & applications|||5.1 — Kỹ thuật tích phân & ứng dụng',
  'Đổi biến (substitution), tích phân từng phần; ứng dụng: diện tích giữa hai đường cong, thể tích khối tròn xoay (đĩa).',
  [[
    `<span class="eyebrow">MAC103 · Chapter 5 · Lesson 5.1</span>
<h2>Integration techniques &amp; applications</h2>
<h3>Substitution (reverse chain rule)</h3>
<p>When the integrand contains a function and its derivative, substitute u = g(x), du = g'(x) dx:</p>
<pre><code>integral of 2x * cos(x^2) dx    let u = x^2, du = 2x dx
  = integral of cos(u) du = sin(u) + C = sin(x^2) + C
</code></pre>
<h3>Integration by parts (reverse product rule)</h3>
<pre><code>integral of u dv = u*v - integral of v du

Example: integral of x * e^x dx
  u = x, dv = e^x dx  ->  du = dx, v = e^x
  = x*e^x - integral of e^x dx = x*e^x - e^x + C
</code></pre>
<h3>Application 1 — area between curves</h3>
<p>The area between y = f(x) (top) and y = g(x) (bottom) from a to b is integral from a to b of [ f(x) - g(x) ] dx.</p>
<h3>Application 2 — volume of revolution (disk method)</h3>
<pre><code>Rotate y = f(x) about the x-axis on [a,b]:
  Volume = integral from a to b of pi * [ f(x) ]^2 dx
  (each thin slice is a disk of area pi * radius^2)
</code></pre>
<div class="callout"><span class="badge">Same idea, many uses</span> "Slice, approximate, sum, take the limit" gives area, volume, work, mass and expected value alike.</div>`,
    `<span class="eyebrow">MAC103 · Chương 5 · Bài 5.1</span>
<h2>Kỹ thuật tích phân &amp; ứng dụng</h2>
<h3>Đổi biến (đảo của chain rule)</h3>
<p>Khi biểu thức dưới dấu tích phân chứa một hàm và đạo hàm của nó, đặt u = g(x), du = g'(x) dx:</p>
<pre><code>integral của 2x * cos(x^2) dx    đặt u = x^2, du = 2x dx
  = integral của cos(u) du = sin(u) + C = sin(x^2) + C
</code></pre>
<h3>Tích phân từng phần (đảo của quy tắc tích)</h3>
<pre><code>integral của u dv = u*v - integral của v du

Ví dụ: integral của x * e^x dx
  u = x, dv = e^x dx  ->  du = dx, v = e^x
  = x*e^x - integral của e^x dx = x*e^x - e^x + C
</code></pre>
<h3>Ứng dụng 1 — diện tích giữa hai đường cong</h3>
<p>Diện tích giữa y = f(x) (trên) và y = g(x) (dưới) từ a đến b là integral từ a đến b của [ f(x) - g(x) ] dx.</p>
<h3>Ứng dụng 2 — thể tích khối tròn xoay (phương pháp đĩa)</h3>
<pre><code>Quay y = f(x) quanh trục x trên [a,b]:
  Thể tích = integral từ a đến b của pi * [ f(x) ]^2 dx
  (mỗi lát mỏng là một đĩa diện tích pi * bán_kính^2)
</code></pre>
<div class="callout"><span class="badge">Một ý tưởng, nhiều ứng dụng</span> "Cắt lát, xấp xỉ, cộng lại, lấy giới hạn" cho ra diện tích, thể tích, công, khối lượng và cả kỳ vọng.</div>`,
  ]]);

const c5q = quiz('mac103-quiz-5', 'Quiz 5 — Techniques & applications|||Quiz 5 — Kỹ thuật & ứng dụng', [
  { id: 'q1', question: 'Phương pháp đổi biến (substitution) là đảo ngược của quy tắc nào?', options: ['Quy tắc tích', 'Quy tắc thương', 'Quy tắc hàm hợp (chain rule)', 'Quy tắc luỹ thừa'], correctIndex: 2, explanation: 'Đổi biến u = g(x) là chiều ngược của chain rule khi lấy tích phân.' },
  { id: 'q2', question: 'Diện tích giữa đường trên f(x) và đường dưới g(x) trên [a,b] tính bằng?', options: ['integral của f(x)*g(x) dx', 'integral của [f(x) - g(x)] dx', 'integral của [f(x) + g(x)] dx', 'f(b) - g(a)'], correctIndex: 1, explanation: 'Lấy tích phân hiệu (trên trừ dưới) trên khoảng [a,b].' },
  { id: 'q3', question: 'Thể tích khối tròn xoay quay y = f(x) quanh trục x (phương pháp đĩa) là?', options: ['integral của pi * [f(x)]^2 dx', 'integral của 2*pi*x dx', 'integral của f(x) dx', 'pi * f(b)^2'], correctIndex: 0, explanation: 'Mỗi lát là đĩa diện tích pi*[f(x)]^2; tích phân trên [a,b] cho thể tích.' },
]);

const c6 = doc('mac103-6-1-series', '6.1 — Sequences, series & Taylor series|||6.1 — Chuỗi số & chuỗi luỹ thừa (Taylor)',
  'Dãy & chuỗi, hội tụ/phân kỳ (chuỗi hình học, p-chuỗi); chuỗi luỹ thừa; khai triển Taylor/Maclaurin xấp xỉ hàm bằng đa thức.',
  [[
    `<span class="eyebrow">MAC103 · Chapter 6 · Lesson 6.1</span>
<h2>Sequences, series &amp; Taylor series</h2>
<h3>Sequences &amp; series</h3>
<p>A <strong>sequence</strong> is an ordered list a1, a2, a3, ...; a <strong>series</strong> is their sum. A series <strong>converges</strong> if the partial sums approach a finite limit, otherwise it <strong>diverges</strong>.</p>
<pre><code>Geometric series (|r| &lt; 1):
  1 + r + r^2 + r^3 + ... = 1 / (1 - r)
  e.g. r = 1/2 -&gt; sum = 2

p-series (sum of 1/n^p): converges when p &gt; 1, diverges when p &lt;= 1
  (the harmonic series 1 + 1/2 + 1/3 + ... diverges)
</code></pre>
<h3>Power series &amp; Taylor expansion</h3>
<p>A <strong>power series</strong> represents a function as an infinite polynomial. The <strong>Taylor series</strong> of f about a builds it from the derivatives at a; centred at 0 it is the <strong>Maclaurin series</strong>:</p>
<pre><code>f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)^2/2! + ...

Famous Maclaurin series:
  e^x   = 1 + x + x^2/2! + x^3/3! + ...
  sin x = x - x^3/3! + x^5/5! - ...
  cos x = 1 - x^2/2! + x^4/4! - ...
</code></pre>
<div class="callout"><span class="badge">Why computers love this</span> Calculators and libraries evaluate sin, cos and e^x by summing a few Taylor terms — turning hard functions into simple arithmetic.</div>`,
    `<span class="eyebrow">MAC103 · Chương 6 · Bài 6.1</span>
<h2>Dãy, chuỗi &amp; chuỗi Taylor</h2>
<h3>Dãy số &amp; chuỗi số</h3>
<p>Một <strong>dãy số</strong> là danh sách có thứ tự a1, a2, a3, ...; một <strong>chuỗi số</strong> là tổng của chúng. Chuỗi <strong>hội tụ</strong> nếu tổng riêng tiến tới một giới hạn hữu hạn, ngược lại thì <strong>phân kỳ</strong>.</p>
<pre><code>Chuỗi hình học (|r| &lt; 1):
  1 + r + r^2 + r^3 + ... = 1 / (1 - r)
  vd r = 1/2 -&gt; tổng = 2

p-chuỗi (tổng của 1/n^p): hội tụ khi p &gt; 1, phân kỳ khi p &lt;= 1
  (chuỗi điều hoà 1 + 1/2 + 1/3 + ... phân kỳ)
</code></pre>
<h3>Chuỗi luỹ thừa &amp; khai triển Taylor</h3>
<p>Một <strong>chuỗi luỹ thừa</strong> biểu diễn hàm như một đa thức vô hạn. <strong>Chuỗi Taylor</strong> của f quanh a dựng hàm từ các đạo hàm tại a; lấy tâm tại 0 thì gọi là <strong>chuỗi Maclaurin</strong>:</p>
<pre><code>f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)^2/2! + ...

Các chuỗi Maclaurin nổi tiếng:
  e^x   = 1 + x + x^2/2! + x^3/3! + ...
  sin x = x - x^3/3! + x^5/5! - ...
  cos x = 1 - x^2/2! + x^4/4! - ...
</code></pre>
<div class="callout"><span class="badge">Vì sao máy tính thích điều này</span> Máy tính và thư viện tính sin, cos, e^x bằng cách cộng vài số hạng Taylor — biến hàm khó thành phép tính số học đơn giản.</div>`,
  ]]);

const c6q = quiz('mac103-quiz-6', 'Quiz 6 — Series & Taylor|||Quiz 6 — Chuỗi & Taylor', [
  { id: 'q1', question: 'Tổng chuỗi hình học 1 + r + r^2 + ... với |r| < 1 bằng?', options: ['1 - r', '1/(1 - r)', 'r/(1 - r)', 'Vô cực'], correctIndex: 1, explanation: 'Chuỗi hình học hội tụ về 1/(1 - r) khi |r| < 1.' },
  { id: 'q2', question: 'p-chuỗi (tổng 1/n^p) hội tụ khi nào?', options: ['p > 1', 'p < 1', 'p = 1', 'Mọi p'], correctIndex: 0, explanation: 'p-chuỗi hội tụ khi p > 1; với p <= 1 (kể cả chuỗi điều hoà p = 1) thì phân kỳ.' },
  { id: 'q3', question: 'Chuỗi Maclaurin của e^x là?', options: ['1 - x + x^2/2! - ...', '1 + x + x^2/2! + x^3/3! + ...', 'x - x^3/3! + x^5/5! - ...', '1 - x^2/2! + x^4/4! - ...'], correctIndex: 1, explanation: 'e^x = 1 + x + x^2/2! + x^3/3! + ...; các đạo hàm của e^x tại 0 đều bằng 1.' },
]);

const c7 = doc('mac103-7-1-multivariable', '7.1 — Multivariable functions, partial derivatives & gradient|||7.1 — Hàm nhiều biến, đạo hàm riêng & gradient',
  'Hàm nhiều biến f(x,y); đạo hàm riêng (giữ biến kia cố định); gradient = vector các đạo hàm riêng, chỉ hướng tăng nhanh nhất.',
  [[
    `<span class="eyebrow">MAC103 · Chapter 7 · Lesson 7.1</span>
<h2>Multivariable functions, partial derivatives &amp; the gradient</h2>
<h3>Functions of several variables</h3>
<p>Real models rarely depend on one input. A <strong>multivariable function</strong> f(x, y) has a surface as its graph — for each (x, y) it gives a height z. A loss function in ML depends on thousands of parameters at once.</p>
<h3>Partial derivatives</h3>
<p>A <strong>partial derivative</strong> measures the rate of change in ONE direction, holding the others fixed. We write it with a rounded d:</p>
<pre><code>f(x, y) = x^2 + 3*x*y + y^2

partial f / partial x = 2x + 3y     (treat y as a constant)
partial f / partial y = 3x + 2y     (treat x as a constant)
</code></pre>
<h3>The gradient</h3>
<p>The <strong>gradient</strong> grad f collects all partial derivatives into a vector:</p>
<pre><code>grad f = ( partial f / partial x , partial f / partial y )
       = ( 2x + 3y , 3x + 2y )

At the point (1, 1):  grad f = (5, 5)
</code></pre>
<p>Two facts make it central to AI: the gradient <strong>points in the direction of steepest increase</strong>, and its <strong>negative points to steepest decrease</strong>.</p>
<div class="callout"><span class="badge">The whole point</span> To make a loss go DOWN, step opposite to its gradient. That single sentence is machine learning's optimisation loop.</div>`,
    `<span class="eyebrow">MAC103 · Chương 7 · Bài 7.1</span>
<h2>Hàm nhiều biến, đạo hàm riêng &amp; gradient</h2>
<h3>Hàm nhiều biến</h3>
<p>Mô hình thực tế hiếm khi phụ thuộc một đầu vào. Một <strong>hàm nhiều biến</strong> f(x, y) có đồ thị là một mặt cong — với mỗi (x, y) nó cho một độ cao z. Hàm mất mát trong ML phụ thuộc hàng nghìn tham số cùng lúc.</p>
<h3>Đạo hàm riêng</h3>
<p>Một <strong>đạo hàm riêng</strong> đo tốc độ thay đổi theo MỘT hướng, giữ các biến còn lại cố định. Viết bằng chữ d cong (partial):</p>
<pre><code>f(x, y) = x^2 + 3*x*y + y^2

partial f / partial x = 2x + 3y     (coi y là hằng số)
partial f / partial y = 3x + 2y     (coi x là hằng số)
</code></pre>
<h3>Gradient</h3>
<p><strong>Gradient</strong> grad f gom tất cả đạo hàm riêng thành một vector:</p>
<pre><code>grad f = ( partial f / partial x , partial f / partial y )
       = ( 2x + 3y , 3x + 2y )

Tại điểm (1, 1):  grad f = (5, 5)
</code></pre>
<p>Hai điều làm nó cốt lõi với AI: gradient <strong>chỉ hướng tăng nhanh nhất</strong>, và <strong>vector đối của nó chỉ hướng giảm nhanh nhất</strong>.</p>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Muốn cho loss ĐI XUỐNG, hãy bước ngược hướng gradient. Đúng một câu đó là vòng lặp tối ưu của machine learning.</div>`,
  ]]);

const c7q = quiz('mac103-quiz-7', 'Quiz 7 — Partial derivatives & gradient|||Quiz 7 — Đạo hàm riêng & gradient', [
  { id: 'q1', question: 'Khi lấy đạo hàm riêng partial f / partial x, ta xử lý các biến khác thế nào?', options: ['Cho bằng 0', 'Coi như hằng số', 'Cũng lấy đạo hàm theo chúng', 'Cho bằng x'], correctIndex: 1, explanation: 'Đạo hàm riêng theo x coi mọi biến còn lại là hằng số.' },
  { id: 'q2', question: 'Với f(x,y) = x^2 + 3xy + y^2, đạo hàm riêng theo x là?', options: ['2x + 2y', '2x + 3y', '3x + 2y', '2x'], correctIndex: 1, explanation: 'Coi y là hằng: d/dx(x^2) = 2x, d/dx(3xy) = 3y, d/dx(y^2) = 0 -> 2x + 3y.' },
  { id: 'q3', question: 'Gradient của một hàm chỉ về hướng nào?', options: ['Hướng giảm nhanh nhất', 'Hướng tăng nhanh nhất', 'Song song trục x', 'Hướng ngẫu nhiên'], correctIndex: 1, explanation: 'Gradient chỉ hướng tăng nhanh nhất; vector đối của nó chỉ hướng giảm nhanh nhất (dùng trong gradient descent).' },
]);

const c8 = doc('mac103-8-1-multiple-integrals-gd', '8.1 — Multiple integrals & gradient descent for ML/robotics|||8.1 — Tích phân bội & gradient descent trong ML/robotics',
  'Tích phân bội (kép/ba) tính thể tích, khối lượng, xác suất; thuật toán gradient descent (bước ngược gradient, learning rate) — nền của huấn luyện AI.',
  [[
    `<span class="eyebrow">MAC103 · Chapter 8 · Lesson 8.1</span>
<h2>Multiple integrals &amp; gradient descent</h2>
<h3>Multiple integrals</h3>
<p>Just as a single integral sums slices along a line, a <strong>double integral</strong> sums tiny areas over a 2D region and a <strong>triple integral</strong> sums tiny volumes over a 3D region:</p>
<pre><code>Volume under z = f(x, y) over a rectangle:
  V = integral integral of f(x, y) dA
    = integral over y of ( integral over x of f(x, y) dx ) dy   (iterate)

Example: integral(y=0..1) integral(x=0..2) of x*y dx dy
  inner: integral(x=0..2) x*y dx = y * [x^2/2] = 2y
  outer: integral(y=0..1) 2y dy = [y^2] = 1
</code></pre>
<p>In AI they compute <strong>probabilities and expected values</strong> over multi-dimensional distributions; in robotics, <strong>mass, centre of mass and moment of inertia</strong>.</p>
<h3>Gradient descent — calculus that trains AI</h3>
<p>To minimise a loss L(w) over parameters w, repeatedly step in the <strong>negative gradient</strong> direction. The step size is the <strong>learning rate</strong> (lr):</p>
<pre><code>w_new = w_old - lr * grad L(w_old)

Python sketch (minimise L(w) = w^2, grad = 2w):
  w = 5.0
  lr = 0.1
  for step in range(50):
      grad = 2 * w
      w = w - lr * grad     # marches toward the minimum at w = 0
</code></pre>
<div class="callout"><span class="badge">Where it all meets</span> Chain rule (Ch2) computes the gradient (Ch7); gradient descent walks it downhill. Every trained neural network is this loop, run billions of times.</div>`,
    `<span class="eyebrow">MAC103 · Chương 8 · Bài 8.1</span>
<h2>Tích phân bội &amp; gradient descent</h2>
<h3>Tích phân bội</h3>
<p>Như tích phân đơn cộng các lát dọc một đường, <strong>tích phân kép</strong> cộng các diện tích bé trên một miền 2D và <strong>tích phân ba</strong> cộng các thể tích bé trên một miền 3D:</p>
<pre><code>Thể tích dưới z = f(x, y) trên một hình chữ nhật:
  V = integral integral của f(x, y) dA
    = integral theo y của ( integral theo x của f(x, y) dx ) dy   (lặp)

Ví dụ: integral(y=0..1) integral(x=0..2) của x*y dx dy
  trong: integral(x=0..2) x*y dx = y * [x^2/2] = 2y
  ngoài: integral(y=0..1) 2y dy = [y^2] = 1
</code></pre>
<p>Trong AI, chúng tính <strong>xác suất và kỳ vọng</strong> trên phân phối nhiều chiều; trong robotics là <strong>khối lượng, trọng tâm và mô-men quán tính</strong>.</p>
<h3>Gradient descent — giải tích huấn luyện AI</h3>
<p>Để cực tiểu hoá loss L(w) theo tham số w, lặp lại bước theo hướng <strong>gradient âm</strong>. Độ dài bước là <strong>learning rate</strong> (lr):</p>
<pre><code>w_moi = w_cu - lr * grad L(w_cu)

Phác thảo Python (cực tiểu hoá L(w) = w^2, grad = 2w):
  w = 5.0
  lr = 0.1
  for step in range(50):
      grad = 2 * w
      w = w - lr * grad     # tiến dần về cực tiểu tại w = 0
</code></pre>
<div class="callout"><span class="badge">Nơi mọi thứ gặp nhau</span> Chain rule (Ch2) tính gradient (Ch7); gradient descent đi xuống dốc theo nó. Mọi mạng nơ-ron được huấn luyện đều là vòng lặp này, chạy hàng tỉ lần.</div>`,
  ]]);

const c8q = quiz('mac103-quiz-8', 'Quiz 8 — Multiple integrals & gradient descent|||Quiz 8 — Tích phân bội & gradient descent', [
  { id: 'q1', question: 'Tính integral(y=0..1) integral(x=0..2) của x*y dx dy.', options: ['0', '1', '2', '4'], correctIndex: 1, explanation: 'Trong: integral x*y dx từ 0..2 = 2y; ngoài: integral 2y dy từ 0..1 = 1.' },
  { id: 'q2', question: 'Quy tắc cập nhật của gradient descent là?', options: ['w = w + lr * grad', 'w = w - lr * grad', 'w = w * grad', 'w = grad / lr'], correctIndex: 1, explanation: 'Bước ngược hướng gradient: w_moi = w_cu - lr * grad, nên loss giảm dần.' },
  { id: 'q3', question: 'Trong gradient descent, learning rate (lr) là gì?', options: ['Giá trị cực tiểu của loss', 'Độ dài mỗi bước đi theo gradient âm', 'Số tham số của mô hình', 'Đạo hàm bậc hai'], correctIndex: 1, explanation: 'lr quyết định độ lớn mỗi bước; quá lớn dễ vọt qua, quá nhỏ thì hội tụ chậm.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'MAC103',
    slug: 'mac103-calculus',
    title: 'Calculus',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MAC103.webp',
    shortDescription: 'Calculus for Robotics & AI — limits & continuity, derivatives & rules, optimization, integrals & techniques, series & Taylor, multivariable partials & gradient, multiple integrals & gradient descent. Bilingual, worked examples, Python/SymPy, quizzes.|||Giải tích cho Robotics & AI — giới hạn & liên tục, đạo hàm & quy tắc, tối ưu, tích phân & kỹ thuật, chuỗi & Taylor, đạo hàm riêng & gradient, tích phân bội & gradient descent. Song ngữ, ví dụ, Python/SymPy, quiz.',
    description: 'Môn <strong>MAC103 — Calculus (Giải tích)</strong> thuộc ngành Robotics &amp; AI, kỳ 1, giúp hiểu <strong>toán học của sự thay đổi và tích luỹ</strong>. Từ <strong>giới hạn &amp; tính liên tục</strong> → <strong>đạo hàm &amp; quy tắc</strong> (luỹ thừa, tích, thương, chain rule) → <strong>ứng dụng đạo hàm</strong> (cực trị, tối ưu, vẽ đồ thị) → <strong>tích phân</strong> (bất định &amp; xác định, định lý cơ bản) → <strong>kỹ thuật &amp; ứng dụng</strong> (diện tích, thể tích) → <strong>chuỗi &amp; Taylor</strong> → <strong>hàm nhiều biến, đạo hàm riêng &amp; gradient</strong> → <strong>tích phân bội &amp; gradient descent</strong> cho ML/robotics. Bám giáo trình Stewart/Thomas &amp; MIT OCW, song ngữ, có ví dụ tính toán và Python/SymPy, quiz mỗi chương.',
    whatYouLearn: 'Hàm số, giới hạn & liên tục, (sin x)/x; đạo hàm & quy tắc (luỹ thừa, tích, thương, chain rule); cực trị, tối ưu, lồi/lõm & điểm uốn; nguyên hàm, tích phân xác định & định lý cơ bản; đổi biến, tích phân từng phần, diện tích & thể tích; dãy, chuỗi (hình học, p-chuỗi), Taylor/Maclaurin; hàm nhiều biến, đạo hàm riêng & gradient; tích phân bội & gradient descent cho AI.',
    requirements: 'Toán phổ thông (đại số, hàm số, lượng giác cơ bản). Nên biết Python cơ bản để chạy ví dụ SymPy; xem giáo trình chính thức trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Stewart, Thomas), MIT OCW, Paul\'s Notes, 3Blue1Brown, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Giải tích: sự thay đổi & tích luỹ; đạo hàm, tích phân, gradient descent.', lessons: [intro] },
    { title: 'Chương 1 — Hàm số, giới hạn & liên tục|||Chapter 1 — Functions, limits & continuity', description: 'Hàm số, giới hạn, một bên, liên tục, (sin x)/x.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Đạo hàm & quy tắc|||Chapter 2 — Derivatives & rules', description: 'Định nghĩa đạo hàm, luỹ thừa/tích/thương, chain rule.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ứng dụng đạo hàm|||Chapter 3 — Applications of derivatives', description: 'Cực trị, tối ưu, tăng/giảm, lồi/lõm, điểm uốn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tích phân bất định & xác định|||Chapter 4 — Indefinite & definite integrals', description: 'Nguyên hàm, tổng Riemann, định lý cơ bản.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kỹ thuật tích phân & ứng dụng|||Chapter 5 — Integration techniques & applications', description: 'Đổi biến, từng phần, diện tích, thể tích.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chuỗi số & chuỗi luỹ thừa (Taylor)|||Chapter 6 — Series & power series (Taylor)', description: 'Hội tụ/phân kỳ, hình học, p-chuỗi, Taylor/Maclaurin.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hàm nhiều biến & gradient|||Chapter 7 — Multivariable & gradient', description: 'Đạo hàm riêng, gradient, hướng tăng nhanh nhất.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tích phân bội & gradient descent|||Chapter 8 — Multiple integrals & gradient descent', description: 'Tích phân kép/ba, gradient descent cho ML/robotics.', lessons: [c8, c8q] },
  ],
};
