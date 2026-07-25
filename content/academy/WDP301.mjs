/**
 * WDP301 — Web Development Project (Kỳ 8). Prereq: FER201m/FER202 (React) + SDN301m/SDN302 (Node/Express/MongoDB).
 * Đồ án web full-stack MERN theo nhóm 3-5, 4 iteration (Initiation → Construction ×3 → Closing).
 * Project-course có CODE → CodeLab deep-link (react/rest-apis/mongodb/authentication/docker) + code thật.
 * Chuẩn SWP391 gold: Mục 0 6 bài (intro+lz-map, thang điểm, CLO, công cụ, ngân hàng đề tài + rubric,
 * anti-fail/high-mark) + chương build MERN từng lớp + chương team/Git/iteration + chương ÔN THI
 * (Final Presentation + ngân hàng vấn đáp CLO) + chương NÂNG CAO ★. Song ngữ EN/VN đối xứng.
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} = \${ ; <>& trong <pre> = &lt;&gt;&amp;.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/WDP301.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    academyType: 'FPT',
    courseCode: 'WDP301',
    title: 'Web Development Project',
    slug: 'web-development-project',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Build a real full-stack MERN web application as a team over four iterations: React SPA + Node/Express REST API + MongoDB, with auth, MVC design, Git collaboration, and a final defended demo.|||Xây một ứng dụng web full-stack MERN thật theo nhóm qua bốn iteration: React SPA + Node/Express REST API + MongoDB, có auth, thiết kế MVC, cộng tác Git, và demo bảo vệ cuối kỳ.',
    description: 'WDP301 (Dự án phát triển Web) là môn ĐỒ ÁN: bạn cùng một nhóm 3-5 người xây một ứng dụng web full-stack HOÀN CHỈNH từ đầu đến cuối, theo quy trình lặp (iteration) giống một dự án phần mềm thật. Stack là MERN — MongoDB + Express + React + Node.js — đúng như hai môn tiên quyết FER (React) và SDN (Node/Express/MongoDB) đã trang bị. Bạn sẽ đi qua bốn giai đoạn: Initiation (phân tích yêu cầu, chọn đề tài, dựng repo), ba vòng Construction (mỗi vòng làm rõ yêu cầu → thiết kế → code → tự test → tích hợp một nhóm tính năng), và Closing (hoàn thiện, review, chuẩn bị bảo vệ). Trọng tâm không chỉ là code chạy được mà là làm việc CHUYÊN NGHIỆP: áp dụng mẫu MVC và tư duy hướng đối tượng, cộng tác qua Git/GitLab, chia việc và theo dõi issue, và cuối cùng THUYẾT TRÌNH & BẢO VỆ sản phẩm. Đây là bản diễn tập gần nhất với công việc của một kỹ sư web trong doanh nghiệp.',
    whatYouLearn: 'Phân tích & làm rõ yêu cầu (actors, use cases, màn hình/chức năng); thiết kế kiến trúc web client–server theo mẫu MVC; dựng REST API bằng Node.js + Express theo lớp (routes → controllers → services → models); mô hình dữ liệu & truy vấn với MongoDB + Mongoose; xác thực JWT + phân quyền theo role + validation & bảo mật cơ bản; xây React SPA (routing, quản lý state, gọi API bằng axios, xử lý form & lỗi 4xx); build một tính năng lõi end-to-end và tích hợp thành một sản phẩm liền mạch; quy trình làm việc nhóm theo iteration (Scrum-lite), Git workflow (branch, PR, merge), chia việc & theo dõi issue trên GitLab; kiểm thử, đóng gói & triển khai; và kỹ năng thuyết trình – demo – bảo vệ sản phẩm trước hội đồng.',
    requirements: 'Nên đã học FER (React) và SDN (Node/Express/MongoDB). Cần: Node.js LTS, VS Code, MongoDB (local hoặc Atlas), một tài khoản GitLab/GitHub cho nhóm, Postman để test API, và một nhóm 3-5 người. Nắm cơ bản JavaScript/ES6, HTTP và JSON.',
    documentsNote: 'Tài liệu chính: Pro MERN Stack — Vasan Subramanian • React Native for Mobile Development — Akshat Paul & Abhishek Nalwaya • Mastering React Native — Sufyan bin Uzayr • React docs (react.dev) • Express (expressjs.com) • Mongoose (mongoosejs.com) • MongoDB Docs. Công cụ cài đặt & template → Exp Hub. Luyện từng phần → Code Lab (React, REST APIs, MongoDB, Authentication, Docker). Đây là project-course — vừa xây vừa quản lý dự án theo iteration.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, quy trình 4 iteration, kiến trúc MERN, thang điểm, CLO, công cụ, ngân hàng đề tài và cách không trượt / ăn điểm cao.',
      lessons: [
        {
          title: '0.1 — What you build & the 4-iteration process|||0.1 — Bạn xây gì & quy trình 4 iteration',
          slug: 'wdp301-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một web MERN full-stack thật, xây theo 4 iteration như dự án phần mềm thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>WDP301 — you build one real full-stack web app, professionally</h2>
<p class="lead">WDP301 is a <strong>project course</strong>, not lectures. Your team of 3-5 builds one complete web application end-to-end using the <strong>MERN stack</strong> (MongoDB · Express · React · Node.js) — the exact stack from your prerequisites FER (React) and SDN (Node/Express/MongoDB). You run it like a real software project: iterations, Git, code reviews, and a final defended demo.</p>
<p>The goal is professional practice: apply the <strong>MVC pattern</strong>, collaborate through Git/GitLab, split work and track issues, and ship something that runs and can be defended under questions.</p>

<h3>The system in one picture — MERN architecture</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">React SPA (browser)</div><div class="lz-d">components · router · axios</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Express REST API</div><div class="lz-d">routes → controllers → services</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">MongoDB (Mongoose)</div><div class="lz-d">collections · schemas</div></div>
</div>
<div class="diagram">Browser  ──HTTP/JSON──▶  Node/Express API  ──Mongoose──▶  MongoDB
  React            (port 5000)                       (Atlas / local)
  (port 5173)   Authorization: Bearer &lt;JWT&gt;      users · &lt;domain&gt;</div>

<h3>The 4-iteration roadmap — how a real project runs</h3>
<div class="lz-map">
  <div class="lz-stage">Initiation</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Requirements, topic &amp; setup</div><div class="lz-nsub">actors · use cases · ERD · repo · MVC skeleton</div></div></div>
  <div class="lz-stage">Construction (×3)</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Backend: Express + MongoDB</div><div class="lz-nsub">models · routes · controllers · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">register/login · middleware · role-based access</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Frontend: React SPA</div><div class="lz-nsub">routing · state · axios · forms &amp; error handling</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Core feature end-to-end</div><div class="lz-nsub">one full vertical slice · integration</div></div></div>
  <div class="lz-stage">Teamwork</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Git workflow &amp; iterations</div><div class="lz-nsub">branches · PR · issues · Scrum-lite</div></div></div>
  <div class="lz-stage">Closing</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Final presentation &amp; defense</div><div class="lz-nsub">demo script · Q&A by CLO</div></div></div>
  <div class="lz-stage">Beyond the syllabus ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Testing · deployment · performance · real-time</div><div class="lz-nsub">ship like a real team</div></div></div>
</div>

<div class="callout ok">The habit that decides your grade: <strong>build a thin vertical slice first</strong> — login → list one entity → create one → see it — then grow it iteration by iteration. A tiny end-to-end flow that runs beats a huge design that never integrates.</div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%200.1#module-527" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Warm up: build your first REST API on Code Lab</span><span class="lc-sub">Refresh Express routes, JSON and status codes before the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>WDP is a re-skin skill.</b> Every web project — e-commerce, booking, dashboard — is a variation of this MERN skeleton: an authenticated REST API over a database, a React SPA that consumes it, one core feature done well. Master this one and the rest are re-skins. <em>This framing is beyond the syllabus but is why WDP transfers to any job.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>WDP301 — bạn xây một web full-stack thật, một cách chuyên nghiệp</h2>
<p class="lead">WDP301 là một <strong>môn đồ án</strong>, không phải bài giảng. Nhóm 3-5 người của bạn xây một ứng dụng web hoàn chỉnh từ đầu đến cuối bằng <strong>stack MERN</strong> (MongoDB · Express · React · Node.js) — đúng stack từ hai môn tiên quyết FER (React) và SDN (Node/Express/MongoDB). Bạn chạy nó như một dự án phần mềm thật: iteration, Git, review code, và demo bảo vệ cuối kỳ.</p>
<p>Mục tiêu là thực hành chuyên nghiệp: áp dụng <strong>mẫu MVC</strong>, cộng tác qua Git/GitLab, chia việc và theo dõi issue, và ra một sản phẩm chạy được và bảo vệ được dưới câu hỏi.</p>

<h3>Hệ thống trong một hình — kiến trúc MERN</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">React SPA (trình duyệt)</div><div class="lz-d">component · router · axios</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Express REST API</div><div class="lz-d">routes → controllers → services</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">MongoDB (Mongoose)</div><div class="lz-d">collection · schema</div></div>
</div>
<div class="diagram">Trình duyệt  ──HTTP/JSON──▶  Node/Express API  ──Mongoose──▶  MongoDB
  React               (cổng 5000)                     (Atlas / local)
  (cổng 5173)   Authorization: Bearer &lt;JWT&gt;      users · &lt;miền&gt;</div>

<h3>Bản đồ 4 iteration — cách một dự án thật chạy</h3>
<div class="lz-map">
  <div class="lz-stage">Khởi tạo</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Yêu cầu, đề tài &amp; setup</div><div class="lz-nsub">actors · use case · ERD · repo · khung MVC</div></div></div>
  <div class="lz-stage">Xây dựng (×3)</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Backend: Express + MongoDB</div><div class="lz-nsub">model · route · controller · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; phân quyền (JWT)</div><div class="lz-nsub">đăng ký/đăng nhập · middleware · phân quyền role</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Frontend: React SPA</div><div class="lz-nsub">routing · state · axios · form &amp; xử lý lỗi</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Tính năng lõi end-to-end</div><div class="lz-nsub">một lát cắt dọc trọn vẹn · tích hợp</div></div></div>
  <div class="lz-stage">Làm việc nhóm</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Git workflow &amp; iteration</div><div class="lz-nsub">branch · PR · issue · Scrum-lite</div></div></div>
  <div class="lz-stage">Kết thúc</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Thuyết trình &amp; bảo vệ cuối</div><div class="lz-nsub">kịch bản demo · Q&A theo CLO</div></div></div>
  <div class="lz-stage">Ngoài giáo trình ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Test · triển khai · hiệu năng · real-time</div><div class="lz-nsub">ship như một đội thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm: <strong>xây một lát cắt dọc mỏng trước</strong> — đăng nhập → liệt kê một thực thể → tạo một cái → thấy nó — rồi lớn dần từng iteration. Một luồng end-to-end nhỏ chạy được thắng một thiết kế khổng lồ không bao giờ tích hợp.</div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%200.1#module-527" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Khởi động: xây REST API đầu tiên trên Code Lab</span><span class="lc-sub">Ôn Express routes, JSON và status code trước khi vào đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>WDP là kỹ năng "thay áo".</b> Mọi dự án web — thương mại điện tử, đặt lịch, dashboard — đều là biến thể của khung MERN này: một REST API có xác thực trên CSDL, một React SPA tiêu thụ nó, một tính năng lõi làm tốt. Làm chủ cái này thì phần còn lại chỉ là thay áo. <em>Góc nhìn này ngoài syllabus nhưng là lý do WDP chuyển được sang mọi công việc.</em></div>
</div>`,
        },
        {
          title: '0.2 — How you are graded (3 iterations + final demo)|||0.2 — Cách tính điểm (3 iteration + demo cuối)',
          slug: 'wdp301-thang-diem',
          type: 'article',
          description: 'Bảng thang điểm: 3 On-going Assessment 20% mỗi cái + Final Project Presentation 40%, và điều kiện qua môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Graded on iterations, defended at the end</h2>
<p class="lead">WDP301 grades your project across three ongoing checkpoints plus a final defended demo — there's no written exam. Each ongoing assessment reviews what your team shipped in an iteration; the final presentation is your capstone.</p>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>What is assessed</th></tr></thead>
<tbody>
<tr><td>On-going Assessment 1</td><td><strong>20%</strong></td><td>Iteration 1: requirements, design, first working feature</td></tr>
<tr><td>On-going Assessment 2</td><td><strong>20%</strong></td><td>Iteration 2: more features, backend/frontend integration</td></tr>
<tr><td>On-going Assessment 3</td><td><strong>20%</strong></td><td>Iteration 3: near-complete app, quality &amp; teamwork</td></tr>
<tr><td>Final Project Presentation</td><td><strong>40%</strong></td><td>Full demo + defense (individual Q&A)</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Scale</span><span class="v">10</span></div>
<div class="kv"><span class="k">Pass</span><span class="v">Final result ≥ 5; final presentation ≥ 5</span></div>
<div class="kv"><span class="k">Attendance</span><span class="v">≥ 80% required to be accepted to final</span></div>
<div class="kv"><span class="k">Individual Q&A</span><span class="v">each member defends their own contribution</span></div>
</div>
<div class="callout warn"><strong>Individual accountability is real.</strong> The final Q&A is per-member: you must explain the code <em>you</em> wrote and how your part integrates. A team that "let one person do everything" collapses in the individual defense — everyone must own and understand a slice.</div>
<div class="pitfall"><strong>Attendance is a hard gate.</strong> Below 80% of contact slots you are not accepted to the final presentation (40%). Track it from week 1.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Consistent Git history is graded evidence.</b> A steady stream of meaningful commits from every member across iterations proves real teamwork far better than words. A repo where all commits appear the night before the deadline is a red flag examiners notice. <em>Beyond the syllabus, but the GitLab history quietly backs (or sinks) your teamwork score.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Chấm theo iteration, bảo vệ ở cuối</h2>
<p class="lead">WDP301 chấm đồ án qua ba checkpoint liên tục cộng demo bảo vệ cuối — không có thi viết. Mỗi On-going Assessment review cái nhóm ship trong một iteration; thuyết trình cuối là capstone.</p>
<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Đánh giá gì</th></tr></thead>
<tbody>
<tr><td>On-going Assessment 1</td><td><strong>20%</strong></td><td>Iteration 1: yêu cầu, thiết kế, tính năng đầu chạy được</td></tr>
<tr><td>On-going Assessment 2</td><td><strong>20%</strong></td><td>Iteration 2: thêm tính năng, tích hợp backend/frontend</td></tr>
<tr><td>On-going Assessment 3</td><td><strong>20%</strong></td><td>Iteration 3: app gần hoàn chỉnh, chất lượng &amp; teamwork</td></tr>
<tr><td>Thuyết trình cuối</td><td><strong>40%</strong></td><td>Demo đầy đủ + bảo vệ (Q&A cá nhân)</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Thang</span><span class="v">10</span></div>
<div class="kv"><span class="k">Qua môn</span><span class="v">Kết quả ≥ 5; thuyết trình cuối ≥ 5</span></div>
<div class="kv"><span class="k">Điểm danh</span><span class="v">≥ 80% mới được vào bảo vệ cuối</span></div>
<div class="kv"><span class="k">Q&A cá nhân</span><span class="v">mỗi thành viên bảo vệ phần đóng góp của mình</span></div>
</div>
<div class="callout warn"><strong>Trách nhiệm cá nhân là thật.</strong> Q&A cuối theo từng người: bạn phải giải thích code <em>bạn</em> viết và phần của bạn tích hợp thế nào. Nhóm "để một người làm hết" sụp ở phần bảo vệ cá nhân — mọi người phải sở hữu và hiểu một lát cắt.</div>
<div class="pitfall"><strong>Điểm danh là cổng cứng.</strong> Dưới 80% slot học, bạn không được vào thuyết trình cuối (40%). Theo dõi từ tuần 1.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lịch sử Git đều đặn là bằng chứng được chấm.</b> Một dòng commit có ý nghĩa đều từ mọi thành viên qua các iteration chứng minh teamwork thật hơn lời nói nhiều. Một repo mà mọi commit dồn vào đêm trước hạn nộp là cờ đỏ giám khảo nhận ra. <em>Ngoài syllabus, nhưng lịch sử GitLab âm thầm đỡ (hoặc dìm) điểm teamwork của bạn.</em></div>
</div>`,
        },
        {
          title: '0.3 — Course learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra môn học (CLO)',
          slug: 'wdp301-clo',
          type: 'article',
          description: '5 CLO của WDP301 và giai đoạn nào chứng minh CLO nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 5 CLOs — what you must be able to do</h2>
<p class="lead">WDP301 outcomes mix technical and professional skills. Use them as a self-check before each assessment.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Study & analyze requirements; ask clarifying questions actively. <em>→ Initiation</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Understand & apply the MVC pattern and OOP in designing code modules. <em>→ all iterations</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Proficiency in web programming skills (full-stack: React + Node/Express). <em>→ Construction</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Exhibit professional working attitudes (Git, iterations, teamwork). <em>→ all</em></div>
<div class="lz-layer"><span class="lz-lk">CLO5</span> Practice oral presentation & inter-personal communication. <em>→ Final defense</em></div>
</div>
<div class="callout ok">The arc: <strong>analyze → design (MVC) → build (full-stack) → collaborate → present</strong>. Notice CLO4 (professional attitude) and CLO5 (communication) are graded as much as the code — WDP is training you to work like a real engineer, not just to code alone.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>5 CLO — bạn phải làm được gì</h2>
<p class="lead">Chuẩn đầu ra WDP301 pha trộn kỹ năng kỹ thuật và chuyên nghiệp. Dùng để tự soi trước mỗi đánh giá.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Nghiên cứu & phân tích yêu cầu; chủ động đặt câu hỏi làm rõ. <em>→ Initiation</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Hiểu & áp dụng mẫu MVC và OOP trong thiết kế module code. <em>→ mọi iteration</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Thành thạo kỹ năng lập trình web (full-stack: React + Node/Express). <em>→ Construction</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Thể hiện thái độ làm việc chuyên nghiệp (Git, iteration, teamwork). <em>→ tất cả</em></div>
<div class="lz-layer"><span class="lz-lk">CLO5</span> Rèn thuyết trình miệng & giao tiếp liên cá nhân. <em>→ bảo vệ cuối</em></div>
</div>
<div class="callout ok">Mạch: <strong>phân tích → thiết kế (MVC) → xây (full-stack) → cộng tác → thuyết trình</strong>. Để ý CLO4 (thái độ chuyên nghiệp) và CLO5 (giao tiếp) được chấm ngang với code — WDP rèn bạn làm việc như một kỹ sư thật, không chỉ code một mình.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & setup (Exp Hub)|||0.4 — Công cụ & cài đặt (Exp Hub)',
          slug: 'wdp301-cong-cu',
          type: 'article',
          description: 'Bộ công cụ MERN: Node.js, VS Code, MongoDB/Atlas, Postman, Git/GitLab — kèm guide cài đặt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Your MERN toolkit</h2>
<p class="lead">WDP301 needs a working full-stack dev environment. Here's the minimal kit — set it up in week 1 so the whole team is consistent.</p>
<ul>
<li><strong>Node.js LTS + npm</strong> — runtime for Express and the React build.</li>
<li><strong>VS Code</strong> — editor with ESLint, Prettier, and REST Client extensions.</li>
<li><strong>MongoDB</strong> — local install or MongoDB Atlas (free cloud cluster).</li>
<li><strong>Postman</strong> — test your API endpoints before wiring the frontend.</li>
<li><strong>Git + GitLab</strong> — collaboration, branches, issues (required by the syllabus).</li>
</ul>
<a class="link-card exphub" href="/exp-hub/wdp301-cai-dat-mern?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Setup guide: MERN dev environment</span><span class="lc-sub">Node.js, VS Code extensions, MongoDB Atlas, Postman and Git/GitLab — step by step.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/mongodb?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%200.4#module-419" target="_blank" rel="noopener">
  <span class="lc-ico">🍃</span>
  <span class="lc-body"><span class="lc-title">Practice Mongoose + Node on Code Lab</span><span class="lc-sub">Connect Node to MongoDB and model your first collection.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A monorepo with two folders keeps sanity.</b> Structure the repo as <code>/server</code> (Express) and <code>/client</code> (React), each with its own package.json, plus a root README explaining how to run both. A clear repo layout is the first thing an examiner (and a new teammate) judges. <em>Beyond the syllabus, but the convention that prevents "how do I even run this?" chaos.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ MERN của bạn</h2>
<p class="lead">WDP301 cần một môi trường dev full-stack chạy được. Đây là bộ tối thiểu — cài trong tuần 1 để cả nhóm đồng bộ.</p>
<ul>
<li><strong>Node.js LTS + npm</strong> — runtime cho Express và build React.</li>
<li><strong>VS Code</strong> — editor với ESLint, Prettier và REST Client.</li>
<li><strong>MongoDB</strong> — cài local hoặc MongoDB Atlas (cluster đám mây miễn phí).</li>
<li><strong>Postman</strong> — test các endpoint API trước khi nối frontend.</li>
<li><strong>Git + GitLab</strong> — cộng tác, branch, issue (syllabus yêu cầu).</li>
</ul>
<a class="link-card exphub" href="/exp-hub/wdp301-cai-dat-mern?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Guide cài đặt: môi trường dev MERN</span><span class="lc-sub">Node.js, extension VS Code, MongoDB Atlas, Postman và Git/GitLab — từng bước.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/mongodb?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%200.4#module-419" target="_blank" rel="noopener">
  <span class="lc-ico">🍃</span>
  <span class="lc-body"><span class="lc-title">Luyện Mongoose + Node trên Code Lab</span><span class="lc-sub">Nối Node với MongoDB và mô hình hóa collection đầu tiên.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một monorepo hai thư mục giữ sự tỉnh táo.</b> Cấu trúc repo thành <code>/server</code> (Express) và <code>/client</code> (React), mỗi cái có package.json riêng, cộng một README gốc giải thích cách chạy cả hai. Bố cục repo rõ ràng là thứ đầu tiên giám khảo (và đồng đội mới) đánh giá. <em>Ngoài syllabus, nhưng là quy ước ngăn hỗn loạn "chạy cái này kiểu gì?".</em></div>
</div>`,
        },
        {
          title: '0.5 — Project topic bank (12) + how to pick|||0.5 — Ngân hàng đề tài (12) + cách chọn',
          slug: 'wdp301-ngan-hang-de-tai',
          type: 'article',
          description: '12 đề tài web app đã kiểm scope cho nhóm 3-5 trong một kỳ + rubric 6 phép thử chọn đề.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>12 web-app topics — scoped for a one-term team</h2>
<p class="lead">The most common way teams waste Iteration 1 is arguing about scope. Here are 12 MERN web-app topics already scoped for a 3-5 person team over one term — each has clear actors, a data model, and a core feature. Pick one, or use them as sparks.</p>
<table>
<thead><tr><th>#</th><th>Web app</th><th>Core feature (the "gem")</th></tr></thead>
<tbody>
<tr><td>1</td><td>Clinic appointment booking</td><td>No double-booking of a slot</td></tr>
<tr><td>2</td><td>Library management</td><td>No lending the same copy twice</td></tr>
<tr><td>3</td><td>E-learning mini platform</td><td>Server-side quiz grading + one attempt</td></tr>
<tr><td>4</td><td>Job / freelance board</td><td>Apply once; employer shortlist workflow</td></tr>
<tr><td>5</td><td>Event ticketing</td><td>Seat/ticket reservation without overselling</td></tr>
<tr><td>6</td><td>Homestay / room booking</td><td>No overlapping date bookings per room</td></tr>
<tr><td>7</td><td>Restaurant reservation</td><td>Table not double-booked per time slot</td></tr>
<tr><td>8</td><td>Helpdesk / ticketing</td><td>Ticket state machine + assignment</td></tr>
<tr><td>9</td><td>E-commerce mini store</td><td>Cart → order → stock decrement (no oversell)</td></tr>
<tr><td>10</td><td>Blog / forum with roles</td><td>Author/moderator permissions + moderation</td></tr>
<tr><td>11</td><td>Expense / budget tracker</td><td>Shared group budgets + role permissions</td></tr>
<tr><td>12</td><td>Recruitment / HR mini system</td><td>Application pipeline stages + interviews</td></tr>
</tbody>
</table>

<h3>The 6-test filter — pass all before you commit</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Clear actors</span> Can you name 2-3 roles (e.g. admin, user) with distinct functions?</div>
<div class="lz-layer"><span class="lz-lk">2 · A core feature</span> Is there ONE feature that carries real logic (a "gem" to defend)?</div>
<div class="lz-layer"><span class="lz-lk">3 · CRUD-able</span> Does it decompose into clean CRUD on a few entities?</div>
<div class="lz-layer"><span class="lz-lk">4 · Buildable in 3 iterations</span> Can 3-5 people ship it in a term with MERN?</div>
<div class="lz-layer"><span class="lz-lk">5 · Splittable</span> Can work be divided so everyone owns a slice (for individual Q&A)?</div>
<div class="lz-layer"><span class="lz-lk">6 · Demoable</span> Is there a clear happy-path story you can demo in 10 minutes?</div>
</div>

<div class="callout warn"><strong>Scope trap:</strong> picking an app so big (a full social network, a marketplace with payments) that Iteration 1 has nothing working. Choose narrow-but-complete: 3-4 entities, one strong core feature, done well. Depth beats breadth.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Pick a topic with one hard, defensible feature.</b> The "gem" (e.g. no double-booking, no overselling) is where you show real engineering — validation, transactions, edge cases — and it's what impresses in the defense. A CRUD-only app with no hard logic scores lower even if polished. <em>Beyond the syllabus, but the single choice that most raises your ceiling.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>12 đề tài web app — cỡ một nhóm một kỳ</h2>
<p class="lead">Cách phổ biến nhất khiến nhóm phí Iteration 1 là cãi nhau về scope. Đây là 12 đề tài web app MERN đã kiểm scope cho nhóm 3-5 người trong một kỳ — mỗi cái có actors rõ, một mô hình dữ liệu, và một tính năng lõi. Chọn một, hoặc dùng làm mồi lửa.</p>
<table>
<thead><tr><th>#</th><th>Web app</th><th>Tính năng lõi (viên ngọc)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Đặt lịch khám phòng khám</td><td>Không đặt trùng một khung giờ</td></tr>
<tr><td>2</td><td>Quản lý thư viện</td><td>Không cho mượn một bản sao hai lần</td></tr>
<tr><td>3</td><td>Nền tảng e-learning nhỏ</td><td>Chấm quiz phía server + một lần làm</td></tr>
<tr><td>4</td><td>Bảng việc / freelance</td><td>Ứng tuyển một lần; luồng lọc ứng viên</td></tr>
<tr><td>5</td><td>Bán vé sự kiện</td><td>Giữ ghế/vé không bán quá số lượng</td></tr>
<tr><td>6</td><td>Đặt phòng homestay</td><td>Không đặt chồng ngày mỗi phòng</td></tr>
<tr><td>7</td><td>Đặt bàn nhà hàng</td><td>Bàn không đặt trùng theo khung giờ</td></tr>
<tr><td>8</td><td>Helpdesk / ticketing</td><td>State machine ticket + gán xử lý</td></tr>
<tr><td>9</td><td>Cửa hàng TMĐT nhỏ</td><td>Giỏ → đơn → trừ kho (không bán quá)</td></tr>
<tr><td>10</td><td>Blog / diễn đàn có role</td><td>Quyền tác giả/kiểm duyệt + kiểm duyệt bài</td></tr>
<tr><td>11</td><td>Theo dõi chi tiêu / ngân sách</td><td>Ngân sách nhóm chung + phân quyền role</td></tr>
<tr><td>12</td><td>Hệ thống tuyển dụng / HR nhỏ</td><td>Các bước pipeline ứng tuyển + phỏng vấn</td></tr>
</tbody>
</table>

<h3>Bộ lọc 6 phép thử — qua hết rồi mới chốt</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Actors rõ</span> Kể được 2-3 vai (vd admin, user) với chức năng khác nhau không?</div>
<div class="lz-layer"><span class="lz-lk">2 · Một tính năng lõi</span> Có MỘT tính năng mang logic thật (một "viên ngọc" để bảo vệ) không?</div>
<div class="lz-layer"><span class="lz-lk">3 · CRUD được</span> Nó phân rã thành CRUD gọn trên vài thực thể không?</div>
<div class="lz-layer"><span class="lz-lk">4 · Xây trong 3 iteration</span> 3-5 người ship được trong một kỳ với MERN không?</div>
<div class="lz-layer"><span class="lz-lk">5 · Chia được</span> Việc chia được để mọi người sở hữu một lát (cho Q&A cá nhân) không?</div>
<div class="lz-layer"><span class="lz-lk">6 · Demo được</span> Có một câu chuyện happy-path rõ để demo trong 10 phút không?</div>
</div>

<div class="callout warn"><strong>Bẫy scope:</strong> chọn một app quá lớn (một mạng xã hội đầy đủ, một chợ có thanh toán) đến mức Iteration 1 không có gì chạy. Chọn hẹp-nhưng-trọn: 3-4 thực thể, một tính năng lõi mạnh, làm tốt. Chiều sâu thắng chiều rộng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chọn đề tài có một tính năng khó, bảo vệ được.</b> "Viên ngọc" (vd không đặt trùng, không bán quá) là nơi bạn thể hiện kỹ thuật thật — validation, giao dịch, ca biên — và là thứ gây ấn tượng khi bảo vệ. Một app chỉ CRUD không có logic khó điểm thấp hơn dù bóng bẩy. <em>Ngoài syllabus, nhưng là lựa chọn nâng trần điểm nhiều nhất.</em></div>
</div>`,
        },
        {
          title: '0.6 — How not to fail & how to score high|||0.6 — Cách không trượt & cách ăn điểm cao',
          slug: 'wdp301-chong-truot-diem-cao',
          type: 'article',
          description: '7 kiểu mất điểm ở đồ án web + cờ xanh/đỏ theo iteration + công thức điểm cao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>7 ways teams lose points — and how to avoid each</h2>
<p class="lead">WDP301 rarely fails people for "not enough code." It fails them for <em>not integrating</em>, unclear ownership, or a demo that breaks. Here are the classic point-losers.</p>
<table>
<thead><tr><th>#</th><th>How you lose points</th><th>The fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>Frontend and backend never integrate</td><td>Ship a thin end-to-end slice in Iteration 1</td></tr>
<tr><td>2</td><td>One person coded everything (others can't defend)</td><td>Everyone owns & understands a real slice</td></tr>
<tr><td>3</td><td>All commits the night before the deadline</td><td>Steady, meaningful commits every iteration</td></tr>
<tr><td>4</td><td>No MVC/structure — spaghetti in one file</td><td>Layered structure: routes→controllers→services→models</td></tr>
<tr><td>5</td><td>No auth / broken security (secrets in client)</td><td>JWT + role middleware; keys server-side only</td></tr>
<tr><td>6</td><td>Live demo crashes, no backup</td><td>Seed data + a recorded backup video</td></tr>
<tr><td>7</td><td>Can't answer "how does your part work?"</td><td>Each member rehearses their slice's Q&A</td></tr>
</tbody>
</table>

<h3>Green flags / red flags by iteration</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Iter1 green</span> Requirements & ERD clear · repo set up · one feature works end-to-end.</div>
<div class="lz-layer"><span class="lz-lk">Iter1 red</span> Still designing in week 3 · nothing runs.</div>
<div class="lz-layer"><span class="lz-lk">Iter2 green</span> Auth works · several features integrated · everyone committing.</div>
<div class="lz-layer"><span class="lz-lk">Iter2 red</span> Frontend & backend still separate · one person's commits only.</div>
<div class="lz-layer"><span class="lz-lk">Iter3 green</span> Near-complete app · the core "gem" feature solid · clean structure.</div>
<div class="lz-layer"><span class="lz-lk">Iter3 red</span> Core feature buggy · no tests · messy code.</div>
<div class="lz-layer"><span class="lz-lk">Final green</span> Smooth demo · each member defends their slice · backup ready.</div>
<div class="lz-layer"><span class="lz-lk">Final red</span> Demo crashes · one person answers everything.</div>
</div>

<div class="callout ok"><strong>The high-mark formula.</strong> Grade = (integrated, running app) × (clean MVC structure) × (a solid core feature) × (every member owns & defends a slice) × (smooth demo). Nail all five and you're in 9-territory even with a modest topic.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Demo the "gem" and the sad paths.</b> Anyone can demo the happy path. Showing that your core feature <em>refuses</em> the invalid case ("watch — it blocks a double-booking") proves real engineering and wins the defense. Rehearse showing your validation and error handling, not just success. <em>Beyond the syllabus, but what separates a working demo from an impressive one.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>7 kiểu đội mất điểm — và cách tránh từng cái</h2>
<p class="lead">WDP301 hiếm khi đánh trượt vì "code chưa đủ". Nó đánh trượt vì <em>không tích hợp</em>, sở hữu không rõ, hoặc demo hỏng. Đây là các thủ phạm kinh điển.</p>
<table>
<thead><tr><th>#</th><th>Cách bạn mất điểm</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Frontend và backend không bao giờ tích hợp</td><td>Ship một lát cắt dọc mỏng trong Iteration 1</td></tr>
<tr><td>2</td><td>Một người code hết (người khác không bảo vệ được)</td><td>Mọi người sở hữu & hiểu một lát cắt thật</td></tr>
<tr><td>3</td><td>Mọi commit dồn đêm trước hạn nộp</td><td>Commit đều, có ý nghĩa mỗi iteration</td></tr>
<tr><td>4</td><td>Không MVC/cấu trúc — spaghetti trong một file</td><td>Cấu trúc theo lớp: routes→controllers→services→models</td></tr>
<tr><td>5</td><td>Không auth / bảo mật hỏng (khóa trong client)</td><td>JWT + middleware role; khóa chỉ ở server</td></tr>
<tr><td>6</td><td>Demo trực tiếp crash, không dự phòng</td><td>Seed data + một video quay dự phòng</td></tr>
<tr><td>7</td><td>Không trả lời được "phần của bạn chạy thế nào?"</td><td>Mỗi thành viên tập Q&A cho lát cắt của mình</td></tr>
</tbody>
</table>

<h3>Cờ xanh / cờ đỏ theo iteration</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Iter1 xanh</span> Yêu cầu & ERD rõ · repo dựng xong · một tính năng chạy end-to-end.</div>
<div class="lz-layer"><span class="lz-lk">Iter1 đỏ</span> Tuần 3 còn đang thiết kế · chưa gì chạy.</div>
<div class="lz-layer"><span class="lz-lk">Iter2 xanh</span> Auth chạy · vài tính năng tích hợp · mọi người commit.</div>
<div class="lz-layer"><span class="lz-lk">Iter2 đỏ</span> Frontend & backend vẫn tách rời · chỉ commit của một người.</div>
<div class="lz-layer"><span class="lz-lk">Iter3 xanh</span> App gần hoàn chỉnh · tính năng "viên ngọc" vững · cấu trúc sạch.</div>
<div class="lz-layer"><span class="lz-lk">Iter3 đỏ</span> Tính năng lõi lỗi · không test · code lộn xộn.</div>
<div class="lz-layer"><span class="lz-lk">Cuối xanh</span> Demo mượt · mỗi thành viên bảo vệ lát của mình · có dự phòng.</div>
<div class="lz-layer"><span class="lz-lk">Cuối đỏ</span> Demo crash · một người trả lời hết.</div>
</div>

<div class="callout ok"><strong>Công thức điểm cao.</strong> Điểm = (app tích hợp, chạy được) × (cấu trúc MVC sạch) × (một tính năng lõi vững) × (mọi thành viên sở hữu & bảo vệ một lát) × (demo mượt). Đủ cả năm là vùng 9 kể cả với đề tài khiêm tốn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Demo "viên ngọc" và cả đường buồn.</b> Ai cũng demo được happy path. Cho thấy tính năng lõi <em>từ chối</em> ca không hợp lệ ("xem này — nó chặn đặt trùng") chứng minh kỹ thuật thật và thắng phần bảo vệ. Tập trưng validation và xử lý lỗi, không chỉ thành công. <em>Ngoài syllabus, nhưng là điều tách một demo chạy được khỏi một demo ấn tượng.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — KHỞI TẠO: YÊU CẦU, KIẾN TRÚC & MVC ══════════════════ */
    {
      title: 'Chapter 1 — Initiation: requirements, architecture & MVC|||Chương 1 — Khởi tạo: yêu cầu, kiến trúc & MVC',
      description: 'Phân tích yêu cầu (actors, use cases, ERD), dựng repo MERN, và áp dụng mẫu MVC/lớp cho backend.',
      lessons: [
        {
          title: '1.1 — Requirements: actors, use cases & data model|||1.1 — Yêu cầu: actors, use case & mô hình dữ liệu',
          slug: 'wdp301-1-1-requirements',
          type: 'VIDEO',
          description: 'Xác định actors & chức năng, viết use case, và thiết kế mô hình dữ liệu (ERD) cho MongoDB.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Analyze before you code (CLO1)</h2>
<p class="lead">Iteration 1 begins with understanding <em>what</em> to build. Rushing to code without clear requirements is the #1 cause of a project that never integrates. Define actors, list their use cases, and design the data model first.</p>

<h3>Step 1 — Actors & their functions</h3>
<p>List every role that interacts with the system and what each can do. For a Clinic Booking app:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Patient</span> register/login · view doctors &amp; slots · book/cancel appointment · view own history.</div>
<div class="lz-layer"><span class="lz-lk">Receptionist</span> confirm/reject appointments · manage schedules · view all appointments.</div>
<div class="lz-layer"><span class="lz-lk">Admin</span> manage users, doctors, and reference data.</div>
</div>

<h3>Step 2 — Use cases (the CQ examiners ask)</h3>
<p>The syllabus's constructive questions start with <em>"Who will interact with your system? List actors with detailed functions."</em> Answer it as a use-case list: "As a Patient, I can book an available slot so that I get an appointment." Each use case becomes a screen + an API endpoint.</p>

<h3>Step 3 — The data model (ERD → MongoDB collections)</h3>
<div class="diagram">User (─&lt; role)      Doctor              Appointment
  _id                 _id                 _id
  name                name                patientId  ──▶ User
  email (unique)      specialty           doctorId   ──▶ Doctor
  passwordHash        Slot[]              slotId     (unique per booking)
  role                                    status</div>
<p>In MongoDB you model relationships either by <strong>referencing</strong> (store an ObjectId, like <code>patientId</code>) or <strong>embedding</strong> (nest a sub-document). Rule of thumb: embed data that's always read together and small; reference data that's large, shared, or grows unbounded.</p>

<div class="callout ok"><strong>Iteration-1 deliverable:</strong> a short requirements doc (actors + use cases), an ERD, and a chosen scope for Iteration 1 (the thin slice). This directly answers On-going Assessment 1 and CLO1.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Reference vs embed is a real design decision.</b> Embedding appointments inside a user doc seems simple until the array grows to thousands and every read drags it all in. Referencing keeps documents small and queryable. Choosing correctly is exactly the kind of design judgment that impresses in the defense. <em>Beyond the syllabus, but the MongoDB modeling call that separates a thoughtful schema from a naive one.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Phân tích trước khi code (CLO1)</h2>
<p class="lead">Iteration 1 bắt đầu bằng hiểu <em>xây gì</em>. Lao vào code khi chưa có yêu cầu rõ là nguyên nhân số 1 khiến dự án không bao giờ tích hợp. Xác định actors, liệt kê use case, và thiết kế mô hình dữ liệu trước.</p>

<h3>Bước 1 — Actors & chức năng của họ</h3>
<p>Liệt kê mọi vai tương tác với hệ thống và mỗi vai làm được gì. Với app Đặt lịch khám:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Bệnh nhân</span> đăng ký/đăng nhập · xem bác sĩ &amp; khung giờ · đặt/hủy lịch · xem lịch sử.</div>
<div class="lz-layer"><span class="lz-lk">Lễ tân</span> xác nhận/từ chối lịch · quản lý lịch làm · xem tất cả lịch hẹn.</div>
<div class="lz-layer"><span class="lz-lk">Admin</span> quản lý người dùng, bác sĩ, và dữ liệu tham chiếu.</div>
</div>

<h3>Bước 2 — Use case (câu hỏi CQ giám khảo hỏi)</h3>
<p>Câu hỏi constructive của syllabus mở đầu bằng <em>"Ai tương tác với hệ thống? Liệt kê actors với chức năng chi tiết."</em> Trả lời dưới dạng danh sách use case: "Là Bệnh nhân, tôi có thể đặt một khung giờ trống để có lịch hẹn." Mỗi use case thành một màn hình + một endpoint API.</p>

<h3>Bước 3 — Mô hình dữ liệu (ERD → collection MongoDB)</h3>
<div class="diagram">User (─&lt; role)      Doctor              Appointment
  _id                 _id                 _id
  name                name                patientId  ──▶ User
  email (unique)      specialty           doctorId   ──▶ Doctor
  passwordHash        Slot[]              slotId     (unique mỗi booking)
  role                                    status</div>
<p>Trong MongoDB bạn mô hình quan hệ bằng <strong>tham chiếu</strong> (lưu một ObjectId, như <code>patientId</code>) hoặc <strong>nhúng</strong> (lồng một sub-document). Nguyên tắc: nhúng dữ liệu luôn đọc cùng nhau và nhỏ; tham chiếu dữ liệu lớn, dùng chung, hoặc tăng không giới hạn.</p>

<div class="callout ok"><strong>Sản phẩm Iteration 1:</strong> một tài liệu yêu cầu ngắn (actors + use case), một ERD, và scope đã chọn cho Iteration 1 (lát cắt mỏng). Điều này trả lời trực tiếp On-going Assessment 1 và CLO1.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tham chiếu vs nhúng là một quyết định thiết kế thật.</b> Nhúng lịch hẹn vào tài liệu user trông đơn giản cho tới khi mảng lớn tới hàng nghìn và mỗi lần đọc kéo hết vào. Tham chiếu giữ tài liệu nhỏ và truy vấn được. Chọn đúng chính là kiểu phán đoán thiết kế gây ấn tượng khi bảo vệ. <em>Ngoài syllabus, nhưng là quyết định mô hình MongoDB tách một schema có suy nghĩ khỏi một schema ngây thơ.</em></div>
</div>`,
        },
        {
          title: '1.2 — Repo setup & the MVC / layered structure|||1.2 — Dựng repo & cấu trúc MVC / phân lớp',
          slug: 'wdp301-1-2-mvc-structure',
          type: 'VIDEO',
          description: 'Cấu trúc monorepo /server + /client, và áp dụng MVC/lớp cho Express (routes→controllers→services→models).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>MVC & a layered backend (CLO2)</h2>
<p class="lead">CLO2 requires you to apply the MVC pattern and OOP thinking. In a MERN app, the backend follows a clean layered structure so responsibilities don't tangle. This is what separates a maintainable project from spaghetti.</p>

<h3>Repo layout — a two-folder monorepo</h3>
<pre><code>project/
├── server/            # Express REST API
│   ├── src/
│   │   ├── models/        # Mongoose schemas (the "M")
│   │   ├── controllers/   # handle req/res (the "C")
│   │   ├── services/      # business logic
│   │   ├── routes/        # map URLs to controllers
│   │   ├── middlewares/   # auth, error handling
│   │   └── app.js
│   └── package.json
├── client/            # React SPA (the "V")
│   └── package.json
└── README.md          # how to run both</code></pre>

<h3>The request flow — layers each do one job</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Route</div><div class="lz-d">URL → controller</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Controller</div><div class="lz-d">parse req, call service, send res</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Service</div><div class="lz-d">business logic, rules</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Model</div><div class="lz-d">Mongoose ↔ MongoDB</div></div>
</div>

<h3>Worked example — a route → controller → service → model chain</h3>
<pre><code><span class="tok-comment">// routes/appointment.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> ctrl <span class="tok-keyword">from</span> <span class="tok-string">'../controllers/appointment.controller.js'</span>;
<span class="tok-keyword">const</span> r = Router();
r.get(<span class="tok-string">'/'</span>, ctrl.list);          <span class="tok-comment">// GET /api/appointments</span>
r.post(<span class="tok-string">'/'</span>, ctrl.create);        <span class="tok-comment">// POST /api/appointments</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> r;

<span class="tok-comment">// controllers/appointment.controller.js</span>
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> service <span class="tok-keyword">from</span> <span class="tok-string">'../services/appointment.service.js'</span>;
<span class="tok-keyword">export</span> <span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">list</span>(req, res, next) {
  <span class="tok-keyword">try</span> { res.json(<span class="tok-keyword">await</span> service.findAll()); }
  <span class="tok-keyword">catch</span> (e) { next(e); }
}</code></pre>

<div class="callout ok"><strong>Why layers matter:</strong> the controller never talks to the database directly, and the service never touches req/res. This separation means you can test business logic without HTTP, swap the DB without rewriting controllers, and — crucially — divide work cleanly among teammates.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The MVC on the frontend too.</b> React is the "View," but you can mirror the backend's discipline: components (view), hooks/services for API calls (controller-ish), and a client-side data layer (model-ish). Consistent structure on both sides makes the whole app easy to reason about. <em>Beyond the syllabus, but the symmetry that makes a full-stack app feel like one coherent system.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%201.2#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Practice REST API design on Code Lab</span><span class="lc-sub">Structure routes, controllers and resource design.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>MVC & backend phân lớp (CLO2)</h2>
<p class="lead">CLO2 yêu cầu bạn áp dụng mẫu MVC và tư duy OOP. Trong một app MERN, backend theo cấu trúc phân lớp gọn để trách nhiệm không rối. Đây là điều tách một dự án bảo trì được khỏi spaghetti.</p>

<h3>Bố cục repo — monorepo hai thư mục</h3>
<pre><code>project/
├── server/            # Express REST API
│   ├── src/
│   │   ├── models/        # schema Mongoose (chữ "M")
│   │   ├── controllers/   # xử lý req/res (chữ "C")
│   │   ├── services/      # logic nghiệp vụ
│   │   ├── routes/        # ánh xạ URL tới controller
│   │   ├── middlewares/   # auth, xử lý lỗi
│   │   └── app.js
│   └── package.json
├── client/            # React SPA (chữ "V")
│   └── package.json
└── README.md          # cách chạy cả hai</code></pre>

<h3>Luồng request — mỗi lớp làm một việc</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Route</div><div class="lz-d">URL → controller</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Controller</div><div class="lz-d">đọc req, gọi service, gửi res</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Service</div><div class="lz-d">logic nghiệp vụ, quy tắc</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Model</div><div class="lz-d">Mongoose ↔ MongoDB</div></div>
</div>

<h3>Ví dụ có lời giải — chuỗi route → controller → service → model</h3>
<pre><code><span class="tok-comment">// routes/appointment.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> ctrl <span class="tok-keyword">from</span> <span class="tok-string">'../controllers/appointment.controller.js'</span>;
<span class="tok-keyword">const</span> r = Router();
r.get(<span class="tok-string">'/'</span>, ctrl.list);          <span class="tok-comment">// GET /api/appointments</span>
r.post(<span class="tok-string">'/'</span>, ctrl.create);        <span class="tok-comment">// POST /api/appointments</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> r;

<span class="tok-comment">// controllers/appointment.controller.js</span>
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> service <span class="tok-keyword">from</span> <span class="tok-string">'../services/appointment.service.js'</span>;
<span class="tok-keyword">export</span> <span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">list</span>(req, res, next) {
  <span class="tok-keyword">try</span> { res.json(<span class="tok-keyword">await</span> service.findAll()); }
  <span class="tok-keyword">catch</span> (e) { next(e); }
}</code></pre>

<div class="callout ok"><strong>Vì sao phân lớp quan trọng:</strong> controller không bao giờ nói chuyện trực tiếp với CSDL, và service không bao giờ chạm req/res. Sự tách biệt này giúp bạn test logic nghiệp vụ không cần HTTP, đổi CSDL mà không viết lại controller, và — quan trọng — chia việc gọn cho đồng đội.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>MVC ở cả frontend.</b> React là "View", nhưng bạn có thể phản chiếu kỷ luật của backend: component (view), hook/service cho gọi API (kiểu controller), và một lớp dữ liệu phía client (kiểu model). Cấu trúc nhất quán ở cả hai phía khiến cả app dễ lý giải. <em>Ngoài syllabus, nhưng là sự đối xứng khiến một app full-stack cảm giác như một hệ thống mạch lạc.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%201.2#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Luyện thiết kế REST API trên Code Lab</span><span class="lc-sub">Cấu trúc routes, controllers và thiết kế resource.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The first thing to do in Iteration 1 (Initiation) is:|||Việc đầu tiên trong Iteration 1 (Khởi tạo) là:',
                options: [
                  'Write all the code immediately|||Viết hết code ngay',
                  'Analyze requirements: actors, use cases, data model|||Phân tích yêu cầu: actors, use case, mô hình dữ liệu',
                  'Deploy to production|||Triển khai production',
                  'Design the final logo|||Thiết kế logo cuối',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'In MERN, "M" (Model) is typically implemented with:|||Trong MERN, "M" (Model) thường được hiện thực bằng:',
                options: [
                  'React components|||Component React',
                  'Mongoose schemas over MongoDB|||Schema Mongoose trên MongoDB',
                  'Express routes|||Express routes',
                  'CSS files|||File CSS',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'In a layered backend, the controller should:|||Trong backend phân lớp, controller nên:',
                options: [
                  'Talk to the database directly|||Nói chuyện trực tiếp với CSDL',
                  'Parse the request, call a service, and send the response|||Đọc request, gọi service, và gửi response',
                  'Contain all business logic and DB queries|||Chứa toàn bộ logic nghiệp vụ và truy vấn DB',
                  'Render HTML|||Render HTML',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) In MongoDB, you should reference (not embed) data when it is:|||(Ngoài giáo trình) Trong MongoDB, nên tham chiếu (không nhúng) dữ liệu khi nó:',
                options: [
                  'Tiny and always read together|||Rất nhỏ và luôn đọc cùng nhau',
                  'Large, shared, or grows unbounded|||Lớn, dùng chung, hoặc tăng không giới hạn',
                  'Never queried|||Không bao giờ truy vấn',
                  'A single boolean|||Một boolean đơn',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — BACKEND: EXPRESS + MONGODB ══════════════════ */
    {
      title: 'Chapter 2 — Backend: Express REST API + MongoDB|||Chương 2 — Backend: Express REST API + MongoDB',
      description: 'Dựng Express app, mô hình dữ liệu bằng Mongoose, và viết CRUD endpoint theo lớp với validation.',
      lessons: [
        {
          title: '2.1 — Express app, Mongoose model & CRUD|||2.1 — Express app, model Mongoose & CRUD',
          slug: 'wdp301-2-1-express-crud',
          type: 'VIDEO',
          description: 'Khởi tạo Express, kết nối MongoDB, định nghĩa schema Mongoose, và viết CRUD endpoint đầu tiên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Build the REST API (CLO3)</h2>
<p class="lead">The backend exposes your data as JSON over HTTP. Here's the minimal skeleton: an Express app, a MongoDB connection, a Mongoose model, and a CRUD controller — the pattern you'll repeat for every entity.</p>

<h3>The Express entry point</h3>
<pre><code><span class="tok-comment">// server/src/app.js</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> mongoose <span class="tok-keyword">from</span> <span class="tok-string">'mongoose'</span>;
<span class="tok-keyword">import</span> appointmentRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/appointment.routes.js'</span>;

<span class="tok-keyword">const</span> app = express();
app.use(express.json());                       <span class="tok-comment">// parse JSON bodies</span>
app.use(<span class="tok-string">'/api/appointments'</span>, appointmentRoutes);

<span class="tok-keyword">await</span> mongoose.connect(process.env.MONGO_URI); <span class="tok-comment">// connect to MongoDB</span>
app.listen(<span class="tok-number">5000</span>, () => console.log(<span class="tok-string">'API on :5000'</span>));</code></pre>

<h3>A Mongoose model</h3>
<pre><code><span class="tok-comment">// server/src/models/appointment.model.js</span>
<span class="tok-keyword">import</span> mongoose <span class="tok-keyword">from</span> <span class="tok-string">'mongoose'</span>;
<span class="tok-keyword">const</span> schema = <span class="tok-keyword">new</span> mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: <span class="tok-string">'User'</span>, required: <span class="tok-keyword">true</span> },
  doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: <span class="tok-string">'Doctor'</span>, required: <span class="tok-keyword">true</span> },
  slotId:    { type: String, required: <span class="tok-keyword">true</span> },
  status:    { type: String, enum: [<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>, <span class="tok-string">'CANCELLED'</span>], default: <span class="tok-string">'PENDING'</span> },
}, { timestamps: <span class="tok-keyword">true</span> });
schema.index({ slotId: <span class="tok-number">1</span> }, { unique: <span class="tok-keyword">true</span> }); <span class="tok-comment">// no double-booking a slot</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> mongoose.model(<span class="tok-string">'Appointment'</span>, schema);</code></pre>

<h3>The service (business logic) & controller</h3>
<pre><code><span class="tok-comment">// services/appointment.service.js</span>
<span class="tok-keyword">import</span> Appointment <span class="tok-keyword">from</span> <span class="tok-string">'../models/appointment.model.js'</span>;
<span class="tok-keyword">export</span> <span class="tok-keyword">const</span> findAll = () => Appointment.find().populate(<span class="tok-string">'doctorId'</span>);
<span class="tok-keyword">export</span> <span class="tok-keyword">const</span> create  = (data) => Appointment.create(data);</code></pre>

<div class="callout ok"><strong>The CRUD pattern repeats:</strong> for each entity you write one model, one service, one controller, one route file. Once you've done Appointment, User and Doctor follow the same shape — which is exactly how you split work across teammates.</div>

<div class="pitfall"><strong>Trap:</strong> putting DB queries directly in route handlers. It works for one endpoint, then becomes unmaintainable. Keep the layers: routes call controllers, controllers call services, services use models.</div>

<a class="link-card codelab" href="/code-lab/mongodb?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%202.1#module-416" target="_blank" rel="noopener">
  <span class="lc-ico">🍃</span>
  <span class="lc-body"><span class="lc-title">Practice Mongoose schemas on Code Lab</span><span class="lc-sub">Model collections, validation and indexes.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Xây REST API (CLO3)</h2>
<p class="lead">Backend phơi dữ liệu của bạn dưới dạng JSON qua HTTP. Đây là khung tối thiểu: một Express app, một kết nối MongoDB, một model Mongoose, và một controller CRUD — mẫu bạn lặp cho mọi thực thể.</p>

<h3>Điểm vào Express</h3>
<pre><code><span class="tok-comment">// server/src/app.js</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> mongoose <span class="tok-keyword">from</span> <span class="tok-string">'mongoose'</span>;
<span class="tok-keyword">import</span> appointmentRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/appointment.routes.js'</span>;

<span class="tok-keyword">const</span> app = express();
app.use(express.json());                       <span class="tok-comment">// đọc body JSON</span>
app.use(<span class="tok-string">'/api/appointments'</span>, appointmentRoutes);

<span class="tok-keyword">await</span> mongoose.connect(process.env.MONGO_URI); <span class="tok-comment">// kết nối MongoDB</span>
app.listen(<span class="tok-number">5000</span>, () => console.log(<span class="tok-string">'API on :5000'</span>));</code></pre>

<h3>Một model Mongoose</h3>
<pre><code><span class="tok-comment">// server/src/models/appointment.model.js</span>
<span class="tok-keyword">import</span> mongoose <span class="tok-keyword">from</span> <span class="tok-string">'mongoose'</span>;
<span class="tok-keyword">const</span> schema = <span class="tok-keyword">new</span> mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: <span class="tok-string">'User'</span>, required: <span class="tok-keyword">true</span> },
  doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: <span class="tok-string">'Doctor'</span>, required: <span class="tok-keyword">true</span> },
  slotId:    { type: String, required: <span class="tok-keyword">true</span> },
  status:    { type: String, enum: [<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>, <span class="tok-string">'CANCELLED'</span>], default: <span class="tok-string">'PENDING'</span> },
}, { timestamps: <span class="tok-keyword">true</span> });
schema.index({ slotId: <span class="tok-number">1</span> }, { unique: <span class="tok-keyword">true</span> }); <span class="tok-comment">// không đặt trùng một khung giờ</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> mongoose.model(<span class="tok-string">'Appointment'</span>, schema);</code></pre>

<h3>Service (logic nghiệp vụ) & controller</h3>
<pre><code><span class="tok-comment">// services/appointment.service.js</span>
<span class="tok-keyword">import</span> Appointment <span class="tok-keyword">from</span> <span class="tok-string">'../models/appointment.model.js'</span>;
<span class="tok-keyword">export</span> <span class="tok-keyword">const</span> findAll = () => Appointment.find().populate(<span class="tok-string">'doctorId'</span>);
<span class="tok-keyword">export</span> <span class="tok-keyword">const</span> create  = (data) => Appointment.create(data);</code></pre>

<div class="callout ok"><strong>Mẫu CRUD lặp lại:</strong> với mỗi thực thể bạn viết một model, một service, một controller, một file route. Xong Appointment rồi thì User và Doctor theo cùng hình dạng — chính là cách bạn chia việc cho đồng đội.</div>

<div class="pitfall"><strong>Bẫy:</strong> đặt truy vấn DB thẳng trong route handler. Chạy được với một endpoint, rồi thành không bảo trì được. Giữ các lớp: route gọi controller, controller gọi service, service dùng model.</div>

<a class="link-card codelab" href="/code-lab/mongodb?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%202.1#module-416" target="_blank" rel="noopener">
  <span class="lc-ico">🍃</span>
  <span class="lc-body"><span class="lc-title">Luyện schema Mongoose trên Code Lab</span><span class="lc-sub">Mô hình collection, validation và index.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'express.json() middleware is needed to:|||Middleware express.json() cần để:',
                options: [
                  'Serve HTML files|||Phục vụ file HTML',
                  'Parse incoming JSON request bodies|||Đọc body request JSON đến',
                  'Connect to MongoDB|||Kết nối MongoDB',
                  'Render React|||Render React',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'A unique index on slotId in the Appointment schema ensures:|||Một index unique trên slotId trong schema Appointment đảm bảo:',
                options: [
                  'Faster React rendering|||Render React nhanh hơn',
                  'No two appointments can book the same slot|||Không hai lịch hẹn nào đặt trùng một khung giờ',
                  'Smaller documents|||Tài liệu nhỏ hơn',
                  'Automatic login|||Tự động đăng nhập',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'populate() in Mongoose is used to:|||populate() trong Mongoose dùng để:',
                options: [
                  'Delete documents|||Xóa tài liệu',
                  'Resolve a referenced ObjectId into the full linked document|||Phân giải một ObjectId tham chiếu thành tài liệu liên kết đầy đủ',
                  'Encrypt passwords|||Mã hóa mật khẩu',
                  'Start the server|||Khởi động server',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'The recommended place for DB queries is:|||Chỗ được khuyến nghị đặt truy vấn DB là:',
                options: [
                  'Inside route handlers|||Trong route handler',
                  'In the service/model layer, not in routes|||Trong lớp service/model, không trong route',
                  'In React components|||Trong component React',
                  'In CSS|||Trong CSS',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — AUTH & PHÂN QUYỀN (JWT) ══════════════════ */
    {
      title: 'Chapter 3 — Authentication & authorization (JWT)|||Chương 3 — Xác thực & phân quyền (JWT)',
      description: 'Đăng ký/đăng nhập với mật khẩu băm, phát JWT, middleware xác thực, và phân quyền theo role.',
      lessons: [
        {
          title: '3.1 — Register, login, JWT & role-based access|||3.1 — Đăng ký, đăng nhập, JWT & phân quyền role',
          slug: 'wdp301-3-1-auth-jwt',
          type: 'VIDEO',
          description: 'Băm mật khẩu (bcrypt), phát & xác minh JWT, middleware bảo vệ route, và kiểm tra role.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Secure the API with JWT (CLO3)</h2>
<p class="lead">Almost every project needs users, login, and roles. The standard MERN approach: hash passwords with <strong>bcrypt</strong>, issue a <strong>JWT</strong> on login, verify it in a middleware, and check the user's <strong>role</strong> for protected actions.</p>

<h3>Register & login</h3>
<pre><code><span class="tok-comment">// services/auth.service.js</span>
<span class="tok-keyword">import</span> bcrypt <span class="tok-keyword">from</span> <span class="tok-string">'bcryptjs'</span>;
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">import</span> User <span class="tok-keyword">from</span> <span class="tok-string">'../models/user.model.js'</span>;

<span class="tok-keyword">export</span> <span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">register</span>({ name, email, password }) {
  <span class="tok-keyword">const</span> passwordHash = <span class="tok-keyword">await</span> bcrypt.hash(password, <span class="tok-number">10</span>);
  <span class="tok-keyword">return</span> User.create({ name, email, passwordHash, role: <span class="tok-string">'PATIENT'</span> });
}

<span class="tok-keyword">export</span> <span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">login</span>({ email, password }) {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> User.findOne({ email });
  <span class="tok-keyword">if</span> (!user || !(<span class="tok-keyword">await</span> bcrypt.compare(password, user.passwordHash)))
    <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> Error(<span class="tok-string">'Invalid credentials'</span>);
  <span class="tok-keyword">const</span> token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: <span class="tok-string">'7d'</span> });
  <span class="tok-keyword">return</span> { token, user };
}</code></pre>

<h3>Auth middleware & role guard</h3>
<pre><code><span class="tok-comment">// middlewares/auth.js</span>
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">auth</span>(req, res, next) {
  <span class="tok-keyword">const</span> token = (req.headers.authorization || <span class="tok-string">''</span>).replace(<span class="tok-string">'Bearer '</span>, <span class="tok-string">''</span>);
  <span class="tok-keyword">try</span> { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  <span class="tok-keyword">catch</span> { res.status(<span class="tok-number">401</span>).json({ message: <span class="tok-string">'Unauthorized'</span> }); }
}
<span class="tok-keyword">export</span> <span class="tok-keyword">const</span> requireRole = (role) => (req, res, next) =>
  req.user?.role === role ? next() : res.status(<span class="tok-number">403</span>).json({ message: <span class="tok-string">'Forbidden'</span> });</code></pre>
<pre><code><span class="tok-comment">// usage in a route: only a receptionist can confirm</span>
r.patch(<span class="tok-string">'/:id/confirm'</span>, auth, requireRole(<span class="tok-string">'RECEPTIONIST'</span>), ctrl.confirm);</code></pre>

<div class="callout ok"><strong>The security rule that saves your grade:</strong> the JWT secret and all keys live <em>only</em> on the server (in env vars), never in the React client bundle. 401 = not logged in; 403 = logged in but not allowed. Getting these status codes right is a defense favorite.</div>

<div class="pitfall"><strong>Trap:</strong> storing plain passwords or putting the JWT secret in frontend code. Both are instant red flags in the security part of the defense. Always hash with bcrypt; keep secrets server-side.</div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%203.1#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Practice JWT auth on Code Lab</span><span class="lc-sub">Hashing, tokens, middleware and role-based access.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Bảo mật API bằng JWT (CLO3)</h2>
<p class="lead">Hầu như dự án nào cũng cần user, đăng nhập, và role. Cách MERN chuẩn: băm mật khẩu bằng <strong>bcrypt</strong>, phát một <strong>JWT</strong> khi đăng nhập, xác minh nó trong một middleware, và kiểm tra <strong>role</strong> của user cho các hành động được bảo vệ.</p>

<h3>Đăng ký & đăng nhập</h3>
<pre><code><span class="tok-comment">// services/auth.service.js</span>
<span class="tok-keyword">import</span> bcrypt <span class="tok-keyword">from</span> <span class="tok-string">'bcryptjs'</span>;
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">import</span> User <span class="tok-keyword">from</span> <span class="tok-string">'../models/user.model.js'</span>;

<span class="tok-keyword">export</span> <span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">register</span>({ name, email, password }) {
  <span class="tok-keyword">const</span> passwordHash = <span class="tok-keyword">await</span> bcrypt.hash(password, <span class="tok-number">10</span>);
  <span class="tok-keyword">return</span> User.create({ name, email, passwordHash, role: <span class="tok-string">'PATIENT'</span> });
}

<span class="tok-keyword">export</span> <span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">login</span>({ email, password }) {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> User.findOne({ email });
  <span class="tok-keyword">if</span> (!user || !(<span class="tok-keyword">await</span> bcrypt.compare(password, user.passwordHash)))
    <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> Error(<span class="tok-string">'Invalid credentials'</span>);
  <span class="tok-keyword">const</span> token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: <span class="tok-string">'7d'</span> });
  <span class="tok-keyword">return</span> { token, user };
}</code></pre>

<h3>Middleware auth & guard role</h3>
<pre><code><span class="tok-comment">// middlewares/auth.js</span>
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">auth</span>(req, res, next) {
  <span class="tok-keyword">const</span> token = (req.headers.authorization || <span class="tok-string">''</span>).replace(<span class="tok-string">'Bearer '</span>, <span class="tok-string">''</span>);
  <span class="tok-keyword">try</span> { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  <span class="tok-keyword">catch</span> { res.status(<span class="tok-number">401</span>).json({ message: <span class="tok-string">'Unauthorized'</span> }); }
}
<span class="tok-keyword">export</span> <span class="tok-keyword">const</span> requireRole = (role) => (req, res, next) =>
  req.user?.role === role ? next() : res.status(<span class="tok-number">403</span>).json({ message: <span class="tok-string">'Forbidden'</span> });</code></pre>
<pre><code><span class="tok-comment">// dùng trong route: chỉ lễ tân được xác nhận</span>
r.patch(<span class="tok-string">'/:id/confirm'</span>, auth, requireRole(<span class="tok-string">'RECEPTIONIST'</span>), ctrl.confirm);</code></pre>

<div class="callout ok"><strong>Quy tắc bảo mật cứu điểm bạn:</strong> JWT secret và mọi khóa chỉ sống <em>trên server</em> (trong env var), không bao giờ trong bundle React client. 401 = chưa đăng nhập; 403 = đã đăng nhập nhưng không được phép. Trả đúng các status code này là món khoái khẩu khi bảo vệ.</div>

<div class="pitfall"><strong>Bẫy:</strong> lưu mật khẩu thô hoặc để JWT secret trong code frontend. Cả hai là cờ đỏ tức thì ở phần bảo mật khi bảo vệ. Luôn băm bằng bcrypt; giữ secret ở server.</div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%203.1#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Luyện auth JWT trên Code Lab</span><span class="lc-sub">Băm, token, middleware và phân quyền role.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Passwords should be stored as:|||Mật khẩu nên được lưu dưới dạng:',
                options: [
                  'Plain text|||Văn bản thô',
                  'A bcrypt hash|||Một hash bcrypt',
                  'In the JWT|||Trong JWT',
                  'In the React client|||Trong client React',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'A 401 status code means:|||Status code 401 nghĩa là:',
                options: [
                  'Logged in but not allowed|||Đã đăng nhập nhưng không được phép',
                  'Not authenticated (not logged in)|||Chưa xác thực (chưa đăng nhập)',
                  'Server error|||Lỗi server',
                  'Success|||Thành công',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A 403 status code means:|||Status code 403 nghĩa là:',
                options: [
                  'Not logged in|||Chưa đăng nhập',
                  'Authenticated but forbidden (role not allowed)|||Đã xác thực nhưng bị cấm (role không được phép)',
                  'Page not found|||Không tìm thấy trang',
                  'Success|||Thành công',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'The JWT secret must be stored:|||JWT secret phải được lưu:',
                options: [
                  'In the React client bundle|||Trong bundle React client',
                  'Only server-side, in environment variables|||Chỉ phía server, trong biến môi trường',
                  'In a public GitHub repo|||Trong repo GitHub công khai',
                  'In the URL|||Trong URL',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — FRONTEND: REACT SPA ══════════════════ */
    {
      title: 'Chapter 4 — Frontend: React SPA|||Chương 4 — Frontend: React SPA',
      description: 'React routing, gọi API bằng axios với interceptor gắn token, quản lý state, và form + xử lý lỗi 4xx.',
      lessons: [
        {
          title: '4.1 — React routing, axios & calling the API|||4.1 — React routing, axios & gọi API',
          slug: 'wdp301-4-1-react-api',
          type: 'VIDEO',
          description: 'Cấu trúc React app, gọi API bằng axios interceptor gắn JWT, hiển thị dữ liệu và xử lý lỗi 401/409.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The React SPA consumes the API (CLO3)</h2>
<p class="lead">The frontend is a React Single-Page App that talks to your Express API over HTTP using <strong>axios</strong>. The key pieces: a central API client that attaches the JWT, components that fetch and render data, and forms that handle errors gracefully.</p>

<h3>A central axios client with an auth interceptor</h3>
<pre><code><span class="tok-comment">// client/src/api.js</span>
<span class="tok-keyword">import</span> axios <span class="tok-keyword">from</span> <span class="tok-string">'axios'</span>;
<span class="tok-keyword">const</span> api = axios.create({ baseURL: <span class="tok-string">'/api'</span> });
api.interceptors.request.use((cfg) => {
  <span class="tok-keyword">const</span> token = localStorage.getItem(<span class="tok-string">'token'</span>);
  <span class="tok-keyword">if</span> (token) cfg.headers.Authorization = &#96;Bearer \${token}&#96;;
  <span class="tok-keyword">return</span> cfg;
});
<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> api;</code></pre>

<h3>A component that fetches & renders</h3>
<pre><code><span class="tok-comment">// client/src/pages/Appointments.jsx</span>
<span class="tok-keyword">import</span> { useEffect, useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">import</span> api <span class="tok-keyword">from</span> <span class="tok-string">'../api'</span>;

<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> <span class="tok-keyword">function</span> <span class="tok-function">Appointments</span>() {
  <span class="tok-keyword">const</span> [items, setItems] = useState([]);
  useEffect(() => {
    api.get(<span class="tok-string">'/appointments'</span>).then((res) => setItems(res.data));
  }, []);
  <span class="tok-keyword">return</span> (
    &lt;ul&gt;{items.map((a) => &lt;li key={a._id}&gt;{a.slotId} — {a.status}&lt;/li&gt;)}&lt;/ul&gt;
  );
}</code></pre>

<h3>Handling errors from the API</h3>
<pre><code>api.post(<span class="tok-string">'/appointments'</span>, form)
  .then(() => toast(<span class="tok-string">'Booked!'</span>))
  .catch((err) => {
    <span class="tok-keyword">if</span> (err.response?.status === <span class="tok-number">409</span>) toast(<span class="tok-string">'That slot is already taken'</span>); <span class="tok-comment">// conflict</span>
    <span class="tok-keyword">else</span> <span class="tok-keyword">if</span> (err.response?.status === <span class="tok-number">401</span>) redirectToLogin();
    <span class="tok-keyword">else</span> toast(<span class="tok-string">'Something went wrong'</span>);
  });</code></pre>

<div class="callout ok"><strong>The integration that earns Iteration-1 marks:</strong> a real end-to-end flow — the React form calls the API, the API writes to MongoDB, and the list re-renders with the new item. That thin vertical slice, running live, is worth more than a dozen polished-but-disconnected screens.</div>

<div class="pitfall"><strong>Trap:</strong> forgetting to handle the "sad paths" — a 409 (slot taken) or 401 (session expired) that crashes the UI. Good error handling on the frontend is exactly what makes your demo look professional.</div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%204.1#module-369" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Practice React data fetching on Code Lab</span><span class="lc-sub">useEffect, state, and calling APIs.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>React SPA tiêu thụ API (CLO3)</h2>
<p class="lead">Frontend là một React Single-Page App nói chuyện với Express API qua HTTP bằng <strong>axios</strong>. Các mảnh then chốt: một API client trung tâm gắn JWT, các component fetch và render dữ liệu, và form xử lý lỗi mượt mà.</p>

<h3>Một axios client trung tâm với interceptor auth</h3>
<pre><code><span class="tok-comment">// client/src/api.js</span>
<span class="tok-keyword">import</span> axios <span class="tok-keyword">from</span> <span class="tok-string">'axios'</span>;
<span class="tok-keyword">const</span> api = axios.create({ baseURL: <span class="tok-string">'/api'</span> });
api.interceptors.request.use((cfg) => {
  <span class="tok-keyword">const</span> token = localStorage.getItem(<span class="tok-string">'token'</span>);
  <span class="tok-keyword">if</span> (token) cfg.headers.Authorization = &#96;Bearer \${token}&#96;;
  <span class="tok-keyword">return</span> cfg;
});
<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> api;</code></pre>

<h3>Một component fetch & render</h3>
<pre><code><span class="tok-comment">// client/src/pages/Appointments.jsx</span>
<span class="tok-keyword">import</span> { useEffect, useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">import</span> api <span class="tok-keyword">from</span> <span class="tok-string">'../api'</span>;

<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> <span class="tok-keyword">function</span> <span class="tok-function">Appointments</span>() {
  <span class="tok-keyword">const</span> [items, setItems] = useState([]);
  useEffect(() => {
    api.get(<span class="tok-string">'/appointments'</span>).then((res) => setItems(res.data));
  }, []);
  <span class="tok-keyword">return</span> (
    &lt;ul&gt;{items.map((a) => &lt;li key={a._id}&gt;{a.slotId} — {a.status}&lt;/li&gt;)}&lt;/ul&gt;
  );
}</code></pre>

<h3>Xử lý lỗi từ API</h3>
<pre><code>api.post(<span class="tok-string">'/appointments'</span>, form)
  .then(() => toast(<span class="tok-string">'Đã đặt!'</span>))
  .catch((err) => {
    <span class="tok-keyword">if</span> (err.response?.status === <span class="tok-number">409</span>) toast(<span class="tok-string">'Khung giờ đã có người đặt'</span>); <span class="tok-comment">// xung đột</span>
    <span class="tok-keyword">else</span> <span class="tok-keyword">if</span> (err.response?.status === <span class="tok-number">401</span>) redirectToLogin();
    <span class="tok-keyword">else</span> toast(<span class="tok-string">'Có lỗi xảy ra'</span>);
  });</code></pre>

<div class="callout ok"><strong>Sự tích hợp ăn điểm Iteration 1:</strong> một luồng end-to-end thật — form React gọi API, API ghi vào MongoDB, và danh sách render lại với món mới. Lát cắt dọc mỏng đó, chạy trực tiếp, đáng giá hơn cả chục màn hình bóng bẩy nhưng rời rạc.</div>

<div class="pitfall"><strong>Bẫy:</strong> quên xử lý "đường buồn" — một 409 (khung giờ đã đặt) hoặc 401 (hết phiên) làm crash UI. Xử lý lỗi tốt ở frontend chính là thứ khiến demo của bạn trông chuyên nghiệp.</div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%204.1#module-369" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Luyện fetch dữ liệu React trên Code Lab</span><span class="lc-sub">useEffect, state, và gọi API.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'An axios request interceptor is a good place to:|||Một interceptor request của axios là nơi tốt để:',
                options: [
                  'Render components|||Render component',
                  'Attach the JWT to the Authorization header|||Gắn JWT vào header Authorization',
                  'Define MongoDB schemas|||Định nghĩa schema MongoDB',
                  'Style the page|||Tạo kiểu trang',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'In React, fetching data when a component mounts is done with:|||Trong React, fetch dữ liệu khi component mount được làm bằng:',
                options: [
                  'A CSS rule|||Một quy tắc CSS',
                  'useEffect with an empty dependency array|||useEffect với mảng phụ thuộc rỗng',
                  'A Mongoose model|||Một model Mongoose',
                  'An Express route|||Một route Express',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A 409 response when booking usually means:|||Một response 409 khi đặt lịch thường nghĩa là:',
                options: [
                  'Server crashed|||Server sập',
                  'Conflict — the slot is already taken|||Xung đột — khung giờ đã có người đặt',
                  'Not logged in|||Chưa đăng nhập',
                  'Success|||Thành công',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'The most valuable Iteration-1 deliverable is:|||Sản phẩm Iteration-1 giá trị nhất là:',
                options: [
                  'Many polished but disconnected screens|||Nhiều màn hình bóng bẩy nhưng rời rạc',
                  'One thin end-to-end slice that runs (form → API → DB → list)|||Một lát cắt dọc mỏng chạy được (form → API → DB → danh sách)',
                  'A finished logo|||Một logo hoàn thiện',
                  'Only the database|||Chỉ CSDL',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — TÍNH NĂNG LÕI END-TO-END ══════════════════ */
    {
      title: 'Chapter 5 — The core feature, end-to-end|||Chương 5 — Tính năng lõi, end-to-end',
      description: 'Xây "viên ngọc" của đồ án — một tính năng mang logic thật (vd chống đặt trùng) từ DB tới UI, có validation & ca biên.',
      lessons: [
        {
          title: '5.1 — Build the "gem" feature with real logic|||5.1 — Xây tính năng "viên ngọc" có logic thật',
          slug: 'wdp301-5-1-core-feature',
          type: 'VIDEO',
          description: 'Chọn & xây tính năng lõi mang logic thật (ràng buộc, validation, ca biên) — thứ ghi điểm khi bảo vệ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Every project needs one feature that carries real logic</h2>
<p class="lead">A CRUD-only app is forgettable. What impresses examiners is <strong>one core feature with genuine engineering</strong> — a rule the system must enforce correctly even under edge cases. For a booking app, that's "no double-booking a slot"; for a store, "no overselling stock". This is your "gem".</p>

<h3>Anatomy of the gem — the booking core</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Validate</div><div class="lz-d">slot exists & is in the future</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Enforce rule</div><div class="lz-d">unique index blocks duplicates</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Handle conflict</div><div class="lz-d">return 409, not a 500</div></div>
</div>

<h3>Worked example — book a slot, block duplicates</h3>
<pre><code><span class="tok-comment">// services/appointment.service.js</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">book</span>({ patientId, doctorId, slotId }) {
  <span class="tok-keyword">const</span> slot = <span class="tok-keyword">await</span> Slot.findById(slotId);
  <span class="tok-keyword">if</span> (!slot || slot.startsAt &lt; Date.now())
    <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> AppError(<span class="tok-number">400</span>, <span class="tok-string">'Slot invalid or in the past'</span>);
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">return</span> <span class="tok-keyword">await</span> Appointment.create({ patientId, doctorId, slotId });
  } <span class="tok-keyword">catch</span> (e) {
    <span class="tok-keyword">if</span> (e.code === <span class="tok-number">11000</span>)                 <span class="tok-comment">// duplicate key (unique index)</span>
      <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> AppError(<span class="tok-number">409</span>, <span class="tok-string">'Slot already booked'</span>);
    <span class="tok-keyword">throw</span> e;
  }
}</code></pre>
<p>The unique index on <code>slotId</code> is the real guarantee — even if two requests arrive at the same instant, the database rejects the second with error <code>11000</code>, which you translate into a clean <strong>409 Conflict</strong>. The frontend (Ch4) already shows a friendly "slot taken" message. That's a correct, defensible feature.</p>

<div class="callout ok"><strong>Why this wins the defense:</strong> you can demo the happy path (booking works) AND the sad path (a second booking is blocked with a clear message). Showing the rule <em>enforced</em>, not just described, proves real engineering — the single strongest thing in your final presentation.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Two requests at once — the concurrency case.</b> The truly rigorous version proves it under <em>simultaneous</em> requests (e.g. fire two bookings with Promise.all in a test and assert only one succeeds). The unique index makes this correct at the database level, not just in app code. Demonstrating this is a standout move. <em>Beyond the syllabus, but the difference between "it usually works" and "it is correct."</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Mọi đồ án cần một tính năng mang logic thật</h2>
<p class="lead">Một app chỉ CRUD thì dễ quên. Điều gây ấn tượng với giám khảo là <strong>một tính năng lõi có kỹ thuật thật</strong> — một quy tắc hệ thống phải áp đúng kể cả trong ca biên. Với app đặt lịch, đó là "không đặt trùng một khung giờ"; với cửa hàng, "không bán quá kho". Đây là "viên ngọc" của bạn.</p>

<h3>Giải phẫu viên ngọc — lõi đặt lịch</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Validate</div><div class="lz-d">khung giờ tồn tại & ở tương lai</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Áp quy tắc</div><div class="lz-d">unique index chặn trùng</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Xử lý xung đột</div><div class="lz-d">trả 409, không phải 500</div></div>
</div>

<h3>Ví dụ có lời giải — đặt một khung giờ, chặn trùng</h3>
<pre><code><span class="tok-comment">// services/appointment.service.js</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">book</span>({ patientId, doctorId, slotId }) {
  <span class="tok-keyword">const</span> slot = <span class="tok-keyword">await</span> Slot.findById(slotId);
  <span class="tok-keyword">if</span> (!slot || slot.startsAt &lt; Date.now())
    <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> AppError(<span class="tok-number">400</span>, <span class="tok-string">'Slot invalid or in the past'</span>);
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">return</span> <span class="tok-keyword">await</span> Appointment.create({ patientId, doctorId, slotId });
  } <span class="tok-keyword">catch</span> (e) {
    <span class="tok-keyword">if</span> (e.code === <span class="tok-number">11000</span>)                 <span class="tok-comment">// trùng khóa (unique index)</span>
      <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> AppError(<span class="tok-number">409</span>, <span class="tok-string">'Slot already booked'</span>);
    <span class="tok-keyword">throw</span> e;
  }
}</code></pre>
<p>Unique index trên <code>slotId</code> là bảo đảm thật — kể cả khi hai request tới cùng lúc, CSDL từ chối cái thứ hai với lỗi <code>11000</code>, mà bạn dịch thành một <strong>409 Conflict</strong> gọn ghẽ. Frontend (Ch4) đã hiện thông báo thân thiện "khung giờ đã đặt". Đó là một tính năng đúng, bảo vệ được.</p>

<div class="callout ok"><strong>Vì sao điều này thắng phần bảo vệ:</strong> bạn demo được cả happy path (đặt được) LẪN sad path (lần đặt thứ hai bị chặn với thông báo rõ). Cho thấy quy tắc <em>được áp</em>, không chỉ mô tả, chứng minh kỹ thuật thật — thứ mạnh nhất trong thuyết trình cuối.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai request cùng lúc — ca tương tranh.</b> Phiên bản thật sự chặt chẽ chứng minh nó dưới request <em>đồng thời</em> (vd bắn hai booking bằng Promise.all trong một test và khẳng định chỉ một thành công). Unique index làm điều này đúng ở tầng CSDL, không chỉ trong code app. Trưng điều này là một nước đi nổi bật. <em>Ngoài syllabus, nhưng là khác biệt giữa "thường thì chạy" và "nó đúng".</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — GIT WORKFLOW & ITERATION ══════════════════ */
    {
      title: 'Chapter 6 — Git workflow, iterations & teamwork|||Chương 6 — Git workflow, iteration & làm việc nhóm',
      description: 'Chia việc theo iteration (Scrum-lite), Git branching & pull request, và theo dõi issue trên GitLab (CLO4).',
      lessons: [
        {
          title: '6.1 — Branches, pull requests & iterations|||6.1 — Branch, pull request & iteration',
          slug: 'wdp301-6-1-git-iterations',
          type: 'VIDEO',
          description: 'Feature-branch workflow, pull request & code review, chia việc theo iteration và theo dõi issue.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Professional teamwork is half your grade (CLO4)</h2>
<p class="lead">WDP301 grades <em>how</em> you work, not just what you build. The syllabus requires GitLab collaboration. A clean Git workflow + iteration rhythm is what makes 3-5 people build one app without chaos — and it's visible evidence in every assessment.</p>

<h3>The feature-branch workflow</h3>
<div class="diagram">main  ●───────●───────●   (always working, protected)
        \\     / \\     /
feature  ●──●   ●──●        each feature on its own branch
       "auth"  "booking"    → Pull Request → review → merge</div>
<pre><code><span class="tok-comment"># each member, per feature</span>
git checkout -b feature/booking-core
<span class="tok-comment"># ...commit small, meaningful changes...</span>
git push -u origin feature/booking-core
<span class="tok-comment"># open a Pull Request on GitLab → teammate reviews → merge to main</span></code></pre>

<h3>Iteration rhythm (Scrum-lite)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Iteration planning</span> Pick the features for this iteration; create GitLab issues; assign owners.</div>
<div class="lz-layer"><span class="lz-lk">Daily/regular sync</span> What did I do, what's next, what's blocking me?</div>
<div class="lz-layer"><span class="lz-lk">Iteration review</span> Demo what works to the team (and the instructor at checkpoints).</div>
<div class="lz-layer"><span class="lz-lk">Retro</span> What to improve next iteration.</div>
</div>

<h3>Splitting work so everyone can defend a slice</h3>
<p>Because the final Q&A is individual, divide by <em>vertical slices</em>, not just "you do frontend, I do backend." Better: "you own the whole Appointment feature (model→API→UI), I own Auth end-to-end." Then each person can defend their slice completely.</p>

<div class="callout ok"><strong>Git history is graded evidence:</strong> steady, meaningful commits from every member across iterations prove real collaboration. Protect <code>main</code>, review each other's PRs, and never let one person's commits dominate. This directly supports your CLO4 score.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Small PRs beat giant ones.</b> A 2000-line PR is impossible to review; a 100-line PR gets real feedback and catches bugs early. Teams that ship small, reviewed increments have fewer integration disasters near the deadline. <em>Beyond the syllabus, but the habit that prevents the classic "it all broke when we merged" week-9 crisis.</em></div>

<a class="link-card exphub" href="/exp-hub/wdp301-cai-dat-mern?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%206.1" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Git & GitLab setup in the Exp Hub guide</span><span class="lc-sub">Branching, PRs and issue tracking for your team.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Làm việc nhóm chuyên nghiệp là nửa điểm của bạn (CLO4)</h2>
<p class="lead">WDP301 chấm <em>cách</em> bạn làm việc, không chỉ cái bạn xây. Syllabus yêu cầu cộng tác trên GitLab. Một Git workflow sạch + nhịp iteration là thứ giúp 3-5 người xây một app mà không hỗn loạn — và là bằng chứng nhìn thấy được ở mọi đánh giá.</p>

<h3>Feature-branch workflow</h3>
<div class="diagram">main  ●───────●───────●   (luôn chạy được, được bảo vệ)
        \\     / \\     /
feature  ●──●   ●──●        mỗi tính năng một branch riêng
       "auth"  "booking"    → Pull Request → review → merge</div>
<pre><code><span class="tok-comment"># mỗi thành viên, theo tính năng</span>
git checkout -b feature/booking-core
<span class="tok-comment"># ...commit thay đổi nhỏ, có ý nghĩa...</span>
git push -u origin feature/booking-core
<span class="tok-comment"># mở Pull Request trên GitLab → đồng đội review → merge vào main</span></code></pre>

<h3>Nhịp iteration (Scrum-lite)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Lập kế hoạch iteration</span> Chọn tính năng cho iteration này; tạo issue GitLab; giao chủ.</div>
<div class="lz-layer"><span class="lz-lk">Sync đều/hàng ngày</span> Tôi đã làm gì, tiếp theo gì, đang bị chặn gì?</div>
<div class="lz-layer"><span class="lz-lk">Review iteration</span> Demo cái chạy được cho đội (và giảng viên ở checkpoint).</div>
<div class="lz-layer"><span class="lz-lk">Retro</span> Cần cải thiện gì ở iteration sau.</div>
</div>

<h3>Chia việc để ai cũng bảo vệ được một lát</h3>
<p>Vì Q&A cuối theo cá nhân, chia theo <em>lát cắt dọc</em>, không chỉ "bạn làm frontend, tôi làm backend". Tốt hơn: "bạn sở hữu cả tính năng Appointment (model→API→UI), tôi sở hữu Auth end-to-end". Rồi mỗi người bảo vệ trọn lát của mình.</p>

<div class="callout ok"><strong>Lịch sử Git là bằng chứng được chấm:</strong> commit đều, có ý nghĩa từ mọi thành viên qua các iteration chứng minh cộng tác thật. Bảo vệ <code>main</code>, review PR của nhau, và đừng để commit của một người áp đảo. Điều này đỡ trực tiếp điểm CLO4.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>PR nhỏ thắng PR khổng lồ.</b> Một PR 2000 dòng không review nổi; một PR 100 dòng nhận phản hồi thật và bắt lỗi sớm. Đội ship từng phần nhỏ, có review thì ít thảm họa tích hợp gần hạn hơn. <em>Ngoài syllabus, nhưng là thói quen ngăn khủng hoảng tuần-9 kinh điển "merge cái là vỡ hết".</em></div>

<a class="link-card exphub" href="/exp-hub/wdp301-cai-dat-mern?ref=%2Fcourses%2Fweb-development-project%2Flearn&reflabel=WDP301%206.1" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài Git & GitLab trong guide Exp Hub</span><span class="lc-sub">Branching, PR và theo dõi issue cho nhóm bạn.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'In a feature-branch workflow, the main branch should:|||Trong feature-branch workflow, nhánh main nên:',
                options: [
                  'Contain half-finished code|||Chứa code làm dở',
                  'Always stay working; features merge in via reviewed PRs|||Luôn chạy được; tính năng merge vào qua PR đã review',
                  'Be deleted each iteration|||Bị xóa mỗi iteration',
                  'Only exist locally|||Chỉ tồn tại local',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Because the final Q&A is individual, work is best split by:|||Vì Q&A cuối theo cá nhân, việc nên chia theo:',
                options: [
                  'Random tasks|||Việc ngẫu nhiên',
                  'Vertical slices each member owns end-to-end|||Lát cắt dọc mỗi thành viên sở hữu end-to-end',
                  'One person doing everything|||Một người làm hết',
                  'Alphabetical order|||Thứ tự bảng chữ cái',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A repo where all commits appear the night before the deadline signals:|||Một repo mà mọi commit dồn vào đêm trước hạn nộp báo hiệu:',
                options: [
                  'Excellent teamwork|||Teamwork xuất sắc',
                  'A red flag for weak collaboration|||Một cờ đỏ về cộng tác yếu',
                  'Nothing|||Không gì',
                  'Automatic full marks|||Tự động điểm tối đa',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) Small, frequent pull requests help because:|||(Ngoài giáo trình) Pull request nhỏ, thường xuyên giúp vì:',
                options: [
                  'They are harder to review|||Chúng khó review hơn',
                  'They get real review and catch bugs early|||Chúng nhận review thật và bắt lỗi sớm',
                  'They avoid all testing|||Chúng tránh mọi test',
                  'They break main|||Chúng làm hỏng main',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — ÔN THI / BẢO VỆ ══════════════════ */
    {
      title: 'Chapter 7 — Final presentation & defense|||Chương 7 — Thuyết trình & bảo vệ cuối',
      description: 'Chương ÔN THI cho Final Presentation (40%): kịch bản demo có thời gian + ngân hàng câu hỏi phản biện (CQ) theo CLO.',
      lessons: [
        {
          title: '7.1 — Demo script & Q&A defense bank (by CLO)|||7.1 — Kịch bản demo & ngân hàng vấn đáp (theo CLO)',
          slug: 'wdp301-7-1-defense',
          type: 'article',
          description: 'Kịch bản demo 15 phút, cách trưng "viên ngọc", và ngân hàng câu hỏi CQ giám khảo hay hỏi theo CLO.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1 · Exam prep</span>
<h2>The final presentation is 40% — rehearse it deliberately</h2>
<p class="lead">The final demo + defense decides nearly half your grade. Structure the demo, show the gem, and prepare each member to defend their slice. Golden rule: <strong>demo the running app and answer with your actual code.</strong></p>

<h3>Demo script (≈ 15 min)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">0-2'</span> Problem + who it's for + the actors (CLO1). One sentence each.</div>
<div class="lz-layer"><span class="lz-lk">2-4'</span> Architecture: MERN + MVC layers, ERD (CLO2). One diagram.</div>
<div class="lz-layer"><span class="lz-lk">4-10'</span> Live demo of the core flows — including the GEM (happy path + blocked sad path). Have a backup video.</div>
<div class="lz-layer"><span class="lz-lk">10-12'</span> Teamwork: Git history, iterations, who built what (CLO4).</div>
<div class="lz-layer"><span class="lz-lk">12-15'</span> What you'd improve + Q&A (CLO5).</div>
</div>

<h3>Q&A defense bank — the constructive questions, by CLO</h3>
<p><strong>CLO1 (requirements/analysis):</strong></p>
<ul>
<li>"Who interacts with your system? List actors and their functions."</li>
<li>"What tables/collections store your data, and why this model?"</li>
<li>"How does your product differ from similar ones?"</li>
</ul>
<p><strong>CLO2 (MVC/OOP design):</strong></p>
<ul>
<li>"How did you organize your source into packages/folders (MVC)?"</li>
<li>"Which components/data does each screen handle?"</li>
<li>"Walk me through a request: route → controller → service → model."</li>
</ul>
<p><strong>CLO3 (web programming):</strong></p>
<ul>
<li>"Show the code that implements your core feature. How does it prevent the invalid case?"</li>
<li>"How does the frontend call the API and handle errors (401/409)?"</li>
<li>"How is authentication implemented? Where is the JWT secret?"</li>
</ul>
<p><strong>CLO4 (professional attitude):</strong></p>
<ul>
<li>"What Git commands/workflow did you use? Show your branch/PR history."</li>
<li>"What did you complete last iteration; what's still pending?"</li>
<li>"How did you split and track tasks among the team?"</li>
</ul>
<p><strong>CLO5 (communication):</strong></p>
<ul>
<li>"What did your team learn from this project?"</li>
<li>"What was the hardest problem and how did you solve it?"</li>
</ul>

<div class="callout ok"><strong>Answer formula:</strong> (1) direct answer → (2) show the actual code/screen/commit → (3) note a limitation or next step. Pointing at <em>your real code</em> beats any verbal claim. Each member must be able to do this for their own slice.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Here's a bug we found and fixed" builds credibility.</b> Examiners trust teams that show engineering honesty. Mentioning a real problem you hit (a race condition, a merge conflict, a validation gap) and how you fixed it demonstrates genuine work far better than claiming everything was perfect. <em>Beyond the syllabus, but the move that turns a hard question into a credibility win.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1 · Ôn thi</span>
<h2>Thuyết trình cuối là 40% — tập có chủ đích</h2>
<p class="lead">Demo + bảo vệ cuối quyết định gần nửa điểm. Cấu trúc demo, trưng viên ngọc, và chuẩn bị mỗi thành viên bảo vệ lát của mình. Quy tắc vàng: <strong>demo app đang chạy và trả lời bằng chính code của bạn.</strong></p>

<h3>Kịch bản demo (≈ 15 phút)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">0-2'</span> Vấn đề + cho ai + actors (CLO1). Mỗi ý một câu.</div>
<div class="lz-layer"><span class="lz-lk">2-4'</span> Kiến trúc: MERN + lớp MVC, ERD (CLO2). Một sơ đồ.</div>
<div class="lz-layer"><span class="lz-lk">4-10'</span> Demo trực tiếp các luồng lõi — gồm VIÊN NGỌC (happy path + sad path bị chặn). Có video dự phòng.</div>
<div class="lz-layer"><span class="lz-lk">10-12'</span> Teamwork: lịch sử Git, iteration, ai xây gì (CLO4).</div>
<div class="lz-layer"><span class="lz-lk">12-15'</span> Cải thiện gì + Q&A (CLO5).</div>
</div>

<h3>Ngân hàng vấn đáp — các câu hỏi CQ, theo CLO</h3>
<p><strong>CLO1 (yêu cầu/phân tích):</strong></p>
<ul>
<li>"Ai tương tác với hệ thống? Liệt kê actors và chức năng của họ."</li>
<li>"Những bảng/collection nào lưu dữ liệu, và vì sao mô hình này?"</li>
<li>"Sản phẩm của bạn khác gì so với sản phẩm tương tự?"</li>
</ul>
<p><strong>CLO2 (thiết kế MVC/OOP):</strong></p>
<ul>
<li>"Bạn tổ chức mã nguồn thành package/folder thế nào (MVC)?"</li>
<li>"Mỗi màn hình xử lý component/dữ liệu nào?"</li>
<li>"Dẫn tôi qua một request: route → controller → service → model."</li>
</ul>
<p><strong>CLO3 (lập trình web):</strong></p>
<ul>
<li>"Cho xem code hiện thực tính năng lõi. Nó chặn ca không hợp lệ thế nào?"</li>
<li>"Frontend gọi API và xử lý lỗi (401/409) ra sao?"</li>
<li>"Xác thực hiện thực thế nào? JWT secret ở đâu?"</li>
</ul>
<p><strong>CLO4 (thái độ chuyên nghiệp):</strong></p>
<ul>
<li>"Bạn dùng lệnh/workflow Git nào? Cho xem lịch sử branch/PR."</li>
<li>"Iteration trước bạn hoàn thành gì; còn gì đang dở?"</li>
<li>"Nhóm chia và theo dõi việc thế nào?"</li>
</ul>
<p><strong>CLO5 (giao tiếp):</strong></p>
<ul>
<li>"Nhóm học được gì từ dự án này?"</li>
<li>"Vấn đề khó nhất là gì và bạn giải quyết thế nào?"</li>
</ul>

<div class="callout ok"><strong>Công thức trả lời:</strong> (1) trả lời thẳng → (2) trưng chính code/màn hình/commit → (3) nêu một giới hạn hoặc bước tiếp. Chỉ vào <em>code thật của bạn</em> thắng mọi tuyên bố bằng lời. Mỗi thành viên phải làm được điều này cho lát của mình.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Đây là một bug bọn em tìm ra và sửa" tạo uy tín.</b> Giám khảo tin đội thể hiện sự trung thực kỹ thuật. Nhắc một vấn đề thật bạn gặp (một race condition, một merge conflict, một lỗ hổng validation) và cách bạn sửa chứng minh công việc thật hơn hẳn tuyên bố mọi thứ hoàn hảo. <em>Ngoài syllabus, nhưng là nước đi biến câu hỏi khó thành điểm cộng uy tín.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'In the final demo, the strongest moment is:|||Trong demo cuối, khoảnh khắc mạnh nhất là:',
                options: [
                  'Only the happy path|||Chỉ happy path',
                  'Showing the core feature enforce a rule (block the invalid case)|||Trưng tính năng lõi áp một quy tắc (chặn ca không hợp lệ)',
                  'A long feature list|||Một danh sách tính năng dài',
                  'The login screen alone|||Chỉ màn đăng nhập',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'When asked "how is auth implemented?", the best answer:|||Khi bị hỏi "xác thực hiện thực thế nào?", câu trả lời tốt nhất:',
                options: [
                  'Describe it vaguely|||Mô tả mơ hồ',
                  'Show the actual code and note the JWT secret is server-side|||Trưng code thật và nêu JWT secret ở phía server',
                  'Say "it just works"|||Nói "nó cứ chạy"',
                  'Avoid the question|||Né câu hỏi',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Since Q&A is individual, each member must be able to:|||Vì Q&A theo cá nhân, mỗi thành viên phải:',
                options: [
                  'Answer only about the whole team|||Chỉ trả lời về cả nhóm',
                  'Defend and explain the code of their own slice|||Bảo vệ và giải thích code lát của chính mình',
                  'Stay silent|||Im lặng',
                  'Let the leader answer everything|||Để nhóm trưởng trả lời hết',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A safeguard against a live-demo crash is:|||Một biện pháp chống crash demo trực tiếp là:',
                options: [
                  'Not demoing|||Không demo',
                  'Seed data + a recorded backup video|||Seed data + một video quay dự phòng',
                  'Improvising|||Ứng biến',
                  'Deleting the database first|||Xóa CSDL trước',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — NÂNG CAO ★ ══════════════════ */
    {
      title: 'Chapter 8 — Beyond the syllabus ★: testing, deployment & real-time|||Chương 8 — Ngoài giáo trình ★: test, triển khai & real-time',
      description: 'Chương NÂNG CAO ngoài giáo trình: viết test, đóng gói Docker & deploy, tối ưu hiệu năng (index, phân trang), và real-time.',
      lessons: [
        {
          title: '8.1 ★ — Testing, deployment, performance & real-time|||8.1 ★ — Test, triển khai, hiệu năng & real-time',
          slug: 'wdp301-8-1-advanced',
          type: 'VIDEO',
          description: 'Test API (Jest/supertest), đóng gói Docker Compose & deploy, index + phân trang, và cập nhật real-time bằng Socket.IO.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1 · ★ Beyond the syllabus</span>
<h2>Ship it like a real engineering team</h2>
<p class="lead"><span class="badge">★ Beyond the syllabus</span> These practices aren't required to pass, but each one visibly lifts your project above a basic CRUD app — and demonstrating even one in the defense signals real engineering maturity.</p>

<h3>1 · Automated testing</h3>
<pre><code><span class="tok-comment">// a supertest API test proving the gem</span>
<span class="tok-keyword">import</span> request <span class="tok-keyword">from</span> <span class="tok-string">'supertest'</span>;
test(<span class="tok-string">'blocks double-booking a slot'</span>, <span class="tok-keyword">async</span> () => {
  <span class="tok-keyword">await</span> request(app).post(<span class="tok-string">'/api/appointments'</span>).send(booking).expect(<span class="tok-number">201</span>);
  <span class="tok-keyword">await</span> request(app).post(<span class="tok-string">'/api/appointments'</span>).send(booking).expect(<span class="tok-number">409</span>); <span class="tok-comment">// second is blocked</span>
});</code></pre>

<h3>2 · Deployment with Docker</h3>
<pre><code><span class="tok-comment"># docker-compose.yml — three services</span>
services:
  api:    { build: ./server, ports: [<span class="tok-string">"5000:5000"</span>], environment: [MONGO_URI, JWT_SECRET] }
  web:    { build: ./client, ports: [<span class="tok-string">"5173:80"</span>] }
  mongo:  { image: mongo:7, volumes: [dbdata:/data/db] }</code></pre>
<p>One <code>docker compose up</code> runs the whole stack — a huge plus in the demo (no "works on my machine").</p>

<h3>3 · Performance</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Indexes</span> Add MongoDB indexes on fields you query/filter by — turns slow scans into fast lookups.</div>
<div class="lz-layer"><span class="lz-lk">Pagination</span> Never return 10,000 docs; use limit + skip (or keyset) so lists stay fast.</div>
<div class="lz-layer"><span class="lz-lk">Avoid N+1</span> Use populate/aggregation instead of a query per item in a loop.</div>
</div>

<h3>4 · Real-time (Socket.IO)</h3>
<p>For live updates (e.g. a receptionist sees a new booking instantly), add Socket.IO: the server emits an event on create, connected clients update without refresh. It's a standout feature that maps naturally onto the booking domain.</p>

<div class="callout ok"><strong>Pick one to shine.</strong> You can't do everything in a term. Choose the one that fits your gem — a concurrency test for a booking app, real-time for a chat/dashboard, Docker for easy demo — and do it well. One deep advanced feature beats four half-done ones.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A CI pipeline is the final flex.</b> A simple GitLab CI that runs your tests on every push proves professional discipline: the repo is always green, regressions are caught automatically. Few student teams do this — those who do stand out immediately. <em>The deepest ★ practice: automation that keeps quality high without manual effort.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1 · ★ Ngoài giáo trình</span>
<h2>Ship như một đội kỹ sư thật</h2>
<p class="lead"><span class="badge">★ Ngoài giáo trình</span> Những thực hành này không bắt buộc để qua môn, nhưng mỗi cái nâng dự án của bạn lên trên một app CRUD cơ bản một cách nhìn thấy được — và trưng dù chỉ một cái khi bảo vệ cho thấy độ chín kỹ thuật thật.</p>

<h3>1 · Test tự động</h3>
<pre><code><span class="tok-comment">// một test API supertest chứng minh viên ngọc</span>
<span class="tok-keyword">import</span> request <span class="tok-keyword">from</span> <span class="tok-string">'supertest'</span>;
test(<span class="tok-string">'chặn đặt trùng một khung giờ'</span>, <span class="tok-keyword">async</span> () => {
  <span class="tok-keyword">await</span> request(app).post(<span class="tok-string">'/api/appointments'</span>).send(booking).expect(<span class="tok-number">201</span>);
  <span class="tok-keyword">await</span> request(app).post(<span class="tok-string">'/api/appointments'</span>).send(booking).expect(<span class="tok-number">409</span>); <span class="tok-comment">// cái thứ hai bị chặn</span>
});</code></pre>

<h3>2 · Triển khai bằng Docker</h3>
<pre><code><span class="tok-comment"># docker-compose.yml — ba service</span>
services:
  api:    { build: ./server, ports: [<span class="tok-string">"5000:5000"</span>], environment: [MONGO_URI, JWT_SECRET] }
  web:    { build: ./client, ports: [<span class="tok-string">"5173:80"</span>] }
  mongo:  { image: mongo:7, volumes: [dbdata:/data/db] }</code></pre>
<p>Một lệnh <code>docker compose up</code> chạy cả stack — một điểm cộng lớn khi demo (hết cảnh "máy em thì chạy").</p>

<h3>3 · Hiệu năng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Index</span> Thêm index MongoDB trên các trường bạn truy vấn/lọc — biến quét chậm thành tra cứu nhanh.</div>
<div class="lz-layer"><span class="lz-lk">Phân trang</span> Đừng trả 10.000 tài liệu; dùng limit + skip (hoặc keyset) để danh sách luôn nhanh.</div>
<div class="lz-layer"><span class="lz-lk">Tránh N+1</span> Dùng populate/aggregation thay vì một truy vấn mỗi phần tử trong vòng lặp.</div>
</div>

<h3>4 · Real-time (Socket.IO)</h3>
<p>Cho cập nhật trực tiếp (vd lễ tân thấy một booking mới ngay), thêm Socket.IO: server phát một sự kiện khi tạo, client đang kết nối cập nhật không cần refresh. Đây là một tính năng nổi bật ánh xạ tự nhiên vào miền đặt lịch.</p>

<div class="callout ok"><strong>Chọn một để tỏa sáng.</strong> Bạn không thể làm hết trong một kỳ. Chọn cái hợp với viên ngọc của bạn — một test tương tranh cho app đặt lịch, real-time cho chat/dashboard, Docker cho demo dễ — và làm tốt. Một tính năng nâng cao sâu thắng bốn cái làm dở.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một pipeline CI là cú "flex" cuối.</b> Một GitLab CI đơn giản chạy test mỗi lần push chứng minh kỷ luật chuyên nghiệp: repo luôn xanh, regression bị bắt tự động. Ít đội SV làm điều này — đội nào làm thì nổi bật ngay. <em>Thực hành ★ sâu nhất: tự động hóa giữ chất lượng cao mà không tốn công thủ công.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'A supertest test that posts the same booking twice should expect the second to return:|||Một test supertest gửi cùng booking hai lần nên kỳ vọng cái thứ hai trả về:',
                options: ['201 Created', '409 Conflict', '200 OK', '500 Error'],
                correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The main benefit of Docker Compose for the demo is:|||Lợi ích chính của Docker Compose cho demo là:',
                options: [
                  'Prettier UI|||UI đẹp hơn',
                  'One command runs the whole stack (no "works on my machine")|||Một lệnh chạy cả stack (hết "máy em thì chạy")',
                  'Faster typing|||Gõ nhanh hơn',
                  'It removes the need for code|||Nó bỏ nhu cầu code',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'To keep a large list endpoint fast, you should:|||Để giữ một endpoint danh sách lớn nhanh, bạn nên:',
                options: [
                  'Return all documents at once|||Trả tất cả tài liệu cùng lúc',
                  'Use indexes + pagination and avoid N+1 queries|||Dùng index + phân trang và tránh truy vấn N+1',
                  'Remove the database|||Bỏ CSDL',
                  'Disable caching|||Tắt cache',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) A GitLab CI pipeline that runs tests on every push:|||(Ngoài giáo trình) Một pipeline GitLab CI chạy test mỗi lần push:',
                options: [
                  'Slows the team down with no benefit|||Làm chậm đội mà không lợi ích',
                  'Catches regressions automatically and keeps the repo green|||Bắt regression tự động và giữ repo xanh',
                  'Deletes the code|||Xóa code',
                  'Is only for frontend|||Chỉ cho frontend',
                ], correctIndex: 1,
              },
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
          "slug": "wdp301-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>\n<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>\n<li>Read the requirement twice; build the smallest working version first, then extend.</li>\n<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>\n<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>\n<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>\n<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "wdp301-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "The first thing to do in Iteration 1 (Initiation) is:|||Việc đầu tiên trong Iteration 1 (Khởi tạo) là:",
                "options": [
                  "Write all the code immediately|||Viết hết code ngay",
                  "Analyze requirements: actors, use cases, data model|||Phân tích yêu cầu: actors, use case, mô hình dữ liệu",
                  "Deploy to production|||Triển khai production",
                  "Design the final logo|||Thiết kế logo cuối"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "In MERN, \"M\" (Model) is typically implemented with:|||Trong MERN, \"M\" (Model) thường được hiện thực bằng:",
                "options": [
                  "React components|||Component React",
                  "Mongoose schemas over MongoDB|||Schema Mongoose trên MongoDB",
                  "Express routes|||Express routes",
                  "CSS files|||File CSS"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "In a layered backend, the controller should:|||Trong backend phân lớp, controller nên:",
                "options": [
                  "Talk to the database directly|||Nói chuyện trực tiếp với CSDL",
                  "Parse the request, call a service, and send the response|||Đọc request, gọi service, và gửi response",
                  "Contain all business logic and DB queries|||Chứa toàn bộ logic nghiệp vụ và truy vấn DB",
                  "Render HTML|||Render HTML"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "(Beyond syllabus) In MongoDB, you should reference (not embed) data when it is:|||(Ngoài giáo trình) Trong MongoDB, nên tham chiếu (không nhúng) dữ liệu khi nó:",
                "options": [
                  "Tiny and always read together|||Rất nhỏ và luôn đọc cùng nhau",
                  "Large, shared, or grows unbounded|||Lớn, dùng chung, hoặc tăng không giới hạn",
                  "Never queried|||Không bao giờ truy vấn",
                  "A single boolean|||Một boolean đơn"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "express.json() middleware is needed to:|||Middleware express.json() cần để:",
                "options": [
                  "Serve HTML files|||Phục vụ file HTML",
                  "Parse incoming JSON request bodies|||Đọc body request JSON đến",
                  "Connect to MongoDB|||Kết nối MongoDB",
                  "Render React|||Render React"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "A unique index on slotId in the Appointment schema ensures:|||Một index unique trên slotId trong schema Appointment đảm bảo:",
                "options": [
                  "Faster React rendering|||Render React nhanh hơn",
                  "No two appointments can book the same slot|||Không hai lịch hẹn nào đặt trùng một khung giờ",
                  "Smaller documents|||Tài liệu nhỏ hơn",
                  "Automatic login|||Tự động đăng nhập"
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
