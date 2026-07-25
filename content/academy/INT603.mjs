/**
 * INT603 — Homestay Booking API (Kỳ 6 — Thực tập, project #3).
 * REST-API-only: Node.js + Express + Prisma + PostgreSQL, zod + JWT (jsonwebtoken) + bcrypt.
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản demo API)
 * → domain/DB design (Prisma schema + EXCLUSION constraint) → Express layers → auth/JWT & roles
 * → booking core (chống đặt trùng khoảng ngày: overlap + serializable + exclusion) → testing
 * → deployment (Docker Compose api + db) → nâng cao (★ ngoài giáo trình).
 * Song ngữ EN/VN đối xứng. Code Node/Prisma/SQL <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Deep-link CodeLab rest-apis/prisma-orm/postgresql/authentication/typescript; Docker/CI → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT603.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (template literal/shell/compose) = \${ ; quiz apostrophe = tránh hoặc \'.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT603',
    title: 'Homestay Booking API',
    slug: 'homestay-booking-api',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #3 — build a real homestay booking REST API end-to-end: Node.js + Express + Prisma + PostgreSQL, with JWT auth, guest and host roles, and a booking core that makes two overlapping date bookings impossible. Ship it with Docker.|||Đồ án thực tập #3 — xây một REST API đặt homestay hoàn chỉnh: Node.js + Express + Prisma + PostgreSQL, có JWT auth, vai trò khách và chủ nhà, và lõi đặt phòng khiến hai lượt đặt trùng ngày là bất khả. Triển khai bằng Docker.',
    description: 'INT603 là đồ án thực tập thứ ba của Kỳ 6: bạn xây một REST API ĐẶT HOMESTAY (Homestay Booking API) hoàn chỉnh — chỉ backend, không có frontend. API viết bằng Node.js + Express, dữ liệu lưu trong PostgreSQL qua Prisma ORM. Hệ thống có hai vai trò (Khách và Chủ nhà), xác thực bằng JWT và phân quyền theo role. Trọng tâm kỹ thuật là LÕI GIAO DỊCH: một phòng KHÔNG BAO GIỜ được có hai lượt đặt trùng khoảng ngày — bạn sẽ học cách phát hiện chồng lấn khoảng ngày (một booking [checkIn, checkOut) xung đột nếu start < end-của-cái-kia VÀ end > start-của-cái-kia), thực thi trong một transaction SERIALIZABLE và một ràng buộc EXCLUSION của PostgreSQL (btree_gist + daterange + &&) làm chốt chặn cuối. Bạn thiết kế API sạch (status code, error shape, validate bằng zod), kiểm thử bằng REST client (Postman) và một test đồng thời chứng minh chỉ một lượt thắng, rồi đóng gói bằng Docker Compose. Đây là khuôn "xương sống" của mọi API đặt chỗ (đặt phòng, đặt vé, đặt sân): mọi biến thể đều xoay quanh một tài nguyên không được đặt trùng.',
    whatYouLearn: 'Thiết kế domain & ERD cho nghiệp vụ đặt phòng (User/Room/Booking) và mô hình Prisma; dựng REST API Express theo kiến trúc phân lớp routes→controllers→services→prisma; Prisma Client + PostgreSQL, migration, quan hệ và relation-filter; validate request bằng zod và một error-shape middleware chung; xác thực JWT (jsonwebtoken) + băm mật khẩu bằng bcrypt + phân quyền theo role (Khách vs Chủ nhà) và kiểm quyền sở hữu; LÕI ĐẶT PHÒNG an toàn khi tranh chấp — phát hiện chồng lấn khoảng ngày, transaction SERIALIZABLE, và ràng buộc EXCLUSION (btree_gist, daterange, &&) làm hàng rào cuối; kiểm thử unit + integration (supertest) và một test đồng thời bắn hai booking chồng ngày cùng lúc để chứng minh chống đặt trùng; đóng gói Docker Compose (api + db) + biến môi trường + migrate lúc khởi động; và tài liệu API kiểu OpenAPI.',
    requirements: 'Nên đã học PRF192/PRO192 (lập trình cơ bản), DBI202 (CSDL/SQL) và có nền JavaScript/TypeScript. Cần: Node.js LTS (20.x+), một IDE (VS Code khuyên dùng), Docker Desktop (để chạy PostgreSQL), Prisma CLI (npx prisma), một client test API (Postman hoặc extension REST Client trong VS Code) và một tài khoản GitHub cho nhóm.',
    documentsNote: 'Tham chiếu: Express Guide (expressjs.com) • Prisma Docs (prisma.io/docs) • PostgreSQL Documentation — Range Types & Exclusion Constraints • zod docs • jwt.io • node-postgres. Công cụ: VS Code + REST Client, Postman, DBeaver/pgAdmin, Docker Desktop, draw.io (ERD). Luyện code: track Code Lab REST APIs + Prisma ORM + PostgreSQL + Authentication + TypeScript. Docker & CI: Exp Hub. Đây là project-course thực tập REST-API-only — vừa xây vừa quay video demo API theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc REST API, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo API.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int603-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một REST API đặt homestay thật, kiến trúc client–server, và bản đồ vòng đời từ Prisma schema tới Docker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — Homestay Booking API</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, deployable service: a <strong>homestay booking REST API</strong> where a guest searches rooms, books a range of nights, and the system <strong>refuses to create two overlapping bookings for the same room</strong> even under two simultaneous requests. There is <strong>no frontend</strong> — the deliverable is a clean, documented, race-safe API, tested with a REST client and shipped in Docker.</p>
<p>Every booking system in your career is a variation of this skeleton: an authenticated <strong>REST API</strong> over a relational database, and one <strong>transactional core</strong> that must stay correct under concurrency. Here the core is <em>date-range overlap</em> — the same shape as seat, court, and appointment booking. Master this one and the rest are re-skins.</p>

<h3>The system in one picture — client / server / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Any REST client</div><div class="lz-d">Postman · curl · your future app</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Express REST API</div><div class="lz-d">routes→controllers→services→Prisma · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">User · Room · Booking · EXCLUDE no-overlap</div></div>
</div>
<div class="diagram">Client  ──HTTP/JSON──▶  Express API  ──Prisma/SQL──▶  PostgreSQL
 Postman           (port 3000)                    (port 5432)
 curl        Authorization: Bearer &lt;JWT&gt;    EXCLUDE (room_id =, range &&)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design</div><div class="lz-nsub">Roles &amp; use cases · ERD · Prisma schema · the EXCLUSION constraint that blocks overlaps</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Express project &amp; the layers</div><div class="lz-nsub">routes · controllers · services · Prisma Client · zod validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">register/login · bcrypt · Guest vs Host · ownership checks</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The booking core</div><div class="lz-nsub">date-range overlap · serializable transaction · exclusion constraint · 409</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">Jest · supertest · a concurrency test that proves no overlapping booking</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose: api + db · env config · migrate on start · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Advisory locks · availability calendar · OpenAPI docs · CI</div><div class="lz-nsub">Ship like a real engineering team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — register → login → create a room → book a date range → it appears in "my bookings" — then grow it. A tiny end-to-end flow that runs beats a huge design that never boots.</div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Warm up REST fundamentals on Code Lab</span><span class="lc-sub">HTTP verbs, resources and status codes before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — Homestay Booking API</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một dịch vụ thật, triển khai được: một <strong>REST API đặt homestay</strong>, nơi khách tìm phòng, đặt một khoảng đêm, và hệ thống <strong>từ chối tạo hai lượt đặt chồng lấn cho cùng một phòng</strong> kể cả khi hai request đến cùng lúc. <strong>Không có frontend</strong> — sản phẩm là một API sạch, có tài liệu, an toàn khi tranh chấp, test bằng REST client và đóng gói Docker.</p>
<p>Mọi hệ thống đặt chỗ trong sự nghiệp của bạn đều là biến thể của bộ khung này: một <strong>REST API</strong> có xác thực trên CSDL quan hệ, và một <strong>lõi giao dịch</strong> phải luôn đúng khi tranh chấp. Ở đây lõi là <em>chồng lấn khoảng ngày</em> — cùng hình dạng với đặt ghế, đặt sân, đặt lịch khám. Làm chủ cái này thì phần còn lại chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — client / server / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">REST client bất kỳ</div><div class="lz-d">Postman · curl · app tương lai</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Express REST API</div><div class="lz-d">routes→controllers→services→Prisma · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">User · Room · Booking · EXCLUDE chống trùng</div></div>
</div>
<div class="diagram">Client  ──HTTP/JSON──▶  Express API  ──Prisma/SQL──▶  PostgreSQL
 Postman           (cổng 3000)                    (cổng 5432)
 curl        Authorization: Bearer &lt;JWT&gt;    EXCLUDE (room_id =, range &&)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL</div><div class="lz-nsub">Vai trò &amp; use case · ERD · Prisma schema · ràng buộc EXCLUSION chống chồng lấn</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Dự án Express &amp; các lớp</div><div class="lz-nsub">routes · controllers · services · Prisma Client · validate zod</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (JWT)</div><div class="lz-nsub">đăng ký/đăng nhập · bcrypt · Khách vs Chủ nhà · kiểm quyền sở hữu</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lõi đặt phòng</div><div class="lz-nsub">chồng lấn khoảng ngày · transaction serializable · ràng buộc exclusion · 409</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">Jest · supertest · một test đồng thời chứng minh không đặt trùng</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose: api + db · cấu hình env · migrate lúc chạy · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Advisory lock · lịch trống · tài liệu OpenAPI · CI</div><div class="lz-nsub">Ship như một đội kỹ sư thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — đăng ký → đăng nhập → tạo phòng → đặt một khoảng ngày → nó hiện trong "đặt phòng của tôi" — rồi mới mở rộng. Một luồng nhỏ chạy được từ đầu đến cuối hơn hẳn một bản thiết kế đồ sộ không bao giờ khởi động.</div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Khởi động nền tảng REST trên Code Lab</span><span class="lc-sub">Động từ HTTP, tài nguyên và status code trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int603-pham-vi',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Đúng phạm vi để làm xong: 2 vai trò, luồng lõi, và bảng tiêu chí nghiệm thu bạn tự chấm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Scope, roles &amp; acceptance criteria</h2>
<p class="lead">The fastest way to fail an internship project is to build too much and finish nothing. Lock the scope now: <strong>two roles, one transactional core, a handful of endpoints</strong>. Everything else is optional polish.</p>

<h3>Two roles — that is enough for real access control</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GUEST</span><span class="v">Register/login · search available rooms by date range · book a range of nights · view / cancel own bookings</span></div>
  <div class="kv"><span class="k">HOST</span><span class="v">Login · create / manage own rooms · see a room occupancy · confirm or reject bookings on own rooms</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">GUEST picks room + [checkIn, checkOut) ──▶ POST /bookings ──▶ 201 PENDING
        │                                                        │
        │ second guest picks OVERLAPPING dates ──▶ 409 Conflict ─┘  (blocked)
        ▼
HOST confirms ──▶ booking status: PENDING ──▶ CONFIRMED</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A guest can register, log in, and receive a JWT</td><td>POST /auth/register then /auth/login returns a token</td></tr>
<tr><td>2</td><td>A guest sees only rooms free for the chosen dates</td><td>GET /rooms?checkIn=..&amp;checkOut=.. excludes overlapped rooms</td></tr>
<tr><td>3</td><td>Booking a free range creates a PENDING booking</td><td>POST /bookings → 201 with the new booking</td></tr>
<tr><td>4</td><td><b>Overlapping bookings are impossible</b></td><td>two concurrent POSTs for overlapping dates → exactly one 201, one 409</td></tr>
<tr><td>5</td><td>Only a HOST can confirm/reject, and only on own rooms</td><td>guest calling confirm → 403; host confirming another host room → 403</td></tr>
<tr><td>6</td><td>A guest can cancel only their own booking</td><td>cancelling another guest booking → 403</td></tr>
<tr><td>7</td><td>The whole API runs from one <code>docker compose up</code></td><td>api on :3000, db healthy, migrations applied</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> Real online payments, maps and geosearch, photo uploads to cloud storage, reviews, an AI "smart pricing" engine as a core feature. Simulate payment with a status flag. Depth on the overlap-safe booking core scores; breadth with nothing finished does not.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 5). "Definition of Done = the tests are green" removes every argument about whether a feature works. <em>Why beyond syllabus: turning a checklist into executable specs is exactly how professional teams gate a release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một lõi giao dịch, vài endpoint</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">KHÁCH (GUEST)</span><span class="v">Đăng ký/đăng nhập · tìm phòng trống theo khoảng ngày · đặt một khoảng đêm · xem / huỷ lượt đặt của mình</span></div>
  <div class="kv"><span class="k">CHỦ NHÀ (HOST)</span><span class="v">Đăng nhập · tạo / quản lý phòng của mình · xem lịch kín của phòng · xác nhận hoặc từ chối lượt đặt trên phòng của mình</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">KHÁCH chọn phòng + [checkIn, checkOut) ──▶ POST /bookings ──▶ 201 PENDING
        │                                                        │
        │ khách thứ 2 chọn khoảng ngày CHỒNG LẤN ──▶ 409 Conflict ┘  (bị chặn)
        ▼
CHỦ NHÀ xác nhận ──▶ trạng thái: PENDING ──▶ CONFIRMED</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Khách đăng ký, đăng nhập, nhận JWT</td><td>POST /auth/register rồi /auth/login trả token</td></tr>
<tr><td>2</td><td>Khách chỉ thấy phòng trống trong khoảng ngày đã chọn</td><td>GET /rooms?checkIn=..&amp;checkOut=.. loại phòng bị chồng lấn</td></tr>
<tr><td>3</td><td>Đặt một khoảng trống tạo lượt đặt PENDING</td><td>POST /bookings → 201 kèm booking mới</td></tr>
<tr><td>4</td><td><b>Không thể đặt chồng lấn</b></td><td>hai POST đồng thời cho khoảng ngày chồng nhau → đúng một 201, một 409</td></tr>
<tr><td>5</td><td>Chỉ CHỦ NHÀ được xác nhận/từ chối, và chỉ trên phòng của mình</td><td>khách gọi xác nhận → 403; chủ nhà xác nhận phòng của người khác → 403</td></tr>
<tr><td>6</td><td>Khách chỉ huỷ được lượt đặt của chính mình</td><td>huỷ lượt đặt của khách khác → 403</td></tr>
<tr><td>7</td><td>Cả API chạy từ một lệnh <code>docker compose up</code></td><td>api ở :3000, db healthy, migration đã áp</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Thanh toán online thật, bản đồ và tìm theo vị trí, upload ảnh lên cloud, đánh giá, "AI định giá thông minh" làm tính năng lõi. Hãy giả lập thanh toán bằng một cờ trạng thái. Sâu ở lõi đặt phòng chống chồng lấn mới ăn điểm; ôm rộng mà chẳng xong thì không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 5). "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc một tính năng có chạy hay không. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int603-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Node.js + Express + Prisma + PostgreSQL — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Every choice below is picked because it is the <strong>mainstream Node.js API stack</strong> — the exact combination a JavaScript/TypeScript internship team ships, and the one that makes the overlap guarantee straightforward.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Runtime — Node.js LTS</b><br/>The JavaScript server runtime. Non-blocking I/O suits a request-heavy API. <em>Why: the most-hired backend runtime after Java; one language for the whole team if the client is also JS.</em></div>
  <div class="lz-layer"><b>Web framework — Express</b><br/>A tiny, unopinionated HTTP framework: routers, middleware, JSON parsing. <em>Why: the de-facto Node web framework; the layered routes→controllers→services pattern maps onto it cleanly.</em></div>
  <div class="lz-layer"><b>ORM — Prisma</b><br/>Type-safe database client generated from a schema; migrations included. <em>Why: strong TypeScript types, readable queries, and a migration workflow — far less foot-gun than raw SQL string building.</em></div>
  <div class="lz-layer"><b>Database — PostgreSQL 16</b><br/>A real, free, ACID relational database. <em>Why: it has <code>EXCLUDE</code> constraints and range types — the single feature that makes overlapping bookings impossible at the storage layer.</em></div>
  <div class="lz-layer"><b>Validation — zod · Auth — jsonwebtoken + bcrypt</b><br/>zod parses and type-narrows request bodies; JWT carries the session; bcrypt hashes passwords. <em>Why: the standard, well-audited building blocks for a Node API boundary.</em></div>
  <div class="lz-layer"><b>Ship — Docker Compose</b><br/>Two containers (api, db) started by one command. <em>Why: "runs on my machine" becomes "runs anywhere"; graders love a one-command demo.</em></div>
</div>

<h3>The request journey — how a call becomes a row</h3>
<div class="diagram">POST /api/bookings  (JWT in header, JSON body)
   →  express.json() parses the body
   →  auth middleware verifies the JWT → req.user
   →  bookingController.book(req, res)  → zod parses the body
   →  bookingService.create()   prisma.$transaction (Serializable)
   →  overlap check + prisma.booking.create()
   →  PostgreSQL commits (or 409 if the EXCLUDE fires)
   →  201 Created  ·  { id, roomId, checkIn, checkOut, status }</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A stack is a set of trade-offs, not a fashion.</b> You could swap Express for Fastify or NestJS, Prisma for Drizzle or raw <code>pg</code>, and the architecture would be identical — the same layers, the same EXCLUDE constraint. Reviewers respect a student who can say "I chose X over Y because…". <em>Why beyond syllabus: the syllabus teaches one stack; real engineering is choosing among many for reasons.</em></div>

<a class="link-card codelab" href="/code-lab/typescript?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-272" target="_blank" rel="noopener">
  <span class="lc-ico">🟦</span>
  <span class="lc-body"><span class="lc-title">Brush up TypeScript interfaces on Code Lab</span><span class="lc-sub">Object types and interfaces — how Prisma and zod give your API real types.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì đó là <strong>bộ API Node.js chủ đạo</strong> — đúng combo mà một đội thực tập JavaScript/TypeScript ship, và là bộ khiến bảo đảm chống chồng lấn trở nên đơn giản.</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Runtime — Node.js LTS</b><br/>Runtime JavaScript phía server. I/O không chặn hợp với một API nhiều request. <em>Vì sao: runtime backend được tuyển nhiều thứ nhì sau Java; một ngôn ngữ cho cả đội nếu client cũng là JS.</em></div>
  <div class="lz-layer"><b>Web framework — Express</b><br/>Một framework HTTP nhỏ, không áp đặt: router, middleware, parse JSON. <em>Vì sao: framework web Node mặc định của ngành; mẫu phân lớp routes→controllers→services khớp gọn lên nó.</em></div>
  <div class="lz-layer"><b>ORM — Prisma</b><br/>Client CSDL an toàn kiểu, sinh từ một schema; kèm migration. <em>Vì sao: type TypeScript mạnh, truy vấn dễ đọc, và quy trình migration — ít "tự bắn vào chân" hơn nhiều so với ghép chuỗi SQL thô.</em></div>
  <div class="lz-layer"><b>CSDL — PostgreSQL 16</b><br/>Một CSDL quan hệ thật, miễn phí, ACID. <em>Vì sao: nó có ràng buộc <code>EXCLUDE</code> và kiểu range — chính tính năng khiến việc đặt chồng lấn không thể xảy ra ngay ở tầng lưu trữ.</em></div>
  <div class="lz-layer"><b>Validate — zod · Auth — jsonwebtoken + bcrypt</b><br/>zod parse và thu hẹp kiểu body; JWT mang session; bcrypt băm mật khẩu. <em>Vì sao: các khối xây chuẩn, đã kiểm nghiệm kỹ cho biên của một API Node.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker Compose</b><br/>Hai container (api, db) khởi động bằng một lệnh. <em>Vì sao: "chạy trên máy tôi" thành "chạy ở mọi nơi"; giám khảo thích demo một lệnh.</em></div>
</div>

<h3>Hành trình một request — một cú gọi thành một dòng dữ liệu</h3>
<div class="diagram">POST /api/bookings  (JWT trong header, body JSON)
   →  express.json() parse body
   →  middleware auth kiểm JWT → req.user
   →  bookingController.book(req, res)  → zod parse body
   →  bookingService.create()   prisma.$transaction (Serializable)
   →  kiểm chồng lấn + prisma.booking.create()
   →  PostgreSQL commit (hoặc 409 nếu EXCLUDE kích hoạt)
   →  201 Created  ·  { id, roomId, checkIn, checkOut, status }</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một stack là tập hợp các đánh đổi, không phải mốt thời trang.</b> Bạn có thể thay Express bằng Fastify hay NestJS, Prisma bằng Drizzle hay <code>pg</code> thô, và kiến trúc vẫn y hệt — cùng các lớp, cùng ràng buộc EXCLUDE. Hội đồng nể một sinh viên biết nói "tôi chọn X thay vì Y vì…". <em>Vì sao ngoài syllabus: giáo trình dạy một stack; kỹ nghệ thật là chọn giữa nhiều lựa chọn có lý do.</em></div>

<a class="link-card codelab" href="/code-lab/typescript?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-272" target="_blank" rel="noopener">
  <span class="lc-ico">🟦</span>
  <span class="lc-body"><span class="lc-title">Ôn interface TypeScript trên Code Lab</span><span class="lc-sub">Object type và interface — cách Prisma và zod cho API của bạn kiểu thật.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int603-cai-dat',
          type: 'VIDEO',
          description: 'Node.js, VS Code, Docker, Prisma CLI, Postman — cài một lần, dùng cả đồ án. Hướng dẫn chi tiết ở Exp Hub.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your environment</h2>
<p class="lead">Install everything once, before you write a line of code. Verify each tool from the terminal so you never lose an afternoon to a missing runtime.</p>

<h3>The checklist</h3>
<table>
<thead><tr><th>Tool</th><th>Why</th><th>Verify command</th></tr></thead>
<tbody>
<tr><td>Node.js LTS + npm</td><td>run the Express API</td><td><code>node -v</code> → 20.x+</td></tr>
<tr><td>VS Code</td><td>the editor (+ REST Client, Prisma extensions)</td><td>opens the project folder</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + one-command ship</td><td><code>docker --version</code></td></tr>
<tr><td>Prisma CLI</td><td>schema, migrations, client</td><td><code>npx prisma -v</code></td></tr>
<tr><td>Postman / REST Client</td><td>test the API without a UI</td><td>send a GET</td></tr>
<tr><td>Git + a GitHub repo</td><td>team workflow</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Fastest Postgres:</strong> don't install it — run it in Docker. <code>docker run --name homestay-db -e POSTGRES_PASSWORD=homestay -e POSTGRES_DB=homestay -p 5432:5432 -d postgres:16</code>. One command, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int603-cai-dat-moi-truong?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">Node.js, VS Code, Docker Desktop, Prisma CLI, Postman — official links and a verify checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> an old Node version. Prisma and modern Express expect Node 18+ (use the LTS, 20.x). If <code>node -v</code> shows 16 or lower, install the current LTS (nvm makes switching easy) — otherwise <code>npm install</code> fails on engine checks or Prisma refuses to generate.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt môi trường</h2>
<p class="lead">Cài hết một lần, trước khi viết một dòng code. Kiểm từng công cụ từ terminal để không mất cả buổi chiều vì thiếu runtime.</p>

<h3>Danh sách cần cài</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Lệnh kiểm</th></tr></thead>
<tbody>
<tr><td>Node.js LTS + npm</td><td>chạy Express API</td><td><code>node -v</code> → 20.x+</td></tr>
<tr><td>VS Code</td><td>editor (+ extension REST Client, Prisma)</td><td>mở được thư mục dự án</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + ship một lệnh</td><td><code>docker --version</code></td></tr>
<tr><td>Prisma CLI</td><td>schema, migration, client</td><td><code>npx prisma -v</code></td></tr>
<tr><td>Postman / REST Client</td><td>test API không cần UI</td><td>gửi một GET</td></tr>
<tr><td>Git + một repo GitHub</td><td>quy trình nhóm</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Postgres nhanh nhất:</strong> đừng cài — chạy trong Docker. <code>docker run --name homestay-db -e POSTGRES_PASSWORD=homestay -e POSTGRES_DB=homestay -p 5432:5432 -d postgres:16</code>. Một lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int603-cai-dat-moi-truong?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">Node.js, VS Code, Docker Desktop, Prisma CLI, Postman — link chính chủ và checklist kiểm trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> Node phiên bản cũ. Prisma và Express hiện đại cần Node 18+ (dùng LTS, 20.x). Nếu <code>node -v</code> hiện 16 hoặc thấp hơn, cài bản LTS hiện tại (nvm giúp đổi dễ) — nếu không <code>npm install</code> sẽ lỗi kiểm engine hoặc Prisma từ chối generate.</div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int603-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo API chuyên nghiệp qua REST client: mở đầu, luồng lõi, "khoảnh khắc chống chồng lấn", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. Because there is no UI, your "screen" is a <strong>REST client</strong> (Postman or VS Code REST Client) plus the terminal. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the one thing that is hard: <strong>the overlapping booking is blocked live, on camera</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is a homestay booking API. Two roles, and it cannot create two overlapping bookings for one room. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Guest flow (2m)</div><div class="lz-nsub">Register → login (show the JWT returned) → set it as the collection token → search rooms for Aug 1–4 → POST /bookings → 201 PENDING → GET /bookings/mine shows it.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — The money shot (1.5m)</div><div class="lz-nsub">Two saved requests, same room, overlapping dates (Aug 2–5 vs Aug 1–4), fired back-to-back. One returns 201, the other a clear 409 "dates already booked". Then run the concurrency test in the terminal — green.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Host flow (1.5m)</div><div class="lz-nsub">Log in as host → GET occupancy of own room → PATCH confirm the booking → status flips to CONFIRMED. Show a guest being blocked (403) from the confirm endpoint.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Under the hood (1.5m)</div><div class="lz-nsub">One command: <code>docker compose up</code>. Show the Prisma schema, the <code>EXCLUDE</code> constraint, and the overlap condition. Explain in one sentence why overlapping is impossible.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Close (30s)</div><div class="lz-nsub">"Stack: Node.js, Express, Prisma, PostgreSQL, Docker. Repo and API docs link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (never demo on an empty DB). Save a ready Postman/REST Client collection with the token pre-set. Increase your editor font size. Do one dry run. Record in 1080p. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The demo is a product, not an afterthought.</b> Interviewers watch the first 60 seconds and the "hard part". Lead with the architecture and end with the concurrency proof — that ordering signals engineering maturity far more than a tour of every CRUD endpoint. <em>Why beyond syllabus: communication of your work is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD, a Prisma schema, and the exclusion constraint.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Vì không có UI, "màn hình" của bạn là một <strong>REST client</strong> (Postman hoặc REST Client trong VS Code) cộng terminal. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng thứ khó: <strong>việc đặt chồng lấn bị chặn ngay trên video</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là API đặt homestay. Hai vai trò, và không thể tạo hai lượt đặt chồng lấn cho một phòng. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng khách (2m)</div><div class="lz-nsub">Đăng ký → đăng nhập (chỉ JWT trả về) → đặt token cho collection → tìm phòng cho 1–4/8 → POST /bookings → 201 PENDING → GET /bookings/mine thấy nó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — Cảnh đắt giá (1.5m)</div><div class="lz-nsub">Hai request đã lưu, cùng phòng, khoảng ngày chồng lấn (2–5/8 vs 1–4/8), bắn liền nhau. Một trả 201, cái kia trả 409 rõ "khoảng ngày đã bị đặt". Rồi chạy test đồng thời trong terminal — xanh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Luồng chủ nhà (1.5m)</div><div class="lz-nsub">Đăng nhập chủ nhà → GET lịch kín của phòng mình → PATCH xác nhận lượt đặt → trạng thái đổi thành CONFIRMED. Cho thấy khách bị chặn (403) khỏi endpoint xác nhận.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Bên trong (1.5m)</div><div class="lz-nsub">Một lệnh: <code>docker compose up</code>. Chiếu Prisma schema, ràng buộc <code>EXCLUDE</code>, và điều kiện chồng lấn. Giải thích một câu vì sao không thể chồng lấn.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Kết (30s)</div><div class="lz-nsub">"Stack: Node.js, Express, Prisma, PostgreSQL, Docker. Link repo và tài liệu API trên màn hình. Cảm ơn." Chạy URL GitHub.</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed dữ liệu demo trước (đừng bao giờ demo trên DB rỗng). Lưu sẵn một collection Postman/REST Client với token đã đặt. Tăng cỡ chữ editor. Quay thử một lần. Quay 1080p. Nếu hỏng, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Demo là một sản phẩm, không phải thứ làm cho có.</b> Nhà tuyển dụng xem 60 giây đầu và "phần khó". Mở bằng kiến trúc và kết bằng bằng chứng chống tranh chấp — thứ tự đó thể hiện sự trưởng thành kỹ thuật hơn nhiều so với đi tua từng endpoint CRUD. <em>Vì sao ngoài syllabus: khả năng trình bày công việc bị chấm ngầm ở khắp sự nghiệp, nhưng hiếm khi được dạy rõ.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến hai vai trò thành ERD, một Prisma schema, và ràng buộc exclusion.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design|||Mục 1 — Thiết kế domain & CSDL',
      description: 'Biến hai vai trò thành use case, ERD, một Prisma schema chuẩn hoá — và ràng buộc EXCLUSION là trái tim chống đặt chồng lấn.',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int603-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, Room, Booking và quan hệ giữa chúng — và ý nghĩa của "chồng lấn khoảng ngày".',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"A <b>guest</b> books a <b>room</b> for a range of nights, creating a <b>booking</b>; a <b>host</b> owns the room and confirms it." The nouns give us three core entities:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (GUEST or HOST), email, password hash, name. Both roles are Users; the role decides permissions.</div>
  <div class="lz-layer"><b>Room</b> — a homestay listing owned by a host: <code>hostId</code>, title, location, <code>pricePerNight</code>, capacity. A host <em>has many</em> rooms.</div>
  <div class="lz-layer"><b>Booking</b> — the reservation itself: which <code>guest</code> booked which <code>room</code>, the half-open night range <code>[checkIn, checkOut)</code>, its <code>status</code> (PENDING / CONFIRMED / REJECTED / CANCELLED), and when it was created. This is the resource whose date ranges must never overlap on one room.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────┐1      *┌──────────┐1      *┌──────────────┐
│   User   │────────│   Room   │────────│   Booking    │
│ (HOST)   │  owns  └──────────┘  has   └──────────────┘
└──────────┘                                   *│
                                                │1
                                          ┌──────────┐
                                          │   User   │ (role = GUEST)
                                          └──────────┘

User(HOST) 1—* Room     : a host owns many rooms
Room       1—* Booking  : a room has many bookings — but no two ACTIVE may overlap  ← the rule
User(GUEST) 1—* Booking : a guest makes many bookings</div>

<h3>What "overlap" means — the half-open interval</h3>
<p>Model a stay as the half-open range <code>[checkIn, checkOut)</code>: you occupy the room the night of check-in but leave on the morning of check-out, so check-out is <em>exclusive</em>. Two ranges on the same room conflict when <b>each starts before the other ends</b>:</p>
<div class="diagram">Room 101 nights:   Aug01  02   03   04   05   06
 Booking A [01,04): │────────────│
 Booking B [03,06):            │────────────│
 Overlap test:  A.checkIn(01) &lt; B.checkOut(06)  AND  A.checkOut(04) &gt; B.checkIn(03)  ⇒ OVERLAP ✗
 Booking C [04,06):                  │────────│      A ends (04) is NOT &gt; C starts (04) ⇒ NO overlap ✓</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> Room 101 has an active booking A = [Aug 01, Aug 04). Guest Binh asks for [Aug 03, Aug 06).
<b>Step 1 —</b> Compute the overlap test: does 01 &lt; 06 AND 04 &gt; 03?  → true AND true = <b>OVERLAP</b>.
<b>Step 2 —</b> The system rejects Binh with 409.
<b>Step 3 —</b> Binh instead asks for [Aug 04, Aug 06). Test: 01 &lt; 06 AND 04 &gt; 04?  → true AND <b>false</b> = no overlap.
<b>Result:</b> [Aug 04, Aug 06) is accepted — check-out day (Aug 04) and the next check-in day (Aug 04) can be the same, because the interval is half-open.</div>

<div class="pitfall"><strong>Design trap:</strong> storing a single "booked" boolean on the Room instead of dated Booking rows. Then a room is either fully booked or fully free — you cannot express "booked Aug 1–4 but free Aug 5–8", which is the entire point of a homestay. Keep every reservation as its own dated Booking row.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Half-open intervals avoid the "shared boundary" bug.</b> If you used a closed range <code>[checkIn, checkOut]</code>, a guest checking out on Aug 4 would block a guest checking in on Aug 4 — a false conflict on turnover day. Modelling stays as <code>[checkIn, checkOut)</code> makes back-to-back bookings legal, exactly like real hotels. In 1.2 the Postgres <code>daterange(..., '[)')</code> encodes this precisely. <em>Why beyond syllabus: interval boundary semantics is a subtlety that silently corrupts availability logic when ignored.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-433" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Practice Prisma relations on Code Lab</span><span class="lc-sub">One-to-many relations and back-relations — the User/Room/Booking links.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>khách</b> đặt một <b>phòng</b> cho một khoảng đêm, tạo ra một <b>booking</b>; một <b>chủ nhà</b> sở hữu phòng và xác nhận nó." Các danh từ cho ta ba thực thể lõi:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (GUEST hoặc HOST), email, hash mật khẩu, tên. Cả hai vai trò đều là User; role quyết định quyền.</div>
  <div class="lz-layer"><b>Room</b> — một tin homestay do chủ nhà sở hữu: <code>hostId</code>, tiêu đề, vị trí, <code>pricePerNight</code>, sức chứa. Một chủ nhà <em>có nhiều</em> phòng.</div>
  <div class="lz-layer"><b>Booking</b> — chính lượt đặt: <code>guest</code> nào đặt <code>room</code> nào, khoảng đêm nửa mở <code>[checkIn, checkOut)</code>, <code>status</code> (PENDING / CONFIRMED / REJECTED / CANCELLED), và thời điểm tạo. Đây là tài nguyên mà khoảng ngày không được phép chồng lấn trên một phòng.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────┐1      *┌──────────┐1      *┌──────────────┐
│   User   │────────│   Room   │────────│   Booking    │
│ (HOST)   │ sở hữu └──────────┘   có   └──────────────┘
└──────────┘                                   *│
                                                │1
                                          ┌──────────┐
                                          │   User   │ (role = GUEST)
                                          └──────────┘

User(HOST) 1—* Room     : một chủ nhà sở hữu nhiều phòng
Room       1—* Booking  : một phòng có nhiều lượt đặt — nhưng không hai cái ĐANG HOẠT ĐỘNG được chồng lấn  ← quy tắc
User(GUEST) 1—* Booking : một khách tạo nhiều lượt đặt</div>

<h3>"Chồng lấn" nghĩa là gì — khoảng nửa mở</h3>
<p>Mô hình một kỳ lưu trú là khoảng nửa mở <code>[checkIn, checkOut)</code>: bạn ở phòng đêm nhận phòng nhưng rời vào sáng trả phòng, nên ngày trả phòng là <em>không bao gồm</em>. Hai khoảng trên cùng một phòng xung đột khi <b>mỗi cái bắt đầu trước khi cái kia kết thúc</b>:</p>
<div class="diagram">Phòng 101 các đêm:  Aug01  02   03   04   05   06
 Booking A [01,04): │────────────│
 Booking B [03,06):            │────────────│
 Kiểm chồng lấn:  A.checkIn(01) &lt; B.checkOut(06)  VÀ  A.checkOut(04) &gt; B.checkIn(03)  ⇒ CHỒNG LẤN ✗
 Booking C [04,06):                  │────────│      A kết thúc (04) KHÔNG &gt; C bắt đầu (04) ⇒ KHÔNG chồng ✓</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> Phòng 101 có lượt đặt hoạt động A = [Aug 01, Aug 04). Khách Bình hỏi [Aug 03, Aug 06).
<b>Bước 1 —</b> Tính kiểm chồng lấn: 01 &lt; 06 VÀ 04 &gt; 03?  → đúng VÀ đúng = <b>CHỒNG LẤN</b>.
<b>Bước 2 —</b> Hệ thống từ chối Bình với 409.
<b>Bước 3 —</b> Bình đổi sang hỏi [Aug 04, Aug 06). Kiểm: 01 &lt; 06 VÀ 04 &gt; 04?  → đúng VÀ <b>sai</b> = không chồng lấn.
<b>Kết quả:</b> [Aug 04, Aug 06) được chấp nhận — ngày trả phòng (Aug 04) và ngày nhận phòng kế (Aug 04) có thể trùng, vì khoảng là nửa mở.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> lưu một cờ "đã đặt" boolean trên Room thay vì các dòng Booking có ngày. Khi đó một phòng hoặc kín hoàn toàn hoặc trống hoàn toàn — bạn không diễn tả được "đã đặt 1–4/8 nhưng trống 5–8/8", vốn là toàn bộ ý nghĩa của một homestay. Hãy giữ mỗi lượt đặt là một dòng Booking có ngày riêng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khoảng nửa mở tránh bug "biên chung".</b> Nếu dùng khoảng đóng <code>[checkIn, checkOut]</code>, một khách trả phòng ngày Aug 4 sẽ chặn một khách nhận phòng ngày Aug 4 — một xung đột giả vào ngày luân phòng. Mô hình kỳ lưu trú thành <code>[checkIn, checkOut)</code> khiến đặt liền kề là hợp lệ, đúng như khách sạn thật. Ở 1.2, <code>daterange(..., '[)')</code> của Postgres mã hoá điều này chính xác. <em>Vì sao ngoài syllabus: ngữ nghĩa biên của khoảng là chi tiết tinh tế âm thầm làm hỏng logic phòng trống khi bị bỏ qua.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-433" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Luyện quan hệ Prisma trên Code Lab</span><span class="lc-sub">Quan hệ một-nhiều và back-relation — các liên kết User/Room/Booking.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The Prisma schema & the constraint that prevents overlaps|||1.2 — Prisma schema & ràng buộc chống chồng lấn',
          slug: 'int603-schema',
          type: 'VIDEO',
          description: 'Mô hình Prisma đầy đủ + ràng buộc EXCLUSION (btree_gist, daterange, &&): hàng rào cuối cùng chống đặt chồng lấn, do CSDL bảo đảm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The Prisma schema &amp; the constraint that prevents overlaps</h2>
<p class="lead">Here is the whole database, twice: once as the Prisma schema you write, and once as the SQL it becomes — including the one line that is your <strong>last line of defence</strong>. Prisma has no native syntax for an exclusion constraint, so you add it in a migration by hand. That single <code>EXCLUDE</code> is what makes overlapping bookings impossible even if two requests slip past every check in your JavaScript.</p>

<h3>The Prisma schema</h3>
<pre><span class="tok-keyword">generator</span> client {
  provider = <span class="tok-string">"prisma-client-js"</span>
}
<span class="tok-keyword">datasource</span> db {
  provider = <span class="tok-string">"postgresql"</span>
  url      = env(<span class="tok-string">"DATABASE_URL"</span>)
}

<span class="tok-keyword">enum</span> <span class="tok-type">Role</span> { GUEST HOST }
<span class="tok-keyword">enum</span> <span class="tok-type">BookingStatus</span> { PENDING CONFIRMED REJECTED CANCELLED }

<span class="tok-keyword">model</span> <span class="tok-type">User</span> {
  id        <span class="tok-type">Int</span>       <span class="tok-keyword">@id @default</span>(autoincrement())
  email     <span class="tok-type">String</span>    <span class="tok-keyword">@unique</span>
  password  <span class="tok-type">String</span>                          <span class="tok-comment">// bcrypt hash</span>
  name      <span class="tok-type">String</span>
  role      <span class="tok-type">Role</span>      <span class="tok-keyword">@default</span>(GUEST)
  rooms     <span class="tok-type">Room</span>[]    <span class="tok-keyword">@relation</span>(<span class="tok-string">"HostRooms"</span>)     <span class="tok-comment">// as host</span>
  bookings  <span class="tok-type">Booking</span>[] <span class="tok-keyword">@relation</span>(<span class="tok-string">"GuestBookings"</span>) <span class="tok-comment">// as guest</span>
  createdAt <span class="tok-type">DateTime</span>  <span class="tok-keyword">@default</span>(now())
}

<span class="tok-keyword">model</span> <span class="tok-type">Room</span> {
  id            <span class="tok-type">Int</span>       <span class="tok-keyword">@id @default</span>(autoincrement())
  host          <span class="tok-type">User</span>      <span class="tok-keyword">@relation</span>(<span class="tok-string">"HostRooms"</span>, fields: [hostId], references: [id])
  hostId        <span class="tok-type">Int</span>
  title         <span class="tok-type">String</span>
  location      <span class="tok-type">String</span>
  pricePerNight <span class="tok-type">Int</span>
  capacity      <span class="tok-type">Int</span>       <span class="tok-keyword">@default</span>(2)
  bookings      <span class="tok-type">Booking</span>[]
}

<span class="tok-keyword">model</span> <span class="tok-type">Booking</span> {
  id        <span class="tok-type">Int</span>           <span class="tok-keyword">@id @default</span>(autoincrement())
  room      <span class="tok-type">Room</span>          <span class="tok-keyword">@relation</span>(fields: [roomId], references: [id])
  roomId    <span class="tok-type">Int</span>
  guest     <span class="tok-type">User</span>          <span class="tok-keyword">@relation</span>(<span class="tok-string">"GuestBookings"</span>, fields: [guestId], references: [id])
  guestId   <span class="tok-type">Int</span>
  checkIn   <span class="tok-type">DateTime</span>      <span class="tok-keyword">@db.Date</span>
  checkOut  <span class="tok-type">DateTime</span>      <span class="tok-keyword">@db.Date</span>
  status    <span class="tok-type">BookingStatus</span> <span class="tok-keyword">@default</span>(PENDING)
  createdAt <span class="tok-type">DateTime</span>      <span class="tok-keyword">@default</span>(now())

  <span class="tok-keyword">@@index</span>([roomId, status])
}</pre>

<h3>The exclusion constraint — hand-added in the migration SQL</h3>
<p>After <code>npx prisma migrate dev</code> creates the migration, open its <code>migration.sql</code> and append these statements (Prisma keeps them on the next <code>migrate deploy</code>):</p>
<pre><span class="tok-comment">-- btree_gist lets a GiST index mix a scalar (=) with a range (&amp;&amp;)</span>
<span class="tok-keyword">CREATE EXTENSION IF NOT EXISTS</span> btree_gist;

<span class="tok-comment">-- ★ THE CROWN JEWEL: no two ACTIVE bookings of one room may overlap</span>
<span class="tok-keyword">ALTER TABLE</span> <span class="tok-string">"Booking"</span> <span class="tok-keyword">ADD CONSTRAINT</span> no_overlap
  <span class="tok-keyword">EXCLUDE USING</span> gist (
    <span class="tok-string">"roomId"</span> <span class="tok-keyword">WITH</span> =,
    daterange(<span class="tok-string">"checkIn"</span>, <span class="tok-string">"checkOut"</span>, <span class="tok-string">'[)'</span>) <span class="tok-keyword">WITH</span> &amp;&amp;
  ) <span class="tok-keyword">WHERE</span> (status <span class="tok-keyword">IN</span> (<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>));

<span class="tok-comment">-- also forbid a zero/negative stay at the DB level</span>
<span class="tok-keyword">ALTER TABLE</span> <span class="tok-string">"Booking"</span> <span class="tok-keyword">ADD CONSTRAINT</span> valid_range <span class="tok-keyword">CHECK</span> (<span class="tok-string">"checkOut"</span> &gt; <span class="tok-string">"checkIn"</span>);</pre>
<p>Read the <code>EXCLUDE</code> as: "reject any new row where <em>another</em> row has the <b>same roomId</b> AND a <b>daterange that overlaps (&amp;&amp;)</b> — but only among PENDING/CONFIRMED rows." The <code>WHERE</code> makes it a <em>partial</em> constraint so a CANCELLED range can be re-booked.</p>

<h3>Worked example — why the EXCLUDE is the real guard</h3>
<div class="out"><b>Scenario:</b> two INSERTs for roomId 101 arrive at the same millisecond — A = [01,04), B = [03,06).
<b>Step 1 —</b> Transaction A: INSERT Booking(101, [01,04)) → the GiST index reserves that (room, range) key — not yet committed.
<b>Step 2 —</b> Transaction B: INSERT Booking(101, [03,06)) → Postgres sees the pending key overlaps → <b>B waits</b>.
<b>Step 3 —</b> A commits. Its (101, [01,04)) key now exists.
<b>Step 4 —</b> B is released → its range [03,06) still overlaps [01,04) → <b>ERROR: conflicting key value violates exclusion constraint "no_overlap"</b>.
<b>Result:</b> exactly one booking exists for those nights. Your JavaScript catches this error and returns <b>409 Conflict</b>. The database, not your <code>if</code>, is what guarantees correctness.</div>

<div class="pitfall"><strong>Trap:</strong> relying only on a JavaScript overlap query like "find any booking that clashes, and if none, insert". Between your read and your write, another request can read the same "no clash" — the classic <em>race condition</em> (Section 4). The query is a fast path for the common case; the <code>EXCLUDE</code> constraint is the guarantee. You need both.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Dates vs timestamps — daterange or tsrange.</b> This project books whole nights, so <code>daterange</code> is the right, self-documenting type. If you later needed hour-precision (e.g. a co-working room booked 9:00–11:00), you would switch to <code>tsrange(checkIn, checkOut)</code> over <code>TIMESTAMP</code> columns — the exact same <code>EXCLUDE ... WITH &amp;&amp;</code> pattern, just a finer range type. <em>Why beyond syllabus: Postgres range types + GiST exclusion is a professional feature most bootcamp stacks never touch, yet it is the cleanest solution to the whole class of "no overlap" problems.</em></div>

<a class="link-card codelab" href="/code-lab/postgresql?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-859" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Tables &amp; constraints on Code Lab</span><span class="lc-sub">PRIMARY KEY, CHECK, UNIQUE and constraints — the SQL under your Prisma models.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Prisma schema &amp; ràng buộc chống chồng lấn</h2>
<p class="lead">Đây là toàn bộ CSDL, hai lần: một lần là Prisma schema bạn viết, một lần là SQL nó biến thành — gồm cả một dòng là <strong>hàng rào cuối cùng</strong>. Prisma không có cú pháp riêng cho ràng buộc exclusion, nên bạn thêm nó vào migration bằng tay. Một <code>EXCLUDE</code> đó khiến việc đặt chồng lấn không thể xảy ra kể cả khi hai request lọt qua mọi kiểm tra trong JavaScript.</p>

<h3>Prisma schema</h3>
<pre><span class="tok-keyword">generator</span> client {
  provider = <span class="tok-string">"prisma-client-js"</span>
}
<span class="tok-keyword">datasource</span> db {
  provider = <span class="tok-string">"postgresql"</span>
  url      = env(<span class="tok-string">"DATABASE_URL"</span>)
}

<span class="tok-keyword">enum</span> <span class="tok-type">Role</span> { GUEST HOST }
<span class="tok-keyword">enum</span> <span class="tok-type">BookingStatus</span> { PENDING CONFIRMED REJECTED CANCELLED }

<span class="tok-keyword">model</span> <span class="tok-type">User</span> {
  id        <span class="tok-type">Int</span>       <span class="tok-keyword">@id @default</span>(autoincrement())
  email     <span class="tok-type">String</span>    <span class="tok-keyword">@unique</span>
  password  <span class="tok-type">String</span>                          <span class="tok-comment">// hash bcrypt</span>
  name      <span class="tok-type">String</span>
  role      <span class="tok-type">Role</span>      <span class="tok-keyword">@default</span>(GUEST)
  rooms     <span class="tok-type">Room</span>[]    <span class="tok-keyword">@relation</span>(<span class="tok-string">"HostRooms"</span>)     <span class="tok-comment">// với vai trò chủ nhà</span>
  bookings  <span class="tok-type">Booking</span>[] <span class="tok-keyword">@relation</span>(<span class="tok-string">"GuestBookings"</span>) <span class="tok-comment">// với vai trò khách</span>
  createdAt <span class="tok-type">DateTime</span>  <span class="tok-keyword">@default</span>(now())
}

<span class="tok-keyword">model</span> <span class="tok-type">Room</span> {
  id            <span class="tok-type">Int</span>       <span class="tok-keyword">@id @default</span>(autoincrement())
  host          <span class="tok-type">User</span>      <span class="tok-keyword">@relation</span>(<span class="tok-string">"HostRooms"</span>, fields: [hostId], references: [id])
  hostId        <span class="tok-type">Int</span>
  title         <span class="tok-type">String</span>
  location      <span class="tok-type">String</span>
  pricePerNight <span class="tok-type">Int</span>
  capacity      <span class="tok-type">Int</span>       <span class="tok-keyword">@default</span>(2)
  bookings      <span class="tok-type">Booking</span>[]
}

<span class="tok-keyword">model</span> <span class="tok-type">Booking</span> {
  id        <span class="tok-type">Int</span>           <span class="tok-keyword">@id @default</span>(autoincrement())
  room      <span class="tok-type">Room</span>          <span class="tok-keyword">@relation</span>(fields: [roomId], references: [id])
  roomId    <span class="tok-type">Int</span>
  guest     <span class="tok-type">User</span>          <span class="tok-keyword">@relation</span>(<span class="tok-string">"GuestBookings"</span>, fields: [guestId], references: [id])
  guestId   <span class="tok-type">Int</span>
  checkIn   <span class="tok-type">DateTime</span>      <span class="tok-keyword">@db.Date</span>
  checkOut  <span class="tok-type">DateTime</span>      <span class="tok-keyword">@db.Date</span>
  status    <span class="tok-type">BookingStatus</span> <span class="tok-keyword">@default</span>(PENDING)
  createdAt <span class="tok-type">DateTime</span>      <span class="tok-keyword">@default</span>(now())

  <span class="tok-keyword">@@index</span>([roomId, status])
}</pre>

<h3>Ràng buộc exclusion — thêm tay trong SQL migration</h3>
<p>Sau khi <code>npx prisma migrate dev</code> tạo migration, mở <code>migration.sql</code> của nó và thêm các câu lệnh này (Prisma sẽ giữ chúng ở lần <code>migrate deploy</code> kế):</p>
<pre><span class="tok-comment">-- btree_gist cho phép một index GiST trộn scalar (=) với range (&amp;&amp;)</span>
<span class="tok-keyword">CREATE EXTENSION IF NOT EXISTS</span> btree_gist;

<span class="tok-comment">-- ★ VIÊN NGỌC: không hai lượt đặt ĐANG HOẠT ĐỘNG của một phòng được chồng lấn</span>
<span class="tok-keyword">ALTER TABLE</span> <span class="tok-string">"Booking"</span> <span class="tok-keyword">ADD CONSTRAINT</span> no_overlap
  <span class="tok-keyword">EXCLUDE USING</span> gist (
    <span class="tok-string">"roomId"</span> <span class="tok-keyword">WITH</span> =,
    daterange(<span class="tok-string">"checkIn"</span>, <span class="tok-string">"checkOut"</span>, <span class="tok-string">'[)'</span>) <span class="tok-keyword">WITH</span> &amp;&amp;
  ) <span class="tok-keyword">WHERE</span> (status <span class="tok-keyword">IN</span> (<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>));

<span class="tok-comment">-- đồng thời cấm một kỳ lưu trú 0/âm ngày ở tầng DB</span>
<span class="tok-keyword">ALTER TABLE</span> <span class="tok-string">"Booking"</span> <span class="tok-keyword">ADD CONSTRAINT</span> valid_range <span class="tok-keyword">CHECK</span> (<span class="tok-string">"checkOut"</span> &gt; <span class="tok-string">"checkIn"</span>);</pre>
<p>Đọc <code>EXCLUDE</code> là: "từ chối mọi dòng mới mà một dòng <em>khác</em> có <b>cùng roomId</b> VÀ một <b>daterange chồng lấn (&amp;&amp;)</b> — nhưng chỉ giữa các dòng PENDING/CONFIRMED." Mệnh đề <code>WHERE</code> khiến nó là ràng buộc <em>một phần</em> nên một khoảng CANCELLED có thể được đặt lại.</p>

<h3>Ví dụ có lời giải — vì sao EXCLUDE mới là người gác thật</h3>
<div class="out"><b>Tình huống:</b> hai INSERT cho roomId 101 tới cùng một mili-giây — A = [01,04), B = [03,06).
<b>Bước 1 —</b> Giao dịch A: INSERT Booking(101, [01,04)) → index GiST giữ khoá (room, range) đó — chưa commit.
<b>Bước 2 —</b> Giao dịch B: INSERT Booking(101, [03,06)) → Postgres thấy khoá đang chờ bị chồng lấn → <b>B đợi</b>.
<b>Bước 3 —</b> A commit. Khoá (101, [01,04)) giờ tồn tại.
<b>Bước 4 —</b> B được thả → khoảng [03,06) của nó vẫn chồng [01,04) → <b>ERROR: conflicting key value violates exclusion constraint "no_overlap"</b>.
<b>Kết quả:</b> đúng một lượt đặt tồn tại cho các đêm đó. JavaScript của bạn bắt lỗi này và trả <b>409 Conflict</b>. Chính CSDL, không phải câu <code>if</code>, mới bảo đảm tính đúng.</div>

<div class="pitfall"><strong>Bẫy:</strong> chỉ dựa vào một truy vấn chồng lấn trong JavaScript kiểu "tìm booking nào đụng, nếu không có thì insert". Giữa lúc bạn đọc và lúc bạn ghi, một request khác có thể đọc cùng "không đụng" — race condition kinh điển (Mục 4). Truy vấn là đường nhanh cho trường hợp thường; ràng buộc <code>EXCLUDE</code> là sự bảo đảm. Cần cả hai.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ngày vs mốc thời gian — daterange hay tsrange.</b> Đồ án này đặt theo đêm nguyên, nên <code>daterange</code> là kiểu đúng, tự mô tả. Nếu sau này cần độ chính xác giờ (vd một phòng co-working đặt 9:00–11:00), bạn đổi sang <code>tsrange(checkIn, checkOut)</code> trên cột <code>TIMESTAMP</code> — cùng đúng mẫu <code>EXCLUDE ... WITH &amp;&amp;</code>, chỉ là kiểu range mịn hơn. <em>Vì sao ngoài syllabus: kiểu range của Postgres + exclusion GiST là tính năng chuyên nghiệp mà phần lớn stack bootcamp không chạm tới, nhưng lại là lời giải sạch nhất cho cả lớp bài toán "không chồng lấn".</em></div>

<a class="link-card codelab" href="/code-lab/postgresql?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-859" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Bảng &amp; ràng buộc trên Code Lab</span><span class="lc-sub">PRIMARY KEY, CHECK, UNIQUE và các ràng buộc — phần SQL dưới các Prisma model.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int603-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, chồng lấn khoảng ngày và ràng buộc EXCLUSION.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Two date ranges [checkIn, checkOut) on the same room overlap exactly when…|||Hai khoảng ngày [checkIn, checkOut) trên cùng một phòng chồng lấn đúng khi…',
                options: [
                  'checkIn values are equal|||Các giá trị checkIn bằng nhau',
                  'each range starts before the other ends: A.checkIn < B.checkOut AND A.checkOut > B.checkIn|||mỗi khoảng bắt đầu trước khi cái kia kết thúc: A.checkIn < B.checkOut VÀ A.checkOut > B.checkIn',
                  'they are on different rooms|||chúng ở các phòng khác nhau',
                  'one range is fully in the past|||một khoảng hoàn toàn trong quá khứ',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Where does the absolute guarantee against overlapping bookings live?|||Sự bảo đảm tuyệt đối chống đặt chồng lấn nằm ở đâu?',
                options: [
                  'In a JavaScript if-check|||Trong một câu if JavaScript',
                  'In the PostgreSQL EXCLUDE constraint (btree_gist + daterange + &&)|||Trong ràng buộc EXCLUDE của PostgreSQL (btree_gist + daterange + &&)',
                  'In the JWT|||Trong JWT',
                  'In the REST client|||Trong REST client',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why model a stay as the half-open range [checkIn, checkOut) instead of a closed one?|||Vì sao mô hình kỳ lưu trú là khoảng nửa mở [checkIn, checkOut) thay vì khoảng đóng?',
                options: [
                  'It is faster to query|||Truy vấn nhanh hơn',
                  'So a guest checking out on a day does not falsely block a guest checking in the same day|||Để khách trả phòng một ngày không chặn nhầm khách nhận phòng cùng ngày',
                  'Prisma requires it|||Prisma bắt buộc',
                  'To avoid using an index|||Để tránh dùng index',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Why is the exclusion constraint written with WHERE status IN (PENDING, CONFIRMED)?|||Vì sao ràng buộc exclusion viết kèm WHERE status IN (PENDING, CONFIRMED)?',
                options: [
                  'To make it faster|||Để nó nhanh hơn',
                  'So a CANCELLED or REJECTED range no longer blocks the room and can be re-booked|||Để một khoảng CANCELLED hoặc REJECTED không còn chặn phòng và có thể đặt lại',
                  'To store the status column|||Để lưu cột status',
                  'Because Prisma generated it|||Vì Prisma sinh ra nó',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'Why keep each reservation as a dated Booking row rather than a boolean "booked" on Room?|||Vì sao giữ mỗi lượt đặt là một dòng Booking có ngày thay vì một boolean "đã đặt" trên Room?',
                options: [
                  'A boolean is more secure|||Boolean an toàn hơn',
                  'To express partial availability — booked some nights, free others — and keep history|||Để diễn tả phòng trống một phần — đặt vài đêm, trống các đêm khác — và giữ lịch sử',
                  'Prisma cannot store booleans|||Prisma không lưu được boolean',
                  'To avoid foreign keys|||Để tránh khoá ngoại',
                ], correctIndex: 1,
              },
              {
                id: 'q6', points: 1,
                question: '(Beyond syllabus) The btree_gist extension is needed because…|||(Ngoài giáo trình) Extension btree_gist cần thiết vì…',
                options: [
                  'it speeds up JWT signing|||nó tăng tốc ký JWT',
                  'it lets one GiST index combine a scalar equality (roomId =) with a range overlap (&&) in the same EXCLUDE|||nó cho một index GiST kết hợp so-bằng scalar (roomId =) với chồng-lấn range (&&) trong cùng một EXCLUDE',
                  'it is required by Prisma|||nó do Prisma yêu cầu',
                  'it stores passwords|||nó lưu mật khẩu',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ MỤC 2 — BACKEND: EXPRESS & CÁC LỚP ══════════════════ */
    {
      title: 'Section 2 — Backend: Express & the Layers|||Mục 2 — Backend: Express & các lớp',
      description: 'Khởi tạo dự án Express, nối Prisma Client, và xây một lát cắt dọc "tìm phòng trống" qua routes→controllers→services→prisma.',
      lessons: [
        {
          title: '2.1 — Project setup & the layered architecture|||2.1 — Khởi tạo dự án & kiến trúc phân lớp',
          slug: 'int603-backend-setup',
          type: 'VIDEO',
          description: 'npm init, cấu trúc thư mục, và bốn lớp routes / controllers / services / prisma — mỗi lớp một trách nhiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.1</span>
<h2>Project setup &amp; the layered architecture</h2>
<p class="lead">Scaffold the API with a handful of commands, then impose a shape on it. A flat "everything in one file" Express app works for a demo and collapses on the second feature. Four thin layers keep each concern in its own place.</p>

<h3>Bootstrap the project</h3>
<pre><span class="tok-comment"># create the project &amp; install the stack</span>
mkdir homestay-api &amp;&amp; cd homestay-api
npm init -y
npm install express @prisma/client jsonwebtoken bcrypt zod
npm install -D prisma nodemon
npx prisma init            <span class="tok-comment"># creates prisma/schema.prisma + .env with DATABASE_URL</span></pre>
<p>Set the connection string in <code>.env</code> (never commit it):</p>
<pre><span class="tok-comment"># .env</span>
DATABASE_URL=<span class="tok-string">"postgresql://postgres:homestay@localhost:5432/homestay?schema=public"</span>
JWT_SECRET=<span class="tok-string">"change-me-in-production-use-32-bytes-min"</span></pre>

<h3>The folder shape — one job per folder</h3>
<div class="diagram">src/
 ├─ server.js            app bootstrap: express(), mount routers, error handler
 ├─ prisma.js           a single shared PrismaClient instance
 ├─ routes/             URL → controller wiring   (auth, rooms, bookings)
 ├─ controllers/        HTTP in/out: parse, call service, send status+JSON
 ├─ services/           business rules: overlap check, transactions
 ├─ middleware/         auth (JWT), error handler
 └─ schemas/            zod request schemas</div>

<h3>The four layers — one responsibility each</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route</b> (<code>express.Router()</code>) — maps a URL + verb to a controller function, and stacks middleware (auth, role). <em>No logic.</em></div>
  <div class="lz-layer"><b>Controller</b> — HTTP only. Parses/validates the request (zod), calls a service, maps the result to a status code + JSON, forwards errors with <code>next(err)</code>. <em>No business logic.</em></div>
  <div class="lz-layer"><b>Service</b> — the business rules. "Do the dates overlap? Create the booking inside a transaction." <em>Knows nothing about HTTP.</em></div>
  <div class="lz-layer"><b>Prisma</b> — database access via the generated client. <em>Knows nothing about business rules.</em></div>
</div>

<h3>server.js — the composition root</h3>
<pre><span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> authRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/auth.routes.js'</span>;
<span class="tok-keyword">import</span> roomRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/room.routes.js'</span>;
<span class="tok-keyword">import</span> bookingRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/booking.routes.js'</span>;
<span class="tok-keyword">import</span> { errorHandler } <span class="tok-keyword">from</span> <span class="tok-string">'./middleware/error.js'</span>;

<span class="tok-keyword">const</span> app = express();
app.use(express.json());                     <span class="tok-comment">// parse JSON bodies</span>
app.use(<span class="tok-string">'/api/auth'</span>, authRoutes);
app.use(<span class="tok-string">'/api/rooms'</span>, roomRoutes);
app.use(<span class="tok-string">'/api/bookings'</span>, bookingRoutes);
app.use(errorHandler);                        <span class="tok-comment">// LAST: central error shape</span>

app.listen(<span class="tok-number">3000</span>, () =&gt; console.log(<span class="tok-string">'API on :3000'</span>));</pre>

<div class="callout ok">Why layer at all? Because you can then <strong>test a service without HTTP</strong> and <strong>swap Express for Fastify without touching business rules</strong>. Each layer depends only on the one below it.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>One PrismaClient for the whole process.</b> Create the client once in <code>prisma.js</code> and import that singleton everywhere. A new <code>new PrismaClient()</code> per request opens a fresh connection pool each time and quickly exhausts Postgres connections — a classic Node production outage. <em>Why beyond syllabus: connection-pool lifecycle is an operational detail the syllabus never raises, but it takes real apps down.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">API design on Code Lab</span><span class="lc-sub">Resource naming, verbs and layering — the shape of a clean REST API.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.1</span>
<h2>Khởi tạo dự án &amp; kiến trúc phân lớp</h2>
<p class="lead">Tạo khung API bằng vài lệnh, rồi áp một hình dạng lên nó. Một app Express "nhét hết vào một file" chạy được cho demo và sụp ở tính năng thứ hai. Bốn lớp mỏng giữ mỗi mối bận tâm ở đúng chỗ.</p>

<h3>Dựng dự án</h3>
<pre><span class="tok-comment"># tạo dự án &amp; cài stack</span>
mkdir homestay-api &amp;&amp; cd homestay-api
npm init -y
npm install express @prisma/client jsonwebtoken bcrypt zod
npm install -D prisma nodemon
npx prisma init            <span class="tok-comment"># tạo prisma/schema.prisma + .env với DATABASE_URL</span></pre>
<p>Đặt chuỗi kết nối trong <code>.env</code> (đừng bao giờ commit):</p>
<pre><span class="tok-comment"># .env</span>
DATABASE_URL=<span class="tok-string">"postgresql://postgres:homestay@localhost:5432/homestay?schema=public"</span>
JWT_SECRET=<span class="tok-string">"change-me-in-production-use-32-bytes-min"</span></pre>

<h3>Hình dạng thư mục — mỗi thư mục một việc</h3>
<div class="diagram">src/
 ├─ server.js            bootstrap app: express(), mount router, error handler
 ├─ prisma.js           một instance PrismaClient dùng chung
 ├─ routes/             URL → nối controller   (auth, rooms, bookings)
 ├─ controllers/        HTTP vào/ra: parse, gọi service, gửi status+JSON
 ├─ services/           quy tắc nghiệp vụ: kiểm chồng lấn, transaction
 ├─ middleware/         auth (JWT), error handler
 └─ schemas/            zod schema cho request</div>

<h3>Bốn lớp — mỗi lớp một trách nhiệm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route</b> (<code>express.Router()</code>) — ánh xạ URL + động từ tới một hàm controller, và xếp middleware (auth, role). <em>Không có logic.</em></div>
  <div class="lz-layer"><b>Controller</b> — chỉ HTTP. Parse/validate request (zod), gọi service, ánh xạ kết quả sang status code + JSON, chuyển lỗi bằng <code>next(err)</code>. <em>Không có business logic.</em></div>
  <div class="lz-layer"><b>Service</b> — quy tắc nghiệp vụ. "Khoảng ngày có chồng lấn không? Tạo booking trong một transaction." <em>Không biết gì về HTTP.</em></div>
  <div class="lz-layer"><b>Prisma</b> — truy cập CSDL qua client sinh ra. <em>Không biết gì về quy tắc nghiệp vụ.</em></div>
</div>

<h3>server.js — gốc lắp ráp</h3>
<pre><span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> authRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/auth.routes.js'</span>;
<span class="tok-keyword">import</span> roomRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/room.routes.js'</span>;
<span class="tok-keyword">import</span> bookingRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/booking.routes.js'</span>;
<span class="tok-keyword">import</span> { errorHandler } <span class="tok-keyword">from</span> <span class="tok-string">'./middleware/error.js'</span>;

<span class="tok-keyword">const</span> app = express();
app.use(express.json());                     <span class="tok-comment">// parse body JSON</span>
app.use(<span class="tok-string">'/api/auth'</span>, authRoutes);
app.use(<span class="tok-string">'/api/rooms'</span>, roomRoutes);
app.use(<span class="tok-string">'/api/bookings'</span>, bookingRoutes);
app.use(errorHandler);                        <span class="tok-comment">// CUỐI CÙNG: hình dạng lỗi tập trung</span>

app.listen(<span class="tok-number">3000</span>, () =&gt; console.log(<span class="tok-string">'API on :3000'</span>));</pre>

<div class="callout ok">Vì sao phải phân lớp? Vì khi đó bạn có thể <strong>test một service không cần HTTP</strong> và <strong>thay Express bằng Fastify mà không đụng quy tắc nghiệp vụ</strong>. Mỗi lớp chỉ phụ thuộc vào lớp ngay dưới.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một PrismaClient cho cả tiến trình.</b> Tạo client một lần trong <code>prisma.js</code> và import singleton đó khắp nơi. Mỗi request lại <code>new PrismaClient()</code> sẽ mở một connection pool mới mỗi lần và nhanh chóng cạn kết nối Postgres — một sự cố production Node kinh điển. <em>Vì sao ngoài syllabus: vòng đời connection-pool là chi tiết vận hành giáo trình không nêu, nhưng nó làm sập app thật.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Thiết kế API trên Code Lab</span><span class="lc-sub">Đặt tên tài nguyên, động từ và phân lớp — hình dạng một REST API sạch.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Prisma Client, models & migrations|||2.2 — Prisma Client, model & migration',
          slug: 'int603-prisma-client',
          type: 'VIDEO',
          description: 'Tạo migration, sinh Prisma Client type-safe, và một singleton dùng chung — cùng cách đọc/ghi cơ bản.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>Prisma Client, models &amp; migrations</h2>
<p class="lead">Prisma turns your schema (Section 1) into two things: real database tables (via a <em>migration</em>) and a <em>type-safe client</em> you call from services. You write the schema once; Prisma generates the SQL and the TypeScript types.</p>

<h3>Migrate &amp; generate</h3>
<pre><span class="tok-comment"># create the SQL migration from the schema, apply it, and generate the client</span>
npx prisma migrate dev --name init
<span class="tok-comment"># after editing migration.sql to add the EXCLUDE (Section 1.2), re-apply:</span>
npx prisma migrate dev
<span class="tok-comment"># any time you only changed generator output:</span>
npx prisma generate</pre>
<div class="out"><b>Output:</b>
  Applying migration &#96;20260801_init&#96;
  The following migration(s) have been applied:
    migrations/20260801_init/migration.sql
  ✔ Generated Prisma Client to ./node_modules/@prisma/client</div>

<h3>The shared client — one instance</h3>
<pre><span class="tok-comment">// src/prisma.js</span>
<span class="tok-keyword">import</span> { PrismaClient } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/client'</span>;
<span class="tok-keyword">export const</span> prisma = <span class="tok-keyword">new</span> PrismaClient();</pre>

<h3>Reads &amp; writes are typed method calls</h3>
<pre><span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../prisma.js'</span>;

<span class="tok-comment">// create a room (host feature)</span>
<span class="tok-keyword">await</span> prisma.room.create({
  data: { hostId: <span class="tok-number">1</span>, title: <span class="tok-string">'Sea View Studio'</span>, location: <span class="tok-string">'Da Nang'</span>,
          pricePerNight: <span class="tok-number">40</span>, capacity: <span class="tok-number">2</span> },
});

<span class="tok-comment">// list a guest bookings, newest first, with the room joined in</span>
<span class="tok-keyword">await</span> prisma.booking.findMany({
  where:   { guestId: <span class="tok-number">7</span> },
  include: { room: <span class="tok-keyword">true</span> },
  orderBy: { createdAt: <span class="tok-string">'desc'</span> },
});</pre>
<p><code>include: { room: true }</code> is a JOIN — Prisma fetches the related Room in the same query. The result is fully typed: your editor autocompletes <code>booking.room.title</code>.</p>

<h3>Worked example — migration then a first row</h3>
<div class="out"><b>1.</b> npx prisma migrate dev --name init      → tables User, Room, Booking created
<b>2.</b> (edit migration.sql, add EXCLUDE no_overlap) → npx prisma migrate dev
<b>3.</b> node -e "prisma.user.create({ data:{ email:'host@ex.com', password:'...', name:'Host', role:'HOST' }})"
<b>4.</b> npx prisma studio                          → opens a browser table viewer; the User row is there
<b>Result:</b> schema, tables, seed data and a typed client — all from one schema file.</div>

<div class="pitfall"><strong>Trap:</strong> running <code>prisma db push</code> instead of <code>migrate dev</code> on a project you will deploy. <code>db push</code> syncs the schema with no migration history — fine for a scratch prototype, but it silently drops your hand-written <code>EXCLUDE</code> and leaves no record to replay in production. Use <code>migrate dev</code> so the constraint lives in a versioned migration file.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Prisma does not model exclusion constraints — so guard the migration.</b> Because the <code>EXCLUDE</code> lives only in raw SQL, a later <code>prisma migrate dev</code> that regenerates from the schema could forget it. Keep the raw SQL in its own committed migration and verify it with <code>prisma migrate status</code> before every deploy. <em>Why beyond syllabus: knowing the limits of your ORM — and compensating with raw SQL — is exactly the senior instinct reviewers look for.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-430" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Prisma setup &amp; schema on Code Lab</span><span class="lc-sub">Models, the client and your first queries, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-436" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Prisma migrations on Code Lab</span><span class="lc-sub">migrate dev vs deploy, migration history and drift.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Prisma Client, model &amp; migration</h2>
<p class="lead">Prisma biến schema của bạn (Mục 1) thành hai thứ: bảng CSDL thật (qua một <em>migration</em>) và một <em>client an toàn kiểu</em> bạn gọi từ service. Bạn viết schema một lần; Prisma sinh SQL và các type TypeScript.</p>

<h3>Migrate &amp; generate</h3>
<pre><span class="tok-comment"># tạo migration SQL từ schema, áp nó, và sinh client</span>
npx prisma migrate dev --name init
<span class="tok-comment"># sau khi sửa migration.sql thêm EXCLUDE (Mục 1.2), áp lại:</span>
npx prisma migrate dev
<span class="tok-comment"># bất kỳ lúc nào chỉ đổi output của generator:</span>
npx prisma generate</pre>
<div class="out"><b>Kết quả:</b>
  Applying migration &#96;20260801_init&#96;
  The following migration(s) have been applied:
    migrations/20260801_init/migration.sql
  ✔ Generated Prisma Client to ./node_modules/@prisma/client</div>

<h3>Client dùng chung — một instance</h3>
<pre><span class="tok-comment">// src/prisma.js</span>
<span class="tok-keyword">import</span> { PrismaClient } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/client'</span>;
<span class="tok-keyword">export const</span> prisma = <span class="tok-keyword">new</span> PrismaClient();</pre>

<h3>Đọc &amp; ghi là các lời gọi method có kiểu</h3>
<pre><span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../prisma.js'</span>;

<span class="tok-comment">// tạo một phòng (tính năng chủ nhà)</span>
<span class="tok-keyword">await</span> prisma.room.create({
  data: { hostId: <span class="tok-number">1</span>, title: <span class="tok-string">'Sea View Studio'</span>, location: <span class="tok-string">'Da Nang'</span>,
          pricePerNight: <span class="tok-number">40</span>, capacity: <span class="tok-number">2</span> },
});

<span class="tok-comment">// liệt kê lượt đặt của một khách, mới nhất trước, kèm room join vào</span>
<span class="tok-keyword">await</span> prisma.booking.findMany({
  where:   { guestId: <span class="tok-number">7</span> },
  include: { room: <span class="tok-keyword">true</span> },
  orderBy: { createdAt: <span class="tok-string">'desc'</span> },
});</pre>
<p><code>include: { room: true }</code> là một JOIN — Prisma nạp Room liên quan trong cùng truy vấn. Kết quả có kiểu đầy đủ: editor gợi ý <code>booking.room.title</code>.</p>

<h3>Ví dụ có lời giải — migration rồi dòng đầu tiên</h3>
<div class="out"><b>1.</b> npx prisma migrate dev --name init      → bảng User, Room, Booking được tạo
<b>2.</b> (sửa migration.sql, thêm EXCLUDE no_overlap) → npx prisma migrate dev
<b>3.</b> node -e "prisma.user.create({ data:{ email:'host@ex.com', password:'...', name:'Host', role:'HOST' }})"
<b>4.</b> npx prisma studio                          → mở trình xem bảng trên trình duyệt; dòng User đã có
<b>Kết quả:</b> schema, bảng, dữ liệu seed và một client có kiểu — tất cả từ một file schema.</div>

<div class="pitfall"><strong>Bẫy:</strong> chạy <code>prisma db push</code> thay vì <code>migrate dev</code> trên một dự án sẽ triển khai. <code>db push</code> đồng bộ schema mà không có lịch sử migration — ổn cho prototype nháp, nhưng nó âm thầm bỏ mất <code>EXCLUDE</code> viết tay của bạn và không để lại bản ghi nào để phát lại ở production. Dùng <code>migrate dev</code> để ràng buộc sống trong một file migration có phiên bản.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Prisma không mô hình được ràng buộc exclusion — nên hãy canh migration.</b> Vì <code>EXCLUDE</code> chỉ sống trong SQL thô, một <code>prisma migrate dev</code> sau này sinh lại từ schema có thể quên nó. Giữ SQL thô trong migration riêng đã commit và kiểm bằng <code>prisma migrate status</code> trước mỗi lần deploy. <em>Vì sao ngoài syllabus: biết giới hạn của ORM — và bù bằng SQL thô — chính là bản năng cấp senior mà hội đồng tìm kiếm.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-430" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Cài đặt &amp; schema Prisma trên Code Lab</span><span class="lc-sub">Model, client và các truy vấn đầu tiên, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-436" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Migration Prisma trên Code Lab</span><span class="lc-sub">migrate dev vs deploy, lịch sử migration và drift.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.3 — Worked slice: search available rooms|||2.3 — Lát cắt có lời giải: tìm phòng trống',
          slug: 'int603-slice-search',
          type: 'VIDEO',
          description: 'Đi trọn một lát cắt dọc đầu tiên: route → controller → service dùng relation-filter để loại phòng bị chồng lấn — có JSON thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.3</span>
<h2>Worked slice — search available rooms</h2>
<p class="lead">Let's ship the first vertical slice end-to-end: <code>GET /api/rooms?location=Da Nang&amp;checkIn=2026-08-01&amp;checkOut=2026-08-04</code> returns only rooms with <em>no active booking overlapping those dates</em>. It reuses the exact overlap test from Section 1 — this time as a Prisma relation filter.</p>

<h3>Step 1 — the service (business intent, no HTTP)</h3>
<pre><span class="tok-comment">// src/services/room.service.js</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../prisma.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">searchRooms</span>({ location, checkIn, checkOut }) {
  <span class="tok-keyword">return</span> prisma.room.findMany({
    where: {
      location: location ? { contains: location, mode: <span class="tok-string">'insensitive'</span> } : <span class="tok-keyword">undefined</span>,
      <span class="tok-comment">// keep a room only if NONE of its active bookings overlaps [checkIn, checkOut)</span>
      bookings: {
        none: {
          status:   { in: [<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>] },
          checkIn:  { lt: checkOut },   <span class="tok-comment">// other.start &lt; requested.end</span>
          checkOut: { gt: checkIn },    <span class="tok-comment">// other.end   &gt; requested.start</span>
        },
      },
    },
    orderBy: { pricePerNight: <span class="tok-string">'asc'</span> },
  });
}</pre>

<h3>Step 2 — the controller (HTTP only)</h3>
<pre><span class="tok-comment">// src/controllers/room.controller.js</span>
<span class="tok-keyword">import</span> { searchRooms } <span class="tok-keyword">from</span> <span class="tok-string">'../services/room.service.js'</span>;
<span class="tok-keyword">import</span> { searchSchema } <span class="tok-keyword">from</span> <span class="tok-string">'../schemas/room.schema.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">list</span>(req, res, next) {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> q = searchSchema.parse(req.query);   <span class="tok-comment">// coerce &amp; validate the query string</span>
    res.json(<span class="tok-keyword">await</span> searchRooms(q));
  } <span class="tok-keyword">catch</span> (e) { next(e); }             <span class="tok-comment">// hand any error to the central handler</span>
}</pre>

