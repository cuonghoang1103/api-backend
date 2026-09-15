/**
 * IVM301 — Inventory Management. Khối Quản trị Kinh doanh (BBA), FPTU, kỳ 4.
 * Giáo trình tham khảo (trích dẫn, không upload PDF): Silver "Inventory and
 * Production Management"; Chopra/Meindl "Supply Chain Management"; Heizer/
 * Render "Operations Management". 8 chương: tổng quan & vai trò → phân loại
 * & ABC → chi phí & EOQ → ROP/tồn kho an toàn/mức phục vụ → hệ thống kiểm
 * soát Q/P/min-max → nhu cầu biến động & MRP → Lean/JIT & chuỗi cung ứng →
 * công nghệ (WMS/RFID) & đo lường. Song ngữ + ví dụ (giả định) + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ivm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IVM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Inventory Management — classification, costs, EOQ, reorder point, control systems, MRP, Lean/JIT and warehouse technology — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources for extra reading.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IVM301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Inventory+and+Production+Management+in+Supply+Chains%2C+4th+Edition-p-9781466558618" target="_blank" rel="noopener">Silver, Pyke &amp; Thomas — <em>Inventory and Production Management in Supply Chains</em></a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/supply-chain-management-strategy-planning-and-operation/P200000006331" target="_blank" rel="noopener">Chopra &amp; Meindl — <em>Supply Chain Management: Strategy, Planning, and Operation</em></a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/operations-management/P200000006256" target="_blank" rel="noopener">Heizer, Render &amp; Munson — <em>Operations Management: Sustainability and Supply Chain Management</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.apics.org/" target="_blank" rel="noopener">ASCM/APICS — CPIM body of knowledge (inventory &amp; materials management)</a></li>
<li><a href="https://www.investopedia.com/terms/i/inventory-management.asp" target="_blank" rel="noopener">Investopedia — Inventory management overview</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics</a> — supply chain &amp; inventory lectures</li>
<li><a href="https://www.youtube.com/@ASCMglobal" target="_blank" rel="noopener">ASCM (Association for Supply Chain Management)</a> — inventory &amp; operations explainers</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Spreadsheet (Excel/Google Sheets) — build EOQ, ROP and ABC calculators yourself; this is what most exams expect.</li>
<li><a href="https://www.investopedia.com/terms/e/economicorderquantity.asp" target="_blank" rel="noopener">Investopedia — EOQ calculator &amp; explanation</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — roles &amp; functions of inventory, ABC classification, cost categories, EOQ.</li>
<li><strong>Practice</strong> — solve EOQ, ROP and safety-stock problems by hand with a spreadsheet until the numbers match a checked answer.</li>
<li><strong>Go deeper</strong> — Q/P/min-max control systems, MRP logic, Lean/JIT and the bullwhip effect.</li>
<li><strong>Job-ready</strong> — read about WMS/RFID and compute turnover &amp; fill-rate metrics from a real dataset.</li>
</ol></div>`,
    `<span class="eyebrow">IVM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Tồn kho — phân loại, chi phí, EOQ, điểm đặt hàng lại, hệ thống kiểm soát, MRP, Lean/JIT và công nghệ kho hàng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp để đọc thêm.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IVM301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Inventory+and+Production+Management+in+Supply+Chains%2C+4th+Edition-p-9781466558618" target="_blank" rel="noopener">Silver, Pyke &amp; Thomas — <em>Inventory and Production Management in Supply Chains</em></a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/supply-chain-management-strategy-planning-and-operation/P200000006331" target="_blank" rel="noopener">Chopra &amp; Meindl — <em>Supply Chain Management: Strategy, Planning, and Operation</em></a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/operations-management/P200000006256" target="_blank" rel="noopener">Heizer, Render &amp; Munson — <em>Operations Management: Sustainability and Supply Chain Management</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.apics.org/" target="_blank" rel="noopener">ASCM/APICS — nền kiến thức CPIM (tồn kho &amp; quản trị vật tư)</a></li>
<li><a href="https://www.investopedia.com/terms/i/inventory-management.asp" target="_blank" rel="noopener">Investopedia — Tổng quan quản trị tồn kho</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics</a> — bài giảng chuỗi cung ứng &amp; tồn kho</li>
<li><a href="https://www.youtube.com/@ASCMglobal" target="_blank" rel="noopener">ASCM (Association for Supply Chain Management)</a> — giải thích tồn kho &amp; vận hành</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Bảng tính (Excel/Google Sheets) — tự dựng công cụ tính EOQ, ROP, ABC; đây là thứ hầu hết đề thi yêu cầu.</li>
<li><a href="https://www.investopedia.com/terms/e/economicorderquantity.asp" target="_blank" rel="noopener">Investopedia — công cụ tính EOQ &amp; giải thích</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vai trò &amp; chức năng tồn kho, phân loại ABC, các loại chi phí, EOQ.</li>
<li><strong>Luyện tập</strong> — tự giải bài EOQ, ROP, tồn kho an toàn bằng bảng tính đến khi khớp đáp án đã kiểm.</li>
<li><strong>Đào sâu</strong> — hệ thống kiểm soát Q/P/min-max, logic MRP, Lean/JIT và hiệu ứng bullwhip.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc về WMS/RFID và tự tính vòng quay, tỉ lệ đáp ứng từ dữ liệu thật.</li>
</ol></div>`,
  ]]);

const intro = doc('ivm301-0-1-overview', 'Course overview: Inventory Management|||Tổng quan môn học: Quản trị Tồn kho',
  'Vì sao doanh nghiệp cần quản trị tồn kho; đánh đổi chi phí; lộ trình 8 chương từ phân loại đến công nghệ kho hàng.',
  [[
    `<span class="eyebrow">IVM301 · Lesson 0.1 · Overview</span>
<h2>Inventory Management</h2>
<p class="lead">This course helps you understand <strong>how organizations plan and control inventory</strong> — the stock of materials and goods that keeps operations running while balancing the cost of holding it. You'll learn to classify inventory, calculate order quantities and safety stock, choose a control system, and connect inventory decisions to the wider supply chain.</p>
<h3>The core trade-off</h3>
<ul>
<li><strong>Too little inventory</strong> — stockouts, lost sales, unhappy customers, disrupted production.</li>
<li><strong>Too much inventory</strong> — tied-up capital, storage cost, obsolescence risk.</li>
</ul>
<p>Every technique in this course — ABC analysis, EOQ, reorder points, MRP, Lean/JIT — is a different tool for managing that <strong>same trade-off</strong> under different conditions.</p>
<h3>Roadmap</h3>
<p>Overview &amp; role of inventory → classification &amp; ABC analysis → costs &amp; the EOQ model → reorder point, safety stock &amp; service level → control systems (Q, P, min-max) → variable demand &amp; MRP → Lean/JIT &amp; supply chain inventory → technology (WMS, RFID) &amp; measurement. Bilingual, with worked (assumed) examples and quizzes.</p>`,
    `<span class="eyebrow">IVM301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Tồn kho</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>doanh nghiệp lập kế hoạch và kiểm soát tồn kho thế nào</strong> — lượng vật tư và hàng hoá dự trữ để vận hành trơn tru, đồng thời cân đối chi phí giữ hàng. Bạn sẽ học cách phân loại tồn kho, tính số lượng đặt hàng và tồn kho an toàn, chọn hệ thống kiểm soát, và gắn quyết định tồn kho với chuỗi cung ứng rộng hơn.</p>
<h3>Đánh đổi cốt lõi</h3>
<ul>
<li><strong>Tồn kho quá ít</strong> — hết hàng, mất doanh thu, khách không hài lòng, sản xuất bị gián đoạn.</li>
<li><strong>Tồn kho quá nhiều</strong> — vốn bị chôn, chi phí lưu kho, rủi ro lỗi thời.</li>
</ul>
<p>Mọi kỹ thuật trong môn này — phân tích ABC, EOQ, điểm đặt hàng lại, MRP, Lean/JIT — đều là một công cụ khác nhau để quản lý <strong>cùng một đánh đổi</strong> trong những điều kiện khác nhau.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; vai trò tồn kho → phân loại &amp; phân tích ABC → chi phí &amp; mô hình EOQ → điểm đặt hàng lại, tồn kho an toàn &amp; mức phục vụ → hệ thống kiểm soát (Q, P, min-max) → nhu cầu biến động &amp; MRP → Lean/JIT &amp; tồn kho chuỗi cung ứng → công nghệ (WMS, RFID) &amp; đo lường. Song ngữ, có ví dụ tính toán (giả định) và quiz.</p>`,
  ]]);

const c1 = doc('ivm301-1-1-overview-role', '1.1 — Overview & role of inventory management|||1.1 — Tổng quan & vai trò quản trị tồn kho',
  'Định nghĩa tồn kho, các loại theo chức năng (raw material, WIP, finished goods, MRO), lý do giữ hàng, đánh đổi chi phí.',
  [[
    `<span class="eyebrow">IVM301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview &amp; role of inventory management</h2>
<h3>What is inventory?</h3>
<p><strong>Inventory</strong> is any stock of materials or goods held to satisfy future demand — including <strong>raw materials</strong> (inputs waiting to be processed), <strong>work-in-process (WIP)</strong> (partially finished goods), <strong>finished goods</strong> (ready to sell/ship), and <strong>MRO items</strong> (maintenance, repair &amp; operating supplies).</p>
<h3>Why hold inventory at all</h3>
<ul>
<li><strong>Economies of scale</strong> — ordering/producing in larger batches lowers cost per unit.</li>
<li><strong>Uncertainty</strong> — demand and supply lead times are rarely known exactly; inventory absorbs the mismatch.</li>
<li><strong>Seasonality &amp; anticipation</strong> — build up stock ahead of a predictable demand spike.</li>
<li><strong>Decoupling</strong> — inventory between stages lets each stage (or each supplier and customer) operate somewhat independently.</li>
</ul>
<h3>Functional types of inventory</h3>
<pre><code>Cycle stock       -> replenished each order cycle (covers average demand between orders)
Safety stock (SS) -> buffer against demand/lead-time uncertainty
Pipeline stock     -> in transit between stages (function of lead time L)
Seasonal stock     -> built ahead of a known demand peak
Speculative stock  -> bought ahead of an expected price rise
</code></pre>
<h3>The inventory manager's job</h3>
<p>Balance <strong>availability</strong> (service level, avoiding stockouts) against <strong>cost</strong> (capital tied up, storage, obsolescence) — and align that balance with the firm's overall supply chain strategy: a firm competing on low cost accepts lower service levels; one competing on responsiveness holds more buffer.</p>
<div class="callout"><span class="badge">Same trade-off, many tools</span> Every model in this course — ABC, EOQ, ROP, MRP, Lean — is a different way of managing the same core trade-off: cost of holding inventory versus cost of not having enough.</div>`,
    `<span class="eyebrow">IVM301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan &amp; vai trò quản trị tồn kho</h2>
<h3>Tồn kho là gì?</h3>
<p><strong>Tồn kho (inventory)</strong> là bất kỳ lượng vật tư hoặc hàng hoá được giữ để đáp ứng nhu cầu tương lai — gồm <strong>nguyên vật liệu</strong> (đầu vào chờ chế biến), <strong>bán thành phẩm (WIP)</strong> (hàng đang sản xuất, chưa hoàn thiện), <strong>thành phẩm</strong> (sẵn sàng bán/giao), và <strong>vật tư MRO</strong> (bảo trì, sửa chữa &amp; vận hành).</p>
<h3>Vì sao phải giữ tồn kho</h3>
<ul>
<li><strong>Lợi thế quy mô</strong> — đặt hàng/sản xuất theo lô lớn giảm chi phí trên mỗi đơn vị.</li>
<li><strong>Sự không chắc chắn</strong> — nhu cầu và thời gian giao hàng hiếm khi biết chính xác; tồn kho hấp thụ sự lệch pha đó.</li>
<li><strong>Tính thời vụ &amp; đón đầu</strong> — tích trữ trước khi nhu cầu tăng vọt có thể đoán trước.</li>
<li><strong>Tách rời (decoupling)</strong> — tồn kho giữa các giai đoạn giúp mỗi giai đoạn (hoặc mỗi nhà cung cấp và khách hàng) hoạt động phần nào độc lập.</li>
</ul>
<h3>Các loại tồn kho theo chức năng</h3>
<pre><code>Tồn kho chu kỳ (cycle stock) -> bổ sung mỗi vòng đặt hàng (đáp ứng nhu cầu TB giữa các đơn)
Tồn kho an toàn (SS)          -> vùng đệm chống bất định về nhu cầu/thời gian giao
Tồn kho vận chuyển (pipeline) -> đang trên đường giữa các giai đoạn (hàm theo lead time L)
Tồn kho thời vụ                -> tích trước một đỉnh nhu cầu đã biết
Tồn kho đầu cơ                 -> mua trước khi giá dự kiến tăng
</code></pre>
<h3>Công việc của người quản trị tồn kho</h3>
<p>Cân đối giữa <strong>độ sẵn có</strong> (mức phục vụ, tránh hết hàng) và <strong>chi phí</strong> (vốn bị chôn, lưu kho, lỗi thời) — và gắn sự cân đối đó với chiến lược chuỗi cung ứng chung của doanh nghiệp: doanh nghiệp cạnh tranh bằng chi phí thấp chấp nhận mức phục vụ thấp hơn; doanh nghiệp cạnh tranh bằng phản ứng nhanh giữ nhiều đệm hơn.</p>
<div class="callout"><span class="badge">Một đánh đổi, nhiều công cụ</span> Mọi mô hình trong môn này — ABC, EOQ, ROP, MRP, Lean — đều là một cách khác để quản lý cùng đánh đổi cốt lõi: chi phí giữ tồn kho so với chi phí không có đủ hàng.</div>`,
  ]]);

const c1q = quiz('ivm301-quiz-1', 'Quiz 1 — Overview & role|||Quiz 1 — Tổng quan & vai trò', [
  { id: 'q1', question: 'Loại tồn kho giữ để chống lại sự bất định về nhu cầu/thời gian giao hàng gọi là gì?', options: ['Tồn kho chu kỳ', 'Tồn kho an toàn (safety stock)', 'Tồn kho thời vụ', 'Tồn kho đầu cơ'], correctIndex: 1, explanation: 'Safety stock là vùng đệm chống bất định về nhu cầu và lead time.' },
  { id: 'q2', question: 'Vì sao doanh nghiệp giữ tồn kho dù tốn chi phí?', options: ['Chỉ vì thói quen', 'Lợi thế quy mô, chống bất định, thời vụ, tách rời các giai đoạn', 'Luật bắt buộc', 'Không có lý do kinh tế'], correctIndex: 1, explanation: 'Bốn lý do chính: kinh tế theo quy mô, bất định, thời vụ và tách rời (decoupling).' },
  { id: 'q3', question: 'Đánh đổi cốt lõi mà mọi mô hình tồn kho (ABC, EOQ, ROP, MRP...) đều xử lý là gì?', options: ['Chi phí sản xuất và chi phí quảng cáo', 'Chi phí giữ tồn kho so với chi phí không có đủ hàng', 'Chi phí nhân sự và chi phí thuê mặt bằng', 'Không có đánh đổi nào'], correctIndex: 1, explanation: 'Cốt lõi luôn là cân đối giữa chi phí giữ hàng và rủi ro/chi phí thiếu hàng.' },
]);

const c2 = doc('ivm301-2-1-classification-abc', '2.1 — Inventory classification & ABC analysis|||2.1 — Phân loại tồn kho & phân tích ABC',
  'Phân loại tồn kho theo chức năng và theo nhu cầu (độc lập/phụ thuộc); phân tích ABC theo giá trị sử dụng hàng năm.',
  [[
    `<span class="eyebrow">IVM301 · Chapter 2 · Lesson 2.1</span>
<h2>Inventory classification &amp; ABC analysis</h2>
<h3>Two ways to classify inventory</h3>
<ul>
<li><strong>By function</strong> — raw material, WIP, finished goods, MRO (see Chapter 1).</li>
<li><strong>By demand pattern</strong> — <strong>independent demand</strong> (finished goods sold directly to customers, forecast-driven) versus <strong>dependent demand</strong> (components whose need is derived from a production schedule — handled by MRP, Chapter 6).</li>
</ul>
<h3>ABC analysis</h3>
<p>Not all items deserve the same attention. <strong>ABC analysis</strong> ranks items by <strong>annual dollar usage</strong> — annual demand (D) times unit cost (C) — and groups them by cumulative value:</p>
<pre><code>Annual dollar usage = D x C   (per item)

Class A: ~ top 70-80% of total value, from ~ 10-20% of items  -> tight control
Class B: ~ next 15-20% of total value, from ~ 20-30% of items -> moderate control
Class C: ~ remaining 5-10% of total value, from ~ 50-70% of items -> loose control
</code></pre>
<h3>Assumed worked example</h3>
<pre><code>Item  D (units/yr)  C (cost/unit)  D x C ($/yr)
A1    500           200            100,000
A2    1,000          80             80,000
B1    2,000          15             30,000
C1    5,000           2             10,000
C2    8,000           1              8,000
Total value = 228,000; A1+A2 = 180,000 (~79% of value, 2 of 5 items) -> Class A
</code></pre>
<h3>How the class changes management</h3>
<ul>
<li><strong>Class A</strong> — frequent review, accurate forecasts, tight safety stock, close supplier relationships.</li>
<li><strong>Class B</strong> — moderate review frequency, standard control systems.</li>
<li><strong>Class C</strong> — simple rules (e.g. large order quantities, infrequent review), low management effort per item.</li>
</ul>
<div class="callout"><span class="badge">Pareto in inventory</span> ABC is just the 80/20 rule applied to stock: a small share of items usually drives most of the dollar value — put your control effort where the money is.</div>`,
    `<span class="eyebrow">IVM301 · Chương 2 · Bài 2.1</span>
<h2>Phân loại tồn kho &amp; phân tích ABC</h2>
<h3>Hai cách phân loại tồn kho</h3>
<ul>
<li><strong>Theo chức năng</strong> — nguyên vật liệu, WIP, thành phẩm, MRO (xem Chương 1).</li>
<li><strong>Theo dạng nhu cầu</strong> — <strong>nhu cầu độc lập</strong> (thành phẩm bán trực tiếp cho khách, dựa vào dự báo) so với <strong>nhu cầu phụ thuộc</strong> (linh kiện có nhu cầu được suy ra từ kế hoạch sản xuất — xử lý bằng MRP, Chương 6).</li>
</ul>
<h3>Phân tích ABC</h3>
<p>Không phải mọi mặt hàng đều đáng cùng mức quan tâm. <strong>Phân tích ABC</strong> xếp hạng mặt hàng theo <strong>giá trị sử dụng hàng năm</strong> — nhu cầu hàng năm (D) nhân đơn giá (C) — và nhóm theo giá trị tích lũy:</p>
<pre><code>Giá trị sử dụng hàng năm = D x C   (mỗi mặt hàng)

Nhóm A: ~ 70-80% tổng giá trị, từ ~ 10-20% số mặt hàng  -> kiểm soát chặt
Nhóm B: ~ 15-20% tổng giá trị tiếp theo, từ ~ 20-30% số mặt hàng -> kiểm soát vừa
Nhóm C: ~ 5-10% giá trị còn lại, từ ~ 50-70% số mặt hàng -> kiểm soát lỏng
</code></pre>
<h3>Ví dụ tính toán (giả định)</h3>
<pre><code>Mặt hàng  D (đvị/năm)  C (giá/đvị)  D x C (đ/năm)
A1        500          200          100,000
A2        1,000         80           80,000
B1        2,000         15           30,000
C1        5,000          2           10,000
C2        8,000          1            8,000
Tổng giá trị = 228,000; A1+A2 = 180,000 (~79% giá trị, 2 trong 5 mặt hàng) -> Nhóm A
</code></pre>
<h3>Nhóm ảnh hưởng cách quản trị thế nào</h3>
<ul>
<li><strong>Nhóm A</strong> — rà soát thường xuyên, dự báo chính xác, tồn kho an toàn được tính kỹ, quan hệ chặt với nhà cung cấp.</li>
<li><strong>Nhóm B</strong> — tần suất rà soát vừa phải, hệ thống kiểm soát tiêu chuẩn.</li>
<li><strong>Nhóm C</strong> — quy tắc đơn giản (vd đặt số lượng lớn, ít rà soát), tốn ít công quản trị trên mỗi mặt hàng.</li>
</ul>
<div class="callout"><span class="badge">Pareto trong tồn kho</span> ABC chính là quy tắc 80/20 áp vào hàng tồn kho: một phần nhỏ mặt hàng thường chiếm hầu hết giá trị — đặt công sức kiểm soát vào nơi có tiền.</div>`,
  ]]);

const c2q = quiz('ivm301-quiz-2', 'Quiz 2 — Classification & ABC|||Quiz 2 — Phân loại & ABC', [
  { id: 'q1', question: 'Phân tích ABC xếp hạng mặt hàng dựa trên tiêu chí nào?', options: ['Kích thước vật lý của hàng', 'Giá trị sử dụng hàng năm (D x C)', 'Ngày nhập kho gần nhất', 'Số lượng nhà cung cấp'], correctIndex: 1, explanation: 'ABC dựa trên nhu cầu hàng năm nhân đơn giá — tức giá trị sử dụng hàng năm.' },
  { id: 'q2', question: 'Mặt hàng nhóm A thường được quản trị như thế nào?', options: ['Bỏ mặc, không theo dõi', 'Rà soát thường xuyên, dự báo chính xác, kiểm soát chặt', 'Chỉ đặt hàng một lần mỗi năm', 'Không cần tồn kho an toàn'], correctIndex: 1, explanation: 'Nhóm A chiếm phần lớn giá trị nên cần kiểm soát chặt và chính xác nhất.' },
  { id: 'q3', question: 'Nhu cầu "phụ thuộc" (dependent demand) là loại nhu cầu nào?', options: ['Nhu cầu thành phẩm bán trực tiếp cho khách', 'Nhu cầu linh kiện được suy ra từ kế hoạch sản xuất', 'Nhu cầu ngẫu nhiên không liên quan gì', 'Nhu cầu chỉ có vào cuối năm'], correctIndex: 1, explanation: 'Nhu cầu phụ thuộc được tính ra từ lịch sản xuất của thành phẩm — đây là nền của MRP.' },
]);

const c3 = doc('ivm301-3-1-costs-eoq', '3.1 — Inventory costs & the EOQ model|||3.1 — Chi phí tồn kho & mô hình EOQ',
  'Bốn loại chi phí tồn kho (đặt hàng, giữ hàng, mua hàng, hết hàng); công thức EOQ và tổng chi phí; giả định & hạn chế.',
  [[
    `<span class="eyebrow">IVM301 · Chapter 3 · Lesson 3.1</span>
<h2>Inventory costs &amp; the EOQ model</h2>
<h3>Four cost categories</h3>
<ul>
<li><strong>Ordering/setup cost (S)</strong> — fixed cost per order or production run (paperwork, setup time), independent of order size.</li>
<li><strong>Holding/carrying cost (H)</strong> — cost of keeping one unit in stock for one year: capital tied up, storage, insurance, obsolescence. Often H = i x C, where i is the carrying rate (e.g. 20-25% per year) and C is unit cost.</li>
<li><strong>Purchase/production cost (C)</strong> — the unit price or production cost itself.</li>
<li><strong>Stockout/shortage cost</strong> — lost sales, backorder cost, loss of goodwill when demand cannot be met.</li>
</ul>
<h3>The EOQ (Economic Order Quantity) model</h3>
<p>EOQ finds the order quantity Q that <strong>minimizes total annual ordering + holding cost</strong>, for an item with independent, roughly constant demand (D per year):</p>
<pre><code>Total annual cost:  TC(Q) = (D / Q) x S + (Q / 2) x H

Setting dTC/dQ = 0 gives the Economic Order Quantity:

  EOQ = Q* = sqrt( 2 x D x S / H )
</code></pre>
<h3>Assumed worked example</h3>
<pre><code>D = 3,600 units/year, S = 50 $/order, H = 4 $/unit/year

Q* = sqrt( 2 x 3,600 x 50 / 4 ) = sqrt(90,000) = 300 units

Orders per year   = D / Q* = 3,600 / 300 = 12
Annual order cost  = (D/Q*) x S = 12 x 50   = 600 $
Annual holding cost = (Q*/2) x H = 150 x 4  = 600 $  (equal at the optimum)
Total (excluding purchase cost) = 1,200 $/year
</code></pre>
<h3>Assumptions &amp; limits</h3>
<p>EOQ assumes constant/known demand, constant lead time, no quantity discounts, and instantaneous replenishment. When those don't hold (variable demand, discounts, long lead times), EOQ is a starting point, not a final answer — Chapters 4-6 relax these assumptions.</p>
<div class="callout"><span class="badge">Why sqrt?</span> At the optimum, annual ordering cost equals annual holding cost — a useful sanity check when solving EOQ problems by hand.</div>`,
    `<span class="eyebrow">IVM301 · Chương 3 · Bài 3.1</span>
