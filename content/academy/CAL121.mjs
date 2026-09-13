/**
 * CAL121 — Calculus II (Giải tích II). Ngành Khoa học Máy tính FPTU, Kỳ 2.
 * NỐI TIẾP CAL111 (giải tích một biến). KHUNG chất lượng: 8 chương —
 * ứng dụng tích phân sâu → kỹ thuật tích phân nâng cao → chuỗi số →
 * chuỗi luỹ thừa & Taylor → hàm nhiều biến → cực trị nhiều biến →
 * tích phân bội → giải tích vector cơ bản. Sách chuẩn: Stewart "Calculus",
 * Thomas "Calculus"; MIT 18.02, Khan Academy, Paul's Online Math Notes.
 * Song ngữ + công thức + ví dụ giải + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick lồng / ${...}; "&" → "&amp;" trong content HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cal121-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Stewart, Thomas), tài liệu mở (MIT 18.02, Khan Academy, Paul Online Math Notes), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CAL121 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to continue into <strong>Calculus II</strong> — integral applications, series, and multivariable calculus — in one place. This course <strong>follows on from CAL111</strong>. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal, world-class resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CAL121 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (world standard)</h3>
<ul>
<li><em>Calculus</em> — James Stewart (the global default; Calc II lives in the later chapters).</li>
<li><em>Thomas' Calculus</em> — Thomas, Weir &amp; Hass.</li>
</ul>
<h3>🌐 Free / open courseware</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-02-multivariable-calculus-fall-2007/" target="_blank" rel="noopener">MIT 18.02 — Multivariable Calculus (OCW)</a></li>
<li><a href="https://www.khanacademy.org/math/calculus-2" target="_blank" rel="noopener">Khan Academy — Calculus 2</a> &amp; <a href="https://www.khanacademy.org/math/multivariable-calculus" target="_blank" rel="noopener">Multivariable Calculus</a></li>
<li><a href="https://tutorial.math.lamar.edu/" target="_blank" rel="noopener">Paul's Online Math Notes (Lamar)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — Essence of Calculus (visual intuition)</li>
<li><a href="https://www.youtube.com/@ProfessorLeonard" target="_blank" rel="noopener">Professor Leonard</a> — full lectured Calculus II course</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — graph curves, areas and partial sums live</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — check integrals, series convergence &amp; partial derivatives step by step</li>
<li><a href="https://www.geogebra.org/3d" target="_blank" rel="noopener">GeoGebra 3D</a> — visualise surfaces, gradients &amp; solids of revolution</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Apply the integral</strong> — volumes, arc length, surface area, improper integrals.</li>
<li><strong>Series</strong> — sequences, convergence tests, power series and Taylor.</li>
<li><strong>Go multivariable</strong> — partial derivatives, gradient, optimization.</li>
<li><strong>Integrate in higher dimensions</strong> — double/triple integrals and intro vector calculus.</li>
</ol></div>`,
    `<span class="eyebrow">CAL121 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để đi tiếp vào <strong>Giải tích II</strong> — ứng dụng tích phân, chuỗi, và giải tích nhiều biến — gom về một chỗ. Môn này <strong>nối tiếp CAL111</strong>. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, đẳng cấp thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CAL121 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chuẩn quốc tế)</h3>
<ul>
<li><em>Calculus</em> — James Stewart (sách mặc định toàn cầu; Calc II ở các chương sau).</li>
<li><em>Thomas' Calculus</em> — Thomas, Weir &amp; Hass.</li>
</ul>
<h3>🌐 Học liệu mở / miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-02-multivariable-calculus-fall-2007/" target="_blank" rel="noopener">MIT 18.02 — Multivariable Calculus (OCW)</a></li>
<li><a href="https://www.khanacademy.org/math/calculus-2" target="_blank" rel="noopener">Khan Academy — Calculus 2</a> &amp; <a href="https://www.khanacademy.org/math/multivariable-calculus" target="_blank" rel="noopener">Multivariable Calculus</a></li>
<li><a href="https://tutorial.math.lamar.edu/" target="_blank" rel="noopener">Paul's Online Math Notes (Lamar)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — Essence of Calculus (trực giác hình ảnh)</li>
<li><a href="https://www.youtube.com/@ProfessorLeonard" target="_blank" rel="noopener">Professor Leonard</a> — khoá Giải tích II giảng đầy đủ</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — vẽ đường cong, diện tích và tổng riêng trực tiếp</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — kiểm tra tích phân, hội tụ chuỗi &amp; đạo hàm riêng từng bước</li>
<li><a href="https://www.geogebra.org/3d" target="_blank" rel="noopener">GeoGebra 3D</a> — trực quan mặt cong, gradient &amp; vật thể tròn xoay</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Ứng dụng tích phân</strong> — thể tích, độ dài cung, diện tích mặt, tích phân suy rộng.</li>
<li><strong>Chuỗi</strong> — dãy, các tiêu chuẩn hội tụ, chuỗi luỹ thừa và Taylor.</li>
<li><strong>Sang nhiều biến</strong> — đạo hàm riêng, gradient, tối ưu hoá.</li>
<li><strong>Tích phân chiều cao hơn</strong> — tích phân kép/ba và nhập môn giải tích vector.</li>
</ol></div>`,
  ]]);

const intro = doc('cal121-0-1-overview', 'Course overview: Calculus II|||Tổng quan: Giải tích II',
  'CAL121 nối tiếp CAL111: bắt đầu từ ứng dụng sâu của tích phân, sang chuỗi số & chuỗi Taylor, rồi mở rộng giải tích lên nhiều biến (đạo hàm riêng, gradient, tích phân bội, vector).',
  [[
    `<span class="eyebrow">CAL121 · Lesson 0.1 · Overview</span>
<h2>What is Calculus II?</h2>
<p class="lead">Calculus II takes the two engines you built in <strong>CAL111</strong> — the derivative and the integral — and pushes them much further: deep applications of the integral, the theory of <strong>infinite series</strong>, and the leap from one variable to <strong>many variables</strong>.</p>
<h3>Where CAL111 left off</h3>
<p>You ended CAL111 with the definite integral, the Fundamental Theorem, basic integration techniques and a first glimpse of Taylor series. CAL121 assumes all of that is solid.</p>
<h3>The three big movements</h3>
<ul>
<li><strong>The integral, applied &amp; extended</strong> — volumes, arc length, surface area, and improper integrals over infinite ranges.</li>
<li><strong>Sequences &amp; series</strong> — when does an infinite sum have a finite value? Power series and Taylor turn functions into polynomials.</li>
<li><strong>Multivariable calculus</strong> — partial derivatives, gradients, optimization, and double/triple integrals in the plane and space.</li>
</ul>
<pre><code>Single variable (CAL111):   f(x),   f'(x),   ∫ f(x) dx
Many variables (CAL121):    f(x,y), ∂f/∂x,  ∬ f(x,y) dA
Infinite sums:              Σ a_n ,  converges or diverges?
</code></pre>
<div class="callout"><span class="badge">Why it matters for CS</span> Gradients drive gradient descent in machine learning, series give fast numeric approximations, and multiple integrals underlie probability over many variables and 3D graphics.</div>`,
    `<span class="eyebrow">CAL121 · Bài 0.1 · Tổng quan</span>
<h2>Giải tích II là gì?</h2>
<p class="lead">Giải tích II lấy hai cỗ máy bạn dựng ở <strong>CAL111</strong> — đạo hàm và tích phân — rồi đẩy đi xa hơn nhiều: ứng dụng sâu của tích phân, lý thuyết <strong>chuỗi vô hạn</strong>, và bước nhảy từ một biến sang <strong>nhiều biến</strong>.</p>
<h3>CAL111 dừng ở đâu</h3>
<p>Bạn kết thúc CAL111 với tích phân xác định, định lý cơ bản, các kỹ thuật tích phân cơ bản và cái nhìn đầu tiên về chuỗi Taylor. CAL121 giả định tất cả những thứ đó đã vững.</p>
<h3>Ba mạch lớn</h3>
<ul>
<li><strong>Tích phân, ứng dụng &amp; mở rộng</strong> — thể tích, độ dài cung, diện tích mặt, và tích phân suy rộng trên miền vô hạn.</li>
<li><strong>Dãy &amp; chuỗi</strong> — khi nào một tổng vô hạn có giá trị hữu hạn? Chuỗi luỹ thừa và Taylor biến hàm thành đa thức.</li>
<li><strong>Giải tích nhiều biến</strong> — đạo hàm riêng, gradient, tối ưu hoá, và tích phân kép/ba trong mặt phẳng và không gian.</li>
</ul>
<pre><code>Một biến (CAL111):     f(x),   f'(x),   ∫ f(x) dx
Nhiều biến (CAL121):   f(x,y), ∂f/∂x,  ∬ f(x,y) dA
Tổng vô hạn:           Σ a_n ,  hội tụ hay phân kỳ?
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng với CNTT</span> Gradient là động cơ của gradient descent trong học máy, chuỗi cho xấp xỉ số nhanh, và tích phân bội là nền của xác suất nhiều biến và đồ hoạ 3D.</div>`,
  ]]);

const c1 = doc('cal121-1-1-applications-integral', '1.1 — Deeper applications of the integral|||1.1 — Ứng dụng tích phân sâu',
  'Thể tích vật thể tròn xoay bằng phương pháp đĩa/vành khăn (disk/washer) và vỏ trụ (shell); độ dài cung của đường cong; diện tích mặt tròn xoay.',
  [[
    `<span class="eyebrow">CAL121 · Chapter 1 · Lesson 1.1</span>
<h2>Deeper applications of the integral</h2>
<h3>Volumes: disks, washers &amp; shells</h3>
<p>Rotate a region about an axis and it sweeps out a solid. Slice it into thin <strong>disks</strong> (or <strong>washers</strong> when there is a hole), or into thin cylindrical <strong>shells</strong> — each way gives an integral for the same volume; pick whichever matches the geometry.</p>
<pre><code>Disk (about x-axis):    V = ∫[a,b] π [ f(x) ]^2 dx
Washer (outer R, inner r):
                        V = ∫[a,b] π ( R(x)^2 - r(x)^2 ) dx
Shell (about y-axis):   V = ∫[a,b] 2π x f(x) dx
</code></pre>
<h3>Arc length</h3>
<p>Add up infinitely many tiny straight pieces √(dx^2 + dy^2) to get the length of a curve.</p>
<pre><code>Arc length:  L = ∫[a,b] √( 1 + [ f'(x) ]^2 ) dx
</code></pre>
<h3>Surface area of revolution</h3>
<pre><code>About x-axis:  S = ∫[a,b] 2π f(x) √( 1 + [ f'(x) ]^2 ) dx

Worked example — shell volume, y = x^2 rotated about y-axis, x in [0,2]:
  V = ∫[0,2] 2π x (x^2) dx = 2π ∫[0,2] x^3 dx
    = 2π [ x^4/4 ] from 0 to 2 = 2π (16/4) = 8π
</code></pre>
<div class="callout"><span class="badge">Disk vs shell</span> Rotating about the x-axis with y = f(x)? Disks are natural. Rotating about the y-axis but the function is y = f(x)? Shells save you from solving for x.</div>`,
    `<span class="eyebrow">CAL121 · Chương 1 · Bài 1.1</span>
<h2>Ứng dụng tích phân sâu</h2>
<h3>Thể tích: đĩa, vành khăn &amp; vỏ trụ</h3>
<p>Quay một miền quanh một trục thì nó quét ra một vật thể. Chia nó thành các <strong>đĩa</strong> mỏng (hoặc <strong>vành khăn</strong> khi có lỗ), hoặc thành các <strong>vỏ trụ</strong> mỏng — mỗi cách cho một tích phân cho cùng thể tích; chọn cách khớp với hình học.</p>
<pre><code>Đĩa (quanh trục Ox):    V = ∫[a,b] π [ f(x) ]^2 dx
Vành khăn (ngoài R, trong r):
                        V = ∫[a,b] π ( R(x)^2 - r(x)^2 ) dx
Vỏ trụ (quanh trục Oy): V = ∫[a,b] 2π x f(x) dx
</code></pre>
<h3>Độ dài cung</h3>
<p>Cộng vô số mảnh thẳng nhỏ √(dx^2 + dy^2) để được độ dài một đường cong.</p>
<pre><code>Độ dài cung:  L = ∫[a,b] √( 1 + [ f'(x) ]^2 ) dx
</code></pre>
<h3>Diện tích mặt tròn xoay</h3>
<pre><code>Quanh trục Ox:  S = ∫[a,b] 2π f(x) √( 1 + [ f'(x) ]^2 ) dx

Ví dụ mẫu — thể tích vỏ trụ, y = x^2 quay quanh Oy, x trong [0,2]:
  V = ∫[0,2] 2π x (x^2) dx = 2π ∫[0,2] x^3 dx
    = 2π [ x^4/4 ] từ 0 đến 2 = 2π (16/4) = 8π
</code></pre>
<div class="callout"><span class="badge">Đĩa hay vỏ</span> Quay quanh trục Ox với y = f(x)? Dùng đĩa là tự nhiên. Quay quanh trục Oy mà hàm là y = f(x)? Vỏ trụ giúp bạn khỏi phải giải theo x.</div>`,
  ]]);

const c1q = quiz('cal121-quiz-1', 'Quiz 1 — Applications of the integral|||Quiz 1 — Ứng dụng tích phân', [
  { id: 'q1', question: 'Thể tích quay y = f(x) quanh trục Oy bằng phương pháp vỏ trụ là?', options: ['∫ π [f(x)]^2 dx', '∫ 2π x f(x) dx', '∫ 2π f(x) dx', '∫ π x^2 dx'], correctIndex: 1, explanation: 'Mỗi vỏ trụ có chu vi 2πx và cao f(x), bề dày dx.' },
  { id: 'q2', question: 'Công thức độ dài cung của y = f(x) trên [a,b] là?', options: ['∫ √(1 + [f\'(x)]^2) dx', '∫ [f\'(x)]^2 dx', '∫ f(x) dx', '∫ π [f(x)]^2 dx'], correctIndex: 0, explanation: 'Cộng các mảnh √(dx^2 + dy^2) = √(1 + [f\'(x)]^2) dx.' },
  { id: 'q3', question: 'Thể tích vỏ trụ của y = x^2 quay quanh Oy, x trong [0,2] bằng?', options: ['4π', '8π', '16π', '2π'], correctIndex: 1, explanation: '∫[0,2] 2π x·x^2 dx = 2π·(16/4) = 8π.' },
]);

const c2 = doc('cal121-2-1-techniques', '2.1 — Advanced integration &amp; improper integrals|||2.1 — Kỹ thuật tích phân nâng cao & tích phân suy rộng',
  'Ôn nhanh kỹ thuật tích phân; tích phân suy rộng (cận vô hạn, hàm không bị chặn); hội tụ/phân kỳ; tiêu chuẩn so sánh để kết luận hội tụ mà không cần tính.',
  [[
    `<span class="eyebrow">CAL121 · Chapter 2 · Lesson 2.1</span>
<h2>Advanced integration &amp; improper integrals</h2>
<h3>Improper integrals</h3>
<p>An integral is <strong>improper</strong> when a limit of integration is infinite, or the integrand blows up inside the interval. Define it as a <em>limit</em> of ordinary integrals: if the limit is finite the integral <strong>converges</strong>, otherwise it <strong>diverges</strong>.</p>
<pre><code>Infinite upper limit:
  ∫[1,∞) 1/x^2 dx = lim (t->∞) ∫[1,t] x^(-2) dx
                  = lim (t->∞) [ -1/x ] from 1 to t
                  = lim (t->∞) ( 1 - 1/t ) = 1     (converges)

Compare:  ∫[1,∞) 1/x dx = lim (t->∞) ln t = ∞      (diverges)
</code></pre>
<h3>The p-test</h3>
<pre><code>∫[1,∞) 1/x^p dx  converges  when  p &gt; 1 ,  diverges  when  p &lt;= 1
</code></pre>
<h3>Comparison test for convergence</h3>
<p>You often only need to know <em>whether</em> an improper integral converges, not its value. Bound it above by a simpler integral you already understand.</p>
<pre><code>If 0 &lt;= f(x) &lt;= g(x) and ∫ g converges, then ∫ f converges.
If f(x) &gt;= g(x) &gt;= 0 and ∫ g diverges,  then ∫ f diverges.
</code></pre>
<div class="callout"><span class="badge">Same idea, coming up</span> This convergence-by-comparison thinking is exactly what powers the series tests in the next chapter — an integral and a series are close cousins.</div>`,
    `<span class="eyebrow">CAL121 · Chương 2 · Bài 2.1</span>
<h2>Kỹ thuật tích phân nâng cao &amp; tích phân suy rộng</h2>
<h3>Tích phân suy rộng</h3>
<p>Một tích phân là <strong>suy rộng</strong> khi cận tích phân vô hạn, hoặc hàm dưới dấu tích phân tiến ra vô cực trong khoảng. Định nghĩa nó là <em>giới hạn</em> của tích phân thường: nếu giới hạn hữu hạn thì tích phân <strong>hội tụ</strong>, ngược lại thì <strong>phân kỳ</strong>.</p>
<pre><code>Cận trên vô hạn:
  ∫[1,∞) 1/x^2 dx = lim (t->∞) ∫[1,t] x^(-2) dx
                  = lim (t->∞) [ -1/x ] từ 1 đến t
                  = lim (t->∞) ( 1 - 1/t ) = 1     (hội tụ)

So sánh:  ∫[1,∞) 1/x dx = lim (t->∞) ln t = ∞      (phân kỳ)
</code></pre>
<h3>Tiêu chuẩn p</h3>
<pre><code>∫[1,∞) 1/x^p dx  hội tụ  khi  p &gt; 1 ,  phân kỳ  khi  p &lt;= 1
</code></pre>
<h3>Tiêu chuẩn so sánh để xét hội tụ</h3>
<p>Nhiều khi bạn chỉ cần biết tích phân suy rộng <em>có</em> hội tụ hay không, chứ không cần giá trị. Chặn nó trên bởi một tích phân đơn giản hơn mà bạn đã hiểu.</p>
<pre><code>Nếu 0 &lt;= f(x) &lt;= g(x) và ∫ g hội tụ, thì ∫ f hội tụ.
Nếu f(x) &gt;= g(x) &gt;= 0 và ∫ g phân kỳ, thì ∫ f phân kỳ.
</code></pre>
<div class="callout"><span class="badge">Ý tưởng sắp gặp lại</span> Lối tư duy hội tụ bằng so sánh này chính là thứ vận hành các tiêu chuẩn chuỗi ở chương sau — tích phân và chuỗi là anh em họ gần.</div>`,
  ]]);

const c2q = quiz('cal121-quiz-2', 'Quiz 2 — Improper integrals|||Quiz 2 — Tích phân suy rộng', [
  { id: 'q1', question: '∫[1,∞) 1/x^2 dx bằng?', options: ['1', '∞ (phân kỳ)', '0', '2'], correctIndex: 0, explanation: '[-1/x] từ 1 đến ∞ = 1 - 0 = 1, hội tụ.' },
  { id: 'q2', question: 'Theo tiêu chuẩn p, ∫[1,∞) 1/x^p dx hội tụ khi?', options: ['p < 1', 'p = 1', 'p > 1', 'mọi p'], correctIndex: 2, explanation: 'Chỉ hội tụ khi p > 1; p <= 1 thì phân kỳ.' },
  { id: 'q3', question: '∫[1,∞) 1/x dx thì?', options: ['Hội tụ về 1', 'Hội tụ về 0', 'Phân kỳ (ra ∞)', 'Bằng ln 1'], correctIndex: 2, explanation: 'lim (t->∞) ln t = ∞ nên phân kỳ (đây là p = 1).' },
]);

const c3 = doc('cal121-3-1-series', '3.1 — Sequences &amp; series|||3.1 — Dãy số & chuỗi số',
  'Dãy số và giới hạn dãy; chuỗi số & tổng riêng; hội tụ/phân kỳ; chuỗi hình học & chuỗi p; các tiêu chuẩn: số hạng thứ n, so sánh, tích phân, tỉ số, căn.',
  [[
    `<span class="eyebrow">CAL121 · Chapter 3 · Lesson 3.1</span>
<h2>Sequences &amp; series</h2>
<h3>Sequence vs series</h3>
<p>A <strong>sequence</strong> is an ordered list a_1, a_2, a_3, …; it converges if a_n approaches a limit. A <strong>series</strong> is the infinite sum Σ a_n; it converges if its <strong>partial sums</strong> s_n = a_1 + … + a_n approach a limit.</p>
<h3>Two series you must know cold</h3>
<pre><code>Geometric:  Σ (n>=0) r^n = 1/(1 - r)   when |r| &lt; 1 ,  diverges when |r| &gt;= 1
p-series:   Σ (n>=1) 1/n^p            converges when p &gt; 1 , diverges when p &lt;= 1
Harmonic (p = 1):  Σ 1/n  diverges  (slowly, but it does)
</code></pre>
<h3>The convergence tests</h3>
<pre><code>nth-term test:  if a_n does NOT -> 0, the series diverges (a fast first check)
Comparison:     bound a_n by a known convergent/divergent series
Integral test:  Σ f(n) and ∫ f(x) dx converge or diverge together (f>0, decreasing)
Ratio test:     L = lim |a_(n+1)/a_n| ;  L &lt; 1 converges, L &gt; 1 diverges, L = 1 ?
Root test:      L = lim (|a_n|)^(1/n) ;   same verdict as the ratio test
</code></pre>
<h3>Worked example — ratio test</h3>
<pre><code>Σ 1/n!  :  a_(n+1)/a_n = n!/(n+1)! = 1/(n+1) -> 0 &lt; 1  =>  converges
</code></pre>
<div class="callout"><span class="badge">Order of attack</span> Try the nth-term test first (cheap). Factorials or n-th powers? Reach for ratio/root. Looks like 1/n^p? Compare or use the integral test.</div>`,
    `<span class="eyebrow">CAL121 · Chương 3 · Bài 3.1</span>
<h2>Dãy số &amp; chuỗi số</h2>
<h3>Dãy khác chuỗi</h3>
<p>Một <strong>dãy số</strong> là danh sách có thứ tự a_1, a_2, a_3, …; nó hội tụ nếu a_n tiến tới một giới hạn. Một <strong>chuỗi số</strong> là tổng vô hạn Σ a_n; nó hội tụ nếu các <strong>tổng riêng</strong> s_n = a_1 + … + a_n tiến tới một giới hạn.</p>
<h3>Hai chuỗi phải thuộc lòng</h3>
<pre><code>Hình học:  Σ (n>=0) r^n = 1/(1 - r)   khi |r| &lt; 1 ,  phân kỳ khi |r| &gt;= 1
Chuỗi p:   Σ (n>=1) 1/n^p            hội tụ khi p &gt; 1 , phân kỳ khi p &lt;= 1
Điều hoà (p = 1):  Σ 1/n  phân kỳ  (chậm, nhưng vẫn phân kỳ)
</code></pre>
<h3>Các tiêu chuẩn hội tụ</h3>
<pre><code>Số hạng thứ n:  nếu a_n KHÔNG -> 0 thì chuỗi phân kỳ (kiểm tra nhanh đầu tiên)
So sánh:        chặn a_n bởi một chuỗi đã biết hội tụ/phân kỳ
Tích phân:      Σ f(n) và ∫ f(x) dx cùng hội tụ hoặc cùng phân kỳ (f>0, giảm)
Tỉ số:          L = lim |a_(n+1)/a_n| ;  L &lt; 1 hội tụ, L &gt; 1 phân kỳ, L = 1 ?
Căn:            L = lim (|a_n|)^(1/n) ;   kết luận như tiêu chuẩn tỉ số
</code></pre>
<h3>Ví dụ mẫu — tiêu chuẩn tỉ số</h3>
<pre><code>Σ 1/n!  :  a_(n+1)/a_n = n!/(n+1)! = 1/(n+1) -> 0 &lt; 1  =>  hội tụ
</code></pre>
<div class="callout"><span class="badge">Thứ tự tấn công</span> Thử tiêu chuẩn số hạng thứ n trước (rẻ). Có giai thừa hay luỹ thừa bậc n? Dùng tỉ số/căn. Trông giống 1/n^p? So sánh hoặc dùng tiêu chuẩn tích phân.</div>`,
  ]]);

const c3q = quiz('cal121-quiz-3', 'Quiz 3 — Series|||Quiz 3 — Chuỗi số', [
  { id: 'q1', question: 'Chuỗi hình học Σ r^n (n>=0) hội tụ khi?', options: ['|r| > 1', '|r| < 1', 'r = 1', 'mọi r'], correctIndex: 1, explanation: 'Hội tụ về 1/(1-r) khi |r| < 1.' },
  { id: 'q2', question: 'Chuỗi điều hoà Σ 1/n thì?', options: ['Hội tụ về 1', 'Hội tụ về 0', 'Phân kỳ', 'Hội tụ về e'], correctIndex: 2, explanation: 'Chuỗi p với p = 1 nên phân kỳ (dù rất chậm).' },
  { id: 'q3', question: 'Dùng tiêu chuẩn tỉ số cho Σ 1/n!, giới hạn L bằng?', options: ['1', '0', '∞', 'e'], correctIndex: 1, explanation: 'a_(n+1)/a_n = 1/(n+1) -> 0 < 1 nên hội tụ.' },
]);

const c4 = doc('cal121-4-1-power-taylor', '4.1 — Power series, Taylor &amp; Maclaurin|||4.1 — Chuỗi luỹ thừa, Taylor & Maclaurin',
  'Chuỗi luỹ thừa Σ c_n (x-a)^n; bán kính & khoảng hội tụ (tiêu chuẩn tỉ số); chuỗi Taylor/Maclaurin biểu diễn hàm bằng đa thức vô hạn; các khai triển chuẩn.',
  [[
    `<span class="eyebrow">CAL121 · Chapter 4 · Lesson 4.1</span>
<h2>Power series, Taylor &amp; Maclaurin</h2>
<h3>Power series</h3>
<p>A <strong>power series</strong> centered at a is Σ c_n (x - a)^n. It converges for x inside an interval of length 2R around a, where R is the <strong>radius of convergence</strong> — usually found with the ratio test.</p>
<pre><code>Radius of convergence (ratio test):
  1/R = lim | c_(n+1) / c_n |         (then check the two endpoints separately)
</code></pre>
<h3>Taylor &amp; Maclaurin series</h3>
<p>A <strong>Taylor series</strong> rebuilds a smooth function as an infinite polynomial from its derivatives at a point. Centered at 0 it is called a <strong>Maclaurin series</strong>.</p>
<pre><code>Taylor at a:   f(x) = Σ (n>=0) f^(n)(a) / n! · (x - a)^n
Maclaurin:     f(x) = f(0) + f'(0) x + f''(0) x^2/2! + ...
</code></pre>
<h3>The standard expansions</h3>
<pre><code>e^x   = 1 + x + x^2/2! + x^3/3! + ...            (all x)
sin x = x - x^3/3! + x^5/5! - ...                (all x)
cos x = 1 - x^2/2! + x^4/4! - ...                (all x)
1/(1-x) = 1 + x + x^2 + x^3 + ...                (|x| &lt; 1)
</code></pre>
<h3>Worked example — radius of convergence</h3>
<pre><code>Σ x^n / n :  |a_(n+1)/a_n| = |x| · n/(n+1) -> |x|
  converges when |x| &lt; 1  =>  R = 1
</code></pre>
<div class="callout"><span class="badge">Where CS meets it</span> Truncating a Taylor series is how a computer actually evaluates e^x, sin x and ln x — a few terms give machine precision.</div>`,
    `<span class="eyebrow">CAL121 · Chương 4 · Bài 4.1</span>
<h2>Chuỗi luỹ thừa, Taylor &amp; Maclaurin</h2>
<h3>Chuỗi luỹ thừa</h3>
<p>Một <strong>chuỗi luỹ thừa</strong> tâm tại a là Σ c_n (x - a)^n. Nó hội tụ với x nằm trong một khoảng dài 2R quanh a, với R là <strong>bán kính hội tụ</strong> — thường tìm bằng tiêu chuẩn tỉ số.</p>
<pre><code>Bán kính hội tụ (tiêu chuẩn tỉ số):
  1/R = lim | c_(n+1) / c_n |         (rồi kiểm hai đầu mút riêng)
</code></pre>
<h3>Chuỗi Taylor &amp; Maclaurin</h3>
<p>Một <strong>chuỗi Taylor</strong> dựng lại một hàm trơn thành đa thức vô hạn từ các đạo hàm của nó tại một điểm. Khi tâm tại 0 nó được gọi là <strong>chuỗi Maclaurin</strong>.</p>
<pre><code>Taylor tại a:  f(x) = Σ (n>=0) f^(n)(a) / n! · (x - a)^n
Maclaurin:     f(x) = f(0) + f'(0) x + f''(0) x^2/2! + ...
</code></pre>
<h3>Các khai triển chuẩn</h3>
<pre><code>e^x   = 1 + x + x^2/2! + x^3/3! + ...            (mọi x)
sin x = x - x^3/3! + x^5/5! - ...                (mọi x)
cos x = 1 - x^2/2! + x^4/4! - ...                (mọi x)
1/(1-x) = 1 + x + x^2 + x^3 + ...                (|x| &lt; 1)
</code></pre>
<h3>Ví dụ mẫu — bán kính hội tụ</h3>
<pre><code>Σ x^n / n :  |a_(n+1)/a_n| = |x| · n/(n+1) -> |x|
  hội tụ khi |x| &lt; 1  =>  R = 1
</code></pre>
<div class="callout"><span class="badge">Chỗ CNTT gặp giải tích</span> Cắt ngắn chuỗi Taylor chính là cách máy tính thực sự tính e^x, sin x và ln x — vài số hạng đã cho độ chính xác máy.</div>`,
  ]]);

const c4q = quiz('cal121-quiz-4', 'Quiz 4 — Power series &amp; Taylor|||Quiz 4 — Chuỗi luỹ thừa & Taylor', [
  { id: 'q1', question: 'Chuỗi Maclaurin của e^x là?', options: ['1 + x + x^2/2! + ...', 'x - x^3/3! + ...', '1 - x^2/2! + ...', '1 + x^2 + x^4 + ...'], correctIndex: 0, explanation: 'e^x = Σ x^n/n! = 1 + x + x^2/2! + ...' },
  { id: 'q2', question: 'Bán kính hội tụ của Σ x^n/n là?', options: ['0', '1', '∞', '1/2'], correctIndex: 1, explanation: '|a_(n+1)/a_n| -> |x|, hội tụ khi |x| < 1 nên R = 1.' },
  { id: 'q3', question: 'Chuỗi Taylor của f tại a có hệ số của (x-a)^n là?', options: ['f(a)/n', 'f^(n)(a)/n!', 'f\'(a)·n', 'f^(n)(a)·n!'], correctIndex: 1, explanation: 'Hệ số Taylor thứ n là f^(n)(a)/n!.' },
]);

const c5 = doc('cal121-5-1-multivariable', '5.1 — Functions of several variables|||5.1 — Hàm nhiều biến',
  'Hàm nhiều biến f(x,y) & mặt cong; đạo hàm riêng ∂f/∂x, ∂f/∂y; gradient ∇f; đạo hàm có hướng; ý nghĩa hình học của gradient (hướng tăng nhanh nhất).',
  [[
    `<span class="eyebrow">CAL121 · Chapter 5 · Lesson 5.1</span>
<h2>Functions of several variables</h2>
<h3>From curves to surfaces</h3>
<p>A function f(x, y) assigns a height to each point of the plane — its graph is a <strong>surface</strong> in 3D. Everything from CAL111 generalizes; the derivative becomes several partial derivatives.</p>
<h3>Partial derivatives</h3>
<p>A <strong>partial derivative</strong> differentiates with respect to one variable while holding the others constant.</p>
<pre><code>f(x,y) = x^2 y + 3y
  ∂f/∂x = 2x y            (treat y as a constant)
  ∂f/∂y = x^2 + 3         (treat x as a constant)
</code></pre>
<h3>The gradient</h3>
<p>Collect the partials into a vector, the <strong>gradient</strong> ∇f. It points in the direction of <em>steepest increase</em>, and its length is the maximum rate of change.</p>
<pre><code>Gradient:            ∇f = ( ∂f/∂x , ∂f/∂y )
Directional deriv.:  D_u f = ∇f · u        (u a unit vector)
</code></pre>
<h3>Worked example</h3>
<pre><code>f(x,y) = x^2 + y^2 ,  at the point (1, 2):
  ∇f = (2x, 2y) = (2, 4)
  rate of increase toward u = (1,0):  D_u f = (2,4)·(1,0) = 2
</code></pre>
<div class="callout"><span class="badge">Why CS cares</span> Training a model = repeatedly stepping <em>against</em> the gradient of a loss function. ∇f is the single most important object in machine learning.</div>`,
    `<span class="eyebrow">CAL121 · Chương 5 · Bài 5.1</span>
<h2>Hàm nhiều biến</h2>
<h3>Từ đường cong sang mặt cong</h3>
<p>Một hàm f(x, y) gán một độ cao cho mỗi điểm của mặt phẳng — đồ thị của nó là một <strong>mặt cong</strong> trong 3D. Mọi thứ từ CAL111 đều tổng quát hoá được; đạo hàm trở thành nhiều đạo hàm riêng.</p>
<h3>Đạo hàm riêng</h3>
<p>Một <strong>đạo hàm riêng</strong> lấy đạo hàm theo một biến trong khi giữ các biến còn lại như hằng số.</p>
<pre><code>f(x,y) = x^2 y + 3y
  ∂f/∂x = 2x y            (coi y là hằng số)
  ∂f/∂y = x^2 + 3         (coi x là hằng số)
</code></pre>
<h3>Gradient</h3>
<p>Gom các đạo hàm riêng thành một vector, gọi là <strong>gradient</strong> ∇f. Nó chỉ về hướng <em>tăng nhanh nhất</em>, và độ dài của nó là tốc độ thay đổi lớn nhất.</p>
<pre><code>Gradient:            ∇f = ( ∂f/∂x , ∂f/∂y )
Đạo hàm có hướng:    D_u f = ∇f · u        (u là vector đơn vị)
</code></pre>
<h3>Ví dụ mẫu</h3>
<pre><code>f(x,y) = x^2 + y^2 ,  tại điểm (1, 2):
  ∇f = (2x, 2y) = (2, 4)
  tốc độ tăng theo hướng u = (1,0):  D_u f = (2,4)·(1,0) = 2
</code></pre>
<div class="callout"><span class="badge">Vì sao CNTT quan tâm</span> Huấn luyện một mô hình = liên tục bước <em>ngược</em> chiều gradient của hàm mất mát. ∇f là đối tượng quan trọng bậc nhất trong học máy.</div>`,
  ]]);

const c5q = quiz('cal121-quiz-5', 'Quiz 5 — Multivariable functions|||Quiz 5 — Hàm nhiều biến', [
  { id: 'q1', question: 'Với f(x,y) = x^2 y + 3y, ∂f/∂x bằng?', options: ['x^2 + 3', '2x y', '2x y + 3', 'x^2'], correctIndex: 1, explanation: 'Coi y hằng số: ∂/∂x (x^2 y) = 2x y; số hạng 3y mất.' },
  { id: 'q2', question: 'Gradient ∇f chỉ về hướng?', options: ['Giảm nhanh nhất', 'Tăng nhanh nhất', 'Vuông góc với mọi hướng', 'Song song trục Ox'], correctIndex: 1, explanation: '∇f chỉ hướng hàm tăng nhanh nhất; độ dài là tốc độ lớn nhất.' },
  { id: 'q3', question: 'Đạo hàm có hướng D_u f (u đơn vị) được tính bằng?', options: ['∇f + u', '∇f · u', '∇f × u', '|∇f| · |u|'], correctIndex: 1, explanation: 'D_u f = ∇f · u, tích vô hướng của gradient với vector đơn vị.' },
]);

const c6 = doc('cal121-6-1-optimization', '6.1 — Optimization of multivariable functions|||6.1 — Cực trị hàm nhiều biến',
  'Điểm dừng (∇f = 0); phân loại bằng ma trận Hessian & tiêu chuẩn định thức D; điểm yên ngựa; cực trị có ràng buộc bằng nhân tử Lagrange.',
  [[
    `<span class="eyebrow">CAL121 · Chapter 6 · Lesson 6.1</span>
<h2>Optimization of multivariable functions</h2>
<h3>Critical (stationary) points</h3>
<p>Extrema of f(x, y) can only occur where <strong>every partial derivative is zero</strong> — i.e. ∇f = 0. Solve that system to get the candidate points.</p>
<h3>The second-derivative (Hessian) test</h3>
<p>The <strong>Hessian</strong> collects the second partials; the sign of its determinant D classifies each critical point.</p>
<pre><code>D = f_xx · f_yy - ( f_xy )^2

  D &gt; 0 and f_xx &gt; 0   ->  local MINIMUM
  D &gt; 0 and f_xx &lt; 0   ->  local MAXIMUM
  D &lt; 0                ->  SADDLE point (neither)
  D = 0                ->  test is inconclusive
</code></pre>
<h3>Constrained optimization — Lagrange multipliers</h3>
<p>To optimize f subject to a constraint g(x, y) = k, the gradients must line up: ∇f = λ ∇g. Solve that together with the constraint.</p>
<pre><code>Maximize f on g = k:
  ∇f = λ ∇g   AND   g(x,y) = k
  (λ is the Lagrange multiplier)
</code></pre>
<h3>Worked example — a saddle</h3>
<pre><code>f(x,y) = x^2 - y^2 :  ∇f = (2x, -2y) = 0  =>  (0,0)
  f_xx = 2, f_yy = -2, f_xy = 0  =>  D = (2)(-2) - 0 = -4 &lt; 0  =>  saddle
</code></pre>
<div class="callout"><span class="badge">Saddles matter</span> High-dimensional loss surfaces in deep learning are riddled with saddle points, not just minima — knowing D &lt; 0 means "saddle" is real intuition, not just an exam fact.</div>`,
    `<span class="eyebrow">CAL121 · Chương 6 · Bài 6.1</span>
<h2>Cực trị hàm nhiều biến</h2>
<h3>Điểm dừng</h3>
<p>Cực trị của f(x, y) chỉ có thể xảy ra nơi <strong>mọi đạo hàm riêng bằng không</strong> — tức ∇f = 0. Giải hệ đó để có các điểm ứng viên.</p>
<h3>Tiêu chuẩn đạo hàm bậc hai (Hessian)</h3>
<p><strong>Ma trận Hessian</strong> gom các đạo hàm riêng bậc hai; dấu của định thức D phân loại mỗi điểm dừng.</p>
<pre><code>D = f_xx · f_yy - ( f_xy )^2

  D &gt; 0 và f_xx &gt; 0   ->  CỰC TIỂU địa phương
  D &gt; 0 và f_xx &lt; 0   ->  CỰC ĐẠI địa phương
  D &lt; 0               ->  điểm YÊN NGỰA (không phải cực trị)
  D = 0               ->  tiêu chuẩn không kết luận được
</code></pre>
<h3>Cực trị có ràng buộc — nhân tử Lagrange</h3>
<p>Để tối ưu f với ràng buộc g(x, y) = k, các gradient phải cùng phương: ∇f = λ ∇g. Giải cùng với ràng buộc.</p>
<pre><code>Tối ưu f trên g = k:
  ∇f = λ ∇g   VÀ   g(x,y) = k
  (λ là nhân tử Lagrange)
</code></pre>
<h3>Ví dụ mẫu — điểm yên ngựa</h3>
<pre><code>f(x,y) = x^2 - y^2 :  ∇f = (2x, -2y) = 0  =>  (0,0)
  f_xx = 2, f_yy = -2, f_xy = 0  =>  D = (2)(-2) - 0 = -4 &lt; 0  =>  yên ngựa
</code></pre>
<div class="callout"><span class="badge">Yên ngựa quan trọng</span> Mặt mất mát nhiều chiều trong học sâu đầy điểm yên ngựa, không chỉ cực tiểu — hiểu D &lt; 0 nghĩa là "yên ngựa" là trực giác thật, không chỉ là mẹo thi.</div>`,
  ]]);

const c6q = quiz('cal121-quiz-6', 'Quiz 6 — Multivariable optimization|||Quiz 6 — Cực trị nhiều biến', [
  { id: 'q1', question: 'Điểm dừng của f(x,y) là nơi?', options: ['f = 0', '∇f = 0 (mọi đạo hàm riêng bằng 0)', 'D = 0', 'f_xx > 0'], correctIndex: 1, explanation: 'Cực trị chỉ xảy ra tại điểm ∇f = 0.' },
  { id: 'q2', question: 'Nếu D = f_xx·f_yy - (f_xy)^2 < 0 thì điểm dừng là?', options: ['Cực tiểu', 'Cực đại', 'Điểm yên ngựa', 'Không kết luận'], correctIndex: 2, explanation: 'D < 0 luôn cho điểm yên ngựa.' },
  { id: 'q3', question: 'Điều kiện Lagrange để tối ưu f với ràng buộc g = k là?', options: ['∇f = 0', '∇f = λ ∇g và g = k', 'f = g', '∇g = 0'], correctIndex: 1, explanation: 'Gradient của f và g cùng phương: ∇f = λ∇g, kèm ràng buộc.' },
]);

const c7 = doc('cal121-7-1-multiple-integrals', '7.1 — Multiple integrals|||7.1 — Tích phân bội',
  'Tích phân kép ∬ f dA (thể tích dưới mặt cong) & tích phân lặp; tích phân ba ∭; đổi biến; toạ độ cực trong mặt phẳng, toạ độ trụ & cầu trong không gian.',
  [[
    `<span class="eyebrow">CAL121 · Chapter 7 · Lesson 7.1</span>
<h2>Multiple integrals</h2>
<h3>The double integral</h3>
<p>A <strong>double integral</strong> ∬_R f(x,y) dA is the signed volume between the surface z = f(x,y) and the region R in the plane. Compute it as an <strong>iterated integral</strong> — integrate in one variable, then the other.</p>
<pre><code>Iterated:  ∬_R f dA = ∫[c,d] ( ∫[a,b] f(x,y) dx ) dy

Example:  ∫[0,1] ∫[0,2] x y dx dy
  inner: ∫[0,2] x y dx = y [ x^2/2 ] = 2y
  outer: ∫[0,1] 2y dy = [ y^2 ] = 1
</code></pre>
<h3>Triple integrals</h3>
<pre><code>∭_E f(x,y,z) dV = ∫∫∫ over the solid E    (volume when f = 1)
</code></pre>
<h3>Better coordinates</h3>
<p>Circles and spheres are ugly in x, y, z. Switch coordinates and remember the <strong>Jacobian factor</strong>.</p>
<pre><code>Polar (plane):        dA = r dr dθ
Cylindrical (space):  dV = r dr dθ dz
Spherical (space):    dV = ρ^2 sin φ dρ dφ dθ

Polar example — area of disk radius R:
  ∫[0,2π] ∫[0,R] r dr dθ = ∫[0,2π] (R^2/2) dθ = π R^2
</code></pre>
<div class="callout"><span class="badge">Match the shape</span> Rectangular region → x,y. Disk or circular symmetry → polar. Cylinder → cylindrical. Ball or cone → spherical. The right coordinates turn a hard integral into an easy one.</div>`,
    `<span class="eyebrow">CAL121 · Chương 7 · Bài 7.1</span>
<h2>Tích phân bội</h2>
<h3>Tích phân kép</h3>
<p>Một <strong>tích phân kép</strong> ∬_R f(x,y) dA là thể tích có dấu giữa mặt cong z = f(x,y) và miền R trong mặt phẳng. Tính nó như một <strong>tích phân lặp</strong> — tích phân theo một biến, rồi biến kia.</p>
<pre><code>Tích phân lặp:  ∬_R f dA = ∫[c,d] ( ∫[a,b] f(x,y) dx ) dy

Ví dụ:  ∫[0,1] ∫[0,2] x y dx dy
  trong: ∫[0,2] x y dx = y [ x^2/2 ] = 2y
  ngoài: ∫[0,1] 2y dy = [ y^2 ] = 1
</code></pre>
<h3>Tích phân ba</h3>
<pre><code>∭_E f(x,y,z) dV = ∫∫∫ trên vật thể E    (là thể tích khi f = 1)
</code></pre>
<h3>Toạ độ tốt hơn</h3>
<p>Hình tròn và hình cầu rất xấu trong x, y, z. Đổi toạ độ và nhớ <strong>thừa số Jacobian</strong>.</p>
<pre><code>Cực (mặt phẳng):    dA = r dr dθ
Trụ (không gian):   dV = r dr dθ dz
Cầu (không gian):   dV = ρ^2 sin φ dρ dφ dθ

Ví dụ toạ độ cực — diện tích hình tròn bán kính R:
  ∫[0,2π] ∫[0,R] r dr dθ = ∫[0,2π] (R^2/2) dθ = π R^2
</code></pre>
<div class="callout"><span class="badge">Khớp với hình dạng</span> Miền chữ nhật → x,y. Hình tròn hay đối xứng tròn → cực. Hình trụ → trụ. Hình cầu hay nón → cầu. Toạ độ đúng biến một tích phân khó thành dễ.</div>`,
  ]]);

const c7q = quiz('cal121-quiz-7', 'Quiz 7 — Multiple integrals|||Quiz 7 — Tích phân bội', [
  { id: 'q1', question: '∫[0,1] ∫[0,2] x y dx dy bằng?', options: ['1', '2', '1/2', '4'], correctIndex: 0, explanation: 'Trong: ∫[0,2] xy dx = 2y; ngoài: ∫[0,1] 2y dy = 1.' },
  { id: 'q2', question: 'Trong toạ độ cực, phần tử diện tích dA bằng?', options: ['dr dθ', 'r dr dθ', 'r^2 dr dθ', 'dθ'], correctIndex: 1, explanation: 'Jacobian của toạ độ cực là r, nên dA = r dr dθ.' },
  { id: 'q3', question: 'Trong toạ độ cầu, phần tử thể tích dV bằng?', options: ['ρ dρ dφ dθ', 'ρ^2 dρ dφ dθ', 'ρ^2 sin φ dρ dφ dθ', 'r dr dθ dz'], correctIndex: 2, explanation: 'dV = ρ^2 sin φ dρ dφ dθ trong toạ độ cầu.' },
]);

const c8 = doc('cal121-8-1-vector-calculus', '8.1 — Introduction to vector calculus|||8.1 — Nhập môn giải tích vector',
  'Trường vector F(x,y); tích phân đường của trường vector (công); trường bảo toàn & hàm thế; định lý Green nối tích phân đường quanh biên với tích phân kép trên miền.',
  [[
    `<span class="eyebrow">CAL121 · Chapter 8 · Lesson 8.1</span>
<h2>Introduction to vector calculus</h2>
<h3>Vector fields</h3>
<p>A <strong>vector field</strong> F(x, y) attaches a vector to every point — think of wind or water flow, or a force at each location.</p>
<pre><code>F(x,y) = ( P(x,y) , Q(x,y) )
</code></pre>
<h3>Line integrals</h3>
<p>A <strong>line integral</strong> of F along a curve C adds up the field's push along the path — the <em>work</em> done by a force.</p>
<pre><code>Work:  ∫_C F · dr = ∫_C ( P dx + Q dy )
</code></pre>
<h3>Conservative fields</h3>
<p>If F = ∇f for some scalar f (a <strong>potential</strong>), the field is <strong>conservative</strong>: the line integral depends only on the endpoints, not the path.</p>
<pre><code>Conservative:  ∫_C ∇f · dr = f(end) - f(start)      (path independent)
Test in 2D:    ∂P/∂y = ∂Q/∂x
</code></pre>
<h3>Green's theorem (overview)</h3>
<p><strong>Green's theorem</strong> ties a line integral around a closed curve to a double integral over the region it encloses — the plane version of the Fundamental Theorem.</p>
<pre><code>∮_C ( P dx + Q dy ) = ∬_R ( ∂Q/∂x - ∂P/∂y ) dA
</code></pre>
<div class="callout"><span class="badge">One big idea</span> FTC, Green, and their higher cousins (Stokes, Divergence) all say the same thing: an integral over a boundary equals an integral of a derivative over the inside.</div>`,
    `<span class="eyebrow">CAL121 · Chương 8 · Bài 8.1</span>
<h2>Nhập môn giải tích vector</h2>
<h3>Trường vector</h3>
<p>Một <strong>trường vector</strong> F(x, y) gắn một vector vào mỗi điểm — hãy nghĩ tới luồng gió hay dòng nước, hoặc một lực tại mỗi vị trí.</p>
<pre><code>F(x,y) = ( P(x,y) , Q(x,y) )
</code></pre>
<h3>Tích phân đường</h3>
<p>Một <strong>tích phân đường</strong> của F dọc đường cong C cộng dồn lực đẩy của trường dọc theo đường đi — chính là <em>công</em> do một lực sinh ra.</p>
<pre><code>Công:  ∫_C F · dr = ∫_C ( P dx + Q dy )
</code></pre>
<h3>Trường bảo toàn</h3>
<p>Nếu F = ∇f với một hàm vô hướng f nào đó (một <strong>hàm thế</strong>), trường là <strong>bảo toàn</strong>: tích phân đường chỉ phụ thuộc hai đầu mút, không phụ thuộc đường đi.</p>
<pre><code>Bảo toàn:  ∫_C ∇f · dr = f(cuối) - f(đầu)      (độc lập đường đi)
Kiểm tra 2D:  ∂P/∂y = ∂Q/∂x
</code></pre>
<h3>Định lý Green (tổng quan)</h3>
<p><strong>Định lý Green</strong> nối một tích phân đường quanh một đường cong kín với một tích phân kép trên miền nó bao — bản phiên mặt phẳng của định lý cơ bản.</p>
<pre><code>∮_C ( P dx + Q dy ) = ∬_R ( ∂Q/∂x - ∂P/∂y ) dA
</code></pre>
<div class="callout"><span class="badge">Một ý tưởng lớn</span> Định lý cơ bản, Green, và các anh em cao hơn (Stokes, Divergence) đều nói cùng một điều: tích phân trên biên bằng tích phân của một đạo hàm trên phần trong.</div>`,
  ]]);

const c8q = quiz('cal121-quiz-8', 'Quiz 8 — Vector calculus|||Quiz 8 — Giải tích vector', [
  { id: 'q1', question: 'Tích phân đường ∫_C F · dr biểu diễn đại lượng nào?', options: ['Diện tích', 'Công của lực dọc đường đi', 'Thể tích', 'Độ dài cung'], correctIndex: 1, explanation: 'Nó cộng dồn thành phần của F dọc đường C — chính là công.' },
  { id: 'q2', question: 'Một trường vector 2D F = (P, Q) là bảo toàn khi?', options: ['P = Q', '∂P/∂y = ∂Q/∂x', 'P + Q = 0', '∂P/∂x = ∂Q/∂y'], correctIndex: 1, explanation: 'Điều kiện cần (miền đơn liên): ∂P/∂y = ∂Q/∂x, tức F = ∇f.' },
  { id: 'q3', question: 'Định lý Green nối tích phân đường quanh C kín với?', options: ['Một đạo hàm tại một điểm', 'Tích phân kép ∬ (∂Q/∂x - ∂P/∂y) dA trên miền R', 'Một chuỗi Taylor', 'Độ dài của C'], correctIndex: 1, explanation: '∮_C (P dx + Q dy) = ∬_R (∂Q/∂x - ∂P/∂y) dA.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CAL121',
    slug: 'cal121-calculus-ii',
    title: 'Calculus II',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CAL121.webp',
    shortDescription: 'Calculus II, following on from CAL111 — integral applications, improper integrals, series & convergence tests, power & Taylor series, multivariable functions (partial derivatives, gradient), optimization, multiple integrals & vector calculus. Bilingual, worked examples & quizzes.|||Giải tích II, nối tiếp CAL111 — ứng dụng tích phân, tích phân suy rộng, dãy & chuỗi, Taylor, hàm nhiều biến (đạo hàm riêng, gradient), cực trị, tích phân bội & giải tích vector. Song ngữ, ví dụ giải & quiz.',
    description: 'Môn <strong>CAL121 — Calculus II (Giải tích II)</strong> thuộc khung chương trình ngành Khoa học Máy tính (kỳ 2), <strong>nối tiếp CAL111</strong>. Từ <strong>ứng dụng tích phân sâu</strong> (thể tích đĩa/vỏ trụ, độ dài cung, diện tích mặt) → <strong>kỹ thuật tích phân nâng cao</strong> (tích phân suy rộng, so sánh hội tụ) → <strong>chuỗi số</strong> (các tiêu chuẩn hội tụ) → <strong>chuỗi luỹ thừa &amp; Taylor</strong> → <strong>hàm nhiều biến</strong> (đạo hàm riêng, gradient, đạo hàm có hướng) → <strong>cực trị nhiều biến</strong> (Hessian, nhân tử Lagrange) → <strong>tích phân bội</strong> (kép/ba, toạ độ cực/trụ/cầu) → <strong>nhập môn giải tích vector</strong> (trường vector, tích phân đường, định lý Green). Bám sách chuẩn Stewart &amp; Thomas, song ngữ, có công thức, ví dụ giải và quiz mỗi chương.',
    whatYouLearn: 'Thể tích tròn xoay (đĩa/vành/vỏ trụ), độ dài cung, diện tích mặt; tích phân suy rộng & tiêu chuẩn so sánh; dãy & chuỗi, tiêu chuẩn số hạng thứ n/so sánh/tích phân/tỉ số/căn; chuỗi luỹ thừa, bán kính hội tụ, Taylor/Maclaurin; hàm nhiều biến, đạo hàm riêng, gradient, đạo hàm có hướng; điểm dừng, Hessian & định thức D, nhân tử Lagrange; tích phân kép/ba, toạ độ cực/trụ/cầu; trường vector, tích phân đường, trường bảo toàn, định lý Green.',
    requirements: 'Đã học CAL111 (giải tích một biến): giới hạn, đạo hàm, tích phân xác định & định lý cơ bản. Nên dùng Desmos/GeoGebra 3D để trực quan và WolframAlpha để tự kiểm bài giải.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, Stewart & Thomas, MIT 18.02, Khan Academy, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Giải tích II là gì; nối tiếp CAL111; ba mạch lớn.', lessons: [intro] },
    { title: 'Chương 1 — Ứng dụng tích phân sâu|||Chapter 1 — Applications of the integral', description: 'Thể tích đĩa/vỏ trụ, độ dài cung, diện tích mặt.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kỹ thuật tích phân nâng cao|||Chapter 2 — Advanced integration', description: 'Tích phân suy rộng, tiêu chuẩn p, so sánh hội tụ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chuỗi số|||Chapter 3 — Series', description: 'Dãy, chuỗi, hội tụ/phân kỳ, các tiêu chuẩn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chuỗi luỹ thừa & Taylor|||Chapter 4 — Power series & Taylor', description: 'Bán kính hội tụ, Taylor/Maclaurin, khai triển chuẩn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hàm nhiều biến|||Chapter 5 — Multivariable functions', description: 'Đạo hàm riêng, gradient, đạo hàm có hướng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cực trị hàm nhiều biến|||Chapter 6 — Optimization', description: 'Điểm dừng, Hessian, nhân tử Lagrange.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tích phân bội|||Chapter 7 — Multiple integrals', description: 'Tích phân kép/ba, toạ độ cực/trụ/cầu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Giải tích vector cơ bản|||Chapter 8 — Vector calculus', description: 'Trường vector, tích phân đường, định lý Green.', lessons: [c8, c8q] },
  ],
};
