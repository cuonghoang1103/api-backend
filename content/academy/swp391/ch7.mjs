/**
 * SWP391 · Chapter 7 — Teamwork, the RDS / final report & the final presentation (40%).
 * Sources: Slide1 Subject Guides + SWP391 Student Guides (grading, teacher's role),
 * Slide6 Presentation (deck g-present, 9 pages), Template7 Project Presentation
 * (deck t-present, 9 pages), Template5 AI Usage Report, Template6 Weekly Report,
 * the G5 sample RDS (STRUCTURE only — the page-by-page walkthrough lives in the
 * Sample project section) and a real capstone final report (deck cap, a curated
 * set of published pages; no person is ever named).
 * Lessons:
 *   7.1 Teamwork, coach & customer, weekly report, contribution, integrity & AI  (no deck)
 *   7.2 Final presentation guide — how the 2 examiners grade                      g-present 1–9
 *   7.3 Template7 slide by slide + run-sheet, demo script, Q&A, rehearsal         t-present 1–9
 *   7.4 The RDS document — structure of a real one                               (no deck)
 *   7.5 Reading a real capstone final report                                     cap (18 pages)
 *   Quiz 7
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

/* ─────────────────────── 7.1 Teamwork & integrity ─────────────────────── */
const L71 = {
  title: '7.1 — Teamwork: coach & customer, weekly report, contribution, integrity & AI|||7.1 — Làm việc nhóm: coach & khách hàng, báo cáo tuần, đóng góp, liêm chính & AI',
  slug: 'swp391-7-1-teamwork-ethics',
  type: 'VIDEO',
  description: 'Vai trò kép của giảng viên (coach + customer/PO), nhịp làm việc mỗi iteration, Weekly Report (Template6) từng cột, chứng minh đóng góp cá nhân, xử lý xung đột, liêm chính học thuật và AI Usage Report (Template5).',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.1 · Subject Guides slide 5 · Template5 · Template6</span>
<h2>Five people, one product — and every grade is personal</h2>
<p class="lead">SWP391 is a team project, but most of the grade is individual: the LOC part of every iteration is measured screen by screen for each member, and in the final presentation the two examiners ask each of you about <em>your</em> part. Teamwork here means organising so that every member can build, explain and defend 3–4 screens per iteration — while the shared pieces (database, layout, login, documents) still fit together.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>use the teacher correctly in both roles — <strong>coach/mentor</strong> and <strong>customer/PO</strong>;</li>
<li>run a team rhythm across the 3 iterations and fill the <strong>Weekly Report</strong> (Template6) column by column;</li>
<li>make each member's contribution <strong>visible and provable</strong> (GitLab issues, commits, tags, Project Tracking);</li>
<li>handle a free-rider or a conflict early, with a fair escalation ladder;</li>
<li>use AI honestly and log it in the <strong>AI Usage Report</strong> (Template5) — and know what counts as cheating.</li>
</ul></div>`,
    `<span class="eyebrow">Chương 7 · Bài 7.1 · Subject Guides slide 5 · Template5 · Template6</span>
<h2>Năm người, một sản phẩm — nhưng điểm là của từng người</h2>
<p class="lead">SWP391 là đồ án nhóm, nhưng phần lớn điểm là cá nhân: phần LOC của mỗi iteration được đo theo từng màn hình của từng thành viên, và trong buổi thuyết trình cuối, hai giám khảo hỏi riêng từng bạn về phần <em>của bạn</em>. Làm việc nhóm ở đây nghĩa là tổ chức sao cho mỗi thành viên tự xây, tự giải thích và tự bảo vệ được 3–4 màn hình mỗi iteration — trong khi các phần dùng chung (database, layout, login, tài liệu) vẫn khớp với nhau.</p>
<div class="callout"><strong>Sau bài này bạn có thể:</strong>
<ul>
<li>dùng đúng giảng viên ở cả hai vai — <strong>coach/mentor</strong> và <strong>customer/PO</strong>;</li>
<li>giữ nhịp làm việc của nhóm qua 3 iteration và điền <strong>Weekly Report</strong> (Template6) từng cột;</li>
<li>làm cho đóng góp của mỗi người <strong>thấy được và chứng minh được</strong> (issue GitLab, commit, tag, Project Tracking);</li>
<li>xử lý sớm người "ăn theo" hay một xung đột, theo một thang leo thang công bằng;</li>
<li>dùng AI trung thực và ghi lại trong <strong>AI Usage Report</strong> (Template5) — và biết thế nào là gian lận.</li>
</ul></div>`),
    bi(`<h3>1. The teacher wears two hats — use both</h3>
<p>The Subject Guides (slide 5) say it plainly: the teacher is <strong>both the coach/mentor and the customer/PO</strong> of every team — "the final point to confirm/clarify team's requirements". Most of the teacher's time during the iterations goes to clarifying requirements and giving feedback on your results.</p>
<table>
<thead><tr><th>Hat</th><th>What you ask</th><th>Where you ask it</th><th>What you keep as evidence</th></tr></thead>
<tbody>
<tr><td><strong>Customer / PO</strong></td><td>"Must a recruiter approve an application before the freelancer sees the result?" — business rules, scope, priority of screens</td><td>GitLab issue with label <code>Q&amp;A</code>, or in the class slot</td><td>the answered issue, then a business rule (BR-xx) in the RDS</td></tr>
<tr><td><strong>Coach / mentor</strong></td><td>"Is our ERD normalised enough?", "Is this screen Complex or Medium?", "How do we split the admin module?"</td><td>class slot, team channel (Slack or the one your teacher set up)</td><td>a note in the weekly report (part IV) and the changed document</td></tr>
</tbody>
</table>
<p class="nhan">How to work with a customer who is also your grader</p>
<ol>
<li><strong>Bring a proposal, not an open question</strong> — "We plan X because Y; is that acceptable?" gets a fast yes/no.</li>
<li><strong>Write every answer down</strong> the same day (Q&amp;A issue → BR in the RDS). A requirement you "remember" is not a requirement.</li>
<li><strong>Show working software early</strong> — a customer reacts to screens far better than to documents.</li>
<li><strong>Report leakage honestly</strong> — defects the teacher finds after a submission are labelled <code>Leakage</code>; fix them first in the next iteration.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>The "we assumed" trap.</strong> Teams that never ask the customer build a plausible system that is not the one the teacher expects — and then argue in the final presentation. The examiners grade <em>requirement analysis</em> at 20%: "we asked, here is the confirmed rule" is the strongest answer you can give.</div>`,
      `<h3>1. Giảng viên đội hai chiếc mũ — hãy dùng cả hai</h3>
<p>Subject Guides (slide 5) nói rõ: giảng viên <strong>vừa là coach/mentor vừa là customer/PO</strong> của mọi nhóm — "điểm cuối cùng để xác nhận/làm rõ yêu cầu của nhóm". Phần lớn thời gian của thầy/cô trong các iteration dành cho việc làm rõ yêu cầu và nhận xét kết quả của bạn.</p>
<table>
<thead><tr><th>Mũ</th><th>Bạn hỏi gì</th><th>Hỏi ở đâu</th><th>Giữ lại bằng chứng gì</th></tr></thead>
<tbody>
<tr><td><strong>Customer / PO</strong></td><td>"Recruiter có phải duyệt đơn ứng tuyển thì freelancer mới thấy kết quả không?" — business rule, phạm vi, độ ưu tiên màn hình</td><td>Issue GitLab gắn label <code>Q&amp;A</code>, hoặc ngay trong slot học</td><td>issue đã trả lời, rồi một business rule (BR-xx) trong RDS</td></tr>
<tr><td><strong>Coach / mentor</strong></td><td>"ERD đã chuẩn hoá đủ chưa?", "Màn hình này là Complex hay Medium?", "Chia module admin thế nào?"</td><td>slot học, kênh chat của nhóm (Slack hoặc kênh thầy/cô lập)</td><td>một dòng trong báo cáo tuần (phần IV) và tài liệu đã sửa</td></tr>
</tbody>
</table>
<p class="nhan">Làm việc với một khách hàng đồng thời là người chấm điểm</p>
<ol>
<li><strong>Mang theo đề xuất, đừng hỏi bỏ ngỏ</strong> — "Nhóm định làm X vì Y, có được không ạ?" sẽ nhận câu trả lời có/không rất nhanh.</li>
<li><strong>Ghi lại mọi câu trả lời</strong> ngay trong ngày (issue Q&amp;A → BR trong RDS). Yêu cầu "nhớ trong đầu" không phải là yêu cầu.</li>
<li><strong>Cho xem phần mềm chạy sớm</strong> — khách hàng phản hồi với màn hình tốt hơn nhiều so với tài liệu.</li>
<li><strong>Báo leakage trung thực</strong> — lỗi thầy/cô phát hiện sau khi nộp được gắn label <code>Leakage</code>; sửa chúng đầu tiên ở iteration sau.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Cái bẫy "nhóm em tưởng là".</strong> Nhóm không bao giờ hỏi khách hàng sẽ xây một hệ thống nghe hợp lý nhưng không phải cái thầy/cô mong đợi — rồi tranh luận trong buổi thuyết trình cuối. Giám khảo chấm <em>phân tích yêu cầu</em> 20%: "nhóm đã hỏi, đây là quy tắc đã được xác nhận" là câu trả lời mạnh nhất bạn có.</div>`),
    bi(`<h3>2. Dividing the work — vertical slices plus a small shared core</h3>
<p>Every iteration, <strong>each member does requirement + design + full-stack code for his/her own 3–4 screens/functions</strong>, and the team works together on the common code modules, the database tables and the common document parts (Subject Guides slide 5). So split by <em>screen</em>, never by layer ("you do all the SQL, I do all the JSP") — LOC is graded per screen per person.</p>
<p class="nhan">Worked example — Job IT for Freelancer, iteration 1 (5 members)</p>
<table>
<thead><tr><th>Member</th><th>Own screens (Req = one GitLab issue each)</th><th>Shared duty</th></tr></thead>
<tbody>
<tr><td>Leader</td><td>Login · Register (freelancer) · Home page</td><td>GitLab maintainer, merges, tags <code>iter1</code>; layout/header/footer</td></tr>
<tr><td>Member 2</td><td>Post list · Post detail · Search post</td><td>DB script owner (tables, seed data)</td></tr>
<tr><td>Member 3</td><td>Freelancer profile · Edit profile · Change password</td><td>RDS editor (merges everyone's sections)</td></tr>
<tr><td>Member 4</td><td>Recruiter: Create post · My post list · Update post</td><td>Project Tracking sheet</td></tr>
<tr><td>Member 5</td><td>Admin: Dashboard · Freelancer list · Change account status</td><td>Weekly report, AI Usage Report</td></tr>
</tbody>
</table>
<p class="nhan">A rhythm that survives 3 iterations (each iteration = 6 slots of 135')</p>
<ol>
<li><strong>Start of iteration</strong> — agree the screens per person in Project Tracking; open one <code>Req</code> issue per screen, plus <code>Task</code> issues for shared work.</li>
<li><strong>Every week</strong> — a 15-minute stand-up (done / next / blocked); move issues <code>1_To Do → 2_Doing → 3_Done</code>; send the Weekly Report.</li>
<li><strong>Middle of iteration</strong> — integrate on the main branch at least once; fix <code>Defect</code> issues found by the team.</li>
<li><strong>End of iteration</strong> — each member records a demo video of his/her screens; the leader tags the release; the team submits Project Tracking + RDS + links.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Integrating on the last night.</strong> Five branches that each "work on my machine" meet for the first time the night before submission, the shared tables disagree, and three demo videos are recorded on a broken build. Merge small, merge weekly.</div>`,
      `<h3>2. Chia việc — lát cắt dọc cộng một lõi dùng chung nhỏ</h3>
<p>Mỗi iteration, <strong>mỗi thành viên tự làm requirement + design + code full-stack cho 3–4 màn hình/chức năng của mình</strong>, còn cả nhóm cùng làm các module code chung, các bảng database và phần tài liệu chung (Subject Guides slide 5). Vì vậy hãy chia theo <em>màn hình</em>, không bao giờ chia theo tầng ("cậu làm hết SQL, tớ làm hết JSP") — LOC được chấm theo từng màn hình của từng người.</p>
<p class="nhan">Ví dụ — Job IT for Freelancer, iteration 1 (5 thành viên)</p>
<table>
<thead><tr><th>Thành viên</th><th>Màn hình riêng (mỗi Req = một issue GitLab)</th><th>Việc chung</th></tr></thead>
<tbody>
<tr><td>Leader</td><td>Login · Register (freelancer) · Home page</td><td>Maintainer GitLab, merge, gắn tag <code>iter1</code>; layout/header/footer</td></tr>
<tr><td>Thành viên 2</td><td>Post list · Post detail · Search post</td><td>Phụ trách DB script (bảng, dữ liệu mẫu)</td></tr>
<tr><td>Thành viên 3</td><td>Freelancer profile · Edit profile · Change password</td><td>Biên tập RDS (gộp phần của mọi người)</td></tr>
<tr><td>Thành viên 4</td><td>Recruiter: Create post · My post list · Update post</td><td>Sheet Project Tracking</td></tr>
<tr><td>Thành viên 5</td><td>Admin: Dashboard · Freelancer list · Change account status</td><td>Weekly report, AI Usage Report</td></tr>
</tbody>
</table>
<p class="nhan">Một nhịp làm việc trụ được qua 3 iteration (mỗi iteration = 6 slot 135')</p>
<ol>
<li><strong>Đầu iteration</strong> — chốt màn hình của từng người trong Project Tracking; mở một issue <code>Req</code> cho mỗi màn hình, cộng các issue <code>Task</code> cho việc chung.</li>
<li><strong>Hằng tuần</strong> — họp nhanh 15 phút (đã xong / sắp làm / đang vướng); chuyển issue <code>1_To Do → 2_Doing → 3_Done</code>; gửi Weekly Report.</li>
<li><strong>Giữa iteration</strong> — tích hợp lên nhánh chính ít nhất một lần; sửa các issue <code>Defect</code> nhóm tự tìm ra.</li>
<li><strong>Cuối iteration</strong> — mỗi người quay video demo màn hình của mình; leader gắn tag bản phát hành; nhóm nộp Project Tracking + RDS + các link.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Tích hợp vào đêm cuối.</strong> Năm nhánh đều "chạy trên máy em" gặp nhau lần đầu vào đêm trước hạn nộp, các bảng dùng chung vênh nhau, và ba video demo được quay trên một bản build hỏng. Merge nhỏ, merge hằng tuần.</div>`),
    bi(`<h3>3. The Weekly Report (Template6) — column by column</h3>
<p>Template6 is one sheet per week (<code>Wx</code>): the group name, the week as <code>dd/mm/yyyy-dd/mm/yyyy</code>, then four tables. It is the teacher's quickest view of whether the team is on track — and your written record of who did what.</p>
<table>
<thead><tr><th>Part</th><th>Columns</th><th>How to fill it well</th></tr></thead>
<tbody>
<tr><td><strong>I. Status Report</strong></td><td># · Project Task · In-charge · Status · Notes (Work Item in Details)</td><td>One row per task of the week. Status = <em>Pending / In Progress / Done</em>. Notes name the GitLab issue (#23) or screen.</td></tr>
<tr><td><strong>II. Project Issues</strong></td><td># · Project Issue · Owner · Status · Notes (Solution, Suggestion…)</td><td>Blockers and risks, each with ONE owner and a proposed solution — not a complaint.</td></tr>
<tr><td><strong>III. Next Week Plan</strong></td><td># · Project Task · In-charge · Deadline · Notes (Task Details…)</td><td>Concrete tasks with a date. Next week's Part I should match this list.</td></tr>
<tr><td><strong>IV. Other Project Matters/Suggestions</strong></td><td># · Matter/Suggestion · Raised By · Date · Notes</td><td>Questions for the teacher, scope change requests, tool problems.</td></tr>
</tbody>
</table>
<p class="nhan">Worked example — week 3 of iteration 1 (short)</p>
<table>
<thead><tr><th>Part</th><th>Row</th></tr></thead>
<tbody>
<tr><td>I</td><td>Create post screen · Member 4 · In Progress · "#31 form done, validation of salary range left"</td></tr>
<tr><td>I</td><td>Login + Register · Leader · Done · "#12, #13 merged, tag pending"</td></tr>
<tr><td>II</td><td>Table <code>Post</code> changed twice, breaks Post list · Member 2 · Pending · "freeze schema on Monday, changes only via issue"</td></tr>
<tr><td>III</td><td>Record demo videos · all · Friday · "one video per member, max 5 min"</td></tr>
<tr><td>IV</td><td>Does an expired post still appear in search? · Member 2 · 18/06 · "asked as Q&amp;A issue #40"</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Reports that say nothing.</strong> "Everyone: coding — In Progress" every week hides a member who has not started. Name the screen, the issue and the person; then the report protects the members who do work.</div>`,
      `<h3>3. Weekly Report (Template6) — từng cột một</h3>
<p>Template6 là một sheet cho mỗi tuần (<code>Wx</code>): tên nhóm, tuần theo dạng <code>dd/mm/yyyy-dd/mm/yyyy</code>, rồi bốn bảng. Đây là cách nhanh nhất để thầy/cô thấy nhóm có đúng tiến độ không — và là bản ghi bằng văn bản ai đã làm gì.</p>
<table>
<thead><tr><th>Phần</th><th>Các cột</th><th>Điền thế nào cho tốt</th></tr></thead>
<tbody>
<tr><td><strong>I. Status Report</strong></td><td># · Project Task · In-charge · Status · Notes (Work Item in Details)</td><td>Mỗi việc trong tuần một dòng. Status = <em>Pending / In Progress / Done</em>. Notes ghi issue GitLab (#23) hoặc tên màn hình.</td></tr>
<tr><td><strong>II. Project Issues</strong></td><td># · Project Issue · Owner · Status · Notes (Solution, Suggestion…)</td><td>Các vướng mắc và rủi ro, mỗi cái MỘT người chịu trách nhiệm và một hướng giải quyết — không phải lời than.</td></tr>
<tr><td><strong>III. Next Week Plan</strong></td><td># · Project Task · In-charge · Deadline · Notes (Task Details…)</td><td>Việc cụ thể có ngày. Phần I của tuần sau phải khớp danh sách này.</td></tr>
<tr><td><strong>IV. Other Project Matters/Suggestions</strong></td><td># · Matter/Suggestion · Raised By · Date · Notes</td><td>Câu hỏi cho thầy/cô, đề nghị đổi phạm vi, sự cố công cụ.</td></tr>
</tbody>
</table>
<p class="nhan">Ví dụ — tuần 3 của iteration 1 (rút gọn)</p>
<table>
<thead><tr><th>Phần</th><th>Dòng</th></tr></thead>
<tbody>
<tr><td>I</td><td>Màn Create post · Thành viên 4 · In Progress · "#31 xong form, còn validate khoảng lương"</td></tr>
<tr><td>I</td><td>Login + Register · Leader · Done · "#12, #13 đã merge, chờ gắn tag"</td></tr>
<tr><td>II</td><td>Bảng <code>Post</code> bị đổi hai lần, làm hỏng Post list · Thành viên 2 · Pending · "đóng băng schema từ thứ Hai, chỉ đổi qua issue"</td></tr>
<tr><td>III</td><td>Quay video demo · cả nhóm · thứ Sáu · "mỗi người một video, tối đa 5 phút"</td></tr>
<tr><td>IV</td><td>Tin tuyển dụng hết hạn còn hiện trong tìm kiếm không? · Thành viên 2 · 18/06 · "đã hỏi bằng issue Q&amp;A #40"</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Báo cáo không nói gì.</strong> "Cả nhóm: coding — In Progress" tuần nào cũng vậy sẽ che giấu một thành viên chưa bắt đầu. Ghi rõ màn hình, issue và người; khi đó báo cáo bảo vệ chính những người có làm.</div>`),
    bi(`<h3>4. Proving contribution &amp; handling conflict</h3>
<p>The teacher grades LOC <strong>individually via code demo</strong>: you open your own screens and explain your own code. The examiners in the final presentation also ask per person. So contribution must leave traces a stranger can check.</p>
<p class="nhan">Four traces that prove who did what</p>
<ul>
<li><strong>GitLab issues</strong> — each <code>Req</code> issue has one assignee and moves to <code>3_Done</code> with a link to the merge/commit.</li>
<li><strong>Commits under your own account</strong> — never push a teammate's work from your machine "to help".</li>
<li><strong>Project Tracking</strong> — the screen list per iteration with the owner, complexity and status.</li>
<li><strong>Record of Changes</strong> in the RDS — who added or modified which section, per version.</li>
</ul>
<p class="nhan">A fair escalation ladder when someone is not delivering</p>
<ol>
<li><strong>Ask privately, early</strong> (week 1–2 of the iteration): "Your issue #31 has not moved — what is blocking you?" Offer help or pairing.</li>
<li><strong>Make it visible in the stand-up</strong> with a new, smaller deadline, written in Part III of the weekly report.</li>
<li><strong>Re-plan together</strong> — move a screen to another member only with the owner's agreement and update Project Tracking.</li>
<li><strong>Tell the teacher (coach hat)</strong> with facts from the weekly reports and issues — not feelings — well before the submission.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>"Covering" for a friend.</strong> Coding a teammate's screen so the team "looks complete" is not kindness: that member cannot explain the code in the demo, the examiners notice in one question, and both of you are exposed. It can also be treated as cheating.</div>
<p class="meo">🧠 <strong>Remember:</strong> <em>Early · Visible · Factual</em> — raise it early, make it visible in writing, escalate with facts.</p>`,
      `<h3>4. Chứng minh đóng góp &amp; xử lý xung đột</h3>
<p>Thầy/cô chấm LOC <strong>theo từng cá nhân qua buổi demo code</strong>: bạn tự mở màn hình của mình và giải thích code của mình. Giám khảo trong buổi thuyết trình cuối cũng hỏi từng người. Vì thế đóng góp phải để lại dấu vết mà người lạ cũng kiểm được.</p>
<p class="nhan">Bốn dấu vết chứng minh ai làm gì</p>
<ul>
<li><strong>Issue GitLab</strong> — mỗi issue <code>Req</code> có một người được giao và chuyển sang <code>3_Done</code> kèm link merge/commit.</li>
<li><strong>Commit bằng tài khoản của chính bạn</strong> — đừng bao giờ push bài của bạn khác từ máy mình "cho nhanh".</li>
<li><strong>Project Tracking</strong> — danh sách màn hình theo iteration có người phụ trách, độ phức tạp và trạng thái.</li>
<li><strong>Record of Changes</strong> trong RDS — ai đã thêm hay sửa mục nào, theo từng phiên bản.</li>
</ul>
<p class="nhan">Thang leo thang công bằng khi có người không hoàn thành việc</p>
<ol>
<li><strong>Hỏi riêng, hỏi sớm</strong> (tuần 1–2 của iteration): "Issue #31 của cậu chưa nhúc nhích — đang vướng gì?" Đề nghị giúp hoặc làm cặp.</li>
<li><strong>Nêu ra trong buổi họp nhanh</strong> với một hạn mới, nhỏ hơn, ghi vào Phần III của báo cáo tuần.</li>
<li><strong>Cùng lên kế hoạch lại</strong> — chỉ chuyển màn hình sang người khác khi người phụ trách đồng ý, và cập nhật Project Tracking.</li>
<li><strong>Báo thầy/cô (mũ coach)</strong> bằng dữ kiện từ báo cáo tuần và issue — không bằng cảm xúc — và báo sớm, trước hạn nộp.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>"Gánh" hộ bạn.</strong> Code hộ màn hình của đồng đội để nhóm "trông đầy đủ" không phải là tốt bụng: bạn đó không giải thích được code khi demo, giám khảo nhận ra chỉ sau một câu hỏi, và cả hai cùng lộ. Việc này còn có thể bị coi là gian lận.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>Sớm · Thấy được · Có dữ kiện</em> — nêu sớm, ghi thành văn bản, leo thang bằng dữ kiện.</p>`),
    bi(`<h3>5. Academic integrity &amp; the AI Usage Report (Template5)</h3>
<p>"No cheating found" is one of the four pass conditions. AI tools are allowed when you <strong>declare, verify and own</strong> what they produce. Template5 is how you declare it.</p>
<p class="nhan">The workbook</p>
<ul>
<li><strong>0.Overview</strong> — subject code/name, class, semester, lecturer, group code, project title, and the member list (No, StudentCode, Name, Role in group, AI tools used).</li>
<li><strong>1. Week 1 … 2. Week n</strong> — one log row per AI use (10 columns, below).</li>
<li><strong>Instruction</strong> — how to fill each column.</li>
</ul>
<table>
<thead><tr><th>Column</th><th>What to write</th></tr></thead>
<tbody>
<tr><td>No. · SDLC Phase</td><td>1, 2, 3… · Requirement / Design / Implementation / Testing / Reporting</td></tr>
<tr><td>Task / Activity</td><td>the specific task, e.g. "Use case spec of Apply Job"</td></tr>
<tr><td>AI Tool Used · AI Output</td><td>tool name · a one-line summary of what it produced</td></tr>
<tr><td>Student's Validation / Modification</td><td>what you kept, rewrote or rejected — the most important column</td></tr>
<tr><td>Evidence / Link</td><td>Drive folder of screenshots/videos showing prompt, answer and your follow-up; name files <code>GroupX_SessionY_Activity</code></td></tr>
<tr><td>Quantitative Measure</td><td>numbers: stories kept, entities, test cases, LOC</td></tr>
<tr><td>Value Added (1-5) · Risks / Limitations</td><td>your honest rating · what went wrong (irrelevant items, missing validation…)</td></tr>
</tbody>
</table>
<p class="nhan">Worked example row</p>
<p><code>3 · Design · ERD for job applications · ChatGPT · 7 tables incl. JobApply · "merged Freelancer/Recruiter into User + role, added UNIQUE(postID, freelanceID), removed a redundant status table" · Drive link · 6 tables kept, 2 FKs fixed · 4 · "suggested a many-to-many that broke BR-11"</code></p>
<div class="pitfall co-tieu-de"><strong>What counts as cheating in SWP391.</strong> Submitting code or documents from another team or an earlier semester (old projects are easy to find online, and so are they for the teacher); a person other than the owner writing a member's screens; AI output pasted in without declaring it and without being able to explain it in the code demo.</div>
<p class="meo">🧠 <strong>Remember:</strong> <em>Declare · Verify · Own</em> — if you cannot explain a line in the demo, it is not yours yet.</p>`,
      `<h3>5. Liêm chính học thuật &amp; AI Usage Report (Template5)</h3>
<p>"Không phát hiện gian lận" là một trong bốn điều kiện qua môn. Công cụ AI được phép dùng khi bạn <strong>khai báo, kiểm chứng và làm chủ</strong> được thứ nó sinh ra. Template5 là cách bạn khai báo.</p>
<p class="nhan">Cấu trúc file</p>
<ul>
<li><strong>0.Overview</strong> — mã/tên môn, lớp, học kỳ, giảng viên, mã nhóm, tên đề tài, và danh sách thành viên (No, StudentCode, Name, vai trò trong nhóm, công cụ AI đã dùng).</li>
<li><strong>1. Week 1 … 2. Week n</strong> — mỗi lần dùng AI một dòng (10 cột, bên dưới).</li>
<li><strong>Instruction</strong> — hướng dẫn điền từng cột.</li>
</ul>
<table>
<thead><tr><th>Cột</th><th>Ghi gì</th></tr></thead>
<tbody>
<tr><td>No. · SDLC Phase</td><td>1, 2, 3… · Requirement / Design / Implementation / Testing / Reporting</td></tr>
<tr><td>Task / Activity</td><td>việc cụ thể, vd "Use case spec của Apply Job"</td></tr>
<tr><td>AI Tool Used · AI Output</td><td>tên công cụ · tóm tắt một dòng thứ nó sinh ra</td></tr>
<tr><td>Student's Validation / Modification</td><td>bạn giữ, viết lại hay bỏ gì — cột quan trọng nhất</td></tr>
<tr><td>Evidence / Link</td><td>thư mục Drive chứa ảnh chụp/video có prompt, câu trả lời và phần bạn hỏi tiếp; đặt tên file <code>GroupX_SessionY_Activity</code></td></tr>
<tr><td>Quantitative Measure</td><td>con số: số story giữ lại, số entity, số test case, LOC</td></tr>
<tr><td>Value Added (1-5) · Risks / Limitations</td><td>tự chấm trung thực · điều gì sai (mục không liên quan, thiếu validate…)</td></tr>
</tbody>
</table>
<p class="nhan">Ví dụ một dòng</p>
<p><code>3 · Design · ERD cho ứng tuyển việc · ChatGPT · 7 bảng gồm JobApply · "gộp Freelancer/Recruiter vào User + role, thêm UNIQUE(postID, freelanceID), bỏ một bảng status thừa" · link Drive · giữ 6 bảng, sửa 2 FK · 4 · "gợi ý quan hệ nhiều-nhiều làm vỡ BR-11"</code></p>
<div class="pitfall co-tieu-de"><strong>Thế nào là gian lận trong SWP391.</strong> Nộp code hay tài liệu của nhóm khác hoặc của khoá trước (đồ án cũ dễ tìm trên mạng, và thầy/cô cũng tìm được y như vậy); người khác viết màn hình thay cho thành viên phụ trách; dán kết quả AI vào mà không khai báo và không giải thích được trong buổi demo code.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>Khai báo · Kiểm chứng · Làm chủ</em> — dòng code nào bạn không giải thích được khi demo thì nó chưa phải của bạn.</p>`),
    bi(`<h3>6. Team checklist for every iteration</h3>
<ol>
<li>Every screen of this iteration has one owner, one <code>Req</code> issue and a complexity guess in Project Tracking.</li>
<li>Every requirement question went to the teacher as a <code>Q&amp;A</code> issue; the answers are business rules in the RDS.</li>
<li>A Weekly Report was sent every week, naming people, issues and dates.</li>
<li>Each member committed his/her own code and can explain it line by line.</li>
<li>The AI Usage Report has one row per AI use, with evidence links.</li>
<li>The release is tagged, the DB script is inside the tag, and every member's demo video link works.</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The bus factor and the retrospective.</strong> The <em>bus factor</em> is the number of people who could disappear before the project stalls. A team where only the leader can run the database script or merge has a bus factor of one — the week that person is ill, nothing ships. Pair on the risky parts and write the setup steps in the README. Close each iteration with a 20-minute <em>retrospective</em> (what went well, what did not, one change for next iteration): it is the cheapest process improvement there is, and a real lesson from it is an excellent answer to "what would you do differently?" in the final presentation.</div>`,
      `<h3>6. Checklist của nhóm cho mỗi iteration</h3>
<ol>
<li>Mỗi màn hình của iteration này có một người phụ trách, một issue <code>Req</code> và độ phức tạp dự kiến trong Project Tracking.</li>
<li>Mọi câu hỏi về yêu cầu đã gửi thầy/cô dưới dạng issue <code>Q&amp;A</code>; câu trả lời đã thành business rule trong RDS.</li>
<li>Tuần nào cũng có Weekly Report, ghi rõ người, issue và ngày.</li>
<li>Mỗi thành viên tự commit code của mình và giải thích được từng dòng.</li>
<li>AI Usage Report có mỗi lần dùng AI một dòng, kèm link bằng chứng.</li>
<li>Bản phát hành đã gắn tag, DB script nằm trong tag, và link video demo của mọi thành viên đều mở được.</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Bus factor và buổi retrospective.</strong> <em>Bus factor</em> là số người có thể biến mất trước khi dự án đứng lại. Nhóm mà chỉ leader chạy được DB script hay merge được thì bus factor bằng một — tuần người đó ốm, không có gì được giao. Hãy làm cặp ở các phần rủi ro và ghi các bước cài đặt vào README. Kết thúc mỗi iteration bằng 20 phút <em>retrospective</em> (điều gì tốt, điều gì chưa, một thay đổi cho iteration sau): đó là cách cải tiến quy trình rẻ nhất, và một bài học thật từ đó là câu trả lời xuất sắc cho "nếu làm lại em sẽ làm khác gì?" trong buổi thuyết trình cuối.</div>`),
    books([
      ['sommerville', 'Ch. 22 Project management — 22.3 Teamwork; Ch. 1.2 Software engineering ethics', 'Chương 22 Project management — mục 22.3 Teamwork; mục 1.2 Software engineering ethics'],
      ['progit', 'Ch. 5 Distributed Git — Contributing to a Project', 'Chương 5 Distributed Git — Contributing to a Project'],
      ['wiegers', 'Ch. 2 Requirements from the customer\'s perspective (the customer–developer partnership)', 'Chương 2 Requirements from the customer\'s perspective (quan hệ đối tác khách hàng – nhóm phát triển)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 7.2 Final presentation guide (g-present 1–9) ─────────────────────── */
const L72 = {
  title: '7.2 — The final presentation (40%): the guide slide by slide and how the two examiners grade|||7.2 — Thuyết trình cuối kỳ (40%): hướng dẫn từng slide và cách hai giám khảo chấm',
  slug: 'swp391-7-2-report-presentation',
  type: 'VIDEO',
  description: 'Slide6 Presentation trang 1–9: mỗi slide phải cho thấy gì, ứng với tiêu chí nào (team working 20%, product 40%, requirement 20%, design 20%), giám khảo kiểm tra gì và các lỗi mất điểm.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.2 · Slide6 Presentation, pages 1–9</span>
<h2>The final presentation — what is graded, and by whom</h2>
<p class="lead">The final presentation is worth <strong>40%</strong> and is graded by <strong>two teachers other than your class teacher</strong>. They have never seen your project. In one short session they must judge your product, your requirement analysis, your design and how your team works — so every slide has to answer one of their four questions quickly.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>state the four criteria and their weights, and the pass rule for the final presentation;</li>
<li>explain what each of the 9 pages of the guide asks you to show;</li>
<li>map each slide to the criterion it earns marks for, and avoid the mistakes that lose them.</li>
</ul></div>
<p class="nhan">The rubric (Subject Guides slide 7)</p>
<table>
<thead><tr><th>Criterion</th><th>Weight</th><th>What the examiners look at</th><th>Slides that feed it</th></tr></thead>
<tbody>
<tr><td><strong>Team working</strong> (presentation, Q&amp;A…)</td><td>20%</td><td>clear talk, time control, every member speaks and answers, how the team managed the project</td><td>2, 9 — and the whole delivery</td></tr>
<tr><td><strong>Software product / implementation</strong></td><td>40%</td><td>the live demo: completed workflows run, data is real, validation and roles work</td><td>5, 8 (demo)</td></tr>
<tr><td><strong>Requirement analysing</strong></td><td>20%</td><td>use cases complete and correct per actor, screen flow, non-UI functions, business rules</td><td>3, 4</td></tr>
<tr><td><strong>Software designing</strong></td><td>20%</td><td>database schema and package structure that match the code</td><td>6, 7</td></tr>
</tbody>
</table>
<p class="nhan">Pass rule</p>
<ul>
<li><strong>Final Presentation Grade ≥ 5/10</strong> — it "evaluates the iter3 results", i.e. the final package you submitted.</li>
<li>It is a separate condition: a strong OG (iterations) does not rescue a failed presentation.</li>
</ul>`,
      `<span class="eyebrow">Chương 7 · Bài 7.2 · Slide6 Presentation, trang 1–9</span>
<h2>Thuyết trình cuối kỳ — chấm cái gì, và ai chấm</h2>
<p class="lead">Buổi thuyết trình cuối chiếm <strong>40%</strong> và được chấm bởi <strong>hai giảng viên không phải thầy/cô dạy lớp bạn</strong>. Họ chưa từng thấy đồ án của bạn. Trong một buổi ngắn họ phải đánh giá sản phẩm, phân tích yêu cầu, thiết kế và cách nhóm làm việc — nên mỗi slide phải trả lời nhanh một trong bốn câu hỏi của họ.</p>
<div class="callout"><strong>Sau bài này bạn có thể:</strong>
<ul>
<li>nêu bốn tiêu chí, trọng số, và điều kiện qua của buổi thuyết trình;</li>
<li>giải thích mỗi trang trong 9 trang hướng dẫn yêu cầu bạn trình bày gì;</li>
<li>gắn mỗi slide với tiêu chí mà nó mang điểm về, và tránh các lỗi làm mất điểm.</li>
</ul></div>
<p class="nhan">Thang chấm (Subject Guides slide 7)</p>
<table>
<thead><tr><th>Tiêu chí</th><th>Trọng số</th><th>Giám khảo nhìn vào</th><th>Slide đóng góp</th></tr></thead>
<tbody>
<tr><td><strong>Team working</strong> (trình bày, Q&amp;A…)</td><td>20%</td><td>nói rõ ràng, giữ thời gian, mọi thành viên đều nói và trả lời, nhóm quản lý dự án thế nào</td><td>2, 9 — và cả phần trình bày</td></tr>
<tr><td><strong>Software product / implementation</strong></td><td>40%</td><td>demo trực tiếp: các luồng đã xong chạy được, dữ liệu thật, validate và phân quyền hoạt động</td><td>5, 8 (demo)</td></tr>
<tr><td><strong>Requirement analysing</strong></td><td>20%</td><td>use case đủ và đúng theo từng actor, screen flow, chức năng non-UI, business rule</td><td>3, 4</td></tr>
<tr><td><strong>Software designing</strong></td><td>20%</td><td>schema database và cấu trúc package khớp với code</td><td>6, 7</td></tr>
</tbody>
</table>
<p class="nhan">Điều kiện qua</p>
<ul>
<li><strong>Điểm Final Presentation ≥ 5/10</strong> — buổi này "đánh giá kết quả iter3", tức gói sản phẩm cuối bạn đã nộp.</li>
<li>Đây là điều kiện riêng: OG (các iteration) cao không cứu được một buổi thuyết trình trượt.</li>
</ul>`),
    walkHead('g-present', 1, 9, 'The same nine pages come as an empty file to fill in (Template7) — lesson 7.3 fills it for a real project.', 'Chín trang này cũng có dạng file trống để điền (Template7) — bài 7.3 điền nó cho một dự án thật.'),
    walk('g-present', [
      [1, 'Title — SWP391: Final Project Presentation, <<Project/Product Name + Code>>',
        `<p class="y-chinh">🎯 The cover names the product and its code — the examiners match it with the package they will grade.</p>
<p class="nhan">What to put on it</p>
<ul>
<li><strong>Product name + code</strong> — e.g. "Job IT for Freelancer — SE18xx_G5" (class + group code as used in your submissions).</li>
<li><strong>Nothing else is required</strong> — the team comes on slide 2.</li>
</ul>
<p class="nhan">What the examiners check</p>
<ul>
<li>That the name and code are the same as in the RDS, Project Tracking and GitLab tag they received.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> say one sentence while this slide is up — "Our system helps IT freelancers find jobs posted by companies." The examiners know the context in 5 seconds.</p>`,
        `<p class="y-chinh">🎯 Trang bìa ghi tên sản phẩm và mã — giám khảo đối chiếu với gói bài họ sẽ chấm.</p>
<p class="nhan">Ghi gì</p>
<ul>
<li><strong>Tên sản phẩm + mã</strong> — vd "Job IT for Freelancer — SE18xx_G5" (mã lớp + mã nhóm như trong các lần nộp).</li>
<li><strong>Không cần gì thêm</strong> — thành viên nhóm nằm ở slide 2.</li>
</ul>
<p class="nhan">Giám khảo kiểm tra gì</p>
<ul>
<li>Tên và mã trùng với RDS, Project Tracking và tag GitLab mà họ nhận được.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nói đúng một câu khi slide này đang chiếu — "Hệ thống giúp freelancer IT tìm việc do các công ty đăng." Giám khảo nắm bối cảnh trong 5 giây.</p>`],
      [2, 'Project Overview — introduction & scope, team, how the team manages the project',
        `<p class="y-chinh">🎯 One slide that proves you are a team with a process, not five people who met the night before.</p>
<p class="nhan">Three blocks the guide asks for</p>
<ol>
<li><strong>Product introduction &amp; scope</strong> — the problem, the actors (Guest, Freelancer, Recruiter, Admin), what is in and what is out.</li>
<li><strong>Project team members</strong> — each member with his/her role and the feature area he/she owns.</li>
<li><strong>How the team manages the project</strong> — communication (weekly meeting, task assignment) and issue tracking (requirements, tasks, Q&amp;A on GitLab with labels).</li>
</ol>
<p class="nhan">Graded under</p>
<ul>
<li><strong>Team working 20%</strong> — a screenshot of your GitLab board (issues by label, by assignee) is stronger than any sentence.</li>
</ul>
<div class="pitfall">Listing "Scrum, daily meeting, Jira" when the repository shows 3 issues and one committer. Examiners open GitLab; show what you really did.</div>`,
        `<p class="y-chinh">🎯 Một slide chứng minh bạn là một nhóm có quy trình, không phải năm người mới gặp nhau tối hôm trước.</p>
<p class="nhan">Ba khối hướng dẫn yêu cầu</p>
<ol>
<li><strong>Giới thiệu sản phẩm &amp; phạm vi</strong> — bài toán, các actor (Guest, Freelancer, Recruiter, Admin), cái gì trong phạm vi và cái gì ngoài.</li>
<li><strong>Thành viên nhóm</strong> — mỗi người kèm vai trò và mảng tính năng mình phụ trách.</li>
<li><strong>Nhóm quản lý dự án thế nào</strong> — giao tiếp (họp tuần, giao việc) và theo dõi issue (requirement, task, Q&amp;A trên GitLab có label).</li>
</ol>
<p class="nhan">Được chấm ở</p>
<ul>
<li><strong>Team working 20%</strong> — một ảnh chụp bảng GitLab (issue theo label, theo người phụ trách) mạnh hơn mọi câu chữ.</li>
</ul>
<div class="pitfall">Ghi "Scrum, họp hằng ngày, Jira" trong khi repository có 3 issue và một người commit. Giám khảo có mở GitLab; hãy trình bày đúng cái nhóm đã làm.</div>`],
      [3, 'Product Requirements — Use Case Diagrams (completed use cases, one diagram per actor)',
        `<p class="y-chinh">🎯 Show the use cases you <strong>completed</strong> — preferably one diagram per actor — so the examiners see the whole scope at a glance.</p>
<p class="nhan">Reading the sample on the slide</p>
<ul>
<li><strong>Guest</strong> — view food list, view menu details, register, view home page, search menu (by title / by date as <em>specialisations</em>).</li>
<li><strong>Admin &amp; Manager</strong> — setting list and user list, with add/update as <code>&lt;&lt;extends&gt;&gt;</code>; Manager inherits Admin (generalisation arrow).</li>
<li><strong>Patrol</strong> (a staff user) — login, order a meal, view order history; "Order a meal" <code>&lt;&lt;includes&gt;&gt;</code> "View order details".</li>
</ul>
<p class="nhan">Graded under Requirement analysing 20%</p>
<ul>
<li>Only completed use cases — a use case on the slide that the demo cannot show costs credibility.</li>
<li>Correct UML: actors outside the system boundary, <code>extend</code>/<code>include</code> arrows in the right direction.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> <em>include</em> = always happens as part of the base; <em>extend</em> = optional extra that the base does not need.</p>`,
        `<p class="y-chinh">🎯 Trình bày các use case đã <strong>hoàn thành</strong> — tốt nhất mỗi actor một sơ đồ — để giám khảo thấy toàn bộ phạm vi chỉ trong một cái nhìn.</p>
<p class="nhan">Đọc ví dụ trên slide</p>
<ul>
<li><strong>Guest</strong> — xem danh sách món, xem chi tiết menu, đăng ký, xem trang chủ, tìm menu (theo tên / theo ngày là các <em>trường hợp chuyên biệt</em>).</li>
<li><strong>Admin &amp; Manager</strong> — danh sách setting và danh sách user, add/update là <code>&lt;&lt;extends&gt;&gt;</code>; Manager kế thừa Admin (mũi tên tổng quát hoá).</li>
<li><strong>Patrol</strong> (một loại nhân viên) — đăng nhập, đặt suất ăn, xem lịch sử đơn; "Order a meal" <code>&lt;&lt;includes&gt;&gt;</code> "View order details".</li>
</ul>
<p class="nhan">Được chấm ở Requirement analysing 20%</p>
<ul>
<li>Chỉ use case đã xong — use case có trên slide mà demo không cho thấy được thì mất uy tín.</li>
<li>UML đúng: actor nằm ngoài biên hệ thống, mũi tên <code>extend</code>/<code>include</code> đúng chiều.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>include</em> = luôn xảy ra như một phần của use case gốc; <em>extend</em> = phần thêm tuỳ chọn, use case gốc không cần nó.</p>`],
    ]),
    walk('g-present', [
      [4, 'Product Requirements — Product Functionalities: screen flow of all screens + Non-UI functions',
        `<p class="y-chinh">🎯 The screen flow is the map of the whole product: every completed screen, and how a user moves from one to the next.</p>
<p class="nhan">Reading the sample</p>
<ul>
<li><strong>Public side</strong> — Home Page → Public Menu → Menu Details; Home → Public Foods → Food Details; Login → Dashboard; Register, Password Reset.</li>
<li><strong>Back office</strong> — Dashboard → Settings List / Users List / Food List / Menu List / Orders List, each → its details, new or update screen.</li>
<li><strong>Oval "Orders Import"</strong> — a non-screen step feeding the Orders List.</li>
</ul>
<p class="nhan">What to add</p>
<ul>
<li><strong>List of Non-UI functions</strong> (if any): scheduled jobs, e-mail sending, import/export, APIs — e.g. "Reset password by e-mail", "Auto-close expired posts".</li>
</ul>
<p class="nhan">Graded under Requirement analysing 20%</p>
<ul>
<li>Every screen in the demo appears here, with the same name as in the RDS "Screens Flow".</li>
</ul>`,
        `<p class="y-chinh">🎯 Screen flow là bản đồ của cả sản phẩm: mọi màn hình đã xong, và người dùng đi từ màn này sang màn khác thế nào.</p>
<p class="nhan">Đọc ví dụ</p>
<ul>
<li><strong>Phía công khai</strong> — Home Page → Public Menu → Menu Details; Home → Public Foods → Food Details; Login → Dashboard; Register, Password Reset.</li>
<li><strong>Phía quản trị</strong> — Dashboard → Settings List / Users List / Food List / Menu List / Orders List, mỗi cái → màn chi tiết, thêm mới hoặc cập nhật.</li>
<li><strong>Hình oval "Orders Import"</strong> — một bước không có màn hình, đổ dữ liệu vào Orders List.</li>
</ul>
<p class="nhan">Cần thêm</p>
<ul>
<li><strong>Danh sách chức năng Non-UI</strong> (nếu có): job định kỳ, gửi e-mail, import/export, API — vd "Reset password qua e-mail", "Tự đóng tin hết hạn".</li>
</ul>
<p class="nhan">Được chấm ở Requirement analysing 20%</p>
<ul>
<li>Mọi màn hình trong demo đều có ở đây, cùng tên với mục "Screens Flow" trong RDS.</li>
</ul>`],
      [5, 'Product Requirements — Main Screen UI Design: Home/Landing page and Admin Dashboard',
        `<p class="y-chinh">🎯 Two screenshots set the first impression of your product before the demo starts.</p>
<ul>
<li><strong>Main web screen</strong> — Home Page or Landing Page.</li>
<li><strong>Main admin screen</strong> — Dashboard (if any).</li>
</ul>
<p class="nhan">Tips</p>
<ul>
<li>Use real screenshots from the deployed/running build with realistic seed data — not the empty theme or a Figma mock.</li>
<li>If you started from a teacher-recommended UI theme (AdminLTE, DashMin, Doctris…), say so; examiners value honest reuse.</li>
</ul>
<p class="nhan">Graded under Product 40%</p>
<ul>
<li>UI/UX quality is part of the Q (quality) factor already in iteration grading; here it shapes the examiners' first impression.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai ảnh chụp tạo ấn tượng đầu tiên về sản phẩm trước khi demo bắt đầu.</p>
<ul>
<li><strong>Màn hình web chính</strong> — Home Page hoặc Landing Page.</li>
<li><strong>Màn hình quản trị chính</strong> — Dashboard (nếu có).</li>
</ul>
<p class="nhan">Mẹo</p>
<ul>
<li>Dùng ảnh chụp thật từ bản đang chạy với dữ liệu mẫu giống thật — không dùng theme trống hay mock Figma.</li>
<li>Nếu nhóm bắt đầu từ một UI theme thầy/cô gợi ý (AdminLTE, DashMin, Doctris…), hãy nói rõ; giám khảo đánh giá cao việc tái sử dụng trung thực.</li>
</ul>
<p class="nhan">Được chấm ở Product 40%</p>
<ul>
<li>Chất lượng UI/UX vốn đã nằm trong hệ số Q khi chấm các iteration; ở đây nó định hình ấn tượng đầu của giám khảo.</li>
</ul>`],
      [6, 'System Design — Database Design: the database schema',
        `<p class="y-chinh">🎯 One readable ERD of the real database — the examiners will ask about keys and relationships.</p>
<p class="nhan">Reading the sample</p>
<ul>
<li><strong>user ↔ role</strong>, and <strong>permission</strong> (role_id, screen_id, activity_id) — role-based authorisation stored in data.</li>
<li><strong>order → order_detail ← product</strong>, <strong>menu_product</strong> — associative tables that break many-to-many links.</li>
<li><strong>setting</strong> (type, name, description) — one table for many small lookup lists.</li>
</ul>
<p class="nhan">Graded under Design 20%</p>
<ul>
<li>The schema matches the script in your tag (same table and column names).</li>
<li>Every FK is visible; cardinalities are right; no repeated columns that break normal form.</li>
</ul>
<div class="pitfall">A 22-table diagram shrunk to unreadable text. Show the whole schema, then zoom into the 5–6 tables behind your main workflow.</div>`,
        `<p class="y-chinh">🎯 Một ERD dễ đọc của database thật — giám khảo sẽ hỏi về khoá và quan hệ.</p>
<p class="nhan">Đọc ví dụ</p>
<ul>
<li><strong>user ↔ role</strong>, và <strong>permission</strong> (role_id, screen_id, activity_id) — phân quyền theo vai trò lưu trong dữ liệu.</li>
<li><strong>order → order_detail ← product</strong>, <strong>menu_product</strong> — các bảng trung gian tách quan hệ nhiều-nhiều.</li>
<li><strong>setting</strong> (type, name, description) — một bảng cho nhiều danh mục nhỏ.</li>
</ul>
<p class="nhan">Được chấm ở Design 20%</p>
<ul>
<li>Schema khớp với script trong tag (cùng tên bảng, tên cột).</li>
<li>Thấy rõ mọi FK; bản số (cardinality) đúng; không có cột lặp làm vỡ chuẩn hoá.</li>
</ul>
<div class="pitfall">Sơ đồ 22 bảng thu nhỏ đến mức không đọc được. Hãy chiếu toàn bộ schema, rồi phóng to 5–6 bảng đứng sau luồng chính của bạn.</div>`],
    ]),
    walk('g-present', [
      [7, 'System Design — Package Diagram: bean, view, controller, filter, dao, util',
        `<p class="y-chinh">🎯 The package diagram shows how your code is organised and which layer may depend on which.</p>
<p class="nhan">Reading the sample (a Java servlet/JSP project)</p>
<ul>
<li><strong>bean</strong> — entity classes; view, controller and dao all depend on it.</li>
<li><strong>controller</strong> — servlets; use bean and util.</li>
<li><strong>dao</strong> — database access; uses bean and util.</li>
<li><strong>filter</strong> — authentication/authorisation filters; call dao and util.</li>
<li><strong>view</strong> — JSP pages; read beans only.</li>
</ul>
<p class="nhan">Graded under Design 20%</p>
<ul>
<li>The packages on the slide are the packages in your repository (examiners may open one).</li>
<li>Dependencies point one way: no dao → controller, no SQL inside JSP.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> be ready to say where one request goes — "URL → filter checks role → controller → dao → JSP".</p>`,
        `<p class="y-chinh">🎯 Package diagram cho thấy code được tổ chức thế nào và tầng nào được phụ thuộc vào tầng nào.</p>
<p class="nhan">Đọc ví dụ (một dự án Java servlet/JSP)</p>
<ul>
<li><strong>bean</strong> — các lớp entity; view, controller và dao đều phụ thuộc vào nó.</li>
<li><strong>controller</strong> — servlet; dùng bean và util.</li>
<li><strong>dao</strong> — truy cập database; dùng bean và util.</li>
<li><strong>filter</strong> — filter xác thực/phân quyền; gọi dao và util.</li>
<li><strong>view</strong> — trang JSP; chỉ đọc bean.</li>
</ul>
<p class="nhan">Được chấm ở Design 20%</p>
<ul>
<li>Các package trên slide chính là các package trong repository (giám khảo có thể mở ra xem).</li>
<li>Phụ thuộc đi một chiều: không có dao → controller, không có SQL trong JSP.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chuẩn bị nói được một request đi đâu — "URL → filter kiểm role → controller → dao → JSP".</p>`],
      [8, 'Demonstration — main workflows as swimlane diagrams (roles/actors × screens)',
        `<p class="y-chinh">🎯 The demo follows the main workflows you completed, each drawn first as a swimlane: one lane per role, boxes are screens, diamonds are decisions.</p>
<p class="nhan">How to choose the workflows</p>
<ul>
<li><strong>By main data entity</strong> — e.g. the life of a job post: created → approved → applied → accepted.</li>
<li><strong>By role/actor</strong> — what a Recruiter does end to end, what a Freelancer does.</li>
</ul>
<p class="nhan">Example workflow (Job IT for Freelancer)</p>
<ol>
<li><strong>Recruiter</strong>: Login → Create post → My post list.</li>
<li><strong>Admin</strong>: Project list → Approve project (decision: approve / suspend).</li>
<li><strong>Freelancer</strong>: Search post → Post detail → Apply job → List apply.</li>
<li><strong>Recruiter</strong>: Manage applicants → accept → Freelancer approved.</li>
</ol>
<p class="nhan">Graded under Product 40% — the biggest weight</p>
<ul>
<li>The workflow runs live without editing the database by hand.</li>
<li>At least one rule or error path is shown (duplicate application refused, role cannot open admin URL).</li>
</ul>`,
        `<p class="y-chinh">🎯 Phần demo đi theo các luồng chính nhóm đã hoàn thành, mỗi luồng được vẽ trước dưới dạng swimlane: mỗi làn một vai trò, hộp là màn hình, hình thoi là điểm rẽ nhánh.</p>
<p class="nhan">Chọn luồng thế nào</p>
<ul>
<li><strong>Theo thực thể dữ liệu chính</strong> — vd vòng đời một tin tuyển dụng: tạo → duyệt → ứng tuyển → chấp nhận.</li>
<li><strong>Theo vai trò/actor</strong> — Recruiter làm gì từ đầu đến cuối, Freelancer làm gì.</li>
</ul>
<p class="nhan">Ví dụ luồng (Job IT for Freelancer)</p>
<ol>
<li><strong>Recruiter</strong>: Login → Create post → My post list.</li>
<li><strong>Admin</strong>: Project list → Approve project (rẽ nhánh: duyệt / tạm khoá).</li>
<li><strong>Freelancer</strong>: Search post → Post detail → Apply job → List apply.</li>
<li><strong>Recruiter</strong>: Manage applicants → chấp nhận → Freelancer approved.</li>
</ol>
<p class="nhan">Được chấm ở Product 40% — trọng số lớn nhất</p>
<ul>
<li>Luồng chạy trực tiếp mà không phải sửa database bằng tay.</li>
<li>Có ít nhất một quy tắc hoặc đường lỗi (ứng tuyển trùng bị từ chối, sai role không mở được URL admin).</li>
</ul>`],
      [9, 'Q&A',
        `<p class="y-chinh">🎯 Q&amp;A is where the examiners separate the team's work from each person's understanding.</p>
<ul>
<li><strong>Who answers</strong> — the owner of the screen or document being asked about; the leader only routes questions.</li>
<li><strong>How</strong> — answer in one or two sentences, then show: open the RDS section, the table, or the code.</li>
<li><strong>If you do not know</strong> — say so, and say how you would find out. Guessing is worse.</li>
</ul>
<p class="nhan">Graded under Team working 20% (and it confirms the other 80%)</p>
<ul>
<li>A member who cannot answer about his/her own screen pulls down both the team-working mark and the examiners' trust in the product.</li>
</ul>
<p class="ghi-chu">The full list of questions examiners actually ask is in lesson 7.3.</p>`,
        `<p class="y-chinh">🎯 Q&amp;A là lúc giám khảo tách phần việc của cả nhóm khỏi mức hiểu của từng người.</p>
<ul>
<li><strong>Ai trả lời</strong> — người phụ trách màn hình hay tài liệu đang được hỏi; leader chỉ điều phối câu hỏi.</li>
<li><strong>Trả lời thế nào</strong> — một hai câu, rồi cho xem: mở mục trong RDS, cái bảng, hoặc đoạn code.</li>
<li><strong>Nếu không biết</strong> — nói thật, và nói bạn sẽ tìm ra bằng cách nào. Đoán mò còn tệ hơn.</li>
</ul>
<p class="nhan">Được chấm ở Team working 20% (và nó xác nhận 80% còn lại)</p>
<ul>
<li>Thành viên không trả lời được về chính màn hình của mình kéo tụt cả điểm team working lẫn niềm tin của giám khảo vào sản phẩm.</li>
</ul>
<p class="ghi-chu">Danh sách đầy đủ các câu giám khảo thực sự hay hỏi nằm ở bài 7.3.</p>`],
    ]),
    bi(`<h3>Mistakes that lose marks — by criterion</h3>
<table>
<thead><tr><th>Criterion</th><th>Typical mistake</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>Team working 20%</td><td>One person presents and answers everything; slides read aloud word by word; time runs out before the demo</td><td>Each member presents his/her part; a timed run-sheet; the demo starts by minute 6</td></tr>
<tr><td>Product 40%</td><td>Demo on a half-merged build; login fails; data typed live; "this part works on my laptop"</td><td>Demo the tagged final build with seed data; a backup video; rehearse the exact clicks</td></tr>
<tr><td>Requirement 20%</td><td>Use cases that were never built; no actor for the admin; business rules only in someone's head</td><td>Completed use cases only; one diagram per actor; point to the BR list in the RDS</td></tr>
<tr><td>Design 20%</td><td>ERD that differs from the real script; package diagram copied from the template</td><td>Export the ERD from the actual database; draw packages from the repository tree</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Assertion–evidence slides.</strong> Research on engineering presentations (the "assertion–evidence" approach taught in many engineering schools) shows audiences remember more when each slide title is a full-sentence claim and the body is visual evidence, not bullet lists. Apply it to the template: title slide 6 "Every application is unique per freelancer and post" and show the <code>JobApply</code> table with its UNIQUE key — the examiners get your design decision before they ask.</div>`,
      `<h3>Các lỗi làm mất điểm — theo từng tiêu chí</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Lỗi thường gặp</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Team working 20%</td><td>Một người trình bày và trả lời hết; đọc nguyên văn slide; hết giờ trước khi kịp demo</td><td>Mỗi thành viên trình bày phần của mình; có bảng phân thời gian; demo bắt đầu trước phút thứ 6</td></tr>
<tr><td>Product 40%</td><td>Demo trên bản merge dở; đăng nhập lỗi; gõ dữ liệu tại chỗ; "phần này chạy trên máy em"</td><td>Demo bản cuối đã gắn tag với dữ liệu mẫu; có video dự phòng; tập đúng từng cú bấm</td></tr>
<tr><td>Requirement 20%</td><td>Use case chưa từng được làm; không có actor admin; business rule chỉ nằm trong đầu một người</td><td>Chỉ use case đã xong; mỗi actor một sơ đồ; chỉ vào danh sách BR trong RDS</td></tr>
<tr><td>Design 20%</td><td>ERD khác với script thật; package diagram chép từ template</td><td>Xuất ERD từ chính database; vẽ package theo cây thư mục của repository</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Slide "khẳng định – bằng chứng" (assertion–evidence).</strong> Các nghiên cứu về thuyết trình kỹ thuật (cách tiếp cận "assertion–evidence" được dạy ở nhiều trường kỹ thuật) cho thấy người nghe nhớ nhiều hơn khi tiêu đề mỗi slide là một câu khẳng định trọn vẹn và phần thân là bằng chứng trực quan, không phải gạch đầu dòng. Áp vào template: đặt tiêu đề slide 6 là "Mỗi freelancer chỉ ứng tuyển một post một lần" và chiếu bảng <code>JobApply</code> với khoá UNIQUE — giám khảo nắm quyết định thiết kế của bạn trước khi kịp hỏi.</div>`),
    books([
      ['sommerville', 'Ch. 2 Software processes (incremental delivery) and Ch. 22.3 Teamwork', 'Chương 2 Software processes (incremental delivery) và mục 22.3 Teamwork'],
      ['fowler', 'Ch. 9 Use case diagrams; Ch. 7 Package diagrams', 'Chương 9 Use case diagrams; Chương 7 Package diagrams'],
      ['gomaa', 'Ch. 6 Use case modeling; Ch. 7 Static modeling (entities)', 'Chương 6 Use case modeling; Chương 7 Static modeling (entity)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 7.3 Template7 slide by slide + run-sheet, demo, Q&A, rehearsal (t-present 1–9) ─────────────── */
const L73 = {
  title: '7.3 — Template7 filled in, a 15-minute run-sheet, demo script, Q&A list & rehearsal checklist|||7.3 — Điền Template7, kịch bản 15 phút, kịch bản demo, danh sách Q&A & checklist tập dượt',
  slug: 'swp391-7-3-presentation-template-demo-qa',
  type: 'VIDEO',
  description: 'Template7 Project Presentation trang 1–9 điền cho một hệ thống thật (Job IT for Freelancer); phân thời gian 15 phút, kịch bản demo, các câu hỏi giám khảo hay hỏi về yêu cầu, thiết kế, quyền sở hữu code; checklist tập dượt và ngày thi.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.3 · Template7 Project Presentation, pages 1–9</span>
<h2>From the empty template to a presentation you can defend</h2>
<p class="lead">Template7 (2026) is the file you copy and fill: the same nine pages as the guide, in the university's layout. This lesson fills each page for a real SWP391-style system — <strong>Job IT for Freelancer</strong> (Guest, Freelancer, Recruiter, Admin) — then gives you the timing, the demo script, the questions examiners really ask and a rehearsal checklist.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>fill each of the 9 template pages with the right content for your own project;</li>
<li>run a presentation to a 15-minute plan and hand over between speakers cleanly;</li>
<li>prepare a demo that cannot fail silently, and answers to the typical questions on requirements, design and code ownership.</li>
</ul></div>
<p class="ghi-chu">The length of the session is fixed by the department for each semester; 15 minutes of presentation + demo followed by Q&amp;A is a common format — check the schedule your teacher announces and scale the run-sheet.</p>`,
      `<span class="eyebrow">Chương 7 · Bài 7.3 · Template7 Project Presentation, trang 1–9</span>
<h2>Từ template trống tới một bài thuyết trình bảo vệ được</h2>
<p class="lead">Template7 (2026) là file bạn sao chép và điền: đúng chín trang như bản hướng dẫn, theo bố cục của trường. Bài này điền từng trang cho một hệ thống kiểu SWP391 thật — <strong>Job IT for Freelancer</strong> (Guest, Freelancer, Recruiter, Admin) — rồi đưa bạn bảng phân thời gian, kịch bản demo, các câu giám khảo thực sự hỏi và checklist tập dượt.</p>
<div class="callout"><strong>Sau bài này bạn có thể:</strong>
<ul>
<li>điền đúng nội dung cho từng trang trong 9 trang template với đồ án của nhóm;</li>
<li>trình bày theo kế hoạch 15 phút và chuyển lượt giữa các người nói gọn gàng;</li>
<li>chuẩn bị một buổi demo không thể hỏng "im lặng", và câu trả lời cho các câu hỏi điển hình về yêu cầu, thiết kế và quyền sở hữu code.</li>
</ul></div>
<p class="ghi-chu">Thời lượng buổi bảo vệ do bộ môn quy định theo từng học kỳ; 15 phút trình bày + demo rồi Q&amp;A là một định dạng phổ biến — hãy xem lịch thầy/cô thông báo và co giãn bảng phân thời gian cho khớp.</p>`),
    walkHead('t-present', 1, 9, 'Each page below says what to write on it for Job IT for Freelancer, who presents it and which criterion it earns.', 'Mỗi trang dưới đây nói cần viết gì cho Job IT for Freelancer, ai trình bày và nó mang điểm ở tiêu chí nào.'),
    walk('t-present', [
      [1, 'Template cover — SWP391: FINAL PROJECT PRESENTATION, <<PROJECT/PRODUCT NAME + CODE>>',
        `<p class="y-chinh">🎯 Replace the placeholder with your product name and group code — and use the first 30 seconds to say what the product is for.</p>
<p class="nhan">Filled for our example</p>
<ul>
<li><strong>Title line</strong> — keep "SWP391: Final Project Presentation".</li>
<li><strong>Placeholder</strong> — "Job IT for Freelancer — &lt;class&gt;_&lt;group&gt;" exactly as in the RDS cover.</li>
</ul>
<p class="nhan">Who speaks · time</p>
<ul>
<li>Leader · 0:00–0:30 — greeting, one-sentence purpose, "we will show requirements, design, then a live demo".</li>
</ul>`,
        `<p class="y-chinh">🎯 Thay chỗ giữ chỗ bằng tên sản phẩm và mã nhóm — và dùng 30 giây đầu để nói sản phẩm dùng để làm gì.</p>
<p class="nhan">Điền cho ví dụ của ta</p>
<ul>
<li><strong>Dòng tiêu đề</strong> — giữ "SWP391: Final Project Presentation".</li>
<li><strong>Chỗ giữ chỗ</strong> — "Job IT for Freelancer — &lt;lớp&gt;_&lt;nhóm&gt;" đúng như bìa RDS.</li>
</ul>
<p class="nhan">Ai nói · thời gian</p>
<ul>
<li>Leader · 0:00–0:30 — chào, một câu mục đích, "nhóm sẽ trình bày yêu cầu, thiết kế, rồi demo trực tiếp".</li>
</ul>`],
      [2, 'Template — Project Overview',
        `<p class="y-chinh">🎯 Fill the three blocks with facts a stranger can verify.</p>
<p class="nhan">Filled for our example</p>
<ul>
<li><strong>Introduction &amp; scope</strong> — "A job board where companies post IT freelance projects and freelancers apply. 4 actors. Out of scope: payment, contracts, chat."</li>
<li><strong>Team</strong> — 5 rows: role + owned area (Leader: common &amp; home; Member 2: posts &amp; search; Member 3: freelancer profile; Member 4: recruiter; Member 5: admin).</li>
<li><strong>Management</strong> — weekly meeting + weekly report; GitLab issues with labels <code>Req</code>, <code>Task</code>, <code>Q&amp;A</code>, <code>Defect</code>, <code>Leakage</code>; status <code>1_To Do → 2_Doing → 3_Done</code>; 3 iteration tags.</li>
</ul>
<p class="nhan">Evidence to paste</p>
<ul>
<li>A screenshot of the issue board filtered by label, or the issue count per member.</li>
</ul>
<p class="nhan">Who speaks · time</p>
<ul>
<li>Leader · 0:30–2:00 · Team working 20%.</li>
</ul>`,
        `<p class="y-chinh">🎯 Điền ba khối bằng các dữ kiện người lạ cũng kiểm được.</p>
<p class="nhan">Điền cho ví dụ của ta</p>
<ul>
<li><strong>Giới thiệu &amp; phạm vi</strong> — "Một trang việc làm nơi công ty đăng dự án IT freelance và freelancer ứng tuyển. 4 actor. Ngoài phạm vi: thanh toán, hợp đồng, chat."</li>
<li><strong>Thành viên</strong> — 5 dòng: vai trò + mảng phụ trách (Leader: phần chung &amp; trang chủ; TV2: tin đăng &amp; tìm kiếm; TV3: hồ sơ freelancer; TV4: recruiter; TV5: admin).</li>
<li><strong>Quản lý</strong> — họp tuần + báo cáo tuần; issue GitLab với label <code>Req</code>, <code>Task</code>, <code>Q&amp;A</code>, <code>Defect</code>, <code>Leakage</code>; trạng thái <code>1_To Do → 2_Doing → 3_Done</code>; 3 tag iteration.</li>
</ul>
<p class="nhan">Bằng chứng nên dán vào</p>
<ul>
<li>Ảnh chụp bảng issue lọc theo label, hoặc số issue của từng thành viên.</li>
</ul>
<p class="nhan">Ai nói · thời gian</p>
<ul>
<li>Leader · 0:30–2:00 · Team working 20%.</li>
</ul>`],
      [3, 'Template — Use Case Diagrams',
        `<p class="y-chinh">🎯 One diagram per actor, containing only the use cases that are finished in the final build.</p>
<p class="nhan">Filled for our example</p>
<ul>
<li><strong>Guest</strong> — Register, Login, View home page, Search post, View post detail, View company detail.</li>
<li><strong>Freelancer</strong> — Edit profile, Apply job, View list apply, Add/Remove favourite post, Report post.</li>
<li><strong>Recruiter</strong> — Create/Update post, View my posts, Manage applicants, Mark freelancer, Dashboard.</li>
<li><strong>Admin</strong> — Dashboard, Activate/Suspend freelancer and recruiter, Approve/Suspend project, Manage skills, categories, blogs.</li>
</ul>
<p class="nhan">Who speaks · time</p>
<ul>
<li>Each owner points to his/her use cases · 2:00–3:30 · Requirement 20%.</li>
</ul>
<div class="pitfall">Four diagrams on one slide at 30% zoom. Use two slides if needed — readability beats the page count.</div>`,
        `<p class="y-chinh">🎯 Mỗi actor một sơ đồ, chỉ gồm các use case đã hoàn thành trong bản cuối.</p>
<p class="nhan">Điền cho ví dụ của ta</p>
<ul>
<li><strong>Guest</strong> — Register, Login, View home page, Search post, View post detail, View company detail.</li>
<li><strong>Freelancer</strong> — Edit profile, Apply job, View list apply, Add/Remove favourite post, Report post.</li>
<li><strong>Recruiter</strong> — Create/Update post, View my posts, Manage applicants, Mark freelancer, Dashboard.</li>
<li><strong>Admin</strong> — Dashboard, Activate/Suspend freelancer và recruiter, Approve/Suspend project, quản lý skill, category, blog.</li>
</ul>
<p class="nhan">Ai nói · thời gian</p>
<ul>
<li>Mỗi người chỉ vào use case của mình · 2:00–3:30 · Requirement 20%.</li>
</ul>
<div class="pitfall">Bốn sơ đồ nhét vào một slide ở mức zoom 30%. Cần thì dùng hai slide — dễ đọc quan trọng hơn số trang.</div>`],
    ]),
    walk('t-present', [
      [4, 'Template — Product Functionalities (screen flow + Non-UI functions)',
        `<p class="y-chinh">🎯 Draw the screen flow of the final build and list the functions that have no screen.</p>
<p class="nhan">Filled for our example</p>
<ul>
<li><strong>Public</strong> — Home → Search post → Post detail → Company detail; Home → Login / Register (freelancer or recruiter) / Forgot password.</li>
<li><strong>Freelancer</strong> — Profile → Edit profile; Post detail → Apply job → List apply; Favourites.</li>
<li><strong>Recruiter</strong> — Dashboard → My posts → Create/Update post → Manage applicants → Freelancer approved.</li>
<li><strong>Admin</strong> — Dashboard → Freelancer / Recruiter / Project / Skill / Category / Blog lists → details, activate/suspend.</li>
<li><strong>Non-UI</strong> — "Reset password by e-mail" (sends a link through the mail service), "Log out" (invalidates the session).</li>
</ul>
<p class="nhan">Who speaks · time</p>
<ul>
<li>The member who edited the RDS "Screens Flow" · 3:30–4:30 · Requirement 20%.</li>
</ul>`,
        `<p class="y-chinh">🎯 Vẽ screen flow của bản cuối và liệt kê các chức năng không có màn hình.</p>
<p class="nhan">Điền cho ví dụ của ta</p>
<ul>
<li><strong>Công khai</strong> — Home → Search post → Post detail → Company detail; Home → Login / Register (freelancer hoặc recruiter) / Forgot password.</li>
<li><strong>Freelancer</strong> — Profile → Edit profile; Post detail → Apply job → List apply; Favourites.</li>
<li><strong>Recruiter</strong> — Dashboard → My posts → Create/Update post → Manage applicants → Freelancer approved.</li>
<li><strong>Admin</strong> — Dashboard → danh sách Freelancer / Recruiter / Project / Skill / Category / Blog → chi tiết, kích hoạt/tạm khoá.</li>
<li><strong>Non-UI</strong> — "Reset password qua e-mail" (gửi link qua dịch vụ mail), "Log out" (huỷ phiên đăng nhập).</li>
</ul>
<p class="nhan">Ai nói · thời gian</p>
<ul>
<li>Người biên tập mục "Screens Flow" của RDS · 3:30–4:30 · Requirement 20%.</li>
</ul>`],
      [5, 'Template — Main Screen UI Design',
        `<p class="y-chinh">🎯 Two clean screenshots: the public home page and the admin (or recruiter) dashboard.</p>
<p class="nhan">Filled for our example</p>
<ul>
<li><strong>Home page</strong> — search bar, latest posts, categories, top companies — with realistic seed posts, never "Lorem ipsum".</li>
<li><strong>Dashboard</strong> — the recruiter dashboard (posts and applications per month) or the admin dashboard (users, posts, applications).</li>
</ul>
<p class="nhan">Who speaks · time</p>
<ul>
<li>The owners of the two screens · 4:30–5:00 · Product 40% (first impression).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the screenshot must look exactly like what the demo will show one minute later.</p>`,
        `<p class="y-chinh">🎯 Hai ảnh chụp gọn: trang chủ công khai và dashboard của admin (hoặc recruiter).</p>
<p class="nhan">Điền cho ví dụ của ta</p>
<ul>
<li><strong>Trang chủ</strong> — ô tìm kiếm, tin mới nhất, danh mục, công ty nổi bật — với dữ liệu mẫu giống thật, không bao giờ "Lorem ipsum".</li>
<li><strong>Dashboard</strong> — dashboard recruiter (số tin và số đơn theo tháng) hoặc dashboard admin (người dùng, tin, đơn ứng tuyển).</li>
</ul>
<p class="nhan">Ai nói · thời gian</p>
<ul>
<li>Người phụ trách hai màn hình đó · 4:30–5:00 · Product 40% (ấn tượng đầu).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ảnh chụp phải giống hệt thứ demo sẽ cho thấy một phút sau.</p>`],
      [6, 'Template — Database Design',
        `<p class="y-chinh">🎯 Paste the ERD generated from your real database and be ready to justify three decisions.</p>
<p class="nhan">Filled for our example (22 tables in the sample script)</p>
<ul>
<li><strong>Core</strong> — <code>User</code> (account + role) with profile tables <code>Freelancer</code>, <code>Recruiter</code>, <code>Company</code>.</li>
<li><strong>Jobs</strong> — <code>Post</code> → <code>Categories</code>, <code>JobType</code>, <code>Duration</code>; <code>JobApply</code> links freelancer and post.</li>
<li><strong>Skills</strong> — <code>Skill_Set</code> + <code>Skills</code> (freelancer ↔ skill, many-to-many).</li>
</ul>
<p class="nhan">Three decisions to explain</p>
<ol>
<li>Why a separate profile table per role instead of one wide user table.</li>
<li>How "a freelancer cannot apply twice / cannot cancel" (BR-11) is enforced — a unique key or a check in the DAO.</li>
<li>Soft delete (status column) vs real delete for posts and categories.</li>
</ol>
<p class="nhan">Who speaks · time</p>
<ul>
<li>The DB script owner · 5:00–5:45 · Design 20%.</li>
</ul>`,
        `<p class="y-chinh">🎯 Dán ERD sinh ra từ database thật và sẵn sàng giải thích ba quyết định.</p>
<p class="nhan">Điền cho ví dụ của ta (22 bảng trong script mẫu)</p>
<ul>
<li><strong>Lõi</strong> — <code>User</code> (tài khoản + role) cùng các bảng hồ sơ <code>Freelancer</code>, <code>Recruiter</code>, <code>Company</code>.</li>
<li><strong>Việc làm</strong> — <code>Post</code> → <code>Categories</code>, <code>JobType</code>, <code>Duration</code>; <code>JobApply</code> nối freelancer với post.</li>
<li><strong>Kỹ năng</strong> — <code>Skill_Set</code> + <code>Skills</code> (freelancer ↔ skill, nhiều-nhiều).</li>
</ul>
<p class="nhan">Ba quyết định cần giải thích</p>
<ol>
<li>Vì sao mỗi role có bảng hồ sơ riêng thay vì một bảng user thật rộng.</li>
<li>"Freelancer không được ứng tuyển hai lần / không được huỷ" (BR-11) được đảm bảo thế nào — khoá unique hay kiểm tra trong DAO.</li>
<li>Xoá mềm (cột status) hay xoá thật cho post và category.</li>
</ol>
<p class="nhan">Ai nói · thời gian</p>
<ul>
<li>Người phụ trách DB script · 5:00–5:45 · Design 20%.</li>
</ul>`],
    ]),
    walk('t-present', [
      [7, 'Template — Package Diagram',
        `<p class="y-chinh">🎯 Draw the packages that really exist in your repository and the direction of their dependencies.</p>
<p class="nhan">Filled for our example (Java servlet/JSP, as in the sample RDS "Code Packages")</p>
<ul>
<li><strong>controller</strong> — servlets that process requests for every feature.</li>
<li><strong>model</strong> — entity classes (User, Post, JobApply…).</li>
<li><strong>dal</strong> — DBContext + DAO classes that run the SQL.</li>
<li><strong>filter</strong> / <strong>util</strong> — role checks, password hashing, mail sending (if you have them).</li>
<li><strong>view</strong> — JSP pages under <code>web/</code>.</li>
</ul>
<p class="nhan">Who speaks · time</p>
<ul>
<li>The leader (or whoever set up the project skeleton) · 5:45–6:15 · Design 20%.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> have the IDE open on the project tree — "here is the dal package" is a 3-second proof.</p>`,
        `<p class="y-chinh">🎯 Vẽ các package thật sự có trong repository và chiều phụ thuộc giữa chúng.</p>
<p class="nhan">Điền cho ví dụ của ta (Java servlet/JSP, như mục "Code Packages" của RDS mẫu)</p>
<ul>
<li><strong>controller</strong> — các servlet xử lý request cho mọi tính năng.</li>
<li><strong>model</strong> — các lớp entity (User, Post, JobApply…).</li>
<li><strong>dal</strong> — DBContext + các lớp DAO chạy SQL.</li>
<li><strong>filter</strong> / <strong>util</strong> — kiểm tra role, băm mật khẩu, gửi mail (nếu nhóm có).</li>
<li><strong>view</strong> — các trang JSP trong <code>web/</code>.</li>
</ul>
<p class="nhan">Ai nói · thời gian</p>
<ul>
<li>Leader (hoặc người dựng khung dự án) · 5:45–6:15 · Design 20%.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mở sẵn IDE ở cây dự án — "đây là package dal" là bằng chứng 3 giây.</p>`],
      [8, 'Template — Demonstration (main workflows as swimlanes)',
        `<p class="y-chinh">🎯 Put one swimlane per workflow on this page, then switch to the browser and run exactly that path.</p>
<p class="nhan">Filled for our example — two workflows</p>
<ol>
<li><strong>Job post life</strong> — lanes Recruiter | Admin | Freelancer | Recruiter: Create post → Approve project → Search &amp; Apply job → Manage applicants (accept).</li>
<li><strong>Account control</strong> — lanes Guest | Admin: Register → Admin suspends the account → login refused with a message.</li>
</ol>
<p class="nhan">Who speaks · time</p>
<ul>
<li>Every member drives the screens he/she owns inside the flow · 6:15–13:00 · Product 40%.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The demo that only shows lists.</strong> Opening ten list pages proves little. Examiners want to see data <em>created</em> in one screen appear in another screen of another role — that is what a workflow is.</div>`,
        `<p class="y-chinh">🎯 Đặt mỗi luồng một swimlane trên trang này, rồi chuyển sang trình duyệt và chạy đúng con đường đó.</p>
<p class="nhan">Điền cho ví dụ của ta — hai luồng</p>
<ol>
<li><strong>Vòng đời tin tuyển dụng</strong> — các làn Recruiter | Admin | Freelancer | Recruiter: Create post → Approve project → Search &amp; Apply job → Manage applicants (chấp nhận).</li>
<li><strong>Kiểm soát tài khoản</strong> — các làn Guest | Admin: Register → Admin tạm khoá tài khoản → đăng nhập bị từ chối kèm thông báo.</li>
</ol>
<p class="nhan">Ai nói · thời gian</p>
<ul>
<li>Mỗi thành viên tự thao tác các màn hình mình phụ trách trong luồng · 6:15–13:00 · Product 40%.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Buổi demo chỉ mở danh sách.</strong> Mở mười trang danh sách chứng minh được rất ít. Giám khảo muốn thấy dữ liệu được <em>tạo</em> ở một màn hình xuất hiện ở màn hình khác của một vai trò khác — đó mới là một luồng.</div>`],
      [9, 'Template — Q&A',
        `<p class="y-chinh">🎯 Leave this page on screen while you answer; keep the RDS, the ERD and the IDE open in other tabs.</p>
<ul>
<li><strong>13:00–15:00</strong> — the leader thanks the examiners and invites questions (then the Q&amp;A continues as long as they want).</li>
<li><strong>Routing</strong> — the leader repeats the question in one line and names the owner who answers.</li>
<li><strong>Evidence</strong> — every answer ends with "let me show you" when possible.</li>
</ul>`,
        `<p class="y-chinh">🎯 Để trang này trên màn hình khi trả lời; mở sẵn RDS, ERD và IDE ở các tab khác.</p>
<ul>
<li><strong>13:00–15:00</strong> — leader cảm ơn giám khảo và mời đặt câu hỏi (sau đó Q&amp;A kéo dài tuỳ giám khảo).</li>
<li><strong>Điều phối</strong> — leader nhắc lại câu hỏi trong một dòng và gọi tên người phụ trách trả lời.</li>
<li><strong>Bằng chứng</strong> — câu trả lời nào làm được thì kết thúc bằng "em xin cho thầy/cô xem".</li>
</ul>`],
    ]),
    bi(`<h3>The 15-minute run-sheet</h3>
<table>
<thead><tr><th>Time</th><th>Slide</th><th>Speaker</th><th>Goal</th></tr></thead>
<tbody>
<tr><td>0:00–0:30</td><td>1 Cover</td><td>Leader</td><td>name, one-sentence purpose, agenda</td></tr>
<tr><td>0:30–2:00</td><td>2 Overview</td><td>Leader</td><td>scope, team &amp; owned areas, GitLab evidence</td></tr>
<tr><td>2:00–3:30</td><td>3 Use cases</td><td>each owner (20–30 s)</td><td>completed use cases per actor</td></tr>
<tr><td>3:30–4:30</td><td>4 Screen flow</td><td>RDS editor</td><td>all screens + Non-UI functions</td></tr>
<tr><td>4:30–5:00</td><td>5 Main UI</td><td>screen owners</td><td>home + dashboard</td></tr>
<tr><td>5:00–6:15</td><td>6 DB, 7 Packages</td><td>DB owner, leader</td><td>schema + 3 decisions, code structure</td></tr>
<tr><td>6:15–13:00</td><td>8 Demo</td><td>every member</td><td>2 workflows live, one rule/error path each</td></tr>
<tr><td>13:00–15:00</td><td>9 Q&amp;A</td><td>Leader routes</td><td>buffer, then questions</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> the demo gets almost half the time because the product carries 40% of the mark.</p>
<h3>The demo script (write it, then rehearse it)</h3>
<ol>
<li><strong>Before the session</strong> — run the tagged final build; restore the DB from the script in the tag; log out of everything; close chats and notifications; set browser zoom to 125%.</li>
<li><strong>Accounts ready</strong> — one browser profile (or incognito window) per role: recruiter, admin, freelancer, already on the login page, passwords in a note.</li>
<li><strong>Seed data</strong> — enough realistic rows that lists and the dashboard look alive (e.g. 20 posts, 3 companies, 10 applications).</li>
<li><strong>Workflow 1</strong> — Recruiter creates "Java backend developer, 3 months"; Admin approves it; Freelancer finds it by search and applies; tries to apply again → refused (BR-11); Recruiter accepts the application.</li>
<li><strong>Workflow 2</strong> — Admin suspends a freelancer; that freelancer's login shows the "account suspended" message; a freelancer typing the admin URL is redirected.</li>
<li><strong>Close</strong> — the dashboard now shows the new post and application: the loop is closed.</li>
<li><strong>Plan B</strong> — a recorded video of both workflows (the iteration-3 demo videos are a good base), opened in a tab.</li>
</ol>`,
      `<h3>Bảng phân thời gian 15 phút</h3>
<table>
<thead><tr><th>Thời gian</th><th>Slide</th><th>Người nói</th><th>Mục tiêu</th></tr></thead>
<tbody>
<tr><td>0:00–0:30</td><td>1 Bìa</td><td>Leader</td><td>tên, một câu mục đích, dàn bài</td></tr>
<tr><td>0:30–2:00</td><td>2 Tổng quan</td><td>Leader</td><td>phạm vi, thành viên &amp; mảng phụ trách, bằng chứng GitLab</td></tr>
<tr><td>2:00–3:30</td><td>3 Use case</td><td>từng người (20–30 giây)</td><td>use case đã xong theo actor</td></tr>
<tr><td>3:30–4:30</td><td>4 Screen flow</td><td>người biên tập RDS</td><td>mọi màn hình + chức năng Non-UI</td></tr>
<tr><td>4:30–5:00</td><td>5 UI chính</td><td>người phụ trách màn hình</td><td>trang chủ + dashboard</td></tr>
<tr><td>5:00–6:15</td><td>6 DB, 7 Package</td><td>người phụ trách DB, leader</td><td>schema + 3 quyết định, cấu trúc code</td></tr>
<tr><td>6:15–13:00</td><td>8 Demo</td><td>mọi thành viên</td><td>2 luồng chạy trực tiếp, mỗi luồng một quy tắc/đường lỗi</td></tr>
<tr><td>13:00–15:00</td><td>9 Q&amp;A</td><td>Leader điều phối</td><td>thời gian đệm, rồi câu hỏi</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> demo chiếm gần nửa thời gian vì sản phẩm mang 40% số điểm.</p>
<h3>Kịch bản demo (viết ra, rồi tập theo)</h3>
<ol>
<li><strong>Trước buổi bảo vệ</strong> — chạy bản cuối đã gắn tag; khôi phục DB từ script trong tag; đăng xuất mọi thứ; tắt chat và thông báo; đặt zoom trình duyệt 125%.</li>
<li><strong>Tài khoản sẵn sàng</strong> — mỗi vai trò một profile trình duyệt (hoặc cửa sổ ẩn danh): recruiter, admin, freelancer, đã mở sẵn trang đăng nhập, mật khẩu ghi trong một ghi chú.</li>
<li><strong>Dữ liệu mẫu</strong> — đủ nhiều dòng giống thật để danh sách và dashboard trông "sống" (vd 20 tin, 3 công ty, 10 đơn ứng tuyển).</li>
<li><strong>Luồng 1</strong> — Recruiter tạo "Java backend developer, 3 tháng"; Admin duyệt; Freelancer tìm thấy bằng ô tìm kiếm và ứng tuyển; thử ứng tuyển lần nữa → bị từ chối (BR-11); Recruiter chấp nhận đơn.</li>
<li><strong>Luồng 2</strong> — Admin tạm khoá một freelancer; freelancer đó đăng nhập thấy thông báo "tài khoản bị khoá"; freelancer gõ URL trang admin bị chuyển hướng.</li>
<li><strong>Kết</strong> — dashboard giờ hiện tin và đơn mới: vòng lặp khép kín.</li>
<li><strong>Phương án B</strong> — video quay sẵn hai luồng (video demo của iteration 3 là nền tốt), mở sẵn trong một tab.</li>
</ol>`),
    bi(`<h3>Q&amp;A preparation — the questions examiners actually ask</h3>
<p class="nhan">Requirements (20%)</p>
<ol>
<li>"Who are your actors, and what can a Recruiter do that a Freelancer cannot?" → screen authorization matrix.</li>
<li>"Show me the business rules of Apply Job." → BR list in the RDS; the code that enforces it.</li>
<li>"Which use cases did you drop, and why?" → limitations &amp; exclusions; confirmed with the teacher as customer.</li>
<li>"What happens if the post has expired / the account is suspended?" → alternative flows and exceptions.</li>
</ol>
<p class="nhan">Design (20%)</p>
<ol>
<li>"Explain this relationship / why this table exists." → keys, cardinality, normal form.</li>
<li>"Where is authorization checked?" → filter or controller, per role.</li>
<li>"Walk one request through your packages." → URL → controller → DAO → SQL → JSP.</li>
<li>"How are passwords stored?" → hashed, never plain text.</li>
</ol>
<p class="nhan">Code ownership (Product 40%)</p>
<ol>
<li>"Open the code of your screen and show where the validation is."</li>
<li>"Change this label / add a check here" — a small live change.</li>
<li>"What does this SQL return if the list is empty?"</li>
<li>"Which parts were generated by AI, and what did you change?" → AI Usage Report rows.</li>
</ol>
<p class="nhan">Team &amp; process (20%)</p>
<ol>
<li>"How did you split the work? How do we know who did what?" → Project Tracking, issues, commits.</li>
<li>"What went wrong, and what would you do differently?" → one honest retrospective lesson.</li>
</ol>
<h3>Rehearsal checklist</h3>
<ol>
<li>Two full timed rehearsals on the final build, on the machine and network you will use.</li>
<li>Each member rehearses his/her own 2–3 sentences and the hand-over line to the next speaker.</li>
<li>A teammate plays examiner and asks every question above to every member.</li>
<li>Slides: readable at the back of the room, no text smaller than 18 pt, diagrams zoomed.</li>
<li>Plan B tested: the backup video plays offline; the DB restore script works.</li>
<li>On the day: arrive early, test projector resolution, power, and the login of every role.</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Answer with the "PREP" shape.</strong> Point (one-sentence answer) → Reason → Example/Evidence (show it) → Point again. It keeps answers under 40 seconds and always ends on the claim the examiner can write down.</div>`,
      `<h3>Chuẩn bị Q&amp;A — những câu giám khảo thực sự hỏi</h3>
<p class="nhan">Yêu cầu (20%)</p>
<ol>
<li>"Hệ thống có những actor nào, Recruiter làm được gì mà Freelancer không làm được?" → ma trận phân quyền màn hình.</li>
<li>"Cho xem các business rule của Apply Job." → danh sách BR trong RDS; đoạn code đảm bảo nó.</li>
<li>"Nhóm bỏ use case nào, vì sao?" → limitations &amp; exclusions; đã xác nhận với thầy/cô trong vai khách hàng.</li>
<li>"Nếu tin đã hết hạn / tài khoản bị khoá thì sao?" → luồng thay thế và ngoại lệ.</li>
</ol>
<p class="nhan">Thiết kế (20%)</p>
<ol>
<li>"Giải thích quan hệ này / vì sao có bảng này." → khoá, bản số, dạng chuẩn.</li>
<li>"Phân quyền được kiểm ở đâu?" → filter hoặc controller, theo từng role.</li>
<li>"Đi một request qua các package." → URL → controller → DAO → SQL → JSP.</li>
<li>"Mật khẩu lưu thế nào?" → băm, không bao giờ để nguyên văn.</li>
</ol>
<p class="nhan">Quyền sở hữu code (Product 40%)</p>
<ol>
<li>"Mở code màn hình của em và chỉ chỗ validate."</li>
<li>"Đổi nhãn này / thêm một kiểm tra ở đây" — sửa nhỏ trực tiếp.</li>
<li>"Câu SQL này trả về gì nếu danh sách rỗng?"</li>
<li>"Phần nào do AI sinh, em đã sửa gì?" → các dòng trong AI Usage Report.</li>
</ol>
<p class="nhan">Nhóm &amp; quy trình (20%)</p>
<ol>
<li>"Nhóm chia việc thế nào? Làm sao biết ai làm gì?" → Project Tracking, issue, commit.</li>
<li>"Điều gì đã không ổn, làm lại em sẽ làm khác gì?" → một bài học retrospective thật.</li>
</ol>
<h3>Checklist tập dượt</h3>
<ol>
<li>Hai lần tập đầy đủ có bấm giờ trên bản cuối, trên đúng máy và mạng sẽ dùng.</li>
<li>Mỗi thành viên tập 2–3 câu của mình và câu chuyển lượt sang người tiếp theo.</li>
<li>Một bạn đóng vai giám khảo, hỏi mọi câu ở trên với từng thành viên.</li>
<li>Slide: đọc được từ cuối phòng, không chữ nào nhỏ hơn 18 pt, sơ đồ đã phóng to.</li>
<li>Đã thử phương án B: video dự phòng chạy offline; script khôi phục DB chạy được.</li>
<li>Ngày thi: đến sớm, thử độ phân giải máy chiếu, nguồn điện, và đăng nhập của mọi role.</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Trả lời theo khuôn "PREP".</strong> Point (câu trả lời một câu) → Reason (lý do) → Example/Evidence (cho xem) → Point nhắc lại. Nó giữ câu trả lời dưới 40 giây và luôn kết thúc bằng khẳng định giám khảo ghi lại được.</div>`),
    books([
      ['sommerville', 'Ch. 8 Software testing — 8.4 User testing (acceptance demos)', 'Chương 8 Software testing — mục 8.4 User testing (demo nghiệm thu)'],
      ['wiegers', 'Ch. 9 Playing by the rules (business rules)', 'Chương 9 Playing by the rules (business rules)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 7.4 The RDS document (structure) ─────────────────────── */
const L74 = {
  title: '7.4 — The RDS document: structure of a real Requirement & Design Specification|||7.4 — Tài liệu RDS: cấu trúc một bản Requirement & Design Specification thật',
  slug: 'swp391-7-4-rds-document',
  type: 'VIDEO',
  description: 'RDS nộp mỗi iteration: Record of Changes, Overview (vision & scope, actors, use cases, screens flow, screen descriptions, authorization, non-UI functions, DB design, code packages), Requirement Specifications theo tính năng kèm business rules, Screen Designs, Code Designs, Appendix; đối chiếu với SRS/SDS Template 2026.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.4 · RDS document</span>
<h2>The RDS — one document that grows every iteration</h2>
<p class="lead">The <strong>RDS (Requirement &amp; Design Specification)</strong> is submitted at the end of every iteration: it contains "the detailed requirement and design specifications for the iteration and the updates for the previous iterations". By iteration 3 it describes the whole product — and it is the document the two examiners have open during your final presentation.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>lay out an RDS with the same five parts a real SWP391 team used;</li>
<li>fill the key tables — actors, screen authorization, non-UI functions, code packages, business rules;</li>
<li>write one feature's requirement specification with its business rules;</li>
<li>map the RDS onto the 2026 SRS (Template1) and SDS (Template2) templates.</li>
</ul></div>
<p class="ghi-chu">The structure below is taken from the sample team G5's RDS ("Job IT for Freelancer"). Its page-by-page walkthrough, with the real pages, is in the Sample project section — here we only study the skeleton and how to fill it.</p>`,
      `<span class="eyebrow">Chương 7 · Bài 7.4 · Tài liệu RDS</span>
<h2>RDS — một tài liệu lớn dần qua từng iteration</h2>
<p class="lead"><strong>RDS (Requirement &amp; Design Specification)</strong> được nộp vào cuối mỗi iteration: nó chứa "đặc tả chi tiết yêu cầu và thiết kế của iteration và các cập nhật cho những iteration trước". Tới iteration 3 nó mô tả toàn bộ sản phẩm — và là tài liệu hai giám khảo mở sẵn trong buổi thuyết trình cuối của bạn.</p>
<div class="callout"><strong>Sau bài này bạn có thể:</strong>
<ul>
<li>dựng bố cục RDS gồm đúng năm phần mà một nhóm SWP391 thật đã dùng;</li>
<li>điền các bảng then chốt — actor, phân quyền màn hình, chức năng non-UI, code package, business rule;</li>
<li>viết đặc tả yêu cầu của một tính năng kèm business rule;</li>
<li>đối chiếu RDS với các template SRS (Template1) và SDS (Template2) năm 2026.</li>
</ul></div>
<p class="ghi-chu">Cấu trúc dưới đây lấy từ RDS của nhóm mẫu G5 ("Job IT for Freelancer"). Phần đi qua từng trang, với các trang thật, nằm ở mục Sample project — ở đây ta chỉ học bộ khung và cách điền.</p>`),
    bi(`<h3>1. The skeleton — five parts plus a change log</h3>
<table>
<thead><tr><th>Part</th><th>Sections</th><th>What it answers</th></tr></thead>
<tbody>
<tr><td><strong>Cover + Record of Changes</strong></td><td>version · date · A/M/D (Added, Modified, Deleted) · in charge · change description</td><td>who changed what, and when — your contribution trail</td></tr>
<tr><td><strong>I. Overview</strong></td><td>1 Vision &amp; Scope (product vision, scope, context diagram) · 2 User Requirements (2.1 Actors, 2.2 Use Cases: diagrams + descriptions) · 3 Overall Functionalities (3.1 Screens Flow, 3.2 Screen Descriptions, 3.3 Screen Authorization, 3.4 Non-UI Functions) · 4 System High Level Design (4.1 Database Design, 4.2 Code Packages)</td><td>the whole product on a few pages</td></tr>
<tr><td><strong>II. Requirement Specifications</strong></td><td>grouped by feature (Common, Admin, Freelancer, Recruiter…); per function: a. Functional Description (use case spec) · b. Business Rules</td><td>exactly what each function must do</td></tr>
<tr><td><strong>III. Screen Designs</strong></td><td>per screen: layout image + field table (field, type, data type, description / validation)</td><td>what the user sees and enters</td></tr>
<tr><td><strong>IV. Code Designs</strong></td><td>per function: Class Diagram · Sequence Diagram(s) · Database Queries (the SQL)</td><td>how the code implements it</td></tr>
<tr><td><strong>V. Appendix</strong></td><td>1 Assumptions &amp; Dependencies (AS-x) · 2 Limitations &amp; Exclusions (EX-x) · 3 Business Rules (BR-xx table)</td><td>the shared rules and boundaries</td></tr>
</tbody>
</table>
<p class="nhan">How it grows across iterations</p>
<ol>
<li><strong>Iteration 1</strong> — Part I nearly complete for the whole scope (all actors, use case diagrams, first screen flow); Parts II–IV only for iteration-1 screens.</li>
<li><strong>Iteration 2</strong> — add Parts II–IV for iteration-2 screens; update the screen flow, authorization matrix and ERD; log the changes.</li>
<li><strong>Iteration 3</strong> — the final package: every completed screen specified, designed and traced; Part I matches the final build exactly.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Personal data in the change log.</strong> A Record of Changes filled with usernames and student IDs travels with every copy of the document. Use role labels or initials agreed in the team, and keep the member table on the cover only where the template requires it.</div>`,
      `<h3>1. Bộ khung — năm phần cộng một nhật ký thay đổi</h3>
<table>
<thead><tr><th>Phần</th><th>Các mục</th><th>Trả lời câu hỏi gì</th></tr></thead>
<tbody>
<tr><td><strong>Bìa + Record of Changes</strong></td><td>version · ngày · A/M/D (Added, Modified, Deleted) · người phụ trách · mô tả thay đổi</td><td>ai đổi gì, khi nào — dấu vết đóng góp của bạn</td></tr>
<tr><td><strong>I. Overview</strong></td><td>1 Vision &amp; Scope (tầm nhìn sản phẩm, phạm vi, context diagram) · 2 User Requirements (2.1 Actors, 2.2 Use Cases: sơ đồ + mô tả) · 3 Overall Functionalities (3.1 Screens Flow, 3.2 Screen Descriptions, 3.3 Screen Authorization, 3.4 Non-UI Functions) · 4 System High Level Design (4.1 Database Design, 4.2 Code Packages)</td><td>toàn bộ sản phẩm trong vài trang</td></tr>
<tr><td><strong>II. Requirement Specifications</strong></td><td>nhóm theo tính năng (Common, Admin, Freelancer, Recruiter…); mỗi chức năng: a. Functional Description (đặc tả use case) · b. Business Rules</td><td>chính xác mỗi chức năng phải làm gì</td></tr>
<tr><td><strong>III. Screen Designs</strong></td><td>mỗi màn hình: ảnh bố cục + bảng trường (field, type, data type, mô tả / validate)</td><td>người dùng thấy và nhập gì</td></tr>
<tr><td><strong>IV. Code Designs</strong></td><td>mỗi chức năng: Class Diagram · Sequence Diagram · Database Queries (câu SQL)</td><td>code hiện thực nó thế nào</td></tr>
<tr><td><strong>V. Appendix</strong></td><td>1 Assumptions &amp; Dependencies (AS-x) · 2 Limitations &amp; Exclusions (EX-x) · 3 Business Rules (bảng BR-xx)</td><td>các quy tắc chung và ranh giới</td></tr>
</tbody>
</table>
<p class="nhan">Tài liệu lớn dần qua các iteration thế nào</p>
<ol>
<li><strong>Iteration 1</strong> — Phần I gần đầy đủ cho toàn bộ phạm vi (mọi actor, sơ đồ use case, screen flow đầu tiên); Phần II–IV chỉ cho các màn hình iteration 1.</li>
<li><strong>Iteration 2</strong> — thêm Phần II–IV cho màn hình iteration 2; cập nhật screen flow, ma trận phân quyền và ERD; ghi lại thay đổi.</li>
<li><strong>Iteration 3</strong> — gói cuối: mọi màn hình đã xong đều được đặc tả, thiết kế và truy vết; Phần I khớp hoàn toàn với bản build cuối.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Dữ liệu cá nhân trong nhật ký thay đổi.</strong> Record of Changes chứa đầy username và mã số sinh viên sẽ đi theo mọi bản sao của tài liệu. Hãy dùng nhãn vai trò hoặc chữ viết tắt nhóm thống nhất, và chỉ để bảng thành viên ở bìa nơi template yêu cầu.</div>`),
    bi(`<h3>2. Part I — the tables that carry the most marks</h3>
<p class="nhan">2.1 Actors (# · Actor · Description)</p>
<table>
<thead><tr><th>#</th><th>Actor</th><th>Description (responsibilities, not screens)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Administrator</td><td>operates the site; verifies freelancers and recruiters; enforces the site's rules</td></tr>
<tr><td>2</td><td>Recruiter</td><td>a company or person that posts IT jobs and reviews freelancer profiles</td></tr>
<tr><td>3</td><td>Freelancer</td><td>searches and applies for jobs; manages a profile with skills, experience, education</td></tr>
<tr><td>4</td><td>Guest</td><td>not logged in; views and searches jobs, companies and freelancers; can register</td></tr>
</tbody>
</table>
<p class="nhan">3.3 Screen Authorization (screen × role, X = allowed) — an excerpt</p>
<table>
<thead><tr><th>Screen</th><th>Guest</th><th>Freelancer</th><th>Recruiter</th><th>Admin</th></tr></thead>
<tbody>
<tr><td>Register</td><td>X</td><td></td><td></td><td></td></tr>
<tr><td>Home page</td><td>X</td><td>X</td><td>X</td><td>X</td></tr>
<tr><td>Create post</td><td></td><td></td><td>X</td><td></td></tr>
<tr><td>Apply job</td><td></td><td>X</td><td></td><td></td></tr>
<tr><td>Change status account Freelancer</td><td></td><td></td><td></td><td>X</td></tr>
</tbody>
</table>
<p class="ghi-chu">In the real G5 matrix, Register is ticked for Freelancer and Recruiter too, and Forget Password is not ticked for Guest — a logged-in user does not register again, and a guest is exactly who forgets a password. Examiners notice such contradictions; check the matrix against the filters in your code.</p>
<p class="nhan">3.4 Non-UI Functions (# · Feature · System Function · Description)</p>
<ul>
<li><strong>Common · Reset password by e-mail</strong> — sends a reset link; no screen of its own.</li>
<li><strong>Common · Log out</strong> — ends the session and invalidates it.</li>
<li>Good candidates you may have: scheduled closing of expired posts, e-mail notification when an application is accepted, export to Excel.</li>
</ul>
<p class="nhan">4.2 Code Packages (No · Package · Description)</p>
<ul>
<li><strong>Controller</strong> — servlets that process the logic of each function (CRUD and management).</li>
<li><strong>Models</strong> — entity classes holding each object's data for the views.</li>
<li><strong>Dal</strong> — database connection (DBContext) and DAO implementations.</li>
</ul>`,
      `<h3>2. Phần I — các bảng mang nhiều điểm nhất</h3>
<p class="nhan">2.1 Actors (# · Actor · Description)</p>
<table>
<thead><tr><th>#</th><th>Actor</th><th>Mô tả (trách nhiệm, không phải màn hình)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Administrator</td><td>vận hành website; xác minh freelancer và recruiter; đảm bảo quy định của trang</td></tr>
<tr><td>2</td><td>Recruiter</td><td>công ty hoặc cá nhân đăng việc IT và xem hồ sơ freelancer</td></tr>
<tr><td>3</td><td>Freelancer</td><td>tìm và ứng tuyển việc; quản lý hồ sơ gồm kỹ năng, kinh nghiệm, học vấn</td></tr>
<tr><td>4</td><td>Guest</td><td>chưa đăng nhập; xem và tìm việc, công ty, freelancer; có thể đăng ký</td></tr>
</tbody>
</table>
<p class="nhan">3.3 Screen Authorization (màn hình × role, X = được phép) — trích đoạn</p>
<table>
<thead><tr><th>Màn hình</th><th>Guest</th><th>Freelancer</th><th>Recruiter</th><th>Admin</th></tr></thead>
<tbody>
<tr><td>Register</td><td>X</td><td></td><td></td><td></td></tr>
<tr><td>Home page</td><td>X</td><td>X</td><td>X</td><td>X</td></tr>
<tr><td>Create post</td><td></td><td></td><td>X</td><td></td></tr>
<tr><td>Apply job</td><td></td><td>X</td><td></td><td></td></tr>
<tr><td>Change status account Freelancer</td><td></td><td></td><td></td><td>X</td></tr>
</tbody>
</table>
<p class="ghi-chu">Trong ma trận thật của G5, Register còn được đánh dấu cho cả Freelancer và Recruiter, còn Forget Password lại không đánh dấu cho Guest — người đã đăng nhập thì không đăng ký lại, và khách chưa đăng nhập mới chính là người quên mật khẩu. Giám khảo nhận ra những mâu thuẫn như vậy; hãy đối chiếu ma trận với các filter trong code.</p>
<p class="nhan">3.4 Non-UI Functions (# · Feature · System Function · Description)</p>
<ul>
<li><strong>Common · Reset password qua e-mail</strong> — gửi link đặt lại; không có màn hình riêng.</li>
<li><strong>Common · Log out</strong> — kết thúc phiên và huỷ hiệu lực phiên.</li>
<li>Các ứng viên tốt nhóm có thể có: tự đóng tin hết hạn theo lịch, gửi e-mail khi đơn được chấp nhận, xuất Excel.</li>
</ul>
<p class="nhan">4.2 Code Packages (No · Package · Description)</p>
<ul>
<li><strong>Controller</strong> — các servlet xử lý logic của từng chức năng (CRUD và quản lý).</li>
<li><strong>Models</strong> — các lớp entity chứa dữ liệu của từng đối tượng để hiển thị.</li>
<li><strong>Dal</strong> — kết nối database (DBContext) và các lớp DAO.</li>
</ul>`),
    bi(`<h3>3. Parts II–IV for one function — worked example "Apply Job"</h3>
<p class="nhan">II. a. Functional Description (use case specification)</p>
<table>
<thead><tr><th>Field</th><th>Content</th></tr></thead>
<tbody>
<tr><td>UC ID &amp; name</td><td>UC-F06 Apply Job</td></tr>
<tr><td>Primary actor</td><td>Freelancer</td></tr>
<tr><td>Trigger</td><td>The freelancer clicks "Apply" on a post detail page.</td></tr>
<tr><td>Preconditions</td><td>Logged in as an active freelancer; the post is approved and not expired.</td></tr>
<tr><td>Post-conditions</td><td>A <code>JobApply</code> row with status "Pending" exists; the recruiter sees it in Manage applicants.</td></tr>
<tr><td>Normal flow</td><td>1 Freelancer clicks Apply · 2 System shows the form (CV link, cover letter) · 3 Freelancer submits · 4 System validates and saves · 5 System shows "Applied successfully" and the List apply screen.</td></tr>
<tr><td>Alternative flow</td><td>2a Profile incomplete → the system asks the freelancer to complete skills first.</td></tr>
<tr><td>Exceptions</td><td>4a Already applied → message MSG-12 "You have already applied for this job" (BR-11).</td></tr>
</tbody>
</table>
<p class="nhan">II. b. Business Rules</p>
<ul>
<li><strong>BR-05</strong> — freelancers can apply only within the application period of the post.</li>
<li><strong>BR-11</strong> — a freelancer who has applied to a project cannot cancel the application (and cannot apply twice).</li>
</ul>
<p class="nhan">III. Screen Design — field table</p>
<table>
<thead><tr><th>#</th><th>Field</th><th>Type</th><th>Data type</th><th>Description / validation</th></tr></thead>
<tbody>
<tr><td>1</td><td>Job title</td><td>Label</td><td>String</td><td>from <code>Post.title</code>, read-only</td></tr>
<tr><td>2</td><td>CV link</td><td>Textbox</td><td>String(255)</td><td>required, must be a URL</td></tr>
<tr><td>3</td><td>Cover letter</td><td>Textarea</td><td>String(1000)</td><td>optional, max 1000 characters</td></tr>
<tr><td>4</td><td>Apply</td><td>Button</td><td>—</td><td>disabled after the first click</td></tr>
</tbody>
</table>
<p class="nhan">IV. Code Design</p>
<ul>
<li><strong>Class diagram</strong> — <code>ApplyJobController</code> → <code>JobApplyDAO</code> → <code>DBContext</code>; entity <code>JobApply</code>.</li>
<li><strong>Sequence diagram</strong> — Freelancer → JSP → controller <code>doPost</code> → DAO <code>exists(postId, freelancerId)</code> → DAO <code>insert(…)</code> → redirect.</li>
<li><strong>Database queries</strong> — <code>SELECT COUNT(*) FROM JobApply WHERE postID = ? AND freelanceID = ?</code> then <code>INSERT INTO JobApply …</code>.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> one function = one thread through all parts — use case → rules → screen fields → classes → SQL. If you can follow that thread in your RDS, the examiners can too.</p>`,
      `<h3>3. Phần II–IV cho một chức năng — ví dụ "Apply Job"</h3>
<p class="nhan">II. a. Functional Description (đặc tả use case)</p>
<table>
<thead><tr><th>Trường</th><th>Nội dung</th></tr></thead>
<tbody>
<tr><td>Mã &amp; tên UC</td><td>UC-F06 Apply Job</td></tr>
<tr><td>Actor chính</td><td>Freelancer</td></tr>
<tr><td>Trigger</td><td>Freelancer bấm "Apply" trên trang chi tiết tin.</td></tr>
<tr><td>Tiền điều kiện</td><td>Đã đăng nhập với tư cách freelancer đang hoạt động; tin đã được duyệt và chưa hết hạn.</td></tr>
<tr><td>Hậu điều kiện</td><td>Có một dòng <code>JobApply</code> trạng thái "Pending"; recruiter thấy nó trong Manage applicants.</td></tr>
<tr><td>Luồng chính</td><td>1 Freelancer bấm Apply · 2 Hệ thống hiện form (link CV, thư giới thiệu) · 3 Freelancer gửi · 4 Hệ thống kiểm tra và lưu · 5 Hệ thống báo "Ứng tuyển thành công" và mở màn List apply.</td></tr>
<tr><td>Luồng thay thế</td><td>2a Hồ sơ chưa đủ → hệ thống yêu cầu bổ sung kỹ năng trước.</td></tr>
<tr><td>Ngoại lệ</td><td>4a Đã ứng tuyển rồi → thông báo MSG-12 "Bạn đã ứng tuyển công việc này" (BR-11).</td></tr>
</tbody>
</table>
<p class="nhan">II. b. Business Rules</p>
<ul>
<li><strong>BR-05</strong> — freelancer chỉ được ứng tuyển trong thời hạn nhận hồ sơ của tin.</li>
<li><strong>BR-11</strong> — freelancer đã ứng tuyển một dự án thì không được huỷ đơn (và không được ứng tuyển lần hai).</li>
</ul>
<p class="nhan">III. Screen Design — bảng trường</p>
<table>
<thead><tr><th>#</th><th>Trường</th><th>Loại</th><th>Kiểu dữ liệu</th><th>Mô tả / kiểm tra</th></tr></thead>
<tbody>
<tr><td>1</td><td>Job title</td><td>Label</td><td>String</td><td>lấy từ <code>Post.title</code>, chỉ đọc</td></tr>
<tr><td>2</td><td>CV link</td><td>Textbox</td><td>String(255)</td><td>bắt buộc, phải là URL</td></tr>
<tr><td>3</td><td>Cover letter</td><td>Textarea</td><td>String(1000)</td><td>không bắt buộc, tối đa 1000 ký tự</td></tr>
<tr><td>4</td><td>Apply</td><td>Button</td><td>—</td><td>bị vô hiệu sau lần bấm đầu</td></tr>
</tbody>
</table>
<p class="nhan">IV. Code Design</p>
<ul>
<li><strong>Class diagram</strong> — <code>ApplyJobController</code> → <code>JobApplyDAO</code> → <code>DBContext</code>; entity <code>JobApply</code>.</li>
<li><strong>Sequence diagram</strong> — Freelancer → JSP → controller <code>doPost</code> → DAO <code>exists(postId, freelancerId)</code> → DAO <code>insert(…)</code> → redirect.</li>
<li><strong>Database queries</strong> — <code>SELECT COUNT(*) FROM JobApply WHERE postID = ? AND freelanceID = ?</code> rồi <code>INSERT INTO JobApply …</code>.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một chức năng = một sợi chỉ xuyên qua mọi phần — use case → quy tắc → trường màn hình → lớp → SQL. Nếu bạn lần theo được sợi chỉ đó trong RDS, giám khảo cũng lần theo được.</p>`),
    bi(`<h3>4. RDS vs the 2026 templates (SRS = Template1, SDS = Template2)</h3>
<p>The 2026 template set splits the same content into two documents. If your teacher asks for SRS + SDS, move each RDS part as below — nothing is lost.</p>
<table>
<thead><tr><th>RDS part</th><th>Goes to</th><th>Template section</th></tr></thead>
<tbody>
<tr><td>I.1 Vision &amp; Scope, context diagram</td><td>SRS</td><td>1.1 Context Diagram · 1.2 Main Business Processes</td></tr>
<tr><td>I.2 Actors, Use Cases</td><td>SRS</td><td>1.3 User Requirements (Actors, UCs, UC diagrams per actor)</td></tr>
<tr><td>I.3 Screens flow, authorization, Non-UI</td><td>SRS</td><td>1.4 System Functionalities</td></tr>
<tr><td>ERD (conceptual)</td><td>SRS</td><td>1.5 Entity Relationship Diagram</td></tr>
<tr><td>II Requirement Specifications</td><td>SRS</td><td>2 Use Case Specifications · 3 Functional Requirements (per screen)</td></tr>
<tr><td>— (new)</td><td>SRS</td><td>4 Non-Functional Requirements (external interfaces, usability, performance…)</td></tr>
<tr><td>V Appendix: business rules</td><td>SRS</td><td>5 Requirement Appendix (5.1 Business Rules, 5.2 System Messages)</td></tr>
<tr><td>I.4 DB design, code packages</td><td>SDS</td><td>1 High Level Design (architecture, package diagram, database design per table)</td></tr>
<tr><td>— (new)</td><td>SDS</td><td>2 State Transition Diagrams</td></tr>
<tr><td>IV Code Designs</td><td>SDS</td><td>3 Detailed Design (class + sequence diagrams per feature)</td></tr>
</tbody>
</table>
<h3>5. Mistakes that cost marks in the RDS</h3>
<ul>
<li><strong>Numbering that restarts</strong> — two sections called "3." in Part I; readers get lost. Let Word generate headings and the table of contents.</li>
<li><strong>"Business Rules: N/A" everywhere</strong> — almost every create/update screen has at least a required-field or uniqueness rule.</li>
<li><strong>Screens in the flow but not in the authorization matrix</strong> (or the other way round).</li>
<li><strong>ERD or package list that no longer matches the code</strong> after iteration 2.</li>
<li><strong>Screenshots of mock-ups</strong> in Screen Designs when the real screen exists.</li>
<li><strong>SQL pasted without saying which function it belongs to.</strong></li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Traceability matrix and ISO/IEC/IEEE 29148.</strong> Industry requirement documents follow ISO/IEC/IEEE 29148, which asks that every requirement be uniquely identified and traceable. A one-page matrix — UC-ID → screen → tables → test case IDs — turns your RDS into a checkable map and answers "how do you know this is complete?" in one glance.</div>`,
      `<h3>4. RDS và các template 2026 (SRS = Template1, SDS = Template2)</h3>
<p>Bộ template 2026 tách cùng nội dung đó thành hai tài liệu. Nếu thầy/cô yêu cầu SRS + SDS, chuyển từng phần của RDS như dưới đây — không mất gì.</p>
<table>
<thead><tr><th>Phần RDS</th><th>Chuyển sang</th><th>Mục trong template</th></tr></thead>
<tbody>
<tr><td>I.1 Vision &amp; Scope, context diagram</td><td>SRS</td><td>1.1 Context Diagram · 1.2 Main Business Processes</td></tr>
<tr><td>I.2 Actors, Use Cases</td><td>SRS</td><td>1.3 User Requirements (Actors, UC, sơ đồ UC theo actor)</td></tr>
<tr><td>I.3 Screens flow, authorization, Non-UI</td><td>SRS</td><td>1.4 System Functionalities</td></tr>
<tr><td>ERD (mức khái niệm)</td><td>SRS</td><td>1.5 Entity Relationship Diagram</td></tr>
<tr><td>II Requirement Specifications</td><td>SRS</td><td>2 Use Case Specifications · 3 Functional Requirements (theo màn hình)</td></tr>
<tr><td>— (mới)</td><td>SRS</td><td>4 Non-Functional Requirements (giao tiếp ngoài, usability, performance…)</td></tr>
<tr><td>V Appendix: business rules</td><td>SRS</td><td>5 Requirement Appendix (5.1 Business Rules, 5.2 System Messages)</td></tr>
<tr><td>I.4 DB design, code packages</td><td>SDS</td><td>1 High Level Design (kiến trúc, package diagram, thiết kế từng bảng)</td></tr>
<tr><td>— (mới)</td><td>SDS</td><td>2 State Transition Diagrams</td></tr>
<tr><td>IV Code Designs</td><td>SDS</td><td>3 Detailed Design (class + sequence diagram theo tính năng)</td></tr>
</tbody>
</table>
<h3>5. Các lỗi làm mất điểm trong RDS</h3>
<ul>
<li><strong>Đánh số bị lặp</strong> — hai mục cùng tên "3." trong Phần I; người đọc lạc. Hãy để Word sinh heading và mục lục.</li>
<li><strong>"Business Rules: N/A" ở khắp nơi</strong> — gần như màn hình thêm/sửa nào cũng có ít nhất một quy tắc bắt buộc nhập hay không trùng.</li>
<li><strong>Màn hình có trong flow nhưng không có trong ma trận phân quyền</strong> (hoặc ngược lại).</li>
<li><strong>ERD hay danh sách package không còn khớp code</strong> sau iteration 2.</li>
<li><strong>Ảnh mock-up</strong> trong Screen Designs khi màn hình thật đã có.</li>
<li><strong>Dán SQL mà không nói nó thuộc chức năng nào.</strong></li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Ma trận truy vết và ISO/IEC/IEEE 29148.</strong> Tài liệu yêu cầu trong công nghiệp theo chuẩn ISO/IEC/IEEE 29148, đòi mỗi yêu cầu có mã định danh duy nhất và truy vết được. Một ma trận một trang — UC-ID → màn hình → bảng → mã test case — biến RDS thành một bản đồ kiểm tra được và trả lời "làm sao biết đã đủ?" chỉ trong một cái nhìn.</div>`),
    books([
      ['wiegers', 'Ch. 8 Understanding user requirements (use cases); Ch. 9 Business rules; Ch. 10 Documenting the requirements', 'Chương 8 Understanding user requirements (use case); Chương 9 Business rules; Chương 10 Documenting the requirements'],
      ['cockburn', 'Ch. 1–2 (use case template and scope); Ch. 5 Scenarios and steps', 'Chương 1–2 (mẫu use case và phạm vi); Chương 5 Scenarios and steps'],
      ['gomaa', 'Ch. 9 Dynamic interaction modeling (sequence diagrams); Ch. 12 Overview of software architecture', 'Chương 9 Dynamic interaction modeling (sequence diagram); Chương 12 Overview of software architecture'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 7.5 A real capstone final report (cap, curated pages) ─────────────────────── */
const L75 = {
  title: '7.5 — Reading a real capstone final report: its structure, and what SWP391 teams can borrow|||7.5 — Đọc một báo cáo capstone thật: cấu trúc, và nhóm SWP391 học được gì',
  slug: 'swp391-7-5-capstone-final-report',
  type: 'VIDEO',
  description: '18 trang chọn lọc từ một báo cáo cuối kỳ capstone thật (159 trang): mục lục, định nghĩa, giới thiệu dự án, kế hoạch quản lý, SRS, thiết kế, tài liệu kiểm thử, gói phát hành — mỗi trang kèm điều nhóm SWP391 nên học và phần vượt yêu cầu SWP391.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.5 · A real capstone final report</span>
<h2>What a finished report looks like — two courses ahead</h2>
<p class="lead">This is a real final report of an FPT University <strong>capstone</strong> project (the graduation project you take after SWP391): a scholarship-exam practice website with Guest, Student, Staff and Admin roles, built with ReactJS + Spring Boot + MySQL. It is richer than anything SWP391 asks for — but its <em>structure</em> is the same backbone as your RDS, and seeing it finished shows where your documents are heading.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>name the six parts of a full software project report and what each contains;</li>
<li>recognise which parts SWP391 already asks for (in the RDS and Project Tracking) and which come later;</li>
<li>borrow a handful of concrete practices — definition tables, feature IDs, limitation IDs, business-rule tables, test-level tables, a deliverable list.</li>
</ul></div>
<p class="ghi-chu">Only 18 of the 159 pages are shown. Pages with the acknowledgement, team members, contacts or responsibility tables were not published, and no person is named here. Page numbers below are the PDF pages; the report's own footer shows "Page x / 209".</p>`,
      `<span class="eyebrow">Chương 7 · Bài 7.5 · Một báo cáo capstone thật</span>
<h2>Một báo cáo hoàn chỉnh trông thế nào — ở hai môn phía trước</h2>
<p class="lead">Đây là báo cáo cuối kỳ thật của một đồ án <strong>capstone</strong> tại Đại học FPT (đồ án tốt nghiệp bạn học sau SWP391): một website luyện thi học bổng với các vai trò Guest, Student, Staff và Admin, xây bằng ReactJS + Spring Boot + MySQL. Nó đầy đủ hơn mọi thứ SWP391 yêu cầu — nhưng <em>cấu trúc</em> của nó cùng bộ xương với RDS của bạn, và nhìn nó hoàn chỉnh cho bạn thấy tài liệu của mình đang hướng tới đâu.</p>
<div class="callout"><strong>Sau bài này bạn có thể:</strong>
<ul>
<li>kể tên sáu phần của một báo cáo dự án phần mềm đầy đủ và nội dung từng phần;</li>
<li>nhận ra phần nào SWP391 đã yêu cầu (trong RDS và Project Tracking) và phần nào để sau;</li>
<li>mượn một số thực hành cụ thể — bảng định nghĩa, mã tính năng, mã giới hạn, bảng business rule, bảng các mức kiểm thử, danh sách bàn giao.</li>
</ul></div>
<p class="ghi-chu">Chỉ 18 trong 159 trang được đưa lên. Các trang lời cảm ơn, thành viên, liên hệ và bảng phân công trách nhiệm không được công bố, và không ai được nêu tên ở đây. Số trang dưới đây là số trang PDF; chân trang của báo cáo ghi "Page x / 209".</p>`),
    walkHead('cap', 1, 142, 'This is a curated selection, walked in the order of the report.', 'Đây là các trang được chọn lọc, đi theo đúng thứ tự của báo cáo.'),
    walk('cap', [
      [1, 'Table of Contents — six parts',
        `<p class="y-chinh">🎯 The whole report in six parts — the backbone of every software project document.</p>
<ol>
<li><strong>I. Project Introduction</strong> — overview, background, existing systems, business opportunity, vision, scope &amp; limitations.</li>
<li><strong>II. Project Management Plan</strong> — scope &amp; estimation, approach, responsibilities, communications, configuration management.</li>
<li><strong>III. Software Requirement Specification</strong> — overall, functional, non-functional, appendix.</li>
<li><strong>IV. Software Design Description</strong> — system, database, detailed design.</li>
<li><strong>V. Software Testing Documentation</strong> — scope, strategy, plan, cases, reports.</li>
<li><strong>VI. Release Package &amp; User Guides</strong> — deliverables, installation, user manual.</li>
</ol>
<p class="nhan">For SWP391</p>
<ul>
<li>Parts III and IV = your RDS (or SRS + SDS). Part II lives in your Project Tracking and weekly reports. Parts V–VI are only partly asked (System Test template, tagged release).</li>
</ul>`,
        `<p class="y-chinh">🎯 Toàn bộ báo cáo trong sáu phần — bộ xương của mọi tài liệu dự án phần mềm.</p>
<ol>
<li><strong>I. Project Introduction</strong> — tổng quan, bối cảnh, hệ thống hiện có, cơ hội kinh doanh, tầm nhìn, phạm vi &amp; giới hạn.</li>
<li><strong>II. Project Management Plan</strong> — phạm vi &amp; ước lượng, cách tiếp cận, phân công, giao tiếp, quản lý cấu hình.</li>
<li><strong>III. Software Requirement Specification</strong> — tổng thể, chức năng, phi chức năng, phụ lục.</li>
<li><strong>IV. Software Design Description</strong> — thiết kế hệ thống, database, thiết kế chi tiết.</li>
<li><strong>V. Software Testing Documentation</strong> — phạm vi, chiến lược, kế hoạch, test case, báo cáo.</li>
<li><strong>VI. Release Package &amp; User Guides</strong> — sản phẩm bàn giao, cài đặt, hướng dẫn sử dụng.</li>
</ol>
<p class="nhan">Với SWP391</p>
<ul>
<li>Phần III và IV = RDS của bạn (hoặc SRS + SDS). Phần II nằm trong Project Tracking và báo cáo tuần. Phần V–VI chỉ được yêu cầu một phần (template System Test, bản phát hành gắn tag).</li>
</ul>`],
      [3, 'Definition and Acronyms',
        `<p class="y-chinh">🎯 A glossary up front means every later page can be short and unambiguous.</p>
<ul>
<li><strong>Document acronyms</strong> — SRS, SDD, SPMP, UAT, UC, BR, CBR (common business rules), ET (e-mail template), MSG.</li>
<li><strong>Writing conventions</strong> — <code>[Field]</code> for a field, <code>&lt;&lt;Field&gt;&gt;</code> for a value in an e-mail template, "Text Value" for a literal, <code>{Value}</code> for special values like {Today}, TBU = to be updated.</li>
</ul>
<p class="nhan">Borrow it</p>
<ul>
<li>Add these conventions to your RDS — "[Salary] must be ≥ 0" is clearer than "the salary field must be positive".</li>
</ul>
<div class="pitfall">Notice the duplicates (SRS and UC appear twice, SRS with two meanings). Keep one definition per term.</div>`,
        `<p class="y-chinh">🎯 Một bảng thuật ngữ ở đầu giúp mọi trang sau ngắn gọn và không mơ hồ.</p>
<ul>
<li><strong>Viết tắt tài liệu</strong> — SRS, SDD, SPMP, UAT, UC, BR, CBR (business rule chung), ET (mẫu e-mail), MSG.</li>
<li><strong>Quy ước viết</strong> — <code>[Field]</code> cho một trường, <code>&lt;&lt;Field&gt;&gt;</code> cho giá trị trong mẫu e-mail, "Text Value" cho giá trị nguyên văn, <code>{Value}</code> cho giá trị đặc biệt như {Today}, TBU = sẽ cập nhật.</li>
</ul>
<p class="nhan">Mượn ngay</p>
<ul>
<li>Thêm các quy ước này vào RDS — "[Salary] phải ≥ 0" rõ hơn "trường lương phải dương".</li>
</ul>
<div class="pitfall">Để ý các mục trùng (SRS và UC xuất hiện hai lần, SRS lại mang hai nghĩa). Mỗi thuật ngữ chỉ một định nghĩa.</div>`],
      [11, 'I.5–6 Product vision · Project scope & limitations · Major features: types of users',
        `<p class="y-chinh">🎯 The vision says who benefits and how; the scope starts with the user types.</p>
<ul>
<li><strong>Vision</strong> — for students: timed practice, history and rankings; for the managing club: one platform instead of scattered forms and classrooms.</li>
<li><strong>Types of users</strong> — Guest (no login, public info), Student (take exams, rankings, history), Staff (manage questions and posts), Admin (full rights).</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>This is your RDS "Vision and Scope" + "Actors". Write actors by responsibility, as here, not as a list of screens.</li>
</ul>
<div class="pitfall">"Admin: managers at a higher level than Admin" — a copy-paste slip in a 209-page report. Read your actor table aloud once.</div>`,
        `<p class="y-chinh">🎯 Tầm nhìn nói ai được lợi và lợi thế nào; phạm vi bắt đầu từ các loại người dùng.</p>
<ul>
<li><strong>Tầm nhìn</strong> — với học sinh: luyện thi có giờ, lịch sử và bảng xếp hạng; với câu lạc bộ quản lý: một nền tảng thay cho form và lớp học rải rác.</li>
<li><strong>Loại người dùng</strong> — Guest (không đăng nhập, xem thông tin công khai), Student (làm bài, xếp hạng, lịch sử), Staff (quản lý câu hỏi và bài viết), Admin (toàn quyền).</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Đây là mục "Vision and Scope" + "Actors" của RDS. Viết actor theo trách nhiệm, như ở đây, không phải danh sách màn hình.</li>
</ul>
<div class="pitfall">"Admin: managers at a higher level than Admin" — lỗi chép-dán trong một báo cáo 209 trang. Hãy đọc to bảng actor của bạn một lần.</div>`],
    ]),
    walk('cap', [
      [12, 'I.6.1 Major features — feature mind map + feature table (FE-01…FE-05)',
        `<p class="y-chinh">🎯 One picture and one table give the whole functional scope, with an ID for every feature.</p>
<ul>
<li><strong>Mind map</strong> — the system in the centre, five feature groups around it, functions as leaves.</li>
<li><strong>Feature table</strong> — ID · Feature Name · Description: FE-01 Common (register, login, logout, reset/change password), FE-02 Category, FE-03 Post, FE-04 User, FE-05 Examination Management.</li>
</ul>
<p class="nhan">Borrow it</p>
<ul>
<li>Give your feature groups IDs (FE-01…) and reuse them in Project Tracking, GitLab labels and the RDS headings — one vocabulary everywhere.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một hình và một bảng cho thấy toàn bộ phạm vi chức năng, mỗi tính năng có một mã.</p>
<ul>
<li><strong>Mind map</strong> — hệ thống ở giữa, năm nhóm tính năng xung quanh, các chức năng là lá.</li>
<li><strong>Bảng tính năng</strong> — ID · Feature Name · Description: FE-01 Common (đăng ký, đăng nhập, đăng xuất, đặt lại/đổi mật khẩu), FE-02 Category, FE-03 Post, FE-04 User, FE-05 Examination Management.</li>
</ul>
<p class="nhan">Mượn ngay</p>
<ul>
<li>Đặt mã cho các nhóm tính năng (FE-01…) và dùng lại trong Project Tracking, label GitLab và heading RDS — một bộ từ vựng ở mọi nơi.</li>
</ul>`],
      [13, 'I.6.2 Limitations & Exclusions (LI-01…LI-04, EX-01…EX-02)',
        `<p class="y-chinh">🎯 Saying clearly what the product does NOT do protects the team from "why doesn't it…?" questions.</p>
<ul>
<li><strong>Limitations (LI)</strong> — no mobile version, no marketing e-mails, no multi-language, cannot read files uploaded by users.</li>
<li><strong>Exclusions (EX)</strong> — no services for sponsors yet, no manual grading of written answers.</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>Your RDS Appendix has the same section. Agree each exclusion with the teacher (customer hat) — then in the final presentation "that is EX-02, confirmed in iteration 1" ends the discussion.</li>
</ul>`,
        `<p class="y-chinh">🎯 Nói rõ sản phẩm KHÔNG làm gì giúp nhóm tránh các câu "sao nó không…?".</p>
<ul>
<li><strong>Giới hạn (LI)</strong> — không có bản mobile, không gửi e-mail marketing, không đa ngôn ngữ, không đọc được file người dùng tải lên.</li>
<li><strong>Loại trừ (EX)</strong> — chưa có dịch vụ cho nhà tài trợ, không chấm tay bài tự luận.</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Phụ lục RDS của bạn có đúng mục này. Thống nhất từng mục loại trừ với thầy/cô (mũ khách hàng) — rồi trong buổi thuyết trình, câu "đó là EX-02, đã xác nhận ở iteration 1" khép lại cuộc tranh luận.</li>
</ul>`],
      [14, 'II. Project Management Plan — 1.1 Scope & Estimation (WBS, complexity, man-days)',
        `<p class="y-chinh">🎯 Every function becomes a WBS item with a complexity and an estimated effort — the plan is built from the scope.</p>
<ul>
<li><strong>Complexity → effort</strong> — Simple = 4, Medium = 7, Complex = 10 man-days, summed per feature group (e.g. Common Feature 35).</li>
<li><strong>Total</strong> — 258 man-days for the whole scope (next page).</li>
</ul>
<p class="nhan">Compare with SWP391</p>
<ul>
<li>SWP391 uses the same idea for <em>grading</em>, not planning: Complexity Simple 60 / Medium 120 / Complex 240 LOC × Quality (Subject Guides slide 7), and the 2026 Project Tracking template has a Level 1–5 table. Estimating your screens this way at the start of each iteration tells you early whether each member's load is fair.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mỗi chức năng thành một mục WBS có độ phức tạp và công sức ước lượng — kế hoạch được dựng từ phạm vi.</p>
<ul>
<li><strong>Độ phức tạp → công sức</strong> — Simple = 4, Medium = 7, Complex = 10 ngày công, cộng theo nhóm tính năng (vd Common Feature 35).</li>
<li><strong>Tổng</strong> — 258 ngày công cho toàn bộ phạm vi (trang sau).</li>
</ul>
<p class="nhan">So với SWP391</p>
<ul>
<li>SWP391 dùng cùng ý tưởng để <em>chấm điểm</em>, không phải lập kế hoạch: Complexity Simple 60 / Medium 120 / Complex 240 LOC × Quality (Subject Guides slide 7), và template Project Tracking 2026 có bảng Level 1–5. Ước lượng màn hình theo cách này ở đầu mỗi iteration cho bạn biết sớm khối lượng của từng người có công bằng không.</li>
</ul>`],
      [18, 'II.2 Management approach — iterative and incremental model',
        `<p class="y-chinh">🎯 The team justifies its process: iterations of Analyze → Design → Implement → Test, each delivering a new version.</p>
<ul>
<li><strong>Why</strong> — unclear, changing requirements from the customer; feedback after each iteration; errors found early; smaller parts, smaller risk.</li>
<li><strong>Cost</strong> — more versions to manage; needs a disciplined process (next page).</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>This is exactly SWP391's structure: 3 iterations, each with requirement + design + code for every member. On template slide 2 you can say it in one sentence and point to your 3 tags.</li>
</ul>`,
        `<p class="y-chinh">🎯 Nhóm giải thích quy trình của mình: các vòng Analyze → Design → Implement → Test, mỗi vòng ra một phiên bản mới.</p>
<ul>
<li><strong>Vì sao</strong> — yêu cầu của khách hàng chưa rõ, hay đổi; có phản hồi sau mỗi vòng; phát hiện lỗi sớm; phần nhỏ, rủi ro nhỏ.</li>
<li><strong>Cái giá</strong> — nhiều phiên bản phải quản lý; cần một quy trình có kỷ luật (trang sau).</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Đây chính là cấu trúc của SWP391: 3 iteration, mỗi iteration mọi thành viên đều làm requirement + design + code. Trên slide 2 của template bạn nói được nó trong một câu và chỉ vào 3 tag.</li>
</ul>`],
    ]),
    walk('cap', [
      [26, 'II.6 Configuration management — code management rules · 6.3 Tools & infrastructures',
        `<p class="y-chinh">🎯 Three rules for the repository and one table of tools make the team's working environment explicit.</p>
<ul>
<li><strong>Rules</strong> — source code on GitLab/GitHub; a technical leader reviews and merges members' code; only team members can access the repository.</li>
<li><strong>Tools table</strong> — technology, database, IDEs, diagramming, documentation, version control, deployment server, project management.</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>The same facts go on template slide 2 ("How does the team manage the project?"). A leader who merges after review is also the best answer to "how did you keep the main branch working?".</li>
</ul>`,
        `<p class="y-chinh">🎯 Ba quy tắc cho repository và một bảng công cụ làm rõ môi trường làm việc của nhóm.</p>
<ul>
<li><strong>Quy tắc</strong> — mã nguồn trên GitLab/GitHub; một technical leader review và merge code của thành viên; chỉ thành viên nhóm được truy cập repository.</li>
<li><strong>Bảng công cụ</strong> — công nghệ, database, IDE, vẽ sơ đồ, tài liệu, quản lý phiên bản, máy chủ triển khai, quản lý dự án.</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Cùng các dữ kiện này đặt lên slide 2 của template ("Nhóm quản lý dự án thế nào?"). Leader merge sau khi review cũng là câu trả lời tốt nhất cho "nhóm giữ nhánh chính luôn chạy bằng cách nào?".</li>
</ul>`],
      [27, 'III. SRS — 1. Overall Requirements (overview, main process) · 1.1 Abbreviations',
        `<p class="y-chinh">🎯 Before any use case, the SRS states the current problem and the main business process in plain sentences.</p>
<ul>
<li><strong>Overview</strong> — the club organises mock tests with scattered tools (online forms, a classroom app); results are hard to collect.</li>
<li><strong>Main process</strong> — guests view content; students practise without limit and take weekly ranked mock tests; staff configure time limits, opening/closing times and whether scores are shown; admin views statistics and exports user data.</li>
</ul>
<p class="nhan">Borrow it</p>
<ul>
<li>SRS Template1 has "1.2 Main Business Processes": write your main process in 6–10 lines like this — it becomes the source of your swimlane workflows for the presentation.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trước mọi use case, SRS nêu vấn đề hiện tại và quy trình nghiệp vụ chính bằng những câu đơn giản.</p>
<ul>
<li><strong>Tổng quan</strong> — câu lạc bộ tổ chức thi thử bằng các công cụ rời rạc (form online, ứng dụng lớp học); khó tổng hợp kết quả.</li>
<li><strong>Quy trình chính</strong> — khách xem nội dung; học sinh luyện không giới hạn và thi thử hằng tuần có xếp hạng; staff cấu hình giới hạn thời gian, giờ mở/đóng và có cho xem điểm không; admin xem thống kê và xuất dữ liệu người dùng.</li>
</ul>
<p class="nhan">Mượn ngay</p>
<ul>
<li>SRS Template1 có mục "1.2 Main Business Processes": viết quy trình chính của bạn trong 6–10 dòng như thế này — nó thành nguồn cho các swimlane workflow khi thuyết trình.</li>
</ul>`],
      [29, 'III.1.3.2 Use Cases — use case diagram for Guest and for Student',
        `<p class="y-chinh">🎯 One diagram per actor, exactly what template slide 3 asks you to show.</p>
<ul>
<li><strong>Guest</strong> — Sign Up, view public posts, FAQs, exam ranking, public exams, essay topics; each "details" use case <code>&lt;&lt;extend&gt;&gt;</code>s its list.</li>
<li><strong>Student</strong> — inherits Guest (generalisation arrow), adds Login, Logout, Reset/Change Password, Update Profile, Take Exam, View Exam History, Saved Exam List, Ranking Details.</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>The generalisation Student → Guest avoids drawing the same eight use cases twice — use it for Freelancer/Recruiter → Guest in your system.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mỗi actor một sơ đồ, đúng thứ slide 3 của template yêu cầu.</p>
<ul>
<li><strong>Guest</strong> — Sign Up, xem bài viết công khai, FAQ, xếp hạng, đề thi công khai, chủ đề nghị luận; mỗi use case "details" <code>&lt;&lt;extend&gt;&gt;</code> use case danh sách của nó.</li>
<li><strong>Student</strong> — kế thừa Guest (mũi tên tổng quát hoá), thêm Login, Logout, Reset/Change Password, Update Profile, Take Exam, View Exam History, Saved Exam List, Ranking Details.</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Tổng quát hoá Student → Guest giúp khỏi vẽ lại tám use case — hãy dùng cho Freelancer/Recruiter → Guest trong hệ thống của bạn.</li>
</ul>`],
      [85, 'III.2 Functional specifications — screen layout, screen definition, UC specification',
        `<p class="y-chinh">🎯 Each function is specified as a trio: screen layout → field table → use case specification.</p>
<ul>
<li><strong>Screen layout</strong> — a wireframe of the page.</li>
<li><strong>Screen definition</strong> — # · Field Name · Field Type · Data Type · Description.</li>
<li><strong>UC specification</strong> — name (UC12), primary actor, description, trigger, preconditions, post-condition, normal flow, alternative flows, exceptions, business rules.</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>This is RDS Parts II + III for one screen. Simple "view" screens may really have no rule — but create/update screens never have "Business Rules: N/A".</li>
</ul>`,
        `<p class="y-chinh">🎯 Mỗi chức năng được đặc tả thành bộ ba: bố cục màn hình → bảng trường → đặc tả use case.</p>
<ul>
<li><strong>Screen layout</strong> — wireframe của trang.</li>
<li><strong>Screen definition</strong> — # · Field Name · Field Type · Data Type · Description.</li>
<li><strong>UC specification</strong> — tên (UC12), actor chính, mô tả, trigger, tiền điều kiện, hậu điều kiện, luồng chính, luồng thay thế, ngoại lệ, business rule.</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Đây là Phần II + III của RDS cho một màn hình. Màn hình "xem" đơn giản có thể thật sự không có quy tắc — nhưng màn hình thêm/sửa thì không bao giờ "Business Rules: N/A".</li>
</ul>`],
    ]),
    walk('cap', [
      [101, 'III.4 Requirement appendix — business rules table (BR10…BR15)',
        `<p class="y-chinh">🎯 Business rules get IDs and live in one table, so every use case can just cite "BR13".</p>
<ul>
<li><strong>Display rules</strong> — BR10/BR12: search, sort and filter of the exam and category lists.</li>
<li><strong>Validation rules</strong> — BR11 required fields marked "*"; BR13 duration &gt; 0 and every question complete.</li>
<li><strong>Data rules</strong> — BR12 deleting a category deletes its posts; BR15 deleting an exam keeps ranking history already recorded.</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>The G5 RDS Appendix does the same (BR-01…BR-12). Rules like BR12/BR15 are exactly what examiners ask about: "what happens to the posts when a category is deleted?"</li>
</ul>`,
        `<p class="y-chinh">🎯 Business rule có mã và nằm trong một bảng, để mọi use case chỉ cần dẫn "BR13".</p>
<ul>
<li><strong>Quy tắc hiển thị</strong> — BR10/BR12: tìm kiếm, sắp xếp, lọc danh sách đề thi và danh mục.</li>
<li><strong>Quy tắc kiểm tra</strong> — BR11 trường bắt buộc có dấu "*"; BR13 thời lượng &gt; 0 và mọi câu hỏi phải đủ.</li>
<li><strong>Quy tắc dữ liệu</strong> — BR12 xoá danh mục thì xoá các bài của nó; BR15 xoá đề thi vẫn giữ lịch sử xếp hạng đã ghi.</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Phụ lục RDS của G5 làm y như vậy (BR-01…BR-12). Các quy tắc kiểu BR12/BR15 chính là thứ giám khảo hay hỏi: "xoá danh mục thì các bài viết ra sao?"</li>
</ul>`],
      [103, 'IV.1.2 Package diagram — back-end and front-end',
        `<p class="y-chinh">🎯 Two package diagrams because there are two applications: a Spring Boot API and a React front end.</p>
<ul>
<li><strong>Back end</strong> — controller → service (interfaces) ← serviceImp; service uses model, repository, payload, util; plus Jwt, security, exception.</li>
<li><strong>Front end</strong> — an "interface" group (page, component, common, asset, layout) and a "control" group (hook, api, routes, core/store).</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>A servlet/JSP project needs only one diagram (controller, model, dal, view). The lesson to borrow: the diagram is drawn from the real folders — examiners can check it in the IDE.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai package diagram vì có hai ứng dụng: một API Spring Boot và một front end React.</p>
<ul>
<li><strong>Back end</strong> — controller → service (interface) ← serviceImp; service dùng model, repository, payload, util; thêm Jwt, security, exception.</li>
<li><strong>Front end</strong> — nhóm "interface" (page, component, common, asset, layout) và nhóm "control" (hook, api, routes, core/store).</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Dự án servlet/JSP chỉ cần một sơ đồ (controller, model, dal, view). Điều nên mượn: sơ đồ được vẽ từ thư mục thật — giám khảo kiểm được trong IDE.</li>
</ul>`],
      [104, 'IV.2 Database design — ERD + 2.1 table descriptions',
        `<p class="y-chinh">🎯 The ERD is exported from the database tool, then every table is described column by column.</p>
<ul>
<li><strong>ERD</strong> — exams, question, question_choices, categories, post, users, roles, user_roles, user_token, history_exam.</li>
<li><strong>Table descriptions</strong> — # · table name · columns with type and PK/FK (e.g. categories: id PK, category_name, created_date, parent_id FK, type).</li>
</ul>
<p class="nhan">Borrow it</p>
<ul>
<li><strong>user_roles</strong> between users and roles — a clean many-to-many for accounts with several roles.</li>
<li><strong>history_exam</strong> copies the exam title and type — deliberate denormalisation so history survives deleting an exam (BR15). Be ready to justify such choices.</li>
</ul>`,
        `<p class="y-chinh">🎯 ERD được xuất từ công cụ database, rồi từng bảng được mô tả theo từng cột.</p>
<ul>
<li><strong>ERD</strong> — exams, question, question_choices, categories, post, users, roles, user_roles, user_token, history_exam.</li>
<li><strong>Mô tả bảng</strong> — # · tên bảng · các cột kèm kiểu và PK/FK (vd categories: id PK, category_name, created_date, parent_id FK, type).</li>
</ul>
<p class="nhan">Mượn ngay</p>
<ul>
<li><strong>user_roles</strong> nằm giữa users và roles — quan hệ nhiều-nhiều gọn cho tài khoản có nhiều vai trò.</li>
<li><strong>history_exam</strong> chép lại tên và loại đề — phi chuẩn hoá có chủ đích để lịch sử còn nguyên khi xoá đề (BR15). Hãy sẵn sàng giải thích những lựa chọn như vậy.</li>
</ul>`],
      [108, 'IV.3 Detailed design — sequence diagram "Sign Up"',
        `<p class="y-chinh">🎯 A sequence diagram shows one function across the classes, including the error branch.</p>
<ol>
<li>FE → <code>AuthController.signUp</code>.</li>
<li><code>alt [userExists]</code> — read e-mail and username, <code>IUserService.checkIfUserExists</code> → repository query → <code>UserAlreadyExistsException</code> returns an error code.</li>
<li>Otherwise — <code>createUser</code> → repository insert → <code>IEmailService.sendRegisterEmail</code> → response.</li>
</ol>
<p class="nhan">For SWP391</p>
<ul>
<li>RDS Part IV asks for the same per function. Always draw the <code>alt</code> fragment for the main rule — it is where your business rule becomes code.</li>
</ul>`,
        `<p class="y-chinh">🎯 Sequence diagram cho thấy một chức năng đi qua các lớp, kể cả nhánh lỗi.</p>
<ol>
<li>FE → <code>AuthController.signUp</code>.</li>
<li><code>alt [userExists]</code> — đọc e-mail và username, <code>IUserService.checkIfUserExists</code> → truy vấn repository → <code>UserAlreadyExistsException</code> trả mã lỗi.</li>
<li>Ngược lại — <code>createUser</code> → repository insert → <code>IEmailService.sendRegisterEmail</code> → phản hồi.</li>
</ol>
<p class="nhan">Với SWP391</p>
<ul>
<li>Phần IV của RDS yêu cầu y như vậy cho mỗi chức năng. Luôn vẽ khung <code>alt</code> cho quy tắc chính — đó là nơi business rule của bạn trở thành code.</li>
</ul>`],
    ]),
    walk('cap', [
      [133, 'V.1 Scope of testing — security checks · 1.2 Testing levels (unit, integration, system, acceptance)',
        `<p class="y-chinh">🎯 A table of four test levels: who tests, when, what, and the acceptance criterion of each.</p>
<ul>
<li><strong>Unit</strong> — developers, while implementing; 100% of branch conditions covered without unexpected exceptions.</li>
<li><strong>Integration</strong> — testers, after unit tests pass; data exchanged correctly controller → service → repository → database.</li>
<li><strong>System</strong> — testers, after integration; all logic flows as designed, non-functional requirements met.</li>
<li><strong>Acceptance</strong> — end users, after the full system test; the system meets business needs.</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>The 2026 System Test template (Template3) covers the system level. The security bullets above ("authorization on both API and front end", "staff edit only their own content") are good requirements to copy into your RDS.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một bảng bốn mức kiểm thử: ai test, khi nào, test gì, và tiêu chí chấp nhận của từng mức.</p>
<ul>
<li><strong>Unit</strong> — lập trình viên, trong lúc code; phủ 100% nhánh điều kiện, không có ngoại lệ bất ngờ.</li>
<li><strong>Integration</strong> — tester, sau khi unit test đạt; dữ liệu trao đổi đúng controller → service → repository → database.</li>
<li><strong>System</strong> — tester, sau integration; mọi luồng logic đúng thiết kế, đạt yêu cầu phi chức năng.</li>
<li><strong>Acceptance</strong> — người dùng cuối, sau khi system test xong; hệ thống đáp ứng nhu cầu nghiệp vụ.</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Template System Test 2026 (Template3) phủ mức system. Các gạch đầu dòng bảo mật ở trên ("phân quyền ở cả API lẫn front end", "staff chỉ sửa nội dung của mình") là yêu cầu tốt để chép vào RDS.</li>
</ul>`],
      [136, 'V.3.2 Test environment · 3.3 Test milestones · 4. Test cases — unit testing',
        `<p class="y-chinh">🎯 Tools, dates and reasons: the test plan is concrete enough that anyone can repeat it.</p>
<ul>
<li><strong>Environment</strong> — browser for the front end, MySQL Workbench 8.0 for query performance, JUnit + Mockito for back-end unit tests.</li>
<li><strong>Milestones</strong> — test plan, unit, integration, system, acceptance, bug log, final test summary — each with start and end dates.</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>You do not need seven milestones, but one line per iteration — "system test of iteration-2 screens, week 5" — in your weekly plan is the same discipline.</li>
</ul>`,
        `<p class="y-chinh">🎯 Công cụ, ngày tháng và lý do: kế hoạch test đủ cụ thể để ai cũng lặp lại được.</p>
<ul>
<li><strong>Môi trường</strong> — trình duyệt cho front end, MySQL Workbench 8.0 để đo truy vấn, JUnit + Mockito cho unit test back end.</li>
<li><strong>Mốc</strong> — test plan, unit, integration, system, acceptance, bug log, báo cáo tổng kết — mỗi mốc có ngày bắt đầu và kết thúc.</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Bạn không cần bảy mốc, nhưng một dòng cho mỗi iteration — "system test màn hình iteration 2, tuần 5" — trong kế hoạch tuần là cùng một kỷ luật.</li>
</ul>`],
      [142, 'VI. Release package — 1. Deliverable package · 2. Installation guides',
        `<p class="y-chinh">🎯 The report ends with an inventory of everything delivered and how to install it.</p>
<ul>
<li><strong>Deliverables</strong> — code packages (back end, front end), database script, final report, and five test workbooks (unit, integration, system, acceptance, condition analysis), each with type and version.</li>
<li><strong>Installation</strong> — system requirements (accounts, RAM, cloud credit, mail service), then step-by-step instructions.</li>
</ul>
<p class="nhan">For SWP391</p>
<ul>
<li>Your iteration submission is a small version of this: Project Tracking, RDS, and a text file with every member's demo video link and the tagged source with its DB script. A README with "how to run" is the installation guide in miniature.</li>
</ul>`,
        `<p class="y-chinh">🎯 Báo cáo kết thúc bằng danh mục mọi thứ đã bàn giao và cách cài đặt.</p>
<ul>
<li><strong>Sản phẩm bàn giao</strong> — gói code (back end, front end), script database, báo cáo cuối, và năm file test (unit, integration, system, acceptance, phân tích điều kiện), mỗi thứ có loại và phiên bản.</li>
<li><strong>Cài đặt</strong> — yêu cầu hệ thống (tài khoản, RAM, tín dụng cloud, dịch vụ mail), rồi hướng dẫn từng bước.</li>
</ul>
<p class="nhan">Với SWP391</p>
<ul>
<li>Bài nộp mỗi iteration là phiên bản nhỏ của thứ này: Project Tracking, RDS, và một file text chứa link video demo của từng thành viên cùng source đã gắn tag kèm DB script. Một README "cách chạy" chính là hướng dẫn cài đặt thu nhỏ.</li>
</ul>`],
    ]),
    bi(`<h3>What an SWP391 team should take from this report</h3>
<table>
<thead><tr><th>Practice in the capstone report</th><th>Where it goes in SWP391</th><th>Effort</th></tr></thead>
<tbody>
<tr><td>Definitions &amp; writing conventions ([Field], "Value", {Today})</td><td>front of the RDS</td><td>30 minutes, once</td></tr>
<tr><td>Feature IDs (FE-01…) and a feature table</td><td>RDS Part I, Project Tracking, GitLab labels</td><td>low</td></tr>
<tr><td>Numbered limitations &amp; exclusions (LI/EX)</td><td>RDS Appendix; confirmed with the teacher</td><td>low</td></tr>
<tr><td>Business rules with IDs, cited from use cases</td><td>RDS Parts II and V</td><td>medium, grows each iteration</td></tr>
<tr><td>Test levels table and a dated test plan</td><td>System Test template, weekly plan</td><td>medium</td></tr>
<tr><td>Deliverable list + installation steps</td><td>submission text file + README</td><td>low</td></tr>
<tr><td>Full management plan, 5 test workbooks, user manual</td><td>not required in SWP391 — capstone level</td><td>high</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Documents as a product.</strong> Industry teams treat documentation like code: one source, versioned, reviewed, and generated where possible (tables of contents, ERDs exported from the database, API docs from annotations). The capstone report's weakest spots — duplicated acronyms, a copy-pasted actor description — are exactly what a review pass catches. Give your RDS one peer review per iteration, by a member who did not write the section.</div>`,
      `<h3>Nhóm SWP391 nên lấy gì từ báo cáo này</h3>
<table>
<thead><tr><th>Thực hành trong báo cáo capstone</th><th>Đặt vào đâu trong SWP391</th><th>Công sức</th></tr></thead>
<tbody>
<tr><td>Định nghĩa &amp; quy ước viết ([Field], "Value", {Today})</td><td>đầu RDS</td><td>30 phút, một lần</td></tr>
<tr><td>Mã tính năng (FE-01…) và bảng tính năng</td><td>RDS Phần I, Project Tracking, label GitLab</td><td>thấp</td></tr>
<tr><td>Giới hạn &amp; loại trừ có đánh số (LI/EX)</td><td>Phụ lục RDS; đã xác nhận với thầy/cô</td><td>thấp</td></tr>
<tr><td>Business rule có mã, được use case dẫn chiếu</td><td>RDS Phần II và V</td><td>vừa, tăng dần mỗi iteration</td></tr>
<tr><td>Bảng các mức test và kế hoạch test có ngày</td><td>template System Test, kế hoạch tuần</td><td>vừa</td></tr>
<tr><td>Danh mục bàn giao + các bước cài đặt</td><td>file text nộp bài + README</td><td>thấp</td></tr>
<tr><td>Kế hoạch quản lý đầy đủ, 5 file test, hướng dẫn sử dụng</td><td>SWP391 không yêu cầu — mức capstone</td><td>cao</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Tài liệu cũng là một sản phẩm.</strong> Nhóm trong công nghiệp đối xử với tài liệu như với code: một nguồn duy nhất, có phiên bản, có review, và tự sinh khi được (mục lục, ERD xuất từ database, tài liệu API từ annotation). Những chỗ yếu nhất của báo cáo capstone — viết tắt bị trùng, mô tả actor chép-dán — chính là thứ một lượt review bắt được. Hãy cho RDS một lượt review chéo mỗi iteration, bởi một thành viên không viết mục đó.</div>`),
    books([
      ['sommerville', 'Ch. 4 Requirements engineering (4.3 Requirements specification); Ch. 8 Software testing (development, release and user testing)', 'Chương 4 Requirements engineering (4.3 Requirements specification); Chương 8 Software testing (development, release và user testing)'],
      ['gomaa', 'Ch. 1–2 (the COMET life cycle: requirements → analysis → design) ', 'Chương 1–2 (vòng đời COMET: requirements → analysis → design)'],
      ['wiegers', 'Ch. 10 Documenting the requirements (the SRS template)', 'Chương 10 Documenting the requirements (mẫu SRS)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── Quiz 7 ─────────────────────── */
const Q7 = {
  title: 'Quiz 7 — Teamwork, RDS/final report & final presentation|||Quiz 7 — Làm việc nhóm, RDS/báo cáo cuối & thuyết trình cuối kỳ',
  slug: 'swp391-quiz-7',
  type: 'QUIZ',
  description: 'Kiểm tra: vai trò của giảng viên, Weekly Report, AI Usage Report, liêm chính, cấu trúc RDS, báo cáo capstone, thang chấm và nội dung 9 slide của buổi thuyết trình cuối.',
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      { question: 'How much of the SWP391 grade is the final presentation, and who grades it?|||Buổi thuyết trình cuối chiếm bao nhiêu điểm SWP391 và ai chấm?', options: ['25%, the class teacher|||25%, giảng viên dạy lớp', '40%, the class teacher and one student|||40%, giảng viên lớp và một sinh viên', '60%, a committee of five|||60%, hội đồng năm người', '40%, two teachers other than the class teacher|||40%, hai giảng viên không phải người dạy lớp'], correctIndex: 3, explanation: 'Subject Guides: Final Presentation 40%, "evaluated by 2 teachers (other than the class teacher)".|||Subject Guides: Final Presentation 40%, "do 2 giảng viên (không phải giảng viên lớp) đánh giá".' },
      { question: 'Which criterion carries the largest weight in the final presentation?|||Tiêu chí nào có trọng số lớn nhất trong buổi thuyết trình cuối?', options: ['Team working 20%|||Team working 20%', 'Requirement analysing 20%|||Phân tích yêu cầu 20%', 'Software product/implementation 40%|||Sản phẩm/hiện thực 40%', 'Software designing 20%|||Thiết kế 20%'], correctIndex: 2, explanation: 'Team working 20%, product/implementation 40%, requirement analysing 20%, designing 20%.|||Team working 20%, sản phẩm/hiện thực 40%, phân tích yêu cầu 20%, thiết kế 20%.' },
      { question: 'Which statement about passing the final presentation is correct?|||Phát biểu nào về điều kiện qua buổi thuyết trình là đúng?', options: ['A high iteration grade compensates a low presentation grade|||Điểm iteration cao bù được điểm thuyết trình thấp', 'Only the team average matters|||Chỉ điểm trung bình nhóm là quan trọng', 'It is pass/fail without a grade|||Chỉ đạt/không đạt, không có điểm', 'The Final Presentation Grade must be at least 5/10 on its own|||Điểm Final Presentation tự nó phải đạt ít nhất 5/10'], correctIndex: 3, explanation: 'Pass conditions include OG >= 5 AND Final Presentation Grade >= 5/10 (it evaluates the iteration-3 results), plus attendance and no cheating.|||Điều kiện qua gồm OG >= 5 VÀ điểm Final Presentation >= 5/10 (đánh giá kết quả iter3), cộng chuyên cần và không gian lận.' },
      { question: 'In SWP391 the teacher acts as…|||Trong SWP391 giảng viên đóng vai…', options: ['both coach/mentor and customer/PO, the final point to confirm requirements|||vừa coach/mentor vừa customer/PO, điểm cuối cùng xác nhận yêu cầu', 'only a grader who does not answer questions|||chỉ người chấm, không trả lời câu hỏi', 'the team leader|||trưởng nhóm', 'a tester who writes test cases for the team|||tester viết test case cho nhóm'], correctIndex: 0, explanation: 'Subject Guides slide 5: the teacher is both the coach/mentor and the customer/PO for the student teams.|||Subject Guides slide 5: giảng viên vừa là coach/mentor vừa là customer/PO của các nhóm.' },
      { question: 'A requirement question for the teacher should best be recorded as…|||Câu hỏi về yêu cầu gửi giảng viên nên được ghi lại tốt nhất dưới dạng…', options: ['a private chat message only|||chỉ một tin nhắn riêng', 'a comment in the source code|||một comment trong mã nguồn', 'nothing, the team remembers it|||không cần, nhóm tự nhớ', 'a GitLab issue with the Q&A label, then a business rule in the RDS|||một issue GitLab gắn label Q&A, rồi thành business rule trong RDS'], correctIndex: 3, explanation: 'The Q&A label exists for questions; the confirmed answer becomes a written rule the examiners can check.|||Label Q&A dành cho câu hỏi; câu trả lời đã xác nhận thành quy tắc bằng văn bản mà giám khảo kiểm được.' },
      { question: 'A defect found by the teacher after the team submitted an iteration is labelled…|||Lỗi do giảng viên phát hiện sau khi nhóm đã nộp iteration được gắn label…', options: ['Defect|||Defect', 'Leakage|||Leakage', 'Task|||Task', 'Req|||Req'], correctIndex: 1, explanation: 'Defect = found by the team; Leakage = found by the teacher/customer after submission.|||Defect = nhóm tự tìm ra; Leakage = giảng viên/khách hàng tìm ra sau khi nộp.' },
      { question: 'Why should work be split by screen rather than by layer?|||Vì sao nên chia việc theo màn hình thay vì theo tầng?', options: ['Because each member must do requirement, design and full-stack code for his/her own screens, and LOC is graded per person per screen|||Vì mỗi thành viên phải tự làm requirement, design và code full-stack cho màn hình của mình, và LOC chấm theo từng người từng màn hình', 'Because layers are not allowed in SWP391|||Vì SWP391 cấm chia tầng', 'Because it needs fewer meetings|||Vì cần ít cuộc họp hơn', 'Because the teacher codes the database|||Vì giảng viên code database'], correctIndex: 0, explanation: 'Subject Guides slide 5 and the LOC rule: each member owns 3–4 screens end to end every iteration.|||Subject Guides slide 5 và quy tắc LOC: mỗi người làm trọn 3–4 màn hình mỗi iteration.' },
      { question: 'Which part of the Weekly Report (Template6) lists blockers with an owner and a proposed solution?|||Phần nào của Weekly Report (Template6) liệt kê vướng mắc kèm người phụ trách và hướng giải quyết?', options: ['I. Status Report|||I. Status Report', 'II. Project Issues|||II. Project Issues', 'III. Next Week Plan|||III. Next Week Plan', 'IV. Other Project Matters/Suggestions|||IV. Other Project Matters/Suggestions'], correctIndex: 1, explanation: 'Part II has columns Project Issue, Owner, Status, Notes (Solution, Suggestion…).|||Phần II có các cột Project Issue, Owner, Status, Notes (Solution, Suggestion…).' },
      { question: 'In the AI Usage Report (Template5), which column shows how you checked and changed the AI output?|||Trong AI Usage Report (Template5), cột nào cho thấy bạn đã kiểm và sửa kết quả AI thế nào?', options: ['AI Output|||AI Output', 'Value Added (1-5)|||Value Added (1-5)', 'Student\'s Validation / Modification|||Student\'s Validation / Modification', 'SDLC Phase|||SDLC Phase'], correctIndex: 2, explanation: 'Validation/Modification records what you kept, rewrote or rejected — it proves you own the result.|||Validation/Modification ghi bạn giữ, viết lại hay bỏ gì — chứng minh bạn làm chủ kết quả.' },
      { question: 'What must the Evidence/Link of an AI Usage Report row contain?|||Cột Evidence/Link của một dòng AI Usage Report phải chứa gì?', options: ['Only the name of the AI tool|||Chỉ tên công cụ AI', 'The final source code|||Mã nguồn cuối cùng', 'A shared folder of screenshots/videos showing the prompt, the AI response and the student follow-up|||Thư mục chia sẻ ảnh chụp/video có prompt, câu trả lời của AI và phần sinh viên hỏi tiếp', 'The teacher\'s signature|||Chữ ký của giảng viên'], correctIndex: 2, explanation: 'The Instruction sheet: screenshots/videos must clearly show prompt, AI response and student follow-up; naming GroupX_SessionY_Activity.|||Sheet Instruction: ảnh/video phải thấy rõ prompt, câu trả lời AI và phần sinh viên hỏi tiếp; đặt tên GroupX_SessionY_Activity.' },
      { question: 'Which of these is treated as cheating in SWP391?|||Việc nào sau đây bị coi là gian lận trong SWP391?', options: ['Using an AI tool, declaring it and explaining the result|||Dùng công cụ AI, khai báo và giải thích được kết quả', 'Starting from a teacher-recommended UI theme|||Bắt đầu từ một UI theme giảng viên gợi ý', 'Submitting code of an earlier semester\'s team as your own|||Nộp code của nhóm khoá trước như của mình', 'Asking the teacher to confirm a business rule|||Hỏi giảng viên xác nhận một business rule'], correctIndex: 2, explanation: 'Reusing another team\'s work as your own is plagiarism; declared, verified AI use and declared theme reuse are allowed.|||Dùng bài của nhóm khác như của mình là đạo văn; dùng AI có khai báo, có kiểm chứng và tái dùng theme có nói rõ là được phép.' },
      { question: 'Guide slide 2 "Project Overview" is mainly graded under…|||Slide 2 "Project Overview" chủ yếu được chấm ở tiêu chí…', options: ['Team working|||Team working', 'Software designing|||Thiết kế', 'Product/implementation|||Sản phẩm/hiện thực', 'None, it is decoration|||Không tiêu chí nào, chỉ trang trí'], correctIndex: 0, explanation: 'It shows the team members and how the team manages the project (communication, issue tracking) — team working.|||Nó cho thấy thành viên và cách nhóm quản lý dự án (giao tiếp, theo dõi issue) — team working.' },
      { question: 'On guide slide 3, which use cases should appear?|||Trên slide 3 của hướng dẫn, những use case nào nên xuất hiện?', options: ['All use cases ever planned|||Mọi use case từng lên kế hoạch', 'Only the admin use cases|||Chỉ use case của admin', 'Use cases of similar systems on the market|||Use case của các hệ thống tương tự trên thị trường', 'The use cases completed in the project, preferably one diagram per actor|||Các use case đã hoàn thành, tốt nhất mỗi actor một sơ đồ'], correctIndex: 3, explanation: 'The slide says: use case diagrams for the use cases you have completed, preferably one diagram per product actor.|||Slide ghi: sơ đồ use case cho các use case đã hoàn thành, tốt nhất mỗi actor một sơ đồ.' },
      { question: 'Guide slide 4 "Product Functionalities" asks for…|||Slide 4 "Product Functionalities" yêu cầu…', options: ['the screen flow for all screens and the list of Non-UI functions|||screen flow của mọi màn hình và danh sách chức năng Non-UI', 'the ERD and the SQL script|||ERD và script SQL', 'the Gantt chart|||biểu đồ Gantt', 'the test report|||báo cáo kiểm thử'], correctIndex: 0, explanation: 'Screen flow for all screens plus Non-UI functions (if any) — e.g. e-mail sending, scheduled jobs.|||Screen flow của mọi màn hình cộng chức năng Non-UI (nếu có) — vd gửi e-mail, job định kỳ.' },
      { question: 'How does guide slide 8 ask you to present each demonstrated workflow?|||Slide 8 yêu cầu trình bày mỗi luồng demo dưới dạng nào?', options: ['A class diagram|||Class diagram', 'A swimlane diagram with screens and actors/roles|||Swimlane diagram gồm màn hình và actor/vai trò', 'A paragraph of text|||Một đoạn văn', 'A table of SQL queries|||Bảng các câu SQL'], correctIndex: 1, explanation: 'Workflows are defined by main data entities or roles and drawn as swimlanes in which screens and actors/roles are included.|||Luồng được xác định theo thực thể dữ liệu chính hoặc vai trò và vẽ thành swimlane có màn hình và actor/vai trò.' },
      { question: 'An examiner asks a member to open the code of his screen and add a small check. This mainly tests…|||Giám khảo yêu cầu một thành viên mở code màn hình của mình và thêm một kiểm tra nhỏ. Việc này chủ yếu kiểm tra…', options: ['typing speed|||tốc độ gõ phím', 'the projector|||máy chiếu', 'the RDS formatting|||định dạng RDS', 'code ownership — that the member really wrote and understands the code|||quyền sở hữu code — thành viên thật sự viết và hiểu code'], correctIndex: 3, explanation: 'Grades are individual; a live change quickly shows whether the member owns the code.|||Điểm là cá nhân; một thay đổi trực tiếp nhanh chóng cho thấy thành viên có làm chủ code không.' },
      { question: 'In the G5 RDS, where are the screen × role permissions described?|||Trong RDS của G5, phân quyền màn hình × vai trò được mô tả ở đâu?', options: ['I.3.3 Screen Authorization|||I.3.3 Screen Authorization', 'IV. Code Designs|||IV. Code Designs', 'Record of Changes|||Record of Changes', 'V.1 Assumptions|||V.1 Assumptions'], correctIndex: 0, explanation: 'Part I Overall Functionalities has Screens Flow, Screen Descriptions, Screen Authorization and Non-UI Functions.|||Phần I Overall Functionalities gồm Screens Flow, Screen Descriptions, Screen Authorization và Non-UI Functions.' },
      { question: 'What does Part IV "Code Designs" of the RDS contain for each function?|||Phần IV "Code Designs" của RDS chứa gì cho mỗi chức năng?', options: ['Class diagram, sequence diagram(s) and database queries|||Class diagram, sequence diagram và các câu truy vấn database', 'Only screenshots|||Chỉ ảnh chụp màn hình', 'The weekly reports|||Các báo cáo tuần', 'The AI usage log|||Nhật ký dùng AI'], correctIndex: 0, explanation: 'Each function in G5 Part IV has Class Diagram, Sequence Diagram(s) and Database Queries.|||Mỗi chức năng trong Phần IV của G5 có Class Diagram, Sequence Diagram và Database Queries.' },
      { question: 'When the 2026 templates split the RDS in two, where do the class and sequence diagrams go?|||Khi bộ template 2026 tách RDS làm hai, class và sequence diagram chuyển về đâu?', options: ['SRS section 1.3 User Requirements|||SRS mục 1.3 User Requirements', 'SDS section 3 Detailed Design|||SDS mục 3 Detailed Design', 'The Weekly Report|||Weekly Report', 'The Project Tracking sheet|||Sheet Project Tracking'], correctIndex: 1, explanation: 'SDS (Template2): 1 High Level Design, 2 State Transition Diagrams, 3 Detailed Design (class + sequence diagrams per feature).|||SDS (Template2): 1 High Level Design, 2 State Transition Diagrams, 3 Detailed Design (class + sequence diagram theo tính năng).' },
      { question: 'In the capstone report, what are LI-01…LI-04 and EX-01…EX-02?|||Trong báo cáo capstone, LI-01…LI-04 và EX-01…EX-02 là gì?', options: ['Test cases|||Test case', 'Numbered limitations and exclusions of the scope|||Các giới hạn và loại trừ phạm vi có đánh số', 'Database tables|||Bảng database', 'Team members|||Thành viên nhóm'], correctIndex: 1, explanation: 'Section I.6.2 Limitations & Exclusions, e.g. no mobile version, no manual grading of written answers.|||Mục I.6.2 Limitations & Exclusions, vd không có bản mobile, không chấm tay bài tự luận.' },
      { question: 'The capstone report estimates effort with Simple = 4, Medium = 7, Complex = 10 man-days. SWP391 uses complexity for…|||Báo cáo capstone ước lượng công sức Simple = 4, Medium = 7, Complex = 10 ngày công. SWP391 dùng độ phức tạp để…', options: ['nothing|||không để làm gì', 'grading: Converted-LOC = Complexity (60/120/240) x Quality|||chấm điểm: Converted-LOC = Complexity (60/120/240) x Quality', 'choosing the team leader|||chọn trưởng nhóm', 'deciding the presentation order|||quyết định thứ tự thuyết trình'], correctIndex: 1, explanation: 'Subject Guides slide 7: Simple 60, Medium 120, Complex 240, times Quality 100/75/50%.|||Subject Guides slide 7: Simple 60, Medium 120, Complex 240, nhân Quality 100/75/50%.' },
      { question: 'Which capstone report part has no full equivalent in the SWP391 RDS?|||Phần nào của báo cáo capstone không có tương đương đầy đủ trong RDS của SWP391?', options: ['Use case diagrams|||Sơ đồ use case', 'Database design|||Thiết kế database', 'VI. Release Package & User Guides (installation guide, user manual)|||VI. Release Package & User Guides (hướng dẫn cài đặt, hướng dẫn sử dụng)', 'Business rules|||Business rule'], correctIndex: 2, explanation: 'Requirement and design parts map to the RDS; SWP391 only asks for a tagged release with DB scripts and demo videos, not a user manual.|||Phần yêu cầu và thiết kế ứng với RDS; SWP391 chỉ yêu cầu bản phát hành gắn tag kèm DB script và video demo, không cần hướng dẫn sử dụng.' },
    ],
  },
};

export default {
  title: 'Chapter 7 — Teamwork, the RDS/final report & the final presentation (40%)|||Chương 7 — Làm việc nhóm, tài liệu RDS/báo cáo cuối & thuyết trình cuối kỳ (40%)',
  description: 'Làm việc nhóm với giảng viên vừa là coach vừa là khách hàng, báo cáo tuần, liêm chính và AI Usage Report; cấu trúc tài liệu RDS và một báo cáo capstone thật; thuyết trình cuối kỳ 40% theo Slide6 và Template7 — kịch bản 15 phút, demo, Q&A.',
  lessons: [L71, L72, L73, L74, L75, Q7],
};
