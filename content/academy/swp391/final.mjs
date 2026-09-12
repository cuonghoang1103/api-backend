/**
 * SWP391 · Final Exam section (title kept EXACT: 'Final Exam|||Thi cuối kỳ' — the seeder
 * matches this section by title, so do not rename it).
 * Truth from the Subject Guides p.4/p.7 and Student Guides p.4/p.7: SWP391 has NO written
 * PE or FE exam. The final 40% is the Final Presentation, evaluated by 2 teachers other
 * than the class teacher; the other 60% are the three iteration grades.
 * On this site:
 *   swp391-final-exam-pe (article) — the "practical" part = Final Presentation + product demo
 *   swp391-final-exam-fe (article + quiz) — a self-check over the whole course
 * Privacy: no person from the G5 sample or the capstone report is named.
 */
import { slide, bi, books } from './_slides.mjs';

/* ─────────────────────── PE page ─────────────────────── */
const PPE = [];

PPE.push(bi(`<span class="eyebrow">Final Exam · PE · what it really is in SWP391</span>
<h2>There is no practical exam — the "final" is your Final Presentation (40%)</h2>
<p class="lead">Most FPT subjects end with a PE and an FE. <strong>SWP391 does not.</strong> The Subject Guides and the Student Guides list only four graded milestones: three iterations and a Final Presentation judged by two teachers who are not your class teacher. On this site, the "PE" page is therefore the practical side of that presentation: showing a working product and defending it.</p>
<div class="callout"><strong>What this page gives you.</strong>
<ul>
<li>The real grading of SWP391, from the guide slides, with worked OG and LOC calculations.</li>
<li>How the two evaluators score the presentation (20 / 40 / 20 / 20) and what they look for in each part.</li>
<li>A preparation plan from the start of iteration 3 to the day, a demo script and a Q&amp;A question bank.</li>
<li>The mistakes that sink teams on the day.</li>
</ul></div>
<h3>How SWP391 is really graded</h3>
<table>
<thead><tr><th>#</th><th>Milestone</th><th>Duration (slots 135' / 90')</th><th>Weight</th><th>Evaluated by</th></tr></thead>
<tbody>
<tr><td>1</td><td>Iteration 1</td><td>6 / 9</td><td>15%</td><td>Class (guiding) teacher</td></tr>
<tr><td>2</td><td>Iteration 2</td><td>6 / 9</td><td>20%</td><td>Class teacher</td></tr>
<tr><td>3</td><td>Iteration 3 — final package</td><td>6 / 9</td><td>25%</td><td>Class teacher</td></tr>
<tr><td>4</td><td><strong>Final Presentation</strong></td><td>2 / 3</td><td><strong>40%</strong></td><td>2 other teachers</td></tr>
</tbody>
</table>
<p class="ghi-chu">No written test, no computer-graded multiple choice, no exam room. If a "PE" or "FE" appears in your schedule, it is the presentation slot — confirm with your teacher on EduNext/CMS.</p>`,
`<span class="eyebrow">Thi cuối kỳ · PE · thực chất trong SWP391</span>
<h2>Không có thi thực hành — "cuối kỳ" chính là buổi Final Presentation (40%)</h2>
<p class="lead">Phần lớn các môn ở FPT kết thúc bằng PE và FE. <strong>SWP391 thì không.</strong> Subject Guides và Student Guides chỉ liệt kê bốn mốc có điểm: ba iteration và một buổi Final Presentation do hai giảng viên không phải giảng viên lớp bạn chấm. Vì vậy trên trang này, "PE" là phần thực hành của buổi thuyết trình đó: trình diễn một sản phẩm chạy được và bảo vệ nó.</p>
<div class="callout"><strong>Trang này cho bạn gì.</strong>
<ul>
<li>Cách chấm thật của SWP391, lấy từ slide guide, kèm tính mẫu OG và LOC.</li>
<li>Hai giảng viên chấm buổi thuyết trình thế nào (20 / 40 / 20 / 20) và mỗi phần họ tìm gì.</li>
<li>Kế hoạch chuẩn bị từ đầu iteration 3 tới hôm thuyết trình, kịch bản demo và ngân hàng câu hỏi Q&amp;A.</li>
<li>Những lỗi làm nhóm trượt ngay trong buổi.</li>
</ul></div>
<h3>SWP391 thực sự được chấm thế nào</h3>
<table>
<thead><tr><th>#</th><th>Mốc</th><th>Thời lượng (slot 135' / 90')</th><th>Trọng số</th><th>Người chấm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Iteration 1</td><td>6 / 9</td><td>15%</td><td>Giảng viên lớp (hướng dẫn)</td></tr>
<tr><td>2</td><td>Iteration 2</td><td>6 / 9</td><td>20%</td><td>Giảng viên lớp</td></tr>
<tr><td>3</td><td>Iteration 3 — bộ nộp cuối</td><td>6 / 9</td><td>25%</td><td>Giảng viên lớp</td></tr>
<tr><td>4</td><td><strong>Final Presentation</strong></td><td>2 / 3</td><td><strong>40%</strong></td><td>2 giảng viên khác</td></tr>
</tbody>
</table>
<p class="ghi-chu">Không có bài thi viết, không trắc nghiệm máy chấm, không phòng thi. Nếu lịch của bạn có "PE" hay "FE", đó là slot thuyết trình — xác nhận lại với giảng viên trên EduNext/CMS.</p>`));

PPE.push(bi(`<h2>📑 The two guide slides that define your final grade</h2>`,
`<h2>📑 Hai slide trong guide quyết định điểm cuối kỳ của bạn</h2>`));

