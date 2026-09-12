/**
 * SWP391 · Chapter 1 — Kickoff: topic, team, tools, GitLab & tracking.
 * Sources: Slide5 GitLab Guides (deck g-git, pages 1–32, with the teacher's
 * speaker notes) + GitLab Student Guides PDF (deck g-gitlab-pdf, pages 1–5),
 * Slide1 Subject Guides / SWP391 Student Guides (team, tools, labels, submit
 * items), Claude_Prompts.txt (AI playbook), Template5 AI Usage Report.
 * Lesson split:
 *   1.1 topic, team, roles, tools                   (no deck pages)
 *   1.2 AI playbook + why version control           g-git 1–2
 *   1.3 GitLab project setup + team checklist       g-git 3–7, g-gitlab-pdf 1–2
 *   1.4 Git client, staging, commit, push           g-git 8–25, g-gitlab-pdf 3–5
 *   1.5 conflicts, branches, diff, tags             g-git 26–32
 * The conflict / tag outputs in 1.5 were produced by really running git 2.51
 * in a scratch repo (members named "Member A/B" — no real people).
 * PRIVACY: slides show real names/usernames in screenshots; none are written here.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const G = 'g-git';
const P = 'g-gitlab-pdf';
const L = { l11: [], l12: [], l13: [], l14: [], l15: [] };

/* ═══════════════════════ 1.1 Topic, team, roles & tools ═══════════════════════ */
L.l11.push(bi(`<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Topic, team, roles &amp; tools — how SWP391 really runs</h2>
<p class="lead">SWP391 is not "one person does requirements, one codes, one tests". A team of <strong>4–5 students</strong> builds <strong>one web system</strong> (recommended: a management system) in <strong>three iterations</strong>, and in <em>every</em> iteration <em>every</em> member analyses, designs and codes full-stack his or her own 3–4 screens. This lesson sets up everything that must exist before iteration 1 starts.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Judge whether a topic is big enough (and not too big) for your team</li>
<li>Explain who does what: teacher (coach + customer/PO), team leader, members</li>
<li>Install and log into the required tools with your FPT account</li>
<li>List what the team must hand in <em>before</em> iteration 1 and at the end of each iteration</li>
</ul></div>
<h3>The course in one screen</h3>
<table>
<thead><tr><th>Milestone</th><th>Length</th><th>Weight</th><th>Graded by</th></tr></thead>
<tbody>
<tr><td>Iteration 1</td><td>6 slots × 135' (9 × 90')</td><td>15%</td><td>your class teacher</td></tr>
<tr><td>Iteration 2</td><td>6 slots × 135'</td><td>20%</td><td>your class teacher</td></tr>
<tr><td>Iteration 3 (final package)</td><td>6 slots × 135'</td><td>25%</td><td>your class teacher</td></tr>
<tr><td>Final Presentation</td><td>2 slots × 135'</td><td>40%</td><td>2 other teachers</td></tr>
</tbody>
</table>
<p class="nhan">To pass</p>
<ul>
<li><strong>Attendance</strong> ≥ 80% of slots</li>
<li><strong>OG</strong> = (iter1·15% + iter2·20% + iter3·25%) / 60% ≥ 5</li>
<li><strong>Final Presentation</strong> ≥ 5, and no cheating</li>
</ul>
<p class="ghi-chu">Grading details (Converted-LOC = Complexity × Quality, MaxLOC) are in Chapter 0. The two teacher decks give different MaxLOC values — always follow your teacher's current guide on EduNext/CMS.</p>`,
`<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Đề tài, nhóm, vai trò &amp; công cụ — SWP391 thật sự chạy thế nào</h2>
<p class="lead">SWP391 không phải kiểu "một người làm yêu cầu, một người code, một người test". Một nhóm <strong>4–5 sinh viên</strong> xây <strong>một hệ thống web</strong> (khuyến nghị: hệ thống quản lý) trong <strong>ba iteration</strong>, và ở <em>mỗi</em> iteration <em>mỗi</em> thành viên tự phân tích, thiết kế và code full-stack 3–4 màn hình của chính mình. Bài này dựng mọi thứ phải có trước khi iteration 1 bắt đầu.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Đánh giá một đề tài có đủ lớn (và không quá lớn) cho nhóm mình</li>
<li>Giải thích ai làm gì: giảng viên (coach + khách hàng/PO), trưởng nhóm, thành viên</li>
<li>Cài đặt và đăng nhập các công cụ bắt buộc bằng tài khoản FPT</li>
<li>Liệt kê những gì nhóm phải nộp <em>trước</em> iteration 1 và cuối mỗi iteration</li>
</ul></div>
<h3>Cả môn học trong một màn hình</h3>
<table>
<thead><tr><th>Mốc</th><th>Thời lượng</th><th>Trọng số</th><th>Người chấm</th></tr></thead>
<tbody>
<tr><td>Iteration 1</td><td>6 slot × 135' (9 × 90')</td><td>15%</td><td>giảng viên lớp</td></tr>
<tr><td>Iteration 2</td><td>6 slot × 135'</td><td>20%</td><td>giảng viên lớp</td></tr>
<tr><td>Iteration 3 (gói cuối)</td><td>6 slot × 135'</td><td>25%</td><td>giảng viên lớp</td></tr>
<tr><td>Final Presentation</td><td>2 slot × 135'</td><td>40%</td><td>2 giảng viên khác</td></tr>
</tbody>
</table>
<p class="nhan">Điều kiện qua môn</p>
<ul>
<li><strong>Điểm danh</strong> ≥ 80% số slot</li>
<li><strong>OG</strong> = (iter1·15% + iter2·20% + iter3·25%) / 60% ≥ 5</li>
<li><strong>Final Presentation</strong> ≥ 5, và không gian lận</li>
</ul>
<p class="ghi-chu">Chi tiết chấm điểm (Converted-LOC = Complexity × Quality, MaxLOC) nằm ở Chương 0. Hai bộ slide của thầy/cô ghi MaxLOC khác nhau — luôn theo hướng dẫn hiện hành của giảng viên trên EduNext/CMS.</p>`));
L.l11.push(bi(`<h3>1 · Choosing a topic that is the right size</h3>
<p>The Subject Guides state the size rule precisely: the product must have <strong>enough screens/functions so that each member gets 3–4 different ones in each iteration, including iteration 3</strong>. Topics come from the teacher, or you propose one and the teacher agrees/adjusts it.</p>
<p class="nhan">Size check — do the arithmetic before you pitch</p>
<ol>
<li><strong>Members × screens × iterations</strong> — 5 members × 3 screens × 3 iterations = 45 screens at the very least; 4 members × 3–4 × 3 = 36–48.</li>
<li><strong>Actors</strong> — a management system with 3–4 actors (Guest, Customer, Staff, Admin) naturally gives that many screens.</li>
<li><strong>Complex screens</strong> — each member needs some Medium/Complex screens (≥ 7 fields, ≥ 3 transactions), otherwise the LOC grade stays low even when everything works.</li>
</ol>
<p class="nhan">Worked example — the sample team G5, "Job IT for Freelancer"</p>
<ul>
<li><strong>Actors</strong> — Guest, Freelancer, Recruiter, Admin.</li>
<li><strong>Use Cases sheet</strong> — 52 use cases (UC1 Login … company detail, report post, categories, dashboard…).</li>
<li><strong>Product sheet</strong> — every screen has Complexity, Effort, planned iteration (ITER1/2/3), an owner (PIC) and a status per step: BA → SRS → SDS → Coding → UT/IT.</li>
<li><strong>Result</strong> — planned 1680 converted-LOC for the team, graded 1560 — the gap is screens graded at lower Quality.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Too small is as bad as too big.</strong> A "library borrowing" system with 12 screens cannot give 5 people 3 screens in iteration 3 — the teacher will ask you to extend the scope. Too big ("a Facebook clone with video calls") means half the screens stay at Low quality. Aim for 45–60 screens you can actually finish.</div>
<p class="meo">🧠 <strong>Remember:</strong> one screen = one <em>Req</em> issue = one owner. If you cannot list the screens, you do not yet have a topic.</p>`,
`<h3>1 · Chọn đề tài vừa kích cỡ</h3>
<p>Subject Guides ghi rõ quy tắc kích cỡ: sản phẩm phải có <strong>đủ màn hình/chức năng để mỗi thành viên nhận 3–4 cái khác nhau trong mỗi iteration, kể cả iteration 3</strong>. Đề tài do giảng viên đưa, hoặc nhóm đề xuất và giảng viên đồng ý/điều chỉnh.</p>
<p class="nhan">Kiểm tra kích cỡ — làm phép tính trước khi trình bày</p>
<ol>
<li><strong>Số người × số màn hình × số iteration</strong> — 5 người × 3 màn hình × 3 iteration = tối thiểu 45 màn hình; 4 người × 3–4 × 3 = 36–48.</li>
<li><strong>Actor</strong> — một hệ thống quản lý có 3–4 actor (Guest, Customer, Staff, Admin) tự nhiên sinh ra chừng ấy màn hình.</li>
<li><strong>Màn hình phức tạp</strong> — mỗi người cần vài màn Medium/Complex (≥ 7 trường, ≥ 3 transaction), nếu không điểm LOC vẫn thấp dù mọi thứ chạy đúng.</li>
</ol>
<p class="nhan">Ví dụ thật — nhóm mẫu G5, "Job IT for Freelancer"</p>
<ul>
<li><strong>Actor</strong> — Guest, Freelancer, Recruiter, Admin.</li>
<li><strong>Sheet Use Cases</strong> — 52 use case (UC1 Login … chi tiết công ty, báo cáo bài đăng, danh mục, dashboard…).</li>
<li><strong>Sheet Product</strong> — mỗi màn hình có Complexity, Effort, iteration dự kiến (ITER1/2/3), người phụ trách (PIC) và trạng thái từng bước: BA → SRS → SDS → Coding → UT/IT.</li>
<li><strong>Kết quả</strong> — cả nhóm dự kiến 1680 converted-LOC, được chấm 1560 — phần hụt là do vài màn hình bị chấm Quality thấp hơn.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Quá nhỏ cũng tệ như quá lớn.</strong> Hệ thống "mượn sách thư viện" 12 màn hình không thể chia cho 5 người mỗi người 3 màn ở iteration 3 — giảng viên sẽ bắt mở rộng phạm vi. Quá lớn ("clone Facebook có gọi video") thì một nửa số màn hình chỉ đạt Quality Low. Nhắm 45–60 màn hình mà nhóm thật sự làm xong được.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một màn hình = một issue <em>Req</em> = một người phụ trách. Chưa liệt kê được màn hình thì bạn chưa có đề tài.</p>`));
L.l11.push(bi(`<h3>2 · Who does what — the real roles</h3>
<table>
<thead><tr><th>Person</th><th>Role in the project</th><th>GitLab role</th></tr></thead>
<tbody>
<tr><td><strong>Teacher</strong></td><td>Coach/mentor <em>and</em> customer/PO — the final word on requirements. Creates the Slack channel, the GitLab group, the group labels and milestones, and one repo per team.</td><td>Owner</td></tr>
<tr><td><strong>Team leader</strong></td><td>Invites members, protects branches, keeps the Project Tracking file and the submission package, merges branches. Also owns 3–4 screens like everyone else.</td><td>Maintainer</td></tr>
<tr><td><strong>Each member</strong></td><td>For his/her screens: logs and tracks the issues, writes the requirement + design part of the RDS, codes full-stack (UI → controller → DAO → DB), records a demo video.</td><td>Developer</td></tr>
</tbody>
</table>
<p class="nhan">Shared work that nobody "owns" by default — assign it explicitly</p>
<ul>
<li><strong>Common code modules</strong> — layout/header/footer, login filter, DB connection, utilities (iteration 1).</li>
<li><strong>Database design</strong> — one ERD and one script for the whole team; every table change goes through one person.</li>
<li><strong>Common document parts</strong> — RDS overview, context diagram, use-case diagram, conventions.</li>
<li><strong>Review &amp; integration</strong> — reading each other's code before the iteration tag.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The old "specialist" split loses marks.</strong> A table like "A = backend lead, B = frontend lead, C = QA" contradicts the guides: LOC is graded <em>individually</em> through each member's own demo of the screens he or she built end-to-end. Someone who only tested, or only drew the UI, has almost no LOC. Specialise in the <em>shared</em> hats above, never in your screens.</div>
<p class="meo">🧠 <strong>Remember:</strong> "Everyone full-stack on own screens, plus one shared hat each."</p>`,
`<h3>2 · Ai làm gì — vai trò thật</h3>
<table>
<thead><tr><th>Người</th><th>Vai trò trong dự án</th><th>Vai trò GitLab</th></tr></thead>
<tbody>
<tr><td><strong>Giảng viên</strong></td><td>Coach/mentor <em>và</em> khách hàng/PO — người chốt cuối cùng về yêu cầu. Tạo kênh Slack, GitLab group, bộ label và milestone của group, và một repo cho mỗi nhóm.</td><td>Owner</td></tr>
<tr><td><strong>Trưởng nhóm</strong></td><td>Mời thành viên, bảo vệ nhánh, giữ file Project Tracking và gói nộp bài, merge nhánh. Vẫn phụ trách 3–4 màn hình như mọi người.</td><td>Maintainer</td></tr>
<tr><td><strong>Từng thành viên</strong></td><td>Với các màn hình của mình: tạo và theo dõi issue, viết phần yêu cầu + thiết kế trong RDS, code full-stack (UI → controller → DAO → DB), quay video demo.</td><td>Developer</td></tr>
</tbody>
</table>
<p class="nhan">Việc chung không ai "tự nhiên" phụ trách — phải giao rõ</p>
<ul>
<li><strong>Module code chung</strong> — layout/header/footer, filter đăng nhập, kết nối DB, tiện ích (iteration 1).</li>
<li><strong>Thiết kế database</strong> — một ERD và một script cho cả nhóm; mọi thay đổi bảng đi qua một người.</li>
<li><strong>Phần tài liệu chung</strong> — tổng quan RDS, context diagram, use-case diagram, quy ước.</li>
<li><strong>Review &amp; tích hợp</strong> — đọc code của nhau trước khi gắn tag iteration.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Cách chia "chuyên gia" kiểu cũ làm mất điểm.</strong> Bảng kiểu "A = backend lead, B = frontend lead, C = QA" trái với hướng dẫn: LOC được chấm <em>từng cá nhân</em> qua phần demo các màn hình mà chính người đó làm từ đầu đến cuối. Người chỉ test, hoặc chỉ vẽ UI, gần như không có LOC. Hãy chuyên về các việc <em>chung</em> ở trên, đừng chuyên hoá màn hình của mình.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "Ai cũng full-stack màn hình của mình, cộng thêm một việc chung."</p>`));
L.l11.push(bi(`<h3>3 · Tools — log into all of them with your FPT account</h3>
<table>
<thead><tr><th>Need</th><th>Tool (Subject/Student Guides)</th><th>What the team does with it</th></tr></thead>
<tbody>
<tr><td>Source code + issues</td><td>GitLab (or GitHub if the teacher allows)</td><td>one repo, Req/Task/Defect issues, milestones, iteration tags</td></tr>
<tr><td>Documents</td><td>OneDrive or Google Drive</td><td>RDS, Project Tracking xlsx, reports — one shared folder</td></tr>
<tr><td>Communication</td><td>Slack</td><td>discussions in <em>threads</em>; Q&amp;A with the teacher is recorded</td></tr>
<tr><td>E-mail in the app</td><td>MailTrap (mailtrap.io)</td><td>test inbox for register / forgot-password mails</td></tr>
<tr><td>Java stack (recommended)</td><td>JDK, NetBeans 13, MySQL 8.0.23+, MySQL Workbench</td><td>Servlet/JSP web app + MySQL script</td></tr>
<tr><td>.NET stack (not recommended)</td><td>Visual Studio 2015+, IIS, SQL Server 2014+ Express</td><td>only if the teacher agrees</td></tr>
<tr><td>Starting UI</td><td>UI Themes zip: AdminDirector, AdminKit, AdminLTE, DashMin, Doctris, EduChamp, ZeShopper</td><td>pick one theme for the whole team in iteration 1</td></tr>
</tbody>
</table>
<h3>4 · What exists before iteration 1, and what you hand in after each iteration</h3>
<p class="nhan">Before iteration 1 starts</p>
<ol>
<li>Topic and tech stack agreed with the teacher (in the Slack thread, so it is on record).</li>
<li>The <strong>initial product scope</strong> and the screens planned for iteration 1, each with an owner — sheets "Use Cases" + "Product" of the Project Tracking file.</li>
<li>GitLab repo ready: members invited, branches protected, one <em>Req</em> issue per screen (Lesson 1.3).</li>
</ol>
<p class="nhan">End of every iteration — the submission package</p>
<ul>
<li><strong>Project Tracking xlsx</strong> — status of the screens done this iteration, plan for the next one.</li>
<li><strong>RDS document</strong> — requirement + design for this iteration's screens, plus updates to earlier ones.</li>
<li><strong>Links</strong> — each member's demo video, and the <strong>GitLab tag</strong> of this iteration's source (DB script inside the tagged code) — Lesson 1.5.</li>
</ul>
<p class="ghi-chu">The 2026 templates add SRS, SDS, System Test, AI Usage Report, Weekly Report and Presentation templates — your teacher tells you which ones are required in your class.</p>`,
`<h3>3 · Công cụ — đăng nhập tất cả bằng tài khoản FPT</h3>
<table>
<thead><tr><th>Nhu cầu</th><th>Công cụ (Subject/Student Guides)</th><th>Nhóm dùng để làm gì</th></tr></thead>
<tbody>
<tr><td>Mã nguồn + issue</td><td>GitLab (hoặc GitHub nếu giảng viên cho phép)</td><td>một repo, issue Req/Task/Defect, milestone, tag iteration</td></tr>
<tr><td>Tài liệu</td><td>OneDrive hoặc Google Drive</td><td>RDS, file Project Tracking xlsx, báo cáo — một thư mục chung</td></tr>
<tr><td>Trao đổi</td><td>Slack</td><td>thảo luận theo <em>thread</em>; hỏi đáp với giảng viên được lưu lại</td></tr>
<tr><td>Gửi e-mail trong app</td><td>MailTrap (mailtrap.io)</td><td>hộp thư test cho mail đăng ký / quên mật khẩu</td></tr>
<tr><td>Stack Java (khuyến nghị)</td><td>JDK, NetBeans 13, MySQL 8.0.23+, MySQL Workbench</td><td>web app Servlet/JSP + script MySQL</td></tr>
<tr><td>Stack .NET (không khuyến nghị)</td><td>Visual Studio 2015+, IIS, SQL Server 2014+ Express</td><td>chỉ khi giảng viên đồng ý</td></tr>
<tr><td>Giao diện khởi đầu</td><td>Gói UI Themes: AdminDirector, AdminKit, AdminLTE, DashMin, Doctris, EduChamp, ZeShopper</td><td>chọn một theme cho cả nhóm ngay iteration 1</td></tr>
</tbody>
</table>
<h3>4 · Những gì phải có trước iteration 1, và nộp gì sau mỗi iteration</h3>
<p class="nhan">Trước khi iteration 1 bắt đầu</p>
<ol>
<li>Đề tài và tech stack đã được giảng viên đồng ý (trong thread Slack, để có bằng chứng).</li>
<li><strong>Phạm vi sản phẩm ban đầu</strong> và các màn hình dự kiến cho iteration 1, mỗi màn có người phụ trách — sheet "Use Cases" + "Product" trong file Project Tracking.</li>
<li>Repo GitLab sẵn sàng: đã mời thành viên, đã bảo vệ nhánh, mỗi màn hình một issue <em>Req</em> (Bài 1.3).</li>
</ol>
<p class="nhan">Cuối mỗi iteration — gói nộp bài</p>
<ul>
<li><strong>Project Tracking xlsx</strong> — trạng thái các màn hình làm xong trong iteration, kế hoạch iteration sau.</li>
<li><strong>Tài liệu RDS</strong> — yêu cầu + thiết kế cho các màn hình của iteration này, cộng phần cập nhật cho iteration trước.</li>
<li><strong>Các link</strong> — video demo của từng thành viên, và <strong>tag GitLab</strong> của mã nguồn iteration (script DB nằm trong code đã tag) — Bài 1.5.</li>
</ul>
<p class="ghi-chu">Bộ template 2026 có thêm SRS, SDS, System Test, AI Usage Report, Weekly Report và mẫu Presentation — giảng viên sẽ nói lớp bạn bắt buộc những mẫu nào.</p>`));
L.l11.push(bi(`<h3>5 · Kickoff mistakes that cost marks later</h3>
<div class="pitfall co-tieu-de"><strong>Scope creep after iteration 1.</strong> Adding chat, notifications, payment… mid-semester means screens that end at Low quality. New ideas go to a "future work" list; change the scope only with the teacher's agreement in Slack.</div>
<div class="pitfall co-tieu-de"><strong>All the easy screens in iteration 1.</strong> Login/Logout/About Us are Simple (60). Mix at least one Medium screen per member into each iteration, or iteration 1 LOC is capped far below MaxLOC.</div>
<div class="pitfall co-tieu-de"><strong>Requirements decided without the customer.</strong> The teacher is the PO. An assumption that is not confirmed in a Q&amp;A issue or Slack thread can be graded as wrong.</div>
<div class="callout"><strong>★ Beyond the syllabus — RACI.</strong> Industry teams write a one-line <em>RACI</em> per shared deliverable: <strong>R</strong>esponsible (does it), <strong>A</strong>ccountable (signs off, exactly one person), <strong>C</strong>onsulted, <strong>I</strong>nformed. Put a 6-row RACI (DB script, common layout, RDS overview, tracking file, iteration tag, demo videos) on the first page of your team's OneDrive — it ends the "I thought you were doing it" arguments.</div>`,
`<h3>5 · Lỗi lúc khởi động làm mất điểm về sau</h3>
<div class="pitfall co-tieu-de"><strong>Phình phạm vi sau iteration 1.</strong> Thêm chat, thông báo, thanh toán… giữa kỳ nghĩa là những màn hình chỉ đạt Quality Low. Ý tưởng mới ghi vào danh sách "hướng phát triển"; chỉ đổi phạm vi khi giảng viên đồng ý trên Slack.</div>
<div class="pitfall co-tieu-de"><strong>Dồn hết màn hình dễ vào iteration 1.</strong> Login/Logout/About Us là Simple (60). Mỗi người nên có ít nhất một màn Medium trong mỗi iteration, không thì LOC iteration 1 bị chặn thấp hơn MaxLOC rất nhiều.</div>
<div class="pitfall co-tieu-de"><strong>Tự quyết yêu cầu không hỏi khách hàng.</strong> Giảng viên là PO. Một giả định không được xác nhận trong issue Q&amp;A hoặc thread Slack có thể bị chấm là sai.</div>
<div class="callout"><strong>★ Ngoài giáo trình — RACI.</strong> Các đội trong ngành viết một dòng <em>RACI</em> cho mỗi sản phẩm chung: <strong>R</strong>esponsible (người làm), <strong>A</strong>ccountable (người duyệt, đúng một người), <strong>C</strong>onsulted (được hỏi ý kiến), <strong>I</strong>nformed (được báo). Đặt một bảng RACI 6 dòng (script DB, layout chung, tổng quan RDS, file tracking, tag iteration, video demo) ở trang đầu thư mục OneDrive của nhóm — hết cảnh "tưởng bạn làm rồi".</div>`));
L.l11.push(books([
  ['sommerville', 'Ch. 22 "Project management" (teamwork, group cohesion) and Ch. 23 "Project planning"', 'Chương 22 "Project management" (làm việc nhóm) và Chương 23 "Project planning"'],
  ['wiegers', 'Ch. 2 "Requirements from the customer\'s perspective" — why the PO must confirm', 'Chương 2 "Requirements from the customer\'s perspective" — vì sao PO phải xác nhận'],
]));