<h3>Step 3 — the route</h3>
<pre><span class="tok-comment">// src/routes/room.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> { list } <span class="tok-keyword">from</span> <span class="tok-string">'../controllers/room.controller.js'</span>;

<span class="tok-keyword">const</span> r = Router();
r.get(<span class="tok-string">'/'</span>, list);        <span class="tok-comment">// GET /api/rooms — public search</span>
<span class="tok-keyword">export default</span> r;</pre>

<h3>Step 4 — test it (real output)</h3>
<div class="out"><b>Request:</b>  curl <span class="tok-string">"http://localhost:3000/api/rooms?location=Da%20Nang&amp;checkIn=2026-08-01&amp;checkOut=2026-08-04"</span>
<b>Response 200:</b>
[
  { "id": 5, "title": "Garden Bungalow", "location": "Da Nang",
    "pricePerNight": 35, "capacity": 2 }
]
<b>Note:</b> "Sea View Studio" (id 3) is absent — it already has a CONFIRMED booking [Aug 02, Aug 05) that overlaps the requested [Aug 01, Aug 04).</div>
<p>That is a complete slice: request → route → controller → service → Prisma → JSON. Every other read endpoint (my bookings, room occupancy) is this same shape.</p>

<div class="callout ok"><strong>Rhythm to internalise:</strong> service first (the intent), then controller (the plumbing), then route (the wiring). The <code>none: { overlap… }</code> filter is the read-side twin of the booking core in Section 4 — same overlap math, applied to hide unavailable rooms.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The relation filter is a subquery, not N+1.</b> Prisma compiles <code>bookings: { none: {…} }</code> into a single SQL statement with a <code>NOT EXISTS</code> subquery — one round-trip, not one query per room. Fetching every room then filtering in JavaScript would be the N+1 trap and would not scale. <em>Why beyond syllabus: pushing the filter into the database instead of the app is a performance instinct the syllabus rarely drills.</em></div>