PPE.push(slide('g-subject', 4, 'Milestones & Evaluations — pass conditions',
`<p class="y-chinh">🎯 You pass only if ALL four conditions hold — a strong presentation cannot rescue weak iterations, and strong iterations cannot rescue a weak presentation.</p>
<p class="nhan">The four conditions</p>
<ol>
<li><strong>Attendance ≥ 80%</strong> of the slots.</li>
<li><strong>OG ≥ 5</strong>, where OG = (iter1·15% + iter2·20% + iter3·25%) / 60%.</li>
<li><strong>Final Presentation ≥ 5</strong> — it "evaluates the iter3 results".</li>
<li><strong>No cheating found</strong>.</li>
</ol>
<p class="nhan">Worked example — the gates, computed</p>
<table>
<thead><tr><th>Iter 1</th><th>Iter 2</th><th>Iter 3</th><th>OG</th><th>Final Pres.</th><th>Weighted total</th><th>Result</th></tr></thead>
<tbody>
<tr><td>6</td><td>7</td><td>5</td><td>5.92</td><td>6</td><td>5.95</td><td>Pass</td></tr>
<tr><td>3</td><td>4</td><td>6</td><td><strong>4.58</strong></td><td>9</td><td>6.35</td><td><strong>Fail</strong> — OG &lt; 5</td></tr>
<tr><td>8</td><td>7</td><td>7.5</td><td>7.46</td><td><strong>4.5</strong></td><td>6.28</td><td><strong>Fail</strong> — presentation &lt; 5</td></tr>
</tbody>
</table>
<p class="ghi-chu">Weighted total = iter1·15% + iter2·20% + iter3·25% + presentation·40%. Rows 2 and 3 show a total above 5 that still fails: the gates are checked separately.</p>`,
`<p class="y-chinh">🎯 Bạn chỉ qua môn khi thoả CẢ bốn điều kiện — thuyết trình hay không cứu được iteration yếu, và iteration tốt không cứu được buổi thuyết trình yếu.</p>
<p class="nhan">Bốn điều kiện</p>
<ol>
<li><strong>Chuyên cần ≥ 80%</strong> số slot.</li>
<li><strong>OG ≥ 5</strong>, với OG = (iter1·15% + iter2·20% + iter3·25%) / 60%.</li>
<li><strong>Final Presentation ≥ 5</strong> — buổi này "đánh giá kết quả iter3".</li>
<li><strong>Không phát hiện gian lận</strong>.</li>
</ol>
<p class="nhan">Ví dụ có lời giải — tính các cổng</p>
<table>
<thead><tr><th>Iter 1</th><th>Iter 2</th><th>Iter 3</th><th>OG</th><th>Thuyết trình</th><th>Tổng có trọng số</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>6</td><td>7</td><td>5</td><td>5.92</td><td>6</td><td>5.95</td><td>Qua</td></tr>
<tr><td>3</td><td>4</td><td>6</td><td><strong>4.58</strong></td><td>9</td><td>6.35</td><td><strong>Trượt</strong> — OG &lt; 5</td></tr>
<tr><td>8</td><td>7</td><td>7.5</td><td>7.46</td><td><strong>4.5</strong></td><td>6.28</td><td><strong>Trượt</strong> — thuyết trình &lt; 5</td></tr>
</tbody>
</table>
<p class="ghi-chu">Tổng có trọng số = iter1·15% + iter2·20% + iter3·25% + thuyết trình·40%. Dòng 2 và 3 có tổng trên 5 mà vẫn trượt: các cổng được xét riêng.</p>`));

PPE.push(slide('g-subject', 7, 'Evaluation Criteria — LOC, package, final presentation',
`<p class="y-chinh">🎯 Iterations are graded on LOC (per person) and the submitted package; the Final Presentation is scored by two outside teachers on four weighted criteria.</p>
<p class="nhan">Iteration grade</p>
<ul>
<li><strong>Converted-LOC = C × Q</strong> — C: Complex 240 · Medium 120 · Simple 60; Q: High 100% · Medium 75% · Low 50%.</li>
<li><strong>LOC Grade</strong> = Converted-LOC × 10 / MaxLOC — this deck 180 / 240 / 660; Student Guides 240 / 240 / 720, with LOC 70% + package 30%. Follow your teacher's current guide.</li>
</ul>
<p class="nhan">Worked example — one member's iteration 3</p>
<ol>
<li>Complex screen, High quality → 240 × 100% = 240</li>
<li>Medium screen, Medium quality → 120 × 75% = 90</li>
<li>Simple screen, High quality → 60 × 100% = 60</li>
<li>Converted-LOC = 390 → 390 × 10 / 660 = <strong>5.91</strong> (Subject Guides) or 390 × 10 / 720 = <strong>5.42</strong> (Student Guides)</li>
</ol>
<p class="nhan">Final Presentation — the four criteria</p>
<ul>
<li><strong>Team working (presentation, Q&amp;A…) — 20%</strong></li>
<li><strong>Software product / implementation — 40%</strong></li>
<li><strong>Requirement analyzing — 20%</strong></li>
<li><strong>Software designing — 20%</strong></li>
</ul>`,
`<p class="y-chinh">🎯 Iteration được chấm theo LOC (từng người) và bộ nộp; Final Presentation do hai giảng viên ngoài chấm theo bốn tiêu chí có trọng số.</p>
<p class="nhan">Điểm iteration</p>
<ul>
<li><strong>Converted-LOC = C × Q</strong> — C: Complex 240 · Medium 120 · Simple 60; Q: High 100% · Medium 75% · Low 50%.</li>
<li><strong>LOC Grade</strong> = Converted-LOC × 10 / MaxLOC — slide này 180 / 240 / 660; Student Guides 240 / 240 / 720, với LOC 70% + bộ nộp 30%. Theo guide hiện hành của giảng viên bạn.</li>
</ul>
<p class="nhan">Ví dụ có lời giải — iteration 3 của một thành viên</p>
<ol>
<li>Màn hình Complex, chất lượng High → 240 × 100% = 240</li>
<li>Màn hình Medium, chất lượng Medium → 120 × 75% = 90</li>
<li>Màn hình Simple, chất lượng High → 60 × 100% = 60</li>
<li>Converted-LOC = 390 → 390 × 10 / 660 = <strong>5.91</strong> (Subject Guides) hoặc 390 × 10 / 720 = <strong>5.42</strong> (Student Guides)</li>
</ol>
<p class="nhan">Final Presentation — bốn tiêu chí</p>
<ul>
<li><strong>Làm việc nhóm (trình bày, Q&amp;A…) — 20%</strong></li>
<li><strong>Sản phẩm / hiện thực — 40%</strong></li>
<li><strong>Phân tích yêu cầu — 20%</strong></li>
<li><strong>Thiết kế phần mềm — 20%</strong></li>
</ul>`));