<h2>Chi phí tồn kho &amp; mô hình EOQ</h2>
<h3>Bốn nhóm chi phí</h3>
<ul>
<li><strong>Chi phí đặt hàng/thiết lập (S)</strong> — chi phí cố định cho mỗi lần đặt hàng hoặc mỗi lượt sản xuất (giấy tờ, thời gian thiết lập), không phụ thuộc số lượng đặt.</li>
<li><strong>Chi phí giữ hàng (H)</strong> — chi phí giữ một đơn vị trong kho suốt một năm: vốn bị chôn, lưu kho, bảo hiểm, lỗi thời. Thường H = i x C, với i là tỉ lệ giữ hàng (vd 20-25%/năm) và C là đơn giá.</li>
<li><strong>Chi phí mua/sản xuất (C)</strong> — đơn giá mua hoặc chi phí sản xuất.</li>
<li><strong>Chi phí hết hàng</strong> — mất doanh thu, chi phí đơn hàng trễ, mất uy tín khi không đáp ứng được nhu cầu.</li>
</ul>
<h3>Mô hình EOQ (Economic Order Quantity)</h3>
<p>EOQ tìm số lượng đặt hàng Q <strong>tối thiểu hoá tổng chi phí đặt hàng + giữ hàng hàng năm</strong>, cho mặt hàng có nhu cầu độc lập, khá ổn định (D mỗi năm):</p>
<pre><code>Tổng chi phí hàng năm:  TC(Q) = (D / Q) x S + (Q / 2) x H

