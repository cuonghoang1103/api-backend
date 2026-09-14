/**
 * SAP490 — SAP Interdisciplinary Capstone Project (Đồ án tốt nghiệp liên ngành
 * SAP). Ngành Hệ thống thông tin, Kỳ 9, FPTU. ĐỒ ÁN capstone: triển khai/tùy
 * chỉnh một giải pháp SAP thực tế cho doanh nghiệp — khung theo 8 GIAI ĐOẠN
 * của phương pháp SAP Activate, KHÔNG phải 8 chương lý thuyết.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong nội dung; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sap490-0-0-tai-lieu', '📚 Project resources & references|||📚 Tài liệu & nguồn tham khảo đồ án',
  'Trung tâm tài liệu: quy định đồ án FPTU (FLM), SAP Activate, SAP Help Portal, SAP Press, cộng đồng SAP, công cụ dự án.',
  [[
    `<span class="eyebrow">SAP490 · Resources</span>
<h2>Project resources &amp; reference hub</h2>
<p class="lead">Everything you need to run an <strong>SAP implementation capstone</strong> end to end — methodology, official product docs, templates and community — in one place. The FPTU capstone regulations &amp; assessment rubric live on <strong>FLM</strong>; below are free, official SAP resources.</p>
<h3>📘 FPTU capstone regulation &amp; rubric</h3>
<p>Đề cương, quy định bảo vệ &amp; rubric chấm điểm SAP490 ở <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🧭 Methodology — SAP Activate</h3>
<ul>
<li><a href="https://help.sap.com/docs/SAP_ACTIVATE" target="_blank" rel="noopener">SAP Activate methodology (help.sap.com)</a> — Discover → Prepare → Explore → Realize → Deploy → Run.</li>
<li><a href="https://community.sap.com/topics/activate" target="_blank" rel="noopener">SAP Activate community &amp; roadmap</a>.</li>
</ul>
<h3>🌐 Official product documentation</h3>
<ul>
<li><a href="https://help.sap.com/" target="_blank" rel="noopener">SAP Help Portal (help.sap.com)</a> — S/4HANA, ERP, module guides.</li>
<li><a href="https://community.sap.com/" target="_blank" rel="noopener">SAP Community</a> — blogs, Q&amp;A, best practices.</li>
</ul>
<h3>📗 Reference books (SAP Press)</h3>
<ul>
<li><a href="https://www.sap-press.com/" target="_blank" rel="noopener">SAP Press catalogue</a> — configuration &amp; module handbooks (FI, CO, MM, SD, PP, ABAP).</li>
</ul>
<h3>🛠️ Project tools</h3>
<ul>
<li><a href="https://www.sap.com/products/erp/s4hana.html" target="_blank" rel="noopener">SAP S/4HANA</a> — the target ERP platform.</li>
<li><a href="https://developers.sap.com/trials-downloads.html" target="_blank" rel="noopener">SAP trials &amp; downloads</a> — sandbox to practise configuration.</li>
</ul>
<div class="callout"><span class="badge">How to use this course</span>
<ol>
<li><strong>Read the rubric first</strong> — know exactly which deliverables are graded before you start.</li>
<li><strong>Follow the 8 stages in order</strong> — each maps to a SAP Activate phase and produces one deliverable.</li>
<li><strong>Practise in a sandbox</strong> — configure real transactions, do not just read about them.</li>
<li><strong>Keep a project log</strong> — decisions, gaps, risks — it becomes your defense evidence.</li>
</ol></div>`,
    `<span class="eyebrow">SAP490 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; nguồn tham khảo</h2>
<p class="lead">Mọi thứ để chạy trọn một <strong>đồ án triển khai SAP</strong> — phương pháp luận, tài liệu sản phẩm chính thức, mẫu biểu và cộng đồng — gom về một chỗ. Quy định &amp; rubric chấm đồ án của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn SAP miễn phí, chính thức.</p>
<h3>📘 Quy định &amp; rubric đồ án FPTU</h3>
<p>Đề cương, quy định bảo vệ &amp; rubric chấm điểm SAP490 ở <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🧭 Phương pháp — SAP Activate</h3>
<ul>
<li><a href="https://help.sap.com/docs/SAP_ACTIVATE" target="_blank" rel="noopener">Phương pháp SAP Activate (help.sap.com)</a> — Discover → Prepare → Explore → Realize → Deploy → Run.</li>
<li><a href="https://community.sap.com/topics/activate" target="_blank" rel="noopener">Cộng đồng &amp; lộ trình SAP Activate</a>.</li>
</ul>
<h3>🌐 Tài liệu sản phẩm chính thức</h3>
<ul>
<li><a href="https://help.sap.com/" target="_blank" rel="noopener">SAP Help Portal (help.sap.com)</a> — S/4HANA, ERP, hướng dẫn từng phân hệ.</li>
<li><a href="https://community.sap.com/" target="_blank" rel="noopener">SAP Community</a> — blog, hỏi đáp, best practice.</li>
</ul>
<h3>📗 Sách tham khảo (SAP Press)</h3>
<ul>
<li><a href="https://www.sap-press.com/" target="_blank" rel="noopener">Danh mục SAP Press</a> — sách cấu hình &amp; phân hệ (FI, CO, MM, SD, PP, ABAP).</li>
</ul>
<h3>🛠️ Công cụ dự án</h3>
<ul>
<li><a href="https://www.sap.com/products/erp/s4hana.html" target="_blank" rel="noopener">SAP S/4HANA</a> — nền tảng ERP đích.</li>
<li><a href="https://developers.sap.com/trials-downloads.html" target="_blank" rel="noopener">SAP trials &amp; downloads</a> — sandbox để luyện cấu hình.</li>
</ul>
<div class="callout"><span class="badge">Dùng môn này thế nào</span>
<ol>
<li><strong>Đọc rubric trước</strong> — biết chính xác deliverable nào bị chấm trước khi bắt đầu.</li>
<li><strong>Đi 8 giai đoạn theo thứ tự</strong> — mỗi giai đoạn khớp một pha SAP Activate và cho ra một deliverable.</li>
<li><strong>Luyện trong sandbox</strong> — cấu hình giao dịch thật, đừng chỉ đọc lý thuyết.</li>
<li><strong>Ghi nhật ký dự án</strong> — quyết định, gap, rủi ro — đó là bằng chứng khi bảo vệ.</li>
</ol></div>`,
  ]]);

const intro = doc('sap490-0-1-overview', 'Course overview: an SAP implementation capstone|||Tổng quan: đồ án triển khai SAP',
  'Đồ án làm gì; SAP Activate 6 pha; deliverable mỗi giai đoạn; rubric bảo vệ; lộ trình 8 giai đoạn.',
  [[
    `<span class="eyebrow">SAP490 · Lesson 0.1 · Overview</span>
<h2>An SAP implementation capstone</h2>
<p class="lead">SAP490 is <strong>not a lecture course</strong> — it is a <strong>capstone project</strong>. In a team you take one real (or realistic) business and <strong>implement or customise an SAP solution for it end to end</strong>, then defend the result before a committee. This course frames the work as the <strong>8 project stages</strong> of the <strong>SAP Activate</strong> methodology, each ending in a concrete deliverable.</p>
<h3>SAP Activate in one picture</h3>
<pre><code>Discover -> Prepare -> Explore -> Realize -> Deploy -> Run
 (why SAP)  (charter)  (fit-gap)  (build)   (go-live) (support)
</code></pre>
<h3>What you deliver</h3>
<ul>
<li><strong>Business case &amp; scope</strong> — the problem, boundaries, success criteria.</li>
<li><strong>Fit-gap &amp; blueprint</strong> — chosen modules (FI/CO/MM/SD/PP) and how they meet the requirements.</li>
<li><strong>A configured, tested system</strong> — customizing, master data, enhancements, migrated data.</li>
<li><strong>Go-live &amp; hand-over</strong> — trained users, cutover, support plan.</li>
<li><strong>Final report &amp; defense</strong> — results, ROI, lessons.</li>
</ul>
<h3>How you are graded</h3>
<p>The FPTU rubric weighs <strong>process discipline</strong> (did you follow a real method?), <strong>technical depth</strong> (correct configuration &amp; integration), <strong>documentation</strong> and the <strong>oral defense</strong>. Read it in the Resources section before you plan.</p>
<div class="callout"><span class="badge">Interdisciplinary</span> "Liên ngành" means you combine <strong>business process knowledge</strong> (finance, logistics, production) with <strong>IT skills</strong> (configuration, ABAP, integration, data) — that mix is exactly what an SAP consultant does.</div>`,
    `<span class="eyebrow">SAP490 · Bài 0.1 · Tổng quan</span>
<h2>Đồ án triển khai SAP</h2>
<p class="lead">SAP490 <strong>không phải môn lý thuyết</strong> — nó là <strong>đồ án tốt nghiệp</strong>. Theo nhóm, bạn lấy một doanh nghiệp thật (hoặc sát thực tế) và <strong>triển khai hoặc tùy chỉnh một giải pháp SAP trọn vẹn cho họ</strong>, rồi bảo vệ kết quả trước hội đồng. Môn này đóng khung công việc thành <strong>8 giai đoạn dự án</strong> theo phương pháp <strong>SAP Activate</strong>, mỗi giai đoạn kết thúc bằng một deliverable cụ thể.</p>
<h3>SAP Activate trong một hình</h3>
<pre><code>Discover -> Prepare -> Explore -> Realize -> Deploy -> Run
 (vì sao)   (điều lệ)  (fit-gap)  (dựng)   (go-live) (vận hành)
</code></pre>
<h3>Bạn phải nộp gì</h3>
<ul>
<li><strong>Business case &amp; phạm vi</strong> — bài toán, ranh giới, tiêu chí thành công.</li>
<li><strong>Fit-gap &amp; blueprint</strong> — phân hệ đã chọn (FI/CO/MM/SD/PP) và cách chúng đáp ứng yêu cầu.</li>
<li><strong>Hệ thống đã cấu hình &amp; kiểm thử</strong> — customizing, master data, tùy chỉnh, dữ liệu đã di trú.</li>
<li><strong>Go-live &amp; bàn giao</strong> — người dùng đã đào tạo, cutover, kế hoạch hỗ trợ.</li>
<li><strong>Báo cáo cuối &amp; bảo vệ</strong> — kết quả, ROI, bài học.</li>
</ul>
<h3>Bạn được chấm thế nào</h3>
<p>Rubric FPTU cân giữa <strong>kỷ luật quy trình</strong> (có bám phương pháp thật không?), <strong>độ sâu kỹ thuật</strong> (cấu hình &amp; tích hợp đúng), <strong>tài liệu</strong> và <strong>bảo vệ vấn đáp</strong>. Đọc kỹ ở mục Tài liệu trước khi lập kế hoạch.</p>
<div class="callout"><span class="badge">Liên ngành</span> "Liên ngành" nghĩa là bạn kết hợp <strong>kiến thức nghiệp vụ</strong> (tài chính, hậu cần, sản xuất) với <strong>kỹ năng CNTT</strong> (cấu hình, ABAP, tích hợp, dữ liệu) — đúng thứ một tư vấn SAP làm hằng ngày.</div>`,
  ]]);

const s1 = doc('sap490-1-1-discover-scope', 'Stage 1 — Discover & scope the business problem|||Giai đoạn 1 — Khảo sát doanh nghiệp & xác định phạm vi',
  'Discover/Prepare: khảo sát doanh nghiệp, xác định bài toán, phạm vi, mục tiêu, các bên liên quan, project charter.',
  [[
    `<span class="eyebrow">SAP490 · Stage 1 · Discover &amp; Prepare</span>
<h2>Discover &amp; scope the business problem</h2>
<p>The project starts long before configuration. In the <strong>Discover</strong> and <strong>Prepare</strong> phases you understand <em>why</em> the organisation wants SAP and <em>what</em> is in scope, then write a <strong>project charter</strong>.</p>
<h3>What you do</h3>
<ul>
<li><strong>Study the business</strong> — industry, size, current systems, pain points.</li>
<li><strong>Define the problem</strong> — one clear statement (e.g. "manual, error-prone procurement with no spend visibility").</li>
<li><strong>Set scope</strong> — which processes and modules are IN, and explicitly what is OUT.</li>
<li><strong>Identify stakeholders</strong> — sponsor, process owners, end users, IT.</li>
<li><strong>Success criteria</strong> — measurable targets (e.g. "close PO cycle from 5 days to 1").</li>
</ul>
<pre><code>Project charter (skeleton):
 1. Problem statement &amp; objectives
 2. In-scope processes / modules  |  Out-of-scope (explicit)
 3. Stakeholders &amp; RACI
 4. Success criteria (measurable)
 5. High-level timeline &amp; team roles
 6. Assumptions, constraints, risks
</code></pre>
<div class="callout"><span class="badge">Deliverable</span> A signed-off <strong>project charter</strong> with scope, objectives, stakeholders and success criteria. Scope creep is the number-one capstone killer — write the OUT-of-scope list on purpose.</div>`,
    `<span class="eyebrow">SAP490 · Giai đoạn 1 · Discover &amp; Prepare</span>
<h2>Khảo sát doanh nghiệp &amp; xác định phạm vi</h2>
<p>Dự án bắt đầu từ rất lâu trước khi cấu hình. Ở pha <strong>Discover</strong> và <strong>Prepare</strong>, bạn hiểu <em>vì sao</em> tổ chức muốn SAP và <em>cái gì</em> nằm trong phạm vi, rồi viết <strong>project charter</strong> (điều lệ dự án).</p>
<h3>Bạn làm gì</h3>
<ul>
<li><strong>Nghiên cứu doanh nghiệp</strong> — ngành, quy mô, hệ thống hiện tại, điểm đau.</li>
<li><strong>Xác định bài toán</strong> — một câu rõ ràng (vd "mua hàng thủ công, dễ sai, không thấy được chi tiêu").</li>
<li><strong>Chốt phạm vi</strong> — quy trình và phân hệ nào TRONG, và rõ ràng cái gì NGOÀI.</li>
<li><strong>Nhận diện các bên liên quan</strong> — nhà tài trợ, chủ quy trình, người dùng cuối, IT.</li>
<li><strong>Tiêu chí thành công</strong> — mục tiêu đo được (vd "rút chu kỳ PO từ 5 ngày còn 1").</li>
</ul>
<pre><code>Project charter (khung):
 1. Bài toán &amp; mục tiêu
 2. Quy trình / phân hệ trong phạm vi  |  Ngoài phạm vi (rõ ràng)
 3. Các bên liên quan &amp; RACI
 4. Tiêu chí thành công (đo được)
 5. Timeline tổng &amp; vai trò nhóm
 6. Giả định, ràng buộc, rủi ro
</code></pre>
<div class="callout"><span class="badge">Deliverable</span> Một <strong>project charter</strong> đã duyệt gồm phạm vi, mục tiêu, các bên liên quan và tiêu chí thành công. Phình phạm vi là thủ phạm số một giết đồ án — hãy CHỦ ĐỘNG viết danh sách "ngoài phạm vi".</div>`,
  ]]);

const s1q = quiz('sap490-quiz-1', 'Quiz 1 — Discover & scope|||Quiz 1 — Khảo sát & phạm vi', [
  { id: 'q1', question: 'Deliverable chính của giai đoạn Discover/Prepare là gì?', options: ['Mã ABAP đầu tiên', 'Project charter (điều lệ dự án)', 'Kết quả UAT', 'Biên bản go-live'], correctIndex: 1, explanation: 'Discover/Prepare kết thúc bằng project charter: bài toán, phạm vi, mục tiêu, các bên liên quan.' },
  { id: 'q2', question: 'Vì sao phải viết rõ danh sách "ngoài phạm vi" (out-of-scope)?', options: ['Để làm dày báo cáo', 'Để chống phình phạm vi (scope creep)', 'Vì SAP bắt buộc', 'Để bỏ bớt tài liệu'], correctIndex: 1, explanation: 'Ghi rõ cái gì KHÔNG làm là cách chống scope creep — thủ phạm số một giết đồ án.' },
  { id: 'q3', question: 'Tiêu chí thành công tốt nên có tính chất nào?', options: ['Chung chung, dễ đạt', 'Đo được (measurable)', 'Chỉ do IT quyết', 'Không cần các bên đồng ý'], correctIndex: 1, explanation: 'Tiêu chí thành công phải đo được, vd rút chu kỳ PO từ 5 ngày còn 1 ngày.' },
]);

const s2 = doc('sap490-2-1-explore-fitgap', 'Stage 2 — As-is analysis & fit-gap|||Giai đoạn 2 — Phân tích quy trình hiện tại & fit-gap',
  'Explore: lập bản đồ quy trình as-is, so với best practice SAP, phân tích fit-gap, ghi requirement backlog.',
  [[
    `<span class="eyebrow">SAP490 · Stage 2 · Explore</span>
<h2>As-is analysis &amp; fit-gap</h2>
<p>In the <strong>Explore</strong> phase you map how the business works <strong>today (as-is)</strong>, compare it to SAP's <strong>best-practice processes</strong>, and record every difference as a <strong>fit</strong> or a <strong>gap</strong>.</p>
<h3>Steps</h3>
<ul>
<li><strong>Map as-is processes</strong> — interview users, draw flowcharts (procure-to-pay, order-to-cash, etc.).</li>
<li><strong>Run fit-gap workshops</strong> — walk the SAP standard process, ask "does standard cover this?".</li>
<li><strong>Classify each requirement</strong>:</li>
</ul>
<pre><code>Requirement -> Fit  : SAP standard covers it (just configure)
            -> Gap  : standard cannot -> decide:
                        a) change the process to fit SAP (preferred)
                        b) configure a variant
                        c) build an enhancement (last resort, costly)
</code></pre>
<p>Prefer <strong>adopting the standard</strong> over custom code — every enhancement is future maintenance. Log gaps in a <strong>requirement backlog</strong> with a priority (MoSCoW: Must / Should / Could / Won't).</p>
<div class="callout"><span class="badge">Deliverable</span> A <strong>fit-gap analysis</strong> + prioritised requirement backlog. This document decides how much you build vs. configure — and drives the whole timeline.</div>`,
    `<span class="eyebrow">SAP490 · Giai đoạn 2 · Explore</span>
<h2>Phân tích quy trình hiện tại &amp; fit-gap</h2>
<p>Ở pha <strong>Explore</strong>, bạn vẽ lại cách doanh nghiệp vận hành <strong>hiện tại (as-is)</strong>, so với <strong>quy trình best-practice</strong> của SAP, và ghi mọi khác biệt thành một <strong>fit</strong> hoặc một <strong>gap</strong>.</p>
<h3>Các bước</h3>
<ul>
<li><strong>Vẽ quy trình as-is</strong> — phỏng vấn người dùng, vẽ sơ đồ (mua-đến-trả, đặt-đến-thu, v.v.).</li>
<li><strong>Chạy workshop fit-gap</strong> — đi qua quy trình chuẩn SAP, hỏi "chuẩn có phủ được không?".</li>
<li><strong>Phân loại từng yêu cầu</strong>:</li>
</ul>
<pre><code>Yêu cầu -> Fit  : SAP chuẩn phủ được (chỉ cần cấu hình)
        -> Gap  : chuẩn không phủ -> quyết định:
                    a) đổi quy trình để khớp SAP (nên chọn)
                    b) cấu hình một biến thể
                    c) xây enhancement (giải pháp cuối, tốn kém)
</code></pre>
<p>Ưu tiên <strong>theo chuẩn</strong> hơn là viết code riêng — mỗi enhancement là gánh nặng bảo trì về sau. Ghi các gap vào <strong>requirement backlog</strong> kèm mức ưu tiên (MoSCoW: Must / Should / Could / Won't).</p>
<div class="callout"><span class="badge">Deliverable</span> Một <strong>bảng fit-gap</strong> + backlog yêu cầu đã xếp ưu tiên. Tài liệu này quyết định bạn xây bao nhiêu so với cấu hình — và chi phối toàn bộ timeline.</div>`,
  ]]);

const s2q = quiz('sap490-quiz-2', 'Quiz 2 — Explore & fit-gap|||Quiz 2 — Explore & fit-gap', [
  { id: 'q1', question: 'Một yêu cầu được xếp là "fit" nghĩa là gì?', options: ['Phải viết code ABAP mới đáp ứng', 'SAP chuẩn phủ được, chỉ cần cấu hình', 'Phải mua phần mềm ngoài', 'Bỏ qua yêu cầu đó'], correctIndex: 1, explanation: 'Fit = SAP standard đáp ứng được, chỉ cần customizing chứ không cần build thêm.' },
  { id: 'q2', question: 'Khi gặp một "gap", lựa chọn nên ưu tiên nhất là?', options: ['Xây enhancement ABAP ngay', 'Đổi quy trình nghiệp vụ để khớp chuẩn SAP', 'Bỏ yêu cầu', 'Mua module thứ ba'], correctIndex: 1, explanation: 'Ưu tiên adopt standard — đổi quy trình để khớp SAP; enhancement là giải pháp cuối vì tốn bảo trì.' },
  { id: 'q3', question: 'MoSCoW trong backlog yêu cầu dùng để?', options: ['Đặt tên máy chủ', 'Xếp mức ưu tiên yêu cầu (Must/Should/Could/Would-not)', 'Ghi lỗi hệ thống', 'Tính ROI'], correctIndex: 1, explanation: 'MoSCoW = Must have / Should have / Could have / Would-not have, khung xếp ưu tiên các yêu cầu.' },
]);

const s3 = doc('sap490-3-1-blueprint', 'Stage 3 — Solution design & blueprint|||Giai đoạn 3 — Thiết kế giải pháp & blueprint',
  'Chọn phân hệ FI/CO/MM/SD/PP, thiết kế cấu trúc tổ chức, quy trình to-be, blueprint tài liệu thiết kế.',
  [[
    `<span class="eyebrow">SAP490 · Stage 3 · Explore (design)</span>
<h2>Solution design &amp; blueprint</h2>
<p>Now turn the fit-gap into a <strong>solution design</strong>: which SAP modules you use, the <strong>enterprise structure</strong>, and the <strong>to-be processes</strong>. The output is the <strong>blueprint</strong> — the single design document everyone builds from.</p>
<h3>Pick the modules for your scenario</h3>
<ul>
<li><strong>FI (Financial Accounting)</strong> — general ledger, AP/AR, external reporting.</li>
<li><strong>CO (Controlling)</strong> — cost centres, internal reporting, profitability.</li>
<li><strong>MM (Materials Management)</strong> — procurement, inventory, procure-to-pay.</li>
<li><strong>SD (Sales &amp; Distribution)</strong> — sales orders, delivery, billing, order-to-cash.</li>
<li><strong>PP (Production Planning)</strong> — BOM, routing, manufacturing orders.</li>
</ul>
<h3>Design the enterprise structure</h3>
<pre><code>Client
 └─ Company Code (legal entity, FI)
     ├─ Plant (MM/PP: where goods are made/stored)
     │   └─ Storage Location
     ├─ Sales Org -> Distribution Channel -> Division (SD)
     └─ Controlling Area (CO)
</code></pre>
<p>Getting this hierarchy right is critical — it is <strong>hard to change after data exists</strong>. Document every to-be process as a flow, note integration points between modules (e.g. a goods receipt in MM posts to FI automatically).</p>
<div class="callout"><span class="badge">Deliverable</span> A <strong>blueprint / solution design document</strong>: chosen modules, enterprise structure, to-be process flows, integration map. This is signed off before any configuration.</div>`,
    `<span class="eyebrow">SAP490 · Giai đoạn 3 · Explore (thiết kế)</span>
<h2>Thiết kế giải pháp &amp; blueprint</h2>
<p>Giờ biến fit-gap thành <strong>thiết kế giải pháp</strong>: dùng phân hệ SAP nào, <strong>cấu trúc tổ chức</strong> ra sao, và <strong>quy trình to-be</strong>. Kết quả là <strong>blueprint</strong> — tài liệu thiết kế duy nhất mà mọi người dựa vào để xây.</p>
<h3>Chọn phân hệ cho kịch bản của bạn</h3>
<ul>
<li><strong>FI (Kế toán tài chính)</strong> — sổ cái, phải trả/phải thu, báo cáo ra ngoài.</li>
<li><strong>CO (Kiểm soát)</strong> — trung tâm chi phí, báo cáo nội bộ, lợi nhuận.</li>
<li><strong>MM (Quản lý vật tư)</strong> — mua sắm, tồn kho, mua-đến-trả.</li>
<li><strong>SD (Bán hàng &amp; phân phối)</strong> — đơn bán, giao hàng, xuất hóa đơn, đặt-đến-thu.</li>
<li><strong>PP (Hoạch định sản xuất)</strong> — BOM, routing, lệnh sản xuất.</li>
</ul>
<h3>Thiết kế cấu trúc tổ chức</h3>
<pre><code>Client
 └─ Company Code (pháp nhân, FI)
     ├─ Plant (MM/PP: nơi sản xuất/lưu trữ)
     │   └─ Storage Location
     ├─ Sales Org -> Distribution Channel -> Division (SD)
     └─ Controlling Area (CO)
</code></pre>
<p>Dựng đúng cây phân cấp này rất quan trọng — nó <strong>rất khó đổi khi đã có dữ liệu</strong>. Tài liệu hóa mọi quy trình to-be dạng flow, ghi các điểm tích hợp giữa phân hệ (vd nhập kho ở MM tự hạch toán sang FI).</p>
<div class="callout"><span class="badge">Deliverable</span> Một <strong>tài liệu blueprint / thiết kế giải pháp</strong>: phân hệ đã chọn, cấu trúc tổ chức, luồng quy trình to-be, bản đồ tích hợp. Nó được duyệt trước khi cấu hình bất cứ thứ gì.</div>`,
  ]]);

const s3q = quiz('sap490-quiz-3', 'Quiz 3 — Blueprint|||Quiz 3 — Blueprint', [
  { id: 'q1', question: 'Phân hệ nào phụ trách mua sắm, tồn kho (procure-to-pay)?', options: ['SD', 'FI', 'MM (Materials Management)', 'PP'], correctIndex: 2, explanation: 'MM (Materials Management) lo mua sắm, tồn kho, quy trình procure-to-pay.' },
  { id: 'q2', question: 'Company Code trong cấu trúc tổ chức SAP đại diện cho?', options: ['Một pháp nhân/đơn vị kế toán (FI)', 'Một nhà kho vật lý', 'Một người dùng', 'Một đơn bán hàng'], correctIndex: 0, explanation: 'Company Code là pháp nhân lập báo cáo tài chính độc lập, gắn với phân hệ FI.' },
  { id: 'q3', question: 'Vì sao phải chốt cấu trúc tổ chức trước khi cấu hình?', options: ['Vì đẹp báo cáo', 'Vì nó rất khó đổi khi đã có dữ liệu', 'Vì SAP tự khóa lại', 'Không quan trọng, đổi lúc nào cũng được'], correctIndex: 1, explanation: 'Cấu trúc tổ chức khó đổi khi đã có dữ liệu giao dịch, nên phải thiết kế đúng từ blueprint.' },
]);

const s4 = doc('sap490-4-1-configuration', 'Stage 4 — System configuration & master data|||Giai đoạn 4 — Cấu hình hệ thống & master data',
  'Realize: customizing qua IMG/SPRO, tạo enterprise structure, master data (khách/vật tư/nhà cung cấp), transport request.',
  [[
    `<span class="eyebrow">SAP490 · Stage 4 · Realize (configure)</span>
<h2>System configuration &amp; master data</h2>
<p>The <strong>Realize</strong> phase is where the blueprint becomes a working system. You configure SAP through the <strong>IMG (Implementation Guide)</strong>, reached with transaction <strong>SPRO</strong>, and load the <strong>master data</strong> the processes need.</p>
<h3>Customizing (configuration)</h3>
<ul>
<li>Build the <strong>enterprise structure</strong> designed in the blueprint (company code, plant, sales org...).</li>
<li>Configure module settings — document types, number ranges, pricing procedures, movement types.</li>
<li>Configuration changes travel between systems in a <strong>transport request</strong> (Dev -> QA -> Prod) — never change directly in production.</li>
</ul>
<h3>Master data — the foundation of every transaction</h3>
<pre><code>Master data (created once, used by many documents):
  Customer master        (SD)
  Vendor / supplier      (MM)
  Material master        (MM/PP/SD)
  G/L accounts, cost centres (FI/CO)
  BOM &amp; routing         (PP)
Transaction data (day-to-day): PO, sales order, invoice, prod. order
</code></pre>
<p>Distinguish <strong>customizing</strong> (settings, transported) from <strong>master data</strong> (business records, migrated). Both must be right before you can test.</p>
<div class="callout"><span class="badge">Deliverable</span> A <strong>configured system in the Dev/QA client</strong> with enterprise structure, module settings and baseline master data — plus a configuration document listing the IMG settings you made.</div>`,
    `<span class="eyebrow">SAP490 · Giai đoạn 4 · Realize (cấu hình)</span>
<h2>Cấu hình hệ thống &amp; master data</h2>
<p>Pha <strong>Realize</strong> là nơi blueprint trở thành hệ thống chạy được. Bạn cấu hình SAP qua <strong>IMG (Implementation Guide)</strong>, mở bằng giao dịch <strong>SPRO</strong>, và nạp <strong>master data</strong> mà các quy trình cần.</p>
<h3>Customizing (cấu hình)</h3>
<ul>
<li>Dựng <strong>cấu trúc tổ chức</strong> đã thiết kế ở blueprint (company code, plant, sales org...).</li>
<li>Cấu hình thiết lập phân hệ — loại chứng từ, dải số, pricing procedure, movement type.</li>
<li>Thay đổi cấu hình di chuyển giữa các hệ thống bằng <strong>transport request</strong> (Dev -> QA -> Prod) — không bao giờ sửa thẳng trên production.</li>
</ul>
<h3>Master data — nền của mọi giao dịch</h3>
<pre><code>Master data (tạo một lần, nhiều chứng từ dùng):
  Customer master        (SD)
  Vendor / nhà cung cấp  (MM)
  Material master        (MM/PP/SD)
  Tài khoản G/L, cost center (FI/CO)
  BOM &amp; routing         (PP)
Transaction data (hằng ngày): PO, đơn bán, hóa đơn, lệnh sản xuất
</code></pre>
<p>Phân biệt <strong>customizing</strong> (thiết lập, đi qua transport) với <strong>master data</strong> (bản ghi nghiệp vụ, được di trú). Cả hai phải đúng thì mới kiểm thử được.</p>
<div class="callout"><span class="badge">Deliverable</span> Một <strong>hệ thống đã cấu hình trong client Dev/QA</strong> với cấu trúc tổ chức, thiết lập phân hệ và master data nền — kèm tài liệu cấu hình liệt kê các thiết lập IMG bạn đã làm.</div>`,
  ]]);

const s4q = quiz('sap490-quiz-4', 'Quiz 4 — Configuration|||Quiz 4 — Cấu hình', [
  { id: 'q1', question: 'Giao dịch nào mở IMG (Implementation Guide) để customizing?', options: ['SE80', 'SPRO', 'VA01', 'ME21N'], correctIndex: 1, explanation: 'SPRO mở IMG — nơi thực hiện toàn bộ customizing của hệ thống.' },
  { id: 'q2', question: 'Thay đổi cấu hình di chuyển giữa các hệ thống bằng gì?', options: ['Copy tay từng bảng', 'Transport request (Dev -> QA -> Prod)', 'Email cho quản trị', 'Đổi thẳng trên production'], correctIndex: 1, explanation: 'Cấu hình đi qua transport request theo landscape Dev -> QA -> Prod; không sửa thẳng production.' },
  { id: 'q3', question: 'Material master thuộc loại dữ liệu nào?', options: ['Transaction data', 'Master data', 'Log hệ thống', 'Transport request'], correctIndex: 1, explanation: 'Material master là master data — tạo một lần, nhiều chứng từ giao dịch dùng lại.' },
]);

const s5 = doc('sap490-5-1-develop-integrate', 'Stage 5 — Custom development & integration|||Giai đoạn 5 — Phát triển tùy chỉnh & tích hợp',
  'Realize: enhancement khi gap không đóng được bằng cấu hình — RICEFW, ABAP/BAdI/user-exit, tích hợp interface/IDoc/API.',
  [[
    `<span class="eyebrow">SAP490 · Stage 5 · Realize (build)</span>
<h2>Custom development &amp; integration</h2>
<p>Some gaps cannot be closed by configuration alone. In this part of <strong>Realize</strong> you build the custom objects — but only for the gaps your fit-gap marked as "enhancement". Developers group these as <strong>RICEFW</strong>.</p>
<h3>RICEFW — the custom object types</h3>
<pre><code>R - Reports        (custom lists / analytics)
I - Interfaces     (talk to other systems: IDoc, API, file)
C - Conversions    (one-time data migration programs)
E - Enhancements   (extend standard: BAdI, user-exit, BTP)
F - Forms          (invoices, POs: SmartForms / Adobe Forms)
W - Workflow       (approvals, routing)
</code></pre>
<h3>Extend, do not modify</h3>
<ul>
<li>Prefer <strong>BAdI</strong> and <strong>user-exits</strong> — official extension points that survive upgrades.</li>
<li>Never modify SAP standard code directly — it breaks on the next upgrade.</li>
<li>On S/4HANA, keep the core clean ("clean core") and put extensions on <strong>SAP BTP</strong> where possible.</li>
</ul>
<h3>Integration</h3>
<p>Connect SAP to other systems: <strong>IDoc</strong> for classic EDI, <strong>OData/REST APIs</strong> for modern apps, <strong>middleware</strong> (SAP Integration Suite) for orchestration. Document each interface: direction, trigger, data, error handling.</p>
<div class="callout"><span class="badge">Deliverable</span> Working <strong>enhancements + interfaces</strong> for the approved gaps, each with a technical spec (functional spec -> technical spec -> unit-tested code).</div>`,
    `<span class="eyebrow">SAP490 · Giai đoạn 5 · Realize (dựng)</span>
<h2>Phát triển tùy chỉnh &amp; tích hợp</h2>
<p>Một số gap không thể đóng chỉ bằng cấu hình. Ở phần này của <strong>Realize</strong>, bạn xây các đối tượng tùy chỉnh — nhưng chỉ cho những gap mà fit-gap đã đánh dấu "enhancement". Dân phát triển gom chúng thành <strong>RICEFW</strong>.</p>
<h3>RICEFW — các loại đối tượng tùy chỉnh</h3>
<pre><code>R - Reports        (báo cáo/phân tích tùy chỉnh)
I - Interfaces     (nối hệ khác: IDoc, API, file)
C - Conversions    (chương trình di trú dữ liệu một lần)
E - Enhancements   (mở rộng chuẩn: BAdI, user-exit, BTP)
F - Forms          (hóa đơn, PO: SmartForms / Adobe Forms)
W - Workflow       (phê duyệt, định tuyến)
</code></pre>
<h3>Mở rộng, đừng sửa đổi</h3>
<ul>
<li>Ưu tiên <strong>BAdI</strong> và <strong>user-exit</strong> — điểm mở rộng chính thức, sống sót qua nâng cấp.</li>
<li>Không bao giờ sửa thẳng mã chuẩn SAP — nó vỡ ở lần nâng cấp kế tiếp.</li>
<li>Trên S/4HANA, giữ lõi sạch ("clean core") và đưa mở rộng lên <strong>SAP BTP</strong> khi có thể.</li>
</ul>
<h3>Tích hợp</h3>
<p>Nối SAP với hệ khác: <strong>IDoc</strong> cho EDI cổ điển, <strong>OData/REST API</strong> cho ứng dụng hiện đại, <strong>middleware</strong> (SAP Integration Suite) để điều phối. Tài liệu hóa mỗi interface: chiều, trigger, dữ liệu, xử lý lỗi.</p>
<div class="callout"><span class="badge">Deliverable</span> Các <strong>enhancement + interface</strong> chạy được cho những gap đã duyệt, mỗi cái kèm đặc tả kỹ thuật (functional spec -> technical spec -> code đã unit-test).</div>`,
  ]]);

const s5q = quiz('sap490-quiz-5', 'Quiz 5 — Development|||Quiz 5 — Phát triển', [
  { id: 'q1', question: 'Chữ "E" trong RICEFW là gì?', options: ['Export', 'Enhancements (mở rộng chuẩn)', 'Encryption', 'Endpoint'], correctIndex: 1, explanation: 'RICEFW: Reports, Interfaces, Conversions, Enhancements, Forms, Workflow — E là Enhancements.' },
  { id: 'q2', question: 'Cách đúng để mở rộng chức năng chuẩn SAP mà không vỡ khi nâng cấp?', options: ['Sửa thẳng code chuẩn SAP', 'Dùng BAdI / user-exit (điểm mở rộng chính thức)', 'Xóa chương trình chuẩn', 'Copy toàn bộ chương trình chuẩn'], correctIndex: 1, explanation: 'Dùng BAdI/user-exit — điểm mở rộng chính thức; sửa code chuẩn sẽ vỡ khi upgrade.' },
  { id: 'q3', question: 'Để tích hợp SAP với hệ thống EDI cổ điển thường dùng?', options: ['IDoc', 'SPRO', 'VA01', 'BOM'], correctIndex: 0, explanation: 'IDoc là định dạng trao đổi dữ liệu cổ điển của SAP cho EDI/interface.' },
]);

const s6 = doc('sap490-6-1-testing-migration', 'Stage 6 — Testing & data migration|||Giai đoạn 6 — Kiểm thử & di trú dữ liệu',
  'Realize: unit/integration/UAT, kịch bản kiểm thử end-to-end; di trú dữ liệu (ETL: extract-transform-load), đối soát.',
  [[
    `<span class="eyebrow">SAP490 · Stage 6 · Realize (test)</span>
<h2>Testing &amp; data migration</h2>
<p>Before go-live you must <strong>prove the system works</strong> and <strong>move the real data in</strong>. These two activities run near the end of <strong>Realize</strong>.</p>
<h3>Test in layers</h3>
<pre><code>Unit test        -> one config / one program in isolation
Integration test -> a full end-to-end process across modules
                    (e.g. sales order -> delivery -> billing -> FI posting)
UAT (User Acceptance) -> business users sign off against requirements
Regression       -> re-run key scenarios after any fix
</code></pre>
<p>Write <strong>test cases</strong> from the requirement backlog: input, steps, expected result, actual result, pass/fail. A requirement without a passing test case is not "done".</p>
<h3>Data migration (ETL)</h3>
<ul>
<li><strong>Extract</strong> data from legacy systems.</li>
<li><strong>Transform</strong> / cleanse — map old codes to SAP master data, drop duplicates, fix formats.</li>
<li><strong>Load</strong> — via tools like the Migration Cockpit (LTMC/LTMOM), LSMW or BAPIs.</li>
<li><strong>Reconcile</strong> — counts and totals must match the source ("garbage in, garbage out").</li>
</ul>
<div class="callout"><span class="badge">Deliverable</span> A <strong>test report</strong> (cases, results, defects &amp; fixes) plus a <strong>migrated, reconciled data set</strong> in the QA client, ready for cutover.</div>`,
    `<span class="eyebrow">SAP490 · Giai đoạn 6 · Realize (kiểm thử)</span>
<h2>Kiểm thử &amp; di trú dữ liệu</h2>
<p>Trước go-live, bạn phải <strong>chứng minh hệ thống chạy đúng</strong> và <strong>đưa dữ liệu thật vào</strong>. Hai việc này chạy gần cuối pha <strong>Realize</strong>.</p>
<h3>Kiểm thử theo lớp</h3>
<pre><code>Unit test        -> một cấu hình / một chương trình riêng lẻ
Integration test -> một quy trình end-to-end xuyên phân hệ
                    (vd đơn bán -> giao hàng -> xuất hóa đơn -> hạch toán FI)
UAT (nghiệm thu)  -> người dùng nghiệp vụ ký duyệt theo yêu cầu
Regression       -> chạy lại kịch bản chính sau mỗi lần sửa
</code></pre>
<p>Viết <strong>test case</strong> từ backlog yêu cầu: đầu vào, các bước, kết quả mong đợi, kết quả thực, pass/fail. Một yêu cầu không có test case pass thì chưa gọi là "xong".</p>
<h3>Di trú dữ liệu (ETL)</h3>
<ul>
<li><strong>Extract</strong> — rút dữ liệu từ hệ thống cũ.</li>
<li><strong>Transform</strong> / làm sạch — ánh xạ mã cũ sang master data SAP, bỏ trùng, sửa định dạng.</li>
<li><strong>Load</strong> — bằng công cụ như Migration Cockpit (LTMC/LTMOM), LSMW hoặc BAPI.</li>
<li><strong>Reconcile</strong> — số lượng và tổng phải khớp nguồn ("rác vào thì rác ra").</li>
</ul>
<div class="callout"><span class="badge">Deliverable</span> Một <strong>báo cáo kiểm thử</strong> (test case, kết quả, lỗi &amp; cách sửa) cùng một <strong>bộ dữ liệu đã di trú, đã đối soát</strong> trong client QA, sẵn sàng cho cutover.</div>`,
  ]]);

const s6q = quiz('sap490-quiz-6', 'Quiz 6 — Testing & migration|||Quiz 6 — Kiểm thử & di trú', [
  { id: 'q1', question: 'Kiểm thử chạy một quy trình end-to-end xuyên nhiều phân hệ gọi là?', options: ['Unit test', 'Integration test', 'Cài đặt', 'Backup'], correctIndex: 1, explanation: 'Integration test kiểm cả luồng end-to-end xuyên phân hệ, vd đơn bán -> giao -> hóa đơn -> FI.' },
  { id: 'q2', question: 'UAT (User Acceptance Test) do ai thực hiện và mục đích gì?', options: ['Lập trình viên, để test code', 'Người dùng nghiệp vụ ký duyệt theo yêu cầu', 'Quản trị hệ thống, để backup', 'Nhà cung cấp SAP'], correctIndex: 1, explanation: 'UAT do người dùng nghiệp vụ chạy để nghiệm thu hệ thống có đáp ứng yêu cầu hay không.' },
  { id: 'q3', question: 'Trong di trú dữ liệu ETL, bước "Transform" làm gì?', options: ['Rút dữ liệu từ hệ cũ', 'Làm sạch & ánh xạ dữ liệu sang chuẩn SAP', 'Nạp thẳng không kiểm', 'Xóa dữ liệu nguồn'], correctIndex: 1, explanation: 'Transform là làm sạch, ánh xạ mã cũ sang master data SAP, bỏ trùng, sửa định dạng trước khi load.' },
]);

const s7 = doc('sap490-7-1-training-golive', 'Stage 7 — Training, go-live & support|||Giai đoạn 7 — Đào tạo người dùng, go-live & hỗ trợ',
  'Deploy/Run: đào tạo end-user, chuẩn bị cutover, go-live, hypercare, chuyển sang vận hành và hỗ trợ.',
  [[
    `<span class="eyebrow">SAP490 · Stage 7 · Deploy &amp; Run</span>
<h2>Training, go-live &amp; support</h2>
<p>A perfect system fails if users cannot use it. The <strong>Deploy</strong> phase readies people and switches the business onto SAP; the <strong>Run</strong> phase keeps it healthy.</p>
<h3>End-user training</h3>
<ul>
<li>Prepare <strong>role-based training</strong> — a warehouse clerk needs different screens than an accountant.</li>
<li>Write <strong>step-by-step guides</strong> and quick-reference cards for each key transaction.</li>
<li>Run hands-on sessions in a training client with realistic data.</li>
</ul>
<h3>Cutover &amp; go-live</h3>
<pre><code>Cutover plan (the switch weekend):
 1. Freeze legacy system (no new transactions)
 2. Final data migration &amp; reconciliation
 3. Transport all config to Production
 4. Smoke-test critical processes in Prod
 5. Go / No-Go decision -> open Prod to users
 6. Hypercare: extra support for the first weeks
</code></pre>
<h3>Support &amp; operations (Run)</h3>
<p>After go-live, incidents flow through a <strong>support / ticketing</strong> process with priority levels; the team monitors performance, batch jobs and interfaces, and plans continuous improvement.</p>
<div class="callout"><span class="badge">Deliverable</span> <strong>Training materials</strong>, a <strong>cutover plan</strong>, evidence of a successful go-live, and a <strong>support / hypercare plan</strong>.</div>`,
    `<span class="eyebrow">SAP490 · Giai đoạn 7 · Deploy &amp; Run</span>
<h2>Đào tạo người dùng, go-live &amp; hỗ trợ</h2>
<p>Một hệ thống hoàn hảo vẫn thất bại nếu người dùng không dùng được. Pha <strong>Deploy</strong> chuẩn bị con người và chuyển doanh nghiệp sang SAP; pha <strong>Run</strong> giữ nó khỏe mạnh.</p>
<h3>Đào tạo người dùng cuối</h3>
<ul>
<li>Chuẩn bị <strong>đào tạo theo vai trò</strong> — thủ kho cần màn hình khác kế toán.</li>
<li>Viết <strong>hướng dẫn từng bước</strong> và thẻ tra nhanh cho mỗi giao dịch chính.</li>
<li>Tổ chức buổi thực hành trong client đào tạo với dữ liệu sát thực tế.</li>
</ul>
<h3>Cutover &amp; go-live</h3>
<pre><code>Kế hoạch cutover (cuối tuần chuyển đổi):
 1. Đóng băng hệ cũ (không nhập giao dịch mới)
 2. Di trú dữ liệu lần cuối &amp; đối soát
 3. Transport toàn bộ cấu hình sang Production
 4. Smoke-test các quy trình quan trọng trên Prod
 5. Quyết định Go / No-Go -> mở Prod cho người dùng
 6. Hypercare: hỗ trợ tăng cường vài tuần đầu
</code></pre>
<h3>Hỗ trợ &amp; vận hành (Run)</h3>
<p>Sau go-live, sự cố đi qua quy trình <strong>hỗ trợ / ticketing</strong> có mức ưu tiên; nhóm giám sát hiệu năng, batch job và interface, và lên kế hoạch cải tiến liên tục.</p>
<div class="callout"><span class="badge">Deliverable</span> <strong>Tài liệu đào tạo</strong>, một <strong>kế hoạch cutover</strong>, bằng chứng go-live thành công, và một <strong>kế hoạch hỗ trợ / hypercare</strong>.</div>`,
  ]]);

const s7q = quiz('sap490-quiz-7', 'Quiz 7 — Go-live|||Quiz 7 — Go-live', [
  { id: 'q1', question: '"Hypercare" trong go-live nghĩa là gì?', options: ['Xóa dữ liệu cũ', 'Hỗ trợ tăng cường trong những tuần đầu sau go-live', 'Đào tạo trước dự án', 'Kiểm thử unit'], correctIndex: 1, explanation: 'Hypercare là giai đoạn hỗ trợ tăng cường ngay sau go-live để xử lý nhanh sự cố phát sinh.' },
  { id: 'q2', question: 'Vì sao nên đào tạo "theo vai trò" (role-based)?', options: ['Để tiết kiệm giấy', 'Vì mỗi vai trò dùng màn hình/giao dịch khác nhau', 'Vì SAP bắt buộc', 'Để giảm số người dùng'], correctIndex: 1, explanation: 'Đào tạo theo vai trò vì thủ kho, kế toán... dùng các giao dịch và màn hình khác nhau.' },
  { id: 'q3', question: 'Bước "Go / No-Go" trong kế hoạch cutover để làm gì?', options: ['Chọn màu giao diện', 'Quyết định có chính thức mở Production cho người dùng hay không', 'Viết code ABAP', 'Chọn phân hệ'], correctIndex: 1, explanation: 'Go/No-Go là quyết định chính thức có mở hệ Production cho người dùng sau khi smoke-test đạt.' },
]);

const s8 = doc('sap490-8-1-evaluation-defense', 'Stage 8 — Evaluation, ROI report & defense|||Giai đoạn 8 — Đánh giá, báo cáo ROI & bảo vệ đồ án',
  'Đánh giá kết quả so tiêu chí thành công, tính ROI/lợi ích, bài học, viết báo cáo cuối, chuẩn bị bảo vệ trước hội đồng.',
  [[
    `<span class="eyebrow">SAP490 · Stage 8 · Close &amp; defend</span>
<h2>Evaluation, ROI report &amp; defense</h2>
<p>The final stage closes the project: measure what you achieved, quantify the value, capture lessons, and <strong>defend the work before the committee</strong>.</p>
<h3>Evaluate against the charter</h3>
<ul>
<li>Revisit the <strong>success criteria</strong> from Stage 1 — did you meet each measurable target?</li>
<li>Report scope delivered vs. planned, defects, timeline, and any de-scoped items.</li>
</ul>
<h3>Quantify the value (ROI)</h3>
<pre><code>ROI = (Benefits - Costs) / Costs × 100%
 Benefits: time saved, fewer errors, better visibility, lower stock
 Costs:    licences, implementation effort, training, support
 Payback period = time until cumulative benefits &gt; cost
</code></pre>
<p>Use realistic, evidence-based numbers — an inflated ROI is the fastest way to lose credibility in the defense.</p>
<h3>Final report &amp; defense</h3>
<ul>
<li>Write the <strong>capstone report</strong>: problem, method (SAP Activate), design, build, results, ROI, lessons.</li>
<li>Prepare a <strong>demo</strong> of the working system and a slide deck.</li>
<li>Anticipate committee questions — "why this module?", "how did you close gap X?", "what would you do differently?".</li>
</ul>
<div class="callout"><span class="badge">Deliverable</span> The <strong>final capstone report + ROI analysis</strong>, a live <strong>system demo</strong>, and a successful <strong>oral defense</strong> against the FPTU rubric. That is the whole SAP Activate journey — Discover to Run — proven end to end.</div>`,
    `<span class="eyebrow">SAP490 · Giai đoạn 8 · Đóng &amp; bảo vệ</span>
<h2>Đánh giá, báo cáo ROI &amp; bảo vệ đồ án</h2>
<p>Giai đoạn cuối khép lại dự án: đo bạn đạt được gì, lượng hóa giá trị, đúc kết bài học, và <strong>bảo vệ công trình trước hội đồng</strong>.</p>
<h3>Đánh giá so với charter</h3>
<ul>
<li>Quay lại <strong>tiêu chí thành công</strong> ở Giai đoạn 1 — có đạt từng mục tiêu đo được không?</li>
<li>Báo cáo phạm vi đã giao so với kế hoạch, lỗi, timeline, và các hạng mục đã cắt.</li>
</ul>
<h3>Lượng hóa giá trị (ROI)</h3>
<pre><code>ROI = (Lợi ích - Chi phí) / Chi phí × 100%
 Lợi ích: tiết kiệm thời gian, giảm lỗi, minh bạch hơn, giảm tồn kho
 Chi phí: license, công triển khai, đào tạo, hỗ trợ
 Payback = thời gian đến khi lợi ích tích lũy &gt; chi phí
</code></pre>
<p>Dùng số thực tế, có bằng chứng — ROI thổi phồng là cách nhanh nhất để mất uy tín khi bảo vệ.</p>
<h3>Báo cáo cuối &amp; bảo vệ</h3>
<ul>
<li>Viết <strong>báo cáo đồ án</strong>: bài toán, phương pháp (SAP Activate), thiết kế, dựng, kết quả, ROI, bài học.</li>
<li>Chuẩn bị <strong>demo</strong> hệ thống chạy được và bộ slide.</li>
<li>Dự đoán câu hỏi hội đồng — "vì sao chọn phân hệ này?", "đóng gap X thế nào?", "làm lại sẽ đổi gì?".</li>
</ul>
<div class="callout"><span class="badge">Deliverable</span> <strong>Báo cáo đồ án cuối + phân tích ROI</strong>, một <strong>demo hệ thống</strong> chạy trực tiếp, và một buổi <strong>bảo vệ vấn đáp</strong> đạt theo rubric FPTU. Đó là trọn hành trình SAP Activate — từ Discover đến Run — được chứng minh end-to-end.</div>`,
  ]]);

const s8q = quiz('sap490-quiz-8', 'Quiz 8 — Evaluation & defense|||Quiz 8 — Đánh giá & bảo vệ', [
  { id: 'q1', question: 'Công thức ROI đúng là?', options: ['ROI = Chi phí / Lợi ích', 'ROI = (Lợi ích - Chi phí) / Chi phí × 100%', 'ROI = Lợi ích × Chi phí', 'ROI = Lợi ích - Chi phí + license'], correctIndex: 1, explanation: 'ROI = (Lợi ích - Chi phí) / Chi phí × 100% — đo giá trị so với vốn bỏ ra.' },
  { id: 'q2', question: 'Khi đánh giá kết quả đồ án nên đối chiếu với cái gì?', options: ['Số dòng code', 'Tiêu chí thành công đã đặt ở Giai đoạn 1', 'Số giờ họp', 'Số phân hệ SAP có trên thị trường'], correctIndex: 1, explanation: 'Đánh giá là đối chiếu kết quả với tiêu chí thành công (đo được) đã chốt trong charter ở Giai đoạn 1.' },
  { id: 'q3', question: 'Vì sao không nên thổi phồng số ROI trong báo cáo?', options: ['Vì tốn giấy', 'Vì sẽ mất uy tín khi bảo vệ trước hội đồng', 'Vì SAP cấm', 'Vì làm chậm hệ thống'], correctIndex: 1, explanation: 'Số liệu phải thực tế, có bằng chứng; ROI thổi phồng dễ bị hội đồng bắt lỗi và mất uy tín.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'SAP490',
    slug: 'sap490-sap-interdisciplinary-capstone-project',
    title: 'SAP Interdisciplinary Capstone Project',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SAP490.webp',
    shortDescription: 'Hands-on SAP capstone — run a real SAP implementation end to end with SAP Activate: scope discovery, fit-gap, blueprint (FI/CO/MM/SD/PP), configuration, ABAP enhancements, testing & data migration, training, go-live & final defense. Bilingual, with quizzes.|||Đồ án SAP thực chiến — chạy trọn dự án triển khai SAP theo SAP Activate: khảo sát, fit-gap, blueprint (FI/CO/MM/SD/PP), cấu hình, tùy chỉnh ABAP, kiểm thử & di trú, đào tạo, go-live & bảo vệ. Song ngữ, có quiz.',
    description: 'Môn <strong>SAP490 — SAP Interdisciplinary Capstone Project</strong> (Đồ án tốt nghiệp liên ngành SAP, ngành Hệ thống thông tin, kỳ 9) là một <strong>đồ án triển khai SAP thực tế</strong>, không phải môn lý thuyết. Theo nhóm, bạn triển khai/tùy chỉnh một giải pháp SAP cho doanh nghiệp và bảo vệ trước hội đồng. Môn được đóng khung theo <strong>8 giai đoạn dự án của SAP Activate</strong>: khảo sát &amp; phạm vi → phân tích fit-gap → thiết kế blueprint (FI/CO/MM/SD/PP) → cấu hình &amp; master data → phát triển tùy chỉnh &amp; tích hợp → kiểm thử &amp; di trú dữ liệu → đào tạo, go-live &amp; hỗ trợ → đánh giá, ROI &amp; bảo vệ. Song ngữ, mỗi giai đoạn có tài liệu và quiz.',
    whatYouLearn: 'Chạy trọn một dự án SAP theo SAP Activate; viết project charter &amp; xác định phạm vi; phân tích quy trình as-is và fit-gap (MoSCoW); thiết kế blueprint &amp; cấu trúc tổ chức, chọn phân hệ FI/CO/MM/SD/PP; customizing qua IMG/SPRO &amp; quản lý master data/transport; enhancement RICEFW (BAdI/user-exit) &amp; tích hợp (IDoc/API); kiểm thử unit/integration/UAT &amp; di trú dữ liệu ETL; đào tạo, cutover &amp; go-live; đánh giá kết quả, tính ROI và bảo vệ đồ án.',
    requirements: 'Đã học các môn nền về SAP/ERP và quản trị nghiệp vụ; nên có tài khoản sandbox SAP (S/4HANA trial) để luyện cấu hình. Xem điều kiện tiên quyết và rubric đồ án trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Project resources', description: 'Quy định đồ án FPTU, SAP Activate, SAP Help, SAP Press, cộng đồng, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đồ án triển khai SAP, SAP Activate, deliverable, rubric.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Khảo sát & phạm vi|||Stage 1 — Discover & scope', description: 'Discover/Prepare: bài toán, phạm vi, project charter.', lessons: [s1, s1q] },
    { title: 'Giai đoạn 2 — Fit-gap|||Stage 2 — Explore & fit-gap', description: 'As-is, best practice, fit-gap, backlog.', lessons: [s2, s2q] },
    { title: 'Giai đoạn 3 — Blueprint|||Stage 3 — Blueprint', description: 'Chọn FI/CO/MM/SD/PP, cấu trúc tổ chức, to-be.', lessons: [s3, s3q] },
    { title: 'Giai đoạn 4 — Cấu hình|||Stage 4 — Configuration', description: 'Customizing IMG/SPRO, master data, transport.', lessons: [s4, s4q] },
    { title: 'Giai đoạn 5 — Phát triển & tích hợp|||Stage 5 — Development', description: 'RICEFW, BAdI/user-exit, IDoc/API.', lessons: [s5, s5q] },
    { title: 'Giai đoạn 6 — Kiểm thử & di trú|||Stage 6 — Testing & migration', description: 'Unit/integration/UAT, ETL di trú dữ liệu.', lessons: [s6, s6q] },
    { title: 'Giai đoạn 7 — Go-live & hỗ trợ|||Stage 7 — Go-live', description: 'Đào tạo, cutover, go-live, hypercare.', lessons: [s7, s7q] },
    { title: 'Giai đoạn 8 — Đánh giá & bảo vệ|||Stage 8 — Evaluation & defense', description: 'Đánh giá, ROI, báo cáo cuối, bảo vệ hội đồng.', lessons: [s8, s8q] },
  ],
};