<a class="link-card codelab" href="/code-lab/postgresql?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-863" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Joins on Code Lab</span><span class="lc-sub">INNER/LEFT JOIN and subqueries — what Prisma include and relation filters compile to.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.3</span>
<h2>Lát cắt có lời giải — tìm phòng trống</h2>
<p class="lead">Hãy ship lát cắt dọc đầu tiên từ đầu đến cuối: <code>GET /api/rooms?location=Da Nang&amp;checkIn=2026-08-01&amp;checkOut=2026-08-04</code> chỉ trả các phòng <em>không có lượt đặt hoạt động nào chồng lấn các ngày đó</em>. Nó tái dùng đúng kiểm chồng lấn ở Mục 1 — lần này là một relation filter của Prisma.</p>

<h3>Bước 1 — service (ý định nghiệp vụ, không HTTP)</h3>
<pre><span class="tok-comment">// src/services/room.service.js</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../prisma.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">searchRooms</span>({ location, checkIn, checkOut }) {
  <span class="tok-keyword">return</span> prisma.room.findMany({
    where: {
      location: location ? { contains: location, mode: <span class="tok-string">'insensitive'</span> } : <span class="tok-keyword">undefined</span>,
      <span class="tok-comment">// giữ một phòng chỉ khi KHÔNG lượt đặt hoạt động nào chồng [checkIn, checkOut)</span>
      bookings: {
        none: {
          status:   { in: [<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>] },
          checkIn:  { lt: checkOut },   <span class="tok-comment">// other.start &lt; requested.end</span>
          checkOut: { gt: checkIn },    <span class="tok-comment">// other.end   &gt; requested.start</span>
        },
      },
    },
    orderBy: { pricePerNight: <span class="tok-string">'asc'</span> },
  });
}</pre>

