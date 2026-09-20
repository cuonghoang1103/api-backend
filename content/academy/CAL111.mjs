/**
 * CAL111 — Calculus I (Giải tích I). Ngành Khoa học Máy tính FPTU, Kỳ 1.
 * KHUNG chất lượng: 8 chương giải tích một biến (hàm số → giới hạn → đạo hàm
 * → ứng dụng đạo hàm → nguyên hàm → tích phân xác định → kỹ thuật tích phân
 * → ứng dụng & chuỗi Taylor). Sách chuẩn: Stewart "Calculus", Thomas
 * "Calculus"; MIT 18.01, Khan Academy, Paul's Online Math Notes.
 * Song ngữ + công thức + ví dụ giải + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick lồng / ${...}; "&" → "&amp;" trong content HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cal111-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Stewart, Thomas), tài liệu mở (MIT 18.01, Khan Academy, Paul Online Math Notes), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CAL111 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>single-variable calculus</strong> — limits, derivatives and integrals — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal, world-class resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CAL111 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (world standard)</h3>
<ul>
<li><em>Calculus</em> — James Stewart (the global default for Calc I).</li>
<li><em>Thomas' Calculus</em> — Thomas, Weir &amp; Hass.</li>
</ul>
<h3>🌐 Free / open courseware</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" target="_blank" rel="noopener">MIT 18.01 — Single Variable Calculus (OCW)</a></li>
<li><a href="https://www.khanacademy.org/math/calculus-1" target="_blank" rel="noopener">Khan Academy — Calculus 1</a></li>
<li><a href="https://tutorial.math.lamar.edu/" target="_blank" rel="noopener">Paul's Online Math Notes (Lamar)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — Essence of Calculus (visual intuition)</li>
<li><a href="https://www.youtube.com/@ProfessorLeonard" target="_blank" rel="noopener">Professor Leonard</a> — full lectured calculus course</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — graph functions and see limits/derivatives live</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — check derivatives, integrals &amp; limits step by step</li>
<li><a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra</a> — interactive graphing &amp; calculus</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — functions &amp; graphs, then limits and continuity.</li>
<li><strong>Differentiate</strong> — the derivative rules until they are automatic.</li>
<li><strong>Apply</strong> — extrema, curve sketching, optimization, L'Hôpital.</li>
<li><strong>Integrate</strong> — antiderivatives, the Fundamental Theorem, techniques &amp; applications.</li>
</ol></div>`,
    `<span class="eyebrow">CAL111 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>giải tích một biến</strong> — giới hạn, đạo hàm và tích phân — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, đẳng cấp thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CAL111 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chuẩn quốc tế)</h3>
<ul>
<li><em>Calculus</em> — James Stewart (sách mặc định cho Calc I toàn cầu).</li>
<li><em>Thomas' Calculus</em> — Thomas, Weir &amp; Hass.</li>
</ul>
<h3>🌐 Học liệu mở / miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" target="_blank" rel="noopener">MIT 18.01 — Single Variable Calculus (OCW)</a></li>
<li><a href="https://www.khanacademy.org/math/calculus-1" target="_blank" rel="noopener">Khan Academy — Calculus 1</a></li>
<li><a href="https://tutorial.math.lamar.edu/" target="_blank" rel="noopener">Paul's Online Math Notes (Lamar)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — Essence of Calculus (trực giác hình ảnh)</li>
<li><a href="https://www.youtube.com/@ProfessorLeonard" target="_blank" rel="noopener">Professor Leonard</a> — khoá giải tích giảng đầy đủ</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — vẽ hàm và xem giới hạn/đạo hàm trực tiếp</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — kiểm tra đạo hàm, tích phân &amp; giới hạn từng bước</li>
<li><a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra</a> — vẽ đồ thị &amp; giải tích tương tác</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — hàm số &amp; đồ thị, rồi giới hạn và tính liên tục.</li>
<li><strong>Đạo hàm</strong> — thuộc lòng các quy tắc tính đạo hàm.</li>
<li><strong>Ứng dụng</strong> — cực trị, vẽ đồ thị, tối ưu hoá, L'Hôpital.</li>
<li><strong>Tích phân</strong> — nguyên hàm, định lý cơ bản, kỹ thuật &amp; ứng dụng.</li>
</ol></div>`,
  ]]);

const intro = doc('cal111-0-1-overview', 'Course overview: Calculus I|||Tổng quan: Giải tích I',
  'Giải tích nghiên cứu sự thay đổi (đạo hàm) và tích luỹ (tích phân); hai phép toán ngược nhau qua định lý cơ bản. Lộ trình: hàm số → giới hạn → đạo hàm & ứng dụng → tích phân & ứng dụng.',
  [[
    `<span class="eyebrow">CAL111 · Lesson 0.1 · Overview</span>
<h2>What is Calculus?</h2>
<p class="lead">Calculus is the mathematics of <strong>change</strong> and <strong>accumulation</strong>. It rests on one idea — the <strong>limit</strong> — and splits into two halves that turn out to be inverses of each other.</p>
<h3>The two halves</h3>
<ul>
<li><strong>Differential calculus</strong> — the <em>derivative</em> measures an instantaneous rate of change (the slope of a curve at a point): dy/dx.</li>
<li><strong>Integral calculus</strong> — the <em>integral</em> measures accumulated total (the area under a curve): ∫ f(x) dx.</li>
</ul>
<p>The <strong>Fundamental Theorem of Calculus</strong> ties them together: differentiation and integration undo each other.</p>
<pre><code>Derivative:  f'(x) = lim (h->0) [ f(x+h) - f(x) ] / h
Integral:    area under f from a to b  =  F(b) - F(a),  where F' = f
</code></pre>
<h3>Roadmap</h3>
<p>Functions &amp; models → limits &amp; continuity → derivatives &amp; their rules → applications of the derivative → antiderivatives → the definite integral → integration techniques → applications &amp; Taylor series.</p>
<div class="callout"><span class="badge">Why it matters for CS</span> Gradients power machine learning, limits define algorithmic growth, and integrals model probability — calculus is the language underneath much of computer science.</div>`,
    `<span class="eyebrow">CAL111 · Bài 0.1 · Tổng quan</span>
<h2>Giải tích là gì?</h2>
<p class="lead">Giải tích là toán học của <strong>sự thay đổi</strong> và <strong>sự tích luỹ</strong>. Nó dựa trên một ý tưởng — <strong>giới hạn</strong> — và tách thành hai nửa hoá ra là phép toán ngược của nhau.</p>
<h3>Hai nửa</h3>
<ul>
<li><strong>Phép tính vi phân</strong> — <em>đạo hàm</em> đo tốc độ thay đổi tức thời (độ dốc của đường cong tại một điểm): dy/dx.</li>
<li><strong>Phép tính tích phân</strong> — <em>tích phân</em> đo tổng tích luỹ (diện tích dưới đường cong): ∫ f(x) dx.</li>
</ul>
<p><strong>Định lý cơ bản của giải tích</strong> nối hai nửa lại: đạo hàm và tích phân triệt tiêu lẫn nhau.</p>
<pre><code>Đạo hàm:   f'(x) = lim (h->0) [ f(x+h) - f(x) ] / h
Tích phân: diện tích dưới f từ a đến b  =  F(b) - F(a),  với F' = f
</code></pre>
<h3>Lộ trình</h3>
<p>Hàm số &amp; mô hình → giới hạn &amp; liên tục → đạo hàm &amp; quy tắc → ứng dụng đạo hàm → nguyên hàm → tích phân xác định → kỹ thuật tích phân → ứng dụng &amp; chuỗi Taylor.</p>
<div class="callout"><span class="badge">Vì sao quan trọng với CNTT</span> Gradient là nền của học máy, giới hạn định nghĩa độ tăng thuật toán, và tích phân mô hình xác suất — giải tích là ngôn ngữ nằm dưới phần lớn khoa học máy tính.</div>`,
  ]]);

const c1 = doc('cal111-1-1-functions', '1.1 — Functions & models|||1.1 — Hàm số & mô hình',
  'Hàm số (định nghĩa, tập xác định/giá trị, đồ thị); các họ hàm cơ bản (đa thức, mũ, log, lượng giác); biến đổi đồ thị (tịnh tiến, co giãn); hàm hợp và hàm ngược.',
  [[
    `<span class="eyebrow">CAL111 · Chapter 1 · Lesson 1.1</span>
<h2>Functions &amp; models</h2>
<h3>What a function is</h3>
<p>A <strong>function</strong> f assigns to each input x exactly one output f(x). Its <strong>domain</strong> is the set of allowed inputs, its <strong>range</strong> the set of outputs. We picture it with a <strong>graph</strong> in the xy-plane.</p>
<h3>The basic families</h3>
<ul>
<li><strong>Polynomial</strong> — e.g. x^2, x^3 + 2x - 1.</li>
<li><strong>Exponential &amp; logarithmic</strong> — e^x and ln x (inverses of each other).</li>
<li><strong>Trigonometric</strong> — sin x, cos x, tan x (periodic).</li>
</ul>
<h3>Transformations, composition, inverse</h3>
<p>Shifting and scaling a graph, composing two functions f(g(x)), and inverting a one-to-one function are the everyday moves of calculus.</p>
<pre><code>Transformations of y = f(x):
  f(x) + c   -> shift UP by c
  f(x - c)   -> shift RIGHT by c
  a * f(x)   -> stretch vertically by a

Composition:   (f o g)(x) = f( g(x) )
  f(x) = x^2,  g(x) = x + 1  ->  f(g(x)) = (x + 1)^2

Inverse: undoes f
  f(x) = 2x + 3   ->   f^(-1)(x) = (x - 3) / 2
</code></pre>
<div class="callout"><span class="badge">Model first</span> A "model" is just a function chosen to describe data — linear for steady growth, exponential for compounding, trig for anything that repeats.</div>`,
    `<span class="eyebrow">CAL111 · Chương 1 · Bài 1.1</span>
<h2>Hàm số &amp; mô hình</h2>
<h3>Hàm số là gì</h3>
<p>Một <strong>hàm số</strong> f gán cho mỗi đầu vào x đúng một đầu ra f(x). <strong>Tập xác định</strong> là tập đầu vào hợp lệ, <strong>tập giá trị</strong> là tập đầu ra. Ta hình dung nó bằng <strong>đồ thị</strong> trong mặt phẳng xy.</p>
<h3>Các họ hàm cơ bản</h3>
<ul>
<li><strong>Đa thức</strong> — vd x^2, x^3 + 2x - 1.</li>
<li><strong>Mũ &amp; logarit</strong> — e^x và ln x (ngược nhau).</li>
<li><strong>Lượng giác</strong> — sin x, cos x, tan x (tuần hoàn).</li>
</ul>
<h3>Biến đổi, hàm hợp, hàm ngược</h3>
<p>Tịnh tiến và co giãn đồ thị, hợp hai hàm f(g(x)), và nghịch đảo một hàm đơn ánh là những thao tác thường ngày của giải tích.</p>
<pre><code>Biến đổi y = f(x):
  f(x) + c   -> tịnh tiến LÊN c đơn vị
  f(x - c)   -> tịnh tiến SANG PHẢI c đơn vị
  a * f(x)   -> co giãn theo trục tung hệ số a

Hàm hợp:   (f o g)(x) = f( g(x) )
  f(x) = x^2,  g(x) = x + 1  ->  f(g(x)) = (x + 1)^2

Hàm ngược: đảo lại f
  f(x) = 2x + 3   ->   f^(-1)(x) = (x - 3) / 2
</code></pre>
<div class="callout"><span class="badge">Mô hình trước</span> "Mô hình" chỉ là một hàm được chọn để mô tả dữ liệu — tuyến tính cho tăng đều, mũ cho tăng kép, lượng giác cho mọi thứ lặp lại.</div>`,
  ]]);

const c1q = quiz('cal111-quiz-1', 'Quiz 1 — Functions & models|||Quiz 1 — Hàm số & mô hình', [
  { id: 'q1', question: 'Với f(x) = x^2 và g(x) = x + 1, hàm hợp f(g(x)) bằng?', options: ['x^2 + 1', '(x + 1)^2', 'x^2 + x', '2x + 1'], correctIndex: 1, explanation: 'f(g(x)) = (g(x))^2 = (x + 1)^2.' },
  { id: 'q2', question: 'Đồ thị y = f(x - 3) so với y = f(x) là?', options: ['Tịnh tiến sang trái 3', 'Tịnh tiến sang phải 3', 'Tịnh tiến lên 3', 'Co theo trục tung'], correctIndex: 1, explanation: 'Thay x bởi x - 3 dịch đồ thị SANG PHẢI 3 đơn vị.' },
  { id: 'q3', question: 'Hàm ngược của f(x) = 2x + 3 là?', options: ['(x - 3)/2', '2x - 3', '(x + 3)/2', '1/(2x + 3)'], correctIndex: 0, explanation: 'Giải y = 2x + 3 theo x: x = (y - 3)/2.' },
]);

const c2 = doc('cal111-2-1-limits', '2.1 — Limits & continuity|||2.1 — Giới hạn & liên tục',
  'Khái niệm giới hạn (trực giác + ký hiệu); các luật giới hạn; giới hạn một bên; giới hạn tại vô cực & vô cực; định nghĩa tính liên tục và ba điều kiện.',
  [[
    `<span class="eyebrow">CAL111 · Chapter 2 · Lesson 2.1</span>
<h2>Limits &amp; continuity</h2>
<h3>The idea of a limit</h3>
<p>The <strong>limit</strong> of f(x) as x approaches a is the value f(x) gets close to — even if f(a) itself is undefined. We write it as lim (x-&gt;a) f(x) = L.</p>
<h3>Limit laws</h3>
<p>Limits distribute over sums, products and quotients, so you can often just substitute — until you hit a 0/0 form, where algebra (factoring) rescues you.</p>
<h3>One-sided &amp; infinite limits</h3>
<p>Left-hand (x-&gt;a from below) and right-hand limits can differ; if they do, the two-sided limit does not exist. Limits at infinity describe end behaviour.</p>
<h3>Continuity</h3>
<p>f is <strong>continuous at a</strong> when three things hold: f(a) exists, lim (x-&gt;a) f(x) exists, and the two are equal — no holes, jumps or breaks.</p>
<pre><code>Direct substitution:
  lim (x->2) (x^2 + 1) = 2^2 + 1 = 5

The 0/0 trick — factor and cancel:
  lim (x->3) (x^2 - 9)/(x - 3)
    = lim (x->3) (x - 3)(x + 3)/(x - 3)
    = lim (x->3) (x + 3) = 6

Continuity test at a:  f(a) defined  AND  lim = f(a)
</code></pre>
<div class="callout"><span class="badge">Key limit</span> lim (x-&gt;0) (sin x)/x = 1 — the cornerstone behind the derivative of sin x.</div>`,
    `<span class="eyebrow">CAL111 · Chương 2 · Bài 2.1</span>
<h2>Giới hạn &amp; liên tục</h2>
<h3>Ý tưởng giới hạn</h3>
<p><strong>Giới hạn</strong> của f(x) khi x tiến tới a là giá trị mà f(x) tiến gần đến — dù cho bản thân f(a) không xác định. Ký hiệu lim (x-&gt;a) f(x) = L.</p>
<h3>Các luật giới hạn</h3>
<p>Giới hạn phân phối qua tổng, tích và thương, nên nhiều khi chỉ cần thế trực tiếp — cho tới khi gặp dạng 0/0, lúc đó đại số (phân tích thừa số) cứu bạn.</p>
<h3>Giới hạn một bên &amp; vô cực</h3>
<p>Giới hạn trái (x-&gt;a từ dưới) và giới hạn phải có thể khác nhau; nếu khác thì giới hạn hai bên không tồn tại. Giới hạn tại vô cực mô tả dáng điệu ở xa.</p>
<h3>Tính liên tục</h3>
<p>f <strong>liên tục tại a</strong> khi ba điều đúng: f(a) tồn tại, lim (x-&gt;a) f(x) tồn tại, và hai giá trị bằng nhau — không lỗ hổng, không nhảy, không đứt.</p>
<pre><code>Thế trực tiếp:
  lim (x->2) (x^2 + 1) = 2^2 + 1 = 5

Mẹo 0/0 — phân tích và rút gọn:
  lim (x->3) (x^2 - 9)/(x - 3)
    = lim (x->3) (x - 3)(x + 3)/(x - 3)
    = lim (x->3) (x + 3) = 6

Kiểm tra liên tục tại a:  f(a) xác định  VÀ  lim = f(a)
</code></pre>
<div class="callout"><span class="badge">Giới hạn then chốt</span> lim (x-&gt;0) (sin x)/x = 1 — nền tảng cho đạo hàm của sin x.</div>`,
  ]]);

const c2q = quiz('cal111-quiz-2', 'Quiz 2 — Limits & continuity|||Quiz 2 — Giới hạn & liên tục', [
  { id: 'q1', question: 'lim (x->3) (x^2 - 9)/(x - 3) bằng?', options: ['0', '3', '6', 'Không tồn tại'], correctIndex: 2, explanation: 'Phân tích (x-3)(x+3)/(x-3) = x+3 -> 6.' },
  { id: 'q2', question: 'Giới hạn hai bên tại a KHÔNG tồn tại khi?', options: ['f(a) không xác định', 'Giới hạn trái khác giới hạn phải', 'f là đa thức', 'lim bằng f(a)'], correctIndex: 1, explanation: 'Hai giới hạn một bên khác nhau thì giới hạn hai bên không tồn tại.' },
  { id: 'q3', question: 'f liên tục tại a đòi hỏi?', options: ['Chỉ f(a) tồn tại', 'Chỉ lim tồn tại', 'f(a) tồn tại, lim tồn tại và lim = f(a)', 'f là hàm mũ'], correctIndex: 2, explanation: 'Đủ ba điều kiện: f(a) có, lim có, và bằng nhau.' },
]);

const c3 = doc('cal111-3-1-derivatives', '3.1 — The derivative & rules|||3.1 — Đạo hàm & quy tắc',
  'Định nghĩa đạo hàm qua giới hạn (độ dốc tiếp tuyến); quy tắc tổng/hằng/luỹ thừa; quy tắc tích, thương, chuỗi; đạo hàm hàm lượng giác, mũ, log.',
  [[
    `<span class="eyebrow">CAL111 · Chapter 3 · Lesson 3.1</span>
<h2>The derivative &amp; its rules</h2>
<h3>Definition</h3>
<p>The <strong>derivative</strong> f'(x) is the instantaneous rate of change — the slope of the tangent line — defined as a limit of average slopes.</p>
<h3>The rules that replace the limit</h3>
<p>You rarely compute the limit by hand; you memorize a handful of rules instead.</p>
<pre><code>Definition:  f'(x) = lim (h->0) [ f(x+h) - f(x) ] / h

Power rule:      d/dx x^n      = n x^(n-1)
Sum:             d/dx [f + g]  = f' + g'
Product:         d/dx [f g]    = f' g + f g'
Quotient:        d/dx [f/g]    = (f' g - f g') / g^2
Chain:           d/dx f(g(x))  = f'(g(x)) * g'(x)

Key derivatives:
  d/dx sin x = cos x       d/dx cos x = -sin x
  d/dx e^x   = e^x         d/dx ln x  = 1/x
</code></pre>
<h3>Worked example — the chain rule</h3>
<pre><code>y = (x^2 + 1)^3
  outer: u^3 -> 3u^2 ,  inner: x^2 + 1 -> 2x
  dy/dx = 3(x^2 + 1)^2 * 2x = 6x (x^2 + 1)^2
</code></pre>
<div class="callout"><span class="badge">Read it as a machine</span> The chain rule says: differentiate the outer function, keep the inside, then multiply by the derivative of the inside.</div>`,
    `<span class="eyebrow">CAL111 · Chương 3 · Bài 3.1</span>
<h2>Đạo hàm &amp; các quy tắc</h2>
<h3>Định nghĩa</h3>
<p><strong>Đạo hàm</strong> f'(x) là tốc độ thay đổi tức thời — độ dốc tiếp tuyến — được định nghĩa bằng giới hạn của độ dốc trung bình.</p>
<h3>Các quy tắc thay cho giới hạn</h3>
<p>Bạn hiếm khi tính giới hạn bằng tay; thay vào đó thuộc một nhóm quy tắc.</p>
<pre><code>Định nghĩa:  f'(x) = lim (h->0) [ f(x+h) - f(x) ] / h

Luỹ thừa:   d/dx x^n      = n x^(n-1)
Tổng:       d/dx [f + g]  = f' + g'
Tích:       d/dx [f g]    = f' g + f g'
Thương:     d/dx [f/g]    = (f' g - f g') / g^2
Chuỗi:      d/dx f(g(x))  = f'(g(x)) * g'(x)

Đạo hàm then chốt:
  d/dx sin x = cos x       d/dx cos x = -sin x
  d/dx e^x   = e^x         d/dx ln x  = 1/x
</code></pre>
<h3>Ví dụ mẫu — quy tắc chuỗi</h3>
<pre><code>y = (x^2 + 1)^3
  ngoài: u^3 -> 3u^2 ,  trong: x^2 + 1 -> 2x
  dy/dx = 3(x^2 + 1)^2 * 2x = 6x (x^2 + 1)^2
</code></pre>
<div class="callout"><span class="badge">Đọc như một cỗ máy</span> Quy tắc chuỗi nói: lấy đạo hàm hàm ngoài, giữ nguyên phần trong, rồi nhân với đạo hàm phần trong.</div>`,
  ]]);

const c3q = quiz('cal111-quiz-3', 'Quiz 3 — Derivatives|||Quiz 3 — Đạo hàm', [
  { id: 'q1', question: 'Đạo hàm của x^5 là?', options: ['5x^4', 'x^4', '5x^6', '4x^5'], correctIndex: 0, explanation: 'Quy tắc luỹ thừa: d/dx x^n = n x^(n-1) = 5x^4.' },
  { id: 'q2', question: 'd/dx của (x^2 + 1)^3 là?', options: ['3(x^2 + 1)^2', '6x(x^2 + 1)^2', '2x(x^2 + 1)^3', '3x(x^2 + 1)^2'], correctIndex: 1, explanation: 'Quy tắc chuỗi: 3(x^2+1)^2 · 2x = 6x(x^2+1)^2.' },
  { id: 'q3', question: 'Đạo hàm của sin x là?', options: ['-sin x', 'cos x', '-cos x', 'tan x'], correctIndex: 1, explanation: 'd/dx sin x = cos x.' },
]);

const c4 = doc('cal111-4-1-applications-derivative', '4.1 — Applications of the derivative|||4.1 — Ứng dụng đạo hàm',
  'Cực trị (điểm tới hạn, kiểm tra đạo hàm bậc 1/2); tính đơn điệu; lồi/lõm & điểm uốn; vẽ đồ thị; bài toán tối ưu hoá; khử dạng vô định bằng LHopital.',
  [[
    `<span class="eyebrow">CAL111 · Chapter 4 · Lesson 4.1</span>
<h2>Applications of the derivative</h2>
<h3>Extrema &amp; monotonicity</h3>
<p><strong>Critical points</strong> (where f'(x) = 0 or is undefined) are the candidates for maxima and minima. Where f' &gt; 0 the function increases; where f' &lt; 0 it decreases.</p>
<h3>Concavity &amp; the second derivative</h3>
<p>f'' &gt; 0 means concave up (a smile), f'' &lt; 0 concave down (a frown); a sign change is an <strong>inflection point</strong>. The second-derivative test classifies a critical point fast.</p>
<h3>Optimization &amp; L'Hôpital</h3>
<p>To optimize, model the quantity, take its derivative, set it to zero. For 0/0 or ∞/∞ limits, <strong>L'Hôpital's rule</strong> differentiates top and bottom separately.</p>
<pre><code>Optimization — largest rectangle area, perimeter 20:
  sides x and (10 - x),  A(x) = x(10 - x) = 10x - x^2
  A'(x) = 10 - 2x = 0  ->  x = 5   (a 5x5 square, area 25)

L'Hôpital's rule (0/0):
  lim (x->0) (sin x)/x = lim (x->0) (cos x)/1 = 1
</code></pre>
<div class="callout"><span class="badge">Sketch checklist</span> Domain, intercepts, f' (increase/decrease &amp; extrema), f'' (concavity &amp; inflection), asymptotes — then draw.</div>`,
    `<span class="eyebrow">CAL111 · Chương 4 · Bài 4.1</span>
<h2>Ứng dụng đạo hàm</h2>
<h3>Cực trị &amp; đơn điệu</h3>
<p><strong>Điểm tới hạn</strong> (nơi f'(x) = 0 hoặc không xác định) là ứng viên cho cực đại và cực tiểu. Nơi f' &gt; 0 hàm tăng; nơi f' &lt; 0 hàm giảm.</p>
<h3>Lồi/lõm &amp; đạo hàm bậc hai</h3>
<p>f'' &gt; 0 nghĩa là lõm lên (mặt cười), f'' &lt; 0 lõm xuống (mặt mếu); nơi đổi dấu là <strong>điểm uốn</strong>. Kiểm tra đạo hàm bậc hai phân loại điểm tới hạn nhanh.</p>
<h3>Tối ưu hoá &amp; L'Hôpital</h3>
<p>Để tối ưu, mô hình hoá đại lượng, lấy đạo hàm, cho bằng không. Với giới hạn dạng 0/0 hoặc ∞/∞, <strong>quy tắc L'Hôpital</strong> lấy đạo hàm tử và mẫu riêng.</p>
<pre><code>Tối ưu — hình chữ nhật diện tích lớn nhất, chu vi 20:
  cạnh x và (10 - x),  A(x) = x(10 - x) = 10x - x^2
  A'(x) = 10 - 2x = 0  ->  x = 5   (hình vuông 5x5, diện tích 25)

Quy tắc L'Hôpital (0/0):
  lim (x->0) (sin x)/x = lim (x->0) (cos x)/1 = 1
</code></pre>
<div class="callout"><span class="badge">Danh mục vẽ đồ thị</span> Tập xác định, giao điểm, f' (tăng/giảm &amp; cực trị), f'' (lồi lõm &amp; điểm uốn), tiệm cận — rồi vẽ.</div>`,
  ]]);

const c4q = quiz('cal111-quiz-4', 'Quiz 4 — Applications of derivative|||Quiz 4 — Ứng dụng đạo hàm', [
  { id: 'q1', question: 'Điểm tới hạn của f là nơi?', options: ['f = 0', "f'(x) = 0 hoặc không xác định", "f'' > 0", 'f là đa thức'], correctIndex: 1, explanation: 'Cực trị chỉ có thể xảy ra tại điểm tới hạn.' },
  { id: 'q2', question: "Nếu f'' > 0 trên một khoảng thì đồ thị?", options: ['Lõm xuống', 'Lõm lên', 'Là đường thẳng', 'Có tiệm cận đứng'], correctIndex: 1, explanation: "f'' > 0 nghĩa là lõm lên (concave up)." },
  { id: 'q3', question: 'Dùng LHopital, lim (x->0) (sin x)/x bằng?', options: ['0', '1', 'Vô cực', 'Không tồn tại'], correctIndex: 1, explanation: 'Đạo hàm tử/mẫu: cos x / 1 -> 1.' },
]);

const c5 = doc('cal111-5-1-antiderivatives', '5.1 — Antiderivatives & indefinite integrals|||5.1 — Nguyên hàm & tích phân bất định',
  'Nguyên hàm (đảo ngược đạo hàm) và hằng số C; tích phân bất định; bảng tích phân cơ bản (luỹ thừa, mũ, log, lượng giác); phương pháp đổi biến (u-substitution).',
  [[
    `<span class="eyebrow">CAL111 · Chapter 5 · Lesson 5.1</span>
<h2>Antiderivatives &amp; indefinite integrals</h2>
<h3>Reversing the derivative</h3>
<p>An <strong>antiderivative</strong> F of f satisfies F'(x) = f(x). Because the derivative of a constant is 0, every antiderivative carries a <strong>+ C</strong>. The whole family is the <strong>indefinite integral</strong> ∫ f(x) dx.</p>
<h3>The basic table</h3>
<pre><code>∫ x^n dx      = x^(n+1)/(n+1) + C     (n != -1)
∫ (1/x) dx    = ln|x| + C
∫ e^x dx      = e^x + C
∫ cos x dx    = sin x + C
∫ sin x dx    = -cos x + C
</code></pre>
<h3>Substitution — the reverse chain rule</h3>
<pre><code>∫ 2x (x^2 + 1)^3 dx
  let u = x^2 + 1  ->  du = 2x dx
  = ∫ u^3 du = u^4/4 + C = (x^2 + 1)^4 / 4 + C
</code></pre>
<div class="callout"><span class="badge">Always add C</span> An indefinite integral is a whole family of curves stacked vertically — forgetting + C is the classic mistake.</div>`,
    `<span class="eyebrow">CAL111 · Chương 5 · Bài 5.1</span>
<h2>Nguyên hàm &amp; tích phân bất định</h2>
<h3>Đảo ngược đạo hàm</h3>
<p><strong>Nguyên hàm</strong> F của f thoả F'(x) = f(x). Vì đạo hàm của hằng số bằng 0, mọi nguyên hàm đều mang <strong>+ C</strong>. Cả họ nguyên hàm là <strong>tích phân bất định</strong> ∫ f(x) dx.</p>
<h3>Bảng cơ bản</h3>
<pre><code>∫ x^n dx      = x^(n+1)/(n+1) + C     (n != -1)
∫ (1/x) dx    = ln|x| + C
∫ e^x dx      = e^x + C
∫ cos x dx    = sin x + C
∫ sin x dx    = -cos x + C
</code></pre>
<h3>Đổi biến — quy tắc chuỗi ngược</h3>
<pre><code>∫ 2x (x^2 + 1)^3 dx
  đặt u = x^2 + 1  ->  du = 2x dx
  = ∫ u^3 du = u^4/4 + C = (x^2 + 1)^4 / 4 + C
</code></pre>
<div class="callout"><span class="badge">Luôn cộng C</span> Tích phân bất định là cả một họ đường cong xếp chồng dọc — quên + C là lỗi kinh điển.</div>`,
  ]]);

const c5q = quiz('cal111-quiz-5', 'Quiz 5 — Antiderivatives|||Quiz 5 — Nguyên hàm', [
  { id: 'q1', question: '∫ x^3 dx bằng?', options: ['3x^2 + C', 'x^4/4 + C', 'x^4 + C', 'x^2/2 + C'], correctIndex: 1, explanation: 'Quy tắc luỹ thừa ngược: x^(n+1)/(n+1) + C.' },
  { id: 'q2', question: 'Vì sao tích phân bất định luôn có + C?', options: ['Vì x luôn dương', 'Vì đạo hàm của hằng số bằng 0', 'Vì để làm tròn', 'Vì C là biến'], correctIndex: 1, explanation: 'Mọi hằng số biến mất khi đạo hàm nên phải cộng lại + C.' },
  { id: 'q3', question: 'Với ∫ 2x(x^2+1)^3 dx, phép đổi biến hợp lý là?', options: ['u = 2x', 'u = x^2 + 1', 'u = x^3', 'u = (x^2+1)^3'], correctIndex: 1, explanation: 'u = x^2 + 1 thì du = 2x dx, khớp với tích phân.' },
]);

const c6 = doc('cal111-6-1-definite-integral', '6.1 — The definite integral|||6.1 — Tích phân xác định',
  'Tổng Riemann & diện tích dưới đường cong; định nghĩa tích phân xác định; tính chất; định lý cơ bản của giải tích (hai phần) nối đạo hàm và tích phân.',
  [[
    `<span class="eyebrow">CAL111 · Chapter 6 · Lesson 6.1</span>
<h2>The definite integral</h2>
<h3>Area as a Riemann sum</h3>
<p>Split [a, b] into n thin strips, add up their rectangle areas, then let the width shrink to zero. That limit is the <strong>definite integral</strong> — the exact signed area under f from a to b.</p>
<pre><code>Riemann sum:  ∫[a,b] f(x) dx = lim (n->∞) Σ f(x_i) Δx ,  Δx = (b - a)/n
</code></pre>
<h3>The Fundamental Theorem of Calculus</h3>
<p>The FTC turns that infinite sum into a subtraction — the single most useful result in the course.</p>
<pre><code>Part 1:  d/dx ∫[a,x] f(t) dt = f(x)      (integration undoes differentiation)
Part 2:  ∫[a,b] f(x) dx = F(b) - F(a)    where F is any antiderivative of f

Example:
  ∫[0,2] x^2 dx = [ x^3/3 ] from 0 to 2 = 8/3 - 0 = 8/3
</code></pre>
<div class="callout"><span class="badge">The bridge</span> Part 2 means you never sum rectangles by hand: find an antiderivative F, then just compute F(b) - F(a).</div>`,
    `<span class="eyebrow">CAL111 · Chương 6 · Bài 6.1</span>
<h2>Tích phân xác định</h2>
<h3>Diện tích như tổng Riemann</h3>
<p>Chia [a, b] thành n dải mỏng, cộng diện tích các hình chữ nhật, rồi cho bề rộng tiến về 0. Giới hạn đó là <strong>tích phân xác định</strong> — diện tích có dấu chính xác dưới f từ a đến b.</p>
<pre><code>Tổng Riemann:  ∫[a,b] f(x) dx = lim (n->∞) Σ f(x_i) Δx ,  Δx = (b - a)/n
</code></pre>
<h3>Định lý cơ bản của giải tích</h3>
<p>Định lý cơ bản biến tổng vô hạn đó thành một phép trừ — kết quả hữu dụng nhất của cả môn.</p>
<pre><code>Phần 1:  d/dx ∫[a,x] f(t) dt = f(x)      (tích phân triệt tiêu đạo hàm)
Phần 2:  ∫[a,b] f(x) dx = F(b) - F(a)    với F là một nguyên hàm bất kỳ của f

Ví dụ:
  ∫[0,2] x^2 dx = [ x^3/3 ] từ 0 đến 2 = 8/3 - 0 = 8/3
</code></pre>
<div class="callout"><span class="badge">Cây cầu</span> Phần 2 nghĩa là bạn không bao giờ phải cộng hình chữ nhật bằng tay: tìm nguyên hàm F, rồi chỉ tính F(b) - F(a).</div>`,
  ]]);

const c6q = quiz('cal111-quiz-6', 'Quiz 6 — Definite integral|||Quiz 6 — Tích phân xác định', [
  { id: 'q1', question: '∫[0,2] x^2 dx bằng?', options: ['4', '8/3', '2', '8'], correctIndex: 1, explanation: 'Nguyên hàm x^3/3; tại 2 là 8/3, tại 0 là 0 -> 8/3.' },
  { id: 'q2', question: 'Định lý cơ bản (phần 2) nói ∫[a,b] f dx bằng?', options: ['f(b) - f(a)', 'F(b) - F(a) với F là nguyên hàm của f', 'F(a) - F(b)', 'f(b) + f(a)'], correctIndex: 1, explanation: 'Tính bằng hiệu nguyên hàm tại hai cận.' },
  { id: 'q3', question: 'Tích phân xác định được định nghĩa là giới hạn của?', options: ['Đạo hàm', 'Tổng Riemann khi Δx -> 0', 'Hàm ngược', 'Tổng vô hạn hằng số'], correctIndex: 1, explanation: 'Giới hạn tổng diện tích các dải khi bề rộng tiến về 0.' },
]);

const c7 = doc('cal111-7-1-techniques', '7.1 — Techniques of integration|||7.1 — Kỹ thuật tích phân',
  'Tích phân từng phần (đảo ngược quy tắc tích); phân tích thành phân thức hữu tỉ; tích phân lượng giác & phép thế lượng giác; chọn kỹ thuật đúng.',
  [[
    `<span class="eyebrow">CAL111 · Chapter 7 · Lesson 7.1</span>
<h2>Techniques of integration</h2>
<h3>Integration by parts</h3>
<p>The reverse of the product rule — best when the integrand is a product (e.g. x · e^x).</p>
<pre><code>∫ u dv = u v - ∫ v du

Example: ∫ x e^x dx
  u = x -> du = dx ,  dv = e^x dx -> v = e^x
  = x e^x - ∫ e^x dx = x e^x - e^x + C
</code></pre>
<h3>Partial fractions</h3>
<p>Split a rational function into simpler fractions you can integrate term by term.</p>
<pre><code>1 / [x(x + 1)] = 1/x - 1/(x + 1)
  ∫ 1/[x(x+1)] dx = ln|x| - ln|x + 1| + C
</code></pre>
<h3>Trigonometric integrals</h3>
<p>Use identities (like sin^2 x = (1 - cos 2x)/2) or a trig substitution to tame roots such as √(1 - x^2).</p>
<div class="callout"><span class="badge">Pick the tool</span> Substitution first; parts for products; partial fractions for rational functions; trig identities for powers of sin/cos.</div>`,
    `<span class="eyebrow">CAL111 · Chương 7 · Bài 7.1</span>
<h2>Kỹ thuật tích phân</h2>
<h3>Tích phân từng phần</h3>
<p>Đảo ngược quy tắc tích — tốt nhất khi hàm dưới dấu tích phân là một tích (vd x · e^x).</p>
<pre><code>∫ u dv = u v - ∫ v du

Ví dụ: ∫ x e^x dx
  u = x -> du = dx ,  dv = e^x dx -> v = e^x
  = x e^x - ∫ e^x dx = x e^x - e^x + C
</code></pre>
<h3>Phân thức hữu tỉ</h3>
<p>Tách một hàm phân thức thành các phân thức đơn giản hơn để tích phân từng số hạng.</p>
<pre><code>1 / [x(x + 1)] = 1/x - 1/(x + 1)
  ∫ 1/[x(x+1)] dx = ln|x| - ln|x + 1| + C
</code></pre>
<h3>Tích phân lượng giác</h3>
<p>Dùng đồng nhất thức (như sin^2 x = (1 - cos 2x)/2) hoặc phép thế lượng giác để xử lý các căn như √(1 - x^2).</p>
<div class="callout"><span class="badge">Chọn công cụ</span> Đổi biến trước; từng phần cho tích; phân thức cho hàm hữu tỉ; đồng nhất thức lượng giác cho luỹ thừa sin/cos.</div>`,
  ]]);

const c7q = quiz('cal111-quiz-7', 'Quiz 7 — Techniques|||Quiz 7 — Kỹ thuật tích phân', [
  { id: 'q1', question: 'Công thức tích phân từng phần là?', options: ['∫ u dv = u v - ∫ v du', '∫ u dv = u v + ∫ v du', '∫ u dv = ∫ v du', '∫ u dv = u/v'], correctIndex: 0, explanation: 'Đây là đảo ngược của quy tắc tích.' },
  { id: 'q2', question: '∫ x e^x dx bằng?', options: ['x e^x + C', 'x e^x - e^x + C', 'e^x + C', 'x^2 e^x / 2 + C'], correctIndex: 1, explanation: 'Từng phần: u = x, dv = e^x dx -> x e^x - e^x + C.' },
  { id: 'q3', question: 'Kỹ thuật phù hợp cho ∫ 1/[x(x+1)] dx là?', options: ['Tích phân từng phần', 'Phân thức hữu tỉ', 'Phép thế lượng giác', 'Đạo hàm bậc hai'], correctIndex: 1, explanation: 'Tách 1/x - 1/(x+1) rồi tích phân từng số hạng.' },
]);

const c8 = doc('cal111-8-1-applications-integral', '8.1 — Applications of integration & Taylor series|||8.1 — Ứng dụng tích phân & chuỗi Taylor',
  'Diện tích giữa hai đường cong; thể tích vật thể tròn xoay (đĩa/vỏ); tổng quan chuỗi số & chuỗi Taylor/Maclaurin xấp xỉ hàm bằng đa thức.',
  [[
    `<span class="eyebrow">CAL111 · Chapter 8 · Lesson 8.1</span>
<h2>Applications of integration &amp; Taylor series</h2>
<h3>Area between curves</h3>
<pre><code>Area = ∫[a,b] ( top(x) - bottom(x) ) dx

Between y = x and y = x^2 on [0,1]:
  ∫[0,1] (x - x^2) dx = [ x^2/2 - x^3/3 ] = 1/2 - 1/3 = 1/6
</code></pre>
<h3>Volume of revolution (disk method)</h3>
<pre><code>Rotate y = f(x) about the x-axis:
  V = ∫[a,b] π [ f(x) ]^2 dx
</code></pre>
<h3>Series &amp; Taylor (overview)</h3>
<p>An infinite <strong>series</strong> adds infinitely many terms; if the partial sums settle, it <em>converges</em>. A <strong>Taylor series</strong> rewrites a smooth function as an infinite polynomial around a point — the engine behind how calculators evaluate e^x, sin x, ln x.</p>
<pre><code>e^x  = 1 + x + x^2/2! + x^3/3! + ...
sin x = x - x^3/3! + x^5/5! - ...
</code></pre>
<div class="callout"><span class="badge">Where CS meets it</span> Truncated Taylor series give fast numeric approximations; integrals give expected values in probability and areas in graphics.</div>`,
    `<span class="eyebrow">CAL111 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng tích phân &amp; chuỗi Taylor</h2>
<h3>Diện tích giữa hai đường cong</h3>
<pre><code>Diện tích = ∫[a,b] ( trên(x) - dưới(x) ) dx

Giữa y = x và y = x^2 trên [0,1]:
  ∫[0,1] (x - x^2) dx = [ x^2/2 - x^3/3 ] = 1/2 - 1/3 = 1/6
</code></pre>
<h3>Thể tích vật thể tròn xoay (phương pháp đĩa)</h3>
<pre><code>Quay y = f(x) quanh trục Ox:
  V = ∫[a,b] π [ f(x) ]^2 dx
</code></pre>
<h3>Chuỗi số &amp; Taylor (tổng quan)</h3>
<p>Một <strong>chuỗi số</strong> vô hạn cộng vô số số hạng; nếu tổng riêng ổn định thì chuỗi <em>hội tụ</em>. <strong>Chuỗi Taylor</strong> viết lại một hàm trơn thành một đa thức vô hạn quanh một điểm — cỗ máy đằng sau cách máy tính tính e^x, sin x, ln x.</p>
<pre><code>e^x  = 1 + x + x^2/2! + x^3/3! + ...
sin x = x - x^3/3! + x^5/5! - ...
</code></pre>
<div class="callout"><span class="badge">Chỗ CNTT gặp giải tích</span> Chuỗi Taylor cắt ngắn cho xấp xỉ số nhanh; tích phân cho kỳ vọng trong xác suất và diện tích trong đồ hoạ.</div>`,
  ]]);

const c8q = quiz('cal111-quiz-8', 'Quiz 8 — Applications & series|||Quiz 8 — Ứng dụng & chuỗi', [
  { id: 'q1', question: 'Diện tích giữa y = x và y = x^2 trên [0,1] bằng?', options: ['1/2', '1/3', '1/6', '1'], correctIndex: 2, explanation: '∫(x - x^2)dx = 1/2 - 1/3 = 1/6.' },
  { id: 'q2', question: 'Thể tích khi quay y = f(x) quanh Ox (phương pháp đĩa) là?', options: ['∫ π f(x) dx', '∫ π [f(x)]^2 dx', '∫ 2π x f(x) dx', '∫ f(x)^2 dx'], correctIndex: 1, explanation: 'Mỗi đĩa có diện tích π[f(x)]^2, tích phân theo x.' },
  { id: 'q3', question: 'Chuỗi Taylor của e^x bắt đầu bằng?', options: ['1 + x + x^2/2! + ...', 'x - x^3/3! + ...', '1 - x + x^2 - ...', 'x + x^2 + x^3 + ...'], correctIndex: 0, explanation: 'e^x = 1 + x + x^2/2! + x^3/3! + ...' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CAL111',
    slug: 'cal111-calculus-i',
    title: 'Calculus I',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CAL111.webp',
    shortDescription: 'Single-variable calculus — functions, limits & continuity, derivatives & rules, applications (extrema, optimization), integrals & the Fundamental Theorem, integration techniques, Taylor series. Bilingual, worked examples & quizzes.|||Giải tích một biến — hàm số, giới hạn & liên tục, đạo hàm & quy tắc, ứng dụng (cực trị, tối ưu), tích phân & định lý cơ bản, kỹ thuật tích phân, chuỗi Taylor. Song ngữ, ví dụ giải & quiz.',
    description: 'Môn <strong>CAL111 — Calculus I (Giải tích I)</strong> thuộc khung chương trình ngành Khoa học Máy tính (kỳ 1) giúp bạn nắm <strong>giải tích một biến</strong>. Từ <strong>hàm số &amp; mô hình</strong> → <strong>giới hạn &amp; liên tục</strong> → <strong>đạo hàm</strong> (quy tắc tổng/tích/thương/chuỗi, hàm lượng giác/mũ/log) → <strong>ứng dụng đạo hàm</strong> (cực trị, tối ưu, L\'Hôpital) → <strong>nguyên hàm &amp; tích phân bất định</strong> → <strong>tích phân xác định</strong> (Riemann, định lý cơ bản) → <strong>kỹ thuật tích phân</strong> → <strong>ứng dụng &amp; chuỗi Taylor</strong>. Bám sách chuẩn Stewart &amp; Thomas, song ngữ, có công thức, ví dụ giải và quiz mỗi chương.',
    whatYouLearn: 'Hàm số, đồ thị & biến đổi, hàm hợp/ngược; giới hạn, luật giới hạn, giới hạn một bên/vô cực, tính liên tục; đạo hàm & quy tắc (tổng/tích/thương/chuỗi), đạo hàm lượng giác/mũ/log; cực trị, đơn điệu, lồi lõm, vẽ đồ thị, tối ưu, khử dạng vô định (LHopital); nguyên hàm & đổi biến; tích phân xác định & định lý cơ bản; tích phân từng phần, phân thức hữu tỉ, lượng giác; diện tích, thể tích tròn xoay, chuỗi Taylor.',
    requirements: 'Đại số & lượng giác phổ thông (hàm số, đồ thị, phương trình). Nên dùng Desmos/GeoGebra để trực quan hoá và WolframAlpha để tự kiểm bài giải.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, Stewart & Thomas, MIT 18.01, Khan Academy, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Giải tích là gì; đạo hàm, tích phân, định lý cơ bản.', lessons: [intro] },
    { title: 'Chương 1 — Hàm số & mô hình|||Chapter 1 — Functions & models', description: 'Hàm số, họ hàm, biến đổi, hàm hợp/ngược.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Giới hạn & liên tục|||Chapter 2 — Limits & continuity', description: 'Giới hạn, luật, một bên/vô cực, liên tục.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đạo hàm|||Chapter 3 — Derivatives', description: 'Định nghĩa & quy tắc tính đạo hàm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ứng dụng đạo hàm|||Chapter 4 — Applications of derivative', description: 'Cực trị, đơn điệu, lồi lõm, tối ưu, LHopital.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nguyên hàm & tích phân bất định|||Chapter 5 — Antiderivatives', description: 'Nguyên hàm, bảng cơ bản, đổi biến.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tích phân xác định|||Chapter 6 — Definite integral', description: 'Riemann, định lý cơ bản của giải tích.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kỹ thuật tích phân|||Chapter 7 — Techniques', description: 'Từng phần, phân thức hữu tỉ, lượng giác.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng tích phân|||Chapter 8 — Applications', description: 'Diện tích, thể tích, chuỗi Taylor.', lessons: [c8, c8q] },
  ],
};
