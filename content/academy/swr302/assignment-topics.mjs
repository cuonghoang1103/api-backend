/**
 * SWR302 · Assignment topics — the project briefs the lecturer hands out in Week 2.
 * One lesson per topic. Each lesson carries the brief VERBATIM (English, as the
 * lecturer issues it) plus a Vietnamese translation, a problem→objective
 * decomposition, a suggested actor list and a suggested use-case backlog, so a
 * team can start Deliverable 1 the same day.
 *
 * To add TP3/TP4 in a later semester: copy the TP2 block, change the ID, and add
 * the new constant to the default export array. Nothing else needs to change.
 */
import { bi } from './_slides.mjs';

/* ─────────────────────────── TP1 ─────────────────────────── */
const TP1 = {
  title: 'A.2 — Topic TP1: Campus Academic & Registration Operations|||A.2 — Đề tài TP1: Vận hành Học vụ & Đăng ký môn học',
  slug: 'swr302-assignment-tp1',
  type: 'DOCUMENT',
  description: 'Đề TP1 nguyên văn + bản dịch, phân rã 5 nỗi đau thành business objective đo được, danh sách actor, backlog 14 use case gợi ý và ba use case phức tạp để làm mock-up.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.2 · Topic TP1</span>
<h2>TP1 — Modernization of Campus Academic &amp; Registration Operations</h2>
<p class="lead">This is the brief exactly as the lecturer issues it. Read it twice before you write a single line: <strong>every business objective you will later claim in the Vision &amp; Scope must be traceable to a sentence in this text.</strong> Inventing a problem the brief never mentions is the fastest way to lose marks for scope.</p>

<h3>The brief, verbatim</h3>
<div class="callout">
<p><strong>Background &amp; Business Context</strong></p>
<p>A regional university currently operates a legacy software infrastructure to handle its academic administration. Every semester, during the course registration window, thousands of students log in simultaneously, causing severe system slowdowns and frequent crashes.</p>
<p>Beyond the registration crisis, the university's academic office struggles with manual overhead. Staff members spend hundreds of hours manually verifying prerequisite course completions, handling capacity override requests, cross-checking tuition payment statuses before confirming enrollments, and manually identifying under-enrolled courses that need to be canceled. Students frequently express dissatisfaction over the lack of real-time visibility into their degree audit and financial status.</p>
<p><strong>Student Group Expectations (BA Role)</strong></p>
<p>Your team acts as an <strong>external Business Analysis consultancy</strong> brought in to analyze the university's operational problems and engineer a comprehensive requirements package for a new, modernized platform.</p>
<p>You must conduct requirements elicitation (via stakeholder simulation or AI-assisted inquiry) to discover the underlying business goals, define project constraints, identify all user classes, and model the end-to-end system requirements.</p>
</div>

<a class="link-card exphub" href="/courses/software-requirements/learn?lessonSlug=swr302-tp1-goi-01-vision-scope">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">A complete worked package for this exact topic</span><span class="lc-sub">Eight finished deliverables for CARS — Vision &amp; Scope, 14 use cases, 20 business rules, a 109-requirement SRS, 91 data dictionary entries, mock-ups, prioritization and estimation.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<h3>Decompose the brief: five pains, five objectives</h3>
<p>The brief hides five distinct problems. A weak team writes one vague objective ("make registration better"). A strong team writes five measurable ones, each anchored to a sentence above.</p>
<table>
  <thead><tr><th>#</th><th>Pain in the brief</th><th>Who feels it</th><th>Measurable business objective (invent a baseline, state it as an assumption)</th></tr></thead>
  <tbody>
    <tr><td>P1</td><td>Thousands log in simultaneously → slowdowns and crashes</td><td>Students, IT Operations</td><td>Support N concurrent registration sessions with p95 response ≤ 2 s and zero registration-window outages</td></tr>
    <tr><td>P2</td><td>Prerequisite completion verified by hand</td><td>Academic Office staff</td><td>Automate prerequisite checking for ≥ 98% of enrollment attempts; cut staff verification hours by ≥ 90%</td></tr>
    <tr><td>P3</td><td>Capacity override requests handled manually</td><td>Staff, Department Head, Students</td><td>Route 100% of override requests through a tracked workflow with a decision SLA of ≤ 48 hours</td></tr>
    <tr><td>P4</td><td>Tuition payment status cross-checked before confirming enrollment</td><td>Staff, Finance Office</td><td>Integrate the finance system so enrollment eligibility is evaluated automatically at registration time</td></tr>
    <tr><td>P5</td><td>Under-enrolled courses identified manually for cancellation</td><td>Department Head, Registrar</td><td>Flag under-enrolled sections automatically against a configurable threshold, before the add/drop deadline</td></tr>
    <tr><td>P6</td><td>No real-time visibility into degree audit and financial status</td><td>Students, Academic Advisors</td><td>Give every student an always-current degree audit and account balance; reduce advising enquiries by ≥ 50%</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>The brief gives you no numbers.</strong> That is deliberate — a real BA never receives them either. Invent a realistic baseline (e.g. "12,000 students, 1,400 sections, a 72-hour registration window") and record it in <em>Vision &amp; Scope §1.7 Assumptions</em>. What loses marks is an objective with <em>no</em> number, not an assumed one.</div>

<h3>Actors and external systems</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-badge">P</div><div><div class="lz-lt">Primary actors (people who start a use case)</div><div class="lz-ld">Student · Academic Advisor · Academic Office Staff (Registrar clerk) · Department Head · Registrar · Finance Officer · System Administrator</div></div></div>
  <div class="lz-layer"><div class="lz-badge">S</div><div><div class="lz-lt">Secondary actors (systems that participate)</div><div class="lz-ld">Student Information System of record · Finance / Bursar system · Identity provider (SSO) · Email / SMS notification service · Learning Management System · Timetable &amp; room allocation system</div></div></div>
</div>

<h3>Suggested use-case backlog — 14 candidates for a "≥ 10" requirement</h3>
<p>Write more than ten. Deliverable 7 asks you to <em>prioritize</em>, and prioritizing a list where everything is mandatory is meaningless.</p>
<table>
  <thead><tr><th>ID</th><th>Use case</th><th>Primary actor</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td>UC-01</td><td>Search and browse the course catalog</td><td>Student</td><td>Entry point; drives the load in P1</td></tr>
    <tr><td>UC-02</td><td>Build a planned schedule (shopping cart)</td><td>Student</td><td>Lets students prepare before the window opens — the main defence against P1</td></tr>
    <tr><td>UC-03</td><td><strong>Register for a course section</strong></td><td>Student</td><td>The core transaction: prerequisite + capacity + finance checks all fire here</td></tr>
    <tr><td>UC-04</td><td>Validate prerequisites and co-requisites</td><td>System / Staff</td><td>Automates P2</td></tr>
    <tr><td>UC-05</td><td>Evaluate enrollment eligibility against financial status</td><td>System / Finance Officer</td><td>Automates P4</td></tr>
    <tr><td>UC-06</td><td><strong>Request and decide a capacity override</strong></td><td>Student → Department Head</td><td>Automates P3; a genuine multi-actor workflow with a decision SLA</td></tr>
    <tr><td>UC-07</td><td>Join and be promoted from a waitlist</td><td>Student</td><td>The alternative to overrides; fine source of business rules</td></tr>
    <tr><td>UC-08</td><td>Drop or swap a section within the add/drop period</td><td>Student</td><td>Deadline and refund rules live here</td></tr>
    <tr><td>UC-09</td><td><strong>View the real-time degree audit</strong></td><td>Student, Advisor</td><td>Addresses P6; the most complex read model in the system</td></tr>
    <tr><td>UC-10</td><td>View account balance and payment history</td><td>Student</td><td>The other half of P6</td></tr>
    <tr><td>UC-11</td><td>Identify and cancel under-enrolled sections</td><td>Department Head</td><td>Automates P5</td></tr>
    <tr><td>UC-12</td><td>Open, extend or close a registration window</td><td>Registrar</td><td>Administrative control over the whole cycle</td></tr>
    <tr><td>UC-13</td><td>Advise a student and place or lift an advising hold</td><td>Academic Advisor</td><td>A hold is a classic action-enabler business rule</td></tr>
    <tr><td>UC-14</td><td>Produce enrollment and capacity reports</td><td>Registrar</td><td>Gives Deliverable 5 its report specifications</td></tr>
  </tbody>
</table>

<h3>The three "complex use cases" for your mock-ups (Deliverable 6)</h3>
<p>Deliverable 6 asks for at least three. Choose the three with the most decisions and the most states — not the three that are easiest to draw:</p>
<ol>
  <li><strong>UC-03 Register for a course section</strong> — must show the failure states (prerequisite missing, section full, financial hold) as well as the happy path.</li>
  <li><strong>UC-06 Request and decide a capacity override</strong> — two different screens for two different actors, plus the request's state machine.</li>
  <li><strong>UC-09 View the real-time degree audit</strong> — requirement groups, satisfied/unsatisfied/in-progress states, and "what if I take this course?" planning.</li>
</ol>

<div class="pitfall"><strong>Traps specific to TP1.</strong> (1) <em>Do not design the database</em> — the brief asks for a requirements package, not a schema; an ERD belongs in SRS §4.1 as a logical model, nothing more. (2) <em>The performance crisis (P1) is a quality attribute, not a feature</em> — it belongs in SRS §6.2 written in Planguage with a number, not in the use cases. (3) <em>"Legacy infrastructure" makes this an enhancement/replacement project</em> — book Ch.21 applies: you owe a gap analysis and a data-migration position. (4) <em>Do not forget the Finance Office</em> — it is named in the brief and it is an external system boundary, so it must appear in your context diagram.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.2 · Đề tài TP1</span>
<h2>TP1 — Hiện đại hoá Vận hành Học vụ &amp; Đăng ký môn học</h2>
<p class="lead">Đây là đề bài đúng như thầy phát ra. Hãy đọc hai lượt trước khi viết dòng đầu tiên: <strong>mọi business objective bạn nêu trong Vision &amp; Scope sau này đều phải truy ngược được về một câu trong đoạn văn này.</strong> Bịa ra một vấn đề mà đề không nhắc là cách mất điểm phạm vi nhanh nhất.</p>

<h3>Nguyên văn đề bài</h3>
<div class="callout">
<p><strong>Bối cảnh &amp; nghiệp vụ</strong></p>
<p>Một trường đại học vùng hiện đang vận hành hạ tầng phần mềm cũ để xử lý công tác học vụ. Mỗi học kỳ, trong khung giờ đăng ký môn, hàng nghìn sinh viên đăng nhập cùng lúc, khiến hệ thống chậm nghiêm trọng và sập thường xuyên.</p>
<p>Ngoài khủng hoảng đăng ký, phòng học vụ còn vật lộn với khối lượng thủ công. Nhân viên tốn hàng trăm giờ để kiểm tra thủ công việc hoàn thành môn tiên quyết, xử lý yêu cầu vượt sĩ số lớp, đối chiếu chéo tình trạng đóng học phí trước khi xác nhận ghi danh, và tự tay xác định những lớp không đủ sĩ số cần huỷ. Sinh viên thường xuyên bày tỏ bất mãn vì không thấy được tiến độ chương trình học (degree audit) và tình trạng tài chính của mình theo thời gian thực.</p>
<p><strong>Kỳ vọng với nhóm sinh viên (vai trò BA)</strong></p>
<p>Nhóm bạn đóng vai một <strong>công ty tư vấn Phân tích nghiệp vụ bên ngoài</strong> được mời vào để phân tích các vấn đề vận hành của trường và kiến tạo một bộ tài liệu yêu cầu toàn diện cho nền tảng mới, hiện đại.</p>
<p>Bạn phải tiến hành khai thác yêu cầu (bằng mô phỏng stakeholder hoặc phỏng vấn có AI hỗ trợ) để khám phá mục tiêu nghiệp vụ nền tảng, xác định ràng buộc dự án, nhận diện mọi lớp người dùng, và mô hình hoá yêu cầu hệ thống từ đầu đến cuối.</p>
</div>

<a class="link-card exphub" href="/courses/software-requirements/learn?lessonSlug=swr302-tp1-goi-01-vision-scope">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bộ tài liệu mẫu hoàn chỉnh cho ĐÚNG đề này</span><span class="lc-sub">Tám deliverable đã làm xong cho CARS — Vision &amp; Scope, 14 use case, 20 business rule, SRS 109 yêu cầu, data dictionary 91 mục, mock-up, xếp ưu tiên và ước lượng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<h3>Phân rã đề bài: năm nỗi đau, năm mục tiêu</h3>
<p>Đề bài giấu trong nó năm vấn đề tách biệt. Nhóm yếu viết một mục tiêu mơ hồ ("làm đăng ký môn tốt hơn"). Nhóm mạnh viết năm mục tiêu đo được, mỗi cái neo vào một câu ở trên.</p>
<table>
  <thead><tr><th>#</th><th>Nỗi đau trong đề</th><th>Ai chịu</th><th>Mục tiêu nghiệp vụ đo được (tự đặt baseline, ghi là giả định)</th></tr></thead>
  <tbody>
    <tr><td>P1</td><td>Hàng nghìn người đăng nhập cùng lúc → chậm và sập</td><td>Sinh viên, IT</td><td>Chịu được N phiên đăng ký đồng thời với p95 ≤ 2 giây và không sập lần nào trong khung đăng ký</td></tr>
    <tr><td>P2</td><td>Kiểm tra môn tiên quyết bằng tay</td><td>Nhân viên học vụ</td><td>Tự động kiểm tiên quyết cho ≥ 98% lượt ghi danh; giảm ≥ 90% giờ kiểm thủ công</td></tr>
    <tr><td>P3</td><td>Yêu cầu vượt sĩ số xử lý thủ công</td><td>Nhân viên, Trưởng bộ môn, Sinh viên</td><td>Đưa 100% yêu cầu vượt sĩ số vào quy trình có theo dõi, SLA ra quyết định ≤ 48 giờ</td></tr>
    <tr><td>P4</td><td>Đối chiếu học phí trước khi xác nhận ghi danh</td><td>Nhân viên, Phòng Tài chính</td><td>Tích hợp hệ thống tài chính để điều kiện ghi danh được đánh giá tự động ngay lúc đăng ký</td></tr>
    <tr><td>P5</td><td>Tự tay tìm lớp không đủ sĩ số để huỷ</td><td>Trưởng bộ môn, Phòng Đào tạo</td><td>Tự động gắn cờ lớp thiếu sĩ số theo ngưỡng cấu hình được, trước hạn thêm/bớt môn</td></tr>
    <tr><td>P6</td><td>Không thấy degree audit và tình trạng tài chính theo thời gian thực</td><td>Sinh viên, Cố vấn học tập</td><td>Mỗi sinh viên luôn thấy degree audit và số dư tài khoản cập nhật; giảm ≥ 50% lượt hỏi cố vấn</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Đề không cho bạn con số nào.</strong> Đó là cố ý — BA thật cũng chẳng bao giờ được cho sẵn. Hãy tự đặt một baseline hợp lý (ví dụ "12.000 sinh viên, 1.400 lớp, khung đăng ký 72 giờ") và ghi nó vào <em>Vision &amp; Scope §1.7 Giả định</em>. Cái mất điểm là mục tiêu <em>không có</em> con số, chứ không phải con số được giả định.</div>

<h3>Actor và hệ thống ngoài</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-badge">P</div><div><div class="lz-lt">Actor chính (người khởi động use case)</div><div class="lz-ld">Sinh viên · Cố vấn học tập · Nhân viên học vụ · Trưởng bộ môn · Phòng Đào tạo · Cán bộ Tài chính · Quản trị hệ thống</div></div></div>
  <div class="lz-layer"><div class="lz-badge">S</div><div><div class="lz-lt">Actor phụ (hệ thống tham gia)</div><div class="lz-ld">Hệ thống thông tin sinh viên gốc · Hệ thống Tài chính/Học phí · Nhà cung cấp định danh (SSO) · Dịch vụ email/SMS · Hệ thống LMS · Hệ thống xếp thời khoá biểu &amp; phòng học</div></div></div>
</div>

<h3>Backlog use case gợi ý — 14 ứng viên cho yêu cầu "≥ 10"</h3>
<p>Hãy viết nhiều hơn mười. Deliverable 7 bắt bạn <em>xếp ưu tiên</em>, mà xếp ưu tiên một danh sách toàn thứ bắt buộc thì vô nghĩa.</p>
<table>
  <thead><tr><th>ID</th><th>Use case</th><th>Actor chính</th><th>Vì sao quan trọng</th></tr></thead>
  <tbody>
    <tr><td>UC-01</td><td>Tra cứu và duyệt danh mục môn học</td><td>Sinh viên</td><td>Cửa vào; tạo ra phần lớn tải trong P1</td></tr>
    <tr><td>UC-02</td><td>Dựng thời khoá biểu dự kiến (giỏ hàng)</td><td>Sinh viên</td><td>Cho sinh viên chuẩn bị trước khi mở cổng — phòng tuyến chính chống P1</td></tr>
    <tr><td>UC-03</td><td><strong>Đăng ký một lớp học phần</strong></td><td>Sinh viên</td><td>Giao dịch lõi: tiên quyết + sĩ số + tài chính đều kích hoạt ở đây</td></tr>
    <tr><td>UC-04</td><td>Kiểm tra môn tiên quyết và song hành</td><td>Hệ thống / Nhân viên</td><td>Tự động hoá P2</td></tr>
    <tr><td>UC-05</td><td>Đánh giá điều kiện ghi danh theo tình trạng tài chính</td><td>Hệ thống / Cán bộ Tài chính</td><td>Tự động hoá P4</td></tr>
    <tr><td>UC-06</td><td><strong>Xin và duyệt vượt sĩ số</strong></td><td>Sinh viên → Trưởng bộ môn</td><td>Tự động hoá P3; quy trình nhiều actor thật sự, có SLA</td></tr>
    <tr><td>UC-07</td><td>Vào danh sách chờ và được đôn lên khi có chỗ</td><td>Sinh viên</td><td>Giải pháp thay cho vượt sĩ số; mỏ business rule rất tốt</td></tr>
    <tr><td>UC-08</td><td>Rút hoặc đổi lớp trong thời hạn thêm/bớt</td><td>Sinh viên</td><td>Luật về hạn chót và hoàn phí nằm ở đây</td></tr>
    <tr><td>UC-09</td><td><strong>Xem degree audit thời gian thực</strong></td><td>Sinh viên, Cố vấn</td><td>Giải quyết P6; mô hình đọc phức tạp nhất hệ thống</td></tr>
    <tr><td>UC-10</td><td>Xem số dư và lịch sử thanh toán</td><td>Sinh viên</td><td>Nửa còn lại của P6</td></tr>
    <tr><td>UC-11</td><td>Xác định và huỷ lớp không đủ sĩ số</td><td>Trưởng bộ môn</td><td>Tự động hoá P5</td></tr>
    <tr><td>UC-12</td><td>Mở, gia hạn hoặc đóng khung giờ đăng ký</td><td>Phòng Đào tạo</td><td>Quyền điều khiển toàn chu kỳ</td></tr>
    <tr><td>UC-13</td><td>Tư vấn sinh viên và đặt/gỡ khoá cố vấn</td><td>Cố vấn học tập</td><td>Khoá cố vấn là business rule loại action-enabler kinh điển</td></tr>
    <tr><td>UC-14</td><td>Xuất báo cáo ghi danh và sĩ số</td><td>Phòng Đào tạo</td><td>Cung cấp phần đặc tả report cho Deliverable 5</td></tr>
  </tbody>
</table>

<h3>Ba "complex use case" để làm mock-up (Deliverable 6)</h3>
<p>Deliverable 6 đòi ít nhất ba. Hãy chọn ba cái nhiều quyết định và nhiều trạng thái nhất — chứ không phải ba cái dễ vẽ nhất:</p>
<ol>
  <li><strong>UC-03 Đăng ký lớp học phần</strong> — phải thể hiện cả các trạng thái thất bại (thiếu tiên quyết, lớp đầy, khoá tài chính), không chỉ luồng thuận.</li>
  <li><strong>UC-06 Xin và duyệt vượt sĩ số</strong> — hai màn hình cho hai actor khác nhau, cộng máy trạng thái của yêu cầu.</li>
  <li><strong>UC-09 Xem degree audit thời gian thực</strong> — nhóm điều kiện tốt nghiệp, trạng thái đạt/chưa đạt/đang học, và "nếu tôi học môn này thì sao?".</li>
</ol>

<div class="pitfall"><strong>Bẫy riêng của TP1.</strong> (1) <em>Đừng thiết kế cơ sở dữ liệu</em> — đề đòi bộ tài liệu yêu cầu, không đòi schema; ERD chỉ nằm ở SRS §4.1 dưới dạng mô hình logic, không hơn. (2) <em>Khủng hoảng hiệu năng (P1) là thuộc tính chất lượng, không phải tính năng</em> — nó thuộc SRS §6.2, viết bằng Planguage kèm con số, không nằm trong use case. (3) <em>"Hạ tầng cũ" khiến đây là dự án enhancement/replacement</em> — chương 21 sách áp dụng: bạn nợ một bản gap analysis và một lập trường về di trú dữ liệu. (4) <em>Đừng quên Phòng Tài chính</em> — đề có nhắc và nó là ranh giới hệ thống bên ngoài, nên bắt buộc xuất hiện trong context diagram.</div>
`,
    ),
  ].join('\n'),
};

/* ─────────────────────────── TP2 ─────────────────────────── */
const TP2 = {
  title: 'A.3 — Topic TP2: E-Commerce Order Management & Fulfillment|||A.3 — Đề tài TP2: Quản lý Đơn hàng & Hoàn tất đơn TMĐT',
  slug: 'swr302-assignment-tp2',
  type: 'DOCUMENT',
  description: 'Đề TP2 nguyên văn + bản dịch, phân rã 4 nỗi đau thành business objective đo được, danh sách actor, backlog 14 use case gợi ý và ba use case phức tạp để làm mock-up.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.3 · Topic TP2</span>
<h2>TP2 — Centralized E-Commerce Order Management &amp; Fulfillment Operations</h2>
<p class="lead">TP2 is an <strong>internal</strong> BA assignment, not a consultancy one — you are staff, you already know the company, and you are expected to know its numbers. That difference should show up in your Vision &amp; Scope: TP2 teams can quote baselines with more confidence than TP1 teams.</p>

<h3>The brief, verbatim</h3>
<div class="callout">
<p><strong>Background &amp; Business Context</strong></p>
<p>A rapidly growing multi-brand retail company has recently expanded its online sales channels. While their web storefront effectively handles customer browsing, the back-office operations behind order fulfillment are highly fragmented and uncoordinated.</p>
<p>Currently, warehouse inventory is not synchronized in real time with the online store, frequently leading to overselling items that are out of stock. When orders are placed, warehouse staff manually print, sort, and allocate order slips to individual fulfillment centers without automated routing logic. Furthermore, integrations with third-party logistics (3PL) carriers are handled through manual tracking uploads, resulting in delayed shipping updates and an overwhelming volume of "Where is my order?" inquiries to customer support.</p>
<p><strong>Student Group Expectations (BA Role)</strong></p>
<p>Your team acts as an <strong>internal Business Analysis team</strong> assigned to solve these back-office operational bottlenecks.</p>
<p>You are required to perform elicitation to analyze the current fulfillment lifecycle, determine what business objectives the company should target, map out the system boundaries, and specify the full requirement set for a centralized Order Management &amp; Fulfillment System.</p>
</div>

<a class="link-card exphub" href="/courses/software-requirements/learn?lessonSlug=swr302-tp2-goi-01-vision-scope">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">A complete worked package for this exact topic</span><span class="lc-sub">Eight finished deliverables for OMFS — Vision &amp; Scope, 14 use cases, 20 business rules, a 101-requirement SRS, 110 data dictionary entries, mock-ups, prioritization and estimation.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<h3>Decompose the brief: four pains, six objectives</h3>
<table>
  <thead><tr><th>#</th><th>Pain in the brief</th><th>Who feels it</th><th>Measurable business objective</th></tr></thead>
  <tbody>
    <tr><td>P1</td><td>Inventory not synchronized in real time → overselling</td><td>Customer, Inventory Controller, Brand Manager</td><td>Cut the oversell rate from its baseline to ≤ 0.5% of orders</td></tr>
    <tr><td>P2</td><td>Staff print, sort and allocate slips by hand, no routing logic</td><td>Warehouse Operator, Fulfillment Manager</td><td>Route ≥ 95% of orders automatically; cut order-to-ship time from ~26 h to ≤ 8 h</td></tr>
    <tr><td>P3</td><td>3PL integration via manual tracking uploads → delayed updates</td><td>Logistics Manager, Customer</td><td>Ingest carrier events automatically within ≤ 15 min (p95); rate-shop carriers to cut cost/order ≥ 12%</td></tr>
    <tr><td>P4</td><td>Overwhelming volume of WISMO enquiries</td><td>Customer Service Agent</td><td>Reduce WISMO ticket volume by ≥ 60% through accurate self-service tracking</td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Notice what P2 really contains.</strong> "Without automated routing logic" is one clause, but it implies three separate capabilities: choosing <em>which</em> fulfillment center, <em>splitting</em> an order when no single centre can fill it, and <em>overriding</em> the machine's choice. Teams that read it as one feature end up with a thin use case and an easy question they cannot answer at the Week-5 check-in.</div>

<h3>Actors and external systems</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-badge">P</div><div><div class="lz-lt">Primary actors</div><div class="lz-ld">Warehouse Operator · Fulfillment Manager · Inventory Controller · Customer Service Agent · Logistics Manager · Brand Manager · System Administrator · Customer (self-service tracking only)</div></div></div>
  <div class="lz-layer"><div class="lz-badge">S</div><div><div class="lz-lt">Secondary actors (systems)</div><div class="lz-ld">Web storefront · Marketplace channels · 3PL carrier APIs · Payment gateway · ERP / accounting system · Notification service (email &amp; SMS)</div></div></div>
</div>
<div class="callout warn"><strong>The storefront is OUTSIDE your boundary.</strong> The brief says it "effectively handles customer browsing" — that is the lecturer telling you not to specify it. Putting catalog, pricing, promotions or checkout inside your scope is the single most common TP2 scope error.</div>

<h3>Suggested use-case backlog — 14 candidates</h3>
<table>
  <thead><tr><th>ID</th><th>Use case</th><th>Primary actor</th><th>Addresses</th></tr></thead>
  <tbody>
    <tr><td>UC-01</td><td>Ingest an order from a sales channel</td><td>Sales channel (system)</td><td>P2</td></tr>
    <tr><td>UC-02</td><td>Screen and validate an order</td><td>System / CS Agent</td><td>P1</td></tr>
    <tr><td>UC-03</td><td>Reserve inventory (available-to-promise)</td><td>System</td><td>P1</td></tr>
    <tr><td>UC-04</td><td><strong>Route and split an order across fulfillment centers</strong></td><td>System / Fulfillment Manager</td><td>P2</td></tr>
    <tr><td>UC-05</td><td>Generate and release a pick wave</td><td>Fulfillment Manager</td><td>P2</td></tr>
    <tr><td>UC-06</td><td>Pick and pack with scan verification</td><td>Warehouse Operator</td><td>P2</td></tr>
    <tr><td>UC-07</td><td><strong>Rate-shop carriers and purchase a shipping label</strong></td><td>System</td><td>P3</td></tr>
    <tr><td>UC-08</td><td>Ingest a carrier tracking event</td><td>3PL carrier (system)</td><td>P3</td></tr>
    <tr><td>UC-09</td><td>Notify the customer / self-service order tracking</td><td>Customer</td><td>P4</td></tr>
    <tr><td>UC-10</td><td><strong>Handle a fulfillment exception (backorder, split, short-ship)</strong></td><td>Fulfillment Manager</td><td>P1, P2</td></tr>
    <tr><td>UC-11</td><td>Cancel or modify an order before dispatch</td><td>CS Agent</td><td>P1</td></tr>
    <tr><td>UC-12</td><td>Process a return and restock (RMA)</td><td>CS Agent, Warehouse Operator</td><td>—</td></tr>
    <tr><td>UC-13</td><td>Synchronize stock levels to all sales channels</td><td>System</td><td>P1</td></tr>
    <tr><td>UC-14</td><td>View the fulfillment performance dashboard</td><td>Fulfillment Manager</td><td>All</td></tr>
  </tbody>
</table>

<h3>The three "complex use cases" for your mock-ups (Deliverable 6)</h3>
<ol>
  <li><strong>UC-04 Route and split an order</strong> — a routing workbench showing the score per fulfillment center, why the winner won, and the manual override.</li>
  <li><strong>UC-07 Rate-shop and buy a label</strong> — the carrier comparison table with cost, service level and cut-off time, plus the rule that chose one.</li>
  <li><strong>UC-10 Handle a fulfillment exception</strong> — a queue of exceptions with the resolution options for each type.</li>
</ol>
<p>A fourth, <strong>UC-09 self-service tracking</strong>, is worth drawing too: it is the only customer-facing screen in the system and it is what actually delivers the P4 objective.</p>

<div class="pitfall"><strong>Traps specific to TP2.</strong> (1) <em>OMS is not a WMS</em> — bin locations, putaway and cycle counting belong to a warehouse management system; say so in "Limitations and Exclusions" or a grader will assume you did not know the difference. (2) <em>"Real time" is not a requirement</em> — write the latency as a number in a quality attribute. (3) <em>Overselling is a race condition, not a sync delay</em> — the fix is stock <strong>reservation</strong> at order acceptance (UC-03); a team that only pushes stock levels faster has not solved P1, and this is the favourite check-in question. (4) <em>Money is a boundary</em> — the system reads payment authorization status, it does not process payments.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.3 · Đề tài TP2</span>
<h2>TP2 — Quản lý Đơn hàng &amp; Hoàn tất đơn TMĐT tập trung</h2>
<p class="lead">TP2 là bài BA <strong>nội bộ</strong>, không phải tư vấn — bạn là nhân viên, bạn đã biết công ty, và bạn được kỳ vọng nắm số liệu của nó. Khác biệt đó phải thể hiện trong Vision &amp; Scope: nhóm làm TP2 có thể nêu baseline tự tin hơn nhóm làm TP1.</p>

<h3>Nguyên văn đề bài</h3>
<div class="callout">
<p><strong>Bối cảnh &amp; nghiệp vụ</strong></p>
<p>Một công ty bán lẻ đa thương hiệu đang tăng trưởng nhanh vừa mở rộng các kênh bán hàng trực tuyến. Trong khi web storefront xử lý tốt việc khách duyệt hàng, thì các nghiệp vụ hậu cần phía sau việc hoàn tất đơn lại rất phân mảnh và thiếu phối hợp.</p>
<p>Hiện tại, tồn kho trong kho không được đồng bộ theo thời gian thực với cửa hàng trực tuyến, thường xuyên dẫn tới bán vượt hàng đã hết. Khi có đơn, nhân viên kho tự tay in, phân loại và chia phiếu đơn cho từng trung tâm hoàn tất mà không có logic định tuyến tự động. Hơn nữa, tích hợp với các hãng vận chuyển bên thứ ba (3PL) được xử lý bằng cách tải file theo dõi lên thủ công, dẫn tới cập nhật vận chuyển bị trễ và một lượng câu hỏi "Đơn của tôi đang ở đâu?" khổng lồ đổ về bộ phận chăm sóc khách hàng.</p>
<p><strong>Kỳ vọng với nhóm sinh viên (vai trò BA)</strong></p>
<p>Nhóm bạn đóng vai <strong>đội Phân tích nghiệp vụ nội bộ</strong> được giao giải quyết các nút thắt vận hành hậu cần này.</p>
<p>Bạn phải thực hiện khai thác yêu cầu để phân tích vòng đời hoàn tất đơn hiện tại, xác định công ty nên nhắm tới mục tiêu nghiệp vụ nào, vạch ra ranh giới hệ thống, và đặc tả trọn bộ yêu cầu cho một Hệ thống Quản lý Đơn hàng &amp; Hoàn tất đơn tập trung.</p>
</div>

<a class="link-card exphub" href="/courses/software-requirements/learn?lessonSlug=swr302-tp2-goi-01-vision-scope">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Bộ tài liệu mẫu hoàn chỉnh cho ĐÚNG đề này</span><span class="lc-sub">Tám deliverable đã làm xong cho OMFS — Vision &amp; Scope, 14 use case, 20 business rule, SRS 101 yêu cầu, data dictionary 110 mục, mock-up, xếp ưu tiên và ước lượng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<h3>Phân rã đề bài: bốn nỗi đau, sáu mục tiêu</h3>
<table>
  <thead><tr><th>#</th><th>Nỗi đau trong đề</th><th>Ai chịu</th><th>Mục tiêu nghiệp vụ đo được</th></tr></thead>
  <tbody>
    <tr><td>P1</td><td>Tồn kho không đồng bộ thời gian thực → bán vượt</td><td>Khách, Kiểm soát tồn kho, Quản lý thương hiệu</td><td>Giảm tỉ lệ bán vượt từ baseline xuống ≤ 0,5% số đơn</td></tr>
    <tr><td>P2</td><td>In, phân loại, chia phiếu bằng tay, không có logic định tuyến</td><td>Nhân viên kho, Quản lý hoàn tất đơn</td><td>Định tuyến tự động ≥ 95% đơn; giảm thời gian từ đặt đến xuất kho từ ~26 h xuống ≤ 8 h</td></tr>
    <tr><td>P3</td><td>Tích hợp 3PL bằng tải file thủ công → cập nhật trễ</td><td>Quản lý vận chuyển, Khách</td><td>Nhận sự kiện của hãng vận chuyển tự động trong ≤ 15 phút (p95); so giá hãng để giảm ≥ 12% chi phí/đơn</td></tr>
    <tr><td>P4</td><td>Lượng câu hỏi WISMO khổng lồ</td><td>Nhân viên CSKH</td><td>Giảm ≥ 60% ticket WISMO nhờ tra cứu tự phục vụ chính xác</td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Để ý P2 thực sự chứa những gì.</strong> "Không có logic định tuyến tự động" chỉ là một mệnh đề, nhưng nó hàm ý ba năng lực tách biệt: chọn <em>trung tâm nào</em>, <em>tách đơn</em> khi không kho nào đủ hàng, và <em>ghi đè</em> lựa chọn của máy. Nhóm đọc nó thành một tính năng sẽ có một use case mỏng và một câu hỏi dễ mà không trả lời được ở buổi kiểm tra tuần 5.</div>

<h3>Actor và hệ thống ngoài</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-badge">P</div><div><div class="lz-lt">Actor chính</div><div class="lz-ld">Nhân viên kho · Quản lý hoàn tất đơn · Kiểm soát tồn kho · Nhân viên CSKH · Quản lý vận chuyển · Quản lý thương hiệu · Quản trị hệ thống · Khách hàng (chỉ tra cứu tự phục vụ)</div></div></div>
  <div class="lz-layer"><div class="lz-badge">S</div><div><div class="lz-lt">Actor phụ (hệ thống)</div><div class="lz-ld">Web storefront · Các sàn TMĐT · API hãng vận chuyển 3PL · Cổng thanh toán · Hệ thống ERP/kế toán · Dịch vụ thông báo (email &amp; SMS)</div></div></div>
</div>
<div class="callout warn"><strong>Storefront nằm NGOÀI ranh giới của bạn.</strong> Đề nói nó "xử lý tốt việc khách duyệt hàng" — đó là thầy đang bảo bạn đừng đặc tả nó. Đưa danh mục, giá, khuyến mãi hay thanh toán vào phạm vi là lỗi phạm vi phổ biến nhất của TP2.</div>

<h3>Backlog use case gợi ý — 14 ứng viên</h3>
<table>
  <thead><tr><th>ID</th><th>Use case</th><th>Actor chính</th><th>Giải quyết</th></tr></thead>
  <tbody>
    <tr><td>UC-01</td><td>Tiếp nhận đơn từ một kênh bán</td><td>Kênh bán (hệ thống)</td><td>P2</td></tr>
    <tr><td>UC-02</td><td>Sàng lọc và kiểm tra hợp lệ đơn hàng</td><td>Hệ thống / CSKH</td><td>P1</td></tr>
    <tr><td>UC-03</td><td>Giữ chỗ tồn kho (available-to-promise)</td><td>Hệ thống</td><td>P1</td></tr>
    <tr><td>UC-04</td><td><strong>Định tuyến và tách đơn cho các trung tâm hoàn tất</strong></td><td>Hệ thống / Quản lý hoàn tất đơn</td><td>P2</td></tr>
    <tr><td>UC-05</td><td>Sinh và phát hành đợt lấy hàng (pick wave)</td><td>Quản lý hoàn tất đơn</td><td>P2</td></tr>
    <tr><td>UC-06</td><td>Lấy hàng và đóng gói có quét xác nhận</td><td>Nhân viên kho</td><td>P2</td></tr>
    <tr><td>UC-07</td><td><strong>So giá hãng vận chuyển và mua tem vận đơn</strong></td><td>Hệ thống</td><td>P3</td></tr>
    <tr><td>UC-08</td><td>Tiếp nhận sự kiện theo dõi từ hãng vận chuyển</td><td>Hãng 3PL (hệ thống)</td><td>P3</td></tr>
    <tr><td>UC-09</td><td>Thông báo cho khách / tra cứu đơn tự phục vụ</td><td>Khách hàng</td><td>P4</td></tr>
    <tr><td>UC-10</td><td><strong>Xử lý ngoại lệ hoàn tất đơn (thiếu hàng, tách, giao thiếu)</strong></td><td>Quản lý hoàn tất đơn</td><td>P1, P2</td></tr>
    <tr><td>UC-11</td><td>Huỷ hoặc sửa đơn trước khi xuất kho</td><td>CSKH</td><td>P1</td></tr>
    <tr><td>UC-12</td><td>Xử lý trả hàng và nhập lại kho (RMA)</td><td>CSKH, Nhân viên kho</td><td>—</td></tr>
    <tr><td>UC-13</td><td>Đồng bộ tồn kho về mọi kênh bán</td><td>Hệ thống</td><td>P1</td></tr>
    <tr><td>UC-14</td><td>Xem bảng điều khiển hiệu suất hoàn tất đơn</td><td>Quản lý hoàn tất đơn</td><td>Tất cả</td></tr>
  </tbody>
</table>

<h3>Ba "complex use case" để làm mock-up (Deliverable 6)</h3>
<ol>
  <li><strong>UC-04 Định tuyến và tách đơn</strong> — bàn làm việc định tuyến hiện điểm số từng trung tâm, lý do cái thắng thắng, và nút ghi đè thủ công.</li>
  <li><strong>UC-07 So giá và mua tem</strong> — bảng so sánh hãng vận chuyển theo giá, mức dịch vụ, giờ cắt đơn, kèm luật đã chọn ra một hãng.</li>
  <li><strong>UC-10 Xử lý ngoại lệ</strong> — hàng đợi ngoại lệ với các phương án xử lý cho từng loại.</li>
</ol>
<p>Cái thứ tư, <strong>UC-09 tra cứu tự phục vụ</strong>, cũng đáng vẽ: đó là màn hình duy nhất hướng tới khách hàng và chính nó mới thực sự tạo ra kết quả P4.</p>

<div class="pitfall"><strong>Bẫy riêng của TP2.</strong> (1) <em>OMS không phải WMS</em> — vị trí kệ, xếp hàng vào kho, kiểm kê chu kỳ thuộc về hệ thống quản lý kho; hãy ghi điều đó vào "Limitations and Exclusions", nếu không người chấm sẽ cho rằng bạn không phân biệt được. (2) <em>"Thời gian thực" không phải một yêu cầu</em> — hãy viết độ trễ thành con số trong thuộc tính chất lượng. (3) <em>Bán vượt là tranh chấp đồng thời, không phải trễ đồng bộ</em> — cách chữa là <strong>giữ chỗ</strong> tồn kho ngay khi nhận đơn (UC-03); nhóm chỉ đẩy số tồn nhanh hơn thì chưa giải quyết P1, và đây là câu hỏi kiểm tra ưa thích nhất. (4) <em>Tiền là một ranh giới</em> — hệ thống đọc trạng thái uỷ quyền thanh toán, nó không xử lý thanh toán.</div>
`,
    ),
  ].join('\n'),
};

export default [TP1, TP2];