/* ═══════════════════════ 1.2 AI playbook + why version control ═══════════════════════ */
L.l12.push(bi(`<span class="eyebrow">Chapter 1 · Lesson 1.2 · Slide5 GitLab Guides pages 1–2</span>
<h2>The team's AI playbook and why everything lives in Git</h2>
<p class="lead">Two habits start on day one. First, the team uses AI with a <strong>fixed, reviewable sequence of prompts</strong> — the teacher's own <em>Claude_Prompts.txt</em> — instead of random chats. Second, <strong>every file the team produces goes into version control</strong>, so any change has an author, a date and a reason.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Name the 9 steps of the teacher's AI workflow and the file each step produces</li>
<li>State the team's rules for using AI (and how the AI Usage Report records it)</li>
<li>Explain what version control answers (who, when, why) and why a team needs it</li>
</ul></div>
<h3>1 · The AI playbook — Claude_Prompts.txt in one table</h3>
<p>The teacher's file takes a <strong>Job Board System</strong> (ReactJS + Spring Boot + PostgreSQL in the example — your team adapts it to Java Web + MySQL) from idea to test cases. Each prompt feeds the files of the previous ones as attachments.</p>
<table>
<thead><tr><th>#</th><th>Prompt asks the AI to…</th><th>Output file (example)</th></tr></thead>
<tbody>
<tr><td>1</td><td>act as a <strong>senior BA</strong>: ask clarifying questions, then write the PRD from your answers</td><td>PRD (markdown)</td></tr>
<tr><td>2</td><td>draw the <strong>context diagram</strong></td><td>JBS_ContextDiagram.drawio</td></tr>
<tr><td>3</td><td>specify the main <strong>business flows</strong></td><td>JBS2_BizFlows.md</td></tr>
<tr><td>4</td><td>write the <strong>use-case specifications</strong></td><td>JBS3_UCD.md</td></tr>
<tr><td>5</td><td>find the <strong>data entities</strong>, relations, attributes + a <strong>traceability matrix</strong> (UC · actors · PRD functions · flows · entities)</td><td>JBS4_ERD.md</td></tr>
<tr><td>6</td><td>write the <strong>UI specification</strong>: design system, sitemap, per-screen spec (ID, route, actors, UC, elements, validation, empty/loading/error states, responsive), screen flows, RBAC UI rules, i18n, a11y</td><td>JBS5_SRS.md</td></tr>
<tr><td>7</td><td>design the <strong>MySQL database</strong>: schema doc, create script, demo data</td><td>JBS6_DB.md, JBS6_Database.sql, JBS6_DemoData.sql</td></tr>
<tr><td>8</td><td>act as <strong>Technical Architect</strong>: Technical Design Spec — stack, FE/BE folder trees, shared files per milestone, API conventions, security, DB conventions, milestone → file map</td><td>TDS (markdown)</td></tr>
<tr><td>9</td><td>tell you which inputs and prompts produce <strong>unit, integration (per screen) and E2E test cases</strong></td><td>test-case prompts</td></tr>
</tbody>
</table>
<p class="ghi-chu">Chapter 2 runs these prompts step by step on the running example; here you only need the map.</p>`,
`<span class="eyebrow">Chương 1 · Bài 1.2 · Slide5 GitLab Guides trang 1–2</span>
<h2>Bộ quy trình AI của nhóm và vì sao mọi thứ phải nằm trong Git</h2>
<p class="lead">Hai thói quen bắt đầu từ ngày đầu tiên. Thứ nhất, nhóm dùng AI theo <strong>một chuỗi prompt cố định, kiểm tra lại được</strong> — chính file <em>Claude_Prompts.txt</em> của giảng viên — thay vì chat lung tung. Thứ hai, <strong>mọi file nhóm tạo ra đều vào version control</strong>, để mỗi thay đổi có tác giả, thời điểm và lý do.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Kể tên 9 bước trong quy trình AI của giảng viên và file mà mỗi bước tạo ra</li>
<li>Nêu các quy tắc dùng AI của nhóm (và cách AI Usage Report ghi lại)</li>
<li>Giải thích version control trả lời câu hỏi gì (ai, khi nào, vì sao) và vì sao nhóm cần nó</li>
</ul></div>
<h3>1 · Bộ quy trình AI — Claude_Prompts.txt trong một bảng</h3>
<p>File của giảng viên đưa một <strong>Job Board System</strong> (ví dụ dùng ReactJS + Spring Boot + PostgreSQL — nhóm bạn đổi sang Java Web + MySQL) đi từ ý tưởng tới test case. Mỗi prompt đính kèm các file của những prompt trước.</p>
<table>
<thead><tr><th>#</th><th>Prompt yêu cầu AI…</th><th>File kết quả (ví dụ)</th></tr></thead>
<tbody>
<tr><td>1</td><td>đóng vai <strong>senior BA</strong>: đặt câu hỏi làm rõ, rồi viết PRD từ câu trả lời của bạn</td><td>PRD (markdown)</td></tr>
<tr><td>2</td><td>vẽ <strong>context diagram</strong></td><td>JBS_ContextDiagram.drawio</td></tr>
<tr><td>3</td><td>đặc tả các <strong>business flow</strong> chính</td><td>JBS2_BizFlows.md</td></tr>
<tr><td>4</td><td>viết <strong>đặc tả use case</strong></td><td>JBS3_UCD.md</td></tr>
<tr><td>5</td><td>xác định <strong>data entity</strong>, quan hệ, thuộc tính + <strong>traceability matrix</strong> (UC · actor · chức năng PRD · flow · entity)</td><td>JBS4_ERD.md</td></tr>
<tr><td>6</td><td>viết <strong>đặc tả UI</strong>: design system, sitemap, spec từng màn hình (ID, route, actor, UC, thành phần, validate, trạng thái rỗng/đang tải/lỗi, responsive), screen flow, luật UI theo quyền (RBAC), i18n, a11y</td><td>JBS5_SRS.md</td></tr>
<tr><td>7</td><td>thiết kế <strong>database MySQL</strong>: tài liệu schema, script tạo bảng, dữ liệu demo</td><td>JBS6_DB.md, JBS6_Database.sql, JBS6_DemoData.sql</td></tr>
<tr><td>8</td><td>đóng vai <strong>Technical Architect</strong>: Technical Design Spec — stack, cây thư mục FE/BE, file dùng chung theo milestone, quy ước API, bảo mật, quy ước DB, bảng milestone → file</td><td>TDS (markdown)</td></tr>
<tr><td>9</td><td>chỉ ra cần đầu vào và prompt nào để sinh <strong>unit, integration (theo màn hình) và E2E test case</strong></td><td>các prompt sinh test case</td></tr>
</tbody>
</table>
<p class="ghi-chu">Chương 2 chạy từng prompt trên ví dụ xuyên suốt; ở đây bạn chỉ cần nắm bản đồ.</p>`));
L.l12.push(bi(`<h3>2 · The team's rules for using AI</h3>
<ol>
<li><strong>AI drafts, the owner decides</strong> — the member who owns a screen must be able to explain every field, rule and line of code in the demo. "The AI wrote it" is a failing answer.</li>
<li><strong>The teacher is still the customer</strong> — AI answers to the senior-BA questions are <em>your</em> assumptions; confirm them in a Q&amp;A issue before they enter the RDS.</li>
<li><strong>Adapt, never paste</strong> — the playbook's stack and names are an example; outputs must match your topic, Java Web + MySQL, and the RDS template.</li>
<li><strong>Commit AI outputs like any other file</strong> — the prompt, the raw output and your edited version, so a reviewer can see what you changed.</li>
<li><strong>Record it</strong> — when the teacher requires Template5, fill one row per use of AI.</li>
</ol>
<p class="nhan">Template5 — AI Usage Report, the columns of each weekly sheet</p>
<ol class="hai-cot"><li>SDLC phase</li><li>Task / activity</li><li>AI tool used</li><li>AI output</li><li>Student's validation / modification</li><li>Evidence / link</li><li>Quantitative measure</li><li>Value added (1–5)</li><li>Risks / limitations observed</li></ol>
<p class="ghi-chu">The template's own sample row: "Requirement — user stories — ChatGPT — 10 user stories — selected 5, rewrote 3 to match scope — 8 kept — value 4 — some stories irrelevant". The <em>validation</em> column is what the teacher reads.</p>`,
`<h3>2 · Quy tắc dùng AI của nhóm</h3>
<ol>
<li><strong>AI phác thảo, người phụ trách quyết định</strong> — ai sở hữu màn hình phải giải thích được mọi trường, mọi luật và mọi dòng code khi demo. "AI viết ạ" là câu trả lời trượt.</li>
<li><strong>Giảng viên vẫn là khách hàng</strong> — câu trả lời cho các câu hỏi của "senior BA" là giả định <em>của bạn</em>; xác nhận trong issue Q&amp;A trước khi đưa vào RDS.</li>
<li><strong>Điều chỉnh, không dán nguyên</strong> — stack và tên trong bộ prompt chỉ là ví dụ; kết quả phải khớp đề tài của bạn, Java Web + MySQL, và template RDS.</li>
<li><strong>Commit kết quả AI như mọi file khác</strong> — prompt, output gốc và bản bạn đã sửa, để người review thấy bạn đã đổi gì.</li>
<li><strong>Ghi lại</strong> — khi giảng viên yêu cầu Template5, mỗi lần dùng AI điền một dòng.</li>
</ol>
<p class="nhan">Template5 — AI Usage Report, các cột của mỗi sheet theo tuần</p>
<ol class="hai-cot"><li>Pha SDLC</li><li>Công việc / hoạt động</li><li>Công cụ AI</li><li>Kết quả AI</li><li>Sinh viên kiểm chứng / chỉnh sửa</li><li>Bằng chứng / link</li><li>Số đo định lượng</li><li>Giá trị mang lại (1–5)</li><li>Rủi ro / hạn chế thấy được</li></ol>
<p class="ghi-chu">Dòng mẫu của chính template: "Requirement — user story — ChatGPT — 10 user story — chọn 5, viết lại 3 cho khớp phạm vi — giữ 8 — giá trị 4 — vài story không liên quan". Cột <em>kiểm chứng</em> là cột giảng viên đọc.</p>`));
L.l12.push(walkHead(G, 1, 2, 'Pages 3–32 continue in Lessons 1.3–1.5.', 'Trang 3–32 tiếp tục ở Bài 1.3–1.5.'));
L.l12.push(walk(G, [
  [1, 'Git & GitLab Guides — title',
    `<p class="y-chinh">🎯 This deck is the teacher's hands-on guide for the one tool the whole semester runs on: Git + GitLab.</p>
<p class="nhan">What the 32 pages cover</p>
<ol>
<li><strong>Pages 2–7</strong> — version control, creating and configuring the team's remote repo on GitLab (Lesson 1.3).</li>
<li><strong>Pages 8–25</strong> — configuring your Git client and the everyday cycle: status, add, commit, reset, checkout, push (Lesson 1.4).</li>
<li><strong>Pages 26–31</strong> — conflicts, branches, diff and tags (Lesson 1.5).</li>
</ol>
<p class="nhan">Why it matters for the grade</p>
<ul>
<li><strong>Every iteration is submitted as a GitLab tag</strong> — no tag, no source to grade.</li>
<li><strong>The commit history</strong> is how the teacher sees who built which screen.</li>
</ul>`,
    `<p class="y-chinh">🎯 Bộ slide này là hướng dẫn thực hành của giảng viên cho công cụ mà cả học kỳ dựa vào: Git + GitLab.</p>
<p class="nhan">32 trang gồm những gì</p>
<ol>
<li><strong>Trang 2–7</strong> — version control, tạo và cấu hình repo từ xa của nhóm trên GitLab (Bài 1.3).</li>
<li><strong>Trang 8–25</strong> — cấu hình Git client và vòng làm việc hằng ngày: status, add, commit, reset, checkout, push (Bài 1.4).</li>
<li><strong>Trang 26–31</strong> — xung đột, nhánh, diff và tag (Bài 1.5).</li>
</ol>
<p class="nhan">Vì sao liên quan tới điểm</p>
<ul>
<li><strong>Mỗi iteration được nộp bằng một tag GitLab</strong> — không có tag thì không có mã nguồn để chấm.</li>
<li><strong>Lịch sử commit</strong> là cách giảng viên thấy ai làm màn hình nào.</li>
</ul>`],
  [2, 'Version Control',
    `<p class="y-chinh">🎯 Version control (revision/source control) records every change so a team can work on the same files without losing anything.</p>
<p class="nhan">The questions it answers</p>
<ul>
<li><strong>Who</strong> made the change, and <strong>when</strong> — each commit stores author and time.</li>
<li><strong>Why</strong> — the commit message (see the conventions in Lesson 1.4).</li>
</ul>
<p class="nhan">Why it is so important</p>
<ul>
<li><strong>Keep track of changes</strong> — the full history of every file.</li>
<li><strong>Merge the team's work</strong> — five people editing one project in parallel.</li>
<li><strong>Go back to an old working version</strong> — when iteration 2 breaks what iteration 1 had.</li>
<li><strong>Add someone else's work easily</strong> — pull their commits instead of copying zips.</li>
</ul>
<p class="nhan">Reading the diagram</p>
<p>Developer A and Developer B each have a full <strong>local repository</strong>; they <em>commit</em> locally, then <em>push</em> to and <em>pull</em> from one <strong>central repository</strong> (GitLab). It works for almost all file types — your RDS .docx and tracking .xlsx too, although Git cannot merge those line by line.</p>
<p class="meo">🧠 <strong>Remember:</strong> "You – share with others – store on the cloud": commit (you), push/pull (share), GitLab (cloud).</p>`,
    `<p class="y-chinh">🎯 Version control (revision/source control) ghi lại mọi thay đổi để cả nhóm cùng làm trên một bộ file mà không mất gì.</p>
<p class="nhan">Những câu hỏi nó trả lời</p>
<ul>
<li><strong>Ai</strong> thay đổi, và <strong>khi nào</strong> — mỗi commit lưu tác giả và thời điểm.</li>
<li><strong>Vì sao</strong> — nằm trong commit message (xem quy ước ở Bài 1.4).</li>
</ul>
<p class="nhan">Vì sao nó quan trọng</p>
<ul>
<li><strong>Theo dõi thay đổi</strong> — toàn bộ lịch sử của từng file.</li>
<li><strong>Gộp công việc của nhóm</strong> — năm người sửa một dự án song song.</li>
<li><strong>Quay về bản chạy được trước đó</strong> — khi iteration 2 làm hỏng thứ iteration 1 đã có.</li>
<li><strong>Lấy việc của người khác dễ dàng</strong> — pull commit của họ thay vì gửi file zip.</li>
</ul>
<p class="nhan">Đọc sơ đồ</p>
<p>Developer A và Developer B mỗi người có một <strong>local repository</strong> đầy đủ; họ <em>commit</em> ở máy mình, rồi <em>push</em> lên và <em>pull</em> về từ một <strong>central repository</strong> (GitLab). Dùng được cho gần như mọi loại file — cả file RDS .docx và tracking .xlsx, dù Git không gộp được các file đó theo từng dòng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "Bạn – chia sẻ với người khác – lưu trên mây": commit (bạn), push/pull (chia sẻ), GitLab (mây).</p>`],
]));
L.l12.push(bi(`<h3>3 · The team's Git rules at a glance (details in 1.3–1.5)</h3>
<ol>
<li><strong>One repo per team</strong>, created by the teacher; the leader is Maintainer, members are Developers.</li>
<li><strong><code>main</code> and <code>iter*</code> are protected</strong> — only Maintainers merge, nobody force-pushes.</li>
<li><strong>Pull before you start, pull before you push</strong> — most conflicts come from skipping this.</li>
<li><strong>Small commits that name the issue</strong> — e.g. <code>feat(job): post a job form (#12)</code>.</li>
<li><strong>One tag per iteration</strong> — <code>iter1</code>, <code>iter2</code>, <code>iter3</code>, with the DB script inside the tagged code.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Word/Excel files do not merge.</strong> Git stores .docx/.xlsx fine but cannot merge two people's edits — the second push "wins" a conflict you must redo by hand. Keep the RDS and the tracking file on OneDrive (co-editing), and put only code, SQL and markdown in GitLab.</div>
<div class="callout"><strong>★ Beyond the syllabus — "docs as code".</strong> Many companies write specs in markdown next to the code, reviewed in merge requests exactly like code — which is why the teacher's AI prompts all produce <code>.md</code> files. If your team drafts the RDS in markdown (in <code>/docs</code>) and converts to .docx only for submission, every requirement change gets an author, a date and a review.</div>`,
`<h3>3 · Luật Git của nhóm trong một màn hình (chi tiết ở 1.3–1.5)</h3>
<ol>
<li><strong>Mỗi nhóm một repo</strong>, do giảng viên tạo; trưởng nhóm là Maintainer, thành viên là Developer.</li>
<li><strong><code>main</code> và <code>iter*</code> được bảo vệ</strong> — chỉ Maintainer được merge, không ai force-push.</li>
<li><strong>Pull trước khi bắt đầu, pull trước khi push</strong> — phần lớn xung đột đến từ việc bỏ bước này.</li>
<li><strong>Commit nhỏ, ghi số issue</strong> — ví dụ <code>feat(job): post a job form (#12)</code>.</li>
<li><strong>Mỗi iteration một tag</strong> — <code>iter1</code>, <code>iter2</code>, <code>iter3</code>, script DB nằm trong code đã tag.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>File Word/Excel không gộp được.</strong> Git lưu .docx/.xlsx bình thường nhưng không gộp được chỉnh sửa của hai người — lần push thứ hai "thắng", còn phần xung đột bạn phải làm lại bằng tay. Để RDS và file tracking trên OneDrive (sửa chung), chỉ đưa code, SQL và markdown lên GitLab.</div>
<div class="callout"><strong>★ Ngoài giáo trình — "docs as code".</strong> Nhiều công ty viết đặc tả bằng markdown ngay cạnh code, review qua merge request y như code — đó cũng là lý do mọi prompt AI của giảng viên đều sinh file <code>.md</code>. Nếu nhóm soạn nháp RDS bằng markdown (trong <code>/docs</code>) và chỉ chuyển sang .docx khi nộp, mỗi thay đổi yêu cầu đều có tác giả, ngày giờ và người review.</div>`));
L.l12.push(books([
  ['progit', 'Ch. 1 "Getting Started" (1.1 About version control, 1.3 What is Git)', 'Chương 1 "Getting Started" (1.1 About version control, 1.3 What is Git)'],
  ['sommerville', 'Ch. 25 "Configuration management" (25.1 Version management)', 'Chương 25 "Configuration management" (25.1 Version management)'],
]));

