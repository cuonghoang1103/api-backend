/**
 * INT605 — E-learning Mini Platform (Kỳ 6 — Thực tập, project #5).
 * Full-stack trong MỘT app Next.js 14 (App Router): Route Handlers = API + React Server/Client Components = UI,
 * Prisma + PostgreSQL, Auth.js (roles), zod. Hai vai trò: STUDENT + INSTRUCTOR.
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản quay video)
 * → domain/DB design (Prisma schema, UNIQUE(attempt_id)) → App Router foundations & data fetching
 * → auth/roles → CHẤM ĐIỂM PHÍA SERVER (đáp án không tới client, mỗi lượt chấm đúng một lần)
 * → frontend (quiz UI + dashboard) → testing → deployment (Docker) → nâng cao (★ ngoài giáo trình).
 * Song ngữ EN/VN đối xứng. Code Next/TS/Prisma <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Deep-link CodeLab nextjs/react/prisma-orm/authentication; Git/Docker → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT605.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (template literal/JSX) = \${ ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT605',
    title: 'E-learning Mini Platform',
    slug: 'e-learning-mini-platform',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #5 — an e-learning mini platform in one Next.js 14 app: Route Handlers, Server Components, Prisma + PostgreSQL, Auth.js roles, and a server-side auto-grading core where the answer key never reaches the client and each attempt is graded exactly once.|||Đồ án thực tập #5 — nền e-learning mini trong một app Next.js 14: Route Handlers, Server Components, Prisma + PostgreSQL, phân quyền Auth.js, và lõi tự chấm phía server: đáp án không tới client, mỗi lượt chấm đúng một lần.',
    description: 'INT605 là đồ án thực tập full-stack "một app": bạn xây một NỀN HỌC TRỰC TUYẾN mini (E-learning Mini Platform) hoàn chỉnh chỉ bằng MỘT dự án Next.js 14 App Router — trong đó Route Handlers (app/api/.../route.ts) đóng vai API, còn React Server/Client Components đóng vai giao diện. Dữ liệu lưu trong PostgreSQL qua Prisma ORM. Hệ thống có hai vai trò: SINH VIÊN (ghi danh một khoá, làm một bài trắc nghiệm được chấm tự động, xem tiến độ) và GIẢNG VIÊN (tạo khoá + bài trắc nghiệm, xem kết quả). Xác thực bằng Auth.js (NextAuth) và phân quyền theo role. Trọng tâm kỹ thuật — viên ngọc của đồ án — là CHẤM ĐIỂM PHÍA SERVER CÓ TOÀN VẸN NỘP BÀI: đáp án và điểm được tính TRÊN SERVER, đáp án đúng KHÔNG BAO GIỜ gửi xuống client, và mỗi lượt làm bài chỉ ghi ĐÚNG MỘT bản chấm (UNIQUE(attempt_id) + một transaction). Sinh viên có sửa client cũng không đổi được điểm; nộp trùng bị từ chối. Cuối cùng đóng gói bằng Docker và viết kịch bản demo để quay video. Đây là khuôn "một app Next.js full-stack" mà rất nhiều sản phẩm web hiện đại đang dùng.',
    whatYouLearn: 'Thiết kế domain & schema Prisma cho nền học trực tuyến (User/Course/Enrollment/Quiz/Question/Attempt/Submission) với quan hệ và ràng buộc UNIQUE; kiến trúc Next.js 14 App Router full-stack — Route Handlers làm API, Server Components để fetch dữ liệu trực tiếp từ Prisma, Client Components cho tương tác; xác thực Auth.js (session + credentials) và phân quyền hai vai trò STUDENT/INSTRUCTOR; validate đầu vào bằng zod; LÕI CHẤM ĐIỂM PHÍA SERVER an toàn: giữ đáp án ở server (không select correctIndex xuống client), tính điểm trong một transaction, và bảo đảm mỗi attempt chỉ có một Submission bằng UNIQUE(attempt_id); chống nộp trùng và chống gian lận sửa client; bảng tiến độ (progress dashboard) tính bằng truy vấn tổng hợp; kiểm thử unit + integration + một test nộp-đồng-thời chứng minh chỉ một bản chấm được ghi; đóng gói Docker (Next.js standalone + Postgres) + biến môi trường; và một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học FER202 (React), WED201c (web cơ bản), DBI202 (CSDL/SQL) và PRJ301 (web/MVC). Cần: Node.js LTS (20.x trở lên), một IDE (VS Code khuyên dùng), Docker Desktop (để chạy PostgreSQL), Prisma CLI (cài qua npm), một trình duyệt hiện đại và một tài khoản GitHub cho nhóm.',
    documentsNote: 'Tham chiếu: Next.js Documentation (nextjs.org/docs — App Router, Route Handlers, Server Components) • Prisma Docs (prisma.io/docs) • Auth.js / NextAuth (authjs.dev) • zod (zod.dev) • PostgreSQL Documentation • React docs (react.dev). Công cụ: VS Code, Docker Desktop, Prisma CLI + Prisma Studio, một trình duyệt. Luyện code: track Code Lab Next.js + React + Prisma ORM + Authentication. Git & Docker: Exp Hub. Đây là project-course thực tập — vừa xây vừa quay video theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc "một app" Next.js full-stack, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int605-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một nền học trực tuyến mini thật, kiến trúc "một app" Next.js full-stack, và bản đồ vòng đời từ schema tới Docker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — an E-learning Mini Platform</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, deployable web application: an <strong>e-learning mini platform</strong> where an instructor creates a course and a quiz, a student enrols and takes the quiz, and the platform <strong>grades it on the server</strong> — the answer key never reaches the browser, and each attempt is scored <strong>exactly once</strong>. By the end you have a running full-stack app, tested and shipped in Docker, plus a recorded demo.</p>
<p>The twist that makes this modern: it is all <strong>one Next.js 14 app</strong>. There is no separate backend project — <strong>Route Handlers</strong> (<code>app/api/.../route.ts</code>) are your API, and <strong>React Server Components</strong> fetch data straight from the database on the server. Master this "one app, full-stack" shape and you can build most of today web products.</p>

<h3>The system in one picture — client / server / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Browser — Client Components</div><div class="lz-d">quiz UI · progress dashboard · React state</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Next.js server (App Router)</div><div class="lz-d">Route Handlers · Server Components · Auth.js · grading</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL via Prisma</div><div class="lz-d">users · courses · quizzes · attempts · submissions</div></div>
</div>
<div class="diagram">Browser  ──fetch / RSC──▶  Next.js 14 (App Router)  ──Prisma──▶  PostgreSQL
 Client Components          Route Handlers  (app/api)              (port 5432)
 (quiz, dashboard)          Server Components (fetch on server)
                            Auth.js session          UNIQUE(attempt_id)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; Prisma schema</div><div class="lz-nsub">Roles &amp; use cases · ERD · the UNIQUE(attempt_id) that grades each attempt once</div></div></div>
  <div class="lz-stage">App Router</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Full-stack in one app</div><div class="lz-nsub">Route Handlers as the API · Server Components fetching from Prisma</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (Auth.js)</div><div class="lz-nsub">Login · session · Student vs Instructor · ownership checks</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Server-side auto-grading</div><div class="lz-nsub">Answer key stays on the server · grade once · UNIQUE + transaction</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Quiz UI &amp; dashboard</div><div class="lz-nsub">Client Components · take a quiz · see progress</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">Unit · integration · a double-submit test that proves one graded row</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker: Next.js standalone + Postgres · env config · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Server Actions · timed attempts · shuffling · CI</div><div class="lz-nsub">Ship like a real engineering team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — login → enrol → take a quiz → see the score — then grow it. A tiny end-to-end flow that runs beats a huge design that never builds.</div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-374" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Practice Next.js on Code Lab</span><span class="lc-sub">Warm up the App Router, routing and layouts before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — Nền học trực tuyến mini</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một ứng dụng web thật, triển khai được: một <strong>nền học trực tuyến mini</strong>, nơi giảng viên tạo một khoá học và một bài trắc nghiệm, sinh viên ghi danh và làm bài, và nền tảng <strong>chấm điểm trên server</strong> — đáp án không bao giờ tới trình duyệt, và mỗi lượt làm được chấm <strong>đúng một lần</strong>. Kết thúc, bạn có một app full-stack chạy được, đã test và đóng gói Docker, kèm một video demo.</p>
<p>Điểm khiến nó hiện đại: tất cả nằm trong <strong>một app Next.js 14</strong>. Không có dự án backend riêng — <strong>Route Handlers</strong> (<code>app/api/.../route.ts</code>) chính là API của bạn, và <strong>React Server Components</strong> fetch dữ liệu thẳng từ CSDL ngay trên server. Làm chủ khuôn "một app, full-stack" này thì bạn dựng được phần lớn sản phẩm web ngày nay.</p>

<h3>Hệ thống trong một bức tranh — client / server / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Trình duyệt — Client Components</div><div class="lz-d">UI trắc nghiệm · bảng tiến độ · state React</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Server Next.js (App Router)</div><div class="lz-d">Route Handlers · Server Components · Auth.js · chấm điểm</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL qua Prisma</div><div class="lz-d">users · courses · quizzes · attempts · submissions</div></div>
</div>
<div class="diagram">Trình duyệt ──fetch / RSC──▶  Next.js 14 (App Router)  ──Prisma──▶  PostgreSQL
 Client Components            Route Handlers  (app/api)              (cổng 5432)
 (quiz, dashboard)            Server Components (fetch trên server)
                              Auth.js session          UNIQUE(attempt_id)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; schema Prisma</div><div class="lz-nsub">Vai trò &amp; use case · ERD · ràng buộc UNIQUE(attempt_id) chấm mỗi lượt một lần</div></div></div>
  <div class="lz-stage">App Router</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Full-stack trong một app</div><div class="lz-nsub">Route Handlers làm API · Server Components fetch từ Prisma</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (Auth.js)</div><div class="lz-nsub">Đăng nhập · session · Sinh viên vs Giảng viên · kiểm quyền sở hữu</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chấm điểm phía server</div><div class="lz-nsub">Đáp án ở lại server · chấm một lần · UNIQUE + transaction</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">UI trắc nghiệm &amp; bảng tiến độ</div><div class="lz-nsub">Client Components · làm bài · xem tiến độ</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">Unit · integration · một test nộp-đồng-thời chứng minh chỉ một bản chấm</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker: Next.js standalone + Postgres · cấu hình env · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Server Actions · làm bài có giờ · trộn câu · CI</div><div class="lz-nsub">Ship như một đội kỹ sư thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — đăng nhập → ghi danh → làm một bài → thấy điểm — rồi mới mở rộng. Một luồng nhỏ chạy được từ đầu đến cuối hơn hẳn một bản thiết kế đồ sộ không bao giờ build được.</div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-374" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Luyện Next.js trên Code Lab</span><span class="lc-sub">Khởi động App Router, routing và layout trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int605-pham-vi',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Đúng phạm vi để làm xong: 2 vai trò, luồng lõi, và bảng tiêu chí nghiệm thu bạn tự chấm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Scope, roles &amp; acceptance criteria</h2>
<p class="lead">The fastest way to fail an internship project is to build too much and finish nothing. Lock the scope now: <strong>two roles, one server-graded quiz core, a handful of screens</strong>. Everything else is optional polish.</p>

<h3>Two roles — that is enough for real access control</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">STUDENT</span><span class="v">Register/login · browse courses · enrol in one · take a quiz · see the score &amp; personal progress</span></div>
  <div class="kv"><span class="k">INSTRUCTOR</span><span class="v">Login · create a course · add a quiz with questions &amp; the answer key · view students results</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">STUDENT starts an attempt ──▶ answers on the client ──▶ POST /api/attempts/:id/submit
        │                                                            │
        │  the browser NEVER received correctIndex                   ▼
        │                                          server grades from its own answer key
        ▼                                          writes ONE Submission (UNIQUE attempt_id)
duplicate submit / tampered answers ──▶ 409 or unchanged score  (rejected)</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A student can register, log in, and get a session</td><td>login then a protected page loads with the user</td></tr>
<tr><td>2</td><td>A student can enrol in a course exactly once</td><td>enrol twice → second is a no-op, not a duplicate row</td></tr>
<tr><td>3</td><td>The quiz page never ships the correct answers to the browser</td><td>view page source / network → no <code>correctIndex</code> anywhere</td></tr>
<tr><td>4</td><td><b>The grade is computed on the server</b></td><td>edit the answers in DevTools → score is still correct</td></tr>
<tr><td>5</td><td><b>Each attempt is graded exactly once</b></td><td>submit the same attempt twice → one Submission row</td></tr>
<tr><td>6</td><td>Only an INSTRUCTOR can create a course/quiz</td><td>a STUDENT calling the create endpoint → 403</td></tr>
<tr><td>7</td><td>The whole system runs from one <code>docker compose up</code></td><td>app on :3000, db healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> Video lectures with real streaming, payments, a discussion forum, certificates as a core feature, an AI tutor. A quiz with server-side grading is plenty of depth. Breadth with nothing finished does not score.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 6). Rows 3, 4 and 5 are the security-critical ones — turning "the client cannot cheat" into an executable test is exactly what a reviewer wants to see. <em>Why beyond syllabus: turning a checklist into executable specs is how professional teams gate a release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một lõi trắc nghiệm chấm-trên-server, vài màn hình</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SINH VIÊN</span><span class="v">Đăng ký/đăng nhập · xem khoá học · ghi danh một khoá · làm trắc nghiệm · xem điểm &amp; tiến độ cá nhân</span></div>
  <div class="kv"><span class="k">GIẢNG VIÊN</span><span class="v">Đăng nhập · tạo khoá học · thêm bài trắc nghiệm với câu hỏi &amp; đáp án · xem kết quả của sinh viên</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">SINH VIÊN bắt đầu một lượt ──▶ trả lời trên client ──▶ POST /api/attempts/:id/submit
        │                                                          │
        │  trình duyệt KHÔNG hề nhận correctIndex                  ▼
        │                                        server chấm bằng đáp án riêng của nó
        ▼                                        ghi MỘT Submission (UNIQUE attempt_id)
nộp trùng / sửa đáp án ──▶ 409 hoặc điểm không đổi  (bị từ chối)</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Sinh viên đăng ký, đăng nhập, có session</td><td>đăng nhập rồi mở một trang được bảo vệ, thấy user</td></tr>
<tr><td>2</td><td>Sinh viên ghi danh một khoá đúng một lần</td><td>ghi danh hai lần → lần hai không tạo dòng trùng</td></tr>
<tr><td>3</td><td>Trang trắc nghiệm không bao giờ gửi đáp án đúng xuống trình duyệt</td><td>xem source / network → không có <code>correctIndex</code> ở đâu cả</td></tr>
<tr><td>4</td><td><b>Điểm được tính trên server</b></td><td>sửa đáp án trong DevTools → điểm vẫn đúng</td></tr>
<tr><td>5</td><td><b>Mỗi lượt được chấm đúng một lần</b></td><td>nộp cùng một attempt hai lần → chỉ một dòng Submission</td></tr>
<tr><td>6</td><td>Chỉ GIẢNG VIÊN được tạo khoá/bài</td><td>SINH VIÊN gọi endpoint tạo → 403</td></tr>
<tr><td>7</td><td>Cả hệ chạy từ một lệnh <code>docker compose up</code></td><td>app ở :3000, db healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Bài giảng video streaming thật, thanh toán, diễn đàn thảo luận, chứng chỉ làm tính năng lõi, gia sư AI. Một bài trắc nghiệm chấm-trên-server đã đủ sâu. Ôm rộng mà chẳng xong thì không ăn điểm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 6). Dòng 3, 4 và 5 là các dòng an toàn-cốt-tử — biến "client không thể gian lận" thành một test chạy được chính là thứ giám khảo muốn thấy. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int605-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Next.js 14 + Prisma + PostgreSQL + Auth.js — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Every choice below is picked because it is <strong>what you already learned</strong> (FER202 React, WED201c web, DBI202 databases) and because "one Next.js app, full-stack" is a mainstream way products are built today.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Framework — Next.js 14 (App Router)</b><br/>One project that renders UI <em>and</em> serves the API. Server Components fetch data on the server; Route Handlers expose JSON endpoints. <em>Why: no separate backend to wire up, one language (TypeScript) end-to-end, first-class deployment.</em></div>
  <div class="lz-layer"><b>UI — React 18 Server &amp; Client Components</b><br/>Server Components for data pages (no client JS), Client Components (<code>"use client"</code>) for the interactive quiz. <em>Why: FER202 taught React; the server/client split is the modern default.</em></div>
  <div class="lz-layer"><b>ORM — Prisma</b><br/>Type-safe database access from schema to queries. <em>Why: one schema file generates a fully typed client; migrations are tracked; less SQL boilerplate than raw DAO, same SQL underneath.</em></div>
  <div class="lz-layer"><b>Database — PostgreSQL 16</b><br/>A real, free, ACID relational database. <em>Why: the UNIQUE(attempt_id) constraint + a transaction are what make "graded exactly once" true; Postgres is the industry default.</em></div>
  <div class="lz-layer"><b>Auth — Auth.js (NextAuth)</b><br/>Session-based auth that plugs into the App Router. <em>Why: battle-tested, handles the cookie/session plumbing so you focus on roles, not crypto.</em></div>
  <div class="lz-layer"><b>Validation — zod</b><br/>Parse and validate every request body at the boundary. <em>Why: never trust client input; zod turns untyped JSON into a typed, checked object.</em></div>
  <div class="lz-layer"><b>Ship — Docker</b><br/>The app + Postgres started by one command. <em>Why: "runs on my machine" becomes "runs anywhere"; graders love a one-command demo.</em></div>
</div>

<h3>The request journey — how a submit becomes a graded row</h3>
<div class="diagram">Click "Submit"  →  fetch POST /api/attempts/42/submit  (session cookie sent)
   →  Route Handler reads the Auth.js session (who are you?)
   →  zod parses the answers array
   →  gradeAttempt() runs inside prisma.$transaction
   →  loads the questions WITH correctIndex (server-only)
   →  computes score; INSERT submission (attempt_id UNIQUE)
   →  PostgreSQL commits (or P2002 if a duplicate submit races)
   →  201 Created  →  React shows "You scored 8/10"</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The server/client boundary is a security boundary, not just a rendering choice.</b> Because a Server Component runs only on the server, the data it does <em>not</em> pass to a Client Component simply never leaves the machine. That is why the answer key can live in a Server Component query and never reach the browser — the boundary itself protects it. <em>Why beyond syllabus: most courses frame RSC as a performance feature; using it as a trust boundary is deeper engineering.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-367" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Brush up React on Code Lab</span><span class="lc-sub">Components and rendering — the UI half of this project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì đó là <strong>thứ bạn đã học</strong> (FER202 React, WED201c web, DBI202 CSDL) và vì "một app Next.js, full-stack" là cách chủ đạo mà sản phẩm được xây ngày nay.</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Framework — Next.js 14 (App Router)</b><br/>Một dự án vừa render UI <em>vừa</em> phục vụ API. Server Components fetch dữ liệu trên server; Route Handlers phơi endpoint JSON. <em>Vì sao: không phải dựng backend riêng, một ngôn ngữ (TypeScript) từ đầu tới cuối, deploy hạng nhất.</em></div>
  <div class="lz-layer"><b>UI — React 18 Server &amp; Client Components</b><br/>Server Components cho trang dữ liệu (không JS client), Client Components (<code>"use client"</code>) cho trắc nghiệm tương tác. <em>Vì sao: FER202 đã dạy React; tách server/client là mặc định hiện đại.</em></div>
  <div class="lz-layer"><b>ORM — Prisma</b><br/>Truy cập CSDL an toàn kiểu từ schema tới truy vấn. <em>Vì sao: một file schema sinh ra client được gõ kiểu đầy đủ; migration được theo dõi; ít boilerplate hơn DAO thô, SQL bên dưới vẫn thế.</em></div>
  <div class="lz-layer"><b>CSDL — PostgreSQL 16</b><br/>Một CSDL quan hệ thật, miễn phí, ACID. <em>Vì sao: ràng buộc UNIQUE(attempt_id) + một transaction chính là thứ khiến "chấm đúng một lần" thành sự thật; Postgres là mặc định của ngành.</em></div>
  <div class="lz-layer"><b>Auth — Auth.js (NextAuth)</b><br/>Xác thực theo session cắm thẳng vào App Router. <em>Vì sao: đã được kiểm chứng, lo phần cookie/session để bạn tập trung vào vai trò, không phải mật mã.</em></div>
  <div class="lz-layer"><b>Validation — zod</b><br/>Parse và kiểm mọi body request ngay ở biên. <em>Vì sao: không bao giờ tin đầu vào từ client; zod biến JSON không kiểu thành một đối tượng có kiểu, đã kiểm.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker</b><br/>App + Postgres khởi động bằng một lệnh. <em>Vì sao: "chạy trên máy tôi" thành "chạy ở mọi nơi"; giám khảo thích demo một lệnh.</em></div>
</div>

<h3>Hành trình một request — một cú nộp thành một dòng đã chấm</h3>
<div class="diagram">Bấm "Nộp bài"  →  fetch POST /api/attempts/42/submit  (gửi cookie session)
   →  Route Handler đọc session Auth.js (bạn là ai?)
   →  zod parse mảng câu trả lời
   →  gradeAttempt() chạy trong prisma.$transaction
   →  nạp câu hỏi KÈM correctIndex (chỉ ở server)
   →  tính điểm; INSERT submission (attempt_id UNIQUE)
   →  PostgreSQL commit (hoặc P2002 nếu một cú nộp trùng chạy đua)
   →  201 Created  →  React hiện "Bạn được 8/10"</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ranh giới server/client là ranh giới bảo mật, không chỉ là lựa chọn render.</b> Vì một Server Component chỉ chạy trên server, dữ liệu mà nó <em>không</em> truyền xuống Client Component đơn giản là không bao giờ rời khỏi máy. Đó là lý do đáp án có thể nằm trong truy vấn của một Server Component mà không bao giờ tới trình duyệt — chính ranh giới đó bảo vệ nó. <em>Vì sao ngoài syllabus: đa số khoá học coi RSC là tính năng hiệu năng; dùng nó làm ranh giới tin cậy là kỹ nghệ sâu hơn.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-367" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Ôn React trên Code Lab</span><span class="lc-sub">Component và render — nửa giao diện của đồ án này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int605-cai-dat',
          type: 'VIDEO',
          description: 'Node.js LTS, VS Code, Docker (Postgres), Prisma CLI, trình duyệt — cài một lần, dùng cả đồ án. Hướng dẫn chi tiết ở Exp Hub.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your environment</h2>
<p class="lead">Install everything once, before you write a line of code. Verify each tool from the terminal so you never lose an afternoon to a missing Node version.</p>

<h3>The checklist</h3>
<table>
<thead><tr><th>Tool</th><th>Why</th><th>Verify command</th></tr></thead>
<tbody>
<tr><td>Node.js LTS (20.x+)</td><td>run &amp; build Next.js</td><td><code>node -v</code> → 20.x+</td></tr>
<tr><td>VS Code</td><td>the editor (TS + Prisma extensions)</td><td>opens the project folder</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + one-command ship</td><td><code>docker --version</code></td></tr>
<tr><td>Prisma CLI</td><td>schema, migrate, Prisma Studio</td><td><code>npx prisma -v</code></td></tr>
<tr><td>A modern browser</td><td>DevTools to inspect the network</td><td>open localhost:3000</td></tr>
<tr><td>Git + a GitHub repo</td><td>team workflow</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Fastest Postgres:</strong> do not install it — run it in Docker. <code>docker run --name elearn-db -e POSTGRES_PASSWORD=elearn -e POSTGRES_DB=elearn -p 5432:5432 -d postgres:16</code>. One command, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int605-cai-dat-moi-truong?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">Node.js, VS Code, Docker Desktop, Prisma CLI — official links and a verify checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> an old Node version. Next.js 14 needs Node 18.17+ (use the current LTS, 20.x). If <code>node -v</code> shows 16 or lower, install the LTS via nvm or the official installer — otherwise <code>next dev</code> fails with a cryptic engine error.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt môi trường</h2>
<p class="lead">Cài hết một lần, trước khi viết một dòng code. Kiểm từng công cụ từ terminal để không mất cả buổi chiều vì thiếu phiên bản Node.</p>

<h3>Danh sách cần cài</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Lệnh kiểm</th></tr></thead>
<tbody>
<tr><td>Node.js LTS (20.x+)</td><td>chạy &amp; build Next.js</td><td><code>node -v</code> → 20.x+</td></tr>
<tr><td>VS Code</td><td>trình soạn (extension TS + Prisma)</td><td>mở được thư mục dự án</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + ship một lệnh</td><td><code>docker --version</code></td></tr>
<tr><td>Prisma CLI</td><td>schema, migrate, Prisma Studio</td><td><code>npx prisma -v</code></td></tr>
<tr><td>Một trình duyệt hiện đại</td><td>DevTools để soi network</td><td>mở localhost:3000</td></tr>
<tr><td>Git + một repo GitHub</td><td>quy trình nhóm</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Postgres nhanh nhất:</strong> đừng cài — chạy trong Docker. <code>docker run --name elearn-db -e POSTGRES_PASSWORD=elearn -e POSTGRES_DB=elearn -p 5432:5432 -d postgres:16</code>. Một lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int605-cai-dat-moi-truong?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">Node.js, VS Code, Docker Desktop, Prisma CLI — link chính chủ và checklist kiểm trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> phiên bản Node cũ. Next.js 14 cần Node 18.17+ (dùng bản LTS hiện tại, 20.x). Nếu <code>node -v</code> hiện 16 hoặc thấp hơn, cài LTS qua nvm hoặc bộ cài chính chủ — nếu không <code>next dev</code> sẽ lỗi engine khó hiểu.</div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int605-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng lõi, "khoảnh khắc client không gian lận được", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the one thing that is hard: <strong>a student tampering with the client cannot change their grade, shown live, on camera</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is an e-learning platform. It grades quizzes on the server, so the browser never sees the answers and cannot cheat. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Instructor flow (1.5m)</div><div class="lz-nsub">Log in as instructor → create a course → add a quiz with 3 questions and mark the correct answers → publish.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:00 — Student flow (2m)</div><div class="lz-nsub">Log in as student → enrol → take the quiz → submit → see "You scored 2/3". Open the personal progress dashboard.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — The money shot (1.5m)</div><div class="lz-nsub">Open DevTools → show the network response has NO correctIndex → edit the answers payload to all-correct → submit → the score is STILL the true score. Then submit the same attempt twice → the second returns the same result, one row in the DB.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Under the hood (1.5m)</div><div class="lz-nsub">One command: <code>docker compose up</code>. Show the Prisma schema, the <code>attemptId String @unique</code>, and the grading transaction. Explain in one sentence why the client cannot cheat.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Close (30s)</div><div class="lz-nsub">"Stack: Next.js 14, Prisma, PostgreSQL, Auth.js, Docker. Repo link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (never demo on an empty DB). Increase your editor/browser font size. Do one dry run. Record in 1080p. Keep mouse movements slow. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The demo is a product, not an afterthought.</b> Interviewers watch the first 60 seconds and the "hard part". Lead with the architecture and end with the tamper-proof grading proof — that ordering signals engineering maturity far more than a tour of every CRUD screen. <em>Why beyond syllabus: communication of your work is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD and a Prisma schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng thứ khó: <strong>một sinh viên sửa client cũng không đổi được điểm, chiếu ngay trên video</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là nền học trực tuyến. Nó chấm trắc nghiệm trên server, nên trình duyệt không bao giờ thấy đáp án và không thể gian lận. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng giảng viên (1.5m)</div><div class="lz-nsub">Đăng nhập giảng viên → tạo một khoá → thêm một bài trắc nghiệm 3 câu và đánh dấu đáp án đúng → xuất bản.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:00 — Luồng sinh viên (2m)</div><div class="lz-nsub">Đăng nhập sinh viên → ghi danh → làm bài → nộp → thấy "Bạn được 2/3". Mở bảng tiến độ cá nhân.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Cảnh đắt giá (1.5m)</div><div class="lz-nsub">Mở DevTools → cho thấy phản hồi network KHÔNG có correctIndex → sửa payload đáp án thành đúng-tất-cả → nộp → điểm VẪN là điểm thật. Rồi nộp cùng một attempt hai lần → lần hai trả cùng kết quả, một dòng trong DB.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Bên trong (1.5m)</div><div class="lz-nsub">Một lệnh: <code>docker compose up</code>. Chiếu schema Prisma, dòng <code>attemptId String @unique</code>, và transaction chấm điểm. Giải thích một câu vì sao client không thể gian lận.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Kết (30s)</div><div class="lz-nsub">"Stack: Next.js 14, Prisma, PostgreSQL, Auth.js, Docker. Link repo trên màn hình. Cảm ơn." Chạy URL GitHub.</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed dữ liệu demo trước (đừng bao giờ demo trên DB rỗng). Tăng cỡ chữ editor/trình duyệt. Quay thử một lần. Quay 1080p. Di chuột chậm. Nếu hỏng, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Demo là một sản phẩm, không phải thứ làm cho có.</b> Nhà tuyển dụng xem 60 giây đầu và "phần khó". Mở bằng kiến trúc và kết bằng bằng chứng chấm điểm chống-gian-lận — thứ tự đó thể hiện sự trưởng thành kỹ thuật hơn nhiều so với đi tua từng màn CRUD. <em>Vì sao ngoài syllabus: khả năng trình bày công việc bị chấm ngầm ở khắp sự nghiệp, nhưng hiếm khi được dạy rõ.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến hai vai trò thành ERD và schema Prisma.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design|||Mục 1 — Thiết kế domain & CSDL',
      description: 'Biến hai vai trò thành use case, ERD và một schema Prisma chuẩn hoá — với ràng buộc UNIQUE(attempt_id) là trái tim của "chấm đúng một lần".',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int605-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, Course, Enrollment, Quiz, Question, Attempt, Submission và quan hệ giữa chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"An <b>instructor</b> creates a <b>course</b> with a <b>quiz</b> of <b>questions</b>; a <b>student</b> <b>enrols</b>, makes an <b>attempt</b>, and gets one graded <b>submission</b>." The nouns give us seven entities:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (STUDENT or INSTRUCTOR), email, password hash. Both roles are Users; role decides permissions.</div>
  <div class="lz-layer"><b>Course</b> — a title + description, owned by one instructor. A course <em>has many</em> quizzes and enrollments.</div>
  <div class="lz-layer"><b>Enrollment</b> — the link that a student joined a course. One student enrols in one course at most once (UNIQUE(course, student)).</div>
  <div class="lz-layer"><b>Quiz</b> — a titled set of questions belonging to a course.</div>
  <div class="lz-layer"><b>Question</b> — a prompt, its options, and <code>correctIndex</code> — the answer key that must <em>never</em> leave the server.</div>
  <div class="lz-layer"><b>Attempt</b> — a student starting a quiz. This is the thing that must be graded exactly once.</div>
  <div class="lz-layer"><b>Submission</b> — the graded result of an attempt: <code>score</code> and <code>total</code>. Exactly one per attempt.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────┐1     *┌──────────┐1     *┌──────────┐1     *┌──────────┐
│   User   │───────│  Course  │───────│   Quiz   │───────│ Question │
│(INSTRUCT)│       └──────────┘       └──────────┘       └──────────┘
└──────────┘             │1                  │1
                         │*                   │*
                   ┌──────────┐         ┌──────────┐1     1┌────────────┐
                   │Enrollment│         │ Attempt  │───────│ Submission │
                   └──────────┘         └──────────┘       └────────────┘
                         *│                   *│
                          │1                   │1
                     ┌──────────┐         ┌──────────┐
                     │   User   │         │   User   │ (role = STUDENT)
                     └──────────┘         └──────────┘

Course  1—* Quiz         : a course has many quizzes
Quiz    1—* Question     : a quiz has many questions (each with a hidden answer)
Attempt 1—1 Submission   : an attempt is graded AT MOST ONCE  ← the rule
User    1—* Attempt      : a student has many attempts</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> Instructor Lan makes a 3-question quiz. Student An takes it.
<b>Step 1 —</b> An enrols → one Enrollment row (course=Lan-course, student=An).
<b>Step 2 —</b> An starts the quiz → one Attempt row (quiz, student=An, startedAt=now).
<b>Step 3 —</b> An answers and submits → the server grades and writes ONE Submission (attempt=An-attempt, score=2, total=3).
<b>Step 4 —</b> An accidentally clicks submit again → NO second Submission — the attempt already has one.
<b>Result:</b> the 1—1 between Attempt and Submission is what makes "graded exactly once" true.</div>

<div class="pitfall"><strong>Design trap:</strong> putting <code>score</code> directly on <code>Attempt</code> and skipping the Submission table. It seems simpler, but then you cannot express "started but not yet graded", you lose the submit timestamp, and you have no natural place to hang the UNIQUE that blocks a double-submit. Keep the graded result as its own entity.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Store the answer key on Question, never on the client model.</b> <code>correctIndex</code> lives on the server-side Question row and is deliberately excluded from every query that feeds the browser. Modelling "which fields are safe to expose" as a first-class decision — not an afterthought — is how you design an API that cannot leak. In 4.1 you will see the <code>select</code> that omits it. <em>Why beyond syllabus: treating field-level exposure as part of the data model is a security-design skill most juniors miss.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-430" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Practice Prisma schema on Code Lab</span><span class="lc-sub">Models, fields and the generated client — the schema under your app.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>giảng viên</b> tạo một <b>khoá học</b> với một <b>bài trắc nghiệm</b> gồm các <b>câu hỏi</b>; một <b>sinh viên</b> <b>ghi danh</b>, thực hiện một <b>lượt làm</b>, và nhận một <b>bản chấm</b>." Các danh từ cho ta bảy thực thể:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (STUDENT hoặc INSTRUCTOR), email, hash mật khẩu. Cả hai vai trò đều là User; role quyết định quyền.</div>
  <div class="lz-layer"><b>Course</b> — tiêu đề + mô tả, thuộc về một giảng viên. Một khoá <em>có nhiều</em> bài trắc nghiệm và lượt ghi danh.</div>
  <div class="lz-layer"><b>Enrollment</b> — liên kết một sinh viên đã tham gia một khoá. Một sinh viên ghi danh một khoá tối đa một lần (UNIQUE(course, student)).</div>
  <div class="lz-layer"><b>Quiz</b> — một tập câu hỏi có tiêu đề, thuộc một khoá.</div>
  <div class="lz-layer"><b>Question</b> — đề bài, các phương án, và <code>correctIndex</code> — đáp án <em>không bao giờ</em> được rời server.</div>
  <div class="lz-layer"><b>Attempt</b> — một sinh viên bắt đầu một bài. Đây là thứ phải được chấm đúng một lần.</div>
  <div class="lz-layer"><b>Submission</b> — kết quả đã chấm của một attempt: <code>score</code> và <code>total</code>. Đúng một cái mỗi attempt.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────┐1     *┌──────────┐1     *┌──────────┐1     *┌──────────┐
│   User   │───────│  Course  │───────│   Quiz   │───────│ Question │
│(GIẢNG V.)│       └──────────┘       └──────────┘       └──────────┘
└──────────┘             │1                  │1
                         │*                   │*
                   ┌──────────┐         ┌──────────┐1     1┌────────────┐
                   │Enrollment│         │ Attempt  │───────│ Submission │
                   └──────────┘         └──────────┘       └────────────┘
                         *│                   *│
                          │1                   │1
                     ┌──────────┐         ┌──────────┐
                     │   User   │         │   User   │ (role = STUDENT)
                     └──────────┘         └──────────┘

Course  1—* Quiz         : một khoá có nhiều bài trắc nghiệm
Quiz    1—* Question     : một bài có nhiều câu (mỗi câu có đáp án ẩn)
Attempt 1—1 Submission   : một lượt làm được chấm TỐI ĐA MỘT LẦN  ← quy tắc
User    1—* Attempt      : một sinh viên có nhiều lượt làm</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> Giảng viên Lan tạo một bài 3 câu. Sinh viên An làm bài.
<b>Bước 1 —</b> An ghi danh → một dòng Enrollment (course=khoá-Lan, student=An).
<b>Bước 2 —</b> An bắt đầu bài → một dòng Attempt (quiz, student=An, startedAt=now).
<b>Bước 3 —</b> An trả lời và nộp → server chấm và ghi MỘT Submission (attempt=attempt-của-An, score=2, total=3).
<b>Bước 4 —</b> An lỡ bấm nộp lần nữa → KHÔNG có Submission thứ hai — attempt đã có một cái rồi.
<b>Kết quả:</b> quan hệ 1—1 giữa Attempt và Submission chính là thứ khiến "chấm đúng một lần" thành sự thật.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> đặt thẳng <code>score</code> lên <code>Attempt</code> và bỏ bảng Submission. Trông đơn giản hơn, nhưng khi đó bạn không diễn tả được "đã bắt đầu nhưng chưa chấm", mất thời điểm nộp, và không có chỗ tự nhiên để gắn UNIQUE chặn nộp trùng. Hãy giữ kết quả đã chấm là một thực thể riêng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lưu đáp án trên Question, không bao giờ trên mô hình phía client.</b> <code>correctIndex</code> nằm trên dòng Question phía server và được cố tình loại khỏi mọi truy vấn nuôi trình duyệt. Mô hình hoá "trường nào an toàn để phơi" như một quyết định hạng nhất — không phải nghĩ sau — chính là cách bạn thiết kế một API không thể lộ. Ở 4.1 bạn sẽ thấy câu <code>select</code> loại bỏ nó. <em>Vì sao ngoài syllabus: coi mức phơi bày từng trường là một phần của mô hình dữ liệu là kỹ năng thiết kế bảo mật đa số junior bỏ sót.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-430" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Luyện schema Prisma trên Code Lab</span><span class="lc-sub">Model, trường và client sinh ra — phần schema nằm dưới app của bạn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The Prisma schema & the constraint that grades once|||1.2 — Schema Prisma & ràng buộc chấm một lần',
          slug: 'int605-schema',
          type: 'VIDEO',
          description: 'schema.prisma đầy đủ + @unique trên attemptId: hàng rào cuối cùng bảo đảm mỗi attempt chỉ có một bản chấm, do CSDL bảo đảm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The Prisma schema &amp; the constraint that grades once</h2>
<p class="lead">Here is the whole database as one <code>schema.prisma</code>. Notice two lines — <code>correctIndex Int</code> on Question (the answer key), and <code>attemptId String @unique</code> on Submission. That single UNIQUE is your <strong>last line of defence</strong>: even if two submit requests slip past every check in your TypeScript, the database itself refuses to write two graded rows for one attempt.</p>

<h3>schema.prisma</h3>
<pre><span class="tok-keyword">enum</span> <span class="tok-type">Role</span> { STUDENT INSTRUCTOR }

<span class="tok-keyword">model</span> <span class="tok-type">User</span> {
  id          <span class="tok-type">String</span>       <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  email       <span class="tok-type">String</span>       <span class="tok-keyword">@unique</span>
  password    <span class="tok-type">String</span>                            <span class="tok-comment">// bcrypt hash</span>
  name        <span class="tok-type">String</span>
  role        <span class="tok-type">Role</span>         <span class="tok-keyword">@default</span>(STUDENT)
  courses     <span class="tok-type">Course</span>[]     <span class="tok-keyword">@relation</span>(<span class="tok-string">"Instructor"</span>)  <span class="tok-comment">// courses I teach</span>
  enrollments <span class="tok-type">Enrollment</span>[]
  attempts    <span class="tok-type">Attempt</span>[]
}

<span class="tok-keyword">model</span> <span class="tok-type">Course</span> {
  id           <span class="tok-type">String</span>       <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  title        <span class="tok-type">String</span>
  description  <span class="tok-type">String</span>
  instructor   <span class="tok-type">User</span>         <span class="tok-keyword">@relation</span>(<span class="tok-string">"Instructor"</span>, fields: [instructorId], references: [id])
  instructorId <span class="tok-type">String</span>
  quizzes      <span class="tok-type">Quiz</span>[]
  enrollments  <span class="tok-type">Enrollment</span>[]
}

<span class="tok-keyword">model</span> <span class="tok-type">Enrollment</span> {
  id        <span class="tok-type">String</span>   <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  course    <span class="tok-type">Course</span>   <span class="tok-keyword">@relation</span>(fields: [courseId], references: [id])
  courseId  <span class="tok-type">String</span>
  student   <span class="tok-type">User</span>     <span class="tok-keyword">@relation</span>(fields: [studentId], references: [id])
  studentId <span class="tok-type">String</span>
  createdAt <span class="tok-type">DateTime</span> <span class="tok-keyword">@default</span>(now())
  <span class="tok-keyword">@@unique</span>([courseId, studentId])         <span class="tok-comment">// enrol once per course</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Quiz</span> {
  id        <span class="tok-type">String</span>     <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  course    <span class="tok-type">Course</span>     <span class="tok-keyword">@relation</span>(fields: [courseId], references: [id])
  courseId  <span class="tok-type">String</span>
  title     <span class="tok-type">String</span>
  questions <span class="tok-type">Question</span>[]
  attempts  <span class="tok-type">Attempt</span>[]
}

<span class="tok-keyword">model</span> <span class="tok-type">Question</span> {
  id           <span class="tok-type">String</span> <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  quiz         <span class="tok-type">Quiz</span>   <span class="tok-keyword">@relation</span>(fields: [quizId], references: [id])
  quizId       <span class="tok-type">String</span>
  text         <span class="tok-type">String</span>
  options      <span class="tok-type">Json</span>                            <span class="tok-comment">// ["A","B","C","D"]</span>
  correctIndex <span class="tok-type">Int</span>                             <span class="tok-comment">// ★ SERVER-ONLY — never selected to the client</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Attempt</span> {
  id         <span class="tok-type">String</span>      <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  quiz       <span class="tok-type">Quiz</span>        <span class="tok-keyword">@relation</span>(fields: [quizId], references: [id])
  quizId     <span class="tok-type">String</span>
  student    <span class="tok-type">User</span>        <span class="tok-keyword">@relation</span>(fields: [studentId], references: [id])
  studentId  <span class="tok-type">String</span>
  startedAt  <span class="tok-type">DateTime</span>    <span class="tok-keyword">@default</span>(now())
  submission <span class="tok-type">Submission</span>?                     <span class="tok-comment">// 0 or 1 — graded at most once</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Submission</span> {
  id          <span class="tok-type">String</span>   <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  attempt     <span class="tok-type">Attempt</span>  <span class="tok-keyword">@relation</span>(fields: [attemptId], references: [id])
  attemptId   <span class="tok-type">String</span>   <span class="tok-keyword">@unique</span>                 <span class="tok-comment">// ★ ONE graded submission per attempt</span>
  score       <span class="tok-type">Int</span>
  total       <span class="tok-type">Int</span>
  submittedAt <span class="tok-type">DateTime</span> <span class="tok-keyword">@default</span>(now())
}</pre>

<h3>The migration &amp; the SQL it generates</h3>
<p>Run <code>npx prisma migrate dev --name init</code>. Prisma turns <code>attemptId String @unique</code> into a real SQL unique index:</p>
<pre><span class="tok-comment">-- from the generated migration.sql</span>
<span class="tok-keyword">CREATE UNIQUE INDEX</span> <span class="tok-string">"Submission_attemptId_key"</span> <span class="tok-keyword">ON</span> <span class="tok-string">"Submission"</span>(<span class="tok-string">"attemptId"</span>);
<span class="tok-keyword">CREATE UNIQUE INDEX</span> <span class="tok-string">"Enrollment_courseId_studentId_key"</span>
  <span class="tok-keyword">ON</span> <span class="tok-string">"Enrollment"</span>(<span class="tok-string">"courseId"</span>, <span class="tok-string">"studentId"</span>);</pre>

<h3>Worked example — why the UNIQUE is the real guard</h3>
<div class="out"><b>Scenario:</b> a student double-clicks Submit — two INSERTs for attempt_id = "att42" arrive at the same millisecond.
<b>Step 1 —</b> Transaction A: INSERT submission (attemptId="att42") → row locked, not yet committed.
<b>Step 2 —</b> Transaction B: INSERT submission (attemptId="att42") → PostgreSQL sees the pending unique key → <b>B waits</b>.
<b>Step 3 —</b> A commits. The unique key ("att42") now exists.
<b>Step 4 —</b> B is released → its INSERT violates <code>Submission_attemptId_key</code> → Prisma throws <b>P2002 (unique constraint failed)</b>.
<b>Result:</b> exactly one Submission exists. Your code catches P2002 and returns the existing grade (idempotent) or 409. The database, not your <code>if</code>-statement, guarantees "graded once".</div>

<div class="pitfall"><strong>Trap:</strong> relying only on a TypeScript check like <code>if (!attempt.submission)</code>. Between your read and your write, another request can read the same "no submission yet" — the classic <em>race condition</em>. The check is a fast path for the common case; the UNIQUE constraint is the guarantee. You need both. Section 4 shows the full defence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b><code>onDelete</code> and referential actions.</b> If an instructor deletes a quiz, what happens to its attempts and submissions? Prisma lets you declare <code>onDelete: Cascade</code> (delete children too) or <code>Restrict</code> (block the delete). Choosing deliberately — rather than accepting the default — prevents orphan rows and "cannot delete, foreign key" surprises in your demo. <em>Why beyond syllabus: referential-action design is a modelling decision the syllabus rarely forces you to make explicit.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-433" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Practice Prisma relations on Code Lab</span><span class="lc-sub">One-to-many, one-to-one and unique constraints — the relations in this schema.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Schema Prisma &amp; ràng buộc chấm một lần</h2>
<p class="lead">Đây là toàn bộ CSDL trong một file <code>schema.prisma</code>. Chú ý hai dòng — <code>correctIndex Int</code> trên Question (đáp án), và <code>attemptId String @unique</code> trên Submission. Chỉ một UNIQUE đó là <strong>hàng rào cuối cùng</strong>: kể cả khi hai request nộp lọt qua mọi kiểm tra trong TypeScript, chính CSDL từ chối ghi hai dòng đã chấm cho một attempt.</p>

<h3>schema.prisma</h3>
<pre><span class="tok-keyword">enum</span> <span class="tok-type">Role</span> { STUDENT INSTRUCTOR }

<span class="tok-keyword">model</span> <span class="tok-type">User</span> {
  id          <span class="tok-type">String</span>       <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  email       <span class="tok-type">String</span>       <span class="tok-keyword">@unique</span>
  password    <span class="tok-type">String</span>                            <span class="tok-comment">// hash bcrypt</span>
  name        <span class="tok-type">String</span>
  role        <span class="tok-type">Role</span>         <span class="tok-keyword">@default</span>(STUDENT)
  courses     <span class="tok-type">Course</span>[]     <span class="tok-keyword">@relation</span>(<span class="tok-string">"Instructor"</span>)  <span class="tok-comment">// khoá tôi dạy</span>
  enrollments <span class="tok-type">Enrollment</span>[]
  attempts    <span class="tok-type">Attempt</span>[]
}

<span class="tok-keyword">model</span> <span class="tok-type">Course</span> {
  id           <span class="tok-type">String</span>       <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  title        <span class="tok-type">String</span>
  description  <span class="tok-type">String</span>
  instructor   <span class="tok-type">User</span>         <span class="tok-keyword">@relation</span>(<span class="tok-string">"Instructor"</span>, fields: [instructorId], references: [id])
  instructorId <span class="tok-type">String</span>
  quizzes      <span class="tok-type">Quiz</span>[]
  enrollments  <span class="tok-type">Enrollment</span>[]
}

<span class="tok-keyword">model</span> <span class="tok-type">Enrollment</span> {
  id        <span class="tok-type">String</span>   <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  course    <span class="tok-type">Course</span>   <span class="tok-keyword">@relation</span>(fields: [courseId], references: [id])
  courseId  <span class="tok-type">String</span>
  student   <span class="tok-type">User</span>     <span class="tok-keyword">@relation</span>(fields: [studentId], references: [id])
  studentId <span class="tok-type">String</span>
  createdAt <span class="tok-type">DateTime</span> <span class="tok-keyword">@default</span>(now())
  <span class="tok-keyword">@@unique</span>([courseId, studentId])         <span class="tok-comment">// ghi danh một lần mỗi khoá</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Quiz</span> {
  id        <span class="tok-type">String</span>     <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  course    <span class="tok-type">Course</span>     <span class="tok-keyword">@relation</span>(fields: [courseId], references: [id])
  courseId  <span class="tok-type">String</span>
  title     <span class="tok-type">String</span>
  questions <span class="tok-type">Question</span>[]
  attempts  <span class="tok-type">Attempt</span>[]
}

<span class="tok-keyword">model</span> <span class="tok-type">Question</span> {
  id           <span class="tok-type">String</span> <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  quiz         <span class="tok-type">Quiz</span>   <span class="tok-keyword">@relation</span>(fields: [quizId], references: [id])
  quizId       <span class="tok-type">String</span>
  text         <span class="tok-type">String</span>
  options      <span class="tok-type">Json</span>                            <span class="tok-comment">// ["A","B","C","D"]</span>
  correctIndex <span class="tok-type">Int</span>                             <span class="tok-comment">// ★ CHỈ Ở SERVER — không bao giờ select xuống client</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Attempt</span> {
  id         <span class="tok-type">String</span>      <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  quiz       <span class="tok-type">Quiz</span>        <span class="tok-keyword">@relation</span>(fields: [quizId], references: [id])
  quizId     <span class="tok-type">String</span>
  student    <span class="tok-type">User</span>        <span class="tok-keyword">@relation</span>(fields: [studentId], references: [id])
  studentId  <span class="tok-type">String</span>
  startedAt  <span class="tok-type">DateTime</span>    <span class="tok-keyword">@default</span>(now())
  submission <span class="tok-type">Submission</span>?                     <span class="tok-comment">// 0 hoặc 1 — chấm tối đa một lần</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Submission</span> {
  id          <span class="tok-type">String</span>   <span class="tok-keyword">@id</span> <span class="tok-keyword">@default</span>(cuid())
  attempt     <span class="tok-type">Attempt</span>  <span class="tok-keyword">@relation</span>(fields: [attemptId], references: [id])
  attemptId   <span class="tok-type">String</span>   <span class="tok-keyword">@unique</span>                 <span class="tok-comment">// ★ MỘT bản chấm mỗi attempt</span>
  score       <span class="tok-type">Int</span>
  total       <span class="tok-type">Int</span>
  submittedAt <span class="tok-type">DateTime</span> <span class="tok-keyword">@default</span>(now())
}</pre>

<h3>Migration &amp; SQL nó sinh ra</h3>
<p>Chạy <code>npx prisma migrate dev --name init</code>. Prisma biến <code>attemptId String @unique</code> thành một unique index SQL thật:</p>
<pre><span class="tok-comment">-- từ migration.sql sinh ra</span>
<span class="tok-keyword">CREATE UNIQUE INDEX</span> <span class="tok-string">"Submission_attemptId_key"</span> <span class="tok-keyword">ON</span> <span class="tok-string">"Submission"</span>(<span class="tok-string">"attemptId"</span>);
<span class="tok-keyword">CREATE UNIQUE INDEX</span> <span class="tok-string">"Enrollment_courseId_studentId_key"</span>
  <span class="tok-keyword">ON</span> <span class="tok-string">"Enrollment"</span>(<span class="tok-string">"courseId"</span>, <span class="tok-string">"studentId"</span>);</pre>

<h3>Ví dụ có lời giải — vì sao UNIQUE mới là người gác thật</h3>
<div class="out"><b>Tình huống:</b> một sinh viên double-click Nộp — hai INSERT cho attempt_id = "att42" tới cùng một mili-giây.
<b>Bước 1 —</b> Giao dịch A: INSERT submission (attemptId="att42") → dòng bị khoá, chưa commit.
<b>Bước 2 —</b> Giao dịch B: INSERT submission (attemptId="att42") → PostgreSQL thấy khoá unique đang chờ → <b>B đợi</b>.
<b>Bước 3 —</b> A commit. Khoá unique ("att42") giờ tồn tại.
<b>Bước 4 —</b> B được thả → INSERT của nó vi phạm <code>Submission_attemptId_key</code> → Prisma ném <b>P2002 (unique constraint failed)</b>.
<b>Kết quả:</b> đúng một Submission tồn tại. Code của bạn bắt P2002 và trả về điểm đã có (idempotent) hoặc 409. Chính CSDL, không phải câu <code>if</code>, mới bảo đảm "chấm một lần".</div>

<div class="pitfall"><strong>Bẫy:</strong> chỉ dựa vào một kiểm tra TypeScript kiểu <code>if (!attempt.submission)</code>. Giữa lúc bạn đọc và lúc bạn ghi, một request khác có thể đọc cùng "chưa có submission" — đây là <em>race condition</em> kinh điển. Kiểm tra là đường nhanh cho trường hợp thường; ràng buộc UNIQUE là sự bảo đảm. Cần cả hai. Mục 4 chỉ cách phòng thủ đầy đủ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b><code>onDelete</code> và referential action.</b> Nếu giảng viên xoá một quiz, điều gì xảy ra với các attempt và submission của nó? Prisma cho bạn khai báo <code>onDelete: Cascade</code> (xoá luôn con) hoặc <code>Restrict</code> (chặn xoá). Chọn có chủ đích — thay vì nhận mặc định — tránh dòng mồ côi và bất ngờ "không xoá được, foreign key" ngay trong buổi demo. <em>Vì sao ngoài syllabus: thiết kế referential-action là một quyết định mô hình mà giáo trình ít khi ép bạn nói rõ.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-433" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Luyện quan hệ Prisma trên Code Lab</span><span class="lc-sub">Một-nhiều, một-một và ràng buộc unique — các quan hệ trong schema này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int605-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, cardinality và ràng buộc chấm-một-lần.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which relationship guarantees an attempt is graded at most once, and where does the guarantee live?|||Quan hệ nào bảo đảm một attempt được chấm tối đa một lần, và sự bảo đảm nằm ở đâu?',
                options: [
                  'User to Course; guaranteed by the frontend|||User với Course; bảo đảm bằng frontend',
                  'Attempt 1—1 Submission; guaranteed by @unique on attemptId in the database|||Attempt 1—1 Submission; bảo đảm bằng @unique trên attemptId trong CSDL',
                  'Quiz to Question; guaranteed by a TypeScript if-check|||Quiz với Question; bảo đảm bằng câu if TypeScript',
                  'Course to Quiz; guaranteed by Auth.js|||Course với Quiz; bảo đảm bằng Auth.js',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Where does the answer key (correctIndex) belong so it never reaches the browser?|||Đáp án (correctIndex) nên nằm ở đâu để không bao giờ tới trình duyệt?',
                options: [
                  'On the Question row, excluded from any query sent to the client|||Trên dòng Question, bị loại khỏi mọi truy vấn gửi xuống client',
                  'In localStorage|||Trong localStorage',
                  'In a hidden HTML input|||Trong một input HTML ẩn',
                  'In the JWT payload|||Trong payload JWT',
                ], correctIndex: 0,
              },
              {
                id: 'q3', points: 1,
                question: 'Why keep Submission as its own model instead of putting score on Attempt?|||Vì sao giữ Submission là model riêng thay vì đặt score lên Attempt?',
                options: [
                  'It is faster to query|||Truy vấn nhanh hơn',
                  'To express "started but not graded", store the submit time, and hang the UNIQUE that blocks double-submit|||Để diễn tả "đã bắt đầu nhưng chưa chấm", lưu thời điểm nộp, và gắn UNIQUE chặn nộp trùng',
                  'Prisma requires it|||Prisma bắt buộc',
                  'To avoid a foreign key|||Để tránh khoá ngoại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Two INSERTs hit the same attemptId at once with @unique(attemptId). What happens?|||Hai INSERT cùng attemptId một lúc với @unique(attemptId). Điều gì xảy ra?',
                options: [
                  'Both succeed|||Cả hai thành công',
                  'Both fail|||Cả hai thất bại',
                  'Exactly one commits; the other violates the constraint and Prisma throws P2002|||Đúng một cái commit; cái kia vi phạm ràng buộc và Prisma ném P2002',
                  'The database crashes|||CSDL sập',
                ], correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) Declaring onDelete on a Prisma relation lets you…|||(Ngoài giáo trình) Khai báo onDelete trên một quan hệ Prisma cho phép bạn…',
                options: [
                  'Store passwords|||Lưu mật khẩu',
                  'Decide whether deleting a parent cascades to children or is blocked, avoiding orphan rows|||Quyết định việc xoá cha có cascade xuống con hay bị chặn, tránh dòng mồ côi',
                  'Skip migrations|||Bỏ migration',
                  'Send the answer key to the client|||Gửi đáp án xuống client',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ MỤC 2 — APP ROUTER: FULL-STACK TRONG MỘT APP ══════════════════ */
    {
      title: 'Section 2 — App Router: Full-stack in One App|||Mục 2 — App Router: Full-stack trong một app',
      description: 'Khởi tạo dự án Next.js, hiểu Route Handlers làm API và Server Components fetch dữ liệu, và xây một lát cắt dọc "liệt kê khoá học".',
      lessons: [
        {
          title: '2.1 — Project setup & Route Handlers as the API|||2.1 — Khởi tạo dự án & Route Handlers làm API',
          slug: 'int605-setup-route-handlers',
          type: 'VIDEO',
          description: 'create-next-app, cấu trúc thư mục app/, và một Route Handler đầu tiên trả JSON — API của bạn sống trong chính app.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.1</span>
<h2>Project setup &amp; Route Handlers as the API</h2>
<p class="lead">Scaffold with <code>npx create-next-app@latest elearn --typescript --app</code>. Then add Prisma, zod and Auth.js. The key idea of this project: <strong>your API is not a separate server</strong> — each <code>route.ts</code> file under <code>app/api/</code> is an HTTP endpoint, colocated with the pages that use it.</p>

<h3>The folder shape</h3>
<div class="diagram">app/
  layout.tsx              ← root layout (nav, providers)
  page.tsx                ← home (Server Component)
  courses/
    page.tsx              ← course list (Server Component, fetches from Prisma)
    [id]/page.tsx         ← one course + its quizzes
  quiz/[id]/page.tsx      ← take-quiz screen (Client Component)
  api/
    courses/route.ts      ← GET list / POST create  (the API)
    attempts/[id]/submit/route.ts  ← POST grade      (the core)
lib/
  db.ts                   ← the Prisma client singleton
  auth.ts                 ← Auth.js config
  grading.ts              ← the grading service (Section 4)</div>

<h3>A Route Handler — GET and POST in one file</h3>
<pre><span class="tok-comment">// app/api/courses/route.ts</span>
<span class="tok-keyword">import</span> { NextResponse } <span class="tok-keyword">from</span> <span class="tok-string">"next/server"</span>;
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/db"</span>;
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">"zod"</span>;
<span class="tok-keyword">import</span> { auth } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/auth"</span>;

<span class="tok-comment">// GET /api/courses — public list</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">GET</span>() {
  <span class="tok-keyword">const</span> courses = <span class="tok-keyword">await</span> prisma.course.findMany({
    select: { id: <span class="tok-keyword">true</span>, title: <span class="tok-keyword">true</span>, description: <span class="tok-keyword">true</span> },
  });
  <span class="tok-keyword">return</span> NextResponse.json(courses);
}

<span class="tok-comment">// POST /api/courses — instructor creates a course</span>
<span class="tok-keyword">const</span> CreateCourse = z.object({ title: z.string().min(<span class="tok-number">3</span>), description: z.string() });

<span class="tok-keyword">export async function</span> <span class="tok-function">POST</span>(req: <span class="tok-type">Request</span>) {
  <span class="tok-keyword">const</span> session = <span class="tok-keyword">await</span> auth();
  <span class="tok-keyword">if</span> (!session) <span class="tok-keyword">return</span> NextResponse.json({ error: <span class="tok-string">"Unauthorized"</span> }, { status: <span class="tok-number">401</span> });
  <span class="tok-keyword">if</span> (session.user.role !== <span class="tok-string">"INSTRUCTOR"</span>)
    <span class="tok-keyword">return</span> NextResponse.json({ error: <span class="tok-string">"Forbidden"</span> }, { status: <span class="tok-number">403</span> });

  <span class="tok-keyword">const</span> parsed = CreateCourse.safeParse(<span class="tok-keyword">await</span> req.json());
  <span class="tok-keyword">if</span> (!parsed.success)
    <span class="tok-keyword">return</span> NextResponse.json({ error: <span class="tok-string">"Validation failed"</span> }, { status: <span class="tok-number">400</span> });

  <span class="tok-keyword">const</span> course = <span class="tok-keyword">await</span> prisma.course.create({
    data: { ...parsed.data, instructorId: session.user.id },
  });
  <span class="tok-keyword">return</span> NextResponse.json(course, { status: <span class="tok-number">201</span> });
}</pre>

<h3>The Prisma client — one instance, reused</h3>
<pre><span class="tok-comment">// lib/db.ts — avoid exhausting connections in dev hot-reload</span>
<span class="tok-keyword">import</span> { PrismaClient } <span class="tok-keyword">from</span> <span class="tok-string">"@prisma/client"</span>;
<span class="tok-keyword">const</span> g = globalThis <span class="tok-keyword">as</span> <span class="tok-keyword">unknown as</span> { prisma?: PrismaClient };
<span class="tok-keyword">export const</span> prisma = g.prisma ?? <span class="tok-keyword">new</span> PrismaClient();
<span class="tok-keyword">if</span> (process.env.NODE_ENV !== <span class="tok-string">"production"</span>) g.prisma = prisma;</pre>

<div class="callout ok">Why colocate the API? Because the same TypeScript types flow from Prisma → Route Handler → page. There is no "API contract drift" between a separate backend and frontend — they are one codebase, one deploy.</div>

<div class="pitfall"><strong>Trap:</strong> creating <code>new PrismaClient()</code> inside every request. In dev, hot-reload then opens a new pool each time and you hit "too many connections". The <code>globalThis</code> singleton above keeps exactly one client. Import <code>prisma</code> from <code>lib/db</code> everywhere.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Route Handlers run on the server only — put secrets and DB calls here freely.</b> Unlike a page that can hydrate on the client, a <code>route.ts</code> never ships to the browser. That is why the grading endpoint can read <code>correctIndex</code> and the DB directly: nothing in this file is visible to the user. <em>Why beyond syllabus: understanding which files execute where is the mental model that prevents accidental secret leaks.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-379" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">API Routes &amp; full-stack Next.js on Code Lab</span><span class="lc-sub">Route Handlers, request/response and status codes, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.1</span>
<h2>Khởi tạo dự án &amp; Route Handlers làm API</h2>
<p class="lead">Tạo khung bằng <code>npx create-next-app@latest elearn --typescript --app</code>. Rồi thêm Prisma, zod và Auth.js. Ý tưởng cốt lõi của đồ án: <strong>API không phải một server riêng</strong> — mỗi file <code>route.ts</code> dưới <code>app/api/</code> là một endpoint HTTP, đặt cạnh chính các trang dùng nó.</p>

<h3>Hình dạng thư mục</h3>
<div class="diagram">app/
  layout.tsx              ← layout gốc (nav, providers)
  page.tsx                ← trang chủ (Server Component)
  courses/
    page.tsx              ← danh sách khoá (Server Component, fetch từ Prisma)
    [id]/page.tsx         ← một khoá + các bài của nó
  quiz/[id]/page.tsx      ← màn hình làm bài (Client Component)
  api/
    courses/route.ts      ← GET danh sách / POST tạo  (API)
    attempts/[id]/submit/route.ts  ← POST chấm       (lõi)
lib/
  db.ts                   ← singleton Prisma client
  auth.ts                 ← cấu hình Auth.js
  grading.ts              ← service chấm điểm (Mục 4)</div>

<h3>Một Route Handler — GET và POST trong một file</h3>
<pre><span class="tok-comment">// app/api/courses/route.ts</span>
<span class="tok-keyword">import</span> { NextResponse } <span class="tok-keyword">from</span> <span class="tok-string">"next/server"</span>;
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/db"</span>;
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">"zod"</span>;
<span class="tok-keyword">import</span> { auth } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/auth"</span>;

<span class="tok-comment">// GET /api/courses — danh sách công khai</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">GET</span>() {
  <span class="tok-keyword">const</span> courses = <span class="tok-keyword">await</span> prisma.course.findMany({
    select: { id: <span class="tok-keyword">true</span>, title: <span class="tok-keyword">true</span>, description: <span class="tok-keyword">true</span> },
  });
  <span class="tok-keyword">return</span> NextResponse.json(courses);
}

<span class="tok-comment">// POST /api/courses — giảng viên tạo một khoá</span>
<span class="tok-keyword">const</span> CreateCourse = z.object({ title: z.string().min(<span class="tok-number">3</span>), description: z.string() });

<span class="tok-keyword">export async function</span> <span class="tok-function">POST</span>(req: <span class="tok-type">Request</span>) {
  <span class="tok-keyword">const</span> session = <span class="tok-keyword">await</span> auth();
  <span class="tok-keyword">if</span> (!session) <span class="tok-keyword">return</span> NextResponse.json({ error: <span class="tok-string">"Unauthorized"</span> }, { status: <span class="tok-number">401</span> });
  <span class="tok-keyword">if</span> (session.user.role !== <span class="tok-string">"INSTRUCTOR"</span>)
    <span class="tok-keyword">return</span> NextResponse.json({ error: <span class="tok-string">"Forbidden"</span> }, { status: <span class="tok-number">403</span> });

  <span class="tok-keyword">const</span> parsed = CreateCourse.safeParse(<span class="tok-keyword">await</span> req.json());
  <span class="tok-keyword">if</span> (!parsed.success)
    <span class="tok-keyword">return</span> NextResponse.json({ error: <span class="tok-string">"Dữ liệu không hợp lệ"</span> }, { status: <span class="tok-number">400</span> });

  <span class="tok-keyword">const</span> course = <span class="tok-keyword">await</span> prisma.course.create({
    data: { ...parsed.data, instructorId: session.user.id },
  });
  <span class="tok-keyword">return</span> NextResponse.json(course, { status: <span class="tok-number">201</span> });
}</pre>

<h3>Prisma client — một instance, dùng lại</h3>
<pre><span class="tok-comment">// lib/db.ts — tránh cạn kết nối khi hot-reload lúc dev</span>
<span class="tok-keyword">import</span> { PrismaClient } <span class="tok-keyword">from</span> <span class="tok-string">"@prisma/client"</span>;
<span class="tok-keyword">const</span> g = globalThis <span class="tok-keyword">as</span> <span class="tok-keyword">unknown as</span> { prisma?: PrismaClient };
<span class="tok-keyword">export const</span> prisma = g.prisma ?? <span class="tok-keyword">new</span> PrismaClient();
<span class="tok-keyword">if</span> (process.env.NODE_ENV !== <span class="tok-string">"production"</span>) g.prisma = prisma;</pre>

<div class="callout ok">Vì sao đặt API cạnh nhau? Vì cùng một kiểu TypeScript chảy từ Prisma → Route Handler → trang. Không có "API contract drift" giữa backend và frontend tách rời — chúng là một codebase, một lần deploy.</div>

<div class="pitfall"><strong>Bẫy:</strong> tạo <code>new PrismaClient()</code> trong mỗi request. Lúc dev, hot-reload mở một pool mới mỗi lần và bạn dính "too many connections". Singleton <code>globalThis</code> ở trên giữ đúng một client. Import <code>prisma</code> từ <code>lib/db</code> ở mọi nơi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Route Handler chỉ chạy trên server — cứ để bí mật và gọi DB ở đây thoải mái.</b> Khác một trang có thể hydrate trên client, một <code>route.ts</code> không bao giờ ship xuống trình duyệt. Đó là lý do endpoint chấm điểm có thể đọc <code>correctIndex</code> và DB trực tiếp: không gì trong file này hiện với người dùng. <em>Vì sao ngoài syllabus: hiểu file nào chạy ở đâu là mô hình tư duy ngăn rò rỉ bí mật ngoài ý muốn.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-379" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">API Routes &amp; full-stack Next.js trên Code Lab</span><span class="lc-sub">Route Handlers, request/response và status code, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Server Components & data fetching|||2.2 — Server Components & fetch dữ liệu',
          slug: 'int605-server-components',
          type: 'VIDEO',
          description: 'Một Server Component fetch dữ liệu thẳng từ Prisma, không cần API, không JS xuống client — và ranh giới "use client".',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>Server Components &amp; data fetching</h2>
<p class="lead">In the App Router, a page is a <strong>Server Component by default</strong>. It runs on the server, can be <code>async</code>, and can call Prisma <em>directly</em> — no <code>fetch</code>, no API round-trip, and zero JavaScript shipped for that data. You only opt into the client (with <code>"use client"</code>) where you need interactivity.</p>

<h3>A data page — Prisma inside the component</h3>
<pre><span class="tok-comment">// app/courses/page.tsx  — a Server Component (no "use client")</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/db"</span>;
<span class="tok-keyword">import</span> Link <span class="tok-keyword">from</span> <span class="tok-string">"next/link"</span>;

<span class="tok-keyword">export default async function</span> <span class="tok-function">CoursesPage</span>() {
  <span class="tok-comment">// runs on the server — this query never reaches the browser</span>
  <span class="tok-keyword">const</span> courses = <span class="tok-keyword">await</span> prisma.course.findMany({
    select: { id: <span class="tok-keyword">true</span>, title: <span class="tok-keyword">true</span>, description: <span class="tok-keyword">true</span> },
    orderBy: { title: <span class="tok-string">"asc"</span> },
  });

  <span class="tok-keyword">return</span> (
    &lt;ul&gt;
      {courses.map((c) =&gt; (
        &lt;li key={c.id}&gt;
          &lt;Link href={&#96;/courses/\${c.id}&#96;}&gt;{c.title}&lt;/Link&gt;
          &lt;p&gt;{c.description}&lt;/p&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</pre>

<h3>Server vs Client — who runs where</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Server Component (default)</b> — runs on the server, can be <code>async</code>, can query Prisma and read secrets. Ships HTML, not JS. Cannot use <code>useState</code>/<code>onClick</code>. <em>Use for: data pages, lists, layouts.</em></div>
  <div class="lz-layer"><b>Client Component (<code>"use client"</code>)</b> — runs in the browser. Can use hooks, events, and browser APIs. Cannot query Prisma or read server secrets. <em>Use for: the quiz form, buttons, anything interactive.</em></div>
  <div class="lz-layer"><b>The boundary</b> — a Server Component may render a Client Component and pass it <em>plain data as props</em>. Only what you pass crosses to the browser — so you pass questions <em>without</em> <code>correctIndex</code>.</div>
</div>
<div class="diagram">SERVER                                   │  BROWSER
 CoursesPage (Server Component)           │
   prisma.course.findMany() ──────────┐   │
   passes { id, title, options } ─────┼──▶│  QuizForm ("use client")
   (NO correctIndex crosses) ─────────┘   │    useState, onClick, submit
                                          │</div>

<h3>Worked example — what actually reaches the browser</h3>
<div class="out"><b>Server Component query:</b> select { id, title, description } → renders to HTML.
<b>View source in the browser:</b> you see the rendered &lt;li&gt; text, but NO JavaScript array of courses, and definitely no answer keys.
<b>Contrast:</b> if this were a Client Component doing <code>fetch("/api/...")</code>, the data would arrive as JSON the user can read in the Network tab.
<b>Lesson:</b> for read-only pages, a Server Component is simpler AND leaks less. Reach for the client only when you need a click.</div>

<div class="pitfall"><strong>Trap:</strong> adding <code>"use client"</code> to the top of every file "to be safe". That turns a data page into a client bundle, forces you to build an API just to fetch, and can accidentally pull sensitive fields into the browser. Default to Server Components; opt into the client narrowly.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Serialization is the crossing rule.</b> Anything passed from a Server Component to a Client Component must be serializable (plain objects, strings, numbers) — you cannot pass a function or a Prisma model with methods. This constraint is also your safety net: you are forced to hand-pick the exact fields that cross, which is precisely how you keep <code>correctIndex</code> on the server. <em>Why beyond syllabus: the serialization boundary doubling as a security boundary is a subtle App Router insight.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-376" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Server Components &amp; data fetching on Code Lab</span><span class="lc-sub">Async components, the server/client split, streaming — hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Server Components &amp; fetch dữ liệu</h2>
<p class="lead">Trong App Router, một trang <strong>mặc định là Server Component</strong>. Nó chạy trên server, có thể <code>async</code>, và có thể gọi Prisma <em>trực tiếp</em> — không <code>fetch</code>, không round-trip API, và không ship JavaScript nào cho dữ liệu đó. Bạn chỉ chọn client (bằng <code>"use client"</code>) ở nơi cần tương tác.</p>

<h3>Một trang dữ liệu — Prisma ngay trong component</h3>
<pre><span class="tok-comment">// app/courses/page.tsx  — một Server Component (không "use client")</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/db"</span>;
<span class="tok-keyword">import</span> Link <span class="tok-keyword">from</span> <span class="tok-string">"next/link"</span>;

<span class="tok-keyword">export default async function</span> <span class="tok-function">CoursesPage</span>() {
  <span class="tok-comment">// chạy trên server — truy vấn này không bao giờ tới trình duyệt</span>
  <span class="tok-keyword">const</span> courses = <span class="tok-keyword">await</span> prisma.course.findMany({
    select: { id: <span class="tok-keyword">true</span>, title: <span class="tok-keyword">true</span>, description: <span class="tok-keyword">true</span> },
    orderBy: { title: <span class="tok-string">"asc"</span> },
  });

  <span class="tok-keyword">return</span> (
    &lt;ul&gt;
      {courses.map((c) =&gt; (
        &lt;li key={c.id}&gt;
          &lt;Link href={&#96;/courses/\${c.id}&#96;}&gt;{c.title}&lt;/Link&gt;
          &lt;p&gt;{c.description}&lt;/p&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</pre>

<h3>Server vs Client — ai chạy ở đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Server Component (mặc định)</b> — chạy trên server, có thể <code>async</code>, truy vấn Prisma và đọc bí mật. Ship HTML, không JS. Không dùng được <code>useState</code>/<code>onClick</code>. <em>Dùng cho: trang dữ liệu, danh sách, layout.</em></div>
  <div class="lz-layer"><b>Client Component (<code>"use client"</code>)</b> — chạy trong trình duyệt. Dùng được hook, sự kiện, API trình duyệt. Không truy vấn Prisma hay đọc bí mật server. <em>Dùng cho: form trắc nghiệm, nút, mọi thứ tương tác.</em></div>
  <div class="lz-layer"><b>Ranh giới</b> — một Server Component có thể render một Client Component và truyền <em>dữ liệu thuần làm props</em>. Chỉ thứ bạn truyền mới sang trình duyệt — nên bạn truyền câu hỏi <em>không kèm</em> <code>correctIndex</code>.</div>
</div>
<div class="diagram">SERVER                                   │  TRÌNH DUYỆT
 CoursesPage (Server Component)           │
   prisma.course.findMany() ──────────┐   │
   truyền { id, title, options } ─────┼──▶│  QuizForm ("use client")
   (KHÔNG correctIndex sang) ─────────┘   │    useState, onClick, nộp
                                          │</div>

<h3>Ví dụ có lời giải — thứ gì thật sự tới trình duyệt</h3>
<div class="out"><b>Truy vấn Server Component:</b> select { id, title, description } → render ra HTML.
<b>Xem source trong trình duyệt:</b> bạn thấy chữ &lt;li&gt; đã render, nhưng KHÔNG có mảng JavaScript các khoá, và chắc chắn không có đáp án.
<b>Đối chiếu:</b> nếu đây là Client Component gọi <code>fetch("/api/...")</code>, dữ liệu sẽ tới dưới dạng JSON mà người dùng đọc được ở tab Network.
<b>Bài học:</b> với trang chỉ-đọc, Server Component đơn giản hơn VÀ lộ ít hơn. Chỉ dùng client khi cần một cú click.</div>

<div class="pitfall"><strong>Bẫy:</strong> thêm <code>"use client"</code> lên đầu mọi file "cho chắc". Điều đó biến một trang dữ liệu thành bundle client, ép bạn dựng API chỉ để fetch, và có thể vô tình kéo trường nhạy cảm vào trình duyệt. Mặc định Server Components; chọn client một cách hẹp.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Serialization là quy tắc vượt biên.</b> Mọi thứ truyền từ Server Component sang Client Component phải serialize được (object thuần, chuỗi, số) — không truyền được hàm hay một Prisma model có method. Ràng buộc này cũng là lưới an toàn: bạn buộc phải chọn tay đúng các trường vượt biên, chính là cách bạn giữ <code>correctIndex</code> ở server. <em>Vì sao ngoài syllabus: ranh giới serialization kiêm luôn ranh giới bảo mật là một insight tinh tế của App Router.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fe-learning-mini-platform%2Flearn&reflabel=INT605#module-376" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Server Components &amp; fetch dữ liệu trên Code Lab</span><span class="lc-sub">Component async, tách server/client, streaming — thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.3 — Worked slice: the courses a student enrolled in|||2.3 — Lát cắt có lời giải: các khoá đã ghi danh',
          slug: 'int605-slice-enrolled',
          type: 'VIDEO',
          description: 'Đi trọn một lát cắt dọc đầu tiên: Server Component đọc session → Prisma → render danh sách khoá đã ghi danh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.3</span>
<h2>Worked slice — a student enrolled courses</h2>
<p class="lead">Let us ship the first end-to-end slice: a page that shows the logged-in student the courses they enrolled in. It combines everything so far — the session, a Prisma query with a relation filter, and a Server Component — with no separate API needed.</p>

<h3>Step 1 — the page reads the session on the server</h3>
<pre><span class="tok-comment">// app/my-courses/page.tsx  (Server Component)</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/db"</span>;
<span class="tok-keyword">import</span> { auth } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/auth"</span>;
<span class="tok-keyword">import</span> { redirect } <span class="tok-keyword">from</span> <span class="tok-string">"next/navigation"</span>;

<span class="tok-keyword">export default async function</span> <span class="tok-function">MyCourses</span>() {
  <span class="tok-keyword">const</span> session = <span class="tok-keyword">await</span> auth();
  <span class="tok-keyword">if</span> (!session) redirect(<span class="tok-string">"/login"</span>);

  <span class="tok-comment">// courses this student is enrolled in, via the Enrollment relation</span>
  <span class="tok-keyword">const</span> enrollments = <span class="tok-keyword">await</span> prisma.enrollment.findMany({
    where: { studentId: session.user.id },
    select: { course: { select: { id: <span class="tok-keyword">true</span>, title: <span class="tok-keyword">true</span> } } },
  });

  <span class="tok-keyword">return</span> (
    &lt;section&gt;
      &lt;h1&gt;My courses&lt;/h1&gt;
      {enrollments.length === <span class="tok-number">0</span> &amp;&amp; &lt;p&gt;You have not enrolled yet.&lt;/p&gt;}
      &lt;ul&gt;
        {enrollments.map(({ course }) =&gt; (
          &lt;li key={course.id}&gt;
            &lt;a href={&#96;/courses/\${course.id}&#96;}&gt;{course.title}&lt;/a&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/section&gt;
  );
}</pre>

<h3>Step 2 — the enrol action (Route Handler, UNIQUE-safe)</h3>
<pre><span class="tok-comment">// app/api/courses/[id]/enroll/route.ts</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">POST</span>(_req: <span class="tok-type">Request</span>, { params }: { params: { id: <span class="tok-type">string</span> } }) {
  <span class="tok-keyword">const</span> session = <span class="tok-keyword">await</span> auth();
  <span class="tok-keyword">if</span> (!session) <span class="tok-keyword">return</span> NextResponse.json({ error: <span class="tok-string">"Unauthorized"</span> }, { status: <span class="tok-number">401</span> });
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">await</span> prisma.enrollment.create({
      data: { courseId: params.id, studentId: session.user.id },
    });
  } <span class="tok-keyword">catch</span> (e) {
    <span class="tok-comment">// @@unique([courseId, studentId]) → enrolling twice is a harmless no-op</span>
    <span class="tok-keyword">if</span> (isP2002(e)) <span class="tok-keyword">return</span> NextResponse.json({ ok: <span class="tok-keyword">true</span>, already: <span class="tok-keyword">true</span> });
    <span class="tok-keyword">throw</span> e;
  }
  <span class="tok-keyword">return</span> NextResponse.json({ ok: <span class="tok-keyword">true</span> }, { status: <span class="tok-number">201</span> });
}</pre>

<h3>Worked example — the flow end to end</h3>
<div class="out"><b>1.</b> An logs in → session.user.id = "u_an".
<b>2.</b> An clicks Enrol on course "c1" → POST /api/courses/c1/enroll → 201, one Enrollment row.
<b>3.</b> An clicks Enrol again → POST → the @@unique fires → caught → { ok: true, already: true } (no duplicate).
<b>4.</b> An opens /my-courses → the Server Component queries enrollments where studentId="u_an" → renders "c1".
<b>Result:</b> a complete vertical slice — session, a UNIQUE-guarded write, and a server-rendered read — with no client-side data fetching at all.</div>

<div class="callout ok"><strong>Rhythm to internalise:</strong> read pages are Server Components (query Prisma directly); writes are Route Handlers (validate, check the session, guard with a UNIQUE). You now have the pattern every feature reuses.</div>

<div class="pitfall"><strong>Trap:</strong> doing the auth check only in the page and forgetting it in the Route Handler. The page redirect is UX, not security — a user can call <code>POST /api/...</code> directly with curl. Every Route Handler must re-check the session itself.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Enroll-twice as a no-op is idempotency in disguise.</b> Catching the unique violation and returning success (instead of 409) means a student who double-clicks Enrol just ends up enrolled — the same end state as one click. Choosing whether a duplicate is "an error" or "already done" is an API-design judgement you should be able to defend. <em>Why beyond syllabus: idempotent write semantics are a distributed-systems idea the syllabus never frames.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.3</span>
<h2>Lát cắt có lời giải — các khoá sinh viên đã ghi danh</h2>
<p class="lead">Hãy ship lát cắt đầu tiên từ đầu đến cuối: một trang cho sinh viên đang đăng nhập thấy các khoá họ đã ghi danh. Nó gộp mọi thứ tới giờ — session, một truy vấn Prisma lọc theo quan hệ, và một Server Component — không cần API riêng.</p>

<h3>Bước 1 — trang đọc session trên server</h3>
<pre><span class="tok-comment">// app/my-courses/page.tsx  (Server Component)</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/db"</span>;
<span class="tok-keyword">import</span> { auth } <span class="tok-keyword">from</span> <span class="tok-string">"@/lib/auth"</span>;
<span class="tok-keyword">import</span> { redirect } <span class="tok-keyword">from</span> <span class="tok-string">"next/navigation"</span>;

<span class="tok-keyword">export default async function</span> <span class="tok-function">MyCourses</span>() {
  <span class="tok-keyword">const</span> session = <span class="tok-keyword">await</span> auth();
  <span class="tok-keyword">if</span> (!session) redirect(<span class="tok-string">"/login"</span>);

  <span class="tok-comment">// các khoá sinh viên này đã ghi danh, qua quan hệ Enrollment</span>
  <span class="tok-keyword">const</span> enrollments = <span class="tok-keyword">await</span> prisma.enrollment.findMany({
    where: { studentId: session.user.id },
    select: { course: { select: { id: <span class="tok-keyword">true</span>, title: <span class="tok-keyword">true</span> } } },
  });

  <span class="tok-keyword">return</span> (
    &lt;section&gt;
      &lt;h1&gt;Khoá của tôi&lt;/h1&gt;
      {enrollments.length === <span class="tok-number">0</span> &amp;&amp; &lt;p&gt;Bạn chưa ghi danh khoá nào.&lt;/p&gt;}
      &lt;ul&gt;
        {enrollments.map(({ course }) =&gt; (
          &lt;li key={course.id}&gt;
            &lt;a href={&#96;/courses/\${course.id}&#96;}&gt;{course.title}&lt;/a&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/section&gt;
  );
}</pre>

<h3>Bước 2 — hành động ghi danh (Route Handler, an toàn UNIQUE)</h3>
<pre><span class="tok-comment">// app/api/courses/[id]/enroll/route.ts</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">POST</span>(_req: <span class="tok-type">Request</span>, { params }: { params: { id: <span class="tok-type">string</span> } }) {
  <span class="tok-keyword">const</span> session = <span class="tok-keyword">await</span> auth();
  <span class="tok-keyword">if</span> (!session) <span class="tok-keyword">return</span> NextResponse.json({ error: <span class="tok-string">"Unauthorized"</span> }, { status: <span class="tok-number">401</span> });
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">await</span> prisma.enrollment.create({
      data: { courseId: params.id, studentId: session.user.id },
    });
  } <span class="tok-keyword">catch</span> (e) {
    <span class="tok-comment">// @@unique([courseId, studentId]) → ghi danh lần hai là no-op vô hại</span>
    <span class="tok-keyword">if</span> (isP2002(e)) <span class="tok-keyword">return</span> NextResponse.json({ ok: <span class="tok-keyword">true</span>, already: <span class="tok-keyword">true</span> });
    <span class="tok-keyword">throw</span> e;
  }
  <span class="tok-keyword">return</span> NextResponse.json({ ok: <span class="tok-keyword">true</span> }, { status: <span class="tok-number">201</span> });
}</pre>

<h3>Ví dụ có lời giải — luồng từ đầu tới cuối</h3>
<div class="out"><b>1.</b> An đăng nhập → session.user.id = "u_an".
<b>2.</b> An bấm Ghi danh khoá "c1" → POST /api/courses/c1/enroll → 201, một dòng Enrollment.
<b>3.</b> An bấm Ghi danh lần nữa → POST → @@unique kích hoạt → bị bắt → { ok: true, already: true } (không trùng).
<b>4.</b> An mở /my-courses → Server Component truy vấn enrollment theo studentId="u_an" → render "c1".
<b>Kết quả:</b> một lát cắt dọc hoàn chỉnh — session, một ghi được UNIQUE canh, và một đọc render-trên-server — không hề fetch dữ liệu ở client.</div>

<div class="callout ok"><strong>Nhịp cần thấm:</strong> trang đọc là Server Component (truy vấn Prisma trực tiếp); ghi là Route Handler (validate, kiểm session, canh bằng UNIQUE). Giờ bạn có khuôn mà mọi tính năng tái dùng.</div>

<div class="pitfall"><strong>Bẫy:</strong> chỉ kiểm auth ở trang và quên ở Route Handler. Redirect ở trang là UX, không phải bảo mật — người dùng có thể gọi thẳng <code>POST /api/...</code> bằng curl. Mọi Route Handler phải tự kiểm lại session.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ghi danh lần hai thành no-op là idempotency trá hình.</b> Bắt lỗi vi phạm unique và trả thành công (thay vì 409) nghĩa là sinh viên double-click Ghi danh chỉ đơn giản là đã ghi danh — cùng trạng thái cuối như một click. Chọn xem một cú trùng là "lỗi" hay "đã xong" là một phán đoán thiết kế API bạn nên bảo vệ được. <em>Vì sao ngoài syllabus: ngữ nghĩa ghi idempotent là ý tưởng hệ phân tán mà giáo trình không nêu.</em></div>
</div>
`,
        },
      ],
    },
  ],
};
