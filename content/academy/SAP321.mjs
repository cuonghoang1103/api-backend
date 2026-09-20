/**
 * SAP321 — SAP General 2 (SAP ERP nâng cao — phần 2: cấu hình, tích hợp &
 * triển khai). Ngành Hệ thống thông tin, kỳ 7, FPTU. Tiếp nối SAP311.
 * Giáo trình: SAP Press "SAP S/4HANA Finance"; "Configuring SAP ERP";
 * SAP Activate methodology; openSAP; help.sap.com. Song ngữ VI+EN.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp;; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sap321-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách SAP Press, tài liệu chính thức miễn phí (help.sap.com, openSAP), YouTube, công cụ, lộ trình.',
  [[
    `<span class="eyebrow">SAP321 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to configure and deploy <strong>SAP ERP / S/4HANA</strong> — Customizing (IMG), enterprise structure, module configuration, authorizations, integration, analytics and the SAP Activate rollout — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for SAP321 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (SAP Press)</h3>
<ul>
<li><em>SAP S/4HANA Finance: An Introduction</em> — SAP Press</li>
<li><em>Configuring SAP ERP Financials and Controlling</em> — Padhi</li>
<li><em>SAP Activate</em> — the official implementation methodology guide</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://help.sap.com/" target="_blank" rel="noopener">SAP Help Portal (help.sap.com)</a> — configuration &amp; product docs</li>
<li><a href="https://open.sap.com/" target="_blank" rel="noopener">openSAP</a> — free MOOCs on S/4HANA &amp; SAP Activate</li>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning</a> — free learning journeys</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@SAP" target="_blank" rel="noopener">SAP</a> — official product &amp; how-to videos</li>
<li><a href="https://www.youtube.com/results?search_query=sap+fico+configuration" target="_blank" rel="noopener">SAP FICO configuration tutorials</a></li>
</ul>
<h3>🛠️ Tools &amp; practice</h3>
<ul>
<li>SAP GUI / SAP Fiori launchpad — the transaction &amp; app front-ends</li>
<li>Transaction <code>SPRO</code> — the Implementation Guide (IMG), where all configuration happens</li>
<li>SAP BTP trial / S/4HANA sandbox — hands-on practice systems</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — how Customizing/IMG works, client vs. transport, and the enterprise structure.</li>
<li><strong>Module config</strong> — FI/CO (chart of accounts, cost centers) then MM/SD (pricing, output).</li>
<li><strong>Cross-cutting</strong> — authorizations &amp; workflow, then integration (IDoc/BAPI/API).</li>
<li><strong>Deliver</strong> — analytics &amp; reporting, and a full SAP Activate rollout with S/4HANA migration.</li>
</ol></div>`,
    `<span class="eyebrow">SAP321 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để cấu hình và triển khai <strong>SAP ERP / S/4HANA</strong> — Customizing (IMG), enterprise structure, cấu hình phân hệ, phân quyền, tích hợp, phân tích và triển khai theo SAP Activate — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SAP321 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (SAP Press)</h3>
<ul>
<li><em>SAP S/4HANA Finance: An Introduction</em> — SAP Press</li>
<li><em>Configuring SAP ERP Financials and Controlling</em> — Padhi</li>
<li><em>SAP Activate</em> — sách hướng dẫn phương pháp triển khai chính thức</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://help.sap.com/" target="_blank" rel="noopener">SAP Help Portal (help.sap.com)</a> — tài liệu cấu hình &amp; sản phẩm</li>
<li><a href="https://open.sap.com/" target="_blank" rel="noopener">openSAP</a> — khoá học miễn phí về S/4HANA &amp; SAP Activate</li>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning</a> — lộ trình học miễn phí</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@SAP" target="_blank" rel="noopener">SAP</a> — video sản phẩm &amp; hướng dẫn chính thức</li>
<li><a href="https://www.youtube.com/results?search_query=sap+fico+configuration" target="_blank" rel="noopener">Hướng dẫn cấu hình SAP FICO</a></li>
</ul>
<h3>🛠️ Công cụ &amp; thực hành</h3>
<ul>
<li>SAP GUI / SAP Fiori launchpad — giao diện transaction &amp; app</li>
<li>Transaction <code>SPRO</code> — Implementation Guide (IMG), nơi thực hiện mọi cấu hình</li>
<li>SAP BTP trial / sandbox S/4HANA — hệ thống thực hành</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — Customizing/IMG hoạt động thế nào, client vs. transport, và enterprise structure.</li>
<li><strong>Cấu hình phân hệ</strong> — FI/CO (chart of accounts, cost center) rồi MM/SD (pricing, output).</li>
<li><strong>Xuyên suốt</strong> — phân quyền &amp; workflow, rồi tích hợp (IDoc/BAPI/API).</li>
<li><strong>Bàn giao</strong> — phân tích &amp; báo cáo, và một dự án SAP Activate đầy đủ kèm migration S/4HANA.</li>
</ol></div>`,
  ]]);

const intro = doc('sap321-0-1-overview', 'Course overview: advanced SAP config & deployment|||Tổng quan: cấu hình & triển khai SAP nâng cao',
  'SAP321 tiếp nối SAP311: từ "dùng SAP" sang "cấu hình & triển khai SAP". Customizing/IMG, enterprise structure, cấu hình FI/CO & MM/SD, phân quyền, tích hợp, analytics, SAP Activate.',
  [[
    `<span class="eyebrow">SAP321 · Lesson 0.1 · Overview</span>
<h2>Advanced SAP ERP — configuration &amp; deployment</h2>
<p class="lead">SAP311 taught you to <em>use</em> SAP; SAP321 teaches you to <strong>configure and deploy</strong> it. This is the work a functional consultant does: turn business requirements into system settings, connect SAP to other systems, secure it with authorizations, and run a real implementation project.</p>
<h3>The one idea that runs through everything: Customizing</h3>
<p>SAP is not programmed for each customer — it is <strong>configured</strong>. A vast set of tables holds the settings (which company codes exist, what a chart of accounts looks like, how prices are calculated). You change behavior by changing these tables through the <strong>Implementation Guide (IMG)</strong>, transaction <code>SPRO</code> — rarely by writing code.</p>
<h3>Roadmap (8 chapters)</h3>
<pre><code>1  Customizing &amp; IMG (SPRO)        -> how config works, transports
2  Enterprise Structure             -> company code, plant, sales org
3  FI/CO config (advanced)          -> chart of accounts, cost centers
4  MM/SD config                     -> pricing, output determination
5  Authorization &amp; Workflow         -> roles, profiles, approvals
6  Integration (IDoc/BAPI/API)      -> connecting to outside systems
7  Analytics, reporting &amp; SAP BW    -> turning data into insight
8  SAP Activate &amp; S/4HANA migration -> running the project</code></pre>
<div class="callout"><span class="badge">Consultant mindset</span> Every chapter answers the same question in a new area: <em>"the business needs X — which configuration setting delivers X, and how do I move it safely to production?"</em></div>`,
    `<span class="eyebrow">SAP321 · Bài 0.1 · Tổng quan</span>
<h2>SAP ERP nâng cao — cấu hình &amp; triển khai</h2>
<p class="lead">SAP311 dạy bạn <em>dùng</em> SAP; SAP321 dạy bạn <strong>cấu hình và triển khai</strong> nó. Đây là công việc của một functional consultant: biến yêu cầu nghiệp vụ thành cấu hình hệ thống, kết nối SAP với hệ thống khác, bảo mật bằng phân quyền, và chạy một dự án triển khai thật.</p>
<h3>Một ý xuyên suốt: Customizing</h3>
<p>SAP không được lập trình lại cho từng khách hàng — nó được <strong>cấu hình</strong>. Một tập bảng khổng lồ giữ các thiết lập (có những company code nào, chart of accounts trông ra sao, giá được tính thế nào). Bạn thay đổi hành vi bằng cách thay các bảng này qua <strong>Implementation Guide (IMG)</strong>, transaction <code>SPRO</code> — hiếm khi phải viết mã.</p>
<h3>Lộ trình (8 chương)</h3>
<pre><code>1  Customizing &amp; IMG (SPRO)        -> cấu hình hoạt động ra sao, transport
2  Enterprise Structure             -> company code, plant, sales org
3  Cấu hình FI/CO (nâng cao)        -> chart of accounts, cost center
4  Cấu hình MM/SD                   -> pricing, output determination
5  Phân quyền &amp; Workflow            -> role, profile, phê duyệt
6  Tích hợp (IDoc/BAPI/API)         -> nối với hệ thống ngoài
7  Analytics, báo cáo &amp; SAP BW      -> biến dữ liệu thành thông tin
8  SAP Activate &amp; migration S/4HANA -> chạy dự án</code></pre>
<div class="callout"><span class="badge">Tư duy consultant</span> Mỗi chương trả lời cùng một câu hỏi ở một lĩnh vực mới: <em>"nghiệp vụ cần X — thiết lập cấu hình nào cho ra X, và làm sao đưa nó lên production an toàn?"</em></div>`,
  ]]);

const c1 = doc('sap321-1-1-customizing-img', '1.1 — Customizing & the IMG (Implementation Guide)|||1.1 — Customizing & IMG (Implementation Guide)',
  'IMG/SPRO là nơi cấu hình SAP; khái niệm client (customizing vs. master/transaction data), Customizing vs. Workbench requests, và hệ thống chuyển giao (transport) DEV→QAS→PRD.',
  [[
    `<span class="eyebrow">SAP321 · Chapter 1 · Lesson 1.1</span>
<h2>Customizing &amp; the IMG</h2>
<h3>What "configuring SAP" means</h3>
<p>Almost nothing in SAP is hard-coded per customer. Instead, thousands of <strong>configuration tables</strong> hold the settings that shape behavior. You edit them through the <strong>Implementation Guide (IMG)</strong> — open it with transaction <code>SPRO</code> then "SAP Reference IMG". It is a tree of activities grouped by module.</p>
<h3>Three kinds of data — never confuse them</h3>
<ul>
<li><strong>Customizing data</strong> — configuration (company codes, document types). Moved between systems by transports.</li>
<li><strong>Master data</strong> — long-lived business objects (customers, materials, G/L accounts).</li>
<li><strong>Transaction data</strong> — day-to-day documents (a sales order, an invoice).</li>
</ul>
<h3>Clients and the transport landscape</h3>
<p>A <strong>client</strong> is a self-contained data environment inside one system. Configuration is done in a Development client, tested in Quality, then imported into Production — you never configure directly in Production.</p>
<pre><code>Transport landscape (three-system landscape):
  DEV (Development)  -> config here, assigned to a Transport Request
   |  release + transport
  QAS (Quality)      -> import &amp; test
   |  import
  PRD (Production)   -> live users

Request types:
  Customizing request  -> configuration table entries (client-specific)
  Workbench request    -> ABAP/repository objects (cross-client)</code></pre>
<div class="callout"><span class="badge">Golden rule</span> Configure once in DEV, capture it in a transport request, and let it flow DEV → QAS → PRD. Manual re-entry in each system is how landscapes drift and break.</div>`,
    `<span class="eyebrow">SAP321 · Chương 1 · Bài 1.1</span>
<h2>Customizing &amp; IMG</h2>
<h3>"Cấu hình SAP" nghĩa là gì</h3>
<p>Gần như không gì trong SAP được viết cứng cho từng khách hàng. Thay vào đó, hàng nghìn <strong>bảng cấu hình</strong> giữ các thiết lập định hình hành vi. Bạn sửa chúng qua <strong>Implementation Guide (IMG)</strong> — mở bằng transaction <code>SPRO</code> rồi chọn "SAP Reference IMG". Đó là một cây hoạt động nhóm theo phân hệ.</p>
<h3>Ba loại dữ liệu — đừng nhầm lẫn</h3>
<ul>
<li><strong>Customizing data</strong> — cấu hình (company code, loại chứng từ). Chuyển giữa các hệ thống bằng transport.</li>
<li><strong>Master data</strong> — đối tượng nghiệp vụ dùng lâu (khách hàng, vật tư, tài khoản G/L).</li>
<li><strong>Transaction data</strong> — chứng từ hằng ngày (một đơn bán hàng, một hoá đơn).</li>
</ul>
<h3>Client và hệ thống transport</h3>
<p>Một <strong>client</strong> là một môi trường dữ liệu độc lập bên trong một hệ thống. Cấu hình làm ở client Development, kiểm thử ở Quality, rồi import vào Production — bạn không bao giờ cấu hình trực tiếp trên Production.</p>
<pre><code>Hệ thống transport (three-system landscape):
  DEV (Development)  -> cấu hình ở đây, gán vào một Transport Request
   |  release + transport
  QAS (Quality)      -> import &amp; kiểm thử
   |  import
  PRD (Production)   -> người dùng thật

Loại request:
  Customizing request  -> bản ghi bảng cấu hình (theo client)
  Workbench request    -> đối tượng ABAP/repository (xuyên client)</code></pre>
<div class="callout"><span class="badge">Quy tắc vàng</span> Cấu hình một lần ở DEV, gói vào transport request, để nó chảy DEV → QAS → PRD. Gõ lại tay ở từng hệ thống là cách khiến landscape lệch nhau và hỏng.</div>`,
  ]]);

const c1q = quiz('sap321-quiz-1', 'Quiz 1 — Customizing & IMG|||Quiz 1 — Customizing & IMG', [
  { id: 'q1', question: 'Transaction nào mở Implementation Guide (IMG) để cấu hình SAP?', options: ['SE80', 'SPRO', 'MM01', 'VA01'], correctIndex: 1, explanation: 'SPRO mở IMG — nơi thực hiện mọi cấu hình (Customizing) của SAP.' },
  { id: 'q2', question: 'Cấu hình (Customizing) nên được thực hiện ở đâu và di chuyển thế nào?', options: ['Trực tiếp trên Production cho nhanh', 'Ở DEV rồi transport qua QAS → PRD', 'Nhập tay lại ở từng hệ thống', 'Chỉ trên client Production'], correctIndex: 1, explanation: 'Cấu hình làm ở DEV, gói vào transport request, chảy DEV→QAS→PRD; không cấu hình thẳng trên PRD.' },
  { id: 'q3', question: 'Một đơn bán hàng (sales order) thuộc loại dữ liệu nào?', options: ['Customizing data', 'Master data', 'Transaction data', 'Workbench object'], correctIndex: 2, explanation: 'Đơn bán hàng là chứng từ hằng ngày → transaction data; khác với cấu hình và master data.' },
]);

const c2 = doc('sap321-2-1-enterprise-structure', '2.1 — Configuring the enterprise structure|||2.1 — Cấu hình Enterprise Structure',
  'Enterprise structure ánh xạ doanh nghiệp thật vào SAP: client, company code (FI), controlling area (CO), plant/storage location (MM), sales organization/distribution channel/division (SD) và cách chúng gán vào nhau.',
  [[
    `<span class="eyebrow">SAP321 · Chapter 2 · Lesson 2.1</span>
<h2>Configuring the enterprise structure</h2>
<p>Before any transaction can post, SAP must know the shape of your organization. The <strong>enterprise structure</strong> is a set of organizational units, defined in the IMG, that model your real company — and the <em>assignments</em> that link them.</p>
<h3>Key organizational units by module</h3>
<ul>
<li><strong>Client</strong> — the top level; one company group shares a client.</li>
<li><strong>Company Code (FI)</strong> — a legal entity that produces its own balance sheet &amp; P&amp;L. This is the central unit for Financial Accounting.</li>
<li><strong>Controlling Area (CO)</strong> — the unit for internal cost accounting; can span several company codes sharing one chart of accounts.</li>
<li><strong>Plant / Storage Location (MM)</strong> — where materials are produced, stored or procured.</li>
<li><strong>Sales Organization / Distribution Channel / Division (SD)</strong> — how you sell; together they form a <em>sales area</em>.</li>
</ul>
<pre><code>Assignment chain (define -&gt; then assign):
  Company Code      -&gt; assigned to  Controlling Area
  Plant             -&gt; assigned to  Company Code
  Sales Org         -&gt; assigned to  Company Code
  Dist. Channel + Division + Sales Org = Sales Area
  Plant             -&gt; assigned to  Sales Org + Dist. Channel</code></pre>
<div class="callout"><span class="badge">Two-step pattern</span> Every structure element is first <strong>defined</strong> (create the unit) and then <strong>assigned</strong> (link it to others). Miss the assignment and the unit exists but cannot be used in transactions.</div>`,
    `<span class="eyebrow">SAP321 · Chương 2 · Bài 2.1</span>
<h2>Cấu hình Enterprise Structure</h2>
<p>Trước khi bất kỳ giao dịch nào được ghi sổ, SAP phải biết hình dạng tổ chức của bạn. <strong>Enterprise structure</strong> là tập các đơn vị tổ chức, khai trong IMG, mô hình hoá công ty thật của bạn — cùng các <em>assignment</em> nối chúng lại.</p>
<h3>Các đơn vị tổ chức chính theo phân hệ</h3>
<ul>
<li><strong>Client</strong> — cấp cao nhất; một tập đoàn dùng chung một client.</li>
<li><strong>Company Code (FI)</strong> — một pháp nhân tự lập bảng cân đối &amp; báo cáo lãi/lỗ. Đây là đơn vị trung tâm của Kế toán tài chính.</li>
<li><strong>Controlling Area (CO)</strong> — đơn vị cho kế toán chi phí nội bộ; có thể trải trên nhiều company code dùng chung một chart of accounts.</li>
<li><strong>Plant / Storage Location (MM)</strong> — nơi vật tư được sản xuất, lưu kho hoặc mua sắm.</li>
<li><strong>Sales Organization / Distribution Channel / Division (SD)</strong> — cách bạn bán; hợp lại thành một <em>sales area</em>.</li>
</ul>
<pre><code>Chuỗi assignment (define -&gt; rồi assign):
  Company Code      -&gt; gán vào  Controlling Area
  Plant             -&gt; gán vào  Company Code
  Sales Org         -&gt; gán vào  Company Code
  Dist. Channel + Division + Sales Org = Sales Area
  Plant             -&gt; gán vào  Sales Org + Dist. Channel</code></pre>
<div class="callout"><span class="badge">Mẫu hai bước</span> Mỗi phần tử cấu trúc trước hết được <strong>define</strong> (tạo đơn vị) rồi <strong>assign</strong> (nối với đơn vị khác). Quên assign thì đơn vị tồn tại nhưng không dùng được trong giao dịch.</div>`,
  ]]);

const c2q = quiz('sap321-quiz-2', 'Quiz 2 — Enterprise structure|||Quiz 2 — Enterprise structure', [
  { id: 'q1', question: 'Đơn vị tổ chức nào là pháp nhân tự lập bảng cân đối & báo cáo lãi/lỗ trong FI?', options: ['Plant', 'Company Code', 'Sales Organization', 'Controlling Area'], correctIndex: 1, explanation: 'Company Code là đơn vị trung tâm của FI — một pháp nhân có bảng cân đối và P&L riêng.' },
  { id: 'q2', question: 'Sales area được tạo từ tổ hợp nào?', options: ['Company Code + Plant + Client', 'Sales Org + Distribution Channel + Division', 'Controlling Area + Company Code', 'Plant + Storage Location'], correctIndex: 1, explanation: 'Sales area = Sales Organization + Distribution Channel + Division.' },
  { id: 'q3', question: 'Vì sao "define" xong một đơn vị mà chưa dùng được trong giao dịch?', options: ['Phải khởi động lại hệ thống', 'Vì còn thiếu bước assign nối nó với các đơn vị khác', 'Vì chưa transport lên PRD', 'Vì thiếu master data'], correctIndex: 1, explanation: 'Mẫu hai bước: define rồi assign. Chưa assign thì đơn vị tồn tại nhưng chưa liên kết để dùng.' },
]);

const c3 = doc('sap321-3-1-fico-config', '3.1 — Advanced FI/CO configuration|||3.1 — Cấu hình FI/CO nâng cao',
  'Cấu hình Financial Accounting & Controlling: chart of accounts (operating/group/country), G/L account, fiscal year variant, posting periods; và Controlling: cost element, cost center, cost center hierarchy.',
  [[
    `<span class="eyebrow">SAP321 · Chapter 3 · Lesson 3.1</span>
<h2>Advanced FI/CO configuration</h2>
<h3>Financial Accounting (FI) — the general ledger backbone</h3>
<ul>
<li><strong>Chart of Accounts (COA)</strong> — the master list of G/L accounts. An <em>operating</em> COA is assigned to each company code; group and country COAs support consolidation and local reporting.</li>
<li><strong>Fiscal Year Variant</strong> — how many posting periods a year has (e.g. 12 + 4 special periods) and when the year starts.</li>
<li><strong>Posting Period Variant</strong> — which periods are open for posting, so you cannot post into a closed month.</li>
<li><strong>Document Types &amp; Number Ranges</strong> — classify and number every accounting document.</li>
</ul>
<h3>Controlling (CO) — internal cost accounting</h3>
<ul>
<li><strong>Cost Elements</strong> — mirror P&amp;L G/L accounts into CO so costs can be tracked.</li>
<li><strong>Cost Center</strong> — a location where costs are incurred (a department); the workhorse of overhead controlling.</li>
<li><strong>Cost Center Hierarchy (standard hierarchy)</strong> — every cost center rolls up into a tree for reporting.</li>
</ul>
<pre><code>How FI and CO connect:
  P&amp;L G/L account (FI)  --becomes-->  Primary Cost Element (CO)
  A posting to that account       ->  also updates the assigned Cost Center
  Cost Centers roll up into        ->  the Standard Hierarchy (CO reporting)

Config order (simplified):
  1 Chart of Accounts + assign to Company Code
  2 Fiscal Year Variant + Posting Period Variant
  3 G/L accounts (master data)
  4 Controlling Area + activate cost element / cost center accounting</code></pre>
<div class="callout"><span class="badge">FI vs. CO</span> FI answers "what is my legal financial position?" (external). CO answers "where are costs incurred and are we profitable internally?" A single posting can feed both at once.</div>`,
    `<span class="eyebrow">SAP321 · Chương 3 · Bài 3.1</span>
<h2>Cấu hình FI/CO nâng cao</h2>
<h3>Financial Accounting (FI) — xương sống sổ cái</h3>
<ul>
<li><strong>Chart of Accounts (COA)</strong> — danh mục gốc các tài khoản G/L. COA <em>operating</em> được gán cho từng company code; COA group và country phục vụ hợp nhất và báo cáo theo luật địa phương.</li>
<li><strong>Fiscal Year Variant</strong> — một năm có bao nhiêu kỳ ghi sổ (vd 12 + 4 kỳ đặc biệt) và năm bắt đầu khi nào.</li>
<li><strong>Posting Period Variant</strong> — kỳ nào đang mở để ghi sổ, để không ghi vào tháng đã đóng.</li>
<li><strong>Document Types &amp; Number Ranges</strong> — phân loại và đánh số mọi chứng từ kế toán.</li>
</ul>
<h3>Controlling (CO) — kế toán chi phí nội bộ</h3>
<ul>
<li><strong>Cost Elements</strong> — phản chiếu tài khoản G/L của P&amp;L sang CO để theo dõi chi phí.</li>
<li><strong>Cost Center</strong> — nơi phát sinh chi phí (một phòng ban); công cụ chủ lực của overhead controlling.</li>
<li><strong>Cost Center Hierarchy (standard hierarchy)</strong> — mọi cost center gom vào một cây để báo cáo.</li>
</ul>
<pre><code>FI và CO nối nhau thế nào:
  Tài khoản G/L của P&amp;L (FI) --thành-->  Primary Cost Element (CO)
  Một bút toán vào tài khoản đó       ->  cũng cập nhật Cost Center đã gán
  Cost Center gom lên                 ->  Standard Hierarchy (báo cáo CO)

Thứ tự cấu hình (rút gọn):
  1 Chart of Accounts + gán cho Company Code
  2 Fiscal Year Variant + Posting Period Variant
  3 Tài khoản G/L (master data)
  4 Controlling Area + kích hoạt cost element / cost center accounting</code></pre>
<div class="callout"><span class="badge">FI vs. CO</span> FI trả lời "vị thế tài chính pháp lý của tôi là gì?" (bên ngoài). CO trả lời "chi phí phát sinh ở đâu và nội bộ có lãi không?". Một bút toán có thể nuôi cả hai cùng lúc.</div>`,
  ]]);

const c3q = quiz('sap321-quiz-3', 'Quiz 3 — FI/CO config|||Quiz 3 — Cấu hình FI/CO', [
  { id: 'q1', question: 'Chart of Accounts loại "operating" được gán cho đối tượng nào?', options: ['Cost Center', 'Company Code', 'Sales Area', 'Storage Location'], correctIndex: 1, explanation: 'COA operating được gán cho từng company code; đó là danh mục tài khoản dùng để ghi sổ hằng ngày.' },
  { id: 'q2', question: 'Cấu hình nào quyết định kỳ (tháng) nào đang mở để ghi sổ?', options: ['Fiscal Year Variant', 'Posting Period Variant', 'Document Type', 'Number Range'], correctIndex: 1, explanation: 'Posting Period Variant kiểm soát kỳ nào mở/đóng, chặn ghi sổ vào tháng đã đóng.' },
  { id: 'q3', question: 'Điểm khác cốt lõi giữa FI và CO là gì?', options: ['FI cho báo cáo pháp lý (bên ngoài), CO cho kế toán chi phí nội bộ', 'FI chỉ dùng cho bán hàng, CO cho mua hàng', 'CO thay thế hoàn toàn FI', 'Cả hai chỉ là master data'], correctIndex: 0, explanation: 'FI = báo cáo tài chính pháp lý (external); CO = kế toán chi phí nội bộ; một bút toán có thể nuôi cả hai.' },
]);

const c4 = doc('sap321-4-1-mm-sd-config', '4.1 — MM & SD configuration (pricing, output)|||4.1 — Cấu hình MM & SD (pricing, output)',
  'Cấu hình Materials Management & Sales and Distribution: condition technique cho pricing (condition type, access sequence, pricing procedure), và output determination (in/gửi hoá đơn, đơn hàng qua điều kiện tương tự).',
  [[
    `<span class="eyebrow">SAP321 · Chapter 4 · Lesson 4.1</span>
<h2>MM &amp; SD configuration: the condition technique</h2>
<p>Both purchasing prices (MM) and sales prices (SD) — and even <em>output</em> like printing an invoice — are driven by one shared engine: the <strong>condition technique</strong>. Learn it once and it appears everywhere.</p>
<h3>The building blocks of pricing</h3>
<ul>
<li><strong>Condition Type</strong> — one element of price: base price (PR00), discount (K007), freight, tax.</li>
<li><strong>Access Sequence</strong> — the search strategy: look for a condition record from most specific to most general (e.g. customer+material, then material, then a fallback).</li>
<li><strong>Condition Table</strong> — the key combination a record is stored under.</li>
<li><strong>Pricing Procedure</strong> — the ordered list of condition types that, added up, give the net price. Determined from sales area + customer + document.</li>
</ul>
<pre><code>Condition technique (pricing):
  Pricing Procedure  = ordered list of Condition Types
      Condition Type  -> uses an Access Sequence
          Access Seq  -> tries Condition Tables (specific -> general)
              Table   -> holds Condition Records (the actual amounts)

Net price = PR00 (base) - K007 (discount) + freight + tax</code></pre>
<h3>Output determination — same engine, different result</h3>
<p><strong>Output determination</strong> decides which document (order confirmation, invoice) is printed, emailed or sent as EDI, using the very same condition technique — an output type, an access sequence and an output procedure.</p>
<div class="callout"><span class="badge">Learn one, know four</span> Pricing, output, account determination and text determination all reuse the condition technique. Master the pattern, not four separate features.</div>`,
    `<span class="eyebrow">SAP321 · Chương 4 · Bài 4.1</span>
<h2>Cấu hình MM &amp; SD: condition technique</h2>
<p>Cả giá mua (MM) lẫn giá bán (SD) — và cả <em>output</em> như in hoá đơn — đều do một cơ chế chung điều khiển: <strong>condition technique</strong>. Học một lần, gặp ở khắp nơi.</p>
<h3>Các khối dựng nên pricing</h3>
<ul>
<li><strong>Condition Type</strong> — một thành phần giá: giá gốc (PR00), chiết khấu (K007), cước, thuế.</li>
<li><strong>Access Sequence</strong> — chiến lược tìm: tìm condition record từ cụ thể nhất đến tổng quát nhất (vd khách+vật tư, rồi vật tư, rồi mức dự phòng).</li>
<li><strong>Condition Table</strong> — tổ hợp khoá mà một record được lưu theo.</li>
<li><strong>Pricing Procedure</strong> — danh sách có thứ tự các condition type, cộng lại thành giá net. Được xác định từ sales area + khách hàng + loại chứng từ.</li>
</ul>
<pre><code>Condition technique (pricing):
  Pricing Procedure  = danh sách Condition Type có thứ tự
      Condition Type  -> dùng một Access Sequence
          Access Seq  -> thử các Condition Table (cụ thể -> tổng quát)
              Table   -> chứa Condition Record (số tiền thực tế)

Giá net = PR00 (gốc) - K007 (chiết khấu) + cước + thuế</code></pre>
<h3>Output determination — cùng cơ chế, kết quả khác</h3>
<p><strong>Output determination</strong> quyết định chứng từ nào (xác nhận đơn, hoá đơn) được in, gửi email hay gửi EDI, dùng đúng condition technique — một output type, một access sequence và một output procedure.</p>
<div class="callout"><span class="badge">Học một, biết bốn</span> Pricing, output, account determination và text determination đều dùng lại condition technique. Nắm cái mẫu, đừng học bốn tính năng rời.</div>`,
  ]]);

const c4q = quiz('sap321-quiz-4', 'Quiz 4 — MM/SD config|||Quiz 4 — Cấu hình MM/SD', [
  { id: 'q1', question: 'Cơ chế chung điều khiển pricing, output, account determination trong MM/SD gọi là?', options: ['Condition technique', 'Enterprise structure', 'Fiscal year variant', 'Transport request'], correctIndex: 0, explanation: 'Condition technique là engine dùng chung; học một lần dùng cho nhiều tính năng.' },
  { id: 'q2', question: 'Thành phần nào là "danh sách có thứ tự các condition type" cộng lại thành giá net?', options: ['Access Sequence', 'Condition Table', 'Pricing Procedure', 'Condition Record'], correctIndex: 2, explanation: 'Pricing Procedure là danh sách condition type có thứ tự; tổng của chúng ra giá net.' },
  { id: 'q3', question: 'Access Sequence tìm condition record theo thứ tự nào?', options: ['Từ tổng quát đến cụ thể', 'Từ cụ thể nhất đến tổng quát nhất', 'Ngẫu nhiên', 'Theo bảng chữ cái'], correctIndex: 1, explanation: 'Access sequence thử từ tổ hợp khoá cụ thể nhất xuống tổng quát, lấy record khớp đầu tiên.' },
]);

const c5 = doc('sap321-5-1-authorization-workflow', '5.1 — Authorization & workflow|||5.1 — Phân quyền & workflow',
  'Mô hình phân quyền SAP: authorization object → authorization field → role (PFCG) → profile → user; nguyên tắc least privilege và SoD; và SAP Business Workflow tự động hoá quy trình phê duyệt.',
  [[
    `<span class="eyebrow">SAP321 · Chapter 5 · Lesson 5.1</span>
<h2>Authorization &amp; workflow</h2>
<h3>How SAP decides "may this user do this?"</h3>
<p>Every protected action checks an <strong>authorization object</strong> with its fields against what the user carries. Authorizations are bundled into <strong>roles</strong> (built in transaction <code>PFCG</code>), which generate <strong>profiles</strong> that are assigned to users.</p>
<pre><code>Authorization model (bottom-up):
  Authorization Object (e.g. F_BKPF_BUK = post in company code)
      + Fields (activity = 01 create, BUKRS = company code 1000)
  -> collected into a Role (PFCG)  -> menu + authorizations
  -> generates a Profile
  -> Profile assigned to User

Role types:
  Single role     -> one set of transactions + authorizations
  Composite role  -> a bundle of single roles for a job function</code></pre>
<h3>Two principles you must enforce</h3>
<ul>
<li><strong>Least privilege</strong> — give exactly the access a job needs, no more.</li>
<li><strong>Segregation of Duties (SoD)</strong> — no single user should both create a vendor and pay it; split conflicting duties to prevent fraud.</li>
</ul>
<h3>SAP Business Workflow</h3>
<p><strong>Workflow</strong> automates a business process: when an event fires (a leave request is created), it routes work items to the right approver, escalates on delay, and records the outcome — turning a manual email chain into a controlled, auditable flow.</p>
<div class="callout"><span class="badge">Roles are a project</span> Designing the role catalog (who does what) is one of the largest and most security-sensitive parts of any SAP implementation — and where SoD audits live.</div>`,
    `<span class="eyebrow">SAP321 · Chương 5 · Bài 5.1</span>
<h2>Phân quyền &amp; workflow</h2>
<h3>SAP quyết định "người này được làm việc này không?" ra sao</h3>
<p>Mỗi thao tác được bảo vệ sẽ kiểm một <strong>authorization object</strong> cùng các trường của nó so với thứ người dùng mang. Quyền được gói vào <strong>role</strong> (dựng trong transaction <code>PFCG</code>), role sinh ra <strong>profile</strong> gán cho người dùng.</p>
<pre><code>Mô hình phân quyền (từ dưới lên):
  Authorization Object (vd F_BKPF_BUK = ghi sổ trong company code)
      + Field (activity = 01 tạo, BUKRS = company code 1000)
  -> gom vào một Role (PFCG)  -> menu + quyền
  -> sinh ra một Profile
  -> Profile gán cho User

Loại role:
  Single role     -> một tập transaction + quyền
  Composite role  -> gói nhiều single role cho một vị trí công việc</code></pre>
<h3>Hai nguyên tắc phải giữ</h3>
<ul>
<li><strong>Least privilege</strong> — cấp đúng quyền công việc cần, không hơn.</li>
<li><strong>Segregation of Duties (SoD)</strong> — không một người vừa tạo nhà cung cấp vừa thanh toán cho họ; tách các nhiệm vụ xung đột để chống gian lận.</li>
</ul>
<h3>SAP Business Workflow</h3>
<p><strong>Workflow</strong> tự động hoá quy trình nghiệp vụ: khi một sự kiện phát sinh (một đơn xin nghỉ được tạo), nó đưa work item tới đúng người duyệt, leo thang khi chậm, và ghi lại kết quả — biến chuỗi email thủ công thành luồng có kiểm soát, truy vết được.</p>
<div class="callout"><span class="badge">Role là cả một dự án</span> Thiết kế danh mục role (ai làm gì) là một trong những phần lớn và nhạy cảm bảo mật nhất của mọi dự án SAP — và là nơi kiểm toán SoD diễn ra.</div>`,
  ]]);

const c5q = quiz('sap321-quiz-5', 'Quiz 5 — Authorization & workflow|||Quiz 5 — Phân quyền & workflow', [
  { id: 'q1', question: 'Transaction nào dùng để tạo và bảo trì role trong SAP?', options: ['SU01', 'PFCG', 'SPRO', 'SE16'], correctIndex: 1, explanation: 'PFCG (Role Maintenance) là nơi dựng role, gán transaction và authorization, rồi sinh profile.' },
  { id: 'q2', question: 'Nguyên tắc "không một người vừa tạo nhà cung cấp vừa thanh toán cho họ" gọi là?', options: ['Least privilege', 'Segregation of Duties (SoD)', 'Single sign-on', 'Transport control'], correctIndex: 1, explanation: 'Segregation of Duties tách các nhiệm vụ xung đột để chống gian lận.' },
  { id: 'q3', question: 'SAP Business Workflow chủ yếu dùng để làm gì?', options: ['Tính giá bán hàng', 'Tự động hoá quy trình phê duyệt và định tuyến work item', 'Tạo chart of accounts', 'Chuyển transport giữa các hệ thống'], correctIndex: 1, explanation: 'Workflow định tuyến work item tới đúng người duyệt, leo thang khi chậm và ghi lại kết quả.' },
]);

const c6 = doc('sap321-6-1-integration', '6.1 — Integrating SAP with external systems|||6.1 — Tích hợp SAP với hệ thống ngoài',
  'Các cách nối SAP với hệ thống ngoài: IDoc (EDI, bất đồng bộ, theo message type/partner profile), BAPI/RFC (đồng bộ, hàm nghiệp vụ), OData/REST API (Fiori, SAP Gateway), và vai trò middleware (SAP PI/PO, Integration Suite).',
  [[
    `<span class="eyebrow">SAP321 · Chapter 6 · Lesson 6.1</span>
<h2>Integrating SAP with external systems</h2>
<p>Real landscapes are never SAP-only. You must connect SAP to banks, e-commerce, logistics providers and other apps. SAP offers several integration technologies — pick by whether you need <em>synchronous</em> (wait for an answer) or <em>asynchronous</em> (fire-and-forget) exchange.</p>
<h3>The main integration technologies</h3>
<ul>
<li><strong>IDoc (Intermediate Document)</strong> — a structured message for <em>asynchronous</em> exchange (classic EDI: orders, invoices). Driven by message type, basic type and <strong>partner profiles</strong>.</li>
<li><strong>BAPI / RFC</strong> — a <em>synchronous</em> call into a business function (Remote Function Call). A BAPI is a stable, published business API (e.g. create a sales order).</li>
<li><strong>OData / REST API</strong> — modern HTTP services exposed via SAP Gateway; the technology behind Fiori apps and outside web/mobile clients.</li>
<li><strong>Web services (SOAP)</strong> — standards-based service calls, often through middleware.</li>
</ul>
<pre><code>Choosing an integration style:
  Bulk, batch, EDI, no immediate reply   -> IDoc (asynchronous)
  Call one business function, need result -> BAPI/RFC (synchronous)
  Web/mobile, Fiori, lightweight JSON     -> OData / REST
  Many systems, mapping, routing          -> middleware

Middleware layer:
  SAP PI/PO  or  SAP Integration Suite (Cloud)
    -> connect, transform &amp; route between SAP and non-SAP</code></pre>
<div class="callout"><span class="badge">Sync vs. async</span> The first design question is almost always: does the caller need an immediate answer (synchronous BAPI/OData) or can the message be queued and processed later (asynchronous IDoc)? That choice shapes error handling and monitoring.</div>`,
    `<span class="eyebrow">SAP321 · Chương 6 · Bài 6.1</span>
<h2>Tích hợp SAP với hệ thống ngoài</h2>
<p>Landscape thực tế không bao giờ chỉ có SAP. Bạn phải nối SAP với ngân hàng, thương mại điện tử, đơn vị logistics và ứng dụng khác. SAP có nhiều công nghệ tích hợp — chọn theo việc bạn cần trao đổi <em>đồng bộ</em> (chờ trả lời) hay <em>bất đồng bộ</em> (gửi rồi thôi).</p>
<h3>Các công nghệ tích hợp chính</h3>
<ul>
<li><strong>IDoc (Intermediate Document)</strong> — bản tin có cấu trúc cho trao đổi <em>bất đồng bộ</em> (EDI cổ điển: đơn hàng, hoá đơn). Điều khiển bằng message type, basic type và <strong>partner profile</strong>.</li>
<li><strong>BAPI / RFC</strong> — lời gọi <em>đồng bộ</em> vào một hàm nghiệp vụ (Remote Function Call). BAPI là một API nghiệp vụ ổn định, công bố sẵn (vd tạo đơn bán hàng).</li>
<li><strong>OData / REST API</strong> — dịch vụ HTTP hiện đại phát qua SAP Gateway; công nghệ đứng sau app Fiori và client web/mobile bên ngoài.</li>
<li><strong>Web service (SOAP)</strong> — lời gọi dịch vụ theo chuẩn, thường qua middleware.</li>
</ul>
<pre><code>Chọn kiểu tích hợp:
  Khối lượng lớn, batch, EDI, không cần trả lời ngay -> IDoc (bất đồng bộ)
  Gọi một hàm nghiệp vụ, cần kết quả                 -> BAPI/RFC (đồng bộ)
  Web/mobile, Fiori, JSON nhẹ                        -> OData / REST
  Nhiều hệ thống, mapping, định tuyến                -> middleware

Lớp middleware:
  SAP PI/PO  hoặc  SAP Integration Suite (Cloud)
    -> nối, biến đổi &amp; định tuyến giữa SAP và non-SAP</code></pre>
<div class="callout"><span class="badge">Đồng bộ vs. bất đồng bộ</span> Câu hỏi thiết kế đầu tiên gần như luôn là: bên gọi có cần trả lời ngay (BAPI/OData đồng bộ) hay bản tin có thể xếp hàng xử lý sau (IDoc bất đồng bộ)? Lựa chọn đó định hình cách xử lý lỗi và giám sát.</div>`,
  ]]);

const c6q = quiz('sap321-quiz-6', 'Quiz 6 — Integration|||Quiz 6 — Tích hợp', [
  { id: 'q1', question: 'Công nghệ nào phù hợp trao đổi EDI bất đồng bộ (đơn hàng, hoá đơn) giữa SAP và đối tác?', options: ['BAPI/RFC', 'IDoc', 'OData đồng bộ', 'Transport request'], correctIndex: 1, explanation: 'IDoc là bản tin có cấu trúc cho trao đổi bất đồng bộ, điều khiển qua message type và partner profile.' },
  { id: 'q2', question: 'BAPI/RFC khác IDoc chủ yếu ở điểm nào?', options: ['BAPI là lời gọi đồng bộ vào hàm nghiệp vụ, cần kết quả trả về', 'BAPI chỉ dùng cho báo cáo', 'BAPI luôn bất đồng bộ', 'BAPI thay thế enterprise structure'], correctIndex: 0, explanation: 'BAPI/RFC là lời gọi đồng bộ vào một hàm nghiệp vụ ổn định và trả kết quả; IDoc là bất đồng bộ.' },
  { id: 'q3', question: 'Công nghệ nào đứng sau các app SAP Fiori và client web/mobile bên ngoài?', options: ['IDoc', 'OData / REST qua SAP Gateway', 'SOAP batch', 'Cost center hierarchy'], correctIndex: 1, explanation: 'OData/REST phát qua SAP Gateway là nền của Fiori và tích hợp web/mobile hiện đại.' },
]);

const c7 = doc('sap321-7-1-analytics-bw', '7.1 — SAP Analytics, reporting & SAP BW basics|||7.1 — SAP Analytics, reporting & SAP BW cơ bản',
  'Từ báo cáo vận hành (SAP Query, ALV, Fiori embedded analytics/CDS) đến kho dữ liệu SAP BW/BW4HANA (InfoObject, InfoProvider/ADSO, ETL) và tầng phân tích SAP Analytics Cloud (SAC).',
  [[
    `<span class="eyebrow">SAP321 · Chapter 7 · Lesson 7.1</span>
<h2>Analytics, reporting &amp; SAP BW</h2>
<h3>Two kinds of reporting</h3>
<ul>
<li><strong>Operational reporting</strong> — reports on live transaction data inside the ERP: SAP Query, ALV lists, and in S/4HANA <strong>embedded analytics</strong> built on <strong>CDS views</strong> and surfaced as Fiori analytical apps.</li>
<li><strong>Analytical / strategic reporting</strong> — cross-system, historical, aggregated data in a dedicated <strong>data warehouse</strong> (SAP BW / BW/4HANA).</li>
</ul>
<h3>SAP BW building blocks</h3>
<ul>
<li><strong>InfoObject</strong> — the smallest unit: a characteristic (e.g. Customer) or a key figure (e.g. Revenue).</li>
<li><strong>InfoProvider / ADSO (Advanced DataStore Object)</strong> — where data is stored and modeled for reporting.</li>
<li><strong>Extraction / ETL</strong> — data is extracted from source systems, transformed, and loaded into BW.</li>
</ul>
<pre><code>From transaction to insight:
  ERP transaction data (S/4HANA tables)
    -> Extract / Transform / Load (ETL)   [BW / BW4HANA]
    -> InfoProvider (ADSO) modeled by InfoObjects
    -> Query
    -> SAP Analytics Cloud (SAC) dashboards / stories

Or, for real-time operational KPIs:
  CDS view (in S/4HANA) -> Fiori analytical app  (no separate warehouse)</code></pre>
<div class="callout"><span class="badge">Where should the report live?</span> Live, single-system KPIs → embedded analytics (CDS + Fiori). Historical, cross-source, heavy aggregation → a data warehouse (BW) feeding SAP Analytics Cloud.</div>`,
    `<span class="eyebrow">SAP321 · Chương 7 · Bài 7.1</span>
<h2>Analytics, báo cáo &amp; SAP BW</h2>
<h3>Hai kiểu báo cáo</h3>
<ul>
<li><strong>Báo cáo vận hành</strong> — báo cáo trên dữ liệu giao dịch sống trong ERP: SAP Query, danh sách ALV, và trong S/4HANA là <strong>embedded analytics</strong> dựng trên <strong>CDS view</strong> và hiển thị dưới dạng app phân tích Fiori.</li>
<li><strong>Báo cáo phân tích / chiến lược</strong> — dữ liệu xuyên hệ thống, lịch sử, đã tổng hợp trong một <strong>kho dữ liệu</strong> riêng (SAP BW / BW/4HANA).</li>
</ul>
<h3>Các khối dựng nên SAP BW</h3>
<ul>
<li><strong>InfoObject</strong> — đơn vị nhỏ nhất: một characteristic (vd Khách hàng) hoặc một key figure (vd Doanh thu).</li>
<li><strong>InfoProvider / ADSO (Advanced DataStore Object)</strong> — nơi dữ liệu được lưu và mô hình hoá để báo cáo.</li>
<li><strong>Extraction / ETL</strong> — dữ liệu được rút từ hệ nguồn, biến đổi, và nạp vào BW.</li>
</ul>
<pre><code>Từ giao dịch đến thông tin:
  Dữ liệu giao dịch ERP (bảng S/4HANA)
    -> Extract / Transform / Load (ETL)   [BW / BW4HANA]
    -> InfoProvider (ADSO) mô hình bằng InfoObject
    -> Query
    -> SAP Analytics Cloud (SAC): dashboard / story

Hoặc, cho KPI vận hành thời gian thực:
  CDS view (trong S/4HANA) -> app phân tích Fiori  (không cần kho riêng)</code></pre>
<div class="callout"><span class="badge">Báo cáo nên nằm ở đâu?</span> KPI sống, một hệ thống → embedded analytics (CDS + Fiori). Dữ liệu lịch sử, xuyên nguồn, tổng hợp nặng → kho dữ liệu (BW) nuôi SAP Analytics Cloud.</div>`,
  ]]);

const c7q = quiz('sap321-quiz-7', 'Quiz 7 — Analytics & BW|||Quiz 7 — Analytics & BW', [
  { id: 'q1', question: 'Trong S/4HANA, embedded analytics (báo cáo vận hành thời gian thực) chủ yếu dựng trên gì?', options: ['IDoc', 'CDS view hiển thị qua app Fiori', 'Transport request', 'Partner profile'], correctIndex: 1, explanation: 'Embedded analytics dùng CDS view trên dữ liệu sống, hiển thị dưới dạng app phân tích Fiori, không cần kho riêng.' },
  { id: 'q2', question: 'Trong SAP BW, đơn vị nhỏ nhất mô tả một characteristic (vd Khách hàng) hoặc key figure (vd Doanh thu) gọi là?', options: ['InfoObject', 'Cost Center', 'Pricing Procedure', 'Company Code'], correctIndex: 0, explanation: 'InfoObject là đơn vị nhỏ nhất trong BW — characteristic hoặc key figure.' },
  { id: 'q3', question: 'Khi nào nên dùng kho dữ liệu (SAP BW) thay vì báo cáo ngay trên ERP?', options: ['Khi cần KPI sống của một hệ thống', 'Khi cần dữ liệu lịch sử, xuyên nhiều nguồn, tổng hợp nặng', 'Khi in một hoá đơn', 'Khi tạo một role mới'], correctIndex: 1, explanation: 'BW hợp cho dữ liệu lịch sử, xuyên nguồn, tổng hợp nặng; báo cáo sống một hệ thống thì dùng embedded analytics.' },
]);

const c8 = doc('sap321-8-1-sap-activate-migration', '8.1 — SAP Activate, S/4HANA migration & project management|||8.1 — SAP Activate, migration S/4HANA & quản trị dự án',
  'Phương pháp SAP Activate (Discover→Prepare→Explore→Realize→Deploy→Run) dựa trên best-practice + fit-to-standard; ba con đường lên S/4HANA (greenfield, brownfield, selective); và quản trị dự án SAP.',
  [[
    `<span class="eyebrow">SAP321 · Chapter 8 · Lesson 8.1</span>
<h2>SAP Activate, S/4HANA migration &amp; project management</h2>
<h3>SAP Activate — the modern implementation methodology</h3>
<p><strong>SAP Activate</strong> combines ready-run <strong>best practices</strong>, guided configuration, and an agile, phased approach. Instead of designing on a blank page, you start from a working model and run <strong>fit-to-standard</strong> workshops: adopt the standard where you can, and document only the true gaps.</p>
<pre><code>SAP Activate phases:
  Discover -> Prepare -> Explore -> Realize -> Deploy -> Run
   |          |          |          |          |         |
  trial    plan, team  fit-to-    build &amp;    cutover,  operate,
  the      &amp; charter   standard   config,    go-live   support,
  value                workshops  test                 optimize</code></pre>
<h3>Three roads to S/4HANA</h3>
<ul>
<li><strong>Greenfield (new implementation)</strong> — start fresh on best practices; re-engineer processes. Cleanest, but re-implements everything.</li>
<li><strong>Brownfield (system conversion)</strong> — convert the existing ERP in place, keeping data &amp; custom code (adapted). Fastest to move, carries old baggage.</li>
<li><strong>Selective / bluefield</strong> — migrate chosen processes and data selectively — a hybrid of the two.</li>
</ul>
<h3>Project management essentials</h3>
<p>An SAP project balances <strong>scope, time, cost and quality</strong>; key disciplines are cutover planning (the switch to go-live), data migration &amp; validation, testing (unit → integration → UAT), organizational change management, and hypercare after go-live.</p>
<div class="callout"><span class="badge">Fit-to-standard, not gap-first</span> The costliest SAP projects are the ones that customize everything. SAP Activate flips the default: adopt the standard, justify every deviation. Less custom code means cheaper upgrades forever.</div>`,
    `<span class="eyebrow">SAP321 · Chương 8 · Bài 8.1</span>
<h2>SAP Activate, migration S/4HANA &amp; quản trị dự án</h2>
<h3>SAP Activate — phương pháp triển khai hiện đại</h3>
<p><strong>SAP Activate</strong> kết hợp <strong>best practice</strong> chạy được sẵn, cấu hình có hướng dẫn, và cách tiếp cận agile theo pha. Thay vì thiết kế trên trang trắng, bạn bắt đầu từ một mô hình đang chạy và chạy workshop <strong>fit-to-standard</strong>: theo chuẩn ở đâu có thể, chỉ ghi lại những khoảng cách thật sự.</p>
<pre><code>Các pha SAP Activate:
  Discover -> Prepare -> Explore -> Realize -> Deploy -> Run
   |          |          |          |          |         |
  dùng thử  lập kế     workshop   xây &amp;      cutover, vận hành,
  giá trị   hoạch,     fit-to-    cấu hình,  go-live  hỗ trợ,
            đội, charter standard  kiểm thử            tối ưu</code></pre>
<h3>Ba con đường lên S/4HANA</h3>
<ul>
<li><strong>Greenfield (triển khai mới)</strong> — làm lại từ đầu trên best practice; tái thiết quy trình. Sạch nhất nhưng phải triển khai lại mọi thứ.</li>
<li><strong>Brownfield (system conversion)</strong> — chuyển đổi ERP hiện có tại chỗ, giữ dữ liệu &amp; mã tuỳ biến (đã điều chỉnh). Nhanh nhất nhưng mang theo "hành lý cũ".</li>
<li><strong>Selective / bluefield</strong> — di chuyển chọn lọc quy trình và dữ liệu — lai giữa hai cách trên.</li>
</ul>
<h3>Cốt lõi quản trị dự án</h3>
<p>Một dự án SAP cân bằng <strong>phạm vi, thời gian, chi phí và chất lượng</strong>; các kỷ luật then chốt gồm lập kế hoạch cutover (thời khắc chuyển sang go-live), migration &amp; kiểm chứng dữ liệu, kiểm thử (unit → integration → UAT), quản trị thay đổi tổ chức, và hypercare sau go-live.</p>
<div class="callout"><span class="badge">Fit-to-standard, không phải gap-first</span> Dự án SAP đắt nhất là dự án tuỳ biến mọi thứ. SAP Activate lật mặc định: theo chuẩn, biện minh cho từng khác biệt. Ít mã tuỳ biến nghĩa là nâng cấp rẻ hơn mãi mãi.</div>`,
  ]]);

const c8q = quiz('sap321-quiz-8', 'Quiz 8 — SAP Activate & migration|||Quiz 8 — SAP Activate & migration', [
  { id: 'q1', question: 'Thứ tự đúng của các pha SAP Activate là?', options: ['Prepare → Discover → Realize → Explore → Deploy → Run', 'Discover → Prepare → Explore → Realize → Deploy → Run', 'Explore → Deploy → Realize → Run → Prepare → Discover', 'Realize → Prepare → Discover → Deploy → Explore → Run'], correctIndex: 1, explanation: 'SAP Activate: Discover → Prepare → Explore → Realize → Deploy → Run.' },
  { id: 'q2', question: 'Con đường lên S/4HANA nào chuyển đổi hệ thống ERP hiện có tại chỗ, giữ lại dữ liệu và mã tuỳ biến?', options: ['Greenfield (triển khai mới)', 'Brownfield (system conversion)', 'Bỏ hết làm lại từ giấy trắng', 'Chỉ dùng embedded analytics'], correctIndex: 1, explanation: 'Brownfield = system conversion: chuyển đổi tại chỗ, giữ dữ liệu và custom code đã điều chỉnh.' },
  { id: 'q3', question: 'Nguyên tắc "fit-to-standard" của SAP Activate khuyến nghị điều gì?', options: ['Tuỳ biến mọi thứ theo yêu cầu', 'Theo chuẩn tối đa, chỉ biện minh cho khác biệt thật sự cần', 'Không kiểm thử trước go-live', 'Cấu hình thẳng trên Production'], correctIndex: 1, explanation: 'Fit-to-standard: adopt standard, ghi lại đúng khoảng cách thật; ít custom code → nâng cấp rẻ hơn.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'SAP321',
    slug: 'sap321-sap-general-2',
    title: 'SAP General 2',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SAP321.webp',
    shortDescription: 'Advanced SAP ERP config & deployment — Customizing/IMG, enterprise structure, FI/CO & MM/SD, authorization & workflow, integration (IDoc/BAPI/API), SAP Analytics/BW, SAP Activate & S/4HANA migration. Bilingual, config tables & quizzes.|||Cấu hình & triển khai SAP ERP nâng cao — Customizing/IMG, enterprise structure, FI/CO & MM/SD, phân quyền & workflow, tích hợp (IDoc/BAPI/API), SAP Analytics/BW, SAP Activate & migration S/4HANA. Song ngữ, có bảng cấu hình & quiz.',
    description: 'Môn <strong>SAP321 — SAP General 2</strong> (kỳ 7, ngành Hệ thống thông tin) tiếp nối SAP311, chuyển từ "dùng SAP" sang <strong>cấu hình &amp; triển khai SAP ERP / S/4HANA</strong>. Lộ trình: <strong>Customizing &amp; IMG</strong> (SPRO, transport) → <strong>enterprise structure</strong> → <strong>cấu hình FI/CO nâng cao</strong> (chart of accounts, cost center) → <strong>cấu hình MM/SD</strong> (pricing, output) → <strong>phân quyền &amp; workflow</strong> → <strong>tích hợp</strong> (IDoc/BAPI/API, middleware) → <strong>SAP Analytics, reporting &amp; BW</strong> → <strong>SAP Activate &amp; migration S/4HANA</strong>. Bám giáo trình SAP Press &amp; SAP Activate, song ngữ, có bảng cấu hình và quiz mỗi chương.',
    whatYouLearn: 'Customizing/IMG (SPRO), client & transport (DEV→QAS→PRD); enterprise structure (company code, controlling area, plant, sales area); cấu hình FI/CO (chart of accounts, fiscal year variant, cost element/center); cấu hình MM/SD & condition technique (pricing procedure, output determination); mô hình phân quyền (authorization object, role/PFCG, SoD) & SAP Business Workflow; tích hợp IDoc/BAPI/RFC/OData & middleware; analytics (CDS/Fiori, SAP BW, SAC); phương pháp SAP Activate & ba con đường migration S/4HANA.',
    requirements: 'Đã học SAP311 (SAP General 1) hoặc nắm cơ bản về ERP và các phân hệ SAP (FI, CO, MM, SD). Xem điều kiện tiên quyết trong khung chương trình ngành Hệ thống thông tin trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách SAP Press, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ dùng SAP sang cấu hình & triển khai SAP; Customizing là ý xuyên suốt.', lessons: [intro] },
    { title: 'Chương 1 — Customizing & IMG|||Chapter 1 — Customizing & IMG', description: 'SPRO, client, Customizing vs. Workbench, transport DEV→QAS→PRD.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Enterprise Structure|||Chapter 2 — Enterprise structure', description: 'Company code, controlling area, plant, sales area; define & assign.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cấu hình FI/CO|||Chapter 3 — FI/CO config', description: 'Chart of accounts, fiscal year variant, cost element/center.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cấu hình MM/SD|||Chapter 4 — MM/SD config', description: 'Condition technique: pricing procedure, access sequence, output.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân quyền & Workflow|||Chapter 5 — Authorization & workflow', description: 'Authorization object, role/PFCG, SoD, SAP Business Workflow.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tích hợp hệ thống ngoài|||Chapter 6 — Integration', description: 'IDoc, BAPI/RFC, OData/REST, middleware; đồng bộ vs. bất đồng bộ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Analytics, báo cáo & BW|||Chapter 7 — Analytics & BW', description: 'Embedded analytics (CDS/Fiori), SAP BW (InfoObject/ADSO), SAC.', lessons: [c7, c7q] },
    { title: 'Chương 8 — SAP Activate & migration|||Chapter 8 — SAP Activate & migration', description: 'SAP Activate 6 pha, ba con đường lên S/4HANA, quản trị dự án.', lessons: [c8, c8q] },
  ],
};