/* ═══════════════════════ 1.3 GitLab project setup ═══════════════════════ */
L.l13.push(bi(`<span class="eyebrow">Chapter 1 · Lesson 1.3 · Slide5 pages 3–7 · GitLab Student Guide pages 1–2</span>
<h2>Setting up the team's GitLab project — repo, members, protected branches, labels</h2>
<p class="lead">The teacher creates the class group, its labels and milestones, and one repository per team. The <strong>team leader</strong> then finishes the setup: invites members, protects branches, and fills the board with one <em>Req</em> issue per screen. Do it in the first week — the first iteration is graded from what is in this project.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Create (or receive) the remote repo and log in to GitLab with the FPT Google account</li>
<li>Give the right role to each person (Owner / Maintainer / Developer) and protect <code>main</code> and <code>iter*</code></li>
<li>Use the 8 labels correctly and map milestones to iterations</li>
<li>Write a good Req issue for one screen</li>
</ul></div>`,
`<span class="eyebrow">Chương 1 · Bài 1.3 · Slide5 trang 3–7 · GitLab Student Guide trang 1–2</span>
<h2>Dựng project GitLab của nhóm — repo, thành viên, nhánh bảo vệ, label</h2>
<p class="lead">Giảng viên tạo group của lớp, bộ label và milestone, và một repository cho mỗi nhóm. Sau đó <strong>trưởng nhóm</strong> hoàn tất: mời thành viên, bảo vệ nhánh, và lấp đầy board bằng mỗi màn hình một issue <em>Req</em>. Làm ngay tuần đầu — iteration 1 được chấm từ những gì nằm trong project này.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Tạo (hoặc nhận) repo từ xa và đăng nhập GitLab bằng tài khoản Google FPT</li>
<li>Gán đúng vai trò cho từng người (Owner / Maintainer / Developer) và bảo vệ <code>main</code> và <code>iter*</code></li>
<li>Dùng đúng 8 label và gắn milestone với iteration</li>
<li>Viết một issue Req tốt cho một màn hình</li>
</ul></div>`));
L.l13.push(walkHead(G, 3, 7));
L.l13.push(walk(G, [
  [3, 'Create & Configure Remote Repo',
    `<p class="y-chinh">🎯 Everything starts with one remote repository on GitLab, created with a README so it already has a first version.</p>
<p class="nhan">Reading the picture</p>
<ul>
<li><strong>You</strong> — your laptop is still empty: no working directory, no local repo yet.</li>
<li><strong>GitLab</strong> — the <em>Remote Repos</em> ("version database") already holds <strong>version 1</strong>: the commit that created the README.</li>
</ul>
<p class="nhan">For your team</p>
<ul>
<li><strong>In class</strong> the teacher usually creates the repo inside the class group and invites the leader — do not create a second one in your personal namespace.</li>
<li><strong>Tick "Initialize with a README"</strong> — an empty repo has no <code>main</code> to clone or pull, which is exactly what makes the member guide's <code>git pull origin main</code> fail.</li>
</ul>`,
    `<p class="y-chinh">🎯 Mọi thứ bắt đầu từ một repository từ xa trên GitLab, tạo kèm README để đã có sẵn phiên bản đầu tiên.</p>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>You</strong> — máy bạn còn trống: chưa có thư mục làm việc, chưa có local repo.</li>
<li><strong>GitLab</strong> — <em>Remote Repos</em> ("cơ sở dữ liệu phiên bản") đã chứa <strong>version 1</strong>: commit tạo ra README.</li>
</ul>
<p class="nhan">Với nhóm của bạn</p>
<ul>
<li><strong>Trên lớp</strong> giảng viên thường tạo repo trong group của lớp rồi mời trưởng nhóm — đừng tạo thêm repo thứ hai trong namespace cá nhân.</li>
<li><strong>Tick "Initialize with a README"</strong> — repo rỗng không có nhánh <code>main</code> để clone hay pull, và đó chính là lý do lệnh <code>git pull origin main</code> trong hướng dẫn thành viên bị lỗi.</li>
</ul>`],
  [4, 'Login with your Google Account',
    `<p class="y-chinh">🎯 Log in to gitlab.com with the Google (or GitHub) button, using your FPT e-mail — then set a password.</p>
<ol>
<li><strong>Sign in with Google</strong> using the university account the teacher invites.</li>
<li><strong>Set a GitLab password</strong> (Edit profile → Password). The GitLab Student Guide asks for this because the Git client may ask for username/password on the command line, and a Google-only account has none.</li>
<li><strong>Check your username</strong> — the teacher invites by e-mail or username; tell the leader which one.</li>
</ol>
<div class="pitfall">Logging in with a personal Gmail creates a <em>different</em> GitLab account: your commits then show up under a stranger's name and your LOC cannot be matched to you.</div>`,
    `<p class="y-chinh">🎯 Đăng nhập gitlab.com bằng nút Google (hoặc GitHub), dùng e-mail FPT — rồi đặt mật khẩu.</p>
<ol>
<li><strong>Sign in with Google</strong> bằng tài khoản trường mà giảng viên mời.</li>
<li><strong>Đặt mật khẩu GitLab</strong> (Edit profile → Password). GitLab Student Guide yêu cầu bước này vì Git client có thể hỏi username/password trên dòng lệnh, mà tài khoản chỉ đăng nhập Google thì không có mật khẩu.</li>
<li><strong>Kiểm tra username</strong> — giảng viên mời theo e-mail hoặc username; báo cho trưởng nhóm biết cái nào.</li>
</ol>
<div class="pitfall">Đăng nhập bằng Gmail cá nhân sẽ tạo ra một tài khoản GitLab <em>khác</em>: commit của bạn hiện dưới một cái tên lạ và LOC không khớp được với bạn.</div>`],
]));
L.l13.push(walk(G, [
  [5, 'Create a new project',
    `<p class="y-chinh">🎯 A project is created from the project list — directly, or inside a group/subgroup — as a <strong>Blank</strong>, <strong>Private</strong> project.</p>
<p class="nhan">The three settings the slide stars</p>
<ol>
<li><strong>Blank</strong> — "Create blank project" (not a template, not an import).</li>
<li><strong>URL</strong> — pick the class group/subgroup as namespace, and a clear slug such as <code>se18xx-g5-jobit</code>; the slug becomes the clone URL.</li>
<li><strong>Private</strong> — visibility Private: only invited members (and group members) can see the code. Your graded code must not be public during the semester.</li>
</ol>
<p class="nhan">Reading the screenshot</p>
<p>The class subgroup lists one project per team (G1 Project, G2 Project…). The red arrow points at <strong>New project</strong>, the button a teacher or leader uses.</p>`,
    `<p class="y-chinh">🎯 Project được tạo từ danh sách project — trực tiếp, hoặc trong một group/subgroup — dạng <strong>Blank</strong>, <strong>Private</strong>.</p>
<p class="nhan">Ba thiết lập slide đánh dấu sao</p>
<ol>
<li><strong>Blank</strong> — "Create blank project" (không dùng template, không import).</li>
<li><strong>URL</strong> — chọn group/subgroup của lớp làm namespace, và slug rõ ràng như <code>se18xx-g5-jobit</code>; slug trở thành URL để clone.</li>
<li><strong>Private</strong> — visibility Private: chỉ thành viên được mời (và thành viên group) thấy code. Code đang chấm điểm không được công khai trong học kỳ.</li>
</ol>
<p class="nhan">Đọc ảnh chụp</p>
<p>Subgroup của lớp liệt kê mỗi nhóm một project (G1 Project, G2 Project…). Mũi tên đỏ chỉ vào <strong>New project</strong>, nút mà giảng viên hoặc trưởng nhóm dùng.</p>`],
  [6, 'Invite/Assign Project Members',
    `<p class="y-chinh">🎯 Members are invited in a chain: the <strong>owner</strong> (teacher) invites the <strong>maintainer</strong> (team leader), then the maintainer invites the <strong>developers</strong> (members).</p>
<p class="nhan">Where</p>
<p><strong>Project information → Members → Invite members</strong>: enter username or e-mail, choose the role, optionally an expiration date.</p>
<p class="nhan">The roles you see in the "Max role" column</p>
<ul>
<li><strong>Owner</strong> — the teacher (inherited from the class group).</li>
<li><strong>Maintainer</strong> — the leader: settings, protected branches, merging, tags.</li>
<li><strong>Developer</strong> — members: push code, create branches, issues and merge requests.</li>
</ul>
<div class="pitfall">Do not make everyone Maintainer "to save time". Then anybody can unprotect <code>main</code> or delete a tag — and the protection of slide 7 means nothing.</div>`,
    `<p class="y-chinh">🎯 Mời thành viên theo chuỗi: <strong>owner</strong> (giảng viên) mời <strong>maintainer</strong> (trưởng nhóm), rồi maintainer mời các <strong>developer</strong> (thành viên).</p>
<p class="nhan">Ở đâu</p>
<p><strong>Project information → Members → Invite members</strong>: nhập username hoặc e-mail, chọn vai trò, có thể đặt ngày hết hạn.</p>
<p class="nhan">Các vai trò trong cột "Max role"</p>
<ul>
<li><strong>Owner</strong> — giảng viên (kế thừa từ group của lớp).</li>
<li><strong>Maintainer</strong> — trưởng nhóm: cấu hình, nhánh bảo vệ, merge, tag.</li>
<li><strong>Developer</strong> — thành viên: push code, tạo nhánh, issue và merge request.</li>
</ul>
<div class="pitfall">Đừng cho tất cả làm Maintainer "cho nhanh". Khi đó ai cũng gỡ được bảo vệ <code>main</code> hay xoá tag — và việc bảo vệ ở slide 7 trở nên vô nghĩa.</div>`],
  [7, 'Protect Branches',
    `<p class="y-chinh">🎯 In <strong>Settings → Repository → Protected branches</strong> the leader sets: Developers + Maintainers may <em>push</em>, only Maintainers may <em>merge</em>, nobody may force-push.</p>
<p class="nhan">The table at the bottom of the screenshot</p>
<ul>
<li><strong><code>main</code> (default)</strong> — allowed to merge: Maintainers · allowed to push: Developers + Maintainers · force push: off.</li>
<li><strong><code>iter*</code></strong> — a wildcard rule protecting every iteration branch (<code>iter1</code>, <code>iter2</code>, <code>iter3</code>… "3 matching branches").</li>
</ul>
<p class="nhan">What this means in practice</p>
<ul>
<li><strong>Members can push</strong> straight to <code>main</code> — the member guide relies on it — but history can never be rewritten, so nobody can erase a teammate's commits.</li>
<li><strong>Merging a branch</strong> (e.g. <code>iter2</code> into <code>main</code>) is the leader's job.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "Everyone pushes, the leader merges, nobody forces."</p>`,
    `<p class="y-chinh">🎯 Trong <strong>Settings → Repository → Protected branches</strong> trưởng nhóm đặt: Developer + Maintainer được <em>push</em>, chỉ Maintainer được <em>merge</em>, không ai được force-push.</p>
<p class="nhan">Bảng ở cuối ảnh chụp</p>
<ul>
<li><strong><code>main</code> (default)</strong> — allowed to merge: Maintainers · allowed to push: Developers + Maintainers · force push: tắt.</li>
<li><strong><code>iter*</code></strong> — luật wildcard bảo vệ mọi nhánh iteration (<code>iter1</code>, <code>iter2</code>, <code>iter3</code>… "3 matching branches").</li>
</ul>
<p class="nhan">Ý nghĩa thực tế</p>
<ul>
<li><strong>Thành viên push được</strong> thẳng lên <code>main</code> — hướng dẫn thành viên dựa vào điều này — nhưng lịch sử không bao giờ bị viết lại, nên không ai xoá được commit của đồng đội.</li>
<li><strong>Merge một nhánh</strong> (vd. <code>iter2</code> vào <code>main</code>) là việc của trưởng nhóm.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "Ai cũng push, trưởng nhóm merge, không ai force."</p>`],
]));
L.l13.push(walkHead(P, 1, 2, 'This is the teacher\'s Vietnamese step-by-step for your class; pages 3–5 (member steps) are in Lesson 1.4.', 'Đây là hướng dẫn tiếng Việt từng bước của giảng viên cho lớp bạn; trang 3–5 (các bước của thành viên) nằm ở Bài 1.4.'));
L.l13.push(walk(P, [
  [1, 'A. Introduction, environment prep, B. Team-leader step S1',
    `<p class="y-chinh">🎯 Page 1 prepares everyone's environment in 3 steps, then starts the team leader's checklist with "invite the members".</p>
<p class="nhan">A.3 — environment, for every member</p>
<ol>
<li><strong>S1 Install Git</strong> — latest version from git-scm.com (on Windows it also installs Git Credential Manager, used on page 4–5).</li>
<li><strong>S2 Register on GitLab.com</strong> so you can log in with e-mail/password — that username/password is what the command line asks for later.</li>
<li><strong>S3 Create a project, or wait for the invitation e-mail</strong> — from the teacher (you become <em>maintainer</em>) or from your leader (you become <em>developer</em>).</li>
</ol>
<p class="nhan">B.S1 — the leader invites the members</p>
<p><strong>Project/Project Information/Members</strong>: the owner invites the maintainer (team lead), the maintainer invites the developers — the same chain as Slide5 page 6. The guide suggests the team first practise on a demo project.</p>
<p class="ghi-chu">"2. Common Commands — TBD" is empty in the PDF; this course covers the commands in Lessons 1.4–1.5.</p>`,
    `<p class="y-chinh">🎯 Trang 1 chuẩn bị môi trường cho mọi người trong 3 bước, rồi mở đầu checklist của trưởng nhóm bằng việc "mời thành viên".</p>
<p class="nhan">A.3 — chuẩn bị môi trường, mọi thành viên đều làm</p>
<ol>
<li><strong>S1 Cài Git</strong> — bản mới nhất từ git-scm.com (trên Windows kèm luôn Git Credential Manager, dùng ở trang 4–5).</li>
<li><strong>S2 Đăng ký tài khoản GitLab.com</strong> để đăng nhập được bằng email/password — chính username/password này sẽ bị hỏi trên dòng lệnh về sau.</li>
<li><strong>S3 Tạo project, hoặc chờ email mời</strong> — từ giảng viên (bạn là <em>maintainer</em>) hoặc từ trưởng nhóm (bạn là <em>developer</em>).</li>
</ol>
<p class="nhan">B.S1 — trưởng nhóm mời thành viên</p>
<p><strong>Project/Project Information/Members</strong>: owner mời maintainer (trưởng nhóm), maintainer mời các developer — cùng chuỗi với Slide5 trang 6. Hướng dẫn gợi ý cả nhóm tập trước trên một project demo.</p>
<p class="ghi-chu">Mục "2. Common Commands — TBD" trong PDF còn trống; khoá học này trình bày các lệnh ở Bài 1.4–1.5.</p>`],
  [2, 'B. Team-leader steps S3–S4: skeleton project, protected branches',
    `<p class="y-chinh">🎯 The leader pushes one shared NetBeans project skeleton for the whole team, then lets members push while only maintainers merge.</p>
<p class="nhan">B.S3 — create the Java Web project and push it</p>
<ol>
<li><strong>Create the NetBeans project</strong> with the agreed packages (e.g. <code>controller</code>, <code>dao</code>, <code>model</code>, <code>service</code>, <code>common</code>) and the <code>web/WEB-INF/view/…</code> folders.</li>
<li><strong>Push it</strong> following the member steps (Lesson 1.4) so everyone clones the same structure.</li>
</ol>
<p class="nhan">B.S4 — let members push</p>
<p><strong>Project/Settings/Repository → Protected branches</strong>: Developers + Maintainers may push; only Maintainers may merge. The screenshot shows the same two rules as Slide5 page 7: <code>iter*</code> and <code>main</code>.</p>
<div class="pitfall co-tieu-de"><strong>Five skeletons = five projects.</strong> If each member creates his own NetBeans project, the first integration becomes a rewrite. One person (the leader) creates it once, in week 1, before anyone writes a screen.</div>
<p class="ghi-chu">The member table on this page shows real accounts; this course never repeats names — refer to "the leader" and "a member".</p>`,
    `<p class="y-chinh">🎯 Trưởng nhóm đẩy lên một bộ khung project NetBeans dùng chung cho cả nhóm, rồi cho phép thành viên push trong khi chỉ maintainer được merge.</p>
<p class="nhan">B.S3 — tạo Java Web project và đẩy lên</p>
<ol>
<li><strong>Tạo project NetBeans</strong> với các package đã thống nhất (vd. <code>controller</code>, <code>dao</code>, <code>model</code>, <code>service</code>, <code>common</code>) và các thư mục <code>web/WEB-INF/view/…</code>.</li>
<li><strong>Đẩy lên</strong> theo các bước của thành viên (Bài 1.4) để mọi người clone về cùng một cấu trúc.</li>
</ol>
<p class="nhan">B.S4 — phân quyền cho thành viên push</p>
<p><strong>Project/Settings/Repository → Protected branches</strong>: Developer + Maintainer được push; chỉ Maintainer được merge. Ảnh chụp có đúng hai luật như Slide5 trang 7: <code>iter*</code> và <code>main</code>.</p>
<div class="pitfall co-tieu-de"><strong>Năm bộ khung = năm project.</strong> Nếu mỗi người tự tạo project NetBeans của mình, lần tích hợp đầu tiên biến thành viết lại từ đầu. Một người (trưởng nhóm) tạo một lần, ngay tuần 1, trước khi ai viết màn hình nào.</div>
<p class="ghi-chu">Bảng thành viên ở trang này có tài khoản thật; khoá học không nhắc lại tên nào — chỉ gọi "trưởng nhóm" và "một thành viên".</p>`],
]));
L.l13.push(bi(`<h3>The team's GitLab setup checklist (week 1)</h3>
<p class="nhan">Access &amp; branches</p>
<ol>
<li><strong>Roles</strong> — teacher = Owner (via the class group), leader = Maintainer, every member = Developer. Nobody else.</li>
<li><strong>Protected branches</strong> — <code>main</code> (default) and the wildcard <code>iter*</code>: merge = Maintainers, push = Developers + Maintainers, force push = off.</li>
<li><strong>Skeleton</strong> — one NetBeans project, a <code>.gitignore</code>, a <code>/database</code> folder for the SQL script, a README saying how to run it.</li>
</ol>
<p class="nhan">The 8 labels (created by the teacher at group level — use them, do not invent new ones)</p>
<table>
<thead><tr><th>Label</th><th>Meaning (teacher's notes)</th><th>Example in the Job-IT system</th></tr></thead>
<tbody>
<tr><td><code>1_To Do</code></td><td>work or problem to be solved</td><td>new Req, not started</td></tr>
<tr><td><code>2_Doing</code></td><td>being worked on</td><td>member is coding "Post a Job"</td></tr>
<tr><td><code>3_Done</code></td><td>solved, <em>waiting to be checked</em> before it is Closed</td><td>screen done, a teammate verifies, then closes</td></tr>
<tr><td><code>Defect</code></td><td>error in documents or code found <strong>by the team</strong></td><td>salary filter ignores the max value</td></tr>
<tr><td><code>Leakage</code></td><td>error found <strong>by the customer/teacher</strong> after submission (review/test)</td><td>teacher: "apply twice to the same job is allowed"</td></tr>
<tr><td><code>Q&amp;A</code></td><td>question to clarify or confirm</td><td>"Can a recruiter edit a job after candidates applied?"</td></tr>
<tr><td><code>Req</code></td><td>one screen or function, assignable wholly to <strong>one</strong> person</td><td>"Post a Job" screen</td></tr>
<tr><td><code>Task</code></td><td>an activity for a single member (members usually create their own)</td><td>"write RDS section for Post a Job"</td></tr>
</tbody>
</table>
<p>Each issue carries <strong>one type label</strong> (Req / Task / Defect / Leakage / Q&amp;A) and <strong>one status label</strong> (1_To Do → 2_Doing → 3_Done). The board columns are the status labels; dragging a card changes the label.</p>
<p class="nhan">Milestones = iterations</p>
<ul>
<li><strong>Iteration 1 / 2 / 3</strong> — one milestone each, with the teacher's start and due dates; every Req of that iteration is attached to it.</li>
<li><strong>Burndown</strong> — the milestone page shows open vs closed issues, which is exactly what the Project Tracking file reports.</li>
</ul>`,
`<h3>Checklist dựng GitLab của nhóm (tuần 1)</h3>
<p class="nhan">Quyền truy cập &amp; nhánh</p>
<ol>
<li><strong>Vai trò</strong> — giảng viên = Owner (qua group của lớp), trưởng nhóm = Maintainer, mọi thành viên = Developer. Không ai khác.</li>
<li><strong>Nhánh bảo vệ</strong> — <code>main</code> (mặc định) và wildcard <code>iter*</code>: merge = Maintainers, push = Developers + Maintainers, force push = tắt.</li>
<li><strong>Bộ khung</strong> — một project NetBeans, một file <code>.gitignore</code>, thư mục <code>/database</code> chứa script SQL, README ghi cách chạy.</li>
</ol>
<p class="nhan">8 label (giảng viên tạo ở cấp group — dùng đúng, đừng tự đặt thêm)</p>
<table>
<thead><tr><th>Label</th><th>Ý nghĩa (ghi chú của giảng viên)</th><th>Ví dụ trong hệ thống Job-IT</th></tr></thead>
<tbody>
<tr><td><code>1_To Do</code></td><td>công việc hoặc vấn đề cần giải quyết</td><td>Req mới, chưa bắt đầu</td></tr>
<tr><td><code>2_Doing</code></td><td>đang được giải quyết</td><td>thành viên đang code "Post a Job"</td></tr>
<tr><td><code>3_Done</code></td><td>đã giải quyết, <em>cần kiểm tra lại</em> để đóng (Closed)</td><td>màn hình xong, một bạn khác kiểm rồi đóng</td></tr>
<tr><td><code>Defect</code></td><td>lỗi tài liệu hoặc code do <strong>đội dự án tự phát hiện</strong></td><td>bộ lọc lương bỏ qua giá trị max</td></tr>
<tr><td><code>Leakage</code></td><td>lỗi do <strong>khách hàng/giảng viên</strong> phát hiện qua review, test sau khi nộp</td><td>giảng viên: "ứng tuyển hai lần cùng một job vẫn được"</td></tr>
<tr><td><code>Q&amp;A</code></td><td>câu hỏi cần làm rõ hoặc cần xác nhận</td><td>"Recruiter có được sửa job sau khi đã có người ứng tuyển?"</td></tr>
<tr><td><code>Req</code></td><td>một màn hình hoặc chức năng cụ thể, giao trọn cho <strong>một</strong> người</td><td>màn hình "Post a Job"</td></tr>
<tr><td><code>Task</code></td><td>công việc giao cho một thành viên duy nhất (thường tự tạo cho mình)</td><td>"viết phần RDS cho Post a Job"</td></tr>
</tbody>
</table>
<p>Mỗi issue mang <strong>một label loại</strong> (Req / Task / Defect / Leakage / Q&amp;A) và <strong>một label trạng thái</strong> (1_To Do → 2_Doing → 3_Done). Các cột của board chính là label trạng thái; kéo thẻ là đổi label.</p>
<p class="nhan">Milestone = iteration</p>
<ul>
<li><strong>Iteration 1 / 2 / 3</strong> — mỗi iteration một milestone, với ngày bắt đầu và hạn của giảng viên; mọi Req của iteration đó gắn vào nó.</li>
<li><strong>Burndown</strong> — trang milestone cho thấy issue mở và đã đóng, đúng thứ file Project Tracking báo cáo.</li>
</ul>`));
L.l13.push(bi(`<h3>Worked example — one Req issue for one screen</h3>
<pre>Title:      [Req] Post a Job (Recruiter)
Labels:     Req, 1_To Do
Milestone:  Iteration 2
Assignee:   the member who owns the screen (exactly one)
Description:
  Actor:        Recruiter (logged in, account Active)
  Screen:       /job/post  —  form + preview
  Fields (9):   title, category, location, salary min, salary max,
                work type, deadline, description, required skills
  Transactions (4): save draft, publish, preview, cancel
  Rules:        salary min &lt;= salary max; deadline &gt; today;
                published job is visible to Guest/Freelancer
  Complexity:   Medium (7–15 fields, 3–7 transactions) = 120
  Links:        UC "Create job post" in RDS §3.x ; Q&amp;A #21 (edit after apply?)
Definition of done: RDS section written, code pushed, demo video recorded</pre>
<p class="nhan">Life of that issue during the iteration</p>
<ol>
<li><strong>1_To Do</strong> — created by the leader (or the owner) when the iteration is planned.</li>
<li><strong>2_Doing</strong> — the owner drags it when starting; Tasks ("RDS section", "DAO + SQL") and Q&amp;A issues are linked to it.</li>
<li><strong>3_Done</strong> — screen works; commits mention <code>#&lt;issue number&gt;</code> so the history is linked.</li>
<li><strong>Closed</strong> — after a teammate checks it. A bug the team finds later becomes a <code>Defect</code>; one the teacher finds after submission becomes a <code>Leakage</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Mistakes that lose tracking marks.</strong> One giant issue "Build the website"; a Req with two assignees; everything still in 1_To Do on submission day; bugs from the teacher logged as Defect instead of Leakage; the Project Tracking xlsx saying "Completed" while the GitLab issue is still open. The teacher compares the two.</div>
<div class="callout"><strong>★ Beyond the syllabus — issue templates &amp; closing keywords.</strong> GitLab reads markdown files in <code>.gitlab/issue_templates/</code>: commit a <code>Req.md</code> with the block above and every new Req starts pre-filled. And a commit or merge request message containing <code>Closes #12</code> closes issue 12 automatically when it reaches the default branch — one less thing to forget.</div>`,
`<h3>Ví dụ có lời giải — một issue Req cho một màn hình</h3>
<pre>Title:      [Req] Post a Job (Recruiter)
Labels:     Req, 1_To Do
Milestone:  Iteration 2
Assignee:   thành viên sở hữu màn hình (đúng một người)
Description:
  Actor:        Recruiter (đã đăng nhập, tài khoản Active)
  Screen:       /job/post  —  form + xem trước
  Fields (9):   title, category, location, salary min, salary max,
                work type, deadline, description, required skills
  Transactions (4): lưu nháp, đăng, xem trước, huỷ
  Rules:        salary min &lt;= salary max; deadline &gt; hôm nay;
                job đã đăng hiện cho Guest/Freelancer
  Complexity:   Medium (7–15 trường, 3–7 transaction) = 120
  Links:        UC "Create job post" trong RDS §3.x ; Q&amp;A #21 (sửa sau khi có người ứng tuyển?)
Definition of done: viết xong mục RDS, code đã push, đã quay video demo</pre>
<p class="nhan">Vòng đời của issue đó trong iteration</p>
<ol>
<li><strong>1_To Do</strong> — trưởng nhóm (hoặc người sở hữu) tạo khi lập kế hoạch iteration.</li>
<li><strong>2_Doing</strong> — người sở hữu kéo sang khi bắt đầu; các Task ("mục RDS", "DAO + SQL") và issue Q&amp;A được liên kết vào.</li>
<li><strong>3_Done</strong> — màn hình chạy được; các commit ghi <code>#&lt;số issue&gt;</code> để lịch sử được liên kết.</li>
<li><strong>Closed</strong> — sau khi một bạn khác kiểm tra. Lỗi nhóm tìm ra sau đó thành <code>Defect</code>; lỗi giảng viên tìm ra sau khi nộp thành <code>Leakage</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Những lỗi làm mất điểm tracking.</strong> Một issue khổng lồ "Làm website"; một Req có hai người được giao; ngày nộp mà mọi thứ vẫn nằm ở 1_To Do; lỗi giảng viên tìm ra lại ghi là Defect thay vì Leakage; file Project Tracking ghi "Completed" trong khi issue GitLab vẫn mở. Giảng viên đối chiếu hai nơi.</div>
<div class="callout"><strong>★ Ngoài giáo trình — issue template &amp; từ khoá đóng issue.</strong> GitLab đọc các file markdown trong <code>.gitlab/issue_templates/</code>: commit một file <code>Req.md</code> chứa khối ở trên và mọi Req mới đều được điền sẵn. Và một commit hoặc merge request có dòng <code>Closes #12</code> sẽ tự đóng issue 12 khi vào nhánh mặc định — bớt một việc dễ quên.</div>`));
L.l13.push(books([
  ['progit', 'Ch. 4 "Git on the Server" (4.8 GitLab) and Ch. 5 "Distributed Git" (5.1 Distributed workflows)', 'Chương 4 "Git on the Server" (4.8 GitLab) và Chương 5 "Distributed Git" (5.1 Distributed workflows)'],
  ['wiegers', 'Ch. 27 "Requirements management practices" (tracking requirement status)', 'Chương 27 "Requirements management practices" (theo dõi trạng thái yêu cầu)'],
]));

