/**
 * PRF192 — Cơ sở lập trình (Programming Fundamentals, C). Kỳ 1.
 * Nội dung Academy FPTU — bám sát syllabus (60 buổi, 9 CLO) + chương nâng cao.
 * VN-primary, thuật ngữ EN giữ nguyên; luyện code → CodeLab; setup/IDE → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/PRF192.mjs --apply
 */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'PRF192',
    title: 'Programming Fundamentals',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Intro to programming in C: variables, expressions, control flow, functions, pointers, arrays, structs, strings and files — the foundation of the whole Software Engineering track.|||Nhập môn lập trình với ngôn ngữ C: biến, biểu thức, điều khiển, hàm, con trỏ, mảng, struct, chuỗi, tệp tin — nền tảng cho toàn bộ lộ trình Kỹ thuật phần mềm.',
    description: 'Môn lập trình đầu tiên của ngành. Học cách máy tính thực thi chương trình và cách giải bài toán thực tế bằng C theo hướng lập trình thủ tục. Là tiên quyết của PRO192 (OOP) và LAB211.',
    whatYouLearn: 'Đọc–hiểu–viết chương trình C cỡ vừa; tư duy chia bài toán thành hàm/module; nắm con trỏ, mảng, struct, chuỗi, tệp tin; gỡ lỗi cơ bản.',
    requirements: 'Không có môn tiên quyết. Cần máy tính cài được trình biên dịch C (DevC++ / VS Code + GCC).',
    documentsNote: 'Giáo trình: Foundations of Programming Using C (Evan Weaver) • The C Programming Language (Kernighan & Ritchie). Công cụ: DevC++ 6.3 hoặc VS Code + GCC. Kèm file syllabus gốc PRF192.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, lộ trình và tài liệu.',
      lessons: [
        {
          title: '0.1 — About PRF192 & Course Map|||0.1 — Giới thiệu môn PRF192 & bản đồ môn học',
          slug: 'prf192-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Môn học này là gì, học xong làm được gì, và bản đồ toàn bộ hành trình.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About PRF192 — Programming Fundamentals</h2>
<p class="lead">PRF192 is the <strong>first</strong> programming course of the Software Engineering track. The goal is not to memorize syntax, but to <strong>learn to think like a programmer</strong>: look at a real problem and know how to break it into steps a computer can carry out.</p>
<p>The language is <strong>C</strong> — a small language close to how a computer really works. After learning C you understand what lies "underneath" every modern language (Java, C#, Python…): memory, pointers, data types. That is why the university puts C first.</p>
<h3>By the end of this course you will be able to</h3>
<ul>
  <li>Read and understand a mid-sized C program (a few hundred lines).</li>
  <li>Write programs that solve real problems: calculations, list processing, reading/writing files.</li>
  <li>Break a large problem into small, clear <strong>functions</strong>.</li>
  <li>Understand <strong>pointers</strong> and how the machine manages memory — the tough but key idea.</li>
</ul>
<h3>Course map — 10 core chapters</h3>
<p>All 60 university sessions are grouped into the roadmap below. Each chapter builds on the previous one, so study them in order:</p>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Getting started: program &amp; computer</div><div class="lz-nsub">How a program runs, the structure of a C file</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Variables &amp; data types</div><div class="lz-nsub">Storing and reading data · input/output</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Expressions &amp; operators</div><div class="lz-nsub">Arithmetic, comparison, logic</div></div></div>
  <div class="lz-stage">Control flow</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Control structures</div><div class="lz-nsub">if / switch · loops for/while/do-while</div></div></div>
  <div class="lz-stage">Program structure</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Functions &amp; Modules</div><div class="lz-nsub">Split a problem into small functions</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Pointers</div><div class="lz-nsub">Addresses &amp; memory — the key to C</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">C standard library</div><div class="lz-nsub">stdlib, math, string, time…</div></div></div>
  <div class="lz-stage">Data</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Arrays &amp; Structs</div><div class="lz-nsub">Lists &amp; composite data</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Strings</div><div class="lz-nsub">Text processing</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Files</div><div class="lz-nsub">Reading/writing data to disk</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Debug · Stack/Heap · Deep pointers · C projects</div><div class="lz-nsub">Understand deeper &amp; more firmly than in class</div></div></div>
</div>
<p>After PRF192 you move on to <span class="badge">PRO192</span> Object-Oriented Programming and <span class="badge">LAB211</span> — both assume you are solid on functions, arrays and pointers from here.</p>
<div class="callout ok">The most effective way to study this course: <strong>retype every example and run it</strong>, don't just read. Programming is a skill — like swimming, watching others won't teach you.</div>
<a class="link-card exphub" href="/exp-hub/prf192-cai-dat-moi-truong-c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt môi trường C — hướng dẫn & tải về</span><span class="lc-sub">Guide chi tiết DevC++ / VS Code + GCC, link tải chính thức và cách dùng — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing Requirements & Grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'prf192-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">Know the rules before the match. The information below comes straight from the university's official syllabus.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + 1h exam + 104h self-study</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 sessions <small>45 min each</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None <small>can take from semester 1</small></span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>15%</td><td>Take-home assignment (CLO2–9)</td></tr>
    <tr><td>Practical Exam</td><td>30%</td><td>Hands-on exam on a computer, 85 min (CLO2–8)</td></tr>
    <tr><td>Progress Test ×2</td><td>15%</td><td>2 mid-course tests, 20–40 min</td></tr>
    <tr><td>Workshop ×5</td><td>10%</td><td>In-class practice across 5 workshops</td></tr>
    <tr><td><strong>Final Exam</strong></td><td><strong>30%</strong></td><td>Multiple choice, 60 min (CLO1–9)</td></tr>
  </tbody>
</table>
<div class="callout warn">Two <strong>hard blockers</strong> even with a high coursework score: (1) missing more than 20% of sessions = <strong>barred from the exam</strong>; (2) the <strong>Final Exam must be ≥ 4.0</strong> to count as a pass.</div>
<div class="note-ct">Practical Exam (30%) and Final (30%) make up 60% — both are taken <strong>live on a computer / as multiple choice</strong>, so rote learning won't help. The safe strategy: finish every Workshop and the practice on CodeLab so your hands get used to typing code and you're fast on exam day.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Nắm luật chơi trước khi vào trận. Dưới đây là thông tin lấy thẳng từ syllabus chính thức của trường.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp + 1h thi + 104h tự học</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 buổi <small>45 phút/buổi</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không <small>học ngay từ kỳ 1</small></span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi TB ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>

<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>15%</td><td>Bài tập lớn làm ở nhà (CLO2–9)</td></tr>
    <tr><td>Practical Exam</td><td>30%</td><td>Thi thực hành trên máy, 85 phút (CLO2–8)</td></tr>
    <tr><td>Progress Test ×2</td><td>15%</td><td>2 bài kiểm tra giữa chặng, 20–40 phút</td></tr>
    <tr><td>Workshop ×5</td><td>10%</td><td>Thực hành tại lớp qua 5 workshop</td></tr>
    <tr><td><strong>Final Exam</strong></td><td><strong>30%</strong></td><td>Trắc nghiệm, 60 phút (CLO1–9)</td></tr>
  </tbody>
</table>

<div class="callout warn">Hai điều kiện <strong>chặn cứng</strong> dù điểm quá trình cao: (1) vắng quá 20% buổi = <strong>cấm thi</strong>; (2) điểm <strong>Final Exam phải ≥ 4.0</strong> thì mới được tính qua môn.</div>

<div class="note-ct">Practical Exam (30%) và Final (30%) chiếm 60% — đều thi <strong>trực tiếp trên máy/trắc nghiệm</strong>, không học vẹt được. Cách ăn chắc: làm hết Workshop và bài luyện ở CodeLab để tay quen gõ code, khi thi mới nhanh.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning Outcomes (CLOs) & Roadmap|||0.3 — Chuẩn đầu ra (CLO) & lộ trình 60 buổi',
          slug: 'prf192-chuan-dau-ra',
          type: 'VIDEO',
          description: '9 chuẩn đầu ra của môn và cách chúng gom vào từng chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>9 course learning outcomes (CLOs) &amp; roadmap</h2>
<p class="lead">A "Course Learning Outcome" (CLO) is what you <strong>must be able to do</strong> after the course. The exams follow these CLOs closely — knowing the CLO map tells you what you'll be tested on.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Explain how a program runs on a computer</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Use variables, expressions and basic operators</td><td>2–3</td></tr>
    <tr><td>CLO3</td><td>Use logic structures: branching, loops</td><td>4</td></tr>
    <tr><td>CLO4</td><td>Write &amp; use functions, split into modules</td><td>5</td></tr>
    <tr><td>CLO5</td><td>Understand &amp; use pointers</td><td>6</td></tr>
    <tr><td>CLO6</td><td>Use the C standard library</td><td>7</td></tr>
    <tr><td>CLO7</td><td>Use arrays &amp; structs</td><td>8</td></tr>
    <tr><td>CLO8</td><td>Process strings</td><td>9</td></tr>
    <tr><td>CLO9</td><td>Read/write files</td><td>10</td></tr>
  </tbody>
</table>
<div class="callout">Six Constructive Questions from the university — answer them yourself to self-check at the start: What is C and what is it used for? The basic structure of a C program? What does <code>#include</code> do? What is the <code>main()</code> function for? How do you write comments? What is the role of the semicolon?</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>9 chuẩn đầu ra (CLO) &amp; lộ trình</h2>
<p class="lead">"Chuẩn đầu ra" (Course Learning Outcome) là những gì bạn <strong>phải làm được</strong> sau môn. Đề thi bám sát các CLO này — nắm được bản đồ CLO là biết mình sẽ bị hỏi gì.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ làm được</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Giải thích chương trình chạy thế nào trên máy</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Dùng biến, biểu thức, phép toán cơ bản</td><td>2–3</td></tr>
    <tr><td>CLO3</td><td>Dùng cấu trúc logic: rẽ nhánh, vòng lặp</td><td>4</td></tr>
    <tr><td>CLO4</td><td>Viết &amp; dùng hàm, chia module</td><td>5</td></tr>
    <tr><td>CLO5</td><td>Hiểu &amp; dùng con trỏ</td><td>6</td></tr>
    <tr><td>CLO6</td><td>Dùng thư viện chuẩn C</td><td>7</td></tr>
    <tr><td>CLO7</td><td>Dùng mảng &amp; struct</td><td>8</td></tr>
    <tr><td>CLO8</td><td>Xử lý chuỗi (string)</td><td>9</td></tr>
    <tr><td>CLO9</td><td>Đọc/ghi tệp tin</td><td>10</td></tr>
  </tbody>
</table>
<div class="callout">Sáu câu hỏi dẫn nhập (Constructive Questions) của trường — tự trả lời để kiểm tra đầu môn: C là gì và dùng làm gì? Cấu trúc cơ bản của chương trình C? <code>#include</code> làm gì? Hàm <code>main()</code> để làm gì? Cách viết chú thích? Vai trò của dấu chấm phẩy?</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, Tools & Submission|||0.4 — Tài liệu, công cụ & cách nộp bài',
          slug: 'prf192-tai-lieu-cong-cu',
          type: 'DOCUMENT',
          description: 'Giáo trình, trình biên dịch, và nơi luyện tập.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; where to practice</h2>
<h3>Textbooks</h3>
<ul>
  <li><strong>Foundations of Programming Using C</strong> — Evan Weaver (main textbook, free).</li>
  <li><strong>The C Programming Language</strong> — Kernighan &amp; Ritchie ("K&amp;R", a classic, read it gradually).</li>
  <li>MOOC: <em>Introduction to C</em> — Chris Szalwinski, Seneca College.</li>
</ul>
<h3>Tools</h3>
<ul>
  <li>Compiler: <strong>DevC++ 6.3</strong> (used by the university) or <strong>VS Code + GCC</strong> (recommended, more professional).</li>
</ul>
<a class="link-card exphub" href="/exp-hub/prf192-cai-dat-moi-truong-c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install &amp; configure your IDE — download</span><span class="lc-sub">Step-by-step DevC++ / VS Code + GCC setup and download links — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice code right in the browser</span><span class="lc-sub">Solve auto-graded C exercises on CodeLab — no install needed.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout">📎 Attached to this lesson: <strong>the original PRF192.pdf syllabus</strong> — the university's official version, for reference.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; nơi luyện tập</h2>
<h3>Giáo trình</h3>
<ul>
  <li><strong>Foundations of Programming Using C</strong> — Evan Weaver (giáo trình chính, miễn phí).</li>
  <li><strong>The C Programming Language</strong> — Kernighan &amp; Ritchie ("K&amp;R", kinh điển, nên đọc dần).</li>
  <li>MOOC: <em>Introduction to C</em> — Chris Szalwinski, Seneca College.</li>
</ul>
<h3>Công cụ</h3>
<ul>
  <li>Trình biên dịch: <strong>DevC++ 6.3</strong> (trường dùng) hoặc <strong>VS Code + GCC</strong> (khuyên dùng, chuyên nghiệp hơn).</li>
</ul>
<a class="link-card exphub" href="/exp-hub/prf192-cai-dat-moi-truong-c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt & cấu hình IDE — tải về</span><span class="lc-sub">Từng bước cài DevC++ / VS Code + GCC và link tải — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện code trực tiếp trên trình duyệt</span><span class="lc-sub">Làm bài tập C có chấm tự động ở CodeLab — không cần cài gì.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout">📎 File đính kèm mục này: <strong>syllabus gốc PRF192.pdf</strong> — bản chính thức của trường, dùng để đối chiếu.</div>
</div>
`,
        },
        {
          title: '0.5 — Install & Use DevC++ / VS Code|||0.5 — Cài đặt & sử dụng DevC++ / VS Code',
          slug: 'prf192-0-5-cai-dat-moi-truong',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Hướng dẫn cài đặt, cấu hình và dùng DevC++ hoặc VS Code + GCC để viết, biên dịch, chạy và gỡ lỗi chương trình C.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Install &amp; use your C programming tools</h2>
<p class="lead">Before writing your first line of code you need a <strong>C compiler</strong> and a <strong>text editor</strong>. This lesson covers two options: <strong>DevC++</strong> (simple, used by the university) and <strong>VS Code + GCC</strong> (professional, for the long run). Either one is enough for the whole course.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">What you need</div><div class="lz-t">A compiler</div><div class="lz-d">GCC — turns C into a runnable program</div></div>
  <div class="lz-step"><div class="lz-k">+</div><div class="lz-t">An editor</div><div class="lz-d">where you type code</div></div>
  <div class="lz-step"><div class="lz-k">=</div><div class="lz-t">Write → compile → run</div><div class="lz-d">the programming loop</div></div>
</div>

<h3>Option A — DevC++ (quick &amp; easy for beginners)</h3>
<p>DevC++ bundles both the compiler and the editor in one installer — no extra configuration.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Download &amp; install</div><div class="lz-nsub">Download "Embarcadero Dev-C++" (v6.3), run the installer, click Next to the end.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Create a .c file</div><div class="lz-nsub">File → New → Source File, save with a <code>.c</code> extension (not .cpp).</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Compile &amp; run</div><div class="lz-nsub">Press <kbd>F11</kbd> (Compile &amp; Run). A black window shows the result.</div></div></div>
</div>
<pre><span class="tok-comment">// Type this and press F11</span>
<span class="tok-keyword">#include</span> &lt;stdio.h&gt;
<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-function">printf</span>(<span class="tok-string">"Moi truong da san sang!"</span>);
    <span class="tok-keyword">return</span> 0;
}</pre>
<div class="pitfall">If the result window appears then <em>closes immediately</em>, add <code>getchar();</code> before <code>return 0;</code> so it waits for you. And remember to save the file with a <code>.c</code> extension — a <code>.cpp</code> file compiles as C++, which has some different rules.</div>

<h3>Option B — VS Code + GCC (recommended long-term)</h3>
<p>VS Code is a powerful editor for every language. You also need to install GCC (via MinGW-w64 on Windows).</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Install VS Code</div><div class="lz-nsub">Download from code.visualstudio.com and install normally.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Install GCC (MinGW-w64)</div><div class="lz-nsub">Windows: install MSYS2 then <code>pacman -S mingw-w64-ucrt-x86_64-gcc</code>. macOS: <code>xcode-select --install</code>. Linux: <code>sudo apt install gcc</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Add GCC to PATH</div><div class="lz-nsub">Windows: add <code>...\\ucrt64\\bin</code> to the Path environment variable. Check: open a Terminal and type <code>gcc --version</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Install the C/C++ extension</div><div class="lz-nsub">In VS Code, install Microsoft's "C/C++" extension.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Compile &amp; run</div><div class="lz-nsub">Open the Terminal (<kbd>Ctrl</kbd>+<kbd>&#96;</kbd>) and run the commands below.</div></div></div>
</div>
<pre><span class="tok-comment"># Compile hello.c into a program named hello</span>
gcc hello.c -o hello
<span class="tok-comment"># Run (Windows)</span>
.\\hello
<span class="tok-comment"># Run (macOS/Linux)</span>
./hello</pre>
<div class="pitfall">Common error: <code>gcc</code> is not recognized (<em>"'gcc' is not recognized"</em>) → GCC isn't on the PATH; redo step 3 then <strong>reopen</strong> VS Code/Terminal. PATH is only read when a new window opens.</div>

<h3>Debugging in VS Code</h3>
<p>Set a <strong>breakpoint</strong> (click the left margin next to a line number → red dot), press <kbd>F5</kbd> to step through and watch variable values. You'll use this skill in advanced chapter N1.</p>

<div class="note-ct">Advice: beginners start with <strong>DevC++</strong> for speed; once comfortable, switch to <strong>VS Code + GCC</strong> — the tools you'll use throughout the field. Both compile with GCC, so the C code you write is identical.</div>

<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-278" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice now, no install needed</span><span class="lc-sub">The "C Fundamentals &amp; Development Environment" module on Code Lab — run C in the browser while you set up your machine.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Cài đặt &amp; sử dụng công cụ lập trình C</h2>
<p class="lead">Trước khi viết dòng code đầu tiên, bạn cần một <strong>trình biên dịch C</strong> và một <strong>trình soạn thảo</strong>. Bài này hướng dẫn hai lựa chọn: <strong>DevC++</strong> (đơn giản, trường dùng) và <strong>VS Code + GCC</strong> (chuyên nghiệp, dùng lâu dài). Chọn một trong hai là đủ học cả môn.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Cần gì</div><div class="lz-t">Trình biên dịch</div><div class="lz-d">GCC — dịch C ra chương trình chạy</div></div>
  <div class="lz-step"><div class="lz-k">+</div><div class="lz-t">Trình soạn thảo</div><div class="lz-d">nơi gõ code</div></div>
  <div class="lz-step"><div class="lz-k">=</div><div class="lz-t">Viết → dịch → chạy</div><div class="lz-d">vòng lặp lập trình</div></div>
</div>

<h3>Lựa chọn A — DevC++ (nhanh gọn cho người mới)</h3>
<p>DevC++ gói sẵn cả trình biên dịch lẫn trình soạn thảo trong một bộ cài — không phải cấu hình gì thêm.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tải &amp; cài</div><div class="lz-nsub">Tải "Embarcadero Dev-C++" (bản 6.3), chạy file cài, bấm Next tới hết.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tạo file .c</div><div class="lz-nsub">File → New → Source File, lưu với đuôi <code>.c</code> (không phải .cpp).</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Biên dịch &amp; chạy</div><div class="lz-nsub">Nhấn <kbd>F11</kbd> (Compile &amp; Run). Cửa sổ đen hiện kết quả.</div></div></div>
</div>
<pre><span class="tok-comment">// Gõ thử rồi nhấn F11</span>
<span class="tok-keyword">#include</span> &lt;stdio.h&gt;
<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-function">printf</span>(<span class="tok-string">"Moi truong da san sang!"</span>);
    <span class="tok-keyword">return</span> 0;
}</pre>
<div class="pitfall">Nếu cửa sổ kết quả hiện rồi <em>tắt ngay</em>, thêm <code>getchar();</code> trước <code>return 0;</code> để nó dừng chờ bạn xem. Và nhớ lưu file đuôi <code>.c</code> — để <code>.cpp</code> sẽ biên dịch theo C++, khác một số quy tắc.</div>

<h3>Lựa chọn B — VS Code + GCC (khuyên dùng lâu dài)</h3>
<p>VS Code là trình soạn thảo mạnh, dùng được cho mọi ngôn ngữ. Cần cài thêm GCC (qua MinGW-w64 trên Windows).</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Cài VS Code</div><div class="lz-nsub">Tải từ code.visualstudio.com, cài bình thường.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Cài GCC (MinGW-w64)</div><div class="lz-nsub">Windows: cài MSYS2 rồi <code>pacman -S mingw-w64-ucrt-x86_64-gcc</code>. macOS: <code>xcode-select --install</code>. Linux: <code>sudo apt install gcc</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Thêm GCC vào PATH</div><div class="lz-nsub">Windows: thêm <code>...\\ucrt64\\bin</code> vào biến môi trường Path. Kiểm tra: mở Terminal gõ <code>gcc --version</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Cài extension C/C++</div><div class="lz-nsub">Trong VS Code, cài extension "C/C++" của Microsoft.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Biên dịch &amp; chạy</div><div class="lz-nsub">Mở Terminal (<kbd>Ctrl</kbd>+<kbd>&#96;</kbd>), gõ lệnh bên dưới.</div></div></div>
</div>
<pre><span class="tok-comment"># Biên dịch file hello.c thành chương trình hello</span>
gcc hello.c -o hello
<span class="tok-comment"># Chạy (Windows)</span>
.\\hello
<span class="tok-comment"># Chạy (macOS/Linux)</span>
./hello</pre>
<div class="pitfall">Lỗi hay gặp: <code>gcc</code> không nhận diện được (<em>"'gcc' is not recognized"</em>) → GCC chưa vào PATH, làm lại bước 3 rồi <strong>mở lại</strong> VS Code/Terminal. PATH chỉ được đọc khi mở cửa sổ mới.</div>

<h3>Gỡ lỗi (debug) trong VS Code</h3>
<p>Đặt <strong>breakpoint</strong> (bấm vào lề trái số dòng → chấm đỏ), nhấn <kbd>F5</kbd> để chạy từng bước và xem giá trị biến. Kỹ năng này bạn sẽ dùng ở chương nâng cao N1.</p>

<div class="note-ct">Khuyên: người mới bắt đầu bằng <strong>DevC++</strong> cho nhanh, khi quen thì chuyển sang <strong>VS Code + GCC</strong> — công cụ bạn sẽ dùng suốt cả ngành. Cả hai đều dịch bằng GCC nên code C viết giống hệt nhau.</div>

<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-278" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Thực hành ngay không cần cài</span><span class="lc-sub">Module "C Fundamentals & Development Environment" trên Code Lab — chạy C thẳng trên trình duyệt trong lúc bạn cài máy.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — NHẬP MÔN ══════════════════ */
    {
      title: 'Chapter 1 — Getting started: program & computer|||Chương 1 — Nhập môn: chương trình & máy tính',
      description: 'Lập trình là gì, máy tính chạy chương trình ra sao, và cấu trúc một chương trình C.',
      lessons: [
        {
          title: '1.1 — What is programming? How a computer runs a program|||1.1 — Lập trình là gì? Máy tính chạy chương trình ra sao',
          slug: 'prf192-1-1-lap-trinh-la-gi',
          type: 'VIDEO',
          description: 'Từ bài toán thực tế đến chỉ thị máy hiểu được.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>What is programming?</h2>
<p class="lead"><strong>Programming</strong> is writing a clear, ordered sequence of instructions for a computer to carry out a task. A computer is very fast but "can't think" — it does <em>exactly</em> what you tell it, even when you tell it something wrong.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Step 1</div><div class="lz-t">Real problem</div><div class="lz-d">"Compute the average of 3 subjects"</div></div>
  <div class="lz-step"><div class="lz-k">Step 2</div><div class="lz-t">Algorithm</div><div class="lz-d">Add the 3 numbers, divide by 3</div></div>
  <div class="lz-step"><div class="lz-k">Step 3</div><div class="lz-t">C program</div><div class="lz-d">tb = (a+b+c)/3;</div></div>
  <div class="lz-step"><div class="lz-k">Step 4</div><div class="lz-t">Machine runs → result</div><div class="lz-d">Prints to the screen</div></div>
</div>
<h3>How does a computer run a program?</h3>
<p>A CPU only understands <strong>machine code</strong> (0s/1s). We write in C because it's readable, then a <strong>compiler</strong> translates the C code into machine code:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Write</div><div class="lz-t">Source <code>.c</code></div><div class="lz-d">You type C</div></div>
  <div class="lz-step"><div class="lz-k">Compile</div><div class="lz-t">Machine code <code>.exe</code></div><div class="lz-d">Compiler turns it into 0/1</div></div>
  <div class="lz-step"><div class="lz-k">Run</div><div class="lz-t">Result</div><div class="lz-d">The CPU executes it</div></div>
</div>
<h3>Your first C program</h3>
<pre><span class="tok-comment">// A program that prints one line of text</span>
<span class="tok-keyword">#include</span> &lt;stdio.h&gt;

<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-function">printf</span>(<span class="tok-string">"Xin chao PRF192!"</span>);
    <span class="tok-keyword">return</span> 0;
}</pre>
<div class="out"><b>Output:</b> Xin chao PRF192!</div>
<div class="pitfall">Beginners often forget the <code>;</code> at the end of a statement, or write <code>Printf</code> (capital P). C is case-sensitive and requires <code>;</code> — missing it is an immediate compile error.</div>
<div class="note-ct">Don't rush to fully understand <code>#include</code> or <code>return 0</code> — lesson 1.3 dissects them. For now just: type it correctly, compile, see the text appear. That feeling of "the machine obeys me" is your first motivation.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-278" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Try it now: print your own line</span><span class="lc-sub">The C version of "Hello, World" — type &amp; run on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Lập trình là gì?</h2>
<p class="lead"><strong>Lập trình</strong> là viết ra một dãy chỉ thị rõ ràng, tuần tự để máy tính thực hiện một công việc. Máy tính rất nhanh nhưng "không biết suy nghĩ" — nó làm <em>đúng y</em> những gì bạn bảo, kể cả khi bạn bảo sai.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Bước 1</div><div class="lz-t">Bài toán thực tế</div><div class="lz-d">"Tính điểm trung bình 3 môn"</div></div>
  <div class="lz-step"><div class="lz-k">Bước 2</div><div class="lz-t">Thuật toán</div><div class="lz-d">Cộng 3 số rồi chia cho 3</div></div>
  <div class="lz-step"><div class="lz-k">Bước 3</div><div class="lz-t">Chương trình C</div><div class="lz-d">tb = (a+b+c)/3;</div></div>
  <div class="lz-step"><div class="lz-k">Bước 4</div><div class="lz-t">Máy chạy → kết quả</div><div class="lz-d">In ra màn hình</div></div>
</div>

<h3>Máy tính chạy chương trình thế nào?</h3>
<p>CPU chỉ hiểu <strong>mã máy</strong> (số 0/1). Ta viết bằng C cho dễ đọc, rồi <strong>trình biên dịch (compiler)</strong> dịch mã C thành mã máy:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Viết</div><div class="lz-t">Mã nguồn <code>.c</code></div><div class="lz-d">Bạn gõ bằng C</div></div>
  <div class="lz-step"><div class="lz-k">Biên dịch</div><div class="lz-t">Mã máy <code>.exe</code></div><div class="lz-d">Compiler dịch sang 0/1</div></div>
  <div class="lz-step"><div class="lz-k">Chạy</div><div class="lz-t">Kết quả</div><div class="lz-d">CPU thực thi</div></div>
</div>

<h3>Chương trình C đầu tiên</h3>
<pre><span class="tok-comment">// Chương trình in ra một dòng chữ</span>
<span class="tok-keyword">#include</span> &lt;stdio.h&gt;

<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-function">printf</span>(<span class="tok-string">"Xin chao PRF192!"</span>);
    <span class="tok-keyword">return</span> 0;
}</pre>
<div class="out"><b>Output:</b> Xin chao PRF192!</div>

<div class="pitfall">Người mới hay quên dấu <code>;</code> cuối câu lệnh, hoặc viết <code>Printf</code> (P hoa). C phân biệt hoa–thường và bắt buộc <code>;</code> — thiếu là báo lỗi biên dịch ngay.</div>

<div class="note-ct">Đừng vội hiểu hết dòng <code>#include</code> hay <code>return 0</code> — bài 1.3 sẽ mổ xẻ. Bây giờ chỉ cần: gõ đúng, biên dịch, thấy chữ hiện ra. Cảm giác "máy làm theo lời mình" chính là động lực đầu tiên.</div>

<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-278" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Thử ngay: in dòng chữ của bạn</span><span class="lc-sub">Bài "Hello, World" phiên bản C — gõ & chạy trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — Software development steps · compiled vs interpreted|||1.2 — Các bước phát triển phần mềm · biên dịch vs thông dịch',
          slug: 'prf192-1-2-phat-trien-phan-mem',
          type: 'VIDEO',
          description: 'Quy trình từ ý tưởng đến chương trình chạy được.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>The steps of developing a program</h2>
<p class="lead">Professional programmers don't "just type". They follow a process that reduces bugs and makes fixes easy.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">01</div><div class="lz-t">Analyze</div><div class="lz-d">Understand the problem, the input/output</div></div>
  <div class="lz-step"><div class="lz-k">02</div><div class="lz-t">Design</div><div class="lz-d">Think of the algorithm, the steps</div></div>
  <div class="lz-step"><div class="lz-k">03</div><div class="lz-t">Code</div><div class="lz-d">Write C code</div></div>
  <div class="lz-step"><div class="lz-k">04</div><div class="lz-t">Compile</div><div class="lz-d">Fix syntax errors</div></div>
  <div class="lz-step"><div class="lz-k">05</div><div class="lz-t">Test</div><div class="lz-d">Run it, fix logic errors</div></div>
</div>
<h3>Compiled vs interpreted</h3>
<table>
  <thead><tr><th></th><th>Compiled — C</th><th>Interpreted — Python</th></tr></thead>
  <tbody>
    <tr><td>How it runs</td><td>Translates everything to an .exe first, then runs</td><td>Reads &amp; runs line by line at execution</td></tr>
    <tr><td>Speed</td><td>Fast</td><td>Slower</td></tr>
    <tr><td>Errors</td><td>Catches syntax errors at compile time</td><td>Only reports when it reaches the faulty line</td></tr>
  </tbody>
</table>
<div class="callout">C is a <strong>compiled</strong> language. So every time you change the code you must recompile (Compile/Build) before running — with practice you'll use the <kbd>F9</kbd>/<kbd>F11</kbd> shortcuts in DevC++.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Các bước phát triển một chương trình</h2>
<p class="lead">Lập trình viên chuyên nghiệp không "gõ đại". Họ đi theo một quy trình, giúp giảm lỗi và dễ sửa.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">01</div><div class="lz-t">Phân tích</div><div class="lz-d">Hiểu đề, dữ liệu vào/ra</div></div>
  <div class="lz-step"><div class="lz-k">02</div><div class="lz-t">Thiết kế</div><div class="lz-d">Nghĩ thuật toán, các bước</div></div>
  <div class="lz-step"><div class="lz-k">03</div><div class="lz-t">Viết mã</div><div class="lz-d">Gõ code C</div></div>
  <div class="lz-step"><div class="lz-k">04</div><div class="lz-t">Biên dịch</div><div class="lz-d">Sửa lỗi cú pháp</div></div>
  <div class="lz-step"><div class="lz-k">05</div><div class="lz-t">Kiểm thử</div><div class="lz-d">Chạy thử, sửa lỗi logic</div></div>
</div>
<h3>Biên dịch (compile) vs Thông dịch (interpret)</h3>
<table>
  <thead><tr><th></th><th>Biên dịch — C</th><th>Thông dịch — Python</th></tr></thead>
  <tbody>
    <tr><td>Cách chạy</td><td>Dịch toàn bộ ra file .exe trước, rồi chạy</td><td>Đọc &amp; chạy từng dòng khi thực thi</td></tr>
    <tr><td>Tốc độ</td><td>Nhanh</td><td>Chậm hơn</td></tr>
    <tr><td>Báo lỗi</td><td>Bắt lỗi cú pháp ngay lúc dịch</td><td>Chỉ báo khi chạy tới dòng lỗi</td></tr>
  </tbody>
</table>
<div class="callout">C là ngôn ngữ <strong>biên dịch</strong>. Vì vậy mỗi lần sửa code, bạn phải biên dịch lại (Compile/Build) rồi mới chạy — quen tay dần sẽ dùng phím tắt <kbd>F9</kbd>/<kbd>F11</kbd> trong DevC++.</div>
</div>
`,
        },
        {
          title: '1.3 — The structure of a C program|||1.3 — Cấu trúc một chương trình C',
          slug: 'prf192-1-3-cau-truc-chuong-trinh-c',
          type: 'VIDEO',
          description: 'Mổ xẻ từng phần: #include, main, câu lệnh, chú thích.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>The structure of a C program</h2>
<p class="lead">Now let's dissect the program from lesson 1.1 and understand the role of each part.</p>
<pre><span class="tok-comment">// (1) Preprocessor directive — load a library</span>
<span class="tok-keyword">#include</span> &lt;stdio.h&gt;

<span class="tok-comment">// (2) The main function — where the program starts</span>
<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-comment">// (3) Function body — statements, each ends with ;</span>
    <span class="tok-function">printf</span>(<span class="tok-string">"Diem = %d"</span>, 8);
    <span class="tok-keyword">return</span> 0;   <span class="tok-comment">// (4) return 0 = finished with no error</span>
}</pre>
<h3>Four parts</h3>
<ul>
  <li><strong>(1) <code>#include &lt;stdio.h&gt;</code></strong> — loads the standard I/O library so you can use <code>printf</code>, <code>scanf</code>.</li>
  <li><strong>(2) <code>int main()</code></strong> — every C program starts running here. There is exactly one <code>main</code>.</li>
  <li><strong>(3) Function body</strong> — inside <code>{ }</code>, statements run top to bottom in order.</li>
  <li><strong>(4) <code>return 0;</code></strong> — tells the OS the program ended normally.</li>
</ul>
<div class="pitfall">Missing one of <code>{</code> or <code>}</code>, or forgetting <code>#include &lt;stdio.h&gt;</code> when using <code>printf</code> — both are compile errors. Read the compiler's first error line carefully; it only points near the mistake.</div>
<div class="note-ct">Formatting convention: indent each <code>{ }</code> level by 4 spaces. Nicely indented code doesn't run faster, but the grader (and you a week later) reads it far more easily — this is the "presentation" score in the Workshops.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Cấu trúc một chương trình C</h2>
<p class="lead">Giờ ta mổ xẻ chương trình ở bài 1.1, hiểu vai trò từng phần.</p>
<pre><span class="tok-comment">// (1) Chỉ thị tiền xử lý — nạp thư viện</span>
<span class="tok-keyword">#include</span> &lt;stdio.h&gt;

<span class="tok-comment">// (2) Hàm main — nơi chương trình bắt đầu chạy</span>
<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-comment">// (3) Thân hàm — các câu lệnh, mỗi câu kết thúc bằng ;</span>
    <span class="tok-function">printf</span>(<span class="tok-string">"Diem = %d"</span>, 8);
    <span class="tok-keyword">return</span> 0;   <span class="tok-comment">// (4) trả 0 = chạy xong không lỗi</span>
}</pre>
<h3>Bốn thành phần</h3>
<ul>
  <li><strong>(1) <code>#include &lt;stdio.h&gt;</code></strong> — nạp thư viện nhập/xuất chuẩn để dùng được <code>printf</code>, <code>scanf</code>.</li>
  <li><strong>(2) <code>int main()</code></strong> — mọi chương trình C bắt đầu chạy từ đây. Có đúng một <code>main</code>.</li>
  <li><strong>(3) Thân hàm</strong> — nằm trong <code>{ }</code>, gồm các câu lệnh chạy tuần tự từ trên xuống.</li>
  <li><strong>(4) <code>return 0;</code></strong> — báo cho hệ điều hành: chương trình kết thúc bình thường.</li>
</ul>
<div class="pitfall">Thiếu một trong hai dấu <code>{</code> hoặc <code>}</code>, hoặc quên <code>#include &lt;stdio.h&gt;</code> khi dùng <code>printf</code> — đều là lỗi biên dịch. Đọc kỹ dòng lỗi đầu tiên compiler báo, nó chỉ gần đúng chỗ sai.</div>
<div class="note-ct">Quy ước trình bày: thụt lề mỗi cấp <code>{ }</code> bằng 4 dấu cách. Code thụt lề đẹp không chạy nhanh hơn, nhưng người chấm (và chính bạn 1 tuần sau) đọc dễ hơn nhiều — đây là điểm "trình bày" trong Workshop.</div>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'prf192-1-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh kiến thức chương 1.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Where does a C program start running?|||Chương trình C bắt đầu chạy từ đâu?', options: ['The first #include line|||Dòng #include đầu tiên', 'The main() function|||Hàm main()', 'The return 0 line|||Dòng return 0', "The file's first line|||Dòng đầu tiên của file"], correctIndex: 1, points: 1 },
              { question: 'What kind of language is C?|||C là ngôn ngữ loại nào?', options: ['Interpreted|||Thông dịch (interpret)', 'Compiled|||Biên dịch (compile)', 'Needs no translation|||Không cần dịch', 'Runs only on the web|||Chỉ chạy trên web'], correctIndex: 1, points: 1 },
              { question: 'What is #include <stdio.h> for?|||#include <stdio.h> dùng để làm gì?', options: ['Starts the program|||Bắt đầu chương trình', 'Loads the standard I/O library|||Nạp thư viện nhập/xuất chuẩn', 'Ends the program|||Kết thúc chương trình', 'Declares a variable|||Khai báo biến'], correctIndex: 1, points: 1 },
              { question: 'Which character ends each C statement?|||Mỗi câu lệnh trong C kết thúc bằng ký tự nào?', options: ['Comma ,|||Dấu phẩy ,', 'Period .|||Dấu chấm .', 'Semicolon ;|||Dấu chấm phẩy ;', 'Newline|||Xuống dòng'], correctIndex: 2, points: 1 },
              { question: 'What does return 0; in main() mean?|||return 0; trong main() có ý nghĩa gì?', options: ['Returns 0 points|||Trả về 0 điểm', 'Signals the program finished without error|||Báo chương trình kết thúc không lỗi', 'Clears memory|||Xoá bộ nhớ', 'Repeats the program|||Lặp lại chương trình'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — BIẾN & KIỂU DỮ LIỆU ══════════════════ */
    {
      title: 'Chapter 2 — Variables, data types & I/O|||Chương 2 — Biến, kiểu dữ liệu & nhập/xuất',
      description: 'Cách chương trình lưu và nhận dữ liệu: biến, hằng, kiểu, bộ nhớ, scanf/printf.',
      lessons: [
        {
          title: '2.1 — Variables & constants|||2.1 — Biến & hằng số',
          slug: 'prf192-2-1-bien-hang',
          type: 'VIDEO',
          description: 'Ô nhớ có tên để chứa dữ liệu và cách đặt tên đúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Variables &amp; constants</h2>
<p class="lead">A <strong>variable</strong> is a named memory cell that holds data the program can read and change. Picture memory as a row of cabinets with drawers; declaring a variable is "renting" a drawer and sticking a name label on it.</p>
<p style="font-size:.8rem;color:var(--text-muted);margin-bottom:.3rem">Memory (RAM) — each variable is a named cell holding a value:</p>
<table>
  <thead><tr><th>Variable →</th><th><code>age</code></th><th><code>score</code></th><th><code>grade</code></th></tr></thead>
  <tbody><tr><td>Stored value</td><td>20</td><td>8.5</td><td>'A'</td></tr></tbody>
</table>
<pre><span class="tok-type">int</span> age = 20;        <span class="tok-comment">// declare an integer variable, assign 20</span>
<span class="tok-type">float</span> score = 8.5;    <span class="tok-comment">// a real number</span>
<span class="tok-type">char</span> grade = <span class="tok-string">'A'</span>;     <span class="tok-comment">// one character — use single quotes</span>
age = age + 1;         <span class="tok-comment">// a variable's value can change</span></pre>
<h3>Constants</h3>
<p>A constant is a value that <strong>never changes</strong> throughout the program. Use <code>const</code> or <code>#define</code>:</p>
<pre><span class="tok-keyword">const</span> <span class="tok-type">float</span> PI = 3.14159;
<span class="tok-keyword">#define</span> MAX 100</pre>
<h3>Naming rules</h3>
<ul>
  <li>Only letters, digits and <code>_</code>; <strong>must not</strong> start with a digit.</li>
  <li>Case-sensitive: <code>age</code> ≠ <code>Age</code>.</li>
  <li>Don't clash with keywords (<code>int</code>, <code>return</code>…). Prefer meaningful names: <code>studentCount</code> beats <code>x</code>.</li>
</ul>
<div class="pitfall">Using a variable <em>before assigning it</em> → it holds "garbage" (a random value), causing hard-to-predict wrong results. Always initialise on declaration: <code>int sum = 0;</code>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Biến &amp; hằng số</h2>
<p class="lead"><strong>Biến (variable)</strong> là một ô nhớ có tên, dùng để chứa dữ liệu mà chương trình có thể đọc và thay đổi. Hình dung bộ nhớ như một dãy tủ có ngăn; khai báo biến là "thuê" một ngăn và dán nhãn tên lên đó.</p>
<p style="font-size:.8rem;color:var(--text-muted);margin-bottom:.3rem">Bộ nhớ (RAM) — mỗi biến là một ô có tên, chứa một giá trị:</p>
<table>
  <thead><tr><th>Tên biến →</th><th><code>age</code></th><th><code>score</code></th><th><code>grade</code></th></tr></thead>
  <tbody><tr><td>Giá trị đang chứa</td><td>20</td><td>8.5</td><td>'A'</td></tr></tbody>
</table>
<pre><span class="tok-type">int</span> age = 20;        <span class="tok-comment">// khai báo biến số nguyên, gán 20</span>
<span class="tok-type">float</span> score = 8.5;    <span class="tok-comment">// số thực</span>
<span class="tok-type">char</span> grade = <span class="tok-string">'A'</span>;     <span class="tok-comment">// một ký tự — dùng nháy đơn</span>
age = age + 1;         <span class="tok-comment">// giá trị biến có thể thay đổi</span></pre>
<h3>Hằng số (constant)</h3>
<p>Hằng là giá trị <strong>không đổi</strong> suốt chương trình. Dùng <code>const</code> hoặc <code>#define</code>:</p>
<pre><span class="tok-keyword">const</span> <span class="tok-type">float</span> PI = 3.14159;
<span class="tok-keyword">#define</span> MAX 100</pre>
<h3>Quy tắc đặt tên</h3>
<ul>
  <li>Chỉ gồm chữ, số, dấu <code>_</code>; <strong>không</strong> bắt đầu bằng số.</li>
  <li>Phân biệt hoa–thường: <code>age</code> ≠ <code>Age</code>.</li>
  <li>Không trùng từ khoá (<code>int</code>, <code>return</code>…). Nên đặt tên có nghĩa: <code>studentCount</code> tốt hơn <code>x</code>.</li>
</ul>
<div class="pitfall">Dùng biến khi <em>chưa gán giá trị</em> → biến chứa "rác" (giá trị ngẫu nhiên), gây kết quả sai khó đoán. Luôn khởi tạo biến khi khai báo: <code>int sum = 0;</code>.</div>
</div>
`,
        },
        {
          title: '2.2 — Data types & how memory stores them|||2.2 — Kiểu dữ liệu & cách bộ nhớ lưu trữ',
          slug: 'prf192-2-2-kieu-du-lieu',
          type: 'VIDEO',
          description: 'int, float, double, char — kích thước và phạm vi giá trị.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Data types</h2>
<p class="lead">Each variable has a <strong>type</strong> that decides: what kind of data it holds, how many bytes it takes, and its value range. Pick the wrong type → overflow or lost precision.</p>
<table>
  <thead><tr><th>Type</th><th>Used for</th><th>Size (typical)</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>int</code></td><td>Integer</td><td>4 bytes</td><td>-2 billion … 2 billion</td></tr>
    <tr><td><code>float</code></td><td>Real number</td><td>4 bytes</td><td>3.14</td></tr>
    <tr><td><code>double</code></td><td>Real number (more precise)</td><td>8 bytes</td><td>3.14159265</td></tr>
    <tr><td><code>char</code></td><td>One character</td><td>1 byte</td><td>'A', '9', '#'</td></tr>
  </tbody>
</table>
<div class="note-ct"><code>char</code> is really a <strong>small integer</strong>: <code>'A'</code> is stored as the number 65 (ASCII). So <code>'A' + 1</code> gives 'B'. Understanding this makes string handling in chapter 9 much easier.</div>
<h3>Implicit casting — the integer-division trap</h3>
<pre><span class="tok-type">int</span> a = 7, b = 2;
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, a / b);        <span class="tok-comment">// 3  — integer division, the fraction is lost!</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%f\\n"</span>, (<span class="tok-type">float</span>)a / b); <span class="tok-comment">// 3.5 — cast to float before dividing</span></pre>
<div class="out"><b>Output:</b> 3<br>3.500000</div>
<div class="pitfall">Dividing two <code>int</code>s always gives an <code>int</code> (drops the decimals). For a real result, cast at least one operand to <code>float</code>/<code>double</code>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Kiểu dữ liệu</h2>
<p class="lead">Mỗi biến có một <strong>kiểu</strong> quyết định: nó chứa loại dữ liệu gì, chiếm bao nhiêu byte, và phạm vi giá trị. Chọn sai kiểu → tràn số hoặc mất độ chính xác.</p>
<table>
  <thead><tr><th>Kiểu</th><th>Dùng cho</th><th>Kích thước (thường)</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><code>int</code></td><td>Số nguyên</td><td>4 byte</td><td>-2 tỉ … 2 tỉ</td></tr>
    <tr><td><code>float</code></td><td>Số thực</td><td>4 byte</td><td>3.14</td></tr>
    <tr><td><code>double</code></td><td>Số thực (chính xác hơn)</td><td>8 byte</td><td>3.14159265</td></tr>
    <tr><td><code>char</code></td><td>Một ký tự</td><td>1 byte</td><td>'A', '9', '#'</td></tr>
  </tbody>
</table>
<div class="note-ct"><code>char</code> thực chất là <strong>số nguyên nhỏ</strong>: <code>'A'</code> lưu trong máy là số 65 (mã ASCII). Vì vậy <code>'A' + 1</code> cho ra 'B'. Hiểu điều này giúp bạn xử lý chuỗi ở chương 9 dễ hơn.</div>
<h3>Ép kiểu ngầm — bẫy chia số nguyên</h3>
<pre><span class="tok-type">int</span> a = 7, b = 2;
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, a / b);        <span class="tok-comment">// 3  — chia nguyên, mất phần lẻ!</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%f\\n"</span>, (<span class="tok-type">float</span>)a / b); <span class="tok-comment">// 3.5 — ép float trước khi chia</span></pre>
<div class="out"><b>Output:</b> 3<br>3.500000</div>
<div class="pitfall">Chia hai số <code>int</code> luôn cho kết quả <code>int</code> (bỏ phần thập phân). Muốn kết quả thực, ép ít nhất một toán hạng sang <code>float</code>/<code>double</code>.</div>
</div>
`,
        },
        {
          title: '2.3 — Input/output with scanf & printf|||2.3 — Nhập/xuất với scanf & printf',
          slug: 'prf192-2-3-scanf-printf',
          type: 'VIDEO',
          description: 'Giao tiếp với người dùng qua bàn phím và màn hình.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Input/output: <code>scanf</code> &amp; <code>printf</code></h2>
<p class="lead">A useful program must take input and return output. <code>printf</code> prints to the screen, <code>scanf</code> reads from the keyboard. Both use a <strong>format string</strong> with "placeholders".</p>
<table>
  <thead><tr><th>Placeholder</th><th>Type</th></tr></thead>
  <tbody>
    <tr><td><code>%d</code></td><td>int</td></tr>
    <tr><td><code>%f</code></td><td>float / double (when printing)</td></tr>
    <tr><td><code>%c</code></td><td>char</td></tr>
    <tr><td><code>%s</code></td><td>string</td></tr>
  </tbody>
</table>
<pre><span class="tok-type">int</span> tuoi;
<span class="tok-function">printf</span>(<span class="tok-string">"Nhap tuoi: "</span>);
<span class="tok-function">scanf</span>(<span class="tok-string">"%d"</span>, &amp;tuoi);        <span class="tok-comment">// NOTE the &amp; before the variable name</span>
<span class="tok-function">printf</span>(<span class="tok-string">"Nam sau ban %d tuoi"</span>, tuoi + 1);</pre>
<div class="pitfall">Forgetting the <code>&amp;</code> in <code>scanf("%d", &amp;tuoi)</code> is the most classic beginner mistake — the program runs but reads input wrong / crashes. <code>&amp;</code> means "address of the variable" — you'll fully understand it in chapter 6 (pointers). <code>printf</code>, however, does <strong>not</strong> need <code>&amp;</code>.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-279" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: an input &amp; compute program</span><span class="lc-sub">Read 2 numbers then print sum/difference/product — auto-graded on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Nhập/xuất: <code>scanf</code> &amp; <code>printf</code></h2>
<p class="lead">Chương trình có ích phải nhận dữ liệu vào và trả kết quả ra. <code>printf</code> in ra màn hình, <code>scanf</code> đọc từ bàn phím. Cả hai dùng <strong>chuỗi định dạng</strong> với các "placeholder".</p>
<table>
  <thead><tr><th>Placeholder</th><th>Kiểu</th></tr></thead>
  <tbody>
    <tr><td><code>%d</code></td><td>int</td></tr>
    <tr><td><code>%f</code></td><td>float / double (khi in)</td></tr>
    <tr><td><code>%c</code></td><td>char</td></tr>
    <tr><td><code>%s</code></td><td>chuỗi</td></tr>
  </tbody>
</table>
<pre><span class="tok-type">int</span> tuoi;
<span class="tok-function">printf</span>(<span class="tok-string">"Nhap tuoi: "</span>);
<span class="tok-function">scanf</span>(<span class="tok-string">"%d"</span>, &amp;tuoi);        <span class="tok-comment">// LƯU Ý dấu &amp; trước tên biến</span>
<span class="tok-function">printf</span>(<span class="tok-string">"Nam sau ban %d tuoi"</span>, tuoi + 1);</pre>
<div class="pitfall">Quên dấu <code>&amp;</code> trong <code>scanf("%d", &amp;tuoi)</code> là lỗi kinh điển nhất của người mới — chương trình chạy nhưng nhập liệu sai/crash. <code>&amp;</code> nghĩa là "địa chỉ của biến" — bạn sẽ hiểu rõ ở chương 6 (con trỏ). Còn <code>printf</code> thì <strong>không</strong> cần <code>&amp;</code>.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-279" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện: chương trình nhập & tính toán</span><span class="lc-sub">Nhập 2 số rồi in tổng/hiệu/tích — bài chấm tự động ở CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'prf192-2-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh biến, kiểu dữ liệu, nhập/xuất.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Which declaration is CORRECT for a real number?|||Khai báo nào ĐÚNG cho một số thực?', options: ['int x = 3.5;', 'float x = 3.5;', 'char x = 3.5;', 'x = 3.5;'], correctIndex: 1, points: 1 },
              { question: 'In C, 7 / 2 (both int) gives?|||Trong C, 7 / 2 (cả hai là int) cho kết quả?', options: ['3.5', '3', '4', 'Error|||Lỗi'], correctIndex: 1, points: 1 },
              { question: "Giá trị 'A' được lưu trong máy dưới dạng?", options: ['The letter A|||Chữ cái A', 'The integer 65 (ASCII)|||Số nguyên 65 (ASCII)', 'The string \"A\"|||Chuỗi \"A\"', 'true'], correctIndex: 1, points: 1 },
              { question: 'Syntax to read an integer into variable n?|||Cú pháp đọc một số nguyên vào biến n?', options: ['scanf("%d", n);', 'scanf("%d", &n);', 'printf("%d", &n);', 'scanf(n);'], correctIndex: 1, points: 1 },
              { question: 'Which placeholder is for a character?|||Placeholder nào dùng cho một ký tự?', options: ['%d', '%f', '%c', '%s'], correctIndex: 2, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — BIỂU THỨC & TOÁN TỬ ══════════════════ */
    {
      title: 'Chapter 3 — Expressions & operators|||Chương 3 — Biểu thức & toán tử',
      description: 'Toán tử số học/quan hệ/logic/bit, ép kiểu và thứ tự ưu tiên.',
      lessons: [
        {
          title: '3.1 — Operator groups|||3.1 — Các nhóm toán tử',
          slug: 'prf192-3-1-toan-tu',
          type: 'VIDEO',
          description: 'Số học, quan hệ, logic, bit, và gán rút gọn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Operator groups</h2>
<p class="lead">An operator is a symbol that tells the machine to perform a computation. C has several groups — knowing what each group does is enough to write any expression.</p>
<table>
  <thead><tr><th>Group</th><th>Operators</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Arithmetic</td><td><code>+ - * / %</code></td><td>number (<code>%</code> = remainder)</td></tr>
    <tr><td>Relational</td><td><code>== != &lt; &gt; &lt;= &gt;=</code></td><td>true(1)/false(0)</td></tr>
    <tr><td>Logical</td><td><code>&amp;&amp; || !</code></td><td>true/false</td></tr>
    <tr><td>Compound assign</td><td><code>+= -= *= /=</code></td><td>assign</td></tr>
    <tr><td>Increment/decrement</td><td><code>++ --</code></td><td>+1 / -1</td></tr>
  </tbody>
</table>
<pre><span class="tok-type">int</span> a = 10, b = 3;
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, a % b);      <span class="tok-comment">// 1  (10 mod 3 = 1)</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, a &gt; b);      <span class="tok-comment">// 1  (true)</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, a &gt; b &amp;&amp; b &gt; 5); <span class="tok-comment">// 0  (b&gt;5 is false)</span>
a += 5;                    <span class="tok-comment">// a = a + 5 = 15</span></pre>
<div class="out"><b>Output:</b> 1<br>1<br>0</div>
<div class="note-ct">The <code>%</code> (remainder) operator is extremely useful: <code>n % 2 == 0</code> to test for even numbers, <code>n % 10</code> to get the last digit. You'll use it constantly in numeric problems.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Các nhóm toán tử</h2>
<p class="lead">Toán tử là ký hiệu bảo máy thực hiện một phép tính. C có nhiều nhóm — nắm được nhóm nào làm gì là đủ để viết mọi biểu thức.</p>
<table>
  <thead><tr><th>Nhóm</th><th>Toán tử</th><th>Kết quả</th></tr></thead>
  <tbody>
    <tr><td>Số học</td><td><code>+ - * / %</code></td><td>số (<code>%</code> = số dư)</td></tr>
    <tr><td>Quan hệ</td><td><code>== != &lt; &gt; &lt;= &gt;=</code></td><td>đúng(1)/sai(0)</td></tr>
    <tr><td>Logic</td><td><code>&amp;&amp; || !</code></td><td>đúng/sai</td></tr>
    <tr><td>Gán rút gọn</td><td><code>+= -= *= /=</code></td><td>gán</td></tr>
    <tr><td>Tăng/giảm</td><td><code>++ --</code></td><td>+1 / -1</td></tr>
  </tbody>
</table>
<pre><span class="tok-type">int</span> a = 10, b = 3;
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, a % b);      <span class="tok-comment">// 1  (10 chia 3 dư 1)</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, a &gt; b);      <span class="tok-comment">// 1  (đúng)</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, a &gt; b &amp;&amp; b &gt; 5); <span class="tok-comment">// 0  (b&gt;5 sai)</span>
a += 5;                    <span class="tok-comment">// a = a + 5 = 15</span></pre>
<div class="out"><b>Output:</b> 1<br>1<br>0</div>
<div class="note-ct">Toán tử <code>%</code> (chia lấy dư) cực kỳ hữu ích: <code>n % 2 == 0</code> để kiểm tra số chẵn, <code>n % 10</code> để lấy chữ số hàng đơn vị. Bạn sẽ dùng nó liên tục ở các bài toán số học.</div>
</div>
`,
        },
        {
          title: '3.2 — Type casting & precedence|||3.2 — Ép kiểu & thứ tự ưu tiên',
          slug: 'prf192-3-2-uu-tien',
          type: 'VIDEO',
          description: 'Biểu thức trộn kiểu và quy tắc tính trước/sau.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Type casting &amp; precedence</h2>
<p class="lead">When an expression mixes several types and operators, C has clear rules about evaluation order. Miss them and you get surprising results.</p>
<h3>Precedence (highest to lowest)</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">( )</span><span class="lz-lnote">parentheses — always first</span></div>
  <div class="lz-layer"><span class="lz-lname">! ++ --</span><span class="lz-lnote">unary operators</span></div>
  <div class="lz-layer"><span class="lz-lname">* / %</span><span class="lz-lnote">multiply / divide first</span></div>
  <div class="lz-layer"><span class="lz-lname">+ -</span><span class="lz-lnote">add / subtract next</span></div>
  <div class="lz-layer"><span class="lz-lname">&lt; &gt; &lt;= &gt;=</span><span class="lz-lnote">comparison</span></div>
  <div class="lz-layer"><span class="lz-lname">== !=</span><span class="lz-lnote">equal / not equal</span></div>
  <div class="lz-layer"><span class="lz-lname">&amp;&amp; · ||</span><span class="lz-lnote">and · or</span></div>
  <div class="lz-layer"><span class="lz-lname">= += -= …</span><span class="lz-lnote">assignment — last</span></div>
</div>
<pre><span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, 2 + 3 * 4);     <span class="tok-comment">// 14, NOT 20 (multiply first)</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, (2 + 3) * 4);   <span class="tok-comment">// 20 (parentheses change order)</span></pre>
<div class="callout">Practical tip: <strong>when in doubt, add parentheses</strong>. They don't slow the program and make your intent clear to you (and the grader). Don't force the reader to memorise the precedence table.</div>
<div class="pitfall">Assignment <code>=</code> and comparison <code>==</code> are completely different. Accidentally writing <code>if (x = 5)</code> (one =) <em>assigns</em> 5 to x and is always true — a logic bug the compiler usually won't flag. Always use <code>==</code> to compare.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Ép kiểu &amp; thứ tự ưu tiên</h2>
<p class="lead">Khi một biểu thức trộn nhiều kiểu và nhiều toán tử, C có quy tắc rõ ràng về thứ tự tính. Không nắm sẽ ra kết quả bất ngờ.</p>
<h3>Thứ tự ưu tiên (từ cao xuống thấp)</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">( )</span><span class="lz-lnote">ngoặc — luôn tính trước</span></div>
  <div class="lz-layer"><span class="lz-lname">! ++ --</span><span class="lz-lnote">toán tử đơn nguyên</span></div>
  <div class="lz-layer"><span class="lz-lname">* / %</span><span class="lz-lnote">nhân / chia trước</span></div>
  <div class="lz-layer"><span class="lz-lname">+ -</span><span class="lz-lnote">cộng / trừ sau</span></div>
  <div class="lz-layer"><span class="lz-lname">&lt; &gt; &lt;= &gt;=</span><span class="lz-lnote">so sánh</span></div>
  <div class="lz-layer"><span class="lz-lname">== !=</span><span class="lz-lnote">bằng / khác</span></div>
  <div class="lz-layer"><span class="lz-lname">&amp;&amp; · ||</span><span class="lz-lnote">và · hoặc</span></div>
  <div class="lz-layer"><span class="lz-lname">= += -= …</span><span class="lz-lnote">gán — cuối cùng</span></div>
</div>
<pre><span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, 2 + 3 * 4);     <span class="tok-comment">// 14, KHÔNG phải 20 (nhân trước)</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, (2 + 3) * 4);   <span class="tok-comment">// 20 (ngoặc đổi thứ tự)</span></pre>
<div class="callout">Mẹo thực dụng: <strong>khi nghi ngờ, thêm ngoặc</strong>. Ngoặc không làm chậm chương trình mà giúp bạn (và người chấm) đọc rõ ý định. Đừng bắt người đọc phải nhớ bảng ưu tiên.</div>
<div class="pitfall">Gán <code>=</code> và so sánh <code>==</code> khác nhau hoàn toàn. Viết nhầm <code>if (x = 5)</code> (một dấu =) sẽ <em>gán</em> 5 cho x và luôn đúng — lỗi logic mà compiler thường không báo. Luôn dùng <code>==</code> khi so sánh.</div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'prf192-3-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh toán tử & ưu tiên.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'What is the result of 2 + 3 * 4?|||Kết quả của 2 + 3 * 4 là?', options: ['20', '14', '24', '9'], correctIndex: 1, points: 1 },
              { question: 'The % operator (10 % 3) gives?|||Toán tử % (10 % 3) cho kết quả?', options: ['3', '1', '0', '3.33'], correctIndex: 1, points: 1 },
              { question: 'How to test if n is even?|||Cách kiểm tra số n là số chẵn?', options: ['n / 2 == 0', 'n % 2 == 0', 'n == 2', 'n % 2 == 1'], correctIndex: 1, points: 1 },
              { question: 'What does if (x = 5) do?|||if (x = 5) làm gì?', options: ['Compares x with 5|||So sánh x với 5', 'Assigns 5 to x, condition always true|||Gán 5 cho x, điều kiện luôn đúng', 'Compile error|||Báo lỗi biên dịch', 'Compares and assigns|||So sánh và gán'], correctIndex: 1, points: 1 },
              { question: 'The expression 1 && 0 || 1 gives?|||Biểu thức 1 && 0 || 1 cho kết quả?', options: ['0', '1', '2', 'Error|||Lỗi'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — CẤU TRÚC ĐIỀU KHIỂN ══════════════════ */
    {
      title: 'Chapter 4 — Control structures|||Chương 4 — Cấu trúc điều khiển',
      description: 'Rẽ nhánh (if/switch) và vòng lặp (for/while/do-while) — trái tim của mọi chương trình.',
      lessons: [
        {
          title: '4.1 — Branching: if / else / switch|||4.1 — Rẽ nhánh: if / else / switch',
          slug: 'prf192-4-1-re-nhanh',
          type: 'VIDEO',
          description: 'Cho chương trình ra quyết định.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Branching: <code>if</code> / <code>else</code> / <code>switch</code></h2>
<p class="lead">So far the program runs top to bottom. <strong>Branching</strong> lets it <em>decide</em>: if a condition is true do this, otherwise do that.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">if ( … )</div><div class="lz-t">Check a condition</div><div class="lz-d">e.g. diem &gt;= 5 ?</div></div>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">✔ True</span><span class="lz-lnote">run the block inside <code>if</code></span></div>
  <div class="lz-layer"><span class="lz-lname">✘ False</span><span class="lz-lnote">run the <code>else</code> block</span></div>
</div>
<pre><span class="tok-type">int</span> diem = 7;
<span class="tok-keyword">if</span> (diem &gt;= 5) {
    <span class="tok-function">printf</span>(<span class="tok-string">"Dau"</span>);
} <span class="tok-keyword">else</span> {
    <span class="tok-function">printf</span>(<span class="tok-string">"Truot"</span>);
}</pre>
<h3>Multiple branches: <code>else if</code></h3>
<pre><span class="tok-keyword">if</span> (diem &gt;= 8)      <span class="tok-function">printf</span>(<span class="tok-string">"Gioi"</span>);
<span class="tok-keyword">else if</span> (diem &gt;= 6.5) <span class="tok-function">printf</span>(<span class="tok-string">"Kha"</span>);
<span class="tok-keyword">else if</span> (diem &gt;= 5)   <span class="tok-function">printf</span>(<span class="tok-string">"Trung binh"</span>);
<span class="tok-keyword">else</span>                 <span class="tok-function">printf</span>(<span class="tok-string">"Yeu"</span>);</pre>
<h3><code>switch</code> — pick by a discrete value</h3>
<pre><span class="tok-keyword">switch</span> (chon) {
    <span class="tok-keyword">case</span> 1: <span class="tok-function">printf</span>(<span class="tok-string">"Mot"</span>); <span class="tok-keyword">break</span>;
    <span class="tok-keyword">case</span> 2: <span class="tok-function">printf</span>(<span class="tok-string">"Hai"</span>); <span class="tok-keyword">break</span>;
    <span class="tok-keyword">default</span>: <span class="tok-function">printf</span>(<span class="tok-string">"Khac"</span>);
}</pre>
<div class="pitfall">Forgetting <code>break;</code> in a <code>switch</code> → the program "falls through" to the following cases, running branches you didn't want. Unless intentional, always end each case with <code>break;</code>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Rẽ nhánh: <code>if</code> / <code>else</code> / <code>switch</code></h2>
<p class="lead">Đến giờ chương trình chạy tuần tự từ trên xuống. <strong>Rẽ nhánh</strong> cho phép nó <em>quyết định</em>: nếu điều kiện đúng thì làm việc này, ngược lại làm việc kia.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">if ( … )</div><div class="lz-t">Kiểm tra điều kiện</div><div class="lz-d">ví dụ: diem &gt;= 5 ?</div></div>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">✔ Đúng (true)</span><span class="lz-lnote">chạy khối lệnh trong <code>if</code></span></div>
  <div class="lz-layer"><span class="lz-lname">✘ Sai (false)</span><span class="lz-lnote">chạy khối <code>else</code></span></div>
</div>
<pre><span class="tok-type">int</span> diem = 7;
<span class="tok-keyword">if</span> (diem &gt;= 5) {
    <span class="tok-function">printf</span>(<span class="tok-string">"Dau"</span>);
} <span class="tok-keyword">else</span> {
    <span class="tok-function">printf</span>(<span class="tok-string">"Truot"</span>);
}</pre>
<h3>Nhiều nhánh: <code>else if</code></h3>
<pre><span class="tok-keyword">if</span> (diem &gt;= 8)      <span class="tok-function">printf</span>(<span class="tok-string">"Gioi"</span>);
<span class="tok-keyword">else if</span> (diem &gt;= 6.5) <span class="tok-function">printf</span>(<span class="tok-string">"Kha"</span>);
<span class="tok-keyword">else if</span> (diem &gt;= 5)   <span class="tok-function">printf</span>(<span class="tok-string">"Trung binh"</span>);
<span class="tok-keyword">else</span>                 <span class="tok-function">printf</span>(<span class="tok-string">"Yeu"</span>);</pre>
<h3><code>switch</code> — chọn theo giá trị rời rạc</h3>
<pre><span class="tok-keyword">switch</span> (chon) {
    <span class="tok-keyword">case</span> 1: <span class="tok-function">printf</span>(<span class="tok-string">"Mot"</span>); <span class="tok-keyword">break</span>;
    <span class="tok-keyword">case</span> 2: <span class="tok-function">printf</span>(<span class="tok-string">"Hai"</span>); <span class="tok-keyword">break</span>;
    <span class="tok-keyword">default</span>: <span class="tok-function">printf</span>(<span class="tok-string">"Khac"</span>);
}</pre>
<div class="pitfall">Quên <code>break;</code> trong <code>switch</code> → chương trình "rơi" (fall-through) xuống các case sau, chạy cả những nhánh không mong muốn. Trừ khi cố ý, luôn kết thúc mỗi case bằng <code>break;</code>.</div>
</div>
`,
        },
        {
          title: '4.2 — Loops: for / while / do-while|||4.2 — Vòng lặp: for / while / do-while',
          slug: 'prf192-4-2-vong-lap',
          type: 'VIDEO',
          description: 'Bảo máy làm lặp đi lặp lại — điểm mạnh nhất của máy tính.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Loops: <code>for</code>, <code>while</code>, <code>do-while</code></h2>
<p class="lead">A computer is best at <strong>repetition</strong>. Instead of writing 100 identical lines, you tell it "do this 100 times". C has three loop kinds, differing in <em>when the condition is checked</em>.</p>
<h3>1. <code>for</code> — when you know the count in advance</h3>
<pre><span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 1; i &lt;= 5; i++) {
    <span class="tok-function">printf</span>(<span class="tok-string">"%d "</span>, i);
}</pre>
<div class="out"><b>Output:</b> 1 2 3 4 5</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Init</div><div class="lz-t">i = 1</div><div class="lz-d">runs once at the start</div></div>
  <div class="lz-step"><div class="lz-k">Condition</div><div class="lz-t">i &lt;= 5 ?</div><div class="lz-d">checked before each pass</div></div>
  <div class="lz-step"><div class="lz-k">Body</div><div class="lz-t">printf(...)</div><div class="lz-d">the repeated work</div></div>
  <div class="lz-step"><div class="lz-k">Update</div><div class="lz-t">i++</div><div class="lz-d">then re-check</div></div>
</div>
<p style="font-size:.86rem;color:var(--text-muted);margin-top:-.4rem">When <code>i &lt;= 5</code> is false → exit the loop.</p>
<h3>2. <code>while</code> — loop until the condition is false</h3>
<pre><span class="tok-type">int</span> n = 8;
<span class="tok-keyword">while</span> (n &gt; 1) { <span class="tok-function">printf</span>(<span class="tok-string">"%d "</span>, n); n = n / 2; }</pre>
<div class="out"><b>Output:</b> 8 4 2</div>
<h3>3. <code>do-while</code> — runs the body at least once</h3>
<p>The condition is checked at the <em>end</em>, good for menus or re-prompting until valid.</p>
<h3><code>break</code> &amp; <code>continue</code></h3>
<ul><li><code>break</code> — exit the loop immediately.</li><li><code>continue</code> — skip the rest, go to the next pass.</li></ul>
<div class="pitfall">Forgetting to update the condition variable → an <strong>infinite loop</strong>. e.g. <code>while(n&gt;1){ printf("%d",n); }</code> missing <code>n=n/2</code> prints forever. Always ask: "which variable makes the condition become false?".</div>
<div class="note-ct">The counting <code>for</code> loop is the backbone of every array traversal (chapter 8) and every algorithm in CSD201. Master the 3 parts of <code>for</code> now and reading sort/search code later is easy.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-280" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: multiplication table / sum 1..n</span><span class="lc-sub">Loop exercises, auto-graded on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Vòng lặp: <code>for</code>, <code>while</code>, <code>do-while</code></h2>
<p class="lead">Máy tính giỏi nhất việc <strong>lặp đi lặp lại</strong>. Thay vì viết 100 dòng giống nhau, ta bảo máy "làm việc này 100 lần". C có ba loại vòng lặp, khác nhau ở <em>thời điểm kiểm tra điều kiện</em>.</p>
<h3>1. <code>for</code> — khi biết trước số lần</h3>
<pre><span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 1; i &lt;= 5; i++) {
    <span class="tok-function">printf</span>(<span class="tok-string">"%d "</span>, i);
}</pre>
<div class="out"><b>Output:</b> 1 2 3 4 5</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Khởi tạo</div><div class="lz-t">i = 1</div><div class="lz-d">chạy 1 lần lúc đầu</div></div>
  <div class="lz-step"><div class="lz-k">Điều kiện</div><div class="lz-t">i &lt;= 5 ?</div><div class="lz-d">kiểm tra trước mỗi vòng</div></div>
  <div class="lz-step"><div class="lz-k">Thân lặp</div><div class="lz-t">printf(...)</div><div class="lz-d">việc lặp lại</div></div>
  <div class="lz-step"><div class="lz-k">Cập nhật</div><div class="lz-t">i++</div><div class="lz-d">rồi quay lại kiểm tra</div></div>
</div>
<p style="font-size:.86rem;color:var(--text-muted);margin-top:-.4rem">Khi điều kiện <code>i &lt;= 5</code> sai → thoát vòng lặp.</p>
<h3>2. <code>while</code> — lặp tới khi điều kiện sai</h3>
<pre><span class="tok-type">int</span> n = 8;
<span class="tok-keyword">while</span> (n &gt; 1) { <span class="tok-function">printf</span>(<span class="tok-string">"%d "</span>, n); n = n / 2; }</pre>
<div class="out"><b>Output:</b> 8 4 2</div>
<h3>3. <code>do-while</code> — chạy thân ít nhất 1 lần</h3>
<p>Điều kiện kiểm tra ở <em>cuối</em>, hợp với menu hoặc nhập lại tới khi hợp lệ.</p>
<h3><code>break</code> &amp; <code>continue</code></h3>
<ul><li><code>break</code> — thoát ngay khỏi vòng lặp.</li><li><code>continue</code> — bỏ qua phần còn lại, sang vòng kế.</li></ul>
<div class="pitfall">Quên cập nhật biến điều kiện → <strong>vòng lặp vô hạn</strong>. Ví dụ <code>while(n&gt;1){ printf("%d",n); }</code> thiếu <code>n=n/2</code> sẽ in mãi. Luôn tự hỏi: "biến nào làm điều kiện tiến tới sai?".</div>
<div class="note-ct">Vòng <code>for</code> đếm là xương sống của mọi bài duyệt mảng (chương 8) và mọi thuật toán ở CSD201. Nắm chắc 3 phần của <code>for</code> bây giờ, sau này đọc code sắp xếp/tìm kiếm sẽ nhàn.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-280" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện: in bảng cửu chương / tính tổng 1..n</span><span class="lc-sub">Bài vòng lặp có chấm tự động ở CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Workshop 1 — Variables, expressions, control flow|||Workshop 1 — Biến, biểu thức, điều khiển',
          slug: 'prf192-4-workshop1',
          type: 'EXERCISE',
          description: 'Bài thực hành tổng hợp chương 1–4.',
          content: `
<div class="ml-en">
<span class="eyebrow">Workshop 1</span>
<h2>Workshop 1 — Calculator &amp; grade classifier</h2>
<p class="lead">Apply variables, I/O, expressions and branching/loops.</p>
<h3>Problem</h3>
<ul>
  <li><strong>Part A.</strong> Read 2 real numbers, print their sum, difference, product and quotient (handle divide-by-zero).</li>
  <li><strong>Part B.</strong> Read a score (0–10), print the grade: ≥8 Excellent, ≥6.5 Good, ≥5 Average, otherwise Weak.</li>
  <li><strong>Part C.</strong> Read a number n, print the even numbers from 1 to n and their sum.</li>
</ul>
<h3>Grading criteria</h3>
<table>
  <thead><tr><th>Criterion</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>Runs correctly on all cases</td><td>50%</td></tr>
    <tr><td>Handles edge data (divide by 0, score outside 0–10)</td><td>25%</td></tr>
    <tr><td>Clear variable names, nice indentation</td><td>25%</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-280" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Submit &amp; auto-grade</span><span class="lc-sub">Do it on CodeLab; the model solution opens after you submit.</span></span>
  <span class="lc-cta">START →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Workshop 1</span>
<h2>Workshop 1 — Máy tính bỏ túi &amp; phân loại điểm</h2>
<p class="lead">Vận dụng biến, nhập/xuất, biểu thức và rẽ nhánh/vòng lặp.</p>
<h3>Đề bài</h3>
<ul>
  <li><strong>Phần A.</strong> Nhập 2 số thực, in tổng, hiệu, tích, thương (xử lý chia 0).</li>
  <li><strong>Phần B.</strong> Nhập điểm (0–10), in xếp loại: ≥8 Giỏi, ≥6.5 Khá, ≥5 Trung bình, còn lại Yếu.</li>
  <li><strong>Phần C.</strong> Nhập số n, in các số chẵn từ 1 đến n và tổng của chúng.</li>
</ul>
<h3>Tiêu chí chấm</h3>
<table>
  <thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
  <tbody>
    <tr><td>Chạy đúng các trường hợp</td><td>50%</td></tr>
    <tr><td>Xử lý dữ liệu biên (chia 0, điểm ngoài 0–10)</td><td>25%</td></tr>
    <tr><td>Đặt tên biến rõ, thụt lề đẹp</td><td>25%</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-280" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Nộp & chấm tự động</span><span class="lc-sub">Làm trực tiếp trên CodeLab; lời giải mẫu mở sau khi nộp.</span></span>
  <span class="lc-cta">LÀM BÀI →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'prf192-4-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh rẽ nhánh & vòng lặp.',
          quiz: {
            timeLimitSeconds: 600,
            questions: [
              { question: 'for(int i=0; i<3; i++) printf("%d", i); prints?|||for(int i=0; i<3; i++) printf("%d", i); in ra gì?', options: ['1 2 3', '0 1 2', '0 1 2 3', 'Infinite loop|||Vòng lặp vô hạn'], correctIndex: 1, points: 1 },
              { question: 'Which loop ALWAYS runs its body at least once?|||Vòng lặp nào LUÔN chạy thân ít nhất một lần?', options: ['for', 'while', 'do-while', 'All three the same|||Cả ba như nhau'], correctIndex: 2, points: 1 },
              { question: 'Which keyword exits a loop IMMEDIATELY?|||Từ khoá nào thoát NGAY khỏi vòng lặp?', options: ['continue', 'break', 'return', 'exit'], correctIndex: 1, points: 1 },
              { question: 'Forgetting break in a switch causes?|||Quên break trong switch gây ra?', options: ['Compile error|||Lỗi biên dịch', 'Fall-through: runs the following cases|||Fall-through: chạy cả case sau', 'Infinite loop|||Vòng lặp vô hạn', 'Nothing|||Không sao'], correctIndex: 1, points: 1 },
              { question: 'Common cause of an infinite loop?|||Nguyên nhân thường gặp của vòng lặp vô hạn?', options: ['Using for|||Dùng for', 'Forgetting to update the condition variable|||Quên cập nhật biến điều kiện', 'Using break|||Dùng break', 'Condition too complex|||Điều kiện quá phức tạp'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — HÀM & MODULE ══════════════════ */
    {
      title: 'Chapter 5 — Functions & Modules|||Chương 5 — Hàm & Module',
      description: 'Chia bài toán lớn thành các hàm nhỏ, rõ ràng — kỹ năng cốt lõi của lập trình viên.',
      lessons: [
        {
          title: '5.1 — Modules & the decomposition mindset|||5.1 — Module & tư duy chia nhỏ',
          slug: 'prf192-5-1-module',
          type: 'VIDEO',
          description: 'Vì sao phải chia chương trình thành các phần nhỏ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Modules &amp; the decomposition mindset</h2>
<p class="lead">A big program crammed into <code>main</code> is messy and hard to fix. <strong>Modularisation</strong> means splitting the problem into small parts, each doing <em>one thing</em> — in C, each such part is a <strong>function</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Big problem</div><div class="lz-t">Manage student scores</div><div class="lz-d">hard if crammed together</div></div>
  <div class="lz-step"><div class="lz-k">Break down</div><div class="lz-t">Sub-tasks</div><div class="lz-d">input · average · find max</div></div>
  <div class="lz-step"><div class="lz-k">Each task = 1 function</div><div class="lz-t">nhapDiem() …</div><div class="lz-d">easy to write, fix, reuse</div></div>
</div>
<h3>Benefits of functions</h3>
<ul>
  <li><strong>Reuse:</strong> write once, call many places.</li>
  <li><strong>Readable:</strong> <code>main</code> becomes a few lines of function calls, like a table of contents.</li>
  <li><strong>Easy to fix &amp; test:</strong> wherever the bug is, fix that one function.</li>
</ul>
<div class="note-ct">This skill is weighted heavily in the Workshops and in later courses (PRO192, LAB211). Beginners tend to stuff everything into <code>main</code>; build the "one function — one job" habit right now.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Module &amp; tư duy chia nhỏ</h2>
<p class="lead">Một chương trình lớn viết dồn trong <code>main</code> sẽ rối và khó sửa. <strong>Module hoá</strong> là chia bài toán thành các phần nhỏ, mỗi phần làm <em>một việc</em> — trong C, mỗi phần đó là một <strong>hàm (function)</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Bài toán lớn</div><div class="lz-t">Quản lý điểm SV</div><div class="lz-d">khó nếu viết dồn</div></div>
  <div class="lz-step"><div class="lz-k">Chia nhỏ</div><div class="lz-t">Các việc con</div><div class="lz-d">nhập · tính TB · tìm max</div></div>
  <div class="lz-step"><div class="lz-k">Mỗi việc = 1 hàm</div><div class="lz-t">nhapDiem() …</div><div class="lz-d">dễ viết, dễ sửa, tái dùng</div></div>
</div>
<h3>Lợi ích của hàm</h3>
<ul>
  <li><strong>Tái sử dụng:</strong> viết một lần, gọi nhiều nơi.</li>
  <li><strong>Dễ đọc:</strong> <code>main</code> chỉ còn vài dòng gọi hàm, đọc như đọc mục lục.</li>
  <li><strong>Dễ sửa &amp; kiểm thử:</strong> lỗi ở đâu, sửa đúng hàm đó.</li>
</ul>
<div class="note-ct">Đây là kỹ năng được chấm điểm nặng ở Workshop và cả các môn sau (PRO192, LAB211). Người mới hay nhồi tất cả vào <code>main</code>; hãy tập thói quen "một hàm — một việc" ngay từ bây giờ.</div>
</div>
`,
        },
        {
          title: '5.2 — Defining & calling functions · parameters|||5.2 — Định nghĩa & gọi hàm · tham số',
          slug: 'prf192-5-2-ham',
          type: 'VIDEO',
          description: 'Cú pháp hàm, truyền tham số theo giá trị, giá trị trả về.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Defining &amp; calling functions</h2>
<p class="lead">A function has: a <strong>return type</strong>, a <strong>name</strong>, <strong>parameters</strong> (inputs) and a <strong>body</strong>.</p>
<pre><span class="tok-comment">// return type · name · parameters</span>
<span class="tok-type">int</span> <span class="tok-function">tong</span>(<span class="tok-type">int</span> a, <span class="tok-type">int</span> b) {
    <span class="tok-keyword">return</span> a + b;      <span class="tok-comment">// return the result to the caller</span>
}

<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-type">int</span> s = <span class="tok-function">tong</span>(3, 5);  <span class="tok-comment">// call the function, s = 8</span>
    <span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, s);
    <span class="tok-keyword">return</span> 0;
}</pre>
<div class="out"><b>Output:</b> 8</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Call</div><div class="lz-t">tong(3, 5)</div><div class="lz-d">pass arguments 3, 5</div></div>
  <div class="lz-step"><div class="lz-k">Execute</div><div class="lz-t">a=3, b=5 → a+b</div><div class="lz-d">run the body</div></div>
  <div class="lz-step"><div class="lz-k">Return</div><div class="lz-t">return 8</div><div class="lz-d">result back to caller</div></div>
</div>
<h3>Pass by value</h3>
<p>When you call a function, C <strong>copies</strong> the argument value into the parameter. Changing the parameter inside the function does <em>not</em> affect the original variable:</p>
<pre><span class="tok-type">void</span> <span class="tok-function">tang</span>(<span class="tok-type">int</span> x) { x = x + 1; }   <span class="tok-comment">// edits the copy</span>
<span class="tok-type">int</span> n = 5;
<span class="tok-function">tang</span>(n);
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, n);   <span class="tok-comment">// still 5 !</span></pre>
<div class="pitfall">This confuses many people: the function "changes" the variable but nothing changes outside. To let a function modify the original variable, use a <strong>pointer</strong> (chapter 6).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Định nghĩa &amp; gọi hàm</h2>
<p class="lead">Một hàm gồm: <strong>kiểu trả về</strong>, <strong>tên</strong>, <strong>tham số</strong> (đầu vào) và <strong>thân hàm</strong>.</p>
<pre><span class="tok-comment">// kiểu trả về · tên · tham số</span>
<span class="tok-type">int</span> <span class="tok-function">tong</span>(<span class="tok-type">int</span> a, <span class="tok-type">int</span> b) {
    <span class="tok-keyword">return</span> a + b;      <span class="tok-comment">// trả kết quả về nơi gọi</span>
}

<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-type">int</span> s = <span class="tok-function">tong</span>(3, 5);  <span class="tok-comment">// gọi hàm, s = 8</span>
    <span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, s);
    <span class="tok-keyword">return</span> 0;
}</pre>
<div class="out"><b>Output:</b> 8</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Gọi</div><div class="lz-t">tong(3, 5)</div><div class="lz-d">truyền đối số 3, 5</div></div>
  <div class="lz-step"><div class="lz-k">Thực thi</div><div class="lz-t">a=3, b=5 → a+b</div><div class="lz-d">chạy thân hàm</div></div>
  <div class="lz-step"><div class="lz-k">Trả về</div><div class="lz-t">return 8</div><div class="lz-d">kết quả về nơi gọi</div></div>
