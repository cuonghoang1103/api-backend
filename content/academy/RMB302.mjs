/**
 * RMB302 — Research Methods & Quantitative Analysis. Giáo trình tham khảo:
 * "Business Research Methods" (Zikmund/Babin), "Statistics for Business and
 * Economics" (Anderson/Sweeney), "Discovering Statistics Using SPSS" (Field).
 * Nhấn PHÂN TÍCH ĐỊNH LƯỢNG & thống kê ứng dụng kinh doanh (SPSS/Excel, kiểm
 * định giả thuyết, hồi quy) — khác REM301 (research methods tổng quát) và
 * RMC301 (research in communication). Song ngữ. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${ trong nội dung.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('rmb302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Zikmund/Babin, Anderson/Sweeney, Field), tài liệu SPSS/Excel chính thức miễn phí, YouTube, công cụ thống kê, lộ trình tự học.',
  [[
    `<span class="eyebrow">RMB302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn quantitative business research — from descriptive statistics to hypothesis testing and regression, run in SPSS/Excel — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks (cited, not uploaded)</h3>
<ul>
<li><em>Business Research Methods</em> — Zikmund &amp; Babin. The research-process backbone: problem definition, design, sampling, ethics.</li>
<li><em>Statistics for Business and Economics</em> — Anderson, Sweeney, Williams. The statistical core: probability, estimation, hypothesis tests, regression.</li>
<li><em>Discovering Statistics Using SPSS</em> — Andy Field. How to actually run and read the tests in SPSS, with plain-English interpretation.</li>
</ul>
<h3>📗 Official slides &amp; syllabus</h3>
<p>The official FPTU giáo trình &amp; lecture slides for RMB302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Free documentation &amp; software</h3>
<ul>
<li><a href="https://www.ibm.com/products/spss-statistics/documentation" target="_blank" rel="noopener">IBM SPSS Statistics documentation</a> — official manuals for every test covered in this course.</li>
<li><a href="https://support.microsoft.com/en-us/office/use-the-analysis-toolpak-to-perform-complex-data-analysis-6c67ccf0-f4a9-487c-8dec-bdb5a2cefab6" target="_blank" rel="noopener">Excel Analysis ToolPak</a> — t-tests, ANOVA and regression without SPSS.</li>
<li><a href="https://www.statmethods.net/" target="_blank" rel="noopener">Quick-R (statmethods.net)</a> — the same statistical concepts explained language-agnostically.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BozemanScience" target="_blank" rel="noopener">Bozeman Science — Statistics playlist</a> — short, clear stats fundamentals.</li>
<li><a href="https://www.youtube.com/@ ANOVAstats" target="_blank" rel="noopener">Search "SPSS regression tutorial"</a> — many free step-by-step SPSS walkthroughs matching this course's tests.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.jamovi.org/" target="_blank" rel="noopener">jamovi</a> — free, open-source, SPSS-like interface; same output tables to practice reading.</li>
<li><a href="https://docs.google.com/spreadsheets/" target="_blank" rel="noopener">Google Sheets</a> — built-in descriptive stats and charts for quick practice.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — variables, scales, descriptive statistics, the normal distribution.</li>
<li><strong>Inference</strong> — confidence intervals, hypothesis testing (t-test, ANOVA), reading a p-value correctly.</li>
<li><strong>Relationships</strong> — correlation, simple &amp; multiple regression, checking model assumptions.</li>
<li><strong>Job-ready</strong> — run the same tests in SPSS/Excel on a real dataset and write the result as a business recommendation.</li>
</ol></div>`,
    `<span class="eyebrow">RMB302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học nghiên cứu định lượng trong kinh doanh — từ thống kê mô tả đến kiểm định giả thuyết và hồi quy, chạy trên SPSS/Excel — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình (trích dẫn, KHÔNG upload)</h3>
<ul>
<li><em>Business Research Methods</em> — Zikmund &amp; Babin. Khung quy trình nghiên cứu: xác định vấn đề, thiết kế, chọn mẫu, đạo đức nghiên cứu.</li>
<li><em>Statistics for Business and Economics</em> — Anderson, Sweeney, Williams. Lõi thống kê: xác suất, ước lượng, kiểm định giả thuyết, hồi quy.</li>
<li><em>Discovering Statistics Using SPSS</em> — Andy Field. Cách chạy và đọc từng kiểm định trong SPSS, diễn giải bằng ngôn ngữ dễ hiểu.</li>
</ul>
<h3>📗 Slide &amp; giáo trình chính thức</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của RMB302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Tài liệu &amp; phần mềm miễn phí</h3>
<ul>
<li><a href="https://www.ibm.com/products/spss-statistics/documentation" target="_blank" rel="noopener">Tài liệu chính thức IBM SPSS Statistics</a> — sổ tay cho mọi kiểm định trong môn.</li>
<li><a href="https://support.microsoft.com/en-us/office/use-the-analysis-toolpak-to-perform-complex-data-analysis-6c67ccf0-f4a9-487c-8dec-bdb5a2cefab6" target="_blank" rel="noopener">Excel Analysis ToolPak</a> — t-test, ANOVA và hồi quy không cần SPSS.</li>
<li><a href="https://www.statmethods.net/" target="_blank" rel="noopener">Quick-R (statmethods.net)</a> — cùng khái niệm thống kê, giải thích không lệ thuộc phần mềm.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BozemanScience" target="_blank" rel="noopener">Bozeman Science — playlist Statistics</a> — thống kê nền tảng, ngắn và rõ.</li>
<li>Tìm "SPSS regression tutorial" — nhiều video hướng dẫn SPSS từng bước, đúng các kiểm định trong môn này.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.jamovi.org/" target="_blank" rel="noopener">jamovi</a> — miễn phí, mã nguồn mở, giao diện giống SPSS; cùng bảng kết quả để luyện đọc.</li>
<li><a href="https://docs.google.com/spreadsheets/" target="_blank" rel="noopener">Google Sheets</a> — thống kê mô tả &amp; biểu đồ sẵn có để luyện nhanh.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — biến, thang đo, thống kê mô tả, phân phối chuẩn.</li>
<li><strong>Suy diễn</strong> — khoảng tin cậy, kiểm định giả thuyết (t-test, ANOVA), đọc đúng p-value.</li>
<li><strong>Quan hệ giữa biến</strong> — tương quan, hồi quy đơn &amp; đa biến, kiểm tra giả định mô hình.</li>
<li><strong>Sẵn sàng đi làm</strong> — chạy cùng các kiểm định trên dữ liệu thật bằng SPSS/Excel và viết kết quả thành đề xuất kinh doanh.</li>
</ol></div>`,
  ]]);

const intro = doc('rmb302-0-1-overview', 'Course overview: Research Methods & Quantitative Analysis|||Tổng quan: Phương pháp nghiên cứu & phân tích định lượng',
  'Vì sao học phân tích định lượng; khác REM301/RMC301; lộ trình 8 chương từ quy trình nghiên cứu đến SPSS/Excel.',
  [[
    `<span class="eyebrow">RMB302 · Lesson 0.1 · Overview</span>
<h2>Research Methods &amp; Quantitative Analysis</h2>
<p class="lead">Business decisions run on data — should we launch this product, does the new store layout raise sales, does the ad campaign actually change intent to buy? This course builds the skill to answer those questions with <strong>numbers you can defend</strong>: designing a study, collecting the right data, and running the right statistical test in <strong>SPSS or Excel</strong>.</p>
<h3>How this differs from REM301 &amp; RMC301</h3>
<ul>
<li><strong>REM301</strong> covers research methods broadly — problem framing, qualitative &amp; quantitative design, ethics — without going deep into the maths.</li>
<li><strong>RMC301</strong> applies research methods specifically to communication studies.</li>
<li><strong>RMB302</strong> assumes you already know what a research question looks like and goes deep on <strong>quantitative analysis</strong>: descriptive statistics, probability, hypothesis testing, and regression — run and interpreted in a real statistics package.</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Overview of quantitative research &amp; the research process</li>
<li>Variables, scales of measurement &amp; descriptive statistics</li>
<li>Probability &amp; sampling distributions</li>
<li>Estimation &amp; confidence intervals</li>
<li>Hypothesis testing (t-test, ANOVA)</li>
<li>Correlation &amp; simple linear regression</li>
<li>Multiple regression &amp; model testing</li>
<li>Data analysis with SPSS/Excel &amp; interpreting results for business decisions</li>
</ol>
<div class="callout"><span class="badge">Why it matters</span> Every marketing test, HR survey, and finance forecast at some point becomes a spreadsheet of numbers someone has to read correctly. This course is that reading skill.</div>`,
    `<span class="eyebrow">RMB302 · Bài 0.1 · Tổng quan</span>
<h2>Phương pháp nghiên cứu &amp; phân tích định lượng</h2>
<p class="lead">Quyết định kinh doanh chạy trên dữ liệu — có nên ra mắt sản phẩm này, cách bày cửa hàng mới có tăng doanh số không, chiến dịch quảng cáo có thật sự đổi ý định mua không? Môn này xây kỹ năng trả lời những câu hỏi đó bằng <strong>số liệu bạn bảo vệ được</strong>: thiết kế một nghiên cứu, thu đúng dữ liệu, và chạy đúng kiểm định thống kê trong <strong>SPSS hoặc Excel</strong>.</p>
<h3>Khác REM301 &amp; RMC301 thế nào</h3>
<ul>
<li><strong>REM301</strong> bao quát phương pháp nghiên cứu nói chung — đặt vấn đề, thiết kế định tính &amp; định lượng, đạo đức nghiên cứu — không đi sâu vào tính toán.</li>
<li><strong>RMC301</strong> áp dụng phương pháp nghiên cứu riêng cho ngành truyền thông.</li>
<li><strong>RMB302</strong> giả định bạn đã biết câu hỏi nghiên cứu trông thế nào, và đi sâu vào <strong>phân tích định lượng</strong>: thống kê mô tả, xác suất, kiểm định giả thuyết, hồi quy — chạy và diễn giải trên một phần mềm thống kê thật.</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Tổng quan nghiên cứu định lượng &amp; quy trình nghiên cứu</li>
<li>Biến, thang đo &amp; thống kê mô tả</li>
<li>Xác suất &amp; phân phối mẫu</li>
<li>Ước lượng &amp; khoảng tin cậy</li>
<li>Kiểm định giả thuyết (t-test, ANOVA)</li>
<li>Tương quan &amp; hồi quy tuyến tính</li>
<li>Hồi quy bội &amp; kiểm định mô hình</li>
<li>Phân tích dữ liệu với SPSS/Excel &amp; diễn giải kết quả cho quyết định kinh doanh</li>
</ol>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mọi thử nghiệm marketing, khảo sát nhân sự, dự báo tài chính — đến một lúc nào đó đều trở thành một bảng số mà ai đó phải đọc đúng. Môn này chính là kỹ năng đọc đó.</div>`,
  ]]);

const c1 = doc('rmb302-1-1-process', '1.1 — The quantitative research process|||1.1 — Quy trình nghiên cứu định lượng',
  'Nghiên cứu định lượng vs định tính; quy trình 7 bước (Zikmund/Babin): xác định vấn đề → tổng quan → giả thuyết → thiết kế → chọn mẫu → thu thập → phân tích & báo cáo.',
  [[
    `<span class="eyebrow">RMB302 · Chapter 1 · Lesson 1.1</span>
<h2>The quantitative research process</h2>
<h3>Quantitative vs. qualitative</h3>
<p><strong>Quantitative research</strong> measures variables numerically and tests hypotheses with statistics — it asks "how much" and "is the difference real". <strong>Qualitative research</strong> explores meaning through words (interviews, focus groups) — it asks "why". This course focuses on the quantitative side: numbers, tests, and confidence in a conclusion.</p>
<h3>The business research process (Zikmund &amp; Babin)</h3>
<pre><code>1. Define the problem       - what business question needs answering?
2. Review the literature     - what is already known?
3. State hypotheses           - the testable prediction
4. Choose research design    - survey, experiment, secondary data
5. Determine sample & data    - who/what, how many, how collected
6. Collect & analyze data    - the statistics part of this course
7. Report & recommend        - translate results into a decision
</code></pre>
<h3>A hypothesis is a testable claim</h3>
<p>Example: "Customers exposed to the new loyalty program spend more per month than customers who are not." Notice it names two groups and a measurable outcome — that is what makes it <em>testable</em> with the tools in Chapters 4-7.</p>
<div class="callout"><span class="badge">Garbage in, garbage out</span> No statistical test can fix a badly defined problem or a biased sample. The analysis chapters assume Step 1-5 were done right.</div>`,
    `<span class="eyebrow">RMB302 · Chương 1 · Bài 1.1</span>
<h2>Quy trình nghiên cứu định lượng</h2>
<h3>Định lượng vs. định tính</h3>
<p><strong>Nghiên cứu định lượng</strong> đo biến bằng số và kiểm định giả thuyết bằng thống kê — hỏi "bao nhiêu" và "sự khác biệt đó có thật không". <strong>Nghiên cứu định tính</strong> khám phá ý nghĩa qua lời nói (phỏng vấn, nhóm tập trung) — hỏi "vì sao". Môn này tập trung vào hướng định lượng: số liệu, kiểm định, và độ tin cậy của một kết luận.</p>
<h3>Quy trình nghiên cứu kinh doanh (Zikmund &amp; Babin)</h3>
<pre><code>1. Xác định vấn đề         - câu hỏi kinh doanh cần trả lời là gì?
2. Tổng quan tài liệu        - đã biết được gì rồi?
3. Nêu giả thuyết            - dự đoán có thể kiểm định
4. Chọn thiết kế nghiên cứu  - khảo sát, thực nghiệm, dữ liệu thứ cấp
5. Xác định mẫu & dữ liệu    - ai/cái gì, bao nhiêu, thu thế nào
6. Thu thập & phân tích      - phần thống kê của môn này
7. Báo cáo & đề xuất         - biến kết quả thành quyết định</code></pre>
<h3>Giả thuyết là một khẳng định kiểm định được</h3>
<p>Ví dụ: "Khách hàng dùng chương trình khách hàng thân thiết mới chi tiêu nhiều hơn mỗi tháng so với khách hàng không dùng." Chú ý nó nêu rõ hai nhóm và một kết quả đo được — đó là điều làm nó <em>kiểm định được</em> bằng công cụ ở Chương 4-7.</p>
<div class="callout"><span class="badge">Đầu vào rác, đầu ra rác</span> Không kiểm định thống kê nào cứu được một vấn đề đặt sai hoặc một mẫu bị lệch. Các chương phân tích giả định Bước 1-5 đã làm đúng.</div>`,
  ]]);

const c1q = quiz('rmb302-quiz-1', 'Quiz 1 — Research process|||Quiz 1 — Quy trình nghiên cứu', [
  { id: 'q1', question: 'Nghiên cứu định lượng chủ yếu trả lời câu hỏi nào?', options: ['Vì sao khách hàng cảm thấy vậy', 'Bao nhiêu / sự khác biệt có thật không', 'Câu chuyện của khách hàng là gì', 'Thương hiệu có ý nghĩa gì với họ'], correctIndex: 1, explanation: 'Định lượng đo bằng số và kiểm định thống kê — trả lời "bao nhiêu", "có khác biệt thật không".' },
  { id: 'q2', question: 'Trong quy trình 7 bước, bước NÀO diễn ra TRƯỚC khi chọn thiết kế nghiên cứu?', options: ['Thu thập dữ liệu', 'Nêu giả thuyết', 'Báo cáo kết quả', 'Chạy kiểm định thống kê'], correctIndex: 1, explanation: 'Thứ tự: xác định vấn đề → tổng quan → nêu giả thuyết → CHỌN THIẾT KẾ → chọn mẫu → thu thập & phân tích → báo cáo.' },
  { id: 'q3', question: 'Vì sao một kiểm định thống kê đúng vẫn có thể cho kết luận sai?', options: ['Vì thống kê luôn sai', 'Vì mẫu hoặc vấn đề nghiên cứu bị đặt sai từ đầu', 'Vì SPSS tính toán không chính xác', 'Vì p-value luôn bằng 0'], correctIndex: 1, explanation: '"Garbage in, garbage out": phép tính đúng không cứu được một mẫu lệch hoặc vấn đề đặt sai.' },
]);

const c2 = doc('rmb302-2-1-variables-scales', '2.1 — Variables, measurement scales & descriptive statistics|||2.1 — Biến, thang đo & thống kê mô tả',
  'Biến độc lập/phụ thuộc; 4 thang đo (nominal, ordinal, interval, ratio); thống kê mô tả: mean, median, mode, variance, độ lệch chuẩn.',
  [[
    `<span class="eyebrow">RMB302 · Chapter 2 · Lesson 2.1</span>
<h2>Variables, scales &amp; descriptive statistics</h2>
<h3>Types of variables</h3>
<ul>
<li><strong>Independent variable</strong> — what you manipulate or believe causes change (e.g. price, ad exposure).</li>
<li><strong>Dependent variable</strong> — what you measure as the outcome (e.g. sales, purchase intent).</li>
<li><strong>Moderating variable</strong> — changes the strength of that relationship (e.g. age group).</li>
</ul>
<h3>Four scales of measurement</h3>
<pre><code>Nominal  - categories, no order        (gender, brand name)
Ordinal  - ordered, gaps not equal     (satisfaction: low/med/high)
Interval - equal gaps, no true zero    (temperature in Celsius)
Ratio    - equal gaps, true zero       (revenue, age, units sold)
</code></pre>
<p>The scale determines which statistics and tests are even valid — you cannot average a nominal variable (brand names have no numeric meaning), but you can average a ratio variable.</p>
<h3>Descriptive statistics</h3>
<pre><code>Mean   = Σx / n                (average)
Median = middle value when sorted
Mode   = most frequent value
Variance  s² = Σ(x - mean)² / (n-1)
Std. dev  s  = √variance
</code></pre>
<p>Mean is pulled by outliers; median is not. A large standard deviation means responses are spread out — a small one means they cluster near the mean.</p>
<div class="callout"><span class="badge">Worked example</span> Monthly spend of 5 customers: 100, 120, 110, 130, 5000. Mean ≈ 1092 (dragged up by the outlier); median = 120 — a far more honest "typical" figure here.</div>`,
    `<span class="eyebrow">RMB302 · Chương 2 · Bài 2.1</span>
<h2>Biến, thang đo &amp; thống kê mô tả</h2>
<h3>Các loại biến</h3>
<ul>
<li><strong>Biến độc lập</strong> — thứ bạn thay đổi hoặc tin là nguyên nhân (giá, mức tiếp xúc quảng cáo).</li>
<li><strong>Biến phụ thuộc</strong> — thứ bạn đo là kết quả (doanh số, ý định mua).</li>
<li><strong>Biến điều tiết (moderating)</strong> — làm thay đổi độ mạnh của quan hệ đó (nhóm tuổi).</li>
</ul>
<h3>Bốn thang đo</h3>
<pre><code>Định danh (nominal) - phân loại, không thứ tự    (giới tính, tên hãng)
Thứ bậc (ordinal)   - có thứ tự, khoảng cách không đều (mức hài lòng: thấp/vừa/cao)
Khoảng (interval)   - khoảng cách đều, không có 0 tuyệt đối (nhiệt độ °C)
Tỉ lệ (ratio)       - khoảng cách đều, có 0 tuyệt đối     (doanh thu, tuổi, số lượng)</code></pre>
<p>Thang đo quyết định phép thống kê nào hợp lệ — bạn không thể tính trung bình một biến định danh (tên hãng không có nghĩa số), nhưng tính được với biến tỉ lệ.</p>
<h3>Thống kê mô tả</h3>
<pre><code>Trung bình (mean) = Σx / n
Trung vị (median) = giá trị giữa khi sắp xếp
Mode (yếu vị)     = giá trị xuất hiện nhiều nhất
Phương sai  s² = Σ(x - mean)² / (n-1)
Độ lệch chuẩn s = √phương sai</code></pre>
<p>Mean bị kéo lệch bởi giá trị ngoại lai; median thì không. Độ lệch chuẩn lớn nghĩa là dữ liệu phân tán rộng; nhỏ nghĩa là dữ liệu tụ gần trung bình.</p>
<div class="callout"><span class="badge">Ví dụ tính</span> Chi tiêu tháng của 5 khách: 100, 120, 110, 130, 5000. Mean ≈ 1092 (bị kéo lên bởi giá trị ngoại lai); median = 120 — con số "điển hình" trung thực hơn nhiều ở đây.</div>`,
  ]]);

const c2q = quiz('rmb302-quiz-2', 'Quiz 2 — Variables & descriptives|||Quiz 2 — Biến & thống kê mô tả', [
  { id: 'q1', question: 'Thang đo nào có khoảng cách đều VÀ có điểm 0 tuyệt đối?', options: ['Nominal', 'Ordinal', 'Interval', 'Ratio'], correctIndex: 3, explanation: 'Ratio (tỉ lệ) có cả khoảng cách đều và 0 tuyệt đối, ví dụ doanh thu, số lượng.' },
  { id: 'q2', question: 'Vì sao median là con số "điển hình" tốt hơn mean khi dữ liệu có giá trị ngoại lai?', options: ['Median luôn lớn hơn mean', 'Median không bị kéo lệch bởi giá trị quá lớn/nhỏ', 'Median tính bằng phương sai', 'Median chỉ dùng cho biến định danh'], correctIndex: 1, explanation: 'Mean bị kéo theo outlier; median là giá trị giữa nên ổn định hơn trước outlier.' },
  { id: 'q3', question: 'Độ lệch chuẩn (standard deviation) đo điều gì?', options: ['Giá trị trung tâm của dữ liệu', 'Mức độ phân tán của dữ liệu quanh trung bình', 'Số lượng quan sát', 'Thứ tự các nhóm'], correctIndex: 1, explanation: 'Độ lệch chuẩn là căn bậc hai của phương sai — đo dữ liệu phân tán bao xa quanh mean.' },
]);

const c3 = doc('rmb302-3-1-probability-sampling', '3.1 — Probability & sampling distributions|||3.1 — Xác suất & phân phối mẫu',
  'Quy tắc xác suất cơ bản; phân phối chuẩn; Định lý giới hạn trung tâm (CLT); phân phối mẫu của trung bình & sai số chuẩn (SE).',
  [[
    `<span class="eyebrow">RMB302 · Chapter 3 · Lesson 3.1</span>
<h2>Probability &amp; sampling distributions</h2>
<h3>Why probability matters here</h3>
<p>Every hypothesis test in this course answers one question: <em>"how likely is this sample result if there is really no effect?"</em> That question is a probability question — so before testing anything, you need the normal distribution and the idea of a sampling distribution.</p>
<h3>The normal distribution</h3>
<p>A symmetric, bell-shaped distribution described by its mean (μ) and standard deviation (σ). Many business variables (heights, measurement errors, and — critically — sample means) are approximately normal.</p>
<pre><code>Empirical rule (normal distribution):
 ~68% of values fall within  μ ± 1σ
 ~95% of values fall within  μ ± 2σ
 ~99.7% of values fall within μ ± 3σ
</code></pre>
<h3>The Central Limit Theorem (CLT)</h3>
<p>Take repeated random samples of size n from ANY population and compute each sample's mean. The <strong>distribution of those sample means</strong> becomes approximately normal as n grows (rule of thumb: n ≥ 30) — even if the original population is not normal. This is the single most important fact enabling hypothesis testing.</p>
<pre><code>Standard error of the mean:  SE = s / √n
</code></pre>
<p>SE shrinks as sample size grows — bigger samples give more precise estimates of the population mean.</p>
<div class="callout"><span class="badge">Why this unlocks Chapter 4-5</span> Because sample means are approximately normally distributed (CLT), we can say exactly how far a sample mean is likely to fall from the true population mean — the basis of confidence intervals and hypothesis tests.</div>`,
    `<span class="eyebrow">RMB302 · Chương 3 · Bài 3.1</span>
<h2>Xác suất &amp; phân phối mẫu</h2>
<h3>Vì sao xác suất quan trọng ở đây</h3>
<p>Mọi kiểm định giả thuyết trong môn này trả lời đúng một câu: <em>"kết quả mẫu này có khả năng xảy ra bao nhiêu nếu thực ra KHÔNG có tác động gì?"</em> Đó là một câu hỏi xác suất — nên trước khi kiểm định gì, cần hiểu phân phối chuẩn và ý tưởng phân phối mẫu.</p>
<h3>Phân phối chuẩn</h3>
<p>Một phân phối hình chuông, đối xứng, mô tả bằng trung bình (μ) và độ lệch chuẩn (σ). Nhiều biến kinh doanh (chiều cao, sai số đo, và — quan trọng nhất — trung bình mẫu) xấp xỉ chuẩn.</p>
<pre><code>Quy tắc thực nghiệm (phân phối chuẩn):
 ~68% giá trị nằm trong  μ ± 1σ
 ~95% giá trị nằm trong  μ ± 2σ
 ~99.7% giá trị nằm trong μ ± 3σ</code></pre>
<h3>Định lý giới hạn trung tâm (CLT)</h3>
<p>Lấy nhiều mẫu ngẫu nhiên cỡ n từ BẤT KỲ tổng thể nào và tính trung bình mỗi mẫu. <strong>Phân phối của các trung bình mẫu đó</strong> tiến gần chuẩn khi n tăng (quy tắc: n ≥ 30) — dù tổng thể gốc không chuẩn. Đây là sự thật quan trọng nhất làm nên toàn bộ kiểm định giả thuyết.</p>
<pre><code>Sai số chuẩn của trung bình:  SE = s / √n</code></pre>
<p>SE nhỏ dần khi cỡ mẫu tăng — mẫu lớn hơn cho ước lượng trung bình tổng thể chính xác hơn.</p>
<div class="callout"><span class="badge">Vì sao đây mở khoá Chương 4-5</span> Vì trung bình mẫu xấp xỉ chuẩn (CLT), ta nói được chính xác trung bình mẫu có khả năng lệch bao xa so với trung bình tổng thể thật — nền của khoảng tin cậy và kiểm định giả thuyết.</div>`,
  ]]);

const c3q = quiz('rmb302-quiz-3', 'Quiz 3 — Probability & sampling|||Quiz 3 — Xác suất & phân phối mẫu', [
  { id: 'q1', question: 'Theo quy tắc thực nghiệm của phân phối chuẩn, khoảng μ ± 2σ chứa khoảng bao nhiêu % giá trị?', options: ['68%', '95%', '99.7%', '50%'], correctIndex: 1, explanation: 'μ ± 1σ ≈ 68%, μ ± 2σ ≈ 95%, μ ± 3σ ≈ 99.7%.' },
  { id: 'q2', question: 'Định lý giới hạn trung tâm (CLT) nói điều gì?', options: ['Tổng thể gốc luôn phải chuẩn', 'Phân phối trung bình mẫu tiến gần chuẩn khi n đủ lớn, dù tổng thể gốc không chuẩn', 'Mẫu nhỏ luôn chính xác hơn mẫu lớn', 'Sai số chuẩn không đổi theo cỡ mẫu'], correctIndex: 1, explanation: 'CLT: với n đủ lớn (thường ≥30), phân phối trung bình mẫu xấp xỉ chuẩn bất kể tổng thể gốc.' },
  { id: 'q3', question: 'Sai số chuẩn (SE = s/√n) thay đổi thế nào khi cỡ mẫu n tăng?', options: ['SE tăng lên', 'SE giảm xuống', 'SE không đổi', 'SE trở thành số âm'], correctIndex: 1, explanation: 'n tăng → √n tăng → SE = s/√n giảm, ước lượng chính xác hơn.' },
]);

const c4 = doc('rmb302-4-1-estimation-ci', '4.1 — Estimation & confidence intervals|||4.1 — Ước lượng & khoảng tin cậy',
  'Ước lượng điểm vs ước lượng khoảng; công thức khoảng tin cậy cho trung bình (z, t); sai số biên (margin of error); ý nghĩa mức tin cậy 95%.',
  [[
    `<span class="eyebrow">RMB302 · Chapter 4 · Lesson 4.1</span>
<h2>Estimation &amp; confidence intervals</h2>
<h3>Point estimate vs. interval estimate</h3>
<p>A <strong>point estimate</strong> is a single number (the sample mean x̄) used to estimate the population mean μ. It is almost certainly not exactly right. A <strong>confidence interval</strong> gives a range that is very likely to contain the true population value, plus a stated confidence level.</p>
<h3>Confidence interval for a mean</h3>
<pre><code>CI = x̄ ± (critical value) × SE
   = x̄ ± t(α/2, n-1) × (s / √n)      (use t when σ unknown, typical in practice)

Example: x̄ = 500,000 VND, s = 60,000, n = 36, 95% CI
 SE = 60,000 / √36 = 10,000
 t(0.025, 35) ≈ 2.03
 Margin of error = 2.03 × 10,000 ≈ 20,300
 95% CI ≈ 500,000 ± 20,300 → [479,700 ; 520,300]
</code></pre>
<h3>What "95% confidence" actually means</h3>
<p>It does <em>not</em> mean "95% chance the true mean is in this interval". It means: if we repeated this sampling process many times and built an interval each time, about 95% of those intervals would contain the true population mean. The interval you get is one draw from that process.</p>
<div class="callout"><span class="badge">Business use</span> "Average customer satisfaction is 4.2 ± 0.3 on a 5-point scale (95% CI)" is far more honest — and more useful for a go/no-go decision — than reporting 4.2 alone.</div>`,
    `<span class="eyebrow">RMB302 · Chương 4 · Bài 4.1</span>
<h2>Ước lượng &amp; khoảng tin cậy</h2>
<h3>Ước lượng điểm vs. ước lượng khoảng</h3>
<p><strong>Ước lượng điểm</strong> là một con số duy nhất (trung bình mẫu x̄) dùng để ước lượng trung bình tổng thể μ. Nó hầu như không bao giờ đúng chính xác. <strong>Khoảng tin cậy</strong> cho một khoảng rất có khả năng chứa giá trị tổng thể thật, kèm một mức độ tin cậy nêu rõ.</p>
<h3>Khoảng tin cậy cho trung bình</h3>
<pre><code>KTC = x̄ ± (giá trị tới hạn) × SE
    = x̄ ± t(α/2, n-1) × (s / √n)      (dùng t khi chưa biết σ, phổ biến trong thực tế)

Ví dụ: x̄ = 500.000 VND, s = 60.000, n = 36, độ tin cậy 95%
 SE = 60.000 / √36 = 10.000
 t(0.025, 35) ≈ 2.03
 Sai số biên = 2.03 × 10.000 ≈ 20.300
 KTC 95% ≈ 500.000 ± 20.300 → [479.700 ; 520.300]</code></pre>
<h3>"Tin cậy 95%" thực sự nghĩa là gì</h3>
<p>KHÔNG có nghĩa là "95% khả năng trung bình thật nằm trong khoảng này". Nó nghĩa là: nếu lặp lại việc lấy mẫu này nhiều lần và dựng một khoảng mỗi lần, khoảng 95% các khoảng đó sẽ chứa trung bình tổng thể thật. Khoảng bạn có là một lần rút từ quá trình đó.</p>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> "Mức hài lòng trung bình của khách hàng là 4.2 ± 0.3 trên thang 5 (KTC 95%)" trung thực hơn nhiều — và hữu ích hơn cho quyết định làm/không làm — so với chỉ báo 4.2 đơn thuần.</div>`,
  ]]);

const c4q = quiz('rmb302-quiz-4', 'Quiz 4 — Estimation & CI|||Quiz 4 — Ước lượng & khoảng tin cậy', [
  { id: 'q1', question: 'Khoảng tin cậy 95% cho trung bình có nghĩa chính xác là gì?', options: ['95% khả năng trung bình thật nằm trong khoảng vừa tính', 'Nếu lặp lại lấy mẫu nhiều lần, khoảng 95% các khoảng tính được sẽ chứa trung bình thật', 'Mẫu đúng 95% so với tổng thể', '95% dữ liệu nằm trong khoảng đó'], correctIndex: 1, explanation: 'Diễn giải đúng là về TẦN SUẤT của quy trình lấy mẫu lặp lại, không phải xác suất của một khoảng cụ thể.' },
  { id: 'q2', question: 'Nếu tăng cỡ mẫu n (giữ độ tin cậy không đổi), sai số biên (margin of error) sẽ?', options: ['Tăng lên', 'Giảm xuống', 'Không đổi', 'Trở thành số âm'], correctIndex: 1, explanation: 'SE = s/√n giảm khi n tăng → sai số biên = giá trị tới hạn × SE cũng giảm.' },
  { id: 'q3', question: 'Trong công thức khoảng tin cậy, khi nào dùng phân phối t thay vì z?', options: ['Khi biết chính xác độ lệch chuẩn tổng thể σ', 'Khi chưa biết σ và phải ước lượng bằng s của mẫu (trường hợp thường gặp)', 'Khi cỡ mẫu là số chẵn', 'Khi dữ liệu là định danh'], correctIndex: 1, explanation: 'Không biết σ tổng thể → dùng s mẫu và phân phối t (với n-1 bậc tự do); đây là trường hợp phổ biến trong thực tế.' },
]);

const c5 = doc('rmb302-5-1-hypothesis-testing', '5.1 — Hypothesis testing: t-test & ANOVA|||5.1 — Kiểm định giả thuyết: t-test & ANOVA',
  'H0/H1, sai lầm loại I/II, mức ý nghĩa α & p-value; one-sample/independent/paired t-test; one-way ANOVA khi so sánh ≥3 nhóm.',
  [[
    `<span class="eyebrow">RMB302 · Chapter 5 · Lesson 5.1</span>
<h2>Hypothesis testing: t-test &amp; ANOVA</h2>
<h3>Null vs. alternative hypothesis</h3>
<pre><code>H0 (null):        no difference / no effect  (the boring default)
H1 (alternative):  there IS a difference / effect (what you suspect)
</code></pre>
<p>A test either rejects H0 (evidence of an effect) or fails to reject it (not enough evidence — this is NOT proof H0 is true).</p>
<h3>Two ways to be wrong</h3>
<pre><code>                H0 is actually TRUE     H0 is actually FALSE
Reject H0       Type I error (α)        Correct decision
Fail to reject  Correct decision        Type II error (β)
</code></pre>
<p><strong>α (significance level)</strong>, usually 0.05, is the risk of a false positive you're willing to accept. The <strong>p-value</strong> is the probability of seeing a result this extreme if H0 were true. <strong>Rule: reject H0 when p &lt; α.</strong></p>
<h3>Choosing the right t-test</h3>
<pre><code>One-sample t-test   - compare one group's mean to a known value
Independent t-test  - compare means of 2 UNRELATED groups (men vs women)
Paired t-test       - compare means of the SAME group, before vs after
</code></pre>
<h3>ANOVA — when you have 3+ groups</h3>
<p>Running many pairwise t-tests inflates the false-positive rate. <strong>One-way ANOVA</strong> tests whether at least one of 3+ group means differs, using an <strong>F-statistic</strong> (ratio of between-group to within-group variance). A significant F (p &lt; α) says "some group differs" — a post-hoc test (e.g. Tukey) then finds which pair.</p>
<div class="callout"><span class="badge">Worked read</span> Comparing average spend across 4 store branches: p = 0.02 from ANOVA → reject H0 at α = 0.05 → at least one branch differs; run Tukey's post-hoc to find which.</div>`,
    `<span class="eyebrow">RMB302 · Chương 5 · Bài 5.1</span>
<h2>Kiểm định giả thuyết: t-test &amp; ANOVA</h2>
<h3>Giả thuyết không (H0) vs giả thuyết đối (H1)</h3>
<pre><code>H0 (giả thuyết không): không có khác biệt / không có tác động (mặc định)
H1 (giả thuyết đối):    CÓ khác biệt / có tác động (điều bạn nghi ngờ)</code></pre>
<p>Một kiểm định chỉ có thể bác bỏ H0 (có bằng chứng tác động) hoặc không bác bỏ được H0 (chưa đủ bằng chứng — KHÔNG phải bằng chứng H0 đúng).</p>
<h3>Hai kiểu sai lầm</h3>
<pre><code>                H0 thực ra ĐÚNG        H0 thực ra SAI
Bác bỏ H0       Sai lầm loại I (α)      Quyết định đúng
Không bác bỏ    Quyết định đúng         Sai lầm loại II (β)</code></pre>
<p><strong>α (mức ý nghĩa)</strong>, thường 0.05, là rủi ro báo dương giả bạn chấp nhận. <strong>p-value</strong> là xác suất thấy kết quả cực đoan như vậy NẾU H0 đúng. <strong>Quy tắc: bác bỏ H0 khi p &lt; α.</strong></p>
<h3>Chọn đúng loại t-test</h3>
<pre><code>One-sample t-test  - so sánh trung bình một nhóm với một giá trị đã biết
Independent t-test - so sánh trung bình 2 nhóm ĐỘC LẬP (nam vs nữ)
Paired t-test       - so sánh trung bình CÙNG một nhóm, trước vs sau</code></pre>
<h3>ANOVA — khi có 3+ nhóm</h3>
<p>Chạy nhiều t-test theo cặp làm tăng tỉ lệ báo dương giả. <strong>ANOVA một chiều</strong> kiểm định xem có ít nhất một trong 3+ trung bình nhóm khác biệt không, dùng <strong>chỉ số F</strong> (tỉ lệ phương sai GIỮA nhóm so với TRONG nhóm). F có ý nghĩa (p &lt; α) nói "có nhóm nào đó khác biệt" — sau đó dùng kiểm định hậu định (post-hoc, ví dụ Tukey) để tìm ra cặp nào.</p>
<div class="callout"><span class="badge">Đọc ví dụ</span> So sánh chi tiêu trung bình giữa 4 chi nhánh: ANOVA cho p = 0.02 → bác bỏ H0 ở α = 0.05 → ít nhất một chi nhánh khác biệt; chạy Tukey post-hoc để tìm cặp nào.</div>`,
  ]]);

const c5q = quiz('rmb302-quiz-5', 'Quiz 5 — Hypothesis testing|||Quiz 5 — Kiểm định giả thuyết', [
  { id: 'q1', question: 'Sai lầm loại I (Type I error) xảy ra khi nào?', options: ['Bác bỏ H0 khi H0 thực ra đúng', 'Không bác bỏ H0 khi H0 thực ra sai', 'p-value bằng 0', 'Cỡ mẫu quá nhỏ'], correctIndex: 0, explanation: 'Type I: bác bỏ H0 sai lầm — H0 thực ra đúng nhưng ta kết luận có tác động. Xác suất của nó là α.' },
  { id: 'q2', question: 'Muốn so sánh điểm hài lòng của CÙNG một nhóm khách hàng TRƯỚC và SAU khi đổi dịch vụ, dùng kiểm định nào?', options: ['Independent t-test', 'Paired t-test', 'One-way ANOVA', 'Hồi quy bội'], correctIndex: 1, explanation: 'Cùng nhóm, đo hai lần (trước/sau) → paired t-test, vì hai lần đo không độc lập với nhau.' },
  { id: 'q3', question: 'Vì sao dùng ANOVA thay vì nhiều t-test theo cặp khi so sánh 4 nhóm?', options: ['ANOVA nhanh hơn về mặt tính toán', 'Chạy nhiều t-test riêng làm tăng tỉ lệ báo dương giả (Type I) tích lũy', 't-test không áp dụng được cho số liệu định lượng', 'ANOVA không cần giả thuyết H0'], correctIndex: 1, explanation: 'Mỗi t-test mang rủi ro α riêng; chạy nhiều lần làm tỉ lệ sai lầm loại I tổng thể tăng lên — ANOVA kiểm định một lần cho tất cả các nhóm.' },
]);

const c6 = doc('rmb302-6-1-correlation-regression', '6.1 — Correlation & simple linear regression|||6.1 — Tương quan & hồi quy tuyến tính đơn',
  'Hệ số tương quan Pearson r; biểu đồ phân tán; phương trình hồi quy đơn y = b0 + b1x; R² và ý nghĩa; cẩn trọng "tương quan không phải nhân quả".',
  [[
    `<span class="eyebrow">RMB302 · Chapter 6 · Lesson 6.1</span>
<h2>Correlation &amp; simple linear regression</h2>
<h3>Pearson correlation coefficient (r)</h3>
<pre><code>-1 ≤ r ≤ 1
 r close to +1  -> strong positive linear relationship
 r close to -1  -> strong negative linear relationship
 r close to  0  -> little/no linear relationship
</code></pre>
<p>r only captures <em>linear</em> relationships and says nothing about causation — correlation between two variables can come from a third, hidden variable (a confound).</p>
<h3>Simple linear regression</h3>
<pre><code>y = b0 + b1·x + e

y  = dependent variable (what you predict, e.g. sales)
x  = independent variable (predictor, e.g. ad spend)
b0 = intercept (predicted y when x = 0)
b1 = slope (change in y per 1-unit change in x)
e  = error term (what the line does not explain)
</code></pre>
<p>b0 and b1 are chosen by the <strong>least squares method</strong> — the line that minimizes the sum of squared vertical distances between actual points and the line.</p>
<h3>R² — how much the model explains</h3>
<p><strong>R² (coefficient of determination)</strong> is the proportion of variance in y explained by x, from 0 (explains nothing) to 1 (explains everything). R² = 0.64 means 64% of the variation in sales is explained by ad spend; the other 36% is other factors + noise.</p>
<div class="callout"><span class="badge">Correlation ≠ causation</span> Ice cream sales and drowning deaths correlate strongly — both rise with hot weather. Regression tells you the line that fits; it does not by itself tell you WHY.</div>`,
    `<span class="eyebrow">RMB302 · Chương 6 · Bài 6.1</span>
<h2>Tương quan &amp; hồi quy tuyến tính đơn</h2>
<h3>Hệ số tương quan Pearson (r)</h3>
<pre><code>-1 ≤ r ≤ 1
 r gần +1  -> quan hệ tuyến tính thuận mạnh
 r gần -1  -> quan hệ tuyến tính nghịch mạnh
 r gần  0  -> ít/không có quan hệ tuyến tính</code></pre>
<p>r chỉ đo quan hệ <em>tuyến tính</em> và không nói gì về nhân quả — tương quan giữa hai biến có thể do một biến thứ ba ẩn (biến gây nhiễu, confound).</p>
<h3>Hồi quy tuyến tính đơn</h3>
<pre><code>y = b0 + b1·x + e

y  = biến phụ thuộc (thứ cần dự đoán, ví dụ doanh số)
x  = biến độc lập (biến dự báo, ví dụ chi tiêu quảng cáo)
b0 = hệ số chặn (y dự đoán khi x = 0)
b1 = hệ số góc (y thay đổi bao nhiêu khi x tăng 1 đơn vị)
e  = phần dư (những gì đường thẳng chưa giải thích được)</code></pre>
<p>b0 và b1 được chọn bằng <strong>phương pháp bình phương nhỏ nhất</strong> — đường thẳng làm nhỏ nhất tổng bình phương khoảng cách dọc giữa điểm thực và đường thẳng.</p>
<h3>R² — mô hình giải thích được bao nhiêu</h3>
<p><strong>R² (hệ số xác định)</strong> là tỉ lệ phương sai của y được giải thích bởi x, từ 0 (không giải thích được gì) đến 1 (giải thích toàn bộ). R² = 0.64 nghĩa là 64% biến động doanh số được giải thích bởi chi tiêu quảng cáo; 36% còn lại là yếu tố khác + nhiễu.</p>
<div class="callout"><span class="badge">Tương quan ≠ nhân quả</span> Doanh số kem và số ca đuối nước tương quan mạnh — cả hai đều tăng khi trời nóng. Hồi quy cho bạn đường thẳng khớp nhất; nó không tự nói lên VÌ SAO.</div>`,
  ]]);

const c6q = quiz('rmb302-quiz-6', 'Quiz 6 — Correlation & regression|||Quiz 6 — Tương quan & hồi quy', [
  { id: 'q1', question: 'Hệ số tương quan r = -0.85 nghĩa là gì?', options: ['Quan hệ tuyến tính nghịch mạnh', 'Không có quan hệ nào', 'x gây ra y', 'Sai số đo lường quá lớn'], correctIndex: 0, explanation: 'r gần -1 → quan hệ tuyến tính NGHỊCH mạnh: x tăng thì y có xu hướng giảm.' },
  { id: 'q2', question: 'Trong phương trình hồi quy y = b0 + b1·x, hệ số b1 thể hiện điều gì?', options: ['Giá trị y khi x = 0', 'Mức y thay đổi khi x tăng 1 đơn vị', 'Tỉ lệ phương sai được giải thích', 'Sai số ngẫu nhiên'], correctIndex: 1, explanation: 'b1 là hệ số góc (slope) — lượng y thay đổi tương ứng với 1 đơn vị tăng của x.' },
  { id: 'q3', question: 'R² = 0.30 trong một mô hình hồi quy nghĩa là gì?', options: ['Mô hình sai 30%', '30% biến động của y được giải thích bởi x', 'Tương quan r = 0.30 luôn đi kèm', 'Có 30 quan sát trong mẫu'], correctIndex: 1, explanation: 'R² là tỉ lệ phương sai của biến phụ thuộc được giải thích bởi biến độc lập trong mô hình.' },
]);

const c7 = doc('rmb302-7-1-multiple-regression', '7.1 — Multiple regression & model testing|||7.1 — Hồi quy bội & kiểm định mô hình',
  'Phương trình hồi quy bội; R² điều chỉnh (adjusted R²); kiểm định F cho toàn mô hình, kiểm định t cho từng hệ số; đa cộng tuyến (VIF); giả định mô hình.',
  [[
    `<span class="eyebrow">RMB302 · Chapter 7 · Lesson 7.1</span>
<h2>Multiple regression &amp; model testing</h2>
<h3>From one predictor to several</h3>
<pre><code>y = b0 + b1·x1 + b2·x2 + ... + bk·xk + e

Example: Sales = b0 + b1·(Ad spend) + b2·(Price) + b3·(Store size) + e
</code></pre>
<p>Each bᵢ is now the effect of xᵢ <strong>holding all other predictors constant</strong> — a much more realistic picture than one predictor at a time.</p>
<h3>Adjusted R²</h3>
<p>Plain R² always goes up when you add more predictors, even useless ones. <strong>Adjusted R²</strong> penalizes for the number of predictors, so it only rises when a new variable genuinely improves the model — use it to compare models with different numbers of predictors.</p>
<h3>Testing the model — F-test and t-tests</h3>
<pre><code>F-test (overall model): H0: b1 = b2 = ... = bk = 0
  Significant F (p < α) -> the model as a whole predicts y better than chance

t-test (each coefficient): H0: bi = 0
  Significant t for a predictor -> that predictor has an effect,
  holding the others constant
</code></pre>
<h3>Multicollinearity — a silent model-breaker</h3>
<p>When predictors are highly correlated with each other (e.g. store size &amp; number of staff), their individual coefficient estimates become unstable. Check with <strong>VIF (Variance Inflation Factor)</strong> — VIF &gt; 10 signals a multicollinearity problem worth fixing (drop or combine variables).</p>
<h3>Assumptions to check</h3>
<pre><code>Linearity        - relationship between x's and y is linear
Independence     - residuals are independent of each other
Homoscedasticity - residual variance is constant across predicted values
Normality        - residuals are approximately normally distributed
</code></pre>
<div class="callout"><span class="badge">Violated assumptions ≠ useless model</span> They mean the p-values and confidence intervals may be unreliable — check residual plots before trusting the significance stars.</div>`,
    `<span class="eyebrow">RMB302 · Chương 7 · Bài 7.1</span>
<h2>Hồi quy bội &amp; kiểm định mô hình</h2>
<h3>Từ một biến dự báo đến nhiều biến</h3>
<pre><code>y = b0 + b1·x1 + b2·x2 + ... + bk·xk + e

Ví dụ: Doanh số = b0 + b1·(Chi QC) + b2·(Giá) + b3·(Diện tích cửa hàng) + e</code></pre>
<p>Mỗi bᵢ giờ là tác động của xᵢ <strong>khi giữ tất cả biến dự báo khác không đổi</strong> — một hình ảnh thực tế hơn nhiều so với xét một biến một lúc.</p>
<h3>R² điều chỉnh (adjusted R²)</h3>
<p>R² thường luôn tăng khi thêm biến dự báo, dù biến đó vô dụng. <strong>R² điều chỉnh</strong> trừ điểm theo số biến dự báo, nên chỉ tăng khi biến mới thực sự cải thiện mô hình — dùng nó để so sánh các mô hình có số biến khác nhau.</p>
<h3>Kiểm định mô hình — F-test và t-test</h3>
<pre><code>F-test (toàn mô hình): H0: b1 = b2 = ... = bk = 0
  F có ý nghĩa (p < α) -> cả mô hình dự đoán y tốt hơn ngẫu nhiên

t-test (mỗi hệ số): H0: bi = 0
  t có ý nghĩa cho một biến -> biến đó có tác động,
  khi giữ các biến khác không đổi</code></pre>
<h3>Đa cộng tuyến — kẻ phá mô hình âm thầm</h3>
<p>Khi các biến dự báo tương quan cao với nhau (ví dụ diện tích cửa hàng &amp; số nhân viên), ước lượng hệ số riêng của chúng trở nên không ổn định. Kiểm tra bằng <strong>VIF (Variance Inflation Factor)</strong> — VIF &gt; 10 báo hiệu vấn đề đa cộng tuyến cần xử lý (bỏ hoặc gộp biến).</p>
<h3>Các giả định cần kiểm tra</h3>
<pre><code>Tuyến tính     - quan hệ giữa các x và y là tuyến tính
Độc lập        - phần dư độc lập với nhau
Phương sai đều - phương sai phần dư không đổi theo giá trị dự đoán
Chuẩn          - phần dư xấp xỉ phân phối chuẩn</code></pre>
<div class="callout"><span class="badge">Vi phạm giả định ≠ mô hình vô dụng</span> Chúng nghĩa là p-value và khoảng tin cậy có thể không đáng tin — kiểm tra biểu đồ phần dư trước khi tin vào dấu sao ý nghĩa.</div>`,
  ]]);

const c7q = quiz('rmb302-quiz-7', 'Quiz 7 — Multiple regression|||Quiz 7 — Hồi quy bội', [
  { id: 'q1', question: 'Vì sao dùng adjusted R² thay vì R² thường khi so sánh các mô hình có số biến khác nhau?', options: ['Adjusted R² luôn bằng 1', 'R² thường luôn tăng khi thêm biến dù biến đó vô dụng, adjusted R² có trừ điểm theo số biến', 'Adjusted R² không cần dữ liệu', 'R² thường không tính được với hồi quy bội'], correctIndex: 1, explanation: 'Adjusted R² phạt theo số lượng biến dự báo, chỉ tăng khi biến mới thực sự cải thiện mô hình.' },
  { id: 'q2', question: 'VIF (Variance Inflation Factor) cao báo hiệu vấn đề gì?', options: ['Phương sai phần dư không đều', 'Đa cộng tuyến giữa các biến dự báo', 'Mẫu quá nhỏ', 'Biến phụ thuộc không chuẩn'], correctIndex: 1, explanation: 'VIF cao (thường >10) cho thấy các biến dự báo tương quan cao với nhau, làm hệ số ước lượng không ổn định.' },
  { id: 'q3', question: 'F-test cho toàn mô hình hồi quy bội kiểm định giả thuyết H0 nào?', options: ['Tất cả hệ số hồi quy b1,...,bk đều bằng 0', 'Chỉ một hệ số bằng 0', 'R² điều chỉnh bằng 1', 'Phần dư có phân phối chuẩn'], correctIndex: 0, explanation: 'F-test kiểm định H0: b1=b2=...=bk=0, nghĩa là mô hình không dự đoán được y tốt hơn ngẫu nhiên.' },
]);

const c8 = doc('rmb302-8-1-spss-excel-interpretation', '8.1 — Data analysis with SPSS/Excel & interpreting for business decisions|||8.1 — Phân tích dữ liệu với SPSS/Excel & diễn giải cho quyết định kinh doanh',
  'Quy trình nhập/mã hoá dữ liệu; chạy mô tả, t-test, ANOVA, hồi quy trong SPSS/Excel; đọc bảng output; dịch kết quả thống kê thành khuyến nghị kinh doanh; báo cáo có đạo đức.',
  [[
    `<span class="eyebrow">RMB302 · Chapter 8 · Lesson 8.1</span>
<h2>Data analysis with SPSS/Excel &amp; interpreting for business decisions</h2>
<h3>From raw data to a clean dataset</h3>
<pre><code>1. Enter data - one row per respondent, one column per variable
2. Code categorical answers - e.g. Male=1, Female=2 (document the codebook!)
3. Check for errors - out-of-range values, missing data, duplicates
4. Choose the right test - based on variable scale & research question
</code></pre>
<h3>Running the tests you already know</h3>
<pre><code>SPSS:  Analyze > Descriptive Statistics  (Ch.2)
       Analyze > Compare Means > One-Sample/Independent/Paired-Samples T-Test (Ch.5)
       Analyze > Compare Means > One-Way ANOVA (Ch.5)
       Analyze > Regression > Linear  (Ch.6-7)

Excel: Data > Data Analysis > Descriptive Statistics / t-Test / ANOVA / Regression
       (Analysis ToolPak add-in)
</code></pre>
<h3>Reading the output that matters</h3>
<pre><code>t-test / ANOVA table  -> look at "Sig." (p-value) column, compare to α
Regression "Model Summary" -> R² / Adjusted R²
Regression "ANOVA" row     -> overall model F and its Sig.
Regression "Coefficients"  -> B (effect size), Sig. per predictor, VIF
</code></pre>
<h3>Turning statistics into a business recommendation</h3>
<p>A stakeholder does not want "t(58) = 2.41, p = .019" — they want: <em>"Customers who saw the new ad spent significantly more (avg +85,000 VND/month, 95% CI [15,000; 155,000], p = .019). Recommend rolling the ad out, watching the confidence interval's lower bound for a smaller real-world effect."</em> Always report: the effect's size and direction, the confidence/uncertainty around it, and the practical implication — not the p-value alone.</p>
<div class="callout"><span class="badge">Report honestly</span> A non-significant result (p ≥ α) is not "no effect" — it's "not enough evidence at this sample size". Never selectively report only the tests that came out significant (p-hacking) — that is a research-ethics violation, not a shortcut.</div>`,
    `<span class="eyebrow">RMB302 · Chương 8 · Bài 8.1</span>
<h2>Phân tích dữ liệu với SPSS/Excel &amp; diễn giải cho quyết định kinh doanh</h2>
<h3>Từ dữ liệu thô đến bộ dữ liệu sạch</h3>
<pre><code>1. Nhập dữ liệu - mỗi dòng một người trả lời, mỗi cột một biến
2. Mã hoá câu trả lời định danh - vd Nam=1, Nữ=2 (ghi rõ codebook!)
3. Kiểm tra lỗi - giá trị nằm ngoài khoảng, dữ liệu thiếu, trùng lặp
4. Chọn đúng kiểm định - dựa vào thang đo của biến & câu hỏi nghiên cứu</code></pre>
<h3>Chạy các kiểm định đã học</h3>
<pre><code>SPSS:  Analyze > Descriptive Statistics  (Chương 2)
       Analyze > Compare Means > One-Sample/Independent/Paired-Samples T-Test (Chương 5)
       Analyze > Compare Means > One-Way ANOVA (Chương 5)
       Analyze > Regression > Linear  (Chương 6-7)

Excel: Data > Data Analysis > Descriptive Statistics / t-Test / ANOVA / Regression
       (add-in Analysis ToolPak)</code></pre>
<h3>Đọc đúng phần output quan trọng</h3>
<pre><code>Bảng t-test / ANOVA  -> nhìn cột "Sig." (p-value), so với α
"Model Summary" của hồi quy -> R² / Adjusted R²
Dòng "ANOVA" của hồi quy     -> F tổng thể và Sig. của nó
Bảng "Coefficients"          -> B (độ lớn tác động), Sig. từng biến, VIF</code></pre>
<h3>Biến thống kê thành khuyến nghị kinh doanh</h3>
<p>Người ra quyết định không cần "t(58) = 2.41, p = .019" — họ cần: <em>"Khách hàng xem quảng cáo mới chi tiêu nhiều hơn có ý nghĩa (trung bình +85.000 VND/tháng, KTC 95% [15.000; 155.000], p = .019). Khuyến nghị triển khai quảng cáo, theo dõi giới hạn dưới của khoảng tin cậy cho trường hợp tác động thực tế nhỏ hơn."</em> Luôn báo cáo: độ lớn &amp; chiều của tác động, độ bất định quanh nó, và ý nghĩa thực tiễn — không chỉ riêng p-value.</p>
<div class="callout"><span class="badge">Báo cáo trung thực</span> Kết quả không có ý nghĩa (p ≥ α) KHÔNG phải "không có tác động" — mà là "chưa đủ bằng chứng ở cỡ mẫu này". Không bao giờ chỉ báo cáo những kiểm định cho ra kết quả có ý nghĩa (p-hacking) — đó là vi phạm đạo đức nghiên cứu, không phải một cách làm tắt.</div>`,
  ]]);

const c8q = quiz('rmb302-quiz-8', 'Quiz 8 — SPSS/Excel & interpretation|||Quiz 8 — SPSS/Excel & diễn giải', [
  { id: 'q1', question: 'Khi đọc bảng kết quả hồi quy trong SPSS, cột "Sig." trong bảng ANOVA (của mô hình) thể hiện điều gì?', options: ['R² điều chỉnh của mô hình', 'p-value của kiểm định F cho toàn mô hình', 'Hệ số góc b1', 'VIF của biến đầu tiên'], correctIndex: 1, explanation: 'Dòng ANOVA trong output hồi quy báo cáo F tổng thể và cột Sig. chính là p-value của kiểm định đó.' },
  { id: 'q2', question: 'Kết quả kiểm định KHÔNG có ý nghĩa thống kê (p ≥ α) nên được diễn giải thế nào?', options: ['Chắc chắn không có tác động nào tồn tại', 'Chưa đủ bằng chứng để bác bỏ H0 ở cỡ mẫu hiện tại', 'Dữ liệu bị lỗi', 'Phải đổi sang kiểm định khác cho ra kết quả có ý nghĩa'], correctIndex: 1, explanation: 'Không bác bỏ được H0 chỉ nghĩa là chưa đủ bằng chứng, không phải bằng chứng cho "không có tác động".' },
  { id: 'q3', question: 'Vì sao chỉ báo cáo những kiểm định cho ra p-value có ý nghĩa và bỏ qua các kiểm định khác (p-hacking) là sai?', options: ['Vì SPSS sẽ báo lỗi', 'Vì đó là vi phạm đạo đức nghiên cứu, làm sai lệch bằng chứng thật gửi tới người ra quyết định', 'Vì Excel không hỗ trợ việc đó', 'Vì p-value luôn bằng nhau giữa các kiểm định'], correctIndex: 1, explanation: 'Chọn lọc chỉ báo cáo kết quả có ý nghĩa làm méo mó bức tranh thật, là hành vi phi đạo đức trong nghiên cứu.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'RMB302',
    slug: 'rmb302-research-methods-amp-quantitative-analysis',
    title: 'Research Methods &amp; Quantitative Analysis',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/RMB302.webp',
    shortDescription: 'Quantitative business research: variables & descriptive stats, probability & sampling distributions, confidence intervals, hypothesis testing (t-test, ANOVA), correlation & regression, run in SPSS/Excel. Bilingual, with formulas & quizzes.|||Nghiên cứu định lượng trong kinh doanh: biến & thống kê mô tả, xác suất & phân phối mẫu, khoảng tin cậy, kiểm định giả thuyết (t-test, ANOVA), tương quan & hồi quy, chạy trên SPSS/Excel. Song ngữ, có công thức & quiz.',
    description: 'Môn <strong>RMB302 — Research Methods &amp; Quantitative Analysis</strong> (kỳ 4, khối Quản trị Kinh doanh) tập trung vào <strong>phân tích định lượng &amp; thống kê ứng dụng kinh doanh</strong> — khác REM301 (phương pháp nghiên cứu tổng quát) và RMC301 (nghiên cứu truyền thông). Từ <strong>quy trình nghiên cứu</strong> → <strong>biến, thang đo &amp; thống kê mô tả</strong> → <strong>xác suất &amp; phân phối mẫu</strong> → <strong>ước lượng &amp; khoảng tin cậy</strong> → <strong>kiểm định giả thuyết</strong> (t-test, ANOVA) → <strong>tương quan &amp; hồi quy tuyến tính</strong> → <strong>hồi quy bội &amp; kiểm định mô hình</strong> → <strong>phân tích dữ liệu với SPSS/Excel</strong> và diễn giải kết quả cho quyết định kinh doanh. Bám các giáo trình kinh điển (Zikmund/Babin, Anderson/Sweeney, Field), song ngữ, có công thức, ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Quy trình nghiên cứu định lượng; biến độc lập/phụ thuộc, 4 thang đo, thống kê mô tả (mean/median/variance/độ lệch chuẩn); xác suất, phân phối chuẩn, Định lý giới hạn trung tâm (CLT), sai số chuẩn; ước lượng điểm/khoảng, khoảng tin cậy cho trung bình; kiểm định giả thuyết H0/H1, sai lầm loại I/II, p-value, t-test (one-sample/independent/paired), one-way ANOVA; tương quan Pearson r, hồi quy tuyến tính đơn (b0, b1, R²); hồi quy bội, adjusted R², F-test, t-test hệ số, VIF/đa cộng tuyến, giả định mô hình; chạy SPSS/Excel (Analysis ToolPak) và diễn giải kết quả thống kê thành khuyến nghị kinh doanh có đạo đức.',
    requirements: 'Đã hoàn thành các môn toán/thống kê nền tảng và một môn phương pháp nghiên cứu (REM301). Nên có sẵn SPSS hoặc Excel với Analysis ToolPak, hoặc dùng jamovi (miễn phí) để thực hành theo bài.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Zikmund/Babin, Anderson/Sweeney, Field, tài liệu SPSS/Excel, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phân tích định lượng, khác REM301/RMC301, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & quy trình nghiên cứu|||Chapter 1 — Overview & research process', description: 'Định lượng vs định tính, quy trình 7 bước.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Biến, thang đo & thống kê mô tả|||Chapter 2 — Variables, scales & descriptives', description: 'Biến độc lập/phụ thuộc, 4 thang đo, mean/median/variance.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Xác suất & phân phối mẫu|||Chapter 3 — Probability & sampling distributions', description: 'Phân phối chuẩn, CLT, sai số chuẩn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ước lượng & khoảng tin cậy|||Chapter 4 — Estimation & confidence intervals', description: 'Ước lượng điểm/khoảng, công thức KTC, ý nghĩa 95%.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kiểm định giả thuyết (t-test, ANOVA)|||Chapter 5 — Hypothesis testing (t-test, ANOVA)', description: 'H0/H1, sai lầm loại I/II, p-value, ANOVA.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tương quan & hồi quy tuyến tính|||Chapter 6 — Correlation & linear regression', description: 'Pearson r, y=b0+b1x, R².', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hồi quy bội & kiểm định mô hình|||Chapter 7 — Multiple regression & model testing', description: 'Adjusted R², F-test, VIF, giả định.', lessons: [c7, c7q] },
    { title: 'Chương 8 — SPSS/Excel & diễn giải kết quả|||Chapter 8 — SPSS/Excel & interpreting results', description: 'Chạy kiểm định, đọc output, khuyến nghị kinh doanh.', lessons: [c8, c8q] },
  ],
};
