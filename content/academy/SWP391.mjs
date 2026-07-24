/**
 * SWP391 — Software Development Project (Đồ án phát triển phần mềm — capstone). Kỳ 5.
 * Bám syllabus FPTU (sylID 14177, 6 CLO, 60 buổi). Tiên quyết: PRJ301, SWE201c, LAB211.
 * Môn ĐỒ ÁN: làm một dự án phần mềm nhóm end-to-end theo SDLC + AI.
 * 3 Milestone (15/20/25%) + Final Presentation (40%). Java Spring/.NET/Node + SQL + Git.
 * Song ngữ EN/VN. Code/ERD <pre>+.tok-*. Ví dụ giải từng bước + ★ ngoài giáo trình.
 * Deep-link CodeLab java-core/spring-boot/sql/react; Git/Docker → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SWP391.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    academyType: 'FPT',
    courseCode: 'SWP391',
    title: 'Software Development Project',
    slug: 'software-development-project',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The capstone: your team builds one real product end-to-end through the full SDLC — requirements, ERD & design, MVC implementation, testing, deployment and a final presentation, AI woven through every phase.|||Đồ án capstone: nhóm bạn xây một sản phẩm thật từ đầu đến cuối theo trọn vòng đời (SDLC) — yêu cầu, ERD & thiết kế, hiện thực MVC, kiểm thử, triển khai và thuyết trình cuối kỳ, AI xuyên suốt mọi giai đoạn.',
    description: 'SWP391 là môn ĐỒ ÁN (capstone) của Kỳ 5. Thay vì học lý thuyết mới, nhóm 4–5 sinh viên chọn một đề tài, rồi đi qua trọn vẹn vòng đời phát triển phần mềm (SDLC): thu thập & phân tích yêu cầu (SRS, use case, user story, product backlog), thiết kế hệ thống (ERD, kiến trúc MVC, class diagram, thiết kế API & schema chuẩn hóa), hiện thực theo MVC/OOP với Java Spring / .NET / Node.js + SQL, kiểm thử (unit/integration, test plan, bug tracking), triển khai lên staging (build, CI/CD cơ bản, Docker) và thuyết trình sản phẩm cuối kỳ. Điểm nhấn của bản 2026: AI-augmented SDLC — dùng GenAI có trách nhiệm cho elicitation, modelling, coding, review và testing. Tiên quyết: PRJ301, SWE201c (hoặc SWE202c), và đã đạt LAB211.',
    whatYouLearn: 'Chạy trọn một dự án phần mềm nhóm theo SDLC; lập nhóm & phân vai, chọn tech stack; Git workflow (branch/PR/merge, code review); thu thập yêu cầu và viết SRS/use case/user story/product backlog; thiết kế ERD (conceptual→logical→physical) và schema chuẩn hóa; kiến trúc MVC + class diagram + thiết kế REST API; hiện thực theo lớp Repository/Service, chống SQL injection; test plan + unit/integration test + bug tracking; build, staging, CI/CD cơ bản, Docker; teamwork, đạo đức nghề nghiệp, dùng AI có trách nhiệm; và thuyết trình + báo cáo chuyên nghiệp.',
    requirements: 'Tiên quyết: PRJ301 (Java web / MVC), SWE201c hoặc SWE202c (Kỹ nghệ phần mềm), và đã ĐẠT LAB211. Cần: một tài khoản GitHub/GitLab cho nhóm, một IDE (IntelliJ IDEA / VS Code / Visual Studio), một hệ CSDL (MySQL / SQL Server / PostgreSQL) và Docker để triển khai.',
    documentsNote: 'Giáo trình: Ian Sommerville — Software Engineering (Pearson, 10th) • Spring MVC With Spring Boot / ASP.NET Core MVC Fundamentals (Packt, Coursera) • Prompt Engineering for Developers (OpenAI & DeepLearning.AI). Công cụ: Miro/Lucidchart/Figma/Draw.io (thiết kế), IntelliJ/VS Code/Visual Studio + Copilot (coding), MySQL Workbench/SSMS/pgAdmin (DB), JUnit/NUnit/Postman/Selenium (test), Jira/Trello/Notion + Git/GitHub (quản lý), Docker/Vercel/AWS/Azure (deploy). Luyện: track Code Lab Java Core + Spring Boot + SQL + React; Git & Docker trên Exp Hub. Kèm file syllabus gốc SWP391.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: đồ án là gì, đi qua vòng đời nào, điều kiện qua môn & 3 milestone, chuẩn đầu ra và tech stack.',
      lessons: [
        {
          title: '0.1 — About SWP391 & the project lifecycle map|||0.1 — Giới thiệu SWP391 & bản đồ vòng đời đồ án',
          slug: 'swp391-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Đồ án capstone là gì, khác môn lý thuyết ra sao, và bản đồ vòng đời từ đề tài tới thuyết trình.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About SWP391 — Software Development Project</h2>
<p class="lead">SWP391 is <strong>not a lecture course — it is a project</strong>. In a team of 4–5, you take one real product idea and carry it through the <strong>entire Software Development Life Cycle (SDLC)</strong>: from a blank page to a running, deployed application you demo in front of a committee. Everything you learned separately — Java/OOP (PRO192), databases (DBI202), Java web/MVC (PRJ301), software engineering (SWE201c) — finally combines into one shipped system.</p>
<p>The 2026 edition adds one theme on top of every phase: <strong>AI-augmented SDLC</strong>. You use GenAI as a teammate — to elicit requirements, model data, write and review code, and generate test cases — while staying the responsible engineer who verifies everything.</p>
<h3>The project lifecycle — your map for the whole semester</h3>
<p>The 60 university sessions are one continuous journey. Study each phase in order; the output of one becomes the input of the next:</p>
<div class="lz-map">
  <div class="lz-stage">Phase 1 · Milestone 1 (Week 3, 15%)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Topic &amp; team kickoff</div><div class="lz-nsub">Pick a topic + tech stack · form roles · AI-augmented SDLC · Git workflow</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Requirement analysis</div><div class="lz-nsub">Elicitation · SRS · use cases · user stories · product backlog</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">System &amp; database design</div><div class="lz-nsub">ERD · MVC architecture · class diagram · API &amp; schema design</div></div></div>
  <div class="lz-stage">Phase 2 · Milestone 2 (Week 8, 20%)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Implementation</div><div class="lz-nsub">MVC/OOP coding · Repository/Service · REST API · SQLi-safe · code review</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Testing &amp; quality</div><div class="lz-nsub">Test plan · unit/integration tests · bug tracking</div></div></div>
  <div class="lz-stage">Phase 3 · Milestone 3 (Week 10, 25%)</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Build · staging · basic CI/CD · verify functionality</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Teamwork, report &amp; presentation</div><div class="lz-nsub">Standups · demo · final report · presentation (40%)</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Responsible AI in the SDLC · DevOps &amp; Docker</div><div class="lz-nsub">Ship like a real engineering team</div></div></div>
</div>
<div class="callout ok">The single most important habit in this course: <strong>ship a thin slice, then grow it</strong>. A tiny end-to-end feature that runs (login → one screen → database) beats a huge design that never compiles. Milestones reward working software, not documents.</div>
<a class="link-card exphub" href="/exp-hub/git-workflow?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up your team Git workflow</span><span class="lc-sub">Branching, pull requests and code review — the backbone of team development, on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu SWP391 — Đồ án phát triển phần mềm</h2>
<p class="lead">SWP391 <strong>không phải môn lý thuyết — nó là một đồ án</strong>. Trong nhóm 4–5 người, bạn lấy một ý tưởng sản phẩm thật và đưa nó đi qua <strong>toàn bộ vòng đời phát triển phần mềm (SDLC)</strong>: từ trang giấy trắng tới một ứng dụng chạy được, đã triển khai, và demo trước hội đồng. Mọi thứ bạn học rời rạc trước đây — Java/OOP (PRO192), CSDL (DBI202), Java web/MVC (PRJ301), kỹ nghệ phần mềm (SWE201c) — giờ hợp lại thành một hệ thống hoàn chỉnh.</p>
<p>Bản 2026 thêm một chủ đề phủ lên mọi giai đoạn: <strong>SDLC có AI hỗ trợ (AI-augmented)</strong>. Bạn dùng GenAI như một đồng đội — để thu thập yêu cầu, mô hình dữ liệu, viết và review code, sinh test case — nhưng vẫn là kỹ sư có trách nhiệm kiểm chứng mọi thứ.</p>
<h3>Vòng đời đồ án — bản đồ cho cả học kỳ</h3>
<p>60 buổi của trường là một hành trình liền mạch. Học từng giai đoạn theo thứ tự; đầu ra của giai đoạn này là đầu vào của giai đoạn sau:</p>
<div class="lz-map">
  <div class="lz-stage">Pha 1 · Milestone 1 (Tuần 3, 15%)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Khởi động đề tài &amp; nhóm</div><div class="lz-nsub">Chọn đề tài + tech stack · phân vai · SDLC có AI · Git workflow</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Phân tích yêu cầu</div><div class="lz-nsub">Elicitation · SRS · use case · user story · product backlog</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế hệ thống &amp; CSDL</div><div class="lz-nsub">ERD · kiến trúc MVC · class diagram · thiết kế API &amp; schema</div></div></div>
  <div class="lz-stage">Pha 2 · Milestone 2 (Tuần 8, 20%)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Hiện thực</div><div class="lz-nsub">Code MVC/OOP · Repository/Service · REST API · chống SQLi · code review</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử &amp; chất lượng</div><div class="lz-nsub">Test plan · unit/integration test · quản lý bug</div></div></div>
  <div class="lz-stage">Pha 3 · Milestone 3 (Tuần 10, 25%)</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Build · staging · CI/CD cơ bản · kiểm chứng chức năng</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Teamwork, báo cáo &amp; thuyết trình</div><div class="lz-nsub">Standup · demo · báo cáo cuối · thuyết trình (40%)</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">AI có trách nhiệm trong SDLC · DevOps &amp; Docker</div><div class="lz-nsub">Ship như một đội kỹ sư thật</div></div></div>
</div>
<div class="callout ok">Thói quen quan trọng nhất của môn này: <strong>ship một lát cắt mỏng, rồi mở rộng</strong>. Một chức năng nhỏ chạy được từ đầu đến cuối (đăng nhập → một màn hình → CSDL) hơn hẳn một bản thiết kế đồ sộ không bao giờ biên dịch. Milestone chấm phần mềm chạy được, không chấm tài liệu.</div>
<a class="link-card exphub" href="/exp-hub/git-workflow?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Thiết lập Git workflow cho nhóm</span><span class="lc-sub">Branch, pull request và code review — xương sống của phát triển nhóm, trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements, milestones & grading|||0.2 — Điều kiện qua môn, milestone & cấu trúc điểm',
          slug: 'swp391-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tín chỉ, tiên quyết, điều kiện thuyết trình, và trọng số 3 milestone + final presentation.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements, milestones &amp; grading</h2>
<p class="lead">Know the rules before you build. SWP391 has <strong>no written final exam</strong> — your grade is your project, assessed at three milestones plus a final presentation. The numbers below come straight from the official syllabus.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h contact + 1h presentation + 104h self-study</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 sessions <small>45 min each</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">PRJ301 · SWE201c/202c · pass LAB211</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Presentation eligibility</span><span class="v">Attend ≥ 80% of contact slots</span></div>
</div>
<h3>Grade structure — 3 milestones + final presentation</h3>
<table>
  <thead><tr><th>Assessment</th><th>When</th><th>Weight</th><th>What is graded</th></tr></thead>
  <tbody>
    <tr><td>Milestone 1 — Requirement Analysis &amp; Design</td><td>Week 3</td><td>15%</td><td>SRS, use cases, ERD, system design</td></tr>
    <tr><td>Milestone 2 — Workflow 1 &amp; 2 Implementation</td><td>Week 8</td><td>20%</td><td>Core features working end-to-end</td></tr>
    <tr><td>Milestone 3 — Full System Completion &amp; Testing</td><td>Week 10</td><td>25%</td><td>Complete system, tests, deployment</td></tr>
    <tr><td><strong>Final Project Presentation</strong></td><td>Final</td><td><strong>40%</strong></td><td>Live demo + defense + report (60 min)</td></tr>
  </tbody>
</table>
<div class="callout warn">Two <strong>hard blockers</strong>: (1) attend fewer than <strong>80%</strong> of contact slots and you are <strong>barred from the final presentation</strong>; (2) the topic &amp; tech stack must be <strong>approved by the teacher before you start coding</strong> — building on an unapproved topic risks the whole project.</div>
<div class="note-ct">Notice the weighting climbs each milestone (15 → 20 → 25 → 40). Momentum matters: a team that ships a thin working slice by Milestone 2 almost always finishes strong, while a team still "designing" at Week 8 rarely recovers. Grade individually too — supervisors weight your personal Git contribution and standup presence, so <strong>commit under your own account, regularly</strong>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn, milestone &amp; cấu trúc điểm</h2>
<p class="lead">Nắm luật trước khi xây. SWP391 <strong>không có thi cuối kỳ viết</strong> — điểm của bạn chính là đồ án, được đánh giá qua ba milestone cộng buổi thuyết trình cuối. Các con số dưới đây lấy thẳng từ syllabus chính thức.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lên lớp + 1h thuyết trình + 104h tự học</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 buổi <small>45 phút/buổi</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">PRJ301 · SWE201c/202c · đạt LAB211</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi TB ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện thuyết trình</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>
<h3>Cấu trúc điểm — 3 milestone + thuyết trình cuối</h3>
<table>
  <thead><tr><th>Đánh giá</th><th>Thời điểm</th><th>Trọng số</th><th>Chấm gì</th></tr></thead>
  <tbody>
    <tr><td>Milestone 1 — Phân tích yêu cầu &amp; Thiết kế</td><td>Tuần 3</td><td>15%</td><td>SRS, use case, ERD, thiết kế hệ thống</td></tr>
    <tr><td>Milestone 2 — Hiện thực Workflow 1 &amp; 2</td><td>Tuần 8</td><td>20%</td><td>Chức năng lõi chạy được từ đầu đến cuối</td></tr>
    <tr><td>Milestone 3 — Hoàn thiện hệ thống &amp; Kiểm thử</td><td>Tuần 10</td><td>25%</td><td>Hệ thống đầy đủ, test, triển khai</td></tr>
    <tr><td><strong>Thuyết trình đồ án cuối kỳ</strong></td><td>Cuối kỳ</td><td><strong>40%</strong></td><td>Demo trực tiếp + bảo vệ + báo cáo (60 phút)</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai điều kiện <strong>chặn cứng</strong>: (1) dự dưới <strong>80%</strong> số buổi = <strong>cấm thuyết trình cuối</strong>; (2) đề tài &amp; tech stack phải được <strong>giảng viên duyệt TRƯỚC khi bắt đầu code</strong> — làm trên đề tài chưa duyệt là đánh cược cả đồ án.</div>
<div class="note-ct">Để ý trọng số tăng dần mỗi milestone (15 → 20 → 25 → 40). Đà rất quan trọng: nhóm ship được một lát cắt mỏng chạy được vào Milestone 2 gần như luôn về đích mạnh, còn nhóm tới Tuần 8 vẫn "đang thiết kế" hiếm khi cứu kịp. Chấm cả cá nhân nữa — giảng viên xem đóng góp Git riêng và sự có mặt ở standup, nên <strong>hãy commit bằng tài khoản của chính bạn, đều đặn</strong>.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (CLOs) & how they map to milestones|||0.3 — Chuẩn đầu ra (CLO) & ánh xạ vào milestone',
          slug: 'swp391-chuan-dau-ra',
          type: 'VIDEO',
          description: '6 chuẩn đầu ra của môn và cách chúng gắn vào từng giai đoạn của đồ án.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>6 course learning outcomes (CLOs)</h2>
<p class="lead">A "Course Learning Outcome" (CLO) is what you <strong>must be able to do</strong> by the end. Because SWP391 is a project, each CLO is demonstrated by an <em>artifact</em> you produce and defend — not a written answer.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to</th><th>Demonstrated in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Analyze &amp; clarify requirements with AI-assisted elicitation and documentation</td><td>Milestone 1 · Ch2</td></tr>
    <tr><td>CLO2</td><td>Design system modules &amp; databases using MVC, OOP and AI-supported modelling</td><td>Milestone 1 · Ch3</td></tr>
    <tr><td>CLO3</td><td>Create ERD models &amp; implement relational databases with SQL (AI validation)</td><td>Milestone 1–2 · Ch3–4</td></tr>
    <tr><td>CLO4</td><td>Develop web apps in Java/.NET/Node.js with AI-enhanced coding &amp; debugging</td><td>Milestone 2–3 · Ch4</td></tr>
    <tr><td>CLO5</td><td>Demonstrate teamwork, professional ethics and responsible AI use</td><td>All milestones · Ch7–8</td></tr>
    <tr><td>CLO6</td><td>Deliver effective presentations &amp; reports with AI-aided content and visuals</td><td>Final Presentation · Ch7</td></tr>
  </tbody>
</table>
<div class="callout">Read the CLOs as a checklist for your defense. When the committee asks "how did you validate your requirements?" (CLO1) or "why this database design?" (CLO3), they are grading a CLO. Prepare one concrete artifact and one sentence of reasoning for each.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>6 chuẩn đầu ra (CLO)</h2>
<p class="lead">"Chuẩn đầu ra" (CLO) là những gì bạn <strong>phải làm được</strong> khi kết thúc môn. Vì SWP391 là đồ án, mỗi CLO được chứng minh bằng một <em>sản phẩm</em> bạn tạo ra và bảo vệ — không phải một câu trả lời viết.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ làm được</th><th>Thể hiện ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Phân tích &amp; làm rõ yêu cầu với elicitation và tài liệu có AI hỗ trợ</td><td>Milestone 1 · Ch2</td></tr>
    <tr><td>CLO2</td><td>Thiết kế module hệ thống &amp; CSDL dùng MVC, OOP và mô hình hóa có AI</td><td>Milestone 1 · Ch3</td></tr>
    <tr><td>CLO3</td><td>Tạo ERD &amp; hiện thực CSDL quan hệ bằng SQL (AI kiểm chứng)</td><td>Milestone 1–2 · Ch3–4</td></tr>
    <tr><td>CLO4</td><td>Phát triển web app Java/.NET/Node.js với coding &amp; debug có AI</td><td>Milestone 2–3 · Ch4</td></tr>
    <tr><td>CLO5</td><td>Thể hiện teamwork, đạo đức nghề nghiệp và dùng AI có trách nhiệm</td><td>Mọi milestone · Ch7–8</td></tr>
    <tr><td>CLO6</td><td>Thuyết trình &amp; báo cáo hiệu quả với nội dung và hình ảnh do AI hỗ trợ</td><td>Thuyết trình cuối · Ch7</td></tr>
  </tbody>
</table>
<div class="callout">Hãy đọc CLO như một checklist cho buổi bảo vệ. Khi hội đồng hỏi "nhóm kiểm chứng yêu cầu thế nào?" (CLO1) hay "vì sao thiết kế CSDL này?" (CLO3), họ đang chấm một CLO. Chuẩn bị sẵn một sản phẩm cụ thể và một câu lý giải cho mỗi CLO.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, tools & choosing a tech stack|||0.4 — Tài liệu, công cụ & chọn tech stack',
          slug: 'swp391-tai-lieu-cong-cu',
          type: 'VIDEO',
          description: 'Giáo trình, bộ công cụ theo giai đoạn, và ba lựa chọn tech stack phổ biến.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; choosing your stack</h2>
<h3>Textbooks &amp; courses</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Software Engineering — Ian Sommerville (Pearson, 10th)</div><div class="lz-ld">The reference for SDLC, requirements, design and process. Read the requirements &amp; architecture chapters before Milestone 1.</div></div>
  <div class="lz-layer"><div class="lz-lt">Spring MVC with Spring Boot (Packt / Coursera)</div><div class="lz-ld">If your stack is Java — the fastest path from PRJ301 Servlets to a modern Spring app.</div></div>
  <div class="lz-layer"><div class="lz-lt">ASP.NET Core MVC Fundamentals &amp; CRUD (Packt / Coursera)</div><div class="lz-ld">If your stack is .NET — MVC and CRUD the C# way.</div></div>
  <div class="lz-layer"><div class="lz-lt">Prompt Engineering for Developers (OpenAI &amp; DeepLearning.AI)</div><div class="lz-ld">How to use GenAI as a coding/testing teammate — the AI-augmented part of the syllabus.</div></div>
</div>
<h3>Tools by phase</h3>
<table>
  <thead><tr><th>Phase</th><th>Tools</th></tr></thead>
  <tbody>
    <tr><td>Requirements &amp; design</td><td>Miro, Lucidchart, Figma, Draw.io, ChatGPT/Gemini</td></tr>
    <tr><td>Coding &amp; debugging</td><td>IntelliJ IDEA / VS Code / Visual Studio, GitHub Copilot</td></tr>
    <tr><td>Database</td><td>MySQL Workbench, SSMS, pgAdmin</td></tr>
    <tr><td>Testing</td><td>JUnit, NUnit, Postman, Selenium</td></tr>
    <tr><td>Project management</td><td>Jira, Trello, Notion, Git/GitHub</td></tr>
    <tr><td>Deployment</td><td>Docker, Vercel, AWS/Azure/GCP</td></tr>
  </tbody>
</table>
<h3>Three common stacks — pick one your team already knows</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Java</div><div class="lz-t">Spring Boot + MySQL</div><div class="lz-d">Natural next step after PRJ301 · Thymeleaf/React front</div></div>
  <div class="lz-step"><div class="lz-k">.NET</div><div class="lz-t">ASP.NET Core MVC + SQL Server</div><div class="lz-d">Strong tooling in Visual Studio</div></div>
  <div class="lz-step"><div class="lz-k">Node</div><div class="lz-t">Express/Nest + PostgreSQL + React</div><div class="lz-d">One language (JS/TS) front-to-back</div></div>
</div>
<div class="pitfall">Do <em>not</em> pick a stack because it looks impressive. Pick the one where at least two teammates can already build a CRUD screen. SWP391 grades a <strong>finished product</strong>; a half-learned "cooler" framework is the number-one cause of teams stalling before Milestone 2.</div>
<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Warm up your stack on Code Lab</span><span class="lc-sub">Spring Boot, SQL and React tracks — build the muscle memory before the project starts.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card exphub" href="/exp-hub/swp391-cong-cu-du-an?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Tools guide — Git/GitHub, Jira, Figma &amp; Docker</span><span class="lc-sub">Exp Hub · the project team toolchain.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout">📎 Attached to this lesson: <strong>the original SWP391.pdf syllabus</strong> — the university's official version, for reference.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; chọn stack</h2>
<h3>Giáo trình &amp; khóa học</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Software Engineering — Ian Sommerville (Pearson, 10th)</div><div class="lz-ld">Sách gối đầu về SDLC, yêu cầu, thiết kế và quy trình. Đọc chương yêu cầu &amp; kiến trúc trước Milestone 1.</div></div>
  <div class="lz-layer"><div class="lz-lt">Spring MVC with Spring Boot (Packt / Coursera)</div><div class="lz-ld">Nếu stack là Java — đường ngắn nhất từ Servlet PRJ301 tới một app Spring hiện đại.</div></div>
  <div class="lz-layer"><div class="lz-lt">ASP.NET Core MVC Fundamentals &amp; CRUD (Packt / Coursera)</div><div class="lz-ld">Nếu stack là .NET — MVC và CRUD theo cách C#.</div></div>
  <div class="lz-layer"><div class="lz-lt">Prompt Engineering for Developers (OpenAI &amp; DeepLearning.AI)</div><div class="lz-ld">Cách dùng GenAI như đồng đội coding/testing — phần AI-augmented của syllabus.</div></div>
</div>
<h3>Công cụ theo giai đoạn</h3>
<table>
  <thead><tr><th>Giai đoạn</th><th>Công cụ</th></tr></thead>
  <tbody>
    <tr><td>Yêu cầu &amp; thiết kế</td><td>Miro, Lucidchart, Figma, Draw.io, ChatGPT/Gemini</td></tr>
    <tr><td>Coding &amp; debug</td><td>IntelliJ IDEA / VS Code / Visual Studio, GitHub Copilot</td></tr>
    <tr><td>Cơ sở dữ liệu</td><td>MySQL Workbench, SSMS, pgAdmin</td></tr>
    <tr><td>Kiểm thử</td><td>JUnit, NUnit, Postman, Selenium</td></tr>
    <tr><td>Quản lý dự án</td><td>Jira, Trello, Notion, Git/GitHub</td></tr>
    <tr><td>Triển khai</td><td>Docker, Vercel, AWS/Azure/GCP</td></tr>
  </tbody>
</table>
<h3>Ba stack phổ biến — chọn cái nhóm đã biết</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Java</div><div class="lz-t">Spring Boot + MySQL</div><div class="lz-d">Bước tiếp tự nhiên sau PRJ301 · front Thymeleaf/React</div></div>
  <div class="lz-step"><div class="lz-k">.NET</div><div class="lz-t">ASP.NET Core MVC + SQL Server</div><div class="lz-d">Bộ công cụ mạnh trong Visual Studio</div></div>
  <div class="lz-step"><div class="lz-k">Node</div><div class="lz-t">Express/Nest + PostgreSQL + React</div><div class="lz-d">Một ngôn ngữ (JS/TS) suốt front-to-back</div></div>
</div>
<div class="pitfall"><em>Đừng</em> chọn stack vì trông "oách". Chọn cái mà ít nhất hai thành viên đã dựng được một màn hình CRUD. SWP391 chấm <strong>sản phẩm hoàn thiện</strong>; một framework "ngầu" học nửa vời là nguyên nhân số một khiến nhóm chết đứng trước Milestone 2.</div>
<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Khởi động stack trên Code Lab</span><span class="lc-sub">Track Spring Boot, SQL và React — luyện phản xạ trước khi đồ án bắt đầu.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card exphub" href="/exp-hub/swp391-cong-cu-du-an?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Bộ công cụ — Git/GitHub, Jira, Figma &amp; Docker</span><span class="lc-sub">Exp Hub · bộ công cụ chạy dự án nhóm.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout">📎 File đính kèm mục này: <strong>syllabus gốc SWP391.pdf</strong> — bản chính thức của trường, dùng để đối chiếu.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — KICKOFF ══════════════════ */
    {
      title: 'Chapter 1 — Kickoff: topic, team, AI-augmented SDLC & Git|||Chương 1 — Khởi động: đề tài, nhóm, SDLC có AI & Git',
      description: 'Chọn đề tài & tech stack, lập nhóm và phân vai, hiểu SDLC có AI hỗ trợ, và thiết lập Git workflow.',
      lessons: [
        {
          title: '1.1 — Choosing a topic, forming the team & roles|||1.1 — Chọn đề tài, lập nhóm & phân vai',
          slug: 'swp391-1-1-de-tai-nhom-vai-tro',
          type: 'VIDEO',
          description: 'Tiêu chí một đề tài vừa sức, cách phân vai và lập kế hoạch phase.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Choosing a topic &amp; forming the team</h2>
<p class="lead">The topic decides your whole semester. The best SWP391 topics are <strong>small in scope but complete in shape</strong>: a system with users, a few entities, one core transaction, and a report. Think "clinic appointment booking" or "course registration", not "a social network like Facebook".</p>
<h3>A good topic checklist</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Has a clear user &amp; goal</div><div class="lz-nsub">"A manager tracks stock so items never run out" — one sentence.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">5–8 core entities</div><div class="lz-nsub">User, Product, Order, Category… enough for a real ERD, not 40 tables.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">One core transaction flow</div><div class="lz-nsub">The "money path": place order → pay → confirm. This is Workflow 2.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Buildable by your team</div><div class="lz-nsub">No payment gateway, no ML model, no live video — unless a member has shipped it before.</div></div></div>
</div>
<h3>Team roles (4–5 people)</h3>
<p>Everyone codes, but each person <em>owns</em> an area so nothing falls through the cracks:</p>
<table>
  <thead><tr><th>Role</th><th>Owns</th></tr></thead>
  <tbody>
    <tr><td>Team Leader / Scrum Master</td><td>Plan, standups, milestone submissions, unblocking people</td></tr>
    <tr><td>Backend / Database lead</td><td>ERD, schema, Repository/Service layer, API</td></tr>
    <tr><td>Frontend / UI lead</td><td>Wireframes, views, UX consistency</td></tr>
    <tr><td>QA / Test lead</td><td>Test plan, unit/integration tests, bug tracking</td></tr>
    <tr><td>DevOps / Docs lead</td><td>Git discipline, deployment, the final report</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Scope creep</b> is the silent killer. "Let's also add chat, and notifications, and an admin analytics dashboard…" — every extra feature added mid-project is a feature not finished. Freeze the scope after Milestone 1; write new ideas in a "v2 / future work" list and defend <em>that discipline</em> as maturity.</div>
<div class="note-ct">Get the topic and tech stack <strong>approved by your teacher before writing any code</strong> (a syllabus rule). Bring the one-sentence goal, the entity list, and the core flow — approval is fast when the scope is clearly bounded.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Chọn đề tài &amp; lập nhóm</h2>
<p class="lead">Đề tài quyết định cả học kỳ. Đề tài SWP391 tốt nhất là <strong>phạm vi nhỏ nhưng hình dạng đầy đủ</strong>: một hệ thống có người dùng, vài thực thể, một luồng giao dịch lõi, và một báo cáo. Hãy nghĩ "đặt lịch khám phòng khám" hay "đăng ký môn học", đừng nghĩ "mạng xã hội như Facebook".</p>
<h3>Checklist một đề tài tốt</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Có người dùng &amp; mục tiêu rõ</div><div class="lz-nsub">"Quản lý theo dõi kho để không hết hàng" — một câu.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">5–8 thực thể lõi</div><div class="lz-nsub">User, Product, Order, Category… đủ cho một ERD thật, không phải 40 bảng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Một luồng giao dịch lõi</div><div class="lz-nsub">"Đường tiền": đặt đơn → thanh toán → xác nhận. Đây là Workflow 2.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nhóm làm được</div><div class="lz-nsub">Không cổng thanh toán, không mô hình ML, không video trực tiếp — trừ khi có thành viên từng làm.</div></div></div>
</div>
<h3>Vai trò trong nhóm (4–5 người)</h3>
<p>Ai cũng code, nhưng mỗi người <em>làm chủ</em> một mảng để không việc nào lọt kẽ:</p>
<table>
  <thead><tr><th>Vai trò</th><th>Làm chủ</th></tr></thead>
  <tbody>
    <tr><td>Trưởng nhóm / Scrum Master</td><td>Kế hoạch, standup, nộp milestone, gỡ vướng cho mọi người</td></tr>
    <tr><td>Backend / Database lead</td><td>ERD, schema, lớp Repository/Service, API</td></tr>
    <tr><td>Frontend / UI lead</td><td>Wireframe, view, tính nhất quán UX</td></tr>
    <tr><td>QA / Test lead</td><td>Test plan, unit/integration test, quản lý bug</td></tr>
    <tr><td>DevOps / Docs lead</td><td>Kỷ luật Git, triển khai, báo cáo cuối</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Scope creep</b> (phình phạm vi) là sát thủ thầm lặng. "Thêm cả chat, cả thông báo, cả dashboard phân tích cho admin…" — mỗi chức năng thêm giữa chừng là một chức năng không kịp hoàn thành. Đóng băng phạm vi sau Milestone 1; ghi ý mới vào danh sách "v2 / hướng phát triển" và bảo vệ chính <em>sự kỷ luật đó</em> như dấu hiệu trưởng thành.</div>
<div class="note-ct">Hãy để giảng viên <strong>duyệt đề tài và tech stack trước khi viết bất kỳ dòng code nào</strong> (quy định syllabus). Mang theo câu mục tiêu, danh sách thực thể, và luồng lõi — duyệt sẽ nhanh khi phạm vi được giới hạn rõ.</div>
</div>
`,
        },
        {
          title: '1.2 — AI-augmented SDLC & the team Git workflow|||1.2 — SDLC có AI hỗ trợ & Git workflow của nhóm',
          slug: 'swp391-1-2-ai-sdlc-git-workflow',
          type: 'VIDEO',
          description: 'AI xen vào từng pha của SDLC, và feature-branch workflow với pull request.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>AI-augmented SDLC — AI as a teammate, not the author</h2>
<p class="lead">The classic SDLC has five phases: <strong>Requirements → Design → Implementation → Testing → Deployment</strong>. The 2026 syllabus asks you to accelerate each with GenAI — while <em>you</em> stay accountable for correctness.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Requirements</div><div class="lz-ld">AI role-plays a domain expert, drafts user stories, spots missing edge cases — you verify against the real stakeholder.</div></div>
  <div class="lz-layer"><div class="lz-lt">Design</div><div class="lz-ld">AI suggests an ERD from your description, proposes MVC module boundaries — you check normalization and relationships.</div></div>
  <div class="lz-layer"><div class="lz-lt">Implementation</div><div class="lz-ld">Copilot autocompletes boilerplate, explains errors — you review every line before merging.</div></div>
  <div class="lz-layer"><div class="lz-lt">Testing</div><div class="lz-ld">AI generates test cases and edge inputs — you confirm they actually assert the right behavior.</div></div>
</div>
<div class="callout warn">The golden rule: <strong>AI drafts, you decide</strong>. Never commit code, a schema, or a requirement you cannot explain. In the defense the committee asks "why is this here?" — "the AI wrote it" is a failing answer.</div>
<h3>The team Git workflow — feature branches + pull requests</h3>
<p>Everyone working on <code>main</code> at once is chaos. The professional pattern: <code>main</code> always stays deployable; each feature grows on its own branch and merges back through a reviewed <strong>pull request (PR)</strong>.</p>
<pre><span class="tok-comment"># 1) Start a feature from an up-to-date main</span>
git checkout main
git pull origin main
git checkout -b feature/login

<span class="tok-comment"># 2) Work, then stage &amp; commit small, meaningful steps</span>
git add .
git commit -m "feat(auth): add login form and validation"

<span class="tok-comment"># 3) Push the branch and open a Pull Request on GitHub</span>
git push -u origin feature/login

<span class="tok-comment"># 4) A teammate reviews, approves, then you merge into main</span>
<span class="tok-comment">#    main is now updated — everyone else pulls it</span></pre>
<h3>Ví dụ có lời giải · Worked example (a clean feature branch)</h3>
<p>Lan implements "search products". She branches from a fresh <code>main</code>, commits twice, and opens a PR:</p>
<pre><span class="tok-comment"># Lan's session, step by step</span>
git checkout main &amp;&amp; git pull            <span class="tok-comment"># 1. latest code</span>
git checkout -b feature/product-search    <span class="tok-comment"># 2. isolated branch</span>
<span class="tok-comment"># ...writes ProductService.search() + a view...</span>
git commit -am "feat(catalog): search products by name"
<span class="tok-comment"># ...writes a test...</span>
git commit -am "test(catalog): cover empty search result"
git push -u origin feature/product-search <span class="tok-comment"># 3. push</span>
<span class="tok-comment"># 4. opens PR -> Minh reviews -> approve -> Squash &amp; merge</span></pre>
<div class="out"><b>Result:</b> <code>main</code> now has "search products" as one reviewed, tested unit. If it had broken something, the bug lives on a branch — never on the shared <code>main</code> the whole team depends on.</div>
<div class="pitfall"><b>Not committing often</b> and <b>working directly on main</b> are the two habits that cause the worst team pain: giant unreviewable commits, merge conflicts that take a day, and a broken <code>main</code> that blocks everyone. Commit small, push daily, never push straight to <code>main</code>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Trunk-based vs Git Flow.</b> Your course uses simple feature branches — great for a 5-person team. Industry has two philosophies: <b>Git Flow</b> (long-lived develop/release/hotfix branches, good for versioned products with scheduled releases) and <b>trunk-based development</b> (tiny short-lived branches merged to trunk many times a day behind <em>feature flags</em>, the model behind continuous deployment at Google/Meta). Knowing both — and why fast-moving teams prefer trunk-based — is a strong thing to mention in your defense.</div>
<a class="link-card exphub" href="/exp-hub/git-workflow?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🌿</span>
  <span class="lc-body"><span class="lc-title">Git branching &amp; pull requests — full guide</span><span class="lc-sub">Branch, resolve conflicts, review PRs — step by step on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>SDLC có AI hỗ trợ — AI là đồng đội, không phải tác giả</h2>
<p class="lead">SDLC kinh điển có năm pha: <strong>Yêu cầu → Thiết kế → Hiện thực → Kiểm thử → Triển khai</strong>. Syllabus 2026 yêu cầu bạn tăng tốc mỗi pha bằng GenAI — trong khi <em>bạn</em> vẫn chịu trách nhiệm về tính đúng đắn.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Yêu cầu</div><div class="lz-ld">AI đóng vai chuyên gia lĩnh vực, phác user story, chỉ ra edge case thiếu — bạn kiểm chứng với stakeholder thật.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thiết kế</div><div class="lz-ld">AI gợi ý ERD từ mô tả, đề xuất ranh giới module MVC — bạn kiểm chuẩn hóa và quan hệ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hiện thực</div><div class="lz-ld">Copilot tự hoàn thành code khuôn mẫu, giải thích lỗi — bạn review từng dòng trước khi merge.</div></div>
  <div class="lz-layer"><div class="lz-lt">Kiểm thử</div><div class="lz-ld">AI sinh test case và input biên — bạn xác nhận chúng thật sự kiểm đúng hành vi.</div></div>
</div>
<div class="callout warn">Quy tắc vàng: <strong>AI phác, bạn quyết</strong>. Đừng bao giờ commit một đoạn code, một schema, hay một yêu cầu mà bạn không giải thích được. Trong buổi bảo vệ hội đồng hỏi "vì sao có cái này?" — "AI viết ạ" là câu trả lời trượt.</div>
<h3>Git workflow của nhóm — feature branch + pull request</h3>
<p>Cả nhóm cùng làm trên <code>main</code> là hỗn loạn. Mẫu chuyên nghiệp: <code>main</code> luôn ở trạng thái deploy được; mỗi tính năng lớn lên trên nhánh riêng và gộp lại qua một <strong>pull request (PR)</strong> có review.</p>
<pre><span class="tok-comment"># 1) Bắt đầu tính năng từ main mới nhất</span>
git checkout main
git pull origin main
git checkout -b feature/login

<span class="tok-comment"># 2) Làm việc, rồi stage &amp; commit từng bước nhỏ có ý nghĩa</span>
git add .
git commit -m "feat(auth): them form dang nhap va validation"

<span class="tok-comment"># 3) Đẩy nhánh và mở Pull Request trên GitHub</span>
git push -u origin feature/login

<span class="tok-comment"># 4) Đồng đội review, duyệt, rồi bạn merge vào main</span>
<span class="tok-comment">#    main giờ đã cập nhật — mọi người khác pull về</span></pre>
<h3>Ví dụ có lời giải · Worked example (một nhánh tính năng sạch)</h3>
<p>Lan làm "tìm kiếm sản phẩm". Cô nhánh ra từ <code>main</code> mới, commit hai lần, rồi mở PR:</p>
<pre><span class="tok-comment"># Phiên làm việc của Lan, từng bước</span>
git checkout main &amp;&amp; git pull            <span class="tok-comment"># 1. code mới nhất</span>
git checkout -b feature/product-search    <span class="tok-comment"># 2. nhánh cô lập</span>
<span class="tok-comment"># ...viết ProductService.search() + một view...</span>
git commit -am "feat(catalog): tim san pham theo ten"
<span class="tok-comment"># ...viết một test...</span>
git commit -am "test(catalog): phu ket qua tim rong"
git push -u origin feature/product-search <span class="tok-comment"># 3. đẩy lên</span>
<span class="tok-comment"># 4. mở PR -> Minh review -> duyệt -> Squash &amp; merge</span></pre>
<div class="out"><b>Kết quả:</b> <code>main</code> giờ có "tìm sản phẩm" như một đơn vị đã review, đã test. Nếu nó có làm hỏng gì, bug nằm trên nhánh — không bao giờ trên <code>main</code> chung mà cả nhóm phụ thuộc.</div>
<div class="pitfall"><b>Không commit thường xuyên</b> và <b>làm thẳng trên main</b> là hai thói quen gây đau đớn nhất cho nhóm: commit khổng lồ không review nổi, xung đột merge tốn cả ngày, và một <code>main</code> hỏng chặn tất cả. Commit nhỏ, đẩy mỗi ngày, không bao giờ push thẳng vào <code>main</code>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trunk-based vs Git Flow.</b> Môn của bạn dùng feature branch đơn giản — hợp cho nhóm 5 người. Ngành có hai triết lý: <b>Git Flow</b> (nhánh develop/release/hotfix sống lâu, hợp sản phẩm đánh phiên bản, phát hành theo lịch) và <b>trunk-based development</b> (nhánh siêu ngắn gộp vào trunk nhiều lần mỗi ngày sau <em>feature flag</em>, mô hình đằng sau continuous deployment ở Google/Meta). Biết cả hai — và vì sao đội đi nhanh ưa trunk-based — là điểm mạnh để nhắc trong buổi bảo vệ.</div>
<a class="link-card exphub" href="/exp-hub/git-workflow?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🌿</span>
  <span class="lc-body"><span class="lc-title">Git branching &amp; pull request — hướng dẫn đầy đủ</span><span class="lc-sub">Nhánh, gỡ xung đột, review PR — từng bước trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — Kickoff, AI-SDLC & Git|||Quiz 1 — Khởi động, AI-SDLC & Git',
          slug: 'swp391-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra chọn đề tài, phân vai, SDLC có AI và Git workflow.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The best SWP391 topic is one that is…|||Đề tài SWP391 tốt nhất là đề tài…', options: ['as large and impressive as possible|||càng lớn và oách càng tốt', 'small in scope but complete in shape|||phạm vi nhỏ nhưng hình dạng đầy đủ', 'copied from a real company|||sao chép từ một công ty thật', 'chosen after coding starts|||chọn sau khi đã code'], correctIndex: 1, points: 1 },
              { question: 'Scope creep is dangerous because…|||Scope creep nguy hiểm vì…', options: ['it makes the ERD smaller|||làm ERD nhỏ đi', 'every feature added mid-project is one not finished|||mỗi chức năng thêm giữa chừng là một cái không kịp hoàn thành', 'it speeds up the team|||làm nhóm nhanh hơn', 'teachers require it|||giảng viên bắt buộc'], correctIndex: 1, points: 1 },
              { question: 'In an AI-augmented SDLC, the golden rule is…|||Trong SDLC có AI, quy tắc vàng là…', options: ['let the AI author everything|||để AI viết tất cả', 'AI drafts, you decide and stay accountable|||AI phác, bạn quyết và chịu trách nhiệm', 'never use AI at all|||không dùng AI gì cả', 'only use AI for the report|||chỉ dùng AI cho báo cáo'], correctIndex: 1, points: 1 },
              { question: 'Why keep main always deployable and use feature branches?|||Vì sao giữ main luôn deploy được và dùng feature branch?', options: ['it looks professional|||cho oách', 'a broken feature stays on a branch, never on shared main|||tính năng hỏng nằm trên nhánh, không lên main chung', 'branches run faster|||nhánh chạy nhanh hơn', 'it avoids writing tests|||để khỏi viết test'], correctIndex: 1, points: 1 },
              { question: 'A pull request exists so that…|||Pull request tồn tại để…', options: ['code is reviewed before it enters main|||code được review trước khi vào main', 'you can skip commits|||bỏ qua commit', 'the database is deleted|||xoá cơ sở dữ liệu', 'main is bypassed|||bỏ qua main'], correctIndex: 0, points: 1 },
              { question: 'Trunk-based development typically relies on… to merge unfinished work safely. (beyond-syllabus)|||Trunk-based development thường dựa vào… để gộp việc chưa xong an toàn. (ngoài giáo trình)', options: ['longer branches|||nhánh dài hơn', 'feature flags|||feature flag', 'fewer commits|||ít commit hơn', 'no code review|||không review'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — MILESTONE 1: REQUIREMENT ANALYSIS ══════════════════ */
    {
      title: 'Chapter 2 — Milestone 1: Requirement Analysis|||Chương 2 — Milestone 1: Phân tích yêu cầu',
      description: 'Elicitation, SRS, use case, user story và product backlog — nền móng của cả đồ án.',
      lessons: [
        {
          title: '2.1 — Elicitation, functional vs non-functional, the SRS|||2.1 — Thu thập yêu cầu, chức năng vs phi chức năng, SRS',
          slug: 'swp391-2-1-elicitation-srs',
          type: 'VIDEO',
          description: 'Moi ra yêu cầu thật, phân loại chức năng/phi chức năng, và cấu trúc một SRS.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Getting the requirements right — before any code</h2>
<p class="lead">A study every software engineering course quotes: the cost of fixing a mistake grows ~10× at each phase it survives. A wrong requirement caught now costs a conversation; caught after coding it costs a rewrite. Milestone 1 exists to catch them <strong>now</strong>.</p>
<h3>Elicitation — how you discover requirements</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Interview</div><div class="lz-t">Ask the stakeholder</div><div class="lz-d">"Walk me through your day"</div></div>
  <div class="lz-step"><div class="lz-k">Observe</div><div class="lz-t">Watch the real process</div><div class="lz-d">The spreadsheet they actually use</div></div>
  <div class="lz-step"><div class="lz-k">AI role-play</div><div class="lz-t">Simulate a domain expert</div><div class="lz-d">Probe for missing cases</div></div>
</div>
<h3>Functional vs non-functional requirements</h3>
<table>
  <thead><tr><th></th><th>Functional (FR)</th><th>Non-functional (NFR)</th></tr></thead>
  <tbody>
    <tr><td>Answers</td><td><em>What</em> the system does</td><td><em>How well</em> it does it</td></tr>
    <tr><td>Example</td><td>"A user can reset their password by email"</td><td>"A page loads in under 2 seconds"</td></tr>
    <tr><td>Also</td><td>"Admin can export orders to CSV"</td><td>Security, usability, availability, scalability</td></tr>
  </tbody>
</table>
<h3>The SRS — Software Requirements Specification</h3>
<p>The SRS is Milestone 1's main document. A lean, effective structure:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1. Introduction &amp; scope</div><div class="lz-ld">The one-sentence goal, who the users are, what is in/out of scope.</div></div>
  <div class="lz-layer"><div class="lz-lt">2. Functional requirements</div><div class="lz-ld">Grouped by feature, each numbered (FR-1, FR-2…) so tests can trace back to them.</div></div>
  <div class="lz-layer"><div class="lz-lt">3. Non-functional requirements</div><div class="lz-ld">Performance, security, usability — measurable where possible.</div></div>
  <div class="lz-layer"><div class="lz-lt">4. Use cases &amp; user stories</div><div class="lz-ld">The behaviour in the users' words (lesson 2.2).</div></div>
</div>
<div class="pitfall">Vague requirements like "the system should be fast/user-friendly/secure" are untestable. Make them concrete: "search returns results in &lt; 2s for 10,000 products", "passwords are stored hashed with bcrypt". If you cannot write a test for it, it is not yet a requirement.</div>
<div class="note-ct">Use AI well here: paste your draft FR list and ask "what edge cases or error paths am I missing?" — it often surfaces the forgotten "what if the item is out of stock?" flows that later become Workflow 2's exception path. Then verify each suggestion against your actual stakeholder.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Làm đúng yêu cầu — trước khi viết code</h2>
<p class="lead">Một nghiên cứu mọi môn kỹ nghệ phần mềm đều trích: chi phí sửa một lỗi tăng ~10× ở mỗi pha nó sống sót qua. Một yêu cầu sai bắt được bây giờ tốn một cuộc trò chuyện; bắt được sau khi đã code tốn một lần viết lại. Milestone 1 tồn tại để bắt chúng <strong>ngay bây giờ</strong>.</p>
<h3>Elicitation — cách khám phá yêu cầu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Phỏng vấn</div><div class="lz-t">Hỏi stakeholder</div><div class="lz-d">"Kể em nghe một ngày của anh/chị"</div></div>
  <div class="lz-step"><div class="lz-k">Quan sát</div><div class="lz-t">Xem quy trình thật</div><div class="lz-d">Cái Excel họ đang thật sự dùng</div></div>
  <div class="lz-step"><div class="lz-k">AI role-play</div><div class="lz-t">Giả lập chuyên gia</div><div class="lz-d">Dò các trường hợp còn thiếu</div></div>
</div>
<h3>Yêu cầu chức năng vs phi chức năng</h3>
<table>
  <thead><tr><th></th><th>Chức năng (FR)</th><th>Phi chức năng (NFR)</th></tr></thead>
  <tbody>
    <tr><td>Trả lời</td><td>Hệ thống làm <em>gì</em></td><td>Làm <em>tốt đến đâu</em></td></tr>
    <tr><td>Ví dụ</td><td>"Người dùng đặt lại mật khẩu qua email"</td><td>"Một trang tải dưới 2 giây"</td></tr>
    <tr><td>Còn nữa</td><td>"Admin xuất đơn hàng ra CSV"</td><td>Bảo mật, dễ dùng, sẵn sàng, mở rộng</td></tr>
  </tbody>
</table>
<h3>SRS — Đặc tả yêu cầu phần mềm</h3>
<p>SRS là tài liệu chính của Milestone 1. Một cấu trúc gọn, hiệu quả:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1. Giới thiệu &amp; phạm vi</div><div class="lz-ld">Câu mục tiêu, người dùng là ai, cái gì trong/ngoài phạm vi.</div></div>
  <div class="lz-layer"><div class="lz-lt">2. Yêu cầu chức năng</div><div class="lz-ld">Nhóm theo tính năng, mỗi cái đánh số (FR-1, FR-2…) để test truy vết ngược về được.</div></div>
  <div class="lz-layer"><div class="lz-lt">3. Yêu cầu phi chức năng</div><div class="lz-ld">Hiệu năng, bảo mật, dễ dùng — đo được nếu có thể.</div></div>
  <div class="lz-layer"><div class="lz-lt">4. Use case &amp; user story</div><div class="lz-ld">Hành vi bằng lời của người dùng (bài 2.2).</div></div>
</div>
<div class="pitfall">Yêu cầu mơ hồ như "hệ thống phải nhanh/thân thiện/bảo mật" không test được. Hãy cụ thể hóa: "tìm kiếm trả kết quả dưới 2s với 10.000 sản phẩm", "mật khẩu lưu dạng băm bcrypt". Nếu không viết được test cho nó, nó chưa phải một yêu cầu.</div>
<div class="note-ct">Dùng AI khéo ở đây: dán danh sách FR nháp và hỏi "tôi còn thiếu edge case hay đường lỗi nào?" — nó hay lộ ra luồng bị quên "nếu hàng hết thì sao?" mà về sau thành đường ngoại lệ của Workflow 2. Rồi kiểm chứng mỗi gợi ý với stakeholder thật.</div>
</div>
`,
        },
        {
          title: '2.2 — Use cases, user stories & the product backlog|||2.2 — Use case, user story & product backlog',
          slug: 'swp391-2-2-use-case-backlog',
          type: 'VIDEO',
          description: 'Viết use case, user story chuẩn INVEST, và sắp product backlog theo ưu tiên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Turning requirements into buildable pieces</h2>
<p class="lead">An SRS says <em>what</em> the system does; a <strong>use case</strong> and <strong>user story</strong> say it in a way you can design, estimate and test. The <strong>product backlog</strong> then orders them so you build the most valuable thing first.</p>
<h3>A use case — an actor achieving a goal</h3>
<pre><span class="tok-comment">Use Case: Place an order</span>
Actor:        Customer
Precondition: Customer is logged in, cart is not empty
Main flow:
  1. Customer opens the cart and clicks "Checkout"
  2. System shows order summary and total
  3. Customer confirms
  4. System creates the order, decreases stock, shows confirmation
Alternative / exception:
  3a. An item is out of stock -&gt; System warns, removes it, recalculates
Postcondition: An order exists with status = CONFIRMED</pre>
<h3>A user story — value in one sentence (INVEST)</h3>
<p>Format: <em>"As a &lt;role&gt;, I want &lt;goal&gt; so that &lt;benefit&gt;."</em> Good stories are <strong>INVEST</strong>: Independent, Negotiable, Valuable, Estimable, Small, Testable.</p>
<pre><span class="tok-comment"># A user story with acceptance criteria</span>
As a customer, I want to reset my password by email
so that I can get back in if I forget it.

Acceptance criteria:
  - Given a registered email, a reset link is sent
  - The link expires after 30 minutes
  - After reset, the old password no longer works</pre>
<h3>The product backlog — an ordered to-do list</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Workflow 0 · Auth (highest priority)</div><div class="lz-ld">Register / login / logout / forgot password — every app needs it first.</div></div>
  <div class="lz-layer"><div class="lz-lt">Workflow 1 · Master data CRUD</div><div class="lz-ld">Manage the reference tables (products, categories, users).</div></div>
  <div class="lz-layer"><div class="lz-lt">Workflow 2 · Core transaction</div><div class="lz-ld">The money path — success and exception. The heart of Milestone 2.</div></div>
  <div class="lz-layer"><div class="lz-lt">Workflow 3 · Dashboard &amp; reporting (later)</div><div class="lz-ld">Summaries and charts — valuable but not first.</div></div>
</div>
<h3>Ví dụ có lời giải · Worked example (requirement → story → backlog item)</h3>
<p>Take the raw need "customers should be able to find products". Walk it down:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · FR</div><div class="lz-t">FR-7: search products</div><div class="lz-d">by name, case-insensitive</div></div>
  <div class="lz-step"><div class="lz-k">2 · Story</div><div class="lz-t">"As a customer I want to search by name so I find items fast"</div><div class="lz-d">Testable</div></div>
  <div class="lz-step"><div class="lz-k">3 · Criteria</div><div class="lz-t">Empty query shows all; no match shows a friendly message</div><div class="lz-d">Edge cases</div></div>
  <div class="lz-step"><div class="lz-k">4 · Backlog</div><div class="lz-t">Placed in Workflow 1, priority Medium</div><div class="lz-d">Ready to build</div></div>
</div>
<div class="out"><b>Now it is buildable:</b> the backend lead can design the query, the QA lead already knows the two test cases (empty query, no-match), and the story is small enough to finish in one branch.</div>
<div class="pitfall">Don't write giant stories ("As a user I want the whole ordering system"). They can't be estimated or tested. Split until each story fits comfortably in a few days and has clear acceptance criteria — the "S" and "T" of INVEST.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Definition of Done (DoD).</b> Mature teams agree, up front, on what "done" means for <em>every</em> story — e.g. "code merged to main, unit test passing, reviewed by one teammate, no known bug, deployed to staging". Without a DoD, "done" quietly means "works on my machine" and bugs pile up for Milestone 3. Write your team's DoD on the wall and defend it: it is exactly the professional-maturity signal CLO5 rewards.</div>
<a class="link-card exphub" href="/exp-hub/agile-scrum?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">Backlog, sprints &amp; standups on a board</span><span class="lc-sub">Run your project in Jira/Trello the agile way — guide on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Biến yêu cầu thành mảnh xây được</h2>
<p class="lead">SRS nói hệ thống làm <em>gì</em>; một <strong>use case</strong> và <strong>user story</strong> nói theo cách bạn thiết kế, ước lượng và test được. <strong>Product backlog</strong> rồi sắp thứ tự chúng để bạn xây thứ giá trị nhất trước.</p>
<h3>Use case — một tác nhân đạt một mục tiêu</h3>
<pre><span class="tok-comment">Use Case: Đặt đơn hàng</span>
Tác nhân:     Khách hàng
Điều kiện đầu: Đã đăng nhập, giỏ hàng không rỗng
Luồng chính:
  1. Khách mở giỏ và bấm "Thanh toán"
  2. Hệ thống hiện tóm tắt đơn và tổng tiền
  3. Khách xác nhận
  4. Hệ thống tạo đơn, trừ tồn kho, hiện xác nhận
Luồng thay thế / ngoại lệ:
  3a. Một món đã hết hàng -&gt; Hệ thống cảnh báo, bỏ món, tính lại
Điều kiện cuối: Tồn tại một đơn với trạng thái = CONFIRMED</pre>
<h3>User story — giá trị trong một câu (INVEST)</h3>
<p>Mẫu: <em>"Là một &lt;vai trò&gt;, tôi muốn &lt;mục tiêu&gt; để &lt;lợi ích&gt;."</em> Story tốt đạt <strong>INVEST</strong>: Độc lập, Thương lượng được, Có giá trị, Ước lượng được, Nhỏ, Test được.</p>
<pre><span class="tok-comment"># Một user story kèm tiêu chí chấp nhận</span>
Là một khách hàng, tôi muốn đặt lại mật khẩu qua email
để lấy lại tài khoản nếu quên.

Tiêu chí chấp nhận:
  - Email đã đăng ký -&gt; gửi được link đặt lại
  - Link hết hạn sau 30 phút
  - Sau khi đặt lại, mật khẩu cũ không dùng được nữa</pre>
<h3>Product backlog — danh sách việc có thứ tự</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Workflow 0 · Xác thực (ưu tiên cao nhất)</div><div class="lz-ld">Đăng ký / đăng nhập / đăng xuất / quên mật khẩu — mọi app cần đầu tiên.</div></div>
  <div class="lz-layer"><div class="lz-lt">Workflow 1 · CRUD dữ liệu gốc</div><div class="lz-ld">Quản lý các bảng tham chiếu (sản phẩm, danh mục, người dùng).</div></div>
  <div class="lz-layer"><div class="lz-lt">Workflow 2 · Giao dịch lõi</div><div class="lz-ld">Đường tiền — thành công và ngoại lệ. Trái tim của Milestone 2.</div></div>
  <div class="lz-layer"><div class="lz-lt">Workflow 3 · Dashboard &amp; báo cáo (sau)</div><div class="lz-ld">Tổng hợp và biểu đồ — giá trị nhưng không phải đầu tiên.</div></div>
</div>
<h3>Ví dụ có lời giải · Worked example (yêu cầu → story → mục backlog)</h3>
<p>Lấy nhu cầu thô "khách nên tìm được sản phẩm". Đi xuống từng bước:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · FR</div><div class="lz-t">FR-7: tìm sản phẩm</div><div class="lz-d">theo tên, không phân biệt hoa thường</div></div>
  <div class="lz-step"><div class="lz-k">2 · Story</div><div class="lz-t">"Là khách tôi muốn tìm theo tên để thấy món nhanh"</div><div class="lz-d">Test được</div></div>
  <div class="lz-step"><div class="lz-k">3 · Tiêu chí</div><div class="lz-t">Query rỗng hiện tất cả; không khớp hiện thông báo thân thiện</div><div class="lz-d">Edge case</div></div>
  <div class="lz-step"><div class="lz-k">4 · Backlog</div><div class="lz-t">Đặt vào Workflow 1, ưu tiên Trung bình</div><div class="lz-d">Sẵn sàng xây</div></div>
</div>
<div class="out"><b>Giờ nó xây được:</b> backend lead thiết kế được query, QA lead đã biết trước hai test case (query rỗng, không khớp), và story đủ nhỏ để xong trong một nhánh.</div>
<div class="pitfall">Đừng viết story khổng lồ ("Là người dùng tôi muốn cả hệ thống đặt hàng"). Không ước lượng hay test được. Chia nhỏ tới khi mỗi story gọn trong vài ngày và có tiêu chí chấp nhận rõ — chữ "S" và "T" của INVEST.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Definition of Done (DoD).</b> Nhóm trưởng thành thống nhất từ đầu "done" nghĩa là gì cho <em>mọi</em> story — vd "code đã merge vào main, unit test pass, một đồng đội đã review, không bug đã biết, đã deploy staging". Không có DoD, "xong" lặng lẽ thành "chạy trên máy tôi" và bug dồn tới Milestone 3. Viết DoD của nhóm lên tường và bảo vệ nó: đó đúng là tín hiệu trưởng thành nghề nghiệp mà CLO5 chấm.</div>
<a class="link-card exphub" href="/exp-hub/agile-scrum?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">Backlog, sprint &amp; standup trên bảng</span><span class="lc-sub">Chạy đồ án trong Jira/Trello theo cách agile — hướng dẫn trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Milestone 1 — Requirement checklist|||Milestone 1 — Checklist yêu cầu',
          slug: 'swp391-milestone-1-checklist',
          type: 'VIDEO',
          description: 'Danh sách kiểm trước khi nộp Milestone 1 (yêu cầu & thiết kế, 15%).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Milestone 1</span>
<h2>Milestone 1 submission checklist (Week 3 · 15%)</h2>
<p class="lead">Milestone 1 covers requirements <em>and</em> design (Chapter 3). Use this as your team's gate before you present — a reviewer ticks almost exactly these boxes.</p>
<div class="out">
<b>Requirements</b>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ One-sentence project goal &amp; clear scope (in/out)</div><div class="lz-ld">Everyone on the team says the same sentence.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ SRS with numbered functional requirements</div><div class="lz-ld">FR-1…FR-n, grouped by feature.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Non-functional requirements, measurable</div><div class="lz-ld">Performance, security, usability — with numbers.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Use cases for the core flows + user stories with acceptance criteria</div><div class="lz-ld">At least the auth flow and the core transaction.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Product backlog, prioritised into Workflows 0–3</div><div class="lz-ld">In your Jira/Trello board.</div></div>
</div>
<b>Design (Chapter 3)</b>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ Conceptual + logical ERD</div><div class="lz-ld">Entities, attributes, relationships, keys.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ MVC module breakdown &amp; class diagram</div><div class="lz-ld">Controllers, services, models.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Database schema (normalised) + main API list</div><div class="lz-ld">Tables with constraints; endpoints per resource.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ UI wireframes for the core screens</div><div class="lz-ld">Figma/Draw.io — low fidelity is fine.</div></div>
</div>
<b>Process</b>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ Topic &amp; tech stack approved by the teacher</div><div class="lz-ld">A syllabus requirement before coding.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Git repo created, everyone has committed</div><div class="lz-ld">Individual contribution is graded.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Roles assigned &amp; documented</div><div class="lz-ld">Who owns what.</div></div>
</div>
</div>
<div class="callout ok">Milestone 1 is graded on <strong>clarity and consistency</strong>, not volume. A tight 15-page SRS whose ERD, use cases and backlog all agree beats a 60-page document that contradicts itself. Cross-check: every entity in the ERD should appear in a requirement, and every core requirement should have a use case.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Milestone 1</span>
<h2>Checklist nộp Milestone 1 (Tuần 3 · 15%)</h2>
<p class="lead">Milestone 1 bao gồm yêu cầu <em>và</em> thiết kế (Chương 3). Dùng đây làm cổng kiểm của nhóm trước khi trình bày — người chấm tick gần đúng các ô này.</p>
<div class="out">
<b>Yêu cầu</b>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ Câu mục tiêu &amp; phạm vi rõ (trong/ngoài)</div><div class="lz-ld">Cả nhóm nói cùng một câu.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ SRS với yêu cầu chức năng đánh số</div><div class="lz-ld">FR-1…FR-n, nhóm theo tính năng.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Yêu cầu phi chức năng, đo được</div><div class="lz-ld">Hiệu năng, bảo mật, dễ dùng — có con số.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Use case cho luồng lõi + user story có tiêu chí chấp nhận</div><div class="lz-ld">Ít nhất luồng xác thực và giao dịch lõi.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Product backlog, ưu tiên vào Workflow 0–3</div><div class="lz-ld">Trên bảng Jira/Trello.</div></div>
</div>
<b>Thiết kế (Chương 3)</b>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ ERD conceptual + logical</div><div class="lz-ld">Thực thể, thuộc tính, quan hệ, khóa.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Phân rã module MVC &amp; class diagram</div><div class="lz-ld">Controller, service, model.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Schema CSDL (chuẩn hóa) + danh sách API chính</div><div class="lz-ld">Bảng có ràng buộc; endpoint theo tài nguyên.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Wireframe UI cho màn hình lõi</div><div class="lz-ld">Figma/Draw.io — độ nét thấp cũng được.</div></div>
</div>
<b>Quy trình</b>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ Đề tài &amp; tech stack được giảng viên duyệt</div><div class="lz-ld">Quy định syllabus trước khi code.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Đã tạo repo Git, mọi người đã commit</div><div class="lz-ld">Đóng góp cá nhân bị chấm.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Đã phân vai &amp; ghi lại</div><div class="lz-ld">Ai làm chủ cái gì.</div></div>
</div>
</div>
<div class="callout ok">Milestone 1 chấm <strong>độ rõ và tính nhất quán</strong>, không chấm số lượng. Một SRS 15 trang gọn mà ERD, use case và backlog đều khớp nhau hơn hẳn tài liệu 60 trang tự mâu thuẫn. Kiểm chéo: mọi thực thể trong ERD nên xuất hiện trong một yêu cầu, và mọi yêu cầu lõi nên có một use case.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — SYSTEM DESIGN ══════════════════ */
    {
      title: 'Chapter 3 — System & database design|||Chương 3 — Thiết kế hệ thống & cơ sở dữ liệu',
      description: 'ERD (conceptual→logical), chuẩn hóa schema, kiến trúc MVC, class diagram và thiết kế REST API.',
      lessons: [
        {
          title: '3.1 — Data modeling: ERD, normalization & schema|||3.1 — Mô hình dữ liệu: ERD, chuẩn hóa & schema',
          slug: 'swp391-3-1-erd-schema',
          type: 'VIDEO',
          description: 'Từ conceptual ERD tới logical ERD tới bảng chuẩn hóa với khóa và ràng buộc.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Designing the database that everything sits on</h2>
<p class="lead">The database is the foundation — a bad schema poisons every layer above it. Design it in three steps: <strong>conceptual</strong> (what things exist), <strong>logical</strong> (attributes, keys, relationships), <strong>physical</strong> (real SQL tables with types and constraints).</p>
<h3>Conceptual → logical ERD</h3>
<p>Start with entities and how they relate, in plain nouns and verbs: a <em>Customer places Orders; an Order contains Products</em>. Then add attributes and keys:</p>
<pre><span class="tok-comment">-- Logical ERD (text form) for a small shop</span>
Customer(<u>id</u>, name, email UNIQUE, passwordHash)
Category(<u>id</u>, name)
Product (<u>id</u>, name, price, stock, <i>categoryId</i> -&gt; Category.id)
Order   (<u>id</u>, <i>customerId</i> -&gt; Customer.id, createdAt, status)
OrderItem(<u>id</u>, <i>orderId</i> -&gt; Order.id, <i>productId</i> -&gt; Product.id, qty, unitPrice)

Legend:  <u>underline</u> = primary key    <i>italic</i> = foreign key</pre>
<div class="callout">The <strong>many-to-many</strong> between Order and Product is resolved by the <code>OrderItem</code> junction table — one row per line in an order. This pattern (a "bridge" table with its own attributes like <code>qty</code>) appears in almost every project; recognise it now.</div>
<h3>Normalization — up to 3NF</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1NF — atomic values</div><div class="lz-ld">No comma-lists in a cell. "Red,Blue" becomes separate rows.</div></div>
  <div class="lz-layer"><div class="lz-lt">2NF — no partial dependency</div><div class="lz-ld">Every non-key column depends on the <em>whole</em> key, not part of it.</div></div>
  <div class="lz-layer"><div class="lz-lt">3NF — no transitive dependency</div><div class="lz-ld">Non-key columns don't depend on other non-key columns. Store <code>categoryId</code>, not the category's name, in Product.</div></div>
</div>
<h3>Physical schema — real SQL</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Product (
  id        <span class="tok-type">INT</span> <span class="tok-keyword">PRIMARY KEY</span> <span class="tok-keyword">AUTO_INCREMENT</span>,
  name      <span class="tok-type">VARCHAR</span>(200) <span class="tok-keyword">NOT NULL</span>,
  price     <span class="tok-type">DECIMAL</span>(12,2) <span class="tok-keyword">NOT NULL</span> <span class="tok-keyword">CHECK</span> (price &gt;= 0),
  stock     <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span> <span class="tok-keyword">DEFAULT</span> 0,
  categoryId <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,
  <span class="tok-keyword">FOREIGN KEY</span> (categoryId) <span class="tok-keyword">REFERENCES</span> Category(id)
);</pre>
<div class="pitfall">Two classic schema mistakes: (1) using money as <code>FLOAT</code> — rounding errors corrupt totals; use <code>DECIMAL</code>. (2) forgetting foreign-key constraints — the database will happily store an <code>OrderItem</code> pointing to a non-existent product. Let the DB enforce integrity; don't rely only on app code.</div>
<div class="note-ct">AI helps here (CLO3): describe your entities and ask for a draft ERD, then <em>you</em> verify normalization and every relationship. A great defense answer: "AI proposed storing the category name in Product; we normalised it to a foreign key to avoid update anomalies."</div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice schema &amp; SQL on Code Lab</span><span class="lc-sub">CREATE TABLE, keys, joins and constraints — hands-on SQL track.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Thiết kế cơ sở dữ liệu mà mọi thứ đứng trên</h2>
<p class="lead">CSDL là nền móng — schema tồi đầu độc mọi tầng phía trên. Thiết kế nó qua ba bước: <strong>conceptual</strong> (có những thứ gì), <strong>logical</strong> (thuộc tính, khóa, quan hệ), <strong>physical</strong> (bảng SQL thật với kiểu và ràng buộc).</p>
<h3>ERD conceptual → logical</h3>
<p>Bắt đầu với thực thể và cách chúng liên hệ, bằng danh từ và động từ đơn giản: <em>Customer đặt Order; một Order chứa Product</em>. Rồi thêm thuộc tính và khóa:</p>
<pre><span class="tok-comment">-- ERD logical (dạng chữ) cho một cửa hàng nhỏ</span>
Customer(<u>id</u>, name, email UNIQUE, passwordHash)
Category(<u>id</u>, name)
Product (<u>id</u>, name, price, stock, <i>categoryId</i> -&gt; Category.id)
Order   (<u>id</u>, <i>customerId</i> -&gt; Customer.id, createdAt, status)
OrderItem(<u>id</u>, <i>orderId</i> -&gt; Order.id, <i>productId</i> -&gt; Product.id, qty, unitPrice)

Chú thích:  <u>gạch chân</u> = khóa chính    <i>nghiêng</i> = khóa ngoại</pre>
<div class="callout">Quan hệ <strong>nhiều-nhiều</strong> giữa Order và Product được giải bằng bảng trung gian <code>OrderItem</code> — mỗi dòng là một mục trong đơn. Mẫu này (một bảng "cầu" có thuộc tính riêng như <code>qty</code>) xuất hiện gần như mọi đồ án; nhận ra nó ngay bây giờ.</div>
<h3>Chuẩn hóa — tới 3NF</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1NF — giá trị nguyên tử</div><div class="lz-ld">Không nhồi danh sách phẩy trong một ô. "Đỏ,Xanh" tách thành các dòng riêng.</div></div>
  <div class="lz-layer"><div class="lz-lt">2NF — không phụ thuộc bộ phận</div><div class="lz-ld">Mọi cột không khóa phụ thuộc <em>toàn bộ</em> khóa, không phải một phần.</div></div>
  <div class="lz-layer"><div class="lz-lt">3NF — không phụ thuộc bắc cầu</div><div class="lz-ld">Cột không khóa không phụ thuộc cột không khóa khác. Lưu <code>categoryId</code>, không lưu tên danh mục, trong Product.</div></div>
</div>
<h3>Schema physical — SQL thật</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Product (
  id        <span class="tok-type">INT</span> <span class="tok-keyword">PRIMARY KEY</span> <span class="tok-keyword">AUTO_INCREMENT</span>,
  name      <span class="tok-type">VARCHAR</span>(200) <span class="tok-keyword">NOT NULL</span>,
  price     <span class="tok-type">DECIMAL</span>(12,2) <span class="tok-keyword">NOT NULL</span> <span class="tok-keyword">CHECK</span> (price &gt;= 0),
  stock     <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span> <span class="tok-keyword">DEFAULT</span> 0,
  categoryId <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,
  <span class="tok-keyword">FOREIGN KEY</span> (categoryId) <span class="tok-keyword">REFERENCES</span> Category(id)
);</pre>
<div class="pitfall">Hai lỗi schema kinh điển: (1) để tiền là <code>FLOAT</code> — sai số làm hỏng tổng tiền; dùng <code>DECIMAL</code>. (2) quên ràng buộc khóa ngoại — CSDL sẽ vui vẻ lưu một <code>OrderItem</code> trỏ tới sản phẩm không tồn tại. Hãy để DB ép toàn vẹn; đừng chỉ dựa vào code app.</div>
<div class="note-ct">AI hỗ trợ ở đây (CLO3): mô tả thực thể và xin một ERD nháp, rồi <em>bạn</em> kiểm chuẩn hóa và từng quan hệ. Một câu trả lời bảo vệ hay: "AI đề xuất lưu tên danh mục trong Product; nhóm chuẩn hóa thành khóa ngoại để tránh dị thường cập nhật."</div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Luyện schema &amp; SQL trên Code Lab</span><span class="lc-sub">CREATE TABLE, khóa, join và ràng buộc — track SQL thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — MVC architecture, class diagram & REST API design|||3.2 — Kiến trúc MVC, class diagram & thiết kế REST API',
          slug: 'swp391-3-2-mvc-api',
          type: 'VIDEO',
          description: 'Phân lớp MVC + Repository/Service, class diagram, và thiết kế REST API theo tài nguyên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Structuring the code — MVC + layers</h2>
<p class="lead">MVC keeps a web app from becoming spaghetti. The request flows through clean layers, each with one job — the same idea you met in PRJ301, now applied to your whole project.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">View</div><div class="lz-t">The UI</div><div class="lz-d">HTML/JSP/React — shows &amp; collects</div></div>
  <div class="lz-step"><div class="lz-k">Controller</div><div class="lz-t">Handles the request</div><div class="lz-d">Routes, validates, calls service</div></div>
  <div class="lz-step"><div class="lz-k">Service</div><div class="lz-t">Business rules</div><div class="lz-d">"Decrease stock when ordered"</div></div>
  <div class="lz-step"><div class="lz-k">Repository</div><div class="lz-t">Database access</div><div class="lz-d">CRUD, one entity per repo</div></div>
</div>
<h3>Class diagram — the design behind the code</h3>
<pre><span class="tok-comment">// The Product feature, as classes</span>
ProductController  ---&gt; ProductService  ---&gt; ProductRepository ---&gt; [Product table]
     |                       |                      |
  handles /products      applies rules         runs SQL / ORM
     |
  returns View / JSON</pre>
<div class="callout">Each arrow is a <strong>dependency</strong>, pointing "downward" only: Controller knows Service, Service knows Repository — never the reverse. This one-directional flow is what makes each layer independently testable (the QA lead can test the Service with a fake Repository).</div>
<h3>REST API design — resources &amp; verbs</h3>
<p>Design endpoints around <strong>nouns (resources)</strong>, using HTTP verbs for the action:</p>
<pre><span class="tok-keyword">GET</span>    /api/products          <span class="tok-comment"># list products</span>
<span class="tok-keyword">GET</span>    /api/products/42       <span class="tok-comment"># one product</span>
<span class="tok-keyword">POST</span>   /api/products          <span class="tok-comment"># create (body = JSON)</span>
<span class="tok-keyword">PUT</span>    /api/products/42       <span class="tok-comment"># update</span>
<span class="tok-keyword">DELETE</span> /api/products/42       <span class="tok-comment"># remove</span></pre>
<h3>Ví dụ có lời giải · Worked example (use case → API → controller code)</h3>
<p>Trace the "list products" use case from design to a Spring controller:</p>
<pre><span class="tok-comment">// 1. Use case: Customer views products</span>
<span class="tok-comment">// 2. API:      GET /api/products?category=3</span>
<span class="tok-comment">// 3. Controller (Spring Boot):</span>
<span class="tok-keyword">@RestController</span>
<span class="tok-keyword">@RequestMapping</span>(<span class="tok-string">"/api/products"</span>)
<span class="tok-keyword">public class</span> <span class="tok-type">ProductController</span> {
    <span class="tok-keyword">private final</span> <span class="tok-type">ProductService</span> service;   <span class="tok-comment">// injected</span>

    <span class="tok-keyword">@GetMapping</span>
    <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;<span class="tok-type">Product</span>&gt; <span class="tok-function">list</span>(<span class="tok-keyword">@RequestParam</span>(required=<span class="tok-keyword">false</span>) <span class="tok-type">Integer</span> category) {
        <span class="tok-keyword">return</span> service.findByCategory(category);   <span class="tok-comment">// no SQL here!</span>
    }
}</pre>
<div class="out"><b>Notice the separation:</b> the Controller only translates HTTP ↔ Java and delegates. The rule "filter by category" lives in the Service; the actual query lives in the Repository. Change the database later and the Controller never moves.</div>
<div class="pitfall"><b>Fat controllers</b> are the most common design failure: SQL, business rules and validation all crammed into one method. It works for a demo, then becomes impossible to test or reuse. Keep the Controller thin — if it contains a SQL string, it is doing the Repository's job.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Conway's Law.</b> "Organizations design systems that mirror their communication structure." In practice: if your five-person team splits by feature and talks constantly, your modules stay clean; if two members never speak, the boundary between their code becomes a mess of duplicated logic. The lesson for SWP391 — your architecture and your team structure shape each other, so design your module boundaries to match how you actually divide the work.</div>
<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Build a real MVC controller &amp; service</span><span class="lc-sub">Spring Boot track — controllers, services, repositories end to end.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Cấu trúc code — MVC + phân lớp</h2>
<p class="lead">MVC giữ một web app khỏi thành mì spaghetti. Request chảy qua các lớp sạch, mỗi lớp một việc — chính ý tưởng bạn gặp ở PRJ301, nay áp cho cả đồ án.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">View</div><div class="lz-t">Giao diện</div><div class="lz-d">HTML/JSP/React — hiện &amp; thu</div></div>
  <div class="lz-step"><div class="lz-k">Controller</div><div class="lz-t">Xử lý request</div><div class="lz-d">Định tuyến, validate, gọi service</div></div>
  <div class="lz-step"><div class="lz-k">Service</div><div class="lz-t">Luật nghiệp vụ</div><div class="lz-d">"Trừ tồn kho khi đặt"</div></div>
  <div class="lz-step"><div class="lz-k">Repository</div><div class="lz-t">Truy cập CSDL</div><div class="lz-d">CRUD, mỗi entity một repo</div></div>
</div>
<h3>Class diagram — thiết kế đằng sau code</h3>
<pre><span class="tok-comment">// Tính năng Product, dưới dạng lớp</span>
ProductController  ---&gt; ProductService  ---&gt; ProductRepository ---&gt; [bảng Product]
     |                       |                      |
  xử lý /products        áp dụng luật          chạy SQL / ORM
     |
  trả View / JSON</pre>
<div class="callout">Mỗi mũi tên là một <strong>phụ thuộc</strong>, chỉ trỏ "xuống dưới": Controller biết Service, Service biết Repository — không bao giờ ngược lại. Luồng một chiều này là thứ khiến mỗi lớp test độc lập được (QA lead test Service với một Repository giả).</div>
<h3>Thiết kế REST API — tài nguyên &amp; động từ</h3>
<p>Thiết kế endpoint quanh <strong>danh từ (tài nguyên)</strong>, dùng động từ HTTP cho hành động:</p>
<pre><span class="tok-keyword">GET</span>    /api/products          <span class="tok-comment"># liệt kê sản phẩm</span>
<span class="tok-keyword">GET</span>    /api/products/42       <span class="tok-comment"># một sản phẩm</span>
<span class="tok-keyword">POST</span>   /api/products          <span class="tok-comment"># tạo (body = JSON)</span>
<span class="tok-keyword">PUT</span>    /api/products/42       <span class="tok-comment"># cập nhật</span>
<span class="tok-keyword">DELETE</span> /api/products/42       <span class="tok-comment"># xóa</span></pre>
<h3>Ví dụ có lời giải · Worked example (use case → API → code controller)</h3>
<p>Truy vết use case "liệt kê sản phẩm" từ thiết kế tới một controller Spring:</p>
<pre><span class="tok-comment">// 1. Use case: Khách xem sản phẩm</span>
<span class="tok-comment">// 2. API:      GET /api/products?category=3</span>
<span class="tok-comment">// 3. Controller (Spring Boot):</span>
<span class="tok-keyword">@RestController</span>
<span class="tok-keyword">@RequestMapping</span>(<span class="tok-string">"/api/products"</span>)
<span class="tok-keyword">public class</span> <span class="tok-type">ProductController</span> {
    <span class="tok-keyword">private final</span> <span class="tok-type">ProductService</span> service;   <span class="tok-comment">// được inject</span>

    <span class="tok-keyword">@GetMapping</span>
    <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;<span class="tok-type">Product</span>&gt; <span class="tok-function">list</span>(<span class="tok-keyword">@RequestParam</span>(required=<span class="tok-keyword">false</span>) <span class="tok-type">Integer</span> category) {
        <span class="tok-keyword">return</span> service.findByCategory(category);   <span class="tok-comment">// không SQL ở đây!</span>
    }
}</pre>
<div class="out"><b>Để ý sự tách bạch:</b> Controller chỉ dịch HTTP ↔ Java rồi ủy thác. Luật "lọc theo danh mục" sống trong Service; câu query thật sống trong Repository. Đổi CSDL sau này mà Controller không phải sửa.</div>
<div class="pitfall"><b>Controller béo</b> là lỗi thiết kế phổ biến nhất: SQL, luật nghiệp vụ và validate nhồi hết vào một hàm. Chạy được cho demo, rồi thành thứ không test hay tái dùng nổi. Giữ Controller mỏng — nếu nó chứa một chuỗi SQL, nó đang làm việc của Repository.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định luật Conway.</b> "Tổ chức thiết kế hệ thống phản chiếu cấu trúc giao tiếp của họ." Thực tế: nếu nhóm năm người chia theo tính năng và nói chuyện liên tục, module của bạn sạch; nếu hai thành viên không bao giờ trao đổi, ranh giới giữa code của họ thành mớ logic lặp. Bài học cho SWP391 — kiến trúc và cấu trúc nhóm định hình lẫn nhau, nên hãy thiết kế ranh giới module khớp với cách bạn thật sự chia việc.</div>
<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Dựng controller &amp; service MVC thật</span><span class="lc-sub">Track Spring Boot — controller, service, repository từ đầu đến cuối.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 3 — Data modeling, MVC & API design|||Quiz 3 — Mô hình dữ liệu, MVC & thiết kế API',
          slug: 'swp391-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra ERD/chuẩn hóa, phân lớp MVC và thiết kế REST API.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A many-to-many between Order and Product is resolved by…|||Quan hệ nhiều-nhiều giữa Order và Product được giải bằng…', options: ['a bigger Order table|||một bảng Order lớn hơn', 'a junction table like OrderItem|||một bảng trung gian như OrderItem', 'removing Product|||bỏ Product', 'a FLOAT column|||một cột FLOAT'], correctIndex: 1, points: 1 },
              { question: '3NF (third normal form) removes…|||3NF (chuẩn 3) loại bỏ…', options: ['all foreign keys|||mọi khóa ngoại', 'transitive dependencies between non-key columns|||phụ thuộc bắc cầu giữa các cột không khóa', 'primary keys|||khóa chính', 'the need for a database|||nhu cầu CSDL'], correctIndex: 1, points: 1 },
              { question: 'Money should be stored as… not FLOAT.|||Tiền nên lưu dạng… không phải FLOAT.', options: ['VARCHAR', 'DECIMAL', 'INT only|||chỉ INT', 'BOOLEAN'], correctIndex: 1, points: 1 },
              { question: 'In MVC layering, dependencies point…|||Trong phân lớp MVC, phụ thuộc trỏ…', options: ['Repository -> Controller|||Repository -> Controller', 'Controller -> Service -> Repository (downward only)|||Controller -> Service -> Repository (chỉ xuống dưới)', 'in both directions|||cả hai chiều', 'View -> database directly|||View -> CSDL trực tiếp'], correctIndex: 1, points: 1 },
              { question: 'A "fat controller" is bad because…|||"Controller béo" là xấu vì…', options: ['it is too short|||quá ngắn', 'it mixes SQL, rules and validation, making it untestable|||trộn SQL, luật và validate, thành không test được', 'it uses HTTP verbs|||dùng động từ HTTP', 'it returns JSON|||trả JSON'], correctIndex: 1, points: 1 },
              { question: 'A RESTful endpoint to create a product is…|||Một endpoint REST để tạo sản phẩm là…', options: ['GET /api/createProduct', 'POST /api/products', 'GET /api/products/new', 'DELETE /api/products'], correctIndex: 1, points: 1 },
              { question: 'Conway\'s Law says a system\'s structure tends to mirror… (beyond-syllabus)|||Định luật Conway nói cấu trúc hệ thống có xu hướng phản chiếu… (ngoài giáo trình)', options: ['the database engine|||engine CSDL', 'the team\'s communication structure|||cấu trúc giao tiếp của nhóm', 'the programming language|||ngôn ngữ lập trình', 'the deadline|||hạn chót'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — MILESTONE 2: IMPLEMENTATION ══════════════════ */
    {
      title: 'Chapter 4 — Milestone 2: Implementation|||Chương 4 — Milestone 2: Hiện thực',
      description: 'Code theo MVC/OOP, lớp Repository/Service, REST API, chống SQL injection và code review.',
      lessons: [
        {
          title: '4.1 — Building workflows: Repository & Service, SQLi-safe|||4.1 — Xây workflow: Repository & Service, chống SQLi',
          slug: 'swp391-4-1-repository-service-sqli',
          type: 'VIDEO',
          description: 'Hiện thực từng workflow theo lớp, và chặn SQL injection bằng câu lệnh tham số hóa.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Turning the design into working workflows</h2>
<p class="lead">Milestone 2 grades <strong>Workflows 1 &amp; 2 running end-to-end</strong>. Build them in the backlog order: auth (Workflow 0) first, then master-data CRUD (Workflow 1), then the core transaction success + exception paths (Workflow 2). Each is a vertical slice through all four layers.</p>
<h3>The Repository layer — data access in one place</h3>
<pre><span class="tok-comment">// ProductRepository — the only place SQL for Product lives</span>
<span class="tok-keyword">public class</span> <span class="tok-type">ProductRepository</span> {
    <span class="tok-keyword">public</span> <span class="tok-type">Product</span> <span class="tok-function">findById</span>(<span class="tok-type">int</span> id) {
        <span class="tok-type">String</span> sql = <span class="tok-string">"SELECT * FROM Product WHERE id = ?"</span>;   <span class="tok-comment">// ? = placeholder</span>
        <span class="tok-keyword">try</span> (<span class="tok-type">PreparedStatement</span> ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);                                  <span class="tok-comment">// value bound safely</span>
            <span class="tok-comment">// ...map ResultSet to a Product...</span>
        }
    }
}</pre>
<h3>The Service layer — business rules &amp; transactions</h3>
<pre><span class="tok-comment">// OrderService — the "place order" rule from use case 2.2</span>
<span class="tok-keyword">public</span> <span class="tok-type">Order</span> <span class="tok-function">placeOrder</span>(<span class="tok-type">int</span> customerId, <span class="tok-type">List</span>&lt;<span class="tok-type">Item</span>&gt; items) {
    <span class="tok-comment">// 1. validate stock for each item (exception path if short)</span>
    <span class="tok-comment">// 2. create the Order + OrderItems</span>
    <span class="tok-comment">// 3. decrease stock — all inside ONE transaction</span>
    <span class="tok-comment">//    so a mid-way failure rolls everything back</span>
}</pre>
<div class="callout">The whole "place order" must be <strong>atomic</strong>: if decreasing stock fails on item 3, the order and the first two stock changes must roll back. Wrap the steps in a transaction (<code>@Transactional</code> in Spring) — a half-committed order is worse than no order.</div>
<h3>Stopping SQL injection — the non-negotiable</h3>
<pre><span class="tok-comment">// NEVER build SQL by concatenating user input:</span>
<span class="tok-type">String</span> bad = <span class="tok-string">"SELECT * FROM User WHERE name='"</span> + input + <span class="tok-string">"'"</span>;
<span class="tok-comment">// input = anything'; DROP TABLE User; --   -> disaster</span>

<span class="tok-comment">// ALWAYS use a parameterized query:</span>
<span class="tok-type">String</span> ok = <span class="tok-string">"SELECT * FROM User WHERE name = ?"</span>;
ps.setString(1, input);   <span class="tok-comment">// the driver escapes it safely</span></pre>
<div class="pitfall"><b>String-concatenated SQL</b> is the classic critical vulnerability (and a Workflow 0 grading point). One <code>PreparedStatement</code> with <code>?</code> placeholders — or an ORM/JPA repository — closes it. Never trust input; never build queries with <code>+</code>.</div>
<div class="note-ct">AI pair-programming (CLO4) shines in this layer: Copilot writes repetitive DAO methods and mappers fast. But review every generated query for the injection trap and for the N+1 problem — AI happily writes a loop that queries the database once per row. You are the reviewer of record.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">☕</span>
  <span class="lc-body"><span class="lc-title">Practice OOP &amp; JDBC/DAO on Code Lab</span><span class="lc-sub">Java Core track — the classes and data access your Model needs.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Biến thiết kế thành workflow chạy được</h2>
<p class="lead">Milestone 2 chấm <strong>Workflow 1 &amp; 2 chạy từ đầu đến cuối</strong>. Xây theo thứ tự backlog: xác thực (Workflow 0) trước, rồi CRUD dữ liệu gốc (Workflow 1), rồi đường thành công + ngoại lệ của giao dịch lõi (Workflow 2). Mỗi cái là một lát cắt dọc xuyên cả bốn lớp.</p>
<h3>Lớp Repository — truy cập dữ liệu một chỗ</h3>
<pre><span class="tok-comment">// ProductRepository — nơi duy nhất SQL của Product sống</span>
<span class="tok-keyword">public class</span> <span class="tok-type">ProductRepository</span> {
    <span class="tok-keyword">public</span> <span class="tok-type">Product</span> <span class="tok-function">findById</span>(<span class="tok-type">int</span> id) {
        <span class="tok-type">String</span> sql = <span class="tok-string">"SELECT * FROM Product WHERE id = ?"</span>;   <span class="tok-comment">// ? = chỗ giữ</span>
        <span class="tok-keyword">try</span> (<span class="tok-type">PreparedStatement</span> ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);                                  <span class="tok-comment">// gán giá trị an toàn</span>
            <span class="tok-comment">// ...ánh xạ ResultSet thành Product...</span>
        }
    }
}</pre>
<h3>Lớp Service — luật nghiệp vụ &amp; giao dịch</h3>
<pre><span class="tok-comment">// OrderService — luật "đặt đơn" từ use case 2.2</span>
<span class="tok-keyword">public</span> <span class="tok-type">Order</span> <span class="tok-function">placeOrder</span>(<span class="tok-type">int</span> customerId, <span class="tok-type">List</span>&lt;<span class="tok-type">Item</span>&gt; items) {
    <span class="tok-comment">// 1. kiểm tồn kho từng món (đường ngoại lệ nếu thiếu)</span>
    <span class="tok-comment">// 2. tạo Order + OrderItem</span>
    <span class="tok-comment">// 3. trừ tồn kho — tất cả trong MỘT giao dịch</span>
    <span class="tok-comment">//    để lỗi giữa chừng cuộn ngược mọi thứ</span>
}</pre>
<div class="callout">Toàn bộ "đặt đơn" phải <strong>nguyên tử (atomic)</strong>: nếu trừ tồn kho hỏng ở món 3, đơn và hai thay đổi tồn kho đầu phải cuộn ngược. Bọc các bước trong một giao dịch (<code>@Transactional</code> trong Spring) — một đơn commit nửa vời còn tệ hơn không có đơn.</div>
<h3>Chặn SQL injection — điều không thương lượng</h3>
<pre><span class="tok-comment">// KHÔNG BAO GIỜ dựng SQL bằng cách nối chuỗi input người dùng:</span>
<span class="tok-type">String</span> bad = <span class="tok-string">"SELECT * FROM User WHERE name='"</span> + input + <span class="tok-string">"'"</span>;
<span class="tok-comment">// input = anything'; DROP TABLE User; --   -> thảm họa</span>

<span class="tok-comment">// LUÔN dùng câu lệnh tham số hóa:</span>
<span class="tok-type">String</span> ok = <span class="tok-string">"SELECT * FROM User WHERE name = ?"</span>;
ps.setString(1, input);   <span class="tok-comment">// driver tự escape an toàn</span></pre>
<div class="pitfall"><b>SQL nối chuỗi</b> là lỗ hổng nghiêm trọng kinh điển (và là điểm chấm Workflow 0). Một <code>PreparedStatement</code> với chỗ giữ <code>?</code> — hoặc một repository ORM/JPA — đóng nó lại. Đừng bao giờ tin input; đừng bao giờ dựng query bằng <code>+</code>.</div>
<div class="note-ct">AI pair-programming (CLO4) tỏa sáng ở lớp này: Copilot viết nhanh các method DAO và mapper lặp lại. Nhưng review mọi query sinh ra để tìm bẫy injection và vấn đề N+1 — AI vui vẻ viết một vòng lặp truy vấn CSDL mỗi dòng một lần. Bạn là người review chịu trách nhiệm.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">☕</span>
  <span class="lc-body"><span class="lc-title">Luyện OOP &amp; JDBC/DAO trên Code Lab</span><span class="lc-sub">Track Java Core — các lớp và truy cập dữ liệu mà Model cần.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — Coding standards, code review & integration|||4.2 — Chuẩn code, code review & tích hợp',
          slug: 'swp391-4-2-code-review-integration',
          type: 'VIDEO',
          description: 'Chuẩn coding, quy trình code review qua PR, và tích hợp liên tục thay vì big-bang.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Writing code the team can live with</h2>
<p class="lead">In a solo assignment, messy code only hurts you. In a five-person project it hurts everyone — and slows every future change. Two disciplines keep a team fast: <strong>coding standards</strong> and <strong>code review</strong>.</p>
<h3>Coding standards — agree once, apply everywhere</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Naming</div><div class="lz-ld">Consistent conventions: <code>ProductService</code>, <code>findByCategory</code>, <code>MAX_RETRIES</code>. A reader guesses the rest.</div></div>
  <div class="lz-layer"><div class="lz-lt">Formatting</div><div class="lz-ld">One auto-formatter for the whole repo (Prettier / IDE format-on-save) so diffs show real changes, not spacing.</div></div>
  <div class="lz-layer"><div class="lz-lt">Structure</div><div class="lz-ld">Same package layout in every feature: controller / service / repository / model.</div></div>
  <div class="lz-layer"><div class="lz-lt">Comments</div><div class="lz-ld">Explain the <em>why</em>, not the <em>what</em>. Good names remove most "what" comments.</div></div>
</div>
<h3>Code review — every PR read by a teammate</h3>
<pre><span class="tok-comment"># The review loop, on each pull request</span>
1. Author opens a PR (small, one feature)
2. A reviewer reads it: correctness, standards, tests, security
3. Reviewer leaves comments / requests changes
4. Author fixes, pushes again
5. Reviewer approves -&gt; merge to main</pre>
<div class="callout">A good review asks three things: <strong>Does it work? Is it safe? (SQLi, input validation) Will the next person understand it?</strong> Reviewing is a skill graded under CLO5 — leaving thoughtful comments counts as much as writing code.</div>
<h3>Continuous integration, not big-bang</h3>
<p>Merge small pieces into <code>main</code> continuously. The alternative — everyone codes alone for weeks then merges everything the night before the milestone — is <strong>big-bang integration</strong>, and it reliably ends in a wall of conflicts and a broken build.</p>
<h3>Ví dụ có lời giải · Worked example (a review that caught a bug)</h3>
<pre><span class="tok-comment">// PR #14: "add product search"  — reviewer's notes</span>
<span class="tok-string">"Line 20: SQL is concatenated with the search term</span>
<span class="tok-string"> -> SQL injection. Use a PreparedStatement with ?."</span>
<span class="tok-string">"Line 33: no test for the empty-query case</span>
<span class="tok-string"> -> please add one (acceptance criteria said 'show all')."</span>
<span class="tok-comment">// Author fixes both, pushes, reviewer approves -> merge</span></pre>
<div class="out"><b>Value delivered:</b> a security hole and a missing edge case were caught <em>before</em> reaching <code>main</code> — for the price of a five-minute read. This is exactly why the milestone rewards a reviewed history over a big last-minute dump.</div>
<div class="pitfall"><b>Big-bang integration</b> is the top cause of Milestone-2 disasters: three green individual branches that have never met produce a red build when merged. Integrate daily so conflicts are small and the build is always green.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Technical debt.</b> Every "we'll clean this up later" shortcut is a small loan you take from your future self, with interest — the messier the code, the slower every later change. A little debt to hit a milestone is a valid <em>choice</em>, but track it (a <code>// TODO</code> or a backlog item) and repay it before Milestone 3. Teams that never repay find their last week collapses under the weight of every shortcut at once.</div>
<a class="link-card exphub" href="/exp-hub/code-review?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">How to run great code reviews</span><span class="lc-sub">Checklists, tone and PR etiquette for teams — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Viết code mà cả nhóm sống chung được</h2>
<p class="lead">Trong bài cá nhân, code lộn xộn chỉ hại bạn. Trong đồ án năm người nó hại tất cả — và làm chậm mọi thay đổi tương lai. Hai kỷ luật giữ nhóm nhanh: <strong>chuẩn code</strong> và <strong>code review</strong>.</p>
<h3>Chuẩn code — thống nhất một lần, áp mọi nơi</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Đặt tên</div><div class="lz-ld">Quy ước nhất quán: <code>ProductService</code>, <code>findByCategory</code>, <code>MAX_RETRIES</code>. Người đọc đoán được phần còn lại.</div></div>
  <div class="lz-layer"><div class="lz-lt">Định dạng</div><div class="lz-ld">Một bộ format tự động cho cả repo (Prettier / IDE format-on-save) để diff hiện thay đổi thật, không phải khoảng trắng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Cấu trúc</div><div class="lz-ld">Cùng bố cục package ở mọi tính năng: controller / service / repository / model.</div></div>
  <div class="lz-layer"><div class="lz-lt">Chú thích</div><div class="lz-ld">Giải thích <em>tại sao</em>, không phải <em>cái gì</em>. Tên tốt xóa hầu hết chú thích "cái gì".</div></div>
</div>
<h3>Code review — mỗi PR có một đồng đội đọc</h3>
<pre><span class="tok-comment"># Vòng review, trên mỗi pull request</span>
1. Tác giả mở PR (nhỏ, một tính năng)
2. Người review đọc: đúng đắn, chuẩn, test, bảo mật
3. Người review để lại nhận xét / yêu cầu sửa
4. Tác giả sửa, đẩy lại
5. Người review duyệt -&gt; merge vào main</pre>
<div class="callout">Một review tốt hỏi ba điều: <strong>Có chạy không? Có an toàn không? (SQLi, validate input) Người sau có hiểu được không?</strong> Review là kỹ năng bị chấm dưới CLO5 — để lại nhận xét chu đáo tính ngang với viết code.</div>
<h3>Tích hợp liên tục, không big-bang</h3>
<p>Merge từng mảnh nhỏ vào <code>main</code> liên tục. Cách ngược lại — mọi người code một mình hàng tuần rồi merge tất cả đêm trước milestone — là <strong>tích hợp big-bang</strong>, và luôn kết thúc bằng một bức tường xung đột và một build hỏng.</p>
<h3>Ví dụ có lời giải · Worked example (một review bắt được bug)</h3>
<pre><span class="tok-comment">// PR #14: "thêm tìm sản phẩm"  — ghi chú của người review</span>
<span class="tok-string">"Dòng 20: SQL nối chuỗi với từ khóa tìm</span>
<span class="tok-string"> -> SQL injection. Dùng PreparedStatement với ?."</span>
<span class="tok-string">"Dòng 33: chưa có test cho trường hợp query rỗng</span>
<span class="tok-string"> -> thêm giúp (tiêu chí chấp nhận nói 'hiện tất cả')."</span>
<span class="tok-comment">// Tác giả sửa cả hai, đẩy lại, người review duyệt -> merge</span></pre>
<div class="out"><b>Giá trị đem lại:</b> một lỗ hổng bảo mật và một edge case còn thiếu được bắt <em>trước khi</em> tới <code>main</code> — với cái giá đọc năm phút. Đây đúng là lý do milestone thưởng cho lịch sử có review hơn một cú dump phút chót.</div>
<div class="pitfall"><b>Tích hợp big-bang</b> là nguyên nhân hàng đầu của thảm họa Milestone 2: ba nhánh cá nhân xanh mà chưa gặp nhau bao giờ tạo ra build đỏ khi merge. Tích hợp mỗi ngày để xung đột nhỏ và build luôn xanh.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nợ kỹ thuật (technical debt).</b> Mỗi lối tắt "để dọn sau" là một khoản vay nhỏ bạn mượn từ chính mình tương lai, có lãi — code càng bừa, mọi thay đổi sau càng chậm. Một chút nợ để kịp milestone là <em>lựa chọn</em> hợp lệ, nhưng hãy theo dõi nó (một <code>// TODO</code> hoặc mục backlog) và trả trước Milestone 3. Nhóm không bao giờ trả sẽ thấy tuần cuối sụp đổ dưới sức nặng của mọi lối tắt cùng lúc.</div>
<a class="link-card exphub" href="/exp-hub/code-review?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Cách chạy code review tốt</span><span class="lc-sub">Checklist, giọng điệu và phép lịch sự PR cho nhóm — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Milestone 2 — Implementation checklist|||Milestone 2 — Checklist hiện thực',
          slug: 'swp391-milestone-2-checklist',
          type: 'VIDEO',
          description: 'Danh sách kiểm trước khi nộp Milestone 2 (Workflow 1 & 2, 20%).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Milestone 2</span>
<h2>Milestone 2 submission checklist (Week 8 · 20%)</h2>
<p class="lead">Milestone 2 is about <strong>working software</strong>: Workflows 1 &amp; 2 must run end-to-end and be demonstrable. Documents matter less here than a demo that actually works.</p>
<div class="out">
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ Workflow 0 (auth) complete</div><div class="lz-ld">Register / login / logout / forgot-password, passwords hashed.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Workflow 1 (master-data CRUD) working</div><div class="lz-ld">Create/read/update/delete on the reference tables, with validation.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Workflow 2 success path working</div><div class="lz-ld">The core transaction completes end-to-end and persists correctly.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Workflow 2 exception path handled</div><div class="lz-ld">Out-of-stock / invalid input rolls back and shows a clear message.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ MVC layering respected</div><div class="lz-ld">No SQL in controllers; services hold the rules; repositories hold the queries.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ All DB access parameterized (no SQLi)</div><div class="lz-ld">PreparedStatement / ORM everywhere.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Reviewed Git history, everyone contributing</div><div class="lz-ld">PRs merged, commits under each member's account.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ main builds &amp; runs from a clean clone</div><div class="lz-ld">A README with setup steps; no "works on my machine".</div></div>
</div>
</div>
<div class="callout ok">The demo-day rule: <strong>rehearse the exact click-path you will show</strong>, from a fresh login. Most Milestone-2 marks are lost not to missing features but to a feature that "worked yesterday" breaking live because nobody re-ran it from a clean state.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Milestone 2</span>
<h2>Checklist nộp Milestone 2 (Tuần 8 · 20%)</h2>
<p class="lead">Milestone 2 là về <strong>phần mềm chạy được</strong>: Workflow 1 &amp; 2 phải chạy từ đầu đến cuối và demo được. Tài liệu ở đây kém quan trọng hơn một demo thật sự chạy.</p>
<div class="out">
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ Workflow 0 (xác thực) hoàn chỉnh</div><div class="lz-ld">Đăng ký / đăng nhập / đăng xuất / quên mật khẩu, mật khẩu đã băm.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Workflow 1 (CRUD dữ liệu gốc) chạy</div><div class="lz-ld">Thêm/đọc/sửa/xóa trên bảng tham chiếu, có validate.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Workflow 2 đường thành công chạy</div><div class="lz-ld">Giao dịch lõi hoàn tất từ đầu đến cuối và lưu đúng.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Workflow 2 đường ngoại lệ được xử lý</div><div class="lz-ld">Hết hàng / input sai cuộn ngược và hiện thông báo rõ.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Tôn trọng phân lớp MVC</div><div class="lz-ld">Không SQL trong controller; service giữ luật; repository giữ query.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Mọi truy cập DB tham số hóa (không SQLi)</div><div class="lz-ld">PreparedStatement / ORM ở mọi nơi.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Lịch sử Git có review, mọi người đóng góp</div><div class="lz-ld">PR đã merge, commit dưới tài khoản mỗi thành viên.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ main build &amp; chạy từ một bản clone sạch</div><div class="lz-ld">README có bước cài; không "chạy trên máy tôi".</div></div>
</div>
</div>
<div class="callout ok">Quy tắc ngày demo: <strong>tập đúng đường-bấm bạn sẽ trình chiếu</strong>, từ một lần đăng nhập mới. Phần lớn điểm Milestone 2 mất không phải do thiếu tính năng mà do một tính năng "hôm qua chạy" hỏng ngay khi demo vì không ai chạy lại từ trạng thái sạch.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — TESTING & QUALITY ══════════════════ */
    {
      title: 'Chapter 5 — Testing & quality|||Chương 5 — Kiểm thử & chất lượng',
      description: 'Test plan, unit test và integration test, và quản lý bug — chứng minh phần mềm đúng.',
      lessons: [
        {
          title: '5.1 — Test plan, unit & integration tests, bug tracking|||5.1 — Test plan, unit & integration test, quản lý bug',
          slug: 'swp391-5-1-testing-bug-tracking',
          type: 'VIDEO',
          description: 'Các mức test, viết unit test, integration test qua API, và theo dõi bug có kỷ luật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Proving the software works — testing</h2>
<p class="lead">"It ran once on my machine" is not evidence. Tests turn a claim into a repeatable proof, and they catch the bug you re-introduce next week. Milestone 3 grades testing directly.</p>
<h3>The test pyramid — where to spend effort</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Many</div><div class="lz-t">Unit tests</div><div class="lz-d">One method in isolation · fast</div></div>
  <div class="lz-step"><div class="lz-k">Some</div><div class="lz-t">Integration tests</div><div class="lz-d">Layers together, real DB / API</div></div>
  <div class="lz-step"><div class="lz-k">Few</div><div class="lz-t">End-to-end (UI)</div><div class="lz-d">Selenium clicks the real app · slow</div></div>
</div>
<h3>A unit test (JUnit)</h3>
<pre><span class="tok-comment">// Test one rule of OrderService in isolation</span>
<span class="tok-keyword">@Test</span>
<span class="tok-keyword">void</span> <span class="tok-function">placeOrder_failsWhenStockTooLow</span>() {
    <span class="tok-comment">// Arrange: a product with stock 1, order asks for 5</span>
    <span class="tok-comment">// Act &amp; Assert: expect an OutOfStockException</span>
    assertThrows(<span class="tok-type">OutOfStockException</span>.<span class="tok-keyword">class</span>,
        () -&gt; service.placeOrder(customerId, fiveUnits));
}</pre>
<div class="callout">A test has three parts — <strong>Arrange, Act, Assert</strong>. Set up the situation, run the one action, then assert the exact expected outcome. A test with no assertion proves nothing.</div>
<h3>An integration test — through the API (Postman)</h3>
<pre><span class="tok-comment"># Verify the whole stack answers correctly</span>
POST /api/orders   { "items": [ { "productId": 7, "qty": 2 } ] }
Expect: 201 Created, body.status == "CONFIRMED", stock decreased by 2</pre>
<h3>Bug tracking — a bug is a task, not a chat message</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Title &amp; steps to reproduce</div><div class="lz-ld">"Checkout with an out-of-stock item → 500 error. Steps: 1… 2… 3…"</div></div>
  <div class="lz-layer"><div class="lz-lt">Expected vs actual</div><div class="lz-ld">What should happen; what happened.</div></div>
  <div class="lz-layer"><div class="lz-lt">Severity &amp; owner</div><div class="lz-ld">Critical/major/minor; who fixes it.</div></div>
  <div class="lz-layer"><div class="lz-lt">Status</div><div class="lz-ld">Open → In progress → Fixed → Verified (by someone else).</div></div>
</div>
<h3>Ví dụ có lời giải · Worked example (a bug from report to closed)</h3>
<pre><span class="tok-comment"># Jira issue BUG-23</span>
Title:    Total ignores quantity (charges 1 unit price)
Repro:    Add 3 of product #7 to cart -&gt; total shows 1x price
Expected: total = 3 x unitPrice
Actual:   total = unitPrice
Severity: Critical (wrong money)
Fix:      OrderService.total() summed price, not price*qty
Test:     added unit test total_multipliesByQty()  <span class="tok-comment"># prevents regression</span>
Status:   Fixed -&gt; Verified by QA -&gt; Closed</pre>
<div class="out"><b>Why write the failing test first:</b> BUG-23 came back twice in earlier projects because "fixed" meant "looked right once". The added test makes the fix permanent — if anyone breaks <code>total()</code> again, the build goes red immediately.</div>
<div class="pitfall"><b>Skipping tests to "save time"</b> is the most expensive shortcut in the course. Without them, every change risks silently breaking a feature that worked, and you rediscover bugs by hand the night before the demo. Even a handful of tests on the core transaction pays for itself.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>AI test generation — verify, don't trust.</b> The syllabus explicitly covers using AI to generate test cases (CLO4). It is genuinely useful for enumerating edge inputs (empty, negative, huge, unicode). But AI often writes tests that assert whatever the current code does — including its bugs — so a passing AI test can "prove" wrong behaviour correct. Read every generated assertion and ask "is this the behaviour the requirement wants?" AI expands your test <em>coverage</em>; only you can judge test <em>correctness</em>.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">Practice writing tests on Code Lab</span><span class="lc-sub">Assertions and test structure — build the habit before Milestone 3.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Chứng minh phần mềm đúng — kiểm thử</h2>
<p class="lead">"Nó chạy một lần trên máy tôi" không phải bằng chứng. Test biến một lời khẳng định thành bằng chứng lặp lại được, và bắt được bug bạn vô tình đưa lại vào tuần sau. Milestone 3 chấm trực tiếp kiểm thử.</p>
<h3>Kim tự tháp test — dồn công vào đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nhiều</div><div class="lz-t">Unit test</div><div class="lz-d">Một method cô lập · nhanh</div></div>
  <div class="lz-step"><div class="lz-k">Vừa</div><div class="lz-t">Integration test</div><div class="lz-d">Các lớp cùng nhau, DB / API thật</div></div>
  <div class="lz-step"><div class="lz-k">Ít</div><div class="lz-t">End-to-end (UI)</div><div class="lz-d">Selenium bấm app thật · chậm</div></div>
</div>
<h3>Một unit test (JUnit)</h3>
<pre><span class="tok-comment">// Test một luật của OrderService cô lập</span>
<span class="tok-keyword">@Test</span>
<span class="tok-keyword">void</span> <span class="tok-function">placeOrder_failsWhenStockTooLow</span>() {
    <span class="tok-comment">// Arrange: sản phẩm tồn 1, đơn xin 5</span>
    <span class="tok-comment">// Act &amp; Assert: mong đợi một OutOfStockException</span>
    assertThrows(<span class="tok-type">OutOfStockException</span>.<span class="tok-keyword">class</span>,
        () -&gt; service.placeOrder(customerId, fiveUnits));
}</pre>
<div class="callout">Một test có ba phần — <strong>Arrange, Act, Assert</strong>. Dựng tình huống, chạy một hành động, rồi khẳng định đúng kết quả mong đợi. Một test không có khẳng định chứng minh cho không có gì.</div>
<h3>Một integration test — qua API (Postman)</h3>
<pre><span class="tok-comment"># Kiểm cả stack trả lời đúng</span>
POST /api/orders   { "items": [ { "productId": 7, "qty": 2 } ] }
Mong đợi: 201 Created, body.status == "CONFIRMED", tồn kho giảm 2</pre>
<h3>Quản lý bug — một bug là một task, không phải tin nhắn chat</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Tiêu đề &amp; bước tái hiện</div><div class="lz-ld">"Thanh toán với món hết hàng → lỗi 500. Bước: 1… 2… 3…"</div></div>
  <div class="lz-layer"><div class="lz-lt">Mong đợi vs thực tế</div><div class="lz-ld">Cái gì nên xảy ra; cái gì đã xảy ra.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mức độ &amp; người phụ trách</div><div class="lz-ld">Nghiêm trọng/lớn/nhỏ; ai sửa.</div></div>
  <div class="lz-layer"><div class="lz-lt">Trạng thái</div><div class="lz-ld">Mở → Đang làm → Đã sửa → Đã kiểm chứng (bởi người khác).</div></div>
</div>
<h3>Ví dụ có lời giải · Worked example (một bug từ báo cáo tới đóng)</h3>
<pre><span class="tok-comment"># Jira issue BUG-23</span>
Tiêu đề:  Tổng tiền bỏ qua số lượng (tính giá 1 đơn vị)
Tái hiện: Thêm 3 sản phẩm #7 vào giỏ -&gt; tổng hiện 1x giá
Mong đợi: tổng = 3 x đơn giá
Thực tế:  tổng = đơn giá
Mức độ:   Critical (sai tiền)
Sửa:      OrderService.total() cộng price, không phải price*qty
Test:     thêm unit test total_multipliesByQty()  <span class="tok-comment"># chặn tái phát</span>
Trạng thái: Đã sửa -&gt; QA kiểm chứng -&gt; Đóng</pre>
<div class="out"><b>Vì sao viết test hỏng trước:</b> BUG-23 quay lại hai lần ở các đồ án trước vì "đã sửa" nghĩa là "nhìn có vẻ đúng một lần". Test thêm vào làm bản sửa vĩnh viễn — ai làm hỏng <code>total()</code> lần nữa, build đỏ ngay lập tức.</div>
<div class="pitfall"><b>Bỏ test để "tiết kiệm thời gian"</b> là lối tắt đắt nhất môn này. Không có chúng, mỗi thay đổi có nguy cơ âm thầm làm hỏng một tính năng đang chạy, và bạn tái phát hiện bug bằng tay đêm trước demo. Chỉ vài test trên giao dịch lõi cũng đã bõ công.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>AI sinh test — kiểm chứng, đừng tin.</b> Syllabus nói rõ về dùng AI sinh test case (CLO4). Nó thật sự hữu ích để liệt kê input biên (rỗng, âm, khổng lồ, unicode). Nhưng AI thường viết test khẳng định đúng những gì code hiện làm — kể cả bug của nó — nên một test AI pass có thể "chứng minh" hành vi sai là đúng. Đọc mọi khẳng định sinh ra và hỏi "đây có phải hành vi mà yêu cầu muốn không?" AI mở rộng <em>độ phủ</em> test; chỉ bạn phán được <em>tính đúng</em> của test.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">Luyện viết test trên Code Lab</span><span class="lc-sub">Khẳng định và cấu trúc test — tạo thói quen trước Milestone 3.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 5 — Testing & quality|||Quiz 5 — Kiểm thử & chất lượng',
          slug: 'swp391-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra các mức test, cấu trúc test và quản lý bug.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'In the test pyramid you should have the MOST of which tests?|||Trong kim tự tháp test, bạn nên có NHIỀU nhất loại test nào?', options: ['end-to-end UI tests|||test UI end-to-end', 'unit tests|||unit test', 'manual tests|||test thủ công', 'no tests|||không test'], correctIndex: 1, points: 1 },
              { question: 'The three parts of a well-formed test are…|||Ba phần của một test tốt là…', options: ['Import, Run, Print|||Import, Chạy, In', 'Arrange, Act, Assert|||Dựng, Hành động, Khẳng định', 'Open, Edit, Close|||Mở, Sửa, Đóng', 'Plan, Code, Deploy|||Kế hoạch, Code, Triển khai'], correctIndex: 1, points: 1 },
              { question: 'A test with no assertion…|||Một test không có khẳng định…', options: ['proves the code is correct|||chứng minh code đúng', 'proves nothing|||chứng minh không gì cả', 'is the best kind|||là loại tốt nhất', 'runs the fastest so is preferred|||chạy nhanh nhất nên ưu tiên'], correctIndex: 1, points: 1 },
              { question: 'A good bug report must include…|||Một báo cáo bug tốt phải có…', options: ['only the developer name|||chỉ tên lập trình viên', 'steps to reproduce, expected vs actual, severity|||bước tái hiện, mong đợi vs thực tế, mức độ', 'the full source code|||toàn bộ mã nguồn', 'nothing, just say it in chat|||không gì, cứ nói trong chat'], correctIndex: 1, points: 1 },
              { question: 'Writing a failing test before fixing a bug helps because…|||Viết một test hỏng trước khi sửa bug giúp vì…', options: ['it slows the team down|||làm nhóm chậm lại', 'it makes the fix permanent and catches regressions|||làm bản sửa vĩnh viễn và bắt tái phát', 'it deletes the bug|||xóa con bug', 'tests are graded by length|||test chấm theo độ dài'], correctIndex: 1, points: 1 },
              { question: 'When AI generates test cases, the key risk is that…|||Khi AI sinh test case, rủi ro chính là…', options: ['tests run too fast|||test chạy quá nhanh', 'it may assert the current (possibly buggy) behaviour as correct|||nó có thể khẳng định hành vi hiện tại (có thể có bug) là đúng', 'it writes too few tests|||viết quá ít test', 'it cannot use JUnit|||không dùng được JUnit'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — MILESTONE 3: DEPLOYMENT ══════════════════ */
    {
      title: 'Chapter 6 — Milestone 3: Deployment|||Chương 6 — Milestone 3: Triển khai',
      description: 'Build, môi trường staging, CI/CD cơ bản, chuẩn bị dữ liệu và kiểm chứng chức năng.',
      lessons: [
        {
          title: '6.1 — Build, staging, basic CI/CD & data preparation|||6.1 — Build, staging, CI/CD cơ bản & chuẩn bị dữ liệu',
          slug: 'swp391-6-1-build-staging-cicd',
          type: 'VIDEO',
          description: 'Từ code trên máy tới ứng dụng chạy trên staging, với build tự động và dữ liệu mẫu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Getting off "my machine" — deployment</h2>
<p class="lead">Milestone 3 needs the app running somewhere <em>other than a developer laptop</em>. Deployment is the step that turns "it compiles" into "anyone can open the URL and use it" — and it always surfaces the config you hard-coded by accident.</p>
<h3>Environments — dev, staging, production</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Dev</div><div class="lz-t">Your laptop</div><div class="lz-d">Fast iteration, fake data</div></div>
  <div class="lz-step"><div class="lz-k">Staging</div><div class="lz-t">A server like production</div><div class="lz-d">Demo &amp; test here — Milestone 3</div></div>
  <div class="lz-step"><div class="lz-k">Prod</div><div class="lz-t">Real users</div><div class="lz-d">The live release</div></div>
</div>
<h3>Build → package → run</h3>
<pre><span class="tok-comment"># A deployable build is one self-contained artifact</span>
mvn clean package        <span class="tok-comment"># Java  -&gt; target/app.jar</span>
<span class="tok-comment"># dotnet publish -c Release   -&gt; .NET</span>
<span class="tok-comment"># npm run build               -&gt; Node/React</span>

java -jar target/app.jar <span class="tok-comment"># run the exact artifact you tested</span></pre>
<h3>Configuration — never hard-code secrets</h3>
<pre><span class="tok-comment"># Read config from the environment, not the source</span>
DB_URL=jdbc:mysql://staging-db:3306/shop
DB_USER=app
DB_PASSWORD=\${DB_PASSWORD}      <span class="tok-comment"># injected at runtime, never committed</span></pre>
<div class="callout">The <strong>twelve-factor</strong> rule you will meet in industry: <em>store config in the environment</em>. The same build artifact runs in staging and production; only the injected environment variables differ. A password committed to Git is a security incident — keep secrets out of the repo.</div>
<h3>Basic CI/CD — automate the boring, error-prone steps</h3>
<pre><span class="tok-comment"># .github/workflows/ci.yml  (concept)</span>
on: push
jobs:
  build-and-test:
    steps:
      - checkout
      - run: mvn clean package   <span class="tok-comment"># build</span>
      - run: mvn test            <span class="tok-comment"># tests must pass</span>
      <span class="tok-comment"># CD (optional): on success, deploy to staging</span></pre>
<h3>Data preparation</h3>
<p>Ship a <strong>seed script</strong> that creates the schema and inserts realistic sample data (a few users, products, and a couple of orders) so the demo looks alive and reviewers can click immediately — no empty tables.</p>
<div class="pitfall"><b>The "works on my machine" trap.</b> The app runs locally because of a path, a port, a database already set up, or a secret only your laptop has. On staging none of that exists. Deploy <em>early</em> (before Milestone 3, not on demo day) so these surprises appear when you have time to fix them.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Semantic versioning &amp; release tags.</b> Tag your milestone builds: <code>v0.2.0</code> at Milestone 2, <code>v1.0.0</code> at the final. Semantic versioning reads MAJOR.MINOR.PATCH — bump PATCH for a bug fix, MINOR for a new backward-compatible feature, MAJOR for a breaking change. Tagged releases give you a known-good point to roll back to if a last-minute change breaks the demo — infinitely calmer than "git log and pray" an hour before defense.</div>
<a class="link-card exphub" href="/exp-hub/docker?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Package your app with Docker</span><span class="lc-sub">One container that runs the same everywhere — deployment guide on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Rời khỏi "máy tôi" — triển khai</h2>
<p class="lead">Milestone 3 cần app chạy ở đâu đó <em>khác laptop lập trình viên</em>. Triển khai là bước biến "nó biên dịch" thành "ai cũng mở URL và dùng được" — và nó luôn lộ ra phần cấu hình bạn vô tình hard-code.</p>
<h3>Môi trường — dev, staging, production</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Dev</div><div class="lz-t">Laptop của bạn</div><div class="lz-d">Lặp nhanh, dữ liệu giả</div></div>
  <div class="lz-step"><div class="lz-k">Staging</div><div class="lz-t">Server giống production</div><div class="lz-d">Demo &amp; test ở đây — Milestone 3</div></div>
  <div class="lz-step"><div class="lz-k">Prod</div><div class="lz-t">Người dùng thật</div><div class="lz-d">Bản phát hành live</div></div>
</div>
<h3>Build → đóng gói → chạy</h3>
<pre><span class="tok-comment"># Một build triển khai được là một artifact tự chứa</span>
mvn clean package        <span class="tok-comment"># Java  -&gt; target/app.jar</span>
<span class="tok-comment"># dotnet publish -c Release   -&gt; .NET</span>
<span class="tok-comment"># npm run build               -&gt; Node/React</span>

java -jar target/app.jar <span class="tok-comment"># chạy đúng artifact bạn đã test</span></pre>
<h3>Cấu hình — không bao giờ hard-code bí mật</h3>
<pre><span class="tok-comment"># Đọc cấu hình từ môi trường, không phải từ mã nguồn</span>
DB_URL=jdbc:mysql://staging-db:3306/shop
DB_USER=app
DB_PASSWORD=\${DB_PASSWORD}      <span class="tok-comment"># tiêm lúc chạy, không bao giờ commit</span></pre>
<div class="callout">Quy tắc <strong>twelve-factor</strong> bạn sẽ gặp trong ngành: <em>lưu cấu hình trong môi trường</em>. Cùng một artifact build chạy ở staging và production; chỉ khác biến môi trường được tiêm. Một mật khẩu commit vào Git là một sự cố bảo mật — giữ bí mật ngoài repo.</div>
<h3>CI/CD cơ bản — tự động hóa các bước nhàm chán, dễ sai</h3>
<pre><span class="tok-comment"># .github/workflows/ci.yml  (khái niệm)</span>
on: push
jobs:
  build-and-test:
    steps:
      - checkout
      - run: mvn clean package   <span class="tok-comment"># build</span>
      - run: mvn test            <span class="tok-comment"># test phải pass</span>
      <span class="tok-comment"># CD (tùy chọn): nếu thành công, deploy lên staging</span></pre>
<h3>Chuẩn bị dữ liệu</h3>
<p>Ship kèm một <strong>script seed</strong> tạo schema và chèn dữ liệu mẫu thực tế (vài người dùng, sản phẩm, và vài đơn hàng) để demo trông sống động và người chấm bấm được ngay — không bảng trống.</p>
<div class="pitfall"><b>Bẫy "chạy trên máy tôi".</b> App chạy cục bộ nhờ một đường dẫn, một cổng, một CSDL đã dựng sẵn, hay một bí mật chỉ laptop bạn có. Trên staging chẳng cái nào tồn tại. Deploy <em>sớm</em> (trước Milestone 3, không phải ngày demo) để những bất ngờ này lộ ra khi bạn còn thời gian sửa.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Semantic versioning &amp; release tag.</b> Gắn tag cho các build milestone: <code>v0.2.0</code> ở Milestone 2, <code>v1.0.0</code> ở bản cuối. Semantic versioning đọc MAJOR.MINOR.PATCH — tăng PATCH cho sửa bug, MINOR cho tính năng mới tương thích ngược, MAJOR cho thay đổi phá vỡ. Bản phát hành có tag cho bạn một điểm biết-tốt để quay lui nếu một thay đổi phút chót làm hỏng demo — bình tĩnh hơn vô hạn so với "git log và cầu nguyện" một giờ trước bảo vệ.</div>
<a class="link-card exphub" href="/exp-hub/docker?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Đóng gói app bằng Docker</span><span class="lc-sub">Một container chạy giống nhau mọi nơi — hướng dẫn triển khai trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Milestone 3 — Completion & deployment checklist|||Milestone 3 — Checklist hoàn thiện & triển khai',
          slug: 'swp391-milestone-3-checklist',
          type: 'VIDEO',
          description: 'Danh sách kiểm trước khi nộp Milestone 3 (hệ thống đầy đủ + test + deploy, 25%).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Milestone 3</span>
<h2>Milestone 3 submission checklist (Week 10 · 25%)</h2>
<p class="lead">Milestone 3 is the <strong>full system</strong>: every workflow complete, tested, and deployed to staging. This is the dress rehearsal for the final presentation.</p>
<div class="out">
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ All workflows (0–3) complete, including dashboard/reporting</div><div class="lz-ld">The full backlog, not just the core path.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Deployed to a staging URL, reachable by the reviewer</div><div class="lz-ld">Not localhost — a real host or container.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Unit + integration tests present and passing</div><div class="lz-ld">At least the core transaction and its exception path covered.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Seed/sample data loaded</div><div class="lz-ld">Reviewers can click a populated system immediately.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ No hard-coded secrets; config via environment</div><div class="lz-ld">Passwords/keys out of the repo.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Known bugs tracked; criticals fixed &amp; verified</div><div class="lz-ld">A clean bug board; no open critical issues.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Release tagged (e.g. v1.0.0)</div><div class="lz-ld">A safe point to roll back to.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Final report drafted</div><div class="lz-ld">Ready to polish for the presentation.</div></div>
</div>
</div>
<div class="callout ok">Do a full <strong>User Acceptance Test</strong> against your original acceptance criteria: for each core user story, click through the app and confirm it does exactly what the story promised. Any gap found now is a fixable gap; found in the defense it is a lost mark.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Milestone 3</span>
<h2>Checklist nộp Milestone 3 (Tuần 10 · 25%)</h2>
<p class="lead">Milestone 3 là <strong>hệ thống đầy đủ</strong>: mọi workflow hoàn chỉnh, đã test, và đã deploy lên staging. Đây là buổi tổng duyệt cho thuyết trình cuối.</p>
<div class="out">
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">☐ Mọi workflow (0–3) hoàn chỉnh, gồm dashboard/báo cáo</div><div class="lz-ld">Trọn backlog, không chỉ đường lõi.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Đã deploy lên URL staging, người chấm truy cập được</div><div class="lz-ld">Không phải localhost — một host hoặc container thật.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Có unit + integration test và đều pass</div><div class="lz-ld">Ít nhất phủ giao dịch lõi và đường ngoại lệ.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Đã nạp dữ liệu seed/mẫu</div><div class="lz-ld">Người chấm bấm ngay một hệ thống có dữ liệu.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Không hard-code bí mật; cấu hình qua môi trường</div><div class="lz-ld">Mật khẩu/khóa ngoài repo.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Bug đã biết được theo dõi; critical đã sửa &amp; kiểm chứng</div><div class="lz-ld">Bảng bug sạch; không issue critical còn mở.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Đã gắn tag bản phát hành (vd v1.0.0)</div><div class="lz-ld">Một điểm an toàn để quay lui.</div></div>
  <div class="lz-layer"><div class="lz-lt">☐ Đã nháp báo cáo cuối</div><div class="lz-ld">Sẵn sàng chỉnh cho thuyết trình.</div></div>
</div>
</div>
<div class="callout ok">Chạy một <strong>User Acceptance Test</strong> đầy đủ đối chiếu tiêu chí chấp nhận gốc: với mỗi user story lõi, bấm xuyên app và xác nhận nó làm đúng những gì story hứa. Khoảng trống tìm thấy bây giờ là khoảng trống sửa được; tìm thấy trong buổi bảo vệ là điểm bị mất.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — TEAMWORK & PRESENTATION ══════════════════ */
    {
      title: 'Chapter 7 — Teamwork, report & final presentation|||Chương 7 — Teamwork, báo cáo & thuyết trình cuối',
      description: 'Chia việc, standup, đạo đức nghề nghiệp, viết báo cáo và trình bày demo (40%).',
      lessons: [
        {
          title: '7.1 — Teamwork, standups & professional ethics|||7.1 — Teamwork, standup & đạo đức nghề nghiệp',
          slug: 'swp391-7-1-teamwork-ethics',
          type: 'VIDEO',
          description: 'Chia việc công bằng, standup ngắn, và đạo đức (dữ liệu, ghi công, dùng AI trung thực).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Working as a team, not five soloists</h2>
<p class="lead">The hardest part of SWP391 is rarely the code — it is five people staying in sync. CLO5 grades teamwork, ethics and responsible AI use directly, and supervisors watch how you collaborate, not just what you ship.</p>
<h3>The daily standup — 10 minutes, three questions</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Yesterday</div><div class="lz-t">What I finished</div><div class="lz-d">merged the login PR</div></div>
  <div class="lz-step"><div class="lz-k">Today</div><div class="lz-t">What I'll do</div><div class="lz-d">start the order service</div></div>
  <div class="lz-step"><div class="lz-k">Blockers</div><div class="lz-t">What's stopping me</div><div class="lz-d">need the DB schema merged</div></div>
</div>
<div class="callout">A standup is for <strong>surfacing blockers early</strong>, not status theatre. The moment someone says "I've been stuck on this for two days" — that should have come out on day one. Short, daily, honest.</div>
<h3>Dividing work fairly</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">By vertical slice, not by layer</div><div class="lz-ld">Give one person a whole feature (controller→service→repo→view), so they own something end-to-end — more motivating and less blocking than "you do all the SQL".</div></div>
  <div class="lz-layer"><div class="lz-lt">Balance load, rotate the hard bits</div><div class="lz-ld">Nobody only does easy CRUD while one person carries the transaction logic.</div></div>
  <div class="lz-layer"><div class="lz-lt">Make contribution visible</div><div class="lz-ld">Everyone commits under their own account; the board shows who owns what.</div></div>
</div>
<h3>Professional ethics</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Honest attribution</div><div class="lz-ld">Cite libraries, tutorials, and AI assistance. Passing others' code as your own is plagiarism.</div></div>
  <div class="lz-layer"><div class="lz-lt">Responsible AI use</div><div class="lz-ld">Disclose where AI helped; never paste private user data or secrets into a public AI tool; verify AI output.</div></div>
  <div class="lz-layer"><div class="lz-lt">Data &amp; privacy</div><div class="lz-ld">Hash passwords, don't log sensitive data, use only data you're allowed to use.</div></div>
</div>
<div class="pitfall"><b>The silent free-rider and the lone hero</b> are two sides of one failure. If one person quietly does nothing, raise it in a standup early — not in the final week. If one person does everything, the team learns less and the bus factor is one: the day they're sick, the project stalls. Balanced contribution is both fairer and safer.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The bus factor.</b> "How many people can get hit by a bus before the project is doomed?" A bus factor of one — only Minh understands the deployment, only Lan can touch the payments code — is a real risk teams ignore until it bites. Reduce it deliberately: pair on the scary parts, document the deploy steps, review across boundaries. A committee that hears "we made sure at least two of us understand every part" hears a mature team.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Làm việc như một nhóm, không phải năm nghệ sĩ solo</h2>
<p class="lead">Phần khó nhất của SWP391 hiếm khi là code — mà là năm người giữ đồng bộ với nhau. CLO5 chấm trực tiếp teamwork, đạo đức và dùng AI có trách nhiệm, và giảng viên quan sát cách bạn cộng tác, không chỉ những gì bạn ship.</p>
<h3>Standup hằng ngày — 10 phút, ba câu hỏi</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Hôm qua</div><div class="lz-t">Tôi đã xong gì</div><div class="lz-d">merged PR đăng nhập</div></div>
  <div class="lz-step"><div class="lz-k">Hôm nay</div><div class="lz-t">Tôi sẽ làm gì</div><div class="lz-d">bắt đầu order service</div></div>
  <div class="lz-step"><div class="lz-k">Vướng mắc</div><div class="lz-t">Gì đang chặn tôi</div><div class="lz-d">cần schema DB được merge</div></div>
</div>
<div class="callout">Standup để <strong>lộ vướng mắc sớm</strong>, không phải diễn báo cáo. Khoảnh khắc ai đó nói "tôi kẹt cái này hai ngày rồi" — điều đó lẽ ra phải ra từ ngày đầu. Ngắn, hằng ngày, thành thật.</div>
<h3>Chia việc công bằng</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Theo lát cắt dọc, không theo lớp</div><div class="lz-ld">Giao một người cả một tính năng (controller→service→repo→view), để họ làm chủ thứ gì đó từ đầu đến cuối — tạo động lực hơn và ít chặn nhau hơn "cậu làm hết SQL".</div></div>
  <div class="lz-layer"><div class="lz-lt">Cân tải, luân phiên phần khó</div><div class="lz-ld">Không ai chỉ làm CRUD dễ trong khi một người gánh logic giao dịch.</div></div>
  <div class="lz-layer"><div class="lz-lt">Làm đóng góp thấy được</div><div class="lz-ld">Mọi người commit dưới tài khoản riêng; bảng cho thấy ai làm chủ cái gì.</div></div>
</div>
<h3>Đạo đức nghề nghiệp</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ghi công trung thực</div><div class="lz-ld">Trích dẫn thư viện, tutorial, và sự hỗ trợ của AI. Nhận code người khác là của mình là đạo văn.</div></div>
  <div class="lz-layer"><div class="lz-lt">Dùng AI có trách nhiệm</div><div class="lz-ld">Công khai nơi AI giúp; không bao giờ dán dữ liệu người dùng riêng tư hay bí mật vào công cụ AI công cộng; kiểm chứng đầu ra AI.</div></div>
  <div class="lz-layer"><div class="lz-lt">Dữ liệu &amp; quyền riêng tư</div><div class="lz-ld">Băm mật khẩu, không log dữ liệu nhạy cảm, chỉ dùng dữ liệu được phép dùng.</div></div>
</div>
<div class="pitfall"><b>Kẻ ăn theo im lặng và người hùng đơn độc</b> là hai mặt của một thất bại. Nếu một người lặng lẽ không làm gì, nêu ở standup sớm — không phải tuần cuối. Nếu một người làm tất cả, cả nhóm học ít hơn và bus factor bằng một: ngày họ ốm, đồ án đứng. Đóng góp cân bằng vừa công bằng vừa an toàn hơn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bus factor.</b> "Bao nhiêu người bị xe buýt tông thì đồ án tiêu?" Bus factor bằng một — chỉ Minh hiểu triển khai, chỉ Lan đụng được code thanh toán — là rủi ro thật mà nhóm phớt lờ tới khi nó cắn. Giảm nó có chủ đích: pair ở phần đáng sợ, ghi lại bước deploy, review qua ranh giới. Hội đồng nghe "nhóm đảm bảo ít nhất hai người hiểu mọi phần" là nghe một nhóm trưởng thành.</div>
</div>
`,
        },
        {
          title: '7.2 — The final report & presentation (40%)|||7.2 — Báo cáo cuối & thuyết trình (40%)',
          slug: 'swp391-7-2-report-presentation',
          type: 'VIDEO',
          description: 'Cấu trúc báo cáo, kịch bản demo, và cách bảo vệ trước hội đồng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>The final presentation — 40% of your grade</h2>
<p class="lead">A great project presented badly loses marks a mediocre project presented well keeps. The final is a live demo plus a defense: show the software running, then answer "why did you build it this way?" against the CLOs.</p>
<h3>The report — a clear narrative</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1. Introduction</div><div class="lz-ld">The problem, the users, the one-sentence goal.</div></div>
  <div class="lz-layer"><div class="lz-lt">2. Requirements</div><div class="lz-ld">SRS summary, key use cases and user stories.</div></div>
  <div class="lz-layer"><div class="lz-lt">3. Design</div><div class="lz-ld">ERD, MVC architecture, API — and the decisions behind them.</div></div>
  <div class="lz-layer"><div class="lz-lt">4. Implementation &amp; testing</div><div class="lz-ld">Key features, tech stack, test approach and results.</div></div>
  <div class="lz-layer"><div class="lz-lt">5. Teamwork, AI use &amp; reflection</div><div class="lz-ld">Contribution, how AI helped, what you'd do differently.</div></div>
</div>
<h3>The demo — rehearsed and safe</h3>
<pre><span class="tok-comment"># A demo script that survives contact with a committee</span>
1. Start from the deployed staging URL (not localhost)
2. Log in as a seeded user
3. Show Workflow 2 success: place an order end-to-end
4. Show the exception path: out-of-stock is handled gracefully
5. Show the dashboard/report
6. Close with the architecture slide -&gt; take questions</pre>
<div class="callout">Rehearse the demo <strong>at least twice, end-to-end, on the staging environment</strong> — the exact clicks, in order. Record a short backup video of the working flow so a live network glitch never leaves you with a blank screen and a ticking clock.</div>
<h3>Defending your choices (the CLO questions)</h3>
<table>
  <thead><tr><th>They ask</th><th>You answer with</th></tr></thead>
  <tbody>
    <tr><td>"How did you validate requirements?" (CLO1)</td><td>Interviews + AI role-play, traced to numbered FRs</td></tr>
    <tr><td>"Why this schema?" (CLO3)</td><td>Normalized to 3NF, FK constraints, one anomaly you avoided</td></tr>
    <tr><td>"Where did AI help, and how did you check it?" (CLO4/5)</td><td>One concrete example + how you verified it</td></tr>
    <tr><td>"What would you improve?" </td><td>Your tracked tech debt + v2 backlog</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · Worked example (a strong 8-minute demo)</h3>
<pre>0:00  "Our system is a clinic booking app for one receptionist."   <span class="tok-comment"># goal</span>
1:00  Login (seeded), show the dashboard                          <span class="tok-comment"># it's real</span>
2:30  Book an appointment end-to-end -&gt; confirmation               <span class="tok-comment"># Workflow 2 success</span>
4:00  Try a taken slot -&gt; graceful "already booked" message        <span class="tok-comment"># exception path</span>
5:00  Show today's report                                          <span class="tok-comment"># Workflow 3</span>
6:00  One architecture slide: MVC + ERD                            <span class="tok-comment"># design</span>
7:00  "AI drafted our test cases; we fixed two wrong assertions."  <span class="tok-comment"># responsible AI</span>
7:30  Questions</pre>
<div class="out"><b>Why it scores well:</b> it opens with the goal, proves the software is real by using seeded data, shows both the success and exception paths (not just the happy demo), and volunteers the design reasoning and honest AI use the CLOs reward — before being asked.</div>
<div class="pitfall">Two demo-day killers: (1) demoing from <code>localhost</code> with unsaved local state that "only works here"; (2) one person talking for the whole time. Split the talk so every member presents their area — the committee grades individuals, and silence reads as "didn't contribute".</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The retrospective.</b> The syllabus ends with "Project Closing &amp; Retrospective" for a reason. A retrospective asks three honest questions: what went well, what didn't, what we'll change. It is not blame — it is how teams turn one project's pain into next project's skill. Bring one genuine lesson ("we integrated too late and paid for it at Milestone 2") to your defense: reflective teams signal exactly the professional maturity CLO5 is looking for.</div>
<a class="link-card exphub" href="/exp-hub/tech-presentation?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🎤</span>
  <span class="lc-body"><span class="lc-title">Present &amp; demo like an engineer</span><span class="lc-sub">Structuring a demo, slides that support (not replace) it — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Thuyết trình cuối — 40% điểm của bạn</h2>
<p class="lead">Một đồ án hay mà trình bày dở mất điểm mà một đồ án trung bình trình bày tốt giữ được. Buổi cuối là demo trực tiếp cộng bảo vệ: cho thấy phần mềm chạy, rồi trả lời "vì sao xây theo cách này?" đối chiếu các CLO.</p>
<h3>Báo cáo — một mạch kể rõ ràng</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1. Giới thiệu</div><div class="lz-ld">Bài toán, người dùng, câu mục tiêu.</div></div>
  <div class="lz-layer"><div class="lz-lt">2. Yêu cầu</div><div class="lz-ld">Tóm tắt SRS, use case và user story chính.</div></div>
  <div class="lz-layer"><div class="lz-lt">3. Thiết kế</div><div class="lz-ld">ERD, kiến trúc MVC, API — và các quyết định đằng sau.</div></div>
  <div class="lz-layer"><div class="lz-lt">4. Hiện thực &amp; kiểm thử</div><div class="lz-ld">Tính năng chính, tech stack, cách test và kết quả.</div></div>
  <div class="lz-layer"><div class="lz-lt">5. Teamwork, dùng AI &amp; suy ngẫm</div><div class="lz-ld">Đóng góp, AI giúp thế nào, sẽ làm khác gì.</div></div>
</div>
<h3>Demo — đã tập và an toàn</h3>
<pre><span class="tok-comment"># Kịch bản demo sống sót khi va chạm hội đồng</span>
1. Bắt đầu từ URL staging đã deploy (không phải localhost)
2. Đăng nhập bằng một user đã seed
3. Cho thấy Workflow 2 thành công: đặt đơn từ đầu đến cuối
4. Cho thấy đường ngoại lệ: hết hàng được xử lý nhẹ nhàng
5. Cho thấy dashboard/báo cáo
6. Kết bằng slide kiến trúc -&gt; nhận câu hỏi</pre>
<div class="callout">Tập demo <strong>ít nhất hai lần, từ đầu đến cuối, trên môi trường staging</strong> — đúng các cú bấm, theo thứ tự. Quay một video dự phòng ngắn của luồng chạy để một trục trặc mạng trực tiếp không bao giờ để bạn với màn hình trắng và đồng hồ đang chạy.</div>
<h3>Bảo vệ lựa chọn của bạn (các câu hỏi CLO)</h3>
<table>
  <thead><tr><th>Họ hỏi</th><th>Bạn trả lời bằng</th></tr></thead>
  <tbody>
    <tr><td>"Nhóm kiểm chứng yêu cầu thế nào?" (CLO1)</td><td>Phỏng vấn + AI role-play, truy về các FR đánh số</td></tr>
    <tr><td>"Vì sao schema này?" (CLO3)</td><td>Chuẩn hóa 3NF, ràng buộc FK, một dị thường đã tránh</td></tr>
    <tr><td>"AI giúp ở đâu, kiểm thế nào?" (CLO4/5)</td><td>Một ví dụ cụ thể + cách kiểm chứng</td></tr>
    <tr><td>"Sẽ cải thiện gì?"</td><td>Nợ kỹ thuật đã theo dõi + backlog v2</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · Worked example (một demo 8 phút mạnh)</h3>
<pre>0:00  "Hệ thống là app đặt lịch phòng khám cho một lễ tân."      <span class="tok-comment"># mục tiêu</span>
1:00  Đăng nhập (đã seed), cho thấy dashboard                    <span class="tok-comment"># nó thật</span>
2:30  Đặt lịch từ đầu đến cuối -&gt; xác nhận                        <span class="tok-comment"># Workflow 2 thành công</span>
4:00  Thử một khung đã kín -&gt; thông báo "đã có người đặt"       <span class="tok-comment"># đường ngoại lệ</span>
5:00  Cho thấy báo cáo hôm nay                                    <span class="tok-comment"># Workflow 3</span>
6:00  Một slide kiến trúc: MVC + ERD                             <span class="tok-comment"># thiết kế</span>
7:00  "AI phác test case; nhóm sửa hai khẳng định sai."         <span class="tok-comment"># AI có trách nhiệm</span>
7:30  Câu hỏi</pre>
<div class="out"><b>Vì sao ăn điểm:</b> mở đầu bằng mục tiêu, chứng minh phần mềm thật bằng dữ liệu seed, cho thấy cả đường thành công lẫn ngoại lệ (không chỉ demo êm), và tự nguyện nêu lý do thiết kế và dùng AI trung thực mà các CLO thưởng — trước khi bị hỏi.</div>
<div class="pitfall">Hai sát thủ ngày demo: (1) demo từ <code>localhost</code> với trạng thái cục bộ chưa lưu mà "chỉ chạy ở đây"; (2) một người nói suốt cả buổi. Chia phần nói để mỗi thành viên trình bày mảng của mình — hội đồng chấm cá nhân, và im lặng bị đọc là "không đóng góp".</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Retrospective (họp rút kinh nghiệm).</b> Syllabus kết bằng "Project Closing &amp; Retrospective" là có lý do. Một retrospective hỏi ba câu thành thật: cái gì tốt, cái gì không, sẽ đổi gì. Nó không phải đổ lỗi — nó là cách nhóm biến nỗi đau của đồ án này thành kỹ năng cho đồ án sau. Mang một bài học thật ("nhóm tích hợp quá muộn và trả giá ở Milestone 2") tới buổi bảo vệ: nhóm biết suy ngẫm phát đúng tín hiệu trưởng thành nghề nghiệp mà CLO5 tìm.</div>
<a class="link-card exphub" href="/exp-hub/tech-presentation?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🎤</span>
  <span class="lc-body"><span class="lc-title">Thuyết trình &amp; demo như một kỹ sư</span><span class="lc-sub">Cấu trúc một demo, slide hỗ trợ (không thay) nó — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 7 — Teamwork, report & presentation|||Quiz 7 — Teamwork, báo cáo & thuyết trình',
          slug: 'swp391-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra teamwork, đạo đức, và trình bày/bảo vệ đồ án.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The main purpose of a daily standup is to…|||Mục đích chính của standup hằng ngày là…', options: ['impress the teacher|||gây ấn tượng với giảng viên', 'surface blockers early|||lộ vướng mắc sớm', 'write more code|||viết thêm code', 'assign blame|||đổ lỗi'], correctIndex: 1, points: 1 },
              { question: 'Dividing work "by vertical slice" means…|||Chia việc "theo lát cắt dọc" nghĩa là…', options: ['one person does all the SQL|||một người làm hết SQL', 'one person owns a whole feature across all layers|||một người làm chủ cả một tính năng xuyên mọi lớp', 'nobody owns anything|||không ai làm chủ gì', 'splitting by day of the week|||chia theo ngày trong tuần'], correctIndex: 1, points: 1 },
              { question: 'Responsible AI use in the project requires that you…|||Dùng AI có trách nhiệm trong đồ án yêu cầu bạn…', options: ['hide that AI was used|||giấu việc đã dùng AI', 'disclose AI help, verify output, and never paste secrets into it|||công khai AI giúp, kiểm chứng đầu ra, và không dán bí mật vào nó', 'let AI write everything unchecked|||để AI viết tất cả không kiểm', 'only use AI for the demo|||chỉ dùng AI cho demo'], correctIndex: 1, points: 1 },
              { question: 'The final presentation is worth… of the grade.|||Thuyết trình cuối chiếm… điểm.', options: ['15%', '25%', '40%', '10%'], correctIndex: 2, points: 1 },
              { question: 'A safe demo should be run from…|||Một demo an toàn nên chạy từ…', options: ['localhost with unsaved state|||localhost với trạng thái chưa lưu', 'the deployed staging URL, rehearsed, with a backup video|||URL staging đã deploy, đã tập, có video dự phòng', 'a teammate\'s phone|||điện thoại của đồng đội', 'the source code only|||chỉ mã nguồn'], correctIndex: 1, points: 1 },
              { question: 'A low "bus factor" is a risk because… (beyond-syllabus)|||"Bus factor" thấp là rủi ro vì… (ngoài giáo trình)', options: ['the code runs slower|||code chạy chậm hơn', 'only one person understands a critical part, stalling the project if they\'re unavailable|||chỉ một người hiểu một phần quan trọng, đồ án đứng nếu họ vắng', 'there are too many tests|||có quá nhiều test', 'the report is too long|||báo cáo quá dài'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — NÂNG CAO: RESPONSIBLE AI IN THE SDLC ══════════════════ */
    {
      title: 'Chapter 8 (Advanced) — Responsible AI across the SDLC|||Chương 8 (Nâng cao) — AI có trách nhiệm xuyên suốt SDLC',
      description: 'Dùng GenAI cho code gen, review và test một cách có kỷ luật — và biết giới hạn của nó.',
      lessons: [
        {
          title: '8.1 — GenAI as a teammate: code gen, review & test|||8.1 — GenAI như đồng đội: sinh code, review & test',
          slug: 'swp391-8-1-responsible-ai',
          type: 'VIDEO',
          description: 'Prompt tốt, kiểm chứng đầu ra, và các bẫy của AI pair-programming.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1 · Advanced</span>
<h2>Using GenAI well — the augmented engineer</h2>
<p class="lead">The 2026 syllabus treats AI as a first-class tool across every phase. Used well, it makes a five-person team feel like eight. Used badly, it fills your repo with confident, wrong code you can't explain in the defense. This lesson is the discipline that separates the two.</p>
<h3>Where AI genuinely helps in each phase</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Requirements</div><div class="lz-ld">Role-play a stakeholder, brainstorm edge cases, turn notes into structured user stories.</div></div>
  <div class="lz-layer"><div class="lz-lt">Design</div><div class="lz-ld">Draft an ERD from a description, suggest module boundaries, critique your schema for anomalies.</div></div>
  <div class="lz-layer"><div class="lz-lt">Implementation</div><div class="lz-ld">Autocomplete boilerplate, explain a stack trace, translate a query between SQL dialects.</div></div>
  <div class="lz-layer"><div class="lz-lt">Testing</div><div class="lz-ld">Enumerate edge inputs, draft test skeletons, suggest missing cases.</div></div>
  <div class="lz-layer"><div class="lz-lt">Docs &amp; report</div><div class="lz-ld">Tighten prose, generate diagram descriptions, summarise your commit history.</div></div>
</div>
<h3>A good prompt gives context, constraints & format</h3>
<pre><span class="tok-comment"># Weak prompt</span>
"write a login function"

<span class="tok-comment"># Strong prompt</span>
"Write a Spring Boot @Service method loginUser(email, rawPassword)
 that: looks up the user by email via UserRepository,
 verifies the password with BCrypt, throws AuthException on failure,
 and returns a UserDTO on success. Use constructor injection.
 Explain any security assumption you make."</pre>
<h3>Ví dụ có lời giải · Worked example (accept, then verify)</h3>
<pre><span class="tok-comment"># AI suggests a "search products" query:</span>
"SELECT * FROM Product WHERE name LIKE '%" + term + "%'"

<span class="tok-comment"># Review before accepting — two red flags:</span>
1. String concatenation -&gt; SQL injection. Rewrite with a ? parameter.
2. SELECT *  -&gt; fetches columns you don't need; name them.

<span class="tok-comment"># Verified version you actually commit:</span>
"SELECT id, name, price FROM Product WHERE name LIKE ?"   <span class="tok-comment"># bind '%'+term+'%'</span></pre>
<div class="out"><b>The habit:</b> AI drafts in seconds, but the commit is <em>yours</em>. Every AI suggestion passes the same review a teammate's PR would — correctness, security, performance, clarity — before it enters <code>main</code>.</div>
<div class="pitfall"><b>Hallucination &amp; over-trust.</b> AI states non-existent library methods, subtly wrong SQL, and plausible-but-false facts with total confidence. It also happily leaks anything you paste — never feed it real user data, credentials, or private keys. Treat every output as a <em>draft from a fast but unreliable junior</em>: helpful, never authoritative.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>AI pair-programming caveats — skill atrophy &amp; the "70% problem".</b> Practitioners observe that AI gets you ~70% of the way fast, but the last 30% (making it correct, secure, and maintainable) still needs a real engineer — and juniors who lean on AI for everything can stop building the judgment needed to spot that missing 30%. The defense against both: use AI to go faster on things you <em>could</em> do yourself, and always be able to explain, line by line, what you shipped. In your SWP391 defense, "I can walk you through exactly how this works and why" is worth more than any amount of AI-generated volume.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1 · Nâng cao</span>
<h2>Dùng GenAI cho tốt — kỹ sư được tăng cường</h2>
<p class="lead">Syllabus 2026 coi AI là công cụ hạng nhất ở mọi pha. Dùng tốt, nó khiến nhóm năm người như tám. Dùng dở, nó lấp repo của bạn bằng code tự tin nhưng sai mà bạn không giải thích nổi trong buổi bảo vệ. Bài này là kỷ luật phân biệt hai điều đó.</p>
<h3>Nơi AI thật sự giúp ở mỗi pha</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Yêu cầu</div><div class="lz-ld">Role-play stakeholder, brainstorm edge case, biến ghi chú thành user story có cấu trúc.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thiết kế</div><div class="lz-ld">Phác ERD từ mô tả, gợi ý ranh giới module, phê bình schema tìm dị thường.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hiện thực</div><div class="lz-ld">Tự hoàn thành code khuôn mẫu, giải thích stack trace, dịch query giữa các phương ngữ SQL.</div></div>
  <div class="lz-layer"><div class="lz-lt">Kiểm thử</div><div class="lz-ld">Liệt kê input biên, phác khung test, gợi ý case còn thiếu.</div></div>
  <div class="lz-layer"><div class="lz-lt">Tài liệu &amp; báo cáo</div><div class="lz-ld">Gọt câu chữ, sinh mô tả sơ đồ, tóm tắt lịch sử commit.</div></div>
</div>
<h3>Một prompt tốt cho ngữ cảnh, ràng buộc &amp; định dạng</h3>
<pre><span class="tok-comment"># Prompt yếu</span>
"viết hàm đăng nhập"

<span class="tok-comment"># Prompt mạnh</span>
"Viết một @Service method loginUser(email, rawPassword) Spring Boot
 mà: tra user theo email qua UserRepository,
 xác minh mật khẩu bằng BCrypt, ném AuthException khi thất bại,
 và trả UserDTO khi thành công. Dùng constructor injection.
 Giải thích mọi giả định bảo mật bạn đặt ra."</pre>
<h3>Ví dụ có lời giải · Worked example (nhận, rồi kiểm chứng)</h3>
<pre><span class="tok-comment"># AI gợi ý một query "tìm sản phẩm":</span>
"SELECT * FROM Product WHERE name LIKE '%" + term + "%'"

<span class="tok-comment"># Review trước khi nhận — hai cờ đỏ:</span>
1. Nối chuỗi -&gt; SQL injection. Viết lại với tham số ?.
2. SELECT *  -&gt; lấy cả cột không cần; nêu tên cột.

<span class="tok-comment"># Phiên bản đã kiểm chứng bạn thật sự commit:</span>
"SELECT id, name, price FROM Product WHERE name LIKE ?"   <span class="tok-comment"># gán '%'+term+'%'</span></pre>
<div class="out"><b>Thói quen:</b> AI phác trong vài giây, nhưng commit là <em>của bạn</em>. Mọi gợi ý AI qua đúng vòng review như PR của một đồng đội — đúng đắn, bảo mật, hiệu năng, rõ ràng — trước khi vào <code>main</code>.</div>
<div class="pitfall"><b>Ảo giác &amp; tin quá mức.</b> AI nêu method thư viện không tồn tại, SQL sai tinh vi, và sự thật nghe hợp lý nhưng giả — với sự tự tin tuyệt đối. Nó cũng vui vẻ rò rỉ bất cứ gì bạn dán vào — đừng bao giờ đưa dữ liệu người dùng thật, thông tin đăng nhập, hay khóa riêng. Coi mọi đầu ra là <em>bản nháp từ một junior nhanh nhưng không đáng tin</em>: hữu ích, không bao giờ là chân lý.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cảnh báo AI pair-programming — teo kỹ năng &amp; "vấn đề 70%".</b> Người trong nghề nhận thấy AI đưa bạn ~70% quãng đường một cách nhanh, nhưng 30% cuối (làm nó đúng, an toàn, bảo trì được) vẫn cần một kỹ sư thật — và junior dựa AI cho mọi thứ có thể ngừng xây dựng năng lực phán đoán cần để nhận ra 30% còn thiếu đó. Cách chống cả hai: dùng AI để đi nhanh hơn ở những việc bạn <em>tự làm được</em>, và luôn giải thích được, từng dòng, thứ bạn ship. Trong buổi bảo vệ SWP391, "em trình bày được chính xác cái này chạy thế nào và vì sao" giá trị hơn mọi khối lượng do AI sinh.</div>
</div>
`,
        },
        {
          title: 'Quiz 8 — Responsible AI in the SDLC|||Quiz 8 — AI có trách nhiệm trong SDLC',
          slug: 'swp391-quiz-8',
          type: 'QUIZ',
          description: 'Kiểm tra dùng AI có trách nhiệm, kiểm chứng đầu ra và giới hạn của AI.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The correct stance toward AI-generated code is…|||Thái độ đúng với code do AI sinh là…', options: ['commit it unread to save time|||commit không đọc để tiết kiệm giờ', 'treat it as a draft to review for correctness, security and clarity|||coi là bản nháp để review về đúng đắn, bảo mật, rõ ràng', 'never use it|||không bao giờ dùng', 'trust it more than a teammate|||tin hơn một đồng đội'], correctIndex: 1, points: 1 },
              { question: 'A strong prompt includes…|||Một prompt mạnh có…', options: ['just "make it work"|||chỉ "làm cho chạy"', 'context, constraints and desired format|||ngữ cảnh, ràng buộc và định dạng mong muốn', 'no details so AI is creative|||không chi tiết để AI sáng tạo', 'the whole database|||cả cơ sở dữ liệu'], correctIndex: 1, points: 1 },
              { question: 'What must you NEVER paste into a public AI tool?|||Bạn KHÔNG BAO GIỜ được dán gì vào một công cụ AI công cộng?', options: ['a generic algorithm question|||một câu hỏi thuật toán chung', 'real user data, credentials or private keys|||dữ liệu người dùng thật, thông tin đăng nhập hay khóa riêng', 'a public library name|||tên một thư viện công khai', 'a syntax error message|||một thông báo lỗi cú pháp'], correctIndex: 1, points: 1 },
              { question: '"AI hallucination" refers to AI…|||"Ảo giác AI" chỉ việc AI…', options: ['running out of memory|||hết bộ nhớ', 'stating false things (e.g. non-existent methods) with confidence|||nêu điều sai (vd method không tồn tại) một cách tự tin', 'refusing to answer|||từ chối trả lời', 'being too slow|||quá chậm'], correctIndex: 1, points: 1 },
              { question: 'The "70% problem" of AI coding means…|||"Vấn đề 70%" của coding bằng AI nghĩa là…', options: ['AI is wrong 70% of the time|||AI sai 70% số lần', 'AI gets you ~70% there fast, but the final correct/secure 30% still needs a real engineer|||AI đưa bạn ~70% quãng đường nhanh, nhưng 30% cuối đúng/an toàn vẫn cần kỹ sư thật', 'you should write 70% yourself|||bạn nên tự viết 70%', 'it only works on 70% of languages|||chỉ chạy trên 70% ngôn ngữ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 — NÂNG CAO: DEVOPS & DOCKER ══════════════════ */
    {
      title: 'Chapter 9 (Advanced) — DevOps & Docker deployment|||Chương 9 (Nâng cao) — DevOps & triển khai Docker',
      description: 'Đóng gói ứng dụng bằng Docker, một pipeline CI/CD thật, và tư duy DevOps.',
      lessons: [
        {
          title: '9.1 — Containers, Docker & a real CI/CD pipeline|||9.1 — Container, Docker & pipeline CI/CD thật',
          slug: 'swp391-9-1-docker-devops',
          type: 'VIDEO',
          description: 'Dockerfile, docker-compose, và một pipeline build→test→deploy tự động.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1 · Advanced</span>
<h2>Ship it the way industry does — containers &amp; DevOps</h2>
<p class="lead">Chapter 6 got your app onto staging. This chapter shows the professional way to do it repeatably: package the app and its exact environment into a <strong>Docker container</strong>, and let a <strong>CI/CD pipeline</strong> build, test and deploy it automatically. This kills the "works on my machine" problem for good.</p>
<h3>Why containers</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Problem</div><div class="lz-t">"Works on mine"</div><div class="lz-d">Different Java/OS/config everywhere</div></div>
  <div class="lz-step"><div class="lz-k">Container</div><div class="lz-t">App + its whole environment</div><div class="lz-d">One image, identical everywhere</div></div>
  <div class="lz-step"><div class="lz-k">Result</div><div class="lz-t">Runs the same</div><div class="lz-d">Laptop = staging = prod</div></div>
</div>
<h3>A Dockerfile — the recipe for your image</h3>
<pre><span class="tok-comment"># Build a runnable image for a Spring Boot app</span>
<span class="tok-keyword">FROM</span> eclipse-temurin:21-jre
<span class="tok-keyword">WORKDIR</span> /app
<span class="tok-keyword">COPY</span> target/app.jar app.jar
<span class="tok-keyword">EXPOSE</span> 8080
<span class="tok-keyword">ENTRYPOINT</span> [<span class="tok-string">"java"</span>, <span class="tok-string">"-jar"</span>, <span class="tok-string">"app.jar"</span>]</pre>
<h3>docker-compose — the app + its database together</h3>
<pre><span class="tok-comment"># One command brings up the whole stack</span>
services:
  app:
    build: .
    ports: [<span class="tok-string">"8080:8080"</span>]
    environment:
      DB_URL: jdbc:mysql://db:3306/shop
    depends_on: [db]
  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: shop
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}   <span class="tok-comment"># from env, not committed</span></pre>
<div class="out"><b>Now onboarding is one line:</b> <code>docker compose up</code> starts the app <em>and</em> a matching database with sample data. A new teammate (or a reviewer) is running the full system in a minute — no "install MySQL, set these five things" ritual.</div>
<h3>A real CI/CD pipeline</h3>
<pre><span class="tok-comment"># On every push to main:</span>
build  -&gt; run tests  -&gt; build Docker image  -&gt; push to registry  -&gt; deploy to staging
   |         |                                                          |
 fails?    fails?  <span class="tok-comment"># a red pipeline blocks the merge — main stays deployable</span>   auto-live</pre>
<div class="pitfall">Don't bake secrets into the image (they live forever in its layers) and don't run the container as root in anything real. Pass secrets as runtime environment variables, and keep the image small (a JRE base, not a full JDK+OS). These are exactly the habits an interviewer probes after graduation.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The twelve-factor app.</b> A widely-cited checklist for cloud-ready software. The ones that matter most for SWP391: <em>config in the environment</em> (not code), <em>build/release/run as separate stages</em>, <em>stateless processes</em> (session state in the DB/cache, not in memory, so you can run two copies), and <em>dev/prod parity</em> (containers make staging match production). You won't implement all twelve in one course project, but naming two or three you followed — and why — is a standout moment in a final defense, and it is exactly the DevOps maturity industry hires for.</div>
<a class="link-card exphub" href="/exp-hub/docker?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker &amp; docker-compose — hands-on</span><span class="lc-sub">Dockerfile, images, compose and a CI pipeline — full guide on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1 · Nâng cao</span>
<h2>Ship theo cách ngành làm — container &amp; DevOps</h2>
<p class="lead">Chương 6 đưa app của bạn lên staging. Chương này chỉ cách chuyên nghiệp để làm điều đó lặp lại được: đóng gói app và môi trường chính xác của nó vào một <strong>container Docker</strong>, và để một <strong>pipeline CI/CD</strong> build, test và deploy tự động. Điều này diệt vấn đề "chạy trên máy tôi" vĩnh viễn.</p>
<h3>Vì sao dùng container</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Vấn đề</div><div class="lz-t">"Chạy trên máy tôi"</div><div class="lz-d">Java/OS/config khác nhau mọi nơi</div></div>
  <div class="lz-step"><div class="lz-k">Container</div><div class="lz-t">App + cả môi trường của nó</div><div class="lz-d">Một image, giống hệt mọi nơi</div></div>
  <div class="lz-step"><div class="lz-k">Kết quả</div><div class="lz-t">Chạy giống nhau</div><div class="lz-d">Laptop = staging = prod</div></div>
</div>
<h3>Một Dockerfile — công thức cho image của bạn</h3>
<pre><span class="tok-comment"># Build một image chạy được cho app Spring Boot</span>
<span class="tok-keyword">FROM</span> eclipse-temurin:21-jre
<span class="tok-keyword">WORKDIR</span> /app
<span class="tok-keyword">COPY</span> target/app.jar app.jar
<span class="tok-keyword">EXPOSE</span> 8080
<span class="tok-keyword">ENTRYPOINT</span> [<span class="tok-string">"java"</span>, <span class="tok-string">"-jar"</span>, <span class="tok-string">"app.jar"</span>]</pre>
<h3>docker-compose — app + CSDL của nó cùng nhau</h3>
<pre><span class="tok-comment"># Một lệnh dựng lên cả stack</span>
services:
  app:
    build: .
    ports: [<span class="tok-string">"8080:8080"</span>]
    environment:
      DB_URL: jdbc:mysql://db:3306/shop
    depends_on: [db]
  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: shop
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}   <span class="tok-comment"># từ env, không commit</span></pre>
<div class="out"><b>Giờ onboarding chỉ một dòng:</b> <code>docker compose up</code> khởi động app <em>và</em> một CSDL khớp với dữ liệu mẫu. Một đồng đội mới (hay người chấm) chạy cả hệ thống trong một phút — không nghi thức "cài MySQL, chỉnh năm thứ này".</div>
<h3>Một pipeline CI/CD thật</h3>
<pre><span class="tok-comment"># Mỗi lần push vào main:</span>
build  -&gt; chạy test  -&gt; build image Docker  -&gt; đẩy lên registry  -&gt; deploy lên staging
   |         |                                                          |
 hỏng?    hỏng?  <span class="tok-comment"># pipeline đỏ chặn merge — main luôn deploy được</span>   tự lên live</pre>
<div class="pitfall">Đừng nướng bí mật vào image (chúng sống mãi trong các layer) và đừng chạy container bằng root ở thứ gì thật. Truyền bí mật qua biến môi trường lúc chạy, và giữ image nhỏ (nền JRE, không phải cả JDK+OS). Đây đúng là những thói quen nhà tuyển dụng dò sau khi ra trường.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ứng dụng twelve-factor.</b> Một checklist được trích dẫn rộng cho phần mềm sẵn-sàng-đám-mây. Những điều quan trọng nhất cho SWP391: <em>cấu hình trong môi trường</em> (không phải code), <em>build/release/run là các giai đoạn tách biệt</em>, <em>tiến trình không trạng thái</em> (trạng thái session trong DB/cache, không trong bộ nhớ, để chạy hai bản), và <em>đồng nhất dev/prod</em> (container làm staging khớp production). Bạn sẽ không hiện thực cả mười hai trong một đồ án, nhưng nêu hai ba cái bạn theo — và vì sao — là khoảnh khắc nổi bật trong buổi bảo vệ, và đúng là sự trưởng thành DevOps mà ngành tuyển.</div>
<a class="link-card exphub" href="/exp-hub/docker?ref=%2Fcourses%2Fsoftware-development-project%2Flearn&reflabel=SWP391" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker &amp; docker-compose — thực hành</span><span class="lc-sub">Dockerfile, image, compose và một pipeline CI — hướng dẫn đầy đủ trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 9 — DevOps & Docker|||Quiz 9 — DevOps & Docker',
          slug: 'swp391-quiz-9',
          type: 'QUIZ',
          description: 'Kiểm tra container, Docker, CI/CD và tư duy DevOps.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A Docker container solves which problem?|||Container Docker giải quyết vấn đề nào?', options: ['slow algorithms|||thuật toán chậm', 'the "works on my machine" difference between environments|||khác biệt "chạy trên máy tôi" giữa các môi trường', 'writing SQL|||viết SQL', 'team communication|||giao tiếp nhóm'], correctIndex: 1, points: 1 },
              { question: 'A Dockerfile is…|||Một Dockerfile là…', options: ['a database backup|||bản sao lưu CSDL', 'the recipe describing how to build an image|||công thức mô tả cách build một image', 'a test report|||một báo cáo test', 'a Git branch|||một nhánh Git'], correctIndex: 1, points: 1 },
              { question: 'docker-compose is useful because it…|||docker-compose hữu ích vì nó…', options: ['deletes containers|||xóa container', 'brings up the app and its database together with one command|||dựng app và CSDL của nó cùng nhau bằng một lệnh', 'writes your tests|||viết test cho bạn', 'replaces Git|||thay Git'], correctIndex: 1, points: 1 },
              { question: 'In a CI/CD pipeline, a failing test should…|||Trong pipeline CI/CD, một test hỏng nên…', options: ['be ignored|||bị phớt lờ', 'block the merge/deploy so main stays deployable|||chặn merge/deploy để main luôn deploy được', 'delete the branch|||xóa nhánh', 'speed up the deploy|||tăng tốc deploy'], correctIndex: 1, points: 1 },
              { question: 'Secrets (passwords, keys) should be…|||Bí mật (mật khẩu, khóa) nên được…', options: ['baked into the Docker image|||nướng vào image Docker', 'passed as runtime environment variables, never committed|||truyền qua biến môi trường lúc chạy, không bao giờ commit', 'printed in the logs|||in ra log', 'hard-coded in the source|||hard-code trong mã nguồn'], correctIndex: 1, points: 1 },
              { question: 'A twelve-factor principle most relevant to this course is… (beyond-syllabus)|||Một nguyên tắc twelve-factor liên quan nhất môn này là… (ngoài giáo trình)', options: ['store config in the environment, not in code|||lưu cấu hình trong môi trường, không trong code', 'never use a database|||không bao giờ dùng CSDL', 'always run as root|||luôn chạy bằng root', 'avoid version control|||tránh quản lý phiên bản'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
  ],
};
