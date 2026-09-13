/**
 * DTA301 — Data Analysis (Phân tích dữ liệu). Ngành Hệ thống thông tin FPTU, kỳ 8.
 * Giáo trình chuẩn quốc tế: McKinney "Python for Data Analysis", Wickham "R for
 * Data Science", "Data Analysis" (Excel/SPSS), Google Data Analytics. Góc HTTT/
 * kinh doanh: dữ liệu → insight → quyết định. Song ngữ + công thức + khối code.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dta301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DTA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Data Analysis</strong> — the analytics workflow, cleaning, statistics, EDA, testing, regression, visualization and storytelling — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for DTA301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener">Wes McKinney — <em>Python for Data Analysis</em> (free online)</a></li>
<li><a href="https://r4ds.hadley.nz/" target="_blank" rel="noopener">Wickham &amp; Grolemund — <em>R for Data Science</em> (free online)</a></li>
<li><a href="https://www.openintro.org/book/os/" target="_blank" rel="noopener"><em>OpenIntro Statistics</em> (free applied statistics)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas — official documentation</a></li>
<li><a href="https://support.microsoft.com/excel" target="_blank" rel="noopener">Microsoft Excel — help &amp; functions</a></li>
<li><a href="https://learn.microsoft.com/power-bi/" target="_blank" rel="noopener">Microsoft Power BI — learning docs</a></li>
</ul>
<h3>▶️ YouTube &amp; courses</h3>
<ul>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — statistics explained clearly</li>
<li><a href="https://www.coursera.org/professional-certificates/google-data-analytics" target="_blank" rel="noopener">Google Data Analytics Certificate</a> — the analytics workflow end to end</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — run Python/pandas in the browser, no install</li>
<li><a href="https://kaggle.com/datasets" target="_blank" rel="noopener">Kaggle Datasets</a> — real data to practise on</li>
</ul>
<div class="callout"><span class="badge">The 4-step path</span>
<ol>
<li><strong>Ask &amp; collect</strong> — define the question, gather and clean the data.</li>
<li><strong>Explore</strong> — describe and visualise it (statistics + EDA) to find patterns.</li>
<li><strong>Analyse</strong> — test hypotheses and model relationships (regression, forecasting).</li>
<li><strong>Communicate</strong> — turn findings into a story and a decision.</li>
</ol></div>`,
    `<span class="eyebrow">DTA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Phân tích dữ liệu</strong> — quy trình phân tích, làm sạch, thống kê, EDA, kiểm định, hồi quy, trực quan hoá và kể chuyện — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DTA301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener">Wes McKinney — <em>Python for Data Analysis</em> (đọc online miễn phí)</a></li>
<li><a href="https://r4ds.hadley.nz/" target="_blank" rel="noopener">Wickham &amp; Grolemund — <em>R for Data Science</em> (miễn phí)</a></li>
<li><a href="https://www.openintro.org/book/os/" target="_blank" rel="noopener"><em>OpenIntro Statistics</em> (thống kê ứng dụng, miễn phí)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas — tài liệu chính thức</a></li>
<li><a href="https://support.microsoft.com/excel" target="_blank" rel="noopener">Microsoft Excel — trợ giúp &amp; hàm</a></li>
<li><a href="https://learn.microsoft.com/power-bi/" target="_blank" rel="noopener">Microsoft Power BI — tài liệu học</a></li>
</ul>
<h3>▶️ YouTube &amp; khoá học</h3>
<ul>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — giảng thống kê rõ ràng</li>
<li><a href="https://www.coursera.org/professional-certificates/google-data-analytics" target="_blank" rel="noopener">Google Data Analytics Certificate</a> — quy trình phân tích trọn vẹn</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy Python/pandas trên trình duyệt, khỏi cài đặt</li>
<li><a href="https://kaggle.com/datasets" target="_blank" rel="noopener">Kaggle Datasets</a> — dữ liệu thật để luyện tập</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Hỏi &amp; thu thập</strong> — xác định câu hỏi, gom và làm sạch dữ liệu.</li>
<li><strong>Khám phá</strong> — mô tả và trực quan hoá (thống kê + EDA) để tìm quy luật.</li>
<li><strong>Phân tích</strong> — kiểm định giả thuyết và mô hình hoá quan hệ (hồi quy, dự báo).</li>
<li><strong>Truyền đạt</strong> — biến kết quả thành câu chuyện và một quyết định.</li>
</ol></div>`,
  ]]);

const intro = doc('dta301-0-1-overview', 'Course overview: from data to decisions|||Tổng quan: từ dữ liệu tới quyết định',
  'Phân tích dữ liệu làm gì; góc HTTT/kinh doanh; công cụ (Excel, Python/pandas, R, Power BI); lộ trình: quy trình → làm sạch → thống kê → EDA → kiểm định → hồi quy → trực quan → báo cáo.',
  [[
    `<span class="eyebrow">DTA301 · Lesson 0.1 · Overview</span>
<h2>Data Analysis: from data to decisions</h2>
<p class="lead"><strong>Data analysis</strong> is the practice of turning raw data into <strong>insight</strong> that supports a <strong>decision</strong>. In an Information Systems / business setting, that means starting from a real question — Why did sales drop? Which customers churn? — and letting the data answer it.</p>
<h3>Why it matters for IS &amp; business</h3>
<ul>
<li><strong>Evidence over opinion</strong> — decisions backed by data beat gut feeling.</li>
<li><strong>Every system produces data</strong> — sales, logs, surveys, CRM; analysis unlocks its value.</li>
<li><strong>A career path</strong> — data analyst, BI analyst, and the entry ramp to data science.</li>
</ul>
<h3>The tools you will meet</h3>
<ul>
<li><strong>Excel</strong> — fast for small data, pivot tables, quick charts.</li>
<li><strong>Python + pandas</strong> — the workhorse for real datasets and repeatable analysis.</li>
<li><strong>R</strong> — statistics and visualisation (tidyverse).</li>
<li><strong>Power BI</strong> — dashboards for a business audience.</li>
</ul>
<h3>Roadmap</h3>
<p>Analytics process &amp; types → collecting &amp; cleaning data → descriptive statistics → exploratory analysis (EDA) → hypothesis testing → regression &amp; forecasting → visualisation &amp; dashboards → reporting &amp; decisions. Bilingual, with Python/pandas and Excel code and a quiz per chapter.</p>`,
    `<span class="eyebrow">DTA301 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích dữ liệu: từ dữ liệu tới quyết định</h2>
<p class="lead"><strong>Phân tích dữ liệu</strong> là công việc biến dữ liệu thô thành <strong>insight</strong> phục vụ một <strong>quyết định</strong>. Trong bối cảnh Hệ thống thông tin / kinh doanh, ta khởi đầu từ một câu hỏi thật — Vì sao doanh số giảm? Khách hàng nào rời bỏ? — và để dữ liệu trả lời.</p>
<h3>Vì sao quan trọng với HTTT &amp; kinh doanh</h3>
<ul>
<li><strong>Bằng chứng thay cho cảm tính</strong> — quyết định dựa trên dữ liệu thắng trực giác.</li>
<li><strong>Mọi hệ thống đều sinh dữ liệu</strong> — bán hàng, log, khảo sát, CRM; phân tích mở khoá giá trị.</li>
<li><strong>Con đường nghề nghiệp</strong> — data analyst, BI analyst, và bậc thang vào data science.</li>
</ul>
<h3>Công cụ bạn sẽ gặp</h3>
<ul>
<li><strong>Excel</strong> — nhanh với dữ liệu nhỏ, pivot table, biểu đồ tức thì.</li>
<li><strong>Python + pandas</strong> — công cụ chủ lực cho dữ liệu thật và phân tích lặp lại được.</li>
<li><strong>R</strong> — thống kê và trực quan hoá (tidyverse).</li>
<li><strong>Power BI</strong> — dashboard cho người dùng kinh doanh.</li>
</ul>
<h3>Lộ trình</h3>
<p>Quy trình &amp; loại phân tích → thu thập &amp; làm sạch dữ liệu → thống kê mô tả → khám phá (EDA) → kiểm định giả thuyết → hồi quy &amp; dự báo → trực quan hoá &amp; dashboard → báo cáo &amp; ra quyết định. Song ngữ, có code Python/pandas và Excel, quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dta301-1-1-what-is-da', '1.1 — What is data analysis?|||1.1 — Phân tích dữ liệu là gì?',
  'Quy trình phân tích (hỏi → thu thập → làm sạch → phân tích → truyền đạt); bốn loại phân tích: mô tả, chẩn đoán, dự đoán, đề xuất.',
  [[
    `<span class="eyebrow">DTA301 · Chapter 1 · Lesson 1.1</span>
<h2>What is data analysis?</h2>
<h3>The analytics process</h3>
<p>Analysis is a <strong>process</strong>, not a single step. A widely used version (Google Data Analytics) has six stages:</p>
<pre><code>Ask     -> define the question / problem
Prepare -> collect and store the data
Process -> clean it (fix errors, missing, duplicates)
Analyze -> explore, compute, model
Share   -> visualise and report the findings
Act     -> make the decision
</code></pre>
<h3>The four types of analysis</h3>
<ul>
<li><strong>Descriptive</strong> — <em>What happened?</em> Summaries, totals, averages, dashboards.</li>
<li><strong>Diagnostic</strong> — <em>Why did it happen?</em> Drill-down, correlation, comparisons.</li>
<li><strong>Predictive</strong> — <em>What will happen?</em> Regression, forecasting, machine learning.</li>
<li><strong>Prescriptive</strong> — <em>What should we do?</em> Optimisation, recommendations.</li>
</ul>
<div class="callout"><span class="badge">Value ladder</span> The four types climb in value and difficulty: describing the past is easy and common; prescribing the best action is the hardest and most valuable. Most business analytics lives in the first two rungs.</div>`,
    `<span class="eyebrow">DTA301 · Chương 1 · Bài 1.1</span>
<h2>Phân tích dữ liệu là gì?</h2>
<h3>Quy trình phân tích</h3>
<p>Phân tích là một <strong>quy trình</strong>, không phải một bước đơn lẻ. Một phiên bản phổ biến (Google Data Analytics) gồm sáu giai đoạn:</p>
<pre><code>Ask (Hỏi)      -> xác định câu hỏi / vấn đề
Prepare        -> thu thập và lưu trữ dữ liệu
Process        -> làm sạch (sửa lỗi, thiếu, trùng)
Analyze        -> khám phá, tính toán, mô hình hoá
Share          -> trực quan hoá và báo cáo kết quả
Act            -> ra quyết định
</code></pre>
<h3>Bốn loại phân tích</h3>
<ul>
<li><strong>Mô tả (descriptive)</strong> — <em>Chuyện gì đã xảy ra?</em> Tổng hợp, tổng, trung bình, dashboard.</li>
<li><strong>Chẩn đoán (diagnostic)</strong> — <em>Vì sao xảy ra?</em> Đào sâu, tương quan, so sánh.</li>
<li><strong>Dự đoán (predictive)</strong> — <em>Sẽ xảy ra gì?</em> Hồi quy, dự báo, học máy.</li>
<li><strong>Đề xuất (prescriptive)</strong> — <em>Nên làm gì?</em> Tối ưu hoá, gợi ý hành động.</li>
</ul>
<div class="callout"><span class="badge">Thang giá trị</span> Bốn loại tăng dần theo giá trị và độ khó: mô tả quá khứ thì dễ và phổ biến; đề xuất hành động tốt nhất là khó và giá trị nhất. Phần lớn phân tích kinh doanh nằm ở hai bậc đầu.</div>`,
  ]]);

const c1q = quiz('dta301-quiz-1', 'Quiz 1 — What is data analysis|||Quiz 1 — Phân tích dữ liệu là gì', [
  { id: 'q1', question: 'Loại phân tích trả lời câu hỏi "Chuyện gì đã xảy ra?" là?', options: ['Dự đoán', 'Mô tả (descriptive)', 'Đề xuất', 'Chẩn đoán'], correctIndex: 1, explanation: 'Phân tích mô tả tổng hợp quá khứ: tổng, trung bình, dashboard.' },
  { id: 'q2', question: 'Loại phân tích "đề xuất" (prescriptive) trả lời?', options: ['Chuyện gì đã xảy ra', 'Vì sao xảy ra', 'Sẽ xảy ra gì', 'Nên làm gì'], correctIndex: 3, explanation: 'Prescriptive gợi ý hành động nên làm (tối ưu hoá, khuyến nghị).' },
  { id: 'q3', question: 'Trong quy trình sáu bước, bước làm sạch dữ liệu là?', options: ['Ask', 'Process', 'Share', 'Act'], correctIndex: 1, explanation: 'Process là bước xử lý/làm sạch: sửa lỗi, thiếu, trùng.' },
]);

const c2 = doc('dta301-2-1-collect-clean', '2.1 — Collecting & cleaning data|||2.1 — Thu thập & làm sạch dữ liệu',
  'Nguồn dữ liệu; dữ liệu bẩn (thiếu, trùng, ngoại lai, sai kiểu); xử lý missing/outlier; chuẩn hoá; tidy data. Khối code pandas.',
  [[
    `<span class="eyebrow">DTA301 · Chapter 2 · Lesson 2.1</span>
<h2>Collecting &amp; cleaning data</h2>
<h3>Where data comes from</h3>
<p>Databases &amp; APIs, spreadsheets/CSV, web scraping, surveys, sensors/logs. Note whether it is <strong>first-party</strong> (yours) or <strong>third-party</strong>, and whether it is a full population or a <strong>sample</strong>.</p>
<h3>Dirty data — the usual suspects</h3>
<ul>
<li><strong>Missing values</strong> — blanks, NA. Options: drop the row, or impute (mean/median/mode).</li>
<li><strong>Duplicates</strong> — the same record twice inflates every count.</li>
<li><strong>Outliers</strong> — extreme values; may be an error or a real rare event. Investigate before deleting.</li>
<li><strong>Wrong type / format</strong> — a number stored as text, mixed date formats.</li>
</ul>
<h3>Standardise (normalise)</h3>
<p>Make it consistent: one date format, trimmed whitespace, unified units, and one label per category ("VN" vs "Vietnam"). Aim for <strong>tidy data</strong>: one row per observation, one column per variable.</p>
<pre><code>import pandas as pd

df = pd.read_csv("sales.csv")
df = df.drop_duplicates()               # remove exact duplicates
df["price"] = pd.to_numeric(df["price"], errors="coerce")
df["price"] = df["price"].fillna(df["price"].median())   # impute missing
df["country"] = df["country"].str.strip().str.title()    # standardise text
print(df.isna().sum())                  # count remaining missing per column
</code></pre>
<div class="callout"><span class="badge">80/20 rule</span> Cleaning often takes most of a project. Rubbish in, rubbish out — no model or chart fixes bad data, so invest here first.</div>`,
    `<span class="eyebrow">DTA301 · Chương 2 · Bài 2.1</span>
<h2>Thu thập &amp; làm sạch dữ liệu</h2>
<h3>Dữ liệu đến từ đâu</h3>
<p>CSDL &amp; API, bảng tính/CSV, thu thập web, khảo sát, cảm biến/log. Cần biết dữ liệu là <strong>bên thứ nhất</strong> (của mình) hay <strong>bên thứ ba</strong>, và là toàn bộ tổng thể hay chỉ một <strong>mẫu</strong>.</p>
<h3>Dữ liệu bẩn — những thủ phạm quen</h3>
<ul>
<li><strong>Giá trị thiếu</strong> — ô trống, NA. Cách xử lý: bỏ dòng, hoặc điền (mean/median/mode).</li>
<li><strong>Trùng lặp</strong> — cùng một bản ghi hai lần làm phồng mọi phép đếm.</li>
<li><strong>Ngoại lai (outlier)</strong> — giá trị cực đoan; có thể là lỗi hoặc sự kiện hiếm có thật. Điều tra trước khi xoá.</li>
<li><strong>Sai kiểu / định dạng</strong> — số lưu dưới dạng chữ, ngày tháng lẫn lộn định dạng.</li>
</ul>
<h3>Chuẩn hoá (normalise)</h3>
<p>Làm cho nhất quán: một định dạng ngày, cắt khoảng trắng thừa, thống nhất đơn vị, và một nhãn cho mỗi nhóm ("VN" và "Vietnam" phải gộp). Hướng tới <strong>tidy data</strong>: mỗi dòng một quan sát, mỗi cột một biến.</p>
<pre><code>import pandas as pd

df = pd.read_csv("sales.csv")
df = df.drop_duplicates()               # bỏ bản ghi trùng
df["price"] = pd.to_numeric(df["price"], errors="coerce")
df["price"] = df["price"].fillna(df["price"].median())   # điền giá trị thiếu
df["country"] = df["country"].str.strip().str.title()    # chuẩn hoá chữ
print(df.isna().sum())                  # đếm số còn thiếu theo cột
</code></pre>
<div class="callout"><span class="badge">Quy tắc 80/20</span> Làm sạch thường chiếm phần lớn dự án. Rác vào thì rác ra — không mô hình hay biểu đồ nào cứu được dữ liệu tồi, nên đầu tư ở đây trước.</div>`,
  ]]);

const c2q = quiz('dta301-quiz-2', 'Quiz 2 — Collect & clean|||Quiz 2 — Thu thập & làm sạch', [
  { id: 'q1', question: 'Cách phổ biến để "điền" (impute) giá trị số bị thiếu là?', options: ['Xoá cả cột', 'Điền bằng trung vị/trung bình của cột', 'Nhân đôi dòng khác', 'Đổi thành 0 luôn không suy nghĩ'], correctIndex: 1, explanation: 'Điền missing bằng median/mean/mode là kỹ thuật impute cơ bản.' },
  { id: 'q2', question: 'Bản ghi trùng lặp (duplicates) gây hại gì?', options: ['Không hại gì', 'Làm phồng mọi phép đếm/tổng', 'Chỉ ảnh hưởng màu biểu đồ', 'Tự động bị mô hình bỏ qua'], correctIndex: 1, explanation: 'Trùng lặp làm sai lệch count, sum và mọi thống kê.' },
  { id: 'q3', question: 'Với một outlier cực đoan, nên làm gì trước?', options: ['Xoá ngay lập tức', 'Điều tra xem là lỗi hay sự kiện hiếm có thật', 'Nhân nó lên cho rõ', 'Bỏ qua toàn bộ cột'], correctIndex: 1, explanation: 'Outlier có thể là lỗi hoặc dữ liệu thật hiếm — điều tra trước khi quyết định.' },
]);

const c3 = doc('dta301-3-1-descriptive-stats', '3.1 — Descriptive statistics|||3.1 — Thống kê mô tả',
  'Xu hướng trung tâm (mean/median/mode); độ phân tán (phương sai, độ lệch chuẩn, IQR); phân phối; trực quan (histogram, boxplot). Khối code.',
  [[
    `<span class="eyebrow">DTA301 · Chapter 3 · Lesson 3.1</span>
<h2>Descriptive statistics</h2>
<h3>Central tendency — the "typical" value</h3>
<ul>
<li><strong>Mean</strong> — the arithmetic average; sensitive to outliers.</li>
<li><strong>Median</strong> — the middle value; robust to outliers (use it for income, prices).</li>
<li><strong>Mode</strong> — the most frequent value; the only one for categories.</li>
</ul>
<h3>Spread — how scattered the data is</h3>
<pre><code>Variance      s^2 = sum((x - mean)^2) / (n - 1)
Std deviation s   = sqrt(variance)          (same unit as the data)
Range         max - min
IQR           Q3 - Q1   (the middle 50%, robust to outliers)
</code></pre>
<h3>Distribution &amp; shape</h3>
<p>The <strong>distribution</strong> shows how values are spread. A <strong>normal</strong> distribution is the bell curve; a <strong>skewed</strong> one has a long tail. Shape decides which statistics are fair: for skewed data prefer the median over the mean.</p>
<pre><code>import pandas as pd
df = pd.read_csv("sales.csv")
print(df["amount"].describe())     # count, mean, std, min, quartiles, max
print(df["amount"].median())
df["amount"].plot(kind="hist", bins=30)   # see the shape
df["amount"].plot(kind="box")             # median, IQR, outliers
</code></pre>
<div class="callout"><span class="badge">Mean vs median</span> One billionaire in a room of students makes the mean income "millionaire" while the median stays realistic. Always check which the data warrants.</div>`,
    `<span class="eyebrow">DTA301 · Chương 3 · Bài 3.1</span>
<h2>Thống kê mô tả</h2>
<h3>Xu hướng trung tâm — giá trị "điển hình"</h3>
<ul>
<li><strong>Trung bình (mean)</strong> — bình quân cộng; nhạy với outlier.</li>
<li><strong>Trung vị (median)</strong> — giá trị giữa; vững trước outlier (dùng cho thu nhập, giá).</li>
<li><strong>Mode (yếu vị)</strong> — giá trị xuất hiện nhiều nhất; là loại duy nhất dùng được cho biến phân loại.</li>
</ul>
<h3>Độ phân tán — dữ liệu tản rộng thế nào</h3>
<pre><code>Phương sai       s^2 = tong((x - mean)^2) / (n - 1)
Độ lệch chuẩn    s   = can bac hai cua phuong sai   (cung don vi voi du lieu)
Khoảng biến thiên max - min
IQR              Q3 - Q1   (50% giua, vung truoc outlier)
</code></pre>
<h3>Phân phối &amp; hình dạng</h3>
<p><strong>Phân phối</strong> cho thấy các giá trị trải ra sao. Phân phối <strong>chuẩn</strong> là đường cong hình chuông; phân phối <strong>lệch (skewed)</strong> có đuôi dài. Hình dạng quyết định thống kê nào là công bằng: dữ liệu lệch thì ưu tiên trung vị hơn trung bình.</p>
<pre><code>import pandas as pd
df = pd.read_csv("sales.csv")
print(df["amount"].describe())     # count, mean, std, min, tu phan vi, max
print(df["amount"].median())
df["amount"].plot(kind="hist", bins=30)   # xem hinh dang
df["amount"].plot(kind="box")             # trung vi, IQR, outlier
</code></pre>
<div class="callout"><span class="badge">Mean và median</span> Một tỉ phú lọt vào phòng toàn sinh viên khiến thu nhập trung bình thành "triệu phú" trong khi trung vị vẫn thực tế. Luôn kiểm xem dữ liệu xứng với thống kê nào.</div>`,
  ]]);

const c3q = quiz('dta301-quiz-3', 'Quiz 3 — Descriptive statistics|||Quiz 3 — Thống kê mô tả', [
  { id: 'q1', question: 'Với dữ liệu lệch (skewed) như thu nhập, nên báo cáo?', options: ['Trung bình (mean)', 'Trung vị (median)', 'Tổng', 'Số lớn nhất'], correctIndex: 1, explanation: 'Median vững trước outlier, phản ánh giá trị điển hình tốt hơn mean khi lệch.' },
  { id: 'q2', question: 'Độ lệch chuẩn (standard deviation) đo?', options: ['Giá trị hay gặp nhất', 'Mức phân tán quanh trung bình', 'Giá trị giữa', 'Số bản ghi'], correctIndex: 1, explanation: 'Độ lệch chuẩn = căn của phương sai, đo mức tản của dữ liệu quanh mean.' },
  { id: 'q3', question: 'IQR (khoảng tứ phân vị) là?', options: ['Max trừ min', 'Q3 trừ Q1 (50% giữa)', 'Trung bình cộng', 'Tổng bình phương'], correctIndex: 1, explanation: 'IQR = Q3 - Q1, đo độ tản của 50% giữa, vững trước outlier.' },
]);

const c4 = doc('dta301-4-1-eda', '4.1 — Exploratory data analysis (EDA)|||4.1 — Khám phá dữ liệu (EDA)',
  'EDA là gì; nhóm & tổng hợp (groupby), pivot table, tương quan (correlation ≠ causation); trực quan khám phá. Khối code pandas + Excel.',
  [[
    `<span class="eyebrow">DTA301 · Chapter 4 · Lesson 4.1</span>
<h2>Exploratory data analysis (EDA)</h2>
<h3>What EDA is for</h3>
<p><strong>EDA</strong> means getting to know the data <em>before</em> testing or modelling: its shape, patterns, gaps and surprises. You slice, aggregate and plot until the story starts to show.</p>
<h3>Group &amp; aggregate</h3>
<p><strong>Group by</strong> a category and summarise each group — the single most useful move in analysis (the Excel equivalent is a <strong>pivot table</strong>).</p>
<pre><code>import pandas as pd
df = pd.read_csv("sales.csv")

# revenue per region
df.groupby("region")["amount"].sum().sort_values(ascending=False)

# average order value per month, as a pivot
df.pivot_table(index="month", columns="region",
               values="amount", aggfunc="mean")
</code></pre>
<h3>Correlation</h3>
<p><strong>Correlation</strong> (r, from -1 to +1) measures how two numeric variables move together. But <strong>correlation is not causation</strong> — ice-cream sales and drownings rise together because of a hidden cause (summer), not because one causes the other.</p>
<pre><code>df[["ad_spend", "revenue"]].corr()     # correlation matrix
df.plot.scatter(x="ad_spend", y="revenue")   # look before you trust r
</code></pre>
<div class="callout"><span class="badge">Look, do not just compute</span> Datasets with identical means and correlations can look completely different (Anscombe quartet). Always plot the data — the eye catches what a summary number hides.</div>`,
    `<span class="eyebrow">DTA301 · Chương 4 · Bài 4.1</span>
<h2>Khám phá dữ liệu (EDA)</h2>
<h3>EDA dùng để làm gì</h3>
<p><strong>EDA</strong> là làm quen với dữ liệu <em>trước khi</em> kiểm định hay mô hình hoá: hình dạng, quy luật, lỗ hổng và bất ngờ. Bạn cắt lát, tổng hợp và vẽ cho tới khi câu chuyện lộ ra.</p>
<h3>Nhóm &amp; tổng hợp</h3>
<p><strong>Group by</strong> theo một nhóm rồi tổng hợp từng nhóm — nước đi hữu dụng nhất trong phân tích (trong Excel chính là <strong>pivot table</strong>).</p>
<pre><code>import pandas as pd
df = pd.read_csv("sales.csv")

# doanh thu theo vung
df.groupby("region")["amount"].sum().sort_values(ascending=False)

# gia tri don hang trung binh theo thang, dang pivot
df.pivot_table(index="month", columns="region",
               values="amount", aggfunc="mean")
</code></pre>
<h3>Tương quan</h3>
<p><strong>Tương quan</strong> (r, từ -1 tới +1) đo mức hai biến số cùng biến thiên. Nhưng <strong>tương quan không phải nhân quả</strong> — doanh số kem và số ca đuối nước cùng tăng vì một nguyên nhân ẩn (mùa hè), chứ không phải cái này gây ra cái kia.</p>
<pre><code>df[["ad_spend", "revenue"]].corr()     # ma tran tuong quan
df.plot.scatter(x="ad_spend", y="revenue")   # nhin truoc khi tin r
</code></pre>
<div class="callout"><span class="badge">Hãy nhìn, đừng chỉ tính</span> Các tập dữ liệu có cùng trung bình và tương quan vẫn có thể trông hoàn toàn khác nhau (bộ tứ Anscombe). Luôn vẽ dữ liệu — mắt bắt được thứ mà con số tổng hợp che giấu.</div>`,
  ]]);

const c4q = quiz('dta301-quiz-4', 'Quiz 4 — EDA|||Quiz 4 — Khám phá dữ liệu', [
  { id: 'q1', question: 'Trong Excel, công cụ tương đương với groupby-tổng hợp của pandas là?', options: ['VLOOKUP', 'Pivot table', 'Conditional formatting', 'Data validation'], correctIndex: 1, explanation: 'Pivot table nhóm theo trường và tổng hợp — tương đương groupby.' },
  { id: 'q2', question: 'Hệ số tương quan r = -0.9 nghĩa là?', options: ['Không liên hệ', 'Quan hệ ngược mạnh', 'Quan hệ thuận yếu', 'Một biến gây ra biến kia'], correctIndex: 1, explanation: 'r gần -1 là quan hệ nghịch mạnh; và tương quan không suy ra nhân quả.' },
  { id: 'q3', question: '"Correlation is not causation" nhắc ta điều gì?', options: ['Tương quan luôn sai', 'Hai biến cùng biến thiên không có nghĩa cái này gây ra cái kia', 'Không nên tính tương quan', 'r luôn dương'], correctIndex: 1, explanation: 'Có thể do biến ẩn (confounder); tương quan không chứng minh nhân quả.' },
]);

const c5 = doc('dta301-5-1-hypothesis-testing', '5.1 — Hypothesis testing|||5.1 — Kiểm định giả thuyết',
  'Giả thuyết H0/H1; p-value & mức ý nghĩa; t-test (so trung bình); chi-square (biến phân loại); ANOVA (nhiều nhóm). Khối code.',
  [[
    `<span class="eyebrow">DTA301 · Chapter 5 · Lesson 5.1</span>
<h2>Hypothesis testing</h2>
<h3>The idea</h3>
<p>A <strong>hypothesis test</strong> asks: is the pattern I see real, or could it be random chance? You state two hypotheses:</p>
<ul>
<li><strong>H0 (null)</strong> — no effect / no difference (the sceptic default).</li>
<li><strong>H1 (alternative)</strong> — there is a real effect / difference.</li>
</ul>
<h3>p-value &amp; significance</h3>
<p>The <strong>p-value</strong> is the probability of seeing data this extreme <em>if H0 were true</em>. If p is smaller than the significance level (usually <strong>&alpha; = 0.05</strong>), you <strong>reject H0</strong>. A small p means "unlikely to be chance".</p>
<h3>Which test to use</h3>
<ul>
<li><strong>t-test</strong> — compare the <em>means</em> of one or two groups (numeric outcome).</li>
<li><strong>Chi-square</strong> — test association between two <em>categorical</em> variables.</li>
<li><strong>ANOVA</strong> — compare means across <em>three or more</em> groups at once.</li>
</ul>
<pre><code>from scipy import stats

# Do groups A and B differ in mean spend?
t, p = stats.ttest_ind(group_a, group_b)
print("p =", p, "-> reject H0" if p &lt; 0.05 else "-> keep H0")

# ANOVA across three regions
f, p = stats.f_oneway(north, central, south)
</code></pre>
<div class="callout"><span class="badge">p is not proof</span> A significant result is not "certainly true", and p &gt; 0.05 does not prove H0. Report the effect size and context, not just the p-value.</div>`,
    `<span class="eyebrow">DTA301 · Chương 5 · Bài 5.1</span>
<h2>Kiểm định giả thuyết</h2>
<h3>Ý tưởng</h3>
<p><strong>Kiểm định giả thuyết</strong> hỏi: quy luật tôi thấy là thật, hay chỉ là ngẫu nhiên? Ta nêu hai giả thuyết:</p>
<ul>
<li><strong>H0 (giả thuyết không)</strong> — không có hiệu ứng / không khác biệt (mặc định hoài nghi).</li>
<li><strong>H1 (đối thuyết)</strong> — có hiệu ứng / khác biệt thật.</li>
</ul>
<h3>p-value &amp; mức ý nghĩa</h3>
<p><strong>p-value</strong> là xác suất thấy dữ liệu cực đoan cỡ này <em>nếu H0 đúng</em>. Nếu p nhỏ hơn mức ý nghĩa (thường <strong>&alpha; = 0.05</strong>), ta <strong>bác bỏ H0</strong>. p nhỏ nghĩa là "khó mà do ngẫu nhiên".</p>
<h3>Chọn phép kiểm nào</h3>
<ul>
<li><strong>t-test</strong> — so <em>trung bình</em> của một hoặc hai nhóm (kết quả dạng số).</li>
<li><strong>Chi-square</strong> — kiểm liên hệ giữa hai biến <em>phân loại</em>.</li>
<li><strong>ANOVA</strong> — so trung bình của <em>ba nhóm trở lên</em> cùng lúc.</li>
</ul>
<pre><code>from scipy import stats

# Nhom A va B co khac nhau ve chi tieu trung binh?
t, p = stats.ttest_ind(group_a, group_b)
print("p =", p, "-> bac bo H0" if p &lt; 0.05 else "-> giu H0")

# ANOVA cho ba vung
f, p = stats.f_oneway(north, central, south)
</code></pre>
<div class="callout"><span class="badge">p không phải bằng chứng</span> Kết quả có ý nghĩa không phải "chắc chắn đúng", và p &gt; 0.05 không chứng minh H0. Hãy báo cả độ lớn hiệu ứng và bối cảnh, đừng chỉ báo p-value.</div>`,
  ]]);

const c5q = quiz('dta301-quiz-5', 'Quiz 5 — Hypothesis testing|||Quiz 5 — Kiểm định giả thuyết', [
  { id: 'q1', question: 'Với mức ý nghĩa α = 0.05, khi nào bác bỏ H0?', options: ['Khi p > 0.05', 'Khi p < 0.05', 'Luôn luôn', 'Không bao giờ'], correctIndex: 1, explanation: 'p nhỏ hơn α nghĩa là dữ liệu khó do ngẫu nhiên → bác bỏ H0.' },
  { id: 'q2', question: 'Muốn so trung bình của hai nhóm (kết quả dạng số), dùng?', options: ['Chi-square', 't-test', 'Tương quan', 'Pivot table'], correctIndex: 1, explanation: 't-test so sánh trung bình của một hoặc hai nhóm.' },
  { id: 'q3', question: 'Kiểm liên hệ giữa hai biến PHÂN LOẠI, dùng?', options: ['t-test', 'ANOVA', 'Chi-square', 'Hồi quy tuyến tính'], correctIndex: 2, explanation: 'Chi-square kiểm sự liên hệ giữa hai biến phân loại.' },
]);

const c6 = doc('dta301-6-1-regression-forecast', '6.1 — Regression & forecasting|||6.1 — Hồi quy & dự báo',
  'Hồi quy tuyến tính (đơn/bội), hệ số & diễn giải; dự báo; đánh giá mô hình (R², RMSE); overfitting. Khối code scikit-learn.',
  [[
    `<span class="eyebrow">DTA301 · Chapter 6 · Lesson 6.1</span>
<h2>Regression &amp; forecasting</h2>
<h3>Linear regression</h3>
<p><strong>Regression</strong> fits a line (or plane) so you can <em>predict</em> a numeric outcome from one or more inputs.</p>
<pre><code>Simple:   y = b0 + b1*x
Multiple: y = b0 + b1*x1 + b2*x2 + ... + bk*xk
</code></pre>
<p>Each <strong>coefficient</strong> b1 is the expected change in y for a one-unit rise in that x, <em>holding the others fixed</em>. <strong>Multiple</strong> regression uses several predictors at once.</p>
<h3>Evaluating the model</h3>
<ul>
<li><strong>R&sup2;</strong> — the share of variance explained (0 to 1; higher is better).</li>
<li><strong>RMSE</strong> — typical prediction error, in the unit of y (lower is better).</li>
<li><strong>Train/test split</strong> — score on data the model has not seen, to catch <strong>overfitting</strong> (fits the noise, fails on new data).</li>
</ul>
<pre><code>from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)
model = LinearRegression().fit(X_tr, y_tr)
pred = model.predict(X_te)
print("R2 =", r2_score(y_te, pred), "coef =", model.coef_)
</code></pre>
<div class="callout"><span class="badge">Forecasting</span> Predicting over time (sales next quarter) adds trend and seasonality. Start simple — a trend line or moving average — before reaching for complex models.</div>`,
    `<span class="eyebrow">DTA301 · Chương 6 · Bài 6.1</span>
<h2>Hồi quy &amp; dự báo</h2>
<h3>Hồi quy tuyến tính</h3>
<p><strong>Hồi quy</strong> khớp một đường (hay mặt phẳng) để <em>dự đoán</em> một kết quả dạng số từ một hay nhiều biến đầu vào.</p>
<pre><code>Đơn:  y = b0 + b1*x
Bội:  y = b0 + b1*x1 + b2*x2 + ... + bk*xk
</code></pre>
<p>Mỗi <strong>hệ số</strong> b1 là mức thay đổi kỳ vọng của y khi x đó tăng một đơn vị, <em>giữ các biến khác cố định</em>. Hồi quy <strong>bội</strong> dùng nhiều biến dự báo cùng lúc.</p>
<h3>Đánh giá mô hình</h3>
<ul>
<li><strong>R&sup2;</strong> — phần phương sai được giải thích (0 tới 1; cao hơn là tốt hơn).</li>
<li><strong>RMSE</strong> — sai số dự báo điển hình, cùng đơn vị với y (thấp hơn là tốt hơn).</li>
<li><strong>Chia train/test</strong> — chấm điểm trên dữ liệu mô hình chưa thấy, để bắt <strong>overfitting</strong> (khớp cả nhiễu, hỏng trên dữ liệu mới).</li>
</ul>
<pre><code>from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)
model = LinearRegression().fit(X_tr, y_tr)
pred = model.predict(X_te)
print("R2 =", r2_score(y_te, pred), "coef =", model.coef_)
</code></pre>
<div class="callout"><span class="badge">Dự báo</span> Dự đoán theo thời gian (doanh số quý tới) thêm xu hướng và tính mùa vụ. Hãy bắt đầu đơn giản — đường xu hướng hay trung bình trượt — trước khi dùng mô hình phức tạp.</div>`,
  ]]);

const c6q = quiz('dta301-quiz-6', 'Quiz 6 — Regression & forecasting|||Quiz 6 — Hồi quy & dự báo', [
  { id: 'q1', question: 'R² của mô hình hồi quy đo?', options: ['Số dòng dữ liệu', 'Phần phương sai được giải thích', 'Sai số tính bằng phút', 'Số biến đầu vào'], correctIndex: 1, explanation: 'R² (0 tới 1) là tỉ lệ biến thiên của y được mô hình giải thích.' },
  { id: 'q2', question: 'Overfitting là hiện tượng?', options: ['Mô hình quá đơn giản', 'Mô hình khớp cả nhiễu, hỏng trên dữ liệu mới', 'Thiếu dữ liệu', 'R² bằng 0'], correctIndex: 1, explanation: 'Overfit: học thuộc cả nhiễu train, kém trên test — bắt bằng train/test split.' },
  { id: 'q3', question: 'Trong hồi quy bội, hệ số b1 của biến x1 nghĩa là?', options: ['Tổng của y', 'Thay đổi kỳ vọng của y khi x1 tăng 1 đơn vị, giữ biến khác cố định', 'Số quan sát', 'Luôn dương'], correctIndex: 1, explanation: 'Hệ số là tác động biên của x1 lên y khi các biến khác giữ nguyên.' },
]);

const c7 = doc('dta301-7-1-visualization-dashboard', '7.1 — Visualization & dashboards|||7.1 — Trực quan hoá & dashboard',
  'Chọn biểu đồ đúng theo mục đích; công cụ (Excel, Power BI, Python matplotlib); nguyên tắc thiết kế; dashboard. Khối code.',
  [[
    `<span class="eyebrow">DTA301 · Chapter 7 · Lesson 7.1</span>
<h2>Visualization &amp; dashboards</h2>
<h3>Pick the chart for the job</h3>
<ul>
<li><strong>Bar chart</strong> — compare categories (sales by region).</li>
<li><strong>Line chart</strong> — a value over time (trend).</li>
<li><strong>Histogram</strong> — the distribution of one numeric variable.</li>
<li><strong>Scatter plot</strong> — relationship between two numeric variables.</li>
<li><strong>Pie</strong> — parts of a whole; use sparingly, only a few slices.</li>
</ul>
<h3>Design principles</h3>
<p>Less is more: remove chart junk, label axes, start bar axes at zero, and use colour to <em>mean</em> something (never for decoration). Every chart should answer one clear question.</p>
<pre><code>import matplotlib.pyplot as plt
df.groupby("region")["amount"].sum().plot(kind="bar")
plt.ylabel("Revenue (VND)")
plt.title("Revenue by region")
plt.tight_layout(); plt.show()
</code></pre>
<h3>Dashboards</h3>
<p>A <strong>dashboard</strong> gathers the key metrics (KPIs) and charts on one screen for a business audience, often interactive. <strong>Excel</strong> pivot charts, <strong>Power BI</strong> and <strong>Python</strong> (matplotlib/plotly) each build them at a different scale.</p>
<div class="callout"><span class="badge">Audience first</span> A chart for analysts can be dense; a dashboard for executives must show the one number that matters at a glance. Design for who reads it.</div>`,
    `<span class="eyebrow">DTA301 · Chương 7 · Bài 7.1</span>
<h2>Trực quan hoá &amp; dashboard</h2>
<h3>Chọn biểu đồ đúng việc</h3>
<ul>
<li><strong>Biểu đồ cột</strong> — so sánh các nhóm (doanh số theo vùng).</li>
<li><strong>Biểu đồ đường</strong> — một giá trị theo thời gian (xu hướng).</li>
<li><strong>Histogram</strong> — phân phối của một biến số.</li>
<li><strong>Biểu đồ tán xạ (scatter)</strong> — quan hệ giữa hai biến số.</li>
<li><strong>Biểu đồ tròn</strong> — phần trên tổng; dùng dè, chỉ vài lát.</li>
</ul>
<h3>Nguyên tắc thiết kế</h3>
<p>Ít mà chất: bỏ chi tiết thừa (chart junk), ghi nhãn trục, trục cột bắt đầu từ 0, và dùng màu để <em>mang ý nghĩa</em> (không phải trang trí). Mỗi biểu đồ trả lời một câu hỏi rõ ràng.</p>
<pre><code>import matplotlib.pyplot as plt
df.groupby("region")["amount"].sum().plot(kind="bar")
plt.ylabel("Doanh thu (VND)")
plt.title("Doanh thu theo vung")
plt.tight_layout(); plt.show()
</code></pre>
<h3>Dashboard</h3>
<p>Một <strong>dashboard</strong> gom các chỉ số chính (KPI) và biểu đồ lên một màn hình cho người dùng kinh doanh, thường có tương tác. <strong>Excel</strong> pivot chart, <strong>Power BI</strong> và <strong>Python</strong> (matplotlib/plotly) dựng dashboard ở các quy mô khác nhau.</p>
<div class="callout"><span class="badge">Người xem là trên hết</span> Biểu đồ cho nhà phân tích có thể dày đặc; dashboard cho lãnh đạo phải cho thấy con số quan trọng nhất trong một cái liếc. Thiết kế theo người đọc.</div>`,
  ]]);

const c7q = quiz('dta301-quiz-7', 'Quiz 7 — Visualization|||Quiz 7 — Trực quan hoá', [
  { id: 'q1', question: 'Muốn thể hiện một giá trị thay đổi theo thời gian, chọn?', options: ['Biểu đồ tròn', 'Biểu đồ đường', 'Histogram', 'Scatter'], correctIndex: 1, explanation: 'Biểu đồ đường thể hiện xu hướng theo thời gian tốt nhất.' },
  { id: 'q2', question: 'Muốn xem phân phối của MỘT biến số, chọn?', options: ['Biểu đồ cột nhóm', 'Histogram', 'Biểu đồ tròn', 'Bảng'], correctIndex: 1, explanation: 'Histogram cho thấy hình dạng phân phối của một biến số.' },
  { id: 'q3', question: 'Nguyên tắc thiết kế biểu đồ đúng là?', options: ['Trục cột nên bắt đầu từ 0, ghi nhãn trục, bỏ chi tiết thừa', 'Dùng càng nhiều màu càng đẹp', 'Cắt trục cho khác biệt trông to hơn', 'Bỏ nhãn cho gọn'], correctIndex: 0, explanation: 'Trục cột từ 0, có nhãn, ít chart junk; màu để mang ý nghĩa, không trang trí.' },
]);

const c8 = doc('dta301-8-1-report-decision', '8.1 — Reporting & decision-making|||8.1 — Báo cáo & ra quyết định',
  'Data storytelling; từ insight tới quyết định; cấu trúc báo cáo; đạo đức dữ liệu (quyền riêng tư, thiên lệch, gây hiểu nhầm).',
  [[
    `<span class="eyebrow">DTA301 · Chapter 8 · Lesson 8.1</span>
<h2>Reporting &amp; decision-making</h2>
<h3>Data storytelling</h3>
<p>Analysis only creates value when someone <em>acts</em> on it. <strong>Data storytelling</strong> wraps the findings in a narrative the audience can follow: context &rarr; what the data shows &rarr; what it means &rarr; the recommended action.</p>
<h3>From insight to decision</h3>
<ul>
<li><strong>Lead with the answer</strong> — state the recommendation first, then the evidence.</li>
<li><strong>Tie every chart to a decision</strong> — if it changes nothing, cut it.</li>
<li><strong>Be honest about uncertainty</strong> — show the limits, the sample size, the assumptions.</li>
</ul>
<h3>Data ethics</h3>
<ul>
<li><strong>Privacy</strong> — protect personal data; anonymise; only collect what you need.</li>
<li><strong>Bias</strong> — a skewed sample gives skewed conclusions; check who is missing from the data.</li>
<li><strong>Do not mislead</strong> — no truncated axes, cherry-picked ranges, or charts that imply causation you did not prove.</li>
</ul>
<div class="callout"><span class="badge">The last mile</span> A brilliant analysis explained badly changes nothing. The final skill of an analyst is turning numbers into a clear, honest recommendation a decision-maker can act on.</div>`,
    `<span class="eyebrow">DTA301 · Chương 8 · Bài 8.1</span>
<h2>Báo cáo &amp; ra quyết định</h2>
<h3>Kể chuyện bằng dữ liệu</h3>
<p>Phân tích chỉ tạo giá trị khi có người <em>hành động</em> theo nó. <strong>Data storytelling</strong> bọc kết quả trong một mạch kể mà người nghe theo được: bối cảnh &rarr; dữ liệu cho thấy gì &rarr; điều đó nghĩa là gì &rarr; hành động đề xuất.</p>
<h3>Từ insight tới quyết định</h3>
<ul>
<li><strong>Nói câu trả lời trước</strong> — nêu khuyến nghị trước, rồi mới tới bằng chứng.</li>
<li><strong>Gắn mỗi biểu đồ với một quyết định</strong> — nếu nó không thay đổi gì, hãy bỏ.</li>
<li><strong>Trung thực về mức bất định</strong> — cho thấy giới hạn, cỡ mẫu, giả định.</li>
</ul>
<h3>Đạo đức dữ liệu</h3>
<ul>
<li><strong>Quyền riêng tư</strong> — bảo vệ dữ liệu cá nhân; ẩn danh; chỉ thu thập thứ cần.</li>
<li><strong>Thiên lệch (bias)</strong> — mẫu lệch cho kết luận lệch; kiểm xem ai bị thiếu trong dữ liệu.</li>
<li><strong>Không gây hiểu nhầm</strong> — không cắt trục, không chọn lọc khoảng có lợi, không biểu đồ ngụ ý nhân quả mà bạn chưa chứng minh.</li>
</ul>
<div class="callout"><span class="badge">Chặng cuối</span> Một phân tích xuất sắc mà trình bày tệ thì không thay đổi gì. Kỹ năng cuối của nhà phân tích là biến con số thành một khuyến nghị rõ ràng, trung thực để người ra quyết định hành động.</div>`,
  ]]);

const c8q = quiz('dta301-quiz-8', 'Quiz 8 — Reporting & ethics|||Quiz 8 — Báo cáo & đạo đức', [
  { id: 'q1', question: 'Nguyên tắc kể chuyện bằng dữ liệu cho lãnh đạo là?', options: ['Giấu khuyến nghị tới cuối', 'Nói câu trả lời/khuyến nghị trước, rồi tới bằng chứng', 'Đưa mọi biểu đồ đã vẽ', 'Không nêu giả định'], correctIndex: 1, explanation: 'Dẫn bằng câu trả lời trước, sau đó là bằng chứng hỗ trợ.' },
  { id: 'q2', question: 'Ví dụ về trình bày biểu đồ GÂY HIỂU NHẦM là?', options: ['Ghi nhãn trục đầy đủ', 'Cắt trục để phóng đại khác biệt', 'Bắt đầu trục cột từ 0', 'Ghi rõ cỡ mẫu'], correctIndex: 1, explanation: 'Cắt/truncate trục làm khác biệt nhỏ trông lớn — vi phạm trung thực dữ liệu.' },
  { id: 'q3', question: 'Vì sao thiên lệch mẫu (sampling bias) nguy hiểm?', options: ['Làm biểu đồ xấu', 'Mẫu lệch dẫn tới kết luận lệch cho cả tổng thể', 'Tăng cỡ file', 'Không ảnh hưởng gì'], correctIndex: 1, explanation: 'Nếu ai đó bị thiếu khỏi mẫu, kết luận suy rộng ra tổng thể sẽ sai lệch.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'DTA301',
    slug: 'dta301-data-analysis',
    title: 'Data Analysis',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DTA301.webp',
    shortDescription: 'Turn raw data into decisions — analytics workflow, data cleaning, descriptive statistics, EDA, hypothesis testing, regression & forecasting, visualization & dashboards, data storytelling. Bilingual, with Python/pandas & Excel code.|||Biến dữ liệu thô thành quyết định — quy trình phân tích, làm sạch, thống kê mô tả, EDA, kiểm định giả thuyết, hồi quy & dự báo, trực quan hoá & dashboard, kể chuyện bằng dữ liệu. Song ngữ, code Python/pandas & Excel.',
    description: 'Môn <strong>DTA301 — Data Analysis</strong> (Phân tích dữ liệu, ngành Hệ thống thông tin, kỳ 8) dạy cách biến <strong>dữ liệu thô thành quyết định</strong>. Từ <strong>quy trình &amp; loại phân tích</strong> (mô tả/chẩn đoán/dự đoán/đề xuất) → <strong>thu thập &amp; làm sạch</strong> → <strong>thống kê mô tả</strong> → <strong>khám phá (EDA)</strong> → <strong>kiểm định giả thuyết</strong> (t-test, chi-square, ANOVA) → <strong>hồi quy &amp; dự báo</strong> → <strong>trực quan hoá &amp; dashboard</strong> → <strong>báo cáo, storytelling &amp; đạo đức dữ liệu</strong>. Bám giáo trình chuẩn quốc tế (McKinney, Wickham, Google Data Analytics), song ngữ, có công thức và code Python/pandas + Excel, quiz mỗi chương.',
    whatYouLearn: 'Quy trình phân tích 6 bước &amp; bốn loại phân tích; thu thập, làm sạch, xử lý missing/outlier, chuẩn hoá (tidy data); thống kê mô tả (mean/median/mode, phương sai, IQR, phân phối); EDA (groupby, pivot, tương quan); kiểm định giả thuyết (H0/H1, p-value, t-test, chi-square, ANOVA); hồi quy tuyến tính/bội, dự báo, R²/RMSE, overfitting; chọn biểu đồ &amp; dựng dashboard (Excel, Power BI, Python); data storytelling, insight→quyết định, đạo đức dữ liệu.',
    requirements: 'Toán/thống kê phổ thông và tin học cơ bản. Nên biết một chút bảng tính (Excel) và Python căn bản; có thể dùng Google Colab để chạy code, khỏi cài đặt.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, tài liệu chính thức, YouTube, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phân tích dữ liệu là gì, góc HTTT/kinh doanh, công cụ, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Phân tích dữ liệu là gì|||Chapter 1 — What is data analysis', description: 'Quy trình phân tích, bốn loại: mô tả/chẩn đoán/dự đoán/đề xuất.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thu thập & làm sạch|||Chapter 2 — Collect & clean', description: 'Nguồn dữ liệu, missing/outlier, chuẩn hoá, tidy data.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thống kê mô tả|||Chapter 3 — Descriptive statistics', description: 'Mean/median/mode, phương sai, IQR, phân phối, trực quan.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Khám phá dữ liệu (EDA)|||Chapter 4 — Exploratory analysis', description: 'Groupby, pivot, tương quan; code Python/Excel.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kiểm định giả thuyết|||Chapter 5 — Hypothesis testing', description: 'H0/H1, p-value, t-test, chi-square, ANOVA.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Hồi quy & dự báo|||Chapter 6 — Regression & forecasting', description: 'Hồi quy tuyến tính/bội, dự báo, R²/RMSE, overfitting.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trực quan hoá & dashboard|||Chapter 7 — Visualization & dashboards', description: 'Chọn biểu đồ, Excel/Power BI/Python, thiết kế.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Báo cáo & ra quyết định|||Chapter 8 — Reporting & decisions', description: 'Data storytelling, insight→quyết định, đạo đức dữ liệu.', lessons: [c8, c8q] },
  ],
};
