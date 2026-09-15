/**
 * SAP312 — ERP Systems: Concepts and Practice with SAP. Giáo trình: "Enterprise
 * Resource Planning" (Motiwalla & Thompson); "SAP S/4HANA" (SAP Press, Bönnen et
 * al.); tài liệu SAP Learning Hub. 8 chương: tổng quan ERP → kiến trúc SAP/Fiori
 * → master data & tổ chức → P2P (MM) → O2C (SD) → FI/CO → PP/WM → triển khai &
 * xu hướng. Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick lồng/${; không dùng HTML numeric entity (&#NNN;).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sap312-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chính (Motiwalla & Thompson), sách SAP Press (Bönnen et al.), SAP Learning Hub, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">SAP312 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>ERP concepts and hands-on SAP practice</strong> — integrated business processes, SAP architecture, master data, and the core P2P/O2C/FI-CO/PP-WM cycles — in one place.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><em>Enterprise Resource Planning</em> — Luvai F. Motiwalla &amp; Jeff Thompson (Pearson). The main conceptual textbook: ERP evolution, business process integration, implementation lifecycle.</li>
<li><em>SAP S/4HANA: An Introduction</em> — Bönnen, Haas, Hemken, Schaffry (SAP Press/Rheinwerk). Hands-on reference for S/4HANA architecture, Fiori, and core modules (MM, SD, FI/CO, PP).</li>
</ul>
<h3>🎓 Official SAP resources</h3>
<ul>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning Hub / SAP Learning</a> — free official courses, learning journeys and SAP system access for students.</li>
<li><a href="https://help.sap.com/" target="_blank" rel="noopener">SAP Help Portal</a> — official product documentation for every SAP module.</li>
<li><a href="https://community.sap.com/" target="_blank" rel="noopener">SAP Community</a> — blogs, Q&amp;A and tutorials from SAP practitioners.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@SAPLearning" target="_blank" rel="noopener">SAP Learning (official)</a> — free tutorials on SAP GUI, Fiori and S/4HANA.</li>
<li><a href="https://www.youtube.com/@TutorialsPoint" target="_blank" rel="noopener">TutorialsPoint SAP series</a> — step-by-step SAP MM/SD/FI walkthroughs.</li>
</ul>
<h3>🛠️ Practice access</h3>
<p>SAP provides free trial/training systems through the <strong>SAP Learning Hub, university edition</strong> — check with FPTU's SAP University Alliances access before the semester starts.</p>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what ERP is, why integration matters, SAP GUI/Fiori navigation.</li>
<li><strong>Structure</strong> — organizational units and master data (the "nouns" every process reuses).</li>
<li><strong>Core cycles</strong> — Procure-to-Pay (MM), Order-to-Cash (SD), and how they post into FI/CO.</li>
<li><strong>Depth &amp; delivery</strong> — PP/WM planning and warehouse flows, then implementation methodology (SAP Activate) and trends.</li>
</ol></div>`,
    `<span class="eyebrow">SAP312 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>khái niệm ERP và thực hành SAP</strong> — quy trình kinh doanh tích hợp, kiến trúc SAP, dữ liệu chủ, và các chu trình P2P/O2C/FI-CO/PP-WM — gom về một chỗ.</p>
<h3>📘 Giáo trình chính</h3>
<ul>
<li><em>Enterprise Resource Planning</em> — Luvai F. Motiwalla &amp; Jeff Thompson (Pearson). Giáo trình khái niệm chính: lịch sử ERP, tích hợp quy trình kinh doanh, chu trình triển khai.</li>
<li><em>SAP S/4HANA: An Introduction</em> — Bönnen, Haas, Hemken, Schaffry (SAP Press/Rheinwerk). Tài liệu thực hành cho kiến trúc S/4HANA, Fiori, và các module cốt lõi (MM, SD, FI/CO, PP).</li>
</ul>
<h3>🎓 Tài nguyên chính thức của SAP</h3>
<ul>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning Hub / SAP Learning</a> — khoá học chính thức miễn phí, learning journey và quyền truy cập hệ thống SAP cho sinh viên.</li>
<li><a href="https://help.sap.com/" target="_blank" rel="noopener">SAP Help Portal</a> — tài liệu sản phẩm chính thức cho mọi module SAP.</li>
<li><a href="https://community.sap.com/" target="_blank" rel="noopener">SAP Community</a> — blog, hỏi đáp và hướng dẫn từ người dùng SAP thực tế.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@SAPLearning" target="_blank" rel="noopener">SAP Learning (chính thức)</a> — hướng dẫn miễn phí về SAP GUI, Fiori và S/4HANA.</li>
<li><a href="https://www.youtube.com/@TutorialsPoint" target="_blank" rel="noopener">TutorialsPoint SAP series</a> — hướng dẫn từng bước SAP MM/SD/FI.</li>
</ul>
<h3>🛠️ Truy cập thực hành</h3>
<p>SAP cấp hệ thống dùng thử/luyện tập miễn phí qua <strong>SAP Learning Hub, university edition</strong> — hỏi FPTU về quyền truy cập SAP University Alliances trước khi vào học kỳ.</p>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ERP là gì, vì sao cần tích hợp, điều hướng SAP GUI/Fiori.</li>
<li><strong>Cấu trúc</strong> — đơn vị tổ chức và dữ liệu chủ (các "danh từ" mọi quy trình dùng lại).</li>
<li><strong>Chu trình cốt lõi</strong> — Mua hàng (MM), Bán hàng (SD), và cách chúng ghi vào FI/CO.</li>
<li><strong>Đào sâu &amp; triển khai</strong> — kế hoạch PP/WM, sau đó phương pháp triển khai (SAP Activate) và xu hướng.</li>
</ol></div>`,
  ]]);

const intro = doc('sap312-0-1-overview', 'Course overview: ERP Systems & SAP|||Tổng quan: Hệ thống ERP & SAP',
  'ERP là gì, vì sao doanh nghiệp cần một hệ thống tích hợp duy nhất, lịch sử phát triển từ MRP đến ERP/S4HANA, lộ trình 8 chương của môn.',
  [[
    `<span class="eyebrow">SAP312 · Lesson 0.1 · Overview</span>
<h2>ERP Systems: Concepts and Practice with SAP</h2>
<p class="lead">This course explains <strong>what an ERP system is and why almost every mid-to-large company runs one</strong>, then makes it concrete through <strong>SAP</strong> — the market-leading ERP suite. You will learn the core business cycles (procurement, sales, finance, production) and how one integrated system replaces dozens of disconnected departmental tools.</p>
<h3>Why "integrated" is the whole point</h3>
<p>Before ERP, each department (sales, purchasing, warehouse, accounting) often ran its own software and its own copy of the data. A sales order in one system had no automatic link to inventory or accounting in another — someone had to re-type it. An <strong>ERP</strong> (Enterprise Resource Planning) system puts all departments on <strong>one shared database</strong>, so a single business event (e.g. a customer order) updates inventory, finance and reporting automatically, in real time.</p>
<h3>A short history</h3>
<pre><code>1960s  MRP        - Material Requirements Planning (production/inventory only)
1980s  MRP II     - + capacity planning, shop floor, some finance
1990s  ERP        - + HR, sales, procurement -> ONE integrated suite (SAP R/3)
2000s  ERP II     - + web, supply chain, CRM, e-commerce
2015+  S/4HANA    - in-memory database, real-time analytics, Fiori UX, cloud
</code></pre>
<h3>Roadmap of this course</h3>
<p>Ch.1 ERP concepts &amp; integrated processes → Ch.2 SAP architecture &amp; navigation (GUI/Fiori) → Ch.3 master data &amp; organizational structure → Ch.4 Procure-to-Pay (MM) → Ch.5 Order-to-Cash (SD) → Ch.6 Financial Accounting &amp; Controlling (FI/CO) → Ch.7 Production Planning &amp; Warehouse Management (PP/WM) → Ch.8 implementation, change management &amp; trends (S/4HANA, cloud, analytics).</p>`,
    `<span class="eyebrow">SAP312 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống ERP: Khái niệm và Thực hành với SAP</h2>
<p class="lead">Môn này giải thích <strong>ERP là gì và vì sao gần như mọi công ty vừa và lớn đều dùng một hệ thống ERP</strong>, rồi cụ thể hoá qua <strong>SAP</strong> — bộ giải pháp ERP dẫn đầu thị trường. Bạn sẽ học các chu trình kinh doanh cốt lõi (mua hàng, bán hàng, tài chính, sản xuất) và cách một hệ thống tích hợp thay thế hàng chục công cụ rời rạc của từng phòng ban.</p>
<h3>Vì sao "tích hợp" là trọng tâm</h3>
<p>Trước khi có ERP, mỗi phòng ban (bán hàng, mua hàng, kho, kế toán) thường chạy phần mềm riêng và giữ một bản dữ liệu riêng. Một đơn hàng bán ở hệ thống này không tự động liên kết với tồn kho hay kế toán ở hệ thống khác — ai đó phải nhập lại tay. Một hệ thống <strong>ERP</strong> (Enterprise Resource Planning — Lập kế hoạch nguồn lực doanh nghiệp) đưa mọi phòng ban vào <strong>một cơ sở dữ liệu chung</strong>, nên một sự kiện kinh doanh (vd đơn hàng của khách) tự cập nhật tồn kho, tài chính và báo cáo theo thời gian thực.</p>
<h3>Lịch sử ngắn</h3>
<pre><code>1960s  MRP        - Lập kế hoạch nhu cầu vật tư (chỉ sản xuất/tồn kho)
1980s  MRP II     - + lập kế hoạch năng lực, xưởng sản xuất, một phần tài chính
1990s  ERP        - + nhân sự, bán hàng, mua hàng -> MỘT bộ tích hợp (SAP R/3)
2000s  ERP II     - + web, chuỗi cung ứng, CRM, thương mại điện tử
2015+  S/4HANA    - cơ sở dữ liệu trong bộ nhớ, phân tích thời gian thực, Fiori, cloud
</code></pre>
<h3>Lộ trình môn học</h3>
<p>Ch.1 Khái niệm ERP &amp; quy trình tích hợp → Ch.2 Kiến trúc &amp; điều hướng SAP (GUI/Fiori) → Ch.3 Dữ liệu chủ &amp; tổ chức doanh nghiệp → Ch.4 Mua hàng (MM) → Ch.5 Bán hàng (SD) → Ch.6 Kế toán tài chính &amp; kiểm soát (FI/CO) → Ch.7 Lập kế hoạch sản xuất &amp; kho (PP/WM) → Ch.8 Triển khai, quản trị thay đổi &amp; xu hướng (S/4HANA, cloud, analytics).</p>`,
  ]]);

const c1 = doc('sap312-1-1-erp-overview', '1.1 — ERP overview & integrated business processes|||1.1 — Tổng quan ERP & quy trình kinh doanh tích hợp',
  'Định nghĩa ERP, ba nguyên tắc cốt lõi (dữ liệu chung, tích hợp liên phòng, chuẩn hoá quy trình), quy trình xuyên phòng ban vs. cấu trúc theo chức năng, lợi ích và rủi ro.',
  [[
    `<span class="eyebrow">SAP312 · Chapter 1 · Lesson 1.1</span>
<h2>ERP overview &amp; integrated business processes</h2>
<h3>What is ERP?</h3>
<p>An <strong>ERP system</strong> is software that integrates the core business functions of a company — finance, sales, procurement, production, inventory, HR — into <strong>one system with one database</strong>, so information entered once is available everywhere it is needed.</p>
<h3>Three core principles</h3>
<ul>
<li><strong>Single source of truth</strong> — one shared database; no duplicate, out-of-sync copies of customer, material or financial data.</li>
<li><strong>Cross-functional integration</strong> — a transaction in one area (e.g. a goods receipt in the warehouse) automatically triggers effects elsewhere (inventory value updates, accounting entry is posted).</li>
<li><strong>Standardized, best-practice processes</strong> — ERP vendors ship pre-built process templates (e.g. SAP's standard Order-to-Cash) so companies adopt proven workflows instead of reinventing them.</li>
</ul>
<h3>Process view vs. functional silos</h3>
<p>Traditional organizations are drawn as boxes: Sales, Warehouse, Accounting. But real business events cut <em>across</em> those boxes. A single customer order is really one <strong>process</strong> — Order-to-Cash — that touches Sales (create order), Warehouse (pick &amp; ship), and Accounting (invoice &amp; collect payment). ERP is organized around these end-to-end processes, not around department boundaries.</p>
<pre><code>Functional silo view:      Sales dept | Warehouse dept | Finance dept  (each own data)
Process (ERP) view:        Order -> Delivery -> Billing  (one flow, one database)
</code></pre>
<h3>Benefits &amp; challenges</h3>
<ul>
<li><strong>Benefits</strong> — real-time visibility, fewer manual re-entries and errors, consistent reporting, easier regulatory compliance.</li>
<li><strong>Challenges</strong> — high implementation cost and complexity, need to redesign processes to fit the system, and significant change management (people must adopt new ways of working).</li>
</ul>
<div class="callout"><span class="badge">Key takeaway</span> ERP's value is not the software alone — it is the <strong>integration and standardization</strong> of processes that used to live in separate, disconnected systems.</div>`,
    `<span class="eyebrow">SAP312 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan ERP &amp; quy trình kinh doanh tích hợp</h2>
<h3>ERP là gì?</h3>
<p>Một <strong>hệ thống ERP</strong> là phần mềm tích hợp các chức năng kinh doanh cốt lõi của công ty — tài chính, bán hàng, mua hàng, sản xuất, tồn kho, nhân sự — vào <strong>một hệ thống với một cơ sở dữ liệu</strong>, nên thông tin nhập một lần thì có sẵn ở mọi nơi cần dùng.</p>
<h3>Ba nguyên tắc cốt lõi</h3>
<ul>
<li><strong>Một nguồn sự thật duy nhất</strong> — một cơ sở dữ liệu chung; không có bản sao trùng, lệch nhịp của dữ liệu khách hàng, vật tư hay tài chính.</li>
<li><strong>Tích hợp liên phòng ban</strong> — một giao dịch ở khu vực này (vd nhận hàng ở kho) tự động kích hoạt ảnh hưởng ở nơi khác (giá trị tồn kho cập nhật, bút toán kế toán được ghi).</li>
<li><strong>Quy trình chuẩn hoá, theo thực hành tốt nhất</strong> — nhà cung cấp ERP đóng gói sẵn mẫu quy trình (vd chu trình Bán hàng chuẩn của SAP) để công ty áp dụng cách làm đã được kiểm chứng thay vì tự nghĩ lại.</li>
</ul>
<h3>Góc nhìn quy trình vs. cấu trúc theo chức năng</h3>
<p>Tổ chức truyền thống được vẽ thành các ô: Bán hàng, Kho, Kế toán. Nhưng các sự kiện kinh doanh thật lại cắt <em>xuyên qua</em> các ô đó. Một đơn hàng của khách thực ra là một <strong>quy trình</strong> — Bán hàng đến Thu tiền (Order-to-Cash) — chạm vào Bán hàng (tạo đơn), Kho (lấy &amp; giao hàng), và Kế toán (xuất hoá đơn &amp; thu tiền). ERP được tổ chức theo các quy trình xuyên suốt này, không theo ranh giới phòng ban.</p>
<pre><code>Góc nhìn theo phòng ban:   Bộ phận Bán hàng | Bộ phận Kho | Bộ phận Kế toán  (mỗi nơi giữ dữ liệu riêng)
Góc nhìn quy trình (ERP):  Đơn hàng -> Giao hàng -> Xuất hoá đơn  (một luồng, một cơ sở dữ liệu)
</code></pre>
<h3>Lợi ích &amp; thách thức</h3>
<ul>
<li><strong>Lợi ích</strong> — hiển thị thời gian thực, giảm nhập tay lặp lại và sai sót, báo cáo thống nhất, tuân thủ quy định dễ hơn.</li>
<li><strong>Thách thức</strong> — chi phí và độ phức tạp triển khai cao, cần thiết kế lại quy trình để khớp với hệ thống, và quản trị thay đổi lớn (con người phải thích nghi cách làm mới).</li>
</ul>
<div class="callout"><span class="badge">Điểm cốt lõi</span> Giá trị của ERP không nằm ở phần mềm đơn lẻ — mà ở việc <strong>tích hợp và chuẩn hoá</strong> các quy trình từng nằm rải rác ở các hệ thống rời rạc.</div>`,
  ]]);

const c1q = quiz('sap312-quiz-1', 'Quiz 1 — ERP overview|||Quiz 1 — Tổng quan ERP', [
  { id: 'q1', question: 'Nguyên tắc cốt lõi nào KHÔNG thuộc về ERP?', options: ['Một nguồn dữ liệu duy nhất', 'Tích hợp liên phòng ban', 'Mỗi phòng ban giữ một bản dữ liệu riêng', 'Quy trình chuẩn hoá'], correctIndex: 2, explanation: 'ERP dùng MỘT cơ sở dữ liệu chung — giữ bản riêng cho mỗi phòng ban là đặc điểm của hệ thống RỜI RẠC trước ERP.' },
  { id: 'q2', question: 'Chu trình Order-to-Cash chạm vào những bộ phận nào?', options: ['Chỉ Bán hàng', 'Bán hàng, Kho, Kế toán', 'Chỉ Kế toán', 'Chỉ Nhân sự'], correctIndex: 1, explanation: 'Order-to-Cash là một quy trình xuyên suốt: tạo đơn (Bán hàng) → giao hàng (Kho) → xuất hoá đơn/thu tiền (Kế toán).' },
  { id: 'q3', question: 'Thách thức lớn khi triển khai ERP là gì?', options: ['Không cần đổi quy trình gì', 'Quản trị thay đổi và chi phí/độ phức tạp triển khai', 'ERP luôn rẻ hơn phần mềm rời rạc', 'Không ảnh hưởng đến cách làm việc của nhân viên'], correctIndex: 1, explanation: 'Triển khai ERP đòi hỏi thiết kế lại quy trình và quản trị thay đổi lớn, đi kèm chi phí/độ phức tạp cao.' },
]);

const c2 = doc('sap312-2-1-sap-architecture', '2.1 — SAP architecture & GUI/Fiori navigation|||2.1 — Kiến trúc SAP & điều hướng SAP GUI/Fiori',
  'Kiến trúc client-server ba lớp của SAP, sự khác biệt SAP GUI (transaction code) và SAP Fiori (tile-based), điều hướng cơ bản và các T-code phổ biến.',
  [[
    `<span class="eyebrow">SAP312 · Chapter 2 · Lesson 2.1</span>
<h2>SAP architecture &amp; GUI/Fiori navigation</h2>
<h3>Three-tier client-server architecture</h3>
<pre><code>Presentation layer  -> SAP GUI / Fiori Launchpad (what the user sees)
Application layer   -> business logic, runs transactions (ABAP/S4HANA app server)
Database layer       -> HANA in-memory database (S/4HANA) or older RDBMS (ECC)
</code></pre>
<p>Separating these layers lets thousands of users share the same data and logic while each only interacts with a lightweight presentation client.</p>
<h3>SAP GUI: transaction codes</h3>
<p>The classic interface, <strong>SAP GUI</strong>, is navigated using short <strong>transaction codes (T-codes)</strong> typed into the command field — e.g. <code>VA01</code> (create sales order), <code>ME21N</code> (create purchase order), <code>FB60</code> (enter vendor invoice), <code>MIGO</code> (goods movement). Each T-code opens a specific screen/program directly, skipping menus.</p>
<h3>SAP Fiori: role-based apps</h3>
<p><strong>SAP Fiori</strong> is the modern web-based UX, built on a <strong>Fiori Launchpad</strong> of app <strong>tiles</strong> grouped by role (e.g. "Purchaser", "Accounts Payable Clerk"). Fiori apps are responsive (desktop/tablet/phone) and often embed real-time KPIs directly on the tile.</p>
<pre><code>SAP GUI                         SAP Fiori
------------------------        ------------------------
Type T-code, press Enter        Click a role-based tile
Dense tables, keyboard-driven   Responsive cards, touch-friendly
Legacy, still used for depth    Default UX on S/4HANA
</code></pre>
<h3>Basic navigation</h3>
<p>Common GUI concepts: the <strong>Easy Access menu</strong> (folder tree of transactions), <strong>favorites</strong> (bookmark frequent T-codes), and <strong>multiple sessions</strong> (open several screens at once, <code>/o</code> in the command field).</p>
<div class="callout"><span class="badge">Why it matters</span> Knowing whether a process lives in SAP GUI or Fiori — and its T-code — is the single most useful practical skill for navigating any SAP system quickly.</div>`,
    `<span class="eyebrow">SAP312 · Chương 2 · Bài 2.1</span>
<h2>Kiến trúc SAP &amp; điều hướng SAP GUI/Fiori</h2>
<h3>Kiến trúc client-server ba lớp</h3>
<pre><code>Lớp trình diễn   -> SAP GUI / Fiori Launchpad (người dùng nhìn thấy)
Lớp ứng dụng     -> logic nghiệp vụ, chạy giao dịch (application server ABAP/S4HANA)
Lớp dữ liệu      -> cơ sở dữ liệu trong bộ nhớ HANA (S/4HANA) hoặc RDBMS cũ (ECC)
</code></pre>
<p>Tách các lớp này cho phép hàng ngàn người dùng chia sẻ cùng dữ liệu và logic, mỗi người chỉ tương tác với một client trình diễn nhẹ.</p>
<h3>SAP GUI: mã giao dịch (T-code)</h3>
<p>Giao diện cổ điển, <strong>SAP GUI</strong>, điều hướng bằng các <strong>mã giao dịch (transaction code, T-code)</strong> ngắn gõ vào ô lệnh — vd <code>VA01</code> (tạo đơn bán hàng), <code>ME21N</code> (tạo đơn mua hàng), <code>FB60</code> (nhập hoá đơn nhà cung cấp), <code>MIGO</code> (dịch chuyển hàng hoá). Mỗi T-code mở trực tiếp một màn hình/chương trình cụ thể, bỏ qua menu.</p>
<h3>SAP Fiori: ứng dụng theo vai trò</h3>
<p><strong>SAP Fiori</strong> là giao diện web hiện đại, xây trên một <strong>Fiori Launchpad</strong> gồm các <strong>tile</strong> ứng dụng nhóm theo vai trò (vd "Nhân viên mua hàng", "Kế toán công nợ"). Ứng dụng Fiori đáp ứng nhiều thiết bị (desktop/tablet/điện thoại) và thường hiển thị chỉ số KPI thời gian thực ngay trên tile.</p>
<pre><code>SAP GUI                         SAP Fiori
------------------------        ------------------------
Gõ T-code, nhấn Enter           Bấm tile theo vai trò
Bảng dữ liệu dày, dùng bàn phím Thẻ đáp ứng, thân thiện chạm
Cũ, vẫn dùng khi cần chi tiết   Giao diện mặc định trên S/4HANA
</code></pre>
<h3>Điều hướng cơ bản</h3>
<p>Các khái niệm GUI phổ biến: <strong>menu Easy Access</strong> (cây thư mục các giao dịch), <strong>favorites</strong> (đánh dấu T-code hay dùng), và <strong>nhiều phiên (multiple sessions)</strong> (mở nhiều màn hình cùng lúc, gõ <code>/o</code> vào ô lệnh).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Biết một quy trình nằm ở SAP GUI hay Fiori — và T-code của nó — là kỹ năng thực dụng nhất để điều hướng nhanh trong bất kỳ hệ thống SAP.</div>`,
  ]]);

const c2q = quiz('sap312-quiz-2', 'Quiz 2 — SAP architecture & navigation|||Quiz 2 — Kiến trúc & điều hướng SAP', [
  { id: 'q1', question: 'Ba lớp trong kiến trúc client-server của SAP là gì?', options: ['Trình diễn, ứng dụng, dữ liệu', 'Bán hàng, mua hàng, kho', 'GUI, Fiori, HANA', 'Nhập, xử lý, xuất báo cáo'], correctIndex: 0, explanation: 'Kiến trúc ba lớp: lớp trình diễn (SAP GUI/Fiori), lớp ứng dụng (logic nghiệp vụ), lớp dữ liệu (cơ sở dữ liệu).' },
  { id: 'q2', question: 'Cách nhanh nhất để mở một giao dịch cụ thể trong SAP GUI là?', options: ['Duyệt qua toàn bộ menu Easy Access', 'Gõ transaction code (T-code) vào ô lệnh', 'Mở trình duyệt web ngoài', 'Không thể mở trực tiếp'], correctIndex: 1, explanation: 'T-code (vd VA01, ME21N) mở trực tiếp màn hình/chương trình, bỏ qua việc duyệt menu.' },
  { id: 'q3', question: 'SAP Fiori khác SAP GUI ở điểm nào?', options: ['Fiori chỉ chạy trên máy chủ, không có UI', 'Fiori là ứng dụng tile theo vai trò, đáp ứng nhiều thiết bị', 'Fiori không tồn tại trong S/4HANA', 'Fiori và GUI là một hệ thống giống hoàn toàn'], correctIndex: 1, explanation: 'Fiori Launchpad gồm các tile ứng dụng theo vai trò người dùng, thiết kế đáp ứng (responsive), là UX hiện đại của S/4HANA.' },
]);

const c3 = doc('sap312-3-1-master-data-org', '3.1 — Master data & organizational structure|||3.1 — Quản lý dữ liệu chủ & tổ chức doanh nghiệp',
  'Các loại dữ liệu chủ (material, customer, vendor, GL account), hệ thứ bậc tổ chức doanh nghiệp trong SAP (client, company code, plant, sales org, purchasing org).',
  [[
    `<span class="eyebrow">SAP312 · Chapter 3 · Lesson 3.1</span>
<h2>Master data &amp; organizational structure</h2>
<h3>What is master data?</h3>
<p><strong>Master data</strong> is data that stays relatively stable and is reused across many transactions — it is the "nouns" that every business process refers to. Key master data objects in SAP:</p>
<ul>
<li><strong>Material master</strong> — every product/raw material: description, unit of measure, price, weight, plant-specific data.</li>
<li><strong>Customer master</strong> — who you sell to: address, payment terms, credit limit, sales area assignment.</li>
<li><strong>Vendor master</strong> — who you buy from: address, bank data, payment terms, purchasing org assignment.</li>
<li><strong>GL (General Ledger) account master</strong> — the chart of accounts used to record every financial posting.</li>
</ul>
<p>Because ERP is one integrated system, <strong>every transaction references master data</strong> — a sales order needs a valid customer master AND material master; a purchase order needs a valid vendor master AND material master.</p>
<h3>Organizational structure hierarchy</h3>
<pre><code>Client (highest level, one company group)
  |- Company Code (a legal entity that produces its own financial statements)
       |- Plant (a physical/logical production or storage location)
            |- Storage Location (a specific place inventory is kept)
  |- Sales Organization (responsible for selling, tied to distribution channels)
  |- Purchasing Organization (responsible for buying, can serve one or many plants)
</code></pre>
<h3>Why this matters</h3>
<p>Every document in SAP (sales order, purchase order, invoice) is tagged to specific organizational units. Getting the org structure right up front determines which company code's books a transaction posts to, and which plant's inventory it affects.</p>
<div class="callout"><span class="badge">Garbage in, garbage out</span> ERP amplifies both good AND bad data. Inaccurate master data (wrong price, wrong tax code, duplicate customer) propagates instantly and consistently across every process that touches it.</div>`,
    `<span class="eyebrow">SAP312 · Chương 3 · Bài 3.1</span>
<h2>Quản lý dữ liệu chủ &amp; tổ chức doanh nghiệp</h2>
<h3>Dữ liệu chủ là gì?</h3>
<p><strong>Dữ liệu chủ (master data)</strong> là dữ liệu tương đối ổn định và được dùng lại trong nhiều giao dịch — đây là các "danh từ" mà mọi quy trình kinh doanh tham chiếu tới. Các đối tượng dữ liệu chủ chính trong SAP:</p>
<ul>
<li><strong>Material master (vật tư)</strong> — mọi sản phẩm/nguyên liệu: mô tả, đơn vị tính, giá, trọng lượng, dữ liệu theo từng plant.</li>
<li><strong>Customer master (khách hàng)</strong> — bán cho ai: địa chỉ, điều khoản thanh toán, hạn mức tín dụng, gắn với khu vực bán hàng.</li>
<li><strong>Vendor master (nhà cung cấp)</strong> — mua từ ai: địa chỉ, thông tin ngân hàng, điều khoản thanh toán, gắn với tổ chức mua hàng.</li>
<li><strong>GL account master (tài khoản sổ cái)</strong> — hệ thống tài khoản dùng để ghi mọi bút toán tài chính.</li>
</ul>
<p>Vì ERP là một hệ thống tích hợp, <strong>mọi giao dịch đều tham chiếu dữ liệu chủ</strong> — một đơn bán hàng cần customer master VÀ material master hợp lệ; một đơn mua hàng cần vendor master VÀ material master hợp lệ.</p>
<h3>Hệ thứ bậc tổ chức doanh nghiệp</h3>
<pre><code>Client (cấp cao nhất, một tập đoàn)
  |- Company Code (pháp nhân, tự lập báo cáo tài chính riêng)
       |- Plant (địa điểm sản xuất/lưu trữ, thực hoặc logic)
            |- Storage Location (vị trí cụ thể lưu tồn kho)
  |- Sales Organization (chịu trách nhiệm bán hàng, gắn với kênh phân phối)
  |- Purchasing Organization (chịu trách nhiệm mua hàng, có thể phục vụ một hay nhiều plant)
</code></pre>
<h3>Vì sao điều này quan trọng</h3>
<p>Mọi chứng từ trong SAP (đơn bán, đơn mua, hoá đơn) được gắn với các đơn vị tổ chức cụ thể. Xác định đúng cấu trúc tổ chức từ đầu quyết định giao dịch ghi vào sổ sách công ty nào, và ảnh hưởng đến tồn kho của plant nào.</p>
<div class="callout"><span class="badge">Rác vào, rác ra</span> ERP khuếch đại cả dữ liệu tốt LẪN dữ liệu xấu. Dữ liệu chủ sai (giá sai, mã thuế sai, khách hàng trùng) lan ra ngay lập tức và nhất quán tới mọi quy trình chạm vào nó.</div>`,
  ]]);

const c3q = quiz('sap312-quiz-3', 'Quiz 3 — Master data & org structure|||Quiz 3 — Dữ liệu chủ & tổ chức', [
  { id: 'q1', question: 'Đâu KHÔNG phải là một loại dữ liệu chủ trong SAP?', options: ['Material master', 'Customer master', 'Vendor master', 'Purchase order số 4500001234'], correctIndex: 3, explanation: 'Một đơn mua hàng cụ thể là DỮ LIỆU GIAO DỊCH (transaction data), không phải dữ liệu chủ — dữ liệu chủ là các đối tượng ổn định như material/customer/vendor master.' },
  { id: 'q2', question: 'Trong hệ thứ bậc tổ chức SAP, Plant nằm dưới đơn vị nào?', options: ['Client', 'Company Code', 'Storage Location', 'Sales Organization'], correctIndex: 1, explanation: 'Company Code (pháp nhân) chứa một hoặc nhiều Plant; Plant lại chứa các Storage Location.' },
  { id: 'q3', question: 'Vì sao dữ liệu chủ sai gây hậu quả nghiêm trọng trong ERP?', options: ['Vì ERP không dùng dữ liệu chủ', 'Vì sai sót lan ngay và nhất quán tới mọi quy trình tham chiếu nó', 'Vì dữ liệu chủ không được lưu trong hệ thống', 'Vì mỗi phòng ban có bản dữ liệu chủ riêng nên không ảnh hưởng nhau'], correctIndex: 1, explanation: 'Vì hệ thống tích hợp trên một cơ sở dữ liệu chung, một lỗi trong master data (vd giá sai) lan tới mọi giao dịch tham chiếu nó.' },
]);

const c4 = doc('sap312-4-1-procure-to-pay', '4.1 — Procure-to-Pay in SAP MM|||4.1 — Quy trình mua hàng (Procure-to-Pay) trong SAP MM',
  'Chu trình Procure-to-Pay: Purchase Requisition → Purchase Order → Goods Receipt → Invoice Receipt (3-way match) → Payment; các T-code chính của MM.',
  [[
    `<span class="eyebrow">SAP312 · Chapter 4 · Lesson 4.1</span>
<h2>Procure-to-Pay (P2P) in SAP MM</h2>
<h3>The full cycle</h3>
<pre><code>Purchase Requisition (PR)  -> internal request to buy (ME51N)
      |
Purchase Order (PO)        -> formal order sent to vendor (ME21N)
      |
Goods Receipt (GR)         -> stock physically received, inventory updated (MIGO)
      |
Invoice Receipt (IR)       -> vendor invoice recorded, verified (MIRO)
      |
Payment                    -> Accounts Payable pays the vendor (SAP FI)
</code></pre>
<h3>The 3-way match</h3>
<p>Before a vendor invoice is paid, SAP compares three documents — the <strong>Purchase Order</strong> (what was ordered/agreed price), the <strong>Goods Receipt</strong> (what was actually received) and the <strong>Invoice</strong> (what the vendor is billing). This <strong>3-way match</strong> in <code>MIRO</code> is a core control: it blocks payment for quantities/prices that don't agree, preventing overpayment or fraud.</p>
<h3>Key T-codes</h3>
<pre><code>ME51N  Create Purchase Requisition
ME21N  Create Purchase Order
MIGO   Post Goods Movement (Goods Receipt)
MIRO   Enter Incoming Invoice (Invoice Verification / 3-way match)
</code></pre>
<div class="callout"><span class="badge">Integration point</span> A Goods Receipt in MM doesn't just update inventory — it automatically posts a financial document in FI (inventory value increases, a GR/IR clearing account is credited). This is the module integration ERP is built for.</div>`,
    `<span class="eyebrow">SAP312 · Chương 4 · Bài 4.1</span>
<h2>Quy trình mua hàng Procure-to-Pay (P2P) trong SAP MM</h2>
<h3>Toàn bộ chu trình</h3>
<pre><code>Purchase Requisition (PR)  -> yêu cầu mua nội bộ (ME51N)
      |
Purchase Order (PO)        -> đơn đặt hàng chính thức gửi nhà cung cấp (ME21N)
      |
Goods Receipt (GR)         -> hàng thực nhận, cập nhật tồn kho (MIGO)
      |
Invoice Receipt (IR)       -> ghi nhận và kiểm tra hoá đơn nhà cung cấp (MIRO)
      |
Thanh toán                 -> bộ phận Công nợ trả cho nhà cung cấp (SAP FI)
</code></pre>
<h3>Kiểm tra khớp ba chiều (3-way match)</h3>
<p>Trước khi thanh toán hoá đơn nhà cung cấp, SAP so sánh ba chứng từ — <strong>Purchase Order</strong> (đã đặt gì/giá thoả thuận), <strong>Goods Receipt</strong> (thực nhận gì) và <strong>Invoice</strong> (nhà cung cấp tính tiền gì). <strong>Khớp ba chiều</strong> này trong <code>MIRO</code> là một kiểm soát cốt lõi: nó khoá thanh toán khi số lượng/giá không khớp, ngăn trả thừa hoặc gian lận.</p>
<h3>Các T-code chính</h3>
<pre><code>ME51N  Tạo Purchase Requisition (yêu cầu mua)
ME21N  Tạo Purchase Order (đơn mua)
MIGO   Ghi nhận dịch chuyển hàng hoá (Goods Receipt)
MIRO   Nhập hoá đơn đến (kiểm tra hoá đơn / khớp ba chiều)
</code></pre>
<div class="callout"><span class="badge">Điểm tích hợp</span> Một Goods Receipt trong MM không chỉ cập nhật tồn kho — nó tự động ghi một chứng từ tài chính trong FI (giá trị tồn kho tăng, tài khoản trung gian GR/IR được ghi có). Đây chính là sự tích hợp module mà ERP được xây để làm.</div>`,
  ]]);

const c4q = quiz('sap312-quiz-4', 'Quiz 4 — Procure-to-Pay|||Quiz 4 — Mua hàng (P2P)', [
  { id: 'q1', question: 'Thứ tự đúng của chu trình Procure-to-Pay là?', options: ['PO → PR → GR → IR', 'PR → PO → GR → IR', 'GR → PO → PR → IR', 'IR → GR → PO → PR'], correctIndex: 1, explanation: 'Đúng thứ tự: Purchase Requisition (PR) → Purchase Order (PO) → Goods Receipt (GR) → Invoice Receipt (IR).' },
  { id: 'q2', question: '"Khớp ba chiều" (3-way match) so sánh ba chứng từ nào?', options: ['PR, PO, GR', 'PO, Goods Receipt, Invoice', 'Customer master, Vendor master, GL account', 'Sales order, Delivery, Billing'], correctIndex: 1, explanation: '3-way match đối chiếu Purchase Order, Goods Receipt và Invoice để xác nhận số lượng/giá khớp trước khi thanh toán.' },
  { id: 'q3', question: 'T-code MIGO trong SAP MM dùng để làm gì?', options: ['Tạo đơn mua hàng', 'Ghi nhận dịch chuyển hàng hoá (Goods Receipt)', 'Nhập hoá đơn nhà cung cấp', 'Tạo yêu cầu mua hàng'], correctIndex: 1, explanation: 'MIGO dùng để ghi nhận dịch chuyển hàng hoá, bao gồm Goods Receipt khi hàng về.' },
]);

const c5 = doc('sap312-5-1-order-to-cash', '5.1 — Order-to-Cash in SAP SD|||5.1 — Quy trình bán hàng (Order-to-Cash) trong SAP SD',
  'Chu trình Order-to-Cash: Inquiry/Quotation → Sales Order → Delivery/Goods Issue → Billing → Payment; pricing và kiểm soát tín dụng; các T-code chính của SD.',
  [[
    `<span class="eyebrow">SAP312 · Chapter 5 · Lesson 5.1</span>
<h2>Order-to-Cash (O2C) in SAP SD</h2>
<h3>The full cycle</h3>
<pre><code>Inquiry / Quotation      -> customer asks/gets a quote (optional pre-sales step)
      |
Sales Order (SO)         -> customer commits to buy (VA01)
      |
Delivery + Goods Issue   -> pick, pack, ship; inventory reduced (VL01N)
      |
Billing / Invoice        -> invoice generated for the customer (VF01)
      |
Payment                  -> Accounts Receivable collects payment (SAP FI)
</code></pre>
<h3>Pricing &amp; credit management</h3>
<p>Every sales order runs through a <strong>pricing procedure</strong> — a chain of pricing conditions (base price, discounts, freight, tax) that determines the final amount. Before a delivery is created, SAP can run <strong>credit management</strong> checks: if the customer's open balance exceeds their credit limit, the order is blocked until Finance releases it.</p>
<h3>Key T-codes</h3>
<pre><code>VA01   Create Sales Order
VL01N  Create Outbound Delivery (pick/pack/goods issue)
VF01   Create Billing Document (invoice)
</code></pre>
<div class="callout"><span class="badge">Integration point</span> A Goods Issue in SD automatically reduces inventory (MM) and posts a Cost of Goods Sold entry (FI); Billing automatically posts revenue and a customer receivable (FI). One sales click, three modules updated.</div>`,
    `<span class="eyebrow">SAP312 · Chương 5 · Bài 5.1</span>
<h2>Quy trình bán hàng Order-to-Cash (O2C) trong SAP SD</h2>
<h3>Toàn bộ chu trình</h3>
<pre><code>Inquiry / Quotation      -> khách hỏi/nhận báo giá (bước tiền bán hàng, tuỳ chọn)
      |
Sales Order (SO)         -> khách xác nhận mua (VA01)
      |
Delivery + Goods Issue   -> lấy hàng, đóng gói, giao; giảm tồn kho (VL01N)
      |
Billing / Invoice        -> xuất hoá đơn cho khách (VF01)
      |
Thanh toán                -> bộ phận Phải thu thu tiền (SAP FI)
</code></pre>
<h3>Định giá &amp; kiểm soát tín dụng</h3>
<p>Mỗi đơn bán hàng chạy qua một <strong>thủ tục định giá (pricing procedure)</strong> — một chuỗi điều kiện giá (giá gốc, chiết khấu, phí vận chuyển, thuế) quyết định số tiền cuối. Trước khi tạo delivery, SAP có thể chạy kiểm tra <strong>quản lý tín dụng (credit management)</strong>: nếu dư nợ mở của khách vượt hạn mức tín dụng, đơn hàng bị khoá cho đến khi bộ phận Tài chính phê duyệt.</p>
<h3>Các T-code chính</h3>
<pre><code>VA01   Tạo Sales Order (đơn bán hàng)
VL01N  Tạo Outbound Delivery (lấy/đóng gói/xuất hàng)
VF01   Tạo chứng từ Billing (hoá đơn)
</code></pre>
<div class="callout"><span class="badge">Điểm tích hợp</span> Một Goods Issue trong SD tự động giảm tồn kho (MM) và ghi bút toán giá vốn hàng bán (FI); Billing tự động ghi doanh thu và khoản phải thu của khách (FI). Một cú bán hàng, ba module cùng cập nhật.</div>`,
  ]]);

const c5q = quiz('sap312-quiz-5', 'Quiz 5 — Order-to-Cash|||Quiz 5 — Bán hàng (O2C)', [
  { id: 'q1', question: 'Bước nào diễn ra NGAY SAU khi tạo Sales Order trong chu trình O2C?', options: ['Billing (xuất hoá đơn)', 'Delivery + Goods Issue (giao hàng)', 'Payment (thanh toán)', 'Purchase Order'], correctIndex: 1, explanation: 'Sau Sales Order là Delivery/Goods Issue (lấy, đóng gói, giao hàng), rồi mới đến Billing và Payment.' },
  { id: 'q2', question: 'Kiểm tra "credit management" trong SD dùng để làm gì?', options: ['Tính thuế cho đơn hàng', 'Khoá đơn hàng nếu khách vượt hạn mức tín dụng', 'Định tuyến giao hàng', 'Chọn kho xuất hàng'], correctIndex: 1, explanation: 'Nếu dư nợ mở của khách vượt hạn mức tín dụng, hệ thống khoá đơn hàng cho đến khi Tài chính phê duyệt.' },
  { id: 'q3', question: 'Goods Issue trong SD tự động ảnh hưởng tới module nào khác?', options: ['Chỉ ảnh hưởng SD', 'MM (giảm tồn kho) và FI (ghi giá vốn hàng bán)', 'Chỉ HR', 'Không ảnh hưởng module nào khác'], correctIndex: 1, explanation: 'Goods Issue giảm tồn kho (tích hợp với MM) và tự động ghi bút toán giá vốn hàng bán trong FI.' },
]);

const c6 = doc('sap312-6-1-fi-co', '6.1 — Financial Accounting & Controlling (SAP FI/CO)|||6.1 — Kế toán tài chính & kiểm soát (SAP FI/CO)',
  'SAP FI: sổ cái, công nợ phải trả/phải thu, tài sản cố định, báo cáo tài chính. SAP CO: trung tâm chi phí, trung tâm lợi nhuận, đơn hàng nội bộ, tính giá thành sản phẩm.',
  [[
    `<span class="eyebrow">SAP312 · Chapter 6 · Lesson 6.1</span>
<h2>Financial Accounting &amp; Controlling (FI/CO)</h2>
<h3>SAP FI — external, statutory accounting</h3>
<ul>
<li><strong>General Ledger (GL)</strong> — the central record of every financial transaction, organized by GL accounts (the chart of accounts).</li>
<li><strong>Accounts Payable (AP)</strong> — money the company owes vendors; vendor invoices, payments (fed by MM's Invoice Receipt).</li>
<li><strong>Accounts Receivable (AR)</strong> — money customers owe the company; customer invoices, incoming payments (fed by SD's Billing).</li>
<li><strong>Asset Accounting</strong> — tracks fixed assets (buildings, equipment) and their depreciation over time.</li>
</ul>
<p>FI feeds the statutory <strong>financial statements</strong> — balance sheet, income statement — required by law and auditors.</p>
<h3>SAP CO — internal management accounting</h3>
<ul>
<li><strong>Cost Centers</strong> — where costs are incurred (e.g. a department); used for internal cost tracking and budgeting.</li>
<li><strong>Profit Centers</strong> — units evaluated on both cost AND revenue, for internal profitability reporting.</li>
<li><strong>Internal Orders</strong> — track costs for a specific short-term project or event.</li>
<li><strong>Product Costing</strong> — calculates the standard cost to manufacture a product (materials + labor + overhead), used to value inventory and analyze margins.</li>
</ul>
<h3>Real-time integration</h3>
<p>FI/CO is rarely entered manually for operational transactions — <strong>MM postings (goods receipt, invoice) and SD postings (goods issue, billing) automatically create FI documents in real time.</strong> This is the payoff of the integrated database: Finance sees every operational event the moment it happens, with no batch delay or manual re-entry.</p>
<div class="callout"><span class="badge">FI vs. CO in one line</span> FI answers "what happened, for external reporting" (statutory). CO answers "where did the money go, and was it worth it" (internal management decisions).</div>`,
    `<span class="eyebrow">SAP312 · Chương 6 · Bài 6.1</span>
<h2>Kế toán tài chính &amp; kiểm soát (FI/CO)</h2>
<h3>SAP FI — kế toán tài chính, báo cáo bên ngoài</h3>
<ul>
<li><strong>Sổ cái (General Ledger, GL)</strong> — bản ghi trung tâm của mọi giao dịch tài chính, tổ chức theo hệ thống tài khoản GL.</li>
<li><strong>Công nợ phải trả (Accounts Payable, AP)</strong> — số tiền công ty nợ nhà cung cấp; hoá đơn nhà cung cấp, thanh toán (nhận dữ liệu từ Invoice Receipt của MM).</li>
<li><strong>Công nợ phải thu (Accounts Receivable, AR)</strong> — số tiền khách hàng nợ công ty; hoá đơn khách hàng, tiền thu vào (nhận dữ liệu từ Billing của SD).</li>
<li><strong>Kế toán tài sản (Asset Accounting)</strong> — theo dõi tài sản cố định (nhà, máy móc) và khấu hao theo thời gian.</li>
</ul>
<p>FI cung cấp dữ liệu cho <strong>báo cáo tài chính</strong> bắt buộc theo luật — bảng cân đối kế toán, báo cáo kết quả kinh doanh — mà cơ quan kiểm toán yêu cầu.</p>
<h3>SAP CO — kế toán quản trị nội bộ</h3>
<ul>
<li><strong>Trung tâm chi phí (Cost Center)</strong> — nơi chi phí phát sinh (vd một phòng ban); dùng để theo dõi và lập ngân sách nội bộ.</li>
<li><strong>Trung tâm lợi nhuận (Profit Center)</strong> — đơn vị được đánh giá cả chi phí VÀ doanh thu, để báo cáo lợi nhuận nội bộ.</li>
<li><strong>Đơn hàng nội bộ (Internal Order)</strong> — theo dõi chi phí cho một dự án hoặc sự kiện ngắn hạn cụ thể.</li>
<li><strong>Tính giá thành sản phẩm (Product Costing)</strong> — tính chi phí chuẩn để sản xuất một sản phẩm (vật tư + nhân công + chi phí chung), dùng để định giá tồn kho và phân tích biên lợi nhuận.</li>
</ul>
<h3>Tích hợp thời gian thực</h3>
<p>FI/CO hiếm khi được nhập tay cho các giao dịch vận hành — <strong>bút toán từ MM (goods receipt, invoice) và từ SD (goods issue, billing) tự động tạo chứng từ FI theo thời gian thực.</strong> Đây là kết quả của cơ sở dữ liệu tích hợp: bộ phận Tài chính thấy mọi sự kiện vận hành ngay khi nó xảy ra, không có độ trễ theo lô hay nhập lại tay.</p>
<div class="callout"><span class="badge">FI vs. CO trong một câu</span> FI trả lời "điều gì đã xảy ra, cho báo cáo bên ngoài" (bắt buộc theo luật). CO trả lời "tiền đi đâu, và có đáng không" (quyết định quản trị nội bộ).</div>`,
  ]]);

const c6q = quiz('sap312-quiz-6', 'Quiz 6 — FI/CO|||Quiz 6 — Kế toán & kiểm soát (FI/CO)', [
  { id: 'q1', question: 'Accounts Receivable (AR) trong SAP FI theo dõi điều gì?', options: ['Tiền công ty nợ nhà cung cấp', 'Tiền khách hàng nợ công ty', 'Chi phí trung tâm chi phí', 'Khấu hao tài sản'], correctIndex: 1, explanation: 'AR (công nợ phải thu) theo dõi số tiền khách hàng còn nợ công ty, phát sinh từ hoá đơn bán hàng (Billing).' },
  { id: 'q2', question: 'Sự khác biệt chính giữa FI và CO là gì?', options: ['FI là báo cáo bên ngoài bắt buộc theo luật; CO là quản trị nội bộ', 'FI và CO là một module giống nhau', 'CO chỉ dùng cho nhân sự', 'FI không liên quan gì đến báo cáo tài chính'], correctIndex: 0, explanation: 'FI phục vụ báo cáo tài chính bắt buộc (bên ngoài); CO phục vụ phân tích và quyết định quản trị (nội bộ).' },
  { id: 'q3', question: 'Vì sao hầu hết chứng từ FI/CO không cần nhập tay?', options: ['Vì FI/CO không được dùng trong thực tế', 'Vì MM và SD tự động tạo bút toán FI theo thời gian thực khi giao dịch xảy ra', 'Vì công ty không cần báo cáo tài chính', 'Vì SAP tự xoá dữ liệu tài chính mỗi ngày'], correctIndex: 1, explanation: 'Nhờ tích hợp thời gian thực, các giao dịch vận hành ở MM/SD tự động sinh bút toán FI, không cần nhập lại tay.' },
]);

const c7 = doc('sap312-7-1-pp-wm', '7.1 — Production Planning & Warehouse Management (PP/WM)|||7.1 — Lập kế hoạch sản xuất & quản lý kho (PP/WM)',
  'SAP PP: Bill of Materials (BOM), Routing, MRP run, Production order. SAP WM: cấu trúc kho, storage bin, chiến lược nhập/xuất kho; tích hợp với MM và SD.',
  [[
    `<span class="eyebrow">SAP312 · Chapter 7 · Lesson 7.1</span>
<h2>Production Planning &amp; Warehouse Management (PP/WM)</h2>
<h3>SAP PP — planning what and how to produce</h3>
<ul>
<li><strong>Bill of Materials (BOM)</strong> — the "recipe": every component and quantity needed to build one unit of a finished product.</li>
<li><strong>Routing</strong> — the "instructions": the sequence of operations (and work centers/machines) needed to manufacture the product.</li>
<li><strong>MRP run (Material Requirements Planning)</strong> — compares demand (sales orders/forecast) against current stock and existing supply, then proposes what to produce or purchase, and when.</li>
<li><strong>Production Order</strong> — the actual work order that authorizes and tracks manufacturing of a specific quantity, consuming BOM components and recording labor/machine time.</li>
</ul>
<h3>SAP WM — where inventory physically lives</h3>
<p><strong>Warehouse Management</strong> models the warehouse below the Storage Location level, down to individual <strong>storage bins</strong> (a specific shelf/rack slot). It manages <strong>put-away</strong> (where to place received goods) and <strong>picking</strong> (where to retrieve goods for an outbound delivery), using configurable strategies (e.g. fixed bin, nearest empty bin, FIFO).</p>
<h3>Where PP/WM connects to the rest of ERP</h3>
<pre><code>Sales forecast/orders (SD) -> MRP run (PP) -> Purchase requisitions for raw material (MM)
                                            -> Production orders consume raw material (WM picks it)
                                            -> Finished goods put away (WM) -> available for SD sales orders
</code></pre>
<div class="callout"><span class="badge">Closing the loop</span> PP/WM is where ERP's promise becomes physical: a sales forecast in SD can automatically trigger a purchase requisition in MM and a pick task in WM — one plan, three modules acting on it.</div>`,
    `<span class="eyebrow">SAP312 · Chương 7 · Bài 7.1</span>
<h2>Lập kế hoạch sản xuất &amp; quản lý kho (PP/WM)</h2>
<h3>SAP PP — lập kế hoạch sản xuất gì và như thế nào</h3>
<ul>
<li><strong>Bill of Materials (BOM)</strong> — "công thức": mọi thành phần và số lượng cần để làm ra một đơn vị sản phẩm hoàn thiện.</li>
<li><strong>Routing</strong> — "hướng dẫn": trình tự các công đoạn (và trung tâm làm việc/máy móc) cần để sản xuất sản phẩm.</li>
<li><strong>MRP run (Material Requirements Planning)</strong> — so sánh nhu cầu (đơn hàng bán/dự báo) với tồn kho hiện tại và nguồn cung đã có, rồi đề xuất sản xuất hoặc mua gì, khi nào.</li>
<li><strong>Production Order (đơn sản xuất)</strong> — lệnh sản xuất thực tế cho phép và theo dõi việc sản xuất một số lượng cụ thể, tiêu thụ các thành phần BOM và ghi nhận thời gian nhân công/máy.</li>
</ul>
<h3>SAP WM — hàng hoá nằm ở đâu trong thực tế</h3>
<p><strong>Quản lý kho (Warehouse Management)</strong> mô hình hoá kho ở mức chi tiết hơn Storage Location, xuống tới từng <strong>storage bin</strong> (một vị trí kệ/giá cụ thể). Nó quản lý <strong>nhập kho (put-away)</strong> (đặt hàng vừa nhận ở đâu) và <strong>lấy hàng (picking)</strong> (lấy hàng ở đâu cho một lô giao hàng), theo các chiến lược có thể cấu hình (vd bin cố định, bin trống gần nhất, FIFO).</p>
<h3>PP/WM kết nối với phần còn lại của ERP thế nào</h3>
<pre><code>Dự báo/đơn bán hàng (SD) -> Chạy MRP (PP) -> Yêu cầu mua nguyên liệu (MM)
                                          -> Đơn sản xuất tiêu thụ nguyên liệu (WM lấy hàng)
                                          -> Nhập kho hàng hoàn thiện (WM) -> sẵn sàng cho đơn bán (SD)
</code></pre>
<div class="callout"><span class="badge">Khép vòng lặp</span> PP/WM là nơi lời hứa của ERP trở nên vật lý: một dự báo bán hàng ở SD có thể tự động kích hoạt yêu cầu mua ở MM và tác vụ lấy hàng ở WM — một kế hoạch, ba module cùng hành động.</div>`,
  ]]);

const c7q = quiz('sap312-quiz-7', 'Quiz 7 — PP/WM|||Quiz 7 — Sản xuất & kho (PP/WM)', [
  { id: 'q1', question: 'Bill of Materials (BOM) trong SAP PP mô tả điều gì?', options: ['Trình tự công đoạn sản xuất', 'Danh sách thành phần và số lượng để làm ra một sản phẩm', 'Vị trí kệ hàng trong kho', 'Hạn mức tín dụng của khách hàng'], correctIndex: 1, explanation: 'BOM là "công thức" — liệt kê mọi thành phần và số lượng cần để sản xuất một đơn vị sản phẩm.' },
  { id: 'q2', question: 'MRP run làm gì?', options: ['Ghi nhận hoá đơn nhà cung cấp', 'So sánh nhu cầu với tồn kho/cung hiện có và đề xuất sản xuất/mua gì, khi nào', 'Tạo hoá đơn bán hàng', 'Quản lý hạn mức tín dụng'], correctIndex: 1, explanation: 'MRP (Material Requirements Planning) so khớp nhu cầu với cung hiện có để đề xuất kế hoạch sản xuất/mua hàng.' },
  { id: 'q3', question: 'SAP WM quản lý kho ở mức chi tiết nào?', options: ['Chỉ ở mức Company Code', 'Xuống tới từng storage bin (vị trí kệ cụ thể)', 'Chỉ ở mức quốc gia', 'WM không quản lý vị trí vật lý'], correctIndex: 1, explanation: 'WM mô hình hoá kho xuống tới storage bin — vị trí kệ/giá cụ thể — để quản lý nhập/xuất kho chính xác.' },
]);

const c8 = doc('sap312-8-1-implementation-trends', '8.1 — ERP implementation, change management & trends|||8.1 — Triển khai ERP, quản trị thay đổi & xu hướng',
  'Phương pháp SAP Activate (Prepare, Explore, Realize, Deploy, Run), quản trị thay đổi và go-live, xu hướng S/4HANA, cloud ERP, embedded analytics.',
  [[
    `<span class="eyebrow">SAP312 · Chapter 8 · Lesson 8.1</span>
<h2>ERP implementation, change management &amp; trends</h2>
<h3>SAP Activate: five phases</h3>
<pre><code>Prepare  -> project kickoff, scope, team, infrastructure ready
Explore  -> fit-to-standard workshops: does SAP standard cover the process, or is a gap found?
Realize  -> configure/build the solution, test it (unit, integration, user acceptance)
Deploy   -> final data migration, cutover planning, go-live
Run      -> post-go-live support, continuous improvement
</code></pre>
<p>This replaced the older, more rigid <strong>ASAP methodology</strong> with an agile, iterative approach centered on SAP's pre-built <strong>best-practice</strong> processes — implementers start from a working standard system and adjust only where truly needed.</p>
<h3>Change management is not optional</h3>
<p>Configuring the system correctly is necessary but not sufficient. Employees must <strong>learn new screens, new terminology (T-codes, master data), and often new job responsibilities</strong> as work reorganizes around end-to-end processes rather than departmental tasks. Training, clear communication, and visible leadership sponsorship determine whether an implementation actually delivers value after go-live — many well-configured ERP projects still fail here.</p>
<h3>Where ERP is headed</h3>
<ul>
<li><strong>S/4HANA migration</strong> — companies still on the older ECC system are migrating to S/4HANA's in-memory database and simplified data model (SAP ends mainstream ECC maintenance in 2027).</li>
<li><strong>Cloud ERP</strong> — subscription-based, vendor-hosted ERP (e.g. SAP S/4HANA Cloud) reduces infrastructure burden but requires more standardization to the vendor's process.</li>
<li><strong>Embedded analytics</strong> — real-time dashboards and KPIs built directly into Fiori apps, instead of separate BI extracts run overnight.</li>
</ul>
<div class="callout"><span class="badge">Full-circle takeaway</span> Everything in Chapters 1-7 — integration, master data, P2P, O2C, FI/CO, PP/WM — only delivers value if the implementation itself is managed well and people actually adopt the new process.</div>`,
    `<span class="eyebrow">SAP312 · Chương 8 · Bài 8.1</span>
<h2>Triển khai ERP, quản trị thay đổi &amp; xu hướng</h2>
<h3>SAP Activate: năm giai đoạn</h3>
<pre><code>Prepare  -> khởi động dự án, xác định phạm vi, đội ngũ, chuẩn bị hạ tầng
Explore  -> workshop fit-to-standard: SAP chuẩn đã đủ đáp ứng, hay phát hiện gap?
Realize  -> cấu hình/dựng giải pháp, kiểm thử (unit, tích hợp, chấp nhận người dùng)
Deploy   -> chuyển dữ liệu cuối, lập kế hoạch cutover, go-live
Run      -> hỗ trợ sau go-live, cải tiến liên tục
</code></pre>
<p>Phương pháp này thay thế <strong>ASAP methodology</strong> cũ, cứng nhắc hơn, bằng cách làm linh hoạt, lặp lại, xoay quanh các quy trình <strong>thực hành tốt nhất (best-practice)</strong> dựng sẵn của SAP — người triển khai bắt đầu từ một hệ thống chuẩn đã chạy được và chỉ điều chỉnh khi thật sự cần.</p>
<h3>Quản trị thay đổi không phải là tuỳ chọn</h3>
<p>Cấu hình đúng hệ thống là cần nhưng chưa đủ. Nhân viên phải <strong>học màn hình mới, thuật ngữ mới (T-code, dữ liệu chủ), và thường cả trách nhiệm công việc mới</strong> khi công việc tổ chức lại theo quy trình xuyên suốt thay vì nhiệm vụ theo phòng ban. Đào tạo, truyền thông rõ ràng, và sự ủng hộ rõ rệt từ lãnh đạo quyết định một dự án triển khai có thực sự tạo ra giá trị sau go-live hay không — nhiều dự án ERP cấu hình tốt vẫn thất bại ở khâu này.</p>
<h3>ERP đang đi về đâu</h3>
<ul>
<li><strong>Di chuyển lên S/4HANA</strong> — các công ty còn dùng ECC cũ đang chuyển sang cơ sở dữ liệu trong bộ nhớ và mô hình dữ liệu đơn giản hoá của S/4HANA (SAP dừng hỗ trợ chính cho ECC vào năm 2027).</li>
<li><strong>Cloud ERP</strong> — ERP theo mô hình thuê bao, do nhà cung cấp lưu trữ (vd SAP S/4HANA Cloud) giảm gánh nặng hạ tầng nhưng đòi hỏi chuẩn hoá nhiều hơn theo quy trình của nhà cung cấp.</li>
<li><strong>Phân tích tích hợp (embedded analytics)</strong> — dashboard và KPI thời gian thực nằm ngay trong ứng dụng Fiori, thay vì trích xuất BI riêng chạy qua đêm.</li>
</ul>
<div class="callout"><span class="badge">Khép vòng toàn môn</span> Mọi thứ từ Chương 1-7 — tích hợp, dữ liệu chủ, P2P, O2C, FI/CO, PP/WM — chỉ tạo ra giá trị nếu chính việc triển khai được quản trị tốt và con người thực sự áp dụng quy trình mới.</div>`,
  ]]);

const c8q = quiz('sap312-quiz-8', 'Quiz 8 — Implementation & trends|||Quiz 8 — Triển khai & xu hướng', [
  { id: 'q1', question: 'Thứ tự đúng của 5 giai đoạn SAP Activate là?', options: ['Explore → Prepare → Realize → Deploy → Run', 'Prepare → Explore → Realize → Deploy → Run', 'Realize → Deploy → Prepare → Explore → Run', 'Deploy → Run → Prepare → Explore → Realize'], correctIndex: 1, explanation: 'SAP Activate gồm 5 giai đoạn theo thứ tự: Prepare, Explore, Realize, Deploy, Run.' },
  { id: 'q2', question: 'Vì sao quản trị thay đổi (change management) quan trọng khi triển khai ERP?', options: ['Vì cấu hình hệ thống đúng là đủ để thành công', 'Vì nhân viên phải học cách làm việc mới, và thiếu đào tạo/ủng hộ dễ khiến dự án thất bại dù cấu hình tốt', 'Vì change management chỉ áp dụng cho bộ phận IT', 'Vì ERP không thay đổi cách làm việc của ai'], correctIndex: 1, explanation: 'Nhiều dự án ERP cấu hình đúng vẫn thất bại vì nhân viên không được đào tạo/ủng hộ đủ để áp dụng quy trình mới.' },
  { id: 'q3', question: 'Xu hướng nào sau đây thuộc về hướng phát triển của ERP hiện nay?', options: ['Quay lại các hệ thống rời rạc theo phòng ban', 'Di chuyển lên S/4HANA, cloud ERP, và phân tích tích hợp (embedded analytics)', 'Loại bỏ hoàn toàn dữ liệu chủ', 'Ngừng dùng cơ sở dữ liệu chung'], correctIndex: 1, explanation: 'Xu hướng chính: di chuyển ECC → S/4HANA, ERP trên cloud, và phân tích/KPI tích hợp ngay trong ứng dụng.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'SAP312',
    slug: 'sap312-he-thong-erp-kh225i-niem-v224-thuc-h224nh-voi-sap',
    title: 'ERP Systems: Concepts and Practice with SAP',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SAP312.webp',
    shortDescription: 'ERP concepts through hands-on SAP: integration, GUI/Fiori navigation, master data & org structure, Procure-to-Pay (MM), Order-to-Cash (SD), FI/CO, PP/WM, and implementation (SAP Activate) & trends.|||Khái niệm ERP qua thực hành SAP: tích hợp, điều hướng GUI/Fiori, dữ liệu chủ & tổ chức, mua hàng (MM), bán hàng (SD), FI/CO, PP/WM, và triển khai (SAP Activate) & xu hướng.',
    description: 'Môn <strong>SAP312 — ERP Systems: Concepts and Practice with SAP</strong> (kỳ 5) giúp hiểu <strong>vì sao doanh nghiệp cần một hệ thống ERP tích hợp</strong> và cách nó vận hành qua <strong>SAP</strong> — bộ ERP dẫn đầu thị trường. Từ <strong>khái niệm ERP &amp; quy trình tích hợp</strong> → <strong>kiến trúc SAP &amp; điều hướng GUI/Fiori</strong> → <strong>dữ liệu chủ &amp; tổ chức doanh nghiệp</strong> → <strong>mua hàng (MM)</strong> → <strong>bán hàng (SD)</strong> → <strong>kế toán tài chính &amp; kiểm soát (FI/CO)</strong> → <strong>sản xuất &amp; kho (PP/WM)</strong> → <strong>triển khai, quản trị thay đổi &amp; xu hướng (S/4HANA, cloud, analytics)</strong>. Bám giáo trình Motiwalla &amp; Thompson và SAP Press, song ngữ, có ví dụ T-code thật và quiz mỗi chương.',
    whatYouLearn: 'ERP là gì & ba nguyên tắc tích hợp; góc nhìn quy trình vs. phòng ban; kiến trúc client-server & sự khác biệt SAP GUI/Fiori; dữ liệu chủ (material/customer/vendor/GL) & thứ bậc tổ chức (client/company code/plant); chu trình Procure-to-Pay (PR→PO→GR→IR) & khớp ba chiều trong MM; chu trình Order-to-Cash (SO→delivery→billing) & định giá/tín dụng trong SD; General Ledger, AP/AR, Asset Accounting (FI) & cost/profit center, product costing (CO); BOM, Routing, MRP run, Production Order (PP) & storage bin, put-away/picking (WM); phương pháp triển khai SAP Activate, quản trị thay đổi, và xu hướng S/4HANA/cloud/analytics.',
    requirements: 'Kiến thức nhập môn Quản trị kinh doanh và Hệ thống thông tin quản lý. Không cần biết trước SAP — môn dạy từ khái niệm ERP đến điều hướng SAP cơ bản.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Motiwalla & Thompson, SAP Press, SAP Learning Hub, tài liệu chính thức, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'ERP là gì, lịch sử MRP→ERP→S/4HANA, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ERP & quy trình tích hợp|||Chapter 1 — ERP overview & integrated processes', description: 'Nguyên tắc ERP, góc nhìn quy trình, lợi ích & thách thức.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kiến trúc SAP & điều hướng GUI/Fiori|||Chapter 2 — SAP architecture & GUI/Fiori navigation', description: 'Client-server 3 lớp, T-code, Fiori Launchpad.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dữ liệu chủ & tổ chức doanh nghiệp|||Chapter 3 — Master data & organizational structure', description: 'Material/customer/vendor/GL master, client→company code→plant.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mua hàng (Procure-to-Pay) trong SAP MM|||Chapter 4 — Procure-to-Pay in SAP MM', description: 'PR→PO→GR→IR, khớp ba chiều, T-code MM.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bán hàng (Order-to-Cash) trong SAP SD|||Chapter 5 — Order-to-Cash in SAP SD', description: 'SO→delivery→billing, định giá, tín dụng, T-code SD.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kế toán tài chính & kiểm soát (FI/CO)|||Chapter 6 — Financial Accounting & Controlling (FI/CO)', description: 'GL, AP/AR, tài sản, cost/profit center, product costing.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sản xuất & quản lý kho (PP/WM)|||Chapter 7 — Production Planning & Warehouse Management (PP/WM)', description: 'BOM, Routing, MRP, Production Order, storage bin.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Triển khai, quản trị thay đổi & xu hướng|||Chapter 8 — Implementation, change management & trends', description: 'SAP Activate, change management, S/4HANA, cloud, analytics.', lessons: [c8, c8q] },
  ],
};