/* ═══════════════════════ 1.4 Git client, staging, commit, push ═══════════════════════ */
L.l14.push(bi(`<span class="eyebrow">Chapter 1 · Lesson 1.4 · Slide5 pages 8–25 · GitLab Student Guide pages 3–5</span>
<h2>Your Git client and the everyday cycle — status, add, commit, push</h2>
<p class="lead">Every member repeats the same loop dozens of times per iteration: <strong>pull → edit → status → add → commit → push</strong>. This lesson walks the teacher's slides for each step, the member steps of the GitLab guide (including <code>.gitignore</code> and switching accounts), and the team's commit-message convention.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Configure Git (name, e-mail, default branch) and connect a folder to the team repo</li>
<li>Read <code>git status</code> and name the four file states: untracked, unmodified, modified, staged</li>
<li>Commit, amend, undo an unpushed commit, and restore a file</li>
<li>Push safely and write commit messages the teacher can trace to a screen</li>
</ul></div>`,
`<span class="eyebrow">Chương 1 · Bài 1.4 · Slide5 trang 8–25 · GitLab Student Guide trang 3–5</span>
<h2>Git client của bạn và vòng làm việc hằng ngày — status, add, commit, push</h2>
<p class="lead">Mỗi thành viên lặp đi lặp lại cùng một vòng hàng chục lần mỗi iteration: <strong>pull → sửa → status → add → commit → push</strong>. Bài này đi qua slide của giảng viên cho từng bước, các bước dành cho thành viên trong GitLab guide (gồm <code>.gitignore</code> và đổi tài khoản), và quy ước commit message của nhóm.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Cấu hình Git (tên, e-mail, nhánh mặc định) và nối một thư mục với repo của nhóm</li>
<li>Đọc <code>git status</code> và gọi tên bốn trạng thái file: untracked, unmodified, modified, staged</li>
<li>Commit, sửa commit cuối, huỷ một commit chưa push, và khôi phục file</li>
<li>Push an toàn và viết commit message mà giảng viên lần ra được màn hình nào</li>
</ul></div>`));
L.l14.push(walkHead(G, 8, 12));
L.l14.push(walk(G, [
  [8, 'Configure your Git client',
    `<p class="y-chinh">🎯 Install Git, check who Git thinks you are, fix it, and connect the folder to the remote — four steps done once per machine.</p>
<ol>
<li><strong>Install</strong> from git-scm.com.</li>
<li><strong>Create a local repo &amp; check the config</strong> — <code>mkdir</code>, <code>cd</code>, <code>git init</code>, then <code>git config --list</code> shows <code>user.name</code> / <code>user.email</code>.</li>
<li><strong>Fix if necessary</strong> — <code>git config --global user.name "Your Name"</code>, <code>user.email</code> = your FPT address, <code>init.defaultBranch main</code>, and <code>core.excludesfile ~/.gitignore</code> for a personal ignore list.</li>
<li><strong>Connect to the remote</strong> — <code>git remote add origin https://gitlab.com/&lt;group&gt;/&lt;project&gt;.git</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Wrong e-mail = invisible work.</strong> GitLab links a commit to your account through <code>user.email</code>. With a laptop that still has a friend's or a personal address, your commits appear under someone else — and the history no longer proves you built your screens.</div>
<p class="meo">🧠 <strong>Remember:</strong> check <code>git config user.email</code> before your first commit on any machine (lab PCs included).</p>`,
    `<p class="y-chinh">🎯 Cài Git, kiểm tra Git đang nghĩ bạn là ai, sửa lại, và nối thư mục với remote — bốn bước làm một lần cho mỗi máy.</p>
<ol>
<li><strong>Cài đặt</strong> từ git-scm.com.</li>
<li><strong>Tạo local repo &amp; kiểm tra cấu hình</strong> — <code>mkdir</code>, <code>cd</code>, <code>git init</code>, rồi <code>git config --list</code> hiện <code>user.name</code> / <code>user.email</code>.</li>
<li><strong>Sửa nếu cần</strong> — <code>git config --global user.name "Tên Bạn"</code>, <code>user.email</code> = địa chỉ FPT, <code>init.defaultBranch main</code>, và <code>core.excludesfile ~/.gitignore</code> cho danh sách bỏ qua riêng của bạn.</li>
<li><strong>Nối với remote</strong> — <code>git remote add origin https://gitlab.com/&lt;group&gt;/&lt;project&gt;.git</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Sai e-mail = công sức vô hình.</strong> GitLab gắn commit với tài khoản của bạn qua <code>user.email</code>. Laptop còn để địa chỉ của bạn khác hoặc địa chỉ cá nhân thì commit hiện dưới tên người khác — và lịch sử không còn chứng minh được bạn làm các màn hình của mình.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> kiểm tra <code>git config user.email</code> trước commit đầu tiên trên bất kỳ máy nào (kể cả máy phòng lab).</p>`],
  [9, 'Clone the Remote files',
    `<p class="y-chinh">🎯 <code>git clone &lt;url&gt;</code> copies the whole remote repository to your machine in one command: working directory + local repo, already connected to <code>origin</code>.</p>
<p class="nhan">Reading the three boxes (they repeat on pages 9–13)</p>
<ul>
<li><strong>Working Dir</strong> — the files you edit (here only <code>README.md</code>).</li>
<li><strong>Local Repos</strong> — the hidden <code>.git</code> folder: your copy of the version database, now holding <em>version 1</em>.</li>
<li><strong>Remote Repos</strong> — GitLab, also at <em>version 1</em>.</li>
</ul>
<p class="nhan">Clone vs init + remote add</p>
<ul>
<li><strong><code>git clone</code></strong> — the easiest way when the repo already has commits.</li>
<li><strong><code>git init</code> + <code>git remote add</code> + <code>git pull origin main</code></strong> — what the GitLab Student Guide uses (page 3); same result, more steps.</li>
</ul>`,
    `<p class="y-chinh">🎯 <code>git clone &lt;url&gt;</code> chép toàn bộ repository từ xa về máy bằng một lệnh: thư mục làm việc + local repo, đã nối sẵn với <code>origin</code>.</p>
<p class="nhan">Đọc ba chiếc hộp (lặp lại ở trang 9–13)</p>
<ul>
<li><strong>Working Dir</strong> — các file bạn sửa (ở đây chỉ có <code>README.md</code>).</li>
<li><strong>Local Repos</strong> — thư mục ẩn <code>.git</code>: bản sao cơ sở dữ liệu phiên bản của bạn, giờ đang có <em>version 1</em>.</li>
<li><strong>Remote Repos</strong> — GitLab, cũng ở <em>version 1</em>.</li>
</ul>
<p class="nhan">Clone hay init + remote add</p>
<ul>
<li><strong><code>git clone</code></strong> — cách dễ nhất khi repo đã có commit.</li>
<li><strong><code>git init</code> + <code>git remote add</code> + <code>git pull origin main</code></strong> — cách GitLab Student Guide dùng (trang 3); cùng kết quả, nhiều bước hơn.</li>
</ul>`],
]));
L.l14.push(walk(G, [
  [10, 'Change the local/working repo — create the code skeleton',
    `<p class="y-chinh">🎯 You create the project skeleton in the working directory; the local and remote repos do not change until you commit and push.</p>
<p class="nhan">Reading the picture</p>
<ul>
<li><strong>Working Dir</strong> — now full of folders (<code>app</code>, <code>config</code>, <code>db</code>, <code>lib</code>, <code>log</code>, <code>tmp</code>…). The slide uses a Ruby project as example.</li>
<li><strong>Local Repos / Remote Repos</strong> — both still at <em>version 1</em>. Git knows nothing about the new files yet.</li>
</ul>
<p class="nhan">In your team</p>
<p>This is the leader's step B.S3: the NetBeans Java Web skeleton (<code>src/java/…/controller, dao, model</code>, <code>web/WEB-INF/view</code>, <code>/database</code>). Members never do it again — they clone it.</p>`,
    `<p class="y-chinh">🎯 Bạn tạo bộ khung project trong thư mục làm việc; local repo và remote repo không đổi gì cho tới khi bạn commit và push.</p>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Working Dir</strong> — giờ đầy thư mục (<code>app</code>, <code>config</code>, <code>db</code>, <code>lib</code>, <code>log</code>, <code>tmp</code>…). Slide lấy một project Ruby làm ví dụ.</li>
<li><strong>Local Repos / Remote Repos</strong> — cả hai vẫn ở <em>version 1</em>. Git chưa biết gì về các file mới.</li>
</ul>
<p class="nhan">Trong nhóm của bạn</p>
<p>Đây là bước B.S3 của trưởng nhóm: bộ khung NetBeans Java Web (<code>src/java/…/controller, dao, model</code>, <code>web/WEB-INF/view</code>, <code>/database</code>). Thành viên không làm lại — họ clone về.</p>`],
  [11, 'Create code skeleton & commit',
    `<p class="y-chinh">🎯 <code>git add -A</code> then <code>git commit -m "Created project skeleton"</code> records the skeleton as <em>version 2</em> in your <strong>local</strong> repo only.</p>
<p class="nhan">Reading the picture</p>
<ul>
<li><strong>Local Repos</strong> — version 1 → <strong>version 2</strong>.</li>
<li><strong>Remote Repos</strong> — still version 1: a commit is private until you push.</li>
</ul>
<p class="nhan">The teacher's notes — <code>.gitignore</code> before the first commit</p>
<ul>
<li><strong>Why</strong> — compiler output, temp files, IDE files and credentials must not be tracked.</li>
<li><strong>How</strong> — a file named <code>.gitignore</code> in the project root, one pattern per line: <code>abc.tmp</code> (one file), <code>*.log</code> (a type), <code>build/Release</code> (a folder), <code>others/*.txt</code> (a type inside a folder), <code>/credential.py</code> (a secret).</li>
<li><strong>Templates</strong> — github.com/github/gitignore has ready-made files (Java, NetBeans, Maven…).</li>
</ul>
<div class="pitfall">A file committed <em>before</em> it was added to <code>.gitignore</code> stays tracked. Remove it from the index with <code>git rm --cached &lt;file&gt;</code>, then commit.</div>`,
    `<p class="y-chinh">🎯 <code>git add -A</code> rồi <code>git commit -m "Created project skeleton"</code> ghi bộ khung thành <em>version 2</em> chỉ trong <strong>local</strong> repo của bạn.</p>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Local Repos</strong> — version 1 → <strong>version 2</strong>.</li>
<li><strong>Remote Repos</strong> — vẫn version 1: commit là riêng tư cho tới khi bạn push.</li>
</ul>
<p class="nhan">Ghi chú của giảng viên — <code>.gitignore</code> trước commit đầu tiên</p>
<ul>
<li><strong>Vì sao</strong> — file do trình biên dịch sinh ra, file tạm, file của IDE và thông tin nhạy cảm không được để Git theo dõi.</li>
<li><strong>Cách làm</strong> — một file tên <code>.gitignore</code> ở thư mục gốc, mỗi dòng một mẫu: <code>abc.tmp</code> (một file), <code>*.log</code> (một loại file), <code>build/Release</code> (một thư mục), <code>others/*.txt</code> (một loại file trong thư mục), <code>/credential.py</code> (file bí mật).</li>
<li><strong>Mẫu có sẵn</strong> — github.com/github/gitignore có file làm sẵn (Java, NetBeans, Maven…).</li>
</ul>
<div class="pitfall">File đã commit <em>trước khi</em> thêm vào <code>.gitignore</code> vẫn bị theo dõi. Gỡ nó khỏi index bằng <code>git rm --cached &lt;file&gt;</code>, rồi commit.</div>`],
  [12, 'Push your updates to the Remote',
    `<p class="y-chinh">🎯 <code>git push</code> sends your new commits to GitLab: the remote now also has <em>version 2</em>, and teammates can pull it.</p>
<ul>
<li><strong>Before</strong> — local 1 → 2, remote 1.</li>
<li><strong>After</strong> — local 2, remote 2: both databases hold the same history.</li>
</ul>
<p class="ghi-chu">The first push of a new branch needs <code>-u</code> (<code>git push -u origin main</code>) to link local and remote branches — page 25.</p>`,
    `<p class="y-chinh">🎯 <code>git push</code> gửi các commit mới lên GitLab: remote giờ cũng có <em>version 2</em>, và đồng đội pull về được.</p>
<ul>
<li><strong>Trước</strong> — local 1 → 2, remote 1.</li>
<li><strong>Sau</strong> — local 2, remote 2: hai cơ sở dữ liệu giữ cùng một lịch sử.</li>
</ul>
<p class="ghi-chu">Lần push đầu tiên của một nhánh mới cần <code>-u</code> (<code>git push -u origin main</code>) để nối nhánh local với nhánh remote — trang 25.</p>`],
]));
L.l14.push(walkHead(P, 3, 5, 'The member steps S1–S8 of the teacher\'s PDF — the exact sequence you type in week 1.', 'Các bước S1–S8 dành cho thành viên trong PDF của giảng viên — đúng trình tự bạn gõ ở tuần 1.'));
L.l14.push(walk(P, [
  [3, 'C. Team-member steps S1–S6, .gitignore',
    `<p class="y-chinh">🎯 Page 3 is the member's first-day recipe: empty folder → <code>git init</code> → connect → pull <code>main</code> → <code>.gitignore</code> → add your code.</p>
<ol>
<li><strong>S1</strong> — create an empty folder named after the project (e.g. <code>SWP391Team1</code>).</li>
<li><strong>S2</strong> — <code>git init</code> inside it.</li>
<li><strong>S3</strong> — <code>git remote add origin &lt;your team's GitLab URL&gt;.git</code>.</li>
<li><strong>S4</strong> — <code>git pull origin main</code> then <code>git checkout main</code>: fetch the leader's skeleton and work on <code>main</code>.</li>
<li><strong>S5</strong> — create <code>.gitignore</code> so irrelevant files never reach GitLab (saves space locally and remotely).</li>
<li><strong>S6</strong> — add your code files/folders.</li>
</ol>
<p class="nhan">The guide's <code>.gitignore</code>, line by line</p>
<ul>
<li><strong><code>*.log</code></strong> — every log file (e.g. the <code>TeamTracking.log</code> in the diagram).</li>
<li><strong><code>*.class</code></strong> — compiled Java (<code>Team1.class</code>).</li>
<li><strong><code>*.properties</code></strong> — config files that often hold the DB password.</li>
<li><strong><code>/build/</code>, <code>/dist/</code></strong> — NetBeans build output. (The comment says "temp", but these two lines ignore <code>build</code> and <code>dist</code> at the root.)</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ignoring all <code>*.properties</code> has a cost.</strong> If your DB connection is read from <code>db.properties</code>, a teammate who clones gets no config and the app cannot start. Commit a <code>db.properties.example</code> with placeholder values and let each member copy it locally.</div>
<p class="ghi-chu">The diagram shows the working dir (<code>.git</code>, <code>build</code>, <code>dist</code>, <code>nbproject</code>, <code>src</code>, <code>web</code>…) and the pushed tree: <code>src/java/team1/common, controller, dao, model, service</code> and <code>web/WEB-INF/view/account, todo, user</code> — a good package layout to copy.</p>`,
    `<p class="y-chinh">🎯 Trang 3 là công thức ngày đầu của thành viên: thư mục trống → <code>git init</code> → nối remote → pull <code>main</code> → <code>.gitignore</code> → thêm code.</p>
<ol>
<li><strong>S1</strong> — tạo thư mục trống đặt theo tên dự án (vd. <code>SWP391Team1</code>).</li>
<li><strong>S2</strong> — chạy <code>git init</code> trong đó.</li>
<li><strong>S3</strong> — <code>git remote add origin &lt;URL GitLab của nhóm&gt;.git</code>.</li>
<li><strong>S4</strong> — <code>git pull origin main</code> rồi <code>git checkout main</code>: lấy bộ khung của trưởng nhóm về và làm việc trên <code>main</code>.</li>
<li><strong>S5</strong> — tạo <code>.gitignore</code> để file không liên quan không bao giờ lên GitLab (tiết kiệm dung lượng cả local lẫn remote).</li>
<li><strong>S6</strong> — thêm các file/thư mục code của bạn.</li>
</ol>
<p class="nhan">File <code>.gitignore</code> trong hướng dẫn, từng dòng</p>
<ul>
<li><strong><code>*.log</code></strong> — mọi file log (vd. <code>TeamTracking.log</code> trong sơ đồ).</li>
<li><strong><code>*.class</code></strong> — file Java đã biên dịch (<code>Team1.class</code>).</li>
<li><strong><code>*.properties</code></strong> — file cấu hình, thường chứa mật khẩu DB.</li>
<li><strong><code>/build/</code>, <code>/dist/</code></strong> — output build của NetBeans. (Dòng chú thích ghi "temp", nhưng hai dòng này bỏ qua <code>build</code> và <code>dist</code> ở thư mục gốc.)</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bỏ qua mọi <code>*.properties</code> có cái giá.</strong> Nếu kết nối DB đọc từ <code>db.properties</code>, bạn cùng nhóm clone về sẽ không có cấu hình và app không chạy. Commit một file <code>db.properties.example</code> với giá trị giả, mỗi người tự chép thành bản thật ở máy mình.</div>
<p class="ghi-chu">Sơ đồ cho thấy thư mục làm việc (<code>.git</code>, <code>build</code>, <code>dist</code>, <code>nbproject</code>, <code>src</code>, <code>web</code>…) và cây đã push: <code>src/java/team1/common, controller, dao, model, service</code> và <code>web/WEB-INF/view/account, todo, user</code> — một bố cục package đáng để làm theo.</p>`],
  [4, 'S7 push, S8 conflicts, D. switching to a new account',
    `<p class="y-chinh">🎯 Page 4 finishes the loop (S7 add–commit–push, S8 conflict → pull, merge by hand, push again) and explains how to log out an old account on a shared PC.</p>
<p class="nhan">S7 — publish your work</p>
<p><code>git add .</code> → <code>git commit -m "Your source change notes"</code> → <code>git push</code>.</p>
<p class="nhan">S8 — when S7's push is rejected</p>
<ol>
<li><strong>Pull</strong> the latest code.</li>
<li><strong>Open every conflicted module</strong>, read your code and your teammates', keep what is needed and delete the rest (manual merge).</li>
<li><strong>Run S7 again</strong> to push the merged result. (Full real example with output in Lesson 1.5.)</li>
</ol>
<p class="nhan">D.1 — log out the other account</p>
<p>On Windows: <strong>Control Panel → User Accounts → Credential Manager → Windows Credentials → Generic Credentials</strong>, delete the <code>git:https://gitlab.com</code> (or github) entry.</p>
<p class="nhan">D.2 — start the working folder</p>
<p><code>git init</code>, <code>git remote add origin …</code>, then <code>git pull origin</code> — the "Connect to GitLab" window appears: choose <strong>Sign in with your browser</strong>.</p>`,
    `<p class="y-chinh">🎯 Trang 4 khép lại vòng làm việc (S7 add–commit–push, S8 xung đột → pull, gộp tay, push lại) và cách đăng xuất tài khoản cũ trên máy dùng chung.</p>
<p class="nhan">S7 — đưa việc của bạn lên</p>
<p><code>git add .</code> → <code>git commit -m "Your source change notes"</code> → <code>git push</code>.</p>
<p class="nhan">S8 — khi lệnh push ở S7 bị từ chối</p>
<ol>
<li><strong>Pull</strong> code mới nhất về.</li>
<li><strong>Mở từng module bị xung đột</strong>, xem code của mình và của các bạn, giữ phần cần giữ và xoá phần thừa (merge thủ công).</li>
<li><strong>Chạy lại S7</strong> để push kết quả đã gộp. (Ví dụ thật đầy đủ kèm output ở Bài 1.5.)</li>
</ol>
<p class="nhan">D.1 — đăng xuất tài khoản khác</p>
<p>Trên Windows: <strong>Control Panel → User Accounts → Credential Manager → Windows Credentials → Generic Credentials</strong>, xoá mục <code>git:https://gitlab.com</code> (hoặc github).</p>
<p class="nhan">D.2 — khởi tạo thư mục làm việc</p>
<p><code>git init</code>, <code>git remote add origin …</code>, rồi <code>git pull origin</code> — cửa sổ "Connect to GitLab" hiện ra: chọn <strong>Sign in with your browser</strong>.</p>`],
  [5, 'Authorize Git Credential Manager, D.3 manage code',
    `<p class="y-chinh">🎯 The browser asks you to authorize <strong>Git Credential Manager</strong> for your GitLab account; after that, pull/push work without typing a password.</p>
<ul>
<li><strong>Already logged in</strong> in the browser — click <em>Authorize Git Credential Manager</em>.</li>
<li><strong>Not logged in</strong> — log in with <em>your own</em> GitLab account first. Check the account name shown on the page: it must be yours, not the previous user's.</li>
<li><strong>What you grant</strong> — read-write access to repositories over HTTPS (not the API).</li>
<li><strong>D.3</strong> — from here, manage code with steps S4–S8 of part C.</li>
</ul>
<div class="pitfall">On a lab PC, forgetting D.1 means you push as whoever used the machine before you. Delete the stored credential when you leave.</div>`,
    `<p class="y-chinh">🎯 Trình duyệt yêu cầu bạn cấp quyền cho <strong>Git Credential Manager</strong> với tài khoản GitLab; sau đó pull/push không cần gõ mật khẩu.</p>
<ul>
<li><strong>Đã đăng nhập</strong> trên trình duyệt — bấm <em>Authorize Git Credential Manager</em>.</li>
<li><strong>Chưa đăng nhập</strong> — đăng nhập bằng tài khoản GitLab <em>của chính bạn</em> trước. Xem tên tài khoản hiện trên trang: phải là của bạn, không phải người dùng máy trước.</li>
<li><strong>Quyền cấp đi</strong> — đọc-ghi repository qua HTTPS (không phải API).</li>
<li><strong>D.3</strong> — từ đây quản lý code bằng các bước S4–S8 của phần C.</li>
</ul>
<div class="pitfall">Trên máy phòng lab, quên bước D.1 nghĩa là bạn push dưới tên người dùng máy trước đó. Xoá thông tin đăng nhập đã lưu khi rời máy.</div>`],
]));
L.l14.push(walkHead(G, 13, 25, 'Back to the Slide5 deck: how Git stores history, then every everyday command.', 'Quay lại bộ Slide5: Git lưu lịch sử thế nào, rồi từng lệnh dùng hằng ngày.'));
L.l14.push(walk(G, [
  [13, 'Questions to answer: how organized? what operations?',
    `<p class="y-chinh">🎯 Two questions frame the rest of the deck: <strong>how is a repository organised</strong> inside, and <strong>which operations</strong> move work between the three boxes?</p>
<ul>
<li><strong>How organised?</strong> — a chain of commits identified by hashes (pages 14–15).</li>
<li><strong>What operations?</strong> — add, commit, push, pull, fetch, merge, checkout (pages 16–25).</li>
</ul>`,
    `<p class="y-chinh">🎯 Hai câu hỏi dẫn dắt phần còn lại của bộ slide: <strong>bên trong repository được tổ chức thế nào</strong>, và <strong>những thao tác nào</strong> chuyển công việc giữa ba chiếc hộp?</p>
<ul>
<li><strong>Tổ chức thế nào?</strong> — một chuỗi commit định danh bằng mã hash (trang 14–15).</li>
<li><strong>Thao tác gì?</strong> — add, commit, push, pull, fetch, merge, checkout (trang 16–25).</li>
</ul>`],
  [14, 'How the repos are organized',
    `<p class="y-chinh">🎯 A repository is a chain of commits; each commit is a <strong>snapshot</strong> of the whole project, named by a hash, pointing back to its parent.</p>
<ul>
<li><strong>Hash = commit ID</strong> — a long SHA; the first 5–8 characters are enough to name it (<code>98ca9</code>, <code>34ac2</code>, <code>f30ab</code>).</li>
<li><strong>Arrows point backwards</strong> — each commit knows its parent, never its children.</li>
<li><strong>A branch (<code>master</code>) is just a label</strong> on the newest commit.</li>
</ul>
<p class="ghi-chu">Newer Git and GitLab call the default branch <code>main</code>; old screenshots say <code>master</code> — same idea.</p>`,
    `<p class="y-chinh">🎯 Repository là một chuỗi commit; mỗi commit là một <strong>ảnh chụp</strong> toàn bộ project, đặt tên bằng mã hash, trỏ ngược về commit cha.</p>
<ul>
<li><strong>Hash = ID của commit</strong> — một chuỗi SHA dài; 5–8 ký tự đầu là đủ để gọi tên (<code>98ca9</code>, <code>34ac2</code>, <code>f30ab</code>).</li>
<li><strong>Mũi tên chỉ ngược</strong> — mỗi commit biết cha của nó, không bao giờ biết con.</li>
<li><strong>Một nhánh (<code>master</code>) chỉ là một nhãn</strong> gắn trên commit mới nhất.</li>
</ul>
<p class="ghi-chu">Git và GitLab bản mới gọi nhánh mặc định là <code>main</code>; ảnh chụp cũ ghi <code>master</code> — cùng một ý.</p>`],
  [15, 'How git pull works',
    `<p class="y-chinh">🎯 When someone else has pushed, <code>git pull</code> downloads their commits and moves your branch forward to include them.</p>
<ul>
<li><strong><code>HEAD</code></strong> — "where you are now"; it points to <code>master</code>, which points to <code>87ab2</code>.</li>
<li><strong>Two commits share the parent <code>f30ab</code></strong> — <code>87ab2</code> on <code>master</code> and <code>c2b9e</code> on <code>testing</code>: history has forked.</li>
<li><strong>Pull = fetch + merge</strong> — if both sides changed, Git creates a merge commit, or stops with a conflict (Lesson 1.5).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> pull at the start of every work session and right before every push.</p>`,
    `<p class="y-chinh">🎯 Khi người khác đã push, <code>git pull</code> tải commit của họ về và đưa nhánh của bạn tiến lên để bao gồm chúng.</p>
<ul>
<li><strong><code>HEAD</code></strong> — "bạn đang đứng ở đâu"; nó trỏ vào <code>master</code>, và <code>master</code> trỏ vào <code>87ab2</code>.</li>
<li><strong>Hai commit chung cha <code>f30ab</code></strong> — <code>87ab2</code> trên <code>master</code> và <code>c2b9e</code> trên <code>testing</code>: lịch sử đã rẽ nhánh.</li>
<li><strong>Pull = fetch + merge</strong> — nếu cả hai phía đều thay đổi, Git tạo một merge commit, hoặc dừng lại vì xung đột (Bài 1.5).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> pull khi bắt đầu mỗi buổi làm và ngay trước mỗi lần push.</p>`],
  [16, 'Git Workflow',
    `<p class="y-chinh">🎯 Four places and six arrows: this diagram is the whole of everyday Git.</p>
<p class="nhan">Local (your machine)</p>
<ol>
<li><strong>Working directory</strong> → <em>add</em> → <strong>staging area</strong> → <em>commit</em> → <strong>local repository</strong>.</li>
</ol>
<p class="nhan">Remote (GitLab)</p>
<ul>
<li><strong>Push</strong> — local repository → remote repository.</li>
<li><strong>Fetch</strong> — remote → local repository only; your files do not change yet.</li>
<li><strong>Merge</strong> — local repository → working directory (combines fetched commits with yours).</li>
<li><strong>Pull</strong> — fetch + merge in one step, straight into the working directory.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "add → commit → push" goes up; "fetch → merge" (or "pull") comes down.</p>`,
    `<p class="y-chinh">🎯 Bốn nơi chứa và sáu mũi tên: sơ đồ này là toàn bộ Git dùng hằng ngày.</p>
<p class="nhan">Local (máy của bạn)</p>
<ol>
<li><strong>Working directory</strong> → <em>add</em> → <strong>staging area</strong> → <em>commit</em> → <strong>local repository</strong>.</li>
</ol>
<p class="nhan">Remote (GitLab)</p>
<ul>
<li><strong>Push</strong> — local repository → remote repository.</li>
<li><strong>Fetch</strong> — remote → chỉ vào local repository; file của bạn chưa đổi.</li>
<li><strong>Merge</strong> — local repository → working directory (gộp commit vừa fetch với commit của bạn).</li>
<li><strong>Pull</strong> — fetch + merge trong một bước, vào thẳng working directory.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "add → commit → push" là chiều đi lên; "fetch → merge" (hoặc "pull") là chiều đi xuống.</p>`],
]));
L.l14.push(walk(G, [
  [17, 'Staging area',
    `<p class="y-chinh">🎯 The staging area (index) is a draft of your next commit: you choose exactly which changes go in with <code>git add</code>.</p>
<p class="nhan">Two main states</p>
<ul>
<li><strong>Untracked</strong> — Git sees the file but does not follow it.</li>
<li><strong>Tracked</strong> — "bookmarked" by Git; inside it there are three sub-states: <strong>Unmodified</strong>, <strong>Modified</strong>, <strong>Staged</strong>.</li>
</ul>
<p class="nhan">The arrows of the diagram</p>
<ol>
<li><strong>Add the file</strong> — Untracked → Staged.</li>
<li><strong>Edit the file</strong> — Unmodified → Modified.</li>
<li><strong>Stage the file</strong> — Modified → Staged.</li>
<li><strong>Commit</strong> — Staged → Unmodified.</li>
<li><strong>Remove the file</strong> (from Git) — Unmodified → Untracked.</li>
</ol>
<p class="ghi-chu">Teacher's note: only <em>Staged</em> content can be committed; a tracked file that is merely Modified must be added again.</p>`,
    `<p class="y-chinh">🎯 Staging area (index) là bản nháp của commit kế tiếp: bạn chọn chính xác thay đổi nào được đưa vào bằng <code>git add</code>.</p>
<p class="nhan">Hai trạng thái chính</p>
<ul>
<li><strong>Untracked</strong> — Git thấy file nhưng không theo dõi.</li>
<li><strong>Tracked</strong> — đã được Git "đánh dấu"; bên trong có ba trạng thái phụ: <strong>Unmodified</strong>, <strong>Modified</strong>, <strong>Staged</strong>.</li>
</ul>
<p class="nhan">Các mũi tên trong sơ đồ</p>
<ol>
<li><strong>Add the file</strong> — Untracked → Staged.</li>
<li><strong>Edit the file</strong> — Unmodified → Modified.</li>
<li><strong>Stage the file</strong> — Modified → Staged.</li>
<li><strong>Commit</strong> — Staged → Unmodified.</li>
<li><strong>Remove the file</strong> (khỏi Git) — Unmodified → Untracked.</li>
</ol>
<p class="ghi-chu">Ghi chú của giảng viên: chỉ nội dung <em>Staged</em> mới commit được; file tracked mà chỉ đang Modified phải add lại.</p>`],
  [18, 'Git status 1/4 — Untracked',
    `<p class="y-chinh">🎯 A new file (<code>touch faq.html</code>) is <strong>Untracked</strong>: <code>git status</code> lists it and says "nothing added to commit".</p>
<ul>
<li><strong>"Untracked files:"</strong> — Git will ignore it in every commit until you add it.</li>
<li><strong>The hint</strong> — <code>use "git add &lt;file&gt;..." to include in what will be committed</code>.</li>
</ul>
<p class="nhan">Same step on today's Git (2.51), in a Job-IT repo</p>
<pre>$ git status
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
	web/faq.jsp

nothing added to commit but untracked files present (use "git add" to track)</pre>`,
    `<p class="y-chinh">🎯 File mới (<code>touch faq.html</code>) ở trạng thái <strong>Untracked</strong>: <code>git status</code> liệt kê nó và báo "nothing added to commit".</p>
<ul>
<li><strong>"Untracked files:"</strong> — Git bỏ qua file này ở mọi commit cho tới khi bạn add.</li>
<li><strong>Dòng gợi ý</strong> — <code>use "git add &lt;file&gt;..." to include in what will be committed</code>.</li>
</ul>
<p class="nhan">Cùng bước đó trên Git hiện nay (2.51), trong repo Job-IT</p>
<pre>$ git status
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
	web/faq.jsp

nothing added to commit but untracked files present (use "git add" to track)</pre>`],
  [19, 'Git status 2/4 — Tracked-Staged',
    `<p class="y-chinh">🎯 <code>git add faq.html</code> makes the file Tracked <em>and</em> Staged at once: it appears under "Changes to be committed" as <code>new file</code>.</p>
<ul>
<li><strong>Staged</strong> — this exact content will be in the next commit.</li>
<li><strong>Unstage hint</strong> — the slide's older Git says <code>git reset HEAD &lt;file&gt;</code>; Git 2.23+ prints <code>git restore --staged &lt;file&gt;</code>. Both remove the file from the staging area without touching your edits.</li>
</ul>
<pre>Changes to be committed:
  (use "git restore --staged &lt;file&gt;..." to unstage)
	new file:   web/faq.jsp</pre>`,
    `<p class="y-chinh">🎯 <code>git add faq.html</code> làm file vừa Tracked <em>vừa</em> Staged: nó hiện dưới "Changes to be committed" với nhãn <code>new file</code>.</p>
<ul>
<li><strong>Staged</strong> — đúng nội dung này sẽ nằm trong commit tới.</li>
<li><strong>Gợi ý bỏ stage</strong> — Git đời cũ trong slide ghi <code>git reset HEAD &lt;file&gt;</code>; Git 2.23+ in ra <code>git restore --staged &lt;file&gt;</code>. Cả hai đều đưa file ra khỏi staging area mà không đụng tới phần bạn đã sửa.</li>
</ul>
<pre>Changes to be committed:
  (use "git restore --staged &lt;file&gt;..." to unstage)
	new file:   web/faq.jsp</pre>`],
]));
L.l14.push(walk(G, [
  [20, 'Git status 3/4 — Tracked-Modified',
    `<p class="y-chinh">🎯 Edit a file <em>after</em> staging it and it shows up twice: the staged snapshot under "Changes to be committed", the new edits under "Changes not staged for commit".</p>
<ul>
<li><strong>Why twice</strong> — <code>git add</code> took a snapshot of <code>faq.html</code>; your later edit is a second, unstaged version.</li>
<li><strong>If you commit now</strong> — only the snapshot from the last <code>git add</code> goes in, <em>not</em> your newest lines (teacher's note).</li>
<li><strong>Fix</strong> — run <code>git add faq.html</code> again (or <code>git commit -a</code>).</li>
</ul>
<pre>Changes to be committed:
  (use "git restore --staged &lt;file&gt;..." to unstage)
	new file:   web/faq.jsp

Changes not staged for commit:
  (use "git add &lt;file&gt;..." to update what will be committed)
  (use "git restore &lt;file&gt;..." to discard changes in working directory)
	modified:   web/faq.jsp</pre>
<div class="pitfall">"I committed but my fix is not on GitLab" — nine times out of ten the fix was made after <code>git add</code>. Always read <code>git status</code> right before <code>git commit</code>.</div>`,
    `<p class="y-chinh">🎯 Sửa file <em>sau khi</em> đã stage thì nó xuất hiện hai lần: ảnh chụp đã stage nằm dưới "Changes to be committed", phần sửa mới nằm dưới "Changes not staged for commit".</p>
<ul>
<li><strong>Vì sao hai lần</strong> — <code>git add</code> đã chụp <code>faq.html</code>; lần sửa sau là phiên bản thứ hai, chưa stage.</li>
<li><strong>Nếu commit ngay</strong> — chỉ ảnh chụp từ lần <code>git add</code> cuối được đưa vào, <em>không</em> có những dòng mới nhất (ghi chú của giảng viên).</li>
<li><strong>Cách sửa</strong> — chạy lại <code>git add faq.html</code> (hoặc <code>git commit -a</code>).</li>
</ul>
<pre>Changes to be committed:
  (use "git restore --staged &lt;file&gt;..." to unstage)
	new file:   web/faq.jsp

Changes not staged for commit:
  (use "git add &lt;file&gt;..." to update what will be committed)
  (use "git restore &lt;file&gt;..." to discard changes in working directory)
	modified:   web/faq.jsp</pre>
<div class="pitfall">"Em commit rồi mà GitLab không có bản sửa" — chín trên mười lần là do sửa sau khi đã <code>git add</code>. Luôn đọc <code>git status</code> ngay trước <code>git commit</code>.</div>`],
  [21, 'Git status 4/4 — Tracked to Untracked',
    `<p class="y-chinh">🎯 The slide shows removing <code>faq.html</code> and <code>git status</code> reporting <code>deleted: faq.html</code> — read the commands carefully, because plain <code>rm</code> really deletes the file.</p>
<p class="nhan">What each command actually does (checked on Git 2.51)</p>
<ul>
<li><strong><code>rm faq.html</code></strong> — the operating system deletes the file from disk; Git reports it as <code>deleted</code> (unstaged). That is the output in the screenshot.</li>
<li><strong><code>git rm --cached faq.html</code></strong> — the command that makes a file <em>untracked but keeps it on disk</em>: status shows <code>deleted</code> under "to be committed" <em>and</em> the file under "Untracked files".</li>
<li><strong><code>git rm -f faq.html</code></strong> — removes it from Git and deletes it from disk even if it has changes: "be careful with that!!!"</li>
</ul>
<pre>$ git rm --cached web/faq.jsp
rm 'web/faq.jsp'
Changes to be committed:
	deleted:    web/faq.jsp
Untracked files:
	web/faq.jsp</pre>
<p class="meo">🧠 <strong>Remember:</strong> "<code>--cached</code> = only from Git's memory". Pair it with a <code>.gitignore</code> line so the file does not come back.</p>`,
    `<p class="y-chinh">🎯 Slide cho thấy việc xoá <code>faq.html</code> và <code>git status</code> báo <code>deleted: faq.html</code> — đọc kỹ lệnh, vì <code>rm</code> thường là xoá file thật.</p>
<p class="nhan">Mỗi lệnh thật sự làm gì (đã chạy thử trên Git 2.51)</p>
<ul>
<li><strong><code>rm faq.html</code></strong> — hệ điều hành xoá file khỏi ổ đĩa; Git báo là <code>deleted</code> (chưa stage). Đó là output trong ảnh chụp.</li>
<li><strong><code>git rm --cached faq.html</code></strong> — lệnh làm file thành <em>untracked nhưng vẫn giữ trên đĩa</em>: status hiện <code>deleted</code> ở phần "to be committed" <em>và</em> file nằm trong "Untracked files".</li>
<li><strong><code>git rm -f faq.html</code></strong> — gỡ khỏi Git và xoá khỏi đĩa kể cả khi file đang có thay đổi: "cẩn thận với lệnh này!!!"</li>
</ul>
<pre>$ git rm --cached web/faq.jsp
rm 'web/faq.jsp'
Changes to be committed:
	deleted:    web/faq.jsp
Untracked files:
	web/faq.jsp</pre>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "<code>--cached</code> = chỉ xoá khỏi trí nhớ của Git". Kèm thêm một dòng <code>.gitignore</code> để file không bị theo dõi lại.</p>`],
]));
L.l14.push(walk(G, [
  [22, 'Stage a file with "git add"',
    `<p class="y-chinh">🎯 <code>git add</code> indexes new or changed files: it copies their current content into the staging area, ready for the next commit.</p>
<p class="nhan">The forms on the slide</p>
<ul>
<li><strong>Some files/folders</strong> — <code>git add file1 file2 dir1 dir2</code>.</li>
<li><strong>The whole working folder</strong> — <code>git add .</code>, <code>git add -A</code> or <code>git add --all</code> (the slide's "-all" needs two dashes).</li>
<li><strong>By extension</strong> — <code>git add *.c</code>; for your project e.g. <code>git add src/java/dao/*.java</code>.</li>
</ul>
<p class="nhan">The diagram</p>
<ul>
<li><strong>Checkout the project</strong> — repository → working directory.</li>
<li><strong>Stage fixes</strong> (<code>git add</code>) — working directory → staging area; you can add several times to build the final snapshot.</li>
<li><strong>Commit</strong> — staging area → <code>.git</code> directory.</li>
</ul>
<div class="pitfall">Before <code>git add .</code>, run <code>git status</code>: without a <code>.gitignore</code>, "." also stages <code>build/</code>, <code>*.class</code> and the <code>db.properties</code> with your password.</div>`,
    `<p class="y-chinh">🎯 <code>git add</code> đánh chỉ mục file mới hoặc đã sửa: chép nội dung hiện tại của chúng vào staging area, sẵn sàng cho commit tới.</p>
<p class="nhan">Các dạng trên slide</p>
<ul>
<li><strong>Vài file/thư mục</strong> — <code>git add file1 file2 dir1 dir2</code>.</li>
<li><strong>Cả thư mục làm việc</strong> — <code>git add .</code>, <code>git add -A</code> hoặc <code>git add --all</code> (chữ "-all" trên slide cần hai gạch).</li>
<li><strong>Theo đuôi file</strong> — <code>git add *.c</code>; với project của bạn vd. <code>git add src/java/dao/*.java</code>.</li>
</ul>
<p class="nhan">Sơ đồ</p>
<ul>
<li><strong>Checkout the project</strong> — repository → working directory.</li>
<li><strong>Stage fixes</strong> (<code>git add</code>) — working directory → staging area; có thể add nhiều lần để tạo ảnh chụp cuối cùng.</li>
<li><strong>Commit</strong> — staging area → thư mục <code>.git</code>.</li>
</ul>
<div class="pitfall">Trước <code>git add .</code> hãy chạy <code>git status</code>: chưa có <code>.gitignore</code> thì "." sẽ stage luôn <code>build/</code>, <code>*.class</code> và file <code>db.properties</code> chứa mật khẩu của bạn.</div>`],
  [23, 'Track changes with "git commit"',
    `<p class="y-chinh">🎯 A commit captures a <strong>snapshot</strong> of what is staged — a safe point you can return to; Git never changes it unless you explicitly ask.</p>
<p class="nhan">Commit commands</p>
<ul>
<li><strong><code>git commit -m "message"</code></strong> — the normal commit; HEAD moves to it.</li>
<li><strong><code>git commit -a -m "…"</code></strong> — stages all <em>tracked</em> modified files, then commits (new files still need <code>git add</code>).</li>
<li><strong><code>git commit --amend -m "…"</code></strong> — replaces the last commit (fix its message or add a forgotten file) — only if not pushed yet.</li>
</ul>
<p class="nhan">Undo the last <em>unpushed</em> commit — <code>git reset</code></p>
<table>
<thead><tr><th>Command</th><th>Commit</th><th>Staging</th><th>Your files</th></tr></thead>
<tbody>
<tr><td><code>git reset --soft HEAD~1</code></td><td>undone</td><td>changes stay staged</td><td>kept</td></tr>
<tr><td><code>git reset HEAD~1</code> (mixed, default)</td><td>undone</td><td>unstaged</td><td>kept</td></tr>
<tr><td><code>git reset --hard HEAD~1</code></td><td>undone</td><td>cleared</td><td><strong>changes lost</strong></td></tr>
</tbody>
</table>
<p>After any reset, HEAD points to the parent commit.</p>
<div class="pitfall co-tieu-de"><strong>Never reset what is already on GitLab.</strong> Protected branches forbid force push, so a reset pushed commit cannot be sent anyway — and trying makes your local branch diverge. To undo a pushed commit, add a new one: <code>git revert &lt;hash&gt;</code>.</div>`,
    `<p class="y-chinh">🎯 Commit chụp lại một <strong>snapshot</strong> của những gì đã stage — một điểm an toàn để quay về; Git không bao giờ đổi nó trừ khi bạn yêu cầu rõ ràng.</p>
<p class="nhan">Các lệnh commit</p>
<ul>
<li><strong><code>git commit -m "message"</code></strong> — commit bình thường; HEAD dịch tới nó.</li>
<li><strong><code>git commit -a -m "…"</code></strong> — tự stage mọi file <em>tracked</em> đã sửa rồi commit (file mới vẫn cần <code>git add</code>).</li>
<li><strong><code>git commit --amend -m "…"</code></strong> — thay commit cuối (sửa message hoặc thêm file quên) — chỉ khi chưa push.</li>
</ul>
<p class="nhan">Huỷ commit cuối <em>chưa push</em> — <code>git reset</code></p>
<table>
<thead><tr><th>Lệnh</th><th>Commit</th><th>Staging</th><th>File của bạn</th></tr></thead>
<tbody>
<tr><td><code>git reset --soft HEAD~1</code></td><td>bị huỷ</td><td>thay đổi vẫn đang stage</td><td>giữ nguyên</td></tr>
<tr><td><code>git reset HEAD~1</code> (mixed, mặc định)</td><td>bị huỷ</td><td>bỏ stage</td><td>giữ nguyên</td></tr>
<tr><td><code>git reset --hard HEAD~1</code></td><td>bị huỷ</td><td>xoá sạch</td><td><strong>mất thay đổi</strong></td></tr>
</tbody>
</table>
<p>Sau mọi kiểu reset, HEAD trỏ về commit cha.</p>
<div class="pitfall co-tieu-de"><strong>Đừng bao giờ reset thứ đã lên GitLab.</strong> Nhánh bảo vệ cấm force push, nên commit đã push mà bị reset thì cũng không gửi lên được — và cố làm chỉ khiến nhánh local rẽ hướng. Muốn huỷ một commit đã push, hãy thêm commit mới: <code>git revert &lt;hash&gt;</code>.</div>`],
]));
L.l14.push(walk(G, [
  [24, 'Recover files from staging or last commit',
    `<p class="y-chinh">🎯 Besides <code>git reset</code> (moves the branch), <code>git checkout</code> recovers <em>file content</em> from the staging area, the last commit, or any commit.</p>
<p class="nhan">The two diagrams</p>
<ul>
<li><strong><code>git reset HEAD~3</code></strong> — moves <code>master</code> (and HEAD) back three commits, from <code>ed489</code> to <code>b325c</code>; with <code>--hard</code> it also rewrites the index and working directory.</li>
<li><strong><code>git checkout master~3</code></strong> — moves only <strong>HEAD</strong> to <code>b325c</code>; <code>master</code> stays at <code>ed489</code>. You are in "detached HEAD".</li>
</ul>
<p class="nhan">Commands</p>
<ul>
<li><strong>One file, from staging / last commit</strong> — <code>git checkout faq.jsp</code>; many: <code>git checkout *.html</code>; all: <code>git checkout -- .</code></li>
<li><strong>One file from a given commit</strong> — <code>git checkout &lt;hash&gt; file_name</code>.</li>
<li><strong>A whole commit</strong> — <code>git checkout &lt;hash&gt;</code>; to keep new commits made there: <code>git switch -c new_branch_name</code>.</li>
</ul>
<p class="ghi-chu">Teacher's note: newer Git splits these jobs — <code>git restore &lt;file&gt;</code> (or <code>git restore .</code>) recovers files, <code>git switch</code> changes branches. Same results, clearer names.</p>
<div class="pitfall">Checking out a file from the last commit <strong>throws away</strong> your uncommitted edits to it — there is no undo. Commit or <code>git stash</code> first if in doubt.</div>`,
    `<p class="y-chinh">🎯 Ngoài <code>git reset</code> (dời nhánh), <code>git checkout</code> khôi phục <em>nội dung file</em> từ staging area, từ commit cuối, hoặc từ bất kỳ commit nào.</p>
<p class="nhan">Hai sơ đồ</p>
<ul>
<li><strong><code>git reset HEAD~3</code></strong> — dời <code>master</code> (và HEAD) lùi ba commit, từ <code>ed489</code> về <code>b325c</code>; với <code>--hard</code> còn ghi đè cả index và thư mục làm việc.</li>
<li><strong><code>git checkout master~3</code></strong> — chỉ dời <strong>HEAD</strong> về <code>b325c</code>; <code>master</code> vẫn ở <code>ed489</code>. Bạn đang ở trạng thái "detached HEAD".</li>
</ul>
<p class="nhan">Các lệnh</p>
<ul>
<li><strong>Một file, từ staging / commit cuối</strong> — <code>git checkout faq.jsp</code>; nhiều file: <code>git checkout *.html</code>; tất cả: <code>git checkout -- .</code></li>
<li><strong>Một file từ commit cụ thể</strong> — <code>git checkout &lt;hash&gt; file_name</code>.</li>
<li><strong>Cả một commit</strong> — <code>git checkout &lt;hash&gt;</code>; muốn giữ commit mới làm ở đó: <code>git switch -c ten_nhanh_moi</code>.</li>
</ul>
<p class="ghi-chu">Ghi chú của giảng viên: Git bản mới tách việc ra — <code>git restore &lt;file&gt;</code> (hoặc <code>git restore .</code>) để khôi phục file, <code>git switch</code> để đổi nhánh. Kết quả như nhau, tên rõ nghĩa hơn.</p>
<div class="pitfall">Checkout một file từ commit cuối sẽ <strong>vứt bỏ</strong> mọi chỉnh sửa chưa commit của file đó — không có undo. Nếu phân vân, hãy commit hoặc <code>git stash</code> trước.</div>`],
  [25, 'Upload local repo with "git push"',
    `<p class="y-chinh">🎯 <code>git push</code> transfers commits from your local repository to the remote; the source is the branch HEAD points to.</p>
<p class="nhan">The commands on the slide</p>
<ul>
<li><strong>First push</strong> — <code>git push -u origin main</code>: <code>-u</code> sets the upstream link (the slide's <code>git push -u branch_name</code> omits the remote name).</li>
<li><strong>After the upstream exists</strong> — <code>git push</code>; a specific branch: <code>git push origin beta</code>.</li>
<li><strong>All branches</strong> — <code>git push origin --all</code>; all tags: <code>git push --tags</code>.</li>
<li><strong>Delete a remote branch</strong> — <code>git push origin --delete beta</code> (list them with <code>git branch -a</code>).</li>
<li><strong>Overwrite a remote branch</strong> — <code>git push --force origin beta</code> — careful!</li>
</ul>
<div class="pitfall co-tieu-de"><strong><code>--force</code> on a shared branch deletes teammates' work.</strong> It replaces the remote history with yours, so commits pushed by others since your last pull vanish. That is why the leader leaves "Allowed to force push" off on <code>main</code> and <code>iter*</code>. If push is rejected, <em>pull</em>, never force.</div>
<p class="ghi-chu">The line "Commit tracked files without add" on this slide repeats page 23 — <code>git commit -a</code>.</p>`,
    `<p class="y-chinh">🎯 <code>git push</code> chuyển commit từ local repository lên remote; nguồn là nhánh mà HEAD đang trỏ tới.</p>
<p class="nhan">Các lệnh trên slide</p>
<ul>
<li><strong>Push lần đầu</strong> — <code>git push -u origin main</code>: <code>-u</code> tạo liên kết upstream (dòng <code>git push -u branch_name</code> trên slide thiếu tên remote).</li>
<li><strong>Khi đã có upstream</strong> — <code>git push</code>; một nhánh cụ thể: <code>git push origin beta</code>.</li>
<li><strong>Tất cả các nhánh</strong> — <code>git push origin --all</code>; tất cả tag: <code>git push --tags</code>.</li>
<li><strong>Xoá nhánh trên remote</strong> — <code>git push origin --delete beta</code> (xem danh sách bằng <code>git branch -a</code>).</li>
<li><strong>Ghi đè nhánh remote</strong> — <code>git push --force origin beta</code> — cẩn thận!</li>
</ul>
<div class="pitfall co-tieu-de"><strong><code>--force</code> trên nhánh chung xoá mất công của đồng đội.</strong> Nó thay lịch sử trên remote bằng lịch sử của bạn, nên các commit người khác push từ sau lần pull cuối của bạn biến mất. Vì vậy trưởng nhóm để tắt "Allowed to force push" trên <code>main</code> và <code>iter*</code>. Push bị từ chối thì <em>pull</em>, đừng bao giờ force.</div>
<p class="ghi-chu">Dòng "Commit tracked files ko cần add" trên slide lặp lại trang 23 — <code>git commit -a</code>.</p>`],
]));
L.l14.push(bi(`<h3>The team's commit-message convention</h3>
<p>The teacher reads the history to see who built what. Use one format for the whole team:</p>
<pre>&lt;type&gt;(&lt;screen or module&gt;): &lt;what changed, imperative, ≤ 72 chars&gt; (#&lt;issue&gt;)

feat(job-post): add Post a Job form with salary validation (#12)
fix(apply): block applying twice to the same job (#31)
docs(rds): add use case "Create job post" (#12)
db(schema): add table job_application with unique (job_id, user_id) (#31)
refactor(dao): move connection code to DBContext
chore: update .gitignore for NetBeans build folders</pre>
<p class="nhan">Types</p>
<ul>
<li><strong>feat</strong> — a new screen/function; <strong>fix</strong> — a bug (Defect or Leakage issue).</li>
<li><strong>docs</strong>, <strong>db</strong>, <strong>refactor</strong>, <strong>test</strong>, <strong>chore</strong> — documents, SQL script, restructuring, tests, housekeeping.</li>
</ul>
<p class="nhan">A .gitignore for a NetBeans Java Web project</p>
<pre># NetBeans / Ant build output
/build/
/dist/
/nbproject/private/
# compiled and generated
*.class
*.log
# local secrets — commit db.properties.example instead
db.properties
# OS / editor noise
.DS_Store
Thumbs.db</pre>
<h3>The daily cycle, in order</h3>
<ol>
<li><code>git pull</code> — start from the team's latest code.</li>
<li>Drag your Req issue to <code>2_Doing</code>; code one small piece; run it in NetBeans.</li>
<li><code>git status</code> → <code>git add</code> the files you meant → <code>git status</code> again.</li>
<li><code>git commit -m "feat(…): … (#12)"</code>.</li>
<li><code>git pull</code> again → fix conflicts if any → <code>git push</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Commits that hurt the grade.</strong> One commit per iteration ("final", "update", "abc"); a commit that does not compile pushed to <code>main</code> the night before submission; code pushed from a teammate's laptop under his name. The history is evidence — keep it honest and readable.</div>
<div class="callout"><strong>★ Beyond the syllabus — Conventional Commits &amp; hooks.</strong> The format above is a light version of the <em>Conventional Commits</em> specification, which tools use to generate changelogs and version numbers automatically. A <code>commit-msg</code> Git hook (a small script in <code>.git/hooks</code>) can reject messages that do not match the pattern — the same idea as the protected branch, applied to messages.</div>`,
`<h3>Quy ước commit message của nhóm</h3>
<p>Giảng viên đọc lịch sử để biết ai làm gì. Cả nhóm dùng một định dạng:</p>
<pre>&lt;type&gt;(&lt;màn hình hoặc module&gt;): &lt;thay đổi gì, dạng mệnh lệnh, ≤ 72 ký tự&gt; (#&lt;issue&gt;)

feat(job-post): add Post a Job form with salary validation (#12)
fix(apply): block applying twice to the same job (#31)
docs(rds): add use case "Create job post" (#12)
db(schema): add table job_application with unique (job_id, user_id) (#31)
refactor(dao): move connection code to DBContext
chore: update .gitignore for NetBeans build folders</pre>
<p class="nhan">Các loại</p>
<ul>
<li><strong>feat</strong> — màn hình/chức năng mới; <strong>fix</strong> — sửa lỗi (issue Defect hoặc Leakage).</li>
<li><strong>docs</strong>, <strong>db</strong>, <strong>refactor</strong>, <strong>test</strong>, <strong>chore</strong> — tài liệu, script SQL, tái cấu trúc, test, việc lặt vặt.</li>
</ul>
<p class="nhan">Một file .gitignore cho project NetBeans Java Web</p>
<pre># NetBeans / Ant build output
/build/
/dist/
/nbproject/private/
# compiled and generated
*.class
*.log
# local secrets — commit db.properties.example instead
db.properties
# OS / editor noise
.DS_Store
Thumbs.db</pre>
<h3>Vòng làm việc mỗi ngày, theo thứ tự</h3>
<ol>
<li><code>git pull</code> — bắt đầu từ code mới nhất của nhóm.</li>
<li>Kéo issue Req của bạn sang <code>2_Doing</code>; code một phần nhỏ; chạy thử trong NetBeans.</li>
<li><code>git status</code> → <code>git add</code> đúng các file định đưa vào → <code>git status</code> lần nữa.</li>
<li><code>git commit -m "feat(…): … (#12)"</code>.</li>
<li><code>git pull</code> lần nữa → gỡ xung đột nếu có → <code>git push</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Những commit làm hại điểm.</strong> Mỗi iteration một commit ("final", "update", "abc"); một commit không biên dịch được đẩy lên <code>main</code> vào đêm trước hạn nộp; code push từ laptop của bạn khác dưới tên bạn ấy. Lịch sử là bằng chứng — giữ nó trung thực và dễ đọc.</div>
<div class="callout"><strong>★ Ngoài giáo trình — Conventional Commits &amp; hook.</strong> Định dạng trên là bản rút gọn của đặc tả <em>Conventional Commits</em>, thứ các công cụ dùng để tự sinh changelog và số phiên bản. Một Git hook <code>commit-msg</code> (script nhỏ trong <code>.git/hooks</code>) có thể từ chối message sai mẫu — cùng ý tưởng với nhánh bảo vệ, áp dụng cho message.</div>`));
L.l14.push(books([
  ['progit', 'Ch. 2 "Git Basics" (2.2 Recording changes, 2.4 Undoing things, 2.5 Working with remotes) and Ch. 7.7 "Reset demystified"', 'Chương 2 "Git Basics" (2.2 Recording changes, 2.4 Undoing things, 2.5 Working with remotes) và mục 7.7 "Reset demystified"'],
]));