<h3>Bước 2 — controller (chỉ HTTP)</h3>
<pre><span class="tok-comment">// src/controllers/room.controller.js</span>
<span class="tok-keyword">import</span> { searchRooms } <span class="tok-keyword">from</span> <span class="tok-string">'../services/room.service.js'</span>;
<span class="tok-keyword">import</span> { searchSchema } <span class="tok-keyword">from</span> <span class="tok-string">'../schemas/room.schema.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">list</span>(req, res, next) {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> q = searchSchema.parse(req.query);   <span class="tok-comment">// ép kiểu &amp; validate query string</span>
    res.json(<span class="tok-keyword">await</span> searchRooms(q));
  } <span class="tok-keyword">catch</span> (e) { next(e); }             <span class="tok-comment">// chuyển mọi lỗi cho handler tập trung</span>
}</pre>

<h3>Bước 3 — route</h3>
<pre><span class="tok-comment">// src/routes/room.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> { list } <span class="tok-keyword">from</span> <span class="tok-string">'../controllers/room.controller.js'</span>;

<span class="tok-keyword">const</span> r = Router();
r.get(<span class="tok-string">'/'</span>, list);        <span class="tok-comment">// GET /api/rooms — tìm kiếm công khai</span>
<span class="tok-keyword">export default</span> r;</pre>