Cho dTC/dQ = 0 ta được số lượng đặt hàng kinh tế:

  EOQ = Q* = sqrt( 2 x D x S / H )
</code></pre>
<h3>Ví dụ tính toán (giả định)</h3>
<pre><code>D = 3,600 đơn vị/năm, S = 50 $/đơn hàng, H = 4 $/đvị/năm

Q* = sqrt( 2 x 3,600 x 50 / 4 ) = sqrt(90,000) = 300 đơn vị

Số đơn hàng/năm      = D / Q* = 3,600 / 300 = 12
Chi phí đặt hàng/năm  = (D/Q*) x S = 12 x 50   = 600 $
Chi phí giữ hàng/năm  = (Q*/2) x H = 150 x 4   = 600 $ (bằng nhau tại điểm tối ưu)
Tổng (chưa gồm chi phí mua) = 1,200 $/năm
</code></pre>
<h3>Giả định &amp; hạn chế</h3>
<p>EOQ giả định nhu cầu ổn định/đã biết, lead time cố định, không có chiết khấu theo số lượng, và bổ sung ngay lập tức. Khi các giả định này không đúng (nhu cầu biến động, có chiết khấu, lead time dài), EOQ chỉ là điểm khởi đầu, không phải câu trả lời cuối — Chương 4-6 sẽ nới các giả định này.</p>
<div class="callout"><span class="badge">Vì sao có sqrt?</span> Tại điểm tối ưu, chi phí đặt hàng hàng năm bằng chi phí giữ hàng hàng năm — một cách kiểm tra nhanh khi giải bài EOQ bằng tay.</div>`,
  ]]);

const c3q = quiz('ivm301-quiz-3', 'Quiz 3 — Costs & EOQ|||Quiz 3 — Chi phí & EOQ', [
  { id: 'q1', question: 'Công thức EOQ (Q*) là gì?', options: ['Q* = D x S / H', 'Q* = sqrt(2 x D x S / H)', 'Q* = 2 x D / (S x H)', 'Q* = D / (2 x S x H)'], correctIndex: 1, explanation: 'EOQ = sqrt(2DS/H), với D là nhu cầu năm, S chi phí đặt hàng, H chi phí giữ hàng.' },
  { id: 'q2', question: 'Tại điểm EOQ tối ưu, quan hệ giữa chi phí đặt hàng và chi phí giữ hàng hàng năm là gì?', options: ['Chi phí đặt hàng luôn gấp đôi chi phí giữ hàng', 'Hai chi phí này bằng nhau', 'Chi phí giữ hàng luôn bằng 0', 'Không có quan hệ nào'], correctIndex: 1, explanation: 'Tại Q*, (D/Q*)xS = (Q*/2)xH — đây là hệ quả của việc tối thiểu hoá TC(Q).' },
  { id: 'q3', question: 'Chi phí nào KHÔNG phụ thuộc vào số lượng mỗi lần đặt hàng?', options: ['Chi phí giữ hàng (holding cost)', 'Chi phí đặt hàng/thiết lập (ordering/setup cost)', 'Chi phí mua hàng theo đơn giá', 'Không có chi phí nào cố định'], correctIndex: 1, explanation: 'Chi phí đặt hàng S là chi phí cố định cho mỗi lần đặt, không đổi theo số lượng đặt.' },
]);

const c4 = doc('ivm301-4-1-rop-safety-stock', '4.1 — Reorder point, safety stock & service level|||4.1 — Điểm đặt hàng lại, tồn kho an toàn & mức phục vụ',
  'Công thức ROP = d.L + SS; tồn kho an toàn theo hệ số z và độ lệch chuẩn nhu cầu trong lead time; đánh đổi mức phục vụ.',
  [[
    `<span class="eyebrow">IVM301 · Chapter 4 · Lesson 4.1</span>
