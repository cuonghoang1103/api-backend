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
<p>Everything in the teacher's course folder is here: <strong>every slide of every deck</strong> (SWT0–SWT6, Topic 8, the Lab decks) is shown as an image, followed by an explanation in English and Vietnamese, the answer to every in-class question, a worked example, exam traps, a "★ beyond the syllabus" note and the exact pages to read in the six textbooks. Excel templates, checklists and past PE papers are explained cell by cell and solved.</p>
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
<p>Mọi thứ trong thư mục môn học của thầy/cô đều có ở đây: <strong>mọi slide của mọi bộ</strong> (SWT0–SWT6, Topic 8, các bộ slide Lab) được giữ nguyên dạng ảnh, ngay dưới là giải thích song ngữ Anh–Việt, đáp án cho mọi câu hỏi trên lớp, ví dụ có lời giải, bẫy thi, mục "★ ngoài giáo trình" và đúng trang cần đọc trong sáu cuốn sách. Các template Excel, checklist và đề PE cũ được giải thích từng ô và giải trọn.</p>
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
        `<p>Cover of the introductory deck the teacher shows on day one.</p>`,
        `<p>Bìa bộ slide giới thiệu thầy/cô chiếu buổi đầu tiên.</p>`],
      [2, 'ISTQB',
        `<p>The <strong>International Software Testing Qualifications Board</strong> — a not-for-profit body that writes the syllabi and certificates for software testers (link "ISTQB website" → istqb.org). SWT301's content <em>is</em> the Foundation Level syllabus, so passing SWT301 well means you have studied everything the international CTFL exam asks. Taking the real certificate is optional; it is offered through ISTQB member boards and exam providers (look up "find an exam provider" on istqb.org).</p>`,
        `<p><strong>International Software Testing Qualifications Board</strong> — tổ chức phi lợi nhuận soạn syllabus và cấp chứng chỉ cho tester (link "ISTQB website" → istqb.org). Nội dung SWT301 <em>chính là</em> syllabus Foundation Level, nên học tốt SWT301 là bạn đã học đủ những gì đề CTFL quốc tế hỏi. Thi lấy chứng chỉ thật là tuỳ chọn; kỳ thi được tổ chức qua các board thành viên và đơn vị khảo thí của ISTQB (tra "find an exam provider" trên istqb.org).</p>`],
      [3, 'Road map in the software testing domain',
        `<p>The ISTQB certificate map, read from the bottom "START HERE": <strong>Foundation – Certified Tester</strong> (this course). Above it three streams: <strong>Agile</strong> (Foundation Agile Tester → Advanced Agile Technical Tester, Agile Test Leadership at Scale); <strong>Core</strong> (Advanced Test Manager, Test Analyst, Technical Test Analyst → Expert: managing the test team, operational and strategic test management, assessing and implementing test process improvement); <strong>Specialist</strong> (acceptance testing, AI testing, automotive, gambling industry, game testing, mobile application testing, model-based testing, performance testing, security tester, test automation engineer, usability testing). For a fresh graduate the usual path is CTFL → Agile Tester → one specialist (automation or performance) → Advanced.</p>`,
        `<p>Bản đồ chứng chỉ ISTQB, đọc từ đáy "START HERE": <strong>Foundation – Certified Tester</strong> (môn này). Phía trên có ba nhánh: <strong>Agile</strong> (Foundation Agile Tester → Advanced Agile Technical Tester, Agile Test Leadership at Scale); <strong>Core</strong> (Advanced Test Manager, Test Analyst, Technical Test Analyst → Expert: quản lý nhóm test, quản lý test vận hành và chiến lược, đánh giá và cải tiến quy trình test); <strong>Specialist</strong> (acceptance testing, AI testing, ô tô, ngành cá cược, game, ứng dụng di động, model-based testing, performance testing, security tester, test automation engineer, usability testing). Với sinh viên mới ra trường, lộ trình thường gặp là CTFL → Agile Tester → một chứng chỉ chuyên sâu (automation hoặc performance) → Advanced.</p>`],
      [4, 'Course content (CTFL tree)',
        `<p>The six CTFL chapters and their sections: <em>Fundamentals</em> (what is testing, why necessary, seven principles, test process, psychology) · <em>Testing throughout the SDLC</em> (models, levels, types, maintenance) · <em>Static testing</em> (basics, review process) · <em>Test techniques</em> (categories, black-box, white-box, experience-based) · <em>Test management</em> (organisation, planning &amp; estimation, monitoring &amp; control, configuration management, risks, defect management) · <em>Tool support</em> (considerations, effective use). On this site: CTFL 1 → Chapter 1, 2 → 2, 3 → 3, 4 → Chapters 4–6, 5 → 7, 6 → 8; Chapter 9 adds the Agile Tester syllabus (Topic 8).</p>`,
        `<p>Sáu chương CTFL và các mục con: <em>Fundamentals</em> (kiểm thử là gì, vì sao cần, bảy nguyên tắc, quy trình test, tâm lý) · <em>Testing throughout the SDLC</em> (mô hình, cấp test, loại test, bảo trì) · <em>Static testing</em> (cơ bản, quy trình review) · <em>Test techniques</em> (phân loại, black-box, white-box, dựa kinh nghiệm) · <em>Test management</em> (tổ chức, lập kế hoạch &amp; ước lượng, giám sát &amp; kiểm soát, quản lý cấu hình, rủi ro, quản lý defect) · <em>Tool support</em> (lưu ý khi dùng công cụ, dùng hiệu quả). Trên trang này: CTFL 1 → Chương 1, 2 → 2, 3 → 3, 4 → Chương 4–6, 5 → 7, 6 → 8; Chương 9 bổ sung syllabus Agile Tester (Topic 8).</p>`],
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
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class (60 sessions of 45 min) + exams + ~103h self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">SWE102 / SWE201c / SWE202c</span></div>
  <div class="kv"><span class="k">Scale</span><span class="v">10 <small>pass when the average ≥ 5.0</small></span></div>
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
<div class="callout warn">Three hard blockers even with high coursework: (1) missing more than 20% of sessions = barred from the exam; (2) PE ≥ 4.0; (3) TE ≥ 4.0. Special rule: if 4 ≤ TE &lt; 5 and 4 ≤ PE &lt; 5 and the final result &lt; 5, the student may take the re-take path set by the lecturer.</div>
<div class="callout ok"><b>Time budget that works.</b> PE: 5 min reading, 25 min Q1, 25 min Q2, 30 min Q3, 5 min checking. FE: one pass answering what you know (~35 min), a second pass on the flagged ones, never leave a blank (no negative marking).</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Nắm luật chơi trước khi vào trận. Thông tin dưới đây lấy từ syllabus chính thức của môn SWT301.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h trên lớp (60 buổi × 45 phút) + thi + ~103h tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">SWE102 / SWE201c / SWE202c</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi điểm trung bình ≥ 5.0</small></span></div>
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
<div class="callout warn">Ba điều kiện <strong>chặn cứng</strong> dù điểm quá trình cao: (1) vắng quá 20% số buổi = cấm thi; (2) PE ≥ 4.0; (3) TE ≥ 4.0. Luật đặc biệt: nếu 4 ≤ TE &lt; 5 và 4 ≤ PE &lt; 5 và điểm tổng &lt; 5, sinh viên có thể đi theo hướng thi lại do giảng viên quy định.</div>
<div class="callout ok"><b>Phân bổ thời gian hiệu quả.</b> PE: 5 phút đọc đề, 25 phút Q1, 25 phút Q2, 30 phút Q3, 5 phút soát. FE: lượt một làm hết câu chắc chắn (~35 phút), lượt hai quay lại câu đã đánh dấu, không bỏ trống câu nào (không trừ điểm câu sai).</div>`),
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
        `<p>The Foundation syllabus is the base of the whole ISTQB scheme and applies to <strong>every delivery practice</strong> — Waterfall, Agile, DevOps, Continuous Delivery — and to anyone who needs practical knowledge of testing: testers, test analysts and engineers, consultants, managers, user-acceptance testers <em>and software developers</em>. So SWT301 is not only for students who want to be testers.</p>`,
        `<p>Syllabus Foundation là nền của cả hệ thống ISTQB và áp dụng cho <strong>mọi cách làm phần mềm</strong> — Waterfall, Agile, DevOps, Continuous Delivery — và cho bất kỳ ai cần kiến thức thực hành về kiểm thử: tester, test analyst, test engineer, tư vấn, quản lý test, người làm UAT <em>và cả lập trình viên</em>. Nên SWT301 không chỉ dành cho bạn nào muốn làm tester.</p>`],
      [9, 'Business outcomes (1)',
        `<p>What a certified foundation tester can do for an employer: communicate with a common vocabulary; understand the fundamental concepts; understand how development practices and constraints change the testing approach; contribute effectively to reviews; use established techniques to design tests at all levels; interpret and execute tests from given specifications and report results.</p>`,
        `<p>Những gì một tester chuẩn Foundation làm được cho doanh nghiệp: giao tiếp bằng từ vựng chung; hiểu khái niệm nền tảng; hiểu cách thực hành phát triển và các ràng buộc làm thay đổi cách kiểm thử; đóng góp hiệu quả vào review; dùng kỹ thuật chuẩn để thiết kế test ở mọi cấp; đọc hiểu, thực thi test từ đặc tả có sẵn và báo cáo kết quả.</p>`],
      [10, 'Business outcomes (2)',
        `<p>…and: understand test-management principles (resources, strategies, planning, control, risk); write clear defect reports; understand the project factors that drive priorities and approach; understand the value testing brings to stakeholders; align testing work products with project objectives and targets; help select and implement testing tools. Each bullet maps to a chapter: management and defect reports → Ch.7, tools → Ch.8.</p>`,
        `<p>…và: hiểu nguyên tắc quản lý test (nguồn lực, chiến lược, kế hoạch, kiểm soát, rủi ro); viết defect report rõ ràng; hiểu các yếu tố dự án quyết định ưu tiên và cách tiếp cận; hiểu giá trị kiểm thử mang lại cho các bên; gắn sản phẩm kiểm thử với mục tiêu dự án; hỗ trợ chọn và triển khai công cụ test. Mỗi gạch đầu dòng gắn với một chương: quản lý và defect report → Ch.7, công cụ → Ch.8.</p>`],
      [11, 'Learning objectives — K-levels',
        `<p><strong>K1</strong> remember, recognise, recall (15 LOs) · <strong>K2</strong> understand, explain, give reasons, compare, classify, categorise, give examples, summarise (40 LOs) · <strong>K3</strong> apply, use (7 LOs) · <strong>K4</strong> analyse (none at Foundation 2018). Practical meaning: K1 questions are one-line definitions; K2 ask "which statement is correct / best describes"; K3 give a scenario and ask you to compute partitions, boundaries, a decision-table column, a state sequence, a schedule or to classify defects in a report.</p>`,
        `<p><strong>K1</strong> nhớ, nhận ra, gợi lại (15 LO) · <strong>K2</strong> hiểu, giải thích, nêu lý do, so sánh, phân loại, cho ví dụ, tóm tắt (40 LO) · <strong>K3</strong> áp dụng, sử dụng (7 LO) · <strong>K4</strong> phân tích (Foundation 2018 không có). Ý nghĩa thực tế: câu K1 là định nghĩa một dòng; câu K2 hỏi "phát biểu nào đúng / mô tả đúng nhất"; câu K3 cho tình huống và bắt bạn tính phân vùng, giá trị biên, một cột decision table, một chuỗi trạng thái, một lịch thực thi, hoặc phân loại lỗi trong một báo cáo.</p>`],
      [12, 'Learning objectives — Chapter 1',
        `<p>1.1 identify objectives of testing (K1), differentiate testing from debugging (K2) · 1.2 give examples why testing is necessary, relate testing to QA, distinguish error/defect/failure, root cause vs effects (all K2) · 1.3 explain the seven principles (K2) · 1.4 impact of context, activities and tasks, work products, traceability (K2) · 1.5 psychological factors (K1), tester vs developer mindset (K2). All of it is in Chapter 1 lessons 1.1–1.5.</p>`,
        `<p>1.1 nêu mục tiêu kiểm thử (K1), phân biệt testing với debugging (K2) · 1.2 ví dụ vì sao cần kiểm thử, quan hệ kiểm thử với QA, phân biệt error/defect/failure, nguyên nhân gốc với hậu quả (đều K2) · 1.3 giải thích bảy nguyên tắc (K2) · 1.4 ảnh hưởng của ngữ cảnh, hoạt động và công việc, sản phẩm, truy vết (K2) · 1.5 yếu tố tâm lý (K1), tư duy tester khác developer (K2). Tất cả nằm trong Chương 1, bài 1.1–1.5.</p>`],
      [13, 'Learning objectives — Chapter 2',
        `<p>2.1 relationships between development and test activities (K2), why lifecycle models must be adapted (K1), characteristics of good testing (K1) · 2.2 compare the test levels (K2) · 2.3 compare functional, non-functional and white-box testing (K2), they occur at any level (K1), confirmation vs regression (K2) · 2.4 triggers for maintenance testing and the role of impact analysis (K2). (The slide lists "impact analysis" twice as 2.4.2 and 2.4.3 — the syllabus has triggers 2.4.1 and impact analysis 2.4.2.)</p>`,
        `<p>2.1 quan hệ giữa hoạt động phát triển và kiểm thử (K2), vì sao mô hình vòng đời phải điều chỉnh (K1), đặc điểm của kiểm thử tốt (K1) · 2.2 so sánh các cấp test (K2) · 2.3 so sánh test chức năng, phi chức năng và white-box (K2), chúng có ở mọi cấp (K1), confirmation vs regression (K2) · 2.4 tác nhân kích hoạt kiểm thử bảo trì và vai trò của phân tích tác động (K2). (Slide ghi "impact analysis" hai lần ở 2.4.2 và 2.4.3 — syllabus thực tế: 2.4.1 là tác nhân, 2.4.2 là phân tích tác động.)</p>`],
      [14, 'Learning objectives — Chapter 3',
        `<p>3.1 work products that can be examined statically (K1), value of static testing (K2), static vs dynamic (K2) · 3.2 review-process activities (K2), roles in a formal review (K1), differences between informal review, walkthrough, technical review and inspection (K2), <strong>apply a review technique to a work product (K3)</strong>, success factors (K2). The K3 is exactly Lab 1 and PE Question 1.</p>`,
        `<p>3.1 sản phẩm có thể kiểm tra tĩnh (K1), giá trị của kiểm thử tĩnh (K2), tĩnh vs động (K2) · 3.2 các hoạt động của quy trình review (K2), vai trò trong review chính thức (K1), khác nhau giữa informal review, walkthrough, technical review và inspection (K2), <strong>áp dụng một kỹ thuật review lên sản phẩm (K3)</strong>, yếu tố thành công (K2). Mục K3 chính là Lab 1 và câu 1 đề PE.</p>`],
      [15, 'Learning objectives — Chapter 4',
        `<p>4.1 characteristics of black-box, white-box and experience-based techniques (K2) · 4.2 <strong>apply EP, BVA, decision tables and state transition (all K3)</strong>, explain use-case testing (K2) · 4.3 explain statement coverage, decision coverage and their value (K2) · 4.4 explain error guessing, exploratory and checklist-based testing (K2). Chapter 4 has the most questions (11/40) and all four K3s of the exam's hardest part — plus PE Q3.</p>`,
        `<p>4.1 đặc điểm của kỹ thuật black-box, white-box và dựa kinh nghiệm (K2) · 4.2 <strong>áp dụng EP, BVA, decision table và state transition (đều K3)</strong>, giải thích use-case testing (K2) · 4.3 giải thích statement coverage, decision coverage và giá trị của chúng (K2) · 4.4 giải thích error guessing, exploratory và checklist-based testing (K2). Chương 4 có nhiều câu nhất (11/40) và cả bốn câu K3 khó nhất của đề — cộng câu 3 đề PE.</p>`],
      [16, 'Learning objectives — Chapter 5 (1)',
        `<p>5.1 benefits and drawbacks of independent testing (K2), tasks of test manager and tester (K1) · 5.2 purpose and content of a test plan (K2), test approaches (K2), entry/exit criteria (K2), <strong>schedule test execution from priorities and dependencies (K3)</strong>, factors influencing effort (K1), metrics-based vs expert-based estimation (K2) · 5.3 metrics (K1), purpose, content and audiences of test reports (K2).</p>`,
        `<p>5.1 lợi ích và hạn chế của kiểm thử độc lập (K2), công việc của test manager và tester (K1) · 5.2 mục đích và nội dung test plan (K2), các cách tiếp cận test (K2), tiêu chí vào/ra (K2), <strong>xếp lịch thực thi test theo độ ưu tiên và phụ thuộc (K3)</strong>, các yếu tố ảnh hưởng công sức (K1), ước lượng dựa số liệu vs dựa chuyên gia (K2) · 5.3 các chỉ số (K1), mục đích, nội dung và người đọc của báo cáo test (K2).</p>`],
      [17, 'Learning objectives — Chapter 5 (2)',
        `<p>5.4 how configuration management supports testing (K2) · 5.5 risk level from likelihood and impact (K1), project vs product risk (K2), how product-risk analysis influences thoroughness and scope (K2) · 5.6 <strong>write a defect report (K3)</strong>. These are Chapter 7 on this site.</p>`,
        `<p>5.4 quản lý cấu hình hỗ trợ kiểm thử thế nào (K2) · 5.5 mức rủi ro từ khả năng xảy ra và mức tác động (K1), rủi ro dự án vs rủi ro sản phẩm (K2), phân tích rủi ro sản phẩm ảnh hưởng độ kỹ và phạm vi test (K2) · 5.6 <strong>viết defect report (K3)</strong>. Trên trang này là Chương 7.</p>`],
      [18, 'Learning objectives — Chapter 6',
        `<p>6.1 classify test tools by purpose and supported activities (K2), benefits and risks of automation (K1), special considerations for execution and management tools (K1) · 6.2 main principles for selecting a tool (K1), objectives of a pilot project (K1), success factors (K1). (The slide heads 6.2 "Test Planning and Estimation (K3)" — a copy-paste slip; the section is "Effective use of tools".) Chapter 8 on this site.</p>`,
        `<p>6.1 phân loại công cụ theo mục đích và hoạt động hỗ trợ (K2), lợi ích và rủi ro của tự động hoá (K1), lưu ý riêng với công cụ thực thi và quản lý test (K1) · 6.2 nguyên tắc chính khi chọn công cụ (K1), mục tiêu của dự án thí điểm (K1), yếu tố thành công (K1). (Slide đặt tiêu đề 6.2 là "Test Planning and Estimation (K3)" — dán nhầm; mục đúng là "Effective use of tools".) Trên trang này là Chương 8.</p>`],
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
  description: 'SWT0 slide 5–7, 19–21 và Additional Content slide 1, 2, 5: cấu trúc đề CTFL (40 câu, 26 đạt, K1/K2/K3, số câu mỗi chương), 13 mẹo làm trắc nghiệm có ví dụ, và chiến lược cho đề FE của trường.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.5 · SWT0 slides 5–7, 19–21 · Additional Content slides 1, 2, 5</span>
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
    `<span class="eyebrow">Mục 0 · Bài 0.5 · SWT0 slide 5–7, 19–21 · Additional Content slide 1, 2, 5</span>
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
        `<p>The blueprint table: K1 8 questions × 1 min = 8 min; K2 24 × 1 min = 24; K3 8 × 3 min = 24; K4 0; total 40 questions, about 56 minutes of "question time". Lesson: K3 questions are worth the same one mark but take three times longer — do the quick K1/K2 ones first and come back.</p>`,
        `<p>Bảng thiết kế đề: K1 8 câu × 1 phút = 8 phút; K2 24 × 1 = 24; K3 8 × 3 phút = 24; K4 0; tổng 40 câu, khoảng 56 phút "thời gian làm câu". Bài học: câu K3 cũng chỉ một điểm nhưng tốn thời gian gấp ba — làm các câu K1/K2 nhanh trước rồi quay lại.</p>`],
      [6, 'Preparing for the exam — rules',
        `<p>40 single-choice questions from K1 to K4, pass mark 26/40 (65%): 8 × K1, 24 × K2, 8 × K3/K4; 75 minutes for non-native speakers; the certificate shows no score and <strong>never expires</strong>.</p>`,
        `<p>40 câu một đáp án từ K1 tới K4, điểm đạt 26/40 (65%): 8 câu K1, 24 câu K2, 8 câu K3/K4; 75 phút cho người không bản ngữ; chứng chỉ không ghi điểm và <strong>không hết hạn</strong>.</p>`],
      [7, 'Preparing for the exam — questions per chapter',
        `<p>C1 8 · C2 5 · C3 5 · C4 11 · C5 9 · C6 2 = 40. Chapters 1, 4 and 5 give 28 of 40 marks: on this site that is Chapter 1, Chapters 4–6 and Chapter 7 — spend your revision time there.</p>`,
        `<p>C1 8 · C2 5 · C3 5 · C4 11 · C5 9 · C6 2 = 40. Chương 1, 4 và 5 chiếm 28/40 điểm: trên trang này là Chương 1, Chương 4–6 và Chương 7 — dồn thời gian ôn vào đó.</p>`],
    ]),
    walkHead('swt0', 19, 21, 'The thirteen tips, each with a concrete example.', 'Mười ba mẹo, mỗi mẹo kèm một ví dụ cụ thể.'),
    walk('swt0', [
      [19, 'Taking the exam — tips 1–7',
        `<ol><li><b>Read the entire question</b> — "Which is NOT…", "BEST", "MOST likely" change the answer.</li><li><b>Answer it in your mind first</b>, then look for your answer among the options.</li><li><b>Eliminate wrong answers</b> — "testing proves there are no defects" is always wrong.</li><li><b>Use the process of elimination</b> until one remains.</li><li><b>Select the best answer</b> — two can be true; one fits the syllabus wording.</li><li><b>Read every option</b>, even if A looks right.</li><li><b>Answer the ones you know first</b>; flag the rest.</li></ol>`,
        `<ol><li><b>Đọc hết câu hỏi</b> — "Which is NOT…", "BEST", "MOST likely" làm đáp án đổi hẳn.</li><li><b>Tự trả lời trong đầu trước</b>, rồi mới tìm đáp án đó trong các phương án.</li><li><b>Loại phương án sai</b> — "kiểm thử chứng minh không còn lỗi" luôn sai.</li><li><b>Loại trừ dần</b> cho tới khi còn một.</li><li><b>Chọn đáp án đúng nhất</b> — có thể hai cái đều đúng; một cái khớp câu chữ syllabus.</li><li><b>Đọc mọi phương án</b>, kể cả khi A trông đúng.</li><li><b>Làm câu chắc trước</b>; đánh dấu câu còn lại.</li></ol>`],
      [20, 'Taking the exam — tips 8–13',
        `<ol start="8"><li><b>Make an educated guess</b> — no negative marking, so never leave a blank.</li><li><b>Stick with your first choice</b> unless you find a concrete reason to change.</li><li><b>"All/None of the above"</b> — check each option; if two are clearly true, "all" is likely.</li><li><b>When two answers seem correct</b>, prefer the one with the syllabus's exact term (e.g. "confirmation testing" over "retesting after a fix").</li><li><b>Bet on the positive option</b> — syllabus statements are usually positive; negatively phrased options are more often distractors.</li><li><b>The more information… the better</b> — a longer, more precise option is often the correct one (qualified statements like "may", "typically" match the syllabus tone).</li></ol>`,
        `<ol start="8"><li><b>Đoán có cơ sở</b> — không trừ điểm câu sai, nên đừng bao giờ bỏ trống.</li><li><b>Giữ lựa chọn đầu tiên</b> trừ khi tìm được lý do cụ thể để đổi.</li><li><b>"Tất cả/Không có đáp án nào đúng"</b> — kiểm từng phương án; nếu hai cái chắc chắn đúng thì "tất cả" có khả năng cao.</li><li><b>Khi hai đáp án cùng đúng</b>, chọn cái dùng đúng thuật ngữ của syllabus (vd "confirmation testing" thay vì "test lại sau khi sửa").</li><li><b>Ưu tiên phương án khẳng định</b> — câu trong syllabus thường khẳng định; phương án phủ định hay là nhiễu.</li><li><b>Càng nhiều thông tin càng tốt</b> — phương án dài, chính xác hơn thường đúng (các câu có "may", "typically" khớp giọng văn syllabus).</li></ol>`],
      [21, 'Summary', `<p>Two things: prepare (know the blueprint, practise with past papers) and take the exam (technique above).</p>`, `<p>Hai việc: chuẩn bị (nắm bản thiết kế đề, luyện đề cũ) và làm bài (kỹ thuật ở trên).</p>`],
    ]),
    walkHead('addl', 1, 5, 'Only slides 1, 2 and 5 of this external deck are shown: 3–4 are memes and 6–17 are an Egyptian registration FAQ and a trainer\'s personal contacts. Slides 18–26 are in lesson 1.4.', 'Chỉ hiện slide 1, 2 và 5 của bộ slide bên ngoài này: 3–4 là ảnh vui, 6–17 là hỏi đáp đăng ký thi ở Ai Cập và thông tin liên lạc cá nhân của một giảng viên. Slide 18–26 nằm ở bài 1.4.'),
    walk('addl', [
      [1, 'International Software Testing Qualifications Board',
        `<p>ISTQB facts (2018): a not-for-profit association registered in Belgium, run by volunteers — hundreds of international testing experts; more than 800,000 exams taken worldwide; more than 15 certificates at different levels. (Today the numbers are higher: over a million certifications.)</p>`,
        `<p>Vài con số về ISTQB (năm 2018): hiệp hội phi lợi nhuận đăng ký tại Bỉ, vận hành bởi tình nguyện viên — hàng trăm chuyên gia kiểm thử quốc tế; hơn 800.000 lượt thi trên thế giới; hơn 15 chứng chỉ ở các cấp. (Hiện nay con số đã vượt một triệu chứng chỉ.)</p>`],
      [2, 'A national board: how many hold each certificate',
        `<p>The Egyptian board's counts at the time: CTFL 3208 · CTFL-Agile Tester 631 · CTAL-Test Manager 37 · CTAL-Technical Test Analyst 23 · CTAL-Test Automation Engineer 6 · CTAL-Security 2. The shape is universal: Foundation is by far the most common, Agile Tester second — which is exactly why SWT301 covers both.</p>`,
        `<p>Số người có từng chứng chỉ ở board Ai Cập lúc đó: CTFL 3208 · CTFL-Agile Tester 631 · CTAL-Test Manager 37 · CTAL-Technical Test Analyst 23 · CTAL-Test Automation Engineer 6 · CTAL-Security 2. Hình dạng này nơi nào cũng giống: Foundation phổ biến nhất, Agile Tester đứng thứ hai — đó cũng là lý do SWT301 dạy cả hai.</p>`],
      [5, 'Must / should / could / won\'t have',
        `<p>A MoSCoW view of certificates for a junior tester: <b>Must</b> have ISTQB Foundation · <b>Should</b> have ISTQB Agile Tester · <b>Could</b> have a specialist one (mobile, performance, usability) · <b>Won't</b> have yet — Test Manager, Test Analyst, Technical Test Analyst, Security Tester, Test Automation Engineer (those need experience first). Note that MoSCoW itself is a prioritisation technique you will meet again for requirements and risk.</p>`,
        `<p>Góc nhìn MoSCoW về chứng chỉ cho tester mới vào nghề: <b>Must</b> — ISTQB Foundation · <b>Should</b> — ISTQB Agile Tester · <b>Could</b> — một chứng chỉ chuyên sâu (mobile, performance, usability) · <b>Won't</b> (chưa cần) — Test Manager, Test Analyst, Technical Test Analyst, Security Tester, Test Automation Engineer (cần kinh nghiệm trước). MoSCoW cũng là một kỹ thuật ưu tiên bạn sẽ gặp lại khi làm yêu cầu và rủi ro.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — using the tips on a real FE question</h3>
<p><b>Q.</b> "Which of the following will be the best definition for Testing?" (FE paper 1, question 1) — a) the purpose is to demonstrate that the program works · b) the purpose is to demonstrate that the program is defect free · c) the purpose is to demonstrate that the program does what it is supposed to do · d) testing is executing software for the purpose of finding defects.</p>
<ol><li>Tip 3 — eliminate b (Principle 1: no test proves "defect free").</li><li>Tips 5 and 11 — a and c describe showing it works (the "traditional approach" of SWT1 slide 106); d matches the "better approach" (slide 107: the goal is to find faults).</li><li>Answer <b>d</b>. (With the full 2018 definition, a stricter paper might prefer an option mentioning static testing too — read all options.)</li></ol>
<div class="pitfall"><b>Absolute words are red flags.</b> "always", "never", "all", "prove", "guarantee", "completely" are usually wrong in testing questions — the syllabus speaks in "may", "can", "typically".</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>CTFL v4.0 (2023).</b> ISTQB released a new Foundation syllabus in 2023: the seven principles are reworded, test management is reorganised, and new topics appear (DevOps, shift-left, the whole-team approach, collaboration-based test approaches, ATDD). Your slides follow v3.1 (2018), which is what the FE uses; if you later sit the real certificate, check which version your exam provider uses. <em>Outside the syllabus because the course is built on the 2018 edition.</em></div>`,
    `<h3>Ví dụ có lời giải · Dùng các mẹo trên một câu FE thật</h3>
<p><b>Câu hỏi.</b> "Which of the following will be the best definition for Testing?" (đề FE số 1, câu 1) — a) mục đích là chứng minh chương trình chạy được · b) mục đích là chứng minh chương trình không có lỗi · c) mục đích là chứng minh chương trình làm đúng việc phải làm · d) kiểm thử là thực thi phần mềm nhằm tìm ra lỗi.</p>
<ol><li>Mẹo 3 — loại b (Nguyên tắc 1: không test nào chứng minh được "không có lỗi").</li><li>Mẹo 5 và 11 — a và c là "chứng minh nó chạy" (cách tiếp cận truyền thống ở slide 106 SWT1); d khớp "cách tiếp cận tốt hơn" (slide 107: mục tiêu là tìm lỗi).</li><li>Đáp án <b>d</b>. (Với định nghĩa đầy đủ năm 2018, một đề khắt khe hơn có thể ưu tiên phương án nhắc cả kiểm thử tĩnh — hãy đọc mọi phương án.)</li></ol>
<div class="pitfall"><b>Từ tuyệt đối là cờ đỏ.</b> "always", "never", "all", "prove", "guarantee", "completely" thường sai trong câu hỏi kiểm thử — syllabus nói bằng "may", "can", "typically".</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>CTFL v4.0 (2023).</b> ISTQB ra syllabus Foundation mới năm 2023: bảy nguyên tắc được viết lại, phần quản lý test sắp xếp lại, và có chủ đề mới (DevOps, shift-left, cách làm cả-nhóm, cách tiếp cận dựa trên cộng tác, ATDD). Slide của lớp theo v3.1 (2018) — đúng bản đề FE dùng; nếu sau này thi chứng chỉ thật, hãy hỏi đơn vị tổ chức thi dùng phiên bản nào. <em>Ngoài giáo trình vì khoá học xây trên bản 2018.</em></div>`),
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
<div class="callout ok"><b>How to read for the exam.</b> Read the lesson here first (it tells you what matters), then the matching book section, then do the book's <em>sample exam questions</em> for that chapter and check the answers at the back. Two weeks before the FE, sit the 40-question mock exam in Chapter 7 of the main textbook under exam conditions (60 minutes).</div>
<p><small>The books are copyrighted and are provided by the course for your personal study; this site does not republish their pages — it only points you to the right ones.</small></p>`,
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
<div class="callout ok"><b>Cách đọc để ôn thi.</b> Đọc bài trên trang trước (nó chỉ ra điều quan trọng), rồi đọc đúng mục trong sách, rồi làm <em>câu hỏi mẫu</em> của chương đó trong sách và dò đáp án ở cuối sách. Hai tuần trước FE, làm đề thử 40 câu ở Chương 7 giáo trình chính trong điều kiện như thi thật (60 phút).</div>
<p><small>Các cuốn sách có bản quyền và được môn học cung cấp để bạn tự học; trang này không đăng lại nội dung sách — chỉ chỉ đường tới đúng trang.</small></p>`),
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
<li><b>Read the opening box</b> — learning objectives and the one-screen summary. Know what you are looking for.</li>
<li><b>Go through the slides</b> in order. For each <em>Question</em> slide, cover the answer, decide yourself, then read the explanation.</li>
<li><b>Redo the worked example</b> on paper without looking. For Chapters 4–5 this is exactly PE practice.</li>
<li><b>Read the pitfall and the ★ box</b> — the pitfall is what the exam tests; the ★ box is what interviews test.</li>
<li><b>Read the book pages</b> listed at the end (at least the main textbook).</li>
<li><b>Take the chapter quiz</b> — aim for ≥ 80%; every wrong answer sends you back to one slide.</li>
</ol>
<h3>A 10-week plan (60 sessions)</h3>
<table>
<thead><tr><th>Week</th><th>Study</th><th>Check</th></tr></thead>
<tbody>${planRows}</tbody>
</table>
<div class="callout"><b>Use the Exam room.</b> The site's Exam room already holds <strong>22 real FE papers</strong> (SWT301-FE1 … FE24), <strong>22 real PE papers</strong> with AI-marked write-in answers, and <strong>2 Progress Test 3 papers</strong>. Start doing FE papers from week 7 — one every few days, timed.</div>
<p class="di-toi"><a href="/exam?course=SWT301">📝 Open the Exam room (SWT301) →</a></p>`,
    `<span class="eyebrow">Mục 0 · Bài 0.7</span>
<h2>Học với khoá học này như thế nào</h2>
<h3>Sáu bước cho mỗi bài</h3>
<ol>
<li><b>Đọc khung mở đầu</b> — chuẩn đầu ra và bảng tóm tắt một màn hình. Biết mình đang tìm gì.</li>
<li><b>Đi qua các slide</b> theo thứ tự. Gặp slide <em>Question</em> thì che đáp án, tự quyết định, rồi mới đọc giải thích.</li>
<li><b>Làm lại ví dụ có lời giải</b> ra giấy mà không nhìn. Ở Chương 4–5, đây chính là luyện PE.</li>
<li><b>Đọc khung bẫy và khung ★</b> — bẫy là thứ đề thi hỏi; khung ★ là thứ phỏng vấn hỏi.</li>
<li><b>Đọc các trang sách</b> ghi ở cuối bài (ít nhất là giáo trình chính).</li>
<li><b>Làm quiz của chương</b> — đặt mục tiêu ≥ 80%; mỗi câu sai đưa bạn quay về đúng một slide.</li>
</ol>
<h3>Kế hoạch 10 tuần (60 buổi)</h3>
<table>
<thead><tr><th>Tuần</th><th>Học</th><th>Kiểm tra</th></tr></thead>
<tbody>${planRows}</tbody>
</table>
<div class="callout"><b>Dùng Phòng thi.</b> Phòng thi của web đã có <strong>22 đề FE thật</strong> (SWT301-FE1 … FE24), <strong>22 đề PE thật</strong> chấm bài viết bằng AI, và <strong>2 đề Progress Test 3</strong>. Bắt đầu làm đề FE từ tuần 7 — vài ngày một đề, bấm giờ.</div>
<p class="di-toi"><a href="/exam?course=SWT301">📝 Mở Phòng thi (SWT301) →</a></p>`),
  ].join('\n'),
};

export default {
  title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
  description: 'Đọc trước tiên: môn học & ISTQB, điều kiện qua môn, CLO và learning objective, cấu trúc đề & mẹo trắc nghiệm, bản đồ mọi file trong thư mục môn, sáu cuốn sách, kế hoạch 10 tuần.',
  lessons: [L01, L02, L03, L04, L05, L06, L07],
};