/* ═══════════════════════ 1.5 Conflicts, branches, diff, tags ═══════════════════════ */
L.l15.push(bi(`<span class="eyebrow">Chapter 1 · Lesson 1.5 · Slide5 pages 26–32</span>
<h2>Conflicts, branches, diff and the iteration tag</h2>
<p class="lead">Five people touching one project will collide — usually in the shared header, the DB script or a common DAO. This lesson walks the teacher's pages on conflicts, branches, <code>git diff</code> and tags, then shows a <strong>real conflict resolved step by step</strong> (commands and output copied from an actual run), a branch strategy for 4–5 people, and how to tag each iteration's submission.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Recognise a rejected push and a merge conflict, and resolve both</li>
<li>Create, switch, merge and delete branches; read a branch/tag diagram</li>
<li>Compare versions with <code>git diff</code></li>
<li>Tag an iteration and submit the tag link correctly</li>
</ul></div>`,
`<span class="eyebrow">Chương 1 · Bài 1.5 · Slide5 trang 26–32</span>
<h2>Xung đột, nhánh, diff và tag của iteration</h2>
<p class="lead">Năm người cùng chạm vào một project thì sẽ va nhau — thường ở header dùng chung, script DB hoặc một DAO chung. Bài này đi qua các trang của giảng viên về xung đột, nhánh, <code>git diff</code> và tag, rồi trình bày <strong>một xung đột thật được gỡ từng bước</strong> (lệnh và output chép từ một lần chạy thật), chiến lược nhánh cho 4–5 người, và cách gắn tag cho bài nộp mỗi iteration.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Nhận ra push bị từ chối và xung đột merge, và gỡ được cả hai</li>
<li>Tạo, chuyển, merge và xoá nhánh; đọc sơ đồ nhánh/tag</li>
<li>So sánh các phiên bản bằng <code>git diff</code></li>
<li>Gắn tag cho một iteration và nộp đúng link tag</li>
</ul></div>`));
L.l15.push(walkHead(G, 26, 32));
L.l15.push(walk(G, [
  [26, 'Handle change conflicts',
    `<p class="y-chinh">🎯 Two developers change the same lines of the same file; the one who pushes second is rejected, pulls, gets a conflict, fixes it by hand, then commits and pushes.</p>
<p class="nhan">The sequence diagram, step by step</p>
<ol>
<li><strong>1–2</strong> — both developers pull the same version from Remote.</li>
<li><strong>3–6</strong> — each makes changes, then <code>git add</code> + <code>git commit</code> locally.</li>
<li><strong>7</strong> — Developer A pushes first: accepted.</li>
<li><strong>8</strong> — Developer B pushes: <strong>REJECTED</strong> — <code>! [rejected] main -&gt; main (fetch first)</code>, "the remote contains work that you do not have locally".</li>
<li><strong>9</strong> — B pulls: <code>CONFLICT (content): Merge conflict in file07.txt</code>, "Automatic merge failed".</li>
<li><strong>10–12</strong> — B fixes the conflict, <code>add</code> + <code>commit</code>, pushes: accepted.</li>
</ol>
<p class="nhan">Reading the conflicted file (top-left box)</p>
<ul>
<li><strong><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code></strong> … <code>=======</code> — your version (<code>file7_line3</code>).</li>
<li><strong><code>=======</code></strong> … <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; 09cbbdd…</code> — the incoming commit (<code>file7_line2</code>).</li>
<li><strong>Your job</strong> — edit to the correct final text, delete the three marker lines, then add → commit → push.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "rejected" is not an error in your code — it means "pull first".</p>`,
    `<p class="y-chinh">🎯 Hai developer sửa cùng những dòng của cùng một file; người push sau bị từ chối, pull về, gặp xung đột, sửa bằng tay, rồi commit và push.</p>
<p class="nhan">Sơ đồ tuần tự, từng bước</p>
<ol>
<li><strong>1–2</strong> — cả hai pull cùng một phiên bản từ Remote.</li>
<li><strong>3–6</strong> — mỗi người sửa, rồi <code>git add</code> + <code>git commit</code> ở máy mình.</li>
<li><strong>7</strong> — Developer A push trước: được chấp nhận.</li>
<li><strong>8</strong> — Developer B push: <strong>REJECTED</strong> — <code>! [rejected] main -&gt; main (fetch first)</code>, "remote có công việc mà bạn chưa có ở local".</li>
<li><strong>9</strong> — B pull: <code>CONFLICT (content): Merge conflict in file07.txt</code>, "Automatic merge failed".</li>
<li><strong>10–12</strong> — B sửa xung đột, <code>add</code> + <code>commit</code>, push: được chấp nhận.</li>
</ol>
<p class="nhan">Đọc file bị xung đột (khung trên bên trái)</p>
<ul>
<li><strong><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code></strong> … <code>=======</code> — phiên bản của bạn (<code>file7_line3</code>).</li>
<li><strong><code>=======</code></strong> … <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; 09cbbdd…</code> — commit đi vào (<code>file7_line2</code>).</li>
<li><strong>Việc của bạn</strong> — sửa thành nội dung cuối cùng đúng, xoá ba dòng đánh dấu, rồi add → commit → push.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "rejected" không phải lỗi trong code của bạn — nó nghĩa là "pull trước đã".</p>`],
]));
L.l15.push(walk(G, [
  [27, 'Working with branches',
    `<p class="y-chinh">🎯 A branch lets you diverge from the main line and keep working without disturbing it; a tag marks one fixed version, such as a release.</p>
<p class="nhan">Top diagram — the teacher's iteration model</p>
<ul>
<li><strong>main branch</strong> — the green line C11 → C12 → … → C5, from start to final.</li>
<li><strong>iter3 / iter4 / iter5 branches</strong> — work for one iteration grows on its own branch (C31–C33, C41–C43, C51–C52), then merges back into main.</li>
<li><strong>Release1 (POC) … Release5 (Final)</strong> — a tag on main after each merge: the version that was delivered.</li>
</ul>
<p class="nhan">Bottom diagram — what a branch really is</p>
<ul>
<li><strong>A lightweight movable pointer</strong> to a commit: <code>master</code> → C8, <code>beta</code> → C10, <code>alpha</code> → C4.</li>
<li><strong><code>HEAD</code></strong> points to <code>beta</code>: new commits move <code>beta</code> forward, the others stay put.</li>
</ul>
<p class="nhan">Tags</p>
<ul>
<li><strong>Label a specific version</strong> in history, usually release points (<code>v1.0.1</code>, <code>v1.0.2</code>…).</li>
<li><strong>A tag is a branch that never moves</strong> — no further commits after it is created.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> branch = moving bookmark; tag = bookmark glued to one page.</p>`,
    `<p class="y-chinh">🎯 Nhánh cho phép rẽ khỏi dòng chính và làm tiếp mà không làm xáo trộn nó; tag đánh dấu một phiên bản cố định, ví dụ một bản phát hành.</p>
<p class="nhan">Sơ đồ trên — mô hình iteration của giảng viên</p>
<ul>
<li><strong>main branch</strong> — đường xanh C11 → C12 → … → C5, từ lúc bắt đầu tới bản cuối.</li>
<li><strong>Nhánh iter3 / iter4 / iter5</strong> — việc của một iteration lớn lên trên nhánh riêng (C31–C33, C41–C43, C51–C52), rồi merge về main.</li>
<li><strong>Release1 (POC) … Release5 (Final)</strong> — tag trên main sau mỗi lần merge: phiên bản đã bàn giao.</li>
</ul>
<p class="nhan">Sơ đồ dưới — nhánh thật ra là gì</p>
<ul>
<li><strong>Một con trỏ nhẹ, di chuyển được</strong> tới một commit: <code>master</code> → C8, <code>beta</code> → C10, <code>alpha</code> → C4.</li>
<li><strong><code>HEAD</code></strong> trỏ vào <code>beta</code>: commit mới đẩy <code>beta</code> tiến lên, các nhánh khác đứng yên.</li>
</ul>
<p class="nhan">Tag</p>
<ul>
<li><strong>Gắn nhãn một phiên bản cụ thể</strong> trong lịch sử, thường là mốc phát hành (<code>v1.0.1</code>, <code>v1.0.2</code>…).</li>
<li><strong>Tag là một nhánh không bao giờ di chuyển</strong> — không có commit nào sau khi tạo.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nhánh = thẻ đánh dấu di động; tag = thẻ đánh dấu dán chết vào một trang.</p>`],
  [28, 'Common branch commands',
    `<p class="y-chinh">🎯 Eight commands cover all branch work; the diagram on the right recaps which box each everyday command moves data between.</p>
<ol>
<li><strong><code>git branch -a</code></strong> — all branches (local + remote); <code>*</code> marks the current one.</li>
<li><strong><code>git branch new_branch_name</code></strong> — create a branch (you stay where you are).</li>
<li><strong><code>git checkout -b br_name</code></strong> — create <em>and</em> switch (today also <code>git switch -c br_name</code>).</li>
<li><strong><code>git checkout br_name</code></strong> — switch between branches (<code>git switch br_name</code>).</li>
<li><strong><code>git log --oneline</code></strong> — the branch's history, one line per commit (or <code>--pretty=oneline</code>).</li>
<li><strong><code>git merge br_name</code></strong> — merge <code>br_name</code> <em>into the current</em> branch.</li>
<li><strong><code>git branch -d br_name</code></strong> — delete locally; on the remote: <code>git push origin -d br_name</code>.</li>
<li><strong><code>git tag -a tag_name -m "tag notes"</code></strong> — create an annotated tag on the current commit. (The slide writes <code>-l</code>, which <em>lists</em> tags; the message option is <code>-m</code>.)</li>
</ol>
<p class="nhan">Useful <code>git log</code> options from the teacher's notes</p>
<ul>
<li><strong><code>git log -2 -p</code></strong> — last 2 commits with their changes; <strong><code>--stat</code></strong> — files changed.</li>
<li><strong><code>--author="…"</code>, <code>--grep="…"</code>, <code>--after="2026-09-01"</code></strong> — filter by author, message, date; <strong><code>-- src/…/JobDAO.java</code></strong> — only commits touching a file.</li>
<li><strong><code>git log --graph --oneline</code></strong> — draws the branches and merges.</li>
</ul>`,
    `<p class="y-chinh">🎯 Tám lệnh bao hết việc với nhánh; sơ đồ bên phải tóm lại mỗi lệnh hằng ngày chuyển dữ liệu giữa những hộp nào.</p>
<ol>
<li><strong><code>git branch -a</code></strong> — mọi nhánh (local + remote); dấu <code>*</code> đánh dấu nhánh hiện tại.</li>
<li><strong><code>git branch new_branch_name</code></strong> — tạo nhánh (bạn vẫn đứng ở nhánh cũ).</li>
<li><strong><code>git checkout -b br_name</code></strong> — tạo <em>và</em> chuyển sang (nay còn có <code>git switch -c br_name</code>).</li>
<li><strong><code>git checkout br_name</code></strong> — chuyển qua lại giữa các nhánh (<code>git switch br_name</code>).</li>
<li><strong><code>git log --oneline</code></strong> — lịch sử của nhánh, mỗi commit một dòng (hoặc <code>--pretty=oneline</code>).</li>
<li><strong><code>git merge br_name</code></strong> — merge <code>br_name</code> <em>vào nhánh hiện tại</em>.</li>
<li><strong><code>git branch -d br_name</code></strong> — xoá ở local; trên remote: <code>git push origin -d br_name</code>.</li>
<li><strong><code>git tag -a tag_name -m "tag notes"</code></strong> — tạo annotated tag trên commit hiện tại. (Slide ghi <code>-l</code>, là tuỳ chọn <em>liệt kê</em> tag; tuỳ chọn ghi chú là <code>-m</code>.)</li>
</ol>
<p class="nhan">Các tuỳ chọn <code>git log</code> hữu ích trong ghi chú của giảng viên</p>
<ul>
<li><strong><code>git log -2 -p</code></strong> — 2 commit cuối kèm nội dung thay đổi; <strong><code>--stat</code></strong> — các file đã đổi.</li>
<li><strong><code>--author="…"</code>, <code>--grep="…"</code>, <code>--after="2026-09-01"</code></strong> — lọc theo tác giả, message, ngày; <strong><code>-- src/…/JobDAO.java</code></strong> — chỉ các commit chạm vào một file.</li>
<li><strong><code>git log --graph --oneline</code></strong> — vẽ các nhánh và lần merge.</li>
</ul>`],
]));
L.l15.push(walk(G, [
  [29, 'Handle merge conflicts',
    `<p class="y-chinh">🎯 The same collision as page 26, but between two <strong>branches</strong>: <code>git merge alpha</code> stops with a conflict, <code>git status</code> shows where, you fix, add, commit, push.</p>
<p class="nhan">The three boxes, bottom to top</p>
<ol>
<li><strong>Failed to merge</strong> — <code>git merge alpha</code> → <code>CONFLICT (content): Merge conflict in 1.txt</code>, "fix conflicts and then commit the result".</li>
<li><strong>Check status</strong> — "You have unmerged paths"; the files that merged cleanly (<code>3.txt</code>, <code>4.txt</code>) are already staged; <code>1.txt</code> is <strong>both modified</strong>. Escape hatch: <code>git merge --abort</code>.</li>
<li><strong>The file</strong> — <code>l11</code>, then <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> <code>l13</code> <code>=======</code> <code>l12</code> <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; alpha</code>: this time the marker names the branch.</li>
</ol>
<p class="nhan">In your team</p>
<p>This is what the leader meets when merging <code>iter2</code> into <code>main</code> after hot-fixes went into <code>main</code>. Resolve with the owners of both changes sitting together — the leader should not guess which line of someone else's screen is right.</p>`,
    `<p class="y-chinh">🎯 Cùng kiểu va chạm như trang 26, nhưng giữa hai <strong>nhánh</strong>: <code>git merge alpha</code> dừng lại vì xung đột, <code>git status</code> chỉ ra chỗ nào, bạn sửa, add, commit, push.</p>
<p class="nhan">Ba khung, từ dưới lên</p>
<ol>
<li><strong>Failed to merge</strong> — <code>git merge alpha</code> → <code>CONFLICT (content): Merge conflict in 1.txt</code>, "fix conflicts and then commit the result".</li>
<li><strong>Check status</strong> — "You have unmerged paths"; các file gộp êm (<code>3.txt</code>, <code>4.txt</code>) đã được stage sẵn; <code>1.txt</code> là <strong>both modified</strong>. Lối thoát: <code>git merge --abort</code>.</li>
<li><strong>File</strong> — <code>l11</code>, rồi <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> <code>l13</code> <code>=======</code> <code>l12</code> <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; alpha</code>: lần này dòng đánh dấu ghi tên nhánh.</li>
</ol>
<p class="nhan">Trong nhóm của bạn</p>
<p>Đây là thứ trưởng nhóm gặp khi merge <code>iter2</code> vào <code>main</code> sau khi đã có vài bản vá đi thẳng vào <code>main</code>. Hãy gỡ cùng với chủ nhân của cả hai thay đổi — trưởng nhóm không nên đoán dòng nào trong màn hình của người khác mới đúng.</p>`],
  [30, 'Check the changes with "git diff"',
    `<p class="y-chinh">🎯 <code>git diff</code> shows exactly what differs between two of the places Git keeps content: working tree, index, a commit, a branch.</p>
<table>
<thead><tr><th>Command</th><th>Compares</th></tr></thead>
<tbody>
<tr><td><code>git diff</code></td><td>index (staged) ↔ working tree: what you have <em>not</em> staged yet</td></tr>
<tr><td><code>git diff --staged</code> (= <code>--cached</code>)</td><td>last commit ↔ index: what the next commit will contain</td></tr>
<tr><td><code>git diff HEAD</code></td><td>last commit ↔ working tree: everything since the last commit</td></tr>
<tr><td><code>git diff da985 b325c</code></td><td>two commits (the first 7–8 hash characters are enough)</td></tr>
<tr><td><code>git diff maint</code> / <code>git diff branch1 branch2</code></td><td>your working tree ↔ another branch / two branches</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> run <code>git diff --staged</code> just before every commit — it is the commit you are about to make.</p>
<p class="ghi-chu">The slide's first line ("between last commit and the Index, or with Working if Index blank") is loose wording; the table above is the precise rule shown in its diagrams.</p>`,
    `<p class="y-chinh">🎯 <code>git diff</code> cho thấy chính xác khác biệt giữa hai nơi Git giữ nội dung: working tree, index, một commit, một nhánh.</p>
<table>
<thead><tr><th>Lệnh</th><th>So sánh</th></tr></thead>
<tbody>
<tr><td><code>git diff</code></td><td>index (đã stage) ↔ working tree: phần bạn <em>chưa</em> stage</td></tr>
<tr><td><code>git diff --staged</code> (= <code>--cached</code>)</td><td>commit cuối ↔ index: những gì commit tới sẽ chứa</td></tr>
<tr><td><code>git diff HEAD</code></td><td>commit cuối ↔ working tree: mọi thay đổi từ commit cuối</td></tr>
<tr><td><code>git diff da985 b325c</code></td><td>hai commit (7–8 ký tự đầu của hash là đủ)</td></tr>
<tr><td><code>git diff maint</code> / <code>git diff branch1 branch2</code></td><td>working tree ↔ một nhánh khác / hai nhánh</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chạy <code>git diff --staged</code> ngay trước mỗi lần commit — đó chính là commit bạn sắp tạo.</p>
<p class="ghi-chu">Dòng đầu trên slide ("giữa commit cuối và Index, hoặc với Working nếu Index trống") viết hơi lỏng; bảng trên là quy tắc chính xác mà các sơ đồ của slide thể hiện.</p>`],
]));
L.l15.push(walk(G, [
  [31, 'Manage git tags',
    `<p class="y-chinh">🎯 A tag can be created in the GitLab web UI — <strong>Repository → Tags → New tag</strong> — and its page URL is exactly the link you submit for an iteration.</p>
<p class="nhan">The New Tag form</p>
<ol>
<li><strong>Tag name</strong> — e.g. <code>iter1</code> (agree one pattern for the team: <code>iter1</code>, <code>iter2</code>, <code>iter3</code>).</li>
<li><strong>Create from</strong> — branch name, tag or commit SHA; normally <code>main</code> after the leader's final merge.</li>
<li><strong>Message</strong> — optional; leaving it blank makes a <em>lightweight</em> tag. Write one: it becomes an annotated tag with author and date.</li>
<li><strong>Release notes</strong> — optional; creates a public Release shown on the Releases page — list the screens delivered.</li>
</ol>
<p class="nhan">On the tag's details page you can</p>
<ul>
<li><strong>Copy the tag URL</strong> from the address bar — put it in the submission's links file.</li>
<li><strong>Attach or change files</strong> for the tag (e.g. the DB script, if it is not already in the tagged code).</li>
</ul>
<div class="pitfall">Tagging a branch that does not build, or tagging before the DB script is committed, submits a version the teacher cannot run. Build, run the script on an empty database, <em>then</em> tag.</div>`,
    `<p class="y-chinh">🎯 Có thể tạo tag ngay trên giao diện web GitLab — <strong>Repository → Tags → New tag</strong> — và URL trang của tag chính là link bạn nộp cho một iteration.</p>
<p class="nhan">Form New Tag</p>
<ol>
<li><strong>Tag name</strong> — vd. <code>iter1</code> (thống nhất một mẫu cho cả nhóm: <code>iter1</code>, <code>iter2</code>, <code>iter3</code>).</li>
<li><strong>Create from</strong> — tên nhánh, tag hoặc SHA của commit; thường là <code>main</code> sau lần merge cuối của trưởng nhóm.</li>
<li><strong>Message</strong> — không bắt buộc; để trống sẽ tạo tag <em>lightweight</em>. Hãy ghi: nó thành annotated tag có tác giả và ngày giờ.</li>
<li><strong>Release notes</strong> — không bắt buộc; tạo một Release công khai trên trang Releases — liệt kê các màn hình đã bàn giao.</li>
</ol>
<p class="nhan">Trên trang chi tiết của tag bạn có thể</p>
<ul>
<li><strong>Copy URL của tag</strong> trên thanh địa chỉ — dán vào file link của gói nộp bài.</li>
<li><strong>Đính kèm hoặc đổi file</strong> cho tag (vd. script DB, nếu nó chưa nằm trong code đã tag).</li>
</ul>
<div class="pitfall">Gắn tag cho một nhánh không build được, hoặc gắn tag trước khi commit script DB, là nộp một phiên bản giảng viên không chạy được. Build, chạy script trên database trống, <em>rồi mới</em> gắn tag.</div>`],
  [32, 'Q&A',
    `<p class="y-chinh">🎯 The deck ends with questions — bring yours to the lab slot, or ask in the team's Slack thread so the answer is recorded.</p>
<ul>
<li><strong>Git problem in class</strong> — paste the full command and its output (like the real outputs in this lesson), not "Git is broken".</li>
<li><strong>Requirement question</strong> — open a <code>Q&amp;A</code> issue on GitLab: the teacher is your customer, and the answer becomes part of the requirement.</li>
</ul>`,
    `<p class="y-chinh">🎯 Bộ slide kết thúc bằng phần hỏi đáp — mang câu hỏi của bạn tới buổi lab, hoặc hỏi trong thread Slack của nhóm để câu trả lời được lưu lại.</p>
<ul>
<li><strong>Vướng Git trên lớp</strong> — dán nguyên lệnh và output (như các output thật trong bài này), đừng chỉ nói "Git bị hỏng".</li>
<li><strong>Câu hỏi về yêu cầu</strong> — mở một issue <code>Q&amp;A</code> trên GitLab: giảng viên là khách hàng, và câu trả lời trở thành một phần của yêu cầu.</li>
</ul>`],
]));
const CONFLICT_RUN = `<pre># Member B, on branch main, after committing Req #15
$ git push
To &lt;team-repo&gt;
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to '&lt;team-repo&gt;'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.

$ git pull
   ec5c3d9..03cfb3d  main       -&gt; origin/main
Auto-merging web/common/header.jsp
CONFLICT (content): Merge conflict in web/common/header.jsp
Automatic merge failed; fix conflicts and then commit the result.

$ git status
On branch main
Your branch and 'origin/main' have diverged,
and have 1 and 1 different commits each, respectively.
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)
Unmerged paths:
  (use "git add &lt;file&gt;..." to mark resolution)
	both modified:   web/common/header.jsp</pre>
<pre>$ cat web/common/header.jsp
&lt;nav class="navbar"&gt;
  &lt;a href="home"&gt;Home&lt;/a&gt;
  &lt;a href="jobs"&gt;Find Jobs&lt;/a&gt;
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  &lt;a href="applications"&gt;My Applications&lt;/a&gt;
=======
  &lt;a href="job/post"&gt;Post a Job&lt;/a&gt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; 03cfb3de5600b4c584eb4db536fd1620a70626b9
&lt;/nav&gt;</pre>
<pre># after editing: keep BOTH links, delete the 3 marker lines
$ git add web/common/header.jsp
$ git commit -m "merge: keep both header links (#12, #15)"
[main c484cd0] merge: keep both header links (#12, #15)
$ git push
   03cfb3d..c484cd0  main -&gt; main

$ git log --oneline --graph
*   c484cd0 merge: keep both header links (#12, #15)
|\\
| * 03cfb3d feat(job): add 'Post a Job' link to header (#12)
* | 38c7f06 feat(application): add 'My Applications' link to header (#15)
|/
* ec5c3d9 chore: project skeleton with common header</pre>`;
L.l15.push(bi(`<h3>Worked example — a real conflict in the shared header, resolved</h3>
<p>Job-IT system, iteration 2. The leader pushed a skeleton with a common <code>header.jsp</code>. <strong>Member A</strong> (Req #12 "Post a Job") and <strong>Member B</strong> (Req #15 "My Applications") both add a menu link on the same line. A pushes first. Everything below was run on Git 2.51 and copied as printed (only the remote path is shortened to <code>&lt;team-repo&gt;</code>).</p>
${CONFLICT_RUN}
<p class="nhan">What happened, step by step</p>
<ol>
<li><strong>Push rejected</strong> — "fetch first": GitLab has A's commit that B does not have. Nothing is broken.</li>
<li><strong>Pull = fetch + merge</strong> — Git merges automatically where it can; here both changed the same line, so it stops.</li>
<li><strong>Read the markers</strong> — HEAD (B's own line) is above <code>=======</code>, the incoming commit (A's line) below.</li>
<li><strong>Decide with the other owner</strong> — the menu needs both links, so keep both, in a sensible order, and delete the three marker lines.</li>
<li><strong>add → commit → push</strong> — the merge commit <code>c484cd0</code> has two parents; the graph shows the fork and the join.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Three ways teams ruin a conflict.</strong> Committing the file with the <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> markers still inside (the JSP then prints them on every page); keeping only "my" side and silently deleting a teammate's screen link; "solving" it with <code>git push --force</code> — which the protected branch blocks, for good reason.</div>
<p class="meo">🧠 <strong>Remember:</strong> fewer conflicts = pull often, commit small, and give shared files (header, DB script) one owner who merges requests from others.</p>`,
`<h3>Ví dụ có lời giải — một xung đột thật trong header dùng chung, và cách gỡ</h3>
<p>Hệ thống Job-IT, iteration 2. Trưởng nhóm đã push bộ khung có <code>header.jsp</code> dùng chung. <strong>Member A</strong> (Req #12 "Post a Job") và <strong>Member B</strong> (Req #15 "My Applications") cùng thêm một link menu vào đúng một dòng. A push trước. Toàn bộ phần dưới được chạy thật trên Git 2.51 và chép nguyên văn (chỉ rút gọn đường dẫn remote thành <code>&lt;team-repo&gt;</code>).</p>
${CONFLICT_RUN}
<p class="nhan">Chuyện gì đã xảy ra, từng bước</p>
<ol>
<li><strong>Push bị từ chối</strong> — "fetch first": GitLab có commit của A mà B chưa có. Không có gì hỏng cả.</li>
<li><strong>Pull = fetch + merge</strong> — Git tự gộp được chỗ nào thì gộp; ở đây cả hai sửa cùng một dòng nên nó dừng lại.</li>
<li><strong>Đọc các dòng đánh dấu</strong> — HEAD (dòng của chính B) nằm trên <code>=======</code>, commit đi vào (dòng của A) nằm dưới.</li>
<li><strong>Quyết định cùng người kia</strong> — menu cần cả hai link, nên giữ cả hai theo thứ tự hợp lý, và xoá ba dòng đánh dấu.</li>
<li><strong>add → commit → push</strong> — merge commit <code>c484cd0</code> có hai cha; đồ thị cho thấy chỗ rẽ và chỗ nhập.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Ba cách nhóm làm hỏng một xung đột.</strong> Commit file mà vẫn còn các dòng <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> bên trong (trang JSP in chúng ra ở mọi trang); chỉ giữ phía "của mình" và lặng lẽ xoá link màn hình của đồng đội; "giải quyết" bằng <code>git push --force</code> — thứ nhánh bảo vệ đã chặn, và chặn là đúng.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ít xung đột = pull thường xuyên, commit nhỏ, và giao file dùng chung (header, script DB) cho một người phụ trách, người khác gửi yêu cầu cho người đó gộp.</p>`));
L.l15.push(bi(`<h3>Branch strategy for a team of 4–5</h3>
<p>The teacher's protection rules (push = Developers + Maintainers, merge = Maintainers, on <code>main</code> and <code>iter*</code>) support two workable set-ups. Agree on one in week 1 and write it in the README.</p>
<table>
<thead><tr><th></th><th>A · Shared <code>main</code> (the member guide)</th><th>B · Iteration + feature branches (recommended)</th></tr></thead>
<tbody>
<tr><td>Branches</td><td><code>main</code> only</td><td><code>main</code> = last submitted version; <code>iter2</code> = this iteration; <code>feature/12-post-job</code> per Req</td></tr>
<tr><td>Daily work</td><td>pull → commit → pull → push to <code>main</code></td><td>commit on your feature branch; push it; open a merge request into <code>iter2</code></td></tr>
<tr><td>Who merges</td><td>nobody — Git merges on pull</td><td>the leader merges each MR into <code>iter2</code>; at the end merges <code>iter2</code> into <code>main</code></td></tr>
<tr><td>Good for</td><td>teams new to Git, iteration 1</td><td>iterations 2–3, when a broken screen must not block the demo</td></tr>
</tbody>
</table>
<p class="nhan">Set-up B in commands</p>
<pre># leader, first day of iteration 2
git switch main &amp;&amp; git pull
git switch -c iter2 &amp;&amp; git push -u origin iter2

# member, for Req #12
git switch iter2 &amp;&amp; git pull
git switch -c feature/12-post-job
# ... commits ...
git push -u origin feature/12-post-job
# GitLab: Merge requests → New → source feature/12-post-job, target iter2
#         description "Closes #12"; leader reviews and merges; delete branch</pre>
<div class="pitfall co-tieu-de"><strong>Long-lived personal branches.</strong> A branch per <em>person</em> ("branch-of-A") that lives the whole iteration and merges on the last night gives one giant conflict. Branch per <em>Req</em>, keep it 1–3 days, merge often.</div>
<h3>Tagging each iteration's submission</h3>
<ol>
<li><strong>Freeze</strong> — all MRs merged; every Req of the milestone at 3_Done or Closed.</li>
<li><strong>Merge &amp; verify</strong> — leader merges <code>iter2</code> into <code>main</code>, builds in NetBeans, runs the DB script (in <code>/database</code>) on an empty MySQL schema, clicks through each member's screens.</li>
<li><strong>Tag</strong> — <code>git tag -a iter2 -m "Iteration 2 submission: 14 screens, DB script /database/jobit.sql"</code> then <code>git push origin iter2</code> (or Repository → Tags → New tag).</li>
<li><strong>Submit the link</strong> — copy the tag page URL into the links file with each member's demo video, next to the Project Tracking xlsx and the RDS.</li>
</ol>
<pre>$ git tag -a iter1 -m "Iteration 1 submission: 8 screens, DB script in /database"
$ git push origin iter1
 * [new tag]         iter1 -&gt; iter1</pre>
<p class="ghi-chu">A tag is permanent evidence of what you delivered on the date. Found a bug after tagging? Fix it on the next iteration's branch — never move or re-create the tag.</p>
<div class="callout"><strong>★ Beyond the syllabus — Git Flow vs trunk-based.</strong> Set-up B is a small <em>Git Flow</em>: long-lived <code>main</code> plus release (iteration) branches. Fast-moving companies prefer <em>trunk-based development</em>: tiny branches merged into <code>main</code> several times a day, unfinished features hidden behind <em>feature flags</em>, and CI tests on every merge request. Knowing why each model exists is a good answer when a presentation reviewer asks about your process.</div>`,
`<h3>Chiến lược nhánh cho nhóm 4–5 người</h3>
<p>Luật bảo vệ của giảng viên (push = Developers + Maintainers, merge = Maintainers, trên <code>main</code> và <code>iter*</code>) hỗ trợ hai cách tổ chức dùng được. Thống nhất một cách ngay tuần 1 và ghi vào README.</p>
<table>
<thead><tr><th></th><th>A · Dùng chung <code>main</code> (theo hướng dẫn thành viên)</th><th>B · Nhánh iteration + nhánh tính năng (khuyến nghị)</th></tr></thead>
<tbody>
<tr><td>Các nhánh</td><td>chỉ <code>main</code></td><td><code>main</code> = bản đã nộp gần nhất; <code>iter2</code> = iteration hiện tại; <code>feature/12-post-job</code> cho mỗi Req</td></tr>
<tr><td>Làm hằng ngày</td><td>pull → commit → pull → push lên <code>main</code></td><td>commit trên nhánh tính năng của mình; push; mở merge request vào <code>iter2</code></td></tr>
<tr><td>Ai merge</td><td>không ai — Git tự gộp khi pull</td><td>trưởng nhóm merge từng MR vào <code>iter2</code>; cuối iteration merge <code>iter2</code> vào <code>main</code></td></tr>
<tr><td>Hợp với</td><td>nhóm mới dùng Git, iteration 1</td><td>iteration 2–3, khi một màn hình hỏng không được làm hỏng buổi demo</td></tr>
</tbody>
</table>
<p class="nhan">Cách B bằng lệnh</p>
<pre># trưởng nhóm, ngày đầu iteration 2
git switch main &amp;&amp; git pull
git switch -c iter2 &amp;&amp; git push -u origin iter2

# thành viên, cho Req #12
git switch iter2 &amp;&amp; git pull
git switch -c feature/12-post-job
# ... các commit ...
git push -u origin feature/12-post-job
# GitLab: Merge requests → New → source feature/12-post-job, target iter2
#         mô tả "Closes #12"; trưởng nhóm review và merge; xoá nhánh</pre>
<div class="pitfall co-tieu-de"><strong>Nhánh cá nhân sống quá lâu.</strong> Mỗi <em>người</em> một nhánh ("nhanh-cua-A") sống suốt iteration rồi merge vào đêm cuối sẽ sinh ra một xung đột khổng lồ. Mỗi <em>Req</em> một nhánh, giữ 1–3 ngày, merge thường xuyên.</div>
<h3>Gắn tag cho bài nộp mỗi iteration</h3>
<ol>
<li><strong>Chốt</strong> — mọi MR đã merge; mọi Req của milestone ở 3_Done hoặc Closed.</li>
<li><strong>Merge &amp; kiểm tra</strong> — trưởng nhóm merge <code>iter2</code> vào <code>main</code>, build trong NetBeans, chạy script DB (trong <code>/database</code>) trên một schema MySQL trống, bấm thử màn hình của từng thành viên.</li>
<li><strong>Gắn tag</strong> — <code>git tag -a iter2 -m "Iteration 2 submission: 14 screens, DB script /database/jobit.sql"</code> rồi <code>git push origin iter2</code> (hoặc Repository → Tags → New tag).</li>
<li><strong>Nộp link</strong> — copy URL trang của tag vào file link cùng video demo của từng thành viên, bên cạnh file Project Tracking xlsx và RDS.</li>
</ol>
<pre>$ git tag -a iter1 -m "Iteration 1 submission: 8 screens, DB script in /database"
$ git push origin iter1
 * [new tag]         iter1 -&gt; iter1</pre>
<p class="ghi-chu">Tag là bằng chứng vĩnh viễn về thứ bạn đã bàn giao vào ngày đó. Phát hiện lỗi sau khi gắn tag? Sửa trên nhánh của iteration sau — đừng bao giờ dời hay tạo lại tag.</p>
<div class="callout"><strong>★ Ngoài giáo trình — Git Flow và trunk-based.</strong> Cách B là một <em>Git Flow</em> thu nhỏ: <code>main</code> sống lâu cộng các nhánh phát hành (iteration). Các công ty đi nhanh chuộng <em>trunk-based development</em>: nhánh rất ngắn, merge vào <code>main</code> nhiều lần mỗi ngày, tính năng chưa xong được giấu sau <em>feature flag</em>, và CI chạy test trên mọi merge request. Hiểu vì sao mỗi mô hình tồn tại là một câu trả lời tốt khi giám khảo buổi thuyết trình hỏi về quy trình của nhóm.</div>`));
L.l15.push(books([
  ['progit', 'Ch. 3 "Git Branching" (3.2 Basic branching and merging, 3.4 Branching workflows), Ch. 2.6 "Tagging"', 'Chương 3 "Git Branching" (3.2 Basic branching and merging, 3.4 Branching workflows), mục 2.6 "Tagging"'],
  ['sommerville', 'Ch. 25 "Configuration management" (25.2 System building, 25.4 Release management)', 'Chương 25 "Configuration management" (25.2 System building, 25.4 Release management)'],
]));

