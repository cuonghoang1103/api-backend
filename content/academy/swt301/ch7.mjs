/**
 * SWT301 · Chapter 7 — Test management.
 * Source: SWT5_tim.pptx (101 visible slides; hidden pptx slides 25 and 60 are
 * summarised in text — the hidden slide 60 is a full execution-schedule
 * question whose table was read from ppt/media/image11.png) + the teacher's
 * speaker notes. The old SWT5 PDF (90 pages) is outdated; the .pptx is the source.
 * Lesson split follows the deck's own CONTENT slides:
 *   7.1 Test organisation & independence      slides 1–24   (+ hidden pptx 25)
 *   7.2 Test planning & estimation            slides 25–58  (+ hidden pptx 60)
 *   7.3 Monitoring & control, metrics, reports slides 59–73
 *   7.4 Configuration management              slides 74–78
 *   7.5 Risk & testing                        slides 79–88
 *   7.6 Defect (incident) management          slides 89–101
 *   7.7 More from the 2023 slide set          old SWT5.ppt (deck oswt5), NEW/PARTIAL pages 4–50
 * Every schedule / estimate / risk / metric number in the worked examples was
 * computed by a script (scratchpad ch7/sched.mjs and ch7/calc.mjs) and the
 * output is quoted as printed.
 * Answers follow the ISTQB CTFL 2018 (v3.1) syllabus, which the deck follows.
 */
import { walk, walkHead, books, bi, ansEn as AE, ansVi as AV } from './_slides.mjs';

const D = 'swt5';

/* ─────────────────────── 7.1 Test organisation & independence ─────────────────────── */
const L71 = {
  title: '7.1 — Test organisation: independence, test manager & tester|||7.1 — Tổ chức kiểm thử: tính độc lập, test manager & tester',
  slug: 'swt301-test-organisation',
  type: 'VIDEO',
  description: 'SWT5 slide 1–24: bản đồ Chương 5, các mức độc lập của kiểm thử (dev tự test → bên thứ ba), ưu/nhược từng mức, nhiệm vụ test manager vs tester, kỹ năng cần có — kèm đáp án 4 câu hỏi trên slide và 1 slide ẩn.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.1 · SWT5 slides 1–24</span>
<h2>Test organisation — who tests, and how independent are they?</h2>
<p class="lead">The deck <em>SWT5</em> is "Chapter 5 — Test Management" of the ISTQB Foundation syllabus (on this site it is Chapter 7, because the course splits the big test-design chapter in three). The first block answers two organisational questions: <strong>how independent</strong> should the people who test be, and <strong>what does a test manager do</strong> compared with a tester?</p>
<div class="callout"><strong>Syllabus learning objectives.</strong>
<ul>
<li><strong>LO-5.1.1</strong> Explain the benefits and drawbacks of independent testing (K2)</li>
<li><strong>LO-5.1.2</strong> Identify the tasks of a test manager and tester (K1)</li>
</ul>
The whole test-management chapter carries <strong>9 of the 40</strong> questions in the ISTQB exam (SWT0 slide 7) — the second-largest share after test techniques.</div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Level of independence (low → high)</th><th>Typical use</th><th>Key pro</th><th>Key con</th></tr></thead>
<tbody>
<tr><td>1 Developer tests own code</td><td>component testing</td><td>knows the code, fixes cheaply</td><td>not objective — "sees" what he expects</td></tr>
<tr><td>2 Tester(s) inside the dev team</td><td>Agile teams, component integration</td><td>same goal, close to developers</td><td>peer pressure, a single view</td></tr>
<tr><td>3 Test team outside the dev team</td><td>system testing (traditional projects)</td><td>dedicated, objective, consistent</td><td>"over the wall", developers stop caring about quality</td></tr>
<tr><td>4 Internal specialists / test consultants</td><td>usability, security, performance…</td><td>deep expertise, broad view</td><td>influence, not authority</td></tr>
<tr><td>5 Third-party organisation</td><td>outsourced or certification testing</td><td>independent of internal politics</td><td>lacks product knowledge, expensive</td></tr>
</tbody>
</table>
<p><strong>Two roles in the syllabus:</strong> the <em>test manager</em> (test leader) plans, monitors and controls; the <em>tester</em> analyses, designs, implements and executes tests.</p>`,
    `<span class="eyebrow">Chương 7 · Bài 7.1 · SWT5 slide 1–24</span>
<h2>Tổ chức kiểm thử — ai test, và độc lập tới mức nào?</h2>
<p class="lead">Bộ slide <em>SWT5</em> là "Chapter 5 — Test Management" của syllabus ISTQB Foundation (trên trang này là Chương 7, vì môn học tách chương kỹ thuật thiết kế test rất lớn thành ba chương). Khối đầu tiên trả lời hai câu hỏi về tổ chức: người làm kiểm thử nên <strong>độc lập tới đâu</strong>, và <strong>test manager làm gì</strong> khác với tester?</p>
<div class="callout"><strong>Chuẩn đầu ra theo syllabus.</strong>
<ul>
<li><strong>LO-5.1.1</strong> Giải thích lợi ích và hạn chế của kiểm thử độc lập (K2)</li>
<li><strong>LO-5.1.2</strong> Nhận diện nhiệm vụ của test manager và tester (K1)</li>
</ul>
Cả chương quản lý kiểm thử chiếm <strong>9/40</strong> câu trong đề ISTQB (SWT0 slide 7) — nhiều thứ hai, chỉ sau kỹ thuật thiết kế test.</div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Mức độc lập (thấp → cao)</th><th>Thường dùng khi</th><th>Ưu điểm chính</th><th>Nhược điểm chính</th></tr></thead>
<tbody>
<tr><td>1 Developer tự test code của mình</td><td>component testing</td><td>hiểu code, sửa rẻ</td><td>thiếu khách quan — "thấy" cái mình mong đợi</td></tr>
<tr><td>2 Tester nằm trong nhóm dev</td><td>nhóm Agile, component integration</td><td>chung mục tiêu, gần developer</td><td>áp lực đồng nghiệp, chỉ một góc nhìn</td></tr>
<tr><td>3 Nhóm test ngoài nhóm dev</td><td>system testing (dự án truyền thống)</td><td>chuyên trách, khách quan, nhất quán</td><td>"ném qua tường", developer thôi quan tâm chất lượng</td></tr>
<tr><td>4 Chuyên gia/tư vấn test nội bộ</td><td>usability, bảo mật, hiệu năng…</td><td>chuyên môn sâu, nhìn toàn cục</td><td>chỉ có ảnh hưởng, không có quyền</td></tr>
<tr><td>5 Tổ chức bên thứ ba</td><td>thuê ngoài, kiểm định</td><td>không dính chính trị nội bộ</td><td>thiếu hiểu biết sản phẩm, đắt</td></tr>
</tbody>
</table>
<p><strong>Hai vai trò trong syllabus:</strong> <em>test manager</em> (test leader) lập kế hoạch, giám sát và kiểm soát; <em>tester</em> phân tích, thiết kế, triển khai và thực thi test.</p>`),
    walkHead(D, 1, 24, 'The mind-map slide (3) comes back as a divider before every section (5, 26, 41, 46, 60, 75, 80, 90); after its first appearance we only note what it highlights.', 'Slide sơ đồ tư duy (3) lặp lại làm vách ngăn trước mỗi phần (5, 26, 41, 46, 60, 75, 80, 90); từ lần thứ hai chỉ ghi chú nó đang nhấn vào phần nào.'),
    walk(D, [
      [1, 'Test Management — Chapter 5 (cover)',
        `<p class="y-chinh">🎯 Chapter 5 of the ISTQB syllabus — <strong>Test Management</strong> — which is Chapter 7 on this site.</p>
<ul>
<li><strong>The picture</strong> — the familiar six-box map of the ISTQB syllabus, with box <strong>5 Management</strong> highlighted.</li>
<li><strong>Teacher's note</strong> — it simply translates the first box ("Principles: Nguyên tắc").</li>
<li><strong>Numbering shift</strong> — ISTQB Chapter 5 = this site's Chapter 7; the exam questions still say "Chapter 5".</li>
</ul>`,
        `<p class="y-chinh">🎯 Chương 5 của syllabus ISTQB — <strong>Test Management</strong> — chính là Chương 7 trên trang này.</p>
<ul>
<li><strong>Hình trên slide</strong> — sơ đồ sáu ô quen thuộc của syllabus ISTQB, ô <strong>5 Management</strong> được tô màu.</li>
<li><strong>Ghi chú của thầy/cô</strong> — chỉ dịch ô đầu tiên ("Principles: Nguyên tắc").</li>
<li><strong>Độ lệch số chương</strong> — Chapter 5 của ISTQB = Chương 7 trên trang này; câu hỏi thi vẫn ghi "Chapter 5".</li>
</ul>`],
      [2, 'CONTENT',
        `<p class="y-chinh">🎯 The chapter has six sections — each one becomes one lesson here.</p>
<ol>
<li><strong>Test organisation</strong> — lesson 7.1</li>
<li><strong>Test planning &amp; estimation</strong> — lesson 7.2</li>
<li><strong>Test monitoring &amp; control</strong> — lesson 7.3</li>
<li><strong>Configuration management</strong> — lesson 7.4</li>
<li><strong>Risk &amp; testing</strong> — lesson 7.5</li>
<li><strong>Defect management</strong> — lesson 7.6</li>
</ol>
<p>After the six lessons comes Quiz 7.</p>`,
        `<p class="y-chinh">🎯 Chương có sáu phần — mỗi phần là một bài ở đây.</p>
<ol>
<li><strong>Tổ chức kiểm thử</strong> — bài 7.1</li>
<li><strong>Lập kế hoạch &amp; ước lượng</strong> — bài 7.2</li>
<li><strong>Giám sát &amp; kiểm soát</strong> — bài 7.3</li>
<li><strong>Quản lý cấu hình</strong> — bài 7.4</li>
<li><strong>Rủi ro &amp; kiểm thử</strong> — bài 7.5</li>
<li><strong>Quản lý defect</strong> — bài 7.6</li>
</ol>
<p>Sau sáu bài là Quiz 7.</p>`],
      [3, 'Mind map of Chapter 5',
        `<p class="y-chinh">🎯 The whole chapter on one page — worth printing and redrawing from memory.</p>
<p>The branches grow from the pink centre "Chap 5 – Test Management":</p>
<p class="nhan">1 · Test Organisation</p>
<ul>
<li>Independence level</li>
<li>Test Leader (Mgt.)</li>
<li>Tester (Execution)</li>
</ul>
<p class="nhan">2 · Planning &amp; Estimation — three sub-branches</p>
<ul>
<li><strong>Test Strategy</strong> — Analytical, Model-based, Methodical, Process-/Standard-compliant, Directed/Consultative, Regression-averse, Reactive/Dynamic.</li>
<li><strong>Test Effort Factors</strong> — Product, Development-process, People characteristics, Test results.</li>
<li><strong>Estimation Techniques</strong> — Metric-based (burn-down chart, defect-removal model) and Expert-based (planning poker, Wideband Delphi).</li>
</ul>
<p class="nhan">3–6 · The remaining branches</p>
<ul>
<li><strong>Monitoring &amp; Control</strong></li>
<li><strong>Configuration Mgt.</strong></li>
<li><strong>Risk &amp; Testing</strong> — Project risk &amp; product risk, Likelihood vs impact.</li>
<li><strong>Defect Mgt.</strong> — Steps to reproduce, Expected &amp; actual result, Severity &amp; priority, Screenshot.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> if you can redraw this map from memory, you know the chapter's skeleton.</p>`,
        `<p class="y-chinh">🎯 Cả chương trên một trang — nên in ra và tập vẽ lại không cần nhìn.</p>
<p>Các nhánh mọc ra từ tâm màu hồng "Chap 5 – Test Management":</p>
<p class="nhan">1 · Test Organisation</p>
<ul>
<li>Mức độc lập (Independence level)</li>
<li>Test Leader (quản lý)</li>
<li>Tester (thực thi)</li>
</ul>
<p class="nhan">2 · Planning &amp; Estimation — ba nhánh con</p>
<ul>
<li><strong>Test Strategy</strong> — Analytical, Model-based, Methodical, Process-/Standard-compliant, Directed/Consultative, Regression-averse, Reactive/Dynamic.</li>
<li><strong>Test Effort Factors</strong> — đặc điểm sản phẩm, quy trình phát triển, con người, kết quả test.</li>
<li><strong>Estimation Techniques</strong> — Metric-based (burn-down chart, defect-removal model) và Expert-based (planning poker, Wideband Delphi).</li>
</ul>
<p class="nhan">3–6 · Các nhánh còn lại</p>
<ul>
<li><strong>Monitoring &amp; Control</strong></li>
<li><strong>Configuration Mgt.</strong></li>
<li><strong>Risk &amp; Testing</strong> — rủi ro dự án &amp; rủi ro sản phẩm, khả năng xảy ra vs tác động.</li>
<li><strong>Defect Mgt.</strong> — bước tái hiện, kết quả mong đợi &amp; thực tế, severity &amp; priority, ảnh chụp màn hình.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> vẽ lại được sơ đồ này không cần nhìn là bạn đã nắm khung xương của chương.</p>`],
      [4, 'CONTENT — Test Organisation',
        `<p class="y-chinh">🎯 Section 1 has two sub-topics, with two different exam levels.</p>
<ul>
<li><strong>Benefits &amp; drawbacks of independent testing</strong> — LO-5.1.1, K2: you must be able to <em>explain</em>, so expect "which is a benefit/drawback" questions.</li>
<li><strong>Tasks of test managers &amp; testers</strong> — LO-5.1.2, K1: recognise which task belongs to which role.</li>
</ul>`,
        `<p class="y-chinh">🎯 Phần 1 có hai ý, ứng với hai mức đề thi khác nhau.</p>
<ul>
<li><strong>Lợi ích &amp; hạn chế của kiểm thử độc lập</strong> — LO-5.1.1, K2: phải <em>giải thích</em> được, nên chờ câu kiểu "đâu là lợi ích/hạn chế".</li>
<li><strong>Nhiệm vụ của test manager &amp; tester</strong> — LO-5.1.2, K1: nhận ra việc nào thuộc vai trò nào.</li>
</ul>`],
      [5, 'Mind map (divider)',
        `<p class="y-chinh">🎯 The map of slide 3 again, as the section divider — now look at the top-left branch.</p>
<ul>
<li><em>Independence level</em></li>
<li><em>Test Leader (Mgt.)</em></li>
<li><em>Tester (Execution)</em></li>
</ul>`,
        `<p class="y-chinh">🎯 Lại sơ đồ của slide 3, dùng làm vách ngăn phần — giờ nhìn nhánh góc trên bên trái.</p>
<ul>
<li><em>Independence level</em></li>
<li><em>Test Leader (Mgt.)</em></li>
<li><em>Tester (Execution)</em></li>
</ul>`],
      [6, 'Independence Testing — faults found over time',
        `<p class="y-chinh">🎯 Without an outside view, users find a second wave of defects after release.</p>
<p class="nhan">Reading the chart</p>
<ul>
<li><strong>Axes</strong> — <strong>number of faults found</strong> against <strong>time</strong>, with a vertical line at "Release to end users".</li>
<li><strong>Yellow curve = expectation</strong> — faults found rise, peak during testing, then fall; only a trickle remains after release.</li>
<li><strong>Purple curve = reality</strong> in many projects — after release a second hump appears: users find many defects the team missed.</li>
</ul>
<p class="nhan">Two common remedies (teacher's notes)</p>
<ol>
<li><strong>Client representatives on site</strong> throughout development.</li>
<li><strong>Test suites provided by the client</strong>.</li>
</ol>
<p>Both inject a view different from the builders' — which is exactly what independence means.</p>`,
        `<p class="y-chinh">🎯 Thiếu góc nhìn từ bên ngoài, người dùng sẽ tìm ra "làn sóng" defect thứ hai sau phát hành.</p>
<p class="nhan">Đọc biểu đồ</p>
<ul>
<li><strong>Hai trục</strong> — <strong>số lỗi tìm được</strong> theo <strong>thời gian</strong>, có vạch dọc "Release to end users" (phát hành cho người dùng).</li>
<li><strong>Đường vàng = kỳ vọng</strong> — số lỗi tìm được tăng, đạt đỉnh trong lúc test rồi giảm; sau phát hành chỉ còn lác đác.</li>
<li><strong>Đường tím = thực tế</strong> ở nhiều dự án — sau phát hành mọc thêm một "cái bướu" thứ hai: người dùng tìm ra rất nhiều defect mà nhóm bỏ sót.</li>
</ul>
<p class="nhan">Hai cách khắc phục thường gặp (ghi chú của thầy/cô)</p>
<ol>
<li><strong>Để đại diện khách hàng ngồi cùng</strong> suốt quá trình phát triển.</li>
<li><strong>Chạy bộ test do khách hàng cung cấp</strong>.</li>
</ol>
<p>Cả hai đều đưa vào một góc nhìn khác với người xây dựng — đó chính là ý nghĩa của tính độc lập.</p>`],
      [7, 'Independence Testing — definition',
        `<p class="y-chinh">🎯 Some independence helps find defects — but it never replaces knowing the code.</p>
<p class="nhan">Two sentences straight from the syllabus</p>
<ol>
<li><strong>A certain degree of independence</strong> makes the tester more effective at finding defects, because author and tester have <strong>different cognitive biases</strong>. The author unconsciously tests the paths he designed; the outsider questions the assumptions.</li>
<li><strong>Independence is not a replacement for familiarity</strong> — developers can efficiently find many defects in their own code.</li>
</ol>
<p>So the right answer is a mix, never "only independent testers". The teacher's Vietnamese note says the same.</p>`,
        `<p class="y-chinh">🎯 Một chút độc lập giúp tìm lỗi tốt hơn — nhưng không bao giờ thay được sự am hiểu code.</p>
<p class="nhan">Hai câu lấy nguyên văn từ syllabus</p>
<ol>
<li><strong>Một mức độc lập nhất định</strong> giúp tester tìm defect hiệu quả hơn, vì tác giả và tester có <strong>thiên kiến nhận thức khác nhau</strong>. Tác giả vô thức chỉ test các đường mình đã nghĩ ra; người ngoài thì đặt câu hỏi với chính các giả định.</li>
<li><strong>Tính độc lập không thay thế được sự am hiểu</strong> — developer vẫn tìm được rất nhiều lỗi trong code của chính mình một cách hiệu quả.</li>
</ol>
<p>Vì vậy đáp án đúng luôn là phối hợp, không bao giờ là "chỉ tester độc lập". Ghi chú tiếng Việt của thầy/cô cũng nói đúng như vậy.</p>`],
      [8, 'Independence Degree of Testing (inverted triangle)',
        `<p class="y-chinh">🎯 Five levels of independence, from the developer alone up to a third party.</p>
<p>An inverted pink triangle with an arrow "Level of Independence" pointing up.</p>
<p class="nhan">From the bottom (least) to the top (most independent)</p>
<ol>
<li><strong>Developer's sole responsibility</strong></li>
<li><strong>Tester(s) in dev team</strong></li>
<li><strong>Testers outside dev team</strong></li>
<li><strong>Internal specialised testers / test consultants</strong></li>
<li><strong>Third party outside organisation</strong></li>
</ol>
<p class="nhan">The same ladder in syllabus words</p>
<ol>
<li>No independent testers.</li>
<li>Independent developers or testers within the development team.</li>
<li>An independent test team inside the organisation.</li>
<li>Independent testers from the business/user community, or specialists in specific test types.</li>
<li>External testers.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> questions like "Which is the LOWEST/HIGHEST level of independence?" are answered straight from this picture.</p>`,
        `<p class="y-chinh">🎯 Năm mức độc lập, từ developer tự test lên tới bên thứ ba.</p>
<p>Tam giác ngược màu hồng với mũi tên "Level of Independence" chỉ lên.</p>
<p class="nhan">Từ dưới (ít nhất) lên trên (độc lập nhất)</p>
<ol>
<li><strong>Developer tự chịu trách nhiệm</strong></li>
<li><strong>Tester trong nhóm dev</strong></li>
<li><strong>Tester ngoài nhóm dev</strong></li>
<li><strong>Tester chuyên trách/tư vấn test nội bộ</strong></li>
<li><strong>Bên thứ ba ngoài tổ chức</strong></li>
</ol>
<p class="nhan">Cùng bậc thang, theo lời syllabus</p>
<ol>
<li>Không có tester độc lập.</li>
<li>Developer hoặc tester độc lập trong nhóm phát triển.</li>
<li>Nhóm test độc lập trong tổ chức.</li>
<li>Tester độc lập từ phía nghiệp vụ/người dùng, hoặc chuyên gia về một loại test.</li>
<li>Tester bên ngoài.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> câu hỏi "mức độc lập THẤP/CAO nhất là gì?" trả lời thẳng từ hình này.</p>`],
      [9, 'Testing by Developers',
        `<p class="y-chinh">🎯 Level 1 — developers test their own code: cheap and knowledgeable, but not objective.</p>
<p class="nhan">Pros</p>
<ul>
<li><strong>Know the code best</strong></li>
<li><strong>Can find problems testers might miss</strong> — internal logic, error handling.</li>
<li><strong>Find and fix faults cheaply</strong> — no report, no hand-over.</li>
</ul>
<p class="nhan">Cons</p>
<ul>
<li><strong>Difficult to destroy your own work</strong></li>
<li><strong>Tendency to "see" expected results</strong> instead of actual results (confirmation bias).</li>
<li><strong>Subjective assessment</strong></li>
</ul>
<p class="ghi-chu">Teacher's note: this level is typical for <strong>unit (component) testing and component integration testing</strong>.</p>`,
        `<p class="y-chinh">🎯 Mức 1 — developer tự test code của mình: rẻ và hiểu sâu, nhưng thiếu khách quan.</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Hiểu code rõ nhất</strong></li>
<li><strong>Tìm được vấn đề mà tester có thể bỏ sót</strong> — logic bên trong, xử lý lỗi.</li>
<li><strong>Tìm và sửa lỗi rất rẻ</strong> — không cần báo cáo, không cần bàn giao.</li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Khó "phá" sản phẩm của chính mình</strong></li>
<li><strong>Có xu hướng "nhìn thấy" kết quả mong đợi</strong> thay vì kết quả thực tế (thiên kiến xác nhận).</li>
<li><strong>Đánh giá mang tính chủ quan</strong></li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô: mức này hay gặp ở <strong>unit (component) testing và component integration testing</strong>.</p>`],
      [10, 'Tester(s) in Development Team',
        `<p class="y-chinh">🎯 Level 2 — a tester inside the development team: close to the developers, but under their pressure.</p>
<p class="nhan">Pros</p>
<ul>
<li><strong>Independent view</strong> of the software.</li>
<li><strong>Dedicated to testing</strong> — no development duties.</li>
<li><strong>Part of the team</strong> — working towards the same goal (quality).</li>
</ul>
<p class="nhan">Cons</p>
<ul>
<li><strong>Lack of respect</strong> — the "only" tester among developers.</li>
<li><strong>A lonely, thankless task</strong></li>
<li><strong>Corruptible</strong> — peer pressure can make the tester soften bad news about teammates' code.</li>
<li><strong>A single view/opinion</strong></li>
</ul>
<p class="ghi-chu">Notes: typical in unit/integration testing, and very common in <strong>Agile</strong> projects, where testers sit inside the Scrum team.</p>`,
        `<p class="y-chinh">🎯 Mức 2 — tester nằm trong nhóm phát triển: gần developer, nhưng cũng chịu áp lực từ họ.</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Có góc nhìn độc lập</strong> về phần mềm.</li>
<li><strong>Chuyên tâm test</strong> — không phải code.</li>
<li><strong>Là thành viên của nhóm</strong> — cùng hướng tới một mục tiêu (chất lượng).</li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Thiếu sự tôn trọng</strong> — người tester "duy nhất" giữa đám developer.</li>
<li><strong>Công việc cô đơn, ít được ghi nhận</strong></li>
<li><strong>Dễ bị tác động</strong> — áp lực đồng nghiệp khiến tester nói nhẹ đi tin xấu về code của đồng đội.</li>
<li><strong>Chỉ có một góc nhìn</strong></li>
</ul>
<p class="ghi-chu">Ghi chú: hay gặp ở unit/integration testing, và rất phổ biến trong dự án <strong>Agile</strong>, nơi tester ngồi ngay trong Scrum team.</p>`],
      [11, 'Tester(s) outside Development Team',
        `<p class="y-chinh">🎯 Level 3 — a separate test team: objective and consistent, but at risk of "over the wall".</p>
<p class="nhan">Pros</p>
<ul>
<li><strong>A dedicated team</strong> just for testing.</li>
<li><strong>Specialist testing expertise</strong></li>
<li><strong>More objective and more consistent</strong> testing.</li>
</ul>
<p class="nhan">Cons</p>
<ul>
<li><strong>"Over the wall" syndrome</strong> — the cartoon shows departments (marketing, design, engineering, manufacturing) each throwing the product over a wall to the next, with a wreck at the end: nobody talks, each side just hands over.</li>
<li><strong>Antagonistic/confrontational</strong> — the relationship may turn into a fight.</li>
<li><strong>Over-reliance on testers</strong> — developers test less because "QA will catch it".</li>
</ul>
<p class="ghi-chu">Notes: typical of <strong>traditional</strong> (sequential) projects, usually at system-test level.</p>`,
        `<p class="y-chinh">🎯 Mức 3 — nhóm test riêng: khách quan và nhất quán, nhưng dễ mắc hội chứng "ném qua tường".</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Có nhóm chỉ chuyên test</strong></li>
<li><strong>Chuyên môn kiểm thử sâu</strong></li>
<li><strong>Kiểm thử khách quan và nhất quán hơn</strong></li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Hội chứng "ném qua tường"</strong> — tranh vẽ các phòng ban (marketing, thiết kế, kỹ thuật, sản xuất) lần lượt ném sản phẩm qua bức tường cho bên kế tiếp, cuối cùng là một đống đổ nát: không ai nói chuyện với ai, chỉ bàn giao.</li>
<li><strong>Dễ đối đầu</strong> — quan hệ hai bên có thể thành căng thẳng.</li>
<li><strong>Ỷ lại vào tester</strong> — developer test ít đi vì "đã có QA bắt lỗi".</li>
</ul>
<p class="ghi-chu">Ghi chú: điển hình ở dự án <strong>truyền thống</strong> (tuần tự), thường ở cấp system test.</p>`],
      [12, 'Internal Specialised Testers / Test Consultants',
        `<p class="y-chinh">🎯 Level 4 — internal specialists / test consultants: deep expertise, but only influence, not authority.</p>
<p class="nhan">Pros</p>
<ul>
<li><strong>Highly specialist expertise</strong> — supports and improves the testing done by everyone.</li>
<li><strong>Better planning, estimation and control</strong> — thanks to a broad view of testing across the organisation.</li>
</ul>
<p class="nhan">Cons</p>
<ul>
<li><strong>Someone still has to do the testing</strong></li>
<li><strong>Is their level of expertise enough?</strong></li>
<li><strong>They need good people skills</strong> — communication.</li>
<li><strong>Influence, not authority</strong> — they advise, they cannot order.</li>
</ul>
<p class="ghi-chu">The teacher adds with a smile: officially it is "support/consultation", in reality it is often closer to <em>invigilation</em> (checking on the teams).</p>`,
        `<p class="y-chinh">🎯 Mức 4 — chuyên gia/tư vấn test nội bộ: chuyên môn sâu, nhưng chỉ có ảnh hưởng, không có quyền.</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Chuyên môn rất sâu</strong> — hỗ trợ và nâng chất lượng kiểm thử của mọi người.</li>
<li><strong>Lập kế hoạch, ước lượng và kiểm soát tốt hơn</strong> — nhờ nhìn bao quát kiểm thử trong cả tổ chức.</li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Vẫn phải có người trực tiếp test</strong></li>
<li><strong>Chuyên môn của họ có đủ không?</strong></li>
<li><strong>Cần kỹ năng làm việc với người</strong> — giao tiếp tốt.</li>
<li><strong>Ảnh hưởng, không phải quyền hạn</strong> — khuyên được, không ra lệnh được.</li>
</ul>
<p class="ghi-chu">Thầy/cô đùa trong ghi chú: trên giấy là "hỗ trợ/tư vấn", thực tế nhiều khi giống <em>giám thị</em> đi kiểm tra các nhóm hơn.</p>`],
      [13, 'Outside Organisation (3rd Party)',
        `<p class="y-chinh">🎯 Level 5 — a third-party organisation: expert and politically neutral, but outside the company.</p>
<p class="nhan">Pros</p>
<ul>
<li><strong>Highly specialist expertise</strong> — if outsourced to a good organisation.</li>
<li><strong>Independent of internal politics</strong></li>
</ul>
<p class="nhan">Cons</p>
<ul>
<li><strong>Lack of company and product knowledge</strong></li>
<li><strong>The expertise leaves</strong> the company when the contract ends.</li>
<li><strong>Possibly expensive</strong></li>
</ul>
<p class="nhan">Two good scenarios (teacher's notes)</p>
<ol>
<li><strong>Non-functional testing</strong> — performance or security testing by a specialist firm that already owns the equipment, tools and procedures.</li>
<li><strong>Economics</strong> — paying per project can be cheaper than keeping permanent test staff.</li>
</ol>`,
        `<p class="y-chinh">🎯 Mức 5 — tổ chức bên thứ ba: chuyên sâu và trung lập, nhưng đứng ngoài công ty.</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Chuyên môn rất sâu</strong> — nếu thuê đúng đơn vị tốt.</li>
<li><strong>Không dính tới chính trị nội bộ</strong></li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Thiếu hiểu biết về công ty và sản phẩm</strong></li>
<li><strong>Kinh nghiệm đi ra ngoài</strong> công ty khi hết hợp đồng.</li>
<li><strong>Có thể đắt</strong></li>
</ul>
<p class="nhan">Hai tình huống hợp lý (ghi chú của thầy/cô)</p>
<ol>
<li><strong>Kiểm thử phi chức năng</strong> — test hiệu năng hay bảo mật do công ty chuyên trách làm, họ có sẵn thiết bị, công cụ và quy trình.</li>
<li><strong>Bài toán kinh tế</strong> — trả tiền theo dự án có thể rẻ hơn nuôi nhân sự test cố định.</li>
</ol>`],
      [14, 'Usual choices per test level',
        `<p class="y-chinh">🎯 Who usually tests at each level — independence grows as you climb the V-model.</p>
<ul>
<li><strong>Component testing</strong> — the programmers themselves (or a "buddy", another developer).</li>
<li><strong>Component integration testing</strong> — a "poorly defined activity": often nobody owns it clearly, so it falls between developers and testers. This is a warning, not a recommendation.</li>
<li><strong>System testing</strong> — often an independent test team.</li>
<li><strong>Acceptance testing</strong> — the users (with technical help), mainly as a <em>demonstration for confidence</em> rather than a defect hunt.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ai thường test ở mỗi cấp — độ độc lập tăng dần khi đi lên mô hình chữ V.</p>
<ul>
<li><strong>Component testing</strong> — chính lập trình viên (hoặc một "bạn cặp", developer khác).</li>
<li><strong>Component integration testing</strong> — là "hoạt động không được định nghĩa rõ": thường không ai sở hữu hẳn nên rơi vào khoảng giữa developer và tester. Đây là lời cảnh báo, không phải khuyến nghị.</li>
<li><strong>System testing</strong> — thường do nhóm test độc lập.</li>
<li><strong>Acceptance testing</strong> — người dùng (có hỗ trợ kỹ thuật), chủ yếu để <em>trình diễn tạo niềm tin</em> hơn là săn lỗi.</li>
</ul>`],
      [15, 'Pros & Cons of Independence (syllabus list)',
        `<p class="y-chinh">🎯 The exact syllabus list of pros and cons of independence — learn it by heart for LO-5.1.1.</p>
<p class="nhan">Benefits</p>
<ul>
<li><strong>Different kinds of failures</strong> — independent testers are likely to recognise them (different backgrounds, perspectives and biases).</li>
<li><strong>Challenge assumptions</strong> — an independent tester can verify, challenge or disprove assumptions made by stakeholders during specification and implementation.</li>
<li><strong>Separate budget</strong> (slide adds) — a budget is likely dedicated to the test team.</li>
</ul>
<p class="nhan">Drawbacks</p>
<ul>
<li><strong>Isolation</strong> from the development team — lack of collaboration, delays in feedback.</li>
<li><strong>Developers may lose a sense of responsibility for quality</strong></li>
<li><strong>Seen as a bottleneck</strong> — or blamed for release delays.</li>
<li><strong>Missing information</strong> — independent testers may lack some important information about the test object.</li>
</ul>`,
        `<p class="y-chinh">🎯 Đúng danh sách ưu/nhược của tính độc lập trong syllabus — học thuộc cho LO-5.1.1.</p>
<p class="nhan">Lợi ích</p>
<ul>
<li><strong>Nhận ra những loại failure khác</strong> — vì tester độc lập khác nền tảng, góc nhìn và thiên kiến.</li>
<li><strong>Chất vấn giả định</strong> — tester độc lập có thể kiểm chứng, chất vấn hoặc bác bỏ các giả định mà các bên đưa ra lúc đặc tả và cài đặt.</li>
<li><strong>Ngân sách riêng</strong> (slide thêm) — nhóm test thường có ngân sách dành riêng.</li>
</ul>
<p class="nhan">Hạn chế</p>
<ul>
<li><strong>Bị tách biệt</strong> khỏi nhóm phát triển — thiếu hợp tác, phản hồi chậm.</li>
<li><strong>Developer có thể mất ý thức trách nhiệm về chất lượng</strong></li>
<li><strong>Bị coi là nút cổ chai</strong> — hoặc bị đổ lỗi khi phát hành trễ.</li>
<li><strong>Thiếu thông tin</strong> — tester độc lập có thể thiếu một số thông tin quan trọng về đối tượng test.</li>
</ul>`],
      [16, 'So what we have seen thus far…',
        `<p class="y-chinh">🎯 Summary of the independence block: use a good mix, never "the more the better".</p>
<ul>
<li><strong>Independence is important</strong> — but <strong>not a replacement for familiarity</strong>.</li>
<li><strong>Different levels</strong> — each with pros and cons.</li>
<li><strong>Test techniques</strong> give another dimension of independence — <em>independence of thought</em>. A developer who applies boundary value analysis systematically escapes some of his own biases.</li>
<li><strong>The test strategy should use a good mix</strong> — and write down which level of independence applies where (the slide's "declaration of independence").</li>
<li><strong>Balance of skills</strong> — the team needs it.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tóm tắt khối tính độc lập: phối hợp cho khéo, không phải "càng độc lập càng tốt".</p>
<ul>
<li><strong>Tính độc lập quan trọng</strong> — nhưng <strong>không thay thế được sự am hiểu</strong>.</li>
<li><strong>Có nhiều mức</strong> — mỗi mức đều có ưu và nhược.</li>
<li><strong>Kỹ thuật thiết kế test</strong> mang lại một chiều độc lập khác — <em>độc lập trong tư duy</em>. Developer áp dụng phân tích giá trị biên một cách có hệ thống sẽ thoát được một phần thiên kiến của mình.</li>
<li><strong>Chiến lược test nên phối hợp nhiều mức</strong> — và ghi rõ cấp nào dùng mức độc lập nào ("tuyên ngôn độc lập" trên slide).</li>
<li><strong>Cân bằng kỹ năng</strong> — nhóm cần có điều này.</li>
</ul>`],
      [17, 'Tasks of a Test Manager & Tester — test roles',
        `<p class="y-chinh">🎯 The syllabus defines exactly <strong>two</strong> test roles: the test manager and the tester.</p>
<ul>
<li><strong>Test manager</strong> (also test leader, test coordinator) — overall responsibility for the test process and for leading the test activities. The mind map calls it "Test Leader (Mgt.)".</li>
<li><strong>Tester</strong> — the mind map calls it "Tester (Execution)".</li>
</ul>
<p class="nhan">In practice</p>
<ul>
<li><strong>Small projects</strong> — one person may play both roles.</li>
<li><strong>Agile</strong> — some test-manager tasks are done by the team itself; tasks that span several teams stay with a test manager outside the team.</li>
</ul>`,
        `<p class="y-chinh">🎯 Syllabus định nghĩa đúng <strong>hai</strong> vai trò kiểm thử: test manager và tester.</p>
<ul>
<li><strong>Test manager</strong> (còn gọi là test leader, test coordinator) — chịu trách nhiệm chung về quy trình test và dẫn dắt các hoạt động test. Sơ đồ tư duy gọi là "Test Leader (quản lý)".</li>
<li><strong>Tester</strong> — sơ đồ tư duy gọi là "Tester (thực thi)".</li>
</ul>
<p class="nhan">Trong thực tế</p>
<ul>
<li><strong>Dự án nhỏ</strong> — một người có thể kiêm cả hai.</li>
<li><strong>Agile</strong> — một phần việc của test manager do chính nhóm đảm nhận; việc liên quan nhiều nhóm vẫn thuộc về test manager bên ngoài nhóm.</li>
</ul>`],
      [18, 'Test Manager Tasks',
        `<p class="y-chinh">🎯 The test manager plans, monitors, controls, reports and looks after people — he starts test design but does not do it.</p>
<p class="nhan">The 11 tasks — the red verb is the hook</p>
<ol>
<li><strong>Devise</strong> test objectives, policies and strategies.</li>
<li><strong>Plan</strong> test activities — based on objectives, risks, organisational and project context.</li>
<li><strong>Write, update, adapt and coordinate the test plan</strong> with stakeholders.</li>
<li><strong>Initiate</strong> analysis, design, implementation and execution of tests.</li>
<li><strong>Prepare and deliver</strong> test progress and test summary reports.</li>
<li><strong>Support</strong> the defect and configuration management system.</li>
<li><strong>Produce</strong> metrics for test progress and quality.</li>
<li><strong>Plan and support</strong> tool selection and implementation.</li>
<li><strong>Decide</strong> on the test environment implementation.</li>
<li><strong>Promote and advocate</strong> the testers.</li>
<li><strong>Develop</strong> testers' skills and careers.</li>
</ol>`,
        `<p class="y-chinh">🎯 Test manager lập kế hoạch, giám sát, kiểm soát, báo cáo và chăm lo con người — khởi động việc thiết kế test nhưng không tự làm.</p>
<p class="nhan">11 nhiệm vụ — động từ màu đỏ là móc để nhớ</p>
<ol>
<li><strong>Đề ra</strong> mục tiêu, chính sách và chiến lược test.</li>
<li><strong>Lập kế hoạch</strong> hoạt động test — dựa trên mục tiêu, rủi ro, bối cảnh tổ chức và dự án.</li>
<li><strong>Viết, cập nhật, điều chỉnh và điều phối test plan</strong> với các bên liên quan.</li>
<li><strong>Khởi động</strong> việc phân tích, thiết kế, triển khai và thực thi test.</li>
<li><strong>Chuẩn bị và gửi</strong> báo cáo tiến độ và báo cáo tổng kết test.</li>
<li><strong>Hỗ trợ</strong> hệ thống quản lý defect và quản lý cấu hình.</li>
<li><strong>Tạo</strong> số đo về tiến độ và chất lượng.</li>
<li><strong>Lên kế hoạch và hỗ trợ</strong> việc chọn và triển khai công cụ.</li>
<li><strong>Quyết định</strong> việc dựng môi trường test.</li>
<li><strong>Bảo vệ, lên tiếng</strong> cho tester.</li>
<li><strong>Phát triển</strong> kỹ năng và sự nghiệp của tester.</li>
</ol>`],
      [19, 'Tester Tasks',
        `<p class="y-chinh">🎯 The tester analyses, designs, sets up, executes and automates — the hands-on side of testing.</p>
<p class="nhan">The 8 tasks</p>
<ol>
<li><strong>Review and contribute to</strong> test plans.</li>
<li><strong>Assess the test basis</strong> for testability and early defect detection.</li>
<li><strong>Identify and document test conditions and test cases</strong> — plus traceability between test cases, test conditions and test basis.</li>
<li><strong>Design, set up and verify</strong> the test environment.</li>
<li><strong>Perform test execution</strong> — design and implement test cases, acquire and prepare test data, create the detailed test execution schedule, execute tests.</li>
<li><strong>Perform test automation</strong></li>
<li><strong>Evaluate non-functional characteristics</strong> — performance, reliability, usability…</li>
<li><strong>Review tests developed by others</strong></li>
</ol>
<div class="pitfall co-tieu-de"><strong>Two traps.</strong> The tester only <em>contributes to</em> the plan — the manager writes it. The <em>detailed execution schedule</em> is usually made by the tester (slide 40 notes say so too).</div>`,
        `<p class="y-chinh">🎯 Tester phân tích, thiết kế, dựng môi trường, chạy test và tự động hoá — phần "bắt tay vào làm" của kiểm thử.</p>
<p class="nhan">8 nhiệm vụ</p>
<ol>
<li><strong>Review và góp ý</strong> test plan.</li>
<li><strong>Đánh giá test basis</strong> về khả năng kiểm thử và phát hiện defect sớm.</li>
<li><strong>Xác định và ghi lại test condition, test case</strong> — cùng truy vết giữa test case, test condition và test basis.</li>
<li><strong>Thiết kế, dựng và kiểm tra</strong> môi trường test.</li>
<li><strong>Thực hiện test</strong> — thiết kế và cài đặt test case, thu thập và chuẩn bị dữ liệu test, lập lịch thực thi chi tiết, chạy test.</li>
<li><strong>Tự động hoá test</strong></li>
<li><strong>Đánh giá đặc tính phi chức năng</strong> — hiệu năng, độ tin cậy, tính dễ dùng…</li>
<li><strong>Review test do người khác viết</strong></li>
</ol>
<div class="pitfall co-tieu-de"><strong>Hai bẫy.</strong> Tester chỉ <em>góp ý</em> cho plan — manager mới là người viết. <em>Lịch thực thi chi tiết</em> thường do tester lập (ghi chú slide 40 cũng nói vậy).</div>`],
      [20, 'Skills which Test Staff Need',
        `<p class="y-chinh">🎯 Test staff need knowledge in three areas: the business domain, the technology and testing itself.</p>
<ol>
<li><strong>Application or business domain</strong> — to know what "correct" means for users: banking, healthcare, e-commerce…</li>
<li><strong>Technology</strong> — architecture, databases, OS, networks, programming for automation.</li>
<li><strong>Testing</strong> — techniques, process, tools.</li>
</ol>
<ul>
<li><strong>Plus soft skills</strong> from lesson 1.5 — communication, curiosity, attention to detail.</li>
<li><strong>Hidden slide</strong> — right after this one, a hidden slide lists specialist profiles; see the box after the walkthrough.</li>
</ul>`,
        `<p class="y-chinh">🎯 Người làm test cần kiến thức ở ba mảng: nghiệp vụ, công nghệ và chính kiểm thử.</p>
<ol>
<li><strong>Nghiệp vụ/lĩnh vực ứng dụng</strong> — để biết thế nào là "đúng" với người dùng: ngân hàng, y tế, thương mại điện tử…</li>
<li><strong>Công nghệ</strong> — kiến trúc, cơ sở dữ liệu, hệ điều hành, mạng, lập trình để tự động hoá.</li>
<li><strong>Kiểm thử</strong> — kỹ thuật, quy trình, công cụ.</li>
</ol>
<ul>
<li><strong>Cộng thêm kỹ năng mềm</strong> ở bài 1.5 — giao tiếp, tò mò, cẩn thận.</li>
<li><strong>Slide ẩn</strong> — ngay sau slide này có một slide ẩn liệt kê các "hồ sơ chuyên gia"; xem khung sau phần học từng slide.</li>
</ul>`],
      [21, 'Question — how tasks are divided between test manager and tester',
        `<p class="y-chinh">🎯 Manager = plan, organise, control; tester = specify and execute tests (slides 18–19).</p>
<p class="nhan">Why the other options are wrong</p>
<ul>
<li><strong>A</strong> — choosing tools is a manager-supported decision, and "controls" are the manager's job.</li>
<li><strong>C</strong> — deciding about automation frameworks is not the tester's decision: the manager plans and supports tool selection; the tester performs automation.</li>
<li><strong>D</strong> — specifying test cases is a tester task, and prioritising their execution belongs to the tester too; the manager does not write test cases.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — The test manager plans, organizes and controls the testing activities, while the tester specifies and executes tests.</strong> That is exactly slides 18–19.</p>`,
        `<p class="y-chinh">🎯 Manager = lập kế hoạch, tổ chức, kiểm soát; tester = đặc tả và thực thi test (slide 18–19).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — chọn công cụ là việc manager lên kế hoạch và hỗ trợ, còn "kiểm soát" là việc của manager.</li>
<li><strong>C</strong> — quyết định framework tự động hoá không phải việc tester tự quyết: manager lo việc chọn công cụ; tester thực hiện tự động hoá.</li>
<li><strong>D</strong> — đặc tả test case là việc của tester, và sắp thứ tự chạy chúng cũng thuộc về tester; manager không viết test case.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Test manager lập kế hoạch, tổ chức và kiểm soát hoạt động test; tester đặc tả và thực thi test.</strong> Đúng như slide 18–19.</p>`],
      [22, 'Question — who creates and updates the test plan?',
        `<p class="y-chinh">🎯 The test plan is written and updated by the test manager (slide 18).</p>
<ul>
<li><strong>Test manager</strong> — slide 18: "Write, update, adapt and coordinate the test plan".</li>
<li><strong>Tester</strong> — only reviews and contributes (slide 19).</li>
<li><strong>Project manager</strong> — owns the project plan, not the test plan.</li>
<li><strong>Product owner</strong> — provides priorities and acceptance criteria.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — The test manager.</strong></p>`,
        `<p class="y-chinh">🎯 Test plan do test manager viết và cập nhật (slide 18).</p>
<ul>
<li><strong>Test manager</strong> — slide 18: "Viết, cập nhật, điều chỉnh và điều phối test plan".</li>
<li><strong>Tester</strong> — chỉ review và góp ý (slide 19).</li>
<li><strong>Project manager</strong> — sở hữu project plan, không phải test plan.</li>
<li><strong>Product owner</strong> — cung cấp độ ưu tiên và tiêu chí chấp nhận.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Test manager.</strong></p>`],
      [23, 'Question — a benefit of test independence',
        `<p class="y-chinh">🎯 The benefit of independence is a different set of biases (slides 7 and 15).</p>
<ul>
<li><strong>A</strong> — correct: different cognitive biases let independent testers recognise different kinds of failures.</li>
<li><strong>B</strong> (isolation) and <strong>C</strong> (lack of information) — these are listed <em>drawbacks</em>.</li>
<li><strong>D</strong> — wrong and even reversed: the drawback is that developers lose the sense of responsibility for quality. Quality stays everybody's job.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Testers have different biases than developers.</strong></p>`,
        `<p class="y-chinh">🎯 Lợi ích của tính độc lập là một bộ thiên kiến khác (slide 7 và 15).</p>
<ul>
<li><strong>A</strong> — đúng: thiên kiến nhận thức khác nhau giúp tester độc lập nhận ra những loại failure khác.</li>
<li><strong>B</strong> (bị tách biệt) và <strong>C</strong> (thiếu thông tin) — là các <em>hạn chế</em> có trong danh sách.</li>
<li><strong>D</strong> — sai và còn ngược: hạn chế là developer mất ý thức trách nhiệm về chất lượng. Chất lượng vẫn là việc của mọi người.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Tester có thiên kiến khác với developer.</strong></p>`],
      [24, 'Question — biggest problem with a developer testing his own code',
        `<p class="y-chinh">🎯 The core weakness of self-testing is the lack of objectivity (slide 9).</p>
<ul>
<li><strong>C</strong> — correct. Slide 9: "difficult to destroy own work", "tendency to see expected results", "subjective assessment".</li>
<li><strong>A</strong> and <strong>B</strong> — unfair generalisations: developers find many defects efficiently (slide 7).</li>
<li><strong>D</strong> — about schedule, not about the inherent weakness of self-testing.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Developers are not objective about their own code.</strong></p>`,
        `<p class="y-chinh">🎯 Điểm yếu cố hữu của việc tự test là thiếu khách quan (slide 9).</p>
<ul>
<li><strong>C</strong> — đúng. Slide 9: "khó phá sản phẩm của mình", "có xu hướng thấy kết quả mong đợi", "đánh giá chủ quan".</li>
<li><strong>A</strong> và <strong>B</strong> — quy chụp không công bằng: developer tìm được nhiều lỗi rất hiệu quả (slide 7).</li>
<li><strong>D</strong> — nói về thời gian, không phải điểm yếu cố hữu của việc tự test.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Developer không khách quan với code của chính mình.</strong></p>`],
    ]),
    bi(`<h3>🔒 Hidden slide in SWT5_tim.pptx (not shown in class, still worth knowing)</h3>
<ul>
<li><strong>Skills needed in testing</strong> (pptx slide 25, right after slide 24). A team is not a group of identical testers but a mix of profiles:
<ul>
<li><em>technique specialists</em> (black-box/white-box design)</li>
<li><em>automators</em></li>
<li><em>database experts</em></li>
<li>people with <em>business skills &amp; understanding</em></li>
<li>a <em>usability expert</em></li>
<li>a <em>test environment expert</em></li>
<li><em>test managers</em></li>
</ul>
It expands slide 20 and slide 16's "balance of skills needed" — when a question asks what a good test team needs, "the right mix of skills" is the syllabus answer.</li>
</ul>`,
    `<h3>🔒 Slide ẩn trong file SWT5_tim.pptx (không chiếu trên lớp nhưng vẫn nên biết)</h3>
<ul>
<li><strong>Skills needed in testing</strong> (slide pptx 25, ngay sau slide 24). Một nhóm test không phải là nhiều tester giống hệt nhau mà là sự phối hợp nhiều "hồ sơ":
<ul>
<li><em>chuyên gia kỹ thuật thiết kế test</em> (black-box/white-box)</li>
<li><em>người làm automation</em></li>
<li><em>chuyên gia cơ sở dữ liệu</em></li>
<li>người có <em>kỹ năng và hiểu biết nghiệp vụ</em></li>
<li><em>chuyên gia usability</em></li>
<li><em>chuyên gia môi trường test</em></li>
<li><em>test manager</em></li>
</ul>
Slide này mở rộng slide 20 và ý "cân bằng kỹ năng" ở slide 16 — khi đề hỏi một nhóm test tốt cần gì, đáp án theo syllabus là "đúng sự phối hợp kỹ năng".</li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — choose the independence level, then split the tasks</h3>
<p><strong>Part 1.</strong> For each situation pick the most suitable level of independence (1 = developer … 5 = third party) and justify it with a pro/con from slides 9–15.</p>
<table>
<thead><tr><th>#</th><th>Situation</th><th>Level &amp; reason</th></tr></thead>
<tbody>
<tr><td>1</td><td>Unit tests for a new <code>calculateInterest()</code> method.</td><td><strong>1 Developer</strong> — knows the code, fixes cheaply; add a <em>buddy review</em> of the tests to offset the bias.</td></tr>
<tr><td>2</td><td>A 7-person Scrum team building a mobile app, two-week sprints.</td><td><strong>2 Tester in the team</strong> — fast feedback, shared goal; watch for peer pressure.</td></tr>
<tr><td>3</td><td>System test of a hospital records system before go-live.</td><td><strong>3 Separate test team</strong> — objective, consistent, dedicated; keep developers doing component tests to avoid "over the wall".</td></tr>
<tr><td>4</td><td>Penetration test of an online-banking API.</td><td><strong>5 Third party</strong> (or 4 internal security specialists) — specialist tools and skills, independent of internal politics (slide 13 notes).</td></tr>
<tr><td>5</td><td>A company wants all its projects to estimate and report testing the same way.</td><td><strong>4 Internal test consultants</strong> — broad organisational view, better planning and control (slide 12), but only influence.</td></tr>
</tbody>
</table>
<p><strong>Part 2.</strong> Test manager (M) or tester (T)?</p>
<table>
<thead><tr><th>Task</th><th>Role</th></tr></thead>
<tbody>
<tr><td>Write the test plan for release 2.0 and agree it with stakeholders</td><td>M</td></tr>
<tr><td>Point out that requirement REQ-12 "the page must load fast" is untestable</td><td>T (assess the test basis for testability)</td></tr>
<tr><td>Decide that the test environment will be a copy of production on the cloud</td><td>M (decide on test environment implementation); T designs, sets it up and verifies it</td></tr>
<tr><td>Build the Selenium scripts for the checkout regression suite</td><td>T (perform test automation)</td></tr>
<tr><td>Produce the weekly defect-trend chart and the test summary report</td><td>M</td></tr>
<tr><td>Create the detailed execution schedule for tomorrow's test session</td><td>T</td></tr>
<tr><td>Coach a junior tester and plan her ISTQB training</td><td>M (develop skills and careers)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Exam traps.</strong>
<ol>
<li>"More independence is always better" — false: every level has drawbacks and independence is <em>not a replacement for familiarity</em>.</li>
<li>"With an independent test team, developers no longer need to test" — false: that <em>is</em> the listed drawback (developers lose responsibility for quality).</li>
<li>"The test manager designs the test cases" — false: the manager <em>initiates</em> analysis and design; testers do it.</li>
<li>"Isolation from developers" is always a <em>drawback</em>, never a benefit, even though it sounds like "independence".</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Independence written into law: IV&amp;V and DO-178C.</strong>
<p>In safety-critical industries independence is not a matter of taste.</p>
<ul>
<li><strong>DO-178C</strong> — the avionics standard marks many verification objectives for the most critical software (levels A and B) as "with independence": the person verifying must not be the person who wrote the item.</li>
<li><strong>NASA IV&amp;V</strong> — NASA runs a whole <em>Independent Verification &amp; Validation</em> facility that is technically, managerially and financially independent of the projects it checks.</li>
</ul>
<p><em>Outside the syllabus because CTFL only asks you to weigh the pros and cons, not to apply sector-specific regulations.</em></p></div>`,
    `<h3>Ví dụ có lời giải · Chọn mức độc lập rồi chia việc</h3>
<p><strong>Phần 1.</strong> Với mỗi tình huống chọn mức độc lập phù hợp nhất (1 = developer … 5 = bên thứ ba) và giải thích bằng một ưu/nhược ở slide 9–15.</p>
<table>
<thead><tr><th>#</th><th>Tình huống</th><th>Mức &amp; lý do</th></tr></thead>
<tbody>
<tr><td>1</td><td>Unit test cho phương thức mới <code>calculateInterest()</code>.</td><td><strong>1 Developer</strong> — hiểu code, sửa rẻ; thêm một <em>đồng nghiệp review</em> bộ test để bù thiên kiến.</td></tr>
<tr><td>2</td><td>Scrum team 7 người làm app di động, sprint hai tuần.</td><td><strong>2 Tester trong nhóm</strong> — phản hồi nhanh, chung mục tiêu; cẩn thận áp lực đồng nghiệp.</td></tr>
<tr><td>3</td><td>System test hệ thống hồ sơ bệnh viện trước khi chạy thật.</td><td><strong>3 Nhóm test riêng</strong> — khách quan, nhất quán, chuyên trách; vẫn giữ developer làm component test để tránh "ném qua tường".</td></tr>
<tr><td>4</td><td>Kiểm thử xâm nhập API ngân hàng trực tuyến.</td><td><strong>5 Bên thứ ba</strong> (hoặc 4 chuyên gia bảo mật nội bộ) — có công cụ và kỹ năng chuyên sâu, không dính chính trị nội bộ (ghi chú slide 13).</td></tr>
<tr><td>5</td><td>Công ty muốn mọi dự án ước lượng và báo cáo test theo cùng một cách.</td><td><strong>4 Tư vấn test nội bộ</strong> — nhìn toàn tổ chức, lập kế hoạch và kiểm soát tốt hơn (slide 12), nhưng chỉ có ảnh hưởng.</td></tr>
</tbody>
</table>
<p><strong>Phần 2.</strong> Test manager (M) hay tester (T)?</p>
<table>
<thead><tr><th>Việc</th><th>Vai trò</th></tr></thead>
<tbody>
<tr><td>Viết test plan cho bản 2.0 và thống nhất với các bên</td><td>M</td></tr>
<tr><td>Chỉ ra yêu cầu REQ-12 "trang phải tải nhanh" là không test được</td><td>T (đánh giá test basis về khả năng kiểm thử)</td></tr>
<tr><td>Quyết định môi trường test là một bản sao production trên cloud</td><td>M (quyết định việc dựng môi trường); T thiết kế, dựng và kiểm tra nó</td></tr>
<tr><td>Viết script Selenium cho bộ regression thanh toán</td><td>T (tự động hoá test)</td></tr>
<tr><td>Làm biểu đồ xu hướng defect hằng tuần và báo cáo tổng kết test</td><td>M</td></tr>
<tr><td>Lập lịch thực thi chi tiết cho buổi test ngày mai</td><td>T</td></tr>
<tr><td>Kèm cặp một tester mới và lên kế hoạch cho cô ấy thi ISTQB</td><td>M (phát triển kỹ năng và sự nghiệp)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Bẫy đề thi.</strong>
<ol>
<li>"Càng độc lập càng tốt" — sai: mức nào cũng có nhược điểm và tính độc lập <em>không thay thế được sự am hiểu</em>.</li>
<li>"Có nhóm test độc lập thì developer khỏi phải test" — sai: đó <em>chính là</em> hạn chế trong danh sách (developer mất ý thức trách nhiệm về chất lượng).</li>
<li>"Test manager thiết kế test case" — sai: manager <em>khởi động</em> việc phân tích và thiết kế; tester mới làm.</li>
<li>"Bị tách biệt khỏi developer" luôn là <em>hạn chế</em>, không bao giờ là lợi ích, dù nghe có vẻ giống "độc lập".</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Khi tính độc lập thành luật: IV&amp;V và DO-178C.</strong>
<p>Ở các ngành an toàn-sống-còn, độc lập không còn là chuyện tuỳ chọn.</p>
<ul>
<li><strong>DO-178C</strong> — chuẩn hàng không đánh dấu nhiều mục tiêu kiểm chứng của phần mềm quan trọng nhất (mức A và B) là "with independence": người kiểm chứng không được là người đã viết ra hạng mục đó.</li>
<li><strong>NASA IV&amp;V</strong> — NASA duy trì hẳn một cơ sở <em>Independent Verification &amp; Validation</em> độc lập về kỹ thuật, quản lý và tài chính với các dự án mà họ kiểm tra.</li>
</ul>
<p><em>Ngoài giáo trình vì CTFL chỉ yêu cầu cân nhắc ưu/nhược, không yêu cầu áp dụng quy định của từng ngành.</em></p></div>`),
    books([
      ['fst4', 'Ch.5 §1 "Test organization" (independent testing, tasks of test manager and tester) — book pp.154–160 (PDF 168–174); sample questions 1–3 p.197 (PDF 211)', 'Chương 5 §1 "Test organization" (kiểm thử độc lập, nhiệm vụ test manager và tester) — trang sách 154–160 (PDF 168–174); câu hỏi mẫu 1–3 trang 197 (PDF 211)'],
      ['fst', '§5.1 "Test organization" — pp.127–131 (PDF ≈130–133)', '§5.1 "Test organization" — trang 127–131 (PDF ≈130–133)'],
      ['sp5', '§6.1 "Test Organization": §6.1.1 Independent Testing (PDF 247), §6.1.2 Roles, Tasks, and Qualifications (PDF 251–255)', '§6.1 "Test Organization": §6.1.1 Independent Testing (PDF 247), §6.1.2 Roles, Tasks, and Qualifications (PDF 251–255)'],
      ['sp4', '§6.1 "Test Organization" — pp.169–173 (PDF 184–188)', '§6.1 "Test Organization" — trang 169–173 (PDF 184–188)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 7.2 Test planning & estimation ───────────────────────── */
const L72 = {
  title: '7.2 — Test planning & estimation: plan, strategies, entry/exit, schedule, effort|||7.2 — Lập kế hoạch & ước lượng test: test plan, chiến lược, entry/exit, lịch thực thi, công sức',
  slug: 'swt301-test-plan-risk',
  type: 'VIDEO',
  description: 'SWT5 slide 25–58: mục đích & nội dung test plan, 7 chiến lược test, entry/exit criteria, lập lịch thực thi theo ưu tiên & phụ thuộc (K3), 4 nhóm yếu tố ảnh hưởng công sức, ước lượng metrics-based vs expert-based (Wideband Delphi, planning poker, three-point) — đáp án 9 câu hỏi + 1 slide ẩn.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.2 · SWT5 slides 25–58</span>
<h2>Test planning &amp; estimation</h2>
<p class="lead">This is the heaviest block of the chapter and the one with a <strong>K3</strong> objective: given priorities and dependencies you must be able to <em>build</em> a test execution schedule. Around it sit the test plan, the seven test strategies, entry and exit criteria, the factors that drive test effort and the two families of estimation techniques.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-5.2.1</strong> Summarise the purpose and content of a test plan (K2)</li>
<li><strong>LO-5.2.2</strong> Differentiate between various test strategies (K2)</li>
<li><strong>LO-5.2.3</strong> Give examples of potential entry and exit criteria (K2)</li>
<li><strong>LO-5.2.4</strong> Apply knowledge of prioritisation and technical and logical dependencies to schedule test execution for a given set of test cases (<strong>K3</strong>)</li>
<li><strong>LO-5.2.5</strong> Identify factors that influence the effort related to testing (K1)</li>
<li><strong>LO-5.2.6</strong> Explain the difference between two estimation techniques: the metrics-based technique and the expert-based technique (K2)</li>
</ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Test policy</div><div class="lz-t">why the organisation tests</div><div class="lz-d">company level</div></div>
  <div class="lz-step"><div class="lz-k">→ Test strategy</div><div class="lz-t">how it tests, in general</div><div class="lz-d">one of 7 types, or a mix</div></div>
  <div class="lz-step"><div class="lz-k">→ Test approach</div><div class="lz-t">strategy applied to one project</div><div class="lz-d">levels, types, techniques, criteria</div></div>
  <div class="lz-step"><div class="lz-k">→ Test plan</div><div class="lz-t">the document</div><div class="lz-d">scope, schedule, effort, risks</div></div>
  <div class="lz-step"><div class="lz-k">→ Execution schedule</div><div class="lz-t">order of test runs</div><div class="lz-d">priority + dependencies</div></div>
</div>
<h3>The seven strategies at a glance</h3>
<table>
<thead><tr><th>Strategy</th><th>Tests come from…</th><th>Typical example</th></tr></thead>
<tbody>
<tr><td>Analytical</td><td>an analysis of a factor — <strong>risk</strong> or <strong>requirements</strong></td><td>risk-based testing</td></tr>
<tr><td>Model-based</td><td>a <strong>model</strong> of a required aspect</td><td>state diagram, business-process model, reliability growth model</td></tr>
<tr><td>Methodical</td><td>a <strong>predefined list</strong> used systematically</td><td>checklist, failure taxonomy, ISO/IEC 25010 characteristics</td></tr>
<tr><td>Process- / standard-compliant</td><td>external <strong>rules and standards</strong></td><td>ISO/IEC/IEEE 29119, industry or agile rules</td></tr>
<tr><td>Directed (consultative)</td><td><strong>advice of stakeholders / experts</strong></td><td>a security consultant tells you what to test</td></tr>
<tr><td>Regression-averse</td><td>desire to <strong>avoid regression</strong></td><td>large automated regression suite, reused tests</td></tr>
<tr><td>Reactive (dynamic)</td><td>the system and events <strong>during execution</strong></td><td>exploratory testing</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.2 · SWT5 slide 25–58</span>
<h2>Lập kế hoạch &amp; ước lượng test</h2>
<p class="lead">Đây là khối nặng nhất của chương và là khối có mục tiêu <strong>K3</strong>: cho độ ưu tiên và các phụ thuộc, bạn phải <em>tự dựng</em> được lịch thực thi test. Xung quanh nó là test plan, bảy chiến lược test, entry và exit criteria, các yếu tố quyết định công sức test và hai họ kỹ thuật ước lượng.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-5.2.1</strong> Tóm tắt mục đích và nội dung của test plan (K2)</li>
<li><strong>LO-5.2.2</strong> Phân biệt các chiến lược test (K2)</li>
<li><strong>LO-5.2.3</strong> Nêu ví dụ entry và exit criteria (K2)</li>
<li><strong>LO-5.2.4</strong> Vận dụng độ ưu tiên và phụ thuộc kỹ thuật/logic để lập lịch thực thi cho một tập test case (<strong>K3</strong>)</li>
<li><strong>LO-5.2.5</strong> Nhận diện các yếu tố ảnh hưởng tới công sức test (K1)</li>
<li><strong>LO-5.2.6</strong> Giải thích khác biệt giữa hai kỹ thuật ước lượng: dựa trên số liệu (metrics-based) và dựa trên chuyên gia (expert-based) (K2)</li>
</ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Test policy</div><div class="lz-t">vì sao tổ chức kiểm thử</div><div class="lz-d">cấp công ty</div></div>
  <div class="lz-step"><div class="lz-k">→ Test strategy</div><div class="lz-t">kiểm thử thế nào, nói chung</div><div class="lz-d">một trong 7 loại, hoặc phối hợp</div></div>
  <div class="lz-step"><div class="lz-k">→ Test approach</div><div class="lz-t">chiến lược áp vào một dự án</div><div class="lz-d">cấp, loại, kỹ thuật, tiêu chí</div></div>
  <div class="lz-step"><div class="lz-k">→ Test plan</div><div class="lz-t">tài liệu</div><div class="lz-d">phạm vi, lịch, công sức, rủi ro</div></div>
  <div class="lz-step"><div class="lz-k">→ Lịch thực thi</div><div class="lz-t">thứ tự chạy test</div><div class="lz-d">ưu tiên + phụ thuộc</div></div>
</div>
<h3>Bảy chiến lược trong một bảng</h3>
<table>
<thead><tr><th>Chiến lược</th><th>Test sinh ra từ…</th><th>Ví dụ điển hình</th></tr></thead>
<tbody>
<tr><td>Analytical (phân tích)</td><td>việc phân tích một yếu tố — <strong>rủi ro</strong> hoặc <strong>yêu cầu</strong></td><td>risk-based testing</td></tr>
<tr><td>Model-based (dựa mô hình)</td><td>một <strong>mô hình</strong> của khía cạnh cần có</td><td>sơ đồ trạng thái, mô hình quy trình nghiệp vụ, mô hình tăng trưởng độ tin cậy</td></tr>
<tr><td>Methodical (có phương pháp)</td><td>một <strong>danh sách định sẵn</strong> dùng có hệ thống</td><td>checklist, phân loại lỗi, các đặc tính ISO/IEC 25010</td></tr>
<tr><td>Process- / standard-compliant</td><td><strong>quy tắc, tiêu chuẩn</strong> bên ngoài</td><td>ISO/IEC/IEEE 29119, quy định ngành hay quy tắc agile</td></tr>
<tr><td>Directed (consultative — tư vấn)</td><td><strong>lời khuyên của các bên / chuyên gia</strong></td><td>chuyên gia bảo mật chỉ cho bạn cần test gì</td></tr>
<tr><td>Regression-averse (né hồi quy)</td><td>mong muốn <strong>tránh hồi quy</strong></td><td>bộ regression tự động lớn, tái dùng test</td></tr>
<tr><td>Reactive (dynamic — phản ứng)</td><td>hệ thống và sự kiện <strong>trong lúc chạy test</strong></td><td>exploratory testing</td></tr>
</tbody>
</table>`),
    walkHead(D, 25, 58, 'Nine Question slides (50–58) close the block; slide 54 and 56 are the K3 schedule questions — both are re-solved step by step in the worked example.', 'Chín slide Question (50–58) khép lại khối này; slide 54 và 56 là câu K3 lập lịch — cả hai được giải lại từng bước trong phần ví dụ có lời giải.'),
    walk(D, [
      [25, 'CONTENT — Test Planning & Estimation',
        `<p class="y-chinh">🎯 Planning &amp; estimation has six sub-topics, one per learning objective (LO-5.2.1 → 5.2.6).</p>
<ol>
<li><strong>Test plan</strong> — purpose &amp; content</li>
<li><strong>Test strategy &amp; test approach</strong></li>
<li><strong>Entry &amp; exit criteria</strong></li>
<li><strong>Test execution schedule</strong></li>
<li><strong>Factors influencing test effort</strong></li>
<li><strong>Test estimation techniques</strong></li>
</ol>`,
        `<p class="y-chinh">🎯 Lập kế hoạch &amp; ước lượng gồm sáu ý, ứng đúng một-một với sáu chuẩn đầu ra (LO-5.2.1 → 5.2.6).</p>
<ol>
<li><strong>Test plan</strong> — mục đích &amp; nội dung</li>
<li><strong>Test strategy &amp; test approach</strong></li>
<li><strong>Entry &amp; exit criteria</strong></li>
<li><strong>Lịch thực thi test</strong></li>
<li><strong>Các yếu tố ảnh hưởng công sức test</strong></li>
<li><strong>Kỹ thuật ước lượng</strong></li>
</ol>`],
      [26, 'Mind map (divider) — Planning & Estimation',
        `<p class="y-chinh">🎯 The map again — now read the right-hand branch.</p>
<ul>
<li><strong>Test Strategy</strong> — the seven types (slides 30–36)</li>
<li><strong>Test Effort Factors</strong> — four groups (slides 42–45)</li>
<li><strong>Estimation Techniques</strong> — metric-based (burn-down chart, defect-removal model) and expert-based (planning poker, Wideband Delphi)</li>
</ul>`,
        `<p class="y-chinh">🎯 Lại sơ đồ — giờ đọc nhánh bên phải.</p>
<ul>
<li><strong>Test Strategy</strong> — bảy loại (slide 30–36)</li>
<li><strong>Test Effort Factors</strong> — bốn nhóm (slide 42–45)</li>
<li><strong>Estimation Techniques</strong> — dựa số liệu (burn-down chart, defect-removal model) và dựa chuyên gia (planning poker, Wideband Delphi)</li>
</ul>`],
      [27, 'Purpose & Content of a Test Plan',
        `<p class="y-chinh">🎯 A test plan is a <em>living</em> document that answers: what will be tested, how, by whom, and when it is done.</p>
<p class="nhan">Why write one — 3 reasons (Rex Black, fst4)</p>
<ol>
<li><strong>Guide thinking</strong> — writing it forces you to face the hard questions: what <em>not</em> to test, which risks, which environment.</li>
<li><strong>Means of communication</strong> — drafts and review meetings let the plan influence the project team, and the team influence the plan.</li>
<li><strong>Change management</strong> — planning is <em>continuous</em>: feedback from testing reveals new risks and the plan is adjusted. Usually one master test plan plus one plan per level.</li>
</ol>
<p class="nhan">What goes inside (syllabus)</p>
<ul>
<li>Context, scope, objectives and risks</li>
<li>The approach, and how testing fits into the lifecycle</li>
<li>What to test, with which people and resources</li>
<li>Schedule, monitoring metrics, budget, level of documentation (slide 28)</li>
</ul>
<p class="nhan">The classic outline — IEEE 829, 16 sections</p>
<ol class="hai-cot"><li>Test plan identifier</li><li>Introduction</li><li>Test items</li><li>Features to be tested</li><li>Features <em>not</em> to be tested</li><li>Approach</li><li>Item pass/fail criteria</li><li>Suspension criteria &amp; resumption requirements</li><li>Test deliverables</li><li>Testing tasks</li><li>Environmental needs</li><li>Responsibilities</li><li>Staffing &amp; training needs</li><li>Schedule</li><li>Risks &amp; contingencies</li><li>Approvals</li></ol>
<p class="meo">🧠 <strong>Remember the 3 reasons as “Think · Talk · Tune”</strong>: guide thinking, communicate, adjust to change.</p>`,
        `<p class="y-chinh">🎯 Test plan là tài liệu <em>sống</em>, trả lời: test cái gì, test thế nào, ai làm, khi nào thì xong.</p>
<p class="nhan">Vì sao phải viết — 3 lý do (Rex Black, fst4)</p>
<ol>
<li><strong>Định hướng tư duy</strong> — viết ra buộc bạn đối mặt các câu hỏi khó: cái gì <em>không</em> test, rủi ro nào, môi trường nào.</li>
<li><strong>Phương tiện giao tiếp</strong> — bản nháp và các buổi review giúp plan tác động tới nhóm dự án, và nhóm tác động ngược lại plan.</li>
<li><strong>Quản lý thay đổi</strong> — lập kế hoạch là việc <em>liên tục</em>: phản hồi từ hoạt động test làm lộ rủi ro mới và plan được chỉnh. Thường có một master test plan cộng các plan theo từng cấp.</li>
</ol>
<p class="nhan">Bên trong có gì (theo syllabus)</p>
<ul>
<li>Bối cảnh, phạm vi, mục tiêu và rủi ro</li>
<li>Cách tiếp cận, và cách lồng việc test vào vòng đời</li>
<li>Test cái gì, với con người và nguồn lực nào</li>
<li>Lịch, số đo để giám sát, ngân sách, mức chi tiết tài liệu (slide 28)</li>
</ul>
<p class="nhan">Khung kinh điển — IEEE 829, 16 mục</p>
<ol class="hai-cot"><li>Mã định danh plan</li><li>Giới thiệu</li><li>Hạng mục test</li><li>Tính năng sẽ test</li><li>Tính năng <em>không</em> test</li><li>Cách tiếp cận</li><li>Tiêu chí pass/fail của hạng mục</li><li>Tiêu chí tạm dừng &amp; điều kiện tiếp tục</li><li>Sản phẩm bàn giao</li><li>Công việc test</li><li>Nhu cầu môi trường</li><li>Trách nhiệm</li><li>Nhân sự &amp; đào tạo</li><li>Lịch</li><li>Rủi ro &amp; phương án dự phòng</li><li>Phê duyệt</li></ol>
<p class="meo">🧠 <strong>Nhớ 3 lý do bằng “Nghĩ · Nói · Nắn”</strong>: định hướng tư duy, giao tiếp, điều chỉnh theo thay đổi.</p>`],
      [28, 'Test Planning Activities',
        `<p class="y-chinh">🎯 Test planning consists of 8 activities — know the whole list.</p>
<ol>
<li>Determine the <strong>scope, objectives and risks</strong> of testing</li>
<li>Define the <strong>overall approach</strong></li>
<li><strong>Integrate and coordinate</strong> test activities into the software lifecycle</li>
<li>Decide <strong>what to test</strong>, the <strong>people and resources</strong> needed, and <strong>how</strong> the work will be done</li>
<li><strong>Schedule</strong> analysis, design, implementation, execution and evaluation</li>
<li>Select <strong>metrics</strong> for monitoring and control</li>
<li><strong>Budget</strong> the test activities</li>
<li>Determine the <strong>level of detail and structure of test documentation</strong> (templates, how detailed test cases must be) — the key to slide 55</li>
</ol>
<p class="ghi-chu">The teacher's notes on this slide are a Vietnamese translation of the same list.</p>`,
        `<p class="y-chinh">🎯 Lập kế hoạch test gồm 8 hoạt động — cần nhớ đủ cả danh sách.</p>
<ol>
<li>Xác định <strong>phạm vi, mục tiêu và rủi ro</strong> của việc test</li>
<li>Định ra <strong>cách tiếp cận tổng thể</strong></li>
<li><strong>Lồng ghép và điều phối</strong> hoạt động test vào vòng đời phần mềm</li>
<li>Quyết định <strong>test cái gì</strong>, cần <strong>người và nguồn lực</strong> nào, và <strong>làm thế nào</strong></li>
<li><strong>Lên lịch</strong> cho phân tích, thiết kế, triển khai, thực thi và đánh giá test</li>
<li>Chọn <strong>số đo (metrics)</strong> để giám sát và kiểm soát</li>
<li>Lập <strong>ngân sách</strong> cho hoạt động test</li>
<li>Xác định <strong>mức chi tiết và cấu trúc tài liệu test</strong> (template, test case cần chi tiết tới đâu) — chìa khoá của slide 55</li>
</ol>
<p class="ghi-chu">Ghi chú của giảng viên trên slide này là bản dịch tiếng Việt của đúng danh sách trên.</p>`],
      [29, 'Test Strategy & Test Approach',
        `<p class="y-chinh">🎯 The strategy is organisation-wide; the approach is that strategy applied to one project.</p>
<p class="nhan">Two definitions</p>
<ul>
<li><strong>Test strategy</strong> (organisational test strategy) — documentation expressing the <em>generic</em> requirements for testing one or more projects in an organisation: how testing is to be performed. It is aligned with the <strong>test policy</strong>.</li>
<li><strong>Test approach</strong> — the <em>implementation of the strategy for a specific project</em> (glossary wording; fst4 sample question 8 asks exactly this).</li>
</ul>
<p class="nhan">The seven major types (slides 30–36)</p>
<ol>
<li>Analytical</li>
<li>Model-based</li>
<li>Methodical</li>
<li>Process- / standard-compliant</li>
<li>Directed (consultative)</li>
<li>Regression-averse</li>
<li>Reactive (dynamic)</li>
</ol>
<p>Real projects combine several — e.g. analytical risk-based + reactive exploratory + regression-averse automation.</p>`,
        `<p class="y-chinh">🎯 Strategy là của cả tổ chức; approach là strategy đó áp vào một dự án.</p>
<p class="nhan">Hai định nghĩa</p>
<ul>
<li><strong>Test strategy</strong> (chiến lược test của tổ chức) — tài liệu nêu các yêu cầu <em>chung</em> cho việc kiểm thử một hay nhiều dự án trong tổ chức: kiểm thử được thực hiện thế nào. Nó phù hợp với <strong>test policy</strong>.</li>
<li><strong>Test approach</strong> — <em>việc hiện thực chiến lược cho một dự án cụ thể</em> (đúng chữ trong glossary; câu hỏi mẫu 8 của fst4 hỏi đúng điều này).</li>
</ul>
<p class="nhan">Bảy loại chính (slide 30–36)</p>
<ol>
<li>Analytical (phân tích)</li>
<li>Model-based (dựa mô hình)</li>
<li>Methodical (có phương pháp)</li>
<li>Process- / standard-compliant (theo quy trình / tiêu chuẩn)</li>
<li>Directed (consultative — tư vấn)</li>
<li>Regression-averse (né hồi quy)</li>
<li>Reactive (dynamic — phản ứng)</li>
</ol>
<p>Dự án thật thường phối hợp nhiều loại — vd analytical theo rủi ro + reactive exploratory + regression-averse tự động hoá.</p>`],
      [30, 'Test Strategy: Analytical',
        `<p class="y-chinh">🎯 Analytical: tests come from an <strong>analysis of some factor</strong> — risk or requirements.</p>
<p class="nhan">Two flavours</p>
<ul>
<li><strong>Risk-based</strong> — tests are designed and prioritised by risk level (lesson 7.5).</li>
<li><strong>Requirements-based</strong> — analysing the requirements specification drives planning, estimating and design.</li>
</ul>
<p class="nhan">Common characteristics</p>
<ul>
<li>Formal or informal <strong>analytical techniques</strong>.</li>
<li>Usually applied during the <strong>requirements and design</strong> stages.</li>
</ul>
<p class="nhan">The chain in the notes (risk-based)</p>
<ol>
<li>Risk analysis from project documents and stakeholder input</li>
<li>Planning</li>
<li>Estimating</li>
<li>Designing and prioritising the tests by risk</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> keyword in questions "<em>based on the level of risk</em>" → analytical.</p>`,
        `<p class="y-chinh">🎯 Analytical: test sinh ra từ việc <strong>phân tích một yếu tố</strong> — rủi ro hoặc yêu cầu.</p>
<p class="nhan">Hai dạng</p>
<ul>
<li><strong>Risk-based</strong> — test được thiết kế và ưu tiên theo mức rủi ro (bài 7.5).</li>
<li><strong>Requirements-based</strong> — việc phân tích đặc tả yêu cầu dẫn dắt lập kế hoạch, ước lượng và thiết kế.</li>
</ul>
<p class="nhan">Đặc điểm chung</p>
<ul>
<li>Dùng <strong>kỹ thuật phân tích</strong> chính thức hoặc không chính thức.</li>
<li>Thường ở giai đoạn <strong>yêu cầu và thiết kế</strong>.</li>
</ul>
<p class="nhan">Chuỗi trong ghi chú (risk-based)</p>
<ol>
<li>Phân tích rủi ro từ tài liệu dự án và ý kiến các bên</li>
<li>Lập kế hoạch</li>
<li>Ước lượng</li>
<li>Thiết kế và ưu tiên test theo rủi ro</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> từ khoá trong đề "<em>theo mức rủi ro</em>" → analytical.</p>`],
      [31, 'Test Strategy: Model-based',
        `<p class="y-chinh">🎯 Model-based: tests are designed from a <strong>model</strong> of some required aspect of the product.</p>
<p class="nhan">What can be modelled</p>
<ul>
<li>A function, a business process, an internal structure, or a non-functional characteristic.</li>
</ul>
<p class="nhan">Common characteristic</p>
<ul>
<li>Creating or selecting a formal/informal <strong>model of critical behaviour</strong>, again during requirements and design.</li>
</ul>
<p class="nhan">Examples</p>
<ul>
<li><strong>Business process models</strong></li>
<li><strong>State models</strong></li>
<li><strong>Reliability growth models</strong> — predict how failure rates fall as defects are removed.</li>
<li><strong>Operational profiles</strong> for performance tests are also models.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> keyword "<em>based on a state diagram / model</em>" → model-based (slide 52, description A).</p>`,
        `<p class="y-chinh">🎯 Model-based: test được thiết kế từ một <strong>mô hình</strong> của khía cạnh cần có của sản phẩm.</p>
<p class="nhan">Mô hình hoá cái gì</p>
<ul>
<li>Một chức năng, quy trình nghiệp vụ, cấu trúc bên trong, hoặc một đặc tính phi chức năng.</li>
</ul>
<p class="nhan">Đặc điểm chung</p>
<ul>
<li>Tạo hoặc chọn một <strong>mô hình cho các hành vi quan trọng</strong> (chính thức/không chính thức), cũng trong giai đoạn yêu cầu và thiết kế.</li>
</ul>
<p class="nhan">Ví dụ</p>
<ul>
<li><strong>Mô hình quy trình nghiệp vụ</strong></li>
<li><strong>Mô hình trạng thái</strong></li>
<li><strong>Mô hình tăng trưởng độ tin cậy</strong> — dự đoán tỉ lệ failure giảm thế nào khi defect được gỡ.</li>
<li><strong>Hồ sơ vận hành</strong> (operational profile) cho test hiệu năng cũng là mô hình.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> từ khoá "<em>dựa trên sơ đồ trạng thái / mô hình</em>" → model-based (slide 52, mô tả A).</p>`],
      [32, 'Test Strategy: Methodical',
        `<p class="y-chinh">🎯 Methodical: systematic use of a <strong>predefined set of tests or test conditions</strong>.</p>
<p class="nhan">Typical predefined lists</p>
<ul>
<li>A <strong>taxonomy</strong> of common or likely failures</li>
<li>A list of important <strong>quality characteristics</strong></li>
<li>Company-wide <strong>look-and-feel standards</strong> for web pages</li>
</ul>
<p class="nhan">Common characteristics</p>
<ul>
<li>Adherence to a <strong>pre-planned, systematised</strong> approach.</li>
<li>Involvement may be <strong>early or late</strong>.</li>
</ul>
<p class="nhan">What the notes add</p>
<p>You may have a checklist collected over years, or follow an industry standard for software quality such as <strong>ISO/IEC 25010</strong> to outline the main test areas. You then design and run tests methodically against that outline — hence slide 57's answer.</p>`,
        `<p class="y-chinh">🎯 Methodical: dùng có hệ thống một <strong>tập test hoặc test condition định sẵn</strong>.</p>
<p class="nhan">Các danh sách định sẵn điển hình</p>
<ul>
<li>Bảng <strong>phân loại</strong> các loại lỗi thường gặp</li>
<li>Danh sách các <strong>đặc tính chất lượng</strong> quan trọng</li>
<li><strong>Chuẩn giao diện chung</strong> của công ty cho trang web</li>
</ul>
<p class="nhan">Đặc điểm chung</p>
<ul>
<li>Bám theo một cách làm <strong>đã lên sẵn, có hệ thống</strong>.</li>
<li>Có thể tham gia <strong>sớm hoặc muộn</strong>.</li>
</ul>
<p class="nhan">Ghi chú bổ sung</p>
<p>Bạn có thể có một checklist tích luỹ qua nhiều năm, hoặc theo một chuẩn ngành về chất lượng phần mềm như <strong>ISO/IEC 25010</strong> để phác ra các mảng test chính. Rồi thiết kế và chạy test một cách có phương pháp theo dàn ý đó — vì vậy slide 57 có đáp án như vậy.</p>`],
      [33, 'Test Strategy: Process- / Standard-Compliant',
        `<p class="y-chinh">🎯 Process- / standard-compliant: tests are analysed, designed and implemented from <strong>external rules and standards</strong>.</p>
<p class="nhan">Where the rules come from</p>
<ul>
<li><strong>Industry-specific standards</strong></li>
<li><strong>Process documentation</strong></li>
<li>The rules of a <strong>methodology</strong> — the syllabus even counts rigorous agile rules here.</li>
</ul>
<p class="nhan">Common characteristics</p>
<ul>
<li>Reliance on an <em>externally developed</em> approach, often with little or no customisation.</li>
<li>Involvement may be early or late.</li>
</ul>
<p class="nhan">Good to know</p>
<ul>
<li><strong>Typo on the slide</strong> — "ISO/IEC/IEEE 2911903" means <strong>ISO/IEC/IEEE 29119-3</strong>, the test documentation part of the 29119 series.</li>
<li><strong>When to pick it</strong> — the notes to slide 37: a smart choice when your team lacks the time or skills to invent its own approach.</li>
</ul>`,
        `<p class="y-chinh">🎯 Process- / standard-compliant: phân tích, thiết kế và cài đặt test theo <strong>quy tắc và tiêu chuẩn bên ngoài</strong>.</p>
<p class="nhan">Quy tắc lấy từ đâu</p>
<ul>
<li><strong>Chuẩn riêng của ngành</strong></li>
<li><strong>Tài liệu quy trình</strong></li>
<li>Quy tắc của một <strong>phương pháp luận</strong> — syllabus xếp cả các quy tắc agile chặt chẽ vào đây.</li>
</ul>
<p class="nhan">Đặc điểm chung</p>
<ul>
<li>Dựa vào cách làm <em>do bên ngoài xây dựng</em>, thường ít hoặc không tuỳ biến.</li>
<li>Có thể tham gia sớm hoặc muộn.</li>
</ul>
<p class="nhan">Nên biết</p>
<ul>
<li><strong>Lỗi đánh máy trên slide</strong> — "ISO/IEC/IEEE 2911903" nghĩa là <strong>ISO/IEC/IEEE 29119-3</strong>, phần tài liệu test trong bộ 29119.</li>
<li><strong>Khi nào nên chọn</strong> — ghi chú slide 37: lựa chọn khôn ngoan khi nhóm thiếu thời gian hay kỹ năng để tự xây cách tiếp cận riêng.</li>
</ul>`],
      [34, 'Test Strategy: Directed (Consultative)',
        `<p class="y-chinh">🎯 Directed (consultative): testing is driven by the <strong>advice, guidance or instructions</strong> of people who are not testers.</p>
<p class="nhan">Whose advice</p>
<ul>
<li><strong>Stakeholders</strong>, <strong>business-domain experts</strong> or <strong>technology experts</strong> — possibly outside the test team or even outside the organisation.</li>
</ul>
<p class="nhan">Common characteristics</p>
<ul>
<li>Reliance on a group of <em>non-testers</em> to guide or perform the testing.</li>
<li>Typically emphasises the <strong>later test stages</strong> (acceptance).</li>
</ul>
<p class="nhan">When it helps (teacher's note)</p>
<p>A start-up with little testing expertise — e.g. an external expert advises on security testing.</p>
<p class="meo">🧠 <strong>Remember:</strong> keyword "<em>chosen based on the views of business domain experts</em>" → consultative.</p>`,
        `<p class="y-chinh">🎯 Directed (consultative): việc test do <strong>lời khuyên, hướng dẫn hoặc chỉ thị</strong> của những người không phải tester dẫn dắt.</p>
<p class="nhan">Lời khuyên của ai</p>
<ul>
<li><strong>Các bên liên quan</strong>, <strong>chuyên gia nghiệp vụ</strong> hoặc <strong>chuyên gia công nghệ</strong> — có thể ở ngoài nhóm test, thậm chí ngoài tổ chức.</li>
</ul>
<p class="nhan">Đặc điểm chung</p>
<ul>
<li>Dựa vào một nhóm <em>không phải tester</em> để định hướng hoặc thực hiện kiểm thử.</li>
<li>Thường nhấn vào các <strong>giai đoạn test muộn</strong> (acceptance).</li>
</ul>
<p class="nhan">Khi nào hữu ích (ghi chú của thầy/cô)</p>
<p>Công ty khởi nghiệp ít kinh nghiệm kiểm thử — vd một chuyên gia bên ngoài tư vấn về kiểm thử bảo mật.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> từ khoá "<em>chọn theo ý kiến chuyên gia nghiệp vụ</em>" → consultative.</p>`],
      [35, 'Test Strategy: Regression-averse',
        `<p class="y-chinh">🎯 Regression-averse: motivated by the desire to <strong>avoid regression</strong> of existing capabilities.</p>
<p class="nhan">What it uses</p>
<ul>
<li>Extensive <strong>automated regression tests</strong></li>
<li><strong>Standard test suites</strong></li>
<li><strong>Reuse of existing tests and test data</strong></li>
</ul>
<p class="nhan">Common characteristics</p>
<ul>
<li>A set of (often automated) procedures that <strong>detect regression defects</strong>.</li>
<li>Early testing, sometimes also <strong>post-release</strong> involvement.</li>
</ul>
<p class="nhan">Best fit (slide 37 notes)</p>
<p>A well-established application evolving slowly, where regression is the main risk.</p>
<p class="ghi-chu">The note's Vietnamese translation "không thích hồi quy" = "averse to regression".</p>`,
        `<p class="y-chinh">🎯 Regression-averse: xuất phát từ mong muốn <strong>tránh hồi quy</strong> các chức năng đã có.</p>
<p class="nhan">Dùng những gì</p>
<ul>
<li>Dùng rộng rãi <strong>test hồi quy tự động</strong></li>
<li><strong>Bộ test chuẩn</strong></li>
<li><strong>Tái sử dụng test và dữ liệu test cũ</strong></li>
</ul>
<p class="nhan">Đặc điểm chung</p>
<ul>
<li>Một bộ quy trình (thường tự động) để <strong>phát hiện lỗi hồi quy</strong>.</li>
<li>Test sớm, đôi khi tham gia cả <strong>sau phát hành</strong>.</li>
</ul>
<p class="nhan">Hợp nhất khi (ghi chú slide 37)</p>
<p>Ứng dụng đã ổn định, thay đổi chậm, nơi hồi quy là rủi ro chính.</p>
<p class="ghi-chu">Ghi chú dịch "không thích hồi quy" = "né hồi quy".</p>`],
      [36, 'Test Strategy: Reactive (Dynamic)',
        `<p class="y-chinh">🎯 Reactive (dynamic): testing <strong>reacts</strong> to the system and to events during execution instead of being pre-planned.</p>
<ul>
<li><strong>Not pre-planned</strong> — unlike all the previous strategies, it follows the component or system under test and what happens while tests run.</li>
<li><strong>Design on the fly</strong> — tests are designed and implemented, and may be executed immediately, in response to knowledge gained from earlier results.</li>
<li><strong>Exploratory testing</strong> — the common technique (lesson on experience-based techniques).</li>
</ul>
<p class="nhan">Best fit (slide 37 notes)</p>
<p>The objective is to find as many defects as possible with minimal up-front effort — e.g. at an independent test lab.</p>`,
        `<p class="y-chinh">🎯 Reactive (dynamic): việc test <strong>phản ứng</strong> theo hệ thống và sự kiện trong lúc chạy, thay vì lên kế hoạch trước.</p>
<ul>
<li><strong>Không lên kế hoạch trước</strong> — khác mọi chiến lược trước, nó bám theo thành phần/hệ thống đang test và những gì xảy ra lúc chạy test.</li>
<li><strong>Thiết kế tại chỗ</strong> — test được thiết kế, cài đặt và có thể chạy ngay dựa trên hiểu biết thu được từ kết quả trước đó.</li>
<li><strong>Exploratory testing</strong> — kỹ thuật hay dùng (xem bài kỹ thuật dựa kinh nghiệm).</li>
</ul>
<p class="nhan">Hợp nhất khi (ghi chú slide 37)</p>
<p>Mục tiêu là tìm càng nhiều defect càng tốt với ít công chuẩn bị — vd ở một phòng lab test độc lập.</p>`],
      [37, 'Test Strategy & Test Approach — factors to consider',
        `<p class="y-chinh">🎯 Six factors decide which strategy fits; the approach turns that strategy into concrete choices.</p>
<p class="nhan">The diagram</p>
<p><strong>Test strategy → Test approach →</strong> {test cases, test types, test techniques}.</p>
<p class="nhan">Six factors and the strategy each points to (notes)</p>
<ol>
<li><strong>Risks</strong> — an old, slowly evolving application → regression-averse; a new one → risk-based analytical.</li>
<li><strong>Skills</strong> — a strategy must be executable; if the team lacks time and skills, a standard-compliant strategy is smart.</li>
<li><strong>Objectives</strong> — "find as many defects as possible with minimal up-front effort" → reactive.</li>
<li><strong>Regulations</strong> — satisfying regulators → a methodical strategy that proves every requirement was covered.</li>
<li><strong>Product</strong> — weapons systems or contract software with well-specified requirements → requirements-based analytical.</li>
<li><strong>Business</strong> — if a legacy system can serve as a model for the new one → model-based.</li>
</ol>`,
        `<p class="y-chinh">🎯 Sáu yếu tố quyết định chiến lược nào hợp; approach biến chiến lược đó thành các lựa chọn cụ thể.</p>
<p class="nhan">Sơ đồ</p>
<p><strong>Test strategy → Test approach →</strong> {test case, loại test, kỹ thuật test}.</p>
<p class="nhan">Sáu yếu tố và chiến lược tương ứng (ghi chú)</p>
<ol>
<li><strong>Rủi ro</strong> — ứng dụng lâu năm, thay đổi chậm → regression-averse; ứng dụng mới → analytical theo rủi ro.</li>
<li><strong>Kỹ năng</strong> — chiến lược phải làm được; nhóm thiếu thời gian và kỹ năng thì chọn standard-compliant là khôn.</li>
<li><strong>Mục tiêu</strong> — "tìm càng nhiều defect càng tốt với ít công chuẩn bị" → reactive.</li>
<li><strong>Quy định</strong> — phải thoả cơ quan quản lý → chiến lược methodical chứng minh mọi yêu cầu đều được phủ.</li>
<li><strong>Sản phẩm</strong> — hệ thống vũ khí hay phần mềm theo hợp đồng có yêu cầu rõ ràng → analytical theo yêu cầu.</li>
<li><strong>Kinh doanh</strong> — nếu hệ thống cũ làm mô hình được cho hệ thống mới → model-based.</li>
</ol>`],
      [38, 'Entry Criteria (definition of ready)',
        `<p class="y-chinh">🎯 <strong>Entry criteria</strong> — in Agile the "definition of ready" — are the <strong>preconditions</strong> for starting a test activity.</p>
<p class="nhan">Typical entry criteria — availability of…</p>
<ol>
<li><em>Testable</em> requirements, user stories and/or models</li>
<li>Test items that have met the <em>exit criteria of the previous level</em></li>
<li>The test environment</li>
<li>The necessary test tools</li>
<li>Test data and other resources</li>
<li>Staff</li>
<li>The test object itself</li>
</ol>
<p class="nhan">Why they matter (notes)</p>
<ul>
<li><strong>Typical start-up problem</strong> — "something needed is not actually ready", and then testing gets blamed for the delay.</li>
<li><strong>The fix</strong> — enforcing (or at least discussing) entry criteria makes the risk visible early.</li>
</ul>`,
        `<p class="y-chinh">🎯 <strong>Entry criteria</strong> (tiêu chí bắt đầu) — trong Agile là "definition of ready" — là <strong>điều kiện tiên quyết</strong> để bắt đầu một hoạt động test.</p>
<p class="nhan">Entry criteria điển hình — đã có…</p>
<ol>
<li>Yêu cầu, user story và/hoặc mô hình <em>test được</em></li>
<li>Hạng mục test đã đạt <em>exit criteria của cấp trước</em></li>
<li>Môi trường test</li>
<li>Công cụ test cần thiết</li>
<li>Dữ liệu test và nguồn lực khác</li>
<li>Nhân sự</li>
<li>Chính đối tượng test</li>
</ol>
<p class="nhan">Vì sao quan trọng (ghi chú)</p>
<ul>
<li><strong>Rắc rối điển hình lúc khởi động</strong> — "thứ cần thiết chưa thực sự sẵn sàng", rồi kiểm thử lại bị đổ lỗi gây trễ.</li>
<li><strong>Cách chữa</strong> — áp dụng (hoặc ít nhất bàn trước) entry criteria giúp rủi ro lộ ra sớm.</li>
</ul>`],
      [39, 'Exit Criteria (definition of done)',
        `<p class="y-chinh">🎯 <strong>Exit criteria</strong> — "definition of done" — define what must be achieved to declare a test level or a set of tests <strong>completed</strong>.</p>
<p class="nhan">Seven typical exit criteria</p>
<ol>
<li><strong>Tests</strong> — planned tests have been executed.</li>
<li><strong>Coverage</strong> — a defined level has been reached.</li>
<li><strong>Defects</strong> — unresolved defects within an agreed limit, and estimated remaining defects sufficiently low.</li>
<li><strong>Quality</strong> — important quality characteristics are adequate.</li>
<li><strong>Money</strong> — the cost of finding the next defect now vs in the next level.</li>
<li><strong>Schedule</strong> — implications of starting or ending testing.</li>
<li><strong>Risk</strong> — the undesirable outcome of shipping too early or too late.</li>
</ol>
<p class="nhan">Worth remembering (notes)</p>
<ul>
<li><strong>Stopped, not finished</strong> — in practice testing is often <em>stopped rather than finished</em>, because time pressure wins.</li>
<li><strong>Documented criteria help</strong> — you can at least show stakeholders what was not completed.</li>
<li><strong>Who decides to release anyway</strong> — stakeholders and business owners, after they <em>review and accept the risks</em>.</li>
</ul>`,
        `<p class="y-chinh">🎯 <strong>Exit criteria</strong> (tiêu chí kết thúc) — "definition of done" — xác định phải đạt gì để tuyên bố một cấp test hoặc một tập test đã <strong>hoàn thành</strong>.</p>
<p class="nhan">Bảy exit criteria điển hình</p>
<ol>
<li><strong>Tests</strong> — đã chạy hết test đã lên kế hoạch.</li>
<li><strong>Coverage</strong> — đạt mức bao phủ đã định.</li>
<li><strong>Defects</strong> — số defect chưa giải quyết trong giới hạn đã thoả thuận, và số defect ước tính còn lại đủ thấp.</li>
<li><strong>Quality</strong> — các đặc tính chất lượng quan trọng đạt yêu cầu.</li>
<li><strong>Money</strong> — chi phí tìm defect kế tiếp bây giờ so với ở cấp sau.</li>
<li><strong>Schedule</strong> — ảnh hưởng tới lịch khi bắt đầu hay kết thúc test.</li>
<li><strong>Risk</strong> — hậu quả xấu của việc giao quá sớm hoặc quá muộn.</li>
</ol>
<p class="nhan">Rất đáng nhớ (ghi chú)</p>
<ul>
<li><strong>Dừng chứ không phải xong</strong> — thực tế kiểm thử thường bị <em>dừng lại chứ không phải hoàn thành</em>, vì áp lực thời gian thắng.</li>
<li><strong>Có tiêu chí viết ra thì đỡ</strong> — ít nhất bạn cho các bên thấy phần nào chưa xong.</li>
<li><strong>Ai quyết định vẫn phát hành</strong> — các bên liên quan và chủ doanh nghiệp, sau khi <em>xem xét và chấp nhận rủi ro</em>.</li>
</ul>`],
      [40, 'Test Execution Schedule',
        `<p class="y-chinh">🎯 Run tests by priority — but a lower-priority test that a higher-priority test depends on must run first.</p>
<p class="nhan">The diagram</p>
<p><strong>test cases → test procedures → test suites → test execution schedule</strong>.</p>
<p class="nhan">The rule (learn it word for word)</p>
<ul>
<li><em>Ideally, test cases are ordered by their priority levels.</em></li>
<li><em>If a test case with a higher priority depends on a test case with a lower priority, the lower-priority test case must be executed first.</em></li>
</ul>
<p class="nhan">Factors behind the schedule (notes)</p>
<ol>
<li><strong>Priorities</strong> — from risk analysis.</li>
<li><strong>Dependencies</strong> — technical or logical, between tests or suites.</li>
<li><strong>Type of test</strong> — confirmation tests after fixes, regression tests.</li>
</ol>
<p class="nhan">Example and who does it</p>
<ul>
<li><strong>Set-up test first</strong> — several high-priority tests depend on one low-priority test that sets up essential data: the low-priority test runs first, even under a strict risk-first policy.</li>
<li><strong>Author</strong> — usually the <em>tester or test team</em>, balancing efficiency, test priority and the objective of the moment.</li>
</ul>
<p>The full algorithm is in the worked example below.</p>`,
        `<p class="y-chinh">🎯 Chạy test theo ưu tiên — nhưng test ưu tiên thấp mà test ưu tiên cao phụ thuộc vào thì phải chạy trước.</p>
<p class="nhan">Sơ đồ</p>
<p><strong>test case → test procedure → test suite → lịch thực thi test</strong>.</p>
<p class="nhan">Quy tắc (học thuộc từng chữ)</p>
<ul>
<li><em>Lý tưởng là sắp test case theo mức ưu tiên.</em></li>
<li><em>Nếu một test case ưu tiên cao phụ thuộc vào một test case ưu tiên thấp hơn thì test case ưu tiên thấp phải chạy trước.</em></li>
</ul>
<p class="nhan">Các yếu tố quyết định lịch (ghi chú)</p>
<ol>
<li><strong>Độ ưu tiên</strong> — từ phân tích rủi ro.</li>
<li><strong>Phụ thuộc</strong> — kỹ thuật hoặc logic, giữa các test/suite.</li>
<li><strong>Loại test</strong> — confirmation test sau khi sửa, regression test.</li>
</ol>
<p class="nhan">Ví dụ và ai lập lịch</p>
<ul>
<li><strong>Test dựng dữ liệu chạy trước</strong> — nhiều test ưu tiên cao cùng phụ thuộc vào một test ưu tiên thấp dùng để dựng dữ liệu cần thiết: test ưu tiên thấp phải chạy trước, kể cả khi chính sách là rủi ro-trước-tiên.</li>
<li><strong>Người lập</strong> — thường là <em>tester hoặc nhóm test</em>, cân bằng giữa hiệu quả, độ ưu tiên và mục tiêu lúc đó.</li>
</ul>
<p>Thuật toán đầy đủ ở phần ví dụ có lời giải bên dưới.</p>`],
      [41, 'Mind map (divider) — Test Effort Factors',
        `<p class="y-chinh">🎯 The map again, now pointing at <em>Test Effort Factors</em> — four groups, one per slide (42–45).</p>
<ol>
<li>Product characteristics</li>
<li>Development-process characteristics</li>
<li>People characteristics</li>
<li>Test results</li>
</ol>`,
        `<p class="y-chinh">🎯 Lại sơ đồ, giờ chỉ vào <em>Test Effort Factors</em> — bốn nhóm, mỗi nhóm một slide (42–45).</p>
<ol>
<li>Đặc điểm sản phẩm</li>
<li>Đặc điểm quy trình phát triển</li>
<li>Đặc điểm con người</li>
<li>Kết quả test</li>
</ol>`],
      [42, 'Factors Influencing Test Effort — 1. Product characteristics',
        `<p class="y-chinh">🎯 The product itself drives test effort: six characteristics on the slide, plus one from the syllabus.</p>
<ol>
<li><strong>Risks</strong> of the product — higher risk → a wrong, especially an under-, estimate hurts more.</li>
<li><strong>Quality of the test basis</strong> — good documentation tells testers what correct behaviour is, so tests are defined faster.</li>
<li><strong>Size</strong> of the product — bigger product → bigger project and team → harder to predict and manage.</li>
<li><strong>Requirements for quality characteristics</strong> — usability, reliability, security, performance tests are expensive and slow.</li>
<li><strong>Complexity of the product domain</strong> — avionics, oil exploration; innovative technologies "long on hyperbole and short on proven track records".</li>
<li><strong>Required level of detail of documentation</strong> — meticulously specified test cases cost a lot of effort.</li>
<li><strong>Legal and regulatory compliance</strong> requirements — added in the syllabus.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chính sản phẩm quyết định công sức test: sáu đặc điểm trên slide, cộng một đặc điểm từ syllabus.</p>
<ol>
<li><strong>Rủi ro</strong> của sản phẩm — rủi ro cao → ước lượng sai, nhất là ước lượng thiếu, càng tai hại.</li>
<li><strong>Chất lượng test basis</strong> — tài liệu tốt cho tester biết thế nào là đúng nên định nghĩa test nhanh hơn.</li>
<li><strong>Kích thước</strong> sản phẩm — sản phẩm lớn → dự án và nhóm lớn → khó dự đoán và quản lý.</li>
<li><strong>Yêu cầu về đặc tính chất lượng</strong> — test usability, độ tin cậy, bảo mật, hiệu năng vừa đắt vừa lâu.</li>
<li><strong>Độ phức tạp của lĩnh vực</strong> — hàng không, thăm dò dầu khí; công nghệ mới "quảng cáo thì nhiều mà thành tích thì ít".</li>
<li><strong>Mức chi tiết tài liệu yêu cầu</strong> — test case đặc tả tỉ mỉ tốn rất nhiều công.</li>
<li><strong>Yêu cầu tuân thủ pháp lý</strong> — syllabus bổ sung.</li>
</ol>`],
      [43, 'Factors Influencing Test Effort — 2. Development process characteristics',
        `<p class="y-chinh">🎯 How the organisation develops and tests changes the effort: six process characteristics.</p>
<ol>
<li><strong>Stability and maturity of the organisation</strong> — mature organisations write better requirements, architecture and unit tests → less test effort later.</li>
<li><strong>Development model</strong> — the V-model is fragile under late change; Agile has high regression costs.</li>
<li><strong>Test approach</strong> — a poor approach takes longer.</li>
<li><strong>Tools</strong> — execution tools cut run time; debugging tools and a dedicated debugging environment shorten the cycle.</li>
<li><strong>Test process</strong> — a well-understood process with trained testers is optimal.</li>
<li><strong>Time pressure</strong> — a reason to plan and re-plan intelligently, not to skip thinking.</li>
</ol>`,
        `<p class="y-chinh">🎯 Cách tổ chức phát triển và kiểm thử làm thay đổi công sức: sáu đặc điểm quy trình.</p>
<ol>
<li><strong>Mức ổn định và trưởng thành của tổ chức</strong> — tổ chức trưởng thành viết yêu cầu, kiến trúc, unit test tốt hơn → đỡ công test về sau.</li>
<li><strong>Mô hình phát triển</strong> — V-model dễ vỡ khi thay đổi muộn; Agile có chi phí regression cao.</li>
<li><strong>Cách tiếp cận test</strong> — cách kém thì tốn thời gian hơn.</li>
<li><strong>Công cụ</strong> — công cụ thực thi rút ngắn thời gian chạy; công cụ và môi trường debug riêng rút ngắn vòng lặp.</li>
<li><strong>Quy trình test</strong> — quy trình rõ ràng và tester được đào tạo là tối ưu.</li>
<li><strong>Áp lực thời gian</strong> — là lý do để lập kế hoạch và điều chỉnh thông minh, chứ không phải để bỏ qua suy nghĩ.</li>
</ol>`],
      [44, 'Factors Influencing Test Effort — 3. People characteristics',
        `<p class="y-chinh">🎯 Who does the testing matters: two people characteristics.</p>
<ul>
<li><strong>Skills and experience</strong> of the people involved — especially with <em>similar projects and products</em> (domain knowledge).</li>
<li><strong>Team cohesion and leadership</strong>.</li>
</ul>
<p>A cohesive, experienced team can need half the effort of a newly assembled one on the same product.</p>`,
        `<p class="y-chinh">🎯 Ai làm test cũng quan trọng: hai đặc điểm con người.</p>
<ul>
<li><strong>Kỹ năng và kinh nghiệm</strong> của những người tham gia — nhất là với <em>dự án và sản phẩm tương tự</em> (hiểu nghiệp vụ).</li>
<li><strong>Sự gắn kết và khả năng lãnh đạo của nhóm</strong>.</li>
</ul>
<p>Một nhóm gắn bó, giàu kinh nghiệm có thể chỉ cần một nửa công sức so với nhóm mới ghép trên cùng một sản phẩm.</p>`],
      [45, 'Factors Influencing Test Effort — 4. Test results',
        `<p class="y-chinh">🎯 What testing finds feeds back into the effort: two test-result factors.</p>
<ul>
<li><strong>Number and severity of defects found</strong>.</li>
<li><strong>Amount of rework required</strong>.</li>
</ul>
<p class="nhan">Why it adds up</p>
<ul>
<li><strong>Each defect</strong> means a report, a fix, a confirmation test and regression tests.</li>
<li><strong>A buggy product</strong> therefore consumes far more test effort than planned — which is why the estimate is revisited during monitoring (lesson 7.3).</li>
</ul>`,
        `<p class="y-chinh">🎯 Những gì test tìm ra quay lại ảnh hưởng công sức: hai yếu tố kết quả test.</p>
<ul>
<li><strong>Số lượng và mức nghiêm trọng của defect tìm được</strong>.</li>
<li><strong>Khối lượng làm lại</strong>.</li>
</ul>
<p class="nhan">Vì sao cộng dồn</p>
<ul>
<li><strong>Mỗi defect</strong> kéo theo một báo cáo, một bản sửa, một confirmation test và các regression test.</li>
<li><strong>Sản phẩm nhiều lỗi</strong> vì thế ngốn công test hơn hẳn kế hoạch — nên ước lượng được xem lại trong lúc giám sát (bài 7.3).</li>
</ul>`],
      [46, 'Mind map (divider) — Estimation Techniques',
        `<p class="y-chinh">🎯 The map again, now at <em>Estimation Techniques</em> — two families, two examples each.</p>
<ul>
<li><strong>Metric-based</strong> — burn-down chart, defect-removal model.</li>
<li><strong>Expert-based</strong> — planning poker, Wideband Delphi.</li>
</ul>`,
        `<p class="y-chinh">🎯 Lại sơ đồ, giờ tới <em>Estimation Techniques</em> — hai họ, mỗi họ hai ví dụ.</p>
<ul>
<li><strong>Metric-based</strong> — burn-down chart, defect-removal model.</li>
<li><strong>Expert-based</strong> — planning poker, Wideband Delphi.</li>
</ul>`],
      [47, 'Test Estimation Techniques',
        `<p class="y-chinh">🎯 The syllabus has two estimation families: from past data, or from people's judgement.</p>
<ul>
<li><strong>Metrics-based</strong> — estimate from <em>metrics of past (similar) projects</em> or from industry data.</li>
<li><strong>Expert-based</strong> — estimate by <em>consulting the people who will do the work</em> and other experts on the tasks.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> metrics = numbers from history; expert = judgement of people.</p>`,
        `<p class="y-chinh">🎯 Syllabus có hai họ kỹ thuật ước lượng: dựa dữ liệu quá khứ, hoặc dựa phán đoán của con người.</p>
<ul>
<li><strong>Metrics-based</strong> — ước lượng từ <em>số liệu của các dự án (tương tự) trước đây</em> hoặc số liệu ngành.</li>
<li><strong>Expert-based</strong> — ước lượng bằng cách <em>hỏi ý kiến những người sẽ làm việc đó</em> và các chuyên gia khác.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> metrics = con số từ lịch sử; expert = phán đoán của con người.</p>`],
      [48, 'Metrics-based Estimation Techniques',
        `<p class="y-chinh">🎯 Metrics-based estimation turns historical or industry numbers into an estimate — simply or with a model.</p>
<p class="nhan">Two ways to analyse the metrics</p>
<ul>
<li><strong>Tester-to-developer ratio</strong> (top-down) — "we usually have 1 tester per 4 developers".</li>
<li><strong>Mathematical models</strong> (bottom-up) — historical or industry averages for key parameters (tests run per tester per day, defects found per tester per day) predict the duration and effort of each activity.</li>
</ul>
<p class="nhan">Commonly used techniques</p>
<ul>
<li><strong>Burndown chart</strong> (Agile) — notes: the effort actually spent is captured and fed into the team's <em>velocity</em>, which predicts how much the next sprint can take.</li>
<li><strong>Defect removal models</strong> (sequential development) — data from previous projects on the number of defects and the time to remove them.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ước lượng metrics-based biến con số lịch sử hoặc của ngành thành ước lượng — theo cách đơn giản hoặc bằng mô hình.</p>
<p class="nhan">Hai cách phân tích số liệu</p>
<ul>
<li><strong>Tỉ lệ tester/developer</strong> (từ trên xuống) — "thường 1 tester cho 4 developer".</li>
<li><strong>Mô hình toán học</strong> (từ dưới lên) — trung bình lịch sử hoặc của ngành cho các tham số chính (số test một tester chạy mỗi ngày, số defect một tester tìm mỗi ngày) để dự đoán thời lượng và công sức từng hoạt động.</li>
</ul>
<p class="nhan">Kỹ thuật hay dùng</p>
<ul>
<li><strong>Burndown chart</strong> (Agile) — ghi chú: công sức thực tế được ghi lại và đưa vào <em>velocity</em> của nhóm, từ đó dự đoán sprint sau nhận được bao nhiêu việc.</li>
<li><strong>Defect removal model</strong> (phát triển tuần tự) — dữ liệu dự án trước về số defect và thời gian gỡ chúng.</li>
</ul>`],
      [49, 'Expert-based Estimation Techniques',
        `<p class="y-chinh">🎯 Expert-based estimation draws on the collective wisdom of the team, built up bottom-up from a WBS.</p>
<p class="nhan">How it works</p>
<ul>
<li><strong>Work breakdown structure</strong> (WBS) — individual contributors and experts work with experienced staff to build it.</li>
<li><strong>Bottom-up</strong> — start at the lowest level of the breakdown and let duration, effort, dependencies and resources of each task add up.</li>
</ul>
<p class="nhan">Commonly used techniques</p>
<ul>
<li><strong>Planning poker</strong> (Agile) — each member estimates a story's effort from his own experience, and all reveal cards at once.</li>
<li><strong>Wideband Delphi</strong> (sequential) — groups of experts estimate anonymously; results are aggregated, discussed and re-estimated for several rounds.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> both are expert-based even though they produce numbers.</p>`,
        `<p class="y-chinh">🎯 Ước lượng expert-based tận dụng trí tuệ tập thể của nhóm, cộng dồn từ dưới lên theo một WBS.</p>
<p class="nhan">Cách làm</p>
<ul>
<li><strong>Cấu trúc phân rã công việc</strong> (WBS) — người thực hiện và chuyên gia cùng nhân viên giàu kinh nghiệm xây nó.</li>
<li><strong>Từ dưới lên</strong> — bắt đầu ở mức thấp nhất của cây phân rã và cộng dồn thời lượng, công sức, phụ thuộc và nguồn lực của từng việc.</li>
</ul>
<p class="nhan">Kỹ thuật hay dùng</p>
<ul>
<li><strong>Planning poker</strong> (Agile) — mỗi thành viên ước lượng một story theo kinh nghiệm của mình, rồi cùng lật bài một lúc.</li>
<li><strong>Wideband Delphi</strong> (tuần tự) — các nhóm chuyên gia ước lượng ẩn danh; kết quả được gộp, thảo luận rồi ước lượng lại qua nhiều vòng.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cả hai đều là expert-based dù chúng cho ra con số.</p>`],
      [50, 'Question — what can affect and be part of test planning?',
        `<p class="y-chinh">🎯 Only what is decided <em>during planning</em> counts — check each option against slide 28.</p>
<ul>
<li><strong>A (budget limitations)</strong> — budgeting is a planning activity (slide 28), and a budget limit shapes the whole plan.</li>
<li><strong>B (test objectives)</strong> — determining objectives is also on the slide 28 list.</li>
<li><strong>C (test log) and D (failure rate)</strong> — produced during execution and monitoring; they may trigger <em>re</em>-planning but are not part of planning.</li>
<li><strong>E (use cases)</strong> — test basis for analysis and design.</li>
</ul>
<p class="ghi-chu">The slide gives five options without "choose two"; if you must pick one, "test objectives" is the core part of any test plan.</p>
<p class="dap-an">✅ <strong>Answer: A and B — Budget limitations and test objectives.</strong></p>`,
        `<p class="y-chinh">🎯 Chỉ tính những gì được quyết định <em>khi lập kế hoạch</em> — đối chiếu từng phương án với slide 28.</p>
<ul>
<li><strong>A (giới hạn ngân sách)</strong> — lập ngân sách là một hoạt động lập kế hoạch (slide 28), và giới hạn ngân sách định hình cả plan.</li>
<li><strong>B (mục tiêu test)</strong> — xác định mục tiêu cũng nằm trong danh sách slide 28.</li>
<li><strong>C (test log) và D (tỉ lệ failure)</strong> — sinh ra khi thực thi và giám sát; có thể dẫn tới lập kế hoạch <em>lại</em> nhưng không phải một phần của lập kế hoạch.</li>
<li><strong>E (use case)</strong> — là test basis cho phân tích và thiết kế.</li>
</ul>
<p class="ghi-chu">Slide cho năm phương án mà không ghi "chọn hai"; nếu buộc chọn một, "mục tiêu test" là phần cốt lõi của mọi test plan.</p>
<p class="dap-an">✅ <strong>Đáp án: A và B — Giới hạn ngân sách và mục tiêu test.</strong></p>`],
      [51, 'Question — typical exit criteria',
        `<p class="y-chinh">🎯 The right option contains only items from slide 39 — one wrong item disqualifies an option.</p>
<ul>
<li><strong>C</strong> — every item is on slide 39: quality, money, schedule, defects.</li>
<li><strong>A and D</strong> — contain the degree of tester independence and tester qualification: organisational facts, not exit criteria.</li>
<li><strong>B</strong> — contains "availability of testable code", which is an <em>entry</em> criterion.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Reliability measures, test cost, schedule and unresolved defects.</strong></p>`,
        `<p class="y-chinh">🎯 Phương án đúng chỉ chứa các mục có trên slide 39 — lẫn một mục sai là loại.</p>
<ul>
<li><strong>C</strong> — mọi mục đều có trên slide 39: chất lượng, tiền, lịch, defect.</li>
<li><strong>A và D</strong> — chứa mức độc lập và trình độ của tester: là thông tin tổ chức, không phải exit criteria.</li>
<li><strong>B</strong> — chứa "có code test được", đó là <em>entry</em> criterion.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Số đo độ tin cậy, chi phí test, lịch và số defect chưa giải quyết.</strong></p>`],
      [52, 'Question — match strategies 1–4 with descriptions A–D',
        `<p class="y-chinh">🎯 Match each strategy by its keyword (slides 30–34).</p>
<ol>
<li><strong>Analytical</strong> → B — designed and prioritised by level of risk.</li>
<li><strong>Methodical</strong> → C — systematic use of a predefined set of test conditions.</li>
<li><strong>Model-based</strong> → A — based on a state diagram.</li>
<li><strong>Consultative</strong> → D — chosen from the views of business-domain experts.</li>
</ol>
<p class="dap-an">✅ <strong>Answer: d — 1B, 2C, 3A, 4D.</strong></p>`,
        `<p class="y-chinh">🎯 Ghép từng chiến lược theo từ khoá của nó (slide 30–34).</p>
<ol>
<li><strong>Analytical</strong> → B — thiết kế và ưu tiên theo mức rủi ro.</li>
<li><strong>Methodical</strong> → C — dùng có hệ thống một tập test condition định sẵn.</li>
<li><strong>Model-based</strong> → A — dựa trên sơ đồ trạng thái.</li>
<li><strong>Consultative</strong> → D — chọn theo ý kiến chuyên gia nghiệp vụ.</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án: d — 1B, 2C, 3A, 4D.</strong></p>`],
      [53, 'Question — characteristic of metrics-based estimation',
        `<p class="y-chinh">🎯 Metrics-based means historical data; asking people is expert-based.</p>
<ul>
<li><strong>A</strong> — historical data from a similar project is the definition of metrics-based.</li>
<li><strong>B</strong> (interviews with test managers), <strong>C</strong> (agreed with developers), <strong>D</strong> (collected from business experts) — all consultations of people: expert-based, even when an average is computed.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Budget which was used by a previous similar test project.</strong></p>`,
        `<p class="y-chinh">🎯 Metrics-based là dữ liệu lịch sử; hỏi ý kiến người là expert-based.</p>
<ul>
<li><strong>A</strong> — dữ liệu lịch sử của dự án tương tự chính là định nghĩa của metrics-based.</li>
<li><strong>B</strong> (phỏng vấn test manager), <strong>C</strong> (thống nhất với developer), <strong>D</strong> (thu từ chuyên gia nghiệp vụ) — đều là hỏi ý kiến con người: expert-based, kể cả khi có tính trung bình.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Ngân sách đã dùng cho một dự án test tương tự trước đây.</strong></p>`],
      [54, 'Question — schedule seven requirements by their dependencies',
        `<p class="y-chinh">🎯 Read every arrow first, then keep the only option that respects them all and lists each requirement once.</p>
<p class="nhan">Step 1 — read the diagram</p>
<ul>
<li><strong>R1 → R3</strong> and <strong>R1 → R2</strong>.</li>
<li><strong>R3 → R2</strong> — the arrow from R3 goes down into the R2 box.</li>
<li><strong>Inside the box</strong> — R2 → R5 and R2 → R6.</li>
<li><strong>The whole R2 box</strong> → R4 and R7.</li>
</ul>
<p class="nhan">Step 2 — what each needs</p>
<ul>
<li>R1 has no predecessor; R3 needs R1; R2 needs R1 and R3; R5/R6 need R2; R4/R7 need the box.</li>
</ul>
<p class="nhan">Step 3 — eliminate</p>
<ul>
<li><strong>A and B</strong> — test a requirement twice (R1, R2); a schedule lists each once.</li>
<li><strong>D</strong> — runs R2 before R3, breaking R3 → R2.</li>
<li><strong>C</strong> — respects all of that.</li>
</ul>
<p class="ghi-chu">Checked by script: C valid, D "R2 before its dep R3".</p>
<p class="dap-an">✅ <strong>Answer: C — R1 → R3 → R2 → R5 → R6 → R4 → R7.</strong></p>`,
        `<p class="y-chinh">🎯 Đọc hết các mũi tên trước, rồi giữ lại phương án duy nhất tôn trọng tất cả và mỗi yêu cầu chỉ xuất hiện một lần.</p>
<p class="nhan">Bước 1 — đọc sơ đồ</p>
<ul>
<li><strong>R1 → R3</strong> và <strong>R1 → R2</strong>.</li>
<li><strong>R3 → R2</strong> — mũi tên từ R3 đi xuống ô R2.</li>
<li><strong>Trong ô</strong> — R2 → R5 và R2 → R6.</li>
<li><strong>Cả ô R2</strong> → R4 và R7.</li>
</ul>
<p class="nhan">Bước 2 — mỗi yêu cầu cần gì</p>
<ul>
<li>R1 không phụ thuộc gì; R3 cần R1; R2 cần R1 và R3; R5/R6 cần R2; R4/R7 cần cả ô.</li>
</ul>
<p class="nhan">Bước 3 — loại trừ</p>
<ul>
<li><strong>A và B</strong> — test một yêu cầu hai lần (R1, R2); lịch chỉ liệt kê mỗi cái một lần.</li>
<li><strong>D</strong> — chạy R2 trước R3, vi phạm R3 → R2.</li>
<li><strong>C</strong> — thoả tất cả.</li>
</ul>
<p class="ghi-chu">Đã kiểm bằng script: C hợp lệ, D "R2 before its dep R3".</p>
<p class="dap-an">✅ <strong>Đáp án: C — R1 → R3 → R2 → R5 → R6 → R4 → R7.</strong></p>`],
      [55, 'Question — where should test case guidelines be documented?',
        `<p class="y-chinh">🎯 "Level of detail and structure for test documentation" is decided in planning, so it belongs in the test plan.</p>
<ul>
<li><strong>B (test plan)</strong> — deciding the level of detail and structure of test documentation is a planning activity (slide 28), and its result is written in the test plan. Inconsistent test cases mean the plan did not set that standard.</li>
<li><strong>A (test approach)</strong> — the strategy applied to the project (levels, techniques), not documentation rules.</li>
<li><strong>C (test case template)</strong> — gives the fields, not how much detail to write.</li>
<li><strong>D (project plan)</strong> — does not cover test documentation.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — The test plan.</strong></p>`,
        `<p class="y-chinh">🎯 "Mức chi tiết và cấu trúc tài liệu test" được quyết định khi lập kế hoạch, nên nó nằm trong test plan.</p>
<ul>
<li><strong>B (test plan)</strong> — quyết định mức chi tiết và cấu trúc tài liệu test là một hoạt động lập kế hoạch (slide 28), và kết quả được ghi trong test plan. Test case không nhất quán nghĩa là plan chưa đặt ra chuẩn đó.</li>
<li><strong>A (test approach)</strong> — là chiến lược áp vào dự án (cấp, kỹ thuật), không phải quy tắc tài liệu.</li>
<li><strong>C (mẫu test case)</strong> — cho biết các trường, không nói phải viết chi tiết tới đâu.</li>
<li><strong>D (project plan)</strong> — không bao tài liệu test.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Test plan.</strong></p>`],
      [56, 'Question — best order: by risk, feedback as soon as possible',
        `<p class="y-chinh">🎯 First eliminate every order that breaks a dependency — only one survives, and it also follows the risk rule.</p>
<p class="nhan">Step 1 — dependencies from the table</p>
<ul>
<li>1 needs 6 · 3 needs 1 · 4 needs 2 · 5 needs 4 · 6 needs 2 · 2 needs nothing.</li>
<li>So <strong>2 must run first</strong>.</li>
</ul>
<p class="nhan">Step 2 — eliminate</p>
<ul>
<li><strong>A</strong> (starts with 4) — impossible. Script: "3 before its dep 1; 4 before its dep 2".</li>
<li><strong>C</strong> — runs 5 before 4, but 5 depends on 4. Script: "5 before its dep 4".</li>
<li><strong>D</strong> (starts with 6) — impossible. Script: "6 before its dep 2".</li>
<li><strong>B</strong> — the only valid order (script: B valid).</li>
</ul>
<p class="nhan">Step 3 — B also follows the risk rule greedily</p>
<ol>
<li><strong>2</strong> — the only runnable test.</li>
<li><strong>4</strong> — high risk.</li>
<li><strong>5</strong> — medium, only 10 minutes (quick feedback).</li>
<li><strong>6 → 1 → 3</strong> — the chain needed to reach the high-risk test 3.</li>
</ol>
<p class="ghi-chu">Applying the "inherit the priority of your dependants" rule strictly gives 2, 4, 6, 1, 3, 5 — not offered, so B is the answer.</p>
<p class="dap-an">✅ <strong>Answer: B — 2, 4, 5, 6, 1, 3.</strong></p>`,
        `<p class="y-chinh">🎯 Loại trước mọi thứ tự vi phạm phụ thuộc — chỉ còn một, và nó cũng theo quy tắc rủi ro.</p>
<p class="nhan">Bước 1 — phụ thuộc trong bảng</p>
<ul>
<li>1 cần 6 · 3 cần 1 · 4 cần 2 · 5 cần 4 · 6 cần 2 · 2 không cần gì.</li>
<li>Vậy <strong>2 phải chạy đầu</strong>.</li>
</ul>
<p class="nhan">Bước 2 — loại trừ</p>
<ul>
<li><strong>A</strong> (bắt đầu bằng 4) — không thể. Script: "3 before its dep 1; 4 before its dep 2".</li>
<li><strong>C</strong> — chạy 5 trước 4, nhưng 5 phụ thuộc 4. Script: "5 before its dep 4".</li>
<li><strong>D</strong> (bắt đầu bằng 6) — không thể. Script: "6 before its dep 2".</li>
<li><strong>B</strong> — thứ tự hợp lệ duy nhất (script: B valid).</li>
</ul>
<p class="nhan">Bước 3 — B cũng theo quy tắc rủi ro kiểu tham lam</p>
<ol>
<li><strong>2</strong> — test duy nhất chạy được.</li>
<li><strong>4</strong> — rủi ro cao.</li>
<li><strong>5</strong> — mức trung bình, chỉ 10 phút (phản hồi nhanh).</li>
<li><strong>6 → 1 → 3</strong> — chuỗi cần thiết để tới được test rủi ro cao số 3.</li>
</ol>
<p class="ghi-chu">Áp chặt quy tắc "kế thừa độ ưu tiên của test phụ thuộc vào mình" sẽ ra 2, 4, 6, 1, 3, 5 — không có trong phương án, nên đáp án là B.</p>
<p class="dap-an">✅ <strong>Đáp án: B — 2, 4, 5, 6, 1, 3.</strong></p>`],
      [57, 'Question — strategy based on the ISO 25010 list',
        `<p class="y-chinh">🎯 A predefined list of quality characteristics, worked through systematically, is the methodical strategy.</p>
<ul>
<li><strong>C (methodical)</strong> — slide 32 and its notes name ISO/IEC 25010 explicitly.</li>
<li><strong>A (regulatory)</strong> — not one of the seven names; the nearest is standard-compliant, which follows external rules for <em>how</em> to test.</li>
<li><strong>B (analytical)</strong> — analyses risks or requirements.</li>
<li><strong>D (reactive)</strong> — reacts to the running system.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Methodical.</strong></p>`,
        `<p class="y-chinh">🎯 Đi có hệ thống qua một danh sách đặc tính chất lượng định sẵn là chiến lược methodical.</p>
<ul>
<li><strong>C (methodical)</strong> — slide 32 và ghi chú của nó nêu đích danh ISO/IEC 25010.</li>
<li><strong>A (regulatory)</strong> — không phải tên nào trong bảy loại; gần nhất là standard-compliant — theo quy tắc bên ngoài về <em>cách</em> test.</li>
<li><strong>B (analytical)</strong> — phân tích rủi ro hay yêu cầu.</li>
<li><strong>D (reactive)</strong> — phản ứng theo hệ thống đang chạy.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Methodical.</strong></p>`],
      [58, 'Question — estimating another upgrade of a known ERP system',
        `<p class="y-chinh">🎯 You own reliable history for a very similar job — that is exactly what metrics-based estimation needs.</p>
<ul>
<li><strong>C (metric-based)</strong> — your team tested the previous upgrade and it has been in production for years: you have reliable historical data (effort, defects, duration) for a very similar job.</li>
<li><strong>B (expert-based)</strong> — possible, but weaker when good data exist.</li>
<li><strong>A (effort-based) and D (schedule-based)</strong> — not syllabus techniques.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Metric-based.</strong></p>`,
        `<p class="y-chinh">🎯 Bạn có dữ liệu lịch sử đáng tin cho một việc rất giống — đúng thứ ước lượng metrics-based cần.</p>
<ul>
<li><strong>C (metric-based)</strong> — nhóm bạn đã test bản nâng cấp trước và nó chạy thật nhiều năm: bạn có dữ liệu lịch sử đáng tin (công sức, defect, thời lượng) cho một việc rất giống.</li>
<li><strong>B (expert-based)</strong> — vẫn dùng được, nhưng yếu hơn khi đã có dữ liệu tốt.</li>
<li><strong>A (effort-based) và D (schedule-based)</strong> — không phải kỹ thuật trong syllabus.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Metric-based.</strong></p>`],
    ]),
    bi(`<h3>🔒 Hidden slide in SWT5_tim.pptx (not shown in class, still worth knowing)</h3>
<p><strong>pptx slide 60 — one more execution-schedule question</strong> (placed after slide 58). "Consider the following test cases that are used to test an accounting system. What is the proper order in which to execute these test cases?"</p>
<table>
<thead><tr><th>Test ID</th><th>Name</th><th>Dependency</th><th>Priority</th></tr></thead>
<tbody>
<tr><td>1</td><td>Purchase Item</td><td>none</td><td>2</td></tr>
<tr><td>2</td><td>Receive Invoice</td><td>Test 1</td><td>3</td></tr>
<tr><td>3</td><td>Receive Goods</td><td>Test 1</td><td>2</td></tr>
<tr><td>4</td><td>Send Payment</td><td>Test 2</td><td>3</td></tr>
<tr><td>5</td><td>Report Payments</td><td>Test 4</td><td>1</td></tr>
</tbody>
</table>
<p class="nhan">Options</p>
<ul>
<li><strong>a)</strong> 5, 1, 3, 2, 4</li>
<li><strong>b)</strong> 1, 2, 4, 3, 5</li>
<li><strong>c)</strong> 1, 3, 2, 4, 5</li>
<li><strong>d)</strong> 3, 4, 5, 1, 2</li>
</ul>
<p class="nhan">Solution</p>
<ul>
<li><strong>a and d</strong> — break dependencies (5 needs 4; 3 needs 1).</li>
<li><strong>Priority scale</strong> — in this question <em>3 is the highest priority</em> (paying invoices matters more than the payment report).</li>
<li><strong>Order</strong> — after 1, run the priority-3 chain 2 → 4, then 3 (priority 2), then 5 (priority 1).</li>
<li><strong>Script check</strong> — with "3 = highest", both the greedy and the inheritance rule give 1, 2, 4, 3, 5.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: b — 1, 2, 4, 3, 5.</strong></p>
<p class="meo">🧠 <strong>Remember:</strong> if you assume "1 = highest", no option is ideal (the correct order would be 1, 2, 4, 5, 3) — always read the priority scale first.</p>`,
    `<h3>🔒 Slide ẩn trong file SWT5_tim.pptx (không chiếu trên lớp nhưng vẫn nên biết)</h3>
<p><strong>Slide pptx 60 — thêm một câu lập lịch thực thi</strong> (nằm sau slide 58). "Cho các test case dùng để test một hệ thống kế toán. Thứ tự đúng để thực thi chúng là gì?"</p>
<table>
<thead><tr><th>Test ID</th><th>Tên</th><th>Phụ thuộc</th><th>Ưu tiên</th></tr></thead>
<tbody>
<tr><td>1</td><td>Purchase Item (mua hàng)</td><td>không</td><td>2</td></tr>
<tr><td>2</td><td>Receive Invoice (nhận hoá đơn)</td><td>Test 1</td><td>3</td></tr>
<tr><td>3</td><td>Receive Goods (nhận hàng)</td><td>Test 1</td><td>2</td></tr>
<tr><td>4</td><td>Send Payment (thanh toán)</td><td>Test 2</td><td>3</td></tr>
<tr><td>5</td><td>Report Payments (báo cáo thanh toán)</td><td>Test 4</td><td>1</td></tr>
</tbody>
</table>
<p class="nhan">Phương án</p>
<ul>
<li><strong>a)</strong> 5, 1, 3, 2, 4</li>
<li><strong>b)</strong> 1, 2, 4, 3, 5</li>
<li><strong>c)</strong> 1, 3, 2, 4, 5</li>
<li><strong>d)</strong> 3, 4, 5, 1, 2</li>
</ul>
<p class="nhan">Lời giải</p>
<ul>
<li><strong>a và d</strong> — vi phạm phụ thuộc (5 cần 4; 3 cần 1).</li>
<li><strong>Thang ưu tiên</strong> — trong câu này <em>3 là mức ưu tiên cao nhất</em> (trả tiền hoá đơn quan trọng hơn báo cáo thanh toán).</li>
<li><strong>Thứ tự</strong> — sau 1, chạy chuỗi ưu tiên 3 là 2 → 4, rồi 3 (ưu tiên 2), cuối cùng 5 (ưu tiên 1).</li>
<li><strong>Script kiểm</strong> — với "3 = cao nhất", cả cách tham lam lẫn quy tắc kế thừa đều cho 1, 2, 4, 3, 5.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: b — 1, 2, 4, 3, 5.</strong></p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nếu mặc định "1 = cao nhất" thì không phương án nào lý tưởng (thứ tự đúng khi đó là 1, 2, 4, 5, 3) — luôn đọc thang ưu tiên trước.</p>`),
    bi(`<h3>Ví dụ có lời giải · Worked example 1 — build a test execution schedule (K3)</h3>
<p>A webshop release; priority <strong>1 = highest</strong>. Arrows mean "must run after".</p>
<table>
<thead><tr><th>Test</th><th>Priority</th><th>Depends on</th></tr></thead>
<tbody>
<tr><td>A Create customer</td><td>3</td><td>—</td></tr>
<tr><td>B Place order</td><td>1</td><td>A</td></tr>
<tr><td>C Print invoice</td><td>2</td><td>B</td></tr>
<tr><td>D Search products</td><td>2</td><td>—</td></tr>
<tr><td>E Change password</td><td>3</td><td>—</td></tr>
<tr><td>F Configure tax rates</td><td>3</td><td>—</td></tr>
<tr><td>G Monthly tax report</td><td>1</td><td>C, F</td></tr>
</tbody>
</table>
<p><strong>Step 1 — propagate priorities backwards (slide 40's rule).</strong> A test that a higher-priority test depends on must run before it, so it effectively "inherits" that priority. A enables B (1) → effective 1. C enables G (1) → 1. F enables G → 1. B and G are 1 themselves. D stays 2, E stays 3.</p>
<p><strong>Step 2 — repeatedly pick the runnable test with the best effective priority</strong> (ties: its own priority, then the one that unblocks sooner).</p>
<table>
<thead><tr><th>Slot</th><th>Runnable now</th><th>Chosen</th><th>Why</th></tr></thead>
<tbody>
<tr><td>1</td><td>A(eff 1), D(2), E(3), F(eff 1)</td><td>A</td><td>eff 1; unlocks B (priority 1) immediately</td></tr>
<tr><td>2</td><td>B(1), D, E, F(eff 1)</td><td>B</td><td>own priority 1</td></tr>
<tr><td>3</td><td>C(eff 1, own 2), D, E, F(eff 1, own 3)</td><td>C</td><td>tie on eff 1 → better own priority</td></tr>
<tr><td>4</td><td>D, E, F(eff 1)</td><td>F</td><td>needed by G</td></tr>
<tr><td>5</td><td>D, E, G(1)</td><td>G</td><td>priority 1</td></tr>
<tr><td>6–7</td><td>D(2), E(3)</td><td>D, then E</td><td>by priority</td></tr>
</tbody>
</table>
<p>Our scheduling script (ch7/sched.mjs) prints:</p>
<pre><code>effective rank: A Create customer=1 B Place order=1 C Print invoice=1 D Search products=2 E Change password=3 F Configure tax rates=1 G Monthly tax report=1
with inheritance: A Create customer, B Place order, C Print invoice, F Configure tax rates, G Monthly tax report, D Search products, E Change password
plain greedy    : D Search products, A Create customer, B Place order, C Print invoice, E Change password, F Configure tax rates, G Monthly tax report</code></pre>
<p>The "plain greedy" line shows the classic mistake: looking only at each test's own priority starts with D (priority 2) and pushes the priority-1 tax report to the very end, behind a priority-3 test. The same script re-checks the book exercise (fst4 Table 5.3 → solution Table 5.4, p.201: De-activate, Delete, Provide extra data, Edit extra data, Edit basic, Link) and gives exactly the book's order.</p>
<h3>Worked example 2 — three estimates for the same release</h3>
<p><strong>Metrics-based.</strong> Release 1 had 450 test cases and cost 135 person-days of testing → 0.3 pd per test case. Release 2 has 600 → <strong>180 pd</strong>. Ratio check: last time 1 tester per 4 developers; the team now has 16 developers → <strong>4 testers</strong>. Defect-removal model: release 1 found 180 defects in 60 KLOC (3 per KLOC); release 2 is 80 KLOC → 240 expected defects × 1.5 h (report + confirmation + regression) = 360 h = <strong>45 pd</strong> of defect-related test work.</p>
<p><strong>Expert-based — Wideband Delphi.</strong> Four experts estimate the system-test effort anonymously (person-days):</p>
<pre><code>[ 20, 28, 35, 60 ] mean 35.75 spread 40 spread/mean 111.9%
[ 30, 32, 35, 38 ] mean 33.75 spread 8 spread/mean 23.7%</code></pre>
<p>Round 1 is far apart; the 20 and the 60 explain their assumptions (the 60 counted a full performance test, the 20 forgot data migration). Round 2 converges; the team adopts about <strong>34 pd</strong>. <strong>Planning poker</strong> does the same with cards (1, 2, 3, 5, 8, 13, 21…) in a sprint: everybody reveals at once, the highest and lowest explain, the team re-votes.</p>
<p><strong>Three-point estimation</strong> (not in CTFL 2018, added in CTFL v4.0): for each task take optimistic a, most likely m, pessimistic b; E = (a + 4m + b) / 6, SD = (b − a) / 6.</p>
<pre><code>Test analysis &amp; design 4 6 11 -&gt; E = 6.5 SD = 1.17
Test implementation 2 3 7 -&gt; E = 3.5 SD = 0.83
Test execution incl. re-tests 6 9 18 -&gt; E = 10 SD = 2
total E = 20 SD(total) = 2.46 range 17.54 - 22.46</code></pre>
<p>So the plan says "about 20 days, realistically 17.5–22.5". Adding the three tasks bottom-up is exactly slide 49's WBS idea.</p>
<div class="pitfall co-tieu-de"><strong>Exam traps.</strong>
<ol>
<li><strong>Schedule questions</strong> — first eliminate every option that breaks a dependency or repeats a test; usually only one survives.</li>
<li><strong>Priority scale</strong> — check it: is 1 or 3 the highest?</li>
<li><strong>Estimation families</strong> — planning poker and Wideband Delphi are <strong>expert-based</strong>; burndown charts and defect-removal models are <strong>metrics-based</strong>.</li>
<li><strong>Entry vs exit</strong> — "availability of the test environment" is an <strong>entry</strong> criterion; "number of unresolved defects" is an <strong>exit</strong> criterion.</li>
<li><strong>Approach vs strategy</strong> — the test <em>approach</em> is project-specific; the test <em>strategy</em> is organisation-wide.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The cone of uncertainty.</strong> Studies by Barry Boehm and Steve McConnell show that estimates made at the idea stage can be off by a factor of 4 in either direction, narrowing to about ±10 % only near the end of design. That is why good test plans give ranges (as the three-point example does), are re-estimated at each milestone, and why metrics-based estimates must be calibrated with the organisation's <em>own</em> history, not industry averages alone. <em>Outside the syllabus because CTFL only asks you to tell the two estimation families apart.</em></div>`,
    `<h3>Ví dụ có lời giải · Ví dụ 1 — dựng lịch thực thi test (K3)</h3>
<p>Một bản phát hành webshop; ưu tiên <strong>1 = cao nhất</strong>. Cột phụ thuộc nghĩa là "phải chạy sau".</p>
<table>
<thead><tr><th>Test</th><th>Ưu tiên</th><th>Phụ thuộc</th></tr></thead>
<tbody>
<tr><td>A Tạo khách hàng</td><td>3</td><td>—</td></tr>
<tr><td>B Đặt hàng</td><td>1</td><td>A</td></tr>
<tr><td>C In hoá đơn</td><td>2</td><td>B</td></tr>
<tr><td>D Tìm sản phẩm</td><td>2</td><td>—</td></tr>
<tr><td>E Đổi mật khẩu</td><td>3</td><td>—</td></tr>
<tr><td>F Cấu hình thuế suất</td><td>3</td><td>—</td></tr>
<tr><td>G Báo cáo thuế tháng</td><td>1</td><td>C, F</td></tr>
</tbody>
</table>
<p><strong>Bước 1 — lan truyền ưu tiên ngược lại (quy tắc slide 40).</strong> Test mà một test ưu tiên cao hơn phụ thuộc vào thì phải chạy trước nó, nên coi như "kế thừa" ưu tiên đó. A mở đường cho B (1) → hiệu dụng 1. C mở đường cho G (1) → 1. F mở đường cho G → 1. B và G tự là 1. D giữ 2, E giữ 3.</p>
<p><strong>Bước 2 — lặp lại: chọn test đang chạy được có ưu tiên hiệu dụng tốt nhất</strong> (hoà thì xét ưu tiên gốc, rồi test nào gỡ chặn sớm hơn).</p>
<table>
<thead><tr><th>Lượt</th><th>Đang chạy được</th><th>Chọn</th><th>Lý do</th></tr></thead>
<tbody>
<tr><td>1</td><td>A(hd 1), D(2), E(3), F(hd 1)</td><td>A</td><td>hiệu dụng 1; mở ngay B (ưu tiên 1)</td></tr>
<tr><td>2</td><td>B(1), D, E, F(hd 1)</td><td>B</td><td>ưu tiên gốc 1</td></tr>
<tr><td>3</td><td>C(hd 1, gốc 2), D, E, F(hd 1, gốc 3)</td><td>C</td><td>hoà hiệu dụng 1 → ưu tiên gốc tốt hơn</td></tr>
<tr><td>4</td><td>D, E, F(hd 1)</td><td>F</td><td>G cần nó</td></tr>
<tr><td>5</td><td>D, E, G(1)</td><td>G</td><td>ưu tiên 1</td></tr>
<tr><td>6–7</td><td>D(2), E(3)</td><td>D rồi E</td><td>theo ưu tiên</td></tr>
</tbody>
</table>
<p>Script lập lịch (ch7/sched.mjs) in ra:</p>
<pre><code>effective rank: A Create customer=1 B Place order=1 C Print invoice=1 D Search products=2 E Change password=3 F Configure tax rates=1 G Monthly tax report=1
with inheritance: A Create customer, B Place order, C Print invoice, F Configure tax rates, G Monthly tax report, D Search products, E Change password
plain greedy    : D Search products, A Create customer, B Place order, C Print invoice, E Change password, F Configure tax rates, G Monthly tax report</code></pre>
<p>Dòng "plain greedy" cho thấy lỗi kinh điển: chỉ nhìn ưu tiên gốc của từng test thì bắt đầu bằng D (ưu tiên 2) và đẩy báo cáo thuế ưu tiên 1 xuống tận cuối, sau cả một test ưu tiên 3. Cùng script kiểm lại bài tập trong sách (fst4 Table 5.3 → lời giải Table 5.4, trang 201: De-activate, Delete, Provide extra data, Edit extra data, Edit basic, Link) và cho đúng thứ tự của sách.</p>
<h3>Ví dụ 2 — ba cách ước lượng cho cùng một bản phát hành</h3>
<p><strong>Dựa trên số liệu.</strong> Bản 1 có 450 test case và tốn 135 ngày-công test → 0,3 ngày-công mỗi test case. Bản 2 có 600 → <strong>180 ngày-công</strong>. Kiểm bằng tỉ lệ: lần trước 1 tester cho 4 developer; giờ nhóm có 16 developer → <strong>4 tester</strong>. Defect-removal model: bản 1 tìm 180 defect trên 60 KLOC (3 defect/KLOC); bản 2 là 80 KLOC → dự kiến 240 defect × 1,5 giờ (báo cáo + confirmation + regression) = 360 giờ = <strong>45 ngày-công</strong> cho phần việc liên quan defect.</p>
<p><strong>Dựa trên chuyên gia — Wideband Delphi.</strong> Bốn chuyên gia ước lượng ẩn danh công sức system test (ngày-công):</p>
<pre><code>[ 20, 28, 35, 60 ] mean 35.75 spread 40 spread/mean 111.9%
[ 30, 32, 35, 38 ] mean 33.75 spread 8 spread/mean 23.7%</code></pre>
<p>Vòng 1 chênh nhau quá xa; người ghi 20 và người ghi 60 giải thích giả định (người 60 tính cả một đợt test hiệu năng, người 20 quên phần chuyển đổi dữ liệu). Vòng 2 hội tụ; nhóm chốt khoảng <strong>34 ngày-công</strong>. <strong>Planning poker</strong> làm điều tương tự bằng bộ bài (1, 2, 3, 5, 8, 13, 21…) trong sprint: mọi người lật bài cùng lúc, người cao nhất và thấp nhất giải thích, cả nhóm bỏ phiếu lại.</p>
<p><strong>Ước lượng ba điểm</strong> (không có trong CTFL 2018, được thêm ở CTFL v4.0): mỗi việc lấy lạc quan a, khả dĩ nhất m, bi quan b; E = (a + 4m + b) / 6, SD = (b − a) / 6.</p>
<pre><code>Test analysis &amp; design 4 6 11 -&gt; E = 6.5 SD = 1.17
Test implementation 2 3 7 -&gt; E = 3.5 SD = 0.83
Test execution incl. re-tests 6 9 18 -&gt; E = 10 SD = 2
total E = 20 SD(total) = 2.46 range 17.54 - 22.46</code></pre>
<p>Vậy plan ghi "khoảng 20 ngày, thực tế 17,5–22,5". Cộng ba việc từ dưới lên chính là ý tưởng WBS ở slide 49.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy đề thi.</strong>
<ol>
<li><strong>Câu lập lịch</strong> — loại trước mọi phương án vi phạm phụ thuộc hoặc lặp test; thường chỉ còn một.</li>
<li><strong>Thang ưu tiên</strong> — xem kỹ: 1 hay 3 là cao nhất?</li>
<li><strong>Họ ước lượng</strong> — planning poker và Wideband Delphi là <strong>expert-based</strong>; burndown chart và defect-removal model là <strong>metrics-based</strong>.</li>
<li><strong>Entry hay exit</strong> — "có môi trường test" là <strong>entry</strong> criterion; "số defect chưa giải quyết" là <strong>exit</strong> criterion.</li>
<li><strong>Approach hay strategy</strong> — test <em>approach</em> gắn với một dự án; test <em>strategy</em> là của cả tổ chức.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Nón bất định (cone of uncertainty).</strong> Nghiên cứu của Barry Boehm và Steve McConnell cho thấy ước lượng ở giai đoạn ý tưởng có thể lệch tới 4 lần theo cả hai chiều, và chỉ thu hẹp còn khoảng ±10 % khi gần xong thiết kế. Vì thế test plan tốt đưa ra khoảng (như ví dụ ba điểm), ước lượng lại ở mỗi mốc, và ước lượng dựa số liệu phải hiệu chỉnh bằng lịch sử <em>của chính tổ chức</em>, không chỉ trung bình ngành. <em>Ngoài giáo trình vì CTFL chỉ yêu cầu phân biệt hai họ kỹ thuật ước lượng.</em></div>`),
    books([
      ['fst4', 'Ch.5 §2 "Test planning and estimation" — pp.161–175 (PDF 175–189); sample questions 4–8, 17, 19–20 pp.197–199 (PDF 211–213); exercise "Test execution schedule" Table 5.3 p.200 and solution Table 5.4 p.201 (PDF 214–215)', 'Chương 5 §2 "Test planning and estimation" — trang 161–175 (PDF 175–189); câu hỏi mẫu 4–8, 17, 19–20 trang 197–199 (PDF 211–213); bài tập "Test execution schedule" Table 5.3 trang 200 và lời giải Table 5.4 trang 201 (PDF 214–215)'],
      ['fst', '§5.2 "Test plans, estimates and strategies" — book pp.≈130–140 (PDF 133–143)', '§5.2 "Test plans, estimates and strategies" — trang sách ≈130–140 (PDF 133–143)'],
      ['sp5', '§6.2 "Testing Strategies": §6.2.1 Test Planning (PDF 256), §6.2.2 Selecting a Testing Strategy (PDF 259), §6.2.3 Concrete Strategies (PDF 262), §6.2.5 Testing Effort and Costs (PDF 267), §6.2.6 Estimating Testing Effort (PDF 269); §6.3.1 Test Execution Planning (PDF 273–278)', '§6.2 "Testing Strategies": §6.2.1 Test Planning (PDF 256), §6.2.2 Selecting a Testing Strategy (PDF 259), §6.2.3 Concrete Strategies (PDF 262), §6.2.5 Testing Effort and Costs (PDF 267), §6.2.6 Estimating Testing Effort (PDF 269); §6.3.1 Test Execution Planning (PDF 273–278)'],
      ['sp4', '§6.2 "Test Planning" (test plan p.175, prioritising tests p.177, entry/exit criteria p.179), §6.3 "Cost and Economy Aspects" (estimation p.184), §6.4 "Choosing the Test Strategy and Test Approach" — pp.174–189 (PDF 189–204)', '§6.2 "Test Planning" (test plan trang 175, ưu tiên test trang 177, entry/exit trang 179), §6.3 "Cost and Economy Aspects" (ước lượng trang 184), §6.4 "Choosing the Test Strategy and Test Approach" — trang 174–189 (PDF 189–204)'],
    ]),
  ].join('\n'),
};

/* ─────────────────── 7.3 Test monitoring & control, metrics, reports ─────────────────── */
const L73 = {
  title: '7.3 — Test monitoring & control: metrics, progress and summary reports|||7.3 — Giám sát & kiểm soát test: số đo, báo cáo tiến độ và báo cáo tổng kết',
  slug: 'swt301-test-monitoring-control',
  type: 'VIDEO',
  description: 'SWT5 slide 59–73: monitoring vs control, ví dụ hành động kiểm soát, mục đích và các số đo thường dùng, test progress report vs test summary report (nội dung theo IEEE 829 / ISO 29119-3, đối tượng đọc) — kèm đáp án 4 câu hỏi trên slide.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.3 · SWT5 slides 59–73</span>
<h2>Test monitoring &amp; control — measure, report, steer</h2>
<p class="lead">A plan is only a guess about the future. <strong>Monitoring</strong> compares what is really happening with the plan; <strong>control</strong> is what you do about the difference. Metrics feed both, and <strong>test reports</strong> carry the information to people who decide.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-5.3.1</strong> Recall metrics used for testing (K1)</li>
<li><strong>LO-5.3.2</strong> Summarise the purposes, contents and audiences for test reports (K2)</li>
</ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Plan</div><div class="lz-t">targets &amp; exit criteria</div><div class="lz-d">200 tests in 4 weeks, 0 open critical defects</div></div>
  <div class="lz-step"><div class="lz-k">→ Monitor</div><div class="lz-t">gather metrics</div><div class="lz-d">70 run, 52 passed, 17 defects open</div></div>
  <div class="lz-step"><div class="lz-k">→ Report</div><div class="lz-t">progress report</div><div class="lz-d">"35% done vs 50% planned"</div></div>
  <div class="lz-step"><div class="lz-k">→ Control</div><div class="lz-t">corrective action</div><div class="lz-d">re-prioritise, add a tester, move a date</div></div>
  <div class="lz-step"><div class="lz-k">→ Summary report</div><div class="lz-t">at the end</div><div class="lz-d">what was tested, residual risks, go/no-go</div></div>
</div>
<table>
<thead><tr><th></th><th>Test progress report</th><th>Test summary report</th></tr></thead>
<tbody>
<tr><td>When</td><td>regularly <em>during</em> a test activity (daily, weekly)</td><td>at the <em>end</em> of a test activity / test level / project</td></tr>
<tr><td>Leads to</td><td>test control actions</td><td>release / completion decisions, lessons learned</td></tr>
<tr><td>Only here</td><td>testing planned for the <em>next reporting period</em>; factors impeding progress now</td><td>overall evaluation, reusable test work products, residual risks for go-live</td></tr>
<tr><td>ISO/IEC/IEEE 29119-3 name</td><td>test status report</td><td>test completion report</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.3 · SWT5 slide 59–73</span>
<h2>Giám sát &amp; kiểm soát test — đo, báo cáo, lái</h2>
<p class="lead">Kế hoạch chỉ là một dự đoán về tương lai. <strong>Giám sát (monitoring)</strong> so điều đang thực sự diễn ra với kế hoạch; <strong>kiểm soát (control)</strong> là việc bạn làm với phần chênh lệch. Số đo (metrics) nuôi cả hai, còn <strong>báo cáo test</strong> mang thông tin tới người ra quyết định.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-5.3.1</strong> Nhắc lại các số đo dùng trong kiểm thử (K1)</li>
<li><strong>LO-5.3.2</strong> Tóm tắt mục đích, nội dung và đối tượng đọc của báo cáo test (K2)</li>
</ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Kế hoạch</div><div class="lz-t">mục tiêu &amp; exit criteria</div><div class="lz-d">200 test trong 4 tuần, 0 defect critical còn mở</div></div>
  <div class="lz-step"><div class="lz-k">→ Giám sát</div><div class="lz-t">thu số đo</div><div class="lz-d">chạy 70, pass 52, còn mở 17 defect</div></div>
  <div class="lz-step"><div class="lz-k">→ Báo cáo</div><div class="lz-t">progress report</div><div class="lz-d">"xong 35% trong khi kế hoạch 50%"</div></div>
  <div class="lz-step"><div class="lz-k">→ Kiểm soát</div><div class="lz-t">hành động điều chỉnh</div><div class="lz-d">xếp lại ưu tiên, thêm tester, lùi ngày</div></div>
  <div class="lz-step"><div class="lz-k">→ Summary report</div><div class="lz-t">lúc kết thúc</div><div class="lz-d">đã test gì, rủi ro còn lại, go/no-go</div></div>
</div>
<table>
<thead><tr><th></th><th>Test progress report (báo cáo tiến độ)</th><th>Test summary report (báo cáo tổng kết)</th></tr></thead>
<tbody>
<tr><td>Khi nào</td><td>định kỳ <em>trong lúc</em> một hoạt động test (hằng ngày, hằng tuần)</td><td>khi <em>kết thúc</em> một hoạt động / một cấp test / dự án</td></tr>
<tr><td>Dẫn tới</td><td>hành động test control</td><td>quyết định phát hành / đóng lại, bài học kinh nghiệm</td></tr>
<tr><td>Chỉ có ở đây</td><td>việc test dự kiến cho <em>kỳ báo cáo tới</em>; yếu tố đang cản trở</td><td>đánh giá tổng thể, sản phẩm test tái sử dụng được, rủi ro còn lại khi go-live</td></tr>
<tr><td>Tên trong ISO/IEC/IEEE 29119-3</td><td>test status report</td><td>test completion report</td></tr>
</tbody>
</table>`),
    walkHead(D, 59, 73),
    walk(D, [
      [59, 'CONTENT — Test Monitoring & Control',
        `<p class="y-chinh">🎯 Section 3 has two sub-topics: metrics, and test reports.</p>
<ul>
<li><strong>Metrics used in testing</strong> — LO-5.3.1, K1: recognise them.</li>
<li><strong>Purpose, content and audience for test reports</strong> — LO-5.3.2, K2: explain which content goes to whom and why.</li>
</ul>`,
        `<p class="y-chinh">🎯 Phần 3 có hai ý: số đo, và báo cáo test.</p>
<ul>
<li><strong>Các số đo dùng trong kiểm thử</strong> — LO-5.3.1, K1: nhận ra được.</li>
<li><strong>Mục đích, nội dung và đối tượng đọc của báo cáo test</strong> — LO-5.3.2, K2: giải thích nội dung nào gửi cho ai và vì sao.</li>
</ul>`],
      [60, 'Mind map (divider) — Test Metrics & Test Reports added',
        `<p class="y-chinh">🎯 The divider map again — but under <em>Monitoring &amp; Control</em> two new leaves have appeared.</p>
<ul>
<li><strong>Test Metrics</strong></li>
<li><strong>Test Reports</strong></li>
</ul>
<p>They are exactly this lesson.</p>`,
        `<p class="y-chinh">🎯 Lại sơ đồ vách ngăn — nhưng dưới nhánh <em>Monitoring &amp; Control</em> mọc thêm hai lá mới.</p>
<ul>
<li><strong>Test Metrics</strong></li>
<li><strong>Test Reports</strong></li>
</ul>
<p>Đó chính là nội dung bài này.</p>`],
      [61, 'Test Monitoring & Control — definitions',
        `<p class="y-chinh">🎯 Monitoring shows where you are against the plan; control is what you do about it.</p>
<ul>
<li><strong>Test monitoring</strong> — gather information and provide <em>feedback and visibility</em> about test activities: "where are we compared with the plan?".</li>
<li><strong>Test control</strong> — any <em>guiding or corrective actions</em> taken as a result of the information and metrics gathered (and possibly reported).</li>
</ul>
<p>Monitoring without control is just watching; control without monitoring is guessing.</p>
<p class="meo">🧠 <strong>Remember:</strong> from lesson 1.4 — monitoring &amp; control run <em>throughout</em> the test process, not only at the end.</p>`,
        `<p class="y-chinh">🎯 Giám sát cho biết ta đang ở đâu so với kế hoạch; kiểm soát là việc ta làm với điều đó.</p>
<ul>
<li><strong>Giám sát test</strong> (monitoring) — thu thập thông tin, cung cấp <em>phản hồi và khả năng nhìn thấy</em> về các hoạt động test: "ta đang ở đâu so với kế hoạch?".</li>
<li><strong>Kiểm soát test</strong> (control) — mọi <em>hành động định hướng hoặc điều chỉnh</em> được thực hiện dựa trên thông tin và số đo đã thu thập (và có thể đã báo cáo).</li>
</ul>
<p>Giám sát mà không kiểm soát chỉ là đứng nhìn; kiểm soát mà không giám sát là đoán mò.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nhớ lại bài 1.4 — giám sát &amp; kiểm soát diễn ra <em>xuyên suốt</em> quy trình test, không chỉ ở cuối.</p>`],
      [62, 'Examples of Test Control Activities',
        `<p class="y-chinh">🎯 The syllabus gives three typical test control actions.</p>
<ol>
<li><strong>Re-prioritising tests</strong> — when an identified risk occurs (e.g. software delivered late).</li>
<li><strong>Changing the test schedule</strong> — because a test environment or other resource becomes (un)available.</li>
<li><strong>Re-evaluating whether a test item meets an entry or exit criterion</strong> — after rework.</li>
</ol>
<p class="nhan">The teacher's note on example 1</p>
<p>Part of the system under test will arrive after the planned start date, but market conditions fix the release date. So control means starting with the parts that <em>are</em> available and re-ordering the rest by risk.</p>`,
        `<p class="y-chinh">🎯 Syllabus nêu ba hành động kiểm soát test điển hình.</p>
<ol>
<li><strong>Xếp lại ưu tiên test</strong> — khi một rủi ro đã nhận diện xảy ra (vd phần mềm giao trễ).</li>
<li><strong>Đổi lịch test</strong> — vì môi trường test hay nguồn lực khác có/không sẵn sàng.</li>
<li><strong>Đánh giá lại một hạng mục test có đạt entry/exit criterion</strong> — sau khi sửa lại.</li>
</ol>
<p class="nhan">Ghi chú của thầy/cô về ví dụ 1</p>
<p>Một phần hệ thống sẽ tới sau ngày dự định bắt đầu test, nhưng thị trường không cho lùi ngày phát hành. Vậy kiểm soát nghĩa là bắt đầu test những phần <em>đã có</em> và sắp xếp lại phần còn lại theo rủi ro.</p>`],
      [63, 'Metrics used in Testing — purpose',
        `<p class="y-chinh">🎯 Metrics serve four purposes — from today's progress to tomorrow's estimates.</p>
<ol>
<li><strong>Feedback</strong> on progress — time and cost against the planned schedule and budget.</li>
<li><strong>Visibility</strong> of test results and of the quality of the test object.</li>
<li><strong>Status</strong> of testing, coverage and test items against the exit criteria — are we done?</li>
<li><strong>Data for estimating future efforts</strong>, including whether the test approach was adequate — this is where metrics-based estimation (lesson 7.2) gets its history.</li>
</ol>`,
        `<p class="y-chinh">🎯 Số đo phục vụ bốn mục đích — từ tiến độ hôm nay tới ước lượng lần sau.</p>
<ol>
<li><strong>Phản hồi</strong> về tiến độ — thời gian và chi phí so với lịch và ngân sách.</li>
<li><strong>Nhìn thấy</strong> kết quả test và chất lượng đối tượng test.</li>
<li><strong>Trạng thái</strong> kiểm thử, độ bao phủ và hạng mục test so với exit criteria — xong chưa?</li>
<li><strong>Dữ liệu để ước lượng lần sau</strong>, kể cả đánh giá cách tiếp cận test có phù hợp không — ước lượng dựa trên số liệu (bài 7.2) lấy lịch sử từ chính đây.</li>
</ol>`],
      [64, 'Metrics used in Testing — common metrics',
        `<p class="y-chinh">🎯 Common test metrics fall into six families (the notes add examples).</p>
<ol>
<li><strong>Percentage of planned work done</strong> — test cases prepared, test cases implemented, test environment prepared.</li>
<li><strong>Test execution</strong> — number of test cases run/not run, passed/failed.</li>
<li><strong>Defects</strong> — defect density, defects found and fixed, failure rate, confirmation-test results.</li>
<li><strong>Coverage</strong> — of requirements, user stories, acceptance criteria, risks or code.</li>
<li><strong>Task completion, resource allocation and usage, effort</strong> — status against milestones.</li>
<li><strong>Cost of testing</strong> — including the cost/benefit of continuing to find the next defect or run the next test.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> preparation metrics matter before execution; execution and defect metrics matter during execution (slide 70).</p>`,
        `<p class="y-chinh">🎯 Các số đo test thường dùng chia thành sáu nhóm (ghi chú bổ sung ví dụ).</p>
<ol>
<li><strong>Phần trăm công việc đã làm so với kế hoạch</strong> — test case đã chuẩn bị, đã cài đặt, môi trường đã dựng.</li>
<li><strong>Thực thi test</strong> — số test đã chạy/chưa chạy, pass/fail.</li>
<li><strong>Defect</strong> — mật độ defect, số defect tìm được và đã sửa, tỉ lệ failure, kết quả confirmation test.</li>
<li><strong>Độ bao phủ</strong> — yêu cầu, user story, tiêu chí chấp nhận, rủi ro hoặc code.</li>
<li><strong>Mức hoàn thành công việc, phân bổ và sử dụng nguồn lực, công sức</strong> — trạng thái so với mốc.</li>
<li><strong>Chi phí kiểm thử</strong> — kể cả lợi/hại của việc tiếp tục tìm defect kế tiếp hay chạy test kế tiếp.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> số đo chuẩn bị quan trọng trước khi chạy; số đo thực thi và defect quan trọng trong lúc chạy (slide 70).</p>`],
      [65, 'Test Reports — purpose',
        `<p class="y-chinh">🎯 A test report both informs stakeholders and helps them decide.</p>
<p class="nhan">Two purposes</p>
<ol>
<li><strong>Communicate</strong> test results to stakeholders.</li>
<li><strong>Enlighten and influence</strong> them — analyse the information and metrics to support conclusions, recommendations and decisions.</li>
</ol>
<p class="nhan">What a good report can do (notes)</p>
<ul>
<li>Estimate the number of <strong>defects still to be discovered</strong>.</li>
<li>Present the <strong>costs and benefits of delaying the release</strong> to test more.</li>
<li>Assess the remaining <strong>product and project risks</strong>.</li>
<li>Give an opinion on the <strong>confidence</strong> stakeholders should have in the quality of the system under test.</li>
</ul>
<p>A report that only lists numbers without a conclusion has done half the job.</p>`,
        `<p class="y-chinh">🎯 Báo cáo test vừa cung cấp thông tin cho các bên, vừa giúp họ ra quyết định.</p>
<p class="nhan">Hai mục đích</p>
<ol>
<li><strong>Truyền đạt</strong> kết quả test cho các bên.</li>
<li><strong>Soi sáng và tác động</strong> tới họ — phân tích thông tin và số đo để hỗ trợ kết luận, khuyến nghị và quyết định.</li>
</ol>
<p class="nhan">Báo cáo tốt làm được gì (ghi chú)</p>
<ul>
<li>Ước tính số <strong>defect còn chưa tìm ra</strong>.</li>
<li>Trình bày <strong>lợi/hại của việc lùi ngày phát hành</strong> để test thêm.</li>
<li>Đánh giá <strong>rủi ro sản phẩm và dự án</strong> còn lại.</li>
<li>Đưa ý kiến về <strong>mức tin tưởng</strong> mà các bên nên có vào chất lượng hệ thống.</li>
</ul>
<p>Báo cáo chỉ liệt kê con số mà không có kết luận là mới làm được một nửa.</p>`],
      [66, 'Test Reports — progress vs summary',
        `<p class="y-chinh">🎯 Two kinds of test report: progress (during) and summary (at the end).</p>
<ul>
<li><strong>Test progress report</strong> — prepared <em>during</em> a test activity; may result in test control actions.</li>
<li><strong>Test summary report</strong> — prepared at the <em>end</em> of a test activity or test level (and at the end of a project).</li>
<li><strong>Who writes them</strong> — the test manager (slide 18), with data from the testers.</li>
</ul>
<p class="ghi-chu">Glossary note: CTFL v4.0 later renamed the summary report "test completion report", matching ISO/IEC/IEEE 29119-3.</p>`,
        `<p class="y-chinh">🎯 Hai loại báo cáo test: tiến độ (trong lúc làm) và tổng kết (lúc kết thúc).</p>
<ul>
<li><strong>Test progress report</strong> — lập <em>trong lúc</em> một hoạt động test đang diễn ra; có thể dẫn tới hành động kiểm soát.</li>
<li><strong>Test summary report</strong> — lập khi <em>kết thúc</em> một hoạt động hoặc một cấp test (và khi kết thúc dự án).</li>
<li><strong>Ai viết</strong> — test manager (slide 18), dựa trên dữ liệu của tester.</li>
</ul>
<p class="ghi-chu">Ghi chú thuật ngữ: CTFL v4.0 về sau đổi tên summary report thành "test completion report", khớp với ISO/IEC/IEEE 29119-3.</p>`],
      [67, 'Test Reports — typical progress report contents',
        `<p class="y-chinh">🎯 A progress report looks forward: where we are, what blocks us, what comes next.</p>
<p class="nhan">Typical progress-report contents</p>
<ol>
<li><strong>Current status</strong> of test activities and progress against the test plan.</li>
<li><strong>Factors impeding progress</strong> — blocked environment, late builds.</li>
<li><strong>Testing planned for the next reporting period</strong>.</li>
<li><strong>Quality of the test object</strong> so far.</li>
<li><strong>Relevant metrics</strong> (added by the notes) — defects, test cases, coverage, activity progress, resource consumption.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> "testing planned for the next period" belongs <em>only</em> in the progress report — there is no next period after a summary (slide 71).</p>`,
        `<p class="y-chinh">🎯 Báo cáo tiến độ nhìn về phía trước: đang ở đâu, cái gì cản trở, sắp làm gì.</p>
<p class="nhan">Nội dung điển hình của báo cáo tiến độ</p>
<ol>
<li><strong>Trạng thái hiện tại</strong> của hoạt động test và tiến độ so với test plan.</li>
<li><strong>Các yếu tố cản trở tiến độ</strong> — môi trường hỏng, build về trễ.</li>
<li><strong>Việc test dự kiến cho kỳ báo cáo tới</strong>.</li>
<li><strong>Chất lượng đối tượng test</strong> tới thời điểm này.</li>
<li><strong>Các số đo liên quan</strong> (ghi chú bổ sung) — defect, test case, độ bao phủ, tiến độ hoạt động, mức dùng nguồn lực.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "việc test dự kiến cho kỳ tới" <em>chỉ</em> có trong báo cáo tiến độ — sau báo cáo tổng kết thì không còn "kỳ tới" nào (slide 71).</p>`],
      [68, 'Test Reports — contents of both reports & audience',
        `<p class="y-chinh">🎯 Both reports share eight content items — and each must be tailored to its audience.</p>
<p class="nhan">Content of both progress and summary reports</p>
<ol>
<li><strong>Summary of testing performed</strong></li>
<li><strong>Important events</strong></li>
<li><strong>Deviations from plan</strong> — schedule, effort, duration</li>
<li><strong>Status of testing and product quality against the exit criteria</strong></li>
<li><strong>Impeding factors</strong> — on the slide "exit criteria" and "Impeding factors" run together (a missing line break)</li>
<li><strong>Relevant metrics</strong></li>
<li><strong>Residual risks</strong></li>
<li><strong>Reusable test work products</strong></li>
</ol>
<p class="nhan">Audience matters (notes)</p>
<ul>
<li><strong>Not every report has everything</strong> — a quick software update needs little; some need more (many stakeholders, legal or regulatory requirements).</li>
<li><strong>In Agile</strong> — progress reporting may live in task boards, defect summaries and burndown charts discussed at the daily stand-up.</li>
<li><strong>Tailor each report</strong> — senior management wants budget and schedule; testers and developers want detailed defect types and trends.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai loại báo cáo có chung tám mục nội dung — và mỗi báo cáo phải may đo cho người đọc.</p>
<p class="nhan">Nội dung chung của báo cáo tiến độ và tổng kết</p>
<ol>
<li><strong>Tóm tắt việc đã test</strong></li>
<li><strong>Sự kiện quan trọng</strong></li>
<li><strong>Chênh lệch so với kế hoạch</strong> — lịch, công sức, thời lượng</li>
<li><strong>Trạng thái kiểm thử và chất lượng sản phẩm so với exit criteria</strong></li>
<li><strong>Các yếu tố cản trở</strong> — trên slide "exit criteria" và "Impeding factors" dính liền (thiếu một dấu xuống dòng)</li>
<li><strong>Số đo liên quan</strong></li>
<li><strong>Rủi ro còn lại</strong></li>
<li><strong>Sản phẩm test tái sử dụng được</strong></li>
</ol>
<p class="nhan">Đối tượng đọc rất quan trọng (ghi chú)</p>
<ul>
<li><strong>Không phải báo cáo nào cũng đủ mọi mục</strong> — một bản cập nhật nhỏ thì cần ít; có cái cần thêm (nhiều bên liên quan, yêu cầu pháp lý).</li>
<li><strong>Trong Agile</strong> — báo cáo tiến độ có thể nằm ở task board, bảng tổng hợp defect và burndown chart được bàn trong daily stand-up.</li>
<li><strong>May đo báo cáo cho người đọc</strong> — lãnh đạo cần ngân sách và lịch; tester và developer cần chi tiết loại defect và xu hướng.</li>
</ul>`],
      [69, 'What actions can you take?',
        `<p class="y-chinh">🎯 A control cheat-sheet in three columns: what you can affect, cannot affect, and can affect only indirectly.</p>
<p class="nhan">What you can affect directly</p>
<ul>
<li>Resource allocation</li>
<li>Number of test iterations</li>
<li>Which tests go into an iteration</li>
<li>The entry/exit criteria applied</li>
<li>The release date</li>
</ul>
<p class="nhan">What you cannot affect</p>
<ul>
<li>The number of faults <em>already</em> in the software — testing finds them, it does not create or remove them.</li>
</ul>
<p class="nhan">What you can affect indirectly</p>
<ul>
<li>The rework effort</li>
<li>Which faults are fixed (first)</li>
<li>The quality of fixes — e.g. by setting entry criteria for re-test: "a fix is accepted for re-test only with a passing unit test".</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> use this slide when a question asks for a legitimate control action.</p>`,
        `<p class="y-chinh">🎯 Bảng "tủ" kiểm soát chia ba cột: tác động được, không tác động được, và chỉ tác động gián tiếp.</p>
<p class="nhan">Tác động trực tiếp được</p>
<ul>
<li>Phân bổ nguồn lực</li>
<li>Số vòng test</li>
<li>Test nào đưa vào vòng nào</li>
<li>Entry/exit criteria áp dụng</li>
<li>Ngày phát hành</li>
</ul>
<p class="nhan">Không tác động được</p>
<ul>
<li>Số lỗi <em>đã có sẵn</em> trong phần mềm — kiểm thử tìm ra chúng chứ không tạo ra hay xoá chúng.</li>
</ul>
<p class="nhan">Tác động gián tiếp được</p>
<ul>
<li>Công sức sửa lại</li>
<li>Lỗi nào được sửa (trước)</li>
<li>Chất lượng bản sửa — vd đặt entry criteria cho re-test: "bản sửa chỉ được nhận re-test khi có unit test pass kèm theo".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> dùng slide này khi đề hỏi đâu là hành động kiểm soát hợp lệ.</p>`],
      [70, 'Question — metric most useful during test execution',
        `<p class="y-chinh">🎯 During execution you track execution and defect metrics, not preparation metrics.</p>
<ul>
<li><strong>A</strong> — an execution metric: exactly what you watch while tests run.</li>
<li><strong>B, C, D</strong> — <em>preparation</em> metrics (environment preparation, test cases prepared, test-case preparation work): useful before execution starts, not while running tests.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Percentage of executed test cases.</strong></p>`,
        `<p class="y-chinh">🎯 Trong lúc thực thi, ta theo dõi số đo thực thi và defect, không phải số đo chuẩn bị.</p>
<ul>
<li><strong>A</strong> — số đo thực thi: đúng thứ cần theo dõi khi test đang chạy.</li>
<li><strong>B, C, D</strong> — đều là số đo <em>chuẩn bị</em> (dựng môi trường, test case đã chuẩn bị, công chuẩn bị test case): hữu ích trước khi chạy, không phải lúc đang chạy.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Phần trăm test case đã thực thi.</strong></p>`],
      [71, 'Question — NOT included in a test summary report',
        `<p class="y-chinh">🎯 "Next reporting period" only makes sense in a progress report.</p>
<ul>
<li><strong>A</strong> — belongs to the <em>progress</em> report (slide 67).</li>
<li><strong>B (deviations)</strong> — summary-report content (slide 68; IEEE 829 "variances").</li>
<li><strong>C (progress against exit criteria)</strong> — summary-report content (IEEE 829 "comprehensiveness assessment").</li>
<li><strong>D (evaluation of the quality of the test item)</strong> — summary-report content (IEEE 829 "evaluation").</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Testing planned for the next reporting period.</strong></p>`,
        `<p class="y-chinh">🎯 "Kỳ báo cáo tới" chỉ có nghĩa trong báo cáo tiến độ.</p>
<ul>
<li><strong>A</strong> — thuộc báo cáo <em>tiến độ</em> (slide 67).</li>
<li><strong>B (chênh lệch)</strong> — nội dung báo cáo tổng kết (slide 68; IEEE 829 "variances").</li>
<li><strong>C (tiến độ so với exit criteria)</strong> — nội dung báo cáo tổng kết (IEEE 829 "comprehensiveness assessment").</li>
<li><strong>D (đánh giá chất lượng hạng mục test)</strong> — nội dung báo cáo tổng kết (IEEE 829 "evaluation").</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Việc test dự kiến cho kỳ báo cáo tới.</strong></p>`],
      [72, 'Question — when is "number of test cases executed" gathered?',
        `<p class="y-chinh">🎯 A count of executed tests exists only once tests run — so it is gathered during execution.</p>
<ul>
<li><strong>C (execution)</strong> — the count is <em>gathered</em> while tests are run, then used by monitoring and reporting.</li>
<li><strong>A (planning)</strong> — defines which metrics to use.</li>
<li><strong>B (implementation)</strong> — prepares the tests.</li>
<li><strong>D (reporting)</strong> — presents the numbers but does not collect them.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Execution.</strong></p>`,
        `<p class="y-chinh">🎯 Số test đã chạy chỉ có khi test được chạy — nên nó được thu thập trong lúc thực thi.</p>
<ul>
<li><strong>C (execution)</strong> — con số được <em>thu thập</em> trong lúc chạy test, rồi được giám sát và báo cáo sử dụng.</li>
<li><strong>A (planning)</strong> — chọn số đo nào sẽ dùng.</li>
<li><strong>B (implementation)</strong> — chuẩn bị test.</li>
<li><strong>D (reporting)</strong> — trình bày con số chứ không thu thập nó.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Execution (thực thi).</strong></p>`],
      [73, 'Question — variances explained in the test summary report',
        `<p class="y-chinh">🎯 The summary report explains deviations of the testing from the plan.</p>
<ul>
<li><strong>C</strong> — "deviations from plan"; IEEE 829 section "Variances": variances of the test items from their specifications and of the testing from the plan, with reasons.</li>
<li><strong>A</strong> — mixes two unrelated documents.</li>
<li><strong>B and D</strong> — ordinary metrics, not variances that need explaining.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Between what was planned for testing and what was actually tested.</strong></p>`,
        `<p class="y-chinh">🎯 Báo cáo tổng kết giải thích chênh lệch giữa việc test thực tế và kế hoạch.</p>
<ul>
<li><strong>C</strong> — "chênh lệch so với kế hoạch"; mục "Variances" của IEEE 829: chênh lệch của hạng mục test so với đặc tả và của việc test so với kế hoạch, kèm lý do.</li>
<li><strong>A</strong> — trộn hai tài liệu không liên quan.</li>
<li><strong>B và D</strong> — chỉ là số đo thông thường, không phải chênh lệch cần giải thích.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Giữa những gì kế hoạch định test và những gì thực sự đã test.</strong></p>`],
    ]),
    bi(`<h3>What the standards put in a test report</h3>
<div class="table-wrap"><table>
<thead><tr><th>IEEE 829 (1998) Test Summary Report</th><th>ISO/IEC/IEEE 29119-3 test status report</th><th>ISO/IEC/IEEE 29119-3 test completion report</th></tr></thead>
<tbody>
<tr><td>1 Report identifier · 2 Summary (items tested, versions, environment) · 3 Variances (from specs and from the plan, with reasons) · 4 Comprehensiveness assessment (was testing as thorough as planned?) · 5 Summary of results (defects resolved / unresolved) · 6 Evaluation (quality of each test item, risk of failure) · 7 Summary of activities (resources, effort, time) · 8 Approvals</td><td>Scope · Test status: progress against the plan, factors blocking progress, test measures, new and changed risks · Planned testing for the next reporting period</td><td>Scope · Testing performed: summary, deviations from planned testing, test completion evaluation (exit criteria), factors that blocked progress, test measures, residual risks, test deliverables, reusable test assets, lessons learned</td></tr>
</tbody>
</table></div>
<p>The course's own report templates (<em>Report5.1 Unit Test</em>, <em>Report5.2 Integration Test</em>, <em>Report5.3 System Test</em> in 05.Templates) are a light version of the same idea: a <em>Test Statistics</em> sheet counts Passed / Failed / Pending (Untested) / N/A per module and computes two metrics you will fill in during the Labs.</p>
<h3>Ví dụ có lời giải · Worked example — read the metrics, write the report, choose the control actions</h3>
<p><strong>Step 1 — the template formulas.</strong> The example block in Report5.1 has 24 passed, 5 failed, 1 untested out of 30 test cases (23 Normal, 5 Abnormal, 2 Boundary):</p>
<pre><code>Test coverage            = (Passed + Failed) / Total = 29 / 30 = 96.67 %
Test successful coverage =  Passed / Total           = 24 / 30 = 80.00 %
Normal / Abnormal / Boundary share = 23/30, 5/30, 2/30 = 76.67 % / 16.67 % / 6.67 %</code></pre>
<p>"Coverage" here means <em>executed</em>, not passed — a failed test still counts as run. Only 6.67 % boundary cases is itself a finding worth reporting (lesson on BVA).</p>
<p><strong>Step 2 — a weekly progress snapshot.</strong> Plan: 200 system tests in 4 weeks, i.e. 100 by the end of week 2. Actual after week 2: 70 executed (52 passed, 14 failed, 4 blocked); 38 defects opened, 21 closed, 3 of the 17 open ones are critical. A script gives:</p>
<pre><code>exec progress 35 % vs plan 50 %; pass rate of executed 74.3 %; fail 20 %; blocked 5.7 %; closure 55.3 %; still open 17
velocity 35 TC/week -&gt; remaining 130 TC need 3.71 weeks vs 2 planned</code></pre>
<p><strong>Step 3 — the progress report (for the project manager).</strong></p>
<ul>
<li><strong>Status</strong> — 35 % executed vs 50 % planned; at the current rate testing ends about 1.7 weeks late.</li>
<li><strong>Impeding factors</strong> — 4 tests blocked by the unavailable payment sandbox; 3 critical defects open.</li>
<li><strong>Quality</strong> — 20 % of executed tests fail, concentrated in checkout.</li>
<li><strong>Next period</strong> — finish checkout and payment tests first (highest risk), re-test the 21 fixes.</li>
</ul>
<p><strong>Step 4 — control actions (slide 69).</strong></p>
<ul>
<li><strong>Can affect</strong> — re-prioritise so the high-risk checkout suite runs before low-risk reports; add one tester for two weeks (resource allocation); agree with the PM that the exit criterion "0 open critical defects" stays but "100 % executed" becomes "100 % of high-risk, 80 % of the rest".</li>
<li><strong>Indirectly</strong> — ask developers to attach a unit test to each fix (quality of fixes).</li>
<li><strong>Cannot affect</strong> — how many defects are already in checkout.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Exam traps.</strong>
<ol>
<li>"Testing planned for the next reporting period" → <em>progress</em> report only.</li>
<li>Metrics <em>during execution</em> = executed / passed / failed / defects — not "test cases prepared".</li>
<li>Test control is not a phase at the end; it happens whenever monitoring shows a deviation.</li>
<li>Changing the number of faults already in the code is never a control action.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Defect Detection Percentage (DDP).</strong> Test managers judge the <em>effectiveness</em> of a test level with DDP = defects found by that level ÷ (defects found by it + defects found later, e.g. in production). If system test found 180 defects and users reported 20 more in the first three months, DDP = 180 / 200 = 90 %. Tracked over releases, DDP tells you whether your approach is "wearing out" (lesson 7.6, slide 95). <em>Outside the syllabus because it belongs to the ISTQB Advanced Test Manager module.</em></div>`,
    `<h3>Chuẩn quy định gì trong báo cáo test</h3>
<div class="table-wrap"><table>
<thead><tr><th>IEEE 829 (1998) Test Summary Report</th><th>ISO/IEC/IEEE 29119-3 test status report</th><th>ISO/IEC/IEEE 29119-3 test completion report</th></tr></thead>
<tbody>
<tr><td>1 Mã báo cáo · 2 Tóm tắt (hạng mục đã test, phiên bản, môi trường) · 3 Variances (chênh lệch so với đặc tả và so với kế hoạch, kèm lý do) · 4 Comprehensiveness assessment (việc test có kỹ như kế hoạch không?) · 5 Tóm tắt kết quả (defect đã/chưa giải quyết) · 6 Evaluation (chất lượng từng hạng mục, rủi ro hỏng) · 7 Tóm tắt hoạt động (nguồn lực, công sức, thời gian) · 8 Phê duyệt</td><td>Phạm vi · Trạng thái test: tiến độ so với kế hoạch, yếu tố cản trở, số đo, rủi ro mới/thay đổi · Việc test dự kiến cho kỳ báo cáo tới</td><td>Phạm vi · Việc test đã làm: tóm tắt, chênh lệch so với kế hoạch, đánh giá hoàn thành (exit criteria), yếu tố đã cản trở, số đo, rủi ro còn lại, sản phẩm bàn giao, tài sản test tái dùng được, bài học kinh nghiệm</td></tr>
</tbody>
</table></div>
<p>Các mẫu báo cáo của chính môn học (<em>Report5.1 Unit Test</em>, <em>Report5.2 Integration Test</em>, <em>Report5.3 System Test</em> trong 05.Templates) là bản rút gọn của cùng ý tưởng: sheet <em>Test Statistics</em> đếm Passed / Failed / Pending (Untested) / N/A theo từng module và tính hai số đo mà bạn sẽ điền trong các Lab.</p>
<h3>Ví dụ có lời giải · Đọc số đo, viết báo cáo, chọn hành động kiểm soát</h3>
<p><strong>Bước 1 — công thức trong template.</strong> Khối ví dụ của Report5.1 có 24 pass, 5 fail, 1 chưa test trên tổng 30 test case (23 Normal, 5 Abnormal, 2 Boundary):</p>
<pre><code>Test coverage            = (Passed + Failed) / Total = 29 / 30 = 96.67 %
Test successful coverage =  Passed / Total           = 24 / 30 = 80.00 %
Tỉ lệ Normal / Abnormal / Boundary = 23/30, 5/30, 2/30 = 76.67 % / 16.67 % / 6.67 %</code></pre>
<p>"Coverage" ở đây nghĩa là <em>đã chạy</em>, không phải đã pass — test fail vẫn tính là đã chạy. Chỉ có 6,67 % ca biên cũng là một phát hiện đáng đưa vào báo cáo (xem bài BVA).</p>
<p><strong>Bước 2 — ảnh chụp tiến độ hằng tuần.</strong> Kế hoạch: 200 system test trong 4 tuần, tức 100 test khi hết tuần 2. Thực tế sau tuần 2: chạy 70 (52 pass, 14 fail, 4 bị chặn); mở 38 defect, đóng 21, trong 17 defect còn mở có 3 critical. Script cho kết quả:</p>
<pre><code>exec progress 35 % vs plan 50 %; pass rate of executed 74.3 %; fail 20 %; blocked 5.7 %; closure 55.3 %; still open 17
velocity 35 TC/week -&gt; remaining 130 TC need 3.71 weeks vs 2 planned</code></pre>
<p><strong>Bước 3 — báo cáo tiến độ (gửi project manager).</strong></p>
<ul>
<li><strong>Trạng thái</strong> — đã chạy 35 % so với kế hoạch 50 %; với tốc độ hiện tại sẽ trễ khoảng 1,7 tuần.</li>
<li><strong>Yếu tố cản trở</strong> — 4 test bị chặn vì sandbox thanh toán chưa sẵn sàng; còn 3 defect critical.</li>
<li><strong>Chất lượng</strong> — 20 % test đã chạy bị fail, tập trung ở phần checkout.</li>
<li><strong>Kỳ tới</strong> — làm xong test checkout và thanh toán trước (rủi ro cao nhất), re-test 21 bản sửa.</li>
</ul>
<p><strong>Bước 4 — hành động kiểm soát (slide 69).</strong></p>
<ul>
<li><strong>Tác động trực tiếp</strong> — xếp lại ưu tiên để bộ checkout rủi ro cao chạy trước phần báo cáo rủi ro thấp; thêm một tester trong hai tuần (phân bổ nguồn lực); thống nhất với PM giữ exit criterion "0 defect critical còn mở" nhưng đổi "chạy 100 %" thành "100 % test rủi ro cao, 80 % phần còn lại".</li>
<li><strong>Gián tiếp</strong> — yêu cầu developer gửi kèm unit test với mỗi bản sửa (chất lượng bản sửa).</li>
<li><strong>Không tác động được</strong> — số defect đã nằm sẵn trong checkout.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy đề thi.</strong>
<ol>
<li>"Việc test dự kiến cho kỳ tới" → <em>chỉ</em> ở báo cáo tiến độ.</li>
<li>Số đo <em>trong lúc thực thi</em> = đã chạy / pass / fail / defect — không phải "test case đã chuẩn bị".</li>
<li>Test control không phải một giai đoạn ở cuối; nó xảy ra bất cứ khi nào giám sát thấy chênh lệch.</li>
<li>Thay đổi số lỗi đã có trong code không bao giờ là hành động kiểm soát.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Defect Detection Percentage (DDP).</strong> Test manager đánh giá <em>hiệu quả</em> của một cấp test bằng DDP = số defect cấp đó tìm ra ÷ (số defect nó tìm ra + số defect tìm thấy sau đó, vd trên production). System test tìm được 180 defect và người dùng báo thêm 20 trong ba tháng đầu thì DDP = 180 / 200 = 90 %. Theo dõi qua nhiều bản phát hành, DDP cho biết cách tiếp cận của bạn có đang "mòn" đi không (bài 7.6, slide 95). <em>Ngoài giáo trình vì thuộc module ISTQB Advanced Test Manager.</em></div>`),
    books([
      ['fst4', 'Ch.5 §3 "Test monitoring and control" — pp.175–181 (PDF 189–195), incl. Figure 5.1 test case summary worksheet p.177 and Figure 5.2 total defects opened and closed chart p.178', 'Chương 5 §3 "Test monitoring and control" — trang 175–181 (PDF 189–195), gồm Figure 5.1 bảng tổng hợp test case trang 177 và Figure 5.2 biểu đồ defect mở/đóng trang 178'],
      ['fst', '§5.3 "Test progress monitoring and control" — PDF 143–149 (Figures 5.1, 5.2 on PDF 144–147)', '§5.3 "Test progress monitoring and control" — PDF 143–149 (Figure 5.1, 5.2 ở PDF 144–147)'],
      ['sp5', '§6.3 "Test Planning, Control, and Monitoring": §6.3.2 Test Control (PDF 279), §6.3.3 Test Cycle Monitoring (PDF 280), §6.3.4 Test Reports (PDF 281–283)', '§6.3 "Test Planning, Control, and Monitoring": §6.3.2 Test Control (PDF 279), §6.3.3 Test Cycle Monitoring (PDF 280), §6.3.4 Test Reports (PDF 281–283)'],
      ['sp4', '§6.5 "Test Activity Management" (monitoring, reporting, control) — pp.189–192 (PDF 204–207)', '§6.5 "Test Activity Management" (giám sát, báo cáo, kiểm soát) — trang 189–192 (PDF 204–207)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────── 7.4 Configuration management ─────────────────────────── */
const L74 = {
  title: '7.4 — Configuration management: keeping test items and testware in step|||7.4 — Quản lý cấu hình: giữ hạng mục test và testware luôn khớp nhau',
  slug: 'swt301-configuration-management',
  type: 'VIDEO',
  description: 'SWT5 slide 74–78: quản lý cấu hình là gì, testware là gì, 8 sự cố kinh điển khi quản lý cấu hình kém, mục đích của CM và 3 điều CM phải đảm bảo để hỗ trợ kiểm thử — kèm ví dụ điều tra lỗi "đã sửa lại tái xuất hiện".',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.4 · SWT5 slides 74–78</span>
<h2>Configuration management — which version did we actually test?</h2>
<p class="lead">A test result means nothing unless you can say <em>exactly</em> what was tested: which build, which configuration, which version of the test cases, data and environment. <strong>Configuration management (CM)</strong> is the discipline that makes that answer possible — and makes a failure reproducible months later.</p>
<div class="callout"><strong>Learning objective.</strong> LO-5.4.1 Summarise how configuration management supports testing (K2).</div>
<table>
<thead><tr><th>CM must ensure that…</th><th>…so that testers can</th></tr></thead>
<tbody>
<tr><td>every <strong>test item</strong> (component, build, config file) is uniquely identified, version-controlled, tracked for changes and related to the others</td><td>say which build a defect was found in and reproduce it</td></tr>
<tr><td>every item of <strong>testware</strong> (test cases, scripts, data, expected results, environment set-up) is identified, versioned, tracked and <em>linked to the versions of the test items</em></td><td>keep traceability: this test v3 was run on build 2.3.1 with data set D7</td></tr>
<tr><td>all work products are <strong>referenced unambiguously</strong> in test documentation</td><td>read a test log a year later and know exactly what it refers to</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.4 · SWT5 slide 74–78</span>
<h2>Quản lý cấu hình — ta đã thực sự test phiên bản nào?</h2>
<p class="lead">Kết quả test vô nghĩa nếu bạn không nói được <em>chính xác</em> cái gì đã được test: build nào, cấu hình nào, phiên bản test case, dữ liệu và môi trường nào. <strong>Quản lý cấu hình (configuration management — CM)</strong> là kỷ luật giúp trả lời được câu đó — và giúp tái hiện một failure kể cả nhiều tháng sau.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong> LO-5.4.1 Tóm tắt cách quản lý cấu hình hỗ trợ kiểm thử (K2).</div>
<table>
<thead><tr><th>CM phải đảm bảo…</th><th>…để tester có thể</th></tr></thead>
<tbody>
<tr><td>mọi <strong>hạng mục test</strong> (component, build, file cấu hình) được định danh duy nhất, quản lý phiên bản, theo dõi thay đổi và liên kết với nhau</td><td>nói được defect tìm thấy ở build nào và tái hiện nó</td></tr>
<tr><td>mọi thành phần <strong>testware</strong> (test case, script, dữ liệu, kết quả mong đợi, cách dựng môi trường) được định danh, quản lý phiên bản, theo dõi và <em>liên kết với phiên bản của hạng mục test</em></td><td>giữ được truy vết: test v3 đã chạy trên build 2.3.1 với bộ dữ liệu D7</td></tr>
<tr><td>mọi sản phẩm công việc được <strong>tham chiếu không mơ hồ</strong> trong tài liệu test</td><td>đọc test log sau một năm vẫn biết chính xác nó nói về cái gì</td></tr>
</tbody>
</table>`),
    walkHead(D, 74, 78),
    walk(D, [
      [74, 'CONTENT — Configuration Management',
        `<p class="y-chinh">🎯 The agenda with section 4 — Configuration Management — highlighted.</p>
<p class="ghi-chu">Small slip on the slide: this CONTENT slide lists only five sections — "Defect Management" is missing (compare slide 2). Nothing is removed from the chapter.</p>`,
        `<p class="y-chinh">🎯 Mục lục với phần 4 — Configuration Management — được tô.</p>
<p class="ghi-chu">Một sơ suất nhỏ trên slide: slide CONTENT này chỉ có năm phần — thiếu "Defect Management" (so với slide 2). Chương không hề bỏ phần đó.</p>`],
      [75, 'Mind map (divider) — the teacher\'s notes on CM',
        `<p class="y-chinh">🎯 The divider map again — the value is in the Vietnamese speaker notes, the fullest definition of CM in the deck.</p>
<p class="nhan">Configuration management — what it controls</p>
<p>The processes used to <strong>control, organise and track</strong>:</p>
<ul>
<li>Code, requirements, documents, incidents, change requests, designs</li>
<li>Tools, compilers, libraries, patches</li>
<li><em>Their changes and who made them</em> — keep history in every document: who updated what, where.</li>
</ul>
<p class="nhan">Testware — the artefacts produced during testing</p>
<ul>
<li>Documents, test scripts, inputs, expected results</li>
<li>Databases, environments</li>
<li>Any software or utilities used in testing</li>
</ul>
<p class="nhan">Versioning testware</p>
<p>CM also means versioning and storing testware, especially when it must run on several software/hardware configurations — different OS, compilers, browsers.</p>`,
        `<p class="y-chinh">🎯 Lại sơ đồ vách ngăn — giá trị nằm ở ghi chú tiếng Việt của thầy/cô, định nghĩa CM đầy đủ nhất trong cả bộ slide.</p>
<p class="nhan">Quản lý cấu hình — kiểm soát những gì</p>
<p>Các quá trình dùng để <strong>kiểm soát, sắp xếp và lưu vết</strong>:</p>
<ul>
<li>Code, yêu cầu, tài liệu, sự cố, thay đổi yêu cầu, thiết kế</li>
<li>Công cụ, trình biên dịch, thư viện, patch</li>
<li><em>Những thay đổi của chúng và ai đã thay đổi</em> — lưu lịch sử trong mọi tài liệu: ai cập nhật, cập nhật gì, ở đâu.</li>
</ul>
<p class="nhan">Testware — các đối tượng sinh ra khi kiểm thử</p>
<ul>
<li>Tài liệu, kịch bản test, đầu vào, kết quả mong đợi</li>
<li>Cơ sở dữ liệu, môi trường</li>
<li>Phần mềm hay tiện ích dùng khi test</li>
</ul>
<p class="nhan">Quản lý phiên bản testware</p>
<p>CM còn là quản lý phiên bản và lưu trữ testware, nhất là khi phải chạy trên nhiều cấu hình phần mềm/phần cứng khác nhau — hệ điều hành, trình biên dịch, trình duyệt khác nhau.</p>`],
      [76, 'Problems resulting from poor configuration management',
        `<p class="y-chinh">🎯 Eight classic symptoms — each one is a CM failure, not a testing failure.</p>
<ol>
<li><strong>Can't reproduce a fault</strong> reported by a customer — nobody knows which build/config the customer has.</li>
<li><strong>Can't roll back</strong> to a previous subsystem.</li>
<li><strong>One change overwrites another</strong> — two developers edit the same file without control.</li>
<li><strong>Emergency fix needs testing, but the tests were already updated</strong> for the new version — testware not versioned with the code.</li>
<li><strong>Which code changes belong to which version?</strong></li>
<li><strong>Faults that were fixed re-appear</strong> — a build made from an old branch.</li>
<li><strong>Tests worked perfectly — on the old version.</strong></li>
<li><strong>"Shouldn't that feature be in this version?"</strong> — no record of what a release contains.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> if you recognise one of these in a question, the expected answer is "better configuration management".</p>`,
        `<p class="y-chinh">🎯 Tám triệu chứng kinh điển — mỗi cái là lỗi của CM, không phải lỗi của kiểm thử.</p>
<ol>
<li><strong>Không tái hiện được lỗi</strong> khách hàng báo — không ai biết khách đang dùng build/cấu hình nào.</li>
<li><strong>Không quay lui được</strong> về hệ thống con bản trước.</li>
<li><strong>Thay đổi này ghi đè thay đổi kia</strong> — hai developer sửa cùng một file không kiểm soát.</li>
<li><strong>Bản vá khẩn cần test nhưng test đã bị cập nhật</strong> theo phiên bản mới — testware không được quản lý phiên bản cùng code.</li>
<li><strong>Thay đổi code nào thuộc phiên bản nào?</strong></li>
<li><strong>Lỗi đã sửa lại xuất hiện</strong> — build dựng từ nhánh cũ.</li>
<li><strong>Test chạy hoàn hảo — trên phiên bản cũ.</strong></li>
<li><strong>"Chẳng phải tính năng đó có trong bản này sao?"</strong> — không có ghi chép bản phát hành gồm những gì.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> gặp một trong các tình huống này trong đề, đáp án mong đợi là "quản lý cấu hình tốt hơn".</p>`],
      [77, 'Configuration Management — purpose',
        `<p class="y-chinh">🎯 CM establishes and maintains the <strong>integrity</strong> of three things through the project and product lifecycle.</p>
<p class="nhan">The three things (syllabus definition)</p>
<ol>
<li>The <strong>component or system</strong></li>
<li>The <strong>testware</strong></li>
<li><strong>Their relationships to one another</strong></li>
</ol>
<p>Three things, not one — code, tests, and the links between them.</p>
<p class="nhan">When to set it up</p>
<p>CM <strong>procedures and infrastructure (tools)</strong> should be identified and implemented <strong>during test planning</strong> — you cannot bolt CM on after the first confusing defect.</p>`,
        `<p class="y-chinh">🎯 CM thiết lập và duy trì <strong>tính toàn vẹn</strong> của ba thứ suốt vòng đời dự án và sản phẩm.</p>
<p class="nhan">Ba thứ đó (định nghĩa trong syllabus)</p>
<ol>
<li><strong>Thành phần hoặc hệ thống</strong></li>
<li><strong>Testware</strong></li>
<li><strong>Mối quan hệ giữa chúng</strong></li>
</ol>
<p>Ba thứ chứ không phải một — code, test, và liên kết giữa chúng.</p>
<p class="nhan">Khi nào thiết lập</p>
<p><strong>Quy trình và hạ tầng (công cụ)</strong> CM phải được xác định và triển khai <strong>ngay khi lập kế hoạch test</strong> — không thể gắn CM vào sau khi đã gặp defect rối rắm đầu tiên.</p>`],
      [78, 'Configuration Management — what it must ensure for testing',
        `<p class="y-chinh">🎯 To support testing, CM must ensure three things (the syllabus bullets; see the table at the top of this lesson).</p>
<ol>
<li><strong>Test items of the test object</strong> — uniquely identified, version-controlled, tracked for changes and related to each other.</li>
<li><strong>Items of testware</strong> — identified, version-controlled, tracked, related to each other <em>and to the versions of the test items</em>, so that <strong>traceability</strong> can be maintained throughout the test process.</li>
<li><strong>Unambiguous references</strong> — all identified work products and software items are referenced unambiguously in test documentation: not "the latest build", but "build 2.3.1, commit 7f3c2a1".</li>
</ol>
<p class="nhan">Tools</p>
<ul>
<li><strong>Git</strong> — for code and scripts.</li>
<li><strong>Test-management tools</strong> (TestRail, Xray) — for test cases.</li>
<li><strong>CI servers</strong> — stamp every build with an ID.</li>
</ul>`,
        `<p class="y-chinh">🎯 Để hỗ trợ kiểm thử, CM phải đảm bảo ba điều (ba ý của syllabus; xem bảng đầu bài).</p>
<ol>
<li><strong>Hạng mục của đối tượng test</strong> — được định danh duy nhất, quản lý phiên bản, theo dõi thay đổi và liên kết với nhau.</li>
<li><strong>Thành phần testware</strong> — được định danh, quản lý phiên bản, theo dõi, liên kết với nhau <em>và với phiên bản của hạng mục test</em>, để giữ được <strong>truy vết</strong> suốt quy trình test.</li>
<li><strong>Tham chiếu không mơ hồ</strong> — mọi sản phẩm công việc và hạng mục phần mềm đã định danh được tham chiếu rõ ràng trong tài liệu test: không ghi "bản build mới nhất", mà ghi "build 2.3.1, commit 7f3c2a1".</li>
</ol>
<p class="nhan">Công cụ</p>
<ul>
<li><strong>Git</strong> — cho code và script.</li>
<li><strong>Công cụ quản lý test</strong> (TestRail, Xray) — cho test case.</li>
<li><strong>Máy chủ CI</strong> — đóng dấu mã cho mỗi build.</li>
</ul>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — "the bug we fixed is back"</h3>
<p><strong>Situation.</strong> Defect BUG-311 ("discount applied twice") was fixed and passed confirmation testing on build 2.3.1. On build 2.3.3 a tester sees the same failure. The developer swears the fix is still in the code.</p>
<p><strong>Step 1 — look at the configuration records</strong> (this is what CM gives you):</p>
<table>
<thead><tr><th>Build</th><th>Built from</th><th>Contains fix commit a41e9?</th><th>Regression suite version</th><th>Result of TC-DISC-07</th></tr></thead>
<tbody>
<tr><td>2.3.1</td><td>branch <code>release/2.3</code> @ 7f3c2a1</td><td>yes</td><td>RS v12</td><td>pass</td></tr>
<tr><td>2.3.2</td><td>branch <code>release/2.3</code> @ 9b0d4e2</td><td>yes</td><td>RS v12</td><td>pass</td></tr>
<tr><td>2.3.3</td><td>branch <code>hotfix/pay</code> @ c11f850</td><td><strong>no</strong> — branch cut before a41e9</td><td>RS v13</td><td>fail</td></tr>
</tbody>
</table>
<p><strong>Step 2 — diagnose.</strong> Build 2.3.3 was made from a hotfix branch created before the fix was merged: the classic "faults which were fixed re-appear" and "one change overwrites another" from slide 76. Without build IDs and commit references this would have been days of arguing "works on my machine".</p>
<p><strong>Step 3 — report and prevent.</strong> Reopen BUG-311 with the exact build and commit (lesson 7.6), and ask for a CM rule: hotfix branches must be cut from the current release head, and every build's manifest lists the defect fixes it contains. The regression suite RS v13 must also say which builds it is valid for — testware is under CM too.</p>
<div class="pitfall co-tieu-de"><strong>Exam traps.</strong>
<ol>
<li>CM is <em>not</em> only version control of source code — the syllabus stresses <strong>testware</strong> and the <strong>relationships</strong> between test items and testware.</li>
<li>CM is set up <strong>during test planning</strong>, not after problems appear.</li>
<li>A fixed defect coming back in a later build points to a configuration-control failure, not to a bad test case.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Immutable artefacts and infrastructure as code.</strong> Modern pipelines push CM further: each build produces an immutable artefact (a container image identified by its SHA-256 digest), the test environment itself is described in versioned files (Dockerfile, Terraform, Kubernetes manifests), and a Software Bill of Materials (SBOM) lists every library version inside the release. "Which version did we test?" becomes a single digest you can redeploy byte-for-byte. <em>Outside the syllabus because CTFL describes CM only at the level of goals, not tooling.</em></div>`,
    `<h3>Ví dụ có lời giải · "Con bug đã sửa quay lại rồi"</h3>
<p><strong>Tình huống.</strong> Defect BUG-311 ("giảm giá bị áp hai lần") đã được sửa và qua confirmation test trên build 2.3.1. Trên build 2.3.3 tester lại thấy đúng failure đó. Developer thề là bản sửa vẫn nằm trong code.</p>
<p><strong>Bước 1 — xem hồ sơ cấu hình</strong> (đây chính là thứ CM mang lại):</p>
<table>
<thead><tr><th>Build</th><th>Dựng từ</th><th>Có commit sửa a41e9?</th><th>Phiên bản bộ regression</th><th>Kết quả TC-DISC-07</th></tr></thead>
<tbody>
<tr><td>2.3.1</td><td>nhánh <code>release/2.3</code> @ 7f3c2a1</td><td>có</td><td>RS v12</td><td>pass</td></tr>
<tr><td>2.3.2</td><td>nhánh <code>release/2.3</code> @ 9b0d4e2</td><td>có</td><td>RS v12</td><td>pass</td></tr>
<tr><td>2.3.3</td><td>nhánh <code>hotfix/pay</code> @ c11f850</td><td><strong>không</strong> — nhánh tách ra trước a41e9</td><td>RS v13</td><td>fail</td></tr>
</tbody>
</table>
<p><strong>Bước 2 — chẩn đoán.</strong> Build 2.3.3 được dựng từ một nhánh hotfix tách ra trước khi bản sửa được merge: đúng tình huống "lỗi đã sửa lại xuất hiện" và "thay đổi này ghi đè thay đổi kia" ở slide 76. Không có mã build và tham chiếu commit thì đây sẽ là nhiều ngày cãi nhau kiểu "máy tôi chạy được mà".</p>
<p><strong>Bước 3 — báo cáo và phòng ngừa.</strong> Mở lại BUG-311 kèm build và commit chính xác (bài 7.6), và đề nghị một quy tắc CM: nhánh hotfix phải tách từ đầu nhánh release hiện tại, và manifest của mỗi build liệt kê các defect đã sửa bên trong. Bộ regression RS v13 cũng phải ghi rõ nó hợp lệ cho những build nào — testware cũng nằm dưới CM.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy đề thi.</strong>
<ol>
<li>CM <em>không</em> chỉ là quản lý phiên bản mã nguồn — syllabus nhấn mạnh <strong>testware</strong> và <strong>quan hệ</strong> giữa hạng mục test với testware.</li>
<li>CM được thiết lập <strong>từ lúc lập kế hoạch test</strong>, không phải sau khi có sự cố.</li>
<li>Defect đã sửa quay lại ở build sau là dấu hiệu hỏng ở khâu kiểm soát cấu hình, không phải test case tồi.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Artefact bất biến và hạ tầng dưới dạng code.</strong> Pipeline hiện đại đẩy CM đi xa hơn: mỗi build sinh ra một artefact bất biến (container image định danh bằng mã băm SHA-256), bản thân môi trường test được mô tả trong các file có phiên bản (Dockerfile, Terraform, manifest Kubernetes), và một Software Bill of Materials (SBOM) liệt kê mọi phiên bản thư viện trong bản phát hành. Câu hỏi "ta đã test phiên bản nào?" thu về đúng một mã băm có thể triển khai lại y hệt từng byte. <em>Ngoài giáo trình vì CTFL chỉ mô tả CM ở mức mục tiêu, không đi vào công cụ.</em></div>`),
    books([
      ['fst4', 'Ch.5 §4 "Configuration management" — pp.181–183 (PDF 195–197); sample question 12 p.198 (PDF 212)', 'Chương 5 §4 "Configuration management" — trang 181–183 (PDF 195–197); câu hỏi mẫu 12 trang 198 (PDF 212)'],
      ['fst', '§5.4 "Configuration management" — PDF 149–150', '§5.4 "Configuration management" — PDF 149–150'],
      ['sp5', '§6.5 "Configuration Management" — PDF 296–298', '§6.5 "Configuration Management" — PDF 296–298'],
      ['sp4', '§6.7 "Requirements to Configuration Management" — pp.200–202 (PDF 215–217)', '§6.7 "Requirements to Configuration Management" — trang 200–202 (PDF 215–217)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────────── 7.5 Risk & testing ─────────────────────────────── */
const L75 = {
  title: '7.5 — Risk & testing: product vs project risk, risk level, risk-based testing|||7.5 — Rủi ro & kiểm thử: rủi ro sản phẩm vs dự án, mức rủi ro, risk-based testing',
  slug: 'swt301-risk-based-testing',
  type: 'VIDEO',
  description: 'SWT5 slide 79–88: định nghĩa rủi ro, mức rủi ro = khả năng xảy ra × tác động, rủi ro sản phẩm vs rủi ro dự án, 4 cách xử lý rủi ro, risk-based testing, phân tích và chấm mức rủi ro, bảng risk analysis (fst4 Table 5.2) — kèm ví dụ ma trận rủi ro đã tính.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.5 · SWT5 slides 79–88</span>
<h2>Risk &amp; testing</h2>
<p class="lead">You can never test everything (Principle 2), so you must decide <em>where</em> to spend effort. <strong>Risk</strong> is the currency of that decision: the more likely a problem and the worse its impact, the more — and the earlier — you test there. This lesson separates the two kinds of risk and shows how a product-risk analysis turns into a test plan.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-5.5.1</strong> Define risk level by using likelihood and impact (K1)</li>
<li><strong>LO-5.5.2</strong> Distinguish between project and product risks (K2)</li>
<li><strong>LO-5.5.3</strong> Describe, by using examples, how product risk analysis may influence the thoroughness and scope of testing (K2)</li>
</ul></div>
<div class="formula"><span class="lbl">Risk level</span>= Likelihood (probability the problem occurs) × Impact (the harm if it does)</div>
<table>
<thead><tr><th></th><th>Product (quality) risk</th><th>Project risk</th></tr></thead>
<tbody>
<tr><td>Threatens</td><td>the <strong>product</strong> — it may fail to satisfy users' and stakeholders' legitimate needs</td><td>the <strong>project</strong> — its ability to achieve its objectives (time, cost, scope)</td></tr>
<tr><td>Examples</td><td>wrong calculation, poor response time, security hole, bad UX</td><td>late delivery, staff illness, test environment not ready, supplier fails, poor communication</td></tr>
<tr><td>Main answer</td><td><strong>testing</strong> (risk-based: more tests where risk is higher)</td><td><strong>project management</strong> (mitigation, contingency, transfer…) recorded in the test plan</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.5 · SWT5 slide 79–88</span>
<h2>Rủi ro &amp; kiểm thử</h2>
<p class="lead">Bạn không bao giờ test được mọi thứ (Nguyên tắc 2), nên phải quyết định dồn công sức vào <em>đâu</em>. <strong>Rủi ro</strong> là "đơn vị tiền tệ" của quyết định đó: vấn đề càng dễ xảy ra và hậu quả càng nặng thì càng phải test nhiều hơn — và sớm hơn — ở đó. Bài này tách bạch hai loại rủi ro và chỉ ra việc phân tích rủi ro sản phẩm biến thành test plan như thế nào.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-5.5.1</strong> Định nghĩa mức rủi ro bằng khả năng xảy ra và tác động (K1)</li>
<li><strong>LO-5.5.2</strong> Phân biệt rủi ro dự án và rủi ro sản phẩm (K2)</li>
<li><strong>LO-5.5.3</strong> Mô tả bằng ví dụ việc phân tích rủi ro sản phẩm ảnh hưởng tới độ kỹ lưỡng và phạm vi kiểm thử (K2)</li>
</ul></div>
<div class="formula"><span class="lbl">Mức rủi ro</span>= Likelihood (xác suất vấn đề xảy ra) × Impact (mức thiệt hại nếu xảy ra)</div>
<table>
<thead><tr><th></th><th>Rủi ro sản phẩm (chất lượng)</th><th>Rủi ro dự án</th></tr></thead>
<tbody>
<tr><td>Đe doạ</td><td><strong>sản phẩm</strong> — có thể không thoả nhu cầu chính đáng của người dùng và các bên</td><td><strong>dự án</strong> — khả năng đạt mục tiêu (thời gian, chi phí, phạm vi)</td></tr>
<tr><td>Ví dụ</td><td>tính toán sai, thời gian phản hồi kém, lỗ hổng bảo mật, trải nghiệm tệ</td><td>giao trễ, nhân sự ốm, môi trường test chưa sẵn sàng, nhà cung cấp thất hứa, giao tiếp kém</td></tr>
<tr><td>Cách xử lý chính</td><td><strong>kiểm thử</strong> (risk-based: rủi ro càng cao càng nhiều test)</td><td><strong>quản lý dự án</strong> (giảm thiểu, dự phòng, chuyển giao…) ghi trong test plan</td></tr>
</tbody>
</table>`),
    walkHead(D, 79, 88),
    walk(D, [
      [79, 'CONTENT — Risk & Testing',
        `<p class="y-chinh">🎯 Section 5 has three sub-topics, one per learning objective.</p>
<ol>
<li><strong>Risk definition</strong> — LO-5.5.1</li>
<li><strong>Product &amp; project risks</strong> — LO-5.5.2</li>
<li><strong>Risk-based testing &amp; product quality</strong> — LO-5.5.3</li>
</ol>`,
        `<p class="y-chinh">🎯 Phần 5 có ba ý, mỗi ý ứng với một chuẩn đầu ra.</p>
<ol>
<li><strong>Định nghĩa rủi ro</strong> — LO-5.5.1</li>
<li><strong>Rủi ro sản phẩm &amp; dự án</strong> — LO-5.5.2</li>
<li><strong>Risk-based testing &amp; chất lượng sản phẩm</strong> — LO-5.5.3</li>
</ol>`],
      [80, 'Mind map (divider) — Risk & Testing',
        `<p class="y-chinh">🎯 The map again — the bottom branch <em>Risk &amp; Testing</em> has two leaves.</p>
<ul>
<li><strong>Project risk &amp; product risk</strong></li>
<li><strong>Likelihood vs impact</strong></li>
</ul>
<p>Those two leaves are the whole K1/K2 content of this section.</p>`,
        `<p class="y-chinh">🎯 Lại sơ đồ — nhánh dưới <em>Risk &amp; Testing</em> có hai lá.</p>
<ul>
<li><strong>Rủi ro dự án &amp; rủi ro sản phẩm</strong></li>
<li><strong>Khả năng xảy ra vs tác động</strong></li>
</ul>
<p>Hai lá đó là toàn bộ nội dung K1/K2 của phần này.</p>`],
      [81, 'Risk & Testing — definition and risk level',
        `<p class="y-chinh">🎯 <strong>Risk</strong> = the <em>possibility</em> of an event <em>in the future</em> which has <em>negative consequences</em>.</p>
<p class="nhan">Three words carry the marks</p>
<ul>
<li><strong>Possibility</strong> — not certainty: something that already happened is an issue, not a risk.</li>
<li><strong>Future</strong></li>
<li><strong>Negative</strong></li>
</ul>
<p class="nhan">Risk level</p>
<ul>
<li>Determined by the <strong>likelihood</strong> of the event and its <strong>impact</strong> (the harm).</li>
<li>Usually the two ratings are multiplied (or added) into one number — slide 87.</li>
</ul>
<p class="ghi-chu">fst4 sample question 14 ("What is a risk?" → "a bad thing that might happen") tests exactly this sentence.</p>`,
        `<p class="y-chinh">🎯 <strong>Rủi ro</strong> = <em>khả năng</em> một sự kiện <em>trong tương lai</em> gây <em>hậu quả tiêu cực</em>.</p>
<p class="nhan">Ba chữ ăn điểm</p>
<ul>
<li><strong>Khả năng</strong> — không chắc chắn: việc đã xảy ra rồi là vấn đề (issue), không còn là rủi ro.</li>
<li><strong>Tương lai</strong></li>
<li><strong>Tiêu cực</strong></li>
</ul>
<p class="nhan">Mức rủi ro</p>
<ul>
<li>Xác định bởi <strong>khả năng xảy ra</strong> của sự kiện và <strong>tác động</strong> (thiệt hại) của nó.</li>
<li>Thường hai điểm này được nhân (hoặc cộng) thành một con số — slide 87.</li>
</ul>
<p class="ghi-chu">Câu hỏi mẫu 14 của fst4 ("What is a risk?" → "một điều xấu có thể xảy ra") kiểm tra đúng câu này.</p>`],
      [82, 'Product (Quality) Risks',
        `<p class="y-chinh">🎯 <strong>Product risk</strong>: the possibility that a work product may fail to satisfy the legitimate needs of its users and/or stakeholders.</p>
<p class="nhan">Examples on the slide (syllabus)</p>
<ul>
<li>Software might not perform its <strong>intended functions</strong>.</li>
<li>The <strong>architecture</strong> may not support a non-functional requirement.</li>
<li>A <strong>computation</strong> may be wrong in some circumstances.</li>
<li>A <strong>loop</strong> may be coded incorrectly.</li>
<li><strong>Response times</strong> may be inadequate for a high-performance transaction system.</li>
<li><strong>UX feedback</strong> might not meet expectations.</li>
</ul>
<p class="nhan">What the notes add</p>
<ul>
<li><strong>Other name</strong> — some authors call them <strong>quality risks</strong>.</li>
<li><strong>Unsatisfactory software may</strong> — omit a key function; be unreliable; cause financial or other damage; or have problems with a quality characteristic that is not functionality (security, reliability, usability, maintainability, performance).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "is it about how the <em>software</em> behaves?" → product risk.</p>`,
        `<p class="y-chinh">🎯 <strong>Rủi ro sản phẩm</strong>: khả năng một sản phẩm công việc không thoả được nhu cầu chính đáng của người dùng và/hoặc các bên.</p>
<p class="nhan">Ví dụ trên slide (theo syllabus)</p>
<ul>
<li>Phần mềm có thể không làm được <strong>chức năng dự định</strong>.</li>
<li><strong>Kiến trúc</strong> có thể không đáp ứng một yêu cầu phi chức năng.</li>
<li>Một <strong>phép tính</strong> có thể sai trong vài trường hợp.</li>
<li>Một <strong>vòng lặp</strong> có thể bị code sai.</li>
<li><strong>Thời gian phản hồi</strong> có thể không đủ cho hệ thống xử lý giao dịch hiệu năng cao.</li>
<li><strong>Phản hồi về trải nghiệm (UX)</strong> có thể không như kỳ vọng.</li>
</ul>
<p class="nhan">Ghi chú bổ sung</p>
<ul>
<li><strong>Tên khác</strong> — có tác giả gọi là <strong>rủi ro chất lượng</strong> (quality risk).</li>
<li><strong>Phần mềm không đạt có thể</strong> — thiếu một chức năng then chốt; không ổn định; gây thiệt hại tài chính hoặc thiệt hại khác; hoặc có vấn đề ở một đặc tính không phải chức năng (bảo mật, độ tin cậy, tính dễ dùng, khả năng bảo trì, hiệu năng).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "nó nói về cách <em>phần mềm</em> hoạt động?" → rủi ro sản phẩm.</p>`],
      [83, 'Project Risks',
        `<p class="y-chinh">🎯 <strong>Project risk</strong>: situations that may have a negative effect on a project's ability to achieve its objectives.</p>
<p class="nhan">Five categories (the syllabus details each)</p>
<ol>
<li><strong>Project issues</strong> — delays in delivery or task completion, inaccurate estimates, reallocation of funds, late changes causing rework.</li>
<li><strong>Organisational issues</strong> — skills, training and staff shortages, personnel issues, business users not available.</li>
<li><strong>Political issues</strong> — testers not communicating their needs or results, developers/testers not following up on findings, an improper attitude towards testing.</li>
<li><strong>Technical issues</strong> — requirements poorly defined, test environment not ready on time, data conversion or migration late, weak development process, poor defect management, accumulated technical debt.</li>
<li><strong>Supplier issues</strong> — a third party fails to deliver or goes bankrupt, contractual problems.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> "is it about the <em>project</em> — people, time, money, tools, suppliers?" → project risk.</p>`,
        `<p class="y-chinh">🎯 <strong>Rủi ro dự án</strong>: những tình huống có thể ảnh hưởng xấu tới khả năng đạt mục tiêu của dự án.</p>
<p class="nhan">Năm nhóm (syllabus nêu chi tiết từng nhóm)</p>
<ol>
<li><strong>Vấn đề dự án</strong> — giao hàng hay hoàn thành việc bị trễ, ước lượng sai, bị cắt kinh phí, thay đổi muộn gây làm lại.</li>
<li><strong>Vấn đề tổ chức</strong> — thiếu kỹ năng, đào tạo, nhân sự, vấn đề cá nhân, người dùng nghiệp vụ không có mặt.</li>
<li><strong>Vấn đề "chính trị"</strong> — tester không nói rõ nhu cầu hay kết quả, developer/tester không theo dõi phát hiện, thái độ không đúng với kiểm thử.</li>
<li><strong>Vấn đề kỹ thuật</strong> — yêu cầu mơ hồ, môi trường test không kịp, chuyển đổi dữ liệu trễ, quy trình phát triển yếu, quản lý defect kém, nợ kỹ thuật tích tụ.</li>
<li><strong>Vấn đề nhà cung cấp</strong> — bên thứ ba không giao hoặc phá sản, rắc rối hợp đồng.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "nó nói về <em>dự án</em> — người, thời gian, tiền, công cụ, nhà cung cấp?" → rủi ro dự án.</p>`],
      [84, 'Risk-based Testing & Product Quality — risk management options',
        `<p class="y-chinh">🎯 <strong>Testing is one way of managing risk</strong> — it reduces the uncertainty about product risks.</p>
<p class="nhan">Four typical options for any risk</p>
<ol>
<li><strong>Mitigate</strong> — act in advance to reduce the <em>likelihood</em>. E.g. extra reviews and tests of the fee calculation.</li>
<li><strong>Contingency</strong> — have a plan to reduce the <em>impact</em> if the risk becomes an outcome. E.g. a feature flag to switch the new payment method off.</li>
<li><strong>Transfer</strong> — convince another stakeholder to reduce the likelihood or accept the impact. E.g. the payment provider guarantees and tests its API; insurance; contract clauses.</li>
<li><strong>Ignore</strong> — do nothing: a smart choice when little can be done or the impact is low.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> mitigation ↓ likelihood, contingency ↓ impact.</p>`,
        `<p class="y-chinh">🎯 <strong>Kiểm thử là một cách quản lý rủi ro</strong> — nó giảm sự không chắc chắn về rủi ro sản phẩm.</p>
<p class="nhan">Bốn lựa chọn điển hình cho mọi rủi ro</p>
<ol>
<li><strong>Mitigate (giảm thiểu)</strong> — hành động trước để giảm <em>khả năng xảy ra</em>. Vd review và test thêm phần tính phí.</li>
<li><strong>Contingency (dự phòng)</strong> — có sẵn kế hoạch giảm <em>tác động</em> nếu rủi ro thành sự thật. Vd feature flag để tắt phương thức thanh toán mới.</li>
<li><strong>Transfer (chuyển giao)</strong> — thuyết phục một bên khác giảm khả năng xảy ra hoặc chấp nhận tác động. Vd nhà cung cấp cổng thanh toán cam kết và tự test API; bảo hiểm; điều khoản hợp đồng.</li>
<li><strong>Ignore (bỏ qua)</strong> — không làm gì: hợp lý khi chẳng làm được gì nhiều hoặc tác động thấp.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mitigation ↓ khả năng, contingency ↓ tác động.</p>`],
      [85, 'Risk-based Testing & Product Quality — risk-based testing',
        `<p class="y-chinh">🎯 Risk-based testing organises test effort to <strong>reduce the residual level of product risk</strong> when the system is delivered.</p>
<p class="nhan">Its three traits (slide)</p>
<ul>
<li><strong>Goal</strong> — lower residual product risk at delivery.</li>
<li><strong>Prioritise and emphasise</strong> — risk decides which tests matter most during execution.</li>
<li><strong>Starts early</strong> — identify quality risks, then use that knowledge to guide test planning, specification, preparation and execution.</li>
</ul>
<p class="nhan">How the analysis is used (syllabus)</p>
<ol>
<li>Decide the <em>test techniques</em>.</li>
<li>Decide the <em>levels and types</em> of testing — e.g. security, performance.</li>
<li>Decide the <em>extent</em> of testing.</li>
<li>Set the <em>priority</em> of tests — find critical defects as early as possible.</li>
<li>Choose other activities that could reduce risk — e.g. training inexperienced designers.</li>
</ol>`,
        `<p class="y-chinh">🎯 Risk-based testing tổ chức công sức kiểm thử sao cho <strong>giảm mức rủi ro sản phẩm còn lại</strong> khi hệ thống được bàn giao.</p>
<p class="nhan">Ba đặc điểm (trên slide)</p>
<ul>
<li><strong>Mục tiêu</strong> — giảm rủi ro sản phẩm còn lại khi bàn giao.</li>
<li><strong>Ưu tiên và nhấn mạnh</strong> — rủi ro quyết định test nào quan trọng nhất trong lúc thực thi.</li>
<li><strong>Bắt đầu sớm</strong> — nhận diện rủi ro chất lượng rồi dùng hiểu biết đó dẫn dắt lập kế hoạch, đặc tả, chuẩn bị và thực thi.</li>
</ul>
<p class="nhan">Kết quả phân tích được dùng để (syllabus)</p>
<ol>
<li>Chọn <em>kỹ thuật test</em>.</li>
<li>Chọn <em>cấp và loại</em> test — vd bảo mật, hiệu năng.</li>
<li>Quyết định <em>mức độ</em> kiểm thử.</li>
<li><em>Ưu tiên</em> test — tìm defect nghiêm trọng càng sớm càng tốt.</li>
<li>Chọn các hoạt động khác giúp giảm rủi ro — vd đào tạo người thiết kế còn thiếu kinh nghiệm.</li>
</ol>`],
      [86, 'Risk-based Testing & Product Quality — risk analysis',
        `<p class="y-chinh">🎯 Risk-based testing <strong>starts with risk analysis</strong>: first find the risks, then give the search a structure.</p>
<p class="nhan">Techniques to find risks</p>
<ul>
<li><strong>Close reading</strong> of requirements, user stories and design specs.</li>
<li><strong>Brainstorming</strong> with different stakeholders.</li>
<li><strong>A sequence of one-to-one or small-group sessions</strong> with business and technical experts.</li>
</ul>
<p class="nhan">Ways to give the analysis structure</p>
<ul>
<li>Look for specific risks in particular <strong>product-risk categories</strong>.</li>
<li>Walk through the quality characteristics and sub-characteristics of <strong>ISO/IEC 25010</strong> — functional suitability, performance efficiency, compatibility, usability, reliability, security, maintainability, portability.</li>
<li>Use a <strong>checklist</strong> of typical or past risks.</li>
</ul>
<p class="ghi-chu">The slide writes "form ISO/IEC 25010" — read "from".</p>`,
        `<p class="y-chinh">🎯 Risk-based testing <strong>bắt đầu bằng phân tích rủi ro</strong>: trước hết tìm rủi ro, rồi tạo cấu trúc cho việc tìm.</p>
<p class="nhan">Kỹ thuật tìm rủi ro</p>
<ul>
<li><strong>Đọc kỹ</strong> đặc tả yêu cầu, user story, thiết kế.</li>
<li><strong>Brainstorm</strong> với nhiều bên liên quan.</li>
<li><strong>Một chuỗi buổi làm việc một-một hoặc nhóm nhỏ</strong> với chuyên gia nghiệp vụ và kỹ thuật.</li>
</ul>
<p class="nhan">Cách tạo cấu trúc cho việc phân tích</p>
<ul>
<li>Tìm rủi ro theo từng <strong>nhóm rủi ro sản phẩm</strong>.</li>
<li>Đi qua các đặc tính và đặc tính con của <strong>ISO/IEC 25010</strong> — phù hợp chức năng, hiệu năng, tương thích, dễ dùng, tin cậy, bảo mật, bảo trì, khả chuyển.</li>
<li>Dùng <strong>checklist</strong> các rủi ro điển hình hoặc đã gặp.</li>
</ul>
<p class="ghi-chu">Slide viết "form ISO/IEC 25010" — đọc là "from".</p>`],
      [87, 'Risk-based Testing & Product Quality — assigning a risk level',
        `<p class="y-chinh">🎯 Rate every risk item for likelihood and impact, then combine the two into a risk priority number.</p>
<p class="nhan">Step 1 — who rates</p>
<ul>
<li><strong>All stakeholders at once</strong>, or</li>
<li><strong>Business people rate impact, technical people rate likelihood</strong> — then merge the ratings.</li>
</ul>
<p class="nhan">Step 2 — pick a scale</p>
<ul>
<li><strong>High – medium – low</strong></li>
<li><strong>1–10</strong> — hard to tell a 2 from a 3, or a 7 from an 8, unless each value is clearly defined.</li>
<li><strong>5-point scale</strong> (very high, high, medium, low, very low) — tends to work well.</li>
</ul>
<p class="nhan">Step 3 — risk priority number</p>
<p>Multiply (or add) the two ratings.</p>
<div class="pitfall">Careful with the direction of the scale. fst4 (p.189) numbers the 5-point scale with <em>1 = very high</em>, so "high likelihood × medium impact = 2 × 3 = 6", and a <em>lower</em> number means a <em>more urgent</em> risk. Many companies use 5 = very high and read higher as riskier. Always read the legend of the scale.</div>`,
        `<p class="y-chinh">🎯 Chấm từng rủi ro theo khả năng xảy ra và tác động, rồi gộp hai điểm thành risk priority number.</p>
<p class="nhan">Bước 1 — ai chấm</p>
<ul>
<li><strong>Tất cả các bên cùng một lượt</strong>, hoặc</li>
<li><strong>Người nghiệp vụ chấm tác động, người kỹ thuật chấm khả năng</strong> — rồi gộp lại.</li>
</ul>
<p class="nhan">Bước 2 — chọn thang điểm</p>
<ul>
<li><strong>Cao – trung bình – thấp</strong></li>
<li><strong>1–10</strong> — khó phân biệt 2 với 3, hay 7 với 8, nếu mỗi mức không được định nghĩa rõ.</li>
<li><strong>Thang 5 mức</strong> (rất cao, cao, trung bình, thấp, rất thấp) — thường hiệu quả.</li>
</ul>
<p class="nhan">Bước 3 — risk priority number (RPN)</p>
<p>Nhân (hoặc cộng) hai điểm.</p>
<div class="pitfall">Cẩn thận chiều của thang. fst4 (trang 189) đánh số thang 5 mức với <em>1 = rất cao</em>, nên "khả năng cao × tác động trung bình = 2 × 3 = 6", và số <em>nhỏ hơn</em> nghĩa là rủi ro <em>gấp hơn</em>. Nhiều công ty dùng 5 = rất cao và đọc số lớn là rủi ro hơn. Luôn đọc chú giải của thang.</div>`],
      [88, 'Risk-based Testing & Product Quality — mitigation options & the template',
        `<p class="y-chinh">🎯 The risk priority number decides the mitigation for each risk; capture it all in a lightweight document.</p>
<p class="nhan">Questions the number answers</p>
<ul>
<li>Formal training for developers, or rely on reviews?</li>
<li>Extensive, cursory or no testing?</li>
<li>Unit and system coverage of this risk?</li>
</ul>
<p class="nhan">The template on the slide — fst4 Table 5.2 "A risk analysis template"</p>
<ul>
<li><strong>Columns</strong> — Product risk, Likelihood, Impact, Risk priority number, Mitigation.</li>
<li><strong>Rows</strong> — grouped by <em>risk category</em>: Risk category 1 → Risk 1, Risk 2 … Risk n.</li>
</ul>
<p>A spreadsheet is enough. The worked example below fills it in.</p>`,
        `<p class="y-chinh">🎯 Risk priority number quyết định cách giảm thiểu cho từng rủi ro; ghi tất cả vào một tài liệu gọn nhẹ.</p>
<p class="nhan">Những câu con số này trả lời</p>
<ul>
<li>Đào tạo bài bản cho developer, hay dựa vào review?</li>
<li>Test kỹ, test lướt hay không test?</li>
<li>Unit và system test có phủ rủi ro này không?</li>
</ul>
<p class="nhan">Mẫu trên slide — Table 5.2 "A risk analysis template" của fst4</p>
<ul>
<li><strong>Các cột</strong> — Product risk, Likelihood, Impact, Risk priority number, Mitigation.</li>
<li><strong>Các dòng</strong> — nhóm theo <em>risk category</em>: Risk category 1 → Risk 1, Risk 2 … Risk n.</li>
</ul>
<p>Một bảng tính là đủ. Phần ví dụ bên dưới điền đầy bảng này.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — fill in the risk template for an e-wallet app</h3>
<ol>
<li><strong>Step 1 — identify</strong> (brainstorm + ISO 25010 walk-through): six product risks.</li>
<li><strong>Step 2 — rate</strong> on a 5-point scale where <strong>5 = very high</strong>; business people gave impact, developers gave likelihood.</li>
<li><strong>Step 3 — compute</strong> risk level = L × I and map it to an extent of testing: 15–25 extensive, 8–14 broad, 4–7 cursory, 1–3 report bugs only if seen.</li>
</ol>
<p>Script output (ch7/calc.mjs), sorted by level:</p>
<pre><code>1 R4 QR payment fails on old Android L 4 I 4 level 16 extensive | fst4 scale L 2 I 2 RPN 4
2 R1 Transfer fee computed wrongly L 3 I 5 level 15 extensive | fst4 scale L 3 I 1 RPN 3
3 R3 Statement PDF slow for &gt;1000 rows L 4 I 3 level 12 broad | fst4 scale L 2 I 3 RPN 6
4 R2 Login lock-out can be bypassed L 2 I 5 level 10 broad | fst4 scale L 4 I 1 RPN 4
5 R6 Push notification delayed L 3 I 2 level 6 cursory | fst4 scale L 3 I 4 RPN 12
6 R5 Dark theme colours wrong L 3 I 1 level 3 report bugs only | fst4 scale L 3 I 5 RPN 15</code></pre>
<p><strong>Step 4 — the filled template (Table 5.2 layout).</strong></p>
<table>
<thead><tr><th>Product risk</th><th>L</th><th>I</th><th>Level</th><th>Mitigation (what testing does)</th></tr></thead>
<tbody>
<tr><td colspan="5"><em>Functional suitability</em></td></tr>
<tr><td>R1 Transfer fee computed wrongly</td><td>3</td><td>5</td><td>15</td><td>EP + BVA on every fee band, decision table for account types, code review of the formula; run first</td></tr>
<tr><td colspan="5"><em>Compatibility</em></td></tr>
<tr><td>R4 QR payment fails on old Android</td><td>4</td><td>4</td><td>16</td><td>device matrix (Android 9–14, 3 camera types), run on real devices every build</td></tr>
<tr><td colspan="5"><em>Performance efficiency</em></td></tr>
<tr><td>R3 Statement PDF slow for large histories</td><td>4</td><td>3</td><td>12</td><td>load test with 1,000 and 10,000 rows, target &lt; 3 s</td></tr>
<tr><td colspan="5"><em>Security</em></td></tr>
<tr><td>R2 Login lock-out can be bypassed</td><td>2</td><td>5</td><td>10</td><td>state-transition tests of the lock-out, external penetration test (transfer to specialists)</td></tr>
<tr><td colspan="5"><em>Usability / reliability</em></td></tr>
<tr><td>R6 Push notification delayed</td><td>3</td><td>2</td><td>6</td><td>a few exploratory sessions</td></tr>
<tr><td>R5 Dark theme colours wrong</td><td>3</td><td>1</td><td>3</td><td>no dedicated tests; report if seen (ignore)</td></tr>
</tbody>
</table>
<p><strong>Step 5 — how it changes the plan</strong> (LO-5.5.3). The analysis chose:</p>
<ul>
<li><strong>Techniques</strong> — BVA, decision table, state transition.</li>
<li><strong>Test types</strong> — compatibility, performance, security.</li>
<li><strong>Extent</strong> — extensive → report only.</li>
<li><strong>Execution order</strong> — R4 and R1 first.</li>
</ul>
<p>Notice the last column of the script: with fst4's reversed scale (1 = very high) the RPNs come out 3, 4, 4, 6, 12, 15. The same risks land at the top and bottom, but the middle order can differ, because multiplying reversed numbers is not a mirror image. Pick one scale per project and never mix them.</p>
<p><strong>Project risks in the same plan</strong> (not solved by testing):</p>
<ul>
<li>"The payment sandbox may arrive late" → mitigation: request it in sprint 1; contingency: a mock payment server.</li>
<li>"Only one tester knows the device lab" → mitigation: pair a second tester with her.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Exam traps.</strong>
<ol>
<li>Classify by the object threatened: slow response time, wrong calculation, security hole → <strong>product</strong>; illness of a key person, late environment, supplier failure, poor communication → <strong>project</strong> (fst4 sample question 15).</li>
<li>Mitigation reduces <em>likelihood</em>, contingency reduces <em>impact</em>.</li>
<li>A risk is a <em>future possibility</em>; a problem that has already happened is not a risk.</li>
<li>Risk-based testing starts <em>early</em>, not when execution begins.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Where "risk priority number" comes from: FMEA.</strong> The term is borrowed from <em>Failure Mode and Effects Analysis</em>, used in automotive and aerospace since the 1960s. FMEA rates each failure mode on <strong>three</strong> 1–10 scales — Severity × Occurrence × Detection (how hard it is to detect before it reaches the customer) — so RPN runs from 1 to 1000. Adding "detectability" is useful for testers: a risk that your tests are unlikely to catch deserves extra reviews or monitoring in production. <em>Outside the syllabus because CTFL uses only likelihood and impact.</em></div>`,
    `<h3>Ví dụ có lời giải · Điền bảng rủi ro cho một ứng dụng ví điện tử</h3>
<ol>
<li><strong>Bước 1 — nhận diện</strong> (brainstorm + đi qua ISO 25010): sáu rủi ro sản phẩm.</li>
<li><strong>Bước 2 — chấm điểm</strong> theo thang 5 mức với <strong>5 = rất cao</strong>; người nghiệp vụ chấm tác động, developer chấm khả năng xảy ra.</li>
<li><strong>Bước 3 — tính</strong> mức rủi ro = L × I và quy ra mức độ kiểm thử: 15–25 test kỹ, 8–14 test rộng, 4–7 test lướt, 1–3 chỉ báo lỗi nếu gặp.</li>
</ol>
<p>Kết quả script (ch7/calc.mjs), sắp theo mức:</p>
<pre><code>1 R4 QR payment fails on old Android L 4 I 4 level 16 extensive | fst4 scale L 2 I 2 RPN 4
2 R1 Transfer fee computed wrongly L 3 I 5 level 15 extensive | fst4 scale L 3 I 1 RPN 3
3 R3 Statement PDF slow for &gt;1000 rows L 4 I 3 level 12 broad | fst4 scale L 2 I 3 RPN 6
4 R2 Login lock-out can be bypassed L 2 I 5 level 10 broad | fst4 scale L 4 I 1 RPN 4
5 R6 Push notification delayed L 3 I 2 level 6 cursory | fst4 scale L 3 I 4 RPN 12
6 R5 Dark theme colours wrong L 3 I 1 level 3 report bugs only | fst4 scale L 3 I 5 RPN 15</code></pre>
<p><strong>Bước 4 — bảng đã điền (bố cục Table 5.2).</strong></p>
<table>
<thead><tr><th>Rủi ro sản phẩm</th><th>L</th><th>I</th><th>Mức</th><th>Giảm thiểu (kiểm thử làm gì)</th></tr></thead>
<tbody>
<tr><td colspan="5"><em>Phù hợp chức năng</em></td></tr>
<tr><td>R1 Tính sai phí chuyển tiền</td><td>3</td><td>5</td><td>15</td><td>EP + BVA cho mọi khung phí, bảng quyết định theo loại tài khoản, review công thức; chạy đầu tiên</td></tr>
<tr><td colspan="5"><em>Tương thích</em></td></tr>
<tr><td>R4 Thanh toán QR lỗi trên Android đời cũ</td><td>4</td><td>4</td><td>16</td><td>ma trận thiết bị (Android 9–14, 3 loại camera), chạy trên máy thật mỗi build</td></tr>
<tr><td colspan="5"><em>Hiệu năng</em></td></tr>
<tr><td>R3 Xuất sao kê PDF chậm khi lịch sử lớn</td><td>4</td><td>3</td><td>12</td><td>load test với 1.000 và 10.000 dòng, mục tiêu &lt; 3 giây</td></tr>
<tr><td colspan="5"><em>Bảo mật</em></td></tr>
<tr><td>R2 Vượt được cơ chế khoá đăng nhập</td><td>2</td><td>5</td><td>10</td><td>test chuyển trạng thái cho cơ chế khoá, thuê pentest bên ngoài (chuyển giao cho chuyên gia)</td></tr>
<tr><td colspan="5"><em>Dễ dùng / tin cậy</em></td></tr>
<tr><td>R6 Thông báo đẩy bị trễ</td><td>3</td><td>2</td><td>6</td><td>vài phiên exploratory</td></tr>
<tr><td>R5 Màu giao diện tối bị sai</td><td>3</td><td>1</td><td>3</td><td>không viết test riêng; gặp thì báo (bỏ qua)</td></tr>
</tbody>
</table>
<p><strong>Bước 5 — nó thay đổi plan thế nào</strong> (LO-5.5.3). Phân tích đã chọn:</p>
<ul>
<li><strong>Kỹ thuật</strong> — BVA, bảng quyết định, chuyển trạng thái.</li>
<li><strong>Loại test</strong> — tương thích, hiệu năng, bảo mật.</li>
<li><strong>Mức độ</strong> — test kỹ → chỉ báo lỗi.</li>
<li><strong>Thứ tự thực thi</strong> — R4 và R1 trước.</li>
</ul>
<p>Để ý cột cuối của script: với thang ngược của fst4 (1 = rất cao) các RPN ra 3, 4, 4, 6, 12, 15. Rủi ro đầu bảng và cuối bảng vẫn thế, nhưng thứ tự ở giữa có thể khác, vì nhân các số đã đảo chiều không cho ra ảnh gương. Mỗi dự án chọn một thang và không bao giờ trộn.</p>
<p><strong>Rủi ro dự án trong cùng plan</strong> (không giải bằng kiểm thử):</p>
<ul>
<li>"Sandbox thanh toán có thể tới trễ" → giảm thiểu: yêu cầu ngay từ sprint 1; dự phòng: một server thanh toán giả (mock).</li>
<li>"Chỉ một tester biết vận hành phòng thiết bị" → giảm thiểu: cho thêm một tester làm cặp với cô ấy.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy đề thi.</strong>
<ol>
<li>Phân loại theo đối tượng bị đe doạ: phản hồi chậm, tính sai, lỗ hổng bảo mật → <strong>sản phẩm</strong>; người chủ chốt ốm, môi trường trễ, nhà cung cấp thất hứa, giao tiếp kém → <strong>dự án</strong> (câu hỏi mẫu 15 của fst4).</li>
<li>Mitigation giảm <em>khả năng xảy ra</em>, contingency giảm <em>tác động</em>.</li>
<li>Rủi ro là <em>khả năng trong tương lai</em>; vấn đề đã xảy ra rồi không còn là rủi ro.</li>
<li>Risk-based testing bắt đầu <em>sớm</em>, không phải khi bắt đầu chạy test.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>"Risk priority number" từ đâu ra: FMEA.</strong> Thuật ngữ này mượn từ <em>Failure Mode and Effects Analysis</em>, dùng trong ô tô và hàng không từ thập niên 1960. FMEA chấm mỗi dạng hỏng trên <strong>ba</strong> thang 1–10 — Severity × Occurrence × Detection (khó phát hiện tới đâu trước khi tới tay khách hàng) — nên RPN chạy từ 1 tới 1000. Thêm "khả năng phát hiện" rất hữu ích cho tester: rủi ro mà test của bạn khó bắt được thì cần thêm review hoặc giám sát trên production. <em>Ngoài giáo trình vì CTFL chỉ dùng khả năng xảy ra và tác động.</em></div>`),
    books([
      ['fst4', 'Ch.5 §5 "Risks and testing" — pp.183–190 (PDF 197–204), Table 5.2 "A risk analysis template" p.189 (PDF 203); sample questions 13–16 p.198 (PDF 212)', 'Chương 5 §5 "Risks and testing" — trang 183–190 (PDF 197–204), Table 5.2 "A risk analysis template" trang 189 (PDF 203); câu hỏi mẫu 13–16 trang 198 (PDF 212)'],
      ['fst', '§5.5 "Risk and testing" — PDF 150–155', '§5.5 "Risk and testing" — PDF 150–155'],
      ['sp5', '§6.2.4 "Testing and Risk" — PDF 263–266', '§6.2.4 "Testing and Risk" — PDF 263–266'],
      ['sp4', '§6.4 "Choosing the Test Strategy and Test Approach", risk-based testing p.187 (PDF 202)', '§6.4 "Choosing the Test Strategy and Test Approach", phần risk-based testing trang 187 (PDF 202)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────── 7.6 Defect (incident) management ─────────────────────────── */
const L76 = {
  title: '7.6 — Defect management: defect reports, severity vs priority, the lifecycle, metrics|||7.6 — Quản lý defect: báo cáo defect, severity vs priority, vòng đời, số đo',
  slug: 'swt301-bug-lifecycle',
  type: 'VIDEO',
  description: 'SWT5 slide 89–101: incident là gì, mục tiêu và các thành phần của defect report, mẫu báo cáo #111, số đo sự cố, vì sao không nên báo cáo vội, severity vs priority, vòng đời incident (Figure 5.3), ví dụ GQM và lời giải bài Metrics Exercise.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.6 · SWT5 slides 89–101</span>
<h2>Defect management</h2>
<p class="lead">Finding a failure is only useful if the right person can understand it, reproduce it, decide what to do and fix it — and if managers can learn from the pile of reports. That is defect (incident) management, and it ends in the one <strong>K3</strong> objective of the chapter: <strong>write a defect report</strong>.</p>
<div class="callout"><strong>Learning objective.</strong> LO-5.6.1 Write a defect report, covering a defect found during testing (K3).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Reported</div><div class="lz-t">tester logs it</div><div class="lz-d">steps, expected vs actual, evidence</div></div>
  <div class="lz-step"><div class="lz-k">→ Opened</div><div class="lz-t">reviewed, accepted</div><div class="lz-d">or Rejected (bad report / not a problem)</div></div>
  <div class="lz-step"><div class="lz-k">→ Assigned</div><div class="lz-t">approved for repair</div><div class="lz-d">or Deferred (declined for now)</div></div>
  <div class="lz-step"><div class="lz-k">→ Fixed</div><div class="lz-t">developer repaired it</div><div class="lz-d">root cause removed, component tested</div></div>
  <div class="lz-step"><div class="lz-k">→ Closed</div><div class="lz-t">confirmation test passed</div><div class="lz-d">or Reopened (failed / came back)</div></div>
</div>
<table>
<thead><tr><th></th><th>Severity</th><th>Priority</th></tr></thead>
<tbody>
<tr><td>Means</td><td><strong>impact</strong> of the failure on the system / stakeholders</td><td><strong>urgency</strong> to fix</td></tr>
<tr><td>Usually set by</td><td>the tester (technical judgement)</td><td>the product owner / project manager / triage board (business judgement)</td></tr>
<tr><td>Example of the mismatch</td><td>crash in an experimental feature not used yet → severe, not priority</td><td>typo in the company name or a board member's name → priority, not severe</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.6 · SWT5 slide 89–101</span>
<h2>Quản lý defect</h2>
<p class="lead">Tìm ra failure chỉ có ích khi đúng người hiểu được nó, tái hiện được, quyết định làm gì và sửa nó — và khi người quản lý học được điều gì đó từ cả chồng báo cáo. Đó là quản lý defect (sự cố), và nó dẫn tới mục tiêu <strong>K3</strong> duy nhất còn lại của chương: <strong>viết defect report</strong>.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong> LO-5.6.1 Viết defect report cho một defect tìm thấy khi kiểm thử (K3).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Reported</div><div class="lz-t">tester ghi nhận</div><div class="lz-d">bước làm, mong đợi vs thực tế, bằng chứng</div></div>
  <div class="lz-step"><div class="lz-k">→ Opened</div><div class="lz-t">được review, chấp nhận</div><div class="lz-d">hoặc Rejected (báo cáo tồi / không phải lỗi)</div></div>
  <div class="lz-step"><div class="lz-k">→ Assigned</div><div class="lz-t">duyệt cho sửa</div><div class="lz-d">hoặc Deferred (tạm hoãn)</div></div>
  <div class="lz-step"><div class="lz-k">→ Fixed</div><div class="lz-t">developer đã sửa</div><div class="lz-d">gỡ nguyên nhân gốc, đã component test</div></div>
  <div class="lz-step"><div class="lz-k">→ Closed</div><div class="lz-t">confirmation test pass</div><div class="lz-d">hoặc Reopened (fail / quay lại)</div></div>
</div>
<table>
<thead><tr><th></th><th>Severity (mức nghiêm trọng)</th><th>Priority (mức ưu tiên)</th></tr></thead>
<tbody>
<tr><td>Nghĩa là</td><td><strong>tác động</strong> của failure lên hệ thống / các bên</td><td><strong>độ gấp</strong> phải sửa</td></tr>
<tr><td>Thường do ai đặt</td><td>tester (đánh giá kỹ thuật)</td><td>product owner / project manager / hội đồng phân loại (đánh giá nghiệp vụ)</td></tr>
<tr><td>Ví dụ lệch nhau</td><td>crash ở tính năng thử nghiệm chưa ai dùng → nghiêm trọng, không gấp</td><td>gõ sai tên công ty hay tên thành viên HĐQT → gấp, không nghiêm trọng</td></tr>
</tbody>
</table>`),
    walkHead(D, 89, 101, 'Slides 100–101 are a Goal-Question-Metric example and an exercise; both are solved with numbers after the walkthrough.', 'Slide 100–101 là một ví dụ Goal-Question-Metric và một bài tập; cả hai được giải bằng số liệu sau phần học từng slide.'),
    walk(D, [
      [89, 'CONTENT — Defect Management',
        `<p class="y-chinh">🎯 The agenda with section 6 — <strong>Defect Management</strong> — highlighted.</p>
<ul>
<li><strong>On the slide</strong> — no sub-topics.</li>
<li><strong>In the syllabus</strong> — one learning objective here: writing a defect report (K3).</li>
<li><strong>In the deck</strong> — it adds metrics, the lifecycle and GQM.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục lục với phần 6 — <strong>Defect Management</strong> — được tô.</p>
<ul>
<li><strong>Trên slide</strong> — không ghi ý con.</li>
<li><strong>Trong syllabus</strong> — chỉ một chuẩn đầu ra ở đây: viết defect report (K3).</li>
<li><strong>Trong bộ slide</strong> — thêm số đo, vòng đời và GQM.</li>
</ul>`],
      [90, 'Mind map (divider) — Defect Mgt.',
        `<p class="y-chinh">🎯 The map one last time — the bottom-left branch <em>Defect Mgt.</em> names the four things every good report must have.</p>
<ol>
<li><strong>Steps to reproduce</strong></li>
<li><strong>Expected &amp; actual result</strong></li>
<li><strong>Severity &amp; priority</strong></li>
<li><strong>Screenshot</strong> (evidence)</li>
</ol>`,
        `<p class="y-chinh">🎯 Sơ đồ lần cuối — nhánh dưới trái <em>Defect Mgt.</em> gọi tên bốn thứ mọi báo cáo tốt phải có.</p>
<ol>
<li><strong>Bước tái hiện</strong></li>
<li><strong>Kết quả mong đợi &amp; thực tế</strong></li>
<li><strong>Severity &amp; priority</strong></li>
<li><strong>Ảnh chụp màn hình</strong> (bằng chứng)</li>
</ol>`],
      [91, 'Incident management — what is an incident?',
        `<p class="y-chinh">🎯 An <strong>incident</strong> is any event during testing that requires investigation or correction — typically, <em>actual results do not match expected results</em>.</p>
<p class="nhan">Three possible causes</p>
<ol>
<li>A <strong>software fault</strong>.</li>
<li>The <strong>test was not performed correctly</strong>.</li>
<li>The <strong>expected results were incorrect</strong> — a defect in the test itself.</li>
</ol>
<p class="nhan">Consequences</p>
<ul>
<li><strong>Not every incident is a software defect</strong> — the syllabus calls such reports false positives.</li>
<li><strong>Not only code</strong> — incidents can be raised against documentation (requirements, user manual) as well.</li>
</ul>
<p class="ghi-chu">Terminology: older syllabi say "incident", CTFL 2018 says "defect management"; the process is the same.</p>`,
        `<p class="y-chinh">🎯 <strong>Incident (sự cố)</strong> là mọi sự kiện trong lúc test cần được điều tra hoặc sửa — điển hình là <em>kết quả thực tế không khớp kết quả mong đợi</em>.</p>
<p class="nhan">Ba nguyên nhân có thể</p>
<ol>
<li><strong>Lỗi phần mềm</strong>.</li>
<li><strong>Test thực hiện sai</strong>.</li>
<li><strong>Kết quả mong đợi bị sai</strong> — lỗi nằm ở chính test.</li>
</ol>
<p class="nhan">Hệ quả</p>
<ul>
<li><strong>Không phải incident nào cũng là defect phần mềm</strong> — syllabus gọi các báo cáo như vậy là false positive.</li>
<li><strong>Không chỉ code</strong> — incident cũng có thể nêu cho tài liệu (yêu cầu, hướng dẫn sử dụng).</li>
</ul>
<p class="ghi-chu">Thuật ngữ: syllabus cũ nói "incident", CTFL 2018 nói "defect management"; quy trình như nhau.</p>`],
      [92, 'Defect Report Objectives',
        `<p class="y-chinh">🎯 A defect report serves three audiences, not only the developer.</p>
<ol>
<li><strong>Developers and other parties</strong> — information about any adverse event, enough to identify, isolate and correct the defect.</li>
<li><strong>Test managers</strong> — a means of <em>tracking the quality</em> of the work product and the impact on testing (e.g. many defects → more re-testing → schedule risk).</li>
<li><strong>Process improvement</strong> — ideas for improving the development and test process (root-cause patterns).</li>
</ol>`,
        `<p class="y-chinh">🎯 Một defect report phục vụ ba đối tượng, không chỉ developer.</p>
<ol>
<li><strong>Developer và các bên khác</strong> — thông tin về sự kiện bất thường, đủ để xác định, cô lập và sửa defect.</li>
<li><strong>Test manager</strong> — phương tiện <em>theo dõi chất lượng</em> sản phẩm và ảnh hưởng tới việc test (vd nhiều defect → nhiều re-test → rủi ro trễ lịch).</li>
<li><strong>Cải tiến quy trình</strong> — ý tưởng cải tiến quy trình phát triển và kiểm thử (các mẫu nguyên nhân gốc).</li>
</ol>`],
      [93, 'Defect Report Components',
        `<p class="y-chinh">🎯 The syllabus lists eleven components of a defect report — learn them all (red on the slide = the ones people forget least).</p>
<ol>
<li><strong>Identifier, title, short summary, date, author/organisation, test item</strong> (configuration item and version) <strong>and environment</strong></li>
<li><strong>Development lifecycle phase(s)</strong> in which it was observed</li>
<li><strong>Description</strong> enabling reproduction and resolution — steps, logs, database dumps, screenshots, recordings</li>
<li><strong>Expected and actual results</strong></li>
<li><strong>Scope or degree of impact (severity)</strong></li>
<li><strong>Urgency/priority to fix</strong></li>
<li><strong>State</strong> of the report — open, deferred, duplicate, waiting to be fixed, awaiting confirmation testing, re-opened, closed</li>
<li><strong>Conclusions, recommendations and approvals</strong></li>
<li><strong>Global issues</strong> — other areas affected by the change</li>
<li><strong>Change history</strong></li>
<li><strong>References</strong> — including the test case that revealed the problem</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> "test item + version" ties back to configuration management (lesson 7.4).</p>`,
        `<p class="y-chinh">🎯 Syllabus liệt kê mười một thành phần của defect report — hãy học hết (màu đỏ trên slide = những mục ít bị quên nhất).</p>
<ol>
<li><strong>Mã, tiêu đề, tóm tắt ngắn, ngày, người/tổ chức báo, hạng mục test</strong> (configuration item và phiên bản) <strong>và môi trường</strong></li>
<li><strong>Giai đoạn vòng đời</strong> phát hiện</li>
<li><strong>Mô tả</strong> đủ để tái hiện và xử lý — các bước, log, dump cơ sở dữ liệu, ảnh chụp, video</li>
<li><strong>Kết quả mong đợi và thực tế</strong></li>
<li><strong>Phạm vi hay mức tác động (severity)</strong></li>
<li><strong>Độ gấp/ưu tiên sửa</strong></li>
<li><strong>Trạng thái</strong> báo cáo — mở, hoãn, trùng, chờ sửa, chờ confirmation test, mở lại, đóng</li>
<li><strong>Kết luận, khuyến nghị và phê duyệt</strong></li>
<li><strong>Vấn đề tổng thể</strong> — khu vực khác có thể bị ảnh hưởng bởi thay đổi</li>
<li><strong>Lịch sử thay đổi</strong></li>
<li><strong>Tham chiếu</strong> — gồm cả test case đã làm lộ vấn đề</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "hạng mục test + phiên bản" nối thẳng về quản lý cấu hình (bài 7.4).</p>`],
      [94, 'Step 6. Test Execution (cont.) — a defect report sample',
        `<p class="y-chinh">🎯 A real-looking defect report (#111) in a Category / Label / Value table — read it field by field, then spot what is missing.</p>
<p class="nhan">What the report contains</p>
<ul>
<li><strong>Bug ID</strong> — #111, name "CART – Unable to add new item to my cart", reporter Jane Doe, submitted 08/05/2023.</li>
<li><strong>Overview</strong> — summary "When my cart contains one item, I am unable to add a second item via the 'add to cart' button on a product page"; URL; screenshot link.</li>
<li><strong>Environment</strong> — Macintosh, macOS Ventura 13.3.1, Chrome 111.0.5563.146.</li>
<li><strong>Steps to reproduce</strong> — add one item → go to product 123 via the search bar → add it via "add to cart" → go to cart.</li>
<li><strong>Expected / actual</strong> — "the cart should contain 2 items" / "the cart contains only 1 item".</li>
<li><strong>Tracking</strong> — severity Major, priority High.</li>
</ul>
<p class="nhan">The notes define the last two fields</p>
<ul>
<li><strong>Severity</strong> — how severely the defect affects functionality.</li>
<li><strong>Priority</strong> — how fast we need to fix it.</li>
</ul>
<p class="nhan">Still missing compared with slide 93</p>
<ul>
<li>The <strong>build/version</strong> of the web shop under test.</li>
<li>A reference to the <strong>test case</strong>.</li>
<li>The <em>Description</em>, <em>Assigned to</em> and <em>Notes</em> fields are empty ("/").</li>
</ul>`,
        `<p class="y-chinh">🎯 Một defect report "như thật" (#111) dạng bảng Category / Label / Value — đọc từng trường, rồi tìm chỗ còn thiếu.</p>
<p class="nhan">Báo cáo có những gì</p>
<ul>
<li><strong>Bug ID</strong> — #111, tên "CART – Unable to add new item to my cart", người báo Jane Doe, ngày 08/05/2023.</li>
<li><strong>Tổng quan</strong> — tóm tắt "Khi giỏ đã có một món, tôi không thêm được món thứ hai bằng nút 'add to cart' ở trang sản phẩm"; URL; link ảnh chụp.</li>
<li><strong>Môi trường</strong> — Macintosh, macOS Ventura 13.3.1, Chrome 111.0.5563.146.</li>
<li><strong>Bước tái hiện</strong> — thêm một món → vào sản phẩm 123 qua ô tìm kiếm → thêm bằng "add to cart" → mở giỏ.</li>
<li><strong>Mong đợi / thực tế</strong> — "giỏ có 2 món" / "giỏ chỉ có 1 món".</li>
<li><strong>Theo dõi</strong> — severity Major, priority High.</li>
</ul>
<p class="nhan">Ghi chú định nghĩa hai trường cuối</p>
<ul>
<li><strong>Severity</strong> — defect ảnh hưởng chức năng nặng tới đâu.</li>
<li><strong>Priority</strong> — cần sửa nhanh tới đâu.</li>
</ul>
<p class="nhan">So với slide 93 còn thiếu</p>
<ul>
<li><strong>Build/phiên bản</strong> của web shop đang test.</li>
<li>Tham chiếu tới <strong>test case</strong>.</li>
<li>Các trường <em>Description</em>, <em>Assigned to</em> và <em>Notes</em> đang để trống ("/").</li>
</ul>`],
      [95, 'Use of incident metrics',
        `<p class="y-chinh">🎯 Defect data answers four management questions — one per corner of the slide.</p>
<ol>
<li><strong>Top-left — "Is this testing approach wearing out?"</strong> Defects found per week rise, peak, then fall towards zero. A falling curve may mean the product is getting better — or that the same tests no longer find anything (pesticide paradox); only new techniques tell you which.</li>
<li><strong>Top-right — "We're better than last year".</strong> Paired bars per phase, this year's (blue) far below last year's (red). The teacher jokes "hê hê" in the notes — but fewer defects found can also mean weaker testing, so compare with defects found in production.</li>
<li><strong>Bottom-left — "What happened in that week?"</strong> A noisy weekly line with one circled spike. The notes: a sudden jump often means a requirement had issues or its implementation has fundamental defects (or a big new build arrived).</li>
<li><strong>Bottom-right — "How many faults can we expect?"</strong> From the shape of the curve and history you predict the remaining defects — the "estimated remaining defects" exit criterion.</li>
</ol>`,
        `<p class="y-chinh">🎯 Dữ liệu defect trả lời bốn câu hỏi quản lý — mỗi góc slide một câu.</p>
<ol>
<li><strong>Trên trái — "Cách test này có đang mòn đi?"</strong> Số defect tìm được mỗi tuần tăng, đạt đỉnh rồi giảm dần về 0. Đường đi xuống có thể nghĩa là sản phẩm tốt lên — hoặc là bộ test cũ không còn tìm được gì (pesticide paradox); chỉ dùng kỹ thuật mới mới biết là cái nào.</li>
<li><strong>Trên phải — "Năm nay ta giỏi hơn".</strong> Cột đôi theo giai đoạn, năm nay (xanh) thấp hơn hẳn năm ngoái (đỏ). Thầy/cô đùa "hê hê" trong ghi chú — nhưng tìm được ít defect cũng có thể do test yếu đi, nên phải so thêm với defect lọt ra production.</li>
<li><strong>Dưới trái — "Tuần đó đã xảy ra chuyện gì?"</strong> Đường theo tuần lởm chởm với một đỉnh được khoanh. Ghi chú: số lỗi tăng vọt thường do một yêu cầu có vấn đề hoặc phần cài đặt yêu cầu đó sai từ gốc (hoặc vừa nhận một build lớn).</li>
<li><strong>Dưới phải — "Còn bao nhiêu lỗi nữa?"</strong> Từ hình dạng đường cong và lịch sử có thể dự đoán số defect còn lại — chính là exit criterion "số defect ước tính còn lại".</li>
</ol>`],
      [96, 'Report as quickly as possible?',
        `<p class="y-chinh">🎯 Quality of the report beats speed of reporting — five minutes saved by the tester cost the team far more.</p>
<p class="nhan">Careful report (minutes)</p>
<ol>
<li><strong>Tester writes</strong> the incident report — 10</li>
<li><strong>Developer reproduces</strong> — 5</li>
<li><strong>Developer fixes</strong> — 20</li>
<li><strong>Tester re-tests</strong> — 5 → fault fixed</li>
</ol>
<p>Total 10 + 5 + 20 + 5 = <strong>40 min</strong>.</p>
<p class="nhan">Rushed report</p>
<p>The tester writes it in <strong>5</strong>; the developer spends <strong>10</strong> and <em>can't reproduce</em>. Three things can happen:</p>
<ul>
<li><strong>"Not a fault"</strong> is declared — and the fault is <em>still there</em>.</li>
<li><strong>Back to the tester</strong> to report again — then 10 + 5 + 20 + 5 more: 55 min in total, 15 more than doing it right.</li>
<li><strong>Insufficient information</strong> — the developer guesses and the <em>fix is incorrect</em>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Chất lượng báo cáo quan trọng hơn tốc độ báo cáo — năm phút tester tiết kiệm được khiến cả nhóm tốn hơn nhiều.</p>
<p class="nhan">Báo cáo cẩn thận (phút)</p>
<ol>
<li><strong>Tester viết</strong> báo cáo — 10</li>
<li><strong>Developer tái hiện</strong> — 5</li>
<li><strong>Developer sửa</strong> — 20</li>
<li><strong>Tester test lại</strong> — 5 → lỗi đã sửa</li>
</ol>
<p>Tổng 10 + 5 + 20 + 5 = <strong>40 phút</strong>.</p>
<p class="nhan">Báo cáo vội</p>
<p>Tester viết trong <strong>5</strong>; developer mất <strong>10</strong> mà <em>không tái hiện được</em>. Có ba khả năng:</p>
<ul>
<li><strong>Kết luận "không phải lỗi"</strong> — và lỗi <em>vẫn còn đó</em>.</li>
<li><strong>Quay về tester</strong> để báo cáo lại — thêm 10 + 5 + 20 + 5: tổng 55 phút, hơn 15 phút so với làm đúng từ đầu.</li>
<li><strong>Thiếu thông tin</strong> — developer đoán mò và <em>sửa sai</em>.</li>
</ul>`],
      [97, 'Severity versus Priority',
        `<p class="y-chinh">🎯 Severity and priority are independent: impact of the failure vs urgency of the fix.</p>
<ul>
<li><strong>Severity</strong> — the <em>impact</em> of a failure caused by this fault.</li>
<li><strong>Priority</strong> — the <em>urgency</em> to fix it.</li>
</ul>
<p class="nhan">The two call-outs on the slide</p>
<ul>
<li><strong>Minor cosmetic typo</strong> — but in the company name or a board member's name → <em>priority, not severe</em>.</li>
<li><strong>Crash if this feature is used</strong> — but the feature is experimental and not needed yet → <em>severe, not priority</em>.</li>
</ul>
<p class="nhan">Typical scales</p>
<ul>
<li><strong>Severity</strong> — Critical / Major / Minor / Trivial.</li>
<li><strong>Priority</strong> — High / Medium / Low (or P1–P4).</li>
</ul>`,
        `<p class="y-chinh">🎯 Severity và priority độc lập nhau: tác động của failure so với độ gấp phải sửa.</p>
<ul>
<li><strong>Severity</strong> — <em>tác động</em> của failure do lỗi này gây ra.</li>
<li><strong>Priority</strong> — <em>độ gấp</em> phải sửa.</li>
</ul>
<p class="nhan">Hai ô chú thích trên slide</p>
<ul>
<li><strong>Lỗi chính tả nhỏ</strong> — nhưng nằm ở tên công ty hay tên thành viên HĐQT → <em>gấp, không nghiêm trọng</em>.</li>
<li><strong>Crash khi dùng tính năng này</strong> — nhưng tính năng còn thử nghiệm, chưa cần tới → <em>nghiêm trọng, không gấp</em>.</li>
</ul>
<p class="nhan">Thang thường gặp</p>
<ul>
<li><strong>Severity</strong> — Critical / Major / Minor / Trivial.</li>
<li><strong>Priority</strong> — High / Medium / Low (hoặc P1–P4).</li>
</ul>`],
      [98, 'Incident Lifecycle — tester tasks vs developer tasks',
        `<p class="y-chinh">🎯 Seven steps in one defect's life: testers isolate, developers diagnose and repair, testers confirm.</p>
<p class="nhan">Tester tasks (pink box)</p>
<ol>
<li>The <strong>steps to reproduce</strong> the fault.</li>
<li>Decide whether it is a <em>test</em> fault or a <em>system</em> fault.</li>
<li>The <strong>external factors</strong> that influence the symptoms — notes: environment, network…</li>
</ol>
<p class="nhan">Developer tasks (blue box, after the green arrow)</p>
<ol start="4">
<li>The <strong>root cause</strong> of the problem.</li>
<li><strong>How to repair</strong> it without introducing new problems.</li>
<li>Changes <strong>debugged and properly component tested</strong>.</li>
</ol>
<p class="nhan">Back to the tester</p>
<ol start="7">
<li><strong>Is the fault fixed?</strong> — confirmation testing.</li>
</ol>
<p>This is the testing / debugging split of lesson 1.1 inside one defect's life.</p>
<p class="ghi-chu">Source: Rex Black, <em>Managing the Testing Process</em> (Microsoft Press, 1999).</p>`,
        `<p class="y-chinh">🎯 Bảy bước trong đời một defect: tester cô lập, developer chẩn đoán và sửa, tester xác nhận.</p>
<p class="nhan">Việc của tester (ô hồng)</p>
<ol>
<li>Các <strong>bước tái hiện</strong> lỗi.</li>
<li>Xác định đó là lỗi của <em>test</em> hay lỗi của <em>hệ thống</em>.</li>
<li>Các <strong>yếu tố bên ngoài</strong> ảnh hưởng tới triệu chứng — ghi chú: môi trường, mạng…</li>
</ol>
<p class="nhan">Việc của developer (ô xanh, sau mũi tên xanh lá)</p>
<ol start="4">
<li><strong>Nguyên nhân gốc</strong> của vấn đề.</li>
<li><strong>Cách sửa</strong> mà không gây vấn đề mới.</li>
<li>Thay đổi đã được <strong>debug và component test đầy đủ</strong>.</li>
</ol>
<p class="nhan">Quay về tester</p>
<ol start="7">
<li><strong>Lỗi đã được sửa chưa?</strong> — confirmation testing.</li>
</ol>
<p>Đây chính là sự phân chia testing / debugging của bài 1.1 trong vòng đời một defect.</p>
<p class="ghi-chu">Nguồn: Rex Black, <em>Managing the Testing Process</em> (Microsoft Press, 1999).</p>`],
      [99, 'Incident Lifecycle — Figure 5.3',
        `<p class="y-chinh">🎯 The textbook state diagram: one main path from Reported to Closed, plus side paths for rejection, deferral and reopening.</p>
<p class="ghi-chu">fst Figure 5.3 "Incident report life cycle", reprinted as "Defect report life cycle" in fst4 p.195.</p>
<p class="nhan">Main path</p>
<ol>
<li><strong>Reported</strong> —<em>reviewed</em>→ <strong>Opened</strong></li>
<li><strong>Opened</strong> —<em>approved for repair</em>→ <strong>Assigned</strong></li>
<li><strong>Assigned</strong> —<em>repaired</em>→ <strong>Fixed</strong></li>
<li><strong>Fixed</strong> —<em>confirmed to be repaired</em>→ <strong>Closed</strong></li>
</ol>
<p class="nhan">Side paths</p>
<ul>
<li>Reported —<em>bad report</em>→ <strong>Rejected</strong> —<em>rewritten</em>→ Reported</li>
<li>Opened —<em>not a problem</em>→ Rejected</li>
<li>Opened —<em>declined for repair</em>→ <strong>Deferred</strong> —<em>gathered new information</em>→ <strong>Reopened</strong></li>
<li>Fixed —<em>failed confirmation test</em>→ Reopened</li>
<li>Closed —<em>problem returned</em>→ Reopened</li>
<li>Reopened —<em>approved for re-repair</em>→ Assigned</li>
</ul>
<p class="nhan">Owners (the book)</p>
<p>In every state except Rejected, Deferred and Closed the report has a clear <strong>owner</strong> responsible for the next transition. Ideally only the owner can move it, and tools should enforce the allowed transitions.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ trạng thái trong giáo trình: một đường chính từ Reported tới Closed, cộng các nhánh phụ cho bị từ chối, tạm hoãn và mở lại.</p>
<p class="ghi-chu">fst Figure 5.3 "Incident report life cycle", in lại thành "Defect report life cycle" ở fst4 trang 195.</p>
<p class="nhan">Đường chính</p>
<ol>
<li><strong>Reported</strong> —<em>được review</em>→ <strong>Opened</strong></li>
<li><strong>Opened</strong> —<em>duyệt cho sửa</em>→ <strong>Assigned</strong></li>
<li><strong>Assigned</strong> —<em>đã sửa</em>→ <strong>Fixed</strong></li>
<li><strong>Fixed</strong> —<em>xác nhận đã sửa</em>→ <strong>Closed</strong></li>
</ol>
<p class="nhan">Nhánh phụ</p>
<ul>
<li>Reported —<em>báo cáo tồi</em>→ <strong>Rejected</strong> —<em>viết lại</em>→ Reported</li>
<li>Opened —<em>không phải lỗi</em>→ Rejected</li>
<li>Opened —<em>từ chối sửa lúc này</em>→ <strong>Deferred</strong> —<em>có thông tin mới</em>→ <strong>Reopened</strong></li>
<li>Fixed —<em>confirmation test fail</em>→ Reopened</li>
<li>Closed —<em>lỗi quay lại</em>→ Reopened</li>
<li>Reopened —<em>duyệt sửa lại</em>→ Assigned</li>
</ul>
<p class="nhan">Người sở hữu (theo sách)</p>
<p>Ở mọi trạng thái trừ Rejected, Deferred và Closed, báo cáo có một <strong>người sở hữu</strong> rõ ràng chịu trách nhiệm chuyển bước tiếp theo. Lý tưởng là chỉ người sở hữu mới được chuyển trạng thái, và công cụ nên ép đúng các chuyển tiếp được phép.</p>`],
      [100, 'Metrics Example — GQM (Goal-Question-Metric)',
        `<p class="y-chinh">🎯 <strong>GQM</strong> (Basili) builds metrics top-down, so you only measure what answers a question about a goal.</p>
<p class="nhan">Goal</p>
<p><strong>EDD &lt; 2 defects per KLoC</strong>. The slide does not expand EDD; read it as the <em>estimated defect density</em> still in the code at delivery.</p>
<p class="nhan">Questions → metrics</p>
<ol>
<li><strong>Q1 Size of the software?</strong> → M1.1 KLoC per module.</li>
<li><strong>Q2 How many defects in the code?</strong> → M2.1 estimate of the number of defects (e.g. from history).</li>
<li><strong>Q3 How many found?</strong> → M3.1 defects found in reviews and inspections; M3.2 defects found in subsequent tests.</li>
<li><strong>Q4 Yield of the tests?</strong> → M4.1 defects found (M3) ÷ estimate (M2).</li>
</ol>
<p>The residual (estimate − found) ÷ KLoC is compared with the goal. Computed example below the walkthrough.</p>`,
        `<p class="y-chinh">🎯 <strong>GQM</strong> (Basili) xây số đo từ trên xuống, để chỉ đo những gì trả lời một câu hỏi về một mục tiêu.</p>
<p class="nhan">Mục tiêu</p>
<p><strong>EDD &lt; 2 defect trên mỗi KLoC</strong>. Slide không giải thích EDD; hiểu là <em>mật độ defect ước tính</em> còn trong code khi bàn giao.</p>
<p class="nhan">Câu hỏi → số đo</p>
<ol>
<li><strong>Q1 Phần mềm lớn cỡ nào?</strong> → M1.1 KLoC mỗi module.</li>
<li><strong>Q2 Code có bao nhiêu defect?</strong> → M2.1 số defect ước tính (vd từ lịch sử).</li>
<li><strong>Q3 Đã tìm được bao nhiêu?</strong> → M3.1 defect tìm trong review và inspection; M3.2 defect tìm trong các đợt test sau.</li>
<li><strong>Q4 Hiệu suất (yield) của test?</strong> → M4.1 số defect tìm được (M3) ÷ ước tính (M2).</li>
</ol>
<p>Phần còn lại (ước tính − đã tìm) ÷ KLoC đem so với mục tiêu. Ví dụ tính toán ở sau phần học từng slide.</p>`],
      [101, 'Metrics Exercise — Reger',
        `<p class="y-chinh">🎯 An exercise: turn five metric areas into a GQM tree that steers system testing for Reger.</p>
<p class="nhan">The goal</p>
<p><em>In system test, do an optimal check in minimum time based on the 3 customers for Reger</em> (Reger is the fictional company of the exercise).</p>
<p class="nhan">Metric areas to use (slide)</p>
<ol>
<li><strong>Priority of the processes</strong> used by customers</li>
<li><strong>Coverage</strong> of the processes</li>
<li><strong>Incidents found</strong></li>
<li><strong>Severity</strong> of incidents</li>
<li><strong>Time planned and spent</strong></li>
</ol>
<p>Your job is to turn them into a GQM tree and use the numbers to steer testing — the full solution with computed data follows.</p>`,
        `<p class="y-chinh">🎯 Bài tập: biến năm mảng số đo thành một cây GQM để lái việc system test cho Reger.</p>
<p class="nhan">Mục tiêu</p>
<p><em>Trong system test, kiểm tra tối ưu trong thời gian ngắn nhất dựa trên 3 khách hàng của Reger</em> (Reger là công ty giả định của bài).</p>
<p class="nhan">Các mảng số đo phải dùng (slide)</p>
<ol>
<li><strong>Độ ưu tiên của các quy trình</strong> khách hàng dùng</li>
<li><strong>Độ bao phủ</strong> các quy trình</li>
<li><strong>Số sự cố tìm được</strong></li>
<li><strong>Mức nghiêm trọng</strong> của sự cố</li>
<li><strong>Thời gian dự kiến và đã dùng</strong></li>
</ol>
<p>Việc của bạn là biến chúng thành một cây GQM và dùng số liệu để lái việc test — lời giải đầy đủ có số liệu tính sẵn ở bên dưới.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example 1 — write a defect report from a user's e-mail (K3)</h3>
<p>During beta testing of a student-portal app, a user writes: <em>"I tried to register for the SWT301 exam on my phone. After I chose the slot and pressed Confirm, it spun for a long time and said 'Error 500'. When I opened the schedule later, the exam was there twice."</em> A good tester does not forward the e-mail; she reproduces, isolates and reports:</p>
<table>
<thead><tr><th>Field (slide 93)</th><th>Value</th></tr></thead>
<tbody>
<tr><td>ID / Title</td><td>DEF-2041 — Exam registration creates a duplicate booking when the confirmation request times out</td></tr>
<tr><td>Date / Author</td><td>11/09/2026 · Tester Lan (beta report from user U-7731)</td></tr>
<tr><td>Test item &amp; environment</td><td>Portal app 3.4.0 (build 3.4.0+212), API 2.9.1 · Android 14, Chrome 128, 3G network throttled to 400 kbps</td></tr>
<tr><td>Phase</td><td>Beta (acceptance) testing</td></tr>
<tr><td>Steps to reproduce</td><td>1 Log in as student SE17xxxx · 2 Exams → SWT301 → choose slot 15/09 07:30 · 3 Throttle network to 400 kbps · 4 Press Confirm once and wait</td></tr>
<tr><td>Expected result</td><td>One booking is created; on timeout the app shows a clear message and does not create a second booking</td></tr>
<tr><td>Actual result</td><td>After 30 s "Error 500"; the schedule lists the exam twice; API log shows two POST /bookings with the same payload 31 s apart (automatic retry)</td></tr>
<tr><td>Reproducibility</td><td>4 of 5 attempts on a throttled network; 0 of 5 on Wi-Fi</td></tr>
<tr><td>Severity / Priority</td><td>Major (data corruption; a student may be charged or blocked twice) · High (registration week starts on 13/09)</td></tr>
<tr><td>Global issues</td><td>Other POST screens using the same retry helper (course registration, fee payment) may be affected</td></tr>
<tr><td>References / attachments</td><td>Test case TC-REG-018 (timeout handling), screen recording, API log excerpt, the user's e-mail</td></tr>
<tr><td>State</td><td>Reported (awaiting triage)</td></tr>
</tbody>
</table>
<p>What the tester added beyond the e-mail: the exact build and environment (CM, lesson 7.4), a <em>deliberately reproduced</em> failure with a frequency, isolation (network speed is the factor — slide 98 task 3), the log evidence, the impact on other screens, and a neutral, factual tone (lesson 1.5). This mirrors the fst4 defect-report exercise (p.200, solution p.202), where the book lists exactly these missing elements for an e-mail from a car dealer.</p>
<h3>Worked example 2 — follow DEF-2041 through Figure 5.3</h3>
<ol>
<li><strong>Reported</strong> → (reviewed by the triage board) <strong>Opened</strong></li>
<li>→ (approved for repair) <strong>Assigned</strong> to developer Minh</li>
<li>→ (idempotency key added) <strong>Fixed</strong></li>
<li>→ tester re-runs TC-REG-018 on build 3.4.1: still two bookings when <em>two</em> retries happen → <strong>Reopened</strong> (failed confirmation test)</li>
<li>→ (approved for re-repair) <strong>Assigned</strong> → <strong>Fixed</strong> on 3.4.2</li>
<li>→ confirmation test and a regression run of the other POST screens pass → <strong>Closed</strong></li>
</ol>
<p><strong>Owners:</strong> tester (Reported), triage lead (Opened), developer (Assigned/Fixed), tester (Fixed → Closed/Reopened).</p>
<h3>Worked example 3 — the GQM tree of slide 100 with numbers</h3>
<p>History says about <strong>6 defects per KLoC</strong> are injected (M2.1 = 6 × KLoC). Script output:</p>
<pre><code>A KLoC 12 est 72 found 60 (rev 30 test 30) yield 83.3% residual 12 EDD 1 OK
B KLoC 8 est 48 found 43 (rev 25 test 18) yield 89.6% residual 5 EDD 0.625 OK
C KLoC 20 est 120 found 70 (rev 30 test 40) yield 58.3% residual 50 EDD 2.5 FAIL
total est 240 found 173 yield 72.1 residual 67 EDD 1.675</code></pre>
<p>Answer: the <em>whole system</em> meets the goal (1.675 &lt; 2), but <strong>module C does not</strong> (2.5). Its yield is only 58.3 % — so the decision is more review and testing on C, not a release. An average hid the hot module: defect clustering (Principle 4) again.</p>
<h3>Worked example 4 — solution of the Metrics Exercise (slide 101)</h3>
<p><strong>Goal:</strong> in system test, check optimally in minimum time, based on Reger's 3 customers. <strong>Questions → metrics:</strong></p>
<table>
<thead><tr><th>Question</th><th>Metric</th></tr></thead>
<tbody>
<tr><td>Q1 Which processes matter most to the customers?</td><td>M1 priority of each process per customer (1–3), weight = sum over the 3 customers</td></tr>
<tr><td>Q2 Are the important processes covered?</td><td>M2 coverage per process (% of its test cases executed); weighted coverage = Σ(weight × coverage) / Σ weight</td></tr>
<tr><td>Q3 How good is each process?</td><td>M3 incidents found per process; M4 severity mix (critical ×3, major ×2, minor ×1)</td></tr>
<tr><td>Q4 Are we using the minimum time?</td><td>M5 time planned vs spent per process; incidents found per hour</td></tr>
</tbody>
</table>
<p>Sample data after two days of system test, computed by script:</p>
<pre><code>Order entry weight 8 cov 90% weighted gap 0.8 incidents 6 (crit/maj/min 1/2/3) sev-score 10 h plan/spent 16/14 incidents/h 0.43
Invoicing weight 8 cov 40% weighted gap 4.8 incidents 9 (crit/maj/min 2/3/4) sev-score 16 h plan/spent 16/10 incidents/h 0.9
Reporting weight 4 cov 100% weighted gap 0 incidents 5 (crit/maj/min 0/0/5) sev-score 5 h plan/spent 8/12 incidents/h 0.42
Customer admin weight 4 cov 50% weighted gap 2 incidents 2 (crit/maj/min 0/1/1) sev-score 3 h plan/spent 8/4 incidents/h 0.5
weighted coverage 68.3 % unweighted 70 % total weight 24 time plan 48 spent 40</code></pre>
<p><strong>Reading it:</strong></p>
<ul>
<li><strong>Invoicing</strong> — top-weighted (8) but only 40 % covered, the largest weighted gap (4.8); it also has the worst severity score (16) and the highest find rate (0.9 incidents/h). Spend the next hours there.</li>
<li><strong>Reporting</strong> — low-weight yet fully covered and over budget (12 h vs 8 h): stop testing it.</li>
<li><strong>Weighted coverage</strong> (68.3 %) is below the naive average (70 %) precisely because the gaps sit in important processes — the unweighted number would flatter us.</li>
<li><strong>Exit decision</strong> — continue until Invoicing and Order entry reach ~90 % coverage with no open critical incidents; that is "optimal check in minimum time".</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Exam traps.</strong>
<ol>
<li>Severity = impact, priority = urgency — a typo in the company name is <em>low severity, high priority</em>.</li>
<li>Not every incident is a software defect: the test or its expected result may be wrong.</li>
<li>After a fix, the tester's check is <em>confirmation testing</em>; if it fails the state is <em>Reopened</em>, not "New".</li>
<li>A defect report's first reader is the developer, but test managers and process improvement are also objectives.</li>
<li>Writing fast is not the goal — reproducibility is (slide 96).</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Classifying defects so that they teach you something.</strong> IEEE 1044 (classification for software anomalies) and IBM's <em>Orthogonal Defect Classification</em> tag every defect with independent attributes — defect type (assignment, checking, algorithm, interface, timing…), trigger (what kind of test revealed it), phase injected and phase found. Aggregated over a release, the pattern tells you whether to invest in better reviews, better unit tests or better requirements — slide 92's third objective done systematically. <em>Outside the syllabus because CTFL stops at writing and tracking individual reports.</em></div>`,
    `<h3>Ví dụ có lời giải · Ví dụ 1 — viết defect report từ e-mail của người dùng (K3)</h3>
<p>Trong đợt beta test một app cổng thông tin sinh viên, một người dùng viết: <em>"Mình đăng ký thi SWT301 trên điện thoại. Chọn ca xong bấm Xác nhận thì nó quay rất lâu rồi báo 'Error 500'. Lúc sau mở lịch thì thấy môn thi xuất hiện hai lần."</em> Tester giỏi không chuyển tiếp nguyên e-mail; cô ấy tái hiện, cô lập rồi mới báo cáo:</p>
<table>
<thead><tr><th>Trường (slide 93)</th><th>Giá trị</th></tr></thead>
<tbody>
<tr><td>Mã / Tiêu đề</td><td>DEF-2041 — Đăng ký thi tạo lượt đăng ký trùng khi yêu cầu xác nhận bị timeout</td></tr>
<tr><td>Ngày / Người báo</td><td>11/09/2026 · Tester Lan (từ báo cáo beta của người dùng U-7731)</td></tr>
<tr><td>Hạng mục test &amp; môi trường</td><td>App portal 3.4.0 (build 3.4.0+212), API 2.9.1 · Android 14, Chrome 128, mạng 3G giới hạn 400 kbps</td></tr>
<tr><td>Giai đoạn</td><td>Beta (acceptance) testing</td></tr>
<tr><td>Bước tái hiện</td><td>1 Đăng nhập sinh viên SE17xxxx · 2 Exams → SWT301 → chọn ca 15/09 07:30 · 3 Giới hạn mạng 400 kbps · 4 Bấm Confirm một lần và chờ</td></tr>
<tr><td>Kết quả mong đợi</td><td>Chỉ tạo một lượt đăng ký; khi timeout app báo rõ ràng và không tạo lượt thứ hai</td></tr>
<tr><td>Kết quả thực tế</td><td>Sau 30 giây báo "Error 500"; lịch hiện môn thi hai lần; log API có hai lệnh POST /bookings cùng nội dung cách nhau 31 giây (tự động thử lại)</td></tr>
<tr><td>Khả năng tái hiện</td><td>4/5 lần trên mạng bị giới hạn; 0/5 lần trên Wi-Fi</td></tr>
<tr><td>Severity / Priority</td><td>Major (hỏng dữ liệu; sinh viên có thể bị tính phí hoặc bị chặn hai lần) · High (tuần đăng ký bắt đầu 13/09)</td></tr>
<tr><td>Vấn đề tổng thể</td><td>Các màn POST khác dùng chung hàm thử lại (đăng ký môn, đóng học phí) có thể cũng bị</td></tr>
<tr><td>Tham chiếu / đính kèm</td><td>Test case TC-REG-018 (xử lý timeout), video màn hình, trích log API, e-mail gốc của người dùng</td></tr>
<tr><td>Trạng thái</td><td>Reported (chờ phân loại)</td></tr>
</tbody>
</table>
<p>Tester đã thêm gì so với e-mail: build và môi trường chính xác (CM, bài 7.4), failure được <em>chủ động tái hiện</em> kèm tần suất, cô lập được yếu tố (tốc độ mạng — việc số 3 ở slide 98), bằng chứng log, ảnh hưởng tới màn hình khác, và giọng văn trung lập, dựa trên sự kiện (bài 1.5). Ví dụ này bám đúng bài tập defect report của fst4 (trang 200, lời giải trang 202), nơi sách liệt kê đúng những thông tin còn thiếu trong e-mail của một đại lý ô tô.</p>
<h3>Ví dụ 2 — đưa DEF-2041 đi qua Figure 5.3</h3>
<ol>
<li><strong>Reported</strong> → (hội đồng phân loại review) <strong>Opened</strong></li>
<li>→ (duyệt cho sửa) <strong>Assigned</strong> cho developer Minh</li>
<li>→ (thêm idempotency key) <strong>Fixed</strong></li>
<li>→ tester chạy lại TC-REG-018 trên build 3.4.1: vẫn ra hai lượt khi thử lại <em>hai</em> lần → <strong>Reopened</strong> (confirmation test fail)</li>
<li>→ (duyệt sửa lại) <strong>Assigned</strong> → <strong>Fixed</strong> ở 3.4.2</li>
<li>→ confirmation test và một lượt regression các màn POST khác đều pass → <strong>Closed</strong></li>
</ol>
<p><strong>Người sở hữu:</strong> tester (Reported), trưởng nhóm phân loại (Opened), developer (Assigned/Fixed), tester (Fixed → Closed/Reopened).</p>
<h3>Ví dụ 3 — cây GQM của slide 100 có số liệu</h3>
<p>Lịch sử cho thấy khoảng <strong>6 defect mỗi KLoC</strong> bị đưa vào code (M2.1 = 6 × KLoC). Kết quả script:</p>
<pre><code>A KLoC 12 est 72 found 60 (rev 30 test 30) yield 83.3% residual 12 EDD 1 OK
B KLoC 8 est 48 found 43 (rev 25 test 18) yield 89.6% residual 5 EDD 0.625 OK
C KLoC 20 est 120 found 70 (rev 30 test 40) yield 58.3% residual 50 EDD 2.5 FAIL
total est 240 found 173 yield 72.1 residual 67 EDD 1.675</code></pre>
<p>Kết luận: <em>cả hệ thống</em> đạt mục tiêu (1,675 &lt; 2), nhưng <strong>module C thì không</strong> (2,5). Yield của nó chỉ 58,3 % — nên quyết định là review và test thêm C, chưa phát hành. Con số trung bình đã che mất module "nóng": lại là defect clustering (Nguyên tắc 4).</p>
<h3>Ví dụ 4 — lời giải bài Metrics Exercise (slide 101)</h3>
<p><strong>Mục tiêu:</strong> trong system test, kiểm tra tối ưu trong thời gian ngắn nhất, dựa trên 3 khách hàng của Reger. <strong>Câu hỏi → số đo:</strong></p>
<table>
<thead><tr><th>Câu hỏi</th><th>Số đo</th></tr></thead>
<tbody>
<tr><td>Q1 Quy trình nào quan trọng nhất với khách hàng?</td><td>M1 độ ưu tiên mỗi quy trình theo từng khách (1–3), trọng số = tổng của 3 khách</td></tr>
<tr><td>Q2 Các quy trình quan trọng đã được phủ chưa?</td><td>M2 độ bao phủ mỗi quy trình (% test case đã chạy); bao phủ có trọng số = Σ(trọng số × bao phủ) / Σ trọng số</td></tr>
<tr><td>Q3 Mỗi quy trình tốt tới đâu?</td><td>M3 số sự cố mỗi quy trình; M4 cơ cấu mức nghiêm trọng (critical ×3, major ×2, minor ×1)</td></tr>
<tr><td>Q4 Có đang dùng ít thời gian nhất không?</td><td>M5 thời gian dự kiến vs đã dùng mỗi quy trình; số sự cố tìm được mỗi giờ</td></tr>
</tbody>
</table>
<p>Số liệu mẫu sau hai ngày system test, tính bằng script:</p>
<pre><code>Order entry weight 8 cov 90% weighted gap 0.8 incidents 6 (crit/maj/min 1/2/3) sev-score 10 h plan/spent 16/14 incidents/h 0.43
Invoicing weight 8 cov 40% weighted gap 4.8 incidents 9 (crit/maj/min 2/3/4) sev-score 16 h plan/spent 16/10 incidents/h 0.9
Reporting weight 4 cov 100% weighted gap 0 incidents 5 (crit/maj/min 0/0/5) sev-score 5 h plan/spent 8/12 incidents/h 0.42
Customer admin weight 4 cov 50% weighted gap 2 incidents 2 (crit/maj/min 0/1/1) sev-score 3 h plan/spent 8/4 incidents/h 0.5
weighted coverage 68.3 % unweighted 70 % total weight 24 time plan 48 spent 40</code></pre>
<p><strong>Đọc kết quả:</strong></p>
<ul>
<li><strong>Invoicing</strong> (lập hoá đơn) — trọng số cao nhất (8) mà mới phủ 40 %, khoảng hụt có trọng số lớn nhất (4,8); lại có điểm nghiêm trọng tệ nhất (16) và tốc độ tìm lỗi cao nhất (0,9 sự cố/giờ). Dồn mấy giờ tới vào đó.</li>
<li><strong>Reporting</strong> — trọng số thấp nhưng đã phủ đủ và vượt ngân sách (12 giờ so với 8): dừng test phần này.</li>
<li><strong>Bao phủ có trọng số</strong> (68,3 %) thấp hơn trung bình thường (70 %) chính vì chỗ hụt nằm ở quy trình quan trọng — con số không trọng số sẽ "tô hồng" cho ta.</li>
<li><strong>Quyết định kết thúc</strong> — tiếp tục tới khi Invoicing và Order entry đạt khoảng 90 % bao phủ và không còn sự cố critical nào mở; đó là "kiểm tra tối ưu trong thời gian ngắn nhất".</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy đề thi.</strong>
<ol>
<li>Severity = tác động, priority = độ gấp — gõ sai tên công ty là <em>severity thấp, priority cao</em>.</li>
<li>Không phải incident nào cũng là defect phần mềm: test hoặc kết quả mong đợi có thể sai.</li>
<li>Sau khi sửa, việc tester kiểm lại là <em>confirmation testing</em>; nếu fail thì trạng thái là <em>Reopened</em>, không phải "New".</li>
<li>Người đọc đầu tiên của defect report là developer, nhưng test manager và cải tiến quy trình cũng là mục tiêu.</li>
<li>Mục tiêu không phải viết nhanh — mà là tái hiện được (slide 96).</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Phân loại defect để rút ra bài học.</strong> IEEE 1044 (phân loại bất thường phần mềm) và <em>Orthogonal Defect Classification</em> của IBM gắn cho mỗi defect các thuộc tính độc lập — loại defect (gán giá trị, kiểm tra điều kiện, thuật toán, giao diện, thời điểm…), trigger (loại test nào làm lộ nó), giai đoạn đưa vào và giai đoạn phát hiện. Gộp cả một bản phát hành, mẫu hình cho biết nên đầu tư vào review, unit test hay yêu cầu tốt hơn — mục tiêu thứ ba của slide 92 được làm một cách hệ thống. <em>Ngoài giáo trình vì CTFL dừng ở việc viết và theo dõi từng báo cáo.</em></div>`),
    books([
      ['fst4', 'Ch.5 §6 "Defect management" — pp.190–196 (PDF 204–210), Figure 5.3 "Defect report life cycle" p.195 (PDF 209); sample questions 11 and 18 pp.198–199; exercise "Defect report" p.200, solution p.202 (PDF 214, 216)', 'Chương 5 §6 "Defect management" — trang 190–196 (PDF 204–210), Figure 5.3 "Defect report life cycle" trang 195 (PDF 209); câu hỏi mẫu 11 và 18 trang 198–199; bài tập "Defect report" trang 200, lời giải trang 202 (PDF 214, 216)'],
      ['fst', '§5.6 "Incident management" — PDF 156–161, Figure 5.3 "Incident report life cycle" on PDF 160', '§5.6 "Incident management" — PDF 156–161, Figure 5.3 "Incident report life cycle" ở PDF 160'],
      ['sp5', '§6.4 "Defect Management": §6.4.2 Creating a Defect Report (PDF 287), §6.4.3 Classifying Failures and Defects (PDF 290), §6.4.4 Defect Status Tracking (PDF 292), §6.4.5 Evaluation and Reporting (PDF 295)', '§6.4 "Defect Management": §6.4.2 Creating a Defect Report (PDF 287), §6.4.3 Classifying Failures and Defects (PDF 290), §6.4.4 Defect Status Tracking (PDF 292), §6.4.5 Evaluation and Reporting (PDF 295)'],
      ['sp4', '§6.6 "Incident Management" — pp.192–200 (PDF 207–215)', '§6.6 "Incident Management" — trang 192–200 (PDF 207–215)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 7.7 More from the 2023 slide set (old SWT5, 56 pages) ─────────────── */
// Old deck 'oswt5' (SWT5.ppt, 2023). Only NEW/PARTIAL pages get a card; the rest are in the table.
const O5 = 'oswt5';
const L77 = {
  title: '7.7 — More from the 2023 slide set: buddy testing, CM activities, test cycles, S-curves|||7.7 — Bổ sung từ bộ slide 2023: buddy testing, 4 hoạt động CM, chu kỳ test, S-curve',
  slug: 'swt301-ch7-slides-2023',
  type: 'VIDEO',
  description: 'Bộ slide SWT5 cũ (2023, 56 trang): 25 trang chưa có trong bài 7.1–7.6 — hệ "buddy", 4 hoạt động quản lý cấu hình, cái gì đặt dưới CM (trừ live data), vì sao ước lượng test khác, chu kỳ test, thời gian viết báo cáo lỗi, S-curve phân kỳ, case history, entry/exit tốt–xấu, theo dõi incident — kèm bảng trang trùng và đối chiếu thuật ngữ cũ → CTFL.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.7 · SWT5 (2023) pages 1–56</span>
<h2>More from the 2023 slide set — what the old SWT5 deck adds</h2>
<p class="lead">Before the current SWT5_tim deck, this course used an older 56-page SWT5 deck (2023, footer "ISTQB / ISEB Foundation Exam Practice"). Most of it is already taught in lessons 7.1–7.6. But 25 pages carry something those lessons do not show: the "buddy" level of independence, the four classic CM activities, why test estimates need several test cycles, the diverging S-curve and a real incident chart.</p>
<p class="nhan">How to use this lesson</p>
<ul>
<li><strong>Table first</strong> — pages already taught are listed with the lesson and slide where you learnt them.</li>
<li><strong>Then slide by slide</strong> — only the new pages, each with its image and an explanation.</li>
<li><strong>Old words</strong> — the deck uses 2000s ISTQB/ISEB vocabulary ("fault", "incident", "acceptance criteria" for entry criteria). Each card gives the current CTFL term.</li>
</ul>
<div class="callout"><strong>Learning objectives.</strong>
<ol>
<li>Place the six organisational structures, including the buddy system, on the independence ladder (K2).</li>
<li>Name the four CM activities and say what is — and is not — put under CM in testing (K2).</li>
<li>Explain why a test estimate must include several fix-and-retest cycles, and estimate them from history (K3).</li>
<li>Read planned/run/passed curves and opened/closed incident curves, name causes of divergence and choose control actions (K3).</li>
<li>Tell poor from good entry/exit criteria, using the current terms (K2).</li>
</ol></div>`,
    `<span class="eyebrow">Chương 7 · Bài 7.7 · SWT5 (2023) trang 1–56</span>
<h2>Bổ sung từ bộ slide 2023 — bộ SWT5 cũ thêm được gì</h2>
<p class="lead">Trước bộ SWT5_tim hiện tại, môn này dùng một bộ SWT5 cũ 56 trang (2023, chân trang "ISTQB / ISEB Foundation Exam Practice"). Phần lớn đã được dạy trong bài 7.1–7.6. Nhưng có 25 trang mang nội dung các bài đó chưa có: mức độc lập "buddy", 4 hoạt động kinh điển của quản lý cấu hình, vì sao ước lượng test phải tính nhiều chu kỳ test, S-curve phân kỳ và một biểu đồ incident thật.</p>
<p class="nhan">Cách học bài này</p>
<ul>
<li><strong>Xem bảng trước</strong> — các trang đã học được ghi kèm bài và số slide nơi bạn đã học.</li>
<li><strong>Rồi học từng slide</strong> — chỉ các trang mới, mỗi trang có ảnh và giải thích.</li>
<li><strong>Thuật ngữ cũ</strong> — bộ slide dùng từ vựng ISTQB/ISEB những năm 2000 ("fault", "incident", "acceptance criteria" để chỉ entry criteria). Mỗi thẻ đều ghi thuật ngữ CTFL hiện hành.</li>
</ul>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ol>
<li>Đặt sáu cơ cấu tổ chức test, kể cả hệ "buddy", lên thang độc lập (K2).</li>
<li>Kể tên 4 hoạt động CM và nói được cái gì được — và không được — đặt dưới CM trong kiểm thử (K2).</li>
<li>Giải thích vì sao ước lượng test phải gồm nhiều chu kỳ sửa–test lại, và ước lượng chúng từ số liệu cũ (K3).</li>
<li>Đọc đường planned/run/passed và đường incident opened/closed, nêu nguyên nhân phân kỳ và chọn hành động kiểm soát (K3).</li>
<li>Phân biệt entry/exit criteria kém và tốt, dùng đúng thuật ngữ hiện hành (K2).</li>
</ol></div>`),
    bi(`<h3>Old pages already taught — no card needed</h3>
<div class="table-wrap"><table>
<thead><tr><th>Old SWT5 (2023) page</th><th>Already taught in…</th></tr></thead>
<tbody>
<tr><td>1, 2, 14, 24, 39, 45 — cover and the "Contents" agenda, repeated before each section</td><td>Title/agenda pages only — the current deck's slides 1–5 do the same job.</td></tr>
<tr><td>3 Importance of independence (faults found over time)</td><td>7.1 — slide 6 "Independence Testing — faults found over time"</td></tr>
<tr><td>5 Testing by developers</td><td>7.1 — slide 9</td></tr>
<tr><td>7 Tester on development team</td><td>7.1 — slide 10</td></tr>
<tr><td>8 Independent test team</td><td>7.1 — slide 11 "Tester(s) outside Development Team"</td></tr>
<tr><td>9 Internal test consultants</td><td>7.1 — slide 12</td></tr>
<tr><td>10 Outside organisation (3rd party)</td><td>7.1 — slide 13</td></tr>
<tr><td>11 Usual choices</td><td>7.1 — slide 14 "Usual choices per test level"</td></tr>
<tr><td>12 So what we have seen thus far</td><td>7.1 — slide 16</td></tr>
<tr><td>13 Skills needed in testing</td><td>7.1 — the "Hidden slide" box after slide 24 (same seven profiles) and slide 20</td></tr>
<tr><td>15 Problems resulting from poor configuration management</td><td>7.4 — slide 76 (same eight problems)</td></tr>
<tr><td>38 What actions can you take?</td><td>7.3 — slide 69</td></tr>
<tr><td>40 Risks and levels of risk</td><td>7.5 — slide 81 (definition and risk level)</td></tr>
<tr><td>41, 42 Product risks</td><td>7.5 — slide 82</td></tr>
<tr><td>43 Risk-based testing</td><td>7.5 — slide 85</td></tr>
<tr><td>44 Four risk options: mitigate, contingency, transfer, ignore</td><td>7.5 — slide 84</td></tr>
<tr><td>46 Incident management — what is an incident?</td><td>7.6 — slide 91</td></tr>
<tr><td>48 Use of incident metrics</td><td>7.6 — slide 95</td></tr>
<tr><td>49 Report as quickly as possible?</td><td>7.6 — slide 96</td></tr>
<tr><td>51 Severity versus priority</td><td>7.6 — slide 97</td></tr>
<tr><td>52 Incident lifecycle — tester vs developer tasks</td><td>7.6 — slide 98</td></tr>
<tr><td>53 Incident lifecycle — Figure 5.3</td><td>7.6 — slide 99 (the same figure)</td></tr>
<tr><td>54 Metrics example (GQM)</td><td>7.6 — slide 100</td></tr>
<tr><td>55 Metrics exercise (Reger)</td><td>7.6 — slide 101</td></tr>
<tr><td>56 Summary: key points</td><td>A five-line recap of the section titles — nothing new.</td></tr>
</tbody>
</table></div>`,
    `<h3>Các trang cũ đã học — không cần thẻ riêng</h3>
<div class="table-wrap"><table>
<thead><tr><th>Trang SWT5 (2023)</th><th>Đã học ở…</th></tr></thead>
<tbody>
<tr><td>1, 2, 14, 24, 39, 45 — trang bìa và mục lục "Contents" lặp lại trước mỗi phần</td><td>Chỉ là trang tiêu đề/mục lục — slide 1–5 của bộ hiện tại làm đúng việc đó.</td></tr>
<tr><td>3 Tầm quan trọng của tính độc lập (số lỗi tìm được theo thời gian)</td><td>7.1 — slide 6 "Independence Testing — faults found over time"</td></tr>
<tr><td>5 Developer tự test</td><td>7.1 — slide 9</td></tr>
<tr><td>7 Tester nằm trong nhóm phát triển</td><td>7.1 — slide 10</td></tr>
<tr><td>8 Nhóm test độc lập</td><td>7.1 — slide 11 "Tester(s) outside Development Team"</td></tr>
<tr><td>9 Tư vấn test nội bộ</td><td>7.1 — slide 12</td></tr>
<tr><td>10 Tổ chức bên ngoài (bên thứ ba)</td><td>7.1 — slide 13</td></tr>
<tr><td>11 Lựa chọn thường gặp</td><td>7.1 — slide 14 "Usual choices per test level"</td></tr>
<tr><td>12 Tóm lại đến giờ</td><td>7.1 — slide 16</td></tr>
<tr><td>13 Các kỹ năng cần trong kiểm thử</td><td>7.1 — hộp "Slide ẩn" sau slide 24 (đúng bảy vai trò đó) và slide 20</td></tr>
<tr><td>15 Sự cố do quản lý cấu hình kém</td><td>7.4 — slide 76 (đúng tám sự cố)</td></tr>
<tr><td>38 Bạn có thể làm gì?</td><td>7.3 — slide 69</td></tr>
<tr><td>40 Rủi ro và mức rủi ro</td><td>7.5 — slide 81 (định nghĩa và mức rủi ro)</td></tr>
<tr><td>41, 42 Rủi ro sản phẩm</td><td>7.5 — slide 82</td></tr>
<tr><td>43 Risk-based testing</td><td>7.5 — slide 85</td></tr>
<tr><td>44 Bốn lựa chọn với rủi ro: mitigate, contingency, transfer, ignore</td><td>7.5 — slide 84</td></tr>
<tr><td>46 Quản lý incident — incident là gì?</td><td>7.6 — slide 91</td></tr>
<tr><td>48 Dùng số đo incident</td><td>7.6 — slide 95</td></tr>
<tr><td>49 Báo cáo càng nhanh càng tốt?</td><td>7.6 — slide 96</td></tr>
<tr><td>51 Severity vs priority</td><td>7.6 — slide 97</td></tr>
<tr><td>52 Vòng đời incident — việc của tester vs developer</td><td>7.6 — slide 98</td></tr>
<tr><td>53 Vòng đời incident — Figure 5.3</td><td>7.6 — slide 99 (cùng hình)</td></tr>
<tr><td>54 Ví dụ số đo (GQM)</td><td>7.6 — slide 100</td></tr>
<tr><td>55 Bài tập số đo (Reger)</td><td>7.6 — slide 101</td></tr>
<tr><td>56 Tóm tắt: ý chính</td><td>Nhắc lại năm tên phần — không có gì mới.</td></tr>
</tbody>
</table></div>`),
    walkHead(O5, 4, 50, 'Only the 25 pages that add something are shown, in page order; skipped numbers are in the table above.', 'Chỉ hiện 25 trang có nội dung mới, theo thứ tự trang; các số bị bỏ qua nằm trong bảng ở trên.'),
    walk(O5, [
      [4, 'Organisational structures for testing',
        `<p class="y-chinh">🎯 Six ways to organise testing, from least to most independent — one rung more than the current deck shows.</p>
<p class="nhan">The six structures (low → high independence)</p>
<ol>
<li><strong>Developer responsibility (only)</strong> — the author tests their own code (current slide 9).</li>
<li><strong>Development team responsibility — the "buddy system"</strong> — developers test each other's code. Not in the current deck: see page 6 below.</li>
<li><strong>Tester(s) on the development team</strong> — current slide 10.</li>
<li><strong>Dedicated team of testers (not developers)</strong> — current slide 11.</li>
<li><strong>Internal test consultants</strong> — they advise, review and support, but do <em>not</em> perform the testing (current slide 12).</li>
<li><strong>Outside organisation</strong> — 3rd-party testers (current slide 13).</li>
</ol>
<p class="nhan">Matching it to CTFL 2018 (§5.1.1)</p>
<p>The syllabus ladder has the same rungs: no independent testers → independent developers or testers inside the team (this is where "developers testing their colleagues' products" — the buddy system — sits) → an independent test team → testers from the business/user side or specialists (usability, security, performance…) → external testers.</p>
<p class="meo">🧠 <strong>Remember:</strong> the further the tester is from the code's author, the more independent — and the less they know about the code.</p>`,
        `<p class="y-chinh">🎯 Sáu cách tổ chức kiểm thử, từ ít đến nhiều độc lập — nhiều hơn bộ slide hiện tại một nấc.</p>
<p class="nhan">Sáu cơ cấu (độc lập thấp → cao)</p>
<ol>
<li><strong>Chỉ developer chịu trách nhiệm</strong> — tác giả tự test code của mình (slide 9 hiện tại).</li>
<li><strong>Nhóm phát triển chịu trách nhiệm — "hệ buddy"</strong> — các developer test code của nhau. Bộ hiện tại không có: xem trang 6 bên dưới.</li>
<li><strong>Tester nằm trong nhóm phát triển</strong> — slide 10 hiện tại.</li>
<li><strong>Một nhóm tester chuyên trách (không phải developer)</strong> — slide 11 hiện tại.</li>
<li><strong>Tư vấn test nội bộ</strong> — tư vấn, review và hỗ trợ, nhưng <em>không</em> tự thực hiện việc test (slide 12 hiện tại).</li>
<li><strong>Tổ chức bên ngoài</strong> — tester bên thứ ba (slide 13 hiện tại).</li>
</ol>
<p class="nhan">Đối chiếu với CTFL 2018 (§5.1.1)</p>
<p>Thang của syllabus có đúng các nấc này: không có tester độc lập → developer hoặc tester độc lập trong nhóm (đây là chỗ của "developer test sản phẩm của đồng nghiệp" — hệ buddy) → nhóm test độc lập → tester từ phía nghiệp vụ/người dùng hoặc chuyên gia (usability, security, performance…) → tester bên ngoài.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> người test càng xa tác giả code thì càng độc lập — và càng ít hiểu code.</p>`],
      [6, 'Testing by development team',
        `<p class="y-chinh">🎯 The "buddy system" — developers test each other's code — buys some independence at almost no cost, but it is still a developer's view.</p>
<p class="nhan">Pros</p>
<ul>
<li><strong>Some independence</strong> — it is not your own code, so the author's blind spots are gone.</li>
<li><strong>Technical depth</strong> — the buddy can read the code and design white-box tests.</li>
<li><strong>On friendly terms with the "buddy"</strong> — a colleague's remark is less threatening than a report from a test team.</li>
</ul>
<p class="nhan">Cons</p>
<ul>
<li><strong>Pressure of own development work</strong> — testing a colleague's code gets squeezed by your own deadlines.</li>
<li><strong>Technical view, not business view</strong> — it checks that the code works as written, not that it meets the user's need.</li>
<li><strong>Lack of testing skill</strong> — developers are rarely trained in techniques such as equivalence partitioning or boundary value analysis.</li>
</ul>
<p>It sits between slide 9 (developer alone) and slide 10 (a tester in the team). Today's forms of it are peer code review, pull-request review and pair programming.</p>
<p class="meo">🧠 <strong>Remember:</strong> a buddy is a second pair of eyes, not a second mind-set.</p>`,
        `<p class="y-chinh">🎯 "Hệ buddy" — developer test code của nhau — có thêm chút độc lập gần như không tốn gì, nhưng vẫn là góc nhìn của developer.</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Có phần độc lập</strong> — không phải code của mình nên hết điểm mù của tác giả.</li>
<li><strong>Chiều sâu kỹ thuật</strong> — người buddy đọc được code và thiết kế được test white-box.</li>
<li><strong>Quan hệ thân thiện với "buddy"</strong> — góp ý của đồng nghiệp đỡ "đe doạ" hơn một báo cáo từ nhóm test.</li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Áp lực việc phát triển của chính mình</strong> — test code của bạn bị ép bởi deadline của mình.</li>
<li><strong>Góc nhìn kỹ thuật, không phải nghiệp vụ</strong> — kiểm code chạy đúng như đã viết, chứ không kiểm nó có đáp ứng nhu cầu người dùng.</li>
<li><strong>Thiếu kỹ năng test</strong> — developer hiếm khi được học các kỹ thuật như phân vùng tương đương hay phân tích giá trị biên.</li>
</ul>
<p>Nó nằm giữa slide 9 (developer tự làm) và slide 10 (có tester trong nhóm). Dạng ngày nay của nó là peer code review, review pull request và lập trình cặp (pair programming).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> buddy là thêm một đôi mắt, chứ không phải thêm một lối tư duy.</p>`],
    ]),
    walk(O5, [
      [16, 'A definition of Configuration Management',
        `<p class="y-chinh">🎯 The classic IEEE definition: CM identifies the configuration items, controls their release and change, records their status and verifies they are complete and correct.</p>
<p class="nhan">The four parts of the definition</p>
<ol>
<li><strong>Identify and define</strong> the configuration items (<strong>CI</strong>) in a system.</li>
<li><strong>Control the release and change</strong> of these items throughout the system life cycle.</li>
<li><strong>Record and report the status</strong> of CIs and of change requests (<strong>CR</strong>).</li>
<li><strong>Verify the completeness and correctness</strong> of CIs.</li>
</ol>
<p>These four parts are exactly the four activities on the next page.</p>
<p class="nhan">An outdated source</p>
<ul>
<li><strong>ANSI/IEEE Std 729-1983</strong> — replaced by IEEE 610.12-1990 and, today, by the vocabulary standard ISO/IEC/IEEE 24765.</li>
<li><strong>What to write in the exam</strong> — CTFL 2018 words the purpose as: establish and maintain the <em>integrity</em> of the component or system, the testware and their relationships through the project and product lifecycle (current slide 77, lesson 7.4).</li>
</ul>`,
        `<p class="y-chinh">🎯 Định nghĩa kinh điển của IEEE: CM định danh các configuration item, kiểm soát việc phát hành và thay đổi chúng, ghi nhận trạng thái và kiểm tra chúng đầy đủ, đúng.</p>
<p class="nhan">Bốn vế của định nghĩa</p>
<ol>
<li><strong>Định danh và xác định</strong> các configuration item (<strong>CI</strong> — hạng mục cấu hình) của hệ thống.</li>
<li><strong>Kiểm soát việc phát hành và thay đổi</strong> các hạng mục đó suốt vòng đời hệ thống.</li>
<li><strong>Ghi nhận và báo cáo trạng thái</strong> của CI và của change request (<strong>CR</strong> — yêu cầu thay đổi).</li>
<li><strong>Kiểm tra tính đầy đủ và đúng đắn</strong> của CI.</li>
</ol>
<p>Bốn vế này chính là bốn hoạt động ở trang kế tiếp.</p>
<p class="nhan">Nguồn đã cũ</p>
<ul>
<li><strong>ANSI/IEEE Std 729-1983</strong> — đã được thay bằng IEEE 610.12-1990 và nay là chuẩn thuật ngữ ISO/IEC/IEEE 24765.</li>
<li><strong>Viết gì khi thi</strong> — CTFL 2018 diễn đạt mục đích là: thiết lập và duy trì <em>tính toàn vẹn</em> của component hay hệ thống, của testware và quan hệ giữa chúng suốt vòng đời dự án và sản phẩm (slide 77 hiện tại, bài 7.4).</li>
</ul>`],
      [17, 'Configuration Management — four activities',
        `<p class="y-chinh">🎯 CM is an engineering management procedure made of four activities: identification, change control, status accounting and audit.</p>
<ol>
<li><strong>Configuration identification</strong> — decide what is a CI, then name and number it (page 18).</li>
<li><strong>Configuration change control</strong> — no change to a CI without an approved, recorded request (page 21).</li>
<li><strong>Configuration status accounting</strong> — record and report the current state and history of every CI and CR (page 22).</li>
<li><strong>Configuration audit</strong> — check that what was built matches what was recorded and required (page 22).</li>
</ol>
<p>Source on the slide: <em>Encyclopedia of Software Engineering</em>, 1994. The same four core activities are still used by the CM standards (for example IEEE 828 for CM plans).</p>
<p class="meo">🧠 <strong>Remember:</strong> "Name it · Guard it · Record it · Check it".</p>
<p class="ghi-chu">CTFL 2018 does not ask you to list these four names; it asks what CM must ensure for testing (current slide 78). The four activities explain <em>how</em> CM delivers that.</p>`,
        `<p class="y-chinh">🎯 CM là một thủ tục quản lý kỹ thuật gồm bốn hoạt động: định danh, kiểm soát thay đổi, ghi nhận trạng thái và kiểm toán.</p>
<ol>
<li><strong>Configuration identification</strong> (định danh cấu hình) — quyết định cái gì là CI, rồi đặt tên và đánh số (trang 18).</li>
<li><strong>Configuration change control</strong> (kiểm soát thay đổi) — không đổi CI nào nếu không có yêu cầu được duyệt và ghi lại (trang 21).</li>
<li><strong>Configuration status accounting</strong> (ghi nhận trạng thái) — ghi và báo cáo trạng thái hiện tại và lịch sử của mọi CI và CR (trang 22).</li>
<li><strong>Configuration audit</strong> (kiểm toán cấu hình) — kiểm tra thứ đã build khớp với thứ đã ghi nhận và được yêu cầu (trang 22).</li>
</ol>
<p>Nguồn trên slide: <em>Encyclopedia of Software Engineering</em>, 1994. Bốn hoạt động cốt lõi này vẫn được các chuẩn CM dùng (ví dụ IEEE 828 về kế hoạch CM).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "Đặt tên · Canh giữ · Ghi sổ · Kiểm tra".</p>
<p class="ghi-chu">CTFL 2018 không bắt bạn kể bốn tên này; nó hỏi CM phải đảm bảo gì cho kiểm thử (slide 78 hiện tại). Bốn hoạt động giải thích CM làm điều đó <em>bằng cách nào</em>.</p>`],
    ]),
    walk(O5, [
      [18, 'Configuration identification',
        `<p class="y-chinh">🎯 Identification decides <em>which</em> things are configuration items and gives each one a unique, versioned name.</p>
<p class="nhan">What is a CI?</p>
<p>The slide: a "stand alone, test alone, use alone element" — something that can be stored, tested and used on its own: a module, a build, a config file, a test script, a test plan.</p>
<p class="nhan">Six sub-activities (the boxes under "Configuration Identification")</p>
<ol>
<li><strong>CI planning</strong> — which items will be controlled, and from when.</li>
<li><strong>Configuration structures</strong> — how CIs relate: system → subsystems → components; test suite → test cases + data.</li>
<li><strong>Selection criteria</strong> — the rule for what becomes a CI, e.g. anything delivered, tested against or shared by several people.</li>
<li><strong>Naming conventions</strong> — e.g. <code>TC-LOGIN-003</code>, <code>payment-service</code>.</li>
<li><strong>Version/issue numbering</strong> — e.g. build 2.3.1, issue 4 of the test plan.</li>
<li><strong>Baseline/release planning</strong> — which versions are frozen together, e.g. "Release 2.3 = build 2.3.1 + config v7 + test suite v3".</li>
</ol>
<p class="nhan">Why a tester cares</p>
<p>A defect report can only say "found in build 2.3.1 with test case TC-LOGIN-003 v2" if both have been identified. Without identification there is nothing to reproduce.</p>`,
        `<p class="y-chinh">🎯 Định danh quyết định <em>thứ nào</em> là configuration item và gán cho mỗi thứ một tên duy nhất có phiên bản.</p>
<p class="nhan">CI là gì?</p>
<p>Slide ghi: "stand alone, test alone, use alone element" — một phần tử có thể lưu, test và dùng độc lập: một module, một build, một file cấu hình, một test script, một test plan.</p>
<p class="nhan">Sáu hoạt động con (các ô dưới "Configuration Identification")</p>
<ol>
<li><strong>CI planning</strong> (lập kế hoạch CI) — những hạng mục nào sẽ được kiểm soát, và từ lúc nào.</li>
<li><strong>Configuration structures</strong> (cấu trúc cấu hình) — các CI liên hệ ra sao: hệ thống → hệ con → component; bộ test → test case + dữ liệu.</li>
<li><strong>Selection criteria</strong> (tiêu chí chọn) — quy tắc cái gì thành CI, vd mọi thứ được bàn giao, được dùng làm chuẩn để test, hay nhiều người cùng dùng.</li>
<li><strong>Naming conventions</strong> (quy ước đặt tên) — vd <code>TC-LOGIN-003</code>, <code>payment-service</code>.</li>
<li><strong>Version/issue numbering</strong> (đánh số phiên bản) — vd build 2.3.1, lần ban hành thứ 4 của test plan.</li>
<li><strong>Baseline/release planning</strong> (kế hoạch baseline/phát hành) — những phiên bản nào được "đóng băng" cùng nhau, vd "Release 2.3 = build 2.3.1 + config v7 + bộ test v3".</li>
</ol>
<p class="nhan">Vì sao tester cần</p>
<p>Defect report chỉ ghi được "tìm thấy ở build 2.3.1 với test case TC-LOGIN-003 v2" khi cả hai đã được định danh. Không định danh thì không có gì để tái hiện.</p>`],
      [19, 'Common CIs (a BMC table)',
        `<p class="y-chinh">🎯 A table from BMC (an IT-service-management vendor): configuration items are far more than code.</p>
<ul>
<li><strong>Services</strong> — email, printing, collaboration, presentation, data processing, user registration.</li>
<li><strong>Software</strong> — applications, databases, virtual machines, containers, licences.</li>
<li><strong>Hardware</strong> — servers, routers, computers, switches, printers.</li>
<li><strong>Devices</strong> — laptops, tablets, smartphones, monitors, keyboards, mice.</li>
<li><strong>Documents</strong> — policies, governance, release notes, user guides, troubleshooting manuals.</li>
<li><strong>Locations</strong> — offices, data centres, server rooms.</li>
<li><strong>Staff</strong> — service desk agents, support specialists, developers.</li>
</ul>
<p class="nhan">Read it in the right context</p>
<p>This is the IT-service-management (ITIL) view, where a configuration database tracks everything that delivers a service — even rooms and people. In testing the CIs are narrower: test items and testware (page 23). The environment rows still matter: the OS, browser, server or phone a test ran on must be recorded, or the failure cannot be reproduced.</p>
<p class="ghi-chu">The page map marked this page "near-empty" because its content is an image; it is a full table.</p>`,
        `<p class="y-chinh">🎯 Một bảng của BMC (hãng phần mềm quản lý dịch vụ CNTT): configuration item không chỉ là code.</p>
<ul>
<li><strong>Services</strong> (dịch vụ) — email, in ấn, cộng tác, trình chiếu, xử lý dữ liệu, đăng ký người dùng.</li>
<li><strong>Software</strong> (phần mềm) — ứng dụng, cơ sở dữ liệu, máy ảo, container, giấy phép.</li>
<li><strong>Hardware</strong> (phần cứng) — server, router, máy tính, switch, máy in.</li>
<li><strong>Devices</strong> (thiết bị) — laptop, tablet, điện thoại, màn hình, bàn phím, chuột.</li>
<li><strong>Documents</strong> (tài liệu) — chính sách, quản trị, release notes, hướng dẫn sử dụng, tài liệu xử lý sự cố.</li>
<li><strong>Locations</strong> (địa điểm) — văn phòng, trung tâm dữ liệu, phòng máy chủ.</li>
<li><strong>Staff</strong> (nhân sự) — nhân viên service desk, chuyên viên hỗ trợ, developer.</li>
</ul>
<p class="nhan">Đọc đúng bối cảnh</p>
<p>Đây là góc nhìn quản lý dịch vụ CNTT (ITIL), nơi một cơ sở dữ liệu cấu hình theo dõi mọi thứ tạo nên dịch vụ — kể cả phòng ốc và con người. Trong kiểm thử, CI hẹp hơn: hạng mục test và testware (trang 23). Nhưng các dòng về môi trường vẫn quan trọng: hệ điều hành, trình duyệt, server hay điện thoại mà test đã chạy phải được ghi lại, nếu không thì không tái hiện được failure.</p>
<p class="ghi-chu">Bảng đối chiếu tự động đánh dấu trang này "gần như trống" vì nội dung là ảnh; thực ra đây là một bảng đầy đủ.</p>`],
    ]),
    walk(O5, [
      [20, 'Configuration Management Workflows',
        `<p class="y-chinh">🎯 An ITIL-style process map shows CM as a loop — plan, identify, control, report, audit — wired to change management and incident management.</p>
<p class="nhan">The six CM boxes (ST = Service Transition)</p>
<ol>
<li><strong>ST3.1 Configuration management and planning</strong> — triggered by a periodic review of the plan.</li>
<li><strong>ST3.2 Configuration identification</strong> — feeds back into planning.</li>
<li><strong>ST3.3 Configuration control</strong> — receives the plan and feeds identification and status accounting.</li>
<li><strong>ST3.4 Status accounting and reporting</strong> — also triggered by "generate periodic status reports".</li>
<li><strong>ST3.5 Verification and audit</strong> — triggered by a periodic audit.</li>
<li><strong>ST3.6 Manage master data</strong> — fed by master data received from trusted sources.</li>
</ol>
<p class="nhan">The two neighbouring processes</p>
<ul>
<li><strong>ST2 Change management</strong> — gets input from identification and control, and feeds back into planning and into verification/audit.</li>
<li><strong>SO2 Incident management</strong> (SO = Service Operation) — uses the output of status accounting, audit and master data.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> incidents are analysed with CM data — to explain a failure you must know exactly which configuration was running.</p>`,
        `<p class="y-chinh">🎯 Một sơ đồ quy trình kiểu ITIL cho thấy CM là một vòng — lập kế hoạch, định danh, kiểm soát, báo cáo, kiểm toán — nối với quản lý thay đổi và quản lý sự cố.</p>
<p class="nhan">Sáu ô của CM (ST = Service Transition)</p>
<ol>
<li><strong>ST3.1 Quản lý cấu hình và lập kế hoạch</strong> — khởi động bởi việc rà soát kế hoạch định kỳ.</li>
<li><strong>ST3.2 Định danh cấu hình</strong> — phản hồi ngược về khâu lập kế hoạch.</li>
<li><strong>ST3.3 Kiểm soát cấu hình</strong> — nhận kế hoạch, cung cấp cho định danh và ghi nhận trạng thái.</li>
<li><strong>ST3.4 Ghi nhận trạng thái và báo cáo</strong> — còn được khởi động bởi "lập báo cáo trạng thái định kỳ".</li>
<li><strong>ST3.5 Kiểm tra và kiểm toán</strong> — khởi động bởi đợt kiểm toán định kỳ.</li>
<li><strong>ST3.6 Quản lý dữ liệu gốc (master data)</strong> — nhận dữ liệu gốc từ các nguồn tin cậy.</li>
</ol>
<p class="nhan">Hai quy trình bên cạnh</p>
<ul>
<li><strong>ST2 Quản lý thay đổi</strong> — nhận đầu vào từ định danh và kiểm soát, rồi phản hồi về lập kế hoạch và về kiểm tra/kiểm toán.</li>
<li><strong>SO2 Quản lý sự cố</strong> (SO = Service Operation) — dùng đầu ra của ghi nhận trạng thái, kiểm toán và dữ liệu gốc.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> sự cố được phân tích bằng dữ liệu CM — muốn giải thích một failure, bạn phải biết chính xác cấu hình nào đang chạy.</p>`],
      [21, 'Configuration control',
        `<p class="y-chinh">🎯 After identification, configuration control guards every CI: it lives in a controlled library and changes only through fault reporting and change control, decided by a Configuration Control Board.</p>
<p class="nhan">Controlled area / library</p>
<ul>
<li><strong>CI submission</strong> — an item enters the library only through a formal submission.</li>
<li><strong>Status/version control</strong> — each CI has a status (draft, reviewed, baselined…) and a version.</li>
<li><strong>Withdrawal/distribution control</strong> — who may take out or receive a copy; no uncontrolled copies.</li>
</ul>
<p class="nhan">Problem / fault reporting</p>
<ul>
<li><strong>Investigation</strong> — find the cause and which CIs are affected.</li>
<li><strong>Clearance</strong> — the problem is resolved and the report closed.</li>
</ul>
<p class="nhan">Change control</p>
<ul>
<li><strong>Impact analysis</strong> — what else must change: code, tests, documents, schedule.</li>
<li><strong>Authorised amendment</strong> — the change is approved before it is made (the teacher's notes: authorised = <em>ủy quyền</em>, amendment = <em>sửa đổi</em>).</li>
<li><strong>Review/test</strong> — the changed CI is reviewed and tested (confirmation and regression testing) before it re-enters the baseline.</li>
</ul>
<p><strong>Configuration Control Board (CCB)</strong> — the group (e.g. project manager, dev lead, test lead, customer representative) that approves or rejects change requests.</p>
<p class="ghi-chu">"Problem/fault reporting" is today's defect management (lesson 7.6); CTFL says <em>defect</em> rather than "fault".</p>`,
        `<p class="y-chinh">🎯 Sau khi định danh, kiểm soát cấu hình canh giữ mọi CI: CI nằm trong thư viện có kiểm soát và chỉ thay đổi qua báo cáo lỗi và kiểm soát thay đổi, do Configuration Control Board quyết.</p>
<p class="nhan">Khu vực / thư viện có kiểm soát</p>
<ul>
<li><strong>CI submission</strong> (nộp CI) — hạng mục chỉ vào thư viện qua một lần nộp chính thức.</li>
<li><strong>Status/version control</strong> (kiểm soát trạng thái/phiên bản) — mỗi CI có trạng thái (nháp, đã review, đã baseline…) và phiên bản.</li>
<li><strong>Withdrawal/distribution control</strong> (kiểm soát lấy ra/phân phối) — ai được lấy ra hay nhận bản sao; không có bản sao trôi nổi.</li>
</ul>
<p class="nhan">Báo cáo vấn đề / lỗi</p>
<ul>
<li><strong>Investigation</strong> (điều tra) — tìm nguyên nhân và các CI bị ảnh hưởng.</li>
<li><strong>Clearance</strong> (giải toả) — vấn đề đã xử lý xong và báo cáo được đóng.</li>
</ul>
<p class="nhan">Kiểm soát thay đổi</p>
<ul>
<li><strong>Impact analysis</strong> (phân tích tác động) — còn gì phải đổi theo: code, test, tài liệu, lịch.</li>
<li><strong>Authorised amendment</strong> — thay đổi phải được duyệt trước khi làm (ghi chú của thầy/cô: authorised = <em>ủy quyền</em>, amendment = <em>sửa đổi</em>).</li>
<li><strong>Review/test</strong> — CI đã đổi được review và test (confirmation và regression testing) trước khi quay lại baseline.</li>
</ul>
<p><strong>Configuration Control Board (CCB)</strong> — nhóm (vd project manager, trưởng nhóm dev, trưởng nhóm test, đại diện khách hàng) duyệt hoặc từ chối các change request.</p>
<p class="ghi-chu">"Problem/fault reporting" chính là quản lý defect ngày nay (bài 7.6); CTFL dùng từ <em>defect</em> thay cho "fault".</p>`],
    ]),
    walk(O5, [
      [22, 'Status accounting & Configuration Auditing',
        `<p class="y-chinh">🎯 Status accounting records the state of every CI and change; auditing checks that the record and the product agree — "agree with the customer what has been built, tested &amp; delivered".</p>
<p class="nhan">Status accounting</p>
<ul>
<li><strong>Status accounting database</strong> — the record itself (today: version control plus the issue tracker).</li>
<li><strong>Input to the SA database</strong> — every submission, change and release is logged.</li>
<li><strong>Queries and reports</strong> — e.g. "which change requests are in build 2.3.1?"</li>
<li><strong>Data analysis</strong> — gives <em>traceability</em> and <em>impact analysis</em> (the note in the middle of the slide).</li>
</ul>
<p class="nhan">Configuration auditing</p>
<ul>
<li><strong>Procedural conformance</strong> — was the CM procedure actually followed?</li>
<li><strong>CI verification</strong> — does each CI match its record: right version, complete?</li>
</ul>
<p class="nhan">Examples for testers</p>
<ul>
<li><strong>Release notes</strong> listing the defects fixed in a build are a status-accounting report.</li>
<li><strong>Before a release</strong>, an audit checks that the test summary report refers to exactly the build being shipped.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ghi nhận trạng thái lưu tình trạng của mọi CI và thay đổi; kiểm toán kiểm tra sổ sách và sản phẩm có khớp nhau — "thống nhất với khách hàng cái gì đã được build, test và bàn giao".</p>
<p class="nhan">Status accounting (ghi nhận trạng thái)</p>
<ul>
<li><strong>Cơ sở dữ liệu status accounting</strong> — chính cuốn sổ (ngày nay: version control cộng issue tracker).</li>
<li><strong>Đầu vào cho cơ sở dữ liệu SA</strong> — mọi lần nộp, thay đổi và phát hành đều được ghi.</li>
<li><strong>Truy vấn và báo cáo</strong> — vd "những change request nào nằm trong build 2.3.1?"</li>
<li><strong>Phân tích dữ liệu</strong> — cho ra <em>truy vết</em> (traceability) và <em>phân tích tác động</em> (ghi chú ở giữa slide).</li>
</ul>
<p class="nhan">Configuration auditing (kiểm toán cấu hình)</p>
<ul>
<li><strong>Procedural conformance</strong> (tuân thủ thủ tục) — thủ tục CM có thực sự được làm theo không?</li>
<li><strong>CI verification</strong> (kiểm tra CI) — mỗi CI có khớp với hồ sơ: đúng phiên bản, đầy đủ?</li>
</ul>
<p class="nhan">Ví dụ cho tester</p>
<ul>
<li><strong>Release notes</strong> liệt kê các defect đã sửa trong một build là một báo cáo status accounting.</li>
<li><strong>Trước khi phát hành</strong>, kiểm toán xác nhận test summary report nói về đúng build sắp giao.</li>
</ul>`],
      [23, 'Products for CM in testing',
        `<p class="y-chinh">🎯 All testware belongs under CM — "CM is critical for controlled testing" — with one famous exception: live data.</p>
<p class="nhan">What goes under CM</p>
<ul>
<li><strong>Test plans</strong> and <strong>test designs</strong>.</li>
<li><strong>Test cases</strong> — test input, test data, test scripts, expected results.</li>
<li><strong>Actual results</strong> — test logs are the evidence of what really happened.</li>
<li><strong>Test tools</strong> — the tool version matters: a script may fail on a new version of the tool, not of the product.</li>
</ul>
<p class="nhan">The question on the slide: what would NOT be under CM?</p>
<p><strong>Live data!</strong> Production data changes every minute, belongs to the business and its users, and often contains personal data — it cannot be frozen and versioned. What you do put under CM is the test data <em>derived</em> from it: a masked, versioned snapshot.</p>
<p class="meo">🧠 <strong>Remember:</strong> if you would need it to repeat the test next year, put it under CM.</p>
<p class="ghi-chu">CTFL calls all of these <em>testware</em> and adds the test environment set-up (current slide 78, lesson 7.4).</p>`,
        `<p class="y-chinh">🎯 Mọi testware đều phải đặt dưới CM — "CM là then chốt để kiểm thử có kiểm soát" — trừ một ngoại lệ nổi tiếng: dữ liệu thật (live data).</p>
<p class="nhan">Những gì đặt dưới CM</p>
<ul>
<li><strong>Test plan</strong> và <strong>test design</strong>.</li>
<li><strong>Test case</strong> — dữ liệu vào, dữ liệu test, test script, kết quả mong đợi.</li>
<li><strong>Kết quả thực tế</strong> — test log là bằng chứng về điều đã thật sự xảy ra.</li>
<li><strong>Công cụ test</strong> — phiên bản công cụ quan trọng: script có thể fail vì công cụ lên bản mới, chứ không phải vì sản phẩm.</li>
</ul>
<p class="nhan">Câu hỏi trên slide: cái gì KHÔNG đặt dưới CM?</p>
<p><strong>Live data!</strong> Dữ liệu production đổi từng phút, thuộc về doanh nghiệp và người dùng, lại thường chứa dữ liệu cá nhân — không thể đóng băng và đánh phiên bản. Thứ bạn đặt dưới CM là dữ liệu test <em>rút ra</em> từ nó: một bản chụp đã che dữ liệu nhạy cảm và có phiên bản.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cái gì năm sau cần để chạy lại đúng bài test đó thì đặt dưới CM.</p>
<p class="ghi-chu">CTFL gọi chung những thứ này là <em>testware</em> và thêm cả cách dựng môi trường test (slide 78 hiện tại, bài 7.4).</p>`],
    ]),
    walk(O5, [
      [25, 'Estimating testing is no different',
        `<p class="y-chinh">🎯 Estimating testing starts like estimating any job: tasks, durations, people, dates, resources and predictable dependencies.</p>
<p class="nhan">Estimating any job involves</p>
<ol>
<li><strong>Identify tasks</strong></li>
<li><strong>How long</strong> for each task</li>
<li><strong>Who</strong> should perform the task</li>
<li><strong>When</strong> the task should start and finish</li>
<li><strong>What resources, what skills</strong></li>
<li><strong>Predictable dependencies</strong>:
<ul>
<li><strong>task precedence</strong> — build the test before running it;</li>
<li><strong>technical precedence</strong> — "add &amp; display before edit": you cannot test editing a record that cannot yet be created or shown.</li>
</ul></li>
</ol>
<p>Technical precedence is exactly what the execution-schedule questions of lesson 7.2 (slides 40, 54, 56) test.</p>`,
        `<p class="y-chinh">🎯 Ước lượng kiểm thử bắt đầu như ước lượng mọi công việc: đầu việc, thời lượng, người làm, ngày, nguồn lực và các phụ thuộc biết trước.</p>
<p class="nhan">Ước lượng mọi công việc gồm</p>
<ol>
<li><strong>Xác định đầu việc</strong></li>
<li><strong>Mỗi việc mất bao lâu</strong></li>
<li><strong>Ai</strong> làm việc đó</li>
<li><strong>Khi nào</strong> bắt đầu và kết thúc</li>
<li><strong>Nguồn lực nào, kỹ năng nào</strong></li>
<li><strong>Phụ thuộc biết trước</strong>:
<ul>
<li><strong>thứ tự công việc</strong> — phải dựng test xong rồi mới chạy;</li>
<li><strong>thứ tự kỹ thuật</strong> — "add &amp; display trước edit": không thể test sửa một bản ghi khi còn chưa tạo được hay hiển thị được nó.</li>
</ul></li>
</ol>
<p>Thứ tự kỹ thuật chính là thứ các câu hỏi lịch thực thi ở bài 7.2 (slide 40, 54, 56) kiểm tra.</p>`],
      [26, 'Estimating testing is different',
        `<p class="y-chinh">🎯 Testing adds dependencies the test team does not control — and an unknown number of fix-and-retest cycles.</p>
<p class="nhan">Additional destabilising dependencies</p>
<ul>
<li><strong>Testing is not an independent activity</strong> — it needs something to test, delivered by others.</li>
<li><strong>Delivery schedules for testable items are missed</strong> — a late build eats test time, but the end date rarely moves.</li>
<li><strong>Test environments are critical</strong> — no environment, no testing.</li>
</ul>
<p class="nhan">Test iterations (cycles)</p>
<ol>
<li>Testing should find faults…</li>
<li>…faults need to be fixed…</li>
<li>…after they are fixed, you need to retest…</li>
<li>…and <strong>how many times does this happen?</strong> Nobody knows before testing starts — pages 27–29 show how to estimate it.</li>
</ol>
<p class="ghi-chu">In CTFL 2018 these are the "factors influencing test effort" (current slides 42–45), especially <em>test results</em>: the number and severity of defects found and the amount of rework. "Fault" is the old word for <em>defect</em>.</p>`,
        `<p class="y-chinh">🎯 Kiểm thử có thêm những phụ thuộc mà nhóm test không kiểm soát được — và một số chu kỳ sửa–test lại không biết trước.</p>
<p class="nhan">Những phụ thuộc gây bất ổn thêm</p>
<ul>
<li><strong>Kiểm thử không phải hoạt động độc lập</strong> — nó cần thứ để test, do người khác giao.</li>
<li><strong>Lịch giao hạng mục test bị trễ</strong> — build giao muộn ăn vào thời gian test, còn ngày kết thúc hiếm khi lùi.</li>
<li><strong>Môi trường test là then chốt</strong> — không có môi trường thì không test được.</li>
</ul>
<p class="nhan">Các vòng test (chu kỳ)</p>
<ol>
<li>Kiểm thử phải tìm ra lỗi…</li>
<li>…lỗi phải được sửa…</li>
<li>…sửa xong phải test lại…</li>
<li>…và <strong>chuyện này lặp lại bao nhiêu lần?</strong> Không ai biết trước khi bắt đầu test — trang 27–29 chỉ cách ước lượng.</li>
</ol>
<p class="ghi-chu">Trong CTFL 2018 đây là các "yếu tố ảnh hưởng công sức test" (slide 42–45 hiện tại), nhất là <em>kết quả test</em>: số lượng và mức nghiêm trọng của defect tìm được và khối lượng làm lại. "Fault" là từ cũ của <em>defect</em>.</p>`],
    ]),
    walk(O5, [
      [27, 'Test cycles / iterations',
        `<p class="y-chinh">🎯 In theory a test is prepared and run once; in practice execution is followed by debug–retest loops — 3–4 iterations is typical.</p>
<p class="nhan">Theory (top bar)</p>
<p>One "Test" block with five steps: <strong>Iden</strong>tify, <strong>Des</strong>ign, <strong>B</strong>ui<strong>ld</strong>, <strong>Ex</strong>ecute, <strong>Ver</strong>ify. Only Ex and Ver fan out into "Retest".</p>
<p class="nhan">Practice (bottom bar)</p>
<p>Test → Debug → Retest → D → R → D → R. Identification, design and build happen once; <em>execution</em> repeats after every round of fixes.</p>
<p class="nhan">Old step names → CTFL 2018 test process</p>
<ul>
<li><strong>Identify</strong> (what to test) → test analysis (test conditions).</li>
<li><strong>Design</strong> → test design (test cases).</li>
<li><strong>Build</strong> → test implementation (procedures, data, environment).</li>
<li><strong>Execute + Verify</strong> → test execution (run, compare actual with expected).</li>
<li><strong>Debug</strong> → the developer's job, not testing (CTFL: debugging is a development activity).</li>
<li><strong>Retest</strong> → confirmation testing, plus regression testing around the fix.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> plan 3–4 execution cycles, not one — the first is the longest, each later one is shorter.</p>`,
        `<p class="y-chinh">🎯 Trên lý thuyết bài test được chuẩn bị và chạy một lần; trên thực tế sau khi chạy là các vòng debug–test lại — thường 3–4 vòng.</p>
<p class="nhan">Lý thuyết (thanh trên)</p>
<p>Một khối "Test" với năm bước: <strong>Iden</strong>tify (xác định), <strong>Des</strong>ign (thiết kế), <strong>B</strong>ui<strong>ld</strong> (dựng), <strong>Ex</strong>ecute (chạy), <strong>Ver</strong>ify (kiểm kết quả). Chỉ Ex và Ver toả ra thành "Retest".</p>
<p class="nhan">Thực tế (thanh dưới)</p>
<p>Test → Debug → Retest → D → R → D → R. Xác định, thiết kế và dựng chỉ làm một lần; <em>chạy test</em> lặp lại sau mỗi đợt sửa.</p>
<p class="nhan">Tên bước cũ → quy trình test CTFL 2018</p>
<ul>
<li><strong>Identify</strong> (test cái gì) → test analysis (test condition).</li>
<li><strong>Design</strong> → test design (test case).</li>
<li><strong>Build</strong> → test implementation (thủ tục, dữ liệu, môi trường).</li>
<li><strong>Execute + Verify</strong> → test execution (chạy, so thực tế với mong đợi).</li>
<li><strong>Debug</strong> → việc của developer, không phải kiểm thử (CTFL: debugging là hoạt động phát triển).</li>
<li><strong>Retest</strong> → confirmation testing, cộng regression testing quanh chỗ sửa.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> lập kế hoạch 3–4 chu kỳ chạy test, không phải một — chu kỳ đầu dài nhất, các chu kỳ sau ngắn dần.</p>`],
      [28, 'Estimating iterations',
        `<p class="y-chinh">🎯 How many cycles, and how long? Estimate from history: expected faults, how many each cycle finds, how many fixes fail, and the time spent reporting and waiting.</p>
<ol>
<li><strong>Past history</strong> — data from earlier, similar projects.</li>
<li><strong>Number of faults expected</strong>:
<ul>
<li>predicted from previous test effectiveness and the faults found earlier (in test, review, Inspection);</li>
<li><strong>% found in each iteration</strong> — "nested faults": some faults hide behind others and appear only after the first one is fixed;</li>
<li><strong>% fixed [in]correctly</strong> — every bad fix comes back in the next cycle.</li>
</ul></li>
<li><strong>Time to report faults</strong> — page 29.</li>
<li><strong>Time waiting for fixes</strong> — testers idle or switching tasks.</li>
<li><strong>How much in each iteration?</strong> — a full rerun, or only retests plus a regression subset?</li>
</ol>
<p>The worked example after the walkthrough puts numbers on every line. In CTFL terms this is a <em>metrics-based</em> estimate (current slide 48).</p>`,
        `<p class="y-chinh">🎯 Bao nhiêu chu kỳ, mỗi chu kỳ bao lâu? Ước lượng từ số liệu cũ: số lỗi dự kiến, mỗi chu kỳ tìm được bao nhiêu, bao nhiêu lần sửa hỏng, và thời gian viết báo cáo, thời gian chờ.</p>
<ol>
<li><strong>Số liệu quá khứ</strong> — dữ liệu từ các dự án tương tự trước đây.</li>
<li><strong>Số lỗi dự kiến</strong>:
<ul>
<li>dự đoán từ hiệu quả test trước đây và số lỗi đã tìm được trước đó (khi test, review, Inspection);</li>
<li><strong>% tìm được ở mỗi vòng</strong> — "lỗi lồng nhau" (nested faults): có lỗi nấp sau lỗi khác, chỉ lộ ra khi lỗi đầu được sửa;</li>
<li><strong>% sửa đúng/sai</strong> — mỗi lần sửa hỏng sẽ quay lại ở vòng sau.</li>
</ul></li>
<li><strong>Thời gian viết báo cáo lỗi</strong> — trang 29.</li>
<li><strong>Thời gian chờ bản sửa</strong> — tester ngồi chờ hoặc chuyển việc.</li>
<li><strong>Mỗi vòng chạy bao nhiêu?</strong> — chạy lại toàn bộ, hay chỉ test lại chỗ sửa cộng một phần regression?</li>
</ol>
<p>Ví dụ có lời giải sau phần học từng slide gắn số cho từng dòng. Theo CTFL, đây là ước lượng <em>dựa trên số liệu</em> (metrics-based, slide 48 hiện tại).</p>`],
    ]),
    walk(O5, [
      [29, 'Time to report faults',
        `<p class="y-chinh">🎯 Writing fault reports costs test time — the more reports you write, the less testing you can do.</p>
<p class="nhan">The slide's question, worked out</p>
<ul>
<li><strong>10 minutes per report</strong>, an 8-hour day = 480 minutes → at most 480 ÷ 10 = <strong>48 reports</strong> — and then zero testing that day.</li>
<li><strong>The bar</strong> — roughly three quarters "Test", one quarter "Fault analysis &amp; reporting".</li>
</ul>
<p class="nhan">The suspension criterion quoted on the slide</p>
<p>Suspend testing when testers spend <strong>more than 25 %</strong> of their time on faults. 25 % of 480 minutes = 120 minutes = <strong>12 reports</strong> of 10 minutes a day. More than that means the software is not ready: stop, send it back, resume when the fixes arrive.</p>
<p class="ghi-chu">Current term: <em>suspension criteria and resumption requirements</em>, one of the 16 sections of an IEEE 829 test plan (lesson 7.2, slide 27). The slide credits the rule to a named practitioner; the rule is what matters here.</p>`,
        `<p class="y-chinh">🎯 Viết báo cáo lỗi tốn thời gian test — càng viết nhiều báo cáo thì càng test được ít.</p>
<p class="nhan">Câu hỏi trên slide, tính ra</p>
<ul>
<li><strong>10 phút mỗi báo cáo</strong>, một ngày 8 giờ = 480 phút → tối đa 480 ÷ 10 = <strong>48 báo cáo</strong> — và hôm đó không test được gì.</li>
<li><strong>Thanh ngang</strong> — khoảng ba phần tư là "Test", một phần tư là "Phân tích và báo cáo lỗi".</li>
</ul>
<p class="nhan">Tiêu chí tạm dừng ghi trên slide</p>
<p>Tạm dừng test khi tester dành <strong>hơn 25 %</strong> thời gian cho lỗi. 25 % của 480 phút = 120 phút = <strong>12 báo cáo</strong> loại 10 phút mỗi ngày. Nhiều hơn nghĩa là phần mềm chưa sẵn sàng: dừng lại, trả về, và test tiếp khi có bản sửa.</p>
<p class="ghi-chu">Thuật ngữ hiện hành: <em>suspension criteria and resumption requirements</em> (tiêu chí tạm dừng và điều kiện tiếp tục), một trong 16 mục của test plan IEEE 829 (bài 7.2, slide 27). Slide ghi tên người đưa ra quy tắc này; điều cần nhớ là chính quy tắc.</p>`],
      [30, 'Measuring test execution progress 1',
        `<p class="y-chinh">🎯 Plot tests planned, run and passed over time: here "run" climbs fast but "passed" barely moves — the curves diverge.</p>
<p class="nhan">Reading the chart</p>
<ul>
<li><strong>Tests planned</strong> — the flat line at the top: the total to reach by the release date.</li>
<li><strong>Tests run</strong> — rising steeply up to "now".</li>
<li><strong>Tests passed</strong> — low and almost flat.</li>
<li><strong>The gap between run and passed</strong> — tests that failed (or were blocked). At this rate "passed" will never meet "planned" by the release date.</li>
</ul>
<p class="nhan">The two questions on the slide</p>
<ol>
<li><strong>What does this mean?</strong> — most tests fail: the software (or what was let into test) is not good enough. Possible causes: page 31.</li>
<li><strong>What would you do?</strong> — a control action, also on page 31.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> a healthy progress chart is an S-curve — slow start, steep middle, flat end — with "run" and "passed" close together.</p>`,
        `<p class="y-chinh">🎯 Vẽ số test planned, run và passed theo thời gian: ở đây "run" tăng nhanh mà "passed" gần như đứng yên — hai đường phân kỳ.</p>
<p class="nhan">Đọc biểu đồ</p>
<ul>
<li><strong>Tests planned</strong> (dự kiến) — đường ngang trên cùng: tổng số phải đạt trước ngày phát hành.</li>
<li><strong>Tests run</strong> (đã chạy) — tăng dốc cho tới "now".</li>
<li><strong>Tests passed</strong> (đạt) — thấp và gần như phẳng.</li>
<li><strong>Khoảng cách giữa run và passed</strong> — các test fail (hoặc bị chặn). Cứ đà này, "passed" sẽ không bao giờ chạm "planned" trước ngày phát hành.</li>
</ul>
<p class="nhan">Hai câu hỏi trên slide</p>
<ol>
<li><strong>Điều này nghĩa là gì?</strong> — phần lớn test fail: phần mềm (hoặc thứ được cho vào test) chưa đủ tốt. Nguyên nhân có thể: trang 31.</li>
<li><strong>Bạn sẽ làm gì?</strong> — một hành động kiểm soát, cũng ở trang 31.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> biểu đồ tiến độ khoẻ mạnh có dạng chữ S — đầu chậm, giữa dốc, cuối phẳng — và "run" với "passed" đi sát nhau.</p>`],
    ]),
    walk(O5, [
      [31, 'Diverging S-curve',
        `<p class="y-chinh">🎯 When "run" and "passed" drift apart, find the likely cause first, then choose a control action — and remember every action has side effects, e.g. on the schedule.</p>
<p class="nhan">Possible causes</p>
<ol>
<li><strong>Poor test entry criteria</strong> — software was accepted into test before it was ready.</li>
<li><strong>Ran easy tests first</strong> — early progress looked good; the hard tests left now fail.</li>
<li><strong>Insufficient debug effort</strong> — fixes are not coming back, so failed tests stay failed.</li>
<li><strong>Common faults affect all tests</strong> — one fault (e.g. broken login) blocks many tests at once.</li>
<li><strong>Software quality very poor</strong></li>
</ol>
<p class="nhan">Potential control actions</p>
<ol>
<li><strong>Tighten entry criteria</strong></li>
<li><strong>Cancel the project</strong> — the extreme option.</li>
<li><strong>Do more debugging</strong></li>
<li><strong>Stop testing until faults are fixed</strong></li>
<li><strong>Continue testing to scope software quality</strong> — keep running tests to measure how bad things are.</li>
</ol>
<p>The arrows are many-to-many: each cause has several possible actions, and "software quality very poor" points to all five.</p>
<p class="ghi-chu">Current syllabus version of this idea: the test control examples on slide 62 and "What actions can you take?" on slide 69 (lesson 7.3).</p>`,
        `<p class="y-chinh">🎯 Khi "run" và "passed" tách xa nhau, hãy tìm nguyên nhân khả dĩ trước rồi mới chọn hành động kiểm soát — và nhớ mọi hành động đều có tác dụng phụ, vd lên lịch.</p>
<p class="nhan">Nguyên nhân có thể</p>
<ol>
<li><strong>Entry criteria quá lỏng</strong> — phần mềm được nhận vào test khi chưa sẵn sàng.</li>
<li><strong>Chạy test dễ trước</strong> — tiến độ ban đầu trông đẹp; còn lại toàn test khó nên giờ fail.</li>
<li><strong>Không đủ công debug</strong> — bản sửa không về, nên test fail vẫn fail.</li>
<li><strong>Lỗi chung ảnh hưởng mọi test</strong> — một lỗi (vd đăng nhập hỏng) chặn nhiều test cùng lúc.</li>
<li><strong>Chất lượng phần mềm rất kém</strong></li>
</ol>
<p class="nhan">Hành động kiểm soát khả dĩ</p>
<ol>
<li><strong>Siết entry criteria</strong></li>
<li><strong>Huỷ dự án</strong> — lựa chọn cực đoan.</li>
<li><strong>Tăng công debug</strong></li>
<li><strong>Dừng test tới khi lỗi được sửa</strong></li>
<li><strong>Tiếp tục test để đo phạm vi chất lượng</strong> — cứ chạy để biết phần mềm tệ tới đâu.</li>
</ol>
<p>Các mũi tên là nhiều–nhiều: mỗi nguyên nhân có vài hành động khả dĩ, và "chất lượng rất kém" chỉ tới cả năm.</p>
<p class="ghi-chu">Phiên bản theo syllabus hiện tại của ý này: các ví dụ kiểm soát test ở slide 62 và "What actions can you take?" ở slide 69 (bài 7.3).</p>`],
      [32, 'Measuring test execution progress 2',
        `<p class="y-chinh">🎯 After a control action, "run" pauses while faults are fixed and "passed" climbs steeply — but at the old release date neither has reached "planned", so the date moves.</p>
<ul>
<li><strong>Action taken</strong> — the vertical line about a quarter of the way along.</li>
<li><strong>"Run" goes flat for a while</strong> — testing is stopped until faults are fixed (one of the page-31 actions).</li>
<li><strong>"Passed" rises steeply</strong> — retests of the fixed faults now pass, and the two curves come closer.</li>
<li><strong>At the old release date</strong> — "run" is close to "planned" but not there, and "passed" is clearly below it.</li>
<li><strong>New release date</strong> — the side effect page 31 warned about: the schedule slips.</li>
</ul>`,
        `<p class="y-chinh">🎯 Sau một hành động kiểm soát, "run" tạm đứng trong lúc sửa lỗi còn "passed" tăng dốc — nhưng tới ngày phát hành cũ cả hai chưa chạm "planned", nên ngày phải lùi.</p>
<ul>
<li><strong>Action taken</strong> — vạch đứng ở khoảng một phần tư trục thời gian.</li>
<li><strong>"Run" đi ngang một đoạn</strong> — dừng test tới khi lỗi được sửa (một trong các hành động ở trang 31).</li>
<li><strong>"Passed" tăng dốc</strong> — các test lại cho lỗi đã sửa giờ đạt, hai đường xích lại gần nhau.</li>
<li><strong>Tại ngày phát hành cũ</strong> — "run" gần tới "planned" nhưng chưa tới, còn "passed" thấp hơn rõ.</li>
<li><strong>Ngày phát hành mới</strong> — đúng tác dụng phụ trang 31 đã cảnh báo: lịch bị lùi.</li>
</ul>`],
    ]),
    walk(O5, [
      [33, 'Measuring test execution progress 3',
        `<p class="y-chinh">🎯 The same project continued: after the old release date "run" levels off just below "planned" and "passed" closes in on it by the new date — the curves converge.</p>
<ul>
<li><strong>"Run" flattens just under "planned"</strong> — a few tests were never run (descoped or blocked); a summary report must say which, and why.</li>
<li><strong>"Passed" keeps rising</strong> towards "run" — the remaining failures are being fixed and retested.</li>
<li><strong>Converging curves</strong> — the sign that exit criteria can be met at the new release date.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> pages 30 → 32 → 33 are one story — measure, act, measure again. That last step is the "feedback" of page 35.</p>`,
        `<p class="y-chinh">🎯 Tiếp tục dự án đó: sau ngày phát hành cũ, "run" chững lại ngay dưới "planned" và "passed" áp sát nó trước ngày mới — hai đường hội tụ.</p>
<ul>
<li><strong>"Run" đi ngang ngay dưới "planned"</strong> — vài test không bao giờ được chạy (bị cắt phạm vi hoặc bị chặn); báo cáo tổng kết phải nêu là test nào, vì sao.</li>
<li><strong>"Passed" tiếp tục tăng</strong> về phía "run" — các lỗi còn lại đang được sửa và test lại.</li>
<li><strong>Hai đường hội tụ</strong> — dấu hiệu có thể đạt exit criteria vào ngày phát hành mới.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trang 30 → 32 → 33 là một câu chuyện — đo, hành động, đo lại. Bước cuối chính là "phản hồi" (feedback) ở trang 35.</p>`],
      [34, 'Case history — incident reports opened vs closed',
        `<p class="y-chinh">🎯 Real project data (Philips, 1999): cumulative incident reports opened vs closed — closing lagged far behind opening for months, then caught up in bursts.</p>
<p class="nhan">Reading the chart (values read off the graph, approximate)</p>
<ul>
<li><strong>Opened IRs</strong> — a jump from about 10 to about 40 in early July, about 120 by mid-September, about 155 by early November, flattening near 167 by January.</li>
<li><strong>Closed IRs</strong> — slow: about 35 by mid-September, about 100 by late October, then a jump to about 145 in early November and about 160 by January.</li>
<li><strong>The gap</strong> = incidents still open. It is widest in September–October (roughly 70–85) and only about 7 at the end.</li>
</ul>
<p class="nhan">What it tells a test manager</p>
<ul>
<li><strong>Opened flattening</strong> — fewer new incidents are found: the product is stabilising, or the tests are "wearing out" (lesson 7.6, slide 95).</li>
<li><strong>A near-vertical step in "closed"</strong> — a batch closure, e.g. a triage meeting or a build with many fixes.</li>
<li><strong>Release readiness</strong> — "opened" flat and "closed" close to it.</li>
</ul>
<p class="ghi-chu">"IR" = incident report; CTFL today says <em>defect report</em>. The slide's source line also names the author; only the company and year are needed here.</p>`,
        `<p class="y-chinh">🎯 Dữ liệu dự án thật (Philips, 1999): số incident report mở và đóng cộng dồn — việc đóng tụt xa sau việc mở suốt nhiều tháng, rồi đuổi kịp theo từng đợt.</p>
<p class="nhan">Đọc biểu đồ (giá trị đọc từ đồ thị, gần đúng)</p>
<ul>
<li><strong>Opened IRs</strong> (đã mở) — nhảy từ khoảng 10 lên khoảng 40 đầu tháng 7, khoảng 120 giữa tháng 9, khoảng 155 đầu tháng 11, rồi phẳng dần quanh 167 vào tháng 1.</li>
<li><strong>Closed IRs</strong> (đã đóng) — chậm: khoảng 35 giữa tháng 9, khoảng 100 cuối tháng 10, rồi nhảy lên khoảng 145 đầu tháng 11 và khoảng 160 vào tháng 1.</li>
<li><strong>Khoảng cách</strong> = số incident còn mở. Rộng nhất vào tháng 9–10 (khoảng 70–85) và chỉ còn khoảng 7 lúc cuối.</li>
</ul>
<p class="nhan">Điều test manager đọc được</p>
<ul>
<li><strong>Đường opened phẳng dần</strong> — tìm được ít incident mới hơn: sản phẩm đang ổn định, hoặc bộ test đang "mòn" (bài 7.6, slide 95).</li>
<li><strong>Một bậc gần thẳng đứng ở đường closed</strong> — đóng hàng loạt, vd sau một buổi triage hoặc một build có nhiều bản sửa.</li>
<li><strong>Sẵn sàng phát hành</strong> — "opened" đã phẳng và "closed" sát nó.</li>
</ul>
<p class="ghi-chu">"IR" = incident report; CTFL ngày nay gọi là <em>defect report</em>. Dòng nguồn trên slide có ghi tên tác giả; ở đây chỉ cần tên công ty và năm.</p>`],
    ]),
    walk(O5, [
      [35, 'Control',
        `<p class="y-chinh">🎯 Control = management actions and decisions that change the process, tasks and people so the objectives are met — against the original or a modified plan.</p>
<p class="nhan">Management actions and decisions</p>
<ul>
<li><strong>Affect</strong> the process, the tasks and the people.</li>
<li><strong>To meet</strong> the original or a modified plan.</li>
<li><strong>To achieve</strong> the objectives.</li>
</ul>
<p class="nhan">Examples on the slide</p>
<ul>
<li><strong>Tighten entry/exit criteria</strong> — pages 36–37.</li>
<li><strong>Reallocation of resources</strong> — e.g. move two testers to the riskiest area, or ask for more debug effort.</li>
</ul>
<p><strong>Feedback is essential</strong> to see the effect of actions and decisions — measure again after acting, as pages 32–33 did.</p>
<p class="ghi-chu">CTFL 2018 wording: test control takes the actions needed to meet the objectives of the test plan, which may itself be updated. Its three syllabus examples are on current slide 62 (lesson 7.3).</p>`,
        `<p class="y-chinh">🎯 Kiểm soát (control) = các hành động và quyết định quản lý thay đổi quy trình, công việc và con người để đạt mục tiêu — theo kế hoạch gốc hoặc kế hoạch đã điều chỉnh.</p>
<p class="nhan">Hành động và quyết định quản lý</p>
<ul>
<li><strong>Tác động</strong> lên quy trình, công việc và con người.</li>
<li><strong>Để đáp ứng</strong> kế hoạch gốc hoặc kế hoạch đã sửa.</li>
<li><strong>Để đạt</strong> mục tiêu.</li>
</ul>
<p class="nhan">Ví dụ trên slide</p>
<ul>
<li><strong>Siết entry/exit criteria</strong> — trang 36–37.</li>
<li><strong>Phân bổ lại nguồn lực</strong> — vd chuyển hai tester sang vùng rủi ro nhất, hoặc xin thêm công debug.</li>
</ul>
<p><strong>Phản hồi là thiết yếu</strong> để thấy hiệu quả của hành động và quyết định — đo lại sau khi hành động, như trang 32–33 đã làm.</p>
<p class="ghi-chu">Cách nói của CTFL 2018: kiểm soát test là thực hiện các hành động cần thiết để đạt mục tiêu của test plan, và bản thân plan có thể được cập nhật. Ba ví dụ của syllabus nằm ở slide 62 hiện tại (bài 7.3).</p>`],
      [36, 'Entry and exit criteria',
        `<p class="y-chinh">🎯 Between two test phases, phase 1's exit criteria and phase 2's entry criteria must meet: "tested" for phase 1 has to mean "ready for my testing" for phase 2.</p>
<p class="nhan">The picture</p>
<ul>
<li><strong>Test phase 1</strong> hands over something it calls "tested".</li>
<li><strong>Test phase 2</strong> asks: "is it ready for my testing?"</li>
</ul>
<p class="nhan">The table — old names</p>
<ul>
<li><strong>Phase 1 → exit criteria</strong>, also called <em>completion criteria</em>.</li>
<li><strong>Phase 2 → entry criteria</strong>, which the slide also calls <em>acceptance criteria</em>.</li>
</ul>
<div class="pitfall">
<p><strong>Outdated term.</strong> In today's ISTQB glossary <em>completion criteria</em> is still a synonym of exit criteria (Agile: "definition of done"), and entry criteria are the "definition of ready".</p>
<p>But <em>acceptance criteria</em> now means something else: the criteria a component or system must satisfy to be accepted by a user, customer or other authorised entity — e.g. the acceptance criteria of a user story. Never write "acceptance criteria" for entry criteria in the exam.</p>
</div>
<p class="ghi-chu">Current slides 38–39 (lesson 7.2) give the syllabus lists of typical entry and exit criteria.</p>`,
        `<p class="y-chinh">🎯 Giữa hai giai đoạn test, exit criteria của giai đoạn 1 và entry criteria của giai đoạn 2 phải khớp nhau: "đã test" với giai đoạn 1 phải có nghĩa là "sẵn sàng cho tôi test" với giai đoạn 2.</p>
<p class="nhan">Hình vẽ</p>
<ul>
<li><strong>Giai đoạn test 1</strong> bàn giao một thứ nó gọi là "tested".</li>
<li><strong>Giai đoạn test 2</strong> hỏi: "nó đã sẵn sàng cho tôi test chưa?"</li>
</ul>
<p class="nhan">Bảng — tên gọi cũ</p>
<ul>
<li><strong>Giai đoạn 1 → exit criteria</strong>, còn gọi là <em>completion criteria</em>.</li>
<li><strong>Giai đoạn 2 → entry criteria</strong>, slide còn gọi là <em>acceptance criteria</em>.</li>
</ul>
<div class="pitfall">
<p><strong>Thuật ngữ đã cũ.</strong> Trong glossary ISTQB hiện nay, <em>completion criteria</em> vẫn là từ đồng nghĩa của exit criteria (Agile: "definition of done"), còn entry criteria là "definition of ready".</p>
<p>Nhưng <em>acceptance criteria</em> nay mang nghĩa khác: các tiêu chí mà component hay hệ thống phải thoả để được người dùng, khách hàng hoặc bên có thẩm quyền chấp nhận — vd acceptance criteria của một user story. Khi thi, đừng bao giờ viết "acceptance criteria" để chỉ entry criteria.</p>
</div>
<p class="ghi-chu">Slide 38–39 hiện tại (bài 7.2) có danh sách entry và exit criteria điển hình theo syllabus.</p>`],
    ]),
    walk(O5, [
      [37, 'Entry/exit criteria examples',
        `<p class="y-chinh">🎯 Criteria ranked from poor to better: a good criterion is objective and measurable — evidence, not a claim.</p>
<p class="nhan">The list, top (poor) to bottom (better)</p>
<ol>
<li><strong>Clean compiled</strong> — proves only that the syntax is right.</li>
<li><strong>Programmer claims it is working OK</strong> — a claim, not evidence.</li>
<li><strong>Lots of tests have been run</strong> — "lots" cannot be measured, and says nothing about results.</li>
<li><strong>Tests have been reviewed / Inspected</strong> — the tests themselves are trustworthy.</li>
<li><strong>No faults found in current tests</strong></li>
<li><strong>All faults found fixed and retested</strong></li>
<li><strong>Specified coverage achieved</strong> — a measurable target.</li>
<li><strong>All tests run after the last fault fix, no new faults</strong> — the strongest: it also covers the regression risk of the fixes.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> if two people can disagree whether a criterion is met, it is a poor criterion.</p>
<p class="ghi-chu">"Faults" = defects in current wording. Compare the syllabus exit criteria on current slide 39 (lesson 7.2): planned tests executed, coverage reached, unresolved defects within an agreed limit.</p>`,
        `<p class="y-chinh">🎯 Các tiêu chí xếp từ kém đến tốt: tiêu chí tốt thì khách quan và đo được — là bằng chứng, không phải lời khẳng định.</p>
<p class="nhan">Danh sách, từ trên (kém) xuống dưới (tốt hơn)</p>
<ol>
<li><strong>Biên dịch sạch</strong> — chỉ chứng minh cú pháp đúng.</li>
<li><strong>Lập trình viên nói nó chạy ổn</strong> — lời khẳng định, không phải bằng chứng.</li>
<li><strong>Đã chạy rất nhiều test</strong> — "rất nhiều" không đo được, và chẳng nói gì về kết quả.</li>
<li><strong>Test đã được review / Inspection</strong> — bản thân bộ test đáng tin.</li>
<li><strong>Không tìm thấy lỗi trong các test hiện tại</strong></li>
<li><strong>Mọi lỗi tìm được đã sửa và test lại</strong></li>
<li><strong>Đạt mức bao phủ đã định</strong> — một mục tiêu đo được.</li>
<li><strong>Chạy lại mọi test sau lần sửa lỗi cuối, không có lỗi mới</strong> — mạnh nhất: nó phủ luôn rủi ro regression do chính các bản sửa.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nếu hai người có thể cãi nhau xem tiêu chí đã đạt chưa, thì đó là tiêu chí kém.</p>
<p class="ghi-chu">"Faults" = defect theo cách nói hiện nay. So với exit criteria của syllabus ở slide 39 hiện tại (bài 7.2): đã chạy các test theo kế hoạch, đạt mức bao phủ, số defect chưa giải quyết trong giới hạn thoả thuận.</p>`],
      [47, 'Incidents',
        `<p class="y-chinh">🎯 Incidents are logged once the software has been handed over to test, tracked through defined stages, and used to monitor and improve testing.</p>
<ul>
<li><strong>May be used to monitor and improve testing</strong> — incident metrics (lesson 7.6, slide 95).</li>
<li><strong>Should be logged after hand-over</strong> — before the hand-over, developers fix their own faults informally during component testing; formal logging starts when the item is delivered to a test stage.</li>
</ul>
<p class="nhan">The stages to track</p>
<ol>
<li><strong>Initial recording</strong></li>
<li><strong>Analysis</strong> — software fault, test fault, enhancement, etc.</li>
<li><strong>Assignment to fix</strong> — only if it is a fault.</li>
<li><strong>Fixed, not tested</strong></li>
<li><strong>Fixed and tested OK</strong> — the confirmation test passed.</li>
<li><strong>Closed</strong></li>
</ol>
<p class="nhan">Current names</p>
<p>Figure 5.3 (current slide 99) says Reported → Opened → Assigned → Fixed → Closed, with Rejected, Deferred and Reopened as side branches. CTFL 2018 calls the report a <em>defect report</em>; an "enhancement" found in analysis is not a defect but a change request.</p>`,
        `<p class="y-chinh">🎯 Incident được ghi nhận từ khi phần mềm đã bàn giao cho test, được theo dõi qua các giai đoạn định sẵn, và dùng để giám sát, cải tiến việc test.</p>
<ul>
<li><strong>Có thể dùng để giám sát và cải tiến việc test</strong> — số đo incident (bài 7.6, slide 95).</li>
<li><strong>Nên ghi nhận sau khi bàn giao</strong> — trước bàn giao, developer tự sửa lỗi của mình một cách không chính thức trong component testing; ghi nhận chính thức bắt đầu khi hạng mục được giao cho một giai đoạn test.</li>
</ul>
<p class="nhan">Các giai đoạn cần theo dõi</p>
<ol>
<li><strong>Ghi nhận ban đầu</strong></li>
<li><strong>Phân tích</strong> — lỗi phần mềm, lỗi của test, yêu cầu cải tiến, v.v.</li>
<li><strong>Giao đi sửa</strong> — chỉ khi đúng là lỗi.</li>
<li><strong>Đã sửa, chưa test</strong></li>
<li><strong>Đã sửa và test đạt</strong> — confirmation test đã pass.</li>
<li><strong>Đóng</strong></li>
</ol>
<p class="nhan">Tên gọi hiện nay</p>
<p>Figure 5.3 (slide 99 hiện tại) ghi Reported → Opened → Assigned → Fixed → Closed, với các nhánh Rejected, Deferred và Reopened. CTFL 2018 gọi báo cáo là <em>defect report</em>; một "enhancement" phát hiện khi phân tích không phải defect mà là change request.</p>`],
    ]),
    walk(O5, [
      [50, 'What information about incidents?',
        `<p class="y-chinh">🎯 A short 2023 checklist of what an incident report must record — a subset of the eleven defect-report components on current slide 93.</p>
<div class="table-wrap"><table>
<thead><tr><th>Old page 50</th><th>Current slide 93 component</th></tr></thead>
<tbody>
<tr><td>Test ID</td><td>References — including the test case that revealed the problem</td></tr>
<tr><td>Test environment</td><td>Test item and environment</td></tr>
<tr><td>Software under test ID</td><td>Test item (configuration item and version)</td></tr>
<tr><td>Actual &amp; expected results</td><td>Expected and actual results</td></tr>
<tr><td>Severity, scope, priority</td><td>Scope or degree of impact (severity); urgency/priority to fix</td></tr>
<tr><td>Name of tester</td><td>Author</td></tr>
<tr><td>Any other relevant information (e.g. how to reproduce it)</td><td>Description enabling reproduction and resolution</td></tr>
</tbody>
</table></div>
<p class="nhan">Missing from the old list</p>
<ul>
<li><strong>Identifier, title, date</strong></li>
<li><strong>Lifecycle phase</strong> in which it was observed</li>
<li><strong>State of the report</strong>, conclusions and approvals, global issues, change history</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "Test ID" and "Software under test ID" only work if CM has identified those items (pages 18 and 23).</p>`,
        `<p class="y-chinh">🎯 Một danh sách ngắn năm 2023 về những gì incident report phải ghi — là tập con của mười một thành phần defect report ở slide 93 hiện tại.</p>
<div class="table-wrap"><table>
<thead><tr><th>Trang 50 (cũ)</th><th>Thành phần tương ứng ở slide 93</th></tr></thead>
<tbody>
<tr><td>Test ID</td><td>References — kể cả test case đã làm lộ vấn đề</td></tr>
<tr><td>Môi trường test</td><td>Test item và môi trường</td></tr>
<tr><td>ID phần mềm đang test</td><td>Test item (configuration item và phiên bản)</td></tr>
<tr><td>Kết quả thực tế và mong đợi</td><td>Kết quả mong đợi và thực tế</td></tr>
<tr><td>Severity, phạm vi, priority</td><td>Phạm vi/mức tác động (severity); độ gấp/ưu tiên sửa</td></tr>
<tr><td>Tên tester</td><td>Author (người lập)</td></tr>
<tr><td>Mọi thông tin liên quan khác (vd cách tái hiện)</td><td>Mô tả giúp tái hiện và xử lý</td></tr>
</tbody>
</table></div>
<p class="nhan">Danh sách cũ còn thiếu</p>
<ul>
<li><strong>Mã định danh, tiêu đề, ngày</strong></li>
<li><strong>Giai đoạn vòng đời</strong> nơi phát hiện</li>
<li><strong>Trạng thái báo cáo</strong>, kết luận và phê duyệt, vấn đề toàn cục, lịch sử thay đổi</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "Test ID" và "ID phần mềm đang test" chỉ ghi được khi CM đã định danh các hạng mục đó (trang 18 và 23).</p>`],
    ]),
    bi(`<h3>Worked example — estimating the test cycles (pages 26–29)</h3>
<p>A system test has 200 test cases of 0.5 h each. History (page 28) says: about 80 faults to expect; the cycles find 60 %, 30 % and 10 % of them (nested faults); 10 % of fixes are wrong and come back; a report takes 10 minutes; every retest cycle also reruns a 40-test regression subset. Computed with a script:</p>
<div class="table-wrap"><table>
<thead><tr><th>Cycle</th><th>Tests run</th><th>Execution</th><th>New faults</th><th>Failed fixes</th><th>Reports</th><th>Reporting</th><th>Total</th></tr></thead>
<tbody>
<tr><td>1</td><td>200 (full run)</td><td>100 h</td><td>48</td><td>0</td><td>48</td><td>8.00 h</td><td>108.00 h</td></tr>
<tr><td>2</td><td>88 (48 retests + 40 regression)</td><td>44 h</td><td>24</td><td>5</td><td>29</td><td>4.83 h</td><td>48.83 h</td></tr>
<tr><td>3</td><td>69 (29 retests + 40 regression)</td><td>34.5 h</td><td>8</td><td>3</td><td>11</td><td>1.83 h</td><td>36.33 h</td></tr>
<tr><td>4</td><td>51 (11 retests + 40 regression)</td><td>25.5 h</td><td>0</td><td>1</td><td>1</td><td>0.17 h</td><td>25.67 h</td></tr>
<tr><td colspan="7"><strong>All four cycles</strong></td><td><strong>218.83 h</strong></td></tr>
</tbody>
</table></div>
<p class="nhan">Reading the result</p>
<ul>
<li><strong>2.19 times the naive estimate</strong> — "run 200 tests once" is 100 h; even adding one report per fault gives only 113.33 h. This is why page 26 says estimating testing is different.</li>
<li><strong>Four cycles</strong> — matching "3–4 iterations is typical" (page 27). Cycle 4 still leaves one failed fix: one more small retest, or accept it against the exit criteria.</li>
<li><strong>Failed fixes</strong> — 10 % of each cycle's reports, rounded: 48 → 5, 29 → 3, 11 → 1.</li>
<li><strong>Time waiting for fixes</strong> (page 28) is not in the table — it stretches the <em>schedule</em>, not the effort.</li>
<li><strong>Reporting load</strong> — 8 h of 108 h in cycle 1 is 7.4 %, well under the 25 % suspension threshold of page 29.</li>
</ul>`,
    `<h3>Ví dụ có lời giải — ước lượng các chu kỳ test (trang 26–29)</h3>
<p>Một đợt system test có 200 test case, mỗi cái 0,5 giờ. Số liệu cũ (trang 28) cho biết: dự kiến khoảng 80 lỗi; các chu kỳ tìm được lần lượt 60 %, 30 % và 10 % số đó (lỗi lồng nhau); 10 % bản sửa bị hỏng và quay lại; viết một báo cáo mất 10 phút; mỗi chu kỳ test lại còn chạy thêm một bộ regression 40 test. Tính bằng script:</p>
<div class="table-wrap"><table>
<thead><tr><th>Chu kỳ</th><th>Số test chạy</th><th>Chạy test</th><th>Lỗi mới</th><th>Sửa hỏng</th><th>Báo cáo</th><th>Viết báo cáo</th><th>Tổng</th></tr></thead>
<tbody>
<tr><td>1</td><td>200 (chạy toàn bộ)</td><td>100 h</td><td>48</td><td>0</td><td>48</td><td>8,00 h</td><td>108,00 h</td></tr>
<tr><td>2</td><td>88 (48 test lại + 40 regression)</td><td>44 h</td><td>24</td><td>5</td><td>29</td><td>4,83 h</td><td>48,83 h</td></tr>
<tr><td>3</td><td>69 (29 test lại + 40 regression)</td><td>34,5 h</td><td>8</td><td>3</td><td>11</td><td>1,83 h</td><td>36,33 h</td></tr>
<tr><td>4</td><td>51 (11 test lại + 40 regression)</td><td>25,5 h</td><td>0</td><td>1</td><td>1</td><td>0,17 h</td><td>25,67 h</td></tr>
<tr><td colspan="7"><strong>Cả bốn chu kỳ</strong></td><td><strong>218,83 h</strong></td></tr>
</tbody>
</table></div>
<p class="nhan">Đọc kết quả</p>
<ul>
<li><strong>Gấp 2,19 lần ước lượng ngây thơ</strong> — "chạy 200 test một lần" là 100 giờ; cộng thêm mỗi lỗi một báo cáo cũng chỉ 113,33 giờ. Vì thế trang 26 nói ước lượng test là khác.</li>
<li><strong>Bốn chu kỳ</strong> — khớp "3–4 vòng là điển hình" (trang 27). Chu kỳ 4 vẫn còn một bản sửa hỏng: test lại thêm một lượt nhỏ, hoặc chấp nhận theo exit criteria.</li>
<li><strong>Sửa hỏng</strong> — 10 % số báo cáo của mỗi chu kỳ, làm tròn: 48 → 5, 29 → 3, 11 → 1.</li>
<li><strong>Thời gian chờ bản sửa</strong> (trang 28) không có trong bảng — nó kéo dài <em>lịch</em>, không làm tăng công sức.</li>
<li><strong>Tải viết báo cáo</strong> — 8 giờ trên 108 giờ ở chu kỳ 1 là 7,4 %, thấp xa ngưỡng tạm dừng 25 % ở trang 29.</li>
</ul>`),
    bi(`<div class="pitfall co-tieu-de"><strong>Exam traps from the 2023 pages.</strong>
<ol>
<li><strong>Internal test consultants</strong> advise, review and support — they do not perform the testing (page 4).</li>
<li><strong>Live data is not put under CM</strong>; a masked, versioned snapshot used as test data is (page 23).</li>
<li><strong>"Acceptance criteria"</strong> on page 36 means entry criteria — today's acceptance criteria are for acceptance by a user or customer. <em>Completion criteria</em> = exit criteria.</li>
<li><strong>Debugging is not testing</strong>; the retest after a fix is confirmation testing (page 27).</li>
<li><strong>Monitoring vs control</strong> — a diverging S-curve is what monitoring shows; tightening entry criteria or stopping testing is control (pages 30–31, 35).</li>
<li><strong>Old words</strong> — fault → defect; incident report (IR) → defect report; ISEB, the old UK exam board in the deck footer → today simply ISTQB CTFL.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The S-curve lives on as the burn-up chart.</strong> Test dashboards in Jira, Azure DevOps or TestRail plot planned scope against executed and passed tests — exactly pages 30–33. A widening gap between "executed" and "passed" is the diverging S-curve. Reliability-growth models fit the "opened" curve of page 34 to predict how many defects are still left.</div>`,
    `<div class="pitfall co-tieu-de"><strong>Bẫy đề thi từ các trang 2023.</strong>
<ol>
<li><strong>Tư vấn test nội bộ</strong> tư vấn, review và hỗ trợ — họ không tự thực hiện việc test (trang 4).</li>
<li><strong>Live data không đặt dưới CM</strong>; bản chụp đã che dữ liệu nhạy cảm, có phiên bản, dùng làm dữ liệu test thì có (trang 23).</li>
<li><strong>"Acceptance criteria"</strong> ở trang 36 nghĩa là entry criteria — acceptance criteria ngày nay là tiêu chí để người dùng hay khách hàng chấp nhận. <em>Completion criteria</em> = exit criteria.</li>
<li><strong>Debug không phải là test</strong>; test lại sau khi sửa là confirmation testing (trang 27).</li>
<li><strong>Giám sát vs kiểm soát</strong> — S-curve phân kỳ là thứ việc giám sát cho thấy; siết entry criteria hay dừng test là kiểm soát (trang 30–31, 35).</li>
<li><strong>Từ cũ</strong> — fault → defect; incident report (IR) → defect report; ISEB, hội đồng thi cũ của Anh ghi ở chân slide → nay chỉ còn ISTQB CTFL.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>S-curve vẫn sống dưới tên burn-up chart.</strong> Dashboard test trong Jira, Azure DevOps hay TestRail vẽ phạm vi dự kiến so với số test đã chạy và đã đạt — đúng như trang 30–33. Khoảng cách "executed" và "passed" ngày càng rộng chính là S-curve phân kỳ. Các mô hình tăng trưởng độ tin cậy (reliability growth) khớp đường "opened" của trang 34 để dự đoán còn bao nhiêu defect.</div>`),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 7 ──────────────────────────────── */
// Every "Question" slide of SWT5 (17) + the hidden pptx slide 60 question + 12 checks on the non-question slides + 6 on the 2023 deck (lesson 7.7).
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const qx = (question, options, correctIndex, explanation) => ({ ...q(question, options, correctIndex), explanation });
const QUIZ7 = {
  title: 'Quiz 7 — Test management (all SWT5 slide questions)|||Quiz 7 — Quản lý test (toàn bộ câu hỏi trên slide SWT5)',
  slug: 'swt301-quiz-7',
  type: 'QUIZ',
  description: '36 câu: đủ 17 câu "Question" trên slide SWT5 + 1 câu ở slide ẩn (đáp án đã giải trong bài 7.1–7.6) + 12 câu kiểm tra phần lý thuyết: độc lập, chiến lược, lịch thực thi, ước lượng, rủi ro, CM, defect — và 6 câu về bộ slide SWT5 2023 (bài 7.7).',
  quiz: {
    timeLimitSeconds: 2160,
    questions: [
      qx('Which BEST describes how tasks are divided between the test manager and the tester? (SWT5 s.21)|||Câu nào mô tả ĐÚNG NHẤT cách chia việc giữa test manager và tester? (SWT5 s.21)', ['Manager plans and chooses standards; tester chooses tools and controls|||Manager lập kế hoạch và chọn chuẩn; tester chọn công cụ và kiểm soát', 'Manager plans, organizes and controls; tester specifies and executes tests|||Manager lập kế hoạch, tổ chức và kiểm soát; tester đặc tả và thực thi test', 'Manager plans, monitors and controls; tester designs tests and decides about automation frameworks|||Manager lập kế hoạch, giám sát, kiểm soát; tester thiết kế test và quyết định framework tự động hoá', 'Manager plans, organizes and specifies test cases; tester prioritizes and executes|||Manager lập kế hoạch, tổ chức và đặc tả test case; tester ưu tiên và thực thi'], 1,
        'Slides 18–19: the test manager plans, organises and controls the testing; the tester specifies and executes the tests. D gives test case specification to the manager, and C gives framework decisions to the tester; both swap the roles.|||Slide 18–19: test manager lập kế hoạch, tổ chức và kiểm soát việc test; tester đặc tả và thực thi test. D giao việc đặc tả test case cho manager, còn C giao quyết định framework cho tester; cả hai đều đảo vai trò.'),
      qx('Who is normally responsible for creating and updating a test plan? (s.22)|||Ai thường chịu trách nhiệm tạo và cập nhật test plan? (s.22)', ['The project manager|||Project manager', 'The test manager|||Test manager', 'The tester|||Tester', 'The product owner|||Product owner'], 1,
        'Slide 18: the test manager writes, updates, adapts and coordinates the test plan; the tester only reviews and contributes (slide 19). The project manager owns the project plan, not the test plan.|||Slide 18: test manager viết, cập nhật, điều chỉnh và điều phối test plan; tester chỉ review và góp ý (slide 19). Project manager sở hữu project plan, không phải test plan.'),
      qx('Which is a benefit of test independence? (s.23)|||Đâu là lợi ích của tính độc lập trong kiểm thử? (s.23)', ['Testers have different biases than developers|||Tester có thiên kiến khác developer', 'Testers are isolated from the development team|||Tester bị tách khỏi nhóm phát triển', 'Testers lack information about the test object|||Tester thiếu thông tin về đối tượng test', 'Testers will accept responsibility for quality|||Tester sẽ nhận trách nhiệm về chất lượng'], 0,
        'Independent testers have different biases from the developers, so they notice defects the author is blind to. Isolation and lack of information are drawbacks of independence, and "testers take responsibility for quality" describes the drawback that developers may stop feeling responsible (lesson 7.1).|||Tester độc lập có thiên kiến khác developer nên nhận ra defect mà tác giả không thấy. Bị tách biệt và thiếu thông tin là nhược điểm của tính độc lập, còn "tester nhận trách nhiệm chất lượng" chính là nhược điểm developer có thể không còn thấy mình chịu trách nhiệm (bài 7.1).'),
      qx('What is the biggest problem with a developer testing his own code? (s.24)|||Vấn đề lớn nhất khi developer tự test code của mình? (s.24)', ['Developers are not good testers|||Developer không giỏi test', 'Developers are not quality focused|||Developer không quan tâm chất lượng', 'Developers are not objective about their own code|||Developer không khách quan với code của mình', 'Developers do not have time to test|||Developer không có thời gian test'], 2,
        'The author carries his own assumptions and misunderstandings into the tests, so he is not objective about his own code and misses the same mistakes he made. Skill, quality focus and time vary by person; the lack of objectivity is built in.|||Tác giả mang chính giả định và hiểu lầm của mình vào test, nên không khách quan với code của mình và bỏ sót đúng những lỗi mình gây ra. Kỹ năng, sự quan tâm chất lượng và thời gian thì tuỳ người; thiếu khách quan thì luôn có sẵn.'),
      qx('Which of the following can affect and be part of test planning? A budget limitations, B test objectives, C test log, D failure rate, E use cases (s.50)|||Điều nào có thể ảnh hưởng và là một phần của lập kế hoạch test? A giới hạn ngân sách, B mục tiêu test, C test log, D tỉ lệ failure, E use case (s.50)', ['A and B|||A và B', 'B and E|||B và E', 'C and D|||C và D', 'A and D|||A và D'], 0,
        'Budget limitations (A) constrain the plan and test objectives (B) are written into it. The test log (C) and the failure rate (D) only exist once tests run, and use cases (E) are test basis for test design, not planning content.|||Giới hạn ngân sách (A) ràng buộc kế hoạch và mục tiêu test (B) được ghi trong kế hoạch. Test log (C) và tỉ lệ failure (D) chỉ có khi đã chạy test, còn use case (E) là test basis cho thiết kế test, không phải nội dung kế hoạch.'),
      qx('Which are typical exit criteria from testing? (s.51)|||Đâu là các exit criteria điển hình? (s.51)', ['Reliability measures, degree of tester independence, product completeness|||Độ tin cậy, mức độc lập của tester, độ hoàn thiện sản phẩm', 'Reliability measures, test cost, availability of testable code, time to market, product completeness|||Độ tin cậy, chi phí test, có code test được, thời điểm ra thị trường, độ hoàn thiện', 'Reliability measures, test cost, schedule and unresolved defects|||Độ tin cậy, chi phí test, lịch và số defect chưa giải quyết', 'Time to market, residual defects, tester qualification, tester independence, test cost|||Thời điểm ra thị trường, defect còn lại, trình độ tester, mức độc lập, chi phí'], 2,
        'Exit criteria say when testing can stop: reliability measures, cost, schedule and the number of unresolved defects. B includes availability of testable code, which is an entry criterion; tester independence or qualification (A, D) are never exit criteria.|||Exit criteria cho biết khi nào được dừng test: độ tin cậy, chi phí, lịch và số defect chưa giải quyết. B có "code test được đã sẵn sàng", là entry criterion; mức độc lập hay trình độ tester (A, D) không bao giờ là exit criteria.'),
      qx('Match 1 Analytical, 2 Methodical, 3 Model-based, 4 Consultative with A state diagram, B level of risk, C predefined set of test conditions, D views of domain experts (s.52)|||Ghép 1 Analytical, 2 Methodical, 3 Model-based, 4 Consultative với A sơ đồ trạng thái, B mức rủi ro, C tập test condition định sẵn, D ý kiến chuyên gia nghiệp vụ (s.52)', ['1D, 2B, 3A, 4C', '1A, 2C, 3D, 4B', '1D, 2C, 3B, 4A', '1B, 2C, 3A, 4D'], 3,
        'Analytical = based on the level of risk (1B); methodical = a predefined set of test conditions (2C); model-based = a state diagram of the product (3A); consultative = views of business domain experts (4D) (lesson 7.2). The state diagram is a model, so it can never go with analytical.|||Analytical = dựa trên mức rủi ro (1B); methodical = tập test condition định sẵn (2C); model-based = sơ đồ trạng thái của sản phẩm (3A); consultative = ý kiến chuyên gia nghiệp vụ (4D) (bài 7.2). Sơ đồ trạng thái là một mô hình nên không thể ghép với analytical.'),
      qx('Which is the characteristic of a metrics-based approach to test estimation? (s.53)|||Đâu là đặc trưng của ước lượng dựa trên số liệu? (s.53)', ['Budget used by a previous similar test project|||Ngân sách của một dự án test tương tự trước đây', 'Overall experience collected in interviews with test managers|||Kinh nghiệm thu qua phỏng vấn test manager', 'Overall estimate agreed with the developers|||Ước lượng thống nhất với developer', 'Average of calculations collected from business experts|||Trung bình các tính toán thu từ chuyên gia nghiệp vụ'], 0,
        'Metrics-based estimation uses data from earlier similar projects, such as the budget a previous similar test project actually used. Interviews with test managers, agreement with developers and figures from business experts all rely on people, so they are expert-based.|||Ước lượng dựa số liệu dùng dữ liệu của các dự án tương tự trước đó, như ngân sách một dự án test tương tự đã thực tế dùng. Phỏng vấn test manager, thống nhất với developer hay số liệu từ chuyên gia nghiệp vụ đều dựa vào con người, nên là expert-based.'),
      qx('R1 → R3, R1 → R2, R3 → R2, R2 → R5 and R6, the R2 group → R4 and R7 ("X → Y" = Y depends on X). Which schedule respects the dependencies? (s.54)|||R1 → R3, R1 → R2, R3 → R2, R2 → R5 và R6, cụm R2 → R4 và R7 ("X → Y" = Y phụ thuộc X). Lịch nào đúng phụ thuộc? (s.54)', ['R1 → R3 → R1 → R2 → R5 → R6 → R4 → R7', 'R1 → R3 → R2 → R5 → R2 → R6 → R4 → R7', 'R1 → R3 → R2 → R5 → R6 → R4 → R7', 'R1 → R2 → R5 → R6 → R3 → R4 → R7'], 2,
        'R1 first, then R3 (needs R1), then R2 (needs R1 and R3), then R5 and R6 (need R2), then R4 and R7. A and B run R1 or R2 twice, and D runs R2 before R3 although R2 depends on R3.|||R1 trước, rồi R3 (cần R1), rồi R2 (cần R1 và R3), rồi R5 và R6 (cần R2), rồi R4 và R7. A và B chạy R1 hoặc R2 hai lần, còn D chạy R2 trước R3 dù R2 phụ thuộc R3.'),
      qx('Test cases vary a lot in length and detail. Where should the test case guidelines have been documented? (s.55)|||Các test case chênh nhau nhiều về độ dài và độ chi tiết. Hướng dẫn viết test case lẽ ra phải ghi ở đâu? (s.55)', ['The test approach|||Test approach', 'The test plan|||Test plan', 'The test case template|||Mẫu test case', 'The project plan|||Project plan'], 1,
        'The test plan sets the level of detail and structure of test documentation, including templates and how detailed test cases must be (lesson 7.2). A template alone gives headings, not the expected depth, which is why the inconsistency happened.|||Test plan quy định mức chi tiết và cấu trúc tài liệu test, gồm cả template và test case cần chi tiết tới đâu (bài 7.2). Chỉ riêng template thì có đề mục chứ không nói cần sâu tới đâu, nên mới xảy ra chênh lệch.'),
      qx('TC1 (Low, needs 6), TC2 (Medium, none), TC3 (High, needs 1), TC4 (High, needs 2), TC5 (Medium, needs 4), TC6 (Low, needs 2). Run by risk with fast feedback — best order? (s.56)|||TC1 (Low, cần 6), TC2 (Medium, không), TC3 (High, cần 1), TC4 (High, cần 2), TC5 (Medium, cần 4), TC6 (Low, cần 2). Chạy theo rủi ro, phản hồi nhanh — thứ tự tốt nhất? (s.56)', ['4, 3, 2, 5, 6, 1', '2, 4, 5, 6, 1, 3', '2, 5, 6, 4, 1, 3', '6, 1, 3, 2, 4, 5'], 1,
        'TC2 has no dependency and unlocks the High TC4: 2, 4. Then TC5 (Medium, needs 4), TC6 (needs 2) and TC1 (needs 6), which finally unlocks the High TC3: 2, 4, 5, 6, 1, 3 (SWT5 slide 56). Option A starts with TC4 before the TC2 it depends on.|||TC2 không phụ thuộc gì và mở khoá TC4 (High): 2, 4. Tiếp theo TC5 (Medium, cần 4), TC6 (cần 2) và TC1 (cần 6), cuối cùng mới mở được TC3 (High): 2, 4, 5, 6, 1, 3 (SWT5 slide 56). Phương án A chạy TC4 trước TC2 mà nó phụ thuộc.'),
      qx('A test strategy based on the list of ISO 25010 quality characteristics is… (s.57)|||Chiến lược test dựa trên danh sách đặc tính chất lượng ISO 25010 là… (s.57)', ['Regulatory', 'Analytical', 'Methodical', 'Reactive'], 2,
        'A methodical strategy systematically uses a predefined set of test conditions, such as the list of ISO 25010 quality characteristics (lesson 7.2). It is not analytical, because the tests are not derived from a risk analysis, and ISO 25010 is a quality model, not a regulation.|||Chiến lược methodical dùng có hệ thống một tập test condition định sẵn, như danh sách đặc tính chất lượng ISO 25010 (bài 7.2). Nó không phải analytical vì test không rút ra từ phân tích rủi ro, và ISO 25010 là mô hình chất lượng, không phải quy định pháp lý.'),
      qx('Another upgrade of an ERP system whose previous upgrade your team tested years ago — best estimation technique? (s.58)|||Thêm một lần nâng cấp hệ thống ERP mà lần trước nhóm bạn đã test — kỹ thuật ước lượng phù hợp nhất? (s.58)', ['Effort-based', 'Expert-based', 'Metric-based', 'Schedule-based'], 2,
        'Your team has real data from the previous upgrade of the same system, so metric-based estimation fits: extrapolate from that project\'s actual effort. Expert-based is the fallback when no historical data exists; effort-based and schedule-based are not syllabus techniques.|||Nhóm bạn có số liệu thật từ lần nâng cấp trước của chính hệ thống này, nên hợp với metric-based: suy ra từ công sức thực tế của dự án đó. Expert-based là lựa chọn khi không có dữ liệu lịch sử; effort-based và schedule-based không phải kỹ thuật trong syllabus.'),
      qx('Which metric is MOST useful to monitor during test execution? (s.70)|||Số đo nào hữu ích NHẤT để theo dõi trong lúc thực thi test? (s.70)', ['Percentage of executed test cases|||Phần trăm test case đã thực thi', 'Percentage of work done in test environment preparation|||Phần trăm công việc dựng môi trường', 'Percentage of planned test cases prepared|||Phần trăm test case đã chuẩn bị', 'Percentage of work done in test case preparation|||Phần trăm công chuẩn bị test case'], 0,
        'During execution, progress is tracked by the percentage of test cases executed against those planned. The other three options measure preparation work (environment, test cases), which belongs before execution.|||Trong lúc thực thi, tiến độ được theo dõi bằng phần trăm test case đã chạy so với kế hoạch. Ba phương án kia đo công việc chuẩn bị (môi trường, test case), vốn thuộc giai đoạn trước thực thi.'),
      qx('Which is NOT included in a test summary report? (s.71)|||Mục nào KHÔNG có trong test summary report? (s.71)', ['Testing planned for the next reporting period|||Việc test dự kiến cho kỳ báo cáo tới', 'Deviations from the test approach|||Chênh lệch so với test approach', 'Measurements of actual progress against exit criteria|||Đo tiến độ thực tế so với exit criteria', 'Evaluation of the quality of the test item|||Đánh giá chất lượng hạng mục test'], 0,
        'Testing planned for the next reporting period belongs to a test progress report, written during testing. The summary report is written at the end, so it has deviations, progress against exit criteria and a quality evaluation, but no next period (lesson 7.3).|||Việc test dự kiến cho kỳ báo cáo tới thuộc test progress report, viết trong lúc đang test. Summary report viết lúc kết thúc nên có chênh lệch, tiến độ so với exit criteria và đánh giá chất lượng, nhưng không còn kỳ tới (bài 7.3).'),
      qx('A metric tracking the number of test cases executed is gathered during… (s.72)|||Số đo đếm test case đã chạy được thu thập trong hoạt động… (s.72)', ['Planning', 'Implementation', 'Execution', 'Reporting'], 2,
        'The number of executed test cases only exists once tests are run, so it is gathered during test execution. Reporting uses the metric but does not produce it, and implementation only prepares the tests.|||Số test case đã chạy chỉ có khi test được chạy, nên nó được thu thập trong lúc thực thi. Reporting dùng số đo này chứ không tạo ra nó, còn implementation chỉ chuẩn bị test.'),
      qx('Which variances should be explained in the test summary report? (s.73)|||Chênh lệch nào cần giải thích trong test summary report? (s.73)', ['Weekly status reports vs exit criteria|||Báo cáo tuần vs exit criteria', 'Defects found vs defects fixed|||Defect tìm được vs đã sửa', 'What was planned for testing vs what was actually tested|||Kế hoạch test vs thực tế đã test', 'Test cases executed vs total test cases|||Test đã chạy vs tổng số test'], 2,
        'The summary report explains variances between what was planned for testing and what was actually tested, e.g. tests deferred or scope cut, and why. Found vs fixed defects and executed vs total tests are metrics shown in the report, not deviations from the plan.|||Summary report giải thích chênh lệch giữa kế hoạch test và những gì thực tế đã test, vd test bị hoãn hay phạm vi bị cắt, và lý do. Defect tìm được vs đã sửa, test đã chạy vs tổng số là số đo trình bày trong báo cáo, không phải chênh lệch so với kế hoạch.'),
      qx('Accounting tests: 1 Purchase (none, P2), 2 Receive invoice (needs 1, P3), 3 Receive goods (needs 1, P2), 4 Send payment (needs 2, P3), 5 Report payments (needs 4, P1); 3 is the highest priority. Proper order? (SWT5 hidden pptx slide 60)|||Test kế toán: 1 Mua hàng (không, P2), 2 Nhận hoá đơn (cần 1, P3), 3 Nhận hàng (cần 1, P2), 4 Thanh toán (cần 2, P3), 5 Báo cáo thanh toán (cần 4, P1); 3 là ưu tiên cao nhất. Thứ tự đúng? (SWT5 slide ẩn pptx 60)', ['5, 1, 3, 2, 4', '1, 2, 4, 3, 5', '1, 3, 2, 4, 5', '3, 4, 5, 1, 2'], 1,
        'Here 3 is the highest priority, so the P3 tests 2 and 4 go first, but 2 needs 1: run 1, then 2, then 4 (needs 2). Next the P2 test 3, and last 5 (P1, needs 4): 1, 2, 4, 3, 5. Option C runs test 3 (P2) before the higher-priority tests 2 and 4 for no reason.|||Ở đây 3 là ưu tiên cao nhất, nên test P3 là 2 và 4 đi trước, nhưng 2 cần 1: chạy 1, rồi 2, rồi 4 (cần 2). Tiếp theo test P2 là 3, cuối cùng 5 (P1, cần 4): 1, 2, 4, 3, 5. Phương án C chạy test 3 (P2) trước các test ưu tiên cao hơn là 2 và 4 mà không có lý do.'),
      qx('Which is the LOWEST level of test independence?|||Mức độc lập kiểm thử THẤP nhất là…', ['A third-party test organisation|||Một tổ chức test bên thứ ba', 'Tests designed by the author of the code|||Test do chính tác giả code thiết kế', 'A separate test team in the organisation|||Một nhóm test riêng trong tổ chức', 'Internal test consultants|||Tư vấn test nội bộ'], 1,
        'Tests designed by the person who wrote the code have no independence at all. Independence rises from the author, to testers inside the team, a separate test team, internal consultants, up to a third party, which is the highest level (lesson 7.1).|||Test do chính người viết code thiết kế thì hoàn toàn không có tính độc lập. Mức độc lập tăng dần từ tác giả, tới tester trong nhóm, nhóm test riêng, tư vấn nội bộ, lên tới bên thứ ba là mức cao nhất (bài 7.1).'),
      qx('Which is a typical ENTRY criterion?|||Đâu là một ENTRY criterion điển hình?', ['The test environment is available|||Môi trường test đã sẵn sàng', 'All planned tests have been executed|||Đã chạy hết test theo kế hoạch', 'A defined coverage level has been reached|||Đã đạt mức bao phủ định trước', 'Unresolved defects are within an agreed limit|||Số defect chưa giải quyết trong giới hạn thoả thuận'], 0,
        'Entry criteria say when testing can start: an available test environment, testable code, test data and tools (lesson 7.2). The other three options are exit criteria: they say when testing can stop.|||Entry criteria cho biết khi nào được bắt đầu test: môi trường test sẵn sàng, code test được, dữ liệu test và công cụ (bài 7.2). Ba phương án còn lại là exit criteria: cho biết khi nào được dừng test.'),
      qx('A start-up asks an external security expert to tell them what to test. Which strategy is this?|||Một công ty khởi nghiệp nhờ chuyên gia bảo mật bên ngoài chỉ cho họ cần test gì. Đây là chiến lược nào?', ['Regression-averse', 'Directed (consultative)', 'Model-based', 'Methodical'], 1,
        'A directed (consultative) strategy is driven by the advice of stakeholders or experts outside the test team, e.g. a security consultant telling you what to test (lesson 7.2). Methodical would follow a fixed predefined list of conditions, not a person\'s advice.|||Chiến lược directed (consultative) do lời khuyên của các bên liên quan hay chuyên gia ngoài nhóm test dẫn dắt, vd chuyên gia bảo mật chỉ cho bạn cần test gì (bài 7.2). Methodical thì theo một danh sách điều kiện định sẵn, không theo lời khuyên của ai.'),
      qx('"Team cohesion and leadership" is a test-effort factor of which group?|||"Sự gắn kết và lãnh đạo của nhóm" là yếu tố công sức thuộc nhóm nào?', ['Product characteristics|||Đặc điểm sản phẩm', 'Development process characteristics|||Đặc điểm quy trình phát triển', 'People characteristics|||Đặc điểm con người', 'Test results|||Kết quả test'], 2,
        'SWT5 slide 44 (lesson 7.2): people characteristics are the skills and experience of the people involved, and team cohesion and leadership. Development process characteristics cover things like organisational maturity, the development model, tools and time pressure.|||SWT5 slide 44 (bài 7.2): đặc điểm con người gồm kỹ năng, kinh nghiệm của người tham gia, và sự gắn kết, khả năng lãnh đạo của nhóm. Đặc điểm quy trình phát triển là những thứ như độ trưởng thành của tổ chức, mô hình phát triển, công cụ và áp lực thời gian.'),
      qx('Planning poker is…|||Planning poker là…', ['a metrics-based technique for sequential projects|||kỹ thuật dựa số liệu cho dự án tuần tự', 'an expert-based technique typical of Agile|||kỹ thuật dựa chuyên gia, điển hình trong Agile', 'a defect-removal model|||một defect-removal model', 'a test control activity|||một hoạt động kiểm soát test'], 1,
        'In planning poker each team member estimates a story from his own experience and all reveal cards at once, so it is expert-based, typical in Agile (lesson 7.2). Metrics-based techniques use historical data instead, e.g. burndown charts or defect-removal models.|||Trong planning poker, mỗi thành viên ước lượng story theo kinh nghiệm của mình rồi cùng lật bài một lúc, nên đây là kỹ thuật expert-based, điển hình trong Agile (bài 7.2). Kỹ thuật metrics-based thì dùng dữ liệu lịch sử, vd burndown chart hay defect-removal model.'),
      qx('Which of these is a test CONTROL action?|||Đâu là một hành động KIỂM SOÁT test?', ['Re-prioritising tests when an identified risk occurs|||Xếp lại ưu tiên test khi một rủi ro đã nhận diện xảy ra', 'Counting the test cases executed|||Đếm số test case đã chạy', 'Writing the test summary report|||Viết báo cáo tổng kết', 'Designing test cases from the test basis|||Thiết kế test case từ test basis'], 0,
        'Test control acts on what monitoring reveals; re-prioritising tests when an identified risk occurs is one of the syllabus\'s typical control actions (lesson 7.3). Counting executed tests is monitoring, the summary report is reporting, and designing tests is test design.|||Kiểm soát test là hành động dựa trên điều giám sát cho thấy; xếp lại ưu tiên test khi một rủi ro đã nhận diện xảy ra là một hành động kiểm soát điển hình trong syllabus (bài 7.3). Đếm test đã chạy là giám sát, viết summary report là báo cáo, còn thiết kế test là test design.'),
      qx('The purpose of configuration management is to…|||Mục đích của quản lý cấu hình là…', ['store defect reports|||lưu defect report', 'establish and maintain the integrity of the system, the testware and their relationships|||thiết lập và duy trì tính toàn vẹn của hệ thống, testware và quan hệ giữa chúng', 'estimate the test effort|||ước lượng công sức test', 'decide the release date|||quyết định ngày phát hành'], 1,
        'Configuration management establishes and maintains the integrity of the component or system, the testware and their relationships throughout the life cycle (lesson 7.4). Storing defect reports is defect management; CM is about versions and traceability.|||Quản lý cấu hình thiết lập và duy trì tính toàn vẹn của thành phần hay hệ thống, của testware và quan hệ giữa chúng suốt vòng đời (bài 7.4). Lưu defect report là quản lý defect; CM là chuyện phiên bản và truy vết.'),
      qx('"Response times may be inadequate for a high-performance transaction system" is a…|||"Thời gian phản hồi có thể không đủ cho hệ thống giao dịch hiệu năng cao" là…', ['project risk|||rủi ro dự án', 'product risk|||rủi ro sản phẩm', 'supplier issue|||vấn đề nhà cung cấp', 'political issue|||vấn đề "chính trị"'], 1,
        'Inadequate response times are a possible quality problem in the software itself (performance), so it is a product risk (lesson 7.5). Project risks threaten the project\'s ability to reach its goals: late delivery, staffing, suppliers, politics.|||Thời gian phản hồi không đủ là vấn đề chất lượng có thể có trong chính phần mềm (hiệu năng), nên là rủi ro sản phẩm (bài 7.5). Rủi ro dự án đe doạ khả năng đạt mục tiêu của dự án: giao trễ, nhân sự, nhà cung cấp, "chính trị".'),
      qx('"The supplier may deliver the test environment late" is a…|||"Nhà cung cấp có thể giao môi trường test trễ" là…', ['product risk|||rủi ro sản phẩm', 'quality risk|||rủi ro chất lượng', 'project risk|||rủi ro dự án', 'defect|||defect'], 2,
        'A late test environment from a supplier threatens the schedule and management of the project, not the quality of the software, so it is a project risk (a supplier issue, lesson 7.5). Product and quality risk mean the same thing: the software may fail to meet needs.|||Nhà cung cấp giao môi trường test trễ đe doạ lịch và việc quản lý dự án, không phải chất lượng phần mềm, nên là rủi ro dự án (vấn đề nhà cung cấp, bài 7.5). Rủi ro sản phẩm và rủi ro chất lượng là một: phần mềm có thể không đáp ứng nhu cầu.'),
      qx('A contingency plan for a risk aims to…|||Kế hoạch dự phòng (contingency) cho một rủi ro nhằm…', ['reduce its likelihood in advance|||giảm khả năng xảy ra từ trước', 'reduce its impact if it occurs|||giảm tác động nếu nó xảy ra', 'move it to another stakeholder|||chuyển nó cho bên khác', 'ignore it|||bỏ qua nó'], 1,
        'A contingency plan reduces the impact if the risk becomes an outcome, e.g. a feature flag to switch a new payment method off (lesson 7.5). Reducing the likelihood in advance is mitigation; moving the risk to another party is transfer.|||Kế hoạch dự phòng giảm tác động nếu rủi ro thành sự thật, vd feature flag để tắt phương thức thanh toán mới (bài 7.5). Giảm khả năng xảy ra từ trước là mitigation; chuyển rủi ro cho bên khác là transfer.'),
      qx('A typo in the company name on the home page is typically…|||Gõ sai tên công ty trên trang chủ thường là…', ['high severity, low priority|||severity cao, priority thấp', 'low severity, high priority|||severity thấp, priority cao', 'high severity, high priority|||severity cao, priority cao', 'not a defect|||không phải defect'], 1,
        'A typo in the company name breaks no function (low severity) but embarrasses the business, so it must be fixed fast (high priority) (lesson 7.6). High severity, low priority is the opposite case, e.g. a crash in an experimental feature nobody uses yet.|||Gõ sai tên công ty không làm hỏng chức năng nào (severity thấp) nhưng làm doanh nghiệp mất mặt, nên phải sửa ngay (priority cao) (bài 7.6). Severity cao, priority thấp là trường hợp ngược lại, vd crash ở tính năng thử nghiệm chưa ai dùng.'),
      qx('In Figure 5.3, a fixed defect fails its confirmation test. The report moves to…|||Trong Figure 5.3, một defect đã sửa bị fail confirmation test. Báo cáo chuyển sang…', ['Closed', 'Rejected', 'Reopened', 'Deferred'], 2,
        'In the incident lifecycle (Figure 5.3, lesson 7.6) a fix that passes its confirmation test goes to Closed; one that fails, or a defect that comes back, goes to Reopened. Rejected is for reports that turn out not to be defects, and Deferred is for fixes postponed.|||Trong vòng đời incident (Figure 5.3, bài 7.6), bản sửa pass confirmation test thì sang Closed; fail hoặc lỗi quay lại thì sang Reopened. Rejected dành cho báo cáo hoá ra không phải defect, còn Deferred là bản sửa bị hoãn.'),
      { question: 'In the 2023 deck, which organisational structure gives advice, reviews and support but does NOT perform the testing itself? (SWT5 2023 p.4)|||Trong bộ slide 2023, cơ cấu tổ chức nào tư vấn, review và hỗ trợ nhưng KHÔNG tự thực hiện việc test? (SWT5 2023 tr.4)', options: ['Development team (buddy system)|||Nhóm phát triển (hệ buddy)', 'Independent test team|||Nhóm test độc lập', 'Internal test consultants|||Tư vấn test nội bộ', 'Outside organisation (3rd party)|||Tổ chức bên ngoài (bên thứ ba)'], correctIndex: 2, points: 1, explanation: 'Page 4 lists internal test consultants as giving advice, review and support, not performing the testing; someone else still has to do the testing.|||Trang 4 ghi tư vấn test nội bộ chỉ tư vấn, review và hỗ trợ, không tự test; việc test vẫn phải do người khác làm.' },
      { question: 'Which of these should NOT be placed under configuration management in testing? (SWT5 2023 p.23)|||Thứ nào KHÔNG nên đặt dưới quản lý cấu hình trong kiểm thử? (SWT5 2023 tr.23)', options: ['Live production data|||Dữ liệu thật trên production (live data)', 'Test scripts|||Test script', 'Expected results|||Kết quả mong đợi', 'Test tools|||Công cụ test'], correctIndex: 0, points: 1, explanation: 'Page 23 answers its own question: live data. It changes constantly and belongs to the business; a masked, versioned snapshot used as test data is what goes under CM.|||Trang 23 tự trả lời: live data. Nó thay đổi liên tục và thuộc về doanh nghiệp; thứ đặt dưới CM là bản chụp đã che dữ liệu, có phiên bản, dùng làm dữ liệu test.' },
      { question: 'Recording and reporting the current state and history of every configuration item and change request is called… (SWT5 2023 p.17, 22)|||Ghi nhận và báo cáo trạng thái hiện tại và lịch sử của mọi configuration item và change request được gọi là… (SWT5 2023 tr.17, 22)', options: ['Configuration identification', 'Configuration status accounting', 'Configuration change control', 'Configuration audit'], correctIndex: 1, points: 1, explanation: 'The four CM activities: identification names the items, change control guards changes, status accounting records and reports status, audit checks that the record and the product agree.|||Bốn hoạt động CM: identification đặt tên hạng mục, change control canh giữ thay đổi, status accounting ghi và báo cáo trạng thái, audit kiểm tra sổ sách khớp với sản phẩm.' },
      { question: 'A fault report takes 10 minutes. With the suspension criterion "testers spend more than 25% of their time on faults", how many reports per 8-hour day can a tester write before testing should be suspended? (SWT5 2023 p.29)|||Viết một báo cáo lỗi mất 10 phút. Với tiêu chí tạm dừng "tester dành hơn 25% thời gian cho lỗi", một tester viết được bao nhiêu báo cáo mỗi ngày 8 giờ trước khi phải tạm dừng test? (SWT5 2023 tr.29)', options: ['12', '25', '36', '48'], correctIndex: 0, points: 1, explanation: '8 h = 480 min; 25% of 480 = 120 min; 120 / 10 = 12 reports. 48 would be the whole day with no testing at all.|||8 giờ = 480 phút; 25% của 480 = 120 phút; 120 / 10 = 12 báo cáo. 48 là cả ngày chỉ viết báo cáo, không test gì.' },
      { question: 'Tests run rises steeply but tests passed stays almost flat (a diverging S-curve). Which option is a CONTROL ACTION rather than a possible cause? (SWT5 2023 p.31)|||Số test đã chạy tăng dốc nhưng số test đạt gần như đứng yên (S-curve phân kỳ). Lựa chọn nào là HÀNH ĐỘNG KIỂM SOÁT chứ không phải nguyên nhân? (SWT5 2023 tr.31)', options: ['Poor test entry criteria|||Entry criteria quá lỏng', 'Ran easy tests first|||Chạy test dễ trước', 'Common faults affect all tests|||Lỗi chung ảnh hưởng mọi test', 'Stop testing until faults are fixed|||Dừng test tới khi lỗi được sửa'], correctIndex: 3, points: 1, explanation: 'Page 31 has two columns: causes (poor entry criteria, easy tests first, insufficient debug effort, common faults, very poor quality) and control actions (tighten entry criteria, cancel project, more debugging, stop testing until fixed, continue testing to scope quality).|||Trang 31 có hai cột: nguyên nhân (entry criteria lỏng, chạy test dễ trước, thiếu công debug, lỗi chung, chất lượng rất kém) và hành động kiểm soát (siết entry criteria, huỷ dự án, tăng debug, dừng test tới khi sửa, tiếp tục test để đo chất lượng).' },
      { question: 'The 2023 deck pairs exit criteria with "completion criteria" and entry criteria with "acceptance criteria". In current ISTQB terminology, which is a synonym of EXIT criteria? (SWT5 2023 p.36)|||Bộ slide 2023 ghép exit criteria với "completion criteria" và entry criteria với "acceptance criteria". Theo thuật ngữ ISTQB hiện nay, từ nào đồng nghĩa với EXIT criteria? (SWT5 2023 tr.36)', options: ['Acceptance criteria', 'Definition of ready', 'Completion criteria', 'Suspension criteria'], correctIndex: 2, points: 1, explanation: 'Completion criteria (and, in Agile, definition of done) = exit criteria. Definition of ready = entry criteria. Acceptance criteria today are what a system or user story must satisfy to be accepted by a user or customer.|||Completion criteria (và trong Agile là definition of done) = exit criteria. Definition of ready = entry criteria. Acceptance criteria ngày nay là điều hệ thống hay user story phải thoả để người dùng/khách hàng chấp nhận.' },
    ],
  },
};

export default {
  title: 'Chapter 7 — Test management|||Chương 7 — Quản lý test',
  description: 'SWT5 (101 slide) học từng slide: tổ chức & tính độc lập, test plan, 7 chiến lược, entry/exit, lịch thực thi theo ưu tiên & phụ thuộc, ước lượng, giám sát & báo cáo, quản lý cấu hình, rủi ro, quản lý defect — kèm đáp án mọi câu hỏi trên slide, 2 slide ẩn và trang sách tương ứng; bài 7.7 bổ sung 25 trang của bộ slide SWT5 cũ (2023).',
  lessons: [L71, L72, L73, L74, L75, L76, L77, QUIZ7],
};
