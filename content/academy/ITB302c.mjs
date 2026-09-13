/**
 * ITB302c — Business Intelligence (BI) (Trí tuệ kinh doanh). Ngành Hệ thống thông tin FPTU.
 * Khung chất lượng, song ngữ VI+EN, 8 chương + tài liệu + giới thiệu.
 * Giáo trình chuẩn: Sharda, Delen &amp; Turban "Business Intelligence, Analytics, and Data Science";
 * Kimball &amp; Ross "The Data Warehouse Toolkit". Công cụ: Power BI, Tableau, SQL.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; & -> &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('itb302c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình Sharda & Kimball, tài liệu Power BI/Tableau, dataset mẫu, YouTube, công cụ, lộ trình.',
  [[
    `<span class="eyebrow">ITB302c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Business Intelligence</strong> — from data warehousing and dimensional modeling to OLAP, dashboards and self-service analytics in Power BI &amp; Tableau — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ITB302c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Sharda, Delen &amp; Turban — <em>Business Intelligence, Analytics, and Data Science: A Managerial Perspective</em> (Pearson).</li>
<li>Kimball &amp; Ross — <em>The Data Warehouse Toolkit</em> (Wiley) — the standard on dimensional modeling.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://learn.microsoft.com/power-bi/" target="_blank" rel="noopener">Microsoft Power BI documentation</a> — free, with guided learning.</li>
<li><a href="https://www.tableau.com/learn/training" target="_blank" rel="noopener">Tableau training &amp; tutorials</a> — free videos + Tableau Public.</li>
<li><a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/" target="_blank" rel="noopener">Kimball Group techniques</a> — dimensional modeling reference.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GuyInACube" target="_blank" rel="noopener">Guy in a Cube</a> — Power BI &amp; the Microsoft data stack.</li>
<li><a href="https://www.youtube.com/@Kimberly_Analytics" target="_blank" rel="noopener">Data &amp; analytics tutorials</a> — dashboards, DAX and reporting.</li>
</ul>
<h3>🛠️ Tools &amp; datasets</h3>
<ul>
<li><a href="https://powerbi.microsoft.com/desktop/" target="_blank" rel="noopener">Power BI Desktop</a> — free authoring tool for reports &amp; dashboards.</li>
<li><a href="https://public.tableau.com/" target="_blank" rel="noopener">Tableau Public</a> — free visualization + a gallery to learn from.</li>
<li><a href="https://www.kaggle.com/datasets" target="_blank" rel="noopener">Kaggle Datasets</a> — real sales/retail data to build a warehouse and dashboards.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what BI is, the data-to-decision flow, OLTP vs OLAP, the star schema (fact + dimensions).</li>
<li><strong>Practice</strong> — model a small retail dataset as a star schema, load it, and answer questions with roll-up/drill-down.</li>
<li><strong>Go deeper</strong> — build a KPI dashboard in Power BI or Tableau, write basic DAX measures, add slicers.</li>
<li><strong>Job-ready</strong> — publish a self-service report, document its data governance, and present the insight, not just the chart.</li>
</ol></div>`,
    `<span class="eyebrow">ITB302c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Trí tuệ kinh doanh (BI)</strong> — từ kho dữ liệu, mô hình đa chiều tới OLAP, dashboard và phân tích tự phục vụ trên Power BI &amp; Tableau — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ITB302c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Sharda, Delen &amp; Turban — <em>Business Intelligence, Analytics, and Data Science</em> (Pearson) — góc nhìn quản trị.</li>
<li>Kimball &amp; Ross — <em>The Data Warehouse Toolkit</em> (Wiley) — sách chuẩn về mô hình đa chiều.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://learn.microsoft.com/power-bi/" target="_blank" rel="noopener">Tài liệu Power BI (Microsoft)</a> — miễn phí, có lộ trình học.</li>
<li><a href="https://www.tableau.com/learn/training" target="_blank" rel="noopener">Đào tạo &amp; hướng dẫn Tableau</a> — video miễn phí + Tableau Public.</li>
<li><a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/" target="_blank" rel="noopener">Kỹ thuật Kimball Group</a> — tham chiếu mô hình đa chiều.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GuyInACube" target="_blank" rel="noopener">Guy in a Cube</a> — Power BI &amp; hệ dữ liệu Microsoft.</li>
<li><a href="https://www.youtube.com/@Kimberly_Analytics" target="_blank" rel="noopener">Hướng dẫn dữ liệu &amp; phân tích</a> — dashboard, DAX và báo cáo.</li>
</ul>
<h3>🛠️ Công cụ &amp; dữ liệu</h3>
<ul>
<li><a href="https://powerbi.microsoft.com/desktop/" target="_blank" rel="noopener">Power BI Desktop</a> — công cụ dựng báo cáo &amp; dashboard miễn phí.</li>
<li><a href="https://public.tableau.com/" target="_blank" rel="noopener">Tableau Public</a> — trực quan hoá miễn phí + thư viện để học theo.</li>
<li><a href="https://www.kaggle.com/datasets" target="_blank" rel="noopener">Kaggle Datasets</a> — dữ liệu bán lẻ thật để dựng kho và dashboard.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — BI là gì, dòng chảy dữ liệu tới quyết định, OLTP vs OLAP, star schema (fact + dimension).</li>
<li><strong>Luyện tập</strong> — mô hình một tập dữ liệu bán lẻ nhỏ thành star schema, nạp vào, và trả lời câu hỏi bằng roll-up/drill-down.</li>
<li><strong>Đào sâu</strong> — dựng dashboard KPI trên Power BI hoặc Tableau, viết measure DAX cơ bản, thêm slicer.</li>
<li><strong>Sẵn sàng đi làm</strong> — xuất bản báo cáo tự phục vụ, ghi lại quản trị dữ liệu, và trình bày insight chứ không chỉ cái biểu đồ.</li>
</ol></div>`,
  ]]);

const intro = doc('itb302c-0-1-overview', 'Course overview: Business Intelligence|||Tổng quan: Trí tuệ kinh doanh',
  'BI là gì, vì sao doanh nghiệp cần; dòng chảy dữ liệu → thông tin → quyết định; lộ trình môn: kho dữ liệu → mô hình đa chiều → OLAP → dashboard → phân tích nâng cao → quản trị.',
  [[
    `<span class="eyebrow">ITB302c · Lesson 0.1 · Overview</span>
<h2>Business Intelligence &amp; analytics</h2>
<p class="lead">This course teaches you how organizations turn <strong>raw data into decisions</strong>. You will design a <strong>data warehouse</strong>, model data the Kimball way (star schemas), analyze it with <strong>OLAP</strong>, and communicate it through <strong>dashboards</strong> built in Power BI and Tableau.</p>
<h3>Why BI matters</h3>
<p>A retailer records millions of transactions, but a manager cannot read a transaction log. BI answers questions leaders actually ask — <em>which region is growing, which product is slipping, are we hitting target</em> — fast enough to act. It is the difference between having data and being <strong>data-driven</strong>.</p>
<h3>From data to decision</h3>
<pre><code>Sources (ERP, CRM, files)
  -> ETL (extract, transform, load)
  -> Data warehouse (clean, historical, subject-oriented)
  -> OLAP / dashboards
  -> Decisions
</code></pre>
<h3>Roadmap</h3>
<p>BI &amp; architecture → data warehouse (OLTP vs OLAP, ETL) → dimensional modeling (star/snowflake) → OLAP operations → reporting &amp; KPI dashboards → visualization with Power BI/Tableau &amp; DAX → advanced analytics → deployment &amp; data governance. Bilingual, with real business examples and quizzes.</p>`,
    `<span class="eyebrow">ITB302c · Bài 0.1 · Tổng quan</span>
<h2>Trí tuệ kinh doanh &amp; phân tích</h2>
<p class="lead">Môn này dạy cách tổ chức biến <strong>dữ liệu thô thành quyết định</strong>. Bạn sẽ thiết kế <strong>kho dữ liệu</strong>, mô hình dữ liệu theo phong cách Kimball (star schema), phân tích bằng <strong>OLAP</strong>, và truyền đạt qua <strong>dashboard</strong> dựng bằng Power BI và Tableau.</p>
<h3>Vì sao BI quan trọng</h3>
<p>Một nhà bán lẻ ghi hàng triệu giao dịch, nhưng nhà quản lý không đọc được nhật ký giao dịch. BI trả lời đúng câu hỏi lãnh đạo hay hỏi — <em>vùng nào đang tăng, sản phẩm nào đang tụt, có đạt chỉ tiêu không</em> — đủ nhanh để hành động. Đó là khác biệt giữa việc có dữ liệu và việc <strong>ra quyết định dựa trên dữ liệu</strong>.</p>
<h3>Từ dữ liệu tới quyết định</h3>
<pre><code>Nguồn (ERP, CRM, tệp)
  -> ETL (rút, biến đổi, nạp)
  -> Kho dữ liệu (sạch, lịch sử, theo chủ đề)
  -> OLAP / dashboard
  -> Quyết định
</code></pre>
<h3>Lộ trình</h3>
<p>BI &amp; kiến trúc → kho dữ liệu (OLTP vs OLAP, ETL) → mô hình đa chiều (star/snowflake) → thao tác OLAP → báo cáo &amp; dashboard KPI → trực quan hoá bằng Power BI/Tableau &amp; DAX → phân tích nâng cao → triển khai &amp; quản trị dữ liệu. Song ngữ, có ví dụ doanh nghiệp thật và quiz.</p>`,
  ]]);

const c1 = doc('itb302c-1-1-what-is-bi', '1.1 — What is BI?|||1.1 — BI là gì?',
  'Định nghĩa business intelligence; chuỗi dữ liệu → thông tin → tri thức → quyết định; kiến trúc BI (nguồn, ETL, kho, tầng phân tích, trình bày); vai trò trong doanh nghiệp.',
  [[
    `<span class="eyebrow">ITB302c · Chapter 1 · Lesson 1.1</span>
<h2>What is Business Intelligence?</h2>
<p><strong>Business Intelligence (BI)</strong> is the set of technologies, processes and practices that collect, integrate and analyze business data to support better decisions. Sharda frames it as turning data into information, information into knowledge, and knowledge into <strong>action</strong>.</p>
<h3>The data-to-decision ladder</h3>
<ul>
<li><strong>Data</strong> — raw facts: an order of 3 units at 50,000₫.</li>
<li><strong>Information</strong> — data in context: sales by region this month.</li>
<li><strong>Knowledge</strong> — patterns: the North is up 12% while the South is flat.</li>
<li><strong>Decision</strong> — action: shift the promotion budget to the South.</li>
</ul>
<h3>BI architecture</h3>
<pre><code>[Data sources]  ERP, CRM, POS, spreadsheets, web logs
      |  ETL / ELT
[Data warehouse]  integrated, historical, subject-oriented
      |
[Analysis layer]  OLAP cubes, data marts, models
      |
[Presentation]  dashboards, reports, self-service BI
</code></pre>
<h3>A real example</h3>
<p>A supermarket chain feeds POS sales, loyalty-card data and inventory into a warehouse, then a dashboard shows store managers daily revenue vs target and the top slow-moving items — so restocking and markdowns happen the same day, not next month.</p>
<div class="callout"><span class="badge">Key idea</span> BI is not one tool. It is an end-to-end pipeline whose output is a <strong>decision</strong>, so every layer exists to make the final chart trustworthy and timely.</div>`,
    `<span class="eyebrow">ITB302c · Chương 1 · Bài 1.1</span>
<h2>Trí tuệ kinh doanh (BI) là gì?</h2>
<p><strong>Trí tuệ kinh doanh (BI)</strong> là tập hợp công nghệ, quy trình và thực hành thu thập, tích hợp và phân tích dữ liệu kinh doanh để hỗ trợ quyết định tốt hơn. Sharda mô tả nó là biến dữ liệu thành thông tin, thông tin thành tri thức, và tri thức thành <strong>hành động</strong>.</p>
<h3>Thang từ dữ liệu tới quyết định</h3>
<ul>
<li><strong>Dữ liệu</strong> — sự kiện thô: một đơn 3 sản phẩm giá 50.000₫.</li>
<li><strong>Thông tin</strong> — dữ liệu có ngữ cảnh: doanh thu theo vùng tháng này.</li>
<li><strong>Tri thức</strong> — quy luật: miền Bắc tăng 12% còn miền Nam đứng yên.</li>
<li><strong>Quyết định</strong> — hành động: dời ngân sách khuyến mãi sang miền Nam.</li>
</ul>
<h3>Kiến trúc BI</h3>
<pre><code>[Nguồn dữ liệu]  ERP, CRM, POS, bảng tính, log web
      |  ETL / ELT
[Kho dữ liệu]  tích hợp, lịch sử, theo chủ đề
      |
[Tầng phân tích]  OLAP cube, data mart, mô hình
      |
[Trình bày]  dashboard, báo cáo, BI tự phục vụ
</code></pre>
<h3>Ví dụ thật</h3>
<p>Một chuỗi siêu thị đưa doanh số POS, dữ liệu thẻ thành viên và tồn kho vào kho dữ liệu, rồi một dashboard cho quản lý cửa hàng thấy doanh thu ngày so với chỉ tiêu và những mặt hàng bán chậm nhất — để nhập bù và giảm giá ngay trong ngày, không phải tháng sau.</p>
<div class="callout"><span class="badge">Ý chính</span> BI không phải một công cụ đơn lẻ. Nó là một đường ống đầu-cuối mà đầu ra là một <strong>quyết định</strong>, nên mọi tầng tồn tại để cái biểu đồ cuối cùng đáng tin và kịp thời.</div>`,
  ]]);

const c1q = quiz('itb302c-quiz-1', 'Quiz 1 — What is BI|||Quiz 1 — BI là gì', [
  { id: 'q1', question: 'Mục tiêu cuối cùng của một hệ BI là?|||The ultimate goal of a BI system is?', options: ['Lưu càng nhiều dữ liệu càng tốt|||Store as much data as possible', 'Hỗ trợ ra quyết định tốt hơn|||Support better decisions', 'Thay thế cơ sở dữ liệu giao dịch|||Replace the transactional database', 'Tăng tốc website|||Speed up the website'], correctIndex: 1, explanation: 'BI biến dữ liệu → thông tin → tri thức → hành động; đầu ra là quyết định tốt hơn.' },
  { id: 'q2', question: 'Thứ tự đúng của thang giá trị BI là?|||The correct BI value ladder is?', options: ['Quyết định → tri thức → dữ liệu|||Decision → knowledge → data', 'Dữ liệu → thông tin → tri thức → quyết định|||Data → information → knowledge → decision', 'Thông tin → dữ liệu → quyết định|||Information → data → decision', 'Dữ liệu → quyết định → thông tin|||Data → decision → information'], correctIndex: 1, explanation: 'Dữ liệu thô có ngữ cảnh thành thông tin, thấy quy luật thành tri thức, dẫn tới hành động.' },
  { id: 'q3', question: 'Tầng nào trong kiến trúc BI chịu trách nhiệm tích hợp và làm sạch dữ liệu từ nhiều nguồn?|||Which layer integrates and cleans data from many sources?', options: ['Tầng trình bày (dashboard)|||Presentation (dashboards)', 'ETL nạp vào kho dữ liệu|||ETL into the data warehouse', 'OLAP cube', 'Nguồn giao dịch OLTP|||OLTP source'], correctIndex: 1, explanation: 'ETL rút, biến đổi và nạp dữ liệu từ nhiều nguồn vào kho dữ liệu đã tích hợp, làm sạch.' },
]);

const c2 = doc('itb302c-2-1-data-warehouse', '2.1 — Data warehousing|||2.1 — Kho dữ liệu',
  'Kho dữ liệu (Inmon: tích hợp, theo chủ đề, bất biến, có thời gian); OLTP vs OLAP; quy trình ETL (extract/transform/load); data mart và staging.',
  [[
    `<span class="eyebrow">ITB302c · Chapter 2 · Lesson 2.1</span>
<h2>Data warehousing</h2>
<p>A <strong>data warehouse</strong> is a central repository built for analysis. Inmon defines it by four properties: <strong>subject-oriented</strong> (organized by sales, customer, not by app), <strong>integrated</strong> (one consistent format), <strong>non-volatile</strong> (you add, you do not overwrite), and <strong>time-variant</strong> (it keeps history).</p>
<h3>OLTP vs OLAP</h3>
<ul>
<li><strong>OLTP</strong> (Online Transaction Processing) — the operational database. Many small writes, normalized, answers "process this order now". Optimized for <em>current, fast writes</em>.</li>
<li><strong>OLAP</strong> (Online Analytical Processing) — the warehouse. Few huge reads, denormalized, answers "sales by region over 3 years". Optimized for <em>historical, fast reads</em>.</li>
</ul>
<h3>ETL — the loading pipeline</h3>
<pre><code>Extract   pull from ERP, CRM, CSV, APIs
Transform clean, standardize, deduplicate, join, aggregate
Load      write into the warehouse / marts
</code></pre>
<p>A <strong>staging area</strong> holds raw extracts before transform; a <strong>data mart</strong> is a subset of the warehouse for one department (e.g. a Sales mart) so teams query a smaller, focused model.</p>
<div class="callout"><span class="badge">Why not just query OLTP?</span> Big analytical queries would lock and slow the live transactional system, and OLTP is normalized for writes, not for slicing years of history. Separate the two.</div>`,
    `<span class="eyebrow">ITB302c · Chương 2 · Bài 2.1</span>
<h2>Kho dữ liệu</h2>
<p>Một <strong>kho dữ liệu (data warehouse)</strong> là kho trung tâm dựng cho phân tích. Inmon định nghĩa nó bằng bốn tính chất: <strong>theo chủ đề</strong> (tổ chức theo bán hàng, khách hàng, không theo ứng dụng), <strong>tích hợp</strong> (một định dạng nhất quán), <strong>bất biến</strong> (chỉ thêm, không ghi đè), và <strong>có thời gian</strong> (giữ lịch sử).</p>
<h3>OLTP vs OLAP</h3>
<ul>
<li><strong>OLTP</strong> (xử lý giao dịch trực tuyến) — CSDL vận hành. Nhiều lệnh ghi nhỏ, chuẩn hoá, trả lời "xử lý đơn hàng này ngay". Tối ưu cho <em>hiện tại, ghi nhanh</em>.</li>
<li><strong>OLAP</strong> (xử lý phân tích trực tuyến) — kho dữ liệu. Ít lệnh đọc rất lớn, phi chuẩn hoá, trả lời "doanh thu theo vùng qua 3 năm". Tối ưu cho <em>lịch sử, đọc nhanh</em>.</li>
</ul>
<h3>ETL — đường ống nạp</h3>
<pre><code>Extract   rút từ ERP, CRM, CSV, API
Transform làm sạch, chuẩn hoá, khử trùng lặp, ghép, tổng hợp
Load      ghi vào kho / data mart
</code></pre>
<p>Một <strong>vùng staging</strong> giữ bản rút thô trước khi biến đổi; một <strong>data mart</strong> là tập con của kho cho một phòng ban (vd data mart Bán hàng) để đội nhóm truy vấn mô hình nhỏ, tập trung hơn.</p>
<div class="callout"><span class="badge">Sao không truy vấn thẳng OLTP?</span> Truy vấn phân tích lớn sẽ khoá và làm chậm hệ giao dịch đang chạy, và OLTP chuẩn hoá để ghi, không để cắt lát lịch sử nhiều năm. Hãy tách hai hệ.</div>`,
  ]]);

const c2q = quiz('itb302c-quiz-2', 'Quiz 2 — Data warehousing|||Quiz 2 — Kho dữ liệu', [
  { id: 'q1', question: 'Đặc điểm nào KHÔNG phải của kho dữ liệu theo Inmon?|||Which is NOT an Inmon warehouse property?', options: ['Theo chủ đề|||Subject-oriented', 'Bất biến (non-volatile)|||Non-volatile', 'Chuẩn hoá cao để ghi nhanh nhiều giao dịch|||Highly normalized for fast transactional writes', 'Có thời gian (giữ lịch sử)|||Time-variant'], correctIndex: 2, explanation: 'Chuẩn hoá cao để ghi nhanh là đặc trưng của OLTP; kho dữ liệu phi chuẩn hoá, giữ lịch sử.' },
  { id: 'q2', question: 'Hệ OLAP được tối ưu cho?|||OLAP systems are optimized for?', options: ['Nhiều lệnh ghi nhỏ, thời gian thực|||Many small real-time writes', 'Ít truy vấn đọc lớn trên dữ liệu lịch sử|||Few large read queries over historical data', 'Khoá hàng để cập nhật đơn|||Row locking to update orders', 'Lưu file ảnh|||Storing image files'], correctIndex: 1, explanation: 'OLAP phục vụ truy vấn phân tích lớn, đọc nhiều, trên dữ liệu lịch sử đã tổng hợp.' },
  { id: 'q3', question: 'Chữ "T" trong ETL nghĩa là?|||The "T" in ETL means?', options: ['Transfer — chuyển tệp|||Transfer files', 'Transform — làm sạch, chuẩn hoá, tổng hợp|||Transform — clean, standardize, aggregate', 'Test — kiểm thử|||Test the data', 'Truncate — xoá bảng|||Truncate tables'], correctIndex: 1, explanation: 'Transform là bước làm sạch, chuẩn hoá, khử trùng lặp và tổng hợp trước khi nạp vào kho.' },
]);

const c3 = doc('itb302c-3-1-dimensional-modeling', '3.1 — Dimensional modeling|||3.1 — Mô hình dữ liệu đa chiều',
  'Mô hình đa chiều theo Kimball; bảng fact (số đo) và bảng dimension (ngữ cảnh); star schema vs snowflake; grain; khoá thay thế (surrogate key).',
  [[
    `<span class="eyebrow">ITB302c · Chapter 3 · Lesson 3.1</span>
<h2>Dimensional modeling (Kimball)</h2>
<p>Warehouses are modeled <strong>dimensionally</strong>, not in third normal form. Kimball splits the world into two kinds of tables: <strong>facts</strong> (what you measure) and <strong>dimensions</strong> (the context that describes it).</p>
<h3>Facts &amp; dimensions</h3>
<ul>
<li><strong>Fact table</strong> — the numbers you sum: quantity, amount, cost. One row per business event, plus foreign keys to dimensions. It is long and thin.</li>
<li><strong>Dimension table</strong> — the "by what" you slice: Product, Customer, Store, Date. Rich descriptive columns, short and wide.</li>
<li><strong>Grain</strong> — the meaning of one fact row (e.g. "one line item per receipt"). Declare the grain first; everything else follows.</li>
</ul>
<h3>Star vs snowflake</h3>
<pre><code>STAR: one central fact, dimensions one hop away (denormalized)

        Dim_Date    Dim_Product
             \        /
            [ Fact_Sales ]
             /        \
      Dim_Store    Dim_Customer

SNOWFLAKE: dimensions normalized into sub-tables
     Dim_Product -> Dim_Category -> Dim_Department
</code></pre>
<p>The <strong>star schema</strong> is simpler and faster to query (fewer joins); the <strong>snowflake</strong> saves space and enforces consistency but adds joins. BI usually favors the star. A <strong>surrogate key</strong> (a warehouse-generated integer) keys each dimension so it is independent of changing source IDs.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If you can add it up, it belongs in a <strong>fact</strong>; if you group or filter <em>by</em> it, it belongs in a <strong>dimension</strong>.</div>`,
    `<span class="eyebrow">ITB302c · Chương 3 · Bài 3.1</span>
<h2>Mô hình đa chiều (Kimball)</h2>
<p>Kho dữ liệu được mô hình theo kiểu <strong>đa chiều</strong>, không phải dạng chuẩn 3. Kimball chia thế giới thành hai loại bảng: <strong>fact</strong> (thứ bạn đo) và <strong>dimension</strong> (ngữ cảnh mô tả nó).</p>
<h3>Fact &amp; dimension</h3>
<ul>
<li><strong>Bảng fact</strong> — các con số để cộng: số lượng, thành tiền, chi phí. Mỗi dòng là một sự kiện kinh doanh, kèm khoá ngoại tới các dimension. Bảng dài và hẹp.</li>
<li><strong>Bảng dimension</strong> — cái "theo gì" để cắt lát: Sản phẩm, Khách hàng, Cửa hàng, Ngày. Nhiều cột mô tả, bảng ngắn và rộng.</li>
<li><strong>Grain (độ hạt)</strong> — nghĩa của một dòng fact (vd "một dòng hàng trên mỗi hoá đơn"). Khai grain trước; mọi thứ khác theo sau.</li>
</ul>
<h3>Star vs snowflake</h3>
<pre><code>STAR: một fact trung tâm, dimension cách một bước (phi chuẩn hoá)

        Dim_Date    Dim_Product
             \        /
            [ Fact_Sales ]
             /        \
      Dim_Store    Dim_Customer

SNOWFLAKE: dimension được chuẩn hoá thành bảng con
     Dim_Product -> Dim_Category -> Dim_Department
</code></pre>
<p><strong>Star schema</strong> đơn giản và truy vấn nhanh hơn (ít join); <strong>snowflake</strong> tiết kiệm dung lượng và ép nhất quán nhưng thêm join. BI thường chuộng star. Một <strong>khoá thay thế (surrogate key)</strong> — số nguyên do kho sinh — làm khoá cho mỗi dimension để độc lập với ID nguồn hay đổi.</p>
<div class="callout"><span class="badge">Mẹo nhớ</span> Cộng được thì thuộc <strong>fact</strong>; nhóm hoặc lọc <em>theo</em> nó thì thuộc <strong>dimension</strong>.</div>`,
  ]]);

const c3q = quiz('itb302c-quiz-3', 'Quiz 3 — Dimensional modeling|||Quiz 3 — Mô hình đa chiều', [
  { id: 'q1', question: 'Trong star schema, số lượng và thành tiền bán hàng nằm ở?|||In a star schema, sales quantity and amount live in?', options: ['Bảng dimension|||A dimension table', 'Bảng fact|||The fact table', 'Bảng staging|||The staging table', 'Khoá thay thế|||The surrogate key'], correctIndex: 1, explanation: 'Số đo cộng được (số lượng, thành tiền) nằm ở bảng fact; ngữ cảnh nằm ở dimension.' },
  { id: 'q2', question: 'Khác biệt chính giữa star và snowflake schema là?|||The main difference between star and snowflake is?', options: ['Star không có bảng fact|||Star has no fact table', 'Snowflake chuẩn hoá các dimension thành bảng con|||Snowflake normalizes dimensions into sub-tables', 'Star chỉ dùng cho OLTP|||Star is only for OLTP', 'Snowflake không cần khoá|||Snowflake needs no keys'], correctIndex: 1, explanation: 'Snowflake tách dimension thành bảng con chuẩn hoá (thêm join); star giữ dimension phẳng.' },
  { id: 'q3', question: '"Grain" của một bảng fact nghĩa là?|||The "grain" of a fact table means?', options: ['Kích thước tệp|||The file size', 'Ý nghĩa của một dòng fact|||What one fact row represents', 'Số cột dimension|||The number of dimension columns', 'Tốc độ nạp|||The load speed'], correctIndex: 1, explanation: 'Grain là mức chi tiết một dòng fact biểu diễn — phải khai trước khi thiết kế phần còn lại.' },
]);

const c4 = doc('itb302c-4-1-olap', '4.1 — OLAP & analytical queries|||4.1 — OLAP & truy vấn phân tích',
  'Khối OLAP (cube) và các chiều; thao tác roll-up, drill-down, slice, dice, pivot; MOLAP/ROLAP/HOLAP; ví dụ truy vấn doanh thu đa chiều.',
  [[
    `<span class="eyebrow">ITB302c · Chapter 4 · Lesson 4.1</span>
<h2>OLAP &amp; analytical queries</h2>
<p>Once data sits in a star schema you analyze it as a <strong>cube</strong> — a multidimensional view where each axis is a dimension (Product, Time, Region) and each cell is a measure (Sales). OLAP gives a small vocabulary of operations to move around that cube.</p>
<h3>Core OLAP operations</h3>
<ul>
<li><strong>Roll-up</strong> — aggregate up a hierarchy: day → month → quarter → year, or city → region → country.</li>
<li><strong>Drill-down</strong> — the reverse: go from year into quarters into months to find where a number came from.</li>
<li><strong>Slice</strong> — fix one dimension to one value: "only 2025" (a 2D slice of the cube).</li>
<li><strong>Dice</strong> — pick a sub-cube on several dimensions: "Electronics, North + South, Q1 + Q2".</li>
<li><strong>Pivot</strong> — rotate the axes to see the same data by a different pair of dimensions.</li>
</ul>
<h3>Example</h3>
<pre><code>Cube: Sales by [Product] x [Region] x [Time]

Roll-up:   monthly -> yearly total per region
Drill-down: 2025 total -> per-quarter -> per-month
Slice:     Region = "North"  (a 2D grid Product x Time)
Dice:      Product in {Phone, Laptop} AND Quarter in {Q1,Q2}
</code></pre>
<h3>How the cube is stored</h3>
<p><strong>MOLAP</strong> pre-computes and stores the cube (fast, more space); <strong>ROLAP</strong> queries the relational star live with SQL (flexible, scales); <strong>HOLAP</strong> mixes both. Power BI and Tableau give you these operations through clicks — expanding a hierarchy in a matrix visual is literally a drill-down.</p>
<div class="callout"><span class="badge">Why it feels fast</span> Aggregations are pre-thought-out along dimension hierarchies, so a manager can roll up to the country total and drill into one store in seconds, not write SQL each time.</div>`,
    `<span class="eyebrow">ITB302c · Chương 4 · Bài 4.1</span>
<h2>OLAP &amp; truy vấn phân tích</h2>
<p>Khi dữ liệu đã nằm trong star schema, bạn phân tích nó như một <strong>khối (cube)</strong> — góc nhìn đa chiều mà mỗi trục là một dimension (Sản phẩm, Thời gian, Vùng) và mỗi ô là một số đo (Doanh thu). OLAP cho một bộ từ vựng nhỏ để di chuyển quanh khối đó.</p>
<h3>Các thao tác OLAP cốt lõi</h3>
<ul>
<li><strong>Roll-up</strong> — tổng hợp lên theo phân cấp: ngày → tháng → quý → năm, hoặc thành phố → vùng → quốc gia.</li>
<li><strong>Drill-down</strong> — chiều ngược lại: đi từ năm vào quý vào tháng để tìm con số đến từ đâu.</li>
<li><strong>Slice (cắt lát)</strong> — cố định một chiều về một giá trị: "chỉ 2025" (một lát 2D của khối).</li>
<li><strong>Dice (cắt khối)</strong> — chọn một khối con trên nhiều chiều: "Điện tử, Bắc + Nam, Q1 + Q2".</li>
<li><strong>Pivot (xoay)</strong> — xoay trục để thấy cùng dữ liệu theo một cặp chiều khác.</li>
</ul>
<h3>Ví dụ</h3>
<pre><code>Khối: Doanh thu theo [Sản phẩm] x [Vùng] x [Thời gian]

Roll-up:    tháng -> tổng năm theo từng vùng
Drill-down: tổng 2025 -> theo quý -> theo tháng
Slice:      Vùng = "Bắc"  (lưới 2D Sản phẩm x Thời gian)
Dice:       Sản phẩm in {Điện thoại, Laptop} VÀ Quý in {Q1,Q2}
</code></pre>
<h3>Khối được lưu thế nào</h3>
<p><strong>MOLAP</strong> tính trước và lưu khối (nhanh, tốn dung lượng); <strong>ROLAP</strong> truy vấn thẳng star quan hệ bằng SQL (linh hoạt, mở rộng tốt); <strong>HOLAP</strong> pha trộn cả hai. Power BI và Tableau cho bạn các thao tác này qua thao tác chuột — mở rộng một phân cấp trong visual ma trận chính là drill-down.</p>
<div class="callout"><span class="badge">Vì sao thấy nhanh</span> Các phép tổng hợp được nghĩ sẵn dọc theo phân cấp chiều, nên quản lý có thể roll-up lên tổng quốc gia rồi drill vào một cửa hàng trong vài giây, không phải viết SQL mỗi lần.</div>`,
  ]]);

const c4q = quiz('itb302c-quiz-4', 'Quiz 4 — OLAP|||Quiz 4 — OLAP', [
  { id: 'q1', question: 'Đi từ tổng doanh thu năm xuống chi tiết theo quý rồi theo tháng là thao tác?|||Going from a yearly total down to quarters then months is?', options: ['Roll-up', 'Drill-down', 'Slice', 'Pivot'], correctIndex: 1, explanation: 'Drill-down đi từ mức tổng hợp cao xuống mức chi tiết hơn theo phân cấp chiều.' },
  { id: 'q2', question: 'Cố định chiều Thời gian về đúng năm 2025 để xem lưới Sản phẩm x Vùng là?|||Fixing Time to just 2025 to see a Product x Region grid is?', options: ['Slice (cắt lát)|||Slice', 'Roll-up', 'Drill-down', 'Dice trên 3 chiều|||Dice on three dimensions'], correctIndex: 0, explanation: 'Slice cố định MỘT chiều về một giá trị, tạo một lát 2D của khối.' },
  { id: 'q3', question: 'Cách lưu khối tính trước toàn bộ tổng hợp, đọc rất nhanh nhưng tốn dung lượng là?|||The storage that pre-computes all aggregates for fast reads is?', options: ['ROLAP', 'MOLAP', 'OLTP', 'ETL'], correctIndex: 1, explanation: 'MOLAP tính và lưu sẵn khối đa chiều; ROLAP truy vấn thẳng star quan hệ bằng SQL.' },
]);

const c5 = doc('itb302c-5-1-reporting-dashboards', '5.1 — Reporting, KPIs & dashboards|||5.1 — Báo cáo, KPI & dashboard',
  'Báo cáo vận hành vs phân tích; chỉ số KPI và metric; nguyên tắc thiết kế dashboard (đối tượng, bố cục, ngữ cảnh); BI tự phục vụ (self-service).',
  [[
    `<span class="eyebrow">ITB302c · Chapter 5 · Lesson 5.1</span>
<h2>Reporting, KPIs &amp; dashboards</h2>
<p>Analysis is worthless if nobody reads it. This chapter is about the <strong>delivery layer</strong>: reports, KPIs and dashboards that turn a cube into a decision.</p>
<h3>Reports vs dashboards</h3>
<ul>
<li><strong>Report</strong> — detailed, often tabular, answers a defined question (monthly sales by product). Good for records and drill-through.</li>
<li><strong>Dashboard</strong> — a single screen of the most important measures, updated live, scannable in seconds. Good for monitoring.</li>
</ul>
<h3>KPIs vs metrics</h3>
<p>A <strong>metric</strong> is any number (page views). A <strong>KPI (Key Performance Indicator)</strong> is a metric tied to a target and a goal — revenue vs quota, on-time delivery rate, churn. A good KPI has a value, a target, and a trend.</p>
<h3>Dashboard design principles</h3>
<ul>
<li><strong>Know the audience</strong> — an executive wants 5 KPIs; an analyst wants filters and detail.</li>
<li><strong>Most important, top-left</strong> — people read there first.</li>
<li><strong>Give context</strong> — a number alone lies; show target, prior period, or benchmark.</li>
<li><strong>Reduce noise</strong> — no 3D pie charts, no rainbow colors; let the data speak.</li>
</ul>
<h3>Self-service BI</h3>
<p><strong>Self-service BI</strong> lets business users build their own reports on a governed dataset — IT curates a trusted model, users explore without writing SQL. It scales analytics beyond the BI team, as long as the underlying data is governed (Chapter 8).</p>
<div class="callout"><span class="badge">One dashboard, one question</span> The best dashboards answer a specific decision ("are we on track this quarter?"), not "everything about the business". Design backward from the decision.</div>`,
    `<span class="eyebrow">ITB302c · Chương 5 · Bài 5.1</span>
<h2>Báo cáo, KPI &amp; dashboard</h2>
<p>Phân tích vô giá trị nếu không ai đọc. Chương này nói về <strong>tầng phân phối</strong>: báo cáo, KPI và dashboard biến một khối dữ liệu thành một quyết định.</p>
<h3>Báo cáo vs dashboard</h3>
<ul>
<li><strong>Báo cáo (report)</strong> — chi tiết, thường dạng bảng, trả lời một câu hỏi định sẵn (doanh thu tháng theo sản phẩm). Hợp cho lưu vết và drill-through.</li>
<li><strong>Dashboard</strong> — một màn hình các số đo quan trọng nhất, cập nhật trực tiếp, đọc lướt trong vài giây. Hợp cho giám sát.</li>
</ul>
<h3>KPI vs metric</h3>
<p>Một <strong>metric</strong> là con số bất kỳ (lượt xem). Một <strong>KPI (chỉ số hiệu suất chính)</strong> là metric gắn với một chỉ tiêu và một mục tiêu — doanh thu vs hạn mức, tỷ lệ giao đúng hạn, tỷ lệ rời bỏ. KPI tốt có giá trị, chỉ tiêu và xu hướng.</p>
<h3>Nguyên tắc thiết kế dashboard</h3>
<ul>
<li><strong>Hiểu người xem</strong> — lãnh đạo muốn 5 KPI; nhà phân tích muốn bộ lọc và chi tiết.</li>
<li><strong>Quan trọng nhất, góc trên-trái</strong> — người ta đọc ở đó trước.</li>
<li><strong>Cho ngữ cảnh</strong> — một con số trơ trọi dễ đánh lừa; hãy thêm chỉ tiêu, kỳ trước, hoặc mốc so.</li>
<li><strong>Giảm nhiễu</strong> — không biểu đồ tròn 3D, không màu cầu vồng; để dữ liệu tự nói.</li>
</ul>
<h3>BI tự phục vụ</h3>
<p><strong>BI tự phục vụ (self-service)</strong> cho người dùng nghiệp vụ tự dựng báo cáo trên một tập dữ liệu đã quản trị — IT chuẩn bị mô hình đáng tin, người dùng khám phá mà không cần viết SQL. Nó mở rộng phân tích ra ngoài đội BI, miễn là dữ liệu nền được quản trị (Chương 8).</p>
<div class="callout"><span class="badge">Một dashboard, một câu hỏi</span> Dashboard tốt trả lời một quyết định cụ thể ("quý này có đúng tiến độ không?"), không phải "mọi thứ về doanh nghiệp". Thiết kế ngược từ quyết định.</div>`,
  ]]);

const c5q = quiz('itb302c-quiz-5', 'Quiz 5 — Reporting & dashboards|||Quiz 5 — Báo cáo & dashboard', [
  { id: 'q1', question: 'Điều gì biến một metric thông thường thành một KPI?|||What turns an ordinary metric into a KPI?', options: ['Nó là số lớn hơn|||It is a bigger number', 'Nó được gắn với một chỉ tiêu và mục tiêu|||It is tied to a target and a goal', 'Nó có màu đỏ|||It is colored red', 'Nó nằm trong bảng|||It is in a table'], correctIndex: 1, explanation: 'KPI là metric gắn với chỉ tiêu và mục tiêu — có giá trị, target và xu hướng.' },
  { id: 'q2', question: 'Nguyên tắc bố cục dashboard nào sau đây đúng?|||Which dashboard layout principle is correct?', options: ['Đặt thông tin quan trọng nhất ở góc trên-trái|||Put the most important info top-left', 'Dùng nhiều biểu đồ tròn 3D|||Use many 3D pie charts', 'Càng nhiều màu càng tốt|||More colors is better', 'Giấu chỉ tiêu để đỡ rối|||Hide targets to reduce clutter'], correctIndex: 0, explanation: 'Người xem đọc góc trên-trái trước; đặt KPI quan trọng nhất ở đó, giảm nhiễu, luôn cho ngữ cảnh.' },
  { id: 'q3', question: 'BI tự phục vụ (self-service) chủ yếu nhằm?|||Self-service BI mainly aims to?', options: ['Cho người dùng nghiệp vụ tự dựng báo cáo trên dữ liệu đã quản trị|||Let business users build reports on governed data', 'Thay thế kho dữ liệu|||Replace the data warehouse', 'Loại bỏ mọi biểu đồ|||Remove all charts', 'Chỉ dành cho lập trình viên SQL|||Be for SQL developers only'], correctIndex: 0, explanation: 'Self-service BI cho người dùng khám phá và dựng báo cáo trên mô hình đã quản trị, không cần viết SQL.' },
]);

const c6 = doc('itb302c-6-1-visualization-powerbi', '6.1 — Visualization, Power BI & Tableau|||6.1 — Trực quan hoá, Power BI & Tableau',
  'Nguyên tắc trực quan hoá (chọn biểu đồ đúng loại dữ liệu); quy trình dựng dashboard trong Power BI/Tableau; DAX cơ bản (measure, calculated column).',
  [[
    `<span class="eyebrow">ITB302c · Chapter 6 · Lesson 6.1</span>
<h2>Data visualization with Power BI &amp; Tableau</h2>
<p>Choosing the right chart is half of BI. The chart must match the <strong>question</strong> and the data type.</p>
<h3>Choosing a chart</h3>
<ul>
<li><strong>Comparison across categories</strong> → bar / column chart.</li>
<li><strong>Trend over time</strong> → line chart.</li>
<li><strong>Part-to-whole</strong> → stacked bar or treemap (a pie only for 2–3 slices).</li>
<li><strong>Relationship</strong> → scatter plot.</li>
<li><strong>Geography</strong> → map.</li>
</ul>
<h3>Building a dashboard (Power BI / Tableau)</h3>
<pre><code>1. Connect to the source (warehouse, SQL, Excel)
2. Model: relate fact to dimensions (star schema)
3. Create measures (DAX / calculated fields)
4. Drop visuals: KPI cards, trend line, bar by region
5. Add slicers/filters (Year, Product)
6. Publish &amp; share (Power BI Service / Tableau Server)
</code></pre>
<h3>Basic DAX</h3>
<p><strong>DAX (Data Analysis Expressions)</strong> is Power BI's formula language. A <strong>measure</strong> is computed at query time over the current filter context:</p>
<pre><code>Total Sales = SUM(Sales[Amount])
Sales YTD  = TOTALYTD([Total Sales], Dates[Date])
Growth %   = DIVIDE([Total Sales] - [Sales LY], [Sales LY])
</code></pre>
<p>A <strong>calculated column</strong> is computed row by row and stored; a <strong>measure</strong> is computed on the fly and respects whatever the user filters — prefer measures for aggregations.</p>
<div class="callout"><span class="badge">Power BI vs Tableau</span> Both do warehousing-to-dashboard. Power BI is tightly integrated with the Microsoft stack and uses DAX; Tableau is known for fast visual exploration. The concepts — model, measure, filter, publish — carry across both.</div>`,
    `<span class="eyebrow">ITB302c · Chương 6 · Bài 6.1</span>
<h2>Trực quan hoá dữ liệu với Power BI &amp; Tableau</h2>
<p>Chọn đúng biểu đồ là một nửa của BI. Biểu đồ phải khớp với <strong>câu hỏi</strong> và loại dữ liệu.</p>
<h3>Chọn biểu đồ</h3>
<ul>
<li><strong>So sánh giữa các nhóm</strong> → biểu đồ cột / thanh.</li>
<li><strong>Xu hướng theo thời gian</strong> → biểu đồ đường.</li>
<li><strong>Phần trên tổng</strong> → cột chồng hoặc treemap (biểu đồ tròn chỉ cho 2–3 phần).</li>
<li><strong>Quan hệ</strong> → biểu đồ phân tán (scatter).</li>
<li><strong>Địa lý</strong> → bản đồ.</li>
</ul>
<h3>Dựng dashboard (Power BI / Tableau)</h3>
<pre><code>1. Kết nối nguồn (kho dữ liệu, SQL, Excel)
2. Mô hình: nối fact với dimension (star schema)
3. Tạo measure (DAX / calculated field)
4. Kéo visual: thẻ KPI, đường xu hướng, cột theo vùng
5. Thêm slicer/bộ lọc (Năm, Sản phẩm)
6. Xuất bản &amp; chia sẻ (Power BI Service / Tableau Server)
</code></pre>
<h3>DAX cơ bản</h3>
<p><strong>DAX (Data Analysis Expressions)</strong> là ngôn ngữ công thức của Power BI. Một <strong>measure</strong> được tính lúc truy vấn theo ngữ cảnh lọc hiện tại:</p>
<pre><code>Total Sales = SUM(Sales[Amount])
Sales YTD  = TOTALYTD([Total Sales], Dates[Date])
Growth %   = DIVIDE([Total Sales] - [Sales LY], [Sales LY])
</code></pre>
<p>Một <strong>calculated column</strong> tính theo từng dòng và lưu lại; một <strong>measure</strong> tính tức thời và tôn trọng bộ lọc người dùng chọn — nên dùng measure cho các phép tổng hợp.</p>
<div class="callout"><span class="badge">Power BI vs Tableau</span> Cả hai đều đi từ kho dữ liệu tới dashboard. Power BI tích hợp chặt với hệ Microsoft và dùng DAX; Tableau nổi tiếng khám phá trực quan nhanh. Các khái niệm — mô hình, measure, lọc, xuất bản — dùng chung cho cả hai.</div>`,
  ]]);

const c6q = quiz('itb302c-quiz-6', 'Quiz 6 — Visualization & Power BI|||Quiz 6 — Trực quan hoá & Power BI', [
  { id: 'q1', question: 'Để thể hiện xu hướng doanh thu qua 12 tháng, biểu đồ hợp nhất là?|||To show a revenue trend over 12 months, the best chart is?', options: ['Biểu đồ tròn|||Pie chart', 'Biểu đồ đường|||Line chart', 'Bản đồ|||Map', 'Biểu đồ phân tán|||Scatter plot'], correctIndex: 1, explanation: 'Xu hướng theo thời gian dùng biểu đồ đường; biểu đồ tròn không thể hiện được thay đổi theo thời gian.' },
  { id: 'q2', question: 'Trong Power BI, một "measure" DAX khác "calculated column" ở chỗ?|||A DAX measure differs from a calculated column in that?', options: ['Measure tính tức thời theo ngữ cảnh lọc hiện tại|||A measure computes on the fly under the current filter context', 'Measure luôn được lưu sẵn từng dòng|||A measure is always stored row by row', 'Calculated column không thể tính toán|||A calculated column cannot compute', 'Cả hai giống hệt nhau|||They are identical'], correctIndex: 0, explanation: 'Measure tính lúc truy vấn theo bộ lọc hiện tại; calculated column tính và lưu theo từng dòng.' },
  { id: 'q3', question: 'Công thức DAX nào tính tổng doanh thu?|||Which DAX formula totals sales?', options: ['Total Sales = COUNT(Sales)|||Total Sales = COUNT(Sales)', 'Total Sales = SUM(Sales[Amount])|||Total Sales = SUM(Sales[Amount])', 'Total Sales = Sales[Amount]|||Total Sales = Sales[Amount]', 'Total Sales = MAX(Date)|||Total Sales = MAX(Date)'], correctIndex: 1, explanation: 'SUM(Sales[Amount]) cộng cột thành tiền theo ngữ cảnh lọc; đó là measure tổng doanh thu.' },
]);

const c7 = doc('itb302c-7-1-advanced-analytics', '7.1 — Advanced analytics|||7.1 — Phân tích nâng cao',
  'Bốn cấp phân tích: descriptive, diagnostic, predictive, prescriptive; data mining trong BI (phân lớp, phân cụm, luật kết hợp); tổng quan machine learning trong BI.',
  [[
    `<span class="eyebrow">ITB302c · Chapter 7 · Lesson 7.1</span>
<h2>Advanced analytics</h2>
<p>Classic BI is mostly <em>looking back</em>. Advanced analytics asks harder questions — why, what next, what should we do — moving up the analytics maturity ladder.</p>
<h3>The four levels of analytics</h3>
<ul>
<li><strong>Descriptive</strong> — what happened? (reports, dashboards, roll-ups). The core of BI.</li>
<li><strong>Diagnostic</strong> — why did it happen? (drill-down, correlation).</li>
<li><strong>Predictive</strong> — what is likely to happen? (forecasting, classification — e.g. which customers will churn).</li>
<li><strong>Prescriptive</strong> — what should we do? (optimization, recommendations).</li>
</ul>
<h3>Data mining inside BI</h3>
<p>BI increasingly embeds <strong>data mining</strong> on top of the warehouse:</p>
<ul>
<li><strong>Classification</strong> — predict a label: will this loan default? (decision tree, logistic regression).</li>
<li><strong>Clustering</strong> — group customers by behavior for segmentation (k-means).</li>
<li><strong>Association rules</strong> — market-basket analysis: people who buy bread also buy milk (Apriori).</li>
<li><strong>Forecasting</strong> — project next quarter sales from history (time-series models).</li>
</ul>
<h3>Example</h3>
<p>A telecom feeds its warehouse into a churn model: the dashboard no longer just shows last month's churn (descriptive) — it flags <em>which</em> customers are likely to leave next month (predictive) and suggests a retention offer (prescriptive). BI and machine learning meet on the same governed data.</p>
<div class="callout"><span class="badge">Same data, deeper questions</span> Predictive and prescriptive analytics do not replace dashboards — they sit on the same warehouse and answer the questions a chart cannot: what next, and what to do about it.</div>`,
    `<span class="eyebrow">ITB302c · Chương 7 · Bài 7.1</span>
<h2>Phân tích nâng cao</h2>
<p>BI cổ điển chủ yếu <em>nhìn lại</em>. Phân tích nâng cao hỏi những câu khó hơn — vì sao, tiếp theo là gì, nên làm gì — leo lên thang trưởng thành phân tích.</p>
<h3>Bốn cấp độ phân tích</h3>
<ul>
<li><strong>Mô tả (descriptive)</strong> — chuyện gì đã xảy ra? (báo cáo, dashboard, roll-up). Lõi của BI.</li>
<li><strong>Chẩn đoán (diagnostic)</strong> — vì sao xảy ra? (drill-down, tương quan).</li>
<li><strong>Dự đoán (predictive)</strong> — khả năng gì sẽ xảy ra? (dự báo, phân lớp — vd khách nào sẽ rời bỏ).</li>
<li><strong>Đề xuất (prescriptive)</strong> — nên làm gì? (tối ưu hoá, khuyến nghị).</li>
</ul>
<h3>Data mining trong BI</h3>
<p>BI ngày càng nhúng <strong>khai phá dữ liệu (data mining)</strong> trên nền kho:</p>
<ul>
<li><strong>Phân lớp</strong> — dự đoán một nhãn: khoản vay này có vỡ nợ không? (cây quyết định, hồi quy logistic).</li>
<li><strong>Phân cụm</strong> — nhóm khách theo hành vi để phân khúc (k-means).</li>
<li><strong>Luật kết hợp</strong> — phân tích giỏ hàng: người mua bánh mì cũng mua sữa (Apriori).</li>
<li><strong>Dự báo</strong> — chiếu doanh thu quý tới từ lịch sử (mô hình chuỗi thời gian).</li>
</ul>
<h3>Ví dụ</h3>
<p>Một nhà mạng đưa kho dữ liệu vào mô hình rời bỏ: dashboard không chỉ còn hiện tỷ lệ rời bỏ tháng trước (mô tả) — nó chỉ ra <em>khách nào</em> có khả năng rời tháng sau (dự đoán) và gợi ý ưu đãi giữ chân (đề xuất). BI và học máy gặp nhau trên cùng dữ liệu đã quản trị.</p>
<div class="callout"><span class="badge">Cùng dữ liệu, câu hỏi sâu hơn</span> Phân tích dự đoán và đề xuất không thay thế dashboard — chúng đặt trên cùng kho dữ liệu và trả lời điều biểu đồ không trả được: tiếp theo là gì và nên làm gì.</div>`,
  ]]);

const c7q = quiz('itb302c-quiz-7', 'Quiz 7 — Advanced analytics|||Quiz 7 — Phân tích nâng cao', [
  { id: 'q1', question: 'Câu hỏi "khách hàng nào có khả năng rời bỏ tháng sau?" thuộc cấp phân tích nào?|||"Which customers are likely to churn next month?" is which analytics level?', options: ['Mô tả (descriptive)|||Descriptive', 'Dự đoán (predictive)|||Predictive', 'Chẩn đoán (diagnostic)|||Diagnostic', 'Không phải phân tích|||Not analytics'], correctIndex: 1, explanation: 'Dự báo điều sắp xảy ra là phân tích dự đoán (predictive); mô tả chỉ nói chuyện đã xảy ra.' },
  { id: 'q2', question: 'Kỹ thuật data mining nào phù hợp phân tích giỏ hàng (mua bánh mì thì mua sữa)?|||Which data mining technique fits market-basket analysis?', options: ['Phân cụm|||Clustering', 'Luật kết hợp (Apriori)|||Association rules (Apriori)', 'Hồi quy tuyến tính|||Linear regression', 'Chuẩn hoá|||Normalization'], correctIndex: 1, explanation: 'Luật kết hợp (Apriori) tìm các mặt hàng hay mua cùng nhau — phân tích giỏ hàng.' },
  { id: 'q3', question: 'Cấp phân tích cao nhất, trả lời "nên làm gì", là?|||The highest level, answering "what should we do", is?', options: ['Descriptive (mô tả)|||Descriptive', 'Diagnostic (chẩn đoán)|||Diagnostic', 'Prescriptive (đề xuất)|||Prescriptive', 'Predictive (dự đoán)|||Predictive'], correctIndex: 2, explanation: 'Prescriptive (đề xuất) dùng tối ưu hoá và khuyến nghị để nói nên hành động thế nào.' },
]);

const c8 = doc('itb302c-8-1-deployment-governance', '8.1 — BI deployment & governance|||8.1 — Triển khai & quản trị BI',
  'Chiến lược BI và các bước triển khai; quản trị dữ liệu (data governance, chất lượng, chủ quản); big data & cloud BI (data lake, lakehouse); đạo đức và bảo mật dữ liệu.',
  [[
    `<span class="eyebrow">ITB302c · Chapter 8 · Lesson 8.1</span>
<h2>BI deployment &amp; governance</h2>
<p>A BI project succeeds or fails on people and process, not just tools. This chapter covers rolling BI out and keeping it trustworthy.</p>
<h3>BI strategy &amp; rollout</h3>
<ul>
<li><strong>Align to business goals</strong> — start from the decisions leaders need, not the data you happen to have.</li>
<li><strong>Executive sponsorship</strong> — BI touches every department; it needs authority behind it.</li>
<li><strong>Iterate</strong> — deliver one high-value dashboard, earn trust, expand. Big-bang BI projects usually fail.</li>
</ul>
<h3>Data governance</h3>
<p><strong>Data governance</strong> is the rules and roles that keep data trustworthy: <strong>data quality</strong> (accurate, complete, consistent), <strong>a single source of truth</strong> (one agreed definition of "revenue"), <strong>data stewards/owners</strong> accountable for each domain, and <strong>security</strong> (who can see what — row-level security in Power BI). Without it, two dashboards show two different numbers and everyone stops trusting BI.</p>
<h3>Big data &amp; cloud BI</h3>
<pre><code>Data warehouse  -> structured, schema-on-write (classic BI)
Data lake       -> raw, any format, schema-on-read (big data)
Lakehouse       -> lake + warehouse features combined
Cloud BI        -> Azure Synapse, Snowflake, BigQuery, Power BI Service
</code></pre>
<p>Modern BI often runs in the <strong>cloud</strong>, scaling storage and compute on demand and blending structured warehouse data with semi-structured big data.</p>
<h3>Data ethics</h3>
<p>BI works with real people's data. <strong>Privacy</strong> (collect only what you need, comply with law), <strong>consent</strong>, and <strong>fairness</strong> (a model trained on biased history can discriminate) are part of the job, not an afterthought.</p>
<div class="callout"><span class="badge">Trust is the product</span> The value of BI is a number people <em>act on</em>. Governance, security and ethics are what make that number safe to trust — the last mile, not the fine print.</div>`,
    `<span class="eyebrow">ITB302c · Chương 8 · Bài 8.1</span>
<h2>Triển khai &amp; quản trị BI</h2>
<p>Một dự án BI thành hay bại nằm ở con người và quy trình, không chỉ công cụ. Chương này bàn việc đưa BI ra thực tế và giữ nó đáng tin.</p>
<h3>Chiến lược &amp; triển khai BI</h3>
<ul>
<li><strong>Bám mục tiêu kinh doanh</strong> — bắt đầu từ quyết định lãnh đạo cần, không phải từ dữ liệu tình cờ có.</li>
<li><strong>Có lãnh đạo bảo trợ</strong> — BI chạm mọi phòng ban; cần quyền lực đứng sau.</li>
<li><strong>Làm lặp</strong> — giao một dashboard giá trị cao, tạo niềm tin, rồi mở rộng. Dự án BI kiểu "nổ lớn một lần" thường thất bại.</li>
</ul>
<h3>Quản trị dữ liệu</h3>
<p><strong>Quản trị dữ liệu (data governance)</strong> là các luật và vai trò giữ dữ liệu đáng tin: <strong>chất lượng dữ liệu</strong> (chính xác, đầy đủ, nhất quán), <strong>một nguồn sự thật duy nhất</strong> (một định nghĩa thống nhất cho "doanh thu"), <strong>người chủ quản dữ liệu (data steward/owner)</strong> chịu trách nhiệm từng lĩnh vực, và <strong>bảo mật</strong> (ai thấy gì — bảo mật mức dòng trong Power BI). Thiếu nó, hai dashboard hiện hai con số khác nhau và ai cũng ngừng tin BI.</p>
<h3>Big data &amp; cloud BI</h3>
<pre><code>Kho dữ liệu   -> có cấu trúc, schema-on-write (BI cổ điển)
Data lake     -> thô, mọi định dạng, schema-on-read (big data)
Lakehouse     -> kết hợp tính năng lake + kho
Cloud BI      -> Azure Synapse, Snowflake, BigQuery, Power BI Service
</code></pre>
<p>BI hiện đại thường chạy trên <strong>đám mây</strong>, mở rộng lưu trữ và tính toán theo nhu cầu và trộn dữ liệu kho có cấu trúc với big data bán cấu trúc.</p>
<h3>Đạo đức dữ liệu</h3>
<p>BI làm việc với dữ liệu của người thật. <strong>Quyền riêng tư</strong> (chỉ thu thập thứ cần, tuân thủ luật), <strong>sự đồng thuận</strong>, và <strong>công bằng</strong> (mô hình học từ lịch sử thiên lệch có thể phân biệt đối xử) là một phần của công việc, không phải chuyện thêm sau.</p>
<div class="callout"><span class="badge">Niềm tin là sản phẩm</span> Giá trị của BI là một con số người ta <em>dám hành động theo</em>. Quản trị, bảo mật và đạo đức là thứ khiến con số đó an toàn để tin — chặng cuối, không phải dòng chữ nhỏ.</div>`,
  ]]);

const c8q = quiz('itb302c-quiz-8', 'Quiz 8 — Deployment & governance|||Quiz 8 — Triển khai & quản trị', [
  { id: 'q1', question: 'Mục tiêu chính của data governance là?|||The main goal of data governance is?', options: ['Tăng dung lượng lưu trữ|||Increase storage capacity', 'Giữ dữ liệu đáng tin: chất lượng, một nguồn sự thật, bảo mật|||Keep data trustworthy: quality, one source of truth, security', 'Vẽ nhiều biểu đồ hơn|||Draw more charts', 'Tăng tốc ETL|||Speed up ETL'], correctIndex: 1, explanation: 'Governance đặt luật và vai trò để dữ liệu chính xác, nhất quán, một nguồn sự thật, có bảo mật.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa data warehouse và data lake là?|||The core difference between a warehouse and a data lake is?', options: ['Lake chỉ chứa được số|||A lake stores only numbers', 'Warehouse có cấu trúc schema-on-write; lake lưu dữ liệu thô schema-on-read|||Warehouse is structured schema-on-write; a lake stores raw data schema-on-read', 'Warehouse không giữ lịch sử|||A warehouse keeps no history', 'Lake không lưu được file|||A lake cannot store files'], correctIndex: 1, explanation: 'Kho dữ liệu áp cấu trúc lúc ghi; data lake giữ dữ liệu thô mọi định dạng, áp lược đồ lúc đọc.' },
  { id: 'q3', question: 'Rủi ro đạo đức khi mô hình BI học từ dữ liệu lịch sử thiên lệch là?|||The ethical risk of BI models learning from biased history is?', options: ['Chạy chậm hơn|||It runs slower', 'Mô hình lặp lại và khuếch đại thiên lệch, phân biệt đối xử|||The model repeats and amplifies bias, discriminating', 'Tốn thêm dung lượng|||It uses more storage', 'Mất khoá thay thế|||It loses surrogate keys'], correctIndex: 1, explanation: 'Học từ lịch sử thiên lệch khiến mô hình tái tạo bất công đó — công bằng là một phần của quản trị.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ITB302c',
    slug: 'itb302c-business-intelligence-bi',
    title: 'Business Intelligence (BI)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ITB302c.webp',
    shortDescription: 'BI from data to decisions — BI architecture, data warehouse (OLTP vs OLAP, ETL), dimensional modeling (star/snowflake, Kimball), OLAP (roll-up, drill-down, slice/dice), KPI dashboards, Power BI/Tableau & DAX, advanced analytics & governance.|||BI từ dữ liệu tới quyết định — kiến trúc BI, kho dữ liệu (OLTP vs OLAP, ETL), mô hình đa chiều (star/snowflake, Kimball), OLAP (roll-up, drill-down, slice/dice), dashboard KPI, Power BI/Tableau & DAX, phân tích nâng cao & quản trị.',
    description: 'Môn <strong>ITB302c — Business Intelligence (BI) (Trí tuệ kinh doanh)</strong> thuộc ngành Hệ thống thông tin, kỳ 7. Từ <strong>BI là gì &amp; kiến trúc BI</strong> → <strong>kho dữ liệu</strong> (OLTP vs OLAP, ETL, data mart) → <strong>mô hình đa chiều</strong> (fact/dimension, star/snowflake, Kimball) → <strong>OLAP</strong> (roll-up, drill-down, slice/dice, cube) → <strong>báo cáo &amp; dashboard KPI</strong> (self-service BI) → <strong>trực quan hoá</strong> (Power BI/Tableau, DAX cơ bản) → <strong>phân tích nâng cao</strong> (descriptive/predictive/prescriptive, data mining) → <strong>triển khai &amp; quản trị</strong> (data governance, cloud BI, đạo đức). Bám giáo trình chuẩn Sharda và Kimball, song ngữ, có ví dụ doanh nghiệp và công cụ thật, quiz mỗi chương.',
    whatYouLearn: 'BI và kiến trúc BI; kho dữ liệu (OLTP vs OLAP, ETL/ELT, data mart, staging); mô hình đa chiều (fact/dimension, grain, star/snowflake, surrogate key); OLAP (cube, roll-up/drill-down/slice/dice, MOLAP/ROLAP); báo cáo, KPI và thiết kế dashboard; BI tự phục vụ; trực quan hoá và chọn biểu đồ; Power BI/Tableau và DAX cơ bản (measure, calculated column); bốn cấp phân tích (mô tả/chẩn đoán/dự đoán/đề xuất) và data mining trong BI; chiến lược triển khai, data governance, big data/cloud BI (data lake, lakehouse) và đạo đức dữ liệu.',
    requirements: 'Biết cơ sở dữ liệu quan hệ và SQL cơ bản (SELECT, JOIN, GROUP BY). Nên cài Power BI Desktop hoặc Tableau Public (đều miễn phí) để thực hành dựng dashboard.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Sharda & Kimball, tài liệu Power BI/Tableau, dataset, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'BI là gì, dữ liệu tới quyết định, kiến trúc BI.', lessons: [intro] },
    { title: 'Chương 1 — BI là gì|||Chapter 1 — What is BI', description: 'Định nghĩa BI, thang dữ liệu-quyết định, kiến trúc BI.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kho dữ liệu|||Chapter 2 — Data warehousing', description: 'Data warehouse, OLTP vs OLAP, ETL, data mart.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mô hình đa chiều|||Chapter 3 — Dimensional modeling', description: 'Fact/dimension, star/snowflake, grain, Kimball.', lessons: [c3, c3q] },
    { title: 'Chương 4 — OLAP|||Chapter 4 — OLAP', description: 'Cube, roll-up/drill-down/slice/dice, MOLAP/ROLAP.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Báo cáo & dashboard|||Chapter 5 — Reporting & dashboards', description: 'KPI, thiết kế dashboard, self-service BI.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Trực quan hoá & Power BI|||Chapter 6 — Visualization & Power BI', description: 'Chọn biểu đồ, dựng dashboard, DAX cơ bản.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phân tích nâng cao|||Chapter 7 — Advanced analytics', description: 'Descriptive/predictive/prescriptive, data mining trong BI.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Triển khai & quản trị|||Chapter 8 — Deployment & governance', description: 'BI strategy, data governance, cloud BI, đạo đức dữ liệu.', lessons: [c8, c8q] },
  ],
};
