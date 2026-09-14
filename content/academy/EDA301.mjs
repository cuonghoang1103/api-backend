/**
 * EDA301 — Data analysis. Giáo trình tham khảo (không upload PDF): "Practical
 * Statistics for Data Scientists" (Bruce), "Python for Data Analysis"
 * (McKinney), "R for Data Science" (Wickham), "Statistics" (Freedman).
 * 8 chương: quy trình phân tích → thu thập/làm sạch → thống kê mô tả/phân
 * phối → trực quan hoá → suy diễn/kiểm định → tương quan/hồi quy → chuỗi
 * thời gian/dự báo → công cụ Excel-Python-R & báo cáo kinh doanh.
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('eda301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách tham khảo (Bruce, McKinney, Wickham, Freedman), tài liệu miễn phí, YouTube, công cụ (Excel/Python/R), lộ trình tự học.',
  [[
    `<span class="eyebrow">EDA301 · Materials</span>
<h2>Data Analysis — resource hub</h2>
<p class="lead">Everything to learn how to turn raw data into business decisions — collecting &amp; cleaning data, descriptive &amp; inferential statistics, visualization, regression, time series, and reporting — in one place. The official FPTU syllabus &amp; slides live on <strong>FLM</strong>; below are the reference books and free legal resources this course draws from.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Practical Statistics for Data Scientists</em> — Peter Bruce, Andrew Bruce &amp; Peter Gedeck (O'Reilly) — statistics through a data-analyst lens.</li>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener"><em>Python for Data Analysis</em> — Wes McKinney</a> — the pandas creator's own book; free edition online.</li>
<li><a href="https://r4ds.hadley.nz/" target="_blank" rel="noopener"><em>R for Data Science</em> — Hadley Wickham &amp; Garrett Grolemund</a> — free online, the standard R/tidyverse text.</li>
<li><em>Statistics</em> — David Freedman, Robert Pisani &amp; Roger Purves — the classic rigorous intro to statistical reasoning.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a> — the Python data-analysis library used throughout this course.</li>
<li><a href="https://www.khanacademy.org/math/statistics-probability" target="_blank" rel="noopener">Khan Academy — Statistics &amp; Probability</a> — free video course, good for the math foundations.</li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — free micro-courses (Pandas, Data Visualization, Intro to SQL) with real datasets.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — statistics &amp; machine learning explained simply.</li>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — pandas, matplotlib &amp; Python data tutorials.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free Python/pandas notebooks, no install.</li>
<li>Microsoft Excel — PivotTable, formulas, Power Query (used in Chapter 8).</li>
<li><a href="https://posit.cloud/" target="_blank" rel="noopener">Posit Cloud (RStudio Cloud)</a> — free R/tidyverse in the browser.</li>
<li><a href="https://www.kaggle.com/datasets" target="_blank" rel="noopener">Kaggle Datasets</a> — public datasets to practice on.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the analysis process, descriptive statistics, distributions, and basic charts.</li>
<li><strong>Practice</strong> — clean a real messy dataset (Kaggle) and compute mean/median/std/IQR by hand, then check with a tool.</li>
<li><strong>Go deeper</strong> — hypothesis testing, correlation &amp; regression, time series forecasting.</li>
<li><strong>Job-ready</strong> — build one Excel or Python end-to-end report: clean → analyze → visualize → recommend.</li>
</ol></div>`,
    `<span class="eyebrow">EDA301 · Tài liệu</span>
<h2>Trung tâm tài liệu — Phân tích dữ liệu</h2>
<p class="lead">Mọi thứ để học biến dữ liệu thô thành quyết định kinh doanh — thu thập &amp; làm sạch dữ liệu, thống kê mô tả &amp; suy diễn, trực quan hoá, hồi quy, chuỗi thời gian và báo cáo — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo và nguồn miễn phí, hợp pháp môn này dựa vào.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Practical Statistics for Data Scientists</em> — Peter Bruce, Andrew Bruce &amp; Peter Gedeck (O'Reilly) — thống kê nhìn từ góc data analyst.</li>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener"><em>Python for Data Analysis</em> — Wes McKinney</a> — sách của chính tác giả thư viện pandas; có bản online miễn phí.</li>
<li><a href="https://r4ds.hadley.nz/" target="_blank" rel="noopener"><em>R for Data Science</em> — Hadley Wickham &amp; Garrett Grolemund</a> — miễn phí online, sách chuẩn về R/tidyverse.</li>
<li><em>Statistics</em> — David Freedman, Robert Pisani &amp; Roger Purves — sách nhập môn suy luận thống kê chặt chẽ, kinh điển.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">Tài liệu pandas</a> — thư viện phân tích dữ liệu Python dùng suốt môn này.</li>
<li><a href="https://www.khanacademy.org/math/statistics-probability" target="_blank" rel="noopener">Khan Academy — Statistics &amp; Probability</a> — video miễn phí, tốt cho nền toán.</li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — khoá học ngắn miễn phí (Pandas, Data Visualization, Intro to SQL) với dữ liệu thật.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — thống kê &amp; machine learning giảng dễ hiểu.</li>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — hướng dẫn pandas, matplotlib &amp; Python cho dữ liệu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook Python/pandas miễn phí, không cần cài.</li>
<li>Microsoft Excel — PivotTable, công thức, Power Query (dùng ở Chương 8).</li>
<li><a href="https://posit.cloud/" target="_blank" rel="noopener">Posit Cloud (RStudio Cloud)</a> — R/tidyverse miễn phí trên trình duyệt.</li>
<li><a href="https://www.kaggle.com/datasets" target="_blank" rel="noopener">Kaggle Datasets</a> — dữ liệu công khai để luyện tập.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình phân tích, thống kê mô tả, phân phối, và biểu đồ cơ bản.</li>
<li><strong>Luyện tập</strong> — làm sạch một tập dữ liệu thật lộn xộn (Kaggle) và tự tính mean/median/std/IQR, rồi kiểm bằng công cụ.</li>
<li><strong>Đào sâu</strong> — kiểm định giả thuyết, tương quan &amp; hồi quy, dự báo chuỗi thời gian.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng một báo cáo Excel hoặc Python trọn vẹn: làm sạch → phân tích → trực quan hoá → đề xuất.</li>
</ol></div>`,
  ]]);

const intro = doc('eda301-0-1-overview', 'Course overview: Data analysis|||Tổng quan: Phân tích dữ liệu',
  'Phân tích dữ liệu là gì, vì sao quan trọng với kinh doanh; 4 loại analytics; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">EDA301 · Lesson 0.1 · Overview</span>
<h2>Data Analysis</h2>
<p class="lead">This course teaches you to turn <strong>raw data into business decisions</strong>: collect it, clean it, describe it, test ideas about it, model relationships, and communicate findings a manager can act on. No prior statistics or programming is assumed — every concept comes with a worked example in Excel, Python or R.</p>
<h3>Why it matters for business</h3>
<p>Every function — marketing, finance, operations, HR — now runs on data: which campaign converts better, which customers churn, whether a price change actually raised revenue. A person who can answer these questions with evidence, not opinion, is the person decisions get delegated to.</p>
<h3>Four types of analytics</h3>
<ul>
<li><strong>Descriptive</strong> — what happened? (sales last quarter, average order value)</li>
<li><strong>Diagnostic</strong> — why did it happen? (why did churn spike in March)</li>
<li><strong>Predictive</strong> — what will happen? (forecast next quarter's demand)</li>
<li><strong>Prescriptive</strong> — what should we do? (which action maximizes revenue)</li>
</ul>
<h3>Roadmap</h3>
<p>Process &amp; data prep (Ch.1-2) → describe data &amp; visualize it (Ch.3-4) → test hypotheses &amp; model relationships (Ch.5-6) → forecast trends (Ch.7) → tools &amp; reporting for a business audience (Ch.8).</p>`,
    `<span class="eyebrow">EDA301 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích dữ liệu</h2>
<p class="lead">Môn này dạy bạn biến <strong>dữ liệu thô thành quyết định kinh doanh</strong>: thu thập, làm sạch, mô tả, kiểm định ý tưởng, mô hình hoá quan hệ, và trình bày kết quả để người quản lý hành động được. Không yêu cầu nền thống kê hay lập trình trước — mỗi khái niệm có ví dụ minh hoạ bằng Excel, Python hoặc R.</p>
<h3>Vì sao quan trọng với kinh doanh</h3>
<p>Mọi bộ phận — marketing, tài chính, vận hành, nhân sự — giờ đều chạy trên dữ liệu: chiến dịch nào chuyển đổi tốt hơn, khách nào rời bỏ, việc đổi giá có thật sự tăng doanh thu. Người trả lời được các câu hỏi này bằng bằng chứng, không phải cảm tính, là người được giao quyền quyết định.</p>
<h3>Bốn loại analytics</h3>
<ul>
<li><strong>Mô tả (Descriptive)</strong> — điều gì đã xảy ra? (doanh số quý trước, giá trị đơn hàng trung bình)</li>
<li><strong>Chẩn đoán (Diagnostic)</strong> — vì sao nó xảy ra? (vì sao churn tăng vọt tháng 3)</li>
<li><strong>Dự đoán (Predictive)</strong> — điều gì sẽ xảy ra? (dự báo nhu cầu quý tới)</li>
<li><strong>Kê toa (Prescriptive)</strong> — nên làm gì? (hành động nào tối đa hoá doanh thu)</li>
</ul>
<h3>Lộ trình</h3>
<p>Quy trình &amp; chuẩn bị dữ liệu (Ch.1-2) → mô tả &amp; trực quan hoá dữ liệu (Ch.3-4) → kiểm định giả thuyết &amp; mô hình quan hệ (Ch.5-6) → dự báo xu hướng (Ch.7) → công cụ &amp; báo cáo cho người kinh doanh (Ch.8).</p>`,
  ]]);

const c1 = doc('eda301-1-1-overview-process', '1.1 — Data analysis overview & process|||1.1 — Tổng quan phân tích dữ liệu & quy trình',
  'Định nghĩa phân tích dữ liệu; quy trình 5 bước hỏi→thu thập→làm sạch→phân tích→trình bày; 4 loại analytics; vai trò data analyst.',
  [[
    `<span class="eyebrow">EDA301 · Chapter 1 · Lesson 1.1</span>
<h2>Data analysis overview &amp; process</h2>
<h3>What is data analysis?</h3>
<p><strong>Data analysis</strong> is the process of inspecting, cleaning, transforming and modeling data to discover useful information and support decisions. A <strong>data analyst</strong> sits between raw numbers and the people who act on them — translating patterns into recommendations.</p>
<h3>The 5-step analysis process</h3>
<ol>
<li><strong>Ask</strong> — define the business question precisely (not "look at sales" but "did the June promotion increase repeat purchases?").</li>
<li><strong>Collect</strong> — gather the data needed (databases, surveys, logs, third-party sources).</li>
<li><strong>Clean &amp; prepare</strong> — fix missing values, duplicates, wrong types (Chapter 2).</li>
<li><strong>Analyze</strong> — describe, test, model (Chapters 3-7).</li>
<li><strong>Communicate</strong> — visualize and report findings a decision-maker can use (Chapter 8).</li>
</ol>
<pre><code>Bad question:  "How are sales doing?"
Good question: "Did average order value change after the June
                free-shipping promotion, compared to May?"
-- specific, comparable, testable
</code></pre>
<h3>Where this fits: BI vs analytics vs data science</h3>
<ul>
<li><strong>BI (dashboards)</strong> — reports what already happened, refreshed automatically.</li>
<li><strong>Data analysis (this course)</strong> — answers a specific question with statistics.</li>
<li><strong>Data science / ML</strong> — builds predictive models at scale, often production systems.</li>
</ul>
<div class="callout"><span class="badge">Start with the question</span> The single biggest cause of a wasted analysis is starting with the data ("what can I find?") instead of the decision ("what do we need to know to decide X?").</div>`,
    `<span class="eyebrow">EDA301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan phân tích dữ liệu &amp; quy trình</h2>
<h3>Phân tích dữ liệu là gì?</h3>
<p><strong>Phân tích dữ liệu</strong> là quá trình xem xét, làm sạch, biến đổi và mô hình hoá dữ liệu để tìm ra thông tin hữu ích và hỗ trợ quyết định. Một <strong>data analyst</strong> đứng giữa những con số thô và người hành động dựa trên chúng — chuyển hoá mẫu hình (pattern) thành đề xuất.</p>
<h3>Quy trình phân tích 5 bước</h3>
<ol>
<li><strong>Hỏi (Ask)</strong> — xác định chính xác câu hỏi kinh doanh (không phải "xem doanh số" mà "chương trình khuyến mãi tháng 6 có làm tăng mua lại không?").</li>
<li><strong>Thu thập (Collect)</strong> — gom dữ liệu cần (cơ sở dữ liệu, khảo sát, log, nguồn bên thứ ba).</li>
<li><strong>Làm sạch &amp; chuẩn bị</strong> — sửa giá trị thiếu, trùng lặp, sai kiểu dữ liệu (Chương 2).</li>
<li><strong>Phân tích (Analyze)</strong> — mô tả, kiểm định, mô hình hoá (Chương 3-7).</li>
<li><strong>Trình bày (Communicate)</strong> — trực quan hoá và báo cáo kết quả để người quyết định dùng được (Chương 8).</li>
</ol>
<pre><code>Câu hỏi tệ: "Doanh số thế nào?"
Câu hỏi tốt: "Giá trị đơn hàng trung bình có thay đổi sau
              khuyến mãi freeship tháng 6, so với tháng 5?"
-- cụ thể, so sánh được, kiểm định được
</code></pre>
<h3>Vị trí của môn này: BI vs analytics vs data science</h3>
<ul>
<li><strong>BI (dashboard)</strong> — báo cáo những gì đã xảy ra, tự làm mới liên tục.</li>
<li><strong>Phân tích dữ liệu (môn này)</strong> — trả lời một câu hỏi cụ thể bằng thống kê.</li>
<li><strong>Data science / ML</strong> — dựng mô hình dự đoán ở quy mô lớn, thường thành hệ thống sản xuất.</li>
</ul>
<div class="callout"><span class="badge">Bắt đầu từ câu hỏi</span> Nguyên nhân lớn nhất khiến một phân tích lãng phí là bắt đầu từ dữ liệu ("tìm được gì đây?") thay vì từ quyết định ("cần biết gì để quyết X?").</div>`,
  ]]);

const c1q = quiz('eda301-quiz-1', 'Quiz 1 — Overview & process|||Quiz 1 — Tổng quan & quy trình', [
  { id: 'q1', question: 'Bước đầu tiên đúng của quy trình phân tích dữ liệu là gì?', options: ['Thu thập dữ liệu ngay', 'Xác định câu hỏi kinh doanh cụ thể', 'Vẽ biểu đồ', 'Chạy mô hình dự đoán'], correctIndex: 1, explanation: 'Phải hỏi đúng câu hỏi trước, nếu không cả quy trình sau đều lạc hướng.' },
  { id: 'q2', question: 'Loại analytics trả lời "vì sao nó xảy ra?" là?', options: ['Descriptive', 'Diagnostic', 'Predictive', 'Prescriptive'], correctIndex: 1, explanation: 'Diagnostic đi tìm nguyên nhân của điều đã xảy ra.' },
  { id: 'q3', question: 'Phân biệt BI dashboard với phân tích dữ liệu (data analysis) ở điểm nào?', options: ['BI trả lời câu hỏi cụ thể còn analysis chỉ báo cáo', 'Analysis trả lời câu hỏi cụ thể bằng thống kê còn BI báo cáo tự động điều đã xảy ra', 'Cả hai giống nhau hoàn toàn', 'BI luôn cần ML'], correctIndex: 1, explanation: 'Dashboard BI làm mới tự động, còn phân tích dữ liệu đi sâu trả lời một câu hỏi cụ thể.' },
]);

const c2 = doc('eda301-2-1-collect-clean-prep', '2.1 — Data collection, cleaning & preparation|||2.1 — Thu thập, làm sạch & chuẩn bị dữ liệu',
  'Nguồn dữ liệu nội bộ/bên ngoài; loại dữ liệu; giá trị thiếu, trùng lặp, outlier; chuẩn hoá & mã hoá; ví dụ pandas.',
  [[
    `<span class="eyebrow">EDA301 · Chapter 2 · Lesson 2.1</span>
<h2>Data collection, cleaning &amp; preparation</h2>
<h3>Where data comes from</h3>
<ul>
<li><strong>Internal</strong> — company databases (sales, CRM, ERP), transaction logs, website/app analytics.</li>
<li><strong>External</strong> — surveys, public datasets, government statistics, APIs, purchased market-research data.</li>
</ul>
<h3>Data types</h3>
<ul>
<li><strong>Structured</strong> (rows/columns, e.g. a sales table) vs <strong>unstructured</strong> (free text, images).</li>
<li><strong>Quantitative</strong> (numbers: revenue, age) vs <strong>qualitative</strong> (categories: region, gender).</li>
<li><strong>Cross-sectional</strong> (one point in time, many subjects) vs <strong>time series</strong> (one subject over time) vs <strong>panel</strong> (many subjects over time).</li>
</ul>
<h3>Cleaning: the four usual suspects</h3>
<ul>
<li><strong>Missing values</strong> — delete the row (if few), or impute with mean/median/mode, or a "missing" flag.</li>
<li><strong>Duplicates</strong> — same record entered twice (e.g. a customer signing up twice with a typo'd email).</li>
<li><strong>Outliers</strong> — extreme values; investigate before deleting — a $50,000 order may be real, not an error.</li>
<li><strong>Inconsistent formats</strong> — "VN" vs "Vietnam", "01/02/2026" vs "2026-02-01", extra whitespace.</li>
</ul>
<pre><code># Python (pandas) - typical cleaning steps
df = df.drop_duplicates()
df["age"] = df["age"].fillna(df["age"].median())
df["country"] = df["country"].str.strip().str.upper()
df = df[df["revenue"] &gt;= 0]          # remove impossible values
</code></pre>
<h3>Preparation for analysis</h3>
<p>Once clean: standardize units (VND vs USD), encode categories (e.g. "region" into dummy columns for regression), and merge tables (join orders to customers on <code>customer_id</code>).</p>
<div class="callout"><span class="badge">80% of the work</span> Analysts commonly say cleaning &amp; preparation take 60-80% of a project's time — a flashy chart on dirty data is worse than no chart at all.</div>`,
    `<span class="eyebrow">EDA301 · Chương 2 · Bài 2.1</span>
<h2>Thu thập, làm sạch &amp; chuẩn bị dữ liệu</h2>
<h3>Dữ liệu đến từ đâu</h3>
<ul>
<li><strong>Nội bộ</strong> — cơ sở dữ liệu công ty (bán hàng, CRM, ERP), log giao dịch, phân tích website/app.</li>
<li><strong>Bên ngoài</strong> — khảo sát, dữ liệu công khai, thống kê nhà nước, API, dữ liệu nghiên cứu thị trường mua.</li>
</ul>
<h3>Các loại dữ liệu</h3>
<ul>
<li><strong>Có cấu trúc</strong> (dòng/cột, vd bảng bán hàng) vs <strong>không cấu trúc</strong> (văn bản tự do, hình ảnh).</li>
<li><strong>Định lượng</strong> (số: doanh thu, tuổi) vs <strong>định tính</strong> (nhóm: khu vực, giới tính).</li>
<li><strong>Cắt ngang (cross-sectional)</strong> (một thời điểm, nhiều đối tượng) vs <strong>chuỗi thời gian</strong> (một đối tượng theo thời gian) vs <strong>panel</strong> (nhiều đối tượng theo thời gian).</li>
</ul>
<h3>Làm sạch: bốn "nghi phạm" thường gặp</h3>
<ul>
<li><strong>Giá trị thiếu</strong> — xoá dòng (nếu ít), hoặc điền bằng mean/median/mode, hoặc gắn cờ "thiếu".</li>
<li><strong>Trùng lặp</strong> — cùng một bản ghi nhập hai lần (vd khách đăng ký hai lần với email gõ sai).</li>
<li><strong>Outlier (giá trị bất thường)</strong> — giá trị cực đoan; tìm hiểu trước khi xoá — đơn hàng 50.000 USD có thể là thật, không phải lỗi.</li>
<li><strong>Định dạng không nhất quán</strong> — "VN" vs "Vietnam", "01/02/2026" vs "2026-02-01", khoảng trắng dư.</li>
</ul>
<pre><code># Python (pandas) - các bước làm sạch điển hình
df = df.drop_duplicates()
df["age"] = df["age"].fillna(df["age"].median())
df["country"] = df["country"].str.strip().str.upper()
df = df[df["revenue"] &gt;= 0]          # loại giá trị vô lý
</code></pre>
<h3>Chuẩn bị cho phân tích</h3>
<p>Sau khi sạch: chuẩn hoá đơn vị (VND vs USD), mã hoá nhóm (vd "khu vực" thành các cột dummy cho hồi quy), và ghép bảng (nối đơn hàng với khách hàng theo <code>customer_id</code>).</p>
<div class="callout"><span class="badge">80% công việc</span> Các analyst thường nói làm sạch &amp; chuẩn bị chiếm 60-80% thời gian dự án — một biểu đồ đẹp trên dữ liệu bẩn còn tệ hơn không có biểu đồ nào.</div>`,
  ]]);

const c2q = quiz('eda301-quiz-2', 'Quiz 2 — Collection & cleaning|||Quiz 2 — Thu thập & làm sạch', [
  { id: 'q1', question: 'Dữ liệu bán hàng công ty ghi lại nội bộ (CRM, ERP) thuộc loại nguồn nào?', options: ['Nội bộ', 'Bên ngoài', 'Không cấu trúc', 'Panel'], correctIndex: 0, explanation: 'CRM/ERP là hệ thống nội bộ công ty tự vận hành.' },
  { id: 'q2', question: 'Trước khi xoá một outlier, analyst nên làm gì?', options: ['Xoá ngay để dữ liệu đẹp', 'Tìm hiểu xem giá trị đó có thật không trước khi quyết định', 'Thay bằng số 0', 'Bỏ qua cột đó'], correctIndex: 1, explanation: 'Outlier có thể là giá trị thật (đơn hàng lớn), xoá nhầm sẽ mất thông tin quan trọng.' },
  { id: 'q3', question: 'Vì sao làm sạch dữ liệu thường chiếm phần lớn thời gian dự án?', options: ['Vì không quan trọng', 'Vì dữ liệu thực tế thường thiếu/trùng/sai định dạng cần xử lý trước khi phân tích tin được', 'Vì luật yêu cầu', 'Vì máy chậm'], correctIndex: 1, explanation: 'Dữ liệu thô luôn có lỗi; phân tích trên dữ liệu bẩn cho ra kết luận sai.' },
]);

const c3 = doc('eda301-3-1-descriptive-distributions', '3.1 — Descriptive statistics & distributions|||3.1 — Thống kê mô tả & phân phối',
  'Đo xu hướng trung tâm (mean/median/mode), đo phân tán (range/variance/std/IQR), hình dạng phân phối, quy tắc 68-95-99.7.',
  [[
    `<span class="eyebrow">EDA301 · Chapter 3 · Lesson 3.1</span>
<h2>Descriptive statistics &amp; distributions</h2>
<h3>Central tendency: where is the "middle"?</h3>
<ul>
<li><strong>Mean</strong> — the average; sensitive to outliers.</li>
<li><strong>Median</strong> — the middle value when sorted; robust to outliers (better for skewed data like income).</li>
<li><strong>Mode</strong> — the most frequent value; the only option for categorical data.</li>
</ul>
<h3>Dispersion: how spread out is it?</h3>
<ul>
<li><strong>Range</strong> — max − min.</li>
<li><strong>Variance / standard deviation (SD)</strong> — average squared distance from the mean (variance), or its square root (SD) — same unit as the data.</li>
<li><strong>IQR (interquartile range)</strong> — Q3 − Q1, the spread of the middle 50%; used to flag outliers.</li>
</ul>
<pre><code>Data: 20, 22, 23, 25, 100 (revenue, $k)
Mean   = (20+22+23+25+100)/5 = 38
Median = 23                       -- much more typical than the mean!
Mode   = none (all distinct)
-- the 100 is an outlier pulling the mean way above the "typical" value
</code></pre>
<h3>Distribution shapes</h3>
<ul>
<li><strong>Normal (bell-shaped)</strong> — symmetric around the mean; mean = median = mode.</li>
<li><strong>Right-skewed</strong> — long tail to the right (e.g. income, house prices); mean &gt; median.</li>
<li><strong>Left-skewed</strong> — long tail to the left; mean &lt; median.</li>
</ul>
<h3>The empirical rule (for roughly normal data)</h3>
<pre><code>68% of values fall within  1 SD of the mean
95% of values fall within  2 SD of the mean
99.7% of values fall within 3 SD of the mean
</code></pre>
<div class="callout"><span class="badge">Mean vs median</span> If mean and median are far apart, the data is skewed or has outliers — report the median (or both) so the "typical" case isn't hidden behind a few extreme values.</div>`,
    `<span class="eyebrow">EDA301 · Chương 3 · Bài 3.1</span>
<h2>Thống kê mô tả &amp; phân phối</h2>
<h3>Xu hướng trung tâm: "giữa" nằm ở đâu?</h3>
<ul>
<li><strong>Mean (trung bình)</strong> — giá trị bình quân; nhạy với outlier.</li>
<li><strong>Median (trung vị)</strong> — giá trị giữa khi sắp xếp; bền với outlier (tốt hơn cho dữ liệu lệch như thu nhập).</li>
<li><strong>Mode (mốt)</strong> — giá trị xuất hiện nhiều nhất; lựa chọn duy nhất cho dữ liệu phân loại.</li>
</ul>
<h3>Phân tán: trải rộng đến đâu?</h3>
<ul>
<li><strong>Range (khoảng biến thiên)</strong> — max − min.</li>
<li><strong>Variance / độ lệch chuẩn (SD)</strong> — bình phương khoảng cách trung bình tới mean (variance), hoặc căn bậc hai của nó (SD) — cùng đơn vị với dữ liệu.</li>
<li><strong>IQR (khoảng liên tứ phân vị)</strong> — Q3 − Q1, độ trải của 50% giữa; dùng để phát hiện outlier.</li>
</ul>
<pre><code>Dữ liệu: 20, 22, 23, 25, 100 (doanh thu, triệu $)
Mean   = (20+22+23+25+100)/5 = 38
Median = 23                       -- gần với giá trị "điển hình" hơn mean!
Mode   = không có (tất cả khác nhau)
-- 100 là outlier kéo mean lên cao hơn nhiều mức "điển hình"
</code></pre>
<h3>Hình dạng phân phối</h3>
<ul>
<li><strong>Chuẩn (hình chuông)</strong> — đối xứng quanh mean; mean = median = mode.</li>
<li><strong>Lệch phải</strong> — đuôi dài bên phải (vd thu nhập, giá nhà); mean &gt; median.</li>
<li><strong>Lệch trái</strong> — đuôi dài bên trái; mean &lt; median.</li>
</ul>
<h3>Quy tắc thực nghiệm (cho dữ liệu gần chuẩn)</h3>
<pre><code>68% giá trị nằm trong  1 SD quanh mean
95% giá trị nằm trong  2 SD quanh mean
99.7% giá trị nằm trong 3 SD quanh mean
</code></pre>
<div class="callout"><span class="badge">Mean vs median</span> Nếu mean và median cách xa nhau, dữ liệu bị lệch hoặc có outlier — nên báo cáo median (hoặc cả hai) để trường hợp "điển hình" không bị vài giá trị cực đoan che khuất.</div>`,
  ]]);

const c3q = quiz('eda301-quiz-3', 'Quiz 3 — Descriptive & distributions|||Quiz 3 — Mô tả & phân phối', [
  { id: 'q1', question: 'Với dữ liệu bị lệch mạnh do vài outlier (vd thu nhập), thước đo trung tâm nào đáng tin hơn?', options: ['Mean', 'Median', 'Mode', 'Range'], correctIndex: 1, explanation: 'Median bền với outlier, phản ánh giá trị "điển hình" tốt hơn mean khi dữ liệu lệch.' },
  { id: 'q2', question: 'Độ lệch chuẩn (SD) đo điều gì?', options: ['Giá trị xuất hiện nhiều nhất', 'Mức phân tán trung bình quanh mean, cùng đơn vị dữ liệu', 'Giá trị giữa', 'Số lượng outlier'], correctIndex: 1, explanation: 'SD là căn bậc hai của variance, đo độ trải dữ liệu quanh mean.' },
  { id: 'q3', question: 'Theo quy tắc thực nghiệm, khoảng bao nhiêu % dữ liệu (gần chuẩn) nằm trong 2 SD quanh mean?', options: ['68%', '95%', '99.7%', '50%'], correctIndex: 1, explanation: '68-95-99.7 lần lượt ứng với 1-2-3 SD quanh mean.' },
]);

const c4 = doc('eda301-4-1-data-visualization', '4.1 — Data visualization|||4.1 — Trực quan hoá dữ liệu',
  'Chọn biểu đồ theo loại dữ liệu/câu hỏi; bar/line/pie/histogram/boxplot/scatter/heatmap; nguyên tắc dashboard; lỗi thường gặp.',
  [[
    `<span class="eyebrow">EDA301 · Chapter 4 · Lesson 4.1</span>
<h2>Data visualization</h2>
<h3>Why visualize</h3>
<p>A chart lets a reader see a pattern (trend, comparison, distribution, relationship) in seconds that a table of numbers would take minutes to reveal — but only if the chart type matches the question.</p>
<h3>Choosing the right chart</h3>
<ul>
<li><strong>Comparison between categories</strong> → bar chart.</li>
<li><strong>Trend over time</strong> → line chart.</li>
<li><strong>Part-of-whole</strong> (few categories only) → pie / stacked bar.</li>
<li><strong>Distribution of one variable</strong> → histogram or boxplot.</li>
<li><strong>Relationship between two numeric variables</strong> → scatter plot.</li>
<li><strong>Relationship across two categorical dimensions</strong> → heatmap.</li>
</ul>
<pre><code>Question                              -&gt; Chart
"Which region sold most?"             -&gt; bar chart
"Is revenue growing month by month?"  -&gt; line chart
"How is order value distributed?"     -&gt; histogram / boxplot
"Does ad spend relate to sales?"      -&gt; scatter plot
</code></pre>
<h3>Dashboard design principles</h3>
<ul>
<li>Lead with the answer, not the data — put the key number/chart top-left.</li>
<li>One idea per chart; avoid cramming 10 metrics into one visual.</li>
<li>Consistent colors across a dashboard (same category = same color everywhere).</li>
</ul>
<h3>Common pitfalls</h3>
<ul>
<li><strong>Truncated y-axis</strong> — starting a bar chart at a value other than 0 exaggerates small differences.</li>
<li><strong>3D / pie chart overload</strong> — 3D distorts perception; pie charts with more than 5 slices are unreadable.</li>
<li><strong>Wrong chart for the data</strong> — a line chart implies continuity; don't use it to connect unrelated categories.</li>
</ul>
<div class="callout"><span class="badge">Excel/Python quick pick</span> Excel: Insert → Recommended Charts. Python: <code>df.plot(kind="bar")</code> (pandas) or <code>seaborn.histplot(df["age"])</code> for a quick histogram.</div>`,
    `<span class="eyebrow">EDA301 · Chương 4 · Bài 4.1</span>
<h2>Trực quan hoá dữ liệu</h2>
<h3>Vì sao trực quan hoá</h3>
<p>Một biểu đồ giúp người xem thấy mẫu hình (xu hướng, so sánh, phân phối, quan hệ) trong vài giây — điều mà một bảng số cần vài phút mới thấy được — nhưng chỉ khi loại biểu đồ khớp với câu hỏi.</p>
<h3>Chọn đúng biểu đồ</h3>
<ul>
<li><strong>So sánh giữa các nhóm</strong> → biểu đồ cột (bar).</li>
<li><strong>Xu hướng theo thời gian</strong> → biểu đồ đường (line).</li>
<li><strong>Tỉ trọng trong tổng</strong> (ít nhóm) → pie / stacked bar.</li>
<li><strong>Phân phối một biến</strong> → histogram hoặc boxplot.</li>
<li><strong>Quan hệ giữa hai biến số</strong> → scatter plot.</li>
<li><strong>Quan hệ trên hai chiều phân loại</strong> → heatmap.</li>
</ul>
<pre><code>Câu hỏi                                    -&gt; Biểu đồ
"Khu vực nào bán nhiều nhất?"              -&gt; biểu đồ cột
"Doanh thu có tăng theo từng tháng?"       -&gt; biểu đồ đường
"Giá trị đơn hàng phân phối thế nào?"      -&gt; histogram / boxplot
"Chi phí quảng cáo có liên quan doanh số?" -&gt; scatter plot
</code></pre>
<h3>Nguyên tắc thiết kế dashboard</h3>
<ul>
<li>Dẫn bằng câu trả lời, không phải dữ liệu thô — đặt số/biểu đồ quan trọng nhất ở góc trên-trái.</li>
<li>Một ý cho một biểu đồ; tránh nhồi 10 chỉ số vào một hình.</li>
<li>Màu nhất quán trên cả dashboard (cùng nhóm = cùng màu ở mọi nơi).</li>
</ul>
<h3>Lỗi thường gặp</h3>
<ul>
<li><strong>Cắt trục y</strong> — bắt đầu biểu đồ cột từ giá trị khác 0 làm khác biệt nhỏ trông to hơn thực tế.</li>
<li><strong>Lạm dụng 3D / pie chart</strong> — 3D bóp méo nhận thức; pie chart quá 5 phần thì khó đọc.</li>
<li><strong>Sai loại biểu đồ</strong> — biểu đồ đường ngụ ý liên tục; đừng dùng nó để nối các nhóm phân loại không liên quan.</li>
</ul>
<div class="callout"><span class="badge">Chọn nhanh Excel/Python</span> Excel: Insert → Recommended Charts. Python: <code>df.plot(kind="bar")</code> (pandas) hoặc <code>seaborn.histplot(df["age"])</code> để vẽ nhanh histogram.</div>`,
  ]]);

const c4q = quiz('eda301-quiz-4', 'Quiz 4 — Data visualization|||Quiz 4 — Trực quan hoá', [
  { id: 'q1', question: 'Muốn xem xu hướng doanh thu theo từng tháng trong năm, nên dùng biểu đồ gì?', options: ['Pie chart', 'Biểu đồ đường (line)', 'Boxplot', 'Heatmap'], correctIndex: 1, explanation: 'Line chart phù hợp nhất để thấy xu hướng theo thời gian.' },
  { id: 'q2', question: 'Lỗi "cắt trục y" (không bắt đầu từ 0) trong biểu đồ cột gây ra điều gì?', options: ['Không ảnh hưởng gì', 'Làm khác biệt nhỏ trông có vẻ lớn hơn thực tế', 'Làm biểu đồ chạy nhanh hơn', 'Tự động sửa outlier'], correctIndex: 1, explanation: 'Trục y không bắt đầu từ 0 làm sai lệch cảm nhận về tỉ lệ khác biệt.' },
  { id: 'q3', question: 'Muốn xem quan hệ giữa chi tiêu quảng cáo và doanh số (hai biến số), nên dùng?', options: ['Pie chart', 'Scatter plot', 'Bar chart theo tháng', 'Mode'], correctIndex: 1, explanation: 'Scatter plot cho thấy quan hệ giữa hai biến số liên tục.' },
]);

const c5 = doc('eda301-5-1-inferential-hypothesis', '5.1 — Inferential statistics & hypothesis testing|||5.1 — Thống kê suy diễn & kiểm định giả thuyết',
  'Population vs sample, khoảng tin cậy, giả thuyết H0/H1, p-value, mức ý nghĩa, lỗi loại I/II, ví dụ t-test.',
  [[
    `<span class="eyebrow">EDA301 · Chapter 5 · Lesson 5.1</span>
<h2>Inferential statistics &amp; hypothesis testing</h2>
<h3>Population vs sample</h3>
<p>The <strong>population</strong> is everyone/everything you care about (all customers); a <strong>sample</strong> is the subset you actually measure. <strong>Inferential statistics</strong> uses the sample to draw conclusions about the population — with a margin of uncertainty. Sampling must be <strong>random</strong> (or otherwise representative) or conclusions won't generalize.</p>
<h3>Confidence intervals</h3>
<p>A <strong>95% confidence interval</strong> for a sample mean is a range that would contain the true population mean in 95% of repeated samples — e.g. "average order value is 250,000 ± 15,000 VND (95% CI)".</p>
<h3>Hypothesis testing</h3>
<ul>
<li><strong>Null hypothesis (H0)</strong> — the "nothing changed" claim (e.g. the promotion had no effect).</li>
<li><strong>Alternative hypothesis (H1)</strong> — what you're trying to show (the promotion increased sales).</li>
<li><strong>p-value</strong> — the probability of seeing data this extreme <em>if H0 were true</em>. Small p-value (usually &lt; 0.05) → reject H0.</li>
<li><strong>Significance level (α)</strong> — the threshold you decide in advance, commonly 0.05.</li>
</ul>
<pre><code>Decision rule (alpha = 0.05):
  p-value &lt; 0.05  -&gt;  reject H0    (result is "statistically significant")
  p-value &gt;= 0.05 -&gt;  fail to reject H0 (not enough evidence)
</code></pre>
<h3>Type I &amp; Type II errors</h3>
<ul>
<li><strong>Type I error</strong> — rejecting H0 when it's actually true (a "false positive": you claim an effect that isn't real).</li>
<li><strong>Type II error</strong> — failing to reject H0 when H1 is actually true (a "false negative": you miss a real effect).</li>
</ul>
<h3>Worked example: two-sample t-test</h3>
<p>Question: did average order value differ between customers who saw the promo banner and those who didn't? A <strong>t-test</strong> compares the two group means, accounting for sample size and variance, and returns a p-value.</p>
<pre><code># Python (scipy)
from scipy import stats
t_stat, p_value = stats.ttest_ind(group_promo, group_control)
# p_value &lt; 0.05 -&gt; the difference is unlikely to be random chance
</code></pre>
<div class="callout"><span class="badge">Significant ≠ important</span> With a large enough sample, even a tiny, business-irrelevant difference can be "statistically significant". Always report the effect size (how big), not just the p-value (how sure).</div>`,
    `<span class="eyebrow">EDA301 · Chương 5 · Bài 5.1</span>
<h2>Thống kê suy diễn &amp; kiểm định giả thuyết</h2>
<h3>Population vs sample</h3>
<p><strong>Population (tổng thể)</strong> là toàn bộ đối tượng bạn quan tâm (mọi khách hàng); <strong>sample (mẫu)</strong> là tập con bạn thực sự đo. <strong>Thống kê suy diễn</strong> dùng mẫu để rút ra kết luận về tổng thể — kèm một mức độ không chắc chắn. Việc lấy mẫu phải <strong>ngẫu nhiên</strong> (hoặc đại diện) thì kết luận mới suy rộng được.</p>
<h3>Khoảng tin cậy</h3>
<p><strong>Khoảng tin cậy 95%</strong> cho trung bình mẫu là một khoảng mà trong 95% lần lấy mẫu lặp lại sẽ chứa trung bình thật của tổng thể — vd "giá trị đơn hàng trung bình là 250.000 ± 15.000 VND (KTC 95%)".</p>
<h3>Kiểm định giả thuyết</h3>
<ul>
<li><strong>Giả thuyết không (H0)</strong> — khẳng định "không có gì thay đổi" (vd khuyến mãi không có tác dụng).</li>
<li><strong>Giả thuyết đối (H1)</strong> — điều bạn muốn chứng minh (khuyến mãi làm tăng doanh số).</li>
<li><strong>p-value</strong> — xác suất quan sát dữ liệu cực đoan như vậy <em>nếu H0 đúng</em>. p-value nhỏ (thường &lt; 0.05) → bác bỏ H0.</li>
<li><strong>Mức ý nghĩa (α)</strong> — ngưỡng quyết định trước, thường là 0.05.</li>
</ul>
<pre><code>Quy tắc quyết định (alpha = 0.05):
  p-value &lt; 0.05  -&gt;  bác bỏ H0    (kết quả "có ý nghĩa thống kê")
  p-value &gt;= 0.05 -&gt;  chưa đủ bằng chứng bác bỏ H0
</code></pre>
<h3>Lỗi loại I &amp; loại II</h3>
<ul>
<li><strong>Lỗi loại I</strong> — bác bỏ H0 khi nó thực ra đúng ("dương giả": kết luận có tác dụng nhưng thực ra không).</li>
<li><strong>Lỗi loại II</strong> — không bác bỏ H0 khi H1 thực ra đúng ("âm giả": bỏ lỡ một tác dụng thật).</li>
</ul>
<h3>Ví dụ: t-test hai mẫu</h3>
<p>Câu hỏi: giá trị đơn hàng trung bình có khác nhau giữa khách thấy banner khuyến mãi và khách không thấy? <strong>t-test</strong> so sánh trung bình hai nhóm, có tính đến cỡ mẫu và phương sai, và trả về một p-value.</p>
<pre><code># Python (scipy)
from scipy import stats
t_stat, p_value = stats.ttest_ind(group_promo, group_control)
# p_value &lt; 0.05 -&gt; sự khác biệt khó là do ngẫu nhiên
</code></pre>
<div class="callout"><span class="badge">Có ý nghĩa ≠ quan trọng</span> Với mẫu đủ lớn, ngay cả một khác biệt rất nhỏ, không đáng kể về kinh doanh cũng có thể "có ý nghĩa thống kê". Luôn báo cáo cỡ hiệu ứng (effect size — lớn bao nhiêu), không chỉ p-value (chắc bao nhiêu).</div>`,
  ]]);

const c5q = quiz('eda301-quiz-5', 'Quiz 5 — Inference & hypothesis testing|||Quiz 5 — Suy diễn & kiểm định giả thuyết', [
  { id: 'q1', question: 'p-value nhỏ (vd nhỏ hơn 0.05) cho phép kết luận gì?', options: ['Chắc chắn H1 đúng 100%', 'Có bằng chứng để bác bỏ H0', 'Mẫu chắc chắn sai', 'Không cần thu thập thêm dữ liệu bao giờ'], correctIndex: 1, explanation: 'p-value nhỏ nghĩa là dữ liệu khó xảy ra nếu H0 đúng, nên có cơ sở bác bỏ H0 — không phải chứng minh tuyệt đối.' },
  { id: 'q2', question: 'Lỗi loại I (Type I error) là gì?', options: ['Không bác bỏ H0 khi H1 đúng', 'Bác bỏ H0 khi H0 thực ra đúng (dương giả)', 'Lấy mẫu quá nhỏ', 'Tính sai trung bình'], correctIndex: 1, explanation: 'Type I error là kết luận có tác dụng/khác biệt trong khi thực ra không có.' },
  { id: 'q3', question: '"Có ý nghĩa thống kê" (p-value nhỏ) khác gì với "quan trọng về kinh doanh"?', options: ['Luôn giống nhau', 'Mẫu lớn có thể làm khác biệt rất nhỏ vẫn có ý nghĩa thống kê nhưng không đáng kể thực tế', 'p-value luôn phản ánh đúng tầm quan trọng', 'Không liên quan gì đến cỡ mẫu'], correctIndex: 1, explanation: 'Cỡ mẫu lớn dễ khiến khác biệt nhỏ đạt ý nghĩa thống kê; cần xem thêm effect size để đánh giá độ quan trọng thực tế.' },
]);

const c6 = doc('eda301-6-1-correlation-regression', '6.1 — Correlation & regression|||6.1 — Tương quan & hồi quy',
  'Hệ số tương quan Pearson r; tương quan không phải nhân quả; hồi quy tuyến tính đơn y=a+bx; R-squared; hồi quy đa biến.',
  [[
    `<span class="eyebrow">EDA301 · Chapter 6 · Lesson 6.1</span>
<h2>Correlation &amp; regression</h2>
<h3>Correlation: how two variables move together</h3>
<p>The <strong>Pearson correlation coefficient (r)</strong> ranges from −1 to +1: +1 = perfect positive (both rise together), −1 = perfect negative (one rises, other falls), 0 = no linear relationship. Visualize with a <strong>scatter plot</strong> first — r only captures <em>linear</em> relationships.</p>
<pre><code>r &gt; 0.7   -&gt; strong positive relationship
r ≈ 0     -&gt; little/no linear relationship
r &lt; -0.7  -&gt; strong negative relationship
</code></pre>
<h3>Correlation is not causation</h3>
<p>Ice cream sales and drowning deaths correlate — both rise in summer heat. Neither causes the other; a third variable (temperature) drives both. Before claiming "X causes Y", rule out confounders and consider running a controlled experiment (A/B test).</p>
<h3>Simple linear regression</h3>
<p>Regression fits a line <strong>y = a + b·x</strong> to predict a numeric outcome (y) from a predictor (x): <code>a</code> is the intercept, <code>b</code> is the slope — "for each +1 unit of x, y changes by b".</p>
<pre><code>Example: revenue = 5,000,000 + 120,000 * ad_spend
-&gt; every extra $1 of ad spend is associated with +120,000 VND revenue
   (holding everything else the model ignores constant)
</code></pre>
<h3>R-squared: how good is the fit?</h3>
<p><strong>R²</strong> (0 to 1) is the share of variation in y explained by the model. R² = 0.65 means the model explains 65% of the variation in revenue; the rest is noise or missing predictors.</p>
<h3>Multiple regression</h3>
<p>Real business questions usually need more than one predictor: <code>revenue = a + b1·ad_spend + b2·price + b3·season</code> — each coefficient is the effect of that variable <em>holding the others constant</em>.</p>
<div class="callout"><span class="badge">Python quick fit</span> <code>import statsmodels.api as sm; model = sm.OLS(y, sm.add_constant(X)).fit(); model.summary()</code> — gives coefficients, R², and p-values for each predictor in one call.</div>`,
    `<span class="eyebrow">EDA301 · Chương 6 · Bài 6.1</span>
<h2>Tương quan &amp; hồi quy</h2>
<h3>Tương quan: hai biến di chuyển cùng nhau thế nào</h3>
<p><strong>Hệ số tương quan Pearson (r)</strong> nằm trong khoảng −1 đến +1: +1 = tương quan dương hoàn hảo (cùng tăng), −1 = tương quan âm hoàn hảo (một tăng một giảm), 0 = không có quan hệ tuyến tính. Nên vẽ <strong>scatter plot</strong> trước — r chỉ nắm được quan hệ <em>tuyến tính</em>.</p>
<pre><code>r &gt; 0.7   -&gt; quan hệ dương mạnh
r ≈ 0     -&gt; ít/không có quan hệ tuyến tính
r &lt; -0.7  -&gt; quan hệ âm mạnh
</code></pre>
<h3>Tương quan không phải nhân quả</h3>
<p>Doanh số kem và số ca đuối nước có tương quan — cả hai đều tăng vào mùa nóng. Không cái nào gây ra cái nào; một biến thứ ba (nhiệt độ) tác động lên cả hai. Trước khi khẳng định "X gây ra Y", hãy loại trừ biến gây nhiễu và xem xét chạy thí nghiệm có kiểm soát (A/B test).</p>
<h3>Hồi quy tuyến tính đơn</h3>
<p>Hồi quy khớp một đường thẳng <strong>y = a + b·x</strong> để dự đoán một kết quả số (y) từ một biến dự báo (x): <code>a</code> là hệ số chặn, <code>b</code> là độ dốc — "mỗi +1 đơn vị x, y thay đổi b".</p>
<pre><code>Ví dụ: doanh_thu = 5.000.000 + 120.000 * chi_quang_cao
-&gt; mỗi 1 đơn vị chi quảng cáo tăng thêm gắn với +120.000 VND doanh thu
   (giữ mọi thứ khác mô hình bỏ qua không đổi)
</code></pre>
<h3>R-squared: mô hình khớp tốt đến đâu?</h3>
<p><strong>R²</strong> (0 đến 1) là phần biến động của y được mô hình giải thích. R² = 0.65 nghĩa là mô hình giải thích được 65% biến động doanh thu; phần còn lại là nhiễu hoặc thiếu biến dự báo.</p>
<h3>Hồi quy đa biến</h3>
<p>Câu hỏi kinh doanh thật thường cần hơn một biến dự báo: <code>doanh_thu = a + b1·chi_quang_cao + b2·gia + b3·mua_vu</code> — mỗi hệ số là tác động của biến đó <em>khi giữ các biến khác không đổi</em>.</p>
<div class="callout"><span class="badge">Khớp nhanh bằng Python</span> <code>import statsmodels.api as sm; model = sm.OLS(y, sm.add_constant(X)).fit(); model.summary()</code> — cho ra hệ số, R², và p-value cho từng biến dự báo trong một lệnh.</div>`,
  ]]);

const c6q = quiz('eda301-quiz-6', 'Quiz 6 — Correlation & regression|||Quiz 6 — Tương quan & hồi quy', [
  { id: 'q1', question: 'Hệ số tương quan Pearson r = -0.9 nghĩa là gì?', options: ['Không có quan hệ', 'Quan hệ dương rất mạnh', 'Quan hệ âm rất mạnh', 'Quan hệ phi tuyến'], correctIndex: 2, explanation: 'r gần -1 là quan hệ âm rất mạnh: một biến tăng thì biến kia giảm rõ rệt.' },
  { id: 'q2', question: 'Doanh số kem và số ca đuối nước tương quan dương vì?', options: ['Kem gây đuối nước', 'Đuối nước làm tăng bán kem', 'Cả hai đều tăng do một biến thứ ba (nhiệt độ mùa hè), không phải nhân quả trực tiếp', 'Không có lý do'], correctIndex: 2, explanation: 'Ví dụ kinh điển của "tương quan không phải nhân quả" — biến gây nhiễu là nhiệt độ.' },
  { id: 'q3', question: 'R² = 0.65 trong hồi quy có nghĩa là gì?', options: ['65% dữ liệu bị thiếu', 'Mô hình giải thích được 65% biến động của biến kết quả', 'Hệ số góc bằng 0.65', 'Có 65 biến dự báo'], correctIndex: 1, explanation: 'R² đo tỉ lệ biến động của y mà mô hình hồi quy giải thích được.' },
]);

const c7 = doc('eda301-7-1-time-series-forecasting', '7.1 — Time series analysis & basic forecasting|||7.1 — Phân tích chuỗi thời gian & dự báo cơ bản',
  'Thành phần chuỗi thời gian: xu hướng, mùa vụ, chu kỳ, bất thường; trung bình động; san mũ; ứng dụng dự báo kinh doanh.',
  [[
    `<span class="eyebrow">EDA301 · Chapter 7 · Lesson 7.1</span>
<h2>Time series analysis &amp; basic forecasting</h2>
<h3>What makes time series different</h3>
<p>A <strong>time series</strong> is data ordered by time (daily sales, monthly revenue) where order matters — shuffling the rows destroys the information, unlike a normal dataset.</p>
<h3>Four components of a time series</h3>
<ul>
<li><strong>Trend</strong> — the long-term direction (growing/shrinking market).</li>
<li><strong>Seasonality</strong> — a repeating pattern tied to the calendar (higher sales every December).</li>
<li><strong>Cyclical</strong> — longer, irregular swings tied to the economy (boom/recession, multi-year).</li>
<li><strong>Irregular / noise</strong> — random variation left over after removing the other three.</li>
</ul>
<pre><code>Monthly sales = Trend + Seasonality + Cyclical + Noise
-&gt; a December spike every year is Seasonality, not a "real" trend change
</code></pre>
<h3>Moving average — smoothing out the noise</h3>
<p>A <strong>moving average</strong> replaces each point with the average of the last N periods, smoothing short-term noise so the underlying trend is visible.</p>
<pre><code># Python (pandas) - 3-month moving average
df["ma_3"] = df["sales"].rolling(window=3).mean()
</code></pre>
<h3>Exponential smoothing</h3>
<p><strong>Exponential smoothing</strong> weights recent observations more heavily than older ones (a decay factor α), reacting faster to real changes than a plain moving average while still filtering noise.</p>
<h3>Business forecasting applications</h3>
<ul>
<li><strong>Demand planning</strong> — how much inventory to stock next month.</li>
<li><strong>Cash-flow forecasting</strong> — projecting next quarter's revenue and expenses.</li>
<li><strong>Staffing</strong> — predicting seasonal peaks (e.g. Tet, back-to-school) to schedule staff.</li>
</ul>
<div class="callout"><span class="badge">Forecast, then check</span> Every forecasting method assumes the future resembles the past — always compare a forecast against what actually happened (forecast error) and revise the model, don't trust it blindly.</div>`,
    `<span class="eyebrow">EDA301 · Chương 7 · Bài 7.1</span>
<h2>Phân tích chuỗi thời gian &amp; dự báo cơ bản</h2>
<h3>Điều gì làm chuỗi thời gian khác biệt</h3>
<p>Một <strong>chuỗi thời gian</strong> là dữ liệu sắp theo thời gian (doanh số hàng ngày, doanh thu hàng tháng) mà thứ tự quan trọng — xáo trộn các dòng phá huỷ thông tin, khác với dữ liệu thông thường.</p>
<h3>Bốn thành phần của chuỗi thời gian</h3>
<ul>
<li><strong>Xu hướng (Trend)</strong> — hướng đi dài hạn (thị trường tăng/giảm).</li>
<li><strong>Mùa vụ (Seasonality)</strong> — mẫu hình lặp lại theo lịch (doanh số cao mỗi tháng 12).</li>
<li><strong>Chu kỳ (Cyclical)</strong> — biến động dài hơn, không đều, gắn với kinh tế (tăng trưởng/suy thoái, nhiều năm).</li>
<li><strong>Bất thường / nhiễu (Irregular)</strong> — biến động ngẫu nhiên còn lại sau khi loại ba thành phần trên.</li>
</ul>
<pre><code>Doanh số hàng tháng = Xu hướng + Mùa vụ + Chu kỳ + Nhiễu
-&gt; tăng vọt mỗi tháng 12 hàng năm là Mùa vụ, không phải thay đổi xu hướng "thật"
</code></pre>
<h3>Trung bình động — làm phẳng nhiễu</h3>
<p><strong>Trung bình động (moving average)</strong> thay mỗi điểm bằng trung bình của N kỳ gần nhất, làm phẳng nhiễu ngắn hạn để xu hướng nền hiện rõ.</p>
<pre><code># Python (pandas) - trung bình động 3 tháng
df["ma_3"] = df["sales"].rolling(window=3).mean()
</code></pre>
<h3>San mũ (Exponential smoothing)</h3>
<p><strong>San mũ</strong> cho quan sát gần đây trọng số lớn hơn quan sát cũ (hệ số suy giảm α), phản ứng nhanh hơn với thay đổi thật so với trung bình động thường, mà vẫn lọc được nhiễu.</p>
<h3>Ứng dụng dự báo trong kinh doanh</h3>
<ul>
<li><strong>Kế hoạch nhu cầu</strong> — cần dự trữ bao nhiêu hàng tháng tới.</li>
<li><strong>Dự báo dòng tiền</strong> — ước tính doanh thu và chi phí quý tới.</li>
<li><strong>Bố trí nhân sự</strong> — dự đoán cao điểm mùa vụ (vd Tết, mùa khai giảng) để xếp ca.</li>
</ul>
<div class="callout"><span class="badge">Dự báo rồi kiểm lại</span> Mọi phương pháp dự báo đều giả định tương lai giống quá khứ — luôn so kết quả dự báo với thực tế xảy ra (sai số dự báo) và chỉnh lại mô hình, đừng tin tuyệt đối.</div>`,
  ]]);

const c7q = quiz('eda301-quiz-7', 'Quiz 7 — Time series & forecasting|||Quiz 7 — Chuỗi thời gian & dự báo', [
  { id: 'q1', question: 'Doanh số tăng vọt đều đặn mỗi tháng 12 hàng năm là thành phần nào của chuỗi thời gian?', options: ['Xu hướng', 'Mùa vụ', 'Chu kỳ', 'Nhiễu'], correctIndex: 1, explanation: 'Mẫu hình lặp lại theo lịch (mỗi năm vào tháng 12) là Mùa vụ (Seasonality).' },
  { id: 'q2', question: 'Trung bình động (moving average) dùng để làm gì?', options: ['Tăng nhiễu', 'Làm phẳng biến động ngắn hạn để thấy xu hướng nền', 'Thay thế hoàn toàn dữ liệu gốc', 'Tính hệ số tương quan'], correctIndex: 1, explanation: 'Moving average lấy trung bình N kỳ gần nhất, làm mượt dữ liệu để lộ xu hướng.' },
  { id: 'q3', question: 'Vì sao phải luôn so sánh dự báo với kết quả thực tế xảy ra?', options: ['Không cần thiết', 'Vì dự báo giả định tương lai giống quá khứ nên có thể sai và cần chỉnh lại mô hình', 'Vì luật yêu cầu', 'Vì máy tính yêu cầu'], correctIndex: 1, explanation: 'Mọi mô hình dự báo có thể sai khi thực tế đổi khác quá khứ; phải kiểm sai số để cải thiện.' },
]);

const c8 = doc('eda301-8-1-tools-business-reporting', '8.1 — Tools (Excel/Python/R) & business reporting|||8.1 — Công cụ (Excel/Python/R) & báo cáo phân tích cho kinh doanh',
  'Excel PivotTable & Power Query; Python pandas/matplotlib; R dplyr/ggplot2; chọn công cụ; cấu trúc báo cáo & kể chuyện bằng dữ liệu.',
  [[
    `<span class="eyebrow">EDA301 · Chapter 8 · Lesson 8.1</span>
<h2>Tools (Excel/Python/R) &amp; business reporting</h2>
<h3>Excel — the universal business tool</h3>
<ul>
<li><strong>PivotTable</strong> — summarize (sum/average/count) a large table by category in a few clicks, no formulas.</li>
<li><strong>Formulas</strong> — <code>AVERAGEIF</code>, <code>VLOOKUP</code>/<code>XLOOKUP</code>, <code>COUNTIFS</code> for conditional summaries.</li>
<li><strong>Power Query</strong> — repeatable clean/merge steps (Chapter 2's cleaning, recorded and re-runnable when new data arrives).</li>
</ul>
<h3>Python — for repeatable, larger-scale analysis</h3>
<pre><code># pandas + matplotlib, a typical mini-pipeline
import pandas as pd
df = pd.read_csv("sales.csv")
by_region = df.groupby("region")["revenue"].sum().sort_values(ascending=False)
by_region.plot(kind="bar", title="Revenue by region")
</code></pre>
<h3>R — strong for statistics &amp; polished plots</h3>
<pre><code># dplyr + ggplot2
library(dplyr); library(ggplot2)
df %&gt;% group_by(region) %&gt;% summarise(revenue = sum(revenue)) %&gt;%
  ggplot(aes(x = region, y = revenue)) + geom_col()
</code></pre>
<h3>Choosing the right tool</h3>
<ul>
<li><strong>Excel</strong> — quick, ad-hoc, small-to-medium data, shared with non-technical colleagues.</li>
<li><strong>Python</strong> — repeatable pipelines, larger data, integration with other systems/ML.</li>
<li><strong>R</strong> — heavy statistics, academic-style reporting, publication-quality charts.</li>
</ul>
<h3>Structuring a business report</h3>
<ol>
<li><strong>Executive summary</strong> — the answer and recommendation, in 2-3 sentences, first.</li>
<li><strong>Key findings</strong> — 3-5 charts/numbers that support the conclusion.</li>
<li><strong>Methodology</strong> — data source, period, any caveats (brief, for those who ask).</li>
<li><strong>Recommendation</strong> — the specific action, and what it would cost/save.</li>
</ol>
<div class="callout"><span class="badge">Data storytelling</span> A report is not a data dump — it is an argument. Every chart should answer a question the reader has, in the order they'd naturally ask it, ending in a decision they can make.</div>`,
    `<span class="eyebrow">EDA301 · Chương 8 · Bài 8.1</span>
<h2>Công cụ (Excel/Python/R) &amp; báo cáo phân tích cho kinh doanh</h2>
<h3>Excel — công cụ kinh doanh phổ biến nhất</h3>
<ul>
<li><strong>PivotTable</strong> — tổng hợp (sum/average/count) một bảng lớn theo nhóm chỉ với vài lần bấm, không cần công thức.</li>
<li><strong>Công thức</strong> — <code>AVERAGEIF</code>, <code>VLOOKUP</code>/<code>XLOOKUP</code>, <code>COUNTIFS</code> để tổng hợp có điều kiện.</li>
<li><strong>Power Query</strong> — ghi lại các bước làm sạch/ghép (làm sạch ở Chương 2) thành quy trình chạy lại được khi có dữ liệu mới.</li>
</ul>
<h3>Python — cho phân tích lặp lại được, quy mô lớn hơn</h3>
<pre><code># pandas + matplotlib, một mini-pipeline điển hình
import pandas as pd
df = pd.read_csv("sales.csv")
by_region = df.groupby("region")["revenue"].sum().sort_values(ascending=False)
by_region.plot(kind="bar", title="Revenue by region")
</code></pre>
<h3>R — mạnh về thống kê &amp; biểu đồ đẹp</h3>
<pre><code># dplyr + ggplot2
library(dplyr); library(ggplot2)
df %&gt;% group_by(region) %&gt;% summarise(revenue = sum(revenue)) %&gt;%
  ggplot(aes(x = region, y = revenue)) + geom_col()
</code></pre>
<h3>Chọn công cụ phù hợp</h3>
<ul>
<li><strong>Excel</strong> — nhanh, tùy biến, dữ liệu nhỏ-vừa, chia sẻ với đồng nghiệp không kỹ thuật.</li>
<li><strong>Python</strong> — quy trình lặp lại được, dữ liệu lớn hơn, tích hợp hệ thống/ML khác.</li>
<li><strong>R</strong> — thống kê nặng, báo cáo kiểu học thuật, biểu đồ chất lượng xuất bản.</li>
</ul>
<h3>Cấu trúc một báo cáo kinh doanh</h3>
<ol>
<li><strong>Tóm tắt điều hành</strong> — câu trả lời và đề xuất, trong 2-3 câu, đặt đầu tiên.</li>
<li><strong>Phát hiện chính</strong> — 3-5 biểu đồ/số liệu ủng hộ kết luận.</li>
<li><strong>Phương pháp</strong> — nguồn dữ liệu, giai đoạn, lưu ý (ngắn, cho ai cần hỏi).</li>
<li><strong>Đề xuất</strong> — hành động cụ thể, và chi phí/tiết kiệm ước tính.</li>
</ol>
<div class="callout"><span class="badge">Kể chuyện bằng dữ liệu</span> Báo cáo không phải đổ dữ liệu ra — đó là một lập luận. Mỗi biểu đồ nên trả lời một câu hỏi người đọc đang có, theo thứ tự họ tự nhiên sẽ hỏi, kết thúc bằng một quyết định họ có thể làm được.</div>`,
  ]]);

const c8q = quiz('eda301-quiz-8', 'Quiz 8 — Tools & business reporting|||Quiz 8 — Công cụ & báo cáo kinh doanh', [
  { id: 'q1', question: 'Công cụ Excel nào giúp tổng hợp nhanh một bảng lớn theo nhóm mà không cần viết công thức?', options: ['Power Query', 'PivotTable', 'VLOOKUP', 'Macro'], correctIndex: 1, explanation: 'PivotTable tổng hợp sum/average/count theo nhóm chỉ bằng kéo-thả.' },
  { id: 'q2', question: 'Phần nào nên đặt ĐẦU TIÊN trong một báo cáo phân tích kinh doanh?', options: ['Phương pháp chi tiết', 'Tóm tắt điều hành (câu trả lời & đề xuất)', 'Toàn bộ dữ liệu thô', 'Mã nguồn Python'], correctIndex: 1, explanation: 'Người đọc bận cần thấy câu trả lời và đề xuất ngay từ đầu.' },
  { id: 'q3', question: 'Vì sao gọi việc trình bày báo cáo là "kể chuyện bằng dữ liệu" (data storytelling)?', options: ['Vì báo cáo chỉ cần hình đẹp', 'Vì mỗi biểu đồ nên trả lời một câu hỏi người đọc có, theo thứ tự hợp lý, dẫn đến một quyết định', 'Vì phải kể chuyện cổ tích', 'Vì không cần số liệu thật'], correctIndex: 1, explanation: 'Báo cáo tốt là một lập luận có trình tự, không phải một đống dữ liệu đổ ra.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'EDA301',
    slug: 'eda301-data-analysis',
    title: 'Data analysis',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EDA301.webp',
    shortDescription: 'Turn raw data into decisions — analysis process, data cleaning, descriptive stats, visualization, hypothesis testing, correlation & regression, time series forecasting, Excel/Python/R reporting. Bilingual, with examples & quizzes.|||Biến dữ liệu thô thành quyết định — quy trình phân tích, làm sạch dữ liệu, thống kê mô tả, trực quan hoá, kiểm định giả thuyết, tương quan & hồi quy, dự báo chuỗi thời gian, báo cáo Excel/Python/R. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>EDA301 — Data Analysis</strong> (kỳ 4) dạy cách biến <strong>dữ liệu thô thành quyết định kinh doanh</strong>. Từ <strong>quy trình phân tích &amp; chuẩn bị dữ liệu</strong> (thu thập, làm sạch) → <strong>thống kê mô tả &amp; phân phối</strong> → <strong>trực quan hoá dữ liệu</strong> → <strong>thống kê suy diễn &amp; kiểm định giả thuyết</strong> → <strong>tương quan &amp; hồi quy</strong> → <strong>chuỗi thời gian &amp; dự báo</strong> → <strong>công cụ Excel/Python/R &amp; báo cáo kinh doanh</strong>. Bám giáo trình FLM và tham khảo <em>Practical Statistics for Data Scientists</em> (Bruce), <em>Python for Data Analysis</em> (McKinney), <em>R for Data Science</em> (Wickham), <em>Statistics</em> (Freedman); song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Quy trình phân tích dữ liệu 5 bước; thu thập, làm sạch dữ liệu (thiếu/trùng/outlier); thống kê mô tả (mean/median/mode, variance/SD/IQR) & phân phối; chọn & đọc biểu đồ (bar/line/histogram/boxplot/scatter); khoảng tin cậy, kiểm định giả thuyết (H0/H1, p-value); tương quan Pearson r, hồi quy tuyến tính & R-squared; thành phần chuỗi thời gian, trung bình động, dự báo cơ bản; PivotTable Excel, pandas Python, dplyr/ggplot2 R, cấu trúc báo cáo kinh doanh.',
    requirements: 'Toán phổ thông cơ bản (không cần thống kê trước). Nên cài Excel; có thể dùng Python (pandas) hoặc R miễn phí qua Google Colab / Posit Cloud.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phân tích dữ liệu là gì, 4 loại analytics.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & quy trình|||Chapter 1 — Overview & process', description: 'Định nghĩa, quy trình 5 bước, BI vs analytics vs data science.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thu thập & làm sạch dữ liệu|||Chapter 2 — Collection & cleaning', description: 'Nguồn dữ liệu, loại dữ liệu, thiếu/trùng/outlier, chuẩn bị.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thống kê mô tả & phân phối|||Chapter 3 — Descriptive & distributions', description: 'Mean/median/mode, variance/SD/IQR, hình dạng phân phối.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Trực quan hoá dữ liệu|||Chapter 4 — Data visualization', description: 'Chọn biểu đồ, dashboard, lỗi thường gặp.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Suy diễn & kiểm định giả thuyết|||Chapter 5 — Inference & hypothesis testing', description: 'Population/sample, p-value, H0/H1, lỗi loại I/II, t-test.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tương quan & hồi quy|||Chapter 6 — Correlation & regression', description: 'Pearson r, tương quan vs nhân quả, hồi quy tuyến tính, R-squared.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chuỗi thời gian & dự báo|||Chapter 7 — Time series & forecasting', description: 'Trend/seasonality/cyclical/noise, moving average, dự báo kinh doanh.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công cụ & báo cáo kinh doanh|||Chapter 8 — Tools & business reporting', description: 'Excel PivotTable, Python pandas, R ggplot2, cấu trúc báo cáo.', lessons: [c8, c8q] },
  ],
};