/* ═══════════════════════ Quiz 1 ═══════════════════════ */
const Q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, explanation });
const QUIZ = [
  Q("According to the Subject Guides, an SWP391 team is…|||Theo Subject Guides, một nhóm SWP391 gồm…",
    ["2–3 students building a mobile app|||2–3 sinh viên làm một app di động", "4–5 students building one web system, recommended a management system|||4–5 sinh viên xây một hệ thống web, khuyến nghị là hệ thống quản lý", "8–10 students building several small tools|||8–10 sinh viên làm nhiều công cụ nhỏ", "one student with a mentor|||một sinh viên và một mentor"],
    1, "Slide 2 of the Subject Guides: teams of 4-5 students complete one specific web system, recommended to be a management system.|||Slide 2 của Subject Guides: nhóm 4-5 sinh viên hoàn thành một hệ thống web cụ thể, khuyến nghị là hệ thống quản lý."),
  Q("What are the weights of Iteration 1, Iteration 2, Iteration 3 and the Final Presentation?|||Trọng số của Iteration 1, Iteration 2, Iteration 3 và Final Presentation là bao nhiêu?",
    ["25% / 25% / 25% / 25%|||25% / 25% / 25% / 25%", "10% / 20% / 30% / 40%|||10% / 20% / 30% / 40%", "15% / 20% / 25% / 40%|||15% / 20% / 25% / 40%", "20% / 20% / 20% / 40%|||20% / 20% / 20% / 40%"],
    2, "Iter1 15%, Iter2 20%, Iter3 25% (final package) and the Final Presentation 40%, judged by 2 other teachers.|||Iter1 15%, Iter2 20%, Iter3 25% (gói cuối) và Final Presentation 40%, do 2 giảng viên khác chấm."),
  Q("Which is NOT one of the conditions to pass SWP391?|||Điều nào KHÔNG phải là điều kiện qua môn SWP391?",
    ["Attendance of at least 80% of slots|||Điểm danh ít nhất 80% số slot", "OG = (iter1*15% + iter2*20% + iter3*25%) / 60% at least 5|||OG = (iter1*15% + iter2*20% + iter3*25%) / 60% từ 5 trở lên", "Final Presentation grade at least 5|||Điểm Final Presentation từ 5 trở lên", "Every member must pass a written Git exam|||Mọi thành viên phải qua một bài thi Git trên giấy"],
    3, "The guides list attendance >= 80%, OG >= 5, Final Presentation >= 5 and no cheating. There is no written Git exam.|||Hướng dẫn liệt kê điểm danh >= 80%, OG >= 5, Final Presentation >= 5 và không gian lận. Không có bài thi Git trên giấy."),
  Q("What role does the class teacher play in the project?|||Giảng viên lớp đóng vai trò gì trong dự án?",
    ["Only a grader who never discusses requirements|||Chỉ chấm điểm, không bàn về yêu cầu", "Coach/mentor and customer/PO — the final point to confirm requirements|||Coach/mentor và khách hàng/PO — người chốt cuối cùng về yêu cầu", "A team member who codes one screen|||Một thành viên nhóm, code một màn hình", "The Scrum Master of every team|||Scrum Master của mọi nhóm"],
    1, "Subject Guides slide 5: the teacher acts as both coach/mentor and customer/PO, the final point to confirm or clarify requirements.|||Subject Guides slide 5: giảng viên vừa là coach/mentor vừa là khách hàng/PO, người chốt cuối cùng khi xác nhận hay làm rõ yêu cầu."),
  Q("In each iteration, what does each member do?|||Trong mỗi iteration, mỗi thành viên làm gì?",
    ["Only testing for the whole team|||Chỉ test cho cả nhóm", "Only the database|||Chỉ làm database", "Requirement, design and full-stack code for his or her own 3–4 screens/functions|||Yêu cầu, thiết kế và code full-stack cho 3–4 màn hình/chức năng của chính mình", "Only the final report|||Chỉ viết báo cáo cuối"],
    2, "Each member gets 3-4 screens/functions per iteration (iteration 3 included) and does their requirement, design and full-stack code. LOC is graded individually.|||Mỗi thành viên nhận 3-4 màn hình/chức năng mỗi iteration (kể cả iteration 3) và tự làm yêu cầu, thiết kế, code full-stack. LOC được chấm từng cá nhân."),
  Q("A team of 5 plans a system with 15 screens in total. What is the problem?|||Nhóm 5 người dự định làm hệ thống có tổng cộng 15 màn hình. Vấn đề là gì?",
    ["No problem, smaller is always safer|||Không sao, nhỏ luôn an toàn hơn", "It is too small: 5 members x 3 screens x 3 iterations needs about 45 screens|||Quá nhỏ: 5 người x 3 màn hình x 3 iteration cần khoảng 45 màn hình", "It is too big for SWP391|||Quá lớn so với SWP391", "Screens do not matter, only documents are graded|||Số màn hình không quan trọng, chỉ chấm tài liệu"],
    1, "The product must give each member 3-4 different screens in each iteration, so 5 x 3 x 3 = 45 at the very least.|||Sản phẩm phải đủ để mỗi người có 3-4 màn hình khác nhau trong mỗi iteration, nên tối thiểu 5 x 3 x 3 = 45."),
  Q("In the GitLab project, which role should the team leader have?|||Trong project GitLab, trưởng nhóm nên có vai trò gì?",
    ["Owner|||Owner", "Maintainer|||Maintainer", "Developer|||Developer", "Guest|||Guest"],
    1, "The owner (the teacher) invites the team leader as Maintainer; the maintainer then invites the members as Developers (Slide5 page 6).|||Owner (giảng viên) mời trưởng nhóm với vai trò Maintainer; maintainer mời các thành viên với vai trò Developer (Slide5 trang 6)."),
  Q("What protected-branch setting does the guide ask for on main (and iter*)?|||Hướng dẫn yêu cầu thiết lập nhánh bảo vệ nào cho main (và iter*)?",
    ["Only the teacher can push|||Chỉ giảng viên được push", "Developers + Maintainers can push, only Maintainers can merge, force push off|||Developers + Maintainers được push, chỉ Maintainers được merge, tắt force push", "Everyone can force push|||Ai cũng được force push", "Nobody can push, only merge requests|||Không ai được push, chỉ merge request"],
    1, "Settings, Repository, Protected branches: Developers and Maintainers are allowed to push while only Maintainers can merge; force push stays disabled.|||Settings, Repository, Protected branches: Developers và Maintainers được push, chỉ Maintainers được merge; force push để tắt."),
  Q("The teacher finds a bug in your submitted iteration. Which label does the issue get?|||Giảng viên phát hiện lỗi trong bản iteration đã nộp. Issue đó mang label nào?",
    ["Defect|||Defect", "Leakage|||Leakage", "Q&A|||Q&A", "Task|||Task"],
    1, "Leakage = error found by the customer/teacher after submission. Defect = error the team found itself.|||Leakage = lỗi do khách hàng/giảng viên phát hiện sau khi nộp. Defect = lỗi đội dự án tự phát hiện."),
  Q("What does a Req issue represent?|||Một issue Req đại diện cho điều gì?",
    ["A question for the teacher|||Một câu hỏi cho giảng viên", "Any small activity like writing minutes|||Mọi việc nhỏ như viết biên bản", "One screen or function that can be assigned wholly to one person|||Một màn hình hoặc chức năng có thể giao trọn cho một người", "A bug in the code|||Một lỗi trong code"],
    2, "Req: a requirement to solve, one specific screen or function assignable entirely to one person in charge.|||Req: yêu cầu cần giải quyết, một màn hình hoặc chức năng cụ thể giao trọn cho một người phụ trách."),
  Q("What does the label 3_Done mean in the teacher's scheme?|||Label 3_Done có nghĩa gì trong bộ label của giảng viên?",
    ["The issue is closed and archived|||Issue đã đóng và lưu trữ", "Solved, but it must be checked again before it is Closed|||Đã giải quyết, nhưng cần kiểm tra lại trước khi đóng (Closed)", "Not started yet|||Chưa bắt đầu", "Rejected by the teacher|||Bị giảng viên từ chối"],
    1, "3_Done: the work is solved and needs to be checked before closing. 1_To Do = to be solved, 2_Doing = in progress.|||3_Done: công việc đã giải quyết, cần kiểm tra lại để đóng. 1_To Do = cần giải quyết, 2_Doing = đang giải quyết."),
  Q("How should GitLab milestones be used in SWP391?|||Nên dùng milestone của GitLab thế nào trong SWP391?",
    ["One milestone per member|||Mỗi thành viên một milestone", "One milestone per iteration, with the Req issues of that iteration attached|||Mỗi iteration một milestone, gắn các issue Req của iteration đó", "One milestone per file|||Mỗi file một milestone", "Milestones are not used|||Không dùng milestone"],
    1, "The teacher creates milestones for the iterations; each Req is attached to the iteration in which it is delivered, so the milestone shows open vs closed work.|||Giảng viên tạo milestone cho các iteration; mỗi Req gắn vào iteration mà nó được bàn giao, nên milestone cho thấy việc còn mở và đã đóng."),
  Q("Which item is part of each iteration's submission package?|||Mục nào thuộc gói nộp bài của mỗi iteration?",
    ["A zip of the NetBeans folder sent by e-mail|||File zip thư mục NetBeans gửi qua e-mail", "The link to the GitLab tag of the iteration's source code, with the DB script in the tagged code|||Link tới tag GitLab của mã nguồn iteration, script DB nằm trong code đã tag", "Only the demo video of the leader|||Chỉ video demo của trưởng nhóm", "Screenshots of the Slack chat|||Ảnh chụp đoạn chat Slack"],
    1, "Each iteration: Project Tracking xlsx, RDS document, links to each member's demo video and to the tagged source on GitLab (DB scripts added to the tagged code).|||Mỗi iteration: Project Tracking xlsx, tài liệu RDS, link video demo của từng thành viên và link tag mã nguồn trên GitLab (script DB nằm trong code đã tag)."),
  Q("You create a new file faq.jsp and run git status. How is it listed?|||Bạn tạo file mới faq.jsp rồi chạy git status. Nó được liệt kê thế nào?",
    ["Staged, as new file|||Staged, dạng new file", "Untracked|||Untracked", "Modified|||Modified", "Deleted|||Deleted"],
    1, "A new file in the working folder is Untracked until you run git add; git add makes it Tracked and Staged at once.|||File mới trong thư mục làm việc là Untracked cho tới khi bạn git add; git add làm nó vừa Tracked vừa Staged."),
  Q("You run git add faq.jsp, then edit faq.jsp again, then git commit without adding. What is committed?|||Bạn chạy git add faq.jsp, rồi sửa faq.jsp tiếp, rồi git commit mà không add lại. Commit chứa gì?",
    ["The newest content including the last edit|||Nội dung mới nhất kể cả lần sửa cuối", "The snapshot taken at the last git add, without the later edit|||Ảnh chụp lúc git add cuối, không có lần sửa sau", "Nothing, the commit fails|||Không gì cả, commit thất bại", "Only the edit, without the original content|||Chỉ phần sửa, không có nội dung gốc"],
    1, "git add stores a snapshot in the staging area; later edits show as 'Changes not staged for commit' and are not included until you add again.|||git add lưu một ảnh chụp vào staging area; phần sửa sau hiện ở 'Changes not staged for commit' và không được đưa vào cho tới khi add lại."),
  Q("Which command stops Git tracking db.properties but keeps the file on your disk?|||Lệnh nào khiến Git ngừng theo dõi db.properties nhưng vẫn giữ file trên đĩa?",
    ["rm db.properties|||rm db.properties", "git rm -f db.properties|||git rm -f db.properties", "git rm --cached db.properties|||git rm --cached db.properties", "git reset --hard|||git reset --hard"],
    2, "git rm --cached removes the file from the index only; plain rm and git rm -f delete it from disk. Add a .gitignore line so it is not tracked again.|||git rm --cached chỉ gỡ file khỏi index; rm và git rm -f xoá file khỏi đĩa. Thêm một dòng .gitignore để nó không bị theo dõi lại."),
  Q("You committed too early and have not pushed. Which command undoes the commit but keeps the changes staged?|||Bạn commit quá sớm và chưa push. Lệnh nào huỷ commit nhưng giữ các thay đổi ở trạng thái staged?",
    ["git reset --hard HEAD~1|||git reset --hard HEAD~1", "git reset --soft HEAD~1|||git reset --soft HEAD~1", "git push --force|||git push --force", "git checkout -- .|||git checkout -- ."],
    1, "--soft undoes the commit and leaves its changes staged; mixed (default) unstages them; --hard throws them away.|||--soft huỷ commit và để nguyên thay đổi ở staged; mixed (mặc định) bỏ stage; --hard vứt bỏ luôn."),
  Q("git push prints '! [rejected] main -> main (fetch first)'. What should you do?|||git push in ra '! [rejected] main -> main (fetch first)'. Bạn nên làm gì?",
    ["git push --force to overwrite the remote|||git push --force để ghi đè remote", "git pull, resolve any conflict, commit, then push again|||git pull, gỡ xung đột nếu có, commit, rồi push lại", "Delete the local repo and clone again|||Xoá local repo và clone lại", "Ask the teacher to unprotect main|||Nhờ giảng viên gỡ bảo vệ main"],
    1, "The remote has commits you do not have. Pull first (fetch + merge), fix conflicts by hand, add, commit and push. Force push would delete teammates' work and is disabled on protected branches.|||Remote có commit bạn chưa có. Pull trước (fetch + merge), sửa xung đột bằng tay, add, commit rồi push. Force push sẽ xoá công của đồng đội và bị tắt trên nhánh bảo vệ."),
  Q("In a conflicted file, what is between '<<<<<<< HEAD' and '======='?|||Trong file bị xung đột, phần nằm giữa '<<<<<<< HEAD' và '=======' là gì?",
    ["The incoming change from the remote|||Thay đổi đi vào từ remote", "Your own current version|||Phiên bản hiện tại của chính bạn", "The original version before both changes|||Phiên bản gốc trước cả hai thay đổi", "A comment added by GitLab|||Một chú thích do GitLab thêm"],
    1, "HEAD is your side; the part after ======= up to >>>>>>> is the incoming commit or branch. You edit to the final text and delete all marker lines.|||HEAD là phía của bạn; phần sau ======= tới >>>>>>> là commit hoặc nhánh đi vào. Bạn sửa thành nội dung cuối và xoá hết các dòng đánh dấu."),
  Q("What does git diff --staged show?|||git diff --staged cho thấy gì?",
    ["Differences between two branches|||Khác biệt giữa hai nhánh", "Differences between the last commit and the staging area — what the next commit will contain|||Khác biệt giữa commit cuối và staging area — những gì commit tới sẽ chứa", "Unstaged changes in the working tree|||Thay đổi chưa stage trong working tree", "The list of tags|||Danh sách tag"],
    1, "--staged (same as --cached) compares HEAD with the index. Plain git diff compares the index with the working tree.|||--staged (giống --cached) so sánh HEAD với index. git diff thường so sánh index với working tree."),
  Q("Which command creates a new branch and switches to it?|||Lệnh nào tạo nhánh mới và chuyển sang nhánh đó?",
    ["git branch -a|||git branch -a", "git checkout -b feature/12-post-job|||git checkout -b feature/12-post-job", "git merge feature/12-post-job|||git merge feature/12-post-job", "git branch -d feature/12-post-job|||git branch -d feature/12-post-job"],
    1, "git checkout -b (or git switch -c) creates and switches. git branch -a lists, git merge merges into the current branch, git branch -d deletes.|||git checkout -b (hoặc git switch -c) tạo và chuyển sang. git branch -a liệt kê, git merge gộp vào nhánh hiện tại, git branch -d xoá."),
  Q("What is the key difference between a tag and a branch?|||Khác biệt cốt lõi giữa tag và nhánh là gì?",
    ["A tag can hold more files|||Tag chứa được nhiều file hơn", "A tag never moves after it is created; a branch pointer moves with each new commit|||Tag không bao giờ di chuyển sau khi tạo; con trỏ nhánh di chuyển theo mỗi commit mới", "A tag is only local and cannot be pushed|||Tag chỉ ở local, không push được", "Branches cannot be merged, tags can|||Nhánh không merge được, tag thì được"],
    1, "Slide 27: a tag is like a branch that does not change and is used to mark release points — which is why it is the right thing to submit for each iteration.|||Slide 27: tag giống một nhánh không thay đổi, dùng để đánh dấu mốc phát hành — vì vậy nó là thứ đúng để nộp cho mỗi iteration."),
  Q("Which commit message follows the team convention best?|||Commit message nào theo đúng quy ước của nhóm nhất?",
    ["update|||update", "final final v2|||final final v2", "feat(job-post): add Post a Job form with salary validation (#12)|||feat(job-post): add Post a Job form with salary validation (#12)", "fixed stuff from yesterday|||fixed stuff from yesterday"],
    2, "Type(scope): what changed, plus the issue number, so the teacher can link the commit to a screen and its owner.|||Type(scope): thay đổi gì, cộng số issue, để giảng viên nối commit với một màn hình và người phụ trách."),
  Q("In the teacher's Claude_Prompts.txt workflow, what does prompt #1 ask the AI to do?|||Trong quy trình Claude_Prompts.txt của giảng viên, prompt #1 yêu cầu AI làm gì?",
    ["Write the MySQL scripts directly|||Viết thẳng script MySQL", "Act as a senior BA, ask clarifying questions, then write the PRD from the answers|||Đóng vai senior BA, đặt câu hỏi làm rõ, rồi viết PRD từ câu trả lời", "Generate the final presentation|||Sinh slide thuyết trình cuối", "Write unit tests|||Viết unit test"],
    1, "Prompt 1 is the senior-BA Q&A that produces the PRD; later prompts build on it: context diagram, business flows, use cases, ERD and traceability, UI spec, DB, TDS, test cases.|||Prompt 1 là phần hỏi đáp kiểu senior BA sinh ra PRD; các prompt sau dựa trên nó: context diagram, business flow, use case, ERD và traceability, UI spec, DB, TDS, test case."),
  Q("On a shared lab PC, git push goes out under a previous student's account. What does the GitLab Student Guide tell you to do?|||Trên máy lab dùng chung, git push chạy dưới tài khoản của sinh viên trước. GitLab Student Guide bảo bạn làm gì?",
    ["Push anyway, GitLab will fix the author|||Cứ push, GitLab sẽ tự sửa tác giả", "Delete the stored gitlab entry in Windows Credential Manager, then sign in with your own account in the browser|||Xoá mục gitlab đã lưu trong Windows Credential Manager, rồi đăng nhập bằng tài khoản của chính bạn trên trình duyệt", "Create a new GitLab project|||Tạo một project GitLab mới", "Use git push --force|||Dùng git push --force"],
    1, "Part D: log out the other account via Control Panel, Credential Manager, Windows Credentials, Generic Credentials; the next pull shows 'Connect to GitLab', choose Sign in with your browser and authorize Git Credential Manager.|||Phần D: đăng xuất tài khoản khác qua Control Panel, Credential Manager, Windows Credentials, Generic Credentials; lần pull sau hiện 'Connect to GitLab', chọn Sign in with your browser và cấp quyền cho Git Credential Manager."),
];

