/**
 * ACC302 — Managerial Accounting (Kế toán quản trị). Khối Quản trị Kinh doanh, kỳ 4.
 * Bám cấu trúc giáo trình kế toán quản trị chuẩn quốc tế: Garrison, Noreen & Brewer — Managerial
 * Accounting (McGraw Hill); Horngren, Datar & Rajan — Cost Accounting: A Managerial Emphasis (Pearson);
 * OpenStax — Principles of Accounting, Volume 2: Managerial Accounting. Phân loại & ứng xử chi phí,
 * cực đại–cực tiểu, CVP, chi phí theo công việc/quá trình, ABC, biến phí vs toàn bộ, dự toán tổng thể,
 * dự toán linh hoạt & phân tích biến động, chi phí thích hợp, trung tâm trách nhiệm, ROI/RI, giá chuyển giao.
 * Song ngữ + ví dụ số (đã kiểm bằng máy; mọi số liệu là GIẢ ĐỊNH/minh hoạ) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('acc302-0-1-overview', 'Course overview: accounting for managers, not for outsiders|||Tổng quan: kế toán cho nhà quản trị, không phải cho người bên ngoài',
  'Kế toán quản trị khác kế toán tài chính ở đâu, ba việc của nhà quản trị (lập kế hoạch, điều hành, kiểm soát) và ra quyết định, bối cảnh Việt Nam, chuẩn mực đạo đức nghề nghiệp, lộ trình môn.',
  [[
    `<span class="eyebrow">ACC302 · Lesson 0.1 · Overview</span>
<h2>Managerial Accounting</h2>
<p class="lead">Financial accounting tells outsiders what happened to the whole company last year. Managerial accounting gives the people <strong>inside</strong> the company the information they need to plan, to control operations and to make decisions — about products, prices, departments and the future.</p>
<h3>Financial accounting vs managerial accounting</h3>
<table>
<tr><th>Aspect</th><th>Financial accounting</th><th>Managerial accounting</th></tr>
<tr><td>Main users</td><td>External: investors, lenders, tax authorities, regulators</td><td>Internal: managers at every level</td></tr>
<tr><td>Time focus</td><td>Past results</td><td>Emphasis on the future (budgets, forecasts, decisions)</td></tr>
<tr><td>What matters most</td><td>Objectivity, verifiability, precision</td><td>Relevance and timeliness — a good estimate today beats a precise number next month</td></tr>
<tr><td>Level of detail</td><td>The organization as a whole</td><td>Segments: products, departments, customers, regions</td></tr>
<tr><td>Rules</td><td>Must follow accounting standards (IFRS, national standards such as VAS)</td><td>No mandatory format — designed to fit managers’ needs</td></tr>
<tr><td>Obligation</td><td>Required by law</td><td>Voluntary, kept because it pays for itself</td></tr>
</table>
<h3>What managers do with the numbers</h3>
<ul>
<li><strong>Planning</strong> — setting goals and choosing how to reach them; the <em>budget</em> turns the plan into numbers (Part 4).</li>
<li><strong>Directing and motivating</strong> — running day-to-day operations and getting people to work towards the plan.</li>
<li><strong>Controlling</strong> — comparing actual results with the plan (performance reports, variances) and acting on the differences (Parts 4–5).</li>
<li><strong>Decision making</strong> — choosing among alternatives: which product to push, whether to accept an order, make or buy a part (Parts 2 and 5).</li>
</ul>
<h3>The Vietnamese context and the profession</h3>
<p>Vietnamese accounting law distinguishes financial accounting from managerial accounting; managerial accounting is organized by each enterprise according to its own needs rather than in a prescribed reporting format (check the legal texts currently in force for the exact wording). Professional bodies such as the <strong>Institute of Management Accountants (IMA)</strong>, which awards the CMA credential, and <strong>CIMA</strong> (part of AICPA &amp; CIMA) set the international benchmark. The IMA’s ethical standards ask management accountants for <strong>competence, confidentiality, integrity and credibility</strong> — budgets and cost reports shape decisions and bonuses, so they must never be “managed”.</p>
<h3>Roadmap</h3>
<p>Part 1: cost concepts and cost behavior · Part 2: cost–volume–profit (CVP) analysis · Part 3: product costing — job-order, process, activity-based, variable vs absorption costing · Part 4: budgeting, flexible budgets and standard-cost variances · Part 5: relevant costs for decisions and performance evaluation (ROI, residual income, transfer prices). Every company in the examples is fictional and every number is illustrative; all calculations have been checked.</p>
<div class="callout"><span class="badge">One idea to keep</span> <strong>Different costs for different purposes.</strong> There is no single “true cost” of a product: the right cost depends on the question you are asking — valuing inventory, predicting behavior or making a decision.</div>`,
    `<span class="eyebrow">ACC302 · Bài 0.1 · Tổng quan</span>
<h2>Kế toán quản trị</h2>
<p class="lead">Kế toán tài chính cho người bên ngoài biết điều gì đã xảy ra với toàn doanh nghiệp trong năm qua. Kế toán quản trị cung cấp cho những người <strong>bên trong</strong> doanh nghiệp thông tin họ cần để lập kế hoạch, kiểm soát hoạt động và ra quyết định — về sản phẩm, giá bán, bộ phận và tương lai.</p>
<h3>Kế toán tài chính và kế toán quản trị</h3>
<table>
<tr><th>Khía cạnh</th><th>Kế toán tài chính</th><th>Kế toán quản trị</th></tr>
<tr><td>Người sử dụng chính</td><td>Bên ngoài: nhà đầu tư, ngân hàng, cơ quan thuế, cơ quan quản lý</td><td>Bên trong: nhà quản trị ở mọi cấp</td></tr>
<tr><td>Thời gian</td><td>Kết quả đã qua</td><td>Hướng về tương lai (dự toán, dự báo, quyết định)</td></tr>
<tr><td>Điều quan trọng nhất</td><td>Khách quan, kiểm chứng được, chính xác</td><td>Thích hợp và kịp thời — một ước tính tốt hôm nay hơn một con số chính xác tháng sau</td></tr>
<tr><td>Mức chi tiết</td><td>Toàn bộ doanh nghiệp</td><td>Từng bộ phận: sản phẩm, phòng ban, khách hàng, khu vực</td></tr>
<tr><td>Nguyên tắc</td><td>Phải tuân thủ chuẩn mực kế toán (IFRS, chuẩn mực quốc gia như VAS)</td><td>Không có mẫu bắt buộc — thiết kế theo nhu cầu của nhà quản trị</td></tr>
<tr><td>Tính bắt buộc</td><td>Bắt buộc theo luật</td><td>Tự nguyện, duy trì vì lợi ích lớn hơn chi phí</td></tr>
</table>
<h3>Nhà quản trị dùng số liệu để làm gì</h3>
<ul>
<li><strong>Lập kế hoạch</strong> — đặt mục tiêu và chọn cách đạt mục tiêu; <em>dự toán</em> biến kế hoạch thành con số (Phần 4).</li>
<li><strong>Tổ chức điều hành và tạo động lực</strong> — vận hành hoạt động hằng ngày và hướng mọi người theo kế hoạch.</li>
<li><strong>Kiểm soát</strong> — so sánh kết quả thực tế với kế hoạch (báo cáo thực hiện, biến động) và hành động trước chênh lệch (Phần 4–5).</li>
<li><strong>Ra quyết định</strong> — lựa chọn giữa các phương án: đẩy mạnh sản phẩm nào, có nhận một đơn hàng không, tự làm hay mua ngoài một chi tiết (Phần 2 và 5).</li>
</ul>
<h3>Bối cảnh Việt Nam và nghề nghiệp</h3>
<p>Pháp luật kế toán Việt Nam phân biệt kế toán tài chính với kế toán quản trị; kế toán quản trị do từng doanh nghiệp tự tổ chức theo nhu cầu của mình chứ không theo một mẫu báo cáo bắt buộc (kiểm văn bản pháp luật đang có hiệu lực để biết câu chữ chính xác). Các tổ chức nghề nghiệp như <strong>Viện Kế toán Quản trị Hoa Kỳ (IMA — Institute of Management Accountants)</strong>, nơi cấp chứng chỉ CMA, và <strong>CIMA</strong> (thuộc AICPA &amp; CIMA) là chuẩn tham chiếu quốc tế. Chuẩn mực đạo đức của IMA yêu cầu người làm kế toán quản trị có <strong>năng lực, bảo mật, chính trực và đáng tin cậy</strong> — dự toán và báo cáo chi phí quyết định cả phương án kinh doanh lẫn tiền thưởng, nên tuyệt đối không được “làm đẹp” số liệu.</p>
<h3>Lộ trình</h3>
<p>Phần 1: khái niệm và ứng xử chi phí · Phần 2: phân tích chi phí – khối lượng – lợi nhuận (CVP) · Phần 3: xác định chi phí sản phẩm — theo công việc, theo quá trình, theo hoạt động (ABC), phương pháp chi phí biến đổi và chi phí toàn bộ · Phần 4: dự toán, dự toán linh hoạt và biến động chi phí định mức · Phần 5: chi phí thích hợp cho quyết định và đánh giá thành quả (ROI, lợi nhuận còn lại, giá chuyển giao). Mọi công ty trong ví dụ đều là giả định và mọi con số là minh hoạ; các phép tính đã được kiểm tra.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> <strong>Chi phí khác nhau cho mục đích khác nhau.</strong> Không có một “giá thành đúng” duy nhất của sản phẩm: chi phí đúng tuỳ thuộc câu hỏi bạn đang trả lời — định giá hàng tồn kho, dự đoán ứng xử chi phí hay ra quyết định.</div>`,
  ]]);

const c1 = doc('acc302-1-1-cost-classifications', '1.1 — Cost terms and classifications|||1.1 — Thuật ngữ và phân loại chi phí',
  'Chi phí sản xuất (NVL trực tiếp, nhân công trực tiếp, sản xuất chung), chi phí ngoài sản xuất, chi phí sản phẩm và chi phí thời kỳ, trực tiếp và gián tiếp, chi phí chênh lệch, chi phí cơ hội, chi phí chìm; bảng tính giá thành sản phẩm hoàn thành và giá vốn hàng bán có ví dụ số.',
  [[
    `<span class="eyebrow">ACC302 · Part 1 · Lesson 1.1</span>
<h2>Cost terms and classifications</h2>
<p class="lead">A cost can be classified in several ways at once. Each classification answers a different management question, so learn them as a toolkit, not as a list to memorize.</p>
<h3>Manufacturing costs</h3>
<ul>
<li><strong>Direct materials (DM)</strong> — materials that become an integral part of the product and can be traced to it conveniently: the wood in a chair.</li>
<li><strong>Direct labor (DL)</strong> — wages of workers who work on the product by hand or machine: the carpenters.</li>
<li><strong>Manufacturing overhead (MOH)</strong> — all other factory costs: indirect materials (glue, screws), indirect labor (supervisors, maintenance staff), factory rent, utilities, depreciation of factory equipment.</li>
</ul>
<p><strong>Prime cost</strong> = DM + DL. <strong>Conversion cost</strong> = DL + MOH (the cost of converting materials into finished product). Costs outside the factory are <strong>nonmanufacturing costs</strong>: <em>selling costs</em> (advertising, sales commissions, shipping to customers) and <em>administrative costs</em> (executive salaries, accounting, general office).</p>
<h3>Product costs vs period costs</h3>
<p><strong>Product costs</strong> (DM, DL, MOH) attach to units of product: they sit in inventory — raw materials, work in process (WIP), finished goods — and become <strong>cost of goods sold (COGS)</strong> only when the units are sold. <strong>Period costs</strong> (all selling and administrative costs) are expensed in the period they are incurred. A factory’s rent is a product cost; the head office’s rent is a period cost.</p>
<h3>One cost, four questions</h3>
<table>
<tr><th>Purpose</th><th>Classification</th></tr>
<tr><td>Preparing financial statements</td><td>Product costs vs period costs</td></tr>
<tr><td>Predicting cost behavior</td><td>Variable vs fixed (and mixed) costs — lesson 1.2</td></tr>
<tr><td>Assigning costs to a cost object</td><td>Direct vs indirect costs</td></tr>
<tr><td>Making decisions</td><td>Differential costs, opportunity costs, sunk costs</td></tr>
</table>
<p>A <strong>direct cost</strong> can be traced to a specified <em>cost object</em> (a product, department, customer); an <strong>indirect cost</strong> cannot be traced easily and must be allocated. A <strong>differential cost</strong> is a difference in cost between alternatives. An <strong>opportunity cost</strong> is the benefit given up by choosing one alternative over another — it is not usually recorded in the accounting records, but it must be considered. A <strong>sunk cost</strong> has already been incurred and cannot be changed by any decision, so it is irrelevant to future choices.</p>
<h3>From costs to cost of goods sold</h3>
<p>Illustrative (assumed) figures for Minh An Furniture, a fictional company, in $ thousands:</p>
<pre><code>Raw materials, beginning          30
+ Purchases of raw materials     310
− Raw materials, ending          (40)
= Direct materials used          300
+ Direct labor                   200
+ Manufacturing overhead         150
= Total manufacturing cost       650     (prime cost 500; conversion cost 350)
+ Work in process, beginning      40
− Work in process, ending        (50)
= Cost of goods manufactured     640
+ Finished goods, beginning       80
− Finished goods, ending         (70)
= Cost of goods sold             650</code></pre>
<div class="callout"><span class="badge">Watch out</span> “Direct” always means direct <em>to a stated cost object</em>. The assembly department supervisor’s salary is indirect to each chair but direct to the assembly department.</div>`,
    `<span class="eyebrow">ACC302 · Phần 1 · Bài 1.1</span>
<h2>Thuật ngữ và phân loại chi phí</h2>
<p class="lead">Một khoản chi phí có thể được phân loại theo nhiều cách cùng lúc. Mỗi cách phân loại trả lời một câu hỏi quản trị khác nhau, nên hãy học chúng như một bộ công cụ, không phải một danh sách để thuộc lòng.</p>
<h3>Chi phí sản xuất</h3>
<ul>
<li><strong>Chi phí nguyên vật liệu trực tiếp (NVLTT)</strong> — vật liệu cấu thành thực thể sản phẩm và tính thẳng vào sản phẩm được một cách thuận tiện: gỗ trong chiếc ghế.</li>
<li><strong>Chi phí nhân công trực tiếp (NCTT)</strong> — tiền lương của công nhân trực tiếp làm ra sản phẩm bằng tay hoặc bằng máy: thợ mộc.</li>
<li><strong>Chi phí sản xuất chung (SXC)</strong> — mọi chi phí khác trong phân xưởng: vật liệu gián tiếp (keo, ốc vít), nhân công gián tiếp (quản đốc, thợ bảo trì), thuê nhà xưởng, điện nước, khấu hao máy móc sản xuất.</li>
</ul>
<p><strong>Chi phí ban đầu</strong> = NVLTT + NCTT. <strong>Chi phí chuyển đổi</strong> = NCTT + SXC (chi phí để biến nguyên vật liệu thành thành phẩm). Chi phí phát sinh ngoài phân xưởng là <strong>chi phí ngoài sản xuất</strong>: <em>chi phí bán hàng</em> (quảng cáo, hoa hồng bán hàng, vận chuyển đến khách hàng) và <em>chi phí quản lý doanh nghiệp</em> (lương ban giám đốc, kế toán, văn phòng chung).</p>
<h3>Chi phí sản phẩm và chi phí thời kỳ</h3>
<p><strong>Chi phí sản phẩm</strong> (NVLTT, NCTT, SXC) gắn với từng đơn vị sản phẩm: chúng nằm trong hàng tồn kho — nguyên vật liệu, sản phẩm dở dang, thành phẩm — và chỉ trở thành <strong>giá vốn hàng bán</strong> khi sản phẩm được bán. <strong>Chi phí thời kỳ</strong> (toàn bộ chi phí bán hàng và quản lý doanh nghiệp) được ghi nhận vào chi phí ngay trong kỳ phát sinh. Tiền thuê nhà xưởng là chi phí sản phẩm; tiền thuê trụ sở văn phòng là chi phí thời kỳ.</p>
<h3>Một khoản chi phí, bốn câu hỏi</h3>
<table>
<tr><th>Mục đích</th><th>Cách phân loại</th></tr>
<tr><td>Lập báo cáo tài chính</td><td>Chi phí sản phẩm và chi phí thời kỳ</td></tr>
<tr><td>Dự đoán ứng xử chi phí</td><td>Biến phí và định phí (và chi phí hỗn hợp) — bài 1.2</td></tr>
<tr><td>Tập hợp chi phí cho một đối tượng</td><td>Chi phí trực tiếp và chi phí gián tiếp</td></tr>
<tr><td>Ra quyết định</td><td>Chi phí chênh lệch, chi phí cơ hội, chi phí chìm</td></tr>
</table>
<p><strong>Chi phí trực tiếp</strong> tính thẳng được vào một <em>đối tượng chịu chi phí</em> xác định (sản phẩm, bộ phận, khách hàng); <strong>chi phí gián tiếp</strong> không tính thẳng được một cách dễ dàng và phải phân bổ. <strong>Chi phí chênh lệch</strong> là phần khác nhau về chi phí giữa các phương án. <strong>Chi phí cơ hội</strong> là lợi ích bị bỏ qua khi chọn phương án này thay vì phương án khác — thường không được ghi sổ kế toán nhưng phải được xem xét. <strong>Chi phí chìm</strong> đã phát sinh và không quyết định nào thay đổi được, nên không thích hợp với các lựa chọn trong tương lai.</p>
<h3>Từ chi phí đến giá vốn hàng bán</h3>
<p>Số liệu minh hoạ (giả định) của Nội thất Minh An, một công ty giả định, đơn vị nghìn $:</p>
<pre><code>Nguyên vật liệu tồn đầu kỳ              30
+ NVL mua vào trong kỳ                 310
− Nguyên vật liệu tồn cuối kỳ          (40)
= Chi phí NVL trực tiếp sử dụng        300
+ Chi phí nhân công trực tiếp          200
+ Chi phí sản xuất chung               150
= Tổng chi phí sản xuất phát sinh      650     (chi phí ban đầu 500; chi phí chuyển đổi 350)
+ Sản phẩm dở dang đầu kỳ               40
− Sản phẩm dở dang cuối kỳ             (50)
= Giá thành sản phẩm hoàn thành        640
+ Thành phẩm tồn đầu kỳ                 80
− Thành phẩm tồn cuối kỳ               (70)
= Giá vốn hàng bán                     650</code></pre>
<div class="callout"><span class="badge">Cẩn thận</span> “Trực tiếp” luôn có nghĩa là trực tiếp <em>đối với một đối tượng chịu chi phí đã nêu</em>. Lương tổ trưởng bộ phận lắp ráp là chi phí gián tiếp đối với từng chiếc ghế nhưng là chi phí trực tiếp đối với bộ phận lắp ráp.</div>`,
  ]]);

const c2 = doc('acc302-1-2-cost-behavior-high-low', '1.2 — Cost behavior and the high-low method|||1.2 — Ứng xử chi phí và phương pháp cực đại – cực tiểu',
  'Biến phí, định phí, chi phí hỗn hợp, phạm vi phù hợp, chi phí bậc thang; tách chi phí hỗn hợp bằng phương pháp cực đại – cực tiểu (so với hồi quy); báo cáo kết quả kinh doanh theo số dư đảm phí so với dạng truyền thống.',
  [[
    `<span class="eyebrow">ACC302 · Part 1 · Lesson 1.2</span>
<h2>Cost behavior and the high-low method</h2>
<p class="lead">Cost behavior describes how a cost reacts when the level of activity changes. Almost every tool in this course — CVP, flexible budgets, relevant costs — depends on getting it right.</p>
<h3>Variable, fixed and mixed costs</h3>
<ul>
<li><strong>Variable cost</strong> — the total changes in proportion to activity; the cost <em>per unit</em> stays constant (direct materials, sales commissions).</li>
<li><strong>Fixed cost</strong> — the total stays the same within the <strong>relevant range</strong> of activity; the cost <em>per unit</em> falls as activity rises (rent, salaries, straight-line depreciation). <em>Committed</em> fixed costs come from long-term decisions (buildings, equipment); <em>discretionary</em> fixed costs are set by each year’s budget (advertising, training).</li>
<li><strong>Mixed cost</strong> — contains both elements: Y = a + bX, where a is the fixed part, b the variable cost per unit of activity and X the activity level (a photocopier lease with a fixed monthly rent plus a charge per page copied).</li>
<li><strong>Step cost</strong> — fixed over a band of activity and then jumps (one supervisor per 20 workers).</li>
</ul>
<p>Illustrative behavior of a variable cost of $5 per unit and a fixed cost of $20,000:</p>
<table>
<tr><th>Units</th><th>Total variable cost</th><th>Variable cost per unit</th><th>Total fixed cost</th><th>Fixed cost per unit</th></tr>
<tr><td>1,000</td><td>5,000</td><td>5</td><td>20,000</td><td>20</td></tr>
<tr><td>2,000</td><td>10,000</td><td>5</td><td>20,000</td><td>10</td></tr>
<tr><td>4,000</td><td>20,000</td><td>5</td><td>20,000</td><td>5</td></tr>
</table>
<h3>Separating a mixed cost: the high-low method</h3>
<p>Maintenance cost and machine hours (MH) for six months, assumed data:</p>
<pre><code>Month   Machine hours   Maintenance cost
Jan         5,000           41,500
Feb         4,000           37,000   ← lowest activity
Mar         6,000           48,000
Apr         8,000           57,000   ← highest activity
May         7,000           51,500
Jun         5,500           45,000

Variable cost per MH = (57,000 − 37,000) / (8,000 − 4,000) = 20,000 / 4,000 = 5.00
Fixed cost           = 57,000 − 5.00 x 8,000 = 17,000   (check: 37,000 − 5.00 x 4,000 = 17,000)
Cost formula         Y = 17,000 + 5.00X
Forecast at 6,500 MH = 17,000 + 5.00 x 6,500 = 49,500</code></pre>
<p>Choose the high and low points by <strong>activity (X)</strong>, not by cost. The method is quick but uses only two observations; if either one is unusual, the formula is distorted. <strong>Least-squares regression</strong> uses every point — on these six months it gives about 4.98 per MH and a fixed part of about 17,204, close to the high-low result (Excel or Google Sheets: SLOPE and INTERCEPT).</p>
<h3>The contribution format income statement</h3>
<p>The traditional format groups costs by <em>function</em> (cost of goods sold, then selling and administrative expenses). The <strong>contribution format</strong> groups them by <em>behavior</em>, which is what managers need for planning:</p>
<pre><code>Sales (10,000 units x $50)          500,000
− Variable expenses (x $30)         (300,000)
= Contribution margin               200,000
− Fixed expenses                   (150,000)
= Net operating income               50,000</code></pre>
<p>The <strong>contribution margin</strong> is what remains from sales to cover fixed expenses and then provide profit — the starting point of Part 2.</p>
<div class="callout"><span class="badge">Watch out</span> Never treat a fixed cost per unit as if it were variable. “Fixed cost is $10 per unit” is true only at one volume: at 4,000 units it is $5, at 1,000 units it is $20.</div>`,
    `<span class="eyebrow">ACC302 · Phần 1 · Bài 1.2</span>
<h2>Ứng xử chi phí và phương pháp cực đại – cực tiểu</h2>
<p class="lead">Ứng xử chi phí mô tả chi phí phản ứng thế nào khi mức độ hoạt động thay đổi. Gần như mọi công cụ trong môn — CVP, dự toán linh hoạt, chi phí thích hợp — đều phụ thuộc vào việc xác định đúng ứng xử chi phí.</p>
<h3>Biến phí, định phí và chi phí hỗn hợp</h3>
<ul>
<li><strong>Biến phí (chi phí biến đổi)</strong> — tổng số thay đổi tỷ lệ thuận với mức hoạt động; biến phí <em>đơn vị</em> không đổi (NVL trực tiếp, hoa hồng bán hàng).</li>
<li><strong>Định phí (chi phí cố định)</strong> — tổng số không đổi trong <strong>phạm vi phù hợp</strong> của mức hoạt động; định phí <em>đơn vị</em> giảm khi mức hoạt động tăng (tiền thuê, lương cố định, khấu hao theo đường thẳng). Định phí <em>bắt buộc</em> đến từ các quyết định dài hạn (nhà xưởng, máy móc); định phí <em>tuỳ ý</em> do dự toán từng năm quyết định (quảng cáo, đào tạo).</li>
<li><strong>Chi phí hỗn hợp</strong> — gồm cả hai yếu tố: Y = a + bX, trong đó a là phần định phí, b là biến phí trên một đơn vị hoạt động và X là mức hoạt động (hợp đồng thuê máy photocopy có phí thuê cố định hằng tháng cộng tiền theo từng trang in).</li>
<li><strong>Chi phí bậc thang</strong> — cố định trong một khoảng hoạt động rồi nhảy bậc (một quản đốc cho mỗi 20 công nhân).</li>
</ul>
<p>Minh hoạ ứng xử của biến phí 5 $ mỗi đơn vị và định phí 20.000 $:</p>
<table>
<tr><th>Số sản phẩm</th><th>Tổng biến phí</th><th>Biến phí đơn vị</th><th>Tổng định phí</th><th>Định phí đơn vị</th></tr>
<tr><td>1.000</td><td>5.000</td><td>5</td><td>20.000</td><td>20</td></tr>
<tr><td>2.000</td><td>10.000</td><td>5</td><td>20.000</td><td>10</td></tr>
<tr><td>4.000</td><td>20.000</td><td>5</td><td>20.000</td><td>5</td></tr>
</table>
<h3>Tách chi phí hỗn hợp: phương pháp cực đại – cực tiểu</h3>
<p>Chi phí bảo trì và số giờ máy (GM) trong sáu tháng, số liệu giả định:</p>
<pre><code>Tháng   Số giờ máy   Chi phí bảo trì
T1         5.000         41.500
T2         4.000         37.000   ← mức hoạt động thấp nhất
T3         6.000         48.000
T4         8.000         57.000   ← mức hoạt động cao nhất
T5         7.000         51.500
T6         5.500         45.000

Biến phí mỗi giờ máy = (57.000 − 37.000) / (8.000 − 4.000) = 20.000 / 4.000 = 5,00
Định phí             = 57.000 − 5,00 x 8.000 = 17.000   (kiểm tra: 37.000 − 5,00 x 4.000 = 17.000)
Phương trình chi phí  Y = 17.000 + 5,00X
Dự báo tại 6.500 GM  = 17.000 + 5,00 x 6.500 = 49.500</code></pre>
<p>Chọn điểm cao nhất và thấp nhất theo <strong>mức hoạt động (X)</strong>, không theo chi phí. Phương pháp này nhanh nhưng chỉ dùng hai quan sát; nếu một trong hai điểm bất thường thì phương trình bị méo. <strong>Phương pháp bình phương nhỏ nhất (hồi quy)</strong> dùng mọi điểm — với sáu tháng này cho biến phí khoảng 4,98 mỗi giờ máy và định phí khoảng 17.204, gần với kết quả cực đại – cực tiểu (Excel hoặc Google Sheets: hàm SLOPE và INTERCEPT).</p>
<h3>Báo cáo kết quả kinh doanh theo số dư đảm phí</h3>
<p>Dạng truyền thống nhóm chi phí theo <em>chức năng</em> (giá vốn hàng bán, rồi chi phí bán hàng và quản lý). <strong>Dạng số dư đảm phí</strong> nhóm chi phí theo <em>ứng xử</em> — đúng thứ nhà quản trị cần để lập kế hoạch:</p>
<pre><code>Doanh thu (10.000 sp x 50 $)        500.000
− Biến phí (x 30 $)                (300.000)
= Số dư đảm phí                     200.000
− Định phí                         (150.000)
= Lợi nhuận thuần từ hoạt động       50.000</code></pre>
<p><strong>Số dư đảm phí</strong> là phần còn lại của doanh thu để bù đắp định phí rồi tạo ra lợi nhuận — điểm xuất phát của Phần 2.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Đừng bao giờ coi định phí đơn vị như biến phí. “Định phí là 10 $ mỗi sản phẩm” chỉ đúng ở một mức sản lượng: ở 4.000 sản phẩm là 5 $, ở 1.000 sản phẩm là 20 $.</div>`,
  ]]);

const c2q = quiz('acc302-quiz-1', 'Quiz 1 — Cost concepts & cost behavior|||Quiz 1 — Khái niệm & ứng xử chi phí', [
  { id: 'q1', question: 'Which of the following is a period cost for a manufacturer?|||Khoản nào sau đây là chi phí thời kỳ đối với doanh nghiệp sản xuất?', options: ['Direct materials used in production|||NVL trực tiếp dùng cho sản xuất', 'Rent on the factory building|||Tiền thuê nhà xưởng', 'Commissions paid to salespeople|||Hoa hồng trả cho nhân viên bán hàng', 'Wages of machine operators|||Tiền lương công nhân đứng máy'], correctIndex: 2, explanation: 'Sales commissions are a selling cost, expensed in the period incurred; the other three are product costs that go into inventory first.|||Hoa hồng bán hàng là chi phí bán hàng, ghi nhận vào chi phí ngay trong kỳ; ba khoản còn lại là chi phí sản phẩm, đi vào hàng tồn kho trước.' },
  { id: 'q2', question: 'At 2,000 hours a mixed cost is 26,000; at 6,000 hours it is 50,000. Using the high-low method, the cost formula is…|||Ở mức 2.000 giờ chi phí hỗn hợp là 26.000; ở 6.000 giờ là 50.000. Theo phương pháp cực đại – cực tiểu, phương trình chi phí là…', options: ['6 per hour; fixed 14,000|||6 mỗi giờ; định phí 14.000', '8.33 per hour; fixed 0|||8,33 mỗi giờ; định phí 0', '6 per hour; fixed 26,000|||6 mỗi giờ; định phí 26.000', '13 per hour; fixed 0|||13 mỗi giờ; định phí 0'], correctIndex: 0, explanation: 'b = (50,000 − 26,000) / (6,000 − 2,000) = 6; a = 50,000 − 6 x 6,000 = 14,000.|||b = (50.000 − 26.000) / (6.000 − 2.000) = 6; a = 50.000 − 6 x 6.000 = 14.000.' },
  { id: 'q3', question: 'You turn down a part-time job paying 3 million VND a month to take a summer course. For the decision, that 3 million is a(n)…|||Bạn từ chối việc làm thêm 3 triệu đồng mỗi tháng để học một khoá hè. Với quyết định này, 3 triệu đó là…', options: ['sunk cost|||chi phí chìm', 'period cost|||chi phí thời kỳ', 'fixed manufacturing cost|||định phí sản xuất', 'opportunity cost|||chi phí cơ hội'], correctIndex: 3, explanation: 'It is the benefit given up by choosing the course — an opportunity cost. It is not usually recorded in the accounts but is relevant to the decision.|||Đó là lợi ích bị bỏ qua khi chọn khoá học — chi phí cơ hội. Nó thường không được ghi sổ nhưng thích hợp với quyết định.' },
]);

const c3 = doc('acc302-2-1-cvp-basics', '2.1 — Cost-volume-profit: contribution margin, break-even, target profit|||2.1 — Chi phí – khối lượng – lợi nhuận: số dư đảm phí, hoà vốn, lợi nhuận mục tiêu',
  'Số dư đảm phí đơn vị và tỷ lệ số dư đảm phí, phương trình lợi nhuận, điểm hoà vốn theo sản lượng và doanh thu, sản lượng cho lợi nhuận mục tiêu (trước và sau thuế), số dư an toàn, độ lớn đòn bẩy kinh doanh, phân tích tăng thêm cho các phương án; ví dụ số Xe đạp Sao Việt.',
  [[
    `<span class="eyebrow">ACC302 · Part 2 · Lesson 2.1</span>
<h2>Cost-volume-profit: contribution margin, break-even, target profit</h2>
<p class="lead">CVP analysis asks how profit responds to changes in selling price, volume, variable cost and fixed cost. It is the quickest way to answer “what if…?” questions before committing money.</p>
<h3>Contribution margin and the CM ratio</h3>
<p>Sao Viet Bikes, a fictional company, sells one bicycle model (illustrative numbers): price $250, variable cost $150 per bike, fixed costs $80,000 per month.</p>
<pre><code>Unit contribution margin (CM) = Price − Variable cost = 250 − 150 = 100
CM ratio                      = CM / Price = 100 / 250 = 40%
Variable expense ratio        = 150 / 250 = 60%
Profit = (P − V) x Q − F = CM ratio x Sales − F</code></pre>
<p>Each extra bike adds $100 of contribution margin. Until fixed costs are covered, that $100 reduces the loss; after that, every $100 is profit. The CM ratio says the same in sales dollars: each extra $1 of sales adds $0.40 to profit.</p>
<h3>Break-even point</h3>
<pre><code>Break-even in units = Fixed costs / Unit CM  = 80,000 / 100  = 800 bikes
Break-even in sales = Fixed costs / CM ratio = 80,000 / 0.40 = $200,000   (= 800 x 250 ✓)</code></pre>
<h3>Target profit</h3>
<pre><code>Units for a target profit = (Fixed costs + Target profit) / Unit CM
Target profit 30,000: (80,000 + 30,000) / 100  = 1,100 bikes
                      (80,000 + 30,000) / 0.40 = $275,000 of sales
After-tax target of 24,000 with a 20% tax rate:
  pre-tax profit needed = 24,000 / (1 − 0.20) = 30,000  →  again 1,100 bikes</code></pre>
<h3>Margin of safety</h3>
<p>The <strong>margin of safety</strong> is how far sales can fall before the company makes a loss. With budgeted sales of 1,000 bikes ($250,000):</p>
<pre><code>Margin of safety = Budgeted sales − Break-even sales = 250,000 − 200,000 = $50,000 (200 bikes)
Margin of safety % = 50,000 / 250,000 = 20%</code></pre>
<h3>Operating leverage</h3>
<p>The <strong>degree of operating leverage (DOL)</strong> measures how sensitive profit is to a change in sales at a given level of sales:</p>
<pre><code>At 1,000 bikes: CM = 100,000; net operating income = 100,000 − 80,000 = 20,000
DOL = Contribution margin / Net operating income = 100,000 / 20,000 = 5
Sales +10%  →  income +(5 x 10%) = +50%  →  20,000 x 1.5 = 30,000
Check: 1,100 bikes x 100 − 80,000 = 30,000 ✓
Note: DOL = 1 / margin of safety % = 1 / 20% = 5</code></pre>
<p>DOL is not a constant: it is very high near the break-even point and falls as sales grow, because each dollar of profit sits on a larger base.</p>
<h3>Incremental “what-if” analysis</h3>
<p>Marketing proposes spending $10,000 more on advertising each month and expects 150 more bikes to be sold. You do not need a full new income statement — only the changes:</p>
<pre><code>Incremental contribution margin  150 x 100 = 15,000
− Incremental fixed cost                    (10,000)
= Increase in net operating income           5,000   →  accept (on these assumptions)</code></pre>
<p>On a <strong>CVP graph</strong>, the total-cost line starts at the fixed-cost level and rises with the variable cost per unit; the sales line starts at zero and rises with the price. They cross at the break-even point: to the left is the loss area, to the right the profit area.</p>
<div class="callout"><span class="badge">Key lesson</span> Profit moves with <strong>contribution margin</strong>, not with sales revenue. A decision that raises sales but lowers the unit CM too much can reduce profit.</div>`,
    `<span class="eyebrow">ACC302 · Phần 2 · Bài 2.1</span>
<h2>Chi phí – khối lượng – lợi nhuận: số dư đảm phí, hoà vốn, lợi nhuận mục tiêu</h2>
<p class="lead">Phân tích CVP (chi phí – khối lượng – lợi nhuận) trả lời lợi nhuận phản ứng thế nào khi giá bán, sản lượng, biến phí và định phí thay đổi. Đây là cách nhanh nhất để trả lời các câu hỏi “nếu… thì sao?” trước khi bỏ tiền ra.</p>
<h3>Số dư đảm phí và tỷ lệ số dư đảm phí</h3>
<p>Xe đạp Sao Việt, một công ty giả định, bán một mẫu xe (số liệu minh hoạ): giá bán 250 $, biến phí 150 $ mỗi xe, định phí 80.000 $ mỗi tháng.</p>
<pre><code>Số dư đảm phí đơn vị (SDĐP) = Giá bán − Biến phí đơn vị = 250 − 150 = 100
Tỷ lệ số dư đảm phí         = SDĐP / Giá bán = 100 / 250 = 40%
Tỷ lệ biến phí              = 150 / 250 = 60%
Lợi nhuận = (P − V) x Q − F = Tỷ lệ SDĐP x Doanh thu − F</code></pre>
<p>Mỗi chiếc xe bán thêm tạo thêm 100 $ số dư đảm phí. Khi chưa bù đủ định phí, 100 $ đó làm giảm lỗ; sau đó, mỗi 100 $ là lợi nhuận. Tỷ lệ SDĐP nói cùng điều đó theo doanh thu: mỗi 1 $ doanh thu tăng thêm làm lợi nhuận tăng 0,40 $.</p>
<h3>Điểm hoà vốn</h3>
<pre><code>Sản lượng hoà vốn = Định phí / SDĐP đơn vị = 80.000 / 100  = 800 xe
Doanh thu hoà vốn = Định phí / Tỷ lệ SDĐP  = 80.000 / 0,40 = 200.000 $   (= 800 x 250 ✓)</code></pre>
<h3>Lợi nhuận mục tiêu</h3>
<pre><code>Sản lượng cho lợi nhuận mục tiêu = (Định phí + Lợi nhuận mục tiêu) / SDĐP đơn vị
Lợi nhuận mục tiêu 30.000: (80.000 + 30.000) / 100  = 1.100 xe
                           (80.000 + 30.000) / 0,40 = 275.000 $ doanh thu
Mục tiêu lợi nhuận sau thuế 24.000, thuế suất 20%:
  lợi nhuận trước thuế cần đạt = 24.000 / (1 − 0,20) = 30.000  →  vẫn là 1.100 xe</code></pre>
<h3>Số dư an toàn</h3>
<p><strong>Số dư an toàn</strong> cho biết doanh thu có thể giảm bao nhiêu trước khi doanh nghiệp bị lỗ. Với doanh thu dự toán 1.000 xe (250.000 $):</p>
<pre><code>Số dư an toàn = Doanh thu dự toán − Doanh thu hoà vốn = 250.000 − 200.000 = 50.000 $ (200 xe)
Tỷ lệ số dư an toàn = 50.000 / 250.000 = 20%</code></pre>
<h3>Đòn bẩy kinh doanh</h3>
<p><strong>Độ lớn đòn bẩy kinh doanh (DOL)</strong> đo mức nhạy cảm của lợi nhuận trước thay đổi doanh thu tại một mức doanh thu nhất định:</p>
<pre><code>Tại 1.000 xe: SDĐP = 100.000; lợi nhuận thuần = 100.000 − 80.000 = 20.000
DOL = Số dư đảm phí / Lợi nhuận thuần = 100.000 / 20.000 = 5
Doanh thu +10%  →  lợi nhuận +(5 x 10%) = +50%  →  20.000 x 1,5 = 30.000
Kiểm tra: 1.100 xe x 100 − 80.000 = 30.000 ✓
Lưu ý: DOL = 1 / tỷ lệ số dư an toàn = 1 / 20% = 5</code></pre>
<p>DOL không phải hằng số: nó rất cao khi gần điểm hoà vốn và giảm dần khi doanh thu tăng, vì mỗi đồng lợi nhuận tăng thêm được so trên một nền lớn hơn.</p>
<h3>Phân tích phần tăng thêm cho câu hỏi “nếu… thì sao?”</h3>
<p>Bộ phận marketing đề xuất chi thêm 10.000 $ quảng cáo mỗi tháng và kỳ vọng bán thêm 150 xe. Không cần lập lại toàn bộ báo cáo kết quả kinh doanh — chỉ cần phần thay đổi:</p>
<pre><code>Số dư đảm phí tăng thêm   150 x 100 = 15.000
− Định phí tăng thêm                  (10.000)
= Lợi nhuận thuần tăng                  5.000   →  chấp nhận (với các giả định này)</code></pre>
<p>Trên <strong>đồ thị CVP</strong>, đường tổng chi phí xuất phát từ mức định phí và dốc lên theo biến phí đơn vị; đường doanh thu xuất phát từ 0 và dốc lên theo giá bán. Hai đường cắt nhau tại điểm hoà vốn: bên trái là vùng lỗ, bên phải là vùng lãi.</p>
<div class="callout"><span class="badge">Bài học chính</span> Lợi nhuận đi theo <strong>số dư đảm phí</strong>, không đi theo doanh thu. Một quyết định làm tăng doanh thu nhưng làm giảm SDĐP đơn vị quá nhiều có thể làm giảm lợi nhuận.</div>`,
  ]]);

const c4 = doc('acc302-2-2-sales-mix-leverage', '2.2 — Sales mix, cost structure and CVP assumptions|||2.2 — Kết cấu sản phẩm, kết cấu chi phí và giả định của CVP',
  'Điểm hoà vốn khi bán nhiều sản phẩm (tỷ lệ SDĐP bình quân và phương pháp “gói” sản phẩm), tác động của thay đổi kết cấu sản phẩm, so sánh kết cấu chi phí nhiều định phí và nhiều biến phí qua đòn bẩy kinh doanh, các giả định và giới hạn của phân tích CVP.',
  [[
    `<span class="eyebrow">ACC302 · Part 2 · Lesson 2.2</span>
<h2>Sales mix, cost structure and CVP assumptions</h2>
<h3>Break-even with more than one product</h3>
<p>Most firms sell several products with different CM ratios. The <strong>sales mix</strong> is the relative proportion in which they are sold. Illustrative monthly data for a fictional company selling two models:</p>
<table>
<tr><th></th><th>Model A</th><th>Model B</th><th>Total</th></tr>
<tr><td>Price / variable cost per unit</td><td>$100 / $60</td><td>$50 / $20</td><td></td></tr>
<tr><td>Sales</td><td>300,000 (3,000 units)</td><td>200,000 (4,000 units)</td><td>500,000</td></tr>
<tr><td>CM ratio</td><td>40%</td><td>60%</td><td>48% overall</td></tr>
<tr><td>Contribution margin</td><td>120,000</td><td>120,000</td><td>240,000</td></tr>
<tr><td>Fixed expenses</td><td colspan="2"></td><td>192,000</td></tr>
<tr><td>Net operating income</td><td colspan="2"></td><td>48,000</td></tr>
</table>
<pre><code>Overall CM ratio   = 240,000 / 500,000 = 48%
Break-even sales   = 192,000 / 0.48 = $400,000   (valid only for this mix)

Unit (“bundle”) view: the mix is 3 A : 4 B
  CM per bundle    = 3 x 40 + 4 x 30 = 240
  Break-even       = 192,000 / 240 = 800 bundles = 2,400 A + 3,200 B
  Sales check      = 2,400 x 100 + 3,200 x 50 = $400,000 ✓</code></pre>
<h3>When the mix shifts</h3>
<p>Suppose total sales stay at $500,000 but customers switch towards Model A: A $400,000, B $100,000.</p>
<pre><code>CM = 400,000 x 40% + 100,000 x 60% = 160,000 + 60,000 = 220,000   (CM ratio 44%)
Net operating income = 220,000 − 192,000 = 28,000   (down from 48,000)
New break-even sales = 192,000 / 0.44 ≈ $436,364</code></pre>
<p>Same revenue, 20,000 less profit: the mix moved towards the product with the <em>lower</em> CM ratio. Sales targets expressed only in revenue can push salespeople towards the wrong products.</p>
<h3>Cost structure and operating leverage</h3>
<p><strong>Cost structure</strong> is the relative proportion of fixed and variable costs. Two fictional firms with the same sales and the same profit today:</p>
<table>
<tr><th></th><th>Firm X (labor-intensive)</th><th>Firm Y (automated)</th></tr>
<tr><td>Sales</td><td>1,000,000</td><td>1,000,000</td></tr>
<tr><td>Variable expenses</td><td>600,000 (60%)</td><td>300,000 (30%)</td></tr>
<tr><td>Contribution margin</td><td>400,000</td><td>700,000</td></tr>
<tr><td>Fixed expenses</td><td>300,000</td><td>600,000</td></tr>
<tr><td>Net operating income</td><td>100,000</td><td>100,000</td></tr>
<tr><td>DOL = CM / NOI</td><td>4</td><td>7</td></tr>
<tr><td>Break-even sales</td><td>750,000</td><td>≈ 857,143</td></tr>
<tr><td>Income if sales +10%</td><td>140,000 (+40%)</td><td>170,000 (+70%)</td></tr>
<tr><td>Income if sales −10%</td><td>60,000 (−40%)</td><td>30,000 (−70%)</td></tr>
</table>
<p>Firm Y gains more in good years and suffers more in bad years, and it needs higher sales to break even. Which structure is better depends on how stable demand is and on management’s attitude to risk.</p>
<h3>Assumptions behind CVP</h3>
<ol>
<li>Selling price is constant (no volume discounts in the range considered).</li>
<li>Costs are linear and can be divided accurately into variable and fixed parts within the <strong>relevant range</strong>.</li>
<li>In multiproduct firms, the sales mix is constant.</li>
<li>In manufacturing firms, inventories do not change: units produced = units sold.</li>
</ol>
<div class="callout"><span class="badge">Remember</span> A break-even point is only as good as its assumptions. Recompute it whenever the mix, prices or cost structure change — and never extrapolate far outside the relevant range.</div>`,
    `<span class="eyebrow">ACC302 · Phần 2 · Bài 2.2</span>
<h2>Kết cấu sản phẩm, kết cấu chi phí và giả định của CVP</h2>
<h3>Hoà vốn khi bán nhiều sản phẩm</h3>
<p>Phần lớn doanh nghiệp bán nhiều sản phẩm với tỷ lệ SDĐP khác nhau. <strong>Kết cấu sản phẩm tiêu thụ</strong> là tỷ trọng tương đối giữa các sản phẩm được bán ra. Số liệu minh hoạ hằng tháng của một công ty giả định bán hai mẫu:</p>
<table>
<tr><th></th><th>Mẫu A</th><th>Mẫu B</th><th>Tổng</th></tr>
<tr><td>Giá bán / biến phí đơn vị</td><td>100 $ / 60 $</td><td>50 $ / 20 $</td><td></td></tr>
<tr><td>Doanh thu</td><td>300.000 (3.000 sp)</td><td>200.000 (4.000 sp)</td><td>500.000</td></tr>
<tr><td>Tỷ lệ SDĐP</td><td>40%</td><td>60%</td><td>48% bình quân</td></tr>
<tr><td>Số dư đảm phí</td><td>120.000</td><td>120.000</td><td>240.000</td></tr>
<tr><td>Định phí</td><td colspan="2"></td><td>192.000</td></tr>
<tr><td>Lợi nhuận thuần</td><td colspan="2"></td><td>48.000</td></tr>
</table>
<pre><code>Tỷ lệ SDĐP bình quân = 240.000 / 500.000 = 48%
Doanh thu hoà vốn    = 192.000 / 0,48 = 400.000 $   (chỉ đúng với kết cấu này)

Cách nhìn theo “gói” sản phẩm: kết cấu là 3 A : 4 B
  SDĐP mỗi gói       = 3 x 40 + 4 x 30 = 240
  Hoà vốn            = 192.000 / 240 = 800 gói = 2.400 A + 3.200 B
  Kiểm tra doanh thu = 2.400 x 100 + 3.200 x 50 = 400.000 $ ✓</code></pre>
<h3>Khi kết cấu sản phẩm thay đổi</h3>
<p>Giả sử tổng doanh thu vẫn là 500.000 $ nhưng khách hàng chuyển sang Mẫu A: A 400.000 $, B 100.000 $.</p>
<pre><code>SDĐP = 400.000 x 40% + 100.000 x 60% = 160.000 + 60.000 = 220.000   (tỷ lệ SDĐP 44%)
Lợi nhuận thuần = 220.000 − 192.000 = 28.000   (giảm từ 48.000)
Doanh thu hoà vốn mới = 192.000 / 0,44 ≈ 436.364 $</code></pre>
<p>Cùng doanh thu, lợi nhuận ít hơn 20.000: kết cấu đã dịch về phía sản phẩm có tỷ lệ SDĐP <em>thấp hơn</em>. Chỉ tiêu bán hàng chỉ tính bằng doanh thu có thể đẩy nhân viên bán hàng vào những sản phẩm sai.</p>
<h3>Kết cấu chi phí và đòn bẩy kinh doanh</h3>
<p><strong>Kết cấu chi phí</strong> là tỷ trọng tương đối giữa định phí và biến phí. Hai doanh nghiệp giả định có cùng doanh thu và cùng lợi nhuận hiện tại:</p>
<table>
<tr><th></th><th>Doanh nghiệp X (dùng nhiều lao động)</th><th>Doanh nghiệp Y (tự động hoá)</th></tr>
<tr><td>Doanh thu</td><td>1.000.000</td><td>1.000.000</td></tr>
<tr><td>Biến phí</td><td>600.000 (60%)</td><td>300.000 (30%)</td></tr>
<tr><td>Số dư đảm phí</td><td>400.000</td><td>700.000</td></tr>
<tr><td>Định phí</td><td>300.000</td><td>600.000</td></tr>
<tr><td>Lợi nhuận thuần</td><td>100.000</td><td>100.000</td></tr>
<tr><td>DOL = SDĐP / LN thuần</td><td>4</td><td>7</td></tr>
<tr><td>Doanh thu hoà vốn</td><td>750.000</td><td>≈ 857.143</td></tr>
<tr><td>Lợi nhuận nếu doanh thu +10%</td><td>140.000 (+40%)</td><td>170.000 (+70%)</td></tr>
<tr><td>Lợi nhuận nếu doanh thu −10%</td><td>60.000 (−40%)</td><td>30.000 (−70%)</td></tr>
</table>
<p>Doanh nghiệp Y được nhiều hơn trong năm thuận lợi và thiệt nhiều hơn trong năm khó khăn, đồng thời cần doanh thu cao hơn mới hoà vốn. Kết cấu nào tốt hơn tuỳ vào mức ổn định của nhu cầu và thái độ của ban lãnh đạo đối với rủi ro.</p>
<h3>Các giả định của phân tích CVP</h3>
<ol>
<li>Giá bán không đổi (không có chiết khấu theo sản lượng trong phạm vi xem xét).</li>
<li>Chi phí tuyến tính và tách chính xác được thành biến phí và định phí trong <strong>phạm vi phù hợp</strong>.</li>
<li>Với doanh nghiệp nhiều sản phẩm, kết cấu sản phẩm tiêu thụ không đổi.</li>
<li>Với doanh nghiệp sản xuất, tồn kho không thay đổi: số lượng sản xuất = số lượng tiêu thụ.</li>
</ol>
<div class="callout"><span class="badge">Ghi nhớ</span> Điểm hoà vốn chỉ đáng tin bằng các giả định của nó. Tính lại mỗi khi kết cấu sản phẩm, giá bán hoặc kết cấu chi phí thay đổi — và đừng ngoại suy xa ra ngoài phạm vi phù hợp.</div>`,
  ]]);

const c4e = doc('acc302-2-3-exercise', 'Exercise 1 — CVP for Viet Sound speakers|||Bài tập 1 — CVP cho loa Viet Sound',
  'Bài tập: tính số dư đảm phí, điểm hoà vốn, sản lượng cho lợi nhuận mục tiêu, số dư an toàn, độ lớn đòn bẩy kinh doanh và đánh giá đề xuất giảm giá để tăng sản lượng cho một công ty loa giả định; kèm lời giải.',
  [[
    `<span class="eyebrow">ACC302 · Part 2 · Exercise</span>
<h2>Exercise 1 — is the price cut worth it?</h2>
<div class="callout"><span class="badge">Problem</span> Viet Sound, a fictional company, sells a portable speaker (illustrative figures, VND thousands): price 500, variable cost 300 per unit, fixed costs 360,000 per year. Budgeted sales are 2,400 units. (a) Compute the unit contribution margin, the CM ratio and the break-even point in units and in sales. (b) How many units must be sold to earn a profit of 100,000? (c) Compute the margin of safety in sales, in units and as a percentage of budgeted sales. (d) Compute budgeted net operating income and the degree of operating leverage; by what percentage and to what amount would income change if sales rose 15%? (e) The sales manager proposes cutting the price by 10% and expects volume to rise by 30%. Should the company accept?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Unit CM   = 500 − 300 = 200          CM ratio = 200 / 500 = 40%
    Break-even units = 360,000 / 200  = 1,800 units
    Break-even sales = 360,000 / 0.40 = 900,000   (= 1,800 x 500 ✓)

(b) Units = (360,000 + 100,000) / 200 = 2,300 units   (sales 1,150,000)

(c) Budgeted sales    = 2,400 x 500 = 1,200,000
    Margin of safety  = 1,200,000 − 900,000 = 300,000   (2,400 − 1,800 = 600 units)
    Margin of safety % = 300,000 / 1,200,000 = 25%

(d) CM  = 2,400 x 200 = 480,000;   NOI = 480,000 − 360,000 = 120,000
    DOL = 480,000 / 120,000 = 4
    Sales +15%  →  NOI +(4 x 15%) = +60%  →  120,000 x 1.6 = 192,000
    Check: 2,760 units x 200 − 360,000 = 192,000 ✓

(e) New price 450; new unit CM = 450 − 300 = 150
    New volume = 2,400 x 1.3 = 3,120 units
    CM = 3,120 x 150 = 468,000;  NOI = 468,000 − 360,000 = 108,000
    108,000 &lt; 120,000  →  reject: income falls by 12,000
    New break-even = 360,000 / 150 = 2,400 units (up from 1,800)</code></pre>
<p><strong>Why:</strong> a 10% price cut removes 50 of the 200 unit CM — a 25% drop in margin per unit — so volume would have to grow by a third just to stand still: (360,000 + 120,000) / 150 = 3,200 units, +33.3%. The expected +30% is not enough, and the plan also pushes the break-even point up to today’s entire budget. Notice too that the margin of safety of 25% and the DOL of 4 are two views of the same fact (1 / 0.25 = 4). Before accepting, managers should also ask qualitative questions: will competitors match the cut, and can the brand recover its price later?</p>`,
    `<span class="eyebrow">ACC302 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — có nên giảm giá?</h2>
<div class="callout"><span class="badge">Đề</span> Viet Sound, một công ty giả định, bán loa di động (số liệu minh hoạ, đơn vị nghìn đồng): giá bán 500, biến phí 300 mỗi sản phẩm, định phí 360.000 mỗi năm. Sản lượng tiêu thụ dự toán là 2.400 sản phẩm. (a) Tính số dư đảm phí đơn vị, tỷ lệ SDĐP và điểm hoà vốn theo sản lượng và doanh thu. (b) Phải bán bao nhiêu sản phẩm để đạt lợi nhuận 100.000? (c) Tính số dư an toàn theo doanh thu, theo sản lượng và theo tỷ lệ phần trăm trên doanh thu dự toán. (d) Tính lợi nhuận thuần dự toán và độ lớn đòn bẩy kinh doanh; nếu doanh thu tăng 15% thì lợi nhuận thay đổi bao nhiêu phần trăm và đạt bao nhiêu? (e) Trưởng phòng kinh doanh đề xuất giảm giá 10% và kỳ vọng sản lượng tăng 30%. Công ty có nên chấp nhận?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) SDĐP đơn vị = 500 − 300 = 200          Tỷ lệ SDĐP = 200 / 500 = 40%
    Sản lượng hoà vốn = 360.000 / 200  = 1.800 sản phẩm
    Doanh thu hoà vốn = 360.000 / 0,40 = 900.000   (= 1.800 x 500 ✓)

(b) Sản lượng = (360.000 + 100.000) / 200 = 2.300 sản phẩm   (doanh thu 1.150.000)

(c) Doanh thu dự toán   = 2.400 x 500 = 1.200.000
    Số dư an toàn       = 1.200.000 − 900.000 = 300.000   (2.400 − 1.800 = 600 sản phẩm)
    Tỷ lệ số dư an toàn = 300.000 / 1.200.000 = 25%

(d) SDĐP = 2.400 x 200 = 480.000;   LN thuần = 480.000 − 360.000 = 120.000
    DOL  = 480.000 / 120.000 = 4
    Doanh thu +15%  →  LN thuần +(4 x 15%) = +60%  →  120.000 x 1,6 = 192.000
    Kiểm tra: 2.760 sản phẩm x 200 − 360.000 = 192.000 ✓

(e) Giá mới 450; SDĐP đơn vị mới = 450 − 300 = 150
    Sản lượng mới = 2.400 x 1,3 = 3.120 sản phẩm
    SDĐP = 3.120 x 150 = 468.000;  LN thuần = 468.000 − 360.000 = 108.000
    108.000 &lt; 120.000  →  không chấp nhận: lợi nhuận giảm 12.000
    Hoà vốn mới = 360.000 / 150 = 2.400 sản phẩm (tăng từ 1.800)</code></pre>
<p><strong>Vì sao:</strong> giảm giá 10% lấy mất 50 trong 200 SDĐP đơn vị — số dư đảm phí mỗi sản phẩm giảm 25% — nên sản lượng phải tăng một phần ba mới giữ nguyên lợi nhuận: (360.000 + 120.000) / 150 = 3.200 sản phẩm, +33,3%. Mức +30% kỳ vọng là chưa đủ, và phương án còn đẩy điểm hoà vốn lên bằng toàn bộ sản lượng dự toán hiện nay. Cũng để ý rằng tỷ lệ số dư an toàn 25% và DOL bằng 4 là hai cách nhìn cùng một sự thật (1 / 0,25 = 4). Trước khi chấp nhận, nhà quản trị còn phải hỏi các câu định tính: đối thủ có giảm giá theo không, và thương hiệu có nâng giá trở lại được không?</p>`,
  ]]);

const c4q = quiz('acc302-quiz-2', 'Quiz 2 — Cost-volume-profit analysis|||Quiz 2 — Phân tích chi phí – khối lượng – lợi nhuận', [
  { id: 'q1', question: 'A product sells for 40 with a variable cost of 24 per unit. Fixed costs are 48,000. The break-even point in units is…|||Một sản phẩm có giá bán 40, biến phí 24 mỗi đơn vị. Định phí 48.000. Sản lượng hoà vốn là…', options: ['1,200 units|||1.200 sản phẩm', '2,000 units|||2.000 sản phẩm', '3,000 units|||3.000 sản phẩm', '4,800 units|||4.800 sản phẩm'], correctIndex: 2, explanation: 'Unit CM = 40 − 24 = 16; 48,000 / 16 = 3,000 units. Dividing by the price (1,200) or by the variable cost (2,000) ignores the contribution margin.|||SDĐP đơn vị = 40 − 24 = 16; 48.000 / 16 = 3.000 sản phẩm. Chia cho giá bán (1.200) hay cho biến phí (2.000) là bỏ qua số dư đảm phí.' },
  { id: 'q2', question: 'The CM ratio is 30% and fixed costs are 90,000. What sales are needed to earn a profit of 30,000?|||Tỷ lệ SDĐP là 30% và định phí 90.000. Cần doanh thu bao nhiêu để có lợi nhuận 30.000?', options: ['300,000|||300.000', '400,000|||400.000', '171,429|||171.429', '120,000|||120.000'], correctIndex: 1, explanation: '(90,000 + 30,000) / 0.30 = 400,000. 300,000 is only the break-even point; 171,429 wrongly divides by the variable expense ratio.|||(90.000 + 30.000) / 0,30 = 400.000. 300.000 chỉ là doanh thu hoà vốn; 171.429 là chia nhầm cho tỷ lệ biến phí.' },
  { id: 'q3', question: 'A company’s degree of operating leverage is 4. If sales increase by 5%, net operating income will increase by…|||Độ lớn đòn bẩy kinh doanh của một công ty là 4. Nếu doanh thu tăng 5% thì lợi nhuận thuần tăng…', options: ['20%|||20%', '5%|||5%', '9%|||9%', '1.25%|||1,25%'], correctIndex: 0, explanation: 'Percentage change in income = DOL x percentage change in sales = 4 x 5% = 20%.|||Phần trăm thay đổi lợi nhuận = DOL x phần trăm thay đổi doanh thu = 4 x 5% = 20%.' },
]);

const c5 = doc('acc302-3-1-job-process-costing', '3.1 — Job-order costing and process costing|||3.1 — Xác định chi phí theo công việc và theo quá trình sản xuất',
  'Khi nào dùng chi phí theo công việc và theo quá trình, phiếu chi phí công việc, tỷ lệ phân bổ chi phí sản xuất chung ước tính, phân bổ thừa/thiếu và cách xử lý cuối kỳ; chi phí theo quá trình với sản lượng tương đương theo phương pháp bình quân gia quyền; có ví dụ số.',
  [[
    `<span class="eyebrow">ACC302 · Part 3 · Lesson 3.1</span>
<h2>Job-order costing and process costing</h2>
<p class="lead">To price products, value inventory and judge profitability, a manufacturer must know what each unit cost to make. The costing system depends on what the company produces.</p>
<table>
<tr><th></th><th>Job-order costing</th><th>Process costing</th></tr>
<tr><td>Output</td><td>Many different, often customized jobs or batches</td><td>A continuous flow of identical units</td></tr>
<tr><td>Examples</td><td>Furniture made to order, printing, construction, consulting and audit engagements</td><td>Cement, paint, beverages, flour, bottled water</td></tr>
<tr><td>Costs accumulated by</td><td>Job (on a <em>job cost sheet</em>)</td><td>Processing department</td></tr>
<tr><td>Unit cost</td><td>Cost of the job / units in the job</td><td>Department cost / equivalent units</td></tr>
</table>
<h3>Job-order costing and the predetermined overhead rate</h3>
<p>Direct materials (from materials requisitions) and direct labor (from time tickets) are traced to each job. Overhead cannot be traced, so it is <strong>applied</strong> with a <strong>predetermined overhead rate (POHR)</strong> set <em>before</em> the year begins:</p>
<pre><code>POHR = Estimated total manufacturing overhead / Estimated total amount of the allocation base
     = 600,000 / 40,000 direct labor-hours (DLH) = 15 per DLH      (assumed estimates)

Job J-101 (500 units)
  Direct materials                              8,000
  Direct labor (400 DLH)                        6,000
  Overhead applied  400 DLH x 15                6,000
  Total job cost                               20,000   →  20,000 / 500 = 40 per unit</code></pre>
<p>Why estimate instead of waiting for actual overhead? Actual overhead is known only at year-end, many overhead costs are seasonal (heating, maintenance), and managers need job costs <em>during</em> the year to quote prices and bill customers.</p>
<h3>Recording the flows (summary journal entries)</h3>
<pre><code>Direct materials issued     Dr Work in process          Cr Raw materials
Indirect materials issued   Dr Manufacturing overhead   Cr Raw materials
Actual overhead incurred    Dr Manufacturing overhead   Cr Cash / Accumulated depreciation / Payables
Overhead applied to jobs    Dr Work in process          Cr Manufacturing overhead
Jobs completed              Dr Finished goods           Cr Work in process
Jobs sold                   Dr Cost of goods sold       Cr Finished goods</code></pre>
<h3>Underapplied and overapplied overhead</h3>
<pre><code>Actual overhead for the year                 615,000
Applied overhead = 42,000 actual DLH x 15    630,000
Overapplied overhead                          15,000   (applied &gt; actual)

Close the small balance to cost of goods sold:
  Dr Manufacturing overhead  15,000  /  Cr Cost of goods sold  15,000</code></pre>
<p>Applied &gt; actual → <strong>overapplied</strong> (jobs were overcosted; reduce COGS). Applied &lt; actual → <strong>underapplied</strong> (increase COGS). If the amount is material, allocate it among WIP, finished goods and COGS in proportion to the overhead applied in each ending balance. In Vietnam, enterprises applying the enterprise accounting regime (Circular 99/2025/TT-BTC, which replaced Circular 200/2014 from 1 January 2026) first accumulate production costs by element in accounts 621, 622 and 627 and then transfer them to account 154 (work in process); small and medium-sized enterprises under Circular 133/2016 record them directly in account 154, detailed by element. Check the texts currently in force.</p>
<h3>Process costing: equivalent units (weighted-average method)</h3>
<p>A process has partly finished units at the end of the period, so costs are spread over <strong>equivalent units (EU)</strong> — the number of complete units that the work done is equivalent to. Illustrative Mixing department data:</p>
<pre><code>Units: beginning WIP 2,000 + started 18,000 = completed 17,000 + ending WIP 3,000
Ending WIP: 100% complete for materials, 40% complete for conversion

Equivalent units (weighted-average) = units completed + EU in ending WIP
  Materials  : 17,000 + 3,000 x 100% = 20,000
  Conversion : 17,000 + 3,000 x 40%  = 18,200

Costs (beginning WIP + added):  materials 10,000 + 90,000 = 100,000
                                conversion  5,000 + 67,800 =  72,800
Cost per EU: materials 100,000 / 20,000 = 5.00; conversion 72,800 / 18,200 = 4.00
Transferred out  17,000 x (5.00 + 4.00)        = 153,000
Ending WIP       3,000 x 5.00 + 1,200 x 4.00   =  19,800
Total accounted for                            = 172,800 ✓</code></pre>
<div class="callout"><span class="badge">Watch out</span> A POHR must be based on an allocation base that actually <em>drives</em> overhead. If machines, not people, drive most overhead, a labor-hour rate will distort job costs — the problem that activity-based costing (lesson 3.2) addresses.</div>`,
    `<span class="eyebrow">ACC302 · Phần 3 · Bài 3.1</span>
<h2>Xác định chi phí theo công việc và theo quá trình sản xuất</h2>
<p class="lead">Để định giá bán, tính giá trị hàng tồn kho và đánh giá khả năng sinh lời, doanh nghiệp sản xuất phải biết mỗi sản phẩm tốn bao nhiêu để làm ra. Hệ thống tính chi phí tuỳ thuộc vào thứ doanh nghiệp sản xuất.</p>
<table>
<tr><th></th><th>Chi phí theo công việc (đơn đặt hàng)</th><th>Chi phí theo quá trình sản xuất</th></tr>
<tr><td>Sản phẩm</td><td>Nhiều công việc hoặc lô khác nhau, thường theo yêu cầu riêng</td><td>Dòng sản phẩm đồng nhất, sản xuất liên tục</td></tr>
<tr><td>Ví dụ</td><td>Nội thất đóng theo đơn, in ấn, xây dựng, hợp đồng tư vấn và kiểm toán</td><td>Xi măng, sơn, đồ uống, bột mì, nước đóng chai</td></tr>
<tr><td>Tập hợp chi phí theo</td><td>Từng công việc (trên <em>phiếu chi phí công việc</em>)</td><td>Từng phân xưởng (bộ phận sản xuất)</td></tr>
<tr><td>Chi phí đơn vị</td><td>Chi phí của công việc / số sản phẩm của công việc</td><td>Chi phí của phân xưởng / sản lượng tương đương</td></tr>
</table>
<h3>Chi phí theo công việc và tỷ lệ phân bổ chi phí sản xuất chung ước tính</h3>
<p>Chi phí NVL trực tiếp (theo phiếu xuất kho) và nhân công trực tiếp (theo bảng chấm công, phiếu giờ công) được tính thẳng vào từng công việc. Chi phí sản xuất chung không tính thẳng được nên được <strong>phân bổ</strong> theo <strong>tỷ lệ phân bổ chi phí SXC ước tính (định trước)</strong>, xác định <em>trước</em> khi năm bắt đầu:</p>
<pre><code>Tỷ lệ phân bổ = Tổng chi phí SXC ước tính / Tổng mức hoạt động ước tính của tiêu thức phân bổ
              = 600.000 / 40.000 giờ công lao động trực tiếp (giờ LĐTT) = 15 mỗi giờ LĐTT   (ước tính giả định)

Công việc J-101 (500 sản phẩm)
  NVL trực tiếp                                 8.000
  Nhân công trực tiếp (400 giờ LĐTT)            6.000
  SXC phân bổ  400 giờ x 15                     6.000
  Tổng chi phí công việc                       20.000   →  20.000 / 500 = 40 mỗi sản phẩm</code></pre>
<p>Vì sao phải ước tính thay vì chờ chi phí SXC thực tế? Chi phí SXC thực tế chỉ biết được vào cuối năm, nhiều khoản mang tính mùa vụ (sưởi ấm, bảo trì), và nhà quản trị cần chi phí công việc <em>ngay trong năm</em> để báo giá và lập hoá đơn cho khách hàng.</p>
<h3>Ghi nhận dòng chi phí (bút toán tổng hợp)</h3>
<pre><code>Xuất NVL trực tiếp           Nợ Sản phẩm dở dang       Có Nguyên vật liệu
Xuất vật liệu gián tiếp      Nợ Chi phí SXC            Có Nguyên vật liệu
Chi phí SXC thực tế phát sinh Nợ Chi phí SXC           Có Tiền / Hao mòn TSCĐ / Phải trả
Phân bổ SXC vào công việc    Nợ Sản phẩm dở dang       Có Chi phí SXC
Công việc hoàn thành         Nợ Thành phẩm             Có Sản phẩm dở dang
Công việc đã bán             Nợ Giá vốn hàng bán       Có Thành phẩm</code></pre>
<h3>Phân bổ thiếu và phân bổ thừa</h3>
<pre><code>Chi phí SXC thực tế trong năm                 615.000
SXC đã phân bổ = 42.000 giờ LĐTT thực tế x 15  630.000
Phân bổ thừa                                   15.000   (đã phân bổ &gt; thực tế)

Kết chuyển số chênh lệch nhỏ vào giá vốn hàng bán:
  Nợ Chi phí SXC  15.000  /  Có Giá vốn hàng bán  15.000</code></pre>
<p>Đã phân bổ &gt; thực tế → <strong>phân bổ thừa</strong> (các công việc bị tính chi phí cao; giảm giá vốn). Đã phân bổ &lt; thực tế → <strong>phân bổ thiếu</strong> (tăng giá vốn). Nếu số tiền trọng yếu, phân bổ chênh lệch cho sản phẩm dở dang, thành phẩm và giá vốn theo tỷ lệ chi phí SXC đã phân bổ nằm trong số dư cuối kỳ của từng khoản. Ở Việt Nam, doanh nghiệp áp dụng chế độ kế toán doanh nghiệp (Thông tư 99/2025/TT-BTC, thay Thông tư 200/2014 từ 01/01/2026) tập hợp chi phí sản xuất theo khoản mục vào TK 621, 622, 627 rồi kết chuyển sang TK 154 (chi phí sản xuất kinh doanh dở dang); doanh nghiệp nhỏ và vừa theo Thông tư 133/2016 hạch toán thẳng vào TK 154, chi tiết theo khoản mục. Kiểm văn bản đang có hiệu lực.</p>
<h3>Chi phí theo quá trình: sản lượng tương đương (phương pháp bình quân gia quyền)</h3>
<p>Cuối kỳ, quá trình sản xuất còn sản phẩm làm dở, nên chi phí được chia cho <strong>sản lượng tương đương</strong> — số sản phẩm hoàn chỉnh tương đương với khối lượng công việc đã làm. Số liệu minh hoạ của phân xưởng Trộn:</p>
<pre><code>Số lượng: dở dang đầu kỳ 2.000 + đưa vào 18.000 = hoàn thành 17.000 + dở dang cuối kỳ 3.000
Dở dang cuối kỳ: hoàn thành 100% về NVL, 40% về chi phí chuyển đổi

Sản lượng tương đương (bình quân gia quyền) = SP hoàn thành + SLTĐ của dở dang cuối kỳ
  NVL           : 17.000 + 3.000 x 100% = 20.000
  Chuyển đổi    : 17.000 + 3.000 x 40%  = 18.200

Chi phí (dở dang đầu kỳ + phát sinh):  NVL        10.000 + 90.000 = 100.000
                                        chuyển đổi  5.000 + 67.800 =  72.800
Chi phí mỗi SLTĐ: NVL 100.000 / 20.000 = 5,00; chuyển đổi 72.800 / 18.200 = 4,00
Chuyển sang bước sau  17.000 x (5,00 + 4,00)        = 153.000
Dở dang cuối kỳ       3.000 x 5,00 + 1.200 x 4,00   =  19.800
Tổng chi phí đã phân phối                            = 172.800 ✓</code></pre>
<div class="callout"><span class="badge">Cẩn thận</span> Tỷ lệ phân bổ SXC phải dựa trên tiêu thức thực sự <em>làm phát sinh</em> chi phí SXC. Nếu phần lớn chi phí SXC do máy móc chứ không do con người gây ra, tỷ lệ theo giờ công sẽ làm sai lệch chi phí công việc — vấn đề mà phương pháp ABC (bài 3.2) giải quyết.</div>`,
  ]]);

const c6 = doc('acc302-3-2-activity-based-costing', '3.2 — Activity-based costing (ABC)|||3.2 — Xác định chi phí theo hoạt động (ABC)',
  'Vì sao tỷ lệ phân bổ chung toàn nhà máy làm sai lệch giá thành, thứ bậc chi phí (cấp đơn vị, lô, sản phẩm, khách hàng, duy trì tổ chức), năm bước của ABC, ví dụ số so sánh ABC với phân bổ truyền thống cho sản phẩm tiêu chuẩn và cao cấp, lợi ích và giới hạn.',
  [[
    `<span class="eyebrow">ACC302 · Part 3 · Lesson 3.2</span>
<h2>Activity-based costing (ABC)</h2>
<p class="lead">A single plantwide overhead rate assumes that overhead grows with volume. Much of it does not: setting up a machine costs the same whether the batch has 10 units or 10,000. ABC assigns overhead according to the <strong>activities</strong> that products actually consume.</p>
<h3>The cost hierarchy</h3>
<table>
<tr><th>Level</th><th>Cost is caused by…</th><th>Examples</th></tr>
<tr><td>Unit-level</td><td>each unit produced</td><td>Machine running time, power for machines</td></tr>
<tr><td>Batch-level</td><td>each batch, regardless of its size</td><td>Machine setups, purchase orders, quality inspection of a batch</td></tr>
<tr><td>Product-level</td><td>a specific product line, regardless of volume</td><td>Designing a product, maintaining parts lists</td></tr>
<tr><td>Customer-level</td><td>a specific customer</td><td>Sales calls, technical support for a customer</td></tr>
<tr><td>Organization-sustaining</td><td>keeping the business running at all</td><td>Factory security, the CEO’s salary — not assigned to products in ABC</td></tr>
</table>
<h3>Five steps</h3>
<ol>
<li>Identify and define activities and <strong>activity cost pools</strong>.</li>
<li>Assign overhead costs to the pools (often via interviews and resource-consumption estimates).</li>
<li>Compute an <strong>activity rate</strong> for each pool = pool cost / total quantity of its <strong>activity measure (cost driver)</strong>.</li>
<li>Assign costs to products using the activity rates.</li>
<li>Prepare reports and act — redesign products, change batch sizes, reprice.</li>
</ol>
<h3>Worked comparison</h3>
<p>A fictional manufacturer makes a high-volume Standard model (10,000 units) and a low-volume Deluxe model (2,000 units). Annual overhead is 500,000 (illustrative figures).</p>
<pre><code>TRADITIONAL: one plantwide rate on direct labor-hours (DLH)
  DLH: Standard 10,000 x 2.0 = 20,000; Deluxe 2,000 x 2.5 = 5,000; total 25,000
  Rate = 500,000 / 25,000 = 20 per DLH
  Standard 20,000 x 20 = 400,000  →  40 per unit
  Deluxe    5,000 x 20 = 100,000  →  50 per unit

ABC: three activity cost pools
  Pool (driver)                 Cost      Driver total        Rate
  Machine setups (setups)     150,000     50 setups       3,000 per setup
  Purchasing (orders)         100,000     250 orders        400 per order
  Machining (machine-hours)   250,000     50,000 MH           5 per MH

                  Standard                         Deluxe
  Setups          20 x 3,000    =  60,000          30 x 3,000    =  90,000
  Orders         100 x 400      =  40,000         150 x 400      =  60,000
  Machining   40,000 x 5        = 200,000      10,000 x 5        =  50,000
  Total overhead                  300,000                          200,000
  Per unit                             30                              100</code></pre>
<table>
<tr><th>Unit product cost</th><th>Standard</th><th>Deluxe</th></tr>
<tr><td>Direct materials</td><td>60</td><td>90</td></tr>
<tr><td>Direct labor (at 15 per DLH)</td><td>30</td><td>37.50</td></tr>
<tr><td>Overhead — traditional / ABC</td><td>40 / 30</td><td>50 / 100</td></tr>
<tr><td>Unit cost — traditional / ABC</td><td>130 / 120</td><td>177.50 / 227.50</td></tr>
</table>
<p>Total overhead is still 500,000 under both systems — ABC only redistributes it. The traditional rate <strong>overcosts</strong> the high-volume Standard and <strong>undercosts</strong> the low-volume, complex Deluxe, which uses many setups and orders for few units. A firm that priced Deluxe at cost-plus on 177.50 could be losing money on every unit while believing it is profitable.</p>
<h3>Benefits and limits</h3>
<ul>
<li>More accurate costs for pricing, product-mix and customer-profitability decisions; points to activities that can be reduced (<em>activity-based management</em>).</li>
<li>Costly and time-consuming to design and maintain; relies on judgment in assigning costs to pools.</li>
<li>Management-oriented ABC often departs from external reporting rules (it may exclude organization-sustaining costs and include some selling costs), so it is usually a supplement to the official costing system.</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> ABC is most valuable when overhead is large, products differ greatly in volume, batch size or complexity, and the current system produces costs that managers no longer believe.</div>`,
    `<span class="eyebrow">ACC302 · Phần 3 · Bài 3.2</span>
<h2>Xác định chi phí theo hoạt động (ABC)</h2>
<p class="lead">Một tỷ lệ phân bổ chung toàn nhà máy ngầm giả định chi phí sản xuất chung tăng theo sản lượng. Phần lớn không như vậy: chuẩn bị (thiết lập) máy tốn như nhau dù lô có 10 hay 10.000 sản phẩm. ABC phân bổ chi phí SXC theo các <strong>hoạt động</strong> mà sản phẩm thực sự sử dụng.</p>
<h3>Thứ bậc chi phí</h3>
<table>
<tr><th>Cấp độ</th><th>Chi phí phát sinh do…</th><th>Ví dụ</th></tr>
<tr><td>Cấp đơn vị sản phẩm</td><td>từng sản phẩm được sản xuất</td><td>Thời gian chạy máy, điện cho máy</td></tr>
<tr><td>Cấp lô</td><td>từng lô, bất kể lô lớn hay nhỏ</td><td>Thiết lập máy, đơn đặt mua hàng, kiểm tra chất lượng lô</td></tr>
<tr><td>Cấp sản phẩm</td><td>một dòng sản phẩm cụ thể, bất kể sản lượng</td><td>Thiết kế sản phẩm, duy trì danh mục chi tiết</td></tr>
<tr><td>Cấp khách hàng</td><td>một khách hàng cụ thể</td><td>Viếng thăm bán hàng, hỗ trợ kỹ thuật cho khách hàng</td></tr>
<tr><td>Duy trì tổ chức</td><td>việc duy trì hoạt động của doanh nghiệp</td><td>Bảo vệ nhà máy, lương tổng giám đốc — không phân bổ cho sản phẩm trong ABC</td></tr>
</table>
<h3>Năm bước</h3>
<ol>
<li>Xác định các hoạt động và <strong>nhóm chi phí hoạt động</strong>.</li>
<li>Tập hợp chi phí SXC vào các nhóm (thường qua phỏng vấn và ước tính mức sử dụng nguồn lực).</li>
<li>Tính <strong>đơn giá hoạt động</strong> cho từng nhóm = chi phí của nhóm / tổng mức của <strong>tiêu thức đo hoạt động (tác nhân chi phí)</strong>.</li>
<li>Phân bổ chi phí cho sản phẩm theo đơn giá hoạt động.</li>
<li>Lập báo cáo và hành động — thiết kế lại sản phẩm, đổi cỡ lô, định giá lại.</li>
</ol>
<h3>So sánh bằng ví dụ</h3>
<p>Một nhà sản xuất giả định làm mẫu Tiêu chuẩn sản lượng lớn (10.000 sản phẩm) và mẫu Cao cấp sản lượng nhỏ (2.000 sản phẩm). Chi phí SXC cả năm là 500.000 (số liệu minh hoạ).</p>
<pre><code>TRUYỀN THỐNG: một tỷ lệ chung toàn nhà máy theo giờ LĐTT
  Giờ LĐTT: Tiêu chuẩn 10.000 x 2,0 = 20.000; Cao cấp 2.000 x 2,5 = 5.000; tổng 25.000
  Tỷ lệ = 500.000 / 25.000 = 20 mỗi giờ LĐTT
  Tiêu chuẩn 20.000 x 20 = 400.000  →  40 mỗi sản phẩm
  Cao cấp     5.000 x 20 = 100.000  →  50 mỗi sản phẩm

ABC: ba nhóm chi phí hoạt động
  Nhóm (tác nhân)                 Chi phí     Tổng tác nhân       Đơn giá
  Thiết lập máy (số lần)          150.000     50 lần          3.000 mỗi lần
  Mua hàng (số đơn đặt mua)       100.000     250 đơn           400 mỗi đơn
  Gia công (giờ máy)              250.000     50.000 giờ máy      5 mỗi giờ máy

                  Tiêu chuẩn                       Cao cấp
  Thiết lập       20 x 3.000    =  60.000          30 x 3.000    =  90.000
  Đơn đặt mua    100 x 400      =  40.000         150 x 400      =  60.000
  Gia công    40.000 x 5        = 200.000      10.000 x 5        =  50.000
  Tổng SXC                        300.000                          200.000
  Mỗi sản phẩm                         30                              100</code></pre>
<table>
<tr><th>Chi phí đơn vị sản phẩm</th><th>Tiêu chuẩn</th><th>Cao cấp</th></tr>
<tr><td>NVL trực tiếp</td><td>60</td><td>90</td></tr>
<tr><td>Nhân công trực tiếp (15 mỗi giờ LĐTT)</td><td>30</td><td>37,50</td></tr>
<tr><td>SXC — truyền thống / ABC</td><td>40 / 30</td><td>50 / 100</td></tr>
<tr><td>Chi phí đơn vị — truyền thống / ABC</td><td>130 / 120</td><td>177,50 / 227,50</td></tr>
</table>
<p>Tổng chi phí SXC vẫn là 500.000 ở cả hai hệ thống — ABC chỉ phân phối lại. Tỷ lệ truyền thống <strong>tính cao</strong> chi phí cho mẫu Tiêu chuẩn sản lượng lớn và <strong>tính thấp</strong> cho mẫu Cao cấp sản lượng nhỏ, phức tạp, vốn dùng nhiều lần thiết lập và đơn đặt mua cho ít sản phẩm. Một doanh nghiệp định giá mẫu Cao cấp theo phương pháp cộng lãi trên 177,50 có thể lỗ trên từng sản phẩm mà vẫn tưởng là có lãi.</p>
<h3>Lợi ích và giới hạn</h3>
<ul>
<li>Chi phí chính xác hơn cho quyết định định giá, cơ cấu sản phẩm và khả năng sinh lời theo khách hàng; chỉ ra các hoạt động có thể cắt giảm (<em>quản trị dựa trên hoạt động</em>).</li>
<li>Tốn kém, mất thời gian để thiết kế và duy trì; phụ thuộc vào xét đoán khi phân chi phí vào các nhóm.</li>
<li>ABC phục vụ quản trị thường khác quy định lập báo cáo tài chính (có thể loại chi phí duy trì tổ chức và đưa vào một số chi phí bán hàng), nên thường là hệ thống bổ sung cho hệ thống tính giá thành chính thức.</li>
</ul>
<div class="callout"><span class="badge">Bài học chính</span> ABC có giá trị nhất khi chi phí SXC lớn, các sản phẩm khác nhau nhiều về sản lượng, cỡ lô hoặc độ phức tạp, và hệ thống hiện tại cho ra những con số chi phí mà nhà quản trị không còn tin.</div>`,
  ]]);

const c7 = doc('acc302-3-3-variable-absorption', '3.3 — Variable costing vs absorption costing|||3.3 — Phương pháp chi phí biến đổi và phương pháp chi phí toàn bộ',
  'Khác biệt giữa phương pháp chi phí toàn bộ và chi phí biến đổi (trực tiếp) trong tính giá thành đơn vị, báo cáo kết quả kinh doanh hai năm theo hai phương pháp, đối chiếu lợi nhuận qua định phí SXC trong tồn kho, quy tắc sản xuất lớn hơn/nhỏ hơn tiêu thụ, ưu nhược điểm và yêu cầu của chuẩn mực.',
  [[
    `<span class="eyebrow">ACC302 · Part 3 · Lesson 3.3</span>
<h2>Variable costing vs absorption costing</h2>
<p class="lead">The two methods differ in one item only — <strong>fixed manufacturing overhead</strong>. Absorption costing treats it as a product cost; variable costing treats it as a period cost. That single difference can make two income statements for the same year show different profits.</p>
<table>
<tr><th>Cost</th><th>Absorption (full) costing</th><th>Variable (direct) costing</th></tr>
<tr><td>Direct materials, direct labor, variable overhead</td><td>Product cost</td><td>Product cost</td></tr>
<tr><td>Fixed manufacturing overhead</td><td>Product cost (in inventory until sold)</td><td>Period cost (expensed in full each period)</td></tr>
<tr><td>Selling and administrative (variable and fixed)</td><td>Period cost</td><td>Period cost</td></tr>
</table>
<h3>Illustration (fictional company, assumed figures)</h3>
<pre><code>Price 100 per unit. Variable manufacturing cost: DM 20 + DL 15 + VOH 5 = 40 per unit
Fixed manufacturing overhead 300,000 per year; production 10,000 units each year
Variable selling 10 per unit sold; fixed selling and administrative 100,000 per year
Unit product cost: variable costing 40; absorption 40 + 300,000 / 10,000 = 70
Year 1: produced 10,000, sold 8,000 (no beginning inventory)
Year 2: produced 10,000, sold 12,000</code></pre>
<table>
<tr><th>ABSORPTION COSTING</th><th>Year 1</th><th>Year 2</th></tr>
<tr><td>Sales</td><td>800,000</td><td>1,200,000</td></tr>
<tr><td>Cost of goods sold (x 70)</td><td>(560,000)</td><td>(840,000)</td></tr>
<tr><td>Gross margin</td><td>240,000</td><td>360,000</td></tr>
<tr><td>Selling and administrative (variable + fixed)</td><td>(180,000)</td><td>(220,000)</td></tr>
<tr><td><strong>Net operating income</strong></td><td><strong>60,000</strong></td><td><strong>140,000</strong></td></tr>
<tr><th>VARIABLE COSTING</th><th>Year 1</th><th>Year 2</th></tr>
<tr><td>Sales</td><td>800,000</td><td>1,200,000</td></tr>
<tr><td>Variable expenses (x 40 + x 10)</td><td>(400,000)</td><td>(600,000)</td></tr>
<tr><td>Contribution margin</td><td>400,000</td><td>600,000</td></tr>
<tr><td>Fixed manufacturing overhead + fixed S&amp;A</td><td>(400,000)</td><td>(400,000)</td></tr>
<tr><td><strong>Net operating income</strong></td><td><strong>0</strong></td><td><strong>200,000</strong></td></tr>
</table>
<h3>Reconciling the two profits</h3>
<pre><code>Variable costing NOI
+ Fixed MOH deferred in ending inventory
− Fixed MOH released from beginning inventory
= Absorption costing NOI

Year 1: 0 + 2,000 units x 30 − 0              = 60,000  ✓
Year 2: 200,000 + 0 − 2,000 units x 30        = 140,000 ✓
Two years together: 200,000 under both methods</code></pre>
<ul>
<li>Production &gt; sales (inventory rises) → absorption income &gt; variable income.</li>
<li>Production &lt; sales (inventory falls) → absorption income &lt; variable income.</li>
<li>Production = sales → the two incomes are equal (when unit fixed costs are unchanged).</li>
</ul>
<h3>Which one to use?</h3>
<p>Absorption costing is required for external financial statements: inventory standards (IAS 2 internationally; VAS 02 “Inventories” in Vietnam — check the standards currently in force) include fixed production overhead in inventory, allocated on normal capacity. Variable costing is for internal use: it fits CVP analysis, profit moves in the same direction as sales, and managers cannot raise reported profit simply by <strong>producing more than they sell</strong> — a real risk under absorption costing when bonuses depend on profit.</p>
<div class="callout"><span class="badge">Remember</span> Over the long run the two methods report the same total profit; they differ only in <em>when</em> fixed manufacturing overhead reaches the income statement.</div>`,
    `<span class="eyebrow">ACC302 · Phần 3 · Bài 3.3</span>
<h2>Phương pháp chi phí biến đổi và phương pháp chi phí toàn bộ</h2>
<p class="lead">Hai phương pháp chỉ khác nhau ở một khoản — <strong>định phí sản xuất chung</strong>. Phương pháp chi phí toàn bộ coi nó là chi phí sản phẩm; phương pháp chi phí biến đổi coi nó là chi phí thời kỳ. Chỉ khác biệt đó cũng có thể khiến hai báo cáo kết quả kinh doanh của cùng một năm cho ra hai mức lợi nhuận khác nhau.</p>
<table>
<tr><th>Chi phí</th><th>Phương pháp chi phí toàn bộ</th><th>Phương pháp chi phí biến đổi (trực tiếp)</th></tr>
<tr><td>NVL trực tiếp, nhân công trực tiếp, biến phí SXC</td><td>Chi phí sản phẩm</td><td>Chi phí sản phẩm</td></tr>
<tr><td>Định phí sản xuất chung</td><td>Chi phí sản phẩm (nằm trong tồn kho tới khi bán)</td><td>Chi phí thời kỳ (ghi nhận toàn bộ vào chi phí mỗi kỳ)</td></tr>
<tr><td>Chi phí bán hàng và quản lý (biến đổi và cố định)</td><td>Chi phí thời kỳ</td><td>Chi phí thời kỳ</td></tr>
</table>
<h3>Minh hoạ (công ty giả định, số liệu giả định)</h3>
<pre><code>Giá bán 100 mỗi sản phẩm. Biến phí sản xuất: NVLTT 20 + NCTT 15 + biến phí SXC 5 = 40 mỗi sản phẩm
Định phí SXC 300.000 mỗi năm; sản xuất 10.000 sản phẩm mỗi năm
Biến phí bán hàng 10 mỗi sản phẩm bán ra; định phí bán hàng và quản lý 100.000 mỗi năm
Giá thành đơn vị: chi phí biến đổi 40; chi phí toàn bộ 40 + 300.000 / 10.000 = 70
Năm 1: sản xuất 10.000, tiêu thụ 8.000 (không có tồn kho đầu kỳ)
Năm 2: sản xuất 10.000, tiêu thụ 12.000</code></pre>
<table>
<tr><th>PHƯƠNG PHÁP CHI PHÍ TOÀN BỘ</th><th>Năm 1</th><th>Năm 2</th></tr>
<tr><td>Doanh thu</td><td>800.000</td><td>1.200.000</td></tr>
<tr><td>Giá vốn hàng bán (x 70)</td><td>(560.000)</td><td>(840.000)</td></tr>
<tr><td>Lợi nhuận gộp</td><td>240.000</td><td>360.000</td></tr>
<tr><td>Chi phí bán hàng và quản lý (biến đổi + cố định)</td><td>(180.000)</td><td>(220.000)</td></tr>
<tr><td><strong>Lợi nhuận thuần</strong></td><td><strong>60.000</strong></td><td><strong>140.000</strong></td></tr>
<tr><th>PHƯƠNG PHÁP CHI PHÍ BIẾN ĐỔI</th><th>Năm 1</th><th>Năm 2</th></tr>
<tr><td>Doanh thu</td><td>800.000</td><td>1.200.000</td></tr>
<tr><td>Biến phí (x 40 + x 10)</td><td>(400.000)</td><td>(600.000)</td></tr>
<tr><td>Số dư đảm phí</td><td>400.000</td><td>600.000</td></tr>
<tr><td>Định phí SXC + định phí bán hàng và quản lý</td><td>(400.000)</td><td>(400.000)</td></tr>
<tr><td><strong>Lợi nhuận thuần</strong></td><td><strong>0</strong></td><td><strong>200.000</strong></td></tr>
</table>
<h3>Đối chiếu lợi nhuận giữa hai phương pháp</h3>
<pre><code>Lợi nhuận theo chi phí biến đổi
+ Định phí SXC nằm lại trong tồn kho cuối kỳ
− Định phí SXC từ tồn kho đầu kỳ chuyển vào giá vốn kỳ này
= Lợi nhuận theo chi phí toàn bộ

Năm 1: 0 + 2.000 sp x 30 − 0              = 60.000  ✓
Năm 2: 200.000 + 0 − 2.000 sp x 30        = 140.000 ✓
Cộng hai năm: 200.000 theo cả hai phương pháp</code></pre>
<ul>
<li>Sản xuất &gt; tiêu thụ (tồn kho tăng) → lợi nhuận toàn bộ &gt; lợi nhuận biến đổi.</li>
<li>Sản xuất &lt; tiêu thụ (tồn kho giảm) → lợi nhuận toàn bộ &lt; lợi nhuận biến đổi.</li>
<li>Sản xuất = tiêu thụ → hai mức lợi nhuận bằng nhau (khi định phí đơn vị không đổi).</li>
</ul>
<h3>Dùng phương pháp nào?</h3>
<p>Báo cáo tài chính bắt buộc dùng phương pháp chi phí toàn bộ: chuẩn mực về hàng tồn kho (IAS 2 trên thế giới; VAS 02 “Hàng tồn kho” ở Việt Nam — kiểm chuẩn mực đang có hiệu lực) đưa định phí sản xuất chung vào giá trị hàng tồn kho, phân bổ theo công suất bình thường. Phương pháp chi phí biến đổi dùng cho nội bộ: nó khớp với phân tích CVP, lợi nhuận đi cùng chiều với doanh thu, và nhà quản trị không thể nâng lợi nhuận báo cáo chỉ bằng cách <strong>sản xuất nhiều hơn bán</strong> — một rủi ro có thật với phương pháp chi phí toàn bộ khi tiền thưởng gắn với lợi nhuận.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Về dài hạn hai phương pháp báo cáo cùng tổng lợi nhuận; chúng chỉ khác nhau ở <em>thời điểm</em> định phí sản xuất chung đi vào báo cáo kết quả kinh doanh.</div>`,
  ]]);

const c7q = quiz('acc302-quiz-3', 'Quiz 3 — Product costing systems|||Quiz 3 — Hệ thống xác định chi phí sản phẩm', [
  { id: 'q1', question: 'Estimated overhead is 360,000 and estimated machine-hours are 24,000. Actual overhead is 372,000 and actual machine-hours are 25,000. Overhead for the year is…|||Chi phí SXC ước tính 360.000, số giờ máy ước tính 24.000. Chi phí SXC thực tế 372.000, số giờ máy thực tế 25.000. Chi phí SXC trong năm được…', options: ['underapplied by 12,000|||phân bổ thiếu 12.000', 'underapplied by 3,000|||phân bổ thiếu 3.000', 'overapplied by 15,000|||phân bổ thừa 15.000', 'overapplied by 3,000|||phân bổ thừa 3.000'], correctIndex: 3, explanation: 'POHR = 360,000 / 24,000 = 15; applied = 25,000 x 15 = 375,000 &gt; actual 372,000, so overhead is overapplied by 3,000.|||Tỷ lệ phân bổ = 360.000 / 24.000 = 15; đã phân bổ = 25.000 x 15 = 375.000 &gt; thực tế 372.000, nên phân bổ thừa 3.000.' },
  { id: 'q2', question: 'A new company produces 5,000 units and sells 4,000. Fixed manufacturing overhead is 50,000. Compared with variable costing, absorption costing net operating income is…|||Một công ty mới sản xuất 5.000 sản phẩm và bán 4.000. Định phí SXC là 50.000. So với phương pháp chi phí biến đổi, lợi nhuận theo phương pháp chi phí toàn bộ…', options: ['10,000 lower|||thấp hơn 10.000', '10,000 higher|||cao hơn 10.000', 'the same|||bằng nhau', '50,000 higher|||cao hơn 50.000'], correctIndex: 1, explanation: 'Fixed overhead is 10 per unit (50,000 / 5,000); 1,000 units stay in inventory carrying 10,000 of fixed overhead, which absorption costing defers.|||Định phí SXC là 10 mỗi sản phẩm (50.000 / 5.000); 1.000 sản phẩm tồn kho mang theo 10.000 định phí, khoản mà phương pháp toàn bộ hoãn lại.' },
  { id: 'q3', question: 'In the ABC cost hierarchy, which activity is batch-level?|||Trong thứ bậc chi phí của ABC, hoạt động nào thuộc cấp lô?', options: ['Designing a new product model|||Thiết kế một mẫu sản phẩm mới', 'Running machines on each unit|||Chạy máy trên từng sản phẩm', 'Setting up machines for a production run|||Thiết lập máy cho một đợt sản xuất', 'Paying the factory security guard|||Trả lương bảo vệ nhà máy'], correctIndex: 2, explanation: 'A setup is performed once per batch whatever its size. Design is product-level, machine running is unit-level, security is organization-sustaining.|||Thiết lập máy được làm một lần cho mỗi lô bất kể cỡ lô. Thiết kế là cấp sản phẩm, chạy máy là cấp đơn vị, bảo vệ là duy trì tổ chức.' },
]);

const c8 = doc('acc302-4-1-master-budget', '4.1 — The master budget|||4.1 — Dự toán tổng thể',
  'Lợi ích của dự toán, dự toán có sự tham gia, dự toán cuốn chiếu, khe hở dự toán; trình tự dự toán tổng thể; ví dụ số ba tháng: dự toán tiêu thụ, lịch thu tiền, dự toán sản xuất, dự toán mua nguyên vật liệu, dự toán tiền với nhu cầu vay.',
  [[
    `<span class="eyebrow">ACC302 · Part 4 · Lesson 4.1</span>
<h2>The master budget</h2>
<p class="lead">A budget is a detailed plan for the future, expressed in numbers. The <strong>master budget</strong> is a set of interlocking budgets that together describe a company’s plans for sales, production, spending, cash and financing for the coming period.</p>
<h3>Why budget — and how</h3>
<ul>
<li>Budgets communicate plans, force managers to think ahead, allocate scarce resources, uncover bottlenecks early, coordinate departments and give a benchmark for evaluating results.</li>
<li>A <strong>participative (self-imposed) budget</strong> is prepared with the managers who must meet it; it improves commitment but must be reviewed for <strong>budgetary slack</strong> (deliberately easy targets).</li>
<li>A <strong>continuous (rolling) budget</strong> always looks 12 months ahead: when a month ends, a new month is added.</li>
</ul>
<h3>The sequence</h3>
<ol>
<li><strong>Sales budget</strong> — the starting point; everything else depends on the sales forecast.</li>
<li><strong>Production budget</strong> (a merchandiser prepares a merchandise purchases budget instead).</li>
<li><strong>Direct materials, direct labor and manufacturing overhead budgets</strong>, then the ending finished goods inventory budget.</li>
<li><strong>Selling and administrative expense budget</strong>.</li>
<li><strong>Cash budget</strong> — receipts, disbursements, financing.</li>
<li><strong>Budgeted income statement</strong> and <strong>budgeted balance sheet</strong>.</li>
</ol>
<h3>Worked example (fictional company, assumed figures)</h3>
<p>Lam Son Garden Chairs sells one chair at $50. Forecast sales: April 10,000 units, May 12,000, June 15,000, July 11,000.</p>
<pre><code>SALES BUDGET                 April      May        June       Quarter
Units                       10,000     12,000     15,000     37,000
Sales ($50)                500,000    600,000    750,000  1,850,000

EXPECTED CASH COLLECTIONS  (70% in the month of sale, 30% the following month)
From March (AR 1 April)    120,000                           120,000
From April sales           350,000    150,000                500,000
From May sales                        420,000    180,000     600,000
From June sales                                  525,000     525,000
Total collections          470,000    570,000    705,000  1,745,000
(Accounts receivable at 30 June = 30% x 750,000 = 225,000)

PRODUCTION BUDGET  (desired ending finished goods = 20% of next month’s sales)
Budgeted sales              10,000     12,000     15,000
+ Desired ending inventory   2,400      3,000      2,200
− Beginning inventory       (2,000)    (2,400)    (3,000)
= Required production       10,400     12,600     14,200     37,200

DIRECT MATERIALS PURCHASES  (2 kg per chair at $5; ending RM = 10% of next month’s needs)
Production needs (kg)       20,800     25,200     28,400
+ Desired ending RM (kg)     2,520      2,840      2,500  (June: assumed)
− Beginning RM (kg)         (2,080)    (2,520)    (2,840)
= Kg to purchase            21,240     25,520     28,060
Cost of purchases ($5)     106,200    127,600    140,300</code></pre>
<h3>The cash budget (April)</h3>
<pre><code>Beginning cash balance                               40,000
+ Collections from customers                        470,000
= Total cash available                              510,000
− Disbursements
    Materials (payments, incl. March payables)      105,000   (assumed)
    Direct labor  10,400 units x 0.5 h x $20        104,000
    Manufacturing overhead (cash items only)         60,000
    Selling and administrative                       90,000
    Equipment purchase                              150,000
    Total disbursements                             509,000
= Excess of cash available over disbursements         1,000
Financing: minimum balance 30,000, borrow in multiples of 10,000
  Borrowing                                          30,000
Ending cash balance                                  31,000</code></pre>
<p>Depreciation is left out of the cash budget because it is not a cash payment. The cash budget reveals the April shortfall weeks in advance, so the loan can be arranged calmly rather than in a crisis.</p>
<div class="callout"><span class="badge">Key lesson</span> The sales forecast drives everything. An optimistic sales number flows into production, purchases, labor and cash — so a budget is only as good as its first line.</div>`,
    `<span class="eyebrow">ACC302 · Phần 4 · Bài 4.1</span>
<h2>Dự toán tổng thể</h2>
<p class="lead">Dự toán là kế hoạch chi tiết cho tương lai, thể hiện bằng con số. <strong>Dự toán tổng thể</strong> là một hệ thống các dự toán liên kết với nhau, cùng mô tả kế hoạch tiêu thụ, sản xuất, chi tiêu, tiền và tài trợ của doanh nghiệp cho kỳ tới.</p>
<h3>Vì sao lập dự toán — và lập thế nào</h3>
<ul>
<li>Dự toán truyền đạt kế hoạch, buộc nhà quản trị nghĩ trước, phân bổ nguồn lực khan hiếm, phát hiện sớm điểm nghẽn, phối hợp các bộ phận và cung cấp chuẩn để đánh giá kết quả.</li>
<li><strong>Dự toán có sự tham gia (tự lập)</strong> được xây dựng cùng những nhà quản trị phải thực hiện nó; tăng sự cam kết nhưng phải được rà soát để tránh <strong>khe hở dự toán</strong> (cố ý đặt chỉ tiêu dễ).</li>
<li><strong>Dự toán liên tục (cuốn chiếu)</strong> luôn nhìn trước 12 tháng: hết một tháng thì bổ sung thêm một tháng mới.</li>
</ul>
<h3>Trình tự lập</h3>
<ol>
<li><strong>Dự toán tiêu thụ</strong> — điểm xuất phát; mọi dự toán khác đều phụ thuộc dự báo tiêu thụ.</li>
<li><strong>Dự toán sản xuất</strong> (doanh nghiệp thương mại lập dự toán mua hàng thay thế).</li>
<li><strong>Dự toán chi phí NVL trực tiếp, nhân công trực tiếp và sản xuất chung</strong>, sau đó là dự toán thành phẩm tồn kho cuối kỳ.</li>
<li><strong>Dự toán chi phí bán hàng và quản lý doanh nghiệp</strong>.</li>
<li><strong>Dự toán tiền</strong> — thu, chi, tài trợ.</li>
<li><strong>Báo cáo kết quả kinh doanh dự toán</strong> và <strong>bảng cân đối kế toán dự toán</strong>.</li>
</ol>
<h3>Ví dụ (công ty giả định, số liệu giả định)</h3>
<p>Ghế Sân Vườn Lam Sơn bán một mẫu ghế giá 50 $. Dự báo tiêu thụ: tháng 4 là 10.000 chiếc, tháng 5 là 12.000, tháng 6 là 15.000, tháng 7 là 11.000.</p>
<pre><code>DỰ TOÁN TIÊU THỤ             Tháng 4    Tháng 5    Tháng 6    Quý
Số lượng                     10.000     12.000     15.000     37.000
Doanh thu (50 $)            500.000    600.000    750.000  1.850.000

LỊCH THU TIỀN DỰ KIẾN  (thu 70% ngay trong tháng bán, 30% vào tháng sau)
Từ tháng 3 (phải thu 1/4)   120.000                           120.000
Từ doanh thu tháng 4        350.000    150.000                500.000
Từ doanh thu tháng 5                   420.000    180.000     600.000
Từ doanh thu tháng 6                              525.000     525.000
Tổng tiền thu               470.000    570.000    705.000  1.745.000
(Phải thu khách hàng ngày 30/6 = 30% x 750.000 = 225.000)

DỰ TOÁN SẢN XUẤT  (thành phẩm tồn cuối kỳ mong muốn = 20% tiêu thụ tháng sau)
Tiêu thụ dự toán             10.000     12.000     15.000
+ Tồn kho cuối kỳ mong muốn   2.400      3.000      2.200
− Tồn kho đầu kỳ             (2.000)    (2.400)    (3.000)
= Số lượng cần sản xuất      10.400     12.600     14.200     37.200

DỰ TOÁN MUA NGUYÊN VẬT LIỆU  (2 kg mỗi ghế, 5 $/kg; NVL tồn cuối = 10% nhu cầu tháng sau)
Nhu cầu cho sản xuất (kg)    20.800     25.200     28.400
+ NVL tồn cuối mong muốn      2.520      2.840      2.500  (tháng 6: giả định)
− NVL tồn đầu kỳ             (2.080)    (2.520)    (2.840)
= Số kg cần mua              21.240     25.520     28.060
Giá trị mua (5 $)           106.200    127.600    140.300</code></pre>
<h3>Dự toán tiền (tháng 4)</h3>
<pre><code>Tiền tồn đầu kỳ                                      40.000
+ Thu tiền khách hàng                               470.000
= Tổng tiền có thể sử dụng                          510.000
− Các khoản chi
    Trả tiền NVL (gồm cả nợ phải trả tháng 3)       105.000   (giả định)
    Nhân công trực tiếp  10.400 sp x 0,5 giờ x 20 $  104.000
    Chi phí SXC (chỉ các khoản chi bằng tiền)        60.000
    Chi phí bán hàng và quản lý                      90.000
    Mua thiết bị                                    150.000
    Tổng chi                                        509.000
= Chênh lệch thu – chi                                1.000
Tài trợ: tồn quỹ tối thiểu 30.000, vay theo bội số 10.000
  Vay                                                30.000
Tiền tồn cuối kỳ                                     31.000</code></pre>
<p>Khấu hao không có trong dự toán tiền vì không phải khoản chi bằng tiền. Dự toán tiền cho thấy khoản thiếu hụt tháng 4 trước nhiều tuần, nên khoản vay được thu xếp bình tĩnh thay vì trong tình thế khẩn cấp.</p>
<div class="callout"><span class="badge">Bài học chính</span> Dự báo tiêu thụ chi phối mọi thứ. Một con số tiêu thụ lạc quan sẽ chảy vào sản xuất, mua hàng, nhân công và tiền — nên dự toán chỉ tốt bằng dòng đầu tiên của nó.</div>`,
  ]]);

const c9 = doc('acc302-4-2-flexible-budget', '4.2 — Flexible budgets and performance reports|||4.2 — Dự toán linh hoạt và báo cáo thực hiện',
  'Dự toán tĩnh (kế hoạch) và dự toán linh hoạt, tách chênh lệch tổng thành biến động do mức hoạt động và biến động doanh thu – chi tiêu, quy ước thuận lợi (F) và bất lợi (U), vì sao so trực tiếp thực tế với dự toán tĩnh dễ gây hiểu sai; ví dụ số.',
  [[
    `<span class="eyebrow">ACC302 · Part 4 · Lesson 4.2</span>
<h2>Flexible budgets and performance reports</h2>
<p class="lead">A <strong>planning budget</strong> is prepared before the period for one planned level of activity. Actual activity is almost never exactly as planned, so comparing actual costs with the planning budget mixes two very different things: the effect of <em>volume</em> and the effect of <em>price and efficiency</em>.</p>
<h3>The flexible budget</h3>
<p>A <strong>flexible budget</strong> estimates what revenues and costs <em>should have been</em> for the <strong>actual</strong> level of activity, using the same cost formulas as the plan: variable items change with activity, fixed items stay the same.</p>
<p>Illustrative monthly data for a fictional one-product company: price $50; standard variable cost $26 per unit; fixed costs $30,000. Planned volume 1,800 units; actual volume 2,000 units (production = sales). Actual revenue 98,000; actual variable costs 54,180; actual fixed costs 31,000.</p>
<table>
<tr><th></th><th>Actual results</th><th>Revenue &amp; spending variances</th><th>Flexible budget</th><th>Activity variances</th><th>Planning budget</th></tr>
<tr><td>Units</td><td>2,000</td><td></td><td>2,000</td><td></td><td>1,800</td></tr>
<tr><td>Revenue</td><td>98,000</td><td>2,000 U</td><td>100,000</td><td>10,000 F</td><td>90,000</td></tr>
<tr><td>Variable costs</td><td>54,180</td><td>2,180 U</td><td>52,000</td><td>5,200 U</td><td>46,800</td></tr>
<tr><td>Fixed costs</td><td>31,000</td><td>1,000 U</td><td>30,000</td><td>—</td><td>30,000</td></tr>
<tr><td>Net operating income</td><td>12,820</td><td>5,180 U</td><td>18,000</td><td>4,800 F</td><td>13,200</td></tr>
</table>
<h3>Reading the report</h3>
<ul>
<li><strong>Activity variances</strong> (flexible vs planning) come only from selling 200 more units than planned: +10,000 revenue, +5,200 variable cost, +4,800 income. The 5,200 “unfavorable” cost variance is not a control problem — more units are expected to cost more.</li>
<li><strong>Revenue and spending variances</strong> (actual vs flexible) show how well prices and costs were managed at the level actually achieved. Revenue is 2,000 U: the average price was 98,000 / 2,000 = $49 instead of $50. Variable costs overran by 2,180 and fixed costs by 1,000.</li>
<li>Total: 4,800 F + 5,180 U = <strong>380 U</strong>, the same as actual 12,820 vs planned 13,200. A naive comparison would show “only 380 U” and hide a 5,180 U problem behind a volume gain.</li>
</ul>
<h3>Favorable or unfavorable?</h3>
<p>For <strong>revenue</strong>, actual above budget is favorable (F). For <strong>costs</strong>, actual above budget is unfavorable (U). Always state the direction as well as the amount; a variance is a signal to investigate, not a verdict on a manager.</p>
<div class="callout"><span class="badge">Remember</span> Never evaluate cost control by comparing actual costs with a budget for a different level of activity. Flex the budget first — then compare like with like. Lesson 4.3 breaks the 2,180 U variable cost variance into price and quantity effects.</div>`,
    `<span class="eyebrow">ACC302 · Phần 4 · Bài 4.2</span>
<h2>Dự toán linh hoạt và báo cáo thực hiện</h2>
<p class="lead"><strong>Dự toán tĩnh (dự toán kế hoạch)</strong> được lập trước kỳ cho một mức hoạt động kế hoạch. Mức hoạt động thực tế hầu như không bao giờ đúng như kế hoạch, nên so chi phí thực tế với dự toán tĩnh là trộn lẫn hai điều rất khác nhau: ảnh hưởng của <em>khối lượng</em> và ảnh hưởng của <em>giá cả và hiệu quả</em>.</p>
<h3>Dự toán linh hoạt</h3>
<p><strong>Dự toán linh hoạt</strong> ước tính doanh thu và chi phí <em>lẽ ra phải là</em> bao nhiêu ở mức hoạt động <strong>thực tế</strong>, dùng cùng các phương trình chi phí như kế hoạch: khoản biến đổi thay đổi theo mức hoạt động, khoản cố định giữ nguyên.</p>
<p>Số liệu minh hoạ hằng tháng của một công ty giả định sản xuất một sản phẩm: giá bán 50 $; biến phí định mức 26 $ mỗi sản phẩm; định phí 30.000 $. Sản lượng kế hoạch 1.800 sản phẩm; thực tế 2.000 sản phẩm (sản xuất = tiêu thụ). Doanh thu thực tế 98.000; biến phí thực tế 54.180; định phí thực tế 31.000.</p>
<table>
<tr><th></th><th>Thực tế</th><th>Biến động doanh thu &amp; chi tiêu</th><th>Dự toán linh hoạt</th><th>Biến động do mức hoạt động</th><th>Dự toán tĩnh</th></tr>
<tr><td>Số sản phẩm</td><td>2.000</td><td></td><td>2.000</td><td></td><td>1.800</td></tr>
<tr><td>Doanh thu</td><td>98.000</td><td>2.000 U</td><td>100.000</td><td>10.000 F</td><td>90.000</td></tr>
<tr><td>Biến phí</td><td>54.180</td><td>2.180 U</td><td>52.000</td><td>5.200 U</td><td>46.800</td></tr>
<tr><td>Định phí</td><td>31.000</td><td>1.000 U</td><td>30.000</td><td>—</td><td>30.000</td></tr>
<tr><td>Lợi nhuận thuần</td><td>12.820</td><td>5.180 U</td><td>18.000</td><td>4.800 F</td><td>13.200</td></tr>
</table>
<h3>Đọc báo cáo</h3>
<ul>
<li><strong>Biến động do mức hoạt động</strong> (linh hoạt so với tĩnh) chỉ đến từ việc bán nhiều hơn kế hoạch 200 sản phẩm: doanh thu +10.000, biến phí +5.200, lợi nhuận +4.800. Biến động chi phí 5.200 “bất lợi” không phải là vấn đề kiểm soát — làm nhiều sản phẩm hơn thì đương nhiên tốn nhiều chi phí hơn.</li>
<li><strong>Biến động doanh thu và chi tiêu</strong> (thực tế so với linh hoạt) cho thấy giá bán và chi phí được quản lý tốt đến đâu ở mức hoạt động đã đạt được. Doanh thu 2.000 U: giá bán bình quân là 98.000 / 2.000 = 49 $ thay vì 50 $. Biến phí vượt 2.180 và định phí vượt 1.000.</li>
<li>Tổng cộng: 4.800 F + 5.180 U = <strong>380 U</strong>, đúng bằng chênh lệch giữa thực tế 12.820 và kế hoạch 13.200. So sánh đơn giản sẽ cho thấy “chỉ 380 U” và che mất một vấn đề 5.180 U đằng sau phần lợi từ sản lượng.</li>
</ul>
<h3>Thuận lợi hay bất lợi?</h3>
<p>Với <strong>doanh thu</strong>, thực tế cao hơn dự toán là thuận lợi (F). Với <strong>chi phí</strong>, thực tế cao hơn dự toán là bất lợi (U). Luôn nêu chiều cùng với số tiền; biến động là tín hiệu để tìm hiểu, không phải bản án dành cho nhà quản trị.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Đừng bao giờ đánh giá việc kiểm soát chi phí bằng cách so chi phí thực tế với dự toán lập cho một mức hoạt động khác. Hãy linh hoạt hoá dự toán trước — rồi mới so cùng mức. Bài 4.3 tách biến động biến phí 2.180 U thành ảnh hưởng của giá và của lượng.</div>`,
  ]]);

const c10 = doc('acc302-4-3-standard-cost-variances', '4.3 — Standard costs and variance analysis|||4.3 — Chi phí định mức và phân tích biến động',
  'Định mức lượng và định mức giá, phiếu chi phí định mức, mô hình chung phân tích biến động; biến động giá và lượng NVL trực tiếp, biến động đơn giá và năng suất nhân công trực tiếp, biến động chi tiêu và năng suất biến phí SXC; trách nhiệm, quản trị theo ngoại lệ và mối liên hệ giữa các biến động.',
  [[
    `<span class="eyebrow">ACC302 · Part 4 · Lesson 4.3</span>
<h2>Standard costs and variance analysis</h2>
<p class="lead">A <strong>standard</strong> is a benchmark for what an input <em>should</em> cost. Every standard has two parts: a <strong>quantity standard</strong> (how much input per unit) and a <strong>price standard</strong> (how much per unit of input). Comparing actual with standard splits each cost variance into a price part and a quantity part.</p>
<h3>Standard cost card (illustrative, same product as lesson 4.2)</h3>
<table>
<tr><th>Input</th><th>Standard quantity</th><th>Standard price</th><th>Standard cost per unit</th></tr>
<tr><td>Direct materials</td><td>3 kg</td><td>$4.00 per kg</td><td>$12.00</td></tr>
<tr><td>Direct labor</td><td>0.5 hour</td><td>$22.00 per hour</td><td>$11.00</td></tr>
<tr><td>Variable overhead (on labor-hours)</td><td>0.5 hour</td><td>$6.00 per hour</td><td>$3.00</td></tr>
<tr><td colspan="3">Standard variable cost per unit</td><td>$26.00</td></tr>
</table>
<p><em>Ideal</em> standards assume perfect conditions; <em>practical</em> standards allow for normal breaks and waste and are usually preferred because employees see them as fair.</p>
<h3>The general model</h3>
<pre><code>   (1) AQ x AP          (2) AQ x SP          (3) SQ x SP
         └── price variance ──┘  └── quantity variance ──┘
Price variance    = AQ x (AP − SP)      (labor: rate; overhead: rate/spending)
Quantity variance = SP x (AQ − SQ)      (labor and overhead: efficiency)
AQ, AP: actual quantity and actual price; SP: standard price
SQ = standard quantity allowed for the ACTUAL output
Labor and variable overhead: AQ = AH (actual hours), SQ = SH (standard hours allowed), SP = SR (standard rate)
Positive = unfavorable (U); negative = favorable (F)</code></pre>
<h3>Worked variances (actual output 2,000 units)</h3>
<pre><code>Actual: 6,300 kg purchased and used at $3.80; 1,050 labor-hours at $23.00; variable overhead $6,090
Standard allowed: materials 2,000 x 3 = 6,000 kg; hours 2,000 x 0.5 = 1,000 h

DIRECT MATERIALS
  Price variance     6,300 x (3.80 − 4.00)  = −1,260  →  1,260 F
  Quantity variance  4.00 x (6,300 − 6,000) =  1,200  →  1,200 U
  Total  23,940 − 24,000                    =    −60  →     60 F

DIRECT LABOR
  Rate variance        1,050 x (23 − 22)    =  1,050  →  1,050 U
  Efficiency variance  22 x (1,050 − 1,000) =  1,100  →  1,100 U
  Total  24,150 − 22,000                    =  2,150  →  2,150 U

VARIABLE OVERHEAD (actual rate 6,090 / 1,050 = $5.80 per hour)
  Rate (spending) variance  6,090 − 1,050 x 6 =  −210  →  210 F
  Efficiency variance       6 x (1,050 − 1,000) = 300  →  300 U
  Total  6,090 − 6,000                        =    90  →   90 U

All variable cost variances: 60 F + 2,150 U + 90 U = 2,180 U  (the spending variance in lesson 4.2 ✓)</code></pre>
<h3>Who is responsible?</h3>
<table>
<tr><th>Variance</th><th>Usual responsibility</th><th>Typical causes</th></tr>
<tr><td>Materials price</td><td>Purchasing manager</td><td>Market prices, supplier choice, quantity discounts, rush orders</td></tr>
<tr><td>Materials quantity</td><td>Production manager</td><td>Waste, poor-quality materials, untrained workers, faulty machines</td></tr>
<tr><td>Labor rate</td><td>Production manager</td><td>Overtime premiums, using higher-paid workers for simple tasks</td></tr>
<tr><td>Labor and variable overhead efficiency</td><td>Production manager</td><td>Poor supervision, machine breakdowns, poor materials, low motivation</td></tr>
</table>
<ul>
<li><strong>Management by exception</strong>: investigate variances that are large, recurring or growing — not every small one.</li>
<li>Variances interact: here cheaper materials (1,260 F) came with extra usage (1,200 U) — perhaps the cheaper material was of lower quality. Judge a purchasing “saving” together with what it did to production.</li>
<li>Variable overhead efficiency follows labor efficiency because overhead is applied on labor-hours: 50 extra hours cost 50 x 6 = 300.</li>
<li>Fixed overhead is analysed differently (budget and volume variances) and is covered in the full textbooks.</li>
</ul>
<div class="callout"><span class="badge">Watch out</span> SQ and SH are always computed for the <strong>actual output</strong> (2,000 units), never for the planned output. Using the plan would mix the activity variance back into the efficiency variances.</div>`,
    `<span class="eyebrow">ACC302 · Phần 4 · Bài 4.3</span>
<h2>Chi phí định mức và phân tích biến động</h2>
<p class="lead"><strong>Định mức</strong> là chuẩn cho biết một yếu tố đầu vào <em>lẽ ra phải</em> tốn bao nhiêu. Mỗi định mức có hai phần: <strong>định mức lượng</strong> (bao nhiêu đầu vào cho một sản phẩm) và <strong>định mức giá</strong> (bao nhiêu tiền cho một đơn vị đầu vào). So sánh thực tế với định mức tách mỗi biến động chi phí thành phần do giá và phần do lượng.</p>
<h3>Phiếu chi phí định mức (minh hoạ, cùng sản phẩm với bài 4.2)</h3>
<table>
<tr><th>Yếu tố</th><th>Định mức lượng</th><th>Định mức giá</th><th>Chi phí định mức mỗi sản phẩm</th></tr>
<tr><td>NVL trực tiếp</td><td>3 kg</td><td>4,00 $ mỗi kg</td><td>12,00 $</td></tr>
<tr><td>Nhân công trực tiếp</td><td>0,5 giờ</td><td>22,00 $ mỗi giờ</td><td>11,00 $</td></tr>
<tr><td>Biến phí SXC (theo giờ công)</td><td>0,5 giờ</td><td>6,00 $ mỗi giờ</td><td>3,00 $</td></tr>
<tr><td colspan="3">Biến phí định mức mỗi sản phẩm</td><td>26,00 $</td></tr>
</table>
<p>Định mức <em>lý tưởng</em> giả định điều kiện hoàn hảo; định mức <em>thực tế (khả thi)</em> đã tính đến thời gian nghỉ và hao hụt bình thường, thường được ưa chuộng hơn vì người lao động thấy công bằng.</p>
<h3>Mô hình chung</h3>
<pre><code>   (1) AQ x AP          (2) AQ x SP          (3) SQ x SP
         └── biến động giá ───┘  └──── biến động lượng ────┘
Biến động giá   = AQ x (AP − SP)      (nhân công: đơn giá; SXC: chi tiêu)
Biến động lượng = SP x (AQ − SQ)      (nhân công và SXC: năng suất)
AQ, AP: lượng và giá thực tế; SP: giá định mức
SQ = lượng định mức cho sản lượng THỰC TẾ
Nhân công và biến phí SXC: AQ = AH (giờ thực tế), SQ = SH (giờ định mức cho sản lượng thực tế), SP = SR (đơn giá định mức)
Dương = bất lợi (U); âm = thuận lợi (F)</code></pre>
<h3>Tính biến động (sản lượng thực tế 2.000 sản phẩm)</h3>
<pre><code>Thực tế: mua và dùng 6.300 kg giá 3,80 $; 1.050 giờ công giá 23,00 $; biến phí SXC 6.090 $
Định mức cho phép: NVL 2.000 x 3 = 6.000 kg; giờ công 2.000 x 0,5 = 1.000 giờ

NVL TRỰC TIẾP
  Biến động giá     6.300 x (3,80 − 4,00)  = −1.260  →  1.260 F
  Biến động lượng   4,00 x (6.300 − 6.000) =  1.200  →  1.200 U
  Tổng  23.940 − 24.000                    =    −60  →     60 F

NHÂN CÔNG TRỰC TIẾP
  Biến động đơn giá     1.050 x (23 − 22)    =  1.050  →  1.050 U
  Biến động năng suất   22 x (1.050 − 1.000) =  1.100  →  1.100 U
  Tổng  24.150 − 22.000                      =  2.150  →  2.150 U

BIẾN PHÍ SXC (đơn giá thực tế 6.090 / 1.050 = 5,80 $ mỗi giờ)
  Biến động chi tiêu (giá)  6.090 − 1.050 x 6   =  −210  →  210 F
  Biến động năng suất       6 x (1.050 − 1.000) =   300  →  300 U
  Tổng  6.090 − 6.000                           =    90  →   90 U

Tổng biến động biến phí: 60 F + 2.150 U + 90 U = 2.180 U  (đúng biến động chi tiêu ở bài 4.2 ✓)</code></pre>
<h3>Ai chịu trách nhiệm?</h3>
<table>
<tr><th>Biến động</th><th>Trách nhiệm thường thuộc</th><th>Nguyên nhân thường gặp</th></tr>
<tr><td>Giá NVL</td><td>Trưởng bộ phận mua hàng</td><td>Giá thị trường, chọn nhà cung cấp, chiết khấu số lượng, đặt hàng gấp</td></tr>
<tr><td>Lượng NVL</td><td>Quản đốc sản xuất</td><td>Lãng phí, vật liệu kém chất lượng, công nhân chưa được đào tạo, máy hỏng</td></tr>
<tr><td>Đơn giá nhân công</td><td>Quản đốc sản xuất</td><td>Phụ trội làm thêm giờ, dùng thợ bậc cao cho việc đơn giản</td></tr>
<tr><td>Năng suất nhân công và biến phí SXC</td><td>Quản đốc sản xuất</td><td>Giám sát kém, máy hỏng, vật liệu kém, động lực thấp</td></tr>
</table>
<ul>
<li><strong>Quản trị theo ngoại lệ</strong>: tìm hiểu các biến động lớn, lặp lại hoặc tăng dần — không phải mọi biến động nhỏ.</li>
<li>Các biến động có liên hệ với nhau: ở đây vật liệu rẻ hơn (1.260 F) đi kèm với dùng nhiều hơn (1.200 U) — có thể vật liệu rẻ kém chất lượng. Hãy đánh giá khoản “tiết kiệm” của bộ phận mua hàng cùng với tác động của nó tới sản xuất.</li>
<li>Biến động năng suất biến phí SXC đi theo năng suất nhân công vì SXC được phân bổ theo giờ công: 50 giờ vượt tốn 50 x 6 = 300.</li>
<li>Định phí SXC được phân tích theo cách khác (biến động dự toán và biến động khối lượng), được trình bày trong giáo trình đầy đủ.</li>
</ul>
<div class="callout"><span class="badge">Cẩn thận</span> SQ và SH luôn tính cho <strong>sản lượng thực tế</strong> (2.000 sản phẩm), không bao giờ cho sản lượng kế hoạch. Dùng số kế hoạch sẽ trộn biến động do mức hoạt động trở lại vào biến động năng suất.</div>`,
  ]]);

const c10e = doc('acc302-4-4-exercise', 'Exercise 2 — materials and labor variances at Hoa An Ceramics|||Bài tập 2 — biến động NVL và nhân công tại Gốm Hoà An',
  'Bài tập: tính biến động giá và lượng NVL (mua khác dùng), biến động đơn giá và năng suất nhân công, biến động biến phí SXC cho một xưởng gốm giả định; ghi bút toán theo hệ thống chi phí định mức; giải thích ý nghĩa và mối liên hệ giữa các biến động; kèm lời giải.',
  [[
    `<span class="eyebrow">ACC302 · Part 4 · Exercise</span>
<h2>Exercise 2 — cheap clay, expensive hours?</h2>
<div class="callout"><span class="badge">Problem</span> Hoa An Ceramics, a fictional workshop, makes a decorative vase. Standards per vase (illustrative, VND): clay 2.5 kg at 8,000 per kg; direct labor 0.8 hour at 40,000 per hour; variable overhead 0.8 hour at 15,000 per labor-hour. Last month it produced 5,000 vases. It purchased 13,000 kg of clay for 101,400,000 and used 12,800 kg. Workers were paid 172,200,000 for 4,200 hours. Variable overhead was 60,900,000. (a) Compute the materials price variance (on the quantity purchased) and the materials quantity variance. (b) Compute the labor rate and efficiency variances. (c) Compute the variable overhead rate and efficiency variances. (d) Record the materials and labor journal entries in a standard cost system. (e) What story do the variances tell?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Standard cost per vase: 2.5 x 8,000 + 0.8 x 40,000 + 0.8 x 15,000 = 20,000 + 32,000 + 12,000 = 64,000
Standard allowed for 5,000 vases: clay 12,500 kg; labor 4,000 hours
Actual prices: clay 101,400,000 / 13,000 = 7,800 per kg; labor 172,200,000 / 4,200 = 41,000 per hour
               variable overhead 60,900,000 / 4,200 = 14,500 per hour

(a) Price variance     13,000 x (7,800 − 8,000)   = −2,600,000  →  2,600,000 F
    Quantity variance  8,000 x (12,800 − 12,500)  =  2,400,000  →  2,400,000 U

(b) Rate variance        4,200 x (41,000 − 40,000) =  4,200,000  →  4,200,000 U
    Efficiency variance  40,000 x (4,200 − 4,000)  =  8,000,000  →  8,000,000 U
    Check: 172,200,000 − 4,000 x 40,000 = 12,200,000 U ✓

(c) Rate (spending) variance  60,900,000 − 4,200 x 15,000 = −2,100,000  →  2,100,000 F
    Efficiency variance       15,000 x (4,200 − 4,000)     =  3,000,000  →  3,000,000 U
    Check: 60,900,000 − 4,000 x 15,000 = 900,000 U ✓

(d) Purchase of clay (raw materials carried at standard price)
      Dr Raw materials                13,000 x 8,000 = 104,000,000
          Cr Materials price variance                   2,600,000
          Cr Accounts payable                         101,400,000
    Use of clay
      Dr Work in process              12,500 x 8,000 = 100,000,000
      Dr Materials quantity variance                    2,400,000
          Cr Raw materials            12,800 x 8,000 = 102,400,000
    Direct labor
      Dr Work in process              4,000 x 40,000 = 160,000,000
      Dr Labor rate variance                            4,200,000
      Dr Labor efficiency variance                      8,000,000
          Cr Wages payable                            172,200,000
    (Unfavorable variances are debits, favorable variances are credits.)

(e) Net of all six variances: 2.6 F + 2.4 U + 4.2 U + 8.0 U + 2.1 F + 3.0 U = 12.9 million U
    (The price variance is on the 13,000 kg purchased, so this net includes 40,000 F on the 200 kg
    still in inventory. Production cost variance for the month: actual 12,800 x 7,800 + 172,200,000
    + 60,900,000 = 332,940,000 − standard 5,000 x 64,000 = 320,000,000 → 12,940,000 U.)</code></pre>
<p><strong>Why:</strong> the price variance is computed on the 13,000 kg <em>purchased</em> so that purchasing is judged when it buys, while the quantity variance uses the 12,800 kg <em>used</em>. The pattern hints at one root cause: the cheaper clay saved 2.6 million but may have been harder to work — 300 kg of extra clay and 200 extra hours (which also drove 3.0 million of overhead efficiency variance). The 4.2 million rate variance needs its own explanation (overtime? more-senior potters?). Management should investigate before rewarding the purchasing “saving”. In Vietnam these variance accounts serve internal management; financial statements follow the accounting regime in force.</p>`,
    `<span class="eyebrow">ACC302 · Phần 4 · Bài tập</span>
<h2>Bài tập 2 — đất rẻ, giờ công đắt?</h2>
<div class="callout"><span class="badge">Đề</span> Gốm Hoà An, một xưởng gốm giả định, làm một mẫu bình trang trí. Định mức cho mỗi bình (số liệu minh hoạ, đồng): đất sét 2,5 kg giá 8.000 đồng/kg; nhân công trực tiếp 0,8 giờ giá 40.000 đồng/giờ; biến phí SXC 0,8 giờ với đơn giá 15.000 đồng/giờ công. Tháng trước xưởng sản xuất 5.000 bình. Xưởng mua 13.000 kg đất sét hết 101.400.000 đồng và dùng 12.800 kg. Công nhân được trả 172.200.000 đồng cho 4.200 giờ. Biến phí SXC thực tế là 60.900.000 đồng. (a) Tính biến động giá NVL (theo lượng mua) và biến động lượng NVL. (b) Tính biến động đơn giá và năng suất nhân công. (c) Tính biến động chi tiêu và năng suất biến phí SXC. (d) Ghi bút toán NVL và nhân công theo hệ thống chi phí định mức. (e) Các biến động kể câu chuyện gì?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Chi phí định mức mỗi bình: 2,5 x 8.000 + 0,8 x 40.000 + 0,8 x 15.000 = 20.000 + 32.000 + 12.000 = 64.000
Định mức cho 5.000 bình: đất sét 12.500 kg; nhân công 4.000 giờ
Giá thực tế: đất sét 101.400.000 / 13.000 = 7.800 đồng/kg; nhân công 172.200.000 / 4.200 = 41.000 đồng/giờ
             biến phí SXC 60.900.000 / 4.200 = 14.500 đồng/giờ

(a) Biến động giá     13.000 x (7.800 − 8.000)   = −2.600.000  →  2.600.000 F
    Biến động lượng   8.000 x (12.800 − 12.500)  =  2.400.000  →  2.400.000 U

(b) Biến động đơn giá     4.200 x (41.000 − 40.000) =  4.200.000  →  4.200.000 U
    Biến động năng suất   40.000 x (4.200 − 4.000)  =  8.000.000  →  8.000.000 U
    Kiểm tra: 172.200.000 − 4.000 x 40.000 = 12.200.000 U ✓

(c) Biến động chi tiêu     60.900.000 − 4.200 x 15.000 = −2.100.000  →  2.100.000 F
    Biến động năng suất    15.000 x (4.200 − 4.000)     =  3.000.000  →  3.000.000 U
    Kiểm tra: 60.900.000 − 4.000 x 15.000 = 900.000 U ✓

(d) Mua đất sét (NVL ghi theo giá định mức)
      Nợ Nguyên vật liệu              13.000 x 8.000 = 104.000.000
          Có Biến động giá NVL                          2.600.000
          Có Phải trả người bán                       101.400.000
    Xuất dùng đất sét
      Nợ Sản phẩm dở dang             12.500 x 8.000 = 100.000.000
      Nợ Biến động lượng NVL                            2.400.000
          Có Nguyên vật liệu          12.800 x 8.000 = 102.400.000
    Nhân công trực tiếp
      Nợ Sản phẩm dở dang             4.000 x 40.000 = 160.000.000
      Nợ Biến động đơn giá nhân công                    4.200.000
      Nợ Biến động năng suất nhân công                  8.000.000
          Có Phải trả người lao động                  172.200.000
    (Biến động bất lợi ghi Nợ, biến động thuận lợi ghi Có.)

(e) Cộng cả sáu biến động: 2,6 F + 2,4 U + 4,2 U + 8,0 U + 2,1 F + 3,0 U = 12,9 triệu U
    (Biến động giá tính trên 13.000 kg mua vào, nên con số này gồm cả 40.000 F của 200 kg còn tồn
    kho. Biến động chi phí sản xuất trong tháng: thực tế 12.800 x 7.800 + 172.200.000 + 60.900.000
    = 332.940.000 − định mức 5.000 x 64.000 = 320.000.000 → 12.940.000 U.)</code></pre>
<p><strong>Vì sao:</strong> biến động giá tính trên 13.000 kg <em>mua vào</em> để đánh giá bộ phận mua hàng ngay khi mua, còn biến động lượng dùng 12.800 kg <em>thực dùng</em>. Bức tranh gợi ý một nguyên nhân gốc: đất sét rẻ tiết kiệm 2,6 triệu nhưng có thể khó làm hơn — tốn thêm 300 kg đất và 200 giờ công (kéo theo 3,0 triệu biến động năng suất biến phí SXC). Biến động đơn giá 4,2 triệu cần lời giải thích riêng (làm thêm giờ? dùng thợ bậc cao?). Ban quản lý nên tìm hiểu trước khi khen thưởng khoản “tiết kiệm” của bộ phận mua hàng. Ở Việt Nam các tài khoản biến động này phục vụ quản trị nội bộ; báo cáo tài chính tuân theo chế độ kế toán đang có hiệu lực.</p>`,
  ]]);

const c10q = quiz('acc302-quiz-4', 'Quiz 4 — Budgets & variances|||Quiz 4 — Dự toán & biến động', [
  { id: 'q1', question: 'Budgeted sales are 12,000 units, desired ending finished goods are 1,500 units and beginning finished goods are 1,000 units. Required production is…|||Tiêu thụ dự toán 12.000 sản phẩm, thành phẩm tồn cuối kỳ mong muốn 1.500, tồn đầu kỳ 1.000. Số lượng cần sản xuất là…', options: ['12,500 units|||12.500 sản phẩm', '11,500 units|||11.500 sản phẩm', '13,500 units|||13.500 sản phẩm', '14,500 units|||14.500 sản phẩm'], correctIndex: 0, explanation: 'Production = sales + desired ending inventory − beginning inventory = 12,000 + 1,500 − 1,000 = 12,500.|||Sản xuất = tiêu thụ + tồn cuối mong muốn − tồn đầu = 12.000 + 1.500 − 1.000 = 12.500.' },
  { id: 'q2', question: 'Standard price 5 per kg; 4,200 kg were used at an actual price of 4.90; the standard quantity for actual output is 4,000 kg. The materials quantity variance is…|||Giá định mức 5 mỗi kg; dùng 4.200 kg với giá thực tế 4,90; lượng định mức cho sản lượng thực tế là 4.000 kg. Biến động lượng NVL là…', options: ['420 F|||420 F', '1,000 F|||1.000 F', '1,000 U|||1.000 U', '980 U|||980 U'], correctIndex: 2, explanation: 'Quantity variance = SP x (AQ − SQ) = 5 x 200 = 1,000 U. 420 F is the price variance; 980 wrongly uses the actual price.|||Biến động lượng = SP x (AQ − SQ) = 5 x 200 = 1.000 U. 420 F là biến động giá; 980 là dùng nhầm giá thực tế.' },
  { id: 'q3', question: 'The labor efficiency variance is unfavorable when…|||Biến động năng suất nhân công là bất lợi khi…', options: ['the actual wage rate exceeds the standard rate|||đơn giá lương thực tế cao hơn định mức', 'actual output exceeds budgeted output|||sản lượng thực tế cao hơn sản lượng dự toán', 'the planning budget exceeds the flexible budget|||dự toán tĩnh lớn hơn dự toán linh hoạt', 'actual hours exceed the standard hours allowed for the actual output|||số giờ thực tế vượt số giờ định mức cho sản lượng thực tế'], correctIndex: 3, explanation: 'Efficiency variance = SR x (AH − SH); it is unfavorable when AH &gt; SH. A higher wage rate creates a rate variance, not an efficiency variance.|||Biến động năng suất = SR x (AH − SH); bất lợi khi AH &gt; SH. Đơn giá lương cao hơn tạo ra biến động đơn giá, không phải biến động năng suất.' },
]);

const c11 = doc('acc302-5-1-relevant-costs', '5.1 — Relevant costs for decision making|||5.1 — Chi phí thích hợp cho việc ra quyết định',
  'Chi phí thích hợp, chi phí tránh được, chi phí chìm và chi phí cơ hội; ví dụ số cho ba quyết định: nhận đơn hàng đặc biệt (còn và hết năng lực), giữ hay loại bỏ một dòng sản phẩm, sử dụng nguồn lực giới hạn theo số dư đảm phí trên đơn vị nguồn lực; các yếu tố định tính.',
  [[
    `<span class="eyebrow">ACC302 · Part 5 · Lesson 5.1</span>
<h2>Relevant costs for decision making</h2>
<p class="lead">Every decision compares alternatives. A cost or benefit is <strong>relevant</strong> only if it lies in the <em>future</em> and <em>differs</em> between the alternatives. Everything else — however large — can be ignored.</p>
<h3>Three rules</h3>
<ul>
<li><strong>Sunk costs are never relevant</strong> — money already spent cannot be recovered by any choice (the book value of old equipment, last year’s market study).</li>
<li><strong>Future costs that do not differ are not relevant</strong> — e.g. allocated head-office costs that continue whatever you decide.</li>
<li><strong>Opportunity costs are relevant</strong> — if a choice uses capacity that could earn something else, the forgone benefit is a cost of that choice.</li>
</ul>
<p>An <strong>avoidable cost</strong> is one that disappears if you choose one alternative over another; in most decisions “relevant” and “avoidable” mean the same thing.</p>
<h3>Decision 1 — accept a special order?</h3>
<p>A fictional fan maker has capacity for 20,000 units and sells 16,000 units at $80. Unit costs (illustrative): direct materials 25, direct labor 15 (treated as variable here), variable overhead 5, fixed overhead 10 (160,000 / 16,000), variable selling 4 — a full cost of 59. A hotel chain offers to buy 3,000 units at $52, with a special logo costing 2 per unit; no sales commission is paid on the order.</p>
<pre><code>Relevant cost per unit = 25 + 15 + 5 + 2 = 47   (fixed overhead is unchanged; no variable selling cost)
Incremental profit     = 3,000 x (52 − 47) = +15,000   →  accept (idle capacity 4,000 ≥ 3,000)

If the order were 5,000 units, 1,000 regular sales would be lost:
  Regular unit CM = 80 − (25 + 15 + 5 + 4) = 31
  Incremental CM on the order   5,000 x (52 − 47) =  25,000
  Opportunity cost              1,000 x 31        = (31,000)
  Net effect                                        (6,000)  →  reject at $52
  Minimum acceptable price = 47 + 31,000 / 5,000 = 53.20</code></pre>
<p>Comparing the $52 offer with the full cost of 59 would have wrongly rejected a profitable order. Check also the qualitative side: will regular customers learn of the lower price and demand the same?</p>
<h3>Decision 2 — drop a product line?</h3>
<pre><code>"Kids" line (assumed)              Sales            200,000
                                   Variable costs  (120,000)
                                   Contribution margin       80,000
Traceable fixed costs (avoidable: line manager, advertising) (50,000)
Allocated common fixed costs (continue anyway)               (45,000)
Reported net operating income                                (15,000)

If the line is dropped: lose CM 80,000, avoid 50,000  →  company profit falls by 30,000</code></pre>
<p>The line looks like a loser only because it carries 45,000 of common costs that would simply be spread over the remaining lines. Keep it — unless the space could be used for something that earns more than 30,000. Depreciation on equipment used only by the line is sunk and not avoidable, even though it is “traceable” — unless the equipment can be sold or used elsewhere, in which case its disposal value is relevant.</p>
<h3>Decision 3 — a constrained resource</h3>
<p>Machine time is limited to 2,000 hours a month (assumed). Product X: CM 30 per unit, 0.5 machine-hour per unit, demand 3,000 units. Product Y: CM 40 per unit, 1.0 machine-hour per unit, demand 1,000 units. Demand needs 1,500 + 1,000 = 2,500 hours.</p>
<pre><code>CM per machine-hour:  X = 30 / 0.5 = 60      Y = 40 / 1.0 = 40   →  X first

Plan by CM per hour: X 3,000 units (1,500 h) + Y 500 units (500 h) = 90,000 + 20,000 = 110,000
Plan by CM per unit: Y 1,000 units (1,000 h) + X 2,000 units (1,000 h) = 40,000 + 60,000 = 100,000</code></pre>
<p>When a resource is the constraint, rank products by <strong>contribution margin per unit of the constrained resource</strong>, not by CM per unit. An extra machine-hour is worth up to 40 here (it would make more Y, for up to 500 more hours), which tells managers how much they can pay to <em>relax the constraint</em> — overtime, outsourcing part of the work, or reducing setup time.</p>
<div class="callout"><span class="badge">Key lesson</span> Ask “what changes if we choose this?” — not “what does it cost in total?”. Allocated fixed costs and sunk costs are the two most common traps. Then add the qualitative factors that numbers cannot capture.</div>`,
    `<span class="eyebrow">ACC302 · Phần 5 · Bài 5.1</span>
<h2>Chi phí thích hợp cho việc ra quyết định</h2>
<p class="lead">Mọi quyết định đều là so sánh các phương án. Một khoản chi phí hay lợi ích chỉ <strong>thích hợp</strong> khi nó thuộc về <em>tương lai</em> và <em>khác nhau</em> giữa các phương án. Mọi thứ khác — dù lớn đến đâu — đều có thể bỏ qua.</p>
<h3>Ba quy tắc</h3>
<ul>
<li><strong>Chi phí chìm không bao giờ thích hợp</strong> — tiền đã chi thì không lựa chọn nào lấy lại được (giá trị còn lại trên sổ của thiết bị cũ, nghiên cứu thị trường năm ngoái).</li>
<li><strong>Chi phí tương lai không chênh lệch thì không thích hợp</strong> — ví dụ chi phí văn phòng tổng công ty được phân bổ, vẫn phát sinh dù quyết định thế nào.</li>
<li><strong>Chi phí cơ hội là thích hợp</strong> — nếu một lựa chọn dùng năng lực có thể tạo ra thu nhập khác, lợi ích bị bỏ qua là chi phí của lựa chọn đó.</li>
</ul>
<p><strong>Chi phí tránh được</strong> là chi phí mất đi nếu chọn phương án này thay vì phương án kia; trong phần lớn quyết định, “thích hợp” và “tránh được” có cùng nghĩa.</p>
<h3>Quyết định 1 — có nhận đơn hàng đặc biệt?</h3>
<p>Một nhà sản xuất quạt giả định có năng lực 20.000 sản phẩm và đang bán 16.000 sản phẩm giá 80 $. Chi phí đơn vị (minh hoạ): NVL trực tiếp 25, nhân công trực tiếp 15 (ở đây coi là biến phí), biến phí SXC 5, định phí SXC 10 (160.000 / 16.000), biến phí bán hàng 4 — giá thành toàn bộ 59. Một chuỗi khách sạn đề nghị mua 3.000 sản phẩm giá 52 $, in logo riêng tốn 2 mỗi sản phẩm; đơn hàng này không phải trả hoa hồng bán hàng.</p>
<pre><code>Chi phí thích hợp mỗi sản phẩm = 25 + 15 + 5 + 2 = 47   (định phí SXC không đổi; không có biến phí bán hàng)
Lợi nhuận tăng thêm            = 3.000 x (52 − 47) = +15.000   →  nhận (năng lực nhàn rỗi 4.000 ≥ 3.000)

Nếu đơn hàng là 5.000 sản phẩm, sẽ mất 1.000 sản phẩm bán thường:
  SDĐP đơn vị hàng bán thường = 80 − (25 + 15 + 5 + 4) = 31
  SDĐP tăng thêm từ đơn hàng   5.000 x (52 − 47) =  25.000
  Chi phí cơ hội               1.000 x 31        = (31.000)
  Ảnh hưởng thuần                                  (6.000)  →  từ chối ở giá 52 $
  Giá tối thiểu chấp nhận được = 47 + 31.000 / 5.000 = 53,20</code></pre>
<p>So giá 52 $ với giá thành toàn bộ 59 sẽ khiến từ chối nhầm một đơn hàng có lãi. Xem cả mặt định tính: khách hàng thường xuyên có biết giá thấp này và đòi được hưởng như vậy không?</p>
<h3>Quyết định 2 — có loại bỏ một dòng sản phẩm?</h3>
<pre><code>Dòng "Trẻ em" (giả định)            Doanh thu        200.000
                                    Biến phí        (120.000)
                                    Số dư đảm phí              80.000
Định phí bộ phận (tránh được: quản lý dòng, quảng cáo)        (50.000)
Định phí chung được phân bổ (vẫn phát sinh)                    (45.000)
Lợi nhuận thuần theo báo cáo                                   (15.000)

Nếu loại bỏ dòng: mất SDĐP 80.000, tránh được 50.000  →  lợi nhuận công ty giảm 30.000</code></pre>
<p>Dòng sản phẩm trông như đang lỗ chỉ vì gánh 45.000 định phí chung — khoản này sẽ đơn giản là chia lại cho các dòng còn lại. Hãy giữ lại — trừ khi mặt bằng có thể dùng cho việc khác mang lại hơn 30.000. Khấu hao thiết bị chỉ dùng cho dòng này là chi phí chìm và không tránh được, dù nó “tính thẳng” được cho bộ phận — trừ khi thiết bị bán được hoặc dùng được vào việc khác; khi đó giá trị thanh lý là thích hợp.</p>
<h3>Quyết định 3 — nguồn lực giới hạn</h3>
<p>Thời gian máy giới hạn 2.000 giờ mỗi tháng (giả định). Sản phẩm X: SDĐP 30 mỗi sản phẩm, 0,5 giờ máy mỗi sản phẩm, nhu cầu 3.000 sản phẩm. Sản phẩm Y: SDĐP 40 mỗi sản phẩm, 1,0 giờ máy mỗi sản phẩm, nhu cầu 1.000 sản phẩm. Nhu cầu cần 1.500 + 1.000 = 2.500 giờ.</p>
<pre><code>SDĐP mỗi giờ máy:  X = 30 / 0,5 = 60      Y = 40 / 1,0 = 40   →  ưu tiên X

Theo SDĐP mỗi giờ máy: X 3.000 sp (1.500 giờ) + Y 500 sp (500 giờ) = 90.000 + 20.000 = 110.000
Theo SDĐP mỗi sản phẩm: Y 1.000 sp (1.000 giờ) + X 2.000 sp (1.000 giờ) = 40.000 + 60.000 = 100.000</code></pre>
<p>Khi một nguồn lực là điều kiện giới hạn, xếp hạng sản phẩm theo <strong>số dư đảm phí trên một đơn vị nguồn lực giới hạn</strong>, không theo SDĐP mỗi sản phẩm. Ở đây một giờ máy tăng thêm đáng giá tới 40 (để làm thêm Y, tối đa thêm 500 giờ), cho nhà quản trị biết có thể trả tối đa bao nhiêu để <em>nới lỏng giới hạn</em> — làm thêm giờ, thuê ngoài một phần công việc, hay rút ngắn thời gian thiết lập máy.</p>
<div class="callout"><span class="badge">Bài học chính</span> Hãy hỏi “điều gì thay đổi nếu chọn phương án này?” — chứ không hỏi “tổng cộng tốn bao nhiêu?”. Định phí phân bổ và chi phí chìm là hai cái bẫy phổ biến nhất. Sau đó bổ sung các yếu tố định tính mà con số không đo được.</div>`,
  ]]);

const c12 = doc('acc302-5-2-responsibility-roi-ri', '5.2 — Responsibility centers, ROI, residual income and transfer pricing|||5.2 — Trung tâm trách nhiệm, ROI, lợi nhuận còn lại và định giá chuyển giao',
  'Phân cấp quản lý và bốn loại trung tâm trách nhiệm, tỷ suất hoàn vốn đầu tư ROI (biên lợi nhuận x vòng quay), lợi nhuận còn lại RI và vì sao ROI có thể khiến nhà quản trị từ chối dự án tốt, định giá chuyển giao: khoảng giá hợp lý khi còn và hết năng lực, các phương pháp xác định.',
  [[
    `<span class="eyebrow">ACC302 · Part 5 · Lesson 5.2</span>
<h2>Responsibility centers, ROI, residual income and transfer pricing</h2>
<p class="lead">In a decentralized organization, decisions are pushed down to the managers closest to customers and operations. <strong>Responsibility accounting</strong> holds each manager accountable only for what he or she can control.</p>
<h3>Responsibility centers</h3>
<table>
<tr><th>Center</th><th>Manager controls</th><th>Evaluated by</th><th>Example</th></tr>
<tr><td>Cost center</td><td>Costs</td><td>Actual costs vs flexible budget, standard-cost variances</td><td>Production department, accounting, HR</td></tr>
<tr><td>Revenue center</td><td>Revenues</td><td>Sales vs target</td><td>A regional sales office</td></tr>
<tr><td>Profit center</td><td>Revenues and costs</td><td>Segment profit vs budget</td><td>A store in a retail chain</td></tr>
<tr><td>Investment center</td><td>Revenues, costs and investment in operating assets</td><td>ROI, residual income</td><td>A division or a subsidiary</td></tr>
</table>
<p>When segments are evaluated, separate <strong>traceable</strong> fixed costs (which would disappear with the segment) from <strong>common</strong> fixed costs (which would not); a segment’s <em>segment margin</em> = contribution margin − traceable fixed costs is the best measure of its long-run profitability.</p>
<h3>Return on investment (ROI)</h3>
<pre><code>ROI = Net operating income / Average operating assets
    = Margin (NOI / Sales) x Turnover (Sales / Average operating assets)
Division A (assumed): NOI 300,000; sales 3,000,000; average operating assets 1,500,000
    Margin 10% x Turnover 2.0 = ROI 20%   (300,000 / 1,500,000 ✓)</code></pre>
<p>ROI can be raised by increasing sales, reducing operating expenses or reducing operating assets (collecting receivables faster, holding less inventory).</p>
<h3>Residual income (RI)</h3>
<pre><code>RI = Net operating income − (Minimum required rate of return x Average operating assets)
Division A, minimum rate 15%: 300,000 − 15% x 1,500,000 = 300,000 − 225,000 = 75,000

A new project: investment 500,000, NOI 90,000  →  project ROI 18%
  Judged by ROI: new divisional ROI = 390,000 / 2,000,000 = 19.5% &lt; 20%  →  manager rejects
  Judged by RI : project RI = 90,000 − 15% x 500,000 = +15,000       →  manager accepts
                 divisional RI rises from 75,000 to 90,000</code></pre>
<p>The project earns 18%, above the company’s 15% minimum, so it is good for the company. A manager rewarded on ROI rejects it because it lowers the division’s average. RI removes that conflict; its weakness is that it favors larger divisions, so it cannot compare divisions of different sizes.</p>
<h3>Transfer pricing</h3>
<p>A <strong>transfer price</strong> is the price one division charges another division of the same company. It shifts profit between divisions but, by itself, does not change company profit — what matters is whether the transfer should happen at all.</p>
<pre><code>Lower limit (selling division) = variable cost per unit + lost contribution margin on outside sales
Upper limit (buying division)  = cost of buying from an outside supplier

Selling division (assumed): variable cost 30, sells outside at 50. Buying division can buy outside at 48.
  Idle capacity : lower limit 30, upper limit 48  →  any price from 30 to 48 benefits both
                  (company saves 48 − 30 = 18 per unit)
  At capacity   : lower limit 30 + (50 − 30) = 50 &gt; 48  →  no transfer;
                  the company is better off if the buyer pays 48 outside and the seller keeps selling at 50</code></pre>
<p>Common methods: <strong>market price</strong> (best when a competitive outside market exists), <strong>cost-based</strong> (variable or full cost — simple, but can hide inefficiency in the selling division), and <strong>negotiated</strong> prices within the range above. Across borders, transfer prices also affect taxes and are regulated; that is beyond this course.</p>
<div class="callout"><span class="badge">Key lesson</span> A performance measure shapes behavior. Choose ROI, RI or transfer prices so that what is good for the manager is also good for the company.</div>`,
    `<span class="eyebrow">ACC302 · Phần 5 · Bài 5.2</span>
<h2>Trung tâm trách nhiệm, ROI, lợi nhuận còn lại và định giá chuyển giao</h2>
<p class="lead">Trong một tổ chức phân cấp, quyền quyết định được giao xuống những nhà quản trị gần khách hàng và hoạt động nhất. <strong>Kế toán trách nhiệm</strong> chỉ bắt mỗi nhà quản trị chịu trách nhiệm về những gì họ kiểm soát được.</p>
<h3>Trung tâm trách nhiệm</h3>
<table>
<tr><th>Trung tâm</th><th>Nhà quản trị kiểm soát</th><th>Đánh giá bằng</th><th>Ví dụ</th></tr>
<tr><td>Trung tâm chi phí</td><td>Chi phí</td><td>Chi phí thực tế so với dự toán linh hoạt, biến động chi phí định mức</td><td>Phân xưởng sản xuất, phòng kế toán, phòng nhân sự</td></tr>
<tr><td>Trung tâm doanh thu</td><td>Doanh thu</td><td>Doanh thu so với chỉ tiêu</td><td>Văn phòng bán hàng khu vực</td></tr>
<tr><td>Trung tâm lợi nhuận</td><td>Doanh thu và chi phí</td><td>Lợi nhuận bộ phận so với dự toán</td><td>Một cửa hàng trong chuỗi bán lẻ</td></tr>
<tr><td>Trung tâm đầu tư</td><td>Doanh thu, chi phí và vốn đầu tư vào tài sản hoạt động</td><td>ROI, lợi nhuận còn lại</td><td>Một khối kinh doanh hoặc công ty con</td></tr>
</table>
<p>Khi đánh giá bộ phận, tách <strong>định phí bộ phận</strong> (sẽ mất đi cùng bộ phận) khỏi <strong>định phí chung</strong> (không mất đi); <em>số dư bộ phận</em> = số dư đảm phí − định phí bộ phận là thước đo tốt nhất cho khả năng sinh lời dài hạn của bộ phận.</p>
<h3>Tỷ suất hoàn vốn đầu tư (ROI)</h3>
<pre><code>ROI = Lợi nhuận thuần từ hoạt động / Tài sản hoạt động bình quân
    = Biên lợi nhuận (LN thuần / Doanh thu) x Vòng quay (Doanh thu / Tài sản hoạt động bình quân)
Khối A (giả định): LN thuần 300.000; doanh thu 3.000.000; tài sản hoạt động bình quân 1.500.000
    Biên 10% x Vòng quay 2,0 = ROI 20%   (300.000 / 1.500.000 ✓)</code></pre>
<p>Có thể nâng ROI bằng cách tăng doanh thu, giảm chi phí hoạt động hoặc giảm tài sản hoạt động (thu nợ nhanh hơn, giữ ít hàng tồn kho hơn).</p>
<h3>Lợi nhuận còn lại (RI)</h3>
<pre><code>RI = LN thuần từ hoạt động − (Tỷ suất sinh lời tối thiểu x Tài sản hoạt động bình quân)
Khối A, tỷ suất tối thiểu 15%: 300.000 − 15% x 1.500.000 = 300.000 − 225.000 = 75.000

Dự án mới: đầu tư 500.000, LN thuần 90.000  →  ROI dự án 18%
  Đánh giá theo ROI: ROI mới của khối = 390.000 / 2.000.000 = 19,5% &lt; 20%  →  nhà quản trị từ chối
  Đánh giá theo RI : RI dự án = 90.000 − 15% x 500.000 = +15.000         →  nhà quản trị chấp nhận
                     RI của khối tăng từ 75.000 lên 90.000</code></pre>
<p>Dự án sinh lời 18%, cao hơn mức tối thiểu 15% của công ty, nên có lợi cho công ty. Nhà quản trị được thưởng theo ROI lại từ chối vì dự án kéo ROI bình quân của khối xuống. RI xoá bỏ mâu thuẫn đó; điểm yếu của nó là thiên về các bộ phận lớn, nên không so sánh được các bộ phận có quy mô khác nhau.</p>
<h3>Định giá chuyển giao</h3>
<p><strong>Giá chuyển giao</strong> là giá một bộ phận tính cho một bộ phận khác trong cùng công ty. Nó dịch chuyển lợi nhuận giữa các bộ phận nhưng tự nó không làm thay đổi lợi nhuận của công ty — điều quan trọng là có nên chuyển giao hay không.</p>
<pre><code>Giới hạn dưới (bộ phận bán) = biến phí đơn vị + SDĐP bị mất do không bán ra ngoài
Giới hạn trên (bộ phận mua) = giá mua từ nhà cung cấp bên ngoài

Bộ phận bán (giả định): biến phí 30, bán ra ngoài giá 50. Bộ phận mua có thể mua ngoài giá 48.
  Còn năng lực nhàn rỗi : giới hạn dưới 30, giới hạn trên 48  →  mọi mức giá từ 30 đến 48 có lợi cho cả hai
                          (công ty tiết kiệm 48 − 30 = 18 mỗi sản phẩm)
  Hết năng lực          : giới hạn dưới 30 + (50 − 30) = 50 &gt; 48  →  không chuyển giao;
                          công ty có lợi hơn nếu bên mua mua ngoài giá 48 và bên bán tiếp tục bán ra ngoài giá 50</code></pre>
<p>Các phương pháp thường dùng: <strong>theo giá thị trường</strong> (tốt nhất khi có thị trường bên ngoài cạnh tranh), <strong>theo chi phí</strong> (biến phí hoặc chi phí toàn bộ — đơn giản nhưng có thể che giấu sự kém hiệu quả của bộ phận bán), và <strong>giá thương lượng</strong> trong khoảng nêu trên. Giữa các quốc gia, giá chuyển giao còn ảnh hưởng tới thuế và chịu sự quản lý của pháp luật; nội dung đó nằm ngoài phạm vi môn học.</p>
<div class="callout"><span class="badge">Bài học chính</span> Thước đo thành quả định hình hành vi. Hãy chọn ROI, RI hay giá chuyển giao sao cho điều tốt với nhà quản trị cũng là điều tốt với công ty.</div>`,
  ]]);

const c12e = doc('acc302-5-3-exercise', 'Exercise 3 — make or buy a power adapter|||Bài tập 3 — tự làm hay mua ngoài bộ nguồn',
  'Bài tập: quyết định tự sản xuất hay mua ngoài một chi tiết với chi phí thích hợp (loại chi phí chìm và định phí chung phân bổ), xét chi phí cơ hội của năng lực được giải phóng, tính giá mua tối đa chấp nhận được và phân tích các yếu tố định tính; kèm lời giải.',
  [[
    `<span class="eyebrow">ACC302 · Part 5 · Exercise</span>
<h2>Exercise 3 — make or buy a power adapter?</h2>
<div class="callout"><span class="badge">Problem</span> An Phu Electronics, a fictional company, makes 10,000 power adapters a year for its own products. Its cost per adapter (illustrative, VND thousands): direct materials 12; direct labor 8; variable overhead 4; supervisor’s salary 3 (30,000 a year — the position would be eliminated if the adapter were bought); depreciation of special equipment 2 (20,000 a year — the equipment has no resale value and no other use); allocated general factory overhead 6 (60,000 a year — it would continue). Total 35. An outside supplier offers to deliver the same adapter at 30. (a) Should the company make or buy? (b) If the adapter is bought, the freed space could be used to make another product with a segment margin of 50,000 a year. Does the decision change? (c) What is the highest price the company should pay the supplier in (a) and in (b)? (d) List the qualitative factors to weigh.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Relevant (avoidable) cost of making, per year
      Direct materials      10,000 x 12 = 120,000
      Direct labor          10,000 x  8 =  80,000
      Variable overhead     10,000 x  4 =  40,000
      Supervisor's salary                  30,000
      Total avoidable                     270,000   (27 per unit)
    Not relevant: depreciation 20,000 (sunk — the equipment is already bought and has no resale value)
                  allocated overhead 60,000 (continues whichever option is chosen)
    Cost of buying  10,000 x 30 = 300,000
    Make is cheaper by 300,000 − 270,000 = 30,000   →  make

    Total-cost check: make 10,000 x 35 = 350,000
                      buy  300,000 + 20,000 + 60,000 (costs that remain) = 380,000
                      difference 30,000 in favor of making ✓

(b) Opportunity cost of making = segment margin forgone 50,000
      Make: 270,000 + 50,000 = 320,000
      Buy :                    300,000
    Buy is cheaper by 20,000   →  buy and use the space for the other product

(c) Maximum price per unit = relevant cost of making per unit
      (a) 270,000 / 10,000 = 27
      (b) (270,000 + 50,000) / 10,000 = 32</code></pre>
<p><strong>Why:</strong> the “full cost” of 35 invites the wrong answer — buying at 30 looks like a saving of 5 per unit, but 8 of the 35 (depreciation 2 and allocated overhead 6) will be incurred anyway, so buying would actually cost 30,000 more. The decision flips only when the freed capacity has a valuable alternative use, which is why opportunity cost belongs in the analysis even though it never appears in the accounts.</p>
<p><strong>(d) Qualitative factors:</strong> the supplier’s quality and delivery reliability (a late adapter stops the whole product line); dependence on one supplier and the risk of price increases after the in-house capacity is gone; loss of know-how and control over a component that may be strategic; protection of designs and confidential information; the effect on employees (the supervisor’s job); and the contract terms — duration, price adjustment, warranty.</p>`,
    `<span class="eyebrow">ACC302 · Phần 5 · Bài tập</span>
<h2>Bài tập 3 — tự làm hay mua ngoài bộ nguồn?</h2>
<div class="callout"><span class="badge">Đề</span> Điện tử An Phú, một công ty giả định, mỗi năm tự sản xuất 10.000 bộ nguồn để lắp vào sản phẩm của mình. Chi phí mỗi bộ nguồn (số liệu minh hoạ, đơn vị nghìn đồng): NVL trực tiếp 12; nhân công trực tiếp 8; biến phí SXC 4; lương tổ trưởng 3 (30.000 mỗi năm — vị trí này sẽ bị bỏ nếu mua ngoài); khấu hao thiết bị chuyên dùng 2 (20.000 mỗi năm — thiết bị không bán được và không có công dụng khác); định phí SXC chung được phân bổ 6 (60.000 mỗi năm — vẫn tiếp tục phát sinh). Tổng 35. Một nhà cung cấp bên ngoài chào bán đúng loại bộ nguồn này với giá 30. (a) Công ty nên tự làm hay mua ngoài? (b) Nếu mua ngoài, mặt bằng được giải phóng có thể dùng để sản xuất một sản phẩm khác mang lại số dư bộ phận 50.000 mỗi năm. Quyết định có thay đổi không? (c) Giá cao nhất công ty nên trả cho nhà cung cấp trong trường hợp (a) và (b) là bao nhiêu? (d) Liệt kê các yếu tố định tính cần cân nhắc.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Chi phí thích hợp (tránh được) nếu tự làm, mỗi năm
      NVL trực tiếp         10.000 x 12 = 120.000
      Nhân công trực tiếp   10.000 x  8 =  80.000
      Biến phí SXC          10.000 x  4 =  40.000
      Lương tổ trưởng                      30.000
      Tổng chi phí tránh được             270.000   (27 mỗi bộ)
    Không thích hợp: khấu hao 20.000 (chi phí chìm — thiết bị đã mua, không bán lại được)
                     định phí chung phân bổ 60.000 (vẫn phát sinh dù chọn phương án nào)
    Chi phí mua ngoài  10.000 x 30 = 300.000
    Tự làm rẻ hơn 300.000 − 270.000 = 30.000   →  tự làm

    Kiểm tra theo tổng chi phí: tự làm 10.000 x 35 = 350.000
                                mua ngoài 300.000 + 20.000 + 60.000 (chi phí còn lại) = 380.000
                                chênh lệch 30.000 nghiêng về tự làm ✓

(b) Chi phí cơ hội của việc tự làm = số dư bộ phận bị bỏ qua 50.000
      Tự làm   : 270.000 + 50.000 = 320.000
      Mua ngoài:                    300.000
    Mua ngoài rẻ hơn 20.000   →  mua ngoài và dùng mặt bằng cho sản phẩm kia

(c) Giá tối đa mỗi bộ = chi phí thích hợp của việc tự làm tính cho mỗi bộ
      (a) 270.000 / 10.000 = 27
      (b) (270.000 + 50.000) / 10.000 = 32</code></pre>
<p><strong>Vì sao:</strong> “giá thành toàn bộ” 35 dẫn tới câu trả lời sai — mua giá 30 trông như tiết kiệm 5 mỗi bộ, nhưng 8 trong 35 (khấu hao 2 và định phí phân bổ 6) vẫn phát sinh, nên mua ngoài thực ra tốn thêm 30.000. Quyết định chỉ đảo chiều khi năng lực được giải phóng có công dụng thay thế có giá trị — vì vậy chi phí cơ hội phải có mặt trong phân tích dù không bao giờ xuất hiện trên sổ sách.</p>
<p><strong>(d) Yếu tố định tính:</strong> chất lượng và độ tin cậy giao hàng của nhà cung cấp (một bộ nguồn giao trễ làm dừng cả dây chuyền); phụ thuộc vào một nhà cung cấp và rủi ro tăng giá sau khi năng lực nội bộ không còn; mất bí quyết và quyền kiểm soát một chi tiết có thể mang tính chiến lược; bảo vệ thiết kế và thông tin bí mật; ảnh hưởng tới người lao động (công việc của tổ trưởng); và điều khoản hợp đồng — thời hạn, điều chỉnh giá, bảo hành.</p>`,
  ]]);

const c12q = quiz('acc302-quiz-5', 'Quiz 5 — Decisions & performance evaluation|||Quiz 5 — Ra quyết định & đánh giá thành quả', [
  { id: 'q1', question: 'Which item is NOT relevant when deciding whether to replace an old machine?|||Khoản nào KHÔNG thích hợp khi quyết định có thay máy cũ hay không?', options: ['The operating costs that would differ between the old and new machine|||Chi phí vận hành khác nhau giữa máy cũ và máy mới', 'The rental income the space could earn if one option frees it|||Tiền cho thuê mặt bằng có thể thu nếu một phương án giải phóng mặt bằng', 'The book value of the old machine|||Giá trị còn lại trên sổ của máy cũ', 'A fixed cost that would be avoided under one option|||Một khoản định phí sẽ tránh được ở một phương án'], correctIndex: 2, explanation: 'Book value reflects money already spent — a sunk cost that no decision can change. (Any resale value of the old machine, by contrast, is relevant.)|||Giá trị còn lại trên sổ phản ánh tiền đã chi — chi phí chìm không quyết định nào thay đổi được. (Ngược lại, giá bán lại được của máy cũ là thích hợp.)' },
  { id: 'q2', question: 'Machine-hours are the constraint. Product P has a CM of 24 and needs 3 machine-hours; product Q has a CM of 18 and needs 1.5 machine-hours. Which should get priority?|||Giờ máy là điều kiện giới hạn. Sản phẩm P có SDĐP 24 và cần 3 giờ máy; sản phẩm Q có SDĐP 18 và cần 1,5 giờ máy. Nên ưu tiên sản phẩm nào?', options: ['Q, because its CM per machine-hour (12) is higher than P’s (8)|||Q, vì SDĐP mỗi giờ máy của Q (12) cao hơn của P (8)', 'P, because its CM per unit (24) is higher|||P, vì SDĐP mỗi sản phẩm (24) cao hơn', 'P, because it uses more machine time|||P, vì dùng nhiều giờ máy hơn', 'Either — the constraint does not matter|||Sản phẩm nào cũng được — giới hạn không quan trọng'], correctIndex: 0, explanation: 'Rank by CM per unit of the constrained resource: P = 24 / 3 = 8, Q = 18 / 1.5 = 12 per machine-hour.|||Xếp hạng theo SDĐP trên một đơn vị nguồn lực giới hạn: P = 24 / 3 = 8, Q = 18 / 1,5 = 12 mỗi giờ máy.' },
  { id: 'q3', question: 'A division has net operating income of 120,000, average operating assets of 800,000 and a minimum required return of 12%. Its ROI and residual income are…|||Một khối có lợi nhuận thuần từ hoạt động 120.000, tài sản hoạt động bình quân 800.000 và tỷ suất sinh lời tối thiểu 12%. ROI và lợi nhuận còn lại của khối là…', options: ['ROI 12%, RI 0|||ROI 12%, RI 0', 'ROI 15%, RI 96,000|||ROI 15%, RI 96.000', 'ROI 12%, RI 24,000|||ROI 12%, RI 24.000', 'ROI 15%, RI 24,000|||ROI 15%, RI 24.000'], correctIndex: 3, explanation: 'ROI = 120,000 / 800,000 = 15%; RI = 120,000 − 12% x 800,000 = 120,000 − 96,000 = 24,000.|||ROI = 120.000 / 800.000 = 15%; RI = 120.000 − 12% x 800.000 = 120.000 − 96.000 = 24.000.' },
]);

const taiLieu = doc('acc302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ACC302 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning managerial accounting: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official ACC302 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-managerial-accounting" target="_blank" rel="noopener">Principles of Accounting, Volume 2: Managerial Accounting</a> — OpenStax: a free, peer-reviewed open textbook covering every topic in this course.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Managerial Accounting</a> — Ray H. Garrison, Eric W. Noreen &amp; Peter C. Brewer (McGraw Hill) — the classic text this course follows; search for the title on the publisher’s site.</li>
</ul>
<p>For more depth on costing systems: Horngren, Datar &amp; Rajan — <em>Cost Accounting: A Managerial Emphasis</em> (<a href="https://www.pearson.com/" target="_blank" rel="noopener">Pearson</a> — search for the title on the publisher’s site).</p>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-financial-accounting" target="_blank" rel="noopener">Principles of Accounting, Volume 1: Financial Accounting</a> — OpenStax: review the financial-accounting basics this course builds on.</li>
<li><a href="https://www.imanet.org/" target="_blank" rel="noopener">Institute of Management Accountants (IMA)</a> — the CMA credential, articles and the Statement of Ethical Professional Practice.</li>
<li><a href="https://www.aicpa-cima.com/" target="_blank" rel="noopener">AICPA &amp; CIMA</a> — the global body behind the CIMA qualification in management accounting.</li>
<li><a href="https://www.ifrs.org/issued-standards/list-of-standards/" target="_blank" rel="noopener">IFRS — list of standards</a> — find IAS 2 <em>Inventories</em>, the rule behind absorption costing in published statements.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Edspira" target="_blank" rel="noopener">Edspira</a> — short, clear lessons on accounting and finance by a university professor, including managerial accounting.</li>
<li><a href="https://www.youtube.com/@FarhatLectures" target="_blank" rel="noopener">Farhat Lectures</a> — step-by-step accounting lectures, including cost and managerial topics.</li>
<li><a href="https://www.youtube.com/@AccountingStuff" target="_blank" rel="noopener">Accounting Stuff</a> — visual explanations of accounting fundamentals.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — build CVP tables, budgets and variance schedules; SLOPE and INTERCEPT for cost estimation.</li>
<li><a href="https://www.libreoffice.org/discover/calc/" target="_blank" rel="noopener">LibreOffice Calc</a> — a free desktop spreadsheet with the same functions (Microsoft Excel works the same way).</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — cost classification, cost behavior and CVP, following Parts 1–2 here.</li>
<li><strong>Practise</strong> — each week, redo one worked example with new numbers in a spreadsheet and check every F/U sign.</li>
<li><strong>Go deeper</strong> — build a three-month master budget ending in a cash budget, then flex it to a different volume.</li>
<li><strong>Apply</strong> — pick a small business you know and write a one-page relevant-cost memo for a real decision it faces.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">ACC302 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học kế toán quản trị: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của ACC302.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-managerial-accounting" target="_blank" rel="noopener">Principles of Accounting, Volume 2: Managerial Accounting</a> — OpenStax: giáo trình mở miễn phí, có bình duyệt, bao quát mọi chủ đề của môn.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Managerial Accounting</a> — Ray H. Garrison, Eric W. Noreen &amp; Peter C. Brewer (McGraw Hill) — giáo trình kinh điển mà môn học bám theo; tra tên sách trên trang nhà xuất bản.</li>
</ul>
<p>Muốn đào sâu về hệ thống tính giá thành: Horngren, Datar &amp; Rajan — <em>Cost Accounting: A Managerial Emphasis</em> (<a href="https://www.pearson.com/" target="_blank" rel="noopener">Pearson</a> — tra tên sách trên trang nhà xuất bản).</p>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-financial-accounting" target="_blank" rel="noopener">Principles of Accounting, Volume 1: Financial Accounting</a> — OpenStax: ôn lại nền tảng kế toán tài chính mà môn này dựa vào.</li>
<li><a href="https://www.imanet.org/" target="_blank" rel="noopener">Institute of Management Accountants (IMA)</a> — chứng chỉ CMA, bài viết và Tuyên bố về thực hành nghề nghiệp có đạo đức.</li>
<li><a href="https://www.aicpa-cima.com/" target="_blank" rel="noopener">AICPA &amp; CIMA</a> — tổ chức toàn cầu đứng sau chứng chỉ kế toán quản trị CIMA.</li>
<li><a href="https://www.ifrs.org/issued-standards/list-of-standards/" target="_blank" rel="noopener">IFRS — danh mục chuẩn mực</a> — tra IAS 2 <em>Hàng tồn kho</em>, quy định đứng sau phương pháp chi phí toàn bộ trong báo cáo tài chính.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Edspira" target="_blank" rel="noopener">Edspira</a> — bài giảng ngắn, rõ ràng về kế toán và tài chính của một giảng viên đại học, có cả kế toán quản trị.</li>
<li><a href="https://www.youtube.com/@FarhatLectures" target="_blank" rel="noopener">Farhat Lectures</a> — bài giảng kế toán từng bước, có cả chủ đề kế toán chi phí và kế toán quản trị.</li>
<li><a href="https://www.youtube.com/@AccountingStuff" target="_blank" rel="noopener">Accounting Stuff</a> — giải thích trực quan các kiến thức kế toán nền tảng.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — dựng bảng CVP, dự toán và bảng phân tích biến động; hàm SLOPE và INTERCEPT để ước tính chi phí.</li>
<li><a href="https://www.libreoffice.org/discover/calc/" target="_blank" rel="noopener">LibreOffice Calc</a> — bảng tính miễn phí trên máy tính với các hàm tương tự (Microsoft Excel dùng y như vậy).</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — phân loại chi phí, ứng xử chi phí và CVP, theo đúng Phần 1–2 ở đây.</li>
<li><strong>Luyện tập</strong> — mỗi tuần làm lại một ví dụ mẫu với số liệu mới trên bảng tính và kiểm từng dấu F/U.</li>
<li><strong>Đào sâu</strong> — lập dự toán tổng thể ba tháng kết thúc bằng dự toán tiền, rồi linh hoạt hoá nó cho một mức sản lượng khác.</li>
<li><strong>Vận dụng</strong> — chọn một doanh nghiệp nhỏ bạn biết và viết một bản ghi nhớ một trang về chi phí thích hợp cho một quyết định thật của họ.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'ACC302',
    slug: 'acc302-managerial-accounting',
    title: 'Managerial Accounting',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ACC302.webp',
    shortDescription: 'Accounting for managers: cost behavior, cost-volume-profit analysis, job, process and activity-based costing, variable vs absorption costing, budgets, standard-cost variances, relevant costs for decisions, ROI and residual income. Bilingual, with exercises and quizzes.|||Kế toán cho nhà quản trị: ứng xử chi phí, CVP, chi phí theo công việc, quá trình, ABC, chi phí biến đổi và toàn bộ, dự toán, biến động chi phí, chi phí thích hợp, ROI, RI. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>ACC302 — Managerial Accounting (Kế toán quản trị)</strong> (khối Quản trị Kinh doanh, kỳ 4) dạy cách dùng thông tin kế toán để <strong>lập kế hoạch, kiểm soát và ra quyết định</strong> bên trong doanh nghiệp. Từ <strong>phân loại và ứng xử chi phí</strong> (phương pháp cực đại – cực tiểu, báo cáo theo số dư đảm phí) → <strong>phân tích CVP</strong> (điểm hoà vốn, lợi nhuận mục tiêu, số dư an toàn, đòn bẩy kinh doanh, kết cấu sản phẩm) → <strong>xác định chi phí sản phẩm</strong> (theo công việc, theo quá trình, ABC, chi phí biến đổi và chi phí toàn bộ) → <strong>dự toán tổng thể, dự toán linh hoạt và phân tích biến động</strong> NVL, nhân công, biến phí SXC → <strong>chi phí thích hợp cho quyết định</strong> (đơn hàng đặc biệt, tự làm hay mua, loại bỏ bộ phận, nguồn lực giới hạn) và <strong>đánh giá thành quả</strong> (ROI, lợi nhuận còn lại, định giá chuyển giao). Bám cấu trúc giáo trình Garrison, Noreen &amp; Brewer, Horngren và OpenStax; song ngữ Anh–Việt; mọi ví dụ số là giả định và đã kiểm bằng máy; có bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Phân biệt kế toán quản trị với kế toán tài chính; phân loại chi phí theo từng mục đích sử dụng\nTách chi phí hỗn hợp bằng phương pháp cực đại – cực tiểu và lập báo cáo kết quả kinh doanh theo số dư đảm phí\nTính điểm hoà vốn, sản lượng cho lợi nhuận mục tiêu, số dư an toàn, đòn bẩy kinh doanh và hoà vốn nhiều sản phẩm\nTính chi phí theo công việc (phân bổ SXC ước tính, phân bổ thừa/thiếu) và theo quá trình (sản lượng tương đương)\nÁp dụng ABC và đối chiếu lợi nhuận giữa phương pháp chi phí biến đổi và chi phí toàn bộ\nLập dự toán tổng thể: tiêu thụ, lịch thu tiền, sản xuất, mua nguyên vật liệu và dự toán tiền\nLập dự toán linh hoạt và phân tích biến động giá, lượng NVL, đơn giá, năng suất nhân công, biến phí SXC (F/U)\nRa quyết định bằng chi phí thích hợp và đánh giá bộ phận bằng ROI, lợi nhuận còn lại, giá chuyển giao',
    requirements: 'Nên học trước ACC101 — Principles of Accounting (hiểu bút toán và báo cáo tài chính)\nĐại số phổ thông và tính phần trăm\nBảng tính (Google Sheets, Excel hoặc LibreOffice Calc) để luyện bài',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Kế toán quản trị và kế toán tài chính, việc của nhà quản trị, đạo đức nghề nghiệp.', lessons: [intro] },
    { title: 'Part 1 — Cost concepts & cost behavior|||Phần 1 — Khái niệm & ứng xử chi phí', description: 'Phân loại chi phí, biến phí, định phí, cực đại – cực tiểu, báo cáo số dư đảm phí.', lessons: [c1, c2, c2q] },
    { title: 'Part 2 — Cost-volume-profit analysis|||Phần 2 — Phân tích chi phí – khối lượng – lợi nhuận', description: 'Số dư đảm phí, hoà vốn, lợi nhuận mục tiêu, số dư an toàn, đòn bẩy, kết cấu sản phẩm.', lessons: [c3, c4, c4e, c4q] },
    { title: 'Part 3 — Product costing systems|||Phần 3 — Hệ thống xác định chi phí sản phẩm', description: 'Theo công việc, theo quá trình, ABC, chi phí biến đổi và chi phí toàn bộ.', lessons: [c5, c6, c7, c7q] },
    { title: 'Part 4 — Budgeting & standard costs|||Phần 4 — Dự toán & chi phí định mức', description: 'Dự toán tổng thể, dự toán tiền, dự toán linh hoạt, biến động NVL, nhân công, biến phí SXC.', lessons: [c8, c9, c10, c10e, c10q] },
    { title: 'Part 5 — Decisions & performance evaluation|||Phần 5 — Ra quyết định & đánh giá thành quả', description: 'Chi phí thích hợp, tự làm hay mua, trung tâm trách nhiệm, ROI, RI, giá chuyển giao.', lessons: [c11, c12, c12e, c12q] },
  ],
};