PPE.push(bi(`<h2>🎯 What the evaluators look for — criterion by criterion</h2>
<p>The presentation template (Template7 / Slide6) has eight slides. Each serves one criterion; build them from what your team already submitted.</p>
<table>
<thead><tr><th>Criterion (weight)</th><th>Template slides that carry it</th><th>What convinces the evaluators</th></tr></thead>
<tbody>
<tr><td>Product / implementation (40%)</td><td>Product functionalities (screen flow, non-UI functions) · Main screens · Demonstration</td><td>A live demo of the main workflows end to end, on clean demo data, without crashes</td></tr>
<tr><td>Requirement analysis (20%)</td><td>Use-case diagrams (one per actor preferred)</td><td>Only the UCs you completed; each one traceable to screens you can show</td></tr>
<tr><td>Design (20%)</td><td>Database design · Package diagram</td><td>A schema and packages that match the code; you can explain one design choice</td></tr>
<tr><td>Team working (20%)</td><td>Project overview (management, communication, issue tracking)</td><td>GitLab issues, labels and milestones as evidence; every member presents and answers</td></tr>
</tbody>
</table>
<h2>🗓️ Preparation plan — from iteration 3 to the day</h2>
<ol>
<li><strong>Start of iteration 3</strong> — freeze the scope with the teacher; list the 2–3 main workflows you will demo.</li>
<li><strong>Middle of iteration 3</strong> — draft the 8 slides from the RDS: UC diagram, screen flow, DB schema, package diagram, swimlane per workflow.</li>
<li><strong>End of iteration 3</strong> — tag the final package; build a demo-data script with realistic but fake records; record a backup video of every workflow.</li>
<li><strong>Rehearsal 1</strong> — full run with a timer; each member presents the part they built.</li>
<li><strong>Rehearsal 2</strong> — a teammate plays the evaluator and asks the questions below; fix weak answers.</li>
<li><strong>Day before</strong> — reset the database, test on the laptop you will use, charge it, keep the video offline.</li>
</ol>`,
`<h2>🎯 Người chấm tìm gì — theo từng tiêu chí</h2>
<p>Template thuyết trình (Template7 / Slide6) có tám slide. Mỗi slide phục vụ một tiêu chí; dựng chúng từ những gì nhóm đã nộp.</p>
<table>
<thead><tr><th>Tiêu chí (trọng số)</th><th>Slide template gánh tiêu chí</th><th>Điều thuyết phục người chấm</th></tr></thead>
<tbody>
<tr><td>Sản phẩm / hiện thực (40%)</td><td>Product functionalities (screen flow, chức năng không UI) · Main screens · Demonstration</td><td>Demo trực tiếp các luồng chính từ đầu tới cuối, trên dữ liệu demo sạch, không lỗi</td></tr>
<tr><td>Phân tích yêu cầu (20%)</td><td>Use-case diagram (nên mỗi actor một sơ đồ)</td><td>Chỉ các UC đã hoàn thành; UC nào cũng truy tới màn hình bạn đưa ra được</td></tr>
<tr><td>Thiết kế (20%)</td><td>Database design · Package diagram</td><td>Schema và package khớp với code; giải thích được một quyết định thiết kế</td></tr>
<tr><td>Làm việc nhóm (20%)</td><td>Project overview (quản lý, giao tiếp, theo dõi issue)</td><td>Issue, label, milestone trên GitLab làm bằng chứng; thành viên nào cũng trình bày và trả lời</td></tr>
</tbody>
</table>
<h2>🗓️ Kế hoạch chuẩn bị — từ iteration 3 tới hôm thuyết trình</h2>
<ol>
<li><strong>Đầu iteration 3</strong> — chốt phạm vi với giảng viên; liệt kê 2–3 luồng chính sẽ demo.</li>
<li><strong>Giữa iteration 3</strong> — phác 8 slide từ RDS: UC diagram, screen flow, schema CSDL, package diagram, swimlane cho mỗi luồng.</li>
<li><strong>Cuối iteration 3</strong> — gắn tag bộ nộp cuối; làm script dữ liệu demo giống thật nhưng là dữ liệu giả; quay video dự phòng cho mọi luồng.</li>
<li><strong>Tổng duyệt 1</strong> — chạy trọn có bấm giờ; mỗi thành viên trình bày phần mình làm.</li>
<li><strong>Tổng duyệt 2</strong> — một bạn đóng vai người chấm và hỏi các câu bên dưới; sửa những câu trả lời yếu.</li>
<li><strong>Hôm trước</strong> — reset CSDL, chạy thử trên đúng laptop sẽ dùng, sạc pin, để video ở chế độ offline.</li>
</ol>`));

