/**
 * SWP391 · Chapter 4 — Iterations: plan, build & track your screens.
 * (The old title "Milestone 2: Implementation" was wrong: SWP391 runs 3 ITERATIONS and every member does
 *  requirement + design + full-stack code for his/her own 3–4 screens in EACH iteration.)
 * Sources: the Project Tracking template ({ClassName}_{Group}_{System Name}_ProjectTracking (Template).xlsx —
 * sheets Use Cases, Product, MasterData, Refs, Policies), the G5 filled tracking file, Subject Guides slides 3–7,
 * Student Guides slides 3–11, Template5 (AI Usage Report), Template6 (Weekly Report), the 7 UI themes zip and
 * Claude_Prompts.txt prompt #8 (Technical Design Spec).
 * No slide deck of its own: the workbook sheets are re-drawn as tables.
 * Every LOC / grade number in the worked examples was computed by a script (scratchpad ch4swp/calc*.mjs).
 * PRIVACY: the template and the G5 file contain real names/usernames in the PIC and MasterData columns —
 * they are replaced by "Dev1…", "Member A…E" everywhere.
 */
import { bi, books } from './_slides.mjs';

/* ─────────────────────── 4.1 How an iteration runs ─────────────────────── */
const L41 = {
  title: '4.1 — How an iteration runs: plan → build → track|||4.1 — Một iteration diễn ra thế nào: lập kế hoạch → xây → theo dõi',
  slug: 'swp391-4-1-repository-service-sqli',
  type: 'VIDEO',
  description: 'Vòng đời một iteration SWP391 (6 slot 135\'): chốt danh sách màn hình trước, mỗi thành viên tự làm yêu cầu + thiết kế + code full-stack cho 3–4 màn hình, commit hằng ngày, cập nhật Project Tracking, nộp gói cuối iteration và cách chấm LOC 70% + gói nộp 30%.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.1 · Subject Guides slides 3–7 · Student Guides slides 3–7</span>
<h2>How an iteration runs — plan, build, track</h2>
<p class="lead">SWP391 is <strong>not</strong> "requirements first, code later, deploy at the end". The semester is cut into <strong>three iterations</strong>, and in <em>every</em> iteration each member takes 3–4 screens/functions and carries them all the way: requirement → design → full-stack code → test → demo. This lesson is the operating manual for one iteration.</p>
<div class="callout"><strong>After this lesson you can…</strong>
<ul>
<li>draw the timeline of one iteration (6 slots of 135', or 9 of 90') and say what happens before, during and after it;</li>
<li>list what <strong>you personally</strong> must produce for each of your screens, and what the team must produce together;</li>
<li>move a screen through the statuses <strong>New → Doing → Done → ToDo → Completed</strong> and the GitLab labels;</li>
<li>name every item of the end-of-iteration package and how it is graded (LOC 70% + package 30%);</li>
<li>explain the house rules in the template's <strong>Policies</strong> sheet that decide whether you may even defend.</li>
</ul></div>
<p class="nhan">Where this chapter sits</p>
<ul>
<li><strong>Chapter 2–3</strong> taught you how to specify and design one screen (RDS: use case, wireframe, class/sequence, DB).</li>
<li><strong>This chapter</strong> is the loop you repeat three times: plan the screens in the Project Tracking file, size them, build them, integrate daily, report weekly.</li>
<li><strong>Running example</strong> — the G5 sample system <em>Job IT for Freelancer</em> (actors Guest, Freelancer, Recruiter, Admin), rebuilt with the course default stack: NetBeans + Java Servlet/JSP + MySQL.</li>
</ul>`,
    `<span class="eyebrow">Chương 4 · Bài 4.1 · Subject Guides slide 3–7 · Student Guides slide 3–7</span>
<h2>Một iteration diễn ra thế nào — lập kế hoạch, xây, theo dõi</h2>
<p class="lead">SWP391 <strong>không</strong> phải "làm yêu cầu trước, code sau, cuối kỳ mới deploy". Học kỳ chia thành <strong>ba iteration</strong>, và trong <em>mỗi</em> iteration từng thành viên nhận 3–4 màn hình/chức năng rồi làm trọn: yêu cầu → thiết kế → code full-stack → test → demo. Bài này là "sổ tay vận hành" của một iteration.</p>
<div class="callout"><strong>Học xong bài này bạn có thể…</strong>
<ul>
<li>vẽ được dòng thời gian một iteration (6 slot 135', hoặc 9 slot 90') và nói rõ việc gì diễn ra trước, trong và sau;</li>
<li>liệt kê những gì <strong>chính bạn</strong> phải làm cho từng màn hình của mình, và những gì cả nhóm làm chung;</li>
<li>chuyển một màn hình qua các trạng thái <strong>New → Doing → Done → ToDo → Completed</strong> và các nhãn GitLab;</li>
<li>kể đủ các mục của gói nộp cuối iteration và cách chấm (LOC 70% + gói nộp 30%);</li>
<li>giải thích các "luật nhà" trong sheet <strong>Policies</strong> của file mẫu — những luật quyết định bạn có được bảo vệ hay không.</li>
</ul></div>
<p class="nhan">Chương này nằm ở đâu</p>
<ul>
<li><strong>Chương 2–3</strong> dạy cách đặc tả và thiết kế một màn hình (RDS: use case, wireframe, class/sequence, DB).</li>
<li><strong>Chương này</strong> là vòng lặp bạn chạy ba lần: lên kế hoạch màn hình trong file Project Tracking, định cỡ, xây, tích hợp hằng ngày, báo cáo hằng tuần.</li>
<li><strong>Ví dụ xuyên suốt</strong> — hệ thống mẫu của nhóm G5 <em>Job IT for Freelancer</em> (actor Guest, Freelancer, Recruiter, Admin), dựng lại bằng stack mặc định của môn: NetBeans + Java Servlet/JSP + MySQL.</li>
</ul>`),
    bi(`<h3>1. The iteration at a glance</h3>
<table>
<thead><tr><th>Iteration</th><th>Length</th><th>Weight</th><th>Graded by</th><th>MaxLOC (Subject Guides · Student Guides)</th></tr></thead>
<tbody>
<tr><td>Iteration 1</td><td>6 slots × 135' (9 × 90')</td><td>15%</td><td>guiding teacher</td><td>180 · 240</td></tr>
<tr><td>Iteration 2</td><td>6 slots × 135' (9 × 90')</td><td>20%</td><td>guiding teacher</td><td>240 · 240</td></tr>
<tr><td>Iteration 3</td><td>6 slots × 135' (9 × 90')</td><td>25% (final package)</td><td>guiding teacher</td><td>660 · 720 (all screens of the project)</td></tr>
<tr><td>Final Presentation</td><td>2 slots × 135' (3 × 90')</td><td>40%</td><td>2 other teachers</td><td>—</td></tr>
</tbody>
</table>
<p class="ghi-chu">The two decks disagree on MaxLOC (and the template's MasterData sheet writes yet another target: 180 / 240 / 180 LOC). Follow the version your teacher publishes on EduNext/CMS this semester — lesson 4.3 shows the grade under both.</p>
<p class="nhan">A real calendar — the G5 team's MasterData sheet</p>
<ul>
<li><strong>ITER1</strong> — 06/05 → 31/05, demo right after the end date.</li>
<li><strong>ITER2</strong> — 01/06 → 21/06.</li>
<li><strong>ITER3</strong> — 22/06 → 12/07, then the Final Presentation.</li>
</ul>
<h3>2. Three phases inside one iteration</h3>
<ol>
<li><strong>Plan (before slot 1)</strong> — the team agrees the screen list for this iteration in the <em>Product</em> sheet: one PIC per screen, a complexity level, the planned iteration. For iteration 1 this list must be submitted <em>before</em> the iteration starts (Student Guides slide 6). Each member draws the wireframe of his screens and gets the teacher's OK before coding (Policies sheet).</li>
<li><strong>Build (slots 1–5)</strong> — every member, for each of his 3–4 screens: writes the requirement part of the RDS (use case, business rules, wireframe), the design part (class/sequence diagram, SQL, tables), codes it full-stack, tests happy <em>and</em> unhappy cases, logs defects, and <strong>commits + merges into main every day</strong>. In parallel the team keeps the common parts alive: header/footer/menu, DB script, shared DAO/utilities, common RDS chapters.</li>
<li><strong>Track &amp; deliver (slot 6)</strong> — progress columns in the tracking file are brought up to date, each member records a demo video, the leader tags the source on GitLab, the package is submitted, and the teacher reviews/demos each person's screens and grades them.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> "3 × 3 × 4" — 3 iterations, each member 3–4 screens, 4 kinds of work per screen (requirement, design, code, test).</p>
<div class="pitfall co-tieu-de"><strong>The "waterfall inside SWP391" trap.</strong> Teams that spend iteration 1 writing only documents arrive at the first demo with 0 LOC — and LOC is 70% of the iteration grade. Every iteration must end with <em>running</em> screens.</div>`,
    `<h3>1. Toàn cảnh một iteration</h3>
<table>
<thead><tr><th>Iteration</th><th>Độ dài</th><th>Trọng số</th><th>Người chấm</th><th>MaxLOC (Subject Guides · Student Guides)</th></tr></thead>
<tbody>
<tr><td>Iteration 1</td><td>6 slot × 135' (9 × 90')</td><td>15%</td><td>giảng viên hướng dẫn</td><td>180 · 240</td></tr>
<tr><td>Iteration 2</td><td>6 slot × 135' (9 × 90')</td><td>20%</td><td>giảng viên hướng dẫn</td><td>240 · 240</td></tr>
<tr><td>Iteration 3</td><td>6 slot × 135' (9 × 90')</td><td>25% (gói cuối)</td><td>giảng viên hướng dẫn</td><td>660 · 720 (mọi màn hình của cả dự án)</td></tr>
<tr><td>Final Presentation</td><td>2 slot × 135' (3 × 90')</td><td>40%</td><td>2 giảng viên khác</td><td>—</td></tr>
</tbody>
</table>
<p class="ghi-chu">Hai bộ slide ghi MaxLOC khác nhau (và sheet MasterData của file mẫu lại ghi một mục tiêu khác nữa: 180 / 240 / 180 LOC). Hãy theo bản thầy/cô công bố trên EduNext/CMS học kỳ này — bài 4.3 tính điểm theo cả hai.</p>
<p class="nhan">Một lịch thật — sheet MasterData của nhóm G5</p>
<ul>
<li><strong>ITER1</strong> — 06/05 → 31/05, demo ngay sau ngày kết thúc.</li>
<li><strong>ITER2</strong> — 01/06 → 21/06.</li>
<li><strong>ITER3</strong> — 22/06 → 12/07, sau đó là Final Presentation.</li>
</ul>
<h3>2. Ba pha bên trong một iteration</h3>
<ol>
<li><strong>Lập kế hoạch (trước slot 1)</strong> — cả nhóm chốt danh sách màn hình của iteration trong sheet <em>Product</em>: mỗi màn hình một PIC, một mức độ phức tạp, iteration dự kiến. Với iteration 1, danh sách này phải nộp <em>trước</em> khi iteration bắt đầu (Student Guides slide 6). Mỗi thành viên vẽ wireframe màn hình của mình và được giảng viên OK rồi mới code (sheet Policies).</li>
<li><strong>Xây (slot 1–5)</strong> — mỗi thành viên, với từng màn hình trong 3–4 màn hình của mình: viết phần yêu cầu trong RDS (use case, business rule, wireframe), phần thiết kế (class/sequence diagram, câu SQL, bảng), code full-stack, test cả happy <em>lẫn</em> unhappy case, ghi defect, và <strong>commit + merge vào main mỗi ngày</strong>. Song song, cả nhóm giữ các phần chung: header/footer/menu, script DB, DAO/tiện ích dùng chung, các chương chung của RDS.</li>
<li><strong>Theo dõi &amp; bàn giao (slot 6)</strong> — cập nhật các cột tiến độ trong file tracking, mỗi thành viên quay video demo, leader gắn tag source trên GitLab, nộp gói, và giảng viên review/cho demo màn hình của từng người rồi chấm.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "3 × 3 × 4" — 3 iteration, mỗi người 3–4 màn hình, mỗi màn hình 4 loại việc (yêu cầu, thiết kế, code, test).</p>
<div class="pitfall co-tieu-de"><strong>Bẫy "waterfall trong SWP391".</strong> Nhóm nào dành cả iteration 1 chỉ để viết tài liệu sẽ tới buổi demo đầu tiên với 0 LOC — trong khi LOC chiếm 70% điểm iteration. Iteration nào cũng phải kết thúc bằng màn hình <em>chạy được</em>.</div>`),
    bi(`<h3>3. What YOU produce for each of your screens</h3>
<p>Take one real screen of the running example — <strong>Category list</strong> (Admin) — and follow it through the iteration.</p>
<table>
<thead><tr><th>Step</th><th>Artefact</th><th>Where it lives</th><th>Category list example</th></tr></thead>
<tbody>
<tr><td>1 Req</td><td>GitLab issue labelled <code>Req</code>, assigned to you</td><td>GitLab Issues</td><td>"Req: Category list (Admin)" in milestone ITER1</td></tr>
<tr><td>2 Plan</td><td>Row in the <em>Product</em> sheet</td><td>Project Tracking</td><td>F_08 · Level 4 · PIC = you · Plan ITER1</td></tr>
<tr><td>3 Wireframe</td><td>Screen structure, confirmed by the teacher</td><td>RDS + MockFlow</td><td>table + search box + status filter + paging</td></tr>
<tr><td>4 Requirement spec</td><td>Use case, business rules, field list</td><td>RDS — requirement part</td><td>UC "View list categories", rule "deleted = deactivated"</td></tr>
<tr><td>5 Design spec</td><td>Class/sequence diagram, SQL commands, tables used</td><td>RDS — design part</td><td><code>SELECT … WHERE name LIKE ? …</code></td></tr>
<tr><td>6 Code</td><td>Model, DAO, Servlet, JSP — merged into main daily</td><td>GitLab repo</td><td><code>CategoryListServlet</code> + <code>category-list.jsp</code></td></tr>
<tr><td>7 Test</td><td>Happy + unhappy cases, defects logged</td><td>GitLab issues <code>Defect</code>, Bug column</td><td>blank search, 51-char name, page 999</td></tr>
<tr><td>8 Demo</td><td>Your own demo video</td><td>link in the package</td><td>2–3 minutes, login → menu → screen</td></tr>
</tbody>
</table>
<h3>4. What the TEAM produces together</h3>
<ul>
<li><strong>Common code modules</strong> — layout (header/footer/menu by role), login/session, DB connection, shared utilities and validators. The template even lists the layout as its own row ("F_02 Author: Header/Footer/Menu").</li>
<li><strong>Database</strong> — one MySQL script for all tables, plus demo data, versioned with the tag.</li>
<li><strong>Common document parts</strong> — overview, actors, context diagram, conventions in the RDS.</li>
<li><strong>Integration &amp; review</strong> — merge each other's work, review each other's screens (Subject Guides slide 5: "review and integrate the works with others").</li>
</ul>
<p class="nhan">Your teacher wears two hats</p>
<ul>
<li><strong>Coach</strong> — guides GitLab, Slack, the templates and the process.</li>
<li><strong>Customer / Product Owner</strong> — "most of the teacher time during the project iterations is to clarify/confirm requirements and evaluate/feedback on student work results" (slide 5). Put questions to him as GitLab issues labelled <code>Q&amp;A</code>, not only in chat.</li>
</ul>`,
    `<h3>3. Những gì BẠN làm ra cho mỗi màn hình của mình</h3>
<p>Lấy một màn hình thật của ví dụ xuyên suốt — <strong>Category list</strong> (Admin) — và đi theo nó suốt iteration.</p>
<table>
<thead><tr><th>Bước</th><th>Sản phẩm</th><th>Nằm ở đâu</th><th>Ví dụ Category list</th></tr></thead>
<tbody>
<tr><td>1 Req</td><td>Issue GitLab nhãn <code>Req</code>, giao cho bạn</td><td>GitLab Issues</td><td>"Req: Category list (Admin)" trong milestone ITER1</td></tr>
<tr><td>2 Kế hoạch</td><td>Một dòng trong sheet <em>Product</em></td><td>Project Tracking</td><td>F_08 · Level 4 · PIC = bạn · Plan ITER1</td></tr>
<tr><td>3 Wireframe</td><td>Cấu trúc màn hình, được giảng viên xác nhận</td><td>RDS + MockFlow</td><td>bảng + ô tìm kiếm + lọc trạng thái + phân trang</td></tr>
<tr><td>4 Đặc tả yêu cầu</td><td>Use case, business rule, danh sách field</td><td>RDS — phần yêu cầu</td><td>UC "View list categories", rule "xoá = chuyển inactive"</td></tr>
<tr><td>5 Đặc tả thiết kế</td><td>Class/sequence diagram, câu SQL, bảng dùng</td><td>RDS — phần thiết kế</td><td><code>SELECT … WHERE name LIKE ? …</code></td></tr>
<tr><td>6 Code</td><td>Model, DAO, Servlet, JSP — merge vào main hằng ngày</td><td>Repo GitLab</td><td><code>CategoryListServlet</code> + <code>category-list.jsp</code></td></tr>
<tr><td>7 Test</td><td>Happy + unhappy case, ghi defect</td><td>Issue GitLab <code>Defect</code>, cột Bug</td><td>tìm rỗng, tên 51 ký tự, trang 999</td></tr>
<tr><td>8 Demo</td><td>Video demo của riêng bạn</td><td>link trong gói nộp</td><td>2–3 phút, đăng nhập → menu → màn hình</td></tr>
</tbody>
</table>
<h3>4. Những gì CẢ NHÓM làm chung</h3>
<ul>
<li><strong>Module code chung</strong> — layout (header/footer/menu theo role), đăng nhập/session, kết nối DB, tiện ích và validator dùng chung. File mẫu còn ghi layout thành một dòng riêng ("F_02 Author: Header/Footer/Menu").</li>
<li><strong>Cơ sở dữ liệu</strong> — một script MySQL cho mọi bảng, kèm dữ liệu demo, được lưu cùng tag.</li>
<li><strong>Phần tài liệu chung</strong> — tổng quan, actor, context diagram, quy ước trong RDS.</li>
<li><strong>Tích hợp &amp; review</strong> — merge việc của nhau, review màn hình của nhau (Subject Guides slide 5: "review and integrate the works with others").</li>
</ul>
<p class="nhan">Giảng viên đội hai chiếc mũ</p>
<ul>
<li><strong>Coach</strong> — hướng dẫn GitLab, Slack, các template và quy trình.</li>
<li><strong>Khách hàng / Product Owner</strong> — "phần lớn thời gian của giảng viên trong các iteration là làm rõ/xác nhận yêu cầu và đánh giá/phản hồi kết quả của sinh viên" (slide 5). Hỏi thầy/cô bằng issue GitLab nhãn <code>Q&amp;A</code>, không chỉ nhắn chat.</li>
</ul>`),
    bi(`<h3>5. Tracking: two status systems that must agree</h3>
<p class="nhan">Status of a screen in the Project Tracking file (template MasterData sheet)</p>
<ol>
<li><strong>New</strong> — "when the task is created, set it to New".</li>
<li><strong>Doing</strong> — "when you start working on it".</li>
<li><strong>Done</strong> — "when you finish it" — <em>your</em> opinion, not yet the teacher's.</li>
<li><strong>ToDo</strong> — "the teacher reviewed it and something must be fixed" — it goes back to you.</li>
<li><strong>Completed</strong> — "everything is finished" — accepted.</li>
</ol>
<p class="nhan">Labels on GitLab issues (Student Guides slide 13)</p>
<table>
<thead><tr><th>Label</th><th>Meaning</th><th>Example in Job IT for Freelancer</th></tr></thead>
<tbody>
<tr><td><code>1_To Do</code></td><td>work or problem waiting to be handled</td><td>"Req: Apply job" planned for ITER2</td></tr>
<tr><td><code>2_Doing</code></td><td>being handled now</td><td>you started the DAO of Apply job</td></tr>
<tr><td><code>3_Done</code></td><td>handled, needs checking before it is Closed</td><td>Apply job merged, waiting for review</td></tr>
<tr><td><code>Defect</code></td><td>a document or code bug found <strong>by the team</strong></td><td>paging shows page 0 when the list is empty</td></tr>
<tr><td><code>Leakage</code></td><td>a bug found <strong>by the teacher/customer</strong> after submission</td><td>teacher finds a 300-char description breaks the table</td></tr>
<tr><td><code>Q&amp;A</code></td><td>a question that needs clarifying/confirming</td><td>"Can a recruiter delete a post that has applications?"</td></tr>
<tr><td><code>Req</code></td><td>one screen or one function that <strong>one person</strong> owns completely</td><td>"Category detail (view/add/update)"</td></tr>
<tr><td><code>Task</code></td><td>an activity for a single member (members usually create their own)</td><td>"Write RDS section 4.22", "record demo video"</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> the Product sheet row and the <code>Req</code> issue are the same screen seen from two tools — when you drag the issue to <code>3_Done</code>, set the row to <em>Done</em> the same day.</p>
<div class="pitfall co-tieu-de"><strong>Defect vs Leakage is a quality signal.</strong> Many <code>Defect</code> issues found by the team is healthy — it proves you tested. Many <code>Leakage</code> issues found by the teacher means you did not, and it pulls your Quality level down (lesson 4.3).</div>`,
    `<h3>5. Theo dõi: hai hệ trạng thái phải khớp nhau</h3>
<p class="nhan">Trạng thái một màn hình trong file Project Tracking (sheet MasterData của file mẫu)</p>
<ol>
<li><strong>New</strong> — "khi tạo task thì để status là New".</li>
<li><strong>Doing</strong> — "bắt đầu làm thì để Doing".</li>
<li><strong>Done</strong> — "làm xong chuyển qua Done" — là ý kiến của <em>bạn</em>, chưa phải của giảng viên.</li>
<li><strong>ToDo</strong> — "thầy review, nếu có nội dung cần sửa thì chuyển sang ToDo" — việc quay lại tay bạn.</li>
<li><strong>Completed</strong> — "hoàn thiện toàn bộ chuyển sang Completed" — đã được chấp nhận.</li>
</ol>
<p class="nhan">Nhãn trên issue GitLab (Student Guides slide 13)</p>
<table>
<thead><tr><th>Nhãn</th><th>Ý nghĩa</th><th>Ví dụ trong Job IT for Freelancer</th></tr></thead>
<tbody>
<tr><td><code>1_To Do</code></td><td>công việc/vấn đề cần giải quyết</td><td>"Req: Apply job" dự kiến ở ITER2</td></tr>
<tr><td><code>2_Doing</code></td><td>đang được giải quyết</td><td>bạn đã bắt đầu viết DAO của Apply job</td></tr>
<tr><td><code>3_Done</code></td><td>đã giải quyết, cần kiểm lại để đóng (Closed)</td><td>Apply job đã merge, chờ review</td></tr>
<tr><td><code>Defect</code></td><td>lỗi tài liệu hoặc code do <strong>chính nhóm</strong> phát hiện</td><td>phân trang hiện trang 0 khi danh sách rỗng</td></tr>
<tr><td><code>Leakage</code></td><td>lỗi do <strong>giảng viên/khách hàng</strong> phát hiện sau khi nộp</td><td>thầy nhập mô tả 300 ký tự làm vỡ bảng</td></tr>
<tr><td><code>Q&amp;A</code></td><td>câu hỏi cần làm rõ hoặc xác nhận</td><td>"Recruiter có được xoá bài đăng đã có người ứng tuyển không?"</td></tr>
<tr><td><code>Req</code></td><td>một màn hình hoặc một chức năng giao trọn cho <strong>một người</strong></td><td>"Category detail (xem/thêm/sửa)"</td></tr>
<tr><td><code>Task</code></td><td>một hoạt động giao cho một thành viên (thường tự tạo cho mình)</td><td>"Viết RDS mục 4.22", "quay video demo"</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> dòng trong sheet Product và issue <code>Req</code> là cùng một màn hình nhìn từ hai công cụ — hôm nào kéo issue sang <code>3_Done</code> thì hôm đó đổi dòng sang <em>Done</em>.</p>
<div class="pitfall co-tieu-de"><strong>Defect hay Leakage là tín hiệu chất lượng.</strong> Nhiều issue <code>Defect</code> do nhóm tự tìm là lành mạnh — chứng tỏ bạn có test. Nhiều issue <code>Leakage</code> do giảng viên tìm ra nghĩa là bạn chưa test, và nó kéo mức Quality của bạn xuống (bài 4.3).</div>`),
    bi(`<h3>6. End of the iteration: the package and how it is graded</h3>
