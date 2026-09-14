/**
 * BDA201 — Business Data Analytics. Giáo trình (syl): Provost & Fawcett "Data
 * Science for Business"; Evans "Business Analytics"; Camm et al "Business
 * Analytics" (Cengage); Microsoft Power BI docs. Descriptive/predictive/
 * prescriptive analytics, thu thập & làm sạch dữ liệu, thống kê mô tả &
 * trực quan hoá, Excel/PivotTable, SQL, dashboard BI, hồi quy & phân khúc,
 * data storytelling. Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('bda201-0-1-overview', 'Course overview: Business Data Analytics|||Tổng quan: Phân tích dữ liệu kinh doanh',
  'Business analytics là gì; ba loại phân tích (mô tả/dự báo/kê đơn); lộ trình: thu thập & làm sạch dữ liệu → thống kê & trực quan hoá → Excel/SQL → dashboard BI → dự báo → kể chuyện bằng dữ liệu.',
  [[
    `<span class="eyebrow">BDA201 · Lesson 0.1 · Overview</span>
<h2>Business Data Analytics</h2>
<p class="lead">This course teaches you to turn <strong>raw business data</strong> into <strong>decisions</strong>. You'll collect and clean real-world data, summarize it with statistics and charts, query it with Excel and SQL, build dashboards, run basic forecasts, and — just as important — communicate findings so leaders actually act on them.</p>
<h3>Why analytics matters in business</h3>
<p>Every function — sales, marketing, operations, finance, HR — now runs on data. A manager who can read a chart correctly, write a SQL query, or build a clean dashboard has an edge that has nothing to do with being a programmer.</p>
<h3>Roadmap</h3>
<p>Analytics process &amp; three analytics types → data collection &amp; cleaning → descriptive statistics &amp; visualization → Excel &amp; PivotTables → SQL queries → BI dashboards (Power BI/Tableau) → regression &amp; segmentation → data storytelling &amp; decisions. Bilingual, with worked examples and quizzes each chapter.</p>`,
    `<span class="eyebrow">BDA201 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích dữ liệu kinh doanh</h2>
<p class="lead">Môn này dạy bạn biến <strong>dữ liệu thô của doanh nghiệp</strong> thành <strong>quyết định</strong>. Bạn sẽ thu thập và làm sạch dữ liệu thực tế, tóm tắt bằng thống kê và biểu đồ, truy vấn bằng Excel và SQL, dựng dashboard, chạy dự báo cơ bản, và — quan trọng không kém — trình bày kết quả sao cho lãnh đạo thật sự hành động theo.</p>
<h3>Vì sao phân tích dữ liệu quan trọng trong kinh doanh</h3>
<p>Mọi bộ phận — bán hàng, marketing, vận hành, tài chính, nhân sự — giờ đều chạy trên dữ liệu. Một người quản lý đọc đúng biểu đồ, viết được câu SQL, hay dựng dashboard sạch sẽ có lợi thế không liên quan gì đến việc phải là lập trình viên.</p>
<h3>Lộ trình</h3>
<p>Quy trình phân tích &amp; ba loại phân tích → thu thập &amp; làm sạch dữ liệu → thống kê mô tả &amp; trực quan hoá → Excel &amp; PivotTable → truy vấn SQL → dashboard BI (Power BI/Tableau) → hồi quy &amp; phân khúc → kể chuyện bằng dữ liệu &amp; ra quyết định. Song ngữ, có ví dụ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('bda201-1-1-overview-analytics', '1.1 — Descriptive, predictive & prescriptive analytics|||1.1 — Phân tích mô tả, dự báo & kê đơn',
  'Ba loại phân tích (mô tả/dự báo/kê đơn); quy trình phân tích dữ liệu kinh doanh (từ câu hỏi kinh doanh đến hành động).',
  [[
    `<span class="eyebrow">BDA201 · Chapter 1 · Lesson 1.1</span>
<h2>Descriptive, predictive &amp; prescriptive analytics</h2>
<h3>Three types of business analytics</h3>
<ul>
<li><strong>Descriptive analytics</strong> — "What happened?" Reports, KPI dashboards, summary statistics. Example: last quarter's revenue by region.</li>
<li><strong>Predictive analytics</strong> — "What will happen?" Forecasting, regression, classification. Example: predicting next month's sales or which customers will churn.</li>
<li><strong>Prescriptive analytics</strong> — "What should we do?" Optimization, simulation, recommendation engines. Example: how much inventory to order per store.</li>
</ul>
<h3>The analytics process</h3>
<pre><code>Business question -&gt; Data collection -&gt; Data cleaning &amp; preparation
                  -&gt; Analysis / modeling -&gt; Insight
                  -&gt; Communicate -&gt; Decision / action -&gt; Measure results
</code></pre>
<p>Notice the loop: the process doesn't end at "insight" — it ends when someone acts on it, and you measure whether that action worked.</p>
<div class="callout"><span class="badge">This course's order</span> We follow this exact process, chapter by chapter: collect &amp; clean data (Ch.2) → describe it (Ch.3) → query it in Excel/SQL (Ch.4-5) → visualize it in dashboards (Ch.6) → predict with it (Ch.7) → tell its story for a decision (Ch.8).</div>`,
    `<span class="eyebrow">BDA201 · Chương 1 · Bài 1.1</span>
<h2>Phân tích mô tả, dự báo &amp; kê đơn</h2>
<h3>Ba loại phân tích dữ liệu kinh doanh</h3>
<ul>
<li><strong>Phân tích mô tả (descriptive)</strong> — "Chuyện gì đã xảy ra?" Báo cáo, dashboard KPI, thống kê tóm tắt. Ví dụ: doanh thu quý trước theo khu vực.</li>
<li><strong>Phân tích dự báo (predictive)</strong> — "Chuyện gì sẽ xảy ra?" Dự báo, hồi quy, phân loại. Ví dụ: dự báo doanh số tháng tới hoặc khách hàng nào sắp rời bỏ.</li>
<li><strong>Phân tích kê đơn (prescriptive)</strong> — "Nên làm gì?" Tối ưu hoá, mô phỏng, hệ gợi ý. Ví dụ: nên đặt bao nhiêu hàng tồn kho cho mỗi cửa hàng.</li>
</ul>
<h3>Quy trình phân tích</h3>
<pre><code>Câu hỏi kinh doanh -&gt; Thu thập dữ liệu -&gt; Làm sạch &amp; chuẩn bị dữ liệu
                   -&gt; Phân tích / mô hình hoá -&gt; Rút ra insight
                   -&gt; Truyền đạt -&gt; Quyết định / hành động -&gt; Đo lại kết quả
</code></pre>
<p>Chú ý vòng lặp: quy trình không dừng ở "insight" — nó chỉ kết thúc khi ai đó hành động theo, và bạn đo xem hành động đó có hiệu quả không.</p>
<div class="callout"><span class="badge">Thứ tự của môn này</span> Ta đi đúng quy trình này, từng chương: thu thập &amp; làm sạch dữ liệu (Ch.2) → mô tả nó (Ch.3) → truy vấn trong Excel/SQL (Ch.4-5) → trực quan hoá bằng dashboard (Ch.6) → dự báo bằng nó (Ch.7) → kể câu chuyện của nó để ra quyết định (Ch.8).</div>`,
  ]]);

const c1q = quiz('bda201-quiz-1', 'Quiz 1 — Analytics types & process|||Quiz 1 — Loại phân tích & quy trình', [
  { id: 'q1', question: 'Loại phân tích trả lời câu hỏi "Nên làm gì?" là?', options: ['Mô tả (descriptive)', 'Dự báo (predictive)', 'Kê đơn (prescriptive)', 'Không loại nào'], correctIndex: 2, explanation: 'Prescriptive dùng tối ưu hoá/mô phỏng để gợi ý hành động nên làm.' },
  { id: 'q2', question: 'Dự báo doanh số tháng tới thuộc loại phân tích nào?', options: ['Mô tả', 'Dự báo (predictive)', 'Kê đơn', 'Báo cáo KPI'], correctIndex: 1, explanation: 'Dự báo tương lai (forecasting/regression) là predictive analytics.' },
  { id: 'q3', question: 'Quy trình phân tích kết thúc khi nào?', options: ['Ngay khi có insight', 'Khi dữ liệu được làm sạch xong', 'Khi có hành động/quyết định và đo được kết quả', 'Khi vẽ xong biểu đồ'], correctIndex: 2, explanation: 'Insight vô dụng nếu không dẫn tới hành động; quy trình là một vòng lặp đo-lường-lại.' },
]);

const c2 = doc('bda201-2-1-data-collection-cleaning', '2.1 — Collecting, cleaning & managing business data|||2.1 — Thu thập, làm sạch & quản lý dữ liệu kinh doanh',
  'Nguồn dữ liệu kinh doanh (giao dịch, khảo sát, web analytics, bên thứ ba); các lỗi dữ liệu thường gặp; kỹ thuật làm sạch.',
  [[
    `<span class="eyebrow">BDA201 · Chapter 2 · Lesson 2.1</span>
<h2>Collecting, cleaning &amp; managing business data</h2>
<h3>Where business data comes from</h3>
<ul>
<li><strong>Transactional</strong> — POS/e-commerce orders, invoices, payments.</li>
<li><strong>Survey / CRM</strong> — customer feedback, support tickets, satisfaction scores.</li>
<li><strong>Web &amp; app analytics</strong> — clicks, page views, session duration.</li>
<li><strong>Third-party / open data</strong> — market reports, government statistics, APIs.</li>
</ul>
<h3>Common data quality problems ("garbage in, garbage out")</h3>
<ul>
<li><strong>Missing values</strong> — blank cells; decide to fill, estimate, or drop the row.</li>
<li><strong>Duplicates</strong> — the same customer/order recorded twice.</li>
<li><strong>Outliers</strong> — a $1,000,000 "typo" order that skews every average.</li>
<li><strong>Inconsistent formats</strong> — "VN", "Vietnam", "Viet Nam" all meaning one country; dates as DD/MM vs MM/DD.</li>
</ul>
<pre><code>Cleaning checklist:
 1. Remove exact duplicate rows
 2. Standardize categories/text (trim spaces, unify casing)
 3. Handle missing values (fill with mean/median, or flag & exclude)
 4. Flag outliers - investigate before deleting (may be real!)
 5. Fix data types (text "1,200" -&gt; number 1200)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Analysts spend roughly 60-80% of project time on collecting and cleaning data — not modeling. Skipping this step produces confident-looking, wrong answers.</div>`,
    `<span class="eyebrow">BDA201 · Chương 2 · Bài 2.1</span>
<h2>Thu thập, làm sạch &amp; quản lý dữ liệu kinh doanh</h2>
<h3>Dữ liệu kinh doanh đến từ đâu</h3>
<ul>
<li><strong>Giao dịch</strong> — đơn hàng POS/thương mại điện tử, hoá đơn, thanh toán.</li>
<li><strong>Khảo sát / CRM</strong> — phản hồi khách hàng, ticket hỗ trợ, điểm hài lòng.</li>
<li><strong>Web &amp; app analytics</strong> — lượt click, lượt xem trang, thời gian phiên.</li>
<li><strong>Bên thứ ba / dữ liệu mở</strong> — báo cáo thị trường, thống kê nhà nước, API.</li>
</ul>
<h3>Lỗi chất lượng dữ liệu thường gặp ("rác vào, rác ra")</h3>
<ul>
<li><strong>Thiếu giá trị</strong> — ô trống; cần quyết định điền, ước lượng, hay bỏ dòng.</li>
<li><strong>Trùng lặp</strong> — cùng một khách hàng/đơn hàng bị ghi hai lần.</li>
<li><strong>Ngoại lệ (outlier)</strong> — một đơn hàng "gõ nhầm" 1 tỷ đồng làm lệch mọi giá trị trung bình.</li>
<li><strong>Định dạng không nhất quán</strong> — "VN", "Vietnam", "Viet Nam" cùng nghĩa một nước; ngày viết DD/MM lẫn MM/DD.</li>
</ul>
<pre><code>Danh sách làm sạch:
 1. Xoá các dòng trùng lặp hoàn toàn
 2. Chuẩn hoá danh mục/văn bản (bỏ khoảng trắng thừa, thống nhất chữ hoa/thường)
 3. Xử lý giá trị thiếu (điền trung bình/trung vị, hoặc gắn cờ & loại trừ)
 4. Gắn cờ ngoại lệ - kiểm tra trước khi xoá (có thể là thật!)
 5. Sửa kiểu dữ liệu (chữ "1.200" -&gt; số 1200)
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Nhà phân tích thường tốn khoảng 60-80% thời gian dự án để thu thập và làm sạch dữ liệu — không phải mô hình hoá. Bỏ qua bước này cho ra kết quả trông tự tin nhưng sai.</div>`,
  ]]);

const c2q = quiz('bda201-quiz-2', 'Quiz 2 — Data collection & cleaning|||Quiz 2 — Thu thập & làm sạch dữ liệu', [
  { id: 'q1', question: 'Dữ liệu từ lượt click, lượt xem trang thuộc nguồn nào?', options: ['Giao dịch (transactional)', 'Web &amp; app analytics', 'Khảo sát', 'Bên thứ ba'], correctIndex: 1, explanation: 'Click, page view, thời gian phiên là dữ liệu web/app analytics.' },
  { id: 'q2', question: 'Một đơn hàng "gõ nhầm" giá trị cực lớn làm lệch trung bình gọi là?', options: ['Giá trị thiếu', 'Trùng lặp', 'Ngoại lệ (outlier)', 'Định dạng không nhất quán'], correctIndex: 2, explanation: 'Outlier là giá trị bất thường, cần kiểm tra trước khi loại bỏ.' },
  { id: 'q3', question: 'Vì sao KHÔNG nên xoá ngoại lệ ngay lập tức?', options: ['Ngoại lệ luôn là lỗi nhập liệu', 'Ngoại lệ có thể là dữ liệu thật, cần kiểm tra trước', 'Xoá ngoại lệ vi phạm pháp luật', 'Excel không cho phép xoá dòng'], correctIndex: 1, explanation: 'Một số ngoại lệ phản ánh sự kiện thật (đơn hàng lớn có thật) chứ không phải lỗi.' },
]);

const c3 = doc('bda201-3-1-descriptive-stats-viz', '3.1 — Descriptive statistics & data visualization|||3.1 — Thống kê mô tả & trực quan hoá dữ liệu',
  'Đại lượng đo xu hướng trung tâm (mean/median/mode) & độ phân tán (variance/độ lệch chuẩn); chọn đúng loại biểu đồ.',
  [[
    `<span class="eyebrow">BDA201 · Chapter 3 · Lesson 3.1</span>
<h2>Descriptive statistics &amp; data visualization</h2>
<h3>Central tendency: mean, median, mode</h3>
<ul>
<li><strong>Mean</strong> — the average; sensitive to outliers.</li>
<li><strong>Median</strong> — the middle value; robust to outliers (better for skewed data like income or house prices).</li>
<li><strong>Mode</strong> — the most frequent value; useful for categorical data.</li>
</ul>
<h3>Spread: variance &amp; standard deviation</h3>
<pre><code>Monthly sales (units): 40, 42, 38, 60, 41
Mean = (40+42+38+60+41) / 5 = 44.2
Median = sort -&gt; 38,40,41,42,60 -&gt; middle = 41
Standard deviation measures how spread out values are around the mean
  (large std dev = inconsistent sales; small = stable/predictable)
</code></pre>
<h3>Choosing the right chart</h3>
<ul>
<li><strong>Bar chart</strong> — compare categories (sales by region).</li>
<li><strong>Line chart</strong> — trend over time (monthly revenue).</li>
<li><strong>Scatter plot</strong> — relationship between two numeric variables (ad spend vs sales).</li>
<li><strong>Histogram</strong> — distribution/shape of one numeric variable (order sizes).</li>
<li><strong>Box plot</strong> — spread &amp; outliers at a glance.</li>
</ul>
<div class="callout"><span class="badge">Median beats mean here</span> If one customer's order (1 billion VND, a data-entry mistake) sits among normal 500,000 VND orders, the mean explodes — the median stays sensible.</div>`,
    `<span class="eyebrow">BDA201 · Chương 3 · Bài 3.1</span>
<h2>Thống kê mô tả &amp; trực quan hoá dữ liệu</h2>
<h3>Xu hướng trung tâm: mean, median, mode</h3>
<ul>
<li><strong>Mean (trung bình)</strong> — giá trị trung bình cộng; nhạy với ngoại lệ.</li>
<li><strong>Median (trung vị)</strong> — giá trị ở giữa; ít bị ảnh hưởng bởi ngoại lệ (tốt hơn cho dữ liệu lệch như thu nhập hay giá nhà).</li>
<li><strong>Mode (yếu vị)</strong> — giá trị xuất hiện nhiều nhất; hữu ích cho dữ liệu phân loại.</li>
</ul>
<h3>Độ phân tán: phương sai &amp; độ lệch chuẩn</h3>
<pre><code>Doanh số theo tháng (đơn vị): 40, 42, 38, 60, 41
Mean = (40+42+38+60+41) / 5 = 44.2
Median = sắp xếp -&gt; 38,40,41,42,60 -&gt; giữa = 41
Độ lệch chuẩn đo mức độ phân tán quanh giá trị trung bình
  (độ lệch chuẩn lớn = doanh số thất thường; nhỏ = ổn định/dự đoán được)
</code></pre>
<h3>Chọn đúng loại biểu đồ</h3>
<ul>
<li><strong>Biểu đồ cột (bar)</strong> — so sánh danh mục (doanh số theo khu vực).</li>
<li><strong>Biểu đồ đường (line)</strong> — xu hướng theo thời gian (doanh thu theo tháng).</li>
<li><strong>Biểu đồ phân tán (scatter)</strong> — mối quan hệ giữa hai biến số (chi phí quảng cáo và doanh số).</li>
<li><strong>Histogram</strong> — hình dạng phân phối của một biến số (kích cỡ đơn hàng).</li>
<li><strong>Box plot</strong> — nhìn nhanh độ phân tán &amp; ngoại lệ.</li>
</ul>
<div class="callout"><span class="badge">Median thắng mean ở đây</span> Nếu một đơn hàng của khách (1 tỷ đồng, do lỗi nhập liệu) lẫn trong các đơn 500.000đ bình thường, mean bị đẩy vọt lên — median vẫn hợp lý.</div>`,
  ]]);

const c3q = quiz('bda201-quiz-3', 'Quiz 3 — Descriptive stats & viz|||Quiz 3 — Thống kê mô tả & trực quan hoá', [
  { id: 'q1', question: 'Đại lượng nào ít bị ảnh hưởng bởi ngoại lệ nhất?', options: ['Mean', 'Median', 'Tổng (sum)', 'Phương sai'], correctIndex: 1, explanation: 'Median (trung vị) chỉ phụ thuộc vị trí giữa, không bị kéo bởi giá trị cực đoan.' },
  { id: 'q2', question: 'Nên dùng biểu đồ nào để xem xu hướng doanh thu theo tháng?', options: ['Biểu đồ đường (line)', 'Box plot', 'Histogram', 'Pie chart'], correctIndex: 0, explanation: 'Line chart phù hợp nhất để thể hiện xu hướng theo thời gian.' },
  { id: 'q3', question: 'Độ lệch chuẩn lớn cho biết điều gì?', options: ['Dữ liệu ổn định', 'Dữ liệu phân tán/thất thường quanh trung bình', 'Không có ngoại lệ', 'Tất cả giá trị bằng nhau'], correctIndex: 1, explanation: 'Độ lệch chuẩn lớn nghĩa là các giá trị nằm xa trung bình, biến động nhiều.' },
]);

const c4 = doc('bda201-4-1-excel-pivot', '4.1 — Advanced Excel & PivotTables for analysis|||4.1 — Excel nâng cao & PivotTable cho phân tích',
  'Hàm tra cứu & điều kiện (VLOOKUP/XLOOKUP, SUMIFS/COUNTIFS), PivotTable/PivotChart, slicer, định dạng có điều kiện.',
  [[
    `<span class="eyebrow">BDA201 · Chapter 4 · Lesson 4.1</span>
<h2>Advanced Excel &amp; PivotTables for analysis</h2>
<h3>Key functions for analysis</h3>
<pre><code>=VLOOKUP(A2, Products!A:C, 3, FALSE)   ' find product price by ID
=XLOOKUP(A2, Products!A:A, Products!C:C)  ' modern, more flexible lookup
=SUMIFS(Sales!D:D, Sales!B:B, "Hanoi", Sales!C:C, "2026")
                                        ' sum sales where region=Hanoi AND year=2026
=COUNTIFS(Orders!A:A, "&gt;100")         ' count orders bigger than 100
=IF(D2&gt;1000000, "VIP", "Regular")      ' simple business rule
</code></pre>
<h3>PivotTables — summarize without formulas</h3>
<p>A <strong>PivotTable</strong> drags fields into <strong>Rows</strong> (e.g. Region), <strong>Columns</strong> (e.g. Year), and <strong>Values</strong> (e.g. Sum of Revenue) to instantly cross-tabulate thousands of rows. A <strong>PivotChart</strong> visualizes it. <strong>Slicers</strong> add clickable filter buttons (e.g. filter by Product Category) that update the whole pivot at once.</p>
<h3>Conditional formatting</h3>
<p>Highlight cells automatically — e.g. color scale on revenue, red flag on overdue invoices — so problems jump out without reading every row.</p>
<div class="callout"><span class="badge">Why PivotTable first</span> Before writing any SQL, most business analysts prototype the question in a PivotTable — it's faster to explore and self-documenting for non-technical stakeholders.</div>`,
    `<span class="eyebrow">BDA201 · Chương 4 · Bài 4.1</span>
<h2>Excel nâng cao &amp; PivotTable cho phân tích</h2>
<h3>Các hàm quan trọng cho phân tích</h3>
<pre><code>=VLOOKUP(A2, Products!A:C, 3, FALSE)   ' tra giá sản phẩm theo mã ID
=XLOOKUP(A2, Products!A:A, Products!C:C)  ' tra cứu hiện đại, linh hoạt hơn
=SUMIFS(Sales!D:D, Sales!B:B, "Hanoi", Sales!C:C, "2026")
                                        ' cộng doanh số nơi khu vực=Hanoi VÀ năm=2026
=COUNTIFS(Orders!A:A, "&gt;100")         ' đếm đơn hàng lớn hơn 100
=IF(D2&gt;1000000, "VIP", "Thường")       ' quy tắc kinh doanh đơn giản
</code></pre>
<h3>PivotTable — tóm tắt mà không cần viết công thức</h3>
<p>Một <strong>PivotTable</strong> kéo các trường vào <strong>Rows</strong> (vd Khu vực), <strong>Columns</strong> (vd Năm), và <strong>Values</strong> (vd Tổng doanh thu) để lập bảng chéo hàng nghìn dòng ngay lập tức. Một <strong>PivotChart</strong> trực quan hoá bảng đó. <strong>Slicer</strong> thêm nút lọc bấm được (vd lọc theo Danh mục sản phẩm) cập nhật toàn bộ pivot cùng lúc.</p>
<h3>Định dạng có điều kiện (conditional formatting)</h3>
<p>Tự động tô màu ô — vd thang màu theo doanh thu, gắn cờ đỏ hoá đơn quá hạn — để vấn đề hiện ra ngay mà không cần đọc từng dòng.</p>
<div class="callout"><span class="badge">Vì sao PivotTable trước</span> Trước khi viết bất kỳ câu SQL nào, hầu hết nhà phân tích thử nghiệm câu hỏi trong PivotTable trước — khám phá nhanh hơn và tự giải thích được với người không rành kỹ thuật.</div>`,
  ]]);

const c4q = quiz('bda201-quiz-4', 'Quiz 4 — Excel & PivotTable|||Quiz 4 — Excel & PivotTable', [
  { id: 'q1', question: 'Hàm nào cộng doanh số theo NHIỀU điều kiện cùng lúc (vd khu vực VÀ năm)?', options: ['VLOOKUP', 'SUMIFS', 'COUNTIF', 'IF'], correctIndex: 1, explanation: 'SUMIFS cộng theo nhiều điều kiện; SUMIF chỉ nhận một điều kiện.' },
  { id: 'q2', question: 'Trong PivotTable, để lập bảng chéo Khu vực (dòng) × Năm (cột) × Tổng doanh thu (giá trị), cần kéo trường vào đâu?', options: ['Chỉ vào Values', 'Rows, Columns, Values tương ứng', 'Chỉ vào Filters', 'Không cần kéo, Excel tự làm'], correctIndex: 1, explanation: 'PivotTable cần đặt đúng trường vào Rows/Columns/Values để lập bảng chéo.' },
  { id: 'q3', question: 'Slicer trong PivotTable dùng để làm gì?', options: ['Xoá dữ liệu gốc', 'Thêm nút lọc bấm được, cập nhật cả pivot', 'Tính tổng thay cho SUMIFS', 'Sắp xếp bảng tính'], correctIndex: 1, explanation: 'Slicer là nút lọc trực quan, click để lọc toàn bộ PivotTable/PivotChart liên kết.' },
]);

const c5 = doc('bda201-5-1-sql-queries', '5.1 — Querying business data with SQL|||5.1 — Truy vấn dữ liệu kinh doanh bằng SQL',
  'SELECT/WHERE/GROUP BY/ORDER BY, hàm tổng hợp (SUM/COUNT/AVG), JOIN nối bảng; ví dụ truy vấn doanh số theo khu vực.',
  [[
    `<span class="eyebrow">BDA201 · Chapter 5 · Lesson 5.1</span>
<h2>Querying business data with SQL</h2>
<h3>The core pattern</h3>
<pre><code>SELECT region, SUM(revenue) AS total_revenue
FROM sales
WHERE year = 2026
GROUP BY region
ORDER BY total_revenue DESC;
</code></pre>
<p>Read it as: pick columns (<strong>SELECT</strong>) → from a table (<strong>FROM</strong>) → filter rows (<strong>WHERE</strong>) → group into buckets (<strong>GROUP BY</strong>) → sort the result (<strong>ORDER BY</strong>).</p>
<h3>Aggregate functions</h3>
<p><code>SUM()</code>, <code>COUNT()</code>, <code>AVG()</code>, <code>MIN()</code>, <code>MAX()</code> — the same summaries a PivotTable does, but on any size of data and fully reproducible.</p>
<h3>JOIN — combining tables</h3>
<pre><code>SELECT c.customer_name, o.order_date, o.amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.amount &gt; 500;
</code></pre>
<p>Business data usually lives in separate tables (customers, orders, products) — <strong>JOIN</strong> links them by a shared key (like <code>customer_id</code>), the SQL equivalent of Excel's VLOOKUP but across whole tables at once.</p>
<div class="callout"><span class="badge">SQL vs Excel</span> Excel is great for a few thousand rows you can eyeball. SQL scales to millions of rows, runs the exact same query every time, and is how analytics teams actually pull data from company databases.</div>`,
    `<span class="eyebrow">BDA201 · Chương 5 · Bài 5.1</span>
<h2>Truy vấn dữ liệu kinh doanh bằng SQL</h2>
<h3>Cấu trúc cốt lõi</h3>
<pre><code>SELECT region, SUM(revenue) AS total_revenue
FROM sales
WHERE year = 2026
GROUP BY region
ORDER BY total_revenue DESC;
</code></pre>
<p>Đọc là: chọn cột (<strong>SELECT</strong>) → từ một bảng (<strong>FROM</strong>) → lọc dòng (<strong>WHERE</strong>) → gom nhóm (<strong>GROUP BY</strong>) → sắp xếp kết quả (<strong>ORDER BY</strong>).</p>
<h3>Hàm tổng hợp</h3>
<p><code>SUM()</code>, <code>COUNT()</code>, <code>AVG()</code>, <code>MIN()</code>, <code>MAX()</code> — cùng loại tóm tắt mà PivotTable làm, nhưng chạy trên dữ liệu cỡ nào cũng được và luôn tái tạo được y hệt.</p>
<h3>JOIN — nối các bảng</h3>
<pre><code>SELECT c.customer_name, o.order_date, o.amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.amount &gt; 500;
</code></pre>
<p>Dữ liệu kinh doanh thường nằm ở nhiều bảng riêng (khách hàng, đơn hàng, sản phẩm) — <strong>JOIN</strong> nối chúng qua một khoá chung (như <code>customer_id</code>), tương đương VLOOKUP của Excel nhưng nối cả bảng cùng lúc.</p>
<div class="callout"><span class="badge">SQL so với Excel</span> Excel tốt cho vài nghìn dòng nhìn bằng mắt được. SQL mở rộng tới hàng triệu dòng, chạy lại y hệt mỗi lần, và là cách các đội phân tích thực sự lấy dữ liệu từ cơ sở dữ liệu công ty.</div>`,
  ]]);

const c5q = quiz('bda201-quiz-5', 'Quiz 5 — SQL queries|||Quiz 5 — Truy vấn SQL', [
  { id: 'q1', question: 'Mệnh đề nào dùng để LỌC dòng trước khi gom nhóm?', options: ['GROUP BY', 'ORDER BY', 'WHERE', 'SELECT'], correctIndex: 2, explanation: 'WHERE lọc dòng dựa trên điều kiện, chạy trước GROUP BY.' },
  { id: 'q2', question: 'JOIN dùng để làm gì?', options: ['Xoá dòng trùng', 'Nối hai bảng qua khoá chung', 'Sắp xếp kết quả', 'Đếm số dòng'], correctIndex: 1, explanation: 'JOIN kết hợp dữ liệu từ nhiều bảng dựa trên khoá liên kết (vd customer_id).' },
  { id: 'q3', question: 'Câu SQL: SELECT region, SUM(revenue) FROM sales GROUP BY region; kết quả trả về?', options: ['Từng dòng bán hàng riêng lẻ', 'Tổng doanh thu theo từng khu vực', 'Chỉ khu vực có doanh thu cao nhất', 'Lỗi cú pháp'], correctIndex: 1, explanation: 'GROUP BY region gom các dòng cùng khu vực lại, SUM(revenue) tính tổng cho mỗi nhóm.' },
]);

const c6 = doc('bda201-6-1-dashboard-bi', '6.1 — Dashboards & business intelligence (Power BI/Tableau)|||6.1 — Dashboard & business intelligence (Power BI/Tableau)',
  'Công cụ BI (Power BI/Tableau), mô hình dữ liệu (star schema), thẻ KPI, bộ lọc tương tác, nguyên tắc thiết kế dashboard.',
  [[
    `<span class="eyebrow">BDA201 · Chapter 6 · Lesson 6.1</span>
<h2>Dashboards &amp; business intelligence (Power BI / Tableau)</h2>
<h3>What a BI tool adds over Excel</h3>
<p><strong>Power BI</strong> and <strong>Tableau</strong> connect directly to live databases, refresh automatically, and let anyone click a filter without touching a formula. They turn a one-time report into a living, always-current dashboard.</p>
<h3>A simple data model: star schema</h3>
<pre><code>          Dim_Customer
               |
Dim_Date --- Fact_Sales --- Dim_Product
               |
          Dim_Region
</code></pre>
<p>One central <strong>fact table</strong> (transactions/measures, e.g. sales amount) links to several small <strong>dimension tables</strong> (customer, date, product, region) — this shape makes filtering and aggregating fast and intuitive.</p>
<h3>Dashboard building blocks</h3>
<ul>
<li><strong>KPI cards</strong> — one big number (e.g. "Total Revenue: 2.4B VND") with a trend arrow.</li>
<li><strong>Interactive filters/slicers</strong> — click "2026" or "Hanoi" and every chart updates together.</li>
<li><strong>Charts</strong> — the same bar/line/scatter choices from Chapter 3, now interactive.</li>
</ul>
<div class="callout"><span class="badge">Design principle</span> A good dashboard answers one clear business question per screen — top KPIs first, then the detail a viewer would drill into next. Cramming 15 charts on one page defeats the purpose.</div>`,
    `<span class="eyebrow">BDA201 · Chương 6 · Bài 6.1</span>
<h2>Dashboard &amp; business intelligence (Power BI / Tableau)</h2>
<h3>Công cụ BI thêm gì so với Excel</h3>
<p><strong>Power BI</strong> và <strong>Tableau</strong> kết nối trực tiếp tới cơ sở dữ liệu sống, tự làm mới, và cho phép ai cũng bấm bộ lọc mà không cần đụng công thức. Chúng biến một báo cáo một lần thành dashboard sống, luôn cập nhật.</p>
<h3>Mô hình dữ liệu đơn giản: star schema</h3>
<pre><code>          Dim_Customer
               |
Dim_Date --- Fact_Sales --- Dim_Product
               |
          Dim_Region
</code></pre>
<p>Một <strong>bảng sự kiện (fact table)</strong> trung tâm (giao dịch/số đo, vd số tiền bán hàng) nối với vài <strong>bảng chiều (dimension)</strong> nhỏ (khách hàng, ngày, sản phẩm, khu vực) — hình dạng này giúp lọc và tổng hợp nhanh, dễ hiểu.</p>
<h3>Khối xây dựng dashboard</h3>
<ul>
<li><strong>Thẻ KPI</strong> — một con số lớn (vd "Tổng doanh thu: 2,4 tỷ đồng") kèm mũi tên xu hướng.</li>
<li><strong>Bộ lọc/slicer tương tác</strong> — bấm "2026" hoặc "Hà Nội" và mọi biểu đồ cập nhật cùng lúc.</li>
<li><strong>Biểu đồ</strong> — cùng các lựa chọn bar/line/scatter ở Chương 3, giờ tương tác được.</li>
</ul>
<div class="callout"><span class="badge">Nguyên tắc thiết kế</span> Một dashboard tốt trả lời đúng một câu hỏi kinh doanh rõ ràng trên mỗi màn hình — KPI quan trọng nhất trước, rồi tới chi tiết mà người xem sẽ đào sâu tiếp. Nhồi 15 biểu đồ vào một trang là phản tác dụng.</div>`,
  ]]);

const c6q = quiz('bda201-quiz-6', 'Quiz 6 — Dashboards & BI|||Quiz 6 — Dashboard & BI', [
  { id: 'q1', question: 'Trong star schema, bảng chứa số đo giao dịch (vd doanh thu) gọi là?', options: ['Dimension table', 'Fact table', 'Lookup table', 'Pivot table'], correctIndex: 1, explanation: 'Fact table là bảng trung tâm chứa các số đo (measures) như doanh thu, số lượng.' },
  { id: 'q2', question: 'Lợi thế chính của Power BI/Tableau so với báo cáo Excel tĩnh là gì?', options: ['Chỉ chạy được offline', 'Kết nối dữ liệu sống, tự cập nhật, lọc tương tác', 'Không cần dữ liệu sạch', 'Chỉ vẽ được biểu đồ tròn'], correctIndex: 1, explanation: 'BI tool kết nối trực tiếp database, tự refresh, và cho phép lọc tương tác toàn dashboard.' },
  { id: 'q3', question: 'Nguyên tắc thiết kế dashboard tốt là gì?', options: ['Nhồi càng nhiều biểu đồ càng tốt', 'Trả lời một câu hỏi kinh doanh rõ ràng mỗi màn hình', 'Chỉ dùng màu đỏ và xanh', 'Không cần KPI card'], correctIndex: 1, explanation: 'Dashboard hiệu quả tập trung vào một câu hỏi/mục tiêu rõ ràng, tránh nhồi nhét.' },
]);

const c7 = doc('bda201-7-1-forecasting-regression', '7.1 — Basic predictive analytics: regression & customer segmentation|||7.1 — Phân tích dự báo cơ bản: hồi quy & phân khúc khách hàng',
  'Hồi quy tuyến tính đơn giản (y = a + bx), R²; dự báo doanh số; phân khúc khách hàng bằng RFM.',
  [[
    `<span class="eyebrow">BDA201 · Chapter 7 · Lesson 7.1</span>
<h2>Basic predictive analytics: regression &amp; segmentation</h2>
<h3>Simple linear regression</h3>
<p>Regression finds the straight line that best fits the relationship between an input (x) and an output (y):</p>
<pre><code>y = a + b*x
  y = predicted value (e.g. sales)
  x = input variable (e.g. advertising spend)
  b = slope: how much y changes per unit of x
  a = intercept: predicted y when x = 0

Example: sales = 10,000 + 3.5 * ad_spend
  If ad_spend = 2,000 -&gt; predicted sales = 10,000 + 3.5*2,000 = 17,000
</code></pre>
<p><strong>R² (R-squared)</strong> tells you how well the line fits — closer to 1 means the input variable explains most of the variation in the output; closer to 0 means it barely helps.</p>
<h3>Customer segmentation with RFM</h3>
<ul>
<li><strong>Recency</strong> — how recently did they buy?</li>
<li><strong>Frequency</strong> — how often do they buy?</li>
<li><strong>Monetary</strong> — how much do they spend?</li>
</ul>
<p>Scoring customers on these three dimensions groups them into segments like "champions" (recent, frequent, big spenders) vs "at risk" (used to buy a lot, haven't in a while) — each segment gets a different marketing action.</p>
<div class="callout"><span class="badge">Correlation ≠ causation</span> A regression showing ad spend predicts sales does not prove ads caused the sales — a third factor (holiday season) could drive both. Predictive models describe patterns, not always causes.</div>`,
    `<span class="eyebrow">BDA201 · Chương 7 · Bài 7.1</span>
<h2>Phân tích dự báo cơ bản: hồi quy &amp; phân khúc khách hàng</h2>
<h3>Hồi quy tuyến tính đơn giản</h3>
<p>Hồi quy tìm đường thẳng khớp nhất với mối quan hệ giữa đầu vào (x) và đầu ra (y):</p>
<pre><code>y = a + b*x
  y = giá trị dự báo (vd doanh số)
  x = biến đầu vào (vd chi phí quảng cáo)
  b = độ dốc: y thay đổi bao nhiêu khi x tăng 1 đơn vị
  a = hệ số chặn: giá trị y dự báo khi x = 0

Ví dụ: doanh số = 10.000 + 3,5 * chi_phi_qc
  Nếu chi_phi_qc = 2.000 -&gt; doanh số dự báo = 10.000 + 3,5*2.000 = 17.000
</code></pre>
<p><strong>R² (R bình phương)</strong> cho biết đường thẳng khớp tốt đến đâu — gần 1 nghĩa là biến đầu vào giải thích được phần lớn biến động của đầu ra; gần 0 nghĩa là gần như không giúp ích.</p>
<h3>Phân khúc khách hàng bằng RFM</h3>
<ul>
<li><strong>Recency (Gần đây)</strong> — họ mua gần đây nhất khi nào?</li>
<li><strong>Frequency (Tần suất)</strong> — họ mua thường xuyên ra sao?</li>
<li><strong>Monetary (Giá trị)</strong> — họ chi bao nhiêu?</li>
</ul>
<p>Chấm điểm khách hàng theo ba chiều này nhóm họ thành các phân khúc như "khách hàng vàng" (mua gần đây, thường xuyên, chi nhiều) so với "có nguy cơ rời bỏ" (từng mua nhiều nhưng lâu rồi không quay lại) — mỗi phân khúc nhận một hành động marketing khác nhau.</p>
<div class="callout"><span class="badge">Tương quan ≠ nhân quả</span> Hồi quy cho thấy chi phí quảng cáo dự báo được doanh số không chứng minh quảng cáo GÂY RA doanh số — một yếu tố thứ ba (mùa lễ hội) có thể tác động đến cả hai. Mô hình dự báo mô tả khuôn mẫu, không phải lúc nào cũng chỉ ra nguyên nhân.</div>`,
  ]]);

const c7q = quiz('bda201-quiz-7', 'Quiz 7 — Regression & segmentation|||Quiz 7 — Hồi quy & phân khúc khách hàng', [
  { id: 'q1', question: 'Trong công thức hồi quy y = a + b*x, "b" đại diện cho điều gì?', options: ['Giá trị dự báo', 'Hệ số chặn khi x=0', 'Độ dốc: y thay đổi bao nhiêu khi x tăng 1 đơn vị', 'Sai số ngẫu nhiên'], correctIndex: 2, explanation: 'b là độ dốc (slope), thể hiện mức thay đổi của y ứng với mỗi đơn vị x.' },
  { id: 'q2', question: 'RFM viết tắt của ba yếu tố nào để phân khúc khách hàng?', options: ['Recency, Frequency, Monetary', 'Revenue, Forecast, Margin', 'Region, Format, Metric', 'Rating, Feedback, Market'], correctIndex: 0, explanation: 'RFM = Recency (gần đây), Frequency (tần suất), Monetary (giá trị chi tiêu).' },
  { id: 'q3', question: 'Vì sao "tương quan không phải nhân quả" quan trọng khi đọc kết quả hồi quy?', options: ['Vì hồi quy luôn sai', 'Vì một yếu tố thứ ba có thể gây ra cả hai biến, không phải x gây ra y', 'Vì R² luôn bằng 1', 'Vì Excel không tính được hồi quy'], correctIndex: 1, explanation: 'Hai biến cùng biến động không có nghĩa biến này gây ra biến kia; có thể do yếu tố ẩn khác.' },
]);

const c8 = doc('bda201-8-1-storytelling-decisions', '8.1 — Data storytelling & data-driven decision making|||8.1 — Kể chuyện bằng dữ liệu & ra quyết định dựa trên dữ liệu',
  'Cấu trúc một câu chuyện dữ liệu (bối cảnh→insight→ý nghĩa→hành động); tránh biểu đồ gây hiểu lầm; trình bày cho lãnh đạo.',
  [[
    `<span class="eyebrow">BDA201 · Chapter 8 · Lesson 8.1</span>
<h2>Data storytelling &amp; data-driven decision making</h2>
<h3>Structuring a data story</h3>
<pre><code>Context   -&gt; Why does this matter right now?
Insight   -&gt; What does the data actually show?
So what?  -&gt; Why should the audience care?
Action    -&gt; What decision or next step follows?
</code></pre>
<p>A dashboard full of charts is not a story. A story picks the two or three numbers that matter for THIS decision and explains them in plain language before showing the chart.</p>
<h3>Avoiding misleading visuals</h3>
<ul>
<li><strong>Truncated y-axis</strong> — starting a bar chart at 90 instead of 0 makes a 2% change look huge. Always show the full scale, or clearly label it.</li>
<li><strong>Too many colors/3D effects</strong> — "chart junk" that distracts from the actual comparison.</li>
<li><strong>Cherry-picked time range</strong> — showing only the weeks that support your point hides the real trend.</li>
</ul>
<h3>Presenting to stakeholders</h3>
<p>Lead with the <strong>recommendation</strong>, then back it with the minimum evidence needed — most executives want the "so what" in the first sentence, not buried after ten slides of methodology.</p>
<div class="callout"><span class="badge">The point of this whole course</span> Every chapter — cleaning, statistics, SQL, dashboards, regression — exists to feed this final step. An analysis that never changes a decision was, in a business sense, wasted effort.</div>`,
    `<span class="eyebrow">BDA201 · Chương 8 · Bài 8.1</span>
<h2>Kể chuyện bằng dữ liệu &amp; ra quyết định dựa trên dữ liệu</h2>
<h3>Cấu trúc một câu chuyện dữ liệu</h3>
<pre><code>Bối cảnh   -&gt; Vì sao điều này quan trọng ngay lúc này?
Insight    -&gt; Dữ liệu thực sự cho thấy điều gì?
Ý nghĩa    -&gt; Vì sao người nghe nên quan tâm?
Hành động  -&gt; Quyết định hay bước tiếp theo là gì?
</code></pre>
<p>Một dashboard đầy biểu đồ không phải là một câu chuyện. Một câu chuyện chọn ra hai-ba con số quan trọng nhất cho quyết định NÀY và giải thích bằng lời đơn giản trước khi cho xem biểu đồ.</p>
<h3>Tránh biểu đồ gây hiểu lầm</h3>
<ul>
<li><strong>Trục y bị cắt cụt</strong> — bắt đầu biểu đồ cột từ 90 thay vì 0 khiến thay đổi 2% trông rất lớn. Luôn hiện đủ thang đo, hoặc ghi rõ.</li>
<li><strong>Quá nhiều màu/hiệu ứng 3D</strong> — "rác biểu đồ" làm xao nhãng khỏi so sánh thực sự.</li>
<li><strong>Chọn lọc khoảng thời gian có lợi</strong> — chỉ trình bày những tuần ủng hộ luận điểm của bạn che giấu xu hướng thật.</li>
</ul>
<h3>Trình bày cho lãnh đạo</h3>
<p>Mở đầu bằng <strong>khuyến nghị</strong>, rồi mới đưa bằng chứng tối thiểu cần thiết — hầu hết lãnh đạo muốn nghe "vậy thì sao" ngay câu đầu tiên, không phải chôn sau mười slide phương pháp luận.</p>
<div class="callout"><span class="badge">Mục đích của cả môn học</span> Mọi chương — làm sạch, thống kê, SQL, dashboard, hồi quy — đều tồn tại để nuôi bước cuối cùng này. Một phân tích không bao giờ thay đổi quyết định nào, xét theo nghĩa kinh doanh, là công sức lãng phí.</div>`,
  ]]);

const c8q = quiz('bda201-quiz-8', 'Quiz 8 — Storytelling & decisions|||Quiz 8 — Kể chuyện bằng dữ liệu & quyết định', [
  { id: 'q1', question: 'Bốn bước cấu trúc một câu chuyện dữ liệu là gì?', options: ['Thu thập → Làm sạch → Phân tích → Lưu trữ', 'Bối cảnh → Insight → Ý nghĩa → Hành động', 'SELECT → WHERE → GROUP BY → ORDER BY', 'Mean → Median → Mode → Variance'], correctIndex: 1, explanation: 'Cấu trúc kể chuyện dữ liệu: Context → Insight → So what → Action.' },
  { id: 'q2', question: 'Vì sao cắt cụt trục y (không bắt đầu từ 0) có thể gây hiểu lầm?', options: ['Vì Excel không cho phép', 'Vì nó khiến một thay đổi nhỏ trông như rất lớn', 'Vì nó làm biểu đồ chạy chậm hơn', 'Vì nó vi phạm định dạng file'], correctIndex: 1, explanation: 'Trục y bị cắt phóng đại chênh lệch trực quan, đánh lừa người xem về độ lớn thay đổi.' },
  { id: 'q3', question: 'Khi trình bày cho lãnh đạo, nên mở đầu bằng gì?', options: ['Toàn bộ phương pháp thu thập dữ liệu', 'Khuyến nghị/kết luận chính trước', 'Danh sách mọi biểu đồ đã vẽ', 'Lịch sử của công cụ phân tích'], correctIndex: 1, explanation: 'Lãnh đạo bận rộn muốn nghe kết luận và khuyến nghị trước, chi tiết chỉ khi cần.' },
]);

const taiLieu = doc('bda201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, tài liệu chính thức miễn phí, YouTube, công cụ (Excel/SQL/Power BI), lộ trình tự học.',
  [[
    `<span class="eyebrow">BDA201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Business Data Analytics — analytics types, data cleaning, statistics &amp; visualization, Excel/SQL, BI dashboards, regression &amp; storytelling — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for BDA201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.data-science-for-biz.com/" target="_blank" rel="noopener"><em>Data Science for Business</em> — Foster Provost &amp; Tom Fawcett</a></li>
<li><a href="https://www.cengage.com/c/business-analytics-4e-camm/9780357131787/" target="_blank" rel="noopener"><em>Business Analytics</em> — Camm, Cochran, Fry, Ohlmann (Cengage)</a></li>
<li><a href="https://www.wiley.com/en-us/Business+Analytics-p-9781119901673" target="_blank" rel="noopener"><em>Business Analytics</em> — James R. Evans</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://learn.microsoft.com/en-us/power-bi/" target="_blank" rel="noopener">Microsoft Power BI documentation</a></li>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Microsoft Excel support &amp; function reference</a></li>
<li><a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener">W3Schools SQL Tutorial</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@LeilaGharani" target="_blank" rel="noopener">Leila Gharani</a> — Excel, Power BI &amp; data analytics tutorials</li>
<li><a href="https://www.youtube.com/@AlexTheAnalyst" target="_blank" rel="noopener">Alex The Analyst</a> — SQL, Power BI, data analyst career path</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — spreadsheets, PivotTables</li>
<li><a href="https://www.microsoft.com/en-us/power-platform/products/power-bi" target="_blank" rel="noopener">Power BI Desktop</a> — free dashboard/BI tool</li>
<li><a href="https://sqliteonline.com/" target="_blank" rel="noopener">SQLite Online</a> — practice SQL queries in the browser, no install</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — three analytics types, the analytics process, data cleaning basics, mean/median/std dev, chart selection.</li>
<li><strong>Practice</strong> — build a PivotTable and a few SQL queries (SELECT/WHERE/GROUP BY/JOIN) on a sample sales dataset.</li>
<li><strong>Go deeper</strong> — build a Power BI dashboard with slicers; run a simple linear regression; RFM-segment a customer list.</li>
<li><strong>Job-ready</strong> — practice presenting one dataset as a 3-slide data story: context, insight, recommended action.</li>
</ol></div>`,
    `<span class="eyebrow">BDA201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Phân tích dữ liệu kinh doanh — loại phân tích, làm sạch dữ liệu, thống kê &amp; trực quan hoá, Excel/SQL, dashboard BI, hồi quy &amp; kể chuyện dữ liệu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BDA201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.data-science-for-biz.com/" target="_blank" rel="noopener"><em>Data Science for Business</em> — Foster Provost &amp; Tom Fawcett</a></li>
<li><a href="https://www.cengage.com/c/business-analytics-4e-camm/9780357131787/" target="_blank" rel="noopener"><em>Business Analytics</em> — Camm, Cochran, Fry, Ohlmann (Cengage)</a></li>
<li><a href="https://www.wiley.com/en-us/Business+Analytics-p-9781119901673" target="_blank" rel="noopener"><em>Business Analytics</em> — James R. Evans</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://learn.microsoft.com/en-us/power-bi/" target="_blank" rel="noopener">Tài liệu chính thức Microsoft Power BI</a></li>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Hỗ trợ Microsoft Excel &amp; tra cứu hàm</a></li>
<li><a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener">W3Schools SQL Tutorial</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@LeilaGharani" target="_blank" rel="noopener">Leila Gharani</a> — hướng dẫn Excel, Power BI &amp; phân tích dữ liệu</li>
<li><a href="https://www.youtube.com/@AlexTheAnalyst" target="_blank" rel="noopener">Alex The Analyst</a> — SQL, Power BI, con đường nghề data analyst</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — bảng tính, PivotTable</li>
<li><a href="https://www.microsoft.com/en-us/power-platform/products/power-bi" target="_blank" rel="noopener">Power BI Desktop</a> — công cụ dashboard/BI miễn phí</li>
<li><a href="https://sqliteonline.com/" target="_blank" rel="noopener">SQLite Online</a> — luyện truy vấn SQL ngay trên trình duyệt, không cần cài</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — ba loại phân tích, quy trình phân tích, làm sạch dữ liệu cơ bản, mean/median/độ lệch chuẩn, chọn biểu đồ.</li>
<li><strong>Luyện tập</strong> — dựng một PivotTable và vài câu SQL (SELECT/WHERE/GROUP BY/JOIN) trên bộ dữ liệu bán hàng mẫu.</li>
<li><strong>Đào sâu thực tế</strong> — dựng dashboard Power BI có slicer; chạy hồi quy tuyến tính đơn giản; phân khúc khách hàng bằng RFM.</li>
<li><strong>Sẵn sàng đi làm</strong> — luyện trình bày một bộ dữ liệu thành câu chuyện 3-slide: bối cảnh, insight, khuyến nghị hành động.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'BDA201',
    slug: 'bda201-business-data-analytics',
    title: 'Business Data Analytics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BDA201.webp',
    shortDescription: 'Business analytics: descriptive, predictive & prescriptive — data cleaning, statistics & visualization, Excel PivotTables, SQL, Power BI/Tableau dashboards, regression, segmentation & data storytelling. Bilingual, with examples & quizzes.|||Phân tích dữ liệu kinh doanh: mô tả, dự báo & kê đơn — làm sạch dữ liệu, thống kê & trực quan hoá, PivotTable Excel, SQL, dashboard Power BI/Tableau, hồi quy, phân khúc & kể chuyện dữ liệu. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>BDA201 — Business Data Analytics</strong> (kỳ 3, khối Quản trị Kinh doanh) dạy cách biến <strong>dữ liệu kinh doanh</strong> thành <strong>quyết định</strong>. Từ <strong>ba loại phân tích</strong> (mô tả/dự báo/kê đơn) &amp; quy trình → <strong>thu thập &amp; làm sạch dữ liệu</strong> → <strong>thống kê mô tả &amp; trực quan hoá</strong> → <strong>Excel/PivotTable</strong> → <strong>SQL</strong> → <strong>dashboard BI</strong> (Power BI/Tableau) → <strong>hồi quy &amp; phân khúc khách hàng</strong> → <strong>kể chuyện bằng dữ liệu</strong> để ra quyết định. Bám giáo trình Provost &amp; Fawcett, Evans, Camm et al. (Cengage) và tài liệu Power BI chính thức; song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Ba loại phân tích & quy trình phân tích; thu thập & làm sạch dữ liệu (thiếu/trùng/ngoại lệ/định dạng); mean/median/mode, variance/độ lệch chuẩn, chọn biểu đồ; hàm Excel (VLOOKUP/XLOOKUP/SUMIFS) & PivotTable/slicer; SQL (SELECT/WHERE/GROUP BY/JOIN/aggregate); star schema & dashboard Power BI/Tableau; hồi quy tuyến tính & R²; phân khúc khách hàng RFM; data storytelling & tránh biểu đồ gây hiểu lầm.',
    requirements: 'Kiến thức tin học văn phòng cơ bản (Excel). Không cần biết lập trình trước; SQL được dạy từ đầu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Business analytics là gì, ba loại phân tích, lộ trình môn học.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan phân tích|||Chapter 1 — Analytics overview', description: 'Mô tả/dự báo/kê đơn, quy trình phân tích.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thu thập & làm sạch dữ liệu|||Chapter 2 — Data collection & cleaning', description: 'Nguồn dữ liệu, lỗi chất lượng, kỹ thuật làm sạch.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thống kê mô tả & trực quan hoá|||Chapter 3 — Descriptive stats & viz', description: 'Mean/median/mode, độ lệch chuẩn, chọn biểu đồ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Excel nâng cao & PivotTable|||Chapter 4 — Advanced Excel & PivotTables', description: 'Hàm VLOOKUP/SUMIFS, PivotTable, slicer.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Truy vấn SQL|||Chapter 5 — SQL queries', description: 'SELECT/WHERE/GROUP BY/JOIN, hàm tổng hợp.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Dashboard & BI|||Chapter 6 — Dashboards & BI', description: 'Power BI/Tableau, star schema, thiết kế dashboard.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hồi quy & phân khúc khách hàng|||Chapter 7 — Regression & segmentation', description: 'Hồi quy tuyến tính, R², RFM.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kể chuyện bằng dữ liệu|||Chapter 8 — Data storytelling', description: 'Cấu trúc câu chuyện dữ liệu, tránh biểu đồ gây hiểu lầm, trình bày quyết định.', lessons: [c8, c8q] },
  ],
};