<h2>Reorder point, safety stock &amp; service level</h2>
<h3>Reorder point (ROP)</h3>
<p>The <strong>reorder point</strong> is the inventory level that triggers a new order, set so the order arrives just as stock runs out — plus a buffer for uncertainty:</p>
<pre><code>ROP = d x L + SS

d  = average demand per period (e.g. per day)
L  = lead time (periods until the order arrives)
SS = safety stock
</code></pre>
<h3>Safety stock &amp; service level</h3>
<p>Demand during lead time is uncertain, so <strong>safety stock (SS)</strong> is sized to cover that uncertainty up to a target confidence — the <strong>service level</strong>:</p>
<pre><code>SS = z x SDL

z   = service-level factor (from the normal distribution)
SDL = standard deviation of demand during lead time
      SDL = sd x sqrt(L)   (sd = std dev of daily demand, if L is fixed)

Common z values:  90% service -> z = 1.28   95% -> z = 1.65   99% -> z = 2.33
</code></pre>
<h3>Assumed worked example</h3>
<pre><code>d = 40 units/day, L = 5 days, sd = 8 units/day, target service level = 95% (z = 1.65)

SDL = 8 x sqrt(5) = 8 x 2.24 = 17.9
SS  = 1.65 x 17.9 = 29.6 -> about 30 units
ROP = 40 x 5 + 30 = 230 units
</code></pre>
<h3>Two notions of "service level"</h3>
<ul>
<li><strong>Cycle service level</strong> — probability of NOT stocking out during one order cycle (what z above targets).</li>
<li><strong>Fill rate</strong> — the fraction of demand met directly from stock (a different, often more business-relevant, metric).</li>
</ul>
<div class="callout"><span class="badge">Higher service costs money</span> Raising the service level from 95% to 99% raises z from 1.65 to 2.33 — safety stock (and its holding cost) rises faster than the service gain, because of how the normal distribution's tail behaves.</div>`,
    `<span class="eyebrow">IVM301 · Chương 4 · Bài 4.1</span>
<h2>Điểm đặt hàng lại, tồn kho an toàn &amp; mức phục vụ</h2>
<h3>Điểm đặt hàng lại (ROP)</h3>
<p><strong>Điểm đặt hàng lại</strong> là mức tồn kho khiến ta phải đặt đơn hàng mới, sao cho đơn hàng về đúng lúc hàng gần hết — cộng thêm một vùng đệm cho sự bất định:</p>
<pre><code>ROP = d x L + SS

d  = nhu cầu trung bình mỗi kỳ (vd mỗi ngày)
L  = lead time (số kỳ chờ đơn hàng về)
SS = tồn kho an toàn
</code></pre>
<h3>Tồn kho an toàn &amp; mức phục vụ</h3>
<p>Nhu cầu trong thời gian giao hàng là bất định, nên <strong>tồn kho an toàn (SS)</strong> được tính để bao phủ sự bất định đó tới một độ tin cậy mục tiêu — <strong>mức phục vụ</strong>:</p>
<pre><code>SS = z x SDL

z   = hệ số mức phục vụ (từ phân phối chuẩn)
SDL = độ lệch chuẩn nhu cầu trong lead time
      SDL = sd x sqrt(L)   (sd = độ lệch chuẩn nhu cầu ngày, nếu L cố định)

Các giá trị z thường gặp: mức 90% -> z = 1.28   95% -> z = 1.65   99% -> z = 2.33
</code></pre>
<h3>Ví dụ tính toán (giả định)</h3>
<pre><code>d = 40 đvị/ngày, L = 5 ngày, sd = 8 đvị/ngày, mức phục vụ mục tiêu = 95% (z = 1.65)

SDL = 8 x sqrt(5) = 8 x 2.24 = 17.9
SS  = 1.65 x 17.9 = 29.6 -> khoảng 30 đơn vị
ROP = 40 x 5 + 30 = 230 đơn vị
</code></pre>
<h3>Hai khái niệm "mức phục vụ"</h3>
<ul>
<li><strong>Mức phục vụ theo chu kỳ (cycle service level)</strong> — xác suất KHÔNG hết hàng trong một chu kỳ đặt hàng (đây là điều z bên trên nhắm tới).</li>
<li><strong>Tỉ lệ đáp ứng (fill rate)</strong> — phần nhu cầu được đáp ứng trực tiếp từ tồn kho (một chỉ số khác, thường sát thực tế kinh doanh hơn).</li>
</ul>
<div class="callout"><span class="badge">Mức phục vụ cao hơn = tốn tiền hơn</span> Nâng mức phục vụ từ 95% lên 99% khiến z tăng từ 1.65 lên 2.33 — tồn kho an toàn (và chi phí giữ hàng của nó) tăng nhanh hơn phần lợi về mức phục vụ, do đặc tính phần đuôi của phân phối chuẩn.</div>`,
  ]]);