<p class="nhan">What the team submits (Student Guides slide 6)</p>
<ol>
<li><strong>Project Tracking file</strong> — sheets "Use Cases" + "Product": the status of the screens done in this iteration <em>and</em> the screens planned/assigned for the next one.</li>
<li><strong>RDS document</strong> — requirement &amp; design specification of this iteration's screens, plus updates to earlier ones.</li>
<li><strong>Links</strong> (in a text file) — each member's demo video; the GitLab <strong>tag</strong> of this iteration's source; the DB scripts and config committed inside that tag.</li>
<li><strong>2026 additions</strong> — the Weekly Reports (Template6) and the AI Usage Report (Template5) if your teacher asks for them (lesson 4.7).</li>
</ol>
<p class="nhan">How it is graded (Student Guides slide 7 · Subject Guides slide 7)</p>
<ul>
<li><strong>LOC — 70%, individual</strong> — the sum of Converted LOC (Complexity × Quality) of the screens <em>you</em> completed, checked by a live code demo. Iteration 3 counts all your completed screens of the project.</li>
<li><strong>Submitted package — 30%</strong> — source code quality, DB script and the RDS. Missing or wrong Project Tracking and other materials are subtracted (Subject Guides: up to 10% of the total grade).</li>
<li><strong>Iteration grade</strong> = LOC grade × 0.7 + package grade × 0.3. The template's Refs sheet notes that in iteration 3 the package weight is 40%.</li>
<li><strong>OG</strong> = (iter1 × 15% + iter2 × 20% + iter3 × 25%) / 60% — must be ≥ 5, with attendance ≥ 80% and Final Presentation ≥ 5.</li>
</ul>
<div class="callout"><strong>The demo is where LOC is decided.</strong> The teacher opens <em>your</em> screen from the team's single running build, tries unhappy cases, and may ask you to change the code on the spot. The Policies sheet says you must be able to edit your source directly within <strong>30 minutes</strong> when asked — this is how the teacher checks that you wrote it.</div>`,
    `<h3>6. Cuối iteration: gói nộp và cách chấm</h3>
<p class="nhan">Nhóm nộp gì (Student Guides slide 6)</p>
<ol>
<li><strong>File Project Tracking</strong> — sheet "Use Cases" + "Product": trạng thái các màn hình đã làm trong iteration này <em>và</em> các màn hình dự kiến/được giao cho iteration sau.</li>
<li><strong>Tài liệu RDS</strong> — đặc tả yêu cầu &amp; thiết kế các màn hình của iteration này, cộng phần cập nhật cho các iteration trước.</li>
<li><strong>Các link</strong> (trong một file text) — video demo của từng thành viên; <strong>tag</strong> GitLab của source iteration này; script DB và file cấu hình commit bên trong tag đó.</li>
<li><strong>Bổ sung năm 2026</strong> — Weekly Report (Template6) và AI Usage Report (Template5) nếu giảng viên yêu cầu (bài 4.7).</li>
</ol>
<p class="nhan">Cách chấm (Student Guides slide 7 · Subject Guides slide 7)</p>
<ul>
<li><strong>LOC — 70%, tính cá nhân</strong> — tổng Converted LOC (Complexity × Quality) các màn hình <em>bạn</em> hoàn thành, kiểm bằng demo code trực tiếp. Iteration 3 tính mọi màn hình bạn đã hoàn thành trong cả dự án.</li>
<li><strong>Gói nộp — 30%</strong> — chất lượng source code, script DB và RDS. Project Tracking và tài liệu khác thiếu/sai sẽ bị trừ (Subject Guides: tối đa 10% tổng điểm).</li>
<li><strong>Điểm iteration</strong> = điểm LOC × 0,7 + điểm gói nộp × 0,3. Sheet Refs của file mẫu ghi chú rằng ở iteration 3 trọng số gói nộp là 40%.</li>
<li><strong>OG</strong> = (iter1 × 15% + iter2 × 20% + iter3 × 25%) / 60% — phải ≥ 5, kèm điểm danh ≥ 80% và Final Presentation ≥ 5.</li>
</ul>
<div class="callout"><strong>LOC được quyết định ở buổi demo.</strong> Giảng viên mở màn hình <em>của bạn</em> trên bản build chung duy nhất của nhóm, thử các unhappy case, và có thể bắt bạn sửa code tại chỗ. Sheet Policies ghi: phải sửa được source trực tiếp trong vòng <strong>30 phút</strong> khi thầy yêu cầu — đó là cách thầy kiểm tra bạn có thật sự viết code đó.</div>`),
    bi(`<h3>7. The house rules — the template's Policies sheet, translated</h3>
<p>The sheet is short and written in Vietnamese; several lines decide whether you may defend at all ("không bảo vệ" = not allowed to defend).</p>
<table>
<thead><tr><th>Area</th><th>Rule (from the sheet)</th><th>What it means in practice</th></tr></thead>
<tbody>
<tr><td>Git</td><td>One account per member, with the FPT email.</td><td>No shared accounts; commits of a friend's laptop count for the friend.</td></tr>
<tr><td>Git</td><td>Commit and merge source code <strong>every day</strong>. Anyone who is not a contributor on git gets no LOC and no review.</td><td>Your LOC is only real if the history shows it came from you.</td></tr>
<tr><td>Git</td><td>No daily commits → minus points; committing weekly or only at the end of the iteration → <strong>not allowed to defend</strong>.</td><td>A single giant commit on the last night is the worst possible pattern.</td></tr>
<tr><td>Program</td><td>Validation is mandatory: Required (test blank and spaces), Length (text longer than the DB column — DB error? broken layout?), Format (date, email, mobile, image — only jpg, png…).</td><td>Unhappy cases are part of every screen, not an extra.</td></tr>
<tr><td>Program</td><td>Every data table must have search, filter, sort and paging.</td><td>A list screen without them is not a finished list screen.</td></tr>
<tr><td>Report</td><td>Send a daily report every day.</td><td>A short stand-up message in Slack; the weekly report summarises them.</td></tr>
<tr><td>Source (mandatory — otherwise not allowed to defend)</td><td>Integrate into the team's common source; the teacher does not review separate sources.</td><td>Physically: merge into main daily, demo on ONE copy of the source, not on each laptop. Logically: same format and CSS, same header/footer/menu, screens reachable from each other through the UI, never by typing a URL.</td></tr>
<tr><td>Source</td><td>Screens with similar UI share one code (Create, Update, View detail use the same JSP and model).</td><td>One <code>category-detail.jsp</code>, not three pages.</td></tr>
<tr><td>Source</td><td>One function used by several roles is coded once, with permissions by role (e.g. one View List Order for manager, shipper and staff).</td><td>No <code>AdminOrderList</code> + <code>StaffOrderList</code> copies.</td></tr>
<tr><td>Source</td><td>Header, footer, menu are coded once in a JSP and imported.</td><td><code>&lt;jsp:include page="/common/header.jsp"/&gt;</code></td></tr>
<tr><td>Source</td><td>You must be able to fix your code live within 30 minutes.</td><td>Know your own code; AI-pasted code you cannot explain is a liability.</td></tr>
<tr><td>UI</td><td>Wireframes show only the screen structure; draw them first and start coding only after the teacher confirms. Recommended tool: MockFlow.</td><td>Wireframe → OK → code, in that order.</td></tr>
<tr><td>DB</td><td>MySQL is mandatory.</td><td>The G5 sample used SQL Server; for your team the template says MySQL.</td></tr>
</tbody>
</table>`,
    `<h3>7. Luật nhà — sheet Policies của file mẫu, dịch đầy đủ</h3>
<p>Sheet này ngắn và viết bằng tiếng Việt; nhiều dòng quyết định bạn có được bảo vệ hay không.</p>
<table>
<thead><tr><th>Mảng</th><th>Luật (theo sheet)</th><th>Ý nghĩa thực tế</th></tr></thead>
<tbody>
<tr><td>Git</td><td>Mỗi thành viên chỉ dùng một account với email FPT.</td><td>Không dùng chung account; commit từ laptop của bạn khác sẽ tính cho bạn đó.</td></tr>
<tr><td>Git</td><td>Bắt buộc commit và merge source code <strong>hằng ngày</strong>. Ai không có contributor trên git sẽ không được tính LOC và thầy không review.</td><td>LOC của bạn chỉ thật khi lịch sử git cho thấy nó do bạn viết.</td></tr>
<tr><td>Git</td><td>Không commit hằng ngày → trừ điểm; commit hằng tuần hoặc cuối iteration mới commit → <strong>không bảo vệ</strong>.</td><td>Một commit khổng lồ đêm cuối là kiểu tệ nhất.</td></tr>
<tr><td>Chương trình</td><td>Bắt buộc validate: Required (thử nhập blank, space), Length (nhập dài quá cột DB — có lỗi DB không? có vỡ khung không?), Format (date, email, mobile, image — chỉ cho chọn file jpg, png…).</td><td>Unhappy case là một phần của mọi màn hình, không phải phần thêm.</td></tr>
<tr><td>Chương trình</td><td>Bảng dữ liệu bắt buộc có đủ search, filter, sort, paging.</td><td>Màn hình danh sách thiếu chúng thì chưa phải màn hình danh sách hoàn chỉnh.</td></tr>
<tr><td>Báo cáo</td><td>Bắt buộc gửi daily report hằng ngày.</td><td>Một tin nhắn stand-up ngắn trên Slack; báo cáo tuần tổng hợp lại.</td></tr>
<tr><td>Source (bắt buộc — không làm được thì không bảo vệ)</td><td>Phải tích hợp vào source chung của nhóm; thầy không review source riêng lẻ.</td><td>Về vật lý: merge vào main hằng ngày, demo trên MỘT bản source, không mỗi người một máy. Về logic: chung định dạng, CSS, chung header/footer/menu, các màn hình đi được sang nhau qua giao diện, không phải gõ URL.</td></tr>
<tr><td>Source</td><td>Các màn hình có UI tương tự dùng chung một code (Create, Update, View detail dùng chung JSP, model…).</td><td>Một <code>category-detail.jsp</code>, không phải ba trang.</td></tr>
<tr><td>Source</td><td>Một chức năng dùng cho nhiều role thì code chung một source, phân quyền thao tác theo role (ví dụ một View List Order cho cả manager, shipper, staff).</td><td>Không có bản sao <code>AdminOrderList</code> + <code>StaffOrderList</code>.</td></tr>
<tr><td>Source</td><td>Phần dùng chung như header, footer, menu code chung trong một JSP, các màn hình chỉ import vào.</td><td><code>&lt;jsp:include page="/common/header.jsp"/&gt;</code></td></tr>
<tr><td>Source</td><td>Phải sửa được source code trực tiếp khi thầy yêu cầu trong vòng 30 phút.</td><td>Hiểu code của mình; code AI dán vào mà không giải thích được là rủi ro.</td></tr>
<tr><td>UI</td><td>Wireframe chỉ cần vẽ cấu trúc màn hình, phải vẽ trước và giảng viên xác nhận OK mới bắt đầu code. Nên dùng MockFlow.</td><td>Wireframe → OK → code, đúng thứ tự đó.</td></tr>
<tr><td>DB</td><td>Bắt buộc dùng MySQL.</td><td>Mẫu G5 dùng SQL Server; với nhóm bạn file mẫu ghi MySQL.</td></tr>
</tbody>
</table>`),
    bi(`<h3>8. Mistakes that cost marks in every iteration</h3>
<ol>
<li><strong>No screen list before iteration 1</strong> — the teacher cannot plan or grade what was never agreed. Submit the Product sheet first.</li>
<li><strong>Coding before the wireframe is confirmed</strong> — the customer then asks for a different screen and your LOC is wasted.</li>
<li><strong>Everyone codes on his own laptop</strong> — three screens that work separately and a demo that crashes because they never met. Merge daily.</li>
<li><strong>Tracking file updated once, at the end</strong> — statuses that never moved from New while the code exists look like a copied project.</li>
<li><strong>Only happy cases</strong> — the screen stays at Quality L1 (50%), halving its LOC.</li>
<li><strong>Screens split so one person owns nothing complete</strong> — "Add" to one member, "Update" to another: neither can demo a whole function, and the template counts them as ONE screen anyway.</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>An iteration is a Scrum sprint with a teacher as Product Owner.</strong> Industry teams run the same loop — sprint planning (your Product sheet), daily stand-up (your daily report), sprint review/demo (your iteration demo) and a retrospective. Add the retrospective yourself: 15 minutes after each demo, list "keep / stop / try". Tracking the Converted LOC your team finished per iteration gives you a <em>velocity</em> — use it to size iteration 3 realistically instead of promising 8 screens each. <em>Outside the syllabus because the guides describe the deliverables, not the team ceremonies.</em></div>`,
    `<h3>8. Những lỗi làm mất điểm ở mọi iteration</h3>
<ol>
<li><strong>Không có danh sách màn hình trước iteration 1</strong> — giảng viên không thể lập kế hoạch hay chấm thứ chưa từng được thống nhất. Nộp sheet Product trước.</li>
<li><strong>Code trước khi wireframe được xác nhận</strong> — khách hàng đòi màn hình khác và LOC của bạn thành công cốc.</li>
<li><strong>Mỗi người code trên laptop riêng</strong> — ba màn hình chạy riêng thì được, demo chung thì sập vì chúng chưa từng gặp nhau. Merge hằng ngày.</li>
<li><strong>File tracking chỉ cập nhật một lần, lúc cuối</strong> — trạng thái nằm im ở New trong khi code đã có trông như dự án đi chép.</li>
<li><strong>Chỉ có happy case</strong> — màn hình kẹt ở Quality L1 (50%), LOC bị chia đôi.</li>
<li><strong>Chia màn hình đến mức không ai sở hữu trọn thứ gì</strong> — "Add" cho người này, "Update" cho người kia: không ai demo được một chức năng hoàn chỉnh, và file mẫu vẫn tính chúng là MỘT màn hình.</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Một iteration chính là một sprint Scrum với giảng viên làm Product Owner.</strong> Nhóm ngoài doanh nghiệp chạy đúng vòng lặp này — sprint planning (sheet Product của bạn), daily stand-up (daily report), sprint review/demo (buổi demo iteration) và retrospective. Hãy tự thêm retrospective: 15 phút sau mỗi buổi demo, ghi "giữ / bỏ / thử". Theo dõi tổng Converted LOC nhóm hoàn thành mỗi iteration cho bạn một <em>velocity</em> — dùng nó để định cỡ iteration 3 thực tế thay vì hứa mỗi người 8 màn hình. <em>Ngoài giáo trình vì các guide chỉ mô tả sản phẩm phải nộp, không mô tả các nghi thức của nhóm.</em></div>`),
    books([
      ['sommerville', 'Ch. 3 "Agile software development" (incremental delivery, Scrum sprints) and Ch. 23 "Project planning"', 'Chương 3 "Agile software development" (bàn giao tăng dần, sprint Scrum) và Chương 23 "Project planning"'],
      ['progit', 'Ch. 2.6 "Tagging" and Ch. 5 "Distributed Git" (integration workflows)', 'Mục 2.6 "Tagging" và Chương 5 "Distributed Git" (quy trình tích hợp)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 4.2 The Project Tracking workbook ─────────────────────── */
const L42 = {
  title: '4.2 — The Project Tracking workbook, sheet by sheet|||4.2 — File Project Tracking, từng sheet từng cột',
  slug: 'swp391-4-project-tracking-workbook',
  type: 'VIDEO',
  description: 'Giải thích từng sheet (Use Cases, Product, MasterData, Refs, Policies) và từng cột của file Project Tracking mẫu, so với file G5 đã điền; quy tắc thế nào là MỘT màn hình.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.2 · Template {ClassName}_{Group}_{System Name}_ProjectTracking.xlsx</span>
<h2>The Project Tracking workbook, sheet by sheet</h2>
<p class="lead">This Excel file is the contract between your team and the teacher: which screens exist, who owns each one, in which iteration, how big it is and how good it turned out. It is submitted at the end of every iteration, and it is the sheet the teacher opens when he grades your LOC.</p>
<div class="callout"><strong>After this lesson you can…</strong>
<ul>
<li>name the file correctly and say what each of its five sheets is for;</li>
<li>fill every column of the <strong>Product</strong> sheet for one of your screens;</li>
<li>apply the template's rules for what counts as <strong>one screen</strong>;</li>
<li>read the <strong>Refs</strong> sheet tables that turn a screen into LOC and a grade;</li>
<li>spot the mistakes in a real filled file (the G5 sample).</li>
</ul></div>
<p class="nhan">The file name</p>
<ul>
<li><strong>Pattern</strong> — <code>{ClassName}_{Group}_{System Name}_ProjectTracking.xlsx</code>.</li>
<li><strong>Example</strong> — <code>SE1804_G5_JobITForFreelancer_ProjectTracking.xlsx</code> (class SE1804, group 5, system "Job IT for Freelancer").</li>
</ul>
<h3>The five sheets at a glance</h3>
<table>
<thead><tr><th>Sheet</th><th>Question it answers</th><th>Who fills it</th><th>When</th></tr></thead>
<tbody>
<tr><td><strong>Use Cases</strong></td><td>What can each actor do in the system?</td><td>whole team (leader consolidates)</td><td>before ITER1, updated each iteration</td></tr>
<tr><td><strong>Product</strong></td><td>Which screens/functions, who, when, how big, how far, how good?</td><td>each PIC updates his own rows</td><td>planned before each iteration, progress daily/weekly</td></tr>
<tr><td><strong>MasterData</strong></td><td>Team list, LOC per member per iteration, iteration calendar, status definitions</td><td>leader (the LOC totals are formulas)</td><td>start of the project</td></tr>
<tr><td><strong>Refs</strong></td><td>How is complexity counted, how is quality rated, how does LOC become a grade?</td><td>nobody — the teacher's reference tables</td><td>read it before you plan</td></tr>
<tr><td><strong>Policies</strong></td><td>House rules for Git, program, report, source, UI, DB</td><td>nobody — the teacher's rules</td><td>read it on day 1 (translated in lesson 4.1)</td></tr>
</tbody>
</table>
<p class="ghi-chu">The 2024 G5 file has the same idea with older column names (BA/SRS/SDS/Coding/UT-IT progress, Complexity Simple/Medium/Complex). The 2026 template is what you fill — the G5 file is used below as a real-life comparison.</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.2 · File mẫu {ClassName}_{Group}_{System Name}_ProjectTracking.xlsx</span>
<h2>File Project Tracking, từng sheet từng cột</h2>
<p class="lead">File Excel này là "hợp đồng" giữa nhóm và giảng viên: có những màn hình nào, ai sở hữu từng cái, ở iteration nào, to cỡ nào và làm tốt tới đâu. Nó được nộp cuối mỗi iteration, và là sheet giảng viên mở ra khi chấm LOC của bạn.</p>
<div class="callout"><strong>Học xong bài này bạn có thể…</strong>
<ul>
<li>đặt tên file đúng và nói được công dụng của năm sheet;</li>
<li>điền mọi cột của sheet <strong>Product</strong> cho một màn hình của mình;</li>
<li>áp dụng quy tắc của file mẫu về thế nào là <strong>một màn hình</strong>;</li>
<li>đọc các bảng trong sheet <strong>Refs</strong> dùng để đổi một màn hình ra LOC và ra điểm;</li>
<li>chỉ ra lỗi trong một file thật đã điền (mẫu G5).</li>
</ul></div>
<p class="nhan">Tên file</p>
<ul>
<li><strong>Mẫu</strong> — <code>{ClassName}_{Group}_{System Name}_ProjectTracking.xlsx</code>.</li>
<li><strong>Ví dụ</strong> — <code>SE1804_G5_JobITForFreelancer_ProjectTracking.xlsx</code> (lớp SE1804, nhóm 5, hệ thống "Job IT for Freelancer").</li>
</ul>
<h3>Năm sheet trong một bảng</h3>
<table>
<thead><tr><th>Sheet</th><th>Trả lời câu hỏi</th><th>Ai điền</th><th>Khi nào</th></tr></thead>
<tbody>
<tr><td><strong>Use Cases</strong></td><td>Mỗi actor làm được gì trong hệ thống?</td><td>cả nhóm (leader tổng hợp)</td><td>trước ITER1, cập nhật mỗi iteration</td></tr>
<tr><td><strong>Product</strong></td><td>Màn hình/chức năng nào, ai, khi nào, to cỡ nào, tới đâu, tốt tới đâu?</td><td>mỗi PIC tự cập nhật dòng của mình</td><td>lập trước mỗi iteration, tiến độ cập nhật hằng ngày/tuần</td></tr>
<tr><td><strong>MasterData</strong></td><td>Danh sách nhóm, LOC mỗi người mỗi iteration, lịch iteration, định nghĩa trạng thái</td><td>leader (tổng LOC là công thức)</td><td>đầu dự án</td></tr>
<tr><td><strong>Refs</strong></td><td>Đếm độ phức tạp thế nào, chấm chất lượng thế nào, LOC thành điểm ra sao?</td><td>không ai — bảng tham chiếu của giảng viên</td><td>đọc trước khi lập kế hoạch</td></tr>
<tr><td><strong>Policies</strong></td><td>Luật nhà về Git, chương trình, báo cáo, source, UI, DB</td><td>không ai — luật của giảng viên</td><td>đọc ngay ngày đầu (đã dịch ở bài 4.1)</td></tr>
</tbody>
</table>
<p class="ghi-chu">File G5 năm 2024 cùng ý tưởng nhưng tên cột cũ hơn (tiến độ BA/SRS/SDS/Coding/UT-IT, Complexity Simple/Medium/Complex). Bạn điền theo file mẫu 2026 — file G5 được dùng bên dưới để so sánh với thực tế.</p>`),
    bi(`<h3>Sheet 1 — Use Cases</h3>
<p class="nhan">Columns</p>
<ul>
<li><strong>#</strong> — use case ID, UC1 … UC52 pre-numbered.</li>
<li><strong>Use case</strong> — a verb phrase from the actor's point of view: "Search freelancer", "Views post details".</li>
<li><strong>Screen/Function</strong> (the G5 file calls it <em>Feature</em>) — the feature group it belongs to: "Common Feature", "Recruiter feature"…</li>
<li><strong>One column per actor</strong> — Freelancer, Recruiter, Admin, Guest; an <code>x</code> means the actor can perform it. Rename them to your own actors.</li>
<li><strong>Use case description</strong> — one sentence: "This use case allows … to …".</li>
</ul>
<p class="nhan">Rows as they appear (the template ships with the G5 system's use cases)</p>
<table>
<thead><tr><th>#</th><th>Use case</th><th>Freelancer</th><th>Recruiter</th><th>Admin</th><th>Guest</th></tr></thead>
<tbody>
<tr><td>UC1</td><td>Login System</td><td>x</td><td>x</td><td>x</td><td>x</td></tr>
<tr><td>UC7</td><td>Search freelancer</td><td>x</td><td>x</td><td>x</td><td>x</td></tr>
<tr><td>UC9</td><td>Create news post</td><td></td><td>x</td><td></td><td></td></tr>
<tr><td>UC19</td><td>Change status account freelancer</td><td></td><td></td><td>x</td><td></td></tr>
<tr><td>UC37</td><td>View Category</td><td></td><td></td><td>x</td><td></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Copy-pasted descriptions — caught in the real file.</strong> In the G5 sheet UC3 "Forgot password" is described as "…allows previously logged in users to log out", UC5 "Change Password" as "…allows guests to create a new user account", UC10 "Views post details" as "…allows users to change their password". The descriptions were pasted from an e-commerce project and never re-read. The teacher's note kept in that file reads: "Sai và loạn hết các khái niệm, không đồng bộ giữa các màn hình" — <em>wrong and confused concepts, inconsistent across screens</em>.</div>
<p class="nhan">How to fill it well</p>
<ol>
<li>Start from the actors and the context diagram of your RDS; list goals, not buttons.</li>
<li>Write each description yourself and read it aloud against the use case name.</li>
<li>Keep the IDs stable — the RDS, the Product sheet and the GitLab issues refer to them.</li>
</ol>`,
    `<h3>Sheet 1 — Use Cases</h3>
<p class="nhan">Các cột</p>
<ul>
<li><strong>#</strong> — mã use case, đánh số sẵn UC1 … UC52.</li>
<li><strong>Use case</strong> — cụm động từ theo góc nhìn actor: "Search freelancer", "Views post details".</li>
<li><strong>Screen/Function</strong> (file G5 gọi là <em>Feature</em>) — nhóm tính năng chứa nó: "Common Feature", "Recruiter feature"…</li>
<li><strong>Mỗi actor một cột</strong> — Freelancer, Recruiter, Admin, Guest; dấu <code>x</code> nghĩa là actor đó thực hiện được. Đổi tên thành actor của hệ thống bạn.</li>
<li><strong>Use case description</strong> — một câu: "This use case allows … to …".</li>
</ul>
<p class="nhan">Các dòng như trong file (file mẫu đi kèm sẵn use case của hệ thống G5)</p>
<table>
<thead><tr><th>#</th><th>Use case</th><th>Freelancer</th><th>Recruiter</th><th>Admin</th><th>Guest</th></tr></thead>
<tbody>
<tr><td>UC1</td><td>Login System</td><td>x</td><td>x</td><td>x</td><td>x</td></tr>
<tr><td>UC7</td><td>Search freelancer</td><td>x</td><td>x</td><td>x</td><td>x</td></tr>
<tr><td>UC9</td><td>Create news post</td><td></td><td>x</td><td></td><td></td></tr>
<tr><td>UC19</td><td>Change status account freelancer</td><td></td><td></td><td>x</td><td></td></tr>
<tr><td>UC37</td><td>View Category</td><td></td><td></td><td>x</td><td></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Mô tả copy-paste — bị bắt ngay trong file thật.</strong> Trong sheet của G5, UC3 "Forgot password" được mô tả là "…cho người đã đăng nhập đăng xuất", UC5 "Change Password" là "…cho khách tạo tài khoản mới", UC10 "Views post details" là "…cho người dùng đổi mật khẩu". Các mô tả được dán từ một dự án thương mại điện tử và không ai đọc lại. Ghi chú của giảng viên còn lưu trong file: "Sai và loạn hết các khái niệm, không đồng bộ giữa các màn hình".</div>
<p class="nhan">Điền cho tốt</p>
<ol>
<li>Bắt đầu từ actor và context diagram trong RDS; liệt kê mục tiêu, không liệt kê nút bấm.</li>
<li>Tự viết từng mô tả và đọc to đối chiếu với tên use case.</li>
<li>Giữ mã ổn định — RDS, sheet Product và issue GitLab đều tham chiếu tới chúng.</li>
</ol>`),
    bi(`<h3>Sheet 2 — Product (the one the teacher grades from)</h3>
<p>One row = one screen or function. Rows 2–3 are a two-level header; row 1 holds the totals and the progress weights.</p>
<table>
<thead><tr><th>Col</th><th>Header</th><th>What to write</th><th>Example (template row F_10)</th></tr></thead>
<tbody>
<tr><td>A</td><td>#</td><td>Row ID <code>F_01</code>, <code>F_02</code>…</td><td>F_10</td></tr>
<tr><td>B</td><td>Feature</td><td>Group name, written once on the first row of the group</td><td>Product Management</td></tr>
<tr><td>C</td><td>Screen/Function</td><td>The screen as the user sees it</td><td>Add/Update/View Product Detail</td></tr>
<tr><td>D</td><td>Screen/Function Details</td><td>What the screen <em>includes</em> — this is where the counting rules are written</td><td>"View detail, create, update count as one screen (share the code too)"</td></tr>
<tr><td>E</td><td>Complexity</td><td>Level 1 … Level 5 (Refs goes up to 7)</td><td>Level 3</td></tr>
<tr><td>F</td><td>Complexity-Check</td><td>The rule for that level, filled automatically</td><td>8-9 fields OR 4 trans</td></tr>
<tr><td>G</td><td>Bug</td><td>Number of defects logged for the screen</td><td>—</td></tr>
<tr><td>H · I</td><td>Mark: Program · Doc</td><td>The teacher's marks for the code and for the document part</td><td>—</td></tr>
<tr><td>J</td><td>Comments</td><td>Teacher's review comments (why ToDo)</td><td>—</td></tr>
<tr><td>K</td><td>LOC: Plan</td><td>Converted LOC of the level (Refs table)</td><td>120</td></tr>
<tr><td>L</td><td>LOC: Grade</td><td>Plan × Quality rate — the LOC you actually earn</td><td>60 (= 120 × 0.5)</td></tr>
<tr><td>M</td><td>PIC</td><td>Person in charge — exactly one name</td><td>Dev4</td></tr>
<tr><td>N · O</td><td>Plan: Planned · Actual</td><td>Iteration planned (ITER1/2/3) and the one it really finished in</td><td>ITER1 · —</td></tr>
<tr><td>P · Q · R · S</td><td>Progress: RDS · SDS · Coding · Test</td><td>Status of each phase: New / Doing / Done / ToDo / Completed</td><td>New · New · New · New</td></tr>
<tr><td>T</td><td>Quality</td><td>L1_Happy Cases / L2_All Cases (Refs adds L3_Optimized)</td><td>L1_Happy Cases</td></tr>
<tr><td>U</td><td>Note</td><td>Anything else</td><td>—</td></tr>
</tbody>
</table>
<p class="nhan">Row 1 — totals and weights</p>
<ul>
<li><strong>K1 · L1</strong> — 2730 and 1380 in the template: the planned LOC and the graded LOC of the rows below.</li>
<li><strong>P1 … S1</strong> — 0.3 · 0.1 · 0.5 · 0.1: the weight of each phase in the progress of a screen — requirement (RDS) 30%, design (SDS) 10%, coding 50%, test 10%. The G5 file used 0.1 BA · 0.1 SRS · 0.1 SDS · 0.5 Coding · 0.2 UT/IT.</li>
<li><strong>T1</strong> — 0.3: the package (non-LOC) weight used in the grade (Refs sheet).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a screen whose Coding is Done but RDS is New is only about 50% done in this sheet — the document part is not optional.</p>`,
    `<h3>Sheet 2 — Product (sheet giảng viên dùng để chấm)</h3>
<p>Một dòng = một màn hình hoặc một chức năng. Dòng 2–3 là tiêu đề hai tầng; dòng 1 chứa tổng và trọng số tiến độ.</p>
<table>
<thead><tr><th>Cột</th><th>Tiêu đề</th><th>Ghi gì</th><th>Ví dụ (dòng F_10 của file mẫu)</th></tr></thead>
<tbody>
<tr><td>A</td><td>#</td><td>Mã dòng <code>F_01</code>, <code>F_02</code>…</td><td>F_10</td></tr>
<tr><td>B</td><td>Feature</td><td>Tên nhóm, chỉ ghi ở dòng đầu của nhóm</td><td>Product Management</td></tr>
<tr><td>C</td><td>Screen/Function</td><td>Màn hình theo cách người dùng nhìn thấy</td><td>Add/Update/View Product Detail</td></tr>
<tr><td>D</td><td>Screen/Function Details</td><td>Màn hình <em>bao gồm</em> những gì — nơi ghi các quy tắc đếm</td><td>"View detail, create, update tính chung 1 màn hình (cũng cần code dùng chung)"</td></tr>
<tr><td>E</td><td>Complexity</td><td>Level 1 … Level 5 (Refs có tới 7)</td><td>Level 3</td></tr>
<tr><td>F</td><td>Complexity-Check</td><td>Quy tắc của level đó, tự điền</td><td>8-9 fields OR 4 trans</td></tr>
<tr><td>G</td><td>Bug</td><td>Số defect đã ghi cho màn hình</td><td>—</td></tr>
<tr><td>H · I</td><td>Mark: Program · Doc</td><td>Điểm giảng viên chấm cho code và cho phần tài liệu</td><td>—</td></tr>
<tr><td>J</td><td>Comments</td><td>Nhận xét review của giảng viên (vì sao bị ToDo)</td><td>—</td></tr>
<tr><td>K</td><td>LOC: Plan</td><td>Converted LOC của level (bảng Refs)</td><td>120</td></tr>
<tr><td>L</td><td>LOC: Grade</td><td>Plan × hệ số Quality — LOC bạn thật sự nhận</td><td>60 (= 120 × 0,5)</td></tr>
<tr><td>M</td><td>PIC</td><td>Người phụ trách — đúng một tên</td><td>Dev4</td></tr>
<tr><td>N · O</td><td>Plan: Planned · Actual</td><td>Iteration dự kiến (ITER1/2/3) và iteration thật sự xong</td><td>ITER1 · —</td></tr>
<tr><td>P · Q · R · S</td><td>Progress: RDS · SDS · Coding · Test</td><td>Trạng thái từng pha: New / Doing / Done / ToDo / Completed</td><td>New · New · New · New</td></tr>
<tr><td>T</td><td>Quality</td><td>L1_Happy Cases / L2_All Cases (Refs có thêm L3_Optimized)</td><td>L1_Happy Cases</td></tr>
<tr><td>U</td><td>Note</td><td>Ghi chú khác</td><td>—</td></tr>
</tbody>
</table>
<p class="nhan">Dòng 1 — tổng và trọng số</p>
<ul>
<li><strong>K1 · L1</strong> — 2730 và 1380 trong file mẫu: tổng LOC kế hoạch và tổng LOC được chấm của các dòng bên dưới.</li>
<li><strong>P1 … S1</strong> — 0,3 · 0,1 · 0,5 · 0,1: trọng số từng pha trong tiến độ một màn hình — yêu cầu (RDS) 30%, thiết kế (SDS) 10%, code 50%, test 10%. File G5 dùng 0,1 BA · 0,1 SRS · 0,1 SDS · 0,5 Coding · 0,2 UT/IT.</li>
<li><strong>T1</strong> — 0,3: trọng số phần gói nộp (không phải LOC) dùng khi tính điểm (sheet Refs).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> màn hình có Coding đã Done mà RDS còn New thì theo sheet này mới xong khoảng 50% — phần tài liệu không phải tuỳ chọn.</p>`),
    bi(`<h3>What counts as ONE screen — the rules written in column D</h3>
<p>The template's "Screen/Function Details" column is where the teacher wrote the counting rules. Quoted (original Vietnamese in quotes, translation after):</p>
<table>
<thead><tr><th>Kind of screen</th><th>Rule in the template</th><th>Translation</th></tr></thead>
<tbody>
<tr><td>Detail screen</td><td>"View detail, create, update tính chung 1 màn hình (Cũng cần code dùng chung)"</td><td>view detail + create + update count as <strong>one</strong> screen — and must share the code</td></tr>
<tr><td>List screen</td><td>"Bao gồm cả delete, reject, filter, search, sort, pagging tính chung 1 màn hình"</td><td>the list <strong>includes</strong> delete, reject, filter, search, sort, paging — all one screen</td></tr>
<tr><td>Home page</td><td>"Màn hình chính cần có đủ tìm kiếm, phân trang, xem chi tiết với đầy đủ category, số lượng sản phẩm cũng cần theo category"</td><td>must have search, paging, links to details, every category, and item counts per category</td></tr>
<tr><td>Dashboard</td><td>"Chỉ 1 dashboard duy nhất, thực hiện phân quyền view theo user"</td><td>only ONE dashboard, its view filtered by the user's role</td></tr>
<tr><td>Layout</td><td>"Làm phần Header/Footer/Menu đã phân quyền cho các member khác import vào source"</td><td>build the role-aware header/footer/menu for the others to import — it is a row of its own (Level 2)</td></tr>
<tr><td>Payment</td><td>"Thanh toán, gồm cả màn hình lựa chọn phương pháp thanh toán (COD/VNPAY)"</td><td>payment includes the screen that chooses the method (COD/VNPAY)</td></tr>
<tr><td>Payment info</td><td>"Gồm cả xuất hóa đơn, xem lịch sử mua hàng"</td><td>includes exporting the invoice and the purchase history</td></tr>
<tr><td>Order detail</td><td>"Xem order và thay đổi status của order"</td><td>view the order and change its status</td></tr>
</tbody>
</table>
<h3>G5 (2024) vs the 2026 rules — the Categories example</h3>
<p>The G5 file listed the admin's category work as <strong>seven</strong> rows, each "Simple, 60 LOC". Under the 2026 template the same work is <strong>two</strong> screens:</p>
<table>
<thead><tr><th>G5 rows (each Simple = 60)</th><th>2026 screen</th><th>Level (lesson 4.3)</th><th>LOC Plan</th></tr></thead>
<tbody>
<tr><td>View list categories · Delete categories · Filter category · Active category</td><td><strong>Category list</strong> (search, filter, sort, paging, deactivate/activate)</td><td>Level 4</td><td>150</td></tr>
<tr><td>Add categories · Update categories · Views details category</td><td><strong>Category detail</strong> (view / add / update)</td><td>Level 3</td><td>120</td></tr>
<tr><td><em>total 7 × 60 = 420</em></td><td><em>total</em></td><td></td><td><em>270</em></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>"More rows = more LOC" does not work any more.</strong> Splitting one list into "View / Delete / Filter / Search" rows looks like four screens, but the teacher merges them into one row when grading — and a list without search/filter/sort/paging is simply unfinished (Policies). Plan in the 2026 unit from the start.</div>`,
    `<h3>Thế nào là MỘT màn hình — quy tắc viết ở cột D</h3>
<p>Cột "Screen/Function Details" của file mẫu là nơi giảng viên viết quy tắc đếm. Trích nguyên văn:</p>
<table>
<thead><tr><th>Loại màn hình</th><th>Quy tắc trong file mẫu</th><th>Hiểu là</th></tr></thead>
<tbody>
<tr><td>Màn hình chi tiết</td><td>"View detail, create, update tính chung 1 màn hình (Cũng cần code dùng chung)"</td><td>xem chi tiết + thêm + sửa tính là <strong>một</strong> màn hình — và phải dùng chung code</td></tr>
<tr><td>Màn hình danh sách</td><td>"Bao gồm cả delete, reject, filter, search, sort, pagging tính chung 1 màn hình"</td><td>danh sách <strong>bao gồm</strong> xoá, từ chối, lọc, tìm, sắp xếp, phân trang — tất cả là một màn hình</td></tr>
<tr><td>Trang chủ</td><td>"Màn hình chính cần có đủ tìm kiếm, phân trang, xem chi tiết với đầy đủ category, số lượng sản phẩm cũng cần theo category"</td><td>phải có tìm kiếm, phân trang, link xem chi tiết, đủ category, và số lượng theo từng category</td></tr>
<tr><td>Dashboard</td><td>"Chỉ 1 dashboard duy nhất, thực hiện phân quyền view theo user"</td><td>chỉ MỘT dashboard, nội dung hiển thị lọc theo role người dùng</td></tr>
<tr><td>Layout</td><td>"Làm phần Header/Footer/Menu đã phân quyền cho các member khác import vào source"</td><td>làm header/footer/menu theo role cho các thành viên khác import — là một dòng riêng (Level 2)</td></tr>
<tr><td>Thanh toán</td><td>"Thanh toán, gồm cả màn hình lựa chọn phương pháp thanh toán (COD/VNPAY)"</td><td>thanh toán gồm cả màn hình chọn phương thức (COD/VNPAY)</td></tr>
<tr><td>Thông tin thanh toán</td><td>"Gồm cả xuất hóa đơn, xem lịch sử mua hàng"</td><td>gồm cả xuất hoá đơn và lịch sử mua hàng</td></tr>
<tr><td>Chi tiết đơn</td><td>"Xem order và thay đổi status của order"</td><td>xem đơn và đổi trạng thái đơn</td></tr>
</tbody>
</table>
<h3>G5 (2024) so với quy tắc 2026 — ví dụ Categories</h3>
<p>File G5 ghi phần việc category của admin thành <strong>bảy</strong> dòng, mỗi dòng "Simple, 60 LOC". Theo file mẫu 2026, cùng khối việc đó chỉ là <strong>hai</strong> màn hình:</p>
<table>
<thead><tr><th>Các dòng của G5 (mỗi dòng Simple = 60)</th><th>Màn hình theo 2026</th><th>Level (bài 4.3)</th><th>LOC Plan</th></tr></thead>
<tbody>
<tr><td>View list categories · Delete categories · Filter category · Active category</td><td><strong>Category list</strong> (tìm, lọc, sắp xếp, phân trang, vô hiệu/kích hoạt)</td><td>Level 4</td><td>150</td></tr>
<tr><td>Add categories · Update categories · Views details category</td><td><strong>Category detail</strong> (xem / thêm / sửa)</td><td>Level 3</td><td>120</td></tr>
<tr><td><em>tổng 7 × 60 = 420</em></td><td><em>tổng</em></td><td></td><td><em>270</em></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>"Nhiều dòng = nhiều LOC" không còn đúng.</strong> Tách một danh sách thành các dòng "View / Delete / Filter / Search" trông như bốn màn hình, nhưng khi chấm giảng viên gộp lại thành một dòng — và danh sách thiếu tìm/lọc/sắp xếp/phân trang thì đơn giản là chưa xong (Policies). Lập kế hoạch theo đơn vị 2026 ngay từ đầu.</div>`),
    bi(`<h3>Sheet 3 — MasterData</h3>
<p class="nhan">Block 1 — team LOC per iteration (formulas)</p>
<table>
<thead><tr><th>TEAM</th><th>ITER1 Mark · LOC</th><th>ITER2 Mark · LOC</th><th>ITER3 Mark · LOC</th><th>SUM</th></tr></thead>
<tbody>
<tr><td>Dev1</td><td>0 · 360</td><td>0 · 0</td><td>0 · 0</td><td>360</td></tr>
<tr><td>Dev2</td><td>0 · 240</td><td>0 · 0</td><td>0 · 0</td><td>240</td></tr>
<tr><td>Dev3</td><td>0 · 90</td><td>0 · 270</td><td>0 · 0</td><td>360</td></tr>
<tr><td>Dev4</td><td>0 · 210</td><td>0 · 1320</td><td>0 · 240</td><td>1770</td></tr>
<tr><td>Dev5</td><td>0 · 0</td><td>0 · 0</td><td>0 · 0</td><td>0</td></tr>
</tbody>
</table>
<p>The LOC cells add up the planned LOC of each PIC's rows per iteration. Read the template's numbers as a warning: one member planned 1,320 LOC in ITER2 while another has 0 — exactly the unfair split lesson 4.3 teaches you to avoid. (Names in the template are replaced by Dev1…Dev5 here.)</p>
<p class="nhan">Block 2 — iteration calendar</p>
<ul>
<li><strong>ITERATOR · Start · End · Demo</strong> — one row per iteration, e.g. ITER1 10/8/2026 → 14/8/2026, demo 14–17/8/2026.</li>
<li><strong>Target LOC</strong> — the template writes 180 LOC (ITER1), 240 (ITER2), 180 (ITER3), total 600 — another variant of MaxLOC; confirm with your teacher.</li>
</ul>
<p class="nhan">Block 3 — STATUS definitions</p>
<ul><li>New · Doing · Done · ToDo · Completed — defined in lesson 4.1, and the only values allowed in the progress columns.</li></ul>
<h3>Sheet 4 — Refs (the teacher's reference tables)</h3>
<p class="nhan">Table 1 — "how many screens do I need?" (whole project, divisor 660)</p>
<table>
<thead><tr><th>Item</th><th>Failed</th><th colspan="3">Normal cases</th><th>Best case</th></tr></thead>
<tbody>
<tr><td>No of screens/functions (all happy cases done)</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>
<tr><td>Maximum LOC (C) — 120 per screen</td><td>480</td><td>600</td><td>720</td><td>840</td><td>960</td></tr>
<tr><td>Quality level (Q)</td><td>0.5</td><td>0.5</td><td>0.75</td><td>0.75</td><td>0.75</td></tr>
<tr><td>Evaluated LOC = C × Q</td><td>240</td><td>300</td><td>540</td><td>630</td><td>720</td></tr>
<tr><td>LOC Grade (LG) = LOC × 10 / 660 — weight 0.7</td><td>3.64</td><td>4.55</td><td>8.18</td><td>9.55</td><td>10.91</td></tr>
<tr><td>Non-LOC grade (package) — weight 0.3 (0.4 in iter3)</td><td>6</td><td>6</td><td>7</td><td>7</td><td>8</td></tr>
<tr><td><strong>Grade /10</strong></td><td><strong>4.35</strong></td><td><strong>4.98</strong></td><td><strong>7.83</strong></td><td><strong>8.78</strong></td><td><strong>10.04</strong></td></tr>
</tbody>
</table>
<p class="ghi-chu">"120 per screen" is the average of Levels 2–3–4 ("L2-3-4 = 33%, 33%, 33%" in the sheet). Five happy-case-only screens over the whole project still fail; six screens with unhappy cases handled score about 7.8.</p>
<p class="nhan">Tables 2–4 — complexity levels, quality levels, bug norm</p>
<ul>
<li><strong>Complexity levels</strong> — Level 1 = 60 LOC up to Level 7 = 240 LOC, step 30; counted by fields OR transactions (lesson 4.3 explains the counting).</li>
<li><strong>Quality levels</strong> — L1_Happy Cases 0.5 · L2_All Cases 0.75 · L3_Optimized 1.0.</li>
<li><strong>Bug column</strong> — Norm = 52: each level carries an expected number of defects, LOC × 52 / 1000 (Level 1 → 3.12 … Level 7 → 12.48). Read it as "a screen of this size normally yields about this many defects when tested" — logging none suggests nobody tested.</li>
</ul>
<h3>Sheet 5 — Policies</h3>
<p>The house rules — translated line by line in lesson 4.1, section 7.</p>`,
    `<h3>Sheet 3 — MasterData</h3>
<p class="nhan">Khối 1 — LOC của nhóm theo iteration (công thức)</p>
<table>
<thead><tr><th>TEAM</th><th>ITER1 Mark · LOC</th><th>ITER2 Mark · LOC</th><th>ITER3 Mark · LOC</th><th>SUM</th></tr></thead>
<tbody>
<tr><td>Dev1</td><td>0 · 360</td><td>0 · 0</td><td>0 · 0</td><td>360</td></tr>
<tr><td>Dev2</td><td>0 · 240</td><td>0 · 0</td><td>0 · 0</td><td>240</td></tr>
<tr><td>Dev3</td><td>0 · 90</td><td>0 · 270</td><td>0 · 0</td><td>360</td></tr>
<tr><td>Dev4</td><td>0 · 210</td><td>0 · 1320</td><td>0 · 240</td><td>1770</td></tr>
<tr><td>Dev5</td><td>0 · 0</td><td>0 · 0</td><td>0 · 0</td><td>0</td></tr>
</tbody>
</table>
<p>Ô LOC cộng LOC kế hoạch các dòng của từng PIC theo iteration. Hãy đọc số trong file mẫu như một lời cảnh báo: một người lên kế hoạch 1.320 LOC ở ITER2 trong khi người khác 0 — đúng kiểu chia việc lệch mà bài 4.3 dạy bạn tránh. (Tên trong file mẫu được thay bằng Dev1…Dev5.)</p>
<p class="nhan">Khối 2 — lịch iteration</p>
<ul>
<li><strong>ITERATOR · Start · End · Demo</strong> — mỗi iteration một dòng, ví dụ ITER1 10/8/2026 → 14/8/2026, demo 14–17/8/2026.</li>
<li><strong>LOC mục tiêu</strong> — file mẫu ghi 180 LOC (ITER1), 240 (ITER2), 180 (ITER3), tổng 600 — thêm một biến thể MaxLOC; hãy hỏi lại giảng viên.</li>
</ul>
<p class="nhan">Khối 3 — định nghĩa STATUS</p>
<ul><li>New · Doing · Done · ToDo · Completed — đã định nghĩa ở bài 4.1, và là các giá trị duy nhất được dùng trong cột tiến độ.</li></ul>
<h3>Sheet 4 — Refs (bảng tham chiếu của giảng viên)</h3>
<p class="nhan">Bảng 1 — "tôi cần bao nhiêu màn hình?" (cả dự án, chia cho 660)</p>
<table>
<thead><tr><th>Mục</th><th>Trượt</th><th colspan="3">Trường hợp bình thường</th><th>Tốt nhất</th></tr></thead>
<tbody>
<tr><td>Số màn hình/chức năng (xong đủ happy case)</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>
<tr><td>LOC tối đa (C) — 120 mỗi màn hình</td><td>480</td><td>600</td><td>720</td><td>840</td><td>960</td></tr>
<tr><td>Mức chất lượng (Q)</td><td>0,5</td><td>0,5</td><td>0,75</td><td>0,75</td><td>0,75</td></tr>
<tr><td>LOC đạt được = C × Q</td><td>240</td><td>300</td><td>540</td><td>630</td><td>720</td></tr>
<tr><td>Điểm LOC (LG) = LOC × 10 / 660 — trọng số 0,7</td><td>3,64</td><td>4,55</td><td>8,18</td><td>9,55</td><td>10,91</td></tr>
<tr><td>Điểm không-LOC (gói nộp) — trọng số 0,3 (iter3 là 0,4)</td><td>6</td><td>6</td><td>7</td><td>7</td><td>8</td></tr>
<tr><td><strong>Điểm /10</strong></td><td><strong>4,35</strong></td><td><strong>4,98</strong></td><td><strong>7,83</strong></td><td><strong>8,78</strong></td><td><strong>10,04</strong></td></tr>
</tbody>
</table>
<p class="ghi-chu">"120 mỗi màn hình" là trung bình của Level 2–3–4 ("L2-3-4 = 33%, 33%, 33%" trong sheet). Năm màn hình chỉ có happy case cho cả dự án vẫn trượt; sáu màn hình có xử lý unhappy case được khoảng 7,8.</p>
<p class="nhan">Bảng 2–4 — level độ phức tạp, mức chất lượng, định mức bug</p>
<ul>
<li><strong>Level độ phức tạp</strong> — Level 1 = 60 LOC tới Level 7 = 240 LOC, bước 30; đếm theo field HOẶC transaction (bài 4.3 giải thích cách đếm).</li>
<li><strong>Mức chất lượng</strong> — L1_Happy Cases 0,5 · L2_All Cases 0,75 · L3_Optimized 1,0.</li>
<li><strong>Cột Bug</strong> — Norm = 52: mỗi level kèm số defect kỳ vọng, LOC × 52 / 1000 (Level 1 → 3,12 … Level 7 → 12,48). Hiểu là "màn hình cỡ này khi test thường lộ ra chừng ấy defect" — không ghi defect nào cho thấy chưa ai test.</li>
</ul>
<h3>Sheet 5 — Policies</h3>
<p>Luật nhà — đã dịch từng dòng ở bài 4.1, mục 7.</p>`),
    bi(`<h3>Worked example — filling your rows for ITER1</h3>
<p>Member B of our Job IT for Freelancer team owns the admin's category work plus the password functions. His three rows, the day the plan is submitted and at the end of ITER1:</p>
<table>
<thead><tr><th>#</th><th>Screen/Function</th><th>Details</th><th>Complexity</th><th>LOC Plan</th><th>PIC</th><th>Plan</th><th>RDS · SDS · Coding · Test</th><th>Quality</th><th>LOC Grade</th></tr></thead>
<tbody>
<tr><td>F_08</td><td>Category list</td><td>includes search, status filter, sort, paging, deactivate</td><td>Level 4</td><td>150</td><td>Member B</td><td>ITER1</td><td>New → Completed ×4</td><td>L1_Happy Cases</td><td>75</td></tr>
<tr><td>F_09</td><td>Category detail</td><td>view detail, create, update — one JSP</td><td>Level 3</td><td>120</td><td>Member B</td><td>ITER1</td><td>New → Completed ×4</td><td>L2_All Cases</td><td>90</td></tr>
<tr><td>F_03</td><td>Forgot / Change password</td><td>e-mail token + change form</td><td>Level 3</td><td>120</td><td>Member B</td><td>ITER1</td><td>Completed · Completed · Completed · ToDo</td><td>L1_Happy Cases</td><td>60</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Member B earns 75 + 90 + 60 = <strong>225 Converted LOC</strong> in ITER1. The password row went back to ToDo because the expired-token case was not handled — fixing it in ITER2 can lift it to L2.</p>
<p class="nhan">The weekly routine that keeps the file honest</p>
<ol>
<li><strong>Every day</strong> — update the progress cells of the rows you touched; drag the matching GitLab issue.</li>
<li><strong>Every week</strong> — the leader checks that each PIC has 3–4 rows in the current iteration and that the MasterData totals are balanced; the weekly report quotes the file.</li>
<li><strong>End of iteration</strong> — set the Actual column, fill the Bug column from the Defect issues, add next iteration's rows with PIC and level, then submit.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Mistakes seen in real files.</strong> Copy-pasted use case descriptions; an empty Details column (so nobody knows what the screen includes); two PICs on one row; screens planned with no level; statuses still New at the demo; the Quality column left blank (the G5 row "Activate Skills" has no quality and a LOC grade of 0).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>A requirements traceability matrix in disguise.</strong> Use case ID → screen row → GitLab issue → RDS section → commit → test case: if every link exists, you can answer "is this requirement built and tested?" in one minute. Industry tools (Jira + Confluence, Azure DevOps) automate these links; in SWP391 you get the same benefit by writing the use case ID in the issue title and the commit message, e.g. <code>git commit -m "UC37 category list: add paging"</code>. <em>Outside the syllabus because the template does not ask for explicit trace links.</em></div>`,
    `<h3>Ví dụ có lời giải — điền các dòng của bạn cho ITER1</h3>
<p>Thành viên B của nhóm Job IT for Freelancer sở hữu phần category của admin và các chức năng mật khẩu. Ba dòng của B, lúc nộp kế hoạch và lúc kết thúc ITER1:</p>
<table>
<thead><tr><th>#</th><th>Screen/Function</th><th>Details</th><th>Complexity</th><th>LOC Plan</th><th>PIC</th><th>Plan</th><th>RDS · SDS · Coding · Test</th><th>Quality</th><th>LOC Grade</th></tr></thead>
<tbody>
<tr><td>F_08</td><td>Category list</td><td>gồm tìm kiếm, lọc trạng thái, sắp xếp, phân trang, vô hiệu hoá</td><td>Level 4</td><td>150</td><td>Thành viên B</td><td>ITER1</td><td>New → Completed ×4</td><td>L1_Happy Cases</td><td>75</td></tr>
<tr><td>F_09</td><td>Category detail</td><td>xem chi tiết, thêm, sửa — một JSP</td><td>Level 3</td><td>120</td><td>Thành viên B</td><td>ITER1</td><td>New → Completed ×4</td><td>L2_All Cases</td><td>90</td></tr>
<tr><td>F_03</td><td>Forgot / Change password</td><td>token qua e-mail + form đổi mật khẩu</td><td>Level 3</td><td>120</td><td>Thành viên B</td><td>ITER1</td><td>Completed · Completed · Completed · ToDo</td><td>L1_Happy Cases</td><td>60</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Thành viên B nhận 75 + 90 + 60 = <strong>225 Converted LOC</strong> ở ITER1. Dòng mật khẩu bị trả về ToDo vì chưa xử lý trường hợp token hết hạn — sửa ở ITER2 có thể nâng nó lên L2.</p>
<p class="nhan">Nếp hằng tuần giữ file trung thực</p>
<ol>
<li><strong>Mỗi ngày</strong> — cập nhật ô tiến độ của các dòng bạn đụng tới; kéo issue GitLab tương ứng.</li>
<li><strong>Mỗi tuần</strong> — leader kiểm tra mỗi PIC có 3–4 dòng trong iteration hiện tại và tổng ở MasterData cân đối; báo cáo tuần trích số từ file.</li>
<li><strong>Cuối iteration</strong> — điền cột Actual, điền cột Bug từ các issue Defect, thêm các dòng của iteration sau kèm PIC và level, rồi nộp.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Lỗi gặp trong file thật.</strong> Mô tả use case copy-paste; cột Details bỏ trống (không ai biết màn hình gồm những gì); hai PIC trên một dòng; màn hình lên kế hoạch mà không có level; tới lúc demo trạng thái vẫn New; cột Quality để trống (dòng "Activate Skills" của G5 không có quality và LOC grade bằng 0).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Một ma trận truy vết yêu cầu (traceability matrix) trá hình.</strong> Mã use case → dòng màn hình → issue GitLab → mục RDS → commit → test case: nếu mọi mắt xích đều có, bạn trả lời được "yêu cầu này đã xây và đã test chưa?" trong một phút. Công cụ doanh nghiệp (Jira + Confluence, Azure DevOps) tự động hoá các liên kết này; ở SWP391 bạn có cùng lợi ích bằng cách ghi mã use case trong tiêu đề issue và commit message, ví dụ <code>git commit -m "UC37 category list: add paging"</code>. <em>Ngoài giáo trình vì file mẫu không đòi liên kết truy vết tường minh.</em></div>`),
    books([
      ['wiegers', 'Ch. 29 "Links in the requirements chain" (traceability) and Ch. 27 "Requirements management practices" (status tracking)', 'Chương 29 "Links in the requirements chain" (truy vết) và Chương 27 "Requirements management practices" (theo dõi trạng thái)'],
      ['sommerville', 'Ch. 22 "Project management" (monitoring progress, reporting)', 'Chương 22 "Project management" (giám sát tiến độ, báo cáo)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 4.3 Complexity × Quality → LOC grade ─────────────────────── */
const L43 = {
  title: '4.3 — Sizing screens: complexity, quality & your LOC grade|||4.3 — Định cỡ màn hình: độ phức tạp, chất lượng & điểm LOC',
  slug: 'swp391-4-complexity-loc-grade',
  type: 'VIDEO',
  description: 'Đếm field và transaction để ra Level 1–7, nhân với mức chất lượng L1/L2/L3 thành Converted LOC, đổi ra điểm LOC; ví dụ đầy đủ cho nhóm 5 người qua 3 iteration và cách chia màn hình công bằng.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.3 · Student Guides slide 7 · Subject Guides slide 7 · template Refs sheet</span>
<h2>Sizing screens: complexity, quality and your LOC grade</h2>
<p class="lead">In SWP391 "LOC" does <strong>not</strong> mean counting the lines in your files. It is a <em>converted</em> size: the teacher rates how complex each screen is and how well it works, and multiplies the two. 70% of every iteration grade comes from this number — so you should be able to compute it yourself before the teacher does.</p>
<div class="callout"><strong>After this lesson you can…</strong>
<ul>
<li>count the fields and transactions of a screen and give it a Level 1–7;</li>
<li>say which Quality level (L1/L2/L3) your screen will get and what lifts it;</li>
<li>compute Converted LOC, LOC grade, iteration grade and OG — under both MaxLOC versions;</li>
<li>split a team's screens fairly (3–4 per member per iteration) and check the split with numbers.</li>
</ul></div>
<h3>1. The formula</h3>
<p class="nhan">Converted LOC of one screen = C × Q</p>
<ul>
<li><strong>C — Complexity</strong>, graded by the teacher: a LOC value for the screen's size.</li>
<li><strong>Q — Quality</strong>: a rate for completeness, correctness, UI/UX.</li>
<li><strong>LOC grade</strong> = your total Converted LOC × 10 / MaxLOC.</li>
</ul>
<h3>2. Two scales, one idea</h3>
<p>The guides use three sizes; the 2026 template refines them into seven levels. They share the same ends (60 and 240) and the same quality rates.</p>
<table>
<thead><tr><th>Guides (slide 7)</th><th>Fields · transactions</th><th>C</th><th>Template level</th><th>Fields OR transactions</th><th>C</th></tr></thead>
<tbody>
<tr><td rowspan="2">Simple</td><td rowspan="2">&lt; 7 fields, &lt; 3 trans</td><td rowspan="2">60</td><td>Level 1</td><td>3–5 fields OR 2 trans</td><td>60</td></tr>
<tr><td>Level 2</td><td>6–7 fields OR 3 trans</td><td>90</td></tr>
<tr><td rowspan="4">Medium</td><td rowspan="4">7–15 fields, 3–7 trans</td><td rowspan="4">120</td><td>Level 3</td><td>8–9 fields OR 4 trans</td><td>120</td></tr>
<tr><td>Level 4</td><td>10–11 fields OR 5 trans</td><td>150</td></tr>
<tr><td>Level 5</td><td>12–13 fields OR 6 trans</td><td>180</td></tr>
<tr><td>Level 6</td><td>14–15 fields OR 7 trans</td><td>210</td></tr>
<tr><td>Complex</td><td>≥ 15 fields, ≥ 7 trans</td><td>240</td><td>Level 7</td><td>&gt; 15 fields OR &gt; 7 trans</td><td>240</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Guides quality</th><th>Template quality</th><th>Rate</th><th>Meaning (Refs sheet)</th></tr></thead>
<tbody>
<tr><td>Low</td><td>L1_Happy Cases</td><td>50%</td><td>workable, all happy cases included</td></tr>
<tr><td>Medium</td><td>L2_All Cases</td><td>75%</td><td>workable with both happy and unhappy cases</td></tr>
<tr><td>High</td><td>L3_Optimized</td><td>100%</td><td>all cases + optimised UX and business logic, suitable for real-world use</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> "60 to 240, steps of 30; half, three-quarters, full".</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.3 · Student Guides slide 7 · Subject Guides slide 7 · sheet Refs của file mẫu</span>
<h2>Định cỡ màn hình: độ phức tạp, chất lượng và điểm LOC của bạn</h2>
<p class="lead">Ở SWP391 "LOC" <strong>không</strong> có nghĩa là đếm số dòng trong file. Đó là kích thước <em>quy đổi</em>: giảng viên đánh giá màn hình phức tạp tới đâu và chạy tốt tới đâu, rồi nhân hai thứ đó. 70% điểm mỗi iteration đến từ con số này — nên bạn phải tự tính được nó trước khi giảng viên tính.</p>
<div class="callout"><strong>Học xong bài này bạn có thể…</strong>
<ul>
<li>đếm field và transaction của một màn hình và xếp nó vào Level 1–7;</li>
<li>nói được màn hình của bạn sẽ ở mức Quality nào (L1/L2/L3) và làm gì để nâng lên;</li>
<li>tính Converted LOC, điểm LOC, điểm iteration và OG — theo cả hai phiên bản MaxLOC;</li>
<li>chia màn hình trong nhóm công bằng (mỗi người 3–4 màn hình mỗi iteration) và kiểm tra việc chia bằng số liệu.</li>
</ul></div>
<h3>1. Công thức</h3>
<p class="nhan">Converted LOC của một màn hình = C × Q</p>
<ul>
<li><strong>C — Complexity</strong>, giảng viên chấm: một giá trị LOC ứng với kích thước màn hình.</li>
<li><strong>Q — Quality</strong>: hệ số cho độ hoàn chỉnh, đúng đắn, UI/UX.</li>
<li><strong>Điểm LOC</strong> = tổng Converted LOC của bạn × 10 / MaxLOC.</li>
</ul>
<h3>2. Hai thang, một ý tưởng</h3>
<p>Các guide dùng ba cỡ; file mẫu 2026 chia mịn thành bảy level. Hai thang có cùng hai đầu (60 và 240) và cùng hệ số chất lượng.</p>
<table>
<thead><tr><th>Guide (slide 7)</th><th>Field · transaction</th><th>C</th><th>Level trong file mẫu</th><th>Field HOẶC transaction</th><th>C</th></tr></thead>
<tbody>
<tr><td rowspan="2">Simple</td><td rowspan="2">&lt; 7 field, &lt; 3 trans</td><td rowspan="2">60</td><td>Level 1</td><td>3–5 field HOẶC 2 trans</td><td>60</td></tr>
<tr><td>Level 2</td><td>6–7 field HOẶC 3 trans</td><td>90</td></tr>
<tr><td rowspan="4">Medium</td><td rowspan="4">7–15 field, 3–7 trans</td><td rowspan="4">120</td><td>Level 3</td><td>8–9 field HOẶC 4 trans</td><td>120</td></tr>
<tr><td>Level 4</td><td>10–11 field HOẶC 5 trans</td><td>150</td></tr>
<tr><td>Level 5</td><td>12–13 field HOẶC 6 trans</td><td>180</td></tr>
<tr><td>Level 6</td><td>14–15 field HOẶC 7 trans</td><td>210</td></tr>
<tr><td>Complex</td><td>≥ 15 field, ≥ 7 trans</td><td>240</td><td>Level 7</td><td>&gt; 15 field HOẶC &gt; 7 trans</td><td>240</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Quality theo guide</th><th>Quality theo file mẫu</th><th>Hệ số</th><th>Ý nghĩa (sheet Refs)</th></tr></thead>
<tbody>
<tr><td>Low</td><td>L1_Happy Cases</td><td>50%</td><td>chạy được, đủ mọi happy case</td></tr>
<tr><td>Medium</td><td>L2_All Cases</td><td>75%</td><td>chạy được với cả happy và unhappy case</td></tr>
<tr><td>High</td><td>L3_Optimized</td><td>100%</td><td>đủ mọi case + tối ưu UX và logic nghiệp vụ, dùng được ngoài đời thật</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "60 tới 240, mỗi bậc 30; một nửa, ba phần tư, trọn vẹn".</p>`),
    bi(`<h3>3. Counting fields and transactions — the Refs sheet rules</h3>
<ol>
<li><strong>Fields</strong> — the screen's <em>actionable</em> components (inputs, dropdowns, buttons, links that do something) or the database table fields it shows/edits.</li>
<li><strong>Transactions</strong> — calls to the database or to an external system/subsystem (e-mail, payment gateway, file storage).</li>
<li><strong>Conversion</strong> — "one transaction = two fields": a transaction that is not related to any field is counted as two extra fields and added to the field total.</li>
<li><strong>Level</strong> — defined by the fields <strong>OR</strong> the transactions; in practice you check both columns and the teacher confirms the level.</li>
</ol>
<p class="nhan">Worked count 1 — Category list (Admin)</p>
<table>
<thead><tr><th>Actionable component / transaction</th><th>Count</th></tr></thead>
<tbody>
<tr><td>Search box + Search button</td><td>2 fields</td></tr>
<tr><td>Status filter (All / Active / Inactive)</td><td>1 field</td></tr>
<tr><td>Sort by name (clickable header) and by ID</td><td>2 fields</td></tr>
<tr><td>Paging control (previous / page numbers / next)</td><td>1 field</td></tr>
<tr><td>Per row: Edit link, Activate/Deactivate button</td><td>2 fields</td></tr>
<tr><td>"Add new" button</td><td>1 field</td></tr>
<tr><td>Columns shown: name, description, status (table fields)</td><td>counted in the actions above</td></tr>
<tr><td><strong>Fields total</strong></td><td><strong>9</strong></td></tr>
<tr><td>Transactions: SELECT one page · SELECT COUNT(*) for paging · UPDATE status</td><td>3 trans</td></tr>
</tbody>
</table>
<p class="dap-an">✅ 9 fields → Level 3; 3 transactions → Level 2. The paging count query is not tied to any field, so it adds 2 fields: 9 + 2 = 11 → <strong>Level 4 (150)</strong>. That is the level used for this screen in lesson 4.2.</p>
<p class="nhan">Worked count 2 — Category detail (view / add / update)</p>
<ul>
<li><strong>Fields</strong> — name, image upload, description, status toggle, Save, Cancel/Back = 6.</li>
<li><strong>Transactions</strong> — SELECT by id (view/update mode) · check duplicate name · INSERT · UPDATE = 4.</li>
</ul>
<p class="dap-an">✅ 6 fields → Level 2, but 4 transactions → Level 3; the SELECT that loads the form is not tied to any field (+2 → 8 fields, also Level 3). Result: <strong>Level 3 (120)</strong>. Had Add, Update and View been three rows, each would be Level 1–2 — and the template forbids splitting them anyway.</p>
<div class="pitfall co-tieu-de"><strong>Inflating the count backfires.</strong> Counting every label and every read-only column as a "field" to reach Level 5 does not survive the demo: the teacher counts what the screen actually <em>does</em>. Claim a level you can defend field by field in front of the screen.</div>`,
    `<h3>3. Đếm field và transaction — quy tắc trong sheet Refs</h3>
<ol>
<li><strong>Field</strong> — các thành phần <em>thao tác được</em> trên màn hình (ô nhập, dropdown, nút, link có tác dụng) hoặc các trường của bảng dữ liệu mà màn hình hiển thị/sửa.</li>
<li><strong>Transaction</strong> — số lần gọi xuống cơ sở dữ liệu hoặc hệ thống/phân hệ bên ngoài (e-mail, cổng thanh toán, lưu trữ file).</li>
<li><strong>Quy đổi</strong> — "một transaction = hai field": transaction nào không gắn với field nào thì tính thành hai field và cộng vào tổng số field.</li>
<li><strong>Level</strong> — xác định theo field <strong>HOẶC</strong> transaction; thực tế bạn kiểm cả hai cột và giảng viên chốt level.</li>
</ol>
<p class="nhan">Đếm mẫu 1 — Category list (Admin)</p>
<table>
<thead><tr><th>Thành phần thao tác / transaction</th><th>Số lượng</th></tr></thead>
<tbody>
<tr><td>Ô tìm kiếm + nút Search</td><td>2 field</td></tr>
<tr><td>Bộ lọc trạng thái (All / Active / Inactive)</td><td>1 field</td></tr>
<tr><td>Sắp xếp theo tên (bấm tiêu đề cột) và theo ID</td><td>2 field</td></tr>
<tr><td>Thanh phân trang (trước / số trang / sau)</td><td>1 field</td></tr>
<tr><td>Mỗi dòng: link Edit, nút Activate/Deactivate</td><td>2 field</td></tr>
<tr><td>Nút "Add new"</td><td>1 field</td></tr>
<tr><td>Các cột hiển thị: name, description, status (trường của bảng)</td><td>đã tính trong các thao tác trên</td></tr>
<tr><td><strong>Tổng field</strong></td><td><strong>9</strong></td></tr>
<tr><td>Transaction: SELECT một trang · SELECT COUNT(*) để phân trang · UPDATE status</td><td>3 trans</td></tr>
</tbody>
</table>
<p class="dap-an">✅ 9 field → Level 3; 3 transaction → Level 2. Câu đếm tổng để phân trang không gắn với field nào nên cộng thêm 2 field: 9 + 2 = 11 → <strong>Level 4 (150)</strong>. Đó là level dùng cho màn hình này ở bài 4.2.</p>
<p class="nhan">Đếm mẫu 2 — Category detail (xem / thêm / sửa)</p>
<ul>
<li><strong>Field</strong> — name, upload ảnh, description, công tắc status, Save, Cancel/Back = 6.</li>
<li><strong>Transaction</strong> — SELECT theo id (chế độ xem/sửa) · kiểm tra trùng tên · INSERT · UPDATE = 4.</li>
</ul>
<p class="dap-an">✅ 6 field → Level 2, nhưng 4 transaction → Level 3; câu SELECT nạp dữ liệu vào form không gắn với field nào (+2 → 8 field, cũng Level 3). Kết quả: <strong>Level 3 (120)</strong>. Nếu tách Add, Update, View thành ba dòng thì mỗi dòng chỉ Level 1–2 — và file mẫu vốn đã cấm tách.</p>
<div class="pitfall co-tieu-de"><strong>Thổi phồng số đếm sẽ phản tác dụng.</strong> Tính mọi nhãn chữ và mọi cột chỉ-đọc là "field" để lên Level 5 sẽ không qua được buổi demo: giảng viên đếm những gì màn hình thật sự <em>làm được</em>. Chỉ khai level mà bạn bảo vệ được từng field ngay trước màn hình.</div>`),
    bi(`<h3>4. Worked example — a 5-person team over 3 iterations</h3>
<p>Job IT for Freelancer, members A (leader) to E, three screens each per iteration. Iteration 1 in full:</p>
<table>
<thead><tr><th>PIC</th><th>Screen (ITER1)</th><th>Level · C</th><th>Quality · Q</th><th>C × Q</th></tr></thead>
<tbody>
<tr><td>A</td><td>Login + Logout (shared auth)</td><td>3 · 120</td><td>L2 · 0.75</td><td>90</td></tr>
<tr><td>A</td><td>Header/Footer/Menu by role</td><td>2 · 90</td><td>L2 · 0.75</td><td>67.5</td></tr>
<tr><td>A</td><td>Register (Freelancer / Recruiter)</td><td>4 · 150</td><td>L1 · 0.5</td><td>75</td></tr>
<tr><td>B</td><td>Category list</td><td>4 · 150</td><td>L1 · 0.5</td><td>75</td></tr>
<tr><td>B</td><td>Category detail (view/add/update)</td><td>3 · 120</td><td>L2 · 0.75</td><td>90</td></tr>
<tr><td>B</td><td>Forgot / Change password</td><td>3 · 120</td><td>L1 · 0.5</td><td>60</td></tr>
<tr><td>C</td><td>Home page (search, paging, by category)</td><td>3 · 120</td><td>L1 · 0.5</td><td>60</td></tr>
<tr><td>C</td><td>Post detail + company info</td><td>2 · 90</td><td>L2 · 0.75</td><td>67.5</td></tr>
<tr><td>C</td><td>About Us / Contact</td><td>1 · 60</td><td>L2 · 0.75</td><td>45</td></tr>
<tr><td>D</td><td>Skill list</td><td>3 · 120</td><td>L1 · 0.5</td><td>60</td></tr>
<tr><td>D</td><td>Skill detail (view/add/update)</td><td>2 · 90</td><td>L2 · 0.75</td><td>67.5</td></tr>
<tr><td>D</td><td>Freelancer profile (view/edit)</td><td>4 · 150</td><td>L1 · 0.5</td><td>75</td></tr>
<tr><td>E</td><td>Admin user list (change status)</td><td>4 · 150</td><td>L1 · 0.5</td><td>75</td></tr>
<tr><td>E</td><td>User detail (admin)</td><td>3 · 120</td><td>L1 · 0.5</td><td>60</td></tr>
<tr><td>E</td><td>Admin dashboard (one, by role)</td><td>3 · 120</td><td>L1 · 0.5</td><td>60</td></tr>
</tbody>
</table>
<p>Iterations 2 and 3 follow the same pattern (post list, apply job, application list, blog, reports… then recommendations, dashboards, master data). Results per member:</p>
<table>
<thead><tr><th>Member</th><th>Converted LOC it1 · it2 · it3</th><th>All screens</th><th>LOC grade — Subject Guides (/180 · /240 · /660)</th><th>LOC grade — Student Guides (/240 · /240 · /720)</th><th>OG (SG · StG)</th></tr></thead>
<tbody>
<tr><td>A</td><td>232.5 · 292.5 · 240</td><td>765</td><td>10 · 10 · 10</td><td>9.69 · 10 · 10</td><td>9.10 · 9.05</td></tr>
<tr><td>B</td><td>225 · 232.5 · 225</td><td>682.5</td><td>10 · 9.69 · 10</td><td>9.38 · 9.69 · 9.48</td><td>9.03 · 8.77</td></tr>
<tr><td>C</td><td>172.5 · 225 · 232.5</td><td>630</td><td>9.58 · 9.38 · 9.55</td><td>7.19 · 9.38 · 8.75</td><td>8.75 · 8.10</td></tr>
<tr><td>D</td><td>202.5 · 202.5 · 210</td><td>615</td><td>10 · 8.44 · 9.32</td><td>8.44 · 8.44 · 8.54</td><td>8.54 · 8.04</td></tr>
<tr><td>E</td><td>195 · 187.5 · 202.5</td><td>585</td><td>10 · 7.81 · 8.86</td><td>8.13 · 7.81 · 8.13</td><td>8.26 · 7.71</td></tr>
<tr><td><em>W (weak)</em></td><td>135 · 135 · 135</td><td>405</td><td>7.50 · 5.63 · 6.14</td><td>5.63 · 5.63 · 5.63</td><td>6.51 · 6.04</td></tr>
</tbody>
</table>
<p class="nhan">How the numbers were computed</p>
<ol>
<li><strong>Iterations 1–2</strong> — LOC grade = that iteration's Converted LOC × 10 / MaxLOC, capped at 10. Example C, Student Guides: 172.5 × 10 / 240 = 7.19.</li>
<li><strong>Iteration 3</strong> — "we evaluate all the completed screens": all three iterations together. Example C: 630 × 10 / 660 = 9.55.</li>
<li><strong>Iteration grade</strong> = LOC grade × 0.7 + package × 0.3, with an assumed package grade of 7 (Refs suggests 0.6/0.4 in iteration 3 — ask your teacher).</li>
<li><strong>OG</strong> = (it1 × 15 + it2 × 20 + it3 × 25) / 60.</li>
</ol>
<p class="dap-an">✅ Member W — three Level-2 happy-case screens (3 × 45 = 135) every iteration — passes the OG but with the lowest mark, and the Refs table shows why that is fragile: fewer than 6 screens over the project at L1 quality means a failing LOC grade.</p>`,
    `<h3>4. Ví dụ có lời giải — nhóm 5 người qua 3 iteration</h3>
<p>Job IT for Freelancer, thành viên A (leader) tới E, mỗi người ba màn hình mỗi iteration. Iteration 1 đầy đủ:</p>
<table>
<thead><tr><th>PIC</th><th>Màn hình (ITER1)</th><th>Level · C</th><th>Quality · Q</th><th>C × Q</th></tr></thead>
<tbody>
<tr><td>A</td><td>Login + Logout (xác thực dùng chung)</td><td>3 · 120</td><td>L2 · 0,75</td><td>90</td></tr>
<tr><td>A</td><td>Header/Footer/Menu theo role</td><td>2 · 90</td><td>L2 · 0,75</td><td>67,5</td></tr>
<tr><td>A</td><td>Register (Freelancer / Recruiter)</td><td>4 · 150</td><td>L1 · 0,5</td><td>75</td></tr>
<tr><td>B</td><td>Category list</td><td>4 · 150</td><td>L1 · 0,5</td><td>75</td></tr>
<tr><td>B</td><td>Category detail (xem/thêm/sửa)</td><td>3 · 120</td><td>L2 · 0,75</td><td>90</td></tr>
<tr><td>B</td><td>Forgot / Change password</td><td>3 · 120</td><td>L1 · 0,5</td><td>60</td></tr>
<tr><td>C</td><td>Trang chủ (tìm kiếm, phân trang, theo category)</td><td>3 · 120</td><td>L1 · 0,5</td><td>60</td></tr>
<tr><td>C</td><td>Chi tiết bài đăng + thông tin công ty</td><td>2 · 90</td><td>L2 · 0,75</td><td>67,5</td></tr>
<tr><td>C</td><td>About Us / Contact</td><td>1 · 60</td><td>L2 · 0,75</td><td>45</td></tr>
<tr><td>D</td><td>Skill list</td><td>3 · 120</td><td>L1 · 0,5</td><td>60</td></tr>
<tr><td>D</td><td>Skill detail (xem/thêm/sửa)</td><td>2 · 90</td><td>L2 · 0,75</td><td>67,5</td></tr>
<tr><td>D</td><td>Hồ sơ freelancer (xem/sửa)</td><td>4 · 150</td><td>L1 · 0,5</td><td>75</td></tr>
<tr><td>E</td><td>Danh sách người dùng (đổi trạng thái)</td><td>4 · 150</td><td>L1 · 0,5</td><td>75</td></tr>
<tr><td>E</td><td>Chi tiết người dùng (admin)</td><td>3 · 120</td><td>L1 · 0,5</td><td>60</td></tr>
<tr><td>E</td><td>Dashboard admin (một cái, theo role)</td><td>3 · 120</td><td>L1 · 0,5</td><td>60</td></tr>
</tbody>
</table>
<p>Iteration 2 và 3 theo cùng khuôn (danh sách bài đăng, ứng tuyển, danh sách đơn ứng tuyển, blog, báo cáo… rồi gợi ý việc làm, dashboard, master data). Kết quả từng người:</p>
<table>
<thead><tr><th>Thành viên</th><th>Converted LOC it1 · it2 · it3</th><th>Mọi màn hình</th><th>Điểm LOC — Subject Guides (/180 · /240 · /660)</th><th>Điểm LOC — Student Guides (/240 · /240 · /720)</th><th>OG (SG · StG)</th></tr></thead>
<tbody>
<tr><td>A</td><td>232,5 · 292,5 · 240</td><td>765</td><td>10 · 10 · 10</td><td>9,69 · 10 · 10</td><td>9,10 · 9,05</td></tr>
<tr><td>B</td><td>225 · 232,5 · 225</td><td>682,5</td><td>10 · 9,69 · 10</td><td>9,38 · 9,69 · 9,48</td><td>9,03 · 8,77</td></tr>
<tr><td>C</td><td>172,5 · 225 · 232,5</td><td>630</td><td>9,58 · 9,38 · 9,55</td><td>7,19 · 9,38 · 8,75</td><td>8,75 · 8,10</td></tr>
<tr><td>D</td><td>202,5 · 202,5 · 210</td><td>615</td><td>10 · 8,44 · 9,32</td><td>8,44 · 8,44 · 8,54</td><td>8,54 · 8,04</td></tr>
<tr><td>E</td><td>195 · 187,5 · 202,5</td><td>585</td><td>10 · 7,81 · 8,86</td><td>8,13 · 7,81 · 8,13</td><td>8,26 · 7,71</td></tr>
<tr><td><em>W (yếu)</em></td><td>135 · 135 · 135</td><td>405</td><td>7,50 · 5,63 · 6,14</td><td>5,63 · 5,63 · 5,63</td><td>6,51 · 6,04</td></tr>
</tbody>
</table>
<p class="nhan">Cách tính các con số</p>
<ol>
<li><strong>Iteration 1–2</strong> — điểm LOC = Converted LOC của iteration đó × 10 / MaxLOC, tối đa 10. Ví dụ C, theo Student Guides: 172,5 × 10 / 240 = 7,19.</li>
<li><strong>Iteration 3</strong> — "đánh giá mọi màn hình đã hoàn thành": gộp cả ba iteration. Ví dụ C: 630 × 10 / 660 = 9,55.</li>
<li><strong>Điểm iteration</strong> = điểm LOC × 0,7 + gói nộp × 0,3, giả sử gói nộp được 7 (Refs gợi ý 0,6/0,4 ở iteration 3 — hãy hỏi giảng viên).</li>
<li><strong>OG</strong> = (it1 × 15 + it2 × 20 + it3 × 25) / 60.</li>
</ol>
<p class="dap-an">✅ Thành viên W — mỗi iteration ba màn hình Level 2 chỉ có happy case (3 × 45 = 135) — vẫn qua OG nhưng điểm thấp nhất, và bảng Refs cho thấy vì sao như vậy rất mong manh: cả dự án dưới 6 màn hình ở chất lượng L1 là điểm LOC trượt.</p>`),
    bi(`<h3>5. Splitting screens fairly</h3>
<ol>
<li><strong>Count first, assign second</strong> — size every screen (Level) before anyone picks; then aim for a similar LOC Plan per member per iteration (roughly 330–420 planned for 3 screens).</li>
<li><strong>3–4 screens per member per iteration</strong> — "enough functions or screens so that each team member can have 3–4 different screens/functions to implement in each iteration, including iteration 3" (Student Guides slide 3). Plan the whole product so iteration 3 is not empty.</li>
<li><strong>Own an entity vertically</strong> — the same member takes a list screen <em>and</em> its detail screen (Category list + Category detail). One owner, one DAO, one complete function to demo.</li>
<li><strong>Common parts are real rows</strong> — layout/menu, login, dashboard go into ITER1 and are assigned like any other screen, so the member doing them is not penalised.</li>
<li><strong>Mix sizes</strong> — each member gets one bigger screen (Level 4–5) and smaller ones; nobody only gets About Us pages.</li>
<li><strong>Check MasterData</strong> — after assigning, the per-member LOC totals should be within about ±20% of each other.</li>
</ol>
<p class="nhan">Lifting Quality from L1 to L2 is the cheapest LOC you will ever earn</p>
<ul>
<li><strong>Validation</strong> — required (blank and spaces), length (longer than the DB column), format (email, phone, date, image type) — exactly the Policies list.</li>
<li><strong>Empty and boundary states</strong> — empty list, last page, page out of range, deleted id in the URL.</li>
<li><strong>Clear messages</strong> — success and error messages after every action; no stack traces on screen.</li>
<li><strong>Permissions</strong> — a Freelancer typing the admin URL is redirected, not served.</li>
</ul>
<p class="dap-an">✅ Moving member C's ITER1 Home page from L1 to L2 adds 120 × 0.25 = 30 LOC — half the plan of a whole new Level-1 screen, for a day of edge-case work.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Converted LOC is a cousin of function points.</strong> IFPUG Function Point Analysis and the COSMIC method also size software by what it <em>does</em> — inputs, outputs, inquiries, data files touched — rather than by lines typed, precisely because line counts reward verbosity and punish reuse. The SWP391 table ("one transaction = two fields") is a simplified, classroom version of the same idea; the FPT Software norm it comes from calibrates it to company data. <em>Outside the syllabus because the course gives you the table, not the theory behind it.</em></div>`,
    `<h3>5. Chia màn hình công bằng</h3>
<ol>
<li><strong>Đếm trước, giao sau</strong> — định level mọi màn hình trước khi ai chọn; rồi nhắm LOC Plan tương đương giữa các thành viên mỗi iteration (khoảng 330–420 kế hoạch cho 3 màn hình).</li>
<li><strong>Mỗi người 3–4 màn hình mỗi iteration</strong> — "đủ chức năng hoặc màn hình để mỗi thành viên có 3–4 màn hình/chức năng khác nhau cho mỗi iteration, kể cả iteration 3" (Student Guides slide 3). Lập kế hoạch cả sản phẩm để iteration 3 không bị trống.</li>
<li><strong>Sở hữu một thực thể theo chiều dọc</strong> — cùng một người nhận màn hình danh sách <em>và</em> màn hình chi tiết của nó (Category list + Category detail). Một chủ, một DAO, một chức năng hoàn chỉnh để demo.</li>
<li><strong>Phần chung là dòng thật</strong> — layout/menu, đăng nhập, dashboard đưa vào ITER1 và giao như mọi màn hình khác, để người làm chúng không bị thiệt.</li>
<li><strong>Trộn cỡ</strong> — mỗi người một màn hình lớn (Level 4–5) và vài màn hình nhỏ; không ai chỉ nhận toàn trang About Us.</li>
<li><strong>Kiểm MasterData</strong> — sau khi giao, tổng LOC của từng người nên chênh nhau không quá khoảng ±20%.</li>
</ol>
<p class="nhan">Nâng Quality từ L1 lên L2 là cách kiếm LOC rẻ nhất</p>
<ul>
<li><strong>Validate</strong> — required (blank và space), length (dài hơn cột DB), format (email, số điện thoại, ngày, loại ảnh) — đúng danh sách của Policies.</li>
<li><strong>Trạng thái rỗng và biên</strong> — danh sách rỗng, trang cuối, số trang vượt phạm vi, id đã xoá trên URL.</li>
<li><strong>Thông báo rõ ràng</strong> — thông báo thành công/lỗi sau mọi thao tác; không hiện stack trace lên màn hình.</li>
<li><strong>Phân quyền</strong> — Freelancer gõ URL của admin thì bị chuyển hướng, không được phục vụ.</li>
</ul>
<p class="dap-an">✅ Nâng Trang chủ ITER1 của thành viên C từ L1 lên L2 được thêm 120 × 0,25 = 30 LOC — bằng nửa một màn hình Level 1 mới, chỉ với một ngày xử lý các case biên.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Converted LOC là họ hàng của function point.</strong> Phương pháp IFPUG Function Point Analysis và COSMIC cũng đo phần mềm theo những gì nó <em>làm</em> — input, output, truy vấn, file dữ liệu được đụng tới — thay vì số dòng gõ ra, chính vì đếm dòng thưởng cho sự dài dòng và phạt việc dùng lại code. Bảng của SWP391 ("một transaction = hai field") là phiên bản đơn giản cho lớp học của cùng ý tưởng đó; định mức FPT Software mà nó dựa vào hiệu chỉnh nó theo số liệu công ty. <em>Ngoài giáo trình vì môn học chỉ đưa bảng, không dạy lý thuyết đằng sau.</em></div>`),
    books([
      ['sommerville', 'Ch. 23.6 "Estimation techniques" (algorithmic cost modelling, COCOMO) and Ch. 24 "Quality management"', 'Mục 23.6 "Estimation techniques" (mô hình chi phí, COCOMO) và Chương 24 "Quality management"'],
      ['wiegers', 'Ch. 19 "Beyond requirements development" (estimating from requirements)', 'Chương 19 "Beyond requirements development" (ước lượng từ yêu cầu)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 4.4 Coding one screen end-to-end ─────────────────────── */
const L44 = {
  title: '4.4 — Coding one screen end-to-end: Servlet/JSP MVC, DAO & PreparedStatement|||4.4 — Code trọn một màn hình: Servlet/JSP MVC, DAO & PreparedStatement',
  slug: 'swp391-4-code-one-screen-mvc',
  type: 'VIDEO',
  description: 'Code hai màn hình Category (list có search/filter/sort/paging và detail dùng chung cho xem/thêm/sửa) bằng NetBeans + MySQL: layout dùng chung, validate, DAO với PreparedStatement, chống SQL injection, transaction và phân quyền.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.4 · course default stack: NetBeans + Java Servlet/JSP + MySQL</span>
<h2>Coding one screen end-to-end — Servlet/JSP MVC, DAO and PreparedStatement</h2>
<p class="lead">This is the lesson where the plan becomes LOC. We build member B's two ITER1 screens of Job IT for Freelancer — <strong>Category list</strong> (Level 4) and <strong>Category detail</strong> (Level 3) — following every rule of the Policies sheet: shared layout, one JSP for view/add/update, search + filter + sort + paging, validation, and database access that cannot be injected.</p>
<div class="callout"><strong>After this lesson you can…</strong>
<ul>
<li>lay out a NetBeans web project so five people can work in it without collisions;</li>
<li>write a DAO with <code>PreparedStatement</code> for search, filter, sort and paging — and know why <code>ORDER BY</code> needs a whitelist;</li>
<li>write one servlet + one JSP that serve view, add and update;</li>
<li>validate on the server (required, length, format) and show errors next to the field;</li>
<li>wrap a multi-step action in a JDBC transaction and protect a screen by role.</li>
</ul></div>
<h3>1. The project layout (shared by the whole team)</h3>
<pre>JobITForFreelancer/                 <span class="tok-comment">NetBeans "Java with Ant/Maven - Web Application"</span>
├── src/java/
│   ├── dal/            DBContext.java      <span class="tok-comment">one connection helper (common, ITER1)</span>
│   │                   CategoryDAO.java    <span class="tok-comment">all SQL of Category — owner: member B</span>
│   ├── model/          Category.java       <span class="tok-comment">plain Java bean</span>
│   ├── controller/     CategoryListServlet.java, CategoryDetailServlet.java
│   ├── filter/         AuthFilter.java     <span class="tok-comment">role check (common, ITER1)</span>
│   └── util/           Validator.java, PageResult.java   <span class="tok-comment">common helpers</span>
├── web/
│   ├── common/         header.jsp, menu.jsp, footer.jsp  <span class="tok-comment">the shared layout row</span>
│   ├── assets/         css/ js/ img/        <span class="tok-comment">copied from the chosen UI theme (lesson 4.5)</span>
│   ├── admin/          category-list.jsp, category-detail.jsp
│   └── WEB-INF/        web.xml  (JSTL jars in the libraries)
└── database/           JobIT_schema.sql, JobIT_data.sql  <span class="tok-comment">committed inside each iteration tag</span></pre>
<p class="nhan">Why this shape</p>
<ul>
<li><strong>One package per layer</strong> — anyone finds anyone's code; the teacher can ask "show me your DAO" and you open <code>dal/</code>.</li>
<li><strong>One file per owner where possible</strong> — member B's entity lives in files only B edits, so daily merges rarely conflict.</li>
<li><strong>Common files built first</strong> — DBContext, AuthFilter, layout, Validator are ITER1 rows owned by named members.</li>
</ul>
<h3>2. The table — MySQL (the G5 original was SQL Server)</h3>
<pre>CREATE TABLE categories (
  category_id   INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(50)  NOT NULL UNIQUE,
  image_url     VARCHAR(220) NULL,
  description   VARCHAR(500) NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;</pre>
<p class="ghi-chu">Same columns as the G5 <code>Categories</code> table (caID, categories_name 50, categories_img 220, description 500, statusCate), renamed in snake_case. The lengths matter: they are the limits your validation must enforce (Policies: "input longer than the DB column").</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.4 · stack mặc định của môn: NetBeans + Java Servlet/JSP + MySQL</span>
<h2>Code trọn một màn hình — Servlet/JSP MVC, DAO và PreparedStatement</h2>
<p class="lead">Đây là bài kế hoạch biến thành LOC. Ta xây hai màn hình ITER1 của thành viên B trong Job IT for Freelancer — <strong>Category list</strong> (Level 4) và <strong>Category detail</strong> (Level 3) — theo đúng mọi luật trong sheet Policies: layout dùng chung, một JSP cho xem/thêm/sửa, tìm + lọc + sắp xếp + phân trang, validate, và truy cập cơ sở dữ liệu không thể bị injection.</p>
<div class="callout"><strong>Học xong bài này bạn có thể…</strong>
<ul>
<li>tổ chức một project web NetBeans để năm người cùng làm mà không giẫm chân nhau;</li>
<li>viết DAO dùng <code>PreparedStatement</code> cho tìm, lọc, sắp xếp và phân trang — và biết vì sao <code>ORDER BY</code> cần whitelist;</li>
<li>viết một servlet + một JSP phục vụ cả xem, thêm và sửa;</li>
<li>validate phía server (required, length, format) và hiện lỗi cạnh từng field;</li>
<li>bọc một thao tác nhiều bước trong transaction JDBC và bảo vệ màn hình theo role.</li>
</ul></div>
<h3>1. Cấu trúc project (cả nhóm dùng chung)</h3>
<pre>JobITForFreelancer/                 <span class="tok-comment">NetBeans "Java with Ant/Maven - Web Application"</span>
├── src/java/
│   ├── dal/            DBContext.java      <span class="tok-comment">một lớp kết nối (dùng chung, ITER1)</span>
│   │                   CategoryDAO.java    <span class="tok-comment">mọi SQL của Category — chủ: thành viên B</span>
│   ├── model/          Category.java       <span class="tok-comment">Java bean thuần</span>
│   ├── controller/     CategoryListServlet.java, CategoryDetailServlet.java
│   ├── filter/         AuthFilter.java     <span class="tok-comment">kiểm tra role (dùng chung, ITER1)</span>
│   └── util/           Validator.java, PageResult.java   <span class="tok-comment">tiện ích dùng chung</span>
├── web/
│   ├── common/         header.jsp, menu.jsp, footer.jsp  <span class="tok-comment">dòng "layout dùng chung"</span>
│   ├── assets/         css/ js/ img/        <span class="tok-comment">chép từ UI theme đã chọn (bài 4.5)</span>
│   ├── admin/          category-list.jsp, category-detail.jsp
│   └── WEB-INF/        web.xml  (thư viện JSTL)
└── database/           JobIT_schema.sql, JobIT_data.sql  <span class="tok-comment">commit trong tag mỗi iteration</span></pre>
<p class="nhan">Vì sao tổ chức như vậy</p>
<ul>
<li><strong>Mỗi lớp một package</strong> — ai cũng tìm được code của người khác; giảng viên hỏi "cho xem DAO của em" là bạn mở <code>dal/</code>.</li>
<li><strong>Mỗi file một chủ khi có thể</strong> — thực thể của B nằm trong các file chỉ B sửa, nên merge hằng ngày hiếm khi xung đột.</li>
<li><strong>File dùng chung làm trước</strong> — DBContext, AuthFilter, layout, Validator là các dòng ITER1 có người phụ trách rõ ràng.</li>
</ul>
<h3>2. Bảng dữ liệu — MySQL (bản gốc của G5 là SQL Server)</h3>
<pre>CREATE TABLE categories (
  category_id   INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(50)  NOT NULL UNIQUE,
  image_url     VARCHAR(220) NULL,
  description   VARCHAR(500) NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;</pre>
<p class="ghi-chu">Cùng các cột với bảng <code>Categories</code> của G5 (caID, categories_name 50, categories_img 220, description 500, statusCate), đổi tên theo snake_case. Độ dài rất quan trọng: đó là giới hạn mà validate của bạn phải chặn (Policies: "nhập độ dài vượt quá DB").</p>`),
    (() => {
      const dao = `<pre><span class="tok-keyword">public class</span> CategoryDAO <span class="tok-keyword">extends</span> DBContext {
    <span class="tok-comment">// ORDER BY cannot take a ? placeholder → map user input to a fixed whitelist</span>
    <span class="tok-keyword">private static final</span> Map&lt;String, String&gt; SORT = Map.of(
        "id", "category_id", "name", "name", "created", "created_at");

    <span class="tok-keyword">public</span> List&lt;Category&gt; search(String kw, Integer active, String sort,
                                 <span class="tok-keyword">boolean</span> asc, <span class="tok-keyword">int</span> page, <span class="tok-keyword">int</span> size) <span class="tok-keyword">throws</span> SQLException {
        String col = SORT.getOrDefault(sort, "category_id");
        String sql = "SELECT category_id, name, description, is_active FROM categories"
                   + " WHERE name LIKE ? AND (? IS NULL OR is_active = ?)"
                   + " ORDER BY " + col + (asc ? " ASC" : " DESC")    <span class="tok-comment">// whitelisted, safe</span>
                   + " LIMIT ? OFFSET ?";
        <span class="tok-keyword">try</span> (Connection c = getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, "%" + kw.trim() + "%");
            ps.setObject(2, active); ps.setObject(3, active);
            ps.setInt(4, size);
            ps.setInt(5, (page - 1) * size);
            List&lt;Category&gt; list = <span class="tok-keyword">new</span> ArrayList&lt;&gt;();
            <span class="tok-keyword">try</span> (ResultSet rs = ps.executeQuery()) {
                <span class="tok-keyword">while</span> (rs.next()) list.add(<span class="tok-keyword">new</span> Category(rs.getInt(1), rs.getString(2),
                                                   rs.getString(3), rs.getBoolean(4)));
            }
            <span class="tok-keyword">return</span> list;
        }
    }

    <span class="tok-keyword">public int</span> count(String kw, Integer active) <span class="tok-keyword">throws</span> SQLException { <span class="tok-comment">/* same WHERE, SELECT COUNT(*) */</span> }
    <span class="tok-keyword">public</span> Category findById(<span class="tok-keyword">int</span> id)          <span class="tok-comment">// SELECT … WHERE category_id = ?</span>
    <span class="tok-keyword">public boolean</span> existsName(String name, <span class="tok-keyword">int</span> exceptId)  <span class="tok-comment">// duplicate check for add AND update</span>
    <span class="tok-keyword">public int</span> insert(Category x)             <span class="tok-comment">// INSERT INTO categories(name, image_url, description) VALUES (?,?,?)</span>
    <span class="tok-keyword">public void</span> update(Category x)            <span class="tok-comment">// UPDATE categories SET name=?, image_url=?, description=? WHERE category_id=?</span>
    <span class="tok-keyword">public void</span> setActive(<span class="tok-keyword">int</span> id, <span class="tok-keyword">boolean</span> on)  <span class="tok-comment">// "delete" = UPDATE … SET is_active=0 (soft delete, as G5 did)</span>
}</pre>`;
      const sqli = `<pre><span class="tok-comment">// NEVER: user input concatenated into SQL</span>
String bad = "SELECT * FROM categories WHERE name LIKE '%" + kw + "%'";
<span class="tok-comment">// kw = x%' OR '1'='1   → returns every row;   kw = x'; DROP TABLE categories; -- → disaster</span>

<span class="tok-comment">// ALWAYS: a ? placeholder, value bound by the driver</span>
String ok = "SELECT * FROM categories WHERE name LIKE ?";
ps.setString(1, "%" + kw + "%");</pre>`;
      return bi(`<h3>3. The DAO — the only place where Category SQL lives</h3>
${dao}
<p class="nhan">Line by line — what makes it safe and complete</p>
<ul>
<li><strong>Every value is a <code>?</code></strong> — keyword, status, page size, offset: bound with <code>setString</code>/<code>setInt</code>/<code>setObject</code>. The driver sends them as data, never as SQL.</li>
<li><strong>The sort column is whitelisted</strong> — identifiers (column names, ASC/DESC) cannot be placeholders, so user input only <em>selects</em> one of three fixed strings. Anything else falls back to <code>category_id</code>.</li>
<li><strong><code>(? IS NULL OR is_active = ?)</code></strong> — one query serves "All", "Active" and "Inactive" without building SQL by hand.</li>
<li><strong><code>LIMIT ? OFFSET ?</code></strong> — paging in the database, not by loading every row into Java. <code>count()</code> uses the same WHERE so the page numbers match the results.</li>
<li><strong>try-with-resources</strong> — connection, statement and result set are closed even when an exception is thrown; leaked connections are the classic "works for 10 clicks, then hangs" demo bug.</li>
<li><strong>Soft delete</strong> — "Delete" sets <code>is_active = 0</code>, so posts that reference the category keep working (the G5 design did the same).</li>
</ul>
<h3>4. SQL injection — the non-negotiable</h3>
${sqli}
<div class="pitfall co-tieu-de"><strong>Concatenated SQL is a grading point, not a style issue.</strong> The teacher types <code>' OR '1'='1</code> into your search box during the demo. One concatenated query anywhere in your screen means a security defect — use <code>PreparedStatement</code> everywhere, including the "small" queries.</div>`,
      `<h3>3. DAO — nơi duy nhất chứa SQL của Category</h3>
${dao}
<p class="nhan">Từng dòng — điều gì làm nó an toàn và đầy đủ</p>
<ul>
<li><strong>Mọi giá trị đều là <code>?</code></strong> — từ khoá, trạng thái, kích thước trang, offset: gán bằng <code>setString</code>/<code>setInt</code>/<code>setObject</code>. Driver gửi chúng như dữ liệu, không bao giờ như câu SQL.</li>
<li><strong>Cột sắp xếp được whitelist</strong> — tên định danh (tên cột, ASC/DESC) không thể là placeholder, nên input người dùng chỉ <em>chọn</em> một trong ba chuỗi cố định. Giá trị lạ thì quay về <code>category_id</code>.</li>
<li><strong><code>(? IS NULL OR is_active = ?)</code></strong> — một câu truy vấn phục vụ cả "All", "Active" và "Inactive" mà không phải tự ghép SQL.</li>
<li><strong><code>LIMIT ? OFFSET ?</code></strong> — phân trang trong cơ sở dữ liệu, không nạp mọi dòng vào Java. <code>count()</code> dùng cùng mệnh đề WHERE để số trang khớp với kết quả.</li>
<li><strong>try-with-resources</strong> — connection, statement, result set được đóng kể cả khi có exception; rò connection là lỗi demo kinh điển "bấm 10 lần thì treo".</li>
<li><strong>Xoá mềm</strong> — "Delete" đặt <code>is_active = 0</code>, nên các bài đăng đang tham chiếu category vẫn chạy (thiết kế của G5 cũng vậy).</li>
</ul>
<h3>4. SQL injection — điều không thương lượng</h3>
${sqli}
<div class="pitfall co-tieu-de"><strong>SQL nối chuỗi là điểm chấm, không phải chuyện phong cách.</strong> Giảng viên gõ <code>' OR '1'='1</code> vào ô tìm kiếm của bạn trong buổi demo. Chỉ một câu nối chuỗi ở bất kỳ đâu trong màn hình là một lỗi bảo mật — dùng <code>PreparedStatement</code> ở mọi nơi, kể cả các câu truy vấn "nhỏ".</div>`);
    })(),
    (() => {
      const list = `<pre><span class="tok-keyword">@WebServlet</span>("/admin/categories")
<span class="tok-keyword">public class</span> CategoryListServlet <span class="tok-keyword">extends</span> HttpServlet {
    <span class="tok-keyword">private static final int</span> SIZE = 10;
    <span class="tok-keyword">protected void</span> doGet(HttpServletRequest req, HttpServletResponse resp) <span class="tok-keyword">throws</span> … {
        String kw   = Optional.ofNullable(req.getParameter("kw")).orElse("");
        Integer act = Validator.parseIntOrNull(req.getParameter("status")); <span class="tok-comment">// null = All</span>
        String sort = req.getParameter("sort");                             <span class="tok-comment">// whitelisted in DAO</span>
        <span class="tok-keyword">boolean</span> asc = !"desc".equals(req.getParameter("dir"));
        <span class="tok-keyword">int</span> total  = dao.count(kw, act);
        <span class="tok-keyword">int</span> pages  = Math.max(1, (total + SIZE - 1) / SIZE);
        <span class="tok-keyword">int</span> page   = Validator.clamp(req.getParameter("page"), 1, pages); <span class="tok-comment">// page=999 → last page</span>
        req.setAttribute("list", dao.search(kw, act, sort, asc, page, SIZE));
        req.setAttribute("page", page); req.setAttribute("pages", pages);
        req.getRequestDispatcher("/admin/category-list.jsp").forward(req, resp);
    }
    <span class="tok-keyword">protected void</span> doPost(…) {   <span class="tok-comment">// activate / deactivate button of a row</span>
        dao.setActive(Integer.parseInt(req.getParameter("id")), "1".equals(req.getParameter("on")));
        req.getSession().setAttribute("flash", "Status updated.");
        resp.sendRedirect(req.getContextPath() + "/admin/categories?" + keepQuery(req)); <span class="tok-comment">// PRG</span>
    }
}</pre>`;
      const detail = `<pre><span class="tok-keyword">@WebServlet</span>("/admin/category")          <span class="tok-comment">// ?id=7 → view/update · no id → add</span>
<span class="tok-keyword">public class</span> CategoryDetailServlet <span class="tok-keyword">extends</span> HttpServlet {
    <span class="tok-keyword">protected void</span> doGet(…) {
        Integer id = Validator.parseIntOrNull(req.getParameter("id"));
        Category c = (id == <span class="tok-keyword">null</span>) ? <span class="tok-keyword">new</span> Category() : dao.findById(id);
        <span class="tok-keyword">if</span> (c == <span class="tok-keyword">null</span>) { resp.sendError(404); <span class="tok-keyword">return</span>; }          <span class="tok-comment">// deleted / fake id</span>
        req.setAttribute("c", c);
        req.getRequestDispatcher("/admin/category-detail.jsp").forward(req, resp);
    }
    <span class="tok-keyword">protected void</span> doPost(…) {
        Category c = readForm(req);                                     <span class="tok-comment">// id may be 0 = new</span>
        Map&lt;String, String&gt; err = <span class="tok-keyword">new</span> LinkedHashMap&lt;&gt;();
        Validator.required(err, "name", c.getName());                   <span class="tok-comment">// blank or only spaces</span>
        Validator.maxLen(err, "name", c.getName(), 50);                 <span class="tok-comment">// = VARCHAR(50)</span>
        Validator.maxLen(err, "description", c.getDescription(), 500);
        Validator.imageExt(err, "image", c.getImageUrl(), "jpg", "jpeg", "png");
        <span class="tok-keyword">if</span> (!err.containsKey("name") &amp;&amp; dao.existsName(c.getName().trim(), c.getId()))
            err.put("name", "This category name already exists.");
        <span class="tok-keyword">if</span> (!err.isEmpty()) {                                           <span class="tok-comment">// unhappy path: stay, keep input</span>
            req.setAttribute("c", c); req.setAttribute("err", err);
            req.getRequestDispatcher("/admin/category-detail.jsp").forward(req, resp);
            <span class="tok-keyword">return</span>;
        }
        <span class="tok-keyword">if</span> (c.getId() == 0) dao.insert(c); <span class="tok-keyword">else</span> dao.update(c);
        req.getSession().setAttribute("flash", c.getId() == 0 ? "Category created." : "Category updated.");
        resp.sendRedirect(req.getContextPath() + "/admin/categories");  <span class="tok-comment">// PRG: F5 will not re-insert</span>
    }
}</pre>`;
      return bi(`<h3>5. The controllers — thin servlets, no SQL</h3>
<p class="nhan">Category list — reads the query string, asks the DAO, forwards to the JSP</p>
${list}
<p class="nhan">Category detail — ONE servlet for view, add and update</p>
${detail}
<p class="nhan">The unhappy cases this code already covers (→ Quality L2)</p>
<ol>
<li><strong>Blank or spaces-only name</strong> — rejected by <code>required</code> after <code>trim()</code>.</li>
<li><strong>51-character name, 600-character description</strong> — rejected before MySQL raises "Data too long".</li>
<li><strong>Duplicate name</strong> — checked on add and on update (<code>exceptId</code> skips the row itself).</li>
<li><strong>Wrong file type</strong> — only jpg/jpeg/png accepted (also restrict the file picker with <code>accept</code>).</li>
<li><strong>Fake id, page 999, text in <code>page</code></strong> — 404 or clamped, never a stack trace.</li>
<li><strong>F5 after saving</strong> — Post/Redirect/Get: the browser re-requests the list, not the insert.</li>
</ol>`,
      `<h3>5. Controller — servlet mỏng, không có SQL</h3>
<p class="nhan">Category list — đọc query string, hỏi DAO, chuyển sang JSP</p>
${list}
<p class="nhan">Category detail — MỘT servlet cho xem, thêm và sửa</p>
${detail}
<p class="nhan">Các unhappy case mà code này đã xử lý (→ Quality L2)</p>
<ol>
<li><strong>Tên để trống hoặc toàn dấu cách</strong> — bị <code>required</code> chặn sau <code>trim()</code>.</li>
<li><strong>Tên 51 ký tự, mô tả 600 ký tự</strong> — bị chặn trước khi MySQL báo "Data too long".</li>
<li><strong>Trùng tên</strong> — kiểm khi thêm và cả khi sửa (<code>exceptId</code> bỏ qua chính dòng đó).</li>
<li><strong>Sai loại file</strong> — chỉ nhận jpg/jpeg/png (chặn thêm ở ô chọn file bằng <code>accept</code>).</li>
<li><strong>Id giả, trang 999, chữ trong <code>page</code></strong> — trả 404 hoặc kẹp về trang hợp lệ, không bao giờ hiện stack trace.</li>
<li><strong>Bấm F5 sau khi lưu</strong> — Post/Redirect/Get: trình duyệt gọi lại trang danh sách, không gọi lại lệnh insert.</li>
</ol>`);
    })(),
    (() => {
      const listJsp = `<pre>&lt;%@ page contentType="text/html; charset=UTF-8" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;   <span class="tok-comment">&lt;!-- javax: http://java.sun.com/jsp/jstl/core --&gt;</span>
&lt;jsp:include page="/common/header.jsp"&gt;&lt;jsp:param name="title" value="Categories"/&gt;&lt;/jsp:include&gt;
&lt;jsp:include page="/common/menu.jsp"/&gt;            <span class="tok-comment">&lt;!-- role-aware menu: reach this page by clicking --&gt;</span>

&lt;form method="get" action="\${pageContext.request.contextPath}/admin/categories"&gt;
  &lt;input name="kw" value="&lt;c:out value='\${param.kw}'/&gt;" maxlength="50" placeholder="Search name"&gt;
  &lt;select name="status"&gt; &lt;option value=""&gt;All&lt;/option&gt;
    &lt;option value="1" \${param.status == '1' ? 'selected' : ''}&gt;Active&lt;/option&gt;
    &lt;option value="0" \${param.status == '0' ? 'selected' : ''}&gt;Inactive&lt;/option&gt; &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;

&lt;c:if test="\${empty list}"&gt;&lt;p&gt;No category matches your search.&lt;/p&gt;&lt;/c:if&gt;
&lt;table class="table"&gt;
  &lt;tr&gt;&lt;th&gt;&lt;a href="?sort=id&amp;amp;kw=\${param.kw}"&gt;ID&lt;/a&gt;&lt;/th&gt;&lt;th&gt;&lt;a href="?sort=name&amp;amp;kw=\${param.kw}"&gt;Name&lt;/a&gt;&lt;/th&gt;
      &lt;th&gt;Description&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach var="x" items="\${list}"&gt;
    &lt;tr&gt;&lt;td&gt;\${x.id}&lt;/td&gt;
        &lt;td&gt;&lt;c:out value="\${x.name}"/&gt;&lt;/td&gt;               <span class="tok-comment">&lt;!-- c:out escapes HTML (no stored XSS) --&gt;</span>
        &lt;td class="text-truncate"&gt;&lt;c:out value="\${x.description}"/&gt;&lt;/td&gt;
        &lt;td&gt;\${x.active ? 'Active' : 'Inactive'}&lt;/td&gt;
        &lt;td&gt;&lt;a href="category?id=\${x.id}"&gt;Edit&lt;/a&gt; &lt;form method="post" …&gt;…Activate/Deactivate…&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;c:forEach begin="1" end="\${pages}" var="i"&gt;               <span class="tok-comment">&lt;!-- keep kw/status/sort in every link --&gt;</span>
  &lt;a class="\${i == page ? 'active' : ''}" href="?page=\${i}&amp;amp;kw=\${param.kw}&amp;amp;status=\${param.status}&amp;amp;sort=\${param.sort}"&gt;\${i}&lt;/a&gt;
&lt;/c:forEach&gt;
&lt;jsp:include page="/common/footer.jsp"/&gt;</pre>`;
      const detailJsp = `<pre>&lt;c:set var="isNew" value="\${c.id == 0}"/&gt;
&lt;h2&gt;\${isNew ? 'Add category' : 'Category detail'}&lt;/h2&gt;
&lt;form method="post" action="category" enctype="multipart/form-data"&gt;
  &lt;input type="hidden" name="id" value="\${c.id}"&gt;
  &lt;input name="name" value="&lt;c:out value='\${c.name}'/&gt;" maxlength="50" required&gt;
  &lt;span class="error"&gt;\${err.name}&lt;/span&gt;              <span class="tok-comment">&lt;!-- message next to the field --&gt;</span>
  &lt;input type="file" name="image" accept=".jpg,.jpeg,.png"&gt; &lt;span class="error"&gt;\${err.image}&lt;/span&gt;
  &lt;textarea name="description" maxlength="500"&gt;&lt;c:out value="\${c.description}"/&gt;&lt;/textarea&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="categories"&gt;Back to list&lt;/a&gt;
&lt;/form&gt;</pre>`;
      return bi(`<h3>6. The views — shared layout, one JSP per screen</h3>
<p class="nhan">category-list.jsp</p>
${listJsp}
<p class="nhan">category-detail.jsp — the same page for view, add and update</p>
${detailJsp}
<ul>
<li><strong>Shared layout</strong> — header, menu and footer are included, never copied; changing the menu once changes every screen (Policies: "code chung trong 1 jsp").</li>
<li><strong>Context path</strong> — links use <code>pageContext.request.contextPath</code> so the app works whatever name Tomcat deploys it under.</li>
<li><strong>Escape output</strong> — <code>&lt;c:out&gt;</code> shows <code>&lt;script&gt;</code> typed into a description as text; printing raw EL would run it in the admin's browser.</li>
<li><strong>Client checks are a courtesy</strong> — <code>maxlength</code>, <code>required</code>, <code>accept</code> help the user, but the servlet validates again because a request can be sent without the form.</li>
<li><strong>Keep the state</strong> — paging links carry the keyword, status and sort; otherwise page 2 silently loses the filter (a favourite Leakage).</li>
</ul>`,
      `<h3>6. View — layout dùng chung, mỗi màn hình một JSP</h3>
<p class="nhan">category-list.jsp</p>
${listJsp}
<p class="nhan">category-detail.jsp — cùng một trang cho xem, thêm và sửa</p>
${detailJsp}
<ul>
<li><strong>Layout dùng chung</strong> — header, menu, footer được include, không chép; sửa menu một lần là mọi màn hình đổi theo (Policies: "code chung trong 1 jsp").</li>
<li><strong>Context path</strong> — link dùng <code>pageContext.request.contextPath</code> để ứng dụng chạy đúng dù Tomcat deploy dưới tên gì.</li>
<li><strong>Escape đầu ra</strong> — <code>&lt;c:out&gt;</code> hiện <code>&lt;script&gt;</code> gõ trong mô tả thành chữ; in thẳng EL thì đoạn script đó sẽ chạy trong trình duyệt của admin.</li>
<li><strong>Kiểm tra phía client chỉ là phép lịch sự</strong> — <code>maxlength</code>, <code>required</code>, <code>accept</code> giúp người dùng, nhưng servlet vẫn validate lại vì request có thể được gửi mà không qua form.</li>
<li><strong>Giữ trạng thái</strong> — link phân trang mang theo từ khoá, trạng thái và kiểu sắp xếp; nếu không, sang trang 2 là mất bộ lọc (một Leakage rất hay gặp).</li>
</ul>`);
    })(),
    (() => {
      const tx = `<pre><span class="tok-comment">// ApplyJobDAO.apply — member A's ITER2 screen "Apply job": two writes that must succeed together</span>
<span class="tok-keyword">public void</span> apply(<span class="tok-keyword">int</span> freelancerId, <span class="tok-keyword">int</span> postId, String cvUrl) <span class="tok-keyword">throws</span> SQLException {
    <span class="tok-keyword">try</span> (Connection c = getConnection()) {
        c.setAutoCommit(<span class="tok-keyword">false</span>);                                   <span class="tok-comment">// start the transaction</span>
        <span class="tok-keyword">try</span> (PreparedStatement ins = c.prepareStatement(
                 "INSERT INTO job_apply(freelancer_id, post_id, cv_url, status) VALUES (?,?,?,'PENDING')");
             PreparedStatement upd = c.prepareStatement(
                 "UPDATE post SET apply_count = apply_count + 1 WHERE post_id = ? AND status = 'OPEN'")) {
            ins.setInt(1, freelancerId); ins.setInt(2, postId); ins.setString(3, cvUrl);
            ins.executeUpdate();                                     <span class="tok-comment">// UNIQUE(freelancer_id, post_id) stops double apply</span>
            upd.setInt(1, postId);
            <span class="tok-keyword">if</span> (upd.executeUpdate() == 0) <span class="tok-keyword">throw new</span> SQLException("Post is closed");
            c.commit();
        } <span class="tok-keyword">catch</span> (SQLException e) {
            c.rollback();                                            <span class="tok-comment">// nothing half-saved</span>
            <span class="tok-keyword">throw</span> e;
        }
    }
}</pre>`;
      const auth = `<pre><span class="tok-keyword">@WebFilter</span>("/admin/*")
<span class="tok-keyword">public class</span> AuthFilter <span class="tok-keyword">implements</span> Filter {
    <span class="tok-keyword">public void</span> doFilter(ServletRequest rq, ServletResponse rs, FilterChain chain) <span class="tok-keyword">throws</span> … {
        HttpServletRequest req = (HttpServletRequest) rq;
        User u = (User) req.getSession().getAttribute("user");
        <span class="tok-keyword">if</span> (u == <span class="tok-keyword">null</span>)               { ((HttpServletResponse) rs).sendRedirect(req.getContextPath() + "/login"); <span class="tok-keyword">return</span>; }
        <span class="tok-keyword">if</span> (!"ADMIN".equals(u.getRole())) { ((HttpServletResponse) rs).sendError(403); <span class="tok-keyword">return</span>; }
        chain.doFilter(rq, rs);
    }
}</pre>`;
      return bi(`<h3>7. When one action writes twice — a JDBC transaction</h3>
${tx}
<p>If the post was closed a second ago, the insert is rolled back: no application exists for a closed post and the counter stays correct. Without <code>setAutoCommit(false)</code> the first statement would already be permanent.</p>
<h3>8. Protecting screens by role — one filter, not a check in every JSP</h3>
${auth}
<p>One View List screen used by several roles (Policies rule 3) checks the role <em>inside</em> the servlet to decide which buttons and rows to show; the filter only decides who may enter the URL at all.</p>
<h3>9. Mistakes that cost Quality or LOC</h3>
<ol>
<li><strong>SQL inside the JSP or servlet</strong> — no DAO, nothing reusable, and the teacher cannot find "your" data access.</li>
<li><strong>Paging done in Java</strong> — <code>getAll()</code> then <code>subList()</code>: fine with 10 demo rows, dead with 10,000.</li>
<li><strong>Add, Update and View as three JSPs</strong> — triple the code, and the template counts them as one screen anyway.</li>
<li><strong>Error = stack trace</strong> — a <code>NumberFormatException</code> page for <code>?page=abc</code> is a Leakage.</li>
<li><strong>AI-generated code you cannot explain</strong> — the 30-minute live change will expose it. Log the AI use (lesson 4.7) and rewrite what you do not understand.</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Connection pooling.</strong> Opening a new MySQL connection for every request costs tens of milliseconds and, under load, exhausts the server's connection limit. Production Java apps borrow connections from a pool (HikariCP, or Tomcat's JNDI <code>DataSource</code> declared in <code>context.xml</code>). Because every DAO here calls <code>getConnection()</code> from one <code>DBContext</code>, switching to a pool is a change in one file. <em>Outside the syllabus because a class demo never has enough users to feel it.</em></div>`,
      `<h3>7. Khi một thao tác ghi hai lần — transaction JDBC</h3>
${tx}
<p>Nếu bài đăng vừa bị đóng một giây trước, lệnh insert bị rollback: không có đơn ứng tuyển nào cho bài đã đóng và bộ đếm vẫn đúng. Không có <code>setAutoCommit(false)</code> thì câu lệnh đầu tiên đã được lưu vĩnh viễn.</p>
<h3>8. Bảo vệ màn hình theo role — một filter, không phải kiểm tra trong từng JSP</h3>
${auth}
<p>Một màn hình View List dùng cho nhiều role (luật 3 của Policies) kiểm tra role <em>bên trong</em> servlet để quyết định hiện nút và dòng nào; filter chỉ quyết định ai được vào URL đó.</p>
<h3>9. Những lỗi làm mất Quality hoặc LOC</h3>
<ol>
<li><strong>SQL nằm trong JSP hoặc servlet</strong> — không có DAO, không dùng lại được, và giảng viên không tìm thấy phần truy cập dữ liệu "của bạn".</li>
<li><strong>Phân trang bằng Java</strong> — <code>getAll()</code> rồi <code>subList()</code>: ổn với 10 dòng demo, chết với 10.000 dòng.</li>
<li><strong>Add, Update, View thành ba JSP</strong> — gấp ba lượng code, mà file mẫu vẫn tính là một màn hình.</li>
<li><strong>Lỗi = stack trace</strong> — trang <code>NumberFormatException</code> khi gõ <code>?page=abc</code> là một Leakage.</li>
<li><strong>Code AI sinh ra mà không giải thích được</strong> — bài sửa code trực tiếp 30 phút sẽ lộ ra ngay. Ghi lại việc dùng AI (bài 4.7) và viết lại phần bạn chưa hiểu.</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Connection pool.</strong> Mở một kết nối MySQL mới cho mỗi request tốn hàng chục mili-giây và, khi tải cao, làm cạn giới hạn kết nối của server. Ứng dụng Java thật mượn kết nối từ một pool (HikariCP, hoặc <code>DataSource</code> JNDI của Tomcat khai trong <code>context.xml</code>). Vì mọi DAO ở đây đều gọi <code>getConnection()</code> từ một <code>DBContext</code>, chuyển sang pool chỉ là sửa một file. <em>Ngoài giáo trình vì buổi demo trên lớp không bao giờ đủ người dùng để thấy vấn đề.</em></div>`);
    })(),
    books([
      ['gomaa', 'Ch. 12 "Overview of software architecture" (architectural patterns, layers) and Ch. 15 "Designing client/server software architectures"', 'Chương 12 "Overview of software architecture" (mẫu kiến trúc, phân lớp) và Chương 15 "Designing client/server software architectures"'],
      ['sommerville', 'Ch. 13 "Security engineering" (injection, input validation)', 'Chương 13 "Security engineering" (injection, validate đầu vào)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 4.5 UI themes & the TDS ─────────────────────── */
const L45 = {
  title: '4.5 — Adopting a UI theme & writing a Technical Design Spec (prompt #8)|||4.5 — Áp dụng UI theme & viết Technical Design Spec (prompt #8)',
  slug: 'swp391-4-ui-themes-tds',
  type: 'VIDEO',
  description: '7 UI theme thầy/cô gợi ý (AdminDirector, AdminKit, AdminLTE, DashMin, Doctris, EduChamp, ZeShopper), cách cắt một theme HTML thành header/menu/footer JSP dùng chung, và prompt #8 sinh Technical Design Spec: nội dung, khi nào hữu ích, cần kiểm lại gì.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.5 · Templates/UI ThemesTemplates-20240902.zip · Claude_Prompts.txt prompt #8</span>
<h2>Adopting a UI theme and writing a Technical Design Spec</h2>
<p class="lead">Two decisions made once, early in iteration 1, save every member hours in every iteration: <strong>which UI theme the whole team uses</strong> (so all screens look like one product, as the Policies sheet demands), and <strong>which shared files exist and who builds them when</strong> — the job of a Technical Design Spec (TDS).</p>
<div class="callout"><strong>After this lesson you can…</strong>
<ul>
<li>pick one of the 7 themes the teacher provides, knowing what each one is built for;</li>
<li>turn a static HTML theme into a shared JSP layout (header, menu, footer) in six steps;</li>
<li>explain what prompt #8 asks the AI for, which sections matter for a Servlet/JSP project, and when a TDS is worth writing.</li>
</ul></div>
<h3>1. The 7 themes in the teacher's zip</h3>
<table>
<thead><tr><th>Theme</th><th>What it is</th><th>Bootstrap</th><th>HTML pages</th><th>Good starting pages</th><th>Fits systems like…</th></tr></thead>
<tbody>
<tr><td><strong>AdminDirector</strong></td><td>classic admin dashboard</td><td>3.0.3</td><td>7</td><td>dashboard, basic_form, general</td><td>small back-office tools</td></tr>
<tr><td><strong>AdminKit</strong></td><td>modern admin kit</td><td>5.1.3</td><td>49</td><td>dashboard-ecommerce, forms-layouts, forms-validation, charts, calendar</td><td>any management system — the safest default</td></tr>
<tr><td><strong>AdminLTE 2</strong></td><td>the best-known free admin template, with docs</td><td>3.3.7</td><td>190</td><td>index/index2, tables, forms, documentation</td><td>large admin areas with many list screens</td></tr>
<tr><td><strong>DashMin</strong></td><td>light admin template</td><td>5.0.0</td><td>12</td><td>index, blank, form, chart, element, 404</td><td>teams that want few files to adapt</td></tr>
<tr><td><strong>Doctris</strong></td><td>clinic / doctor-appointment admin</td><td>5.0.2</td><td>31</td><td>doctors, patients, appointment, invoice, blogs, login, signup, forgot-password</td><td>clinic, booking, service-appointment systems</td></tr>
<tr><td><strong>EduChamp</strong></td><td>education website + admin dashboard</td><td>4.1.0</td><td>38</td><td>courses, user-profile, teacher-profile, review, mailbox</td><td>course, e-learning, training-centre systems</td></tr>
<tr><td><strong>ZeShopper</strong> (E-Shopper)</td><td>e-commerce storefront</td><td>3.0.3</td><td>10</td><td>index, cart, checkout, blog, contact-us, 404</td><td>shops — the customer-facing side</td></tr>
</tbody>
</table>
<p class="nhan">Choosing</p>
<ul>
<li><strong>One theme per side</strong> — an admin theme for the back office, optionally one storefront/landing theme for guests. Never mix two admin themes.</li>
<li><strong>Same Bootstrap major version</strong> if you use two — Bootstrap 3 and 5 class names differ (<code>panel</code> vs <code>card</code>, <code>col-xs-</code> vs <code>col-</code>) and their CSS fight each other.</li>
<li><strong>Match your domain</strong> — for Job IT for Freelancer: AdminKit for Admin/Recruiter screens; the public job pages can reuse AdminKit's layout with a top navbar.</li>
</ul>
<h3>2. From HTML theme to shared JSP layout — six steps</h3>
<ol>
<li><strong>Copy assets</strong> — the theme's <code>css/ js/ img/ fonts/</code> into <code>web/assets/</code>. Delete demo pages you will not use.</li>
<li><strong>Cut the page in three</strong> — open <code>blank.html</code> (or <code>index.html</code>): everything above the content area → <code>common/header.jsp</code>; the sidebar → <code>common/menu.jsp</code>; everything below → <code>common/footer.jsp</code>.</li>
<li><strong>Fix every path</strong> — <code>href="css/app.css"</code> becomes <code>href="\${pageContext.request.contextPath}/assets/css/app.css"</code>, or pages in <code>/admin/</code> lose their styling.</li>
<li><strong>Make the menu role-aware</strong> — wrap each item in <code>&lt;c:if test="\${sessionScope.user.role == 'ADMIN'}"&gt;</code>; this is the template's "Header/Footer/Menu đã phân quyền" row.</li>
<li><strong>Build one sample screen</strong> — a list page from the theme's table + a form page from its form, with the includes — every member copies <em>this</em>, not the raw theme.</li>
<li><strong>Commit it first</strong> — the layout owner merges it on day 1–2 of ITER1 so no one styles his screens alone.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Theme demo pages are not LOC.</strong> A theme's dashboard full of fake charts earns nothing until each widget reads your database. And keep the theme's licence file and footer credit — most free themes require the attribution.</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.5 · Templates/UI ThemesTemplates-20240902.zip · Claude_Prompts.txt prompt #8</span>
<h2>Áp dụng UI theme và viết Technical Design Spec</h2>
<p class="lead">Hai quyết định làm một lần, sớm trong iteration 1, tiết kiệm cho mỗi thành viên hàng giờ ở mọi iteration: <strong>cả nhóm dùng UI theme nào</strong> (để mọi màn hình trông như một sản phẩm, đúng như sheet Policies yêu cầu), và <strong>có những file dùng chung nào, ai làm, khi nào</strong> — việc của Technical Design Spec (TDS).</p>
<div class="callout"><strong>Học xong bài này bạn có thể…</strong>
<ul>
<li>chọn một trong 7 theme giảng viên cung cấp, biết mỗi cái sinh ra cho loại hệ thống nào;</li>
<li>biến một theme HTML tĩnh thành layout JSP dùng chung (header, menu, footer) trong sáu bước;</li>
<li>giải thích prompt #8 yêu cầu AI những gì, phần nào quan trọng với dự án Servlet/JSP, và khi nào đáng viết TDS.</li>
</ul></div>
<h3>1. 7 theme trong file zip của giảng viên</h3>
<table>
<thead><tr><th>Theme</th><th>Là gì</th><th>Bootstrap</th><th>Số trang HTML</th><th>Trang nên lấy làm gốc</th><th>Hợp với hệ thống kiểu…</th></tr></thead>
<tbody>
<tr><td><strong>AdminDirector</strong></td><td>dashboard admin cổ điển</td><td>3.0.3</td><td>7</td><td>dashboard, basic_form, general</td><td>công cụ back-office nhỏ</td></tr>
<tr><td><strong>AdminKit</strong></td><td>bộ admin hiện đại</td><td>5.1.3</td><td>49</td><td>dashboard-ecommerce, forms-layouts, forms-validation, charts, calendar</td><td>mọi hệ thống quản lý — lựa chọn an toàn nhất</td></tr>
<tr><td><strong>AdminLTE 2</strong></td><td>template admin miễn phí nổi tiếng nhất, có tài liệu</td><td>3.3.7</td><td>190</td><td>index/index2, tables, forms, documentation</td><td>khu admin lớn nhiều màn hình danh sách</td></tr>
<tr><td><strong>DashMin</strong></td><td>template admin gọn nhẹ</td><td>5.0.0</td><td>12</td><td>index, blank, form, chart, element, 404</td><td>nhóm muốn ít file phải sửa</td></tr>
<tr><td><strong>Doctris</strong></td><td>admin phòng khám / đặt lịch bác sĩ</td><td>5.0.2</td><td>31</td><td>doctors, patients, appointment, invoice, blogs, login, signup, forgot-password</td><td>phòng khám, đặt lịch, đặt dịch vụ</td></tr>
<tr><td><strong>EduChamp</strong></td><td>website giáo dục + dashboard admin</td><td>4.1.0</td><td>38</td><td>courses, user-profile, teacher-profile, review, mailbox</td><td>khoá học, e-learning, trung tâm đào tạo</td></tr>
<tr><td><strong>ZeShopper</strong> (E-Shopper)</td><td>giao diện cửa hàng online</td><td>3.0.3</td><td>10</td><td>index, cart, checkout, blog, contact-us, 404</td><td>shop — phía khách hàng</td></tr>
</tbody>
</table>
<p class="nhan">Cách chọn</p>
<ul>
<li><strong>Mỗi phía một theme</strong> — một theme admin cho back office, có thể thêm một theme cửa hàng/landing cho khách. Không bao giờ trộn hai theme admin.</li>
<li><strong>Cùng major version Bootstrap</strong> nếu dùng hai theme — class của Bootstrap 3 và 5 khác nhau (<code>panel</code> với <code>card</code>, <code>col-xs-</code> với <code>col-</code>) và CSS của chúng đá nhau.</li>
<li><strong>Hợp lĩnh vực</strong> — với Job IT for Freelancer: AdminKit cho màn hình Admin/Recruiter; trang việc làm công khai có thể dùng lại layout AdminKit với navbar phía trên.</li>
</ul>
<h3>2. Từ theme HTML thành layout JSP dùng chung — sáu bước</h3>
<ol>
<li><strong>Chép asset</strong> — thư mục <code>css/ js/ img/ fonts/</code> của theme vào <code>web/assets/</code>. Xoá các trang demo không dùng.</li>
<li><strong>Cắt trang làm ba</strong> — mở <code>blank.html</code> (hoặc <code>index.html</code>): mọi thứ phía trên vùng nội dung → <code>common/header.jsp</code>; thanh bên → <code>common/menu.jsp</code>; phần phía dưới → <code>common/footer.jsp</code>.</li>
<li><strong>Sửa mọi đường dẫn</strong> — <code>href="css/app.css"</code> thành <code>href="\${pageContext.request.contextPath}/assets/css/app.css"</code>, nếu không các trang trong <code>/admin/</code> mất hết style.</li>
<li><strong>Menu theo role</strong> — bọc từng mục trong <code>&lt;c:if test="\${sessionScope.user.role == 'ADMIN'}"&gt;</code>; đây chính là dòng "Header/Footer/Menu đã phân quyền" của file mẫu.</li>
<li><strong>Dựng một màn hình mẫu</strong> — một trang danh sách từ bảng của theme + một trang form từ form của theme, có include — mọi thành viên chép <em>trang này</em>, không chép theme gốc.</li>
<li><strong>Commit trước tiên</strong> — người phụ trách layout merge nó trong ngày 1–2 của ITER1 để không ai tự trang trí màn hình của mình.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Trang demo của theme không phải LOC.</strong> Dashboard của theme đầy biểu đồ giả không được điểm nào cho tới khi từng widget đọc dữ liệu thật từ database của bạn. Và giữ file licence cùng dòng credit ở footer — hầu hết theme miễn phí yêu cầu ghi nguồn.</div>`),
    bi(`<h3>3. The teacher's prompt #8 — a Technical Design Spec</h3>
<p>Claude_Prompts.txt walks a Job Board System from idea to test cases in 9 prompts. Prompt #8 comes after the PRD (#1), flows, use cases, ERD (#2–#5), UI spec (#6) and MySQL schema (#7). Its role: <em>"You are the Technical Architect of [project]. From the attached PRD, UI Specification and DB Schema, write a complete Technical Design Spec (TDS)."</em></p>
<p class="nhan">General requirements written in the prompt</p>
<ul>
<li><strong>Markdown</strong> output, Vietnamese text, file/code names kept in English.</li>
<li><strong>No "…" or "etc."</strong> — every file and folder list must be complete.</li>
<li><strong>Every shared file</strong> must state its name, its main content, and the milestone in which it is built.</li>
</ul>
<p class="nhan">The 10 sections it asks for</p>
<table>
<thead><tr><th>#</th><th>Section</th><th>Contents</th><th>For a Servlet/JSP team, read as…</th></tr></thead>
<tbody>
<tr><td>1</td><td>Overview</td><td>purpose (bridge PRD/SRS → implementation plan), scope, reference documents</td><td>same</td></tr>
<tr><td>2</td><td>Technology stack</td><td>Layer · Technology · Version · Notes — FE, BE, DB, auth, email, storage, build</td><td>JDK, Tomcat, Servlet/JSP + JSTL, MySQL 8, Connector/J, JavaMail, theme + Bootstrap version</td></tr>
<tr><td>3</td><td>Frontend architecture</td><td>full folder tree, SHARED files (CSS tokens, constants, utils, API client, routing, i18n), root configs</td><td>the <code>web/</code> tree: common/*.jsp, assets, one JSP per screen</td></tr>
<tr><td>4</td><td>Backend architecture</td><td>full package tree; common layer — response wrapper, global exception handler, error codes, validators, utils; config files</td><td>dal / model / controller / filter / util; an error page in web.xml instead of a JSON handler</td></tr>
<tr><td>5</td><td>API design conventions</td><td>URL prefixes by actor, success/error formats, pagination params, file-upload rules</td><td>URL patterns (<code>/admin/*</code>, <code>/recruiter/*</code>), query params <code>page, kw, sort</code>, upload rules</td></tr>
<tr><td>6</td><td>Security design</td><td>auth flow (token, TTL, refresh), authorization by layer (URL / method / data-scoped), CORS</td><td>session login, AuthFilter per URL pattern, "a recruiter sees only his own posts" in the DAO</td></tr>
<tr><td>7</td><td>Database conventions</td><td>migration tool and naming, timezone DB → API → FE, table creation order</td><td>versioned SQL scripts per iteration, table order by foreign keys</td></tr>
<tr><td>8</td><td>Cross-cutting concerns</td><td>e-mail trigger points, audit trail, i18n display, file storage, <strong>status transition table</strong> (From · Allowed · Actor)</td><td>e.g. post status DRAFT → OPEN → CLOSED, who may change it</td></tr>
<tr><td>9</td><td>Milestone → file map</td><td>Group · Screens · Source files · Database tables; every shared file assigned to a milestone</td><td>ITER1/2/3 → screens → files → tables: a ready-made Product sheet cross-check</td></tr>
<tr><td>10</td><td>Checklist before the implementation plan</td><td>FE, BE and cross-cutting checklists</td><td>your ITER1 "common parts done?" list</td></tr>
</tbody>
</table>
<p class="nhan">When it helps — and when it does not</p>
<ul>
<li><strong>Helps</strong> — right before ITER1 coding: it forces the team to list shared files (layout, DBContext, AuthFilter, Validator) and give them an owner and an iteration, which is exactly what the first demo needs.</li>
<li><strong>Helps</strong> — section 8's status-transition tables and section 6's data-scoped rules become business rules in your RDS and test cases later (prompt #9).</li>
<li><strong>Does not help</strong> — pasted unedited: the prompt assumes a React SPA + REST API (<code>axiosClient.ts</code>, <code>tokens.css</code>, refresh tokens). A JSP team that copies those sections designs a system it will not build.</li>
</ul>
<ol>
<li><strong>Feed it your real inputs</strong> — your use case list, your MySQL schema, your screen list; tell it the stack is Servlet/JSP + MySQL.</li>
<li><strong>Check every file name against the repo</strong> — the milestone → file map must match the Product sheet PICs.</li>
<li><strong>Log it</strong> in the AI Usage Report (lesson 4.7): what it produced, what you changed.</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Architecture Decision Records (ADR).</strong> A TDS describes the design at one moment; teams also keep one short file per decision — <em>context · decision · consequences</em> — e.g. "ADR-003: soft delete for categories, because posts reference them". When the teacher asks at the Final Presentation "why did you do it this way?", the answer is already written. <em>Outside the syllabus because the templates have no place for decision history.</em></div>`,
    `<h3>3. Prompt #8 của giảng viên — Technical Design Spec</h3>
<p>Claude_Prompts.txt đưa một Job Board System từ ý tưởng tới test case qua 9 prompt. Prompt #8 đứng sau PRD (#1), các luồng, use case, ERD (#2–#5), UI spec (#6) và schema MySQL (#7). Vai trò của nó: <em>"Bạn là Technical Architect cho dự án [TÊN DỰ ÁN]. Dựa trên các tài liệu đính kèm (PRD, UI Specification, DB Schema), hãy soạn tài liệu Technical Design Spec (TDS) đầy đủ."</em></p>
<p class="nhan">Yêu cầu chung ghi trong prompt</p>
<ul>
<li>Output dạng <strong>Markdown</strong>, tiếng Việt, tên file/code giữ nguyên tiếng Anh.</li>
<li><strong>Không được viết "…" hay "v.v."</strong> — mọi danh sách file/thư mục phải đầy đủ.</li>
<li><strong>Mỗi file dùng chung</strong> phải ghi rõ tên, nội dung chính, và milestone nào cần build.</li>
</ul>
<p class="nhan">10 mục prompt yêu cầu</p>
<table>
<thead><tr><th>#</th><th>Mục</th><th>Nội dung</th><th>Với nhóm Servlet/JSP, hiểu là…</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tổng quan</td><td>mục đích (cầu nối PRD/SRS → kế hoạch hiện thực), phạm vi, tài liệu tham chiếu</td><td>giữ nguyên</td></tr>
<tr><td>2</td><td>Technology stack</td><td>Layer · Công nghệ · Phiên bản · Ghi chú — FE, BE, DB, auth, email, storage, build</td><td>JDK, Tomcat, Servlet/JSP + JSTL, MySQL 8, Connector/J, JavaMail, theme + phiên bản Bootstrap</td></tr>
<tr><td>3</td><td>Kiến trúc frontend</td><td>cây thư mục đầy đủ, các file SHARED (CSS token, constants, utils, API client, routing, i18n), file cấu hình gốc</td><td>cây <code>web/</code>: common/*.jsp, assets, mỗi màn hình một JSP</td></tr>
<tr><td>4</td><td>Kiến trúc backend</td><td>cây package đầy đủ; tầng common — response wrapper, global exception handler, mã lỗi, validator, utils; file config</td><td>dal / model / controller / filter / util; trang lỗi trong web.xml thay cho handler JSON</td></tr>
<tr><td>5</td><td>Quy ước API</td><td>tiền tố URL theo actor, định dạng thành công/lỗi, tham số phân trang, quy tắc upload file</td><td>mẫu URL (<code>/admin/*</code>, <code>/recruiter/*</code>), tham số <code>page, kw, sort</code>, quy tắc upload</td></tr>
<tr><td>6</td><td>Thiết kế bảo mật</td><td>luồng xác thực (token, TTL, refresh), phân quyền theo tầng (URL / method / theo dữ liệu), CORS</td><td>đăng nhập bằng session, AuthFilter theo mẫu URL, "recruiter chỉ thấy bài của mình" trong DAO</td></tr>
<tr><td>7</td><td>Quy ước database</td><td>công cụ migration và cách đặt tên, múi giờ DB → API → FE, thứ tự tạo bảng</td><td>script SQL có phiên bản theo iteration, thứ tự bảng theo khoá ngoại</td></tr>
<tr><td>8</td><td>Vấn đề xuyên suốt</td><td>điểm kích hoạt e-mail, audit trail, hiển thị đa ngôn ngữ, lưu file, <strong>bảng chuyển trạng thái</strong> (From · Allowed · Actor)</td><td>ví dụ trạng thái bài đăng DRAFT → OPEN → CLOSED, ai được đổi</td></tr>
<tr><td>9</td><td>Milestone → file map</td><td>Nhóm · Màn hình · File source · Bảng DB; mọi file dùng chung gắn với một milestone</td><td>ITER1/2/3 → màn hình → file → bảng: bản đối chiếu sẵn cho sheet Product</td></tr>
<tr><td>10</td><td>Checklist trước khi lập kế hoạch hiện thực</td><td>checklist FE, BE và xuyên suốt</td><td>danh sách "phần chung xong chưa?" của ITER1</td></tr>
</tbody>
</table>
<p class="nhan">Khi nào có ích — và khi nào không</p>
<ul>
<li><strong>Có ích</strong> — ngay trước khi code ITER1: nó buộc nhóm liệt kê các file dùng chung (layout, DBContext, AuthFilter, Validator) và gán người phụ trách cùng iteration, đúng thứ buổi demo đầu tiên cần.</li>
<li><strong>Có ích</strong> — bảng chuyển trạng thái ở mục 8 và luật phân quyền theo dữ liệu ở mục 6 sau này thành business rule trong RDS và thành test case (prompt #9).</li>
<li><strong>Không có ích</strong> — khi dán nguyên văn: prompt giả định React SPA + REST API (<code>axiosClient.ts</code>, <code>tokens.css</code>, refresh token). Nhóm JSP chép các mục đó là đang thiết kế một hệ thống sẽ không bao giờ xây.</li>
</ul>
<ol>
<li><strong>Đưa đầu vào thật</strong> — danh sách use case, schema MySQL, danh sách màn hình của nhóm; nói rõ stack là Servlet/JSP + MySQL.</li>
<li><strong>Đối chiếu từng tên file với repo</strong> — milestone → file map phải khớp với PIC trong sheet Product.</li>
<li><strong>Ghi lại</strong> trong AI Usage Report (bài 4.7): AI sinh ra gì, bạn sửa gì.</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Architecture Decision Record (ADR).</strong> TDS mô tả thiết kế tại một thời điểm; các nhóm còn giữ mỗi quyết định một file ngắn — <em>bối cảnh · quyết định · hệ quả</em> — ví dụ "ADR-003: xoá mềm category, vì bài đăng tham chiếu tới nó". Khi hội đồng hỏi ở Final Presentation "sao em làm thế này?", câu trả lời đã được viết sẵn. <em>Ngoài giáo trình vì các template không có chỗ cho lịch sử quyết định.</em></div>`),
    books([
      ['gomaa', 'Ch. 14 "Designing object-oriented software architectures" and Ch. 20 "Software quality attributes" (the trade-offs a design decision records)', 'Chương 14 "Designing object-oriented software architectures" và Chương 20 "Software quality attributes" (các đánh đổi mà một quyết định thiết kế ghi lại)'],
      ['sommerville', 'Ch. 6 "Architectural design" (architectural views, MVC and layered patterns)', 'Chương 6 "Architectural design" (các góc nhìn kiến trúc, mẫu MVC và phân lớp)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 4.6 Daily integration & code review (existing slug) ─────────────────────── */
const L46 = {
  title: '4.6 — Integrating every day: Git, conflicts, code review & tags|||4.6 — Tích hợp hằng ngày: Git, xung đột, code review & tag',
  slug: 'swp391-4-2-code-review-integration',
  type: 'VIDEO',
  description: 'Chuẩn code chung, commit và merge vào main mỗi ngày, xử lý xung đột theo Student Guides, review chéo trước khi merge, nhãn issue GitLab và gắn tag cho mỗi iteration.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.6 · Student Guides slides 8–11, 13, 18 · Policies sheet</span>
<h2>Integrating every day — Git, conflicts, code review and tags</h2>
<p class="lead">In a solo assignment messy code only hurts you. In a five-person SWP391 team it hurts everyone — and the Policies sheet turns it into a rule: <strong>one common source, merged into main every day, demoed from one copy</strong>. This lesson is how to live with that rule without breaking each other's screens.</p>
<div class="callout"><strong>After this lesson you can…</strong>
<ul>
<li>agree a small set of coding standards that make five people's code look like one;</li>
<li>run the daily Git loop of the Student Guides and resolve a merge conflict by hand;</li>
<li>review a teammate's change with a three-question checklist;</li>
<li>tag the source at the end of an iteration so the teacher grades exactly what you demoed.</li>
</ul></div>
<h3>1. Coding standards — agree once, apply everywhere</h3>
<table>
<thead><tr><th>Topic</th><th>Team rule (example)</th><th>Why the teacher notices</th></tr></thead>
<tbody>
<tr><td>Naming</td><td><code>CategoryDAO</code>, <code>CategoryListServlet</code>, <code>category-list.jsp</code>; methods <code>findById</code>, <code>search</code>, <code>insert</code></td><td>"Show me your DAO" — you find it in two seconds</td></tr>
<tr><td>Structure</td><td>same packages for every entity: dal / model / controller; same JSP folder per actor</td><td>Policies: "chung định dạng, format"</td></tr>
<tr><td>Formatting</td><td>NetBeans <em>Source → Format</em> (Alt+Shift+F) before every commit, UTF-8, 4 spaces</td><td>diffs show real changes, not whitespace</td></tr>
<tr><td>UI</td><td>only the theme's classes; messages in one style (success green, error red under the field)</td><td>screens look like one product</td></tr>
<tr><td>Comments</td><td>explain <em>why</em> (business rule, UC ID), not <em>what</em></td><td>the 30-minute live change is easier in readable code</td></tr>
</tbody>
</table>
<h3>2. The daily Git loop (Student Guides slides 8–9)</h3>
<pre><span class="tok-comment"># once — set up</span>
git init
git remote add origin https://gitlab.com/&lt;group&gt;/&lt;project&gt;.git
git pull origin main

<span class="tok-comment"># every day — at least once</span>
git pull origin main                 <span class="tok-comment"># 1. take the others' work first</span>
<span class="tok-comment">#   … code in NetBeans, build, run, click through your screen …</span>
git add .
git commit -m "UC37 category list: add status filter"
git push origin main                 <span class="tok-comment"># 2. share yours the same day</span></pre>
<p class="nhan">Rules that make the loop safe</p>
<ul>
<li><strong>Compile and run before you push</strong> — slide 9: "check code đảm bảo dịch, chạy ko lỗi". A red main blocks four people.</li>
<li><strong>Pull before you start, push before you stop</strong> — the longer your change stays local, the bigger the conflict.</li>
<li><strong>Never commit</strong> <code>build/</code>, <code>dist/</code>, <code>nbproject/private/</code> or a DB password — add a <code>.gitignore</code> on day 1.</li>
<li><strong>Your own account</strong> — commits under a teammate's name are LOC for the teammate (Policies).</li>
</ul>
<h3>3. A merge conflict, resolved (Student Guides slides 10–11)</h3>
<p>Two members edit the same line of <code>menu.jsp</code>: member A adds "Skills" and pushes first; member D adds "Reports" and pushes later — Git refuses: <em>failed to push</em>.</p>
<ol>
<li><strong><code>git pull origin main</code></strong> — Git merges and marks the clash in the file.</li>
<li><strong>Edit the file by hand</strong> — keep both items, delete the markers:
<pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  &lt;li&gt;&lt;a href="reports"&gt;Reports&lt;/a&gt;&lt;/li&gt;
=======
  &lt;li&gt;&lt;a href="skills"&gt;Skills&lt;/a&gt;&lt;/li&gt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</pre></li>
<li><strong><code>git add .</code> → <code>git commit -m "merge menu: Skills + Reports"</code> → <code>git push origin main</code></strong>.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> a conflict is not an error — it is Git asking a human to choose. Run the app after resolving, before pushing.</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.6 · Student Guides slide 8–11, 13, 18 · sheet Policies</span>
<h2>Tích hợp hằng ngày — Git, xung đột, code review và tag</h2>
<p class="lead">Trong bài cá nhân, code lộn xộn chỉ hại bạn. Trong nhóm SWP391 năm người nó hại tất cả — và sheet Policies biến điều đó thành luật: <strong>một source chung, merge vào main mỗi ngày, demo trên một bản</strong>. Bài này dạy cách sống với luật đó mà không làm hỏng màn hình của nhau.</p>
<div class="callout"><strong>Học xong bài này bạn có thể…</strong>
<ul>
<li>thống nhất một bộ chuẩn code nhỏ để code của năm người trông như của một người;</li>
<li>chạy vòng Git hằng ngày theo Student Guides và tự tay giải quyết xung đột merge;</li>
<li>review thay đổi của đồng đội bằng checklist ba câu hỏi;</li>
<li>gắn tag source cuối iteration để giảng viên chấm đúng thứ bạn đã demo.</li>
</ul></div>
<h3>1. Chuẩn code — thống nhất một lần, áp dụng mọi nơi</h3>
<table>
<thead><tr><th>Chủ đề</th><th>Luật của nhóm (ví dụ)</th><th>Vì sao giảng viên để ý</th></tr></thead>
<tbody>
<tr><td>Đặt tên</td><td><code>CategoryDAO</code>, <code>CategoryListServlet</code>, <code>category-list.jsp</code>; method <code>findById</code>, <code>search</code>, <code>insert</code></td><td>"Cho xem DAO của em" — bạn tìm ra trong hai giây</td></tr>
<tr><td>Cấu trúc</td><td>mọi thực thể dùng cùng package: dal / model / controller; mỗi actor một thư mục JSP</td><td>Policies: "chung định dạng, format"</td></tr>
<tr><td>Định dạng</td><td>NetBeans <em>Source → Format</em> (Alt+Shift+F) trước mỗi commit, UTF-8, 4 dấu cách</td><td>diff chỉ hiện thay đổi thật, không phải khoảng trắng</td></tr>
<tr><td>UI</td><td>chỉ dùng class của theme; thông báo một kiểu (thành công màu xanh, lỗi màu đỏ dưới field)</td><td>các màn hình trông như một sản phẩm</td></tr>
<tr><td>Chú thích</td><td>giải thích <em>tại sao</em> (business rule, mã UC), không phải <em>cái gì</em></td><td>bài sửa code trực tiếp 30 phút dễ hơn khi code dễ đọc</td></tr>
</tbody>
</table>
<h3>2. Vòng Git hằng ngày (Student Guides slide 8–9)</h3>
<pre><span class="tok-comment"># một lần — thiết lập</span>
git init
git remote add origin https://gitlab.com/&lt;group&gt;/&lt;project&gt;.git
git pull origin main

<span class="tok-comment"># mỗi ngày — ít nhất một lần</span>
git pull origin main                 <span class="tok-comment"># 1. lấy việc của người khác trước</span>
<span class="tok-comment">#   … code trong NetBeans, build, chạy, bấm thử màn hình của mình …</span>
git add .
git commit -m "UC37 category list: add status filter"
git push origin main                 <span class="tok-comment"># 2. chia sẻ việc của mình trong ngày</span></pre>
<p class="nhan">Luật giữ cho vòng lặp an toàn</p>
<ul>
<li><strong>Dịch và chạy trước khi push</strong> — slide 9: "check code đảm bảo dịch, chạy ko lỗi". main hỏng là chặn bốn người.</li>
<li><strong>Pull trước khi bắt đầu, push trước khi nghỉ</strong> — thay đổi nằm ở máy càng lâu, xung đột càng lớn.</li>
<li><strong>Không bao giờ commit</strong> <code>build/</code>, <code>dist/</code>, <code>nbproject/private/</code> hay mật khẩu DB — thêm <code>.gitignore</code> ngay ngày đầu.</li>
<li><strong>Tài khoản của chính mình</strong> — commit dưới tên đồng đội là LOC của đồng đội (Policies).</li>
</ul>
<h3>3. Một xung đột merge, giải quyết (Student Guides slide 10–11)</h3>
<p>Hai thành viên cùng sửa một dòng của <code>menu.jsp</code>: thành viên A thêm "Skills" và push trước; thành viên D thêm "Reports" và push sau — Git từ chối: <em>failed to push</em>.</p>
<ol>
<li><strong><code>git pull origin main</code></strong> — Git merge và đánh dấu chỗ đụng nhau trong file.</li>
<li><strong>Sửa file bằng tay</strong> — giữ cả hai mục, xoá các dấu đánh dấu:
<pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  &lt;li&gt;&lt;a href="reports"&gt;Reports&lt;/a&gt;&lt;/li&gt;
=======
  &lt;li&gt;&lt;a href="skills"&gt;Skills&lt;/a&gt;&lt;/li&gt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</pre></li>
<li><strong><code>git add .</code> → <code>git commit -m "merge menu: Skills + Reports"</code> → <code>git push origin main</code></strong>.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> xung đột không phải lỗi — đó là Git nhờ con người chọn. Chạy lại ứng dụng sau khi giải quyết, rồi mới push.</p>`),
    bi(`<h3>4. Code review — every screen read by a teammate</h3>
<p>The Subject Guides ask members to "review and integrate the works with others". Two workable ways in GitLab:</p>
<ul>
<li><strong>Merge request</strong> — you push a short-lived branch (<code>feature/uc37-category-list</code>), open a merge request into main, a teammate approves, you merge the same day.</li>
<li><strong>Review on main</strong> — for a team that pushes directly (as in the Student Guides), a teammate reads your commit on GitLab and opens a <code>Defect</code> issue for each problem.</li>
</ul>
<p class="nhan">The three questions of every review</p>
<ol>
<li><strong>Does it work?</strong> — run it; try one unhappy case from the RDS.</li>
<li><strong>Is it safe?</strong> — any concatenated SQL, unescaped output, missing role check?</li>
<li><strong>Will the next person understand it?</strong> — team standards, shared layout, no copy of another member's code.</li>
</ol>
<p class="nhan">Worked example — a review that caught two problems</p>
<pre><span class="tok-comment">// Merge request !14 "UC7 search freelancer" — reviewer's notes</span>
"FreelancerDAO line 20: the keyword is concatenated into the SQL
 -&gt; SQL injection. Use a PreparedStatement with ?."
"freelancer-list.jsp line 33: page 2 loses the skill filter
 -&gt; add &amp;skill=… to the paging links."
<span class="tok-comment">// Author fixes both, pushes, reviewer approves -&gt; merge. Two Defect issues logged and closed.</span></pre>
<p class="dap-an">✅ A security hole and a lost filter were caught <em>before</em> the teacher saw them: they count as team-found <code>Defect</code> issues, not <code>Leakage</code> — and the screen can reach Quality L2.</p>
<div class="pitfall co-tieu-de"><strong>Big-bang integration.</strong> Five green laptops that never met produce a red build the night before the demo. The Policies sheet makes it worse than a technical problem: weekly or end-of-iteration commits mean <strong>no defence</strong>. Integrate daily so conflicts stay small.</div>
<h3>5. Closing the iteration — a tag the teacher can grade</h3>
<ol>
<li><strong>Freeze</strong> — agree a time; after it only fixes are pushed.</li>
<li><strong>Put the DB in the repo</strong> — <code>database/JobIT_schema.sql</code> and <code>JobIT_data.sql</code> updated for this iteration.</li>
<li><strong>Create the tag</strong> — GitLab <em>Repository → Tags → New tag</em> (Student Guides slide 18), e.g. <code>iter2</code>, on the commit you demo; or <code>git tag -a iter2 -m "Iteration 2"</code> then <code>git push origin iter2</code>.</li>
<li><strong>Share its URL</strong> — copy it from the address bar into the links file of the package; attach files to the tag if needed.</li>
<li><strong>Close the issues</strong> — every <code>Req</code> of the iteration is <code>3_Done</code>/Closed or explicitly moved to the next milestone.</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Technical debt.</strong> Every "we'll clean this up later" shortcut is a loan from your future self, with interest: the messier the code, the slower every later change. A little debt to make a demo is a valid <em>choice</em> — but record it as a <code>Task</code> issue ("remove duplicate paging code in 3 servlets") and repay it early in the next iteration. Teams that never repay find that iteration 3 — the one worth 25% and graded on all screens — collapses under every shortcut at once. <em>Outside the syllabus because the guides grade the result, not the cost of changing it.</em></div>`,
    `<h3>4. Code review — màn hình nào cũng có đồng đội đọc</h3>
<p>Subject Guides yêu cầu các thành viên "review and integrate the works with others". Hai cách làm được trên GitLab:</p>
<ul>
<li><strong>Merge request</strong> — push một nhánh ngắn hạn (<code>feature/uc37-category-list</code>), mở merge request vào main, đồng đội duyệt, merge ngay trong ngày.</li>
<li><strong>Review trên main</strong> — với nhóm push thẳng (như Student Guides), đồng đội đọc commit của bạn trên GitLab và mở một issue <code>Defect</code> cho mỗi vấn đề.</li>
</ul>
<p class="nhan">Ba câu hỏi của mọi lần review</p>
<ol>
<li><strong>Có chạy không?</strong> — chạy thử; thử một unhappy case trong RDS.</li>
<li><strong>Có an toàn không?</strong> — có SQL nối chuỗi, đầu ra không escape, thiếu kiểm tra role không?</li>
<li><strong>Người sau có hiểu không?</strong> — đúng chuẩn nhóm, dùng layout chung, không chép code của thành viên khác.</li>
</ol>
<p class="nhan">Ví dụ có lời giải — một lần review bắt được hai vấn đề</p>
<pre><span class="tok-comment">// Merge request !14 "UC7 search freelancer" — ghi chú của người review</span>
"FreelancerDAO dòng 20: từ khoá bị nối chuỗi vào SQL
 -&gt; SQL injection. Dùng PreparedStatement với ?."
"freelancer-list.jsp dòng 33: sang trang 2 bị mất bộ lọc skill
 -&gt; thêm &amp;skill=… vào link phân trang."
<span class="tok-comment">// Tác giả sửa cả hai, push lại, người review duyệt -&gt; merge. Hai issue Defect được ghi và đóng.</span></pre>
<p class="dap-an">✅ Một lỗ hổng bảo mật và một bộ lọc bị mất được bắt <em>trước khi</em> giảng viên nhìn thấy: chúng tính là issue <code>Defect</code> do nhóm tự tìm, không phải <code>Leakage</code> — và màn hình có thể đạt Quality L2.</p>
<div class="pitfall co-tieu-de"><strong>Tích hợp big-bang.</strong> Năm laptop đều xanh nhưng chưa từng gặp nhau sẽ cho ra một bản build đỏ đêm trước buổi demo. Sheet Policies còn làm nó tệ hơn chuyện kỹ thuật: commit hằng tuần hoặc cuối iteration mới commit là <strong>không được bảo vệ</strong>. Tích hợp mỗi ngày để xung đột luôn nhỏ.</div>
<h3>5. Đóng iteration — một tag để giảng viên chấm</h3>
<ol>
<li><strong>Đóng băng</strong> — thống nhất một mốc giờ; sau đó chỉ push bản sửa lỗi.</li>
<li><strong>Đưa DB vào repo</strong> — <code>database/JobIT_schema.sql</code> và <code>JobIT_data.sql</code> cập nhật cho iteration này.</li>
<li><strong>Tạo tag</strong> — GitLab <em>Repository → Tags → New tag</em> (Student Guides slide 18), ví dụ <code>iter2</code>, trên đúng commit bạn demo; hoặc <code>git tag -a iter2 -m "Iteration 2"</code> rồi <code>git push origin iter2</code>.</li>
<li><strong>Chia sẻ URL của tag</strong> — chép từ thanh địa chỉ vào file link của gói nộp; đính kèm file vào tag nếu cần.</li>
<li><strong>Đóng issue</strong> — mọi <code>Req</code> của iteration đều <code>3_Done</code>/Closed hoặc được chuyển rõ ràng sang milestone sau.</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Nợ kỹ thuật (technical debt).</strong> Mỗi lối tắt "để dọn sau" là một khoản vay từ chính bạn trong tương lai, có lãi: code càng bừa, mọi thay đổi sau càng chậm. Nợ một chút để kịp demo là một <em>lựa chọn</em> hợp lệ — nhưng hãy ghi nó thành issue <code>Task</code> ("gỡ code phân trang lặp ở 3 servlet") và trả sớm ở iteration sau. Nhóm không bao giờ trả sẽ thấy iteration 3 — cái nặng 25% và chấm trên mọi màn hình — sụp đổ dưới mọi lối tắt cùng lúc. <em>Ngoài giáo trình vì các guide chấm kết quả, không chấm chi phí để thay đổi nó.</em></div>`),
    books([
      ['progit', 'Ch. 3 "Git branching" (3.2 basic merge conflicts) and Ch. 2.6 "Tagging"', 'Chương 3 "Git branching" (3.2 xung đột merge cơ bản) và Mục 2.6 "Tagging"'],
      ['sommerville', 'Ch. 24.3 "Reviews and inspections" and Ch. 25 "Configuration management"', 'Mục 24.3 "Reviews and inspections" và Chương 25 "Configuration management"'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 4.7 Weekly Report & AI Usage Report ─────────────────────── */
const L47 = {
  title: '4.7 — Weekly Report (Template6) & AI Usage Report (Template5)|||4.7 — Báo cáo tuần (Template6) & báo cáo sử dụng AI (Template5)',
  slug: 'swp391-4-weekly-ai-usage-report',
  type: 'VIDEO',
  description: 'Điền Weekly Report (4 phần: trạng thái, vấn đề, kế hoạch tuần sau, đề xuất) và AI Usage Report (sheet Overview, sheet theo tuần 10 cột, sheet Instruction) — kèm ví dụ điền sẵn cho hệ thống Job IT for Freelancer.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.7 · Templates-20260512: Template6_Weekly Report.xlsx · Template5_AI Usage Report.xlsx</span>
<h2>Weekly Report and AI Usage Report</h2>
<p class="lead">The 2026 template set adds two small spreadsheets that the teacher reads between demos: a <strong>Weekly Report</strong> (what moved, what is stuck, what comes next) and an <strong>AI Usage Report</strong> (where you used AI, what it produced and what <em>you</em> did with it). Both take ten minutes a week if you keep them up to date — and both are painful to reconstruct at the end.</p>
<div class="callout"><strong>After this lesson you can…</strong>
<ul>
<li>fill all four parts of Template6 for your team's week;</li>
<li>fill the Overview sheet and a weekly sheet of Template5 — every one of the 10 columns;</li>
<li>collect AI evidence the way the Instruction sheet requires (prompt, response, follow-up);</li>
<li>avoid the entries that make a report look invented.</li>
</ul></div>
<h3>1. Template6 — Weekly Report (one sheet "Wx" per week)</h3>
<p class="nhan">Header</p>
<ul>
<li><strong>Group</strong> — your group name, e.g. SE1804_G5.</li>
<li><strong>Week</strong> — <code>dd/mm/yyyy-dd/mm/yyyy</code>, e.g. 20/05/2026-26/05/2026.</li>
</ul>
<p class="nhan">The four parts</p>
<table>
<thead><tr><th>Part</th><th>Columns</th><th>What goes in</th></tr></thead>
<tbody>
<tr><td>I. Status Report</td><td># · Project Task · In-charge · Status · Notes (work item in details)</td><td>the tasks of this week and their status (Pending / In Progress / Done)</td></tr>
<tr><td>II. Project Issues</td><td># · Project Issue · Owner · Status · Notes (solution, suggestion…)</td><td>blockers and risks, with who owns the solution</td></tr>
<tr><td>III. Next Week Plan</td><td># · Project Task · In-charge · Deadline · Notes (task details…)</td><td>the commitments for next week</td></tr>
<tr><td>IV. Other Project Matters/Suggestions</td><td># · Project Matter/Suggestions · Raised By · Date · Notes</td><td>anything for the teacher: questions, requests, proposals</td></tr>
</tbody>
</table>
<p class="nhan">Filled example — week 3 of ITER2, Job IT for Freelancer</p>
<table>
<thead><tr><th>Part</th><th>#</th><th>Item</th><th>In-charge / Owner</th><th>Status / Deadline</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>I</td><td>1</td><td>Post detail (create/update/view) — coding</td><td>Member A</td><td>In Progress</td><td>create + view done; update validation left; UC9</td></tr>
<tr><td>I</td><td>2</td><td>Application list (recruiter) — RDS + coding</td><td>Member B</td><td>Done</td><td>search/filter/sort/paging; 4 Defects found and closed</td></tr>
<tr><td>I</td><td>3</td><td>Blog list — RDS design part</td><td>Member C</td><td>Pending</td><td>waiting for the teacher's answer on blog approval (Q&amp;A #31)</td></tr>
<tr><td>II</td><td>1</td><td>Merge conflicts in menu.jsp every day</td><td>Member A (layout owner)</td><td>In Progress</td><td>menu items moved to one list per role; others only add rows</td></tr>
<tr><td>III</td><td>1</td><td>Apply job with CV upload</td><td>Member A</td><td>30/05/2026</td><td>transaction insert + counter; file type jpg/png/pdf</td></tr>
<tr><td>IV</td><td>1</td><td>Can the recruiter dashboard reuse the admin dashboard with role filtering?</td><td>Leader</td><td>24/05/2026</td><td>template rule: "only one dashboard, view by role"</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>A weekly report that says nothing.</strong> "Everyone is coding — In Progress" gives the teacher no information. Name the screen, the UC, the member and the concrete state; quote the Product sheet and the GitLab issue numbers so the report can be checked.</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.7 · Templates-20260512: Template6_Weekly Report.xlsx · Template5_AI Usage Report.xlsx</span>
<h2>Báo cáo tuần và báo cáo sử dụng AI</h2>
<p class="lead">Bộ template 2026 thêm hai bảng tính nhỏ mà giảng viên đọc giữa các buổi demo: <strong>Weekly Report</strong> (cái gì đã chạy, cái gì bị kẹt, tuần sau làm gì) và <strong>AI Usage Report</strong> (bạn dùng AI ở đâu, nó tạo ra gì và <em>bạn</em> đã làm gì với kết quả đó). Cả hai chỉ tốn mười phút mỗi tuần nếu cập nhật đều — và rất khổ nếu cuối kỳ mới dựng lại.</p>
<div class="callout"><strong>Học xong bài này bạn có thể…</strong>
<ul>
<li>điền đủ bốn phần của Template6 cho một tuần của nhóm;</li>
<li>điền sheet Overview và một sheet theo tuần của Template5 — đủ cả 10 cột;</li>
<li>thu bằng chứng dùng AI đúng như sheet Instruction yêu cầu (prompt, câu trả lời, phần xử lý tiếp theo);</li>
<li>tránh những dòng khiến báo cáo trông như bịa.</li>
</ul></div>
<h3>1. Template6 — Weekly Report (mỗi tuần một sheet "Wx")</h3>
<p class="nhan">Phần đầu</p>
<ul>
<li><strong>Group</strong> — tên nhóm, ví dụ SE1804_G5.</li>
<li><strong>Week</strong> — <code>dd/mm/yyyy-dd/mm/yyyy</code>, ví dụ 20/05/2026-26/05/2026.</li>
</ul>
<p class="nhan">Bốn phần</p>
<table>
<thead><tr><th>Phần</th><th>Các cột</th><th>Ghi gì</th></tr></thead>
<tbody>
<tr><td>I. Status Report</td><td># · Project Task · In-charge · Status · Notes (chi tiết công việc)</td><td>các task của tuần và trạng thái (Pending / In Progress / Done)</td></tr>
<tr><td>II. Project Issues</td><td># · Project Issue · Owner · Status · Notes (giải pháp, đề xuất…)</td><td>vướng mắc và rủi ro, kèm người chịu trách nhiệm xử lý</td></tr>
<tr><td>III. Next Week Plan</td><td># · Project Task · In-charge · Deadline · Notes (chi tiết task…)</td><td>các cam kết cho tuần sau</td></tr>
<tr><td>IV. Other Project Matters/Suggestions</td><td># · Project Matter/Suggestions · Raised By · Date · Notes</td><td>mọi điều gửi giảng viên: câu hỏi, đề nghị, đề xuất</td></tr>
</tbody>
</table>
<p class="nhan">Ví dụ đã điền — tuần 3 của ITER2, Job IT for Freelancer</p>
<table>
<thead><tr><th>Phần</th><th>#</th><th>Nội dung</th><th>In-charge / Owner</th><th>Status / Deadline</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>I</td><td>1</td><td>Post detail (create/update/view) — code</td><td>Thành viên A</td><td>In Progress</td><td>xong create + view; còn validate phần update; UC9</td></tr>
<tr><td>I</td><td>2</td><td>Application list (recruiter) — RDS + code</td><td>Thành viên B</td><td>Done</td><td>tìm/lọc/sắp xếp/phân trang; tìm và đóng 4 Defect</td></tr>
<tr><td>I</td><td>3</td><td>Blog list — phần thiết kế RDS</td><td>Thành viên C</td><td>Pending</td><td>chờ giảng viên trả lời về duyệt blog (Q&amp;A #31)</td></tr>
<tr><td>II</td><td>1</td><td>Ngày nào cũng xung đột ở menu.jsp</td><td>Thành viên A (phụ trách layout)</td><td>In Progress</td><td>gom mục menu thành một danh sách theo role; người khác chỉ thêm dòng</td></tr>
<tr><td>III</td><td>1</td><td>Apply job có upload CV</td><td>Thành viên A</td><td>30/05/2026</td><td>transaction insert + bộ đếm; loại file jpg/png/pdf</td></tr>
<tr><td>IV</td><td>1</td><td>Dashboard recruiter có dùng lại dashboard admin với lọc theo role được không?</td><td>Leader</td><td>24/05/2026</td><td>luật file mẫu: "chỉ 1 dashboard duy nhất, phân quyền view theo user"</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Báo cáo tuần không nói gì.</strong> "Mọi người đang code — In Progress" không cho giảng viên thông tin nào. Hãy ghi tên màn hình, mã UC, thành viên và trạng thái cụ thể; trích số từ sheet Product và số issue GitLab để báo cáo kiểm chứng được.</div>`),
    bi(`<h3>2. Template5 — AI Usage Report</h3>
<p class="nhan">Sheet "0.Overview" — who and what</p>
<ul>
<li><strong>Header fields</strong> — Subject Code (SWP391) · Subject Name · Class Code · Semester · Lecturer Name · Group Code · Project Title.</li>
<li><strong>List of Students</strong> — No · StudentCode · StudentName · Role In Group · AI Tool Used (e.g. "Leader · ChatGPT, Claude", "Developer · GitHub Copilot").</li>
</ul>
<p class="nhan">Sheets "1. Week 1", "2. Week n" … — one log row per real AI use</p>
<table>
<thead><tr><th>Column</th><th>How to fill it (Instruction sheet)</th><th>Example — Job IT for Freelancer</th></tr></thead>
<tbody>
<tr><td>No.</td><td>sequential number of the entry (1, 2, 3…)</td><td>4</td></tr>
<tr><td>SDLC Phase</td><td>Requirement, Design, Implementation, Testing, Reporting</td><td>Implementation</td></tr>
<tr><td>Task / Activity</td><td>the specific task you used AI for</td><td>CategoryDAO search with filter, sort, paging</td></tr>
<tr><td>AI Tool Used</td><td>name of the tool</td><td>GitHub Copilot</td></tr>
<tr><td>AI Output</td><td>summary of what AI produced</td><td>1 DAO method (~40 lines) with LIKE + LIMIT/OFFSET</td></tr>
<tr><td>Student's Validation / Modification</td><td>how you checked or changed it</td><td>AI concatenated the sort column → replaced with a whitelist map; added COUNT query with the same WHERE</td></tr>
<tr><td>Evidence / Link</td><td>Drive folder of screenshots/videos named <code>GroupX_SessionY_Activity</code>; each must show prompt, AI response and your follow-up</td><td>Drive link → <code>Group5_Session7_CategoryDAO.png</code></td></tr>
<tr><td>Quantitative Measure</td><td>numbers: user stories, entities, classes/methods, LOC, test cases</td><td>1 method kept of 2 suggested; 12 lines rewritten</td></tr>
<tr><td>Value Added (1-5)</td><td>self-assessed usefulness, 1 = not useful, 5 = very useful</td><td>3</td></tr>
<tr><td>Risks / Limitations Observed</td><td>what went wrong or could have</td><td>injection risk in ORDER BY; no paging count</td></tr>
</tbody>
</table>
<p class="nhan">More honest rows from the same week</p>
<table>
<thead><tr><th>Phase</th><th>Task</th><th>Tool</th><th>AI output</th><th>Your validation</th><th>Measure</th><th>Value</th><th>Risk</th></tr></thead>
<tbody>
<tr><td>Requirement</td><td>Business rules for Apply job</td><td>ChatGPT</td><td>9 rules</td><td>kept 5, merged 2, dropped 2 that contradict the teacher's answer</td><td>5 rules in RDS</td><td>4</td><td>invented a "premium freelancer" rule</td></tr>
<tr><td>Design</td><td>TDS draft (prompt #8)</td><td>Claude</td><td>10-section Markdown</td><td>rewrote FE part for JSP; removed REST/JWT sections</td><td>14 shared files mapped to ITER1–3</td><td>4</td><td>assumed React + REST stack</td></tr>
<tr><td>Testing</td><td>Test cases for Category detail</td><td>ChatGPT</td><td>18 cases</td><td>kept 12, added 3 length/format cases from Policies</td><td>15 cases</td><td>5</td><td>missed duplicate-name case</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Reports that look invented.</strong> Every row at Value 5 with "no risk"; outputs with no numbers; evidence links that open an empty folder; the same row copied ten times (the template's own sample data repeats one ERD row — delete it). The report is credible when the Validation column shows what you <em>changed</em> and the Risks column shows what AI got wrong.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Why log AI use at all?</strong> Industry teams do the same for three reasons: accountability (a human signs off every AI change), security and licensing review (was code copied from somewhere, were secrets pasted into a chat?), and learning which tasks AI actually speeds up. Your "Value Added" and "Risks" columns, read across 10 weeks, are exactly that evidence. <em>Outside the syllabus because the template asks you to log, not to analyse the log.</em></div>`,
    `<h3>2. Template5 — AI Usage Report</h3>
<p class="nhan">Sheet "0.Overview" — ai và cái gì</p>
<ul>
<li><strong>Thông tin đầu</strong> — Subject Code (SWP391) · Subject Name · Class Code · Semester · Lecturer Name · Group Code · Project Title.</li>
<li><strong>List of Students</strong> — No · StudentCode · StudentName · Role In Group · AI Tool Used (ví dụ "Leader · ChatGPT, Claude", "Developer · GitHub Copilot").</li>
</ul>
<p class="nhan">Sheet "1. Week 1", "2. Week n" … — mỗi lần dùng AI thật một dòng</p>
<table>
<thead><tr><th>Cột</th><th>Cách điền (sheet Instruction)</th><th>Ví dụ — Job IT for Freelancer</th></tr></thead>
<tbody>
<tr><td>No.</td><td>số thứ tự của dòng ghi (1, 2, 3…)</td><td>4</td></tr>
<tr><td>SDLC Phase</td><td>Requirement, Design, Implementation, Testing, Reporting</td><td>Implementation</td></tr>
<tr><td>Task / Activity</td><td>việc cụ thể đã dùng AI</td><td>CategoryDAO tìm kiếm có lọc, sắp xếp, phân trang</td></tr>
<tr><td>AI Tool Used</td><td>tên công cụ</td><td>GitHub Copilot</td></tr>
<tr><td>AI Output</td><td>tóm tắt thứ AI tạo ra</td><td>1 method DAO (~40 dòng) với LIKE + LIMIT/OFFSET</td></tr>
<tr><td>Student's Validation / Modification</td><td>bạn đã kiểm tra hoặc sửa thế nào</td><td>AI nối chuỗi cột sắp xếp → thay bằng map whitelist; thêm câu COUNT dùng cùng WHERE</td></tr>
<tr><td>Evidence / Link</td><td>thư mục Drive chứa ảnh chụp/video đặt tên <code>GroupX_SessionY_Activity</code>; mỗi ảnh phải thấy rõ prompt, câu trả lời của AI và phần xử lý tiếp theo của bạn</td><td>link Drive → <code>Group5_Session7_CategoryDAO.png</code></td></tr>
<tr><td>Quantitative Measure</td><td>con số: user story, thực thể, class/method, LOC, test case</td><td>giữ 1 trong 2 method gợi ý; viết lại 12 dòng</td></tr>
<tr><td>Value Added (1-5)</td><td>tự đánh giá mức hữu ích, 1 = không hữu ích, 5 = rất hữu ích</td><td>3</td></tr>
<tr><td>Risks / Limitations Observed</td><td>điều đã sai hoặc có thể sai</td><td>nguy cơ injection ở ORDER BY; thiếu câu đếm cho phân trang</td></tr>
</tbody>
</table>
<p class="nhan">Thêm vài dòng trung thực trong cùng tuần</p>
<table>
<thead><tr><th>Phase</th><th>Task</th><th>Tool</th><th>AI output</th><th>Bạn kiểm tra/sửa</th><th>Số đo</th><th>Value</th><th>Rủi ro</th></tr></thead>
<tbody>
<tr><td>Requirement</td><td>Business rule cho Apply job</td><td>ChatGPT</td><td>9 rule</td><td>giữ 5, gộp 2, bỏ 2 cái trái với câu trả lời của giảng viên</td><td>5 rule trong RDS</td><td>4</td><td>tự bịa rule "freelancer premium"</td></tr>
<tr><td>Design</td><td>Bản nháp TDS (prompt #8)</td><td>Claude</td><td>Markdown 10 mục</td><td>viết lại phần FE cho JSP; bỏ các mục REST/JWT</td><td>14 file dùng chung gán vào ITER1–3</td><td>4</td><td>giả định stack React + REST</td></tr>
<tr><td>Testing</td><td>Test case cho Category detail</td><td>ChatGPT</td><td>18 case</td><td>giữ 12, thêm 3 case length/format theo Policies</td><td>15 case</td><td>5</td><td>bỏ sót case trùng tên</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Báo cáo trông như bịa.</strong> Dòng nào cũng Value 5 và "không rủi ro"; output không có con số; link bằng chứng mở ra thư mục rỗng; một dòng chép mười lần (chính dữ liệu mẫu của template lặp lại một dòng ERD — hãy xoá đi). Báo cáo đáng tin khi cột Validation cho thấy bạn đã <em>sửa</em> gì và cột Risks cho thấy AI đã sai ở đâu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Vì sao phải ghi lại việc dùng AI?</strong> Nhóm ngoài doanh nghiệp cũng làm vậy vì ba lý do: trách nhiệm (một con người ký duyệt mọi thay đổi do AI tạo), rà soát bảo mật và bản quyền (code có bị chép từ đâu không, có ai dán bí mật vào khung chat không?), và biết việc nào AI thật sự giúp nhanh hơn. Cột "Value Added" và "Risks" của bạn, đọc suốt 10 tuần, chính là bằng chứng đó. <em>Ngoài giáo trình vì template chỉ yêu cầu ghi, không yêu cầu phân tích nhật ký.</em></div>`),
    books([
      ['sommerville', 'Ch. 22.1 "Risk management" and 22.3 "Teamwork" (communication in small teams)', 'Mục 22.1 "Risk management" và 22.3 "Teamwork" (giao tiếp trong nhóm nhỏ)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── Iteration 2 checklist (existing slug) ─────────────────────── */
const L48 = {
  title: 'Iteration 2 — Checklist before you submit (20%)|||Iteration 2 — Checklist trước khi nộp (20%)',
  slug: 'swp391-milestone-2-checklist',
  type: 'VIDEO',
  description: 'Danh sách kiểm cho Iteration 2 (20%): màn hình, chất lượng, tích hợp, Project Tracking, RDS, video demo, tag GitLab, script DB, báo cáo tuần và báo cáo AI.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Iteration 2 checklist · 20% · MaxLOC 240</span>
<h2>Iteration 2 — checklist before you submit</h2>
<p class="lead">Iteration 2 is the heaviest "normal" iteration: 20% of the course, MaxLOC 240 in both guides, and the one where teams discover whether their daily integration really works. Go through this list on the day before the demo — each line is something teachers actually check.</p>
<div class="callout"><strong>Numbers to keep in mind</strong>
<ul>
<li><strong>LOC grade</strong> = your ITER2 Converted LOC × 10 / 240 — 240 LOC or more gives 10 (e.g. two Level-4 screens at L2 + one Level-2 at L2 = 112.5 + 112.5 + 67.5 = 292.5 → capped at 10).</li>
<li><strong>Iteration grade</strong> = LOC × 0.7 + package × 0.3.</li>
<li><strong>Leakages from ITER1</strong> must be fixed too — the teacher reopens them.</li>
</ul></div>
<h3>A. My screens (each member)</h3>
<ol>
<li>☐ 3–4 screens in the Product sheet with <strong>my name as the only PIC</strong> and Plan = ITER2.</li>
<li>☐ Each screen follows the template's unit: detail = view + add + update in one JSP; list = search + filter + sort + paging + delete in one screen.</li>
<li>☐ Wireframe confirmed by the teacher before coding (Policies).</li>
<li>☐ Happy cases work end-to-end from the menu — no screen reached only by typing a URL.</li>
<li>☐ Unhappy cases handled: blank/spaces, too long, wrong format, duplicate, empty list, bad id/page, wrong role → aiming at <strong>L2_All Cases</strong>.</li>
<li>☐ Every query uses <code>PreparedStatement</code>; sort columns whitelisted; output escaped with <code>&lt;c:out&gt;</code>.</li>
<li>☐ I can explain and change any line of my code in front of the teacher within 30 minutes.</li>
<li>☐ My demo video: login → menu → each of my screens, happy then unhappy cases.</li>
</ol>
<h3>B. The team's source</h3>
<ol>
<li>☐ Everyone committed <strong>every day</strong> under his own FPT account (check GitLab contributors).</li>
<li>☐ main builds and runs from a clean clone with the committed DB scripts.</li>
<li>☐ One shared header/footer/menu; one theme; screens look like one product.</li>
<li>☐ Functions shared by several roles are one screen with role-based permissions.</li>
<li>☐ Tag <code>iter2</code> created on the demoed commit; DB schema + data scripts inside it.</li>
</ol>
<h3>C. The documents and links</h3>
<ol>
<li>☐ Project Tracking — Use Cases up to date; Product rows of ITER2 with status, Quality, Bug count, Actual; ITER3 rows planned with PIC and level.</li>
<li>☐ RDS — requirement and design parts of every ITER2 screen; ITER1 sections updated after the teacher's feedback.</li>
<li>☐ GitLab — every ITER2 <code>Req</code> closed or moved; Defects logged; Q&amp;A answered.</li>
<li>☐ Weekly Reports of the iteration, and the AI Usage Report weeks filled with evidence links (if your teacher requires them).</li>
<li>☐ Links file — each member's video, the tag URL, the documents' URLs; every link opens without asking for permission.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>The demo-day rule.</strong> Rehearse the exact click-path you will show, from a fresh login on the team's single build. Most iteration marks are lost not to missing screens but to a screen that "worked yesterday" on someone's laptop and breaks on the shared copy.</div>`,
    `<span class="eyebrow">Chương 4 · Checklist Iteration 2 · 20% · MaxLOC 240</span>
<h2>Iteration 2 — checklist trước khi nộp</h2>
<p class="lead">Iteration 2 là iteration "thường" nặng nhất: 20% điểm môn, MaxLOC 240 theo cả hai guide, và là lúc nhóm biết việc tích hợp hằng ngày có thật sự chạy hay không. Duyệt danh sách này vào hôm trước buổi demo — dòng nào cũng là thứ giảng viên thật sự kiểm tra.</p>
<div class="callout"><strong>Con số cần nhớ</strong>
<ul>
<li><strong>Điểm LOC</strong> = Converted LOC ITER2 của bạn × 10 / 240 — từ 240 LOC trở lên là 10 (ví dụ hai màn hình Level 4 ở L2 + một Level 2 ở L2 = 112,5 + 112,5 + 67,5 = 292,5 → tính tối đa 10).</li>
<li><strong>Điểm iteration</strong> = LOC × 0,7 + gói nộp × 0,3.</li>
<li><strong>Leakage của ITER1</strong> cũng phải sửa — giảng viên sẽ mở lại chúng.</li>
</ul></div>
<h3>A. Màn hình của tôi (mỗi thành viên)</h3>
<ol>
<li>☐ 3–4 màn hình trong sheet Product, <strong>PIC duy nhất là tôi</strong> và Plan = ITER2.</li>
<li>☐ Mỗi màn hình theo đúng đơn vị của file mẫu: detail = xem + thêm + sửa trong một JSP; list = tìm + lọc + sắp xếp + phân trang + xoá trong một màn hình.</li>
<li>☐ Wireframe được giảng viên xác nhận trước khi code (Policies).</li>
<li>☐ Happy case chạy trọn từ menu — không màn hình nào chỉ vào được bằng cách gõ URL.</li>
<li>☐ Unhappy case đã xử lý: trống/dấu cách, quá dài, sai định dạng, trùng, danh sách rỗng, id/trang sai, sai role → nhắm tới <strong>L2_All Cases</strong>.</li>
<li>☐ Mọi truy vấn dùng <code>PreparedStatement</code>; cột sắp xếp được whitelist; đầu ra escape bằng <code>&lt;c:out&gt;</code>.</li>
<li>☐ Tôi giải thích và sửa được bất kỳ dòng code nào của mình trước mặt giảng viên trong 30 phút.</li>
<li>☐ Video demo của tôi: đăng nhập → menu → từng màn hình, happy rồi unhappy case.</li>
</ol>
<h3>B. Source của nhóm</h3>
<ol>
<li>☐ Mọi người commit <strong>mỗi ngày</strong> bằng tài khoản FPT của chính mình (xem contributors trên GitLab).</li>
<li>☐ main build và chạy được từ một bản clone sạch với script DB đã commit.</li>
<li>☐ Một header/footer/menu dùng chung; một theme; các màn hình trông như một sản phẩm.</li>
<li>☐ Chức năng dùng cho nhiều role là một màn hình, phân quyền thao tác theo role.</li>
<li>☐ Tag <code>iter2</code> tạo trên đúng commit đã demo; script schema + data DB nằm trong đó.</li>
</ol>
<h3>C. Tài liệu và link</h3>
<ol>
<li>☐ Project Tracking — Use Cases cập nhật; các dòng Product của ITER2 có status, Quality, số Bug, Actual; các dòng ITER3 đã lên kế hoạch kèm PIC và level.</li>
<li>☐ RDS — phần yêu cầu và thiết kế của mọi màn hình ITER2; các mục ITER1 đã cập nhật theo góp ý của giảng viên.</li>
<li>☐ GitLab — mọi <code>Req</code> của ITER2 đã đóng hoặc được chuyển; Defect đã ghi; Q&amp;A đã được trả lời.</li>
<li>☐ Weekly Report của iteration, và các tuần của AI Usage Report có link bằng chứng (nếu giảng viên yêu cầu).</li>
<li>☐ File link — video của từng người, URL của tag, URL tài liệu; mọi link mở được mà không phải xin quyền.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Quy tắc ngày demo.</strong> Tập đúng đường-bấm bạn sẽ trình diễn, từ một lần đăng nhập mới trên bản build chung duy nhất của nhóm. Phần lớn điểm iteration mất không phải vì thiếu màn hình mà vì một màn hình "hôm qua còn chạy" trên laptop của ai đó lại hỏng trên bản chung.</div>`),
  ].join('\n'),
};

/* ─────────────────────── Quiz 4 ─────────────────────── */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, explanation });
const QUIZ4 = {
  title: 'Quiz 4 — Iterations, Project Tracking & LOC grading|||Quiz 4 — Iteration, Project Tracking & chấm LOC',
  slug: 'swp391-quiz-4',
  type: 'QUIZ',
  description: 'Kiểm tra: vòng đời iteration, file Project Tracking, quy đổi Complexity × Quality ra điểm LOC, code MVC an toàn, báo cáo tuần và báo cáo AI.',
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      q('How is the SWP391 semester organised for coding?|||Học kỳ SWP391 được tổ chức việc code thế nào?',
        ['Requirements first, then one coding phase, then deployment|||Làm yêu cầu trước, rồi một pha code, rồi triển khai', 'Three iterations; in each one every member does requirement, design and full-stack code for his own screens|||Ba iteration; trong mỗi iteration từng thành viên làm yêu cầu, thiết kế và code full-stack cho màn hình của mình', 'Each member works on one layer (UI, DB, backend) for the whole semester|||Mỗi thành viên phụ trách một tầng (UI, DB, backend) suốt học kỳ', 'The leader codes, the others write documents|||Leader code, các thành viên khác viết tài liệu'], 1,
        'Subject and Student Guides: 3 iterations of 6 slots of 135 minutes; each member does requirement, design and full-stack coding for 3-4 screens in every iteration.|||Subject và Student Guides: 3 iteration, mỗi iteration 6 slot 135 phút; mỗi thành viên làm yêu cầu, thiết kế và code full-stack cho 3-4 màn hình trong mọi iteration.'),
      q('What are the weights of the three iterations and the Final Presentation?|||Trọng số của ba iteration và Final Presentation là bao nhiêu?',
        ['15% / 20% / 25% / 40%', '20% / 20% / 20% / 40%', '10% / 20% / 30% / 40%', '15% / 20% / 25% / 30% + 10% attendance|||15% / 20% / 25% / 30% + 10% điểm danh'], 0,
        'Iteration 1 15%, Iteration 2 20%, Iteration 3 25% (final package), Final Presentation 40% graded by two other teachers.|||Iteration 1 15%, Iteration 2 20%, Iteration 3 25% (gói cuối), Final Presentation 40% do hai giảng viên khác chấm.'),
      q('When must the screen list for Iteration 1 be submitted?|||Danh sách màn hình của Iteration 1 phải nộp khi nào?',
        ['At the end of Iteration 1|||Cuối Iteration 1', 'Before Iteration 1 starts|||Trước khi Iteration 1 bắt đầu', 'With the Final Presentation|||Cùng Final Presentation', 'It is never submitted|||Không cần nộp'], 1,
        'Student Guides slide 6: the initial product scope and the screens planned for iter1 are submitted before the start of iter1.|||Student Guides slide 6: phạm vi sản phẩm ban đầu và các màn hình dự kiến của iter1 phải nộp trước khi iter1 bắt đầu.'),
      q('Which item is NOT part of the end-of-iteration package?|||Mục nào KHÔNG thuộc gói nộp cuối iteration?',
        ['Project Tracking file (Use Cases + Product)|||File Project Tracking (Use Cases + Product)', 'RDS document|||Tài liệu RDS', 'Each member\'s demo video and the GitLab tag of the source|||Video demo của từng thành viên và tag GitLab của source', 'A ZIP of each member\'s private branch to be graded separately|||File ZIP nhánh riêng của từng người để chấm riêng'], 3,
        'The teacher grades only the common, integrated source (Policies: he does not review separate sources). The package is tracking file, RDS and links to videos, the tag and DB scripts.|||Giảng viên chỉ chấm source chung đã tích hợp (Policies: thầy không review source riêng lẻ). Gói nộp gồm file tracking, RDS và link video, tag, script DB.'),
      q('How is an iteration graded according to the Student Guides?|||Theo Student Guides, một iteration được chấm thế nào?',
        ['Documents 70%, code 30%|||Tài liệu 70%, code 30%', 'LOC 70% (individual) + submitted package 30%|||LOC 70% (cá nhân) + gói nộp 30%', 'Team presentation 100%|||Thuyết trình nhóm 100%', 'Attendance 50%, LOC 50%|||Điểm danh 50%, LOC 50%'], 1,
        'LOC is evaluated individually from the screens each member completed; the package covers source code, DB script and RDS.|||LOC chấm theo cá nhân từ các màn hình mỗi người hoàn thành; gói nộp gồm source code, script DB và RDS.'),
      q('Converted LOC of one screen equals…|||Converted LOC của một màn hình bằng…',
        ['the number of lines in its Java files|||số dòng trong các file Java của nó', 'Complexity × Quality|||Complexity × Quality', 'fields + transactions|||số field + số transaction', 'hours spent × 10|||số giờ làm × 10'], 1,
        'C is the complexity value (60 to 240) graded by the teacher, Q the quality rate (50%, 75%, 100%).|||C là giá trị độ phức tạp (60 tới 240) do giảng viên chấm, Q là hệ số chất lượng (50%, 75%, 100%).'),
      q('In the template\'s Refs sheet, a screen with 8-9 actionable fields OR 4 transactions is…|||Trong sheet Refs của file mẫu, màn hình có 8-9 field thao tác HOẶC 4 transaction là…',
        ['Level 1 = 60', 'Level 2 = 90', 'Level 3 = 120', 'Level 5 = 180'], 2,
        'Levels go from 60 to 240 in steps of 30: L1 3-5 fields or 2 trans, L2 6-7 or 3, L3 8-9 or 4, L4 10-11 or 5, L5 12-13 or 6.|||Các level đi từ 60 tới 240, mỗi bậc 30: L1 3-5 field hoặc 2 trans, L2 6-7 hoặc 3, L3 8-9 hoặc 4, L4 10-11 hoặc 5, L5 12-13 hoặc 6.'),
      q('How does the Refs sheet treat a transaction that is not related to any field?|||Sheet Refs xử lý thế nào với một transaction không gắn với field nào?',
        ['It is ignored|||Bỏ qua', 'It counts as two fields added to the field total|||Tính thành hai field cộng vào tổng số field', 'It doubles the level|||Nhân đôi level', 'It counts as one screen|||Tính thành một màn hình'], 1,
        'One transaction = two actionable fields; unrelated transactions add two fields each before the level is read.|||Một transaction = hai field thao tác; transaction không gắn field nào được cộng hai field mỗi cái trước khi xác định level.'),
      q('A screen works for all happy AND unhappy cases but is not optimised. Its quality level and rate?|||Màn hình chạy được cả happy VÀ unhappy case nhưng chưa tối ưu. Mức chất lượng và hệ số là?',
        ['L1_Happy Cases, 50%', 'L2_All Cases, 75%', 'L3_Optimized, 100%', 'High, 100%'], 1,
        'L1 = happy cases only (0.5), L2 = happy and unhappy cases (0.75), L3 = all cases plus optimised UX and business logic (1.0).|||L1 = chỉ happy case (0,5), L2 = cả happy và unhappy case (0,75), L3 = mọi case cộng UX và logic nghiệp vụ tối ưu (1,0).'),
      q('A Level 4 screen (150) is graded L1_Happy Cases. Its Converted LOC is…|||Một màn hình Level 4 (150) được chấm L1_Happy Cases. Converted LOC là…',
        ['150', '112.5', '75', '60'], 2,
        '150 x 0.5 = 75. At L2 it would be 150 x 0.75 = 112.5.|||150 x 0,5 = 75. Nếu ở L2 sẽ là 150 x 0,75 = 112,5.'),
      q('A member earns 172.5 Converted LOC in Iteration 1. With the Student Guides MaxLOC for iter1 (240), the LOC grade is…|||Một thành viên đạt 172,5 Converted LOC ở Iteration 1. Với MaxLOC iter1 theo Student Guides (240), điểm LOC là…',
        ['7.19', '9.58', '5.00', '10'], 0,
        '172.5 x 10 / 240 = 7.19. With the Subject Guides value 180 it would be 9.58. Follow the MaxLOC your teacher publishes.|||172,5 x 10 / 240 = 7,19. Theo Subject Guides (180) sẽ là 9,58. Hãy theo MaxLOC giảng viên công bố.'),
      q('How is the LOC grade of Iteration 3 computed?|||Điểm LOC của Iteration 3 được tính thế nào?',
        ['Only the screens of iteration 3|||Chỉ các màn hình của iteration 3', 'All screens the member completed in the whole project, divided by a larger MaxLOC (660 or 720)|||Mọi màn hình thành viên đã hoàn thành trong cả dự án, chia cho MaxLOC lớn hơn (660 hoặc 720)', 'The average of iteration 1 and 2|||Trung bình iteration 1 và 2', 'It is not graded|||Không chấm'], 1,
        'With iteration 3 all completed screens/functions are evaluated; MaxLOC is 660 (Subject Guides) or 720 (Student Guides).|||Ở iteration 3 mọi màn hình/chức năng đã hoàn thành đều được đánh giá; MaxLOC là 660 (Subject Guides) hoặc 720 (Student Guides).'),
      q('Iteration grades are 8, 7 and 9. What is the OG?|||Điểm ba iteration là 8, 7 và 9. OG bằng bao nhiêu?',
        ['8.00', '8.08', '7.92', '8.25'], 1,
        'OG = (8 x 15 + 7 x 20 + 9 x 25) / 60 = (120 + 140 + 225) / 60 = 8.08.|||OG = (8 x 15 + 7 x 20 + 9 x 25) / 60 = (120 + 140 + 225) / 60 = 8,08.'),
      q('According to the template, "View detail", "Create" and "Update" of Category are…|||Theo file mẫu, "View detail", "Create" và "Update" của Category là…',
        ['three screens, each graded separately|||ba màn hình, chấm riêng từng cái', 'one screen that must share the code|||một màn hình và phải dùng chung code', 'part of the list screen|||một phần của màn hình danh sách', 'not counted at all|||hoàn toàn không được tính'], 1,
        'Product sheet, column D: "View detail, create, update tính chung 1 màn hình (Cũng cần code dùng chung)".|||Sheet Product, cột D: "View detail, create, update tính chung 1 màn hình (Cũng cần code dùng chung)".'),
      q('Which functions does the template include inside ONE list screen?|||File mẫu tính những chức năng nào trong MỘT màn hình danh sách?',
        ['Only viewing the list|||Chỉ xem danh sách', 'Delete, reject, filter, search, sort and paging|||Xoá, từ chối, lọc, tìm kiếm, sắp xếp và phân trang', 'Create and update|||Thêm và sửa', 'Login and logout|||Đăng nhập và đăng xuất'], 1,
        '"Bao gồm cả delete, reject, filter, search, sort, pagging tính chung 1 màn hình" - and the Policies sheet makes search, filter, sort, paging mandatory for every data table.|||"Bao gồm cả delete, reject, filter, search, sort, pagging tính chung 1 màn hình" - và sheet Policies bắt buộc mọi bảng dữ liệu phải có tìm, lọc, sắp xếp, phân trang.'),
      q('In the Product sheet, a screen is Done by the member but the teacher asks for fixes. Its status becomes…|||Trong sheet Product, màn hình đã Done nhưng giảng viên yêu cầu sửa. Trạng thái chuyển thành…',
        ['New', 'Doing', 'ToDo', 'Completed'], 2,
        'MasterData: New when created, Doing when started, Done when finished, ToDo when the teacher reviews and requires changes, Completed when everything is finished.|||MasterData: New khi tạo, Doing khi bắt đầu, Done khi làm xong, ToDo khi thầy review và cần sửa, Completed khi hoàn thiện toàn bộ.'),
      q('A bug the teacher finds after the team submitted is labelled…|||Lỗi giảng viên phát hiện sau khi nhóm đã nộp được gắn nhãn…',
        ['Defect', 'Leakage', 'Q&A', 'Task'], 1,
        'Defect = found by the team itself; Leakage = found by the customer/teacher after submission (Student Guides slide 13).|||Defect = do chính nhóm phát hiện; Leakage = do khách hàng/giảng viên phát hiện sau khi nộp (Student Guides slide 13).'),
      q('According to the Policies sheet, what happens to a member who commits only at the end of the iteration?|||Theo sheet Policies, thành viên chỉ commit vào cuối iteration sẽ bị gì?',
        ['Nothing, if the code works|||Không sao nếu code chạy', 'A small bonus for a clean history|||Được cộng điểm vì lịch sử gọn', 'Not allowed to defend|||Không được bảo vệ', 'The leader loses points instead|||Leader bị trừ điểm thay'], 2,
        'Daily commit and merge is mandatory; no daily commit loses points, and weekly or end-of-iteration commits mean no defence. Non-contributors on git get no LOC.|||Bắt buộc commit và merge hằng ngày; không commit hằng ngày bị trừ điểm, commit hằng tuần hoặc cuối iteration thì không được bảo vệ. Ai không có contributor trên git không được tính LOC.'),
      q('Which validation cases does the Policies sheet require?|||Sheet Policies yêu cầu validate những trường hợp nào?',
        ['Only required fields|||Chỉ các trường bắt buộc', 'Required (blank, spaces), length beyond the DB column, format (date, email, mobile, image type)|||Required (trống, dấu cách), độ dài vượt cột DB, định dạng (ngày, email, số điện thoại, loại ảnh)', 'Only client-side HTML5 checks|||Chỉ kiểm tra HTML5 phía client', 'None, validation is optional|||Không, validate là tuỳ chọn'], 1,
        'Rule 1 of the Program section lists Required, Length and Format, with examples of what to test.|||Luật 1 của phần Chương trình liệt kê Required, Length và Format, kèm ví dụ cần test.'),
      q('Why can the sort column in ORDER BY not be passed as a ? placeholder, and what is the safe fix?|||Vì sao cột sắp xếp trong ORDER BY không truyền bằng placeholder ? được, và cách an toàn là gì?',
        ['It can, just use setString|||Được, chỉ cần setString', 'Placeholders bind values, not identifiers; map the user input to a fixed whitelist of column names|||Placeholder chỉ gán giá trị, không gán tên định danh; ánh xạ input người dùng vào whitelist tên cột cố định', 'Escape quotes in the input|||Escape dấu nháy trong input', 'Sort in JavaScript instead|||Sắp xếp bằng JavaScript thay vào đó'], 1,
        'Column names and ASC/DESC are identifiers. Concatenating raw input there is an injection hole; choosing from a fixed map is safe.|||Tên cột và ASC/DESC là định danh. Nối thẳng input vào đó là lỗ hổng injection; chọn từ một map cố định là an toàn.'),
      q('After a successful "Save" in the detail servlet, why redirect to the list instead of forwarding?|||Sau khi "Save" thành công trong servlet detail, vì sao redirect về danh sách thay vì forward?',
        ['Redirect is faster|||Redirect nhanh hơn', 'Post/Redirect/Get: refreshing the page will not submit the insert again|||Post/Redirect/Get: F5 sẽ không gửi lại lệnh insert', 'Forward is not allowed in servlets|||Servlet không được forward', 'To log the user out|||Để đăng xuất người dùng'], 1,
        'With PRG the browser ends on a GET of the list, so F5 repeats the harmless GET, not the POST that inserted the row.|||Với PRG trình duyệt kết thúc ở một GET trang danh sách, nên F5 lặp lại GET vô hại, không lặp lại POST đã insert.'),
      q('Prompt #8 in Claude_Prompts.txt produces a Technical Design Spec. What must a Servlet/JSP team do with it?|||Prompt #8 trong Claude_Prompts.txt tạo Technical Design Spec. Nhóm Servlet/JSP phải làm gì với nó?',
        ['Paste it unchanged into the RDS|||Dán nguyên văn vào RDS', 'Adapt it: it assumes a React + REST stack, so feed the real stack and schema and check every file against the repo|||Chỉnh lại: prompt giả định stack React + REST, nên cung cấp stack và schema thật và đối chiếu từng file với repo', 'Ignore it, TDS is forbidden|||Bỏ qua, TDS bị cấm', 'Send it to the teacher instead of the RDS|||Nộp nó thay cho RDS'], 1,
        'The TDS is useful for listing shared files per milestone and cross-cutting rules, but its FE/BE sections (axiosClient.ts, tokens) must be rewritten for JSP; log the AI use in Template5.|||TDS hữu ích để liệt kê file dùng chung theo milestone và các luật xuyên suốt, nhưng phần FE/BE (axiosClient.ts, token) phải viết lại cho JSP; ghi lại việc dùng AI trong Template5.'),
      q('Which statement about the 7 UI themes in the teacher\'s zip is correct?|||Phát biểu nào về 7 UI theme trong file zip của giảng viên là đúng?',
        ['Each member should pick a different theme|||Mỗi thành viên nên chọn một theme khác nhau', 'The team adopts one theme, cuts it into shared header/menu/footer JSPs, and avoids mixing Bootstrap major versions|||Cả nhóm dùng một theme, cắt nó thành header/menu/footer JSP dùng chung, và tránh trộn các major version Bootstrap', 'Theme demo pages count as LOC|||Trang demo của theme được tính LOC', 'Themes may only be used for the Final Presentation|||Theme chỉ được dùng cho Final Presentation'], 1,
        'Policies require common format, CSS, header/footer/menu. AdminDirector, AdminLTE and ZeShopper use Bootstrap 3; AdminKit, DashMin, Doctris use 5; EduChamp uses 4.|||Policies yêu cầu chung định dạng, CSS, header/footer/menu. AdminDirector, AdminLTE, ZeShopper dùng Bootstrap 3; AdminKit, DashMin, Doctris dùng 5; EduChamp dùng 4.'),
      q('In the AI Usage Report (Template5), what must each evidence screenshot or video show?|||Trong AI Usage Report (Template5), mỗi ảnh chụp hoặc video bằng chứng phải cho thấy gì?',
        ['Only the final code|||Chỉ code cuối cùng', 'The prompt, the AI response and the student follow-up, named GroupX_SessionY_Activity|||Prompt, câu trả lời của AI và phần xử lý tiếp theo của sinh viên, đặt tên GroupX_SessionY_Activity', 'The AI tool\'s logo|||Logo của công cụ AI', 'The teacher\'s approval|||Chữ ký duyệt của giảng viên'], 1,
        'Instruction sheet, column Evidence / Link: a shared Drive folder, naming convention GroupX_SessionY_Activity, each item clearly showing prompt, AI response and student follow-up.|||Sheet Instruction, cột Evidence / Link: thư mục Drive chia sẻ, đặt tên GroupX_SessionY_Activity, mỗi mục thấy rõ prompt, câu trả lời AI và phần xử lý tiếp theo của sinh viên.'),
      q('Which four parts make up the Weekly Report (Template6)?|||Weekly Report (Template6) gồm bốn phần nào?',
        ['Status Report, Project Issues, Next Week Plan, Other Project Matters/Suggestions|||Status Report, Project Issues, Next Week Plan, Other Project Matters/Suggestions', 'Requirement, Design, Coding, Testing|||Requirement, Design, Coding, Testing', 'Use Cases, Product, MasterData, Refs|||Use Cases, Product, MasterData, Refs', 'Overview, Week 1, Week n, Instruction|||Overview, Week 1, Week n, Instruction'], 0,
        'Template6 sheet Wx: I Status Report, II Project Issues, III Next Week Plan, IV Other Project Matters/Suggestions. The last option is Template5, the third is the Project Tracking file.|||Template6 sheet Wx: I Status Report, II Project Issues, III Next Week Plan, IV Other Project Matters/Suggestions. Phương án cuối là Template5, phương án thứ ba là file Project Tracking.'),
    ],
  },
};

export default {
  title: 'Chapter 4 — Iterations: plan, build & track your screens|||Chương 4 — Iteration: lập kế hoạch, xây & theo dõi màn hình của bạn',
  description: 'Mỗi iteration mỗi thành viên tự làm trọn 3–4 màn hình: lập kế hoạch trong file Project Tracking, định cỡ bằng Complexity × Quality, code Servlet/JSP MVC an toàn, tích hợp hằng ngày và báo cáo tuần/AI.',
  lessons: [L41, L42, L43, L44, L45, L46, L47, L48, QUIZ4],
};