PPE.push(bi(`<h2>❓ Q&amp;A question bank — rehearse these</h2>
<p class="nhan">Requirement analysis</p>
<ol>
<li>Which actor uses this screen, and which use case does it implement?</li>
<li>What happens in the alternative flow — for example when the job is already closed?</li>
<li>Which requirement changed during the project, and who confirmed the change?</li>
</ol>
<p class="nhan">Design</p>
<ol>
<li>Why is this relationship 1–n and not n–n? Show the foreign key.</li>
<li>Which package holds the SQL, and why is it not in the servlet/JSP?</li>
<li>How does the system decide what a role may see (filter, session, menu)?</li>
</ol>
<p class="nhan">Implementation (asked to each member about his/her own screens)</p>
<ol>
<li>Open the code of your screen. Where is the input validated?</li>
<li>Why is this query safe against SQL injection?</li>
<li>Change a rule live — page size, a validation message, a sort order.</li>
</ol>
<p class="nhan">Team working</p>
<ol>
<li>Show the GitLab board: how were Req, Task, Defect and Leakage issues used?</li>
<li>How were merge conflicts handled? Who merged into <code>main</code>?</li>
<li>Where did AI help, and how did the team check its output? (Chapter 8)</li>
</ol>
<h2>✅ Day-of checklist</h2>
<ul>
<li><strong>Before</strong> — database reset to demo data; the tagged build running; slides and backup video on the laptop; charger.</li>
<li><strong>During</strong> — follow the swimlane of each workflow; say which member built each screen; keep to time.</li>
<li><strong>If the demo breaks</strong> — say what failed, switch to the backup video, keep going. Evaluators score how you handle it.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Mistakes that sink teams.</strong>
<ul>
<li>Slides show use cases that were never built — the requirement score drops and the demo exposes it.</li>
<li>One member presents everything; the others cannot answer about their own code.</li>
<li>Demo data typed live, or real personal data in the database.</li>
<li>The DB schema on the slide no longer matches the code.</li>
</ul></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Demo like a sprint review.</strong> In Scrum, the sprint review shows only <em>done</em> increments to stakeholders and collects feedback. Present the same way: say which iteration each screen shipped in, show the Product sheet status, and end with what you would build next. It proves the three iterations were real, not a last-week sprint.</div>`,
`<h2>❓ Ngân hàng câu hỏi Q&amp;A — tập trả lời trước</h2>
<p class="nhan">Phân tích yêu cầu</p>
<ol>
<li>Actor nào dùng màn hình này, và nó hiện thực use case nào?</li>
<li>Luồng thay thế xảy ra thế nào — ví dụ khi job đã đóng?</li>
<li>Yêu cầu nào đã thay đổi trong dự án, và ai xác nhận thay đổi đó?</li>
</ol>
<p class="nhan">Thiết kế</p>
<ol>
<li>Vì sao quan hệ này là 1–n chứ không phải n–n? Chỉ ra khoá ngoại.</li>
<li>Package nào chứa SQL, và vì sao nó không nằm trong servlet/JSP?</li>
<li>Hệ thống quyết định mỗi role được thấy gì bằng cách nào (filter, session, menu)?</li>
</ol>
<p class="nhan">Hiện thực (hỏi từng thành viên về màn hình của chính mình)</p>
<ol>
<li>Mở code màn hình của em. Input được validate ở đâu?</li>
<li>Vì sao câu truy vấn này an toàn trước SQL injection?</li>
<li>Sửa một quy tắc ngay tại chỗ — page size, thông báo validate, thứ tự sắp xếp.</li>
</ol>
<p class="nhan">Làm việc nhóm</p>
<ol>
<li>Cho xem board GitLab: issue Req, Task, Defect và Leakage được dùng thế nào?</li>
<li>Xung đột merge được xử lý ra sao? Ai merge vào <code>main</code>?</li>
<li>AI giúp ở đâu, và nhóm kiểm đầu ra của nó thế nào? (Chương 8)</li>
</ol>
<h2>✅ Checklist ngày thuyết trình</h2>
<ul>
<li><strong>Trước</strong> — CSDL đã reset về dữ liệu demo; bản build từ tag đang chạy; slide và video dự phòng có trên laptop; sạc.</li>
<li><strong>Trong</strong> — đi theo swimlane của từng luồng; nói rõ thành viên nào làm màn hình nào; giữ đúng giờ.</li>
<li><strong>Nếu demo hỏng</strong> — nói rõ lỗi gì, chuyển sang video dự phòng, tiếp tục. Người chấm cho điểm cả cách bạn xử lý.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Những lỗi làm nhóm trượt.</strong>
<ul>
<li>Slide có use case chưa từng làm — điểm yêu cầu giảm và buổi demo lộ ra ngay.</li>
<li>Một thành viên trình bày hết; những người khác không trả lời được về code của chính mình.</li>
<li>Gõ dữ liệu demo tại chỗ, hoặc CSDL chứa dữ liệu cá nhân thật.</li>
<li>Schema CSDL trên slide không còn khớp với code.</li>
</ul></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Demo như một buổi sprint review.</strong> Trong Scrum, sprint review chỉ trình bày các phần đã <em>hoàn thành</em> cho stakeholder và thu phản hồi. Hãy trình bày theo cách đó: nói màn hình nào ra đời ở iteration nào, cho xem trạng thái trong sheet Product, và kết bằng việc sẽ làm tiếp. Nó chứng minh ba iteration là thật, không phải dồn hết vào tuần cuối.</div>`));

PPE.push(books([
  ['sommerville', 'ch. 22 Project management · ch. 8 Software testing (§8.3 Release testing)', 'chương 22 Quản lý dự án · chương 8 Kiểm thử phần mềm (§8.3 Kiểm thử bản phát hành)'],
  ['wiegers', 'ch. 17 Validating the requirements (reviews, acceptance)', 'chương 17 Thẩm định yêu cầu (review, nghiệm thu)'],
]));

const LPE = {
  title: 'PE — The practical part: Final Presentation & product demo (no written PE)|||PE — Phần thực hành: Final Presentation & demo sản phẩm (không có thi PE)',
  slug: 'swp391-final-exam-pe',
  type: 'article',
  description: 'SWP391 không có bài thi PE/FE: 60% là ba iteration, 40% là Final Presentation do 2 giảng viên khác chấm (20/40/20/20). Cách tính OG và LOC có ví dụ, kế hoạch chuẩn bị, ngân hàng câu hỏi Q&A và checklist ngày thuyết trình.',
  content: PPE.join('\n'),
};

