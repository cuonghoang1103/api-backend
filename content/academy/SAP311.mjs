/**
 * SAP311 — SAP General 1. Tổng quan hệ thống SAP ERP (phần 1: nền tảng &
 * các phân hệ). Ngành Hệ thống thông tin, kỳ 7 FPTU. Giáo trình: SAP Press
 * "SAP S/4HANA: An Introduction", "Discover SAP" (Anderson), openSAP,
 * help.sap.com, TERP10. Song ngữ VI+EN. ⚠️ KHÔNG backtick lồng/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sap311-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách SAP Press, tài liệu chính thức miễn phí (openSAP, help.sap.com), YouTube, hệ demo, lộ trình tự học.',
  [[
    `<span class="eyebrow">SAP311 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>SAP General 1</strong> — what an ERP is, the SAP architecture &amp; interfaces, organizational structures, master data, and the core business modules (FI, CO, MM, SD, PP) — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SAP311 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.sap-press.com/sap-s4hana_4499/" target="_blank" rel="noopener"><em>SAP S/4HANA: An Introduction</em> — SAP PRESS</a></li>
<li><a href="https://www.sap-press.com/" target="_blank" rel="noopener"><em>Discover SAP</em> — Anderson (SAP PRESS catalogue)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://open.sap.com/" target="_blank" rel="noopener">openSAP — free online courses from SAP</a></li>
<li><a href="https://help.sap.com/" target="_blank" rel="noopener">SAP Help Portal (help.sap.com)</a></li>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning — TERP10 &amp; role paths</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@SAP" target="_blank" rel="noopener">SAP (official)</a> — product overviews &amp; demos</li>
<li><a href="https://www.youtube.com/results?search_query=sap+fico+tutorial" target="_blank" rel="noopener">SAP FICO / MM / SD tutorials</a> — module walk-throughs</li>
</ul>
<h3>🛠️ Try it</h3>
<ul>
<li><a href="https://www.sap.com/products/erp/s4hana.html" target="_blank" rel="noopener">SAP S/4HANA product page</a> — modules &amp; capabilities</li>
<li><a href="https://learning.sap.com/learning-journeys" target="_blank" rel="noopener">SAP Learning Journeys</a> — guided, hands-on paths</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what ERP solves, SAP history (R/3 → S/4HANA), architecture, SAP GUI vs Fiori, transaction codes.</li>
<li><strong>Structure &amp; data</strong> — organizational units (client, company code, plant) and master data (customer, vendor, material, G/L).</li>
<li><strong>Modules</strong> — FI &amp; CO, MM, SD, PP one at a time; learn the key documents of each.</li>
<li><strong>Integration</strong> — trace procure-to-pay and order-to-cash across modules, then reporting.</li>
</ol></div>`,
    `<span class="eyebrow">SAP311 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>SAP General 1</strong> — ERP là gì, kiến trúc &amp; giao diện SAP, cấu trúc tổ chức, dữ liệu chủ, và các phân hệ nghiệp vụ cốt lõi (FI, CO, MM, SD, PP) — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SAP311 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.sap-press.com/sap-s4hana_4499/" target="_blank" rel="noopener"><em>SAP S/4HANA: An Introduction</em> — SAP PRESS</a></li>
<li><a href="https://www.sap-press.com/" target="_blank" rel="noopener"><em>Discover SAP</em> — Anderson (danh mục SAP PRESS)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://open.sap.com/" target="_blank" rel="noopener">openSAP — khoá học trực tuyến miễn phí của SAP</a></li>
<li><a href="https://help.sap.com/" target="_blank" rel="noopener">Cổng trợ giúp SAP (help.sap.com)</a></li>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning — TERP10 &amp; lộ trình theo vai trò</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@SAP" target="_blank" rel="noopener">SAP (chính thức)</a> — giới thiệu &amp; demo sản phẩm</li>
<li><a href="https://www.youtube.com/results?search_query=sap+fico+tutorial" target="_blank" rel="noopener">Hướng dẫn SAP FICO / MM / SD</a> — đi qua từng phân hệ</li>
</ul>
<h3>🛠️ Trải nghiệm</h3>
<ul>
<li><a href="https://www.sap.com/products/erp/s4hana.html" target="_blank" rel="noopener">Trang sản phẩm SAP S/4HANA</a> — phân hệ &amp; năng lực</li>
<li><a href="https://learning.sap.com/learning-journeys" target="_blank" rel="noopener">SAP Learning Journeys</a> — lộ trình có thực hành</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — ERP giải quyết gì, lịch sử SAP (R/3 → S/4HANA), kiến trúc, SAP GUI so với Fiori, mã giao dịch (transaction code).</li>
<li><strong>Cấu trúc &amp; dữ liệu</strong> — đơn vị tổ chức (client, company code, plant) và dữ liệu chủ (khách hàng, nhà cung cấp, vật tư, G/L).</li>
<li><strong>Phân hệ</strong> — FI &amp; CO, MM, SD, PP lần lượt; nắm các chứng từ chính của từng phân hệ.</li>
<li><strong>Tích hợp</strong> — lần theo procure-to-pay và order-to-cash xuyên các phân hệ, rồi tới báo cáo.</li>
</ol></div>`,
  ]]);

const intro = doc('sap311-0-1-overview', 'Course overview: SAP ERP fundamentals|||Tổng quan: Nền tảng SAP ERP',
  'ERP là gì, vì sao doanh nghiệp cần một hệ thống thống nhất; SAP là ai; lộ trình môn: nền tảng & kiến trúc → tổ chức & dữ liệu chủ → các phân hệ FI/CO/MM/SD/PP → tích hợp & báo cáo.',
  [[
    `<span class="eyebrow">SAP311 · Lesson 0.1 · Overview</span>
<h2>SAP ERP fundamentals</h2>
<p class="lead">This course helps you understand <strong>how a company runs on SAP</strong>. <strong>ERP (Enterprise Resource Planning)</strong> is one integrated system that manages finance, purchasing, sales, production and inventory on a <em>single shared database</em> — so a sale, the stock it consumes and the accounting entry it creates are all the same connected data, entered once.</p>
<h3>Why ERP?</h3>
<ul>
<li><strong>One source of truth</strong> — every department reads and writes the same data; no re-keying between islands.</li>
<li><strong>Real-time integration</strong> — a goods receipt in the warehouse instantly updates inventory <em>and</em> accounting.</li>
<li><strong>Standard best practice</strong> — proven business processes built into the software.</li>
</ul>
<h3>Who is SAP?</h3>
<p><strong>SAP</strong> is a German company (founded 1972) and the market leader in enterprise software. Its ERP has evolved <strong>R/2 → R/3 → SAP ERP (ECC) → SAP S/4HANA</strong>, the current in-memory generation.</p>
<h3>Roadmap</h3>
<p>Foundations &amp; architecture → organizational structures &amp; master data → the core modules (FI, CO, MM, SD, PP) → cross-module integration (procure-to-pay, order-to-cash) &amp; reporting. Bilingual, with process diagrams, module tables and transaction codes; a quiz each chapter.</p>`,
    `<span class="eyebrow">SAP311 · Bài 0.1 · Tổng quan</span>
<h2>Nền tảng SAP ERP</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>một doanh nghiệp vận hành trên SAP thế nào</strong>. <strong>ERP (Hoạch định nguồn lực doanh nghiệp)</strong> là một hệ thống tích hợp duy nhất quản lý tài chính, mua hàng, bán hàng, sản xuất và kho trên <em>một cơ sở dữ liệu dùng chung</em> — nên một đơn bán, lượng tồn nó tiêu hao và bút toán kế toán nó tạo ra đều là cùng một khối dữ liệu nối liền, nhập một lần.</p>
<h3>Vì sao cần ERP?</h3>
<ul>
<li><strong>Một nguồn sự thật</strong> — mọi phòng ban đọc và ghi cùng dữ liệu; không nhập lại giữa các ốc đảo.</li>
<li><strong>Tích hợp thời gian thực</strong> — một lần nhập kho lập tức cập nhật tồn kho <em>và</em> kế toán.</li>
<li><strong>Chuẩn thực hành tốt</strong> — các quy trình nghiệp vụ đã kiểm chứng được dựng sẵn trong phần mềm.</li>
</ul>
<h3>SAP là ai?</h3>
<p><strong>SAP</strong> là công ty Đức (thành lập 1972), dẫn đầu thị trường phần mềm doanh nghiệp. ERP của họ tiến hoá <strong>R/2 → R/3 → SAP ERP (ECC) → SAP S/4HANA</strong>, thế hệ in-memory hiện tại.</p>
<h3>Lộ trình</h3>
<p>Nền tảng &amp; kiến trúc → cấu trúc tổ chức &amp; dữ liệu chủ → các phân hệ cốt lõi (FI, CO, MM, SD, PP) → tích hợp liên phân hệ (procure-to-pay, order-to-cash) &amp; báo cáo. Song ngữ, có sơ đồ quy trình, bảng phân hệ và mã giao dịch; quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('sap311-1-1-erp-and-sap', '1.1 — ERP overview & the SAP story (R/3 → S/4HANA)|||1.1 — Tổng quan ERP & câu chuyện SAP (R/3 → S/4HANA)',
  'ERP là gì và lợi ích; lịch sử SAP: R/2 → R/3 (client-server) → SAP ERP ECC → S/4HANA (nền HANA in-memory, Fiori); ERP so với phần mềm rời rạc.',
  [[
    `<span class="eyebrow">SAP311 · Chapter 1 · Lesson 1.1</span>
<h2>ERP overview &amp; the SAP story</h2>
<h3>From data islands to one system</h3>
<p>Before ERP, each department ran its own software: sales in one tool, accounting in another, the warehouse in a third. The same order was typed three times, and the numbers disagreed. <strong>ERP</strong> replaces those islands with one integrated system on a shared database — enter data once, everyone sees it.</p>
<h3>The SAP evolution</h3>
<pre><code>1972  SAP founded (Germany)
R/2   -> mainframe ERP
R/3   -> client-server, 3-tier (early 1990s) - the classic SAP
ECC   -> "SAP ERP Central Component" (SAP ERP 6.0)
S/4HANA -> runs on the HANA in-memory database
           + Fiori web UI (current generation)
</code></pre>
<h3>Why S/4HANA matters</h3>
<ul>
<li><strong>In-memory (HANA)</strong> — data sits in RAM, so analytics run on live transactional data (no overnight batch).</li>
<li><strong>Simplified data model</strong> — fewer aggregate/index tables; the Universal Journal (table ACDOCA) unifies FI &amp; CO.</li>
<li><strong>Fiori UX</strong> — role-based web/mobile apps replace much of the classic SAP GUI.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> ERP's value is <strong>integration</strong>, not any single feature. S/4HANA is SAP's ERP re-platformed on an in-memory database with a modern UI.</div>`,
    `<span class="eyebrow">SAP311 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan ERP &amp; câu chuyện SAP</h2>
<h3>Từ ốc đảo dữ liệu đến một hệ thống</h3>
<p>Trước ERP, mỗi phòng ban chạy phần mềm riêng: bán hàng một công cụ, kế toán công cụ khác, kho công cụ thứ ba. Cùng một đơn được gõ ba lần, và các con số lệch nhau. <strong>ERP</strong> thay các ốc đảo đó bằng một hệ thống tích hợp trên cơ sở dữ liệu chung — nhập một lần, mọi người cùng thấy.</p>
<h3>Tiến hoá của SAP</h3>
<pre><code>1972  SAP thành lập (Đức)
R/2   -> ERP trên mainframe
R/3   -> client-server, 3 tầng (đầu thập niên 1990) - SAP kinh điển
ECC   -> "SAP ERP Central Component" (SAP ERP 6.0)
S/4HANA -> chạy trên CSDL in-memory HANA
           + giao diện web Fiori (thế hệ hiện tại)
</code></pre>
<h3>Vì sao S/4HANA quan trọng</h3>
<ul>
<li><strong>In-memory (HANA)</strong> — dữ liệu nằm trong RAM, nên phân tích chạy ngay trên dữ liệu giao dịch sống (không cần batch qua đêm).</li>
<li><strong>Mô hình dữ liệu tinh gọn</strong> — bớt bảng tổng hợp/chỉ mục; Universal Journal (bảng ACDOCA) hợp nhất FI &amp; CO.</li>
<li><strong>Trải nghiệm Fiori</strong> — ứng dụng web/di động theo vai trò thay phần lớn SAP GUI kinh điển.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Giá trị của ERP là <strong>tích hợp</strong>, không phải một tính năng đơn lẻ. S/4HANA là ERP của SAP được dựng lại trên CSDL in-memory với giao diện hiện đại.</div>`,
  ]]);

const c1q = quiz('sap311-quiz-1', 'Quiz 1 — ERP & SAP history|||Quiz 1 — ERP & lịch sử SAP', [
  { id: 'q1', question: 'Giá trị cốt lõi mà ERP mang lại so với các phần mềm rời rạc là?', options: ['Giá rẻ hơn', 'Tích hợp trên một cơ sở dữ liệu dùng chung', 'Chạy offline', 'Chỉ dành cho kế toán'], correctIndex: 1, explanation: 'ERP nối các phòng ban trên một CSDL chung — nhập một lần, mọi người cùng thấy; tích hợp là giá trị cốt lõi.' },
  { id: 'q2', question: 'Thế hệ ERP hiện tại của SAP, chạy trên cơ sở dữ liệu in-memory, tên là?', options: ['R/2', 'R/3', 'SAP S/4HANA', 'SAP B1'], correctIndex: 2, explanation: 'S/4HANA chạy trên CSDL in-memory HANA, đi kèm giao diện Fiori; đây là thế hệ hiện tại.' },
  { id: 'q3', question: 'Kiến trúc client-server 3 tầng kinh điển gắn với phiên bản nào của SAP?', options: ['R/3', 'S/4HANA', 'HANA Cloud', 'Fiori'], correctIndex: 0, explanation: 'R/3 (đầu 1990s) là bản client-server 3 tầng kinh điển, khác R/2 chạy trên mainframe.' },
]);

const c2 = doc('sap311-2-1-architecture-ui', '2.1 — SAP architecture & interfaces (GUI, Fiori, T-codes)|||2.1 — Kiến trúc SAP & giao diện (GUI, Fiori, T-code)',
  'Kiến trúc 3 tầng (presentation/application/database); SAP GUI so với Fiori; transaction code (T-code) và cách điều hướng; menu SAP Easy Access.',
  [[
    `<span class="eyebrow">SAP311 · Chapter 2 · Lesson 2.1</span>
<h2>SAP architecture &amp; interfaces</h2>
<h3>The classic three-tier architecture</h3>
<pre><code>Presentation layer  -> SAP GUI / Fiori (what the user sees)
Application layer   -> ABAP work processes (business logic)
Database layer      -> HANA / classic DB (stores all data)
</code></pre>
<p>Splitting the system into three tiers lets many users share one application server and one database, and lets each layer scale on its own.</p>
<h3>Two front ends</h3>
<ul>
<li><strong>SAP GUI</strong> — the classic desktop client; you navigate the <em>SAP Easy Access</em> menu tree or type transaction codes.</li>
<li><strong>SAP Fiori</strong> — modern, role-based web/mobile apps shown as tiles on the Fiori Launchpad; the direction for S/4HANA.</li>
</ul>
<h3>Transaction codes (T-codes)</h3>
<p>A <strong>transaction code</strong> is a shortcut typed in the command field to jump straight to a task, faster than clicking through menus.</p>
<pre><code>Field in the command box:
  /n<code>   -> start a transaction in the same window
  /o<code>   -> open it in a new window
Examples:
  SU01  -> user maintenance
  ME21N -> create purchase order (MM)
  VA01  -> create sales order (SD)
  FB50  -> post a G/L document (FI)
</code></pre>
<div class="callout"><span class="badge">Tip</span> Learn the T-code for the tasks you use most — experienced SAP users type codes instead of navigating menus, and every screen shows its own code in the status bar.</div>`,
    `<span class="eyebrow">SAP311 · Chương 2 · Bài 2.1</span>
<h2>Kiến trúc SAP &amp; giao diện</h2>
<h3>Kiến trúc ba tầng kinh điển</h3>
<pre><code>Tầng trình bày   -> SAP GUI / Fiori (người dùng nhìn thấy)
Tầng ứng dụng    -> tiến trình ABAP (logic nghiệp vụ)
Tầng CSDL        -> HANA / CSDL kinh điển (lưu mọi dữ liệu)
</code></pre>
<p>Tách hệ thống thành ba tầng cho nhiều người dùng chia sẻ một máy chủ ứng dụng và một CSDL, đồng thời mỗi tầng mở rộng độc lập.</p>
<h3>Hai giao diện đầu cuối</h3>
<ul>
<li><strong>SAP GUI</strong> — client máy để bàn kinh điển; bạn đi theo cây menu <em>SAP Easy Access</em> hoặc gõ mã giao dịch.</li>
<li><strong>SAP Fiori</strong> — ứng dụng web/di động hiện đại theo vai trò, hiện dạng ô (tile) trên Fiori Launchpad; hướng đi của S/4HANA.</li>
</ul>
<h3>Mã giao dịch (T-code)</h3>
<p><strong>Mã giao dịch</strong> là lối tắt gõ vào ô lệnh để nhảy thẳng tới một tác vụ, nhanh hơn bấm qua menu.</p>
<pre><code>Ô lệnh trên màn hình:
  /n&lt;mã&gt;   -> mở giao dịch trong cùng cửa sổ
  /o&lt;mã&gt;   -> mở trong cửa sổ mới
Ví dụ:
  SU01  -> quản lý người dùng
  ME21N -> tạo đơn mua hàng (MM)
  VA01  -> tạo đơn bán hàng (SD)
  FB50  -> hạch toán chứng từ G/L (FI)
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Học T-code cho các tác vụ dùng nhiều nhất — người dùng SAP kỳ cựu gõ mã thay vì lần menu, và mỗi màn hình đều hiện mã của chính nó ở thanh trạng thái.</div>`,
  ]]);

const c2q = quiz('sap311-quiz-2', 'Quiz 2 — Architecture & UI|||Quiz 2 — Kiến trúc & giao diện', [
  { id: 'q1', question: 'Trong kiến trúc 3 tầng của SAP, logic nghiệp vụ (ABAP) chạy ở tầng nào?', options: ['Tầng trình bày', 'Tầng ứng dụng', 'Tầng cơ sở dữ liệu', 'Tầng mạng'], correctIndex: 1, explanation: 'Tầng ứng dụng chạy các tiến trình ABAP xử lý logic nghiệp vụ; trình bày là GUI/Fiori, còn dữ liệu nằm ở tầng CSDL.' },
  { id: 'q2', question: 'Giao diện web/di động theo vai trò, hiện dạng ô (tile), là hướng đi của S/4HANA gọi là?', options: ['SAP GUI', 'SAP Fiori', 'SAP Easy Access', 'ABAP'], correctIndex: 1, explanation: 'Fiori là trải nghiệm web/di động theo vai trò trên Fiori Launchpad; SAP GUI là client máy để bàn kinh điển.' },
  { id: 'q3', question: 'Transaction code (T-code) dùng để làm gì?', options: ['Mã hoá dữ liệu', 'Nhảy thẳng tới một tác vụ, nhanh hơn lần menu', 'Đặt mật khẩu', 'Xuất báo cáo PDF'], correctIndex: 1, explanation: 'T-code là lối tắt gõ vào ô lệnh để mở nhanh một giao dịch, vd VA01 tạo đơn bán hàng.' },
]);

const c3 = doc('sap311-3-1-org-structure-master-data', '3.1 — Organizational structures & master data|||3.1 — Cấu trúc tổ chức & dữ liệu chủ',
  'Đơn vị tổ chức: client, company code, plant, storage location, sales org, purchasing org; dữ liệu chủ (master data) so với dữ liệu giao dịch: khách hàng, nhà cung cấp, vật tư, tài khoản G/L.',
  [[
    `<span class="eyebrow">SAP311 · Chapter 3 · Lesson 3.1</span>
<h2>Organizational structures &amp; master data</h2>
<h3>Organizational units — the company modeled in SAP</h3>
<p>SAP represents the real company as a hierarchy of <strong>organizational units</strong>. Every transaction is stamped with the units it belongs to.</p>
<pre><code>Client (mandant)        -> the whole SAP system / legal top level
  Company Code          -> a legal entity that produces financials (FI)
    Plant               -> a location: factory, warehouse, branch (MM/PP)
      Storage Location  -> a stock area within a plant
  Sales Organization    -> sells &amp; is liable for sales (SD)
  Purchasing Org        -> negotiates &amp; procures (MM)
</code></pre>
<h3>Master data vs transaction data</h3>
<ul>
<li><strong>Master data</strong> — long-lived reference data reused across many transactions: <em>customer, vendor, material, G/L account</em>. Created once, maintained centrally.</li>
<li><strong>Transaction data</strong> — the day-to-day events that reference master data: <em>sales orders, purchase orders, invoices, goods movements</em>.</li>
</ul>
<pre><code>Example: a material master is shared by every module
  Basic + Sales views  -> used by SD
  Purchasing view      -> used by MM
  MRP + Work views     -> used by PP
  Accounting view      -> used by FI/CO
One material, many "views" - each module maintains its own.
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Clean master data is the foundation of ERP. If the customer or material master is wrong, every order, invoice and report built on it is wrong too.</div>`,
    `<span class="eyebrow">SAP311 · Chương 3 · Bài 3.1</span>
<h2>Cấu trúc tổ chức &amp; dữ liệu chủ</h2>
<h3>Đơn vị tổ chức — mô hình hoá doanh nghiệp trong SAP</h3>
<p>SAP biểu diễn doanh nghiệp thực thành một cây <strong>đơn vị tổ chức</strong>. Mỗi giao dịch được gắn nhãn các đơn vị mà nó thuộc về.</p>
<pre><code>Client (mandant)          -> toàn hệ thống SAP / cấp cao nhất
  Company Code            -> pháp nhân lập báo cáo tài chính (FI)
    Plant                 -> địa điểm: nhà máy, kho, chi nhánh (MM/PP)
      Storage Location    -> khu vực tồn kho trong một plant
  Sales Organization      -> đơn vị bán &amp; chịu trách nhiệm bán (SD)
  Purchasing Org          -> đơn vị đàm phán &amp; mua (MM)
</code></pre>
<h3>Dữ liệu chủ so với dữ liệu giao dịch</h3>
<ul>
<li><strong>Dữ liệu chủ (master data)</strong> — dữ liệu tham chiếu sống lâu, dùng lại qua nhiều giao dịch: <em>khách hàng, nhà cung cấp, vật tư, tài khoản G/L</em>. Tạo một lần, quản lý tập trung.</li>
<li><strong>Dữ liệu giao dịch</strong> — sự kiện hằng ngày tham chiếu tới dữ liệu chủ: <em>đơn bán, đơn mua, hoá đơn, biến động hàng</em>.</li>
</ul>
<pre><code>Ví dụ: một material master được mọi phân hệ dùng chung
  View Cơ bản + Bán hàng -> SD dùng
  View Mua hàng          -> MM dùng
  View MRP + Sản xuất    -> PP dùng
  View Kế toán           -> FI/CO dùng
Một vật tư, nhiều "view" - mỗi phân hệ giữ phần của mình.
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Dữ liệu chủ sạch là nền của ERP. Nếu master khách hàng hay vật tư sai, mọi đơn hàng, hoá đơn và báo cáo dựng trên nó cũng sai.</div>`,
  ]]);

const c3q = quiz('sap311-quiz-3', 'Quiz 3 — Org & master data|||Quiz 3 — Tổ chức & dữ liệu chủ', [
  { id: 'q1', question: 'Đơn vị tổ chức nào là pháp nhân lập báo cáo tài chính trong SAP?', options: ['Plant', 'Company Code', 'Storage Location', 'Client'], correctIndex: 1, explanation: 'Company Code là pháp nhân độc lập lập bảng cân đối và báo cáo lãi lỗ (FI); plant là địa điểm, client là toàn hệ thống.' },
  { id: 'q2', question: 'Dữ liệu nào sau đây là dữ liệu chủ (master data)?', options: ['Đơn bán hàng', 'Hoá đơn', 'Vật tư (material)', 'Chứng từ nhập kho'], correctIndex: 2, explanation: 'Vật tư, khách hàng, nhà cung cấp, tài khoản G/L là dữ liệu chủ sống lâu; đơn/hoá đơn/nhập kho là dữ liệu giao dịch.' },
  { id: 'q3', question: 'Một material master được nhiều phân hệ dùng chung thông qua cơ chế?', options: ['Nhiều "view" theo phân hệ (bán hàng, mua, kế toán...)', 'Sao chép sang mỗi phân hệ', 'Mỗi phân hệ tạo vật tư riêng', 'Không chia sẻ được'], correctIndex: 0, explanation: 'Một vật tư có nhiều view (Sales, Purchasing, MRP, Accounting...) — mỗi phân hệ duy trì view của mình trên cùng một bản ghi.' },
]);

const c4 = doc('sap311-4-1-fi-co', '4.1 — Financial Accounting (FI) & Controlling (CO)|||4.1 — Phân hệ Tài chính FI & Kế toán quản trị CO',
  'FI: sổ cái G/L, phải thu AR, phải trả AP, tài sản; báo cáo ra bên ngoài. CO: kế toán chi phí nội bộ, cost center, profit center; FI so với CO; Universal Journal (S/4HANA).',
  [[
    `<span class="eyebrow">SAP311 · Chapter 4 · Lesson 4.1</span>
<h2>Financial Accounting (FI) &amp; Controlling (CO)</h2>
<h3>FI — the external books</h3>
<p><strong>FI</strong> records the legal financial position for outside parties (auditors, tax, investors). Its main sub-ledgers:</p>
<pre><code>G/L  General Ledger        -> the master financial record
AP   Accounts Payable      -> what we owe vendors
AR   Accounts Receivable   -> what customers owe us
AA   Asset Accounting      -> fixed assets & depreciation
Bank -> cash & bank statements
Output: Balance Sheet + Profit &amp; Loss statement
</code></pre>
<h3>CO — the internal view</h3>
<p><strong>CO</strong> is for managers, not regulators: it answers <em>where is money made and spent inside the company?</em></p>
<ul>
<li><strong>Cost center</strong> — where costs are incurred (a department, e.g. IT, HR).</li>
<li><strong>Profit center</strong> — an area of responsibility for profit (a product line, a region).</li>
<li><strong>Internal / cost element</strong> accounting — traces costs to activities and orders.</li>
</ul>
<h3>FI vs CO</h3>
<pre><code>FI -> external, legal, whole company code  (Balance Sheet, P&amp;L)
CO -> internal, managerial, cost/profit centers (decisions)
S/4HANA: the Universal Journal (ACDOCA) stores FI and CO
         in ONE table -> no reconciliation between them.
</code></pre>
<div class="callout"><span class="badge">Remember</span> FI answers to the law; CO answers to management. In S/4HANA they share one journal, so the two views always agree.</div>`,
    `<span class="eyebrow">SAP311 · Chương 4 · Bài 4.1</span>
<h2>Tài chính (FI) &amp; Kế toán quản trị (CO)</h2>
<h3>FI — sổ sách đối ngoại</h3>
<p><strong>FI</strong> ghi nhận tình hình tài chính pháp lý cho bên ngoài (kiểm toán, thuế, nhà đầu tư). Các sổ phụ chính:</p>
<pre><code>G/L  Sổ cái tổng hợp        -> bản ghi tài chính gốc
AP   Phải trả (nhà cung cấp) -> khoản ta nợ nhà cung cấp
AR   Phải thu (khách hàng)   -> khoản khách hàng nợ ta
AA   Kế toán tài sản         -> tài sản cố định & khấu hao
Bank -> tiền mặt & sao kê ngân hàng
Đầu ra: Bảng cân đối + Báo cáo lãi lỗ
</code></pre>
<h3>CO — góc nhìn nội bộ</h3>
<p><strong>CO</strong> phục vụ nhà quản lý, không phải cơ quan quản lý: nó trả lời <em>tiền được tạo ra và tiêu ở đâu bên trong công ty?</em></p>
<ul>
<li><strong>Cost center (trung tâm chi phí)</strong> — nơi phát sinh chi phí (một phòng ban, vd IT, nhân sự).</li>
<li><strong>Profit center (trung tâm lợi nhuận)</strong> — khu vực chịu trách nhiệm lợi nhuận (một dòng sản phẩm, một vùng).</li>
<li><strong>Kế toán chi phí nội bộ</strong> — truy chi phí về các hoạt động và lệnh (order).</li>
</ul>
<h3>FI so với CO</h3>
<pre><code>FI -> đối ngoại, pháp lý, cả company code  (Cân đối, Lãi lỗ)
CO -> nội bộ, quản trị, cost/profit center (ra quyết định)
S/4HANA: Universal Journal (ACDOCA) lưu FI và CO
         trong MỘT bảng -> không cần đối chiếu hai bên.
</code></pre>
<div class="callout"><span class="badge">Nhớ</span> FI trả lời trước pháp luật; CO trả lời trước ban quản lý. Trong S/4HANA cả hai chung một sổ nhật ký, nên hai góc nhìn luôn khớp.</div>`,
  ]]);

const c4q = quiz('sap311-quiz-4', 'Quiz 4 — FI & CO|||Quiz 4 — FI & CO', [
  { id: 'q1', question: 'Phân hệ nào tạo ra Bảng cân đối kế toán và Báo cáo lãi lỗ cho bên ngoài?', options: ['CO (Controlling)', 'FI (Financial Accounting)', 'MM', 'SD'], correctIndex: 1, explanation: 'FI phục vụ báo cáo tài chính pháp lý đối ngoại (Balance Sheet, P&L); CO là góc nhìn quản trị nội bộ.' },
  { id: 'q2', question: 'Trong CO, nơi phát sinh chi phí (vd phòng IT, nhân sự) được mô hình hoá bằng?', options: ['Profit center', 'Cost center', 'Company code', 'Plant'], correctIndex: 1, explanation: 'Cost center là trung tâm chi phí — nơi chi phí phát sinh; profit center chịu trách nhiệm về lợi nhuận.' },
  { id: 'q3', question: 'Trong S/4HANA, cái gì hợp nhất FI và CO vào một bảng để khỏi phải đối chiếu?', options: ['SAP GUI', 'Universal Journal (ACDOCA)', 'Fiori Launchpad', 'Transaction code'], correctIndex: 1, explanation: 'Universal Journal (bảng ACDOCA) lưu chung dữ liệu FI và CO, loại bỏ bước đối chiếu giữa hai phân hệ.' },
]);

const c5 = doc('sap311-5-1-mm', '5.1 — Materials Management (MM) & procurement|||5.1 — Phân hệ Mua hàng & Quản lý vật tư (MM)',
  'Vai trò MM: mua sắm và tồn kho; chứng từ chính: purchase requisition, purchase order, goods receipt, invoice receipt; quản lý vật tư & định giá tồn kho; T-code MM.',
  [[
    `<span class="eyebrow">SAP311 · Chapter 5 · Lesson 5.1</span>
<h2>Materials Management (MM)</h2>
<h3>What MM does</h3>
<p><strong>MM</strong> handles everything about buying and holding goods: sourcing, purchasing, receiving, inventory and invoice verification. It is the buying half of the supply chain.</p>
<h3>The procurement documents</h3>
<pre><code>Purchase Requisition (PR)  -> internal request "we need X"   (ME51N)
Purchase Order (PO)        -> official order to a vendor      (ME21N)
Goods Receipt (GR)         -> goods arrive; stock + value up  (MIGO)
Invoice Receipt (IR)       -> vendor invoice verified         (MIRO)
Payment (in FI)            -> vendor is paid
</code></pre>
<h3>Inventory &amp; valuation</h3>
<ul>
<li>A <strong>goods receipt</strong> raises stock quantity <em>and</em> posts an accounting document (integration with FI).</li>
<li>Stock is valued (moving average or standard price) so inventory always has a monetary value on the books.</li>
<li>Material types (raw, semi-finished, finished, trading goods) drive which views and processes apply.</li>
</ul>
<div class="callout"><span class="badge">Integration</span> MM does not live alone: a goods receipt touches FI (accounting) and feeds PP (production) and SD (what is available to sell).</div>`,
    `<span class="eyebrow">SAP311 · Chương 5 · Bài 5.1</span>
<h2>Quản lý vật tư (MM)</h2>
<h3>MM làm gì</h3>
<p><strong>MM</strong> lo mọi việc quanh mua và giữ hàng: tìm nguồn, mua sắm, nhận hàng, tồn kho và kiểm tra hoá đơn. Đây là nửa "mua" của chuỗi cung ứng.</p>
<h3>Các chứng từ mua sắm</h3>
<pre><code>Purchase Requisition (PR)  -> đề nghị nội bộ "cần mua X"    (ME51N)
Purchase Order (PO)        -> đơn mua chính thức gửi NCC     (ME21N)
Goods Receipt (GR)         -> hàng về; tồn + giá trị tăng    (MIGO)
Invoice Receipt (IR)       -> đối chiếu hoá đơn NCC          (MIRO)
Thanh toán (ở FI)          -> trả tiền nhà cung cấp
</code></pre>
<h3>Tồn kho &amp; định giá</h3>
<ul>
<li>Một <strong>lần nhập kho (GR)</strong> làm tăng số lượng tồn <em>và</em> sinh một chứng từ kế toán (tích hợp với FI).</li>
<li>Tồn được định giá (bình quân di động hoặc giá chuẩn) nên tồn kho luôn có giá trị tiền trên sổ.</li>
<li>Loại vật tư (nguyên liệu, bán thành phẩm, thành phẩm, hàng thương mại) quyết định áp dụng view và quy trình nào.</li>
</ul>
<div class="callout"><span class="badge">Tích hợp</span> MM không đứng một mình: một lần nhập kho chạm tới FI (kế toán), cấp dữ liệu cho PP (sản xuất) và SD (hàng sẵn để bán).</div>`,
  ]]);

const c5q = quiz('sap311-quiz-5', 'Quiz 5 — MM|||Quiz 5 — MM', [
  { id: 'q1', question: 'Trong quy trình mua sắm MM, chứng từ nào là đơn mua chính thức gửi tới nhà cung cấp?', options: ['Purchase Requisition (PR)', 'Purchase Order (PO)', 'Goods Receipt (GR)', 'Invoice Receipt (IR)'], correctIndex: 1, explanation: 'Purchase Order (PO, T-code ME21N) là đơn mua chính thức; PR chỉ là đề nghị nội bộ trước đó.' },
  { id: 'q2', question: 'Một lần nhập kho (Goods Receipt) trong MM gây ra điều gì?', options: ['Chỉ tăng số lượng tồn', 'Tăng tồn kho VÀ sinh chứng từ kế toán ở FI', 'Chỉ ghi nhận ở CO', 'Không ảnh hưởng dữ liệu khác'], correctIndex: 1, explanation: 'GR tăng số lượng và giá trị tồn, đồng thời tạo chứng từ kế toán — minh hoạ tích hợp MM–FI.' },
  { id: 'q3', question: 'Nhiệm vụ chính của phân hệ MM là?', options: ['Bán hàng và giao hàng', 'Mua sắm và quản lý tồn kho', 'Lập báo cáo tài chính', 'Lập kế hoạch sản xuất'], correctIndex: 1, explanation: 'MM lo mua sắm (procurement) và quản lý vật tư/tồn kho — nửa "mua" của chuỗi cung ứng.' },
]);

const c6 = doc('sap311-6-1-sd', '6.1 — Sales & Distribution (SD)|||6.1 — Phân hệ Bán hàng & Phân phối (SD)',
  'Vai trò SD: bán hàng, giao hàng, xuất hoá đơn; chu trình đơn hàng: inquiry → quotation → sales order → delivery → billing; kiểm tra tồn & giá; T-code SD.',
  [[
    `<span class="eyebrow">SAP311 · Chapter 6 · Lesson 6.1</span>
<h2>Sales &amp; Distribution (SD)</h2>
<h3>What SD does</h3>
<p><strong>SD</strong> is the selling half of the chain: it manages customer inquiries, quotations, sales orders, shipping and billing. Where MM buys, SD sells.</p>
<h3>The sales cycle</h3>
<pre><code>Inquiry        -> customer asks "can you supply X?"  (VA11)
Quotation      -> we offer price &amp; terms            (VA21)
Sales Order    -> customer commits to buy            (VA01)
Delivery       -> pick, pack, post goods issue       (VL01N)
Billing        -> invoice the customer               (VF01)
-> Goods issue reduces stock (MM) + posts to FI
-> Billing creates a receivable in FI (AR)
</code></pre>
<h3>What the order checks</h3>
<ul>
<li><strong>Availability check</strong> — is there enough stock, or when can we deliver? (links to MM/PP)</li>
<li><strong>Pricing</strong> — price, discounts, surcharges, taxes from condition records.</li>
<li><strong>Credit check</strong> — is the customer within their credit limit? (links to FI)</li>
</ul>
<div class="callout"><span class="badge">Integration</span> A single sales order pulls on inventory (MM), can trigger production (PP), and ends as revenue and a receivable (FI) — one document, many modules.</div>`,
    `<span class="eyebrow">SAP311 · Chương 6 · Bài 6.1</span>
<h2>Bán hàng &amp; Phân phối (SD)</h2>
<h3>SD làm gì</h3>
<p><strong>SD</strong> là nửa "bán" của chuỗi: quản lý yêu cầu của khách, báo giá, đơn bán, giao hàng và xuất hoá đơn. MM mua thì SD bán.</p>
<h3>Chu trình bán hàng</h3>
<pre><code>Inquiry (Hỏi hàng) -> khách hỏi "có cung cấp X không?"  (VA11)
Quotation (Báo giá)-> ta chào giá &amp; điều khoản         (VA21)
Sales Order (Đơn)  -> khách chốt mua                     (VA01)
Delivery (Giao)    -> soạn, đóng, xuất kho (goods issue) (VL01N)
Billing (Hoá đơn)  -> xuất hoá đơn cho khách             (VF01)
-> Xuất kho làm giảm tồn (MM) + hạch toán vào FI
-> Xuất hoá đơn tạo khoản phải thu ở FI (AR)
</code></pre>
<h3>Đơn hàng kiểm tra những gì</h3>
<ul>
<li><strong>Kiểm tra khả dụng (availability)</strong> — còn đủ tồn không, hoặc bao giờ giao được? (nối tới MM/PP)</li>
<li><strong>Định giá (pricing)</strong> — giá, chiết khấu, phụ phí, thuế từ các bản ghi điều kiện.</li>
<li><strong>Kiểm tra tín dụng</strong> — khách có trong hạn mức tín dụng không? (nối tới FI)</li>
</ul>
<div class="callout"><span class="badge">Tích hợp</span> Một đơn bán kéo theo tồn kho (MM), có thể kích hoạt sản xuất (PP), và kết thúc bằng doanh thu và khoản phải thu (FI) — một chứng từ, nhiều phân hệ.</div>`,
  ]]);

const c6q = quiz('sap311-quiz-6', 'Quiz 6 — SD|||Quiz 6 — SD', [
  { id: 'q1', question: 'Thứ tự đúng của chu trình bán hàng trong SD là?', options: ['Đơn bán → Báo giá → Giao hàng → Hoá đơn', 'Hỏi hàng → Báo giá → Đơn bán → Giao hàng → Hoá đơn', 'Hoá đơn → Giao hàng → Đơn bán', 'Giao hàng → Đơn bán → Báo giá'], correctIndex: 1, explanation: 'Chu trình chuẩn: Inquiry → Quotation → Sales Order → Delivery → Billing.' },
  { id: 'q2', question: 'Bước "xuất kho" (goods issue) khi giao hàng trong SD tác động thế nào?', options: ['Tăng tồn kho', 'Giảm tồn kho (MM) và hạch toán vào FI', 'Chỉ in phiếu giao', 'Tạo đơn mua hàng'], correctIndex: 1, explanation: 'Goods issue làm giảm tồn (MM) và sinh chứng từ kế toán (FI) — thể hiện tích hợp SD–MM–FI.' },
  { id: 'q3', question: 'Kiểm tra nào trong đơn bán liên kết tới hạn mức tín dụng của khách (FI)?', options: ['Availability check', 'Credit check', 'Pricing', 'Delivery scheduling'], correctIndex: 1, explanation: 'Credit check đối chiếu khách với hạn mức tín dụng quản lý ở FI trước khi cho đơn đi tiếp.' },
]);

const c7 = doc('sap311-7-1-pp', '7.1 — Production Planning (PP) & warehouse/inventory|||7.1 — Phân hệ Sản xuất (PP) & Quản lý kho',
  'Vai trò PP: lập kế hoạch & thực thi sản xuất; BOM, work center, routing; MRP; production order; tồn kho & biến động hàng; T-code PP.',
  [[
    `<span class="eyebrow">SAP311 · Chapter 7 · Lesson 7.1</span>
<h2>Production Planning (PP) &amp; inventory</h2>
<h3>What PP does</h3>
<p><strong>PP</strong> plans and executes making things: from demand, it works out what to produce, what components are needed and when, then drives production on the shop floor.</p>
<h3>Manufacturing master data</h3>
<pre><code>Bill of Materials (BOM) -> the recipe: components to build 1 product
Work Center             -> a machine/line where an operation runs
Routing                 -> the sequence of operations + times
</code></pre>
<h3>From plan to product</h3>
<pre><code>Demand (sales order / forecast)
  -> MRP run: nets demand vs stock, plans requirements
  -> Planned Order -> Production Order (CO01)
  -> issue components from stock (MM)  [stock down]
  -> confirm operations (work centers)
  -> Goods Receipt of finished product [stock up]
</code></pre>
<ul>
<li><strong>MRP (Material Requirements Planning)</strong> — calculates what to buy vs make, and when, so materials arrive just in time.</li>
<li><strong>Goods movements</strong> — issuing components and receiving finished goods keep inventory accurate in real time.</li>
</ul>
<div class="callout"><span class="badge">Integration</span> PP consumes materials from MM and produces stock that SD can sell; every movement values inventory in FI. It is where planning meets the physical warehouse.</div>`,
    `<span class="eyebrow">SAP311 · Chương 7 · Bài 7.1</span>
<h2>Sản xuất (PP) &amp; tồn kho</h2>
<h3>PP làm gì</h3>
<p><strong>PP</strong> lập kế hoạch và thực thi việc làm ra sản phẩm: từ nhu cầu, nó tính cần sản xuất gì, cần linh kiện nào và khi nào, rồi điều hành sản xuất tại xưởng.</p>
<h3>Dữ liệu chủ sản xuất</h3>
<pre><code>Bill of Materials (BOM) -> "công thức": linh kiện để làm 1 sản phẩm
Work Center             -> máy/dây chuyền nơi một công đoạn chạy
Routing                 -> trình tự các công đoạn + thời gian
</code></pre>
<h3>Từ kế hoạch tới sản phẩm</h3>
<pre><code>Nhu cầu (đơn bán / dự báo)
  -> Chạy MRP: cân nhu cầu với tồn, hoạch định yêu cầu
  -> Planned Order -> Production Order (CO01)
  -> xuất linh kiện từ kho (MM)     [tồn giảm]
  -> xác nhận công đoạn (work center)
  -> Nhập kho thành phẩm            [tồn tăng]
</code></pre>
<ul>
<li><strong>MRP (Hoạch định nhu cầu vật tư)</strong> — tính mua gì so với làm gì, và khi nào, để vật tư về đúng lúc.</li>
<li><strong>Biến động hàng (goods movements)</strong> — xuất linh kiện và nhập thành phẩm giữ tồn kho chính xác theo thời gian thực.</li>
</ul>
<div class="callout"><span class="badge">Tích hợp</span> PP tiêu thụ vật tư từ MM và tạo ra tồn kho để SD bán; mỗi biến động đều định giá tồn kho ở FI. Đây là nơi kế hoạch gặp kho hàng thực tế.</div>`,
  ]]);

const c7q = quiz('sap311-quiz-7', 'Quiz 7 — PP & kho|||Quiz 7 — PP & inventory', [
  { id: 'q1', question: 'Trong PP, "công thức" liệt kê các linh kiện để làm ra một sản phẩm gọi là?', options: ['Routing', 'Work center', 'Bill of Materials (BOM)', 'Production order'], correctIndex: 2, explanation: 'BOM (danh mục vật tư) là công thức liệt kê linh kiện; routing là trình tự công đoạn, work center là nơi gia công.' },
  { id: 'q2', question: 'Chức năng nào tính toán cần mua gì / làm gì và khi nào để vật tư về đúng lúc?', options: ['MRP (Material Requirements Planning)', 'Availability check', 'Billing', 'Goods issue'], correctIndex: 0, explanation: 'MRP cân nhu cầu với tồn hiện có và sinh ra kế hoạch mua/sản xuất theo thời điểm.' },
  { id: 'q3', question: 'Khi hoàn tất một production order và nhập kho thành phẩm thì?', options: ['Tồn kho giảm', 'Tồn kho thành phẩm tăng và được định giá ở FI', 'Không đổi tồn', 'Chỉ ảnh hưởng SD'], correctIndex: 1, explanation: 'Nhập kho thành phẩm làm tăng tồn và sinh chứng từ định giá ở FI; xuất linh kiện trước đó thì làm giảm tồn nguyên liệu.' },
]);

const c8 = doc('sap311-8-1-integration-reporting', '8.1 — Cross-module integration & reporting|||8.1 — Tích hợp liên phân hệ & báo cáo',
  'Hai luồng end-to-end: procure-to-pay (MM+FI) và order-to-cash (SD+MM+FI); vì sao tích hợp là bản chất của ERP; báo cáo vận hành so với phân tích (embedded analytics, Fiori).',
  [[
    `<span class="eyebrow">SAP311 · Chapter 8 · Lesson 8.1</span>
<h2>Cross-module integration &amp; reporting</h2>
<h3>Procure-to-Pay (P2P)</h3>
<pre><code>PR -> PO (MM) -> Goods Receipt (MM + FI stock value)
   -> Invoice Receipt (MM/FI: liability to vendor)
   -> Payment (FI)   =>   we bought and paid
</code></pre>
<h3>Order-to-Cash (O2C)</h3>
<pre><code>Sales Order (SD) -> Delivery / Goods Issue (SD + MM: stock down)
   -> Billing (SD + FI: revenue + receivable)
   -> Incoming Payment (FI)  =>  we sold and got paid
</code></pre>
<p>Notice the pattern: <strong>every physical event automatically writes the accounting entry</strong>. That automatic hand-off between modules — no re-keying, no reconciliation — <em>is</em> the point of ERP.</p>
<h3>Why integration is the essence of ERP</h3>
<ul>
<li>One transaction updates several modules at once, consistently.</li>
<li>The books are always in step with the warehouse and the sales floor.</li>
<li>A change to master data (a price, a customer) is felt everywhere immediately.</li>
</ul>
<h3>Reporting</h3>
<ul>
<li><strong>Operational reporting</strong> — line-item lists, document flow, standard transactions.</li>
<li><strong>Analytics</strong> — in S/4HANA, embedded analytics run on live data (no separate warehouse), surfaced through <strong>Fiori</strong> apps, KPIs and overview pages.</li>
</ul>
<div class="callout"><span class="badge">Big picture</span> P2P and O2C are the two spines of an ERP. If you can trace a document from request to payment across MM, SD and FI, you understand what SAP is for.</div>`,
    `<span class="eyebrow">SAP311 · Chương 8 · Bài 8.1</span>
<h2>Tích hợp liên phân hệ &amp; báo cáo</h2>
<h3>Procure-to-Pay — Mua tới trả tiền (P2P)</h3>
<pre><code>PR -> PO (MM) -> Nhập kho (MM + FI: định giá tồn)
   -> Nhận hoá đơn (MM/FI: ghi nợ nhà cung cấp)
   -> Thanh toán (FI)   =>   đã mua và đã trả
</code></pre>
<h3>Order-to-Cash — Đơn hàng tới thu tiền (O2C)</h3>
<pre><code>Đơn bán (SD) -> Giao / Xuất kho (SD + MM: tồn giảm)
   -> Xuất hoá đơn (SD + FI: doanh thu + phải thu)
   -> Nhận thanh toán (FI)  =>  đã bán và đã thu
</code></pre>
<p>Để ý quy luật: <strong>mỗi sự kiện vật lý tự động ghi bút toán kế toán</strong>. Chính sự bàn giao tự động giữa các phân hệ đó — không nhập lại, không đối chiếu — <em>mới là</em> điểm mấu chốt của ERP.</p>
<h3>Vì sao tích hợp là bản chất của ERP</h3>
<ul>
<li>Một giao dịch cập nhật nhiều phân hệ cùng lúc, nhất quán.</li>
<li>Sổ sách luôn khớp với kho và với bộ phận bán hàng.</li>
<li>Thay đổi dữ liệu chủ (một mức giá, một khách hàng) có hiệu lực khắp nơi tức thì.</li>
</ul>
<h3>Báo cáo</h3>
<ul>
<li><strong>Báo cáo vận hành</strong> — danh sách dòng chứng từ, dòng luân chuyển chứng từ, các giao dịch chuẩn.</li>
<li><strong>Phân tích (analytics)</strong> — trong S/4HANA, embedded analytics chạy trên dữ liệu sống (không cần kho dữ liệu riêng), hiển thị qua ứng dụng <strong>Fiori</strong>, KPI và trang tổng quan.</li>
</ul>
<div class="callout"><span class="badge">Bức tranh lớn</span> P2P và O2C là hai xương sống của một ERP. Nếu lần được một chứng từ từ lúc đề nghị tới lúc thanh toán xuyên MM, SD và FI, bạn đã hiểu SAP dùng để làm gì.</div>`,
  ]]);

const c8q = quiz('sap311-quiz-8', 'Quiz 8 — Integration & reporting|||Quiz 8 — Tích hợp & báo cáo', [
  { id: 'q1', question: 'Luồng "procure-to-pay" (P2P) chủ yếu đi qua những phân hệ nào?', options: ['SD và PP', 'MM và FI', 'CO và SD', 'Chỉ FI'], correctIndex: 1, explanation: 'P2P là PR → PO → nhập kho → nhận hoá đơn → thanh toán, đi qua MM (mua/tồn) và FI (kế toán, thanh toán).' },
  { id: 'q2', question: 'Trong luồng "order-to-cash", bước xuất hoá đơn (billing) tạo ra gì ở FI?', options: ['Khoản phải trả (AP)', 'Doanh thu và khoản phải thu (AR)', 'Đơn mua hàng', 'Production order'], correctIndex: 1, explanation: 'Billing ghi nhận doanh thu và tạo khoản phải thu (AR) ở FI; sau đó khách thanh toán mới đóng luồng O2C.' },
  { id: 'q3', question: 'Điều gì làm nên bản chất "tích hợp" của ERP mà môn này nhấn mạnh?', options: ['Giao diện đẹp', 'Mỗi sự kiện vật lý tự động sinh bút toán, không nhập lại giữa các phân hệ', 'Chạy nhanh hơn', 'Nhiều báo cáo hơn'], correctIndex: 1, explanation: 'Bản chất ERP là các phân hệ tự bàn giao dữ liệu: một sự kiện (nhập/xuất kho) tự ghi kế toán, không nhập lại, không cần đối chiếu.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'SAP311',
    slug: 'sap311-sap-general-1',
    title: 'SAP General 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SAP311.webp',
    shortDescription: 'Business on SAP ERP — what ERP is, R/3 → S/4HANA, architecture (GUI, Fiori, T-codes), organizational units & master data, and core modules FI, CO, MM, SD, PP tied by procure-to-pay & order-to-cash. Bilingual, with diagrams & quizzes.|||Doanh nghiệp trên SAP ERP — ERP là gì, R/3 → S/4HANA, kiến trúc (GUI, Fiori, T-code), đơn vị tổ chức & dữ liệu chủ, các phân hệ FI, CO, MM, SD, PP nối bằng procure-to-pay & order-to-cash. Song ngữ, có sơ đồ & quiz.',
    description: 'Môn <strong>SAP311 — SAP General 1</strong> (kỳ 7, ngành Hệ thống thông tin) giúp hiểu <strong>một doanh nghiệp vận hành trên SAP ERP thế nào</strong>. Từ <strong>nền tảng ERP &amp; câu chuyện SAP</strong> (R/3 → S/4HANA) → <strong>kiến trúc &amp; giao diện</strong> (SAP GUI, Fiori, transaction code) → <strong>cấu trúc tổ chức &amp; dữ liệu chủ</strong> → các phân hệ <strong>FI, CO, MM, SD, PP</strong> → <strong>tích hợp liên phân hệ</strong> (procure-to-pay, order-to-cash) &amp; báo cáo. Bám giáo trình (SAP PRESS, openSAP, help.sap.com, TERP10), song ngữ, có sơ đồ quy trình, bảng phân hệ và mã giao dịch, quiz mỗi chương.',
    whatYouLearn: 'ERP là gì &amp; vì sao cần; lịch sử SAP (R/2 → R/3 → ECC → S/4HANA, HANA in-memory, Fiori); kiến trúc 3 tầng; SAP GUI so với Fiori và transaction code; đơn vị tổ chức (client, company code, plant, sales/purchasing org); dữ liệu chủ so với dữ liệu giao dịch; phân hệ FI &amp; CO (G/L, AR, AP, cost/profit center, Universal Journal); MM (PR→PO→GR→IR); SD (inquiry→quotation→order→delivery→billing); PP (BOM, routing, MRP, production order); tích hợp procure-to-pay &amp; order-to-cash; báo cáo &amp; analytics.',
    requirements: 'Không cần biết lập trình. Nên hiểu cơ bản về hoạt động doanh nghiệp (mua, bán, kế toán, kho). Có tài khoản SAP demo/thực hành là một lợi thế nhưng không bắt buộc.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách SAP PRESS, tài liệu chính thức, YouTube, hệ demo, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'ERP là gì, SAP là ai, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ERP & SAP|||Chapter 1 — ERP & SAP overview', description: 'ERP, lịch sử R/3 → S/4HANA.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kiến trúc & giao diện|||Chapter 2 — Architecture & UI', description: '3 tầng, SAP GUI, Fiori, T-code.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tổ chức & dữ liệu chủ|||Chapter 3 — Org & master data', description: 'Company code, plant, master data.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tài chính FI & Kế toán quản trị CO|||Chapter 4 — FI & CO', description: 'G/L, AR/AP, cost/profit center.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mua hàng & Vật tư MM|||Chapter 5 — Materials Management', description: 'PR→PO→GR→IR, tồn kho.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Bán hàng & Phân phối SD|||Chapter 6 — Sales & Distribution', description: 'Chu trình đơn hàng, giao, hoá đơn.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sản xuất PP & Kho|||Chapter 7 — Production Planning', description: 'BOM, MRP, production order.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tích hợp & báo cáo|||Chapter 8 — Integration & reporting', description: 'P2P, O2C, báo cáo & analytics.', lessons: [c8, c8q] },
  ],
};
