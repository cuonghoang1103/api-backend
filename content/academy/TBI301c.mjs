/**
 * TBI301c — Technology for Business Intelligence Analysts. Giáo trình (trích
 * dẫn, không upload PDF): Business Intelligence Guidebook (Sherman); The
 * Data Warehouse Toolkit (Kimball); tài liệu Power BI/Tableau. 8 chương: BI
 * & vai trò analyst, data warehouse & star schema, ETL, SQL, trực quan hoá &
 * dashboard, DAX & mô hình hoá, OLAP/KPI/self-service, BI hiện đại. Song ngữ
 * + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb. KHÔNG backtick/${ lồng.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('tbi301c-0-0-tai-lieu', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách BI Guidebook (Sherman), Data Warehouse Toolkit (Kimball), tài liệu Power BI/Tableau, khoá học miễn phí, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">TBI301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn business intelligence for the BI analyst role — data warehousing, dimensional modeling, ETL, SQL, dashboards and modern BI — in one place. The full official slides live on <strong>FLM</strong>; below are widely used reference books and free resources.</p>
<h3>Reference books</h3>
<ul>
<li><a href="https://www.amazon.com/dp/0128047366" target="_blank" rel="noopener"><em>Business Intelligence Guidebook: From Data Integration to Analytics</em> — Rick Sherman</a> — end-to-end view of the BI lifecycle and the BI analyst role.</li>
<li><a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/" target="_blank" rel="noopener"><em>The Data Warehouse Toolkit</em> — Ralph Kimball, Margy Ross</a> — the standard reference on dimensional modeling and star schemas.</li>
</ul>
<h3>Official / free documentation</h3>
<ul>
<li><a href="https://learn.microsoft.com/power-bi/" target="_blank" rel="noopener">Microsoft Learn — Power BI documentation</a> — reports, DAX, data modeling.</li>
<li><a href="https://help.tableau.com/current/pro/desktop/en-us/default.htm" target="_blank" rel="noopener">Tableau Desktop &amp; Web Authoring Help</a> — worksheets, dashboards, stories.</li>
<li><a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/" target="_blank" rel="noopener">Kimball Group — free articles &amp; design tips</a></li>
</ul>
<h3>Free courses</h3>
<ul>
<li><a href="https://learn.microsoft.com/training/powerplatform/power-bi" target="_blank" rel="noopener">Microsoft Learn — Power BI learning paths</a></li>
<li><a href="https://www.tableau.com/learn/training" target="_blank" rel="noopener">Tableau — free training videos</a></li>
</ul>
<h3>Tools</h3>
<ul>
<li><a href="https://powerbi.microsoft.com/desktop/" target="_blank" rel="noopener">Power BI Desktop</a> — free, for building reports and data models.</li>
<li><a href="https://www.tableau.com/products/public" target="_blank" rel="noopener">Tableau Public</a> — free dashboard publishing.</li>
<li><a href="https://sqlbolt.com/" target="_blank" rel="noopener">SQLBolt</a> — interactive SQL practice.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the BI lifecycle, star schema modeling, core SQL (joins, aggregates).</li>
<li><strong>Practice</strong> — build a small star schema and query it end to end.</li>
<li><strong>Go deeper</strong> — ETL patterns, DAX, dashboard design in Power BI or Tableau.</li>
<li><strong>Job-ready</strong> — OLAP concepts, KPI design, and modern cloud/AI-augmented BI.</li>
</ol></div>`,
    `<span class="eyebrow">TBI301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học BI cho vai trò chuyên viên phân tích BI — kho dữ liệu, mô hình hoá đa chiều, ETL, SQL và dashboard hiện đại — gom về một chỗ. Slide chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo phổ biến và nguồn miễn phí.</p>
<h3>Sách tham khảo</h3>
<ul>
<li><a href="https://www.amazon.com/dp/0128047366" target="_blank" rel="noopener"><em>Business Intelligence Guidebook: From Data Integration to Analytics</em> — Rick Sherman</a> — góc nhìn toàn trình về vòng đời BI và vai trò BI analyst.</li>
<li><a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/" target="_blank" rel="noopener"><em>The Data Warehouse Toolkit</em> — Ralph Kimball, Margy Ross</a> — tài liệu chuẩn về mô hình hoá đa chiều và star schema.</li>
</ul>
<h3>Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://learn.microsoft.com/power-bi/" target="_blank" rel="noopener">Microsoft Learn — tài liệu Power BI</a> — báo cáo, DAX, mô hình dữ liệu.</li>
<li><a href="https://help.tableau.com/current/pro/desktop/en-us/default.htm" target="_blank" rel="noopener">Tableau Desktop &amp; Web Authoring Help</a> — worksheet, dashboard, story.</li>
<li><a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/" target="_blank" rel="noopener">Kimball Group — bài viết &amp; mẹo thiết kế miễn phí</a></li>
</ul>
<h3>Khoá học miễn phí</h3>
<ul>
<li><a href="https://learn.microsoft.com/training/powerplatform/power-bi" target="_blank" rel="noopener">Microsoft Learn — lộ trình học Power BI</a></li>
<li><a href="https://www.tableau.com/learn/training" target="_blank" rel="noopener">Tableau — video đào tạo miễn phí</a></li>
</ul>
<h3>Công cụ</h3>
<ul>
<li><a href="https://powerbi.microsoft.com/desktop/" target="_blank" rel="noopener">Power BI Desktop</a> — miễn phí, dựng báo cáo và mô hình dữ liệu.</li>
<li><a href="https://www.tableau.com/products/public" target="_blank" rel="noopener">Tableau Public</a> — xuất bản dashboard miễn phí.</li>
<li><a href="https://sqlbolt.com/" target="_blank" rel="noopener">SQLBolt</a> — luyện SQL tương tác.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vòng đời BI, mô hình hoá star schema, SQL lõi (join, hàm tổng hợp).</li>
<li><strong>Luyện tập</strong> — dựng một star schema nhỏ và truy vấn xuyên suốt.</li>
<li><strong>Đào sâu</strong> — mô hình ETL, DAX, thiết kế dashboard trong Power BI hoặc Tableau.</li>
<li><strong>Sẵn sàng đi làm</strong> — khái niệm OLAP, thiết kế KPI, và BI hiện đại trên cloud/AI.</li>
</ol></div>`,
  ]]);

const intro = doc('tbi301c-0-1-overview', 'Course overview: Technology for Business Intelligence Analysts|||Tổng quan: Công nghệ cho chuyên viên phân tích BI',
  'BI là gì, vòng đời BI (nguồn → ETL → data warehouse → công cụ BI → quyết định), lộ trình 8 chương của môn.',
  [[
    `<span class="eyebrow">TBI301c · Lesson 0.1 · Overview</span>
<h2>Technology for Business Intelligence Analysts</h2>
<p class="lead">This course builds the technical toolkit of a <strong>business intelligence (BI) analyst</strong>: turning raw operational data into information that helps an organization decide. You will move through the full BI lifecycle — from source systems to a delivered dashboard.</p>
<h3>The BI lifecycle</h3>
<pre><code>Source systems (ERP, CRM, apps)
   -> ETL / data integration
   -> Data warehouse (star schema)
   -> BI tool (Power BI / Tableau)
   -> Dashboards, KPIs, self-service reports
   -> Business decisions
</code></pre>
<h3>Roadmap</h3>
<p>BI fundamentals &amp; analyst role → data warehousing &amp; star schema modeling → ETL &amp; data integration → SQL for analysis → visualization &amp; dashboards → DAX formulas &amp; data modeling → OLAP, KPIs &amp; self-service BI → modern BI (cloud, big data, AI-augmented analytics, data governance). Grounded in <em>Business Intelligence Guidebook</em> (Sherman) and <em>The Data Warehouse Toolkit</em> (Kimball), bilingual, with worked examples and quizzes each chapter.</p>`,
    `<span class="eyebrow">TBI301c · Bài 0.1 · Tổng quan</span>
<h2>Công nghệ cho chuyên viên phân tích BI</h2>
<p class="lead">Môn này xây bộ công cụ kỹ thuật của một <strong>chuyên viên phân tích BI (BI analyst)</strong>: biến dữ liệu vận hành thô thành thông tin giúp tổ chức ra quyết định. Bạn đi qua toàn bộ vòng đời BI — từ hệ thống nguồn đến một dashboard được giao thành phẩm.</p>
<h3>Vòng đời BI</h3>
<pre><code>Hệ thống nguồn (ERP, CRM, ứng dụng)
   -> ETL / tích hợp dữ liệu
   -> Kho dữ liệu (star schema)
   -> Công cụ BI (Power BI / Tableau)
   -> Dashboard, KPI, báo cáo tự phục vụ
   -> Quyết định kinh doanh
</code></pre>
<h3>Lộ trình</h3>
<p>Tổng quan BI &amp; vai trò analyst → kho dữ liệu &amp; mô hình star schema → ETL &amp; tích hợp dữ liệu → SQL cho phân tích → trực quan hoá &amp; dashboard → công thức DAX &amp; mô hình hoá dữ liệu → OLAP, KPI &amp; self-service BI → BI hiện đại (cloud, big data, AI/augmented analytics, quản trị dữ liệu). Bám theo <em>Business Intelligence Guidebook</em> (Sherman) và <em>The Data Warehouse Toolkit</em> (Kimball), song ngữ, có ví dụ và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('tbi301c-1-1-bi-overview', '1.1 — What is BI, and what does a BI analyst do?|||1.1 — BI là gì, BI analyst làm gì?',
  'Định nghĩa BI (Sherman); dữ liệu → thông tin → quyết định; các nhiệm vụ chính của BI analyst; Kimball vs Inmon (giới thiệu ngắn).',
  [[
    `<span class="eyebrow">TBI301c · Chapter 1 · Lesson 1.1</span>
<h2>What is BI, and what does a BI analyst do?</h2>
<h3>Business intelligence, defined</h3>
<p><strong>Business intelligence (BI)</strong> is the set of processes, technologies and tools that turn raw operational data into information business people can use to make decisions — collecting data from source systems, integrating and storing it, then analyzing and presenting it (Sherman, <em>BI Guidebook</em>).</p>
<h3>The BI analyst role</h3>
<ul>
<li><strong>Gather requirements</strong> — talk to business users, translate "we need to know X" into data questions.</li>
<li><strong>Model data</strong> — design or extend a star schema that answers those questions efficiently.</li>
<li><strong>Write SQL</strong> — query and validate data across source systems and the warehouse.</li>
<li><strong>Build reports/dashboards</strong> — in Power BI, Tableau, or similar tools.</li>
<li><strong>Define KPIs</strong> and check data quality before numbers reach a decision-maker.</li>
</ul>
<h3>Two schools of data warehousing</h3>
<p><strong>Kimball</strong> builds bottom-up, business-process by business-process, with star schemas users can query directly. <strong>Inmon</strong> builds a top-down, normalized enterprise warehouse first, then derives departmental marts. This course follows the Kimball approach — it is the one most BI tooling (Power BI, Tableau) is optimized for.</p>
<div class="callout"><span class="badge">Data vs information</span> Data is raw and structural; information is data that has been organized and put in context so a person can act on it. A BI analyst's job is closing that gap.</div>`,
    `<span class="eyebrow">TBI301c · Chương 1 · Bài 1.1</span>
<h2>BI là gì, BI analyst làm gì?</h2>
<h3>Business intelligence là gì</h3>
<p><strong>Business intelligence (BI)</strong> là tập hợp các quy trình, công nghệ và công cụ biến dữ liệu vận hành thô thành thông tin mà người làm kinh doanh dùng để ra quyết định — thu thập dữ liệu từ hệ thống nguồn, tích hợp và lưu trữ, rồi phân tích và trình bày (Sherman, <em>BI Guidebook</em>).</p>
<h3>Vai trò BI analyst</h3>
<ul>
<li><strong>Thu thập yêu cầu</strong> — nói chuyện với người dùng kinh doanh, chuyển "chúng tôi cần biết X" thành câu hỏi dữ liệu.</li>
<li><strong>Mô hình hoá dữ liệu</strong> — thiết kế hoặc mở rộng star schema trả lời các câu hỏi đó hiệu quả.</li>
<li><strong>Viết SQL</strong> — truy vấn và kiểm tra dữ liệu qua hệ thống nguồn và kho dữ liệu.</li>
<li><strong>Dựng báo cáo/dashboard</strong> — trong Power BI, Tableau, hoặc công cụ tương tự.</li>
<li><strong>Định nghĩa KPI</strong> và kiểm tra chất lượng dữ liệu trước khi số liệu đến tay người ra quyết định.</li>
</ul>
<h3>Hai trường phái kho dữ liệu</h3>
<p><strong>Kimball</strong> dựng từ dưới lên, theo từng quy trình kinh doanh, với star schema mà người dùng truy vấn trực tiếp được. <strong>Inmon</strong> dựng từ trên xuống, một kho doanh nghiệp chuẩn hoá trước, rồi mới suy ra các mart theo phòng ban. Môn này theo hướng Kimball — hướng mà hầu hết công cụ BI (Power BI, Tableau) được tối ưu cho.</p>
<div class="callout"><span class="badge">Dữ liệu và thông tin</span> Dữ liệu là thô và có cấu trúc; thông tin là dữ liệu đã được tổ chức và đặt trong ngữ cảnh để con người hành động. Việc của BI analyst là lấp khoảng cách đó.</div>`,
  ]]);

const c1q = quiz('tbi301c-quiz-1', 'Quiz 1 — BI & analyst role|||Quiz 1 — BI & vai trò analyst', [
  { id: 'q1', question: 'Theo Sherman, business intelligence là gì?', options: ['Chỉ là phần mềm vẽ biểu đồ', 'Tập quy trình/công nghệ biến dữ liệu thô thành thông tin hỗ trợ quyết định', 'Một loại cơ sở dữ liệu', 'Một ngôn ngữ lập trình'], correctIndex: 1, explanation: 'BI Guidebook định nghĩa BI là quy trình + công nghệ + công cụ chuyển dữ liệu thành thông tin dùng được.' },
  { id: 'q2', question: 'Nhiệm vụ nào KHÔNG thuộc vai trò BI analyst?', options: ['Thu thập yêu cầu từ người dùng kinh doanh', 'Viết SQL truy vấn dữ liệu', 'Thiết kế vi mạch xử lý', 'Dựng dashboard và định nghĩa KPI'], correctIndex: 2, explanation: 'Thiết kế vi mạch thuộc kỹ thuật điện tử, không phải công việc của BI analyst.' },
  { id: 'q3', question: 'Cách tiếp cận Kimball khác Inmon ở điểm nào?', options: ['Kimball dựng từ dưới lên theo star schema từng quy trình; Inmon dựng kho chuẩn hoá từ trên xuống trước', 'Kimball không dùng SQL', 'Inmon không có kho dữ liệu', 'Hai cách tiếp cận giống nhau hoàn toàn'], correctIndex: 0, explanation: 'Kimball: bottom-up, star schema theo business process. Inmon: top-down, enterprise warehouse chuẩn hoá trước.' },
]);

const c2 = doc('tbi301c-2-1-warehouse-star-schema', '2.1 — Data warehouse & star schema modeling|||2.1 — Kho dữ liệu & mô hình star schema',
  'OLTP vs OLAP; kho dữ liệu, staging area; star schema (fact & dimension), ví dụ FactSales; snowflake schema; conformed dimensions (Kimball).',
  [[
    `<span class="eyebrow">TBI301c · Chapter 2 · Lesson 2.1</span>
<h2>Data warehouse &amp; star schema modeling</h2>
<h3>OLTP vs OLAP</h3>
<p>Source systems are <strong>OLTP</strong> (Online Transaction Processing) — optimized for fast, single-row inserts/updates (an order form, a payment). A <strong>data warehouse</strong> is <strong>OLAP</strong> (Online Analytical Processing) — optimized for scanning millions of rows and aggregating (total sales by region by month). Mixing the two on one system slows both down; that is why the warehouse is a separate, dedicated store, loaded through a <strong>staging area</strong>.</p>
<h3>Star schema</h3>
<p>A <strong>fact table</strong> holds the numeric measurements of a business process (e.g. sale amount, quantity), one row per event, with foreign keys to <strong>dimension tables</strong> that describe the who/what/when/where (customer, product, date, store).</p>
<pre><code>DimDate      DimProduct      DimCustomer
    \\            |              /
     \\           |             /
        FactSales (date_key, product_key, customer_key,
                    quantity, amount)
</code></pre>
<p>Dimensions are wide and denormalized (a single <code>DimProduct</code> row carries product name, category, brand together) — this is what makes a star schema fast and easy for a BI tool to query and slice.</p>
<h3>Snowflake schema &amp; conformed dimensions</h3>
<p>A <strong>snowflake schema</strong> normalizes dimensions further (e.g. splitting category out of <code>DimProduct</code> into its own table) — it saves storage but adds joins, so Kimball generally favors the flatter star. A <strong>conformed dimension</strong> (e.g. one shared <code>DimDate</code>) is reused across multiple fact tables so metrics from different business processes stay comparable.</p>
<div class="callout"><span class="badge">Grain</span> Every fact table needs a clearly stated <strong>grain</strong> — the exact meaning of one row (e.g. "one row per line item per order"). Get the grain wrong and every downstream number is wrong.</div>`,
    `<span class="eyebrow">TBI301c · Chương 2 · Bài 2.1</span>
<h2>Kho dữ liệu &amp; mô hình star schema</h2>
<h3>OLTP và OLAP</h3>
<p>Hệ thống nguồn là <strong>OLTP</strong> (Online Transaction Processing) — tối ưu cho ghi/sửa nhanh từng dòng (một đơn hàng, một khoản thanh toán). <strong>Kho dữ liệu</strong> là <strong>OLAP</strong> (Online Analytical Processing) — tối ưu cho việc quét hàng triệu dòng và tổng hợp (tổng doanh số theo vùng theo tháng). Trộn hai việc trên một hệ thống làm chậm cả hai; vì vậy kho dữ liệu là một hệ lưu trữ riêng, được nạp qua một <strong>vùng dàn (staging area)</strong>.</p>
<h3>Star schema</h3>
<p>Một <strong>bảng fact</strong> chứa các số đo của một quy trình kinh doanh (vd số tiền, số lượng), mỗi dòng là một sự kiện, với khoá ngoại tới các <strong>bảng dimension</strong> mô tả ai/cái gì/khi nào/ở đâu (khách hàng, sản phẩm, ngày, cửa hàng).</p>
<pre><code>DimDate      DimProduct      DimCustomer
    \\            |              /
     \\           |             /
        FactSales (date_key, product_key, customer_key,
                    quantity, amount)
</code></pre>
<p>Dimension thường rộng và không chuẩn hoá (một dòng <code>DimProduct</code> mang tên sản phẩm, ngành hàng, thương hiệu cùng nhau) — chính điều này giúp star schema truy vấn nhanh và dễ cắt lát cho công cụ BI.</p>
<h3>Snowflake schema và conformed dimension</h3>
<p>Một <strong>snowflake schema</strong> chuẩn hoá dimension sâu hơn (vd tách ngành hàng ra khỏi <code>DimProduct</code> thành bảng riêng) — tiết kiệm chỗ lưu nhưng thêm join, nên Kimball thường ưu tiên star bằng phẳng hơn. Một <strong>conformed dimension</strong> (vd một <code>DimDate</code> dùng chung) được tái sử dụng cho nhiều bảng fact để chỉ số từ các quy trình kinh doanh khác nhau vẫn so sánh được.</p>
<div class="callout"><span class="badge">Grain</span> Mọi bảng fact cần một <strong>grain</strong> được nêu rõ — ý nghĩa chính xác của một dòng (vd "một dòng cho mỗi dòng sản phẩm trong mỗi đơn hàng"). Xác định sai grain thì mọi số liệu về sau đều sai.</div>`,
  ]]);

const c2q = quiz('tbi301c-quiz-2', 'Quiz 2 — Data warehouse & star schema|||Quiz 2 — Kho dữ liệu & star schema', [
  { id: 'q1', question: 'Kho dữ liệu (data warehouse) được tối ưu cho việc gì?', options: ['Ghi từng giao dịch nhỏ, nhanh', 'Quét lượng lớn dữ liệu và tổng hợp phân tích (OLAP)', 'Chỉ lưu ảnh và video', 'Thay thế hoàn toàn hệ thống ERP'], correctIndex: 1, explanation: 'Kho dữ liệu là OLAP: tối ưu cho quét/tổng hợp, khác với OLTP tối ưu ghi giao dịch.' },
  { id: 'q2', question: 'Trong star schema, bảng chứa các số đo (vd số tiền bán) của một quy trình kinh doanh gọi là?', options: ['Bảng dimension', 'Bảng fact', 'Bảng staging', 'Bảng conformed'], correctIndex: 1, explanation: 'Bảng fact chứa số đo, mỗi dòng là một sự kiện, liên kết tới các dimension.' },
  { id: 'q3', question: '"Grain" của một bảng fact nghĩa là gì?', options: ['Tốc độ truy vấn của bảng', 'Ý nghĩa chính xác của một dòng dữ liệu trong bảng', 'Số lượng cột của bảng', 'Loại chỉ mục được dùng'], correctIndex: 1, explanation: 'Grain xác định rõ một dòng đại diện cho điều gì; xác định sai làm sai mọi số liệu tổng hợp sau đó.' },
]);

const c3 = doc('tbi301c-3-1-etl', '3.1 — ETL & data integration|||3.1 — ETL & tích hợp dữ liệu',
  'Extract-Transform-Load; chất lượng dữ liệu, làm sạch, khử trùng lặp; Slowly Changing Dimension (SCD) Type 1/2; batch vs CDC gần thời gian thực.',
  [[
    `<span class="eyebrow">TBI301c · Chapter 3 · Lesson 3.1</span>
<h2>ETL &amp; data integration</h2>
<h3>Extract, Transform, Load</h3>
<ul>
<li><strong>Extract</strong> — pull data out of source systems (databases, APIs, files) without disturbing them.</li>
<li><strong>Transform</strong> — clean, standardize, deduplicate, apply business rules, and reshape into the warehouse's dimensional model.</li>
<li><strong>Load</strong> — write the transformed data into fact and dimension tables, typically in a staging area first, then the warehouse.</li>
</ul>
<h3>Data quality</h3>
<p>Common transform steps: trimming whitespace, standardizing formats (dates, phone numbers), resolving duplicate customer records, and handling missing values. Bad data quietly poisons every dashboard built on top of it — validation belongs in the ETL layer, not discovered later by a confused business user.</p>
<h3>Slowly Changing Dimensions (SCD)</h3>
<p>Dimension attributes change over time (a customer moves city). Kimball defines patterns to handle this:</p>
<ul>
<li><strong>SCD Type 1</strong> — overwrite the old value; no history kept.</li>
<li><strong>SCD Type 2</strong> — insert a new row with a new surrogate key and effective dates, keeping full history (which city the customer was in when each past sale happened).</li>
</ul>
<h3>Batch vs near-real-time</h3>
<p>Most ETL runs in scheduled <strong>batches</strong> (nightly). <strong>Change Data Capture (CDC)</strong> streams changes as they happen for fresher data, at higher engineering cost. Common tools: SSIS, Azure Data Factory, Talend, or Power Query for lightweight cases.</p>
<div class="callout"><span class="badge">ELT variant</span> Modern cloud warehouses often flip the order to <strong>ELT</strong> — load raw data first, then transform inside the warehouse using its own compute (e.g. with SQL or dbt).</div>`,
    `<span class="eyebrow">TBI301c · Chương 3 · Bài 3.1</span>
<h2>ETL &amp; tích hợp dữ liệu</h2>
<h3>Extract, Transform, Load</h3>
<ul>
<li><strong>Extract (rút trích)</strong> — lấy dữ liệu ra khỏi hệ thống nguồn (cơ sở dữ liệu, API, file) mà không làm gián đoạn hệ thống đó.</li>
<li><strong>Transform (biến đổi)</strong> — làm sạch, chuẩn hoá, khử trùng lặp, áp quy tắc kinh doanh, và định hình lại theo mô hình đa chiều của kho dữ liệu.</li>
<li><strong>Load (nạp)</strong> — ghi dữ liệu đã biến đổi vào bảng fact và dimension, thường qua vùng dàn trước, rồi mới vào kho dữ liệu.</li>
</ul>
<h3>Chất lượng dữ liệu</h3>
<p>Các bước biến đổi thường gặp: cắt khoảng trắng thừa, chuẩn hoá định dạng (ngày, số điện thoại), gộp bản ghi khách hàng trùng lặp, và xử lý giá trị thiếu. Dữ liệu xấu âm thầm làm hỏng mọi dashboard dựng trên nó — kiểm tra chất lượng thuộc về tầng ETL, không phải để người dùng kinh doanh phát hiện sau khi đã bối rối.</p>
<h3>Slowly Changing Dimension (SCD)</h3>
<p>Thuộc tính dimension thay đổi theo thời gian (khách hàng chuyển thành phố). Kimball định nghĩa các mẫu để xử lý:</p>
<ul>
<li><strong>SCD Type 1</strong> — ghi đè giá trị cũ; không giữ lịch sử.</li>
<li><strong>SCD Type 2</strong> — thêm dòng mới với khoá thay thế mới và ngày hiệu lực, giữ đầy đủ lịch sử (khách hàng ở thành phố nào vào lúc mỗi lần bán hàng trong quá khứ diễn ra).</li>
</ul>
<h3>Batch và gần thời gian thực</h3>
<p>Hầu hết ETL chạy theo <strong>batch</strong> có lịch (mỗi đêm). <strong>Change Data Capture (CDC)</strong> truyền các thay đổi ngay khi xảy ra để dữ liệu tươi hơn, đổi lại chi phí kỹ thuật cao hơn. Công cụ phổ biến: SSIS, Azure Data Factory, Talend, hoặc Power Query cho trường hợp nhẹ.</p>
<div class="callout"><span class="badge">Biến thể ELT</span> Kho dữ liệu cloud hiện đại thường đổi thứ tự thành <strong>ELT</strong> — nạp dữ liệu thô trước, rồi biến đổi ngay trong kho bằng năng lực tính toán của chính nó (vd bằng SQL hoặc dbt).</div>`,
  ]]);

const c3q = quiz('tbi301c-quiz-3', 'Quiz 3 — ETL & data integration|||Quiz 3 — ETL & tích hợp dữ liệu', [
  { id: 'q1', question: 'Bước "Transform" trong ETL làm gì?', options: ['Chỉ lấy dữ liệu ra khỏi hệ thống nguồn', 'Làm sạch, chuẩn hoá và định hình lại dữ liệu theo mô hình kho', 'Chỉ ghi dữ liệu vào kho', 'Xoá toàn bộ dữ liệu cũ'], correctIndex: 1, explanation: 'Transform xử lý chất lượng và định dạng dữ liệu trước khi nạp vào kho.' },
  { id: 'q2', question: 'SCD Type 2 khác Type 1 ở điểm nào?', options: ['Type 2 ghi đè, Type 1 giữ lịch sử', 'Type 2 giữ lịch sử bằng dòng mới + ngày hiệu lực, Type 1 ghi đè không giữ lịch sử', 'Hai loại giống nhau', 'Type 2 chỉ dùng cho bảng fact'], correctIndex: 1, explanation: 'SCD Type 2 thêm dòng mới để giữ lịch sử thay đổi; Type 1 ghi đè và mất lịch sử.' },
  { id: 'q3', question: 'ELT khác ETL truyền thống ở điểm nào?', options: ['ELT không cần dữ liệu nguồn', 'ELT nạp dữ liệu thô trước rồi biến đổi trong kho, thay vì biến đổi trước khi nạp', 'ELT chỉ dùng cho video', 'Không có khác biệt'], correctIndex: 1, explanation: 'ELT tận dụng năng lực tính toán của kho dữ liệu cloud để biến đổi sau khi đã nạp thô.' },
]);

const c4 = doc('tbi301c-4-1-sql-for-bi', '4.1 — SQL for BI analysis|||4.1 — SQL cho phân tích BI',
  'JOIN fact-dimension, GROUP BY & hàm tổng hợp, window function (RANK, running total), CTE (WITH); ví dụ truy vấn doanh số theo tháng.',
  [[
    `<span class="eyebrow">TBI301c · Chapter 4 · Lesson 4.1</span>
<h2>SQL for BI analysis</h2>
<h3>Joining fact to dimensions</h3>
<p>A typical BI query joins a fact table to one or more dimensions to add readable context (a product name instead of a bare key), then aggregates.</p>
<pre><code>SELECT d.year, d.month, p.category, SUM(f.amount) AS total_sales
FROM FactSales f
JOIN DimDate d ON f.date_key = d.date_key
JOIN DimProduct p ON f.product_key = p.product_key
GROUP BY d.year, d.month, p.category
ORDER BY d.year, d.month;
</code></pre>
<h3>Window functions</h3>
<p>Window functions compute across a set of rows without collapsing them into one — essential for rankings and running totals.</p>
<pre><code>SELECT month, total_sales,
       RANK() OVER (ORDER BY total_sales DESC) AS sales_rank,
       SUM(total_sales) OVER (ORDER BY month) AS running_total
FROM monthly_sales;
</code></pre>
<h3>CTEs for readability</h3>
<p>A <strong>CTE (Common Table Expression)</strong>, written with <code>WITH</code>, breaks a complex query into named, readable steps — common in BI queries that first aggregate, then rank or compare periods.</p>
<pre><code>WITH monthly AS (
  SELECT d.month, SUM(f.amount) AS total_sales
  FROM FactSales f JOIN DimDate d ON f.date_key = d.date_key
  GROUP BY d.month
)
SELECT month, total_sales,
       total_sales - LAG(total_sales) OVER (ORDER BY month) AS mom_change
FROM monthly;
</code></pre>
<div class="callout"><span class="badge">Sanity-check every number</span> Before a query result goes into a dashboard, spot-check its total against a known source. A join that silently duplicates rows (fan-out) is the single most common cause of an inflated metric.</div>`,
    `<span class="eyebrow">TBI301c · Chương 4 · Bài 4.1</span>
<h2>SQL cho phân tích BI</h2>
<h3>Join fact với dimension</h3>
<p>Một truy vấn BI điển hình join bảng fact với một hoặc nhiều dimension để thêm ngữ cảnh dễ đọc (tên sản phẩm thay vì chỉ khoá trơ), rồi tổng hợp.</p>
<pre><code>SELECT d.year, d.month, p.category, SUM(f.amount) AS total_sales
FROM FactSales f
JOIN DimDate d ON f.date_key = d.date_key
JOIN DimProduct p ON f.product_key = p.product_key
GROUP BY d.year, d.month, p.category
ORDER BY d.year, d.month;
</code></pre>
<h3>Window function</h3>
<p>Window function tính toán trên một tập dòng mà không thu gọn chúng thành một dòng — thiết yếu cho xếp hạng và tổng luỹ tiến.</p>
<pre><code>SELECT month, total_sales,
       RANK() OVER (ORDER BY total_sales DESC) AS sales_rank,
       SUM(total_sales) OVER (ORDER BY month) AS running_total
FROM monthly_sales;
</code></pre>
<h3>CTE để dễ đọc</h3>
<p>Một <strong>CTE (Common Table Expression)</strong>, viết bằng <code>WITH</code>, chia một truy vấn phức tạp thành các bước có tên, dễ đọc — phổ biến trong truy vấn BI khi cần tổng hợp trước, rồi xếp hạng hoặc so sánh giữa các kỳ.</p>
<pre><code>WITH monthly AS (
  SELECT d.month, SUM(f.amount) AS total_sales
  FROM FactSales f JOIN DimDate d ON f.date_key = d.date_key
  GROUP BY d.month
)
SELECT month, total_sales,
       total_sales - LAG(total_sales) OVER (ORDER BY month) AS mom_change
FROM monthly;
</code></pre>
<div class="callout"><span class="badge">Luôn kiểm tra lại số liệu</span> Trước khi kết quả truy vấn lên dashboard, đối chiếu tổng với một nguồn đã biết. Một join âm thầm nhân đôi dòng (fan-out) là nguyên nhân phổ biến nhất khiến một chỉ số bị thổi phồng.</div>`,
  ]]);

const c4q = quiz('tbi301c-quiz-4', 'Quiz 4 — SQL for BI|||Quiz 4 — SQL cho BI', [
  { id: 'q1', question: 'Trong truy vấn BI, việc join bảng fact với bảng dimension dùng để làm gì?', options: ['Xoá dữ liệu trùng', 'Thêm ngữ cảnh dễ đọc (vd tên sản phẩm) cho các số đo trong fact', 'Tăng tốc độ ghi dữ liệu', 'Thay thế bảng fact'], correctIndex: 1, explanation: 'Dimension mang thông tin mô tả; join vào fact giúp số đo có ngữ cảnh dễ hiểu.' },
  { id: 'q2', question: 'Window function khác GROUP BY thông thường ở điểm nào?', options: ['Window function luôn xoá dữ liệu trùng', 'Window function tính trên một tập dòng nhưng không thu gọn các dòng đó thành một dòng', 'Window function không dùng được với ORDER BY', 'Không có khác biệt'], correctIndex: 1, explanation: 'GROUP BY thu gọn dòng theo nhóm; window function (OVER) giữ nguyên số dòng và tính toán theo cửa sổ.' },
  { id: 'q3', question: 'Nguyên nhân phổ biến khiến một chỉ số trên dashboard bị thổi phồng sai là gì?', options: ['Dùng CTE', 'Một join làm nhân đôi dòng (fan-out) mà không được kiểm tra', 'Dùng RANK()', 'Sắp xếp bằng ORDER BY'], correctIndex: 1, explanation: 'Join sai quan hệ (1-nhiều không lường trước) làm nhân bản dòng, khiến SUM bị thổi phồng.' },
]);

const c5 = doc('tbi301c-5-1-visualization-dashboard', '5.1 — Visualization & dashboard design (Power BI/Tableau)|||5.1 — Trực quan hoá & thiết kế dashboard (Power BI/Tableau)',
  'Nguyên tắc chọn biểu đồ, giảm nhiễu thị giác (data-ink); Power BI: report/dataset/relationship/slicer; Tableau: worksheet/dashboard/story; thiết kế KPI card, drill-down.',
  [[
    `<span class="eyebrow">TBI301c · Chapter 5 · Lesson 5.1</span>
<h2>Visualization &amp; dashboard design</h2>
<h3>Choosing the right chart</h3>
<p>Match the chart to the question: <strong>trend over time</strong> → line chart; <strong>comparison across categories</strong> → bar chart; <strong>part-of-whole</strong> → stacked bar or (sparingly) a pie chart; <strong>correlation</strong> → scatter plot. Reduce chart clutter — every gridline, border and 3D effect that does not carry information is noise competing with the data (the data-ink ratio principle: maximize ink that shows data, minimize ink that does not).</p>
<h3>Power BI building blocks</h3>
<ul>
<li><strong>Dataset / semantic model</strong> — the tables and relationships loaded into the report.</li>
<li><strong>Relationships</strong> — the links between fact and dimension tables, mirroring the star schema.</li>
<li><strong>Report / visuals</strong> — charts and tables placed on a canvas.</li>
<li><strong>Slicers &amp; filters</strong> — let a viewer narrow the view (by date range, region) without editing the report.</li>
</ul>
<h3>Tableau building blocks</h3>
<ul>
<li><strong>Worksheet</strong> — a single chart built by dragging fields onto shelves (Rows, Columns, Color, Size).</li>
<li><strong>Dashboard</strong> — several worksheets combined, with filter actions linking them.</li>
<li><strong>Story</strong> — a sequence of dashboard states that walks a viewer through a narrative.</li>
</ul>
<h3>Dashboard design</h3>
<p>Put the most important number (a KPI card) top-left, where the eye lands first. Support it with a trend line for context and a filter/drill-down path for a viewer who wants detail. Keep one dashboard focused on one decision, not everything at once.</p>
<div class="callout"><span class="badge">5-second test</span> A good BI dashboard should let a first-time viewer answer "so what should I do?" within about five seconds of looking at it.</div>`,
    `<span class="eyebrow">TBI301c · Chương 5 · Bài 5.1</span>
<h2>Trực quan hoá &amp; thiết kế dashboard</h2>
<h3>Chọn đúng loại biểu đồ</h3>
<p>Khớp biểu đồ với câu hỏi: <strong>xu hướng theo thời gian</strong> → biểu đồ đường; <strong>so sánh giữa các hạng mục</strong> → biểu đồ cột; <strong>tỉ trọng trong tổng</strong> → cột chồng hoặc (dùng vừa phải) biểu đồ tròn; <strong>tương quan</strong> → biểu đồ phân tán. Giảm nhiễu thị giác — mỗi lưới, viền, hiệu ứng 3D không mang thông tin là nhiễu cạnh tranh với dữ liệu (nguyên tắc data-ink: tối đa mực thể hiện dữ liệu, tối thiểu mực không mang thông tin).</p>
<h3>Khối dựng của Power BI</h3>
<ul>
<li><strong>Dataset / semantic model</strong> — các bảng và quan hệ được nạp vào report.</li>
<li><strong>Relationship</strong> — liên kết giữa bảng fact và dimension, phản chiếu star schema.</li>
<li><strong>Report / visual</strong> — biểu đồ và bảng đặt trên canvas.</li>
<li><strong>Slicer &amp; filter</strong> — cho người xem hẹp phạm vi nhìn (theo khoảng ngày, vùng) mà không sửa report.</li>
</ul>
<h3>Khối dựng của Tableau</h3>
<ul>
<li><strong>Worksheet</strong> — một biểu đồ dựng bằng cách kéo trường vào các shelf (Rows, Columns, Color, Size).</li>
<li><strong>Dashboard</strong> — nhiều worksheet gộp lại, có filter action liên kết chúng.</li>
<li><strong>Story</strong> — một chuỗi trạng thái dashboard dẫn người xem theo một mạch tường thuật.</li>
</ul>
<h3>Thiết kế dashboard</h3>
<p>Đặt số quan trọng nhất (KPI card) ở góc trên trái, nơi mắt nhìn tới đầu tiên. Hỗ trợ bằng một đường xu hướng để có ngữ cảnh và một đường filter/drill-down cho người xem muốn xem chi tiết. Giữ một dashboard tập trung vào một quyết định, không phải mọi thứ cùng lúc.</p>
<div class="callout"><span class="badge">Phép thử 5 giây</span> Một dashboard BI tốt nên giúp người xem lần đầu trả lời được "vậy tôi nên làm gì" trong khoảng 5 giây nhìn vào nó.</div>`,
  ]]);

const c5q = quiz('tbi301c-quiz-5', 'Quiz 5 — Visualization & dashboard|||Quiz 5 — Trực quan hoá & dashboard', [
  { id: 'q1', question: 'Để thể hiện xu hướng của một chỉ số theo thời gian, nên chọn loại biểu đồ nào?', options: ['Biểu đồ tròn', 'Biểu đồ đường (line chart)', 'Biểu đồ phân tán', 'Bảng số liệu thô'], correctIndex: 1, explanation: 'Line chart phù hợp nhất để thể hiện xu hướng theo thời gian.' },
  { id: 'q2', question: 'Trong Power BI, thành phần nào phản chiếu quan hệ fact-dimension của star schema?', options: ['Slicer', 'Relationship giữa các bảng trong dataset', 'Visual dạng biểu đồ tròn', 'Story'], correctIndex: 1, explanation: 'Relationship trong Power BI thiết lập liên kết giữa bảng fact và dimension.' },
  { id: 'q3', question: 'Nguyên tắc data-ink nói gì?', options: ['Dùng càng nhiều màu càng tốt', 'Tối đa hoá phần mực thể hiện dữ liệu, tối thiểu hoá phần mực không mang thông tin', 'Luôn dùng hiệu ứng 3D', 'Không cần chú thích (legend)'], correctIndex: 1, explanation: 'Nguyên tắc data-ink hướng tới giảm nhiễu thị giác không mang thông tin trên biểu đồ.' },
]);

const c6 = doc('tbi301c-6-1-dax-modeling', '6.1 — DAX formulas & data modeling|||6.1 — Công thức DAX & mô hình hoá dữ liệu',
  'Calculated column vs measure; hàm DAX cơ bản (SUM, CALCULATE, FILTER, SUMX, RELATED); time intelligence (DATESYTD, SAMEPERIODLASTYEAR); ví dụ công thức.',
  [[
    `<span class="eyebrow">TBI301c · Chapter 6 · Lesson 6.1</span>
<h2>DAX formulas &amp; data modeling</h2>
<h3>Calculated columns vs measures</h3>
<p>A <strong>calculated column</strong> is computed row-by-row and stored in the table (e.g. <code>Full Name</code> from first + last name). A <strong>measure</strong> is computed on demand, aggregated over whatever rows are currently in view (filtered by slicers, the report page) — most BI metrics (total sales, average order value) should be measures, not calculated columns.</p>
<h3>Core DAX functions</h3>
<pre><code>Total Sales   := SUM(FactSales[amount])
Sales (Red)   := CALCULATE([Total Sales], DimProduct[category] = "Red")
Line Total    := SUMX(FactSales, FactSales[quantity] * FactSales[unit_price])
Product Name  := RELATED(DimProduct[product_name])
</code></pre>
<p><code>CALCULATE</code> re-evaluates a measure under a modified filter context — it is the single most important DAX function. <code>SUMX</code> multiplies row-by-row before summing (needed when the multiplication itself must happen per row). <code>RELATED</code> pulls a value across a relationship from a dimension into a fact-side calculation.</p>
<h3>Time intelligence</h3>
<pre><code>Sales YTD     := TOTALYTD([Total Sales], DimDate[date])
Sales LY      := CALCULATE([Total Sales], SAMEPERIODLASTYEAR(DimDate[date]))
YoY Growth %  := DIVIDE([Total Sales] - [Sales LY], [Sales LY])
</code></pre>
<p>Time-intelligence functions require a proper <strong>date dimension</strong> marked as the model's date table — this is why the star schema modeling in Chapter 2 matters directly to what formulas are even possible here.</p>
<div class="callout"><span class="badge">Filter context first</span> Most DAX bugs come from misunderstanding filter context, not from wrong syntax — always ask "what rows is this measure being evaluated over, right now?"</div>`,
    `<span class="eyebrow">TBI301c · Chương 6 · Bài 6.1</span>
<h2>Công thức DAX &amp; mô hình hoá dữ liệu</h2>
<h3>Calculated column và measure</h3>
<p>Một <strong>calculated column</strong> được tính theo từng dòng và lưu trong bảng (vd <code>Full Name</code> từ tên + họ). Một <strong>measure</strong> được tính theo yêu cầu, tổng hợp trên bất kỳ tập dòng nào đang hiển thị (đã bị lọc bởi slicer, trang report) — hầu hết chỉ số BI (tổng doanh số, giá trị đơn hàng trung bình) nên là measure, không phải calculated column.</p>
<h3>Hàm DAX lõi</h3>
<pre><code>Total Sales   := SUM(FactSales[amount])
Sales (Red)   := CALCULATE([Total Sales], DimProduct[category] = "Red")
Line Total    := SUMX(FactSales, FactSales[quantity] * FactSales[unit_price])
Product Name  := RELATED(DimProduct[product_name])
</code></pre>
<p><code>CALCULATE</code> tính lại một measure dưới bối cảnh lọc (filter context) đã bị thay đổi — đây là hàm DAX quan trọng nhất. <code>SUMX</code> nhân theo từng dòng trước khi cộng (cần khi phép nhân phải xảy ra ở mức dòng). <code>RELATED</code> lấy một giá trị qua quan hệ, từ dimension sang tính toán ở phía fact.</p>
<h3>Time intelligence</h3>
<pre><code>Sales YTD     := TOTALYTD([Total Sales], DimDate[date])
Sales LY      := CALCULATE([Total Sales], SAMEPERIODLASTYEAR(DimDate[date]))
YoY Growth %  := DIVIDE([Total Sales] - [Sales LY], [Sales LY])
</code></pre>
<p>Các hàm time intelligence yêu cầu một <strong>dimension ngày</strong> đúng chuẩn được đánh dấu là bảng ngày của mô hình — đây là lý do việc mô hình hoá star schema ở Chương 2 ảnh hưởng trực tiếp tới việc công thức nào còn khả dụng ở đây.</p>
<div class="callout"><span class="badge">Filter context trước tiên</span> Hầu hết lỗi DAX bắt nguồn từ hiểu sai filter context, không phải sai cú pháp — luôn hỏi "measure này đang được tính trên tập dòng nào, ngay lúc này?"</div>`,
  ]]);

const c6q = quiz('tbi301c-quiz-6', 'Quiz 6 — DAX & data modeling|||Quiz 6 — DAX & mô hình hoá', [
  { id: 'q1', question: 'Khác biệt chính giữa calculated column và measure trong DAX là gì?', options: ['Không có khác biệt', 'Calculated column tính theo dòng và lưu trong bảng; measure tính theo yêu cầu trên tập dòng đang hiển thị', 'Measure luôn chạy chậm hơn calculated column', 'Calculated column chỉ dùng cho ngày tháng'], correctIndex: 1, explanation: 'Calculated column được lưu vật lý; measure được tính động theo filter context hiện tại.' },
  { id: 'q2', question: 'Hàm DAX nào được xem là quan trọng nhất vì tính lại measure dưới bối cảnh lọc mới?', options: ['SUM', 'CALCULATE', 'RELATED', 'FORMAT'], correctIndex: 1, explanation: 'CALCULATE thay đổi filter context trước khi đánh giá một biểu thức, là nền của hầu hết công thức DAX phức tạp.' },
  { id: 'q3', question: 'Các hàm time intelligence (vd SAMEPERIODLASTYEAR) đòi hỏi điều gì trong mô hình?', options: ['Một bảng dimension ngày đúng chuẩn được đánh dấu là bảng ngày', 'Không cần điều kiện gì đặc biệt', 'Chỉ cần một cột số nguyên bất kỳ', 'Phải xoá hết bảng fact'], correctIndex: 0, explanation: 'Time intelligence trong DAX cần một date table hợp lệ được gán vai trò bảng ngày cho mô hình.' },
]);

const c7 = doc('tbi301c-7-1-olap-kpi-selfservice', '7.1 — OLAP, KPIs & self-service BI|||7.1 — OLAP, KPI & self-service BI',
  'Khối OLAP: dimension/measure, slice/dice, drill down/up; thiết kế KPI (target, actual, ngưỡng RAG); self-service BI và vai trò governance.',
  [[
    `<span class="eyebrow">TBI301c · Chapter 7 · Lesson 7.1</span>
<h2>OLAP, KPIs &amp; self-service BI</h2>
<h3>OLAP cube concepts</h3>
<p>Conceptually, an <strong>OLAP cube</strong> organizes measures (numbers) across multiple dimensions (time, product, region) so a user can:</p>
<ul>
<li><strong>Slice</strong> — filter to one value of a dimension (this region only).</li>
<li><strong>Dice</strong> — filter to a sub-cube across several dimensions at once.</li>
<li><strong>Drill down / roll up</strong> — move between detail (daily, by store) and summary (yearly, by country) levels of the same hierarchy.</li>
</ul>
<p>A star schema plus a BI tool's data model effectively gives users this same cube-like flexibility, without a separate physical OLAP cube.</p>
<h3>Designing a KPI</h3>
<p>A useful <strong>KPI</strong> needs more than a raw number: a clear <strong>target</strong>, the current <strong>actual</strong>, a <strong>trend</strong> (better or worse than last period), and a <strong>threshold</strong> to flag status — commonly shown as red/amber/green (RAG). A KPI without a target is just a number nobody can judge.</p>
<h3>Self-service BI</h3>
<p><strong>Self-service BI</strong> lets business users build their own reports from a curated, trusted data model, instead of waiting on IT for every request. It speeds up decisions, but it needs guardrails: a governed semantic model with clear definitions (so "revenue" means the same thing everywhere), row-level security where needed, and a way to certify which reports are "official".</p>
<div class="callout"><span class="badge">One metric, one definition</span> The most common self-service BI failure is two people getting two different numbers for something both call "revenue" — because each built their own, slightly different calculation instead of reusing a certified measure.</div>`,
    `<span class="eyebrow">TBI301c · Chương 7 · Bài 7.1</span>
<h2>OLAP, KPI &amp; self-service BI</h2>
<h3>Khái niệm khối OLAP</h3>
<p>Về khái niệm, một <strong>khối OLAP</strong> tổ chức các số đo (measure) theo nhiều chiều (thời gian, sản phẩm, vùng) để người dùng có thể:</p>
<ul>
<li><strong>Slice (cắt lát)</strong> — lọc về một giá trị của một chiều (chỉ vùng này).</li>
<li><strong>Dice (cắt khối)</strong> — lọc về một khối con trên nhiều chiều cùng lúc.</li>
<li><strong>Drill down / roll up</strong> — di chuyển giữa mức chi tiết (theo ngày, theo cửa hàng) và mức tổng hợp (theo năm, theo quốc gia) trong cùng một hệ thứ bậc.</li>
</ul>
<p>Một star schema cộng với mô hình dữ liệu của công cụ BI thực chất đã cho người dùng sự linh hoạt kiểu khối này, không cần một khối OLAP vật lý riêng.</p>
<h3>Thiết kế một KPI</h3>
<p>Một <strong>KPI</strong> hữu ích cần nhiều hơn một con số thô: một <strong>mục tiêu (target)</strong> rõ ràng, giá trị <strong>hiện tại (actual)</strong>, một <strong>xu hướng</strong> (tốt hơn hay xấu hơn kỳ trước), và một <strong>ngưỡng</strong> để gắn cờ trạng thái — thường thể hiện bằng đỏ/vàng/xanh (RAG). Một KPI không có mục tiêu chỉ là một con số không ai đánh giá được.</p>
<h3>Self-service BI</h3>
<p><strong>Self-service BI</strong> cho phép người dùng kinh doanh tự dựng báo cáo từ một mô hình dữ liệu được chọn lọc, đáng tin, thay vì chờ IT cho mỗi yêu cầu. Nó giúp ra quyết định nhanh hơn, nhưng cần có rào chắn: một semantic model được quản trị với định nghĩa rõ ràng (để "doanh thu" mang nghĩa giống nhau ở mọi nơi), phân quyền theo dòng (row-level security) khi cần, và một cách chứng thực báo cáo nào là "chính thức".</p>
<div class="callout"><span class="badge">Một chỉ số, một định nghĩa</span> Lỗi self-service BI phổ biến nhất là hai người nhận hai con số khác nhau cho cùng thứ họ gọi là "doanh thu" — vì mỗi người tự dựng một công thức hơi khác nhau thay vì dùng lại một measure đã được chứng thực.</div>`,
  ]]);

const c7q = quiz('tbi301c-quiz-7', 'Quiz 7 — OLAP, KPI & self-service|||Quiz 7 — OLAP, KPI & self-service', [
  { id: 'q1', question: 'Hành động "drill down" trong OLAP nghĩa là gì?', options: ['Di chuyển từ mức tổng hợp xuống mức chi tiết hơn trong cùng một hệ thứ bậc', 'Xoá dữ liệu chi tiết', 'Tạo một bảng fact mới', 'Chỉ lọc theo một chiều duy nhất'], correctIndex: 0, explanation: 'Drill down đi từ mức tổng hợp (vd năm) xuống mức chi tiết hơn (vd ngày) trong cùng hệ thứ bậc.' },
  { id: 'q2', question: 'Một KPI thiếu yếu tố nào thì trở thành "chỉ một con số không ai đánh giá được"?', options: ['Màu sắc đẹp', 'Mục tiêu (target) để so sánh', 'Font chữ lớn', 'Biểu tượng minh hoạ'], correctIndex: 1, explanation: 'Không có target thì không biết actual là tốt hay xấu — KPI mất ý nghĩa đánh giá.' },
  { id: 'q3', question: 'Lỗi phổ biến nhất của self-service BI khi thiếu governance là gì?', options: ['Báo cáo chạy quá nhanh', 'Hai người tính ra hai số khác nhau cho cùng một chỉ số vì mỗi người tự định nghĩa riêng', 'Không dùng được biểu đồ tròn', 'Dữ liệu quá ít cột'], correctIndex: 1, explanation: 'Thiếu một measure/định nghĩa được chứng thực dùng chung dẫn tới các số liệu mâu thuẫn giữa người dùng.' },
]);

const c8 = doc('tbi301c-8-1-modern-bi', '8.1 — Modern BI: cloud, big data, AI-augmented analytics & governance|||8.1 — BI hiện đại: cloud, big data, AI/augmented analytics & quản trị dữ liệu',
  'Kho dữ liệu cloud (Snowflake/BigQuery/Redshift/Synapse); data lake vs lakehouse; augmented analytics & natural language query; data governance (catalog, lineage, master data).',
  [[
    `<span class="eyebrow">TBI301c · Chapter 8 · Lesson 8.1</span>
<h2>Modern BI: cloud, big data, AI-augmented analytics &amp; governance</h2>
<h3>Cloud data warehouses</h3>
<p>Cloud platforms — <strong>Snowflake</strong>, <strong>BigQuery</strong>, <strong>Redshift</strong>, <strong>Synapse</strong> — separate storage from compute, so a warehouse can scale query power up or down on demand and pay only for what runs. The star schema and SQL skills from earlier chapters carry over directly; what changes is where the warehouse lives and how it scales.</p>
<h3>Data lake, warehouse, lakehouse</h3>
<ul>
<li><strong>Data lake</strong> — stores raw data of any format (structured, semi-structured, unstructured) cheaply, schema applied on read.</li>
<li><strong>Data warehouse</strong> — stores curated, structured, modeled data (star schema), schema applied on write.</li>
<li><strong>Lakehouse</strong> — a newer pattern combining lake-style cheap storage with warehouse-style structure and query performance on the same platform.</li>
</ul>
<h3>Augmented analytics</h3>
<p>Modern BI tools increasingly add AI-assisted features: automatic anomaly detection, natural-language question answering over a dataset ("what drove the drop in March?"), and auto-generated narrative summaries next to a chart. These speed up analysis but do not replace validating the underlying data model — an AI answer is only as trustworthy as the star schema and measures behind it.</p>
<h3>Data governance</h3>
<p>As self-service BI scales, governance keeps it trustworthy: a <strong>data catalog</strong> (what data exists, what it means), <strong>data lineage</strong> (where a number came from, through which transformations), access control, and <strong>master data management</strong> (one agreed-upon version of "customer" or "product" across systems).</p>
<div class="callout"><span class="badge">Tools change, fundamentals do not</span> Cloud warehouses and AI features change where BI runs and how fast it answers — the star schema, clean ETL, correct SQL and clear KPI design from earlier chapters are still what makes any of it trustworthy.</div>`,
    `<span class="eyebrow">TBI301c · Chương 8 · Bài 8.1</span>
<h2>BI hiện đại: cloud, big data, AI/augmented analytics &amp; quản trị dữ liệu</h2>
<h3>Kho dữ liệu cloud</h3>
<p>Các nền tảng cloud — <strong>Snowflake</strong>, <strong>BigQuery</strong>, <strong>Redshift</strong>, <strong>Synapse</strong> — tách lưu trữ khỏi tính toán, nên một kho dữ liệu có thể tăng/giảm năng lực truy vấn theo nhu cầu và chỉ trả tiền cho phần thực chạy. Kỹ năng star schema và SQL ở các chương trước áp dụng trực tiếp; thứ thay đổi là kho nằm ở đâu và mở rộng ra sao.</p>
<h3>Data lake, data warehouse, lakehouse</h3>
<ul>
<li><strong>Data lake</strong> — lưu dữ liệu thô ở bất kỳ dạng nào (có cấu trúc, bán cấu trúc, không cấu trúc) với chi phí rẻ, áp schema lúc đọc.</li>
<li><strong>Data warehouse</strong> — lưu dữ liệu đã chọn lọc, có cấu trúc, đã mô hình hoá (star schema), áp schema lúc ghi.</li>
<li><strong>Lakehouse</strong> — mô hình mới hơn kết hợp lưu trữ rẻ kiểu lake với cấu trúc và hiệu năng truy vấn kiểu warehouse trên cùng một nền tảng.</li>
</ul>
<h3>Augmented analytics</h3>
<p>Công cụ BI hiện đại ngày càng thêm tính năng có AI hỗ trợ: tự phát hiện bất thường, trả lời câu hỏi bằng ngôn ngữ tự nhiên trên một tập dữ liệu ("điều gì gây ra sụt giảm trong tháng Ba?"), và tự sinh tóm tắt tường thuật bên cạnh biểu đồ. Những thứ này giúp phân tích nhanh hơn nhưng không thay thế việc kiểm tra mô hình dữ liệu bên dưới — câu trả lời của AI chỉ đáng tin bằng chính star schema và measure phía sau nó.</p>
<h3>Quản trị dữ liệu</h3>
<p>Khi self-service BI mở rộng quy mô, quản trị dữ liệu (governance) giữ nó đáng tin: một <strong>data catalog</strong> (dữ liệu nào tồn tại, mang nghĩa gì), <strong>data lineage</strong> (một số liệu đến từ đâu, qua những bước biến đổi nào), kiểm soát truy cập, và <strong>master data management</strong> (một phiên bản thống nhất của "khách hàng" hay "sản phẩm" xuyên suốt các hệ thống).</p>
<div class="callout"><span class="badge">Công cụ đổi, nền tảng không đổi</span> Kho dữ liệu cloud và tính năng AI thay đổi nơi BI chạy và tốc độ trả lời — nhưng star schema, ETL sạch, SQL đúng và KPI thiết kế rõ từ các chương trước vẫn là thứ khiến tất cả những điều đó đáng tin.</div>`,
  ]]);

const c8q = quiz('tbi301c-quiz-8', 'Quiz 8 — Modern BI|||Quiz 8 — BI hiện đại', [
  { id: 'q1', question: 'Ưu điểm chính của kho dữ liệu cloud (vd Snowflake, BigQuery) là gì?', options: ['Không cần SQL', 'Tách lưu trữ khỏi tính toán, mở rộng năng lực truy vấn theo nhu cầu và trả tiền theo mức dùng', 'Không cần mô hình dữ liệu', 'Chỉ dùng được cho dữ liệu văn bản'], correctIndex: 1, explanation: 'Kiến trúc cloud tách storage/compute cho phép co giãn linh hoạt theo tải và chi phí.' },
  { id: 'q2', question: '"Lakehouse" là mô hình kết hợp điều gì?', options: ['Kết hợp lưu trữ rẻ kiểu data lake với cấu trúc/hiệu năng truy vấn kiểu data warehouse', 'Chỉ là một tên gọi khác của OLTP', 'Một loại biểu đồ trong Tableau', 'Một công thức DAX'], correctIndex: 0, explanation: 'Lakehouse gộp ưu điểm chi phí thấp của lake và cấu trúc/hiệu năng của warehouse.' },
  { id: 'q3', question: 'Vì sao câu trả lời từ một công cụ augmented analytics/AI vẫn cần được kiểm chứng?', options: ['Vì AI luôn sai', 'Vì độ tin cậy của câu trả lời phụ thuộc vào mô hình dữ liệu (star schema, measure) phía sau nó', 'Vì AI không đọc được số liệu', 'Vì augmented analytics không tồn tại trong thực tế'], correctIndex: 1, explanation: 'AI chỉ tổng hợp/diễn giải dữ liệu có sẵn; nền dữ liệu sai hoặc mô hình sai vẫn cho câu trả lời sai.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'TBI301c',
    slug: 'tbi301c-technology-for-bi-analysts',
    title: 'Technology for BI Analysts',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TBI301c.webp',
    shortDescription: 'Technology for BI analysts: BI lifecycle & role, data warehousing & star schema, ETL, SQL, Power BI/Tableau dashboards, DAX, OLAP/KPIs & self-service BI, modern cloud & AI analytics. Bilingual, with examples & quizzes.|||Công nghệ cho chuyên viên phân tích BI: vai trò analyst, kho dữ liệu & star schema, ETL, SQL, dashboard Power BI/Tableau, DAX, OLAP/KPI & self-service BI, cloud & AI analytics hiện đại. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>TBI301c — Technology for BI Analysts</strong> (khối Quản trị Kinh doanh, kỳ 4) xây bộ công cụ kỹ thuật của một <strong>chuyên viên phân tích BI</strong>. Từ <strong>tổng quan BI &amp; vai trò analyst</strong> → <strong>kho dữ liệu &amp; mô hình star schema</strong> (Kimball) → <strong>ETL &amp; tích hợp dữ liệu</strong> → <strong>SQL cho phân tích</strong> → <strong>trực quan hoá &amp; dashboard</strong> (Power BI/Tableau) → <strong>công thức DAX &amp; mô hình hoá</strong> → <strong>OLAP, KPI &amp; self-service BI</strong> → <strong>BI hiện đại</strong> (cloud, big data, AI/augmented analytics, quản trị dữ liệu). Bám theo <em>Business Intelligence Guidebook</em> (Sherman) và <em>The Data Warehouse Toolkit</em> (Kimball), song ngữ, có ví dụ SQL/DAX tính toán và quiz mỗi chương.',
    whatYouLearn: 'BI lifecycle & vai trò BI analyst; OLTP vs OLAP, star vs snowflake schema, conformed dimension; ETL (extract/transform/load), chất lượng dữ liệu, SCD Type 1/2, ELT; SQL (JOIN, GROUP BY, window function, CTE) cho phân tích; nguyên tắc chọn biểu đồ, Power BI (dataset/relationship/slicer), Tableau (worksheet/dashboard/story); DAX (calculated column vs measure, CALCULATE, SUMX, time intelligence); khối OLAP (slice/dice/drill), thiết kế KPI, self-service BI & governance; cloud data warehouse, data lake/lakehouse, augmented analytics, data governance.',
    requirements: 'Kiến thức cơ sở dữ liệu quan hệ & SQL cơ bản (SELECT, JOIN). Nên cài Power BI Desktop hoặc dùng Tableau Public để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách BI Guidebook (Sherman), Data Warehouse Toolkit (Kimball), tài liệu Power BI/Tableau, khoá miễn phí, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'BI là gì, vòng đời BI, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan BI & vai trò analyst|||Chapter 1 — BI overview & analyst role', description: 'Định nghĩa BI, nhiệm vụ BI analyst, Kimball vs Inmon.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kho dữ liệu & mô hình dữ liệu|||Chapter 2 — Data warehouse & data modeling', description: 'OLTP/OLAP, star schema, snowflake, conformed dimension, grain.', lessons: [c2, c2q] },
    { title: 'Chương 3 — ETL & tích hợp dữ liệu|||Chapter 3 — ETL & data integration', description: 'Extract-Transform-Load, chất lượng dữ liệu, SCD, batch/CDC, ELT.', lessons: [c3, c3q] },
    { title: 'Chương 4 — SQL cho phân tích BI|||Chapter 4 — SQL for BI analysis', description: 'JOIN fact-dimension, window function, CTE, kiểm tra số liệu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trực quan hoá & dashboard|||Chapter 5 — Visualization & dashboards', description: 'Chọn biểu đồ, Power BI, Tableau, thiết kế dashboard.', lessons: [c5, c5q] },
    { title: 'Chương 6 — DAX & mô hình hoá dữ liệu|||Chapter 6 — DAX & data modeling', description: 'Calculated column vs measure, CALCULATE, SUMX, time intelligence.', lessons: [c6, c6q] },
    { title: 'Chương 7 — OLAP, KPI & self-service BI|||Chapter 7 — OLAP, KPIs & self-service BI', description: 'Slice/dice/drill, thiết kế KPI, self-service & governance.', lessons: [c7, c7q] },
    { title: 'Chương 8 — BI hiện đại|||Chapter 8 — Modern BI', description: 'Cloud data warehouse, lakehouse, augmented analytics, data governance.', lessons: [c8, c8q] },
  ],
};
