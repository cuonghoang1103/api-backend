/**
 * INT601 — Clinic Appointment Booking System (Kỳ 6 — Thực tập, project #1).
 * Web full-stack: Spring Boot 3 (Java 17) REST API + React (Vite) SPA + PostgreSQL.
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản quay video)
 * → domain/DB design → backend setup → auth/JWT → booking core (slot-conflict) → frontend
 * → testing (kèm test đồng thời) → deployment (Docker) → nâng cao (★ ngoài giáo trình).
 * Song ngữ EN/VN đối xứng. Code Spring/React <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Deep-link CodeLab java-core/spring-boot/sql/react; Git/Docker → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT601.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (React/Spring) = \${ ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT601',
    title: 'Clinic Appointment Booking System',
    slug: 'clinic-appointment-booking-system',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #1 — build a real clinic appointment booking web app end-to-end: Spring Boot 3 REST API + React SPA + PostgreSQL, with JWT auth, two roles, and a race-safe booking core that blocks double-booking. Ship it with Docker.|||Đồ án thực tập #1 — xây một web đặt lịch khám thật từ đầu đến cuối: Spring Boot 3 REST API + React SPA + PostgreSQL, có JWT auth, hai vai trò và lõi đặt lịch an toàn khi tranh chấp (chống đặt trùng). Triển khai bằng Docker.',
    description: 'INT601 là đồ án thực tập đầu tiên của Kỳ 6: bạn xây một hệ thống ĐẶT LỊCH KHÁM (Clinic Appointment Booking) hoàn chỉnh theo kiến trúc client–server. Backend là REST API viết bằng Spring Boot 3 + Java 17, dữ liệu lưu trong PostgreSQL qua Spring Data JPA; frontend là Single-Page App viết bằng React (Vite) gọi API qua axios. Hệ thống có hai vai trò (Bệnh nhân và Lễ tân), xác thực bằng JWT và phân quyền theo role. Trọng tâm kỹ thuật là LÕI GIAO DỊCH: bệnh nhân đặt một khung giờ trống của bác sĩ, hệ thống phải CHẶN đặt trùng ngay cả khi hai người bấm cùng lúc — bạn sẽ học ràng buộc UNIQUE + khoá lạc quan (optimistic locking) để làm đúng. Cuối cùng đóng gói cả hệ bằng Docker Compose và viết kịch bản demo để quay video. Đây là dự án "xương sống" của thực tập full-stack: mọi project web khác đều là biến thể của khuôn này.',
    whatYouLearn: 'Thiết kế domain & ERD cho nghiệp vụ đặt lịch (User/Doctor/Patient/Slot/Appointment); dựng REST API Spring Boot 3 theo kiến trúc phân lớp Controller→Service→Repository; JPA/Hibernate + PostgreSQL, DTO & mapping, Bean Validation; xác thực JWT + phân quyền theo role với Spring Security; thiết kế API sạch (status code, error shape, phân trang); LÕI ĐẶT LỊCH an toàn khi tranh chấp (UNIQUE constraint + @Version optimistic locking + transaction); React (Vite) SPA: routing, auth context, gọi API bằng axios interceptor, form đặt lịch theo lịch khung giờ; kiểm thử unit + integration (JUnit 5, MockMvc) và một test đồng thời chứng minh chống đặt trùng; đóng gói Docker Compose (api + web + db) + biến môi trường; và một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học PRO192 (Java/OOP), DBI202 (CSDL/SQL), PRJ301 (Java web/MVC) và FER202 (React). Cần: JDK 17, một IDE (IntelliJ IDEA khuyên dùng), Node.js LTS, Docker Desktop, một client test API (Postman hoặc REST Client trong VS Code) và một tài khoản GitHub cho nhóm.',
    documentsNote: 'Tham chiếu: Spring Boot Reference Documentation (docs.spring.io) • Spring Data JPA Reference • Spring Security Reference • React docs (react.dev) • PostgreSQL Documentation • jwt.io. Công cụ: IntelliJ IDEA + VS Code, Postman, DBeaver/pgAdmin, Docker Desktop, draw.io (ERD). Luyện code: track Code Lab Java Core + Spring Boot + SQL + React. Git & Docker: Exp Hub. Đây là project-course thực tập — vừa xây vừa quay video theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc client–server, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int601-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một web đặt lịch khám thật, kiến trúc client–server, và bản đồ vòng đời từ ERD tới Docker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — Clinic Appointment Booking</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, deployable web application: a <strong>clinic appointment booking system</strong> where a patient books a free time-slot of a doctor, and a receptionist confirms it — and the system <strong>refuses to double-book a slot</strong> even under two simultaneous clicks. By the end you have a running full-stack app, tested and shipped in Docker, plus a recorded demo.</p>
<p>Every web project in your internship is a variation of this skeleton: an authenticated <strong>REST API</strong> over a relational database, a <strong>Single-Page App</strong> that consumes it, and one <strong>transactional core</strong> that must stay correct under concurrency. Master this one and the others are re-skins.</p>

<h3>The system in one picture — client / server / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">React SPA (browser)</div><div class="lz-d">Vite · axios · UI đặt lịch</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Spring Boot REST API</div><div class="lz-d">Controller→Service→Repository · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · doctors · slots · appointments</div></div>
</div>
<div class="diagram">Browser  ──HTTP/JSON──▶  Spring Boot API  ──JDBC/JPA──▶  PostgreSQL
  React            (port 8080)                      (port 5432)
  (port 5173)   Authorization: Bearer &lt;JWT&gt;      UNIQUE(slot_id)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design</div><div class="lz-nsub">Roles &amp; use cases · ERD · schema · the UNIQUE that prevents double-booking</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Spring Boot project &amp; layers</div><div class="lz-nsub">Entities · repositories · services · controllers · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">Register/login · Spring Security · Patient vs Receptionist</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The booking core</div><div class="lz-nsub">Book a slot · block double-booking · optimistic locking · transactions</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">React SPA</div><div class="lz-nsub">Routing · auth context · axios interceptor · booking screen</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">JUnit · MockMvc · a concurrency test that proves no double-booking</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose: api + web + db · env config · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Pessimistic locking · reminders · reporting · CI</div><div class="lz-nsub">Ship like a real engineering team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — login → see slots → book one → it appears — then grow it. A tiny end-to-end flow that runs beats a huge design that never compiles.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Practice Spring Boot on Code Lab</span><span class="lc-sub">Warm up REST controllers, JPA and services before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — Hệ thống đặt lịch khám</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một ứng dụng web thật, triển khai được: <strong>hệ thống đặt lịch khám</strong>, nơi bệnh nhân đặt một khung giờ trống của bác sĩ và lễ tân xác nhận — và hệ thống <strong>từ chối đặt trùng một khung giờ</strong> kể cả khi hai người bấm cùng lúc. Kết thúc, bạn có một app full-stack chạy được, đã test và đóng gói Docker, kèm một video demo.</p>
<p>Mọi đồ án web trong kỳ thực tập đều là biến thể của bộ khung này: một <strong>REST API</strong> có xác thực trên CSDL quan hệ, một <strong>Single-Page App</strong> tiêu thụ nó, và một <strong>lõi giao dịch</strong> phải luôn đúng khi tranh chấp. Làm chủ cái này thì các đồ án khác chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — client / server / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">React SPA (trình duyệt)</div><div class="lz-d">Vite · axios · UI đặt lịch</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Spring Boot REST API</div><div class="lz-d">Controller→Service→Repository · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · doctors · slots · appointments</div></div>
</div>
<div class="diagram">Trình duyệt ──HTTP/JSON──▶  Spring Boot API  ──JDBC/JPA──▶  PostgreSQL
  React            (cổng 8080)                      (cổng 5432)
  (cổng 5173)   Authorization: Bearer &lt;JWT&gt;      UNIQUE(slot_id)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL</div><div class="lz-nsub">Vai trò &amp; use case · ERD · schema · ràng buộc UNIQUE chống đặt trùng</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Dự án Spring Boot &amp; các lớp</div><div class="lz-nsub">Entity · repository · service · controller · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (JWT)</div><div class="lz-nsub">Đăng ký/đăng nhập · Spring Security · Bệnh nhân vs Lễ tân</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lõi đặt lịch</div><div class="lz-nsub">Đặt một khung giờ · chặn đặt trùng · optimistic locking · transaction</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">React SPA</div><div class="lz-nsub">Routing · auth context · axios interceptor · màn hình đặt lịch</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">JUnit · MockMvc · một test đồng thời chứng minh không đặt trùng</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose: api + web + db · cấu hình env · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Pessimistic locking · nhắc lịch · báo cáo · CI</div><div class="lz-nsub">Ship như một đội kỹ sư thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — đăng nhập → thấy khung giờ → đặt một cái → nó hiện ra — rồi mới mở rộng. Một luồng nhỏ chạy được từ đầu đến cuối hơn hẳn một bản thiết kế đồ sộ không bao giờ biên dịch.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Luyện Spring Boot trên Code Lab</span><span class="lc-sub">Khởi động REST controller, JPA và service trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int601-pham-vi',
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
  <div class="kv"><span class="k">PATIENT</span><span class="v">Register/login · browse a doctor's free slots · book one · view / cancel own appointments</span></div>
  <div class="kv"><span class="k">RECEPTIONIST</span><span class="v">Login · see the day's appointments · confirm or reject · open new slots for doctors</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">PATIENT picks a FREE slot ──▶ POST /appointments ──▶ slot becomes BOOKED
        │                                                     │
        │ second patient picks the SAME slot ──▶ 409 Conflict ┘  (blocked)
        ▼
RECEPTIONIST confirms ──▶ appointment status: PENDING ──▶ CONFIRMED</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A patient can register, log in, and receive a JWT</td><td>POST /auth/register then /auth/login returns a token</td></tr>
<tr><td>2</td><td>A patient sees only FREE slots of a doctor</td><td>GET /doctors/{id}/slots?status=FREE</td></tr>
<tr><td>3</td><td>Booking a free slot creates a PENDING appointment and marks the slot BOOKED</td><td>POST /appointments → 201 + slot flips</td></tr>
<tr><td>4</td><td><b>Double-booking is impossible</b></td><td>two concurrent POSTs for one slot → exactly one 201, one 409</td></tr>
<tr><td>5</td><td>Only a RECEPTIONIST can confirm/reject</td><td>PATIENT calling the confirm endpoint → 403</td></tr>
<tr><td>6</td><td>A patient can cancel only their own appointment</td><td>cancelling another user's appointment → 403</td></tr>
<tr><td>7</td><td>The whole system runs from one <code>docker compose up</code></td><td>web on :5173, api on :8080, db healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> Real SMS/email reminders, online payments, video consultation, an AI symptom-checker as a core feature. Simulate reminders with a log line or a mock. Depth on the booking core scores; breadth with nothing finished does not.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 7). "Definition of Done = the tests are green" removes every argument about whether a feature works. <em>Why beyond syllabus: turning a checklist into executable specs is exactly how professional teams gate a release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một lõi giao dịch, vài màn hình</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BỆNH NHÂN</span><span class="v">Đăng ký/đăng nhập · xem khung giờ trống của bác sĩ · đặt một khung · xem / huỷ lịch của mình</span></div>
  <div class="kv"><span class="k">LỄ TÂN</span><span class="v">Đăng nhập · xem lịch trong ngày · xác nhận hoặc từ chối · mở khung giờ mới cho bác sĩ</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">BỆNH NHÂN chọn khung TRỐNG ──▶ POST /appointments ──▶ khung thành BOOKED
        │                                                     │
        │ bệnh nhân thứ 2 chọn ĐÚNG khung đó ──▶ 409 Conflict ┘  (bị chặn)
        ▼
LỄ TÂN xác nhận ──▶ trạng thái lịch: PENDING ──▶ CONFIRMED</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Bệnh nhân đăng ký, đăng nhập, nhận JWT</td><td>POST /auth/register rồi /auth/login trả token</td></tr>
<tr><td>2</td><td>Bệnh nhân chỉ thấy khung TRỐNG của bác sĩ</td><td>GET /doctors/{id}/slots?status=FREE</td></tr>
<tr><td>3</td><td>Đặt một khung trống tạo lịch PENDING và đánh dấu khung BOOKED</td><td>POST /appointments → 201 + khung đổi trạng thái</td></tr>
<tr><td>4</td><td><b>Không thể đặt trùng</b></td><td>hai POST đồng thời cho một khung → đúng một 201, một 409</td></tr>
<tr><td>5</td><td>Chỉ LỄ TÂN được xác nhận/từ chối</td><td>BỆNH NHÂN gọi endpoint xác nhận → 403</td></tr>
<tr><td>6</td><td>Bệnh nhân chỉ huỷ được lịch của chính mình</td><td>huỷ lịch của người khác → 403</td></tr>
<tr><td>7</td><td>Cả hệ chạy từ một lệnh <code>docker compose up</code></td><td>web ở :5173, api ở :8080, db healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Nhắc lịch SMS/email thật, thanh toán online, khám qua video, "AI chẩn đoán triệu chứng" làm tính năng lõi. Hãy giả lập nhắc lịch bằng một dòng log hoặc mock. Sâu ở lõi đặt lịch mới ăn điểm; ôm rộng mà chẳng xong thì không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 7). "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc một tính năng có chạy hay không. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int601-tech-stack',
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
  <div class="lz-layer"><b>Database — PostgreSQL 16</b><br/>A real, free, ACID relational database. <em>Why: transactions and UNIQUE constraints are what make double-booking impossible; Postgres is the industry default.</em></div>
  <div class="lz-layer"><b>Ship — Docker Compose</b><br/>Three containers (web, api, db) started by one command. <em>Why: "runs on my machine" becomes "runs anywhere"; graders love a one-command demo.</em></div>
</div>

<h3>The request journey — how a click becomes a row</h3>
<div class="diagram">Click "Book"  →  axios POST /api/appointments  (JWT in header)
   →  Spring Security filter validates JWT
   →  AppointmentController.book(dto)
   →  AppointmentService.book()   @Transactional
   →  SlotRepository.save()  +  AppointmentRepository.save()
   →  Hibernate INSERT ... ; UPDATE slot SET status='BOOKED'
   →  PostgreSQL commits (or 409 if the UNIQUE fires)
   →  201 Created  →  React shows "Booked!"</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A stack is a set of trade-offs, not a fashion.</b> You could swap Spring Boot for Node/Express, or Postgres for MySQL, and the architecture would be identical — the same three layers, the same UNIQUE constraint. Reviewers respect a student who can say "I chose X over Y because…". <em>Why beyond syllabus: the syllabus teaches one stack; real engineering is choosing among many for reasons.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
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
  <div class="lz-layer"><b>CSDL — PostgreSQL 16</b><br/>Một CSDL quan hệ thật, miễn phí, ACID. <em>Vì sao: transaction và ràng buộc UNIQUE chính là thứ khiến việc đặt trùng không thể xảy ra; Postgres là mặc định của ngành.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker Compose</b><br/>Ba container (web, api, db) khởi động bằng một lệnh. <em>Vì sao: "chạy trên máy tôi" thành "chạy ở mọi nơi"; giám khảo thích demo một lệnh.</em></div>
</div>

<h3>Hành trình một request — một cú click thành một dòng dữ liệu</h3>
<div class="diagram">Bấm "Đặt lịch"  →  axios POST /api/appointments  (JWT trong header)
   →  Spring Security filter kiểm JWT
   →  AppointmentController.book(dto)
   →  AppointmentService.book()   @Transactional
   →  SlotRepository.save()  +  AppointmentRepository.save()
   →  Hibernate INSERT ... ; UPDATE slot SET status='BOOKED'
   →  PostgreSQL commit (hoặc 409 nếu UNIQUE kích hoạt)
   →  201 Created  →  React hiện "Đã đặt!"</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một stack là tập hợp các đánh đổi, không phải mốt thời trang.</b> Bạn có thể thay Spring Boot bằng Node/Express, hay Postgres bằng MySQL, và kiến trúc vẫn y hệt — cùng ba lớp, cùng ràng buộc UNIQUE. Hội đồng nể một sinh viên biết nói "tôi chọn X thay vì Y vì…". <em>Vì sao ngoài syllabus: giáo trình dạy một stack; kỹ nghệ thật là chọn giữa nhiều lựa chọn có lý do.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Ôn React trên Code Lab</span><span class="lc-sub">Component, hook và fetch dữ liệu — nửa frontend của đồ án này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int601-cai-dat',
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

<div class="callout ok"><strong>Fastest Postgres:</strong> don't install it — run it in Docker. <code>docker run --name clinic-db -e POSTGRES_PASSWORD=clinic -e POSTGRES_DB=clinic -p 5432:5432 -d postgres:16</code>. One command, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int601-cai-dat-moi-truong?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
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

<div class="callout ok"><strong>Postgres nhanh nhất:</strong> đừng cài — chạy trong Docker. <code>docker run --name clinic-db -e POSTGRES_PASSWORD=clinic -e POSTGRES_DB=clinic -p 5432:5432 -d postgres:16</code>. Một lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int601-cai-dat-moi-truong?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
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
          slug: 'int601-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng lõi, "khoảnh khắc chống đặt trùng", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the one thing that is hard: <strong>the double-booking is blocked live, on camera</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is a clinic booking app. Two roles, and it cannot double-book a slot. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Patient flow (2m)</div><div class="lz-nsub">Register → login (show the JWT in DevTools) → pick a doctor → see FREE slots → book one → it appears as PENDING in "My appointments".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — The money shot (1.5m)</div><div class="lz-nsub">Two browser windows, two patients, same slot, click at the same time. One succeeds, one gets a clear "slot already booked" error. Then run the concurrency test in the terminal — green.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Receptionist flow (1.5m)</div><div class="lz-nsub">Log in as receptionist → see today's appointments → confirm one → patient's status flips to CONFIRMED. Show a patient being blocked (403) from the confirm endpoint.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Under the hood (1.5m)</div><div class="lz-nsub">One command: <code>docker compose up</code>. Show the ERD, the UNIQUE constraint, the <code>@Version</code> field. Explain in one sentence why double-booking is impossible.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Close (30s)</div><div class="lz-nsub">"Stack: Spring Boot, React, PostgreSQL, Docker. Repo link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (never demo on an empty DB). Increase your editor/browser font size. Do one dry run. Record in 1080p. Keep mouse movements slow. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The demo is a product, not an afterthought.</b> Interviewers watch the first 60 seconds and the "hard part". Lead with the architecture and end with the concurrency proof — that ordering signals engineering maturity far more than a tour of every CRUD screen. <em>Why beyond syllabus: communication of your work is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD and a schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng thứ khó: <strong>việc đặt trùng bị chặn ngay trên video</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là app đặt lịch khám. Hai vai trò, và không thể đặt trùng một khung giờ. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng bệnh nhân (2m)</div><div class="lz-nsub">Đăng ký → đăng nhập (chỉ JWT trong DevTools) → chọn bác sĩ → thấy khung TRỐNG → đặt một cái → hiện là PENDING trong "Lịch của tôi".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — Cảnh đắt giá (1.5m)</div><div class="lz-nsub">Hai cửa sổ trình duyệt, hai bệnh nhân, cùng một khung, bấm cùng lúc. Một thành công, một nhận lỗi rõ "khung đã được đặt". Rồi chạy test đồng thời trong terminal — xanh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Luồng lễ tân (1.5m)</div><div class="lz-nsub">Đăng nhập lễ tân → xem lịch hôm nay → xác nhận một cái → trạng thái bệnh nhân đổi thành CONFIRMED. Cho thấy bệnh nhân bị chặn (403) khỏi endpoint xác nhận.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Bên trong (1.5m)</div><div class="lz-nsub">Một lệnh: <code>docker compose up</code>. Chiếu ERD, ràng buộc UNIQUE, trường <code>@Version</code>. Giải thích một câu vì sao không thể đặt trùng.</div></div></div>
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
      description: 'Biến hai vai trò thành use case, ERD và một schema chuẩn hoá — với ràng buộc UNIQUE là trái tim chống đặt trùng.',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int601-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, Doctor, Slot, Appointment và quan hệ giữa chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"A <b>patient</b> books a <b>slot</b> of a <b>doctor</b>, creating an <b>appointment</b>; a <b>receptionist</b> confirms it." The nouns give us four core entities plus the account:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (PATIENT or RECEPTIONIST), email, password hash. Both roles are Users; role decides permissions.</div>
  <div class="lz-layer"><b>Doctor</b> — a name + specialty. A doctor <em>has many</em> slots. (Doctors don't log in in this scope — the receptionist manages them.)</div>
  <div class="lz-layer"><b>Slot</b> — a specific bookable time of a doctor: <code>doctor_id</code>, <code>start_time</code>, <code>status</code> (FREE / BOOKED). This is the resource that must never be double-booked.</div>
  <div class="lz-layer"><b>Appointment</b> — the booking itself: which <code>patient</code> booked which <code>slot</code>, its <code>status</code> (PENDING / CONFIRMED / REJECTED / CANCELLED) and when it was created.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────┐        ┌──────────┐        ┌──────────────┐
│  Doctor  │1──────*│   Slot   │1──────1│ Appointment  │
└──────────┘        └──────────┘        └──────────────┘
                                              *│
                                               │1
                                         ┌──────────┐
                                         │   User   │ (role = PATIENT)
                                         └──────────┘

Doctor 1—* Slot     : a doctor has many slots
Slot   1—1 Appointment : a slot holds at most ONE active appointment  ← the rule
User   1—* Appointment : a patient has many appointments</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> Dr. Lan has 3 free slots on Monday. Patient An books the 9:00 slot.
<b>Step 1 —</b> An sends POST /appointments { slotId: 9:00-slot }.
<b>Step 2 —</b> The system creates an Appointment row: patient=An, slot=9:00, status=PENDING.
<b>Step 3 —</b> The 9:00 Slot flips status FREE → BOOKED.
<b>Step 4 —</b> Patient Binh now asks for Dr. Lan's free slots → gets only 8:00 and 10:00 (9:00 is gone).
<b>Result:</b> the 1—1 between Slot and active Appointment is what makes 9:00 disappear for Binh.</div>

<div class="pitfall"><strong>Design trap:</strong> putting <code>patient_id</code> directly on <code>Slot</code> and skipping the Appointment table. Then you cannot store booking status, cancellation, or history — and a cancelled-then-rebooked slot loses its past. Keep the booking as its own entity.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"At most one ACTIVE appointment per slot" is a state constraint, not just a foreign key.</b> A slot can have many appointment rows over time (one booked, cancelled, then rebooked) — the invariant is only one <em>non-cancelled</em> at a time. In 1.2 we enforce the simple version with a UNIQUE on <code>slot_id</code> + a status flip; the richer version uses a partial unique index. <em>Why beyond syllabus: distinguishing "unique row" from "unique active state" is a modelling skill most juniors miss.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice schema &amp; JOINs on Code Lab</span><span class="lc-sub">DDL, foreign keys and queries — the SQL under your JPA entities.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>bệnh nhân</b> đặt một <b>khung giờ</b> của một <b>bác sĩ</b>, tạo ra một <b>lịch hẹn</b>; một <b>lễ tân</b> xác nhận nó." Các danh từ cho ta bốn thực thể lõi cộng với tài khoản:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (PATIENT hoặc RECEPTIONIST), email, hash mật khẩu. Cả hai vai trò đều là User; role quyết định quyền.</div>
  <div class="lz-layer"><b>Doctor</b> — tên + chuyên khoa. Một bác sĩ <em>có nhiều</em> khung giờ. (Trong phạm vi này bác sĩ không đăng nhập — lễ tân quản lý.)</div>
  <div class="lz-layer"><b>Slot</b> — một khung giờ đặt được cụ thể của bác sĩ: <code>doctor_id</code>, <code>start_time</code>, <code>status</code> (FREE / BOOKED). Đây là tài nguyên không được phép đặt trùng.</div>
  <div class="lz-layer"><b>Appointment</b> — chính lượt đặt: <code>patient</code> nào đặt <code>slot</code> nào, <code>status</code> của nó (PENDING / CONFIRMED / REJECTED / CANCELLED) và thời điểm tạo.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────┐        ┌──────────┐        ┌──────────────┐
│  Doctor  │1──────*│   Slot   │1──────1│ Appointment  │
└──────────┘        └──────────┘        └──────────────┘
                                              *│
                                               │1
                                         ┌──────────┐
                                         │   User   │ (role = PATIENT)
                                         └──────────┘

Doctor 1—* Slot        : một bác sĩ có nhiều khung giờ
Slot   1—1 Appointment : một khung giữ TỐI ĐA MỘT lịch đang hoạt động  ← quy tắc
User   1—* Appointment : một bệnh nhân có nhiều lịch</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> BS Lan có 3 khung trống thứ Hai. Bệnh nhân An đặt khung 9:00.
<b>Bước 1 —</b> An gửi POST /appointments { slotId: khung-9:00 }.
<b>Bước 2 —</b> Hệ thống tạo một dòng Appointment: patient=An, slot=9:00, status=PENDING.
<b>Bước 3 —</b> Khung 9:00 đổi status FREE → BOOKED.
<b>Bước 4 —</b> Bệnh nhân Bình giờ hỏi khung trống của BS Lan → chỉ còn 8:00 và 10:00 (9:00 đã mất).
<b>Kết quả:</b> quan hệ 1—1 giữa Slot và Appointment đang hoạt động chính là thứ khiến 9:00 biến mất với Bình.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> đặt thẳng <code>patient_id</code> lên <code>Slot</code> và bỏ bảng Appointment. Khi đó bạn không lưu được trạng thái đặt, việc huỷ, hay lịch sử — và một khung bị-huỷ-rồi-đặt-lại mất quá khứ. Hãy giữ lượt đặt là một thực thể riêng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Tối đa một lịch ĐANG HOẠT ĐỘNG mỗi khung" là ràng buộc trạng thái, không chỉ là khoá ngoại.</b> Một khung có thể có nhiều dòng appointment theo thời gian (một cái đặt, huỷ, rồi đặt lại) — bất biến là chỉ một cái <em>chưa huỷ</em> tại một thời điểm. Ở 1.2 ta thực thi phiên bản đơn giản bằng UNIQUE trên <code>slot_id</code> + đổi status; phiên bản đầy đủ dùng partial unique index. <em>Vì sao ngoài syllabus: phân biệt "dòng duy nhất" với "trạng thái hoạt động duy nhất" là kỹ năng mô hình hoá đa số junior bỏ sót.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Luyện schema &amp; JOIN trên Code Lab</span><span class="lc-sub">DDL, khoá ngoại và truy vấn — phần SQL nằm dưới các JPA entity của bạn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The schema & the constraint that prevents double-booking|||1.2 — Schema & ràng buộc chống đặt trùng',
          slug: 'int601-schema',
          type: 'VIDEO',
          description: 'DDL PostgreSQL đầy đủ + ràng buộc UNIQUE trên slot_id: hàng rào cuối cùng chống đặt trùng, do CSDL bảo đảm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The schema &amp; the constraint that prevents double-booking</h2>
<p class="lead">Here is the whole database. Notice one line — the <code>UNIQUE</code> on <code>appointments.slot_id</code>. That single constraint is your <strong>last line of defence</strong>: even if two requests slip past every check in your Java code, the database itself refuses to write two active appointments for one slot.</p>

<h3>The DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- bcrypt hash</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- PATIENT | RECEPTIONIST</span>
);

<span class="tok-keyword">CREATE TABLE</span> doctors (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  specialty   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>
);

<span class="tok-keyword">CREATE TABLE</span> slots (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  doctor_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> doctors(id),
  start_time  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL</span>,
  status      <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'FREE'</span>,  <span class="tok-comment">-- FREE | BOOKED</span>
  version     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-number">0</span>,        <span class="tok-comment">-- optimistic lock (Section 4)</span>
  <span class="tok-keyword">UNIQUE</span> (doctor_id, start_time)              <span class="tok-comment">-- no two slots at the same doctor+time</span>
);

<span class="tok-keyword">CREATE TABLE</span> appointments (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  slot_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> slots(id),
  patient_id  <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  status      <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'PENDING'</span>, <span class="tok-comment">-- PENDING|CONFIRMED|REJECTED|CANCELLED</span>
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  <span class="tok-keyword">CONSTRAINT</span> uq_active_slot <span class="tok-keyword">UNIQUE</span> (slot_id)      <span class="tok-comment">-- ★ one appointment per slot</span>
);</pre>

<h3>Worked example — why the UNIQUE is the real guard</h3>
<div class="out"><b>Scenario:</b> two INSERTs for slot_id = 42 arrive at the same millisecond.
<b>Step 1 —</b> Transaction A: INSERT appointment (slot_id=42) → row locked, not yet committed.
<b>Step 2 —</b> Transaction B: INSERT appointment (slot_id=42) → PostgreSQL sees the pending unique key → <b>B waits</b>.
<b>Step 3 —</b> A commits. The unique key (slot_id=42) now exists.
<b>Step 4 —</b> B is released → its INSERT violates <code>uq_active_slot</code> → <b>ERROR: duplicate key value violates unique constraint</b>.
<b>Result:</b> exactly one appointment exists. Your Java code will catch this exception and return <b>409 Conflict</b>. The database, not your <code>if</code>-statement, is what guarantees correctness.</div>

<div class="pitfall"><strong>Trap:</strong> relying only on a Java check like <code>if (slot.getStatus() == FREE)</code>. Between your read and your write, another request can read the same FREE status — the classic <em>race condition</em>. The Java check is a fast path for the common case; the UNIQUE constraint is the guarantee. You need both. Section 4 shows the full defence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The richer rule with a partial index.</b> To allow a cancelled slot to be re-booked while still forbidding two <em>active</em> bookings, drop the plain UNIQUE and use:
<pre><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_appt
  <span class="tok-keyword">ON</span> appointments (slot_id)
  <span class="tok-keyword">WHERE</span> status <span class="tok-keyword">IN</span> (<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>);</pre>
Now a slot can have one CANCELLED row plus one active row. <em>Why beyond syllabus: partial (filtered) indexes are a Postgres power feature that models "unique among active rows" — exactly the state constraint from 1.1.</em></div>

<div class="note-ct">In Spring Data JPA (Section 2) you won't write this DDL by hand — you annotate entities and Hibernate generates it. But knowing the SQL underneath is what lets you debug when generation surprises you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Schema &amp; ràng buộc chống đặt trùng</h2>
<p class="lead">Đây là toàn bộ CSDL. Chú ý một dòng — <code>UNIQUE</code> trên <code>appointments.slot_id</code>. Ràng buộc đơn lẻ đó là <strong>hàng rào cuối cùng</strong>: kể cả khi hai request lọt qua mọi kiểm tra trong code Java, chính CSDL từ chối ghi hai lịch hoạt động cho một khung.</p>

<h3>DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- hash bcrypt</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- PATIENT | RECEPTIONIST</span>
);

<span class="tok-keyword">CREATE TABLE</span> doctors (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  specialty   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>
);

<span class="tok-keyword">CREATE TABLE</span> slots (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  doctor_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> doctors(id),
  start_time  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL</span>,
  status      <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'FREE'</span>,  <span class="tok-comment">-- FREE | BOOKED</span>
  version     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-number">0</span>,        <span class="tok-comment">-- optimistic lock (Mục 4)</span>
  <span class="tok-keyword">UNIQUE</span> (doctor_id, start_time)              <span class="tok-comment">-- không hai khung cùng bác sĩ+giờ</span>
);

<span class="tok-keyword">CREATE TABLE</span> appointments (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  slot_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> slots(id),
  patient_id  <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  status      <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'PENDING'</span>, <span class="tok-comment">-- PENDING|CONFIRMED|REJECTED|CANCELLED</span>
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  <span class="tok-keyword">CONSTRAINT</span> uq_active_slot <span class="tok-keyword">UNIQUE</span> (slot_id)      <span class="tok-comment">-- ★ một lịch mỗi khung</span>
);</pre>

<h3>Ví dụ có lời giải — vì sao UNIQUE mới là người gác thật</h3>
<div class="out"><b>Tình huống:</b> hai INSERT cho slot_id = 42 tới cùng một mili-giây.
<b>Bước 1 —</b> Giao dịch A: INSERT appointment (slot_id=42) → dòng bị khoá, chưa commit.
<b>Bước 2 —</b> Giao dịch B: INSERT appointment (slot_id=42) → PostgreSQL thấy khoá unique đang chờ → <b>B đợi</b>.
<b>Bước 3 —</b> A commit. Khoá unique (slot_id=42) giờ tồn tại.
<b>Bước 4 —</b> B được thả → INSERT của nó vi phạm <code>uq_active_slot</code> → <b>ERROR: duplicate key value violates unique constraint</b>.
<b>Kết quả:</b> đúng một lịch tồn tại. Code Java của bạn sẽ bắt ngoại lệ này và trả <b>409 Conflict</b>. Chính CSDL, không phải câu <code>if</code>, mới bảo đảm tính đúng.</div>

<div class="pitfall"><strong>Bẫy:</strong> chỉ dựa vào một kiểm tra Java kiểu <code>if (slot.getStatus() == FREE)</code>. Giữa lúc bạn đọc và lúc bạn ghi, một request khác có thể đọc cùng trạng thái FREE — đây là <em>race condition</em> kinh điển. Kiểm tra Java là đường nhanh cho trường hợp thường; ràng buộc UNIQUE là sự bảo đảm. Cần cả hai. Mục 4 chỉ cách phòng thủ đầy đủ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy tắc đầy đủ với partial index.</b> Để cho phép đặt lại một khung đã huỷ mà vẫn cấm hai lịch <em>đang hoạt động</em>, bỏ UNIQUE thường và dùng:
<pre><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_appt
  <span class="tok-keyword">ON</span> appointments (slot_id)
  <span class="tok-keyword">WHERE</span> status <span class="tok-keyword">IN</span> (<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>);</pre>
Giờ một khung có thể có một dòng CANCELLED cộng một dòng hoạt động. <em>Vì sao ngoài syllabus: partial (filtered) index là tính năng mạnh của Postgres mô hình hoá "duy nhất giữa các dòng hoạt động" — chính là ràng buộc trạng thái ở 1.1.</em></div>

<div class="note-ct">Trong Spring Data JPA (Mục 2) bạn không viết DDL này bằng tay — bạn annotate entity và Hibernate sinh ra nó. Nhưng biết SQL bên dưới mới giúp bạn debug khi việc sinh ra gây bất ngờ.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int601-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, cardinality và ràng buộc chống đặt trùng.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which entity must never be double-booked, and where does the guarantee live?|||Thực thể nào không được đặt trùng, và sự bảo đảm nằm ở đâu?',
                options: [
                  'Doctor; guaranteed by a Java if-check|||Doctor; bảo đảm bằng câu if trong Java',
                  'Slot; guaranteed by a UNIQUE constraint in the database|||Slot; bảo đảm bằng ràng buộc UNIQUE trong CSDL',
                  'User; guaranteed by JWT|||User; bảo đảm bằng JWT',
                  'Appointment; guaranteed by the frontend|||Appointment; bảo đảm bằng frontend',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The relationship "a doctor has many slots" is which cardinality?|||Quan hệ "một bác sĩ có nhiều khung giờ" là lực lượng nào?',
                options: ['1—1', '1—* (one-to-many)|||1—* (một-nhiều)', '*—* (many-to-many)|||*—* (nhiều-nhiều)', '0—0'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why keep Appointment as its own table instead of putting patient_id on Slot?|||Vì sao giữ Appointment là bảng riêng thay vì đặt patient_id lên Slot?',
                options: [
                  'It is faster to query|||Truy vấn nhanh hơn',
                  'To store booking status, cancellation and history|||Để lưu trạng thái đặt, việc huỷ và lịch sử',
                  'JPA requires it|||JPA bắt buộc',
                  'To avoid using a foreign key|||Để tránh dùng khoá ngoại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Two INSERTs hit the same slot_id at once with a UNIQUE(slot_id). What happens?|||Hai INSERT cùng slot_id một lúc với UNIQUE(slot_id). Điều gì xảy ra?',
                options: [
                  'Both succeed|||Cả hai thành công',
                  'Both fail|||Cả hai thất bại',
                  'Exactly one commits; the other violates the constraint and is rejected|||Đúng một cái commit; cái kia vi phạm ràng buộc và bị từ chối',
                  'The database crashes|||CSDL sập',
                ], correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) A partial unique index WHERE status IN (PENDING, CONFIRMED) lets you…|||(Ngoài giáo trình) Partial unique index WHERE status IN (PENDING, CONFIRMED) cho phép bạn…',
                options: [
                  'Book two active slots at once|||Đặt hai khung hoạt động cùng lúc',
                  'Re-book a slot after its earlier appointment was cancelled, while still forbidding two active bookings|||Đặt lại một khung sau khi lịch trước đã huỷ, mà vẫn cấm hai lịch đang hoạt động',
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
      description: 'Khởi tạo dự án Spring Boot, ánh xạ entity/repository, và xây một lát cắt dọc "GET khung trống" qua Controller→Service→Repository.',
      lessons: [
        {
          title: '2.1 — Project setup & the layered architecture|||2.1 — Khởi tạo dự án & kiến trúc phân lớp',
          slug: 'int601-backend-setup',
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
    url: \${DB_URL:jdbc:postgresql://localhost:5432/clinic}
    username: \${DB_USER:postgres}
    password: \${DB_PASSWORD:clinic}
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
    expiration-ms: 86400000   <span class="tok-comment"># 24h</span></pre>
<p>The <code>\${VAR:default}</code> syntax reads an environment variable and falls back to a default — the same values will come from Docker in Section 7, with no code change.</p>

<h3>The three layers — one responsibility each</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Controller</b> (<code>@RestController</code>) — HTTP only. Parses the request, validates the DTO, calls a service, maps the result to a status code + JSON. <em>No business logic here.</em></div>
  <div class="lz-layer"><b>Service</b> (<code>@Service</code>) — the business rules. "Is the slot free? Create the appointment, flip the slot." Owns transactions (<code>@Transactional</code>). <em>Knows nothing about HTTP.</em></div>
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

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Spring Boot layers on Code Lab</span><span class="lc-sub">Controllers, services and repositories, hands-on.</span></span>
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
    url: \${DB_URL:jdbc:postgresql://localhost:5432/clinic}
    username: \${DB_USER:postgres}
    password: \${DB_PASSWORD:clinic}
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
    expiration-ms: 86400000   <span class="tok-comment"># 24h</span></pre>
<p>Cú pháp <code>\${VAR:default}</code> đọc một biến môi trường và lùi về giá trị mặc định — chính các giá trị này sẽ đến từ Docker ở Mục 7, không cần đổi code.</p>

<h3>Ba lớp — mỗi lớp một trách nhiệm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Controller</b> (<code>@RestController</code>) — chỉ lo HTTP. Đọc request, validate DTO, gọi service, ánh xạ kết quả sang status code + JSON. <em>Không có business logic ở đây.</em></div>
  <div class="lz-layer"><b>Service</b> (<code>@Service</code>) — quy tắc nghiệp vụ. "Khung có trống không? Tạo lịch, đổi trạng thái khung." Sở hữu transaction (<code>@Transactional</code>). <em>Không biết gì về HTTP.</em></div>
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

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Các lớp Spring Boot trên Code Lab</span><span class="lc-sub">Controller, service và repository, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Entities & repositories|||2.2 — Entity & repository',
          slug: 'int601-entities',
          type: 'VIDEO',
          description: 'Ánh xạ 4 bảng thành JPA entity với @Entity/@ManyToOne, và khai báo repository bằng query-method.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>Entities &amp; repositories</h2>
<p class="lead">Each table becomes a Java class annotated with JPA. Relationships become object references. Then a one-line interface per table gives you full CRUD — no SQL to write.</p>

<h3>The Slot entity</h3>
<pre><span class="tok-keyword">@Entity</span> <span class="tok-keyword">@Table</span>(name = <span class="tok-string">"slots"</span>,
  uniqueConstraints = <span class="tok-keyword">@UniqueConstraint</span>(columnNames = {<span class="tok-string">"doctor_id"</span>, <span class="tok-string">"start_time"</span>}))
<span class="tok-keyword">@Getter</span> <span class="tok-keyword">@Setter</span>  <span class="tok-comment">// Lombok</span>
<span class="tok-keyword">public class</span> <span class="tok-type">Slot</span> {
  <span class="tok-keyword">@Id</span> <span class="tok-keyword">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> id;

  <span class="tok-keyword">@ManyToOne</span>(fetch = FetchType.LAZY) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"doctor_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">Doctor</span> doctor;

  <span class="tok-keyword">private</span> <span class="tok-type">LocalDateTime</span> startTime;

  <span class="tok-keyword">@Enumerated</span>(EnumType.STRING)
  <span class="tok-keyword">private</span> <span class="tok-type">SlotStatus</span> status = SlotStatus.FREE;  <span class="tok-comment">// FREE | BOOKED</span>

  <span class="tok-keyword">@Version</span>                        <span class="tok-comment">// ★ optimistic lock — Section 4 uses this</span>
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> version;
}</pre>

<h3>The Appointment entity — note the UNIQUE</h3>
<pre><span class="tok-keyword">@Entity</span> <span class="tok-keyword">@Table</span>(name = <span class="tok-string">"appointments"</span>,
  uniqueConstraints = <span class="tok-keyword">@UniqueConstraint</span>(name = <span class="tok-string">"uq_active_slot"</span>, columnNames = <span class="tok-string">"slot_id"</span>))
<span class="tok-keyword">@Getter</span> <span class="tok-keyword">@Setter</span>
<span class="tok-keyword">public class</span> <span class="tok-type">Appointment</span> {
  <span class="tok-keyword">@Id</span> <span class="tok-keyword">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> id;

  <span class="tok-keyword">@ManyToOne</span>(optional = <span class="tok-keyword">false</span>) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"slot_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">Slot</span> slot;

  <span class="tok-keyword">@ManyToOne</span>(optional = <span class="tok-keyword">false</span>) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"patient_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">User</span> patient;

  <span class="tok-keyword">@Enumerated</span>(EnumType.STRING)
  <span class="tok-keyword">private</span> <span class="tok-type">AppointmentStatus</span> status = AppointmentStatus.PENDING;

  <span class="tok-keyword">private</span> <span class="tok-type">LocalDateTime</span> createdAt = LocalDateTime.now();
}</pre>

<h3>Repositories — declare, don't implement</h3>
<pre><span class="tok-keyword">public interface</span> <span class="tok-type">SlotRepository</span> <span class="tok-keyword">extends</span> <span class="tok-type">JpaRepository</span>&lt;Slot, Long&gt; {
  <span class="tok-comment">// Spring turns the method name into SQL automatically:</span>
  <span class="tok-type">List</span>&lt;Slot&gt; <span class="tok-function">findByDoctorIdAndStatus</span>(<span class="tok-type">Long</span> doctorId, <span class="tok-type">SlotStatus</span> status);
}

<span class="tok-keyword">public interface</span> <span class="tok-type">AppointmentRepository</span> <span class="tok-keyword">extends</span> <span class="tok-type">JpaRepository</span>&lt;Appointment, Long&gt; {
  <span class="tok-type">List</span>&lt;Appointment&gt; <span class="tok-function">findByPatientId</span>(<span class="tok-type">Long</span> patientId);
  <span class="tok-keyword">boolean</span> <span class="tok-function">existsBySlotId</span>(<span class="tok-type">Long</span> slotId);
}</pre>
<p><code>findByDoctorIdAndStatus</code> becomes <code>SELECT * FROM slots WHERE doctor_id=? AND status=?</code>. You wrote zero SQL.</p>

<div class="pitfall"><strong>Trap:</strong> <code>FetchType.EAGER</code> on <code>@ManyToOne</code> everywhere. It looks convenient but silently loads whole object graphs on every query — the classic N+1 performance bug. Default to <code>LAZY</code> and fetch what you need explicitly.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b><code>@Enumerated(EnumType.STRING)</code>, never ORDINAL.</b> The default stores an enum as its position (0,1,2). Reorder or insert an enum value later and every stored row silently means something else. Storing the string (<code>'FREE'</code>) is self-describing and reorder-proof. <em>Why beyond syllabus: this is a real production data-corruption trap the syllabus never warns about.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Entity &amp; repository</h2>
<p class="lead">Mỗi bảng thành một lớp Java được annotate JPA. Quan hệ thành tham chiếu đối tượng. Rồi một interface một dòng cho mỗi bảng cho bạn CRUD đầy đủ — không phải viết SQL.</p>

<h3>Entity Slot</h3>
<pre><span class="tok-keyword">@Entity</span> <span class="tok-keyword">@Table</span>(name = <span class="tok-string">"slots"</span>,
  uniqueConstraints = <span class="tok-keyword">@UniqueConstraint</span>(columnNames = {<span class="tok-string">"doctor_id"</span>, <span class="tok-string">"start_time"</span>}))
<span class="tok-keyword">@Getter</span> <span class="tok-keyword">@Setter</span>  <span class="tok-comment">// Lombok</span>
<span class="tok-keyword">public class</span> <span class="tok-type">Slot</span> {
  <span class="tok-keyword">@Id</span> <span class="tok-keyword">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> id;

  <span class="tok-keyword">@ManyToOne</span>(fetch = FetchType.LAZY) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"doctor_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">Doctor</span> doctor;

  <span class="tok-keyword">private</span> <span class="tok-type">LocalDateTime</span> startTime;

  <span class="tok-keyword">@Enumerated</span>(EnumType.STRING)
  <span class="tok-keyword">private</span> <span class="tok-type">SlotStatus</span> status = SlotStatus.FREE;  <span class="tok-comment">// FREE | BOOKED</span>

  <span class="tok-keyword">@Version</span>                        <span class="tok-comment">// ★ optimistic lock — Mục 4 dùng cái này</span>
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> version;
}</pre>

<h3>Entity Appointment — chú ý UNIQUE</h3>
<pre><span class="tok-keyword">@Entity</span> <span class="tok-keyword">@Table</span>(name = <span class="tok-string">"appointments"</span>,
  uniqueConstraints = <span class="tok-keyword">@UniqueConstraint</span>(name = <span class="tok-string">"uq_active_slot"</span>, columnNames = <span class="tok-string">"slot_id"</span>))
<span class="tok-keyword">@Getter</span> <span class="tok-keyword">@Setter</span>
<span class="tok-keyword">public class</span> <span class="tok-type">Appointment</span> {
  <span class="tok-keyword">@Id</span> <span class="tok-keyword">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
  <span class="tok-keyword">private</span> <span class="tok-type">Long</span> id;

  <span class="tok-keyword">@ManyToOne</span>(optional = <span class="tok-keyword">false</span>) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"slot_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">Slot</span> slot;

  <span class="tok-keyword">@ManyToOne</span>(optional = <span class="tok-keyword">false</span>) <span class="tok-keyword">@JoinColumn</span>(name = <span class="tok-string">"patient_id"</span>)
  <span class="tok-keyword">private</span> <span class="tok-type">User</span> patient;

  <span class="tok-keyword">@Enumerated</span>(EnumType.STRING)
  <span class="tok-keyword">private</span> <span class="tok-type">AppointmentStatus</span> status = AppointmentStatus.PENDING;

  <span class="tok-keyword">private</span> <span class="tok-type">LocalDateTime</span> createdAt = LocalDateTime.now();
}</pre>

<h3>Repository — khai báo, không hiện thực</h3>
<pre><span class="tok-keyword">public interface</span> <span class="tok-type">SlotRepository</span> <span class="tok-keyword">extends</span> <span class="tok-type">JpaRepository</span>&lt;Slot, Long&gt; {
  <span class="tok-comment">// Spring biến tên method thành SQL tự động:</span>
  <span class="tok-type">List</span>&lt;Slot&gt; <span class="tok-function">findByDoctorIdAndStatus</span>(<span class="tok-type">Long</span> doctorId, <span class="tok-type">SlotStatus</span> status);
}

<span class="tok-keyword">public interface</span> <span class="tok-type">AppointmentRepository</span> <span class="tok-keyword">extends</span> <span class="tok-type">JpaRepository</span>&lt;Appointment, Long&gt; {
  <span class="tok-type">List</span>&lt;Appointment&gt; <span class="tok-function">findByPatientId</span>(<span class="tok-type">Long</span> patientId);
  <span class="tok-keyword">boolean</span> <span class="tok-function">existsBySlotId</span>(<span class="tok-type">Long</span> slotId);
}</pre>
<p><code>findByDoctorIdAndStatus</code> thành <code>SELECT * FROM slots WHERE doctor_id=? AND status=?</code>. Bạn viết không dòng SQL nào.</p>

<div class="pitfall"><strong>Bẫy:</strong> <code>FetchType.EAGER</code> trên mọi <code>@ManyToOne</code>. Nhìn tiện nhưng lặng lẽ nạp cả đồ thị đối tượng ở mỗi truy vấn — lỗi hiệu năng N+1 kinh điển. Mặc định <code>LAZY</code> và nạp thứ cần một cách tường minh.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b><code>@Enumerated(EnumType.STRING)</code>, đừng bao giờ ORDINAL.</b> Mặc định lưu enum theo vị trí (0,1,2). Sắp xếp lại hay chèn một giá trị enum sau này và mọi dòng đã lưu lặng lẽ mang ý nghĩa khác. Lưu chuỗi (<code>'FREE'</code>) là tự mô tả và bền qua việc sắp lại. <em>Vì sao ngoài syllabus: đây là bẫy hỏng dữ liệu thật ở production mà giáo trình không hề cảnh báo.</em></div>
</div>
`,
        },
        {
          title: '2.3 — Worked slice: GET free slots of a doctor|||2.3 — Lát cắt có lời giải: GET khung trống của bác sĩ',
          slug: 'int601-slice-free-slots',
          type: 'VIDEO',
          description: 'Đi trọn một lát cắt dọc đầu tiên: DTO → Service → Controller → thử bằng curl, có kết quả JSON thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.3</span>
<h2>Worked slice — GET a doctor's free slots</h2>
<p class="lead">Let's ship the first vertical slice end-to-end: an endpoint that returns a doctor's FREE slots as clean JSON. This is the template every other read endpoint copies.</p>

<h3>Step 1 — the DTO (what the API returns, not the entity)</h3>
<pre><span class="tok-keyword">public record</span> <span class="tok-type">SlotDto</span>(<span class="tok-type">Long</span> id, <span class="tok-type">Long</span> doctorId,
                       <span class="tok-type">String</span> doctorName, <span class="tok-type">LocalDateTime</span> startTime,
                       <span class="tok-type">String</span> status) {
  <span class="tok-keyword">public static</span> <span class="tok-type">SlotDto</span> <span class="tok-function">from</span>(<span class="tok-type">Slot</span> s) {
    <span class="tok-keyword">return new</span> <span class="tok-type">SlotDto</span>(s.getId(), s.getDoctor().getId(),
        s.getDoctor().getFullName(), s.getStartTime(), s.getStatus().name());
  }
}</pre>

<h3>Step 2 — the Service (business intent, no HTTP)</h3>
<pre><span class="tok-keyword">@Service</span> <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">SlotService</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">SlotRepository</span> slotRepo;

  <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;SlotDto&gt; <span class="tok-function">freeSlotsOf</span>(<span class="tok-type">Long</span> doctorId) {
    <span class="tok-keyword">return</span> slotRepo.findByDoctorIdAndStatus(doctorId, SlotStatus.FREE)
        .stream().map(SlotDto::from).toList();
  }
}</pre>

<h3>Step 3 — the Controller (HTTP only)</h3>
<pre><span class="tok-keyword">@RestController</span> <span class="tok-keyword">@RequestMapping</span>(<span class="tok-string">"/api/doctors"</span>) <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">DoctorController</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">SlotService</span> slotService;

  <span class="tok-keyword">@GetMapping</span>(<span class="tok-string">"/{id}/slots"</span>)
  <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;SlotDto&gt; <span class="tok-function">freeSlots</span>(<span class="tok-keyword">@PathVariable</span> <span class="tok-type">Long</span> id) {
    <span class="tok-keyword">return</span> slotService.freeSlotsOf(id);
  }
}</pre>

<h3>Step 4 — test it (real output)</h3>
<div class="out"><b>Request:</b>  curl http://localhost:8080/api/doctors/1/slots
<b>Response 200:</b>
[
  { "id": 10, "doctorId": 1, "doctorName": "Dr. Lan",
    "startTime": "2026-08-01T09:00:00", "status": "FREE" },
  { "id": 11, "doctorId": 1, "doctorName": "Dr. Lan",
    "startTime": "2026-08-01T10:00:00", "status": "FREE" }
]</div>
<p>That is a complete slice: request → controller → service → repository → JSON. Every other GET endpoint (my appointments, today's schedule) is this same shape.</p>

<div class="callout ok"><strong>Rhythm to internalise:</strong> DTO first (the contract), then Service (the intent), then Controller (the plumbing). Build inside-out and the compiler guides you.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Java <code>record</code> for DTOs.</b> A <code>record</code> is an immutable data carrier with auto-generated constructor, getters, <code>equals</code> and <code>toString</code> — perfect for DTOs and impossible to accidentally mutate. Older tutorials use a full class with Lombok; records (Java 16+) are the modern, safer default. <em>Why beyond syllabus: records post-date most Java course material but are now idiomatic.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.3</span>
<h2>Lát cắt có lời giải — GET khung trống của bác sĩ</h2>
<p class="lead">Hãy ship lát cắt dọc đầu tiên từ đầu đến cuối: một endpoint trả về khung TRỐNG của bác sĩ dưới dạng JSON sạch. Đây là khuôn mà mọi endpoint đọc khác sao chép lại.</p>

<h3>Bước 1 — DTO (thứ API trả về, không phải entity)</h3>
<pre><span class="tok-keyword">public record</span> <span class="tok-type">SlotDto</span>(<span class="tok-type">Long</span> id, <span class="tok-type">Long</span> doctorId,
                       <span class="tok-type">String</span> doctorName, <span class="tok-type">LocalDateTime</span> startTime,
                       <span class="tok-type">String</span> status) {
  <span class="tok-keyword">public static</span> <span class="tok-type">SlotDto</span> <span class="tok-function">from</span>(<span class="tok-type">Slot</span> s) {
    <span class="tok-keyword">return new</span> <span class="tok-type">SlotDto</span>(s.getId(), s.getDoctor().getId(),
        s.getDoctor().getFullName(), s.getStartTime(), s.getStatus().name());
  }
}</pre>

<h3>Bước 2 — Service (ý định nghiệp vụ, không HTTP)</h3>
<pre><span class="tok-keyword">@Service</span> <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">SlotService</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">SlotRepository</span> slotRepo;

  <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;SlotDto&gt; <span class="tok-function">freeSlotsOf</span>(<span class="tok-type">Long</span> doctorId) {
    <span class="tok-keyword">return</span> slotRepo.findByDoctorIdAndStatus(doctorId, SlotStatus.FREE)
        .stream().map(SlotDto::from).toList();
  }
}</pre>

<h3>Bước 3 — Controller (chỉ HTTP)</h3>
<pre><span class="tok-keyword">@RestController</span> <span class="tok-keyword">@RequestMapping</span>(<span class="tok-string">"/api/doctors"</span>) <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">DoctorController</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">SlotService</span> slotService;

  <span class="tok-keyword">@GetMapping</span>(<span class="tok-string">"/{id}/slots"</span>)
  <span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;SlotDto&gt; <span class="tok-function">freeSlots</span>(<span class="tok-keyword">@PathVariable</span> <span class="tok-type">Long</span> id) {
    <span class="tok-keyword">return</span> slotService.freeSlotsOf(id);
  }
}</pre>

<h3>Bước 4 — thử nó (kết quả thật)</h3>
<div class="out"><b>Request:</b>  curl http://localhost:8080/api/doctors/1/slots
<b>Response 200:</b>
[
  { "id": 10, "doctorId": 1, "doctorName": "Dr. Lan",
    "startTime": "2026-08-01T09:00:00", "status": "FREE" },
  { "id": 11, "doctorId": 1, "doctorName": "Dr. Lan",
    "startTime": "2026-08-01T10:00:00", "status": "FREE" }
]</div>
<p>Đó là một lát cắt hoàn chỉnh: request → controller → service → repository → JSON. Mọi endpoint GET khác (lịch của tôi, lịch hôm nay) đều cùng hình dạng này.</p>

<div class="callout ok"><strong>Nhịp cần thấm:</strong> DTO trước (bản hợp đồng), rồi Service (ý định), rồi Controller (đường ống). Xây từ trong ra ngoài, trình biên dịch dẫn đường cho bạn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dùng <code>record</code> Java cho DTO.</b> Một <code>record</code> là vật mang dữ liệu bất biến với constructor, getter, <code>equals</code> và <code>toString</code> tự sinh — hoàn hảo cho DTO và không thể vô tình biến đổi. Tài liệu cũ dùng class đầy đủ với Lombok; record (Java 16+) là mặc định hiện đại, an toàn hơn. <em>Vì sao ngoài syllabus: record ra đời sau phần lớn tài liệu Java nhưng nay đã thành idiom.</em></div>
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
          slug: 'int601-auth-jwt',
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
   │       └─ claims: { "sub": "an@mail.com", "role": "PATIENT", "exp": ... }
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
    u.setRole(Role.PATIENT);                          <span class="tok-comment">// self-register = patient</span>
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
   → 200 { "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbkBtYWlsLmNvbS...", "role":"PATIENT" }
<b>3.</b> GET /api/appointments/mine   Header: Authorization: Bearer eyJhbGciOiJIUzI1...
   → 200 [ ...An's appointments... ]
<b>Wrong password?</b> step 2 → 401 Unauthorized (same message whether email or password is wrong — see pitfall).</div>

<div class="pitfall"><strong>Security trap:</strong> different error messages for "email not found" vs "wrong password" let an attacker enumerate which emails exist. Return the <em>same</em> generic "Bad credentials" for both. Also: never log the password or the raw token.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>BCrypt is deliberately slow, and that is a feature.</b> Unlike a plain SHA-256, BCrypt has a tunable work factor so hashing takes ~100 ms — trivial for one login, but it makes brute-forcing a stolen hash database astronomically expensive. Never hash passwords with a fast general-purpose hash. <em>Why beyond syllabus: the "why slow is good" reasoning is security engineering the syllabus assumes but rarely explains.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
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
   │       └─ claim: { "sub": "an@mail.com", "role": "PATIENT", "exp": ... }
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
    u.setRole(Role.PATIENT);                          <span class="tok-comment">// tự đăng ký = bệnh nhân</span>
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
   → 200 { "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbkBtYWlsLmNvbS...", "role":"PATIENT" }
<b>3.</b> GET /api/appointments/mine   Header: Authorization: Bearer eyJhbGciOiJIUzI1...
   → 200 [ ...các lịch của An... ]
<b>Sai mật khẩu?</b> bước 2 → 401 Unauthorized (cùng một thông báo dù email hay mật khẩu sai — xem bẫy).</div>

<div class="pitfall"><strong>Bẫy bảo mật:</strong> thông báo lỗi khác nhau cho "không tìm thấy email" và "sai mật khẩu" giúp kẻ tấn công dò email nào tồn tại. Trả <em>cùng</em> một thông báo chung "Sai thông tin đăng nhập" cho cả hai. Ngoài ra: không bao giờ log mật khẩu hay token thô.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>BCrypt cố tình chậm, và đó là một tính năng.</b> Khác SHA-256 thuần, BCrypt có work factor điều chỉnh được nên băm mất ~100 ms — không đáng kể cho một lần đăng nhập, nhưng khiến việc brute-force một CSDL hash bị đánh cắp đắt đỏ khủng khiếp. Đừng bao giờ băm mật khẩu bằng hash nhanh đa dụng. <em>Vì sao ngoài syllabus: lý lẽ "vì sao chậm lại tốt" là kỹ nghệ bảo mật mà giáo trình giả định nhưng ít giải thích.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; JWT trên Code Lab</span><span class="lc-sub">Băm, token và route được bảo vệ, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Role-based authorization: who can do what|||3.2 — Phân quyền theo vai trò: ai được làm gì',
          slug: 'int601-roles',
          type: 'VIDEO',
          description: 'Cấu hình Spring Security, khoá endpoint theo role, và kiểm quyền sở hữu (chỉ huỷ lịch của chính mình).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.2</span>
<h2>Role-based authorization — who can do what</h2>
<p class="lead">Authentication proved <em>who</em> you are; authorization decides <em>what</em> you may do. Two checks: <strong>role</strong> (only a receptionist confirms) and <strong>ownership</strong> (a patient cancels only their own appointment).</p>

<h3>Lock endpoints by role</h3>
<pre><span class="tok-keyword">@Bean</span>
<span class="tok-type">SecurityFilterChain</span> <span class="tok-function">chain</span>(<span class="tok-type">HttpSecurity</span> http) <span class="tok-keyword">throws</span> Exception {
  http.csrf(csrf -&gt; csrf.disable())          <span class="tok-comment">// stateless API — no CSRF cookie</span>
      .sessionManagement(s -&gt; s.sessionCreationPolicy(STATELESS))
      .authorizeHttpRequests(auth -&gt; auth
          .requestMatchers(<span class="tok-string">"/api/auth/**"</span>).permitAll()
          .requestMatchers(HttpMethod.POST, <span class="tok-string">"/api/appointments"</span>).hasRole(<span class="tok-string">"PATIENT"</span>)
          .requestMatchers(<span class="tok-string">"/api/reception/**"</span>).hasRole(<span class="tok-string">"RECEPTIONIST"</span>)
          .anyRequest().authenticated())
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
  <span class="tok-keyword">return</span> http.build();
}</pre>
<p>The <code>jwtFilter</code> reads the <code>Authorization</code> header, validates the token, and puts the user + role into the security context so these rules can fire.</p>

<h3>Ownership check — role is not enough</h3>
<pre><span class="tok-keyword">public void</span> <span class="tok-function">cancel</span>(<span class="tok-type">Long</span> apptId, <span class="tok-type">Long</span> currentUserId) {
  <span class="tok-type">Appointment</span> a = appts.findById(apptId).orElseThrow(NotFoundException::new);
  <span class="tok-keyword">if</span> (!a.getPatient().getId().equals(currentUserId))   <span class="tok-comment">// ★ own it?</span>
    <span class="tok-keyword">throw new</span> <span class="tok-type">ForbiddenException</span>(<span class="tok-string">"Not your appointment"</span>);   <span class="tok-comment">// → 403</span>
  a.setStatus(AppointmentStatus.CANCELLED);
  a.getSlot().setStatus(SlotStatus.FREE);              <span class="tok-comment">// release the slot</span>
}</pre>

<h3>Worked example — the permission matrix</h3>
<table>
<thead><tr><th>Action</th><th>PATIENT</th><th>RECEPTIONIST</th></tr></thead>
<tbody>
<tr><td>Book a slot</td><td>✅</td><td>❌ 403</td></tr>
<tr><td>Cancel own appointment</td><td>✅</td><td>❌</td></tr>
<tr><td>Cancel someone else's</td><td>❌ 403</td><td>—</td></tr>
<tr><td>Confirm / reject an appointment</td><td>❌ 403</td><td>✅</td></tr>
<tr><td>Open new slots</td><td>❌ 403</td><td>✅</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Trap:</strong> checking role but forgetting ownership. If any logged-in patient can cancel <em>any</em> appointment by changing the id in the URL, that is a broken-access-control vulnerability (OWASP #1). Always verify the resource belongs to the caller.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>401 vs 403 — say the right one.</b> <code>401 Unauthorized</code> means "I don't know who you are" (missing/expired token — re-login). <code>403 Forbidden</code> means "I know who you are, but you may not do this" (wrong role or not your resource). Returning the wrong one confuses the frontend's error handling. <em>Why beyond syllabus: the semantic difference is subtle and constantly gotten wrong, even in production APIs.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.2</span>
<h2>Phân quyền theo vai trò — ai được làm gì</h2>
<p class="lead">Xác thực chứng minh <em>bạn là ai</em>; phân quyền quyết định <em>bạn được làm gì</em>. Hai kiểm tra: <strong>vai trò</strong> (chỉ lễ tân xác nhận) và <strong>quyền sở hữu</strong> (bệnh nhân chỉ huỷ lịch của chính mình).</p>

<h3>Khoá endpoint theo vai trò</h3>
<pre><span class="tok-keyword">@Bean</span>
<span class="tok-type">SecurityFilterChain</span> <span class="tok-function">chain</span>(<span class="tok-type">HttpSecurity</span> http) <span class="tok-keyword">throws</span> Exception {
  http.csrf(csrf -&gt; csrf.disable())          <span class="tok-comment">// API stateless — không CSRF cookie</span>
      .sessionManagement(s -&gt; s.sessionCreationPolicy(STATELESS))
      .authorizeHttpRequests(auth -&gt; auth
          .requestMatchers(<span class="tok-string">"/api/auth/**"</span>).permitAll()
          .requestMatchers(HttpMethod.POST, <span class="tok-string">"/api/appointments"</span>).hasRole(<span class="tok-string">"PATIENT"</span>)
          .requestMatchers(<span class="tok-string">"/api/reception/**"</span>).hasRole(<span class="tok-string">"RECEPTIONIST"</span>)
          .anyRequest().authenticated())
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
  <span class="tok-keyword">return</span> http.build();
}</pre>
<p><code>jwtFilter</code> đọc header <code>Authorization</code>, kiểm token, và đặt user + role vào security context để các quy tắc này kích hoạt.</p>

<h3>Kiểm quyền sở hữu — chỉ role là chưa đủ</h3>
<pre><span class="tok-keyword">public void</span> <span class="tok-function">cancel</span>(<span class="tok-type">Long</span> apptId, <span class="tok-type">Long</span> currentUserId) {
  <span class="tok-type">Appointment</span> a = appts.findById(apptId).orElseThrow(NotFoundException::new);
  <span class="tok-keyword">if</span> (!a.getPatient().getId().equals(currentUserId))   <span class="tok-comment">// ★ có phải của mình?</span>
    <span class="tok-keyword">throw new</span> <span class="tok-type">ForbiddenException</span>(<span class="tok-string">"Không phải lịch của bạn"</span>);   <span class="tok-comment">// → 403</span>
  a.setStatus(AppointmentStatus.CANCELLED);
  a.getSlot().setStatus(SlotStatus.FREE);              <span class="tok-comment">// trả lại khung</span>
}</pre>

<h3>Ví dụ có lời giải — ma trận quyền</h3>
<table>
<thead><tr><th>Hành động</th><th>BỆNH NHÂN</th><th>LỄ TÂN</th></tr></thead>
<tbody>
<tr><td>Đặt một khung</td><td>✅</td><td>❌ 403</td></tr>
<tr><td>Huỷ lịch của chính mình</td><td>✅</td><td>❌</td></tr>
<tr><td>Huỷ lịch của người khác</td><td>❌ 403</td><td>—</td></tr>
<tr><td>Xác nhận / từ chối một lịch</td><td>❌ 403</td><td>✅</td></tr>
<tr><td>Mở khung giờ mới</td><td>❌ 403</td><td>✅</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Bẫy:</strong> kiểm role nhưng quên quyền sở hữu. Nếu bất kỳ bệnh nhân đã đăng nhập nào có thể huỷ <em>bất kỳ</em> lịch nào bằng cách đổi id trên URL, đó là lỗ hổng broken-access-control (OWASP #1). Luôn xác minh tài nguyên thuộc về người gọi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>401 vs 403 — nói đúng cái.</b> <code>401 Unauthorized</code> nghĩa "tôi không biết bạn là ai" (thiếu/hết hạn token — đăng nhập lại). <code>403 Forbidden</code> nghĩa "tôi biết bạn là ai, nhưng bạn không được làm việc này" (sai role hoặc không phải tài nguyên của bạn). Trả nhầm làm rối xử lý lỗi ở frontend. <em>Vì sao ngoài syllabus: khác biệt ngữ nghĩa này tinh tế và bị làm sai liên tục, kể cả ở API production.</em></div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 4 — LÕI ĐẶT LỊCH (CHỐNG ĐẶT TRÙNG) ══════════════════ */
    {
      title: 'Section 4 — The Booking Core (No Double-Booking)|||Mục 4 — Lõi đặt lịch (chống đặt trùng)',
      description: 'Trái tim đồ án: đặt một khung trong một transaction, và ba lớp phòng thủ khiến việc đặt trùng không thể xảy ra dù tranh chấp.',
      lessons: [
        {
          title: '4.1 — Booking in a transaction & the race condition|||4.1 — Đặt lịch trong transaction & race condition',
          slug: 'int601-booking-core',
          type: 'VIDEO',
          description: 'Viết booking service, thấy race condition xảy ra thế nào, và ba lớp phòng thủ đánh bại nó.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 4 · Lesson 4.1</span>
<h2>Booking in a transaction &amp; the race condition</h2>
<p class="lead">This is the feature graders remember. Booking looks trivial — "check the slot is free, then create the appointment" — but that innocent sentence hides a <strong>race condition</strong> that lets two patients grab the same slot. Here is the naive version, the bug, and the fix.</p>

<h3>The naive service — has a bug</h3>
<pre><span class="tok-keyword">@Transactional</span>
<span class="tok-keyword">public</span> <span class="tok-type">Appointment</span> <span class="tok-function">book</span>(<span class="tok-type">Long</span> slotId, <span class="tok-type">Long</span> patientId) {
  <span class="tok-type">Slot</span> slot = slots.findById(slotId).orElseThrow(NotFoundException::new);
  <span class="tok-keyword">if</span> (slot.getStatus() != SlotStatus.FREE)          <span class="tok-comment">// (A) READ</span>
    <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictException</span>(<span class="tok-string">"Slot already booked"</span>);
  slot.setStatus(SlotStatus.BOOKED);                <span class="tok-comment">// (B) WRITE</span>
  <span class="tok-type">Appointment</span> a = <span class="tok-keyword">new</span> <span class="tok-type">Appointment</span>();
  a.setSlot(slot); a.setPatient(users.getReference(patientId));
  <span class="tok-keyword">return</span> appts.save(a);
}</pre>

<h3>Why it breaks — two threads interleave</h3>
<div class="out"><b>Time →</b>   Patient An (thread 1)        Patient Binh (thread 2)
  t1     (A) read slot 42 = FREE ✅
  t2                                  (A) read slot 42 = FREE ✅  ← still FREE!
  t3     (B) set BOOKED, save appt
  t4                                  (B) set BOOKED, save appt
<b>Result (no guard):</b> TWO appointments for slot 42. Double-booked. ✗
The gap between An's read (t1) and write (t3) let Binh read the stale FREE.</div>

<h3>The three-layer defence</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Fast-path check</div><div class="lz-nsub">the <code>if FREE</code> — rejects the common case cheaply, good UX. But NOT a guarantee on its own.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">@Version optimistic lock</div><div class="lz-nsub">Hibernate adds <code>WHERE version = ?</code> to the slot UPDATE. If Binh's version is stale, his UPDATE hits 0 rows → OptimisticLockException.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">UNIQUE(slot_id) in the DB</div><div class="lz-nsub">the absolute backstop — even if 1 &amp; 2 were removed, the second INSERT violates the constraint → 409.</div></div></div>
</div>

<h3>How @Version wins the race — the generated SQL</h3>
<div class="out">An commits first:
  UPDATE slots SET status='BOOKED', version=1 WHERE id=42 AND version=0;  → 1 row ✅

Binh (still holding version=0) tries:
  UPDATE slots SET status='BOOKED', version=1 WHERE id=42 AND version=0;  → 0 rows!
  Hibernate sees 0 rows updated → throws OptimisticLockException
  → our @Transactional rolls back → we map it to 409 Conflict ✅

Final state: exactly ONE appointment for slot 42.</div>

<h3>The correct service</h3>
<pre><span class="tok-keyword">@Transactional</span>
<span class="tok-keyword">public</span> <span class="tok-type">Appointment</span> <span class="tok-function">book</span>(<span class="tok-type">Long</span> slotId, <span class="tok-type">Long</span> patientId) {
  <span class="tok-type">Slot</span> slot = slots.findById(slotId).orElseThrow(NotFoundException::new);
  <span class="tok-keyword">if</span> (slot.getStatus() != SlotStatus.FREE)
    <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictException</span>(<span class="tok-string">"Slot already booked"</span>);
  slot.setStatus(SlotStatus.BOOKED);   <span class="tok-comment">// @Version guards this UPDATE</span>
  <span class="tok-type">Appointment</span> a = <span class="tok-keyword">new</span> <span class="tok-type">Appointment</span>();
  a.setSlot(slot);
  a.setPatient(users.getReference(patientId));
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">return</span> appts.saveAndFlush(a);         <span class="tok-comment">// UNIQUE(slot_id) is the final backstop</span>
  } <span class="tok-keyword">catch</span> (DataIntegrityViolationException | OptimisticLockException e) {
    <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictException</span>(<span class="tok-string">"Slot already booked"</span>);  <span class="tok-comment">// → 409</span>
  }
}</pre>

<div class="pitfall"><strong>Trap:</strong> thinking <code>@Transactional</code> alone stops the race. It does not — two transactions can both read FREE under the default READ_COMMITTED isolation. A transaction gives you all-or-nothing rollback; it does <em>not</em> serialize the read-then-write. You still need the version column or the UNIQUE constraint.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Optimistic vs pessimistic locking.</b> Optimistic (<code>@Version</code>) assumes conflicts are rare: let everyone proceed, detect the clash at write time, retry the loser. Pessimistic (<code>SELECT ... FOR UPDATE</code>) locks the row up front so others wait. For booking — where a real double-click clash is rare — optimistic is faster and scales better. Pessimistic fits high-contention counters. Section 8 shows the pessimistic variant. <em>Why beyond syllabus: choosing a concurrency strategy by contention level is senior-level reasoning the syllabus never poses.</em></div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Transactions &amp; JPA on Code Lab</span><span class="lc-sub">Practice @Transactional and locking behaviour.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 4 · Bài 4.1</span>
<h2>Đặt lịch trong transaction &amp; race condition</h2>
<p class="lead">Đây là tính năng giám khảo nhớ nhất. Đặt lịch trông tầm thường — "kiểm khung trống, rồi tạo lịch" — nhưng câu vô hại đó giấu một <strong>race condition</strong> khiến hai bệnh nhân giành cùng một khung. Đây là phiên bản ngây thơ, cái bug, và cách sửa.</p>

<h3>Service ngây thơ — có bug</h3>
<pre><span class="tok-keyword">@Transactional</span>
<span class="tok-keyword">public</span> <span class="tok-type">Appointment</span> <span class="tok-function">book</span>(<span class="tok-type">Long</span> slotId, <span class="tok-type">Long</span> patientId) {
  <span class="tok-type">Slot</span> slot = slots.findById(slotId).orElseThrow(NotFoundException::new);
  <span class="tok-keyword">if</span> (slot.getStatus() != SlotStatus.FREE)          <span class="tok-comment">// (A) ĐỌC</span>
    <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictException</span>(<span class="tok-string">"Khung đã được đặt"</span>);
  slot.setStatus(SlotStatus.BOOKED);                <span class="tok-comment">// (B) GHI</span>
  <span class="tok-type">Appointment</span> a = <span class="tok-keyword">new</span> <span class="tok-type">Appointment</span>();
  a.setSlot(slot); a.setPatient(users.getReference(patientId));
  <span class="tok-keyword">return</span> appts.save(a);
}</pre>

<h3>Vì sao nó hỏng — hai luồng đan xen</h3>
<div class="out"><b>Thời gian →</b>   Bệnh nhân An (luồng 1)       Bệnh nhân Bình (luồng 2)
  t1     (A) đọc khung 42 = FREE ✅
  t2                                  (A) đọc khung 42 = FREE ✅  ← vẫn FREE!
  t3     (B) đặt BOOKED, lưu lịch
  t4                                  (B) đặt BOOKED, lưu lịch
<b>Kết quả (không rào):</b> HAI lịch cho khung 42. Đặt trùng. ✗
Khoảng trống giữa lúc An đọc (t1) và ghi (t3) khiến Bình đọc phải FREE cũ.</div>

<h3>Ba lớp phòng thủ</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm đường nhanh</div><div class="lz-nsub">câu <code>if FREE</code> — từ chối trường hợp thường một cách rẻ, UX tốt. Nhưng KHÔNG phải sự bảo đảm khi đứng một mình.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Optimistic lock @Version</div><div class="lz-nsub">Hibernate thêm <code>WHERE version = ?</code> vào UPDATE khung. Nếu version của Bình cũ, UPDATE trúng 0 dòng → OptimisticLockException.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">UNIQUE(slot_id) trong DB</div><div class="lz-nsub">chốt chặn tuyệt đối — kể cả bỏ lớp 1 &amp; 2, INSERT thứ hai vi phạm ràng buộc → 409.</div></div></div>
</div>

<h3>@Version thắng cuộc đua thế nào — SQL sinh ra</h3>
<div class="out">An commit trước:
  UPDATE slots SET status='BOOKED', version=1 WHERE id=42 AND version=0;  → 1 dòng ✅

Bình (vẫn giữ version=0) thử:
  UPDATE slots SET status='BOOKED', version=1 WHERE id=42 AND version=0;  → 0 dòng!
  Hibernate thấy 0 dòng được cập nhật → ném OptimisticLockException
  → @Transactional của ta rollback → ta ánh xạ thành 409 Conflict ✅

Trạng thái cuối: đúng MỘT lịch cho khung 42.</div>

<h3>Service đúng</h3>
<pre><span class="tok-keyword">@Transactional</span>
<span class="tok-keyword">public</span> <span class="tok-type">Appointment</span> <span class="tok-function">book</span>(<span class="tok-type">Long</span> slotId, <span class="tok-type">Long</span> patientId) {
  <span class="tok-type">Slot</span> slot = slots.findById(slotId).orElseThrow(NotFoundException::new);
  <span class="tok-keyword">if</span> (slot.getStatus() != SlotStatus.FREE)
    <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictException</span>(<span class="tok-string">"Khung đã được đặt"</span>);
  slot.setStatus(SlotStatus.BOOKED);   <span class="tok-comment">// @Version canh UPDATE này</span>
  <span class="tok-type">Appointment</span> a = <span class="tok-keyword">new</span> <span class="tok-type">Appointment</span>();
  a.setSlot(slot);
  a.setPatient(users.getReference(patientId));
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">return</span> appts.saveAndFlush(a);         <span class="tok-comment">// UNIQUE(slot_id) là chốt chặn cuối</span>
  } <span class="tok-keyword">catch</span> (DataIntegrityViolationException | OptimisticLockException e) {
    <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictException</span>(<span class="tok-string">"Khung đã được đặt"</span>);  <span class="tok-comment">// → 409</span>
  }
}</pre>

<div class="pitfall"><strong>Bẫy:</strong> nghĩ chỉ <code>@Transactional</code> là chặn được race. Không — hai transaction có thể cùng đọc FREE dưới mức cô lập mặc định READ_COMMITTED. Transaction cho bạn rollback tất-cả-hoặc-không; nó <em>không</em> tuần tự hoá việc đọc-rồi-ghi. Bạn vẫn cần cột version hoặc ràng buộc UNIQUE.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Optimistic vs pessimistic locking.</b> Optimistic (<code>@Version</code>) giả định xung đột hiếm: cho ai cũng chạy, phát hiện đụng lúc ghi, thử lại kẻ thua. Pessimistic (<code>SELECT ... FOR UPDATE</code>) khoá dòng ngay từ đầu nên người khác phải đợi. Với đặt lịch — nơi đụng độ double-click thật hiếm — optimistic nhanh hơn và mở rộng tốt hơn. Pessimistic hợp bộ đếm tranh chấp cao. Mục 8 chỉ biến thể pessimistic. <em>Vì sao ngoài syllabus: chọn chiến lược tương tranh theo mức tranh chấp là lối suy luận cấp senior mà giáo trình không đặt ra.</em></div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Transaction &amp; JPA trên Code Lab</span><span class="lc-sub">Luyện @Transactional và hành vi khoá.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — The booking endpoint & error responses|||4.2 — Endpoint đặt lịch & phản hồi lỗi',
          slug: 'int601-booking-endpoint',
          type: 'VIDEO',
          description: 'Controller POST /appointments, và một @RestControllerAdvice ánh xạ mọi exception sang JSON lỗi nhất quán.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 4 · Lesson 4.2</span>
<h2>The booking endpoint &amp; consistent error responses</h2>
<p class="lead">The service throws typed exceptions; the web layer turns them into clean HTTP. A single <code>@RestControllerAdvice</code> gives every error one predictable JSON shape — so the React app can handle them uniformly.</p>

<h3>The controller</h3>
<pre><span class="tok-keyword">@PostMapping</span>(<span class="tok-string">"/api/appointments"</span>)
<span class="tok-keyword">public</span> <span class="tok-type">ResponseEntity</span>&lt;AppointmentDto&gt; <span class="tok-function">book</span>(
    <span class="tok-keyword">@Valid</span> <span class="tok-keyword">@RequestBody</span> <span class="tok-type">BookRequest</span> req,
    <span class="tok-keyword">@AuthenticationPrincipal</span> <span class="tok-type">UserPrincipal</span> me) {
  <span class="tok-type">Appointment</span> a = bookingService.book(req.slotId(), me.getId());
  <span class="tok-keyword">return</span> ResponseEntity.status(HttpStatus.CREATED).body(AppointmentDto.from(a));
}

<span class="tok-comment">// validation on the request body</span>
<span class="tok-keyword">public record</span> <span class="tok-type">BookRequest</span>(<span class="tok-keyword">@NotNull</span> <span class="tok-type">Long</span> slotId) {}</pre>

<h3>One error shape for the whole API</h3>
<pre><span class="tok-keyword">@RestControllerAdvice</span>
<span class="tok-keyword">public class</span> <span class="tok-type">ApiExceptionHandler</span> {

  <span class="tok-keyword">@ExceptionHandler</span>(ConflictException.class)
  <span class="tok-keyword">public</span> <span class="tok-type">ResponseEntity</span>&lt;ApiError&gt; <span class="tok-function">conflict</span>(<span class="tok-type">ConflictException</span> e) {
    <span class="tok-keyword">return</span> error(HttpStatus.CONFLICT, e.getMessage());        <span class="tok-comment">// 409</span>
  }
  <span class="tok-keyword">@ExceptionHandler</span>(ForbiddenException.class)
  <span class="tok-keyword">public</span> <span class="tok-type">ResponseEntity</span>&lt;ApiError&gt; <span class="tok-function">forbidden</span>(<span class="tok-type">ForbiddenException</span> e) {
    <span class="tok-keyword">return</span> error(HttpStatus.FORBIDDEN, e.getMessage());       <span class="tok-comment">// 403</span>
  }
  <span class="tok-keyword">@ExceptionHandler</span>(MethodArgumentNotValidException.class)
  <span class="tok-keyword">public</span> <span class="tok-type">ResponseEntity</span>&lt;ApiError&gt; <span class="tok-function">invalid</span>(<span class="tok-type">MethodArgumentNotValidException</span> e) {
    <span class="tok-keyword">return</span> error(HttpStatus.BAD_REQUEST, <span class="tok-string">"Validation failed"</span>);   <span class="tok-comment">// 400</span>
  }
  <span class="tok-keyword">private</span> <span class="tok-type">ResponseEntity</span>&lt;ApiError&gt; <span class="tok-function">error</span>(<span class="tok-type">HttpStatus</span> s, <span class="tok-type">String</span> msg) {
    <span class="tok-keyword">return</span> ResponseEntity.status(s).body(<span class="tok-keyword">new</span> <span class="tok-type">ApiError</span>(s.value(), msg));
  }
}
<span class="tok-keyword">public record</span> <span class="tok-type">ApiError</span>(<span class="tok-keyword">int</span> status, <span class="tok-type">String</span> message) {}</pre>

<h3>Worked example — the status-code contract</h3>
<table>
<thead><tr><th>Situation</th><th>Status</th><th>Body</th></tr></thead>
<tbody>
<tr><td>Booked successfully</td><td>201 Created</td><td>the new AppointmentDto</td></tr>
<tr><td>Slot already booked (race lost)</td><td>409 Conflict</td><td>{ "status":409, "message":"Slot already booked" }</td></tr>
<tr><td>slotId missing in body</td><td>400 Bad Request</td><td>{ "status":400, "message":"Validation failed" }</td></tr>
<tr><td>No / expired token</td><td>401 Unauthorized</td><td>—</td></tr>
<tr><td>Receptionist tries to book</td><td>403 Forbidden</td><td>—</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Why centralise errors?</strong> Without the advice, every controller repeats try/catch and invents its own JSON. With it, the contract is defined once — the frontend always reads <code>error.message</code>, whatever went wrong.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Idempotency &amp; the double-click.</b> A patient who double-clicks "Book" fires two identical requests. The second correctly gets 409 — but a nicer API returns the <em>same 201 with the existing appointment</em> if it is the same patient booking the same slot. That is idempotency: the same call twice has the same effect as once. <em>Why beyond syllabus: idempotent write design is a distributed-systems concern the syllabus never raises, but every payment/booking API must solve.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 4 · Bài 4.2</span>
<h2>Endpoint đặt lịch &amp; phản hồi lỗi nhất quán</h2>
<p class="lead">Service ném các exception có kiểu; lớp web biến chúng thành HTTP sạch. Một <code>@RestControllerAdvice</code> duy nhất cho mọi lỗi một hình dạng JSON đoán được — để app React xử lý đồng nhất.</p>

<h3>Controller</h3>
<pre><span class="tok-keyword">@PostMapping</span>(<span class="tok-string">"/api/appointments"</span>)
<span class="tok-keyword">public</span> <span class="tok-type">ResponseEntity</span>&lt;AppointmentDto&gt; <span class="tok-function">book</span>(
    <span class="tok-keyword">@Valid</span> <span class="tok-keyword">@RequestBody</span> <span class="tok-type">BookRequest</span> req,
    <span class="tok-keyword">@AuthenticationPrincipal</span> <span class="tok-type">UserPrincipal</span> me) {
  <span class="tok-type">Appointment</span> a = bookingService.book(req.slotId(), me.getId());
  <span class="tok-keyword">return</span> ResponseEntity.status(HttpStatus.CREATED).body(AppointmentDto.from(a));
}

<span class="tok-comment">// validation trên body của request</span>
<span class="tok-keyword">public record</span> <span class="tok-type">BookRequest</span>(<span class="tok-keyword">@NotNull</span> <span class="tok-type">Long</span> slotId) {}</pre>

<h3>Một hình dạng lỗi cho cả API</h3>
<pre><span class="tok-keyword">@RestControllerAdvice</span>
<span class="tok-keyword">public class</span> <span class="tok-type">ApiExceptionHandler</span> {

  <span class="tok-keyword">@ExceptionHandler</span>(ConflictException.class)
  <span class="tok-keyword">public</span> <span class="tok-type">ResponseEntity</span>&lt;ApiError&gt; <span class="tok-function">conflict</span>(<span class="tok-type">ConflictException</span> e) {
    <span class="tok-keyword">return</span> error(HttpStatus.CONFLICT, e.getMessage());        <span class="tok-comment">// 409</span>
  }
  <span class="tok-keyword">@ExceptionHandler</span>(ForbiddenException.class)
  <span class="tok-keyword">public</span> <span class="tok-type">ResponseEntity</span>&lt;ApiError&gt; <span class="tok-function">forbidden</span>(<span class="tok-type">ForbiddenException</span> e) {
    <span class="tok-keyword">return</span> error(HttpStatus.FORBIDDEN, e.getMessage());       <span class="tok-comment">// 403</span>
  }
  <span class="tok-keyword">@ExceptionHandler</span>(MethodArgumentNotValidException.class)
  <span class="tok-keyword">public</span> <span class="tok-type">ResponseEntity</span>&lt;ApiError&gt; <span class="tok-function">invalid</span>(<span class="tok-type">MethodArgumentNotValidException</span> e) {
    <span class="tok-keyword">return</span> error(HttpStatus.BAD_REQUEST, <span class="tok-string">"Dữ liệu không hợp lệ"</span>);   <span class="tok-comment">// 400</span>
  }
  <span class="tok-keyword">private</span> <span class="tok-type">ResponseEntity</span>&lt;ApiError&gt; <span class="tok-function">error</span>(<span class="tok-type">HttpStatus</span> s, <span class="tok-type">String</span> msg) {
    <span class="tok-keyword">return</span> ResponseEntity.status(s).body(<span class="tok-keyword">new</span> <span class="tok-type">ApiError</span>(s.value(), msg));
  }
}
<span class="tok-keyword">public record</span> <span class="tok-type">ApiError</span>(<span class="tok-keyword">int</span> status, <span class="tok-type">String</span> message) {}</pre>

<h3>Ví dụ có lời giải — hợp đồng status-code</h3>
<table>
<thead><tr><th>Tình huống</th><th>Status</th><th>Body</th></tr></thead>
<tbody>
<tr><td>Đặt thành công</td><td>201 Created</td><td>AppointmentDto mới</td></tr>
<tr><td>Khung đã được đặt (thua cuộc đua)</td><td>409 Conflict</td><td>{ "status":409, "message":"Khung đã được đặt" }</td></tr>
<tr><td>Thiếu slotId trong body</td><td>400 Bad Request</td><td>{ "status":400, "message":"Dữ liệu không hợp lệ" }</td></tr>
<tr><td>Không có / hết hạn token</td><td>401 Unauthorized</td><td>—</td></tr>
<tr><td>Lễ tân thử đặt lịch</td><td>403 Forbidden</td><td>—</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Vì sao gom lỗi về một chỗ?</strong> Không có advice, mỗi controller lặp lại try/catch và tự bịa JSON riêng. Có nó, hợp đồng được định nghĩa một lần — frontend luôn đọc <code>error.message</code>, dù lỗi gì.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tính idempotent &amp; cú double-click.</b> Bệnh nhân double-click "Đặt lịch" bắn hai request giống hệt. Cái thứ hai đúng ra nhận 409 — nhưng một API đẹp hơn trả <em>đúng 201 với lịch đã tồn tại</em> nếu đó là cùng bệnh nhân đặt cùng khung. Đó là idempotency: gọi hai lần cho hiệu ứng như gọi một lần. <em>Vì sao ngoài syllabus: thiết kế ghi idempotent là mối lo hệ phân tán mà giáo trình không nêu, nhưng mọi API thanh toán/đặt chỗ đều phải giải.</em></div>
</div>
`,
        },
        {
          title: 'Quiz 4 — Concurrency & the booking core|||Quiz 4 — Tương tranh & lõi đặt lịch',
          slug: 'int601-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu race condition, optimistic locking và status code.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Why is an "if (slot is FREE)" check alone NOT enough to prevent double-booking?|||Vì sao chỉ kiểm "if (khung FREE)" là KHÔNG đủ để chống đặt trùng?',
                options: [
                  'It is too slow|||Nó quá chậm',
                  'Two requests can both read FREE before either writes — a race condition|||Hai request có thể cùng đọc FREE trước khi cái nào ghi — một race condition',
                  'The database ignores it|||CSDL bỏ qua nó',
                  'JPA forbids if-statements|||JPA cấm câu if',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'With @Version optimistic locking, how does the losing transaction get detected?|||Với optimistic lock @Version, transaction thua bị phát hiện thế nào?',
                options: [
                  'Its UPDATE has WHERE version=? and matches 0 rows, raising OptimisticLockException|||UPDATE của nó có WHERE version=? và trúng 0 dòng, ném OptimisticLockException',
                  'The server reboots|||Server khởi động lại',
                  'It waits forever|||Nó đợi mãi',
                  'The JWT expires|||JWT hết hạn',
                ], correctIndex: 0,
              },
              {
                id: 'q3', points: 1,
                question: 'Which layer is the absolute last-resort guarantee against a double-booked slot?|||Lớp nào là bảo đảm cuối cùng tuyệt đối chống một khung bị đặt trùng?',
                options: [
                  'The React frontend|||Frontend React',
                  'The if-check in the service|||Câu if trong service',
                  'The UNIQUE(slot_id) constraint in the database|||Ràng buộc UNIQUE(slot_id) trong CSDL',
                  'The JWT filter|||Filter JWT',
                ], correctIndex: 2,
              },
              {
                id: 'q4', points: 1,
                question: 'A patient loses the race for a slot. What HTTP status should the API return?|||Một bệnh nhân thua cuộc đua giành khung. API nên trả status HTTP nào?',
                options: ['200 OK', '201 Created', '409 Conflict', '500 Internal Server Error'],
                correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: 'Does @Transactional by itself serialize the read-then-write and stop the race?|||Chỉ @Transactional có tự tuần tự hoá đọc-rồi-ghi và chặn race không?',
                options: [
                  'Yes, always|||Có, luôn luôn',
                  'No — under READ_COMMITTED two txns can both read FREE; you still need @Version or UNIQUE|||Không — dưới READ_COMMITTED hai txn có thể cùng đọc FREE; vẫn cần @Version hoặc UNIQUE',
                  'Only on MySQL|||Chỉ trên MySQL',
                  'Only if you add @Async|||Chỉ khi thêm @Async',
                ], correctIndex: 1,
              },
              {
                id: 'q6', points: 1,
                question: '(Beyond syllabus) When is pessimistic locking (SELECT ... FOR UPDATE) a better fit than optimistic?|||(Ngoài giáo trình) Khi nào pessimistic locking (SELECT ... FOR UPDATE) hợp hơn optimistic?',
                options: [
                  'When conflicts are very rare|||Khi xung đột rất hiếm',
                  'When contention is high and many writers fight for the same row|||Khi tranh chấp cao và nhiều writer giành cùng một dòng',
                  'Never|||Không bao giờ',
                  'Only for read-only data|||Chỉ cho dữ liệu chỉ đọc',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ MỤC 5 — FRONTEND REACT ══════════════════ */
    {
      title: 'Section 5 — Frontend: the React SPA|||Mục 5 — Frontend: React SPA',
      description: 'Dựng app React (Vite), giữ trạng thái đăng nhập bằng Context, gắn JWT vào mọi request bằng axios interceptor, và xây màn hình đặt lịch.',
      lessons: [
        {
          title: '5.1 — React setup, auth context & the axios interceptor|||5.1 — Setup React, auth context & axios interceptor',
          slug: 'int601-react-auth',
          type: 'VIDEO',
          description: 'Một axios interceptor gắn JWT vào mọi request; một Context giữ user đăng nhập — nền của cả frontend.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 5 · Lesson 5.1</span>
<h2>React setup, auth context &amp; the axios interceptor</h2>
<p class="lead">Scaffold with <code>npm create vite@latest web -- --template react</code>, add <code>axios</code> and <code>react-router-dom</code>. Two pieces make the whole frontend simple: a single <strong>axios instance</strong> that attaches the JWT automatically, and an <strong>AuthContext</strong> that remembers who is logged in.</p>

<h3>One axios client for the whole app</h3>
<pre><span class="tok-comment">// src/api/client.js</span>
<span class="tok-keyword">import</span> axios <span class="tok-keyword">from</span> <span class="tok-string">'axios'</span>;

<span class="tok-keyword">export const</span> api = axios.create({ baseURL: <span class="tok-string">'/api'</span> });

<span class="tok-comment">// attach the token to every request</span>
api.interceptors.request.use((config) =&gt; {
  <span class="tok-keyword">const</span> token = localStorage.getItem(<span class="tok-string">'token'</span>);
  <span class="tok-keyword">if</span> (token) config.headers.Authorization = &#96;Bearer \${token}&#96;;
  <span class="tok-keyword">return</span> config;
});

<span class="tok-comment">// on 401, drop the token and send the user to login</span>
api.interceptors.response.use(
  (r) =&gt; r,
  (err) =&gt; {
    <span class="tok-keyword">if</span> (err.response?.status === <span class="tok-number">401</span>) {
      localStorage.removeItem(<span class="tok-string">'token'</span>);
      window.location.href = <span class="tok-string">'/login'</span>;
    }
    <span class="tok-keyword">return</span> Promise.reject(err);
  }
);</pre>

<h3>AuthContext — remember the user</h3>
<pre><span class="tok-comment">// src/auth/AuthContext.jsx</span>
<span class="tok-keyword">import</span> { createContext, useContext, useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">import</span> { api } <span class="tok-keyword">from</span> <span class="tok-string">'../api/client'</span>;

<span class="tok-keyword">const</span> AuthContext = createContext(<span class="tok-keyword">null</span>);

<span class="tok-keyword">export function</span> <span class="tok-function">AuthProvider</span>({ children }) {
  <span class="tok-keyword">const</span> [user, setUser] = useState(() =&gt;
    JSON.parse(localStorage.getItem(<span class="tok-string">'user'</span>) || <span class="tok-string">'null'</span>));

  <span class="tok-keyword">async function</span> <span class="tok-function">login</span>(email, password) {
    <span class="tok-keyword">const</span> { data } = <span class="tok-keyword">await</span> api.post(<span class="tok-string">'/auth/login'</span>, { email, password });
    localStorage.setItem(<span class="tok-string">'token'</span>, data.token);
    <span class="tok-keyword">const</span> u = { email, role: data.role };
    localStorage.setItem(<span class="tok-string">'user'</span>, JSON.stringify(u));
    setUser(u);
  }
  <span class="tok-keyword">function</span> <span class="tok-function">logout</span>() {
    localStorage.clear();
    setUser(<span class="tok-keyword">null</span>);
  }
  <span class="tok-keyword">return</span> &lt;AuthContext.Provider value={{ user, login, logout }}&gt;{children}&lt;/AuthContext.Provider&gt;;
}
<span class="tok-keyword">export const</span> useAuth = () =&gt; useContext(AuthContext);</pre>

<div class="callout ok">Now any component calls <code>const { user, login } = useAuth()</code> to read the session, and every <code>api.get/post</code> is already authenticated. You wrote the token logic once.</div>

<div class="pitfall"><strong>Trap:</strong> storing the JWT and then forgetting the 401 path. When the token expires, calls start failing silently and the UI looks "frozen". The response interceptor above turns every 401 into a clean redirect to login — a small piece that saves hours of "why is it broken?".</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>localStorage vs httpOnly cookie.</b> Storing a JWT in <code>localStorage</code> is simple and fine for a student project, but it is readable by any injected script — an XSS bug leaks the token. Production auth often uses an <code>httpOnly</code> cookie the browser sends automatically and JavaScript cannot read. Know the trade-off so you can answer "is this secure?" honestly. <em>Why beyond syllabus: token-storage security is a real decision the syllabus glosses over.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">React context &amp; data fetching on Code Lab</span><span class="lc-sub">Hooks, context and axios patterns.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 5 · Bài 5.1</span>
<h2>Setup React, auth context &amp; axios interceptor</h2>
<p class="lead">Tạo khung bằng <code>npm create vite@latest web -- --template react</code>, thêm <code>axios</code> và <code>react-router-dom</code>. Hai mảnh làm cả frontend đơn giản: một <strong>instance axios</strong> tự gắn JWT, và một <strong>AuthContext</strong> nhớ ai đang đăng nhập.</p>

<h3>Một client axios cho cả app</h3>
<pre><span class="tok-comment">// src/api/client.js</span>
<span class="tok-keyword">import</span> axios <span class="tok-keyword">from</span> <span class="tok-string">'axios'</span>;

<span class="tok-keyword">export const</span> api = axios.create({ baseURL: <span class="tok-string">'/api'</span> });

<span class="tok-comment">// gắn token vào mọi request</span>
api.interceptors.request.use((config) =&gt; {
  <span class="tok-keyword">const</span> token = localStorage.getItem(<span class="tok-string">'token'</span>);
  <span class="tok-keyword">if</span> (token) config.headers.Authorization = &#96;Bearer \${token}&#96;;
  <span class="tok-keyword">return</span> config;
});

<span class="tok-comment">// khi 401, bỏ token và đưa user về trang đăng nhập</span>
api.interceptors.response.use(
  (r) =&gt; r,
  (err) =&gt; {
    <span class="tok-keyword">if</span> (err.response?.status === <span class="tok-number">401</span>) {
      localStorage.removeItem(<span class="tok-string">'token'</span>);
      window.location.href = <span class="tok-string">'/login'</span>;
    }
    <span class="tok-keyword">return</span> Promise.reject(err);
  }
);</pre>

<h3>AuthContext — nhớ user</h3>
<pre><span class="tok-comment">// src/auth/AuthContext.jsx</span>
<span class="tok-keyword">import</span> { createContext, useContext, useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">import</span> { api } <span class="tok-keyword">from</span> <span class="tok-string">'../api/client'</span>;

<span class="tok-keyword">const</span> AuthContext = createContext(<span class="tok-keyword">null</span>);

<span class="tok-keyword">export function</span> <span class="tok-function">AuthProvider</span>({ children }) {
  <span class="tok-keyword">const</span> [user, setUser] = useState(() =&gt;
    JSON.parse(localStorage.getItem(<span class="tok-string">'user'</span>) || <span class="tok-string">'null'</span>));

  <span class="tok-keyword">async function</span> <span class="tok-function">login</span>(email, password) {
    <span class="tok-keyword">const</span> { data } = <span class="tok-keyword">await</span> api.post(<span class="tok-string">'/auth/login'</span>, { email, password });
    localStorage.setItem(<span class="tok-string">'token'</span>, data.token);
    <span class="tok-keyword">const</span> u = { email, role: data.role };
    localStorage.setItem(<span class="tok-string">'user'</span>, JSON.stringify(u));
    setUser(u);
  }
  <span class="tok-keyword">function</span> <span class="tok-function">logout</span>() {
    localStorage.clear();
    setUser(<span class="tok-keyword">null</span>);
  }
  <span class="tok-keyword">return</span> &lt;AuthContext.Provider value={{ user, login, logout }}&gt;{children}&lt;/AuthContext.Provider&gt;;
}
<span class="tok-keyword">export const</span> useAuth = () =&gt; useContext(AuthContext);</pre>

<div class="callout ok">Giờ bất kỳ component nào gọi <code>const { user, login } = useAuth()</code> để đọc session, và mọi <code>api.get/post</code> đã được xác thực sẵn. Bạn viết logic token đúng một lần.</div>

<div class="pitfall"><strong>Bẫy:</strong> lưu JWT rồi quên đường xử lý 401. Khi token hết hạn, các call bắt đầu lỗi lặng lẽ và UI trông "đơ". Interceptor phản hồi ở trên biến mọi 401 thành một chuyển hướng sạch về đăng nhập — một mảnh nhỏ tiết kiệm hàng giờ "sao nó hỏng?".</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>localStorage vs cookie httpOnly.</b> Lưu JWT trong <code>localStorage</code> đơn giản và ổn cho đồ án sinh viên, nhưng nó đọc được bởi bất kỳ script bị chèn nào — một lỗi XSS làm lộ token. Auth production thường dùng cookie <code>httpOnly</code> mà trình duyệt tự gửi và JavaScript không đọc được. Biết đánh đổi để trả lời "cái này có an toàn không?" một cách trung thực. <em>Vì sao ngoài syllabus: bảo mật lưu token là một quyết định thật mà giáo trình lướt qua.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">React context &amp; fetch dữ liệu trên Code Lab</span><span class="lc-sub">Hook, context và các mẫu axios.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — The booking screen|||5.2 — Màn hình đặt lịch',
          slug: 'int601-booking-screen',
          type: 'VIDEO',
          description: 'Liệt kê khung trống, đặt một khung, và xử lý 409 "đã được đặt" một cách nhã nhặn với người dùng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 5 · Lesson 5.2</span>
<h2>The booking screen</h2>
<p class="lead">The patient's core screen: list a doctor's free slots, click one, book it. The interesting part is <strong>handling the 409</strong> — when someone else grabbed the slot first, the UI must say so clearly and refresh, not crash.</p>

<h3>The component</h3>
<pre><span class="tok-keyword">import</span> { useEffect, useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">import</span> { api } <span class="tok-keyword">from</span> <span class="tok-string">'../api/client'</span>;

<span class="tok-keyword">export default function</span> <span class="tok-function">SlotPicker</span>({ doctorId }) {
  <span class="tok-keyword">const</span> [slots, setSlots] = useState([]);
  <span class="tok-keyword">const</span> [msg, setMsg] = useState(<span class="tok-string">''</span>);

  <span class="tok-keyword">async function</span> <span class="tok-function">load</span>() {
    <span class="tok-keyword">const</span> { data } = <span class="tok-keyword">await</span> api.get(&#96;/doctors/\${doctorId}/slots&#96;);
    setSlots(data);
  }
  useEffect(() =&gt; { load(); }, [doctorId]);

  <span class="tok-keyword">async function</span> <span class="tok-function">book</span>(slotId) {
    <span class="tok-keyword">try</span> {
      <span class="tok-keyword">await</span> api.post(<span class="tok-string">'/appointments'</span>, { slotId });
      setMsg(<span class="tok-string">'✅ Booked! Check "My appointments".'</span>);
      load();                          <span class="tok-comment">// refresh — the slot is gone now</span>
    } <span class="tok-keyword">catch</span> (e) {
      <span class="tok-keyword">if</span> (e.response?.status === <span class="tok-number">409</span>) {
        setMsg(<span class="tok-string">'⚠️ Sorry, that slot was just taken. Pick another.'</span>);
        load();                        <span class="tok-comment">// refresh to hide the taken slot</span>
      } <span class="tok-keyword">else</span> setMsg(<span class="tok-string">'Something went wrong.'</span>);
    }
  }

  <span class="tok-keyword">return</span> (
    &lt;div&gt;
      {msg &amp;&amp; &lt;p className="banner"&gt;{msg}&lt;/p&gt;}
      {slots.length === <span class="tok-number">0</span> &amp;&amp; &lt;p&gt;No free slots.&lt;/p&gt;}
      &lt;ul&gt;
        {slots.map((s) =&gt; (
          &lt;li key={s.id}&gt;
            {<span class="tok-keyword">new</span> Date(s.startTime).toLocaleString()}
            &lt;button onClick={() =&gt; book(s.id)}&gt;Book&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}</pre>

<h3>Worked example — the two-patient flow on screen</h3>
<div class="out"><b>1.</b> An opens the page → sees 09:00, 10:00 free.
<b>2.</b> Binh (another browser) books 09:00 first → his UI: "✅ Booked!".
<b>3.</b> An clicks 09:00 → POST → <b>409</b> → An's UI: "⚠️ that slot was just taken", list reloads → 09:00 disappears, only 10:00 remains.
<b>Result:</b> no crash, no double-booking, An calmly picks 10:00. This is the moment to capture in your demo video (Lesson 0.5).</div>

<div class="callout ok"><strong>Always reload after a 409.</strong> The conflict means your view of the slots is stale. Re-fetching immediately shows the patient the true remaining slots and turns a frustrating error into a smooth "pick another".</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Optimistic UI, and why not here.</b> Some apps update the screen <em>before</em> the server confirms, for snappiness. For booking, don't — showing "Booked!" then rolling back on a 409 is worse UX than a half-second wait. Match the UI's optimism to the cost of being wrong. <em>Why beyond syllabus: knowing when NOT to apply a popular pattern is judgement the syllabus can't teach by rule.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 5 · Bài 5.2</span>
<h2>Màn hình đặt lịch</h2>
<p class="lead">Màn hình lõi của bệnh nhân: liệt kê khung trống của bác sĩ, bấm một cái, đặt nó. Phần thú vị là <strong>xử lý 409</strong> — khi ai đó giành khung trước, UI phải nói rõ và làm mới, không sập.</p>

<h3>Component</h3>
<pre><span class="tok-keyword">import</span> { useEffect, useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">import</span> { api } <span class="tok-keyword">from</span> <span class="tok-string">'../api/client'</span>;

<span class="tok-keyword">export default function</span> <span class="tok-function">SlotPicker</span>({ doctorId }) {
  <span class="tok-keyword">const</span> [slots, setSlots] = useState([]);
  <span class="tok-keyword">const</span> [msg, setMsg] = useState(<span class="tok-string">''</span>);

  <span class="tok-keyword">async function</span> <span class="tok-function">load</span>() {
    <span class="tok-keyword">const</span> { data } = <span class="tok-keyword">await</span> api.get(&#96;/doctors/\${doctorId}/slots&#96;);
    setSlots(data);
  }
  useEffect(() =&gt; { load(); }, [doctorId]);

  <span class="tok-keyword">async function</span> <span class="tok-function">book</span>(slotId) {
    <span class="tok-keyword">try</span> {
      <span class="tok-keyword">await</span> api.post(<span class="tok-string">'/appointments'</span>, { slotId });
      setMsg(<span class="tok-string">'✅ Đã đặt! Xem "Lịch của tôi".'</span>);
      load();                          <span class="tok-comment">// làm mới — khung đó đã mất</span>
    } <span class="tok-keyword">catch</span> (e) {
      <span class="tok-keyword">if</span> (e.response?.status === <span class="tok-number">409</span>) {
        setMsg(<span class="tok-string">'⚠️ Rất tiếc, khung đó vừa bị đặt. Chọn khung khác.'</span>);
        load();                        <span class="tok-comment">// làm mới để ẩn khung đã bị đặt</span>
      } <span class="tok-keyword">else</span> setMsg(<span class="tok-string">'Có lỗi xảy ra.'</span>);
    }
  }

  <span class="tok-keyword">return</span> (
    &lt;div&gt;
      {msg &amp;&amp; &lt;p className="banner"&gt;{msg}&lt;/p&gt;}
      {slots.length === <span class="tok-number">0</span> &amp;&amp; &lt;p&gt;Không còn khung trống.&lt;/p&gt;}
      &lt;ul&gt;
        {slots.map((s) =&gt; (
          &lt;li key={s.id}&gt;
            {<span class="tok-keyword">new</span> Date(s.startTime).toLocaleString()}
            &lt;button onClick={() =&gt; book(s.id)}&gt;Đặt&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}</pre>

<h3>Ví dụ có lời giải — luồng hai bệnh nhân trên màn hình</h3>
<div class="out"><b>1.</b> An mở trang → thấy 09:00, 10:00 trống.
<b>2.</b> Bình (trình duyệt khác) đặt 09:00 trước → UI của Bình: "✅ Đã đặt!".
<b>3.</b> An bấm 09:00 → POST → <b>409</b> → UI của An: "⚠️ khung đó vừa bị đặt", danh sách nạp lại → 09:00 biến mất, chỉ còn 10:00.
<b>Kết quả:</b> không sập, không đặt trùng, An bình tĩnh chọn 10:00. Đây là khoảnh khắc cần quay trong video demo (Bài 0.5).</div>

<div class="callout ok"><strong>Luôn nạp lại sau một 409.</strong> Xung đột nghĩa là khung nhìn của bạn về các khung đã cũ. Fetch lại ngay cho bệnh nhân thấy các khung còn thật và biến một lỗi bực bội thành một "chọn cái khác" mượt mà.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Optimistic UI, và vì sao không dùng ở đây.</b> Vài app cập nhật màn hình <em>trước khi</em> server xác nhận, cho nhanh. Với đặt lịch, đừng — hiện "Đã đặt!" rồi rollback khi 409 là UX tệ hơn chờ nửa giây. Hãy khớp mức lạc quan của UI với chi phí của việc sai. <em>Vì sao ngoài syllabus: biết khi nào KHÔNG áp một mẫu phổ biến là sự phán đoán mà giáo trình không dạy được bằng quy tắc.</em></div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 6 — KIỂM THỬ ══════════════════ */
    {
      title: 'Section 6 — Testing|||Mục 6 — Kiểm thử',
      description: 'Unit test cho service, integration test cho endpoint bằng MockMvc, và một test đồng thời chứng minh không thể đặt trùng.',
      lessons: [
        {
          title: '6.1 — Unit, integration & the concurrency test|||6.1 — Unit, integration & test đồng thời',
          slug: 'int601-testing',
          type: 'VIDEO',
          description: 'Turn each acceptance criterion into an automated test — including the star test that fires two bookings at once.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 6 · Lesson 6.1</span>
<h2>Unit, integration &amp; the concurrency test</h2>
<p class="lead">Your acceptance criteria from Lesson 0.2 become tests here. Three levels: a fast <strong>unit test</strong> of the service, an <strong>integration test</strong> hitting the real endpoint, and the crown — a <strong>concurrency test</strong> that fires two bookings at the same slot simultaneously and proves exactly one wins.</p>

<h3>Unit test — the service in isolation (Mockito)</h3>
<pre><span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">bookingAFreeSlotCreatesPendingAppointment</span>() {
  <span class="tok-type">Slot</span> free = slotWithStatus(SlotStatus.FREE);
  when(slots.findById(<span class="tok-number">42L</span>)).thenReturn(Optional.of(free));
  when(appts.saveAndFlush(any())).thenAnswer(inv -&gt; inv.getArgument(<span class="tok-number">0</span>));

  <span class="tok-type">Appointment</span> a = service.book(<span class="tok-number">42L</span>, <span class="tok-number">7L</span>);

  assertEquals(AppointmentStatus.PENDING, a.getStatus());
  assertEquals(SlotStatus.BOOKED, free.getStatus());
}

<span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">bookingABookedSlotThrowsConflict</span>() {
  when(slots.findById(<span class="tok-number">42L</span>)).thenReturn(Optional.of(slotWithStatus(SlotStatus.BOOKED)));
  assertThrows(ConflictException.class, () -&gt; service.book(<span class="tok-number">42L</span>, <span class="tok-number">7L</span>));
}</pre>

<h3>Integration test — the real endpoint (MockMvc + a test DB)</h3>
<pre><span class="tok-keyword">@SpringBootTest</span> <span class="tok-keyword">@AutoConfigureMockMvc</span>
<span class="tok-keyword">class</span> <span class="tok-type">AppointmentApiTest</span> {
  <span class="tok-keyword">@Autowired</span> <span class="tok-type">MockMvc</span> mvc;

  <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">patientCanBookAFreeSlot</span>() <span class="tok-keyword">throws</span> Exception {
    <span class="tok-type">String</span> token = loginAs(<span class="tok-string">"an@mail.com"</span>);   <span class="tok-comment">// helper logs in, returns JWT</span>
    mvc.perform(post(<span class="tok-string">"/api/appointments"</span>)
        .header(<span class="tok-string">"Authorization"</span>, <span class="tok-string">"Bearer "</span> + token)
        .contentType(APPLICATION_JSON)
        .content(<span class="tok-string">"{\\"slotId\\": 42}"</span>))
      .andExpect(status().isCreated())
      .andExpect(jsonPath(<span class="tok-string">"$.status"</span>).value(<span class="tok-string">"PENDING"</span>));
  }

  <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">receptionistCannotBook_returns403</span>() <span class="tok-keyword">throws</span> Exception {
    <span class="tok-type">String</span> token = loginAs(<span class="tok-string">"reception@clinic.com"</span>);
    mvc.perform(post(<span class="tok-string">"/api/appointments"</span>)
        .header(<span class="tok-string">"Authorization"</span>, <span class="tok-string">"Bearer "</span> + token)
        .contentType(APPLICATION_JSON).content(<span class="tok-string">"{\\"slotId\\": 43}"</span>))
      .andExpect(status().isForbidden());
  }
}</pre>

<h3>★ The concurrency test — proof there is no double-booking</h3>
<pre><span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">twoPatientsBookSameSlot_onlyOneSucceeds</span>() <span class="tok-keyword">throws</span> Exception {
  <span class="tok-type">Long</span> slotId = seedFreeSlot();
  <span class="tok-keyword">var</span> pool = Executors.newFixedThreadPool(<span class="tok-number">2</span>);
  <span class="tok-keyword">var</span> start = <span class="tok-keyword">new</span> CountDownLatch(<span class="tok-number">1</span>);
  <span class="tok-keyword">var</span> ok = <span class="tok-keyword">new</span> AtomicInteger(), conflict = <span class="tok-keyword">new</span> AtomicInteger();

  Runnable attempt = () -&gt; {
    <span class="tok-keyword">try</span> { start.await();                    <span class="tok-comment">// release both threads together</span>
      service.book(slotId, anyPatientId());
      ok.incrementAndGet();
    } <span class="tok-keyword">catch</span> (ConflictException e) { conflict.incrementAndGet(); }
      <span class="tok-keyword">catch</span> (Exception ignored) {}
  };
  pool.submit(attempt); pool.submit(attempt);
  start.countDown();                          <span class="tok-comment">// GO — both fire now</span>
  pool.shutdown(); pool.awaitTermination(<span class="tok-number">5</span>, TimeUnit.SECONDS);

  assertEquals(<span class="tok-number">1</span>, ok.get());              <span class="tok-comment">// exactly one booked</span>
  assertEquals(<span class="tok-number">1</span>, conflict.get());        <span class="tok-comment">// exactly one rejected</span>
  assertEquals(<span class="tok-number">1</span>, appts.countBySlotId(slotId)); <span class="tok-comment">// one row in the DB</span>
}</pre>

<h3>Worked example — reading the result</h3>
<div class="out"><b>Run:</b>  mvn test
<b>Output:</b>
  AppointmentServiceTest        ✔ 2 passed
  AppointmentApiTest            ✔ 2 passed
  BookingConcurrencyTest        ✔ twoPatientsBookSameSlot_onlyOneSucceeds
  Tests run: 5, Failures: 0
<b>Meaning:</b> the concurrency test green = your three-layer defence (Section 4) really works under real threads, not just on paper. This is the single test to run live in your demo.</div>

<div class="pitfall"><strong>Trap:</strong> a concurrency test that passes because the two threads never actually overlap. Use a <code>CountDownLatch</code> to release both at the same instant, and assert on the DB row count — not just the HTTP responses. Otherwise you "prove" nothing.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The test pyramid.</b> Many fast unit tests at the base, fewer integration tests in the middle, very few slow end-to-end tests at the top. Students often invert it — one giant "click everything" test that is slow and flaky. Aim for lots of small deterministic tests; keep the expensive ones rare and focused (like this one concurrency test). <em>Why beyond syllabus: test-suite architecture is a discipline the syllabus rarely frames explicitly.</em></div>

<a class="link-card exphub" href="/exp-hub/github-actions?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Run tests automatically on every push</span><span class="lc-sub">Wire mvn test into GitHub Actions CI — guide on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 6 · Bài 6.1</span>
<h2>Unit, integration &amp; test đồng thời</h2>
<p class="lead">Tiêu chí nghiệm thu ở Bài 0.2 trở thành test ở đây. Ba mức: một <strong>unit test</strong> nhanh cho service, một <strong>integration test</strong> gọi endpoint thật, và viên ngọc — một <strong>test đồng thời</strong> bắn hai lượt đặt cùng một khung cùng lúc và chứng minh đúng một cái thắng.</p>

<h3>Unit test — service tách biệt (Mockito)</h3>
<pre><span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">bookingAFreeSlotCreatesPendingAppointment</span>() {
  <span class="tok-type">Slot</span> free = slotWithStatus(SlotStatus.FREE);
  when(slots.findById(<span class="tok-number">42L</span>)).thenReturn(Optional.of(free));
  when(appts.saveAndFlush(any())).thenAnswer(inv -&gt; inv.getArgument(<span class="tok-number">0</span>));

  <span class="tok-type">Appointment</span> a = service.book(<span class="tok-number">42L</span>, <span class="tok-number">7L</span>);

  assertEquals(AppointmentStatus.PENDING, a.getStatus());
  assertEquals(SlotStatus.BOOKED, free.getStatus());
}

<span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">bookingABookedSlotThrowsConflict</span>() {
  when(slots.findById(<span class="tok-number">42L</span>)).thenReturn(Optional.of(slotWithStatus(SlotStatus.BOOKED)));
  assertThrows(ConflictException.class, () -&gt; service.book(<span class="tok-number">42L</span>, <span class="tok-number">7L</span>));
}</pre>

<h3>Integration test — endpoint thật (MockMvc + DB test)</h3>
<pre><span class="tok-keyword">@SpringBootTest</span> <span class="tok-keyword">@AutoConfigureMockMvc</span>
<span class="tok-keyword">class</span> <span class="tok-type">AppointmentApiTest</span> {
  <span class="tok-keyword">@Autowired</span> <span class="tok-type">MockMvc</span> mvc;

  <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">patientCanBookAFreeSlot</span>() <span class="tok-keyword">throws</span> Exception {
    <span class="tok-type">String</span> token = loginAs(<span class="tok-string">"an@mail.com"</span>);   <span class="tok-comment">// helper đăng nhập, trả JWT</span>
    mvc.perform(post(<span class="tok-string">"/api/appointments"</span>)
        .header(<span class="tok-string">"Authorization"</span>, <span class="tok-string">"Bearer "</span> + token)
        .contentType(APPLICATION_JSON)
        .content(<span class="tok-string">"{\\"slotId\\": 42}"</span>))
      .andExpect(status().isCreated())
      .andExpect(jsonPath(<span class="tok-string">"$.status"</span>).value(<span class="tok-string">"PENDING"</span>));
  }

  <span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">receptionistCannotBook_returns403</span>() <span class="tok-keyword">throws</span> Exception {
    <span class="tok-type">String</span> token = loginAs(<span class="tok-string">"reception@clinic.com"</span>);
    mvc.perform(post(<span class="tok-string">"/api/appointments"</span>)
        .header(<span class="tok-string">"Authorization"</span>, <span class="tok-string">"Bearer "</span> + token)
        .contentType(APPLICATION_JSON).content(<span class="tok-string">"{\\"slotId\\": 43}"</span>))
      .andExpect(status().isForbidden());
  }
}</pre>

<h3>★ Test đồng thời — bằng chứng không đặt trùng</h3>
<pre><span class="tok-keyword">@Test</span> <span class="tok-keyword">void</span> <span class="tok-function">twoPatientsBookSameSlot_onlyOneSucceeds</span>() <span class="tok-keyword">throws</span> Exception {
  <span class="tok-type">Long</span> slotId = seedFreeSlot();
  <span class="tok-keyword">var</span> pool = Executors.newFixedThreadPool(<span class="tok-number">2</span>);
  <span class="tok-keyword">var</span> start = <span class="tok-keyword">new</span> CountDownLatch(<span class="tok-number">1</span>);
  <span class="tok-keyword">var</span> ok = <span class="tok-keyword">new</span> AtomicInteger(), conflict = <span class="tok-keyword">new</span> AtomicInteger();

  Runnable attempt = () -&gt; {
    <span class="tok-keyword">try</span> { start.await();                    <span class="tok-comment">// thả cả hai luồng cùng lúc</span>
      service.book(slotId, anyPatientId());
      ok.incrementAndGet();
    } <span class="tok-keyword">catch</span> (ConflictException e) { conflict.incrementAndGet(); }
      <span class="tok-keyword">catch</span> (Exception ignored) {}
  };
  pool.submit(attempt); pool.submit(attempt);
  start.countDown();                          <span class="tok-comment">// BẮT ĐẦU — cả hai bắn ngay</span>
  pool.shutdown(); pool.awaitTermination(<span class="tok-number">5</span>, TimeUnit.SECONDS);

  assertEquals(<span class="tok-number">1</span>, ok.get());              <span class="tok-comment">// đúng một cái đặt được</span>
  assertEquals(<span class="tok-number">1</span>, conflict.get());        <span class="tok-comment">// đúng một cái bị từ chối</span>
  assertEquals(<span class="tok-number">1</span>, appts.countBySlotId(slotId)); <span class="tok-comment">// một dòng trong DB</span>
}</pre>

<h3>Ví dụ có lời giải — đọc kết quả</h3>
<div class="out"><b>Chạy:</b>  mvn test
<b>Kết quả:</b>
  AppointmentServiceTest        ✔ 2 passed
  AppointmentApiTest            ✔ 2 passed
  BookingConcurrencyTest        ✔ twoPatientsBookSameSlot_onlyOneSucceeds
  Tests run: 5, Failures: 0
<b>Nghĩa là:</b> test đồng thời xanh = ba lớp phòng thủ (Mục 4) thật sự chạy đúng dưới luồng thật, không chỉ trên giấy. Đây là test duy nhất nên chạy trực tiếp trong buổi demo.</div>

<div class="pitfall"><strong>Bẫy:</strong> một test đồng thời "pass" vì hai luồng thực ra không bao giờ chồng lấn. Dùng <code>CountDownLatch</code> để thả cả hai đúng một khoảnh khắc, và assert trên số dòng DB — không chỉ trên phản hồi HTTP. Nếu không bạn "chứng minh" chẳng gì cả.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kim tự tháp test.</b> Nhiều unit test nhanh ở đáy, ít integration test ở giữa, rất ít test end-to-end chậm ở đỉnh. Sinh viên hay đảo ngược nó — một test "bấm mọi thứ" khổng lồ, chậm và hay chập chờn. Nhắm nhiều test nhỏ tất định; giữ các test đắt tiền hiếm và tập trung (như test đồng thời này). <em>Vì sao ngoài syllabus: kiến trúc bộ test là một kỷ luật giáo trình ít nêu tường minh.</em></div>

<a class="link-card exphub" href="/exp-hub/github-actions?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Chạy test tự động mỗi lần push</span><span class="lc-sub">Nối mvn test vào GitHub Actions CI — hướng dẫn trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 7 — TRIỂN KHAI (DOCKER) ══════════════════ */
    {
      title: 'Section 7 — Deployment with Docker|||Mục 7 — Triển khai với Docker',
      description: 'Đóng gói api + web + db thành ba container, chạy cả hệ bằng một lệnh docker compose up, và smoke-test.',
      lessons: [
        {
          title: '7.1 — Dockerize & compose the whole system|||7.1 — Dockerize & compose cả hệ thống',
          slug: 'int601-docker',
          type: 'VIDEO',
          description: 'Dockerfile multi-stage cho api và web, một docker-compose.yml ba dịch vụ, và smoke test sau khi lên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 7 · Lesson 7.1</span>
<h2>Dockerize &amp; compose the whole system</h2>
<p class="lead">"Runs on my machine" is not a grade. Package each part into a container, describe the three together in one <code>docker-compose.yml</code>, and your whole app starts with <strong>one command</strong> — on any laptop, identical every time.</p>

<h3>Backend Dockerfile (multi-stage — small final image)</h3>
<pre><span class="tok-comment"># --- build stage: compile with Maven ---</span>
<span class="tok-keyword">FROM</span> maven:3.9-eclipse-temurin-17 <span class="tok-keyword">AS</span> build
<span class="tok-keyword">WORKDIR</span> /app
<span class="tok-keyword">COPY</span> pom.xml .
<span class="tok-keyword">RUN</span> mvn -q dependency:go-offline      <span class="tok-comment"># cache deps layer</span>
<span class="tok-keyword">COPY</span> src ./src
<span class="tok-keyword">RUN</span> mvn -q clean package -DskipTests

<span class="tok-comment"># --- run stage: just the JRE + the jar ---</span>
<span class="tok-keyword">FROM</span> eclipse-temurin:17-jre
<span class="tok-keyword">WORKDIR</span> /app
<span class="tok-keyword">COPY</span> --from=build /app/target/*.jar app.jar
<span class="tok-keyword">EXPOSE</span> 8080
<span class="tok-keyword">ENTRYPOINT</span> [<span class="tok-string">"java"</span>, <span class="tok-string">"-jar"</span>, <span class="tok-string">"app.jar"</span>]</pre>

<h3>Frontend Dockerfile (build with Node, serve with nginx)</h3>
<pre><span class="tok-keyword">FROM</span> node:20 <span class="tok-keyword">AS</span> build
<span class="tok-keyword">WORKDIR</span> /web
<span class="tok-keyword">COPY</span> package*.json ./
<span class="tok-keyword">RUN</span> npm ci
<span class="tok-keyword">COPY</span> . .
<span class="tok-keyword">RUN</span> npm run build                     <span class="tok-comment"># outputs static files to /web/dist</span>

<span class="tok-keyword">FROM</span> nginx:alpine
<span class="tok-keyword">COPY</span> --from=build /web/dist /usr/share/nginx/html
<span class="tok-keyword">COPY</span> nginx.conf /etc/nginx/conf.d/default.conf   <span class="tok-comment"># proxies /api → api:8080</span></pre>

<h3>docker-compose.yml — the three services together</h3>
<pre>services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: clinic
      POSTGRES_PASSWORD: clinic
    healthcheck:
      test: [<span class="tok-string">"CMD-SHELL"</span>, <span class="tok-string">"pg_isready -U postgres"</span>]
      interval: 5s
      retries: 5
  api:
    build: ./backend
    environment:
      DB_URL: jdbc:postgresql://db:5432/clinic
      DB_USER: postgres
      DB_PASSWORD: clinic
      JWT_SECRET: \${JWT_SECRET:-dev-secret-change-me}
    depends_on:
      db: { condition: service_healthy }   <span class="tok-comment"># wait until db is ready</span>
    ports: [<span class="tok-string">"8080:8080"</span>]
  web:
    build: ./frontend
    depends_on: [api]
    ports: [<span class="tok-string">"5173:80"</span>]</pre>

<h3>Worked example — up in one command</h3>
<div class="out"><b>$</b> docker compose up --build
  [+] Running 3/3
   ✔ Container clinic-db-1   Healthy
   ✔ Container clinic-api-1  Started
   ✔ Container clinic-web-1  Started
<b>Smoke test — is each layer alive?</b>
<b>$</b> curl -s -o /dev/null -w "%{http_code}" localhost:8080/api/doctors/1/slots
  200                                  ← api mounted &amp; talking to db
<b>$</b> curl -s -o /dev/null -w "%{http_code}" localhost:5173
  200                                  ← web served
<b>Open</b> http://localhost:5173 → register → book. The whole system, from one command.</div>

<div class="pitfall"><strong>Trap:</strong> the api starting before the database is ready and crashing on the first connection. The <code>depends_on … service_healthy</code> + the db <code>healthcheck</code> make Compose wait until Postgres actually accepts connections — not just until its container exists.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Secrets do not belong in the image.</b> Notice <code>JWT_SECRET</code> comes from an environment variable (<code>\${JWT_SECRET:-...}</code>), not hard-coded. Baking a secret into a Docker image ships it to anyone who pulls the image. Real deployments inject secrets at run time (env, Docker secrets, a vault). <em>Why beyond syllabus: secret management is an operational security concern the syllabus almost never covers, yet reviewers notice it.</em></div>

<a class="link-card exphub" href="/exp-hub/docker?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker &amp; Compose on Exp Hub</span><span class="lc-sub">Images, multi-stage builds and compose — step by step.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 7 · Bài 7.1</span>
<h2>Dockerize &amp; compose cả hệ thống</h2>
<p class="lead">"Chạy trên máy tôi" không phải điểm số. Đóng gói từng phần vào một container, mô tả cả ba trong một <code>docker-compose.yml</code>, và cả app khởi động bằng <strong>một lệnh</strong> — trên mọi laptop, giống hệt mỗi lần.</p>

<h3>Dockerfile backend (multi-stage — image cuối nhỏ)</h3>
<pre><span class="tok-comment"># --- stage build: biên dịch bằng Maven ---</span>
<span class="tok-keyword">FROM</span> maven:3.9-eclipse-temurin-17 <span class="tok-keyword">AS</span> build
<span class="tok-keyword">WORKDIR</span> /app
<span class="tok-keyword">COPY</span> pom.xml .
<span class="tok-keyword">RUN</span> mvn -q dependency:go-offline      <span class="tok-comment"># cache layer dependency</span>
<span class="tok-keyword">COPY</span> src ./src
<span class="tok-keyword">RUN</span> mvn -q clean package -DskipTests

<span class="tok-comment"># --- stage run: chỉ JRE + file jar ---</span>
<span class="tok-keyword">FROM</span> eclipse-temurin:17-jre
<span class="tok-keyword">WORKDIR</span> /app
<span class="tok-keyword">COPY</span> --from=build /app/target/*.jar app.jar
<span class="tok-keyword">EXPOSE</span> 8080
<span class="tok-keyword">ENTRYPOINT</span> [<span class="tok-string">"java"</span>, <span class="tok-string">"-jar"</span>, <span class="tok-string">"app.jar"</span>]</pre>

<h3>Dockerfile frontend (build bằng Node, phục vụ bằng nginx)</h3>
<pre><span class="tok-keyword">FROM</span> node:20 <span class="tok-keyword">AS</span> build
<span class="tok-keyword">WORKDIR</span> /web
<span class="tok-keyword">COPY</span> package*.json ./
<span class="tok-keyword">RUN</span> npm ci
<span class="tok-keyword">COPY</span> . .
<span class="tok-keyword">RUN</span> npm run build                     <span class="tok-comment"># xuất file tĩnh ra /web/dist</span>

<span class="tok-keyword">FROM</span> nginx:alpine
<span class="tok-keyword">COPY</span> --from=build /web/dist /usr/share/nginx/html
<span class="tok-keyword">COPY</span> nginx.conf /etc/nginx/conf.d/default.conf   <span class="tok-comment"># proxy /api → api:8080</span></pre>

<h3>docker-compose.yml — ba dịch vụ cùng nhau</h3>
<pre>services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: clinic
      POSTGRES_PASSWORD: clinic
    healthcheck:
      test: [<span class="tok-string">"CMD-SHELL"</span>, <span class="tok-string">"pg_isready -U postgres"</span>]
      interval: 5s
      retries: 5
  api:
    build: ./backend
    environment:
      DB_URL: jdbc:postgresql://db:5432/clinic
      DB_USER: postgres
      DB_PASSWORD: clinic
      JWT_SECRET: \${JWT_SECRET:-dev-secret-change-me}
    depends_on:
      db: { condition: service_healthy }   <span class="tok-comment"># đợi tới khi db sẵn sàng</span>
    ports: [<span class="tok-string">"8080:8080"</span>]
  web:
    build: ./frontend
    depends_on: [api]
    ports: [<span class="tok-string">"5173:80"</span>]</pre>

<h3>Ví dụ có lời giải — lên bằng một lệnh</h3>
<div class="out"><b>$</b> docker compose up --build
  [+] Running 3/3
   ✔ Container clinic-db-1   Healthy
   ✔ Container clinic-api-1  Started
   ✔ Container clinic-web-1  Started
<b>Smoke test — mỗi lớp còn sống?</b>
<b>$</b> curl -s -o /dev/null -w "%{http_code}" localhost:8080/api/doctors/1/slots
  200                                  ← api đã mount &amp; nói chuyện với db
<b>$</b> curl -s -o /dev/null -w "%{http_code}" localhost:5173
  200                                  ← web đã phục vụ
<b>Mở</b> http://localhost:5173 → đăng ký → đặt lịch. Cả hệ thống, từ một lệnh.</div>

<div class="pitfall"><strong>Bẫy:</strong> api khởi động trước khi CSDL sẵn sàng và sập ở kết nối đầu. <code>depends_on … service_healthy</code> + <code>healthcheck</code> của db khiến Compose đợi tới khi Postgres thực sự nhận kết nối — không chỉ tới khi container tồn tại.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bí mật không thuộc về image.</b> Chú ý <code>JWT_SECRET</code> đến từ một biến môi trường (<code>\${JWT_SECRET:-...}</code>), không hard-code. Nướng một bí mật vào image Docker là ship nó cho bất kỳ ai pull image. Triển khai thật tiêm bí mật lúc chạy (env, Docker secrets, một vault). <em>Vì sao ngoài syllabus: quản lý bí mật là mối lo bảo mật vận hành mà giáo trình gần như không nhắc, nhưng hội đồng để ý.</em></div>

<a class="link-card exphub" href="/exp-hub/docker?ref=%2Fcourses%2Fclinic-appointment-booking-system%2Flearn&reflabel=INT601" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker &amp; Compose trên Exp Hub</span><span class="lc-sub">Image, multi-stage build và compose — từng bước.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 8 — NÂNG CAO (★ NGOÀI GIÁO TRÌNH) ══════════════════ */
    {
      title: 'Section 8 — Advanced: ship like a pro (Beyond the syllabus)|||Mục 8 — Nâng cao: ship như dân chuyên (Ngoài giáo trình)',
      description: 'Cả chương ★ ngoài giáo trình: khoá bi quan, nhắc lịch, báo cáo lịch ngày, và CI tự động — biến đồ án tốt thành đồ án ấn tượng.',
      lessons: [
        {
          title: '8.1 — Pessimistic lock, reminders, reporting & CI|||8.1 — Khoá bi quan, nhắc lịch, báo cáo & CI',
          slug: 'int601-advanced',
          type: 'VIDEO',
          description: 'Bốn nâng cấp ngoài giáo trình để nổi bật ở buổi bảo vệ: mỗi cái là một điểm cộng rõ ràng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 8 · Lesson 8.1</span>
<h2>Advanced — four upgrades that impress the committee</h2>
<p class="lead"><span class="badge">★ Beyond the syllabus</span> This whole chapter is optional polish that separates a passing project from an impressive one. Add one or two — each is a clear, defensible "we went further" story.</p>

<h3>1) Pessimistic lock — the alternative concurrency strategy</h3>
<p>Section 4 used optimistic locking. For comparison — and to show you understand both — here is the pessimistic version. The DB physically locks the slot row until the transaction ends, so a second booker <em>waits</em> instead of failing:</p>
<pre><span class="tok-keyword">@Lock</span>(LockModeType.PESSIMISTIC_WRITE)
<span class="tok-keyword">@Query</span>(<span class="tok-string">"select s from Slot s where s.id = :id"</span>)
<span class="tok-type">Optional</span>&lt;Slot&gt; <span class="tok-function">findByIdForUpdate</span>(<span class="tok-keyword">@Param</span>(<span class="tok-string">"id"</span>) <span class="tok-type">Long</span> id);
<span class="tok-comment">// generates: SELECT ... FROM slots WHERE id=? FOR UPDATE</span></pre>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Trade-off to state in your defence:</b> optimistic scales better under low contention (no waiting, occasional retry); pessimistic guarantees the second caller waits rather than retries, but holds a lock and can deadlock if misused. For clinic booking either is correct — knowing <em>why</em> you chose one is the mark. <em>Beyond syllabus: comparative concurrency design.</em></div>

<h3>2) Appointment reminders — a scheduled job (mocked)</h3>
<pre><span class="tok-keyword">@Component</span> <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">ReminderJob</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">AppointmentRepository</span> appts;

  <span class="tok-keyword">@Scheduled</span>(cron = <span class="tok-string">"0 0 8 * * *"</span>)     <span class="tok-comment">// every day at 08:00</span>
  <span class="tok-keyword">public void</span> <span class="tok-function">sendDailyReminders</span>() {
    appts.findConfirmedForTomorrow().forEach(a -&gt;
      log.info(<span class="tok-string">"[REMINDER] "</span> + a.getPatient().getEmail()
             + <span class="tok-string">" you have an appointment at "</span> + a.getSlot().getStartTime()));
    <span class="tok-comment">// ★ mock: log instead of real email/SMS — same shape, zero cost, no scope creep</span>
  }
}</pre>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Mock the expensive edge.</b> A real email/SMS gateway is a scope killer (Lesson 0.2). A logged reminder proves the <em>design</em> — the scheduler, the query, the message — without an external dependency. Swapping the log line for a real provider later is a one-method change. <em>Beyond syllabus: designing a seam for a future integration.</em></div>

<h3>3) A reporting endpoint — the receptionist's daily schedule</h3>
<pre><span class="tok-keyword">@GetMapping</span>(<span class="tok-string">"/api/reception/report"</span>)   <span class="tok-comment">// RECEPTIONIST only</span>
<span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;DaySummary&gt; <span class="tok-function">report</span>(<span class="tok-keyword">@RequestParam</span> <span class="tok-type">LocalDate</span> date) {
  <span class="tok-keyword">return</span> reportService.summarize(date);   <span class="tok-comment">// counts per doctor: booked / confirmed / free</span>
}</pre>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>An aggregate query, not a loop.</b> Compute the report with a single <code>GROUP BY</code> in the database, not by fetching every row and counting in Java. Pushing aggregation to SQL is faster and is exactly the "score-high edge" the topic bank rewards. <em>Beyond syllabus: read-model / reporting design.</em></div>

<h3>4) Continuous Integration — tests run on every push</h3>
<pre><span class="tok-comment"># .github/workflows/ci.yml</span>
<span class="tok-keyword">name</span>: CI
<span class="tok-keyword">on</span>: [push, pull_request]
<span class="tok-keyword">jobs</span>:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: <span class="tok-string">'17'</span> }
      - run: mvn -q test        <span class="tok-comment"># fails the PR if any test (incl. concurrency) is red</span></pre>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Green-before-merge.</b> With CI, a teammate cannot merge code that breaks the booking guarantee — the concurrency test runs automatically and blocks a red PR. This is the "big-bang integration" cure from every software-engineering course, made mechanical. <em>Beyond syllabus: the team-process side of engineering.</em></div>

<h3>How far to go — pick by team strength</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">✓</div><div class="lz-t">Must</div><div class="lz-d">Sections 0–7 complete &amp; tested</div></div>
  <div class="lz-step"><div class="lz-k">+</div><div class="lz-t">Good</div><div class="lz-d">CI + reporting endpoint</div></div>
  <div class="lz-step"><div class="lz-k">★</div><div class="lz-t">Impressive</div><div class="lz-d">reminders + pessimistic-lock comparison in the report</div></div>
</div>

<div class="note-ct">That is the full project. You built an authenticated REST API, a race-safe transactional core, a React SPA, a test suite that proves correctness, and a one-command Docker deployment — the exact skeleton every full-stack internship task reuses. Record your demo (Lesson 0.5) and defend it with confidence.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 8 · Bài 8.1</span>
<h2>Nâng cao — bốn nâng cấp gây ấn tượng với hội đồng</h2>
<p class="lead"><span class="badge">★ Ngoài giáo trình</span> Cả chương này là phần tô điểm tuỳ chọn tách một đồ án qua môn khỏi một đồ án ấn tượng. Thêm một hoặc hai — mỗi cái là một câu chuyện "chúng tôi đi xa hơn" rõ ràng, bảo vệ được.</p>

<h3>1) Khoá bi quan — chiến lược tương tranh thay thế</h3>
<p>Mục 4 dùng optimistic locking. Để so sánh — và cho thấy bạn hiểu cả hai — đây là bản pessimistic. DB khoá vật lý dòng slot tới khi transaction kết thúc, nên người đặt thứ hai <em>đợi</em> thay vì lỗi:</p>
<pre><span class="tok-keyword">@Lock</span>(LockModeType.PESSIMISTIC_WRITE)
<span class="tok-keyword">@Query</span>(<span class="tok-string">"select s from Slot s where s.id = :id"</span>)
<span class="tok-type">Optional</span>&lt;Slot&gt; <span class="tok-function">findByIdForUpdate</span>(<span class="tok-keyword">@Param</span>(<span class="tok-string">"id"</span>) <span class="tok-type">Long</span> id);
<span class="tok-comment">// sinh ra: SELECT ... FROM slots WHERE id=? FOR UPDATE</span></pre>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đánh đổi để nói khi bảo vệ:</b> optimistic mở rộng tốt hơn khi tranh chấp thấp (không đợi, thỉnh thoảng thử lại); pessimistic bảo đảm người gọi thứ hai đợi thay vì thử lại, nhưng giữ khoá và có thể deadlock nếu dùng sai. Với đặt lịch phòng khám, cái nào cũng đúng — biết <em>vì sao</em> bạn chọn một cái mới là điểm. <em>Ngoài giáo trình: thiết kế tương tranh so sánh.</em></div>

<h3>2) Nhắc lịch — một job theo lịch (mock)</h3>
<pre><span class="tok-keyword">@Component</span> <span class="tok-keyword">@RequiredArgsConstructor</span>
<span class="tok-keyword">public class</span> <span class="tok-type">ReminderJob</span> {
  <span class="tok-keyword">private final</span> <span class="tok-type">AppointmentRepository</span> appts;

  <span class="tok-keyword">@Scheduled</span>(cron = <span class="tok-string">"0 0 8 * * *"</span>)     <span class="tok-comment">// mỗi ngày lúc 08:00</span>
  <span class="tok-keyword">public void</span> <span class="tok-function">sendDailyReminders</span>() {
    appts.findConfirmedForTomorrow().forEach(a -&gt;
      log.info(<span class="tok-string">"[NHẮC LỊCH] "</span> + a.getPatient().getEmail()
             + <span class="tok-string">" bạn có lịch lúc "</span> + a.getSlot().getStartTime()));
    <span class="tok-comment">// ★ mock: log thay vì email/SMS thật — cùng hình dạng, không tốn kém, không phình scope</span>
  }
}</pre>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mock phần đắt đỏ ở rìa.</b> Một gateway email/SMS thật là thứ giết scope (Bài 0.2). Một nhắc lịch được log chứng minh <em>thiết kế</em> — bộ lịch, truy vấn, thông điệp — mà không phụ thuộc bên ngoài. Đổi dòng log lấy một provider thật sau này là thay đổi một method. <em>Ngoài giáo trình: thiết kế "đường nối" cho tích hợp tương lai.</em></div>

<h3>3) Endpoint báo cáo — lịch trong ngày của lễ tân</h3>
<pre><span class="tok-keyword">@GetMapping</span>(<span class="tok-string">"/api/reception/report"</span>)   <span class="tok-comment">// chỉ LỄ TÂN</span>
<span class="tok-keyword">public</span> <span class="tok-type">List</span>&lt;DaySummary&gt; <span class="tok-function">report</span>(<span class="tok-keyword">@RequestParam</span> <span class="tok-type">LocalDate</span> date) {
  <span class="tok-keyword">return</span> reportService.summarize(date);   <span class="tok-comment">// đếm theo bác sĩ: booked / confirmed / free</span>
}</pre>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một truy vấn tổng hợp, không phải vòng lặp.</b> Tính báo cáo bằng một <code>GROUP BY</code> trong CSDL, không phải nạp mọi dòng rồi đếm trong Java. Đẩy việc tổng hợp về SQL nhanh hơn và chính là "góc ăn điểm cao" mà ngân hàng đề tài thưởng. <em>Ngoài giáo trình: thiết kế read-model / báo cáo.</em></div>

<h3>4) Continuous Integration — test chạy mỗi lần push</h3>
<pre><span class="tok-comment"># .github/workflows/ci.yml</span>
<span class="tok-keyword">name</span>: CI
<span class="tok-keyword">on</span>: [push, pull_request]
<span class="tok-keyword">jobs</span>:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: <span class="tok-string">'17'</span> }
      - run: mvn -q test        <span class="tok-comment"># fail PR nếu bất kỳ test (kể cả đồng thời) đỏ</span></pre>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xanh-trước-khi-merge.</b> Có CI, một đồng đội không thể merge code làm hỏng bảo đảm đặt lịch — test đồng thời chạy tự động và chặn một PR đỏ. Đây là thuốc chữa "big-bang integration" từ mọi môn kỹ nghệ phần mềm, được cơ giới hoá. <em>Ngoài giáo trình: mặt quy-trình-nhóm của kỹ nghệ.</em></div>

<h3>Đi xa tới đâu — chọn theo sức nhóm</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">✓</div><div class="lz-t">Bắt buộc</div><div class="lz-d">Mục 0–7 hoàn chỉnh &amp; đã test</div></div>
  <div class="lz-step"><div class="lz-k">+</div><div class="lz-t">Tốt</div><div class="lz-d">CI + endpoint báo cáo</div></div>
  <div class="lz-step"><div class="lz-k">★</div><div class="lz-t">Ấn tượng</div><div class="lz-d">nhắc lịch + so sánh pessimistic-lock trong báo cáo</div></div>
</div>

<div class="note-ct">Đó là toàn bộ đồ án. Bạn đã xây một REST API có xác thực, một lõi giao dịch an toàn khi tranh chấp, một React SPA, một bộ test chứng minh tính đúng, và một triển khai Docker một lệnh — chính bộ khung mà mọi việc thực tập full-stack tái dùng. Quay video demo (Bài 0.5) và bảo vệ nó một cách tự tin.</div>
</div>
`,
        },
        {
          title: 'Quiz 8 — Frontend, testing & deployment|||Quiz 8 — Frontend, kiểm thử & triển khai',
          slug: 'int601-quiz-8',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu axios interceptor, xử lý 409, test đồng thời, Docker Compose và các nâng cấp ★.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'What does the axios request interceptor do in this project?|||axios request interceptor trong đồ án này làm gì?',
                options: [
                  'Renders components|||Render component',
                  'Attaches the JWT to the Authorization header of every request|||Gắn JWT vào header Authorization của mọi request',
                  'Creates the database|||Tạo CSDL',
                  'Compiles the Java code|||Biên dịch code Java',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'When the booking screen gets a 409, the best UX is to…|||Khi màn hình đặt lịch nhận 409, UX tốt nhất là…',
                options: [
                  'Crash the app|||Làm sập app',
                  'Show "slot just taken" and reload the slot list|||Hiện "khung vừa bị đặt" và nạp lại danh sách khung',
                  'Retry silently forever|||Âm thầm thử lại mãi',
                  'Log the user out|||Đăng xuất người dùng',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why must the concurrency test use a CountDownLatch and assert on the DB row count?|||Vì sao test đồng thời phải dùng CountDownLatch và assert số dòng DB?',
                options: [
                  'To make the test slower|||Để test chậm hơn',
                  'To guarantee the two threads truly overlap and to verify the real outcome, not just HTTP codes|||Để chắc hai luồng thực sự chồng lấn và kiểm kết quả thật, không chỉ mã HTTP',
                  'Because JUnit requires it|||Vì JUnit bắt buộc',
                  'To avoid using the database|||Để tránh dùng CSDL',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'In docker-compose, why does the api use depends_on with condition service_healthy?|||Trong docker-compose, vì sao api dùng depends_on với condition service_healthy?',
                options: [
                  'To build a smaller image|||Để build image nhỏ hơn',
                  'To wait until Postgres actually accepts connections before starting|||Để đợi tới khi Postgres thực sự nhận kết nối rồi mới khởi động',
                  'To expose port 5173|||Để mở cổng 5173',
                  'To skip the healthcheck|||Để bỏ healthcheck',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) Why keep JWT_SECRET as an environment variable instead of hard-coding it in the image?|||(Ngoài giáo trình) Vì sao giữ JWT_SECRET là biến môi trường thay vì hard-code trong image?',
                options: [
                  'It runs faster|||Chạy nhanh hơn',
                  'A secret baked into an image ships to anyone who pulls it|||Bí mật nướng vào image sẽ ship cho bất kỳ ai pull nó',
                  'Docker forbids strings|||Docker cấm chuỗi',
                  'It reduces image size|||Nó giảm cỡ image',
                ], correctIndex: 1,
              },
              {
                id: 'q6', points: 1,
                question: '(Beyond syllabus) Pessimistic locking (SELECT ... FOR UPDATE) differs from optimistic in that…|||(Ngoài giáo trình) Khoá bi quan (SELECT ... FOR UPDATE) khác optimistic ở chỗ…',
                options: [
                  'It never uses the database|||Không bao giờ dùng CSDL',
                  'It locks the row up front so the second caller waits instead of failing and retrying|||Nó khoá dòng ngay từ đầu nên người gọi thứ hai đợi thay vì lỗi rồi thử lại',
                  'It is always faster|||Luôn nhanh hơn',
                  'It removes the need for transactions|||Nó bỏ nhu cầu transaction',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
