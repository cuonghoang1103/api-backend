/**
 * INT606 — Event Ticketing System (Kỳ 6 — Thực tập, project #6).
 * Backend-focused: Node.js + Express REST API + PostgreSQL (pg) + Redis (node-redis) + JWT.
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản quay video)
 * → domain/DB design → Express setup & layers → auth/JWT (buyer/organizer) → flash-sale core
 * (Redis atomic seat-HOLD SET NX + TTL, Lua check-and-set, expiry, confirm transaction + UNIQUE
 * backstop) → client → testing (kèm test đồng thời 1000 người mua) → deployment (Docker) → nâng cao.
 * Song ngữ EN/VN đối xứng. Code Node/Redis/SQL <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Deep-link CodeLab rest-apis/redis/postgresql/authentication; Docker/CI → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT606.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (JS template/shell) = \${ ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT606',
    title: 'Event Ticketing System',
    slug: 'event-ticketing-system',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #6 — a real event-ticketing REST API: Node.js + Express + PostgreSQL + Redis, JWT auth, buyer and organizer roles, and a flash-sale core where a seat is NEVER sold twice. Ship it with Docker.|||Đồ án thực tập #6 — REST API bán vé sự kiện thật: Node.js + Express + PostgreSQL + Redis, JWT auth, vai trò người mua và ban tổ chức, lõi flash-sale nơi một ghế KHÔNG BAO GIỜ bị bán hai lần. Triển khai bằng Docker.',
    description: 'INT606 là đồ án thực tập bán vé sự kiện (Event Ticketing) theo kiến trúc client–server, tập trung vào backend. Backend là REST API viết bằng Node.js + Express, dữ liệu bền lưu trong PostgreSQL (truy cập bằng pg), còn Redis giữ các "hold" (giữ chỗ) tạm thời của ghế với TTL. Hệ thống có hai vai trò: Người mua (BUYER) duyệt sự kiện, giữ và mua một ghế, thanh toán giả lập, nhận mã check-in; và Ban tổ chức (ORGANIZER) tạo sự kiện, xem doanh số và check-in. Trọng tâm kỹ thuật — viên ngọc của đồ án — là LÕI FLASH-SALE: khi hàng nghìn người cùng bấm mua đúng một ghế trong một cơn "giẫm đạp" (stampede), hệ thống phải bảo đảm KHÔNG một ghế nào bị bán hai lần. Bạn sẽ học một seat-HOLD nguyên tử bằng Redis (SET NX kèm TTL, và một script Lua để kiểm-rồi-đặt an toàn), một cơ chế hết hạn tự trả lại ghế nếu thanh toán không hoàn tất, rồi một ràng buộc UNIQUE(seat_id) trên đơn hàng đã xác nhận cộng một transaction làm chốt chặn cuối. Cuối cùng đóng gói api + db + redis bằng Docker Compose và viết kịch bản demo để quay video. Đây là dự án "xương sống" cho mọi hệ thống bán chỗ có tranh chấp cao: đặt vé, đặt bàn, giành slot khuyến mãi.',
    whatYouLearn: 'Thiết kế domain & ERD cho nghiệp vụ bán vé (User/Event/Seat/Order); dựng REST API Express theo kiến trúc phân lớp route→service→repository; truy cập PostgreSQL bằng pg với transaction; xác thực JWT + phân quyền hai vai trò (BUYER/ORGANIZER); thiết kế API sạch (status code, error shape, phân trang); LÕI FLASH-SALE chống bán trùng ghế bằng Redis: SET NX + TTL giữ chỗ nguyên tử, script Lua kiểm-rồi-đặt (so với race GET-rồi-SET ngây thơ), hết hạn hold tự trả ghế, và UNIQUE(seat_id) + transaction làm chốt chặn ở CSDL; thanh toán giả lập + mã check-in; một client mỏng cho luồng mua có đồng hồ đếm ngược và một dashboard ban tổ chức; kiểm thử unit + integration và một test đồng thời bắn 1000 lượt giữ chỗ chứng minh đúng một ghế được bán; đóng gói Docker Compose (api + db + redis) + biến môi trường; và một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học WED201c (Lập trình web), DBI202 (CSDL/SQL) và có nền JavaScript/Node.js. Cần: Node.js LTS, VS Code, Docker Desktop (để chạy PostgreSQL + Redis), redis-cli, một client test API (Postman hoặc REST Client trong VS Code) và một tài khoản GitHub cho nhóm.',
    documentsNote: 'Tham chiếu: Express docs (expressjs.com) • node-redis (github.com/redis/node-redis) • Redis Commands & Lua EVAL (redis.io) • node-postgres / pg (node-postgres.com) • PostgreSQL Documentation • jwt.io. Công cụ: VS Code, Postman, redis-cli, DBeaver/pgAdmin, Docker Desktop, draw.io (ERD). Luyện code: track Code Lab REST APIs + Redis + PostgreSQL + Authentication. Docker & CI: Exp Hub. Đây là project-course thực tập — vừa xây vừa quay video theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc client–server, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int606-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một REST API bán vé thật, kiến trúc client–server, và bản đồ vòng đời từ ERD tới Docker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — an Event Ticketing System</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, deployable REST API: an <strong>event ticketing system</strong> where a buyer holds a seat, pays, and gets a check-in code — and where, during a <strong>flash sale of thousands of buyers hitting one seat at once</strong>, that seat is <strong>never sold twice</strong>. By the end you have a running backend, tested and shipped in Docker, plus a recorded demo.</p>
<p>This is the archetype of every high-contention "grab a limited resource" system: ticket sales, table reservations, limited-drop checkout. Master this one — an authenticated <strong>REST API</strong>, a durable <strong>relational store</strong>, and a fast <strong>atomic gate</strong> that stays correct under a stampede — and the rest are re-skins.</p>

<h3>The system in one picture — client / server / stores</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Client (browser)</div><div class="lz-d">fetch · hold countdown · pay</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Express REST API</div><div class="lz-d">routes→services→repos · JWT · Redis</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL + Redis</div><div class="lz-d">durable orders · ephemeral seat holds</div></div>
</div>
<div class="diagram">Client  ──HTTP/JSON──▶  Express API  ──pg──▶  PostgreSQL  (events, seats, orders)
 (buyer/            (port 4000)      │         UNIQUE(seat_id) on paid order
  organizer)   Authorization: Bearer JWT
                                     └──▶  Redis  (hold:seat:&lt;id&gt; = buyerId, SET NX EX 120)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design</div><div class="lz-nsub">Roles &amp; use cases · ERD · schema · the UNIQUE that prevents a seat being sold twice</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Express project &amp; layers</div><div class="lz-nsub">Routes · services · repositories (pg) · validation · error shape</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">Register/login · middleware · Buyer vs Organizer</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The flash-sale core</div><div class="lz-nsub">Redis atomic hold · Lua check-and-set · TTL expiry · confirm transaction · UNIQUE backstop</div></div></div>
  <div class="lz-stage">Client</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Thin client</div><div class="lz-nsub">Buyer hold-then-pay with a countdown · organizer sales &amp; check-in</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">Unit · integration · a concurrency test that fires 1000 holds and proves ONE sale</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose: api + db + redis · env config · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Lua CAS · virtual waiting room · idempotent payment · CI</div><div class="lz-nsub">Ship like a real engineering team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — login → list seats → hold one → pay → get a code — then grow it. A tiny end-to-end flow that runs beats a huge design that never boots.</div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Warm up REST fundamentals on Code Lab</span><span class="lc-sub">Resources, methods and status codes before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — Hệ thống bán vé sự kiện</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một REST API thật, triển khai được: <strong>hệ thống bán vé sự kiện</strong>, nơi người mua giữ một ghế, thanh toán, và nhận một mã check-in — và nơi, trong một <strong>đợt flash-sale hàng nghìn người cùng bấm một ghế</strong>, ghế đó <strong>không bao giờ bị bán hai lần</strong>. Kết thúc, bạn có một backend chạy được, đã test và đóng gói Docker, kèm một video demo.</p>
<p>Đây là nguyên mẫu của mọi hệ thống "giành một tài nguyên có hạn" tranh chấp cao: bán vé, đặt bàn, checkout hàng giới hạn. Làm chủ cái này — một <strong>REST API</strong> có xác thực, một <strong>kho quan hệ</strong> bền, và một <strong>cổng nguyên tử</strong> nhanh vẫn đúng khi bị giẫm đạp — thì phần còn lại chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — client / server / kho lưu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Client (trình duyệt)</div><div class="lz-d">fetch · đồng hồ giữ chỗ · thanh toán</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Express REST API</div><div class="lz-d">route→service→repo · JWT · Redis</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL + Redis</div><div class="lz-d">đơn hàng bền · giữ chỗ tạm thời</div></div>
</div>
<div class="diagram">Client  ──HTTP/JSON──▶  Express API  ──pg──▶  PostgreSQL  (events, seats, orders)
 (người mua/        (cổng 4000)      │         UNIQUE(seat_id) trên đơn đã thanh toán
  ban tổ chức)  Authorization: Bearer JWT
                                     └──▶  Redis  (hold:seat:&lt;id&gt; = buyerId, SET NX EX 120)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL</div><div class="lz-nsub">Vai trò &amp; use case · ERD · schema · ràng buộc UNIQUE chống bán ghế hai lần</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Dự án Express &amp; các lớp</div><div class="lz-nsub">Route · service · repository (pg) · validation · hình dạng lỗi</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (JWT)</div><div class="lz-nsub">Đăng ký/đăng nhập · middleware · Người mua vs Ban tổ chức</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lõi flash-sale</div><div class="lz-nsub">Redis giữ chỗ nguyên tử · Lua kiểm-rồi-đặt · hết hạn TTL · transaction xác nhận · chốt chặn UNIQUE</div></div></div>
  <div class="lz-stage">Client</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Client mỏng</div><div class="lz-nsub">Người mua giữ-rồi-trả với đồng hồ đếm ngược · ban tổ chức xem doanh số &amp; check-in</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">Unit · integration · một test đồng thời bắn 1000 lượt giữ và chứng minh MỘT ghế được bán</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose: api + db + redis · cấu hình env · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Lua CAS · phòng chờ ảo · thanh toán idempotent · CI</div><div class="lz-nsub">Ship như một đội kỹ sư thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — đăng nhập → liệt kê ghế → giữ một ghế → thanh toán → nhận mã — rồi mới mở rộng. Một luồng nhỏ chạy được từ đầu đến cuối hơn hẳn một bản thiết kế đồ sộ không bao giờ khởi động.</div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Khởi động REST fundamentals trên Code Lab</span><span class="lc-sub">Tài nguyên, method và status code trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int606-pham-vi',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Đúng phạm vi để làm xong: 2 vai trò, luồng lõi flash-sale, và bảng tiêu chí nghiệm thu bạn tự chấm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Scope, roles &amp; acceptance criteria</h2>
<p class="lead">The fastest way to fail an internship project is to build too much and finish nothing. Lock the scope now: <strong>two roles, one flash-sale core, a handful of endpoints</strong>. Everything else is optional polish.</p>

<h3>Two roles — that is enough for real access control</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BUYER</span><span class="v">Register/login · browse events · hold a free seat · pay (mock) within the hold window · get a check-in code · view own tickets</span></div>
  <div class="kv"><span class="k">ORGANIZER</span><span class="v">Login · create an event and its seats · view live sales · check in a ticket at the door by its code</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">BUYER holds a FREE seat ──▶ POST /seats/:id/hold ──▶ Redis SET NX (hold 120s)
        │                                                     │
        │ 999 other buyers hit the SAME seat ──▶ 409 Conflict ┘  (blocked: only 1 hold wins)
        ▼
BUYER pays ──▶ POST /orders (confirm) ──▶ INSERT order UNIQUE(seat_id) ──▶ seat SOLD ──▶ check-in code
        │
        │ (or) buyer never pays ──▶ Redis TTL expires ──▶ seat FREE again</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A buyer can register, log in, and receive a JWT</td><td>POST /auth/register then /auth/login returns a token</td></tr>
<tr><td>2</td><td>A buyer sees only AVAILABLE seats of an event</td><td>GET /events/{id}/seats?status=AVAILABLE</td></tr>
<tr><td>3</td><td>Holding a free seat succeeds and blocks others for the TTL</td><td>POST /seats/{id}/hold → 200; a second hold → 409</td></tr>
<tr><td>4</td><td><b>A seat is never sold twice under a stampede</b></td><td>1000 concurrent holds for one seat → exactly one success</td></tr>
<tr><td>5</td><td>An unpaid hold expires and frees the seat</td><td>wait past the TTL → the seat is holdable again</td></tr>
<tr><td>6</td><td>Only an ORGANIZER can create events / check in</td><td>a BUYER calling those endpoints → 403</td></tr>
<tr><td>7</td><td>The whole system runs from one <code>docker compose up</code></td><td>api on :4000, db and redis healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> A real payment gateway, real seat-map rendering with a graphical picker, email/SMS delivery of tickets, refunds and partial cancellations. Mock the payment with a delay + a coin flip. Depth on the flash-sale core scores; breadth with nothing finished does not.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 6). "Definition of Done = the tests are green" removes every argument about whether a feature works — and row 4 becomes the concurrency test that is the heart of your defence. <em>Why beyond syllabus: turning a checklist into executable specs is exactly how professional teams gate a release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một lõi flash-sale, vài endpoint</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NGƯỜI MUA</span><span class="v">Đăng ký/đăng nhập · duyệt sự kiện · giữ một ghế trống · thanh toán (giả lập) trong cửa sổ giữ chỗ · nhận mã check-in · xem vé của mình</span></div>
  <div class="kv"><span class="k">BAN TỔ CHỨC</span><span class="v">Đăng nhập · tạo sự kiện và các ghế · xem doanh số trực tiếp · check-in một vé ở cửa bằng mã</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">NGƯỜI MUA giữ ghế TRỐNG ──▶ POST /seats/:id/hold ──▶ Redis SET NX (giữ 120s)
        │                                                     │
        │ 999 người khác bấm ĐÚNG ghế đó ──▶ 409 Conflict ────┘  (bị chặn: chỉ 1 lượt giữ thắng)
        ▼
NGƯỜI MUA thanh toán ──▶ POST /orders (xác nhận) ──▶ INSERT order UNIQUE(seat_id) ──▶ ghế SOLD ──▶ mã check-in
        │
        │ (hoặc) không thanh toán ──▶ Redis TTL hết hạn ──▶ ghế TRỐNG trở lại</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Người mua đăng ký, đăng nhập, nhận JWT</td><td>POST /auth/register rồi /auth/login trả token</td></tr>
<tr><td>2</td><td>Người mua chỉ thấy ghế AVAILABLE của sự kiện</td><td>GET /events/{id}/seats?status=AVAILABLE</td></tr>
<tr><td>3</td><td>Giữ một ghế trống thành công và chặn người khác trong TTL</td><td>POST /seats/{id}/hold → 200; lượt giữ thứ hai → 409</td></tr>
<tr><td>4</td><td><b>Một ghế không bao giờ bị bán hai lần khi bị giẫm đạp</b></td><td>1000 lượt giữ đồng thời cho một ghế → đúng một thành công</td></tr>
<tr><td>5</td><td>Một lượt giữ chưa trả tiền sẽ hết hạn và trả lại ghế</td><td>đợi quá TTL → ghế có thể giữ lại</td></tr>
<tr><td>6</td><td>Chỉ BAN TỔ CHỨC được tạo sự kiện / check-in</td><td>NGƯỜI MUA gọi các endpoint đó → 403</td></tr>
<tr><td>7</td><td>Cả hệ chạy từ một lệnh <code>docker compose up</code></td><td>api ở :4000, db và redis healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Cổng thanh toán thật, vẽ sơ đồ ghế đồ hoạ có bộ chọn, gửi vé qua email/SMS, hoàn tiền và huỷ một phần. Hãy giả lập thanh toán bằng một độ trễ + một phép tung đồng xu. Sâu ở lõi flash-sale mới ăn điểm; ôm rộng mà chẳng xong thì không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 6). "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc một tính năng có chạy hay không — và dòng 4 trở thành test đồng thời chính là trái tim của buổi bảo vệ. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int606-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Express + PostgreSQL + Redis — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Each choice below is picked because it is <strong>what you already learned</strong> (WED201c, DBI202, JavaScript) and because it is the mainstream combo for a Node internship — and specifically because <strong>the problem needs two different stores</strong>.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Runtime &amp; API — Node.js + Express</b><br/>A minimal, ubiquitous HTTP framework. Routes → middleware → services. <em>Why: JavaScript end-to-end, huge ecosystem, and non-blocking I/O suits a flash sale of many short requests.</em></div>
  <div class="lz-layer"><b>Durable store — PostgreSQL (via <code>pg</code>)</b><br/>The source of truth: events, seats, and paid orders. <em>Why: ACID transactions and a UNIQUE constraint are what make "sold twice" impossible once money is taken; Postgres is the industry default.</em></div>
  <div class="lz-layer"><b>Coordination store — Redis (via node-redis)</b><br/>A single-threaded in-memory server. Holds the short-lived seat locks. <em>Why: <code>SET NX</code> is atomic, a TTL auto-expires an abandoned hold, and it answers in microseconds — perfect for the hot path of a stampede.</em></div>
  <div class="lz-layer"><b>Auth — JWT</b><br/>Stateless tokens carry the user id + role. <em>Why: no server session store to scale during a spike.</em></div>
  <div class="lz-layer"><b>Ship — Docker Compose</b><br/>Three containers (api, db, redis) started by one command. <em>Why: "runs on my machine" becomes "runs anywhere"; graders love a one-command demo.</em></div>
</div>

<h3>Why TWO stores — the key design insight</h3>
<div class="diagram">Redis  = the FAST GATE     : who is allowed to try to buy seat 42 right now?
                             one winner per seat, auto-expires, microseconds.
Postgres = the LEDGER       : who actually OWNS a paid ticket for seat 42, forever?
                             ACID, UNIQUE(seat_id), survives a restart.
Rule: hold in Redis first (cheap, fast), commit the sale in Postgres (durable, final).</div>

<h3>The request journey — how a click becomes a ticket</h3>
<div class="diagram">Click "Buy"  →  fetch POST /api/seats/42/hold  (JWT in header)
   →  auth middleware validates JWT
   →  seatService.hold(42, buyerId)   →  Redis SET NX hold:seat:42 EX 120
   →  200 { holdExpiresInMs }  →  UI starts a 2:00 countdown
   →  Click "Pay"  →  POST /api/orders  →  mock payment
   →  BEGIN; INSERT order (UNIQUE seat_id); UPDATE seat SOLD; COMMIT
   →  DEL hold:seat:42  →  201 { checkinCode }</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A stack is a set of trade-offs, not a fashion.</b> You could swap Express for Fastify, or node-redis for ioredis, or use Prisma instead of raw <code>pg</code> — the architecture would be identical: a fast atomic gate in front of a durable ledger. Reviewers respect a student who can say "I chose X over Y because…". <em>Why beyond syllabus: the syllabus teaches one stack; real engineering is choosing among many for reasons.</em></div>

<a class="link-card codelab" href="/code-lab/redis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-423" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Redis core data structures on Code Lab</span><span class="lc-sub">Strings, keys and commands — the store behind your seat holds.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì đó là <strong>thứ bạn đã học</strong> (WED201c, DBI202, JavaScript) và là combo chủ đạo cho một kỳ thực tập Node — và đặc biệt vì <strong>bài toán cần hai kho lưu khác nhau</strong>.</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Runtime &amp; API — Node.js + Express</b><br/>Một framework HTTP tối giản, phổ biến. Route → middleware → service. <em>Vì sao: JavaScript xuyên suốt, hệ sinh thái khổng lồ, và I/O không chặn hợp với một flash sale gồm nhiều request ngắn.</em></div>
  <div class="lz-layer"><b>Kho bền — PostgreSQL (qua <code>pg</code>)</b><br/>Nguồn sự thật: sự kiện, ghế, và đơn đã thanh toán. <em>Vì sao: transaction ACID và ràng buộc UNIQUE chính là thứ khiến "bán hai lần" không thể xảy ra một khi đã thu tiền; Postgres là mặc định của ngành.</em></div>
  <div class="lz-layer"><b>Kho điều phối — Redis (qua node-redis)</b><br/>Một server in-memory đơn luồng. Giữ các khoá ghế ngắn hạn. <em>Vì sao: <code>SET NX</code> là nguyên tử, một TTL tự hết hạn một lượt giữ bị bỏ dở, và nó trả lời trong micro-giây — hoàn hảo cho đường nóng của một cơn giẫm đạp.</em></div>
  <div class="lz-layer"><b>Xác thực — JWT</b><br/>Token stateless mang user id + role. <em>Vì sao: không có kho session ở server phải mở rộng khi có cú spike.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker Compose</b><br/>Ba container (api, db, redis) khởi động bằng một lệnh. <em>Vì sao: "chạy trên máy tôi" thành "chạy ở mọi nơi"; giám khảo thích demo một lệnh.</em></div>
</div>

<h3>Vì sao HAI kho — chốt thiết kế quan trọng</h3>
<div class="diagram">Redis  = CỔNG NHANH       : ai được PHÉP thử mua ghế 42 ngay lúc này?
                            một người thắng mỗi ghế, tự hết hạn, micro-giây.
Postgres = SỔ CÁI          : ai thực sự SỞ HỮU vé đã trả tiền cho ghế 42, mãi mãi?
                            ACID, UNIQUE(seat_id), sống sót qua khởi động lại.
Quy tắc: giữ chỗ ở Redis trước (rẻ, nhanh), chốt bán ở Postgres (bền, cuối cùng).</div>

<h3>Hành trình một request — một cú click thành một tấm vé</h3>
<div class="diagram">Bấm "Mua"  →  fetch POST /api/seats/42/hold  (JWT trong header)
   →  middleware auth kiểm JWT
   →  seatService.hold(42, buyerId)   →  Redis SET NX hold:seat:42 EX 120
   →  200 { holdExpiresInMs }  →  UI bắt đầu đếm ngược 2:00
   →  Bấm "Thanh toán"  →  POST /api/orders  →  thanh toán giả lập
   →  BEGIN; INSERT order (UNIQUE seat_id); UPDATE seat SOLD; COMMIT
   →  DEL hold:seat:42  →  201 { checkinCode }</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một stack là tập hợp các đánh đổi, không phải mốt thời trang.</b> Bạn có thể thay Express bằng Fastify, node-redis bằng ioredis, hay dùng Prisma thay cho <code>pg</code> thô — kiến trúc vẫn y hệt: một cổng nguyên tử nhanh đứng trước một sổ cái bền. Hội đồng nể một sinh viên biết nói "tôi chọn X thay vì Y vì…". <em>Vì sao ngoài syllabus: giáo trình dạy một stack; kỹ nghệ thật là chọn giữa nhiều lựa chọn có lý do.</em></div>

<a class="link-card codelab" href="/code-lab/redis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-423" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Cấu trúc dữ liệu lõi Redis trên Code Lab</span><span class="lc-sub">String, key và command — kho đứng sau các lượt giữ ghế của bạn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int606-cai-dat',
          type: 'VIDEO',
          description: 'Node.js, VS Code, Docker (Postgres + Redis), redis-cli, Postman — cài một lần, dùng cả đồ án. Hướng dẫn chi tiết ở Exp Hub.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your environment</h2>
<p class="lead">Install everything once, before you write a line of code. Verify each tool from the terminal so you never lose an afternoon to a missing Redis.</p>

<h3>The checklist</h3>
<table>
<thead><tr><th>Tool</th><th>Why</th><th>Verify command</th></tr></thead>
<tbody>
<tr><td>Node.js LTS + npm</td><td>run Express &amp; the tests</td><td><code>node -v</code> → 20.x</td></tr>
<tr><td>VS Code</td><td>the editor (+ REST Client)</td><td>opens the project</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + Redis + one-command ship</td><td><code>docker --version</code></td></tr>
<tr><td>redis-cli</td><td>inspect holds &amp; TTLs live</td><td><code>redis-cli ping</code> → PONG</td></tr>
<tr><td>Postman / REST Client</td><td>test the API without a UI</td><td>send a GET</td></tr>
<tr><td>Git + a GitHub repo</td><td>team workflow</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Fastest Postgres + Redis:</strong> don't install them — run both in Docker. <code>docker run --name tix-db -e POSTGRES_PASSWORD=tix -e POSTGRES_DB=tix -p 5432:5432 -d postgres:16</code> and <code>docker run --name tix-redis -p 6379:6379 -d redis:7</code>. Two commands, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int606-cai-dat-moi-truong?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">Node.js, VS Code, Docker Desktop, redis-cli, Postman — official links and a verify checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> forgetting Redis is a separate service. The api needs BOTH <code>DATABASE_URL</code> and <code>REDIS_URL</code>. If holds silently do nothing, check <code>redis-cli ping</code> returns <code>PONG</code> and that your app connected — a common first-day error is the api starting before Redis is up.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt môi trường</h2>
<p class="lead">Cài hết một lần, trước khi viết một dòng code. Kiểm từng công cụ từ terminal để không mất cả buổi chiều vì thiếu Redis.</p>

<h3>Danh sách cần cài</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Lệnh kiểm</th></tr></thead>
<tbody>
<tr><td>Node.js LTS + npm</td><td>chạy Express &amp; test</td><td><code>node -v</code> → 20.x</td></tr>
<tr><td>VS Code</td><td>trình soạn (+ REST Client)</td><td>mở được dự án</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + Redis + ship một lệnh</td><td><code>docker --version</code></td></tr>
<tr><td>redis-cli</td><td>soi hold &amp; TTL trực tiếp</td><td><code>redis-cli ping</code> → PONG</td></tr>
<tr><td>Postman / REST Client</td><td>test API không cần UI</td><td>gửi một GET</td></tr>
<tr><td>Git + một repo GitHub</td><td>quy trình nhóm</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Postgres + Redis nhanh nhất:</strong> đừng cài — chạy cả hai trong Docker. <code>docker run --name tix-db -e POSTGRES_PASSWORD=tix -e POSTGRES_DB=tix -p 5432:5432 -d postgres:16</code> và <code>docker run --name tix-redis -p 6379:6379 -d redis:7</code>. Hai lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int606-cai-dat-moi-truong?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">Node.js, VS Code, Docker Desktop, redis-cli, Postman — link chính chủ và checklist kiểm trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> quên rằng Redis là một dịch vụ riêng. api cần CẢ <code>DATABASE_URL</code> lẫn <code>REDIS_URL</code>. Nếu các lượt giữ chỗ lặng lẽ không có tác dụng, kiểm <code>redis-cli ping</code> trả <code>PONG</code> và app đã kết nối chưa — lỗi ngày đầu thường gặp là api khởi động trước khi Redis lên.</div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int606-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng mua, "khoảnh khắc flash-sale 1000 người", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the one thing that is hard: <strong>a thousand buyers hit one seat and exactly one ticket is sold — live, on camera</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is a ticketing API. Two roles, and under a flash sale it cannot sell one seat twice. Let me show you." Show the two-store architecture picture from 0.3.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Buyer flow (2m)</div><div class="lz-nsub">Register → login (show the JWT) → open an event → see AVAILABLE seats → hold one → the 2:00 countdown starts → pay → get a check-in code.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — The money shot (2m)</div><div class="lz-nsub">Run the concurrency test: 1000 buyers, one seat, at once. Terminal prints "ok=1, conflict=999". Then <code>redis-cli</code> shows the single hold key and its TTL, and a SELECT shows exactly one row in <code>orders</code>. Proof, three ways.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:30 — Expiry &amp; organizer (1.5m)</div><div class="lz-nsub">Hold a seat, do NOT pay, watch the TTL count down in <code>redis-cli</code> to 0 → the seat is holdable again. Then log in as organizer → see live sales → check in a ticket by its code.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">6:00 — Under the hood (1m)</div><div class="lz-nsub">One command: <code>docker compose up</code>. Show the Lua hold script, the <code>UNIQUE(seat_id)</code>, the confirm transaction. Explain in one sentence why a seat cannot be sold twice.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Close (30s)</div><div class="lz-nsub">"Stack: Node, Express, PostgreSQL, Redis, Docker. Repo link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (an event with named seats). Increase your terminal/editor font size. Do one dry run of the concurrency test so the numbers land. Record in 1080p. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The demo is a product, not an afterthought.</b> Interviewers watch the first 60 seconds and the "hard part". Lead with the two-store architecture and end with the 1000-buyer proof — that ordering signals engineering maturity far more than a tour of every CRUD screen. <em>Why beyond syllabus: communication of your work is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD and a schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng thứ khó: <strong>một nghìn người mua bấm một ghế và đúng một vé được bán — ngay trên video</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là một API bán vé. Hai vai trò, và khi flash sale không thể bán một ghế hai lần. Để tôi cho xem." Chiếu bức tranh kiến trúc hai kho ở bài 0.3.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng người mua (2m)</div><div class="lz-nsub">Đăng ký → đăng nhập (chỉ JWT) → mở một sự kiện → thấy ghế AVAILABLE → giữ một ghế → đồng hồ 2:00 chạy → thanh toán → nhận mã check-in.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — Cảnh đắt giá (2m)</div><div class="lz-nsub">Chạy test đồng thời: 1000 người mua, một ghế, cùng lúc. Terminal in "ok=1, conflict=999". Rồi <code>redis-cli</code> cho thấy đúng một key hold và TTL của nó, và một SELECT cho thấy đúng một dòng trong <code>orders</code>. Bằng chứng, ba cách.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:30 — Hết hạn &amp; ban tổ chức (1.5m)</div><div class="lz-nsub">Giữ một ghế, KHÔNG trả tiền, xem TTL đếm ngược trong <code>redis-cli</code> về 0 → ghế có thể giữ lại. Rồi đăng nhập ban tổ chức → xem doanh số trực tiếp → check-in một vé bằng mã.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">6:00 — Bên trong (1m)</div><div class="lz-nsub">Một lệnh: <code>docker compose up</code>. Chiếu script Lua giữ chỗ, <code>UNIQUE(seat_id)</code>, transaction xác nhận. Giải thích một câu vì sao một ghế không thể bán hai lần.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Kết (30s)</div><div class="lz-nsub">"Stack: Node, Express, PostgreSQL, Redis, Docker. Link repo trên màn hình. Cảm ơn." Chạy URL GitHub.</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed dữ liệu demo trước (một sự kiện với các ghế có tên). Tăng cỡ chữ terminal/editor. Quay thử test đồng thời một lần để con số ra đẹp. Quay 1080p. Nếu hỏng, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Demo là một sản phẩm, không phải thứ làm cho có.</b> Nhà tuyển dụng xem 60 giây đầu và "phần khó". Mở bằng kiến trúc hai kho và kết bằng bằng chứng 1000 người mua — thứ tự đó thể hiện sự trưởng thành kỹ thuật hơn nhiều so với đi tua từng màn CRUD. <em>Vì sao ngoài syllabus: khả năng trình bày công việc bị chấm ngầm ở khắp sự nghiệp, nhưng hiếm khi được dạy rõ.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến hai vai trò thành ERD và schema.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design|||Mục 1 — Thiết kế domain & CSDL',
      description: 'Biến hai vai trò thành use case, ERD và một schema chuẩn hoá — với ràng buộc UNIQUE là trái tim chống bán ghế hai lần.',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int606-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, Event, Seat, Order và quan hệ giữa chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"A <b>buyer</b> buys a <b>seat</b> of an <b>event</b>, creating an <b>order</b>; an <b>organizer</b> creates the event and checks tickets in." The nouns give us three core entities plus the account:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (BUYER or ORGANIZER), email, password hash. Both roles are Users; role decides permissions.</div>
  <div class="lz-layer"><b>Event</b> — a show at a venue at a time, owned by an organizer: <code>organizer_id</code>, <code>title</code>, <code>venue</code>, <code>starts_at</code>. An event <em>has many</em> seats.</div>
  <div class="lz-layer"><b>Seat</b> — a specific sellable place at an event: <code>event_id</code>, <code>seat_label</code> (e.g. A-12), <code>price_cents</code>, <code>status</code> (AVAILABLE / SOLD). This is the resource that must never be sold twice.</div>
  <div class="lz-layer"><b>Order</b> — the purchase itself: which <code>buyer</code> bought which <code>seat</code>, its <code>status</code> (PENDING / PAID / CANCELLED), a unique <code>checkin_code</code>, and when it was created.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────┐        ┌──────────┐        ┌──────────┐        ┌──────────┐
│   User   │1──────*│  Event   │1──────*│   Seat   │1──────1│  Order   │
│(ORGANIZER)│       └──────────┘        └──────────┘        └──────────┘
└──────────┘                                                     *│
                                                                  │1
                                                            ┌──────────┐
                                                            │   User   │ (role = BUYER)
                                                            └──────────┘

User(ORGANIZER) 1—* Event : an organizer owns many events
Event 1—* Seat            : an event has many seats
Seat  1—1 Order           : a seat holds at most ONE paid order  ← the rule
User(BUYER) 1—* Order     : a buyer has many orders</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> Organizer Mai creates "Indie Night" with seats A-1..A-3. Buyer An buys A-1.
<b>Step 1 —</b> An holds A-1, then sends POST /orders { seatId: A-1 } and pays.
<b>Step 2 —</b> The system creates an Order row: buyer=An, seat=A-1, status=PAID, checkin_code=TIX-7F3K.
<b>Step 3 —</b> Seat A-1 flips status AVAILABLE → SOLD.
<b>Step 4 —</b> Buyer Binh now asks for "Indie Night" available seats → gets only A-2 and A-3 (A-1 is gone).
<b>Result:</b> the 1—1 between Seat and a paid Order is what makes A-1 disappear for Binh.</div>

<div class="pitfall"><strong>Design trap:</strong> putting <code>buyer_id</code> directly on <code>Seat</code> and skipping the Order table. Then you cannot store a check-in code, payment status, or purchase history — and a refunded-then-resold seat loses its past. Keep the purchase as its own entity.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"At most one PAID order per seat" is a state constraint, not just a foreign key.</b> A seat can have many order rows over time (one paid, cancelled, then resold) — the invariant is only one <em>active</em> at a time. In 1.2 we enforce the simple version with a UNIQUE on <code>seat_id</code>; the richer version uses a partial unique index over active statuses. <em>Why beyond syllabus: distinguishing "unique row" from "unique active state" is a modelling skill most juniors miss.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">API design on Code Lab</span><span class="lc-sub">Resource modelling, URLs and status codes — the shape your entities expose.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>người mua</b> mua một <b>ghế</b> của một <b>sự kiện</b>, tạo ra một <b>đơn hàng</b>; một <b>ban tổ chức</b> tạo sự kiện và check-in vé." Các danh từ cho ta ba thực thể lõi cộng với tài khoản:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (BUYER hoặc ORGANIZER), email, hash mật khẩu. Cả hai vai trò đều là User; role quyết định quyền.</div>
  <div class="lz-layer"><b>Event</b> — một buổi diễn ở một địa điểm vào một thời điểm, thuộc một ban tổ chức: <code>organizer_id</code>, <code>title</code>, <code>venue</code>, <code>starts_at</code>. Một sự kiện <em>có nhiều</em> ghế.</div>
  <div class="lz-layer"><b>Seat</b> — một chỗ ngồi bán được cụ thể của sự kiện: <code>event_id</code>, <code>seat_label</code> (vd A-12), <code>price_cents</code>, <code>status</code> (AVAILABLE / SOLD). Đây là tài nguyên không được phép bán hai lần.</div>
  <div class="lz-layer"><b>Order</b> — chính lượt mua: <code>buyer</code> nào mua <code>seat</code> nào, <code>status</code> của nó (PENDING / PAID / CANCELLED), một <code>checkin_code</code> duy nhất, và thời điểm tạo.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────┐        ┌──────────┐        ┌──────────┐        ┌──────────┐
│   User   │1──────*│  Event   │1──────*│   Seat   │1──────1│  Order   │
│(BAN T/C) │        └──────────┘        └──────────┘        └──────────┘
└──────────┘                                                     *│
                                                                  │1
                                                            ┌──────────┐
                                                            │   User   │ (role = BUYER)
                                                            └──────────┘

User(BAN T/C) 1—* Event : một ban tổ chức sở hữu nhiều sự kiện
Event 1—* Seat          : một sự kiện có nhiều ghế
Seat  1—1 Order         : một ghế giữ TỐI ĐA MỘT đơn đã trả tiền  ← quy tắc
User(BUYER) 1—* Order   : một người mua có nhiều đơn</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> Ban tổ chức Mai tạo "Indie Night" với ghế A-1..A-3. Người mua An mua A-1.
<b>Bước 1 —</b> An giữ A-1, rồi gửi POST /orders { seatId: A-1 } và thanh toán.
<b>Bước 2 —</b> Hệ thống tạo một dòng Order: buyer=An, seat=A-1, status=PAID, checkin_code=TIX-7F3K.
<b>Bước 3 —</b> Ghế A-1 đổi status AVAILABLE → SOLD.
<b>Bước 4 —</b> Người mua Bình giờ hỏi ghế trống của "Indie Night" → chỉ còn A-2 và A-3 (A-1 đã mất).
<b>Kết quả:</b> quan hệ 1—1 giữa Seat và một Order đã trả tiền chính là thứ khiến A-1 biến mất với Bình.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> đặt thẳng <code>buyer_id</code> lên <code>Seat</code> và bỏ bảng Order. Khi đó bạn không lưu được mã check-in, trạng thái thanh toán, hay lịch sử mua — và một ghế bị-hoàn-rồi-bán-lại mất quá khứ. Hãy giữ lượt mua là một thực thể riêng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Tối đa một đơn ĐÃ TRẢ TIỀN mỗi ghế" là ràng buộc trạng thái, không chỉ là khoá ngoại.</b> Một ghế có thể có nhiều dòng order theo thời gian (một cái trả tiền, huỷ, rồi bán lại) — bất biến là chỉ một cái <em>đang hoạt động</em> tại một thời điểm. Ở 1.2 ta thực thi phiên bản đơn giản bằng UNIQUE trên <code>seat_id</code>; phiên bản đầy đủ dùng partial unique index trên các trạng thái hoạt động. <em>Vì sao ngoài syllabus: phân biệt "dòng duy nhất" với "trạng thái hoạt động duy nhất" là kỹ năng mô hình hoá đa số junior bỏ sót.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">API design trên Code Lab</span><span class="lc-sub">Mô hình hoá tài nguyên, URL và status code — hình dạng mà các entity phơi ra.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The schema & the constraint that prevents selling a seat twice|||1.2 — Schema & ràng buộc chống bán ghế hai lần',
          slug: 'int606-schema',
          type: 'VIDEO',
          description: 'DDL PostgreSQL đầy đủ + ràng buộc UNIQUE trên seat_id: hàng rào cuối cùng chống bán trùng, do CSDL bảo đảm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The schema &amp; the constraint that prevents selling a seat twice</h2>
<p class="lead">Here is the whole database. Notice one line — the <code>UNIQUE</code> on <code>orders.seat_id</code>. That single constraint is your <strong>last line of defence</strong>: even if two payments slip past Redis and every check in your Node code, PostgreSQL itself refuses to write two active orders for one seat.</p>

<h3>The DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- bcrypt hash</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- BUYER | ORGANIZER</span>
);

<span class="tok-keyword">CREATE TABLE</span> events (
  id           <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  organizer_id <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  title        <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  venue        <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  starts_at    <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL</span>
);

<span class="tok-keyword">CREATE TABLE</span> seats (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  event_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> events(id),
  seat_label  <span class="tok-type">VARCHAR</span>(20) <span class="tok-keyword">NOT NULL</span>,
  price_cents <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,
  status      <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'AVAILABLE'</span>, <span class="tok-comment">-- AVAILABLE | SOLD</span>
  <span class="tok-keyword">UNIQUE</span> (event_id, seat_label)              <span class="tok-comment">-- no two seats with the same label in one event</span>
);

<span class="tok-keyword">CREATE TABLE</span> orders (
  id           <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  seat_id      <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> seats(id),
  buyer_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  status       <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'PAID'</span>, <span class="tok-comment">-- PENDING|PAID|CANCELLED</span>
  checkin_code <span class="tok-type">VARCHAR</span>(20) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  created_at   <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  <span class="tok-keyword">CONSTRAINT</span> uq_active_seat <span class="tok-keyword">UNIQUE</span> (seat_id)     <span class="tok-comment">-- ★ one order per seat</span>
);</pre>

<h3>Worked example — why the UNIQUE is the real guard</h3>
<div class="out"><b>Scenario:</b> two INSERTs for seat_id = 42 arrive at the same millisecond (both slipped past Redis).
<b>Step 1 —</b> Transaction A: INSERT order (seat_id=42) → row locked, not yet committed.
<b>Step 2 —</b> Transaction B: INSERT order (seat_id=42) → PostgreSQL sees the pending unique key → <b>B waits</b>.
<b>Step 3 —</b> A commits. The unique key (seat_id=42) now exists.
<b>Step 4 —</b> B is released → its INSERT violates <code>uq_active_seat</code> → <b>ERROR 23505: duplicate key value violates unique constraint</b>.
<b>Result:</b> exactly one order exists. Your Node code catches the <code>23505</code> and returns <b>409 Conflict</b>. The database, not your <code>if</code>-statement, is what guarantees correctness.</div>

<div class="pitfall"><strong>Trap:</strong> relying only on a check like <code>if (seat.status === 'AVAILABLE')</code>. Between your read and your write, another request can read the same AVAILABLE status — the classic <em>race condition</em>. The check is a fast path for the common case; the UNIQUE constraint is the guarantee. Redis narrows the window; the constraint closes it. You need all three. Section 4 shows the full defence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The richer rule with a partial index.</b> To allow a cancelled order to let the seat be resold while still forbidding two <em>active</em> orders, drop the plain UNIQUE and use:
<pre><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_order
  <span class="tok-keyword">ON</span> orders (seat_id)
  <span class="tok-keyword">WHERE</span> status <span class="tok-keyword">IN</span> (<span class="tok-string">'PENDING'</span>, <span class="tok-string">'PAID'</span>);</pre>
Now a seat can have one CANCELLED row plus one active row. <em>Why beyond syllabus: partial (filtered) indexes are a Postgres power feature that models "unique among active rows" — exactly the state constraint from 1.1.</em></div>

<a class="link-card codelab" href="/code-lab/postgresql?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-865" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Modifying data &amp; transactions on Code Lab</span><span class="lc-sub">INSERT, UPDATE and BEGIN/COMMIT — the SQL under your orders.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Schema &amp; ràng buộc chống bán ghế hai lần</h2>
<p class="lead">Đây là toàn bộ CSDL. Chú ý một dòng — <code>UNIQUE</code> trên <code>orders.seat_id</code>. Ràng buộc đơn lẻ đó là <strong>hàng rào cuối cùng</strong>: kể cả khi hai lần thanh toán lọt qua Redis và mọi kiểm tra trong code Node, chính PostgreSQL từ chối ghi hai đơn hoạt động cho một ghế.</p>

<h3>DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- hash bcrypt</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- BUYER | ORGANIZER</span>
);

<span class="tok-keyword">CREATE TABLE</span> events (
  id           <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  organizer_id <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  title        <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  venue        <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  starts_at    <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL</span>
);

<span class="tok-keyword">CREATE TABLE</span> seats (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  event_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> events(id),
  seat_label  <span class="tok-type">VARCHAR</span>(20) <span class="tok-keyword">NOT NULL</span>,
  price_cents <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,
  status      <span class="tok-type">VARCHAR</span>(10) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'AVAILABLE'</span>, <span class="tok-comment">-- AVAILABLE | SOLD</span>
  <span class="tok-keyword">UNIQUE</span> (event_id, seat_label)              <span class="tok-comment">-- không hai ghế cùng nhãn trong một sự kiện</span>
);

<span class="tok-keyword">CREATE TABLE</span> orders (
  id           <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  seat_id      <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> seats(id),
  buyer_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  status       <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'PAID'</span>, <span class="tok-comment">-- PENDING|PAID|CANCELLED</span>
  checkin_code <span class="tok-type">VARCHAR</span>(20) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  created_at   <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  <span class="tok-keyword">CONSTRAINT</span> uq_active_seat <span class="tok-keyword">UNIQUE</span> (seat_id)     <span class="tok-comment">-- ★ một đơn mỗi ghế</span>
);</pre>

<h3>Ví dụ có lời giải — vì sao UNIQUE mới là người gác thật</h3>
<div class="out"><b>Tình huống:</b> hai INSERT cho seat_id = 42 tới cùng một mili-giây (cả hai đã lọt qua Redis).
<b>Bước 1 —</b> Giao dịch A: INSERT order (seat_id=42) → dòng bị khoá, chưa commit.
<b>Bước 2 —</b> Giao dịch B: INSERT order (seat_id=42) → PostgreSQL thấy khoá unique đang chờ → <b>B đợi</b>.
<b>Bước 3 —</b> A commit. Khoá unique (seat_id=42) giờ tồn tại.
<b>Bước 4 —</b> B được thả → INSERT của nó vi phạm <code>uq_active_seat</code> → <b>ERROR 23505: duplicate key value violates unique constraint</b>.
<b>Kết quả:</b> đúng một đơn tồn tại. Code Node của bạn bắt mã <code>23505</code> và trả <b>409 Conflict</b>. Chính CSDL, không phải câu <code>if</code>, mới bảo đảm tính đúng.</div>

<div class="pitfall"><strong>Bẫy:</strong> chỉ dựa vào một kiểm tra kiểu <code>if (seat.status === 'AVAILABLE')</code>. Giữa lúc bạn đọc và lúc bạn ghi, một request khác có thể đọc cùng trạng thái AVAILABLE — đây là <em>race condition</em> kinh điển. Kiểm tra là đường nhanh cho trường hợp thường; ràng buộc UNIQUE là sự bảo đảm. Redis thu hẹp cửa sổ; ràng buộc đóng nó lại. Cần cả ba. Mục 4 chỉ cách phòng thủ đầy đủ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy tắc đầy đủ với partial index.</b> Để cho phép một đơn đã huỷ để ghế được bán lại mà vẫn cấm hai đơn <em>đang hoạt động</em>, bỏ UNIQUE thường và dùng:
<pre><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_order
  <span class="tok-keyword">ON</span> orders (seat_id)
  <span class="tok-keyword">WHERE</span> status <span class="tok-keyword">IN</span> (<span class="tok-string">'PENDING'</span>, <span class="tok-string">'PAID'</span>);</pre>
Giờ một ghế có thể có một dòng CANCELLED cộng một dòng hoạt động. <em>Vì sao ngoài syllabus: partial (filtered) index là tính năng mạnh của Postgres mô hình hoá "duy nhất giữa các dòng hoạt động" — chính là ràng buộc trạng thái ở 1.1.</em></div>

<a class="link-card codelab" href="/code-lab/postgresql?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-865" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Sửa dữ liệu &amp; transaction trên Code Lab</span><span class="lc-sub">INSERT, UPDATE và BEGIN/COMMIT — phần SQL nằm dưới các đơn hàng.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int606-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, cardinality và ràng buộc chống bán ghế hai lần.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which entity must never be sold twice, and where does the durable guarantee live?|||Thực thể nào không được bán hai lần, và sự bảo đảm bền nằm ở đâu?',
                options: [
                  'Event; guaranteed by a Node if-check|||Event; bảo đảm bằng câu if trong Node',
                  'Seat; guaranteed by a UNIQUE constraint in the database|||Seat; bảo đảm bằng ràng buộc UNIQUE trong CSDL',
                  'User; guaranteed by JWT|||User; bảo đảm bằng JWT',
                  'Order; guaranteed by the client|||Order; bảo đảm bằng client',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The relationship "an event has many seats" is which cardinality?|||Quan hệ "một sự kiện có nhiều ghế" là lực lượng nào?',
                options: ['1—1', '1—* (one-to-many)|||1—* (một-nhiều)', '*—* (many-to-many)|||*—* (nhiều-nhiều)', '0—0'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why keep Order as its own table instead of putting buyer_id on Seat?|||Vì sao giữ Order là bảng riêng thay vì đặt buyer_id lên Seat?',
                options: [
                  'It is faster to query|||Truy vấn nhanh hơn',
                  'To store the check-in code, payment status and purchase history|||Để lưu mã check-in, trạng thái thanh toán và lịch sử mua',
                  'pg requires it|||pg bắt buộc',
                  'To avoid using a foreign key|||Để tránh dùng khoá ngoại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Two INSERTs hit the same seat_id at once with a UNIQUE(seat_id). What happens?|||Hai INSERT cùng seat_id một lúc với UNIQUE(seat_id). Điều gì xảy ra?',
                options: [
                  'Both succeed|||Cả hai thành công',
                  'Both fail|||Cả hai thất bại',
                  'Exactly one commits; the other violates the constraint (error 23505) and is rejected|||Đúng một cái commit; cái kia vi phạm ràng buộc (lỗi 23505) và bị từ chối',
                  'The database crashes|||CSDL sập',
                ], correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) A partial unique index WHERE status IN (PENDING, PAID) lets you…|||(Ngoài giáo trình) Partial unique index WHERE status IN (PENDING, PAID) cho phép bạn…',
                options: [
                  'Sell two active seats at once|||Bán hai ghế hoạt động cùng lúc',
                  'Resell a seat after its earlier order was cancelled, while still forbidding two active orders|||Bán lại một ghế sau khi đơn trước đã huỷ, mà vẫn cấm hai đơn đang hoạt động',
                  'Skip the foreign key|||Bỏ khoá ngoại',
                  'Store passwords|||Lưu mật khẩu',
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
      description: 'Khởi tạo dự án Express, nối pg + Redis, và xây một lát cắt dọc "GET ghế trống" qua route→service→repository.',
      lessons: [
        {
          title: '2.1 — Project setup & the layered architecture|||2.1 — Khởi tạo dự án & kiến trúc phân lớp',
          slug: 'int606-backend-setup',
          type: 'VIDEO',
          description: 'npm init, cấu hình env, kết nối pg + Redis, và ba lớp Route / Service / Repository — mỗi lớp một trách nhiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.1</span>
<h2>Project setup &amp; the layered architecture</h2>
<p class="lead">Scaffold with <code>npm init -y</code> and install <b>express, pg, redis, jsonwebtoken, bcrypt, zod, dotenv</b>. Then wire two connections — one to Postgres, one to Redis — and split your code into three layers so the flash-sale logic stays testable.</p>

<h3>Config &amp; the two connections</h3>
<pre><span class="tok-comment">// src/db.js — one pooled Postgres client</span>
<span class="tok-keyword">import</span> pg <span class="tok-keyword">from</span> <span class="tok-string">'pg'</span>;
<span class="tok-keyword">export const</span> pool = <span class="tok-keyword">new</span> pg.Pool({
  connectionString: process.env.DATABASE_URL
    ?? <span class="tok-string">'postgres://postgres:tix@localhost:5432/tix'</span>,
});

<span class="tok-comment">// src/redis.js — one shared Redis client</span>
<span class="tok-keyword">import</span> { createClient } <span class="tok-keyword">from</span> <span class="tok-string">'redis'</span>;
<span class="tok-keyword">export const</span> redis = createClient({
  url: process.env.REDIS_URL ?? <span class="tok-string">'redis://localhost:6379'</span>,
});
<span class="tok-keyword">await</span> redis.connect();</pre>
<p>Both read an environment variable with a local default — the same values will come from Docker in Section 7, with no code change.</p>

<h3>The three layers — one responsibility each</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route</b> (an Express handler) — HTTP only. Parses the request, validates the body, calls a service, maps the result to a status code + JSON. <em>No business logic here.</em></div>
  <div class="lz-layer"><b>Service</b> — the business rules. "Hold the seat in Redis. Confirm the order in a transaction." Owns the Redis + pg calls. <em>Knows nothing about HTTP.</em></div>
  <div class="lz-layer"><b>Repository</b> — data access. Small functions that run one SQL query each and return plain rows. <em>Knows nothing about business rules.</em></div>
</div>
<div class="diagram">HTTP request
   │
   ▼
Route ──dto──▶ Service ──▶ Repository ──SQL──▶ PostgreSQL
   ▲              │    └────▶ Redis  (holds)
   └──json/status─┘  (map row → response, choose 200/201/409…)</div>

<h3>Wiring the app</h3>
<pre><span class="tok-comment">// src/app.js</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> authRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/auth.routes.js'</span>;
<span class="tok-keyword">import</span> eventRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/event.routes.js'</span>;
<span class="tok-keyword">import</span> orderRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/order.routes.js'</span>;
<span class="tok-keyword">import</span> { errorHandler } <span class="tok-keyword">from</span> <span class="tok-string">'./middleware/error.js'</span>;

<span class="tok-keyword">export const</span> app = express();
app.use(express.json());
app.use(<span class="tok-string">'/api/auth'</span>, authRoutes);
app.use(<span class="tok-string">'/api'</span>, eventRoutes);
app.use(<span class="tok-string">'/api'</span>, orderRoutes);
app.use(errorHandler);          <span class="tok-comment">// one place that turns thrown errors into JSON</span></pre>

<div class="callout ok">Why layer at all? Because you can then <strong>test the service without HTTP</strong> and <strong>swap the router (REST→GraphQL) without touching business rules</strong>. Each layer depends only on the one below it.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Never leak DB rows straight to the client.</b> A route should return a shaped DTO, not the raw row. Returning the row exposes the password hash and couples your API shape to your table shape. Map explicitly. <em>Why beyond syllabus: the row↔DTO boundary is a professional habit the syllabus rarely enforces, but every real codebase does.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">API design on Code Lab</span><span class="lc-sub">Routes, layering and clean responses, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.1</span>
<h2>Khởi tạo dự án &amp; kiến trúc phân lớp</h2>
<p class="lead">Tạo khung bằng <code>npm init -y</code> và cài <b>express, pg, redis, jsonwebtoken, bcrypt, zod, dotenv</b>. Rồi nối hai kết nối — một tới Postgres, một tới Redis — và tách code thành ba lớp để logic flash-sale luôn test được.</p>

<h3>Cấu hình &amp; hai kết nối</h3>
<pre><span class="tok-comment">// src/db.js — một client Postgres có pool</span>
<span class="tok-keyword">import</span> pg <span class="tok-keyword">from</span> <span class="tok-string">'pg'</span>;
<span class="tok-keyword">export const</span> pool = <span class="tok-keyword">new</span> pg.Pool({
  connectionString: process.env.DATABASE_URL
    ?? <span class="tok-string">'postgres://postgres:tix@localhost:5432/tix'</span>,
});

<span class="tok-comment">// src/redis.js — một client Redis dùng chung</span>
<span class="tok-keyword">import</span> { createClient } <span class="tok-keyword">from</span> <span class="tok-string">'redis'</span>;
<span class="tok-keyword">export const</span> redis = createClient({
  url: process.env.REDIS_URL ?? <span class="tok-string">'redis://localhost:6379'</span>,
});
<span class="tok-keyword">await</span> redis.connect();</pre>
<p>Cả hai đọc một biến môi trường với giá trị mặc định cục bộ — chính các giá trị này sẽ đến từ Docker ở Mục 7, không cần đổi code.</p>

<h3>Ba lớp — mỗi lớp một trách nhiệm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route</b> (một handler Express) — chỉ lo HTTP. Đọc request, validate body, gọi service, ánh xạ kết quả sang status code + JSON. <em>Không có business logic ở đây.</em></div>
  <div class="lz-layer"><b>Service</b> — quy tắc nghiệp vụ. "Giữ ghế trong Redis. Xác nhận đơn trong một transaction." Sở hữu các lời gọi Redis + pg. <em>Không biết gì về HTTP.</em></div>
  <div class="lz-layer"><b>Repository</b> — truy cập dữ liệu. Các hàm nhỏ, mỗi hàm chạy một truy vấn SQL và trả về dòng thô. <em>Không biết gì về quy tắc nghiệp vụ.</em></div>
</div>
<div class="diagram">HTTP request
   │
   ▼
Route ──dto──▶ Service ──▶ Repository ──SQL──▶ PostgreSQL
   ▲              │    └────▶ Redis  (holds)
   └──json/status─┘  (ánh xạ row → response, chọn 200/201/409…)</div>

<h3>Ráp app</h3>
<pre><span class="tok-comment">// src/app.js</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> authRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/auth.routes.js'</span>;
<span class="tok-keyword">import</span> eventRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/event.routes.js'</span>;
<span class="tok-keyword">import</span> orderRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/order.routes.js'</span>;
<span class="tok-keyword">import</span> { errorHandler } <span class="tok-keyword">from</span> <span class="tok-string">'./middleware/error.js'</span>;

<span class="tok-keyword">export const</span> app = express();
app.use(express.json());
app.use(<span class="tok-string">'/api/auth'</span>, authRoutes);
app.use(<span class="tok-string">'/api'</span>, eventRoutes);
app.use(<span class="tok-string">'/api'</span>, orderRoutes);
app.use(errorHandler);          <span class="tok-comment">// một nơi biến lỗi ném ra thành JSON</span></pre>

<div class="callout ok">Vì sao phải phân lớp? Vì khi đó bạn có thể <strong>test service không cần HTTP</strong> và <strong>thay router (REST→GraphQL) mà không đụng quy tắc nghiệp vụ</strong>. Mỗi lớp chỉ phụ thuộc vào lớp ngay dưới.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đừng bao giờ để lộ dòng DB thẳng ra client.</b> Route nên trả về một DTO đã định hình, không phải dòng thô. Trả về dòng thô làm lộ hash mật khẩu và cột chặt hình dạng API vào hình dạng bảng. Hãy map tường minh. <em>Vì sao ngoài syllabus: ranh giới row↔DTO là thói quen chuyên nghiệp mà giáo trình ít ép, nhưng mọi codebase thật đều làm.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">API design trên Code Lab</span><span class="lc-sub">Route, phân lớp và response sạch, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Repositories: talking to Postgres with pg|||2.2 — Repository: nói chuyện với Postgres bằng pg',
          slug: 'int606-repositories',
          type: 'VIDEO',
          description: 'Viết các hàm repository nhỏ với truy vấn tham số hoá — an toàn khỏi SQL injection và dễ test.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>Repositories — talking to Postgres with pg</h2>
<p class="lead">A repository is a thin set of functions, each running one <strong>parameterised</strong> query. Parameters (<code>$1, $2</code>) are how you stay safe from SQL injection — never build SQL by string concatenation.</p>

<h3>The seat &amp; order repositories</h3>
<pre><span class="tok-comment">// src/repos/seat.repo.js</span>
<span class="tok-keyword">import</span> { pool } <span class="tok-keyword">from</span> <span class="tok-string">'../db.js'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">availableSeats</span>(eventId) {
  <span class="tok-keyword">return</span> pool.query(
    <span class="tok-string">&#96;SELECT id, seat_label, price_cents, status
       FROM seats
      WHERE event_id = \$1 AND status = 'AVAILABLE'
      ORDER BY seat_label&#96;</span>,
    [eventId],
  ).then((r) =&gt; r.rows);
}

<span class="tok-keyword">export function</span> <span class="tok-function">findSeat</span>(seatId) {
  <span class="tok-keyword">return</span> pool.query(<span class="tok-string">'SELECT * FROM seats WHERE id = \$1'</span>, [seatId])
    .then((r) =&gt; r.rows[<span class="tok-number">0</span>] ?? <span class="tok-keyword">null</span>);
}

<span class="tok-comment">// src/repos/order.repo.js</span>
<span class="tok-keyword">export function</span> <span class="tok-function">ordersOfBuyer</span>(buyerId) {
  <span class="tok-keyword">return</span> pool.query(
    <span class="tok-string">&#96;SELECT o.id, o.checkin_code, o.status, s.seat_label, e.title
       FROM orders o
       JOIN seats s  ON s.id = o.seat_id
       JOIN events e ON e.id = s.event_id
      WHERE o.buyer_id = \$1
      ORDER BY o.created_at DESC&#96;</span>,
    [buyerId],
  ).then((r) =&gt; r.rows);
}</pre>

<h3>Worked example — parameterised vs string-built</h3>
<div class="out"><b>Attacker sends</b> eventId = <span class="tok-string">"0; DROP TABLE orders; --"</span>
<b>String-built (WRONG):</b>  &#96;... WHERE event_id = \${eventId}&#96;
   → SELECT ... WHERE event_id = 0; DROP TABLE orders; --   ← runs the DROP!
<b>Parameterised (RIGHT):</b>  '... WHERE event_id = \$1', [eventId]
   → the driver sends the value SEPARATELY; it is treated as data, never SQL.
   → the malicious string just fails to match any event_id. No harm.</div>

<div class="pitfall"><strong>Trap:</strong> the moment you write <code>&#96;WHERE id = \${x}&#96;</code> you have a SQL-injection hole and probably a type bug too. Always pass values as the <code>[...]</code> array. If you need dynamic columns, whitelist them explicitly — never interpolate user input into SQL text.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The pool, not a new connection per query.</b> <code>pg.Pool</code> keeps a set of reusable connections. Opening a fresh connection per request would collapse under a flash sale — the TCP + auth handshake dominates. A pool bounds concurrency and reuses warm sockets. <em>Why beyond syllabus: connection pooling is an operational concern the syllabus rarely explains, yet it decides whether your API survives a spike.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Repository — nói chuyện với Postgres bằng pg</h2>
<p class="lead">Một repository là một tập hàm mỏng, mỗi hàm chạy một truy vấn <strong>tham số hoá</strong>. Tham số (<code>$1, $2</code>) là cách bạn giữ an toàn khỏi SQL injection — đừng bao giờ ghép SQL bằng nối chuỗi.</p>

<h3>Repository ghế &amp; đơn hàng</h3>
<pre><span class="tok-comment">// src/repos/seat.repo.js</span>
<span class="tok-keyword">import</span> { pool } <span class="tok-keyword">from</span> <span class="tok-string">'../db.js'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">availableSeats</span>(eventId) {
  <span class="tok-keyword">return</span> pool.query(
    <span class="tok-string">&#96;SELECT id, seat_label, price_cents, status
       FROM seats
      WHERE event_id = \$1 AND status = 'AVAILABLE'
      ORDER BY seat_label&#96;</span>,
    [eventId],
  ).then((r) =&gt; r.rows);
}

<span class="tok-keyword">export function</span> <span class="tok-function">findSeat</span>(seatId) {
  <span class="tok-keyword">return</span> pool.query(<span class="tok-string">'SELECT * FROM seats WHERE id = \$1'</span>, [seatId])
    .then((r) =&gt; r.rows[<span class="tok-number">0</span>] ?? <span class="tok-keyword">null</span>);
}

<span class="tok-comment">// src/repos/order.repo.js</span>
<span class="tok-keyword">export function</span> <span class="tok-function">ordersOfBuyer</span>(buyerId) {
  <span class="tok-keyword">return</span> pool.query(
    <span class="tok-string">&#96;SELECT o.id, o.checkin_code, o.status, s.seat_label, e.title
       FROM orders o
       JOIN seats s  ON s.id = o.seat_id
       JOIN events e ON e.id = s.event_id
      WHERE o.buyer_id = \$1
      ORDER BY o.created_at DESC&#96;</span>,
    [buyerId],
  ).then((r) =&gt; r.rows);
}</pre>

<h3>Ví dụ có lời giải — tham số hoá vs ghép chuỗi</h3>
<div class="out"><b>Kẻ tấn công gửi</b> eventId = <span class="tok-string">"0; DROP TABLE orders; --"</span>
<b>Ghép chuỗi (SAI):</b>  &#96;... WHERE event_id = \${eventId}&#96;
   → SELECT ... WHERE event_id = 0; DROP TABLE orders; --   ← chạy luôn DROP!
<b>Tham số hoá (ĐÚNG):</b>  '... WHERE event_id = \$1', [eventId]
   → driver gửi giá trị RIÊNG; nó được coi là dữ liệu, không bao giờ là SQL.
   → chuỗi độc chỉ đơn giản không khớp event_id nào. Vô hại.</div>

<div class="pitfall"><strong>Bẫy:</strong> khoảnh khắc bạn viết <code>&#96;WHERE id = \${x}&#96;</code> là bạn có một lỗ SQL-injection và có lẽ cả một bug kiểu dữ liệu. Luôn truyền giá trị qua mảng <code>[...]</code>. Nếu cần cột động, hãy whitelist tường minh — đừng bao giờ chèn input người dùng vào văn bản SQL.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dùng pool, không mở kết nối mới mỗi truy vấn.</b> <code>pg.Pool</code> giữ một tập kết nối tái dùng. Mở kết nối mới mỗi request sẽ sụp khi flash sale — bắt tay TCP + auth chiếm phần lớn thời gian. Pool giới hạn tương tranh và tái dùng socket ấm. <em>Vì sao ngoài syllabus: connection pooling là mối lo vận hành mà giáo trình ít giải thích, nhưng nó quyết định API có sống nổi qua cú spike hay không.</em></div>
</div>
`,
        },
        {
          title: '2.3 — Worked slice: GET available seats (with caching)|||2.3 — Lát cắt có lời giải: GET ghế trống (kèm cache)',
          slug: 'int606-slice-seats',
          type: 'VIDEO',
          description: 'Đi trọn một lát cắt dọc đầu tiên: repository → service → route → thử bằng curl, có kết quả JSON thật; kèm cache Redis.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.3</span>
<h2>Worked slice — GET an event's available seats</h2>
<p class="lead">Let's ship the first vertical slice end-to-end: an endpoint that returns an event's AVAILABLE seats as clean JSON. During a flash sale thousands of buyers refresh this exact list, so we also add a short Redis cache — the template every other read endpoint copies.</p>

<h3>Step 1 — the service (business intent, no HTTP)</h3>
<pre><span class="tok-comment">// src/services/seat.service.js</span>
<span class="tok-keyword">import</span> { redis } <span class="tok-keyword">from</span> <span class="tok-string">'../redis.js'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> seatRepo <span class="tok-keyword">from</span> <span class="tok-string">'../repos/seat.repo.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">listAvailable</span>(eventId) {
  <span class="tok-keyword">const</span> key = <span class="tok-string">&#96;cache:seats:\${eventId}&#96;</span>;
  <span class="tok-keyword">const</span> cached = <span class="tok-keyword">await</span> redis.get(key);
  <span class="tok-keyword">if</span> (cached) <span class="tok-keyword">return</span> JSON.parse(cached);        <span class="tok-comment">// cache hit — microseconds</span>

  <span class="tok-keyword">const</span> rows = <span class="tok-keyword">await</span> seatRepo.availableSeats(eventId);
  <span class="tok-keyword">await</span> redis.set(key, JSON.stringify(rows), { EX: <span class="tok-number">5</span> }); <span class="tok-comment">// cache 5s</span>
  <span class="tok-keyword">return</span> rows;
}</pre>

<h3>Step 2 — the route (HTTP only)</h3>
<pre><span class="tok-comment">// src/routes/event.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> seatService <span class="tok-keyword">from</span> <span class="tok-string">'../services/seat.service.js'</span>;

<span class="tok-keyword">const</span> r = Router();
r.get(<span class="tok-string">'/events/:id/seats'</span>, <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> seats = <span class="tok-keyword">await</span> seatService.listAvailable(Number(req.params.id));
    res.json(seats);
  } <span class="tok-keyword">catch</span> (e) { next(e); }   <span class="tok-comment">// hand errors to the error middleware</span>
});
<span class="tok-keyword">export default</span> r;</pre>

<h3>Step 3 — test it (real output)</h3>
<div class="out"><b>Request:</b>  curl http://localhost:4000/api/events/1/seats
<b>Response 200:</b>
[
  { "id": 10, "seat_label": "A-1", "price_cents": 20000, "status": "AVAILABLE" },
  { "id": 11, "seat_label": "A-2", "price_cents": 20000, "status": "AVAILABLE" }
]
<b>Second call within 5s:</b> served from Redis cache — the SQL never runs.</div>
<p>That is a complete slice: request → route → service → repository (+ cache) → JSON. Every other GET endpoint (my tickets, event list) is this same shape.</p>

<div class="callout ok"><strong>Rhythm to internalise:</strong> repository (the query), then service (the intent + cache), then route (the plumbing). Build inside-out and each layer stays small.</div>

<div class="pitfall"><strong>Trap:</strong> caching for too long. A 5-second cache during a flash sale is fine — it smooths a burst of reads. But you MUST bust the cache when a seat sells (delete <code>cache:seats:&lt;eventId&gt;</code> in the confirm step) or buyers will keep seeing a sold seat and lose the race repeatedly.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Cache the read path, never the write path.</b> Caching the seat <em>list</em> is safe because a stale read only costs a wasted click (the hold/confirm still enforces correctness). Never cache the hold or the order — correctness there must always hit Redis/Postgres live. Know which data tolerates staleness. <em>Why beyond syllabus: deciding what may be stale is a distributed-systems judgement the syllabus never poses.</em></div>

<a class="link-card codelab" href="/code-lab/redis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-740" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Distributed caching on Code Lab</span><span class="lc-sub">Cache-aside, TTLs and invalidation — the pattern in this slice.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.3</span>
<h2>Lát cắt có lời giải — GET ghế trống của sự kiện</h2>
<p class="lead">Hãy ship lát cắt dọc đầu tiên từ đầu đến cuối: một endpoint trả về ghế AVAILABLE của sự kiện dưới dạng JSON sạch. Trong flash sale hàng nghìn người mua làm mới đúng danh sách này, nên ta thêm một cache Redis ngắn — khuôn mà mọi endpoint đọc khác sao chép lại.</p>

<h3>Bước 1 — service (ý định nghiệp vụ, không HTTP)</h3>
<pre><span class="tok-comment">// src/services/seat.service.js</span>
<span class="tok-keyword">import</span> { redis } <span class="tok-keyword">from</span> <span class="tok-string">'../redis.js'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> seatRepo <span class="tok-keyword">from</span> <span class="tok-string">'../repos/seat.repo.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">listAvailable</span>(eventId) {
  <span class="tok-keyword">const</span> key = <span class="tok-string">&#96;cache:seats:\${eventId}&#96;</span>;
  <span class="tok-keyword">const</span> cached = <span class="tok-keyword">await</span> redis.get(key);
  <span class="tok-keyword">if</span> (cached) <span class="tok-keyword">return</span> JSON.parse(cached);        <span class="tok-comment">// cache hit — micro-giây</span>

  <span class="tok-keyword">const</span> rows = <span class="tok-keyword">await</span> seatRepo.availableSeats(eventId);
  <span class="tok-keyword">await</span> redis.set(key, JSON.stringify(rows), { EX: <span class="tok-number">5</span> }); <span class="tok-comment">// cache 5s</span>
  <span class="tok-keyword">return</span> rows;
}</pre>

<h3>Bước 2 — route (chỉ HTTP)</h3>
<pre><span class="tok-comment">// src/routes/event.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> seatService <span class="tok-keyword">from</span> <span class="tok-string">'../services/seat.service.js'</span>;

<span class="tok-keyword">const</span> r = Router();
r.get(<span class="tok-string">'/events/:id/seats'</span>, <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> seats = <span class="tok-keyword">await</span> seatService.listAvailable(Number(req.params.id));
    res.json(seats);
  } <span class="tok-keyword">catch</span> (e) { next(e); }   <span class="tok-comment">// chuyển lỗi cho error middleware</span>
});
<span class="tok-keyword">export default</span> r;</pre>

<h3>Bước 3 — thử nó (kết quả thật)</h3>
<div class="out"><b>Request:</b>  curl http://localhost:4000/api/events/1/seats
<b>Response 200:</b>
[
  { "id": 10, "seat_label": "A-1", "price_cents": 20000, "status": "AVAILABLE" },
  { "id": 11, "seat_label": "A-2", "price_cents": 20000, "status": "AVAILABLE" }
]
<b>Lần gọi thứ hai trong 5s:</b> phục vụ từ cache Redis — SQL không hề chạy.</div>
<p>Đó là một lát cắt hoàn chỉnh: request → route → service → repository (+ cache) → JSON. Mọi endpoint GET khác (vé của tôi, danh sách sự kiện) đều cùng hình dạng này.</p>

<div class="callout ok"><strong>Nhịp cần thấm:</strong> repository (truy vấn), rồi service (ý định + cache), rồi route (đường ống). Xây từ trong ra ngoài và mỗi lớp luôn nhỏ.</div>

<div class="pitfall"><strong>Bẫy:</strong> cache quá lâu. Cache 5 giây trong flash sale thì ổn — nó làm mượt một cơn đọc dồn dập. Nhưng bạn PHẢI xoá cache khi một ghế được bán (xoá <code>cache:seats:&lt;eventId&gt;</code> ở bước xác nhận) nếu không người mua sẽ cứ thấy một ghế đã bán và thua cuộc đua liên tục.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cache đường đọc, không bao giờ đường ghi.</b> Cache <em>danh sách</em> ghế là an toàn vì một lần đọc cũ chỉ tốn một cú click phí (hold/confirm vẫn ép tính đúng). Đừng bao giờ cache lượt giữ hay đơn hàng — tính đúng ở đó phải luôn chạm Redis/Postgres trực tiếp. Hãy biết dữ liệu nào chịu được cũ. <em>Vì sao ngoài syllabus: quyết định cái gì được phép cũ là phán đoán hệ phân tán mà giáo trình không đặt ra.</em></div>

<a class="link-card codelab" href="/code-lab/redis?ref=%2Fcourses%2Fevent-ticketing-system%2Flearn&reflabel=INT606#module-740" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Distributed caching trên Code Lab</span><span class="lc-sub">Cache-aside, TTL và vô hiệu hoá — mẫu trong lát cắt này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
  ],
};