<h3>Bước 4 — thử nó (kết quả thật)</h3>
<div class="out"><b>Request:</b>  curl <span class="tok-string">"http://localhost:3000/api/rooms?location=Da%20Nang&amp;checkIn=2026-08-01&amp;checkOut=2026-08-04"</span>
<b>Response 200:</b>
[
  { "id": 5, "title": "Garden Bungalow", "location": "Da Nang",
    "pricePerNight": 35, "capacity": 2 }
]
<b>Chú ý:</b> "Sea View Studio" (id 3) vắng mặt — nó đã có một booking CONFIRMED [Aug 02, Aug 05) chồng lấn khoảng yêu cầu [Aug 01, Aug 04).</div>
<p>Đó là một lát cắt hoàn chỉnh: request → route → controller → service → Prisma → JSON. Mọi endpoint đọc khác (lượt đặt của tôi, lịch kín phòng) đều cùng hình dạng này.</p>

<div class="callout ok"><strong>Nhịp cần thấm:</strong> service trước (ý định), rồi controller (đường ống), rồi route (nối dây). Filter <code>none: { overlap… }</code> là bản sinh đôi phía-đọc của lõi đặt phòng ở Mục 4 — cùng phép toán chồng lấn, áp để ẩn các phòng không còn trống.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Relation filter là một subquery, không phải N+1.</b> Prisma biên dịch <code>bookings: { none: {…} }</code> thành một câu SQL duy nhất với subquery <code>NOT EXISTS</code> — một lượt đi-về, không phải một truy vấn mỗi phòng. Nạp mọi phòng rồi lọc trong JavaScript sẽ là bẫy N+1 và không mở rộng được. <em>Vì sao ngoài syllabus: đẩy bộ lọc vào CSDL thay vì app là bản năng hiệu năng giáo trình ít rèn.</em></div>

