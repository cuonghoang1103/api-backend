/**
 * SWT301 · Section 0 — Introduction & study guide.
 * Sources: SWT0_tim.pptx (21 slides — all used: 1–4 in 0.1, 8–18 in 0.3,
 * 5–7 & 19–21 in 0.5), Additional Content.pdf slides 1, 2, 5 (0.5; slides
 * 18–26 are in lesson 1.4; slides 3–4 are memes and 6–17 an Egyptian exam-
 * registration FAQ plus a trainer's personal contact list — not uploaded),
 * the official FPTU syllabus facts of the previous version of this section,
 * and a map of every file in the course folder.
 * First lesson slug 'swt301-gioi-thieu' is kept so the section is updated in place.
 */
import { walk, walkHead, bi, BOOKS } from './_slides.mjs';

const EXP = '/exp-hub/swt301-cai-dat-testing?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301';
const EXPHUB = '/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301';
const CODELAB = '/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301';

/* ───────────────────────────── 0.1 About ───────────────────────────── */
const L01 = {
  title: '0.1 — About SWT301, ISTQB & how this course is built|||0.1 — Giới thiệu SWT301, ISTQB & cách khoá học được xây',
  slug: 'swt301-gioi-thieu',
  type: 'VIDEO',
  description: 'SWT301 là gì, vì sao theo chuẩn ISTQB CTFL, bản đồ các chương/Lab/PE của khoá học, và SWT0 slide 1–4 (ISTQB, lộ trình chứng chỉ, nội dung môn).',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.1 · SWT0 slides 1–4</span>
<h2>About SWT301 — Software Testing</h2>
<p class="lead">In SWE201c you learned how software is built as a team. SWT301 teaches how to <strong>prove it works</strong> — and, just as important, how to find where it does not before your users do. The course follows the <strong>ISTQB Certified Tester Foundation Level (CTFL)</strong> syllabus, the international vocabulary of every QA team, plus the ISTQB Agile Tester extension.</p>
<h3>How this course is built</h3>
<p>Everything in the teacher's course folder is here. <strong>Every slide of every deck</strong> (SWT0–SWT6, Topic 8, the Lab decks) is shown as an image, followed by:</p>
<ul>
<li>an explanation in English and Vietnamese;</li>
<li>the answer to every in-class question;</li>
<li>a worked example and the exam traps;</li>
<li>a "★ beyond the syllabus" note;</li>
<li>the exact pages to read in the six textbooks.</li>
</ul>
<p>Excel templates, checklists and past PE papers are explained cell by cell and solved.</p>
<table>
<thead><tr><th>Part</th><th>What you get</th><th>Teacher's source</th></tr></thead>
<tbody>
<tr><td>Section 0</td><td>exam rules, CLOs, ISTQB exam strategy, books, study plan, map of every file</td><td>SWT0, Additional Content, syllabus</td></tr>
<tr><td>Chapters 1–2 + Progress Test 1</td><td>fundamentals; testing in the lifecycle; Overview matrix</td><td>SWT1, SWT2, Overview.xlsx</td></tr>
<tr><td>Chapter 3 + Lab 1</td><td>static testing; code review &amp; static analysis lab</td><td>SWT3, 02.Lab/01.Lab01</td></tr>
<tr><td>Chapters 4–6 + Lab 2 + Progress Test 2</td><td>black-box, white-box, experience-based design; unit-testing lab</td><td>SWT4, 02.Lab/02.LAB02</td></tr>
<tr><td>Chapters 7–8 + Lab 3</td><td>test management; tools &amp; JUnit; integration/system test reports</td><td>SWT5, SWT6, 04.Samples, 05.Templates, 02.Lab/03.LAB03</td></tr>
<tr><td>Chapter 9 + Progress Test 3</td><td>Agile testing</td><td>Topic 8, ISTQB Agile Tester in a Nutshell</td></tr>
<tr><td>Practice project</td><td>test a real web app end to end</td><td>03.Temp/MystBloom</td></tr>
<tr><td>PE section + Final Exam</td><td>past practical papers with model answers; FE strategy; links to 22 PE and 22 FE papers in the Exam room</td><td>03.PE, the site's Exam room</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · Bài 0.1 · SWT0 slide 1–4</span>
<h2>Giới thiệu SWT301 — Kiểm thử phần mềm</h2>
<p class="lead">Ở SWE201c bạn đã học cách làm phần mềm theo nhóm. SWT301 dạy cách <strong>chứng minh nó chạy đúng</strong> — và quan trọng không kém, tìm ra chỗ nó sai trước khi người dùng gặp. Môn học bám syllabus <strong>ISTQB Certified Tester Foundation Level (CTFL)</strong> — bộ từ vựng quốc tế của mọi nhóm QA — cộng phần mở rộng ISTQB Agile Tester.</p>
<h3>Khoá học này được xây như thế nào</h3>
<p>Mọi thứ trong thư mục môn học của thầy/cô đều có ở đây. <strong>Mọi slide của mọi bộ</strong> (SWT0–SWT6, Topic 8, các bộ slide Lab) được giữ nguyên dạng ảnh, ngay dưới là:</p>
<ul>
<li>giải thích song ngữ Anh–Việt;</li>
<li>đáp án cho mọi câu hỏi trên lớp;</li>
<li>ví dụ có lời giải và các bẫy thi;</li>
<li>mục "★ ngoài giáo trình";</li>
<li>đúng trang cần đọc trong sáu cuốn sách.</li>
</ul>
<p>Các template Excel, checklist và đề PE cũ được giải thích từng ô và giải trọn.</p>
<table>
<thead><tr><th>Phần</th><th>Bạn có gì</th><th>Nguồn của thầy/cô</th></tr></thead>
<tbody>
<tr><td>Mục 0</td><td>luật thi, CLO, chiến lược thi ISTQB, sách, kế hoạch học, bản đồ mọi file</td><td>SWT0, Additional Content, syllabus</td></tr>
<tr><td>Chương 1–2 + Progress Test 1</td><td>nền tảng; kiểm thử trong vòng đời; bảng Overview</td><td>SWT1, SWT2, Overview.xlsx</td></tr>
<tr><td>Chương 3 + Lab 1</td><td>kiểm thử tĩnh; lab review code &amp; phân tích tĩnh</td><td>SWT3, 02.Lab/01.Lab01</td></tr>
<tr><td>Chương 4–6 + Lab 2 + Progress Test 2</td><td>thiết kế black-box, white-box, dựa kinh nghiệm; lab unit test</td><td>SWT4, 02.Lab/02.LAB02</td></tr>
<tr><td>Chương 7–8 + Lab 3</td><td>quản lý test; công cụ &amp; JUnit; báo cáo integration/system test</td><td>SWT5, SWT6, 04.Samples, 05.Templates, 02.Lab/03.LAB03</td></tr>
<tr><td>Chương 9 + Progress Test 3</td><td>kiểm thử Agile</td><td>Topic 8, ISTQB Agile Tester in a Nutshell</td></tr>
<tr><td>Dự án luyện tập</td><td>kiểm thử trọn một web app thật</td><td>03.Temp/MystBloom</td></tr>
<tr><td>Phần PE + Thi cuối kỳ</td><td>đề thực hành cũ có lời giải mẫu; chiến lược FE; liên kết 22 đề PE và 22 đề FE trong Phòng thi</td><td>03.PE, Phòng thi của web</td></tr>
</tbody>
</table>`),
    walkHead('swt0', 1, 4),
    walk('swt0', [
      [1, 'Introduction to the course',
        `<p class="y-chinh">🎯 The cover of the introductory deck the teacher shows on day one.</p>
<ul>
<li>This deck (SWT0) sets the rules of the game: what ISTQB is, the certificate road map, the course content, the exam structure and exam tips.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bìa bộ slide giới thiệu thầy/cô chiếu buổi học đầu tiên.</p>
<ul>
<li>Bộ slide này (SWT0) đặt luật chơi: ISTQB là gì, lộ trình chứng chỉ, nội dung môn, cấu trúc đề và mẹo làm bài.</li>
</ul>`],
      [2, 'ISTQB',
        `<p class="y-chinh">🎯 ISTQB writes the syllabus that SWT301 <em>is</em> — study SWT301 well and you have studied the whole CTFL exam.</p>
<p class="nhan">What ISTQB is</p>
<ul>
<li><strong>Full name</strong> — International Software Testing Qualifications Board.</li>
<li><strong>Type</strong> — a not-for-profit body that writes the syllabi and issues the certificates for software testers.</li>
<li><strong>Website</strong> — the slide's "ISTQB website" link goes to istqb.org.</li>
</ul>
<p class="nhan">What it means for you</p>
<ul>
<li><strong>Same content</strong> — SWT301's content <em>is</em> the Foundation Level syllabus, so passing SWT301 well means you have studied everything the international CTFL exam asks.</li>
<li><strong>Optional certificate</strong> — taking the real certificate is optional. It is offered through ISTQB member boards and exam providers (look up "find an exam provider" on istqb.org).</li>
</ul>`,
        `<p class="y-chinh">🎯 ISTQB soạn ra syllabus mà SWT301 <em>chính là</em> — học tốt SWT301 là đã học trọn đề CTFL.</p>
<p class="nhan">ISTQB là gì</p>
<ul>
<li><strong>Tên đầy đủ</strong> — International Software Testing Qualifications Board.</li>
<li><strong>Loại tổ chức</strong> — phi lợi nhuận, soạn syllabus và cấp chứng chỉ cho tester.</li>
<li><strong>Website</strong> — link "ISTQB website" trên slide dẫn tới istqb.org.</li>
</ul>
<p class="nhan">Điều đó có nghĩa gì với bạn</p>
<ul>
<li><strong>Cùng một nội dung</strong> — nội dung SWT301 <em>chính là</em> syllabus Foundation Level, nên học tốt SWT301 là bạn đã học đủ những gì đề CTFL quốc tế hỏi.</li>
<li><strong>Chứng chỉ là tuỳ chọn</strong> — thi lấy chứng chỉ thật là tuỳ bạn. Kỳ thi được tổ chức qua các board thành viên và đơn vị khảo thí của ISTQB (tra "find an exam provider" trên istqb.org).</li>
</ul>`],
      [3, 'Road map in the software testing domain',
        `<p class="y-chinh">🎯 The ISTQB certificate map: everything starts from Foundation (this course), then splits into three streams.</p>
<p class="nhan">The base — read from "START HERE"</p>
<ul>
<li><strong>Foundation – Certified Tester</strong> — this course.</li>
</ul>
<p class="nhan">Three streams above it</p>
<ul>
<li><strong>Agile</strong> — Foundation Agile Tester → Advanced: Agile Technical Tester, Agile Test Leadership at Scale.</li>
<li><strong>Core</strong> — Advanced: Test Manager, Test Analyst, Technical Test Analyst → Expert: managing the test team, operational and strategic test management, assessing and implementing test process improvement.</li>
<li><strong>Specialist</strong> — 11 certificates, listed below.</li>
</ul>
<p class="nhan">The 11 specialist certificates</p>
<ol class="hai-cot"><li>Acceptance testing</li><li>AI testing</li><li>Automotive</li><li>Gambling industry</li><li>Game testing</li><li>Mobile application testing</li><li>Model-based testing</li><li>Performance testing</li><li>Security tester</li><li>Test automation engineer</li><li>Usability testing</li></ol>
<p class="meo">🧠 <strong>Remember:</strong> for a fresh graduate the usual path is CTFL → Agile Tester → one specialist (automation or performance) → Advanced.</p>`,
        `<p class="y-chinh">🎯 Bản đồ chứng chỉ ISTQB: mọi thứ bắt đầu từ Foundation (môn này), rồi tách thành ba nhánh.</p>
<p class="nhan">Nền móng — đọc từ "START HERE"</p>
<ul>
<li><strong>Foundation – Certified Tester</strong> — chính là môn này.</li>
</ul>
<p class="nhan">Ba nhánh phía trên</p>
<ul>
<li><strong>Agile</strong> — Foundation Agile Tester → Advanced: Agile Technical Tester, Agile Test Leadership at Scale.</li>
<li><strong>Core</strong> — Advanced: Test Manager, Test Analyst, Technical Test Analyst → Expert: quản lý nhóm test, quản lý test vận hành và chiến lược, đánh giá và cải tiến quy trình test.</li>
<li><strong>Specialist</strong> — 11 chứng chỉ chuyên sâu, liệt kê bên dưới.</li>
</ul>
<p class="nhan">11 chứng chỉ chuyên sâu</p>
<ol class="hai-cot"><li>Acceptance testing</li><li>AI testing</li><li>Ô tô (automotive)</li><li>Ngành cá cược (gambling)</li><li>Game</li><li>Ứng dụng di động</li><li>Model-based testing</li><li>Performance testing</li><li>Security tester</li><li>Test automation engineer</li><li>Usability testing</li></ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> với sinh viên mới ra trường, lộ trình thường gặp là CTFL → Agile Tester → một chứng chỉ chuyên sâu (automation hoặc performance) → Advanced.</p>`],
      [4, 'Course content (CTFL tree)',
        `<p class="y-chinh">🎯 The six CTFL chapters and their sections — the skeleton of the whole course.</p>
<p class="nhan">The six chapters</p>
<ol>
<li><strong>Fundamentals</strong> — what is testing, why necessary, seven principles, test process, psychology.</li>
<li><strong>Testing throughout the SDLC</strong> — models, levels, types, maintenance.</li>
<li><strong>Static testing</strong> — basics, review process.</li>
<li><strong>Test techniques</strong> — categories, black-box, white-box, experience-based.</li>
<li><strong>Test management</strong> — organisation, planning &amp; estimation, monitoring &amp; control, configuration management, risks, defect management.</li>
<li><strong>Tool support</strong> — considerations, effective use.</li>
</ol>
<p class="nhan">Where each one is on this site</p>
<ul>
<li><strong>CTFL 1, 2, 3</strong> → Chapters 1, 2, 3</li>
<li><strong>CTFL 4</strong> → Chapters 4–6</li>
<li><strong>CTFL 5</strong> → Chapter 7</li>
<li><strong>CTFL 6</strong> → Chapter 8</li>
<li><strong>Chapter 9</strong> → adds the Agile Tester syllabus (Topic 8)</li>
</ul>`,
        `<p class="y-chinh">🎯 Sáu chương CTFL và các mục con — bộ khung của cả môn học.</p>
<p class="nhan">Sáu chương</p>
<ol>
<li><strong>Fundamentals</strong> — kiểm thử là gì, vì sao cần, bảy nguyên tắc, quy trình test, tâm lý.</li>
<li><strong>Testing throughout the SDLC</strong> — mô hình, cấp test, loại test, bảo trì.</li>
<li><strong>Static testing</strong> — cơ bản, quy trình review.</li>
<li><strong>Test techniques</strong> — phân loại, black-box, white-box, dựa kinh nghiệm.</li>
<li><strong>Test management</strong> — tổ chức, lập kế hoạch &amp; ước lượng, giám sát &amp; kiểm soát, quản lý cấu hình, rủi ro, quản lý defect.</li>
<li><strong>Tool support</strong> — lưu ý khi dùng công cụ, dùng hiệu quả.</li>
</ol>
<p class="nhan">Học ở đâu trên trang này</p>
<ul>
<li><strong>CTFL 1, 2, 3</strong> → Chương 1, 2, 3</li>
<li><strong>CTFL 4</strong> → Chương 4–6</li>
<li><strong>CTFL 5</strong> → Chương 7</li>
<li><strong>CTFL 6</strong> → Chương 8</li>
<li><strong>Chương 9</strong> → bổ sung syllabus Agile Tester (Topic 8)</li>
</ul>`],
    ]),
  ].join('\n'),
};

/* ───────────────────────────── 0.2 Grading ───────────────────────────── */
const L02 = {
  title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
  slug: 'swt301-dieu-kien-qua-mon',
  type: 'VIDEO',
  description: 'Tín chỉ, giờ học, điều kiện dự thi, trọng số Lab/Presentation/Progress Test/PE/TE, điểm sàn, và cấu trúc thật của đề PE và FE.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">Know the rules before the match. The facts below come from the university's official SWT301 syllabus.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <span class="ghi-chu">45h class (60 sessions of 45 min) + exams + ~103h self-study</span></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">SWE102 / SWE201c / SWE202c</span></div>
  <div class="kv"><span class="k">Scale</span><span class="v">10 <span class="ghi-chu">pass when the average ≥ 5.0</span></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">attend ≥ 80% of sessions</span></div>
</div>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>What it is</th><th>Prepare with</th></tr></thead>
<tbody>
<tr><td>Lab (×4)</td><td>25%</td><td>unit-test framework, static analysis, test design, test plan (CLO2–9)</td><td>Lab 1, Lab 2, Lab 3 sections</td></tr>
<tr><td>Presentation</td><td>10%</td><td>individual/team presentation (CLO10), ~10 min each</td><td>any chapter topic + a demo</td></tr>
<tr><td>Progress Test (×3)</td><td>15%</td><td>three mid-course MCQ tests, ~30 min (CLO1–7)</td><td>Progress Test 1–3 + chapter quizzes</td></tr>
<tr><td>Final — Practical Exam (PE)</td><td>25%</td><td>90 min, <strong>no IDE</strong>, three questions in Excel templates: Q1 code review (3 pts), Q2 unit test design for 100% statement &amp; decision coverage (3 pts), Q3 black-box EP/BVA analysis + 10 test cases + procedures (4 pts); must be ≥ 4.0</td><td>PE section (past papers solved), Ch.3–5, Labs</td></tr>
<tr><td>Final — Theory Exam (TE/FE)</td><td>25%</td><td>multiple choice, ~60 questions in 60 min (CLO1–9); must be ≥ 4.0</td><td>chapter quizzes + 22 FE papers in the Exam room</td></tr>
</tbody>
</table>
<div class="callout warn"><strong>Three hard blockers — even with high coursework:</strong>
<ol>
<li><strong>Attendance</strong> — missing more than 20% of sessions = barred from the exam.</li>
<li><strong>PE ≥ 4.0</strong> — the practical exam has its own floor.</li>
<li><strong>TE ≥ 4.0</strong> — the theory exam has its own floor.</li>
</ol>
<p>Special rule: if 4 ≤ TE &lt; 5 and 4 ≤ PE &lt; 5 and the final result &lt; 5, the student may take the re-take path set by the lecturer.</p></div>
<div class="callout ok"><strong>Time budget that works.</strong>
<ul>
<li><strong>PE (90 min)</strong> — 5 min reading, 25 min Q1, 25 min Q2, 30 min Q3, 5 min checking.</li>
<li><strong>FE, pass 1</strong> — answer everything you know (~35 min).</li>
<li><strong>FE, pass 2</strong> — return to the flagged ones.</li>
<li><strong>FE, always</strong> — never leave a blank (no negative marking).</li>
</ul></div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Nắm luật chơi trước khi vào trận. Thông tin dưới đây lấy từ syllabus chính thức của môn SWT301.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <span class="ghi-chu">45h trên lớp (60 buổi × 45 phút) + thi + ~103h tự học</span></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">SWE102 / SWE201c / SWE202c</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <span class="ghi-chu">qua môn khi điểm trung bình ≥ 5.0</span></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">đi học ≥ 80% số buổi</span></div>
</div>
<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Nội dung</th><th>Chuẩn bị bằng</th></tr></thead>
<tbody>
<tr><td>Lab (×4)</td><td>25%</td><td>unit test framework, phân tích tĩnh, thiết kế test, test plan (CLO2–9)</td><td>các phần Lab 1, Lab 2, Lab 3</td></tr>
<tr><td>Presentation</td><td>10%</td><td>thuyết trình cá nhân/nhóm (CLO10), ~10 phút mỗi người</td><td>một chủ đề trong các chương + demo</td></tr>
<tr><td>Progress Test (×3)</td><td>15%</td><td>ba bài trắc nghiệm giữa kỳ, ~30 phút (CLO1–7)</td><td>Progress Test 1–3 + quiz từng chương</td></tr>
<tr><td>Final — Practical Exam (PE)</td><td>25%</td><td>90 phút, <strong>không dùng IDE</strong>, ba câu làm trên template Excel: Q1 review code (3 điểm), Q2 thiết kế unit test đạt 100% statement &amp; decision coverage (3 điểm), Q3 phân tích EP/BVA + 10 test case + các bước (4 điểm); phải ≥ 4.0</td><td>phần PE (đề cũ có lời giải), Ch.3–5, các Lab</td></tr>
<tr><td>Final — Theory Exam (TE/FE)</td><td>25%</td><td>trắc nghiệm, khoảng 60 câu trong 60 phút (CLO1–9); phải ≥ 4.0</td><td>quiz các chương + 22 đề FE trong Phòng thi</td></tr>
</tbody>
</table>
<div class="callout warn">Ba điều kiện <strong>chặn cứng</strong> — dù điểm quá trình cao:
<ol>
<li><strong>Chuyên cần</strong> — vắng quá 20% số buổi = cấm thi.</li>
<li><strong>PE ≥ 4.0</strong> — bài thi thực hành có điểm sàn riêng.</li>
<li><strong>TE ≥ 4.0</strong> — bài thi lý thuyết có điểm sàn riêng.</li>
</ol>
<p>Luật đặc biệt: nếu 4 ≤ TE &lt; 5 và 4 ≤ PE &lt; 5 và điểm tổng &lt; 5, sinh viên có thể đi theo hướng thi lại do giảng viên quy định.</p></div>
<div class="callout ok"><strong>Phân bổ thời gian hiệu quả.</strong>
<ul>
<li><strong>PE (90 phút)</strong> — 5 phút đọc đề, 25 phút Q1, 25 phút Q2, 30 phút Q3, 5 phút soát.</li>
<li><strong>FE, lượt một</strong> — làm hết các câu chắc chắn (~35 phút).</li>
<li><strong>FE, lượt hai</strong> — quay lại các câu đã đánh dấu.</li>
<li><strong>FE, luôn luôn</strong> — không bỏ trống câu nào (không trừ điểm câu sai).</li>
</ul></div>`),
  ].join('\n'),
};

