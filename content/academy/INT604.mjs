/**
 * INT604 — Helpdesk / IT Ticketing API (Kỳ 6 — Thực tập, project #4).
 * REST-API-only: Spring Boot 3 (Java 17) REST API + JWT + PostgreSQL (không frontend).
 * Trọng tâm: thiết kế API, MÁY TRẠNG THÁI ticket, GÁN VIỆC NGUYÊN TỬ (optimistic @Version),
 * SLA due-by theo độ ưu tiên, endpoint báo cáo GROUP BY, và kiểm thử (kèm test đồng thời).
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản demo)
 * → domain/DB design → backend setup → auth/JWT & role → state machine + atomic assign (lõi)
 * → SLA & reporting → testing → deployment (Docker) → nâng cao (★ ngoài giáo trình).
 * Song ngữ EN/VN đối xứng. Code Spring/SQL <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Deep-link CodeLab spring-boot/sql/authentication/rest-apis; Docker/CI → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT604.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (Spring/compose/shell) = \${ ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT604',
    title: 'Helpdesk Ticketing API',
    slug: 'helpdesk-ticketing-api',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #4 — build an IT helpdesk ticketing REST API: Spring Boot 3 + JWT + PostgreSQL, two roles, a strict ticket state machine and atomic assignment so two agents never grab one ticket. SLA timer, a GROUP BY report, tests, shipped with Docker.|||Đồ án thực tập #4 — REST API quản lý ticket helpdesk IT: Spring Boot 3 + JWT + PostgreSQL, hai vai trò, máy trạng thái ticket chặt chẽ và gán việc nguyên tử để hai agent không giành cùng ticket. Có SLA, báo cáo GROUP BY, test, đóng gói Docker.',
    description: 'INT604 là đồ án thực tập thứ tư của Kỳ 6: bạn xây một REST API QUẢN LÝ TICKET HELPDESK IT hoàn chỉnh — không frontend, tập trung toàn lực vào thiết kế API server-side đúng chuẩn. Backend viết bằng Spring Boot 3 + Java 17, dữ liệu trong PostgreSQL qua Spring Data JPA; xác thực bằng JWT và phân quyền hai vai trò (USER mở ticket/bình luận/xem ticket của mình; AGENT nhận việc, đổi trạng thái, giải quyết). Trọng tâm kỹ thuật gồm HAI viên ngọc: (1) một MÁY TRẠNG THÁI ticket (OPEN→ASSIGNED→IN_PROGRESS→RESOLVED→CLOSED) từ chối mọi chuyển trạng thái bất hợp lệ, và (2) GÁN VIỆC NGUYÊN TỬ — hai agent không bao giờ cùng giành được một ticket chưa gán, nhờ khoá lạc quan @Version + @Transactional + UPDATE có điều kiện. Thêm một bộ đếm SLA (due-by theo độ ưu tiên) và một endpoint báo cáo dùng GROUP BY. Cuối cùng đóng gói bằng Docker Compose và viết kịch bản demo. Đây là khuôn "REST API nghiệp vụ có trạng thái" mà rất nhiều hệ thống nội bộ (helpdesk, đơn từ, phê duyệt) tái sử dụng.',
    whatYouLearn: 'Thiết kế domain & ERD cho nghiệp vụ ticket (User/Ticket/Comment) với trường trạng thái + assignee + version; dựng REST API Spring Boot 3 theo kiến trúc phân lớp Controller→Service→Repository; JPA/Hibernate + PostgreSQL, DTO & mapping, Bean Validation; xác thực JWT + phân quyền theo role (USER vs AGENT) với Spring Security; thiết kế API sạch (status code, error shape, phân trang); MÁY TRẠNG THÁI ticket với bảng chuyển hợp lệ và từ chối chuyển sai; GÁN VIỆC NGUYÊN TỬ an toàn khi tranh chấp (@Version optimistic lock + UPDATE có điều kiện WHERE assignee_id IS NULL + transaction); tính SLA due-by theo độ ưu tiên và cờ quá hạn; endpoint báo cáo bằng GROUP BY (không lặp trong Java); kiểm thử unit + integration (JUnit 5, MockMvc) và một test đồng thời chứng minh chỉ một lượt gán "dính"; đóng gói Docker Compose (api + db) + biến môi trường; và một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học PRO192 (Java/OOP), DBI202 (CSDL/SQL) và PRJ301 (Java web/MVC). Cần: JDK 17, một IDE (IntelliJ IDEA khuyên dùng), Docker Desktop, một client test API (Postman hoặc REST Client trong VS Code) và một tài khoản GitHub cho nhóm. KHÔNG cần kiến thức frontend — đây là đồ án REST API thuần.',
    documentsNote: 'Tham chiếu: Spring Boot Reference Documentation (docs.spring.io) • Spring Data JPA Reference • Spring Security Reference • PostgreSQL Documentation • jwt.io • REST API design guidelines. Công cụ: IntelliJ IDEA + VS Code, Postman, DBeaver/pgAdmin, Docker Desktop, draw.io (ERD & sơ đồ trạng thái). Luyện code: track Code Lab Spring Boot + SQL + Authentication + REST APIs. Git & Docker & CI: Exp Hub. Đây là project-course thực tập — vừa xây vừa quay video theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc REST API, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int604-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một REST API helpdesk thật, kiến trúc client–server, và bản đồ vòng đời từ ERD tới Docker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — an IT Helpdesk Ticketing API</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, deployable <strong>REST API</strong>: an IT helpdesk where a user opens a support ticket and an agent claims it, works it, and resolves it — with a <strong>strict state machine</strong> that rejects illegal status jumps and an <strong>atomic assignment</strong> so two agents can never grab the same ticket. There is <em>no frontend</em>: your client is Postman and your test suite. By the end you have a running, tested API shipped in Docker, plus a recorded demo.</p>
<p>Every "internal tool" you will ever build — helpdesk, approval flow, order pipeline, leave requests — is a variation of this skeleton: an authenticated <strong>REST API</strong> over a relational database, a <strong>stateful entity</strong> that moves through a lifecycle, and one <strong>concurrency-safe action</strong> that must stay correct when two people act at once. Master this one and the rest are re-skins.</p>

<h3>The system in one picture — client / server / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">HTTP client (Postman)</div><div class="lz-d">curl · Postman · your tests</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Spring Boot REST API</div><div class="lz-d">Controller→Service→Repository · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · tickets · comments</div></div>
</div>
<div class="diagram">HTTP client ──HTTP/JSON──▶  Spring Boot API  ──JDBC/JPA──▶  PostgreSQL
  Postman          (port 8080)                      (port 5432)
  curl / tests  Authorization: Bearer &lt;JWT&gt;   tickets.version (optimistic lock)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design</div><div class="lz-nsub">Roles &amp; use cases · ERD · schema · the status &amp; version columns behind the core</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Spring Boot project &amp; layers</div><div class="lz-nsub">Entities · repositories · services · controllers · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">Register/login · Spring Security · User vs Agent</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">State machine &amp; atomic assignment</div><div class="lz-nsub">Legal transitions only · two agents, one winner · optimistic locking</div></div></div>
  <div class="lz-stage">Value</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">SLA timer &amp; reporting</div><div class="lz-nsub">Due-by from priority · breach flag · a GROUP BY report</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">JUnit · MockMvc · a concurrency test that proves only one assignment sticks</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose: api + db · env config · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Pessimistic locking · SLA escalation · audit log · CI</div><div class="lz-nsub">Ship like a real engineering team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — login → open a ticket → an agent claims it → its status changes — then grow it. A tiny end-to-end flow that runs beats a huge design that never compiles.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604#module-312" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Practice Spring Boot REST on Code Lab</span><span class="lc-sub">Warm up REST controllers, JPA and services before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — REST API quản lý ticket helpdesk IT</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một <strong>REST API</strong> thật, triển khai được: một helpdesk IT nơi người dùng mở một ticket hỗ trợ và agent nhận, xử lý, rồi giải quyết nó — với một <strong>máy trạng thái chặt chẽ</strong> từ chối mọi bước nhảy trạng thái bất hợp lệ và một <strong>cơ chế gán việc nguyên tử</strong> để hai agent không bao giờ giành được cùng một ticket. <em>Không có frontend</em>: client của bạn là Postman và bộ test. Kết thúc, bạn có một API chạy được, đã test, đóng gói Docker, kèm một video demo.</p>
<p>Mọi "công cụ nội bộ" bạn từng xây — helpdesk, luồng phê duyệt, đường ống đơn hàng, đơn xin nghỉ — đều là biến thể của bộ khung này: một <strong>REST API</strong> có xác thực trên CSDL quan hệ, một <strong>thực thể có trạng thái</strong> đi qua một vòng đời, và một <strong>hành động an toàn khi tranh chấp</strong> phải luôn đúng khi hai người cùng thao tác. Làm chủ cái này thì phần còn lại chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — client / server / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">HTTP client (Postman)</div><div class="lz-d">curl · Postman · bộ test</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Spring Boot REST API</div><div class="lz-d">Controller→Service→Repository · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · tickets · comments</div></div>
</div>
<div class="diagram">HTTP client ──HTTP/JSON──▶  Spring Boot API  ──JDBC/JPA──▶  PostgreSQL
  Postman          (cổng 8080)                     (cổng 5432)
  curl / test   Authorization: Bearer &lt;JWT&gt;   tickets.version (khoá lạc quan)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL</div><div class="lz-nsub">Vai trò &amp; use case · ERD · schema · cột status &amp; version đằng sau phần lõi</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Dự án Spring Boot &amp; các lớp</div><div class="lz-nsub">Entity · repository · service · controller · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (JWT)</div><div class="lz-nsub">Đăng ký/đăng nhập · Spring Security · User vs Agent</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Máy trạng thái &amp; gán việc nguyên tử</div><div class="lz-nsub">Chỉ chuyển hợp lệ · hai agent, một người thắng · khoá lạc quan</div></div></div>
  <div class="lz-stage">Giá trị</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">SLA &amp; báo cáo</div><div class="lz-nsub">Due-by theo độ ưu tiên · cờ quá hạn · một báo cáo GROUP BY</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">JUnit · MockMvc · một test đồng thời chứng minh chỉ một lượt gán dính</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose: api + db · cấu hình env · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Khoá bi quan · leo thang SLA · nhật ký · CI</div><div class="lz-nsub">Ship như một đội kỹ sư thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — đăng nhập → mở một ticket → một agent nhận → trạng thái đổi — rồi mới mở rộng. Một luồng nhỏ chạy được từ đầu đến cuối hơn hẳn một bản thiết kế đồ sộ không bao giờ biên dịch.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604#module-312" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Luyện Spring Boot REST trên Code Lab</span><span class="lc-sub">Khởi động REST controller, JPA và service trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int604-pham-vi',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Đúng phạm vi để làm xong: 2 vai trò, một máy trạng thái, gán việc nguyên tử, và bảng tiêu chí nghiệm thu bạn tự chấm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Scope, roles &amp; acceptance criteria</h2>
<p class="lead">The fastest way to fail an internship project is to build too much and finish nothing. Lock the scope now: <strong>two roles, one state machine, one atomic action, a handful of endpoints</strong>. Everything else is optional polish.</p>

<h3>Two roles — that is enough for real access control</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">USER (requester)</span><span class="v">Register/login · open a ticket (subject, description, priority) · comment on own ticket · view / close own tickets</span></div>
  <div class="kv"><span class="k">AGENT</span><span class="v">Login · see the unassigned queue · claim (assign) a ticket to self · move it through the workflow · resolve · comment · view assigned tickets · reports</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">USER opens a ticket ──▶ POST /tickets ──▶ status = OPEN
        │
        ▼
AGENT claims it ──▶ POST /tickets/{id}/assign ──▶ status = ASSIGNED (assignee = me)
        │                                              │
        │ second agent claims the SAME ticket ──▶ 409 Conflict ┘  (blocked)
        ▼
AGENT starts ──▶ IN_PROGRESS ──▶ resolves ──▶ RESOLVED ──▶ USER/AGENT closes ──▶ CLOSED</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A user can register, log in, and receive a JWT</td><td>POST /auth/register then /auth/login returns a token</td></tr>
<tr><td>2</td><td>A user opens a ticket; it starts OPEN with a computed due-by</td><td>POST /tickets → 201 + status OPEN + dueAt set</td></tr>
<tr><td>3</td><td>An agent claims an OPEN ticket → it becomes ASSIGNED to that agent</td><td>POST /tickets/{id}/assign → 200 + assignee = agent</td></tr>
<tr><td>4</td><td><b>Two agents cannot both claim one ticket</b></td><td>two concurrent assigns → exactly one 200, one 409</td></tr>
<tr><td>5</td><td><b>Illegal status jumps are rejected</b></td><td>OPEN → RESOLVED directly → 409 / 422 (not allowed)</td></tr>
<tr><td>6</td><td>Only an AGENT can change status; a USER cannot</td><td>USER calling /transition → 403</td></tr>
<tr><td>7</td><td>A user comments/views only their own tickets</td><td>touching another user's ticket → 403</td></tr>
<tr><td>8</td><td>The whole system runs from one <code>docker compose up</code></td><td>api on :8080, db healthy, smoke test 200/401</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> A web/mobile frontend, real email/SMS notifications, live chat, an "AI auto-resolver" as a core feature, multi-tenant orgs, attachments to S3. Simulate notifications with a log line. Depth on the state machine and atomic assignment scores; breadth with nothing finished does not.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 6). "Definition of Done = the tests are green" removes every argument about whether a feature works. <em>Why beyond syllabus: turning a checklist into executable specs is exactly how professional teams gate a release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một máy trạng thái, một hành động nguyên tử, vài endpoint</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">USER (người báo)</span><span class="v">Đăng ký/đăng nhập · mở ticket (tiêu đề, mô tả, độ ưu tiên) · bình luận ticket của mình · xem / đóng ticket của mình</span></div>
  <div class="kv"><span class="k">AGENT</span><span class="v">Đăng nhập · xem hàng đợi chưa gán · nhận (gán) ticket cho mình · đẩy qua vòng xử lý · giải quyết · bình luận · xem ticket được gán · báo cáo</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">USER mở một ticket ──▶ POST /tickets ──▶ status = OPEN
        │
        ▼
AGENT nhận việc ──▶ POST /tickets/{id}/assign ──▶ status = ASSIGNED (assignee = tôi)
        │                                              │
        │ agent thứ 2 nhận ĐÚNG ticket đó ──▶ 409 Conflict ┘  (bị chặn)
        ▼
AGENT bắt đầu ──▶ IN_PROGRESS ──▶ giải quyết ──▶ RESOLVED ──▶ USER/AGENT đóng ──▶ CLOSED</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>User đăng ký, đăng nhập, nhận JWT</td><td>POST /auth/register rồi /auth/login trả token</td></tr>
<tr><td>2</td><td>User mở ticket; ticket bắt đầu OPEN với due-by đã tính</td><td>POST /tickets → 201 + status OPEN + dueAt được đặt</td></tr>
<tr><td>3</td><td>Agent nhận một ticket OPEN → nó thành ASSIGNED cho agent đó</td><td>POST /tickets/{id}/assign → 200 + assignee = agent</td></tr>
<tr><td>4</td><td><b>Hai agent không thể cùng nhận một ticket</b></td><td>hai lượt assign đồng thời → đúng một 200, một 409</td></tr>
<tr><td>5</td><td><b>Bước nhảy trạng thái bất hợp lệ bị từ chối</b></td><td>OPEN → RESOLVED trực tiếp → 409 / 422 (không cho)</td></tr>
<tr><td>6</td><td>Chỉ AGENT được đổi trạng thái; USER thì không</td><td>USER gọi /transition → 403</td></tr>
<tr><td>7</td><td>User chỉ bình luận/xem ticket của chính mình</td><td>đụng ticket của người khác → 403</td></tr>
<tr><td>8</td><td>Cả hệ chạy từ một lệnh <code>docker compose up</code></td><td>api ở :8080, db healthy, smoke test 200/401</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Một frontend web/mobile, thông báo email/SMS thật, chat trực tiếp, "AI tự giải quyết" làm tính năng lõi, đa tổ chức (multi-tenant), đính kèm lên S3. Hãy giả lập thông báo bằng một dòng log. Sâu ở máy trạng thái và gán việc nguyên tử mới ăn điểm; ôm rộng mà chẳng xong thì không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 6). "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc một tính năng có chạy hay không. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int604-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Spring Boot + PostgreSQL + JWT — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Every choice below is picked because it is <strong>what you already learned</strong> (PRO192, DBI202, PRJ301) and because it is the mainstream industry combo for a Java backend internship.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>API — Spring Boot 3 (Java 17)</b><br/>REST API with the layered pattern from PRJ301, now as JSON endpoints instead of JSP. Spring Web + Spring Data JPA + Spring Security + Bean Validation. <em>Why: the dominant Java enterprise framework; auto-config removes boilerplate.</em></div>
  <div class="lz-layer"><b>Persistence — Spring Data JPA / Hibernate</b><br/>Map Java entities to tables; write queries as methods. <em>Why: less JDBC boilerplate than PRJ301's raw DAO, but the same SQL underneath — and it gives you <code>@Version</code> optimistic locking for free, the heart of atomic assignment.</em></div>
  <div class="lz-layer"><b>Database — PostgreSQL 16</b><br/>A real, free, ACID relational database. <em>Why: transactions plus the version column are what make double-assignment impossible; Postgres is the industry default and speaks GROUP BY for the report.</em></div>
  <div class="lz-layer"><b>Auth — JWT (stateless)</b><br/>A signed token carries the user id and role; the server stores no session. <em>Why: standard for APIs; scales horizontally; no sticky sessions.</em></div>
  <div class="lz-layer"><b>Ship — Docker Compose</b><br/>Two containers (api, db) started by one command. <em>Why: "runs on my machine" becomes "runs anywhere"; graders love a one-command demo.</em></div>
</div>

<h3>The request journey — how a claim becomes a row change</h3>
<div class="diagram">POST /tickets/42/assign  (JWT in header)
   →  Spring Security filter validates JWT, checks role = AGENT
   →  TicketController.assign(42)
   →  TicketService.assign(42, agentId)   @Transactional
   →  UPDATE tickets SET assignee_id=?, status='ASSIGNED', version=version+1
                    WHERE id=42 AND assignee_id IS NULL AND version=?
   →  PostgreSQL: 1 row updated (winner) OR 0 rows (loser → 409)
   →  200 OK (assigned)  /  409 Conflict (already taken)</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A stack is a set of trade-offs, not a fashion.</b> You could swap Spring Boot for Node/Express, or Postgres for MySQL, and the architecture would be identical — the same three layers, the same version-guarded UPDATE. Reviewers respect a student who can say "I chose X over Y because…". <em>Why beyond syllabus: the syllabus teaches one stack; real engineering is choosing among many for reasons.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">REST API design on Code Lab</span><span class="lc-sub">Resources, verbs, status codes — the shape of a clean API.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì đó là <strong>thứ bạn đã học</strong> (PRO192, DBI202, PRJ301) và là bộ combo chủ đạo của ngành cho một kỳ thực tập backend Java.</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>API — Spring Boot 3 (Java 17)</b><br/>REST API theo mẫu phân lớp của PRJ301, nay là endpoint JSON thay vì JSP. Spring Web + Spring Data JPA + Spring Security + Bean Validation. <em>Vì sao: framework Java doanh nghiệp thống trị; auto-config bỏ hết boilerplate.</em></div>
  <div class="lz-layer"><b>Lưu trữ — Spring Data JPA / Hibernate</b><br/>Ánh xạ entity Java sang bảng; viết truy vấn thành method. <em>Vì sao: ít JDBC lặp lại hơn DAO thô của PRJ301, nhưng SQL bên dưới vẫn thế — và cho bạn <code>@Version</code> optimistic locking miễn phí, trái tim của việc gán việc nguyên tử.</em></div>
  <div class="lz-layer"><b>CSDL — PostgreSQL 16</b><br/>Một CSDL quan hệ thật, miễn phí, ACID. <em>Vì sao: transaction cộng cột version chính là thứ khiến việc gán trùng không thể xảy ra; Postgres là mặc định của ngành và nói GROUP BY cho báo cáo.</em></div>
  <div class="lz-layer"><b>Xác thực — JWT (stateless)</b><br/>Một token đã ký mang id user và role; server không lưu session. <em>Vì sao: chuẩn cho API; mở rộng ngang; không cần sticky session.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker Compose</b><br/>Hai container (api, db) khởi động bằng một lệnh. <em>Vì sao: "chạy trên máy tôi" thành "chạy ở mọi nơi"; giám khảo thích demo một lệnh.</em></div>
</div>

<h3>Hành trình một request — một lượt nhận việc thành một thay đổi dòng</h3>
<div class="diagram">POST /tickets/42/assign  (JWT trong header)
   →  Spring Security filter kiểm JWT, kiểm role = AGENT
   →  TicketController.assign(42)
   →  TicketService.assign(42, agentId)   @Transactional
   →  UPDATE tickets SET assignee_id=?, status='ASSIGNED', version=version+1
                    WHERE id=42 AND assignee_id IS NULL AND version=?
   →  PostgreSQL: 1 dòng được cập nhật (người thắng) HOẶC 0 dòng (kẻ thua → 409)
   →  200 OK (đã gán)  /  409 Conflict (đã bị lấy)</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một stack là tập hợp các đánh đổi, không phải mốt thời trang.</b> Bạn có thể thay Spring Boot bằng Node/Express, hay Postgres bằng MySQL, và kiến trúc vẫn y hệt — cùng ba lớp, cùng câu UPDATE có canh version. Hội đồng nể một sinh viên biết nói "tôi chọn X thay vì Y vì…". <em>Vì sao ngoài syllabus: giáo trình dạy một stack; kỹ nghệ thật là chọn giữa nhiều lựa chọn có lý do.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Thiết kế REST API trên Code Lab</span><span class="lc-sub">Tài nguyên, động từ, status code — hình dạng một API sạch.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int604-cai-dat',
          type: 'VIDEO',
          description: 'JDK 17, IntelliJ, Docker, Postman — cài một lần, dùng cả đồ án. Hướng dẫn chi tiết ở Exp Hub.',
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
<tr><td>Docker Desktop</td><td>Postgres + one-command ship</td><td><code>docker --version</code></td></tr>
<tr><td>Postman / REST Client</td><td>test the API without a UI</td><td>send a GET</td></tr>
<tr><td>Git + a GitHub repo</td><td>team workflow</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Fastest Postgres:</strong> don't install it — run it in Docker. <code>docker run --name helpdesk-db -e POSTGRES_PASSWORD=helpdesk -e POSTGRES_DB=helpdesk -p 5432:5432 -d postgres:16</code>. One command, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int604-cai-dat-moi-truong?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">JDK 17, IntelliJ, Docker Desktop, Postman — official links and a verify checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> mixing JDK versions. Spring Boot 3 needs Java 17+. If <code>java -version</code> shows 8 or 11, point <code>JAVA_HOME</code> at your 17 install and set the Project SDK to 17 in IntelliJ — otherwise you get a cryptic <code>UnsupportedClassVersionError</code>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Commit a Postman collection to the repo.</b> Export your requests (register, login, open ticket, assign, transition, report) as a <code>.json</code> collection and check it in. A reviewer can then click through your whole API in 30 seconds without reading code. <em>Why beyond syllabus: shipping an executable "how to try it" is developer-experience work the syllabus never grades but every good repo has.</em></div>
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
<tr><td>Docker Desktop</td><td>Postgres + ship một lệnh</td><td><code>docker --version</code></td></tr>
<tr><td>Postman / REST Client</td><td>test API không cần UI</td><td>gửi một GET</td></tr>
<tr><td>Git + một repo GitHub</td><td>quy trình nhóm</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Postgres nhanh nhất:</strong> đừng cài — chạy trong Docker. <code>docker run --name helpdesk-db -e POSTGRES_PASSWORD=helpdesk -e POSTGRES_DB=helpdesk -p 5432:5432 -d postgres:16</code>. Một lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int604-cai-dat-moi-truong?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">JDK 17, IntelliJ, Docker Desktop, Postman — link chính chủ và checklist kiểm trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> lẫn lộn phiên bản JDK. Spring Boot 3 cần Java 17+. Nếu <code>java -version</code> hiện 8 hay 11, trỏ <code>JAVA_HOME</code> vào bản 17 và đặt Project SDK = 17 trong IntelliJ — nếu không sẽ gặp lỗi khó hiểu <code>UnsupportedClassVersionError</code>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Commit một Postman collection vào repo.</b> Export các request (đăng ký, đăng nhập, mở ticket, gán, chuyển trạng thái, báo cáo) thành một collection <code>.json</code> và check-in. Người chấm bấm chạy cả API của bạn trong 30 giây mà không cần đọc code. <em>Vì sao ngoài syllabus: ship một "cách dùng thử" chạy được là công việc trải-nghiệm-lập-trình-viên mà giáo trình không chấm nhưng mọi repo tốt đều có.</em></div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int604-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng lõi, "khoảnh khắc hai agent giành một ticket", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the two things that are hard: <strong>an illegal transition is rejected</strong> and <strong>two agents fight over one ticket — only one wins, live, on camera</strong>. No UI needed: drive it with Postman and one terminal.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is a helpdesk ticketing API. Tickets follow a strict lifecycle, and two agents can never grab the same ticket. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — User flow (1.5m)</div><div class="lz-nsub">Register → login (show the JWT) → open a ticket in Postman → 201, status OPEN, dueAt computed from priority. Show it in "my tickets".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:00 — State machine (1.5m)</div><div class="lz-nsub">Agent claims → ASSIGNED → start → IN_PROGRESS → resolve → RESOLVED. Then try an illegal jump (OPEN → RESOLVED) → clean 409 "transition not allowed". Show a USER blocked (403) from transitioning.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">3:30 — The money shot (2m)</div><div class="lz-nsub">Two agents, one OPEN ticket, assign at the same instant (a small script firing two concurrent requests). One 200 "assigned to me", one 409 "already assigned". Then run the concurrency test in the terminal — green.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Under the hood (1.5m)</div><div class="lz-nsub">One command: <code>docker compose up</code>. Show the ERD, the version-guarded UPDATE, the transition table, and the GROUP BY report endpoint. One sentence: why double-assignment is impossible.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Close (30s)</div><div class="lz-nsub">"Stack: Spring Boot, PostgreSQL, JWT, Docker. Repo link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (never demo on an empty DB). Increase your Postman/terminal font size. Do one dry run. Record in 1080p. Keep mouse movements slow. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The demo is a product, not an afterthought.</b> Interviewers watch the first 60 seconds and the "hard part". Lead with the architecture and end with the concurrency proof — that ordering signals engineering maturity far more than a tour of every CRUD endpoint. <em>Why beyond syllabus: communication of your work is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD and a schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng hai thứ khó: <strong>một chuyển trạng thái bất hợp lệ bị từ chối</strong> và <strong>hai agent giành một ticket — chỉ một người thắng, ngay trên video</strong>. Không cần UI: điều khiển bằng Postman và một terminal.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là API quản lý ticket helpdesk. Ticket theo một vòng đời chặt chẽ, và hai agent không bao giờ giành được cùng một ticket. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng user (1.5m)</div><div class="lz-nsub">Đăng ký → đăng nhập (chỉ JWT) → mở một ticket trong Postman → 201, status OPEN, dueAt tính từ độ ưu tiên. Chỉ nó trong "ticket của tôi".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:00 — Máy trạng thái (1.5m)</div><div class="lz-nsub">Agent nhận → ASSIGNED → bắt đầu → IN_PROGRESS → giải quyết → RESOLVED. Rồi thử một bước nhảy sai (OPEN → RESOLVED) → 409 gọn "không cho chuyển". Cho thấy USER bị chặn (403) khỏi việc chuyển trạng thái.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">3:30 — Cảnh đắt giá (2m)</div><div class="lz-nsub">Hai agent, một ticket OPEN, cùng gán một khoảnh khắc (một script nhỏ bắn hai request đồng thời). Một 200 "đã gán cho tôi", một 409 "đã có người nhận". Rồi chạy test đồng thời trong terminal — xanh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Bên trong (1.5m)</div><div class="lz-nsub">Một lệnh: <code>docker compose up</code>. Chiếu ERD, câu UPDATE có canh version, bảng chuyển trạng thái, và endpoint báo cáo GROUP BY. Một câu: vì sao không thể gán trùng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Kết (30s)</div><div class="lz-nsub">"Stack: Spring Boot, PostgreSQL, JWT, Docker. Link repo trên màn hình. Cảm ơn." Chạy URL GitHub.</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed dữ liệu demo trước (đừng bao giờ demo trên DB rỗng). Tăng cỡ chữ Postman/terminal. Quay thử một lần. Quay 1080p. Di chuột chậm. Nếu hỏng, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Demo là một sản phẩm, không phải thứ làm cho có.</b> Nhà tuyển dụng xem 60 giây đầu và "phần khó". Mở bằng kiến trúc và kết bằng bằng chứng chống tranh chấp — thứ tự đó thể hiện sự trưởng thành kỹ thuật hơn nhiều so với đi tua từng endpoint CRUD. <em>Vì sao ngoài syllabus: khả năng trình bày công việc bị chấm ngầm ở khắp sự nghiệp, nhưng hiếm khi được dạy rõ.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến hai vai trò thành ERD và schema.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design|||Mục 1 — Thiết kế domain & CSDL',
      description: 'Biến hai vai trò thành use case, ERD và một schema chuẩn hoá — với cột status & version là trái tim của máy trạng thái và gán việc nguyên tử.',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int604-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, Ticket, Comment — và những trường quyết định trạng thái, người xử lý và tương tranh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"A <b>user</b> opens a <b>ticket</b>; an <b>agent</b> is assigned the ticket and moves it through a lifecycle; both add <b>comments</b>." The nouns give us three entities:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (USER or AGENT), email, password hash. Both roles are Users; role decides permissions. A user is the <em>requester</em> of tickets; an agent is the <em>assignee</em>.</div>
  <div class="lz-layer"><b>Ticket</b> — the unit of work: <code>subject</code>, <code>description</code>, <code>priority</code> (LOW/MEDIUM/HIGH/URGENT), <code>status</code> (OPEN/ASSIGNED/IN_PROGRESS/RESOLVED/CLOSED), a <code>requester</code>, a nullable <code>assignee</code>, a <code>dueAt</code> (SLA), and a <code>version</code>. This is the stateful, contended resource.</div>
  <div class="lz-layer"><b>Comment</b> — a note on a ticket: which <code>ticket</code>, which <code>author</code>, the <code>body</code>, and when. The conversation trail.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────┐  requester 1──* ┌──────────┐ 1──* ┌──────────────┐
│   User   │─────────────────│  Ticket  │──────│   Comment    │
│ (USER /  │  assignee  0/1──*│          │      └──────────────┘
│  AGENT)  │─────────────────│          │            *│ author
└──────────┘                 └──────────┘             │1
                                                 ┌──────────┐
                                                 │   User   │
                                                 └──────────┘

User(requester) 1—* Ticket : a user opens many tickets
User(assignee)  0/1 of Ticket : a ticket has AT MOST ONE agent (NULL until claimed) ← the rule
Ticket 1—* Comment          : a ticket has many comments
User(author)  1—* Comment   : a user writes many comments</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> User An opens "VPN broken" as HIGH. Agent Bao and Agent Chi both try to claim it.
<b>Step 1 —</b> An sends POST /tickets { subject:"VPN broken", priority:"HIGH" } → a Ticket row: requester=An, assignee=NULL, status=OPEN.
<b>Step 2 —</b> Bao sends POST /tickets/{id}/assign → assignee flips NULL → Bao, status OPEN → ASSIGNED.
<b>Step 3 —</b> Chi sends the same claim a millisecond later → assignee is no longer NULL → rejected (409).
<b>Result:</b> the "assignee is at most one, NULL until claimed" invariant is what makes Chi lose. The nullable assignee column + a guarded UPDATE (Section 4) enforce it.</div>

<div class="pitfall"><strong>Design trap:</strong> storing the status as free text and letting any string in. Then "Open", "OPEN", "opened", "done" all coexist and no query is reliable. Constrain status to a fixed enum (in Java and, ideally, a DB CHECK) so the state machine has a closed, known set of states.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"At most one assignee" is a state invariant, not just a foreign key.</b> The foreign key says "assignee_id must reference a real user"; the invariant you actually care about is "only one agent may transition NULL → them, once". A plain FK cannot express that — it takes the version column and a conditional UPDATE (Section 4). <em>Why beyond syllabus: distinguishing "referential integrity" from "a concurrency-safe state transition" is a modelling skill most juniors miss.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604#module-412" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice schema design on Code Lab</span><span class="lc-sub">DDL, keys and constraints — the SQL under your JPA entities.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>user</b> mở một <b>ticket</b>; một <b>agent</b> được gán ticket và đẩy nó qua một vòng đời; cả hai thêm <b>bình luận</b>." Các danh từ cho ta ba thực thể:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (USER hoặc AGENT), email, hash mật khẩu. Cả hai vai trò đều là User; role quyết định quyền. Một user là <em>người báo</em> ticket; một agent là <em>người được gán</em>.</div>
  <div class="lz-layer"><b>Ticket</b> — đơn vị công việc: <code>subject</code>, <code>description</code>, <code>priority</code> (LOW/MEDIUM/HIGH/URGENT), <code>status</code> (OPEN/ASSIGNED/IN_PROGRESS/RESOLVED/CLOSED), một <code>requester</code>, một <code>assignee</code> có thể NULL, một <code>dueAt</code> (SLA), và một <code>version</code>. Đây là tài nguyên có trạng thái, bị tranh chấp.</div>
  <div class="lz-layer"><b>Comment</b> — một ghi chú trên ticket: thuộc <code>ticket</code> nào, <code>author</code> nào, <code>body</code>, và thời điểm. Dấu vết hội thoại.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────┐  requester 1──* ┌──────────┐ 1──* ┌──────────────┐
│   User   │─────────────────│  Ticket  │──────│   Comment    │
│ (USER /  │  assignee 0/1──*│          │      └──────────────┘
│  AGENT)  │─────────────────│          │            *│ author
└──────────┘                 └──────────┘             │1
                                                 ┌──────────┐
                                                 │   User   │
                                                 └──────────┘

User(requester) 1—* Ticket : một user mở nhiều ticket
User(assignee)  0/1 của Ticket : một ticket có TỐI ĐA MỘT agent (NULL tới khi nhận) ← quy tắc
Ticket 1—* Comment          : một ticket có nhiều bình luận
User(author)  1—* Comment   : một user viết nhiều bình luận</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> User An mở "Hỏng VPN" mức HIGH. Agent Bảo và Agent Chi cùng thử nhận nó.
<b>Bước 1 —</b> An gửi POST /tickets { subject:"Hỏng VPN", priority:"HIGH" } → một dòng Ticket: requester=An, assignee=NULL, status=OPEN.
<b>Bước 2 —</b> Bảo gửi POST /tickets/{id}/assign → assignee đổi NULL → Bảo, status OPEN → ASSIGNED.
<b>Bước 3 —</b> Chi gửi lượt nhận y hệt một mili-giây sau → assignee không còn NULL → bị từ chối (409).
<b>Kết quả:</b> bất biến "assignee tối đa một, NULL tới khi nhận" chính là thứ khiến Chi thua. Cột assignee cho phép NULL + một UPDATE có điều kiện (Mục 4) thực thi nó.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> lưu status là text tự do và cho vào bất kỳ chuỗi nào. Khi đó "Open", "OPEN", "opened", "done" cùng tồn tại và không truy vấn nào đáng tin. Ràng buộc status vào một enum cố định (trong Java và, lý tưởng, một CHECK trong DB) để máy trạng thái có một tập trạng thái đóng, đã biết.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Tối đa một assignee" là bất biến trạng thái, không chỉ là khoá ngoại.</b> Khoá ngoại nói "assignee_id phải trỏ tới một user thật"; bất biến bạn thực sự quan tâm là "chỉ một agent được chuyển NULL → chính họ, một lần". Một FK thường không diễn tả được điều đó — phải cần cột version và một UPDATE có điều kiện (Mục 4). <em>Vì sao ngoài syllabus: phân biệt "toàn vẹn tham chiếu" với "một chuyển trạng thái an toàn khi tranh chấp" là kỹ năng mô hình hoá đa số junior bỏ sót.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604#module-412" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Luyện thiết kế schema trên Code Lab</span><span class="lc-sub">DDL, khoá và ràng buộc — phần SQL nằm dưới các JPA entity của bạn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The schema, the status enum & the version column|||1.2 — Schema, enum trạng thái & cột version',
          slug: 'int604-schema',
          type: 'VIDEO',
          description: 'DDL PostgreSQL đầy đủ + cột version (khoá lạc quan) và CHECK cho status: hai thứ đứng sau lõi tương tranh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The schema, the status enum &amp; the version column</h2>
<p class="lead">Here is the whole database. Notice two things — the <code>version</code> column on <code>tickets</code> and the fixed set of <code>status</code> values. Those two are your <strong>last line of defence</strong>: the version column lets a guarded UPDATE reject a second agent, and the closed status set makes an illegal transition detectable rather than "just another string".</p>

<h3>The DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- bcrypt hash</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- USER | AGENT</span>
);

<span class="tok-keyword">CREATE TABLE</span> tickets (
  id           <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  subject      <span class="tok-type">VARCHAR</span>(200) <span class="tok-keyword">NOT NULL</span>,
  description  <span class="tok-type">TEXT</span> <span class="tok-keyword">NOT NULL</span>,
  priority     <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'MEDIUM'</span>
                 <span class="tok-keyword">CHECK</span> (priority <span class="tok-keyword">IN</span> (<span class="tok-string">'LOW'</span>,<span class="tok-string">'MEDIUM'</span>,<span class="tok-string">'HIGH'</span>,<span class="tok-string">'URGENT'</span>)),
  status       <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'OPEN'</span>
                 <span class="tok-keyword">CHECK</span> (status <span class="tok-keyword">IN</span> (<span class="tok-string">'OPEN'</span>,<span class="tok-string">'ASSIGNED'</span>,<span class="tok-string">'IN_PROGRESS'</span>,<span class="tok-string">'RESOLVED'</span>,<span class="tok-string">'CLOSED'</span>)),
  requester_id <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  assignee_id  <span class="tok-type">BIGINT</span> <span class="tok-keyword">REFERENCES</span> users(id),      <span class="tok-comment">-- NULL until an agent claims it</span>
  due_at       <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL</span>,                 <span class="tok-comment">-- SLA due-by, from priority</span>
  created_at   <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  updated_at   <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  version      <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-number">0</span>          <span class="tok-comment">-- ★ optimistic lock (Section 4)</span>
);

<span class="tok-keyword">CREATE TABLE</span> comments (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  ticket_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> tickets(id),
  author_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  body        <span class="tok-type">TEXT</span> <span class="tok-keyword">NOT NULL</span>,
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now()
);

<span class="tok-keyword">CREATE INDEX</span> idx_ticket_status   <span class="tok-keyword">ON</span> tickets(status);      <span class="tok-comment">-- fast queue queries</span>
<span class="tok-keyword">CREATE INDEX</span> idx_ticket_assignee <span class="tok-keyword">ON</span> tickets(assignee_id);</pre>

<h3>Worked example — why the version column is the real guard</h3>
<div class="out"><b>Scenario:</b> two claims for ticket_id = 42 (assignee NULL, version 0) arrive at the same millisecond.
<b>Step 1 —</b> Agent Bao reads ticket 42: assignee=NULL, version=0.
<b>Step 2 —</b> Agent Chi reads ticket 42: assignee=NULL, version=0  ← same stale view.
<b>Step 3 —</b> Bao's UPDATE ... SET assignee=Bao, version=1 WHERE id=42 AND version=0 → <b>1 row</b>. Commit.
<b>Step 4 —</b> Chi's UPDATE ... SET assignee=Chi, version=1 WHERE id=42 AND version=0 → <b>0 rows</b> (version is now 1).
<b>Result:</b> Chi's update touched nothing → Hibernate throws OptimisticLockException → we return <b>409 Conflict</b>. The version column, not an <code>if</code>-statement, guarantees exactly one assignee.</div>

<div class="pitfall"><strong>Trap:</strong> relying only on a Java check like <code>if (ticket.getAssignee() == null)</code>. Between your read and your write, another request can read the same NULL — the classic <em>race condition</em>. The Java check is a fast path for the common case; the version column (or a <code>WHERE assignee_id IS NULL</code> UPDATE) is the guarantee. You need both. Section 4 shows the full defence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A DB-level CHECK backs up your enum.</b> The <code>CHECK (status IN (...))</code> above means even a rogue script running raw SQL cannot write <code>status='done'</code>. Your Java enum protects the app path; the CHECK protects the database from everything else. Belt <em>and</em> braces on the two writers that matter. <em>Why beyond syllabus: defending an invariant at the lowest layer (the DB) rather than trusting every caller is a habit the syllabus rarely enforces.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604#module-411" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Data modification &amp; transactions on Code Lab</span><span class="lc-sub">INSERT/UPDATE, conditional updates and transactions — the SQL behind the core.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="note-ct">In Spring Data JPA (Section 2) you won't write this DDL by hand — you annotate entities and Hibernate generates it. But knowing the SQL underneath is what lets you debug when generation surprises you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Schema, enum trạng thái &amp; cột version</h2>
<p class="lead">Đây là toàn bộ CSDL. Chú ý hai thứ — cột <code>version</code> trên <code>tickets</code> và tập giá trị <code>status</code> cố định. Hai cái đó là <strong>hàng rào cuối cùng</strong>: cột version cho một UPDATE có canh từ chối agent thứ hai, và tập status đóng khiến một chuyển trạng thái bất hợp lệ phát hiện được thay vì "chỉ là một chuỗi khác".</p>

<h3>DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- hash bcrypt</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- USER | AGENT</span>
);

<span class="tok-keyword">CREATE TABLE</span> tickets (
  id           <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  subject      <span class="tok-type">VARCHAR</span>(200) <span class="tok-keyword">NOT NULL</span>,
  description  <span class="tok-type">TEXT</span> <span class="tok-keyword">NOT NULL</span>,
  priority     <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'MEDIUM'</span>
                 <span class="tok-keyword">CHECK</span> (priority <span class="tok-keyword">IN</span> (<span class="tok-string">'LOW'</span>,<span class="tok-string">'MEDIUM'</span>,<span class="tok-string">'HIGH'</span>,<span class="tok-string">'URGENT'</span>)),
  status       <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'OPEN'</span>
                 <span class="tok-keyword">CHECK</span> (status <span class="tok-keyword">IN</span> (<span class="tok-string">'OPEN'</span>,<span class="tok-string">'ASSIGNED'</span>,<span class="tok-string">'IN_PROGRESS'</span>,<span class="tok-string">'RESOLVED'</span>,<span class="tok-string">'CLOSED'</span>)),
  requester_id <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  assignee_id  <span class="tok-type">BIGINT</span> <span class="tok-keyword">REFERENCES</span> users(id),      <span class="tok-comment">-- NULL tới khi một agent nhận</span>
  due_at       <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL</span>,                 <span class="tok-comment">-- SLA due-by, từ priority</span>
  created_at   <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  updated_at   <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  version      <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-number">0</span>          <span class="tok-comment">-- ★ khoá lạc quan (Mục 4)</span>
);

<span class="tok-keyword">CREATE TABLE</span> comments (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  ticket_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> tickets(id),
  author_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  body        <span class="tok-type">TEXT</span> <span class="tok-keyword">NOT NULL</span>,
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now()
);

<span class="tok-keyword">CREATE INDEX</span> idx_ticket_status   <span class="tok-keyword">ON</span> tickets(status);      <span class="tok-comment">-- truy vấn hàng đợi nhanh</span>
<span class="tok-keyword">CREATE INDEX</span> idx_ticket_assignee <span class="tok-keyword">ON</span> tickets(assignee_id);</pre>

<h3>Ví dụ có lời giải — vì sao cột version mới là người gác thật</h3>
<div class="out"><b>Tình huống:</b> hai lượt nhận cho ticket_id = 42 (assignee NULL, version 0) tới cùng một mili-giây.
<b>Bước 1 —</b> Agent Bảo đọc ticket 42: assignee=NULL, version=0.
<b>Bước 2 —</b> Agent Chi đọc ticket 42: assignee=NULL, version=0  ← cùng một view cũ.
<b>Bước 3 —</b> UPDATE của Bảo ... SET assignee=Bảo, version=1 WHERE id=42 AND version=0 → <b>1 dòng</b>. Commit.
<b>Bước 4 —</b> UPDATE của Chi ... SET assignee=Chi, version=1 WHERE id=42 AND version=0 → <b>0 dòng</b> (version giờ là 1).
<b>Kết quả:</b> update của Chi không đụng gì → Hibernate ném OptimisticLockException → ta trả <b>409 Conflict</b>. Cột version, không phải câu <code>if</code>, mới bảo đảm đúng một assignee.</div>

<div class="pitfall"><strong>Bẫy:</strong> chỉ dựa vào một kiểm tra Java kiểu <code>if (ticket.getAssignee() == null)</code>. Giữa lúc bạn đọc và lúc bạn ghi, một request khác có thể đọc cùng NULL đó — đây là <em>race condition</em> kinh điển. Kiểm tra Java là đường nhanh cho trường hợp thường; cột version (hoặc UPDATE có <code>WHERE assignee_id IS NULL</code>) là sự bảo đảm. Cần cả hai. Mục 4 chỉ cách phòng thủ đầy đủ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một CHECK ở mức DB chống lưng cho enum của bạn.</b> Câu <code>CHECK (status IN (...))</code> ở trên nghĩa là kể cả một script chạy SQL thô cũng không thể ghi <code>status='done'</code>. Enum Java bảo vệ đường đi của app; CHECK bảo vệ CSDL trước mọi thứ còn lại. Chắc ăn cả hai lớp writer quan trọng. <em>Vì sao ngoài syllabus: bảo vệ một bất biến ở lớp thấp nhất (CSDL) thay vì tin mọi caller là thói quen giáo trình ít ép.</em></div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fhelpdesk-ticketing-api%2Flearn&reflabel=INT604#module-411" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Sửa đổi dữ liệu &amp; transaction trên Code Lab</span><span class="lc-sub">INSERT/UPDATE, update có điều kiện và transaction — SQL đằng sau phần lõi.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="note-ct">Trong Spring Data JPA (Mục 2) bạn không viết DDL này bằng tay — bạn annotate entity và Hibernate sinh ra nó. Nhưng biết SQL bên dưới mới giúp bạn debug khi việc sinh ra gây bất ngờ.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int604-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, cardinality, cột version và enum trạng thái.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which column makes a second agent lose the race for a ticket, and where does the guarantee live?|||Cột nào khiến agent thứ hai thua cuộc đua giành ticket, và sự bảo đảm nằm ở đâu?',
                options: [
                  'priority; guaranteed by a Java if-check|||priority; bảo đảm bằng câu if trong Java',
                  'version; guaranteed by a guarded UPDATE in the database|||version; bảo đảm bằng một UPDATE có canh trong CSDL',
                  'subject; guaranteed by JWT|||subject; bảo đảm bằng JWT',
                  'created_at; guaranteed by the client|||created_at; bảo đảm bằng client',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The relationship "a user opens many tickets" is which cardinality?|||Quan hệ "một user mở nhiều ticket" là lực lượng nào?',
                options: ['1—1', '1—* (one-to-many)|||1—* (một-nhiều)', '*—* (many-to-many)|||*—* (nhiều-nhiều)', '0—0'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why constrain status to a fixed enum / CHECK instead of free text?|||Vì sao ràng buộc status vào một enum / CHECK cố định thay vì text tự do?',
                options: [
                  'It is faster to type|||Gõ nhanh hơn',
                  'So the state machine has a closed, known set of states and queries stay reliable|||Để máy trạng thái có tập trạng thái đóng, đã biết và truy vấn vẫn đáng tin',
                  'JPA requires it|||JPA bắt buộc',
                  'To avoid using an index|||Để tránh dùng index',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Two agents read ticket 42 (assignee NULL, version 0), then both UPDATE ... WHERE version=0. What happens?|||Hai agent đọc ticket 42 (assignee NULL, version 0), rồi cả hai UPDATE ... WHERE version=0. Điều gì xảy ra?',
                options: [
                  'Both updates succeed|||Cả hai update thành công',
                  'Both updates fail|||Cả hai update thất bại',
                  'Exactly one matches 1 row; the other matches 0 rows and is rejected|||Đúng một cái trúng 1 dòng; cái kia trúng 0 dòng và bị từ chối',
                  'The database crashes|||CSDL sập',
                ], correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) A DB-level CHECK (status IN (...)) protects you because…|||(Ngoài giáo trình) Một CHECK (status IN (...)) ở mức DB bảo vệ bạn vì…',
                options: [
                  'It makes the app faster|||Nó làm app nhanh hơn',
                  'Even a rogue script running raw SQL cannot write an invalid status|||Kể cả một script chạy SQL thô cũng không thể ghi một status không hợp lệ',
                  'It replaces JWT|||Nó thay thế JWT',
                  'It stores passwords|||Nó lưu mật khẩu',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    // __MORE_SECTIONS__
  ],
};