<a class="link-card codelab" href="/code-lab/postgresql?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-863" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Join trên Code Lab</span><span class="lc-sub">INNER/LEFT JOIN và subquery — thứ mà Prisma include và relation filter biên dịch thành.</span></span>
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
      description: 'Đăng ký/đăng nhập, băm mật khẩu bằng bcrypt, phát JWT, và phân quyền hai vai trò bằng middleware — ai được làm gì.',
      lessons: [
        {
          title: '3.1 — Register, login & issue a JWT|||3.1 — Đăng ký, đăng nhập & phát JWT',
          slug: 'int603-auth-jwt',
          type: 'VIDEO',
          description: 'Băm mật khẩu bằng bcrypt, đổi email+mật khẩu lấy một JWT ký bằng jsonwebtoken, và một middleware auth gắn req.user.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.1</span>
<h2>Register, login &amp; issue a JWT</h2>
<p class="lead">Authentication answers "who are you?". The flow: register (store a <strong>bcrypt hash</strong>, never the plain password) → login (check the password, return a <strong>signed JWT</strong>) → every later request carries that token in the <code>Authorization</code> header, and a middleware decodes it into <code>req.user</code>.</p>

<h3>What a JWT is — three dot-separated parts</h3>
<div class="diagram">header.payload.signature
   │       │        └─ HMAC-SHA256(header.payload, SECRET) — proves we issued it
   │       └─ claims: { "sub": 7, "role": "GUEST", "exp": ... }
   └─ { "alg": "HS256", "typ": "JWT" }</div>
<p>The server stores no session. It trusts the token because only the server knows the SECRET used to sign it — tamper with one byte and the signature check fails.</p>

<h3>Register &amp; login — the service</h3>
<pre><span class="tok-comment">// src/services/auth.service.js</span>
<span class="tok-keyword">import</span> bcrypt <span class="tok-keyword">from</span> <span class="tok-string">'bcrypt'</span>;
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../prisma.js'</span>;
<span class="tok-keyword">import</span> { ConflictError, UnauthorizedError } <span class="tok-keyword">from</span> <span class="tok-string">'../errors.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">register</span>({ email, password, name }) {
  <span class="tok-keyword">const</span> exists = <span class="tok-keyword">await</span> prisma.user.findUnique({ where: { email } });
  <span class="tok-keyword">if</span> (exists) <span class="tok-keyword">throw new</span> ConflictError(<span class="tok-string">'Email already registered'</span>);
  <span class="tok-keyword">const</span> hash = <span class="tok-keyword">await</span> bcrypt.hash(password, <span class="tok-number">10</span>);   <span class="tok-comment">// ★ hash, never store plain</span>
  <span class="tok-keyword">return</span> prisma.user.create({
    data: { email, password: hash, name, role: <span class="tok-string">'GUEST'</span> }, <span class="tok-comment">// self-register = guest</span>
    select: { id: <span class="tok-keyword">true</span>, email: <span class="tok-keyword">true</span>, name: <span class="tok-keyword">true</span>, role: <span class="tok-keyword">true</span> },
  });
}

<span class="tok-keyword">export async function</span> <span class="tok-function">login</span>({ email, password }) {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> prisma.user.findUnique({ where: { email } });
  <span class="tok-keyword">if</span> (!user || !(<span class="tok-keyword">await</span> bcrypt.compare(password, user.password)))
    <span class="tok-keyword">throw new</span> UnauthorizedError(<span class="tok-string">'Bad credentials'</span>);   <span class="tok-comment">// same msg either way</span>
  <span class="tok-keyword">const</span> token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: <span class="tok-string">'1d'</span> },
  );
  <span class="tok-keyword">return</span> { token, role: user.role };
}</pre>