const c4q = quiz('ivm301-quiz-4', 'Quiz 4 — ROP & safety stock|||Quiz 4 — ROP & tồn kho an toàn', [
  { id: 'q1', question: 'Công thức điểm đặt hàng lại (ROP) là gì?', options: ['ROP = d / L + SS', 'ROP = d x L + SS', 'ROP = d x L − SS', 'ROP = SS − d x L'], correctIndex: 1, explanation: 'ROP = nhu cầu trung bình trong lead time (d x L) cộng tồn kho an toàn SS.' },
  { id: 'q2', question: 'Tăng mức phục vụ mục tiêu (vd từ 95% lên 99%) sẽ làm gì với tồn kho an toàn?', options: ['Giảm tồn kho an toàn', 'Không ảnh hưởng', 'Tăng tồn kho an toàn (z tăng)', 'Tồn kho an toàn về 0'], correctIndex: 2, explanation: 'Mức phục vụ cao hơn cần z lớn hơn, nên SS = z x SDL tăng theo.' },
  { id: 'q3', question: '"Fill rate" (tỉ lệ đáp ứng) khác "cycle service level" ở điểm nào?', options: ['Chúng là một khái niệm giống nhau', 'Fill rate đo phần nhu cầu đáp ứng trực tiếp từ tồn kho, còn cycle service level đo xác suất không hết hàng trong một chu kỳ', 'Fill rate chỉ dùng cho tồn kho an toàn', 'Cycle service level không liên quan tới ROP'], correctIndex: 1, explanation: 'Đây là hai chỉ số mức phục vụ khác nhau, đo hai thứ khác nhau.' },
]);

const c5 = doc('ivm301-5-1-control-systems', '5.1 — Inventory control systems: Q, P & min-max|||5.1 — Hệ thống kiểm soát tồn kho: Q, P & min-max',
  'Hệ thống đặt hàng liên tục (Q), định kỳ (P), và min-max (s,S); khác biệt về tồn kho an toàn cần và khi nào dùng hệ nào.',
  [[
    `<span class="eyebrow">IVM301 · Chapter 5 · Lesson 5.1</span>
<h2>Inventory control systems: Q, P &amp; min-max</h2>
<h3>Continuous review — the Q system</h3>
<p>Inventory level is tracked continuously (every transaction updates it). When on-hand stock drops to the <strong>reorder point (ROP)</strong>, a <strong>fixed quantity Q</strong> (typically EOQ) is ordered. Order timing varies; order size does not.</p>
<pre><code>Trigger: on-hand <= ROP  ->  order fixed quantity Q
Safety stock only needs to cover demand uncertainty during lead time L.
</code></pre>
<h3>Periodic review — the P system</h3>
<p>Inventory is checked only at <strong>fixed review intervals (T)</strong> (e.g. every 2 weeks). At each review, order enough to bring stock up to a <strong>target level (order-up-to level)</strong>: order quantity = target − on-hand.</p>
<pre><code>Every T periods: order (target level - on-hand)
Safety stock must cover demand uncertainty during (T + L),
because the next chance to react is one full review cycle away.
</code></pre>
<h3>Min-max (s, S) system</h3>
<p>A hybrid: review inventory (continuously or periodically); if the level is at or below a minimum <strong>s</strong>, order up to a maximum <strong>S</strong>. Order size is variable, review can be simpler than a pure Q system.</p>
<h3>Choosing a system</h3>
<pre><code>System     Review        Order qty   Needs SS for
Q          continuous    fixed       lead time L only
P          periodic (T)  variable    review period + lead time (T+L)
min-max    either        variable    depends on review type
</code></pre>
<div class="callout"><span class="badge">Why P needs more safety stock</span> Under periodic review, a demand spike right after a review goes unnoticed until the next review — so the buffer must cover T+L, not just L, for the same service level.</div>`,
    `<span class="eyebrow">IVM301 · Chương 5 · Bài 5.1</span>
<h2>Hệ thống kiểm soát tồn kho: Q, P &amp; min-max</h2>
<h3>Đặt hàng liên tục — hệ thống Q</h3>
<p>Mức tồn kho được theo dõi liên tục (mỗi giao dịch đều cập nhật). Khi tồn kho tụt xuống <strong>điểm đặt hàng lại (ROP)</strong>, một <strong>số lượng cố định Q</strong> (thường là EOQ) được đặt. Thời điểm đặt hàng thay đổi; số lượng đặt không đổi.</p>
<pre><code>Kích hoạt: tồn kho hiện có <= ROP  ->  đặt số lượng cố định Q
Tồn kho an toàn chỉ cần bao phủ bất định nhu cầu trong lead time L.
</code></pre>
<h3>Đặt hàng định kỳ — hệ thống P</h3>
<p>Tồn kho chỉ được kiểm tại các <strong>mốc rà soát cố định (T)</strong> (vd mỗi 2 tuần). Mỗi lần rà soát, đặt đủ để đưa tồn kho lên <strong>mức mục tiêu (order-up-to level)</strong>: số lượng đặt = mức mục tiêu − tồn kho hiện có.</p>
<pre><code>Mỗi T kỳ: đặt (mức mục tiêu - tồn kho hiện có)
Tồn kho an toàn phải bao phủ bất định nhu cầu trong (T + L),
vì cơ hội phản ứng tiếp theo là cả một chu kỳ rà soát sau đó.
</code></pre>
<h3>Hệ thống min-max (s, S)</h3>
<p>Một dạng lai: rà soát tồn kho (liên tục hoặc định kỳ); nếu mức tồn kho chạm hoặc dưới mức tối thiểu <strong>s</strong>, đặt hàng lên mức tối đa <strong>S</strong>. Số lượng đặt thay đổi, việc rà soát có thể đơn giản hơn hệ Q thuần.</p>
<h3>Chọn hệ thống nào</h3>
<pre><code>Hệ thống   Rà soát        Số lượng đặt   Cần SS cho
Q          liên tục       cố định         chỉ lead time L
P          định kỳ (T)    biến đổi        chu kỳ rà soát + lead time (T+L)
min-max    cả hai kiểu    biến đổi        tuỳ kiểu rà soát
</code></pre>
<div class="callout"><span class="badge">Vì sao hệ P cần tồn kho an toàn nhiều hơn</span> Trong đặt hàng định kỳ, một cú tăng nhu cầu ngay sau lần rà soát sẽ không được phát hiện tới lần rà soát kế tiếp — nên vùng đệm phải bao phủ T+L, không chỉ L, để đạt cùng mức phục vụ.</div>`,
  ]]);

const c5q = quiz('ivm301-quiz-5', 'Quiz 5 — Control systems|||Quiz 5 — Hệ thống kiểm soát', [
  { id: 'q1', question: 'Trong hệ thống đặt hàng liên tục (Q system), điều gì kích hoạt việc đặt hàng?', options: ['Đến một ngày cố định trong tháng', 'Tồn kho hiện có tụt xuống điểm đặt hàng lại (ROP)', 'Hết năm tài chính', 'Khách hàng yêu cầu'], correctIndex: 1, explanation: 'Hệ Q theo dõi liên tục; chạm ROP là đặt ngay một lượng cố định Q.' },
  { id: 'q2', question: 'Vì sao hệ thống đặt hàng định kỳ (P system) thường cần tồn kho an toàn lớn hơn hệ Q?', options: ['Vì hệ P không có tồn kho an toàn', 'Vì tồn kho an toàn phải bao phủ cả chu kỳ rà soát T cộng lead time L, không chỉ L', 'Vì hệ P luôn đặt số lượng cố định', 'Vì hệ P không dùng ROP nên không liên quan'], correctIndex: 1, explanation: 'Rủi ro không bị phát hiện tới lần rà soát sau, nên đệm phải phủ T+L.' },
  { id: 'q3', question: 'Hệ thống min-max (s, S) hoạt động theo nguyên tắc nào?', options: ['Luôn đặt hàng mỗi ngày với số lượng cố định', 'Khi tồn kho chạm/dưới mức tối thiểu s, đặt hàng lên mức tối đa S', 'Chỉ áp dụng cho nhu cầu phụ thuộc', 'Không cần rà soát tồn kho'], correctIndex: 1, explanation: 'Đây là định nghĩa cốt lõi của hệ min-max: chạm s thì đặt lên S.' },
]);

