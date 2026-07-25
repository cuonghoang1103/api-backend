/**
 * INT602 — Library Management System (Kỳ 6 — Thực tập, project #2).
 * Web full-stack: Spring Boot 3 (Java 17) REST API + React (Vite) SPA + PostgreSQL.
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản quay video)
 * → domain/DB design → backend setup → auth/JWT → lending core (no double-lending) → frontend
 * → testing (kèm test đồng thời) → deployment (Docker) → nâng cao (★ ngoài giáo trình).
 * Song ngữ EN/VN đối xứng. Code Spring/React <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Deep-link CodeLab spring-boot/react/sql/authentication; Git/Docker → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT602.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (React/Spring) = \${ ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT602',
    title: 'Library Management System',
    slug: 'library-management-system',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #2 — build a real library management web app: Spring Boot 3 API + React SPA + PostgreSQL, with JWT auth, two roles, a reservation queue, and a race-safe lending core that stops one copy being lent twice. Shipped with Docker.|||Đồ án thực tập #2 — web quản lý thư viện thật: Spring Boot 3 API + React SPA + PostgreSQL, có JWT, hai vai trò, hàng đợi đặt trước, và lõi cho mượn an toàn khi tranh chấp (chống mượn một bản sách hai lần). Đóng gói Docker.',
    description: 'INT602 là đồ án thực tập thứ hai của Kỳ 6: bạn xây một hệ thống QUẢN LÝ THƯ VIỆN (Library Management) hoàn chỉnh theo kiến trúc client–server. Backend là REST API viết bằng Spring Boot 3 + Java 17, dữ liệu lưu trong PostgreSQL qua Spring Data JPA; frontend là Single-Page App viết bằng React (Vite) gọi API qua axios. Hệ thống có hai vai trò (Thành viên và Thủ thư), xác thực bằng JWT và phân quyền theo role. Trọng tâm kỹ thuật là LÕI GIAO DỊCH: thủ thư cho một thành viên mượn một BẢN SÁCH vật lý, và hệ thống phải CHẶN việc một bản sách bị cho mượn hai lần cùng lúc — bạn sẽ học ràng buộc UNIQUE + khoá lạc quan (optimistic locking) để làm đúng. Ngoài ra hệ thống có cờ QUÁ HẠN (overdue) và HÀNG ĐỢI ĐẶT TRƯỚC (reservation queue) khi mọi bản sao đều đang được mượn. Cuối cùng đóng gói cả hệ bằng Docker Compose và viết kịch bản demo để quay video. Đây là dự án "xương sống" của thực tập full-stack: mọi hệ quản lý tài nguyên có hạn đều là biến thể của khuôn này.',
    whatYouLearn: 'Thiết kế domain & ERD cho nghiệp vụ thư viện (User/Book/BookCopy/Loan/Reservation); dựng REST API Spring Boot 3 theo kiến trúc phân lớp Controller→Service→Repository; JPA/Hibernate + PostgreSQL, DTO & mapping, Bean Validation; xác thực JWT + phân quyền theo role với Spring Security; thiết kế API sạch (status code, error shape, phân trang); LÕI CHO MƯỢN an toàn khi tranh chấp (UNIQUE constraint + @Version optimistic locking + transaction) để một bản sách không bao giờ bị mượn hai lần; cờ quá hạn (overdue) tính từ hạn trả và hàng đợi đặt trước FIFO; React (Vite) SPA: routing, auth context, gọi API bằng axios interceptor, màn hình mượn/trả/đặt trước; kiểm thử unit + integration (JUnit 5, MockMvc) và một test đồng thời chứng minh chống mượn trùng; đóng gói Docker Compose (api + web + db) + biến môi trường; và một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học PRO192 (Java/OOP), DBI202 (CSDL/SQL), PRJ301 (Java web/MVC) và FER202 (React). Cần: JDK 17, một IDE (IntelliJ IDEA khuyên dùng), Node.js LTS, Docker Desktop, một client test API (Postman hoặc REST Client trong VS Code) và một tài khoản GitHub cho nhóm.',
    documentsNote: 'Tham chiếu: Spring Boot Reference Documentation (docs.spring.io) • Spring Data JPA Reference • Spring Security Reference • React docs (react.dev) • PostgreSQL Documentation • jwt.io. Công cụ: IntelliJ IDEA + VS Code, Postman, DBeaver/pgAdmin, Docker Desktop, draw.io (ERD). Luyện code: track Code Lab Spring Boot + React + SQL + Authentication. Git & Docker: Exp Hub. Đây là project-course thực tập — vừa xây vừa quay video theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc client–server, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int602-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một web quản lý thư viện thật, kiến trúc client–server, và bản đồ vòng đời từ ERD tới Docker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — Library Management System</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, deployable web application: a <strong>library management system</strong> where a member browses the catalog and reserves a book, and a librarian lends out a physical copy and takes it back — and the system <strong>refuses to lend the same copy to two members at once</strong> even under two simultaneous clicks. By the end you have a running full-stack app, tested and shipped in Docker, plus a recorded demo.</p>
<p>Every web project that manages a <em>limited physical resource</em> is a variation of this skeleton: an authenticated <strong>REST API</strong> over a relational database, a <strong>Single-Page App</strong> that consumes it, and one <strong>transactional core</strong> that must stay correct under concurrency. Master this one and the others are re-skins.</p>

<h3>The system in one picture — client / server / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">React SPA (browser)</div><div class="lz-d">Vite · axios · UI mượn/trả/đặt trước</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Spring Boot REST API</div><div class="lz-d">Controller→Service→Repository · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · books · book_copies · loans · reservations</div></div>
</div>
<div class="diagram">Browser  ──HTTP/JSON──▶  Spring Boot API  ──JDBC/JPA──▶  PostgreSQL
  React            (port 8080)                      (port 5432)
  (port 5173)   Authorization: Bearer &lt;JWT&gt;      UNIQUE(copy_id)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design</div><div class="lz-nsub">Roles &amp; use cases · ERD · schema · the UNIQUE that prevents double-lending</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Spring Boot project &amp; layers</div><div class="lz-nsub">Entities · repositories · services · controllers · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">Register/login · Spring Security · Member vs Librarian</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The lending core</div><div class="lz-nsub">Issue a copy · block double-lending · optimistic locking · returns · overdue · reservation queue</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">React SPA</div><div class="lz-nsub">Routing · auth context · axios interceptor · issue &amp; catalog screens</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">JUnit · MockMvc · a concurrency test that proves no double-lending</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose: api + web + db · env config · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Pessimistic locking · overdue job · reservation fulfilment · CI</div><div class="lz-nsub">Ship like a real engineering team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — login → see a book's copies → lend one → it appears on loan — then grow it. A tiny end-to-end flow that runs beats a huge design that never compiles.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-310" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Practice Spring Boot on Code Lab</span><span class="lc-sub">Warm up REST controllers, JPA and services before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — Hệ thống quản lý thư viện</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một ứng dụng web thật, triển khai được: <strong>hệ thống quản lý thư viện</strong>, nơi thành viên duyệt danh mục và đặt trước một cuốn sách, còn thủ thư cho mượn một bản sách vật lý rồi nhận lại — và hệ thống <strong>từ chối cho hai thành viên mượn cùng một bản sách</strong> kể cả khi hai người bấm cùng lúc. Kết thúc, bạn có một app full-stack chạy được, đã test và đóng gói Docker, kèm một video demo.</p>
<p>Mọi đồ án web quản lý một <em>tài nguyên vật lý có hạn</em> đều là biến thể của bộ khung này: một <strong>REST API</strong> có xác thực trên CSDL quan hệ, một <strong>Single-Page App</strong> tiêu thụ nó, và một <strong>lõi giao dịch</strong> phải luôn đúng khi tranh chấp. Làm chủ cái này thì các đồ án khác chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — client / server / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">React SPA (trình duyệt)</div><div class="lz-d">Vite · axios · UI mượn/trả/đặt trước</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Spring Boot REST API</div><div class="lz-d">Controller→Service→Repository · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · books · book_copies · loans · reservations</div></div>
</div>
<div class="diagram">Trình duyệt ──HTTP/JSON──▶  Spring Boot API  ──JDBC/JPA──▶  PostgreSQL
  React            (cổng 8080)                      (cổng 5432)
  (cổng 5173)   Authorization: Bearer &lt;JWT&gt;      UNIQUE(copy_id)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL</div><div class="lz-nsub">Vai trò &amp; use case · ERD · schema · ràng buộc UNIQUE chống mượn trùng</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Dự án Spring Boot &amp; các lớp</div><div class="lz-nsub">Entity · repository · service · controller · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (JWT)</div><div class="lz-nsub">Đăng ký/đăng nhập · Spring Security · Thành viên vs Thủ thư</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lõi cho mượn</div><div class="lz-nsub">Cho mượn một bản sách · chặn mượn trùng · optimistic locking · trả · quá hạn · hàng đợi đặt trước</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">React SPA</div><div class="lz-nsub">Routing · auth context · axios interceptor · màn hình cho mượn &amp; danh mục</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">JUnit · MockMvc · một test đồng thời chứng minh không mượn trùng</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose: api + web + db · cấu hình env · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Pessimistic locking · job quá hạn · hoàn tất đặt trước · CI</div><div class="lz-nsub">Ship như một đội kỹ sư thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — đăng nhập → thấy các bản sách của một cuốn → cho mượn một bản → nó hiện là đang mượn — rồi mới mở rộng. Một luồng nhỏ chạy được từ đầu đến cuối hơn hẳn một bản thiết kế đồ sộ không bao giờ biên dịch.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-310" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Luyện Spring Boot trên Code Lab</span><span class="lc-sub">Khởi động REST controller, JPA và service trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int602-pham-vi',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Đúng phạm vi để làm xong: 2 vai trò, luồng lõi, và bảng tiêu chí nghiệm thu bạn tự chấm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Scope, roles &amp; acceptance criteria</h2>
<p class="lead">The fastest way to fail an internship project is to build too much and finish nothing. Lock the scope now: <strong>two roles, one transactional core, a handful of screens</strong>. Everything else is optional polish.</p>

<h3>Two roles — that is enough for real access control</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">MEMBER</span><span class="v">Register/login · browse the catalog &amp; a book's available copies · reserve a book when none are free · view / return own loans</span></div>
  <div class="kv"><span class="k">LIBRARIAN</span><span class="v">Login · issue a copy to a member · take a copy back (return) · manage the overdue list · open/close reservations</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">LIBRARIAN issues an AVAILABLE copy ──▶ POST /loans ──▶ copy becomes ON_LOAN
        │                                                       │
        │ second desk issues the SAME copy ──▶ 409 Conflict ────┘  (blocked)
        ▼
MEMBER returns the copy ──▶ loan RETURNED ──▶ copy AVAILABLE ──▶ promote next reservation</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A member can register, log in, and receive a JWT</td><td>POST /auth/register then /auth/login returns a token</td></tr>
<tr><td>2</td><td>A member sees a book and only its AVAILABLE copies</td><td>GET /books/{id}/copies?status=AVAILABLE</td></tr>
<tr><td>3</td><td>Issuing an available copy creates an ACTIVE loan and marks the copy ON_LOAN</td><td>POST /loans → 201 + copy flips</td></tr>
<tr><td>4</td><td><b>Double-lending one copy is impossible</b></td><td>two concurrent POSTs for one copy → exactly one 201, one 409</td></tr>
<tr><td>5</td><td>Only a LIBRARIAN can issue a loan</td><td>MEMBER calling the issue endpoint → 403</td></tr>
<tr><td>6</td><td>A member can reserve a book only when no copies are free; a return promotes the next reservation</td><td>reserve → WAITING; return → next becomes READY</td></tr>
<tr><td>7</td><td>The whole system runs from one <code>docker compose up</code></td><td>web on :5173, api on :8080, db healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> Real SMS/email overdue notices, fines &amp; online payment, barcode-scanner hardware, an AI book-recommendation engine as a core feature. Simulate a notice with a log line or a mock. Depth on the lending core scores; breadth with nothing finished does not.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 6). "Definition of Done = the tests are green" removes every argument about whether a feature works. <em>Why beyond syllabus: turning a checklist into executable specs is exactly how professional teams gate a release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một lõi giao dịch, vài màn hình</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">THÀNH VIÊN</span><span class="v">Đăng ký/đăng nhập · duyệt danh mục &amp; các bản sách còn trống của một cuốn · đặt trước khi hết bản trống · xem / trả lượt mượn của mình</span></div>
  <div class="kv"><span class="k">THỦ THƯ</span><span class="v">Đăng nhập · cho một thành viên mượn một bản sách · nhận lại (trả) · quản lý danh sách quá hạn · mở/đóng đặt trước</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">THỦ THƯ cho mượn một bản TRỐNG ──▶ POST /loans ──▶ bản thành ON_LOAN
        │                                                       │
        │ quầy thứ 2 cho mượn ĐÚNG bản đó ──▶ 409 Conflict ─────┘  (bị chặn)
        ▼
THÀNH VIÊN trả bản sách ──▶ lượt mượn RETURNED ──▶ bản AVAILABLE ──▶ đẩy đặt trước kế tiếp</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Thành viên đăng ký, đăng nhập, nhận JWT</td><td>POST /auth/register rồi /auth/login trả token</td></tr>
<tr><td>2</td><td>Thành viên chỉ thấy các bản TRỐNG của một cuốn</td><td>GET /books/{id}/copies?status=AVAILABLE</td></tr>
<tr><td>3</td><td>Cho mượn một bản trống tạo lượt mượn ACTIVE và đánh dấu bản ON_LOAN</td><td>POST /loans → 201 + bản đổi trạng thái</td></tr>
<tr><td>4</td><td><b>Không thể cho mượn một bản hai lần</b></td><td>hai POST đồng thời cho một bản → đúng một 201, một 409</td></tr>
<tr><td>5</td><td>Chỉ THỦ THƯ được cho mượn</td><td>THÀNH VIÊN gọi endpoint cho mượn → 403</td></tr>
<tr><td>6</td><td>Thành viên chỉ đặt trước được khi hết bản trống; một lượt trả đẩy đặt trước kế tiếp</td><td>đặt trước → WAITING; trả → cái kế thành READY</td></tr>
<tr><td>7</td><td>Cả hệ chạy từ một lệnh <code>docker compose up</code></td><td>web ở :5173, api ở :8080, db healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Nhắc quá hạn SMS/email thật, phí phạt &amp; thanh toán online, phần cứng máy quét barcode, "AI gợi ý sách" làm tính năng lõi. Hãy giả lập thông báo bằng một dòng log hoặc mock. Sâu ở lõi cho mượn mới ăn điểm; ôm rộng mà chẳng xong thì không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 6). "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc một tính năng có chạy hay không. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int602-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Spring Boot + React + PostgreSQL — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Every choice below is picked because it is <strong>what you already learned</strong> (PRJ301, DBI202, FER202) and because it is the mainstream industry combo for a Java internship.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Frontend — React 18 + Vite</b><br/>A Single-Page App. Vite gives instant dev server + fast build. axios for HTTP, React Router for pages, Context for auth state. <em>Why: FER202 taught this; it is the most-hired frontend skill.</em></div>
  <div class="lz-layer"><b>Backend — Spring Boot 3 (Java 17)</b><br/>REST API with the layered pattern from PRJ301, now as JSON endpoints instead of JSP. Spring Web + Spring Data JPA + Spring Security + Bean Validation. <em>Why: the dominant Java enterprise framework; auto-config removes boilerplate.</em></div>
  <div class="lz-layer"><b>Persistence — Spring Data JPA / Hibernate</b><br/>Map Java entities to tables; write queries as methods. <em>Why: less JDBC boilerplate than PRJ301's raw DAO, but the same SQL underneath — and it gives you <code>@Version</code> optimistic locking for free.</em></div>
  <div class="lz-layer"><b>Database — PostgreSQL 16</b><br/>A real, free, ACID relational database. <em>Why: transactions and UNIQUE constraints are what make double-lending impossible; Postgres is the industry default.</em></div>
  <div class="lz-layer"><b>Ship — Docker Compose</b><br/>Three containers (web, api, db) started by one command. <em>Why: "runs on my machine" becomes "runs anywhere"; graders love a one-command demo.</em></div>
</div>

<h3>The request journey — how a click becomes a row</h3>
<div class="diagram">Click "Issue"  →  axios POST /api/loans  (JWT in header)
   →  Spring Security filter validates JWT + LIBRARIAN role
   →  LoanController.issue(dto)
   →  LoanService.issue()   @Transactional
   →  BookCopyRepository.save()  +  LoanRepository.save()
   →  Hibernate INSERT ... ; UPDATE book_copies SET status='ON_LOAN'
   →  PostgreSQL commits (or 409 if the UNIQUE fires)
   →  201 Created  →  React shows "On loan!"</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A stack is a set of trade-offs, not a fashion.</b> You could swap Spring Boot for Node/Express, or Postgres for MySQL, and the architecture would be identical — the same three layers, the same UNIQUE constraint. Reviewers respect a student who can say "I chose X over Y because…". <em>Why beyond syllabus: the syllabus teaches one stack; real engineering is choosing among many for reasons.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-367" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Brush up React on Code Lab</span><span class="lc-sub">Components, hooks and data fetching — the frontend half of this project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì đó là <strong>thứ bạn đã học</strong> (PRJ301, DBI202, FER202) và là bộ combo chủ đạo của ngành cho một kỳ thực tập Java.</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Frontend — React 18 + Vite</b><br/>Một Single-Page App. Vite cho dev server tức thì + build nhanh. axios cho HTTP, React Router cho trang, Context cho trạng thái đăng nhập. <em>Vì sao: FER202 đã dạy; là kỹ năng frontend được tuyển nhiều nhất.</em></div>
  <div class="lz-layer"><b>Backend — Spring Boot 3 (Java 17)</b><br/>REST API theo mẫu phân lớp của PRJ301, nay là endpoint JSON thay vì JSP. Spring Web + Spring Data JPA + Spring Security + Bean Validation. <em>Vì sao: framework Java doanh nghiệp thống trị; auto-config bỏ hết boilerplate.</em></div>
  <div class="lz-layer"><b>Lưu trữ — Spring Data JPA / Hibernate</b><br/>Ánh xạ entity Java sang bảng; viết truy vấn thành method. <em>Vì sao: ít JDBC lặp lại hơn DAO thô của PRJ301, nhưng SQL bên dưới vẫn thế — và cho bạn <code>@Version</code> optimistic locking miễn phí.</em></div>
  <div class="lz-layer"><b>CSDL — PostgreSQL 16</b><br/>Một CSDL quan hệ thật, miễn phí, ACID. <em>Vì sao: transaction và ràng buộc UNIQUE chính là thứ khiến việc mượn trùng không thể xảy ra; Postgres là mặc định của ngành.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker Compose</b><br/>Ba container (web, api, db) khởi động bằng một lệnh. <em>Vì sao: "chạy trên máy tôi" thành "chạy ở mọi nơi"; giám khảo thích demo một lệnh.</em></div>
</div>

<h3>Hành trình một request — một cú click thành một dòng dữ liệu</h3>
<div class="diagram">Bấm "Cho mượn"  →  axios POST /api/loans  (JWT trong header)
   →  Spring Security filter kiểm JWT + vai trò LIBRARIAN
   →  LoanController.issue(dto)
   →  LoanService.issue()   @Transactional
   →  BookCopyRepository.save()  +  LoanRepository.save()
   →  Hibernate INSERT ... ; UPDATE book_copies SET status='ON_LOAN'
   →  PostgreSQL commit (hoặc 409 nếu UNIQUE kích hoạt)
   →  201 Created  →  React hiện "Đã cho mượn!"</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một stack là tập hợp các đánh đổi, không phải mốt thời trang.</b> Bạn có thể thay Spring Boot bằng Node/Express, hay Postgres bằng MySQL, và kiến trúc vẫn y hệt — cùng ba lớp, cùng ràng buộc UNIQUE. Hội đồng nể một sinh viên biết nói "tôi chọn X thay vì Y vì…". <em>Vì sao ngoài syllabus: giáo trình dạy một stack; kỹ nghệ thật là chọn giữa nhiều lựa chọn có lý do.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-367" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Ôn React trên Code Lab</span><span class="lc-sub">Component, hook và fetch dữ liệu — nửa frontend của đồ án này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int602-cai-dat',
          type: 'VIDEO',
          description: 'JDK 17, IntelliJ, Node.js, Docker, Postman — cài một lần, dùng cả đồ án. Hướng dẫn chi tiết ở Exp Hub.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your environment</h2>
<p class="lead">Install everything once, before you write a line of code. Verify each tool from the terminal so you never lose an afternoon to a missing JDK.</p>

<h3>The checklist</h3>
<table>
<thead><tr><th>Tool</th><th>Why</th><th>Verify command</th></tr></thead>
<tbody>
<tr><td>JDK 17 (Temurin)</td><td>compile &amp; run Spring Boot</td><td><code>java -version</code> → 17.x</td></tr>
<tr><td>IntelliJ IDEA (Community)</td><td>the backend IDE</td><td>opens a Maven project</td></tr>
<tr><td>Node.js LTS + npm</td><td>build &amp; run the React app</td><td><code>node -v</code> → 20.x</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + one-command ship</td><td><code>docker --version</code></td></tr>
<tr><td>Postman / REST Client</td><td>test the API without the UI</td><td>send a GET</td></tr>
<tr><td>Git + a GitHub repo</td><td>team workflow</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Fastest Postgres:</strong> don't install it — run it in Docker. <code>docker run --name library-db -e POSTGRES_PASSWORD=library -e POSTGRES_DB=library -p 5432:5432 -d postgres:16</code>. One command, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int602-cai-dat-moi-truong?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">JDK 17, IntelliJ, Node.js, Docker Desktop, Postman — official links and a verify checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> mixing JDK versions. Spring Boot 3 needs Java 17+. If <code>java -version</code> shows 8 or 11, point <code>JAVA_HOME</code> at your 17 install and set the Project SDK to 17 in IntelliJ — otherwise you get a cryptic <code>UnsupportedClassVersionError</code>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt môi trường</h2>
<p class="lead">Cài hết một lần, trước khi viết một dòng code. Kiểm từng công cụ từ terminal để không mất cả buổi chiều vì thiếu JDK.</p>

<h3>Danh sách cần cài</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Lệnh kiểm</th></tr></thead>
<tbody>
<tr><td>JDK 17 (Temurin)</td><td>biên dịch &amp; chạy Spring Boot</td><td><code>java -version</code> → 17.x</td></tr>
<tr><td>IntelliJ IDEA (Community)</td><td>IDE backend</td><td>mở được dự án Maven</td></tr>
<tr><td>Node.js LTS + npm</td><td>build &amp; chạy app React</td><td><code>node -v</code> → 20.x</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + ship một lệnh</td><td><code>docker --version</code></td></tr>
<tr><td>Postman / REST Client</td><td>test API không cần UI</td><td>gửi một GET</td></tr>
<tr><td>Git + một repo GitHub</td><td>quy trình nhóm</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Postgres nhanh nhất:</strong> đừng cài — chạy trong Docker. <code>docker run --name library-db -e POSTGRES_PASSWORD=library -e POSTGRES_DB=library -p 5432:5432 -d postgres:16</code>. Một lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int602-cai-dat-moi-truong?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">JDK 17, IntelliJ, Node.js, Docker Desktop, Postman — link chính chủ và checklist kiểm trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> lẫn lộn phiên bản JDK. Spring Boot 3 cần Java 17+. Nếu <code>java -version</code> hiện 8 hay 11, trỏ <code>JAVA_HOME</code> vào bản 17 và đặt Project SDK = 17 trong IntelliJ — nếu không sẽ gặp lỗi khó hiểu <code>UnsupportedClassVersionError</code>.</div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int602-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng lõi, "khoảnh khắc chống mượn trùng", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the one thing that is hard: <strong>the double-lending is blocked live, on camera</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is a library system. Two roles, and one copy can never be lent to two members at once. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Member flow (2m)</div><div class="lz-nsub">Register → login (show the JWT in DevTools) → search the catalog → open a book → see its AVAILABLE copies. When all are on loan, reserve it → "you are #1 in the queue".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — The money shot (1.5m)</div><div class="lz-nsub">Two librarian windows, same copy, click "Issue" at the same time. One succeeds, one gets a clear "copy already on loan" error. Then run the concurrency test in the terminal — green.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Librarian flow (1.5m)</div><div class="lz-nsub">Log in as librarian → return a copy → the copy flips AVAILABLE and the waiting reservation becomes READY. Open the overdue list. Show a member being blocked (403) from the issue endpoint.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Under the hood (1.5m)</div><div class="lz-nsub">One command: <code>docker compose up</code>. Show the ERD, the UNIQUE constraint, the <code>@Version</code> field. Explain in one sentence why double-lending is impossible.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Close (30s)</div><div class="lz-nsub">"Stack: Spring Boot, React, PostgreSQL, Docker. Repo link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (never demo on an empty DB). Increase your editor/browser font size. Do one dry run. Record in 1080p. Keep mouse movements slow. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The demo is a product, not an afterthought.</b> Interviewers watch the first 60 seconds and the "hard part". Lead with the architecture and end with the concurrency proof — that ordering signals engineering maturity far more than a tour of every CRUD screen. <em>Why beyond syllabus: communication of your work is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD and a schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng thứ khó: <strong>việc mượn trùng bị chặn ngay trên video</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là hệ thống thư viện. Hai vai trò, và một bản sách không bao giờ được cho hai thành viên mượn cùng lúc. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng thành viên (2m)</div><div class="lz-nsub">Đăng ký → đăng nhập (chỉ JWT trong DevTools) → tìm trong danh mục → mở một cuốn → thấy các bản TRỐNG. Khi hết bản trống, đặt trước → "bạn đứng thứ 1 trong hàng đợi".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — Cảnh đắt giá (1.5m)</div><div class="lz-nsub">Hai cửa sổ thủ thư, cùng một bản, bấm "Cho mượn" cùng lúc. Một thành công, một nhận lỗi rõ "bản đã đang được mượn". Rồi chạy test đồng thời trong terminal — xanh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Luồng thủ thư (1.5m)</div><div class="lz-nsub">Đăng nhập thủ thư → trả một bản → bản đổi AVAILABLE và đặt trước đang chờ thành READY. Mở danh sách quá hạn. Cho thấy thành viên bị chặn (403) khỏi endpoint cho mượn.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Bên trong (1.5m)</div><div class="lz-nsub">Một lệnh: <code>docker compose up</code>. Chiếu ERD, ràng buộc UNIQUE, trường <code>@Version</code>. Giải thích một câu vì sao không thể mượn trùng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Kết (30s)</div><div class="lz-nsub">"Stack: Spring Boot, React, PostgreSQL, Docker. Link repo trên màn hình. Cảm ơn." Chạy URL GitHub.</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed dữ liệu demo trước (đừng bao giờ demo trên DB rỗng). Tăng cỡ chữ editor/trình duyệt. Quay thử một lần. Quay 1080p. Di chuột chậm. Nếu hỏng, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Demo là một sản phẩm, không phải thứ làm cho có.</b> Nhà tuyển dụng xem 60 giây đầu và "phần khó". Mở bằng kiến trúc và kết bằng bằng chứng chống tranh chấp — thứ tự đó thể hiện sự trưởng thành kỹ thuật hơn nhiều so với đi tua từng màn CRUD. <em>Vì sao ngoài syllabus: khả năng trình bày công việc bị chấm ngầm ở khắp sự nghiệp, nhưng hiếm khi được dạy rõ.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến hai vai trò thành ERD và schema.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design|||Mục 1 — Thiết kế domain & CSDL',
      description: 'Biến hai vai trò thành use case, ERD và một schema chuẩn hoá — với ràng buộc UNIQUE là trái tim chống mượn trùng.',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int602-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, Book, BookCopy, Loan, Reservation và quan hệ giữa chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"A <b>librarian</b> lends a <b>copy</b> of a <b>book</b> to a <b>member</b>, creating a <b>loan</b>; when no copy is free a member makes a <b>reservation</b>." The nouns give us four core entities plus the account:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (MEMBER or LIBRARIAN), email, password hash. Both roles are Users; role decides permissions.</div>
  <div class="lz-layer"><b>Book</b> — a title: <code>title</code>, <code>author</code>, <code>isbn</code>, <code>category</code>. A book <em>has many</em> physical copies. This is the catalog entry you browse and reserve.</div>
  <div class="lz-layer"><b>BookCopy</b> — one physical, barcoded copy of a book: <code>book_id</code>, <code>barcode</code>, <code>status</code> (AVAILABLE / ON_LOAN / LOST). This is the resource that must never be lent to two members at once.</div>
  <div class="lz-layer"><b>Loan</b> — the borrowing itself: which <code>member</code> borrowed which <code>copy</code>, <code>borrowed_at</code>, <code>due_date</code>, <code>returned_at</code> (null while active), <code>status</code> (ACTIVE / RETURNED).</div>
  <div class="lz-layer"><b>Reservation</b> — a member's place in the queue for a <em>book</em> (not a copy) when all its copies are out: <code>book_id</code>, <code>member_id</code>, <code>created_at</code>, <code>status</code> (WAITING / READY / FULFILLED / CANCELLED).</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌────────┐1────*┌────────────┐1────1┌────────┐
│  Book  │      │  BookCopy  │      │  Loan  │
└────────┘      └────────────┘      └────────┘
    │1                                   *│
    │*                                    │1
┌──────────────┐                    ┌────────┐
│ Reservation  │*──────────────────1│  User  │ (role = MEMBER)
└──────────────┘                    └────────┘

Book     1—* BookCopy    : a book has many physical copies
BookCopy 1—1 Loan        : a copy holds at most ONE active loan  ← the rule
User     1—* Loan        : a member has many loans over time
Book     1—* Reservation : a book has a queue of reservations
User     1—* Reservation : a member can reserve many books</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> "Clean Code" has 2 physical copies. Copy #C1 and #C2 are both AVAILABLE. Member An borrows one.
<b>Step 1 —</b> Librarian issues copy #C1 to An → POST /loans { copyId: C1, memberId: An }.
<b>Step 2 —</b> The system creates a Loan row: member=An, copy=C1, status=ACTIVE, due in 14 days.
<b>Step 3 —</b> Copy #C1 flips status AVAILABLE → ON_LOAN.
<b>Step 4 —</b> Member Binh now asks for available copies of "Clean Code" → gets only #C2.
<b>Step 5 —</b> Binh borrows #C2 too. Now both are ON_LOAN → Chi reserves the book → Reservation WAITING, position 1.
<b>Result:</b> the 1—1 between BookCopy and active Loan is what makes #C1 disappear for Binh; the Reservation queue absorbs demand once every copy is out.</div>

<div class="pitfall"><strong>Design trap:</strong> modelling a loan against the <code>Book</code> instead of the <code>BookCopy</code>. Then you cannot tell which physical item a member is holding, cannot have two copies of the same title out at once, and cannot track a single copy going LOST. Always lend the <em>copy</em>, reserve the <em>book</em>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"At most one ACTIVE loan per copy" is a state constraint, not just a foreign key.</b> A copy can have many loan rows over time (borrowed, returned, borrowed again) — the invariant is only one <em>non-returned</em> loan at a time. In 1.2 we enforce the simple version with a UNIQUE on <code>copy_id</code>; the richer version uses a partial unique index on active loans only. <em>Why beyond syllabus: distinguishing "unique row" from "unique active state" is a modelling skill most juniors miss.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-412" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice schema design on Code Lab</span><span class="lc-sub">DDL, foreign keys and normalisation — the SQL under your JPA entities.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>thủ thư</b> cho một <b>thành viên</b> mượn một <b>bản sách</b> của một <b>cuốn sách</b>, tạo ra một <b>lượt mượn</b>; khi hết bản trống, thành viên tạo một <b>lượt đặt trước</b>." Các danh từ cho ta bốn thực thể lõi cộng với tài khoản:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (MEMBER hoặc LIBRARIAN), email, hash mật khẩu. Cả hai vai trò đều là User; role quyết định quyền.</div>
  <div class="lz-layer"><b>Book</b> — một đầu sách: <code>title</code>, <code>author</code>, <code>isbn</code>, <code>category</code>. Một cuốn sách <em>có nhiều</em> bản vật lý. Đây là mục danh mục bạn duyệt và đặt trước.</div>
  <div class="lz-layer"><b>BookCopy</b> — một bản sách vật lý có barcode: <code>book_id</code>, <code>barcode</code>, <code>status</code> (AVAILABLE / ON_LOAN / LOST). Đây là tài nguyên không được cho hai thành viên mượn cùng lúc.</div>
  <div class="lz-layer"><b>Loan</b> — chính lượt mượn: <code>member</code> nào mượn <code>copy</code> nào, <code>borrowed_at</code>, <code>due_date</code>, <code>returned_at</code> (null khi còn mượn), <code>status</code> (ACTIVE / RETURNED).</div>
  <div class="lz-layer"><b>Reservation</b> — chỗ của thành viên trong hàng đợi cho một <em>cuốn sách</em> (không phải một bản) khi mọi bản đều đã cho mượn: <code>book_id</code>, <code>member_id</code>, <code>created_at</code>, <code>status</code> (WAITING / READY / FULFILLED / CANCELLED).</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌────────┐1────*┌────────────┐1────1┌────────┐
│  Book  │      │  BookCopy  │      │  Loan  │
└────────┘      └────────────┘      └────────┘
    │1                                   *│
    │*                                    │1
┌──────────────┐                    ┌────────┐
│ Reservation  │*──────────────────1│  User  │ (role = MEMBER)
└──────────────┘                    └────────┘

Book     1—* BookCopy    : một cuốn có nhiều bản vật lý
BookCopy 1—1 Loan        : một bản giữ TỐI ĐA MỘT lượt mượn đang hoạt động  ← quy tắc
User     1—* Loan        : một thành viên có nhiều lượt mượn theo thời gian
Book     1—* Reservation : một cuốn có một hàng đợi đặt trước
User     1—* Reservation : một thành viên có thể đặt trước nhiều cuốn</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> "Clean Code" có 2 bản vật lý. Bản #C1 và #C2 đều AVAILABLE. Thành viên An mượn một bản.
<b>Bước 1 —</b> Thủ thư cho An mượn bản #C1 → POST /loans { copyId: C1, memberId: An }.
<b>Bước 2 —</b> Hệ thống tạo một dòng Loan: member=An, copy=C1, status=ACTIVE, hạn 14 ngày.
<b>Bước 3 —</b> Bản #C1 đổi status AVAILABLE → ON_LOAN.
<b>Bước 4 —</b> Thành viên Bình giờ hỏi các bản trống của "Clean Code" → chỉ còn #C2.
<b>Bước 5 —</b> Bình mượn luôn #C2. Giờ cả hai đều ON_LOAN → Chi đặt trước cuốn này → Reservation WAITING, vị trí 1.
<b>Kết quả:</b> quan hệ 1—1 giữa BookCopy và Loan đang hoạt động chính là thứ khiến #C1 biến mất với Bình; hàng đợi Reservation hấp thụ nhu cầu khi mọi bản đã ra ngoài.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> mô hình lượt mượn gắn với <code>Book</code> thay vì <code>BookCopy</code>. Khi đó bạn không biết thành viên đang giữ bản vật lý nào, không thể cho mượn hai bản của cùng một đầu sách cùng lúc, và không theo dõi được một bản bị MẤT. Luôn cho mượn <em>bản sách</em>, đặt trước <em>cuốn sách</em>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Tối đa một lượt mượn ĐANG HOẠT ĐỘNG mỗi bản" là ràng buộc trạng thái, không chỉ là khoá ngoại.</b> Một bản có thể có nhiều dòng loan theo thời gian (mượn, trả, rồi mượn lại) — bất biến là chỉ một cái <em>chưa trả</em> tại một thời điểm. Ở 1.2 ta thực thi phiên bản đơn giản bằng UNIQUE trên <code>copy_id</code>; phiên bản đầy đủ dùng partial unique index chỉ trên các lượt đang mượn. <em>Vì sao ngoài syllabus: phân biệt "dòng duy nhất" với "trạng thái hoạt động duy nhất" là kỹ năng mô hình hoá đa số junior bỏ sót.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-412" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Luyện thiết kế schema trên Code Lab</span><span class="lc-sub">DDL, khoá ngoại và chuẩn hoá — phần SQL nằm dưới các JPA entity của bạn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The schema & the constraint that prevents double-lending|||1.2 — Schema & ràng buộc chống mượn trùng',
          slug: 'int602-schema',
          type: 'VIDEO',
          description: 'DDL PostgreSQL đầy đủ + ràng buộc UNIQUE trên copy_id: hàng rào cuối cùng chống mượn trùng, do CSDL bảo đảm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The schema &amp; the constraint that prevents double-lending</h2>
<p class="lead">Here is the whole database. Notice one line — the <code>UNIQUE</code> on <code>loans.copy_id</code>. That single constraint is your <strong>last line of defence</strong>: even if two requests slip past every check in your Java code, the database itself refuses to write two active loans for one copy.</p>

<h3>The DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- bcrypt hash</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- MEMBER | LIBRARIAN</span>
);

<span class="tok-keyword">CREATE TABLE</span> books (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  title       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  author      <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  isbn        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">UNIQUE NOT NULL</span>,
  category    <span class="tok-type">VARCHAR</span>(100)
);

<span class="tok-keyword">CREATE TABLE</span> book_copies (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  book_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> books(id),
  barcode     <span class="tok-type">VARCHAR</span>(40) <span class="tok-keyword">UNIQUE NOT NULL</span>,          <span class="tok-comment">-- physical inventory tag</span>
  status      <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'AVAILABLE'</span>, <span class="tok-comment">-- AVAILABLE | ON_LOAN | LOST</span>
  version     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-number">0</span>          <span class="tok-comment">-- optimistic lock (Section 4)</span>
);

<span class="tok-keyword">CREATE TABLE</span> loans (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  copy_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> book_copies(id),
  member_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  borrowed_at <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  due_date    <span class="tok-type">DATE</span> <span class="tok-keyword">NOT NULL</span>,
  returned_at <span class="tok-type">TIMESTAMP</span>,                            <span class="tok-comment">-- NULL while active</span>
  status      <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'ACTIVE'</span>,  <span class="tok-comment">-- ACTIVE | RETURNED</span>
  <span class="tok-keyword">CONSTRAINT</span> uq_active_copy <span class="tok-keyword">UNIQUE</span> (copy_id)     <span class="tok-comment">-- ★ one active loan per copy</span>
);

<span class="tok-keyword">CREATE TABLE</span> reservations (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  book_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> books(id),
  member_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),  <span class="tok-comment">-- FIFO order in the queue</span>
  status      <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'WAITING'</span> <span class="tok-comment">-- WAITING|READY|FULFILLED|CANCELLED</span>
);</pre>

<h3>Worked example — why the UNIQUE is the real guard</h3>
<div class="out"><b>Scenario:</b> two INSERTs for copy_id = 7 arrive at the same millisecond (two desks scan the same barcode).
<b>Step 1 —</b> Transaction A: INSERT loan (copy_id=7) → row locked, not yet committed.
<b>Step 2 —</b> Transaction B: INSERT loan (copy_id=7) → PostgreSQL sees the pending unique key → <b>B waits</b>.
<b>Step 3 —</b> A commits. The unique key (copy_id=7) now exists.
<b>Step 4 —</b> B is released → its INSERT violates <code>uq_active_copy</code> → <b>ERROR: duplicate key value violates unique constraint</b>.
<b>Result:</b> exactly one loan exists. Your Java code will catch this exception and return <b>409 Conflict</b>. The database, not your <code>if</code>-statement, is what guarantees correctness.</div>

<div class="pitfall"><strong>Trap:</strong> relying only on a Java check like <code>if (copy.getStatus() == AVAILABLE)</code>. Between your read and your write, another request can read the same AVAILABLE status — the classic <em>race condition</em>. The Java check is a fast path for the common case; the UNIQUE constraint is the guarantee. You need both. Section 4 shows the full defence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The richer rule with a partial index.</b> A plain <code>UNIQUE(copy_id)</code> forbids a copy from ever being loaned twice — even after the first loan is returned. To allow re-lending while still forbidding two <em>active</em> loans, drop the plain UNIQUE and use:
<pre><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_loan
  <span class="tok-keyword">ON</span> loans (copy_id)
  <span class="tok-keyword">WHERE</span> returned_at <span class="tok-keyword">IS NULL</span>;</pre>
Now a copy can have many RETURNED rows plus at most one active (returned_at IS NULL) row. <em>Why beyond syllabus: partial (filtered) indexes are a Postgres power feature that models "unique among active rows" — exactly the state constraint from 1.1.</em></div>

<div class="note-ct">In Spring Data JPA (Section 2) you won't write this DDL by hand — you annotate entities and Hibernate generates it. But knowing the SQL underneath is what lets you debug when generation surprises you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Schema &amp; ràng buộc chống mượn trùng</h2>
<p class="lead">Đây là toàn bộ CSDL. Chú ý một dòng — <code>UNIQUE</code> trên <code>loans.copy_id</code>. Ràng buộc đơn lẻ đó là <strong>hàng rào cuối cùng</strong>: kể cả khi hai request lọt qua mọi kiểm tra trong code Java, chính CSDL từ chối ghi hai lượt mượn hoạt động cho một bản.</p>

<h3>DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- hash bcrypt</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- MEMBER | LIBRARIAN</span>
);

<span class="tok-keyword">CREATE TABLE</span> books (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  title       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  author      <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  isbn        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">UNIQUE NOT NULL</span>,
  category    <span class="tok-type">VARCHAR</span>(100)
);

<span class="tok-keyword">CREATE TABLE</span> book_copies (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  book_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> books(id),
  barcode     <span class="tok-type">VARCHAR</span>(40) <span class="tok-keyword">UNIQUE NOT NULL</span>,          <span class="tok-comment">-- thẻ kho vật lý</span>
  status      <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'AVAILABLE'</span>, <span class="tok-comment">-- AVAILABLE | ON_LOAN | LOST</span>
  version     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-number">0</span>          <span class="tok-comment">-- optimistic lock (Mục 4)</span>
);

<span class="tok-keyword">CREATE TABLE</span> loans (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  copy_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> book_copies(id),
  member_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  borrowed_at <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  due_date    <span class="tok-type">DATE</span> <span class="tok-keyword">NOT NULL</span>,
  returned_at <span class="tok-type">TIMESTAMP</span>,                            <span class="tok-comment">-- NULL khi còn mượn</span>
  status      <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'ACTIVE'</span>,  <span class="tok-comment">-- ACTIVE | RETURNED</span>
  <span class="tok-keyword">CONSTRAINT</span> uq_active_copy <span class="tok-keyword">UNIQUE</span> (copy_id)     <span class="tok-comment">-- ★ một lượt mượn mỗi bản</span>
);

<span class="tok-keyword">CREATE TABLE</span> reservations (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  book_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> books(id),
  member_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),  <span class="tok-comment">-- thứ tự FIFO trong hàng đợi</span>
  status      <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'WAITING'</span> <span class="tok-comment">-- WAITING|READY|FULFILLED|CANCELLED</span>
);</pre>

<h3>Ví dụ có lời giải — vì sao UNIQUE mới là người gác thật</h3>
<div class="out"><b>Tình huống:</b> hai INSERT cho copy_id = 7 tới cùng một mili-giây (hai quầy quét cùng một barcode).
<b>Bước 1 —</b> Giao dịch A: INSERT loan (copy_id=7) → dòng bị khoá, chưa commit.
<b>Bước 2 —</b> Giao dịch B: INSERT loan (copy_id=7) → PostgreSQL thấy khoá unique đang chờ → <b>B đợi</b>.
<b>Bước 3 —</b> A commit. Khoá unique (copy_id=7) giờ tồn tại.
<b>Bước 4 —</b> B được thả → INSERT của nó vi phạm <code>uq_active_copy</code> → <b>ERROR: duplicate key value violates unique constraint</b>.
<b>Kết quả:</b> đúng một lượt mượn tồn tại. Code Java của bạn sẽ bắt ngoại lệ này và trả <b>409 Conflict</b>. Chính CSDL, không phải câu <code>if</code>, mới bảo đảm tính đúng.</div>

<div class="pitfall"><strong>Bẫy:</strong> chỉ dựa vào một kiểm tra Java kiểu <code>if (copy.getStatus() == AVAILABLE)</code>. Giữa lúc bạn đọc và lúc bạn ghi, một request khác có thể đọc cùng trạng thái AVAILABLE — đây là <em>race condition</em> kinh điển. Kiểm tra Java là đường nhanh cho trường hợp thường; ràng buộc UNIQUE là sự bảo đảm. Cần cả hai. Mục 4 chỉ cách phòng thủ đầy đủ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy tắc đầy đủ với partial index.</b> Một <code>UNIQUE(copy_id)</code> thường cấm một bản được cho mượn hai lần — kể cả sau khi lượt mượn đầu đã trả. Để cho phép mượn lại mà vẫn cấm hai lượt <em>đang hoạt động</em>, bỏ UNIQUE thường và dùng:
<pre><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_loan
  <span class="tok-keyword">ON</span> loans (copy_id)
  <span class="tok-keyword">WHERE</span> returned_at <span class="tok-keyword">IS NULL</span>;</pre>
Giờ một bản có thể có nhiều dòng RETURNED cộng tối đa một dòng đang hoạt động (returned_at IS NULL). <em>Vì sao ngoài syllabus: partial (filtered) index là tính năng mạnh của Postgres mô hình hoá "duy nhất giữa các dòng hoạt động" — chính là ràng buộc trạng thái ở 1.1.</em></div>

<div class="note-ct">Trong Spring Data JPA (Mục 2) bạn không viết DDL này bằng tay — bạn annotate entity và Hibernate sinh ra nó. Nhưng biết SQL bên dưới mới giúp bạn debug khi việc sinh ra gây bất ngờ.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int602-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, cardinality và ràng buộc chống mượn trùng.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which entity must never be lent to two members at once, and where does the guarantee live?|||Thực thể nào không được cho hai thành viên mượn cùng lúc, và sự bảo đảm nằm ở đâu?',
                options: [
                  'Book; guaranteed by a Java if-check|||Book; bảo đảm bằng câu if trong Java',
                  'BookCopy; guaranteed by a UNIQUE constraint in the database|||BookCopy; bảo đảm bằng ràng buộc UNIQUE trong CSDL',
                  'User; guaranteed by JWT|||User; bảo đảm bằng JWT',
                  'Reservation; guaranteed by the frontend|||Reservation; bảo đảm bằng frontend',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The relationship "a book has many physical copies" is which cardinality?|||Quan hệ "một cuốn sách có nhiều bản vật lý" là lực lượng nào?',
                options: ['1—1', '1—* (one-to-many)|||1—* (một-nhiều)', '*—* (many-to-many)|||*—* (nhiều-nhiều)', '0—0'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why lend a BookCopy but reserve a Book?|||Vì sao cho mượn BookCopy nhưng đặt trước Book?',
                options: [
                  'It is faster to query|||Truy vấn nhanh hơn',
                  'A loan is against one physical item; a reservation is a place in the queue for any copy of the title|||Lượt mượn gắn với một vật lý cụ thể; đặt trước là chỗ trong hàng đợi cho bất kỳ bản nào của đầu sách',
                  'JPA requires it|||JPA bắt buộc',
                  'To avoid using a foreign key|||Để tránh dùng khoá ngoại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Two INSERTs hit the same copy_id at once with a UNIQUE(copy_id). What happens?|||Hai INSERT cùng copy_id một lúc với UNIQUE(copy_id). Điều gì xảy ra?',
                options: [
                  'Both succeed|||Cả hai thành công',
                  'Both fail|||Cả hai thất bại',
                  'Exactly one commits; the other violates the constraint and is rejected|||Đúng một cái commit; cái kia vi phạm ràng buộc và bị từ chối',
                  'The database crashes|||CSDL sập',
                ], correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) A partial unique index WHERE returned_at IS NULL lets you…|||(Ngoài giáo trình) Partial unique index WHERE returned_at IS NULL cho phép bạn…',
                options: [
                  'Lend two copies at once to one member|||Cho một thành viên mượn hai bản cùng lúc',
                  'Re-lend a copy after its earlier loan was returned, while still forbidding two active loans|||Cho mượn lại một bản sau khi lượt trước đã trả, mà vẫn cấm hai lượt đang hoạt động',
                  'Skip the foreign key|||Bỏ khoá ngoại',
                  'Store passwords|||Lưu mật khẩu',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ MỤC 2 — BACKEND: SPRING BOOT & CÁC LỚP ══════════════════ */
    {
      title: 'Section 2 — Backend: Spring Boot & the Layers|||Mục 2 — Backend: Spring Boot & các lớp',
      description: 'Khởi tạo dự án Spring Boot, ánh xạ entity/repository, và xây một lát cắt dọc "GET bản trống của một cuốn" qua Controller→Service→Repository.',
      lessons: [
        {
          title: '2.1 — Project setup & the layered architecture|||2.1 — Khởi tạo dự án & kiến trúc phân lớp',
          slug: 'int602-backend-setup',
          type: 'VIDEO',
          description: 'Spring Initializr, cấu hình application.yml, và ba lớp Controller / Service / Repository — mỗi lớp một trách nhiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.1</span>
<h2>Project setup &amp; the layered architecture</h2>
<p class="lead">Generate the project from <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a> (Maven, Java 17, Spring Boot 3.x) with dependencies: <b>Spring Web, Spring Data JPA, PostgreSQL Driver, Spring Security, Validation, Lombok</b>. Then wire it to your Postgres container.</p>

<h3>application.yml — connect to the database</h3>
<pre>spring:
  datasource:
    url: \${DB_URL:jdbc:postgresql://localhost:5432/library}
    username: \${DB_USER:postgres}
    password: \${DB_PASSWORD:library}
  jpa:
    hibernate:
      ddl-auto: update        <span class="tok-comment"># dev only — generate/patch tables from entities</span>
    properties:
      hibernate:
        format_sql: true
    show-sql: true            <span class="tok-comment"># log the SQL Hibernate runs — great for learning</span>
app:
  jwt:
    secret: \${JWT_SECRET:change-me-in-production-32bytes-min}
    expiration-ms: 86400000   <span class="tok-comment"># 24h</span>
  loan:
    period-days: 14           <span class="tok-comment"># default borrow window</span></pre>
<p>The <code>\${VAR:default}</code> syntax reads an environment variable and falls back to a default — the same values will come from Docker in Section 7, with no code change.</p>

<h3>The three layers — one responsibility each</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Controller</b> (<code>@RestController</code>) — HTTP only. Parses the request, validates the DTO, calls a service, maps the result to a status code + JSON. <em>No business logic here.</em></div>
  <div class="lz-layer"><b>Service</b> (<code>@Service</code>) — the business rules. "Is the copy available? Create the loan, flip the copy." Owns transactions (<code>@Transactional</code>). <em>Knows nothing about HTTP.</em></div>
  <div class="lz-layer"><b>Repository</b> (<code>@Repository</code>, a Spring Data interface) — database access. You declare method names; Spring writes the SQL. <em>Knows nothing about business rules.</em></div>
</div>
<div class="diagram">HTTP request
   │
   ▼
Controller ──DTO──▶ Service ──entity──▶ Repository ──SQL──▶ PostgreSQL
   ▲                   │
   └────DTO/status─────┘  (map entity → response, choose 200/201/409…)</div>

<div class="callout ok">Why layer at all? Because you can then <strong>test the Service without HTTP</strong> and <strong>swap the Controller (REST→GraphQL) without touching business rules</strong>. Each layer is replaceable because it depends only on the one below it.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Never leak entities to the outside.</b> A Controller should return a <em>DTO</em> (Data Transfer Object), not the JPA entity. Returning the entity exposes the password hash, triggers lazy-loading exceptions, and couples your API shape to your table shape. In 2.3 you'll see the DTO mapping. <em>Why beyond syllabus: the entity↔DTO boundary is a professional habit the syllabus rarely enforces, but every real codebase does.</em></div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-312" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Spring Boot REST MVC on Code Lab</span><span class="lc-sub">Controllers, request mapping and JSON, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.1</span>
<h2>Khởi tạo dự án &amp; kiến trúc phân lớp</h2>
<p class="lead">Sinh dự án từ <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a> (Maven, Java 17, Spring Boot 3.x) với các dependency: <b>Spring Web, Spring Data JPA, PostgreSQL Driver, Spring Security, Validation, Lombok</b>. Rồi nối nó tới container Postgres.</p>

<h3>application.yml — kết nối CSDL</h3>
<pre>spring:
  datasource:
    url: \${DB_URL:jdbc:postgresql://localhost:5432/library}
    username: \${DB_USER:postgres}
    password: \${DB_PASSWORD:library}
  jpa:
    hibernate:
      ddl-auto: update        <span class="tok-comment"># chỉ dev — sinh/vá bảng từ entity</span>
    properties:
      hibernate:
        format_sql: true
    show-sql: true            <span class="tok-comment"># log SQL Hibernate chạy — rất hợp để học</span>
app:
  jwt:
    secret: \${JWT_SECRET:change-me-in-production-32bytes-min}
    expiration-ms: 86400000   <span class="tok-comment"># 24h</span>
  loan:
    period-days: 14           <span class="tok-comment"># thời hạn mượn mặc định</span></pre>
<p>Cú pháp <code>\${VAR:default}</code> đọc một biến môi trường và lùi về giá trị mặc định — chính các giá trị này sẽ đến từ Docker ở Mục 7, không cần đổi code.</p>

<h3>Ba lớp — mỗi lớp một trách nhiệm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Controller</b> (<code>@RestController</code>) — chỉ lo HTTP. Đọc request, validate DTO, gọi service, ánh xạ kết quả sang status code + JSON. <em>Không có business logic ở đây.</em></div>
  <div class="lz-layer"><b>Service</b> (<code>@Service</code>) — quy tắc nghiệp vụ. "Bản có trống không? Tạo lượt mượn, đổi trạng thái bản." Sở hữu transaction (<code>@Transactional</code>). <em>Không biết gì về HTTP.</em></div>
  <div class="lz-layer"><b>Repository</b> (<code>@Repository</code>, một interface Spring Data) — truy cập CSDL. Bạn khai báo tên method; Spring viết SQL. <em>Không biết gì về quy tắc nghiệp vụ.</em></div>
</div>
<div class="diagram">HTTP request
   │
   ▼
Controller ──DTO──▶ Service ──entity──▶ Repository ──SQL──▶ PostgreSQL
   ▲                   │
   └────DTO/status─────┘  (ánh xạ entity → response, chọn 200/201/409…)</div>

<div class="callout ok">Vì sao phải phân lớp? Vì khi đó bạn có thể <strong>test Service không cần HTTP</strong> và <strong>thay Controller (REST→GraphQL) mà không đụng quy tắc nghiệp vụ</strong>. Mỗi lớp thay được vì nó chỉ phụ thuộc vào lớp ngay dưới.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đừng bao giờ để lộ entity ra ngoài.</b> Controller nên trả về một <em>DTO</em> (Data Transfer Object), không phải JPA entity. Trả về entity làm lộ hash mật khẩu, gây lỗi lazy-loading, và cột chặt hình dạng API vào hình dạng bảng. Ở 2.3 bạn sẽ thấy cách map DTO. <em>Vì sao ngoài syllabus: ranh giới entity↔DTO là thói quen chuyên nghiệp mà giáo trình ít ép, nhưng mọi codebase thật đều làm.</em></div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-312" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Spring Boot REST MVC trên Code Lab</span><span class="lc-sub">Controller, request mapping và JSON, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Entities & repositories|||2.2 — Entity & repository',
          slug: 'int602-entities',
          type: 'VIDEO',
          description: 'Ánh xạ 5 bảng thành JPA entity với @Entity/@ManyToOne, và khai báo repository bằng query-method.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>Entities &amp; repositories</h2>
<p class="lead">Each table becomes a Java class annotated with JPA. Relationships become object references. Then a one-line interface per table gives you full CRUD — no SQL to write.</p>

<h3>The BookCopy entity</h3>
<pre><span class="tok-keyword">@Entity</span> <span class="tok-keyword">@Table</span>(name = <span class="tok-string">"book_copies"</span>)
<span class="tok-keyword">@Getter</span> <span class="tok-keyword">@Setter</span>  <span class="tok-comment">// Lombok</span>
<span class="tok-keyword">public class</span> <span class="tok-type">BookCopy</span> {
  <span class="tok-keyword">@Id</span> <span class="tok-keyword">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> id;

  <span class="tok-keyword">@ManyToOne</span>(fetch = FetchType.LAZY) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"book_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">Book</span> book;

  <span class="tok-keyword">@Column</span>(unique = <span class="tok-keyword">true</span>, nullable = <span class="tok-keyword">false</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">String</span> barcode;

  <span class="tok-keyword">@Enumerated</span>(EnumType.STRING)
  <span class="tok-keyword">private</span> <span class="tok-type">CopyStatus</span> status = CopyStatus.AVAILABLE;  <span class="tok-comment">// AVAILABLE | ON_LOAN | LOST</span>

  <span class="tok-keyword">@Version</span>                        <span class="tok-comment">// ★ optimistic lock — Section 4 uses this</span>
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> version;
}</pre>

<h3>The Loan entity — note the UNIQUE</h3>
<pre><span class="tok-keyword">@Entity</span> <span class="tok-keyword">@Table</span>(name = <span class="tok-string">"loans"</span>,
  uniqueConstraints = <span class="tok-keyword">@UniqueConstraint</span>(name = <span class="tok-string">"uq_active_copy"</span>, columnNames = <span class="tok-string">"copy_id"</span>))
<span class="tok-keyword">@Getter</span> <span class="tok-keyword">@Setter</span>
<span class="tok-keyword">public class</span> <span class="tok-type">Loan</span> {
  <span class="tok-keyword">@Id</span> <span class="tok-keyword">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> id;

  <span class="tok-keyword">@ManyToOne</span>(optional = <span class="tok-keyword">false</span>) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"copy_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">BookCopy</span> copy;

  <span class="tok-keyword">@ManyToOne</span>(optional = <span class="tok-keyword">false</span>) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"member_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">User</span> member;

  <span class="tok-keyword">private</span> <span class="tok-type">LocalDateTime</span> borrowedAt = LocalDateTime.now();
  <span class="tok-keyword">private</span> <span class="tok-type">LocalDate</span> dueDate;
  <span class="tok-keyword">private</span> <span class="tok-type">LocalDateTime</span> returnedAt;   <span class="tok-comment">// null while active</span>

  <span class="tok-keyword">@Enumerated</span>(EnumType.STRING)
  <span class="tok-keyword">private</span> <span class="tok-type">LoanStatus</span> status = LoanStatus.ACTIVE;
}</pre>

<h3>Repositories — declare, don't implement</h3>
<pre><span class="tok-keyword">public interface</span> <span class="tok-type">BookCopyRepository</span> <span class="tok-keyword">extends</span> <span class="tok-type">JpaRepository</span>&lt;BookCopy, Long&gt; {
  <span class="tok-comment">// Spring turns the method name into SQL automatically:</span>
  <span class="tok-type">List</span>&lt;BookCopy&gt; <span class="tok-function">findByBookIdAndStatus</span>(<span class="tok-type">Long</span> bookId, <span class="tok-type">CopyStatus</span> status);
  <span class="tok-keyword">long</span> <span class="tok-function">countByBookIdAndStatus</span>(<span class="tok-type">Long</span> bookId, <span class="tok-type">CopyStatus</span> status);
}

<span class="tok-keyword">public interface</span> <span class="tok-type">LoanRepository</span> <span class="tok-keyword">extends</span> <span class="tok-type">JpaRepository</span>&lt;Loan, Long&gt; {
  <span class="tok-type">List</span>&lt;Loan&gt; <span class="tok-function">findByMemberId</span>(<span class="tok-type">Long</span> memberId);
  <span class="tok-comment">// overdue = still out AND past due — used by the librarian list (Section 4.3)</span>
  <span class="tok-type">List</span>&lt;Loan&gt; <span class="tok-function">findByReturnedAtIsNullAndDueDateBefore</span>(<span class="tok-type">LocalDate</span> today);
  <span class="tok-keyword">long</span> <span class="tok-function">countByCopyId</span>(<span class="tok-type">Long</span> copyId);
}</pre>
<p><code>findByBookIdAndStatus</code> becomes <code>SELECT * FROM book_copies WHERE book_id=? AND status=?</code>. You wrote zero SQL.</p>

<div class="pitfall"><strong>Trap:</strong> <code>FetchType.EAGER</code> on <code>@ManyToOne</code> everywhere. It looks convenient but silently loads whole object graphs on every query — the classic N+1 performance bug. Default to <code>LAZY</code> and fetch what you need explicitly.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b><code>@Enumerated(EnumType.STRING)</code>, never ORDINAL.</b> The default stores an enum as its position (0,1,2). Reorder or insert an enum value later and every stored row silently means something else. Storing the string (<code>'AVAILABLE'</code>) is self-describing and reorder-proof. <em>Why beyond syllabus: this is a real production data-corruption trap the syllabus never warns about.</em></div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-313" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Spring Data JPA on Code Lab</span><span class="lc-sub">Entities, relationships and query methods, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Entity &amp; repository</h2>
<p class="lead">Mỗi bảng thành một lớp Java được annotate JPA. Quan hệ thành tham chiếu đối tượng. Rồi một interface một dòng cho mỗi bảng cho bạn CRUD đầy đủ — không phải viết SQL.</p>

<h3>Entity BookCopy</h3>
<pre><span class="tok-keyword">@Entity</span> <span class="tok-keyword">@Table</span>(name = <span class="tok-string">"book_copies"</span>)
<span class="tok-keyword">@Getter</span> <span class="tok-keyword">@Setter</span>  <span class="tok-comment">// Lombok</span>
<span class="tok-keyword">public class</span> <span class="tok-type">BookCopy</span> {
  <span class="tok-keyword">@Id</span> <span class="tok-keyword">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> id;

  <span class="tok-keyword">@ManyToOne</span>(fetch = FetchType.LAZY) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"book_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">Book</span> book;

  <span class="tok-keyword">@Column</span>(unique = <span class="tok-keyword">true</span>, nullable = <span class="tok-keyword">false</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">String</span> barcode;

  <span class="tok-keyword">@Enumerated</span>(EnumType.STRING)
  <span class="tok-keyword">private</span> <span class="tok-type">CopyStatus</span> status = CopyStatus.AVAILABLE;  <span class="tok-comment">// AVAILABLE | ON_LOAN | LOST</span>

  <span class="tok-keyword">@Version</span>                        <span class="tok-comment">// ★ optimistic lock — Mục 4 dùng cái này</span>
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> version;
}</pre>

<h3>Entity Loan — chú ý UNIQUE</h3>
<pre><span class="tok-keyword">@Entity</span> <span class="tok-keyword">@Table</span>(name = <span class="tok-string">"loans"</span>,
  uniqueConstraints = <span class="tok-keyword">@UniqueConstraint</span>(name = <span class="tok-string">"uq_active_copy"</span>, columnNames = <span class="tok-string">"copy_id"</span>))
<span class="tok-keyword">@Getter</span> <span class="tok-keyword">@Setter</span>
<span class="tok-keyword">public class</span> <span class="tok-type">Loan</span> {
  <span class="tok-keyword">@Id</span> <span class="tok-keyword">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> id;

  <span class="tok-keyword">@ManyToOne</span>(optional = <span class="tok-keyword">false</span>) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"copy_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">BookCopy</span> copy;

  <span class="tok-keyword">@ManyToOne</span>(optional = <span class="tok-keyword">false</span>) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"member_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">User</span> member;

  <span class="tok-keyword">private</span> <span class="tok-type">LocalDateTime</span> borrowedAt = LocalDateTime.now();
  <span class="tok-keyword">private</span> <span class="tok-type">LocalDate</span> dueDate;
  <span class="tok-keyword">private</span> <span class="tok-type">LocalDateTime</span> returnedAt;   <span class="tok-comment">// null khi còn mượn</span>

  <span class="tok-keyword">@Enumerated</span>(EnumType.STRING)
  <span class="tok-keyword">private</span> <span class="tok-type">LoanStatus</span> status = LoanStatus.ACTIVE;
}</pre>

<h3>Repository — khai báo, không hiện thực</h3>
<pre><span class="tok-keyword">public interface</span> <span class="tok-type">BookCopyRepository</span> <span class="tok-keyword">extends</span> <span class="tok-type">JpaRepository</span>&lt;BookCopy, Long&gt; {
  <span class="tok-comment">// Spring biến tên method thành SQL tự động:</span>
  <span class="tok-type">List</span>&lt;BookCopy&gt; <span class="tok-function">findByBookIdAndStatus</span>(<span class="tok-type">Long</span> bookId, <span class="tok-type">CopyStatus</span> status);
  <span class="tok-keyword">long</span> <span class="tok-function">countByBookIdAndStatus</span>(<span class="tok-type">Long</span> bookId, <span class="tok-type">CopyStatus</span> status);
}

<span class="tok-keyword">public interface</span> <span class="tok-type">LoanRepository</span> <span class="tok-keyword">extends</span> <span class="tok-type">JpaRepository</span>&lt;Loan, Long&gt; {
  <span class="tok-type">List</span>&lt;Loan&gt; <span class="tok-function">findByMemberId</span>(<span class="tok-type">Long</span> memberId);
  <span class="tok-comment">// quá hạn = còn ra ngoài VÀ đã trễ hạn — dùng cho danh sách thủ thư (Mục 4.3)</span>
  <span class="tok-type">List</span>&lt;Loan&gt; <span class="tok-function">findByReturnedAtIsNullAndDueDateBefore</span>(<span class="tok-type">LocalDate</span> today);
  <span class="tok-keyword">long</span> <span class="tok-function">countByCopyId</span>(<span class="tok-type">Long</span> copyId);
}</pre>
<p><code>findByBookIdAndStatus</code> thành <code>SELECT * FROM book_copies WHERE book_id=? AND status=?</code>. Bạn viết không dòng SQL nào.</p>

<div class="pitfall"><strong>Bẫy:</strong> <code>FetchType.EAGER</code> trên mọi <code>@ManyToOne</code>. Nhìn tiện nhưng lặng lẽ nạp cả đồ thị đối tượng ở mỗi truy vấn — lỗi hiệu năng N+1 kinh điển. Mặc định <code>LAZY</code> và nạp thứ cần một cách tường minh.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b><code>@Enumerated(EnumType.STRING)</code>, đừng bao giờ ORDINAL.</b> Mặc định lưu enum theo vị trí (0,1,2). Sắp xếp lại hay chèn một giá trị enum sau này và mọi dòng đã lưu lặng lẽ mang ý nghĩa khác. Lưu chuỗi (<code>'AVAILABLE'</code>) là tự mô tả và bền qua việc sắp lại. <em>Vì sao ngoài syllabus: đây là bẫy hỏng dữ liệu thật ở production mà giáo trình không hề cảnh báo.</em></div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-313" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Spring Data JPA trên Code Lab</span><span class="lc-sub">Entity, quan hệ và query method, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.3 — Worked slice: GET the available copies of a book|||2.3 — Lát cắt có lời giải: GET bản trống của một cuốn',
          slug: 'int602-slice-available-copies',
          type: 'VIDEO',
          description: 'Đi trọn một lát cắt dọc đầu tiên: DTO → Service → Controller → thử bằng curl, có kết quả JSON thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.3</span>
<h2>Worked slice — GET a book's available copies</h2>
<p class="lead">Let's ship the first vertical slice end-to-end: an endpoint that returns a book's AVAILABLE copies as clean JSON, joining book + copy. This is the template every other read endpoint copies.</p>

<h3>Step 1 — the DTO (what the API returns, not the entity)</h3>
<pre><span class="tok-keyword">public record</span> <span class="tok-type">CopyDto</span>(<span class="tok-type">Long</span> id, <span class="tok-type">Long</span> bookId,
                       <span class="tok-type">String</span> title, <span class="tok-type">String</span> barcode,
                       <span class="tok-type">String</span> status) {
  <span class="tok-keyword">public static</span> <span class="tok-type">CopyDto</span> <span class="tok-function">from</span>(<span class="tok-type">BookCopy</span> c) {
    <span class="tok-keyword">return new</span> <span class="tok-type">CopyDto</span>(c.getId(), c.getBook().getId(),
        c.getBook().getTitle(), c.getBarcode(), c.getStatus().name());
  }
}</pre>

<h3>Step 2 — the Service (business intent, no HTTP)</h3>
<pre><span class="tok-keyword">@Service</span> <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">CatalogService</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">BookCopyRepository</span> copyRepo;

  <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;CopyDto&gt; <span class="tok-function">availableCopiesOf</span>(<span class="tok-type">Long</span> bookId) {
    <span class="tok-keyword">return</span> copyRepo.findByBookIdAndStatus(bookId, CopyStatus.AVAILABLE)
        .stream().map(CopyDto::from).toList();
  }
}</pre>

<h3>Step 3 — the Controller (HTTP only)</h3>
<pre><span class="tok-keyword">@RestController</span> <span class="tok-keyword">@RequestMapping</span>(<span class="tok-string">"/api/books"</span>) <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">BookController</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">CatalogService</span> catalog;

  <span class="tok-keyword">@GetMapping</span>(<span class="tok-string">"/{id}/copies"</span>)
  <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;CopyDto&gt; <span class="tok-function">copies</span>(<span class="tok-keyword">@PathVariable</span> <span class="tok-type">Long</span> id) {
    <span class="tok-keyword">return</span> catalog.availableCopiesOf(id);
  }
}</pre>

<h3>Step 4 — test it (real output)</h3>
<div class="out"><b>Request:</b>  curl http://localhost:8080/api/books/1/copies
<b>Response 200:</b>
[
  { "id": 10, "bookId": 1, "title": "Clean Code",
    "barcode": "LIB-000010", "status": "AVAILABLE" },
  { "id": 11, "bookId": 1, "title": "Clean Code",
    "barcode": "LIB-000011", "status": "AVAILABLE" }
]</div>
<p>That is a complete slice: request → controller → service → repository → JSON. Every other GET endpoint (my loans, the overdue list) is this same shape.</p>

<div class="callout ok"><strong>Rhythm to internalise:</strong> DTO first (the contract), then Service (the intent), then Controller (the plumbing). Build inside-out and the compiler guides you.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Java <code>record</code> for DTOs.</b> A <code>record</code> is an immutable data carrier with auto-generated constructor, getters, <code>equals</code> and <code>toString</code> — perfect for DTOs and impossible to accidentally mutate. Older tutorials use a full class with Lombok; records (Java 16+) are the modern, safer default. <em>Why beyond syllabus: records post-date most Java course material but are now idiomatic.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-409" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice JOINs on Code Lab</span><span class="lc-sub">Joining book + copy is the SQL your query method generates.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.3</span>
<h2>Lát cắt có lời giải — GET bản trống của một cuốn</h2>
<p class="lead">Hãy ship lát cắt dọc đầu tiên từ đầu đến cuối: một endpoint trả về các bản AVAILABLE của một cuốn dưới dạng JSON sạch, nối book + copy. Đây là khuôn mà mọi endpoint đọc khác sao chép lại.</p>

<h3>Bước 1 — DTO (thứ API trả về, không phải entity)</h3>
<pre><span class="tok-keyword">public record</span> <span class="tok-type">CopyDto</span>(<span class="tok-type">Long</span> id, <span class="tok-type">Long</span> bookId,
                       <span class="tok-type">String</span> title, <span class="tok-type">String</span> barcode,
                       <span class="tok-type">String</span> status) {
  <span class="tok-keyword">public static</span> <span class="tok-type">CopyDto</span> <span class="tok-function">from</span>(<span class="tok-type">BookCopy</span> c) {
    <span class="tok-keyword">return new</span> <span class="tok-type">CopyDto</span>(c.getId(), c.getBook().getId(),
        c.getBook().getTitle(), c.getBarcode(), c.getStatus().name());
  }
}</pre>

<h3>Bước 2 — Service (ý định nghiệp vụ, không HTTP)</h3>
<pre><span class="tok-keyword">@Service</span> <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">CatalogService</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">BookCopyRepository</span> copyRepo;

  <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;CopyDto&gt; <span class="tok-function">availableCopiesOf</span>(<span class="tok-type">Long</span> bookId) {
    <span class="tok-keyword">return</span> copyRepo.findByBookIdAndStatus(bookId, CopyStatus.AVAILABLE)
        .stream().map(CopyDto::from).toList();
  }
}</pre>

<h3>Bước 3 — Controller (chỉ HTTP)</h3>
<pre><span class="tok-keyword">@RestController</span> <span class="tok-keyword">@RequestMapping</span>(<span class="tok-string">"/api/books"</span>) <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">BookController</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">CatalogService</span> catalog;

  <span class="tok-keyword">@GetMapping</span>(<span class="tok-string">"/{id}/copies"</span>)
  <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;CopyDto&gt; <span class="tok-function">copies</span>(<span class="tok-keyword">@PathVariable</span> <span class="tok-type">Long</span> id) {
    <span class="tok-keyword">return</span> catalog.availableCopiesOf(id);
  }
}</pre>

<h3>Bước 4 — thử nó (kết quả thật)</h3>
<div class="out"><b>Request:</b>  curl http://localhost:8080/api/books/1/copies
<b>Response 200:</b>
[
  { "id": 10, "bookId": 1, "title": "Clean Code",
    "barcode": "LIB-000010", "status": "AVAILABLE" },
  { "id": 11, "bookId": 1, "title": "Clean Code",
    "barcode": "LIB-000011", "status": "AVAILABLE" }
]</div>
<p>Đó là một lát cắt hoàn chỉnh: request → controller → service → repository → JSON. Mọi endpoint GET khác (lượt mượn của tôi, danh sách quá hạn) đều cùng hình dạng này.</p>

<div class="callout ok"><strong>Nhịp cần thấm:</strong> DTO trước (bản hợp đồng), rồi Service (ý định), rồi Controller (đường ống). Xây từ trong ra ngoài, trình biên dịch dẫn đường cho bạn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dùng <code>record</code> Java cho DTO.</b> Một <code>record</code> là vật mang dữ liệu bất biến với constructor, getter, <code>equals</code> và <code>toString</code> tự sinh — hoàn hảo cho DTO và không thể vô tình biến đổi. Tài liệu cũ dùng class đầy đủ với Lombok; record (Java 16+) là mặc định hiện đại, an toàn hơn. <em>Vì sao ngoài syllabus: record ra đời sau phần lớn tài liệu Java nhưng nay đã thành idiom.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-409" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Luyện JOIN trên Code Lab</span><span class="lc-sub">Nối book + copy chính là SQL mà query method của bạn sinh ra.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 3 — AUTH & JWT ══════════════════ */
    {
      title: 'Section 3 — Authentication & Roles (JWT)|||Mục 3 — Xác thực & Phân quyền (JWT)',
      description: 'Đăng ký/đăng nhập, phát JWT, và phân quyền hai vai trò bằng Spring Security — ai được làm gì.',
      lessons: [
        {
          title: '3.1 — Register, login & issue a JWT|||3.1 — Đăng ký, đăng nhập & phát JWT',
          slug: 'int602-auth-jwt',
          type: 'VIDEO',
          description: 'Băm mật khẩu bằng BCrypt, đổi email+mật khẩu lấy một JWT ký, và hiểu token mang gì.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.1</span>
<h2>Register, login &amp; issue a JWT</h2>
<p class="lead">Authentication answers "who are you?". The flow: register (store a <strong>BCrypt hash</strong>, never the plain password) → login (check the password, return a <strong>signed JWT</strong>) → every later request carries that token in the <code>Authorization</code> header.</p>

<h3>What a JWT is — three dot-separated parts</h3>
<div class="diagram">header.payload.signature
   │       │        └─ HMAC-SHA256(header.payload, SECRET) — proves we issued it
   │       └─ claims: { "sub": "an@mail.com", "role": "MEMBER", "exp": ... }
   └─ { "alg": "HS256", "typ": "JWT" }</div>
<p>The server does not store sessions. It trusts the token because only the server knows the SECRET used to sign it — tamper with one byte and the signature check fails.</p>

<h3>Register &amp; login — the service</h3>
<pre><span class="tok-keyword">@Service</span> <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">AuthService</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">UserRepository</span> users;
  <span class="tok-keyword">private final</span> <span class="tok-type">PasswordEncoder</span> encoder;   <span class="tok-comment">// BCryptPasswordEncoder bean</span>
  <span class="tok-keyword">private final</span> <span class="tok-type">JwtService</span> jwt;

  <span class="tok-keyword">public</span> <span class="tok-type">User</span> <span class="tok-function">register</span>(<span class="tok-type">RegisterDto</span> dto) {
    <span class="tok-keyword">if</span> (users.existsByEmail(dto.email()))
      <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictException</span>(<span class="tok-string">"Email already registered"</span>);
    <span class="tok-type">User</span> u = <span class="tok-keyword">new</span> <span class="tok-type">User</span>();
    u.setEmail(dto.email());
    u.setPassword(encoder.encode(dto.password()));   <span class="tok-comment">// ★ hash, never store plain</span>
    u.setFullName(dto.fullName());
    u.setRole(Role.MEMBER);                           <span class="tok-comment">// self-register = member</span>
    <span class="tok-keyword">return</span> users.save(u);
  }

  <span class="tok-keyword">public</span> <span class="tok-type">String</span> <span class="tok-function">login</span>(<span class="tok-type">LoginDto</span> dto) {
    <span class="tok-type">User</span> u = users.findByEmail(dto.email())
        .orElseThrow(() -&gt; <span class="tok-keyword">new</span> <span class="tok-type">UnauthorizedException</span>(<span class="tok-string">"Bad credentials"</span>));
    <span class="tok-keyword">if</span> (!encoder.matches(dto.password(), u.getPassword()))
      <span class="tok-keyword">throw new</span> <span class="tok-type">UnauthorizedException</span>(<span class="tok-string">"Bad credentials"</span>);
    <span class="tok-keyword">return</span> jwt.issue(u);   <span class="tok-comment">// signs { sub: email, role, exp }</span>
  }
}</pre>

<h3>Worked example — the login round-trip</h3>
<div class="out"><b>1.</b> POST /api/auth/register { "email":"an@mail.com", "password":"Secret123", "fullName":"An" }
   → 201 Created
<b>2.</b> POST /api/auth/login    { "email":"an@mail.com", "password":"Secret123" }
   → 200 { "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbkBtYWlsLmNvbS...", "role":"MEMBER" }
<b>3.</b> GET /api/loans/mine   Header: Authorization: Bearer eyJhbGciOiJIUzI1...
   → 200 [ ...An's loans... ]
<b>Wrong password?</b> step 2 → 401 Unauthorized (same message whether email or password is wrong — see pitfall).</div>

<div class="pitfall"><strong>Security trap:</strong> different error messages for "email not found" vs "wrong password" let an attacker enumerate which emails exist. Return the <em>same</em> generic "Bad credentials" for both. Also: never log the password or the raw token.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>BCrypt is deliberately slow, and that is a feature.</b> Unlike a plain SHA-256, BCrypt has a tunable work factor so hashing takes ~100 ms — trivial for one login, but it makes brute-forcing a stolen hash database astronomically expensive. Never hash passwords with a fast general-purpose hash. <em>Why beyond syllabus: the "why slow is good" reasoning is security engineering the syllabus assumes but rarely explains.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; JWT on Code Lab</span><span class="lc-sub">Hashing, tokens and protected routes, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.1</span>
<h2>Đăng ký, đăng nhập &amp; phát JWT</h2>
<p class="lead">Xác thực trả lời "bạn là ai?". Luồng: đăng ký (lưu một <strong>hash BCrypt</strong>, không bao giờ lưu mật khẩu thô) → đăng nhập (kiểm mật khẩu, trả về một <strong>JWT đã ký</strong>) → mọi request sau mang token đó trong header <code>Authorization</code>.</p>

<h3>JWT là gì — ba phần ngăn bởi dấu chấm</h3>
<div class="diagram">header.payload.signature
   │       │        └─ HMAC-SHA256(header.payload, SECRET) — chứng minh do ta phát
   │       └─ claim: { "sub": "an@mail.com", "role": "MEMBER", "exp": ... }
   └─ { "alg": "HS256", "typ": "JWT" }</div>
<p>Server không lưu session. Nó tin token vì chỉ server biết SECRET dùng để ký — sửa một byte là chữ ký sai.</p>

<h3>Đăng ký &amp; đăng nhập — service</h3>
<pre><span class="tok-keyword">@Service</span> <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">AuthService</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">UserRepository</span> users;
  <span class="tok-keyword">private final</span> <span class="tok-type">PasswordEncoder</span> encoder;   <span class="tok-comment">// bean BCryptPasswordEncoder</span>
  <span class="tok-keyword">private final</span> <span class="tok-type">JwtService</span> jwt;

  <span class="tok-keyword">public</span> <span class="tok-type">User</span> <span class="tok-function">register</span>(<span class="tok-type">RegisterDto</span> dto) {
    <span class="tok-keyword">if</span> (users.existsByEmail(dto.email()))
      <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictException</span>(<span class="tok-string">"Email đã được đăng ký"</span>);
    <span class="tok-type">User</span> u = <span class="tok-keyword">new</span> <span class="tok-type">User</span>();
    u.setEmail(dto.email());
    u.setPassword(encoder.encode(dto.password()));   <span class="tok-comment">// ★ băm, không lưu thô</span>
    u.setFullName(dto.fullName());
    u.setRole(Role.MEMBER);                           <span class="tok-comment">// tự đăng ký = thành viên</span>
    <span class="tok-keyword">return</span> users.save(u);
  }

  <span class="tok-keyword">public</span> <span class="tok-type">String</span> <span class="tok-function">login</span>(<span class="tok-type">LoginDto</span> dto) {
    <span class="tok-type">User</span> u = users.findByEmail(dto.email())
        .orElseThrow(() -&gt; <span class="tok-keyword">new</span> <span class="tok-type">UnauthorizedException</span>(<span class="tok-string">"Sai thông tin đăng nhập"</span>));
    <span class="tok-keyword">if</span> (!encoder.matches(dto.password(), u.getPassword()))
      <span class="tok-keyword">throw new</span> <span class="tok-type">UnauthorizedException</span>(<span class="tok-string">"Sai thông tin đăng nhập"</span>);
    <span class="tok-keyword">return</span> jwt.issue(u);   <span class="tok-comment">// ký { sub: email, role, exp }</span>
  }
}</pre>

<h3>Ví dụ có lời giải — vòng đăng nhập</h3>
<div class="out"><b>1.</b> POST /api/auth/register { "email":"an@mail.com", "password":"Secret123", "fullName":"An" }
   → 201 Created
<b>2.</b> POST /api/auth/login    { "email":"an@mail.com", "password":"Secret123" }
   → 200 { "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbkBtYWlsLmNvbS...", "role":"MEMBER" }
<b>3.</b> GET /api/loans/mine   Header: Authorization: Bearer eyJhbGciOiJIUzI1...
   → 200 [ ...các lượt mượn của An... ]
<b>Sai mật khẩu?</b> bước 2 → 401 Unauthorized (cùng một thông báo dù email hay mật khẩu sai — xem bẫy).</div>

<div class="pitfall"><strong>Bẫy bảo mật:</strong> thông báo lỗi khác nhau cho "không tìm thấy email" và "sai mật khẩu" giúp kẻ tấn công dò email nào tồn tại. Trả <em>cùng</em> một thông báo chung "Sai thông tin đăng nhập" cho cả hai. Ngoài ra: không bao giờ log mật khẩu hay token thô.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>BCrypt cố tình chậm, và đó là một tính năng.</b> Khác SHA-256 thuần, BCrypt có work factor điều chỉnh được nên băm mất ~100 ms — không đáng kể cho một lần đăng nhập, nhưng khiến việc brute-force một CSDL hash bị đánh cắp đắt đỏ khủng khiếp. Đừng bao giờ băm mật khẩu bằng hash nhanh đa dụng. <em>Vì sao ngoài syllabus: lý lẽ "vì sao chậm lại tốt" là kỹ nghệ bảo mật mà giáo trình giả định nhưng ít giải thích.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; JWT trên Code Lab</span><span class="lc-sub">Băm, token và route được bảo vệ, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Role-based authorization: who can do what|||3.2 — Phân quyền theo vai trò: ai được làm gì',
          slug: 'int602-roles',
          type: 'VIDEO',
          description: 'Cấu hình Spring Security, khoá endpoint theo role, và kiểm quyền sở hữu (chỉ trả lượt mượn của chính mình).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.2</span>
<h2>Role-based authorization — who can do what</h2>
<p class="lead">Authentication proved <em>who</em> you are; authorization decides <em>what</em> you may do. Two checks: <strong>role</strong> (only a librarian issues a loan) and <strong>ownership</strong> (a member returns or cancels only their own loan).</p>

<h3>Lock endpoints by role</h3>
<pre><span class="tok-keyword">@Bean</span>
<span class="tok-type">SecurityFilterChain</span> <span class="tok-function">chain</span>(<span class="tok-type">HttpSecurity</span> http) <span class="tok-keyword">throws</span> Exception {
  http.csrf(csrf -&gt; csrf.disable())          <span class="tok-comment">// stateless API — no CSRF cookie</span>
      .sessionManagement(s -&gt; s.sessionCreationPolicy(STATELESS))
      .authorizeHttpRequests(auth -&gt; auth
          .requestMatchers(<span class="tok-string">"/api/auth/**"</span>).permitAll()
          .requestMatchers(HttpMethod.GET, <span class="tok-string">"/api/books/**"</span>).permitAll()
          .requestMatchers(HttpMethod.POST, <span class="tok-string">"/api/loans"</span>).hasRole(<span class="tok-string">"LIBRARIAN"</span>)
          .requestMatchers(<span class="tok-string">"/api/librarian/**"</span>).hasRole(<span class="tok-string">"LIBRARIAN"</span>)
          .requestMatchers(HttpMethod.POST, <span class="tok-string">"/api/reservations"</span>).hasRole(<span class="tok-string">"MEMBER"</span>)
          .anyRequest().authenticated())
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
  <span class="tok-keyword">return</span> http.build();
}</pre>
<p>The <code>jwtFilter</code> reads the <code>Authorization</code> header, validates the token, and puts the user + role into the security context so these rules can fire.</p>

<h3>Ownership check — role is not enough</h3>
<pre><span class="tok-keyword">public void</span> <span class="tok-function">returnOwnLoan</span>(<span class="tok-type">Long</span> loanId, <span class="tok-type">Long</span> currentUserId) {
  <span class="tok-type">Loan</span> loan = loans.findById(loanId).orElseThrow(NotFoundException::new);
  <span class="tok-keyword">if</span> (!loan.getMember().getId().equals(currentUserId))   <span class="tok-comment">// ★ own it?</span>
    <span class="tok-keyword">throw new</span> <span class="tok-type">ForbiddenException</span>(<span class="tok-string">"Not your loan"</span>);       <span class="tok-comment">// → 403</span>
  loanService.markReturned(loan);                        <span class="tok-comment">// release the copy</span>
}</pre>

<h3>Worked example — the permission matrix</h3>
<table>
<thead><tr><th>Action</th><th>MEMBER</th><th>LIBRARIAN</th></tr></thead>
<tbody>
<tr><td>Issue a copy (lend)</td><td>❌ 403</td><td>✅</td></tr>
<tr><td>Return own loan</td><td>✅</td><td>✅ (any)</td></tr>
<tr><td>Return someone else's</td><td>❌ 403</td><td>✅</td></tr>
<tr><td>Reserve a book</td><td>✅</td><td>—</td></tr>
<tr><td>Manage overdue / open reservations</td><td>❌ 403</td><td>✅</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Trap:</strong> checking role but forgetting ownership. If any logged-in member can return or cancel <em>any</em> loan by changing the id in the URL, that is a broken-access-control vulnerability (OWASP #1). Always verify the resource belongs to the caller.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>401 vs 403 — say the right one.</b> <code>401 Unauthorized</code> means "I don't know who you are" (missing/expired token — re-login). <code>403 Forbidden</code> means "I know who you are, but you may not do this" (wrong role or not your resource). Returning the wrong one confuses the frontend's error handling. <em>Why beyond syllabus: the semantic difference is subtle and constantly gotten wrong, even in production APIs.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-955" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Role-based access on Code Lab</span><span class="lc-sub">Roles, authorities and protecting endpoints, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.2</span>
<h2>Phân quyền theo vai trò — ai được làm gì</h2>
<p class="lead">Xác thực chứng minh <em>bạn là ai</em>; phân quyền quyết định <em>bạn được làm gì</em>. Hai kiểm tra: <strong>vai trò</strong> (chỉ thủ thư cho mượn) và <strong>quyền sở hữu</strong> (thành viên chỉ trả hoặc huỷ lượt mượn của chính mình).</p>

<h3>Khoá endpoint theo vai trò</h3>
<pre><span class="tok-keyword">@Bean</span>
<span class="tok-type">SecurityFilterChain</span> <span class="tok-function">chain</span>(<span class="tok-type">HttpSecurity</span> http) <span class="tok-keyword">throws</span> Exception {
  http.csrf(csrf -&gt; csrf.disable())          <span class="tok-comment">// API stateless — không CSRF cookie</span>
      .sessionManagement(s -&gt; s.sessionCreationPolicy(STATELESS))
      .authorizeHttpRequests(auth -&gt; auth
          .requestMatchers(<span class="tok-string">"/api/auth/**"</span>).permitAll()
          .requestMatchers(HttpMethod.GET, <span class="tok-string">"/api/books/**"</span>).permitAll()
          .requestMatchers(HttpMethod.POST, <span class="tok-string">"/api/loans"</span>).hasRole(<span class="tok-string">"LIBRARIAN"</span>)
          .requestMatchers(<span class="tok-string">"/api/librarian/**"</span>).hasRole(<span class="tok-string">"LIBRARIAN"</span>)
          .requestMatchers(HttpMethod.POST, <span class="tok-string">"/api/reservations"</span>).hasRole(<span class="tok-string">"MEMBER"</span>)
          .anyRequest().authenticated())
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
  <span class="tok-keyword">return</span> http.build();
}</pre>
<p><code>jwtFilter</code> đọc header <code>Authorization</code>, kiểm token, và đặt user + role vào security context để các quy tắc này kích hoạt.</p>

<h3>Kiểm quyền sở hữu — chỉ role là chưa đủ</h3>
<pre><span class="tok-keyword">public void</span> <span class="tok-function">returnOwnLoan</span>(<span class="tok-type">Long</span> loanId, <span class="tok-type">Long</span> currentUserId) {
  <span class="tok-type">Loan</span> loan = loans.findById(loanId).orElseThrow(NotFoundException::new);
  <span class="tok-keyword">if</span> (!loan.getMember().getId().equals(currentUserId))   <span class="tok-comment">// ★ có phải của mình?</span>
    <span class="tok-keyword">throw new</span> <span class="tok-type">ForbiddenException</span>(<span class="tok-string">"Không phải lượt mượn của bạn"</span>);  <span class="tok-comment">// → 403</span>
  loanService.markReturned(loan);                        <span class="tok-comment">// trả lại bản sách</span>
}</pre>

<h3>Ví dụ có lời giải — ma trận quyền</h3>
<table>
<thead><tr><th>Hành động</th><th>THÀNH VIÊN</th><th>THỦ THƯ</th></tr></thead>
<tbody>
<tr><td>Cho mượn một bản</td><td>❌ 403</td><td>✅</td></tr>
<tr><td>Trả lượt mượn của chính mình</td><td>✅</td><td>✅ (bất kỳ)</td></tr>
<tr><td>Trả lượt mượn của người khác</td><td>❌ 403</td><td>✅</td></tr>
<tr><td>Đặt trước một cuốn</td><td>✅</td><td>—</td></tr>
<tr><td>Quản lý quá hạn / mở đặt trước</td><td>❌ 403</td><td>✅</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Bẫy:</strong> kiểm role nhưng quên quyền sở hữu. Nếu bất kỳ thành viên đã đăng nhập nào có thể trả hay huỷ <em>bất kỳ</em> lượt mượn nào bằng cách đổi id trên URL, đó là lỗ hổng broken-access-control (OWASP #1). Luôn xác minh tài nguyên thuộc về người gọi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>401 vs 403 — nói đúng cái.</b> <code>401 Unauthorized</code> nghĩa "tôi không biết bạn là ai" (thiếu/hết hạn token — đăng nhập lại). <code>403 Forbidden</code> nghĩa "tôi biết bạn là ai, nhưng bạn không được làm việc này" (sai role hoặc không phải tài nguyên của bạn). Trả nhầm làm rối xử lý lỗi ở frontend. <em>Vì sao ngoài syllabus: khác biệt ngữ nghĩa này tinh tế và bị làm sai liên tục, kể cả ở API production.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Flibrary-management-system%2Flearn&reflabel=INT602#module-955" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Phân quyền theo vai trò trên Code Lab</span><span class="lc-sub">Role, authority và bảo vệ endpoint, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
  ],
};
