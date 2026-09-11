/**
 * SWP391 · Chapter 5 — Testing & quality.
 * Sources: Template3_System Test.xlsx (2026 templates — formulas read from the xlsx XML),
 * the Project Tracking template (Product / Refs / Policies sheets), SWP391 Student Guides
 * slide 13 (GitLab labels), Claude_Prompts.txt prompt #9, and three clean pages of the
 * sample Capstone final report (PDF pages 133, 136, 141 — pages 137/138 show team members'
 * names in screenshots and are deliberately NOT used).
 *   5.1 Testing in SWP391: levels, quality level Q, Defect vs Leakage   (g-student 13, cap 133, 136, 141)
 *   5.2 Template3 System Test, column by column + worked example "Apply Job"
 *   5.3 Unit tests with JUnit 5 for a DAO and a service
 *   5.4 AI-generated test cases — the teacher's Claude prompt #9
 *   Quiz 5
 * Testing theory (ISTQB) is taught in the SWT301 course on this site — linked, not repeated.
 */
import { walk, walkHead, slide, bi, books, ansEn, ansVi } from './_slides.mjs';

const SWT = '/courses/software-testing/learn';

/* ─────────────────────── 5.1 Testing in SWP391 ─────────────────────── */
const L51 = {
  title: '5.1 — Testing in SWP391: levels, quality level Q, Defect vs Leakage|||5.1 — Kiểm thử trong SWP391: các mức test, mức chất lượng Q, Defect vs Leakage',
  slug: 'swp391-5-1-testing-bug-tracking',
  type: 'VIDEO',
  description: 'Vì sao test quyết định điểm LOC (hệ số Q), 4 mức test áp vào đồ án, cách ghi lỗi bằng nhãn Defect / Leakage trên GitLab — kèm trang báo cáo capstone thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Testing in SWP391 — why it decides your LOC grade</h2>
<p class="lead">SWP391 has <strong>no separate "testing milestone"</strong>. In every one of the 3 iterations each member builds 3–4 screens end-to-end, and the teacher grades each screen as <strong>Converted-LOC = C × Q</strong>. C is the size of the screen; <strong>Q is its quality</strong> — and Q is exactly what testing proves.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>explain how testing raises Q from 50% to 75% or 100%;</li>
<li>place unit, integration, system and acceptance tests in a 6-slot iteration;</li>
<li>log a bug on GitLab with the right label — <strong>Defect</strong> (your team found it) or <strong>Leakage</strong> (the teacher found it after you submitted);</li>
<li>list the checks the teacher runs on every screen before giving "High quality".</li>
</ul></div>
<h3>Where testing hides in the grading</h3>
<table>
<thead><tr><th>Source</th><th>What it says</th><th>What it means for testing</th></tr></thead>
<tbody>
<tr><td>Student Guides slide 7</td><td>Q: High 100% · Medium 75% · Low 50% (completeness, correctness, good UI/UX)</td><td>An untested screen with one crash in the demo drops to Low</td></tr>
<tr><td>Project Tracking template, sheet Refs</td><td>L1_Happy Cases 0.5 · L2_All Cases 0.75 · L3_Optimized 1.0</td><td>"All cases" = the unhappy cases were tested and handled</td></tr>
<tr><td>Tracking template, sheet Product</td><td>columns <code>Bug</code> and <code>Progress › Test</code> for every screen</td><td>The teacher sees test progress per screen, per member</td></tr>
<tr><td>Tracking template, sheet Policies</td><td>validate Required (blank, spaces), Length (longer than the DB column), Format (date, email, phone, image type); every table has search, filter, sort, paging</td><td>These are the first test cases the teacher tries on your screen</td></tr>
</tbody>
</table>
<p class="ghi-chu">The 2026 template set adds <strong>Template3 System Test</strong> (lesson 5.2). Ask your teacher whether it is part of your iteration package; even when it is not required, it is the fastest way to reach L2.</p>`,
    `<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Kiểm thử trong SWP391 — vì sao nó quyết định điểm LOC</h2>
<p class="lead">SWP391 <strong>không có "milestone kiểm thử" riêng</strong>. Ở cả 3 iteration, mỗi thành viên làm trọn 3–4 màn hình, và giáo viên chấm mỗi màn hình theo <strong>Converted-LOC = C × Q</strong>. C là độ lớn của màn hình; <strong>Q là chất lượng</strong> — và Q chính là thứ việc test chứng minh.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>giải thích được test đẩy Q từ 50% lên 75% hay 100% như thế nào;</li>
<li>đặt unit, integration, system và acceptance test vào một iteration 6 slot;</li>
<li>ghi bug lên GitLab đúng nhãn — <strong>Defect</strong> (nhóm tự phát hiện) hay <strong>Leakage</strong> (giáo viên phát hiện sau khi nộp);</li>
<li>liệt kê các phép kiểm giáo viên chạy trên mọi màn hình trước khi cho "High quality".</li>
</ul></div>
<h3>Kiểm thử nằm ở đâu trong cách chấm</h3>
<table>
<thead><tr><th>Nguồn</th><th>Nội dung</th><th>Ý nghĩa với việc test</th></tr></thead>
<tbody>
<tr><td>Student Guides slide 7</td><td>Q: High 100% · Medium 75% · Low 50% (đủ, đúng, UI/UX tốt)</td><td>Màn hình không test, demo văng lỗi một lần là rơi xuống Low</td></tr>
<tr><td>Template Project Tracking, sheet Refs</td><td>L1_Happy Cases 0.5 · L2_All Cases 0.75 · L3_Optimized 1.0</td><td>"All cases" = các case không-suôn-sẻ đã được test và xử lý</td></tr>
<tr><td>Template Tracking, sheet Product</td><td>cột <code>Bug</code> và <code>Progress › Test</code> cho từng màn hình</td><td>Giáo viên thấy tiến độ test của từng màn hình, từng người</td></tr>
<tr><td>Template Tracking, sheet Policies</td><td>validate Required (bỏ trống, toàn dấu cách), Length (dài hơn cột DB), Format (ngày, email, SĐT, loại ảnh); mọi bảng phải có search, filter, sort, paging</td><td>Đây là những test case đầu tiên giáo viên thử trên màn hình của bạn</td></tr>
</tbody>
</table>
<p class="ghi-chu">Bộ template 2026 có thêm <strong>Template3 System Test</strong> (bài 5.2). Hỏi giáo viên xem nó có nằm trong gói nộp iteration của lớp bạn không; kể cả khi không bắt buộc, đó vẫn là đường nhanh nhất để đạt L2.</p>`),
    bi(`<h3>The four test levels, mapped onto one iteration</h3>
<p>The theory (test levels, black-box techniques, defect life cycle) is the ISTQB syllabus taught in <a href="${SWT}" target="_blank" rel="noopener">SWT301 — Software Testing</a> on this site: see its Chapter 2 (test levels), Chapter 4 (equivalence partitioning, boundary values, decision tables, use-case testing) and Chapter 7 (defect management). Here we only apply it to a 4–5 person SWP391 team.</p>
<table>
<thead><tr><th>Level</th><th>Who, in SWP391</th><th>When in the iteration</th><th>Evidence you keep</th></tr></thead>
<tbody>
<tr><td><strong>Unit</strong></td><td>the screen owner</td><td>while coding the DAO / service (slots 3–5)</td><td>JUnit classes in <code>test/</code> of the repo (lesson 5.3)</td></tr>
<tr><td><strong>Integration (by screen)</strong></td><td>the owner, then a teammate</td><td>as soon as the screen runs on the merged <code>main</code></td><td>rows in Template3, one sheet per workflow (lesson 5.2)</td></tr>
<tr><td><strong>System / E2E</strong></td><td>a teammate who did NOT code it</td><td>slot 5–6, on the integrated build that will be tagged</td><td>Template3 Round 1–3 results + Test Statistics</td></tr>
<tr><td><strong>Acceptance</strong></td><td>the teacher (your customer / PO)</td><td>the iteration review, after you submit</td><td>his findings become <strong>Leakage</strong> issues</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>"Tested on my branch" is not tested.</strong> The Policies sheet requires the source to be merged into <code>main</code> daily and the demo to run from ONE integrated source. A screen that passes alone and breaks after merging (a shared header, a renamed column) is a failure in the demo.</div>`,
    `<h3>Bốn mức test, đặt lên một iteration</h3>
<p>Phần lý thuyết (các mức test, kỹ thuật hộp đen, vòng đời defect) là syllabus ISTQB đã dạy trong <a href="${SWT}" target="_blank" rel="noopener">SWT301 — Software Testing</a> trên trang này: xem Chương 2 (các mức test), Chương 4 (phân vùng tương đương, giá trị biên, bảng quyết định, test theo use case) và Chương 7 (quản lý defect). Ở đây chỉ áp nó vào một nhóm SWP391 4–5 người.</p>
<table>
<thead><tr><th>Mức</th><th>Ai làm, trong SWP391</th><th>Khi nào trong iteration</th><th>Bằng chứng giữ lại</th></tr></thead>
<tbody>
<tr><td><strong>Unit</strong></td><td>người sở hữu màn hình</td><td>trong lúc code DAO / service (slot 3–5)</td><td>các lớp JUnit trong <code>test/</code> của repo (bài 5.3)</td></tr>
<tr><td><strong>Integration (theo màn hình)</strong></td><td>người sở hữu, rồi một bạn cùng nhóm</td><td>ngay khi màn hình chạy được trên <code>main</code> đã merge</td><td>các dòng trong Template3, mỗi workflow một sheet (bài 5.2)</td></tr>
<tr><td><strong>System / E2E</strong></td><td>một bạn KHÔNG code màn hình đó</td><td>slot 5–6, trên bản tích hợp sẽ gắn tag</td><td>kết quả Round 1–3 trong Template3 + Test Statistics</td></tr>
<tr><td><strong>Acceptance</strong></td><td>giáo viên (khách hàng / PO của bạn)</td><td>buổi review iteration, sau khi nộp</td><td>lỗi thầy/cô tìm ra thành issue <strong>Leakage</strong></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>"Test trên nhánh của em rồi" chưa phải là đã test.</strong> Sheet Policies bắt buộc merge source vào <code>main</code> hằng ngày và demo chạy trên MỘT bản source tích hợp. Màn hình chạy riêng thì được mà merge vào thì vỡ (header dùng chung, cột bị đổi tên) vẫn là lỗi trong buổi demo.</div>`),
    walkHead('g-student', 13, 13, 'Only slide 13 belongs here: the labels that turn a bug into a tracked issue.', 'Chỉ slide 13 thuộc bài này: bộ nhãn biến một con bug thành một issue được theo dõi.'),
    walk('g-student', [
      [13, 'Tracking & Monitoring — track issue type/status with labels',
        `<p class="y-chinh">🎯 Eight group labels: three are <em>statuses</em>, five are <em>issue types</em> — and two of the types are for bugs.</p>
<p class="nhan">Status labels (the Board columns)</p>
<ol>
<li><strong>1_To Do</strong> — work or a problem waiting to be handled.</li>
<li><strong>2_Doing</strong> — being handled now.</li>
<li><strong>3_Done</strong> — handled, <em>needs checking before it is Closed</em>. For a bug, "checking" = someone re-runs the failed test case.</li>
</ol>
<p class="nhan">Type labels</p>
<ul>
<li><strong>Defect</strong> — an error in documents or source code <em>found by the team itself</em>.</li>
<li><strong>Leakage</strong> — an error <em>found by the customer / teacher</em> through review or testing <em>after you submitted</em>. It "leaked" past your tests.</li>
<li><strong>Q&amp;A</strong> — a question that needs clarifying or confirming (ask the teacher, keep the answer).</li>
<li><strong>Req</strong> — one screen or function that one person owns completely.</li>
<li><strong>Task</strong> — an activity given to exactly one member (usually self-created).</li>
</ul>
<p class="nhan">In your project</p>
<p>A failed row in Template3 becomes an issue <em>Defect + 1_To Do</em>, linked to its Req issue and assigned to the screen owner. After the fix it goes to <em>3_Done</em>; the tester re-runs the case in the next round and closes it.</p>
<p class="meo">🧠 <strong>Remember:</strong> Defect = <em>we</em> caught it (good); Leakage = <em>they</em> caught it (a hole in our testing). A team with many Defects and few Leakages is testing well.</p>
<div class="pitfall">Do not relabel a Leakage as Defect to look better — the teacher created or saw it after the submit date, and the issue history shows who added which label.</div>`,
        `<p class="y-chinh">🎯 Tám nhãn của group: ba nhãn là <em>trạng thái</em>, năm nhãn là <em>loại issue</em> — và hai trong số đó dành cho bug.</p>
<p class="nhan">Nhãn trạng thái (các cột của Board)</p>
<ol>
<li><strong>1_To Do</strong> — công việc hoặc vấn đề cần giải quyết.</li>
<li><strong>2_Doing</strong> — đang được giải quyết.</li>
<li><strong>3_Done</strong> — đã giải quyết, <em>cần kiểm tra lại rồi mới Closed</em>. Với bug, "kiểm tra lại" = có người chạy lại test case đã fail.</li>
</ol>
<p class="nhan">Nhãn loại issue</p>
<ul>
<li><strong>Defect</strong> — lỗi tài liệu hoặc source code <em>do chính đội dự án phát hiện</em>.</li>
<li><strong>Leakage</strong> — lỗi <em>do khách hàng / giáo viên phát hiện</em> qua review, test <em>sau khi đã submit</em>. Nó đã "lọt" qua lưới test của bạn.</li>
<li><strong>Q&amp;A</strong> — câu hỏi cần làm rõ hoặc xác nhận (hỏi giáo viên, lưu lại câu trả lời).</li>
<li><strong>Req</strong> — một màn hình hay một chức năng giao trọn cho một người.</li>
<li><strong>Task</strong> — việc giao cho đúng một thành viên (thường tự tạo cho mình).</li>
</ul>
<p class="nhan">Trong đồ án của bạn</p>
<p>Một dòng fail trong Template3 thành một issue <em>Defect + 1_To Do</em>, liên kết tới issue Req của nó và giao cho người làm màn hình. Sửa xong chuyển <em>3_Done</em>; tester chạy lại case ở round sau rồi mới đóng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Defect = <em>mình</em> bắt được (tốt); Leakage = <em>người ta</em> bắt được (lưới test của mình thủng). Nhóm có nhiều Defect mà ít Leakage là nhóm test tốt.</p>
<div class="pitfall">Đừng đổi nhãn Leakage thành Defect cho đẹp — giáo viên tạo hoặc thấy lỗi đó sau ngày nộp, và lịch sử issue ghi rõ ai gắn nhãn nào.</div>`],
    ]),
    walkHead('cap', 133, 141, 'Three pages of the test chapter of a real 2023 capstone report (PDF pages 133, 136, 141). It is bigger than an SWP391 project, but its test documents have the same shape as Template3 — use it to see what "finished" looks like.', 'Ba trang trong chương kiểm thử của một báo cáo capstone thật năm 2023 (trang PDF 133, 136, 141). Đồ án đó lớn hơn SWP391, nhưng tài liệu test có cùng hình dạng với Template3 — xem để biết "làm xong" trông ra sao.'),
    walk('cap', [
      [133, 'Test plan — non-functional targets and the 4 testing levels',
        `<p class="y-chinh">🎯 One table fixes, for each test level, who runs it, when it starts and when it is "done".</p>
<p class="nhan">Read the table row by row</p>
<ul>
<li><strong>Unit Test</strong> — developers, while implementing; done when every branch runs without unexpected exceptions.</li>
<li><strong>Integration Test</strong> — testers, after unit tests pass; checks data flows correctly controller → service → repository → database.</li>
<li><strong>System Test</strong> — testers, after integration; all logic flows work as designed, non-functional requirements hold.</li>
<li><strong>Acceptance Test</strong> — end users, after the full system test; the system meets business needs with real data.</li>
</ul>
<p class="nhan">For your SWP391 team</p>
<p>Copy the idea, not the size: one short "Test levels" table in your RDS or in the Template3 Cover. "100% branch coverage" is a capstone target — for SWP391, cover every business rule of your own screens instead.</p>
<p class="ghi-chu">The top of the page lists performance (JMeter) and security targets — the same families as the non-functional requirements in your SRS.</p>`,
        `<p class="y-chinh">🎯 Một bảng chốt, cho từng mức test: ai chạy, khi nào bắt đầu, khi nào coi là "xong".</p>
<p class="nhan">Đọc bảng theo từng dòng</p>
<ul>
<li><strong>Unit Test</strong> — developer, trong lúc code; xong khi mọi nhánh chạy mà không có exception bất ngờ.</li>
<li><strong>Integration Test</strong> — tester, sau khi unit test qua; kiểm dữ liệu đi đúng controller → service → repository → database.</li>
<li><strong>System Test</strong> — tester, sau integration; mọi luồng logic chạy đúng thiết kế, yêu cầu phi chức năng đạt.</li>
<li><strong>Acceptance Test</strong> — người dùng cuối, sau system test; hệ thống đáp ứng nhu cầu nghiệp vụ với dữ liệu thật.</li>
</ul>
<p class="nhan">Với nhóm SWP391 của bạn</p>
<p>Chép ý tưởng, đừng chép độ lớn: một bảng "Test levels" ngắn trong RDS hoặc ở sheet Cover của Template3. "Phủ 100% nhánh" là mục tiêu của capstone — với SWP391, hãy phủ mọi business rule của các màn hình mình làm.</p>
<p class="ghi-chu">Phần đầu trang liệt kê mục tiêu hiệu năng (JMeter) và bảo mật — cùng họ với các yêu cầu phi chức năng trong SRS của bạn.</p>`],
      [136, 'Test environment, test milestones, why unit tests',
        `<p class="y-chinh">🎯 Before writing a single test case, say where tests run and when each level happens.</p>
<p class="nhan">Test environment (3.2)</p>
<ul>
<li><strong>Browser</strong> — the front end is tested on Chrome.</li>
<li><strong>MySQL Workbench 8.0</strong> — to watch each database transaction and slow queries.</li>
<li><strong>JUnit + Mockito</strong> — for back-end unit tests.</li>
</ul>
<p class="nhan">Test milestones (3.3)</p>
<p>Seven dated tasks: test plan → unit → integration → system → acceptance, plus a bug log and a final summary report. Levels overlap in time — that is normal in an iterative project.</p>
<p class="nhan">For your project</p>
<p>This is exactly what the <strong>Test Environment Setup Description</strong> cell of Template3 (sheet Test Cases) asks for: server (Tomcat version), database (MySQL 8.0.x), browser. Lesson 5.2 fills it in.</p>`,
        `<p class="y-chinh">🎯 Trước khi viết test case nào, phải nói test chạy ở đâu và từng mức diễn ra khi nào.</p>
<p class="nhan">Môi trường test (3.2)</p>
<ul>
<li><strong>Trình duyệt</strong> — front end được test trên Chrome.</li>
<li><strong>MySQL Workbench 8.0</strong> — để theo dõi từng giao dịch database và các câu truy vấn chậm.</li>
<li><strong>JUnit + Mockito</strong> — cho unit test phía back end.</li>
</ul>
<p class="nhan">Mốc kiểm thử (3.3)</p>
<p>Bảy việc có ngày: test plan → unit → integration → system → acceptance, cộng bug log và báo cáo tổng kết. Các mức chồng lên nhau về thời gian — bình thường với dự án lặp.</p>
<p class="nhan">Với đồ án của bạn</p>
<p>Đây đúng là thứ ô <strong>Test Environment Setup Description</strong> của Template3 (sheet Test Cases) yêu cầu: server (phiên bản Tomcat), database (MySQL 8.0.x), trình duyệt. Bài 5.2 điền ô này.</p>`],
      [141, 'Acceptance test matrix — Accept / Reject per criterion',
        `<p class="y-chinh">🎯 Acceptance testing ends in a yes/no per criterion, signed off by the customer — with a comment for every Reject.</p>
<p class="nhan">How the matrix is built</p>
<ol>
<li><strong>Category</strong> — Functional requirement, Security, UI/UX &amp; Usability, Performance.</li>
<li><strong>ID + criterion</strong> — one sentence the customer can check (AT-03 "User can login account").</li>
<li><strong>Accept / Reject</strong> — one tick.</li>
<li><strong>Comment</strong> — mandatory for Reject. AT-25 was rejected because the sponsor never delivered the promised sample design.</li>
</ol>
<p class="nhan">For your project</p>
<p>In SWP391 the teacher plays this customer at each iteration review. Write your own mini-matrix (one line per Req screen) and run it yourselves the day before — every Reject you find is still a <strong>Defect</strong>, not a Leakage.</p>`,
        `<p class="y-chinh">🎯 Acceptance test kết thúc bằng một câu có/không cho từng tiêu chí, do khách hàng xác nhận — mỗi Reject phải có ghi chú.</p>
<p class="nhan">Ma trận được dựng thế nào</p>
<ol>
<li><strong>Category</strong> — Functional requirement, Security, UI/UX &amp; Usability, Performance.</li>
<li><strong>ID + tiêu chí</strong> — một câu khách hàng tự kiểm được (AT-03 "User can login account").</li>
<li><strong>Accept / Reject</strong> — một dấu tick.</li>
<li><strong>Comment</strong> — bắt buộc khi Reject. AT-25 bị từ chối vì nhà tài trợ không giao mẫu thiết kế như đã hứa.</li>
</ol>
<p class="nhan">Với đồ án của bạn</p>
<p>Trong SWP391 giáo viên đóng vai khách hàng này ở mỗi buổi review iteration. Tự viết một ma trận nhỏ (mỗi màn hình Req một dòng) và tự chạy trước một ngày — mọi Reject bạn tự tìm ra vẫn là <strong>Defect</strong>, chưa phải Leakage.</p>`],
    ]),
    bi(`<h3>A bug issue on GitLab — the fields that make it fixable</h3>
<pre>Title:    [Defect] Apply Job — CV upload accepts a 12 MB .exe file
Labels:   Defect · 1_To Do            Milestone: Iteration 2
Assignee: the owner of the "Apply job" Req      Linked: #34 (Req Apply job)
Found by: System test, TC AJ-06, Round 1

Steps:    1. Log in as a freelancer   2. Open a job post, click "Apply"
          3. Choose setup.exe (12 MB) as CV   4. Click "Submit"
Expected: message "CV must be PDF/DOC/DOCX, max 5 MB"; nothing saved
Actual:   application saved, file stored in /uploads
Severity: Major (security + data)</pre>
<p class="nhan">The life of that issue</p>
<ol>
<li><strong>1_To Do</strong> — created by the tester the moment AJ-06 fails.</li>
<li><strong>2_Doing</strong> — the owner reproduces it, adds a unit test that fails (lesson 5.3), then fixes the servlet.</li>
<li><strong>3_Done</strong> — commit message references the issue (<code>fix #41 validate CV type and size</code>).</li>
<li><strong>Closed</strong> — the tester re-runs AJ-06 in Round 2, writes "Passed" in Template3, closes the issue.</li>
</ol>
<p class="nhan">Same bug, found by the teacher</p>
<p>If this reaches the iteration review and the teacher uploads an .exe, the issue is labelled <strong>Leakage</strong>. The screen's Q drops (it is not "All cases") and the leakage is listed against the iteration.</p>
<div class="pitfall co-tieu-de"><strong>Mistakes that cost marks.</strong> Bugs reported only in Slack/Zalo (no trace, no owner) · issues without steps or expected result · the developer closing his own bug without a re-test · 3_Done issues left open for weeks, so the Board no longer tells the truth.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Defect Removal Efficiency.</strong> Industry measures DRE = Defects ÷ (Defects + Leakages). 18 Defects and 2 Leakages → 18 ÷ 20 = 90%. You can compute it from your GitLab labels in one filter; mentioning it in the final presentation shows you managed quality with numbers, not feelings.</div>`,
    `<h3>Một issue bug trên GitLab — những trường làm nó sửa được</h3>
<pre>Title:    [Defect] Apply Job — ô upload CV nhận file .exe 12 MB
Labels:   Defect · 1_To Do            Milestone: Iteration 2
Assignee: người sở hữu Req "Apply job"      Linked: #34 (Req Apply job)
Found by: System test, TC AJ-06, Round 1

Steps:    1. Đăng nhập bằng tài khoản freelancer   2. Mở một bài đăng, bấm "Apply"
          3. Chọn setup.exe (12 MB) làm CV   4. Bấm "Submit"
Expected: báo "CV phải là PDF/DOC/DOCX, tối đa 5 MB"; không lưu gì
Actual:   đơn ứng tuyển được lưu, file nằm trong /uploads
Severity: Major (bảo mật + dữ liệu)</pre>
<p class="nhan">Vòng đời của issue đó</p>
<ol>
<li><strong>1_To Do</strong> — tester tạo ngay khi AJ-06 fail.</li>
<li><strong>2_Doing</strong> — người làm màn hình tái hiện lỗi, thêm một unit test fail (bài 5.3), rồi sửa servlet.</li>
<li><strong>3_Done</strong> — commit message nhắc tới issue (<code>fix #41 validate CV type and size</code>).</li>
<li><strong>Closed</strong> — tester chạy lại AJ-06 ở Round 2, ghi "Passed" vào Template3, đóng issue.</li>
</ol>
<p class="nhan">Cùng con bug đó, nhưng giáo viên tìm ra</p>
<p>Nếu lỗi lọt tới buổi review iteration và giáo viên upload thử file .exe, issue mang nhãn <strong>Leakage</strong>. Q của màn hình bị hạ (không còn là "All cases") và leakage được tính cho iteration đó.</p>
<div class="pitfall co-tieu-de"><strong>Những lỗi làm mất điểm.</strong> Báo bug chỉ qua Slack/Zalo (không dấu vết, không người chịu trách nhiệm) · issue không có bước tái hiện hay kết quả mong đợi · developer tự đóng bug của mình mà không test lại · issue 3_Done để mở hàng tuần, khiến Board không còn phản ánh sự thật.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Defect Removal Efficiency.</strong> Trong ngành người ta đo DRE = Defect ÷ (Defect + Leakage). 18 Defect và 2 Leakage → 18 ÷ 20 = 90%. Bạn tính được con số này chỉ bằng một bộ lọc nhãn trên GitLab; nêu nó trong buổi thuyết trình cuối cho thấy nhóm quản lý chất lượng bằng số liệu, không bằng cảm giác.</div>`),
    books([
      ['sommerville', 'Ch. 8 "Software testing" (development, release and user testing)', 'Ch. 8 "Software testing" (test khi phát triển, test bản phát hành, test người dùng)'],
      ['wiegers', 'Ch. 17 "Validating the requirements" — writing tests from requirements', 'Ch. 17 "Validating the requirements" — viết test từ yêu cầu'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 5.2 Template3 System Test ─────────────────────── */
const L52 = {
  title: '5.2 — Template3 System Test, column by column, with a worked "Apply Job" test sheet|||5.2 — Template3 System Test từng cột, kèm ví dụ sheet test "Apply Job" hoàn chỉnh',
  slug: 'swp391-5-2-system-test-template3',
  type: 'VIDEO',
  description: 'Giải thích 5 sheet của Template3 (Cover, Test Cases, Test Statistics, Workflow) từng cột, 3 lỗi công thức có sẵn trong template và cách sửa, ví dụ 10 test case cho luồng "Freelancer ứng tuyển job" qua 3 round, cách tính test coverage.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.2 · Template3_System Test.xlsx</span>
<h2>Template3 System Test — the team's test record</h2>
<p class="lead">Template3 is an Excel workbook from the 2026 template set. It holds every system test case of the product, groups them by <strong>workflow</strong>, records up to <strong>3 test rounds</strong>, and computes two numbers the teacher reads first: <strong>test coverage</strong> and <strong>test successful coverage</strong>.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>fill all five sheets of Template3 without leaving a placeholder;</li>
<li>write a test case whose steps and expected result anyone can repeat;</li>
<li>find and fix the three formula traps shipped inside the template;</li>
<li>compute coverage by hand and check that Excel agrees.</li>
</ul></div>
<h3>The five sheets</h3>
<table>
<thead><tr><th>Sheet</th><th>Purpose</th><th>Filled by</th></tr></thead>
<tbody>
<tr><td><strong>Cover</strong></td><td>identity of the document + record of change</td><td>the leader, once per iteration</td></tr>
<tr><td><strong>Test Cases</strong></td><td>test environment + index of functions → which workflow sheet</td><td>the leader</td></tr>
<tr><td><strong>Test Statistics</strong></td><td>Passed / Failed / Pending / N/A per workflow, coverage %</td><td>formulas (do not type numbers)</td></tr>
<tr><td><strong>Workflow Name1, Name2…</strong></td><td>the test cases of one workflow, 3 rounds</td><td>the testers — copy the sheet for each workflow</td></tr>
</tbody>
</table>
<h3>Sheet Cover — field by field</h3>
<ul>
<li><strong>Project Name / Project Code</strong> — the same as on the RDS, e.g. <em>Job IT for Freelancer</em> / <em>SE18xx_G5</em>.</li>
<li><strong>Document Code</strong> — a formula: <code>Project Code_XXX_vx.x</code>. Replace XXX by <code>ST</code> and keep the version in step with the iteration: <code>SE18xx_G5_ST_v2.0</code> for Iteration 2.</li>
<li><strong>Creator / Issue Date / Version</strong> — who compiled it, when.</li>
<li><strong>Record of change</strong> — Effective Date · Version · Change Item · <strong>*A,D,M</strong> (Added, Deleted, Modified) · Change description · Reference (e.g. "RDS v2.0").</li>
</ul>
<h3>Sheet Test Cases — field by field</h3>
<ul>
<li><strong>Project Name / Project Code</strong> — the template ships <code>#REF!</code> here (broken link). Type <code>='Test Statistics'!C3</code> and <code>='Test Statistics'!C4</code>, or just type the text.</li>
<li><strong>Test Environment Setup Description</strong> — numbered list: 1. Server (Apache Tomcat 10.1, JDK 17) · 2. Database (MySQL 8.0.x, schema from the tagged DB script) · 3. Web browser (Chrome, latest) · 4. Mail (MailTrap sandbox) · 5. Test accounts (one per role, from the demo data).</li>
<li><strong>No · Function Name · Sheet Name · Description · Pre-Condition</strong> — one row per function/screen (the same names as the Tracking sheet Product), pointing to the workflow sheet that tests it.</li>
</ul>`,
    `<span class="eyebrow">Chương 5 · Bài 5.2 · Template3_System Test.xlsx</span>
<h2>Template3 System Test — sổ ghi test của cả nhóm</h2>
<p class="lead">Template3 là một file Excel trong bộ template 2026. Nó chứa mọi system test case của sản phẩm, gom theo <strong>workflow</strong>, ghi được tối đa <strong>3 round test</strong>, và tự tính hai con số giáo viên đọc đầu tiên: <strong>test coverage</strong> và <strong>test successful coverage</strong>.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>điền đủ năm sheet của Template3, không để sót placeholder nào;</li>
<li>viết test case có các bước và kết quả mong đợi mà ai cũng làm lại được;</li>
<li>tìm và sửa ba bẫy công thức có sẵn trong template;</li>
<li>tự tính coverage bằng tay và kiểm Excel có ra đúng không.</li>
</ul></div>
<h3>Năm sheet</h3>
<table>
<thead><tr><th>Sheet</th><th>Mục đích</th><th>Ai điền</th></tr></thead>
<tbody>
<tr><td><strong>Cover</strong></td><td>thông tin nhận diện tài liệu + lịch sử thay đổi</td><td>leader, mỗi iteration một lần</td></tr>
<tr><td><strong>Test Cases</strong></td><td>môi trường test + mục lục chức năng → sheet workflow nào</td><td>leader</td></tr>
<tr><td><strong>Test Statistics</strong></td><td>Passed / Failed / Pending / N/A theo workflow, % coverage</td><td>công thức (đừng gõ số tay)</td></tr>
<tr><td><strong>Workflow Name1, Name2…</strong></td><td>test case của một workflow, 3 round</td><td>tester — nhân bản sheet cho mỗi workflow</td></tr>
</tbody>
</table>
<h3>Sheet Cover — từng trường</h3>
<ul>
<li><strong>Project Name / Project Code</strong> — giống trên RDS, vd <em>Job IT for Freelancer</em> / <em>SE18xx_G5</em>.</li>
<li><strong>Document Code</strong> — là công thức: <code>Project Code_XXX_vx.x</code>. Thay XXX bằng <code>ST</code> và cho version đi theo iteration: <code>SE18xx_G5_ST_v2.0</code> cho Iteration 2.</li>
<li><strong>Creator / Issue Date / Version</strong> — ai tổng hợp, ngày nào.</li>
<li><strong>Record of change</strong> — Effective Date · Version · Change Item · <strong>*A,D,M</strong> (Added, Deleted, Modified) · Change description · Reference (vd "RDS v2.0").</li>
</ul>
<h3>Sheet Test Cases — từng trường</h3>
<ul>
<li><strong>Project Name / Project Code</strong> — template giao sẵn <code>#REF!</code> ở đây (liên kết hỏng). Gõ <code>='Test Statistics'!C3</code> và <code>='Test Statistics'!C4</code>, hoặc gõ thẳng chữ.</li>
<li><strong>Test Environment Setup Description</strong> — danh sách đánh số: 1. Server (Apache Tomcat 10.1, JDK 17) · 2. Database (MySQL 8.0.x, schema từ DB script đã gắn tag) · 3. Trình duyệt (Chrome bản mới) · 4. Mail (MailTrap sandbox) · 5. Tài khoản test (mỗi role một tài khoản, lấy từ dữ liệu demo).</li>
<li><strong>No · Function Name · Sheet Name · Description · Pre-Condition</strong> — mỗi chức năng/màn hình một dòng (cùng tên với sheet Product của file Tracking), trỏ tới sheet workflow test nó.</li>
</ul>`),
    bi(`<h3>A Workflow sheet — the header block (rows 2–8)</h3>
<ul>
<li><strong>Workflow</strong> (B2) — the business flow tested here, e.g. <em>Apply Job</em>. Also rename the sheet tab to it.</li>
<li><strong>Test requirement</strong> (B3) — one sentence: which requirements/UCs this sheet covers ("UC Apply job, BR-05, BR-11; screen Apply Job").</li>
<li><strong>Number of TCs</strong> (B4) — a formula, <code>COUNTA(A12:A1000)</code>: it counts every non-empty cell in column A from row 12.</li>
<li><strong>Testing Round</strong> table (rows 6–8) — Passed · Failed · Pending · N/A counted for Round 1, 2, 3 with <code>COUNTIF</code>.</li>
<li><strong>R2:R5</strong> — the list Passed / Failed / Pending / N/A that feeds the drop-downs of the round columns.</li>
</ul>
<h3>A Workflow sheet — the test case columns (row 10)</h3>
<table>
<thead><tr><th>Col</th><th>Column</th><th>What to write</th></tr></thead>
<tbody>
<tr><td>A</td><td>Test Case ID</td><td>unique, prefix per workflow: <code>AJ-01</code>. A row that holds only "Scenario A" is a group header.</td></tr>
<tr><td>B</td><td>Test Case Description</td><td>what is tested, one line: "Apply with a valid PDF CV".</td></tr>
<tr><td>C</td><td>Test Case Procedure</td><td>numbered steps with the exact data typed.</td></tr>
<tr><td>D</td><td>Expected Results</td><td>what the customer requires to see — messages word for word (MSG codes from the RDS), data saved or not.</td></tr>
<tr><td>E</td><td>Pre-conditions</td><td>account, role, data that must exist, or the ID of a case that must run first.</td></tr>
<tr><td>F · G · H</td><td>Round 1 · Test date · Tester</td><td>status from the drop-down, the date, who ran it.</td></tr>
<tr><td>I · J · K</td><td>Round 2 · Test date · Tester</td><td>the re-run after fixes.</td></tr>
<tr><td>L · M · N</td><td>Round 3 · Test date · Tester</td><td>the final regression before tagging.</td></tr>
<tr><td>O</td><td>Note</td><td>the GitLab issue of a failure (<code>#41</code>), or why a case is N/A.</td></tr>
</tbody>
</table>
<p class="nhan">The four statuses</p>
<ul>
<li><strong>Passed</strong> — actual = expected.</li>
<li><strong>Failed</strong> — any difference; open a <strong>Defect</strong> issue and write its number in Note.</li>
<li><strong>Pending</strong> — not run yet (the template's default in every round).</li>
<li><strong>N/A</strong> — cannot or need not run in this release (feature postponed by the teacher). It is removed from the coverage denominator.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a good test case passes the "stranger test" — a classmate from another team can run it from columns C–E alone and reach the same verdict.</p>`,
    `<h3>Một sheet Workflow — khối đầu (dòng 2–8)</h3>
<ul>
<li><strong>Workflow</strong> (B2) — luồng nghiệp vụ được test ở sheet này, vd <em>Apply Job</em>. Đổi luôn tên tab sheet cho khớp.</li>
<li><strong>Test requirement</strong> (B3) — một câu: sheet này phủ yêu cầu/UC nào ("UC Apply job, BR-05, BR-11; màn hình Apply Job").</li>
<li><strong>Number of TCs</strong> (B4) — công thức <code>COUNTA(A12:A1000)</code>: đếm mọi ô không trống ở cột A từ dòng 12.</li>
<li>Bảng <strong>Testing Round</strong> (dòng 6–8) — đếm Passed · Failed · Pending · N/A cho Round 1, 2, 3 bằng <code>COUNTIF</code>.</li>
<li><strong>R2:R5</strong> — danh sách Passed / Failed / Pending / N/A làm nguồn cho drop-down ở các cột round.</li>
</ul>
<h3>Một sheet Workflow — các cột test case (dòng 10)</h3>
<table>
<thead><tr><th>Cột</th><th>Tên cột</th><th>Viết gì</th></tr></thead>
<tbody>
<tr><td>A</td><td>Test Case ID</td><td>duy nhất, tiền tố theo workflow: <code>AJ-01</code>. Dòng chỉ ghi "Scenario A" là dòng tiêu đề nhóm.</td></tr>
<tr><td>B</td><td>Test Case Description</td><td>test cái gì, một dòng: "Apply với CV PDF hợp lệ".</td></tr>
<tr><td>C</td><td>Test Case Procedure</td><td>các bước đánh số, ghi đúng dữ liệu nhập.</td></tr>
<tr><td>D</td><td>Expected Results</td><td>điều khách hàng yêu cầu phải thấy — thông báo nguyên văn (mã MSG trong RDS), dữ liệu có được lưu hay không.</td></tr>
<tr><td>E</td><td>Pre-conditions</td><td>tài khoản, role, dữ liệu phải có sẵn, hoặc ID case phải chạy trước.</td></tr>
<tr><td>F · G · H</td><td>Round 1 · Test date · Tester</td><td>trạng thái từ drop-down, ngày chạy, ai chạy.</td></tr>
<tr><td>I · J · K</td><td>Round 2 · Test date · Tester</td><td>chạy lại sau khi sửa.</td></tr>
<tr><td>L · M · N</td><td>Round 3 · Test date · Tester</td><td>regression cuối trước khi gắn tag.</td></tr>
<tr><td>O</td><td>Note</td><td>issue GitLab của lần fail (<code>#41</code>), hoặc lý do case là N/A.</td></tr>
</tbody>
</table>
<p class="nhan">Bốn trạng thái</p>
<ul>
<li><strong>Passed</strong> — thực tế = mong đợi.</li>
<li><strong>Failed</strong> — lệch bất kỳ điểm nào; mở issue <strong>Defect</strong> và ghi số issue vào Note.</li>
<li><strong>Pending</strong> — chưa chạy (giá trị mặc định của template ở mọi round).</li>
<li><strong>N/A</strong> — không thể hoặc không cần chạy trong bản này (tính năng giáo viên cho lùi). Nó bị loại khỏi mẫu số của coverage.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> test case tốt phải qua được "phép thử người lạ" — một bạn nhóm khác chỉ đọc cột C–E cũng chạy lại được và ra cùng kết luận.</p>`),
    bi(`<h3>Sheet Test Statistics and the two coverage formulas</h3>
<ul>
<li><strong>Header</strong> — Project Name, Project Code, Creator, Reviewer/Approver, Document Code (formula <code>Code_Test Report_vx.x</code>), Issue Date, <strong>Notes</strong> = the modules in this release ("Iteration 2 includes Apply Job and Manage Applicants").</li>
<li><strong>Table</strong> (rows 11–13) — one row per workflow sheet; every cell is a link such as <code>='Workflow Name1'!B6</code>.</li>
<li><strong>Sub total</strong> (row 14) — <code>SUM(D9:D13)</code>. If you add a 4th workflow, insert the row <em>inside</em> 9–13 so the SUM grows with it.</li>
</ul>
<pre>Test coverage            = (Passed + Failed) × 100 / (Number of TCs − N/A)     ← cell E16
Test successful coverage =  Passed           × 100 / (Number of TCs − N/A)     ← cell E17</pre>
<ul>
<li><strong>Coverage</strong> answers "how much of what we planned did we actually run?" — Pending cases pull it down.</li>
<li><strong>Successful coverage</strong> answers "how much of it works?" — Failed cases pull it down.</li>
<li><strong>N/A</strong> is removed from both denominators: it was never in scope for this release.</li>
</ul>
<h3>Three formula traps shipped in the template — fix them first</h3>
<div class="pitfall co-tieu-de"><strong>Trap 1 — Number of TCs counts the scenario rows.</strong> <code>COUNTA(A12:A1000)</code> counts "Scenario B" and "Scenario C" too. The sample sheet has 6 cases but shows <strong>8</strong>, and every coverage figure is then wrong. Fix: <code>=COUNTA(A11:A1000)-COUNTIF(A11:A1000,"Scenario*")</code>.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — Rounds 2 and 3 count the Round 1 column.</strong> All three rows use <code>COUNTIF($F10:$F998, …)</code>. Round 2 must count column I and Round 3 column L: <code>=COUNTIF($I$12:$I$1000,B$5)</code> and <code>=COUNTIF($L$12:$L$1000,B$5)</code> (copy across C–E).</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — Test Statistics reads Round 1 only.</strong> Its links point to row 6 of each workflow sheet. After Round 3 your report still shows Round 1. Point them to the last round you ran (row 8 for Round 3), or copy the table once per round.</div>
<p class="ghi-chu">These come from reading the formulas inside Template3_System Test.xlsx itself. Mention the fix in the Record of change ("M — fixed round formulas") so the teacher knows the numbers are trustworthy.</p>`,
    `<h3>Sheet Test Statistics và hai công thức coverage</h3>
<ul>
<li><strong>Phần đầu</strong> — Project Name, Project Code, Creator, Reviewer/Approver, Document Code (công thức <code>Code_Test Report_vx.x</code>), Issue Date, <strong>Notes</strong> = các module trong bản phát hành này ("Iteration 2 gồm Apply Job và Manage Applicants").</li>
<li><strong>Bảng</strong> (dòng 11–13) — mỗi sheet workflow một dòng; mọi ô là liên kết kiểu <code>='Workflow Name1'!B6</code>.</li>
<li><strong>Sub total</strong> (dòng 14) — <code>SUM(D9:D13)</code>. Thêm workflow thứ 4 thì chèn dòng <em>bên trong</em> 9–13 để SUM tự giãn theo.</li>
</ul>
<pre>Test coverage            = (Passed + Failed) × 100 / (Number of TCs − N/A)     ← ô E16
Test successful coverage =  Passed           × 100 / (Number of TCs − N/A)     ← ô E17</pre>
<ul>
<li><strong>Coverage</strong> trả lời "trong số đã lên kế hoạch, ta thực sự chạy được bao nhiêu?" — case Pending kéo nó xuống.</li>
<li><strong>Successful coverage</strong> trả lời "trong đó bao nhiêu chạy đúng?" — case Failed kéo nó xuống.</li>
<li><strong>N/A</strong> bị loại khỏi cả hai mẫu số: nó vốn không nằm trong phạm vi bản này.</li>
</ul>
<h3>Ba bẫy công thức có sẵn trong template — sửa trước tiên</h3>
<div class="pitfall co-tieu-de"><strong>Bẫy 1 — Number of TCs đếm cả dòng scenario.</strong> <code>COUNTA(A12:A1000)</code> đếm luôn "Scenario B" và "Scenario C". Sheet mẫu có 6 case mà hiện <strong>8</strong>, và mọi con số coverage sau đó đều sai. Sửa: <code>=COUNTA(A11:A1000)-COUNTIF(A11:A1000,"Scenario*")</code>.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — Round 2 và 3 đếm cột của Round 1.</strong> Cả ba dòng đều dùng <code>COUNTIF($F10:$F998, …)</code>. Round 2 phải đếm cột I, Round 3 đếm cột L: <code>=COUNTIF($I$12:$I$1000,B$5)</code> và <code>=COUNTIF($L$12:$L$1000,B$5)</code> (kéo sang C–E).</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — Test Statistics chỉ đọc Round 1.</strong> Các liên kết trỏ vào dòng 6 của mỗi sheet workflow. Chạy xong Round 3 mà báo cáo vẫn hiện Round 1. Trỏ chúng sang round cuối cùng đã chạy (dòng 8 cho Round 3), hoặc chép bảng thành một bảng cho mỗi round.</div>
<p class="ghi-chu">Ba bẫy này tìm ra bằng cách đọc chính các công thức trong file Template3_System Test.xlsx. Ghi việc sửa vào Record of change ("M — fixed round formulas") để giáo viên biết các con số đáng tin.</p>`),
    bi(`<h3>Worked example — sheet "Apply Job" of the G5 system</h3>
<p>The G5 sample (<em>Job IT for Freelancer</em>, Java web + SQL Server) has a screen <strong>Apply job</strong> for the Freelancer role, a table <code>JobApply(applyID, freelanceID, postID, status, dateApply, Resume)</code>, rule <strong>BR-05</strong> "Freelancers can apply for posted jobs within the application period" and <strong>BR-11</strong> "Freelancers who have applied cannot cancel their application". We add one rule the team agreed with the teacher: CV = PDF/DOC/DOCX, max 5 MB.</p>
<p class="nhan">Header block</p>
<pre>Workflow:          Apply Job
Test requirement:  UC "Apply job" + screen "List Apply"; BR-05, BR-11; CV type/size rule
Number of TCs:     10</pre>
<p class="nhan">Scenario A — open the Apply form · Scenario B — submit</p>
<table>
<thead><tr><th>ID</th><th>Description</th><th>Procedure</th><th>Expected results</th><th>Pre-conditions</th><th>R1 / R2 / R3</th></tr></thead>
<tbody>
<tr><td>AJ-01</td><td>Guest clicks Apply</td><td>1. Open post #12 without logging in 2. Click "Apply"</td><td>Login page shown; after login the user returns to post #12</td><td>Post #12 open, not expired</td><td>P / P / P</td></tr>
<tr><td>AJ-02</td><td>Freelancer opens the Apply form</td><td>1. Log in as freelancer 2. Open post #12 3. Click "Apply"</td><td>Form shows job title, company, deadline, CV file field, Submit, Cancel</td><td>Freelancer account active</td><td>P / P / P</td></tr>
<tr><td>AJ-03</td><td>Recruiter cannot apply</td><td>1. Log in as recruiter 2. Open post #12 3. Type URL <code>/apply?postId=12</code></td><td>No Apply button; the URL shows "You do not have permission"</td><td>Recruiter account</td><td>F #39 / P / P</td></tr>
<tr><td>AJ-04</td><td>Apply with a valid PDF CV</td><td>1. As AJ-02 2. Choose cv.pdf (1 MB) 3. Submit</td><td>"Apply successfully"; a JobApply row: status Pending, dateApply = today</td><td>AJ-02; not applied to #12 yet</td><td>P / P / P</td></tr>
<tr><td>AJ-05</td><td>Submit without a CV</td><td>1. As AJ-02 2. Submit with no file</td><td>"Please upload your CV" under the field; nothing saved</td><td>AJ-02</td><td>P / P / P</td></tr>
<tr><td>AJ-06</td><td>Wrong type and size</td><td>1. As AJ-02 2. Choose setup.exe (12 MB) 3. Submit</td><td>"CV must be PDF/DOC/DOCX, max 5 MB"; nothing saved</td><td>AJ-02</td><td>F #41 / P / P</td></tr>
<tr><td>AJ-07</td><td>Boundary: exactly 5 MB</td><td>1. As AJ-02 2. Choose cv5mb.pdf (5 120 KB) 3. Submit</td><td>Accepted, same result as AJ-04</td><td>AJ-02; post #13 not applied</td><td>P / P / P</td></tr>
</tbody>
</table>`,
    `<h3>Ví dụ có lời giải — sheet "Apply Job" của hệ thống G5</h3>
<p>Mẫu G5 (<em>Job IT for Freelancer</em>, Java web + SQL Server) có màn hình <strong>Apply job</strong> cho role Freelancer, bảng <code>JobApply(applyID, freelanceID, postID, status, dateApply, Resume)</code>, luật <strong>BR-05</strong> "Freelancer chỉ ứng tuyển được job trong thời hạn nhận hồ sơ" và <strong>BR-11</strong> "Freelancer đã ứng tuyển thì không huỷ được đơn". Ta thêm một luật nhóm đã thống nhất với giáo viên: CV là PDF/DOC/DOCX, tối đa 5 MB.</p>
<p class="nhan">Khối đầu sheet</p>
<pre>Workflow:          Apply Job
Test requirement:  UC "Apply job" + màn hình "List Apply"; BR-05, BR-11; luật loại/cỡ file CV
Number of TCs:     10</pre>
<p class="nhan">Scenario A — mở form Apply · Scenario B — nộp đơn</p>
<table>
<thead><tr><th>ID</th><th>Mô tả</th><th>Các bước</th><th>Kết quả mong đợi</th><th>Tiền điều kiện</th><th>R1 / R2 / R3</th></tr></thead>
<tbody>
<tr><td>AJ-01</td><td>Khách chưa đăng nhập bấm Apply</td><td>1. Mở bài #12 khi chưa đăng nhập 2. Bấm "Apply"</td><td>Hiện trang Login; đăng nhập xong quay lại bài #12</td><td>Bài #12 đang mở, chưa hết hạn</td><td>P / P / P</td></tr>
<tr><td>AJ-02</td><td>Freelancer mở form Apply</td><td>1. Đăng nhập freelancer 2. Mở bài #12 3. Bấm "Apply"</td><td>Form hiện tên job, công ty, hạn nộp, ô file CV, Submit, Cancel</td><td>Tài khoản freelancer đang active</td><td>P / P / P</td></tr>
<tr><td>AJ-03</td><td>Recruiter không được apply</td><td>1. Đăng nhập recruiter 2. Mở bài #12 3. Gõ URL <code>/apply?postId=12</code></td><td>Không có nút Apply; URL báo "You do not have permission"</td><td>Tài khoản recruiter</td><td>F #39 / P / P</td></tr>
<tr><td>AJ-04</td><td>Apply với CV PDF hợp lệ</td><td>1. Như AJ-02 2. Chọn cv.pdf (1 MB) 3. Submit</td><td>"Apply successfully"; có một dòng JobApply: status Pending, dateApply = hôm nay</td><td>AJ-02; chưa apply bài #12</td><td>P / P / P</td></tr>
<tr><td>AJ-05</td><td>Submit khi chưa chọn CV</td><td>1. Như AJ-02 2. Submit không kèm file</td><td>"Please upload your CV" dưới ô file; không lưu gì</td><td>AJ-02</td><td>P / P / P</td></tr>
<tr><td>AJ-06</td><td>Sai loại và quá cỡ</td><td>1. Như AJ-02 2. Chọn setup.exe (12 MB) 3. Submit</td><td>"CV must be PDF/DOC/DOCX, max 5 MB"; không lưu gì</td><td>AJ-02</td><td>F #41 / P / P</td></tr>
<tr><td>AJ-07</td><td>Biên: đúng 5 MB</td><td>1. Như AJ-02 2. Chọn cv5mb.pdf (5 120 KB) 3. Submit</td><td>Được chấp nhận, kết quả như AJ-04</td><td>AJ-02; chưa apply bài #13</td><td>P / P / P</td></tr>
</tbody>
</table>`),
    bi(`<p class="nhan">Scenario C — business rules</p>
<table>
<thead><tr><th>ID</th><th>Description</th><th>Procedure</th><th>Expected results</th><th>Pre-conditions</th><th>R1 / R2 / R3</th></tr></thead>
<tbody>
<tr><td>AJ-08</td><td>Apply twice to the same post</td><td>1. After AJ-04, open post #12 again 2. Apply with cv.pdf</td><td>"You have already applied for this job"; still ONE JobApply row for (freelancer, #12)</td><td>AJ-04 passed</td><td>F #44 / P / P</td></tr>
<tr><td>AJ-09</td><td>Expired post (BR-05)</td><td>1. Open post #15 (expired yesterday) 2. Look for Apply 3. Send the apply request for #15 directly</td><td>No Apply button; direct request answers "This job is no longer accepting applications"; nothing saved</td><td>Post #15 with expired &lt; today</td><td>P / P / P</td></tr>
<tr><td>AJ-10</td><td>Cannot cancel (BR-11)</td><td>1. After AJ-04, open "List Apply"</td><td>Application to #12 listed with status Pending; no Cancel/Delete action</td><td>AJ-04 passed</td><td>Pending / F #47 / P</td></tr>
</tbody>
</table>
<h3>Three rounds and the numbers</h3>
<table>
<thead><tr><th>Apply Job</th><th>Passed</th><th>Failed</th><th>Pending</th><th>N/A</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>Round 1</td><td>6</td><td>3</td><td>1</td><td>0</td><td>3 Defects opened (#39, #41, #44); List Apply not merged yet</td></tr>
<tr><td>Round 2</td><td>9</td><td>1</td><td>0</td><td>0</td><td>fixes verified; AJ-10 shows a Cancel button → #47</td></tr>
<tr><td>Round 3</td><td>10</td><td>0</td><td>0</td><td>0</td><td>full regression on the build to be tagged</td></tr>
</tbody>
</table>
<p>A second sheet <em>Manage Applicants</em> (Recruiter, 8 cases) had Round 1 = 4 / 2 / 1 / 1 and Round 3 = 6 / 1 / 0 / 1 — one case is N/A because the teacher postponed "export applicants to Excel", and one known failure stays open with its issue number.</p>
<pre>Round 1   Passed 6+4=10  Failed 3+2=5  Pending 1+1=2  N/A 0+1=1  TCs 10+8=18
          coverage   = (10 + 5) × 100 / (18 − 1) = 1500 / 17 = 88.24 %
          successful =  10      × 100 / 17       = 58.82 %

Round 3   Passed 10+6=16 Failed 0+1=1  Pending 0      N/A 1      TCs 18
          coverage   = (16 + 1) × 100 / 17 = 100.00 %
          successful =  16      × 100 / 17 =  94.12 %</pre>
<div class="pitfall co-tieu-de"><strong>What Trap 1 would have reported.</strong> With the original <code>COUNTA</code>, the Apply Job sheet counts "Scenario B" and "Scenario C" and shows 12 cases. Round 3 coverage becomes 10 × 100 / 12 = 83.33 % although every case passed.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Trace every row back to a requirement.</strong> Add a column "UC / BR" (e.g. <em>UC Apply job · BR-11</em>). A filter then shows which requirements have no test at all — the question the teacher asks in the Final Presentation. For techniques that find the missing cases systematically (boundary values, decision tables, state transitions) see <a href="${SWT}" target="_blank" rel="noopener">SWT301 Chapter 4</a>.</div>`,
    `<p class="nhan">Scenario C — luật nghiệp vụ</p>
<table>
<thead><tr><th>ID</th><th>Mô tả</th><th>Các bước</th><th>Kết quả mong đợi</th><th>Tiền điều kiện</th><th>R1 / R2 / R3</th></tr></thead>
<tbody>
<tr><td>AJ-08</td><td>Apply hai lần vào cùng một bài</td><td>1. Sau AJ-04, mở lại bài #12 2. Apply với cv.pdf</td><td>"You have already applied for this job"; vẫn chỉ MỘT dòng JobApply cho (freelancer, #12)</td><td>AJ-04 đã pass</td><td>F #44 / P / P</td></tr>
<tr><td>AJ-09</td><td>Bài đã hết hạn (BR-05)</td><td>1. Mở bài #15 (hết hạn hôm qua) 2. Tìm nút Apply 3. Gửi thẳng request apply cho #15</td><td>Không có nút Apply; request trực tiếp trả "This job is no longer accepting applications"; không lưu gì</td><td>Bài #15 có expired &lt; hôm nay</td><td>P / P / P</td></tr>
<tr><td>AJ-10</td><td>Không huỷ được đơn (BR-11)</td><td>1. Sau AJ-04, mở "List Apply"</td><td>Đơn vào #12 hiện với status Pending; không có thao tác Cancel/Delete</td><td>AJ-04 đã pass</td><td>Pending / F #47 / P</td></tr>
</tbody>
</table>
<h3>Ba round và các con số</h3>
<table>
<thead><tr><th>Apply Job</th><th>Passed</th><th>Failed</th><th>Pending</th><th>N/A</th><th>Chuyện gì đã xảy ra</th></tr></thead>
<tbody>
<tr><td>Round 1</td><td>6</td><td>3</td><td>1</td><td>0</td><td>mở 3 Defect (#39, #41, #44); List Apply chưa merge</td></tr>
<tr><td>Round 2</td><td>9</td><td>1</td><td>0</td><td>0</td><td>các bản sửa đã kiểm; AJ-10 lộ nút Cancel → #47</td></tr>
<tr><td>Round 3</td><td>10</td><td>0</td><td>0</td><td>0</td><td>regression toàn bộ trên bản sẽ gắn tag</td></tr>
</tbody>
</table>
<p>Sheet thứ hai <em>Manage Applicants</em> (Recruiter, 8 case) có Round 1 = 4 / 2 / 1 / 1 và Round 3 = 6 / 1 / 0 / 1 — một case N/A vì giáo viên cho lùi "xuất danh sách ứng viên ra Excel", một lỗi đã biết vẫn mở kèm số issue.</p>
<pre>Round 1   Passed 6+4=10  Failed 3+2=5  Pending 1+1=2  N/A 0+1=1  TCs 10+8=18
          coverage   = (10 + 5) × 100 / (18 − 1) = 1500 / 17 = 88.24 %
          successful =  10      × 100 / 17       = 58.82 %

Round 3   Passed 10+6=16 Failed 0+1=1  Pending 0      N/A 1      TCs 18
          coverage   = (16 + 1) × 100 / 17 = 100.00 %
          successful =  16      × 100 / 17 =  94.12 %</pre>
<div class="pitfall co-tieu-de"><strong>Nếu để nguyên Bẫy 1.</strong> Với <code>COUNTA</code> gốc, sheet Apply Job đếm cả "Scenario B" và "Scenario C" thành 12 case. Coverage Round 3 thành 10 × 100 / 12 = 83.33 % dù mọi case đều pass.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Truy mỗi dòng về một yêu cầu.</strong> Thêm cột "UC / BR" (vd <em>UC Apply job · BR-11</em>). Một bộ lọc là thấy ngay yêu cầu nào chưa có test nào — đúng câu giáo viên hay hỏi ở buổi Final Presentation. Kỹ thuật tìm các case còn thiếu một cách có hệ thống (giá trị biên, bảng quyết định, chuyển trạng thái) xem ở <a href="${SWT}" target="_blank" rel="noopener">SWT301 Chương 4</a>.</div>`),
    bi(`<h3>Checklist before the Template3 file goes into the package</h3>
<ol>
<li>No <code>&lt;placeholder&gt;</code> or <code>#REF!</code> left; the three formula traps fixed.</li>
<li>One sheet per workflow; every Req screen of this iteration appears in sheet Test Cases.</li>
<li>Every Failed cell has an issue number in Note, and that issue carries the <strong>Defect</strong> label.</li>
<li>Round 3 was run on the same commit you tag (lesson 6.1) — not on someone's laptop copy.</li>
<li>Expected results quote the messages of the RDS message list, word for word.</li>
</ol>`,
    `<h3>Checklist trước khi cho file Template3 vào gói nộp</h3>
<ol>
<li>Không còn <code>&lt;placeholder&gt;</code> hay <code>#REF!</code>; ba bẫy công thức đã sửa.</li>
<li>Mỗi workflow một sheet; mọi màn hình Req của iteration có mặt trong sheet Test Cases.</li>
<li>Mọi ô Failed có số issue trong Note, và issue đó mang nhãn <strong>Defect</strong>.</li>
<li>Round 3 chạy trên đúng commit sẽ gắn tag (bài 6.1) — không phải bản chép trên laptop của ai đó.</li>
<li>Kết quả mong đợi trích nguyên văn thông báo trong danh sách message của RDS.</li>
</ol>`),
    books([
      ['sommerville', 'Ch. 8.3 "Release testing" — requirements-based and scenario testing', 'Ch. 8.3 "Release testing" — test theo yêu cầu và theo kịch bản'],
      ['cockburn', 'Ch. 7 "Scenarios and steps" — each scenario of a use case is one test case', 'Ch. 7 "Scenarios and steps" — mỗi kịch bản của use case là một test case'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 5.3 Unit tests with JUnit ─────────────────────── */
const L53 = {
  title: '5.3 — Unit tests with JUnit 5 for a DAO and a service (NetBeans, MySQL)|||5.3 — Unit test bằng JUnit 5 cho DAO và service (NetBeans, MySQL)',
  slug: 'swp391-5-3-unit-tests-junit',
  type: 'VIDEO',
  description: 'Cài JUnit 5 + Mockito vào project web Java trên NetBeans, test một service có luật nghiệp vụ (mock DAO) và một DAO chạy trên database test MySQL riêng — ví dụ luồng Apply Job.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Unit tests — prove each business rule once, keep it proven</h2>
<p class="lead">Template3 tests a screen from the outside. A unit test checks one method from the inside, in milliseconds, every time you build. In SWP391 the rules live in two places — the <strong>service</strong> (or servlet) that decides, and the <strong>DAO</strong> that talks SQL — so those are the two things you test.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>add JUnit 5 and Mockito to a NetBeans Java web project (Maven or Ant);</li>
<li>test a service rule by rule, replacing the DAO with a Mockito mock;</li>
<li>test a DAO against a separate MySQL test schema that is reset before every test;</li>
<li>name tests so a red one tells you the broken rule without opening the code.</li>
</ul></div>
<p class="ghi-chu">JUnit itself (annotations, assertions, test runners) is taught hands-on in <a href="${SWT}" target="_blank" rel="noopener">SWT301 Chapter 8 — "JUnit hands-on"</a>. Here we apply it to the SWP391 architecture.</p>
<h3>Set-up in NetBeans 13+</h3>
<p class="nhan">Maven web project (recommended) — add to pom.xml</p>
<pre>&lt;dependency&gt;
  &lt;groupId&gt;org.junit.jupiter&lt;/groupId&gt;
  &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
  &lt;version&gt;5.10.2&lt;/version&gt;
  &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
  &lt;groupId&gt;org.mockito&lt;/groupId&gt;
  &lt;artifactId&gt;mockito-junit-jupiter&lt;/artifactId&gt;
  &lt;version&gt;5.11.0&lt;/version&gt;
  &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;!-- in &lt;build&gt;&lt;plugins&gt;: maven-surefire-plugin 3.2.5 so "mvn test" finds JUnit 5 --&gt;</pre>
<p class="nhan">Ant web project (the NetBeans default "Java with Ant")</p>
<ol>
<li>Right-click the class (e.g. <code>JobApplyService</code>) › <strong>Tools › Create/Update Tests</strong> (Ctrl+Shift+U) › framework <strong>JUnit 5</strong>. NetBeans creates <code>test/…/JobApplyServiceTest.java</code> and adds the library.</li>
<li>Add the Mockito JARs under <strong>Test Libraries</strong> of the project properties.</li>
<li><strong>Test File</strong> = Ctrl+F6 · <strong>Test Project</strong> = Alt+F6. The Test Results window shows green/red per method.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Commit the tests, not only the code.</strong> The <code>test/</code> (Ant) or <code>src/test/java</code> (Maven) folder must be in the tagged source. A test that lives only on your laptop is invisible to the teacher and to your teammates' regressions.</div>`,
    `<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Unit test — chứng minh từng luật nghiệp vụ một lần, giữ nó đúng mãi</h2>
<p class="lead">Template3 test một màn hình từ bên ngoài. Unit test kiểm một method từ bên trong, tính bằng mili-giây, mỗi lần build. Trong SWP391 luật nghiệp vụ nằm ở hai chỗ — <strong>service</strong> (hoặc servlet) ra quyết định, và <strong>DAO</strong> nói chuyện bằng SQL — nên đó là hai thứ bạn test.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>thêm JUnit 5 và Mockito vào project web Java trên NetBeans (Maven hoặc Ant);</li>
<li>test một service theo từng luật, thay DAO bằng mock của Mockito;</li>
<li>test một DAO trên một schema MySQL test riêng, được làm sạch trước mỗi test;</li>
<li>đặt tên test sao cho khi nó đỏ bạn biết ngay luật nào hỏng mà không cần mở code.</li>
</ul></div>
<p class="ghi-chu">Bản thân JUnit (annotation, assertion, test runner) được dạy thực hành ở <a href="${SWT}" target="_blank" rel="noopener">SWT301 Chương 8 — "JUnit hands-on"</a>. Ở đây ta áp nó vào kiến trúc của SWP391.</p>
<h3>Cài đặt trên NetBeans 13+</h3>
<p class="nhan">Project web Maven (khuyên dùng) — thêm vào pom.xml</p>
<pre>&lt;dependency&gt;
  &lt;groupId&gt;org.junit.jupiter&lt;/groupId&gt;
  &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
  &lt;version&gt;5.10.2&lt;/version&gt;
  &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
  &lt;groupId&gt;org.mockito&lt;/groupId&gt;
  &lt;artifactId&gt;mockito-junit-jupiter&lt;/artifactId&gt;
  &lt;version&gt;5.11.0&lt;/version&gt;
  &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;!-- trong &lt;build&gt;&lt;plugins&gt;: maven-surefire-plugin 3.2.5 để "mvn test" nhận JUnit 5 --&gt;</pre>
<p class="nhan">Project web Ant (mặc định "Java with Ant" của NetBeans)</p>
<ol>
<li>Chuột phải vào lớp (vd <code>JobApplyService</code>) › <strong>Tools › Create/Update Tests</strong> (Ctrl+Shift+U) › framework <strong>JUnit 5</strong>. NetBeans tạo <code>test/…/JobApplyServiceTest.java</code> và thêm thư viện.</li>
<li>Thêm các JAR của Mockito vào <strong>Test Libraries</strong> trong Project Properties.</li>
<li><strong>Test File</strong> = Ctrl+F6 · <strong>Test Project</strong> = Alt+F6. Cửa sổ Test Results hiện xanh/đỏ cho từng method.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Commit cả test, không chỉ code.</strong> Thư mục <code>test/</code> (Ant) hoặc <code>src/test/java</code> (Maven) phải nằm trong source đã gắn tag. Test chỉ nằm trên laptop của bạn thì giáo viên không thấy và bạn cùng nhóm cũng không chạy regression được.</div>`),
    bi(`<h3>The code under test — JobApplyService</h3>
<p>The servlet of the Apply Job screen should stay thin: read the request, call the service, forward to the JSP. All four rules of Template3 cases AJ-05…AJ-09 sit in one method that has <strong>no HTTP and no SQL inside</strong> — which is what makes it unit-testable.</p>
<pre>public class JobApplyService {
    static final long MAX_CV = 5L * 1024 * 1024;              // 5 MB, agreed with the teacher
    private final JobApplyDAO applyDao;
    private final PostDAO postDao;

    public JobApplyService(JobApplyDAO applyDao, PostDAO postDao) {   // injected: tests pass mocks
        this.applyDao = applyDao;
        this.postDao = postDao;
    }

    /** @return null when saved, otherwise the message code of the RDS message list */
    public String apply(int freelancerId, int postId, String cvName, long cvBytes, LocalDate today) {
        if (cvName == null || cvName.isBlank()) return "MSG21";            // Please upload your CV
        String ext = cvName.substring(cvName.lastIndexOf('.') + 1).toLowerCase();
        if (!Set.of("pdf", "doc", "docx").contains(ext) || cvBytes &gt; MAX_CV) return "MSG22";
        Post post = postDao.findById(postId);
        if (post == null || post.getExpired().isBefore(today)) return "MSG23"; // BR-05
        if (applyDao.exists(freelancerId, postId)) return "MSG24";          // already applied
        applyDao.insert(new JobApply(freelancerId, postId, "Pending", today, cvName));
        return null;
    }
}</pre>
<ul>
<li><strong>Constructor injection</strong> — the servlet builds it with the real DAOs; the test builds it with mocks.</li>
<li><strong>today is a parameter</strong> — a rule that calls <code>LocalDate.now()</code> inside gives a test that passes today and fails next month.</li>
<li><strong>Message codes</strong> — the JSP turns MSG21… into text, so the test checks the rule, not the wording.</li>
</ul>`,
    `<h3>Code được test — JobApplyService</h3>
<p>Servlet của màn hình Apply Job nên thật mỏng: đọc request, gọi service, forward sang JSP. Cả bốn luật của các case AJ-05…AJ-09 trong Template3 nằm trong một method <strong>không có HTTP, không có SQL bên trong</strong> — chính điều đó làm nó unit-test được.</p>
<pre>public class JobApplyService {
    static final long MAX_CV = 5L * 1024 * 1024;              // 5 MB, agreed with the teacher
    private final JobApplyDAO applyDao;
    private final PostDAO postDao;

    public JobApplyService(JobApplyDAO applyDao, PostDAO postDao) {   // injected: tests pass mocks
        this.applyDao = applyDao;
        this.postDao = postDao;
    }

    /** @return null when saved, otherwise the message code of the RDS message list */
    public String apply(int freelancerId, int postId, String cvName, long cvBytes, LocalDate today) {
        if (cvName == null || cvName.isBlank()) return "MSG21";            // Please upload your CV
        String ext = cvName.substring(cvName.lastIndexOf('.') + 1).toLowerCase();
        if (!Set.of("pdf", "doc", "docx").contains(ext) || cvBytes &gt; MAX_CV) return "MSG22";
        Post post = postDao.findById(postId);
        if (post == null || post.getExpired().isBefore(today)) return "MSG23"; // BR-05
        if (applyDao.exists(freelancerId, postId)) return "MSG24";          // already applied
        applyDao.insert(new JobApply(freelancerId, postId, "Pending", today, cvName));
        return null;
    }
}</pre>
<ul>
<li><strong>Constructor injection</strong> — servlet dựng nó bằng DAO thật; test dựng nó bằng mock.</li>
<li><strong>today là tham số</strong> — luật gọi <code>LocalDate.now()</code> bên trong sẽ cho ra test pass hôm nay và fail tháng sau.</li>
<li><strong>Mã message</strong> — JSP đổi MSG21… thành chữ, nên test kiểm luật chứ không kiểm câu chữ.</li>
</ul>`),
    bi(`<h3>Service test — one test per rule, DAO mocked</h3>
<pre>@ExtendWith(MockitoExtension.class)
class JobApplyServiceTest {
    static final LocalDate TODAY = LocalDate.of(2026, 3, 10);
    @Mock JobApplyDAO applyDao;
    @Mock PostDAO postDao;
    @InjectMocks JobApplyService service;

    Post openPost() { Post p = new Post(); p.setExpired(TODAY.plusDays(7)); return p; }

    @Test
    void apply_validPdf_savesPendingApplication() {                 // AJ-04
        when(postDao.findById(12)).thenReturn(openPost());
        when(applyDao.exists(5, 12)).thenReturn(false);
        assertNull(service.apply(5, 12, "cv.pdf", 1_000_000, TODAY));
        ArgumentCaptor&lt;JobApply&gt; saved = ArgumentCaptor.forClass(JobApply.class);
        verify(applyDao).insert(saved.capture());
        assertEquals("Pending", saved.getValue().getStatus());
        assertEquals(TODAY, saved.getValue().getDateApply());
    }

    @Test
    void apply_noFile_returnsMsg21AndSavesNothing() {               // AJ-05
        assertEquals("MSG21", service.apply(5, 12, "", 0, TODAY));
        verifyNoInteractions(applyDao);
    }

    @ParameterizedTest                                     // AJ-06, AJ-07: boundary values
    @CsvSource({ "cv.pdf, 5242880, ",       "cv.pdf, 5242881, MSG22",
                 "setup.exe, 1000, MSG22",  "CV.DOCX, 1000, " })
    void apply_typeAndSize(String name, long bytes, String expected) {
        lenient().when(postDao.findById(12)).thenReturn(openPost());
        assertEquals(expected, service.apply(5, 12, name, bytes, TODAY));
    }

    @Test
    void apply_expiredYesterday_returnsMsg23() {                   // AJ-09, BR-05
        Post p = new Post(); p.setExpired(TODAY.minusDays(1));
        when(postDao.findById(15)).thenReturn(p);
        assertEquals("MSG23", service.apply(5, 15, "cv.pdf", 1000, TODAY));
        verify(applyDao, never()).insert(any());
    }

    @Test
    void apply_secondTime_returnsMsg24() {                         // AJ-08
        when(postDao.findById(12)).thenReturn(openPost());
        when(applyDao.exists(5, 12)).thenReturn(true);
        assertEquals("MSG24", service.apply(5, 12, "cv.pdf", 1000, TODAY));
        verify(applyDao, never()).insert(any());
    }
}</pre>
<ul>
<li><strong>Name = method_situation_result</strong> — "apply_expiredYesterday_returnsMsg23" failing needs no explanation.</li>
<li><strong>Arrange · Act · Assert</strong> — set up the mocks, call once, assert the result <em>and</em> the side effect (<code>verify … never()</code>: nothing saved).</li>
<li><strong>Boundary values</strong> — 5 242 880 bytes (exactly 5 MB) passes, one byte more fails; an empty CSV cell is <code>null</code> = "saved".</li>
<li><strong>A missing test</strong> — "expired = today" is still open (BR-05 says <em>within</em> the period). Add it; that is how a unit test finds a gap in the requirement, which becomes a <strong>Q&amp;A</strong> issue for the teacher.</li>
</ul>`,
    `<h3>Test service — mỗi luật một test, DAO được mock</h3>
<pre>@ExtendWith(MockitoExtension.class)
class JobApplyServiceTest {
    static final LocalDate TODAY = LocalDate.of(2026, 3, 10);
    @Mock JobApplyDAO applyDao;
    @Mock PostDAO postDao;
    @InjectMocks JobApplyService service;

    Post openPost() { Post p = new Post(); p.setExpired(TODAY.plusDays(7)); return p; }

    @Test
    void apply_validPdf_savesPendingApplication() {                 // AJ-04
        when(postDao.findById(12)).thenReturn(openPost());
        when(applyDao.exists(5, 12)).thenReturn(false);
        assertNull(service.apply(5, 12, "cv.pdf", 1_000_000, TODAY));
        ArgumentCaptor&lt;JobApply&gt; saved = ArgumentCaptor.forClass(JobApply.class);
        verify(applyDao).insert(saved.capture());
        assertEquals("Pending", saved.getValue().getStatus());
        assertEquals(TODAY, saved.getValue().getDateApply());
    }

    @Test
    void apply_noFile_returnsMsg21AndSavesNothing() {               // AJ-05
        assertEquals("MSG21", service.apply(5, 12, "", 0, TODAY));
        verifyNoInteractions(applyDao);
    }

    @ParameterizedTest                                     // AJ-06, AJ-07: boundary values
    @CsvSource({ "cv.pdf, 5242880, ",       "cv.pdf, 5242881, MSG22",
                 "setup.exe, 1000, MSG22",  "CV.DOCX, 1000, " })
    void apply_typeAndSize(String name, long bytes, String expected) {
        lenient().when(postDao.findById(12)).thenReturn(openPost());
        assertEquals(expected, service.apply(5, 12, name, bytes, TODAY));
    }

    @Test
    void apply_expiredYesterday_returnsMsg23() {                   // AJ-09, BR-05
        Post p = new Post(); p.setExpired(TODAY.minusDays(1));
        when(postDao.findById(15)).thenReturn(p);
        assertEquals("MSG23", service.apply(5, 15, "cv.pdf", 1000, TODAY));
        verify(applyDao, never()).insert(any());
    }

    @Test
    void apply_secondTime_returnsMsg24() {                         // AJ-08
        when(postDao.findById(12)).thenReturn(openPost());
        when(applyDao.exists(5, 12)).thenReturn(true);
        assertEquals("MSG24", service.apply(5, 12, "cv.pdf", 1000, TODAY));
        verify(applyDao, never()).insert(any());
    }
}</pre>
<ul>
<li><strong>Tên = method_tình-huống_kết-quả</strong> — "apply_expiredYesterday_returnsMsg23" đỏ lên là hiểu ngay, khỏi giải thích.</li>
<li><strong>Arrange · Act · Assert</strong> — dựng mock, gọi đúng một lần, khẳng định kết quả <em>và</em> tác dụng phụ (<code>verify … never()</code>: không lưu gì).</li>
<li><strong>Giá trị biên</strong> — 5 242 880 byte (đúng 5 MB) qua, thêm một byte là trượt; ô CSV để trống là <code>null</code> = "đã lưu".</li>
<li><strong>Một test còn thiếu</strong> — trường hợp "expired = hôm nay" chưa có (BR-05 nói <em>trong</em> thời hạn). Hãy thêm; unit test tìm ra lỗ hổng của yêu cầu theo cách này, và nó trở thành một issue <strong>Q&amp;A</strong> hỏi giáo viên.</li>
</ul>`),
    bi(`<h3>DAO test — real SQL on a separate test schema</h3>
<p>A mock cannot tell you that your SQL has a typo or a wrong column. For the DAO, run the real query on a <strong>test schema</strong> (<code>jobit_test</code>, created from the same DB script you tag) and reset its rows before every test.</p>
<pre>class JobApplyDAOTest {
    static Connection con;
    JobApplyDAO dao;

    @BeforeAll
    static void open() throws SQLException {
        con = DriverManager.getConnection("jdbc:mysql://localhost:3306/jobit_test",
                "test", System.getenv("TEST_DB_PASSWORD"));      // never the real schema, never a password in code
    }

    @BeforeEach
    void reset() throws SQLException {                            // every test starts from the same rows
        try (Statement st = con.createStatement()) {
            st.execute("DELETE FROM JobApply");
            st.execute("INSERT INTO JobApply(freelanceID, postID, status, dateApply, Resume) "
                     + "VALUES (5, 12, 'Pending', '2026-03-01', 'old.pdf')");
        }
        dao = new JobApplyDAO(con);
    }

    @Test void exists_existingPair_true() throws Exception   { assertTrue(dao.exists(5, 12)); }
    @Test void exists_otherPost_false() throws Exception     { assertFalse(dao.exists(5, 13)); }

    @Test
    void insert_samePairTwice_rejectedByUniqueKey() {
        assertThrows(SQLIntegrityConstraintViolationException.class,
            () -&gt; dao.insert(new JobApply(5, 12, "Pending", LocalDate.of(2026, 3, 10), "cv.pdf")));
    }

    @AfterAll static void close() throws SQLException { con.close(); }
}</pre>
<ul>
<li><strong>The last test needs a constraint</strong> — <code>ALTER TABLE JobApply ADD CONSTRAINT uq_apply UNIQUE (freelanceID, postID);</code>. The G5 script has no such key, so a double click on Submit could save two rows even with the service check. The test found a design gap.</li>
<li><strong>Order independence</strong> — no test may rely on another having run first; <code>@BeforeEach</code> makes that true.</li>
<li><strong>Keep it small</strong> — 3–6 DAO tests per screen is enough: the query that lists, the one that saves, the one that enforces a rule.</li>
</ul>
<h3>Unit test cases as a table (for the RDS or the Tracking "Test" column)</h3>
<table>
<thead><tr><th>ID</th><th>Method</th><th>Input</th><th>Expected</th><th>Covers</th></tr></thead>
<tbody>
<tr><td>UT-AJ-01</td><td>apply</td><td>cv.pdf, 1 MB, open post</td><td>null + one insert, Pending</td><td>AJ-04</td></tr>
<tr><td>UT-AJ-02</td><td>apply</td><td>empty name</td><td>MSG21, no DAO call</td><td>AJ-05</td></tr>
<tr><td>UT-AJ-03..06</td><td>apply</td><td>5 242 880 / 5 242 881 bytes, .exe, .DOCX</td><td>null / MSG22 / MSG22 / null</td><td>AJ-06, AJ-07</td></tr>
<tr><td>UT-AJ-07</td><td>apply</td><td>post expired yesterday</td><td>MSG23, no insert</td><td>AJ-09, BR-05</td></tr>
<tr><td>UT-AJ-08</td><td>apply</td><td>pair already exists</td><td>MSG24, no insert</td><td>AJ-08</td></tr>
<tr><td>UT-AJ-09</td><td>JobApplyDAO.insert</td><td>duplicate pair</td><td>SQLIntegrityConstraintViolationException</td><td>AJ-08 (DB level)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Tests that prove nothing.</strong> No assertion (it "passes" whatever happens) · asserting what the code returns today instead of what the requirement says · tests that hit the real demo database and delete the teacher's demo data · a <code>@Disabled</code> test left to make the build green.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Measure, then stop.</strong> The JaCoCo Maven plugin writes a coverage report (<code>target/site/jacoco/index.html</code>) after <code>mvn test</code>. Aim for every branch of your <em>service</em> classes, not 100% of the project — getters, JSPs and servlets that only forward are better covered by Template3.</div>`,
    `<h3>Test DAO — SQL thật trên một schema test riêng</h3>
<p>Mock không thể báo cho bạn biết câu SQL gõ sai hay sai tên cột. Với DAO, hãy chạy câu truy vấn thật trên một <strong>schema test</strong> (<code>jobit_test</code>, tạo từ đúng DB script bạn gắn tag) và làm sạch dữ liệu trước mỗi test.</p>
<pre>class JobApplyDAOTest {
    static Connection con;
    JobApplyDAO dao;

    @BeforeAll
    static void open() throws SQLException {
        con = DriverManager.getConnection("jdbc:mysql://localhost:3306/jobit_test",
                "test", System.getenv("TEST_DB_PASSWORD"));      // never the real schema, never a password in code
    }

    @BeforeEach
    void reset() throws SQLException {                            // every test starts from the same rows
        try (Statement st = con.createStatement()) {
            st.execute("DELETE FROM JobApply");
            st.execute("INSERT INTO JobApply(freelanceID, postID, status, dateApply, Resume) "
                     + "VALUES (5, 12, 'Pending', '2026-03-01', 'old.pdf')");
        }
        dao = new JobApplyDAO(con);
    }

    @Test void exists_existingPair_true() throws Exception   { assertTrue(dao.exists(5, 12)); }
    @Test void exists_otherPost_false() throws Exception     { assertFalse(dao.exists(5, 13)); }

    @Test
    void insert_samePairTwice_rejectedByUniqueKey() {
        assertThrows(SQLIntegrityConstraintViolationException.class,
            () -&gt; dao.insert(new JobApply(5, 12, "Pending", LocalDate.of(2026, 3, 10), "cv.pdf")));
    }

    @AfterAll static void close() throws SQLException { con.close(); }
}</pre>
<ul>
<li><strong>Test cuối cần một ràng buộc</strong> — <code>ALTER TABLE JobApply ADD CONSTRAINT uq_apply UNIQUE (freelanceID, postID);</code>. Script của G5 không có khoá này, nên bấm đúp Submit vẫn có thể lưu hai dòng dù service đã kiểm. Test đã tìm ra một lỗ hổng thiết kế.</li>
<li><strong>Không phụ thuộc thứ tự</strong> — không test nào được dựa vào việc test khác đã chạy trước; <code>@BeforeEach</code> bảo đảm điều đó.</li>
<li><strong>Giữ gọn</strong> — 3–6 test DAO cho mỗi màn hình là đủ: câu truy vấn liệt kê, câu lưu, câu thực thi luật.</li>
</ul>
<h3>Unit test case dạng bảng (cho RDS hoặc cột "Test" của file Tracking)</h3>
<table>
<thead><tr><th>ID</th><th>Method</th><th>Đầu vào</th><th>Mong đợi</th><th>Phủ case</th></tr></thead>
<tbody>
<tr><td>UT-AJ-01</td><td>apply</td><td>cv.pdf, 1 MB, bài đang mở</td><td>null + một lần insert, Pending</td><td>AJ-04</td></tr>
<tr><td>UT-AJ-02</td><td>apply</td><td>tên file rỗng</td><td>MSG21, không gọi DAO</td><td>AJ-05</td></tr>
<tr><td>UT-AJ-03..06</td><td>apply</td><td>5 242 880 / 5 242 881 byte, .exe, .DOCX</td><td>null / MSG22 / MSG22 / null</td><td>AJ-06, AJ-07</td></tr>
<tr><td>UT-AJ-07</td><td>apply</td><td>bài hết hạn hôm qua</td><td>MSG23, không insert</td><td>AJ-09, BR-05</td></tr>
<tr><td>UT-AJ-08</td><td>apply</td><td>cặp đã tồn tại</td><td>MSG24, không insert</td><td>AJ-08</td></tr>
<tr><td>UT-AJ-09</td><td>JobApplyDAO.insert</td><td>cặp trùng</td><td>SQLIntegrityConstraintViolationException</td><td>AJ-08 (mức DB)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Những test không chứng minh gì.</strong> Không có assertion (xảy ra gì cũng "pass") · khẳng định thứ code đang trả về thay vì thứ yêu cầu nói · test chạy thẳng vào database demo và xoá mất dữ liệu demo của giáo viên · để một test <code>@Disabled</code> cho build xanh.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Đo, rồi dừng.</strong> Plugin JaCoCo cho Maven sinh báo cáo độ phủ (<code>target/site/jacoco/index.html</code>) sau <code>mvn test</code>. Hãy nhắm phủ mọi nhánh của các lớp <em>service</em>, không phải 100% cả project — getter, JSP và servlet chỉ forward thì Template3 phủ tốt hơn.</div>`),
    books([
      ['sommerville', 'Ch. 8.1 "Development testing" and 8.2 "Test-driven development"', 'Ch. 8.1 "Development testing" và 8.2 "Test-driven development"'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 5.4 AI test cases — prompt #9 ─────────────────────── */
const L54 = {
  title: '5.4 — AI-generated test cases: the teacher\'s Claude prompt #9 (unit, by-screen, E2E)|||5.4 — Sinh test case bằng AI: prompt Claude #9 của giáo viên (unit, theo màn hình, E2E)',
  slug: 'swp391-5-4-ai-test-cases-prompt9',
  type: 'VIDEO',
  description: 'Prompt #9 trong Claude_Prompts.txt: cần tài liệu đầu vào nào cho unit test, integration test theo màn hình và E2E test; ba prompt mẫu dùng được ngay; cách kiểm và ghi lại kết quả AI vào AI Usage Report.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.4 · Claude_Prompts.txt, prompt #9</span>
<h2>Asking AI for test cases — first ask what it needs</h2>
<p class="lead">The teacher's file <em>Claude_Prompts.txt</em> walks a Job Board System from idea to design in eight prompts: PRD → context diagram → business flows → use-case specs → ERD → UI specification → MySQL schema + demo data → Technical Design Spec. <strong>Prompt #9</strong> is different: it does not ask for tests, it asks <em>what inputs and which prompt</em> each kind of test needs.</p>
<p class="nhan">Prompt #9, as written by the teacher (Vietnamese)</p>
<pre>Cho dự án tôi đã có các tài liệu đặc tả sau: PRD, Business Flows, UC Specifications,
UI Specifications, Technical Design Specifications.
Để tạo Unit Test Cases, Integration Test Cases (Test theo màn hình), và E2E Test Cases
thì bạn cần các tài liệu đầu vào nào và prompt để bạn tạo như thế nào? Cho mỗi loại test case nhé</pre>
<p class="ghi-chu">Meaning: "My project already has a PRD, business flows, UC specs, UI specs and a TDS. To create unit, integration (per screen) and E2E test cases, which input documents do you need and how should I prompt you — for each type?"</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>pick the right input documents for each test type (and leave out the rest);</li>
<li>use three ready prompts whose output drops straight into JUnit, Template3 and an E2E sheet;</li>
<li>review AI-written cases against the requirement, and log the AI use honestly.</li>
</ul></div>
<h3>The answer in one table</h3>
<table>
<thead><tr><th>Test type</th><th>Input documents</th><th>Output you ask for</th><th>Where it goes</th></tr></thead>
<tbody>
<tr><td><strong>Unit</strong></td><td>the source of the class under test · TDS (package structure, error codes, conventions) · the business rules it enforces · the DB schema (for a DAO)</td><td>a JUnit 5 + Mockito class and a table ID · method · input · expected</td><td>repo <code>test/</code>, table in RDS</td></tr>
<tr><td><strong>Integration (by screen)</strong></td><td>UI spec of the screen (fields, validation, messages, states, RBAC) · UC spec (normal / alternative / exception flows) · business rules · message list · demo data</td><td>rows with exactly the Template3 columns, grouped by scenario</td><td>one Template3 workflow sheet</td></tr>
<tr><td><strong>E2E</strong></td><td>business flows · PRD (roles, goals) · screen flow / sitemap · UC list · demo accounts per role</td><td>end-to-end scenarios that cross roles and screens, each step with its check</td><td>an E2E sheet in Template3, or Playwright / Selenium scripts</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> the closer to the code, the more code the prompt needs; the closer to the user, the more <em>flows</em> it needs. Unit ← TDS + code · Screen ← UI spec + UC · E2E ← business flows + PRD.</p>`,
    `<span class="eyebrow">Chương 5 · Bài 5.4 · Claude_Prompts.txt, prompt #9</span>
<h2>Nhờ AI viết test case — trước hết hỏi nó cần gì</h2>
<p class="lead">File <em>Claude_Prompts.txt</em> của giáo viên dẫn một Job Board System từ ý tưởng tới thiết kế qua tám prompt: PRD → context diagram → business flow → đặc tả use case → ERD → UI specification → schema MySQL + dữ liệu demo → Technical Design Spec. <strong>Prompt #9</strong> khác hẳn: nó không đòi test, nó hỏi mỗi loại test cần <em>đầu vào gì và prompt thế nào</em>.</p>
<p class="nhan">Prompt #9, nguyên văn của giáo viên</p>
<pre>Cho dự án tôi đã có các tài liệu đặc tả sau: PRD, Business Flows, UC Specifications,
UI Specifications, Technical Design Specifications.
Để tạo Unit Test Cases, Integration Test Cases (Test theo màn hình), và E2E Test Cases
thì bạn cần các tài liệu đầu vào nào và prompt để bạn tạo như thế nào? Cho mỗi loại test case nhé</pre>
<p class="ghi-chu">Ý nghĩa: hỏi ngược lại AI danh sách đầu vào và cách prompt cho từng loại, thay vì ném cả chồng tài liệu rồi đòi "viết test cho tôi".</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>chọn đúng tài liệu đầu vào cho từng loại test (và bỏ bớt phần thừa);</li>
<li>dùng ba prompt mẫu cho ra kết quả đổ thẳng vào JUnit, Template3 và một sheet E2E;</li>
<li>soát test case AI viết đối chiếu với yêu cầu, và ghi lại việc dùng AI một cách trung thực.</li>
</ul></div>
<h3>Câu trả lời trong một bảng</h3>
<table>
<thead><tr><th>Loại test</th><th>Tài liệu đầu vào</th><th>Đầu ra cần đòi</th><th>Đặt ở đâu</th></tr></thead>
<tbody>
<tr><td><strong>Unit</strong></td><td>source của lớp cần test · TDS (cấu trúc package, mã lỗi, quy ước) · các business rule nó thực thi · DB schema (với DAO)</td><td>một lớp JUnit 5 + Mockito và một bảng ID · method · input · expected</td><td>thư mục <code>test/</code> của repo, bảng trong RDS</td></tr>
<tr><td><strong>Integration (theo màn hình)</strong></td><td>UI spec của màn hình (field, validation, message, trạng thái, RBAC) · UC spec (luồng chính / thay thế / ngoại lệ) · business rule · danh sách message · dữ liệu demo</td><td>các dòng đúng cột Template3, gom theo scenario</td><td>một sheet workflow của Template3</td></tr>
<tr><td><strong>E2E</strong></td><td>business flow · PRD (role, mục tiêu) · screen flow / sitemap · danh sách UC · tài khoản demo cho từng role</td><td>kịch bản đầu-cuối đi qua nhiều role và màn hình, mỗi bước có phép kiểm</td><td>một sheet E2E trong Template3, hoặc script Playwright / Selenium</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> càng gần code, prompt càng cần code; càng gần người dùng, prompt càng cần <em>luồng</em>. Unit ← TDS + code · Màn hình ← UI spec + UC · E2E ← business flow + PRD.</p>`),
    bi(`<h3>Prompt 1 — unit test cases</h3>
<p class="nhan">Attach: JobApplyService.java, JobApplyDAO.java, the TDS sections "error codes" and "package structure", BR-05, BR-11, the JobApply table DDL</p>
<pre>You are a senior Java developer writing unit tests for a Java web project
(Jakarta Servlet/JSP, JDBC DAO, MySQL 8, JUnit 5, Mockito 5).
Class under test: JobApplyService (attached). Business rules: BR-05, BR-11 and
"CV = pdf/doc/docx, max 5 MB" (attached). Message codes: MSG21..MSG24 (attached).
1. First list the test conditions as a table: ID | method | input | expected | rule.
   Use equivalence partitions and boundary values; include every rule.
2. Then write ONE JUnit 5 class: mock the DAOs with Mockito, pass a fixed LocalDate,
   name tests method_situation_expected, assert the result AND verify side effects.
3. Do NOT assert the current behaviour of the code if it contradicts a rule —
   write the test from the rule and mark it "EXPECTED TO FAIL: &lt;reason&gt;".
4. List any rule that is ambiguous as a question for the customer.</pre>
<h3>Prompt 2 — integration test cases by screen (Template3 rows)</h3>
<p class="nhan">Attach: UI spec of "Apply Job" + "List Apply", UC spec "Apply job", business rules, the message list, the demo-data accounts and posts</p>
<pre>You are a tester filling the "System Test" workbook for the screen "Apply Job".
Output a table with EXACTLY these columns:
Test Case ID | Test Case Description | Test Case Procedure | Expected Results | Pre-conditions
Rules:
- IDs AJ-01, AJ-02, ...; group rows under "Scenario A/B/C" header rows.
- Cover: the normal flow, every alternative and exception flow of the UC, every field
  validation (required, blank/spaces, max length of the DB column, format), every
  business rule, and role access (other roles, direct URL).
- Procedure = numbered steps with the exact data typed, using the demo data attached.
- Expected Results = message text copied from the message list + what is saved or not.
- Pre-conditions = account/role/data, or the ID of a case that must run first.
- At the end, a traceability list: UC step / rule / field -&gt; test case IDs.</pre>`,
    `<h3>Prompt 1 — unit test case</h3>
<p class="nhan">Đính kèm: JobApplyService.java, JobApplyDAO.java, các mục "mã lỗi" và "cấu trúc package" của TDS, BR-05, BR-11, DDL của bảng JobApply</p>
<pre>Bạn là senior Java developer viết unit test cho một project web Java
(Jakarta Servlet/JSP, DAO JDBC, MySQL 8, JUnit 5, Mockito 5).
Lớp cần test: JobApplyService (đính kèm). Business rule: BR-05, BR-11 và
"CV = pdf/doc/docx, tối đa 5 MB" (đính kèm). Mã message: MSG21..MSG24 (đính kèm).
1. Trước tiên liệt kê điều kiện test thành bảng: ID | method | input | expected | rule.
   Dùng phân vùng tương đương và giá trị biên; phủ đủ mọi rule.
2. Sau đó viết MỘT lớp JUnit 5: mock các DAO bằng Mockito, truyền LocalDate cố định,
   đặt tên test method_tình-huống_kết-quả, assert kết quả VÀ verify tác dụng phụ.
3. KHÔNG khẳng định hành vi hiện tại của code nếu nó trái với rule —
   viết test theo rule và đánh dấu "EXPECTED TO FAIL: &lt;lý do&gt;".
4. Liệt kê mọi rule còn mơ hồ thành câu hỏi cho khách hàng.</pre>
<h3>Prompt 2 — integration test case theo màn hình (dòng Template3)</h3>
<p class="nhan">Đính kèm: UI spec của "Apply Job" + "List Apply", UC spec "Apply job", business rule, danh sách message, tài khoản và bài đăng trong dữ liệu demo</p>
<pre>Bạn là tester điền workbook "System Test" cho màn hình "Apply Job".
Xuất một bảng với ĐÚNG các cột:
Test Case ID | Test Case Description | Test Case Procedure | Expected Results | Pre-conditions
Quy tắc:
- ID AJ-01, AJ-02, ...; gom các dòng dưới dòng tiêu đề "Scenario A/B/C".
- Phủ: luồng chính, mọi luồng thay thế và ngoại lệ của UC, mọi validation của field
  (bắt buộc, trống/toàn dấu cách, độ dài tối đa của cột DB, định dạng), mọi business
  rule, và quyền truy cập (role khác, gõ thẳng URL).
- Procedure = các bước đánh số, ghi đúng dữ liệu nhập, dùng dữ liệu demo đính kèm.
- Expected Results = câu message chép từ danh sách message + cái gì được lưu hay không.
- Pre-conditions = tài khoản/role/dữ liệu, hoặc ID của case phải chạy trước.
- Cuối cùng, một danh sách truy vết: bước UC / rule / field -&gt; ID test case.</pre>`),
    bi(`<h3>Prompt 3 — E2E test cases</h3>
<p class="nhan">Attach: the business flow "Recruitment" (post → apply → review → status), PRD roles section, screen flow, UC list, demo accounts per role</p>
<pre>You are a QA lead designing end-to-end tests for the Job IT for Freelancer system.
Roles: Guest, Freelancer, Recruiter, Admin (PRD attached).
From the attached business flows and screen flow, write E2E scenarios that each
cross at least two roles and three screens, e.g. "Recruiter posts a job -&gt;
Freelancer applies -&gt; Recruiter changes the application status -&gt; Freelancer sees it".
For each scenario give: ID | goal | actors | steps (actor, screen, action, data) |
checkpoint after EVERY step (what is visible, what is in the database, which e-mail
arrives in MailTrap) | cleanup.
Include one negative scenario per flow (blocked account, expired post, wrong role).
Rank the scenarios by business risk; keep at most 8.</pre>
<h3>Review AI output before it enters your files</h3>
<ol>
<li><strong>Trace</strong> — every case points to a UC step, a rule or a field; delete cases that point to nothing (AI invents features).</li>
<li><strong>Expected results</strong> — compare with your RDS, not with the running app. If the AI copied the current behaviour, you have just "proved" your bug correct.</li>
<li><strong>Data</strong> — the IDs, accounts and posts must exist in your demo data.</li>
<li><strong>Run</strong> — the JUnit class compiles and fails for the right reason before the fix.</li>
<li><strong>Trim</strong> — ten sharp cases beat forty repetitive ones; the teacher reads them.</li>
</ol>
<h3>Log it in the AI Usage Report (Template5)</h3>
<table>
<thead><tr><th>Column</th><th>Example entry</th></tr></thead>
<tbody>
<tr><td>SDLC Phase · Task</td><td>Testing · Test case generation for "Apply Job"</td></tr>
<tr><td>AI Tool · AI Output</td><td>Claude · 14 test cases + JUnit class with 7 tests</td></tr>
<tr><td>Student's Validation / Modification</td><td>kept 9, rewrote 2 expected results to match MSG list, removed 3 duplicates; added boundary 5 MB</td></tr>
<tr><td>Evidence / Link</td><td>screenshot of prompt + answer, named <code>GroupX_SessionY_TestCases.png</code></td></tr>
<tr><td>Quantitative · Value (1–5) · Risks</td><td>10 cases kept · 4 · "asserted current behaviour for BR-11"</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Pasting AI cases unread.</strong> In the Final Presentation a teacher points at one row and asks why its expected result is right. "The AI wrote it" loses the design and requirement marks (20% each) at once.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Let AI attack your screen.</strong> After your own cases, ask: "Here is the UI spec and the servlet. List 10 inputs most likely to break it (encoding, very long text, SQL metacharacters, double submit, two tabs, back button after submit)." Treat the answers as <em>exploratory test charters</em> — see experience-based testing in <a href="${SWT}" target="_blank" rel="noopener">SWT301 Chapter 6</a>.</div>`,
    `<h3>Prompt 3 — E2E test case</h3>
<p class="nhan">Đính kèm: business flow "Tuyển dụng" (đăng bài → ứng tuyển → duyệt → trạng thái), mục role trong PRD, screen flow, danh sách UC, tài khoản demo cho từng role</p>
<pre>Bạn là QA lead thiết kế test đầu-cuối cho hệ thống Job IT for Freelancer.
Role: Guest, Freelancer, Recruiter, Admin (PRD đính kèm).
Từ business flow và screen flow đính kèm, viết các kịch bản E2E, mỗi kịch bản đi qua
ít nhất hai role và ba màn hình, vd "Recruiter đăng job -&gt; Freelancer ứng tuyển -&gt;
Recruiter đổi trạng thái đơn -&gt; Freelancer thấy trạng thái mới".
Mỗi kịch bản gồm: ID | mục tiêu | actor | các bước (actor, màn hình, thao tác, dữ liệu) |
điểm kiểm sau MỖI bước (thấy gì trên màn hình, có gì trong database, e-mail nào về
MailTrap) | dọn dữ liệu.
Mỗi luồng thêm một kịch bản tiêu cực (tài khoản bị khoá, bài hết hạn, sai role).
Xếp kịch bản theo rủi ro nghiệp vụ; giữ tối đa 8.</pre>
<h3>Soát kết quả AI trước khi đưa vào file</h3>
<ol>
<li><strong>Truy vết</strong> — mỗi case trỏ tới một bước UC, một rule hay một field; xoá case không trỏ tới đâu (AI hay bịa tính năng).</li>
<li><strong>Kết quả mong đợi</strong> — so với RDS, không so với app đang chạy. Nếu AI chép hành vi hiện tại, bạn vừa "chứng minh" bug của mình là đúng.</li>
<li><strong>Dữ liệu</strong> — ID, tài khoản, bài đăng phải có thật trong dữ liệu demo.</li>
<li><strong>Chạy thử</strong> — lớp JUnit biên dịch được và fail đúng lý do trước khi sửa.</li>
<li><strong>Cắt gọt</strong> — mười case sắc bén hơn bốn mươi case lặp lại; giáo viên có đọc.</li>
</ol>
<h3>Ghi vào AI Usage Report (Template5)</h3>
<table>
<thead><tr><th>Cột</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>SDLC Phase · Task</td><td>Testing · Sinh test case cho "Apply Job"</td></tr>
<tr><td>AI Tool · AI Output</td><td>Claude · 14 test case + lớp JUnit 7 test</td></tr>
<tr><td>Student's Validation / Modification</td><td>giữ 9, viết lại 2 kết quả mong đợi cho khớp danh sách MSG, bỏ 3 case trùng; thêm biên 5 MB</td></tr>
<tr><td>Evidence / Link</td><td>ảnh chụp prompt + câu trả lời, đặt tên <code>GroupX_SessionY_TestCases.png</code></td></tr>
<tr><td>Quantitative · Value (1–5) · Risks</td><td>giữ 10 case · 4 · "khẳng định hành vi hiện tại cho BR-11"</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Dán test case AI mà không đọc.</strong> Ở buổi Final Presentation giáo viên chỉ vào một dòng và hỏi vì sao kết quả mong đợi đó đúng. Trả lời "AI viết" là mất cùng lúc điểm thiết kế và điểm phân tích yêu cầu (mỗi phần 20%).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Cho AI tấn công màn hình của bạn.</strong> Sau khi có case của mình, hỏi: "Đây là UI spec và servlet. Liệt kê 10 input dễ làm nó hỏng nhất (encoding, chuỗi rất dài, ký tự đặc biệt của SQL, bấm Submit hai lần, mở hai tab, bấm Back sau khi submit)." Coi câu trả lời là <em>exploratory test charter</em> — xem test dựa trên kinh nghiệm ở <a href="${SWT}" target="_blank" rel="noopener">SWT301 Chương 6</a>.</div>`),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 5 ──────────────────────────────── */
// Options are written with the key in any slot; q() rotates each question by its position so the
// correct answers are spread over A–D (deterministic, the key moves with its option).
let qn = 0;
const q = (question, options, correctIndex, explanation) => {
  const k = qn++ % options.length;
  const opts = [...options.slice(k), ...options.slice(0, k)];
  return { question, options: opts, correctIndex: (correctIndex - k + options.length) % options.length, explanation, points: 1 };
};
const QUIZ5 = {
  title: 'Quiz 5 — Testing & quality|||Quiz 5 — Kiểm thử & chất lượng',
  slug: 'swp391-quiz-5',
  type: 'QUIZ',
  description: '22 câu: hệ số Q và mức L1–L3, nhãn Defect/Leakage, cột và công thức của Template3, ba bẫy công thức, tính coverage, unit test JUnit/Mockito, prompt #9 và AI Usage Report.',
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      q('In SWP391, how does testing affect a member\'s LOC grade?|||Trong SWP391, việc test ảnh hưởng tới điểm LOC của một thành viên thế nào?',
        ['It does not; only the number of screens counts|||Không ảnh hưởng; chỉ số màn hình được tính', 'Through Q, the quality factor in Converted-LOC = C x Q|||Qua Q, hệ số chất lượng trong Converted-LOC = C x Q', 'Through C, the complexity factor|||Qua C, hệ số độ phức tạp', 'Only in the Final Presentation|||Chỉ ở buổi Final Presentation'], 1,
        'Converted-LOC = C x Q. C is the size of the screen; Q (High 100%, Medium 75%, Low 50%) is its quality, which testing proves.|||Converted-LOC = C x Q. C là độ lớn màn hình; Q (High 100%, Medium 75%, Low 50%) là chất lượng, thứ việc test chứng minh.'),
      q('In the Project Tracking template (sheet Refs), a screen that handles both happy and unhappy cases is rated…|||Trong template Project Tracking (sheet Refs), màn hình xử lý cả case suôn sẻ lẫn không suôn sẻ được xếp…',
        ['L1_Happy Cases, 0.5|||L1_Happy Cases, 0.5', 'L2_All Cases, 0.75|||L2_All Cases, 0.75', 'L3_Optimized, 1.0|||L3_Optimized, 1.0', 'Level 5, 180|||Level 5, 180'], 1,
        'L1 = happy cases only (0.5); L2 = happy and unhappy cases (0.75); L3 = all cases plus optimised UX and business logic (1.0).|||L1 = chỉ case suôn sẻ (0.5); L2 = cả case suôn sẻ và không suôn sẻ (0.75); L3 = mọi case cộng UX và logic nghiệp vụ tối ưu (1.0).'),
      q('Which validations does the Policies sheet require on every input?|||Sheet Policies bắt buộc validate gì trên mọi ô nhập?',
        ['Only required fields|||Chỉ ô bắt buộc', 'Required (blank, spaces), Length (longer than the DB column), Format (date, email, phone, image type)|||Required (trống, dấu cách), Length (dài hơn cột DB), Format (ngày, email, SĐT, loại ảnh)', 'Only e-mail format|||Chỉ định dạng email', 'None, validation is optional|||Không, validate là tuỳ chọn'], 1,
        'Policies lists Required, Length and Format checks, and requires search, filter, sort and paging on every data table.|||Policies liệt kê kiểm Required, Length và Format, và bắt mọi bảng dữ liệu có search, filter, sort, paging.'),
      q('A bug in the Apply Job screen is found by your own tester during Round 1. Which GitLab type label does it get?|||Một bug ở màn hình Apply Job do chính tester của nhóm tìm ra ở Round 1. Nó mang nhãn loại nào trên GitLab?',
        ['Leakage|||Leakage', 'Defect|||Defect', 'Q&A|||Q&A', 'Req|||Req'], 1,
        'Defect = error in documents or code found by the team itself. Leakage = found by the customer/teacher after submission.|||Defect = lỗi tài liệu hoặc code do chính nhóm tìm ra. Leakage = khách hàng/giáo viên tìm ra sau khi nộp.'),
      q('During the iteration review the teacher uploads an .exe file as a CV and the system accepts it. The issue is labelled…|||Trong buổi review iteration, giáo viên upload file .exe làm CV và hệ thống nhận. Issue được gắn nhãn…',
        ['Defect, because it is a code error|||Defect, vì là lỗi code', 'Leakage, because the customer found it after submit|||Leakage, vì khách hàng tìm ra sau khi nộp', 'Task|||Task', '3_Done|||3_Done'], 1,
        'An error that escaped the team\'s testing and was found by the teacher after submission is a Leakage.|||Lỗi lọt qua lưới test của nhóm và bị giáo viên tìm ra sau khi nộp là Leakage.'),
      q('What does the status label 3_Done mean for a bug issue?|||Nhãn trạng thái 3_Done có nghĩa gì với một issue bug?',
        ['It can be deleted|||Có thể xoá', 'Fixed, but must be re-checked (re-test) before it is Closed|||Đã sửa, nhưng phải kiểm lại (test lại) rồi mới Closed', 'Waiting to be started|||Đang chờ bắt đầu', 'Rejected by the teacher|||Bị giáo viên từ chối'], 1,
        'Slide 13: 3_Done = handled, needs checking before closing. For a bug the check is re-running the failed test case.|||Slide 13: 3_Done = đã giải quyết, cần kiểm tra lại để đóng. Với bug, kiểm tra là chạy lại test case đã fail.'),
      q('Which four statuses can a test case have in a Template3 round column?|||Một test case trong cột round của Template3 có thể mang bốn trạng thái nào?',
        ['Open, Doing, Done, Closed|||Open, Doing, Done, Closed', 'Passed, Failed, Pending, N/A|||Passed, Failed, Pending, N/A', 'High, Medium, Low, None|||High, Medium, Low, None', 'New, Fixed, Verified, Rejected|||New, Fixed, Verified, Rejected'], 1,
        'The drop-down list (cells R2:R5 of each workflow sheet) is Passed, Failed, Pending, N/A; Pending is the default.|||Danh sách drop-down (ô R2:R5 của mỗi sheet workflow) là Passed, Failed, Pending, N/A; Pending là mặc định.'),
      q('Template3 formula: Test coverage = …|||Công thức Template3: Test coverage = …',
        ['Passed x 100 / Number of TCs|||Passed x 100 / Number of TCs', '(Passed + Failed) x 100 / (Number of TCs - N/A)|||(Passed + Failed) x 100 / (Number of TCs - N/A)', '(Passed + Pending) x 100 / Number of TCs|||(Passed + Pending) x 100 / Number of TCs', 'Failed x 100 / Passed|||Failed x 100 / Passed'], 1,
        'Cell E16: (D14+E14)*100/(H14-G14) — executed cases over in-scope cases. Successful coverage (E17) uses Passed only.|||Ô E16: (D14+E14)*100/(H14-G14) — số case đã chạy trên số case trong phạm vi. Successful coverage (E17) chỉ lấy Passed.'),
      q('Totals: 18 test cases, 10 Passed, 5 Failed, 2 Pending, 1 N/A. What is the test successful coverage?|||Tổng: 18 test case, 10 Passed, 5 Failed, 2 Pending, 1 N/A. Test successful coverage là bao nhiêu?',
        ['55.56%|||55,56%', '58.82%|||58,82%', '88.24%|||88,24%', '83.33%|||83,33%'], 1,
        '10 x 100 / (18 - 1) = 1000 / 17 = 58.82%. (Coverage would be 15 x 100 / 17 = 88.24%.)|||10 x 100 / (18 - 1) = 1000 / 17 = 58,82%. (Coverage sẽ là 15 x 100 / 17 = 88,24%.)'),
      q('Why is N/A subtracted from the denominator of both coverage formulas?|||Vì sao N/A bị trừ khỏi mẫu số của cả hai công thức coverage?',
        ['Because N/A cases always pass|||Vì case N/A luôn pass', 'Because they are out of scope for this release, e.g. a feature the teacher postponed|||Vì chúng nằm ngoài phạm vi bản này, vd tính năng giáo viên cho lùi', 'Because Excel cannot count them|||Vì Excel không đếm được', 'Because they are failed cases|||Vì chúng là case fail'], 1,
        'N/A = cannot or need not run in this release, so it should neither raise nor lower coverage.|||N/A = không thể hoặc không cần chạy trong bản này, nên không được làm tăng hay giảm coverage.'),
      q('The template\'s Number of TCs uses COUNTA(A12:A1000). What goes wrong?|||Ô Number of TCs của template dùng COUNTA(A12:A1000). Sai ở đâu?',
        ['Nothing|||Không sai gì', 'It also counts the "Scenario B/C" header rows, so the total is too high|||Nó đếm cả dòng tiêu đề "Scenario B/C", nên tổng bị cao hơn thật', 'It ignores Failed cases|||Nó bỏ qua case Failed', 'It counts only Round 3|||Nó chỉ đếm Round 3'], 1,
        'The sample sheet has 6 cases but shows 8. Fix: =COUNTA(A11:A1000)-COUNTIF(A11:A1000,"Scenario*").|||Sheet mẫu có 6 case nhưng hiện 8. Sửa: =COUNTA(A11:A1000)-COUNTIF(A11:A1000,"Scenario*").'),
      q('In the template, rows Round 2 and Round 3 of each workflow sheet count column F. Why is that a problem?|||Trong template, dòng Round 2 và Round 3 của mỗi sheet workflow đếm cột F. Vì sao đó là vấn đề?',
        ['Column F is Round 1, so Rounds 2 and 3 just repeat Round 1|||Cột F là Round 1, nên Round 2 và 3 chỉ lặp lại Round 1', 'Column F is the Note column|||Cột F là cột Note', 'COUNTIF cannot count text|||COUNTIF không đếm được chữ', 'It is not a problem|||Không phải vấn đề'], 0,
        'Round 2 results are in column I and Round 3 in column L; the COUNTIF ranges must point there.|||Kết quả Round 2 nằm ở cột I và Round 3 ở cột L; vùng COUNTIF phải trỏ vào đó.'),
      q('Which columns of a Template3 workflow sheet must a stranger be able to follow to repeat a test?|||Những cột nào của sheet workflow Template3 phải đủ để một người lạ làm lại được bài test?',
        ['Test date and Tester|||Test date và Tester', 'Round 1, Round 2, Round 3|||Round 1, Round 2, Round 3', 'Test Case Procedure, Expected Results, Pre-conditions|||Test Case Procedure, Expected Results, Pre-conditions', 'Note only|||Chỉ Note'], 2,
        'Procedure (steps with data), Expected Results (messages, data saved) and Pre-conditions (account, data, earlier case) make a case repeatable.|||Procedure (các bước kèm dữ liệu), Expected Results (message, dữ liệu lưu) và Pre-conditions (tài khoản, dữ liệu, case trước) làm case lặp lại được.'),
      q('A test case fails in Round 1. What should appear in its Note cell?|||Một test case fail ở Round 1. Ô Note của nó nên ghi gì?',
        ['Nothing|||Không gì cả', 'The number of the GitLab Defect issue opened for it|||Số của issue Defect trên GitLab mở cho nó', 'The tester\'s password|||Mật khẩu của tester', 'The word Leakage|||Chữ Leakage'], 1,
        'Every Failed cell links to its Defect issue (e.g. #41) so the fix can be traced and re-tested.|||Mọi ô Failed liên kết tới issue Defect của nó (vd #41) để truy vết bản sửa và test lại.'),
      q('On which build should Round 3 be run?|||Round 3 nên chạy trên bản build nào?',
        ['On each member\'s own branch|||Trên nhánh riêng của từng thành viên', 'On the integrated main commit that will be tagged for the iteration|||Trên commit main đã tích hợp sẽ được gắn tag cho iteration', 'On the teacher\'s computer|||Trên máy của giáo viên', 'Any build, it does not matter|||Bản nào cũng được'], 1,
        'Policies require one integrated source for the demo; the final regression must match exactly what you submit.|||Policies bắt buộc demo trên một source tích hợp; regression cuối phải khớp đúng thứ bạn nộp.'),
      q('Why does JobApplyService.apply() receive "today" as a parameter instead of calling LocalDate.now()?|||Vì sao JobApplyService.apply() nhận "today" làm tham số thay vì gọi LocalDate.now()?',
        ['To make the method faster|||Để method chạy nhanh hơn', 'So tests can pass a fixed date and give the same result every day|||Để test truyền một ngày cố định và cho cùng kết quả mỗi ngày', 'Because MySQL needs it|||Vì MySQL cần', 'Because JUnit forbids LocalDate|||Vì JUnit cấm LocalDate'], 1,
        'A rule that reads the clock inside makes a test that passes today and fails later. Inject time to keep tests deterministic.|||Luật tự đọc đồng hồ bên trong tạo ra test pass hôm nay, fail hôm sau. Truyền thời gian vào để test ổn định.'),
      q('In the service unit test, what is Mockito used for?|||Trong unit test của service, Mockito dùng để làm gì?',
        ['To replace the DAOs so no database is needed and calls can be verified|||Thay các DAO để không cần database và kiểm được các lời gọi', 'To generate the JSP pages|||Sinh các trang JSP', 'To deploy the WAR file|||Deploy file WAR', 'To send e-mails|||Gửi e-mail'], 0,
        'Mocks isolate the rule being tested; verify(applyDao, never()).insert(any()) proves nothing was saved.|||Mock cô lập luật đang được test; verify(applyDao, never()).insert(any()) chứng minh không có gì được lưu.'),
      q('The CV limit is 5 MB (5 242 880 bytes). Which pair of inputs are the boundary values?|||Giới hạn CV là 5 MB (5 242 880 byte). Cặp input nào là giá trị biên?',
        ['1 000 and 12 000 000 bytes|||1 000 và 12 000 000 byte', '5 242 880 and 5 242 881 bytes|||5 242 880 và 5 242 881 byte', '0 and 1 byte only|||Chỉ 0 và 1 byte', '5 000 000 and 6 000 000 bytes|||5 000 000 và 6 000 000 byte'], 1,
        'Boundary value analysis tests the last valid value and the first invalid one.|||Phân tích giá trị biên test giá trị hợp lệ cuối cùng và giá trị không hợp lệ đầu tiên.'),
      q('Why should DAO tests use a separate schema such as jobit_test?|||Vì sao test DAO nên dùng một schema riêng như jobit_test?',
        ['It is faster to type|||Gõ nhanh hơn', 'Tests delete and insert rows before each run and must not destroy the demo data|||Test xoá và chèn dữ liệu trước mỗi lần chạy và không được phá dữ liệu demo', 'MySQL allows only one test per schema|||MySQL chỉ cho một test mỗi schema', 'The teacher requires the name jobit_test|||Giáo viên bắt đặt tên jobit_test'], 1,
        '@BeforeEach resets the rows; running that on the demo database would wipe the data the teacher will use.|||@BeforeEach làm sạch dữ liệu; chạy trên database demo sẽ xoá mất dữ liệu giáo viên dùng.'),
      q('For which test type does prompt #9\'s answer require the UI specification of the screen plus the UC exception flows?|||Theo câu trả lời cho prompt #9, loại test nào cần UI spec của màn hình cùng các luồng ngoại lệ của UC?',
        ['Unit tests|||Unit test', 'Integration tests by screen|||Integration test theo màn hình', 'Load tests|||Load test', 'None|||Không loại nào'], 1,
        'Screen-level cases come from fields, validations, messages, states and RBAC of the UI spec, and the flows of the UC spec.|||Case mức màn hình lấy từ field, validation, message, trạng thái và RBAC của UI spec, cùng các luồng của UC spec.'),
      q('An AI tool writes a test whose expected result copies what your code currently does, and it contradicts BR-11. What do you do?|||Công cụ AI viết một test có kết quả mong đợi chép đúng hành vi hiện tại của code, và nó trái với BR-11. Bạn làm gì?',
        ['Keep it; the test passes|||Giữ; test đang pass', 'Rewrite the expected result from the requirement and open a Defect for the code|||Viết lại kết quả mong đợi theo yêu cầu và mở một Defect cho code', 'Delete BR-11 from the RDS|||Xoá BR-11 khỏi RDS', 'Mark the test N/A|||Đánh dấu test là N/A'], 1,
        'Tests are written from requirements. A test that asserts buggy behaviour "proves" the bug correct.|||Test viết từ yêu cầu. Test khẳng định hành vi có bug là "chứng minh" bug đó đúng.'),
      q('Which Template5 AI Usage Report column records how you checked and changed the AI output?|||Cột nào của Template5 AI Usage Report ghi lại cách bạn kiểm và sửa kết quả AI?',
        ['AI Tool Used|||AI Tool Used', 'Value Added (1-5)|||Value Added (1-5)', 'Student\'s Validation / Modification|||Student\'s Validation / Modification', 'SDLC Phase|||SDLC Phase'], 2,
        'Example: "kept 9, rewrote 2 expected results, removed 3 duplicates". Evidence/Link holds the screenshots of prompt and answer.|||Ví dụ: "giữ 9, viết lại 2 kết quả mong đợi, bỏ 3 case trùng". Evidence/Link chứa ảnh chụp prompt và câu trả lời.'),
    ],
  },
};

export default {
  title: 'Chapter 5 — Testing & quality|||Chương 5 — Kiểm thử & chất lượng',
  description: 'Kiểm thử trong đồ án SWP391: mức chất lượng Q, nhãn Defect/Leakage, Template3 System Test từng cột với ví dụ Apply Job 10 test case, unit test JUnit cho DAO/service và prompt #9 sinh test case bằng AI.',
  lessons: [L51, L52, L53, L54, QUIZ5],
};
