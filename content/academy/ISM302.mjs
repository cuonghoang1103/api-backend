/**
 * ISM302 — Enterprise Resource Planning (Hoạch định nguồn lực doanh nghiệp).
 * Ngành Hệ thống thông tin FPTU. FULL KHUNG chất lượng — 8 chương.
 * Sách chuẩn: Monk & Wagner "Concepts in Enterprise Resource Planning";
 * Magal & Word "Essentials of Business Processes and Information Systems";
 * SAP Learning Hub; Odoo docs. Song ngữ + quy trình + ví dụ phần mềm thật.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ lồng; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ism302-0-1-overview', 'Course overview: Enterprise Resource Planning|||Tổng quan: Hoạch định nguồn lực doanh nghiệp',
  'ERP là gì; vì sao doanh nghiệp gom mọi chức năng vào một hệ thống; lộ trình: quy trình & tích hợp → Tài chính → Mua hàng/Kho → Sản xuất → Bán hàng → triển khai → ERP đám mây.',
  [[
    `<span class="eyebrow">ISM302 · Lesson 0.1 · Overview</span>
<h2>Enterprise Resource Planning</h2>
<p class="lead">This course explains <strong>how a business runs on one integrated system</strong>. An <strong>ERP</strong> ties Finance, Procurement, Inventory, Production, and Sales together so that a single fact — a customer order, a stock movement, an invoice — is entered once and instantly seen everywhere.</p>
<h3>The core idea</h3>
<ul>
<li><strong>One database</strong> — every module reads and writes the same shared data, so there is a single version of the truth.</li>
<li><strong>Real business processes</strong> — ERP models end-to-end flows (order-to-cash, procure-to-pay), not isolated tasks.</li>
<li><strong>Real software</strong> — you will meet <strong>SAP</strong>, <strong>Oracle</strong> and <strong>Odoo</strong>, the systems companies actually run on.</li>
</ul>
<h3>Roadmap</h3>
<p>What ERP is &amp; its history (MRP → ERP) → business processes &amp; integration → the modules (Finance, Procurement &amp; Inventory, Production, Sales &amp; Distribution) → implementing ERP → modern cloud ERP (SAP S/4HANA, Odoo, AI). Bilingual, with worked business examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">ISM302 · Bài 0.1 · Tổng quan</span>
<h2>Hoạch định nguồn lực doanh nghiệp (ERP)</h2>
<p class="lead">Môn này giải thích <strong>một doanh nghiệp vận hành trên một hệ thống tích hợp thế nào</strong>. Một <strong>ERP</strong> nối Tài chính, Mua hàng, Kho, Sản xuất và Bán hàng lại với nhau, để một dữ kiện — một đơn hàng, một lần xuất nhập kho, một hoá đơn — chỉ nhập MỘT lần và lập tức hiện ra ở mọi nơi.</p>
<h3>Ý tưởng lõi</h3>
<ul>
<li><strong>Một cơ sở dữ liệu</strong> — mọi module đọc/ghi cùng một kho dữ liệu chung, nên chỉ có một phiên bản sự thật.</li>
<li><strong>Quy trình kinh doanh thật</strong> — ERP mô hình hoá dòng chảy đầu-cuối (order-to-cash, procure-to-pay), không phải từng tác vụ rời rạc.</li>
<li><strong>Phần mềm thật</strong> — bạn sẽ gặp <strong>SAP</strong>, <strong>Oracle</strong> và <strong>Odoo</strong>, những hệ mà doanh nghiệp thực sự chạy.</li>
</ul>
<h3>Lộ trình</h3>
<p>ERP là gì &amp; lịch sử (MRP → ERP) → quy trình kinh doanh &amp; tích hợp → các module (Tài chính, Mua hàng &amp; Kho, Sản xuất, Bán hàng &amp; Phân phối) → triển khai ERP → ERP đám mây hiện đại (SAP S/4HANA, Odoo, AI). Song ngữ, có ví dụ doanh nghiệp và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ism302-1-1-erp-la-gi', '1.1 — What is ERP? MRP to ERP|||1.1 — ERP là gì? Từ MRP đến ERP',
  'Khái niệm ERP, lịch sử MRP → MRP II → ERP, vì sao tích hợp; lợi ích (một sự thật, hiệu quả) và thách thức (chi phí, độ phức tạp).',
  [[
    `<span class="eyebrow">ISM302 · Chapter 1 · Lesson 1.1</span>
<h2>What is ERP?</h2>
<p><strong>Enterprise Resource Planning (ERP)</strong> is a single software suite that manages a company's core functions on <strong>one shared database</strong>. Instead of separate programs for accounting, inventory and sales, ERP runs them as integrated modules.</p>
<h3>From MRP to ERP — a short history</h3>
<pre><code>1960s  Inventory control    -> track stock levels
1970s  MRP  (Material Req.)  -> plan materials from a production schedule
1980s  MRP II (Manufacturing)-> add capacity, finance, shop floor
1990s  ERP                   -> integrate ALL functions (SAP R/3, 1992)
2000s+ Cloud / SaaS ERP      -> S/4HANA, Oracle Fusion, Odoo, NetSuite
</code></pre>
<p>The word "planning" is a legacy of manufacturing roots, but a modern ERP does far more than plan materials — it is the operational backbone of the whole firm.</p>
<h3>Why integrate?</h3>
<ul>
<li><strong>One version of the truth</strong> — no reconciling five spreadsheets that disagree.</li>
<li><strong>Enter once, use everywhere</strong> — a sales order updates inventory, finance and shipping at the same moment.</li>
<li><strong>Standard best practice</strong> — the software encodes proven processes.</li>
</ul>
<h3>Benefits vs. challenges</h3>
<ul>
<li><strong>Benefits:</strong> efficiency, real-time reporting, fewer errors, better decisions.</li>
<li><strong>Challenges:</strong> high cost, long implementation, complexity, and the need to change how people work.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> When a Highlands Coffee cashier rings up a latte, an ERP can cut the beans and milk from inventory, book the revenue, and flag a reorder — all from one transaction.</div>`,
    `<span class="eyebrow">ISM302 · Chương 1 · Bài 1.1</span>
<h2>ERP là gì?</h2>
<p><strong>Hoạch định nguồn lực doanh nghiệp (ERP)</strong> là một bộ phần mềm quản lý các chức năng cốt lõi của doanh nghiệp trên <strong>một cơ sở dữ liệu chung</strong>. Thay vì mỗi phần mềm riêng cho kế toán, kho, bán hàng, ERP chạy chúng như các module tích hợp.</p>
<h3>Từ MRP đến ERP — lịch sử ngắn</h3>
<pre><code>1960s  Kiểm soát tồn kho     -> theo dõi mức tồn
1970s  MRP  (hoạch định VT)  -> tính vật tư từ lịch sản xuất
1980s  MRP II (sản xuất)     -> thêm năng lực, tài chính, xưởng
1990s  ERP                   -> tích hợp MỌI chức năng (SAP R/3, 1992)
2000s+ ERP đám mây / SaaS    -> S/4HANA, Oracle Fusion, Odoo, NetSuite
</code></pre>
<p>Chữ "hoạch định" là dấu vết gốc gác sản xuất, nhưng ERP hiện đại làm nhiều hơn hoạch định vật tư — nó là xương sống vận hành của cả doanh nghiệp.</p>
<h3>Vì sao tích hợp?</h3>
<ul>
<li><strong>Một phiên bản sự thật</strong> — không phải đối chiếu năm bảng tính vênh nhau.</li>
<li><strong>Nhập một lần, dùng mọi nơi</strong> — một đơn bán hàng cập nhật kho, tài chính và giao hàng cùng lúc.</li>
<li><strong>Chuẩn thực hành tốt</strong> — phần mềm mã hoá sẵn các quy trình đã được kiểm chứng.</li>
</ul>
<h3>Lợi ích và thách thức</h3>
<ul>
<li><strong>Lợi ích:</strong> hiệu quả, báo cáo thời gian thực, ít sai sót, quyết định tốt hơn.</li>
<li><strong>Thách thức:</strong> chi phí cao, triển khai lâu, phức tạp, và phải thay đổi cách con người làm việc.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Khi thu ngân Highlands Coffee bấm bán một ly latte, ERP có thể trừ cà phê và sữa khỏi tồn kho, ghi doanh thu, và bật cảnh báo đặt hàng lại — tất cả từ một giao dịch.</div>`,
  ]]);

const c1q = quiz('ism302-quiz-1', 'Quiz 1 — What is ERP|||Quiz 1 — ERP là gì', [
  { id: 'q1', question: 'Đặc trưng cốt lõi của một hệ ERP là?|||Đặc trưng cốt lõi của một hệ ERP là?', options: ['Mỗi phòng ban một phần mềm riêng', 'Một cơ sở dữ liệu chung cho mọi module', 'Chỉ dùng cho kế toán', 'Chỉ chạy trên giấy'], correctIndex: 1, explanation: 'ERP tích hợp mọi chức năng trên một CSDL chung — một phiên bản sự thật.' },
  { id: 'q2', question: 'Thứ tự lịch sử đúng là?|||Thứ tự lịch sử đúng là?', options: ['ERP → MRP II → MRP', 'MRP → MRP II → ERP', 'ERP → MRP → MRP II', 'MRP II → MRP → ERP'], correctIndex: 1, explanation: 'MRP (vật tư) → MRP II (thêm năng lực/tài chính) → ERP (tích hợp toàn bộ).' },
  { id: 'q3', question: 'Đâu là THÁCH THỨC điển hình khi dùng ERP?|||Đâu là THÁCH THỨC điển hình khi dùng ERP?', options: ['Báo cáo thời gian thực', 'Chi phí cao và triển khai phức tạp, lâu', 'Ít sai sót dữ liệu', 'Một phiên bản sự thật'], correctIndex: 1, explanation: 'Lợi ích thì rõ, nhưng chi phí, độ phức tạp và thời gian triển khai là thách thức lớn.' },
]);

const c2 = doc('ism302-2-1-business-process', '2.1 — Business processes & integration|||2.1 — Quy trình kinh doanh & tích hợp',
  'Quy trình kinh doanh là gì; silo chức năng vs hệ tích hợp; quy trình xuyên chức năng (procure-to-pay, order-to-cash).',
  [[
    `<span class="eyebrow">ISM302 · Chapter 2 · Lesson 2.1</span>
<h2>Business processes &amp; integration</h2>
<h3>What is a business process?</h3>
<p>A <strong>business process</strong> is a chain of activities that turns an input into a valuable output for a customer — for example, taking an order, picking the goods, shipping, invoicing and collecting payment. ERP is valuable precisely because it runs these processes <em>end to end</em>.</p>
<h3>Silos vs. integration</h3>
<p>In a <strong>functional silo</strong>, each department has its own system and re-keys data across boundaries — slow, error-prone, and blind to the whole. An <strong>integrated</strong> ERP lets one process flow across departments on shared data.</p>
<pre><code>Silo:        Sales file  ->  (email)  ->  Warehouse file  ->  (call)  ->  Finance file
Integrated:  ERP order  ->  auto-reserves stock  ->  auto-books revenue  ->  auto-invoices
</code></pre>
<h3>Two cross-functional flows you will meet</h3>
<ul>
<li><strong>Procure-to-Pay (P2P):</strong> need → purchase order → goods receipt → supplier invoice → payment. Spans Procurement, Inventory and Finance.</li>
<li><strong>Order-to-Cash (O2C):</strong> customer order → availability check → delivery → customer invoice → cash receipt. Spans Sales, Inventory and Finance.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> Notice both flows END in Finance. That is the heart of ERP integration: a physical event (goods move) and its financial effect (money moves) are two sides of one transaction, recorded together.</div>`,
    `<span class="eyebrow">ISM302 · Chương 2 · Bài 2.1</span>
<h2>Quy trình kinh doanh &amp; tích hợp</h2>
<h3>Quy trình kinh doanh là gì?</h3>
<p>Một <strong>quy trình kinh doanh</strong> là chuỗi hoạt động biến đầu vào thành đầu ra có giá trị cho khách hàng — ví dụ nhận đơn, soạn hàng, giao, xuất hoá đơn và thu tiền. ERP có giá trị chính vì nó chạy các quy trình này <em>từ đầu tới cuối</em>.</p>
<h3>Silo vs tích hợp</h3>
<p>Trong <strong>silo chức năng</strong>, mỗi phòng có hệ thống riêng và phải gõ lại dữ liệu khi vượt ranh giới — chậm, dễ sai, và mù về tổng thể. Một ERP <strong>tích hợp</strong> để một quy trình chảy xuyên các phòng trên dữ liệu chung.</p>
<pre><code>Silo:        File Bán hàng -> (email) -> File Kho -> (điện thoại) -> File Tài chính
Tích hợp:    Đơn ERP -> tự giữ hàng -> tự ghi doanh thu -> tự xuất hoá đơn
</code></pre>
<h3>Hai dòng chảy xuyên chức năng bạn sẽ gặp</h3>
<ul>
<li><strong>Procure-to-Pay (P2P):</strong> nhu cầu → đơn mua → nhập hàng → hoá đơn NCC → thanh toán. Trải Mua hàng, Kho và Tài chính.</li>
<li><strong>Order-to-Cash (O2C):</strong> đơn khách → kiểm tồn → giao hàng → hoá đơn khách → thu tiền. Trải Bán hàng, Kho và Tài chính.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Cả hai dòng đều KẾT THÚC ở Tài chính. Đó là trái tim của tích hợp ERP: một sự kiện vật lý (hàng dịch chuyển) và hệ quả tài chính của nó (tiền dịch chuyển) là hai mặt của một giao dịch, được ghi cùng nhau.</div>`,
  ]]);

const c2q = quiz('ism302-quiz-2', 'Quiz 2 — Processes & integration|||Quiz 2 — Quy trình & tích hợp', [
  { id: 'q1', question: 'Quy trình "Order-to-Cash" trải qua các phòng nào?|||Quy trình "Order-to-Cash" trải qua các phòng nào?', options: ['Chỉ Bán hàng', 'Bán hàng, Kho và Tài chính', 'Chỉ Sản xuất', 'Chỉ Nhân sự'], correctIndex: 1, explanation: 'O2C: đơn khách → kiểm tồn (Kho) → giao → hoá đơn → thu tiền (Tài chính).' },
  { id: 'q2', question: 'Nhược điểm chính của các "silo chức năng" là?|||Nhược điểm chính của các "silo chức năng" là?', options: ['Dữ liệu chung, luôn khớp', 'Phải gõ lại dữ liệu, chậm và dễ sai', 'Quá tích hợp', 'Không có phần mềm nào'], correctIndex: 1, explanation: 'Silo tách rời phải nhập lại dữ liệu giữa các hệ, gây chậm trễ và sai sót.' },
  { id: 'q3', question: 'Quy trình "Procure-to-Pay" bắt đầu và kết thúc bằng?|||Quy trình "Procure-to-Pay" bắt đầu và kết thúc bằng?', options: ['Bắt đầu bằng thanh toán, kết thúc bằng nhu cầu', 'Bắt đầu bằng nhu cầu/đơn mua, kết thúc bằng thanh toán NCC', 'Bắt đầu và kết thúc ở Kho', 'Chỉ có một bước'], correctIndex: 1, explanation: 'P2P: nhu cầu → đơn mua → nhập hàng → hoá đơn NCC → thanh toán.' },
]);

const c3 = doc('ism302-3-1-finance', '3.1 — Finance & Accounting (FI/CO)|||3.1 — Tài chính - Kế toán (FI/CO)',
  'Module tài chính: sổ cái (general ledger), phải thu/phải trả (AR/AP), kế toán quản trị (CO), báo cáo tài chính; ví dụ SAP FI/CO.',
  [[
    `<span class="eyebrow">ISM302 · Chapter 3 · Lesson 3.1</span>
<h2>Finance &amp; Accounting</h2>
<p>The finance module is the module every other module ultimately posts to. In SAP it splits into <strong>FI (Financial Accounting)</strong> — the legally required external books — and <strong>CO (Controlling)</strong> — internal cost and management accounting.</p>
<h3>Key building blocks</h3>
<ul>
<li><strong>General Ledger (G/L):</strong> the master book of all accounts; every transaction lands here as a balanced debit/credit entry.</li>
<li><strong>Accounts Receivable (AR):</strong> money customers owe you — driven by sales invoices.</li>
<li><strong>Accounts Payable (AP):</strong> money you owe suppliers — driven by purchase invoices.</li>
<li><strong>Asset accounting &amp; Controlling (CO):</strong> track fixed assets, cost centers and profitability.</li>
</ul>
<h3>Automatic postings — the ERP magic</h3>
<pre><code>Sales invoice for 10,000,000 VND is created (Sales module)
   -> FI auto-posts:
      DEBIT  Accounts Receivable   10,000,000
      CREDIT Sales Revenue         10,000,000
Goods shipped from stock
   -> FI auto-posts:
      DEBIT  Cost of Goods Sold
      CREDIT Inventory
</code></pre>
<p>Nobody types these journal entries by hand — the process triggers them. That is why an ERP can close the books far faster than manual accounting.</p>
<div class="callout"><span class="badge">Reporting</span> Because every event posts in real time, finance can produce a balance sheet, profit &amp; loss, and cash-flow report at any moment — not just at month end.</div>`,
    `<span class="eyebrow">ISM302 · Chương 3 · Bài 3.1</span>
<h2>Tài chính - Kế toán</h2>
<p>Module tài chính là nơi mọi module khác cuối cùng đều ghi vào. Trong SAP nó chia thành <strong>FI (Kế toán tài chính)</strong> — sổ sách đối ngoại theo luật — và <strong>CO (Kiểm soát)</strong> — kế toán chi phí và quản trị nội bộ.</p>
<h3>Các khối chính</h3>
<ul>
<li><strong>Sổ cái (G/L):</strong> sổ tổng của mọi tài khoản; mọi giao dịch vào đây thành bút toán nợ/có cân bằng.</li>
<li><strong>Phải thu (AR):</strong> tiền khách nợ bạn — sinh từ hoá đơn bán hàng.</li>
<li><strong>Phải trả (AP):</strong> tiền bạn nợ nhà cung cấp — sinh từ hoá đơn mua hàng.</li>
<li><strong>Kế toán tài sản &amp; Kiểm soát (CO):</strong> theo dõi tài sản cố định, trung tâm chi phí và khả năng sinh lời.</li>
</ul>
<h3>Ghi sổ tự động — phép màu của ERP</h3>
<pre><code>Tạo hoá đơn bán hàng 10.000.000 VND (module Bán hàng)
   -> FI tự ghi:
      NỢ  Phải thu khách hàng   10.000.000
      CÓ  Doanh thu bán hàng    10.000.000
Xuất hàng khỏi kho
   -> FI tự ghi:
      NỢ  Giá vốn hàng bán
      CÓ  Hàng tồn kho
</code></pre>
<p>Không ai gõ tay các bút toán này — quy trình tự kích hoạt chúng. Nhờ đó ERP khoá sổ nhanh hơn nhiều so với kế toán thủ công.</p>
<div class="callout"><span class="badge">Báo cáo</span> Vì mọi sự kiện ghi sổ theo thời gian thực, tài chính có thể xuất bảng cân đối, báo cáo lãi/lỗ và dòng tiền bất cứ lúc nào — không chỉ cuối tháng.</div>`,
  ]]);

const c3q = quiz('ism302-quiz-3', 'Quiz 3 — Finance & Accounting|||Quiz 3 — Tài chính - Kế toán', [
  { id: 'q1', question: '"Accounts Receivable" (phải thu) ghi lại điều gì?|||"Accounts Receivable" (phải thu) ghi lại điều gì?', options: ['Tiền bạn nợ nhà cung cấp', 'Tiền khách hàng nợ bạn', 'Lương nhân viên', 'Tồn kho'], correctIndex: 1, explanation: 'AR = phải thu = tiền khách nợ, sinh từ hoá đơn bán hàng. AP mới là phải trả NCC.' },
  { id: 'q2', question: 'Trong SAP, FI và CO khác nhau ở đâu?|||Trong SAP, FI và CO khác nhau ở đâu?', options: ['FI nội bộ, CO đối ngoại', 'FI là kế toán tài chính đối ngoại; CO là kiểm soát chi phí nội bộ', 'FI và CO giống hệt nhau', 'Cả hai chỉ để in hoá đơn'], correctIndex: 1, explanation: 'FI = sổ sách đối ngoại theo luật; CO = kế toán chi phí/quản trị nội bộ.' },
  { id: 'q3', question: 'Vì sao ERP khoá sổ nhanh hơn kế toán thủ công?|||Vì sao ERP khoá sổ nhanh hơn kế toán thủ công?', options: ['Vì kế toán viên gõ nhanh hơn', 'Vì mỗi quy trình tự sinh bút toán vào sổ cái theo thời gian thực', 'Vì không cần sổ cái', 'Vì bỏ qua báo cáo'], correctIndex: 1, explanation: 'Bán hàng, xuất kho... tự động tạo bút toán FI nên sổ luôn cập nhật.' },
]);

const c4 = doc('ism302-4-1-procurement', '4.1 — Procurement & Inventory (MM)|||4.1 — Mua hàng & Kho (MM)',
  'Module Materials Management: quy trình mua hàng (procure-to-pay), quản lý nhà cung cấp, quản lý tồn kho, phiếu yêu cầu/đơn mua/nhập hàng.',
  [[
    `<span class="eyebrow">ISM302 · Chapter 4 · Lesson 4.1</span>
<h2>Procurement &amp; Inventory</h2>
<p>In SAP this is <strong>MM (Materials Management)</strong>. It runs the <strong>Procure-to-Pay</strong> cycle and keeps stock accurate.</p>
<h3>The procurement cycle, step by step</h3>
<pre><code>1. Purchase Requisition  (PR)  -> internal "we need this"
2. Purchase Order        (PO)  -> formal order to a chosen vendor
3. Goods Receipt         (GR)  -> stock arrives, inventory goes UP
4. Invoice Receipt       (IR)  -> vendor invoice recorded (AP)
5. Payment                     -> supplier is paid
</code></pre>
<h3>The three-way match</h3>
<p>Before paying, ERP checks that the <strong>PO</strong>, the <strong>goods receipt</strong> and the <strong>invoice</strong> all agree on quantity and price. If they match, payment is approved automatically; if not, it is blocked for review. This one control stops most overpayment and fraud.</p>
<h3>Inventory management</h3>
<ul>
<li><strong>Material master:</strong> one record per item (code, unit, price, reorder level).</li>
<li><strong>Vendor master:</strong> supplier data, terms and history.</li>
<li><strong>Stock movements:</strong> every receipt, issue and transfer is logged, so on-hand quantity and value are always current.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> A Vinamilk warehouse receiving 1,000 boxes: the goods receipt raises inventory, the three-way match releases payment to the supplier, and finance sees the payable instantly — one flow, three departments.</div>`,
    `<span class="eyebrow">ISM302 · Chương 4 · Bài 4.1</span>
<h2>Mua hàng &amp; Kho</h2>
<p>Trong SAP đây là <strong>MM (Quản lý vật tư)</strong>. Nó chạy chu trình <strong>Procure-to-Pay</strong> và giữ tồn kho chính xác.</p>
<h3>Chu trình mua hàng, từng bước</h3>
<pre><code>1. Phiếu yêu cầu mua (PR) -> nội bộ "chúng ta cần cái này"
2. Đơn mua hàng     (PO) -> đơn chính thức gửi NCC đã chọn
3. Nhập hàng        (GR) -> hàng về, tồn kho TĂNG
4. Nhận hoá đơn     (IR) -> ghi hoá đơn NCC (phải trả)
5. Thanh toán            -> trả tiền nhà cung cấp
</code></pre>
<h3>Đối chiếu ba bên (three-way match)</h3>
<p>Trước khi trả, ERP kiểm tra <strong>đơn mua</strong>, <strong>phiếu nhập</strong> và <strong>hoá đơn</strong> có khớp nhau về số lượng và giá không. Khớp thì duyệt trả tự động; lệch thì chặn lại để soát. Chốt kiểm này chặn phần lớn việc trả thừa và gian lận.</p>
<h3>Quản lý tồn kho</h3>
<ul>
<li><strong>Danh mục vật tư:</strong> một bản ghi cho mỗi mặt hàng (mã, đơn vị, giá, mức đặt lại).</li>
<li><strong>Danh mục nhà cung cấp:</strong> dữ liệu NCC, điều khoản và lịch sử.</li>
<li><strong>Dịch chuyển kho:</strong> mọi lần nhập, xuất, chuyển đều được ghi, nên số lượng và giá trị tồn luôn cập nhật.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Kho Vinamilk nhận 1.000 thùng: phiếu nhập làm tăng tồn kho, đối chiếu ba bên mở thanh toán cho NCC, và tài chính thấy khoản phải trả ngay — một dòng chảy, ba phòng ban.</div>`,
  ]]);

const c4q = quiz('ism302-quiz-4', 'Quiz 4 — Procurement & Inventory|||Quiz 4 — Mua hàng & Kho', [
  { id: 'q1', question: 'Thứ tự đúng của chu trình mua hàng là?|||Thứ tự đúng của chu trình mua hàng là?', options: ['PO → PR → thanh toán → nhập hàng', 'PR (yêu cầu) → PO (đơn mua) → nhập hàng → hoá đơn → thanh toán', 'Nhập hàng → PR → PO', 'Thanh toán → PO → PR'], correctIndex: 1, explanation: 'Yêu cầu → đơn mua → nhập hàng (GR) → hoá đơn (IR) → thanh toán.' },
  { id: 'q2', question: '"Đối chiếu ba bên" so khớp những chứng từ nào?|||"Đối chiếu ba bên" so khớp những chứng từ nào?', options: ['Ba hoá đơn khác nhau', 'Đơn mua, phiếu nhập và hoá đơn NCC', 'Ba đơn mua', 'Bảng lương, hoá đơn và hợp đồng'], correctIndex: 1, explanation: 'PO + Goods Receipt + Invoice phải khớp số lượng/giá trước khi trả tiền.' },
  { id: 'q3', question: 'Khi hàng về kho (goods receipt), điều gì xảy ra?|||Khi hàng về kho (goods receipt), điều gì xảy ra?', options: ['Tồn kho giảm', 'Tồn kho tăng và giá trị tồn cập nhật', 'Xoá đơn mua', 'Không ghi nhận gì'], correctIndex: 1, explanation: 'Nhập hàng làm tăng số lượng và giá trị tồn kho, đồng thời tạo cơ sở cho phải trả.' },
]);

const c5 = doc('ism302-5-1-production', '5.1 — Production Planning (PP)|||5.1 — Sản xuất (PP)',
  'Module Production Planning: hoạch định vật tư MRP, định mức nguyên vật liệu BOM, lịch sản xuất, lệnh sản xuất; ví dụ nhà máy.',
  [[
    `<span class="eyebrow">ISM302 · Chapter 5 · Lesson 5.1</span>
<h2>Production Planning</h2>
<p><strong>PP (Production Planning)</strong> answers the manufacturer's core question: <em>what to make, how much, and when — and therefore what materials to buy.</em></p>
<h3>Two master data pieces</h3>
<ul>
<li><strong>Bill of Materials (BOM):</strong> the recipe — the list of components and quantities needed to build one finished product.</li>
<li><strong>Routing / work centers:</strong> the steps and machines used to make it (for capacity planning).</li>
</ul>
<h3>MRP — the calculation engine</h3>
<pre><code>Demand (sales orders + forecast)
   x BOM (what each unit needs)
   - Stock on hand
   - Open purchase orders
   = Net requirement  -> planned orders:
        make-items  -> Production Orders
        buy-items   -> Purchase Requisitions (handed to Procurement)
</code></pre>
<p>This is where the "planning" in ERP earns its name: MRP explodes a production plan down through every BOM level and tells you exactly what to make and buy, and by when.</p>
<div class="callout"><span class="badge">Real example</span> A THACO plant plans 500 cars. MRP multiplies the car BOM (4 wheels, 1 engine, ...) by 500, subtracts stock, and raises purchase requisitions for the missing parts and production orders for the assembly line.</div>`,
    `<span class="eyebrow">ISM302 · Chương 5 · Bài 5.1</span>
<h2>Sản xuất (Production Planning)</h2>
<p><strong>PP (Hoạch định sản xuất)</strong> trả lời câu hỏi cốt lõi của nhà sản xuất: <em>làm gì, bao nhiêu, khi nào — và do đó cần mua vật tư gì.</em></p>
<h3>Hai dữ liệu gốc</h3>
<ul>
<li><strong>Định mức nguyên vật liệu (BOM):</strong> "công thức" — danh sách linh kiện và số lượng để làm ra một thành phẩm.</li>
<li><strong>Quy trình / trung tâm làm việc:</strong> các bước và máy móc dùng để sản xuất (để hoạch định năng lực).</li>
</ul>
<h3>MRP — cỗ máy tính toán</h3>
<pre><code>Nhu cầu (đơn bán + dự báo)
   x BOM (mỗi đơn vị cần gì)
   - Tồn kho hiện có
   - Đơn mua đang mở
   = Nhu cầu ròng  -> đơn kế hoạch:
        hàng tự làm -> Lệnh sản xuất
        hàng đi mua -> Phiếu yêu cầu mua (chuyển sang Mua hàng)
</code></pre>
<p>Đây là chỗ chữ "hoạch định" trong ERP xứng với tên: MRP bung kế hoạch sản xuất xuống từng cấp BOM và cho biết chính xác cần làm gì, mua gì, khi nào.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Nhà máy THACO lên kế hoạch 500 xe. MRP nhân BOM của xe (4 bánh, 1 động cơ, ...) với 500, trừ tồn kho, rồi phát phiếu yêu cầu mua cho linh kiện thiếu và lệnh sản xuất cho dây chuyền lắp ráp.</div>`,
  ]]);

const c5q = quiz('ism302-quiz-5', 'Quiz 5 — Production Planning|||Quiz 5 — Sản xuất', [
  { id: 'q1', question: 'Bill of Materials (BOM) là gì?|||Bill of Materials (BOM) là gì?', options: ['Hoá đơn bán hàng', 'Danh sách linh kiện và số lượng để làm ra một thành phẩm', 'Bảng lương', 'Danh sách khách hàng'], correctIndex: 1, explanation: 'BOM là "công thức" — các linh kiện và số lượng cần cho một sản phẩm.' },
  { id: 'q2', question: 'MRP tính nhu cầu ròng bằng cách nào?|||MRP tính nhu cầu ròng bằng cách nào?', options: ['Nhu cầu × BOM rồi trừ tồn kho và đơn mua đang mở', 'Cộng tất cả tồn kho lại', 'Lấy doanh thu chia chi phí', 'Chỉ đếm số nhân viên'], correctIndex: 0, explanation: 'MRP: nhu cầu × BOM − tồn − đơn mua mở = nhu cầu ròng → đơn kế hoạch.' },
  { id: 'q3', question: 'Với hàng cần MUA, MRP sinh ra gì?|||Với hàng cần MUA, MRP sinh ra gì?', options: ['Lệnh sản xuất', 'Phiếu yêu cầu mua chuyển cho Mua hàng', 'Hoá đơn bán', 'Bảng cân đối kế toán'], correctIndex: 1, explanation: 'Hàng tự làm → lệnh sản xuất; hàng đi mua → phiếu yêu cầu mua cho Procurement.' },
]);

const c6 = doc('ism302-6-1-sales', '6.1 — Sales & Distribution (SD)|||6.1 — Bán hàng & Phân phối (SD)',
  'Module Sales & Distribution: chu trình order-to-cash, kiểm tồn khả dụng, giao hàng, xuất hoá đơn; CRM tích hợp; ví dụ bán lẻ.',
  [[
    `<span class="eyebrow">ISM302 · Chapter 6 · Lesson 6.1</span>
<h2>Sales &amp; Distribution</h2>
<p><strong>SD (Sales &amp; Distribution)</strong> runs the <strong>Order-to-Cash</strong> cycle — the flow that actually brings money in.</p>
<h3>Order-to-Cash, step by step</h3>
<pre><code>1. Sales Order        -> capture customer, items, price
2. Availability check -> is stock free to promise? (links to Inventory)
3. Delivery / picking -> goods leave the warehouse (stock DOWN)
4. Billing / Invoice  -> customer invoice created (posts to AR in Finance)
5. Payment            -> cash received, receivable cleared
</code></pre>
<h3>Pricing &amp; availability</h3>
<p>SD applies pricing rules (list price, customer discounts, taxes) automatically, and the <strong>availability check</strong> reserves stock so you never promise goods you cannot ship. Because it reads the same inventory the warehouse updates, the promise is real, not a guess.</p>
<h3>CRM integration</h3>
<p>Modern ERP links SD to <strong>CRM (Customer Relationship Management)</strong> so the sales team sees a customer's full history — quotes, orders, deliveries, open invoices — in one place. Salesforce or SAP CRM can feed opportunities straight into ERP as orders.</p>
<div class="callout"><span class="badge">Real example</span> A Thế Giới Di Động order for 50 phones: SD checks stock, reserves it, ships, and invoices — and Finance sees the receivable and Inventory sees the drop the moment the delivery posts.</div>`,
    `<span class="eyebrow">ISM302 · Chương 6 · Bài 6.1</span>
<h2>Bán hàng &amp; Phân phối</h2>
<p><strong>SD (Bán hàng &amp; Phân phối)</strong> chạy chu trình <strong>Order-to-Cash</strong> — dòng chảy thực sự mang tiền về.</p>
<h3>Order-to-Cash, từng bước</h3>
<pre><code>1. Đơn bán hàng       -> ghi khách, mặt hàng, giá
2. Kiểm tồn khả dụng  -> còn hàng để hứa giao không? (nối Kho)
3. Giao hàng / soạn   -> hàng rời kho (tồn GIẢM)
4. Xuất hoá đơn       -> tạo hoá đơn khách (ghi vào phải thu ở Tài chính)
5. Thanh toán         -> nhận tiền, tất toán phải thu
</code></pre>
<h3>Định giá &amp; khả dụng</h3>
<p>SD áp quy tắc giá (bảng giá, chiết khấu khách, thuế) tự động, và <strong>kiểm tồn khả dụng</strong> giữ hàng để bạn không bao giờ hứa món không thể giao. Vì nó đọc chính kho mà bộ phận kho cập nhật, lời hứa là thật, không phải phỏng đoán.</p>
<h3>Tích hợp CRM</h3>
<p>ERP hiện đại nối SD với <strong>CRM (Quản lý quan hệ khách hàng)</strong> để đội bán hàng thấy toàn bộ lịch sử khách — báo giá, đơn, giao hàng, hoá đơn còn nợ — trong một chỗ. Salesforce hay SAP CRM có thể đẩy cơ hội thẳng vào ERP thành đơn hàng.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một đơn 50 điện thoại của Thế Giới Di Động: SD kiểm tồn, giữ hàng, giao và xuất hoá đơn — và Tài chính thấy khoản phải thu, Kho thấy tồn giảm ngay khi phiếu giao được ghi.</div>`,
  ]]);

const c6q = quiz('ism302-quiz-6', 'Quiz 6 — Sales & Distribution|||Quiz 6 — Bán hàng & Phân phối', [
  { id: 'q1', question: 'Trong Order-to-Cash, bước "kiểm tồn khả dụng" dùng để?|||Trong Order-to-Cash, bước "kiểm tồn khả dụng" dùng để?', options: ['Tính lương', 'Đảm bảo có đủ hàng trước khi hứa giao, và giữ hàng', 'Xoá đơn mua', 'In bảng cân đối'], correctIndex: 1, explanation: 'Availability check đọc tồn kho thật để không hứa món không thể giao.' },
  { id: 'q2', question: 'Khi xuất hoá đơn bán hàng, module nào bị tác động?|||Khi xuất hoá đơn bán hàng, module nào bị tác động?', options: ['Không module nào', 'Tài chính — tạo khoản phải thu (AR)', 'Chỉ Nhân sự', 'Chỉ Sản xuất'], correctIndex: 1, explanation: 'Hoá đơn khách ghi vào phải thu (AR) trong module Tài chính.' },
  { id: 'q3', question: 'CRM tích hợp trong ERP giúp đội bán hàng?|||CRM tích hợp trong ERP giúp đội bán hàng?', options: ['Thấy toàn bộ lịch sử khách: báo giá, đơn, giao, hoá đơn', 'Chỉ in giấy', 'Không có tác dụng gì', 'Thay thế module Tài chính'], correctIndex: 0, explanation: 'CRM cho cái nhìn 360 độ về khách hàng và đẩy cơ hội thành đơn trong ERP.' },
]);

const c7 = doc('ism302-7-1-implementation', '7.1 — Implementing ERP|||7.1 — Triển khai ERP',
  'Lựa chọn hệ thống, phương pháp triển khai (big bang/phased), di trú dữ liệu, quản lý thay đổi, rủi ro và nguyên nhân thất bại.',
  [[
    `<span class="eyebrow">ISM302 · Chapter 7 · Lesson 7.1</span>
<h2>Implementing ERP</h2>
<p>Buying ERP is easy; making it work is the hard part. Most ERP failures are about <strong>people and process</strong>, not the software.</p>
<h3>1. Selection</h3>
<p>Match the system to the business — fit, cost, vendor stability, and whether to change the software to fit you (customize) or change yourself to fit the software (adopt best practice). Over-customizing is a classic, expensive mistake.</p>
<h3>2. Implementation strategy</h3>
<ul>
<li><strong>Big bang:</strong> everyone switches at once — fast but risky.</li>
<li><strong>Phased:</strong> roll out module by module or site by site — safer, slower.</li>
</ul>
<h3>3. Data migration</h3>
<p>Old data must be cleaned and moved into the new system: <strong>Extract → Transform → Load</strong>. "Garbage in, garbage out" — dirty legacy data is a top cause of go-live pain.</p>
<h3>4. Change management</h3>
<p>Training, communication and executive sponsorship. If staff resist or are not trained, even perfect software fails.</p>
<h3>5. Key risks</h3>
<pre><code>- Scope creep &amp; over-customization  -> cost and time blow out
- Poor data quality                 -> wrong results on day one
- Weak training / resistance        -> people bypass the system
- No executive sponsor              -> project stalls
</code></pre>
<div class="callout"><span class="badge">Cautionary tale</span> Hershey's 1999 ERP go-live during peak season mixed a big-bang cutover with data and process problems and disrupted USD 100M+ of orders — a textbook lesson in implementation risk.</div>`,
    `<span class="eyebrow">ISM302 · Chương 7 · Bài 7.1</span>
<h2>Triển khai ERP</h2>
<p>Mua ERP thì dễ; làm cho nó chạy mới khó. Phần lớn thất bại ERP là do <strong>con người và quy trình</strong>, không phải phần mềm.</p>
<h3>1. Lựa chọn</h3>
<p>Khớp hệ thống với doanh nghiệp — độ phù hợp, chi phí, độ ổn định nhà cung cấp, và chọn sửa phần mềm cho vừa mình (tuỳ biến) hay sửa mình cho vừa phần mềm (theo thực hành tốt). Tuỳ biến quá tay là sai lầm kinh điển và tốn kém.</p>
<h3>2. Chiến lược triển khai</h3>
<ul>
<li><strong>Big bang:</strong> mọi người chuyển cùng lúc — nhanh nhưng rủi ro.</li>
<li><strong>Từng phần (phased):</strong> triển khai theo module hoặc theo chi nhánh — an toàn hơn, chậm hơn.</li>
</ul>
<h3>3. Di trú dữ liệu</h3>
<p>Dữ liệu cũ phải được làm sạch và chuyển sang hệ mới: <strong>Trích xuất → Biến đổi → Nạp (ETL)</strong>. "Rác vào thì rác ra" — dữ liệu cũ bẩn là nguyên nhân hàng đầu gây đau lúc go-live.</p>
<h3>4. Quản lý thay đổi</h3>
<p>Đào tạo, truyền thông và sự bảo trợ của lãnh đạo. Nếu nhân viên phản kháng hoặc không được đào tạo, phần mềm dù hoàn hảo vẫn thất bại.</p>
<h3>5. Rủi ro chính</h3>
<pre><code>- Phình phạm vi &amp; tuỳ biến quá mức -> vỡ chi phí và thời gian
- Dữ liệu kém chất lượng            -> sai kết quả ngay ngày đầu
- Đào tạo yếu / phản kháng          -> người dùng né hệ thống
- Không có lãnh đạo bảo trợ         -> dự án đình trệ
</code></pre>
<div class="callout"><span class="badge">Bài học cảnh tỉnh</span> Vụ go-live ERP của Hershey năm 1999 đúng mùa cao điểm, trộn kiểu big-bang với lỗi dữ liệu và quy trình, làm gián đoạn hơn 100 triệu USD đơn hàng — bài học sách giáo khoa về rủi ro triển khai.</div>`,
  ]]);

const c7q = quiz('ism302-quiz-7', 'Quiz 7 — Implementing ERP|||Quiz 7 — Triển khai ERP', [
  { id: 'q1', question: 'Nguyên nhân thất bại ERP thường gặp NHẤT là gì?|||Nguyên nhân thất bại ERP thường gặp NHẤT là gì?', options: ['Phần mềm quá tốt', 'Con người, quy trình, dữ liệu bẩn và thiếu đào tạo', 'Máy chủ quá nhanh', 'Có quá nhiều báo cáo'], correctIndex: 1, explanation: 'Phần lớn thất bại đến từ con người/quy trình/dữ liệu, không phải bản thân phần mềm.' },
  { id: 'q2', question: 'Chiến lược "big bang" nghĩa là?|||Chiến lược "big bang" nghĩa là?', options: ['Triển khai từng module một cách chậm rãi', 'Chuyển toàn bộ sang hệ mới cùng một lúc — nhanh nhưng rủi ro', 'Không bao giờ chuyển', 'Chỉ triển khai kế toán'], correctIndex: 1, explanation: 'Big bang = chuyển đồng loạt; phased = từng phần, an toàn hơn nhưng chậm hơn.' },
  { id: 'q3', question: '"Garbage in, garbage out" trong di trú dữ liệu ám chỉ điều gì?|||"Garbage in, garbage out" trong di trú dữ liệu ám chỉ điều gì?', options: ['Nên xoá hết dữ liệu', 'Dữ liệu cũ bẩn sẽ cho kết quả sai trong hệ mới, phải làm sạch trước', 'ERP không cần dữ liệu', 'Chỉ cần backup là đủ'], correctIndex: 1, explanation: 'Dữ liệu phải được làm sạch khi ETL; dữ liệu bẩn nhập vào cho kết quả bẩn.' },
]);

const c8 = doc('ism302-8-1-modern-erp', '8.1 — Modern ERP & trends|||8.1 — ERP hiện đại & xu hướng',
  'Cloud ERP (SaaS), SAP S/4HANA, Oracle Fusion, Odoo, AI trong ERP, và lựa chọn ERP cho doanh nghiệp vừa và nhỏ (SME) ở Việt Nam.',
  [[
    `<span class="eyebrow">ISM302 · Chapter 8 · Lesson 8.1</span>
<h2>Modern ERP &amp; trends</h2>
<h3>From on-premise to cloud</h3>
<p>Classic ERP ran on servers a company owned and maintained. <strong>Cloud ERP (SaaS)</strong> — <strong>SAP S/4HANA Cloud</strong>, <strong>Oracle Fusion</strong>, <strong>NetSuite</strong>, <strong>Odoo</strong> — is rented over the internet: lower upfront cost, automatic updates, access anywhere. This is why ERP is now realistic for small firms, not just giants.</p>
<h3>The big platforms</h3>
<ul>
<li><strong>SAP S/4HANA:</strong> the market leader, built on an in-memory database for real-time analytics.</li>
<li><strong>Oracle / NetSuite:</strong> strong cloud suites for mid-to-large firms.</li>
<li><strong>Odoo:</strong> open-source, modular and affordable — very popular with SMEs.</li>
</ul>
<h3>AI in ERP</h3>
<ul>
<li><strong>Demand forecasting</strong> — smarter MRP that predicts sales.</li>
<li><strong>Anomaly detection</strong> — flag suspicious invoices or expenses.</li>
<li><strong>Chatbots &amp; automation</strong> — natural-language queries and auto-processing of routine documents.</li>
</ul>
<h3>ERP for Vietnamese SMEs</h3>
<p>A small Vietnamese business rarely needs SAP. Affordable, localized options — <strong>Odoo</strong>, <strong>MISA AMIS</strong>, <strong>Base.vn</strong>, <strong>Fast</strong> — cover accounting (with e-invoice and tax rules), sales and inventory at a fraction of the cost, and can start with one module and grow.</p>
<div class="callout"><span class="badge">Takeaway</span> The ERP idea is unchanged — one integrated system, one truth. What changed is delivery (cloud), intelligence (AI) and reach: today even a startup can run a real ERP.</div>`,
    `<span class="eyebrow">ISM302 · Chương 8 · Bài 8.1</span>
<h2>ERP hiện đại &amp; xu hướng</h2>
<h3>Từ máy chủ tại chỗ đến đám mây</h3>
<p>ERP cổ điển chạy trên máy chủ do doanh nghiệp tự sở hữu và bảo trì. <strong>ERP đám mây (SaaS)</strong> — <strong>SAP S/4HANA Cloud</strong>, <strong>Oracle Fusion</strong>, <strong>NetSuite</strong>, <strong>Odoo</strong> — được thuê qua internet: chi phí ban đầu thấp, tự cập nhật, truy cập mọi nơi. Nhờ đó ERP giờ khả thi cho cả doanh nghiệp nhỏ, không chỉ tập đoàn.</p>
<h3>Các nền tảng lớn</h3>
<ul>
<li><strong>SAP S/4HANA:</strong> dẫn đầu thị trường, xây trên CSDL in-memory cho phân tích thời gian thực.</li>
<li><strong>Oracle / NetSuite:</strong> bộ đám mây mạnh cho doanh nghiệp vừa và lớn.</li>
<li><strong>Odoo:</strong> mã nguồn mở, module hoá và giá phải chăng — rất phổ biến với SME.</li>
</ul>
<h3>AI trong ERP</h3>
<ul>
<li><strong>Dự báo nhu cầu</strong> — MRP thông minh hơn, đoán trước doanh số.</li>
<li><strong>Phát hiện bất thường</strong> — gắn cờ hoá đơn hoặc chi phí đáng ngờ.</li>
<li><strong>Chatbot &amp; tự động hoá</strong> — hỏi bằng ngôn ngữ tự nhiên và tự xử lý chứng từ lặp đi lặp lại.</li>
</ul>
<h3>ERP cho SME Việt Nam</h3>
<p>Một doanh nghiệp nhỏ ở Việt Nam hiếm khi cần SAP. Các lựa chọn phải chăng, bản địa hoá — <strong>Odoo</strong>, <strong>MISA AMIS</strong>, <strong>Base.vn</strong>, <strong>Fast</strong> — lo được kế toán (kèm hoá đơn điện tử và quy tắc thuế), bán hàng và kho với chi phí thấp hơn nhiều, và có thể bắt đầu từ một module rồi lớn dần.</p>
<div class="callout"><span class="badge">Điểm cốt lõi</span> Ý tưởng ERP không đổi — một hệ tích hợp, một sự thật. Cái đổi là cách phân phối (đám mây), trí tuệ (AI) và tầm với: nay đến một startup cũng chạy được ERP thật.</div>`,
  ]]);

const c8q = quiz('ism302-quiz-8', 'Quiz 8 — Modern ERP|||Quiz 8 — ERP hiện đại', [
  { id: 'q1', question: 'Lợi thế chính của ERP đám mây (SaaS) so với tại chỗ là?|||Lợi thế chính của ERP đám mây (SaaS) so với tại chỗ là?', options: ['Chi phí ban đầu cao hơn', 'Chi phí ban đầu thấp, tự cập nhật, truy cập mọi nơi', 'Không thể truy cập từ xa', 'Phải tự bảo trì máy chủ'], correctIndex: 1, explanation: 'Cloud ERP thuê qua internet: rẻ ban đầu, tự cập nhật, dùng được mọi nơi.' },
  { id: 'q2', question: 'Đâu là ví dụ ERP phù hợp cho doanh nghiệp vừa và nhỏ Việt Nam?|||Đâu là ví dụ ERP phù hợp cho doanh nghiệp vừa và nhỏ Việt Nam?', options: ['Chỉ có SAP S/4HANA', 'Odoo, MISA AMIS, Base.vn, Fast', 'Không có lựa chọn nào', 'Chỉ dùng Excel'], correctIndex: 1, explanation: 'SME Việt thường dùng Odoo, MISA, Base.vn, Fast — rẻ, bản địa hoá, module hoá.' },
  { id: 'q3', question: 'AI được ứng dụng trong ERP để làm gì?|||AI được ứng dụng trong ERP để làm gì?', options: ['Thay thế toàn bộ kế toán viên ngay lập tức', 'Dự báo nhu cầu, phát hiện bất thường, chatbot và tự động hoá', 'Xoá dữ liệu cũ', 'Làm ERP chậm hơn'], correctIndex: 1, explanation: 'AI giúp dự báo nhu cầu, bắt bất thường chứng từ, và tự động hoá tác vụ lặp lại.' },
]);

const taiLieu = doc('ism302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Monk & Wagner, Magal & Word), tài liệu SAP/Odoo miễn phí, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ISM302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Enterprise Resource Planning — concepts, business processes, the Finance / Procurement / Production / Sales modules, and implementation — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ISM302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Concepts in Enterprise Resource Planning</em> — Monk &amp; Wagner (Cengage)</li>
<li><em>Essentials of Business Processes and Information Systems</em> — Magal &amp; Word (Wiley)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning (learning.sap.com)</a> — free courses on SAP S/4HANA</li>
<li><a href="https://www.odoo.com/documentation/latest/" target="_blank" rel="noopener">Odoo Documentation</a> — hands-on ERP you can try for free</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@SAP" target="_blank" rel="noopener">SAP</a> — official demos &amp; product explainers</li>
<li><a href="https://www.youtube.com/@OdooOfficial" target="_blank" rel="noopener">Odoo</a> — module tutorials &amp; walkthroughs</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.odoo.com/trial" target="_blank" rel="noopener">Odoo online trial</a> — spin up a real ERP in the browser</li>
<li><a href="https://www.misa.vn/" target="_blank" rel="noopener">MISA AMIS</a> — Vietnamese SME accounting &amp; ERP</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what ERP is, integration, business processes (P2P, O2C), one shared database.</li>
<li><strong>Modules</strong> — Finance (FI/CO), Procurement &amp; Inventory (MM), Production (PP/MRP/BOM), Sales (SD).</li>
<li><strong>Go deeper</strong> — implementation, data migration, change management and risk.</li>
<li><strong>Job-ready</strong> — try a real ERP: build a product in Odoo and run one order end to end.</li>
</ol></div>`,
    `<span class="eyebrow">ISM302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Hoạch định nguồn lực doanh nghiệp — khái niệm, quy trình kinh doanh, các module Tài chính / Mua hàng / Sản xuất / Bán hàng, và triển khai — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ISM302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Concepts in Enterprise Resource Planning</em> — Monk &amp; Wagner (Cengage)</li>
<li><em>Essentials of Business Processes and Information Systems</em> — Magal &amp; Word (Wiley)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning (learning.sap.com)</a> — khoá miễn phí về SAP S/4HANA</li>
<li><a href="https://www.odoo.com/documentation/latest/" target="_blank" rel="noopener">Tài liệu Odoo</a> — ERP thực hành, dùng thử miễn phí</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@SAP" target="_blank" rel="noopener">SAP</a> — demo chính thức &amp; giải thích sản phẩm</li>
<li><a href="https://www.youtube.com/@OdooOfficial" target="_blank" rel="noopener">Odoo</a> — hướng dẫn từng module</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.odoo.com/trial" target="_blank" rel="noopener">Odoo dùng thử trực tuyến</a> — dựng một ERP thật ngay trên trình duyệt</li>
<li><a href="https://www.misa.vn/" target="_blank" rel="noopener">MISA AMIS</a> — kế toán &amp; ERP cho SME Việt Nam</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — ERP là gì, tích hợp, quy trình kinh doanh (P2P, O2C), một CSDL chung.</li>
<li><strong>Các module</strong> — Tài chính (FI/CO), Mua hàng &amp; Kho (MM), Sản xuất (PP/MRP/BOM), Bán hàng (SD).</li>
<li><strong>Đào sâu</strong> — triển khai, di trú dữ liệu, quản lý thay đổi và rủi ro.</li>
<li><strong>Sẵn sàng đi làm</strong> — thử ERP thật: dựng một sản phẩm trong Odoo và chạy một đơn hàng đầu-cuối.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ISM302',
    slug: 'ism302-enterprise-resource-planning',
    title: 'Enterprise Resource Planning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ISM302.webp',
    shortDescription: 'What ERP is and why firms run every function on one integrated system — processes, Finance, Procurement, Production, Sales, implementation & modern cloud ERP (SAP, Odoo, AI). Bilingual, real examples & quizzes.|||ERP là gì và vì sao doanh nghiệp chạy mọi chức năng trên một hệ tích hợp — quy trình, Tài chính, Mua hàng, Sản xuất, Bán hàng, triển khai & ERP đám mây (SAP, Odoo, AI). Song ngữ, ví dụ thật & quiz.',
    description: 'Môn <strong>ISM302 — Enterprise Resource Planning</strong> (kỳ 5, ngành Hệ thống thông tin) giúp hiểu <strong>doanh nghiệp vận hành trên một hệ thống tích hợp thế nào</strong>. Từ <strong>ERP là gì &amp; lịch sử</strong> (MRP → ERP) → <strong>quy trình kinh doanh &amp; tích hợp</strong> (P2P, O2C) → các module <strong>Tài chính (FI/CO), Mua hàng &amp; Kho (MM), Sản xuất (PP/MRP/BOM), Bán hàng &amp; Phân phối (SD)</strong> → <strong>triển khai ERP</strong> → <strong>ERP đám mây hiện đại</strong> (SAP S/4HANA, Odoo, AI). Bám sách chuẩn Monk &amp; Wagner, Magal &amp; Word; song ngữ, ví dụ phần mềm thật (SAP, Oracle, Odoo), quiz mỗi chương.',
    whatYouLearn: 'ERP là gì &amp; vì sao tích hợp; lịch sử MRP → MRP II → ERP; quy trình kinh doanh, silo vs tích hợp, P2P &amp; O2C; Tài chính (sổ cái, AR/AP, FI/CO, báo cáo); Mua hàng &amp; Kho (procurement, MM, đối chiếu ba bên, tồn kho); Sản xuất (PP, MRP, BOM, lệnh sản xuất); Bán hàng &amp; Phân phối (SD, order-to-cash, CRM); triển khai (lựa chọn, di trú dữ liệu, quản lý thay đổi, rủi ro); ERP đám mây, SAP S/4HANA, Odoo, AI, ERP cho SME Việt Nam.',
    requirements: 'Hiểu biết cơ bản về doanh nghiệp và hệ thống thông tin. Không cần lập trình. Nên đăng ký một tài khoản Odoo dùng thử để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu SAP/Odoo, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'ERP là gì, một hệ tích hợp, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — ERP là gì|||Chapter 1 — What is ERP', description: 'Khái niệm, MRP → ERP, vì sao tích hợp, lợi ích & thách thức.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình & tích hợp|||Chapter 2 — Processes & integration', description: 'Business process, silo vs tích hợp, P2P & O2C.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tài chính - Kế toán|||Chapter 3 — Finance & Accounting', description: 'FI/CO, sổ cái, phải thu/phải trả, báo cáo.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mua hàng & Kho|||Chapter 4 — Procurement & Inventory', description: 'Procurement, MM, đối chiếu ba bên, tồn kho, NCC.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Sản xuất|||Chapter 5 — Production', description: 'PP, MRP, BOM, lệnh & lịch sản xuất.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Bán hàng & Phân phối|||Chapter 6 — Sales & Distribution', description: 'SD, order-to-cash, kiểm tồn, CRM tích hợp.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Triển khai ERP|||Chapter 7 — Implementing ERP', description: 'Lựa chọn, triển khai, di trú dữ liệu, quản lý thay đổi, rủi ro.', lessons: [c7, c7q] },
    { title: 'Chương 8 — ERP hiện đại & xu hướng|||Chapter 8 — Modern ERP & trends', description: 'Cloud ERP, S/4HANA, Odoo, AI, ERP cho SME Việt Nam.', lessons: [c8, c8q] },
  ],
};
