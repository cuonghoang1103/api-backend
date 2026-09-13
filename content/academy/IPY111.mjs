/**
 * IPY111 — Introduction to Probability (Nhập môn Xác suất). Ngành Khoa học Máy
 * tính FPTU, Kỳ 1. KHUNG chất lượng song ngữ VI+EN: 8 chương (không gian mẫu &
 * biến cố → xác suất có điều kiện → Bayes → biến ngẫu nhiên rời rạc → phân phối
 * rời rạc → biến ngẫu nhiên liên tục → phân phối liên tục → định lý giới hạn),
 * mỗi chương 1 DOCUMENT + 1 QUIZ 3 câu. Giáo trình chuẩn: Blitzstein & Hwang
 * "Introduction to Probability" (Harvard Stat110), Ross "A First Course in
 * Probability", MIT 6.041. Công thức dạng text trong khối <pre>.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→"&amp;" trong content HTML; helper doc content .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ipy111-0-1-overview', 'Course overview: what is probability?|||Tổng quan: xác suất là gì?',
  'Xác suất đo mức độ chắc chắn của một biến cố (0 đến 1); vì sao nó là nền của thống kê, học máy và khoa học máy tính; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">IPY111 · Lesson 0.1 · Overview</span>
<h2>What is probability?</h2>
<p class="lead"><strong>Probability</strong> is the mathematics of <strong>uncertainty</strong> — a number between 0 and 1 that measures how likely an event is. 0 means impossible, 1 means certain, 0.5 means a coin toss.</p>
<h3>Why it matters for computer science</h3>
<ul>
<li><strong>Machine learning</strong> — models predict probabilities (spam or not, this digit is a 7 with 92% confidence).</li>
<li><strong>Algorithms</strong> — randomized algorithms, hashing, and Monte Carlo methods rely on chance.</li>
<li><strong>Data &amp; AI</strong> — Bayes rule, distributions and the Central Limit Theorem underpin statistics and inference.</li>
</ul>
<h3>Roadmap</h3>
<p>Sample spaces &amp; events → conditional probability → Bayes theorem → discrete random variables → key discrete distributions → continuous random variables → key continuous distributions → limit theorems (LLN, CLT). Bilingual, with worked examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">IPY111 · Bài 0.1 · Tổng quan</span>
<h2>Xác suất là gì?</h2>
<p class="lead"><strong>Xác suất</strong> là toán học của <strong>sự bất định</strong> — một con số từ 0 đến 1 đo mức độ khả dĩ của một biến cố. 0 là không thể, 1 là chắc chắn, 0.5 là tung đồng xu.</p>
<h3>Vì sao quan trọng với khoa học máy tính</h3>
<ul>
<li><strong>Học máy</strong> — mô hình dự đoán xác suất (spam hay không, chữ số này là 7 với độ tin cậy 92%).</li>
<li><strong>Thuật toán</strong> — thuật toán ngẫu nhiên, băm (hashing) và phương pháp Monte Carlo đều dựa vào may rủi.</li>
<li><strong>Dữ liệu &amp; AI</strong> — quy tắc Bayes, các phân phối và Định lý giới hạn trung tâm là nền của thống kê và suy luận.</li>
</ul>
<h3>Lộ trình</h3>
<p>Không gian mẫu &amp; biến cố → xác suất có điều kiện → định lý Bayes → biến ngẫu nhiên rời rạc → phân phối rời rạc quan trọng → biến ngẫu nhiên liên tục → phân phối liên tục quan trọng → định lý giới hạn (LLN, CLT). Song ngữ, có ví dụ giải và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ipy111-1-1-sample-space', '1.1 — Sample space & events|||1.1 — Không gian mẫu & biến cố',
  'Phép thử, không gian mẫu, biến cố; tiên đề xác suất (Kolmogorov); phép đếm — hoán vị & tổ hợp.',
  [[
    `<span class="eyebrow">IPY111 · Chapter 1 · Lesson 1.1</span>
<h2>Sample space &amp; events</h2>
<h3>The building blocks</h3>
<ul>
<li><strong>Experiment</strong> — a process with an uncertain result (roll a die, flip a coin).</li>
<li><strong>Sample space (S)</strong> — the set of ALL possible outcomes. For one die, S = {1,2,3,4,5,6}.</li>
<li><strong>Event</strong> — any subset of S. "Roll an even number" is the event {2,4,6}.</li>
</ul>
<h3>The axioms of probability (Kolmogorov)</h3>
<p>Every probability obeys three rules, and everything else is derived from them.</p>
<pre><code>Axioms:
  1) P(A) &gt;= 0                        (never negative)
  2) P(S) = 1                          (something must happen)
  3) A, B disjoint -&gt; P(A or B) = P(A) + P(B)

Counting (equally likely outcomes):
  P(A) = (favorable outcomes) / (total outcomes)
  Permutations (order matters): nPk = n! / (n-k)!
  Combinations (order not):     nCk = n! / (k!(n-k)!)</code></pre>
<h3>Worked example</h3>
<pre><code>Roll two fair dice. P(sum = 7)?
  |S| = 6 x 6 = 36 equally likely outcomes
  favorable: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) = 6
  P(sum = 7) = 6 / 36 = 1/6 &asymp; 0.167</code></pre>
<div class="callout"><span class="badge">Key idea</span> When outcomes are equally likely, probability is just careful counting.</div>`,
    `<span class="eyebrow">IPY111 · Chương 1 · Bài 1.1</span>
<h2>Không gian mẫu &amp; biến cố</h2>
<h3>Các khối cơ bản</h3>
<ul>
<li><strong>Phép thử</strong> — một quá trình có kết quả bất định (gieo xúc xắc, tung đồng xu).</li>
<li><strong>Không gian mẫu (S)</strong> — tập TẤT CẢ kết quả có thể. Với một xúc xắc, S = {1,2,3,4,5,6}.</li>
<li><strong>Biến cố</strong> — một tập con bất kỳ của S. "Ra số chẵn" là biến cố {2,4,6}.</li>
</ul>
<h3>Tiên đề xác suất (Kolmogorov)</h3>
<p>Mọi xác suất tuân theo ba quy tắc, và tất cả những thứ khác được suy ra từ chúng.</p>
<pre><code>Tiên đề:
  1) P(A) &gt;= 0                        (không bao giờ âm)
  2) P(S) = 1                          (điều gì đó phải xảy ra)
  3) A, B xung khắc -&gt; P(A hoặc B) = P(A) + P(B)

Phép đếm (kết quả đồng khả năng):
  P(A) = (số kết quả thuận lợi) / (tổng số kết quả)
  Hoán vị (có thứ tự): nPk = n! / (n-k)!
  Tổ hợp (không thứ tự): nCk = n! / (k!(n-k)!)</code></pre>
<h3>Ví dụ giải</h3>
<pre><code>Gieo hai xúc xắc cân đối. P(tổng = 7)?
  |S| = 6 x 6 = 36 kết quả đồng khả năng
  thuận lợi: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) = 6
  P(tổng = 7) = 6 / 36 = 1/6 &asymp; 0.167</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Khi các kết quả đồng khả năng, xác suất chỉ là đếm cho cẩn thận.</div>`,
  ]]);

const c1q = quiz('ipy111-quiz-1', 'Quiz 1 — Sample space & events|||Quiz 1 — Không gian mẫu & biến cố', [
  { id: 'q1', question: 'The sample space of an experiment is?|||Không gian mẫu của một phép thử là?', options: ['One favorable outcome|||Một kết quả thuận lợi', 'The set of ALL possible outcomes|||Tập TẤT CẢ kết quả có thể', 'A probability between 0 and 1|||Một xác suất từ 0 đến 1', 'The number of trials|||Số lần thử'], correctIndex: 1, explanation: 'Không gian mẫu S là tập tất cả kết quả có thể của phép thử.' },
  { id: 'q2', question: 'Which is a valid probability axiom?|||Đâu là một tiên đề xác suất hợp lệ?', options: ['P(S) = 0', 'P(A) can be negative|||P(A) có thể âm', 'P(S) = 1', 'P(A) &gt; 1 is allowed|||P(A) &gt; 1 được phép'], correctIndex: 2, explanation: 'P(S) = 1: chắc chắn có một kết quả xảy ra; và P(A) luôn nằm trong [0,1].' },
  { id: 'q3', question: 'Rolling two fair dice, P(sum = 7) is?|||Gieo hai xúc xắc cân đối, P(tổng = 7) là?', options: ['1/12', '1/6', '1/36', '7/36'], correctIndex: 1, explanation: '6 kết quả thuận lợi trên 36 → 6/36 = 1/6.' },
]);

const c2 = doc('ipy111-2-1-conditional', '2.1 — Conditional probability|||2.1 — Xác suất có điều kiện',
  'Xác suất có điều kiện P(A|B); quy tắc nhân; biến cố độc lập.',
  [[
    `<span class="eyebrow">IPY111 · Chapter 2 · Lesson 2.1</span>
<h2>Conditional probability</h2>
<h3>Updating belief with new information</h3>
<p><strong>Conditional probability</strong> P(A|B) is the probability of A <em>given that</em> B has happened. Knowing B shrinks the sample space to only the outcomes where B is true.</p>
<pre><code>Conditional:  P(A|B) = P(A and B) / P(B),   P(B) &gt; 0
Multiplication rule: P(A and B) = P(A|B) * P(B)
Independence: A and B independent
              &lt;=&gt; P(A and B) = P(A) * P(B)
              &lt;=&gt; P(A|B) = P(A)   (B tells you nothing about A)</code></pre>
<h3>Worked example</h3>
<pre><code>Draw 2 cards from a deck, without replacement.
P(both aces)?
  P(1st ace) = 4/52
  P(2nd ace | 1st ace) = 3/51
  P(both) = (4/52) * (3/51) = 12/2652 = 1/221 &asymp; 0.0045</code></pre>
<div class="callout"><span class="badge">Watch out</span> Independent is NOT the same as disjoint. Disjoint events cannot happen together, so knowing one happened changes the other — they are highly dependent.</div>`,
    `<span class="eyebrow">IPY111 · Chương 2 · Bài 2.1</span>
<h2>Xác suất có điều kiện</h2>
<h3>Cập nhật niềm tin khi có thông tin mới</h3>
<p><strong>Xác suất có điều kiện</strong> P(A|B) là xác suất của A <em>khi biết</em> B đã xảy ra. Biết B thu hẹp không gian mẫu về chỉ những kết quả mà B đúng.</p>
<pre><code>Có điều kiện:  P(A|B) = P(A và B) / P(B),   P(B) &gt; 0
Quy tắc nhân: P(A và B) = P(A|B) * P(B)
Độc lập: A và B độc lập
         &lt;=&gt; P(A và B) = P(A) * P(B)
         &lt;=&gt; P(A|B) = P(A)   (B không cho biết gì về A)</code></pre>
<h3>Ví dụ giải</h3>
<pre><code>Rút 2 lá từ bộ bài, không hoàn lại.
P(cả hai đều là át)?
  P(lá 1 là át) = 4/52
  P(lá 2 là át | lá 1 là át) = 3/51
  P(cả hai) = (4/52) * (3/51) = 12/2652 = 1/221 &asymp; 0.0045</code></pre>
<div class="callout"><span class="badge">Chú ý</span> Độc lập KHÔNG giống xung khắc. Hai biến cố xung khắc không thể cùng xảy ra, nên biết cái này xảy ra làm đổi cái kia — chúng phụ thuộc rất mạnh.</div>`,
  ]]);

const c2q = quiz('ipy111-quiz-2', 'Quiz 2 — Conditional probability|||Quiz 2 — Xác suất có điều kiện', [
  { id: 'q1', question: 'The formula for conditional probability is?|||Công thức xác suất có điều kiện là?', options: ['P(A|B) = P(A) + P(B)', 'P(A|B) = P(A and B) / P(B)', 'P(A|B) = P(A) * P(B)', 'P(A|B) = P(B) / P(A)'], correctIndex: 1, explanation: 'P(A|B) = P(A và B) / P(B), với P(B) > 0.' },
  { id: 'q2', question: 'A and B are independent when?|||A và B độc lập khi?', options: ['They cannot happen together|||Chúng không thể cùng xảy ra', 'P(A and B) = P(A) * P(B)', 'P(A and B) = 0', 'P(A) = P(B)'], correctIndex: 1, explanation: 'Độc lập nghĩa là P(A và B) = P(A)·P(B); biết cái này không đổi cái kia.' },
  { id: 'q3', question: 'Draw 2 cards without replacement, P(both aces) is?|||Rút 2 lá không hoàn lại, P(cả hai là át) là?', options: ['(4/52)*(4/52)', '(4/52)*(3/51)', '4/52 + 3/51', '1/13'], correctIndex: 1, explanation: 'Không hoàn lại nên lá 2 dùng xác suất có điều kiện: (4/52)·(3/51) = 1/221.' },
]);

const c3 = doc('ipy111-3-1-bayes', '3.1 — Bayes theorem|||3.1 — Định lý Bayes',
  'Xác suất toàn phần; định lý Bayes; ví dụ chẩn đoán bệnh (nghịch lý dương tính giả).',
  [[
    `<span class="eyebrow">IPY111 · Chapter 3 · Lesson 3.1</span>
<h2>Bayes theorem</h2>
<h3>Reversing the condition</h3>
<p>Often we know P(evidence | cause) but want P(cause | evidence). <strong>Bayes theorem</strong> flips the conditioning, and it is the engine behind spam filters, medical tests and machine learning.</p>
<pre><code>Law of total probability:
  P(A) = sum_i P(A | B_i) * P(B_i)     (B_i partition S)

Bayes theorem:
  P(B | A) = P(A | B) * P(B) / P(A)</code></pre>
<h3>Worked example — the false-positive trap</h3>
<pre><code>A disease affects 1% of people. A test is:
  99% sensitive  (P(+ | sick)    = 0.99)
  95% specific   (P(- | healthy) = 0.95, so P(+ | healthy) = 0.05)
You test positive. P(sick | +)?
  P(+) = 0.99*0.01 + 0.05*0.99 = 0.0099 + 0.0495 = 0.0594
  P(sick | +) = (0.99 * 0.01) / 0.0594 &asymp; 0.167
Only ~17% — because healthy people vastly outnumber sick ones.</code></pre>
<div class="callout"><span class="badge">Base rate matters</span> A very accurate test can still give mostly false alarms when the condition is rare. Bayes forces you to account for the prior.</div>`,
    `<span class="eyebrow">IPY111 · Chương 3 · Bài 3.1</span>
<h2>Định lý Bayes</h2>
<h3>Đảo chiều điều kiện</h3>
<p>Thường ta biết P(bằng chứng | nguyên nhân) nhưng lại muốn P(nguyên nhân | bằng chứng). <strong>Định lý Bayes</strong> đảo chiều điều kiện, và là động cơ sau bộ lọc spam, xét nghiệm y khoa và học máy.</p>
<pre><code>Công thức xác suất toàn phần:
  P(A) = sum_i P(A | B_i) * P(B_i)     (B_i chia S)

Định lý Bayes:
  P(B | A) = P(A | B) * P(B) / P(A)</code></pre>
<h3>Ví dụ giải — bẫy dương tính giả</h3>
<pre><code>Một bệnh có ở 1% dân số. Xét nghiệm:
  độ nhạy 99%   (P(+ | có bệnh)      = 0.99)
  độ đặc hiệu 95% (P(- | khỏe)       = 0.95, nên P(+ | khỏe) = 0.05)
Bạn xét nghiệm dương tính. P(có bệnh | +)?
  P(+) = 0.99*0.01 + 0.05*0.99 = 0.0099 + 0.0495 = 0.0594
  P(có bệnh | +) = (0.99 * 0.01) / 0.0594 &asymp; 0.167
Chỉ ~17% — vì người khỏe đông hơn người bệnh rất nhiều.</code></pre>
<div class="callout"><span class="badge">Tỉ lệ nền quan trọng</span> Một xét nghiệm rất chính xác vẫn có thể toàn báo động giả khi bệnh hiếm. Bayes buộc bạn tính đến xác suất tiên nghiệm.</div>`,
  ]]);

const c3q = quiz('ipy111-quiz-3', 'Quiz 3 — Bayes theorem|||Quiz 3 — Định lý Bayes', [
  { id: 'q1', question: 'Bayes theorem is written as?|||Định lý Bayes được viết là?', options: ['P(B|A) = P(A|B) * P(B) / P(A)', 'P(B|A) = P(A) * P(B)', 'P(B|A) = P(A|B) + P(B)', 'P(B|A) = P(A) / P(B)'], correctIndex: 0, explanation: 'P(B|A) = P(A|B)·P(B) / P(A) — đảo chiều điều kiện.' },
  { id: 'q2', question: 'The law of total probability sums over?|||Công thức xác suất toàn phần lấy tổng trên?', options: ['A single event|||Một biến cố duy nhất', 'A partition of the sample space|||Một phân hoạch của không gian mẫu', 'Only independent events|||Chỉ các biến cố độc lập', 'The complement only|||Chỉ biến cố đối'], correctIndex: 1, explanation: 'P(A) = tổng P(A|B_i)·P(B_i) với các B_i chia (phân hoạch) không gian mẫu.' },
  { id: 'q3', question: 'A rare disease with an accurate test — a positive result often means?|||Bệnh hiếm với xét nghiệm chính xác — kết quả dương thường có nghĩa?', options: ['You almost certainly have it|||Gần như chắc chắn mắc bệnh', 'The chance can still be low due to the low base rate|||Xác suất vẫn có thể thấp vì tỉ lệ nền thấp', 'The test is broken|||Xét nghiệm bị hỏng', 'Probability equals sensitivity|||Xác suất bằng độ nhạy'], correctIndex: 1, explanation: 'Khi bệnh hiếm, dương tính giả áp đảo → P(bệnh|+) có thể chỉ ~17%.' },
]);

const c4 = doc('ipy111-4-1-discrete-rv', '4.1 — Discrete random variables|||4.1 — Biến ngẫu nhiên rời rạc',
  'Biến ngẫu nhiên rời rạc; hàm khối xác suất (PMF); kỳ vọng E[X]; phương sai và độ lệch chuẩn.',
  [[
    `<span class="eyebrow">IPY111 · Chapter 4 · Lesson 4.1</span>
<h2>Discrete random variables</h2>
<h3>Turning outcomes into numbers</h3>
<p>A <strong>random variable (RV)</strong> assigns a number to each outcome. A <strong>discrete</strong> RV takes countable values (0, 1, 2, ...). Its <strong>PMF</strong> lists the probability of each value.</p>
<pre><code>PMF:  p(x) = P(X = x),   with   sum of p(x) = 1
Expectation (the long-run average):
  E[X] = sum of  x * p(x)
Variance (spread around the mean, mu = E[X]):
  Var(X) = E[(X - mu)^2] = E[X^2] - (E[X])^2
Standard deviation:  sigma = sqrt(Var(X))</code></pre>
<h3>Worked example</h3>
<pre><code>Fair die, X = the face shown.
  E[X]   = (1+2+3+4+5+6)/6 = 3.5
  E[X^2] = (1+4+9+16+25+36)/6 = 91/6 &asymp; 15.17
  Var(X) = 91/6 - 3.5^2 = 15.17 - 12.25 = 2.917
  sigma  = sqrt(2.917) &asymp; 1.71</code></pre>
<div class="callout"><span class="badge">Intuition</span> E[X] is where the distribution balances; sigma says how far, typically, values fall from that center.</div>`,
    `<span class="eyebrow">IPY111 · Chương 4 · Bài 4.1</span>
<h2>Biến ngẫu nhiên rời rạc</h2>
<h3>Biến kết quả thành con số</h3>
<p>Một <strong>biến ngẫu nhiên (RV)</strong> gán một con số cho mỗi kết quả. RV <strong>rời rạc</strong> nhận các giá trị đếm được (0, 1, 2, ...). <strong>PMF</strong> của nó liệt kê xác suất của từng giá trị.</p>
<pre><code>PMF:  p(x) = P(X = x),   với   tổng p(x) = 1
Kỳ vọng (trung bình về lâu dài):
  E[X] = tổng của  x * p(x)
Phương sai (độ phân tán quanh trung bình mu = E[X]):
  Var(X) = E[(X - mu)^2] = E[X^2] - (E[X])^2
Độ lệch chuẩn:  sigma = sqrt(Var(X))</code></pre>
<h3>Ví dụ giải</h3>
<pre><code>Xúc xắc cân đối, X = mặt hiện ra.
  E[X]   = (1+2+3+4+5+6)/6 = 3.5
  E[X^2] = (1+4+9+16+25+36)/6 = 91/6 &asymp; 15.17
  Var(X) = 91/6 - 3.5^2 = 15.17 - 12.25 = 2.917
  sigma  = sqrt(2.917) &asymp; 1.71</code></pre>
<div class="callout"><span class="badge">Trực giác</span> E[X] là điểm cân bằng của phân phối; sigma cho biết giá trị thường lệch bao xa khỏi tâm đó.</div>`,
  ]]);

const c4q = quiz('ipy111-quiz-4', 'Quiz 4 — Discrete random variables|||Quiz 4 — Biến ngẫu nhiên rời rạc', [
  { id: 'q1', question: 'Expectation E[X] of a discrete RV is?|||Kỳ vọng E[X] của một RV rời rạc là?', options: ['sum of x * p(x)', 'the largest value of x|||giá trị lớn nhất của x', 'sqrt of the variance|||căn bậc hai của phương sai', 'always 0.5'], correctIndex: 0, explanation: 'E[X] = tổng x·p(x) — trung bình có trọng số theo xác suất.' },
  { id: 'q2', question: 'A shortcut formula for variance is?|||Một công thức tắt cho phương sai là?', options: ['E[X^2] + (E[X])^2', 'E[X^2] - (E[X])^2', '(E[X])^2 - E[X^2]', 'E[X] - E[X^2]'], correctIndex: 1, explanation: 'Var(X) = E[X^2] - (E[X])^2.' },
  { id: 'q3', question: 'For a fair die, E[X] equals?|||Với xúc xắc cân đối, E[X] bằng?', options: ['3', '3.5', '6', '2.917'], correctIndex: 1, explanation: '(1+2+3+4+5+6)/6 = 3.5; 2.917 là phương sai chứ không phải kỳ vọng.' },
]);

const c5 = doc('ipy111-5-1-discrete-dists', '5.1 — Key discrete distributions|||5.1 — Phân phối rời rạc quan trọng',
  'Bernoulli, Nhị thức (Binomial), Poisson, Hình học (Geometric): công thức, kỳ vọng, phương sai và khi nào dùng.',
  [[
    `<span class="eyebrow">IPY111 · Chapter 5 · Lesson 5.1</span>
<h2>Key discrete distributions</h2>
<h3>Four workhorses</h3>
<ul>
<li><strong>Bernoulli(p)</strong> — a single yes/no trial (a coin flip).</li>
<li><strong>Binomial(n, p)</strong> — number of successes in n independent Bernoulli trials.</li>
<li><strong>Poisson(&lambda;)</strong> — count of rare events in a fixed interval (calls per hour).</li>
<li><strong>Geometric(p)</strong> — number of trials until the first success.</li>
</ul>
<pre><code>Bernoulli(p): P(1)=p, P(0)=1-p;   E=p,   Var=p(1-p)
Binomial(n,p): P(X=k) = nCk * p^k * (1-p)^(n-k)
               E = n*p,   Var = n*p*(1-p)
Poisson(lambda): P(X=k) = e^(-lambda) * lambda^k / k!
               E = lambda,   Var = lambda
Geometric(p): P(X=k) = (1-p)^(k-1) * p;   E = 1/p</code></pre>
<h3>Worked example</h3>
<pre><code>Flip a fair coin 10 times. P(exactly 6 heads)?
  Binomial(n=10, p=0.5)
  P = 10C6 * 0.5^6 * 0.5^4 = 210 * 0.5^10
    = 210 / 1024 &asymp; 0.205</code></pre>
<div class="callout"><span class="badge">How to choose</span> Counting successes in a fixed n → Binomial. Counting rare events over time/space → Poisson. Waiting for the first success → Geometric.</div>`,
    `<span class="eyebrow">IPY111 · Chương 5 · Bài 5.1</span>
<h2>Phân phối rời rạc quan trọng</h2>
<h3>Bốn phân phối chủ lực</h3>
<ul>
<li><strong>Bernoulli(p)</strong> — một phép thử có/không duy nhất (một lần tung xu).</li>
<li><strong>Nhị thức Binomial(n, p)</strong> — số lần thành công trong n phép thử Bernoulli độc lập.</li>
<li><strong>Poisson(&lambda;)</strong> — số biến cố hiếm trong một khoảng cố định (cuộc gọi mỗi giờ).</li>
<li><strong>Hình học Geometric(p)</strong> — số phép thử cho tới lần thành công đầu tiên.</li>
</ul>
<pre><code>Bernoulli(p): P(1)=p, P(0)=1-p;   E=p,   Var=p(1-p)
Binomial(n,p): P(X=k) = nCk * p^k * (1-p)^(n-k)
               E = n*p,   Var = n*p*(1-p)
Poisson(lambda): P(X=k) = e^(-lambda) * lambda^k / k!
               E = lambda,   Var = lambda
Geometric(p): P(X=k) = (1-p)^(k-1) * p;   E = 1/p</code></pre>
<h3>Ví dụ giải</h3>
<pre><code>Tung đồng xu cân đối 10 lần. P(đúng 6 mặt ngửa)?
  Binomial(n=10, p=0.5)
  P = 10C6 * 0.5^6 * 0.5^4 = 210 * 0.5^10
    = 210 / 1024 &asymp; 0.205</code></pre>
<div class="callout"><span class="badge">Cách chọn</span> Đếm số thành công trong n cố định → Nhị thức. Đếm biến cố hiếm theo thời gian/không gian → Poisson. Chờ tới thành công đầu tiên → Hình học.</div>`,
  ]]);

const c5q = quiz('ipy111-quiz-5', 'Quiz 5 — Key discrete distributions|||Quiz 5 — Phân phối rời rạc quan trọng', [
  { id: 'q1', question: 'Number of successes in n independent yes/no trials follows?|||Số lần thành công trong n phép thử có/không độc lập tuân theo?', options: ['Poisson', 'Binomial|||Nhị thức', 'Geometric|||Hình học', 'Uniform|||Đều'], correctIndex: 1, explanation: 'Đó là phân phối Nhị thức (Binomial) với n và p.' },
  { id: 'q2', question: 'For Poisson(lambda), the mean and variance are?|||Với Poisson(lambda), trung bình và phương sai là?', options: ['both lambda|||đều bằng lambda', 'lambda and lambda^2', 'n*p and n*p*(1-p)', '1/p and (1-p)/p^2'], correctIndex: 0, explanation: 'Poisson có E = Var = lambda.' },
  { id: 'q3', question: 'Flip a fair coin 10 times, P(exactly 6 heads) is about?|||Tung xu cân đối 10 lần, P(đúng 6 ngửa) khoảng?', options: ['0.5', '0.205', '0.6', '0.021'], correctIndex: 1, explanation: '10C6 · 0.5^10 = 210/1024 ≈ 0.205.' },
]);

const c6 = doc('ipy111-6-1-continuous-rv', '6.1 — Continuous random variables|||6.1 — Biến ngẫu nhiên liên tục',
  'Biến ngẫu nhiên liên tục; hàm mật độ (PDF); hàm phân phối tích lũy (CDF); kỳ vọng bằng tích phân.',
  [[
    `<span class="eyebrow">IPY111 · Chapter 6 · Lesson 6.1</span>
<h2>Continuous random variables</h2>
<h3>When values form a continuum</h3>
<p>A <strong>continuous</strong> RV can take any value in a range (a height, a waiting time). We no longer assign probability to single points — instead we use a <strong>density</strong> and measure <em>area</em>.</p>
<pre><code>PDF (probability density):  f(x) &gt;= 0,
     integral over all x of f(x) dx = 1
CDF:  F(x) = P(X &lt;= x) = integral from -inf to x of f(t) dt
P(a &lt;= X &lt;= b) = F(b) - F(a) = area under f between a and b
Expectation:  E[X] = integral of  x * f(x) dx
Key fact: for continuous X, P(X = c) = 0  (a point has no area)</code></pre>
<h3>Worked example</h3>
<pre><code>X uniform on [0, 2]:  f(x) = 1/2 for 0 &lt;= x &lt;= 2, else 0.
  P(X &lt;= 1)     = area = (1) * (1/2) = 0.5
  P(0.5 &lt;= X &lt;= 1.5) = (1) * (1/2) = 0.5
  E[X] = (0 + 2)/2 = 1   (the midpoint)</code></pre>
<div class="callout"><span class="badge">Discrete vs continuous</span> Discrete: sum a PMF. Continuous: integrate a PDF. The idea (total probability = 1) is the same; only sum becomes integral.</div>`,
    `<span class="eyebrow">IPY111 · Chương 6 · Bài 6.1</span>
<h2>Biến ngẫu nhiên liên tục</h2>
<h3>Khi giá trị tạo thành một dải liên tục</h3>
<p>Một RV <strong>liên tục</strong> có thể nhận giá trị bất kỳ trong một khoảng (chiều cao, thời gian chờ). Ta không còn gán xác suất cho từng điểm — thay vào đó dùng <strong>mật độ</strong> và đo <em>diện tích</em>.</p>
<pre><code>PDF (mật độ xác suất):  f(x) &gt;= 0,
     tích phân trên toàn trục của f(x) dx = 1
CDF:  F(x) = P(X &lt;= x) = tích phân từ -inf tới x của f(t) dt
P(a &lt;= X &lt;= b) = F(b) - F(a) = diện tích dưới f giữa a và b
Kỳ vọng:  E[X] = tích phân của  x * f(x) dx
Điều then chốt: với X liên tục, P(X = c) = 0  (một điểm không có diện tích)</code></pre>
<h3>Ví dụ giải</h3>
<pre><code>X đều trên [0, 2]:  f(x) = 1/2 với 0 &lt;= x &lt;= 2, còn lại 0.
  P(X &lt;= 1)     = diện tích = (1) * (1/2) = 0.5
  P(0.5 &lt;= X &lt;= 1.5) = (1) * (1/2) = 0.5
  E[X] = (0 + 2)/2 = 1   (điểm giữa)</code></pre>
<div class="callout"><span class="badge">Rời rạc và liên tục</span> Rời rạc: lấy tổng PMF. Liên tục: lấy tích phân PDF. Ý tưởng (tổng xác suất = 1) như nhau; chỉ tổng đổi thành tích phân.</div>`,
  ]]);

const c6q = quiz('ipy111-quiz-6', 'Quiz 6 — Continuous random variables|||Quiz 6 — Biến ngẫu nhiên liên tục', [
  { id: 'q1', question: 'For a continuous RV, P(X = c) equals?|||Với một RV liên tục, P(X = c) bằng?', options: ['1', '0', 'f(c)', '0.5'], correctIndex: 1, explanation: 'Một điểm đơn lẻ có diện tích 0, nên P(X = c) = 0 cho RV liên tục.' },
  { id: 'q2', question: 'The CDF F(x) represents?|||Hàm phân phối tích lũy F(x) biểu diễn?', options: ['P(X = x)', 'P(X &lt;= x)', 'the density at x|||mật độ tại x', 'the mean|||trung bình'], correctIndex: 1, explanation: 'F(x) = P(X <= x), tích phân của mật độ từ -vô cực tới x.' },
  { id: 'q3', question: 'P(a &lt;= X &lt;= b) for a continuous RV equals?|||P(a &lt;= X &lt;= b) với RV liên tục bằng?', options: ['F(b) - F(a)', 'f(b) - f(a)', 'F(a) - F(b)', 'f(a) * f(b)'], correctIndex: 0, explanation: 'Bằng diện tích dưới mật độ giữa a và b = F(b) - F(a).' },
]);

const c7 = doc('ipy111-7-1-continuous-dists', '7.1 — Key continuous distributions|||7.1 — Phân phối liên tục quan trọng',
  'Phân phối Đều (Uniform), Mũ (Exponential) và Chuẩn/Gaussian (Normal); chuẩn hóa Z; quy tắc 68-95-99.7.',
  [[
    `<span class="eyebrow">IPY111 · Chapter 7 · Lesson 7.1</span>
<h2>Key continuous distributions</h2>
<h3>Three you must know</h3>
<ul>
<li><strong>Uniform(a, b)</strong> — every value in [a, b] equally likely.</li>
<li><strong>Exponential(&lambda;)</strong> — waiting time between random events; it is <em>memoryless</em>.</li>
<li><strong>Normal / Gaussian(&mu;, &sigma;&sup2;)</strong> — the bell curve; appears everywhere thanks to the CLT.</li>
</ul>
<pre><code>Uniform(a,b): f(x) = 1/(b-a) on [a,b];   E = (a+b)/2
Exponential(lambda): f(x) = lambda * e^(-lambda x), x &gt;= 0;   E = 1/lambda
Normal(mu, sigma^2): the bell curve centered at mu
  Standardize:  Z = (X - mu) / sigma  ~ Normal(0, 1)
  68-95-99.7 rule: about 68% / 95% / 99.7% of values
  fall within 1 / 2 / 3 sigma of the mean</code></pre>
<h3>Worked example</h3>
<pre><code>IQ scores modeled as Normal(mu = 100, sigma = 15).
  P(85 &lt;= X &lt;= 115) = P(within 1 sigma) &asymp; 68%
  P(X &gt; 130) = P(Z &gt; 2) &asymp; 2.3%   (beyond +2 sigma)</code></pre>
<div class="callout"><span class="badge">Why Normal is everywhere</span> Sums and averages of many small independent effects pile up into a bell curve — the reason the Normal shows up in heights, errors and test scores.</div>`,
    `<span class="eyebrow">IPY111 · Chương 7 · Bài 7.1</span>
<h2>Phân phối liên tục quan trọng</h2>
<h3>Ba phân phối phải biết</h3>
<ul>
<li><strong>Đều Uniform(a, b)</strong> — mọi giá trị trong [a, b] đồng khả năng.</li>
<li><strong>Mũ Exponential(&lambda;)</strong> — thời gian chờ giữa các biến cố ngẫu nhiên; nó <em>không nhớ</em> (memoryless).</li>
<li><strong>Chuẩn / Gaussian(&mu;, &sigma;&sup2;)</strong> — đường cong hình chuông; xuất hiện khắp nơi nhờ CLT.</li>
</ul>
<pre><code>Uniform(a,b): f(x) = 1/(b-a) trên [a,b];   E = (a+b)/2
Exponential(lambda): f(x) = lambda * e^(-lambda x), x &gt;= 0;   E = 1/lambda
Normal(mu, sigma^2): đường cong chuông có tâm tại mu
  Chuẩn hóa:  Z = (X - mu) / sigma  ~ Normal(0, 1)
  Quy tắc 68-95-99.7: khoảng 68% / 95% / 99.7% giá trị
  nằm trong 1 / 2 / 3 sigma quanh trung bình</code></pre>
<h3>Ví dụ giải</h3>
<pre><code>Điểm IQ mô hình hóa bằng Normal(mu = 100, sigma = 15).
  P(85 &lt;= X &lt;= 115) = P(trong 1 sigma) &asymp; 68%
  P(X &gt; 130) = P(Z &gt; 2) &asymp; 2.3%   (vượt +2 sigma)</code></pre>
<div class="callout"><span class="badge">Vì sao Chuẩn ở khắp nơi</span> Tổng và trung bình của nhiều tác động nhỏ độc lập dồn thành đường cong chuông — lý do phân phối Chuẩn xuất hiện ở chiều cao, sai số và điểm thi.</div>`,
  ]]);

const c7q = quiz('ipy111-quiz-7', 'Quiz 7 — Key continuous distributions|||Quiz 7 — Phân phối liên tục quan trọng', [
  { id: 'q1', question: 'To standardize a Normal variable you compute?|||Để chuẩn hóa một biến Chuẩn ta tính?', options: ['Z = X * sigma + mu', 'Z = (X - mu) / sigma', 'Z = (X + mu) * sigma', 'Z = mu / sigma'], correctIndex: 1, explanation: 'Z = (X - mu) / sigma cho ra Normal(0, 1).' },
  { id: 'q2', question: 'The 68-95-99.7 rule says about 95% of values fall within?|||Quy tắc 68-95-99.7 nói khoảng 95% giá trị nằm trong?', options: ['1 sigma', '2 sigma', '3 sigma', 'the mean exactly|||đúng trung bình'], correctIndex: 1, explanation: 'Khoảng 95% nằm trong 2 sigma quanh trung bình.' },
  { id: 'q3', question: 'Which continuous distribution is memoryless?|||Phân phối liên tục nào là không nhớ (memoryless)?', options: ['Uniform|||Đều', 'Normal|||Chuẩn', 'Exponential|||Mũ', 'Binomial|||Nhị thức'], correctIndex: 2, explanation: 'Phân phối Mũ (Exponential) có tính không nhớ; Nhị thức còn không phải phân phối liên tục.' },
]);

const c8 = doc('ipy111-8-1-limit-theorems', '8.1 — Limit theorems & applications|||8.1 — Định lý giới hạn & ứng dụng',
  'Luật số lớn (LLN); định lý giới hạn trung tâm (CLT); ước lượng; ứng dụng trong khoa học máy tính & học máy.',
  [[
    `<span class="eyebrow">IPY111 · Chapter 8 · Lesson 8.1</span>
<h2>Limit theorems &amp; applications</h2>
<h3>What happens as n grows</h3>
<p>Two theorems explain why averaging over many samples works — and why the Normal curve is so common.</p>
<pre><code>Law of Large Numbers (LLN):
  as n -&gt; infinity, the sample mean -&gt; the true mean mu
  (more data =&gt; the average settles down)

Central Limit Theorem (CLT):
  the sum or mean of many independent RVs is
  approximately Normal, regardless of their own shape
  sample mean  ~  Normal(mu, sigma^2 / n)</code></pre>
<h3>Worked example</h3>
<pre><code>Average n = 100 dice rolls (single die: mu = 3.5, sigma &asymp; 1.71).
  By CLT the average is approx Normal with
    mean   = 3.5
    stddev = 1.71 / sqrt(100) = 0.171
  So the sample average is very likely within ~0.34 of 3.5.</code></pre>
<h3>Where CS &amp; ML use this</h3>
<ul>
<li><strong>Monte Carlo</strong> — estimate hard quantities by random sampling (LLN guarantees convergence).</li>
<li><strong>A/B testing &amp; confidence intervals</strong> — the CLT justifies the Normal-based margins.</li>
<li><strong>Naive Bayes &amp; probabilistic models</strong> — classification built directly on Bayes and distributions.</li>
</ul>
<div class="callout"><span class="badge">The big payoff</span> LLN says averages converge; CLT says how fast and to what shape. Together they turn raw randomness into reliable estimates — the foundation of data science.</div>`,
    `<span class="eyebrow">IPY111 · Chương 8 · Bài 8.1</span>
<h2>Định lý giới hạn &amp; ứng dụng</h2>
<h3>Điều gì xảy ra khi n lớn dần</h3>
<p>Hai định lý giải thích vì sao lấy trung bình trên nhiều mẫu lại hiệu quả — và vì sao đường cong Chuẩn phổ biến đến vậy.</p>
<pre><code>Luật số lớn (LLN):
  khi n -&gt; vô cực, trung bình mẫu -&gt; trung bình thật mu
  (càng nhiều dữ liệu =&gt; trung bình càng ổn định)

Định lý giới hạn trung tâm (CLT):
  tổng hoặc trung bình của nhiều RV độc lập là
  xấp xỉ Chuẩn, bất kể dạng phân phối gốc của chúng
  trung bình mẫu  ~  Normal(mu, sigma^2 / n)</code></pre>
<h3>Ví dụ giải</h3>
<pre><code>Trung bình n = 100 lần gieo xúc xắc (một xúc xắc: mu = 3.5, sigma &asymp; 1.71).
  Theo CLT, trung bình xấp xỉ Chuẩn với
    trung bình = 3.5
    độ lệch chuẩn = 1.71 / sqrt(100) = 0.171
  Vậy trung bình mẫu rất khả dĩ nằm trong ~0.34 quanh 3.5.</code></pre>
<h3>Khoa học máy tính &amp; học máy dùng ở đâu</h3>
<ul>
<li><strong>Monte Carlo</strong> — ước lượng đại lượng khó bằng lấy mẫu ngẫu nhiên (LLN bảo đảm hội tụ).</li>
<li><strong>Kiểm định A/B &amp; khoảng tin cậy</strong> — CLT biện minh cho biên độ dựa trên phân phối Chuẩn.</li>
<li><strong>Naive Bayes &amp; mô hình xác suất</strong> — phân loại xây trực tiếp trên Bayes và các phân phối.</li>
</ul>
<div class="callout"><span class="badge">Phần thưởng lớn</span> LLN nói trung bình hội tụ; CLT nói nhanh cỡ nào và về dạng gì. Cùng nhau, chúng biến sự ngẫu nhiên thô thành ước lượng đáng tin — nền tảng của khoa học dữ liệu.</div>`,
  ]]);

const c8q = quiz('ipy111-quiz-8', 'Quiz 8 — Limit theorems & applications|||Quiz 8 — Định lý giới hạn & ứng dụng', [
  { id: 'q1', question: 'The Law of Large Numbers says the sample mean?|||Luật số lớn nói trung bình mẫu?', options: ['stays random forever|||mãi ngẫu nhiên', 'approaches the true mean as n grows|||tiến tới trung bình thật khi n lớn', 'equals the variance|||bằng phương sai', 'is always Normal|||luôn là Chuẩn'], correctIndex: 1, explanation: 'LLN: khi n → vô cực, trung bình mẫu hội tụ về trung bình thật mu.' },
  { id: 'q2', question: 'The Central Limit Theorem says the mean of many independent RVs is approximately?|||Định lý giới hạn trung tâm nói trung bình của nhiều RV độc lập xấp xỉ?', options: ['Uniform|||Đều', 'Poisson', 'Normal|||Chuẩn', 'Geometric|||Hình học'], correctIndex: 2, explanation: 'CLT: tổng/trung bình của nhiều RV độc lập xấp xỉ phân phối Chuẩn, bất kể dạng gốc.' },
  { id: 'q3', question: 'Estimating a quantity by random sampling is called?|||Ước lượng một đại lượng bằng lấy mẫu ngẫu nhiên gọi là?', options: ['Bayes rule|||quy tắc Bayes', 'Monte Carlo', 'a permutation|||một hoán vị', 'standardization|||chuẩn hóa'], correctIndex: 1, explanation: 'Phương pháp Monte Carlo — dựa vào LLN để hội tụ về giá trị thật.' },
]);

const taiLieu = doc('ipy111-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Blitzstein & Hwang, Ross), khoá học miễn phí (Harvard Stat110, MIT 6.041, Khan Academy), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">IPY111 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Introduction to Probability — sample spaces, Bayes, random variables, distributions and limit theorems — in one place. The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources built on world-class courses.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IPY111 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="http://probabilitybook.net/" target="_blank" rel="noopener"><em>Introduction to Probability</em> — Blitzstein &amp; Hwang (free PDF + Harvard Stat110)</a></li>
<li><a href="https://en.wikipedia.org/wiki/A_First_Course_in_Probability" target="_blank" rel="noopener"><em>A First Course in Probability</em> — Sheldon Ross</a></li>
</ul>
<h3>🌐 Free courses &amp; documentation</h3>
<ul>
<li><a href="https://projects.iq.harvard.edu/stat110/home" target="_blank" rel="noopener">Harvard Stat 110 — Probability (full course + videos)</a></li>
<li><a href="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/" target="_blank" rel="noopener">MIT 6.041 — Probabilistic Systems Analysis (OCW)</a></li>
<li><a href="https://www.khanacademy.org/math/statistics-probability" target="_blank" rel="noopener">Khan Academy — Statistics &amp; Probability</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — probability explained visually (binomial, Bayes, CLT)</li>
<li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — full lecture playlist</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://seeing-theory.brown.edu/" target="_blank" rel="noopener">Seeing Theory</a> — a visual, interactive introduction to probability</li>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — plot PDFs/CDFs and explore distributions</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — simulate with Python (numpy random) to check your maths</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — sample spaces, axioms, counting, conditional probability and Bayes.</li>
<li><strong>Practice</strong> — solve dice/card problems and simulate them in Python until the count matches the theory.</li>
<li><strong>Go deeper</strong> — random variables, PMF/PDF/CDF, expectation &amp; variance, the key distributions.</li>
<li><strong>Job-ready</strong> — apply the CLT, confidence intervals and Bayes to A/B tests, Monte Carlo and ML.</li>
</ol></div>`,
    `<span class="eyebrow">IPY111 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Nhập môn Xác suất — không gian mẫu, Bayes, biến ngẫu nhiên, các phân phối và định lý giới hạn — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, dựa trên các khoá học hàng đầu thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IPY111 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="http://probabilitybook.net/" target="_blank" rel="noopener"><em>Introduction to Probability</em> — Blitzstein &amp; Hwang (PDF miễn phí + Harvard Stat110)</a></li>
<li><a href="https://en.wikipedia.org/wiki/A_First_Course_in_Probability" target="_blank" rel="noopener"><em>A First Course in Probability</em> — Sheldon Ross</a></li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://projects.iq.harvard.edu/stat110/home" target="_blank" rel="noopener">Harvard Stat 110 — Probability (khoá đầy đủ + video)</a></li>
<li><a href="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/" target="_blank" rel="noopener">MIT 6.041 — Probabilistic Systems Analysis (OCW)</a></li>
<li><a href="https://www.khanacademy.org/math/statistics-probability" target="_blank" rel="noopener">Khan Academy — Thống kê &amp; Xác suất</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — xác suất giảng bằng hình ảnh (nhị thức, Bayes, CLT)</li>
<li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — playlist bài giảng đầy đủ</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://seeing-theory.brown.edu/" target="_blank" rel="noopener">Seeing Theory</a> — nhập môn xác suất trực quan, tương tác</li>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — vẽ PDF/CDF và khám phá các phân phối</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — mô phỏng bằng Python (numpy random) để kiểm lại phép tính</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — không gian mẫu, tiên đề, phép đếm, xác suất có điều kiện và Bayes.</li>
<li><strong>Luyện tập</strong> — giải bài xúc xắc/quân bài và mô phỏng bằng Python đến khi đếm khớp lý thuyết.</li>
<li><strong>Đào sâu</strong> — biến ngẫu nhiên, PMF/PDF/CDF, kỳ vọng &amp; phương sai, các phân phối quan trọng.</li>
<li><strong>Sẵn sàng đi làm</strong> — dùng CLT, khoảng tin cậy và Bayes cho kiểm định A/B, Monte Carlo và học máy.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'IPY111',
    slug: 'ipy111-introduction-to-probability',
    title: 'Introduction to Probability',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IPY111.webp',
    shortDescription: 'Probability from the ground up — sample spaces & events, conditional probability & Bayes, discrete & continuous random variables, key distributions (Binomial, Poisson, Normal) & limit theorems (LLN, CLT). Bilingual, with worked examples & quizzes.|||Xác suất từ gốc — không gian mẫu & biến cố, xác suất có điều kiện & Bayes, biến ngẫu nhiên rời rạc & liên tục, phân phối quan trọng (Nhị thức, Poisson, Chuẩn) & định lý giới hạn (LLN, CLT). Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>IPY111 — Introduction to Probability</strong> (Nhập môn Xác suất, ngành Khoa học Máy tính, kỳ 1) là <strong>toán học của sự bất định</strong> — nền của thống kê, học máy và khoa học máy tính. Từ <strong>không gian mẫu &amp; biến cố</strong> (tiên đề, phép đếm) → <strong>xác suất có điều kiện &amp; định lý Bayes</strong> → <strong>biến ngẫu nhiên rời rạc</strong> (PMF, kỳ vọng, phương sai) → <strong>phân phối rời rạc</strong> (Bernoulli, Nhị thức, Poisson, Hình học) → <strong>biến ngẫu nhiên liên tục</strong> (PDF, CDF) → <strong>phân phối liên tục</strong> (Đều, Mũ, Chuẩn) → <strong>định lý giới hạn</strong> (LLN, CLT) &amp; ứng dụng trong CS/ML. Bám giáo trình chuẩn quốc tế (Blitzstein &amp; Hwang, Ross), song ngữ, có ví dụ giải và quiz mỗi chương.',
    whatYouLearn: 'Không gian mẫu, biến cố &amp; tiên đề xác suất; phép đếm (hoán vị, tổ hợp); xác suất có điều kiện, quy tắc nhân &amp; độc lập; định lý Bayes &amp; xác suất toàn phần; biến ngẫu nhiên rời rạc (PMF, E[X], phương sai); các phân phối rời rạc (Bernoulli, Nhị thức, Poisson, Hình học); biến ngẫu nhiên liên tục (PDF, CDF); các phân phối liên tục (Đều, Mũ, Chuẩn) &amp; chuẩn hóa Z; luật số lớn &amp; định lý giới hạn trung tâm; ứng dụng trong CS/ML (Monte Carlo, kiểm định A/B, Naive Bayes).',
    requirements: 'Toán phổ thông (đại số, tập hợp, tổng &amp; tích phân cơ bản). Không cần kiến thức lập trình; biết Python là một lợi thế để mô phỏng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, khoá học miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Xác suất là gì, vì sao quan trọng với CS.', lessons: [intro] },
    { title: 'Chương 1 — Không gian mẫu & biến cố|||Chapter 1 — Sample space & events', description: 'Phép thử, tiên đề, phép đếm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Xác suất có điều kiện|||Chapter 2 — Conditional probability', description: 'P(A|B), quy tắc nhân, độc lập.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Định lý Bayes|||Chapter 3 — Bayes theorem', description: 'Xác suất toàn phần, Bayes, dương tính giả.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Biến ngẫu nhiên rời rạc|||Chapter 4 — Discrete random variables', description: 'PMF, kỳ vọng, phương sai.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân phối rời rạc|||Chapter 5 — Discrete distributions', description: 'Bernoulli, Nhị thức, Poisson, Hình học.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Biến ngẫu nhiên liên tục|||Chapter 6 — Continuous random variables', description: 'PDF, CDF, kỳ vọng bằng tích phân.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phân phối liên tục|||Chapter 7 — Continuous distributions', description: 'Đều, Mũ, Chuẩn, chuẩn hóa Z.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Định lý giới hạn & ứng dụng|||Chapter 8 — Limit theorems & applications', description: 'LLN, CLT, ước lượng, CS/ML.', lessons: [c8, c8q] },
  ],
};