</div>
<h3>Truyền theo giá trị (pass by value)</h3>
<p>Khi gọi hàm, C <strong>sao chép</strong> giá trị đối số vào tham số. Sửa tham số bên trong hàm <em>không</em> ảnh hưởng biến gốc:</p>
<pre><span class="tok-type">void</span> <span class="tok-function">tang</span>(<span class="tok-type">int</span> x) { x = x + 1; }   <span class="tok-comment">// sửa bản sao</span>
<span class="tok-type">int</span> n = 5;
<span class="tok-function">tang</span>(n);
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, n);   <span class="tok-comment">// vẫn là 5 !</span></pre>
<div class="pitfall">Đây là lý do nhiều người bối rối: hàm "sửa" biến nhưng ra ngoài không đổi. Muốn hàm thay đổi được biến gốc, phải dùng <strong>con trỏ</strong> (chương 6).</div>
</div>
`,
        },
        {
          title: '5.3 — Variable scope · built-in vs user-defined functions|||5.3 — Phạm vi biến (scope) · hàm dựng sẵn vs tự định nghĩa',
          slug: 'prf192-5-3-scope',
          type: 'VIDEO',
          description: 'Biến sống ở đâu, và phân biệt hàm có sẵn với hàm tự viết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Variable scope</h2>
<p class="lead"><strong>Scope</strong> is the region of code where a variable "exists" and can be used. A variable declared inside a function only lives in that function (a <em>local</em> variable).</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Local variable</span><span class="lz-lnote">declared in a function → usable only in that function</span></div>
  <div class="lz-layer"><span class="lz-lname">Global variable</span><span class="lz-lnote">declared outside every function → usable everywhere (use sparingly)</span></div>
</div>
<pre><span class="tok-type">void</span> <span class="tok-function">f</span>() {
    <span class="tok-type">int</span> x = 10;    <span class="tok-comment">// x lives only inside f()</span>
}
<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-function">f</span>();
    <span class="tok-comment">// printf("%d", x);  // ERROR: x does not exist here</span>
}</pre>
<h3>Built-in vs user-defined functions</h3>
<ul>
  <li><strong>Built-in:</strong> <code>printf</code>, <code>scanf</code>, <code>sqrt</code>… live in libraries, just <code>#include</code> them.</li>
  <li><strong>User-defined:</strong> functions you write, like <code>tong()</code> above.</li>
</ul>
<div class="callout">Prefer to avoid global variables — they make it hard to track "who changed the value". Passing data through function parameters is far clearer.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Phạm vi biến (scope)</h2>
<p class="lead"><strong>Phạm vi</strong> là vùng code mà một biến "tồn tại" và dùng được. Biến khai báo trong một hàm chỉ sống trong hàm đó (biến <em>cục bộ</em>).</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Biến cục bộ (local)</span><span class="lz-lnote">khai trong hàm → chỉ dùng trong hàm đó</span></div>
  <div class="lz-layer"><span class="lz-lname">Biến toàn cục (global)</span><span class="lz-lnote">khai ngoài mọi hàm → dùng khắp nơi (hạn chế dùng)</span></div>
</div>
<pre><span class="tok-type">void</span> <span class="tok-function">f</span>() {
    <span class="tok-type">int</span> x = 10;    <span class="tok-comment">// x chỉ sống trong f()</span>
}
<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-function">f</span>();
    <span class="tok-comment">// printf("%d", x);  // LỖI: x không tồn tại ở đây</span>
}</pre>
<h3>Hàm dựng sẵn vs tự định nghĩa</h3>
<ul>
  <li><strong>Dựng sẵn (built-in):</strong> <code>printf</code>, <code>scanf</code>, <code>sqrt</code>… nằm trong thư viện, chỉ cần <code>#include</code>.</li>
  <li><strong>Tự định nghĩa:</strong> hàm bạn viết như <code>tong()</code> ở trên.</li>
</ul>
<div class="callout">Nên hạn chế biến toàn cục — chúng khiến khó theo dõi "ai đã đổi giá trị". Truyền dữ liệu qua tham số hàm rõ ràng hơn nhiều.</div>
</div>
`,
        },
        {
          title: 'Workshop 2 — A menu program calling functions|||Workshop 2 — Chương trình menu gọi hàm',
          slug: 'prf192-5-workshop2',
          type: 'EXERCISE',
          description: 'Xây chương trình dạng menu, mỗi chức năng là một hàm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Workshop 2</span>
<h2>Workshop 2 — Student score manager (menu)</h2>
<p class="lead">Apply functions, parameters, loops and branching.</p>
<h3>Problem</h3>
<p>Write a <strong>menu</strong> program that repeats using <code>do-while</code>, where each feature is its own function:</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">nhapDiem()</div><div class="lz-nsub">input the list of scores</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">tinhTrungBinh()</div><div class="lz-nsub">compute the average</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">timMax()</div><div class="lz-nsub">find the highest score</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Exit</div><div class="lz-nsub">end the program</div></div></div>
</div>
<h3>Grading criteria</h3>
<table>
  <thead><tr><th>Criterion</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>Features run correctly</td><td>40%</td></tr>
    <tr><td>Sensible split into functions (one function — one job)</td><td>30%</td></tr>
    <tr><td>Handles wrong choice / empty data</td><td>20%</td></tr>
    <tr><td>Presentation, naming</td><td>10%</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-280" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Do &amp; auto-grade</span><span class="lc-sub">Submit the menu program on CodeLab; the model solution opens after you submit.</span></span>
  <span class="lc-cta">START →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Workshop 2</span>
<h2>Workshop 2 — Quản lý điểm sinh viên (menu)</h2>
<p class="lead">Vận dụng hàm, tham số, vòng lặp và rẽ nhánh.</p>
<h3>Đề bài</h3>
<p>Viết chương trình <strong>menu</strong> lặp lại bằng <code>do-while</code>, mỗi chức năng là một hàm riêng:</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">nhapDiem()</div><div class="lz-nsub">nhập danh sách điểm</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">tinhTrungBinh()</div><div class="lz-nsub">tính điểm trung bình</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">timMax()</div><div class="lz-nsub">tìm điểm cao nhất</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Thoát</div><div class="lz-nsub">kết thúc chương trình</div></div></div>
</div>
<h3>Tiêu chí chấm</h3>
<table>
  <thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
  <tbody>
    <tr><td>Chạy đúng các chức năng</td><td>40%</td></tr>
    <tr><td>Tách hàm hợp lý (một hàm — một việc)</td><td>30%</td></tr>
    <tr><td>Xử lý lựa chọn sai / dữ liệu rỗng</td><td>20%</td></tr>
    <tr><td>Trình bày, đặt tên</td><td>10%</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-280" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Làm & chấm tự động</span><span class="lc-sub">Nộp bài menu gọi hàm trên CodeLab; lời giải mẫu mở sau khi nộp.</span></span>
  <span class="lc-cta">LÀM BÀI →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'prf192-5-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh hàm & phạm vi biến.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'In int tong(int a, int b), what is the leading "int"?|||Trong int tong(int a, int b), "int" đứng đầu là gì?', options: ['Function name|||Tên hàm', 'Return type|||Kiểu giá trị trả về', 'A parameter|||Tham số', 'A global variable|||Biến toàn cục'], correctIndex: 1, points: 1 },
              { question: 'What does pass by value mean?|||Truyền theo giá trị (pass by value) nghĩa là?', options: ['The function can change the original|||Hàm sửa được biến gốc', 'The function gets a copy and cannot change the original|||Hàm nhận một bản sao, không sửa được biến gốc', 'Nothing is passed|||Không truyền gì', 'Only for real numbers|||Chỉ dùng cho số thực'], correctIndex: 1, points: 1 },
              { question: 'Where can a local variable declared in f() be used?|||Biến cục bộ khai trong hàm f() dùng được ở đâu?', options: ['Every function|||Mọi hàm', 'Only in f()|||Chỉ trong f()', 'Only in main()|||Chỉ trong main()', 'The whole program|||Toàn chương trình'], correctIndex: 1, points: 1 },
              { question: 'What kind of function is printf?|||printf là loại hàm gì?', options: ['User-defined|||Tự định nghĩa', 'Built into the library|||Dựng sẵn trong thư viện', 'A keyword|||Từ khoá', 'A variable|||Biến'], correctIndex: 1, points: 1 },
              { question: 'To let a function change the original variable, use?|||Muốn hàm thay đổi được biến gốc, cần dùng?', options: ['A global variable is required|||Biến toàn cục bắt buộc', 'A pointer|||Con trỏ', 'return multiple times|||return nhiều lần', 'It is impossible|||Không thể được'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — CON TRỎ ══════════════════ */
    {
      title: 'Chapter 6 — Pointers|||Chương 6 — Con trỏ',
      description: 'Địa chỉ bộ nhớ và con trỏ — phần "khó nhằn" nhưng là chìa khoá của C.',
      lessons: [
        {
          title: '6.1 — What is a pointer? The & and * operators|||6.1 — Con trỏ là gì? Toán tử & và *',
          slug: 'prf192-6-1-con-tro',
          type: 'VIDEO',
          description: 'Địa chỉ bộ nhớ và cách con trỏ trỏ tới biến khác.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>What is a pointer?</h2>
<p class="lead">Every variable sits at an <strong>address</strong> in memory (like a house number). A <strong>pointer</strong> is a special variable: it holds the <em>address</em> of another variable, instead of holding a value directly.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">int n = 5;</span><span class="lz-lnote">n holds the value 5, at address (e.g.) 0x100</span></div>
  <div class="lz-layer"><span class="lz-lname">int *p = &amp;n;</span><span class="lz-lnote">pointer p holds 0x100 — "points to" n</span></div>
  <div class="lz-layer"><span class="lz-lname">*p</span><span class="lz-lnote">go to the address p holds → read out 5</span></div>
</div>
<h3>The two core operators</h3>
<ul>
  <li><code>&amp;n</code> — "<strong>address of</strong> n" (address-of).</li>
  <li><code>*p</code> — "<strong>the value at</strong> the address p points to" (dereference).</li>
</ul>
<pre><span class="tok-type">int</span> n = 5;
<span class="tok-type">int</span> *p = &amp;n;        <span class="tok-comment">// p points to n</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, *p);   <span class="tok-comment">// 5  — read through the pointer</span>
*p = 10;             <span class="tok-comment">// write through the pointer → n becomes 10</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, n);    <span class="tok-comment">// 10 !</span></pre>
<div class="out"><b>Output:</b> 5<br>10</div>
<div class="note-ct">Remember the <code>&amp;</code> in <code>scanf("%d", &amp;n)</code> from chapter 2 — it is exactly "address of n". Now you see why: <code>scanf</code> needs the address to write the input into n's memory cell.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Con trỏ là gì?</h2>
<p class="lead">Mỗi biến nằm ở một <strong>địa chỉ</strong> trong bộ nhớ (giống số nhà). <strong>Con trỏ (pointer)</strong> là một biến đặc biệt: nó chứa <em>địa chỉ</em> của biến khác, thay vì chứa giá trị trực tiếp.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">int n = 5;</span><span class="lz-lnote">biến n chứa giá trị 5, ở địa chỉ (vd) 0x100</span></div>
  <div class="lz-layer"><span class="lz-lname">int *p = &amp;n;</span><span class="lz-lnote">con trỏ p chứa 0x100 — "trỏ tới" n</span></div>
  <div class="lz-layer"><span class="lz-lname">*p</span><span class="lz-lnote">đi tới địa chỉ p trỏ → lấy ra 5</span></div>
</div>
<h3>Hai toán tử cốt lõi</h3>
<ul>
  <li><code>&amp;n</code> — "<strong>địa chỉ của</strong> n" (address-of).</li>
  <li><code>*p</code> — "<strong>giá trị tại</strong> địa chỉ p trỏ tới" (dereference).</li>
</ul>
<pre><span class="tok-type">int</span> n = 5;
<span class="tok-type">int</span> *p = &amp;n;        <span class="tok-comment">// p trỏ tới n</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, *p);   <span class="tok-comment">// 5  — đọc qua con trỏ</span>
*p = 10;             <span class="tok-comment">// ghi qua con trỏ → n đổi thành 10</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d\\n"</span>, n);    <span class="tok-comment">// 10 !</span></pre>
<div class="out"><b>Output:</b> 5<br>10</div>
<div class="note-ct">Nhớ lại dấu <code>&amp;</code> trong <code>scanf("%d", &amp;n)</code> ở chương 2 — chính là "địa chỉ của n". Giờ bạn hiểu vì sao: <code>scanf</code> cần địa chỉ để ghi giá trị nhập vào đúng ô nhớ của n.</div>
</div>
`,
        },
        {
          title: '6.2 — Pointers as parameters (pass by reference)|||6.2 — Con trỏ làm tham số (pass by reference)',
          slug: 'prf192-6-2-pass-by-reference',
          type: 'VIDEO',
          description: 'Cho hàm thay đổi được biến gốc.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Pointers as parameters — pass by reference</h2>
<p class="lead">In chapter 5 we saw a function can't change the original variable (pass by value). Passing the <strong>address</strong> (a pointer) solves it: the function receives the address and writes straight into the original cell.</p>
<pre><span class="tok-type">void</span> <span class="tok-function">tang</span>(<span class="tok-type">int</span> *x) { *x = *x + 1; }  <span class="tok-comment">// edit through the pointer</span>
<span class="tok-type">int</span> n = 5;
<span class="tok-function">tang</span>(&amp;n);              <span class="tok-comment">// pass the ADDRESS of n</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, n);      <span class="tok-comment">// 6 — n changed !</span></pre>
<div class="out"><b>Output:</b> 6</div>
<h3>The classic use: a swap function</h3>
<pre><span class="tok-type">void</span> <span class="tok-function">swap</span>(<span class="tok-type">int</span> *a, <span class="tok-type">int</span> *b) {
    <span class="tok-type">int</span> t = *a; *a = *b; *b = t;
}</pre>
<div class="pitfall">You cannot write a working <code>swap</code> with pass by value — inside it would only swap two copies. Pointers are required. This is a very common interview/exam question.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Con trỏ làm tham số — truyền theo tham chiếu</h2>
<p class="lead">Ở chương 5 ta thấy hàm không sửa được biến gốc (pass by value). Truyền <strong>địa chỉ</strong> (con trỏ) giải quyết điều đó: hàm nhận địa chỉ và ghi thẳng vào ô nhớ gốc.</p>
<pre><span class="tok-type">void</span> <span class="tok-function">tang</span>(<span class="tok-type">int</span> *x) { *x = *x + 1; }  <span class="tok-comment">// sửa qua con trỏ</span>
<span class="tok-type">int</span> n = 5;
<span class="tok-function">tang</span>(&amp;n);              <span class="tok-comment">// truyền ĐỊA CHỈ của n</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, n);      <span class="tok-comment">// 6 — n đã đổi !</span></pre>
<div class="out"><b>Output:</b> 6</div>
<h3>Ứng dụng kinh điển: hàm hoán đổi</h3>
<pre><span class="tok-type">void</span> <span class="tok-function">swap</span>(<span class="tok-type">int</span> *a, <span class="tok-type">int</span> *b) {
    <span class="tok-type">int</span> t = *a; *a = *b; *b = t;
}</pre>
<div class="pitfall">Không thể viết hàm <code>swap</code> hoạt động đúng nếu truyền theo giá trị — bên trong sẽ chỉ đổi hai bản sao. Bắt buộc dùng con trỏ. Đây là câu hỏi phỏng vấn/kiểm tra rất hay gặp.</div>
</div>
`,
        },
        {
          title: '6.3 — Dynamic allocation: malloc & free|||6.3 — Cấp phát động: malloc & free',
          slug: 'prf192-6-3-malloc',
          type: 'VIDEO',
          description: 'Xin bộ nhớ khi chạy và trả lại khi xong.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Dynamic allocation — <code>malloc</code> &amp; <code>free</code></h2>
<p class="lead">Sometimes while writing code you <em>don't yet know</em> how many cells you need (e.g. how many elements the user enters at run time). <strong>Dynamic allocation</strong> lets you request memory at run time via <code>malloc</code>, and give it back with <code>free</code>.</p>
<pre><span class="tok-keyword">#include</span> &lt;stdlib.h&gt;
<span class="tok-type">int</span> n = 5;
<span class="tok-type">int</span> *a = (<span class="tok-type">int</span>*) <span class="tok-function">malloc</span>(n * <span class="tok-keyword">sizeof</span>(<span class="tok-type">int</span>)); <span class="tok-comment">// request an array of 5 ints</span>
a[0] = 10;               <span class="tok-comment">// use it like a normal array</span>
<span class="tok-function">free</span>(a);                 <span class="tok-comment">// return the memory when done</span></pre>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Request</div><div class="lz-t">malloc(...)</div><div class="lz-d">allocate a region</div></div>
  <div class="lz-step"><div class="lz-k">Use</div><div class="lz-t">a[i] = …</div><div class="lz-d">read/write like an array</div></div>
  <div class="lz-step"><div class="lz-k">Return</div><div class="lz-t">free(a)</div><div class="lz-d">release when done</div></div>
</div>
<div class="pitfall">Requesting without <code>free</code> → a <strong>memory leak</strong>. Calling <code>free</code> twice on the same region, or using it after <code>free</code> → serious bugs. Advanced chapter N2 digs into this.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Cấp phát động — <code>malloc</code> &amp; <code>free</code></h2>
<p class="lead">Đôi khi lúc viết code ta <em>chưa biết</em> cần bao nhiêu ô nhớ (vd: số phần tử người dùng nhập lúc chạy). <strong>Cấp phát động</strong> cho phép xin bộ nhớ khi chạy, qua <code>malloc</code>, và trả lại bằng <code>free</code>.</p>
<pre><span class="tok-keyword">#include</span> &lt;stdlib.h&gt;
<span class="tok-type">int</span> n = 5;
<span class="tok-type">int</span> *a = (<span class="tok-type">int</span>*) <span class="tok-function">malloc</span>(n * <span class="tok-keyword">sizeof</span>(<span class="tok-type">int</span>)); <span class="tok-comment">// xin mảng 5 int</span>
a[0] = 10;               <span class="tok-comment">// dùng như mảng bình thường</span>
<span class="tok-function">free</span>(a);                 <span class="tok-comment">// trả lại bộ nhớ khi xong</span></pre>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Xin</div><div class="lz-t">malloc(...)</div><div class="lz-d">cấp một vùng nhớ</div></div>
  <div class="lz-step"><div class="lz-k">Dùng</div><div class="lz-t">a[i] = …</div><div class="lz-d">đọc/ghi như mảng</div></div>
  <div class="lz-step"><div class="lz-k">Trả</div><div class="lz-t">free(a)</div><div class="lz-d">giải phóng khi xong</div></div>
</div>
<div class="pitfall">Xin mà không <code>free</code> → <strong>rò rỉ bộ nhớ (memory leak)</strong>. <code>free</code> hai lần cùng một vùng, hoặc dùng sau khi đã <code>free</code> → lỗi nghiêm trọng. Chương nâng cao N2 sẽ đào sâu chủ đề này.</div>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'prf192-6-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh con trỏ.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'What does the & operator (as in &n) mean?|||Toán tử & (như trong &n) nghĩa là gì?', options: ['Value of n|||Giá trị của n', 'Address of n|||Địa chỉ của n', 'Logical AND|||Và logic', 'Pointer n|||Con trỏ n'], correctIndex: 1, points: 1 },
              { question: 'If int *p = &n; then *p yields?|||Nếu int *p = &n; thì *p cho ra?', options: ['Address of n|||Địa chỉ của n', 'Value of n|||Giá trị của n', 'A new pointer|||Con trỏ mới', '0'], correctIndex: 1, points: 1 },
              { question: 'Why must swap use pointers?|||Vì sao hàm swap phải dùng con trỏ?', options: ['To be faster|||Cho nhanh hơn', 'To change the two original variables|||Để sửa được hai biến gốc', 'Syntax requirement|||Bắt buộc cú pháp', 'Pointers not needed|||Không cần con trỏ'], correctIndex: 1, points: 1 },
              { question: 'What is malloc for?|||malloc dùng để làm gì?', options: ['Print to screen|||In ra màn hình', 'Allocate memory dynamically at run time|||Cấp phát bộ nhớ động lúc chạy', 'Declare a variable|||Khai báo biến', 'Close a file|||Đóng file'], correctIndex: 1, points: 1 },
              { question: 'Forgetting free after malloc causes?|||Quên free sau malloc gây ra?', options: ['Compile error|||Lỗi biên dịch', 'Memory leak|||Rò rỉ bộ nhớ (memory leak)', 'A faster program|||Chương trình nhanh hơn', 'Nothing|||Không sao'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — THƯ VIỆN CHUẨN ══════════════════ */
    {
      title: 'Chapter 7 — The C standard library|||Chương 7 — Thư viện chuẩn C',
      description: 'Tận dụng các hàm có sẵn: stdlib, math, ctype, time.',
      lessons: [
        {
          title: '7.1 — stdlib.h & time.h|||7.1 — stdlib.h & time.h',
          slug: 'prf192-7-1-stdlib-time',
          type: 'VIDEO',
          description: 'Số ngẫu nhiên, chuyển đổi, và thời gian.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2><code>stdlib.h</code> &amp; <code>time.h</code></h2>
<p class="lead">The standard library gives you a wealth of ready-made functions — no reinventing the wheel. Just <code>#include</code> the right header.</p>
<h3>Random numbers</h3>
<pre><span class="tok-keyword">#include</span> &lt;stdlib.h&gt;
<span class="tok-keyword">#include</span> &lt;time.h&gt;
<span class="tok-function">srand</span>(<span class="tok-function">time</span>(NULL));       <span class="tok-comment">// seed with the current time</span>
<span class="tok-type">int</span> r = <span class="tok-function">rand</span>() % 6 + 1;  <span class="tok-comment">// a number 1..6 (dice)</span></pre>
<div class="callout"><code>rand() % n</code> gives a remainder 0..n-1. For 1..6 use <code>% 6 + 1</code>. Without calling <code>srand</code>, every run produces the exact same sequence.</div>
<table>
  <thead><tr><th>Function</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><code>rand()</code>, <code>srand()</code></td><td>random numbers</td></tr>
    <tr><td><code>atoi()</code></td><td>string → integer</td></tr>
    <tr><td><code>abs()</code></td><td>absolute value</td></tr>
    <tr><td><code>malloc()</code>, <code>free()</code></td><td>memory allocation (ch.6)</td></tr>
  </tbody>
</table>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2><code>stdlib.h</code> &amp; <code>time.h</code></h2>
<p class="lead">Thư viện chuẩn cho bạn hàng loạt hàm dùng sẵn — không phải phát minh lại bánh xe. Chỉ cần <code>#include</code> đúng header.</p>
<h3>Số ngẫu nhiên</h3>
<pre><span class="tok-keyword">#include</span> &lt;stdlib.h&gt;
<span class="tok-keyword">#include</span> &lt;time.h&gt;
<span class="tok-function">srand</span>(<span class="tok-function">time</span>(NULL));       <span class="tok-comment">// gieo mầm theo thời gian</span>
<span class="tok-type">int</span> r = <span class="tok-function">rand</span>() % 6 + 1;  <span class="tok-comment">// số 1..6 (xúc xắc)</span></pre>
<div class="callout"><code>rand() % n</code> cho số dư 0..n-1. Muốn 1..6 thì <code>% 6 + 1</code>. Không gọi <code>srand</code> thì mỗi lần chạy ra dãy giống hệt nhau.</div>
<table>
  <thead><tr><th>Hàm</th><th>Công dụng</th></tr></thead>
  <tbody>
    <tr><td><code>rand()</code>, <code>srand()</code></td><td>số ngẫu nhiên</td></tr>
    <tr><td><code>atoi()</code></td><td>chuỗi → số nguyên</td></tr>
    <tr><td><code>abs()</code></td><td>giá trị tuyệt đối</td></tr>
    <tr><td><code>malloc()</code>, <code>free()</code></td><td>cấp phát bộ nhớ (ch.6)</td></tr>
  </tbody>
</table>
</div>
`,
        },
        {
          title: '7.2 — math.h & ctype.h · formatted I/O|||7.2 — math.h & ctype.h · nhập/xuất định dạng',
          slug: 'prf192-7-2-math-ctype',
          type: 'VIDEO',
          description: 'Hàm toán học, phân loại ký tự và định dạng in.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2><code>math.h</code> &amp; <code>ctype.h</code></h2>
<pre><span class="tok-keyword">#include</span> &lt;math.h&gt;
<span class="tok-function">printf</span>(<span class="tok-string">"%.2f\\n"</span>, <span class="tok-function">sqrt</span>(2));   <span class="tok-comment">// 1.41 — square root</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%.0f\\n"</span>, <span class="tok-function">pow</span>(2, 10)); <span class="tok-comment">// 1024 — power</span></pre>
<div class="out"><b>Output:</b> 1.41<br>1024</div>
<table>
  <thead><tr><th>math.h</th><th>ctype.h</th></tr></thead>
  <tbody>
    <tr><td><code>sqrt, pow, abs, ceil, floor</code></td><td><code>isdigit, isalpha, toupper, tolower</code></td></tr>
  </tbody>
</table>
<h3>Formatted output</h3>
<p>Control how things print via specifiers in <code>%</code>:</p>
<ul>
  <li><code>%.2f</code> — real number with 2 decimals.</li>
  <li><code>%5d</code> — integer right-aligned in 5 columns (alignment).</li>
  <li><code>%-10s</code> — string left-aligned in 10 columns.</li>
</ul>
<div class="note-ct">Column alignment with <code>%5d</code>, <code>%-10s</code> is very useful for printing neat data tables — used a lot in the student-manager Workshop.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2><code>math.h</code> &amp; <code>ctype.h</code></h2>
<pre><span class="tok-keyword">#include</span> &lt;math.h&gt;
<span class="tok-function">printf</span>(<span class="tok-string">"%.2f\\n"</span>, <span class="tok-function">sqrt</span>(2));   <span class="tok-comment">// 1.41 — căn bậc hai</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%.0f\\n"</span>, <span class="tok-function">pow</span>(2, 10)); <span class="tok-comment">// 1024 — luỹ thừa</span></pre>
<div class="out"><b>Output:</b> 1.41<br>1024</div>
<table>
  <thead><tr><th>math.h</th><th>ctype.h</th></tr></thead>
  <tbody>
    <tr><td><code>sqrt, pow, abs, ceil, floor</code></td><td><code>isdigit, isalpha, toupper, tolower</code></td></tr>
  </tbody>
</table>
<h3>Nhập/xuất định dạng</h3>
<p>Điều khiển cách in bằng chỉ định trong <code>%</code>:</p>
<ul>
  <li><code>%.2f</code> — số thực 2 chữ số thập phân.</li>
  <li><code>%5d</code> — số nguyên căn phải trong 5 ô (canh cột).</li>
  <li><code>%-10s</code> — chuỗi căn trái trong 10 ô.</li>
</ul>
<div class="note-ct">Canh cột bằng <code>%5d</code>, <code>%-10s</code> cực hữu ích khi in bảng dữ liệu đẹp — dùng nhiều ở Workshop quản lý sinh viên.</div>
</div>
`,
        },
        {
          title: 'Progress Test 1 (review CLO1–6)|||Progress Test 1 (ôn CLO1–6)',
          slug: 'prf192-progress-test-1',
          type: 'QUIZ',
          description: 'Bài kiểm tra giữa chặng — chương 1 đến 7.',
          quiz: {
            timeLimitSeconds: 1200,
            questions: [
              { question: 'Result of 2 + 3 * 4 in C?|||Kết quả 2 + 3 * 4 trong C?', options: ['20', '14', '24', '9'], correctIndex: 1, points: 1 },
              { question: '7 / 2 with both int gives?|||7 / 2 với cả hai là int cho?', options: ['3.5', '3', '4', 'Error|||Lỗi'], correctIndex: 1, points: 1 },
              { question: 'Which loop always runs at least once?|||Vòng lặp nào luôn chạy ít nhất một lần?', options: ['for', 'while', 'do-while', 'None|||Không có'], correctIndex: 2, points: 1 },
              { question: 'With pass by value, the function...|||Truyền theo giá trị thì hàm...', options: ['can change the original|||sửa được biến gốc', 'gets a copy, cannot change the original|||nhận bản sao, không sửa biến gốc', 'receives nothing|||không nhận gì', 'always returns 0|||luôn trả về 0'], correctIndex: 1, points: 1 },
              { question: '*p (with int *p = &n) is?|||*p (với int *p = &n) là?', options: ['address of n|||địa chỉ n', 'value of n|||giá trị của n', 'a new pointer|||con trỏ mới', '0'], correctIndex: 1, points: 1 },
              { question: 'rand() % 6 + 1 gives the range?|||rand() % 6 + 1 cho khoảng giá trị?', options: ['0..6', '1..6', '0..5', '1..7'], correctIndex: 1, points: 1 },
              { question: '%.2f prints a real number with?|||%.2f in số thực với?', options: ['2 integer digits|||2 chữ số nguyên', '2 decimal places|||2 chữ số thập phân', 'width 2|||độ rộng 2', 'unchanged|||không đổi'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — MẢNG & STRUCT ══════════════════ */
    {
      title: 'Chapter 8 — Arrays & Structs|||Chương 8 — Mảng & Struct',
      description: 'Lưu nhiều dữ liệu cùng lúc: mảng, ma trận, tìm kiếm, sắp xếp và struct.',
      lessons: [
        {
          title: '8.1 — One-dimensional arrays|||8.1 — Mảng một chiều',
          slug: 'prf192-8-1-mang-1-chieu',
          type: 'VIDEO',
          description: 'Lưu một dãy phần tử cùng kiểu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>One-dimensional arrays</h2>
<p class="lead">An <strong>array</strong> is a run of consecutive memory cells of the same type, accessed by an <strong>index</strong> starting at 0.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">a[0]</span><span class="lz-lnote">the first element</span></div>
  <div class="lz-layer"><span class="lz-lname">a[1] … a[n-2]</span><span class="lz-lnote">the middle elements</span></div>
  <div class="lz-layer"><span class="lz-lname">a[n-1]</span><span class="lz-lnote">the last element (NOT a[n])</span></div>
</div>
<pre><span class="tok-type">int</span> a[5] = {10, 20, 30, 40, 50};
<span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; 5; i++)
    <span class="tok-function">printf</span>(<span class="tok-string">"%d "</span>, a[i]);   <span class="tok-comment">// traverse the array</span></pre>
<div class="out"><b>Output:</b> 10 20 30 40 50</div>
<div class="pitfall">Array <code>a[5]</code> has valid indices 0..4. Accessing <code>a[5]</code> is <strong>out of bounds</strong> — C doesn't error, it just reads/writes some other memory cell, causing hard-to-find bugs. Always keep loops within <code>i &lt; n</code>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Mảng một chiều</h2>
<p class="lead"><strong>Mảng (array)</strong> là một dãy ô nhớ liên tiếp cùng kiểu, truy cập qua <strong>chỉ số</strong> bắt đầu từ 0.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">a[0]</span><span class="lz-lnote">phần tử đầu tiên</span></div>
  <div class="lz-layer"><span class="lz-lname">a[1] … a[n-2]</span><span class="lz-lnote">các phần tử giữa</span></div>
  <div class="lz-layer"><span class="lz-lname">a[n-1]</span><span class="lz-lnote">phần tử cuối (KHÔNG phải a[n])</span></div>
</div>
<pre><span class="tok-type">int</span> a[5] = {10, 20, 30, 40, 50};
<span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; 5; i++)
    <span class="tok-function">printf</span>(<span class="tok-string">"%d "</span>, a[i]);   <span class="tok-comment">// duyệt mảng</span></pre>
<div class="out"><b>Output:</b> 10 20 30 40 50</div>
<div class="pitfall">Mảng <code>a[5]</code> có chỉ số hợp lệ 0..4. Truy cập <code>a[5]</code> là <strong>tràn mảng</strong> (out of bounds) — C không báo lỗi mà đọc/ghi bừa vào ô nhớ khác, gây bug khó tìm. Luôn kiểm soát vòng lặp <code>i &lt; n</code>.</div>
</div>
`,
        },
        {
          title: '8.2 — Matrices (2D arrays)|||8.2 — Ma trận (mảng 2 chiều)',
          slug: 'prf192-8-2-ma-tran',
          type: 'VIDEO',
          description: 'Bảng dữ liệu hàng × cột.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Matrices — 2D arrays</h2>
<p class="lead">A 2D array <code>a[row][col]</code> stores data as a table — like a grid of many subjects' scores for many students.</p>
<pre><span class="tok-type">int</span> m[2][3] = {{1,2,3},{4,5,6}};
<span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; 2; i++) {
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> j = 0; j &lt; 3; j++)
        <span class="tok-function">printf</span>(<span class="tok-string">"%d "</span>, m[i][j]);
    <span class="tok-function">printf</span>(<span class="tok-string">"\\n"</span>);
}</pre>
<div class="out"><b>Output:</b><br>1 2 3<br>4 5 6</div>
<div class="note-ct">Traversing a matrix needs <strong>nested loops</strong>: the outer loop over rows, the inner over columns. Master this pattern and you can do every matrix problem (add, transpose, find max…).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Ma trận — mảng hai chiều</h2>
<p class="lead">Mảng 2 chiều <code>a[hàng][cột]</code> lưu dữ liệu dạng bảng — như bảng điểm nhiều môn của nhiều sinh viên.</p>
<pre><span class="tok-type">int</span> m[2][3] = {{1,2,3},{4,5,6}};
<span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; 2; i++) {
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> j = 0; j &lt; 3; j++)
        <span class="tok-function">printf</span>(<span class="tok-string">"%d "</span>, m[i][j]);
    <span class="tok-function">printf</span>(<span class="tok-string">"\\n"</span>);
}</pre>
<div class="out"><b>Output:</b><br>1 2 3<br>4 5 6</div>
<div class="note-ct">Duyệt ma trận cần <strong>vòng lặp lồng nhau</strong>: vòng ngoài đi qua hàng, vòng trong đi qua cột. Nắm mẫu này là làm được mọi bài ma trận (cộng, chuyển vị, tìm max…).</div>
</div>
`,
        },
        {
          title: '8.3 — Basic search & sort|||8.3 — Tìm kiếm & sắp xếp cơ bản',
          slug: 'prf192-8-3-tim-sap-xep',
          type: 'VIDEO',
          description: 'Tìm kiếm tuyến tính và sắp xếp chọn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Linear search &amp; selection sort</h2>
<h3>Linear search</h3>
<p>Scan each element in turn until you meet the value you're looking for.</p>
<pre><span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; n; i++)
    <span class="tok-keyword">if</span> (a[i] == x) { <span class="tok-function">printf</span>(<span class="tok-string">"Thay o vi tri %d"</span>, i); <span class="tok-keyword">break</span>; }</pre>
<h3>Selection sort</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Step</div><div class="lz-t">Find the smallest</div><div class="lz-d">in the unsorted part</div></div>
  <div class="lz-step"><div class="lz-k">Step</div><div class="lz-t">Move it to the front</div><div class="lz-d">swap</div></div>
  <div class="lz-step"><div class="lz-k">Repeat</div><div class="lz-t">On the rest</div><div class="lz-d">until done</div></div>
</div>
<div class="note-ct">These are the first algorithms you meet — they are studied in much more depth in <span class="badge">CSD201</span> Data Structures &amp; Algorithms. A solid grasp here lightens the load later.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-281" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: find max/min, count, sort</span><span class="lc-sub">A set of array problems auto-graded on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Tìm kiếm tuyến tính &amp; sắp xếp chọn</h2>
<h3>Tìm kiếm tuyến tính (linear search)</h3>
<p>Duyệt lần lượt từng phần tử tới khi gặp giá trị cần tìm.</p>
<pre><span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; n; i++)
    <span class="tok-keyword">if</span> (a[i] == x) { <span class="tok-function">printf</span>(<span class="tok-string">"Thay o vi tri %d"</span>, i); <span class="tok-keyword">break</span>; }</pre>
<h3>Sắp xếp chọn (selection sort)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Bước</div><div class="lz-t">Tìm nhỏ nhất</div><div class="lz-d">trong phần chưa sắp</div></div>
  <div class="lz-step"><div class="lz-k">Bước</div><div class="lz-t">Đưa lên đầu</div><div class="lz-d">hoán đổi</div></div>
  <div class="lz-step"><div class="lz-k">Lặp</div><div class="lz-t">Với phần còn lại</div><div class="lz-d">tới khi hết</div></div>
</div>
<div class="note-ct">Đây là các thuật toán đầu tiên bạn gặp — chúng được học kỹ hơn nhiều ở <span class="badge">CSD201</span> Cấu trúc dữ liệu &amp; giải thuật. Hiểu chắc ở đây sẽ nhẹ gánh về sau.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-281" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm max/min, đếm, sắp xếp</span><span class="lc-sub">Bộ bài mảng có chấm tự động trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '8.4 — Structs: composite data|||8.4 — Struct: dữ liệu phức hợp',
          slug: 'prf192-8-4-struct',
          type: 'VIDEO',
          description: 'Gom nhiều trường khác kiểu vào một "bản ghi".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2><code>struct</code> — organising composite data</h2>
<p class="lead">Arrays store many elements of the <em>same type</em>. But a "student" has several fields of <em>different types</em>: name (string), age (int), score (float). A <strong>struct</strong> groups them into a new type.</p>
<pre><span class="tok-keyword">struct</span> SinhVien {
    <span class="tok-type">char</span> ten[50];
    <span class="tok-type">int</span> tuoi;
    <span class="tok-type">float</span> diem;
};

<span class="tok-keyword">struct</span> SinhVien sv = {<span class="tok-string">"An"</span>, 20, 8.5};
<span class="tok-function">printf</span>(<span class="tok-string">"%s - %.1f"</span>, sv.ten, sv.diem); <span class="tok-comment">// access with the . operator</span></pre>
<div class="out"><b>Output:</b> An - 8.5</div>
<div class="callout">The most powerful combo: an <strong>array of structs</strong> — <code>struct SinhVien ds[100];</code> to manage a whole list of students. That is exactly the Workshop 3 task.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2><code>struct</code> — tổ chức dữ liệu phức hợp</h2>
<p class="lead">Mảng lưu nhiều phần tử <em>cùng kiểu</em>. Nhưng một "sinh viên" gồm nhiều thông tin <em>khác kiểu</em>: tên (chuỗi), tuổi (int), điểm (float). <strong>struct</strong> gom chúng thành một kiểu mới.</p>
<pre><span class="tok-keyword">struct</span> SinhVien {
    <span class="tok-type">char</span> ten[50];
    <span class="tok-type">int</span> tuoi;
    <span class="tok-type">float</span> diem;
};

<span class="tok-keyword">struct</span> SinhVien sv = {<span class="tok-string">"An"</span>, 20, 8.5};
<span class="tok-function">printf</span>(<span class="tok-string">"%s - %.1f"</span>, sv.ten, sv.diem); <span class="tok-comment">// truy cập bằng dấu .</span></pre>
<div class="out"><b>Output:</b> An - 8.5</div>
<div class="callout">Kết hợp mạnh nhất: <strong>mảng struct</strong> — <code>struct SinhVien ds[100];</code> để quản lý cả danh sách sinh viên. Đây chính là đề Workshop 3.</div>
</div>
`,
        },
        {
          title: 'Workshop 3 — Array of structs|||Workshop 3 — Mảng struct',
          slug: 'prf192-8-workshop3',
          type: 'EXERCISE',
          description: 'Quản lý danh sách sinh viên bằng mảng struct.',
          content: `
<div class="ml-en">
<span class="eyebrow">Workshop 3</span>
<h2>Workshop 3 — Student list manager</h2>
<p class="lead">Combine arrays, structs, functions and loops.</p>
<h3>Problem</h3>
<ul>
  <li>Define <code>struct SinhVien</code> (name, age, score).</li>
  <li>Read a list of n students into an array of structs.</li>
  <li>Print the list as a table (align with <code>%-20s %5.1f</code>).</li>
  <li>Find the top-scoring student; count how many pass (score ≥ 5).</li>
</ul>
<h3>Grading criteria</h3>
<table>
  <thead><tr><th>Criterion</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>Correct struct + array</td><td>30%</td></tr>
    <tr><td>Features run correctly</td><td>40%</td></tr>
    <tr><td>Split into functions, neat table layout</td><td>30%</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-283" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Do &amp; auto-grade</span><span class="lc-sub">Submit the array-of-structs task on CodeLab.</span></span>
  <span class="lc-cta">START →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Workshop 3</span>
<h2>Workshop 3 — Quản lý danh sách sinh viên</h2>
<p class="lead">Kết hợp mảng, struct, hàm và vòng lặp.</p>
<h3>Đề bài</h3>
<ul>
  <li>Định nghĩa <code>struct SinhVien</code> (tên, tuổi, điểm).</li>
  <li>Nhập danh sách n sinh viên vào một mảng struct.</li>
  <li>In danh sách dạng bảng (canh cột bằng <code>%-20s %5.1f</code>).</li>
  <li>Tìm sinh viên điểm cao nhất; đếm số sinh viên đạt (điểm ≥ 5).</li>
</ul>
<h3>Tiêu chí chấm</h3>
<table>
  <thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
  <tbody>
    <tr><td>struct + mảng đúng</td><td>30%</td></tr>
    <tr><td>Các chức năng chạy đúng</td><td>40%</td></tr>
    <tr><td>Tách hàm, trình bày bảng đẹp</td><td>30%</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-283" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Làm & chấm tự động</span><span class="lc-sub">Nộp bài mảng struct trên CodeLab.</span></span>
  <span class="lc-cta">LÀM BÀI →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 8 Quiz|||Quiz chương 8',
          slug: 'prf192-8-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh mảng & struct.',
          quiz: {
            timeLimitSeconds: 600,
            questions: [
              { question: 'Array int a[5] has valid indices?|||Mảng int a[5] có chỉ số hợp lệ là?', options: ['1..5', '0..5', '0..4', '1..4'], correctIndex: 2, points: 1 },
              { question: 'Accessing a[5] on array a[5] causes?|||Truy cập a[5] trên mảng a[5] gây ra?', options: ['Print the last element|||In phần tử cuối', 'Out of bounds|||Tràn mảng (out of bounds)', 'Compile error|||Lỗi biên dịch', '0'], correctIndex: 1, points: 1 },
              { question: 'Traversing a 2D matrix needs?|||Duyệt ma trận 2 chiều cần?', options: ['One loop|||Một vòng lặp', 'Two nested loops|||Hai vòng lặp lồng nhau', 'Recursion required|||Đệ quy bắt buộc', 'No loop|||Không lặp'], correctIndex: 1, points: 1 },
              { question: 'struct is used to?|||struct dùng để?', options: ['Store many elements of the same type|||Lưu nhiều phần tử cùng kiểu', 'Group fields of different types into a new type|||Gom nhiều trường khác kiểu vào một kiểu mới', 'Sort|||Sắp xếp', 'Allocate memory|||Cấp phát bộ nhớ'], correctIndex: 1, points: 1 },
              { question: 'Access field ten of struct variable sv?|||Truy cập trường ten của biến struct sv?', options: ['sv->ten', 'sv.ten', 'sv[ten]', 'ten(sv)'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 — CHUỖI ══════════════════ */
    {
      title: 'Chapter 9 — Strings|||Chương 9 — Chuỗi (String)',
      description: 'Xử lý văn bản: mảng ký tự, ký tự kết thúc, và thư viện string.h.',
      lessons: [
        {
          title: '9.1 — Strings are char arrays|||9.1 — Chuỗi là mảng ký tự',
          slug: 'prf192-9-1-chuoi',
          type: 'VIDEO',
          description: 'Khai báo, nhập/xuất chuỗi và ký tự kết thúc.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Strings are char arrays</h2>
<p class="lead">In C, a <strong>string</strong> is not its own type but a <strong><code>char</code> array</strong> ending in the special character <code>'\\0'</code> (the null terminator).</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">'A' 'n' 'h'</span><span class="lz-lnote">the characters of the string "Anh"</span></div>
  <div class="lz-layer"><span class="lz-lname">'\\0'</span><span class="lz-lnote">null — marks the END of the string</span></div>
</div>
<pre><span class="tok-type">char</span> ten[50] = <span class="tok-string">"Anh"</span>;   <span class="tok-comment">// '\\0' is added automatically at the end</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%s"</span>, ten);         <span class="tok-comment">// prints until it meets '\\0'</span>
<span class="tok-function">scanf</span>(<span class="tok-string">"%s"</span>, ten);          <span class="tok-comment">// reads 1 word (stops at a space)</span></pre>
<div class="pitfall"><code>scanf("%s", ten)</code> only reads up to the first space — entering "Nguyen Van A" gets only "Nguyen". To read a full line with spaces, use <code>fgets(ten, 50, stdin)</code>. Note <code>%s</code> needs no <code>&amp;</code> because an array name is already an address.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Chuỗi là mảng ký tự</h2>
<p class="lead">Trong C, <strong>chuỗi (string)</strong> không phải kiểu riêng mà là một <strong>mảng <code>char</code></strong> kết thúc bằng ký tự đặc biệt <code>'\\0'</code> (null terminator).</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">'A' 'n' 'h'</span><span class="lz-lnote">các ký tự của chuỗi "Anh"</span></div>
  <div class="lz-layer"><span class="lz-lname">'\\0'</span><span class="lz-lnote">null — đánh dấu KẾT THÚC chuỗi</span></div>
</div>
<pre><span class="tok-type">char</span> ten[50] = <span class="tok-string">"Anh"</span>;   <span class="tok-comment">// tự thêm '\\0' ở cuối</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%s"</span>, ten);         <span class="tok-comment">// in tới khi gặp '\\0'</span>
<span class="tok-function">scanf</span>(<span class="tok-string">"%s"</span>, ten);          <span class="tok-comment">// đọc 1 từ (dừng ở dấu cách)</span></pre>
<div class="pitfall"><code>scanf("%s", ten)</code> chỉ đọc tới dấu cách đầu tiên — nhập "Nguyen Van A" chỉ lấy "Nguyen". Muốn đọc cả dòng có dấu cách, dùng <code>fgets(ten, 50, stdin)</code>. Lưu ý <code>%s</code> không cần <code>&amp;</code> vì tên mảng đã là địa chỉ.</div>
</div>
`,
        },
        {
          title: '9.2 — The string.h library|||9.2 — Thư viện string.h',
          slug: 'prf192-9-2-string-h',
          type: 'VIDEO',
          description: 'Các hàm xử lý chuỗi thông dụng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>The <code>string.h</code> library</h2>
<p class="lead">Don't rewrite them — <code>string.h</code> provides the common string functions.</p>
<table>
  <thead><tr><th>Function</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><code>strlen(s)</code></td><td>string length (excluding '\\0')</td></tr>
    <tr><td><code>strcpy(a, b)</code></td><td>copy b into a</td></tr>
    <tr><td><code>strcat(a, b)</code></td><td>append b to the end of a</td></tr>
    <tr><td><code>strcmp(a, b)</code></td><td>compare (0 if equal)</td></tr>
  </tbody>
</table>
<pre><span class="tok-keyword">#include</span> &lt;string.h&gt;
<span class="tok-type">char</span> s[50] = <span class="tok-string">"Hello"</span>;
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, <span class="tok-function">strlen</span>(s));  <span class="tok-comment">// 5</span></pre>
<div class="out"><b>Output:</b> 5</div>
<div class="pitfall">To compare two strings you must use <code>strcmp(a, b) == 0</code>, NOT <code>a == b</code> (that compares addresses and is almost always wrong). A very common trap.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Thư viện <code>string.h</code></h2>
<p class="lead">Đừng tự viết lại — <code>string.h</code> có sẵn các hàm xử lý chuỗi thông dụng.</p>
<table>
  <thead><tr><th>Hàm</th><th>Công dụng</th></tr></thead>
  <tbody>
    <tr><td><code>strlen(s)</code></td><td>độ dài chuỗi (không tính '\\0')</td></tr>
    <tr><td><code>strcpy(a, b)</code></td><td>chép b vào a</td></tr>
    <tr><td><code>strcat(a, b)</code></td><td>nối b vào cuối a</td></tr>
    <tr><td><code>strcmp(a, b)</code></td><td>so sánh (0 nếu bằng)</td></tr>
  </tbody>
</table>
<pre><span class="tok-keyword">#include</span> &lt;string.h&gt;
<span class="tok-type">char</span> s[50] = <span class="tok-string">"Hello"</span>;
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, <span class="tok-function">strlen</span>(s));  <span class="tok-comment">// 5</span></pre>
<div class="out"><b>Output:</b> 5</div>
<div class="pitfall">So sánh hai chuỗi phải dùng <code>strcmp(a, b) == 0</code>, KHÔNG dùng <code>a == b</code> (cái đó so sánh địa chỉ, gần như luôn sai). Đây là bẫy rất phổ biến.</div>
</div>
`,
        },
        {
          title: 'Workshop 4 — String processing|||Workshop 4 — Xử lý chuỗi',
          slug: 'prf192-9-workshop4',
          type: 'EXERCISE',
          description: 'Bài thực hành thao tác chuỗi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Workshop 4</span>
<h2>Workshop 4 — String operations</h2>
<h3>Problem</h3>
<ul>
  <li>Read a full name (with spaces) using <code>fgets</code>.</li>
  <li>Count the characters and the words.</li>
  <li>Convert everything to UPPERCASE (using <code>toupper</code>).</li>
  <li>Check whether the string is a palindrome.</li>
</ul>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-281" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Do &amp; auto-grade</span><span class="lc-sub">String-processing task on CodeLab.</span></span>
  <span class="lc-cta">START →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Workshop 4</span>
<h2>Workshop 4 — Thao tác trên chuỗi</h2>
<h3>Đề bài</h3>
<ul>
  <li>Nhập một họ tên đầy đủ (có dấu cách) bằng <code>fgets</code>.</li>
  <li>Đếm số ký tự và số từ.</li>
  <li>Chuyển toàn bộ thành CHỮ HOA (dùng <code>toupper</code>).</li>
  <li>Kiểm tra chuỗi có phải "đối xứng" (palindrome) không.</li>
</ul>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-281" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Làm & chấm tự động</span><span class="lc-sub">Bài xử lý chuỗi trên CodeLab.</span></span>
  <span class="lc-cta">LÀM BÀI →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 9 Quiz|||Quiz chương 9',
          slug: 'prf192-9-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chuỗi.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A C string ends with which character?|||Chuỗi trong C kết thúc bằng ký tự nào?', options: ["' '", "'\\0'", "'\\n'", "'0'"], correctIndex: 1, points: 1 },
              { question: 'strlen("Hello") returns?|||strlen("Hello") trả về?', options: ['4', '5', '6', '0'], correctIndex: 1, points: 1 },
              { question: 'Compare two strings a and b using?|||So sánh hai chuỗi a và b dùng?', options: ['a == b', 'strcmp(a, b) == 0', 'a.equals(b)', 'compare(a, b)'], correctIndex: 1, points: 1 },
              { question: 'scanf("%s", ten) reads?|||scanf("%s", ten) đọc được?', options: ['A whole line with spaces|||Cả dòng có dấu cách', 'One word (stops at a space)|||Một từ (dừng ở dấu cách)', 'One character|||Một ký tự', 'One number|||Một số'], correctIndex: 1, points: 1 },
              { question: 'To read a whole line with spaces, use?|||Muốn đọc cả dòng có dấu cách, dùng?', options: ['scanf', 'fgets', 'strlen', 'printf'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 10 — TỆP TIN ══════════════════ */
    {
      title: 'Chapter 10 — Files|||Chương 10 — Tệp tin (File)',
      description: 'Lưu và đọc dữ liệu ra ổ đĩa để không mất khi tắt chương trình.',
      lessons: [
        {
          title: '10.1 — File concepts · text vs binary|||10.1 — Khái niệm File · text vs binary',
          slug: 'prf192-10-1-file',
          type: 'VIDEO',
          description: 'Vì sao cần file và hai loại file.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>File concepts</h2>
<p class="lead">Data in variables/arrays lives in RAM — <strong>lost when the program exits</strong>. To store it long term (a student list, scores…), you write it to a <strong>file</strong> on disk.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Text file</span><span class="lz-lnote">readable characters (.txt, .csv) — opens in Notepad</span></div>
  <div class="lz-layer"><span class="lz-lname">Binary file</span><span class="lz-lnote">raw bytes (.bin, images) — compact, fast, not directly readable</span></div>
</div>
<p>This course focuses on <strong>text files</strong>. Working with a file always has 3 steps:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Open</div><div class="lz-t">fopen()</div><div class="lz-d">get a FILE* pointer</div></div>
  <div class="lz-step"><div class="lz-k">Read / Write</div><div class="lz-t">fscanf / fprintf</div><div class="lz-d">work with the data</div></div>
  <div class="lz-step"><div class="lz-k">Close</div><div class="lz-t">fclose()</div><div class="lz-d">save &amp; release</div></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Khái niệm tệp tin</h2>
<p class="lead">Dữ liệu trong biến/mảng nằm ở RAM — <strong>mất hết khi chương trình tắt</strong>. Muốn lưu lâu dài (danh sách sinh viên, điểm số…), ta ghi ra <strong>tệp tin</strong> trên ổ đĩa.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Text file</span><span class="lz-lnote">chứa ký tự đọc được (.txt, .csv) — mở bằng Notepad</span></div>
  <div class="lz-layer"><span class="lz-lname">Binary file</span><span class="lz-lnote">chứa byte thô (.bin, ảnh) — gọn, nhanh, không đọc trực tiếp</span></div>
</div>
<p>Môn này tập trung <strong>text file</strong>. Quy trình làm việc với file luôn gồm 3 bước:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Mở</div><div class="lz-t">fopen()</div><div class="lz-d">lấy con trỏ FILE*</div></div>
  <div class="lz-step"><div class="lz-k">Đọc / Ghi</div><div class="lz-t">fscanf / fprintf</div><div class="lz-d">thao tác dữ liệu</div></div>
  <div class="lz-step"><div class="lz-k">Đóng</div><div class="lz-t">fclose()</div><div class="lz-d">lưu &amp; giải phóng</div></div>
</div>
</div>
`,
        },
        {
          title: '10.2 — Open, read, write, close a file|||10.2 — Mở, đọc, ghi, đóng file',
          slug: 'prf192-10-2-doc-ghi-file',
          type: 'VIDEO',
          description: 'fopen, fprintf, fscanf, fclose trong thực tế.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Open, read, write, close a file</h2>
<h3>Writing to a file</h3>
<pre>FILE *f = <span class="tok-function">fopen</span>(<span class="tok-string">"diem.txt"</span>, <span class="tok-string">"w"</span>); <span class="tok-comment">// "w" = write (overwrite)</span>
<span class="tok-keyword">if</span> (f != NULL) {
    <span class="tok-function">fprintf</span>(f, <span class="tok-string">"An 8.5\\n"</span>);
    <span class="tok-function">fclose</span>(f);
}</pre>
<h3>Reading from a file</h3>
<pre>FILE *f = <span class="tok-function">fopen</span>(<span class="tok-string">"diem.txt"</span>, <span class="tok-string">"r"</span>); <span class="tok-comment">// "r" = read</span>
<span class="tok-type">char</span> ten[50]; <span class="tok-type">float</span> d;
<span class="tok-keyword">while</span> (<span class="tok-function">fscanf</span>(f, <span class="tok-string">"%s %f"</span>, ten, &amp;d) == 2)
    <span class="tok-function">printf</span>(<span class="tok-string">"%s: %.1f\\n"</span>, ten, d);
<span class="tok-function">fclose</span>(f);</pre>
<table>
  <thead><tr><th>Mode</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>"r"</code></td><td>read (the file must exist)</td></tr>
    <tr><td><code>"w"</code></td><td>write new (erase old content)</td></tr>
    <tr><td><code>"a"</code></td><td>append to the end</td></tr>
  </tbody>
</table>
<div class="pitfall">Always check <code>fopen</code> is not <code>NULL</code> before using it — the file may not exist or you may lack permission. And <strong>don't forget <code>fclose</code></strong>, or written data may not be flushed to disk.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Mở, đọc, ghi, đóng file</h2>
<h3>Ghi ra file</h3>
<pre>FILE *f = <span class="tok-function">fopen</span>(<span class="tok-string">"diem.txt"</span>, <span class="tok-string">"w"</span>); <span class="tok-comment">// "w" = ghi (ghi đè)</span>
<span class="tok-keyword">if</span> (f != NULL) {
    <span class="tok-function">fprintf</span>(f, <span class="tok-string">"An 8.5\\n"</span>);
    <span class="tok-function">fclose</span>(f);
}</pre>
<h3>Đọc từ file</h3>
<pre>FILE *f = <span class="tok-function">fopen</span>(<span class="tok-string">"diem.txt"</span>, <span class="tok-string">"r"</span>); <span class="tok-comment">// "r" = đọc</span>
<span class="tok-type">char</span> ten[50]; <span class="tok-type">float</span> d;
<span class="tok-keyword">while</span> (<span class="tok-function">fscanf</span>(f, <span class="tok-string">"%s %f"</span>, ten, &amp;d) == 2)
    <span class="tok-function">printf</span>(<span class="tok-string">"%s: %.1f\\n"</span>, ten, d);
<span class="tok-function">fclose</span>(f);</pre>
<table>
  <thead><tr><th>Chế độ</th><th>Ý nghĩa</th></tr></thead>
  <tbody>
    <tr><td><code>"r"</code></td><td>đọc (file phải tồn tại)</td></tr>
    <tr><td><code>"w"</code></td><td>ghi mới (xoá nội dung cũ)</td></tr>
    <tr><td><code>"a"</code></td><td>ghi thêm vào cuối (append)</td></tr>
  </tbody>
</table>
<div class="pitfall">Luôn kiểm tra <code>fopen</code> khác <code>NULL</code> trước khi dùng — file có thể không tồn tại hoặc không có quyền. Và <strong>đừng quên <code>fclose</code></strong>, nếu không dữ liệu ghi có thể chưa được lưu xuống đĩa.</div>
</div>
`,
        },
        {
          title: 'Workshop 5 — Reading/writing files|||Workshop 5 — Đọc/ghi file',
          slug: 'prf192-10-workshop5',
          type: 'EXERCISE',
          description: 'Lưu danh sách sinh viên ra file và đọc lại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Workshop 5</span>
<h2>Workshop 5 — Save a list to a file</h2>
<h3>Problem</h3>
<ul>
  <li>Read a list of students (array of structs) then <strong>write</strong> it to <code>sinhvien.txt</code>.</li>
  <li>Read the file back and print it as a table.</li>
  <li>Add an "append" feature to add a new student without erasing the old data.</li>
</ul>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-283" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Do &amp; auto-grade</span><span class="lc-sub">File read/write task on CodeLab.</span></span>
  <span class="lc-cta">START →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Workshop 5</span>
<h2>Workshop 5 — Lưu danh sách ra file</h2>
<h3>Đề bài</h3>
<ul>
  <li>Nhập danh sách sinh viên (mảng struct) rồi <strong>ghi ra</strong> <code>sinhvien.txt</code>.</li>
  <li>Đọc lại file, in ra màn hình dạng bảng.</li>
  <li>Thêm chức năng "ghi thêm" (append) một sinh viên mới mà không xoá dữ liệu cũ.</li>
</ul>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-283" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Làm & chấm tự động</span><span class="lc-sub">Bài đọc/ghi file trên CodeLab.</span></span>
  <span class="lc-cta">LÀM BÀI →</span>
</a>
</div>
`,
        },
        {
          title: 'Progress Test 2 (review CLO7–9)|||Progress Test 2 (ôn CLO7–9)',
          slug: 'prf192-progress-test-2',
          type: 'QUIZ',
          description: 'Bài kiểm tra giữa chặng — mảng, struct, chuỗi, file.',
          quiz: {
            timeLimitSeconds: 1200,
            questions: [
              { question: 'Array a[10] has last valid index?|||Mảng a[10] có chỉ số cuối hợp lệ là?', options: ['10', '9', '11', '1'], correctIndex: 1, points: 1 },
              { question: 'struct is used to?|||struct dùng để?', options: ['Sort|||Sắp xếp', 'Group fields of different types into one type|||Gom trường khác kiểu vào một kiểu', 'Open a file|||Mở file', 'Allocate|||Cấp phát'], correctIndex: 1, points: 1 },
              { question: 'strlen("ABCD")?|||strlen("ABCD")?', options: ['3', '4', '5', '0'], correctIndex: 1, points: 1 },
              { question: 'Compare 2 strings for equality?|||So sánh 2 chuỗi bằng nhau?', options: ['a == b', 'strcmp(a,b)==0', 'a.equals(b)', 'a - b'], correctIndex: 1, points: 1 },
              { question: 'The "w" mode of fopen?|||Chế độ "w" của fopen?', options: ['read|||đọc', 'write new (erase old)|||ghi mới (xoá cũ)', 'append|||ghi thêm cuối', 'delete the file|||xoá file'], correctIndex: 1, points: 1 },
              { question: 'The three steps of working with a file?|||Ba bước làm việc với file?', options: ['create-edit-delete|||tạo-sửa-xoá', 'open-read/write-close|||mở-đọc/ghi-đóng', 'print-input-exit|||in-nhập-thoát', 'malloc-use-free|||malloc-dùng-free'], correctIndex: 1, points: 1 },
              { question: 'What to do after fopen before using it?|||Nên làm gì sau fopen trước khi dùng?', options: ['fclose immediately|||fclose ngay', 'check it is not NULL|||kiểm tra khác NULL', 'free', 'print it|||in ra'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ NÂNG CAO (NGOÀI GIÁO TRÌNH) ══════════════════ */
    {
      title: 'Advanced 1 — Debugging & the debugging mindset|||Nâng cao 1 — Gỡ lỗi & tư duy debug',
      description: 'Kỹ năng đọc lỗi và tìm bug — thứ trường ít dạy nhưng lập trình viên dùng mỗi ngày.',
      lessons: [
        {
          title: 'N1.1 — Reading error messages & debugging with printf|||N1.1 — Đọc thông báo lỗi & debug bằng printf',
          slug: 'prf192-n1-1-debug',
          type: 'VIDEO',
          description: 'Ba loại lỗi và cách truy tìm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson N1.1</span>
<h2>Debugging &amp; the debugging mindset</h2>
<p class="lead">Writing buggy code is normal — even for great programmers. What sets people apart is the skill to <strong>find and fix bugs fast</strong>. First, tell the three kinds of error apart:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Syntax error</span><span class="lz-lnote">the compiler reports it at once — missing ; } , wrong name</span></div>
  <div class="lz-layer"><span class="lz-lname">Runtime error</span><span class="lz-lnote">crashes when running — divide by 0, out of bounds, NULL</span></div>
  <div class="lz-layer"><span class="lz-lname">Logic error</span><span class="lz-lnote">runs but gives the WRONG result — the hardest</span></div>
</div>
<h3>Reading error messages</h3>
<p>The compiler reports errors with a <strong>line number</strong>. Always read the <em>first</em> error first — later ones are usually consequences. The real error may be on the line <em>just before</em> the reported one (e.g. a missing <code>;</code>).</p>
<h3>Debugging with printf</h3>
<pre><span class="tok-function">printf</span>(<span class="tok-string">"DEBUG: i=%d, tong=%d\\n"</span>, i, tong); <span class="tok-comment">// print the state mid-way</span></pre>
<div class="note-ct">A simple but powerful technique: sprinkle <code>printf</code> to see variable values at each step and pin down where a value first goes wrong. Later you'll learn a debugger with breakpoints, but the "print to inspect" mindset is always useful.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-579" target="_blank" rel="noopener">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">Debug &amp; test C</span><span class="lc-sub">The "Debugging, Testing & Static Analysis" module on Code Lab — practice breakpoints and inspecting variables.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài N1.1</span>
<h2>Gỡ lỗi &amp; tư duy debug</h2>
<p class="lead">Viết code sai là chuyện thường — kể cả lập trình viên giỏi. Điều tạo ra khác biệt là kỹ năng <strong>tìm và sửa lỗi nhanh</strong>. Trước hết, phân biệt ba loại lỗi:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Lỗi cú pháp</span><span class="lz-lnote">compiler báo ngay — thiếu ; } , sai tên</span></div>
  <div class="lz-layer"><span class="lz-lname">Lỗi thời gian chạy</span><span class="lz-lnote">crash khi chạy — chia 0, tràn mảng, NULL</span></div>
  <div class="lz-layer"><span class="lz-lname">Lỗi logic</span><span class="lz-lnote">chạy được nhưng SAI kết quả — khó nhất</span></div>
</div>
<h3>Đọc thông báo lỗi</h3>
<p>Compiler báo lỗi kèm <strong>số dòng</strong>. Luôn đọc <em>lỗi đầu tiên</em> trước — các lỗi sau thường là hệ quả. Lỗi thật có thể ở dòng <em>ngay trước</em> dòng báo (vd thiếu <code>;</code>).</p>
<h3>Debug bằng printf</h3>
<pre><span class="tok-function">printf</span>(<span class="tok-string">"DEBUG: i=%d, tong=%d\\n"</span>, i, tong); <span class="tok-comment">// in trạng thái giữa chừng</span></pre>
<div class="note-ct">Kỹ thuật đơn giản mà mạnh: rải <code>printf</code> để xem giá trị biến ở từng bước, khoanh vùng chỗ giá trị bắt đầu sai. Sau này bạn sẽ học trình gỡ lỗi (debugger) đặt breakpoint, nhưng tư duy "in ra để soi" luôn hữu dụng.</p></div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-579" target="_blank" rel="noopener">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">Gỡ lỗi & kiểm thử C</span><span class="lc-sub">Module "Debugging, Testing & Static Analysis" trên Code Lab — thực hành đặt breakpoint và soi biến.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'N1.2 — 10 classic beginner C mistakes|||N1.2 — 10 lỗi C kinh điển của người mới',
          slug: 'prf192-n1-2-loi-kinh-dien',
          type: 'VIDEO',
          description: 'Danh sách bẫy hay gặp và cách tránh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson N1.2</span>
<h2>10 classic C mistakes</h2>
<p class="lead">Recognising these traps in advance saves you hours of debugging.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Confusing = and ==</div><div class="lz-nsub">if (x = 5) is always true</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Forgetting &amp; in scanf</div><div class="lz-nsub">scanf("%d", n) → broken</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Integer division</div><div class="lz-nsub">7/2 = 3, not 3.5</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Out of bounds</div><div class="lz-nsub">a[n] on array a[n]</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Forgetting break in switch</div><div class="lz-nsub">fall-through</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Infinite loop</div><div class="lz-nsub">forgetting to update the condition</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Comparing strings with ==</div><div class="lz-nsub">must use strcmp</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Using an uninitialised variable</div><div class="lz-nsub">holds garbage</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Memory leak</div><div class="lz-nsub">malloc without free</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Forgetting fclose</div><div class="lz-nsub">data not flushed to disk</div></div></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài N1.2</span>
<h2>10 lỗi C kinh điển</h2>
<p class="lead">Nhận diện sẵn các bẫy này giúp bạn tiết kiệm hàng giờ debug.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nhầm = và ==</div><div class="lz-nsub">if (x = 5) luôn đúng</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Quên &amp; trong scanf</div><div class="lz-nsub">scanf("%d", n) → hỏng</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Chia số nguyên</div><div class="lz-nsub">7/2 = 3, không phải 3.5</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Tràn mảng</div><div class="lz-nsub">a[n] trên mảng a[n]</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Quên break trong switch</div><div class="lz-nsub">fall-through</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Vòng lặp vô hạn</div><div class="lz-nsub">quên cập nhật điều kiện</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">So sánh chuỗi bằng ==</div><div class="lz-nsub">phải dùng strcmp</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Dùng biến chưa khởi tạo</div><div class="lz-nsub">chứa giá trị rác</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Rò rỉ bộ nhớ</div><div class="lz-nsub">malloc không free</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Quên fclose</div><div class="lz-nsub">dữ liệu chưa lưu xuống đĩa</div></div></div>
</div>
</div>
`,
        },
      ],
    },
    {
      title: 'Advanced 2 — Memory deep-dive: Stack & Heap|||Nâng cao 2 — Bộ nhớ sâu: Stack & Heap',
      description: 'Hiểu chương trình dùng bộ nhớ thế nào — nền tảng để nắm chắc con trỏ và tránh crash.',
      lessons: [
        {
          title: 'N2.1 — Stack vs Heap · leaks & dangling pointers|||N2.1 — Stack vs Heap · rò rỉ & con trỏ treo',
          slug: 'prf192-n2-1-stack-heap',
          type: 'VIDEO',
          description: 'Hai vùng bộ nhớ và các lỗi liên quan.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson N2.1</span>
<h2>Memory deep-dive: Stack &amp; Heap</h2>
<p class="lead">A C program uses two main memory regions. Understanding them tells you why a variable "vanishes" after a function returns, and when you must <code>malloc</code>.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Stack</span><span class="lz-lnote">local variables · auto-created/destroyed per function · fast, small</span></div>
  <div class="lz-layer"><span class="lz-lname">Heap</span><span class="lz-lnote">malloc-allocated · you manage it (free) · large, flexible</span></div>
</div>
<h3>Why do local variables "vanish"?</h3>
<p>Local variables live on the <strong>stack</strong>; when the function ends, its stack region is reclaimed. So <strong>never return the address of a local variable</strong> from a function:</p>
<pre><span class="tok-type">int</span>* <span class="tok-function">sai</span>() {
    <span class="tok-type">int</span> x = 5;
    <span class="tok-keyword">return</span> &amp;x;   <span class="tok-comment">// DANGEROUS: x vanishes after the function returns</span>
}</pre>
<h3>Three common memory bugs</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Memory leak</div><div class="lz-nsub">malloc but forget free → eats RAM over time</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Dangling pointer</div><div class="lz-nsub">using a pointer after its memory was freed</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Buffer overflow</div><div class="lz-nsub">writing past the array/string size</div></div></div>
</div>
<div class="note-ct">Golden rule: every <code>malloc</code> must have exactly one <code>free</code>; after <code>free</code>, set the pointer to <code>NULL</code> to avoid misuse. These ideas come back a lot in PRO192 and the systems courses.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài N2.1</span>
<h2>Bộ nhớ sâu: Stack &amp; Heap</h2>
<p class="lead">Chương trình C dùng hai vùng bộ nhớ chính. Hiểu chúng giúp bạn biết vì sao biến "biến mất" khi ra khỏi hàm, và khi nào phải <code>malloc</code>.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Stack</span><span class="lz-lnote">biến cục bộ · tự sinh/tự huỷ theo hàm · nhanh, nhỏ</span></div>
  <div class="lz-layer"><span class="lz-lname">Heap</span><span class="lz-lnote">malloc cấp · bạn tự quản lý (free) · lớn, linh hoạt</span></div>
</div>
<h3>Vì sao biến cục bộ "biến mất"?</h3>
<p>Biến cục bộ nằm trên <strong>stack</strong>; khi hàm kết thúc, vùng stack của nó bị thu hồi. Vì vậy <strong>đừng trả về địa chỉ biến cục bộ</strong> từ một hàm:</p>
<pre><span class="tok-type">int</span>* <span class="tok-function">sai</span>() {
    <span class="tok-type">int</span> x = 5;
    <span class="tok-keyword">return</span> &amp;x;   <span class="tok-comment">// NGUY HIỂM: x biến mất sau khi hàm return</span>
}</pre>
<h3>Ba lỗi bộ nhớ hay gặp</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Memory leak</div><div class="lz-nsub">malloc mà quên free → ngốn RAM dần</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Dangling pointer</div><div class="lz-nsub">dùng con trỏ sau khi vùng nhớ đã free</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Buffer overflow</div><div class="lz-nsub">ghi quá kích thước mảng/chuỗi</div></div></div>
</div>
<div class="note-ct">Quy tắc vàng: mỗi <code>malloc</code> phải có đúng một <code>free</code>; sau khi <code>free</code> nên gán con trỏ về <code>NULL</code> để tránh dùng nhầm. Những khái niệm này quay lại rất nhiều ở PRO192 và các môn hệ thống.</div>
</div>
`,
        },
      ],
    },
    {
      title: 'Advanced 3 — Advanced pointers|||Nâng cao 3 — Con trỏ nâng cao',
      description: 'Con trỏ đa cấp, con trỏ hàm và quan hệ mảng–con trỏ.',
      lessons: [
        {
          title: 'N3.1 — Multi-level pointers, function pointers, array–pointer|||N3.1 — Con trỏ đa cấp, con trỏ hàm, mảng–con trỏ',
          slug: 'prf192-n3-1-con-tro-nang-cao',
          type: 'VIDEO',
          description: 'Những khía cạnh mạnh mẽ hơn của con trỏ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson N3.1</span>
<h2>Advanced pointers</h2>
<h3>The array &amp; pointer relationship</h3>
<p class="lead">An array name is really the <strong>address of the first element</strong>. So <code>a[i]</code> is equivalent to <code>*(a + i)</code>.</p>
<pre><span class="tok-type">int</span> a[3] = {10, 20, 30};
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, *(a + 1)); <span class="tok-comment">// 20 — same as a[1]</span></pre>
<h3>Multi-level pointers (pointer to pointer)</h3>
<pre><span class="tok-type">int</span> n = 5;
<span class="tok-type">int</span> *p = &amp;n;
<span class="tok-type">int</span> **pp = &amp;p;    <span class="tok-comment">// pp points to p</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, **pp); <span class="tok-comment">// 5</span></pre>
<h3>Function pointers (callbacks)</h3>
<p>A pointer can also point to a <em>function</em>, letting you "pass behaviour" as a parameter — the basis of callbacks, very handy for custom sorting.</p>
<pre><span class="tok-type">void</span> (*fp)(<span class="tok-type">int</span>) = &amp;<span class="tok-function">tang</span>; <span class="tok-comment">// fp points to the tang function</span>
fp(5);                        <span class="tok-comment">// call through the function pointer</span></pre>
<div class="note-ct">This goes beyond PRF192 requirements but is very valuable: understanding array = pointer lets you read others' C code fluently, and function pointers are a stepping stone to higher-order thinking in modern languages.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài N3.1</span>
<h2>Con trỏ nâng cao</h2>
<h3>Quan hệ mảng &amp; con trỏ</h3>
<p class="lead">Tên mảng thực chất là <strong>địa chỉ phần tử đầu</strong>. Vì vậy <code>a[i]</code> tương đương <code>*(a + i)</code>.</p>
<pre><span class="tok-type">int</span> a[3] = {10, 20, 30};
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, *(a + 1)); <span class="tok-comment">// 20 — giống a[1]</span></pre>
<h3>Con trỏ đa cấp (con trỏ tới con trỏ)</h3>
<pre><span class="tok-type">int</span> n = 5;
<span class="tok-type">int</span> *p = &amp;n;
<span class="tok-type">int</span> **pp = &amp;p;    <span class="tok-comment">// pp trỏ tới p</span>
<span class="tok-function">printf</span>(<span class="tok-string">"%d"</span>, **pp); <span class="tok-comment">// 5</span></pre>
<h3>Con trỏ hàm (callback)</h3>
<p>Con trỏ còn có thể trỏ tới một <em>hàm</em>, cho phép "truyền hành vi" như tham số — nền tảng của callback, rất hay dùng khi sắp xếp tuỳ biến.</p>
<pre><span class="tok-type">void</span> (*fp)(<span class="tok-type">int</span>) = &amp;<span class="tok-function">tang</span>; <span class="tok-comment">// fp trỏ tới hàm tang</span>
fp(5);                        <span class="tok-comment">// gọi qua con trỏ hàm</span></pre>
<div class="note-ct">Đây là kiến thức vượt yêu cầu PRF192 nhưng cực giá trị: hiểu mảng = con trỏ giúp bạn đọc code C của người khác trôi chảy, và con trỏ hàm là bước đệm tới tư duy hàm bậc cao ở các ngôn ngữ hiện đại.</div>
</div>
`,
        },
      ],
    },
    {
      title: 'Advanced 4 — Real-world C project structure|||Nâng cao 4 — Tổ chức dự án C thực chiến',
      description: 'Từ một file bài tập tới một dự án nhiều file gọn gàng, có Makefile.',
      lessons: [
        {
          title: 'N4.1 — Multiple files, header guards & Makefile|||N4.1 — Nhiều file, header guard & Makefile',
          slug: 'prf192-n4-1-du-an-c',
          type: 'VIDEO',
          description: 'Cách lập trình viên thật tổ chức code C.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson N4.1</span>
<h2>Real-world C project structure</h2>
<p class="lead">For exercises one <code>.c</code> file is enough, but a real project splits code into several files for manageability. This is how the profession does it.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">main.c</span><span class="lz-lnote">entry point, calls the functions</span></div>
  <div class="lz-layer"><span class="lz-lname">sinhvien.h</span><span class="lz-lnote">struct &amp; function prototype declarations</span></div>
  <div class="lz-layer"><span class="lz-lname">sinhvien.c</span><span class="lz-lnote">the implementation (function definitions)</span></div>
</div>
<h3>Header guard</h3>
<p>Avoid a header being loaded twice:</p>
<pre><span class="tok-keyword">#ifndef</span> SINHVIEN_H
<span class="tok-keyword">#define</span> SINHVIEN_H
<span class="tok-comment">// declarations here</span>
<span class="tok-keyword">#endif</span></pre>
<h3>Makefile — build with one command</h3>
<pre>all:
	gcc main.c sinhvien.c -o app</pre>
<p>Type <code>make</code> to build the whole project instead of typing each file by hand.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Write</div><div class="lz-t">Several .c / .h</div><div class="lz-d">split by feature</div></div>
  <div class="lz-step"><div class="lz-k">Build</div><div class="lz-t">make</div><div class="lz-d">gcc links them</div></div>
  <div class="lz-step"><div class="lz-k">Run</div><div class="lz-t">./app</div><div class="lz-d">one program</div></div>
</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-285" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">C project structure &amp; Makefile</span><span class="lc-sub">The "System Programming &amp; Real-World Projects" module on Code Lab — practise splitting files &amp; building.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="note-ct">Master file-splitting + Makefile and you're ready for group projects (SWP391, WDP301) — where code no longer fits in a single file.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài N4.1</span>
<h2>Tổ chức dự án C thực chiến</h2>
<p class="lead">Bài tập thì một file <code>.c</code> là đủ, nhưng dự án thật chia code thành nhiều file để dễ quản lý. Đây là cách nghề nghiệp làm.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">main.c</span><span class="lz-lnote">điểm bắt đầu, gọi các hàm</span></div>
  <div class="lz-layer"><span class="lz-lname">sinhvien.h</span><span class="lz-lnote">khai báo struct &amp; nguyên mẫu hàm</span></div>
  <div class="lz-layer"><span class="lz-lname">sinhvien.c</span><span class="lz-lnote">phần cài đặt (định nghĩa hàm)</span></div>
</div>
<h3>Header guard</h3>
<p>Tránh một header bị nạp hai lần:</p>
<pre><span class="tok-keyword">#ifndef</span> SINHVIEN_H
<span class="tok-keyword">#define</span> SINHVIEN_H
<span class="tok-comment">// khai báo ở đây</span>
<span class="tok-keyword">#endif</span></pre>
<h3>Makefile — biên dịch một lệnh</h3>
<pre>all:
	gcc main.c sinhvien.c -o app</pre>
<p>Gõ <code>make</code> để biên dịch cả dự án thay vì gõ tay từng file.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Viết</div><div class="lz-t">Nhiều .c / .h</div><div class="lz-d">chia theo chức năng</div></div>
  <div class="lz-step"><div class="lz-k">Biên dịch</div><div class="lz-t">make</div><div class="lz-d">gcc gom lại</div></div>
  <div class="lz-step"><div class="lz-k">Chạy</div><div class="lz-t">./app</div><div class="lz-d">một chương trình</div></div>
</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh#module-285" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Tổ chức dự án C & Makefile</span><span class="lc-sub">Module "System Programming & Real-World Projects" trên Code Lab — thực hành chia file & build.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="note-ct">Nắm được cách chia file + Makefile, bạn đã sẵn sàng cho các đồ án nhóm (SWP391, WDP301) — nơi code không thể nhét trong một file được nữa.</div>
</div>
`,
        },
        {
          title: 'Final review & exam strategy|||Ôn tập cuối kỳ & định hướng thi',
          slug: 'prf192-on-tap-cuoi-ky',
          type: 'DOCUMENT',
          description: 'Tổng kết toàn môn và mẹo ôn thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Wrap-up</span>
<h2>Final review &amp; exam strategy</h2>
<p class="lead">You've finished PRF192. Here is a revision map and tips for the Practical Exam (30%) + Final (30%).</p>
<h3>Knowledge checklist</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Foundations</span><span class="lz-lnote">variables, types, operators, if/switch, loops</span></div>
  <div class="lz-layer"><span class="lz-lname">Functions &amp; pointers</span><span class="lz-lnote">splitting into functions, pass by value/reference, malloc/free</span></div>
  <div class="lz-layer"><span class="lz-lname">Data</span><span class="lz-lnote">arrays, matrices, structs, strings, files</span></div>
</div>
<h3>Exam tips</h3>
<ul>
  <li><strong>Practical Exam:</strong> practise typing the familiar patterns fast (array traversal, menus, file read/write). Speed comes from doing lots of CodeLab problems.</li>
  <li><strong>Final (multiple choice):</strong> master the traps — integer division, <code>=</code> vs <code>==</code>, array indices, string comparison.</li>
  <li>Redo all chapter Quizzes and the 2 Progress Tests.</li>
</ul>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Mixed practice set</span><span class="lc-sub">C problems from easy to hard on CodeLab to build exam speed.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
<div class="callout ok">Good luck passing with a high score — and more importantly, with a solid programming foundation for the whole field. Type a lot, break a lot, fix a lot: that is the only path.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Tổng kết</span>
<h2>Ôn tập cuối kỳ &amp; định hướng thi</h2>
<p class="lead">Bạn đã đi hết PRF192. Đây là bản đồ ôn tập và mẹo cho Practical Exam (30%) + Final (30%).</p>
<h3>Checklist kiến thức</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nền tảng</span><span class="lz-lnote">biến, kiểu, toán tử, if/switch, vòng lặp</span></div>
  <div class="lz-layer"><span class="lz-lname">Hàm &amp; con trỏ</span><span class="lz-lnote">tách hàm, pass by value/reference, malloc/free</span></div>
  <div class="lz-layer"><span class="lz-lname">Dữ liệu</span><span class="lz-lnote">mảng, ma trận, struct, chuỗi, file</span></div>
</div>
<h3>Mẹo thi</h3>
<ul>
  <li><strong>Practical Exam:</strong> luyện gõ nhanh các mẫu quen (duyệt mảng, menu, đọc/ghi file). Tốc độ đến từ việc làm nhiều bài CodeLab.</li>
  <li><strong>Final (trắc nghiệm):</strong> nắm chắc bẫy — chia số nguyên, <code>=</code> vs <code>==</code>, chỉ số mảng, so sánh chuỗi.</li>
  <li>Ôn lại toàn bộ Quiz các chương và 2 Progress Test.</li>
</ul>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fprogramming-fundamentals%2Flearn&reflabel=PRF192%20%E2%80%94%20C%C6%A1%20s%E1%BB%9F%20l%E1%BA%ADp%20tr%C3%ACnh" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện đề tổng hợp</span><span class="lc-sub">Bộ bài C từ dễ đến khó trên CodeLab để luyện tốc độ thi.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
<div class="callout ok">Chúc bạn qua môn với điểm cao — và quan trọng hơn, có nền lập trình vững để đi tiếp cả ngành. Gõ nhiều, sai nhiều, sửa nhiều là con đường duy nhất.</div>
</div>
`,
        },
      ],
    },
  ],
};