<h3>The auth middleware — decode the token into req.user</h3>
<pre><span class="tok-comment">// src/middleware/auth.js</span>
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">import</span> { UnauthorizedError } <span class="tok-keyword">from</span> <span class="tok-string">'../errors.js'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">auth</span>(req, res, next) {
  <span class="tok-keyword">const</span> header = req.headers.authorization || <span class="tok-string">''</span>;
  <span class="tok-keyword">const</span> token = header.startsWith(<span class="tok-string">'Bearer '</span>) ? header.slice(<span class="tok-number">7</span>) : <span class="tok-keyword">null</span>;
  <span class="tok-keyword">if</span> (!token) <span class="tok-keyword">return</span> next(<span class="tok-keyword">new</span> UnauthorizedError(<span class="tok-string">'Missing token'</span>));
  <span class="tok-keyword">try</span> {
    req.user = jwt.verify(token, process.env.JWT_SECRET);  <span class="tok-comment">// { sub, role, iat, exp }</span>
    next();
  } <span class="tok-keyword">catch</span> {
    next(<span class="tok-keyword">new</span> UnauthorizedError(<span class="tok-string">'Invalid or expired token'</span>));
  }
}</pre>

<h3>Worked example — the login round-trip</h3>
<div class="out"><b>1.</b> POST /api/auth/register { "email":"an@mail.com", "password":"Secret123", "name":"An" }
   → 201 { "id":7, "email":"an@mail.com", "name":"An", "role":"GUEST" }
<b>2.</b> POST /api/auth/login    { "email":"an@mail.com", "password":"Secret123" }
   → 200 { "token":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsInJvbGUiOiJH...", "role":"GUEST" }
<b>3.</b> GET /api/bookings/mine   Header: Authorization: Bearer eyJhbGciOiJIUzI1...
   → 200 [ ...An bookings... ]
<b>Wrong password?</b> step 2 → 401 Unauthorized (same message whether email or password is wrong — see pitfall).</div>

<div class="pitfall"><strong>Security trap:</strong> different error messages for "email not found" vs "wrong password" let an attacker enumerate which emails exist. Return the <em>same</em> generic "Bad credentials" for both. Also: never log the password or the raw token, and never return the <code>password</code> field (use Prisma <code>select</code> to leave it out).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>bcrypt is deliberately slow, and that is a feature.</b> Unlike a plain SHA-256, bcrypt has a tunable cost factor so hashing takes ~100 ms — trivial for one login, but it makes brute-forcing a stolen hash database astronomically expensive. Never hash passwords with a fast general-purpose hash. <em>Why beyond syllabus: the "why slow is good" reasoning is security engineering the syllabus assumes but rarely explains.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">JWT on Code Lab</span><span class="lc-sub">Signing, verifying and protecting routes with tokens, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-529" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; security on Code Lab</span><span class="lc-sub">Bearer tokens, headers and the security boundary of a REST API.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.1</span>
<h2>Đăng ký, đăng nhập &amp; phát JWT</h2>
<p class="lead">Xác thực trả lời "bạn là ai?". Luồng: đăng ký (lưu một <strong>hash bcrypt</strong>, không bao giờ lưu mật khẩu thô) → đăng nhập (kiểm mật khẩu, trả về một <strong>JWT đã ký</strong>) → mọi request sau mang token đó trong header <code>Authorization</code>, và một middleware giải mã nó vào <code>req.user</code>.</p>

<h3>JWT là gì — ba phần ngăn bởi dấu chấm</h3>
<div class="diagram">header.payload.signature
   │       │        └─ HMAC-SHA256(header.payload, SECRET) — chứng minh do ta phát
   │       └─ claim: { "sub": 7, "role": "GUEST", "exp": ... }
   └─ { "alg": "HS256", "typ": "JWT" }</div>
<p>Server không lưu session. Nó tin token vì chỉ server biết SECRET dùng để ký — sửa một byte là chữ ký sai.</p>

<h3>Đăng ký &amp; đăng nhập — service</h3>
<pre><span class="tok-comment">// src/services/auth.service.js</span>
<span class="tok-keyword">import</span> bcrypt <span class="tok-keyword">from</span> <span class="tok-string">'bcrypt'</span>;
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../prisma.js'</span>;
<span class="tok-keyword">import</span> { ConflictError, UnauthorizedError } <span class="tok-keyword">from</span> <span class="tok-string">'../errors.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">register</span>({ email, password, name }) {
  <span class="tok-keyword">const</span> exists = <span class="tok-keyword">await</span> prisma.user.findUnique({ where: { email } });
  <span class="tok-keyword">if</span> (exists) <span class="tok-keyword">throw new</span> ConflictError(<span class="tok-string">'Email đã được đăng ký'</span>);
  <span class="tok-keyword">const</span> hash = <span class="tok-keyword">await</span> bcrypt.hash(password, <span class="tok-number">10</span>);   <span class="tok-comment">// ★ băm, không lưu thô</span>
  <span class="tok-keyword">return</span> prisma.user.create({
    data: { email, password: hash, name, role: <span class="tok-string">'GUEST'</span> }, <span class="tok-comment">// tự đăng ký = khách</span>
    select: { id: <span class="tok-keyword">true</span>, email: <span class="tok-keyword">true</span>, name: <span class="tok-keyword">true</span>, role: <span class="tok-keyword">true</span> },
  });
}

<span class="tok-keyword">export async function</span> <span class="tok-function">login</span>({ email, password }) {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> prisma.user.findUnique({ where: { email } });
  <span class="tok-keyword">if</span> (!user || !(<span class="tok-keyword">await</span> bcrypt.compare(password, user.password)))
    <span class="tok-keyword">throw new</span> UnauthorizedError(<span class="tok-string">'Sai thông tin đăng nhập'</span>);   <span class="tok-comment">// cùng một thông báo</span>
  <span class="tok-keyword">const</span> token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: <span class="tok-string">'1d'</span> },
  );
  <span class="tok-keyword">return</span> { token, role: user.role };
}</pre>

<h3>Middleware auth — giải mã token vào req.user</h3>
<pre><span class="tok-comment">// src/middleware/auth.js</span>
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">import</span> { UnauthorizedError } <span class="tok-keyword">from</span> <span class="tok-string">'../errors.js'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">auth</span>(req, res, next) {
  <span class="tok-keyword">const</span> header = req.headers.authorization || <span class="tok-string">''</span>;
  <span class="tok-keyword">const</span> token = header.startsWith(<span class="tok-string">'Bearer '</span>) ? header.slice(<span class="tok-number">7</span>) : <span class="tok-keyword">null</span>;
  <span class="tok-keyword">if</span> (!token) <span class="tok-keyword">return</span> next(<span class="tok-keyword">new</span> UnauthorizedError(<span class="tok-string">'Thiếu token'</span>));
  <span class="tok-keyword">try</span> {
    req.user = jwt.verify(token, process.env.JWT_SECRET);  <span class="tok-comment">// { sub, role, iat, exp }</span>
    next();
  } <span class="tok-keyword">catch</span> {
    next(<span class="tok-keyword">new</span> UnauthorizedError(<span class="tok-string">'Token sai hoặc hết hạn'</span>));
  }
}</pre>

<h3>Ví dụ có lời giải — vòng đăng nhập</h3>
<div class="out"><b>1.</b> POST /api/auth/register { "email":"an@mail.com", "password":"Secret123", "name":"An" }
   → 201 { "id":7, "email":"an@mail.com", "name":"An", "role":"GUEST" }