const c6 = doc('ivm301-6-1-variable-demand-mrp', '6.1 — Inventory under variable demand & MRP|||6.1 — Tồn kho với nhu cầu biến động & MRP',
  'Nhu cầu độc lập vs phụ thuộc; logic MRP (BOM, MPS, gross/net requirements, lead time offset) để lập kế hoạch tồn kho phụ thuộc.',
  [[
    `<span class="eyebrow">IVM301 · Chapter 6 · Lesson 6.1</span>
<h2>Inventory under variable demand &amp; MRP</h2>
<h3>Independent vs dependent demand, revisited</h3>
<p>EOQ/ROP models (Chapters 3-5) work well for <strong>independent demand</strong> items — demand must be forecast statistically. But for <strong>dependent demand</strong> items (components consumed to build a parent product), demand is not random — it can be <strong>calculated</strong> directly from the parent's production schedule. That calculation is what <strong>MRP (Material Requirements Planning)</strong> does.</p>
<h3>MRP inputs</h3>
<ul>
<li><strong>MPS (Master Production Schedule)</strong> — how many finished units to produce, and when.</li>
<li><strong>BOM (Bill of Materials)</strong> — the list (and quantity) of components needed per finished unit.</li>
<li><strong>Inventory records</strong> — on-hand stock, scheduled receipts, and each item's lead time.</li>
</ul>
<h3>The core MRP logic</h3>
<pre><code>For each component, each period:

Gross requirements (GR) = quantity needed, derived from the MPS via the BOM
Net requirements (NR)   = GR - on-hand (OH) - scheduled receipts (SR)

If NR > 0: a Planned Order Receipt of that quantity is needed in that period.
Planned Order Release = Planned Order Receipt, offset EARLIER by the item's lead time L.
</code></pre>
<h3>Assumed worked example</h3>
<pre><code>Parent P needs 100 units in week 6. BOM: 1 unit of P needs 2 units of component X.
Component X: on-hand = 40, lead time = 2 weeks.

GR (week 6) = 100 x 2 = 200
NR (week 6) = 200 - 40 - 0 = 160
Planned order RECEIPT: 160 units, week 6
Planned order RELEASE: 160 units, week 6 - 2 = week 4  (release order 2 weeks earlier)
</code></pre>
<div class="callout"><span class="badge">Different tool, same goal</span> MRP replaces "guess-and-buffer" (EOQ/ROP) with "calculate exactly what's needed and when" — but it only works because dependent demand can be derived, not because it removes the need for planning.</div>`,
    `<span class="eyebrow">IVM301 · Chương 6 · Bài 6.1</span>
<h2>Tồn kho với nhu cầu biến động &amp; MRP</h2>
<h3>Nhu cầu độc lập vs phụ thuộc, nhìn lại</h3>
<p>Mô hình EOQ/ROP (Chương 3-5) phù hợp cho mặt hàng <strong>nhu cầu độc lập</strong> — nhu cầu phải dự báo bằng thống kê. Nhưng với mặt hàng <strong>nhu cầu phụ thuộc</strong> (linh kiện dùng để lắp ráp thành sản phẩm cha), nhu cầu không ngẫu nhiên — nó có thể được <strong>tính toán</strong> trực tiếp từ kế hoạch sản xuất sản phẩm cha. Phép tính đó chính là việc <strong>MRP (Material Requirements Planning)</strong> làm.</p>
<h3>Đầu vào của MRP</h3>
<ul>
<li><strong>MPS (Lịch sản xuất chính)</strong> — cần sản xuất bao nhiêu thành phẩm, và khi nào.</li>
<li><strong>BOM (Danh mục vật tư)</strong> — danh sách (và số lượng) linh kiện cần cho mỗi thành phẩm.</li>
<li><strong>Hồ sơ tồn kho</strong> — tồn kho hiện có, các đợt nhận hàng đã lên kế hoạch, và lead time của mỗi mặt hàng.</li>
</ul>
<h3>Logic cốt lõi của MRP</h3>
<pre><code>Với mỗi linh kiện, mỗi kỳ:

Nhu cầu gộp (GR) = số lượng cần, suy ra từ MPS qua BOM
Nhu cầu thực (NR) = GR - tồn kho hiện có (OH) - đợt nhận đã lên kế hoạch (SR)

Nếu NR > 0: cần một Đợt nhận hàng theo kế hoạch với số lượng đó, đúng kỳ đó.
Đợt phát lệnh theo kế hoạch = Đợt nhận theo kế hoạch, lùi SỚM HƠN đúng lead time L.
</code></pre>
<h3>Ví dụ tính toán (giả định)</h3>
<pre><code>Sản phẩm cha P cần 100 đơn vị vào tuần 6. BOM: 1 đơn vị P cần 2 đơn vị linh kiện X.
Linh kiện X: tồn kho hiện có = 40, lead time = 2 tuần.

GR (tuần 6) = 100 x 2 = 200
NR (tuần 6) = 200 - 40 - 0 = 160
Đợt NHẬN theo kế hoạch: 160 đơn vị, tuần 6
Đợt PHÁT LỆNH theo kế hoạch: 160 đơn vị, tuần 6 - 2 = tuần 4 (phát lệnh sớm hơn 2 tuần)
</code></pre>
<div class="callout"><span class="badge">Công cụ khác, mục tiêu giống</span> MRP thay "đoán và đệm" (EOQ/ROP) bằng "tính chính xác cần gì và khi nào" — nhưng nó chỉ hoạt động được vì nhu cầu phụ thuộc có thể suy ra được, không phải vì nó loại bỏ việc lập kế hoạch.</div>`,
  ]]);

const c6q = quiz('ivm301-quiz-6', 'Quiz 6 — Variable demand & MRP|||Quiz 6 — Nhu cầu biến động & MRP', [
  { id: 'q1', question: 'MRP phù hợp nhất với loại nhu cầu nào?', options: ['Nhu cầu độc lập, phải dự báo thống kê', 'Nhu cầu phụ thuộc, suy ra được từ kế hoạch sản xuất', 'Nhu cầu ngẫu nhiên hoàn toàn', 'Không mặt hàng nào cả'], correctIndex: 1, explanation: 'MRP tính nhu cầu linh kiện dựa trên lịch sản xuất của thành phẩm — nhu cầu phụ thuộc.' },
  { id: 'q2', question: 'Trong MRP, "nhu cầu thực" (NR) được tính bằng công thức nào?', options: ['NR = GR + OH + SR', 'NR = GR − OH − SR', 'NR = OH − GR', 'NR = SR / GR'], correctIndex: 1, explanation: 'Nhu cầu thực = nhu cầu gộp trừ tồn kho hiện có trừ đợt nhận đã lên kế hoạch.' },
  { id: 'q3', question: '"Đợt phát lệnh theo kế hoạch" (planned order release) khác "đợt nhận theo kế hoạch" ở điểm nào?', options: ['Chúng luôn cùng thời điểm', 'Đợt phát lệnh diễn ra SỚM HƠN đợt nhận đúng bằng lead time', 'Đợt phát lệnh luôn diễn ra sau đợt nhận', 'Không có khác biệt gì'], correctIndex: 1, explanation: 'Phải phát lệnh trước lead time L để hàng về kịp đúng kỳ cần.' },
]);

