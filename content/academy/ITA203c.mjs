/**
 * ITA203c — Management Information Systems (Hệ thống thông tin quản lý), ngành
 * Hệ thống thông tin FPTU, Kỳ 3. Môn QUẢN LÝ HTTT trong doanh nghiệp — vai trò
 * chiến lược của HTTT, không phải kỹ thuật lập trình. ⚠️ PHÂN BIỆT với ISD201
 * (Information Systems in the Digital Age): ISD201 nghiêng nền tảng/tổng quan
 * cho người mới; ITA203c nghiêng ra quyết định quản lý, chiến lược & quản trị.
 * Nguồn chuẩn: Laudon & Laudon "Management Information Systems: Managing the
 * Digital Firm"; O'Brien & Marakas "Management Information Systems"; HBR;
 * Gartner. Song ngữ + mô hình + ví dụ doanh nghiệp thật. Lộ trình tự học 4 bước.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ita203c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (Laudon, O’Brien), HBR & Gartner, khoá học miễn phí, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">ITA203c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Management Information Systems</strong> — how firms use IS to compete, decide and run their operations — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are trustworthy, mostly free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ITA203c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/management-information-systems-managing-the-digital-firm/P200000003511" target="_blank" rel="noopener"><em>Management Information Systems: Managing the Digital Firm</em> — Laudon &amp; Laudon</a> (the standard MIS text)</li>
<li><a href="https://www.mheducation.com/highered/product/management-information-systems-o-brien-marakas.html" target="_blank" rel="noopener"><em>Management Information Systems</em> — O'Brien &amp; Marakas</a></li>
</ul>
<h3>🌐 Industry reading</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/information-technology" target="_blank" rel="noopener">Harvard Business Review — Information Technology</a> (strategy &amp; digital cases)</li>
<li><a href="https://www.gartner.com/en/information-technology" target="_blank" rel="noopener">Gartner — IT insights &amp; frameworks</a></li>
</ul>
<h3>▶️ Free courses</h3>
<ul>
<li><a href="https://www.coursera.org/learn/information-systems" target="_blank" rel="noopener">Coursera — Information Systems &amp; digital transformation</a></li>
<li><a href="https://www.youtube.com/results?search_query=management+information+systems+laudon" target="_blank" rel="noopener">MIS lecture series on YouTube</a></li>
</ul>
<h3>🛠️ Tools to try</h3>
<ul>
<li><a href="https://lucid.app/" target="_blank" rel="noopener">Lucidchart</a> — draw process &amp; system diagrams (BPMN, DFD)</li>
<li><a href="https://www.microsoft.com/en-us/power-platform/products/power-bi" target="_blank" rel="noopener">Power BI (free desktop)</a> — build BI dashboards</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what MIS is, the organization–management–technology view, and how IS creates business value.</li>
<li><strong>Strategy</strong> — Porter's forces &amp; value chain, IT infrastructure, data &amp; enterprise systems (ERP/SCM/CRM).</li>
<li><strong>Practice</strong> — map a real firm's processes, sketch its systems, and build one small BI dashboard.</li>
<li><strong>Governance</strong> — learn how firms secure, audit and govern IT (security, ethics, compliance).</li>
</ol></div>`,
    `<span class="eyebrow">ITA203c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Hệ thống thông tin quản lý</strong> — doanh nghiệp dùng HTTT để cạnh tranh, ra quyết định và vận hành thế nào — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn đáng tin, phần lớn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ITA203c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/management-information-systems-managing-the-digital-firm/P200000003511" target="_blank" rel="noopener"><em>Management Information Systems: Managing the Digital Firm</em> — Laudon &amp; Laudon</a> (sách MIS chuẩn)</li>
<li><a href="https://www.mheducation.com/highered/product/management-information-systems-o-brien-marakas.html" target="_blank" rel="noopener"><em>Management Information Systems</em> — O'Brien &amp; Marakas</a></li>
</ul>
<h3>🌐 Đọc thêm từ ngành</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/information-technology" target="_blank" rel="noopener">Harvard Business Review — Công nghệ thông tin</a> (chiến lược &amp; case số hoá)</li>
<li><a href="https://www.gartner.com/en/information-technology" target="_blank" rel="noopener">Gartner — phân tích &amp; khung tham chiếu CNTT</a></li>
</ul>
<h3>▶️ Khoá học miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/learn/information-systems" target="_blank" rel="noopener">Coursera — Hệ thống thông tin &amp; chuyển đổi số</a></li>
<li><a href="https://www.youtube.com/results?search_query=management+information+systems+laudon" target="_blank" rel="noopener">Chuỗi bài giảng MIS trên YouTube</a></li>
</ul>
<h3>🛠️ Công cụ nên thử</h3>
<ul>
<li><a href="https://lucid.app/" target="_blank" rel="noopener">Lucidchart</a> — vẽ sơ đồ quy trình &amp; hệ thống (BPMN, DFD)</li>
<li><a href="https://www.microsoft.com/en-us/power-platform/products/power-bi" target="_blank" rel="noopener">Power BI (bản desktop miễn phí)</a> — dựng dashboard BI</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — MIS là gì, góc nhìn tổ chức–quản lý–công nghệ, và HTTT tạo giá trị kinh doanh ra sao.</li>
<li><strong>Chiến lược</strong> — năm lực lượng &amp; chuỗi giá trị của Porter, hạ tầng CNTT, dữ liệu &amp; hệ thống doanh nghiệp (ERP/SCM/CRM).</li>
<li><strong>Thực hành</strong> — vẽ quy trình một doanh nghiệp thật, phác các hệ thống của nó, và dựng một dashboard BI nhỏ.</li>
<li><strong>Quản trị</strong> — cách doanh nghiệp bảo mật, kiểm toán và quản trị CNTT (an ninh, đạo đức, tuân thủ).</li>
</ol></div>`,
  ]]);

const intro = doc('ita203c-0-1-overview', 'Course overview: Management Information Systems|||Tổng quan: Hệ thống thông tin quản lý',
  'MIS là gì và khác gì môn HTTT nhập môn; vì sao nhà quản lý phải hiểu HTTT; lộ trình 8 chương: vai trò → chiến lược → hạ tầng → dữ liệu → hệ thống doanh nghiệp → TMĐT → xây dựng → quản trị.',
  [[
    `<span class="eyebrow">ITA203c · Lesson 0.1 · Overview</span>
<h2>Management Information Systems</h2>
<p class="lead">This course is about <strong>managing information systems to run a business</strong> — not about writing code. It asks the manager's questions: which systems create value, how IS delivers competitive advantage, and how a firm builds, secures and governs its technology.</p>
<h3>MIS in one sentence</h3>
<p>An <strong>information system</strong> collects, stores, processes and distributes information to support decision-making and control in an organization. <strong>MIS</strong> is the discipline of using such systems to help managers plan, decide and coordinate.</p>
<h3>Three questions every chapter answers</h3>
<ul>
<li><strong>What is the technology?</strong> — infrastructure, data, applications.</li>
<li><strong>What is the business value?</strong> — cost, speed, quality, new revenue.</li>
<li><strong>What must management do?</strong> — strategy, change, risk, governance.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Role of MIS → IS &amp; competitive advantage → IT infrastructure &amp; cloud → data &amp; knowledge → enterprise systems (ERP/SCM/CRM) → e-commerce &amp; the digital firm → building &amp; managing systems → security, ethics &amp; IT governance. Bilingual, with real-company examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">Not the same as ISD201</span> Introductory IS courses teach what a system is; ITA203c takes the next step — using IS as a <strong>management and strategy</strong> tool inside a real firm.</div>`,
    `<span class="eyebrow">ITA203c · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống thông tin quản lý</h2>
<p class="lead">Môn này nói về <strong>quản lý hệ thống thông tin để vận hành doanh nghiệp</strong> — không phải về viết mã. Nó đặt câu hỏi của nhà quản lý: hệ thống nào tạo giá trị, HTTT đem lại lợi thế cạnh tranh ra sao, và doanh nghiệp xây, bảo mật, quản trị công nghệ thế nào.</p>
<h3>MIS trong một câu</h3>
<p><strong>Hệ thống thông tin</strong> thu thập, lưu trữ, xử lý và phân phối thông tin để hỗ trợ ra quyết định và kiểm soát trong tổ chức. <strong>MIS</strong> là ngành dùng những hệ thống đó để giúp nhà quản lý lập kế hoạch, quyết định và phối hợp.</p>
<h3>Ba câu hỏi mỗi chương đều trả lời</h3>
<ul>
<li><strong>Công nghệ là gì?</strong> — hạ tầng, dữ liệu, ứng dụng.</li>
<li><strong>Giá trị kinh doanh là gì?</strong> — chi phí, tốc độ, chất lượng, doanh thu mới.</li>
<li><strong>Quản lý phải làm gì?</strong> — chiến lược, thay đổi, rủi ro, quản trị.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Vai trò MIS → HTTT &amp; lợi thế cạnh tranh → hạ tầng CNTT &amp; cloud → dữ liệu &amp; tri thức → hệ thống doanh nghiệp (ERP/SCM/CRM) → TMĐT &amp; doanh nghiệp số → xây dựng &amp; quản lý hệ thống → bảo mật, đạo đức &amp; quản trị CNTT. Song ngữ, có ví dụ doanh nghiệp thật và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Khác với ISD201</span> Môn HTTT nhập môn dạy hệ thống là gì; ITA203c đi bước tiếp theo — dùng HTTT như công cụ <strong>quản lý và chiến lược</strong> bên trong một doanh nghiệp thật.</div>`,
  ]]);

const c1 = doc('ita203c-1-1-role-of-mis', '1.1 — The role of information systems in organizations|||1.1 — Vai trò của HTTT trong tổ chức',
  'HTTT là hệ thống xã hội - kỹ thuật; ba chiều tổ chức - quản lý - công nghệ; các loại hệ thống theo cấp (TPS, MIS, DSS, ESS) và cách chúng phục vụ ra quyết định.',
  [[
    `<span class="eyebrow">ITA203c · Chapter 1 · Lesson 1.1</span>
<h2>The role of information systems in organizations</h2>
<h3>A socio-technical system</h3>
<p>Laudon &amp; Laudon frame every IS as three interacting dimensions — technology alone is never enough:</p>
<ul>
<li><strong>Organization</strong> — people, structure, business processes, culture.</li>
<li><strong>Management</strong> — decisions, strategy, leadership, change.</li>
<li><strong>Technology</strong> — hardware, software, data, networks.</li>
</ul>
<p>A project fails when one dimension is ignored — a great platform with untrained staff and no process change delivers no value.</p>
<h3>Systems by management level</h3>
<pre><code>Level        System   Serves
Operational  TPS      day-to-day transactions (orders, payroll)
Middle mgmt  MIS/DSS  reports &amp; what-if analysis for decisions
Senior mgmt  ESS      dashboards &amp; KPIs for strategy
</code></pre>
<p><strong>TPS</strong> feed the data; <strong>MIS/DSS</strong> turn it into decisions; <strong>ESS</strong> give executives the big picture.</p>
<div class="callout"><span class="badge">Real example</span> Walmart's point-of-sale TPS captures every sale; that data rolls up into MIS reports and executive dashboards that decide restocking, pricing and store layout — one data trail, three levels of decisions.</div>`,
    `<span class="eyebrow">ITA203c · Chương 1 · Bài 1.1</span>
<h2>Vai trò của HTTT trong tổ chức</h2>
<h3>Một hệ thống xã hội - kỹ thuật</h3>
<p>Laudon &amp; Laudon nhìn mọi HTTT như ba chiều tương tác — chỉ riêng công nghệ không bao giờ đủ:</p>
<ul>
<li><strong>Tổ chức</strong> — con người, cơ cấu, quy trình nghiệp vụ, văn hoá.</li>
<li><strong>Quản lý</strong> — quyết định, chiến lược, lãnh đạo, thay đổi.</li>
<li><strong>Công nghệ</strong> — phần cứng, phần mềm, dữ liệu, mạng.</li>
</ul>
<p>Dự án thất bại khi bỏ quên một chiều — nền tảng giỏi mà nhân sự chưa được đào tạo và quy trình không đổi thì không tạo ra giá trị.</p>
<h3>Hệ thống theo cấp quản lý</h3>
<pre><code>Cấp          Hệ thống  Phục vụ
Tác nghiệp   TPS       giao dịch hằng ngày (đơn hàng, lương)
Quản lý giữa MIS/DSS   báo cáo &amp; phân tích what-if để quyết định
Cấp cao      ESS       dashboard &amp; KPI cho chiến lược
</code></pre>
<p><strong>TPS</strong> cấp dữ liệu; <strong>MIS/DSS</strong> biến nó thành quyết định; <strong>ESS</strong> cho lãnh đạo bức tranh tổng thể.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> TPS tại điểm bán của Walmart ghi mọi giao dịch; dữ liệu đó gộp lên báo cáo MIS và dashboard lãnh đạo để quyết định nhập hàng, định giá và bố trí cửa hàng — một dòng dữ liệu, ba cấp quyết định.</div>`,
  ]]);

const c1q = quiz('ita203c-quiz-1', 'Quiz 1 — Role of MIS|||Quiz 1 — Vai trò của MIS', [
  { id: 'q1', question: 'Ba chiều của một hệ thống thông tin theo Laudon là?', options: ['Phần cứng, phần mềm, dữ liệu', 'Tổ chức, quản lý, công nghệ', 'Chi phí, doanh thu, lợi nhuận', 'Nhập, xử lý, xuất'], correctIndex: 1, explanation: 'HTTT là hệ thống xã hội - kỹ thuật gồm ba chiều: tổ chức, quản lý, công nghệ.' },
  { id: 'q2', question: 'Hệ thống ghi nhận giao dịch hằng ngày (đơn hàng, lương) gọi là?', options: ['ESS', 'DSS', 'TPS', 'CRM'], correctIndex: 2, explanation: 'TPS (Transaction Processing System) xử lý các giao dịch tác nghiệp thường ngày.' },
  { id: 'q3', question: 'Hệ thống nào phục vụ lãnh đạo cấp cao bằng dashboard & KPI cho chiến lược?', options: ['TPS', 'ESS', 'Office system', 'Payroll'], correctIndex: 1, explanation: 'ESS (Executive Support System) tổng hợp dữ liệu thành KPI cho quyết định chiến lược.' },
]);

const c2 = doc('ita203c-2-1-competitive-advantage', '2.1 — Information systems &amp; competitive advantage|||2.1 — HTTT &amp; lợi thế cạnh tranh',
  'Mô hình năm lực lượng và chuỗi giá trị của Porter; ba chiến lược chung; HTTT dùng để dẫn đầu chi phí, khác biệt hoá, tập trung; hệ thống liên tổ chức.',
  [[
    `<span class="eyebrow">ITA203c · Chapter 2 · Lesson 2.1</span>
<h2>Information systems &amp; competitive advantage</h2>
<h3>Porter's five forces</h3>
<p>A firm's profitability is shaped by five forces: <strong>rivalry, new entrants, substitutes, buyer power</strong> and <strong>supplier power</strong>. Information systems can blunt or exploit each — for example, a switching-cost system (loyalty data, integrated ordering) reduces buyer power.</p>
<h3>The value chain</h3>
<p>Porter's <strong>value chain</strong> splits a firm into activities that add value. IS targets the activities where it moves the needle most:</p>
<pre><code>Primary : inbound logistics -> operations -> outbound -> sales -> service
Support : firm infrastructure, HR, technology, procurement
IS wins where it cuts cost or adds value in a key link
</code></pre>
<h3>Three generic strategies</h3>
<ul>
<li><strong>Cost leadership</strong> — IS drives efficiency (Walmart's supply chain).</li>
<li><strong>Differentiation</strong> — IS builds unique value (Apple's ecosystem).</li>
<li><strong>Focus</strong> — IS serves a niche precisely (data-driven targeting).</li>
</ul>
<div class="callout"><span class="badge">Real example</span> Amazon's recommendation engine and one-click ordering are IS-built <em>differentiation</em>; its fulfillment network is IS-built <em>cost leadership</em> — the same firm using systems for two strategies at once.</div>`,
    `<span class="eyebrow">ITA203c · Chương 2 · Bài 2.1</span>
<h2>HTTT &amp; lợi thế cạnh tranh</h2>
<h3>Năm lực lượng của Porter</h3>
<p>Lợi nhuận của doanh nghiệp chịu tác động của năm lực lượng: <strong>cạnh tranh nội ngành, đối thủ mới, sản phẩm thay thế, quyền lực người mua</strong> và <strong>quyền lực nhà cung cấp</strong>. HTTT có thể làm giảm hoặc khai thác từng lực — ví dụ hệ thống tạo chi phí chuyển đổi (dữ liệu khách thân thiết, đặt hàng tích hợp) làm giảm quyền lực người mua.</p>
<h3>Chuỗi giá trị</h3>
<p><strong>Chuỗi giá trị</strong> của Porter chia doanh nghiệp thành các hoạt động tạo giá trị. HTTT nhắm vào hoạt động mà nó tạo khác biệt lớn nhất:</p>
<pre><code>Chính : hậu cần vào -> vận hành -> hậu cần ra -> bán hàng -> dịch vụ
Hỗ trợ: hạ tầng, nhân sự, công nghệ, mua sắm
HTTT thắng ở khâu nó cắt chi phí hoặc thêm giá trị nhiều nhất
</code></pre>
<h3>Ba chiến lược chung</h3>
<ul>
<li><strong>Dẫn đầu chi phí</strong> — HTTT tăng hiệu quả (chuỗi cung ứng Walmart).</li>
<li><strong>Khác biệt hoá</strong> — HTTT tạo giá trị riêng (hệ sinh thái Apple).</li>
<li><strong>Tập trung</strong> — HTTT phục vụ ngách chính xác (nhắm mục tiêu theo dữ liệu).</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Bộ gợi ý và đặt hàng một chạm của Amazon là <em>khác biệt hoá</em> dựng bằng HTTT; mạng lưới kho vận của nó là <em>dẫn đầu chi phí</em> dựng bằng HTTT — cùng một doanh nghiệp dùng hệ thống cho hai chiến lược một lúc.</div>`,
  ]]);

const c2q = quiz('ita203c-quiz-2', 'Quiz 2 — IS & competitive advantage|||Quiz 2 — HTTT & lợi thế cạnh tranh', [
  { id: 'q1', question: 'Mô hình nào phân tích áp lực cạnh tranh của một ngành?', options: ['Chuỗi cung ứng SCOR', 'Năm lực lượng của Porter', 'Ma trận BCG', 'Mô hình 4P'], correctIndex: 1, explanation: 'Năm lực lượng của Porter: cạnh tranh nội ngành, đối thủ mới, thay thế, người mua, nhà cung cấp.' },
  { id: 'q2', question: 'Chuỗi giá trị (value chain) của Porter dùng để?', options: ['Tính thuế doanh nghiệp', 'Xác định hoạt động tạo giá trị để nhắm HTTT vào đó', 'Vẽ sơ đồ mạng máy tính', 'Lập lịch dự án'], correctIndex: 1, explanation: 'Chuỗi giá trị chia doanh nghiệp thành hoạt động chính/hỗ trợ để biết HTTT nên đầu tư ở khâu nào.' },
  { id: 'q3', question: 'Walmart dùng HTTT tối ưu chuỗi cung ứng để đạt chiến lược nào?', options: ['Dẫn đầu chi phí', 'Khác biệt hoá cao cấp', 'Rút lui khỏi thị trường', 'Tập trung ngách xa xỉ'], correctIndex: 0, explanation: 'HTTT giúp Walmart giảm chi phí vận hành — chiến lược dẫn đầu chi phí (cost leadership).' },
]);

const c3 = doc('ita203c-3-1-it-infrastructure', '3.1 — IT infrastructure &amp; the digital platform|||3.1 — Hạ tầng CNTT &amp; nền tảng số',
  'Các thành phần hạ tầng CNTT; điện toán đám mây (IaaS/PaaS/SaaS), di động; xu hướng nền tảng; quản trị hạ tầng và cân nhắc thuê ngoài / tổng chi phí sở hữu.',
  [[
    `<span class="eyebrow">ITA203c · Chapter 3 · Lesson 3.1</span>
<h2>IT infrastructure &amp; the digital platform</h2>
<h3>What infrastructure includes</h3>
<p>IT infrastructure is the shared technology foundation the whole firm runs on: <strong>computing platforms, networking, data management, and the services</strong> (integration, security, support) that hold them together.</p>
<h3>Cloud service models</h3>
<pre><code>IaaS -> rent raw compute/storage    (AWS EC2, S3)
PaaS -> rent a build platform       (App Engine, Heroku)
SaaS -> rent finished software      (Google Workspace, Salesforce)
On-prem -> you own &amp; run everything
</code></pre>
<p>Cloud turns capital cost into <strong>pay-as-you-go</strong> operating cost and lets a firm scale in minutes — but adds vendor lock-in and data-location questions a manager must weigh.</p>
<h3>Managing the platform</h3>
<ul>
<li><strong>TCO</strong> — total cost of ownership counts more than the sticker price (support, training, downtime).</li>
<li><strong>Scalability &amp; resilience</strong> — can it grow and survive failure?</li>
<li><strong>Governance</strong> — standards, capacity planning, vendor management.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> Netflix runs almost entirely on AWS — it scales to millions of concurrent streams at peak and pays only for what it uses, an infrastructure choice that would be impossible to match with owned data centers.</div>`,
    `<span class="eyebrow">ITA203c · Chương 3 · Bài 3.1</span>
<h2>Hạ tầng CNTT &amp; nền tảng số</h2>
<h3>Hạ tầng gồm những gì</h3>
<p>Hạ tầng CNTT là nền công nghệ dùng chung cho cả doanh nghiệp: <strong>nền tảng tính toán, mạng, quản lý dữ liệu, và các dịch vụ</strong> (tích hợp, bảo mật, hỗ trợ) gắn kết chúng lại.</p>
<h3>Các mô hình dịch vụ đám mây</h3>
<pre><code>IaaS -> thuê tính toán/lưu trữ thô  (AWS EC2, S3)
PaaS -> thuê nền tảng phát triển    (App Engine, Heroku)
SaaS -> thuê phần mềm hoàn chỉnh     (Google Workspace, Salesforce)
On-prem -> tự sở hữu &amp; vận hành tất cả
</code></pre>
<p>Đám mây biến chi phí đầu tư thành chi phí vận hành <strong>trả theo dùng</strong> và cho doanh nghiệp mở rộng trong vài phút — nhưng thêm rủi ro lệ thuộc nhà cung cấp và câu hỏi về nơi lưu dữ liệu mà nhà quản lý phải cân nhắc.</p>
<h3>Quản trị nền tảng</h3>
<ul>
<li><strong>TCO</strong> — tổng chi phí sở hữu quan trọng hơn giá niêm yết (hỗ trợ, đào tạo, thời gian chết).</li>
<li><strong>Khả năng mở rộng &amp; chịu lỗi</strong> — có lớn được và sống sót khi sự cố không?</li>
<li><strong>Quản trị</strong> — chuẩn hoá, hoạch định năng lực, quản lý nhà cung cấp.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Netflix chạy gần như toàn bộ trên AWS — mở rộng tới hàng triệu luồng xem đồng thời giờ cao điểm và chỉ trả cho phần dùng, một lựa chọn hạ tầng gần như không thể sánh nếu tự dựng trung tâm dữ liệu.</div>`,
  ]]);

const c3q = quiz('ita203c-quiz-3', 'Quiz 3 — IT infrastructure|||Quiz 3 — Hạ tầng CNTT', [
  { id: 'q1', question: 'Mô hình đám mây nào cho thuê phần mềm hoàn chỉnh dùng ngay?', options: ['IaaS', 'PaaS', 'SaaS', 'On-premise'], correctIndex: 2, explanation: 'SaaS (Software as a Service) cung cấp phần mềm hoàn chỉnh, ví dụ Salesforce, Google Workspace.' },
  { id: 'q2', question: 'Lợi ích chính của điện toán đám mây với chi phí là?', options: ['Xoá bỏ mọi rủi ro bảo mật', 'Biến chi phí đầu tư thành chi phí trả theo dùng', 'Không cần nhà cung cấp', 'Miễn phí hoàn toàn'], correctIndex: 1, explanation: 'Đám mây chuyển CapEx thành OpEx trả theo mức sử dụng, mở rộng linh hoạt.' },
  { id: 'q3', question: 'TCO (total cost of ownership) nhắc nhà quản lý điều gì?', options: ['Chỉ nhìn giá mua ban đầu', 'Tính cả hỗ trợ, đào tạo, thời gian chết ngoài giá mua', 'Bỏ qua chi phí vận hành', 'Chỉ đo tốc độ CPU'], correctIndex: 1, explanation: 'TCO gồm toàn bộ chi phí vòng đời: mua, hỗ trợ, đào tạo, downtime — không chỉ giá niêm yết.' },
]);

const c4 = doc('ita203c-4-1-data-knowledge', '4.1 — Data, business intelligence &amp; knowledge management|||4.1 — Dữ liệu, BI &amp; quản trị tri thức',
  'Từ CSDL tới kho dữ liệu và BI; DBMS quan hệ; data warehouse vs data lake; phân tích và trực quan hoá; quản trị tri thức tường minh và ẩn.',
  [[
    `<span class="eyebrow">ITA203c · Chapter 4 · Lesson 4.1</span>
<h2>Data, business intelligence &amp; knowledge management</h2>
<h3>From database to insight</h3>
<p>Operational data lives in a <strong>DBMS</strong> (a relational database organizes it into related tables). To analyze it across the firm, data is copied into a <strong>data warehouse</strong> — cleaned, integrated and optimized for reporting.</p>
<pre><code>Sources (TPS, apps) -> ETL (extract, transform, load)
                    -> Data warehouse / data lake
                    -> BI &amp; dashboards -> decisions
</code></pre>
<ul>
<li><strong>Data warehouse</strong> — structured, modeled data for known questions.</li>
<li><strong>Data lake</strong> — raw data of any type for exploration.</li>
</ul>
<h3>Business intelligence &amp; knowledge</h3>
<p><strong>BI</strong> turns data into reports, dashboards and KPIs managers act on. <strong>Knowledge management</strong> goes further — capturing <em>explicit</em> knowledge (documents, wikis) and <em>tacit</em> knowledge (expertise in people's heads) so the firm keeps learning.</p>
<div class="callout"><span class="badge">Real example</span> Walmart's data warehouse — one of the largest commercial ones — lets analysts spot that certain products sell together and adjust stocking; the classic "what sells with what" insight comes straight from BI over warehoused sales data.</div>`,
    `<span class="eyebrow">ITA203c · Chương 4 · Bài 4.1</span>
<h2>Dữ liệu, BI &amp; quản trị tri thức</h2>
<h3>Từ cơ sở dữ liệu tới insight</h3>
<p>Dữ liệu tác nghiệp nằm trong <strong>DBMS</strong> (CSDL quan hệ sắp xếp thành các bảng liên kết). Để phân tích trên toàn doanh nghiệp, dữ liệu được sao vào <strong>kho dữ liệu (data warehouse)</strong> — làm sạch, tích hợp và tối ưu cho báo cáo.</p>
<pre><code>Nguồn (TPS, ứng dụng) -> ETL (rút, biến đổi, nạp)
                     -> Kho dữ liệu / data lake
                     -> BI &amp; dashboard -> quyết định
</code></pre>
<ul>
<li><strong>Data warehouse</strong> — dữ liệu có cấu trúc, mô hình sẵn cho câu hỏi đã biết.</li>
<li><strong>Data lake</strong> — dữ liệu thô mọi loại để khám phá.</li>
</ul>
<h3>Business intelligence &amp; tri thức</h3>
<p><strong>BI</strong> biến dữ liệu thành báo cáo, dashboard và KPI để nhà quản lý hành động. <strong>Quản trị tri thức</strong> đi xa hơn — nắm giữ tri thức <em>tường minh</em> (tài liệu, wiki) và tri thức <em>ẩn</em> (kinh nghiệm trong đầu con người) để doanh nghiệp học liên tục.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Kho dữ liệu của Walmart — một trong những kho thương mại lớn nhất — giúp nhà phân tích thấy vài sản phẩm hay bán kèm nhau và điều chỉnh cách nhập hàng; insight kinh điển "cái gì bán cùng cái gì" đến thẳng từ BI trên dữ liệu bán hàng trong kho.</div>`,
  ]]);

const c4q = quiz('ita203c-quiz-4', 'Quiz 4 — Data & knowledge|||Quiz 4 — Dữ liệu & tri thức', [
  { id: 'q1', question: 'Kho dữ liệu (data warehouse) khác dữ liệu tác nghiệp ở chỗ?', options: ['Chỉ lưu ảnh', 'Được làm sạch, tích hợp và tối ưu cho phân tích/báo cáo', 'Không lưu lịch sử', 'Chỉ chạy trên giấy'], correctIndex: 1, explanation: 'Data warehouse gộp dữ liệu từ nhiều nguồn, làm sạch và tối ưu cho truy vấn phân tích.' },
  { id: 'q2', question: 'Quy trình đưa dữ liệu từ nguồn vào kho gọi là?', options: ['ETL (extract, transform, load)', 'HTTP', 'CRUD', 'DNS'], correctIndex: 0, explanation: 'ETL: rút (extract), biến đổi (transform), nạp (load) dữ liệu vào kho.' },
  { id: 'q3', question: 'Tri thức ẩn (tacit knowledge) là?', options: ['Tài liệu và wiki đã viết ra', 'Kinh nghiệm, bí quyết trong đầu con người, khó ghi lại', 'Bảng giá sản phẩm', 'Mã nguồn phần mềm'], correctIndex: 1, explanation: 'Tri thức ẩn nằm ở kỹ năng/kinh nghiệm cá nhân; tri thức tường minh đã được ghi thành văn bản.' },
]);

const c5 = doc('ita203c-5-1-enterprise-systems', '5.1 — Enterprise systems: ERP, SCM &amp; CRM|||5.1 — Hệ thống doanh nghiệp: ERP, SCM &amp; CRM',
  'Vì sao cần tích hợp quy trình; ERP hợp nhất dữ liệu toàn doanh nghiệp; SCM tối ưu chuỗi cung ứng; CRM quản lý quan hệ khách hàng; lợi ích và thách thức triển khai.',
  [[
    `<span class="eyebrow">ITA203c · Chapter 5 · Lesson 5.1</span>
<h2>Enterprise systems: ERP, SCM &amp; CRM</h2>
<h3>The integration problem</h3>
<p>Firms grow silos — sales, finance and warehouse each keep their own data, and numbers never match. <strong>Enterprise systems</strong> solve this by sharing one integrated database across processes.</p>
<h3>The three big enterprise applications</h3>
<ul>
<li><strong>ERP</strong> (Enterprise Resource Planning) — one system for finance, HR, manufacturing and more; a single source of truth.</li>
<li><strong>SCM</strong> (Supply Chain Management) — coordinates suppliers, production and distribution to cut inventory and delay.</li>
<li><strong>CRM</strong> (Customer Relationship Management) — unifies every customer touchpoint (sales, marketing, service).</li>
</ul>
<pre><code>Suppliers --SCM--&gt; [ ERP core: one shared database ] --CRM--&gt; Customers
</code></pre>
<h3>Benefits &amp; risks</h3>
<p>Benefits: consistent data, efficient processes, firm-wide visibility. Risks: high cost, long rollout, and forcing the business to adapt to the software — enterprise systems are as much an <strong>organizational change</strong> project as a technology one.</p>
<div class="callout"><span class="badge">Real example</span> Nestlé runs SAP ERP across dozens of countries to standardize processes and reporting; its early rollout struggled precisely because teams resisted the process change — proof that ERP success is about people, not just software.</div>`,
    `<span class="eyebrow">ITA203c · Chương 5 · Bài 5.1</span>
<h2>Hệ thống doanh nghiệp: ERP, SCM &amp; CRM</h2>
<h3>Bài toán tích hợp</h3>
<p>Doanh nghiệp lớn lên sinh ra ốc đảo dữ liệu — bán hàng, tài chính, kho mỗi bên giữ dữ liệu riêng, con số không bao giờ khớp. <strong>Hệ thống doanh nghiệp</strong> giải bài này bằng một CSDL tích hợp dùng chung qua các quy trình.</p>
<h3>Ba ứng dụng doanh nghiệp lớn</h3>
<ul>
<li><strong>ERP</strong> (Hoạch định nguồn lực doanh nghiệp) — một hệ thống cho tài chính, nhân sự, sản xuất...; một nguồn sự thật duy nhất.</li>
<li><strong>SCM</strong> (Quản lý chuỗi cung ứng) — phối hợp nhà cung cấp, sản xuất và phân phối để giảm tồn kho và chậm trễ.</li>
<li><strong>CRM</strong> (Quản lý quan hệ khách hàng) — hợp nhất mọi điểm chạm khách hàng (bán hàng, marketing, dịch vụ).</li>
</ul>
<pre><code>Nhà cung cấp --SCM--&gt; [ Lõi ERP: một CSDL dùng chung ] --CRM--&gt; Khách hàng
</code></pre>
<h3>Lợi ích &amp; rủi ro</h3>
<p>Lợi ích: dữ liệu nhất quán, quy trình hiệu quả, thấy rõ toàn doanh nghiệp. Rủi ro: chi phí cao, triển khai dài, và buộc doanh nghiệp thích nghi với phần mềm — hệ thống doanh nghiệp là dự án <strong>thay đổi tổ chức</strong> chẳng kém gì dự án công nghệ.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Nestlé chạy SAP ERP tại hàng chục quốc gia để chuẩn hoá quy trình và báo cáo; đợt triển khai đầu chật vật đúng vì các nhóm chống lại việc đổi quy trình — bằng chứng ERP thành công là ở con người, không chỉ phần mềm.</div>`,
  ]]);

const c5q = quiz('ita203c-quiz-5', 'Quiz 5 — Enterprise systems|||Quiz 5 — Hệ thống doanh nghiệp', [
  { id: 'q1', question: 'Hệ thống hợp nhất tài chính, nhân sự, sản xuất... vào một CSDL dùng chung là?', options: ['CRM', 'ERP', 'SCM', 'TPS'], correctIndex: 1, explanation: 'ERP (Enterprise Resource Planning) tích hợp các chức năng cốt lõi vào một nguồn sự thật duy nhất.' },
  { id: 'q2', question: 'CRM (Customer Relationship Management) chủ yếu quản lý?', options: ['Chuỗi cung ứng nhà máy', 'Mọi điểm chạm và quan hệ với khách hàng', 'Bảng lương nhân viên', 'Máy chủ mạng'], correctIndex: 1, explanation: 'CRM hợp nhất bán hàng, marketing và dịch vụ để quản lý quan hệ khách hàng.' },
  { id: 'q3', question: 'Rủi ro lớn nhất khi triển khai ERP thường là?', options: ['Thiếu điện', 'Kháng cự thay đổi tổ chức và quy trình, chi phí/thời gian lớn', 'Không có internet', 'Quá rẻ'], correctIndex: 1, explanation: 'ERP là dự án thay đổi tổ chức: chi phí cao, triển khai dài, và con người phải đổi cách làm việc.' },
]);

const c6 = doc('ita203c-6-1-ecommerce-digital-firm', '6.1 — E-commerce &amp; the digital firm|||6.1 — TMĐT &amp; doanh nghiệp số',
  'Các loại TMĐT (B2C, B2B, C2C); thị trường số và hàng hoá số; thương mại di động (m-commerce); mô hình doanh thu; nền tảng và hiệu ứng mạng.',
  [[
    `<span class="eyebrow">ITA203c · Chapter 6 · Lesson 6.1</span>
<h2>E-commerce &amp; the digital firm</h2>
<h3>Types of e-commerce</h3>
<ul>
<li><strong>B2C</strong> — business to consumer (an online store).</li>
<li><strong>B2B</strong> — business to business (supplier portals, the largest by value).</li>
<li><strong>C2C</strong> — consumer to consumer (marketplaces, auctions).</li>
</ul>
<h3>Why digital markets differ</h3>
<p>Digital markets cut search and transaction costs, enable <strong>price transparency</strong> and <strong>personalization</strong>, and let a firm sell <em>digital goods</em> at near-zero marginal cost. <strong>M-commerce</strong> (mobile) adds location and always-on access.</p>
<pre><code>Revenue models:
  sales | subscription | advertising | freemium | transaction fee | affiliate
</code></pre>
<h3>Platforms &amp; network effects</h3>
<p>Digital-firm winners are often <strong>platforms</strong> — the more users on one side (buyers), the more valuable to the other (sellers). This <strong>network effect</strong> makes leaders hard to unseat.</p>
<div class="callout"><span class="badge">Real example</span> Shopee grew in Vietnam by pairing an m-commerce app with a payment wallet and free-shipping vouchers; each extra buyer attracted more sellers and vice-versa — a textbook network effect on a mobile-first platform.</div>`,
    `<span class="eyebrow">ITA203c · Chương 6 · Bài 6.1</span>
<h2>TMĐT &amp; doanh nghiệp số</h2>
<h3>Các loại TMĐT</h3>
<ul>
<li><strong>B2C</strong> — doanh nghiệp tới người tiêu dùng (cửa hàng trực tuyến).</li>
<li><strong>B2B</strong> — doanh nghiệp tới doanh nghiệp (cổng nhà cung cấp, lớn nhất về giá trị).</li>
<li><strong>C2C</strong> — người tiêu dùng tới người tiêu dùng (sàn, đấu giá).</li>
</ul>
<h3>Vì sao thị trường số khác biệt</h3>
<p>Thị trường số cắt chi phí tìm kiếm và giao dịch, cho phép <strong>minh bạch giá</strong> và <strong>cá nhân hoá</strong>, và giúp doanh nghiệp bán <em>hàng hoá số</em> với chi phí biên gần bằng không. <strong>M-commerce</strong> (di động) thêm yếu tố vị trí và truy cập mọi lúc.</p>
<pre><code>Mô hình doanh thu:
  bán hàng | thuê bao | quảng cáo | freemium | phí giao dịch | tiếp thị liên kết
</code></pre>
<h3>Nền tảng &amp; hiệu ứng mạng</h3>
<p>Kẻ thắng của doanh nghiệp số thường là <strong>nền tảng</strong> — càng nhiều người dùng ở một phía (người mua) thì càng giá trị với phía kia (người bán). <strong>Hiệu ứng mạng</strong> này khiến kẻ dẫn đầu khó bị lật đổ.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Shopee lớn lên ở Việt Nam nhờ ghép ứng dụng m-commerce với ví thanh toán và voucher freeship; mỗi người mua thêm lại kéo thêm người bán và ngược lại — hiệu ứng mạng sách giáo khoa trên nền tảng ưu tiên di động.</div>`,
  ]]);

const c6q = quiz('ita203c-quiz-6', 'Quiz 6 — E-commerce|||Quiz 6 — TMĐT', [
  { id: 'q1', question: 'Loại TMĐT nào có giá trị giao dịch lớn nhất?', options: ['B2C', 'B2B', 'C2C', 'G2C'], correctIndex: 1, explanation: 'B2B (doanh nghiệp - doanh nghiệp) chiếm giá trị giao dịch lớn nhất trong TMĐT.' },
  { id: 'q2', question: 'Hiệu ứng mạng (network effect) nghĩa là?', options: ['Mạng chạy nhanh hơn', 'Càng nhiều người dùng thì nền tảng càng giá trị với người khác', 'Chi phí máy chủ giảm', 'Bảo mật tự tăng'], correctIndex: 1, explanation: 'Hiệu ứng mạng: giá trị nền tảng tăng theo số người dùng, giúp kẻ dẫn đầu khó bị thay thế.' },
  { id: 'q3', question: 'Đặc điểm khiến hàng hoá số (digital goods) đặc biệt là?', options: ['Chi phí biên gần bằng không khi bán thêm một bản', 'Luôn đắt hơn hàng vật lý', 'Không thể sao chép', 'Phải giao bằng xe tải'], correctIndex: 0, explanation: 'Hàng hoá số sao chép và phân phối gần như miễn phí — chi phí biên gần bằng không.' },
]);

const c7 = doc('ita203c-7-1-building-systems', '7.1 — Building &amp; managing information systems|||7.1 — Xây dựng &amp; quản lý hệ thống thông tin',
  'Vòng đời phát triển hệ thống (SDLC) và các cách tiếp cận (thác nước, Agile); quản lý dự án HTTT và vì sao dự án thất bại; quản lý thay đổi tổ chức.',
  [[
    `<span class="eyebrow">ITA203c · Chapter 7 · Lesson 7.1</span>
<h2>Building &amp; managing information systems</h2>
<h3>The systems development life cycle</h3>
<pre><code>Planning -> Analysis -> Design -> Development
         -> Testing -> Implementation -> Maintenance
</code></pre>
<p>The <strong>SDLC</strong> is the disciplined path from idea to running system. <strong>Waterfall</strong> does the phases in strict order; <strong>Agile</strong> works in short iterations, delivering and adjusting continuously — better when requirements are uncertain.</p>
<h3>Managing IS projects</h3>
<p>A project balances the <strong>scope-time-cost</strong> triangle against quality. Most failures are not technical — they come from unclear requirements, weak sponsorship, and underestimated <strong>organizational change</strong>.</p>
<ul>
<li><strong>Change management</strong> — train users, redesign processes, communicate.</li>
<li><strong>Risk management</strong> — surface and mitigate risks early.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> Hershey's 1999 ERP go-live failed to deliver Halloween orders — not because the code was wrong, but because too much changed at once with too little testing and training. Managing the change, not the technology, was the missing piece.</div>`,
    `<span class="eyebrow">ITA203c · Chương 7 · Bài 7.1</span>
<h2>Xây dựng &amp; quản lý hệ thống thông tin</h2>
<h3>Vòng đời phát triển hệ thống</h3>
<pre><code>Lập kế hoạch -> Phân tích -> Thiết kế -> Phát triển
            -> Kiểm thử -> Triển khai -> Bảo trì
</code></pre>
<p><strong>SDLC</strong> là con đường kỷ luật từ ý tưởng tới hệ thống chạy thật. <strong>Thác nước</strong> làm các pha theo thứ tự chặt; <strong>Agile</strong> làm theo vòng lặp ngắn, giao và điều chỉnh liên tục — hợp hơn khi yêu cầu chưa chắc chắn.</p>
<h3>Quản lý dự án HTTT</h3>
<p>Dự án cân tam giác <strong>phạm vi - thời gian - chi phí</strong> với chất lượng. Phần lớn thất bại không do kỹ thuật — chúng đến từ yêu cầu mơ hồ, thiếu người bảo trợ, và xem nhẹ <strong>thay đổi tổ chức</strong>.</p>
<ul>
<li><strong>Quản lý thay đổi</strong> — đào tạo người dùng, thiết kế lại quy trình, truyền thông.</li>
<li><strong>Quản lý rủi ro</strong> — nhận diện và giảm rủi ro sớm.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Đợt go-live ERP năm 1999 của Hershey trễ giao đơn hàng mùa Halloween — không phải vì mã sai, mà vì đổi quá nhiều thứ cùng lúc với quá ít kiểm thử và đào tạo. Quản lý sự thay đổi, chứ không phải công nghệ, mới là mảnh còn thiếu.</div>`,
  ]]);

const c7q = quiz('ita203c-quiz-7', 'Quiz 7 — Building systems|||Quiz 7 — Xây dựng hệ thống', [
  { id: 'q1', question: 'SDLC là viết tắt của?', options: ['System Data Local Cache', 'Systems Development Life Cycle', 'Secure Digital License Code', 'Software Deployment Load Control'], correctIndex: 1, explanation: 'SDLC = Systems Development Life Cycle — vòng đời phát triển hệ thống.' },
  { id: 'q2', question: 'Agile khác thác nước (waterfall) chủ yếu ở chỗ?', options: ['Không cần kiểm thử', 'Làm theo vòng lặp ngắn, giao và điều chỉnh liên tục', 'Chỉ dùng cho phần cứng', 'Không có giai đoạn thiết kế'], correctIndex: 1, explanation: 'Agile chia thành iteration ngắn, thích nghi liên tục — hợp khi yêu cầu chưa rõ.' },
  { id: 'q3', question: 'Nguyên nhân phổ biến nhất khiến dự án HTTT thất bại là?', options: ['Ngôn ngữ lập trình sai', 'Yêu cầu mơ hồ và xem nhẹ quản lý thay đổi tổ chức', 'Máy chủ quá mạnh', 'Có quá nhiều tài liệu'], correctIndex: 1, explanation: 'Phần lớn thất bại đến từ yếu tố con người/tổ chức: yêu cầu không rõ, thiếu bảo trợ, thiếu quản lý thay đổi.' },
]);

const c8 = doc('ita203c-8-1-security-ethics-governance', '8.1 — Security, ethics &amp; IT governance|||8.1 — Bảo mật, đạo đức &amp; quản trị CNTT',
  'Vì sao HTTT dễ tổn thương; bộ ba CIA và kiểm soát; đạo đức HTTT (riêng tư, sở hữu, trách nhiệm); quản trị CNTT và tuân thủ (COBIT, GDPR, NĐ13).',
  [[
    `<span class="eyebrow">ITA203c · Chapter 8 · Lesson 8.1</span>
<h2>Security, ethics &amp; IT governance</h2>
<h3>Why systems are vulnerable</h3>
<p>Connected, digital firms expose many entry points: malware, phishing, insider misuse, weak access control. Security aims at the <strong>CIA triad</strong>:</p>
<pre><code>Confidentiality -> only authorized people see data
Integrity       -> data is accurate &amp; not tampered
Availability     -> systems are up when needed
</code></pre>
<p>Controls include access management, encryption, backups, and an audit trail — plus training, since people are the weakest link.</p>
<h3>Ethics of information systems</h3>
<p>Managers face ethical questions on <strong>privacy</strong> (what data may we collect?), <strong>property</strong> (who owns data and software?), and <strong>accountability</strong> (who answers when a system harms someone?).</p>
<h3>IT governance &amp; compliance</h3>
<p><strong>IT governance</strong> (frameworks like COBIT) ensures IT investment serves strategy and manages risk. Firms must also comply with laws — <strong>GDPR</strong> in the EU, <strong>Nghị định 13/2023/NĐ-CP</strong> for personal data in Vietnam.</p>
<div class="callout"><span class="badge">Real example</span> The 2017 Equifax breach exposed data of ~147 million people through one unpatched component — a governance and control failure, not just a technical bug, and a lasting lesson in accountability.</div>`,
    `<span class="eyebrow">ITA203c · Chương 8 · Bài 8.1</span>
<h2>Bảo mật, đạo đức &amp; quản trị CNTT</h2>
<h3>Vì sao hệ thống dễ tổn thương</h3>
<p>Doanh nghiệp số, kết nối rộng lộ ra nhiều cửa vào: mã độc, lừa đảo (phishing), lạm dụng nội bộ, kiểm soát truy cập yếu. Bảo mật nhắm vào <strong>bộ ba CIA</strong>:</p>
<pre><code>Confidentiality (bảo mật) -> chỉ người được phép thấy dữ liệu
Integrity (toàn vẹn)       -> dữ liệu chính xác &amp; không bị sửa lén
Availability (sẵn sàng)    -> hệ thống lên khi cần
</code></pre>
<p>Kiểm soát gồm quản lý truy cập, mã hoá, sao lưu và nhật ký kiểm toán — cộng đào tạo, vì con người là mắt xích yếu nhất.</p>
<h3>Đạo đức của HTTT</h3>
<p>Nhà quản lý đối mặt câu hỏi đạo đức về <strong>quyền riêng tư</strong> (được thu dữ liệu gì?), <strong>sở hữu</strong> (ai sở hữu dữ liệu và phần mềm?), và <strong>trách nhiệm</strong> (ai chịu khi hệ thống gây hại?).</p>
<h3>Quản trị CNTT &amp; tuân thủ</h3>
<p><strong>Quản trị CNTT</strong> (khung như COBIT) bảo đảm đầu tư CNTT phục vụ chiến lược và kiểm soát rủi ro. Doanh nghiệp còn phải tuân thủ luật — <strong>GDPR</strong> ở EU, <strong>Nghị định 13/2023/NĐ-CP</strong> về dữ liệu cá nhân ở Việt Nam.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Vụ rò rỉ Equifax 2017 lộ dữ liệu của khoảng 147 triệu người qua một thành phần chưa vá — thất bại về quản trị và kiểm soát, không chỉ là lỗi kỹ thuật, và là bài học lâu dài về trách nhiệm giải trình.</div>`,
  ]]);

const c8q = quiz('ita203c-quiz-8', 'Quiz 8 — Security, ethics & governance|||Quiz 8 — Bảo mật, đạo đức & quản trị', [
  { id: 'q1', question: 'Bộ ba CIA trong an ninh thông tin gồm?', options: ['Cost, Interest, Asset', 'Confidentiality, Integrity, Availability', 'Control, Input, Access', 'Cloud, Internet, API'], correctIndex: 1, explanation: 'CIA = Confidentiality (bảo mật), Integrity (toàn vẹn), Availability (sẵn sàng).' },
  { id: 'q2', question: 'Ở Việt Nam, văn bản nào quản việc bảo vệ dữ liệu cá nhân?', options: ['GDPR', 'Nghị định 13/2023/NĐ-CP', 'ISO 27001', 'Luật giao thông'], correctIndex: 1, explanation: 'Nghị định 13/2023/NĐ-CP là quy định bảo vệ dữ liệu cá nhân của Việt Nam; GDPR áp dụng ở EU.' },
  { id: 'q3', question: 'Quản trị CNTT (IT governance) như COBIT nhằm?', options: ['Viết mã nhanh hơn', 'Bảo đảm đầu tư CNTT phục vụ chiến lược và kiểm soát rủi ro', 'Xoá bỏ mọi kiểm soát', 'Chỉ mua phần cứng rẻ'], correctIndex: 1, explanation: 'IT governance gắn đầu tư CNTT với mục tiêu doanh nghiệp, quản lý rủi ro và tuân thủ.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'ITA203c',
    slug: 'ita203c-management-information-systems',
    title: 'Management Information Systems',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ITA203c.webp',
    shortDescription: 'Managing information systems in the enterprise — MIS roles, IS & competitive advantage (Porter, value chain), IT infrastructure & cloud, data & BI, enterprise systems (ERP/SCM/CRM), e-commerce, SDLC, security & IT governance. Bilingual, with quizzes.|||Quản lý hệ thống thông tin trong doanh nghiệp — vai trò MIS, HTTT & lợi thế cạnh tranh (Porter, chuỗi giá trị), hạ tầng & cloud, dữ liệu & BI, hệ thống doanh nghiệp (ERP/SCM/CRM), TMĐT, SDLC, bảo mật & quản trị CNTT. Song ngữ, có quiz.',
    description: 'Môn <strong>ITA203c — Management Information Systems</strong> (ngành Hệ thống thông tin, kỳ 3) dạy cách <strong>quản lý HTTT trong doanh nghiệp</strong> — dùng hệ thống để cạnh tranh, ra quyết định và vận hành, không phải viết mã. Từ <strong>vai trò của HTTT</strong> (tổ chức–quản lý–công nghệ, TPS/MIS/DSS/ESS) → <strong>HTTT &amp; lợi thế cạnh tranh</strong> (Porter, chuỗi giá trị) → <strong>hạ tầng &amp; nền tảng số</strong> (cloud, di động) → <strong>dữ liệu &amp; tri thức</strong> (BI, data warehouse) → <strong>hệ thống doanh nghiệp</strong> (ERP/SCM/CRM) → <strong>TMĐT &amp; doanh nghiệp số</strong> → <strong>xây dựng &amp; quản lý hệ thống</strong> (SDLC) → <strong>bảo mật, đạo đức &amp; quản trị CNTT</strong>. Bám giáo trình chuẩn (Laudon &amp; Laudon; O’Brien &amp; Marakas), song ngữ, có ví dụ doanh nghiệp thật và quiz mỗi chương. Phân biệt với ISD201: môn này nghiêng quản lý &amp; chiến lược HTTT.',
    whatYouLearn: 'HTTT là hệ thống xã hội - kỹ thuật (tổ chức/quản lý/công nghệ) & các loại hệ thống theo cấp (TPS/MIS/DSS/ESS); năm lực lượng & chuỗi giá trị Porter, ba chiến lược chung; hạ tầng CNTT, cloud (IaaS/PaaS/SaaS), TCO; CSDL, data warehouse/lake, ETL, BI & quản trị tri thức; hệ thống doanh nghiệp ERP, SCM, CRM & tích hợp quy trình; TMĐT (B2C/B2B/C2C), m-commerce, mô hình doanh thu, hiệu ứng mạng; SDLC, waterfall vs Agile, quản lý dự án & thay đổi tổ chức; an ninh (CIA), đạo đức HTTT, quản trị CNTT & tuân thủ (COBIT, GDPR, NĐ13).',
    requirements: 'Không cần biết lập trình sâu. Nên hiểu cơ bản về kinh doanh và quy trình nghiệp vụ. Xem điều kiện tiên quyết của ngành Hệ thống thông tin trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Laudon, O’Brien), HBR & Gartner, khoá học miễn phí, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'MIS là gì, vì sao nhà quản lý cần HTTT, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vai trò của HTTT|||Chapter 1 — The role of MIS', description: 'Tổ chức–quản lý–công nghệ; TPS/MIS/DSS/ESS.', lessons: [c1, c1q] },
    { title: 'Chương 2 — HTTT & lợi thế cạnh tranh|||Chapter 2 — IS & competitive advantage', description: 'Porter, chuỗi giá trị, ba chiến lược chung.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hạ tầng & nền tảng số|||Chapter 3 — IT infrastructure', description: 'Cloud (IaaS/PaaS/SaaS), di động, TCO, quản trị hạ tầng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dữ liệu & tri thức|||Chapter 4 — Data & knowledge', description: 'CSDL, data warehouse/lake, ETL, BI, quản trị tri thức.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hệ thống doanh nghiệp|||Chapter 5 — Enterprise systems', description: 'ERP, SCM, CRM — tích hợp quy trình.', lessons: [c5, c5q] },
    { title: 'Chương 6 — TMĐT & doanh nghiệp số|||Chapter 6 — E-commerce', description: 'B2C/B2B/C2C, m-commerce, mô hình doanh thu, hiệu ứng mạng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Xây dựng & quản lý hệ thống|||Chapter 7 — Building systems', description: 'SDLC, waterfall vs Agile, quản lý dự án & thay đổi.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bảo mật, đạo đức & quản trị|||Chapter 8 — Security & governance', description: 'CIA, đạo đức HTTT, IT governance, GDPR/NĐ13.', lessons: [c8, c8q] },
  ],
};