/* ─────────────────────── FE page ─────────────────────── */
const FE_CONTENT = bi(`<span class="eyebrow">Final Exam · FE · course self-check</span>
<h2>There is no written final exam — use this as a whole-course self-check</h2>
<p class="lead">SWP391 has <strong>no FE</strong>: no multiple-choice test, no written paper. Your grade is three iterations (60%) plus the Final Presentation (40%). The quiz below is a <strong>self-check</strong> built from the teacher's guides, templates and the lessons of this course. It does not count toward your grade — it tells you what you still cannot explain before the evaluators ask.</p>
<div class="callout"><strong>How to use it.</strong>
<ul>
<li>Take it once at the start of iteration 3 and once in the week before the presentation.</li>
<li>For every wrong answer, reread the explanation and the chapter in the map below.</li>
<li>Questions on grading and GitLab labels come straight from the guides — know them by heart; the evaluators assume you do.</li>
</ul></div>
<h3>Topic map — where each question group comes from</h3>
<table>
<thead><tr><th>Questions</th><th>Topic</th><th>Source</th></tr></thead>
<tbody>
<tr><td>1–8</td><td>Subject guides &amp; grading</td><td>Subject / Student Guides — milestones, pass conditions, LOC</td></tr>
<tr><td>9–12</td><td>Iteration package &amp; tracking</td><td>Submit items, Project Tracking, GitLab labels</td></tr>
<tr><td>13–16</td><td>Requirements</td><td>Software Requirement deck, SRS template</td></tr>
<tr><td>17–20</td><td>System &amp; database design</td><td>System Design and Database Design decks, SDS template</td></tr>
<tr><td>21–23</td><td>Git &amp; GitLab</td><td>GitLab Guides</td></tr>
<tr><td>24–25</td><td>Testing &amp; AI use</td><td>Template3 System Test, Template5 AI Usage Report (Chapter 8)</td></tr>
<tr><td>26–28</td><td>Final presentation</td><td>Presentation guide / Template7</td></tr>
</tbody>
</table>
<p class="ghi-chu">Where the two guide decks differ (MaxLOC 180/240/660 vs 240/240/720), the question says so. Always follow the version your teacher publishes on EduNext/CMS.</p>`,
`<span class="eyebrow">Thi cuối kỳ · FE · tự kiểm tra toàn môn</span>
<h2>Không có thi viết cuối kỳ — dùng trang này để tự kiểm tra toàn môn</h2>
<p class="lead">SWP391 <strong>không có FE</strong>: không trắc nghiệm, không bài viết. Điểm của bạn là ba iteration (60%) cộng Final Presentation (40%). Bộ câu hỏi dưới đây là bài <strong>tự kiểm tra</strong> dựng từ guide, template của giảng viên và các bài trong khoá này. Nó không tính vào điểm — nó cho bạn biết điều gì mình còn chưa giải thích được trước khi người chấm hỏi.</p>
<div class="callout"><strong>Cách dùng.</strong>
<ul>
<li>Làm một lần đầu iteration 3 và một lần trong tuần trước buổi thuyết trình.</li>
<li>Câu nào sai thì đọc lại phần giải thích và chương tương ứng trong bảng bên dưới.</li>
<li>Câu về cách chấm và label GitLab lấy thẳng từ guide — hãy thuộc lòng; người chấm mặc định là bạn đã biết.</li>
</ul></div>
<h3>Bản đồ chủ đề — mỗi nhóm câu hỏi lấy từ đâu</h3>
<table>
<thead><tr><th>Câu</th><th>Chủ đề</th><th>Nguồn</th></tr></thead>
<tbody>
<tr><td>1–8</td><td>Guide môn học &amp; cách chấm</td><td>Subject / Student Guides — các mốc, điều kiện qua môn, LOC</td></tr>
<tr><td>9–12</td><td>Bộ nộp iteration &amp; theo dõi</td><td>Mục cần nộp, Project Tracking, label GitLab</td></tr>
<tr><td>13–16</td><td>Yêu cầu</td><td>Slide Software Requirement, template SRS</td></tr>
<tr><td>17–20</td><td>Thiết kế hệ thống &amp; CSDL</td><td>Slide System Design và Database Design, template SDS</td></tr>
<tr><td>21–23</td><td>Git &amp; GitLab</td><td>GitLab Guides</td></tr>
<tr><td>24–25</td><td>Kiểm thử &amp; dùng AI</td><td>Template3 System Test, Template5 AI Usage Report (Chương 8)</td></tr>
<tr><td>26–28</td><td>Thuyết trình cuối kỳ</td><td>Hướng dẫn thuyết trình / Template7</td></tr>
</tbody>
</table>
<p class="ghi-chu">Chỗ nào hai bộ guide khác nhau (MaxLOC 180/240/660 và 240/240/720), câu hỏi nói rõ. Luôn theo phiên bản giảng viên đăng trên EduNext/CMS.</p>`);