const c7 = doc('ivm301-7-1-lean-jit-scm', '7.1 — Lean/JIT & inventory in the supply chain|||7.1 — Lean/JIT & tồn kho trong chuỗi cung ứng',
  'Just-in-Time, kanban, 7 loại lãng phí; hiệu ứng bullwhip; VMI, CPFR, cross-docking, postponement để giảm tồn kho chuỗi cung ứng.',
  [[
    `<span class="eyebrow">IVM301 · Chapter 7 · Lesson 7.1</span>
<h2>Lean/JIT &amp; inventory in the supply chain</h2>
<h3>Just-in-Time (JIT) &amp; Lean</h3>
<p><strong>JIT</strong> aims to produce and deliver exactly what is needed, exactly when needed, in exactly the quantity needed — minimizing buffer inventory. It typically runs on a <strong>kanban</strong> pull system: downstream demand pulls a signal (card, bin, electronic) that authorizes upstream production/replenishment, rather than pushing to a forecast.</p>
<p>Lean thinking treats <strong>excess inventory as one of the 7 wastes</strong> (alongside overproduction, waiting, transport, motion, over-processing, defects) — it hides problems (quality issues, unreliable suppliers) that would otherwise surface immediately.</p>
<pre><code>Benefit: less capital tied up; defects/problems surface fast (no buffer to hide behind)
Risk:    little buffer against supply disruption -> a single supplier failure can halt production
</code></pre>
<h3>The bullwhip effect</h3>
<p>Small demand variability at the retail end gets <strong>amplified</strong> as each upstream stage (distributor, manufacturer, supplier) over-reacts to orders instead of true demand — causing bigger swings in production and inventory further up the chain.</p>
<h3>Reducing supply-chain inventory</h3>
<ul>
<li><strong>VMI (Vendor-Managed Inventory)</strong> — the supplier monitors the buyer's stock and decides replenishment, using real demand data instead of order noise.</li>
<li><strong>CPFR (Collaborative Planning, Forecasting &amp; Replenishment)</strong> — trading partners share forecasts and plans to align on one demand signal.</li>
<li><strong>Cross-docking</strong> — goods move directly from inbound to outbound transport, skipping storage.</li>
<li><strong>Postponement</strong> — delay final customization/assembly until real demand is known, holding generic stock instead of many finished variants.</li>
</ul>
<div class="callout"><span class="badge">Lean is a strategy choice</span> JIT trades inventory buffer for supply-chain reliability requirements — it fits stable demand and dependable suppliers, not every situation.</div>`,
    `<span class="eyebrow">IVM301 · Chương 7 · Bài 7.1</span>
<h2>Lean/JIT &amp; tồn kho trong chuỗi cung ứng</h2>
<h3>Just-in-Time (JIT) &amp; Lean</h3>
<p><strong>JIT</strong> nhắm tới sản xuất và giao hàng đúng thứ cần, đúng lúc cần, đúng số lượng cần — tối thiểu hoá tồn kho đệm. Nó thường chạy trên hệ thống kéo <strong>kanban</strong>: nhu cầu ở hạ nguồn kéo một tín hiệu (thẻ, hộp, điện tử) cho phép sản xuất/bổ sung ở thượng nguồn, thay vì đẩy theo dự báo.</p>
<p>Tư duy Lean coi <strong>tồn kho dư thừa là một trong 7 loại lãng phí</strong> (cùng với sản xuất dư, chờ đợi, vận chuyển, di chuyển, xử lý dư, lỗi) — nó che giấu các vấn đề (chất lượng, nhà cung cấp không đáng tin) mà nếu không có đệm sẽ lộ ra ngay.</p>
<pre><code>Lợi ích: ít vốn bị chôn; lỗi/vấn đề lộ ra nhanh (không có đệm để che)
Rủi ro:  ít đệm chống gián đoạn cung ứng -> một nhà cung cấp hỏng có thể dừng cả sản xuất
</code></pre>
<h3>Hiệu ứng bullwhip (roi da)</h3>
<p>Biến động nhu cầu nhỏ ở đầu bán lẻ bị <strong>khuếch đại</strong> khi mỗi giai đoạn thượng nguồn (nhà phân phối, nhà sản xuất, nhà cung cấp) phản ứng quá mức với đơn đặt hàng thay vì nhu cầu thật — gây ra biến động lớn hơn về sản xuất và tồn kho càng lên cao trong chuỗi.</p>
<h3>Giảm tồn kho trong chuỗi cung ứng</h3>
<ul>
<li><strong>VMI (Nhà cung cấp quản lý tồn kho)</strong> — nhà cung cấp theo dõi tồn kho của bên mua và tự quyết định bổ sung, dùng dữ liệu nhu cầu thật thay vì nhiễu từ đơn hàng.</li>
<li><strong>CPFR (Lập kế hoạch, dự báo & bổ sung hợp tác)</strong> — các đối tác chia sẻ dự báo và kế hoạch để thống nhất một tín hiệu nhu cầu duy nhất.</li>
<li><strong>Cross-docking</strong> — hàng chuyển thẳng từ vận chuyển đến sang vận chuyển đi, bỏ qua lưu kho.</li>
<li><strong>Postponement (trì hoãn)</strong> — trì hoãn việc tuỳ biến/lắp ráp cuối cùng đến khi biết nhu cầu thật, giữ tồn kho dạng chung thay vì nhiều biến thể thành phẩm.</li>
</ul>
<div class="callout"><span class="badge">Lean là một lựa chọn chiến lược</span> JIT đánh đổi đệm tồn kho lấy yêu cầu độ tin cậy cao của chuỗi cung ứng — phù hợp với nhu cầu ổn định và nhà cung cấp đáng tin, không phải mọi tình huống.</div>`,
  ]]);

const c7q = quiz('ivm301-quiz-7', 'Quiz 7 — Lean/JIT & supply chain|||Quiz 7 — Lean/JIT & chuỗi cung ứng', [
  { id: 'q1', question: 'Hệ thống kéo (pull system) trong JIT thường dùng tín hiệu nào?', options: ['Dự báo bán hàng cả năm', 'Kanban — tín hiệu từ hạ nguồn cho phép sản xuất/bổ sung ở thượng nguồn', 'Lệnh của giám đốc tài chính', 'Không cần tín hiệu nào'], correctIndex: 1, explanation: 'Kanban là tín hiệu kéo phổ biến nhất trong hệ thống JIT.' },
  { id: 'q2', question: 'Hiệu ứng bullwhip là gì?', options: ['Nhu cầu giảm dần đều qua các giai đoạn', 'Biến động nhu cầu nhỏ ở bán lẻ bị khuếch đại lớn hơn khi lên các giai đoạn thượng nguồn', 'Tồn kho luôn bằng 0 trong chuỗi cung ứng', 'Chỉ xảy ra khi dùng MRP'], correctIndex: 1, explanation: 'Bullwhip: mỗi giai đoạn phản ứng quá mức, khuếch đại biến động lên thượng nguồn.' },
  { id: 'q3', question: 'VMI (Vendor-Managed Inventory) nghĩa là gì?', options: ['Bên mua tự quản lý toàn bộ tồn kho của mình', 'Nhà cung cấp theo dõi và quyết định bổ sung tồn kho cho bên mua', 'Không ai quản lý tồn kho', 'Chỉ áp dụng cho tồn kho an toàn'], correctIndex: 1, explanation: 'VMI chuyển việc theo dõi & quyết định bổ sung sang phía nhà cung cấp.' },
]);

