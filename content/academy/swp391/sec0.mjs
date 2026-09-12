// content/academy/swp391/sec0.mjs
/**
 * SWP391 · Section 0 — Introduction & Study Guide.
 * Sources: Slide1_Subject Guides.pptx (deck 'g-subject', 15 pages) and
 * SWP391 Student Guides.pptx (deck 'g-student', 19 pages), the Project Tracking
 * template (sheets Use Cases / Product / MasterData / Refs / Policies) and the
 * 2026 template set. Lesson split:
 *   0.1 swp391-gioi-thieu                g-subject 1–3   (overview, inputs & size)
 *   0.2 swp391-dieu-kien-qua-mon         g-subject 4–7   (milestones, pass rules, LOC grading)
 *   0.3 swp391-0-3-tracking-monitoring   g-subject 8–15  (GitLab milestones, labels, issues, tags)
 *   0.4 swp391-0-4-student-guides        g-student 1–19  (the second deck, every difference)
 *   0.5 swp391-chuan-dau-ra              outcomes + per-iteration deliverables (Project Tracking file)
 *   0.6 swp391-tai-lieu-cong-cu          materials, tools, templates, UI themes
 *   0.7 swp391-0-5-ngan-hang-de-tai      topic bank + "is it big enough?" sizing
 *   0.8 swp391-0-6-chong-truot-diem-cao  why teams lose marks (teacher's Policies sheet)
 * Every grade number in the worked example was computed by a script and is quoted as printed.
 * PRIVACY: no student names, IDs, e-mails or usernames (the template and G5 files contain real ones).
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const S = 'g-subject';
const T = 'g-student';

/* ───────────────────────── 0.1 About SWP391 ───────────────────────── */
const L01 = {
  title: '0.1 — About SWP391: one web system, three iterations|||0.1 — Giới thiệu SWP391: một hệ thống web, ba iteration',
  slug: 'swp391-gioi-thieu',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Subject Guides slide 1–3: môn học thật sự vận hành thế nào — nhóm 4–5 người làm MỘT hệ thống web qua 3 iteration, mỗi iteration mỗi người tự làm yêu cầu + thiết kế + code full-stack cho 3–4 màn hình của mình.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.1 · Subject Guides slides 1–3</span>
<h2>About SWP391 — one web system, built in three iterations</h2>
<p class="lead">SWP391 is a <strong>project course</strong>, not a lecture course. A team of 4–5 builds <strong>one web system</strong> (the teacher recommends a <em>management system</em>) and delivers it in <strong>three iterations</strong>. In every iteration each member takes his or her own 3–4 screens from requirement to working full-stack code.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Say what the course expects: team size, product type, process scope, tools and stack (slide 2).</li>
<li>Explain where requirements come from and how big the product must be (slide 3).</li>
<li>Describe one iteration from the point of view of a single member.</li>
<li>Spot the wrong "phase" model that many students (and the old version of this course) assume.</li>
</ul></div>
<h3>The course in one screen</h3>
<table>
<thead><tr><th>Milestone</th><th>Length</th><th>Weight</th><th>What each member delivers</th></tr></thead>
<tbody>
<tr><td>Iteration 1</td><td>6 slots × 135' (9 × 90')</td><td>15%</td><td>requirement + design + full-stack code for his/her first 3–4 screens</td></tr>
<tr><td>Iteration 2</td><td>6 slots × 135' (9 × 90')</td><td>20%</td><td>the next 3–4 screens, same full cycle, plus fixes to iteration 1</td></tr>
<tr><td>Iteration 3</td><td>6 slots × 135' (9 × 90')</td><td>25%</td><td>the last 3–4 screens + the <strong>final package</strong>; all completed screens are graded</td></tr>
<tr><td>Final Presentation</td><td>2 slots × 135' (3 × 90')</td><td>40%</td><td>the team defends the product before 2 other teachers</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Correction — there are no "requirement / code / deploy" phases.</strong> The earlier version of this course said "Milestone 1 = requirements, Milestone 2 = implementation, Milestone 3 = deployment" and gave week numbers. The teacher's guides say otherwise: all three iterations have the <em>same</em> shape, and each one is graded on <strong>working screens</strong> (Converted-LOC). A team that spends iteration 1 only writing documents scores almost 0 LOC for 15% of the subject.</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.1 · Subject Guides slide 1–3</span>
<h2>Giới thiệu SWP391 — một hệ thống web, làm trong ba iteration</h2>
<p class="lead">SWP391 là <strong>môn đồ án</strong>, không phải môn lý thuyết. Nhóm 4–5 người xây <strong>một hệ thống web</strong> (thầy/cô khuyên chọn <em>hệ thống quản lý</em>) và bàn giao trong <strong>ba iteration</strong>. Ở mỗi iteration, từng thành viên tự đưa 3–4 màn hình của mình đi từ yêu cầu tới code full-stack chạy được.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Nói được môn học đòi hỏi gì: cỡ nhóm, loại sản phẩm, phạm vi quy trình, công cụ và stack (slide 2).</li>
<li>Giải thích yêu cầu đến từ đâu và sản phẩm phải lớn cỡ nào (slide 3).</li>
<li>Mô tả một iteration dưới góc nhìn của một thành viên.</li>
<li>Nhận ra mô hình "chia pha" sai mà nhiều bạn (và bản cũ của khoá học này) vẫn tưởng.</li>
</ul></div>
<h3>Cả môn học trong một màn hình</h3>
<table>
<thead><tr><th>Milestone</th><th>Thời lượng</th><th>Trọng số</th><th>Mỗi thành viên bàn giao</th></tr></thead>
<tbody>
<tr><td>Iteration 1</td><td>6 slot × 135' (9 × 90')</td><td>15%</td><td>yêu cầu + thiết kế + code full-stack cho 3–4 màn hình đầu tiên của mình</td></tr>
<tr><td>Iteration 2</td><td>6 slot × 135' (9 × 90')</td><td>20%</td><td>3–4 màn hình tiếp theo, đủ cả chu trình, kèm sửa lỗi của iteration 1</td></tr>
<tr><td>Iteration 3</td><td>6 slot × 135' (9 × 90')</td><td>25%</td><td>3–4 màn hình cuối + <strong>gói nộp cuối (final package)</strong>; chấm mọi màn hình đã xong</td></tr>
<tr><td>Final Presentation</td><td>2 slot × 135' (3 × 90')</td><td>40%</td><td>cả nhóm bảo vệ sản phẩm trước 2 giảng viên khác</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Đính chính — không có các pha "yêu cầu / code / deploy".</strong> Bản cũ của khoá này ghi "Milestone 1 = yêu cầu, Milestone 2 = hiện thực, Milestone 3 = triển khai" và tự đặt số tuần. Tài liệu của thầy/cô nói khác: cả ba iteration có <em>cùng một hình dạng</em>, và mỗi iteration được chấm bằng <strong>màn hình chạy được</strong> (Converted-LOC). Nhóm nào dành iteration 1 chỉ để viết tài liệu thì gần như 0 LOC cho 15% của môn.</div>`),
    walkHead(S, 1, 3, 'Pages 4–7 continue in lesson 0.2, pages 8–15 in lesson 0.3.', 'Trang 4–7 học tiếp ở bài 0.2, trang 8–15 ở bài 0.3.'),
    walk(S, [
      [1, 'Software Development Project (SWP391) — Subject Introduction & Guides',
        `<p class="y-chinh">🎯 This deck is the teacher's rulebook for the whole semester — read it before your team writes anything.</p>
<p class="nhan">What the deck contains (15 pages)</p>
<ol>
<li><strong>Subject overview</strong> — goal, team, scope, tools (page 2)</li>
<li><strong>Inputs &amp; requirements</strong> — where requirements come from, product size (page 3)</li>
<li><strong>Milestones &amp; evaluations</strong> — iterations, pass rules, tasks, submit items, grading (pages 4–7)</li>
<li><strong>Tracking &amp; monitoring</strong> — GitLab milestones, labels, issues, tags (pages 8–14)</li>
</ol>
<p class="ghi-chu">A second, almost identical deck — <em>SWP391 Student Guides</em> (19 pages) — is taught in lesson 0.4 together with every difference between the two.</p>`,
        `<p class="y-chinh">🎯 Bộ slide này là "luật chơi" của thầy/cô cho cả học kỳ — đọc trước khi nhóm viết bất cứ thứ gì.</p>
<p class="nhan">Bộ slide gồm gì (15 trang)</p>
<ol>
<li><strong>Tổng quan môn học</strong> — mục tiêu, nhóm, phạm vi, công cụ (trang 2)</li>
<li><strong>Đầu vào &amp; yêu cầu</strong> — yêu cầu lấy từ đâu, sản phẩm lớn cỡ nào (trang 3)</li>
<li><strong>Milestone &amp; đánh giá</strong> — iteration, điều kiện qua môn, nhiệm vụ, bộ nộp, cách chấm (trang 4–7)</li>
<li><strong>Theo dõi &amp; giám sát</strong> — milestone, label, issue, tag trên GitLab (trang 8–14)</li>
</ol>
<p class="ghi-chu">Một bộ thứ hai gần giống hệt — <em>SWP391 Student Guides</em> (19 trang) — được học ở bài 0.4, kèm mọi điểm khác nhau giữa hai bộ.</p>`],
      [2, 'Subject Overview — target, team, scope, tools & technologies',
        `<p class="y-chinh">🎯 One team, one web system, the full cycle from requirement to integrated code — with a fixed toolset.</p>
<p class="nhan">The project</p>
<ul>
<li><strong>Target</strong> — teams complete a specific web system; a <em>management system</em> is recommended (users, roles, lists, forms, workflows).</li>
<li><strong>Team</strong> — 4–5 students, assigned or arranged by the teacher.</li>
<li><strong>Topic &amp; scope</strong> — provided by, or agreed with, the teacher.</li>
<li><strong>Process scope</strong> — requirement analysing, designing, coding and integrating. Testing and deployment are not separate graded phases.</li>
</ul>
<p class="nhan">Tools (log in with your university Google account)</p>
<ul>
<li><strong>GitLab or GitHub</strong> — source code versions <em>and</em> task/issue management.</li>
<li><strong>Google Drive or OneDrive</strong> — project documents and references.</li>
<li><strong>Slack</strong> — student/teacher talk, kept in threads.</li>
<li><strong>MailTrap</strong> (mailtrap.io) — a fake SMTP inbox for "forgot password", "verify e-mail", notifications.</li>
</ul>
<p class="nhan">Stack</p>
<ul>
<li><strong>Java</strong> — JDK 1.6 or higher, NetBeans 13, MySQL Server 8.0.23+ with MySQL Workbench.</li>
<li><strong>.NET (not recommended)</strong> — Visual Studio 2015+, IIS, SQL Server 2014+ (Express).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the framework and DBMS are "as assigned/agreed by the teacher" — ask before you pick Spring Boot, React or PostgreSQL.</p>`,
        `<p class="y-chinh">🎯 Một nhóm, một hệ thống web, đi trọn chu trình từ yêu cầu tới code đã tích hợp — với bộ công cụ cố định.</p>
<p class="nhan">Đồ án</p>
<ul>
<li><strong>Mục tiêu</strong> — nhóm hoàn thành một hệ thống web cụ thể; khuyên chọn <em>hệ thống quản lý</em> (người dùng, vai trò, danh sách, form, luồng nghiệp vụ).</li>
<li><strong>Nhóm</strong> — 4–5 sinh viên, do thầy/cô xếp hoặc cho tự ghép.</li>
<li><strong>Đề tài &amp; phạm vi</strong> — thầy/cô giao, hoặc nhóm đề xuất và được đồng ý.</li>
<li><strong>Phạm vi quy trình</strong> — phân tích yêu cầu, thiết kế, code và tích hợp. Kiểm thử và triển khai không phải các pha chấm điểm riêng.</li>
</ul>
<p class="nhan">Công cụ (đăng nhập bằng Google, email trường)</p>
<ul>
<li><strong>GitLab hoặc GitHub</strong> — quản lý phiên bản code <em>và</em> quản lý task/issue.</li>
<li><strong>Google Drive hoặc OneDrive</strong> — tài liệu dự án và tài liệu tham khảo.</li>
<li><strong>Slack</strong> — trao đổi sinh viên/giảng viên, giữ theo thread.</li>
<li><strong>MailTrap</strong> (mailtrap.io) — hộp thư SMTP giả để làm "quên mật khẩu", "xác minh email", thông báo.</li>
</ul>
<p class="nhan">Stack</p>
<ul>
<li><strong>Java</strong> — JDK 1.6 trở lên, NetBeans 13, MySQL Server 8.0.23+ và MySQL Workbench.</li>
<li><strong>.NET (không khuyến khích)</strong> — Visual Studio 2015+, IIS, SQL Server 2014+ (Express).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> framework và DBMS là "do thầy/cô giao/đồng ý" — hỏi trước khi chọn Spring Boot, React hay PostgreSQL.</p>`],
      [3, 'Inputs & Requirements — templates, requirement source, acceptable product size',
        `<p class="y-chinh">🎯 The product must be big enough that every member has about 3 screens/functions to build in <em>each</em> iteration — including iteration 3.</p>
<p class="nhan">Four inputs</p>
<ul>
<li><strong>Templates &amp; guides</strong> — always the latest ones on EduNext ("SWP391 General Information").</li>
<li><strong>Requirement documents</strong> — prepared by the teacher, or proposed by the team and then agreed/adjusted by the teacher.</li>
<li><strong>Acceptable size</strong> — enough functions/screens for <em>3 different screens per member per iteration on average</em>.</li>
<li><strong>Input requirement</strong> — agreed or assigned by the teacher before iteration 1.</li>
</ul>
<p class="nhan">What the size rule means in numbers</p>
<ol>
<li>5 members × 3 screens × 3 iterations = <strong>45 screens</strong> at least.</li>
<li>With the Student Guides' 3–4 screens: 5 × 4 × 3 = <strong>60 screens</strong> at the top end.</li>
<li>A 4-member team: 36–48 screens.</li>
</ol>
<p><strong>Example (Job IT for Freelancer, the G5 sample):</strong> 4 roles (Guest, Freelancer, Recruiter, Admin) and about 50 use cases — login, post a job, apply, review applicants, manage categories, dashboards, blogs… — which is the right order of size.</p>
<div class="pitfall co-tieu-de"><strong>Too small is the most common rejection.</strong> A "simple shop" with 15 screens leaves nothing to build in iteration 3, and an empty iteration 3 means a low LOC grade for 25% of the subject. Lesson 0.7 shows how to size a topic.</div>`,
        `<p class="y-chinh">🎯 Sản phẩm phải đủ lớn để mỗi thành viên có khoảng 3 màn hình/chức năng để làm ở <em>mỗi</em> iteration — kể cả iteration 3.</p>
<p class="nhan">Bốn đầu vào</p>
<ul>
<li><strong>Template &amp; hướng dẫn</strong> — luôn lấy bản mới nhất trên EduNext ("SWP391 General Information").</li>
<li><strong>Tài liệu yêu cầu</strong> — thầy/cô soạn sẵn, hoặc nhóm đề xuất rồi thầy/cô đồng ý/điều chỉnh.</li>
<li><strong>Cỡ chấp nhận được</strong> — đủ chức năng/màn hình để <em>trung bình mỗi người 3 màn hình khác nhau mỗi iteration</em>.</li>
<li><strong>Yêu cầu đầu vào</strong> — thầy/cô đồng ý hoặc giao trước iteration 1.</li>
</ul>
<p class="nhan">Quy tắc cỡ tính ra con số</p>
<ol>
<li>5 người × 3 màn hình × 3 iteration = <strong>ít nhất 45 màn hình</strong>.</li>
<li>Theo Student Guides (3–4 màn hình): 5 × 4 × 3 = <strong>60 màn hình</strong> ở mức cao.</li>
<li>Nhóm 4 người: 36–48 màn hình.</li>
</ol>
<p><strong>Ví dụ (Job IT for Freelancer, bài mẫu G5):</strong> 4 vai trò (Guest, Freelancer, Recruiter, Admin) và khoảng 50 use case — đăng nhập, đăng tin tuyển, ứng tuyển, duyệt ứng viên, quản lý danh mục, dashboard, blog… — đúng tầm cỡ cần có.</p>
<div class="pitfall co-tieu-de"><strong>Quá nhỏ là lý do bị bác đề tài nhiều nhất.</strong> Một "shop đơn giản" 15 màn hình thì tới iteration 3 hết việc để làm, mà iteration 3 trống nghĩa là điểm LOC thấp cho 25% của môn. Bài 0.7 hướng dẫn cách định cỡ đề tài.</div>`],
    ]),
    bi(`<h3>One iteration, seen by one member</h3>
<p>Take a member who owns the <strong>Recruiter</strong> screens of a Job Board system. In iteration 2 the Product sheet gives her three screens: <em>Post a job</em>, <em>My job posts</em> and <em>Company profile</em>. Her six slots look like this:</p>
<ol>
<li><strong>Plan</strong> — create one GitLab issue labelled <code>Req</code> per screen, milestone <code>iter2</code>, assignee = herself; add <code>Task</code> issues for "SRS", "SDS", "code", "integrate".</li>
<li><strong>Requirement</strong> — write the use case / screen specification of each screen in the RDS; open a <code>Q&amp;A</code> issue for anything the teacher (the PO) must confirm.</li>
<li><strong>Design</strong> — wireframe (confirmed by the teacher before coding), the tables she needs, the classes/sequence of each screen in the SDS part.</li>
<li><strong>Code</strong> — JSP/Servlet (or MVC controller) + DAO + SQL for each screen, with validation, search, sort and paging where there is a list.</li>
<li><strong>Integrate</strong> — merge into the team's <code>main</code> every day, reuse the common header/menu, link the screens from the menu (not by typing URLs).</li>
<li><strong>Submit</strong> — update the Project Tracking sheet, record a demo video, the leader tags the code (<code>iter2</code>) and sends the links.</li>
</ol>
<p class="nhan">Shared work that nobody "owns"</p>
<ul>
<li><strong>Common modules</strong> — login/authorisation, header/footer/menu, base DAO, DB connection.</li>
<li><strong>Database</strong> — one shared script; every member adds the tables of his/her screens.</li>
<li><strong>Common document parts</strong> — overview, context diagram, glossary, ERD of the RDS.</li>
</ul>
<div class="callout"><strong>★ Beyond the syllabus — the teacher is also your customer.</strong> Slide 5 says the teacher acts as <em>coach/mentor and customer/PO</em>. In industry a PO accepts or rejects a feature against its acceptance criteria. Treat every screen the same way: before coding, write 3–5 acceptance criteria ("a recruiter cannot post a job without a deadline"), get them confirmed on Slack or in a <code>Q&amp;A</code> issue, then demo against them. That is exactly how "Quality = High/Medium/Low" is decided.</div>`,
    `<h3>Một iteration, nhìn từ một thành viên</h3>