<b>2.</b> POST /api/auth/login    { "email":"an@mail.com", "password":"Secret123" }
   → 200 { "token":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsInJvbGUiOiJH...", "role":"GUEST" }
<b>3.</b> GET /api/bookings/mine   Header: Authorization: Bearer eyJhbGciOiJIUzI1...
   → 200 [ ...các lượt đặt của An... ]
<b>Sai mật khẩu?</b> bước 2 → 401 Unauthorized (cùng một thông báo dù email hay mật khẩu sai — xem bẫy).</div>

<div class="pitfall"><strong>Bẫy bảo mật:</strong> thông báo lỗi khác nhau cho "không tìm thấy email" và "sai mật khẩu" giúp kẻ tấn công dò email nào tồn tại. Trả <em>cùng</em> một thông báo chung "Sai thông tin đăng nhập" cho cả hai. Ngoài ra: không bao giờ log mật khẩu hay token thô, và không bao giờ trả trường <code>password</code> (dùng <code>select</code> của Prisma để bỏ nó ra).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>bcrypt cố tình chậm, và đó là một tính năng.</b> Khác SHA-256 thuần, bcrypt có cost factor điều chỉnh được nên băm mất ~100 ms — không đáng kể cho một lần đăng nhập, nhưng khiến việc brute-force một CSDL hash bị đánh cắp đắt đỏ khủng khiếp. Đừng bao giờ băm mật khẩu bằng hash nhanh đa dụng. <em>Vì sao ngoài syllabus: lý lẽ "vì sao chậm lại tốt" là kỹ nghệ bảo mật mà giáo trình giả định nhưng ít giải thích.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">JWT trên Code Lab</span><span class="lc-sub">Ký, xác minh và bảo vệ route bằng token, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-529" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; bảo mật trên Code Lab</span><span class="lc-sub">Bearer token, header và ranh giới bảo mật của một REST API.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Role-based authorization: who can do what|||3.2 — Phân quyền theo vai trò: ai được làm gì',
          slug: 'int603-roles',
          type: 'VIDEO',
          description: 'Một middleware requireRole khoá endpoint theo vai trò, và kiểm quyền sở hữu (chỉ huỷ lượt đặt của mình, chỉ quản phòng của mình).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.2</span>
<h2>Role-based authorization — who can do what</h2>
<p class="lead">Authentication proved <em>who</em> you are; authorization decides <em>what</em> you may do. Two checks: <strong>role</strong> (only a host confirms) and <strong>ownership</strong> (a guest cancels only their own booking; a host manages only their own rooms).</p>

<h3>A tiny role middleware</h3>
<pre><span class="tok-comment">// src/middleware/roles.js</span>
<span class="tok-keyword">import</span> { ForbiddenError } <span class="tok-keyword">from</span> <span class="tok-string">'../errors.js'</span>;

<span class="tok-keyword">export const</span> <span class="tok-function">requireRole</span> = (role) =&gt; (req, res, next) =&gt;
  req.user?.role === role ? next() : next(<span class="tok-keyword">new</span> ForbiddenError(<span class="tok-string">'Insufficient role'</span>));</pre>

<h3>Lock endpoints in the route</h3>
<pre><span class="tok-comment">// src/routes/booking.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> { auth } <span class="tok-keyword">from</span> <span class="tok-string">'../middleware/auth.js'</span>;
<span class="tok-keyword">import</span> { requireRole } <span class="tok-keyword">from</span> <span class="tok-string">'../middleware/roles.js'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> c <span class="tok-keyword">from</span> <span class="tok-string">'../controllers/booking.controller.js'</span>;

<span class="tok-keyword">const</span> r = Router();
r.post(<span class="tok-string">'/'</span>,             auth, requireRole(<span class="tok-string">'GUEST'</span>), c.book);     <span class="tok-comment">// guests book</span>
r.get(<span class="tok-string">'/mine'</span>,        auth, requireRole(<span class="tok-string">'GUEST'</span>), c.mine);     <span class="tok-comment">// own bookings</span>
r.patch(<span class="tok-string">'/:id/cancel'</span>, auth, requireRole(<span class="tok-string">'GUEST'</span>), c.cancel);   <span class="tok-comment">// own only (checked in service)</span>
r.patch(<span class="tok-string">'/:id/confirm'</span>, auth, requireRole(<span class="tok-string">'HOST'</span>),  c.confirm);  <span class="tok-comment">// host of that room only</span>
<span class="tok-keyword">export default</span> r;</pre>

<h3>Ownership check — role is not enough</h3>
<pre><span class="tok-comment">// src/services/booking.service.js  (cancel)</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">cancel</span>(bookingId, currentUserId) {
  <span class="tok-keyword">const</span> b = <span class="tok-keyword">await</span> prisma.booking.findUnique({ where: { id: bookingId } });
  <span class="tok-keyword">if</span> (!b) <span class="tok-keyword">throw new</span> NotFoundError(<span class="tok-string">'Booking not found'</span>);
  <span class="tok-keyword">if</span> (b.guestId !== currentUserId)                      <span class="tok-comment">// ★ own it?</span>
    <span class="tok-keyword">throw new</span> ForbiddenError(<span class="tok-string">'Not your booking'</span>);        <span class="tok-comment">// → 403</span>
  <span class="tok-keyword">return</span> prisma.booking.update({
    where: { id: bookingId }, data: { status: <span class="tok-string">'CANCELLED'</span> },
  });                                                    <span class="tok-comment">// frees the dates (partial EXCLUDE)</span>
}

<span class="tok-comment">// confirm: the host must own the room the booking is on</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">confirm</span>(bookingId, hostId) {
  <span class="tok-keyword">const</span> b = <span class="tok-keyword">await</span> prisma.booking.findUnique({
    where: { id: bookingId }, include: { room: <span class="tok-keyword">true</span> },
  });
  <span class="tok-keyword">if</span> (!b) <span class="tok-keyword">throw new</span> NotFoundError(<span class="tok-string">'Booking not found'</span>);
  <span class="tok-keyword">if</span> (b.room.hostId !== hostId)                          <span class="tok-comment">// ★ your room?</span>
    <span class="tok-keyword">throw new</span> ForbiddenError(<span class="tok-string">'Not your room'</span>);
  <span class="tok-keyword">return</span> prisma.booking.update({
    where: { id: bookingId }, data: { status: <span class="tok-string">'CONFIRMED'</span> },
  });
}</pre>

<h3>Worked example — the permission matrix</h3>
<table>
<thead><tr><th>Action</th><th>GUEST</th><th>HOST</th></tr></thead>
<tbody>
<tr><td>Book a room</td><td>✅</td><td>❌ 403</td></tr>
<tr><td>Cancel own booking</td><td>✅</td><td>❌</td></tr>
<tr><td>Cancel someone else booking</td><td>❌ 403</td><td>—</td></tr>
<tr><td>Confirm / reject a booking</td><td>❌ 403</td><td>✅ own room only</td></tr>
<tr><td>Create / edit a room</td><td>❌ 403</td><td>✅ own only</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Trap:</strong> checking role but forgetting ownership. If any logged-in guest can cancel <em>any</em> booking by changing the id in the URL, or any host can confirm on <em>another</em> host room, that is a broken-access-control vulnerability (OWASP #1). Role gets you in the door; ownership checks the room number.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>401 vs 403 — say the right one.</b> <code>401 Unauthorized</code> means "I do not know who you are" (missing/expired token — re-login). <code>403 Forbidden</code> means "I know who you are, but you may not do this" (wrong role or not your resource). Returning the wrong one confuses every client. <em>Why beyond syllabus: the semantic difference is subtle and constantly gotten wrong, even in production APIs.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-955" target="_blank" rel="noopener">
  <span class="lc-ico">🛂</span>
  <span class="lc-body"><span class="lc-title">Role-based access on Code Lab</span><span class="lc-sub">Guarding routes by role and resource ownership, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.2</span>
<h2>Phân quyền theo vai trò — ai được làm gì</h2>
<p class="lead">Xác thực chứng minh <em>bạn là ai</em>; phân quyền quyết định <em>bạn được làm gì</em>. Hai kiểm tra: <strong>vai trò</strong> (chỉ chủ nhà xác nhận) và <strong>quyền sở hữu</strong> (khách chỉ huỷ lượt đặt của mình; chủ nhà chỉ quản phòng của mình).</p>

<h3>Một middleware role nhỏ xíu</h3>
<pre><span class="tok-comment">// src/middleware/roles.js</span>
<span class="tok-keyword">import</span> { ForbiddenError } <span class="tok-keyword">from</span> <span class="tok-string">'../errors.js'</span>;

<span class="tok-keyword">export const</span> <span class="tok-function">requireRole</span> = (role) =&gt; (req, res, next) =&gt;
  req.user?.role === role ? next() : next(<span class="tok-keyword">new</span> ForbiddenError(<span class="tok-string">'Không đủ quyền'</span>));</pre>

<h3>Khoá endpoint trong route</h3>
<pre><span class="tok-comment">// src/routes/booking.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> { auth } <span class="tok-keyword">from</span> <span class="tok-string">'../middleware/auth.js'</span>;
<span class="tok-keyword">import</span> { requireRole } <span class="tok-keyword">from</span> <span class="tok-string">'../middleware/roles.js'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> c <span class="tok-keyword">from</span> <span class="tok-string">'../controllers/booking.controller.js'</span>;

<span class="tok-keyword">const</span> r = Router();
r.post(<span class="tok-string">'/'</span>,             auth, requireRole(<span class="tok-string">'GUEST'</span>), c.book);     <span class="tok-comment">// khách đặt</span>
r.get(<span class="tok-string">'/mine'</span>,        auth, requireRole(<span class="tok-string">'GUEST'</span>), c.mine);     <span class="tok-comment">// lượt đặt của mình</span>
r.patch(<span class="tok-string">'/:id/cancel'</span>, auth, requireRole(<span class="tok-string">'GUEST'</span>), c.cancel);   <span class="tok-comment">// chỉ của mình (kiểm trong service)</span>
r.patch(<span class="tok-string">'/:id/confirm'</span>, auth, requireRole(<span class="tok-string">'HOST'</span>),  c.confirm);  <span class="tok-comment">// chỉ chủ nhà của phòng đó</span>
<span class="tok-keyword">export default</span> r;</pre>

<h3>Kiểm quyền sở hữu — chỉ role là chưa đủ</h3>
<pre><span class="tok-comment">// src/services/booking.service.js  (cancel)</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">cancel</span>(bookingId, currentUserId) {
  <span class="tok-keyword">const</span> b = <span class="tok-keyword">await</span> prisma.booking.findUnique({ where: { id: bookingId } });
  <span class="tok-keyword">if</span> (!b) <span class="tok-keyword">throw new</span> NotFoundError(<span class="tok-string">'Không tìm thấy lượt đặt'</span>);
  <span class="tok-keyword">if</span> (b.guestId !== currentUserId)                      <span class="tok-comment">// ★ có phải của mình?</span>
    <span class="tok-keyword">throw new</span> ForbiddenError(<span class="tok-string">'Không phải lượt đặt của bạn'</span>);  <span class="tok-comment">// → 403</span>
  <span class="tok-keyword">return</span> prisma.booking.update({
    where: { id: bookingId }, data: { status: <span class="tok-string">'CANCELLED'</span> },
  });                                                    <span class="tok-comment">// trả lại ngày (EXCLUDE một phần)</span>
}

<span class="tok-comment">// confirm: chủ nhà phải sở hữu phòng của lượt đặt</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">confirm</span>(bookingId, hostId) {
  <span class="tok-keyword">const</span> b = <span class="tok-keyword">await</span> prisma.booking.findUnique({
    where: { id: bookingId }, include: { room: <span class="tok-keyword">true</span> },
  });
  <span class="tok-keyword">if</span> (!b) <span class="tok-keyword">throw new</span> NotFoundError(<span class="tok-string">'Không tìm thấy lượt đặt'</span>);
  <span class="tok-keyword">if</span> (b.room.hostId !== hostId)                          <span class="tok-comment">// ★ phòng của bạn?</span>
    <span class="tok-keyword">throw new</span> ForbiddenError(<span class="tok-string">'Không phải phòng của bạn'</span>);
  <span class="tok-keyword">return</span> prisma.booking.update({
    where: { id: bookingId }, data: { status: <span class="tok-string">'CONFIRMED'</span> },
  });
}</pre>

<h3>Ví dụ có lời giải — ma trận quyền</h3>
<table>
<thead><tr><th>Hành động</th><th>KHÁCH</th><th>CHỦ NHÀ</th></tr></thead>
<tbody>
<tr><td>Đặt một phòng</td><td>✅</td><td>❌ 403</td></tr>
<tr><td>Huỷ lượt đặt của chính mình</td><td>✅</td><td>❌</td></tr>
<tr><td>Huỷ lượt đặt của người khác</td><td>❌ 403</td><td>—</td></tr>
<tr><td>Xác nhận / từ chối một lượt đặt</td><td>❌ 403</td><td>✅ chỉ phòng của mình</td></tr>
<tr><td>Tạo / sửa một phòng</td><td>❌ 403</td><td>✅ chỉ của mình</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Bẫy:</strong> kiểm role nhưng quên quyền sở hữu. Nếu bất kỳ khách đã đăng nhập nào có thể huỷ <em>bất kỳ</em> lượt đặt nào bằng cách đổi id trên URL, hay bất kỳ chủ nhà nào xác nhận trên phòng của <em>chủ khác</em>, đó là lỗ hổng broken-access-control (OWASP #1). Role cho bạn vào cửa; kiểm quyền sở hữu là kiểm số phòng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>401 vs 403 — nói đúng cái.</b> <code>401 Unauthorized</code> nghĩa "tôi không biết bạn là ai" (thiếu/hết hạn token — đăng nhập lại). <code>403 Forbidden</code> nghĩa "tôi biết bạn là ai, nhưng bạn không được làm việc này" (sai role hoặc không phải tài nguyên của bạn). Trả nhầm làm rối mọi client. <em>Vì sao ngoài syllabus: khác biệt ngữ nghĩa này tinh tế và bị làm sai liên tục, kể cả ở API production.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fhomestay-booking-api%2Flearn&reflabel=INT603#module-955" target="_blank" rel="noopener">
  <span class="lc-ico">🛂</span>
  <span class="lc-body"><span class="lc-title">Phân quyền theo vai trò trên Code Lab</span><span class="lc-sub">Bảo vệ route theo vai trò và quyền sở hữu tài nguyên, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
  ],
};
