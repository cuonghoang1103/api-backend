/**
 * PSI221 — Probability and Statistical Inference II (Xác suất & Suy luận
 * thống kê II). Ngành Khoa học Máy tính FPTU, Kỳ 2. Nối tiếp xác suất cơ bản,
 * môn này nhấn SUY LUẬN THỐNG KÊ: từ phân phối lấy mẫu → ước lượng → kiểm định
 * → hồi quy/ANOVA. Sách chuẩn quốc tế: Casella & Berger "Statistical
 * Inference"; Wackerly "Mathematical Statistics with Applications"; Rice
 * "Mathematical Statistics and Data Analysis". Song ngữ + công thức + ví dụ.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('psi221-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, ba sách chuẩn quốc tế (Casella & Berger, Wackerly, Rice), tài liệu miễn phí, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">PSI221 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>statistical inference</strong> — sampling distributions, estimation, hypothesis testing, regression and ANOVA — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources built around three standard textbooks.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PSI221 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard textbooks</h3>
<ul>
<li><strong>Casella &amp; Berger</strong>, <em>Statistical Inference</em> — the graduate-level reference for estimation and testing theory.</li>
<li><strong>Wackerly, Mendenhall &amp; Scheaffer</strong>, <em>Mathematical Statistics with Applications</em> — worked, application-driven.</li>
<li><strong>Rice</strong>, <em>Mathematical Statistics and Data Analysis</em> — bridges theory and real data.</li>
</ul>
<h3>🌐 Free / official resources</h3>
<ul>
<li><a href="https://www.probabilitycourse.com/" target="_blank" rel="noopener">Introduction to Probability, Statistics, and Random Processes</a> — full free textbook.</li>
<li><a href="https://openstax.org/details/books/introductory-statistics" target="_blank" rel="noopener">OpenStax — Introductory Statistics</a> (free).</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — inference explained clearly.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — probability &amp; Bayes intuition.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://seeing-theory.brown.edu/" target="_blank" rel="noopener">Seeing Theory</a> — visual, interactive probability &amp; inference.</li>
<li><a href="https://www.python.org/" target="_blank" rel="noopener">Python</a> with <code>scipy.stats</code> / <code>statsmodels</code> — compute tests, intervals, regressions.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — review random variables, expectation/variance, and the sampling distribution + CLT.</li>
<li><strong>Estimation</strong> — point estimation (MLE, method of moments) and confidence intervals.</li>
<li><strong>Testing</strong> — hypothesis testing (H0/H1, errors, power, p-value) and the common z/t/chi-square/F tests.</li>
<li><strong>Modelling</strong> — regression, correlation, ANOVA and nonparametric methods, with CS/ML applications.</li>
</ol></div>`,
    `<span class="eyebrow">PSI221 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>suy luận thống kê</strong> — phân phối lấy mẫu, ước lượng, kiểm định giả thuyết, hồi quy và ANOVA — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp dựng quanh ba cuốn sách chuẩn.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PSI221 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn quốc tế</h3>
<ul>
<li><strong>Casella &amp; Berger</strong>, <em>Statistical Inference</em> — sách tham chiếu kinh điển về lý thuyết ước lượng và kiểm định.</li>
<li><strong>Wackerly, Mendenhall &amp; Scheaffer</strong>, <em>Mathematical Statistics with Applications</em> — nhiều ví dụ, thiên ứng dụng.</li>
<li><strong>Rice</strong>, <em>Mathematical Statistics and Data Analysis</em> — nối lý thuyết với dữ liệu thật.</li>
</ul>
<h3>🌐 Tài liệu miễn phí / chính thức</h3>
<ul>
<li><a href="https://www.probabilitycourse.com/" target="_blank" rel="noopener">Introduction to Probability, Statistics, and Random Processes</a> — sách miễn phí đầy đủ.</li>
<li><a href="https://openstax.org/details/books/introductory-statistics" target="_blank" rel="noopener">OpenStax — Introductory Statistics</a> (miễn phí).</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest với Josh Starmer</a> — suy luận thống kê giảng rất dễ hiểu.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — trực giác xác suất &amp; Bayes.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://seeing-theory.brown.edu/" target="_blank" rel="noopener">Seeing Theory</a> — xác suất &amp; suy luận trực quan, tương tác.</li>
<li><a href="https://www.python.org/" target="_blank" rel="noopener">Python</a> với <code>scipy.stats</code> / <code>statsmodels</code> — tính kiểm định, khoảng tin cậy, hồi quy.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ôn biến ngẫu nhiên, kỳ vọng/phương sai, và phân phối lấy mẫu + CLT.</li>
<li><strong>Ước lượng</strong> — ước lượng điểm (MLE, phương pháp mô-men) và khoảng tin cậy.</li>
<li><strong>Kiểm định</strong> — kiểm định giả thuyết (H0/H1, sai lầm, lực, p-value) và các kiểm định z/t/chi-square/F thông dụng.</li>
<li><strong>Mô hình hoá</strong> — hồi quy, tương quan, ANOVA và phi tham số, kèm ứng dụng CS/ML.</li>
</ol></div>`,
  ]]);

const intro = doc('psi221-0-1-overview', 'Course overview: Statistical inference|||Tổng quan: Suy luận thống kê',
  'Suy luận thống kê là gì; dùng mẫu để nói về tổng thể; hai trụ cột: ước lượng và kiểm định; lộ trình 8 chương từ phân phối lấy mẫu đến ANOVA.',
  [[
    `<span class="eyebrow">PSI221 · Lesson 0.1 · Overview</span>
<h2>Statistical inference</h2>
<p class="lead">Probability starts from a known model and asks "what data will we see?". <strong>Statistical inference</strong> reverses the arrow: given the <strong>data</strong> we observed, what can we say about the unknown <strong>population</strong> that produced it? This course, a sequel to introductory probability, builds that reasoning end to end.</p>
<h3>The two pillars</h3>
<ul>
<li><strong>Estimation</strong> — use a sample to guess an unknown parameter (a mean, a proportion, a variance), as a single number (point) or a range (interval).</li>
<li><strong>Hypothesis testing</strong> — weigh evidence for or against a claim about the population, controlling the chance of being wrong.</li>
</ul>
<h3>Key idea: the parameter vs the statistic</h3>
<p>A <strong>parameter</strong> (e.g. population mean μ, variance σ²) is fixed but unknown. A <strong>statistic</strong> (e.g. sample mean x̄) is computed from data and is itself random — different samples give different values. Inference studies how the statistic behaves so we can reason back to the parameter.</p>
<h3>Roadmap (8 chapters)</h3>
<pre><code>1  Review: random variables, E[X], Var(X)
2  Sampling distributions and the CLT
3  Point estimation (MLE, method of moments)
4  Interval estimation (confidence intervals)
5  Hypothesis testing (H0/H1, errors, power, p)
6  Common tests (z, t, chi-square, F)
7  Regression and correlation
8  ANOVA and nonparametric methods
</code></pre>
<div class="callout"><span class="badge">Why it matters for CS</span> A/B tests, model evaluation, confidence in metrics, and the statistics behind machine learning all rest on exactly this reasoning.</div>`,
    `<span class="eyebrow">PSI221 · Bài 0.1 · Tổng quan</span>
<h2>Suy luận thống kê</h2>
<p class="lead">Xác suất đi từ một mô hình đã biết và hỏi "sẽ thấy dữ liệu nào?". <strong>Suy luận thống kê</strong> đảo chiều mũi tên: từ <strong>dữ liệu</strong> quan sát được, ta nói được gì về <strong>tổng thể</strong> chưa biết đã sinh ra nó? Là phần nối tiếp xác suất cơ bản, môn này dựng lối lập luận đó từ đầu đến cuối.</p>
<h3>Hai trụ cột</h3>
<ul>
<li><strong>Ước lượng</strong> — dùng mẫu để đoán tham số chưa biết (trung bình, tỉ lệ, phương sai), dưới dạng một con số (điểm) hoặc một khoảng.</li>
<li><strong>Kiểm định giả thuyết</strong> — cân nhắc bằng chứng ủng hộ hay bác bỏ một khẳng định về tổng thể, có kiểm soát xác suất sai.</li>
</ul>
<h3>Ý then chốt: tham số và thống kê</h3>
<p>Một <strong>tham số</strong> (vd trung bình tổng thể μ, phương sai σ²) là cố định nhưng chưa biết. Một <strong>thống kê</strong> (vd trung bình mẫu x̄) tính từ dữ liệu và bản thân nó ngẫu nhiên — mỗi mẫu cho một giá trị khác. Suy luận nghiên cứu cách thống kê biến động để lần ngược về tham số.</p>
<h3>Lộ trình (8 chương)</h3>
<pre><code>1  Ôn: bien ngau nhien, E[X], Var(X)
2  Phan phoi lay mau va CLT
3  Uoc luong diem (MLE, mo-men)
4  Uoc luong khoang (khoang tin cay)
5  Kiem dinh gia thuyet (H0/H1, sai lam, luc, p)
6  Kiem dinh thong dung (z, t, chi-square, F)
7  Hoi quy va tuong quan
8  ANOVA va phi tham so
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng với CS</span> Thử nghiệm A/B, đánh giá mô hình, độ tin cậy của chỉ số, và thống kê nền của học máy đều dựa đúng vào lối lập luận này.</div>`,
  ]]);

const c1 = doc('psi221-1-1-random-variables', '1.1 — Review: random variables & distributions|||1.1 — Ôn: biến ngẫu nhiên & phân phối',
  'Biến ngẫu nhiên rời rạc/liên tục, hàm phân phối (pmf/pdf/CDF), kỳ vọng E[X], phương sai Var(X)=σ²; các phân phối hay gặp.',
  [[
    `<span class="eyebrow">PSI221 · Chapter 1 · Lesson 1.1</span>
<h2>Review: random variables &amp; distributions</h2>
<h3>Random variable</h3>
<p>A <strong>random variable (RV)</strong> assigns a number to each outcome. It is <strong>discrete</strong> (counts, described by a pmf) or <strong>continuous</strong> (measurements, described by a pdf). The <strong>CDF</strong> F(x) = P(X ≤ x) works for both.</p>
<h3>Expectation &amp; variance</h3>
<pre><code>Mean (expectation):  E[X] = sum x*p(x)   or   integral x*f(x) dx
Variance:            Var(X) = E[(X - mu)^2] = E[X^2] - (E[X])^2 = sigma^2
Std deviation:       sigma = sqrt(Var(X))
Linearity:           E[aX + b] = a*E[X] + b
                     Var(aX + b) = a^2 * Var(X)
</code></pre>
<h3>Distributions you will keep meeting</h3>
<ul>
<li><strong>Bernoulli / Binomial</strong> — success counts; Binomial(n,p) has E[X]=np, Var(X)=np(1-p).</li>
<li><strong>Poisson</strong> — rare-event counts; E[X]=Var(X)=λ.</li>
<li><strong>Normal N(μ, σ²)</strong> — the bell curve; the backbone of inference.</li>
</ul>
<pre><code>Worked example:  X = Binomial(n=10, p=0.3)
  E[X]   = n*p        = 10 * 0.3       = 3
  Var(X) = n*p*(1-p)  = 10*0.3*0.7     = 2.1
  sigma  = sqrt(2.1)                   ~ 1.449
</code></pre>
<div class="callout"><span class="badge">Anchor</span> Everything ahead is about a statistic computed from many RVs — so E[X] and Var(X) are the tools we reuse in every chapter.</div>`,
    `<span class="eyebrow">PSI221 · Chương 1 · Bài 1.1</span>
<h2>Ôn: biến ngẫu nhiên &amp; phân phối</h2>
<h3>Biến ngẫu nhiên</h3>
<p>Một <strong>biến ngẫu nhiên (RV)</strong> gán một con số cho mỗi kết cục. Nó <strong>rời rạc</strong> (đếm, mô tả bằng pmf) hoặc <strong>liên tục</strong> (đo đạc, mô tả bằng pdf). <strong>Hàm phân phối CDF</strong> F(x) = P(X ≤ x) dùng cho cả hai.</p>
<h3>Kỳ vọng &amp; phương sai</h3>
<pre><code>Ky vong (trung binh):  E[X] = tong x*p(x)   hoac   tich phan x*f(x) dx
Phuong sai:            Var(X) = E[(X - mu)^2] = E[X^2] - (E[X])^2 = sigma^2
Do lech chuan:         sigma = sqrt(Var(X))
Tuyen tinh:            E[aX + b] = a*E[X] + b
                       Var(aX + b) = a^2 * Var(X)
</code></pre>
<h3>Các phân phối sẽ gặp lại hoài</h3>
<ul>
<li><strong>Bernoulli / Nhị thức</strong> — đếm số lần thành công; Binomial(n,p) có E[X]=np, Var(X)=np(1-p).</li>
<li><strong>Poisson</strong> — đếm biến cố hiếm; E[X]=Var(X)=λ.</li>
<li><strong>Chuẩn N(μ, σ²)</strong> — đường hình chuông; xương sống của suy luận.</li>
</ul>
<pre><code>Vi du giai:  X = Binomial(n=10, p=0.3)
  E[X]   = n*p        = 10 * 0.3       = 3
  Var(X) = n*p*(1-p)  = 10*0.3*0.7     = 2.1
  sigma  = sqrt(2.1)                   ~ 1.449
</code></pre>
<div class="callout"><span class="badge">Điểm neo</span> Toàn bộ phía trước xoay quanh một thống kê tính từ nhiều RV — nên E[X] và Var(X) là công cụ dùng lại ở mọi chương.</div>`,
  ]]);

const c1q = quiz('psi221-quiz-1', 'Quiz 1 — Random variables|||Quiz 1 — Biến ngẫu nhiên', [
  { id: 'q1', question: 'Variance can be computed as?|||Phương sai tính bằng?', options: ['E[X] - (E[X])^2', 'E[X^2] - (E[X])^2', 'E[X^2] + (E[X])^2', '(E[X])^2 - E[X^2]'], correctIndex: 1, explanation: 'Var(X) = E[X^2] - (E[X])^2 = sigma^2.' },
  { id: 'q2', question: 'For X = Binomial(n, p), the mean E[X] is?|||Với X = Binomial(n, p), kỳ vọng E[X] là?', options: ['n*p*(1-p)', 'p*(1-p)', 'n*p', 'sqrt(n*p)'], correctIndex: 2, explanation: 'E[X] = n*p; còn Var(X) = n*p*(1-p).' },
  { id: 'q3', question: 'Var(aX + b) equals?|||Var(aX + b) bằng?', options: ['a*Var(X) + b', 'a^2 * Var(X)', 'a^2 * Var(X) + b', 'a * Var(X)'], correctIndex: 1, explanation: 'Cộng hằng số b không đổi độ phân tán; hệ số a bình phương lên.' },
]);

const c2 = doc('psi221-2-1-sampling-distribution', '2.1 — Sampling distributions & the CLT|||2.1 — Phân phối lấy mẫu & CLT',
  'Thống kê là biến ngẫu nhiên; phân phối lấy mẫu của trung bình mẫu x̄; sai số chuẩn σ/√n; định lý giới hạn trung tâm (CLT).',
  [[
    `<span class="eyebrow">PSI221 · Chapter 2 · Lesson 2.1</span>
<h2>Sampling distributions &amp; the CLT</h2>
<h3>A statistic is random</h3>
<p>Take a sample of size n and compute the mean x̄. Take another sample — you get a different x̄. The distribution of x̄ over all possible samples is its <strong>sampling distribution</strong>. Inference lives or dies on knowing this distribution.</p>
<h3>Mean and spread of x̄</h3>
<pre><code>If X1..Xn are iid with mean mu and variance sigma^2:
  E[x_bar]   = mu                     (x_bar is centered on the truth)
  Var(x_bar) = sigma^2 / n
  SE(x_bar)  = sigma / sqrt(n)        (the "standard error")
</code></pre>
<p>The standard error shrinks like 1/√n — quadrupling the sample halves the spread.</p>
<h3>Central Limit Theorem (CLT)</h3>
<p>For large n, the sampling distribution of x̄ is <strong>approximately Normal</strong> — no matter the shape of the original population (as long as its variance is finite):</p>
<pre><code>x_bar  ~approx~  N( mu , sigma^2 / n )
Standardized:    Z = (x_bar - mu) / (sigma / sqrt(n))  ~approx~ N(0, 1)
</code></pre>
<pre><code>Worked example:  mu = 50, sigma = 10, n = 25
  SE = 10 / sqrt(25) = 10 / 5 = 2
  P(x_bar > 53) = P( Z > (53-50)/2 ) = P(Z > 1.5) ~ 0.067
</code></pre>
<div class="callout"><span class="badge">The bridge</span> The CLT is why the Normal shows up everywhere in inference — it turns "any population" into "Normal x̄", which every later test relies on.</div>`,
    `<span class="eyebrow">PSI221 · Chương 2 · Bài 2.1</span>
<h2>Phân phối lấy mẫu &amp; CLT</h2>
<h3>Thống kê là ngẫu nhiên</h3>
<p>Lấy một mẫu cỡ n rồi tính trung bình x̄. Lấy mẫu khác — được một x̄ khác. Phân phối của x̄ trên mọi mẫu có thể có là <strong>phân phối lấy mẫu</strong> của nó. Suy luận sống chết nhờ biết phân phối này.</p>
<h3>Trung bình và độ phân tán của x̄</h3>
<pre><code>Neu X1..Xn doc lap cung phan phoi, trung binh mu, phuong sai sigma^2:
  E[x_bar]   = mu                     (x_bar canh dung tam su that)
  Var(x_bar) = sigma^2 / n
  SE(x_bar)  = sigma / sqrt(n)        ("sai so chuan")
</code></pre>
<p>Sai số chuẩn co lại theo 1/√n — tăng cỡ mẫu gấp bốn thì độ phân tán giảm một nửa.</p>
<h3>Định lý giới hạn trung tâm (CLT)</h3>
<p>Với n lớn, phân phối lấy mẫu của x̄ <strong>xấp xỉ Chuẩn</strong> — bất kể hình dạng tổng thể gốc (miễn phương sai hữu hạn):</p>
<pre><code>x_bar  ~xap xi~  N( mu , sigma^2 / n )
Chuan hoa:       Z = (x_bar - mu) / (sigma / sqrt(n))  ~xap xi~ N(0, 1)
</code></pre>
<pre><code>Vi du giai:  mu = 50, sigma = 10, n = 25
  SE = 10 / sqrt(25) = 10 / 5 = 2
  P(x_bar > 53) = P( Z > (53-50)/2 ) = P(Z > 1.5) ~ 0.067
</code></pre>
<div class="callout"><span class="badge">Cây cầu</span> CLT là lý do Chuẩn xuất hiện khắp nơi trong suy luận — nó biến "tổng thể bất kỳ" thành "x̄ Chuẩn", nền cho mọi kiểm định về sau.</div>`,
  ]]);

const c2q = quiz('psi221-quiz-2', 'Quiz 2 — Sampling & CLT|||Quiz 2 — Lấy mẫu & CLT', [
  { id: 'q1', question: 'The standard error of the sample mean is?|||Sai số chuẩn của trung bình mẫu là?', options: ['sigma^2 / n', 'sigma / sqrt(n)', 'sigma / n', 'sqrt(sigma) / n'], correctIndex: 1, explanation: 'SE(x_bar) = sigma / sqrt(n); phương sai là sigma^2/n.' },
  { id: 'q2', question: 'The CLT says that for large n, x_bar is approximately?|||CLT nói với n lớn, x̄ xấp xỉ?', options: ['Uniform|||Đều', 'Poisson', 'Normal|||Chuẩn', 'Binomial|||Nhị thức'], correctIndex: 2, explanation: 'Bất kể tổng thể gốc, x̄ tiến về phân phối Chuẩn khi n lớn.' },
  { id: 'q3', question: 'If sigma = 10 and n = 25, the standard error is?|||Nếu sigma = 10 và n = 25, sai số chuẩn là?', options: ['0.4', '2', '5', '10'], correctIndex: 1, explanation: 'SE = 10 / sqrt(25) = 10/5 = 2.' },
]);

const c3 = doc('psi221-3-1-point-estimation', '3.1 — Point estimation (MLE & moments)|||3.1 — Ước lượng điểm (MLE & mô-men)',
  'Ước lượng điểm; phương pháp mô-men; ước lượng hợp lý cực đại (MLE); tính chất: không chệch, vững, hiệu quả, MSE.',
  [[
    `<span class="eyebrow">PSI221 · Chapter 3 · Lesson 3.1</span>
<h2>Point estimation</h2>
<p>A <strong>point estimator</strong> is a single-number guess of a parameter θ, written θ-hat. Two systematic recipes dominate.</p>
<h3>Method of moments</h3>
<p>Set the sample moments equal to the population moments and solve. Simple and fast.</p>
<pre><code>Example (Poisson, parameter lambda):
  Population mean = lambda ; sample mean = x_bar
  =>  lambda_hat = x_bar
</code></pre>
<h3>Maximum likelihood (MLE)</h3>
<p>Pick the θ that makes the observed data <em>most probable</em>: maximize the likelihood L(θ) = product of the densities, usually via the log-likelihood.</p>
<pre><code>Example (Bernoulli, parameter p, k successes in n trials):
  L(p)      = p^k * (1-p)^(n-k)
  log L     = k*log(p) + (n-k)*log(1-p)
  d/dp = 0  =>  p_hat = k / n
</code></pre>
<h3>What makes an estimator good?</h3>
<ul>
<li><strong>Unbiased</strong> — E[θ-hat] = θ (correct on average).</li>
<li><strong>Consistent</strong> — θ-hat → θ as n grows.</li>
<li><strong>Efficient</strong> — smallest variance among sensible estimators.</li>
</ul>
<pre><code>Bias-variance decomposition:
  MSE(theta_hat) = Var(theta_hat) + (Bias)^2
</code></pre>
<div class="callout"><span class="badge">Note</span> The sample variance divides by (n-1), not n, precisely to stay unbiased for sigma^2 — a small correction with a real reason.</div>`,
    `<span class="eyebrow">PSI221 · Chương 3 · Bài 3.1</span>
<h2>Ước lượng điểm</h2>
<p>Một <strong>ước lượng điểm</strong> là con số đoán tham số θ, viết là θ-mũ. Có hai công thức hệ thống chiếm ưu thế.</p>
<h3>Phương pháp mô-men</h3>
<p>Cho mô-men mẫu bằng mô-men tổng thể rồi giải. Đơn giản và nhanh.</p>
<pre><code>Vi du (Poisson, tham so lambda):
  Trung binh tong the = lambda ; trung binh mau = x_bar
  =>  lambda_hat = x_bar
</code></pre>
<h3>Hợp lý cực đại (MLE)</h3>
<p>Chọn θ khiến dữ liệu quan sát <em>khả dĩ nhất</em>: cực đại hoá hàm hợp lý L(θ) = tích các mật độ, thường qua log-hợp lý.</p>
<pre><code>Vi du (Bernoulli, tham so p, k thanh cong trong n phep thu):
  L(p)      = p^k * (1-p)^(n-k)
  log L     = k*log(p) + (n-k)*log(1-p)
  d/dp = 0  =>  p_hat = k / n
</code></pre>
<h3>Ước lượng tốt là thế nào?</h3>
<ul>
<li><strong>Không chệch</strong> — E[θ-mũ] = θ (đúng khi lấy trung bình).</li>
<li><strong>Vững</strong> — θ-mũ → θ khi n tăng.</li>
<li><strong>Hiệu quả</strong> — phương sai nhỏ nhất trong các ước lượng hợp lý.</li>
</ul>
<pre><code>Phan ra do chech - phuong sai:
  MSE(theta_hat) = Var(theta_hat) + (Bias)^2
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Phương sai mẫu chia cho (n-1), không phải n, chính là để không chệch cho sigma^2 — một hiệu chỉnh nhỏ có lý do thật.</div>`,
  ]]);

const c3q = quiz('psi221-quiz-3', 'Quiz 3 — Point estimation|||Quiz 3 — Ước lượng điểm', [
  { id: 'q1', question: 'MLE chooses the parameter that?|||MLE chọn tham số sao cho?', options: ['Minimizes the variance|||Cực tiểu phương sai', 'Makes the observed data most probable|||Khiến dữ liệu quan sát khả dĩ nhất', 'Equals the sample median|||Bằng trung vị mẫu', 'Is always unbiased|||Luôn không chệch'], correctIndex: 1, explanation: 'MLE cực đại hoá hàm hợp lý L(theta).' },
  { id: 'q2', question: 'An estimator is unbiased when?|||Một ước lượng không chệch khi?', options: ['Var = 0', 'E[theta_hat] = theta', 'theta_hat = 0', 'MSE = Var'], correctIndex: 1, explanation: 'Không chệch nghĩa là trung bình của ước lượng bằng đúng tham số.' },
  { id: 'q3', question: 'MSE decomposes as?|||MSE phân ra thành?', options: ['Var - Bias^2', 'Var + Bias^2', 'Bias^2 - Var', 'Var * Bias'], correctIndex: 1, explanation: 'MSE = Var(theta_hat) + (Bias)^2.' },
]);

const c4 = doc('psi221-4-1-confidence-interval', '4.1 — Interval estimation (confidence intervals)|||4.1 — Ước lượng khoảng (khoảng tin cậy)',
  'Khoảng tin cậy; mức tin cậy và ý nghĩa; CI cho trung bình (z & t), cho tỉ lệ, cho phương sai (chi-square).',
  [[
    `<span class="eyebrow">PSI221 · Chapter 4 · Lesson 4.1</span>
<h2>Interval estimation</h2>
<p>A point estimate hides its uncertainty. A <strong>confidence interval (CI)</strong> reports a range plus a confidence level, e.g. 95%.</p>
<h3>General form</h3>
<pre><code>estimate  +/-  (critical value) * (standard error)
</code></pre>
<h3>CI for a mean</h3>
<pre><code>sigma known (or n large):   x_bar +/- z* * (sigma / sqrt(n))
sigma unknown, small n:     x_bar +/- t* * (s / sqrt(n))     with df = n-1
  (z* = 1.96 for 95%)
</code></pre>
<h3>CI for a proportion</h3>
<pre><code>p_hat +/- z* * sqrt( p_hat*(1 - p_hat) / n )
</code></pre>
<h3>CI for a variance (uses chi-square)</h3>
<pre><code>[ (n-1)*s^2 / chi2_upper ,  (n-1)*s^2 / chi2_lower ]
</code></pre>
<pre><code>Worked example (95% CI for mean):
  x_bar = 20, sigma = 4, n = 16
  SE = 4 / sqrt(16) = 1
  CI = 20 +/- 1.96 * 1 = (18.04 , 21.96)
</code></pre>
<div class="callout"><span class="badge">Read it correctly</span> "95% confidence" means: if we repeated the sampling many times, about 95% of the intervals built this way would contain the true parameter — NOT that this one interval has a 95% chance of holding it.</div>`,
    `<span class="eyebrow">PSI221 · Chương 4 · Bài 4.1</span>
<h2>Ước lượng khoảng</h2>
<p>Ước lượng điểm giấu đi độ bất định. Một <strong>khoảng tin cậy (CI)</strong> báo một dải kèm mức tin cậy, vd 95%.</p>
<h3>Dạng tổng quát</h3>
<pre><code>uoc luong  +/-  (gia tri toi han) * (sai so chuan)
</code></pre>
<h3>CI cho trung bình</h3>
<pre><code>sigma biet (hoac n lon):    x_bar +/- z* * (sigma / sqrt(n))
sigma chua biet, n nho:     x_bar +/- t* * (s / sqrt(n))     voi df = n-1
  (z* = 1.96 cho 95%)
</code></pre>
<h3>CI cho tỉ lệ</h3>
<pre><code>p_hat +/- z* * sqrt( p_hat*(1 - p_hat) / n )
</code></pre>
<h3>CI cho phương sai (dùng chi-square)</h3>
<pre><code>[ (n-1)*s^2 / chi2_tren ,  (n-1)*s^2 / chi2_duoi ]
</code></pre>
<pre><code>Vi du giai (CI 95% cho trung binh):
  x_bar = 20, sigma = 4, n = 16
  SE = 4 / sqrt(16) = 1
  CI = 20 +/- 1.96 * 1 = (18.04 , 21.96)
</code></pre>
<div class="callout"><span class="badge">Hiểu cho đúng</span> "Tin cậy 95%" nghĩa là: nếu lặp lại việc lấy mẫu nhiều lần, khoảng 95% các khoảng dựng theo cách này chứa tham số thật — KHÔNG phải khoảng cụ thể này có 95% khả năng chứa nó.</div>`,
  ]]);

const c4q = quiz('psi221-quiz-4', 'Quiz 4 — Confidence intervals|||Quiz 4 — Khoảng tin cậy', [
  { id: 'q1', question: 'When sigma is unknown and n is small, the CI for a mean uses which distribution?|||Khi sigma chưa biết và n nhỏ, CI cho trung bình dùng phân phối nào?', options: ['Standard Normal (z)|||Chuẩn (z)', 'Student t', 'Poisson', 'F'], correctIndex: 1, explanation: 'Dùng phân phối t với df = n-1 khi phải ước lượng sigma bằng s.' },
  { id: 'q2', question: 'The z* value for a 95% CI is about?|||Giá trị z* cho CI 95% xấp xỉ?', options: ['1.28', '1.64', '1.96', '2.58'], correctIndex: 2, explanation: 'z* = 1.96 cho 95%; 2.58 là cho 99%.' },
  { id: 'q3', question: 'A wider confidence interval generally means?|||Khoảng tin cậy rộng hơn thường nghĩa là?', options: ['More precision|||Chính xác hơn', 'Less uncertainty|||Ít bất định hơn', 'More uncertainty or higher confidence|||Bất định hơn hoặc mức tin cậy cao hơn', 'A smaller sample bias|||Độ chệch mẫu nhỏ hơn'], correctIndex: 2, explanation: 'Cỡ mẫu nhỏ, phương sai lớn, hoặc mức tin cậy cao đều làm khoảng rộng ra.' },
]);

const c5 = doc('psi221-5-1-hypothesis-testing', '5.1 — Hypothesis testing (H0/H1, errors, power)|||5.1 — Kiểm định giả thuyết (H0/H1, sai lầm, lực)',
  'Giả thuyết H0/H1; sai lầm loại I (α) và loại II (β); lực kiểm định (power = 1−β); thống kê kiểm định; p-value và quyết định.',
  [[
    `<span class="eyebrow">PSI221 · Chapter 5 · Lesson 5.1</span>
<h2>Hypothesis testing</h2>
<h3>The two hypotheses</h3>
<ul>
<li><strong>H0 (null)</strong> — the default / "no effect" claim we try to disprove.</li>
<li><strong>H1 (alternative)</strong> — what we suspect is true instead.</li>
</ul>
<h3>Two ways to be wrong</h3>
<pre><code>                  H0 is true        H0 is false
Reject H0     Type I error (alpha)   Correct (power)
Fail to reject   Correct           Type II error (beta)
</code></pre>
<ul>
<li><strong>Type I error (α)</strong> — reject a true H0 (a false alarm); α is the significance level we set, e.g. 0.05.</li>
<li><strong>Type II error (β)</strong> — fail to reject a false H0 (a miss).</li>
<li><strong>Power = 1 − β</strong> — the chance of correctly detecting a real effect; grows with sample size and effect size.</li>
</ul>
<h3>The procedure</h3>
<pre><code>1  State H0 and H1, choose alpha (e.g. 0.05)
2  Compute a test statistic from the data
3  Find the p-value = P(data this extreme | H0 true)
4  Decide:  p-value <= alpha  ->  reject H0
           p-value >  alpha  ->  fail to reject H0
</code></pre>
<div class="callout"><span class="badge">What a p-value is NOT</span> It is not P(H0 is true). It is the probability of data at least this extreme IF H0 held. A small p-value means the data are surprising under H0.</div>`,
    `<span class="eyebrow">PSI221 · Chương 5 · Bài 5.1</span>
<h2>Kiểm định giả thuyết</h2>
<h3>Hai giả thuyết</h3>
<ul>
<li><strong>H0 (không)</strong> — khẳng định mặc định / "không có hiệu ứng" mà ta tìm cách bác bỏ.</li>
<li><strong>H1 (đối)</strong> — điều ta nghi là đúng thay cho H0.</li>
</ul>
<h3>Hai kiểu sai</h3>
<pre><code>                   H0 dung          H0 sai
Bac bo H0     Sai lam loai I (alpha)   Dung (luc)
Khong bac bo     Dung           Sai lam loai II (beta)
</code></pre>
<ul>
<li><strong>Sai lầm loại I (α)</strong> — bác bỏ H0 đúng (báo động giả); α là mức ý nghĩa ta chọn, vd 0.05.</li>
<li><strong>Sai lầm loại II (β)</strong> — không bác bỏ H0 sai (bỏ sót).</li>
<li><strong>Lực = 1 − β</strong> — khả năng phát hiện đúng một hiệu ứng thật; tăng theo cỡ mẫu và độ lớn hiệu ứng.</li>
</ul>
<h3>Quy trình</h3>
<pre><code>1  Phat bieu H0 va H1, chon alpha (vd 0.05)
2  Tinh thong ke kiem dinh tu du lieu
3  Tim p-value = P(du lieu cuc doan the nay | H0 dung)
4  Quyet dinh:  p-value <= alpha  ->  bac bo H0
             p-value >  alpha  ->  khong bac bo H0
</code></pre>
<div class="callout"><span class="badge">p-value KHÔNG phải là</span> Không phải P(H0 đúng). Nó là xác suất thấy dữ liệu cực đoan ít nhất thế này NẾU H0 đúng. p-value nhỏ nghĩa là dữ liệu bất ngờ dưới H0.</div>`,
  ]]);

const c5q = quiz('psi221-quiz-5', 'Quiz 5 — Hypothesis testing|||Quiz 5 — Kiểm định giả thuyết', [
  { id: 'q1', question: 'A Type I error is?|||Sai lầm loại I là?', options: ['Failing to reject a false H0|||Không bác bỏ H0 sai', 'Rejecting a true H0|||Bác bỏ H0 đúng', 'Choosing the wrong test|||Chọn sai kiểm định', 'A large p-value|||p-value lớn'], correctIndex: 1, explanation: 'Loại I = bác bỏ H0 khi H0 thật ra đúng; xác suất của nó là alpha.' },
  { id: 'q2', question: 'Power of a test equals?|||Lực của kiểm định bằng?', options: ['alpha', 'beta', '1 - beta', '1 - alpha'], correctIndex: 2, explanation: 'Lực = 1 - beta = xác suất phát hiện đúng hiệu ứng thật.' },
  { id: 'q3', question: 'With significance level alpha, we reject H0 when?|||Với mức ý nghĩa alpha, ta bác bỏ H0 khi?', options: ['p-value > alpha', 'p-value <= alpha', 'p-value = 1', 'p-value = beta'], correctIndex: 1, explanation: 'p-value nhỏ hơn hoặc bằng alpha thì bằng chứng đủ mạnh để bác bỏ H0.' },
]);

const c6 = doc('psi221-6-1-common-tests', '6.1 — Common tests (z, t, chi-square, F)|||6.1 — Kiểm định thông dụng (z, t, chi-square, F)',
  'Chọn kiểm định đúng: z-test và t-test cho trung bình; chi-square cho phương sai/độ phù hợp/độc lập; F-test so sánh hai phương sai.',
  [[
    `<span class="eyebrow">PSI221 · Chapter 6 · Lesson 6.1</span>
<h2>Common tests</h2>
<h3>z-test — mean, sigma known / large n</h3>
<pre><code>z = (x_bar - mu0) / (sigma / sqrt(n))     compare to N(0,1)
</code></pre>
<h3>t-test — mean, sigma unknown / small n</h3>
<pre><code>t = (x_bar - mu0) / (s / sqrt(n))         df = n - 1
Two-sample t compares two group means.
</code></pre>
<h3>chi-square test</h3>
<ul>
<li><strong>Goodness of fit</strong> — do observed counts match expected? χ² = Σ (O − E)² / E.</li>
<li><strong>Independence</strong> — are two categorical variables related (contingency table)?</li>
<li><strong>Variance</strong> — test a single population variance.</li>
</ul>
<h3>F-test — compare two variances</h3>
<pre><code>F = s1^2 / s2^2                          compare to F(df1, df2)
</code></pre>
<pre><code>Worked example (one-sample t):
  H0: mu = 100 ; x_bar = 104, s = 8, n = 16
  t = (104 - 100) / (8 / sqrt(16)) = 4 / 2 = 2.0  (df = 15)
  Compare 2.0 to the t critical value / read the p-value.
</code></pre>
<div class="callout"><span class="badge">Pick by question</span> Mean and sigma known → z; mean and sigma unknown → t; counts/categories → chi-square; ratio of variances → F.</div>`,
    `<span class="eyebrow">PSI221 · Chương 6 · Bài 6.1</span>
<h2>Kiểm định thông dụng</h2>
<h3>z-test — trung bình, sigma biết / n lớn</h3>
<pre><code>z = (x_bar - mu0) / (sigma / sqrt(n))     so voi N(0,1)
</code></pre>
<h3>t-test — trung bình, sigma chưa biết / n nhỏ</h3>
<pre><code>t = (x_bar - mu0) / (s / sqrt(n))         df = n - 1
t hai mau so sanh trung binh hai nhom.
</code></pre>
<h3>Kiểm định chi-square</h3>
<ul>
<li><strong>Độ phù hợp</strong> — số quan sát có khớp kỳ vọng? χ² = Σ (O − E)² / E.</li>
<li><strong>Độc lập</strong> — hai biến phân loại có liên hệ không (bảng chéo)?</li>
<li><strong>Phương sai</strong> — kiểm định một phương sai tổng thể.</li>
</ul>
<h3>F-test — so sánh hai phương sai</h3>
<pre><code>F = s1^2 / s2^2                          so voi F(df1, df2)
</code></pre>
<pre><code>Vi du giai (t mot mau):
  H0: mu = 100 ; x_bar = 104, s = 8, n = 16
  t = (104 - 100) / (8 / sqrt(16)) = 4 / 2 = 2.0  (df = 15)
  So 2.0 voi gia tri toi han t / doc p-value.
</code></pre>
<div class="callout"><span class="badge">Chọn theo câu hỏi</span> Trung bình + sigma biết → z; trung bình + sigma chưa biết → t; đếm/phân loại → chi-square; tỉ số phương sai → F.</div>`,
  ]]);

const c6q = quiz('psi221-quiz-6', 'Quiz 6 — Common tests|||Quiz 6 — Kiểm định thông dụng', [
  { id: 'q1', question: 'You test a mean with unknown sigma and n = 12. Which test?|||Kiểm định trung bình với sigma chưa biết và n = 12. Dùng kiểm định nào?', options: ['z-test', 't-test', 'chi-square test', 'F-test'], correctIndex: 1, explanation: 'Sigma chưa biết + n nhỏ → t-test với df = n-1 = 11.' },
  { id: 'q2', question: 'The chi-square goodness-of-fit statistic is?|||Thống kê chi-square độ phù hợp là?', options: ['sum (O - E)|||tổng (O - E)', 'sum (O - E)^2 / E', 'sum O / E', '(O - E) / sqrt(E)'], correctIndex: 1, explanation: 'chi2 = tong (O - E)^2 / E trên các ô.' },
  { id: 'q3', question: 'An F-test is typically used to?|||F-test thường dùng để?', options: ['Compare two variances|||So sánh hai phương sai', 'Estimate a proportion|||Ước lượng một tỉ lệ', 'Test one mean|||Kiểm định một trung bình', 'Build a CI|||Dựng một khoảng tin cậy'], correctIndex: 0, explanation: 'F = s1^2/s2^2 so sánh hai phương sai; cũng là nền của ANOVA.' },
]);

const c7 = doc('psi221-7-1-regression-correlation', '7.1 — Regression & correlation|||7.1 — Hồi quy & tương quan',
  'Tương quan (hệ số r); hồi quy tuyến tính đơn; phương pháp bình phương tối thiểu; R²; kiểm định ý nghĩa hệ số dốc.',
  [[
    `<span class="eyebrow">PSI221 · Chapter 7 · Lesson 7.1</span>
<h2>Regression &amp; correlation</h2>
<h3>Correlation</h3>
<p>The <strong>correlation coefficient r</strong> measures the strength and direction of a linear relationship, from −1 (perfect negative) through 0 (none) to +1 (perfect positive). Correlation is not causation.</p>
<h3>Simple linear regression</h3>
<pre><code>Model:      y = beta0 + beta1 * x + error
Fitted:     y_hat = b0 + b1 * x
</code></pre>
<h3>Least squares</h3>
<p>Choose b0, b1 to minimize the sum of squared residuals Σ (y − y_hat)².</p>
<pre><code>b1 = Sxy / Sxx = sum((x-x_bar)(y-y_bar)) / sum((x-x_bar)^2)
b0 = y_bar - b1 * x_bar
</code></pre>
<h3>How good is the fit?</h3>
<pre><code>R^2 = fraction of variance in y explained by the model (0..1)
For simple regression, R^2 = r^2.
</code></pre>
<h3>Is the slope real?</h3>
<p>Test H0: β1 = 0 (x has no linear effect) with a t-test on the slope: t = b1 / SE(b1). Reject H0 → the relationship is statistically significant.</p>
<div class="callout"><span class="badge">CS link</span> Least-squares linear regression is the simplest supervised-learning model — the same idea scales up to multiple predictors and to the loss functions behind ML.</div>`,
    `<span class="eyebrow">PSI221 · Chương 7 · Bài 7.1</span>
<h2>Hồi quy &amp; tương quan</h2>
<h3>Tương quan</h3>
<p><strong>Hệ số tương quan r</strong> đo độ mạnh và chiều của quan hệ tuyến tính, từ −1 (âm hoàn hảo) qua 0 (không có) đến +1 (dương hoàn hảo). Tương quan không phải nhân quả.</p>
<h3>Hồi quy tuyến tính đơn</h3>
<pre><code>Mo hinh:    y = beta0 + beta1 * x + sai so
Khop:       y_hat = b0 + b1 * x
</code></pre>
<h3>Bình phương tối thiểu</h3>
<p>Chọn b0, b1 để cực tiểu tổng bình phương phần dư Σ (y − y_hat)².</p>
<pre><code>b1 = Sxy / Sxx = tong((x-x_bar)(y-y_bar)) / tong((x-x_bar)^2)
b0 = y_bar - b1 * x_bar
</code></pre>
<h3>Khớp tốt cỡ nào?</h3>
<pre><code>R^2 = ti le phuong sai cua y duoc mo hinh giai thich (0..1)
Voi hoi quy don, R^2 = r^2.
</code></pre>
<h3>Hệ số dốc có thật không?</h3>
<p>Kiểm định H0: β1 = 0 (x không tác động tuyến tính) bằng t-test trên hệ số dốc: t = b1 / SE(b1). Bác bỏ H0 → quan hệ có ý nghĩa thống kê.</p>
<div class="callout"><span class="badge">Liên hệ CS</span> Hồi quy tuyến tính bình phương tối thiểu là mô hình học có giám sát đơn giản nhất — cùng ý tưởng mở rộng lên nhiều biến và lên các hàm mất mát nền của ML.</div>`,
  ]]);

const c7q = quiz('psi221-quiz-7', 'Quiz 7 — Regression & correlation|||Quiz 7 — Hồi quy & tương quan', [
  { id: 'q1', question: 'The correlation coefficient r ranges over?|||Hệ số tương quan r nằm trong khoảng?', options: ['0 to 1', '-1 to 1', '0 to infinity|||0 tới vô cùng', '-infinity to infinity|||âm vô cùng tới vô cùng'], correctIndex: 1, explanation: 'r từ -1 (âm hoàn hảo) tới +1 (dương hoàn hảo), 0 là không tương quan tuyến tính.' },
  { id: 'q2', question: 'Least squares chooses the line that?|||Bình phương tối thiểu chọn đường sao cho?', options: ['Passes through all points|||Đi qua mọi điểm', 'Minimizes the sum of squared residuals|||Cực tiểu tổng bình phương phần dư', 'Maximizes the slope|||Cực đại hệ số dốc', 'Has zero intercept|||Có tung độ gốc bằng 0'], correctIndex: 1, explanation: 'Cực tiểu tong (y - y_hat)^2 cho ra b0, b1.' },
  { id: 'q3', question: 'To test whether x has a linear effect on y we test?|||Để kiểm tra x có tác động tuyến tính lên y, ta kiểm định?', options: ['H0: beta1 = 0', 'H0: R^2 = 1', 'H0: r = 1', 'H0: b0 = 0'], correctIndex: 0, explanation: 'H0: beta1 = 0 nghĩa là hệ số dốc bằng 0, tức x không tác động tuyến tính.' },
]);

const c8 = doc('psi221-8-1-anova-nonparametric', '8.1 — ANOVA & nonparametric methods|||8.1 — ANOVA & phi tham số',
  'ANOVA một yếu tố (so nhiều trung bình bằng thống kê F); ý tưởng phân rã phương sai; kiểm định phi tham số; ứng dụng trong CS/ML.',
  [[
    `<span class="eyebrow">PSI221 · Chapter 8 · Lesson 8.1</span>
<h2>ANOVA &amp; nonparametric methods</h2>
<h3>Why ANOVA?</h3>
<p>To compare <strong>three or more</strong> group means at once, running many t-tests inflates the Type I error. <strong>ANOVA (Analysis of Variance)</strong> does it in one test.</p>
<h3>The idea: split the variance</h3>
<pre><code>Total variation = Between-group variation + Within-group variation
F = (variation between groups) / (variation within groups)
     = MS_between / MS_within
</code></pre>
<p>If group means differ, between-group variation is large → F is large → reject H0 (all means equal).</p>
<pre><code>H0: mu1 = mu2 = mu3 = ...      (all group means equal)
H1: at least one mean differs
</code></pre>
<h3>Nonparametric methods</h3>
<p>When data are ranks, ordinal, or badly non-Normal, use tests that assume little about the distribution:</p>
<ul>
<li><strong>Mann-Whitney U</strong> — nonparametric alternative to the two-sample t-test.</li>
<li><strong>Wilcoxon signed-rank</strong> — paired data.</li>
<li><strong>Kruskal-Wallis</strong> — nonparametric alternative to one-way ANOVA.</li>
</ul>
<div class="callout"><span class="badge">CS / ML applications</span> Comparing several model variants (ANOVA), A/B/n experiments, and rank-based metrics on skewed data (nonparametric) are everyday uses of exactly these tests.</div>`,
    `<span class="eyebrow">PSI221 · Chương 8 · Bài 8.1</span>
<h2>ANOVA &amp; phi tham số</h2>
<h3>Vì sao cần ANOVA?</h3>
<p>Để so <strong>ba nhóm trung bình trở lên</strong> cùng lúc, chạy nhiều t-test làm phồng sai lầm loại I. <strong>ANOVA (Phân tích phương sai)</strong> làm việc đó trong một kiểm định.</p>
<h3>Ý tưởng: tách phương sai</h3>
<pre><code>Bien thien tong = Bien thien giua nhom + Bien thien trong nhom
F = (bien thien giua nhom) / (bien thien trong nhom)
     = MS_giua / MS_trong
</code></pre>
<p>Nếu các trung bình nhóm khác nhau, biến thiên giữa nhóm lớn → F lớn → bác bỏ H0 (mọi trung bình bằng nhau).</p>
<pre><code>H0: mu1 = mu2 = mu3 = ...      (moi trung binh nhom bang nhau)
H1: co it nhat mot trung binh khac
</code></pre>
<h3>Kiểm định phi tham số</h3>
<p>Khi dữ liệu là hạng, thứ tự, hoặc lệch xa Chuẩn, dùng kiểm định giả định rất ít về phân phối:</p>
<ul>
<li><strong>Mann-Whitney U</strong> — thay cho t-test hai mẫu.</li>
<li><strong>Wilcoxon dấu-hạng</strong> — dữ liệu ghép cặp.</li>
<li><strong>Kruskal-Wallis</strong> — thay cho ANOVA một yếu tố.</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng CS / ML</span> So sánh nhiều biến thể mô hình (ANOVA), thử nghiệm A/B/n, và các chỉ số theo hạng trên dữ liệu lệch (phi tham số) là những dùng hằng ngày của đúng các kiểm định này.</div>`,
  ]]);

const c8q = quiz('psi221-quiz-8', 'Quiz 8 — ANOVA & nonparametric|||Quiz 8 — ANOVA & phi tham số', [
  { id: 'q1', question: 'ANOVA is used to?|||ANOVA dùng để?', options: ['Compare two variances only|||Chỉ so hai phương sai', 'Compare three or more group means|||So ba nhóm trung bình trở lên', 'Estimate a single proportion|||Ước lượng một tỉ lệ', 'Fit a regression line|||Khớp một đường hồi quy'], correctIndex: 1, explanation: 'ANOVA so nhiều trung bình cùng lúc bằng một thống kê F, tránh phồng sai lầm loại I.' },
  { id: 'q2', question: 'The ANOVA F statistic is?|||Thống kê F của ANOVA là?', options: ['Within / Between', 'Between / Within', 'Total / Between', 'Within * Between'], correctIndex: 1, explanation: 'F = MS_giua / MS_trong; F lớn nghĩa là các nhóm khác nhau đáng kể.' },
  { id: 'q3', question: 'A nonparametric alternative to the two-sample t-test is?|||Kiểm định phi tham số thay cho t-test hai mẫu là?', options: ['Mann-Whitney U', 'Ordinary least squares|||Bình phương tối thiểu', 'chi-square goodness of fit|||chi-square độ phù hợp', 'z-test'], correctIndex: 0, explanation: 'Mann-Whitney U so hai nhóm mà không giả định phân phối Chuẩn.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'PSI221',
    slug: 'psi221-probability-and-statistical-inference-ii',
    title: 'Probability and Statistical Inference II',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PSI221.webp',
    shortDescription: 'Statistical inference — sampling distributions & CLT, point estimation (MLE, moments), confidence intervals, hypothesis testing (type I/II errors, power, p-value), z/t/chi-square/F tests, regression & ANOVA. Bilingual, worked examples.|||Suy luận thống kê — phân phối lấy mẫu & CLT, ước lượng điểm (MLE, mô-men), khoảng tin cậy, kiểm định giả thuyết (sai lầm loại I/II, lực, p-value), kiểm định z/t/chi-square/F, hồi quy & ANOVA. Song ngữ, có ví dụ giải.',
    description: 'Môn <strong>PSI221 — Probability and Statistical Inference II</strong> (ngành Khoa học Máy tính, kỳ 2) nối tiếp xác suất cơ bản và nhấn vào <strong>suy luận thống kê</strong>: dùng dữ liệu mẫu để nói về tổng thể chưa biết. Lộ trình: <strong>ôn biến ngẫu nhiên</strong> (E[X], Var(X)) → <strong>phân phối lấy mẫu &amp; CLT</strong> → <strong>ước lượng điểm</strong> (MLE, phương pháp mô-men) → <strong>khoảng tin cậy</strong> → <strong>kiểm định giả thuyết</strong> (H0/H1, sai lầm loại I/II, lực, p-value) → <strong>z/t/chi-square/F</strong> → <strong>hồi quy &amp; tương quan</strong> → <strong>ANOVA &amp; phi tham số</strong>. Bám sách chuẩn quốc tế (Casella &amp; Berger; Wackerly; Rice), song ngữ, có công thức và ví dụ giải, quiz mỗi chương.',
    whatYouLearn: 'Biến ngẫu nhiên, E[X], Var(X)=σ²; phân phối lấy mẫu, sai số chuẩn σ/√n và CLT; ước lượng điểm (MLE, phương pháp mô-men) và tính chất (không chệch, vững, hiệu quả, MSE); khoảng tin cậy cho trung bình/tỉ lệ/phương sai; kiểm định giả thuyết (H0/H1, sai lầm loại I α và II β, lực, p-value); z-test, t-test, chi-square, F-test; hồi quy tuyến tính, bình phương tối thiểu, R² và kiểm định hệ số; ANOVA một yếu tố và kiểm định phi tham số, kèm ứng dụng CS/ML.',
    requirements: 'Đã học xác suất cơ bản (biến ngẫu nhiên, kỳ vọng, phương sai) và giải tích một biến (đạo hàm, tích phân). Nên biết Python cơ bản để thử tính bằng scipy.stats.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, ba sách chuẩn (Casella & Berger, Wackerly, Rice), tài liệu miễn phí, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Suy luận thống kê là gì; ước lượng & kiểm định; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Ôn biến ngẫu nhiên|||Chapter 1 — Review of RVs', description: 'RV, phân phối, E[X], Var(X), phân phối hay gặp.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân phối lấy mẫu & CLT|||Chapter 2 — Sampling distributions & CLT', description: 'Phân phối lấy mẫu, sai số chuẩn, định lý giới hạn trung tâm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ước lượng điểm|||Chapter 3 — Point estimation', description: 'MLE, phương pháp mô-men, tính chất ước lượng, MSE.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ước lượng khoảng|||Chapter 4 — Interval estimation', description: 'Khoảng tin cậy cho trung bình, tỉ lệ, phương sai.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kiểm định giả thuyết|||Chapter 5 — Hypothesis testing', description: 'H0/H1, sai lầm loại I/II, lực, p-value.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kiểm định thông dụng|||Chapter 6 — Common tests', description: 'z-test, t-test, chi-square, F-test.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hồi quy & tương quan|||Chapter 7 — Regression & correlation', description: 'Tương quan, hồi quy tuyến tính, bình phương tối thiểu, R².', lessons: [c7, c7q] },
    { title: 'Chương 8 — ANOVA & phi tham số|||Chapter 8 — ANOVA & nonparametric', description: 'ANOVA một yếu tố, kiểm định phi tham số, ứng dụng CS/ML.', lessons: [c8, c8q] },
  ],
};