<p>Lấy một thành viên phụ trách các màn hình <strong>Recruiter</strong> của hệ thống Job Board. Ở iteration 2 sheet Product giao cho bạn ấy ba màn hình: <em>Đăng tin tuyển</em>, <em>Tin tuyển của tôi</em> và <em>Hồ sơ công ty</em>. Sáu slot của bạn ấy như sau:</p>
<ol>
<li><strong>Lập kế hoạch</strong> — tạo một issue GitLab label <code>Req</code> cho mỗi màn hình, milestone <code>iter2</code>, assignee là mình; thêm các issue <code>Task</code> "SRS", "SDS", "code", "tích hợp".</li>
<li><strong>Yêu cầu</strong> — viết use case / đặc tả màn hình trong RDS; mở issue <code>Q&amp;A</code> cho mọi điểm cần thầy/cô (PO) xác nhận.</li>
<li><strong>Thiết kế</strong> — wireframe (thầy/cô xác nhận trước khi code), các bảng cần dùng, class/sequence của từng màn hình trong phần SDS.</li>
<li><strong>Code</strong> — JSP/Servlet (hoặc MVC controller) + DAO + SQL cho từng màn hình, có validate, search, sort, paging ở mọi danh sách.</li>
<li><strong>Tích hợp</strong> — merge vào <code>main</code> của nhóm mỗi ngày, dùng chung header/menu, đi tới màn hình qua menu (không gõ URL).</li>
<li><strong>Nộp bài</strong> — cập nhật sheet Project Tracking, quay video demo, trưởng nhóm gắn tag code (<code>iter2</code>) và gửi link.</li>
</ol>
<p class="nhan">Phần việc chung không ai "sở hữu" riêng</p>
<ul>
<li><strong>Module dùng chung</strong> — đăng nhập/phân quyền, header/footer/menu, DAO gốc, kết nối CSDL.</li>
<li><strong>Cơ sở dữ liệu</strong> — một script chung; mỗi người thêm bảng cho màn hình của mình.</li>
<li><strong>Phần tài liệu chung</strong> — tổng quan, context diagram, glossary, ERD trong RDS.</li>
</ul>
<div class="callout"><strong>★ Ngoài giáo trình — giảng viên cũng là khách hàng của bạn.</strong> Slide 5 ghi thầy/cô đóng vai <em>coach/mentor và customer/PO</em>. Ngoài doanh nghiệp, PO nhận hay trả một tính năng dựa trên tiêu chí chấp nhận (acceptance criteria). Hãy làm y như vậy với từng màn hình: trước khi code, viết 3–5 tiêu chí ("recruiter không thể đăng tin khi thiếu hạn nộp"), xin xác nhận trên Slack hoặc issue <code>Q&amp;A</code>, rồi demo theo đúng các tiêu chí đó. Đó chính là cách "Quality = High/Medium/Low" được quyết định.</div>`),
    books([
      ['sommerville', 'ch. 2 (software processes — incremental development) and ch. 3 (agile, iterations)', 'chương 2 (quy trình phần mềm — phát triển tăng dần) và chương 3 (agile, iteration)'],
      ['wiegers', 'ch. 1–2 (what requirements are; the customer–developer partnership)', 'chương 1–2 (yêu cầu là gì; quan hệ khách hàng – nhà phát triển)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 0.2 Passing rules & grading ───────────────────────── */
const L02 = {
  title: '0.2 — Milestones, passing rules & LOC grading (with a full worked example)|||0.2 — Milestone, điều kiện qua môn & cách chấm LOC (kèm ví dụ tính trọn vẹn)',
  slug: 'swp391-dieu-kien-qua-mon',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Subject Guides slide 4–7: 3 iteration 15/20/25% + thuyết trình 40%, điều kiện qua môn, Converted-LOC = C × Q, MaxLOC 180/240/660 (Subject Guides) và 240/240/720 (Student Guides) — ví dụ tính điểm một thành viên qua cả 3 iteration.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.2 · Subject Guides slides 4–7</span>
<h2>Milestones, passing rules &amp; how a screen becomes a grade</h2>
<p class="lead">SWP391 has no written exam. Your grade is three iteration grades plus one presentation grade — and an iteration grade is mostly <strong>Converted-LOC</strong>: the size of each screen you finished, multiplied by how well it works. Learn the formula now and you will plan your screens very differently.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>State the four milestones, their lengths and weights, and the four pass conditions (slide 4).</li>
<li>Describe what the teacher and the students each do (slide 5) and what is submitted every iteration (slide 6).</li>
<li>Compute Converted-LOC = C × Q and the LOC grade of one member, under both versions of the guide (slide 7).</li>
<li>Compute the OG grade and check whether a student passes.</li>
</ul></div>
<p class="nhan">The two formulas to remember</p>
<ul>
<li><strong>OG</strong> = (iter1 × 15% + iter2 × 20% + iter3 × 25%) / 60% — must be ≥ 5.</li>
<li><strong>LOC grade</strong> = Converted-LOC × 10 / MaxLOC, where Converted-LOC = Σ (Complexity × Quality) of your completed screens.</li>
</ul>`,
    `<span class="eyebrow">Mục 0 · Bài 0.2 · Subject Guides slide 4–7</span>
<h2>Milestone, điều kiện qua môn &amp; cách một màn hình biến thành điểm</h2>
<p class="lead">SWP391 không có thi viết. Điểm của bạn là ba điểm iteration cộng một điểm thuyết trình — và điểm iteration chủ yếu là <strong>Converted-LOC</strong>: độ lớn của từng màn hình bạn làm xong, nhân với mức chạy tốt của nó. Nắm công thức ngay từ đầu, bạn sẽ lên kế hoạch màn hình khác hẳn.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Nêu bốn milestone, thời lượng, trọng số và bốn điều kiện qua môn (slide 4).</li>
<li>Mô tả việc của giảng viên và của sinh viên (slide 5) và những gì phải nộp mỗi iteration (slide 6).</li>
<li>Tính Converted-LOC = C × Q và điểm LOC của một thành viên, theo cả hai phiên bản hướng dẫn (slide 7).</li>
<li>Tính điểm OG và kiểm tra một sinh viên có qua môn không.</li>
</ul></div>
<p class="nhan">Hai công thức phải nhớ</p>
<ul>
<li><strong>OG</strong> = (iter1 × 15% + iter2 × 20% + iter3 × 25%) / 60% — phải ≥ 5.</li>
<li><strong>Điểm LOC</strong> = Converted-LOC × 10 / MaxLOC, trong đó Converted-LOC = Σ (Complexity × Quality) của các màn hình bạn đã hoàn thành.</li>
</ul>`),
    walkHead(S, 4, 7),
    walk(S, [
      [4, 'Milestones & Evaluations — 3 iterations + final presentation, pass conditions',
        `<p class="y-chinh">🎯 Four milestones weighted 15 / 20 / 25 / 40 — and four conditions that must <em>all</em> be true to pass.</p>
<p class="nhan">The milestone table</p>
<ol>
<li><strong>Iteration 1</strong> — 6 slots of 135' (9 of 90'), 15%, graded by the guiding teacher.</li>
<li><strong>Iteration 2</strong> — 6 slots (9), 20%, guiding teacher.</li>
<li><strong>Iteration 3</strong> — 6 slots (9), 25%, the <em>final package</em>, guiding teacher.</li>
<li><strong>Final Presentation</strong> — 2 slots (3), 40%, with 2 other teachers as evaluators.</li>
</ol>
<p class="nhan">To pass, all four</p>
<ul>
<li><strong>Attendance</strong> ≥ 80% of the training slots.</li>
<li><strong>OG grade</strong> ≥ 5/10, where OG = (iter1·15% + iter2·20% + iter3·25%) / 60%.</li>
<li><strong>Final Presentation grade</strong> ≥ 5/10 — it evaluates the iteration 3 result.</li>
<li><strong>No cheating</strong> found (e.g. code copied from another team or a previous semester).</li>
</ul>
<p><strong>Example:</strong> iter1 = 6, iter2 = 4, iter3 = 5 → OG = (0.9 + 0.8 + 1.25) / 0.6 = 2.95 / 0.6 = <strong>4.92 → fail</strong>, even with a presentation grade of 9. OG and the presentation are two separate gates.</p>
<p class="meo">🧠 <strong>Remember:</strong> dividing by 60% simply re-scales the three iterations to /10; iteration 3 alone is 25/60 ≈ 42% of OG.</p>`,
        `<p class="y-chinh">🎯 Bốn milestone trọng số 15 / 20 / 25 / 40 — và bốn điều kiện phải <em>cùng</em> đúng thì mới qua môn.</p>
<p class="nhan">Bảng milestone</p>
<ol>
<li><strong>Iteration 1</strong> — 6 slot 135' (9 slot 90'), 15%, giảng viên hướng dẫn chấm.</li>
<li><strong>Iteration 2</strong> — 6 slot (9), 20%, giảng viên hướng dẫn chấm.</li>
<li><strong>Iteration 3</strong> — 6 slot (9), 25%, là <em>gói nộp cuối (final package)</em>, giảng viên hướng dẫn chấm.</li>
<li><strong>Final Presentation</strong> — 2 slot (3), 40%, có thêm 2 giảng viên khác chấm.</li>
</ol>
<p class="nhan">Muốn qua môn, cần đủ cả bốn</p>
<ul>
<li><strong>Đi học</strong> ≥ 80% số slot.</li>
<li><strong>Điểm OG</strong> ≥ 5/10, với OG = (iter1·15% + iter2·20% + iter3·25%) / 60%.</li>
<li><strong>Điểm Final Presentation</strong> ≥ 5/10 — đánh giá kết quả của iteration 3.</li>
<li><strong>Không phát hiện gian lận</strong> (vd chép code của nhóm khác hoặc của khoá trước).</li>
</ul>
<p><strong>Ví dụ:</strong> iter1 = 6, iter2 = 4, iter3 = 5 → OG = (0,9 + 0,8 + 1,25) / 0,6 = 2,95 / 0,6 = <strong>4,92 → trượt</strong>, dù thuyết trình được 9. OG và thuyết trình là hai cửa riêng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chia cho 60% chỉ để quy ba iteration về thang 10; riêng iteration 3 đã chiếm 25/60 ≈ 42% điểm OG.</p>`],
      [5, 'Main student & teacher tasks — coach and customer/PO; what students do',
        `<p class="y-chinh">🎯 The teacher sets up the project and then acts as coach <em>and</em> customer; students own their screens end-to-end and build the shared parts together.</p>
<p class="nhan">The teacher — at initiation</p>
<ol>
<li>Introduces the subject, forms the teams, assigns or verifies the input requirements.</li>
<li>Creates the Slack channel, invites everyone, shares reference materials and links.</li>
<li>Creates the Git <strong>group</strong> and configures its <strong>labels</strong> (issue types, statuses) and <strong>milestones</strong>.</li>
<li>Creates the repositories and invites each <strong>team leader as Maintainer</strong>; the leader invites the members and sets the repository security.</li>
<li>Teaches Git (versioning + issue tracking) and the Slack communication rules.</li>
</ol>
<p class="nhan">The teacher — during iterations</p>
<ul>
<li><strong>Coach/mentor</strong> — guides you to complete the submit packages.</li>
<li><strong>Customer/PO</strong> — the final point to confirm or clarify requirements. Most of the teacher's time goes here and into evaluating/feedback.</li>
</ul>
<p class="nhan">The student</p>
<ul>
<li><strong>Own screens</strong> — log and track the tasks/issues, write the requirement &amp; design specification, code full-stack.</li>
<li><strong>Team work</strong> — common code modules, database tables, common document content; review and integrate with the others.</li>
</ul>
<div class="pitfall">If a requirement is unclear, the answer is never "we assumed". Ask the PO in a thread or a <code>Q&amp;A</code> issue — a written answer protects you when the screen is graded.</div>`,
        `<p class="y-chinh">🎯 Giảng viên dựng khung dự án rồi đóng vai vừa coach <em>vừa</em> khách hàng; sinh viên sở hữu màn hình của mình từ đầu đến cuối và cùng làm phần chung.</p>
<p class="nhan">Giảng viên — giai đoạn khởi động</p>
<ol>
<li>Giới thiệu môn, xếp nhóm, giao hoặc duyệt yêu cầu đầu vào.</li>
<li>Tạo kênh Slack, mời mọi người, chia sẻ tài liệu tham khảo và link.</li>
<li>Tạo <strong>group</strong> Git và cấu hình <strong>label</strong> (loại issue, trạng thái) cùng <strong>milestone</strong>.</li>
<li>Tạo repository và mời <strong>trưởng nhóm với quyền Maintainer</strong>; trưởng nhóm mời thành viên và thiết lập bảo mật repo.</li>
<li>Hướng dẫn Git (quản lý phiên bản + theo dõi issue) và quy tắc trao đổi trên Slack.</li>
</ol>
<p class="nhan">Giảng viên — trong các iteration</p>
<ul>
<li><strong>Coach/mentor</strong> — hướng dẫn nhóm hoàn thiện bộ nộp.</li>
<li><strong>Khách hàng/PO</strong> — điểm chốt cuối cùng để xác nhận, làm rõ yêu cầu. Phần lớn thời gian của thầy/cô dành cho việc này và việc chấm/phản hồi.</li>
</ul>
<p class="nhan">Sinh viên</p>
<ul>
<li><strong>Màn hình của mình</strong> — ghi và theo dõi task/issue, viết đặc tả yêu cầu &amp; thiết kế, code full-stack.</li>
<li><strong>Việc chung</strong> — module code dùng chung, bảng CSDL, nội dung tài liệu chung; review và tích hợp với các bạn khác.</li>
</ul>
<div class="pitfall">Yêu cầu chưa rõ thì câu trả lời không bao giờ là "tụi em tự giả định". Hỏi PO trong thread hoặc issue <code>Q&amp;A</code> — câu trả lời bằng văn bản bảo vệ bạn khi màn hình được chấm.</div>`],
    ]),
    walk(S, [
      [6, 'Iteration Submit Items — Project Tracking, RDS, links to videos and tagged code',
        `<p class="y-chinh">🎯 At the end of every iteration the team hands in three things: the Project Tracking file, the RDS document and a text file of links.</p>
<p class="nhan">1 · Project Tracking document</p>
<ul>
<li><strong>Sheet RMS</strong> — the updated requirement management sheet (all use cases/screens of the product).</li>
<li><strong>Sheets iterX and iter[X+1]</strong> — status of the screens done in this iteration and the plan for the next one.</li>
<li><strong>Before iteration 1</strong> — the initial product scope and the iter1 plan must be submitted <em>before</em> iter1 starts.</li>
</ul>
<p class="nhan">2 · RDS document</p>
<ul>
<li><strong>Requirement &amp; Design Specification</strong> — the detailed specs of this iteration's screens plus updates to earlier ones.</li>
</ul>
<p class="nhan">3 · Links (in a text file)</p>
<ul>
<li><strong>Demo videos</strong> — one per team member.</li>
<li><strong>Tagged source code</strong> — the Git tag of this iteration; the DB script and config files must be inside that tagged code.</li>
</ul>
<p class="ghi-chu">Sheet names differ in the Student Guides and in the 2026 template ("Use Cases" + "Product") — see lesson 0.4 and the field-by-field tour in lesson 0.5.</p>`,
        `<p class="y-chinh">🎯 Cuối mỗi iteration nhóm nộp ba thứ: file Project Tracking, tài liệu RDS và một file text chứa các link.</p>
<p class="nhan">1 · Tài liệu Project Tracking</p>
<ul>
<li><strong>Sheet RMS</strong> — bảng quản lý yêu cầu đã cập nhật (mọi use case/màn hình của sản phẩm).</li>
<li><strong>Sheet iterX và iter[X+1]</strong> — trạng thái các màn hình làm trong iteration này và kế hoạch cho iteration sau.</li>
<li><strong>Trước iteration 1</strong> — phạm vi sản phẩm ban đầu và kế hoạch iter1 phải nộp <em>trước</em> khi iter1 bắt đầu.</li>
</ul>
<p class="nhan">2 · Tài liệu RDS</p>
<ul>
<li><strong>Requirement &amp; Design Specification</strong> — đặc tả chi tiết các màn hình của iteration này cộng phần cập nhật cho iteration trước.</li>
</ul>
<p class="nhan">3 · Các link (trong một file text)</p>
<ul>
<li><strong>Video demo</strong> — mỗi thành viên một video.</li>
<li><strong>Code đã gắn tag</strong> — tag Git của iteration; script CSDL và file cấu hình phải nằm trong chính bản code đã tag đó.</li>
</ul>
<p class="ghi-chu">Tên sheet khác đi trong Student Guides và template 2026 ("Use Cases" + "Product") — xem bài 0.4 và phần giải thích từng cột ở bài 0.5.</p>`],
      [7, 'Evaluation Criteria — Converted-LOC = C × Q, MaxLOC 180/240/660, final presentation rubric',
        `<p class="y-chinh">🎯 Each iteration is graded individually by the size × quality of the screens you finished, and by the quality of what the team submitted.</p>
<p class="nhan">Criterion 1 — LOC, per member, via code demo</p>
<ul>
<li><strong>Converted-LOC</strong> of a screen/function = <strong>C × Q</strong>; your total is the sum over the screens you completed in the iteration (in iteration 3: <em>all</em> completed screens).</li>
<li><strong>C (Complexity)</strong>, set by the teacher — Complex (≥ 15 fields, ≥ 7 transactions) = 240 · Medium (7–15 fields, 3–7 transactions) = 120 · Simple (&lt; 7 fields, &lt; 3 transactions) = 60.</li>
<li><strong>Q (Quality)</strong> — completeness, correctness, good UI/UX: High 100% · Medium 75% · Low 50%.</li>
<li><strong>LOC grade</strong> = Converted-LOC × 10 / MaxLOC, with <strong>MaxLOC = 180, 240, 660</strong> for iterations 1, 2, 3.</li>
</ul>
<p class="nhan">Criterion 2 — submitted materials</p>
<ul>
<li><strong>Quality</strong> of the source code and of the RDS document.</li>
<li><strong>Deduction</strong> — missing/incorrect Project Tracking or other items subtract from the team's grade, up to 10% of the total.</li>
</ul>
<p class="nhan">Final presentation — 2 teachers other than yours</p>
<ul>
<li>Team working (presentation, Q&amp;A) <strong>20%</strong> · Software product/implementation <strong>40%</strong> · Requirement analysing <strong>20%</strong> · Software designing <strong>20%</strong>.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The other deck says something different.</strong> The Student Guides (slide 7) put LOC at <strong>70%</strong> and the submitted package at <strong>30%</strong>, and use <strong>MaxLOC = 240 / 240 / 720</strong>. Both versions circulate; follow the one your teacher posts on EduNext/CMS this semester. The worked example below computes both.</div>`,
        `<p class="y-chinh">🎯 Mỗi iteration được chấm riêng từng người theo độ lớn × chất lượng các màn hình bạn làm xong, và theo chất lượng bộ nộp của nhóm.</p>
<p class="nhan">Tiêu chí 1 — LOC, từng người, qua demo code</p>
<ul>
<li><strong>Converted-LOC</strong> của một màn hình/chức năng = <strong>C × Q</strong>; tổng của bạn là tổng trên các màn hình đã hoàn thành trong iteration (ở iteration 3: <em>mọi</em> màn hình đã hoàn thành).</li>
<li><strong>C (Complexity)</strong>, do thầy/cô định — Complex (≥ 15 trường, ≥ 7 transaction) = 240 · Medium (7–15 trường, 3–7 transaction) = 120 · Simple (&lt; 7 trường, &lt; 3 transaction) = 60.</li>
<li><strong>Q (Quality)</strong> — đủ, đúng, UI/UX tốt: High 100% · Medium 75% · Low 50%.</li>
<li><strong>Điểm LOC</strong> = Converted-LOC × 10 / MaxLOC, với <strong>MaxLOC = 180, 240, 660</strong> cho iteration 1, 2, 3.</li>
</ul>
<p class="nhan">Tiêu chí 2 — bộ tài liệu nộp</p>
<ul>
<li><strong>Chất lượng</strong> source code và tài liệu RDS.</li>
<li><strong>Trừ điểm</strong> — thiếu/sai Project Tracking hay mục bắt buộc khác thì trừ vào điểm nhóm, tối đa 10% tổng điểm.</li>
</ul>
<p class="nhan">Thuyết trình cuối — 2 giảng viên không phải thầy/cô lớp bạn</p>
<ul>
<li>Làm việc nhóm (trình bày, hỏi đáp) <strong>20%</strong> · Sản phẩm/hiện thực <strong>40%</strong> · Phân tích yêu cầu <strong>20%</strong> · Thiết kế phần mềm <strong>20%</strong>.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bộ slide kia nói khác.</strong> Student Guides (slide 7) cho LOC <strong>70%</strong>, gói nộp <strong>30%</strong>, và dùng <strong>MaxLOC = 240 / 240 / 720</strong>. Cả hai bản đều đang lưu hành; hãy theo bản thầy/cô đăng trên EduNext/CMS học kỳ này. Ví dụ bên dưới tính cả hai.</div>`],
    ]),
    bi(`<h2>🧮 Worked example — one member, three iterations</h2>
<p>Member B owns the <strong>Recruiter</strong> side of a Job Board system. Complexity is counted with the slide's three bands; quality is what the teacher saw in the demo. The numbers were computed by a script.</p>
<h4>Iteration 1 — 3 screens</h4>
<table>
<thead><tr><th>Screen</th><th>Fields / transactions</th><th>C</th><th>Q</th><th>C × Q</th></tr></thead>
<tbody>
<tr><td>Login</td><td>4 fields (e-mail, password, remember me, login) · 1 transaction</td><td>Simple 60</td><td>High 100%</td><td>60</td></tr>
<tr><td>Register recruiter</td><td>8 fields (company, e-mail, password, confirm, phone, address, tax code, website) · 3 (check e-mail, insert account, insert company)</td><td>Medium 120</td><td>Medium 75%</td><td>90</td></tr>
<tr><td>Change password</td><td>3 fields · 1 transaction; wrong old password not handled</td><td>Simple 60</td><td>Low 50%</td><td>30</td></tr>
<tr><td colspan="4"><strong>Converted-LOC</strong></td><td><strong>180</strong></td></tr>
</tbody>
</table>
<h4>Iteration 2 — 3 new screens</h4>
<table>
<thead><tr><th>Screen</th><th>C</th><th>Q</th><th>C × Q</th></tr></thead>
<tbody>
<tr><td>Post / edit a job (11 fields, 4 transactions)</td><td>Medium 120</td><td>Medium 75%</td><td>90</td></tr>
<tr><td>My job posts — search, filter, sort, paging, close (9 fields, 4 transactions)</td><td>Medium 120</td><td>Medium 75%</td><td>90</td></tr>
<tr><td>Company profile view (5 fields, 1 transaction)</td><td>Simple 60</td><td>Low 50%</td><td>30</td></tr>
<tr><td colspan="3"><strong>Converted-LOC</strong></td><td><strong>210</strong></td></tr>
</tbody>
</table>
<h4>Iteration 3 — all completed screens are graded again</h4>
<p>B fixes earlier screens (the teacher re-grades their quality) and adds <em>Review applicants</em> (Complex 240, happy cases only → 50%) and <em>Recruiter dashboard</em> (Medium 120, 50%).</p>
<table>
<thead><tr><th>Screen</th><th>C × Q</th></tr></thead>
<tbody>
<tr><td>Login 60 × 100%</td><td>60</td></tr>
<tr><td>Register recruiter 120 × 100% (fixed)</td><td>120</td></tr>
<tr><td>Change password 60 × 75% (fixed)</td><td>45</td></tr>
<tr><td>Post / edit a job 120 × 100% (fixed)</td><td>120</td></tr>
<tr><td>My job posts 120 × 75%</td><td>90</td></tr>
<tr><td>Company profile 60 × 75% (fixed)</td><td>45</td></tr>
<tr><td>Review applicants 240 × 50%</td><td>120</td></tr>
<tr><td>Recruiter dashboard 120 × 50%</td><td>60</td></tr>
<tr><td><strong>Converted-LOC</strong></td><td><strong>660</strong></td></tr>
</tbody>
</table>
<h4>From Converted-LOC to grades — both versions of the guide</h4>
<table>
<thead><tr><th></th><th>Iter 1</th><th>Iter 2</th><th>Iter 3</th></tr></thead>
<tbody>
<tr><td>Converted-LOC</td><td>180</td><td>210</td><td>660</td></tr>
<tr><td><strong>Subject Guides</strong> MaxLOC</td><td>180</td><td>240</td><td>660</td></tr>
<tr><td>LOC grade = LOC × 10 / MaxLOC</td><td>10.00</td><td>8.75</td><td>10.00</td></tr>
<tr><td>Deduction (iter 2: Project Tracking not updated, −5%)</td><td>0</td><td>−0.50</td><td>0</td></tr>
<tr><td><strong>Iteration grade</strong></td><td><strong>10.00</strong></td><td><strong>8.25</strong></td><td><strong>10.00</strong></td></tr>
<tr><td><strong>Student Guides</strong> MaxLOC</td><td>240</td><td>240</td><td>720</td></tr>
<tr><td>LOC grade</td><td>7.50</td><td>8.75</td><td>9.17</td></tr>
<tr><td>Package grade (code, DB script, RDS)</td><td>7</td><td>8</td><td>8</td></tr>
<tr><td>0.7 × LOC + 0.3 × package</td><td><strong>7.35</strong></td><td><strong>8.53</strong></td><td><strong>8.82</strong></td></tr>
</tbody>
</table>
<p class="nhan">OG and the final mark</p>
<ol>
<li><strong>Subject Guides</strong> — OG = (10.00 × 15 + 8.25 × 20 + 10.00 × 25) / 60 = 565 / 60 = <strong>9.42</strong>.</li>
<li><strong>Student Guides</strong> — OG = (7.35 × 15 + 8.525 × 20 + 8.817 × 25) / 60 = 501.17 / 60 = <strong>8.35</strong>.</li>
<li>Both are ≥ 5, so B passes the OG gate. With a Final Presentation grade of 7.5 (≥ 5), the subject mark = (iter1·15 + iter2·20 + iter3·25 + 7.5·40) / 100 = <strong>8.65</strong> (Subject Guides) or <strong>8.01</strong> (Student Guides).</li>
</ol>
<p class="nhan">What the example teaches</p>
<ul>
<li><strong>Quality is cheap LOC</strong> — raising <em>Post a job</em> from 75% to 100% earned 30 LOC without writing a new screen.</li>
<li><strong>Iteration 3 counts everything</strong> — the same screen scores in iteration 1 <em>and</em> again in iteration 3, so fixing old screens pays twice.</li>
<li><strong>The same work gives different grades</strong> — 180 LOC is a 10 against MaxLOC 180 but a 7.5 against MaxLOC 240. Ask your teacher which table applies before you plan iteration 1.</li>
</ul>
<p class="ghi-chu">The Refs sheet of the 2026 Project Tracking template contains a grade simulator that uses LOC 70% / package 30% with MaxLOC 660, and notes that in iteration 3 the package weight becomes 40%. With that rule B's iteration 3 would be 0.6 × 9.17 + 0.4 × 8 = 8.70. Its MasterData sheet also lists per-iteration targets 180 / 240 / 180 LOC. Yet another reason to read your own teacher's file.</p>
<div class="pitfall co-tieu-de"><strong>Can a LOC grade exceed 10?</strong> The formula itself has no cap — the template's own simulator shows 10.91 for 8 screens. Whether the teacher caps it at 10 is not written in either deck; ask, and do not "bank" extra LOC in one iteration hoping to cover another — each iteration is graded on its own screens.</div>`,
    `<h2>🧮 Ví dụ tính trọn — một thành viên, ba iteration</h2>
<p>Thành viên B phụ trách phía <strong>Recruiter</strong> của hệ thống Job Board. Complexity đếm theo ba mức trên slide; quality là những gì thầy/cô thấy lúc demo. Các con số được tính bằng script.</p>
<h4>Iteration 1 — 3 màn hình</h4>
<table>
<thead><tr><th>Màn hình</th><th>Trường / transaction</th><th>C</th><th>Q</th><th>C × Q</th></tr></thead>
<tbody>
<tr><td>Đăng nhập</td><td>4 trường (email, mật khẩu, ghi nhớ, nút đăng nhập) · 1 transaction</td><td>Simple 60</td><td>High 100%</td><td>60</td></tr>
<tr><td>Đăng ký recruiter</td><td>8 trường (công ty, email, mật khẩu, nhập lại, điện thoại, địa chỉ, mã số thuế, website) · 3 (kiểm email, thêm tài khoản, thêm công ty)</td><td>Medium 120</td><td>Medium 75%</td><td>90</td></tr>
<tr><td>Đổi mật khẩu</td><td>3 trường · 1 transaction; chưa xử lý nhập sai mật khẩu cũ</td><td>Simple 60</td><td>Low 50%</td><td>30</td></tr>
<tr><td colspan="4"><strong>Converted-LOC</strong></td><td><strong>180</strong></td></tr>
</tbody>
</table>
<h4>Iteration 2 — 3 màn hình mới</h4>
<table>
<thead><tr><th>Màn hình</th><th>C</th><th>Q</th><th>C × Q</th></tr></thead>
<tbody>
<tr><td>Đăng / sửa tin tuyển (11 trường, 4 transaction)</td><td>Medium 120</td><td>Medium 75%</td><td>90</td></tr>
<tr><td>Tin tuyển của tôi — search, filter, sort, paging, đóng tin (9 trường, 4 transaction)</td><td>Medium 120</td><td>Medium 75%</td><td>90</td></tr>
<tr><td>Xem hồ sơ công ty (5 trường, 1 transaction)</td><td>Simple 60</td><td>Low 50%</td><td>30</td></tr>
<tr><td colspan="3"><strong>Converted-LOC</strong></td><td><strong>210</strong></td></tr>
</tbody>
</table>
<h4>Iteration 3 — chấm lại mọi màn hình đã hoàn thành</h4>
<p>B sửa các màn hình cũ (thầy/cô chấm lại quality) và thêm <em>Duyệt ứng viên</em> (Complex 240, mới có happy case → 50%) và <em>Dashboard recruiter</em> (Medium 120, 50%).</p>
<table>
<thead><tr><th>Màn hình</th><th>C × Q</th></tr></thead>
<tbody>
<tr><td>Đăng nhập 60 × 100%</td><td>60</td></tr>
<tr><td>Đăng ký recruiter 120 × 100% (đã sửa)</td><td>120</td></tr>
<tr><td>Đổi mật khẩu 60 × 75% (đã sửa)</td><td>45</td></tr>
<tr><td>Đăng / sửa tin tuyển 120 × 100% (đã sửa)</td><td>120</td></tr>
<tr><td>Tin tuyển của tôi 120 × 75%</td><td>90</td></tr>
<tr><td>Hồ sơ công ty 60 × 75% (đã sửa)</td><td>45</td></tr>
<tr><td>Duyệt ứng viên 240 × 50%</td><td>120</td></tr>
<tr><td>Dashboard recruiter 120 × 50%</td><td>60</td></tr>
<tr><td><strong>Converted-LOC</strong></td><td><strong>660</strong></td></tr>
</tbody>
</table>
<h4>Từ Converted-LOC ra điểm — theo cả hai phiên bản hướng dẫn</h4>
<table>
<thead><tr><th></th><th>Iter 1</th><th>Iter 2</th><th>Iter 3</th></tr></thead>
<tbody>
<tr><td>Converted-LOC</td><td>180</td><td>210</td><td>660</td></tr>
<tr><td>MaxLOC theo <strong>Subject Guides</strong></td><td>180</td><td>240</td><td>660</td></tr>
<tr><td>Điểm LOC = LOC × 10 / MaxLOC</td><td>10,00</td><td>8,75</td><td>10,00</td></tr>
<tr><td>Trừ điểm (iter 2: không cập nhật Project Tracking, −5%)</td><td>0</td><td>−0,50</td><td>0</td></tr>
<tr><td><strong>Điểm iteration</strong></td><td><strong>10,00</strong></td><td><strong>8,25</strong></td><td><strong>10,00</strong></td></tr>
<tr><td>MaxLOC theo <strong>Student Guides</strong></td><td>240</td><td>240</td><td>720</td></tr>
<tr><td>Điểm LOC</td><td>7,50</td><td>8,75</td><td>9,17</td></tr>
<tr><td>Điểm package (code, script CSDL, RDS)</td><td>7</td><td>8</td><td>8</td></tr>
<tr><td>0,7 × LOC + 0,3 × package</td><td><strong>7,35</strong></td><td><strong>8,53</strong></td><td><strong>8,82</strong></td></tr>
</tbody>
</table>
<p class="nhan">Điểm OG và điểm môn</p>
<ol>
<li><strong>Subject Guides</strong> — OG = (10,00 × 15 + 8,25 × 20 + 10,00 × 25) / 60 = 565 / 60 = <strong>9,42</strong>.</li>
<li><strong>Student Guides</strong> — OG = (7,35 × 15 + 8,525 × 20 + 8,817 × 25) / 60 = 501,17 / 60 = <strong>8,35</strong>.</li>
<li>Cả hai đều ≥ 5 nên B qua cửa OG. Với điểm thuyết trình 7,5 (≥ 5), điểm môn = (iter1·15 + iter2·20 + iter3·25 + 7,5·40) / 100 = <strong>8,65</strong> (Subject Guides) hoặc <strong>8,01</strong> (Student Guides).</li>
</ol>
<p class="nhan">Ví dụ này dạy điều gì</p>
<ul>
<li><strong>Nâng quality là LOC rẻ nhất</strong> — đưa <em>Đăng tin tuyển</em> từ 75% lên 100% được thêm 30 LOC mà không phải viết màn hình mới.</li>
<li><strong>Iteration 3 tính tất cả</strong> — cùng một màn hình ghi điểm ở iteration 1 <em>và</em> lại ghi điểm ở iteration 3, nên sửa màn hình cũ được lợi hai lần.</li>
<li><strong>Cùng một khối lượng, điểm khác nhau</strong> — 180 LOC là điểm 10 nếu MaxLOC 180 nhưng chỉ 7,5 nếu MaxLOC 240. Hỏi thầy/cô dùng bảng nào trước khi lên kế hoạch iteration 1.</li>
</ul>
<p class="ghi-chu">Sheet Refs của template Project Tracking 2026 có sẵn bảng mô phỏng điểm dùng LOC 70% / package 30% với MaxLOC 660, và ghi chú rằng ở iteration 3 tỷ trọng package là 40%. Theo quy tắc đó iteration 3 của B sẽ là 0,6 × 9,17 + 0,4 × 8 = 8,70. Sheet MasterData còn ghi mục tiêu từng iteration là 180 / 240 / 180 LOC. Thêm một lý do để đọc đúng file của thầy/cô lớp mình.</p>
<div class="pitfall co-tieu-de"><strong>Điểm LOC có vượt 10 được không?</strong> Bản thân công thức không có trần — chính bảng mô phỏng trong template cho ra 10,91 với 8 màn hình. Thầy/cô có chặn ở 10 hay không thì cả hai bộ slide đều không ghi; hãy hỏi, và đừng "để dành" LOC dư ở iteration này để bù iteration khác — mỗi iteration chấm trên màn hình của chính nó.</div>`),
    bi(`<h3>How to count fields and transactions (the 2026 template's finer scale)</h3>
<p>The slides use three bands. The Refs sheet of the 2026 Project Tracking template refines them into <strong>7 levels</strong>, 30 LOC apart:</p>
<table>
<thead><tr><th>Level</th><th>Fields</th><th>OR transactions</th><th>Converted LOC</th></tr></thead>
<tbody>
<tr><td>1</td><td>3–5</td><td>2</td><td>60</td></tr>
<tr><td>2</td><td>6–7</td><td>3</td><td>90</td></tr>
<tr><td>3</td><td>8–9</td><td>4</td><td>120</td></tr>
<tr><td>4</td><td>10–11</td><td>5</td><td>150</td></tr>
<tr><td>5</td><td>12–13</td><td>6</td><td>180</td></tr>
<tr><td>6</td><td>14–15</td><td>7</td><td>210</td></tr>
<tr><td>7</td><td>&gt; 15</td><td>&gt; 7</td><td>240</td></tr>
</tbody>
</table>
<p class="nhan">Counting rules written in the template</p>
<ul>
<li><strong>Field</strong> — an actionable screen component (input, dropdown, button, checkbox) or a database table field shown on the screen.</li>
<li><strong>Transaction</strong> — one call to the database or to an external system (e.g. MailTrap).</li>
<li><strong>1 transaction = 2 fields</strong> — a transaction not tied to any field is counted as two extra fields.</li>
</ul>
<p class="nhan">Quality levels, made concrete</p>
<ul>
<li><strong>L1 Happy cases — 50%</strong>: the screen works when the user does everything right.</li>
<li><strong>L2 All cases — 75%</strong>: happy <em>and</em> unhappy cases (blank, too long, wrong format, duplicates, no permission).</li>
<li><strong>L3 Optimized — 100%</strong>: all cases + good UX and business logic that suits real use.</li>
</ul>
<p><strong>Example:</strong> <em>My job posts</em> has search box, status filter, sort, page size, pager, "close" button = 6 fields; transactions: list query, count query, close post = 3 → 6 + 3 × 2 = 12 field-equivalents → Level 5 = 180 LOC on the fine scale (Medium 120 on the slide's scale).</p>
<div class="pitfall co-tieu-de"><strong>Splitting one screen into many does not work.</strong> The teacher's Product sheet counts "Add / Update / View detail" as <em>one</em> screen and "list + delete + filter + search + sort + paging" as <em>one</em> screen. Five tiny CRUD pages are graded as one or two screens.</div>`,
    `<h3>Đếm trường và transaction thế nào (thang chi tiết của template 2026)</h3>
<p>Slide dùng ba mức. Sheet Refs của template Project Tracking 2026 chia nhỏ thành <strong>7 level</strong>, cách nhau 30 LOC:</p>
<table>
<thead><tr><th>Level</th><th>Số trường</th><th>HOẶC số transaction</th><th>Converted LOC</th></tr></thead>
<tbody>
<tr><td>1</td><td>3–5</td><td>2</td><td>60</td></tr>
<tr><td>2</td><td>6–7</td><td>3</td><td>90</td></tr>
<tr><td>3</td><td>8–9</td><td>4</td><td>120</td></tr>
<tr><td>4</td><td>10–11</td><td>5</td><td>150</td></tr>
<tr><td>5</td><td>12–13</td><td>6</td><td>180</td></tr>
<tr><td>6</td><td>14–15</td><td>7</td><td>210</td></tr>
<tr><td>7</td><td>&gt; 15</td><td>&gt; 7</td><td>240</td></tr>
</tbody>
</table>
<p class="nhan">Quy tắc đếm ghi trong template</p>
<ul>
<li><strong>Trường (field)</strong> — thành phần thao tác được trên màn hình (ô nhập, dropdown, nút, checkbox) hoặc trường của bảng CSDL hiển thị trên màn hình.</li>
<li><strong>Transaction</strong> — một lần gọi xuống CSDL hoặc hệ thống ngoài (vd MailTrap).</li>
<li><strong>1 transaction = 2 trường</strong> — transaction không gắn với trường nào thì cộng thêm hai trường.</li>
</ul>
<p class="nhan">Mức quality, nói cụ thể</p>
<ul>
<li><strong>L1 Happy cases — 50%</strong>: màn hình chạy khi người dùng làm đúng mọi thứ.</li>
<li><strong>L2 All cases — 75%</strong>: có cả happy <em>và</em> unhappy case (bỏ trống, quá dài, sai định dạng, trùng, không có quyền).</li>
<li><strong>L3 Optimized — 100%</strong>: đủ mọi case + UX tốt và nghiệp vụ hợp với thực tế.</li>
</ul>
<p><strong>Ví dụ:</strong> <em>Tin tuyển của tôi</em> có ô tìm, lọc trạng thái, sắp xếp, số dòng/trang, phân trang, nút "đóng tin" = 6 trường; transaction: truy vấn danh sách, đếm, đóng tin = 3 → 6 + 3 × 2 = 12 trường quy đổi → Level 5 = 180 LOC theo thang chi tiết (Medium 120 theo thang của slide).</p>
<div class="pitfall co-tieu-de"><strong>Chẻ một màn hình thành nhiều màn không ăn thua.</strong> Sheet Product của thầy/cô tính "Thêm / Sửa / Xem chi tiết" là <em>một</em> màn hình và "danh sách + xoá + lọc + tìm + sắp xếp + phân trang" là <em>một</em> màn hình. Năm trang CRUD nhỏ xíu chỉ được chấm như một hai màn hình.</div>`),
    books([
      ['sommerville', 'ch. 23 (project planning — estimation, function/size metrics)', 'chương 23 (lập kế hoạch dự án — ước lượng, độ đo kích thước/chức năng)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 0.3 Tracking & monitoring ───────────────────────── */
const L03 = {
  title: '0.3 — Tracking & monitoring on GitLab: milestones, labels, issues, tags|||0.3 — Theo dõi dự án trên GitLab: milestone, label, issue, tag',
  slug: 'swp391-0-3-tracking-monitoring',
  type: 'VIDEO',
  description: 'Subject Guides slide 8–15: 4 milestone iter1–iter4 trên GitLab, 8 label (1_To Do … Task), tạo Req, danh sách issue, board kéo-thả, chi tiết issue và tag nộp bài cuối mỗi iteration.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.3 · Subject Guides slides 8–15</span>
<h2>Tracking &amp; monitoring — how the teacher sees your progress</h2>
<p class="lead">The teacher does not ask "how is it going?". The teacher opens your GitLab project: the <strong>milestones</strong> show the iterations, the <strong>labels</strong> show what each issue is and where it stands, the <strong>board</strong> shows who is stuck, and the <strong>tag</strong> is the exact code that gets graded. The last eight pages of the Subject Guides show these screens one by one.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Read the group milestones iter1–iter4 (slide 8).</li>
<li>Use the 8 labels correctly — 3 statuses and 5 issue types (slide 9).</li>
<li>Create a <code>Req</code> issue, filter the issue list, move cards on the board, read an issue's history (slides 10–13).</li>
<li>Create the iteration tag that you submit (slide 14).</li>
</ul></div>
<p class="ghi-chu">This lesson is the overview from the Subject Guides. The separate <em>GitLab Guides</em> deck (32 pages) is taught step by step in the GitLab chapter of this course.</p>`,
    `<span class="eyebrow">Mục 0 · Bài 0.3 · Subject Guides slide 8–15</span>
<h2>Theo dõi &amp; giám sát — giảng viên nhìn tiến độ của bạn thế nào</h2>
<p class="lead">Thầy/cô không hỏi "tiến độ sao rồi?". Thầy/cô mở project GitLab của bạn: <strong>milestone</strong> cho thấy các iteration, <strong>label</strong> cho biết mỗi issue là loại gì và đang ở đâu, <strong>board</strong> cho thấy ai đang kẹt, còn <strong>tag</strong> là chính xác bản code được chấm. Tám trang cuối của Subject Guides lần lượt chỉ các màn hình đó.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Đọc các milestone iter1–iter4 của group (slide 8).</li>
<li>Dùng đúng 8 label — 3 trạng thái và 5 loại issue (slide 9).</li>
<li>Tạo issue <code>Req</code>, lọc danh sách issue, kéo thẻ trên board, đọc lịch sử một issue (slide 10–13).</li>
<li>Tạo tag của iteration để nộp (slide 14).</li>
</ul></div>
<p class="ghi-chu">Bài này là phần tổng quan trong Subject Guides. Bộ <em>GitLab Guides</em> riêng (32 trang) được học từng bước ở chương GitLab của khoá này.</p>`),
    walkHead(S, 8, 15),
    walk(S, [
      [8, 'Tracking & Monitoring — Project milestones iter1–iter4 (group milestones)',
        `<p class="y-chinh">🎯 The teacher creates one <strong>group milestone</strong> per iteration, so every team's issues are grouped by iteration automatically.</p>
<p class="nhan">What the screenshot shows (a real class, Summer 2023)</p>
<ul>
<li><strong>Four group milestones</strong> — iter1, iter2, iter3, iter4, each about two to three weeks long, all created at the class group level.</li>
<li><strong>iter4</strong> — the last period, used for the final presentation and last fixes.</li>
<li><strong>Progress bar</strong> — "0 Issues · 0% complete": the percentage of <em>closed</em> issues in that milestone.</li>
<li><strong>Close Milestone</strong> — done by the teacher when the iteration is over.</li>
</ul>
<p class="nhan">What your team does</p>
<ol>
<li>Put <strong>every</strong> issue into a milestone — an issue without a milestone is invisible in the iteration report.</li>
<li>Close issues when they are really done, so the % reflects reality.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> milestone = <em>when</em>, label = <em>what and where</em>, assignee = <em>who</em>.</p>`,
        `<p class="y-chinh">🎯 Thầy/cô tạo một <strong>group milestone</strong> cho mỗi iteration, nhờ vậy issue của mọi nhóm tự được gom theo iteration.</p>
<p class="nhan">Ảnh chụp cho thấy gì (một lớp thật, Summer 2023)</p>
<ul>
<li><strong>Bốn group milestone</strong> — iter1, iter2, iter3, iter4, mỗi cái dài khoảng hai đến ba tuần, đều tạo ở cấp group của lớp.</li>
<li><strong>iter4</strong> — giai đoạn cuối, dành cho thuyết trình và sửa lỗi cuối.</li>
<li><strong>Thanh tiến độ</strong> — "0 Issues · 0% complete": tỷ lệ issue <em>đã đóng</em> trong milestone đó.</li>
<li><strong>Close Milestone</strong> — thầy/cô bấm khi iteration kết thúc.</li>
</ul>
<p class="nhan">Nhóm bạn cần làm</p>
<ol>
<li>Gắn <strong>mọi</strong> issue vào một milestone — issue không có milestone thì không hiện trong báo cáo iteration.</li>
<li>Chỉ đóng issue khi thật sự xong, để con số % phản ánh đúng thực tế.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> milestone = <em>khi nào</em>, label = <em>là gì và đang ở đâu</em>, assignee = <em>ai làm</em>.</p>`],
      [9, 'Tracking & Monitoring — Track issue type/status with labels',
        `<p class="y-chinh">🎯 Eight labels: three say <em>where</em> an issue is, five say <em>what kind</em> of issue it is.</p>
<p class="nhan">Status labels (one at a time)</p>
<ol>
<li><strong>1_To Do</strong> — work or problem to be solved.</li>
<li><strong>2_Doing</strong> — being solved now.</li>
<li><strong>3_Done</strong> — solved, waiting to be checked and then <em>Closed</em>.</li>
</ol>
<p class="nhan">Type labels</p>
<ul>
<li><strong>Req</strong> — one screen or one function that can be given entirely to <em>one</em> person. This is the unit the LOC grade counts.</li>
<li><strong>Task</strong> — an activity assigned to a single member (members usually create their own tasks): "write SRS for Login".</li>
<li><strong>Q&amp;A</strong> — a question that needs clarification or confirmation from the teacher/PO.</li>
<li><strong>Defect</strong> — an error in documents or code found <em>by the team itself</em>.</li>
<li><strong>Leakage</strong> — an error found by the customer/teacher through review or test <em>after</em> submission.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Defect vs Leakage is a quality metric.</strong> Many Defects + few Leakages = the team tests its own work. Few Defects + many Leakages = the team ships untested screens, and the teacher lowers the Quality factor Q.</div>`,
        `<p class="y-chinh">🎯 Tám label: ba cái nói issue <em>đang ở đâu</em>, năm cái nói issue <em>thuộc loại gì</em>.</p>
<p class="nhan">Label trạng thái (mỗi lúc chỉ một)</p>
<ol>
<li><strong>1_To Do</strong> — công việc hoặc vấn đề cần giải quyết.</li>
<li><strong>2_Doing</strong> — đang được giải quyết.</li>
<li><strong>3_Done</strong> — đã giải quyết, chờ kiểm tra lại rồi <em>đóng (Closed)</em>.</li>
</ol>
<p class="nhan">Label loại issue</p>
<ul>
<li><strong>Req</strong> — một màn hình hoặc một chức năng có thể giao trọn cho <em>một</em> người. Đây chính là đơn vị điểm LOC đếm.</li>
<li><strong>Task</strong> — một việc giao cho duy nhất một thành viên (thường tự tạo cho mình): "viết SRS màn Login".</li>
<li><strong>Q&amp;A</strong> — câu hỏi cần thầy/cô (PO) làm rõ hoặc xác nhận.</li>
<li><strong>Defect</strong> — lỗi tài liệu hoặc code do <em>chính nhóm</em> tự phát hiện.</li>
<li><strong>Leakage</strong> — lỗi do khách hàng/giảng viên phát hiện qua review, test <em>sau khi</em> nộp.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Defect và Leakage là một thước đo chất lượng.</strong> Nhiều Defect + ít Leakage = nhóm tự test kỹ. Ít Defect + nhiều Leakage = nhóm nộp màn hình chưa test, và thầy/cô hạ hệ số Quality Q.</div>`],
    ]),
    walk(S, [
      [10, 'Manage project issues 1/4 — New Req (Issues / List / New Issue)',
        `<p class="y-chinh">🎯 Every screen/function starts life as one <code>Req</code> issue: a title, a short description, an owner, a milestone.</p>
<p class="nhan">The fields that matter in the form</p>
<ul>
<li><strong>Title</strong> — the screen/function name, e.g. "User Register".</li>
<li><strong>Description</strong> — one or two lines: "Brief description for the screen/function User Register". The full spec lives in the RDS, not here.</li>
<li><strong>Assignees</strong> — exactly one person (a Req belongs to one member).</li>
<li><strong>Milestone</strong> — the iteration it is planned in.</li>
<li><strong>Labels</strong> — <code>Req</code> (+ a status label once work starts).</li>
<li><strong>Due date</strong> — optional, useful inside a 6-slot iteration.</li>
</ul>
<p class="ghi-chu">Weight, Epic and Iteration are GitLab paid/extra features — the course does not use them. Leave "confidential" unticked so the teacher sees the issue.</p>`,
        `<p class="y-chinh">🎯 Mỗi màn hình/chức năng bắt đầu bằng một issue <code>Req</code>: tiêu đề, mô tả ngắn, người phụ trách, milestone.</p>
<p class="nhan">Những trường quan trọng trong form</p>
<ul>
<li><strong>Title</strong> — tên màn hình/chức năng, vd "User Register".</li>
<li><strong>Description</strong> — một hai dòng: "Brief description for the screen/function User Register". Đặc tả đầy đủ nằm trong RDS, không phải ở đây.</li>
<li><strong>Assignees</strong> — đúng một người (một Req thuộc về một thành viên).</li>
<li><strong>Milestone</strong> — iteration dự kiến làm.</li>
<li><strong>Labels</strong> — <code>Req</code> (+ một label trạng thái khi bắt đầu làm).</li>
<li><strong>Due date</strong> — không bắt buộc, hữu ích trong một iteration chỉ 6 slot.</li>
</ul>
<p class="ghi-chu">Weight, Epic và Iteration là tính năng trả phí/phụ của GitLab — môn học không dùng. Để trống ô "confidential" để thầy/cô xem được issue.</p>`],
      [11, 'Manage project issues 2/4 — Issues List (import, search/filter, export, bulk edit)',
        `<p class="y-chinh">🎯 The list view is where you find, filter and bulk-edit issues — and where the teacher checks who did what.</p>
<p class="nhan">What you can do here</p>
<ul>
<li><strong>Import</strong> issues from CSV — handy to create all Req issues at once from the Product sheet.</li>
<li><strong>Search / filter</strong> by assignee, label, milestone; sort by created date.</li>
<li><strong>Export</strong> the list (CSV) — useful when filling the Project Tracking file.</li>
<li><strong>Bulk edit</strong> — tick several issues, then "Update all": status, assignee, milestone, labels.</li>
</ul>
<p><strong>Read the example:</strong> #1 "User Login Screen" (the screen, still To Do), #2 "Write SRS for User Login screen" (Task, Done), #3 "Write SDS for User Login screen" (Task, Doing). One screen = one Req + its Tasks. The demo project labels the screen <code>WP</code> (work product) — the class scheme on slide 9 calls it <code>Req</code>.</p>`,
        `<p class="y-chinh">🎯 Danh sách là nơi tìm, lọc và sửa hàng loạt issue — và là nơi thầy/cô kiểm tra ai làm gì.</p>
<p class="nhan">Làm được gì ở đây</p>
<ul>
<li><strong>Import</strong> issue từ CSV — tiện để tạo toàn bộ Req một lượt từ sheet Product.</li>
<li><strong>Tìm / lọc</strong> theo assignee, label, milestone; sắp xếp theo ngày tạo.</li>
<li><strong>Export</strong> danh sách (CSV) — tiện khi điền file Project Tracking.</li>
<li><strong>Sửa hàng loạt</strong> — tích nhiều issue rồi "Update all": trạng thái, assignee, milestone, label.</li>
</ul>
<p><strong>Đọc ví dụ:</strong> #1 "User Login Screen" (màn hình, vẫn To Do), #2 "Write SRS for User Login screen" (Task, Done), #3 "Write SDS for User Login screen" (Task, Doing). Một màn hình = một Req + các Task của nó. Project demo gắn màn hình bằng label <code>WP</code> (work product) — bộ label của lớp ở slide 9 gọi là <code>Req</code>.</p>`],
      [12, 'Manage project issues 3/4 — Issues Board (board view by status)',
        `<p class="y-chinh">🎯 The board turns the status labels into columns — the team's daily stand-up screen.</p>
<p class="nhan">Columns in the screenshot</p>
<ol>
<li><strong>Open</strong> — no status label yet</li>
<li><strong>1_To Do</strong> — "Write Code for User Login screen"</li>
<li><strong>2_Doing</strong> — "User Login Screen", "Write SDS for User Login screen"</li>
<li><strong>3_Done</strong> — "Write SRS for User Login screen"</li>
<li><strong>Closed</strong> — "Integrate User Login screen with others"</li>
</ol>
<p class="nhan">From this page a member can</p>
<ul>
<li><strong>Filter</strong> by assignee, label, milestone — "show only my cards in iter2".</li>
<li><strong>Quick-create</strong> an issue directly in a column.</li>
<li><strong>Drag &amp; drop</strong> a card to change its status (the label changes) and its priority (its position).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a card that sits in 2_Doing for the whole iteration is the first thing the teacher asks about.</p>`,
        `<p class="y-chinh">🎯 Board biến các label trạng thái thành cột — màn hình họp đứng (stand-up) hằng ngày của nhóm.</p>
<p class="nhan">Các cột trong ảnh</p>
<ol>
<li><strong>Open</strong> — chưa có label trạng thái</li>
<li><strong>1_To Do</strong> — "Write Code for User Login screen"</li>
<li><strong>2_Doing</strong> — "User Login Screen", "Write SDS for User Login screen"</li>
<li><strong>3_Done</strong> — "Write SRS for User Login screen"</li>
<li><strong>Closed</strong> — "Integrate User Login screen with others"</li>
</ol>
<p class="nhan">Ở trang này thành viên có thể</p>
<ul>
<li><strong>Lọc</strong> theo assignee, label, milestone — "chỉ hiện thẻ của tôi trong iter2".</li>
<li><strong>Tạo nhanh</strong> issue ngay trong một cột.</li>
<li><strong>Kéo &amp; thả</strong> thẻ để đổi trạng thái (label đổi theo) và độ ưu tiên (vị trí trong cột).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> thẻ nằm lì ở 2_Doing suốt cả iteration là thứ đầu tiên thầy/cô hỏi tới.</p>`],
    ]),
    walk(S, [
      [13, 'Manage project issues 4/4 — Issue Details (history, comments, links, attributes)',
        `<p class="y-chinh">🎯 An issue's detail page is its audit trail: every change of label, milestone or due date is recorded with who and when.</p>
<p class="nhan">Reading the screenshot — issue #5 "Integrate User Login screen with others"</p>
<ul>
<li><strong>Status</strong> — Closed (it can be reopened).</li>
<li><strong>Linked issues</strong> — #1 "User Login Screen": the integration task is linked to its Req.</li>
<li><strong>Activity</strong> — due date set, milestone changed to Iteration 1, label <code>Task</code> added, label <code>1_To Do</code> removed.</li>
<li><strong>Sidebar</strong> — assignee, labels, milestone ("expired" once the iteration ended), due date, time tracking.</li>
</ul>
<p class="nhan">Why it matters for your grade</p>
<ul>
<li><strong>Evidence of individual work</strong> — the history shows who moved what, and when.</li>
<li><strong>Comments</strong> — the place to record reviews and the teacher's answers.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang chi tiết issue là "nhật ký kiểm toán": mọi thay đổi label, milestone, hạn chót đều ghi lại ai đổi và lúc nào.</p>
<p class="nhan">Đọc ảnh chụp — issue #5 "Integrate User Login screen with others"</p>
<ul>
<li><strong>Trạng thái</strong> — Closed (có thể mở lại).</li>
<li><strong>Linked issues</strong> — #1 "User Login Screen": việc tích hợp được liên kết với Req của nó.</li>
<li><strong>Activity</strong> — đặt hạn, đổi milestone sang Iteration 1, thêm label <code>Task</code>, gỡ label <code>1_To Do</code>.</li>
<li><strong>Thanh bên</strong> — assignee, label, milestone ("expired" khi iteration đã hết), hạn chót, theo dõi thời gian.</li>
</ul>
<p class="nhan">Vì sao nó ảnh hưởng tới điểm</p>
<ul>
<li><strong>Bằng chứng đóng góp cá nhân</strong> — lịch sử cho thấy ai đã đổi gì, lúc nào.</li>
<li><strong>Bình luận</strong> — nơi ghi lại review và câu trả lời của thầy/cô.</li>
</ul>`],
      [14, 'Manage git tags — New Tag (Project Information / Repository / Tags)',
        `<p class="y-chinh">🎯 The tag is the exact snapshot of code you submit for an iteration — the teacher grades the tag, not your laptop.</p>
<p class="nhan">The New Tag form</p>
<ul>
<li><strong>Tag name</strong> — e.g. <code>iter1</code>, <code>iter2</code>, <code>iter3</code>.</li>
<li><strong>Create from</strong> — a branch, tag or commit SHA; normally <code>main</code>.</li>
<li><strong>Message</strong> — optional; leaving it blank creates a <em>lightweight</em> tag, filling it creates an <em>annotated</em> tag (with author and date) — prefer annotated.</li>
<li><strong>Release notes</strong> — optional; creates a Release page.</li>
</ul>
<p class="nhan">After creating it you can</p>
<ol>
<li><strong>Copy the tag URL</strong> from the address bar — this is the link you submit.</li>
<li><strong>Attach or change files</strong> for the tag (e.g. the DB script, the RDS export).</li>
</ol>`,
        `<p class="y-chinh">🎯 Tag là bản chụp chính xác của code bạn nộp cho một iteration — thầy/cô chấm tag, không chấm máy của bạn.</p>
<p class="nhan">Form New Tag</p>
<ul>
<li><strong>Tag name</strong> — vd <code>iter1</code>, <code>iter2</code>, <code>iter3</code>.</li>
<li><strong>Create from</strong> — một branch, tag hoặc SHA của commit; thường là <code>main</code>.</li>
<li><strong>Message</strong> — không bắt buộc; để trống tạo tag <em>lightweight</em>, có nội dung tạo tag <em>annotated</em> (có tác giả, ngày) — nên dùng annotated.</li>
<li><strong>Release notes</strong> — không bắt buộc; tạo thêm trang Release.</li>
</ul>
<p class="nhan">Sau khi tạo, bạn có thể</p>
<ol>
<li><strong>Chép URL của tag</strong> trên thanh địa chỉ — đây là link để nộp.</li>
<li><strong>Đính kèm hoặc đổi file</strong> cho tag (vd script CSDL, bản xuất RDS).</li>
</ol>`],
      [15, 'Q&A — end of the Subject Guides',
        `<p class="y-chinh">🎯 The deck ends with questions — use them to settle the rules that the slides leave open.</p>
<p class="nhan">Five questions worth asking in week 1</p>
<ol>
<li>Which MaxLOC table applies this semester — 180/240/660 or 240/240/720?</li>
<li>Is the package worth 30% (or 40% in iteration 3), or is it a deduction of up to 10%?</li>
<li>Is a LOC grade above 10 capped?</li>
<li>Which framework and DBMS are allowed (plain JSP/Servlet? Spring Boot? MySQL only?)</li>
<li>Where and when is each iteration submitted — EduNext, CMS, Slack, e-mail?</li>
</ol>`,
        `<p class="y-chinh">🎯 Bộ slide khép lại bằng phần hỏi đáp — hãy dùng nó để chốt những luật mà slide còn bỏ ngỏ.</p>
<p class="nhan">Năm câu nên hỏi ngay tuần 1</p>
<ol>
<li>Học kỳ này dùng bảng MaxLOC nào — 180/240/660 hay 240/240/720?</li>
<li>Package được tính 30% (hay 40% ở iteration 3), hay chỉ trừ tối đa 10%?</li>
<li>Điểm LOC trên 10 có bị chặn không?</li>
<li>Được dùng framework và DBMS nào (JSP/Servlet thuần? Spring Boot? chỉ MySQL?)</li>
<li>Mỗi iteration nộp ở đâu, lúc nào — EduNext, CMS, Slack, email?</li>
</ol>`],
    ]),
    bi(`<h3>Worked example — the issues of one iteration</h3>
<p>A 5-member Job Board team plans iteration 2. For member B's screen <em>Post a job</em> the project holds:</p>
<table>
<thead><tr><th>#</th><th>Title</th><th>Labels</th><th>Assignee</th><th>Milestone</th></tr></thead>
<tbody>
<tr><td>41</td><td>Post a job</td><td>Req · 2_Doing</td><td>B</td><td>iter2</td></tr>
<tr><td>42</td><td>Write SRS — Post a job</td><td>Task · 3_Done</td><td>B</td><td>iter2</td></tr>
<tr><td>43</td><td>Write SDS — Post a job</td><td>Task · 2_Doing</td><td>B</td><td>iter2</td></tr>
<tr><td>44</td><td>Code — Post a job</td><td>Task · 1_To Do</td><td>B</td><td>iter2</td></tr>
<tr><td>45</td><td>Can a recruiter edit a job after someone applied?</td><td>Q&amp;A</td><td>B</td><td>iter2</td></tr>
<tr><td>46</td><td>Salary max accepts a value below salary min</td><td>Defect</td><td>B</td><td>iter2</td></tr>
</tbody>
</table>
<p class="nhan">Conventions that make the teacher's job easy</p>
<ul>
<li><strong>Req title = the screen name</strong> exactly as in the Product sheet — so the two can be matched line by line.</li>
<li><strong>Link</strong> the Tasks, the Q&amp;A and the Defect to the Req (Linked issues, slide 13).</li>
<li><strong>Answer Q&amp;A in the issue</strong> — write the teacher's decision there and copy it into the RDS.</li>
<li><strong>Close with a commit</strong> — a commit message "Post a job: validate salary range (closes #46)" closes the issue automatically when it reaches <code>main</code>.</li>
</ul>
<h3>Tagging the iteration — step by step</h3>
<ol>
<li>Everyone merges into <code>main</code>; the leader pulls and runs the whole app once.</li>
<li>Check the DB script (create + sample data) and config files are committed.</li>
<li>Create the tag: Repository → Tags → New tag, name <code>iter2</code>, from <code>main</code>, with a message (or <code>git tag -a iter2 -m "Iteration 2 submission"</code> then <code>git push origin iter2</code>).</li>
<li>Open the tag, copy its URL from the address bar, paste it into the links file.</li>
</ol>
<div class="callout"><strong>★ Beyond the syllabus — a tag is a promise not to move.</strong> Never delete and re-create a tag after submitting: the teacher may already have cloned it, and a moved tag makes "what was graded" impossible to reproduce. Fixes after the deadline go into the next iteration's tag. In industry the same rule protects every release (Semantic Versioning: <code>v1.2.0</code>).</div>`,
    `<h3>Ví dụ — các issue của một iteration</h3>
<p>Nhóm Job Board 5 người lên kế hoạch iteration 2. Với màn hình <em>Đăng tin tuyển</em> của thành viên B, project có:</p>
<table>
<thead><tr><th>#</th><th>Tiêu đề</th><th>Label</th><th>Assignee</th><th>Milestone</th></tr></thead>
<tbody>
<tr><td>41</td><td>Post a job</td><td>Req · 2_Doing</td><td>B</td><td>iter2</td></tr>
<tr><td>42</td><td>Write SRS — Post a job</td><td>Task · 3_Done</td><td>B</td><td>iter2</td></tr>
<tr><td>43</td><td>Write SDS — Post a job</td><td>Task · 2_Doing</td><td>B</td><td>iter2</td></tr>
<tr><td>44</td><td>Code — Post a job</td><td>Task · 1_To Do</td><td>B</td><td>iter2</td></tr>
<tr><td>45</td><td>Recruiter có được sửa tin khi đã có người ứng tuyển?</td><td>Q&amp;A</td><td>B</td><td>iter2</td></tr>
<tr><td>46</td><td>Lương tối đa nhận giá trị nhỏ hơn lương tối thiểu</td><td>Defect</td><td>B</td><td>iter2</td></tr>
</tbody>
</table>
<p class="nhan">Quy ước giúp thầy/cô chấm dễ</p>
<ul>
<li><strong>Tiêu đề Req = tên màn hình</strong> đúng như trong sheet Product — để đối chiếu từng dòng.</li>
<li><strong>Liên kết</strong> các Task, Q&amp;A và Defect với Req (Linked issues, slide 13).</li>
<li><strong>Trả lời Q&amp;A ngay trong issue</strong> — ghi quyết định của thầy/cô ở đó rồi chép vào RDS.</li>
<li><strong>Đóng bằng commit</strong> — commit message "Post a job: validate salary range (closes #46)" tự đóng issue khi vào tới <code>main</code>.</li>
</ul>
<h3>Gắn tag cho iteration — từng bước</h3>
<ol>
<li>Mọi người merge vào <code>main</code>; trưởng nhóm pull về và chạy thử cả ứng dụng một lượt.</li>
<li>Kiểm tra script CSDL (tạo bảng + dữ liệu mẫu) và file cấu hình đã được commit.</li>
<li>Tạo tag: Repository → Tags → New tag, tên <code>iter2</code>, từ <code>main</code>, kèm message (hoặc <code>git tag -a iter2 -m "Iteration 2 submission"</code> rồi <code>git push origin iter2</code>).</li>
<li>Mở tag, chép URL trên thanh địa chỉ, dán vào file link.</li>
</ol>
<div class="callout"><strong>★ Ngoài giáo trình — tag là lời hứa không di chuyển.</strong> Đừng bao giờ xoá rồi tạo lại tag sau khi nộp: thầy/cô có thể đã clone rồi, và tag bị dời khiến "bản nào đã được chấm" không thể tái hiện. Sửa sau hạn thì đưa vào tag của iteration sau. Ngoài doanh nghiệp, chính quy tắc này bảo vệ mọi bản phát hành (Semantic Versioning: <code>v1.2.0</code>).</div>`),
    books([
      ['progit', 'ch. 2.6 (Tagging) and ch. 3 (branching and merging)', 'chương 2.6 (Tagging) và chương 3 (branch và merge)'],
      ['sommerville', 'ch. 25 (configuration management — version and release management)', 'chương 25 (quản lý cấu hình — quản lý phiên bản và phát hành)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 0.4 Student Guides ───────────────────────── */
const L04 = {
  title: '0.4 — The Student Guides deck: what is the same, what is different|||0.4 — Bộ Student Guides: chỗ nào giống, chỗ nào khác',
  slug: 'swp391-0-4-student-guides',
  type: 'VIDEO',
  description: 'SWP391 Student Guides slide 1–19: đối chiếu từng trang với Subject Guides (CMS vs EduNext, 3 vs 3–4 màn hình, sheet Use Cases/Product, LOC 70% + package 30%, MaxLOC 240/240/720) và 4 trang Git riêng: thiết lập, commit/push, xử lý xung đột.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.4 · SWP391 Student Guides pages 1–19</span>
<h2>The Student Guides — same course, a few rules changed</h2>
<p class="lead">Your folder contains a second deck, <em>SWP391 Student Guides</em>. Pages 2–7 repeat the Subject Guides with small but important changes; pages 8–11 are new (Git commands); pages 12–19 repeat the tracking pages. This lesson explains only what is new and lists <strong>every</strong> difference.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Name every difference between the two decks and know which one to follow.</li>
<li>Set up a local repository, commit, push and resolve a merge conflict with the commands on pages 8–11.</li>
</ul></div>
<h3>All differences at a glance</h3>
<table>
<thead><tr><th>Topic</th><th>Subject Guides (15 pages)</th><th>Student Guides (19 pages)</th></tr></thead>
<tbody>
<tr><td>Code &amp; issues</td><td>GitLab <em>or</em> GitHub</td><td>GitLab, FPT e-mail account</td></tr>
<tr><td>Documents</td><td>Google Drive <em>or</em> OneDrive</td><td>OneDrive, FPT account</td></tr>
<tr><td>Where templates live</td><td>EduNext</td><td>CMS</td></tr>
<tr><td>Product size</td><td>3 screens per member per iteration <em>on average</em></td><td>3–4 screens per member per iteration</td></tr>
<tr><td>Teacher on Slack</td><td>shares reference materials</td><td>also posts the <em>input requirements</em></td></tr>
<tr><td>Project Tracking sheets</td><td>RMS + iterX + iter[X+1]</td><td>"Use Cases" + "Product"</td></tr>
<tr><td>Links</td><td>in a text file</td><td>tagged code on GitLab + videos</td></tr>
<tr><td>LOC</td><td>"via code demo", no weight given</td><td><strong>70%</strong> of the iteration grade</td></tr>
<tr><td>MaxLOC iter1 / 2 / 3</td><td><strong>180 / 240 / 660</strong></td><td><strong>240 / 240 / 720</strong></td></tr>
<tr><td>Materials</td><td>code + RDS quality; deduction up to 10%</td><td>package <strong>30%</strong>: code, DB script, RDS</td></tr>
<tr><td>Final presentation</td><td>team 20% · product 40% · requirement 20% · design 20%</td><td>LOC grade over 720 (all screens) + package/documents + product presentation</td></tr>
<tr><td>Git commands</td><td>—</td><td>pages 8–11 (setup, update, conflicts)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Which one is right?</strong> Both are official decks from different semesters. The rule on page 3 of each is the answer: "the latest templates &amp; guides as in EduNext/CMS". Download your class's current file in week 1 and write the MaxLOC and weights into your team's plan.</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.4 · SWP391 Student Guides trang 1–19</span>
<h2>Student Guides — cùng môn học, vài luật đã đổi</h2>
<p class="lead">Thư mục của bạn có thêm bộ <em>SWP391 Student Guides</em>. Trang 2–7 lặp lại Subject Guides với vài thay đổi nhỏ nhưng quan trọng; trang 8–11 là mới (lệnh Git); trang 12–19 lặp lại phần theo dõi dự án. Bài này chỉ giải thích cái mới và liệt kê <strong>mọi</strong> điểm khác.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Kể ra mọi điểm khác nhau giữa hai bộ và biết theo bộ nào.</li>
<li>Dựng repository trên máy, commit, push và gỡ xung đột merge bằng các lệnh ở trang 8–11.</li>
</ul></div>
<h3>Mọi điểm khác nhau trong một bảng</h3>
<table>
<thead><tr><th>Chủ đề</th><th>Subject Guides (15 trang)</th><th>Student Guides (19 trang)</th></tr></thead>
<tbody>
<tr><td>Code &amp; issue</td><td>GitLab <em>hoặc</em> GitHub</td><td>GitLab, tài khoản email FPT</td></tr>
<tr><td>Tài liệu</td><td>Google Drive <em>hoặc</em> OneDrive</td><td>OneDrive, tài khoản FPT</td></tr>
<tr><td>Template đặt ở đâu</td><td>EduNext</td><td>CMS</td></tr>
<tr><td>Cỡ sản phẩm</td><td><em>trung bình</em> 3 màn hình/người/iteration</td><td>3–4 màn hình/người/iteration</td></tr>
<tr><td>Giảng viên trên Slack</td><td>chia sẻ tài liệu tham khảo</td><td>đăng cả <em>yêu cầu đầu vào</em></td></tr>
<tr><td>Sheet Project Tracking</td><td>RMS + iterX + iter[X+1]</td><td>"Use Cases" + "Product"</td></tr>
<tr><td>Các link</td><td>trong một file text</td><td>code đã tag trên GitLab + video</td></tr>
<tr><td>LOC</td><td>"qua demo code", không ghi trọng số</td><td><strong>70%</strong> điểm iteration</td></tr>
<tr><td>MaxLOC iter1 / 2 / 3</td><td><strong>180 / 240 / 660</strong></td><td><strong>240 / 240 / 720</strong></td></tr>
<tr><td>Tài liệu nộp</td><td>chất lượng code + RDS; trừ tối đa 10%</td><td>package <strong>30%</strong>: code, script CSDL, RDS</td></tr>
<tr><td>Thuyết trình cuối</td><td>nhóm 20% · sản phẩm 40% · yêu cầu 20% · thiết kế 20%</td><td>điểm LOC trên 720 (mọi màn hình) + package/tài liệu + trình bày sản phẩm</td></tr>
<tr><td>Lệnh Git</td><td>—</td><td>trang 8–11 (thiết lập, cập nhật, xung đột)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Bản nào đúng?</strong> Cả hai đều là slide chính thức của các học kỳ khác nhau. Câu trả lời nằm ở trang 3 của mỗi bộ: "template &amp; hướng dẫn mới nhất trên EduNext/CMS". Tuần 1 hãy tải đúng file hiện hành của lớp mình và ghi MaxLOC cùng trọng số vào kế hoạch của nhóm.</div>`),
    walkHead(T, 1, 19, 'Pages that repeat the Subject Guides get a short card with the differences only.', 'Trang nào lặp lại Subject Guides chỉ có thẻ ngắn ghi điểm khác.'),
    walk(T, [
      [1, 'SWP391 Student Guides — title page',
        `<p class="y-chinh">🎯 The students' version of the rulebook: 19 pages, of which 4 are new.</p>
<ul>
<li><strong>Pages 2–7</strong> — overview, inputs, milestones, tasks, submit items, criteria (≈ Subject Guides 2–7, with changes).</li>
<li><strong>Pages 8–11</strong> — <em>Git Guides</em>, written in Vietnamese: setup, update, conflicts. New.</li>
<li><strong>Pages 12–18</strong> — tracking &amp; monitoring (= Subject Guides 8–14).</li>
<li><strong>Page 19</strong> — Q&amp;A.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bản "luật chơi" dành cho sinh viên: 19 trang, trong đó 4 trang là mới.</p>
<ul>
<li><strong>Trang 2–7</strong> — tổng quan, đầu vào, milestone, nhiệm vụ, bộ nộp, tiêu chí (≈ Subject Guides 2–7, có thay đổi).</li>
<li><strong>Trang 8–11</strong> — <em>Git Guides</em>, viết bằng tiếng Việt: thiết lập, cập nhật, xung đột. Mới.</li>
<li><strong>Trang 12–18</strong> — theo dõi &amp; giám sát (= Subject Guides 8–14).</li>
<li><strong>Trang 19</strong> — Q&amp;A.</li>
</ul>`],
      [2, 'Subject Overview — GitLab, OneDrive, Slack with the FPT account',
        `<p class="y-chinh">🎯 Same goal, team, scope and stack as Subject Guides page 2 — but the tools are fixed, not optional.</p>
<p class="nhan">Differences</p>
<ul>
<li><strong>GitLab only</strong> (not "GitLab or GitHub"), log in with the FPT e-mail.</li>
<li><strong>OneDrive only</strong> (not "Google Drive or OneDrive").</li>
<li><strong>Slack</strong> with the FPT account.</li>
</ul>
<p class="ghi-chu">Unchanged: web management system, 4–5 students, requirement → design → code → integrate, MailTrap, Java/NetBeans 13/MySQL 8 or .NET (not recommended).</p>`,
        `<p class="y-chinh">🎯 Mục tiêu, nhóm, phạm vi và stack giống Subject Guides trang 2 — nhưng công cụ là cố định, không được chọn.</p>
<p class="nhan">Điểm khác</p>
<ul>
<li><strong>Chỉ GitLab</strong> (không phải "GitLab hoặc GitHub"), đăng nhập bằng email FPT.</li>
<li><strong>Chỉ OneDrive</strong> (không phải "Google Drive hoặc OneDrive").</li>
<li><strong>Slack</strong> bằng tài khoản FPT.</li>
</ul>
<p class="ghi-chu">Giữ nguyên: hệ thống web quản lý, 4–5 sinh viên, yêu cầu → thiết kế → code → tích hợp, MailTrap, Java/NetBeans 13/MySQL 8 hoặc .NET (không khuyến khích).</p>`],
      [3, 'Inputs & Requirements — templates in CMS, 3–4 screens per member per iteration',
        `<p class="y-chinh">🎯 Same page as Subject Guides 3, with a stricter size rule.</p>
<p class="nhan">Differences</p>
<ul>
<li><strong>CMS</strong> instead of EduNext for templates and "SWP391 General Information".</li>
<li><strong>3–4 different screens/functions</strong> per member per iteration, instead of "3 on average".</li>
</ul>
<p>For a 5-member team that is 45–60 screens in total (lesson 0.7 shows how to reach it).</p>`,
        `<p class="y-chinh">🎯 Giống Subject Guides trang 3, nhưng quy tắc cỡ chặt hơn.</p>
<p class="nhan">Điểm khác</p>
<ul>
<li><strong>CMS</strong> thay cho EduNext để lấy template và "SWP391 General Information".</li>
<li><strong>3–4 màn hình/chức năng khác nhau</strong> mỗi người mỗi iteration, thay vì "trung bình 3".</li>
</ul>
<p>Với nhóm 5 người là tổng cộng 45–60 màn hình (bài 0.7 hướng dẫn cách đạt tới).</p>`],
      [4, 'Milestones & Evaluations — identical to Subject Guides page 4',
        `<p class="y-chinh">🎯 No change: 3 iterations of 6 slots (15 / 20 / 25%), final presentation 2 slots (40%), the same four pass conditions.</p>
<ul>
<li><strong>Pass</strong> — attendance ≥ 80%, OG ≥ 5, Final Presentation ≥ 5, no cheating.</li>
<li><strong>OG</strong> = (iter1·15% + iter2·20% + iter3·25%) / 60%.</li>
</ul>
<p class="ghi-chu">Explained in full in lesson 0.2 (Subject Guides slide 4).</p>`,
        `<p class="y-chinh">🎯 Không đổi: 3 iteration mỗi cái 6 slot (15 / 20 / 25%), thuyết trình 2 slot (40%), cùng bốn điều kiện qua môn.</p>
<ul>
<li><strong>Qua môn</strong> — đi học ≥ 80%, OG ≥ 5, Final Presentation ≥ 5, không gian lận.</li>
<li><strong>OG</strong> = (iter1·15% + iter2·20% + iter3·25%) / 60%.</li>
</ul>
<p class="ghi-chu">Giải thích đầy đủ ở bài 0.2 (Subject Guides slide 4).</p>`],
    ]),
    walk(T, [
      [5, 'Main student & teacher tasks — GitLab, and the teacher posts the input requirements',
        `<p class="y-chinh">🎯 Same roles as Subject Guides page 5: the teacher is coach and customer/PO; students own their screens and build the shared parts together.</p>
<p class="nhan">Differences</p>
<ul>
<li><strong>Slack</strong> — the teacher also posts the <em>input requirements</em> in the channel (not only reference links).</li>
<li><strong>GitLab</strong> — "GitLab group / repositories" where the other deck says "Git".</li>
<li><strong>Student task</strong> — "complete detailed documentation" instead of "requirement and design specification documentation": the same RDS, worded more generally.</li>
</ul>`,
        `<p class="y-chinh">🎯 Vai trò giống Subject Guides trang 5: giảng viên là coach và khách hàng/PO; sinh viên sở hữu màn hình của mình và cùng làm phần chung.</p>
<p class="nhan">Điểm khác</p>
<ul>
<li><strong>Slack</strong> — thầy/cô đăng cả <em>yêu cầu đầu vào</em> lên kênh (không chỉ link tham khảo).</li>
<li><strong>GitLab</strong> — ghi rõ "GitLab group / repository" ở chỗ bộ kia ghi "Git".</li>
<li><strong>Việc của sinh viên</strong> — "hoàn thiện tài liệu chi tiết" thay cho "tài liệu đặc tả yêu cầu và thiết kế": vẫn là RDS, chỉ diễn đạt chung hơn.</li>
</ul>`],
      [6, 'Iteration Submit Items — sheets "Use Cases" and "Product", links on GitLab',
        `<p class="y-chinh">🎯 Same three deliverables as Subject Guides page 6, but the Project Tracking file uses the new sheet layout.</p>
<p class="nhan">Differences</p>
<ul>
<li><strong>Sheets "Use Cases" and "Product"</strong> (screens) replace RMS / iterX / iter[X+1]. The Product sheet carries, per screen, the iteration it is planned in and its status.</li>
<li><strong>Three things to show</strong> — the updated product scope, the status of the screens done in this iteration, the screens planned/assigned for the next one.</li>
<li><strong>Links</strong> — the tagged source code "on the GitLab"; no mention of a text file.</li>
</ul>
<p class="ghi-chu">Same: RDS with this iteration's specs + updates, one demo video per member, DB script and config inside the tagged code, the initial scope + iter1 plan before iteration 1.</p>`,
        `<p class="y-chinh">🎯 Vẫn ba sản phẩm nộp như Subject Guides trang 6, nhưng file Project Tracking dùng bố cục sheet mới.</p>
<p class="nhan">Điểm khác</p>
<ul>
<li><strong>Sheet "Use Cases" và "Product"</strong> (màn hình) thay cho RMS / iterX / iter[X+1]. Sheet Product ghi cho từng màn hình: làm ở iteration nào và trạng thái ra sao.</li>
<li><strong>Ba điều phải thể hiện</strong> — phạm vi sản phẩm đã cập nhật, trạng thái các màn hình làm trong iteration này, các màn hình dự kiến/giao cho iteration sau.</li>
<li><strong>Link</strong> — code đã tag "trên GitLab"; không nhắc tới file text.</li>
</ul>
<p class="ghi-chu">Giữ nguyên: RDS gồm đặc tả của iteration này + phần cập nhật, mỗi thành viên một video demo, script CSDL và cấu hình nằm trong bản code đã tag, phạm vi ban đầu + kế hoạch iter1 nộp trước iteration 1.</p>`],
      [7, 'Evaluation Criteria — LOC 70% + package 30%, MaxLOC 240/240/720',
        `<p class="y-chinh">🎯 Same Converted-LOC = C × Q with the same C and Q values — but different weights and a different MaxLOC.</p>
<p class="nhan">Differences from Subject Guides page 7</p>
<ul>
<li><strong>LOC weight 70%</strong>, evaluated individually (the words "via code demo" are gone, but the demo is still how the teacher sees your screens).</li>
<li><strong>MaxLOC = 240 for iterations 1 and 2, 720 for iteration 3</strong> (instead of 180 / 240 / 660).</li>
<li><strong>Submitted Package 30%</strong> — source code, <em>DB script</em> and the RDS. The "deduction of up to 10%" rule is gone.</li>
<li><strong>Final presentation</strong> — listed as: LOC grade = Converted-LOC × 10 / 720 over <em>all</em> screens, the submitted software package/documents, and the product presentation. The 20/40/20/20 split is not on this page.</li>
</ul>
<p><strong>Effect:</strong> in the worked example of lesson 0.2 the same 180 LOC gives 10.0 under the Subject Guides and 7.5 under the Student Guides for iteration 1.</p>`,
        `<p class="y-chinh">🎯 Vẫn Converted-LOC = C × Q với cùng giá trị C và Q — nhưng trọng số và MaxLOC khác.</p>
<p class="nhan">Khác với Subject Guides trang 7</p>
<ul>
<li><strong>LOC chiếm 70%</strong>, chấm từng người (bỏ chữ "via code demo", nhưng thầy/cô vẫn xem màn hình của bạn qua demo).</li>
<li><strong>MaxLOC = 240 cho iteration 1 và 2, 720 cho iteration 3</strong> (thay vì 180 / 240 / 660).</li>
<li><strong>Submitted Package 30%</strong> — source code, <em>script CSDL</em> và RDS. Không còn luật "trừ tối đa 10%".</li>
<li><strong>Thuyết trình cuối</strong> — ghi là: điểm LOC = Converted-LOC × 10 / 720 trên <em>mọi</em> màn hình, gói phần mềm/tài liệu đã nộp, và phần trình bày sản phẩm. Trang này không có tỷ lệ 20/40/20/20.</li>
</ul>
<p><strong>Hệ quả:</strong> trong ví dụ ở bài 0.2, cùng 180 LOC cho điểm 10,0 theo Subject Guides nhưng chỉ 7,5 theo Student Guides ở iteration 1.</p>`],
    ]),
    walk(T, [
      [8, 'Git Guides — Thiết lập môi trường (setting up)',
        `<p class="y-chinh">🎯 Seven steps to get a working copy of the team repository on your machine.</p>
<ol>
<li><strong>Leader invites</strong> the members to the GitLab project.</li>
<li><strong>Log in</strong> to GitLab with Google (FPT account), then set a GitLab password — needed when Git asks for credentials over HTTPS.</li>
<li><strong>Create a working folder</strong>, open <code>cmd</code> and <code>cd</code> into it.</li>
<li><code>git init</code> — create a local repository.</li>
<li><code>git remote add origin https://gitlab.com/&lt;group&gt;/&lt;project&gt;.git</code> — connect it to the project.</li>
<li>Enter e-mail/password in the pop-up.</li>
<li><code>git pull origin main</code> — get the latest structure and code.</li>
</ol>
<p class="nhan">Two additions the slide leaves out</p>
<ul>
<li><strong>Identity</strong> — <code>git config --global user.name</code> and <code>user.email</code> with your FPT e-mail, so commits are counted as yours.</li>
<li><strong>Shortcut</strong> — <code>git clone &lt;url&gt;</code> does steps 4–7 in one command.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bảy bước để có bản sao repository của nhóm trên máy bạn.</p>
<ol>
<li><strong>Trưởng nhóm mời</strong> các thành viên vào project GitLab.</li>
<li><strong>Đăng nhập</strong> GitLab bằng Google (tài khoản FPT), sau đó đặt mật khẩu GitLab — cần khi Git hỏi thông tin đăng nhập qua HTTPS.</li>
<li><strong>Tạo thư mục làm việc</strong>, mở <code>cmd</code> và <code>cd</code> vào đó.</li>
<li><code>git init</code> — khởi tạo repository cục bộ.</li>
<li><code>git remote add origin https://gitlab.com/&lt;group&gt;/&lt;project&gt;.git</code> — nối tới project.</li>
<li>Nhập email/mật khẩu trong cửa sổ bật lên.</li>
<li><code>git pull origin main</code> — lấy cấu trúc và code mới nhất.</li>
</ol>
<p class="nhan">Hai điều slide không ghi</p>
<ul>
<li><strong>Danh tính</strong> — <code>git config --global user.name</code> và <code>user.email</code> bằng email FPT, để commit được tính là của bạn.</li>
<li><strong>Đường tắt</strong> — <code>git clone &lt;url&gt;</code> làm bước 4–7 trong một lệnh.</li>
</ul>`],
      [9, 'Git Guides — Cập nhật, thêm mới (the daily update cycle)',
        `<p class="y-chinh">🎯 The daily loop: pull → code → build and run → add → commit → push.</p>
<ol>
<li><code>git pull origin main</code> — get the latest code first.</li>
<li><strong>Add or edit</strong> code in NetBeans 13.</li>
<li><strong>Build and run</strong> — the code must compile and run without errors before it leaves your machine.</li>
<li><code>git add .</code> — stage every change.</li>
<li><code>git commit -m "describe your change"</code></li>
<li><code>git push --set-upstream origin main</code> — the first time; afterwards <code>git push</code> is enough.</li>
</ol>
<div class="pitfall"><code>git add .</code> stages <em>everything</em>, including NetBeans build output and personal config. Add a <code>.gitignore</code> first, and run <code>git status</code> before committing.</div>`,
        `<p class="y-chinh">🎯 Vòng lặp hằng ngày: pull → code → build và chạy → add → commit → push.</p>
<ol>
<li><code>git pull origin main</code> — lấy code mới nhất trước.</li>
<li><strong>Thêm hoặc sửa</strong> code trong NetBeans 13.</li>
<li><strong>Build và chạy</strong> — code phải biên dịch và chạy không lỗi rồi mới được rời máy bạn.</li>
<li><code>git add .</code> — đưa mọi thay đổi vào stage.</li>
<li><code>git commit -m "mô tả thay đổi của bạn"</code></li>
<li><code>git push --set-upstream origin main</code> — lần đầu; các lần sau chỉ cần <code>git push</code>.</li>
</ol>
<div class="pitfall"><code>git add .</code> đưa <em>mọi thứ</em> vào, kể cả file build của NetBeans và cấu hình cá nhân. Hãy thêm <code>.gitignore</code> trước, và chạy <code>git status</code> trước khi commit.</div>`],
      [10, 'Git Guides — Xử lý xung đột 1/2 (how a conflict happens)',
        `<p class="y-chinh">🎯 A conflict happens when two developers change the same lines of the same file and push at different times.</p>
<p class="nhan">The 12 steps in the sequence diagram</p>
<ol>
<li>Developer B pulls (1); developer A pulls (2).</li>
<li>B changes <code>file07</code> (3); A changes the same line (4).</li>
<li>B commits (5); A commits (6) and pushes first (7) — accepted.</li>
<li>B pushes (8) — <strong>REJECTED</strong>: "failed to push … the remote contains work that you do not have locally".</li>
<li>B pulls (9) — <strong>CONFLICT</strong>: "Automatic merge failed; fix conflicts and then commit the result".</li>
<li>B fixes the conflict (10), adds and commits (11), pushes (12) — accepted.</li>
</ol>
<p class="nhan">Reading the merged file</p>
<ul>
<li><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> … <code>=======</code> — <em>your</em> version (<code>file7_line3</code>).</li>
<li><code>=======</code> … <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; 09cbbdd</code> — the version from the remote (<code>file7_line2</code>).</li>
</ul>
<p class="ghi-chu">The teacher's note: one developer adds "file7_line2" and pushes first; the other adds "file7_line3", pushes later and must resolve the conflict.</p>`,
        `<p class="y-chinh">🎯 Xung đột xảy ra khi hai lập trình viên sửa cùng dòng của cùng một file và push vào hai thời điểm khác nhau.</p>
<p class="nhan">12 bước trong sơ đồ tuần tự</p>
<ol>
<li>Lập trình viên B pull (1); lập trình viên A pull (2).</li>
<li>B sửa <code>file07</code> (3); A sửa đúng dòng đó (4).</li>
<li>B commit (5); A commit (6) và push trước (7) — được nhận.</li>
<li>B push (8) — <strong>REJECTED</strong>: "failed to push … remote có thay đổi mà máy bạn chưa có".</li>
<li>B pull (9) — <strong>CONFLICT</strong>: "Automatic merge failed; fix conflicts and then commit the result".</li>
<li>B sửa xung đột (10), add và commit (11), push (12) — được nhận.</li>
</ol>
<p class="nhan">Đọc file sau khi merge</p>
<ul>
<li><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> … <code>=======</code> — phiên bản <em>của bạn</em> (<code>file7_line3</code>).</li>
<li><code>=======</code> … <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; 09cbbdd</code> — phiên bản từ remote (<code>file7_line2</code>).</li>
</ul>
<p class="ghi-chu">Ghi chú của giảng viên: một người thêm "file7_line2" và push trước; người kia thêm "file7_line3", push sau và phải xử lý xung đột.</p>`],
      [11, 'Git Guides — Xử lý xung đột 2/2 (resolving it)',
        `<p class="y-chinh">🎯 Five commands resolve a conflict — the thinking happens in step 2.</p>
<ol>
<li><code>git pull origin main</code></li>
<li><strong>Edit the conflicted files by hand</strong> — keep the right content, delete the markers.</li>
<li><code>git add .</code></li>
<li><code>git commit -m "describe…"</code></li>
<li><code>git push origin main</code></li>
</ol>
<div class="pitfall co-tieu-de"><strong>Never "fix" by overwriting.</strong> Deleting the other person's lines, or <code>git push --force</code>, makes the push succeed and silently destroys a teammate's work — and his LOC. Ask the other author when you are not sure which version is right.</div>`,
        `<p class="y-chinh">🎯 Năm lệnh để gỡ xung đột — phần phải suy nghĩ nằm ở bước 2.</p>
<ol>
<li><code>git pull origin main</code></li>
<li><strong>Sửa tay các file bị xung đột</strong> — giữ nội dung đúng, xoá các dòng đánh dấu.</li>
<li><code>git add .</code></li>
<li><code>git commit -m "mô tả…"</code></li>
<li><code>git push origin main</code></li>
</ol>
<div class="pitfall co-tieu-de"><strong>Đừng bao giờ "sửa" bằng cách ghi đè.</strong> Xoá dòng của người kia, hay <code>git push --force</code>, làm lệnh push thành công và âm thầm xoá công của đồng đội — cùng với LOC của bạn ấy. Không chắc bản nào đúng thì hỏi người viết.</div>`],
    ]),
    walk(T, [
      [12, 'Tracking & Monitoring — Project milestones (= Subject Guides page 8)',
        `<p class="y-chinh">🎯 Identical to Subject Guides page 8: four group milestones iter1–iter4 of a real class.</p>
<p>Put every issue into its iteration's milestone; close issues only when really done. Full card: lesson 0.3, slide 8.</p>`,
        `<p class="y-chinh">🎯 Giống hệt Subject Guides trang 8: bốn group milestone iter1–iter4 của một lớp thật.</p>
<p>Gắn mọi issue vào milestone của iteration; chỉ đóng issue khi thật sự xong. Thẻ đầy đủ: bài 0.3, slide 8.</p>`],
      [13, 'Tracking & Monitoring — Track issue type/status with labels (= Subject Guides page 9)',
        `<p class="y-chinh">🎯 The same 8 labels: 1_To Do, 2_Doing, 3_Done · Req, Task, Q&amp;A, Defect, Leakage.</p>
<p>No difference. <strong>Req</strong> = one screen/function for one person (the LOC unit); <strong>Leakage</strong> = a bug found by the teacher after submission. Full card: lesson 0.3, slide 9.</p>`,
        `<p class="y-chinh">🎯 Cùng 8 label: 1_To Do, 2_Doing, 3_Done · Req, Task, Q&amp;A, Defect, Leakage.</p>
<p>Không khác gì. <strong>Req</strong> = một màn hình/chức năng cho một người (đơn vị tính LOC); <strong>Leakage</strong> = lỗi thầy/cô tìm ra sau khi nộp. Thẻ đầy đủ: bài 0.3, slide 9.</p>`],
      [14, 'Manage project issues 1/4 — New Req (= Subject Guides page 10)',
        `<p class="y-chinh">🎯 Same form: title = screen name, one assignee, milestone, label <code>Req</code>.</p>
<p>No difference. Full card: lesson 0.3, slide 10.</p>`,
        `<p class="y-chinh">🎯 Cùng form: tiêu đề = tên màn hình, một assignee, milestone, label <code>Req</code>.</p>
<p>Không khác gì. Thẻ đầy đủ: bài 0.3, slide 10.</p>`],
      [15, 'Manage project issues 2/4 — Issues List (= Subject Guides page 11)',
        `<p class="y-chinh">🎯 Same list view: import, search/filter, export, bulk "Update all".</p>
<p>No difference. Full card: lesson 0.3, slide 11.</p>`,
        `<p class="y-chinh">🎯 Cùng màn danh sách: import, tìm/lọc, export, sửa hàng loạt "Update all".</p>
<p>Không khác gì. Thẻ đầy đủ: bài 0.3, slide 11.</p>`],
      [16, 'Manage project issues 3/4 — Issues Board (= Subject Guides page 12)',
        `<p class="y-chinh">🎯 Same board: columns Open → 1_To Do → 2_Doing → 3_Done → Closed, filter, quick-create, drag &amp; drop.</p>
<p>No difference. Full card: lesson 0.3, slide 12.</p>`,
        `<p class="y-chinh">🎯 Cùng board: cột Open → 1_To Do → 2_Doing → 3_Done → Closed, lọc, tạo nhanh, kéo &amp; thả.</p>
<p>Không khác gì. Thẻ đầy đủ: bài 0.3, slide 12.</p>`],
      [17, 'Manage project issues 4/4 — Issue Details (= Subject Guides page 13)',
        `<p class="y-chinh">🎯 Same detail page: history, comments, linked issues, attributes.</p>
<p>No difference. Full card: lesson 0.3, slide 13.</p>`,
        `<p class="y-chinh">🎯 Cùng trang chi tiết: lịch sử, bình luận, issue liên kết, thuộc tính.</p>
<p>Không khác gì. Thẻ đầy đủ: bài 0.3, slide 13.</p>`],
      [18, 'Manage git tags — New Tag (= Subject Guides page 14)',
        `<p class="y-chinh">🎯 Same page: create the iteration tag from <code>main</code>, copy its URL, attach files.</p>
<p>No difference. Full card and step-by-step tagging: lesson 0.3, slide 14.</p>`,
        `<p class="y-chinh">🎯 Cùng trang: tạo tag iteration từ <code>main</code>, chép URL, đính kèm file.</p>
<p>Không khác gì. Thẻ đầy đủ và các bước gắn tag: bài 0.3, slide 14.</p>`],
      [19, 'Q&A — end of the Student Guides',
        `<p class="y-chinh">🎯 The closing Q&amp;A — the moment to confirm which of the two rule sets your class follows.</p>
<p>Bring the five questions from lesson 0.3 (slide 15), and add one for this deck: "Do we push straight to <code>main</code> as on pages 9–11, or use branches and merge requests?"</p>`,
        `<p class="y-chinh">🎯 Phần hỏi đáp khép lại — lúc để chốt lớp mình theo bộ luật nào trong hai bộ.</p>
<p>Mang theo năm câu hỏi ở bài 0.3 (slide 15), thêm một câu cho bộ này: "Nhóm push thẳng lên <code>main</code> như trang 9–11, hay dùng branch và merge request?"</p>`],
    ]),
    bi(`<h3>Worked example — a real conflict in a team project</h3>
<p>Two members of the Job Board team both edit the shared menu <code>header.jsp</code> on <code>main</code>. Member A adds "Post a job", pushes first. Member B adds "My applications" on the same line and pushes second:</p>
<pre>$ git push origin main
 ! [rejected]        main -&gt; main (fetch first)
$ git pull origin main
CONFLICT (content): Merge conflict in web/common/header.jsp
Automatic merge failed; fix conflicts and then commit the result.</pre>
<p>The file now contains both versions:</p>
<pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
&lt;li&gt;&lt;a href="my-applications"&gt;My applications&lt;/a&gt;&lt;/li&gt;
=======
&lt;li&gt;&lt;a href="post-job"&gt;Post a job&lt;/a&gt;&lt;/li&gt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; 09cbbdd…</pre>
<ol>
<li><strong>Decide</strong> — here both links are wanted; the Recruiter link must only show to recruiters.</li>
<li><strong>Edit</strong> — keep both lines inside the right role checks and delete the three marker lines.</li>
<li><strong>Test</strong> — run the app, log in as each role, click both links.</li>
<li><strong>Finish</strong> — <code>git add .</code> → <code>git commit -m "Merge menu: Post a job + My applications"</code> → <code>git push origin main</code>.</li>
</ol>
<p class="nhan">Habits that prevent most conflicts</p>
<ul>
<li><strong>Pull before you start and before you push</strong> — every day, as the teacher's Policies sheet requires daily merges.</li>
<li><strong>Small commits</strong> — one screen or one fix per commit.</li>
<li><strong>One owner for shared files</strong> — the header/menu/CSS are edited by one person, others ask.</li>
<li><strong>Ignore generated files</strong> — add <code>build/</code>, <code>dist/</code>, <code>nbproject/private/</code> to <code>.gitignore</code> so NetBeans files never conflict.</li>
</ul>
<div class="callout"><strong>★ Beyond the syllabus — branches and merge requests.</strong> The slides push straight to <code>main</code>. Most teams work more safely with a short branch per screen (<code>feature/post-job</code>) and a GitLab <em>merge request</em> reviewed by one teammate before it enters <code>main</code>. The conflict then appears in the merge request, not in the leader's build the night before submission. The GitLab chapter shows this flow.</div>`,
    `<h3>Ví dụ — một xung đột thật trong đồ án nhóm</h3>
<p>Hai thành viên nhóm Job Board cùng sửa menu dùng chung <code>header.jsp</code> trên <code>main</code>. Thành viên A thêm "Post a job", push trước. Thành viên B thêm "My applications" đúng dòng đó và push sau:</p>
<pre>$ git push origin main
 ! [rejected]        main -&gt; main (fetch first)
$ git pull origin main
CONFLICT (content): Merge conflict in web/common/header.jsp
Automatic merge failed; fix conflicts and then commit the result.</pre>
<p>File lúc này chứa cả hai phiên bản:</p>
<pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
&lt;li&gt;&lt;a href="my-applications"&gt;My applications&lt;/a&gt;&lt;/li&gt;
=======
&lt;li&gt;&lt;a href="post-job"&gt;Post a job&lt;/a&gt;&lt;/li&gt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; 09cbbdd…</pre>
<ol>
<li><strong>Quyết định</strong> — ở đây cần cả hai link; link của Recruiter chỉ hiện cho recruiter.</li>
<li><strong>Sửa</strong> — giữ cả hai dòng trong đúng điều kiện phân quyền và xoá ba dòng đánh dấu.</li>
<li><strong>Chạy thử</strong> — chạy app, đăng nhập từng vai trò, bấm cả hai link.</li>
<li><strong>Hoàn tất</strong> — <code>git add .</code> → <code>git commit -m "Merge menu: Post a job + My applications"</code> → <code>git push origin main</code>.</li>
</ol>
<p class="nhan">Thói quen chặn phần lớn xung đột</p>
<ul>
<li><strong>Pull trước khi bắt đầu và trước khi push</strong> — mỗi ngày, vì bảng Policies của thầy/cô bắt merge hằng ngày.</li>
<li><strong>Commit nhỏ</strong> — mỗi commit một màn hình hoặc một lần sửa.</li>
<li><strong>Một người giữ file chung</strong> — header/menu/CSS do một người sửa, người khác nhờ.</li>
<li><strong>Bỏ qua file sinh ra</strong> — thêm <code>build/</code>, <code>dist/</code>, <code>nbproject/private/</code> vào <code>.gitignore</code> để file NetBeans không bao giờ xung đột.</li>
</ul>
<div class="callout"><strong>★ Ngoài giáo trình — branch và merge request.</strong> Slide push thẳng lên <code>main</code>. Phần lớn nhóm làm an toàn hơn với một branch ngắn cho mỗi màn hình (<code>feature/post-job</code>) và một <em>merge request</em> trên GitLab được một bạn review trước khi vào <code>main</code>. Khi đó xung đột hiện ra trong merge request, chứ không phải trong bản build của trưởng nhóm vào đêm trước hạn nộp. Chương GitLab hướng dẫn luồng này.</div>`),
    books([
      ['progit', 'ch. 2 (Git basics — recording changes, remotes) and ch. 3.2 (basic merging and merge conflicts)', 'chương 2 (Git cơ bản — ghi thay đổi, remote) và chương 3.2 (merge cơ bản và xung đột)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 0.5 Outcomes & deliverables ───────────────────────── */
const L05 = {
  title: '0.5 — Learning outcomes & what you hand in each iteration|||0.5 — Chuẩn đầu ra & những gì phải nộp mỗi iteration',
  slug: 'swp391-chuan-dau-ra',
  type: 'VIDEO',
  description: '6 chuẩn đầu ra của môn gắn vào 3 iteration và rubric thuyết trình; bộ nộp mỗi iteration (Project Tracking, RDS, link video + tag) và file Project Tracking giải thích từng sheet, từng cột.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Learning outcomes &amp; what you hand in each iteration</h2>
<p class="lead">A learning outcome (CLO) is something you must be able to <em>do</em> at the end. In SWP391 each one is proven by an artifact you submit or a question you answer at the final presentation. This lesson maps the outcomes to the real grading and then walks through the submission package item by item.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Link each outcome to the iteration grade or presentation criterion that measures it.</li>
<li>Prepare a complete iteration submission without missing an item.</li>
<li>Fill every sheet and column of the Project Tracking file.</li>
</ul></div>
<h3>Six outcomes and where they are measured</h3>
<table>
<thead><tr><th>CLO</th><th>You can…</th><th>Measured by</th></tr></thead>
<tbody>
<tr><td>1</td><td>analyse and clarify requirements (AI-assisted elicitation allowed)</td><td>RDS requirement part each iteration · presentation "Requirement analysing" 20%</td></tr>
<tr><td>2</td><td>design system modules with MVC and OOP</td><td>RDS design part · presentation "Software designing" 20%</td></tr>
<tr><td>3</td><td>model data with an ERD and implement it in SQL</td><td>DB script in every tag · package grade</td></tr>
<tr><td>4</td><td>build working web screens in Java (or .NET)</td><td>Converted-LOC every iteration · presentation "product/implementation" 40%</td></tr>
<tr><td>5</td><td>work in a team, ethically, with responsible AI use</td><td>GitLab history, daily commits, AI Usage Report · presentation "team working" 20%</td></tr>
<tr><td>6</td><td>present and report the product</td><td>final presentation and Q&amp;A</td></tr>
</tbody>
</table>
<p class="ghi-chu">The six CLOs follow the FPTU syllabus wording used by this course; the "measured by" column comes from the Subject Guides (slide 7) and the 2026 templates.</p>
<h3>The iteration package — a checklist</h3>
<ol>
<li><strong>Project Tracking</strong> (xlsx) — Use Cases + Product sheets updated: this iteration's screens with status, next iteration's plan.</li>
<li><strong>RDS</strong> — requirement &amp; design of this iteration's screens, plus changes to earlier ones.</li>
<li><strong>Source code tag</strong> — <code>iterN</code> on GitLab, containing the DB script (create + sample data) and config.</li>
<li><strong>Demo videos</strong> — one per member, showing his/her screens including unhappy cases.</li>
<li><strong>Links file</strong> — the tag URL and the video links in one place.</li>
<li><strong>2026 templates, if your teacher uses them</strong> — Weekly Report (Template6) and AI Usage Report (Template5).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Iteration 1 starts with a submission.</strong> The initial product scope and the iteration 1 plan (Use Cases + Product sheets) must be submitted <em>before</em> iteration 1 begins — both decks say so on page 6.</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chuẩn đầu ra &amp; những gì phải nộp mỗi iteration</h2>
<p class="lead">Chuẩn đầu ra (CLO) là điều bạn phải <em>làm được</em> khi kết thúc môn. Ở SWP391 mỗi CLO được chứng minh bằng một sản phẩm bạn nộp hoặc một câu bạn trả lời ở buổi thuyết trình. Bài này gắn các CLO vào cách chấm thật, rồi đi qua bộ nộp từng mục một.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Gắn mỗi CLO với điểm iteration hoặc tiêu chí thuyết trình đo nó.</li>
<li>Chuẩn bị đủ bộ nộp của một iteration, không sót mục nào.</li>
<li>Điền đúng mọi sheet và mọi cột của file Project Tracking.</li>
</ul></div>
<h3>Sáu chuẩn đầu ra và nơi chúng được đo</h3>
<table>
<thead><tr><th>CLO</th><th>Bạn làm được…</th><th>Đo bằng</th></tr></thead>
<tbody>
<tr><td>1</td><td>phân tích và làm rõ yêu cầu (được dùng AI hỗ trợ thu thập)</td><td>phần yêu cầu của RDS mỗi iteration · thuyết trình "phân tích yêu cầu" 20%</td></tr>
<tr><td>2</td><td>thiết kế module hệ thống theo MVC và OOP</td><td>phần thiết kế của RDS · thuyết trình "thiết kế phần mềm" 20%</td></tr>
<tr><td>3</td><td>mô hình hoá dữ liệu bằng ERD và hiện thực bằng SQL</td><td>script CSDL trong mỗi tag · điểm package</td></tr>
<tr><td>4</td><td>xây màn hình web chạy được bằng Java (hoặc .NET)</td><td>Converted-LOC mỗi iteration · thuyết trình "sản phẩm/hiện thực" 40%</td></tr>
<tr><td>5</td><td>làm việc nhóm, có đạo đức, dùng AI có trách nhiệm</td><td>lịch sử GitLab, commit hằng ngày, AI Usage Report · thuyết trình "làm việc nhóm" 20%</td></tr>
<tr><td>6</td><td>trình bày và báo cáo sản phẩm</td><td>buổi thuyết trình và hỏi đáp</td></tr>
</tbody>
</table>
<p class="ghi-chu">Sáu CLO theo cách diễn đạt của syllabus FPTU mà khoá này dùng; cột "đo bằng" lấy từ Subject Guides (slide 7) và bộ template 2026.</p>
<h3>Bộ nộp của một iteration — checklist</h3>
<ol>
<li><strong>Project Tracking</strong> (xlsx) — cập nhật sheet Use Cases + Product: màn hình của iteration này kèm trạng thái, kế hoạch iteration sau.</li>
<li><strong>RDS</strong> — yêu cầu &amp; thiết kế các màn hình của iteration này, kèm phần sửa cho các màn hình cũ.</li>
<li><strong>Tag source code</strong> — <code>iterN</code> trên GitLab, có script CSDL (tạo bảng + dữ liệu mẫu) và cấu hình.</li>
<li><strong>Video demo</strong> — mỗi người một video, cho thấy các màn hình của mình kể cả unhappy case.</li>
<li><strong>File link</strong> — URL của tag và link video gom một chỗ.</li>
<li><strong>Template 2026, nếu thầy/cô dùng</strong> — Weekly Report (Template6) và AI Usage Report (Template5).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Iteration 1 bắt đầu bằng một lần nộp.</strong> Phạm vi sản phẩm ban đầu và kế hoạch iteration 1 (sheet Use Cases + Product) phải nộp <em>trước</em> khi iteration 1 bắt đầu — cả hai bộ slide đều ghi ở trang 6.</div>`),
    bi(`<h3>The Project Tracking file, sheet by sheet</h3>
<p>File name pattern: <code>{ClassName}_{Group}_{System Name}_ProjectTracking.xlsx</code>. The template ships with example rows (placeholder names, an e-commerce feature list) — replace them all with your own team and product.</p>
<h4>Sheet "Use Cases"</h4>
<ul>
<li><strong>#</strong> — UC1, UC2… · <strong>Use case</strong> — a verb phrase ("Post a job") · <strong>Screen/Function</strong> — the feature group ("Common Feature").</li>
<li><strong>One column per actor</strong> (Guest, Freelancer, Recruiter, Admin…) — an <code>x</code> where the actor can perform the use case.</li>
<li><strong>Use case description</strong> — one sentence. Check it matches the name: the template's own examples have mismatches ("Forgot password — allows users to log out").</li>
</ul>
<h4>Sheet "Product" — one row per screen/function</h4>
<table>
<thead><tr><th>Column</th><th>What to write</th></tr></thead>
<tbody>
<tr><td>#, Feature, Screen/Function</td><td>F_01…, the feature group, the screen name (= the GitLab <code>Req</code> title)</td></tr>
<tr><td>Screen/Function Details</td><td>what is inside (e.g. "list + delete, filter, search, sort, paging on one screen")</td></tr>
<tr><td>Complexity, Complexity-Check</td><td>Level 1–7 and its rule ("8-9 fields OR 4 trans")</td></tr>
<tr><td>Bug, Mark (Program, Doc), Comments</td><td>filled by the teacher at review</td></tr>
<tr><td>LOC — Plan, Grade</td><td>the level's LOC, and LOC × quality rate (Plan 120 at L1 → Grade 60)</td></tr>
<tr><td>PIC</td><td>person in charge — one member</td></tr>
<tr><td>Plan — Planned, Actual</td><td>the iteration planned (ITER1…) and the one it was really finished in</td></tr>
<tr><td>Progress — RDS, SDS, Coding, Test</td><td>New / Doing / Done / ToDo / Completed for each part; row 1 weights them 30 / 10 / 50 / 10%</td></tr>
<tr><td>Quality</td><td>L1_Happy Cases · L2_All Cases · L3_Optimized</td></tr>
</tbody>
</table>
<h4>Sheets "MasterData", "Refs", "Policies"</h4>
<ul>
<li><strong>MasterData</strong> — LOC per member per iteration, iteration dates, the status list: <em>New</em> (created) → <em>Doing</em> → <em>Done</em> → <em>ToDo</em> (teacher asked for changes) → <em>Completed</em>.</li>
<li><strong>Refs</strong> — the 7 complexity levels, the quality rates and a grade simulator (lesson 0.2).</li>
<li><strong>Policies</strong> — the teacher's house rules (lesson 0.8).</li>
</ul>
<p class="ghi-chu">The G5 sample uses an older layout (Simple/Medium/Complex, status columns BA · SRS · SDS · Coding · UT/IT, a Defects column). Same idea, fewer levels.</p>`,
    `<h3>File Project Tracking, từng sheet</h3>
<p>Mẫu tên file: <code>{ClassName}_{Group}_{System Name}_ProjectTracking.xlsx</code>. Template có sẵn dòng ví dụ (tên giữ chỗ, danh sách tính năng thương mại điện tử) — thay toàn bộ bằng nhóm và sản phẩm của bạn.</p>
<h4>Sheet "Use Cases"</h4>
<ul>
<li><strong>#</strong> — UC1, UC2… · <strong>Use case</strong> — cụm động từ ("Post a job") · <strong>Screen/Function</strong> — nhóm tính năng ("Common Feature").</li>
<li><strong>Mỗi actor một cột</strong> (Guest, Freelancer, Recruiter, Admin…) — đánh <code>x</code> nếu actor thực hiện được use case.</li>
<li><strong>Use case description</strong> — một câu. Kiểm tra khớp với tên: chính ví dụ trong template có chỗ lệch ("Forgot password — cho phép người dùng đăng xuất").</li>
</ul>
<h4>Sheet "Product" — mỗi màn hình/chức năng một dòng</h4>
<table>
<thead><tr><th>Cột</th><th>Ghi gì</th></tr></thead>
<tbody>
<tr><td>#, Feature, Screen/Function</td><td>F_01…, nhóm tính năng, tên màn hình (= tiêu đề <code>Req</code> trên GitLab)</td></tr>
<tr><td>Screen/Function Details</td><td>bên trong có gì (vd "danh sách + xoá, lọc, tìm, sắp xếp, phân trang trên một màn")</td></tr>
<tr><td>Complexity, Complexity-Check</td><td>Level 1–7 và quy tắc của nó ("8-9 fields OR 4 trans")</td></tr>
<tr><td>Bug, Mark (Program, Doc), Comments</td><td>thầy/cô điền khi review</td></tr>
<tr><td>LOC — Plan, Grade</td><td>LOC của level, và LOC × tỷ lệ quality (Plan 120 ở L1 → Grade 60)</td></tr>
<tr><td>PIC</td><td>người phụ trách — một thành viên</td></tr>
<tr><td>Plan — Planned, Actual</td><td>iteration dự kiến (ITER1…) và iteration thực sự hoàn thành</td></tr>
<tr><td>Progress — RDS, SDS, Coding, Test</td><td>New / Doing / Done / ToDo / Completed cho từng phần; dòng 1 gán trọng số 30 / 10 / 50 / 10%</td></tr>
<tr><td>Quality</td><td>L1_Happy Cases · L2_All Cases · L3_Optimized</td></tr>
</tbody>
</table>
<h4>Sheet "MasterData", "Refs", "Policies"</h4>
<ul>
<li><strong>MasterData</strong> — LOC của từng người theo iteration, ngày của các iteration, danh sách trạng thái: <em>New</em> (mới tạo) → <em>Doing</em> → <em>Done</em> → <em>ToDo</em> (thầy/cô yêu cầu sửa) → <em>Completed</em>.</li>
<li><strong>Refs</strong> — 7 level độ phức tạp, tỷ lệ quality và bảng mô phỏng điểm (bài 0.2).</li>
<li><strong>Policies</strong> — "nội quy" của thầy/cô (bài 0.8).</li>
</ul>
<p class="ghi-chu">Bài mẫu G5 dùng bố cục cũ hơn (Simple/Medium/Complex, cột trạng thái BA · SRS · SDS · Coding · UT/IT, thêm cột Defects). Cùng ý tưởng, ít level hơn.</p>`),
    books([
      ['wiegers', 'ch. 18 (requirements management — status tracking, traceability) and ch. 27 (requirements management practices)', 'chương 18 (quản lý yêu cầu — theo dõi trạng thái, truy vết) và chương 27 (thực hành quản lý yêu cầu)'],
      ['sommerville', 'ch. 22 (project management) and ch. 23 (project planning)', 'chương 22 (quản lý dự án) và chương 23 (lập kế hoạch dự án)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 0.6 Materials & tools ───────────────────────── */
const L06 = {
  title: '0.6 — Materials, templates, tools & tech stack|||0.6 — Tài liệu, template, công cụ & tech stack',
  slug: 'swp391-tai-lieu-cong-cu',
  type: 'VIDEO',
  description: 'Bộ tài liệu thầy/cô phát: 6 slide hướng dẫn, 7 template 2026 (SRS, SDS, System Test, AI Usage, Weekly Report, Presentation, Project Tracking), 7 UI theme, bài mẫu G5, bộ prompt AI; stack Java/NetBeans/MySQL; sách tham khảo; slide SWT thuộc môn SWT301.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Materials, templates, tools &amp; tech stack</h2>
<p class="lead">The teacher's folder has four parts — <strong>Guide</strong>, <strong>Templates</strong>, <strong>Sample</strong> and <strong>Slides</strong>. This lesson tells you what each file is, when you need it, and where on this site it is taught.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Find the right guide or template for each deliverable.</li>
<li>Set up the recommended stack and tools on day 1.</li>
<li>Tell which files belong to SWP391 and which belong to another course.</li>
</ul></div>
<h3>1 · Guide — the teacher's decks</h3>
<table>
<thead><tr><th>File</th><th>Pages</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td>Slide1 Subject Guides</td><td>15</td><td>rules, grading, tracking — lessons 0.1–0.3</td></tr>
<tr><td>SWP391 Student Guides</td><td>19</td><td>the student version + Git commands — lesson 0.4</td></tr>
<tr><td>Slide2 Software Requirement</td><td>32</td><td>use cases, screen specs, the SRS part of the RDS</td></tr>
<tr><td>Slide3 System Design</td><td>55</td><td>architecture, class and sequence design (Gomaa's COMET method)</td></tr>
<tr><td>Slide4 Database Design</td><td>25</td><td>ERD, tables, the DB script</td></tr>
<tr><td>Slide5 GitLab Guides + GitLab Student Guides (PDF)</td><td>32 + 5</td><td>group, repository, issues, board, tags step by step</td></tr>
<tr><td>Slide6 Presentation</td><td>9</td><td>how the 40% final presentation runs</td></tr>
<tr><td>Claude_Prompts.txt</td><td>9 prompts</td><td>an AI pipeline from idea to PRD, diagrams, UI spec, schema, design spec, test cases</td></tr>
</tbody>
</table>
<h3>2 · Templates</h3>
<ul>
<li><strong>Project Tracking</strong> (xlsx) — Use Cases, Product, MasterData, Refs, Policies (lesson 0.5).</li>
<li><strong>Template1 SRS</strong> and <strong>Template2 SDS</strong> (docx) — the 2026 split of the RDS into a requirement document and a design document.</li>
<li><strong>Template3 System Test</strong> (xlsx) — cover, test case list per function, test statistics.</li>
<li><strong>Template5 AI Usage Report</strong> (xlsx) — per week: SDLC phase, task, AI tool, AI output, how the student validated/modified it, evidence link, value 1–5, risks.</li>
<li><strong>Template6 Weekly Report</strong> (xlsx) — status of tasks, project issues, next week's plan, other matters.</li>
<li><strong>Template7 Project Presentation</strong> (pptx) — the slide skeleton for the final presentation.</li>
<li><strong>UI Themes</strong> (zip) — 7 ready-made HTML themes: AdminDirector, AdminKit, AdminLTE, DashMin, Doctris, EduChamp, ZeShopper.</li>
</ul>
<p class="ghi-chu">There is no Template4 in the 2026 set — the numbering skips it.</p>
<h3>3 · Sample — what a finished project looks like</h3>
<ul>
<li><strong>G5 "Job IT for Freelancer"</strong> — a complete SWP391 package: final presentation (15 slides), RDS document (213 pages), Project Tracking file (52 use cases, 85 screen rows) and a SQL script (22 tables). Note that it uses SQL Server, not the recommended MySQL.</li>
<li><strong>A capstone final report</strong> — a 159-page scanned report from a later capstone course, useful to see where SWP391 documents lead.</li>
</ul>
<p class="ghi-chu">Both samples contain real students' personal data. This course shows only pages without it and never names the authors.</p>
<h3>4 · Slides SWT1–SWT7 — not this course</h3>
<p>The folder also holds SWT1–SWT7 and "Topic 8 ISTQB CTFL Agile Tester". They are the slides of <strong>SWT301 — Software Testing</strong>, taught slide by slide in its own course on this site: <a href="/courses/software-testing">Software Testing (SWT301)</a>. For SWP391 you need only the basics — test cases in Template3 and unit tests of your own screens.</p>
<h3>5 · Stack &amp; tools — set up on day 1</h3>
<ol>
<li><strong>JDK</strong> — the slide says 1.6+, but NetBeans 13 itself needs JDK 11 or newer; use a current LTS (17 or 21) unless your teacher says otherwise.</li>
<li><strong>NetBeans 13</strong> + a servlet container (Apache Tomcat) for JSP/Servlet projects.</li>
<li><strong>MySQL 8.0.23+</strong> + MySQL Workbench (the Policies sheet makes MySQL mandatory).</li>
<li><strong>Git</strong> + the GitLab account (FPT e-mail), invited by your leader.</li>
<li><strong>Slack</strong> and <strong>OneDrive</strong> with the FPT account.</li>
<li><strong>MailTrap</strong> — create a sandbox inbox; put its SMTP host, port, user and password in a config file that is <em>not</em> committed.</li>
<li><strong>Design tools</strong> — draw.io for diagrams; MockFlow (recommended in the Policies sheet) for wireframes.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Do not change the stack on your own.</strong> Spring Boot, React or PostgreSQL may be better tools, but the guides say "framework &amp; DBMS as assigned/agreed by the teacher". A stack the teacher cannot run is a stack the teacher cannot grade.</div>
<div class="callout"><strong>★ Beyond the syllabus — pick one UI theme on day 1.</strong> The 7 themes in the zip exist so that every screen of the product looks like one system. Choose one in week 1, build the shared layout (header, menu by role, footer, CSS) as the first common module, and let every member import it. It avoids the "five different apps glued together" look that the Policies sheet forbids.</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Tài liệu, template, công cụ &amp; tech stack</h2>
<p class="lead">Thư mục của thầy/cô có bốn phần — <strong>Guide</strong>, <strong>Templates</strong>, <strong>Sample</strong> và <strong>Slides</strong>. Bài này cho biết từng file là gì, khi nào cần, và được dạy ở đâu trên trang này.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Tìm đúng hướng dẫn hoặc template cho từng sản phẩm phải nộp.</li>
<li>Cài đặt stack và công cụ khuyến nghị ngay ngày đầu.</li>
<li>Phân biệt file nào thuộc SWP391 và file nào thuộc môn khác.</li>
</ul></div>
<h3>1 · Guide — slide của thầy/cô</h3>
<table>
<thead><tr><th>File</th><th>Số trang</th><th>Dùng để</th></tr></thead>
<tbody>
<tr><td>Slide1 Subject Guides</td><td>15</td><td>luật, cách chấm, theo dõi dự án — bài 0.1–0.3</td></tr>
<tr><td>SWP391 Student Guides</td><td>19</td><td>bản cho sinh viên + lệnh Git — bài 0.4</td></tr>
<tr><td>Slide2 Software Requirement</td><td>32</td><td>use case, đặc tả màn hình, phần SRS của RDS</td></tr>
<tr><td>Slide3 System Design</td><td>55</td><td>kiến trúc, thiết kế class và sequence (phương pháp COMET của Gomaa)</td></tr>
<tr><td>Slide4 Database Design</td><td>25</td><td>ERD, bảng, script CSDL</td></tr>
<tr><td>Slide5 GitLab Guides + GitLab Student Guides (PDF)</td><td>32 + 5</td><td>group, repository, issue, board, tag từng bước</td></tr>
<tr><td>Slide6 Presentation</td><td>9</td><td>buổi thuyết trình 40% diễn ra thế nào</td></tr>
<tr><td>Claude_Prompts.txt</td><td>9 prompt</td><td>một chuỗi AI từ ý tưởng tới PRD, sơ đồ, đặc tả UI, schema, thiết kế kỹ thuật, test case</td></tr>
</tbody>
</table>
<h3>2 · Templates</h3>
<ul>
<li><strong>Project Tracking</strong> (xlsx) — Use Cases, Product, MasterData, Refs, Policies (bài 0.5).</li>
<li><strong>Template1 SRS</strong> và <strong>Template2 SDS</strong> (docx) — bản 2026 tách RDS thành tài liệu yêu cầu và tài liệu thiết kế.</li>
<li><strong>Template3 System Test</strong> (xlsx) — trang bìa, danh sách test case theo chức năng, thống kê test.</li>
<li><strong>Template5 AI Usage Report</strong> (xlsx) — theo tuần: pha SDLC, công việc, công cụ AI, đầu ra của AI, sinh viên kiểm chứng/sửa thế nào, link bằng chứng, giá trị 1–5, rủi ro.</li>
<li><strong>Template6 Weekly Report</strong> (xlsx) — trạng thái công việc, vấn đề dự án, kế hoạch tuần sau, việc khác.</li>
<li><strong>Template7 Project Presentation</strong> (pptx) — khung slide cho buổi thuyết trình cuối.</li>
<li><strong>UI Themes</strong> (zip) — 7 theme HTML dựng sẵn: AdminDirector, AdminKit, AdminLTE, DashMin, Doctris, EduChamp, ZeShopper.</li>
</ul>
<p class="ghi-chu">Bộ 2026 không có Template4 — đánh số nhảy qua.</p>
<h3>3 · Sample — một đồ án hoàn chỉnh trông thế nào</h3>
<ul>
<li><strong>G5 "Job IT for Freelancer"</strong> — trọn bộ nộp của SWP391: slide thuyết trình (15 slide), tài liệu RDS (213 trang), file Project Tracking (52 use case, 85 dòng màn hình) và script SQL (22 bảng). Lưu ý bài này dùng SQL Server, không phải MySQL như khuyến nghị.</li>
<li><strong>Một báo cáo capstone</strong> — báo cáo scan 159 trang của môn capstone ở kỳ sau, để thấy tài liệu SWP391 dẫn tới đâu.</li>
</ul>
<p class="ghi-chu">Cả hai bài mẫu đều chứa thông tin cá nhân của sinh viên thật. Khoá học chỉ hiển thị các trang không có thông tin đó và không bao giờ nêu tên tác giả.</p>
<h3>4 · Slide SWT1–SWT7 — không thuộc môn này</h3>
<p>Thư mục còn có SWT1–SWT7 và "Topic 8 ISTQB CTFL Agile Tester". Đó là slide của <strong>SWT301 — Software Testing</strong>, được dạy từng slide trong khoá riêng trên trang này: <a href="/courses/software-testing">Software Testing (SWT301)</a>. Với SWP391 bạn chỉ cần phần cơ bản — test case theo Template3 và unit test cho màn hình của mình.</p>
<h3>5 · Stack &amp; công cụ — cài ngay ngày đầu</h3>
<ol>
<li><strong>JDK</strong> — slide ghi 1.6+, nhưng bản thân NetBeans 13 cần JDK 11 trở lên; hãy dùng bản LTS hiện hành (17 hoặc 21) trừ khi thầy/cô nói khác.</li>
<li><strong>NetBeans 13</strong> + một servlet container (Apache Tomcat) cho dự án JSP/Servlet.</li>
<li><strong>MySQL 8.0.23+</strong> + MySQL Workbench (sheet Policies bắt buộc dùng MySQL).</li>
<li><strong>Git</strong> + tài khoản GitLab (email FPT), do trưởng nhóm mời.</li>
<li><strong>Slack</strong> và <strong>OneDrive</strong> bằng tài khoản FPT.</li>
<li><strong>MailTrap</strong> — tạo một sandbox inbox; ghi SMTP host, port, user, password vào file cấu hình <em>không</em> commit lên.</li>
<li><strong>Công cụ thiết kế</strong> — draw.io cho sơ đồ; MockFlow (sheet Policies khuyên dùng) cho wireframe.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Đừng tự ý đổi stack.</strong> Spring Boot, React hay PostgreSQL có thể là công cụ tốt hơn, nhưng hướng dẫn ghi "framework &amp; DBMS do thầy/cô giao/đồng ý". Stack thầy/cô không chạy được là stack thầy/cô không chấm được.</div>
<div class="callout"><strong>★ Ngoài giáo trình — chọn một UI theme ngay ngày đầu.</strong> 7 theme trong file zip có mặt để mọi màn hình của sản phẩm trông như một hệ thống. Chọn một theme ở tuần 1, dựng layout chung (header, menu theo vai trò, footer, CSS) làm module chung đầu tiên, và cho mọi người import vào. Tránh được kiểu "năm ứng dụng khác nhau dán lại" mà sheet Policies cấm.</div>`),
    books([
      ['sommerville', 'ch. 1–4 (introduction, processes, agile, requirements engineering) before iteration 1', 'chương 1–4 (giới thiệu, quy trình, agile, kỹ nghệ yêu cầu) trước iteration 1'],
      ['wiegers', 'part I–II (requirements elicitation and specification)', 'phần I–II (thu thập và đặc tả yêu cầu)'],
      ['cockburn', 'ch. 1–2 and the use case template', 'chương 1–2 và mẫu use case'],
      ['gomaa', 'part I (COMET overview) and ch. 6–9 (use case modelling, static and dynamic modelling)', 'phần I (tổng quan COMET) và chương 6–9 (mô hình use case, mô hình tĩnh và động)'],
      ['progit', 'ch. 1–3 (getting started, basics, branching)', 'chương 1–3 (bắt đầu, cơ bản, branch)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 0.7 Topic bank & sizing ───────────────────────── */
const L07 = {
  title: '0.7 — Choosing a topic that is big enough: sizing rule & topic bank|||0.7 — Chọn đề tài đủ lớn: quy tắc định cỡ & ngân hàng đề tài',
  slug: 'swp391-0-5-ngan-hang-de-tai',
  type: 'VIDEO',
  description: 'Quy tắc cỡ đề tài của thầy/cô (mỗi người 3–4 màn hình mỗi iteration ⇒ nhóm 5 cần ~45–60 màn hình), cách đếm màn hình theo sheet Product, ngân hàng 12 đề tài quản lý đã định cỡ.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.7</span>
<h2>Choosing a topic that is big enough</h2>
<p class="lead">The guides give one hard sizing rule: every member must have <strong>3–4 different screens/functions to build in each iteration, including iteration 3</strong>. Most rejected topics fail this rule, not a "creativity" test. This lesson turns the rule into a count you can do before you propose a topic.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Compute how many screens your team needs.</li>
<li>Count the screens of a topic the way the teacher's Product sheet counts them.</li>
<li>Pick a topic from the bank and adapt it until it passes the size check.</li>
</ul></div>
<h3>Step 1 — the target</h3>
<table>
<thead><tr><th>Team</th><th>3 screens × 3 iterations</th><th>4 screens × 3 iterations</th></tr></thead>
<tbody>
<tr><td>4 members</td><td>36</td><td>48</td></tr>
<tr><td>5 members</td><td>45</td><td>60</td></tr>
</tbody>
</table>
<h3>Step 2 — count screens the way the teacher does</h3>
<ul>
<li><strong>Add / Update / View detail</strong> of one entity = <strong>1</strong> screen (they share one JSP and model).</li>
<li><strong>List</strong> with delete, filter, search, sort, paging = <strong>1</strong> screen.</li>
<li><strong>One screen for all roles</strong> — e.g. one "View orders" list used by manager, staff and shipper, with actions filtered by role.</li>
<li><strong>Header/footer/menu</strong> — shared work, counted once for its author.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a managed entity usually gives <strong>2 screens</strong> (list + detail form), so a team of 5 needs roughly 20–30 entities/workflows, not 20–30 tables.</p>
<h3>Step 3 — a worked count: Job Board system, 5 members</h3>
<table>
<thead><tr><th>Area</th><th>Screens</th><th>Count</th></tr></thead>
<tbody>
<tr><td>Common</td><td>login, register ×2 roles, forgot/reset password (MailTrap), change password, profile, home, about/contact, header-menu by role</td><td>9</td></tr>
<tr><td>Guest</td><td>search jobs, job detail, company detail, jobs by category, jobs by location, blog list, blog detail</td><td>7</td></tr>
<tr><td>Freelancer</td><td>CV/skills profile, apply, my applications, saved jobs, job suggestions, report a post, notifications, interview schedule</td><td>8</td></tr>
<tr><td>Recruiter</td><td>company profile, post/edit job, my job posts, review applicants, schedule interview, applicant detail, recruiter dashboard, subscription/package</td><td>8</td></tr>
<tr><td>Admin/Staff</td><td>users list + detail, recruiters (approve/block), freelancers (block), categories list + form, skills list + form, locations, reported posts, job approval, blog list + form, settings, admin dashboard, statistics report</td><td>16</td></tr>
<tr><td colspan="2"><strong>Total</strong></td><td><strong>48</strong></td></tr>
</tbody>
</table>
<p>48 ≥ 45: enough for 5 members × 3 screens × 3 iterations, with a few Complex screens (review applicants, dashboards) to raise Converted-LOC.</p>
<h3>What the G5 sample teaches about size</h3>
<ul>
<li><strong>52 use cases → 85 screen rows</strong> in its Product sheet — the team reached the size easily.</li>
<li><strong>83 of the 85 rows are rated Simple</strong> (60 LOC), 2 Medium, 1 Complex — so every member needed many screens to reach MaxLOC.</li>
<li><strong>Planned ITER1 15 · ITER2 28 · ITER3 42</strong> — heavily back-loaded; iteration 3 carried half the product.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> plan about a third of the screens per iteration, and give every member at least one Medium or Complex screen per iteration.</p>
<h3>The size check before you propose</h3>
<ol>
<li>Screen count ≥ 45 (5 members) or ≥ 36 (4 members), counted with Step 2.</li>
<li>At least 3 actors besides Guest (e.g. customer, staff, manager, admin).</li>
<li>At least one workflow with states that change (apply → review → interview → hired).</li>
<li>Every member can own screens in <em>every</em> iteration, iteration 3 included.</li>
<li>No external dependency you cannot run in class — e-mail goes through MailTrap, payment is simulated.</li>
</ol>
<h3>Topic bank — management systems, sized for 5 members</h3>
<table>
<thead><tr><th>Topic</th><th>Actors</th><th>Core workflow</th><th>Rough screens</th></tr></thead>
<tbody>
<tr><td>Job board / freelancer hiring</td><td>Freelancer, Recruiter, Staff, Admin</td><td>post → apply → review → interview → hire</td><td>~48</td></tr>
<tr><td>Clinic appointment &amp; records</td><td>Patient, Doctor, Receptionist, Admin</td><td>book slot → confirm → examine → prescription</td><td>~46</td></tr>
<tr><td>Homestay / hotel booking</td><td>Guest, Host, Staff, Admin</td><td>search → book dates → check-in → check-out → review</td><td>~45</td></tr>
<tr><td>Online course centre</td><td>Student, Teacher, Staff, Admin</td><td>enrol → lessons → quiz → certificate</td><td>~50</td></tr>
<tr><td>Library management</td><td>Member, Librarian, Admin</td><td>reserve → borrow → return → fine</td><td>~40</td></tr>
<tr><td>Gym / sports club</td><td>Member, Trainer, Staff, Admin</td><td>buy package → book class → attendance → renew</td><td>~44</td></tr>
<tr><td>Restaurant ordering</td><td>Customer, Waiter, Kitchen, Manager</td><td>reserve/order → cook → serve → bill</td><td>~46</td></tr>
<tr><td>Car / motorbike rental</td><td>Customer, Staff, Manager</td><td>search → rent period → handover → return → fee</td><td>~42</td></tr>
<tr><td>IT helpdesk ticketing</td><td>User, Agent, Team lead, Admin</td><td>open → assign → resolve → close (SLA)</td><td>~40</td></tr>
<tr><td>Dormitory management</td><td>Student, Staff, Manager</td><td>register room → assign → invoices → maintenance requests</td><td>~44</td></tr>
<tr><td>Event ticketing</td><td>Buyer, Organizer, Staff, Admin</td><td>create event → sell seats → check-in → report</td><td>~45</td></tr>
<tr><td>Multi-shop mini e-commerce</td><td>Buyer, Seller, Shipper, Admin</td><td>cart → checkout (simulated) → ship → feedback</td><td>~55</td></tr>
</tbody>
</table>
<p class="ghi-chu">"Rough screens" is an estimate for a full version with dashboards and reports; recount yours with Step 2. Topics near 40 need one more module (reports, notifications, a second workflow) for a 5-member team.</p>
<div class="pitfall co-tieu-de"><strong>Scope killers.</strong> Real payment gateways, real SMS/OTP, map routing, an "AI recommendation engine" as the core, or a mobile app. They cannot be demonstrated reliably in class and add no screens to count. Simulate them.</div>
<h3>From idea to an approved topic</h3>
<ol>
<li>Fill the <strong>Use Cases</strong> sheet (actors × use cases) and a first <strong>Product</strong> sheet (screens, level, owner, iteration).</li>
<li>Check the size with the list above.</li>
<li>Post it to the teacher (Slack thread or <code>Q&amp;A</code> issue) and adjust what the PO changes.</li>
<li>Submit the approved scope and the iteration 1 plan <em>before</em> iteration 1 starts.</li>
</ol>
<div class="callout"><strong>★ Beyond the syllabus — pick a pain you have seen.</strong> Teams that finish strong usually know the domain: a club they run, a family shop, a part-time job. Knowing real cases is also what turns a screen from L2 "all cases" into L3 "optimized for real use" — the difference between 75% and 100% of its LOC.</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.7</span>
<h2>Chọn đề tài đủ lớn</h2>
<p class="lead">Tài liệu hướng dẫn chỉ có một quy tắc định cỡ cứng: mỗi thành viên phải có <strong>3–4 màn hình/chức năng khác nhau để làm trong mỗi iteration, kể cả iteration 3</strong>. Phần lớn đề tài bị bác là vì trượt quy tắc này, không phải vì "thiếu sáng tạo". Bài này biến quy tắc thành một phép đếm bạn làm được trước khi đề xuất đề tài.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Tính nhóm bạn cần bao nhiêu màn hình.</li>
<li>Đếm màn hình của một đề tài đúng cách sheet Product của thầy/cô đếm.</li>
<li>Chọn một đề tài trong ngân hàng và chỉnh tới khi qua được phép kiểm cỡ.</li>
</ul></div>
<h3>Bước 1 — mục tiêu</h3>
<table>
<thead><tr><th>Nhóm</th><th>3 màn hình × 3 iteration</th><th>4 màn hình × 3 iteration</th></tr></thead>
<tbody>
<tr><td>4 người</td><td>36</td><td>48</td></tr>
<tr><td>5 người</td><td>45</td><td>60</td></tr>
</tbody>
</table>
<h3>Bước 2 — đếm màn hình theo cách thầy/cô đếm</h3>
<ul>
<li><strong>Thêm / Sửa / Xem chi tiết</strong> của một đối tượng = <strong>1</strong> màn hình (dùng chung một JSP và model).</li>
<li><strong>Danh sách</strong> kèm xoá, lọc, tìm, sắp xếp, phân trang = <strong>1</strong> màn hình.</li>
<li><strong>Một màn hình cho mọi vai trò</strong> — vd một danh sách "Xem đơn hàng" cho manager, staff, shipper, thao tác lọc theo vai trò.</li>
<li><strong>Header/footer/menu</strong> — việc chung, tính một lần cho người làm.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một đối tượng được quản lý thường cho <strong>2 màn hình</strong> (danh sách + form chi tiết), nên nhóm 5 người cần khoảng 20–30 đối tượng/luồng nghiệp vụ, không phải 20–30 bảng.</p>
<h3>Bước 3 — ví dụ đếm: hệ thống Job Board, 5 thành viên</h3>
<table>
<thead><tr><th>Khu vực</th><th>Màn hình</th><th>Số</th></tr></thead>
<tbody>
<tr><td>Chung</td><td>đăng nhập, đăng ký ×2 vai trò, quên/đặt lại mật khẩu (MailTrap), đổi mật khẩu, hồ sơ, trang chủ, giới thiệu/liên hệ, header-menu theo vai trò</td><td>9</td></tr>
<tr><td>Guest</td><td>tìm việc, chi tiết tin, chi tiết công ty, việc theo danh mục, việc theo địa điểm, danh sách blog, chi tiết blog</td><td>7</td></tr>
<tr><td>Freelancer</td><td>hồ sơ CV/kỹ năng, ứng tuyển, đơn của tôi, việc đã lưu, gợi ý việc, báo cáo tin, thông báo, lịch phỏng vấn</td><td>8</td></tr>
<tr><td>Recruiter</td><td>hồ sơ công ty, đăng/sửa tin, tin của tôi, duyệt ứng viên, hẹn phỏng vấn, chi tiết ứng viên, dashboard recruiter, gói dịch vụ</td><td>8</td></tr>
<tr><td>Admin/Staff</td><td>danh sách + chi tiết user, recruiter (duyệt/khoá), freelancer (khoá), danh mục (list + form), kỹ năng (list + form), địa điểm, tin bị báo cáo, duyệt tin, blog (list + form), cài đặt, dashboard admin, báo cáo thống kê</td><td>16</td></tr>
<tr><td colspan="2"><strong>Tổng</strong></td><td><strong>48</strong></td></tr>
</tbody>
</table>
<p>48 ≥ 45: đủ cho 5 người × 3 màn hình × 3 iteration, lại có vài màn Complex (duyệt ứng viên, dashboard) để kéo Converted-LOC lên.</p>
<h3>Bài mẫu G5 cho thấy gì về cỡ đề tài</h3>
<ul>
<li><strong>52 use case → 85 dòng màn hình</strong> trong sheet Product — nhóm đạt cỡ khá dễ.</li>
<li><strong>83/85 dòng bị xếp Simple</strong> (60 LOC), 2 Medium, 1 Complex — nên mỗi người phải làm rất nhiều màn hình mới chạm MaxLOC.</li>
<li><strong>Kế hoạch ITER1 15 · ITER2 28 · ITER3 42</strong> — dồn hết về cuối; iteration 3 gánh nửa sản phẩm.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chia khoảng một phần ba số màn hình cho mỗi iteration, và mỗi iteration cho mỗi người ít nhất một màn Medium hoặc Complex.</p>
<h3>Phép kiểm cỡ trước khi đề xuất</h3>
<ol>
<li>Số màn hình ≥ 45 (nhóm 5) hoặc ≥ 36 (nhóm 4), đếm theo Bước 2.</li>
<li>Ít nhất 3 actor ngoài Guest (vd khách hàng, nhân viên, quản lý, admin).</li>
<li>Ít nhất một luồng nghiệp vụ có trạng thái thay đổi (ứng tuyển → duyệt → phỏng vấn → tuyển).</li>
<li>Mỗi thành viên có màn hình ở <em>mọi</em> iteration, kể cả iteration 3.</li>
<li>Không phụ thuộc bên ngoài mà trên lớp không chạy được — email qua MailTrap, thanh toán giả lập.</li>
</ol>
<h3>Ngân hàng đề tài — hệ thống quản lý, định cỡ cho nhóm 5</h3>
<table>
<thead><tr><th>Đề tài</th><th>Actor</th><th>Luồng lõi</th><th>Ước số màn hình</th></tr></thead>
<tbody>
<tr><td>Tuyển dụng / thuê freelancer</td><td>Freelancer, Recruiter, Staff, Admin</td><td>đăng tin → ứng tuyển → duyệt → phỏng vấn → tuyển</td><td>~48</td></tr>
<tr><td>Đặt lịch khám &amp; hồ sơ phòng khám</td><td>Bệnh nhân, Bác sĩ, Lễ tân, Admin</td><td>đặt khung giờ → xác nhận → khám → kê đơn</td><td>~46</td></tr>
<tr><td>Đặt phòng homestay / khách sạn</td><td>Khách, Chủ nhà, Nhân viên, Admin</td><td>tìm → đặt ngày → nhận phòng → trả phòng → đánh giá</td><td>~45</td></tr>
<tr><td>Trung tâm khoá học online</td><td>Học viên, Giảng viên, Nhân viên, Admin</td><td>ghi danh → học bài → làm quiz → chứng chỉ</td><td>~50</td></tr>
<tr><td>Quản lý thư viện</td><td>Bạn đọc, Thủ thư, Admin</td><td>đặt trước → mượn → trả → phạt</td><td>~40</td></tr>
<tr><td>Phòng gym / câu lạc bộ thể thao</td><td>Hội viên, HLV, Nhân viên, Admin</td><td>mua gói → đặt lớp → điểm danh → gia hạn</td><td>~44</td></tr>
<tr><td>Gọi món nhà hàng</td><td>Khách, Phục vụ, Bếp, Quản lý</td><td>đặt bàn/gọi món → nấu → phục vụ → thanh toán</td><td>~46</td></tr>
<tr><td>Cho thuê ô tô / xe máy</td><td>Khách, Nhân viên, Quản lý</td><td>tìm → thuê theo kỳ → bàn giao → trả xe → tính phí</td><td>~42</td></tr>
<tr><td>Helpdesk / ticket IT</td><td>Người dùng, Agent, Trưởng nhóm, Admin</td><td>mở ticket → phân công → xử lý → đóng (SLA)</td><td>~40</td></tr>
<tr><td>Quản lý ký túc xá</td><td>Sinh viên, Nhân viên, Quản lý</td><td>đăng ký phòng → xếp phòng → hoá đơn → yêu cầu sửa chữa</td><td>~44</td></tr>
<tr><td>Bán vé sự kiện</td><td>Người mua, Ban tổ chức, Nhân viên, Admin</td><td>tạo sự kiện → bán ghế → check-in → báo cáo</td><td>~45</td></tr>
<tr><td>TMĐT nhiều shop mini</td><td>Người mua, Người bán, Shipper, Admin</td><td>giỏ hàng → thanh toán (giả lập) → giao hàng → phản hồi</td><td>~55</td></tr>
</tbody>
</table>
<p class="ghi-chu">"Ước số màn hình" là ước lượng cho bản đầy đủ có dashboard và báo cáo; hãy đếm lại đề tài của bạn theo Bước 2. Đề tài quanh mức 40 cần thêm một module (báo cáo, thông báo, một luồng thứ hai) nếu nhóm có 5 người.</p>
<div class="pitfall co-tieu-de"><strong>Những thứ giết scope.</strong> Cổng thanh toán thật, SMS/OTP thật, định tuyến bản đồ, "engine gợi ý AI" làm lõi, hay app di động. Trên lớp không demo ổn định được và cũng không thêm màn hình nào để đếm. Hãy giả lập.</div>
<h3>Từ ý tưởng tới đề tài được duyệt</h3>
<ol>
<li>Điền sheet <strong>Use Cases</strong> (actor × use case) và bản đầu của sheet <strong>Product</strong> (màn hình, level, người làm, iteration).</li>
<li>Kiểm cỡ theo danh sách trên.</li>
<li>Gửi thầy/cô (thread Slack hoặc issue <code>Q&amp;A</code>) và chỉnh theo những gì PO yêu cầu.</li>
<li>Nộp phạm vi đã duyệt và kế hoạch iteration 1 <em>trước</em> khi iteration 1 bắt đầu.</li>
</ol>
<div class="callout"><strong>★ Ngoài giáo trình — chọn nỗi đau bạn từng thấy.</strong> Nhóm về đích mạnh thường hiểu lĩnh vực: một câu lạc bộ mình điều hành, cửa hàng của gia đình, một việc làm thêm. Biết tình huống thật cũng là thứ nâng một màn hình từ L2 "đủ case" lên L3 "tối ưu cho thực tế" — khác biệt giữa 75% và 100% LOC của nó.</div>`),
    books([
      ['wiegers', 'ch. 5 (establishing the business requirements — vision and scope)', 'chương 5 (xác lập yêu cầu nghiệp vụ — tầm nhìn và phạm vi)'],
      ['cockburn', 'ch. 1 (scope, actors and goals)', 'chương 1 (phạm vi, actor và mục tiêu)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 0.8 Why teams lose marks ───────────────────────── */
const L08 = {
  title: '0.8 — Why teams lose marks, and how to score high|||0.8 — Vì sao nhóm mất điểm & cách đạt điểm cao',
  slug: 'swp391-0-6-chong-truot-diem-cao',
  type: 'VIDEO',
  description: 'Những lỗi làm rơi điểm LOC và điểm package theo đúng bảng Policies của thầy/cô (commit hằng ngày, validate, search/filter/sort/paging, code chung, sửa code trong 30 phút), cờ xanh/đỏ theo từng iteration, câu hỏi hội đồng hay hỏi.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.8</span>
<h2>Why teams lose marks — and how to score high</h2>
<p class="lead">SWP391 rarely fails for one big reason. Marks leak through the two grading criteria: <strong>LOC</strong> (screens not finished, finished badly, or not counted) and the <strong>package</strong> (missing or wrong items). The teacher's own <em>Policies</em> sheet in the Project Tracking template lists what is not negotiable — read it as the answer key.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>List the Policies rules and what each one costs when broken.</li>
<li>Recognise green and red flags in each iteration.</li>
<li>Prepare answers to the questions teachers ask at demos and at the final presentation.</li>
</ul></div>
<h3>The teacher's Policies sheet</h3>
<table>
<thead><tr><th>Area</th><th>Rule</th><th>If broken</th></tr></thead>
<tbody>
<tr><td>Git</td><td>one account per member, with the FPT e-mail; commit and merge <strong>every day</strong></td><td>no contribution on Git → <strong>no LOC</strong>, no review; weekly or end-of-iteration commits → <strong>not allowed to defend</strong></td></tr>
<tr><td>Validation</td><td>every input validated: required (blank, spaces), length (longer than the DB column, broken layout), format (date, e-mail, phone, image type jpg/png…)</td><td>unhappy cases missing → Quality falls to L1 (50%)</td></tr>
<tr><td>Lists</td><td>every data table has search, filter, sort and paging</td><td>screen counted as incomplete</td></tr>
<tr><td>Report</td><td>daily report</td><td>package deduction</td></tr>
<tr><td>Integration</td><td>merged into the team's <code>main</code> daily; demo runs on <strong>one</strong> source, not on each laptop; same format/CSS/header/menu; screens reached through navigation, not typed URLs</td><td>mandatory — not integrated → no defence</td></tr>
<tr><td>Shared code</td><td>Create/Update/View detail share one JSP and model; one function for many roles = one source with role checks; header/footer/menu in one JSP imported everywhere</td><td>duplicated screens are not counted twice</td></tr>
<tr><td>Live change</td><td>be able to modify your code when the teacher asks, within <strong>30 minutes</strong></td><td>proof that you wrote it — failing it questions your LOC</td></tr>
<tr><td>UI</td><td>wireframe (structure only) drawn first and confirmed by the teacher before implementing; MockFlow recommended</td><td>rework after review</td></tr>
<tr><td>DB</td><td>MySQL</td><td>—</td></tr>
</tbody>
</table>
<p class="ghi-chu">The Policies sheet says "use GitHub" while both decks say GitLab — one more sign that the rules are the individual teacher's. Follow your own class's file.</p>
<div class="pitfall co-tieu-de"><strong>A real note from the G5 file.</strong> The sample's tracking file keeps the teacher's comments: concepts "wrong and inconsistent between screens", and one member "not enough LOC + too many bugs → not allowed to defend". Not enough LOC is an individual failure even inside a good team.</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.8</span>
<h2>Vì sao nhóm mất điểm — và cách đạt điểm cao</h2>
<p class="lead">SWP391 hiếm khi trượt vì một lý do lớn. Điểm rơi rỉ qua hai tiêu chí chấm: <strong>LOC</strong> (màn hình chưa xong, xong mà tệ, hoặc không được tính) và <strong>package</strong> (thiếu hoặc sai mục). Chính sheet <em>Policies</em> của thầy/cô trong template Project Tracking liệt kê những điều không thương lượng — hãy đọc nó như đáp án.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Kể các quy định trong Policies và cái giá khi vi phạm từng điều.</li>
<li>Nhận ra cờ xanh, cờ đỏ ở từng iteration.</li>
<li>Chuẩn bị câu trả lời cho các câu thầy/cô hay hỏi lúc demo và lúc thuyết trình cuối.</li>
</ul></div>
<h3>Sheet Policies của thầy/cô</h3>
<table>
<thead><tr><th>Mảng</th><th>Quy định</th><th>Nếu vi phạm</th></tr></thead>
<tbody>
<tr><td>Git</td><td>mỗi người một tài khoản, email FPT; commit và merge <strong>hằng ngày</strong></td><td>không có đóng góp trên Git → <strong>không tính LOC</strong>, không review; commit theo tuần hoặc cuối iteration mới commit → <strong>không được bảo vệ</strong></td></tr>
<tr><td>Validate</td><td>mọi ô nhập đều validate: bắt buộc (bỏ trống, dấu cách), độ dài (vượt cột CSDL, vỡ khung), định dạng (ngày, email, số điện thoại, loại ảnh jpg/png…)</td><td>thiếu unhappy case → Quality rơi về L1 (50%)</td></tr>
<tr><td>Danh sách</td><td>mọi bảng dữ liệu phải có search, filter, sort và paging</td><td>màn hình bị tính là chưa xong</td></tr>
<tr><td>Báo cáo</td><td>daily report hằng ngày</td><td>trừ điểm package</td></tr>
<tr><td>Tích hợp</td><td>merge vào <code>main</code> của nhóm hằng ngày; demo chạy trên <strong>một</strong> bản source, không phải mỗi người một máy; cùng format/CSS/header/menu; đi giữa các màn hình bằng điều hướng, không gõ URL</td><td>bắt buộc — không tích hợp → không được bảo vệ</td></tr>
<tr><td>Code chung</td><td>Thêm/Sửa/Xem chi tiết dùng chung một JSP và model; một chức năng cho nhiều vai trò = một source có phân quyền; header/footer/menu trong một JSP, import ở mọi nơi</td><td>màn hình trùng lặp không được tính hai lần</td></tr>
<tr><td>Sửa trực tiếp</td><td>sửa được code của mình khi thầy/cô yêu cầu, trong vòng <strong>30 phút</strong></td><td>là bằng chứng bạn tự viết — không làm được thì LOC bị nghi ngờ</td></tr>
<tr><td>UI</td><td>wireframe (chỉ cấu trúc) vẽ trước, thầy/cô xác nhận rồi mới code; khuyên dùng MockFlow</td><td>làm lại sau review</td></tr>
<tr><td>CSDL</td><td>MySQL</td><td>—</td></tr>
</tbody>
</table>
<p class="ghi-chu">Sheet Policies ghi "sử dụng GitHub" trong khi cả hai bộ slide ghi GitLab — thêm một dấu hiệu rằng luật là của từng thầy/cô. Theo đúng file của lớp bạn.</p>
<div class="pitfall co-tieu-de"><strong>Một ghi chú thật trong file G5.</strong> File tracking của bài mẫu còn giữ nhận xét của giảng viên: khái niệm "sai và loạn, không đồng bộ giữa các màn hình", và một thành viên "không đủ LOC + quá nhiều lỗi → không bảo vệ". Thiếu LOC là trượt cá nhân, kể cả khi ở trong một nhóm tốt.</div>`),
    bi(`<h3>Green and red flags, iteration by iteration</h3>
<table>
<thead><tr><th>When</th><th>🟢 Green</th><th>🔴 Red</th></tr></thead>
<tbody>
<tr><td>Before iter 1</td><td>topic approved, Use Cases + Product sheets submitted, repo and labels set up, UI theme chosen</td><td>still arguing about the topic; nobody has cloned the repo</td></tr>
<tr><td>Iteration 1</td><td>login + shared layout merged in the first days; each member demos 3 screens on the team build</td><td>members build alone on their laptops; iteration 1 = "only documents"</td></tr>
<tr><td>Iteration 2</td><td>iter1 Leakages fixed; every list has search/filter/sort/paging; daily commits by everyone</td><td>one member carries most commits; tracking sheet not updated</td></tr>
<tr><td>Iteration 3</td><td>old screens raised to L2/L3; Complex screens finished; final package complete; demo rehearsed</td><td>half the product still planned; first full run is at the presentation</td></tr>
</tbody>
</table>
<h3>How to score high — five habits</h3>
<ol>
<li><strong>Finish, then polish</strong> — a screen counts only when it is completed; then push it from L1 to L2 to L3.</li>
<li><strong>Unhappy cases first-class</strong> — blank, too long, wrong format, duplicate, no permission: they are the 25–50% between Low and High.</li>
<li><strong>Own screens you can defend</strong> — be ready to change your code live within 30 minutes.</li>
<li><strong>Keep the paperwork true</strong> — Product sheet, GitLab issues and RDS name the same screens with the same status.</li>
<li><strong>Record honest AI use</strong> — the AI Usage Report asks what the AI produced and how you checked and changed it.</li>
</ol>
<h3>Questions teachers ask — rehearse them</h3>
<table>
<thead><tr><th>They ask</th><th>You answer with</th></tr></thead>
<tbody>
<tr><td>"Show me what happens if I leave this field blank / type 300 characters."</td><td>the validation message, live</td></tr>
<tr><td>"Change this label / add a filter now."</td><td>the edit in your own code, within minutes</td></tr>
<tr><td>"Which tables does this screen use? Show the SQL."</td><td>the DAO method and a parameterised query</td></tr>
<tr><td>"How are passwords stored?"</td><td>hashed, never plain text</td></tr>
<tr><td>"Why is this one screen for three roles?"</td><td>shared code + role checks, as the Policies sheet requires</td></tr>
<tr><td>"Where is this requirement confirmed?"</td><td>the <code>Q&amp;A</code> issue / Slack thread with the PO's answer</td></tr>
<tr><td>"Which screens are yours?"</td><td>your rows in the Product sheet, your issues and your commits</td></tr>
</tbody>
</table>
<div class="callout"><strong>★ Beyond the syllabus — measure yourself before the teacher does.</strong> At the end of each week, fill your own rows of the Product sheet: level, quality you honestly reached, LOC. Divide by MaxLOC. If the number is below 5 with two slots left, you still have time to finish a screen or raise one from L1 to L2 — on demo day you do not.</div>`,
    `<h3>Cờ xanh và cờ đỏ, theo từng iteration</h3>
<table>
<thead><tr><th>Lúc</th><th>🟢 Xanh</th><th>🔴 Đỏ</th></tr></thead>
<tbody>
<tr><td>Trước iter 1</td><td>đề tài đã duyệt, đã nộp sheet Use Cases + Product, repo và label đã dựng, đã chọn UI theme</td><td>còn cãi nhau chọn đề tài; chưa ai clone repo</td></tr>
<tr><td>Iteration 1</td><td>đăng nhập + layout chung merge trong mấy ngày đầu; mỗi người demo 3 màn hình trên bản build chung</td><td>mỗi người làm riêng trên máy mình; iteration 1 = "chỉ làm tài liệu"</td></tr>
<tr><td>Iteration 2</td><td>đã sửa Leakage của iter1; mọi danh sách có search/filter/sort/paging; ai cũng commit hằng ngày</td><td>một người gánh phần lớn commit; sheet tracking không cập nhật</td></tr>
<tr><td>Iteration 3</td><td>màn cũ nâng lên L2/L3; màn Complex xong; gói nộp cuối đầy đủ; đã tập demo</td><td>nửa sản phẩm vẫn còn "dự kiến"; lần đầu chạy trọn là ngay buổi thuyết trình</td></tr>
</tbody>
</table>
<h3>Cách đạt điểm cao — năm thói quen</h3>
<ol>
<li><strong>Làm xong, rồi mới trau chuốt</strong> — màn hình chỉ được tính khi hoàn thành; sau đó đẩy nó từ L1 lên L2 lên L3.</li>
<li><strong>Coi unhappy case là chính</strong> — bỏ trống, quá dài, sai định dạng, trùng, không có quyền: đó là 25–50% chênh lệch giữa Low và High.</li>
<li><strong>Sở hữu màn hình mình bảo vệ được</strong> — sẵn sàng sửa code trực tiếp trong 30 phút.</li>
<li><strong>Giữ giấy tờ trung thực</strong> — sheet Product, issue GitLab và RDS gọi cùng tên màn hình, cùng trạng thái.</li>
<li><strong>Ghi lại việc dùng AI trung thực</strong> — AI Usage Report hỏi AI đã tạo ra gì và bạn đã kiểm, sửa nó thế nào.</li>
</ol>
<h3>Những câu thầy/cô hay hỏi — tập trước</h3>
<table>
<thead><tr><th>Họ hỏi</th><th>Bạn trả lời bằng</th></tr></thead>
<tbody>
<tr><td>"Để trống ô này / gõ 300 ký tự thì sao?"</td><td>thông báo validate, chạy trực tiếp</td></tr>
<tr><td>"Đổi nhãn này / thêm một bộ lọc ngay bây giờ."</td><td>sửa ngay trong code của mình, vài phút</td></tr>
<tr><td>"Màn này dùng bảng nào? Cho xem SQL."</td><td>hàm DAO và câu truy vấn có tham số</td></tr>
<tr><td>"Mật khẩu lưu thế nào?"</td><td>đã băm, không bao giờ lưu dạng rõ</td></tr>
<tr><td>"Sao một màn hình cho ba vai trò?"</td><td>code chung + kiểm tra vai trò, đúng như sheet Policies yêu cầu</td></tr>
<tr><td>"Yêu cầu này được xác nhận ở đâu?"</td><td>issue <code>Q&amp;A</code> / thread Slack có câu trả lời của PO</td></tr>
<tr><td>"Màn hình nào là của em?"</td><td>các dòng của mình trong sheet Product, issue và commit của mình</td></tr>
</tbody>
</table>
<div class="callout"><strong>★ Ngoài giáo trình — tự chấm mình trước khi thầy/cô chấm.</strong> Cuối mỗi tuần, tự điền các dòng của mình trong sheet Product: level, mức quality thật sự đạt, LOC. Chia cho MaxLOC. Nếu còn hai slot mà con số dưới 5, bạn vẫn kịp làm xong một màn hình hoặc nâng một màn từ L1 lên L2 — tới ngày demo thì không còn kịp.</div>`),
    books([
      ['sommerville', 'ch. 22 (project management — teamwork) and ch. 24 (quality management — reviews and inspections)', 'chương 22 (quản lý dự án — làm việc nhóm) và chương 24 (quản lý chất lượng — review và inspection)'],
    ]),
  ].join('\n'),
};

export default {
  title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
  description: 'Đọc trước tiên: môn học chạy theo 3 iteration ra sao, điều kiện qua môn, cách chấm Converted-LOC, theo dõi dự án trên GitLab, bộ nộp mỗi iteration, tài liệu – công cụ và cách chọn đề tài đủ lớn.',
  lessons: [L01, L02, L03, L04, L05, L06, L07, L08],
};
