/**
 * SWT301 — Software Testing (Kiểm thử phần mềm). Kỳ 5.
 * Bám syllabus FPTU (sylID 14178, 10 CLO, 60 buổi) — sách "Foundations of Software Testing:
 * ISTQB Certification" + "Agile Testing" (Crispin & Gregory). Tiên quyết: SWE201c.
 * Song ngữ EN/VN, sâu. Mỗi bài có "Ví dụ có lời giải" + khối ★ Beyond the syllabus.
 * Grading: Lab 25% + Presentation 10% + Progress Test 15% + Final 50% (PE 25% + TE 25%).
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SWT301.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    academyType: 'FPT',
    courseCode: 'SWT301',
    slug: 'software-testing',
    title: 'Software Testing',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'How professionals prove software works: the 7 testing principles, test levels, static review, black-box & white-box design, cyclomatic complexity, JUnit & Selenium automation, and risk-based Agile testing.|||Cách dân chuyên nghiệp chứng minh phần mềm chạy đúng: 7 nguyên tắc kiểm thử, các cấp kiểm thử, static review, thiết kế black-box & white-box, độ phức tạp chu trình, tự động hoá JUnit & Selenium, và kiểm thử Agile theo rủi ro.',
    description: 'Môn kiểm thử phần mềm chuyên sâu theo chuẩn ISTQB Foundation. Học nguyên lý và mục tiêu của kiểm thử; cách tích hợp kiểm thử vào vòng đời phát triển (test levels, test types, maintenance testing); static testing (review, walkthrough, inspection); các kỹ thuật thiết kế test black-box (functional), white-box (structural) và experience-based; các hoạt động quản lý test (lập kế hoạch, ước lượng, giám sát, quản lý rủi ro, báo lỗi, quy trình xử lý defect); công cụ và tự động hoá kiểm thử; và Agile testing. Chương nâng cao: mutation testing/độ hiệu quả bộ test và property-based/AI-assisted testing. Tiên quyết: SWE201c.',
    whatYouLearn: '7 nguyên tắc kiểm thử và phân biệt error/defect/failure; quy trình test cơ bản; các cấp kiểm thử (unit, integration, system, acceptance) và test types; static testing và các loại review; thiết kế test black-box (equivalence partitioning, boundary value analysis, decision table, state transition) và white-box (statement/branch/path coverage, cyclomatic complexity V(G)); experience-based testing (error guessing, exploratory); lập test plan và risk-based testing, bug lifecycle & bug logging; JUnit, Selenium, test pyramid và CI; Agile testing (quadrants, TDD/BDD, continuous testing); mutation testing, flaky tests và property-based testing.',
    requirements: 'Tiên quyết: đạt SWE201c (hoặc SWE102/SWE202c) — hiểu SDLC và quy trình phần mềm. Cần biết lập trình Java cơ bản (PRO192) để làm phần JUnit. Cần máy tính cài được IDE (IntelliJ/Eclipse/VS Code), JUnit và một trình duyệt để chạy Selenium.',
    documentsNote: 'Giáo trình chính: "Foundations of Software Testing: ISTQB Certification" (Graham, Black, van Veenendaal) • "Agile Testing: A Practical Guide for Testers and Agile Teams" (Lisa Crispin & Janet Gregory). Tham khảo: "Computer Software Validation" (Alan Muirhead) • "Software Testing and Quality Assurance" (Jeff Tian). Công cụ: JUnit, Selenium, SonarQube (static analysis), Jira/Bugzilla (bug tracking), IDE, AI Tools (ChatGPT/Gemini/Grok/DeepSeek). Kèm file syllabus gốc SWT301.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: kiểm thử là gì, học ra sao, điều kiện qua môn, lộ trình và tài liệu.',
      lessons: [
        {
          title: '0.1 — About SWT301 & the course map|||0.1 — Giới thiệu môn SWT301 & bản đồ môn học',
          slug: 'swt301-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Kiểm thử là gì, vì sao mọi kỹ sư phần mềm phải biết test, và lộ trình static → dynamic → levels → automation → agile.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About SWT301 — Software Testing</h2>
<p class="lead">In SWE201c you learned how software is <em>built</em> as a team. SWT301 teaches how to <strong>prove it works</strong> — and, just as important, how to <strong>find where it doesn't</strong> before your users do. Testing is not "clicking around to see if it breaks"; it is a disciplined engineering activity with its own principles, techniques and measurable coverage.</p>
<p>This course follows the <strong>ISTQB Foundation</strong> syllabus — an international standard recognised by employers worldwide. Passing SWT301 well means you speak the shared vocabulary of every QA team: <em>defect, test case, coverage, regression, test level, risk-based testing</em>.</p>
<h3>By the end of this course you will be able to</h3>
<ul>
  <li>Explain the <strong>7 principles of testing</strong> and why exhaustive testing is impossible.</li>
  <li>Distinguish an <strong>error → defect → failure</strong> and describe the fundamental test process.</li>
  <li>Design test cases with black-box techniques (<strong>equivalence partitioning, boundary value analysis, decision tables, state transition</strong>) and white-box techniques (<strong>statement/branch/path coverage</strong>).</li>
  <li>Compute <strong>cyclomatic complexity</strong> from a control-flow graph and use it to plan tests.</li>
  <li>Write automated unit tests with <strong>JUnit</strong> and UI tests with <strong>Selenium</strong>, and place them correctly on the <strong>test pyramid</strong>.</li>
  <li>Write a <strong>test plan</strong>, prioritise by <strong>risk</strong>, and log a defect that a developer can actually reproduce.</li>
  <li>Test inside an <strong>Agile</strong> team using the testing quadrants, TDD and BDD.</li>
</ul>
<h3>Course map — the testing journey</h3>
<p>All 60 university sessions are grouped into the roadmap below. It moves from <strong>static</strong> testing (finding defects without running code) to <strong>dynamic</strong> testing (running code), then organises tests by <strong>level</strong>, adds <strong>automation</strong>, and finishes with <strong>Agile</strong> testing. Study in order.</p>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Fundamentals of testing</div><div class="lz-nsub">7 principles · error/defect/failure · test process</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Testing throughout the SDLC</div><div class="lz-nsub">Test levels &amp; test types · V-model</div></div></div>
  <div class="lz-stage">Static testing</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Static testing</div><div class="lz-nsub">Reviews · walkthrough · inspection · static analysis</div></div></div>
  <div class="lz-stage">Dynamic — test design</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Black-box techniques</div><div class="lz-nsub">EP · BVA · decision tables · state transition</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">White-box techniques</div><div class="lz-nsub">statement/branch/path coverage · cyclomatic complexity</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Experience-based</div><div class="lz-nsub">error guessing · exploratory testing</div></div></div>
  <div class="lz-stage">Managing &amp; automating</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Test management</div><div class="lz-nsub">test plan · risk-based testing · bug lifecycle</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Test tools &amp; automation</div><div class="lz-nsub">JUnit · Selenium · test pyramid · CI</div></div></div>
  <div class="lz-stage">Agile</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Agile testing</div><div class="lz-nsub">quadrants · TDD/BDD · continuous testing</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Mutation testing · property-based &amp; AI-assisted testing</div><div class="lz-nsub">How good is your test suite, really?</div></div></div>
</div>
<div class="callout ok">The most effective way to study this course: <strong>design test cases for real code and run them</strong>. Don't just read about equivalence partitioning — take a function, split its inputs, write the JUnit tests, watch one fail, fix it. Testing is a hands-on skill.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up your testing toolkit — JUnit, Selenium, SonarQube</span><span class="lc-sub">Install &amp; configure guides for the tools used in this course — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu môn SWT301 — Kiểm thử phần mềm</h2>
<p class="lead">Ở SWE201c bạn học cách một đội <em>xây</em> phần mềm. SWT301 dạy cách <strong>chứng minh nó chạy đúng</strong> — và quan trọng không kém, cách <strong>tìm ra chỗ nó sai</strong> trước khi người dùng gặp phải. Kiểm thử không phải "bấm loạn xem có vỡ không"; đó là một hoạt động kỹ thuật có kỷ luật, với nguyên tắc, kỹ thuật và độ bao phủ đo được riêng.</p>
<p>Môn học bám chuẩn <strong>ISTQB Foundation</strong> — tiêu chuẩn quốc tế được nhà tuyển dụng khắp nơi công nhận. Học tốt SWT301 nghĩa là bạn nói được thứ ngôn ngữ chung của mọi đội QA: <em>defect, test case, coverage, regression, test level, risk-based testing</em>.</p>
<h3>Học xong môn này bạn sẽ làm được</h3>
<ul>
  <li>Giải thích <strong>7 nguyên tắc kiểm thử</strong> và vì sao không thể test vét cạn (exhaustive).</li>
  <li>Phân biệt <strong>error → defect → failure</strong> và mô tả quy trình test cơ bản.</li>
  <li>Thiết kế test case bằng kỹ thuật black-box (<strong>equivalence partitioning, boundary value analysis, decision table, state transition</strong>) và white-box (<strong>statement/branch/path coverage</strong>).</li>
  <li>Tính <strong>độ phức tạp chu trình (cyclomatic complexity)</strong> từ đồ thị luồng điều khiển và dùng nó để lập kế hoạch test.</li>
  <li>Viết unit test tự động với <strong>JUnit</strong> và UI test với <strong>Selenium</strong>, đặt chúng đúng chỗ trên <strong>test pyramid</strong>.</li>
  <li>Viết <strong>test plan</strong>, ưu tiên theo <strong>rủi ro (risk)</strong>, và log một defect mà lập trình viên tái hiện được.</li>
  <li>Kiểm thử trong đội <strong>Agile</strong> bằng testing quadrants, TDD và BDD.</li>
</ul>
<h3>Bản đồ môn học — hành trình kiểm thử</h3>
<p>Toàn bộ 60 buổi được gom thành lộ trình bên dưới. Nó đi từ kiểm thử <strong>tĩnh (static)</strong> — tìm lỗi mà không chạy code — đến kiểm thử <strong>động (dynamic)</strong> — chạy code, rồi tổ chức test theo <strong>cấp (level)</strong>, thêm <strong>tự động hoá (automation)</strong>, và kết thúc bằng <strong>Agile</strong> testing. Học tuần tự.</p>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nền tảng kiểm thử</div><div class="lz-nsub">7 nguyên tắc · error/defect/failure · quy trình test</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử xuyên suốt SDLC</div><div class="lz-nsub">Test levels &amp; test types · mô hình V</div></div></div>
  <div class="lz-stage">Kiểm thử tĩnh</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Static testing</div><div class="lz-nsub">review · walkthrough · inspection · static analysis</div></div></div>
  <div class="lz-stage">Động — thiết kế test</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Kỹ thuật black-box</div><div class="lz-nsub">EP · BVA · decision table · state transition</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Kỹ thuật white-box</div><div class="lz-nsub">statement/branch/path coverage · cyclomatic complexity</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Experience-based</div><div class="lz-nsub">error guessing · exploratory testing</div></div></div>
  <div class="lz-stage">Quản lý &amp; tự động hoá</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý test</div><div class="lz-nsub">test plan · risk-based testing · bug lifecycle</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Công cụ &amp; tự động hoá</div><div class="lz-nsub">JUnit · Selenium · test pyramid · CI</div></div></div>
  <div class="lz-stage">Agile</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Agile testing</div><div class="lz-nsub">quadrants · TDD/BDD · continuous testing</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Mutation testing · property-based &amp; AI-assisted testing</div><div class="lz-nsub">Bộ test của bạn thực sự tốt đến đâu?</div></div></div>
</div>
<div class="callout ok">Cách học hiệu quả nhất môn này: <strong>thiết kế test case cho code thật và chạy chúng</strong>. Đừng chỉ đọc về equivalence partitioning — lấy một hàm, chia miền input, viết JUnit test, xem một cái fail, rồi sửa. Kiểm thử là kỹ năng thực hành.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài bộ công cụ kiểm thử — JUnit, Selenium, SonarQube</span><span class="lc-sub">Hướng dẫn cài &amp; cấu hình các công cụ dùng trong môn — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'swt301-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm (Lab, Presentation, Progress Test, Final).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">Know the rules before the match. The information below comes straight from the university's official syllabus (Decision 377/QĐ-ĐHFPT, 04/09/2026).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class (60 sessions) + exam + ~103h self-study</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 sessions <small>45 min each</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">SWE102 / SWE201c / SWE202c</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Lab (×4)</td><td>25%</td><td>On-going labs — unit test framework, static analysis, test design, test plan (CLO2–9)</td></tr>
    <tr><td>Presentation</td><td>10%</td><td>Individual presentation &amp; mark (CLO10) — ~10 min each</td></tr>
    <tr><td>Progress Test (×3)</td><td>15%</td><td>3 mid-course tests, ~30 min each (CLO1–7)</td></tr>
    <tr><td>Final — Practical Exam</td><td>25%</td><td>Hands-on, 85 min (CLO2–8), must be ≥ 4.0</td></tr>
    <tr><td>Final — Theory Exam</td><td>25%</td><td>Multiple choice, 60 min (CLO1–9), must be ≥ 4.0</td></tr>
  </tbody>
</table>
<p>The two Final components together are the "Final exam" worth <strong>50%</strong>; Lab + Presentation + Progress Test make up the other 50%.</p>
<div class="callout warn">Three <strong>hard blockers</strong> even with high coursework: (1) missing more than 20% of sessions = <strong>barred from the exam</strong>; (2) the <strong>Practical Exam must be ≥ 4.0</strong>; (3) the <strong>Theory Exam must be ≥ 4.0</strong>. Special rule: if 4 ≤ TE &lt; 5 AND 4 ≤ PE &lt; 5 AND final result &lt; 5, the student may choose a re-take path per the lecturer.</div>
<div class="note-ct">The two Finals (50% combined) are taken live — a practical hands-on exam plus a theory MCQ. Rote learning fails the practical. The safe strategy: do every Lab, design real test cases, and practise JUnit on CodeLab so your hands are fast on exam day.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Nắm luật chơi trước khi vào trận. Thông tin dưới đây lấy thẳng từ syllabus chính thức (Quyết định 377/QĐ-ĐHFPT, 04/09/2026).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp (60 buổi) + thi + ~103h tự học</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 buổi <small>45 phút/buổi</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">SWE102 / SWE201c / SWE202c</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi TB ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Lab (×4)</td><td>25%</td><td>Lab suốt kỳ — unit test framework, static analysis, thiết kế test, test plan (CLO2–9)</td></tr>
    <tr><td>Presentation</td><td>10%</td><td>Thuyết trình cá nhân &amp; chấm (CLO10) — ~10 phút/người</td></tr>
    <tr><td>Progress Test (×3)</td><td>15%</td><td>3 bài kiểm tra giữa chặng, ~30 phút/bài (CLO1–7)</td></tr>
    <tr><td>Final — Practical Exam</td><td>25%</td><td>Thi thực hành, 85 phút (CLO2–8), phải ≥ 4.0</td></tr>
    <tr><td>Final — Theory Exam</td><td>25%</td><td>Trắc nghiệm, 60 phút (CLO1–9), phải ≥ 4.0</td></tr>
  </tbody>
</table>
<p>Hai cột Final cộng lại là "Final exam" trọng số <strong>50%</strong>; Lab + Presentation + Progress Test là 50% còn lại.</p>
<div class="callout warn">Ba điều kiện <strong>chặn cứng</strong> dù điểm quá trình cao: (1) vắng quá 20% buổi = <strong>cấm thi</strong>; (2) <strong>Practical Exam phải ≥ 4.0</strong>; (3) <strong>Theory Exam phải ≥ 4.0</strong>. Luật đặc biệt: nếu 4 ≤ TE &lt; 5 VÀ 4 ≤ PE &lt; 5 VÀ điểm tổng &lt; 5, sinh viên có thể chọn hướng thi lại theo hướng dẫn giảng viên.</div>
<div class="note-ct">Hai cột Final (gộp 50%) thi trực tiếp — một bài thực hành trên máy cộng một bài lý thuyết trắc nghiệm. Học vẹt sẽ rớt phần thực hành. Cách ăn chắc: làm hết Lab, thiết kế test case thật, và luyện JUnit trên CodeLab để tay quen khi thi.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning Outcomes (CLOs) & roadmap|||0.3 — Chuẩn đầu ra (CLO) & lộ trình',
          slug: 'swt301-chuan-dau-ra',
          type: 'VIDEO',
          description: '10 chuẩn đầu ra của môn và cách chúng gom vào từng chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>10 course learning outcomes (CLOs) &amp; roadmap</h2>
<p class="lead">A "Course Learning Outcome" (CLO) is what you <strong>must be able to do</strong> after the course. The exams follow these CLOs closely — knowing the CLO map tells you exactly what you'll be tested on.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Know definitions, concepts &amp; terminology of testing; use AI to explore principles</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Understand the test process; distinguish test levels (unit/integration/system/acceptance)</td><td>2</td></tr>
    <tr><td>CLO3</td><td>Use static testing techniques to detect errors via review</td><td>3</td></tr>
    <tr><td>CLO4</td><td>Use dynamic techniques — black-box, white-box, experience-based — to design test cases</td><td>4–6</td></tr>
    <tr><td>CLO5</td><td>Develop a comprehensive test plan, defining scope, goals, resources</td><td>7</td></tr>
    <tr><td>CLO6</td><td>Analyse &amp; prioritise risks; apply bug logging &amp; the bug lifecycle</td><td>7</td></tr>
    <tr><td>CLO7</td><td>Classify &amp; select testing tools; evaluate benefits/risks of automation</td><td>8</td></tr>
    <tr><td>CLO8</td><td>Understand &amp; apply Agile testing methods</td><td>9</td></tr>
    <tr><td>CLO9</td><td>Use AI tools to support learning &amp; exercises</td><td>all</td></tr>
    <tr><td>CLO10</td><td>Demonstrate presentation skills &amp; teamwork</td><td>Presentation</td></tr>
  </tbody>
</table>
<div class="callout">Self-check questions from the university — answer them at the start: How would you explain "testing" to a non-developer? How does testing build trust for end-users? Why is defect clustering common? How does a tester's mindset differ from a developer's? These are the exact "constructive questions" your lecturer will ask in class.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>10 chuẩn đầu ra (CLO) &amp; lộ trình</h2>
<p class="lead">"Chuẩn đầu ra" (Course Learning Outcome) là những gì bạn <strong>phải làm được</strong> sau môn. Đề thi bám sát các CLO này — nắm bản đồ CLO là biết mình sẽ bị hỏi gì.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ làm được</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Nắm định nghĩa, khái niệm &amp; thuật ngữ kiểm thử; dùng AI để khám phá nguyên lý</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Hiểu quy trình test; phân biệt các cấp test (unit/integration/system/acceptance)</td><td>2</td></tr>
    <tr><td>CLO3</td><td>Dùng static testing để phát hiện lỗi qua review</td><td>3</td></tr>
    <tr><td>CLO4</td><td>Dùng kỹ thuật động — black-box, white-box, experience-based — để thiết kế test case</td><td>4–6</td></tr>
    <tr><td>CLO5</td><td>Xây test plan đầy đủ, xác định phạm vi, mục tiêu, nguồn lực</td><td>7</td></tr>
    <tr><td>CLO6</td><td>Phân tích &amp; ưu tiên rủi ro; áp dụng bug logging &amp; bug lifecycle</td><td>7</td></tr>
    <tr><td>CLO7</td><td>Phân loại &amp; chọn công cụ test; đánh giá lợi ích/rủi ro của automation</td><td>8</td></tr>
    <tr><td>CLO8</td><td>Hiểu &amp; áp dụng phương pháp Agile testing</td><td>9</td></tr>
    <tr><td>CLO9</td><td>Dùng công cụ AI hỗ trợ học &amp; làm bài tập</td><td>tất cả</td></tr>
    <tr><td>CLO10</td><td>Thể hiện kỹ năng thuyết trình &amp; làm việc nhóm</td><td>Presentation</td></tr>
  </tbody>
</table>
<div class="callout">Câu hỏi tự kiểm của trường — hãy tự trả lời đầu môn: Giải thích "testing" cho người không code thế nào? Kiểm thử xây niềm tin cho người dùng ra sao? Vì sao defect clustering phổ biến? Tư duy của tester khác lập trình viên chỗ nào? Đây đúng là các "constructive question" giảng viên sẽ hỏi tại lớp.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, tools & where to practice|||0.4 — Tài liệu, công cụ & nơi luyện tập',
          slug: 'swt301-tai-lieu-cong-cu',
          type: 'DOCUMENT',
          description: 'Giáo trình, công cụ kiểm thử, và nơi luyện tập.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; where to practice</h2>
<h3>Textbooks</h3>
<ul>
  <li><strong>Foundations of Software Testing: ISTQB Certification</strong> — Graham, Black &amp; van Veenendaal (main textbook; the whole course maps to it).</li>
  <li><strong>Agile Testing: A Practical Guide for Testers and Agile Teams</strong> — Lisa Crispin &amp; Janet Gregory (for Chapter 9).</li>
  <li><em>Computer Software Validation</em> — Alan Muirhead (reference).</li>
  <li><em>Software Testing and Quality Assurance</em> — Jeff Tian, SMU (reference, in the FU library).</li>
</ul>
<h3>Tools you will use</h3>
<table>
  <thead><tr><th>Category</th><th>Tool</th><th>Used in</th></tr></thead>
  <tbody>
    <tr><td>Unit test framework</td><td>JUnit (Java)</td><td>Ch 5, 8, Lab 2</td></tr>
    <tr><td>Static analysis</td><td>SonarQube / SpotBugs</td><td>Ch 3, Lab 3</td></tr>
    <tr><td>Automation</td><td>Selenium WebDriver</td><td>Ch 8</td></tr>
    <tr><td>Bug management</td><td>Jira / Bugzilla</td><td>Ch 7</td></tr>
    <tr><td>IDE + Office</td><td>IntelliJ/Eclipse + MS Office</td><td>all labs</td></tr>
    <tr><td>AI tools</td><td>ChatGPT, Gemini, Grok, DeepSeek</td><td>all (CLO9)</td></tr>
  </tbody>
</table>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install &amp; configure the testing tools — download</span><span class="lc-sub">Step-by-step JUnit / Selenium / SonarQube setup — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice JUnit right in the browser</span><span class="lc-sub">Write and run Java + JUnit exercises on CodeLab — no install needed.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card exphub" href="/exp-hub/swt301-cai-dat-testing?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Setup guide — JDK, IntelliJ, JUnit 5 &amp; Selenium</span><span class="lc-sub">Exp Hub · step-by-step with official download links.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout">📎 Attached to this lesson: the original <strong>SWT301.pdf</strong> syllabus — the university's official version, for reference.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; nơi luyện tập</h2>
<h3>Giáo trình</h3>
<ul>
  <li><strong>Foundations of Software Testing: ISTQB Certification</strong> — Graham, Black &amp; van Veenendaal (giáo trình chính; cả môn bám theo).</li>
  <li><strong>Agile Testing: A Practical Guide for Testers and Agile Teams</strong> — Lisa Crispin &amp; Janet Gregory (cho Chương 9).</li>
  <li><em>Computer Software Validation</em> — Alan Muirhead (tham khảo).</li>
  <li><em>Software Testing and Quality Assurance</em> — Jeff Tian, SMU (tham khảo, có ở thư viện FU).</li>
</ul>
<h3>Công cụ bạn sẽ dùng</h3>
<table>
  <thead><tr><th>Loại</th><th>Công cụ</th><th>Dùng ở</th></tr></thead>
  <tbody>
    <tr><td>Unit test framework</td><td>JUnit (Java)</td><td>Ch 5, 8, Lab 2</td></tr>
    <tr><td>Static analysis</td><td>SonarQube / SpotBugs</td><td>Ch 3, Lab 3</td></tr>
    <tr><td>Automation</td><td>Selenium WebDriver</td><td>Ch 8</td></tr>
    <tr><td>Bug management</td><td>Jira / Bugzilla</td><td>Ch 7</td></tr>
    <tr><td>IDE + Office</td><td>IntelliJ/Eclipse + MS Office</td><td>mọi lab</td></tr>
    <tr><td>AI tools</td><td>ChatGPT, Gemini, Grok, DeepSeek</td><td>tất cả (CLO9)</td></tr>
  </tbody>
</table>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài &amp; cấu hình công cụ kiểm thử — tải về</span><span class="lc-sub">Từng bước cài JUnit / Selenium / SonarQube — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện JUnit trực tiếp trên trình duyệt</span><span class="lc-sub">Viết và chạy bài Java + JUnit trên CodeLab — không cần cài gì.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card exphub" href="/exp-hub/swt301-cai-dat-testing?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt — JDK, IntelliJ, JUnit 5 &amp; Selenium</span><span class="lc-sub">Exp Hub · từng bước, link tải chính chủ.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout">📎 File đính kèm mục này: syllabus gốc <strong>SWT301.pdf</strong> — bản chính thức của trường, dùng để đối chiếu.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — FUNDAMENTALS OF TESTING ══════════════════ */
    {
      title: 'Chapter 1 — Fundamentals of testing|||Chương 1 — Nền tảng kiểm thử',
      description: 'Kiểm thử là gì và vì sao cần; error/defect/failure; 7 nguyên tắc; quy trình test cơ bản; tâm lý kiểm thử.',
      lessons: [
        {
          title: '1.1 — What testing is & the 7 principles|||1.1 — Kiểm thử là gì & 7 nguyên tắc',
          slug: 'swt301-fundamentals-principles',
          type: 'VIDEO',
          description: 'Định nghĩa kiểm thử, phân biệt error/defect/failure, và 7 nguyên tắc nền tảng của ISTQB.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>What is testing? Error, defect &amp; failure</h2>
<p class="lead">Testing is <strong>not</strong> just "running the program to see if it works". Formally, testing is the process of <strong>evaluating a product to find defects and to measure quality</strong> — it includes both <em>static</em> activities (reviewing documents and code without running them) and <em>dynamic</em> activities (executing the software). Crucially, testing gives <strong>information</strong> to stakeholders so they can make decisions; it does not, by itself, make software correct.</p>
<h3>Two goals people confuse</h3>
<ul>
  <li><strong>Verification</strong> — "Are we building the product <em>right</em>?" (does it meet the specification?)</li>
  <li><strong>Validation</strong> — "Are we building the <em>right</em> product?" (does it meet the user's real need?)</li>
</ul>
<h3>The error → defect → failure chain</h3>
<p>These three words are tested constantly and students mix them up. Learn the causal chain:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Error (mistake)</div><div class="lz-t">A human makes a mistake</div><div class="lz-d">e.g. a developer misreads the spec</div></div>
  <div class="lz-step"><div class="lz-k">→ Defect (bug/fault)</div><div class="lz-t">The mistake becomes wrong code</div><div class="lz-d">the flaw sitting in the source</div></div>
  <div class="lz-step"><div class="lz-k">→ Failure</div><div class="lz-t">The defect is executed</div><div class="lz-d">the system behaves wrongly at runtime</div></div>
</div>
<div class="callout">A defect only becomes a <strong>failure</strong> when the faulty line is <em>executed under the right conditions</em>. A defect on a rarely-taken branch can hide for years — this is why coverage matters (Chapter 5).</div>
<h3>The 7 principles of testing (ISTQB)</h3>
<table>
  <thead><tr><th>#</th><th>Principle</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Testing shows the presence of defects</td><td>Testing can prove bugs exist, never that there are none.</td></tr>
    <tr><td>2</td><td>Exhaustive testing is impossible</td><td>You cannot test every input combination; use risk &amp; priorities.</td></tr>
    <tr><td>3</td><td>Early testing saves time &amp; money</td><td>Start testing (even statically) as early as possible — "shift left".</td></tr>
    <tr><td>4</td><td>Defects cluster together</td><td>A small number of modules contain most defects (Pareto ~80/20).</td></tr>
    <tr><td>5</td><td>Beware the pesticide paradox</td><td>Re-running the same tests stops finding new bugs; vary them.</td></tr>
    <tr><td>6</td><td>Testing is context-dependent</td><td>A banking app and a game are tested differently.</td></tr>
    <tr><td>7</td><td>Absence-of-errors is a fallacy</td><td>Bug-free software that nobody needs is still a failure.</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Principle 1 catches most students.</b> On the exam, "the purpose of testing is to prove the software has no defects" is <em>false</em>. Testing can only demonstrate that defects are <em>present</em>, never their total absence — proving absence would require exhaustive testing, which Principle 2 says is impossible.</div>
<h3>Ví dụ có lời giải · Worked example (classify the situation)</h3>
<p>A developer writes <code>if (age &gt; 18)</code> intending "18 or older". A 18-year-old user is wrongly rejected at registration. Classify each part:</p>
<ul>
  <li><strong>Error:</strong> the developer misunderstood the requirement ("at least 18" vs "over 18").</li>
  <li><strong>Defect:</strong> the code <code>age &gt; 18</code> (should be <code>age &gt;= 18</code>) — a boundary fault sitting in the source.</li>
  <li><strong>Failure:</strong> the observed wrong behaviour — an 18-year-old is rejected — which only appears when someone actually registers with age exactly 18.</li>
</ul>
<div class="callout ok">Notice the failure only shows at the <em>boundary</em> value 18. That is exactly why Boundary Value Analysis (Chapter 4) exists — boundaries are where defects love to hide.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The test oracle problem.</b> Every test needs an <em>oracle</em> — a source of truth that tells you the expected result. For "2 + 2 = 4" the oracle is trivial. But how do you test a weather-prediction model, a search-ranking algorithm, or a rendering engine, where the "correct" output is unknown or subjective? This is the <b>oracle problem</b>, one of the deepest open issues in testing. Practical workarounds: <em>metamorphic testing</em> (relations that must hold — sorting a list twice gives the same result), <em>differential testing</em> (compare two implementations), and <em>property-based testing</em> (Chapter 11).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Kiểm thử là gì? Error, defect &amp; failure</h2>
<p class="lead">Kiểm thử <strong>không</strong> chỉ là "chạy chương trình xem có được không". Chính xác thì kiểm thử là quá trình <strong>đánh giá sản phẩm để tìm defect và đo chất lượng</strong> — gồm cả hoạt động <em>tĩnh (static)</em> (rà tài liệu, code mà không chạy) và <em>động (dynamic)</em> (thực thi phần mềm). Quan trọng: kiểm thử cung cấp <strong>thông tin</strong> cho các bên để ra quyết định; bản thân nó không làm phần mềm trở nên đúng.</p>
<h3>Hai mục tiêu hay bị nhầm</h3>
<ul>
  <li><strong>Verification (thẩm định)</strong> — "Ta xây sản phẩm <em>đúng cách</em> chưa?" (có khớp đặc tả không?)</li>
  <li><strong>Validation (xác nhận)</strong> — "Ta xây <em>đúng sản phẩm</em> chưa?" (có đáp ứng nhu cầu thật của người dùng không?)</li>
</ul>
<h3>Chuỗi error → defect → failure</h3>
<p>Ba từ này bị hỏi liên tục và sinh viên hay lẫn. Hãy nhớ chuỗi nhân quả:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Error (sai sót)</div><div class="lz-t">Con người mắc lỗi</div><div class="lz-d">vd lập trình viên đọc sai spec</div></div>
  <div class="lz-step"><div class="lz-k">→ Defect (bug/fault)</div><div class="lz-t">Sai sót thành code sai</div><div class="lz-d">khiếm khuyết nằm trong mã nguồn</div></div>
  <div class="lz-step"><div class="lz-k">→ Failure</div><div class="lz-t">Defect được thực thi</div><div class="lz-d">hệ thống hành xử sai lúc chạy</div></div>
</div>
<div class="callout">Một defect chỉ trở thành <strong>failure</strong> khi dòng lỗi <em>được thực thi trong điều kiện phù hợp</em>. Defect nằm trên nhánh hiếm khi chạy có thể ẩn nhiều năm — vì thế coverage mới quan trọng (Chương 5).</div>
<h3>7 nguyên tắc kiểm thử (ISTQB)</h3>
<table>
  <thead><tr><th>#</th><th>Nguyên tắc</th><th>Ý nghĩa</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Kiểm thử chỉ ra sự hiện diện của defect</td><td>Test chứng minh có bug, không bao giờ chứng minh không có bug.</td></tr>
    <tr><td>2</td><td>Không thể test vét cạn</td><td>Không thể test mọi tổ hợp input; dùng rủi ro &amp; ưu tiên.</td></tr>
    <tr><td>3</td><td>Test sớm tiết kiệm thời gian &amp; tiền</td><td>Bắt đầu test (kể cả static) càng sớm càng tốt — "shift left".</td></tr>
    <tr><td>4</td><td>Defect co cụm (clustering)</td><td>Một số ít module chứa phần lớn defect (Pareto ~80/20).</td></tr>
    <tr><td>5</td><td>Coi chừng pesticide paradox</td><td>Chạy lại đúng bộ test cũ sẽ ngừng tìm ra bug mới; phải đổi test.</td></tr>
    <tr><td>6</td><td>Kiểm thử phụ thuộc ngữ cảnh</td><td>App ngân hàng và game được test khác nhau.</td></tr>
    <tr><td>7</td><td>"Không có lỗi" là ngộ nhận</td><td>Phần mềm không bug nhưng vô dụng vẫn là thất bại.</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Nguyên tắc 1 hay bẫy sinh viên.</b> Trong đề, "mục đích của kiểm thử là chứng minh phần mềm không có defect" là <em>SAI</em>. Test chỉ chứng minh được defect <em>đang hiện diện</em>, không bao giờ chứng minh chúng vắng mặt hoàn toàn — muốn chứng minh vắng mặt phải test vét cạn, mà Nguyên tắc 2 nói là bất khả.</div>
<h3>Ví dụ có lời giải · Phân loại tình huống</h3>
<p>Lập trình viên viết <code>if (age &gt; 18)</code> với ý "từ 18 tuổi trở lên". Người dùng 18 tuổi bị từ chối đăng ký. Hãy phân loại:</p>
<ul>
  <li><strong>Error:</strong> lập trình viên hiểu sai yêu cầu ("ít nhất 18" vs "trên 18").</li>
  <li><strong>Defect:</strong> đoạn <code>age &gt; 18</code> (đúng ra là <code>age &gt;= 18</code>) — lỗi biên nằm trong mã nguồn.</li>
  <li><strong>Failure:</strong> hành vi sai quan sát được — người 18 tuổi bị từ chối — chỉ xuất hiện khi có ai đó đăng ký với tuổi đúng bằng 18.</li>
</ul>
<div class="callout ok">Chú ý failure chỉ lộ ở giá trị <em>biên</em> 18. Đó chính là lý do Boundary Value Analysis (Chương 4) tồn tại — biên là nơi defect thích ẩn nấp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bài toán oracle.</b> Mỗi test cần một <em>oracle</em> — nguồn chân lý cho biết kết quả mong đợi. Với "2 + 2 = 4" oracle quá dễ. Nhưng test một mô hình dự báo thời tiết, thuật toán xếp hạng tìm kiếm, hay một engine render — nơi output "đúng" không rõ hoặc mang tính chủ quan — thì sao? Đó là <b>oracle problem</b>, một trong những vấn đề mở sâu nhất của kiểm thử. Cách xử lý thực tế: <em>metamorphic testing</em> (quan hệ phải đúng — sắp xếp một list hai lần cho cùng kết quả), <em>differential testing</em> (so hai bản cài đặt), và <em>property-based testing</em> (Chương 11).</div>
</div>
`,
        },
        {
          title: '1.2 — The fundamental test process & psychology|||1.2 — Quy trình test cơ bản & tâm lý kiểm thử',
          slug: 'swt301-test-process',
          type: 'VIDEO',
          description: 'Năm hoạt động của quy trình test cơ bản, đạo đức nghề, và tâm lý độc lập trong kiểm thử.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>The fundamental test process</h2>
<p class="lead">Testing is never a single step. ISTQB describes a <strong>five-activity process</strong> that runs (and iterates) across any project, from a tiny unit test to a full system test campaign.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Planning &amp; control</div><div class="lz-nsub">define objectives, scope, resources, entry/exit criteria; monitor progress.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Analysis &amp; design</div><div class="lz-nsub">turn test bases (specs) into test conditions and concrete test cases.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Implementation &amp; execution</div><div class="lz-nsub">build test data/scripts, run tests, compare actual vs expected.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Evaluating exit criteria &amp; reporting</div><div class="lz-nsub">did we meet coverage/defect targets? write the test summary report.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Test closure</div><div class="lz-nsub">archive testware, record lessons learned, hand over.</div></div></div>
</div>
<h3>Anatomy of a test case</h3>
<p>A good test case is repeatable by anyone. Minimum fields:</p>
<table>
  <thead><tr><th>Field</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>ID</td><td>TC-LOGIN-007</td></tr>
    <tr><td>Precondition</td><td>User "alice" exists, is not locked</td></tr>
    <tr><td>Input / steps</td><td>Enter username "alice", password "wrong", click Login</td></tr>
    <tr><td>Expected result</td><td>Error "Invalid credentials"; no session created</td></tr>
    <tr><td>Actual result</td><td>(filled during execution)</td></tr>
    <tr><td>Status</td><td>Pass / Fail</td></tr>
  </tbody>
</table>
<div class="pitfall">A test case with no <strong>expected result</strong> is worthless — without it you cannot tell pass from fail. "Enter data and see what happens" is exploration, not a test case. Always write the expected result <em>before</em> you run.</div>
<h3>The psychology of testing</h3>
<p>Developers are biased to see their own code work; testers must adopt a <strong>destructive-but-constructive mindset</strong> — actively trying to break the software, then reporting problems tactfully. This is why <strong>independence</strong> improves testing: an author testing their own work misses their own blind spots. Levels of independence range from "the author tests" (weakest) to "a separate organisation tests" (strongest, e.g. certification bodies).</p>
<div class="callout"><b>Codes of ethics.</b> ISTQB adopts the ACM/IEEE code: act in the <em>public</em> interest, be honest about test results (never hide a known defect), respect confidentiality of client data, and avoid conflicts of interest. A tester who signs off software they know is unsafe is committing an ethics violation, not just a technical one.</div>
<h3>Ví dụ có lời giải · Worked example (write a test condition → test case)</h3>
<p>Requirement: "A withdrawal is allowed only if the amount ≤ balance and the amount is a positive multiple of 50,000₫."</p>
<ol>
  <li><strong>Test conditions</strong> (what to test): amount vs balance; positivity; multiple-of-50k rule.</li>
  <li><strong>Test cases</strong> (concrete): balance = 200,000. TC1 amount 150,000 → allowed. TC2 amount 250,000 → rejected (exceeds balance). TC3 amount 30,000 → rejected (not multiple of 50k). TC4 amount 0 → rejected (not positive). TC5 amount 200,000 → allowed (boundary = balance).</li>
</ol>
<div class="callout ok">Notice we derived <em>conditions</em> first, then turned each into a case with a clear expected result. This two-step habit is exactly the "analysis &amp; design" activity above — and it's what the Practical Exam grades.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Shift-left and shift-right.</b> The syllabus stresses <em>early</em> testing (shift-left: review requirements, write tests before code). Modern practice adds <em>shift-right</em>: testing <b>in production</b> — feature flags, canary releases, A/B tests, synthetic monitoring, and chaos engineering (Netflix's "Chaos Monkey" randomly kills servers to prove resilience). The lesson: testing does not stop at release; observability turns real users into a continuous test.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Quy trình test cơ bản</h2>
<p class="lead">Kiểm thử không bao giờ là một bước. ISTQB mô tả một <strong>quy trình 5 hoạt động</strong> chạy (và lặp) trong mọi dự án, từ một unit test nhỏ đến cả chiến dịch system test.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Lập kế hoạch &amp; kiểm soát</div><div class="lz-nsub">xác định mục tiêu, phạm vi, nguồn lực, tiêu chí vào/ra; theo dõi tiến độ.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Phân tích &amp; thiết kế</div><div class="lz-nsub">biến test basis (đặc tả) thành test condition rồi test case cụ thể.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai &amp; thực thi</div><div class="lz-nsub">tạo dữ liệu/script test, chạy test, so sánh thực tế vs mong đợi.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Đánh giá tiêu chí ra &amp; báo cáo</div><div class="lz-nsub">đã đạt mục tiêu coverage/defect chưa? viết test summary report.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Đóng test (closure)</div><div class="lz-nsub">lưu trữ testware, ghi bài học, bàn giao.</div></div></div>
</div>
<h3>Giải phẫu một test case</h3>
<p>Test case tốt là ai cũng lặp lại được. Trường tối thiểu:</p>
<table>
  <thead><tr><th>Trường</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>ID</td><td>TC-LOGIN-007</td></tr>
    <tr><td>Precondition (điều kiện trước)</td><td>User "alice" tồn tại, chưa bị khoá</td></tr>
    <tr><td>Input / các bước</td><td>Nhập username "alice", password "wrong", bấm Login</td></tr>
    <tr><td>Expected result (mong đợi)</td><td>Báo lỗi "Invalid credentials"; không tạo session</td></tr>
    <tr><td>Actual result (thực tế)</td><td>(điền lúc thực thi)</td></tr>
    <tr><td>Status</td><td>Pass / Fail</td></tr>
  </tbody>
</table>
<div class="pitfall">Test case không có <strong>expected result</strong> là vô giá trị — không có nó bạn không phân biệt được pass/fail. "Nhập đại rồi xem sao" là exploration, không phải test case. Luôn viết kết quả mong đợi <em>trước</em> khi chạy.</div>
<h3>Tâm lý kiểm thử</h3>
<p>Lập trình viên thiên vị nhìn code của mình chạy đúng; tester phải mang <strong>tư duy phá-nhưng-xây</strong> — chủ động cố làm phần mềm vỡ, rồi báo lỗi khéo léo. Đó là vì sao <strong>tính độc lập (independence)</strong> làm test tốt hơn: người tự test bài mình sẽ bỏ sót điểm mù của chính mình. Mức độ độc lập trải từ "tác giả tự test" (yếu nhất) đến "một tổ chức riêng test" (mạnh nhất, vd cơ quan chứng nhận).</p>
<div class="callout"><b>Đạo đức nghề.</b> ISTQB theo bộ quy tắc ACM/IEEE: hành động vì lợi ích <em>công chúng</em>, trung thực về kết quả test (không giấu defect đã biết), tôn trọng bảo mật dữ liệu khách hàng, tránh xung đột lợi ích. Tester ký duyệt phần mềm mà mình biết là không an toàn là vi phạm đạo đức, không chỉ vi phạm kỹ thuật.</div>
<h3>Ví dụ có lời giải · Viết test condition → test case</h3>
<p>Yêu cầu: "Cho rút tiền chỉ khi số tiền ≤ số dư và là bội số dương của 50.000₫."</p>
<ol>
  <li><strong>Test condition</strong> (test cái gì): số tiền vs số dư; tính dương; luật bội số 50k.</li>
  <li><strong>Test case</strong> (cụ thể): số dư = 200.000. TC1 rút 150.000 → cho. TC2 rút 250.000 → từ chối (vượt số dư). TC3 rút 30.000 → từ chối (không phải bội 50k). TC4 rút 0 → từ chối (không dương). TC5 rút 200.000 → cho (biên = số dư).</li>
</ol>
<div class="callout ok">Chú ý ta rút ra <em>condition</em> trước, rồi biến mỗi cái thành case có kết quả mong đợi rõ ràng. Thói quen hai bước này chính là hoạt động "phân tích &amp; thiết kế" ở trên — và là thứ Practical Exam chấm.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Shift-left và shift-right.</b> Giáo trình nhấn mạnh test <em>sớm</em> (shift-left: rà yêu cầu, viết test trước code). Thực tế hiện đại thêm <em>shift-right</em>: test <b>trên production</b> — feature flag, canary release, A/B test, synthetic monitoring, và chaos engineering (Netflix dùng "Chaos Monkey" ngẫu nhiên giết server để chứng minh khả năng chịu lỗi). Bài học: kiểm thử không dừng ở lúc phát hành; observability biến người dùng thật thành một bài test liên tục.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Fundamentals of testing|||Quiz 1 — Nền tảng kiểm thử',
          slug: 'swt301-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra 7 nguyên tắc, error/defect/failure và quy trình test — gồm câu suy luận.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A human mistake that leads to wrong code is called a…|||Sai sót của con người dẫn tới code sai gọi là…', options: ['failure|||failure', 'error|||error', 'defect|||defect', 'incident|||incident'], correctIndex: 1, points: 1 },
              { question: 'A defect becomes a failure only when…|||Một defect trở thành failure chỉ khi…', options: ['it is written in the code|||nó được viết vào code', 'the faulty code is executed under the right conditions|||dòng code lỗi được thực thi trong điều kiện phù hợp', 'a tester reads it|||tester đọc thấy nó', 'the project ends|||dự án kết thúc'], correctIndex: 1, points: 1 },
              { question: 'Which statement about testing is TRUE?|||Phát biểu nào về kiểm thử là ĐÚNG?', options: ['Testing proves software has no defects|||Test chứng minh phần mềm không có defect', 'Testing can show defects are present but not that there are none|||Test chỉ ra defect hiện diện, không chứng minh không có defect', 'Exhaustive testing is always possible|||Luôn có thể test vét cạn', 'Testing makes code correct by itself|||Test tự làm code đúng'], correctIndex: 1, points: 1 },
              { question: 'The "pesticide paradox" means…|||"Pesticide paradox" nghĩa là…', options: ['tests get slower over time|||test chậm dần theo thời gian', 'repeating the same tests stops finding new defects|||chạy lại đúng bộ test cũ ngừng tìm ra defect mới', 'defects spread like insects|||defect lây như côn trùng', 'automation is harmful|||automation có hại'], correctIndex: 1, points: 1 },
              { question: 'Defect clustering (Principle 4) implies you should…|||Defect clustering (Nguyên tắc 4) hàm ý bạn nên…', options: ['test every module equally|||test mọi module như nhau', 'focus more testing on the few high-defect modules|||dồn test vào số ít module nhiều defect', 'stop testing after one bug|||ngừng test sau một bug', 'test only the UI|||chỉ test UI'], correctIndex: 1, points: 1 },
              { question: 'Which field makes a test case verifiable (pass/fail)?|||Trường nào khiến test case kiểm chứng được (pass/fail)?', options: ['the ID|||ID', 'the expected result|||kết quả mong đợi', 'the author name|||tên tác giả', 'the date|||ngày'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — TESTING THROUGHOUT THE SDLC ══════════════════ */
    {
      title: 'Chapter 2 — Testing throughout the SDLC|||Chương 2 — Kiểm thử xuyên suốt SDLC',
      description: 'Mô hình V; bốn cấp test (unit, integration, system, acceptance); test types; maintenance testing.',
      lessons: [
        {
          title: '2.1 — Test levels & the V-model|||2.1 — Các cấp test & mô hình V',
          slug: 'swt301-test-levels',
          type: 'VIDEO',
          description: 'Bốn cấp kiểm thử và cách mô hình V gắn mỗi cấp test với một pha phát triển.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Four test levels &amp; the V-model</h2>
<p class="lead">Testing is organised into <strong>levels</strong>, each with a different target, tester and goal. The <strong>V-model</strong> is the classic picture: as development descends the left side (requirements → design → code), testing climbs the right side, and <em>each test level verifies the matching development phase</em>.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Acceptance testing</span><span class="lz-lnote">verifies the requirements — does it meet the user's need? (validation)</span></div>
  <div class="lz-layer"><span class="lz-lname">System testing</span><span class="lz-lnote">verifies the whole system against the system spec — end to end</span></div>
  <div class="lz-layer"><span class="lz-lname">Integration testing</span><span class="lz-lnote">verifies interfaces between components/modules — do they talk correctly?</span></div>
  <div class="lz-layer"><span class="lz-lname">Component / unit testing</span><span class="lz-lnote">verifies a single unit in isolation — the developer's own tests (JUnit)</span></div>
</div>
<table>
  <thead><tr><th>Level</th><th>Tests what</th><th>Typically by</th><th>Basis</th></tr></thead>
  <tbody>
    <tr><td>Unit / Component</td><td>One class/function alone</td><td>Developer</td><td>Detailed design, code</td></tr>
    <tr><td>Integration</td><td>Interfaces between modules</td><td>Developer / integration tester</td><td>Architecture, interface spec</td></tr>
    <tr><td>System</td><td>The complete system, functional + non-functional</td><td>Independent test team</td><td>System requirements</td></tr>
    <tr><td>Acceptance</td><td>Readiness for the user (UAT), plus contract/regulation/operational</td><td>Customer / users</td><td>User needs, business processes</td></tr>
  </tbody>
</table>
<h3>Integration strategies</h3>
<ul>
  <li><strong>Big-bang:</strong> integrate everything at once — hard to locate the failing interface.</li>
  <li><strong>Top-down:</strong> test top modules first, using <em>stubs</em> for the not-yet-built lower ones.</li>
  <li><strong>Bottom-up:</strong> test low modules first, using <em>drivers</em> to call them.</li>
</ul>
<div class="pitfall">Know your test doubles: a <strong>stub</strong> stands in for a component your code <em>calls</em> (it returns canned answers, used in top-down). A <strong>driver</strong> stands in for a component that <em>calls</em> your code (it feeds inputs, used in bottom-up). Confusing the two is a classic exam trap. Related doubles: <em>mock</em> (verifies interactions) and <em>fake</em> (a lightweight working impl, e.g. in-memory DB).</div>
<h3>Ví dụ có lời giải · Worked example (assign the level)</h3>
<p>An e-commerce app. Classify each test into its level:</p>
<ul>
  <li>"<code>calculateDiscount(price, pct)</code> returns 90 for (100, 10)" → <strong>unit</strong> (one function alone).</li>
  <li>"The Checkout service correctly calls the Payment gateway API and stores the returned transaction id" → <strong>integration</strong> (interface between two modules).</li>
  <li>"A user can search a product, add to cart, pay, and receive a confirmation email" → <strong>system</strong> (whole flow, end-to-end).</li>
  <li>"The business owner confirms the invoice format matches Vietnamese tax law before go-live" → <strong>acceptance</strong> (user/contract readiness).</li>
</ul>
<div class="callout ok">One rule of thumb: as you go up the levels, tests get <em>fewer, slower and closer to the user</em>; as you go down, they get <em>more numerous, faster and closer to the code</em>. This is exactly the test pyramid you'll meet in Chapter 8.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Where does "regression testing" fit?</b> Regression is not a level — it is a <em>reason</em> to re-run tests at any level after a change, to confirm you didn't break something that used to work. Its cousin, <b>confirmation (re-)testing</b>, re-runs the specific test that found a bug to confirm the fix. Because regression suites grow forever, they are the first thing teams automate — a manual regression pass on a big app can take days, an automated one minutes.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Bốn cấp test &amp; mô hình V</h2>
<p class="lead">Kiểm thử được tổ chức thành các <strong>cấp (level)</strong>, mỗi cấp có đối tượng, người test và mục tiêu khác nhau. <strong>Mô hình V</strong> là bức tranh kinh điển: khi phát triển đi xuống nhánh trái (yêu cầu → thiết kế → code), kiểm thử leo lên nhánh phải, và <em>mỗi cấp test thẩm định pha phát triển tương ứng</em>.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Acceptance testing</span><span class="lz-lnote">thẩm định yêu cầu — có đáp ứng nhu cầu người dùng? (validation)</span></div>
  <div class="lz-layer"><span class="lz-lname">System testing</span><span class="lz-lnote">thẩm định toàn hệ thống theo system spec — đầu-cuối</span></div>
  <div class="lz-layer"><span class="lz-lname">Integration testing</span><span class="lz-lnote">thẩm định giao diện giữa các component/module — có "nói chuyện" đúng?</span></div>
  <div class="lz-layer"><span class="lz-lname">Component / unit testing</span><span class="lz-lnote">thẩm định một unit riêng lẻ — test của chính lập trình viên (JUnit)</span></div>
</div>
<table>
  <thead><tr><th>Cấp</th><th>Test cái gì</th><th>Thường do ai</th><th>Cơ sở (basis)</th></tr></thead>
  <tbody>
    <tr><td>Unit / Component</td><td>Một class/hàm riêng lẻ</td><td>Lập trình viên</td><td>Thiết kế chi tiết, code</td></tr>
    <tr><td>Integration</td><td>Giao diện giữa các module</td><td>Lập trình viên / integration tester</td><td>Kiến trúc, spec giao diện</td></tr>
    <tr><td>System</td><td>Toàn hệ thống, functional + non-functional</td><td>Đội test độc lập</td><td>Yêu cầu hệ thống</td></tr>
    <tr><td>Acceptance</td><td>Sẵn sàng cho người dùng (UAT), kèm hợp đồng/quy định/vận hành</td><td>Khách hàng / người dùng</td><td>Nhu cầu người dùng, quy trình nghiệp vụ</td></tr>
  </tbody>
</table>
<h3>Chiến lược tích hợp (integration)</h3>
<ul>
  <li><strong>Big-bang:</strong> tích hợp tất cả cùng lúc — khó xác định giao diện nào lỗi.</li>
  <li><strong>Top-down:</strong> test module trên trước, dùng <em>stub</em> thay module dưới chưa xây.</li>
  <li><strong>Bottom-up:</strong> test module dưới trước, dùng <em>driver</em> để gọi chúng.</li>
</ul>
<div class="pitfall">Nhớ rõ test double: <strong>stub</strong> đóng thế cho component mà code của bạn <em>gọi tới</em> (trả về đáp án dựng sẵn, dùng trong top-down). <strong>Driver</strong> đóng thế cho component <em>gọi tới</em> code của bạn (cấp input, dùng trong bottom-up). Nhầm hai cái này là bẫy đề kinh điển. Doubles liên quan: <em>mock</em> (kiểm tra tương tác) và <em>fake</em> (bản cài nhẹ chạy được, vd DB in-memory).</div>
<h3>Ví dụ có lời giải · Gán cấp test</h3>
<p>Một app thương mại điện tử. Phân loại mỗi test vào cấp của nó:</p>
<ul>
  <li>"<code>calculateDiscount(price, pct)</code> trả 90 cho (100, 10)" → <strong>unit</strong> (một hàm riêng).</li>
  <li>"Service Checkout gọi đúng API cổng Payment và lưu transaction id trả về" → <strong>integration</strong> (giao diện giữa hai module).</li>
  <li>"Người dùng tìm sản phẩm, thêm giỏ, thanh toán, và nhận email xác nhận" → <strong>system</strong> (cả luồng, đầu-cuối).</li>
  <li>"Chủ doanh nghiệp xác nhận định dạng hoá đơn khớp luật thuế VN trước khi go-live" → <strong>acceptance</strong> (sẵn sàng theo người dùng/hợp đồng).</li>
</ul>
<div class="callout ok">Một quy tắc nhớ: lên cấp cao hơn, test <em>ít hơn, chậm hơn, gần người dùng hơn</em>; xuống cấp thấp hơn, test <em>nhiều hơn, nhanh hơn, gần code hơn</em>. Đây chính là test pyramid ở Chương 8.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Regression testing" nằm ở đâu?</b> Regression không phải một cấp — nó là một <em>lý do</em> để chạy lại test ở bất kỳ cấp nào sau khi thay đổi, để chắc rằng bạn không làm hỏng thứ vốn đang chạy. Người anh em của nó, <b>confirmation (re-)testing</b>, chạy lại đúng test đã tìm ra bug để xác nhận bản vá. Vì bộ regression cứ phình mãi, đó là thứ đầu tiên các đội tự động hoá — chạy regression tay trên app lớn mất nhiều ngày, tự động chỉ vài phút.</div>
</div>
`,
        },
        {
          title: '2.2 — Test types & maintenance testing|||2.2 — Test types & maintenance testing',
          slug: 'swt301-test-types',
          type: 'VIDEO',
          description: 'Functional vs non-functional vs structural testing, testing sau thay đổi, và maintenance testing.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Test types — the targets of testing</h2>
<p class="lead">A <em>test level</em> answers "<strong>when</strong>/at what stage"; a <em>test type</em> answers "<strong>what quality characteristic</strong> am I checking?". The four types run across every level.</p>
<table>
  <thead><tr><th>Type</th><th>Question it answers</th><th>Examples</th></tr></thead>
  <tbody>
    <tr><td>Functional</td><td>Does it do the <em>right things</em>? (behaviour vs spec)</td><td>login works, discount is correct</td></tr>
    <tr><td>Non-functional</td><td>Does it do things <em>well</em>? (quality attributes)</td><td>performance, load, usability, security, reliability, portability</td></tr>
    <tr><td>Structural (white-box)</td><td>Is the <em>internal structure</em> exercised? (coverage)</td><td>statement/branch coverage — Chapter 5</td></tr>
    <tr><td>Change-related</td><td>Did a fix/change behave correctly?</td><td>confirmation testing, regression testing</td></tr>
  </tbody>
</table>
<div class="callout">Non-functional testing is where big systems fail publicly. A shopping site can pass every functional test yet collapse under Black-Friday load (performance), leak passwords (security), or confuse users (usability). ISO 25010 lists the standard quality characteristics you should think of as "test types".</div>
<h3>Maintenance testing</h3>
<p>Most software spends the majority of its life in <strong>maintenance</strong> — after release. Maintenance testing is triggered by:</p>
<ul>
  <li><strong>Modifications:</strong> enhancements, corrective fixes, adaptive changes (new OS/browser).</li>
  <li><strong>Migration:</strong> moving to a new platform or data format (test both operation and data conversion).</li>
  <li><strong>Retirement:</strong> decommissioning — test data archival and migration.</li>
</ul>
<p>Its two big jobs are <strong>testing the change itself</strong> and <strong>regression testing</strong> the untouched parts. <strong>Impact analysis</strong> — figuring out what a change might affect — decides how much regression is needed.</p>
<div class="pitfall">Skipping regression "because the change was tiny" is how one-line fixes cause outages. A change to a shared utility can ripple through dozens of features. When in doubt, let impact analysis (and automated regression suites) decide the scope — not gut feeling.</div>
<h3>Ví dụ có lời giải · Worked example (pick the test type)</h3>
<p>For a mobile banking app, match each concern to its test type:</p>
<ul>
  <li>"Transfer of 1,000,000₫ debits the correct account" → <strong>functional</strong>.</li>
  <li>"The transfer screen responds within 2 seconds under 5,000 concurrent users" → <strong>non-functional (performance/load)</strong>.</li>
  <li>"Every branch in the fraud-check function is executed by our tests" → <strong>structural</strong>.</li>
  <li>"After patching the login bug, the old passing login tests still pass" → <strong>change-related (regression)</strong>.</li>
</ul>
<div class="callout ok">The same feature is attacked from four angles. On the exam, if a question mentions <em>speed, security, usability, load</em> → it is non-functional; if it mentions <em>coverage/branches</em> → structural; if it mentions <em>after a change</em> → change-related; otherwise → functional.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "ilities" and the cost of ignoring them.</b> Non-functional requirements are nicknamed the <em>-ilities</em>: scalability, reliability, availability, maintainability, observability, accessibility. They are notoriously under-tested because they are hard to specify ("fast enough" is not a test). Professional teams turn them into <b>measurable SLOs</b> — e.g. "p95 latency &lt; 300ms", "99.9% uptime", "WCAG 2.1 AA accessibility" — because a quality attribute you cannot measure is one you cannot test.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Test types — mục tiêu của kiểm thử</h2>
<p class="lead">Một <em>test level</em> trả lời "<strong>khi nào</strong>/ở giai đoạn nào"; một <em>test type</em> trả lời "tôi đang kiểm <strong>đặc tính chất lượng nào</strong>?". Bốn loại chạy xuyên mọi cấp.</p>
<table>
  <thead><tr><th>Loại</th><th>Trả lời câu hỏi</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Functional</td><td>Có làm <em>đúng việc</em> không? (hành vi vs spec)</td><td>login chạy, chiết khấu đúng</td></tr>
    <tr><td>Non-functional</td><td>Có làm <em>tốt</em> không? (thuộc tính chất lượng)</td><td>hiệu năng, tải, khả dụng, bảo mật, độ tin cậy, tính khả chuyển</td></tr>
    <tr><td>Structural (white-box)</td><td>Cấu trúc <em>bên trong</em> có được đi qua? (coverage)</td><td>statement/branch coverage — Chương 5</td></tr>
    <tr><td>Change-related</td><td>Bản sửa/thay đổi có hành xử đúng?</td><td>confirmation testing, regression testing</td></tr>
  </tbody>
</table>
<div class="callout">Non-functional testing là nơi hệ thống lớn "sập" công khai. Một trang mua sắm có thể pass mọi test functional nhưng gục dưới tải Black-Friday (performance), lộ mật khẩu (security), hoặc làm rối người dùng (usability). ISO 25010 liệt kê các đặc tính chất lượng chuẩn mà bạn nên coi là "test type".</div>
<h3>Maintenance testing (kiểm thử bảo trì)</h3>
<p>Phần lớn phần mềm sống chủ yếu ở giai đoạn <strong>bảo trì</strong> — sau phát hành. Maintenance testing được kích hoạt bởi:</p>
<ul>
  <li><strong>Modification (sửa đổi):</strong> nâng cấp, sửa lỗi, thay đổi thích ứng (OS/trình duyệt mới).</li>
  <li><strong>Migration (di trú):</strong> chuyển nền tảng hoặc định dạng dữ liệu (test cả vận hành lẫn chuyển đổi dữ liệu).</li>
  <li><strong>Retirement (khai tử):</strong> ngừng dùng — test lưu trữ &amp; di trú dữ liệu.</li>
</ul>
<p>Hai việc lớn của nó là <strong>test chính thay đổi</strong> và <strong>regression test</strong> các phần không đụng tới. <strong>Impact analysis</strong> — xác định thay đổi có thể ảnh hưởng gì — quyết định cần bao nhiêu regression.</p>
<div class="pitfall">Bỏ regression "vì thay đổi bé xíu" là cách các bản vá một dòng gây sự cố. Sửa một hàm tiện ích dùng chung có thể lan ra hàng chục tính năng. Khi phân vân, hãy để impact analysis (và bộ regression tự động) quyết định phạm vi — đừng theo cảm tính.</div>
<h3>Ví dụ có lời giải · Chọn test type</h3>
<p>Với app ngân hàng di động, ghép mỗi mối quan tâm với test type:</p>
<ul>
  <li>"Chuyển 1.000.000₫ trừ đúng tài khoản" → <strong>functional</strong>.</li>
  <li>"Màn hình chuyển tiền phản hồi trong 2 giây dưới 5.000 người dùng đồng thời" → <strong>non-functional (performance/load)</strong>.</li>
  <li>"Mọi nhánh trong hàm kiểm tra gian lận đều được test đi qua" → <strong>structural</strong>.</li>
  <li>"Sau khi vá bug login, các test login cũ vẫn pass" → <strong>change-related (regression)</strong>.</li>
</ul>
<div class="callout ok">Cùng một tính năng bị tấn công từ bốn góc. Trong đề: nếu câu nhắc <em>tốc độ, bảo mật, khả dụng, tải</em> → non-functional; nhắc <em>coverage/nhánh</em> → structural; nhắc <em>sau khi thay đổi</em> → change-related; còn lại → functional.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các "ility" và cái giá của việc bỏ quên.</b> Yêu cầu phi chức năng có biệt danh <em>-ility</em>: scalability, reliability, availability, maintainability, observability, accessibility. Chúng nổi tiếng bị test thiếu vì khó đặc tả ("đủ nhanh" không phải một test). Đội chuyên nghiệp biến chúng thành <b>SLO đo được</b> — vd "p95 latency &lt; 300ms", "uptime 99.9%", "accessibility WCAG 2.1 AA" — vì một thuộc tính chất lượng không đo được là thứ không test được.</div>
</div>
`,
        },
        {
          title: 'Quiz 2 — Test levels & test types|||Quiz 2 — Cấp test & test types',
          slug: 'swt301-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra các cấp test, mô hình V, stub/driver và test types.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'Which test level verifies interfaces BETWEEN modules?|||Cấp test nào thẩm định giao diện GIỮA các module?', options: ['unit|||unit', 'integration|||integration', 'system|||system', 'acceptance|||acceptance'], correctIndex: 1, points: 1 },
              { question: 'In top-down integration, a placeholder for a not-yet-built LOWER module is a…|||Trong tích hợp top-down, thành phần thế cho module DƯỚI chưa xây là…', options: ['driver|||driver', 'stub|||stub', 'mock only|||chỉ mock', 'harness|||harness'], correctIndex: 1, points: 1 },
              { question: 'User Acceptance Testing (UAT) primarily answers…|||UAT chủ yếu trả lời câu hỏi…', options: ['is the code covered?|||code đã được coverage?', 'does it meet the user\'s real need? (validation)|||có đáp ứng nhu cầu thật của người dùng? (validation)', 'do interfaces connect?|||các giao diện có nối không?', 'is one function correct?|||một hàm có đúng?'], correctIndex: 1, points: 1 },
              { question: 'Load/performance testing is what kind of test type?|||Kiểm thử tải/hiệu năng thuộc test type nào?', options: ['functional|||functional', 'non-functional|||non-functional', 'structural|||structural', 'confirmation|||confirmation'], correctIndex: 1, points: 1 },
              { question: 'Regression testing is best described as…|||Regression testing được mô tả đúng nhất là…', options: ['a separate test level|||một cấp test riêng', 're-running tests after a change to catch newly broken behaviour|||chạy lại test sau thay đổi để bắt hành vi vừa bị hỏng', 'testing only new features|||chỉ test tính năng mới', 'testing the requirements document|||test tài liệu yêu cầu'], correctIndex: 1, points: 1 },
              { question: 'What decides HOW MUCH regression a maintenance change needs?|||Cái gì quyết định cần BAO NHIÊU regression cho một thay đổi bảo trì?', options: ['the calendar|||lịch', 'impact analysis|||impact analysis', 'the number of developers|||số lập trình viên', 'the UI colour|||màu UI'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 — Fundamentals & SDLC|||Progress Test 1 — Nền tảng & SDLC',
      description: 'Bài kiểm tra tiến độ 1 (mô phỏng): nền tảng kiểm thử, 7 nguyên tắc, test levels & types.',
      lessons: [
        {
          title: 'Progress Test 1|||Progress Test 1',
          slug: 'swt301-progress-test-1',
          type: 'QUIZ',
          description: 'Tổng hợp Chương 1–2. 8 câu, gồm câu suy luận và tình huống.',
          quiz: {
            timeLimitSeconds: 600,
            questions: [
              { question: 'The correct causal order is…|||Thứ tự nhân quả đúng là…', options: ['failure → defect → error', 'error → defect → failure', 'defect → error → failure', 'error → failure → defect'], correctIndex: 1, points: 1 },
              { question: 'Why is exhaustive testing impossible for most programs?|||Vì sao test vét cạn bất khả với hầu hết chương trình?', options: ['testers are lazy|||tester lười', 'the number of input combinations is astronomically large|||số tổ hợp input lớn khủng khiếp', 'tools are too slow|||công cụ quá chậm', 'it is illegal|||vi phạm luật'], correctIndex: 1, points: 1 },
              { question: '"Early testing saves time and money" is best realised by…|||"Test sớm tiết kiệm thời-tiền" được hiện thực tốt nhất bằng…', options: ['testing only after release|||chỉ test sau phát hành', 'reviewing requirements &amp; design before coding (static testing)|||review yêu cầu &amp; thiết kế trước khi code (static testing)', 'skipping unit tests|||bỏ unit test', 'hiring more testers at the end|||thuê thêm tester ở cuối'], correctIndex: 1, points: 1 },
              { question: 'A JUnit test for a single method is which level?|||Một JUnit test cho một method là cấp nào?', options: ['unit|||unit', 'system|||system', 'acceptance|||acceptance', 'integration|||integration'], correctIndex: 0, points: 1 },
              { question: 'A DRIVER is used mainly in…|||DRIVER được dùng chủ yếu trong…', options: ['top-down integration|||tích hợp top-down', 'bottom-up integration|||tích hợp bottom-up', 'acceptance testing|||acceptance testing', 'usability testing|||usability testing'], correctIndex: 1, points: 1 },
              { question: 'Independence in testing improves results because…|||Tính độc lập trong test cải thiện kết quả vì…', options: ['independent testers work for free|||tester độc lập làm miễn phí', 'authors have blind spots to their own mistakes|||tác giả có điểm mù với lỗi của chính mình', 'it is required by law|||luật bắt buộc', 'it makes tests run faster|||làm test chạy nhanh hơn'], correctIndex: 1, points: 1 },
              { question: 'Testing a bank app for "handles 5,000 concurrent users" is…|||Test app ngân hàng cho "chịu 5.000 người dùng đồng thời" là…', options: ['functional|||functional', 'non-functional|||non-functional', 'confirmation|||confirmation', 'structural|||structural'], correctIndex: 1, points: 1 },
              { question: 'The absence-of-errors fallacy warns that…|||Ngộ nhận "vắng lỗi" cảnh báo rằng…', options: ['software always has errors|||phần mềm luôn có lỗi', 'bug-free software can still fail if it doesn\'t meet user needs|||phần mềm không bug vẫn thất bại nếu không đáp ứng nhu cầu', 'you should ignore usability|||nên bỏ qua usability', 'testing is unnecessary|||test là không cần thiết'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — STATIC TESTING ══════════════════ */
    {
      title: 'Chapter 3 — Static testing|||Chương 3 — Kiểm thử tĩnh',
      description: 'Tìm defect mà không chạy code: review, walkthrough, inspection, các vai trò review, và static analysis bằng công cụ.',
      lessons: [
        {
          title: '3.1 — Reviews, walkthroughs & inspections|||3.1 — Review, walkthrough & inspection',
          slug: 'swt301-static-reviews',
          type: 'VIDEO',
          description: 'Các loại review từ informal đến formal inspection, vai trò trong review, và static analysis bằng công cụ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Static testing — find defects without running code</h2>
<p class="lead"><strong>Static testing</strong> examines work products — requirements, design, code, test cases — <em>without executing them</em>. It is the cheapest way to catch defects because it finds them <strong>early</strong>, often in documents, long before code exists. It splits into two families: <strong>reviews</strong> (done by people) and <strong>static analysis</strong> (done by tools).</p>
<div class="callout">Why it pays off: a requirements ambiguity caught in a review costs minutes to fix; the same ambiguity discovered after release — as a wrong feature shipped to users — can cost thousands. This is Principle 3 (early testing) turned into money.</div>
<h3>The spectrum of reviews (informal → formal)</h3>
<table>
  <thead><tr><th>Type</th><th>Formality</th><th>Led by</th><th>Goal</th></tr></thead>
  <tbody>
    <tr><td>Informal review</td><td>Lowest — no process</td><td>anyone (a buddy check)</td><td>quick cheap feedback</td></tr>
    <tr><td>Walkthrough</td><td>Low–medium</td><td>the <strong>author</strong></td><td>author guides peers through the doc; learning, finding defects, reaching consensus</td></tr>
    <tr><td>Technical review</td><td>Medium–high</td><td>a trained moderator / peers</td><td>technical experts discuss and decide; find defects, evaluate alternatives</td></tr>
    <tr><td>Inspection</td><td>Highest — fully formal</td><td>a trained <strong>moderator</strong> (not the author)</td><td>rigorous, metric-driven defect detection with entry/exit criteria and checklists</td></tr>
  </tbody>
</table>
<h3>Roles in a formal review</h3>
<ul>
  <li><strong>Author</strong> — created the work product; fixes defects afterwards (but must not lead an inspection).</li>
  <li><strong>Moderator (facilitator)</strong> — plans and runs the meeting, keeps it objective and on defects (not people).</li>
  <li><strong>Reviewers</strong> — technical experts who find issues.</li>
  <li><strong>Scribe (recorder)</strong> — logs every defect found.</li>
  <li><strong>Manager</strong> — decides to do the review, provides resources (usually not in the meeting itself).</li>
</ul>
<div class="pitfall">The golden rule of reviews: <strong>review the product, not the person.</strong> The meeting logs defects; it does <em>not</em> judge the author or propose solutions on the spot (that wastes the experts' time). Keeping it defect-focused and blameless is exactly why a trained moderator — never the author — runs an inspection.</div>
<h3>Static analysis by tools</h3>
<p>Tools parse source code (without running it) to flag defects a human eye misses: unreachable "dead" code, uninitialised variables, null-pointer risks, coding-standard violations, security patterns (SQL injection), and overly complex functions (high cyclomatic complexity — Chapter 5). Popular tools: <strong>SonarQube, SpotBugs, ESLint, Checkstyle</strong>.</p>
<div class="callout ok">Static analysis is a natural fit for CI (Chapter 8): every push is scanned, and the build fails if new "code smells" or security issues appear — defects are blocked before they ever reach a tester.</div>
<h3>Ví dụ có lời giải · Worked example (choose the review type)</h3>
<p>A team of five must review a <em>safety-critical</em> flight-control module with strict certification requirements. Which review type, and who leads?</p>
<ul>
  <li><strong>Choice:</strong> a formal <strong>inspection</strong> — safety-critical code demands the most rigorous, metric-driven method with entry/exit criteria and checklists.</li>
  <li><strong>Leader:</strong> a trained <strong>moderator</strong>, explicitly <em>not</em> the author, to keep the process objective and independent.</li>
  <li><strong>Why not a walkthrough?</strong> A walkthrough is author-led and informal — appropriate for sharing knowledge or reviewing a design sketch, but too weak for certification-grade assurance.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Modern code review = the pull request.</b> Today most "reviews" happen as <b>PR reviews on GitHub/GitLab</b>: the author opens a pull request, CI runs static analysis + tests automatically, and reviewers comment inline before approving the merge. It is a lightweight technical review fused with tool-based static analysis. Research (and Google/Microsoft studies) shows the biggest payoff is not defect-finding but <em>knowledge sharing</em> and keeping the codebase consistent — echoing the walkthrough's original goals.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Set up SonarQube / SpotBugs static analysis</span><span class="lc-sub">Install &amp; run a static analyser on your own project — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Static testing — tìm defect mà không chạy code</h2>
<p class="lead"><strong>Static testing (kiểm thử tĩnh)</strong> xem xét các sản phẩm — yêu cầu, thiết kế, code, test case — <em>mà không thực thi</em>. Đây là cách rẻ nhất để bắt defect vì nó tìm ra chúng <strong>sớm</strong>, thường ngay trong tài liệu, rất lâu trước khi có code. Nó chia hai nhánh: <strong>review</strong> (do con người) và <strong>static analysis</strong> (do công cụ).</p>
<div class="callout">Vì sao lời: một chỗ mơ hồ trong yêu cầu bị bắt lúc review chỉ tốn vài phút sửa; chính chỗ mơ hồ đó phát hiện sau phát hành — dưới dạng tính năng sai đã giao cho người dùng — có thể tốn hàng nghìn đô. Đó là Nguyên tắc 3 (test sớm) quy ra tiền.</div>
<h3>Phổ các loại review (informal → formal)</h3>
<table>
  <thead><tr><th>Loại</th><th>Mức hình thức</th><th>Do ai dẫn</th><th>Mục tiêu</th></tr></thead>
  <tbody>
    <tr><td>Informal review</td><td>Thấp nhất — không quy trình</td><td>bất kỳ ai (buddy check)</td><td>phản hồi nhanh, rẻ</td></tr>
    <tr><td>Walkthrough</td><td>Thấp–trung</td><td><strong>tác giả</strong></td><td>tác giả dẫn đồng nghiệp qua tài liệu; học hỏi, tìm defect, đạt đồng thuận</td></tr>
    <tr><td>Technical review</td><td>Trung–cao</td><td>moderator được đào tạo / đồng nghiệp</td><td>chuyên gia kỹ thuật thảo luận &amp; quyết; tìm defect, đánh giá phương án</td></tr>
    <tr><td>Inspection</td><td>Cao nhất — chính quy</td><td><strong>moderator</strong> được đào tạo (không phải tác giả)</td><td>tìm defect nghiêm ngặt, dựa số liệu, có entry/exit criteria &amp; checklist</td></tr>
  </tbody>
</table>
<h3>Các vai trò trong một review chính quy</h3>
<ul>
  <li><strong>Author (tác giả)</strong> — tạo ra sản phẩm; sửa defect sau đó (nhưng không được dẫn một inspection).</li>
  <li><strong>Moderator (điều phối)</strong> — lập kế hoạch &amp; điều hành buổi họp, giữ khách quan và tập trung vào defect (không vào con người).</li>
  <li><strong>Reviewers (người review)</strong> — chuyên gia kỹ thuật tìm vấn đề.</li>
  <li><strong>Scribe (thư ký)</strong> — ghi lại mọi defect tìm được.</li>
  <li><strong>Manager (quản lý)</strong> — quyết định làm review, cấp nguồn lực (thường không dự họp).</li>
</ul>
<div class="pitfall">Quy tắc vàng của review: <strong>review sản phẩm, không phải con người.</strong> Buổi họp ghi defect; nó <em>không</em> phán xét tác giả hay đề xuất giải pháp tại chỗ (làm phí thời gian chuyên gia). Giữ nó tập trung vào defect và không đổ lỗi chính là lý do một moderator được đào tạo — không bao giờ là tác giả — điều hành inspection.</div>
<h3>Static analysis bằng công cụ</h3>
<p>Công cụ phân tích mã nguồn (không chạy) để chỉ ra defect mắt người bỏ sót: code "chết" không đến được, biến chưa khởi tạo, rủi ro null-pointer, vi phạm chuẩn code, mẫu bảo mật (SQL injection), và hàm quá phức tạp (cyclomatic complexity cao — Chương 5). Công cụ phổ biến: <strong>SonarQube, SpotBugs, ESLint, Checkstyle</strong>.</p>
<div class="callout ok">Static analysis hợp tự nhiên với CI (Chương 8): mỗi lần push đều được quét, và build fail nếu xuất hiện "code smell" hay vấn đề bảo mật mới — defect bị chặn trước khi đến tay tester.</div>
<h3>Ví dụ có lời giải · Chọn loại review</h3>
<p>Một đội năm người phải review một module điều khiển bay <em>an toàn-trọng yếu</em> với yêu cầu chứng nhận nghiêm ngặt. Chọn loại review nào, ai dẫn?</p>
<ul>
  <li><strong>Chọn:</strong> một <strong>inspection</strong> chính quy — code an toàn-trọng yếu đòi phương pháp nghiêm ngặt nhất, dựa số liệu, có entry/exit criteria &amp; checklist.</li>
  <li><strong>Người dẫn:</strong> một <strong>moderator</strong> được đào tạo, rõ ràng <em>không</em> phải tác giả, để giữ quy trình khách quan &amp; độc lập.</li>
  <li><strong>Sao không dùng walkthrough?</strong> Walkthrough do tác giả dẫn và informal — hợp để chia sẻ kiến thức hay review bản phác thiết kế, nhưng quá yếu cho mức đảm bảo đạt chứng nhận.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Code review hiện đại = pull request.</b> Ngày nay hầu hết "review" diễn ra dưới dạng <b>PR review trên GitHub/GitLab</b>: tác giả mở pull request, CI tự chạy static analysis + test, và reviewer bình luận inline trước khi duyệt merge. Đó là một technical review nhẹ hợp nhất với static analysis bằng công cụ. Nghiên cứu (và các nghiên cứu của Google/Microsoft) cho thấy lợi ích lớn nhất không phải tìm defect mà là <em>chia sẻ kiến thức</em> và giữ codebase nhất quán — đúng mục tiêu gốc của walkthrough.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Cài SonarQube / SpotBugs static analysis</span><span class="lc-sub">Cài &amp; chạy trình phân tích tĩnh trên dự án của bạn — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 3 — Static testing|||Quiz 3 — Kiểm thử tĩnh',
          slug: 'swt301-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra các loại review, vai trò và static analysis.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Static testing is defined by the fact that it…|||Static testing được định nghĩa bởi việc nó…', options: ['runs the code many times|||chạy code nhiều lần', 'examines work products WITHOUT executing them|||xem xét sản phẩm MÀ KHÔNG thực thi', 'only tests the UI|||chỉ test UI', 'is done after release|||làm sau phát hành'], correctIndex: 1, points: 1 },
              { question: 'Which review type is the MOST formal?|||Loại review nào CHÍNH QUY nhất?', options: ['informal review|||informal review', 'walkthrough|||walkthrough', 'technical review|||technical review', 'inspection|||inspection'], correctIndex: 3, points: 1 },
              { question: 'A walkthrough is typically led by the…|||Walkthrough thường do ai dẫn?', options: ['moderator|||moderator', 'author|||tác giả', 'manager|||quản lý', 'scribe|||thư ký'], correctIndex: 1, points: 1 },
              { question: 'Who records the defects found during a formal review?|||Ai ghi lại các defect tìm thấy trong review chính quy?', options: ['the manager|||quản lý', 'the scribe (recorder)|||scribe (thư ký)', 'the customer|||khách hàng', 'nobody|||không ai'], correctIndex: 1, points: 1 },
              { question: 'Which can static analysis tools detect WITHOUT running code?|||Công cụ static analysis phát hiện được gì MÀ KHÔNG chạy code?', options: ['actual response time under load|||thời gian phản hồi thực dưới tải', 'unreachable dead code &amp; uninitialised variables|||code chết không tới được &amp; biến chưa khởi tạo', 'user satisfaction|||sự hài lòng người dùng', 'network latency|||độ trễ mạng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — TEST DESIGN: BLACK-BOX ══════════════════ */
    {
      title: 'Chapter 4 — Test design: black-box techniques|||Chương 4 — Thiết kế test: kỹ thuật black-box',
      description: 'Thiết kế test từ đặc tả mà không nhìn code: equivalence partitioning, boundary value analysis, decision table, state transition.',
      lessons: [
        {
          title: '4.1 — Equivalence partitioning & boundary value analysis|||4.1 — Equivalence partitioning & boundary value analysis',
          slug: 'swt301-blackbox-ep-bva',
          type: 'VIDEO',
          description: 'Chia miền input thành lớp tương đương và tấn công các giá trị biên — hai kỹ thuật black-box quan trọng nhất.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Black-box testing: design from the specification</h2>
<p class="lead"><strong>Black-box (specification-based)</strong> techniques design test cases from what the software <em>should do</em> — the requirements — without looking at the code inside. They answer the impossible question of Principle 2 ("you can't test everything") by choosing a <strong>small, high-value set</strong> of inputs.</p>
<h3>Equivalence Partitioning (EP)</h3>
<p>Divide the input domain into <strong>partitions</strong> (classes) where the software should behave the <em>same way</em>. Test <strong>one representative</strong> from each partition — if it works for one, it should work for all in that class. Always include both <strong>valid</strong> and <strong>invalid</strong> partitions.</p>
<h3>Boundary Value Analysis (BVA)</h3>
<p>Defects cluster at the <strong>edges</strong> of partitions (off-by-one errors: <code>&gt;</code> vs <code>&gt;=</code>). BVA tests the values <em>on and just around</em> each boundary. The common "3-value" BVA tests: boundary−1, boundary, boundary+1.</p>
<div class="callout">EP reduces the <em>number</em> of tests; BVA sharpens <em>where</em> they hit. In practice you use them together: partition first, then add boundary values for each partition edge.</div>
<h3>Ví dụ có lời giải · Worked example (a grading function)</h3>
<p>Spec: <code>grade(int score)</code> accepts a score from <strong>0 to 100</strong>. Below 50 → "Fail", 50–100 → "Pass". Anything outside 0–100 is invalid input (error message).</p>
<p><strong>Step 1 — Equivalence partitions:</strong></p>
<table>
  <thead><tr><th>Partition</th><th>Range</th><th>Valid?</th><th>Representative</th></tr></thead>
  <tbody>
    <tr><td>P1 — too low</td><td>score &lt; 0</td><td>invalid</td><td>−10</td></tr>
    <tr><td>P2 — Fail</td><td>0 ≤ score &lt; 50</td><td>valid</td><td>25</td></tr>
    <tr><td>P3 — Pass</td><td>50 ≤ score ≤ 100</td><td>valid</td><td>75</td></tr>
    <tr><td>P4 — too high</td><td>score &gt; 100</td><td>invalid</td><td>150</td></tr>
  </tbody>
</table>
<p><strong>Step 2 — Boundary values</strong> (the edges: 0, 50, 100):</p>
<table>
  <thead><tr><th>Boundary</th><th>Values to test</th><th>Expected</th></tr></thead>
  <tbody>
    <tr><td>lower valid edge</td><td>−1 / 0 / 1</td><td>invalid / Fail / Fail</td></tr>
    <tr><td>pass threshold</td><td>49 / 50 / 51</td><td>Fail / Pass / Pass</td></tr>
    <tr><td>upper valid edge</td><td>99 / 100 / 101</td><td>Pass / Pass / invalid</td></tr>
  </tbody>
</table>
<p><strong>Step 3 — turn it into JUnit:</strong></p>
<pre><span class="tok-keyword">import</span> org.junit.jupiter.api.Test;
<span class="tok-keyword">import static</span> org.junit.jupiter.api.Assertions.*;

<span class="tok-keyword">class</span> <span class="tok-type">GradeTest</span> {
    <span class="tok-type">Grader</span> g = <span class="tok-keyword">new</span> <span class="tok-function">Grader</span>();

    <span class="tok-comment">// P2 (Fail) + boundary 49</span>
    <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">below50IsFail</span>() {
        <span class="tok-function">assertEquals</span>(<span class="tok-string">"Fail"</span>, g.<span class="tok-function">grade</span>(49));
    }
    <span class="tok-comment">// boundary 50 — the classic off-by-one spot</span>
    <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">exactly50IsPass</span>() {
        <span class="tok-function">assertEquals</span>(<span class="tok-string">"Pass"</span>, g.<span class="tok-function">grade</span>(50));
    }
    <span class="tok-comment">// P4 invalid — expect an exception</span>
    <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">above100IsInvalid</span>() {
        <span class="tok-function">assertThrows</span>(<span class="tok-type">IllegalArgumentException</span>.<span class="tok-keyword">class</span>, () -&gt; g.<span class="tok-function">grade</span>(101));
    }
}</pre>
<div class="out">If grade() used <code>score &gt; 50</code> instead of <code>&gt;= 50</code>, the test <code>exactly50IsPass</code> FAILS — expected "Pass" but got "Fail". BVA caught the off-by-one.</div>
<div class="pitfall">The most common beginner mistake: testing only "nice middle" values (25, 75) and skipping the boundaries. That misses the exact defects (49/50, 100/101) that BVA is designed to expose. A partition without its boundaries tested is only half-tested.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>2-value vs 3-value BVA, and multi-dimensional boundaries.</b> Some standards use only 2 boundary values per edge (boundary and boundary+1 on the invalid side); ISTQB teaches 3-value (b−1, b, b+1). When a function has <em>several</em> inputs each with boundaries, testing every combination explodes — real teams use <b>pairwise (all-pairs) testing</b> to cover all pairs of boundary values with far fewer cases, since most defects involve at most two interacting parameters.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Black-box testing: thiết kế từ đặc tả</h2>
<p class="lead">Kỹ thuật <strong>black-box (specification-based)</strong> thiết kế test case từ những gì phần mềm <em>phải làm</em> — yêu cầu — mà không nhìn code bên trong. Chúng trả lời bài toán bất khả của Nguyên tắc 2 ("không thể test hết") bằng cách chọn một <strong>tập nhỏ, giá trị cao</strong> các input.</p>
<h3>Equivalence Partitioning (EP) — chia lớp tương đương</h3>
<p>Chia miền input thành các <strong>partition</strong> (lớp) mà phần mềm nên hành xử <em>giống nhau</em>. Test <strong>một đại diện</strong> mỗi partition — nếu chạy đúng cho một, thì đúng cho cả lớp. Luôn gồm cả partition <strong>hợp lệ (valid)</strong> và <strong>không hợp lệ (invalid)</strong>.</p>
<h3>Boundary Value Analysis (BVA) — phân tích giá trị biên</h3>
<p>Defect co cụm ở <strong>rìa (biên)</strong> của partition (lỗi off-by-one: <code>&gt;</code> vs <code>&gt;=</code>). BVA test các giá trị <em>ngay tại và sát quanh</em> mỗi biên. BVA "3 giá trị" phổ biến test: biên−1, biên, biên+1.</p>
<div class="callout">EP giảm <em>số lượng</em> test; BVA làm sắc <em>vị trí</em> test đánh vào. Thực tế dùng chung: chia partition trước, rồi thêm giá trị biên cho từng rìa partition.</div>
<h3>Ví dụ có lời giải · Một hàm chấm điểm</h3>
<p>Spec: <code>grade(int score)</code> nhận điểm từ <strong>0 đến 100</strong>. Dưới 50 → "Fail", 50–100 → "Pass". Ngoài 0–100 là input không hợp lệ (báo lỗi).</p>
<p><strong>Bước 1 — Các partition tương đương:</strong></p>
<table>
  <thead><tr><th>Partition</th><th>Khoảng</th><th>Hợp lệ?</th><th>Đại diện</th></tr></thead>
  <tbody>
    <tr><td>P1 — quá thấp</td><td>score &lt; 0</td><td>invalid</td><td>−10</td></tr>
    <tr><td>P2 — Fail</td><td>0 ≤ score &lt; 50</td><td>valid</td><td>25</td></tr>
    <tr><td>P3 — Pass</td><td>50 ≤ score ≤ 100</td><td>valid</td><td>75</td></tr>
    <tr><td>P4 — quá cao</td><td>score &gt; 100</td><td>invalid</td><td>150</td></tr>
  </tbody>
</table>
<p><strong>Bước 2 — Giá trị biên</strong> (các rìa: 0, 50, 100):</p>
<table>
  <thead><tr><th>Biên</th><th>Giá trị cần test</th><th>Mong đợi</th></tr></thead>
  <tbody>
    <tr><td>rìa hợp lệ dưới</td><td>−1 / 0 / 1</td><td>invalid / Fail / Fail</td></tr>
    <tr><td>ngưỡng đậu</td><td>49 / 50 / 51</td><td>Fail / Pass / Pass</td></tr>
    <tr><td>rìa hợp lệ trên</td><td>99 / 100 / 101</td><td>Pass / Pass / invalid</td></tr>
  </tbody>
</table>
<p><strong>Bước 3 — biến thành JUnit:</strong></p>
<pre><span class="tok-keyword">import</span> org.junit.jupiter.api.Test;
<span class="tok-keyword">import static</span> org.junit.jupiter.api.Assertions.*;

<span class="tok-keyword">class</span> <span class="tok-type">GradeTest</span> {
    <span class="tok-type">Grader</span> g = <span class="tok-keyword">new</span> <span class="tok-function">Grader</span>();

    <span class="tok-comment">// P2 (Fail) + biên 49</span>
    <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">below50IsFail</span>() {
        <span class="tok-function">assertEquals</span>(<span class="tok-string">"Fail"</span>, g.<span class="tok-function">grade</span>(49));
    }
    <span class="tok-comment">// biên 50 — điểm off-by-one kinh điển</span>
    <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">exactly50IsPass</span>() {
        <span class="tok-function">assertEquals</span>(<span class="tok-string">"Pass"</span>, g.<span class="tok-function">grade</span>(50));
    }
    <span class="tok-comment">// P4 invalid — mong đợi ném ngoại lệ</span>
    <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">above100IsInvalid</span>() {
        <span class="tok-function">assertThrows</span>(<span class="tok-type">IllegalArgumentException</span>.<span class="tok-keyword">class</span>, () -&gt; g.<span class="tok-function">grade</span>(101));
    }
}</pre>
<div class="out">Nếu grade() dùng <code>score &gt; 50</code> thay vì <code>&gt;= 50</code>, test <code>exactly50IsPass</code> FAIL — mong "Pass" nhưng nhận "Fail". BVA đã bắt được lỗi off-by-one.</div>
<div class="pitfall">Lỗi phổ biến nhất của người mới: chỉ test giá trị "giữa đẹp" (25, 75) và bỏ biên. Điều đó bỏ lỡ đúng các defect (49/50, 100/101) mà BVA sinh ra để phơi bày. Một partition mà không test biên chỉ mới test một nửa.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>BVA 2-giá-trị vs 3-giá-trị, và biên đa chiều.</b> Một số chuẩn chỉ dùng 2 giá trị biên mỗi rìa (biên và biên+1 ở phía invalid); ISTQB dạy 3-giá-trị (b−1, b, b+1). Khi một hàm có <em>nhiều</em> input, mỗi cái có biên riêng, test mọi tổ hợp sẽ bùng nổ — đội thực tế dùng <b>pairwise (all-pairs) testing</b> để phủ mọi cặp giá trị biên với số case ít hơn nhiều, vì phần lớn defect chỉ liên quan tối đa hai tham số tương tác.</div>
</div>
`,
        },
        {
          title: '4.2 — Decision tables & state transition testing|||4.2 — Decision table & state transition testing',
          slug: 'swt301-blackbox-decision-state',
          type: 'VIDEO',
          description: 'Xử lý tổ hợp điều kiện phức tạp bằng decision table và luồng trạng thái bằng state transition testing.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Decision tables — combinations of conditions</h2>
<p class="lead">When behaviour depends on <strong>several conditions combined</strong> (business rules), a <strong>decision table</strong> guarantees you cover every combination systematically. Columns are <em>rules</em> (combinations); rows are <em>conditions</em> and <em>actions</em>.</p>
<h3>Ví dụ có lời giải · Worked example (loan approval)</h3>
<p>Rule: a loan is <strong>approved</strong> only if the applicant has a <em>good credit score</em> AND <em>stable income</em>. If credit is good but income unstable → "manual review". Otherwise → "reject".</p>
<table>
  <thead><tr><th>Conditions</th><th>R1</th><th>R2</th><th>R3</th><th>R4</th></tr></thead>
  <tbody>
    <tr><td>Good credit?</td><td>T</td><td>T</td><td>F</td><td>F</td></tr>
    <tr><td>Stable income?</td><td>T</td><td>F</td><td>T</td><td>F</td></tr>
    <tr><td><strong>Action</strong></td><td>Approve</td><td>Manual review</td><td>Reject</td><td>Reject</td></tr>
  </tbody>
</table>
<p>Two boolean conditions → 2² = <strong>4 rules</strong>, each becoming one test case. The table makes it obvious that R3 and R4 both "reject" — you might later <em>collapse</em> them (credit=F → reject regardless of income), which is exactly what a <em>collapsed decision table</em> does to cut redundant tests.</p>
<div class="pitfall">With N independent conditions you get 2^N rules — 4 conditions is already 16. Do not silently drop rules to save time; instead collapse rules that share the same action via "don't care" (–) entries. Dropping a rule you did not analyse is how a real business case goes untested.</div>
<h2>State transition testing</h2>
<p class="lead">For systems whose behaviour depends on <strong>history/current state</strong> (not just the current input), model it as a <strong>state machine</strong>: states, events, transitions, and actions. You then design tests to cover transitions.</p>
<h3>Ví dụ có lời giải · Worked example (a media player)</h3>
<p>States: <em>Stopped, Playing, Paused</em>. Events: <em>play, pause, stop</em>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Stopped</div><div class="lz-t">— play →</div><div class="lz-d">Playing</div></div>
  <div class="lz-step"><div class="lz-k">Playing</div><div class="lz-t">— pause →</div><div class="lz-d">Paused</div></div>
  <div class="lz-step"><div class="lz-k">Paused</div><div class="lz-t">— play →</div><div class="lz-d">Playing</div></div>
  <div class="lz-step"><div class="lz-k">Playing/Paused</div><div class="lz-t">— stop →</div><div class="lz-d">Stopped</div></div>
</div>
<ul>
  <li><strong>Valid transitions</strong> to test: Stopped→Playing, Playing→Paused, Paused→Playing, Playing→Stopped, Paused→Stopped.</li>
  <li><strong>Invalid transitions</strong> (should be rejected/ignored): pressing "pause" while Stopped, "stop" while already Stopped. Testing these <em>negative</em> transitions is where real bugs hide.</li>
</ul>
<div class="callout">Coverage levels: <strong>0-switch</strong> (each single transition once), <strong>1-switch</strong> (each pair of consecutive transitions), and full <strong>state coverage</strong> vs full <strong>transition coverage</strong>. Transition coverage is stronger — visiting every state does not mean you exercised every arrow between them.</div>
<div class="callout ok">Rule of thumb for picking a technique: independent inputs with ranges → EP + BVA; combinations of business rules → decision table; behaviour that depends on <em>what happened before</em> → state transition.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>State explosion &amp; model-based testing.</b> Real systems have far more than three states; combined with many events, the state machine explodes into thousands of transitions no human can enumerate. <b>Model-based testing (MBT)</b> tools (e.g. GraphWalker) let you draw the model once and <em>auto-generate</em> test paths that satisfy a chosen coverage criterion — turning a diagram directly into executable tests. It is state-transition testing scaled up by automation.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practise designing &amp; coding test cases</span><span class="lc-sub">Write JUnit tests for functions with ranges, rules and states — on CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Decision table — tổ hợp các điều kiện</h2>
<p class="lead">Khi hành vi phụ thuộc <strong>nhiều điều kiện kết hợp</strong> (quy tắc nghiệp vụ), <strong>decision table</strong> đảm bảo bạn phủ mọi tổ hợp một cách hệ thống. Cột là <em>rule</em> (tổ hợp); hàng là <em>điều kiện</em> và <em>hành động</em>.</p>
<h3>Ví dụ có lời giải · Duyệt khoản vay</h3>
<p>Quy tắc: khoản vay được <strong>duyệt</strong> chỉ khi người vay có <em>điểm tín dụng tốt</em> VÀ <em>thu nhập ổn định</em>. Nếu tín dụng tốt nhưng thu nhập không ổn → "xét thủ công". Ngược lại → "từ chối".</p>
<table>
  <thead><tr><th>Điều kiện</th><th>R1</th><th>R2</th><th>R3</th><th>R4</th></tr></thead>
  <tbody>
    <tr><td>Tín dụng tốt?</td><td>T</td><td>T</td><td>F</td><td>F</td></tr>
    <tr><td>Thu nhập ổn?</td><td>T</td><td>F</td><td>T</td><td>F</td></tr>
    <tr><td><strong>Hành động</strong></td><td>Duyệt</td><td>Xét thủ công</td><td>Từ chối</td><td>Từ chối</td></tr>
  </tbody>
</table>
<p>Hai điều kiện boolean → 2² = <strong>4 rule</strong>, mỗi cái thành một test case. Bảng cho thấy rõ R3 và R4 đều "từ chối" — sau này bạn có thể <em>gộp (collapse)</em> chúng (tín dụng=F → từ chối bất kể thu nhập), đúng việc mà <em>collapsed decision table</em> làm để cắt test dư.</p>
<div class="pitfall">Với N điều kiện độc lập bạn có 2^N rule — 4 điều kiện đã là 16. Đừng âm thầm bỏ rule để tiết kiệm; hãy gộp các rule cùng hành động qua ô "don't care" (–). Bỏ một rule chưa phân tích là cách một tình huống nghiệp vụ thật không được test.</div>
<h2>State transition testing (kiểm thử chuyển trạng thái)</h2>
<p class="lead">Với hệ thống mà hành vi phụ thuộc <strong>lịch sử/trạng thái hiện tại</strong> (không chỉ input hiện tại), hãy mô hình hoá thành <strong>máy trạng thái</strong>: trạng thái, sự kiện, chuyển tiếp, hành động. Rồi thiết kế test để phủ các chuyển tiếp.</p>
<h3>Ví dụ có lời giải · Một trình phát nhạc</h3>
<p>Trạng thái: <em>Stopped, Playing, Paused</em>. Sự kiện: <em>play, pause, stop</em>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Stopped</div><div class="lz-t">— play →</div><div class="lz-d">Playing</div></div>
  <div class="lz-step"><div class="lz-k">Playing</div><div class="lz-t">— pause →</div><div class="lz-d">Paused</div></div>
  <div class="lz-step"><div class="lz-k">Paused</div><div class="lz-t">— play →</div><div class="lz-d">Playing</div></div>
  <div class="lz-step"><div class="lz-k">Playing/Paused</div><div class="lz-t">— stop →</div><div class="lz-d">Stopped</div></div>
</div>
<ul>
  <li><strong>Chuyển tiếp hợp lệ</strong> cần test: Stopped→Playing, Playing→Paused, Paused→Playing, Playing→Stopped, Paused→Stopped.</li>
  <li><strong>Chuyển tiếp không hợp lệ</strong> (nên bị từ chối/bỏ qua): bấm "pause" khi đang Stopped, "stop" khi đã Stopped. Test các chuyển tiếp <em>âm (negative)</em> này là nơi bug thật ẩn nấp.</li>
</ul>
<div class="callout">Các mức phủ: <strong>0-switch</strong> (mỗi chuyển tiếp đơn một lần), <strong>1-switch</strong> (mỗi cặp chuyển tiếp liên tiếp), và phủ <strong>trạng thái (state coverage)</strong> vs phủ <strong>chuyển tiếp (transition coverage)</strong>. Transition coverage mạnh hơn — thăm mọi trạng thái không có nghĩa bạn đã đi qua mọi mũi tên giữa chúng.</div>
<div class="callout ok">Quy tắc chọn kỹ thuật: input độc lập có khoảng → EP + BVA; tổ hợp quy tắc nghiệp vụ → decision table; hành vi phụ thuộc <em>điều đã xảy ra trước đó</em> → state transition.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bùng nổ trạng thái &amp; model-based testing.</b> Hệ thống thật có nhiều hơn ba trạng thái rất nhiều; cộng với nhiều sự kiện, máy trạng thái bùng nổ thành hàng nghìn chuyển tiếp không người nào liệt kê nổi. Công cụ <b>model-based testing (MBT)</b> (vd GraphWalker) cho bạn vẽ mô hình một lần rồi <em>tự sinh</em> đường test thoả một tiêu chí phủ đã chọn — biến sơ đồ thành test chạy được. Đó là state-transition testing được nhân rộng bằng automation.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện thiết kế &amp; code test case</span><span class="lc-sub">Viết JUnit test cho hàm có khoảng, quy tắc và trạng thái — trên CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 4 — Black-box techniques|||Quiz 4 — Kỹ thuật black-box',
          slug: 'swt301-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra EP, BVA, decision table và state transition — gồm câu tính toán.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Equivalence partitioning aims to…|||Equivalence partitioning nhằm…', options: ['test every possible input|||test mọi input có thể', 'test one representative per class of same-behaviour inputs|||test một đại diện mỗi lớp input cùng hành vi', 'look at the source code|||nhìn mã nguồn', 'measure performance|||đo hiệu năng'], correctIndex: 1, points: 1 },
              { question: 'For a field valid 1–100, the best BVA values are…|||Với trường hợp lệ 1–100, giá trị BVA tốt nhất là…', options: ['50 only|||chỉ 50', '0, 1, 100, 101|||0, 1, 100, 101', '25 and 75|||25 và 75', 'any random values|||giá trị ngẫu nhiên'], correctIndex: 1, points: 1 },
              { question: 'A decision table with 3 independent boolean conditions has how many rules?|||Một decision table với 3 điều kiện boolean độc lập có bao nhiêu rule?', options: ['3', '6', '8', '9'], correctIndex: 2, points: 1 },
              { question: 'Which technique best fits behaviour that depends on the current state &amp; history?|||Kỹ thuật nào hợp nhất cho hành vi phụ thuộc trạng thái hiện tại &amp; lịch sử?', options: ['equivalence partitioning|||equivalence partitioning', 'boundary value analysis|||boundary value analysis', 'state transition testing|||state transition testing', 'statement coverage|||statement coverage'], correctIndex: 2, points: 1 },
              { question: 'Testing an INVALID transition (e.g. pause while stopped) is important because…|||Test một chuyển tiếp KHÔNG hợp lệ (vd pause khi đang stopped) quan trọng vì…', options: ['it is faster|||nhanh hơn', 'negative transitions are where many real defects hide|||chuyển tiếp âm là nơi nhiều defect thật ẩn nấp', 'it improves performance|||cải thiện hiệu năng', 'it is required by law|||luật bắt buộc'], correctIndex: 1, points: 1 },
              { question: 'Transition coverage is stronger than state coverage because…|||Transition coverage mạnh hơn state coverage vì…', options: ['it visits fewer states|||thăm ít trạng thái hơn', 'visiting every state does not exercise every transition between them|||thăm mọi trạng thái không đi qua mọi chuyển tiếp giữa chúng', 'it needs no model|||không cần mô hình', 'it is a white-box technique|||là kỹ thuật white-box'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — TEST DESIGN: WHITE-BOX ══════════════════ */
    {
      title: 'Chapter 5 — Test design: white-box techniques|||Chương 5 — Thiết kế test: kỹ thuật white-box',
      description: 'Thiết kế test từ cấu trúc code: statement/branch/path coverage và tính cyclomatic complexity V(G).',
      lessons: [
        {
          title: '5.1 — Coverage: statement, branch & path|||5.1 — Coverage: statement, branch & path',
          slug: 'swt301-whitebox-coverage',
          type: 'VIDEO',
          description: 'Đo bao nhiêu code đã được test đi qua bằng statement, branch (decision) và path coverage.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>White-box testing: design from the code structure</h2>
<p class="lead"><strong>White-box (structure-based)</strong> techniques design tests from the <em>internal code</em>. Instead of asking "does it meet the spec?", they ask "have my tests actually <strong>executed</strong> every line, every branch, every path?". The measure is <strong>coverage</strong> — a percentage.</p>
<div class="formula"><span class="lbl">Statement coverage</span>= (executed statements / total statements) × 100%    <span class="lbl">Branch (decision) coverage</span>= (executed branch outcomes / total branch outcomes) × 100%</div>
<h3>The three levels, weakest to strongest</h3>
<ul>
  <li><strong>Statement coverage</strong> — every executable line runs at least once. Weakest: it can miss the "else-that-does-nothing" path.</li>
  <li><strong>Branch / Decision coverage</strong> — every decision (if/while) takes both TRUE and FALSE at least once. Stronger — and 100% branch coverage guarantees 100% statement coverage, but not vice-versa.</li>
  <li><strong>Path coverage</strong> — every independent path through the code runs. Strongest, but the number of paths explodes with loops, so it is usually impractical for whole programs.</li>
</ul>
<h3>Ví dụ có lời giải · Worked example (why branch &gt; statement)</h3>
<pre><span class="tok-keyword">int</span> <span class="tok-function">discount</span>(<span class="tok-keyword">int</span> total) {
    <span class="tok-keyword">int</span> d = 0;
    <span class="tok-keyword">if</span> (total &gt; 100) {
        d = 10;
    }
    <span class="tok-keyword">return</span> total - d;
}</pre>
<p>One test with <code>total = 200</code> executes every <em>line</em> (d=0, the if body, the return) → <strong>100% statement coverage</strong>. But the <code>if</code> only ever took the <strong>TRUE</strong> branch! The FALSE branch (total ≤ 100) was never tested — a defect there (e.g. a wrong return when no discount applies) would be missed.</p>
<div class="out">total = 200 → statement coverage 100%, branch coverage only 50% (TRUE taken, FALSE not). Add total = 50 → now both branches covered → branch coverage 100%.</div>
<div class="pitfall"><b>100% statement coverage is not "fully tested".</b> The example proves it: a single input reached every line yet tested only half the decisions. This is why serious projects target <em>branch/decision</em> coverage, not statement coverage — and why coverage alone (even 100%) never proves correctness (see the ★ below).</div>
<h3>JUnit + a coverage tool</h3>
<pre><span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">withDiscount</span>()    { <span class="tok-function">assertEquals</span>(190, d.<span class="tok-function">discount</span>(200)); } <span class="tok-comment">// TRUE branch</span>
<span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">withoutDiscount</span>() { <span class="tok-function">assertEquals</span>(50,  d.<span class="tok-function">discount</span>(50));  } <span class="tok-comment">// FALSE branch</span></pre>
<div class="out">Run with JaCoCo (Java coverage tool): both branches green → 100% branch coverage. The report highlights any red (uncovered) line so you know exactly what to test next.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Coverage ≠ correctness.</b> You can reach 100% coverage with tests that <em>assert nothing</em> — they run every line but never check the result. Coverage tells you what code was <em>executed</em>, not whether its output was <em>correct</em>. Stronger criteria exist: <b>MC/DC (Modified Condition/Decision Coverage)</b>, required for aviation software (DO-178C), ensures each boolean sub-condition independently affects the outcome. And the real question — "are my assertions any good?" — is answered by <b>mutation testing</b> (Chapter 10), not by coverage.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>White-box testing: thiết kế từ cấu trúc code</h2>
<p class="lead">Kỹ thuật <strong>white-box (structure-based)</strong> thiết kế test từ <em>code bên trong</em>. Thay vì hỏi "có khớp spec không?", chúng hỏi "test của tôi đã thực sự <strong>thực thi</strong> mọi dòng, mọi nhánh, mọi đường đi chưa?". Thước đo là <strong>coverage</strong> — một tỉ lệ phần trăm.</p>
<div class="formula"><span class="lbl">Statement coverage</span>= (số câu lệnh đã chạy / tổng câu lệnh) × 100%    <span class="lbl">Branch (decision) coverage</span>= (số kết cục nhánh đã chạy / tổng kết cục nhánh) × 100%</div>
<h3>Ba mức, yếu đến mạnh</h3>
<ul>
  <li><strong>Statement coverage</strong> — mọi dòng chạy được đều chạy ít nhất một lần. Yếu nhất: có thể bỏ sót nhánh "else-không-làm-gì".</li>
  <li><strong>Branch / Decision coverage</strong> — mọi quyết định (if/while) đều lấy cả TRUE và FALSE ít nhất một lần. Mạnh hơn — và 100% branch coverage đảm bảo 100% statement coverage, nhưng chiều ngược lại thì không.</li>
  <li><strong>Path coverage</strong> — mọi đường đi độc lập qua code đều chạy. Mạnh nhất, nhưng số đường bùng nổ với vòng lặp, nên thường bất khả thi cho cả chương trình.</li>
</ul>
<h3>Ví dụ có lời giải · Vì sao branch &gt; statement</h3>
<pre><span class="tok-keyword">int</span> <span class="tok-function">discount</span>(<span class="tok-keyword">int</span> total) {
    <span class="tok-keyword">int</span> d = 0;
    <span class="tok-keyword">if</span> (total &gt; 100) {
        d = 10;
    }
    <span class="tok-keyword">return</span> total - d;
}</pre>
<p>Một test với <code>total = 200</code> chạy mọi <em>dòng</em> (d=0, thân if, return) → <strong>100% statement coverage</strong>. Nhưng <code>if</code> chỉ từng lấy nhánh <strong>TRUE</strong>! Nhánh FALSE (total ≤ 100) chưa hề được test — một defect ở đó (vd return sai khi không có chiết khấu) sẽ bị bỏ sót.</p>
<div class="out">total = 200 → statement coverage 100%, branch coverage chỉ 50% (TRUE lấy, FALSE chưa). Thêm total = 50 → giờ cả hai nhánh được phủ → branch coverage 100%.</div>
<div class="pitfall"><b>100% statement coverage không phải "đã test đầy đủ".</b> Ví dụ chứng minh: một input duy nhất chạm mọi dòng nhưng chỉ test nửa số quyết định. Vì thế dự án nghiêm túc nhắm <em>branch/decision</em> coverage, không phải statement — và vì thế coverage đơn thuần (kể cả 100%) không bao giờ chứng minh tính đúng (xem ★ dưới).</div>
<h3>JUnit + công cụ coverage</h3>
<pre><span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">withDiscount</span>()    { <span class="tok-function">assertEquals</span>(190, d.<span class="tok-function">discount</span>(200)); } <span class="tok-comment">// nhánh TRUE</span>
<span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">withoutDiscount</span>() { <span class="tok-function">assertEquals</span>(50,  d.<span class="tok-function">discount</span>(50));  } <span class="tok-comment">// nhánh FALSE</span></pre>
<div class="out">Chạy với JaCoCo (công cụ coverage Java): cả hai nhánh xanh → 100% branch coverage. Báo cáo tô đỏ dòng chưa phủ để bạn biết chính xác cần test gì tiếp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Coverage ≠ tính đúng.</b> Bạn có thể đạt 100% coverage bằng các test <em>không assert gì cả</em> — chúng chạy mọi dòng nhưng không kiểm kết quả. Coverage cho biết code nào được <em>thực thi</em>, không cho biết output có <em>đúng</em> không. Có tiêu chí mạnh hơn: <b>MC/DC (Modified Condition/Decision Coverage)</b>, bắt buộc cho phần mềm hàng không (DO-178C), đảm bảo mỗi điều kiện con boolean độc lập ảnh hưởng tới kết cục. Còn câu hỏi thật — "assertion của tôi có tốt không?" — được trả lời bởi <b>mutation testing</b> (Chương 10), không phải coverage.</div>
</div>
`,
        },
        {
          title: '5.2 — Cyclomatic complexity V(G)|||5.2 — Độ phức tạp chu trình V(G)',
          slug: 'swt301-cyclomatic-complexity',
          type: 'VIDEO',
          description: 'Vẽ control-flow graph và tính cyclomatic complexity để biết số đường độc lập cần test.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Cyclomatic complexity — how many paths must I test?</h2>
<p class="lead"><strong>Cyclomatic complexity</strong> V(G), invented by Thomas McCabe, measures the number of <strong>linearly independent paths</strong> through a program. It tells you the <em>minimum number of test cases</em> for full branch coverage — and doubles as a warning of over-complex, bug-prone code.</p>
<p>Model the code as a <strong>control-flow graph</strong> (CFG): <em>nodes</em> = blocks of statements, <em>edges</em> = flow of control. Then:</p>
<div class="formula"><span class="lbl">From the graph</span>V(G) = E − N + 2P    <span class="lbl">where</span>E = edges, N = nodes, P = connected components (usually 1 → E − N + 2)    <span class="lbl">Shortcut</span>V(G) = (number of decision points / predicates) + 1</div>
<div class="callout">The shortcut is the fastest exam method: <strong>count the decisions</strong> (each <code>if</code>, <code>while</code>, <code>for</code>, <code>case</code>, and each <code>&amp;&amp;</code>/<code>||</code> adds one) and add 1. Both formulas give the same answer for a single-entry, single-exit routine.</div>
<h3>Ví dụ có lời giải · Worked example (compute V(G))</h3>
<pre><span class="tok-function">classify</span>(<span class="tok-keyword">int</span> n) {
    <span class="tok-keyword">if</span> (n &gt; 0) {          <span class="tok-comment">// decision 1</span>
        <span class="tok-function">print</span>(<span class="tok-string">"positive"</span>);
    } <span class="tok-keyword">else</span> {
        <span class="tok-function">print</span>(<span class="tok-string">"non-positive"</span>);
    }
    <span class="tok-keyword">if</span> (n % 2 == 0) {     <span class="tok-comment">// decision 2</span>
        <span class="tok-function">print</span>(<span class="tok-string">"even"</span>);
    }
}</pre>
<p><strong>Method 1 — decision count:</strong> there are 2 decision points (the two <code>if</code>s) → V(G) = 2 + 1 = <strong>3</strong>.</p>
<p><strong>Method 2 — the graph:</strong> drawing the CFG gives N = 7 nodes and E = 8 edges, one connected component (P = 1):</p>
<div class="formula"><span class="lbl">V(G)</span>= E − N + 2P = 8 − 7 + 2(1) = 3</div>
<p><strong>Interpretation:</strong> you need <strong>3 independent paths</strong> — e.g. (n=4 → positive+even), (n=3 → positive, not even), (n=−2 → non-positive+even). Three test cases give full branch coverage here.</p>
<h3>V(G) as a code-quality signal</h3>
<table>
  <thead><tr><th>V(G)</th><th>Risk</th></tr></thead>
  <tbody>
    <tr><td>1–10</td><td>simple, low risk</td></tr>
    <tr><td>11–20</td><td>moderate — more testing needed</td></tr>
    <tr><td>21–50</td><td>complex, high risk — consider refactoring</td></tr>
    <tr><td>&gt; 50</td><td>untestable — refactor now</td></tr>
  </tbody>
</table>
<div class="pitfall">Do not forget compound conditions. In <code>if (a &amp;&amp; b)</code> there are <em>two</em> predicates, not one — each of <code>a</code> and <code>b</code> is a decision, so it adds 2 to V(G). Miss this and your path count (and test-case count) will be too low.</div>
<div class="callout ok">Practical use: static-analysis tools (SonarQube) compute V(G) automatically and flag functions above a threshold. High complexity is both a <em>testing cost</em> (more paths) and a <em>maintenance smell</em> (hard to read) — refactoring a 30-path monster into small functions makes it both safer and easier to test.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Basis path testing &amp; the graph theory behind it.</b> V(G) equals the number of independent <em>regions</em> a planar CFG divides the plane into (Euler's formula) — that is not a coincidence, it is why all three formulas agree. McCabe's <b>basis path testing</b> uses V(G) to derive a <em>basis set</em> of paths: any other path through the code is a linear combination of these. Covering the basis set guarantees branch coverage with the provably minimum number of paths — the theoretical foundation under the "V(G) = minimum test cases" rule.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practise deriving paths &amp; writing JUnit tests</span><span class="lc-sub">Reach full branch coverage on real functions — on CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Cyclomatic complexity — tôi phải test bao nhiêu đường?</h2>
<p class="lead"><strong>Cyclomatic complexity</strong> V(G), do Thomas McCabe đề ra, đo số <strong>đường độc lập tuyến tính</strong> qua một chương trình. Nó cho biết <em>số test case tối thiểu</em> để phủ nhánh hoàn toàn — đồng thời là cảnh báo code quá phức tạp, dễ sinh bug.</p>
<p>Mô hình hoá code thành <strong>đồ thị luồng điều khiển</strong> (control-flow graph, CFG): <em>node</em> = khối câu lệnh, <em>edge (cạnh)</em> = luồng điều khiển. Rồi:</p>
<div class="formula"><span class="lbl">Từ đồ thị</span>V(G) = E − N + 2P    <span class="lbl">với</span>E = số cạnh, N = số node, P = số thành phần liên thông (thường 1 → E − N + 2)    <span class="lbl">Cách nhanh</span>V(G) = (số điểm quyết định / predicate) + 1</div>
<div class="callout">Cách nhanh là mẹo thi nhanh nhất: <strong>đếm số quyết định</strong> (mỗi <code>if</code>, <code>while</code>, <code>for</code>, <code>case</code>, và mỗi <code>&amp;&amp;</code>/<code>||</code> cộng một) rồi + 1. Cả hai công thức cho cùng đáp án với một routine một-vào-một-ra.</div>
<h3>Ví dụ có lời giải · Tính V(G)</h3>
<pre><span class="tok-function">classify</span>(<span class="tok-keyword">int</span> n) {
    <span class="tok-keyword">if</span> (n &gt; 0) {          <span class="tok-comment">// quyết định 1</span>
        <span class="tok-function">print</span>(<span class="tok-string">"positive"</span>);
    } <span class="tok-keyword">else</span> {
        <span class="tok-function">print</span>(<span class="tok-string">"non-positive"</span>);
    }
    <span class="tok-keyword">if</span> (n % 2 == 0) {     <span class="tok-comment">// quyết định 2</span>
        <span class="tok-function">print</span>(<span class="tok-string">"even"</span>);
    }
}</pre>
<p><strong>Cách 1 — đếm quyết định:</strong> có 2 điểm quyết định (hai <code>if</code>) → V(G) = 2 + 1 = <strong>3</strong>.</p>
<p><strong>Cách 2 — đồ thị:</strong> vẽ CFG cho N = 7 node và E = 8 cạnh, một thành phần liên thông (P = 1):</p>
<div class="formula"><span class="lbl">V(G)</span>= E − N + 2P = 8 − 7 + 2(1) = 3</div>
<p><strong>Diễn giải:</strong> bạn cần <strong>3 đường độc lập</strong> — vd (n=4 → positive+even), (n=3 → positive, không even), (n=−2 → non-positive+even). Ba test case cho phủ nhánh hoàn toàn ở đây.</p>
<h3>V(G) như một tín hiệu chất lượng code</h3>
<table>
  <thead><tr><th>V(G)</th><th>Rủi ro</th></tr></thead>
  <tbody>
    <tr><td>1–10</td><td>đơn giản, rủi ro thấp</td></tr>
    <tr><td>11–20</td><td>trung bình — cần test nhiều hơn</td></tr>
    <tr><td>21–50</td><td>phức tạp, rủi ro cao — nên refactor</td></tr>
    <tr><td>&gt; 50</td><td>không test nổi — refactor ngay</td></tr>
  </tbody>
</table>
<div class="pitfall">Đừng quên điều kiện ghép. Trong <code>if (a &amp;&amp; b)</code> có <em>hai</em> predicate, không phải một — mỗi <code>a</code> và <code>b</code> là một quyết định, nên cộng 2 vào V(G). Bỏ sót điều này thì số đường (và số test case) của bạn sẽ thiếu.</div>
<div class="callout ok">Dùng thực tế: công cụ static-analysis (SonarQube) tự tính V(G) và cảnh báo hàm vượt ngưỡng. Độ phức tạp cao vừa là <em>chi phí test</em> (nhiều đường) vừa là <em>mùi bảo trì</em> (khó đọc) — refactor một quái vật 30 đường thành các hàm nhỏ khiến nó vừa an toàn hơn vừa dễ test hơn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Basis path testing &amp; lý thuyết đồ thị đằng sau.</b> V(G) bằng số <em>vùng (region)</em> độc lập mà một CFG phẳng chia mặt phẳng ra (công thức Euler) — không phải trùng hợp, đó là lý do cả ba công thức khớp nhau. <b>Basis path testing</b> của McCabe dùng V(G) để rút ra một <em>basis set</em> các đường: mọi đường khác qua code là tổ hợp tuyến tính của chúng. Phủ basis set đảm bảo branch coverage với số đường tối thiểu chứng minh được — nền tảng lý thuyết dưới quy tắc "V(G) = số test case tối thiểu".</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện rút đường &amp; viết JUnit test</span><span class="lc-sub">Đạt phủ nhánh hoàn toàn trên hàm thật — trên CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 5 — White-box & complexity|||Quiz 5 — White-box & độ phức tạp',
          slug: 'swt301-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra coverage và cyclomatic complexity — gồm câu tính V(G).',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: '100% branch coverage guarantees…|||100% branch coverage đảm bảo…', options: ['the code has no defects|||code không có defect', '100% statement coverage too|||cũng 100% statement coverage', 'good performance|||hiệu năng tốt', 'nothing about statements|||không gì về statement'], correctIndex: 1, points: 1 },
              { question: 'A single input executes every line but only the TRUE branch of an if. Statement coverage and branch coverage are…|||Một input chạy mọi dòng nhưng chỉ nhánh TRUE của một if. Statement và branch coverage là…', options: ['both 100%|||cả hai 100%', 'statement 100%, branch 50%|||statement 100%, branch 50%', 'statement 50%, branch 100%|||statement 50%, branch 100%', 'both 50%|||cả hai 50%'], correctIndex: 1, points: 1 },
              { question: 'A function has 4 decision points. Its cyclomatic complexity V(G) is…|||Một hàm có 4 điểm quyết định. Cyclomatic complexity V(G) là…', options: ['4', '5', '8', '3'], correctIndex: 1, points: 1 },
              { question: 'Using V(G) = E − N + 2P with E=9, N=7, P=1 gives…|||Dùng V(G) = E − N + 2P với E=9, N=7, P=1 cho…', options: ['2', '3', '4', '5'], correctIndex: 2, points: 1 },
              { question: 'In if (a || b), how much is added to V(G)?|||Trong if (a || b), V(G) được cộng thêm bao nhiêu?', options: ['1 (one if)|||1 (một if)', '2 (two predicates a and b)|||2 (hai predicate a và b)', '0|||0', '3|||3'], correctIndex: 1, points: 1 },
              { question: 'Why is 100% coverage NOT proof of correctness?|||Vì sao 100% coverage KHÔNG chứng minh tính đúng?', options: ['coverage is always wrong|||coverage luôn sai', 'tests can execute all lines yet assert nothing about the result|||test có thể chạy mọi dòng nhưng không assert gì về kết quả', 'coverage tools are buggy|||công cụ coverage lỗi', 'it needs 200% coverage|||cần 200% coverage'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — EXPERIENCE-BASED TESTING ══════════════════ */
    {
      title: 'Chapter 6 — Experience-based techniques|||Chương 6 — Kỹ thuật dựa kinh nghiệm',
      description: 'Khi đặc tả thiếu hoặc thời gian gấp: error guessing, exploratory testing và checklist-based testing.',
      lessons: [
        {
          title: '6.1 — Error guessing & exploratory testing|||6.1 — Error guessing & exploratory testing',
          slug: 'swt301-experience-based',
          type: 'VIDEO',
          description: 'Dựa vào kinh nghiệm và trực giác của tester để tìm defect mà kỹ thuật hình thức bỏ sót.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Experience-based testing — the tester as the instrument</h2>
<p class="lead">Black-box and white-box techniques are <em>systematic</em>: they derive tests from specs or code. <strong>Experience-based</strong> techniques instead use the <strong>tester's knowledge, intuition and past encounters with defects</strong>. They shine when the specification is thin, missing, or when time is short — and they complement (never replace) the systematic techniques.</p>
<h3>Error guessing</h3>
<p>The tester deliberately imagines <em>where a developer likely made a mistake</em> and targets it. Classic guesses: empty input, zero, negative numbers, very large values, division by zero, null, duplicate entries, special characters, dates around leap years, and the boundaries again. Experienced testers keep a <strong>fault-attack list</strong> built from bugs they have seen before.</p>
<h3>Exploratory testing</h3>
<p><strong>Exploratory testing</strong> fuses learning, test design and execution into one activity: the tester interacts with the software, and <em>each result shapes the next test</em>. It is not random "monkey" clicking — good exploratory testing is <strong>chartered</strong> (a mission/goal), <strong>time-boxed</strong> (a session), and <strong>documented</strong> (notes, found issues). This structured form is called <em>Session-Based Test Management (SBTM)</em>.</p>
<div class="callout">Systematic vs exploratory is not a fight — mature teams do both. Scripted tests give <em>repeatable coverage and a safety net for regression</em>; exploratory testing finds the <em>surprising, spec-gap defects</em> that no pre-written script anticipated.</div>
<h3>Ví dụ có lời giải · Worked example (attack a search box)</h3>
<p>You are handed a new product-search feature with <em>no written spec</em> and 30 minutes. An experience-based session:</p>
<ol>
  <li><strong>Charter:</strong> "Explore the search box for input-handling and boundary defects."</li>
  <li><strong>Error-guessing attacks:</strong> empty query; a single space; 10,000-character query; SQL-ish input <code>' OR 1=1 --</code>; emoji &amp; Unicode; leading/trailing spaces; a term with no results; SEARCH IN CAPS vs lowercase.</li>
  <li><strong>Explore &amp; adapt:</strong> the 10,000-char query returns a 500 error → <em>follow the thread</em>: try 256, 255, 257 chars to find the exact boundary where it breaks.</li>
  <li><strong>Document:</strong> log each defect with steps to reproduce; note the untested areas for a later scripted pass.</li>
</ol>
<div class="callout ok">Notice how error guessing seeded the attacks and exploration <em>followed the failure</em> to pin down a boundary. That is the two techniques working together — and it uncovered a crash a naive "type a normal word" test never would.</div>
<div class="pitfall">Exploratory testing is <em>not</em> an excuse to skip documentation. Undocumented exploration cannot be repeated, cannot be handed over, and its coverage cannot be measured. Always work from a charter and take notes — otherwise it is just aimless clicking, and managers rightly distrust it.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Bug taxonomies &amp; James Bach&#39;s heuristics.</b> Expert exploratory testers lean on named heuristics — e.g. the <b>SFDPOT</b> "San Francisco Depot" model (Structure, Function, Data, Platform, Operations, Time) to systematically vary what they attack, and the <b>CRUD</b> check (Create, Read, Update, Delete every entity). There are even published <em>bug taxonomies</em> (Boris Beizer&#39;s catalogue) listing hundreds of historical defect types — turning "intuition" into a repeatable, teachable checklist so error guessing does not depend on one guru&#39;s memory.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Experience-based testing — tester chính là công cụ</h2>
<p class="lead">Kỹ thuật black-box và white-box mang tính <em>hệ thống</em>: chúng rút test từ spec hoặc code. Kỹ thuật <strong>dựa kinh nghiệm</strong> lại dùng <strong>kiến thức, trực giác và những lần gặp defect trước đây của tester</strong>. Chúng toả sáng khi đặc tả mỏng, thiếu, hoặc thời gian gấp — và bổ trợ (không thay thế) các kỹ thuật hệ thống.</p>
<h3>Error guessing (đoán lỗi)</h3>
<p>Tester chủ động hình dung <em>nơi lập trình viên nhiều khả năng mắc lỗi</em> và nhắm vào đó. Các phỏng đoán kinh điển: input rỗng, số 0, số âm, giá trị rất lớn, chia cho 0, null, mục trùng lặp, ký tự đặc biệt, ngày quanh năm nhuận, và lại là các biên. Tester giàu kinh nghiệm giữ một <strong>danh sách tấn công lỗi (fault-attack list)</strong> đúc từ các bug đã gặp.</p>
<h3>Exploratory testing (kiểm thử khám phá)</h3>
<p><strong>Exploratory testing</strong> hợp nhất học hỏi, thiết kế test và thực thi thành một hoạt động: tester tương tác với phần mềm, và <em>mỗi kết quả định hình test tiếp theo</em>. Không phải bấm loạn kiểu "khỉ" — exploratory tốt có <strong>charter</strong> (nhiệm vụ/mục tiêu), <strong>đóng khung thời gian (time-box)</strong> (một session), và <strong>ghi chép</strong> (notes, vấn đề tìm thấy). Dạng có cấu trúc này gọi là <em>Session-Based Test Management (SBTM)</em>.</p>
<div class="callout">Hệ thống vs khám phá không phải cuộc chiến — đội trưởng thành làm cả hai. Test kịch bản cho <em>phủ lặp lại được và lưới an toàn cho regression</em>; exploratory tìm <em>defect bất ngờ, khe hở đặc tả</em> mà không kịch bản viết sẵn nào lường trước.</div>
<h3>Ví dụ có lời giải · Tấn công một ô tìm kiếm</h3>
<p>Bạn nhận một tính năng tìm sản phẩm mới, <em>không có spec viết</em>, và 30 phút. Một session dựa kinh nghiệm:</p>
<ol>
  <li><strong>Charter:</strong> "Khám phá ô tìm kiếm cho lỗi xử lý input và lỗi biên."</li>
  <li><strong>Tấn công error-guessing:</strong> query rỗng; một dấu cách; query 10.000 ký tự; input kiểu SQL <code>' OR 1=1 --</code>; emoji &amp; Unicode; dấu cách đầu/cuối; từ khoá không có kết quả; TÌM CHỮ HOA vs chữ thường.</li>
  <li><strong>Khám phá &amp; thích ứng:</strong> query 10.000 ký tự trả lỗi 500 → <em>lần theo manh mối</em>: thử 256, 255, 257 ký tự để tìm đúng biên vỡ.</li>
  <li><strong>Ghi chép:</strong> log mỗi defect kèm bước tái hiện; ghi các vùng chưa test cho lượt kịch bản sau.</li>
</ol>
<div class="callout ok">Chú ý error guessing gieo mầm các cuộc tấn công còn exploration <em>lần theo failure</em> để chốt một biên. Đó là hai kỹ thuật phối hợp — và nó phơi bày một crash mà test ngây thơ "gõ một từ bình thường" không bao giờ thấy.</div>
<div class="pitfall">Exploratory testing <em>không</em> phải cái cớ để bỏ ghi chép. Khám phá không ghi chép thì không lặp lại được, không bàn giao được, và không đo được coverage. Luôn làm từ một charter và ghi notes — nếu không nó chỉ là bấm vô định, và quản lý có lý khi không tin nó.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bug taxonomy &amp; heuristic của James Bach.</b> Tester khám phá lão luyện dựa vào các heuristic có tên — vd mô hình <b>SFDPOT</b> "San Francisco Depot" (Structure, Function, Data, Platform, Operations, Time) để đa dạng hoá có hệ thống thứ họ tấn công, và kiểm tra <b>CRUD</b> (Create, Read, Update, Delete mọi thực thể). Thậm chí có <em>bug taxonomy</em> đã xuất bản (danh mục của Boris Beizer) liệt kê hàng trăm loại defect lịch sử — biến "trực giác" thành checklist lặp lại và dạy được, để error guessing không phụ thuộc trí nhớ của một cao thủ.</div>
</div>
`,
        },
        {
          title: 'Quiz 6 — Experience-based & choosing techniques|||Quiz 6 — Dựa kinh nghiệm & chọn kỹ thuật',
          slug: 'swt301-quiz-6',
          type: 'QUIZ',
          description: 'Kiểm tra error guessing, exploratory testing và cách chọn kỹ thuật test.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Experience-based techniques are MOST useful when…|||Kỹ thuật dựa kinh nghiệm hữu ích NHẤT khi…', options: ['the spec is complete and detailed|||spec đầy đủ, chi tiết', 'the spec is thin/missing or time is short|||spec mỏng/thiếu hoặc thời gian gấp', 'you need 100% coverage proof|||cần chứng minh 100% coverage', 'testing is fully automated|||test đã tự động hoàn toàn'], correctIndex: 1, points: 1 },
              { question: 'Error guessing relies mainly on…|||Error guessing dựa chủ yếu vào…', options: ['random number generators|||bộ sinh số ngẫu nhiên', 'the tester\'s knowledge of likely defect areas|||kiến thức của tester về nơi hay có defect', 'the compiler|||trình biên dịch', 'the requirements document only|||chỉ tài liệu yêu cầu'], correctIndex: 1, points: 1 },
              { question: 'Good exploratory testing is…|||Exploratory testing tốt là…', options: ['random clicking with no goal|||bấm ngẫu nhiên không mục tiêu', 'chartered, time-boxed and documented|||có charter, time-box và ghi chép', 'always fully scripted in advance|||luôn viết kịch bản trước hoàn toàn', 'done only by managers|||chỉ quản lý làm'], correctIndex: 1, points: 1 },
              { question: 'Which is a strength of scripted (systematic) tests over exploratory?|||Điểm mạnh nào của test kịch bản (hệ thống) so với exploratory?', options: ['finding surprising spec-gap defects|||tìm defect khe hở đặc tả bất ngờ', 'repeatable coverage &amp; a regression safety net|||phủ lặp lại được &amp; lưới an toàn regression', 'needing no expected results|||không cần kết quả mong đợi', 'requiring no planning|||không cần lập kế hoạch'], correctIndex: 1, points: 1 },
              { question: 'You have complex business rules with many condition combinations. Best technique?|||Bạn có quy tắc nghiệp vụ phức tạp với nhiều tổ hợp điều kiện. Kỹ thuật tốt nhất?', options: ['decision table|||decision table', 'error guessing|||error guessing', 'statement coverage|||statement coverage', 'load testing|||load testing'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 2 ══════════════════ */
    {
      title: 'Progress Test 2 — Static & test design|||Progress Test 2 — Static & thiết kế test',
      description: 'Bài kiểm tra tiến độ 2 (mô phỏng): static testing, black-box, white-box, cyclomatic complexity.',
      lessons: [
        {
          title: 'Progress Test 2|||Progress Test 2',
          slug: 'swt301-progress-test-2',
          type: 'QUIZ',
          description: 'Tổng hợp Chương 3–6. 8 câu, gồm câu tính toán và tình huống.',
          quiz: {
            timeLimitSeconds: 600,
            questions: [
              { question: 'Which activity finds defects WITHOUT executing the software?|||Hoạt động nào tìm defect MÀ KHÔNG chạy phần mềm?', options: ['system testing|||system testing', 'static testing (reviews, static analysis)|||static testing (review, static analysis)', 'load testing|||load testing', 'acceptance testing|||acceptance testing'], correctIndex: 1, points: 1 },
              { question: 'The most formal review with a moderator, checklists and metrics is…|||Review chính quy nhất với moderator, checklist và số liệu là…', options: ['informal review|||informal review', 'walkthrough|||walkthrough', 'inspection|||inspection', 'buddy check|||buddy check'], correctIndex: 2, points: 1 },
              { question: 'For an age field valid 18–65, a good BVA set is…|||Với trường tuổi hợp lệ 18–65, bộ BVA tốt là…', options: ['30 and 40|||30 và 40', '17, 18, 65, 66|||17, 18, 65, 66', '0 and 100|||0 và 100', 'only 18|||chỉ 18'], correctIndex: 1, points: 1 },
              { question: 'A function with 5 decision points needs at least how many tests for branch coverage?|||Một hàm có 5 điểm quyết định cần tối thiểu bao nhiêu test cho branch coverage?', options: ['5', '6', '10', '2'], correctIndex: 1, points: 1 },
              { question: 'Behaviour depends on the sequence of prior events. Best technique?|||Hành vi phụ thuộc trình tự sự kiện trước đó. Kỹ thuật tốt nhất?', options: ['equivalence partitioning|||equivalence partitioning', 'state transition testing|||state transition testing', 'statement coverage|||statement coverage', 'decision table|||decision table'], correctIndex: 1, points: 1 },
              { question: '100% statement coverage means…|||100% statement coverage nghĩa là…', options: ['the program is defect-free|||chương trình không có defect', 'every executable line ran at least once|||mọi dòng chạy được đã chạy ít nhất một lần', 'every branch took both outcomes|||mọi nhánh đã lấy cả hai kết cục', 'all paths were covered|||mọi đường đã được phủ'], correctIndex: 1, points: 1 },
              { question: 'Which pairs a black-box technique with its best fit?|||Cặp nào ghép kỹ thuật black-box với tình huống hợp nhất?', options: ['path coverage ↔ business rules|||path coverage ↔ quy tắc nghiệp vụ', 'decision table ↔ combinations of conditions|||decision table ↔ tổ hợp điều kiện', 'cyclomatic complexity ↔ input ranges|||cyclomatic complexity ↔ khoảng input', 'BVA ↔ code structure|||BVA ↔ cấu trúc code'], correctIndex: 1, points: 1 },
              { question: 'Exploratory testing differs from scripted testing mainly because…|||Exploratory khác test kịch bản chủ yếu vì…', options: ['it needs no tester|||không cần tester', 'test design and execution happen together, each result guiding the next|||thiết kế và thực thi diễn ra cùng lúc, mỗi kết quả dẫn dắt bước sau', 'it always finds more bugs|||luôn tìm nhiều bug hơn', 'it cannot find defects|||không thể tìm defect'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — TEST MANAGEMENT ══════════════════ */
    {
      title: 'Chapter 7 — Test management|||Chương 7 — Quản lý test',
      description: 'Test plan, risk-based testing, và bug lifecycle: lập kế hoạch, ưu tiên theo rủi ro, và log một defect tốt.',
      lessons: [
        {
          title: '7.1 — The test plan & risk-based testing|||7.1 — Test plan & risk-based testing',
          slug: 'swt301-test-plan-risk',
          type: 'VIDEO',
          description: 'Nội dung một test plan (IEEE 829) và cách ưu tiên test theo rủi ro để dùng thời gian có hạn hiệu quả nhất.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The test plan</h2>
<p class="lead">A <strong>test plan</strong> is the document that answers <em>what, why, how, who, when</em> for testing. The classic template is <strong>IEEE 829</strong>. Writing one is CLO5 — and a required Lab in this course.</p>
<table>
  <thead><tr><th>Section</th><th>Answers</th></tr></thead>
  <tbody>
    <tr><td>Scope &amp; objectives</td><td>What will and will NOT be tested, and why</td></tr>
    <tr><td>Test items &amp; features</td><td>Which components/features are in scope</td></tr>
    <tr><td>Approach / strategy</td><td>Which levels, types &amp; techniques (from Ch 2–6)</td></tr>
    <tr><td>Entry &amp; exit criteria</td><td>When can we start? When are we "done"? (e.g. 90% branch coverage, 0 open critical bugs)</td></tr>
    <tr><td>Environment &amp; tools</td><td>Hardware, data, JUnit/Selenium/Jira</td></tr>
    <tr><td>Schedule &amp; resources</td><td>Who does what, by when; estimation</td></tr>
    <tr><td>Risks &amp; mitigations</td><td>Product &amp; project risks and the plan for each</td></tr>
  </tbody>
</table>
<div class="pitfall">The most-forgotten section is <strong>exit criteria</strong>. Without a written definition of "done", testing either stops arbitrarily (ship a buggy build) or never stops (miss the deadline chasing perfection). Good exit criteria are measurable: coverage %, defect density, number of open high-severity bugs — not "when it feels ready".</div>
<h2>Risk-based testing</h2>
<p class="lead">You can never test everything (Principle 2), so <strong>test the riskiest things first</strong>. Risk-based testing prioritises test effort where a failure would be most likely and most damaging.</p>
<div class="formula"><span class="lbl">Risk level</span>= Likelihood (how probable a defect is) × Impact (how bad the failure would be)</div>
<h3>Ví dụ có lời giải · Worked example (prioritise with a risk matrix)</h3>
<p>An online bank with limited test time. Rate each feature (Likelihood 1–3 × Impact 1–3):</p>
<table>
  <thead><tr><th>Feature</th><th>Likelihood</th><th>Impact</th><th>Risk = L×I</th><th>Priority</th></tr></thead>
  <tbody>
    <tr><td>Money transfer</td><td>2</td><td>3</td><td>6</td><td>1 (highest)</td></tr>
    <tr><td>Login / auth</td><td>2</td><td>3</td><td>6</td><td>1</td></tr>
    <tr><td>Transaction history</td><td>2</td><td>2</td><td>4</td><td>2</td></tr>
    <tr><td>Change UI theme</td><td>1</td><td>1</td><td>1</td><td>3 (lowest)</td></tr>
  </tbody>
</table>
<p><strong>Decision:</strong> spend the deepest, earliest testing on <em>transfer</em> and <em>auth</em> (risk 6) — a defect there loses money or leaks accounts. The theme switcher (risk 1) gets a quick smoke test. This is how professionals allocate a fixed testing budget rationally instead of testing everything equally.</p>
<div class="callout ok">Risk-based testing directly implements Principle 4 (defect clustering) and Principle 2 (no exhaustive testing): concentrate scarce effort where the expected cost of failure is highest.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Two kinds of risk, and the cost-of-delay.</b> ISTQB separates <b>product risk</b> (the software fails in a way that hurts users) from <b>project risk</b> (late delivery, staff turnover, unstable environment). Mature test management tracks both on a risk register with an owner and mitigation per item. Modern Agile teams add <b>Cost of Delay</b> and <b>WSJF (Weighted Shortest Job First)</b> to decide test/dev order economically — quantifying not just how risky a feature is, but how expensive it is to <em>wait</em> to verify it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Test plan (kế hoạch kiểm thử)</h2>
<p class="lead">Một <strong>test plan</strong> là tài liệu trả lời <em>test cái gì, vì sao, thế nào, ai, khi nào</em>. Mẫu kinh điển là <strong>IEEE 829</strong>. Viết một cái là CLO5 — và là một Lab bắt buộc trong môn.</p>
<table>
  <thead><tr><th>Mục</th><th>Trả lời</th></tr></thead>
  <tbody>
    <tr><td>Scope &amp; mục tiêu</td><td>Test cái gì và KHÔNG test cái gì, vì sao</td></tr>
    <tr><td>Test items &amp; features</td><td>Component/tính năng nào trong phạm vi</td></tr>
    <tr><td>Approach / chiến lược</td><td>Cấp, loại &amp; kỹ thuật nào (từ Ch 2–6)</td></tr>
    <tr><td>Entry &amp; exit criteria</td><td>Khi nào được bắt đầu? Khi nào "xong"? (vd 90% branch coverage, 0 bug critical mở)</td></tr>
    <tr><td>Environment &amp; công cụ</td><td>Phần cứng, dữ liệu, JUnit/Selenium/Jira</td></tr>
    <tr><td>Schedule &amp; nguồn lực</td><td>Ai làm gì, trước khi nào; ước lượng</td></tr>
    <tr><td>Risks &amp; giảm thiểu</td><td>Rủi ro sản phẩm &amp; dự án và kế hoạch cho mỗi cái</td></tr>
  </tbody>
</table>
<div class="pitfall">Mục hay bị quên nhất là <strong>exit criteria</strong>. Không có định nghĩa viết ra của "xong", test hoặc dừng tuỳ hứng (ship bản đầy bug) hoặc không bao giờ dừng (trễ hạn vì đuổi theo hoàn hảo). Exit criteria tốt là đo được: % coverage, mật độ defect, số bug mức cao còn mở — không phải "khi nào thấy ổn".</div>
<h2>Risk-based testing (kiểm thử theo rủi ro)</h2>
<p class="lead">Bạn không bao giờ test được hết (Nguyên tắc 2), nên hãy <strong>test thứ rủi ro nhất trước</strong>. Risk-based testing ưu tiên công sức test vào nơi mà một failure vừa dễ xảy ra vừa gây hại nhất.</p>
<div class="formula"><span class="lbl">Mức rủi ro</span>= Likelihood (khả năng có defect) × Impact (mức độ tệ nếu failure)</div>
<h3>Ví dụ có lời giải · Ưu tiên bằng ma trận rủi ro</h3>
<p>Một ngân hàng online với thời gian test có hạn. Chấm mỗi tính năng (Likelihood 1–3 × Impact 1–3):</p>
<table>
  <thead><tr><th>Tính năng</th><th>Likelihood</th><th>Impact</th><th>Risk = L×I</th><th>Ưu tiên</th></tr></thead>
  <tbody>
    <tr><td>Chuyển tiền</td><td>2</td><td>3</td><td>6</td><td>1 (cao nhất)</td></tr>
    <tr><td>Login / xác thực</td><td>2</td><td>3</td><td>6</td><td>1</td></tr>
    <tr><td>Lịch sử giao dịch</td><td>2</td><td>2</td><td>4</td><td>2</td></tr>
    <tr><td>Đổi theme giao diện</td><td>1</td><td>1</td><td>1</td><td>3 (thấp nhất)</td></tr>
  </tbody>
</table>
<p><strong>Quyết định:</strong> dồn test sâu nhất, sớm nhất cho <em>chuyển tiền</em> và <em>xác thực</em> (risk 6) — defect ở đó mất tiền hoặc lộ tài khoản. Nút đổi theme (risk 1) chỉ cần smoke test nhanh. Đây là cách dân chuyên nghiệp phân bổ ngân sách test cố định một cách hợp lý thay vì test mọi thứ như nhau.</p>
<div class="callout ok">Risk-based testing hiện thực trực tiếp Nguyên tắc 4 (defect clustering) và Nguyên tắc 2 (không test vét cạn): tập trung công sức khan hiếm vào nơi kỳ vọng chi phí failure cao nhất.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai loại rủi ro, và cost-of-delay.</b> ISTQB tách <b>product risk</b> (phần mềm hỏng theo cách hại người dùng) khỏi <b>project risk</b> (giao trễ, nhân sự nghỉ, môi trường bất ổn). Test management trưởng thành theo dõi cả hai trên một risk register với người sở hữu và biện pháp giảm thiểu cho từng mục. Đội Agile hiện đại thêm <b>Cost of Delay</b> và <b>WSJF (Weighted Shortest Job First)</b> để quyết thứ tự test/dev một cách kinh tế — lượng hoá không chỉ một tính năng rủi ro thế nào, mà còn tốn kém ra sao khi <em>chờ</em> để kiểm chứng nó.</div>
</div>
`,
        },
        {
          title: '7.2 — Bug lifecycle & writing a good defect report|||7.2 — Bug lifecycle & viết báo cáo defect tốt',
          slug: 'swt301-bug-lifecycle',
          type: 'VIDEO',
          description: 'Vòng đời một bug từ New đến Closed, các trường của một defect report, và phân biệt severity vs priority.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>The bug (defect) lifecycle</h2>
<p class="lead">When a test fails, you found a <strong>defect</strong>. It then travels through a workflow in a bug tracker (Jira, Bugzilla). Knowing the states — and who moves the bug between them — is CLO6.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">New</div><div class="lz-t">→ Assigned</div><div class="lz-d">tester logs it; lead assigns a developer</div></div>
  <div class="lz-step"><div class="lz-k">Open</div><div class="lz-t">→ Fixed</div><div class="lz-d">developer works &amp; resolves it</div></div>
  <div class="lz-step"><div class="lz-k">Fixed</div><div class="lz-t">→ Retest</div><div class="lz-d">tester re-tests (confirmation testing)</div></div>
  <div class="lz-step"><div class="lz-k">Verified</div><div class="lz-t">→ Closed</div><div class="lz-d">fix confirmed; if not → Reopened</div></div>
</div>
<p>Common side states: <strong>Rejected</strong> (not a real bug), <strong>Duplicate</strong> (already logged), <strong>Deferred</strong> (real but fixed later), <strong>Reopened</strong> (the fix did not work → back to the developer).</p>
<h3>Severity vs Priority — a classic exam trap</h3>
<table>
  <thead><tr><th></th><th>Severity</th><th>Priority</th></tr></thead>
  <tbody>
    <tr><td>Means</td><td>how badly it damages the system (technical)</td><td>how urgently it must be fixed (business)</td></tr>
    <tr><td>Decided by</td><td>the tester</td><td>the product owner / manager</td></tr>
    <tr><td>Example</td><td>a crash on a rarely used admin page = high severity</td><td>a wrong company logo on the homepage = high priority</td></tr>
  </tbody>
</table>
<div class="pitfall">Severity and priority are <em>independent</em>. A typo in the CEO&#39;s name on the landing page is <strong>low severity</strong> (nothing breaks) but <strong>high priority</strong> (embarrassing, fix now). A crash reachable only by one obscure admin path can be <strong>high severity</strong> yet <strong>low priority</strong>. Confusing the two is one of the most common mistakes in bug reports — and on the exam.</div>
<h3>Ví dụ có lời giải · Worked example (write a report a dev can reproduce)</h3>
<p>Bad report: "Login broken, pls fix." — useless. A good defect report:</p>
<table>
  <tbody>
    <tr><td><strong>Title</strong></td><td>Login fails with valid credentials when password contains a "+" character</td></tr>
    <tr><td><strong>Environment</strong></td><td>Chrome 120, Windows 11, build 2.4.1, staging</td></tr>
    <tr><td><strong>Steps to reproduce</strong></td><td>1. Go to /login  2. Enter user "alice", password "abc+123"  3. Click Login</td></tr>
    <tr><td><strong>Expected</strong></td><td>Successful login, redirect to dashboard</td></tr>
    <tr><td><strong>Actual</strong></td><td>Error "Invalid credentials"; server log shows the "+" decoded as a space</td></tr>
    <tr><td><strong>Severity / Priority</strong></td><td>High / High (blocks a subset of real users)</td></tr>
    <tr><td><strong>Attachments</strong></td><td>screenshot, HAR file, log excerpt</td></tr>
  </tbody>
</table>
<div class="callout ok">The single most valuable field is <strong>steps to reproduce</strong>. A bug a developer can reproduce in one minute gets fixed today; a vague one bounces back as "cannot reproduce" and wastes days. Precise, minimal, deterministic steps are the mark of a professional tester.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Flaky tests &amp; the "cannot reproduce" trap.</b> Some failures appear only sometimes — <b>flaky tests</b> caused by timing/race conditions, shared state, random data, timezone or network. They are corrosive: developers start ignoring red builds ("it&#39;s just flaky"), and a real regression hides among the noise. Professional fixes: make tests deterministic (control the clock/seed/data), quarantine known-flaky tests, and track a flakiness rate. Google reported that a large fraction of its test failures were flaky — managing them is a discipline of its own.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">Set up Jira / Bugzilla &amp; a bug workflow</span><span class="lc-sub">Configure a defect tracker and practise logging bugs — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Vòng đời một bug (defect lifecycle)</h2>
<p class="lead">Khi một test fail, bạn đã tìm ra một <strong>defect</strong>. Nó đi qua một quy trình trong bug tracker (Jira, Bugzilla). Nắm các trạng thái — và ai chuyển bug giữa chúng — là CLO6.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">New</div><div class="lz-t">→ Assigned</div><div class="lz-d">tester log; lead giao cho lập trình viên</div></div>
  <div class="lz-step"><div class="lz-k">Open</div><div class="lz-t">→ Fixed</div><div class="lz-d">lập trình viên xử lý &amp; sửa</div></div>
  <div class="lz-step"><div class="lz-k">Fixed</div><div class="lz-t">→ Retest</div><div class="lz-d">tester test lại (confirmation testing)</div></div>
  <div class="lz-step"><div class="lz-k">Verified</div><div class="lz-t">→ Closed</div><div class="lz-d">xác nhận đã sửa; nếu chưa → Reopened</div></div>
</div>
<p>Trạng thái phụ thường gặp: <strong>Rejected</strong> (không phải bug thật), <strong>Duplicate</strong> (đã log), <strong>Deferred</strong> (thật nhưng sửa sau), <strong>Reopened</strong> (bản sửa không được → trả lại lập trình viên).</p>
<h3>Severity vs Priority — bẫy đề kinh điển</h3>
<table>
  <thead><tr><th></th><th>Severity (mức nghiêm trọng)</th><th>Priority (mức ưu tiên)</th></tr></thead>
  <tbody>
    <tr><td>Nghĩa là</td><td>gây hại hệ thống đến đâu (kỹ thuật)</td><td>cần sửa gấp đến đâu (nghiệp vụ)</td></tr>
    <tr><td>Ai quyết</td><td>tester</td><td>product owner / quản lý</td></tr>
    <tr><td>Ví dụ</td><td>crash ở trang admin ít dùng = severity cao</td><td>logo công ty sai trên trang chủ = priority cao</td></tr>
  </tbody>
</table>
<div class="pitfall">Severity và priority <em>độc lập</em>. Gõ sai tên CEO trên trang landing là <strong>severity thấp</strong> (không vỡ gì) nhưng <strong>priority cao</strong> (mất mặt, sửa ngay). Một crash chỉ tới được bằng một đường admin hẻo lánh có thể <strong>severity cao</strong> nhưng <strong>priority thấp</strong>. Nhầm hai cái này là một trong các lỗi phổ biến nhất trong báo cáo bug — và trong đề thi.</div>
<h3>Ví dụ có lời giải · Viết báo cáo mà dev tái hiện được</h3>
<p>Báo cáo tệ: "Login hỏng, sửa giúp." — vô dụng. Một defect report tốt:</p>
<table>
  <tbody>
    <tr><td><strong>Tiêu đề</strong></td><td>Login thất bại với thông tin hợp lệ khi mật khẩu chứa ký tự "+"</td></tr>
    <tr><td><strong>Môi trường</strong></td><td>Chrome 120, Windows 11, build 2.4.1, staging</td></tr>
    <tr><td><strong>Bước tái hiện</strong></td><td>1. Vào /login  2. Nhập user "alice", mật khẩu "abc+123"  3. Bấm Login</td></tr>
    <tr><td><strong>Mong đợi</strong></td><td>Đăng nhập thành công, chuyển tới dashboard</td></tr>
    <tr><td><strong>Thực tế</strong></td><td>Lỗi "Invalid credentials"; log server cho thấy "+" bị giải mã thành dấu cách</td></tr>
    <tr><td><strong>Severity / Priority</strong></td><td>High / High (chặn một nhóm người dùng thật)</td></tr>
    <tr><td><strong>Đính kèm</strong></td><td>ảnh chụp, file HAR, trích log</td></tr>
  </tbody>
</table>
<div class="callout ok">Trường giá trị nhất là <strong>bước tái hiện</strong>. Một bug lập trình viên tái hiện được trong một phút sẽ được sửa hôm nay; một cái mơ hồ bị trả lại "không tái hiện được" và phí nhiều ngày. Bước tái hiện chính xác, tối giản, tất định là dấu hiệu của một tester chuyên nghiệp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Flaky test &amp; bẫy "không tái hiện được".</b> Một số failure chỉ xuất hiện đôi lúc — <b>flaky test</b> do timing/race condition, state dùng chung, dữ liệu ngẫu nhiên, múi giờ hay mạng. Chúng ăn mòn: lập trình viên bắt đầu phớt lờ build đỏ ("chỉ flaky thôi"), và một regression thật ẩn giữa nhiễu. Cách sửa chuyên nghiệp: làm test tất định (kiểm soát đồng hồ/seed/dữ liệu), cách ly test flaky đã biết, và theo dõi tỉ lệ flakiness. Google báo cáo một phần lớn failure test của họ là flaky — quản lý chúng là cả một môn riêng.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">Cài Jira / Bugzilla &amp; quy trình bug</span><span class="lc-sub">Cấu hình bug tracker và luyện log bug — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 7 — Test management|||Quiz 7 — Quản lý test',
          slug: 'swt301-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra test plan, risk-based testing, bug lifecycle và severity vs priority.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'Exit criteria in a test plan define…|||Exit criteria trong test plan xác định…', options: ['who wrote the code|||ai viết code', 'when testing can be considered "done"|||khi nào test được coi là "xong"', 'the UI colours|||màu UI', 'the programming language|||ngôn ngữ lập trình'], correctIndex: 1, points: 1 },
              { question: 'Risk level in risk-based testing is usually…|||Mức rủi ro trong risk-based testing thường là…', options: ['likelihood + impact|||likelihood + impact', 'likelihood × impact|||likelihood × impact', 'impact − likelihood|||impact − likelihood', 'a random number|||một số ngẫu nhiên'], correctIndex: 1, points: 1 },
              { question: 'A wrong company logo on the homepage is typically…|||Logo công ty sai trên trang chủ thường là…', options: ['high severity, low priority|||severity cao, priority thấp', 'low severity, high priority|||severity thấp, priority cao', 'high severity, high priority|||severity cao, priority cao', 'not a defect|||không phải defect'], correctIndex: 1, points: 1 },
              { question: 'Who typically sets the SEVERITY of a defect?|||Ai thường đặt SEVERITY của một defect?', options: ['the tester|||tester', 'the customer|||khách hàng', 'the CEO|||CEO', 'the compiler|||trình biên dịch'], correctIndex: 0, points: 1 },
              { question: 'A bug is marked Fixed. The tester re-tests and it still fails. New state?|||Một bug được đánh Fixed. Tester test lại và vẫn fail. Trạng thái mới?', options: ['Closed|||Closed', 'Reopened|||Reopened', 'Duplicate|||Duplicate', 'Deferred|||Deferred'], correctIndex: 1, points: 1 },
              { question: 'The MOST valuable field in a defect report for getting it fixed is…|||Trường GIÁ TRỊ nhất trong defect report để được sửa là…', options: ['the date|||ngày', 'clear steps to reproduce|||bước tái hiện rõ ràng', 'the tester name|||tên tester', 'the bug ID|||ID bug'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — TEST TOOLS & AUTOMATION ══════════════════ */
    {
      title: 'Chapter 8 — Test tools & automation|||Chương 8 — Công cụ & tự động hoá',
      description: 'Các loại công cụ test; JUnit và Selenium; test pyramid; CI; lợi ích và rủi ro của automation.',
      lessons: [
        {
          title: '8.1 — JUnit, Selenium & the test pyramid|||8.1 — JUnit, Selenium & test pyramid',
          slug: 'swt301-tools-pyramid',
          type: 'VIDEO',
          description: 'Unit test với JUnit, UI test với Selenium, và vì sao test pyramid khuyên nhiều test nhỏ nhanh, ít test UI chậm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Types of test tools</h2>
<p class="lead">Tools support every part of the process: management (Jira, TestRail), static analysis (SonarQube), test design (model-based tools), <strong>test execution</strong> (JUnit, Selenium), performance (JMeter, k6), and coverage (JaCoCo). This lesson focuses on the two you will use hands-on: <strong>JUnit</strong> (unit) and <strong>Selenium</strong> (UI/end-to-end).</p>
<h3>JUnit — automating unit tests</h3>
<pre><span class="tok-keyword">import</span> org.junit.jupiter.api.Test;
<span class="tok-keyword">import static</span> org.junit.jupiter.api.Assertions.*;

<span class="tok-keyword">class</span> <span class="tok-type">CalculatorTest</span> {
    <span class="tok-type">Calculator</span> c = <span class="tok-keyword">new</span> <span class="tok-function">Calculator</span>();

    <span class="tok-keyword">@Test</span>
    <span class="tok-keyword">void</span> <span class="tok-function">addsTwoPositives</span>() {
        <span class="tok-function">assertEquals</span>(5, c.<span class="tok-function">add</span>(2, 3));
    }

    <span class="tok-keyword">@Test</span>
    <span class="tok-keyword">void</span> <span class="tok-function">divideByZeroThrows</span>() {
        <span class="tok-function">assertThrows</span>(<span class="tok-type">ArithmeticException</span>.<span class="tok-keyword">class</span>, () -&gt; c.<span class="tok-function">divide</span>(1, 0));
    }
}</pre>
<div class="out">mvn test → Tests run: 2, Failures: 0. Green bar. If someone later breaks add(), the first test goes red instantly — that is the regression safety net.</div>
<p>Key JUnit 5 pieces: <code>@Test</code> marks a test; <code>@BeforeEach</code>/<code>@AfterEach</code> set up &amp; tear down; assertions (<code>assertEquals</code>, <code>assertTrue</code>, <code>assertThrows</code>) check results; <code>@ParameterizedTest</code> runs the same test over many inputs (perfect for BVA from Chapter 4).</p>
<h3>Selenium — automating the UI</h3>
<pre><span class="tok-type">WebDriver</span> driver = <span class="tok-keyword">new</span> <span class="tok-function">ChromeDriver</span>();
driver.<span class="tok-function">get</span>(<span class="tok-string">"https://shop.example/login"</span>);
driver.<span class="tok-function">findElement</span>(<span class="tok-type">By</span>.<span class="tok-function">id</span>(<span class="tok-string">"user"</span>)).<span class="tok-function">sendKeys</span>(<span class="tok-string">"alice"</span>);
driver.<span class="tok-function">findElement</span>(<span class="tok-type">By</span>.<span class="tok-function">id</span>(<span class="tok-string">"pass"</span>)).<span class="tok-function">sendKeys</span>(<span class="tok-string">"secret"</span>);
driver.<span class="tok-function">findElement</span>(<span class="tok-type">By</span>.<span class="tok-function">id</span>(<span class="tok-string">"login"</span>)).<span class="tok-function">click</span>();
<span class="tok-function">assertEquals</span>(<span class="tok-string">"Dashboard"</span>, driver.<span class="tok-function">getTitle</span>());
driver.<span class="tok-function">quit</span>();</pre>
<div class="out">Selenium drives a real browser: types, clicks, reads the page — an automated end-to-end (system-level) test.</div>
<h3>The test pyramid</h3>
<p>Not all automated tests are equal. The <strong>test pyramid</strong> (Mike Cohn) says: have <em>many</em> fast, cheap unit tests at the bottom, <em>fewer</em> integration tests in the middle, and <em>very few</em> slow, brittle UI/end-to-end tests at the top.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">UI / E2E (few)</span><span class="lz-lnote">Selenium — slow, brittle, expensive; test only critical user journeys</span></div>
  <div class="lz-layer"><span class="lz-lname">Integration (some)</span><span class="lz-lnote">API/service tests — module interfaces</span></div>
  <div class="lz-layer"><span class="lz-lname">Unit (many)</span><span class="lz-lnote">JUnit — milliseconds, run on every push, pinpoint failures</span></div>
</div>
<div class="pitfall">The <strong>inverted pyramid</strong> (or "ice-cream cone") — mostly UI tests, few unit tests — is an anti-pattern. UI tests are slow (minutes vs milliseconds) and flaky (a moved button breaks dozens), so the suite becomes so slow and unreliable that the team stops trusting it. Push tests <em>down</em> the pyramid: test logic at the unit level, reserve Selenium for a handful of critical flows.</div>
<h3>Ví dụ có lời giải · Worked example (place the tests)</h3>
<p>For the discount example from Chapter 5, where should each test live?</p>
<ul>
  <li>"discount(200) == 190" and every boundary → <strong>unit (JUnit)</strong>, dozens of them, run in milliseconds.</li>
  <li>"Checkout service applies the discount and calls Payment" → <strong>integration</strong>, a handful.</li>
  <li>"A shopper adds an item, sees the discount at checkout, and pays" → <strong>one Selenium E2E</strong> covering the happy path only.</li>
</ul>
<div class="callout ok">Same feature, three layers, correct proportions: many/some/few. The logic-heavy boundary checks stay cheap at the bottom; the expensive browser test covers just the critical journey.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The pyramid is being reshaped: the "test trophy" &amp; contract testing.</b> For modern web apps, Kent C. Dodds argues for a <b>testing trophy</b> that fattens the <em>integration</em> layer, because integration tests give the best confidence-per-cost when UI frameworks make component tests cheap. In microservices, teams add <b>consumer-driven contract testing</b> (Pact): instead of slow end-to-end tests across many services, each pair verifies a shared "contract", catching interface breaks fast without spinning up the whole system. The pyramid is a heuristic, not a law — adapt the shape to your architecture.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Write &amp; run real JUnit tests</span><span class="lc-sub">Practise @Test, assertions and @ParameterizedTest — on CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Các loại công cụ test</h2>
<p class="lead">Công cụ hỗ trợ mọi phần của quy trình: quản lý (Jira, TestRail), static analysis (SonarQube), thiết kế test (công cụ model-based), <strong>thực thi test</strong> (JUnit, Selenium), hiệu năng (JMeter, k6), và coverage (JaCoCo). Bài này tập trung hai cái bạn dùng tay: <strong>JUnit</strong> (unit) và <strong>Selenium</strong> (UI/đầu-cuối).</p>
<h3>JUnit — tự động hoá unit test</h3>
<pre><span class="tok-keyword">import</span> org.junit.jupiter.api.Test;
<span class="tok-keyword">import static</span> org.junit.jupiter.api.Assertions.*;

<span class="tok-keyword">class</span> <span class="tok-type">CalculatorTest</span> {
    <span class="tok-type">Calculator</span> c = <span class="tok-keyword">new</span> <span class="tok-function">Calculator</span>();

    <span class="tok-keyword">@Test</span>
    <span class="tok-keyword">void</span> <span class="tok-function">addsTwoPositives</span>() {
        <span class="tok-function">assertEquals</span>(5, c.<span class="tok-function">add</span>(2, 3));
    }

    <span class="tok-keyword">@Test</span>
    <span class="tok-keyword">void</span> <span class="tok-function">divideByZeroThrows</span>() {
        <span class="tok-function">assertThrows</span>(<span class="tok-type">ArithmeticException</span>.<span class="tok-keyword">class</span>, () -&gt; c.<span class="tok-function">divide</span>(1, 0));
    }
}</pre>
<div class="out">mvn test → Tests run: 2, Failures: 0. Thanh xanh. Nếu sau này ai đó làm hỏng add(), test đầu tiên đỏ ngay lập tức — đó là lưới an toàn regression.</div>
<p>Các thành phần JUnit 5 chính: <code>@Test</code> đánh dấu một test; <code>@BeforeEach</code>/<code>@AfterEach</code> dựng &amp; dọn; assertion (<code>assertEquals</code>, <code>assertTrue</code>, <code>assertThrows</code>) kiểm kết quả; <code>@ParameterizedTest</code> chạy cùng một test trên nhiều input (hoàn hảo cho BVA ở Chương 4).</p>
<h3>Selenium — tự động hoá UI</h3>
<pre><span class="tok-type">WebDriver</span> driver = <span class="tok-keyword">new</span> <span class="tok-function">ChromeDriver</span>();
driver.<span class="tok-function">get</span>(<span class="tok-string">"https://shop.example/login"</span>);
driver.<span class="tok-function">findElement</span>(<span class="tok-type">By</span>.<span class="tok-function">id</span>(<span class="tok-string">"user"</span>)).<span class="tok-function">sendKeys</span>(<span class="tok-string">"alice"</span>);
driver.<span class="tok-function">findElement</span>(<span class="tok-type">By</span>.<span class="tok-function">id</span>(<span class="tok-string">"pass"</span>)).<span class="tok-function">sendKeys</span>(<span class="tok-string">"secret"</span>);
driver.<span class="tok-function">findElement</span>(<span class="tok-type">By</span>.<span class="tok-function">id</span>(<span class="tok-string">"login"</span>)).<span class="tok-function">click</span>();
<span class="tok-function">assertEquals</span>(<span class="tok-string">"Dashboard"</span>, driver.<span class="tok-function">getTitle</span>());
driver.<span class="tok-function">quit</span>();</pre>
<div class="out">Selenium lái một trình duyệt thật: gõ, bấm, đọc trang — một test đầu-cuối (mức system) tự động.</div>
<h3>Test pyramid (kim tự tháp test)</h3>
<p>Không phải mọi test tự động đều ngang nhau. <strong>Test pyramid</strong> (Mike Cohn) nói: có <em>nhiều</em> unit test nhanh, rẻ ở đáy, <em>ít hơn</em> integration test ở giữa, và <em>rất ít</em> UI/đầu-cuối chậm, dễ gãy ở đỉnh.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">UI / E2E (ít)</span><span class="lz-lnote">Selenium — chậm, dễ gãy, đắt; chỉ test hành trình người dùng trọng yếu</span></div>
  <div class="lz-layer"><span class="lz-lname">Integration (vừa)</span><span class="lz-lnote">API/service test — giao diện giữa các module</span></div>
  <div class="lz-layer"><span class="lz-lname">Unit (nhiều)</span><span class="lz-lnote">JUnit — mili giây, chạy mỗi lần push, chỉ đích danh chỗ lỗi</span></div>
</div>
<div class="pitfall"><strong>Kim tự tháp ngược</strong> (hay "ốc quế kem") — chủ yếu UI test, ít unit test — là một anti-pattern. UI test chậm (phút vs mili giây) và flaky (một nút bị dời làm gãy hàng chục), nên bộ test chậm và thiếu tin cậy đến mức đội ngừng tin nó. Hãy đẩy test <em>xuống</em> đáy: test logic ở mức unit, để dành Selenium cho một nhúm luồng trọng yếu.</div>
<h3>Ví dụ có lời giải · Đặt các test đúng chỗ</h3>
<p>Với ví dụ discount ở Chương 5, mỗi test nên nằm ở đâu?</p>
<ul>
  <li>"discount(200) == 190" và mọi biên → <strong>unit (JUnit)</strong>, hàng chục cái, chạy mili giây.</li>
  <li>"Service Checkout áp discount và gọi Payment" → <strong>integration</strong>, một nhúm.</li>
  <li>"Người mua thêm sản phẩm, thấy discount ở checkout, và thanh toán" → <strong>một Selenium E2E</strong> chỉ phủ happy path.</li>
</ul>
<div class="callout ok">Cùng tính năng, ba tầng, tỉ lệ đúng: nhiều/vừa/ít. Kiểm tra biên nặng logic giữ rẻ ở đáy; test trình duyệt đắt chỉ phủ hành trình trọng yếu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kim tự tháp đang được định hình lại: "test trophy" &amp; contract testing.</b> Với app web hiện đại, Kent C. Dodds ủng hộ một <b>testing trophy</b> phình tầng <em>integration</em>, vì integration test cho niềm tin trên mỗi đồng chi phí tốt nhất khi framework UI làm component test rẻ. Trong microservices, đội thêm <b>consumer-driven contract testing</b> (Pact): thay vì test đầu-cuối chậm qua nhiều service, mỗi cặp kiểm một "contract" chung, bắt lỗi giao diện nhanh mà không phải dựng cả hệ thống. Kim tự tháp là heuristic, không phải luật — chỉnh hình theo kiến trúc của bạn.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Viết &amp; chạy JUnit test thật</span><span class="lc-sub">Luyện @Test, assertion và @ParameterizedTest — trên CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '8.2 — CI & the benefits/risks of automation|||8.2 — CI & lợi ích/rủi ro của automation',
          slug: 'swt301-ci-automation',
          type: 'VIDEO',
          description: 'Continuous Integration chạy test tự động mỗi lần push; khi nào NÊN và KHÔNG nên tự động hoá; đưa công cụ vào tổ chức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Continuous Integration — tests on every push</h2>
<p class="lead"><strong>Continuous Integration (CI)</strong> is the practice of merging code frequently and <em>automatically building and testing</em> every change. A CI server (GitHub Actions, Jenkins, GitLab CI) runs your JUnit + static analysis + coverage on each push; a red build blocks the merge. This turns your automated regression suite into a 24/7 gatekeeper.</p>
<pre><span class="tok-comment"># A minimal GitHub Actions test pipeline (.github/workflows/test.yml)</span>
<span class="tok-keyword">on</span>: [push, pull_request]
<span class="tok-keyword">jobs</span>:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: mvn test          <span class="tok-comment"># JUnit — fails the build if any test is red</span>
      - run: mvn verify         <span class="tok-comment"># coverage + static analysis gate</span></pre>
<div class="out">Every push triggers the pipeline. Green = safe to merge. Red = the change broke a test; the author fixes before it reaches anyone else. Defects are caught in minutes, not in production.</div>
<h3>Benefits vs risks of test automation</h3>
<table>
  <thead><tr><th>Benefits</th><th>Risks / costs</th></tr></thead>
  <tbody>
    <tr><td>Fast, repeatable regression (run 1000s of tests in minutes)</td><td>High upfront cost to build &amp; maintain scripts</td></tr>
    <tr><td>Runs 24/7 in CI, frees humans for exploratory testing</td><td>Brittle UI tests break on every layout change</td></tr>
    <tr><td>Consistent — no human "I forgot to check that"</td><td>Flaky tests erode trust; false confidence if assertions are weak</td></tr>
    <tr><td>Enables frequent releases (CI/CD)</td><td>Cannot judge usability, look-and-feel, or "does this feel right?"</td></tr>
  </tbody>
</table>
<div class="pitfall">Automation is not "record once, forget forever". Automated tests are <em>code</em> — they need maintenance, refactoring and review like any other code. A neglected suite rots: brittle tests get disabled one by one until the "green" build actually verifies almost nothing. Budget for maintenance from day one.</div>
<h3>What to automate — and what not to</h3>
<ul>
  <li><strong>Automate:</strong> stable, repetitive, high-value regression; unit tests; data-driven boundary checks; smoke tests on every deploy.</li>
  <li><strong>Keep manual:</strong> usability, exploratory testing, one-off checks, features still changing rapidly, and anything needing human judgement (does the design look right?).</li>
</ul>
<h3>Introducing a tool into an organisation</h3>
<p>ISTQB stresses this is a <em>change-management</em> problem, not just a purchase. Steps: assess the team&#39;s maturity and real needs; run a <strong>pilot project</strong> (prove value on a small scope, learn, tune); define usage guidelines and metrics; then roll out gradually with training and support.</p>
<div class="callout"><b>Why a pilot?</b> A tool that dazzles in a vendor demo can fail on your real codebase, data or team skills. The pilot de-risks a big investment: you learn the true cost, adapt your process, and build internal champions before betting the whole organisation on it.</div>
<div class="callout ok">Rule of thumb: automate the boring, repeatable, stable checks so humans are freed to do the creative, judgement-heavy work — exploratory testing, usability, and thinking up the next attack. Automation and human testing are partners, not rivals.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The automation ROI break-even and CI/CD.</b> Automation pays off only after a test has been <em>run enough times</em> to repay its build cost — roughly break-even when (manual cost per run × number of runs) exceeds (automation build + maintenance). Tests run on every commit cross that line fast; a test run twice a year may never justify automating. This economics underpins <b>CI/CD</b> (continuous delivery/deployment): once a reliable automated suite gates every change, teams can ship to production many times a day with confidence — the automated tests, not a manual sign-off, are what make continuous deployment safe.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Continuous Integration — test mỗi lần push</h2>
<p class="lead"><strong>Continuous Integration (CI)</strong> là thực hành merge code thường xuyên và <em>tự động build và test</em> mọi thay đổi. Một CI server (GitHub Actions, Jenkins, GitLab CI) chạy JUnit + static analysis + coverage của bạn ở mỗi lần push; build đỏ chặn merge. Điều này biến bộ regression tự động thành một người gác cổng 24/7.</p>
<pre><span class="tok-comment"># Một pipeline test GitHub Actions tối giản (.github/workflows/test.yml)</span>
<span class="tok-keyword">on</span>: [push, pull_request]
<span class="tok-keyword">jobs</span>:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: mvn test          <span class="tok-comment"># JUnit — fail build nếu bất kỳ test đỏ</span>
      - run: mvn verify         <span class="tok-comment"># cổng coverage + static analysis</span></pre>
<div class="out">Mỗi lần push kích hoạt pipeline. Xanh = an toàn để merge. Đỏ = thay đổi làm gãy một test; tác giả sửa trước khi nó tới người khác. Defect bị bắt trong vài phút, không phải trên production.</div>
<h3>Lợi ích vs rủi ro của test automation</h3>
<table>
  <thead><tr><th>Lợi ích</th><th>Rủi ro / chi phí</th></tr></thead>
  <tbody>
    <tr><td>Regression nhanh, lặp lại được (chạy hàng nghìn test trong vài phút)</td><td>Chi phí ban đầu cao để xây &amp; bảo trì script</td></tr>
    <tr><td>Chạy 24/7 trong CI, giải phóng người cho exploratory testing</td><td>UI test dễ gãy khi layout thay đổi</td></tr>
    <tr><td>Nhất quán — không có "tôi quên kiểm cái đó"</td><td>Flaky test bào mòn niềm tin; niềm tin giả nếu assertion yếu</td></tr>
    <tr><td>Cho phép phát hành thường xuyên (CI/CD)</td><td>Không đánh giá được usability, thẩm mỹ, hay "cái này có ổn không?"</td></tr>
  </tbody>
</table>
<div class="pitfall">Automation không phải "ghi một lần, quên mãi mãi". Test tự động là <em>code</em> — cần bảo trì, refactor và review như mọi code khác. Bộ test bị bỏ bê sẽ mục: test dễ gãy bị tắt từng cái một tới khi build "xanh" thực chất chẳng kiểm gì. Hãy dự trù ngân sách bảo trì từ ngày đầu.</div>
<h3>Nên tự động hoá gì — và không nên gì</h3>
<ul>
  <li><strong>Tự động hoá:</strong> regression ổn định, lặp lại, giá trị cao; unit test; kiểm biên data-driven; smoke test mỗi lần deploy.</li>
  <li><strong>Giữ thủ công:</strong> usability, exploratory testing, kiểm một lần, tính năng còn đổi nhanh, và bất cứ gì cần phán đoán con người (thiết kế trông có ổn không?).</li>
</ul>
<h3>Đưa một công cụ vào tổ chức</h3>
<p>ISTQB nhấn mạnh đây là bài toán <em>quản lý thay đổi</em>, không chỉ là mua sắm. Các bước: đánh giá độ trưởng thành &amp; nhu cầu thật của đội; chạy một <strong>dự án pilot</strong> (chứng minh giá trị ở phạm vi nhỏ, học, tinh chỉnh); định ra hướng dẫn sử dụng &amp; số liệu; rồi triển khai dần kèm đào tạo &amp; hỗ trợ.</p>
<div class="callout"><b>Vì sao pilot?</b> Một công cụ loá mắt trong demo của hãng có thể thất bại trên codebase, dữ liệu hay kỹ năng đội thật của bạn. Pilot giảm rủi ro cho khoản đầu tư lớn: bạn học chi phí thật, điều chỉnh quy trình, và xây người ủng hộ nội bộ trước khi đặt cược cả tổ chức vào nó.</div>
<div class="callout ok">Quy tắc: tự động hoá các kiểm tra nhàm chán, lặp lại, ổn định để giải phóng con người cho việc sáng tạo, nặng phán đoán — exploratory testing, usability, và nghĩ ra đòn tấn công tiếp theo. Automation và test thủ công là đối tác, không phải đối thủ.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Điểm hoà vốn ROI của automation và CI/CD.</b> Automation chỉ có lời sau khi một test được <em>chạy đủ nhiều lần</em> để hoàn lại chi phí xây — xấp xỉ hoà vốn khi (chi phí tay mỗi lần × số lần chạy) vượt (chi phí xây + bảo trì automation). Test chạy mỗi commit vượt lằn ranh đó rất nhanh; một test chạy hai lần mỗi năm có thể không bao giờ đáng tự động. Kinh tế học này chống đỡ <b>CI/CD</b> (continuous delivery/deployment): một khi bộ test tự động đáng tin gác mọi thay đổi, đội có thể ship lên production nhiều lần mỗi ngày một cách tự tin — chính test tự động, không phải một cái duyệt tay, khiến continuous deployment an toàn.</div>
</div>
`,
        },
        {
          title: 'Quiz 8 — Tools & automation|||Quiz 8 — Công cụ & tự động hoá',
          slug: 'swt301-quiz-8',
          type: 'QUIZ',
          description: 'Kiểm tra JUnit, Selenium, test pyramid, CI và lợi ích/rủi ro của automation.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'The test pyramid recommends…|||Test pyramid khuyến nghị…', options: ['mostly UI tests, few unit tests|||chủ yếu UI test, ít unit test', 'many unit tests, fewer integration, very few UI tests|||nhiều unit test, ít hơn integration, rất ít UI test', 'only manual tests|||chỉ test thủ công', 'equal numbers at every level|||số lượng bằng nhau mọi tầng'], correctIndex: 1, points: 1 },
              { question: 'Which JUnit annotation runs the same test over many inputs?|||Annotation JUnit nào chạy cùng một test trên nhiều input?', options: ['@BeforeEach', '@Test', '@ParameterizedTest', '@AfterEach'], correctIndex: 2, points: 1 },
              { question: 'Selenium is primarily a tool for…|||Selenium chủ yếu là công cụ cho…', options: ['unit testing logic|||test logic mức unit', 'driving a real browser for UI/E2E tests|||lái trình duyệt thật cho test UI/E2E', 'static analysis|||static analysis', 'load testing|||load testing'], correctIndex: 1, points: 1 },
              { question: 'In CI, what does a RED build mean?|||Trong CI, build ĐỎ nghĩa là gì?', options: ['the code is ready to ship|||code sẵn sàng ship', 'a test failed; the change should not be merged as-is|||một test fail; thay đổi không nên merge nguyên trạng', 'the server is off|||server tắt', 'coverage is 100%|||coverage 100%'], correctIndex: 1, points: 1 },
              { question: 'Which is BEST kept manual rather than automated?|||Cái nào NÊN giữ thủ công thay vì tự động?', options: ['stable regression checks|||kiểm regression ổn định', 'usability &amp; exploratory testing|||usability &amp; exploratory testing', 'boundary value checks|||kiểm giá trị biên', 'smoke tests on deploy|||smoke test khi deploy'], correctIndex: 1, points: 1 },
              { question: 'Why run a pilot project before adopting a test tool org-wide?|||Vì sao chạy dự án pilot trước khi áp dụng công cụ test toàn tổ chức?', options: ['to make the demo look good|||để demo trông đẹp', 'to prove value &amp; learn the real cost on a small scope first|||để chứng minh giá trị &amp; học chi phí thật ở phạm vi nhỏ trước', 'because tools are free|||vì công cụ miễn phí', 'to avoid writing tests|||để khỏi viết test'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 9 — AGILE TESTING ══════════════════ */
    {
      title: 'Chapter 9 — Agile testing|||Chương 9 — Agile testing',
      description: 'Kiểm thử trong đội Agile: testing quadrants, TDD, BDD, continuous testing và vai trò tester trong Scrum.',
      lessons: [
        {
          title: '9.1 — Agile testing quadrants & the whole-team approach|||9.1 — Testing quadrants & whole-team approach',
          slug: 'swt301-agile-quadrants',
          type: 'VIDEO',
          description: 'Bốn góc phần tư của Crispin & Gregory và tư duy "cả đội chịu trách nhiệm chất lượng".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Testing in Agile — a mindset shift</h2>
<p class="lead">In traditional projects, testing is a <em>phase</em> at the end. In <strong>Agile</strong>, testing is a <em>continuous activity woven into every sprint</em>. The whole team — not a separate QA department — owns quality. Testers pair with developers, help write acceptance criteria, and test features as they are built, not weeks later.</p>
<h3>The Agile Testing Quadrants (Crispin &amp; Gregory)</h3>
<p>This model (from the course textbook) organises testing by two axes: <em>business-facing vs technology-facing</em>, and <em>supporting the team vs critiquing the product</em>.</p>
<table>
  <thead><tr><th></th><th>Technology-facing</th><th>Business-facing</th></tr></thead>
  <tbody>
    <tr><td><strong>Support the team</strong></td><td><strong>Q1</strong> — unit &amp; component tests, TDD (automated)</td><td><strong>Q2</strong> — functional tests, examples, story acceptance (automated + manual)</td></tr>
    <tr><td><strong>Critique the product</strong></td><td><strong>Q4</strong> — performance, load, security (tools)</td><td><strong>Q3</strong> — exploratory, usability, UAT (manual)</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>Q1</strong> (tech, support): the JUnit tests from Chapter 8 — written <em>before/with</em> the code (TDD).</li>
  <li><strong>Q2</strong> (business, support): tests that capture what the business wants — acceptance tests, BDD scenarios (next lesson).</li>
  <li><strong>Q3</strong> (business, critique): human exploration — usability, exploratory testing (Chapter 6), UAT.</li>
  <li><strong>Q4</strong> (tech, critique): non-functional — performance, load, security — using tools.</li>
</ul>
<div class="callout">The quadrants are not a sequence, they are a <em>coverage checklist</em>: a healthy Agile team has activity in <strong>all four</strong>. A team with only Q1 (unit tests) ships fast but ships insecure, slow, or unusable software — exactly the gaps Q3 and Q4 catch.</div>
<h3>The whole-team approach &amp; the tester in Scrum</h3>
<p>The tester is a full sprint member: refining stories (adding testability and acceptance criteria in backlog refinement), pairing during development, automating Q1/Q2 checks, and doing Q3 exploratory testing before the story is "Done". The <strong>Definition of Done (DoD)</strong> typically includes "all acceptance tests pass, no open critical bugs, code reviewed" — a team-agreed exit criterion applied to <em>every</em> story.</p>
<div class="pitfall">"Agile means no documentation and no test plans" is a myth that fails exams and projects. Agile values <em>working software over comprehensive documentation</em> — it reduces heavy upfront documents, but acceptance criteria, the Definition of Done, and automated tests <em>are</em> the living documentation. Skipping them is not Agile; it is chaos.</div>
<h3>Ví dụ có lời giải · Worked example (place activities in quadrants)</h3>
<p>A sprint delivering a "checkout" story. Classify each testing activity:</p>
<ul>
  <li>JUnit tests for the discount calculator → <strong>Q1</strong>.</li>
  <li>A BDD scenario "Given a cart of 500k, When I apply code SAVE10, Then I pay 450k" → <strong>Q2</strong>.</li>
  <li>A tester freely exploring the checkout for confusing flows → <strong>Q3</strong>.</li>
  <li>A load test: 5,000 users checking out at once → <strong>Q4</strong>.</li>
</ul>
<div class="callout ok">All four quadrants active on a single story = balanced quality. This is the whole-team approach in one picture: developers own Q1, the whole team shapes Q2, testers lead Q3, and specialists/tools handle Q4.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Shift-left testing &amp; the "three amigos".</b> Agile pushes testing as early as possible. A key practice is the <b>three amigos</b> meeting: before a story is built, a business analyst, a developer and a tester discuss it together — the tester&#39;s "what about this edge case?" surfaces defects <em>in the requirement</em>, before a line of code exists. This is Principle 3 (early testing) operationalised, and it is why in strong Agile teams the cheapest bug is the one prevented in a conversation, not found in a test.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Kiểm thử trong Agile — một chuyển dịch tư duy</h2>
<p class="lead">Trong dự án truyền thống, test là một <em>pha</em> ở cuối. Trong <strong>Agile</strong>, test là một <em>hoạt động liên tục đan vào mọi sprint</em>. Cả đội — không phải một phòng QA riêng — sở hữu chất lượng. Tester ghép cặp với lập trình viên, giúp viết acceptance criteria, và test tính năng ngay khi nó được xây, không phải vài tuần sau.</p>
<h3>Agile Testing Quadrants (Crispin &amp; Gregory)</h3>
<p>Mô hình này (từ giáo trình môn) tổ chức test theo hai trục: <em>hướng nghiệp vụ vs hướng kỹ thuật</em>, và <em>hỗ trợ đội vs phê bình sản phẩm</em>.</p>
<table>
  <thead><tr><th></th><th>Hướng kỹ thuật</th><th>Hướng nghiệp vụ</th></tr></thead>
  <tbody>
    <tr><td><strong>Hỗ trợ đội</strong></td><td><strong>Q1</strong> — unit &amp; component test, TDD (tự động)</td><td><strong>Q2</strong> — functional test, ví dụ, acceptance của story (tự động + tay)</td></tr>
    <tr><td><strong>Phê bình sản phẩm</strong></td><td><strong>Q4</strong> — performance, load, security (công cụ)</td><td><strong>Q3</strong> — exploratory, usability, UAT (tay)</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>Q1</strong> (kỹ thuật, hỗ trợ): các JUnit test ở Chương 8 — viết <em>trước/cùng</em> code (TDD).</li>
  <li><strong>Q2</strong> (nghiệp vụ, hỗ trợ): test bắt lấy điều nghiệp vụ muốn — acceptance test, kịch bản BDD (bài sau).</li>
  <li><strong>Q3</strong> (nghiệp vụ, phê bình): khám phá của con người — usability, exploratory testing (Chương 6), UAT.</li>
  <li><strong>Q4</strong> (kỹ thuật, phê bình): phi chức năng — performance, load, security — bằng công cụ.</li>
</ul>
<div class="callout">Các quadrant không phải một trình tự, chúng là một <em>checklist phủ</em>: một đội Agile khoẻ mạnh có hoạt động ở <strong>cả bốn</strong>. Đội chỉ có Q1 (unit test) ship nhanh nhưng ship phần mềm không an toàn, chậm, hoặc khó dùng — đúng các khe hở mà Q3 và Q4 bắt.</div>
<h3>Whole-team approach &amp; tester trong Scrum</h3>
<p>Tester là thành viên đầy đủ của sprint: tinh chỉnh story (thêm tính test được và acceptance criteria trong backlog refinement), ghép cặp lúc phát triển, tự động hoá kiểm Q1/Q2, và làm Q3 exploratory trước khi story "Done". <strong>Definition of Done (DoD)</strong> thường gồm "mọi acceptance test pass, không bug critical mở, code đã review" — một exit criterion cả đội đồng thuận áp cho <em>mọi</em> story.</p>
<div class="pitfall">"Agile nghĩa là không tài liệu, không test plan" là một huyền thoại làm rớt cả đề thi lẫn dự án. Agile coi trọng <em>phần mềm chạy được hơn tài liệu đầy đủ</em> — nó giảm tài liệu nặng đầu dự án, nhưng acceptance criteria, Definition of Done, và test tự động <em>chính là</em> tài liệu sống. Bỏ chúng không phải Agile; đó là hỗn loạn.</div>
<h3>Ví dụ có lời giải · Đặt hoạt động vào quadrant</h3>
<p>Một sprint giao story "checkout". Phân loại mỗi hoạt động test:</p>
<ul>
  <li>JUnit test cho bộ tính discount → <strong>Q1</strong>.</li>
  <li>Kịch bản BDD "Given giỏ 500k, When áp mã SAVE10, Then trả 450k" → <strong>Q2</strong>.</li>
  <li>Tester tự do khám phá checkout tìm luồng gây rối → <strong>Q3</strong>.</li>
  <li>Load test: 5.000 người checkout cùng lúc → <strong>Q4</strong>.</li>
</ul>
<div class="callout ok">Cả bốn quadrant hoạt động trên một story = chất lượng cân bằng. Đây là whole-team approach trong một bức tranh: lập trình viên sở hữu Q1, cả đội định hình Q2, tester dẫn Q3, và chuyên gia/công cụ lo Q4.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Shift-left testing &amp; "three amigos".</b> Agile đẩy test càng sớm càng tốt. Một thực hành then chốt là buổi <b>three amigos</b>: trước khi một story được xây, một business analyst, một lập trình viên và một tester bàn cùng nhau — câu "còn case biên này thì sao?" của tester phơi bày defect <em>ngay trong yêu cầu</em>, trước khi có một dòng code. Đó là Nguyên tắc 3 (test sớm) được vận hành hoá, và là lý do trong đội Agile mạnh, bug rẻ nhất là bug được ngăn trong một cuộc trò chuyện, không phải tìm thấy trong một test.</div>
</div>
`,
        },
        {
          title: '9.2 — TDD, BDD & continuous testing|||9.2 — TDD, BDD & continuous testing',
          slug: 'swt301-tdd-bdd',
          type: 'VIDEO',
          description: 'Test-Driven Development (red-green-refactor), Behavior-Driven Development (Given-When-Then), và continuous testing trong CI/CD.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Test-Driven Development (TDD)</h2>
<p class="lead"><strong>TDD</strong> flips the usual order: you write the <em>test first</em>, watch it fail, then write just enough code to pass. The rhythm is <strong>Red → Green → Refactor</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Red</div><div class="lz-t">Write a failing test</div><div class="lz-d">for behaviour that does not exist yet</div></div>
  <div class="lz-step"><div class="lz-k">2 · Green</div><div class="lz-t">Make it pass</div><div class="lz-d">simplest code that satisfies the test</div></div>
  <div class="lz-step"><div class="lz-k">3 · Refactor</div><div class="lz-t">Clean up</div><div class="lz-d">improve design, tests stay green</div></div>
</div>
<pre><span class="tok-comment">// TDD step 1 — write this FIRST, it fails (isPrime doesn't exist)</span>
<span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">sevenIsPrime</span>() {
    <span class="tok-function">assertTrue</span>(<span class="tok-type">Numbers</span>.<span class="tok-function">isPrime</span>(7));
}
<span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">eightIsNotPrime</span>() {
    <span class="tok-function">assertFalse</span>(<span class="tok-type">Numbers</span>.<span class="tok-function">isPrime</span>(8));
}
<span class="tok-comment">// step 2 — now write isPrime() until both go green</span></pre>
<div class="out">Red: tests fail (method missing). Green: implement isPrime, tests pass. Refactor: tidy the loop, tests stay green. The test suite grew before the feature — coverage is automatic.</div>
<div class="callout">TDD is a <em>design</em> technique as much as a testing one: writing the test first forces you to think about the interface and edge cases before implementation, and you end up with a fully-tested unit and 100% of its behaviour pinned down.</div>
<h2>Behavior-Driven Development (BDD)</h2>
<p class="lead"><strong>BDD</strong> extends TDD toward the <em>business</em>. Scenarios are written in plain, structured language (<strong>Gherkin</strong>: Given-When-Then) that non-programmers can read — so business, dev and test share one specification (this is Q2 of the quadrants).</p>
<pre><span class="tok-keyword">Feature</span>: Cart discount
  <span class="tok-keyword">Scenario</span>: Apply a valid discount code
    <span class="tok-keyword">Given</span> a cart totalling 500,000
    <span class="tok-keyword">When</span> I apply the code "SAVE10"
    <span class="tok-keyword">Then</span> my total should be 450,000
    <span class="tok-keyword">And</span> the discount line shows "-50,000"</pre>
<div class="out">Tools like Cucumber turn each Given/When/Then line into executable steps, so this readable scenario runs as an automated acceptance test — living documentation that cannot go out of date without failing.</div>
<div class="pitfall">TDD ≠ BDD. TDD is developer-facing (test methods drive code design at the unit level); BDD is business-facing (readable scenarios describe behaviour/acceptance). BDD is often described as "TDD done at the feature level, in the language of the business". Mixing them up on the exam is common.</div>
<h2>Continuous testing</h2>
<p><strong>Continuous testing</strong> means the automated suite (Q1/Q2, plus Q4 checks) runs on <em>every</em> change in the CI/CD pipeline, giving instant feedback. Combined with TDD/BDD, the team always has an up-to-date, executable definition of "correct" — which is what lets Agile teams release frequently and safely.</p>
<div class="callout ok">The Agile picture, assembled: TDD grows Q1 unit tests as code is written; BDD captures Q2 business behaviour readably; exploratory testing (Q3) probes for surprises; performance/security tools cover Q4; and continuous testing runs it all on every commit. Quality is built in, not bolted on at the end.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>DevOps, DORA metrics &amp; testing in production.</b> Modern teams fuse testing into <b>DevOps</b> and measure themselves with the four <b>DORA metrics</b> (deployment frequency, lead time, change-failure rate, mean-time-to-restore). Fast, reliable automated tests are the enabler of elite performance on all four. Beyond the pipeline, <b>testing in production</b> — feature flags, canary releases, A/B tests, real-user monitoring — treats live traffic as the ultimate test environment (the shift-right from Chapter 1). The frontier: <b>observability-driven development</b>, where you ship, watch real behaviour, and let production telemetry, not just pre-release tests, tell you if it works.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practise TDD: red-green-refactor with JUnit</span><span class="lc-sub">Write the test first, then the code — on CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Test-Driven Development (TDD)</h2>
<p class="lead"><strong>TDD</strong> đảo thứ tự thông thường: bạn viết <em>test trước</em>, xem nó fail, rồi viết vừa đủ code để pass. Nhịp là <strong>Red → Green → Refactor</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Red</div><div class="lz-t">Viết một test fail</div><div class="lz-d">cho hành vi chưa tồn tại</div></div>
  <div class="lz-step"><div class="lz-k">2 · Green</div><div class="lz-t">Làm nó pass</div><div class="lz-d">code đơn giản nhất thoả test</div></div>
  <div class="lz-step"><div class="lz-k">3 · Refactor</div><div class="lz-t">Dọn dẹp</div><div class="lz-d">cải thiện thiết kế, test vẫn xanh</div></div>
</div>
<pre><span class="tok-comment">// TDD bước 1 — viết cái này TRƯỚC, nó fail (isPrime chưa có)</span>
<span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">sevenIsPrime</span>() {
    <span class="tok-function">assertTrue</span>(<span class="tok-type">Numbers</span>.<span class="tok-function">isPrime</span>(7));
}
<span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">eightIsNotPrime</span>() {
    <span class="tok-function">assertFalse</span>(<span class="tok-type">Numbers</span>.<span class="tok-function">isPrime</span>(8));
}
<span class="tok-comment">// bước 2 — giờ viết isPrime() tới khi cả hai xanh</span></pre>
<div class="out">Red: test fail (thiếu method). Green: cài isPrime, test pass. Refactor: gọn lại vòng lặp, test vẫn xanh. Bộ test lớn lên trước tính năng — coverage tự động.</div>
<div class="callout">TDD là kỹ thuật <em>thiết kế</em> không kém gì kỹ thuật test: viết test trước buộc bạn nghĩ về giao diện và case biên trước khi cài đặt, và bạn có một unit được test đầy đủ với 100% hành vi được ghim chặt.</div>
<h2>Behavior-Driven Development (BDD)</h2>
<p class="lead"><strong>BDD</strong> mở rộng TDD về phía <em>nghiệp vụ</em>. Kịch bản viết bằng ngôn ngữ có cấu trúc, dễ đọc (<strong>Gherkin</strong>: Given-When-Then) mà người không lập trình đọc được — nên nghiệp vụ, dev và test chia sẻ một đặc tả (đây là Q2 của quadrant).</p>
<pre><span class="tok-keyword">Feature</span>: Cart discount
  <span class="tok-keyword">Scenario</span>: Áp mã giảm giá hợp lệ
    <span class="tok-keyword">Given</span> một giỏ tổng 500.000
    <span class="tok-keyword">When</span> tôi áp mã "SAVE10"
    <span class="tok-keyword">Then</span> tổng của tôi phải là 450.000
    <span class="tok-keyword">And</span> dòng giảm giá hiện "-50.000"</pre>
<div class="out">Công cụ như Cucumber biến mỗi dòng Given/When/Then thành bước chạy được, nên kịch bản dễ đọc này chạy như một acceptance test tự động — tài liệu sống không thể lỗi thời mà không fail.</div>
<div class="pitfall">TDD ≠ BDD. TDD hướng lập trình viên (method test dẫn dắt thiết kế code mức unit); BDD hướng nghiệp vụ (kịch bản dễ đọc mô tả hành vi/acceptance). BDD thường được mô tả là "TDD làm ở mức tính năng, bằng ngôn ngữ của nghiệp vụ". Nhầm hai cái trong đề rất phổ biến.</div>
<h2>Continuous testing</h2>
<p><strong>Continuous testing</strong> nghĩa là bộ test tự động (Q1/Q2, cộng kiểm Q4) chạy trên <em>mọi</em> thay đổi trong pipeline CI/CD, cho phản hồi tức thì. Kết hợp TDD/BDD, đội luôn có một định nghĩa "đúng" cập nhật, chạy được — chính điều đó cho phép đội Agile phát hành thường xuyên và an toàn.</p>
<div class="callout ok">Bức tranh Agile ráp lại: TDD nuôi lớn unit test Q1 khi code được viết; BDD bắt hành vi nghiệp vụ Q2 một cách dễ đọc; exploratory testing (Q3) dò tìm bất ngờ; công cụ performance/security lo Q4; và continuous testing chạy tất cả trên mỗi commit. Chất lượng được xây vào bên trong, không phải bắt vít ở cuối.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>DevOps, DORA metrics &amp; test trên production.</b> Đội hiện đại hợp nhất test vào <b>DevOps</b> và tự đo bằng bốn <b>DORA metrics</b> (tần suất deploy, lead time, tỉ lệ thay đổi gây lỗi, thời gian khôi phục trung bình). Test tự động nhanh, đáng tin là yếu tố cho phép đạt hiệu suất elite ở cả bốn. Ngoài pipeline, <b>testing in production</b> — feature flag, canary release, A/B test, giám sát người dùng thật — coi lưu lượng thật là môi trường test tối thượng (shift-right từ Chương 1). Biên giới: <b>observability-driven development</b>, nơi bạn ship, quan sát hành vi thật, và để telemetry production, không chỉ test trước phát hành, cho bạn biết nó có chạy không.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện TDD: red-green-refactor với JUnit</span><span class="lc-sub">Viết test trước, rồi viết code — trên CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 9 — Agile testing|||Quiz 9 — Agile testing',
          slug: 'swt301-quiz-9',
          type: 'QUIZ',
          description: 'Kiểm tra testing quadrants, TDD, BDD và continuous testing.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'The Agile testing quadrants are best used as…|||Agile testing quadrants dùng tốt nhất như…', options: ['a strict sequence of phases|||một trình tự pha nghiêm ngặt', 'a coverage checklist — a healthy team is active in all four|||một checklist phủ — đội khoẻ hoạt động ở cả bốn', 'a list of tools to buy|||danh sách công cụ cần mua', 'a replacement for testing|||thứ thay thế test'], correctIndex: 1, points: 1 },
              { question: 'The TDD cycle is…|||Chu trình TDD là…', options: ['code → test → ship|||code → test → ship', 'red → green → refactor|||red → green → refactor', 'plan → build → test|||plan → build → test', 'design → code → deploy|||design → code → deploy'], correctIndex: 1, points: 1 },
              { question: 'BDD scenarios are typically written in…|||Kịch bản BDD thường viết bằng…', options: ['Java bytecode|||Java bytecode', 'Given-When-Then (Gherkin), readable by non-programmers|||Given-When-Then (Gherkin), người không lập trình đọc được', 'SQL|||SQL', 'binary|||nhị phân'], correctIndex: 1, points: 1 },
              { question: 'Load and security testing fall into which quadrant?|||Load và security testing thuộc quadrant nào?', options: ['Q1 (tech, support)|||Q1 (kỹ thuật, hỗ trợ)', 'Q2 (business, support)|||Q2 (nghiệp vụ, hỗ trợ)', 'Q3 (business, critique)|||Q3 (nghiệp vụ, phê bình)', 'Q4 (tech, critique)|||Q4 (kỹ thuật, phê bình)'], correctIndex: 3, points: 1 },
              { question: 'Which statement about Agile documentation is TRUE?|||Phát biểu nào về tài liệu Agile là ĐÚNG?', options: ['Agile forbids all documentation|||Agile cấm mọi tài liệu', 'acceptance criteria, DoD and automated tests are living documentation|||acceptance criteria, DoD và test tự động là tài liệu sống', 'test plans are illegal in Agile|||test plan là bất hợp pháp trong Agile', 'only managers write docs|||chỉ quản lý viết tài liệu'], correctIndex: 1, points: 1 },
              { question: 'Continuous testing primarily gives the team…|||Continuous testing chủ yếu cho đội…', options: ['slower releases|||phát hành chậm hơn', 'instant feedback on every change via the CI/CD pipeline|||phản hồi tức thì trên mọi thay đổi qua pipeline CI/CD', 'no need for unit tests|||khỏi cần unit test', 'a replacement for developers|||thứ thay thế lập trình viên'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 3 ══════════════════ */
    {
      title: 'Progress Test 3 — Management, tools & Agile|||Progress Test 3 — Quản lý, công cụ & Agile',
      description: 'Bài kiểm tra tiến độ 3 (mô phỏng): test management, tools/automation, Agile testing.',
      lessons: [
        {
          title: 'Progress Test 3|||Progress Test 3',
          slug: 'swt301-progress-test-3',
          type: 'QUIZ',
          description: 'Tổng hợp Chương 7–9. 8 câu, gồm câu tình huống.',
          quiz: {
            timeLimitSeconds: 600,
            questions: [
              { question: 'Risk in risk-based testing combines…|||Rủi ro trong risk-based testing kết hợp…', options: ['cost and time|||chi phí và thời gian', 'likelihood and impact|||khả năng và mức tác động', 'severity and duplicate|||severity và duplicate', 'coverage and speed|||coverage và tốc độ'], correctIndex: 1, points: 1 },
              { question: 'Severity is decided by the tester; priority is decided by…|||Severity do tester quyết; priority do ai quyết?', options: ['the compiler|||trình biên dịch', 'the product owner / business|||product owner / nghiệp vụ', 'the end user only|||chỉ người dùng cuối', 'nobody|||không ai'], correctIndex: 1, points: 1 },
              { question: 'On the test pyramid, UI/E2E tests should be…|||Trên test pyramid, test UI/E2E nên…', options: ['the most numerous|||nhiều nhất', 'the fewest|||ít nhất', 'exactly half|||đúng một nửa', 'eliminated entirely|||loại bỏ hoàn toàn'], correctIndex: 1, points: 1 },
              { question: 'A test that passes/fails intermittently without code changes is…|||Một test lúc pass lúc fail thất thường mà không đổi code là…', options: ['a flaky test|||một flaky test', 'a unit test|||một unit test', 'a smoke test|||một smoke test', 'a boundary test|||một boundary test'], correctIndex: 0, points: 1 },
              { question: 'In TDD you write the…|||Trong TDD bạn viết…', options: ['code first, then the test|||code trước, rồi test', 'test first, then just enough code to pass|||test trước, rồi vừa đủ code để pass', 'documentation first|||tài liệu trước', 'the UI first|||UI trước'], correctIndex: 1, points: 1 },
              { question: 'Which is BEST automated rather than done manually?|||Cái nào NÊN tự động thay vì làm tay?', options: ['exploratory testing|||exploratory testing', 'usability judgement|||đánh giá usability', 'repetitive regression checks|||kiểm regression lặp lại', 'deciding the visual design|||quyết định thiết kế trực quan'], correctIndex: 2, points: 1 },
              { question: 'Exit criteria should be…|||Exit criteria nên…', options: ['vague and flexible|||mơ hồ và linh hoạt', 'measurable (e.g. coverage %, open critical bugs)|||đo được (vd % coverage, số bug critical mở)', 'decided after release|||quyết sau phát hành', 'the same for every project|||giống nhau mọi dự án'], correctIndex: 1, points: 1 },
              { question: 'BDD is best described as…|||BDD được mô tả đúng nhất là…', options: ['unit testing in binary|||unit test bằng nhị phân', 'describing behaviour in business-readable Given-When-Then scenarios|||mô tả hành vi bằng kịch bản Given-When-Then dễ đọc cho nghiệp vụ', 'a load testing tool|||công cụ load test', 'a bug tracker|||một bug tracker'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "swt301-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>\n<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>\n<li>Read the requirement twice; build the smallest working version first, then extend.</li>\n<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>\n<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>\n<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>\n<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "swt301-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "A human mistake that leads to wrong code is called a…|||Sai sót của con người dẫn tới code sai gọi là…",
                "options": [
                  "failure|||failure",
                  "error|||error",
                  "defect|||defect",
                  "incident|||incident"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "A defect becomes a failure only when…|||Một defect trở thành failure chỉ khi…",
                "options": [
                  "it is written in the code|||nó được viết vào code",
                  "the faulty code is executed under the right conditions|||dòng code lỗi được thực thi trong điều kiện phù hợp",
                  "a tester reads it|||tester đọc thấy nó",
                  "the project ends|||dự án kết thúc"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "Which statement about testing is TRUE?|||Phát biểu nào về kiểm thử là ĐÚNG?",
                "options": [
                  "Testing proves software has no defects|||Test chứng minh phần mềm không có defect",
                  "Testing can show defects are present but not that there are none|||Test chỉ ra defect hiện diện, không chứng minh không có defect",
                  "Exhaustive testing is always possible|||Luôn có thể test vét cạn",
                  "Testing makes code correct by itself|||Test tự làm code đúng"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "The \"pesticide paradox\" means…|||\"Pesticide paradox\" nghĩa là…",
                "options": [
                  "tests get slower over time|||test chậm dần theo thời gian",
                  "repeating the same tests stops finding new defects|||chạy lại đúng bộ test cũ ngừng tìm ra defect mới",
                  "defects spread like insects|||defect lây như côn trùng",
                  "automation is harmful|||automation có hại"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "Defect clustering (Principle 4) implies you should…|||Defect clustering (Nguyên tắc 4) hàm ý bạn nên…",
                "options": [
                  "test every module equally|||test mọi module như nhau",
                  "focus more testing on the few high-defect modules|||dồn test vào số ít module nhiều defect",
                  "stop testing after one bug|||ngừng test sau một bug",
                  "test only the UI|||chỉ test UI"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "Which field makes a test case verifiable (pass/fail)?|||Trường nào khiến test case kiểm chứng được (pass/fail)?",
                "options": [
                  "the ID|||ID",
                  "the expected result|||kết quả mong đợi",
                  "the author name|||tên tác giả",
                  "the date|||ngày"
                ],
                "correctIndex": 1
              }
            ]
          }
        }
      ]
    },
  ],
};
