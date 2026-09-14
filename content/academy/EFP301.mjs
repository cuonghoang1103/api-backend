/**
 * EFP301 — ERP for Procurement. Giáo trình tham khảo (trích dẫn, KHÔNG upload
 * PDF): SAP MM/Ariba docs (help.sap.com); "Purchasing and Supply Chain
 * Management" — Monczka/Handfield/Giunipero/Patterson; "Procurement and
 * Supply Chain Management" — Baily/Farrington/Jessop/Jones; Oracle
 * Procurement Cloud docs. 8 chương: ERP & module mua sắm → P2P → dữ liệu chủ
 * NCC/vật tư → PR/PO → sourcing/RFQ → nhận hàng/hoá đơn/3-way match → spend
 * analysis → e-procurement/AI. Song ngữ. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${/nháy đơn thừa; HTML dùng &amp; cho ký tự "&".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('efp301-0-1-overview', 'Course overview: ERP for Procurement|||Tổng quan: ERP cho Mua sắm',
  'ERP là gì, vì sao mua sắm (procurement) là một module lõi trong ERP; lộ trình môn: tổng quan ERP → P2P → dữ liệu chủ → PR/PO → sourcing → nhận hàng/hoá đơn → phân tích chi tiêu → e-procurement & AI.',
  [[
    `<span class="eyebrow">EFP301 · Lesson 0.1 · Overview</span>
<h2>ERP for Procurement</h2>
<p class="lead">This course looks at how an <strong>Enterprise Resource Planning (ERP)</strong> system runs the <strong>procurement</strong> function of a business — turning a need to buy something into an approved order, a delivery, and a paid invoice, all tracked in one integrated system. You will work with the concepts and screens behind SAP MM/Ariba and Oracle Procurement Cloud, the two ERP procurement suites most used in industry.</p>
<h3>Why procurement lives inside ERP</h3>
<ul>
<li>Procurement touches almost every other module: <strong>Finance</strong> (who gets paid, budget checks), <strong>Inventory/MM</strong> (what stock is received), <strong>Production</strong> (materials a factory needs), and <strong>Reporting</strong> (how much the company spends and with whom).</li>
<li>Running it inside ERP — instead of email and spreadsheets — gives one shared <strong>master data</strong> set (vendors, materials, prices) and a full <strong>audit trail</strong> from request to payment.</li>
</ul>
<h3>Roadmap</h3>
<p>ERP &amp; the procurement module → the <strong>Procure-to-Pay (P2P)</strong> process → vendor &amp; material master data → purchase requisitions &amp; orders (PR/PO) → sourcing &amp; RFQs → goods receipt, invoicing &amp; 3-way matching → spend analysis &amp; reporting → e-procurement, automation &amp; AI (SAP Ariba). Bilingual, with process examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">EFP301 · Bài 0.1 · Tổng quan</span>
<h2>ERP cho Mua sắm</h2>
<p class="lead">Môn này xem hệ thống <strong>ERP (Enterprise Resource Planning)</strong> vận hành chức năng <strong>mua sắm (procurement)</strong> của doanh nghiệp như thế nào — biến một nhu cầu mua thành một đơn hàng được duyệt, một lần nhận hàng, và một hoá đơn đã thanh toán, tất cả được theo dõi trong một hệ thống tích hợp. Bạn sẽ làm việc với các khái niệm và màn hình đứng sau SAP MM/Ariba và Oracle Procurement Cloud, hai bộ ERP mua sắm được dùng nhiều nhất trong thực tế.</p>
<h3>Vì sao mua sắm nằm trong ERP</h3>
<ul>
<li>Mua sắm chạm tới hầu hết các module khác: <strong>Tài chính</strong> (ai được trả tiền, kiểm tra ngân sách), <strong>Kho/MM</strong> (hàng nào được nhận), <strong>Sản xuất</strong> (vật tư nhà máy cần), và <strong>Báo cáo</strong> (công ty chi bao nhiêu và cho ai).</li>
<li>Chạy trong ERP — thay vì email và bảng tính — cho một tập <strong>dữ liệu chủ (master data)</strong> chung (nhà cung cấp, vật tư, giá) và một <strong>đường vết kiểm toán</strong> đầy đủ từ yêu cầu tới thanh toán.</li>
</ul>
<h3>Lộ trình</h3>
<p>ERP &amp; module mua sắm → quy trình <strong>Procure-to-Pay (P2P)</strong> → dữ liệu chủ nhà cung cấp &amp; vật tư → yêu cầu &amp; đơn mua hàng (PR/PO) → sourcing &amp; RFQ → nhận hàng, hoá đơn &amp; khớp 3 chiều → phân tích chi tiêu &amp; báo cáo → e-procurement, tự động hoá &amp; AI (SAP Ariba). Song ngữ, có ví dụ quy trình và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('efp301-1-1-erp-procurement-overview', '1.1 — ERP & the procurement module|||1.1 — ERP & module mua sắm',
  'ERP tích hợp các module quanh một cơ sở dữ liệu chung; module mua sắm (SAP MM, Oracle Procurement) nằm giữa Tài chính, Kho và Sản xuất; cơ cấu tổ chức mua sắm: company code, plant, purchasing organization, purchasing group.',
  [[
    `<span class="eyebrow">EFP301 · Chapter 1 · Lesson 1.1</span>
<h2>ERP &amp; the procurement module</h2>
<h3>What ERP does</h3>
<p>An <strong>ERP system</strong> integrates the core functions of a business — finance, inventory, procurement, sales, production, HR — around <strong>one shared database</strong>. When a warehouse clerk records a goods receipt, finance sees the accounting entry and inventory sees the updated stock immediately, with no manual re-entry. SAP (ECC/S4HANA), Oracle, and Microsoft Dynamics are the market-leading ERP suites.</p>
<h3>Where procurement sits</h3>
<ul>
<li><strong>SAP</strong> calls its procurement module <strong>MM (Materials Management)</strong> for operational buying, plus <strong>Ariba</strong> for strategic sourcing and supplier collaboration in the cloud.</li>
<li><strong>Oracle Procurement Cloud</strong> covers requisitioning, purchasing, sourcing and supplier management as one cloud suite.</li>
<li>Both integrate tightly with <strong>Finance (accounts payable)</strong> and <strong>Inventory</strong> — a purchase order is worthless to the business unless it eventually becomes a receipt and a paid invoice.</li>
</ul>
<h3>Organizational structure</h3>
<p>ERP procurement is configured around a small set of organizational objects that every transaction inherits:</p>
<pre><code>Company code   -> the legal entity that books the accounting
Plant          -> the physical location that needs / receives material
Purchasing org -> the organizational unit that negotiates and buys
Purchasing grp -> the individual buyer or team responsible day to day
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Every purchase requisition and purchase order carries this structure, so spend can always be traced to a legal entity, a location, and a responsible buyer — the foundation for later reporting and control.</div>`,
    `<span class="eyebrow">EFP301 · Chương 1 · Bài 1.1</span>
<h2>ERP &amp; module mua sắm</h2>
<h3>ERP làm gì</h3>
<p>Một <strong>hệ thống ERP</strong> tích hợp các chức năng lõi của doanh nghiệp — tài chính, kho, mua sắm, bán hàng, sản xuất, nhân sự — quanh <strong>một cơ sở dữ liệu chung</strong>. Khi nhân viên kho ghi nhận một lần nhận hàng, tài chính thấy bút toán kế toán và kho thấy tồn kho cập nhật ngay lập tức, không cần nhập lại tay. SAP (ECC/S4HANA), Oracle và Microsoft Dynamics là các bộ ERP dẫn đầu thị trường.</p>
<h3>Mua sắm nằm ở đâu</h3>
<ul>
<li><strong>SAP</strong> gọi module mua sắm của mình là <strong>MM (Materials Management)</strong> cho mua hàng vận hành, cùng <strong>Ariba</strong> cho sourcing chiến lược và hợp tác nhà cung cấp trên cloud.</li>
<li><strong>Oracle Procurement Cloud</strong> gồm lập yêu cầu mua, mua hàng, sourcing và quản lý nhà cung cấp trong một bộ cloud.</li>
<li>Cả hai tích hợp chặt với <strong>Tài chính (công nợ phải trả)</strong> và <strong>Kho</strong> — một đơn mua hàng vô nghĩa với doanh nghiệp nếu không cuối cùng trở thành một lần nhận hàng và một hoá đơn đã thanh toán.</li>
</ul>
<h3>Cơ cấu tổ chức</h3>
<p>Mua sắm trong ERP được cấu hình quanh một số ít đối tượng tổ chức mà mọi giao dịch đều kế thừa:</p>
<pre><code>Company code (mã cty) -> pháp nhân ghi nhận kế toán
Plant (nhà máy/cứ điểm)-> nơi vật lý cần / nhận vật tư
Purchasing org (tổ mua)-> đơn vị tổ chức đàm phán và mua
Purchasing group (nhóm mua) -> người mua/nhóm chịu trách nhiệm hàng ngày
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mọi yêu cầu mua và đơn mua hàng đều mang cơ cấu này, nên chi tiêu luôn truy được về một pháp nhân, một địa điểm, và một người mua chịu trách nhiệm — nền cho việc báo cáo và kiểm soát sau này.</div>`,
  ]]);

const c1q = quiz('efp301-quiz-1', 'Quiz 1 — ERP & procurement module|||Quiz 1 — ERP & module mua sắm', [
  { id: 'q1', question: 'Module mua sắm vận hành (operational buying) trong SAP có tên gọi là?', options: ['SD', 'MM (Materials Management)', 'FI', 'HCM'], correctIndex: 1, explanation: 'SAP gọi module mua sắm là MM; Ariba phụ trách phần sourcing chiến lược trên cloud.' },
  { id: 'q2', question: 'Đối tượng tổ chức nào đại diện cho pháp nhân ghi nhận kế toán trong ERP mua sắm?', options: ['Plant', 'Purchasing group', 'Company code', 'Purchasing organization'], correctIndex: 2, explanation: 'Company code là pháp nhân; Plant là nơi cần/nhận vật tư, Purchasing org/group là tổ và người mua.' },
  { id: 'q3', question: 'Lợi ích chính khi chạy mua sắm TRONG ERP thay vì email/bảng tính là?', options: ['Không cần người mua nữa', 'Một tập dữ liệu chủ chung & đường vết kiểm toán đầy đủ', 'Giá hàng tự động giảm', 'Không cần nhà cung cấp ký hợp đồng'], correctIndex: 1, explanation: 'ERP cho một cơ sở dữ liệu chung (vendor, material, giá) và audit trail từ yêu cầu tới thanh toán.' },
]);

const c2 = doc('efp301-2-1-p2p-process', '2.1 — The Procure-to-Pay (P2P) process|||2.1 — Quy trình Procure-to-Pay (P2P)',
  'Chuỗi P2P: yêu cầu mua (PR) → đơn mua hàng (PO) → nhận hàng (GR) → hoá đơn (invoice) → thanh toán; vai trò requester/buyer/approver/AP; lợi ích tự động hoá P2P (giảm chu kỳ, kiểm soát maverick spend).',
  [[
    `<span class="eyebrow">EFP301 · Chapter 2 · Lesson 2.1</span>
<h2>The Procure-to-Pay (P2P) process</h2>
<h3>The five steps</h3>
<pre><code>1. Purchase Requisition (PR)  -> internal "please buy this" request
2. Purchase Order (PO)        -> approved, legal order sent to a vendor
3. Goods Receipt (GR)         -> confirms what physically arrived
4. Invoice Receipt            -> vendor's bill is recorded
5. Payment                    -> Accounts Payable pays the vendor
</code></pre>
<p><strong>P2P (Procure-to-Pay)</strong> is the end-to-end chain that turns a business need into cash paid out. Every step above is a separate ERP document, linked by reference numbers, so a buyer or auditor can trace one invoice all the way back to the original requisition.</p>
<h3>Who does what</h3>
<ul>
<li><strong>Requester</strong> — the employee who needs the item or service, raises the PR.</li>
<li><strong>Buyer</strong> — converts an approved PR into a PO, picking a vendor and price.</li>
<li><strong>Approver</strong> — signs off PRs/POs above a threshold (a <strong>release strategy</strong> in SAP terms).</li>
<li><strong>Accounts Payable (AP)</strong> — matches the invoice to the PO/GR and releases payment.</li>
</ul>
<div class="callout"><span class="badge">Why automate P2P</span> A manual P2P process is slow and leaks control — employees buy directly from a favourite vendor outside any contract (<strong>maverick spend</strong>). Automating P2P inside ERP shortens the cycle time and forces every purchase through an approved requisition and vendor.</div>`,
    `<span class="eyebrow">EFP301 · Chương 2 · Bài 2.1</span>
<h2>Quy trình Procure-to-Pay (P2P)</h2>
<h3>Năm bước</h3>
<pre><code>1. Yêu cầu mua (PR)   -> yêu cầu nội bộ "hãy mua thứ này"
2. Đơn mua hàng (PO)  -> đơn đã duyệt, có tính pháp lý, gửi nhà cung cấp
3. Nhận hàng (GR)     -> xác nhận thứ thực tế đã đến
4. Nhận hoá đơn       -> ghi nhận hoá đơn của nhà cung cấp
5. Thanh toán         -> Công nợ phải trả (AP) trả tiền nhà cung cấp
</code></pre>
<p><strong>P2P (Procure-to-Pay)</strong> là chuỗi từ đầu đến cuối biến một nhu cầu kinh doanh thành tiền chi ra. Mỗi bước trên là một chứng từ ERP riêng, liên kết bằng số tham chiếu, nên người mua hoặc kiểm toán có thể lần từ một hoá đơn ngược về đúng yêu cầu mua ban đầu.</p>
<h3>Ai làm gì</h3>
<ul>
<li><strong>Người yêu cầu (requester)</strong> — nhân viên cần món hàng/dịch vụ, tạo PR.</li>
<li><strong>Người mua (buyer)</strong> — chuyển PR đã duyệt thành PO, chọn nhà cung cấp và giá.</li>
<li><strong>Người duyệt (approver)</strong> — ký duyệt PR/PO vượt một ngưỡng (gọi là <strong>release strategy</strong> trong SAP).</li>
<li><strong>Công nợ phải trả (AP)</strong> — khớp hoá đơn với PO/GR và cho phép thanh toán.</li>
</ul>
<div class="callout"><span class="badge">Vì sao cần tự động hoá P2P</span> Một quy trình P2P làm tay chậm và rò rỉ kiểm soát — nhân viên mua trực tiếp từ nhà cung cấp quen ngoài hợp đồng (<strong>maverick spend</strong>). Tự động hoá P2P trong ERP rút ngắn chu kỳ và buộc mọi lần mua đi qua một yêu cầu và nhà cung cấp đã duyệt.</div>`,
  ]]);

const c2q = quiz('efp301-quiz-2', 'Quiz 2 — Procure-to-Pay|||Quiz 2 — Procure-to-Pay', [
  { id: 'q1', question: 'Thứ tự đúng của chuỗi P2P là?', options: ['PO → PR → GR → Invoice → Payment', 'PR → PO → GR → Invoice → Payment', 'GR → PR → PO → Payment → Invoice', 'Invoice → PO → PR → GR → Payment'], correctIndex: 1, explanation: 'PR (yêu cầu) trước, rồi PO (đơn), rồi GR (nhận hàng), rồi hoá đơn, rồi thanh toán.' },
  { id: 'q2', question: 'Người chuyển một PR đã duyệt thành PO, chọn nhà cung cấp và giá, gọi là?', options: ['Requester', 'Approver', 'Buyer', 'Accounts Payable'], correctIndex: 2, explanation: 'Buyer (người mua) chịu trách nhiệm chuyển PR thành PO với nhà cung cấp cụ thể.' },
  { id: 'q3', question: '"Maverick spend" nghĩa là gì?', options: ['Chi tiêu được duyệt đúng quy trình', 'Mua ngoài hợp đồng/nhà cung cấp đã duyệt', 'Chi phí vận chuyển', 'Khoản chiết khấu thanh toán sớm'], correctIndex: 1, explanation: 'Maverick spend là mua hàng lách quy trình mua sắm chính thức, ngoài hợp đồng/nhà cung cấp đã duyệt.' },
]);

const c3 = doc('efp301-3-1-vendor-material-master', '3.1 — Vendor & material master data|||3.1 — Dữ liệu chủ nhà cung cấp & vật tư',
  'Vendor master (dữ liệu chung, dữ liệu kế toán, dữ liệu mua hàng); material master (basic data, purchasing, MRP, accounting views); chất lượng dữ liệu chủ quyết định chất lượng cả quy trình P2P; tiêu chí đánh giá nhà cung cấp.',
  [[
    `<span class="eyebrow">EFP301 · Chapter 3 · Lesson 3.1</span>
<h2>Vendor &amp; material master data</h2>
<h3>Master data vs. transaction data</h3>
<p>Every PR, PO or invoice (<strong>transaction data</strong>) refers back to a smaller set of records that rarely change: the <strong>vendor master</strong> and the <strong>material master</strong> (<strong>master data</strong>). Get the master data wrong, and every downstream transaction inherits the error — the classic "garbage in, garbage out" problem.</p>
<h3>Vendor master</h3>
<ul>
<li><strong>General data</strong> — name, address, tax/registration numbers, bank details.</li>
<li><strong>Accounting data</strong> — reconciliation account, payment terms, per company code.</li>
<li><strong>Purchasing data</strong> — order currency, incoterms, per purchasing organization.</li>
</ul>
<h3>Material master</h3>
<pre><code>Basic data view  -> description, unit of measure, weight
Purchasing view  -> default vendor, order unit, purchasing texts
MRP view         -> reorder point, lot size, lead time
Accounting view  -> valuation price, valuation class (GL account)
</code></pre>
<h3>Evaluating vendors</h3>
<p>Beyond static master data, ERP tracks a vendor's actual performance: <strong>on-time delivery %</strong>, <strong>quality/reject rate</strong>, and <strong>price competitiveness</strong> — the criteria a <strong>vendor evaluation</strong> score is built from, feeding back into future sourcing decisions.</p>
<div class="callout"><span class="badge">Data owner discipline</span> Most ERP implementations restrict who can create/change a vendor or material master record — a control against fraud (e.g. a fake vendor bank account) as much as it is a data-quality control.</div>`,
    `<span class="eyebrow">EFP301 · Chương 3 · Bài 3.1</span>
<h2>Dữ liệu chủ nhà cung cấp &amp; vật tư</h2>
<h3>Dữ liệu chủ vs. dữ liệu giao dịch</h3>
<p>Mọi PR, PO hay hoá đơn (<strong>dữ liệu giao dịch</strong>) đều tham chiếu về một tập nhỏ hơn các bản ghi ít thay đổi: <strong>vendor master (chủ nhà cung cấp)</strong> và <strong>material master (chủ vật tư)</strong> (<strong>dữ liệu chủ</strong>). Sai dữ liệu chủ, mọi giao dịch phía sau kế thừa luôn cái sai — vấn đề kinh điển "garbage in, garbage out".</p>
<h3>Vendor master</h3>
<ul>
<li><strong>Dữ liệu chung</strong> — tên, địa chỉ, mã số thuế/đăng ký, thông tin ngân hàng.</li>
<li><strong>Dữ liệu kế toán</strong> — tài khoản đối ứng, điều khoản thanh toán, theo từng company code.</li>
<li><strong>Dữ liệu mua hàng</strong> — tiền tệ đặt hàng, incoterms, theo từng purchasing organization.</li>
</ul>
<h3>Material master</h3>
<pre><code>Basic data (dữ liệu cơ bản) -> mô tả, đơn vị tính, khối lượng
Purchasing (mua hàng)       -> nhà cung cấp mặc định, đơn vị đặt hàng
MRP                        -> điểm đặt hàng lại, cỡ lô, thời gian giao
Accounting (kế toán)       -> giá định giá, nhóm định giá (tài khoản GL)
</code></pre>
<h3>Đánh giá nhà cung cấp</h3>
<p>Ngoài dữ liệu chủ tĩnh, ERP theo dõi hiệu suất thực tế của nhà cung cấp: <strong>% giao hàng đúng hạn</strong>, <strong>tỉ lệ lỗi/từ chối chất lượng</strong>, và <strong>sức cạnh tranh về giá</strong> — các tiêu chí dựng nên điểm <strong>đánh giá nhà cung cấp (vendor evaluation)</strong>, quay lại làm căn cứ cho quyết định sourcing sau này.</p>
<div class="callout"><span class="badge">Kỷ luật chủ dữ liệu</span> Hầu hết triển khai ERP giới hạn ai được tạo/sửa bản ghi chủ nhà cung cấp hoặc vật tư — vừa là kiểm soát chống gian lận (vd tài khoản ngân hàng nhà cung cấp giả) vừa là kiểm soát chất lượng dữ liệu.</div>`,
  ]]);

const c3q = quiz('efp301-quiz-3', 'Quiz 3 — Vendor & material master data|||Quiz 3 — Dữ liệu chủ NCC & vật tư', [
  { id: 'q1', question: 'Dữ liệu chủ (master data) khác dữ liệu giao dịch ở điểm nào?', options: ['Master data thay đổi mỗi giao dịch', 'Master data là tập bản ghi ít thay đổi, được các giao dịch tham chiếu tới', 'Master data chỉ do AP tạo', 'Master data không liên quan tới PO'], correctIndex: 1, explanation: 'Vendor/material master là dữ liệu nền ổn định; PR/PO/invoice (giao dịch) tham chiếu tới nó.' },
  { id: 'q2', question: 'Thông tin điểm đặt hàng lại (reorder point) và thời gian giao hàng nằm ở view nào của material master?', options: ['Basic data view', 'MRP view', 'Accounting view', 'Purchasing view'], correctIndex: 1, explanation: 'MRP view chứa reorder point, lot size, lead time — dữ liệu hoạch định nhu cầu vật tư.' },
  { id: 'q3', question: 'Vì sao nhiều doanh nghiệp giới hạn ai được tạo/sửa vendor master?', options: ['Vì không cần thiết', 'Để kiểm soát chất lượng dữ liệu và chống gian lận (vd tài khoản ngân hàng giả)', 'Vì chỉ có một nhà cung cấp', 'Vì vendor master không ảnh hưởng thanh toán'], correctIndex: 1, explanation: 'Vendor master chứa thông tin ngân hàng dùng để thanh toán, nên là điểm kiểm soát chống gian lận quan trọng.' },
]);

const c4 = doc('efp301-4-1-pr-po', '4.1 — Purchase requisitions & purchase orders|||4.1 — Yêu cầu mua & đơn đặt hàng (PR/PO)',
  'PR: chứng từ nội bộ, phát sinh từ MRP/thủ công/reorder point; PO: chứng từ pháp lý gửi nhà cung cấp, các loại PO (standard, blanket/contract, scheduling agreement); release strategy (luồng duyệt).',
  [[
    `<span class="eyebrow">EFP301 · Chapter 4 · Lesson 4.1</span>
<h2>Purchase requisitions &amp; purchase orders</h2>
<h3>Purchase Requisition (PR)</h3>
<p>A <strong>Purchase Requisition (PR)</strong> is an internal-only document — it never leaves the company. It can be created three ways: <strong>manually</strong> by an employee, <strong>automatically by MRP</strong> (material requirements planning, when stock falls short of production needs), or <strong>automatically at a reorder point</strong> (when inventory drops below a set level). A PR has no legal weight until a buyer turns it into a PO.</p>
<h3>Purchase Order (PO)</h3>
<p>A <strong>Purchase Order (PO)</strong> IS a legal document — sending it to a vendor forms a contract to buy at the stated price, quantity and delivery date. Common PO types:</p>
<pre><code>Standard PO          -> one-time buy, fixed quantity & price
Blanket/contract PO   -> a value/validity-period agreement, drawn down over time
Scheduling agreement -> long-term deal with scheduled delivery dates (e.g. JIT manufacturing)
</code></pre>
<h3>Approval: release strategy</h3>
<p>Above a configured value, a PR or PO cannot be sent/converted until it passes a <strong>release strategy</strong> — a chain of approvers determined by value, material group or cost center, enforced by the system rather than by trust.</p>
<div class="callout"><span class="badge">Field-level accuracy</span> A PO's header carries the vendor and terms; each PO <strong>item</strong> carries material, quantity, price and delivery date — a single PO can bundle many items for the same vendor.</div>`,
    `<span class="eyebrow">EFP301 · Chương 4 · Bài 4.1</span>
<h2>Yêu cầu mua &amp; đơn đặt hàng (PR/PO)</h2>
<h3>Yêu cầu mua (Purchase Requisition — PR)</h3>
<p>Một <strong>Purchase Requisition (PR)</strong> là chứng từ chỉ nội bộ — không bao giờ ra ngoài công ty. Có thể tạo bằng ba cách: <strong>thủ công</strong> bởi nhân viên, <strong>tự động bởi MRP</strong> (hoạch định nhu cầu vật tư, khi tồn kho không đủ cho nhu cầu sản xuất), hoặc <strong>tự động tại điểm đặt hàng lại (reorder point)</strong> (khi tồn kho tụt dưới một mức đặt trước). PR không có giá trị pháp lý cho tới khi người mua chuyển nó thành PO.</p>
<h3>Đơn đặt hàng (Purchase Order — PO)</h3>
<p>Một <strong>Purchase Order (PO)</strong> LÀ chứng từ pháp lý — gửi nó cho nhà cung cấp tạo thành hợp đồng mua theo giá, số lượng và ngày giao đã ghi. Các loại PO phổ biến:</p>
<pre><code>Standard PO (đơn thường)   -> mua một lần, số lượng & giá cố định
Blanket/contract PO (hợp đồng khung) -> thoả thuận giá trị/thời hạn, rút dần theo thời gian
Scheduling agreement (thoả thuận giao theo lịch) -> hợp đồng dài hạn, giao theo lịch định sẵn (vd sản xuất JIT)
</code></pre>
<h3>Duyệt: release strategy</h3>
<p>Vượt một giá trị được cấu hình, PR hoặc PO không thể gửi/chuyển đổi cho tới khi qua <strong>release strategy</strong> — một chuỗi người duyệt xác định theo giá trị, nhóm vật tư hoặc trung tâm chi phí, do hệ thống bắt buộc thay vì dựa vào lòng tin.</p>
<div class="callout"><span class="badge">Chính xác tới từng dòng</span> Header của PO mang nhà cung cấp và điều khoản; mỗi <strong>item</strong> của PO mang vật tư, số lượng, giá và ngày giao — một PO có thể gộp nhiều item cho cùng một nhà cung cấp.</div>`,
  ]]);

const c4q = quiz('efp301-quiz-4', 'Quiz 4 — PR & PO|||Quiz 4 — PR & PO', [
  { id: 'q1', question: 'Purchase Requisition (PR) khác Purchase Order (PO) ở điểm cốt lõi nào?', options: ['PR có giá trị pháp lý với nhà cung cấp, PO không', 'PR chỉ nội bộ, không có giá trị pháp lý; PO là hợp đồng gửi nhà cung cấp', 'PR và PO là một, chỉ khác tên', 'PO luôn tạo trước PR'], correctIndex: 1, explanation: 'PR là yêu cầu nội bộ; chỉ khi chuyển thành PO và gửi nhà cung cấp mới có ràng buộc pháp lý.' },
  { id: 'q2', question: 'Loại PO nào phù hợp một thoả thuận dài hạn với các ngày giao hàng định sẵn (vd sản xuất JIT)?', options: ['Standard PO', 'Scheduling agreement', 'PR thủ công', 'Reorder point'], correctIndex: 1, explanation: 'Scheduling agreement là hợp đồng dài hạn, giao hàng theo lịch định sẵn, khác Standard PO (mua một lần).' },
  { id: 'q3', question: '"Release strategy" trong ERP mua sắm dùng để làm gì?', options: ['Tự động gửi PO không cần duyệt', 'Bắt buộc một chuỗi người duyệt theo giá trị/nhóm vật tư trước khi PR/PO có hiệu lực', 'Xoá PR quá hạn', 'Tính giá vật tư'], correctIndex: 1, explanation: 'Release strategy là luồng duyệt do hệ thống ép buộc, dựa trên các điều kiện như giá trị hoặc nhóm vật tư.' },
]);

const c5 = doc('efp301-5-1-sourcing-rfq', '5.1 — Sourcing, vendor management & RFQs|||5.1 — Sourcing, quản lý nhà cung cấp & RFQ',
  'Quy trình sourcing: RFI/RFQ/RFP, so sánh chào giá; quản lý nhà cung cấp: thẩm định, scorecard, hợp đồng; SAP Ariba sourcing/đấu giá điện tử (e-auction).',
  [[
    `<span class="eyebrow">EFP301 · Chapter 5 · Lesson 5.1</span>
<h2>Sourcing, vendor management &amp; RFQs</h2>
<h3>RFI, RFQ, RFP — three different asks</h3>
<pre><code>RFI (Request for Information) -> "tell us what you can do" -> screening
RFQ (Request for Quotation)   -> "give us your price" for a defined spec
RFP (Request for Proposal)    -> "propose a solution" -> complex/service buys
</code></pre>
<p><strong>Sourcing</strong> is the strategic side of procurement: deciding WHO to buy from, before any PO exists. A buyer typically narrows a long vendor list with an <strong>RFI</strong>, then sends a formal <strong>RFQ</strong> to a short list, and compares the quotes on price, lead time and terms before awarding a contract.</p>
<h3>Vendor management</h3>
<p>Winning an RFQ is not the end — the ERP keeps tracking the vendor through <strong>qualification</strong> (can they legally and technically supply?), ongoing <strong>scorecards</strong> (delivery, quality, price — see Chapter 3), and the <strong>contract</strong> itself (validity dates, agreed prices, renewal terms).</p>
<h3>E-sourcing in SAP Ariba</h3>
<p><strong>SAP Ariba Sourcing</strong> runs this whole cycle online: vendors submit quotes through a portal instead of email/fax, and a buyer can run a live <strong>reverse e-auction</strong> — vendors compete by lowering their bid in real time — which is far harder to do manually.</p>
<div class="callout"><span class="badge">Sourcing vs. purchasing</span> Sourcing decides the vendor and the contract terms (strategic, infrequent); purchasing (Ch. 4) executes day-to-day POs against that already-negotiated deal (operational, frequent).</div>`,
    `<span class="eyebrow">EFP301 · Chương 5 · Bài 5.1</span>
<h2>Sourcing, quản lý nhà cung cấp &amp; RFQ</h2>
<h3>RFI, RFQ, RFP — ba câu hỏi khác nhau</h3>
<pre><code>RFI (Request for Information) -> "hãy cho biết bạn làm được gì" -> sàng lọc
RFQ (Request for Quotation)   -> "hãy chào giá" cho một đặc tả cụ thể
RFP (Request for Proposal)    -> "hãy đề xuất giải pháp" -> mua phức tạp/dịch vụ
</code></pre>
<p><strong>Sourcing</strong> là mặt chiến lược của mua sắm: quyết định mua từ AI, trước khi có bất kỳ PO nào. Người mua thường lọc một danh sách nhà cung cấp dài bằng <strong>RFI</strong>, rồi gửi <strong>RFQ</strong> chính thức cho danh sách rút gọn, và so sánh các chào giá về giá, thời gian giao và điều khoản trước khi trao hợp đồng.</p>
<h3>Quản lý nhà cung cấp</h3>
<p>Thắng một RFQ không phải là kết thúc — ERP tiếp tục theo dõi nhà cung cấp qua <strong>thẩm định (qualification)</strong> (có đủ điều kiện pháp lý và kỹ thuật để cung cấp không?), <strong>scorecard</strong> liên tục (giao hàng, chất lượng, giá — xem Chương 3), và <strong>hợp đồng</strong> chính nó (thời hạn hiệu lực, giá đã thoả thuận, điều khoản gia hạn).</p>
<h3>E-sourcing trong SAP Ariba</h3>
<p><strong>SAP Ariba Sourcing</strong> chạy toàn chu trình này trực tuyến: nhà cung cấp nộp chào giá qua một portal thay vì email/fax, và người mua có thể chạy một <strong>đấu giá ngược điện tử (reverse e-auction)</strong> trực tiếp — nhà cung cấp cạnh tranh bằng cách hạ giá chào theo thời gian thực — điều rất khó làm bằng tay.</p>
<div class="callout"><span class="badge">Sourcing khác purchasing</span> Sourcing quyết định nhà cung cấp và điều khoản hợp đồng (chiến lược, ít xảy ra); purchasing (Ch. 4) thực thi các PO hàng ngày theo thoả thuận đã đàm phán sẵn (vận hành, thường xuyên).</div>`,
  ]]);

const c5q = quiz('efp301-quiz-5', 'Quiz 5 — Sourcing & RFQ|||Quiz 5 — Sourcing & RFQ', [
  { id: 'q1', question: 'RFQ (Request for Quotation) dùng để làm gì?', options: ['Hỏi năng lực chung của nhà cung cấp', 'Yêu cầu chào giá cho một đặc tả cụ thể', 'Ghi nhận hàng đã nhận', 'Thanh toán hoá đơn'], correctIndex: 1, explanation: 'RFQ là yêu cầu chào giá chính thức cho một đặc tả đã xác định, khác RFI (sàng lọc năng lực) và RFP (đề xuất giải pháp).' },
  { id: 'q2', question: 'Đấu giá ngược điện tử (reverse e-auction) trong SAP Ariba hoạt động thế nào?', options: ['Người mua trả giá cao nhất thắng', 'Nhiều nhà cung cấp cạnh tranh hạ giá chào theo thời gian thực', 'Chỉ một nhà cung cấp được mời', 'Không có cạnh tranh giá'], correctIndex: 1, explanation: 'Reverse e-auction cho nhiều nhà cung cấp cạnh tranh hạ giá trực tiếp, khó thực hiện thủ công.' },
  { id: 'q3', question: 'Khác biệt chính giữa sourcing và purchasing (mua hàng vận hành) là gì?', options: ['Không có khác biệt', 'Sourcing chọn nhà cung cấp & đàm phán hợp đồng (chiến lược); purchasing thực thi PO hàng ngày theo hợp đồng đó', 'Purchasing luôn xảy ra trước sourcing', 'Sourcing chỉ dùng cho hàng tồn kho'], correctIndex: 1, explanation: 'Sourcing là bước chiến lược quyết định nhà cung cấp/điều khoản; purchasing là thực thi vận hành hàng ngày.' },
]);

const c6 = doc('efp301-6-1-goods-receipt-invoice-3way', '6.1 — Goods receipt, invoicing & 3-way matching|||6.1 — Nhận hàng, hoá đơn & khớp 3 chiều',
  'Quy trình nhận hàng (GR/MIGO) cập nhật tồn kho & kích hoạt kế toán; kiểm tra hoá đơn (MIRO); khớp 3 chiều PO-GR-Invoice; xử lý sai lệch/hoá đơn bị chặn.',
  [[
    `<span class="eyebrow">EFP301 · Chapter 6 · Lesson 6.1</span>
<h2>Goods receipt, invoicing &amp; 3-way matching</h2>
<h3>Goods receipt (GR)</h3>
<p>When a delivery arrives, the warehouse posts a <strong>Goods Receipt (GR)</strong> against the PO (SAP transaction <strong>MIGO</strong>). This does two things at once: it <strong>increases stock</strong> in the material master, and it posts an <strong>accounting entry</strong> (a stock/GR-IR clearing account movement) — inventory and finance stay in sync without a second data entry.</p>
<h3>Invoice receipt &amp; verification</h3>
<p>The vendor's bill is entered as an <strong>invoice receipt</strong> (SAP transaction <strong>MIRO</strong>). Before it is approved for payment, the system runs <strong>invoice verification</strong> — checking the invoice against what was actually ordered and received.</p>
<h3>The 3-way match</h3>
<pre><code>Purchase Order (PO)  -> what was AGREED (qty, price)
Goods Receipt (GR)   -> what actually ARRIVED (qty)
Invoice              -> what the vendor is BILLING (qty, price)
    match within tolerance on all three -> pay
    mismatch -> invoice is BLOCKED for payment
</code></pre>
<p>The <strong>3-way match</strong> is the single biggest control in the whole P2P chain: a business only pays for what it agreed to buy AND actually received. A price or quantity difference beyond a set tolerance <strong>blocks</strong> the invoice until someone investigates the discrepancy.</p>
<div class="callout"><span class="badge">Where fraud gets caught</span> Paying an invoice with no matching PO or GR — bypassing the 3-way match — is exactly the pattern internal audit looks for when investigating fictitious-vendor fraud.</div>`,
    `<span class="eyebrow">EFP301 · Chương 6 · Bài 6.1</span>
<h2>Nhận hàng, hoá đơn &amp; khớp 3 chiều</h2>
<h3>Nhận hàng (Goods Receipt — GR)</h3>
<p>Khi hàng đến, kho ghi nhận một <strong>Goods Receipt (GR)</strong> đối chiếu với PO (giao dịch SAP <strong>MIGO</strong>). Việc này làm hai điều cùng lúc: <strong>tăng tồn kho</strong> trong material master, và ghi <strong>bút toán kế toán</strong> (một bút toán vào tài khoản đối ứng GR-IR) — kho và tài chính luôn đồng bộ mà không cần nhập liệu lần hai.</p>
<h3>Nhận hoá đơn &amp; kiểm tra hoá đơn</h3>
<p>Hoá đơn của nhà cung cấp được nhập như một <strong>invoice receipt</strong> (giao dịch SAP <strong>MIRO</strong>). Trước khi được duyệt thanh toán, hệ thống chạy <strong>kiểm tra hoá đơn (invoice verification)</strong> — đối chiếu hoá đơn với thứ thực sự đã đặt và đã nhận.</p>
<h3>Khớp 3 chiều (3-way match)</h3>
<pre><code>Đơn mua hàng (PO)  -> điều đã THOẢ THUẬN (số lượng, giá)
Nhận hàng (GR)     -> điều thực tế đã ĐẾN (số lượng)
Hoá đơn (Invoice)  -> điều nhà cung cấp ĐANG THU (số lượng, giá)
    khớp trong sai số cho phép cả ba -> thanh toán
    lệch -> hoá đơn bị CHẶN thanh toán
</code></pre>
<p><strong>Khớp 3 chiều</strong> là kiểm soát lớn nhất trong toàn chuỗi P2P: doanh nghiệp chỉ trả tiền cho thứ đã đồng ý mua VÀ thực sự đã nhận. Chênh lệch giá hoặc số lượng vượt sai số cho phép sẽ <strong>chặn</strong> hoá đơn cho tới khi ai đó xử lý sai lệch.</p>
<div class="callout"><span class="badge">Nơi phát hiện gian lận</span> Thanh toán một hoá đơn không có PO hoặc GR khớp — bỏ qua khớp 3 chiều — chính là mẫu hình mà kiểm toán nội bộ tìm khi điều tra gian lận nhà cung cấp giả.</div>`,
  ]]);

const c6q = quiz('efp301-quiz-6', 'Quiz 6 — Goods receipt & 3-way match|||Quiz 6 — Nhận hàng & khớp 3 chiều', [
  { id: 'q1', question: 'Ghi nhận Goods Receipt (GR) làm gì cùng lúc?', options: ['Chỉ tăng tồn kho, không ảnh hưởng kế toán', 'Tăng tồn kho VÀ ghi một bút toán kế toán', 'Chỉ ảnh hưởng kế toán, không đổi tồn kho', 'Xoá PO liên quan'], correctIndex: 1, explanation: 'GR (MIGO) đồng thời cập nhật tồn kho và ghi bút toán kế toán, giữ kho/tài chính đồng bộ.' },
  { id: 'q2', question: 'Khớp 3 chiều (3-way match) đối chiếu ba tài liệu nào?', options: ['PR, RFQ, Contract', 'PO, Goods Receipt, Invoice', 'Vendor master, Material master, PO', 'PR, PO, Contract'], correctIndex: 1, explanation: '3-way match so PO (đã thoả thuận), GR (đã nhận) và Invoice (đang thu tiền).' },
  { id: 'q3', question: 'Khi PO, GR và hoá đơn lệch nhau vượt sai số cho phép, điều gì xảy ra?', options: ['Hoá đơn tự động được thanh toán', 'Hoá đơn bị chặn thanh toán cho tới khi xử lý sai lệch', 'PO tự động bị xoá', 'Vendor master bị khoá vĩnh viễn'], correctIndex: 1, explanation: 'Sai lệch vượt tolerance khiến hoá đơn bị block, cần điều tra trước khi thanh toán.' },
]);

const c7 = doc('efp301-7-1-spend-analysis', '7.1 — Spend analysis & procurement reporting|||7.1 — Phân tích chi tiêu & báo cáo mua sắm',
  'Spend analysis: phân loại chi tiêu, tìm cơ hội tiết kiệm; KPI: PO cycle time, spend under management, % maverick spend, mức tập trung nhà cung cấp; công cụ báo cáo; phân tích ABC.',
  [[
    `<span class="eyebrow">EFP301 · Chapter 7 · Lesson 7.1</span>
<h2>Spend analysis &amp; procurement reporting</h2>
<h3>What spend analysis does</h3>
<p><strong>Spend analysis</strong> collects every purchase across the ERP and classifies it — by category (IT, travel, raw materials...), by vendor, by department — to answer questions purchasing data alone cannot: are we buying the same category from 12 different vendors when 3 would give better prices? Are we honoring negotiated contract prices?</p>
<h3>Key procurement KPIs</h3>
<ul>
<li><strong>PO cycle time</strong> — how long from PR to PO approval; a long cycle time signals bottlenecks.</li>
<li><strong>Spend under management</strong> — the % of total spend that flows through approved procurement processes and contracts (vs. uncontrolled).</li>
<li><strong>Maverick spend %</strong> — the inverse: spend that bypassed the approved process/vendor (Chapter 2).</li>
<li><strong>Supplier concentration</strong> — how much spend sits with the top few vendors, a proxy for supply-risk exposure.</li>
</ul>
<h3>ABC analysis</h3>
<pre><code>Class A -> ~20% of items, ~80% of spend value -> tight control, negotiation focus
Class B -> moderate items, moderate spend      -> standard process
Class C -> many items, low individual spend    -> automate, low-touch buying
</code></pre>
<p>This <strong>80/20 rule</strong> applied to spend tells a procurement team where to spend its own limited negotiating time.</p>
<div class="callout"><span class="badge">Tools</span> SAP BW/Analytics and <strong>SAP Ariba Spend Visibility</strong> pull transaction data automatically into these reports and dashboards — without them, spend analysis means exporting to a spreadsheet by hand.</div>`,
    `<span class="eyebrow">EFP301 · Chương 7 · Bài 7.1</span>
<h2>Phân tích chi tiêu &amp; báo cáo mua sắm</h2>
<h3>Spend analysis làm gì</h3>
<p><strong>Phân tích chi tiêu (spend analysis)</strong> thu thập mọi lần mua trong ERP và phân loại — theo hạng mục (IT, công tác, vật tư thô...), theo nhà cung cấp, theo bộ phận — để trả lời các câu hỏi mà dữ liệu mua hàng đơn lẻ không trả lời được: có đang mua cùng một hạng mục từ 12 nhà cung cấp khác nhau khi 3 nhà cung cấp cho giá tốt hơn không? Có đang tuân theo giá hợp đồng đã đàm phán không?</p>
<h3>Các KPI mua sắm chính</h3>
<ul>
<li><strong>PO cycle time</strong> — thời gian từ PR tới khi PO được duyệt; chu kỳ dài báo hiệu điểm nghẽn.</li>
<li><strong>Spend under management</strong> — % tổng chi tiêu chảy qua các quy trình và hợp đồng mua sắm đã duyệt (so với không kiểm soát).</li>
<li><strong>% maverick spend</strong> — chiều ngược lại: chi tiêu lách quy trình/nhà cung cấp đã duyệt (Chương 2).</li>
<li><strong>Mức tập trung nhà cung cấp (supplier concentration)</strong> — bao nhiêu chi tiêu nằm ở vài nhà cung cấp lớn nhất, một chỉ số cho mức rủi ro nguồn cung.</li>
</ul>
<h3>Phân tích ABC</h3>
<pre><code>Nhóm A -> ~20% số mặt hàng, ~80% giá trị chi tiêu -> kiểm soát chặt, tập trung đàm phán
Nhóm B -> mặt hàng và chi tiêu ở mức trung bình    -> quy trình chuẩn
Nhóm C -> nhiều mặt hàng, chi tiêu từng món thấp   -> tự động hoá, mua ít can thiệp
</code></pre>
<p><strong>Quy tắc 80/20</strong> áp cho chi tiêu cho biết một đội mua sắm nên dồn thời gian đàm phán hạn hẹp của mình vào đâu.</p>
<div class="callout"><span class="badge">Công cụ</span> SAP BW/Analytics và <strong>SAP Ariba Spend Visibility</strong> tự động kéo dữ liệu giao dịch vào các báo cáo và dashboard này — không có chúng, phân tích chi tiêu nghĩa là xuất ra bảng tính bằng tay.</div>`,
  ]]);

const c7q = quiz('efp301-quiz-7', 'Quiz 7 — Spend analysis|||Quiz 7 — Phân tích chi tiêu', [
  { id: 'q1', question: '"Spend under management" đo điều gì?', options: ['Tổng số nhà cung cấp', 'Tỉ lệ % chi tiêu chảy qua quy trình/hợp đồng mua sắm đã duyệt', 'Số lượng PO bị chặn', 'Giá trung bình một item'], correctIndex: 1, explanation: 'Spend under management là % chi tiêu được kiểm soát qua quy trình/hợp đồng chính thức.' },
  { id: 'q2', question: 'Theo phân tích ABC, nhóm A thường là?', options: ['Nhiều mặt hàng, chi tiêu từng món thấp', 'Khoảng 20% mặt hàng chiếm khoảng 80% giá trị chi tiêu', 'Không cần kiểm soát', 'Chỉ áp dụng cho dịch vụ'], correctIndex: 1, explanation: 'ABC áp quy tắc 80/20: nhóm A ít mặt hàng nhưng chiếm phần lớn giá trị chi tiêu, cần kiểm soát/đàm phán chặt.' },
  { id: 'q3', question: 'Mức tập trung nhà cung cấp (supplier concentration) cao cho biết điều gì?', options: ['Không có rủi ro nguồn cung', 'Chi tiêu tập trung vào ít nhà cung cấp, tăng rủi ro nếu một trong số họ gặp vấn đề', 'Giá luôn thấp nhất', 'PO cycle time luôn ngắn'], correctIndex: 1, explanation: 'Tập trung cao vào ít nhà cung cấp là chỉ số rủi ro nguồn cung (supply risk).' },
]);

const c8 = doc('efp301-8-1-eprocurement-automation-ai', '8.1 — E-procurement, automation & AI trends|||8.1 — E-procurement, tự động hoá & xu hướng AI',
  'Nền tảng e-procurement (SAP Ariba, catalog, punch-out); tự động hoá (OCR hoá đơn, RPA, touchless PO); AI trong mua sắm (dự báo nhu cầu, chấm điểm rủi ro nhà cung cấp, chatbot hỗ trợ buyer, AI sinh cho RFQ); xu hướng: ESG, chống đứt gãy chuỗi cung ứng.',
  [[
    `<span class="eyebrow">EFP301 · Chapter 8 · Lesson 8.1</span>
<h2>E-procurement, automation &amp; AI trends</h2>
<h3>E-procurement platforms</h3>
<p><strong>E-procurement</strong> moves ordering itself online. Employees shop from a <strong>catalog</strong> inside the ERP — or <strong>punch-out</strong> to a vendor's own website (their live prices, inside the ERP's shopping cart) — instead of writing a free-text PR. <strong>SAP Ariba</strong> is the market-leading catalog/network platform connecting buyers and suppliers.</p>
<h3>Automation</h3>
<pre><code>Manual: paper invoice -> AP retypes fields -> match -> pay  (slow, error-prone)
Automated: scanned invoice -> OCR extracts fields -> RPA matches to PO/GR
           -> if within tolerance: "touchless" PO / invoice, no human touch
</code></pre>
<ul>
<li><strong>OCR (Optical Character Recognition)</strong> reads a scanned/PDF invoice into structured data automatically.</li>
<li><strong>RPA (Robotic Process Automation)</strong> performs repetitive steps (data entry, 3-way match checks) that used to be manual.</li>
<li>A <strong>touchless PO/invoice</strong> is one that never needs a human — the ultimate automation goal for low-risk, low-value transactions.</li>
</ul>
<h3>Where AI fits in</h3>
<p>Beyond rule-based automation, AI adds: <strong>demand forecasting</strong> (predicting what to buy and when), <strong>supplier risk scoring</strong> (flagging a supplier likely to fail delivery or go bankrupt, from public + internal data), <strong>chatbots</strong> that answer a buyer's "where is my PO" questions, and <strong>generative AI</strong> that drafts or summarizes RFQ responses for faster comparison.</p>
<div class="callout"><span class="badge">Trends beyond cost</span> Modern procurement increasingly scores on more than price: <strong>sustainable/ESG procurement</strong> (a supplier's environmental &amp; labor practices) and <strong>supply chain resilience</strong> (avoiding single-source dependency after events like COVID-19 disruptions) now sit alongside price and quality in the sourcing decision.</div>`,
    `<span class="eyebrow">EFP301 · Chương 8 · Bài 8.1</span>
<h2>E-procurement, tự động hoá &amp; xu hướng AI</h2>
<h3>Nền tảng e-procurement</h3>
<p><strong>E-procurement</strong> chuyển chính việc đặt hàng lên trực tuyến. Nhân viên mua từ một <strong>catalog</strong> ngay trong ERP — hoặc <strong>punch-out</strong> sang website riêng của nhà cung cấp (giá thực tế của họ, nằm trong giỏ hàng của ERP) — thay vì viết một PR dạng văn bản tự do. <strong>SAP Ariba</strong> là nền tảng catalog/network dẫn đầu thị trường, kết nối người mua và nhà cung cấp.</p>
<h3>Tự động hoá</h3>
<pre><code>Thủ công: hoá đơn giấy -> AP gõ lại từng trường -> khớp -> thanh toán (chậm, dễ sai)
Tự động: hoá đơn quét -> OCR trích trường tự động -> RPA khớp với PO/GR
         -> nếu trong sai số cho phép: PO/hoá đơn "touchless", không cần người can thiệp
</code></pre>
<ul>
<li><strong>OCR (nhận dạng ký tự quang học)</strong> đọc hoá đơn quét/PDF thành dữ liệu có cấu trúc tự động.</li>
<li><strong>RPA (tự động hoá quy trình bằng robot phần mềm)</strong> thực hiện các bước lặp lại (nhập liệu, kiểm tra khớp 3 chiều) trước đây làm tay.</li>
<li>Một <strong>PO/hoá đơn "touchless"</strong> là loại không cần con người can thiệp — mục tiêu tự động hoá tối đa cho giao dịch rủi ro thấp, giá trị nhỏ.</li>
</ul>
<h3>AI nằm ở đâu</h3>
<p>Ngoài tự động hoá theo quy tắc, AI thêm vào: <strong>dự báo nhu cầu (demand forecasting)</strong> (đoán cần mua gì và khi nào), <strong>chấm điểm rủi ro nhà cung cấp</strong> (báo hiệu một nhà cung cấp có khả năng trễ giao hoặc phá sản, từ dữ liệu công khai + nội bộ), <strong>chatbot</strong> trả lời câu hỏi "PO của tôi đang ở đâu" của người mua, và <strong>AI sinh (generative AI)</strong> soạn hoặc tóm tắt các phản hồi RFQ để so sánh nhanh hơn.</p>
<div class="callout"><span class="badge">Xu hướng vượt ngoài giá</span> Mua sắm hiện đại ngày càng chấm điểm nhiều hơn giá: <strong>mua sắm bền vững/ESG</strong> (thực hành môi trường &amp; lao động của nhà cung cấp) và <strong>khả năng chống đứt gãy chuỗi cung ứng</strong> (tránh lệ thuộc một nguồn duy nhất sau các sự kiện như gián đoạn COVID-19) giờ đứng cùng giá và chất lượng trong quyết định sourcing.</div>`,
  ]]);

const c8q = quiz('efp301-quiz-8', 'Quiz 8 — E-procurement & AI|||Quiz 8 — E-procurement & AI', [
  { id: 'q1', question: '"Punch-out" trong e-procurement nghĩa là gì?', options: ['Xoá một PO', 'Nhân viên mua trực tiếp trên website riêng của nhà cung cấp, giá hiển thị ngay trong giỏ hàng ERP', 'Một loại hoá đơn bị chặn', 'Một KPI về chi tiêu'], correctIndex: 1, explanation: 'Punch-out cho nhân viên "nhảy" sang catalog riêng của nhà cung cấp trong khi vẫn ở trong luồng mua hàng ERP.' },
  { id: 'q2', question: 'Một PO/hoá đơn "touchless" là gì?', options: ['PO cần nhiều người duyệt', 'PO/hoá đơn xử lý tự động hoàn toàn, không cần con người can thiệp khi mọi thứ khớp', 'PO chỉ dùng cho hàng nhập khẩu', 'PO không có nhà cung cấp'], correctIndex: 1, explanation: 'Touchless là mục tiêu tự động hoá cao nhất: hệ thống tự xử lý khi giao dịch khớp và ít rủi ro.' },
  { id: 'q3', question: 'Ngoài giá và chất lượng, xu hướng mua sắm hiện đại còn xét thêm tiêu chí nào?', options: ['Chỉ số lượng nhân viên của nhà cung cấp', 'ESG (bền vững/môi trường-lao động) và khả năng chống đứt gãy chuỗi cung ứng', 'Màu logo của nhà cung cấp', 'Vị trí văn phòng chính'], correctIndex: 1, explanation: 'Sourcing hiện đại cân nhắc cả thực hành ESG và rủi ro tập trung nguồn cung, không chỉ giá/chất lượng.' },
]);

const taiLieu = doc('efp301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo (Monczka, Baily/Farrington), tài liệu chính thức SAP/Oracle, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EFP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn ERP for Procurement — the P2P process, vendor/material master data, sourcing, 3-way matching and spend analysis — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EFP301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.cengage.com" target="_blank" rel="noopener"><em>Purchasing and Supply Chain Management</em> — Monczka, Handfield, Giunipero &amp; Patterson (Cengage)</a></li>
<li><a href="https://www.koganpage.com" target="_blank" rel="noopener"><em>Procurement and Supply Chain Management</em> — Baily, Farrington, Jessop &amp; Jones (Kogan Page)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://help.sap.com" target="_blank" rel="noopener">SAP Help Portal</a> — official SAP MM &amp; Ariba documentation</li>
<li><a href="https://docs.oracle.com" target="_blank" rel="noopener">Oracle Help Center</a> — Oracle Procurement Cloud documentation</li>
<li><a href="https://www.cips.org" target="_blank" rel="noopener">CIPS — Chartered Institute of Procurement &amp; Supply</a> — free knowledge hub</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@SAP" target="_blank" rel="noopener">SAP (official channel)</a> — MM/Ariba product walkthroughs</li>
<li><a href="https://www.youtube.com/@procurementtactics" target="_blank" rel="noopener">Procurement Tactics</a> — practical sourcing &amp; negotiation content</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.ariba.com" target="_blank" rel="noopener">SAP Ariba</a> — sourcing &amp; supplier network platform</li>
<li><a href="https://www.oracle.com/applications/procurement/" target="_blank" rel="noopener">Oracle Procurement Cloud</a> — requisitioning, purchasing, sourcing</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — ERP structure, the P2P chain, vendor/material master data.</li>
<li><strong>Practice</strong> — trace a PR through to PO, GR and invoice; identify where a 3-way match would block payment.</li>
<li><strong>Go deeper</strong> — sourcing/RFQ, spend analysis KPIs, ABC classification.</li>
<li><strong>Job-ready</strong> — read SAP MM/Ariba screens, understand e-procurement automation and where AI is used today.</li>
</ol></div>`,
    `<span class="eyebrow">EFP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học ERP cho Mua sắm — quy trình P2P, dữ liệu chủ nhà cung cấp/vật tư, sourcing, khớp 3 chiều và phân tích chi tiêu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EFP301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.cengage.com" target="_blank" rel="noopener"><em>Purchasing and Supply Chain Management</em> — Monczka, Handfield, Giunipero &amp; Patterson (Cengage)</a></li>
<li><a href="https://www.koganpage.com" target="_blank" rel="noopener"><em>Procurement and Supply Chain Management</em> — Baily, Farrington, Jessop &amp; Jones (Kogan Page)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://help.sap.com" target="_blank" rel="noopener">SAP Help Portal</a> — tài liệu chính thức SAP MM &amp; Ariba</li>
<li><a href="https://docs.oracle.com" target="_blank" rel="noopener">Oracle Help Center</a> — tài liệu Oracle Procurement Cloud</li>
<li><a href="https://www.cips.org" target="_blank" rel="noopener">CIPS — Chartered Institute of Procurement &amp; Supply</a> — kho kiến thức miễn phí</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@SAP" target="_blank" rel="noopener">SAP (kênh chính thức)</a> — trình chiếu sản phẩm MM/Ariba</li>
<li><a href="https://www.youtube.com/@procurementtactics" target="_blank" rel="noopener">Procurement Tactics</a> — nội dung thực tế về sourcing &amp; đàm phán</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.ariba.com" target="_blank" rel="noopener">SAP Ariba</a> — nền tảng sourcing &amp; mạng lưới nhà cung cấp</li>
<li><a href="https://www.oracle.com/applications/procurement/" target="_blank" rel="noopener">Oracle Procurement Cloud</a> — yêu cầu mua, mua hàng, sourcing</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — cấu trúc ERP, chuỗi P2P, dữ liệu chủ nhà cung cấp/vật tư.</li>
<li><strong>Luyện tập</strong> — lần theo một PR tới PO, GR và hoá đơn; nhận ra chỗ khớp 3 chiều sẽ chặn thanh toán.</li>
<li><strong>Đào sâu thực tế</strong> — sourcing/RFQ, các KPI phân tích chi tiêu, phân loại ABC.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc màn hình SAP MM/Ariba, hiểu tự động hoá e-procurement và AI đang được dùng ở đâu.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'EFP301',
    slug: 'efp301-erp-for-procurement',
    title: 'ERP for Procurement',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EFP301.webp',
    shortDescription: 'ERP for procurement, end to end: Procure-to-Pay (P2P), vendor & material master data, PR/PO, sourcing & RFQ, 3-way matching, spend analysis, e-procurement & AI (SAP Ariba). Bilingual, with examples & quizzes.|||ERP cho mua sắm, từ đầu đến cuối: Procure-to-Pay (P2P), dữ liệu chủ nhà cung cấp & vật tư, PR/PO, đấu thầu & RFQ, khớp 3 chiều, phân tích chi tiêu, e-procurement & AI (SAP Ariba). Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>EFP301 — ERP for Procurement</strong> (kỳ 5, khối Quản trị Kinh doanh) giúp hiểu <strong>ERP vận hành chức năng mua sắm thế nào</strong>. Từ <strong>tổng quan ERP &amp; module mua sắm</strong> (SAP MM/Ariba, Oracle Procurement Cloud) → quy trình <strong>Procure-to-Pay (P2P)</strong> → <strong>dữ liệu chủ nhà cung cấp &amp; vật tư</strong> → <strong>yêu cầu &amp; đơn mua hàng (PR/PO)</strong> → <strong>sourcing &amp; RFQ</strong> → <strong>nhận hàng, hoá đơn &amp; khớp 3 chiều</strong> → <strong>phân tích chi tiêu &amp; báo cáo</strong> → <strong>e-procurement, tự động hoá &amp; AI</strong>. Bám giáo trình SAP MM/Ariba, Monczka, Baily/Farrington, Oracle Procurement Cloud; song ngữ, có ví dụ quy trình thực tế và quiz mỗi chương.',
    whatYouLearn: 'ERP & cơ cấu tổ chức mua sắm (company code, plant, purchasing org/group); chuỗi Procure-to-Pay (PR→PO→GR→Invoice→Payment); vendor master & material master (các view); các loại PO (standard/blanket/scheduling agreement) & release strategy; sourcing (RFI/RFQ/RFP) & quản lý nhà cung cấp; goods receipt, invoice verification & khớp 3 chiều; KPI mua sắm & phân tích ABC; e-procurement (catalog/punch-out), OCR/RPA, AI trong mua sắm (SAP Ariba).',
    requirements: 'Kiến thức nhập môn kinh doanh/quản trị (đã học các môn đại cương khối BBA trước kỳ 5). Không yêu cầu quyền truy cập SAP/Oracle thật — môn dùng khái niệm và ví dụ minh hoạ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức SAP/Oracle, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'ERP là gì, vì sao mua sắm là module lõi trong ERP.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ERP & module mua sắm|||Chapter 1 — ERP & the procurement module', description: 'ERP tích hợp module; SAP MM/Ariba, Oracle Procurement; cơ cấu tổ chức mua sắm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình Procure-to-Pay (P2P)|||Chapter 2 — The Procure-to-Pay process', description: 'PR→PO→GR→Invoice→Payment; vai trò; tự động hoá P2P.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dữ liệu chủ nhà cung cấp & vật tư|||Chapter 3 — Vendor & material master data', description: 'Vendor master, material master, đánh giá nhà cung cấp.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Yêu cầu mua & đơn đặt hàng (PR/PO)|||Chapter 4 — Purchase requisitions & orders', description: 'PR nội bộ, PO pháp lý, các loại PO, release strategy.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Sourcing & quản lý nhà cung cấp (RFQ)|||Chapter 5 — Sourcing & vendor management', description: 'RFI/RFQ/RFP, quản lý nhà cung cấp, SAP Ariba sourcing.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nhận hàng, hoá đơn & khớp 3 chiều|||Chapter 6 — Goods receipt, invoicing & 3-way matching', description: 'GR/MIGO, MIRO, 3-way match, xử lý sai lệch.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phân tích chi tiêu & báo cáo mua sắm|||Chapter 7 — Spend analysis & procurement reporting', description: 'KPI mua sắm, phân tích ABC, công cụ báo cáo.', lessons: [c7, c7q] },
    { title: 'Chương 8 — E-procurement, tự động hoá & xu hướng AI|||Chapter 8 — E-procurement, automation & AI trends', description: 'Catalog/punch-out, OCR/RPA, AI trong mua sắm, ESG.', lessons: [c8, c8q] },
  ],
};