// Correct answers are written first-hand in any slot; this spreads them over A–D so the key is not guessable.
// Numeric option lists (percentages, team sizes…) keep their natural order.
let qn = 0;
const q = (question, options, correctIndex, explanation) => {
  const target = [2, 0, 3, 1][qn++ % 4];
  if (options.every((o) => /^[0-9]/.test(o))) return { question, options, correctIndex, explanation, points: 1 };
  const opts = options.slice();
  const [right] = opts.splice(correctIndex, 1);
  opts.splice(target, 0, right);
  return { question, options: opts, correctIndex: target, explanation, points: 1 };
};
const FE_QUESTIONS = [
  // 1–8 guides & grading
  q('How many students does a SWP391 team normally have?|||Một nhóm SWP391 thường có bao nhiêu sinh viên?', ['2-3|||2-3', '4-5|||4-5', '6-8|||6-8', 'Any number|||Bao nhiêu cũng được'], 1, 'Subject Guides p.2: 4-5 students per team, assigned or arranged by the teacher.|||Subject Guides trang 2: 4-5 sinh viên mỗi nhóm, do giảng viên phân hoặc sắp xếp.'),
  q('How is the SWP391 project organised in time?|||Dự án SWP391 được tổ chức theo thời gian thế nào?', ['Requirement phase, code phase, deploy phase|||Pha yêu cầu, pha code, pha triển khai', 'Three iterations; in each one every member does requirement, design and code for his/her screens|||Ba iteration; trong mỗi iteration mỗi thành viên làm yêu cầu, thiết kế và code cho màn hình của mình', 'One big release at the end|||Một lần phát hành lớn ở cuối', 'Weekly exams|||Thi hằng tuần'], 1, 'Each iteration lasts 6 slots of 135 minutes (9 of 90) and covers the full cycle for the planned screens.|||Mỗi iteration dài 6 slot 135 phút (9 slot 90 phút) và đi trọn chu trình cho các màn hình đã lên kế hoạch.'),
  q('What are the weights of Iteration 1, 2, 3 and the Final Presentation?|||Trọng số của Iteration 1, 2, 3 và Final Presentation là bao nhiêu?', ['25 / 25 / 25 / 25|||25 / 25 / 25 / 25', '15 / 20 / 25 / 40|||15 / 20 / 25 / 40', '10 / 20 / 30 / 40|||10 / 20 / 30 / 40', '20 / 20 / 20 / 40|||20 / 20 / 20 / 40'], 1, 'Subject Guides p.4.|||Subject Guides trang 4.'),
  q('Iteration grades are 3, 4 and 6 and the Final Presentation is 9. Does the student pass?|||Điểm iteration là 3, 4 và 6, Final Presentation là 9. Sinh viên có qua môn không?', ['Yes, the weighted total is 6.35|||Có, tổng có trọng số là 6.35', 'No, OG = (3x15% + 4x20% + 6x25%) / 60% = 4.58, below 5|||Không, OG = (3x15% + 4x20% + 6x25%) / 60% = 4.58, dưới 5', 'Yes, because the presentation is above 5|||Có, vì thuyết trình trên 5', 'Only if attendance is 100%|||Chỉ khi chuyên cần 100%'], 1, 'OG of at least 5 and Final Presentation of at least 5 are separate gates.|||OG tối thiểu 5 và Final Presentation tối thiểu 5 là hai cổng riêng.'),
  q('What is the minimum attendance to pass?|||Chuyên cần tối thiểu để qua môn là bao nhiêu?', ['50%|||50%', '70%|||70%', '80%|||80%', '100%|||100%'], 2, 'Present at 80% or more of the training slots.|||Có mặt từ 80% số slot trở lên.'),
  q('Who evaluates the Final Presentation?|||Ai chấm Final Presentation?', ['The class teacher alone|||Chỉ giảng viên lớp', 'Two teachers other than the class teacher|||Hai giảng viên không phải giảng viên lớp', 'The other teams|||Các nhóm khác', 'An automatic grader|||Máy chấm tự động'], 1, 'Subject Guides p.4 and p.7.|||Subject Guides trang 4 và 7.'),
  q('A screen has 16 fields and 8 transactions and is judged Medium quality. What is its Converted-LOC?|||Một màn hình có 16 field và 8 transaction, chất lượng Medium. Converted-LOC là bao nhiêu?', ['120|||120', '180|||180', '240|||240', '90|||90'], 1, 'Complex (at least 15 fields and 7 transactions) = 240; Medium quality = 75%; 240 x 75% = 180.|||Complex (từ 15 field và 7 transaction trở lên) = 240; chất lượng Medium = 75%; 240 x 75% = 180.'),
  q('The two guide decks give different MaxLOC values (180/240/660 vs 240/240/720). What should you do?|||Hai bộ guide ghi MaxLOC khác nhau (180/240/660 và 240/240/720). Nên làm gì?', ['Use the smaller one|||Dùng số nhỏ hơn', 'Use the larger one|||Dùng số lớn hơn', 'Follow the version your teacher publishes on EduNext/CMS|||Theo phiên bản giảng viên đăng trên EduNext/CMS', 'Average them|||Lấy trung bình'], 2, 'Subject Guides and Student Guides differ; the current guide of your class decides.|||Subject Guides và Student Guides khác nhau; guide hiện hành của lớp bạn quyết định.'),
  // 9–12 package & tracking
  q('Which item is NOT part of an iteration submission?|||Mục nào KHÔNG thuộc bộ nộp của một iteration?', ['Project Tracking document|||Tài liệu Project Tracking', 'RDS document|||Tài liệu RDS', 'Links to demo videos and the tagged source code|||Link video demo và source code đã gắn tag', 'A written exam paper|||Một bài thi viết'], 3, 'Submit items are Project Tracking, RDS and links (videos, GitLab tag with DB scripts).|||Bộ nộp gồm Project Tracking, RDS và các link (video, tag GitLab kèm DB script).'),
  q('What does RDS stand for?|||RDS là viết tắt của gì?', ['Relational Database Schema|||Relational Database Schema', 'Requirement and Design Specification|||Requirement and Design Specification', 'Release Deployment Script|||Release Deployment Script', 'Report of Daily Status|||Report of Daily Status'], 1, 'The RDS holds the requirement and design specs of each iteration plus updates to earlier ones.|||RDS chứa đặc tả yêu cầu và thiết kế của mỗi iteration cùng phần cập nhật cho iteration trước.'),
  q('A bug found by the teacher after the iteration was submitted gets which GitLab label?|||Lỗi do giảng viên phát hiện sau khi nộp iteration được gắn label GitLab nào?', ['Defect|||Defect', 'Leakage|||Leakage', 'Q&A|||Q&A', 'Task|||Task'], 1, 'Defect = found by the team; Leakage = found by the teacher/customer after submission.|||Defect = nhóm tự tìm; Leakage = giảng viên/khách hàng tìm sau khi nộp.'),
  q('What does the Req label represent?|||Label Req đại diện cho gì?', ['Any question to the teacher|||Mọi câu hỏi cho giảng viên', 'One screen or function that one person can own completely|||Một màn hình hoặc chức năng mà một người phụ trách trọn vẹn', 'A meeting|||Một cuộc họp', 'A defect in documents|||Một lỗi trong tài liệu'], 1, 'Subject Guides p.9 notes: a Req is one screen/function assignable to a single owner.|||Ghi chú Subject Guides trang 9: Req là một màn hình/chức năng giao được cho một người.'),
  // 13–16 requirements
  q('Which is a NON-functional requirement?|||Đâu là yêu cầu KHÔNG chức năng?', ['A recruiter can post a job|||Recruiter đăng được job', 'A candidate can upload a CV|||Ứng viên upload được CV', 'The job list page loads in under 2 seconds for 100 users|||Trang danh sách job tải dưới 2 giây với 100 người dùng', 'Admin can block an account|||Admin khoá được tài khoản'], 2, 'A non-functional requirement is a quality attribute or quality-of-service goal (Software Requirement deck).|||Yêu cầu không chức năng là thuộc tính chất lượng hay mục tiêu chất lượng dịch vụ (slide Software Requirement).'),
  q('In use-case modelling, an actor is…|||Trong mô hình use case, actor là…', ['a specific person, e.g. one team member|||một người cụ thể, ví dụ một thành viên nhóm', 'a role played by all users of the same type, or an external system, device or timer|||vai trò của mọi người dùng cùng loại, hoặc hệ thống ngoài, thiết bị hay bộ định thời', 'a database table|||một bảng CSDL', 'a screen|||một màn hình'], 1, 'Actors are outside the system; a user is an individual, an actor is a role.|||Actor nằm ngoài hệ thống; user là một cá nhân, actor là một vai trò.'),
  q('Which actor starts a use case?|||Actor nào khởi đầu một use case?', ['The secondary actor|||Actor phụ', 'The primary actor|||Actor chính', 'The database|||CSDL', 'The teacher|||Giảng viên'], 1, 'A primary actor initiates the use case; secondary actors may participate.|||Actor chính khởi đầu use case; actor phụ có thể tham gia.'),
  q('A team lists "Click Save", "Validate e-mail field" and "Show toast" as three separate use cases. What is wrong?|||Một nhóm liệt kê "Bấm Lưu", "Validate ô e-mail" và "Hiện toast" thành ba use case riêng. Sai ở đâu?', ['Nothing|||Không sai gì', 'Functional decomposition: a UC should be a sequence giving a useful result to the actor|||Phân rã chức năng: một UC phải là một chuỗi tương tác mang lại kết quả hữu ích cho actor', 'UCs must be written in Vietnamese|||UC phải viết tiếng Việt', 'There must be at least 50 UCs|||Phải có ít nhất 50 UC'], 1, 'The Software Requirement deck warns against small UCs describing individual functions.|||Slide Software Requirement cảnh báo việc tách UC nhỏ mô tả từng chức năng lẻ.'),
  // 17–20 design & DB
  q('The System and Database Design decks follow which method?|||Slide System Design và Database Design đi theo phương pháp nào?', ['Waterfall only|||Chỉ Waterfall', 'COMET/UML (Gomaa)|||COMET/UML (Gomaa)', 'Kanban|||Kanban', 'No method|||Không theo phương pháp nào'], 1, 'Use case, static, dynamic modelling, then entity classes mapped to relational tables.|||Mô hình use case, tĩnh, động, rồi ánh xạ entity class thành bảng quan hệ.'),
  q('How is a one-to-many association (Customer 1 - n Account) mapped to tables?|||Quan hệ một-nhiều (Customer 1 - n Account) được ánh xạ thành bảng thế nào?', ['FK in Customer pointing to Account|||FK trong Customer trỏ tới Account', 'Primary key of Customer as a foreign key in Account|||Khoá chính của Customer làm khoá ngoại trong Account', 'A separate junction table always|||Luôn tạo bảng trung gian', 'Merge both into one table|||Gộp hai bảng làm một'], 1, 'The FK goes into the "many" relation (Database Design deck).|||FK đặt ở quan hệ phía "nhiều" (slide Database Design).'),
  q('How is a many-to-many association (Candidate n - n Job) implemented?|||Quan hệ nhiều-nhiều (Candidate n - n Job) được hiện thực thế nào?', ['A FK in either table|||Một FK ở bảng nào cũng được', 'An association table holding both foreign keys (e.g. Application)|||Một bảng liên kết chứa cả hai khoá ngoại (vd Application)', 'A comma-separated list column|||Một cột chứa danh sách phân tách bằng dấu phẩy', 'It cannot be stored|||Không lưu được'], 1, 'An association class/table models the n-n link and can carry its own attributes (status, applied date).|||Association class/bảng mô tả liên kết n-n và có thể có thuộc tính riêng (trạng thái, ngày nộp).'),
  q('In a JSP/Servlet MVC web app, where should SQL queries live?|||Trong web app MVC JSP/Servlet, câu SQL nên nằm ở đâu?', ['In the JSP|||Trong JSP', 'In the DAO / data-access layer, called by the controller|||Trong tầng DAO / truy cập dữ liệu, được controller gọi', 'In the CSS|||Trong CSS', 'In web.xml|||Trong web.xml'], 1, 'MVC and layered architecture separate view, control and data access so layers can change independently.|||MVC và kiến trúc phân tầng tách view, điều khiển và truy cập dữ liệu để các tầng thay đổi độc lập.'),
  // 21–23 Git & GitLab
  q('Your push fails because a teammate pushed changes to the same file. What is the guide\'s sequence?|||Push của bạn thất bại vì đồng đội đã push thay đổi cùng file. Guide hướng dẫn trình tự nào?', ['git push --force|||git push --force', 'git pull origin main, fix the conflicts by hand, git add, git commit, git push|||git pull origin main, sửa xung đột bằng tay, git add, git commit, git push', 'Delete the repo and clone again|||Xoá repo và clone lại', 'Send the file by Slack|||Gửi file qua Slack'], 1, 'Student Guides p.10-11: resolve merge conflicts manually after pulling.|||Student Guides trang 10-11: xử lý xung đột bằng tay sau khi pull.'),
  q('With the protected-branch setting from the GitLab guide, who can merge into main?|||Với thiết lập protected branch trong guide GitLab, ai được merge vào main?', ['Every developer|||Mọi developer', 'Only Maintainers|||Chỉ Maintainer', 'Nobody|||Không ai', 'Only the teacher|||Chỉ giảng viên'], 1, 'Developers and Maintainers may push; only Maintainers may merge.|||Developer và Maintainer được push; chỉ Maintainer được merge.'),
  q('What is a Git tag used for in SWP391?|||Git tag dùng để làm gì trong SWP391?', ['A branch that keeps changing|||Một nhánh liên tục thay đổi', 'Marking a fixed release point, e.g. the source of an iteration|||Đánh dấu một điểm phát hành cố định, vd source của một iteration', 'Deleting old commits|||Xoá commit cũ', 'Assigning issues|||Giao issue'], 1, 'A tag is like a branch that does not change; you submit the tag URL of each iteration.|||Tag giống một nhánh không thay đổi; bạn nộp URL tag của mỗi iteration.'),
  // 24–25 testing & AI
  q('Where should the expected result of a system test case come from?|||Kết quả mong đợi của một system test case nên lấy từ đâu?', ['From what the code currently does|||Từ hành vi hiện tại của code', 'From the specification: UC, UI spec, business rules|||Từ đặc tả: UC, UI spec, quy tắc nghiệp vụ', 'From the AI|||Từ AI', 'From the previous team|||Từ nhóm trước'], 1, 'Tests derived from code only confirm current behaviour, bugs included.|||Test suy từ code chỉ xác nhận hành vi hiện có, kể cả bug.'),
  q('In the AI Usage Report, each evidence file must be named… and show…|||Trong AI Usage Report, mỗi file bằng chứng phải đặt tên… và thể hiện…', ['anything; only the answer|||tên gì cũng được; chỉ câu trả lời', 'GroupX_SessionY_Activity; the prompt, the AI response and the student follow-up|||GroupX_SessionY_Activity; prompt, câu trả lời của AI và phần xử lý tiếp của sinh viên', 'StudentID; the final code|||MãSV; code cuối cùng', 'Date_Time; the teacher approval|||Ngày_Giờ; sự đồng ý của giảng viên'], 1, 'Template5, Instruction sheet.|||Template5, sheet Instruction.'),
  // 26–28 presentation
  q('Which criterion has the largest weight in the Final Presentation?|||Tiêu chí nào có trọng số lớn nhất trong Final Presentation?', ['Team working 20%|||Làm việc nhóm 20%', 'Software product / implementation 40%|||Sản phẩm / hiện thực 40%', 'Requirement analysis 20%|||Phân tích yêu cầu 20%', 'Design 20%|||Thiết kế 20%'], 1, 'Product 40%, the other three 20% each.|||Sản phẩm 40%, ba tiêu chí còn lại mỗi cái 20%.'),
  q('According to the presentation template, how should the Demonstration slide present each main workflow?|||Theo template thuyết trình, slide Demonstration nên trình bày mỗi luồng chính thế nào?', ['As a code listing|||Dưới dạng code', 'As a swimlane diagram including screens and actors/roles|||Dưới dạng swimlane gồm màn hình và actor/role', 'As a Gantt chart|||Dưới dạng biểu đồ Gantt', 'As a video only|||Chỉ bằng video'], 1, 'Template7 / Slide6 p.8: each workflow is a swimlane diagram with screens and actors.|||Template7 / Slide6 trang 8: mỗi luồng là một swimlane có màn hình và actor.'),
  q('The use-case diagram slide of the final presentation should show…|||Slide use-case diagram của buổi thuyết trình cuối kỳ nên thể hiện…', ['every UC ever proposed|||mọi UC từng đề xuất', 'the UCs you completed, preferably one diagram per actor|||các UC đã hoàn thành, nên mỗi actor một sơ đồ', 'only the admin UCs|||chỉ UC của admin', 'no UCs, only screens|||không UC, chỉ màn hình'], 1, 'Template7 p.3: provide diagrams for the use cases you have completed.|||Template7 trang 3: đưa sơ đồ cho các use case đã hoàn thành.'),
];

const LFE = {
  title: 'FE — Whole-course self-check (SWP391 has no written final exam)|||FE — Tự kiểm tra toàn môn (SWP391 không có thi viết cuối kỳ)',
  slug: 'swp391-final-exam-fe',
  type: 'article',
  description: 'SWP391 không có FE. Trang này là bài tự kiểm tra 28 câu phủ toàn môn: guide và cách chấm, bộ nộp và label GitLab, yêu cầu, thiết kế, CSDL, Git, kiểm thử, AI và thuyết trình cuối kỳ.',
  content: FE_CONTENT,
  quiz: { timeLimitSeconds: 2400, questions: FE_QUESTIONS },
};

export default {
  title: 'Final Exam|||Thi cuối kỳ',
  description: 'SWP391 không có bài thi PE/FE: điểm là 3 iteration (60%) + Final Presentation (40%). Hai trang giải thích thật cách chấm, cách chuẩn bị thuyết trình, và bài tự kiểm tra toàn môn.',
  lessons: [LPE, LFE],
};