/* ───────────────────────────── 0.3 CLOs & LOs ───────────────────────────── */
const L03 = {
  title: '0.3 — Learning outcomes (CLOs), business outcomes & K-levels|||0.3 — Chuẩn đầu ra (CLO), business outcomes & các mức K',
  slug: 'swt301-chuan-dau-ra',
  type: 'VIDEO',
  description: '10 CLO của môn, SWT0 slide 8–18: đối tượng, business outcomes, mức K1–K4, và toàn bộ learning objective của 6 chương CTFL 2018 — biết mức K là biết đề hỏi kiểu gì.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.3 · SWT0 slides 8–18</span>
<h2>What you must be able to do</h2>
<p class="lead">A <strong>CLO</strong> (course learning outcome) is what the university will test. The ISTQB <strong>learning objectives</strong> (LO-x.y.z) go one level finer and carry a <strong>K-level</strong> that tells you the <em>type</em> of question: K1 recall a term, K2 explain/compare, K3 apply a technique to a new case.</p>
<table>
<thead><tr><th>CLO</th><th>You will be able to…</th><th>Where</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>define concepts and terminology of testing</td><td>Ch.1</td></tr>
<tr><td>CLO2</td><td>explain the test process and the test levels</td><td>Ch.1–2</td></tr>
<tr><td>CLO3</td><td>use static techniques (reviews) to detect defects</td><td>Ch.3, Lab 1</td></tr>
<tr><td>CLO4</td><td>design test cases with black-box, white-box and experience-based techniques</td><td>Ch.4–6, Lab 2, PE</td></tr>
<tr><td>CLO5</td><td>develop a test plan (scope, goals, resources)</td><td>Ch.7, Lab 3</td></tr>
<tr><td>CLO6</td><td>analyse and prioritise risks; log and track defects</td><td>Ch.7</td></tr>
<tr><td>CLO7</td><td>classify and select testing tools; benefits and risks of automation</td><td>Ch.8</td></tr>
<tr><td>CLO8</td><td>apply Agile testing methods</td><td>Ch.9</td></tr>
<tr><td>CLO9</td><td>use AI tools to support learning and exercises</td><td>all</td></tr>
<tr><td>CLO10</td><td>present and work in a team</td><td>Presentation</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · Bài 0.3 · SWT0 slide 8–18</span>
<h2>Bạn phải làm được gì</h2>
<p class="lead"><strong>CLO</strong> (chuẩn đầu ra môn học) là thứ nhà trường sẽ kiểm tra. Các <strong>learning objective</strong> của ISTQB (LO-x.y.z) chi tiết hơn một bậc và mang <strong>mức K</strong> cho biết <em>kiểu</em> câu hỏi: K1 nhớ thuật ngữ, K2 giải thích/so sánh, K3 áp dụng kỹ thuật vào một tình huống mới.</p>
<table>
<thead><tr><th>CLO</th><th>Bạn sẽ làm được…</th><th>Học ở đâu</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>định nghĩa khái niệm và thuật ngữ kiểm thử</td><td>Ch.1</td></tr>
<tr><td>CLO2</td><td>giải thích quy trình test và các cấp test</td><td>Ch.1–2</td></tr>
<tr><td>CLO3</td><td>dùng kỹ thuật tĩnh (review) để phát hiện lỗi</td><td>Ch.3, Lab 1</td></tr>
<tr><td>CLO4</td><td>thiết kế test case bằng kỹ thuật black-box, white-box, dựa kinh nghiệm</td><td>Ch.4–6, Lab 2, PE</td></tr>
<tr><td>CLO5</td><td>lập test plan (phạm vi, mục tiêu, nguồn lực)</td><td>Ch.7, Lab 3</td></tr>
<tr><td>CLO6</td><td>phân tích, ưu tiên rủi ro; ghi nhận và theo dõi defect</td><td>Ch.7</td></tr>
<tr><td>CLO7</td><td>phân loại, chọn công cụ test; lợi ích và rủi ro của tự động hoá</td><td>Ch.8</td></tr>
<tr><td>CLO8</td><td>áp dụng phương pháp kiểm thử Agile</td><td>Ch.9</td></tr>
<tr><td>CLO9</td><td>dùng công cụ AI hỗ trợ học và làm bài</td><td>mọi chương</td></tr>
<tr><td>CLO10</td><td>thuyết trình và làm việc nhóm</td><td>Presentation</td></tr>
</tbody>
</table>`),
    walkHead('swt0', 8, 18),
    walk('swt0', [
      [8, 'Audience',
        `<p class="y-chinh">🎯 Foundation is for <em>everyone</em> who touches software — not only for people who want to be testers.</p>
<p class="nhan">Where it applies</p>
<ul>
<li><strong>Base of the scheme</strong> — the Foundation syllabus is the base of the whole ISTQB Certified Tester scheme.</li>
<li><strong>Every delivery practice</strong> — Waterfall, Agile, DevOps, Continuous Delivery.</li>
</ul>
<p class="nhan">Who it is for</p>
<ul>
<li>Testers, test analysts and test engineers</li>
<li>Test consultants and test managers</li>
<li>User-acceptance testers</li>
<li><strong>Software developers</strong> — so SWT301 is not only for students who want to be testers.</li>
</ul>`,
        `<p class="y-chinh">🎯 Foundation dành cho <em>mọi người</em> làm phần mềm — không chỉ cho bạn nào muốn làm tester.</p>
<p class="nhan">Áp dụng ở đâu</p>
<ul>
<li><strong>Nền của cả hệ thống</strong> — syllabus Foundation là nền của toàn bộ chương trình Certified Tester của ISTQB.</li>
<li><strong>Mọi cách làm phần mềm</strong> — Waterfall, Agile, DevOps, Continuous Delivery.</li>
</ul>
<p class="nhan">Dành cho ai</p>
<ul>
<li>Tester, test analyst, test engineer</li>
<li>Tư vấn kiểm thử và quản lý test</li>
<li>Người làm kiểm thử chấp nhận (UAT)</li>
<li><strong>Cả lập trình viên</strong> — nên SWT301 không chỉ dành cho bạn nào muốn làm tester.</li>
</ul>`],
      [9, 'Business outcomes (1)',
        `<p class="y-chinh">🎯 Business outcomes = what a certified Foundation tester can do for an employer (part 1 of 2).</p>
<ol>
<li><strong>Common vocabulary</strong> — communicate efficiently using the shared testing terms.</li>
<li><strong>Fundamental concepts</strong> — understand the basics of software testing.</li>
<li><strong>Context</strong> — understand how different development practices and constraints change the testing approach.</li>
<li><strong>Reviews</strong> — contribute effectively to reviews.</li>
<li><strong>Test design</strong> — use established techniques to design tests at all test levels.</li>
<li><strong>Execution</strong> — interpret and execute tests from given test specifications, and report the results.</li>
</ol>`,
        `<p class="y-chinh">🎯 Business outcomes = những gì một tester chuẩn Foundation làm được cho doanh nghiệp (phần 1/2).</p>
<ol>
<li><strong>Từ vựng chung</strong> — giao tiếp hiệu quả bằng thuật ngữ kiểm thử chung.</li>
<li><strong>Khái niệm nền tảng</strong> — hiểu các khái niệm cơ bản của kiểm thử phần mềm.</li>
<li><strong>Ngữ cảnh</strong> — hiểu cách thực hành phát triển và các ràng buộc làm thay đổi cách kiểm thử.</li>
<li><strong>Review</strong> — đóng góp hiệu quả vào review.</li>
<li><strong>Thiết kế test</strong> — dùng kỹ thuật chuẩn để thiết kế test ở mọi cấp.</li>
<li><strong>Thực thi</strong> — đọc hiểu, thực thi test từ đặc tả có sẵn và báo cáo kết quả.</li>
</ol>`],
      [10, 'Business outcomes (2)',
        `<p class="y-chinh">🎯 Business outcomes, part 2 — these lean towards management, defects and tools.</p>
<ol start="7">
<li><strong>Test management</strong> — understand the principles for resources, strategies, planning, control and risk.</li>
<li><strong>Defect reports</strong> — write clear, understandable defect reports.</li>
<li><strong>Project factors</strong> — understand what drives test priorities and the test approach.</li>
<li><strong>Value</strong> — understand the value testing brings to stakeholders.</li>
<li><strong>Alignment</strong> — align testing activities and work products with project objectives, measures and targets.</li>
<li><strong>Tools</strong> — help select and implement testing tools.</li>
</ol>
<p class="nhan">Where you learn them</p>
<ul>
<li><strong>Management and defect reports</strong> → Ch.7</li>
<li><strong>Tools</strong> → Ch.8</li>
</ul>`,
        `<p class="y-chinh">🎯 Business outcomes phần 2 — thiên về quản lý, defect và công cụ.</p>
<ol start="7">
<li><strong>Quản lý test</strong> — hiểu nguyên tắc về nguồn lực, chiến lược, kế hoạch, kiểm soát và rủi ro.</li>
<li><strong>Defect report</strong> — viết defect report rõ ràng, dễ hiểu.</li>
<li><strong>Yếu tố dự án</strong> — hiểu điều gì quyết định độ ưu tiên và cách tiếp cận test.</li>
<li><strong>Giá trị</strong> — hiểu giá trị kiểm thử mang lại cho các bên liên quan.</li>
<li><strong>Gắn kết</strong> — gắn hoạt động và sản phẩm kiểm thử với mục tiêu, thước đo và chỉ tiêu của dự án.</li>
<li><strong>Công cụ</strong> — hỗ trợ chọn và triển khai công cụ test.</li>
</ol>
<p class="nhan">Học ở đâu</p>
<ul>
<li><strong>Quản lý và defect report</strong> → Ch.7</li>
<li><strong>Công cụ</strong> → Ch.8</li>
</ul>`],
      [11, 'Learning objectives — K-levels',
        `<p class="y-chinh">🎯 Every learning objective carries a K-level — and the K-level tells you what <em>kind</em> of question you will get.</p>
<p class="nhan">The four levels (count of LOs at Foundation 2018)</p>
<ul>
<li><strong>K1</strong> — remember, recognise, recall (15 LOs).</li>
<li><strong>K2</strong> — understand, explain, give reasons, compare, classify, categorise, give examples, summarise (40 LOs).</li>
<li><strong>K3</strong> — apply, use (7 LOs).</li>
<li><strong>K4</strong> — analyse (none at Foundation 2018).</li>
</ul>
<p class="nhan">What each looks like in the exam</p>
<ul>
<li><strong>K1</strong> — a one-line definition.</li>
<li><strong>K2</strong> — "which statement is correct / best describes…".</li>
<li><strong>K3</strong> — a scenario: compute partitions, boundaries, a decision-table column, a state sequence, a schedule, or classify defects in a report.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mỗi learning objective mang một mức K — và mức K cho biết bạn sẽ gặp <em>kiểu</em> câu hỏi nào.</p>
<p class="nhan">Bốn mức (số LO ở Foundation 2018)</p>
<ul>
<li><strong>K1</strong> — nhớ, nhận ra, gợi lại (15 LO).</li>
<li><strong>K2</strong> — hiểu, giải thích, nêu lý do, so sánh, phân loại, cho ví dụ, tóm tắt (40 LO).</li>
<li><strong>K3</strong> — áp dụng, sử dụng (7 LO).</li>
<li><strong>K4</strong> — phân tích (Foundation 2018 không có).</li>
</ul>
<p class="nhan">Trong đề trông như thế nào</p>
<ul>
<li><strong>K1</strong> — định nghĩa một dòng.</li>
<li><strong>K2</strong> — "phát biểu nào đúng / mô tả đúng nhất…".</li>
<li><strong>K3</strong> — cho tình huống: tính phân vùng, giá trị biên, một cột decision table, một chuỗi trạng thái, một lịch thực thi, hoặc phân loại lỗi trong một báo cáo.</li>
</ul>`],
      [12, 'Learning objectives — Chapter 1',
        `<p class="y-chinh">🎯 Chapter 1 objectives — almost all K2 (explain), taught in Chapter 1 lessons 1.1–1.5.</p>
<ul>
<li><strong>1.1 What is testing</strong> — identify typical objectives of testing (K1); differentiate testing from debugging (K2).</li>
<li><strong>1.2 Why testing is necessary</strong> — give examples why testing is necessary; relate testing to QA; distinguish error / defect / failure; root cause vs effects (all K2).</li>
<li><strong>1.3 Seven principles</strong> — explain them (K2).</li>
<li><strong>1.4 Test process</strong> — impact of context; activities and tasks; work products; value of traceability (all K2).</li>
<li><strong>1.5 Psychology</strong> — psychological factors (K1); tester vs developer mindset (K2).</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục tiêu Chương 1 — gần như toàn K2 (giải thích), học ở Chương 1, bài 1.1–1.5.</p>
<ul>
<li><strong>1.1 Kiểm thử là gì</strong> — nêu mục tiêu điển hình của kiểm thử (K1); phân biệt testing với debugging (K2).</li>
<li><strong>1.2 Vì sao cần kiểm thử</strong> — ví dụ vì sao cần kiểm thử; quan hệ kiểm thử với QA; phân biệt error / defect / failure; nguyên nhân gốc với hậu quả (đều K2).</li>
<li><strong>1.3 Bảy nguyên tắc</strong> — giải thích được (K2).</li>
<li><strong>1.4 Quy trình test</strong> — ảnh hưởng của ngữ cảnh; hoạt động và công việc; sản phẩm; giá trị của truy vết (đều K2).</li>
<li><strong>1.5 Tâm lý</strong> — yếu tố tâm lý (K1); tư duy tester khác developer (K2).</li>
</ul>`],
      [13, 'Learning objectives — Chapter 2',
        `<p class="y-chinh">🎯 Chapter 2 objectives — lifecycle models, test levels, test types and maintenance testing.</p>
<ul>
<li><strong>2.1 Lifecycle models</strong> — relationships between development and test activities (K2); why lifecycle models must be adapted (K1); characteristics of good testing (K1).</li>
<li><strong>2.2 Test levels</strong> — compare the test levels (K2).</li>
<li><strong>2.3 Test types</strong> — compare functional, non-functional and white-box testing (K2); they occur at any level (K1); confirmation vs regression (K2).</li>
<li><strong>2.4 Maintenance testing</strong> — triggers for maintenance testing; the role of impact analysis (K2).</li>
</ul>
<p class="ghi-chu">The slide lists "impact analysis" twice, as 2.4.2 and 2.4.3 — the syllabus has triggers as 2.4.1 and impact analysis as 2.4.2.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu Chương 2 — mô hình vòng đời, cấp test, loại test và kiểm thử bảo trì.</p>
<ul>
<li><strong>2.1 Mô hình vòng đời</strong> — quan hệ giữa hoạt động phát triển và kiểm thử (K2); vì sao mô hình vòng đời phải điều chỉnh (K1); đặc điểm của kiểm thử tốt (K1).</li>
<li><strong>2.2 Cấp test</strong> — so sánh các cấp test (K2).</li>
<li><strong>2.3 Loại test</strong> — so sánh test chức năng, phi chức năng và white-box (K2); chúng có ở mọi cấp (K1); confirmation vs regression (K2).</li>
<li><strong>2.4 Kiểm thử bảo trì</strong> — tác nhân kích hoạt kiểm thử bảo trì; vai trò của phân tích tác động (K2).</li>
</ul>
<p class="ghi-chu">Slide ghi "impact analysis" hai lần ở 2.4.2 và 2.4.3 — syllabus thực tế: 2.4.1 là tác nhân, 2.4.2 là phân tích tác động.</p>`],
      [14, 'Learning objectives — Chapter 3',
        `<p class="y-chinh">🎯 Chapter 3 objectives — static testing and reviews, with one K3 you will actually do in Lab 1 and the PE.</p>
<ul>
<li><strong>3.1 Static testing basics</strong> — work products that can be examined statically (K1); value of static testing (K2); static vs dynamic (K2).</li>
<li><strong>3.2 Review process</strong> — review-process activities (K2); roles in a formal review (K1); differences between informal review, walkthrough, technical review and inspection (K2); <strong>apply a review technique to a work product (K3)</strong>; success factors (K2).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> that K3 is exactly Lab 1 and PE Question 1.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu Chương 3 — kiểm thử tĩnh và review, có một câu K3 bạn sẽ làm thật ở Lab 1 và đề PE.</p>
<ul>
<li><strong>3.1 Cơ bản về kiểm thử tĩnh</strong> — sản phẩm có thể kiểm tra tĩnh (K1); giá trị của kiểm thử tĩnh (K2); tĩnh vs động (K2).</li>
<li><strong>3.2 Quy trình review</strong> — các hoạt động của quy trình review (K2); vai trò trong review chính thức (K1); khác nhau giữa informal review, walkthrough, technical review và inspection (K2); <strong>áp dụng một kỹ thuật review lên sản phẩm (K3)</strong>; yếu tố thành công (K2).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mục K3 đó chính là Lab 1 và câu 1 đề PE.</p>`],
      [15, 'Learning objectives — Chapter 4',
        `<p class="y-chinh">🎯 Chapter 4 objectives — the heaviest chapter: most questions and four of the seven K3s.</p>
<ul>
<li><strong>4.1 Categories</strong> — characteristics of black-box, white-box and experience-based techniques (K2).</li>
<li><strong>4.2 Black-box</strong> — <strong>apply EP, BVA, decision tables and state transition (all K3)</strong>; explain use-case testing (K2).</li>
<li><strong>4.3 White-box</strong> — explain statement coverage, decision coverage and their value (K2).</li>
<li><strong>4.4 Experience-based</strong> — explain error guessing, exploratory and checklist-based testing (K2).</li>
</ul>
<p class="nhan">Why it matters</p>
<ul>
<li><strong>Most questions</strong> — 11 of 40.</li>
<li><strong>Hardest part</strong> — all four of its K3s are the exam's hardest questions.</li>
<li><strong>PE</strong> — it is also PE Question 3.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục tiêu Chương 4 — chương nặng nhất: nhiều câu nhất và bốn trong bảy mục K3.</p>
<ul>
<li><strong>4.1 Phân loại</strong> — đặc điểm của kỹ thuật black-box, white-box và dựa kinh nghiệm (K2).</li>
<li><strong>4.2 Black-box</strong> — <strong>áp dụng EP, BVA, decision table và state transition (đều K3)</strong>; giải thích use-case testing (K2).</li>
<li><strong>4.3 White-box</strong> — giải thích statement coverage, decision coverage và giá trị của chúng (K2).</li>
<li><strong>4.4 Dựa kinh nghiệm</strong> — giải thích error guessing, exploratory và checklist-based testing (K2).</li>
</ul>
<p class="nhan">Vì sao quan trọng</p>
<ul>
<li><strong>Nhiều câu nhất</strong> — 11 trên 40.</li>
<li><strong>Phần khó nhất</strong> — cả bốn mục K3 là những câu khó nhất của đề.</li>
<li><strong>Đề PE</strong> — đây cũng chính là câu 3 đề PE.</li>
</ul>`],
      [16, 'Learning objectives — Chapter 5 (1)',
        `<p class="y-chinh">🎯 Chapter 5 objectives, part 1 — organisation, planning &amp; estimation, monitoring &amp; control.</p>
<ul>
<li><strong>5.1 Test organisation</strong> — benefits and drawbacks of independent testing (K2); tasks of test manager and tester (K1).</li>
<li><strong>5.2 Planning &amp; estimation</strong> — purpose and content of a test plan (K2); test approaches (K2); entry/exit criteria (K2); <strong>schedule test execution from priorities and dependencies (K3)</strong>; factors influencing effort (K1); metrics-based vs expert-based estimation (K2).</li>
<li><strong>5.3 Monitoring &amp; control</strong> — metrics (K1); purpose, content and audiences of test reports (K2).</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục tiêu Chương 5 phần 1 — tổ chức, lập kế hoạch &amp; ước lượng, giám sát &amp; kiểm soát.</p>
<ul>
<li><strong>5.1 Tổ chức test</strong> — lợi ích và hạn chế của kiểm thử độc lập (K2); công việc của test manager và tester (K1).</li>
<li><strong>5.2 Kế hoạch &amp; ước lượng</strong> — mục đích và nội dung test plan (K2); các cách tiếp cận test (K2); tiêu chí vào/ra (K2); <strong>xếp lịch thực thi test theo độ ưu tiên và phụ thuộc (K3)</strong>; các yếu tố ảnh hưởng công sức (K1); ước lượng dựa số liệu vs dựa chuyên gia (K2).</li>
<li><strong>5.3 Giám sát &amp; kiểm soát</strong> — các chỉ số (K1); mục đích, nội dung và người đọc của báo cáo test (K2).</li>
</ul>`],
      [17, 'Learning objectives — Chapter 5 (2)',
        `<p class="y-chinh">🎯 Chapter 5 objectives, part 2 — configuration management, risk and defect reports (Chapter 7 on this site).</p>
<ul>
<li><strong>5.4 Configuration management</strong> — how it supports testing (K2).</li>
<li><strong>5.5 Risks</strong> — risk level from likelihood and impact (K1); project vs product risk (K2); how product-risk analysis influences thoroughness and scope (K2).</li>
<li><strong>5.6 Defect management</strong> — <strong>write a defect report (K3)</strong>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục tiêu Chương 5 phần 2 — quản lý cấu hình, rủi ro và defect report (trên trang này là Chương 7).</p>
<ul>
<li><strong>5.4 Quản lý cấu hình</strong> — hỗ trợ kiểm thử thế nào (K2).</li>
<li><strong>5.5 Rủi ro</strong> — mức rủi ro từ khả năng xảy ra và mức tác động (K1); rủi ro dự án vs rủi ro sản phẩm (K2); phân tích rủi ro sản phẩm ảnh hưởng độ kỹ và phạm vi test (K2).</li>
<li><strong>5.6 Quản lý defect</strong> — <strong>viết defect report (K3)</strong>.</li>
</ul>`],
      [18, 'Learning objectives — Chapter 6',
        `<p class="y-chinh">🎯 Chapter 6 objectives — tool support, almost all K1 (recall); Chapter 8 on this site.</p>
<ul>
<li><strong>6.1 Test tool considerations</strong> — classify test tools by purpose and supported activities (K2); benefits and risks of automation (K1); special considerations for execution and management tools (K1).</li>
<li><strong>6.2 Effective use of tools</strong> — main principles for selecting a tool (K1); objectives of a pilot project (K1); success factors (K1).</li>
</ul>
<p class="ghi-chu">The slide heads 6.2 "Test Planning and Estimation (K3)" — a copy-paste slip; the section is "Effective use of tools".</p>`,
        `<p class="y-chinh">🎯 Mục tiêu Chương 6 — công cụ hỗ trợ, gần như toàn K1 (nhớ); trên trang này là Chương 8.</p>
<ul>
<li><strong>6.1 Lưu ý về công cụ test</strong> — phân loại công cụ theo mục đích và hoạt động hỗ trợ (K2); lợi ích và rủi ro của tự động hoá (K1); lưu ý riêng với công cụ thực thi và quản lý test (K1).</li>
<li><strong>6.2 Dùng công cụ hiệu quả</strong> — nguyên tắc chính khi chọn công cụ (K1); mục tiêu của dự án thí điểm (K1); yếu tố thành công (K1).</li>
</ul>
<p class="ghi-chu">Slide đặt tiêu đề 6.2 là "Test Planning and Estimation (K3)" — dán nhầm; mục đúng là "Effective use of tools".</p>`],
    ]),
  ].join('\n'),
};

/* ───────────────────────── 0.4 Materials, tools & folder map ───────────────────────── */
const MAP = [
  ['01.Materials/01.Slides/SWT0_tim (.pptx/.pdf)', 'Introduction: ISTQB, exam structure, learning objectives, exam tips', 'Section 0 (0.1, 0.3, 0.5)'],
  ['01.Materials/01.Slides/SWT1_tim', 'Ch.1 Fundamentals of testing (114 slides)', 'Chapter 1'],
  ['01.Materials/01.Slides/SWT2_tim', 'Ch.2 Testing throughout the SDLC (143 slides)', 'Chapter 2'],
  ['01.Materials/01.Slides/SWT3_tim', 'Ch.3 Static testing (106 slides — the .pdf copy is older and has only 75)', 'Chapter 3'],
  ['01.Materials/01.Slides/SWT4_tim', 'Ch.4 Test techniques (112 slides)', 'Chapters 4, 5, 6'],
  ['01.Materials/01.Slides/SWT5_tim', 'Ch.5 Test management (101 slides — the .pdf copy has only 90)', 'Chapter 7'],
  ['01.Materials/01.Slides/SWT6_tim', 'Ch.6 Tool support (54 slides)', 'Chapter 8'],
  ['01.Materials/01.Slides/Topic 8 ISTQB CTFL Agile Tester', 'Agile tester (74 slides — the .pdf copy is image-only and older)', 'Chapter 9'],
  ['01.Materials/01.Slides/Additional Content.pdf', 'ISTQB facts, certificate priorities, user-story card, anatomy of a test case', 'Lesson 0.5 (slides 1, 2, 5) and lesson 1.4 (slides 18–26)'],
  ['01.Materials/01.Slides/Overview.xlsx', 'one-page matrix: level × objective × object × test type × technique', 'Lesson 2.6'],
  ['01.Materials/02.Books (6 PDFs)', 'textbooks', 'Lesson 0.6 + a "📚" block in every lesson'],
  ['01.Materials/03.PE (PE1.jpg, PE2.jpg, PE3 FA23 .docx + template, PE4/SP25.jpg; SP26 is empty)', 'past practical exams', 'PE section'],
  ['01.Materials/04.Samples (build.xml, junit-4.13.2.jar, hamcrest-core-1.3.jar)', 'JUnit 4 starter kit', 'Chapter 8 (hands-on JUnit lesson)'],
  ['01.Materials/05.Templates (Report5.1 Unit Test, 5.2 Integration Test, 5.3 System Test + 2 filled samples)', 'capstone test-report templates', 'Lab 3 (and Lab 2 for the unit-test sheet)'],
  ['02.Lab/01.Lab01 (Lab1_Review.pptx, sourcecode.pdf, Java checklist, 1.jpg, Lab1_static_analysis.pptx)', 'code review & static analysis', 'Lab 1'],
  ['02.Lab/02.LAB02 (unit-testing guide, How to write PCL, structural/functional decks, checklists, templates, Detail Design Javadoc)', 'component (unit) testing', 'Lab 2'],
  ['02.Lab/03.LAB03 (Report5 integration-test sample)', 'integration test report', 'Lab 3'],
  ['03.Temp/MystBloom', 'a real student JSP web app', 'Practice project'],
  ['03.Temp/CV_*.doc(x)', 'CVs of real people — personal data, not course material', 'not used (on purpose)'],
  ['*.zip (3 files)', 'Google Drive download archives of the same three folders (same file counts: 37 / 293 / 383)', 'nothing extra'],
];
const mapRows = MAP.map((r) => `<tr><td><code>${r[0]}</code></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
const L04 = {
  title: '0.4 — Materials, tools & a map of every file in the course folder|||0.4 — Tài liệu, công cụ & bản đồ từng file trong thư mục môn',
  slug: 'swt301-tai-lieu-cong-cu',
  type: 'DOCUMENT',
  description: 'Bảng đối chiếu từng file/thư mục trong folder SWT301 (slide, sách, PE, template, Lab, Temp) với chương/bài trên khoá học, và bộ công cụ cần cài (JDK, IDE, JUnit, Excel, Postman, SonarLint…).',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools and where everything is</h2>
<p class="lead">The teacher's folder has 700+ files. This table tells you where each one is taught on this site, so nothing is missed and you never study the same thing twice.</p>
<div class="table-wrap"><table>
<thead><tr><th>File / folder</th><th>What it is</th><th>Taught in</th></tr></thead>
<tbody>${mapRows}</tbody>
</table></div>
<h3>Tools you will use</h3>
<table>
<thead><tr><th>Tool</th><th>For</th><th>Where</th></tr></thead>
<tbody>
<tr><td>JDK 17+ and an IDE (IntelliJ IDEA, NetBeans or VS Code)</td><td>writing and running Java and tests</td><td>Ch.5, Ch.8, Lab 2, Practice</td></tr>
<tr><td>JUnit 4.13.2 + Hamcrest 1.3 (04.Samples) and JUnit 5</td><td>unit tests</td><td>Ch.8, Lab 2</td></tr>
<tr><td>A static-analysis plug-in (e.g. SonarLint / PMD / Checkstyle — see Lab 1)</td><td>static analysis</td><td>Ch.3, Lab 1</td></tr>
<tr><td>Microsoft Excel / LibreOffice Calc</td><td>checklists, test-case templates, reports, the PE templates</td><td>Labs, PE</td></tr>
<tr><td>Postman</td><td>API / component-integration tests</td><td>Ch.2 lesson 2.6, Lab 3</td></tr>
<tr><td>Selenium WebDriver</td><td>UI automation</td><td>Ch.8</td></tr>
<tr><td>Jira / Bugzilla / a spreadsheet</td><td>defect tracking</td><td>Ch.7</td></tr>
<tr><td>AI assistants (ChatGPT, Gemini…)</td><td>explaining, generating first drafts of test ideas — always verify (CLO9)</td><td>all</td></tr>
</tbody>
</table>
<p class="di-toi"><a href="${EXP}">🛠️ Setup guide — JDK, IntelliJ, JUnit 5 &amp; Selenium (Exp Hub) →</a></p>
<p class="di-toi"><a href="${CODELAB}">⌨️ Practise Java + JUnit in the browser (Code Lab) →</a></p>
<p class="di-toi"><a href="${EXPHUB}">📚 All environment guides (Exp Hub) →</a></p>`,
    `<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ và mọi thứ nằm ở đâu</h2>
<p class="lead">Thư mục của thầy/cô có hơn 700 file. Bảng này cho biết từng file được dạy ở đâu trên trang, để không sót gì và không phải học một thứ hai lần.</p>
<div class="table-wrap"><table>
<thead><tr><th>File / thư mục</th><th>Là gì</th><th>Học ở</th></tr></thead>
<tbody>${mapRows}</tbody>
</table></div>
<h3>Công cụ sẽ dùng</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Ở đâu</th></tr></thead>
<tbody>
<tr><td>JDK 17+ và một IDE (IntelliJ IDEA, NetBeans hoặc VS Code)</td><td>viết và chạy Java, chạy test</td><td>Ch.5, Ch.8, Lab 2, Dự án luyện tập</td></tr>
<tr><td>JUnit 4.13.2 + Hamcrest 1.3 (04.Samples) và JUnit 5</td><td>unit test</td><td>Ch.8, Lab 2</td></tr>
<tr><td>Plug-in phân tích tĩnh (vd SonarLint / PMD / Checkstyle — xem Lab 1)</td><td>phân tích tĩnh</td><td>Ch.3, Lab 1</td></tr>
<tr><td>Microsoft Excel / LibreOffice Calc</td><td>checklist, template test case, báo cáo, template đề PE</td><td>các Lab, PE</td></tr>
<tr><td>Postman</td><td>test API / tích hợp thành phần</td><td>Ch.2 bài 2.6, Lab 3</td></tr>
<tr><td>Selenium WebDriver</td><td>tự động hoá giao diện</td><td>Ch.8</td></tr>
<tr><td>Jira / Bugzilla / bảng tính</td><td>quản lý defect</td><td>Ch.7</td></tr>
<tr><td>Trợ lý AI (ChatGPT, Gemini…)</td><td>giải thích, gợi ý bản nháp ý tưởng test — luôn tự kiểm lại (CLO9)</td><td>mọi phần</td></tr>
</tbody>
</table>
<p class="di-toi"><a href="${EXP}">🛠️ Hướng dẫn cài JDK, IntelliJ, JUnit 5 &amp; Selenium (Exp Hub) →</a></p>
<p class="di-toi"><a href="${CODELAB}">⌨️ Luyện Java + JUnit ngay trên trình duyệt (Code Lab) →</a></p>
<p class="di-toi"><a href="${EXPHUB}">📚 Tất cả hướng dẫn cài môi trường (Exp Hub) →</a></p>`),
  ].join('\n'),
};

/* ───────────────────────── 0.5 ISTQB exam & MCQ strategy ───────────────────────── */
const L05 = {
  title: '0.5 — The ISTQB exam, the FE and how to answer multiple-choice questions|||0.5 — Đề ISTQB, đề FE và cách làm câu trắc nghiệm',
  slug: 'swt301-istqb-exam-strategy',
  type: 'VIDEO',
  description: 'SWT0 slide 5–7, 19–21 và Additional Content slide 1, 2, 5: cấu trúc đề CTFL (40 câu, 26 đạt, K1/K2/K3, số câu mỗi chương), 13 mẹo làm trắc nghiệm có ví dụ, chiến lược cho đề FE của trường; cộng SWT7 (bộ slide 2023) trang 4–6, 19–20: trang cấu trúc đề chính thức, chỗ ghi sai K4, tỉ lệ theo chương, mỗi mẹo một ví dụ.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.5 · SWT0 slides 5–7, 19–21 · Additional Content slides 1, 2, 5 · SWT7 (2023) pages 4–6, 19–20</span>
<h2>The exam — and how to beat multiple choice</h2>
<p class="lead">The FPT Theory Exam uses the same question style as the international CTFL exam. Knowing the blueprint tells you where the marks are; knowing MCQ technique stops you losing marks you deserve.</p>
<table>
<thead><tr><th></th><th>ISTQB CTFL (2018)</th><th>FPT SWT301 Theory Exam</th></tr></thead>
<tbody>
<tr><td>Questions</td><td>40 single-choice, K1 8 · K2 24 · K3 8</td><td>about 60 single-choice (see the 22 FE papers in the Exam room)</td></tr>
<tr><td>Time</td><td>60 min (75 min for non-native speakers)</td><td>60 min</td></tr>
<tr><td>Pass</td><td>26/40 = 65%</td><td>≥ 4.0/10 for this component, average ≥ 5.0 overall</td></tr>
<tr><td>Weight by chapter</td><td>C1 8 · C2 5 · C3 5 · C4 11 · C5 9 · C6 2</td><td>similar, plus Agile (Ch.9)</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · Bài 0.5 · SWT0 slide 5–7, 19–21 · Additional Content slide 1, 2, 5 · SWT7 (2023) trang 4–6, 19–20</span>
<h2>Đề thi — và cách chinh phục câu trắc nghiệm</h2>
<p class="lead">Đề lý thuyết (TE/FE) của FPT dùng cùng kiểu câu hỏi với đề CTFL quốc tế. Biết "bản thiết kế" đề là biết điểm nằm ở đâu; biết kỹ thuật làm trắc nghiệm là không mất những điểm mình xứng đáng có.</p>
<table>
<thead><tr><th></th><th>ISTQB CTFL (2018)</th><th>Đề lý thuyết SWT301 của FPT</th></tr></thead>
<tbody>
<tr><td>Số câu</td><td>40 câu một đáp án, K1 8 · K2 24 · K3 8</td><td>khoảng 60 câu một đáp án (xem 22 đề FE trong Phòng thi)</td></tr>
<tr><td>Thời gian</td><td>60 phút (75 phút cho người không bản ngữ)</td><td>60 phút</td></tr>
<tr><td>Điểm đạt</td><td>26/40 = 65%</td><td>thành phần này ≥ 4.0/10, tổng trung bình ≥ 5.0</td></tr>
<tr><td>Phân bổ theo chương</td><td>C1 8 · C2 5 · C3 5 · C4 11 · C5 9 · C6 2</td><td>tương tự, thêm Agile (Ch.9)</td></tr>
</tbody>
</table>`),
    walkHead('swt0', 5, 7),
    walk('swt0', [
      [5, 'Preparing for the exam — structure by K-level',
        `<p class="y-chinh">🎯 K3 questions are worth the same one mark as K1/K2 but take three times longer.</p>
<p class="nhan">The blueprint table</p>
<ul>
<li><strong>K1</strong> — 8 questions × 1 min = 8 min.</li>
<li><strong>K2</strong> — 24 × 1 min = 24 min.</li>
<li><strong>K3</strong> — 8 × 3 min = 24 min.</li>
<li><strong>K4</strong> — 0 questions (4 min each if they appeared).</li>
<li><strong>Total</strong> — 40 questions, about 56 minutes of "question time".</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> do the quick K1/K2 ones first, then come back to the K3s.</p>`,
        `<p class="y-chinh">🎯 Câu K3 cũng chỉ một điểm như K1/K2 nhưng tốn thời gian gấp ba.</p>
<p class="nhan">Bảng thiết kế đề</p>
<ul>
<li><strong>K1</strong> — 8 câu × 1 phút = 8 phút.</li>
<li><strong>K2</strong> — 24 × 1 phút = 24 phút.</li>
<li><strong>K3</strong> — 8 × 3 phút = 24 phút.</li>
<li><strong>K4</strong> — 0 câu (nếu có thì 4 phút mỗi câu).</li>
<li><strong>Tổng</strong> — 40 câu, khoảng 56 phút "thời gian làm câu".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> làm các câu K1/K2 nhanh trước, rồi quay lại câu K3.</p>`],
      [6, 'Preparing for the exam — rules',
        `<p class="y-chinh">🎯 The CTFL exam rules: 40 questions, 26 to pass, and the certificate never expires.</p>
<ul>
<li><strong>Format</strong> — 40 single-choice questions from K1 to K4.</li>
<li><strong>Pass mark</strong> — 26/40 (65%).</li>
<li><strong>Mix</strong> — 8 × K1, 24 × K2, 8 × K3/K4.</li>
<li><strong>Time</strong> — 75 minutes for non-native speakers.</li>
<li><strong>Certificate</strong> — shows no score and <strong>never expires</strong>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Luật thi CTFL: 40 câu, đúng 26 là đạt, và chứng chỉ không hết hạn.</p>
<ul>
<li><strong>Hình thức</strong> — 40 câu một đáp án, từ K1 tới K4.</li>
<li><strong>Điểm đạt</strong> — 26/40 (65%).</li>
<li><strong>Cơ cấu</strong> — 8 câu K1, 24 câu K2, 8 câu K3/K4.</li>
<li><strong>Thời gian</strong> — 75 phút cho người không bản ngữ.</li>
<li><strong>Chứng chỉ</strong> — không ghi điểm và <strong>không hết hạn</strong>.</li>
</ul>`],
      [7, 'Preparing for the exam — questions per chapter',
        `<p class="y-chinh">🎯 Chapters 1, 4 and 5 give 28 of the 40 marks — spend your revision time there.</p>
<p class="nhan">Questions per chapter</p>
<ol class="hai-cot"><li>C1 — 8</li><li>C2 — 5</li><li>C3 — 5</li><li>C4 — 11</li><li>C5 — 9</li><li>C6 — 2</li></ol>
<p>Total = 40. On this site, CTFL 1, 4 and 5 are Chapter 1, Chapters 4–6 and Chapter 7.</p>`,
        `<p class="y-chinh">🎯 Chương 1, 4 và 5 chiếm 28/40 điểm — dồn thời gian ôn vào đó.</p>
<p class="nhan">Số câu mỗi chương</p>
<ol class="hai-cot"><li>C1 — 8</li><li>C2 — 5</li><li>C3 — 5</li><li>C4 — 11</li><li>C5 — 9</li><li>C6 — 2</li></ol>
<p>Tổng = 40. Trên trang này, CTFL 1, 4 và 5 là Chương 1, Chương 4–6 và Chương 7.</p>`],
    ]),
    walkHead('swt0', 19, 21, 'The thirteen tips, each with a concrete example.', 'Mười ba mẹo, mỗi mẹo kèm một ví dụ cụ thể.'),
    walk('swt0', [
      [19, 'Taking the exam — tips 1–7',
        `<p class="y-chinh">🎯 Tips 1–7: read carefully, answer in your head, then eliminate — before you ever guess.</p>
<ol><li><strong>Read the entire question</strong> — "Which is NOT…", "BEST", "MOST likely" change the answer.</li><li><strong>Answer it in your mind first</strong>, then look for your answer among the options.</li><li><strong>Eliminate wrong answers</strong> — "testing proves there are no defects" is always wrong.</li><li><strong>Use the process of elimination</strong> until one remains.</li><li><strong>Select the best answer</strong> — two can be true; one fits the syllabus wording.</li><li><strong>Read every option</strong>, even if A looks right.</li><li><strong>Answer the ones you know first</strong>; flag the rest.</li></ol>`,
        `<p class="y-chinh">🎯 Mẹo 1–7: đọc kỹ, tự trả lời trong đầu, rồi loại trừ — trước khi phải đoán.</p>
<ol><li><strong>Đọc hết câu hỏi</strong> — "Which is NOT…", "BEST", "MOST likely" làm đáp án đổi hẳn.</li><li><strong>Tự trả lời trong đầu trước</strong>, rồi mới tìm đáp án đó trong các phương án.</li><li><strong>Loại phương án sai</strong> — "kiểm thử chứng minh không còn lỗi" luôn sai.</li><li><strong>Loại trừ dần</strong> cho tới khi còn một.</li><li><strong>Chọn đáp án đúng nhất</strong> — có thể hai cái đều đúng; một cái khớp câu chữ syllabus.</li><li><strong>Đọc mọi phương án</strong>, kể cả khi A trông đúng.</li><li><strong>Làm câu chắc trước</strong>; đánh dấu câu còn lại.</li></ol>`],
      [20, 'Taking the exam — tips 8–13',
        `<p class="y-chinh">🎯 Tips 8–13: when you are unsure, guess with reasons — never leave a blank.</p>
<ol start="8"><li><strong>Make an educated guess</strong> — no negative marking, so never leave a blank.</li><li><strong>Stick with your first choice</strong> unless you find a concrete reason to change.</li><li><strong>"All/None of the above"</strong> — check each option; if two are clearly true, "all" is likely.</li><li><strong>When two answers seem correct</strong>, prefer the one with the syllabus's exact term (e.g. "confirmation testing" over "retesting after a fix").</li><li><strong>Bet on the positive option</strong> — syllabus statements are usually positive; negatively phrased options are more often distractors.</li><li><strong>The more information… the better</strong> — a longer, more precise option is often the correct one (qualified statements like "may", "typically" match the syllabus tone).</li></ol>`,
        `<p class="y-chinh">🎯 Mẹo 8–13: khi chưa chắc, hãy đoán có cơ sở — đừng bao giờ bỏ trống.</p>
<ol start="8"><li><strong>Đoán có cơ sở</strong> — không trừ điểm câu sai, nên đừng bao giờ bỏ trống.</li><li><strong>Giữ lựa chọn đầu tiên</strong> trừ khi tìm được lý do cụ thể để đổi.</li><li><strong>"Tất cả/Không có đáp án nào đúng"</strong> — kiểm từng phương án; nếu hai cái chắc chắn đúng thì "tất cả" có khả năng cao.</li><li><strong>Khi hai đáp án cùng đúng</strong>, chọn cái dùng đúng thuật ngữ của syllabus (vd "confirmation testing" thay vì "test lại sau khi sửa").</li><li><strong>Ưu tiên phương án khẳng định</strong> — câu trong syllabus thường khẳng định; phương án phủ định hay là nhiễu.</li><li><strong>Càng nhiều thông tin càng tốt</strong> — phương án dài, chính xác hơn thường đúng (các câu có "may", "typically" khớp giọng văn syllabus).</li></ol>`],
      [21, 'Summary', `<p class="y-chinh">🎯 The whole deck in two things: prepare, then take the exam well.</p>
<ol>
<li><strong>Preparing for the exam</strong> — know the blueprint, practise with past papers.</li>
<li><strong>Taking the exam</strong> — the thirteen tips above.</li>
</ol>`, `<p class="y-chinh">🎯 Cả bộ slide gói trong hai việc: chuẩn bị, rồi làm bài cho tốt.</p>
<ol>
<li><strong>Chuẩn bị</strong> — nắm bản thiết kế đề, luyện đề cũ.</li>
<li><strong>Làm bài</strong> — mười ba mẹo ở trên.</li>
</ol>`],
    ]),
    walkHead('addl', 1, 5, 'Only slides 1, 2 and 5 of this external deck are shown: 3–4 are memes and 6–17 are an Egyptian registration FAQ and a trainer\'s personal contacts. Slides 18–26 are in lesson 1.4.', 'Chỉ hiện slide 1, 2 và 5 của bộ slide bên ngoài này: 3–4 là ảnh vui, 6–17 là hỏi đáp đăng ký thi ở Ai Cập và thông tin liên lạc cá nhân của một giảng viên. Slide 18–26 nằm ở bài 1.4.'),
    walk('addl', [
      [1, 'International Software Testing Qualifications Board',
        `<p class="y-chinh">🎯 ISTQB is a volunteer-run, not-for-profit board — and the most widely held testing certificate scheme.</p>
<p class="nhan">Facts on the slide (2018)</p>
<ul>
<li><strong>Type</strong> — a not-for-profit association.</li>
<li><strong>Registered</strong> — in Belgium.</li>
<li><strong>Run by</strong> — volunteer work of hundreds of international testing experts.</li>
<li><strong>Exams</strong> — more than 800,000 taken worldwide.</li>
<li><strong>Certificates</strong> — more than 15, at different levels.</li>
</ul>
<p class="ghi-chu">Today the numbers are higher: over a million certifications.</p>`,
        `<p class="y-chinh">🎯 ISTQB là tổ chức phi lợi nhuận do tình nguyện viên vận hành — và là hệ chứng chỉ kiểm thử phổ biến nhất.</p>
<p class="nhan">Số liệu trên slide (năm 2018)</p>
<ul>
<li><strong>Loại tổ chức</strong> — hiệp hội phi lợi nhuận.</li>
<li><strong>Đăng ký</strong> — tại Bỉ.</li>
<li><strong>Vận hành bởi</strong> — tình nguyện viên, hàng trăm chuyên gia kiểm thử quốc tế.</li>
<li><strong>Lượt thi</strong> — hơn 800.000 trên thế giới.</li>
<li><strong>Chứng chỉ</strong> — hơn 15, ở các cấp khác nhau.</li>
</ul>
<p class="ghi-chu">Hiện nay con số đã vượt một triệu chứng chỉ.</p>`],
      [2, 'A national board: how many hold each certificate',
        `<p class="y-chinh">🎯 Foundation is by far the most held certificate and Agile Tester is second — exactly why SWT301 covers both.</p>
<p class="nhan">The Egyptian board (ESTB) at the time</p>
<ul>
<li><strong>CTFL</strong> — 3208</li>
<li><strong>CTFL-Agile Tester</strong> — 631</li>
<li><strong>CTAL-Test Manager</strong> — 37</li>
<li><strong>CTAL-Technical Test Analyst</strong> — 23</li>
<li><strong>CTAL-Test Automation Engineer</strong> — 6</li>
<li><strong>CTAL-Security</strong> — 2</li>
</ul>
<p>The shape is universal: Foundation first, Agile Tester second, advanced certificates far behind.</p>`,
        `<p class="y-chinh">🎯 Foundation là chứng chỉ nhiều người có nhất, Agile Tester đứng thứ hai — đó chính là lý do SWT301 dạy cả hai.</p>
<p class="nhan">Board Ai Cập (ESTB) lúc đó</p>
<ul>
<li><strong>CTFL</strong> — 3208</li>
<li><strong>CTFL-Agile Tester</strong> — 631</li>
<li><strong>CTAL-Test Manager</strong> — 37</li>
<li><strong>CTAL-Technical Test Analyst</strong> — 23</li>
<li><strong>CTAL-Test Automation Engineer</strong> — 6</li>
<li><strong>CTAL-Security</strong> — 2</li>
</ul>
<p>Hình dạng này nơi nào cũng giống: Foundation đứng đầu, Agile Tester thứ hai, các chứng chỉ Advanced bỏ xa phía sau.</p>`],
      [5, 'Must / should / could / won\'t have',
        `<p class="y-chinh">🎯 A MoSCoW view of certificates for a junior tester: Foundation first, advanced ones only after experience.</p>
<ul>
<li><strong>Must have</strong> — ISTQB Foundation Level.</li>
<li><strong>Should have</strong> — ISTQB Agile Tester.</li>
<li><strong>Could have</strong> — a specialist one: mobile, performance, usability.</li>
<li><strong>Won't have (yet)</strong> — Test Manager, Test Analyst, Technical Test Analyst, Security Tester, Automation Tester (Test Automation Engineer) — those need experience first.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> MoSCoW itself is a prioritisation technique — you will meet it again for requirements and risk.</p>`,
        `<p class="y-chinh">🎯 Góc nhìn MoSCoW về chứng chỉ cho tester mới vào nghề: Foundation trước, chứng chỉ nâng cao để sau khi có kinh nghiệm.</p>
<ul>
<li><strong>Must have</strong> — ISTQB Foundation Level.</li>
<li><strong>Should have</strong> — ISTQB Agile Tester.</li>
<li><strong>Could have</strong> — một chứng chỉ chuyên sâu: mobile, performance, usability.</li>
<li><strong>Won't have (chưa cần)</strong> — Test Manager, Test Analyst, Technical Test Analyst, Security Tester, Automation Tester (Test Automation Engineer) — cần kinh nghiệm trước.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bản thân MoSCoW là một kỹ thuật ưu tiên — bạn sẽ gặp lại khi làm yêu cầu và rủi ro.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — using the tips on a real FE question</h3>
<p><strong>Q.</strong> "Which of the following will be the best definition for Testing?" (FE paper 1, question 1)</p>
<ul>
<li><strong>a)</strong> the purpose is to demonstrate that the program works</li>
<li><strong>b)</strong> the purpose is to demonstrate that the program is defect free</li>
<li><strong>c)</strong> the purpose is to demonstrate that the program does what it is supposed to do</li>
<li><strong>d)</strong> testing is executing software for the purpose of finding defects</li>
</ul>
<h4>Applying the tips</h4>
<ol><li>Tip 3 — eliminate b (Principle 1: no test proves "defect free").</li><li>Tips 5 and 11 — a and c describe showing it works (the "traditional approach" of SWT1 slide 106); d matches the "better approach" (slide 107: the goal is to find faults).</li><li>Answer <strong>d</strong>. (With the full 2018 definition, a stricter paper might prefer an option mentioning static testing too — read all options.)</li></ol>
<div class="pitfall co-tieu-de"><strong>Absolute words are red flags.</strong> "always", "never", "all", "prove", "guarantee", "completely" are usually wrong in testing questions — the syllabus speaks in "may", "can", "typically".</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>CTFL v4.0 (2023).</strong> ISTQB released a new Foundation syllabus in 2023:
<ul>
<li><strong>Principles</strong> — the seven principles are reworded.</li>
<li><strong>Management</strong> — test management is reorganised.</li>
<li><strong>New topics</strong> — DevOps, shift-left, the whole-team approach, collaboration-based test approaches, ATDD.</li>
</ul>
<p>Your slides follow v3.1 (2018), which is what the FE uses. If you later sit the real certificate, check which version your exam provider uses.</p>
<p class="ghi-chu">Outside the syllabus because the course is built on the 2018 edition.</p></div>`,
    `<h3>Ví dụ có lời giải · Dùng các mẹo trên một câu FE thật</h3>
<p><strong>Câu hỏi.</strong> "Which of the following will be the best definition for Testing?" (đề FE số 1, câu 1)</p>
<ul>
<li><strong>a)</strong> mục đích là chứng minh chương trình chạy được</li>
<li><strong>b)</strong> mục đích là chứng minh chương trình không có lỗi</li>
<li><strong>c)</strong> mục đích là chứng minh chương trình làm đúng việc phải làm</li>
<li><strong>d)</strong> kiểm thử là thực thi phần mềm nhằm tìm ra lỗi</li>
</ul>
<h4>Áp dụng các mẹo</h4>
<ol><li>Mẹo 3 — loại b (Nguyên tắc 1: không test nào chứng minh được "không có lỗi").</li><li>Mẹo 5 và 11 — a và c là "chứng minh nó chạy" (cách tiếp cận truyền thống ở slide 106 SWT1); d khớp "cách tiếp cận tốt hơn" (slide 107: mục tiêu là tìm lỗi).</li><li>Đáp án <strong>d</strong>. (Với định nghĩa đầy đủ năm 2018, một đề khắt khe hơn có thể ưu tiên phương án nhắc cả kiểm thử tĩnh — hãy đọc mọi phương án.)</li></ol>
<div class="pitfall co-tieu-de"><strong>Từ tuyệt đối là cờ đỏ.</strong> "always", "never", "all", "prove", "guarantee", "completely" thường sai trong câu hỏi kiểm thử — syllabus nói bằng "may", "can", "typically".</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>CTFL v4.0 (2023).</strong> ISTQB ra syllabus Foundation mới năm 2023:
<ul>
<li><strong>Nguyên tắc</strong> — bảy nguyên tắc được viết lại.</li>
<li><strong>Quản lý</strong> — phần quản lý test được sắp xếp lại.</li>
<li><strong>Chủ đề mới</strong> — DevOps, shift-left, cách làm cả-nhóm, cách tiếp cận dựa trên cộng tác, ATDD.</li>
</ul>
<p>Slide của lớp theo v3.1 (2018) — đúng bản đề FE dùng. Nếu sau này thi chứng chỉ thật, hãy hỏi đơn vị tổ chức thi dùng phiên bản nào.</p>
<p class="ghi-chu">Ngoài giáo trình vì khoá học xây trên bản 2018.</p></div>`),
    bi(`<h3>SWT7 (2023) — the older version of this deck</h3>
<p>The 2023 course had this material as a separate deck, <em>SWT7 "ISTQB / ISEB Foundation Exam Practice"</em> (21 pages). Almost every page is the same as SWT0. The table lists those pages; the five pages that add something follow below it.</p>
<table>
<thead><tr><th>SWT7 page</th><th>Content</th><th>Already taught in</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>Cover, contents</td><td>title and agenda pages</td></tr>
<tr><td>3</td><td>ISTQB certificate map (2021 version)</td><td>0.1, SWT0 slide 3 — a newer map (adds AI Testing and Game Testing)</td></tr>
<tr><td>7</td><td>Audience</td><td>0.3, SWT0 slide 8</td></tr>
<tr><td>8</td><td>Contents — the CTFL tree</td><td>0.1, SWT0 slide 4</td></tr>
<tr><td>9–10</td><td>Business outcomes</td><td>0.3, SWT0 slides 9–10 — the same twelve outcomes</td></tr>
<tr><td>11</td><td>K-levels (15 / 40 / 7 learning objectives)</td><td>0.3, SWT0 slide 11</td></tr>
<tr><td>12–18</td><td>Learning objectives, Chapters 1–6</td><td>0.3, SWT0 slides 12–18 — the same 2018 objectives, including the slip that heads 6.2 "Test Planning and Estimation (K3)"</td></tr>
<tr><td>21</td><td>Summary</td><td>SWT0 slide 21</td></tr>
</tbody>
</table>
<p class="ghi-chu">"ISEB" in the title: the Information Systems Examinations Board (BCS, UK) ran a software-testing Foundation certificate before ISTQB was founded in 2002, then aligned it with ISTQB. Today the exam is simply ISTQB CTFL.</p>`,
    `<h3>SWT7 (2023) — phiên bản cũ của bộ slide này</h3>
<p>Khoá 2023 để phần này thành một bộ riêng, <em>SWT7 "ISTQB / ISEB Foundation Exam Practice"</em> (21 trang). Gần như mọi trang giống SWT0. Bảng dưới liệt kê các trang đó; năm trang có thêm nội dung nằm ngay sau bảng.</p>
<table>
<thead><tr><th>Trang SWT7</th><th>Nội dung</th><th>Đã học ở</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>Bìa, mục lục</td><td>trang tiêu đề và mục lục</td></tr>
<tr><td>3</td><td>Sơ đồ chứng chỉ ISTQB (bản 2021)</td><td>0.1, SWT0 slide 3 — sơ đồ mới hơn (thêm AI Testing và Game Testing)</td></tr>
<tr><td>7</td><td>Đối tượng (Audience)</td><td>0.3, SWT0 slide 8</td></tr>
<tr><td>8</td><td>Mục lục — cây CTFL</td><td>0.1, SWT0 slide 4</td></tr>
<tr><td>9–10</td><td>Business outcomes</td><td>0.3, SWT0 slide 9–10 — cùng mười hai outcome</td></tr>
<tr><td>11</td><td>Các mức K (15 / 40 / 7 learning objective)</td><td>0.3, SWT0 slide 11</td></tr>
<tr><td>12–18</td><td>Learning objective Chương 1–6</td><td>0.3, SWT0 slide 12–18 — cùng bộ objective 2018, kể cả chỗ dán nhầm tiêu đề 6.2 "Test Planning and Estimation (K3)"</td></tr>
<tr><td>21</td><td>Tóm tắt</td><td>SWT0 slide 21</td></tr>
</tbody>
</table>
<p class="ghi-chu">Chữ "ISEB" trong tiêu đề: Information Systems Examinations Board (thuộc BCS, Anh) cấp chứng chỉ Foundation về kiểm thử từ trước khi ISTQB ra đời năm 2002, rồi chuyển sang theo ISTQB. Ngày nay kỳ thi chỉ còn tên ISTQB CTFL.</p>`),
    walkHead('oswt7', 4, 20, 'Only pages 4, 5, 6, 19 and 20 are shown — each adds a number, a correction or a worked example to the SWT0 slides above.', 'Chỉ hiện trang 4, 5, 6, 19 và 20 — mỗi trang thêm một con số, một chỗ sửa hoặc một ví dụ cho các slide SWT0 ở trên.'),
    walk('oswt7', [
      [4, 'Preparing for the exam — the official exam structure page',
        `<p class="y-chinh">🎯 The official exam page: 40 questions in 60 minutes, 65% to pass, and 25% extra time if the exam is not in your own language.</p>
<p class="nhan">The numbers</p>
<ul>
<li><strong>Questions</strong> — 40 multiple-choice.</li>
<li><strong>Pass mark</strong> — 65%, i.e. 26 correct.</li>
<li><strong>Time</strong> — 60 minutes; <strong>75 minutes</strong> (+25%) when the exam is not in your spoken language. That is where SWT0's "75 minutes for non-native speakers" comes from.</li>
<li><strong>Pace</strong> — 60 / 40 = 1.5 minutes per question; with 75 minutes, about 1.9.</li>
</ul>
<p class="nhan">New on this page: how you sit the exam</p>
<ul>
<li><strong>With an Accredited Training Provider</strong> — the exam can be part of an accredited course.</li>
<li><strong>Independently</strong> — at an examination centre or in a public exam.</li>
<li><strong>Training</strong> — typically 3 days, and <strong>not a prerequisite</strong>: you may sit the exam without any course.</li>
<li><strong>Where to check</strong> — the ISTQB Member Board of your country and the list of accredited providers.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> passing SWT301 is not the ISTQB certificate — that comes only from the ISTQB exam, which you register for separately.</p>`,
        `<p class="y-chinh">🎯 Trang thông tin chính thức: 40 câu trong 60 phút, đúng 65% là đạt, và thêm 25% thời gian nếu thi không bằng tiếng mẹ đẻ.</p>
<p class="nhan">Các con số</p>
<ul>
<li><strong>Số câu</strong> — 40 câu trắc nghiệm.</li>
<li><strong>Điểm đạt</strong> — 65%, tức đúng 26 câu.</li>
<li><strong>Thời gian</strong> — 60 phút; <strong>75 phút</strong> (+25%) khi đề không bằng ngôn ngữ bạn nói hằng ngày. Câu "75 phút cho người không bản ngữ" của SWT0 đến từ đây.</li>
<li><strong>Nhịp làm bài</strong> — 60 / 40 = 1,5 phút mỗi câu; với 75 phút, khoảng 1,9 phút.</li>
</ul>
<p class="nhan">Điều mới trên trang: cách đi thi</p>
<ul>
<li><strong>Qua Accredited Training Provider</strong> — kỳ thi có thể nằm trong một khoá học được công nhận.</li>
<li><strong>Thi độc lập</strong> — tại trung tâm khảo thí hoặc một đợt thi công khai.</li>
<li><strong>Khoá học</strong> — thường 3 ngày, và <strong>không bắt buộc</strong>: bạn được thi mà không cần học khoá nào.</li>
<li><strong>Tra ở đâu</strong> — Member Board ISTQB của nước bạn và danh sách đơn vị đào tạo được công nhận.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> qua môn SWT301 không phải là có chứng chỉ ISTQB — chứng chỉ chỉ đến từ kỳ thi ISTQB, bạn phải đăng ký riêng.</p>`],
      [5, 'Preparing for the exam — the rules (K4 wording)',
        `<p class="y-chinh">🎯 The same rules as SWT0 slide 6 — but one line uses loose wording: K4 means "analyse", not "apply".</p>
<ul>
<li><strong>40 single-choice questions</strong>, 26/40 (65%) to pass — you can afford to miss <strong>14</strong>.</li>
<li><strong>8 × K1</strong> — remember.</li>
<li><strong>24 × K2</strong> — understand.</li>
<li><strong>8 × K3/K4</strong> — the page says "apply".</li>
<li><strong>75 minutes</strong> for non-native speakers.</li>
<li><strong>No score</strong> on the certificate and <strong>no expiry</strong>.</li>
</ul>
<div class="pitfall">"08 questions of K3 and K4: apply" mixes two levels. K3 = <em>apply</em>, K4 = <em>analyse</em> — and the 2018 Foundation exam has <strong>0</strong> K4 questions (SWT0 slide 5), so all 8 are K3. SWT0 slide 6 fixes the wording.</div>`,
        `<p class="y-chinh">🎯 Cùng luật với SWT0 slide 6 — nhưng một dòng viết lỏng: K4 là "phân tích", không phải "áp dụng".</p>
<ul>
<li><strong>40 câu một đáp án</strong>, đúng 26/40 (65%) là đạt — bạn được phép sai <strong>14</strong> câu.</li>
<li><strong>8 câu K1</strong> — nhớ.</li>
<li><strong>24 câu K2</strong> — hiểu.</li>
<li><strong>8 câu K3/K4</strong> — trang ghi "apply".</li>
<li><strong>75 phút</strong> cho người không bản ngữ.</li>
<li>Chứng chỉ <strong>không ghi điểm</strong> và <strong>không hết hạn</strong>.</li>
</ul>
<div class="pitfall">"08 questions of K3 and K4: apply" gộp hai mức làm một. K3 = <em>áp dụng</em>, K4 = <em>phân tích</em> — và đề Foundation 2018 có <strong>0</strong> câu K4 (SWT0 slide 5), nên cả 8 câu đều là K3. SWT0 slide 6 đã sửa lại câu chữ.</div>`],
      [6, 'Preparing for the exam — questions per chapter, as a pass plan',
        `<p class="y-chinh">🎯 Turn the per-chapter counts into shares and a pass plan: Chapters 1, 4 and 5 carry 70% of the marks.</p>
<table>
<thead><tr><th>CTFL chapter</th><th>Questions</th><th>Share</th><th>On this site</th></tr></thead>
<tbody>
<tr><td>C1 Fundamentals</td><td>8</td><td>20%</td><td>Chapter 1</td></tr>
<tr><td>C2 Testing throughout the SDLC</td><td>5</td><td>12.5%</td><td>Chapter 2</td></tr>
<tr><td>C3 Static testing</td><td>5</td><td>12.5%</td><td>Chapter 3</td></tr>
<tr><td>C4 Test techniques</td><td>11</td><td>27.5%</td><td>Chapters 4–6</td></tr>
<tr><td>C5 Test management</td><td>9</td><td>22.5%</td><td>Chapter 7</td></tr>
<tr><td>C6 Tool support</td><td>2</td><td>5%</td><td>Chapter 8</td></tr>
<tr><td><strong>Total</strong></td><td><strong>40</strong></td><td>100%</td><td></td></tr>
</tbody>
</table>
<p class="nhan">A pass plan in numbers</p>
<ul>
<li><strong>Core</strong> — C1 + C4 + C5 = 28 questions. Get 80% of them right → 22.</li>
<li><strong>The rest</strong> — C2 + C3 + C6 = 12 questions. Get half right → 6.</li>
<li><strong>Total</strong> — 22 + 6 = 28 ≥ 26: a pass with two questions to spare.</li>
</ul>
<p class="ghi-chu">These are the CTFL 2018 counts. The FPT FE has its own mix (about 60 questions, plus Agile) — see the table at the top of this lesson.</p>`,
        `<p class="y-chinh">🎯 Đổi số câu mỗi chương thành tỉ lệ và một kế hoạch đậu: Chương 1, 4 và 5 chiếm 70% số điểm.</p>
<table>
<thead><tr><th>Chương CTFL</th><th>Số câu</th><th>Tỉ lệ</th><th>Trên trang này</th></tr></thead>
<tbody>
<tr><td>C1 Nền tảng</td><td>8</td><td>20%</td><td>Chương 1</td></tr>
<tr><td>C2 Kiểm thử trong vòng đời</td><td>5</td><td>12,5%</td><td>Chương 2</td></tr>
<tr><td>C3 Kiểm thử tĩnh</td><td>5</td><td>12,5%</td><td>Chương 3</td></tr>
<tr><td>C4 Kỹ thuật test</td><td>11</td><td>27,5%</td><td>Chương 4–6</td></tr>
<tr><td>C5 Quản lý test</td><td>9</td><td>22,5%</td><td>Chương 7</td></tr>
<tr><td>C6 Công cụ</td><td>2</td><td>5%</td><td>Chương 8</td></tr>
<tr><td><strong>Tổng</strong></td><td><strong>40</strong></td><td>100%</td><td></td></tr>
</tbody>
</table>
<p class="nhan">Kế hoạch đậu bằng con số</p>
<ul>
<li><strong>Phần lõi</strong> — C1 + C4 + C5 = 28 câu. Đúng 80% → 22 câu.</li>
<li><strong>Phần còn lại</strong> — C2 + C3 + C6 = 12 câu. Đúng một nửa → 6 câu.</li>
<li><strong>Tổng</strong> — 22 + 6 = 28 ≥ 26: đậu, dư hai câu.</li>
</ul>
<p class="ghi-chu">Đây là số câu của CTFL 2018. Đề FE của FPT có cơ cấu riêng (khoảng 60 câu, thêm Agile) — xem bảng đầu bài này.</p>`],
      [19, 'Taking the exam — tips 1–7, one worked example each',
        `<p class="y-chinh">🎯 Tips 1–7 are the same as SWT0 slide 19 — here each one gets a concrete exam-style example.</p>
<ol>
<li><strong>Read the entire question</strong> — "Which of the following is NOT a benefit of test tools?" Miss the NOT and you pick "reduction of repetitive work", the first true statement you see.</li>
<li><strong>Answer it in your mind first</strong> — "What does the pesticide paradox say?" Say "the same tests stop finding new defects" before looking. Then pick the option that matches, not the one that merely sounds familiar.</li>
<li><strong>Eliminate wrong answers</strong> — in "Which statement about testing is correct?", cross out "exhaustive testing is possible for small systems" and "testing shows the absence of defects" at once (Principles 2 and 1).</li>
<li><strong>Use the process of elimination</strong> — valid age 18–65, two-value boundary analysis: a) 17, 18, 65, 66 · b) 18, 65 · c) 17, 66 · d) 0, 18, 65, 100. b has no invalid values, c no valid ones, d uses 0 and 100, which are not boundaries → <strong>a</strong>.</li>
<li><strong>Select the best answer</strong> — "The MAIN objective of a pilot project?" "Train all testers" is useful, but the syllabus objective is "assess whether the benefits will be achieved at reasonable cost".</li>
<li><strong>Read every answer option</strong> — "Which BEST describes the value of reviews?" A "Reviews find defects" is true. D "Reviews can find defects, such as deviations from standards, that are hard to find by dynamic testing" answers the question better.</li>
<li><strong>Answer the questions you know first</strong> — a 60-question FE in 60 minutes: the first pass takes the one-line K1/K2 questions (about 35 minutes). Flag the decision-table and state-transition K3s and come back with the time left.</li>
</ol>`,
        `<p class="y-chinh">🎯 Mẹo 1–7 giống SWT0 slide 19 — ở đây mỗi mẹo có một ví dụ cụ thể theo kiểu câu thi.</p>
<ol>
<li><strong>Đọc hết câu hỏi</strong> — "Which of the following is NOT a benefit of test tools?" Sót chữ NOT là bạn chọn "reduction of repetitive work", câu đúng đầu tiên bạn thấy.</li>
<li><strong>Tự trả lời trong đầu trước</strong> — "Pesticide paradox nói gì?" Tự nói "chạy mãi một bộ test thì không còn tìm ra lỗi mới" trước khi nhìn. Rồi chọn phương án khớp, không chọn cái chỉ nghe quen.</li>
<li><strong>Loại phương án sai</strong> — với "Phát biểu nào về kiểm thử là đúng?", gạch ngay "kiểm thử vét cạn làm được với hệ thống nhỏ" và "kiểm thử chứng minh không còn lỗi" (Nguyên tắc 2 và 1).</li>
<li><strong>Loại trừ dần</strong> — tuổi hợp lệ 18–65, phân tích giá trị biên hai giá trị: a) 17, 18, 65, 66 · b) 18, 65 · c) 17, 66 · d) 0, 18, 65, 100. b không có giá trị không hợp lệ, c không có giá trị hợp lệ, d dùng 0 và 100 vốn không phải biên → <strong>a</strong>.</li>
<li><strong>Chọn đáp án đúng nhất</strong> — "Mục tiêu CHÍNH của dự án pilot?" "Đào tạo mọi tester" có ích, nhưng mục tiêu theo syllabus là "đánh giá lợi ích có đạt được với chi phí hợp lý không".</li>
<li><strong>Đọc mọi phương án</strong> — "Câu nào mô tả ĐÚNG NHẤT giá trị của review?" A "Review tìm ra lỗi" là đúng. D "Review tìm được những lỗi khó thấy bằng test động, như sai lệch so với chuẩn" trả lời câu hỏi tốt hơn.</li>
<li><strong>Làm câu chắc trước</strong> — đề FE 60 câu trong 60 phút: vòng đầu làm các câu K1/K2 một dòng (khoảng 35 phút). Đánh dấu các câu K3 decision table, state transition rồi quay lại với thời gian còn lại.</li>
</ol>`],
      [20, 'Taking the exam — tips 8–13, one worked example each',
        `<p class="y-chinh">🎯 Tips 8–13 are for the questions you are not sure of — each with a concrete example.</p>
<ol start="8">
<li><strong>Make an educated guess</strong> — there is no negative marking. With 10 questions still open, blind guessing gives about 2.5 marks (10 × 1/4); eliminating two options first gives about 5 (10 × 1/2).</li>
<li><strong>Stick with your first choice — but not always</strong> — change only for a concrete reason. You chose "confirmation testing", then notice the stem says "re-run the suite to check that nothing else broke": that is regression testing, a real reason to change.</li>
<li><strong>"All of the above" / "None of the above"</strong> — "Which are benefits of tools? a) less repetitive work b) greater consistency c) objective assessment d) all of the above". If you are sure of two of a–c, choose d. Choose "none" only when you can refute every option.</li>
<li><strong>When two answers seem correct</strong> — "retesting after a fix" and "confirmation testing" mean the same; the exam wants the syllabus term, confirmation testing.</li>
<li><strong>Bet on the positive option</strong> — "Which is TRUE of independent testing?" "Independent testers can recognise different kinds of failures" (positive, syllabus wording) beats "Developers should never test their own code" (absolute and negative).</li>
<li><strong>The more information… the better</strong> — "What can static analysis find?" The precise option "coding-standard violations, security vulnerabilities and unreachable code, without executing the code" beats a vague "defects".</li>
</ol>
<div class="pitfall">Tips 12 and 13 are only heuristics: ISTQB question writers try to keep options similar in length and tone. Use them only when tips 1–6 have not already decided the answer.</div>`,
        `<p class="y-chinh">🎯 Mẹo 8–13 dành cho những câu bạn chưa chắc — mỗi mẹo kèm một ví dụ cụ thể.</p>
<ol start="8">
<li><strong>Đoán có cơ sở</strong> — không trừ điểm câu sai. Còn 10 câu bỏ ngỏ: đoán mò được khoảng 2,5 điểm (10 × 1/4); loại trước hai phương án thì được khoảng 5 điểm (10 × 1/2).</li>
<li><strong>Giữ lựa chọn đầu tiên — nhưng không phải lúc nào cũng vậy</strong> — chỉ đổi khi có lý do cụ thể. Bạn chọn "confirmation testing", rồi thấy đề viết "chạy lại cả bộ để chắc không có chỗ nào khác hỏng": đó là regression testing, một lý do thật để đổi.</li>
<li><strong>"Tất cả đều đúng" / "Không có đáp án nào đúng"</strong> — "Lợi ích của công cụ là gì? a) bớt việc lặp lại b) nhất quán hơn c) đánh giá khách quan d) tất cả các ý trên". Chắc chắn được hai trong a–c thì chọn d. Chỉ chọn "không có đáp án nào" khi bác bỏ được từng phương án.</li>
<li><strong>Khi hai đáp án cùng có vẻ đúng</strong> — "test lại sau khi sửa" và "confirmation testing" cùng nghĩa; đề muốn thuật ngữ của syllabus, confirmation testing.</li>
<li><strong>Ưu tiên phương án khẳng định</strong> — "Điều nào ĐÚNG về kiểm thử độc lập?" "Tester độc lập nhận ra được những kiểu failure khác" (khẳng định, đúng câu chữ syllabus) thắng "Developer không bao giờ nên test code của mình" (tuyệt đối và phủ định).</li>
<li><strong>Càng nhiều thông tin càng tốt</strong> — "Static analysis tìm được gì?" Phương án chính xác "vi phạm chuẩn code, lỗ hổng bảo mật và code không bao giờ chạy tới, mà không cần chạy code" thắng câu chung chung "lỗi".</li>
</ol>
<div class="pitfall">Mẹo 12 và 13 chỉ là kinh nghiệm: người ra đề ISTQB cố giữ các phương án dài ngắn và giọng văn như nhau. Chỉ dùng khi mẹo 1–6 chưa quyết được đáp án.</div>`],
    ]),
  ].join('\n'),
};

/* ───────────────────────────── 0.6 Books ───────────────────────────── */
const CH = [
  ['1 Fundamentals', 'Ch.1 p1–35 (PDF 15–49)', '§1.1–1.5 p1–31', '§2.1–2.4 (PDF 27–73)', '§2 (PDF 20–51)'],
  ['2 SDLC', 'Ch.2 p36–74 (PDF 50–88)', '§2.1–2.4 p35–54', '§3 (PDF 76–126)', '§3 (PDF 54–91)'],
  ['3 Static', 'Ch.3 p75–105 (PDF 89–119)', '§3 p57–74', '§4 (PDF 129–155)', '§4 (PDF 94–117)'],
  ['4–6 Techniques', 'Ch.4 p106–153 (PDF 120–167)', '§4 p77–117', '§5 (PDF 159–243)', '§5 (PDF 120–179)'],
  ['7 Management', 'Ch.5 p154–202 (PDF 168–216)', '§5 p127–161', '§6 (PDF 247–)', '§6 (PDF 184–218)'],
  ['8 Tools', 'Ch.6 p203–227 (PDF 217–241)', '§6 p169–193', '§7 (PDF 303–)', '§7 (PDF 220–238)'],
  ['Exam practice', 'Ch.7 mock exam p232 (PDF 246), answers p253 (PDF 267)', 'Ch.7 p197', '—', '—'],
];
const chRows = CH.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
const L06 = {
  title: '0.6 — The six books: which one to read, when, and a chapter map|||0.6 — Sáu cuốn sách: đọc cuốn nào, lúc nào, và bảng đối chiếu chương',
  slug: 'swt301-books-guide',
  type: 'DOCUMENT',
  description: 'Giới thiệu 6 file sách trong 02.Books (bản nào mới/cũ, dùng cho phần nào), bảng đối chiếu chương khoá học ↔ trang sách, và cách đọc sách để ôn thi.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.6 · 01.Materials/02.Books</span>
<h2>The six books</h2>
<p class="lead">Six PDF files, four different books. Every lesson on this site ends with the exact chapter and pages to read; this lesson explains which book to trust for what.</p>
<table>
<thead><tr><th>Book (file)</th><th>What it is good for</th></tr></thead>
<tbody>
<tr><td>${BOOKS.fst4}</td><td><strong>The main textbook</strong>, aligned with the 2018 syllabus your slides follow; sample questions per chapter and a full 40-question mock exam with answers. Image-only PDF (no text search).</td></tr>
<tr><td>${BOOKS.fst}</td><td>An older edition of the same book (5-step test process, CTFL 2011 wording). Text-searchable — handy for quick look-ups.</td></tr>
<tr><td>${BOOKS.sp5}</td><td>The deepest explanations with a running case study; the best book when a technique "does not click" (EP, BVA, decision tables, coverage, pair-wise testing).</td></tr>
<tr><td>${BOOKS.sp4}</td><td>The previous edition of Spillner (CTFL 2011); good extra examples, older process names.</td></tr>
<tr><td>${BOOKS.agile}</td><td>A 22-page summary of the ISTQB Agile Tester syllabus — read it with Chapter 9.</td></tr>
<tr><td>${BOOKS.junit}</td><td>Practical JUnit 5, mocks, stubs, TDD, BDD, the test pyramid — for Lab 2 and Chapter 8.</td></tr>
</tbody>
</table>
<h3>Chapter map</h3>
<div class="table-wrap"><table>
<thead><tr><th>Course chapter</th><th>van Veenendaal 2019 (main)</th><th>Graham (older)</th><th>Spillner 2021</th><th>Spillner 4th</th></tr></thead>
<tbody>${chRows}</tbody>
</table></div>
<div class="callout ok"><strong>How to read for the exam.</strong>
<ol>
<li><strong>The lesson here first</strong> — it tells you what matters.</li>
<li><strong>The matching book section</strong> — from the chapter map above.</li>
<li><strong>The book's sample exam questions</strong> for that chapter — check the answers at the back.</li>
<li><strong>Two weeks before the FE</strong> — sit the 40-question mock exam in Chapter 7 of the main textbook under exam conditions (60 minutes).</li>
</ol></div>
<p><span class="ghi-chu">The books are copyrighted and are provided by the course for your personal study; this site does not republish their pages — it only points you to the right ones.</span></p>`,
    `<span class="eyebrow">Mục 0 · Bài 0.6 · 01.Materials/02.Books</span>
<h2>Sáu cuốn sách</h2>
<p class="lead">Sáu file PDF, bốn cuốn sách khác nhau. Mỗi bài trên trang đều kết thúc bằng đúng chương và trang cần đọc; bài này nói rõ nên tin cuốn nào cho việc gì.</p>
<table>
<thead><tr><th>Sách (file)</th><th>Dùng tốt nhất để</th></tr></thead>
<tbody>
<tr><td>${BOOKS.fst4}</td><td><strong>Giáo trình chính</strong>, khớp syllabus 2018 mà slide của lớp theo; có câu hỏi mẫu mỗi chương và một đề thử 40 câu có đáp án. PDF dạng ảnh (không tìm kiếm chữ được).</td></tr>
<tr><td>${BOOKS.fst}</td><td>Bản cũ của cùng cuốn sách (quy trình 5 bước, câu chữ CTFL 2011). Tìm kiếm chữ được — tiện tra nhanh.</td></tr>
<tr><td>${BOOKS.sp5}</td><td>Giải thích sâu nhất, có một case study xuyên suốt; cuốn tốt nhất khi một kỹ thuật "chưa thông" (EP, BVA, decision table, coverage, pair-wise).</td></tr>
<tr><td>${BOOKS.sp4}</td><td>Bản trước của Spillner (CTFL 2011); thêm ví dụ hay, tên quy trình kiểu cũ.</td></tr>
<tr><td>${BOOKS.agile}</td><td>Bản tóm tắt 22 trang của syllabus ISTQB Agile Tester — đọc cùng Chương 9.</td></tr>
<tr><td>${BOOKS.junit}</td><td>JUnit 5 thực hành, mock, stub, TDD, BDD, kim tự tháp test — cho Lab 2 và Chương 8.</td></tr>
</tbody>
</table>
<h3>Bảng đối chiếu chương</h3>
<div class="table-wrap"><table>
<thead><tr><th>Chương khoá học</th><th>van Veenendaal 2019 (chính)</th><th>Graham (bản cũ)</th><th>Spillner 2021</th><th>Spillner bản 4</th></tr></thead>
<tbody>${chRows}</tbody>
</table></div>
<div class="callout ok"><strong>Cách đọc để ôn thi.</strong>
<ol>
<li><strong>Đọc bài trên trang trước</strong> — nó chỉ ra điều quan trọng.</li>
<li><strong>Đọc đúng mục trong sách</strong> — theo bảng đối chiếu ở trên.</li>
<li><strong>Làm câu hỏi mẫu</strong> của chương đó trong sách — dò đáp án ở cuối sách.</li>
<li><strong>Hai tuần trước FE</strong> — làm đề thử 40 câu ở Chương 7 giáo trình chính trong điều kiện như thi thật (60 phút).</li>
</ol></div>
<p><span class="ghi-chu">Các cuốn sách có bản quyền và được môn học cung cấp để bạn tự học; trang này không đăng lại nội dung sách — chỉ chỉ đường tới đúng trang.</span></p>`),
  ].join('\n'),
};

/* ───────────────────────────── 0.7 How to study ───────────────────────────── */
const PLAN = [
  ['1', 'Section 0 · Chapter 1', 'Quiz 1'],
  ['2', 'Chapter 2', 'Quiz 2 · Progress Test 1'],
  ['3', 'Chapter 3 · Lab 1', 'Quiz 3 · Lab 1 submission'],
  ['4', 'Chapter 4 (EP, BVA)', 'PE Q3-style drills'],
  ['5', 'Chapter 4 (decision tables, state transition, use cases)', 'Quiz 4'],
  ['6', 'Chapters 5–6 · Lab 2', 'Quiz 5–6 · Progress Test 2 · Lab 2'],
  ['7', 'Chapter 7', 'Quiz 7'],
  ['8', 'Chapter 8 · Lab 3', 'Quiz 8 · Lab 3'],
  ['9', 'Chapter 9 · Practice project', 'Quiz 9 · Progress Test 3 · Presentation'],
  ['10', 'PE section · Final Exam lessons', '3 timed PE papers + 3 timed FE papers in the Exam room'],
];
const planRows = PLAN.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
const L07 = {
  title: '0.7 — How to study each lesson & a 10-week plan|||0.7 — Cách học từng bài & kế hoạch 10 tuần',
  slug: 'swt301-how-to-study',
  type: 'DOCUMENT',
  description: 'Quy trình 6 bước để học một bài theo slide, cách dùng quiz/Lab/Progress Test/Phòng thi, và kế hoạch 10 tuần khớp 60 buổi học của môn.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.7</span>
<h2>How to study with this course</h2>
<h3>Six steps for every lesson</h3>
<ol>
<li><strong>Read the opening box</strong> — learning objectives and the one-screen summary. Know what you are looking for.</li>
<li><strong>Go through the slides</strong> in order. For each <em>Question</em> slide, cover the answer, decide yourself, then read the explanation.</li>
<li><strong>Redo the worked example</strong> on paper without looking. For Chapters 4–5 this is exactly PE practice.</li>
<li><strong>Read the pitfall and the ★ box</strong> — the pitfall is what the exam tests; the ★ box is what interviews test.</li>
<li><strong>Read the book pages</strong> listed at the end (at least the main textbook).</li>
<li><strong>Take the chapter quiz</strong> — aim for ≥ 80%; every wrong answer sends you back to one slide.</li>
</ol>
<h3>A 10-week plan (60 sessions)</h3>
<table>
<thead><tr><th>Week</th><th>Study</th><th>Check</th></tr></thead>
<tbody>${planRows}</tbody>
</table>
<div class="callout"><strong>Use the Exam room.</strong> The site's Exam room already holds <strong>22 real FE papers</strong> (SWT301-FE1 … FE24), <strong>22 real PE papers</strong> with AI-marked write-in answers, and <strong>2 Progress Test 3 papers</strong>. Start doing FE papers from week 7 — one every few days, timed.</div>
<p class="di-toi"><a href="/exam?course=SWT301">📝 Open the Exam room (SWT301) →</a></p>`,
    `<span class="eyebrow">Mục 0 · Bài 0.7</span>
<h2>Học với khoá học này như thế nào</h2>
<h3>Sáu bước cho mỗi bài</h3>
<ol>
<li><strong>Đọc khung mở đầu</strong> — chuẩn đầu ra và bảng tóm tắt một màn hình. Biết mình đang tìm gì.</li>
<li><strong>Đi qua các slide</strong> theo thứ tự. Gặp slide <em>Question</em> thì che đáp án, tự quyết định, rồi mới đọc giải thích.</li>
<li><strong>Làm lại ví dụ có lời giải</strong> ra giấy mà không nhìn. Ở Chương 4–5, đây chính là luyện PE.</li>
<li><strong>Đọc khung bẫy và khung ★</strong> — bẫy là thứ đề thi hỏi; khung ★ là thứ phỏng vấn hỏi.</li>
<li><strong>Đọc các trang sách</strong> ghi ở cuối bài (ít nhất là giáo trình chính).</li>
<li><strong>Làm quiz của chương</strong> — đặt mục tiêu ≥ 80%; mỗi câu sai đưa bạn quay về đúng một slide.</li>
</ol>
<h3>Kế hoạch 10 tuần (60 buổi)</h3>
<table>
<thead><tr><th>Tuần</th><th>Học</th><th>Kiểm tra</th></tr></thead>
<tbody>${planRows}</tbody>
</table>
<div class="callout"><strong>Dùng Phòng thi.</strong> Phòng thi của web đã có <strong>22 đề FE thật</strong> (SWT301-FE1 … FE24), <strong>22 đề PE thật</strong> chấm bài viết bằng AI, và <strong>2 đề Progress Test 3</strong>. Bắt đầu làm đề FE từ tuần 7 — vài ngày một đề, bấm giờ.</div>
<p class="di-toi"><a href="/exam?course=SWT301">📝 Mở Phòng thi (SWT301) →</a></p>`),
  ].join('\n'),
};

export default {
  title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
  description: 'Đọc trước tiên: môn học & ISTQB, điều kiện qua môn, CLO và learning objective, cấu trúc đề & mẹo trắc nghiệm, bản đồ mọi file trong thư mục môn, sáu cuốn sách, kế hoạch 10 tuần.',
  lessons: [L01, L02, L03, L04, L05, L06, L07],
};
