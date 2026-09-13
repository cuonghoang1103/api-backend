/**
 * MDA301 — Marketing Data Analytics (Phân tích dữ liệu marketing). Khối Công
 * nghệ Truyền thông FPTU. Khung "chất lượng" theo giáo trình chuẩn quốc tế:
 * Winston "Marketing Analytics" (Excel), Grigsby "Marketing Analytics",
 * Chapman & Feit "R for Marketing Research & Analytics", Google Analytics
 * Academy. 8 chương, song ngữ + công thức + quiz. Giữ NGUYÊN slug/semester/
 * courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; "&"→"&amp;" trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mda301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, tài liệu miễn phí (Google Analytics Academy, Kaggle, HBR), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">MDA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Marketing Data Analytics</strong> — from data-driven fundamentals to customer analytics, campaign measurement and dashboards — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MDA301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Wayne Winston — <em>Marketing Analytics: Data-Driven Techniques with Microsoft Excel</em></li>
<li>Mike Grigsby — <em>Marketing Analytics: A Practical Guide to Improving Consumer Insights Using Data Techniques</em></li>
<li>Chapman &amp; Feit — <em>R for Marketing Research and Analytics</em></li>
</ul>
<h3>🌐 Official / free learning</h3>
<ul>
<li><a href="https://analytics.google.com/analytics/academy/" target="_blank" rel="noopener">Google Analytics Academy</a> — free GA4 courses</li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — data cleaning, pandas, visualization</li>
<li><a href="https://hbr.org/topic/subject/analytics-and-data-science" target="_blank" rel="noopener">HBR — Analytics &amp; Data Science</a> — decision-making cases</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GoogleAnalytics" target="_blank" rel="noopener">Google Analytics</a> — GA4 &amp; Looker Studio</li>
<li><a href="https://www.youtube.com/@AlexTheAnalyst" target="_blank" rel="noopener">Alex The Analyst</a> — practical data analytics</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — free dashboards</li>
<li><a href="https://powerbi.microsoft.com/" target="_blank" rel="noopener">Power BI</a> — BI &amp; visualization</li>
<li><a href="https://sheets.google.com/" target="_blank" rel="noopener">Google Sheets / Excel</a> — pivot, RFM, forecasting</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what data-driven marketing is; metric vs KPI; descriptive → predictive → prescriptive.</li>
<li><strong>Practice</strong> — collect data (GA4, UTM), clean it, and explore it with pivots &amp; charts.</li>
<li><strong>Go deeper</strong> — customer analytics (RFM, cohort, CLV, churn), funnels, A/B testing, attribution.</li>
<li><strong>Job-ready</strong> — build a dashboard, measure ROI/ROAS, and present a data-backed recommendation.</li>
</ol></div>`,
    `<span class="eyebrow">MDA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Phân tích dữ liệu marketing</strong> — từ nền tảng data-driven tới phân tích khách hàng, đo lường chiến dịch và dashboard — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MDA301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Wayne Winston — <em>Marketing Analytics: Data-Driven Techniques with Microsoft Excel</em></li>
<li>Mike Grigsby — <em>Marketing Analytics: A Practical Guide to Improving Consumer Insights Using Data Techniques</em></li>
<li>Chapman &amp; Feit — <em>R for Marketing Research and Analytics</em></li>
</ul>
<h3>🌐 Học chính thức / miễn phí</h3>
<ul>
<li><a href="https://analytics.google.com/analytics/academy/" target="_blank" rel="noopener">Google Analytics Academy</a> — khoá GA4 miễn phí</li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — làm sạch dữ liệu, pandas, trực quan hoá</li>
<li><a href="https://hbr.org/topic/subject/analytics-and-data-science" target="_blank" rel="noopener">HBR — Analytics &amp; Data Science</a> — tình huống ra quyết định</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GoogleAnalytics" target="_blank" rel="noopener">Google Analytics</a> — GA4 &amp; Looker Studio</li>
<li><a href="https://www.youtube.com/@AlexTheAnalyst" target="_blank" rel="noopener">Alex The Analyst</a> — phân tích dữ liệu thực chiến</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — dashboard miễn phí</li>
<li><a href="https://powerbi.microsoft.com/" target="_blank" rel="noopener">Power BI</a> — BI &amp; trực quan hoá</li>
<li><a href="https://sheets.google.com/" target="_blank" rel="noopener">Google Sheets / Excel</a> — pivot, RFM, dự báo</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — data-driven marketing là gì; metric vs KPI; mô tả → dự đoán → đề xuất.</li>
<li><strong>Luyện tập</strong> — thu dữ liệu (GA4, UTM), làm sạch, và khám phá bằng pivot &amp; biểu đồ.</li>
<li><strong>Đào sâu</strong> — phân tích khách hàng (RFM, cohort, CLV, churn), phễu, A/B testing, attribution.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng dashboard, đo ROI/ROAS, và trình bày đề xuất dựa trên dữ liệu.</li>
</ol></div>`,
  ]]);

const intro = doc('mda301-0-1-overview', 'Course overview: Marketing Data Analytics|||Tổng quan: Phân tích dữ liệu marketing',
  'Marketing analytics làm gì; vòng đo lường → hiểu → hành động; ba mức phân tích (mô tả/dự đoán/đề xuất); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">MDA301 · Lesson 0.1 · Overview</span>
<h2>Marketing Data Analytics</h2>
<p class="lead">This course teaches you to <strong>turn marketing data into decisions</strong>. Instead of guessing which campaign, channel or audience works, you measure it — then act. You'll learn to collect and clean data, analyze customers and campaigns, build predictive models, and present findings on a dashboard.</p>
<h3>The analytics loop</h3>
<p><strong>Measure → Understand → Act → Measure again.</strong> Good marketing analytics closes this loop continuously: every campaign is an experiment that produces data for the next decision.</p>
<h3>Three levels of analytics</h3>
<ul>
<li><strong>Descriptive</strong> — what happened? (traffic, sales, CTR) — reports &amp; dashboards.</li>
<li><strong>Predictive</strong> — what will happen? (churn, CLV, forecast) — models.</li>
<li><strong>Prescriptive</strong> — what should we do? (budget allocation, targeting) — optimization.</li>
</ul>
<h3>Roadmap</h3>
<p>Foundations → data sources &amp; GA4 → cleaning &amp; EDA → customer analytics (RFM, cohort, CLV, churn) → funnels, A/B testing &amp; attribution → predictive models → dashboards &amp; storytelling → ROI/ROAS, ethics &amp; privacy. Bilingual, with worked formulas and quizzes.</p>`,
    `<span class="eyebrow">MDA301 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích dữ liệu marketing</h2>
<p class="lead">Môn này dạy bạn <strong>biến dữ liệu marketing thành quyết định</strong>. Thay vì đoán chiến dịch, kênh hay tệp khách nào hiệu quả, bạn đo — rồi hành động. Bạn học cách thu &amp; làm sạch dữ liệu, phân tích khách hàng và chiến dịch, dựng mô hình dự đoán, và trình bày kết quả trên dashboard.</p>
<h3>Vòng lặp phân tích</h3>
<p><strong>Đo → Hiểu → Hành động → Đo lại.</strong> Phân tích marketing tốt khép kín vòng này liên tục: mỗi chiến dịch là một thí nghiệm sinh dữ liệu cho quyết định kế tiếp.</p>
<h3>Ba mức phân tích</h3>
<ul>
<li><strong>Mô tả (descriptive)</strong> — điều gì đã xảy ra? (traffic, doanh số, CTR) — báo cáo &amp; dashboard.</li>
<li><strong>Dự đoán (predictive)</strong> — điều gì sẽ xảy ra? (churn, CLV, dự báo) — mô hình.</li>
<li><strong>Đề xuất (prescriptive)</strong> — nên làm gì? (phân bổ ngân sách, nhắm tệp) — tối ưu.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nền tảng → nguồn dữ liệu &amp; GA4 → làm sạch &amp; EDA → phân tích khách hàng (RFM, cohort, CLV, churn) → phễu, A/B testing &amp; attribution → mô hình dự đoán → dashboard &amp; kể chuyện → ROI/ROAS, đạo đức &amp; quyền riêng tư. Song ngữ, có công thức và quiz.</p>`,
  ]]);

const c1 = doc('mda301-1-1-what-is', '1.1 — What is marketing data analytics?|||1.1 — Phân tích dữ liệu marketing là gì?',
  'Data-driven marketing; ba mức mô tả/dự đoán/đề xuất; phân biệt metric vs KPI; nguyên tắc "mọi chỉ số phải nối với một quyết định".',
  [[
    `<span class="eyebrow">MDA301 · Chapter 1 · Lesson 1.1</span>
<h2>What is marketing data analytics?</h2>
<p><strong>Marketing data analytics</strong> is the practice of collecting, processing and interpreting data to guide marketing decisions — replacing opinion with evidence. It underpins budgeting, targeting, creative choices and channel mix.</p>
<h3>Descriptive → predictive → prescriptive</h3>
<p>Analytics matures in three levels: <strong>describe</strong> the past, <strong>predict</strong> the future, <strong>prescribe</strong> the best action. Most teams start descriptive and grow upward.</p>
<h3>Metric vs KPI — not the same</h3>
<ul>
<li>A <strong>metric</strong> is any measurable number: sessions, clicks, likes.</li>
<li>A <strong>KPI (Key Performance Indicator)</strong> is a metric tied to a <em>goal</em> — the few numbers that decide success (e.g. CAC, conversion rate, ROAS).</li>
</ul>
<p>Rule of thumb: <em>every KPI must connect to a decision</em>. If a number would not change what you do, it is a <strong>vanity metric</strong>.</p>
<pre><code>Vanity vs actionable:
  Followers        -> vanity   (feels good, decides nothing)
  Cost per lead    -> KPI      (decides budget &amp; channel)
  Page views       -> metric   (context only)
  Conversion rate  -> KPI      (decides funnel fixes)
</code></pre>
<div class="callout"><span class="badge">SMART goals</span> Frame targets as Specific, Measurable, Achievable, Relevant, Time-bound — e.g. "raise checkout conversion from 2.1% to 2.8% in Q3", not "get more sales".</div>`,
    `<span class="eyebrow">MDA301 · Chương 1 · Bài 1.1</span>
<h2>Phân tích dữ liệu marketing là gì?</h2>
<p><strong>Phân tích dữ liệu marketing</strong> là việc thu thập, xử lý và diễn giải dữ liệu để dẫn dắt quyết định marketing — thay ý kiến bằng bằng chứng. Nó là nền cho phân bổ ngân sách, nhắm tệp, chọn nội dung và phối kênh.</p>
<h3>Mô tả → dự đoán → đề xuất</h3>
<p>Phân tích trưởng thành qua ba mức: <strong>mô tả</strong> quá khứ, <strong>dự đoán</strong> tương lai, <strong>đề xuất</strong> hành động tốt nhất. Đa số đội bắt đầu ở mô tả rồi đi lên.</p>
<h3>Metric vs KPI — không giống nhau</h3>
<ul>
<li><strong>Metric</strong> là bất kỳ con số đo được: session, click, like.</li>
<li><strong>KPI (chỉ số hiệu suất chính)</strong> là metric gắn với một <em>mục tiêu</em> — vài con số quyết định thành bại (vd CAC, tỉ lệ chuyển đổi, ROAS).</li>
</ul>
<p>Nguyên tắc: <em>mọi KPI phải nối với một quyết định</em>. Nếu một con số không làm bạn thay đổi hành động, nó là <strong>chỉ số phù phiếm (vanity metric)</strong>.</p>
<pre><code>Phù phiếm vs hành động:
  Follower         -> phù phiếm (nghe sướng, không quyết gì)
  Chi phí/lead     -> KPI       (quyết ngân sách &amp; kênh)
  Lượt xem trang   -> metric    (chỉ để tham chiếu)
  Tỉ lệ chuyển đổi -> KPI       (quyết việc vá phễu)
</code></pre>
<div class="callout"><span class="badge">Mục tiêu SMART</span> Đặt mục tiêu Cụ thể, Đo được, Khả thi, Liên quan, Có hạn — vd "nâng tỉ lệ chuyển đổi thanh toán từ 2,1% lên 2,8% trong Q3", chứ không phải "bán được nhiều hơn".</div>`,
  ]]);

const c1q = quiz('mda301-quiz-1', 'Quiz 1 — Fundamentals|||Quiz 1 — Nền tảng', [
  { id: 'q1', question: 'KPI khác metric ở chỗ nào?', options: ['KPI luôn là số lớn hơn', 'KPI là metric gắn với một mục tiêu/quyết định', 'Metric chỉ dùng cho quảng cáo', 'Không khác gì nhau'], correctIndex: 1, explanation: 'KPI là metric được chọn vì nó nối trực tiếp với một mục tiêu và một quyết định.' },
  { id: 'q2', question: 'Ba mức phân tích theo thứ tự trưởng thành là?', options: ['Đề xuất → dự đoán → mô tả', 'Mô tả → dự đoán → đề xuất', 'Dự đoán → mô tả → đề xuất', 'Mô tả → đề xuất → dự đoán'], correctIndex: 1, explanation: 'Descriptive (đã xảy ra) → predictive (sẽ xảy ra) → prescriptive (nên làm gì).' },
  { id: 'q3', question: 'Số lượng follower thường được xem là?', options: ['KPI cốt lõi', 'Chỉ số phù phiếm nếu không nối với quyết định', 'Chỉ số chuyển đổi', 'ROAS'], correctIndex: 1, explanation: 'Con số không làm thay đổi hành động là vanity metric.' },
]);

const c2 = doc('mda301-2-1-data-sources', '2.1 — Data sources & digital measurement|||2.1 — Nguồn dữ liệu & đo lường số',
  'Web/app analytics (GA4 event-based), first/second/third-party data, event & parameter, gắn thẻ UTM để quy nguồn traffic.',
  [[
    `<span class="eyebrow">MDA301 · Chapter 2 · Lesson 2.1</span>
<h2>Data sources &amp; digital measurement</h2>
<h3>Where marketing data comes from</h3>
<ul>
<li><strong>First-party</strong> — your own data: website/app analytics, CRM, purchases. Most trustworthy, and increasingly the only reliable source as third-party cookies disappear.</li>
<li><strong>Second-party</strong> — a partner's first-party data shared with you.</li>
<li><strong>Third-party</strong> — bought/aggregated from outside sources; weaker and privacy-constrained.</li>
</ul>
<h3>GA4 — an event-based model</h3>
<p><strong>Google Analytics 4</strong> models everything as <strong>events</strong> with <strong>parameters</strong> (no more rigid "pageview vs session" hierarchy). A <code>purchase</code> event carries parameters like <code>value</code> and <code>currency</code>; a <code>page_view</code> carries <code>page_location</code>.</p>
<h3>UTM tags — attributing traffic to campaigns</h3>
<p><strong>UTM parameters</strong> are tags added to a link so analytics knows where a visit came from.</p>
<pre><code>https://shop.com/sale
  ?utm_source=facebook      (where)
  &amp;utm_medium=cpc          (how / channel type)
  &amp;utm_campaign=summer_2026 (which campaign)
  &amp;utm_content=video_a      (which creative)
</code></pre>
<div class="callout"><span class="badge">Garbage in, garbage out</span> Consistent UTM naming (lowercase, fixed vocabulary) is the difference between a clean channel report and an unusable one. Decide a convention before the campaign, not after.</div>`,
    `<span class="eyebrow">MDA301 · Chương 2 · Bài 2.1</span>
<h2>Nguồn dữ liệu &amp; đo lường số</h2>
<h3>Dữ liệu marketing đến từ đâu</h3>
<ul>
<li><strong>First-party</strong> — dữ liệu của chính bạn: analytics web/app, CRM, đơn mua. Đáng tin nhất, và ngày càng là nguồn đáng tin duy nhất khi cookie bên thứ ba biến mất.</li>
<li><strong>Second-party</strong> — dữ liệu first-party của đối tác chia sẻ cho bạn.</li>
<li><strong>Third-party</strong> — mua/gộp từ bên ngoài; yếu hơn và bị ràng buộc quyền riêng tư.</li>
</ul>
<h3>GA4 — mô hình dựa trên event</h3>
<p><strong>Google Analytics 4</strong> mô hình hoá mọi thứ thành <strong>event</strong> kèm <strong>parameter</strong> (bỏ cấu trúc cứng "pageview vs session"). Event <code>purchase</code> mang parameter như <code>value</code> và <code>currency</code>; <code>page_view</code> mang <code>page_location</code>.</p>
<h3>Thẻ UTM — quy traffic về chiến dịch</h3>
<p><strong>Tham số UTM</strong> là thẻ gắn vào link để analytics biết lượt truy cập đến từ đâu.</p>
<pre><code>https://shop.com/sale
  ?utm_source=facebook      (ở đâu)
  &amp;utm_medium=cpc          (cách / loại kênh)
  &amp;utm_campaign=summer_2026 (chiến dịch nào)
  &amp;utm_content=video_a      (mẫu nội dung nào)
</code></pre>
<div class="callout"><span class="badge">Rác vào, rác ra</span> Đặt tên UTM nhất quán (chữ thường, từ vựng cố định) là ranh giới giữa một báo cáo kênh sạch và một báo cáo vô dụng. Chốt quy ước TRƯỚC chiến dịch, không phải sau.</div>`,
  ]]);

const c2q = quiz('mda301-quiz-2', 'Quiz 2 — Data sources & GA4|||Quiz 2 — Nguồn dữ liệu & GA4', [
  { id: 'q1', question: 'Dữ liệu bạn thu trực tiếp từ web/app/CRM của mình gọi là?', options: ['Third-party data', 'First-party data', 'Second-party data', 'Public data'], correctIndex: 1, explanation: 'First-party là dữ liệu của chính bạn — đáng tin nhất và ngày càng quan trọng.' },
  { id: 'q2', question: 'GA4 mô hình hoá dữ liệu chủ yếu theo?', options: ['Pageview cố định', 'Event kèm parameter', 'Chỉ session', 'Bảng SQL tĩnh'], correctIndex: 1, explanation: 'GA4 dùng mô hình event-based: mọi tương tác là một event với các parameter.' },
  { id: 'q3', question: 'Tham số UTM nào cho biết KÊNH/loại lưu lượng (vd cpc, email)?', options: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'], correctIndex: 1, explanation: 'utm_medium mô tả loại kênh; utm_source là nơi cụ thể; utm_campaign là chiến dịch.' },
]);

const c3 = doc('mda301-3-1-clean-explore', '3.1 — Data cleaning & exploratory analysis|||3.1 — Làm sạch & khám phá dữ liệu',
  'Data cleaning (thiếu, trùng, sai kiểu, ngoại lai); EDA bằng thống kê mô tả; trực quan hoá cơ bản (histogram, boxplot, scatter) chọn theo câu hỏi.',
  [[
    `<span class="eyebrow">MDA301 · Chapter 3 · Lesson 3.1</span>
<h2>Data cleaning &amp; exploratory analysis</h2>
<p>Analysts spend most of their time <strong>cleaning data</strong>, not modeling it. Dirty data silently produces confident-but-wrong conclusions.</p>
<h3>Common cleaning tasks</h3>
<ul>
<li><strong>Missing values</strong> — drop, or impute (mean/median/mode) — and record which.</li>
<li><strong>Duplicates</strong> — the same order counted twice inflates revenue.</li>
<li><strong>Wrong types &amp; formats</strong> — "1,000" as text won't sum; dates as strings won't sort.</li>
<li><strong>Outliers</strong> — a 99,999 order may be a test row; investigate before deleting.</li>
</ul>
<h3>EDA — exploratory data analysis</h3>
<p><strong>EDA</strong> means summarizing data before modeling: central tendency (mean, median), spread (std dev, IQR) and distribution shape. The <em>median</em> beats the <em>mean</em> when a few whales skew the average.</p>
<pre><code>Pick a chart by the question:
  Distribution of one number   -> histogram / boxplot
  Two numbers related?         -> scatter plot
  Compare categories           -> bar chart
  Change over time             -> line chart
</code></pre>
<div class="callout"><span class="badge">Same stats, different data</span> Anscombe's quartet: four datasets with identical mean, variance and correlation but wildly different shapes — always <em>plot</em> the data, don't trust summary numbers alone.</div>`,
    `<span class="eyebrow">MDA301 · Chương 3 · Bài 3.1</span>
<h2>Làm sạch &amp; khám phá dữ liệu</h2>
<p>Người phân tích tốn phần lớn thời gian <strong>làm sạch dữ liệu</strong>, không phải mô hình hoá. Dữ liệu bẩn âm thầm sinh ra kết luận tự tin nhưng sai.</p>
<h3>Các việc làm sạch thường gặp</h3>
<ul>
<li><strong>Giá trị thiếu</strong> — bỏ, hoặc điền (trung bình/trung vị/mode) — và ghi lại đã làm gì.</li>
<li><strong>Trùng lặp</strong> — cùng một đơn đếm hai lần làm phồng doanh thu.</li>
<li><strong>Sai kiểu &amp; định dạng</strong> — "1.000" dạng chữ không cộng được; ngày dạng chuỗi không sắp được.</li>
<li><strong>Ngoại lai (outlier)</strong> — đơn 99.999 có thể là dòng test; điều tra trước khi xoá.</li>
</ul>
<h3>EDA — khám phá dữ liệu</h3>
<p><strong>EDA</strong> là tóm tắt dữ liệu trước khi mô hình hoá: xu hướng trung tâm (mean, median), độ phân tán (độ lệch chuẩn, IQR) và hình dạng phân phối. <em>Trung vị</em> thắng <em>trung bình</em> khi vài "cá voi" kéo lệch trung bình.</p>
<pre><code>Chọn biểu đồ theo câu hỏi:
  Phân phối một biến số       -> histogram / boxplot
  Hai biến có liên hệ?        -> scatter plot
  So sánh các nhóm            -> bar chart
  Thay đổi theo thời gian     -> line chart
</code></pre>
<div class="callout"><span class="badge">Cùng số liệu, khác dữ liệu</span> Bộ tứ Anscombe: bốn tập dữ liệu cùng mean, phương sai và tương quan nhưng hình dạng khác hẳn — luôn <em>vẽ</em> dữ liệu, đừng chỉ tin các con số tóm tắt.</div>`,
  ]]);

const c3q = quiz('mda301-quiz-3', 'Quiz 3 — Cleaning & EDA|||Quiz 3 — Làm sạch & EDA', [
  { id: 'q1', question: 'Khi vài giá trị cực lớn kéo lệch trung bình, đại lượng nào mô tả "điển hình" tốt hơn?', options: ['Trung bình (mean)', 'Trung vị (median)', 'Tổng', 'Phương sai'], correctIndex: 1, explanation: 'Trung vị bền với ngoại lai hơn trung bình.' },
  { id: 'q2', question: 'Để xem quan hệ giữa HAI biến số nên dùng biểu đồ?', options: ['Histogram', 'Scatter plot', 'Pie chart', 'Bar chart'], correctIndex: 1, explanation: 'Scatter plot bộc lộ tương quan giữa hai biến số.' },
  { id: 'q3', question: 'Vì sao một đơn hàng trùng lặp là vấn đề?', options: ['Không sao cả', 'Nó làm phồng doanh thu và chỉ số', 'Nó luôn là ngoại lai', 'Nó đổi kiểu dữ liệu'], correctIndex: 1, explanation: 'Bản ghi trùng đếm hai lần → số liệu bị thổi phồng.' },
]);

const c4 = doc('mda301-4-1-customer', '4.1 — Customer analytics: RFM, cohort, CLV, churn|||4.1 — Phân tích khách hàng: RFM, cohort, CLV, churn',
  'Phân khúc RFM (Recency/Frequency/Monetary); phân tích cohort giữ chân; công thức CLV; nhận diện & giảm churn.',
  [[
    `<span class="eyebrow">MDA301 · Chapter 4 · Lesson 4.1</span>
<h2>Customer analytics</h2>
<h3>RFM segmentation</h3>
<p><strong>RFM</strong> scores each customer on three axes and groups them for targeting:</p>
<ul>
<li><strong>Recency</strong> — how recently did they buy? (recent = more likely to respond)</li>
<li><strong>Frequency</strong> — how often do they buy?</li>
<li><strong>Monetary</strong> — how much do they spend?</li>
</ul>
<pre><code>Score each 1-5, then segment:
  R=5 F=5 M=5  -> Champions        (reward, upsell)
  R=1 F=4 M=4  -> At-risk loyal    (win-back campaign)
  R=5 F=1 M=1  -> New              (onboard, nurture)
</code></pre>
<h3>Cohort analysis</h3>
<p>Group users by join month and track a metric (retention, revenue) over their lifetime — it separates "are new users sticking?" from overall totals that hide decay.</p>
<h3>CLV — Customer Lifetime Value</h3>
<pre><code>Simple CLV = (Avg order value) x (Purchase freq/yr)
             x (Avg customer lifespan yrs)
Example: 40 x 3 x 2 = 240  per customer
Rule: acquire only while CAC &lt; CLV.
</code></pre>
<h3>Churn</h3>
<p><strong>Churn rate = customers lost / customers at start.</strong> Predicting who is about to churn (falling recency/frequency) lets you intervene before they leave — cheaper than reacquiring them.</p>
<div class="callout"><span class="badge">CAC vs CLV</span> The single healthiest ratio in growth: if it costs more to acquire a customer than they're ever worth, scaling spend only loses money faster.</div>`,
    `<span class="eyebrow">MDA301 · Chương 4 · Bài 4.1</span>
<h2>Phân tích khách hàng</h2>
<h3>Phân khúc RFM</h3>
<p><strong>RFM</strong> chấm điểm mỗi khách trên ba trục rồi gom nhóm để nhắm tệp:</p>
<ul>
<li><strong>Recency (gần đây)</strong> — mua gần đây thế nào? (càng gần càng dễ phản hồi)</li>
<li><strong>Frequency (tần suất)</strong> — mua thường xuyên ra sao?</li>
<li><strong>Monetary (giá trị)</strong> — chi bao nhiêu?</li>
</ul>
<pre><code>Chấm mỗi trục 1-5 rồi phân khúc:
  R=5 F=5 M=5  -> Champions      (thưởng, upsell)
  R=1 F=4 M=4  -> Trung thành nguy cơ (chiến dịch kéo lại)
  R=5 F=1 M=1  -> Khách mới      (onboard, nuôi dưỡng)
</code></pre>
<h3>Phân tích cohort</h3>
<p>Gom người dùng theo tháng gia nhập và theo dõi một chỉ số (giữ chân, doanh thu) suốt vòng đời của họ — nó tách "khách mới có ở lại không?" khỏi tổng số vốn che giấu sự rơi rụng.</p>
<h3>CLV — Giá trị vòng đời khách hàng</h3>
<pre><code>CLV đơn giản = (Giá trị đơn TB) x (Số lần mua/năm)
               x (Số năm gắn bó TB)
Ví dụ: 40 x 3 x 2 = 240  mỗi khách
Quy tắc: chỉ thu hút khi CAC &lt; CLV.
</code></pre>
<h3>Churn (rời bỏ)</h3>
<p><strong>Tỉ lệ churn = khách mất / khách đầu kỳ.</strong> Dự đoán ai sắp rời (recency/frequency tụt) cho phép can thiệp trước khi họ đi — rẻ hơn nhiều so với thu hút lại.</p>
<div class="callout"><span class="badge">CAC vs CLV</span> Tỉ số lành mạnh nhất của tăng trưởng: nếu chi phí thu hút một khách lớn hơn giá trị họ tạo ra cả đời, tăng ngân sách chỉ khiến lỗ nhanh hơn.</div>`,
  ]]);

const c4q = quiz('mda301-quiz-4', 'Quiz 4 — Customer analytics|||Quiz 4 — Phân tích khách hàng', [
  { id: 'q1', question: 'Chữ "R" trong RFM là gì?', options: ['Revenue', 'Recency (mức độ gần đây của lần mua)', 'Rate', 'Return'], correctIndex: 1, explanation: 'R = Recency: khách mua gần đây thì dễ phản hồi hơn.' },
  { id: 'q2', question: 'CLV đơn giản = giá trị đơn TB × số lần mua/năm × ...?', options: ['Số kênh quảng cáo', 'Số năm gắn bó trung bình', 'Tỉ lệ click', 'Số nhân viên'], correctIndex: 1, explanation: 'CLV ước lượng bằng AOV × tần suất mua × tuổi thọ khách hàng.' },
  { id: 'q3', question: 'Một mô hình thu hút khách bền vững cần?', options: ['CAC > CLV', 'CAC < CLV', 'CAC = doanh thu', 'Bỏ qua CLV'], correctIndex: 1, explanation: 'Chỉ nên chi thu hút khi chi phí thu hút (CAC) nhỏ hơn giá trị vòng đời (CLV).' },
]);

const c5 = doc('mda301-5-1-campaign-funnel', '5.1 — Campaign & funnel analytics|||5.1 — Phân tích chiến dịch & phễu',
  'Phễu chuyển đổi & conversion rate; A/B testing (giả thuyết, mẫu, ý nghĩa thống kê); các mô hình attribution (last-click, first-click, linear, data-driven).',
  [[
    `<span class="eyebrow">MDA301 · Chapter 5 · Lesson 5.1</span>
<h2>Campaign &amp; funnel analytics</h2>
<h3>The funnel &amp; conversion rate</h3>
<p>A <strong>funnel</strong> tracks how many users pass each step toward a goal. The <strong>conversion rate</strong> of a step = completed / entered. Find the step with the biggest drop-off — that's where a fix pays the most.</p>
<pre><code>Visit 10,000 -> Add to cart 1,200 (12%)
             -> Checkout    600 (50% of cart)
             -> Purchase    420 (70% of checkout)
Overall conversion = 420 / 10,000 = 4.2%
</code></pre>
<h3>A/B testing</h3>
<p>An <strong>A/B test</strong> splits traffic between a control (A) and a variant (B) to measure the causal effect of one change. Requirements: a clear <strong>hypothesis</strong>, a large enough <strong>sample</strong>, and <strong>statistical significance</strong> (typically p &lt; 0.05) before declaring a winner. Stopping early when B "looks" ahead is the classic mistake.</p>
<h3>Attribution</h3>
<p><strong>Attribution</strong> decides which touchpoint gets credit for a conversion when a customer saw several:</p>
<ul>
<li><strong>Last-click</strong> — 100% to the final touch (simple, undervalues discovery).</li>
<li><strong>First-click</strong> — 100% to the first touch.</li>
<li><strong>Linear</strong> — split equally across touches.</li>
<li><strong>Data-driven</strong> — model-assigned weights from real paths.</li>
</ul>
<div class="callout"><span class="badge">The model changes the answer</span> The same campaign can look profitable under first-click and unprofitable under last-click. Always state which attribution model a ROAS number uses.</div>`,
    `<span class="eyebrow">MDA301 · Chương 5 · Bài 5.1</span>
<h2>Phân tích chiến dịch &amp; phễu</h2>
<h3>Phễu &amp; tỉ lệ chuyển đổi</h3>
<p>Một <strong>phễu (funnel)</strong> theo dõi bao nhiêu người qua từng bước tới mục tiêu. <strong>Tỉ lệ chuyển đổi</strong> của một bước = hoàn thành / vào bước. Tìm bước rơi rụng nhiều nhất — vá ở đó lời nhất.</p>
<pre><code>Truy cập 10.000 -> Thêm giỏ 1.200 (12%)
                -> Thanh toán 600 (50% của giỏ)
                -> Mua hàng   420 (70% của thanh toán)
Tỉ lệ chuyển đổi tổng = 420 / 10.000 = 4,2%
</code></pre>
<h3>A/B testing</h3>
<p><strong>A/B test</strong> chia lưu lượng giữa bản gốc (A) và bản thử (B) để đo tác động nhân quả của một thay đổi. Cần: <strong>giả thuyết</strong> rõ, <strong>cỡ mẫu</strong> đủ lớn, và <strong>ý nghĩa thống kê</strong> (thường p &lt; 0,05) trước khi công bố người thắng. Dừng sớm khi B "trông" nhỉnh hơn là lỗi kinh điển.</p>
<h3>Attribution (quy công)</h3>
<p><strong>Attribution</strong> quyết định điểm chạm nào được ghi công cho một chuyển đổi khi khách đã thấy nhiều điểm chạm:</p>
<ul>
<li><strong>Last-click</strong> — 100% cho chạm cuối (đơn giản, xem nhẹ khám phá).</li>
<li><strong>First-click</strong> — 100% cho chạm đầu.</li>
<li><strong>Linear</strong> — chia đều cho các chạm.</li>
<li><strong>Data-driven</strong> — mô hình gán trọng số từ đường đi thật.</li>
</ul>
<div class="callout"><span class="badge">Mô hình đổi câu trả lời</span> Cùng một chiến dịch có thể có lời theo first-click và lỗ theo last-click. Luôn nêu con số ROAS dùng mô hình attribution nào.</div>`,
  ]]);

const c5q = quiz('mda301-quiz-5', 'Quiz 5 — Campaign & funnel|||Quiz 5 — Chiến dịch & phễu', [
  { id: 'q1', question: 'Trong phễu, nên ưu tiên vá bước nào?', options: ['Bước đầu tiên luôn luôn', 'Bước có tỉ lệ rơi rụng lớn nhất', 'Bước cuối luôn luôn', 'Bước rẻ nhất'], correctIndex: 1, explanation: 'Cải thiện bước tụt nhiều nhất mang lại lợi ích lớn nhất.' },
  { id: 'q2', question: 'Trước khi công bố B thắng trong A/B test, cần?', options: ['Chỉ cần B nhỉnh hơn một chút', 'Đủ cỡ mẫu và đạt ý nghĩa thống kê', 'Dừng ngay khi thấy chênh lệch', 'Chạy đúng 1 ngày'], correctIndex: 1, explanation: 'Cần cỡ mẫu đủ và p đủ nhỏ; dừng sớm gây kết luận sai.' },
  { id: 'q3', question: 'Mô hình attribution nào ghi 100% công cho điểm chạm CUỐI?', options: ['First-click', 'Linear', 'Last-click', 'Data-driven'], correctIndex: 2, explanation: 'Last-click gán toàn bộ công cho tương tác cuối trước chuyển đổi.' },
]);

const c6 = doc('mda301-6-1-predictive', '6.1 — Basic predictive modeling|||6.1 — Mô hình dự đoán cơ bản',
  'Hồi quy tuyến tính (dự báo số) & logistic (dự đoán xác suất/phân loại, vd churn); phân khúc bằng clustering (k-means, mức khái niệm); tránh overfitting.',
  [[
    `<span class="eyebrow">MDA301 · Chapter 6 · Lesson 6.1</span>
<h2>Basic predictive modeling</h2>
<h3>Linear regression — predict a number</h3>
<p><strong>Linear regression</strong> fits a line <code>y = a + b·x</code> to estimate a numeric outcome — e.g. predicting sales from ad spend. The slope <code>b</code> says how much <code>y</code> moves per unit of <code>x</code>; <code>R²</code> says how much variation the model explains.</p>
<h3>Logistic regression — predict a probability</h3>
<p><strong>Logistic regression</strong> predicts the <em>probability</em> of a yes/no outcome (0–1) — will this customer churn? click? convert? It's the workhorse of classification in marketing.</p>
<h3>Clustering — find segments (unsupervised)</h3>
<p><strong>k-means clustering</strong> groups customers by similarity with <em>no</em> predefined labels — it discovers segments rather than being told them. Useful when you don't yet know what your customer types are.</p>
<pre><code>Supervised   -> you have a labeled target (churned yes/no)
                -> regression / classification
Unsupervised -> no target, find structure
                -> clustering (k-means)
</code></pre>
<div class="callout"><span class="badge">Correlation ≠ causation</span> A model that fits the past can still mislead: split data into <strong>train</strong> and <strong>test</strong> sets. A model perfect on training but poor on test is <strong>overfitting</strong> — memorizing noise, not learning the pattern.</div>`,
    `<span class="eyebrow">MDA301 · Chương 6 · Bài 6.1</span>
<h2>Mô hình dự đoán cơ bản</h2>
<h3>Hồi quy tuyến tính — dự báo một con số</h3>
<p><strong>Hồi quy tuyến tính</strong> khớp đường <code>y = a + b·x</code> để ước lượng kết quả dạng số — vd dự báo doanh số từ chi phí quảng cáo. Độ dốc <code>b</code> cho biết <code>y</code> đổi bao nhiêu trên mỗi đơn vị <code>x</code>; <code>R²</code> cho biết mô hình giải thích được bao nhiêu biến thiên.</p>
<h3>Hồi quy logistic — dự đoán một xác suất</h3>
<p><strong>Hồi quy logistic</strong> dự đoán <em>xác suất</em> của kết quả có/không (0–1) — khách này có churn không? click không? chuyển đổi không? Đây là công cụ phân loại chủ lực trong marketing.</p>
<h3>Clustering — tìm phân khúc (không giám sát)</h3>
<p><strong>k-means clustering</strong> gom khách theo độ tương đồng mà <em>không</em> cần nhãn định sẵn — nó khám phá phân khúc thay vì được cho trước. Hữu ích khi bạn chưa biết các nhóm khách của mình là gì.</p>
<pre><code>Có giám sát   -> có nhãn mục tiêu (churn có/không)
                 -> hồi quy / phân loại
Không giám sát -> không mục tiêu, tìm cấu trúc
                 -> clustering (k-means)
</code></pre>
<div class="callout"><span class="badge">Tương quan ≠ nhân quả</span> Mô hình khớp quá khứ vẫn có thể đánh lừa: chia dữ liệu thành tập <strong>train</strong> và <strong>test</strong>. Mô hình hoàn hảo trên train nhưng kém trên test là <strong>overfitting</strong> — học thuộc nhiễu, không học ra quy luật.</div>`,
  ]]);

const c6q = quiz('mda301-quiz-6', 'Quiz 6 — Predictive modeling|||Quiz 6 — Mô hình dự đoán', [
  { id: 'q1', question: 'Để dự đoán XÁC SUẤT khách sẽ churn (có/không) thường dùng?', options: ['Hồi quy tuyến tính', 'Hồi quy logistic', 'k-means', 'Pivot table'], correctIndex: 1, explanation: 'Logistic regression cho xác suất kết quả nhị phân → phù hợp bài toán churn.' },
  { id: 'q2', question: 'k-means là kỹ thuật?', options: ['Có giám sát, cần nhãn', 'Không giám sát, tự tìm phân khúc', 'Chỉ để làm sạch dữ liệu', 'Một mô hình attribution'], correctIndex: 1, explanation: 'k-means là clustering không giám sát: gom nhóm theo tương đồng, không cần nhãn.' },
  { id: 'q3', question: 'Mô hình khớp rất tốt trên train nhưng kém trên test gọi là?', options: ['Underfitting', 'Overfitting', 'Chuẩn hoá', 'Attribution'], correctIndex: 1, explanation: 'Overfitting: mô hình học thuộc nhiễu của tập train, không tổng quát được.' },
]);

const c7 = doc('mda301-7-1-dashboards', '7.1 — Visualization & dashboards|||7.1 — Trực quan hoá & dashboard',
  'Công cụ dashboard (Looker Studio/Power BI/Tableau); nguyên tắc chọn biểu đồ đúng; kể chuyện với dữ liệu (một thông điệp mỗi biểu đồ, ngữ cảnh, hành động).',
  [[
    `<span class="eyebrow">MDA301 · Chapter 7 · Lesson 7.1</span>
<h2>Visualization &amp; dashboards</h2>
<h3>Dashboard tools</h3>
<ul>
<li><strong>Looker Studio</strong> — free, connects to GA4/Sheets/Ads; great first dashboard.</li>
<li><strong>Power BI</strong> — Microsoft BI with DAX; strong in enterprises.</li>
<li><strong>Tableau</strong> — powerful, flexible visual analytics.</li>
</ul>
<h3>Choosing the right chart</h3>
<p>The chart should match the message — comparison → bar, trend → line, part-of-whole → stacked bar (use pie sparingly), relationship → scatter. Avoid 3D, dual axes and truncated y-axes that distort proportion.</p>
<h3>Storytelling with data</h3>
<p>A dashboard is not a data dump. Each view should answer one question and drive one decision.</p>
<pre><code>A good chart answers:
  1. What is the metric?           (title says it plainly)
  2. Compared to what?            (target, prior period)
  3. So what should we do?        (the takeaway)
</code></pre>
<div class="callout"><span class="badge">Audience first</span> An executive wants three KPIs and a trend; an analyst wants the breakdowns. Design for who reads it — and label units, dates and definitions so numbers can't be misread.</div>`,
    `<span class="eyebrow">MDA301 · Chương 7 · Bài 7.1</span>
<h2>Trực quan hoá &amp; dashboard</h2>
<h3>Công cụ dashboard</h3>
<ul>
<li><strong>Looker Studio</strong> — miễn phí, nối GA4/Sheets/Ads; dashboard đầu tay tuyệt vời.</li>
<li><strong>Power BI</strong> — BI của Microsoft với DAX; mạnh trong doanh nghiệp.</li>
<li><strong>Tableau</strong> — phân tích trực quan mạnh, linh hoạt.</li>
</ul>
<h3>Chọn đúng biểu đồ</h3>
<p>Biểu đồ phải khớp thông điệp — so sánh → cột, xu hướng → đường, phần trong tổng → cột chồng (dùng pie hạn chế), quan hệ → scatter. Tránh 3D, hai trục, và cắt trục y làm méo tỉ lệ.</p>
<h3>Kể chuyện với dữ liệu</h3>
<p>Dashboard không phải bãi đổ số. Mỗi khung nên trả lời một câu hỏi và dẫn tới một quyết định.</p>
<pre><code>Một biểu đồ tốt trả lời:
  1. Chỉ số là gì?               (tiêu đề nói rõ)
  2. So với cái gì?             (mục tiêu, kỳ trước)
  3. Vậy nên làm gì?           (thông điệp rút ra)
</code></pre>
<div class="callout"><span class="badge">Khán giả trước</span> Sếp cần ba KPI và một xu hướng; nhà phân tích cần các lát cắt chi tiết. Thiết kế theo người đọc — và ghi rõ đơn vị, mốc thời gian, định nghĩa để số không bị hiểu sai.</div>`,
  ]]);

const c7q = quiz('mda301-quiz-7', 'Quiz 7 — Dashboards|||Quiz 7 — Dashboard', [
  { id: 'q1', question: 'Để thể hiện XU HƯỚNG theo thời gian nên dùng?', options: ['Pie chart', 'Line chart', 'Scatter plot', 'Bảng số thô'], correctIndex: 1, explanation: 'Biểu đồ đường thể hiện thay đổi theo thời gian tốt nhất.' },
  { id: 'q2', question: 'Nguyên tắc kể chuyện dữ liệu tốt là?', options: ['Nhồi càng nhiều số càng tốt', 'Mỗi khung trả lời một câu hỏi, dẫn tới một quyết định', 'Luôn dùng biểu đồ 3D', 'Bỏ tiêu đề cho gọn'], correctIndex: 1, explanation: 'Dashboard hiệu quả: mỗi view một thông điệp, gắn với một hành động.' },
  { id: 'q3', question: 'Vì sao nên tránh cắt (truncate) trục y?', options: ['Làm biểu đồ xấu', 'Làm méo tỉ lệ, phóng đại chênh lệch', 'Chậm tải', 'Không tương thích Looker Studio'], correctIndex: 1, explanation: 'Trục y không bắt đầu từ 0 có thể phóng đại khác biệt, gây hiểu sai.' },
]);

const c8 = doc('mda301-8-1-roi-ethics', '8.1 — ROI/ROAS, decisions & ethics|||8.1 — ROI/ROAS, quyết định & đạo đức',
  'Đo ROI & ROAS; khái niệm marketing mix modeling; ra quyết định dựa dữ liệu; quyền riêng tư (GDPR/nghị định VN), sự đồng ý, và thiên lệch (bias) trong dữ liệu.',
  [[
    `<span class="eyebrow">MDA301 · Chapter 8 · Lesson 8.1</span>
<h2>ROI/ROAS, decisions &amp; ethics</h2>
<h3>Measuring return</h3>
<pre><code>ROAS = Revenue from ads / Ad spend
       e.g. 5,000 / 1,000 = 5.0  (5x)
ROI  = (Gain - Cost) / Cost
       e.g. (5,000 - 1,000) / 1,000 = 400%
</code></pre>
<p>ROAS looks only at ad revenue vs ad cost; ROI accounts for all costs and margin — a 5x ROAS can still be a losing ROI once product cost is included.</p>
<h3>Marketing mix &amp; data-driven decisions</h3>
<p><strong>Marketing mix modeling</strong> estimates how each channel contributes to sales so budget shifts to what works. But data <em>informs</em> judgment — it doesn't replace it: watch for confounders, seasonality and the limits of a short window.</p>
<h3>Ethics, privacy &amp; bias</h3>
<ul>
<li><strong>Privacy</strong> — laws like <strong>GDPR</strong> (and Vietnam's data-protection decree) require lawful basis, <strong>consent</strong> and data minimization. Collect what you need, secure it, honor deletion.</li>
<li><strong>Bias</strong> — data reflects who is in it; a model trained on biased data reproduces the bias (e.g. excluding groups from offers).</li>
<li><strong>Transparency</strong> — don't use dark patterns or manipulate vulnerable users; measurable ≠ ethical.</li>
</ul>
<div class="callout"><span class="badge">Just because you can measure it…</span> …doesn't mean you should collect it. Trust is a long-term KPI: a privacy breach costs more than any campaign earns.</div>`,
    `<span class="eyebrow">MDA301 · Chương 8 · Bài 8.1</span>
<h2>ROI/ROAS, quyết định &amp; đạo đức</h2>
<h3>Đo lợi nhuận</h3>
<pre><code>ROAS = Doanh thu từ quảng cáo / Chi phí quảng cáo
       vd 5.000 / 1.000 = 5,0  (5 lần)
ROI  = (Lợi ích - Chi phí) / Chi phí
       vd (5.000 - 1.000) / 1.000 = 400%
</code></pre>
<p>ROAS chỉ nhìn doanh thu quảng cáo so với chi phí quảng cáo; ROI tính mọi chi phí và biên lợi — ROAS 5 lần vẫn có thể lỗ ROI khi cộng giá vốn sản phẩm.</p>
<h3>Marketing mix &amp; quyết định dựa dữ liệu</h3>
<p><strong>Marketing mix modeling</strong> ước lượng mỗi kênh đóng góp vào doanh số bao nhiêu để dồn ngân sách vào cái hiệu quả. Nhưng dữ liệu <em>hỗ trợ</em> phán đoán — không thay thế nó: coi chừng yếu tố gây nhiễu, mùa vụ và giới hạn của cửa sổ đo ngắn.</p>
<h3>Đạo đức, quyền riêng tư &amp; thiên lệch</h3>
<ul>
<li><strong>Quyền riêng tư</strong> — luật như <strong>GDPR</strong> (và nghị định bảo vệ dữ liệu cá nhân của Việt Nam) đòi cơ sở pháp lý, <strong>sự đồng ý</strong> và tối thiểu hoá dữ liệu. Chỉ thu thứ cần, bảo mật, tôn trọng quyền xoá.</li>
<li><strong>Thiên lệch (bias)</strong> — dữ liệu phản ánh ai có trong đó; mô hình huấn luyện trên dữ liệu thiên lệch sẽ tái tạo thiên lệch (vd loại một nhóm khỏi ưu đãi).</li>
<li><strong>Minh bạch</strong> — không dùng dark pattern hay thao túng người dễ tổn thương; đo được ≠ đạo đức.</li>
</ul>
<div class="callout"><span class="badge">Đo được không có nghĩa nên thu</span> Niềm tin là một KPI dài hạn: một vụ rò rỉ quyền riêng tư tốn kém hơn bất kỳ chiến dịch nào kiếm được.</div>`,
  ]]);

const c8q = quiz('mda301-quiz-8', 'Quiz 8 — ROI & ethics|||Quiz 8 — ROI & đạo đức', [
  { id: 'q1', question: 'ROAS được tính bằng?', options: ['Chi phí quảng cáo / Doanh thu', 'Doanh thu từ quảng cáo / Chi phí quảng cáo', 'Lợi ích − Chi phí', 'Số click / Số hiển thị'], correctIndex: 1, explanation: 'ROAS = doanh thu quảng cáo chia chi phí quảng cáo (vd 5x).' },
  { id: 'q2', question: 'Vì sao ROAS 5x vẫn có thể LỖ về ROI?', options: ['ROAS luôn sai', 'ROI tính thêm mọi chi phí và biên lợi (vd giá vốn)', 'ROI chỉ tính quảng cáo', 'Chúng luôn bằng nhau'], correctIndex: 1, explanation: 'ROAS bỏ qua giá vốn/chi phí khác; ROI tính đủ nên có thể âm dù ROAS cao.' },
  { id: 'q3', question: 'Mô hình huấn luyện trên dữ liệu thiên lệch sẽ?', options: ['Tự sửa thiên lệch', 'Tái tạo và khuếch đại thiên lệch đó', 'Luôn công bằng', 'Không bị ảnh hưởng'], correctIndex: 1, explanation: 'Bias trong dữ liệu đầu vào bị mô hình học lại và tái tạo ở đầu ra.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'MDA301',
    slug: 'mda301-marketing-data-analytics',
    title: 'Marketing Data Analytics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MDA301.webp',
    shortDescription: 'Turn marketing data into decisions — data-driven basics, GA4 & first-party data, cleaning & EDA, RFM/CLV/churn, funnels/A-B testing/attribution, regression & clustering, dashboards, ROI/ROAS, ethics & privacy. Bilingual, formulas & quizzes.|||Biến dữ liệu marketing thành quyết định — nền tảng data-driven, GA4 & first-party, làm sạch & EDA, RFM/CLV/churn, phễu/A-B testing/attribution, hồi quy & clustering, dashboard, ROI/ROAS, đạo đức & riêng tư. Song ngữ, công thức & quiz.',
    description: 'Môn <strong>MDA301 — Marketing Data Analytics (Phân tích dữ liệu marketing)</strong> thuộc khối Công nghệ Truyền thông (kỳ 3) dạy bạn <strong>biến dữ liệu marketing thành quyết định</strong>. Từ <strong>nền tảng data-driven</strong> (metric vs KPI, mô tả/dự đoán/đề xuất) → <strong>nguồn dữ liệu &amp; GA4</strong> (event, first-party, UTM) → <strong>làm sạch &amp; EDA</strong> → <strong>phân tích khách hàng</strong> (RFM, cohort, CLV, churn) → <strong>chiến dịch &amp; phễu</strong> (conversion, A/B testing, attribution) → <strong>mô hình dự đoán</strong> (hồi quy, clustering) → <strong>dashboard</strong> (Looker Studio/Power BI, kể chuyện) → <strong>ROI/ROAS, đạo đức &amp; quyền riêng tư</strong>. Bám giáo trình chuẩn quốc tế (Winston, Grigsby, Google Analytics Academy), song ngữ, có công thức và quiz mỗi chương.',
    whatYouLearn: 'Data-driven marketing & phân biệt metric/KPI; nguồn dữ liệu, GA4 event-based, first-party data & UTM; làm sạch dữ liệu & EDA; phân khúc RFM, phân tích cohort, tính CLV, dự đoán churn; phễu & conversion rate, A/B testing, các mô hình attribution; hồi quy tuyến tính/logistic & clustering (k-means, mức khái niệm); dashboard với Looker Studio/Power BI & kể chuyện dữ liệu; đo ROI/ROAS, marketing mix, đạo đức, quyền riêng tư (GDPR) & bias.',
    requirements: 'Kiến thức marketing căn bản và toán/thống kê phổ thông. Nên có tài khoản Google để dùng GA4, Google Sheets và Looker Studio (miễn phí). Không cần biết lập trình.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Marketing analytics, vòng đo lường, ba mức phân tích.', lessons: [intro] },
    { title: 'Chương 1 — Phân tích dữ liệu marketing là gì|||Chapter 1 — What is marketing data analytics', description: 'Data-driven, mô tả/dự đoán/đề xuất, metric vs KPI.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nguồn dữ liệu & đo lường số|||Chapter 2 — Data sources & measurement', description: 'GA4 event, first-party data, UTM.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Làm sạch & khám phá dữ liệu|||Chapter 3 — Cleaning & EDA', description: 'Data cleaning, EDA, trực quan hoá cơ bản.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân tích khách hàng|||Chapter 4 — Customer analytics', description: 'RFM, cohort, CLV, churn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chiến dịch & phễu|||Chapter 5 — Campaign & funnel', description: 'Funnel, conversion, A/B testing, attribution.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mô hình dự đoán cơ bản|||Chapter 6 — Predictive modeling', description: 'Hồi quy tuyến tính/logistic, clustering.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trực quan hoá & dashboard|||Chapter 7 — Visualization & dashboards', description: 'Looker Studio/Power BI, kể chuyện dữ liệu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng & đạo đức|||Chapter 8 — Applications & ethics', description: 'ROI/ROAS, marketing mix, quyền riêng tư, bias.', lessons: [c8, c8q] },
  ],
};