const c8 = doc('ivm301-8-1-technology-metrics', '8.1 — Technology (WMS, RFID), metrics & practice|||8.1 — Công nghệ (WMS, RFID), đo lường & thực tiễn',
  'WMS và RFID/barcode để theo dõi tồn kho chính xác; chỉ số vòng quay tồn kho, ngày cung ứng, tỉ lệ đáp ứng; cycle counting.',
  [[
    `<span class="eyebrow">IVM301 · Chapter 8 · Lesson 8.1</span>
<h2>Technology (WMS, RFID), metrics &amp; practice</h2>
<h3>Warehouse technology</h3>
<ul>
<li><strong>WMS (Warehouse Management System)</strong> — software that tracks item locations, guides picking/put-away, and keeps system inventory records in sync with the physical warehouse in real time.</li>
<li><strong>Barcode scanning</strong> — cheap, reliable, one-item-at-a-time identification; the long-standing default.</li>
<li><strong>RFID (Radio-Frequency Identification)</strong> — tags can be read in bulk without line-of-sight, enabling faster counting and better real-time visibility, at a higher cost per tag.</li>
</ul>
<p>Both reduce <strong>inventory record inaccuracy</strong> — the gap between what the system says is on hand and what's physically there — which otherwise silently breaks every ROP/EOQ/MRP calculation built on those numbers.</p>
<h3>Key measurement metrics</h3>
<pre><code>Inventory turnover  = COGS / Average inventory value
Days of supply      = 365 / Inventory turnover
Fill rate            = units shipped from stock / units demanded
Inventory accuracy   = 1 - (|system count - physical count| / physical count)
</code></pre>
<h3>Assumed worked example</h3>
<pre><code>Annual COGS = 1,200,000 $; Average inventory value = 200,000 $

Inventory turnover = 1,200,000 / 200,000 = 6 times/year
Days of supply      = 365 / 6 = about 61 days
</code></pre>
<p>A higher turnover generally means less capital tied up per dollar of sales — but comparisons should be within the same industry, since a grocery chain and a shipyard have very different natural turnover rates.</p>
<h3>Practice: cycle counting</h3>
<p>Instead of one disruptive annual physical count, <strong>cycle counting</strong> counts a rotating subset of items continuously — Class A items counted often (e.g. monthly), Class C rarely (e.g. yearly) — catching and fixing record errors while they're small, tying ABC classification directly to operating practice.</p>
<div class="callout"><span class="badge">Numbers only help if they're right</span> Every model in this course — EOQ, ROP, MRP — runs on inventory records. Technology and cycle counting exist to keep those records trustworthy, which is a precondition for everything else working.</div>`,
    `<span class="eyebrow">IVM301 · Chương 8 · Bài 8.1</span>
<h2>Công nghệ (WMS, RFID), đo lường &amp; thực tiễn</h2>
<h3>Công nghệ kho hàng</h3>
<ul>
<li><strong>WMS (Hệ thống quản trị kho)</strong> — phần mềm theo dõi vị trí hàng, hướng dẫn lấy hàng/nhập kho, và giữ hồ sơ tồn kho trên hệ thống khớp với kho vật lý theo thời gian thực.</li>
<li><strong>Quét mã vạch (barcode)</strong> — rẻ, đáng tin, nhận diện từng mặt hàng một; lựa chọn mặc định lâu năm.</li>
<li><strong>RFID (nhận dạng qua tần số radio)</strong> — thẻ có thể đọc theo lô mà không cần nhìn thấy trực tiếp, giúp kiểm hàng nhanh hơn và theo dõi thời gian thực tốt hơn, với chi phí mỗi thẻ cao hơn.</li>
</ul>
<p>Cả hai đều giảm <strong>sai lệch hồ sơ tồn kho</strong> — khoảng cách giữa số hệ thống ghi và số thực tế trong kho — nếu không, sai lệch này âm thầm phá vỡ mọi phép tính ROP/EOQ/MRP dựa trên những con số đó.</p>
<h3>Các chỉ số đo lường chính</h3>
<pre><code>Vòng quay tồn kho   = Giá vốn hàng bán / Giá trị tồn kho trung bình
Số ngày cung ứng     = 365 / Vòng quay tồn kho
Tỉ lệ đáp ứng (fill rate) = số đơn vị giao từ tồn kho / số đơn vị được yêu cầu
Độ chính xác tồn kho  = 1 - (|số hệ thống - số thực tế| / số thực tế)
</code></pre>
<h3>Ví dụ tính toán (giả định)</h3>
<pre><code>Giá vốn hàng bán năm = 1,200,000 $; Giá trị tồn kho trung bình = 200,000 $

Vòng quay tồn kho = 1,200,000 / 200,000 = 6 lần/năm
Số ngày cung ứng   = 365 / 6 = khoảng 61 ngày
</code></pre>
<p>Vòng quay cao hơn thường nghĩa là ít vốn bị chôn trên mỗi đồng doanh thu — nhưng chỉ nên so sánh trong cùng ngành, vì một chuỗi siêu thị và một nhà máy đóng tàu có mức vòng quay tự nhiên rất khác nhau.</p>
<h3>Thực tiễn: kiểm kê theo chu kỳ (cycle counting)</h3>
<p>Thay vì một lần kiểm kê vật lý gây gián đoạn mỗi năm, <strong>cycle counting</strong> kiểm một phần nhỏ mặt hàng xoay vòng liên tục — mặt hàng nhóm A kiểm thường xuyên (vd mỗi tháng), nhóm C kiểm hiếm hơn (vd mỗi năm) — bắt và sửa lỗi hồ sơ khi còn nhỏ, gắn trực tiếp phân loại ABC với thực tiễn vận hành.</p>
<div class="callout"><span class="badge">Số liệu chỉ có ích khi đúng</span> Mọi mô hình trong môn này — EOQ, ROP, MRP — đều chạy trên hồ sơ tồn kho. Công nghệ và cycle counting tồn tại để giữ hồ sơ đó đáng tin — điều kiện tiên quyết để mọi thứ khác hoạt động.</div>`,
  ]]);

const c8q = quiz('ivm301-quiz-8', 'Quiz 8 — Technology & metrics|||Quiz 8 — Công nghệ & đo lường', [
  { id: 'q1', question: 'Vòng quay tồn kho (inventory turnover) được tính bằng công thức nào?', options: ['Doanh thu / Số lượng nhân viên', 'Giá vốn hàng bán / Giá trị tồn kho trung bình', 'Tồn kho trung bình / Giá vốn hàng bán', 'Số ngày trong năm / Doanh thu'], correctIndex: 1, explanation: 'Turnover = COGS chia giá trị tồn kho trung bình.' },
  { id: 'q2', question: 'So với quét mã vạch, RFID có ưu điểm chính nào?', options: ['Luôn rẻ hơn mã vạch', 'Đọc được theo lô mà không cần nhìn thấy trực tiếp từng thẻ', 'Không cần thẻ gắn trên hàng', 'Chỉ dùng được cho nhóm C'], correctIndex: 1, explanation: 'RFID cho phép đọc nhiều thẻ cùng lúc, không cần quét từng cái theo tầm nhìn.' },
  { id: 'q3', question: 'Cycle counting khác kiểm kê vật lý hàng năm ở điểm nào?', options: ['Cycle counting kiểm toàn bộ kho một lần mỗi năm giống nhau', 'Cycle counting kiểm một phần nhỏ mặt hàng xoay vòng liên tục, tần suất theo nhóm ABC', 'Cycle counting chỉ áp dụng cho MRP', 'Không có khác biệt nào'], correctIndex: 1, explanation: 'Cycle counting rải việc kiểm kê liên tục theo mức ưu tiên ABC, thay vì dừng cả kho một lần.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'IVM301',
    slug: 'ivm301-inventory-management',
    title: 'Inventory Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IVM301.webp',
    shortDescription: 'How firms plan & control inventory: classification & ABC, holding/ordering costs & EOQ, reorder point & safety stock, Q/P/min-max systems, MRP, Lean/JIT & warehouse tech. Bilingual, with examples & quizzes.|||Cách doanh nghiệp lập kế hoạch & kiểm soát tồn kho: phân loại & ABC, chi phí & EOQ, điểm đặt hàng lại & tồn kho an toàn, hệ thống Q/P/min-max, MRP, Lean/JIT & công nghệ kho. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>IVM301 — Inventory Management</strong> (kỳ 4) giúp hiểu <strong>doanh nghiệp lập kế hoạch &amp; kiểm soát tồn kho thế nào</strong>. Từ <strong>tổng quan &amp; vai trò tồn kho</strong> → <strong>phân loại &amp; phân tích ABC</strong> → <strong>chi phí tồn kho &amp; mô hình EOQ</strong> → <strong>điểm đặt hàng lại (ROP), tồn kho an toàn &amp; mức phục vụ</strong> → <strong>hệ thống kiểm soát Q/P/min-max</strong> → <strong>nhu cầu biến động &amp; MRP</strong> → <strong>Lean/JIT &amp; tồn kho chuỗi cung ứng</strong> → <strong>công nghệ (WMS, RFID) &amp; đo lường</strong>. Bám giáo trình tham khảo (Silver; Chopra/Meindl; Heizer/Render), song ngữ, có ví dụ tính toán (giả định) và quiz mỗi chương.',
    whatYouLearn: 'Vai trò & chức năng tồn kho; phân loại (theo chức năng, theo nhu cầu độc lập/phụ thuộc) & phân tích ABC; chi phí đặt hàng/giữ hàng & mô hình EOQ; điểm đặt hàng lại (ROP), tồn kho an toàn & mức phục vụ; hệ thống kiểm soát Q/P/min-max; logic MRP (BOM, MPS, gross/net requirements); Lean/JIT, kanban, bullwhip effect, VMI/CPFR; WMS/RFID, vòng quay tồn kho & cycle counting.',
    requirements: 'Kiến thức nền về quản trị vận hành/toán cơ bản (đại số, xác suất-thống kê nhập môn). Nên biết dùng bảng tính (Excel/Google Sheets) để tính EOQ/ROP.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao cần quản trị tồn kho; đánh đổi chi phí; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò|||Chapter 1 — Overview & role', description: 'Định nghĩa, loại tồn kho theo chức năng, lý do giữ hàng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân loại & ABC|||Chapter 2 — Classification & ABC', description: 'Nhu cầu độc lập/phụ thuộc; phân tích ABC.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chi phí & EOQ|||Chapter 3 — Costs & EOQ', description: 'Bốn loại chi phí; công thức EOQ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — ROP & tồn kho an toàn|||Chapter 4 — ROP & safety stock', description: 'Điểm đặt hàng lại, tồn kho an toàn, mức phục vụ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hệ thống kiểm soát|||Chapter 5 — Control systems', description: 'Hệ Q, P, min-max.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nhu cầu biến động & MRP|||Chapter 6 — Variable demand & MRP', description: 'Nhu cầu phụ thuộc; logic MRP.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Lean/JIT & chuỗi cung ứng|||Chapter 7 — Lean/JIT & supply chain', description: 'JIT, kanban, bullwhip, VMI/CPFR.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công nghệ & đo lường|||Chapter 8 — Technology & metrics', description: 'WMS/RFID, vòng quay tồn kho, cycle counting.', lessons: [c8, c8q] },
  ],
};