export default {
  title: 'Chapter 1 — Kickoff: topic, team, tools, GitLab & tracking|||Chương 1 — Khởi động: đề tài, nhóm, công cụ, GitLab & theo dõi tiến độ',
  description: 'Chọn đề tài vừa sức, hiểu vai trò thật trong nhóm, cài công cụ, dựng GitLab (vai trò, nhánh bảo vệ, 8 label, milestone), dùng Git hằng ngày, gỡ xung đột, chiến lược nhánh và gắn tag nộp mỗi iteration.',
  lessons: [
    { title: '1.1 — Topic, team, roles & tools: how SWP391 really runs|||1.1 — Đề tài, nhóm, vai trò & công cụ: SWP391 thật sự chạy thế nào', slug: 'swp391-1-1-de-tai-nhom-vai-tro', type: 'VIDEO',
      description: 'Ba iteration, mỗi người full-stack 3–4 màn hình; kiểm tra kích cỡ đề tài bằng số liệu nhóm mẫu G5; vai trò giảng viên/trưởng nhóm/thành viên; bảng công cụ; những gì phải có trước iteration 1 và gói nộp mỗi iteration.', content: L.l11.join('\n') },
    { title: '1.2 — The team AI playbook (Claude_Prompts) & why everything lives in Git|||1.2 — Bộ quy trình AI của nhóm (Claude_Prompts) & vì sao mọi thứ nằm trong Git', slug: 'swp391-1-2-ai-sdlc-git-workflow', type: 'VIDEO',
      description: 'Slide5 trang 1–2: 9 prompt của giảng viên từ PRD tới test case, quy tắc dùng AI và AI Usage Report, version control là gì, luật Git của nhóm trong một màn hình.', content: L.l12.join('\n') },
    { title: '1.3 — GitLab project setup: repo, members, protected branches, labels & milestones|||1.3 — Dựng project GitLab: repo, thành viên, nhánh bảo vệ, label & milestone', slug: 'swp391-1-3-gitlab-setup-du-an', type: 'VIDEO',
      description: 'Slide5 trang 3–7 và GitLab Student Guide trang 1–2: tạo repo, mời thành viên, bảo vệ main/iter*, checklist tuần 1, 8 label, milestone = iteration, ví dụ một issue Req cho một màn hình.', content: L.l13.join('\n') },
    { title: '1.4 — Git client & the daily cycle: status, add, commit, push|||1.4 — Git client & vòng làm việc hằng ngày: status, add, commit, push', slug: 'swp391-1-4-git-client-commit-push', type: 'VIDEO',
      description: 'Slide5 trang 8–25 và GitLab Student Guide trang 3–5: cấu hình Git, clone, .gitignore, bốn trạng thái file (output Git 2.51 thật), commit/amend/reset, checkout/restore, push, đổi tài khoản, quy ước commit message.', content: L.l14.join('\n') },
    { title: '1.5 — Conflicts, branches, diff & tagging each iteration|||1.5 — Xung đột, nhánh, diff & gắn tag mỗi iteration', slug: 'swp391-1-5-nhanh-xung-dot-tag', type: 'VIDEO',
      description: 'Slide5 trang 26–32: xung đột khi push và khi merge, lệnh nhánh, git diff, tag trên GitLab; ví dụ xung đột thật có lệnh và output, chiến lược nhánh cho 4–5 người, quy trình gắn tag nộp bài.', content: L.l15.join('\n') },
    { title: 'Quiz 1 — Team, roles, tools, Git & GitLab|||Quiz 1 — Nhóm, vai trò, công cụ, Git & GitLab', slug: 'swp391-quiz-1', type: 'QUIZ',
      description: 'Kiểm tra 25 câu về nhóm, vai trò, điều kiện qua môn, GitLab (vai trò, nhánh bảo vệ, label, milestone), lệnh Git, xung đột, tag và quy trình AI.',
      quiz: { timeLimitSeconds: 1800, questions: QUIZ } },
  ],
};
