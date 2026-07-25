/**
 * INT608 — Restaurant Reservation & Pre-order (Kỳ 6 — Thực tập, project #8).
 * Mobile: Flutter (Dart) app + a lightweight REST backend (Node/Express + PostgreSQL), JWT auth.
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản quay video)
 * → domain/DB design → REST backend & lớp → auth/JWT + flutter_secure_storage → reservation core
 * (chống đặt trùng bàn+khung giờ) → Flutter app (state mgmt + màn đặt bàn) → testing → deployment
 * → nâng cao (★ ngoài giáo trình). Song ngữ EN/VN đối xứng. Code Dart/JS <pre>+.tok-*; ví dụ giải + ★.
 * Deep-link CodeLab flutter/dart/rest-apis; cài môi trường → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT608.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (Dart interp / shell) = \${ ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT608',
    title: 'Restaurant Reservation App',
    slug: 'restaurant-reservation-app',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #8 — build a restaurant reservation and pre-order app end-to-end: a Flutter mobile app on a REST backend with JWT, two roles, and a race-safe core so a table can never be double-booked for one time-slot.|||Đồ án thực tập #8 — xây app đặt bàn và gọi món trước: Flutter trên REST backend, JWT, hai vai trò và lõi chống đặt trùng — một bàn không bao giờ bị đặt trùng trong một khung giờ.',
    description: 'INT608 là đồ án thực tập tập trung MOBILE: bạn xây một ứng dụng Flutter (Dart) đặt bàn nhà hàng và gọi món trước (pre-order), nói chuyện với một REST backend nhẹ (Node/Express + PostgreSQL) qua JWT. App có hai vai trò: THỰC KHÁCH (DINER) duyệt khung giờ trống, đặt một bàn, gọi trước vài món, xem và huỷ đặt chỗ; và NHÂN VIÊN (STAFF) xem toàn bộ đặt chỗ + món gọi trước trong ngày rồi xác nhận. Trọng tâm kỹ thuật là LÕI GIAO DỊCH: một bàn KHÔNG BAO GIỜ bị đặt trùng cho cùng một khung giờ — server bảo đảm bằng ràng buộc UNIQUE(table_id, slot_id) + transaction, và app Flutter xử lý duyên dáng tình huống "vừa có người đặt mất" (HTTP 409) bằng cách làm mới danh sách khung giờ. Bạn sẽ học Flutter widget, quản lý trạng thái (Provider/Riverpod), gọi API bằng dio, lưu token an toàn bằng flutter_secure_storage, chạy trên emulator/thiết bị thật và ghi chú bản release. Đây là khuôn "app mobile CRUD + một lõi tranh chấp" mà mọi đồ án di động khác tái dùng.',
    whatYouLearn: 'Thiết kế domain & ERD cho nghiệp vụ đặt bàn (User/Table/TimeSlot/Reservation/Dish/PreOrderItem); dựng REST API nhẹ (Node/Express) theo lớp route→service→data với PostgreSQL; xác thực JWT + phân quyền DINER vs STAFF, lưu token bằng flutter_secure_storage; LÕI ĐẶT BÀN an toàn khi tranh chấp — UNIQUE(table_id, slot_id) + transaction + ánh xạ lỗi trùng khoá thành 409; Flutter thực chiến: cây widget, layout, điều hướng, quản lý trạng thái bằng Provider (đối chiếu Riverpod), gọi API bằng dio với interceptor gắn token, màn hình đặt bàn (chọn ngày + khung giờ), pre-order món, và xử lý 409 duyên dáng (thông báo + làm mới khung giờ); kiểm thử: một test đồng thời phía backend chứng minh không đặt trùng + một widget test phía Flutter; đóng gói backend bằng Docker Compose, chạy app trên emulator/thiết bị và tạo bản release; cùng một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học PRF192/PRO192 (lập trình/OOP), DBI202 (CSDL/SQL) và một môn web/dịch vụ (REST). Cần: Flutter SDK (kèm Dart), Android Studio + một emulator (hoặc thiết bị Android bật USB debugging), VS Code + tiện ích Flutter/Dart, Docker Desktop để chạy backend + PostgreSQL, một client test API (Postman hoặc REST Client) và một tài khoản GitHub cho nhóm.',
    documentsNote: 'Tham chiếu: Flutter docs (docs.flutter.dev) • Dart language tour (dart.dev) • Provider & Riverpod docs • dio (pub.dev/packages/dio) • flutter_secure_storage (pub.dev) • Express (expressjs.com) • node-postgres (node-postgres.com) • PostgreSQL Documentation • jwt.io. Công cụ: Flutter SDK, Android Studio (+ emulator), VS Code + Flutter/Dart, Postman, DBeaver/pgAdmin, Docker Desktop, draw.io (ERD). Luyện code: track Code Lab Flutter + Dart + REST APIs. Cài môi trường & Docker: Exp Hub. Đây là project-course thực tập mobile — vừa xây vừa quay video theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc app–server, tech stack & lý do chọn, cài môi trường Flutter, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int608-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một app đặt bàn Flutter thật, kiến trúc app–server, và bản đồ vòng đời từ ERD tới bản release.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — Restaurant Reservation &amp; Pre-order</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, installable <strong>Flutter mobile app</strong>: a diner picks a free time-slot, reserves a table, pre-orders a few dishes, and staff confirm it — and the system <strong>refuses to double-book one table for the same slot</strong> even under two simultaneous taps. By the end you have a running app on an emulator or a real phone, a REST backend in Docker, tests, and a recorded demo.</p>
<p>Every mobile project in your internship is a variation of this skeleton: an authenticated <strong>REST API</strong> over a relational database, a <strong>Flutter app</strong> that consumes it, and one <strong>transactional core</strong> that must stay correct under concurrency. Master this one and the others are re-skins.</p>

<h3>The system in one picture — app / server / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Flutter app (phone)</div><div class="lz-d">Dart · Provider · dio · reservation UI</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">REST backend</div><div class="lz-d">Express · route→service→data · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · tables · slots · reservations · dishes</div></div>
</div>
<div class="diagram">Flutter app  ──HTTPS/JSON──▶  REST backend  ──SQL──▶  PostgreSQL
  (emulator/phone)          (port 3000)              (port 5432)
  Authorization: Bearer &lt;JWT&gt;                 UNIQUE(table_id, slot_id)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design</div><div class="lz-nsub">Roles &amp; use cases · ERD · schema · the UNIQUE that prevents double-booking</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">The REST backend &amp; layers</div><div class="lz-nsub">Express routes · services · pg queries · JSON error shape</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">Register/login · flutter_secure_storage · Diner vs Staff</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The reservation core</div><div class="lz-nsub">Reserve a table+slot · block double-booking · transaction · 409</div></div></div>
  <div class="lz-stage">Flutter</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">The Flutter app</div><div class="lz-nsub">Widgets · state management · dio interceptor · reservation + pre-order screen</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">A backend concurrency test that proves no double-booking · a Flutter widget test</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose backend · run on emulator/device · a release build note</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Offline cache · waitlist · push reminders · CI</div><div class="lz-nsub">Ship like a real mobile team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — login → see free slots → reserve one → it appears in "My reservations" — then grow it. A tiny end-to-end flow that runs on a phone beats a huge design that never builds.</div>

<a class="link-card codelab" href="/code-lab/flutter?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-446" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Warm up Dart fundamentals on Code Lab</span><span class="lc-sub">Variables, types and control flow — the language under every Flutter widget.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — Đặt bàn nhà hàng &amp; gọi món trước</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một <strong>app Flutter</strong> thật, cài được: thực khách chọn một khung giờ trống, đặt một bàn, gọi trước vài món, và nhân viên xác nhận — và hệ thống <strong>từ chối đặt trùng một bàn cho cùng một khung giờ</strong> kể cả khi hai người chạm cùng lúc. Kết thúc, bạn có app chạy trên emulator hoặc điện thoại thật, một REST backend trong Docker, có test, kèm một video demo.</p>
<p>Mọi đồ án di động trong kỳ thực tập đều là biến thể của bộ khung này: một <strong>REST API</strong> có xác thực trên CSDL quan hệ, một <strong>app Flutter</strong> tiêu thụ nó, và một <strong>lõi giao dịch</strong> phải luôn đúng khi tranh chấp. Làm chủ cái này thì các đồ án khác chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — app / server / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">App Flutter (điện thoại)</div><div class="lz-d">Dart · Provider · dio · UI đặt bàn</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">REST backend</div><div class="lz-d">Express · route→service→data · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · tables · slots · reservations · dishes</div></div>
</div>
<div class="diagram">App Flutter  ──HTTPS/JSON──▶  REST backend  ──SQL──▶  PostgreSQL
  (emulator/điện thoại)      (cổng 3000)             (cổng 5432)
  Authorization: Bearer &lt;JWT&gt;                 UNIQUE(table_id, slot_id)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL</div><div class="lz-nsub">Vai trò &amp; use case · ERD · schema · ràng buộc UNIQUE chống đặt trùng</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">REST backend &amp; các lớp</div><div class="lz-nsub">Route Express · service · truy vấn pg · hình dạng lỗi JSON</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (JWT)</div><div class="lz-nsub">Đăng ký/đăng nhập · flutter_secure_storage · Thực khách vs Nhân viên</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lõi đặt bàn</div><div class="lz-nsub">Đặt một bàn+khung · chặn đặt trùng · transaction · 409</div></div></div>
  <div class="lz-stage">Flutter</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">App Flutter</div><div class="lz-nsub">Widget · quản lý trạng thái · interceptor dio · màn đặt bàn + gọi món</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">Một test đồng thời backend chứng minh không đặt trùng · một widget test Flutter</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose backend · chạy trên emulator/thiết bị · ghi chú bản release</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Cache offline · waitlist · nhắc lịch push · CI</div><div class="lz-nsub">Ship như một đội mobile thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — đăng nhập → thấy khung trống → đặt một cái → nó hiện trong "Đặt chỗ của tôi" — rồi mới mở rộng. Một luồng nhỏ chạy được trên điện thoại hơn hẳn một bản thiết kế đồ sộ không bao giờ build.</div>

<a class="link-card codelab" href="/code-lab/flutter?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-446" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Khởi động nền tảng Dart trên Code Lab</span><span class="lc-sub">Biến, kiểu và luồng điều khiển — ngôn ngữ nằm dưới mọi widget Flutter.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int608-pham-vi',
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
  <div class="kv"><span class="k">DINER</span><span class="v">Register/login · browse free time-slots · reserve a table · pre-order dishes · view / cancel own reservations</span></div>
  <div class="kv"><span class="k">STAFF</span><span class="v">Login · see the day\\'s reservations + pre-orders · confirm or reject · open new slots for tables</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">DINER picks a FREE table+slot ──▶ POST /reservations ──▶ that (table, slot) is TAKEN
        │                                                        │
        │ second diner picks the SAME table+slot ──▶ 409 Conflict ┘  (blocked)
        ▼
STAFF confirms ──▶ reservation status: PENDING ──▶ CONFIRMED</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A diner can register, log in, and the token is stored securely</td><td>POST /auth/register then /auth/login returns a token kept in flutter_secure_storage</td></tr>
<tr><td>2</td><td>A diner sees only FREE table+slot options for a date</td><td>GET /slots?date=YYYY-MM-DD returns availability</td></tr>
<tr><td>3</td><td>Reserving a free table+slot creates a PENDING reservation</td><td>POST /reservations → 201 + slot disappears from the list</td></tr>
<tr><td>4</td><td><b>Double-booking is impossible</b></td><td>two concurrent POSTs for one table+slot → exactly one 201, one 409</td></tr>
<tr><td>5</td><td>A diner can attach a pre-order to their reservation</td><td>POST /reservations/{id}/items → dishes + quantities saved</td></tr>
<tr><td>6</td><td>Only STAFF can confirm/reject; a diner cancels only their own</td><td>DINER hitting confirm → 403; cancelling another user\\'s reservation → 403</td></tr>
<tr><td>7</td><td>The app runs on an emulator/device against the Docker backend</td><td>flutter run · one <code>docker compose up</code> for api + db</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> Real online payment, live table-map drag-and-drop, delivery tracking, an AI menu recommender as a core feature, multi-restaurant marketplace. Simulate payment with a "pay at the restaurant" flag. Depth on the reservation core scores; breadth with nothing finished does not.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 6). "Definition of Done = the tests are green" removes every argument about whether a feature works. <em>Why beyond syllabus: turning a checklist into executable specs is exactly how professional teams gate a release.</em></div>

<a class="link-card codelab" href="/code-lab/dart?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-1125" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Getting started with Dart on Code Lab</span><span class="lc-sub">Syntax and your first program — before you scaffold the app.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một lõi giao dịch, vài màn hình</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">THỰC KHÁCH</span><span class="v">Đăng ký/đăng nhập · duyệt khung giờ trống · đặt một bàn · gọi món trước · xem / huỷ đặt chỗ của mình</span></div>
  <div class="kv"><span class="k">NHÂN VIÊN</span><span class="v">Đăng nhập · xem đặt chỗ + món gọi trước trong ngày · xác nhận hoặc từ chối · mở khung giờ mới cho bàn</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">THỰC KHÁCH chọn bàn+khung TRỐNG ──▶ POST /reservations ──▶ (bàn, khung) đó thành ĐÃ ĐẶT
        │                                                          │
        │ thực khách thứ 2 chọn ĐÚNG bàn+khung đó ──▶ 409 Conflict ┘  (bị chặn)
        ▼
NHÂN VIÊN xác nhận ──▶ trạng thái đặt chỗ: PENDING ──▶ CONFIRMED</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Thực khách đăng ký, đăng nhập, token được lưu an toàn</td><td>POST /auth/register rồi /auth/login trả token lưu trong flutter_secure_storage</td></tr>
<tr><td>2</td><td>Thực khách chỉ thấy các bàn+khung TRỐNG của một ngày</td><td>GET /slots?date=YYYY-MM-DD trả khả dụng</td></tr>
<tr><td>3</td><td>Đặt một bàn+khung trống tạo đặt chỗ PENDING</td><td>POST /reservations → 201 + khung biến khỏi danh sách</td></tr>
<tr><td>4</td><td><b>Không thể đặt trùng</b></td><td>hai POST đồng thời cho một bàn+khung → đúng một 201, một 409</td></tr>
<tr><td>5</td><td>Thực khách gắn được món gọi trước vào đặt chỗ</td><td>POST /reservations/{id}/items → lưu món + số lượng</td></tr>
<tr><td>6</td><td>Chỉ NHÂN VIÊN xác nhận/từ chối; thực khách chỉ huỷ của mình</td><td>THỰC KHÁCH gọi xác nhận → 403; huỷ đặt chỗ người khác → 403</td></tr>
<tr><td>7</td><td>App chạy trên emulator/thiết bị với backend Docker</td><td>flutter run · một <code>docker compose up</code> cho api + db</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Thanh toán online thật, kéo-thả sơ đồ bàn trực tiếp, theo dõi giao hàng, "AI gợi ý món" làm tính năng lõi, sàn nhiều nhà hàng. Hãy giả lập thanh toán bằng cờ "trả tại quán". Sâu ở lõi đặt bàn mới ăn điểm; ôm rộng mà chẳng xong thì không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 6). "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc một tính năng có chạy hay không. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành.</em></div>

<a class="link-card codelab" href="/code-lab/dart?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-1125" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Bắt đầu với Dart trên Code Lab</span><span class="lc-sub">Cú pháp và chương trình đầu tiên — trước khi bạn khởi tạo app.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int608-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Flutter + REST backend + PostgreSQL — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Every choice below is picked because it is the <strong>mainstream mobile combo</strong> for a cross-platform internship, and because it keeps the backend small so your energy goes into the app and the concurrency core.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>App — Flutter 3 (Dart)</b><br/>One codebase for Android and iOS. Widgets compose the UI, hot-reload makes iteration instant. <em>Why: the most-hired cross-platform toolkit; one language (Dart) for the whole app.</em></div>
  <div class="lz-layer"><b>State — Provider (or Riverpod)</b><br/>Hold auth + reservation state above the widgets and rebuild only what changed. <em>Why: the standard, beginner-friendly state solution; Riverpod is the compile-safe evolution — we show both.</em></div>
  <div class="lz-layer"><b>HTTP — dio</b><br/>Talk to the REST API with interceptors that attach the JWT and catch 401/409 centrally. <em>Why: richer than the bare <code>http</code> package — interceptors, timeouts, typed errors.</em></div>
  <div class="lz-layer"><b>Secure token — flutter_secure_storage</b><br/>Store the JWT in the Keychain (iOS) / EncryptedSharedPreferences (Android), not in plain prefs. <em>Why: a token in plain storage is a security finding; the Keystore is the right home.</em></div>
  <div class="lz-layer"><b>Backend — Node + Express + node-postgres</b><br/>A small REST API: routes → services → SQL. <em>Why: minimal ceremony so the app stays the star; the concurrency guarantee lives in the DB, not the framework.</em></div>
  <div class="lz-layer"><b>Database — PostgreSQL 16</b><br/>A real, free, ACID relational database. <em>Why: transactions and UNIQUE constraints are what make double-booking impossible; Postgres is the industry default.</em></div>
</div>

<h3>The request journey — how a tap becomes a row</h3>
<div class="diagram">Tap "Reserve"  →  dio POST /reservations  (JWT in header)
   →  Express auth middleware verifies JWT
   →  reservations.route → reservationService.reserve()
   →  BEGIN ; INSERT reservation (table_id, slot_id) ; COMMIT
   →  PostgreSQL enforces UNIQUE(table_id, slot_id)
   →  201 Created  (or 409 if the UNIQUE fires)
   →  Flutter shows "Reserved!"  (or refreshes the slot list)</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A stack is a set of trade-offs, not a fashion.</b> You could swap Flutter for React Native, Express for FastAPI, or Postgres for MySQL, and the architecture would be identical — the same three layers, the same UNIQUE constraint. Reviewers respect a student who can say "I chose X over Y because…". <em>Why beyond syllabus: the syllabus teaches one stack; real engineering is choosing among many for reasons.</em></div>

<a class="link-card codelab" href="/code-lab/flutter?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-447" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Brush up Flutter widgets on Code Lab</span><span class="lc-sub">Stateless vs stateful, composition — the building blocks of every screen.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì đó là <strong>bộ combo mobile chủ đạo</strong> cho một kỳ thực tập đa nền tảng, và vì nó giữ backend nhỏ để bạn dồn sức vào app và lõi tương tranh.</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>App — Flutter 3 (Dart)</b><br/>Một codebase cho cả Android và iOS. Widget dựng UI, hot-reload khiến lặp gần như tức thì. <em>Vì sao: bộ công cụ đa nền tảng được tuyển nhiều nhất; một ngôn ngữ (Dart) cho cả app.</em></div>
  <div class="lz-layer"><b>Trạng thái — Provider (hoặc Riverpod)</b><br/>Giữ trạng thái đăng nhập + đặt chỗ trên widget và chỉ rebuild phần thay đổi. <em>Vì sao: giải pháp trạng thái chuẩn, dễ cho người mới; Riverpod là bản tiến hoá an toàn khi biên dịch — ta chỉ cả hai.</em></div>
  <div class="lz-layer"><b>HTTP — dio</b><br/>Nói chuyện với REST API bằng interceptor tự gắn JWT và bắt 401/409 tập trung. <em>Vì sao: giàu hơn gói <code>http</code> trần — interceptor, timeout, lỗi có kiểu.</em></div>
  <div class="lz-layer"><b>Token an toàn — flutter_secure_storage</b><br/>Lưu JWT trong Keychain (iOS) / EncryptedSharedPreferences (Android), không phải prefs thường. <em>Vì sao: token để trong bộ nhớ thường là một lỗ hổng; Keystore mới là chỗ đúng.</em></div>
  <div class="lz-layer"><b>Backend — Node + Express + node-postgres</b><br/>Một REST API nhỏ: route → service → SQL. <em>Vì sao: ít nghi thức để app là ngôi sao; sự bảo đảm tương tranh nằm ở DB, không ở framework.</em></div>
  <div class="lz-layer"><b>CSDL — PostgreSQL 16</b><br/>Một CSDL quan hệ thật, miễn phí, ACID. <em>Vì sao: transaction và ràng buộc UNIQUE chính là thứ khiến việc đặt trùng không thể xảy ra; Postgres là mặc định của ngành.</em></div>
</div>

<h3>Hành trình một request — một cú chạm thành một dòng dữ liệu</h3>
<div class="diagram">Chạm "Đặt bàn"  →  dio POST /reservations  (JWT trong header)
   →  middleware xác thực Express kiểm JWT
   →  reservations.route → reservationService.reserve()
   →  BEGIN ; INSERT reservation (table_id, slot_id) ; COMMIT
   →  PostgreSQL thực thi UNIQUE(table_id, slot_id)
   →  201 Created  (hoặc 409 nếu UNIQUE kích hoạt)
   →  Flutter hiện "Đã đặt!"  (hoặc làm mới danh sách khung)</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một stack là tập hợp các đánh đổi, không phải mốt thời trang.</b> Bạn có thể thay Flutter bằng React Native, Express bằng FastAPI, hay Postgres bằng MySQL, và kiến trúc vẫn y hệt — cùng ba lớp, cùng ràng buộc UNIQUE. Hội đồng nể một sinh viên biết nói "tôi chọn X thay vì Y vì…". <em>Vì sao ngoài syllabus: giáo trình dạy một stack; kỹ nghệ thật là chọn giữa nhiều lựa chọn có lý do.</em></div>

<a class="link-card codelab" href="/code-lab/flutter?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-447" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Ôn widget Flutter trên Code Lab</span><span class="lc-sub">Stateless vs stateful, ghép widget — viên gạch của mọi màn hình.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int608-cai-dat',
          type: 'VIDEO',
          description: 'Flutter SDK, Android Studio + emulator, VS Code, Docker, Postman — cài một lần, dùng cả đồ án. Hướng dẫn chi tiết ở Exp Hub.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your environment</h2>
<p class="lead">Install everything once, before you write a line of code. Verify each tool from the terminal — <code>flutter doctor</code> is your friend — so you never lose an afternoon to a missing Android SDK.</p>

<h3>The checklist</h3>
<table>
<thead><tr><th>Tool</th><th>Why</th><th>Verify command</th></tr></thead>
<tbody>
<tr><td>Flutter SDK (+ Dart)</td><td>build &amp; run the app</td><td><code>flutter --version</code> · <code>flutter doctor</code></td></tr>
<tr><td>Android Studio + an emulator</td><td>Android toolchain &amp; a virtual phone</td><td>an AVD boots in Device Manager</td></tr>
<tr><td>VS Code + Flutter/Dart ext.</td><td>fast editor with hot-reload</td><td>F5 launches the app</td></tr>
<tr><td>A device or emulator</td><td>run the real app</td><td><code>flutter devices</code> lists it</td></tr>
<tr><td>Docker Desktop</td><td>run the REST backend + Postgres</td><td><code>docker --version</code></td></tr>
<tr><td>Postman / REST Client</td><td>test the API without the app</td><td>send a GET to :3000</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>The emulator networking gotcha:</strong> from the Android emulator, your PC is <code>10.0.2.2</code>, not <code>localhost</code>. Point the app\\'s base URL at <code>http://10.0.2.2:3000</code> (iOS simulator can use <code>localhost</code>; a real device uses your PC\\'s LAN IP). This single line saves the classic "connection refused" hour.</div>

<a class="link-card dl" href="/exp-hub/int608-cai-dat-moi-truong?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">Flutter SDK, Android Studio + emulator, VS Code, Docker, Postman — official links and a <code>flutter doctor</code> checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> skipping <code>flutter doctor</code>. It flags a missing Android SDK, an unaccepted Android licence (<code>flutter doctor --android-licenses</code>), or no connected device — the three things that block your very first <code>flutter run</code>. Get every line to a green check before you code.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt môi trường</h2>
<p class="lead">Cài hết một lần, trước khi viết một dòng code. Kiểm từng công cụ từ terminal — <code>flutter doctor</code> là bạn của bạn — để không mất cả buổi chiều vì thiếu Android SDK.</p>

<h3>Danh sách cần cài</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Lệnh kiểm</th></tr></thead>
<tbody>
<tr><td>Flutter SDK (+ Dart)</td><td>build &amp; chạy app</td><td><code>flutter --version</code> · <code>flutter doctor</code></td></tr>
<tr><td>Android Studio + emulator</td><td>bộ công cụ Android &amp; điện thoại ảo</td><td>một AVD khởi động trong Device Manager</td></tr>
<tr><td>VS Code + tiện ích Flutter/Dart</td><td>editor nhanh có hot-reload</td><td>F5 chạy được app</td></tr>
<tr><td>Một thiết bị hoặc emulator</td><td>chạy app thật</td><td><code>flutter devices</code> liệt kê nó</td></tr>
<tr><td>Docker Desktop</td><td>chạy REST backend + Postgres</td><td><code>docker --version</code></td></tr>
<tr><td>Postman / REST Client</td><td>test API không cần app</td><td>gửi GET tới :3000</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Bẫy mạng của emulator:</strong> từ emulator Android, máy PC của bạn là <code>10.0.2.2</code>, không phải <code>localhost</code>. Trỏ base URL của app vào <code>http://10.0.2.2:3000</code> (iOS simulator dùng được <code>localhost</code>; thiết bị thật dùng IP LAN của PC). Đúng một dòng này cứu bạn khỏi cả tiếng "connection refused".</div>

<a class="link-card dl" href="/exp-hub/int608-cai-dat-moi-truong?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">Flutter SDK, Android Studio + emulator, VS Code, Docker, Postman — link chính chủ và checklist <code>flutter doctor</code> trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> bỏ qua <code>flutter doctor</code>. Nó chỉ ra thiếu Android SDK, chưa chấp nhận licence Android (<code>flutter doctor --android-licenses</code>), hoặc chưa có thiết bị nào — ba thứ chặn ngay <code>flutter run</code> đầu tiên của bạn. Hãy để mọi dòng thành dấu xanh trước khi code.</div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int608-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng lõi, "khoảnh khắc chống đặt trùng", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the one thing that is hard: <strong>the double-booking is blocked live, on two phones</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is a restaurant reservation app. Two roles, and one table can never be double-booked for a slot. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Diner flow (2m)</div><div class="lz-nsub">Register → login (mention the token is in secure storage) → pick a date → see FREE table+slots → reserve one → add a pre-order of two dishes → it appears as PENDING in "My reservations".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — The money shot (1.5m)</div><div class="lz-nsub">Two emulators (or two phones), two diners, same table+slot, tap at the same time. One succeeds, one gets a clear "just taken" message and the slot list refreshes. Then run the backend concurrency test in the terminal — green.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Staff flow (1.5m)</div><div class="lz-nsub">Log in as staff → see today\\'s reservations with their pre-orders → confirm one → the diner\\'s status flips to CONFIRMED. Show a diner being blocked (403) from the confirm action.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Under the hood (1.5m)</div><div class="lz-nsub">Show the ERD, the <code>UNIQUE(table_id, slot_id)</code> constraint, the transaction. Explain in one sentence why double-booking is impossible. One command: <code>docker compose up</code> for the backend.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Close (30s)</div><div class="lz-nsub">"Stack: Flutter, Express, PostgreSQL, Docker. Repo link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (never demo on an empty DB). Use <code>scrcpy</code> or the built-in screen record to capture the phone. Increase font/UI scale. Do one dry run. Record in 1080p. Keep gestures slow. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The demo is a product, not an afterthought.</b> Interviewers watch the first 60 seconds and the "hard part". Lead with the architecture and end with the concurrency proof on two phones — that ordering signals engineering maturity far more than a tour of every CRUD screen. <em>Why beyond syllabus: communication of your work is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD and a schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng thứ khó: <strong>việc đặt trùng bị chặn ngay trên hai điện thoại</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là app đặt bàn nhà hàng. Hai vai trò, và một bàn không bao giờ bị đặt trùng cho một khung giờ. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng thực khách (2m)</div><div class="lz-nsub">Đăng ký → đăng nhập (nói token nằm trong secure storage) → chọn ngày → thấy bàn+khung TRỐNG → đặt một cái → gọi trước hai món → hiện là PENDING trong "Đặt chỗ của tôi".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — Cảnh đắt giá (1.5m)</div><div class="lz-nsub">Hai emulator (hoặc hai điện thoại), hai thực khách, cùng một bàn+khung, chạm cùng lúc. Một thành công, một nhận thông báo rõ "vừa có người đặt" và danh sách khung tự làm mới. Rồi chạy test đồng thời phía backend trong terminal — xanh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Luồng nhân viên (1.5m)</div><div class="lz-nsub">Đăng nhập nhân viên → xem đặt chỗ hôm nay kèm món gọi trước → xác nhận một cái → trạng thái thực khách đổi thành CONFIRMED. Cho thấy thực khách bị chặn (403) khỏi hành động xác nhận.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:30 — Bên trong (1.5m)</div><div class="lz-nsub">Chiếu ERD, ràng buộc <code>UNIQUE(table_id, slot_id)</code>, transaction. Giải thích một câu vì sao không thể đặt trùng. Một lệnh: <code>docker compose up</code> cho backend.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Kết (30s)</div><div class="lz-nsub">"Stack: Flutter, Express, PostgreSQL, Docker. Link repo trên màn hình. Cảm ơn." Chạy URL GitHub.</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed dữ liệu demo trước (đừng bao giờ demo trên DB rỗng). Dùng <code>scrcpy</code> hoặc quay màn hình sẵn có để bắt hình điện thoại. Tăng cỡ chữ/UI. Quay thử một lần. Quay 1080p. Thao tác chậm. Nếu hỏng, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Demo là một sản phẩm, không phải thứ làm cho có.</b> Nhà tuyển dụng xem 60 giây đầu và "phần khó". Mở bằng kiến trúc và kết bằng bằng chứng chống tranh chấp trên hai điện thoại — thứ tự đó thể hiện sự trưởng thành kỹ thuật hơn nhiều so với đi tua từng màn CRUD. <em>Vì sao ngoài syllabus: khả năng trình bày công việc bị chấm ngầm ở khắp sự nghiệp, nhưng hiếm khi được dạy rõ.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến hai vai trò thành ERD và schema.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design|||Mục 1 — Thiết kế domain & CSDL',
      description: 'Biến hai vai trò thành use case, ERD và một schema chuẩn hoá — với ràng buộc UNIQUE(table_id, slot_id) là trái tim chống đặt trùng.',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int608-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, Table, TimeSlot, Reservation, Dish, PreOrderItem và quan hệ giữa chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"A <b>diner</b> reserves a <b>table</b> for a <b>time-slot</b>, creating a <b>reservation</b>, and pre-orders some <b>dishes</b>; a <b>staff</b> member confirms it." The nouns give us the core entities plus the account:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (DINER or STAFF), email, password hash. Both roles are Users; role decides permissions.</div>
  <div class="lz-layer"><b>DiningTable</b> — a physical table: <code>label</code> (e.g. T1), <code>seats</code>. A table <em>can host many</em> reservations over time (different slots).</div>
  <div class="lz-layer"><b>TimeSlot</b> — a bookable window: <code>slot_date</code> + <code>start_time</code> (e.g. 2026-08-01 18:00). Slots are shared across tables — a slot is just a time.</div>
  <div class="lz-layer"><b>Reservation</b> — the booking itself: which <code>diner</code> booked which <code>table</code> for which <code>slot</code>, <code>party_size</code>, <code>status</code> (PENDING / CONFIRMED / CANCELLED), created_at. This is the resource that must never double-book a (table, slot).</div>
  <div class="lz-layer"><b>Dish</b> — a menu item: <code>name</code>, <code>price</code>, <code>available</code>.</div>
  <div class="lz-layer"><b>PreOrderItem</b> — a line on a reservation: <code>reservation_id</code>, <code>dish_id</code>, <code>quantity</code>. One reservation has many items.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────────┐        ┌───────────────┐        ┌──────────────┐
│ DiningTable  │1──────*│  Reservation  │*──────1│  TimeSlot    │
└──────────────┘        └───────────────┘        └──────────────┘
                          *│        │1
                           │        └──────────┐
                          1│                   *│
                     ┌──────────┐        ┌───────────────┐        ┌────────┐
                     │   User   │        │ PreOrderItem  │*──────1│  Dish  │
                     │(DINER)   │        └───────────────┘        └────────┘
                     └──────────┘

DiningTable 1—* Reservation : a table hosts many reservations (across slots)
TimeSlot    1—* Reservation : a slot can hold reservations for many tables
(table, slot) — at most ONE active reservation  ← the rule
User 1—* Reservation        : a diner has many reservations
Reservation 1—* PreOrderItem *—1 Dish : the pre-order lines</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> Table T5 has slots 18:00, 19:00, 20:00 free tonight. Diner An reserves T5 at 19:00 and pre-orders 2 pho + 1 spring roll.
<b>Step 1 —</b> An sends POST /reservations { tableId: T5, slotId: 19:00, partySize: 4 }.
<b>Step 2 —</b> The system creates a Reservation row: diner=An, table=T5, slot=19:00, status=PENDING.
<b>Step 3 —</b> An sends POST /reservations/{id}/items with [pho x2, spring roll x1] → three-ish PreOrderItem rows.
<b>Step 4 —</b> Diner Binh now asks for free (table, slot) tonight → T5@19:00 is gone; T5@18:00 and T5@20:00 remain.
<b>Result:</b> the "at most one active reservation per (table, slot)" rule is what makes T5@19:00 disappear for Binh.</div>

<div class="pitfall"><strong>Design trap:</strong> putting <code>diner_id</code> and <code>slot</code> directly on <code>DiningTable</code> and skipping the Reservation table. Then a table can hold only one booking ever, you cannot store status, cancellation, party size or pre-orders, and history is lost. Keep the booking as its own entity.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"At most one ACTIVE reservation per (table, slot)" is a state constraint, not just a foreign key.</b> A (table, slot) pair can have many reservation rows over time (one booked, cancelled, then rebooked) — the invariant is only one <em>non-cancelled</em> at a time. In 1.2 we enforce the simple version with a UNIQUE on (table_id, slot_id); the richer version uses a partial unique index that ignores CANCELLED. <em>Why beyond syllabus: distinguishing "unique row" from "unique active state" is a modelling skill most juniors miss.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">REST fundamentals on Code Lab</span><span class="lc-sub">Resources, verbs and status codes — how these entities become endpoints.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>thực khách</b> đặt một <b>bàn</b> cho một <b>khung giờ</b>, tạo ra một <b>đặt chỗ</b>, và gọi trước vài <b>món</b>; một <b>nhân viên</b> xác nhận nó." Các danh từ cho ta các thực thể lõi cộng với tài khoản:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (DINER hoặc STAFF), email, hash mật khẩu. Cả hai vai trò đều là User; role quyết định quyền.</div>
  <div class="lz-layer"><b>DiningTable</b> — một bàn vật lý: <code>label</code> (vd T1), <code>seats</code>. Một bàn <em>có thể nhận nhiều</em> đặt chỗ theo thời gian (các khung khác nhau).</div>
  <div class="lz-layer"><b>TimeSlot</b> — một khung đặt được: <code>slot_date</code> + <code>start_time</code> (vd 2026-08-01 18:00). Khung dùng chung cho các bàn — một khung chỉ là một mốc giờ.</div>
  <div class="lz-layer"><b>Reservation</b> — chính lượt đặt: <code>diner</code> nào đặt <code>table</code> nào cho <code>slot</code> nào, <code>party_size</code>, <code>status</code> (PENDING / CONFIRMED / CANCELLED), created_at. Đây là tài nguyên không được phép đặt trùng một (bàn, khung).</div>
  <div class="lz-layer"><b>Dish</b> — một món trong thực đơn: <code>name</code>, <code>price</code>, <code>available</code>.</div>
  <div class="lz-layer"><b>PreOrderItem</b> — một dòng trên đặt chỗ: <code>reservation_id</code>, <code>dish_id</code>, <code>quantity</code>. Một đặt chỗ có nhiều dòng.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────────┐        ┌───────────────┐        ┌──────────────┐
│ DiningTable  │1──────*│  Reservation  │*──────1│  TimeSlot    │
└──────────────┘        └───────────────┘        └──────────────┘
                          *│        │1
                           │        └──────────┐
                          1│                   *│
                     ┌──────────┐        ┌───────────────┐        ┌────────┐
                     │   User   │        │ PreOrderItem  │*──────1│  Dish  │
                     │(DINER)   │        └───────────────┘        └────────┘
                     └──────────┘

DiningTable 1—* Reservation : một bàn nhận nhiều đặt chỗ (qua các khung)
TimeSlot    1—* Reservation : một khung có thể giữ đặt chỗ cho nhiều bàn
(bàn, khung) — TỐI ĐA MỘT đặt chỗ đang hoạt động  ← quy tắc
User 1—* Reservation        : một thực khách có nhiều đặt chỗ
Reservation 1—* PreOrderItem *—1 Dish : các dòng gọi món trước</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> Bàn T5 có khung 18:00, 19:00, 20:00 trống tối nay. Thực khách An đặt T5 lúc 19:00 và gọi trước 2 phở + 1 nem.
<b>Bước 1 —</b> An gửi POST /reservations { tableId: T5, slotId: 19:00, partySize: 4 }.
<b>Bước 2 —</b> Hệ thống tạo một dòng Reservation: diner=An, table=T5, slot=19:00, status=PENDING.
<b>Bước 3 —</b> An gửi POST /reservations/{id}/items với [phở x2, nem x1] → các dòng PreOrderItem.
<b>Bước 4 —</b> Thực khách Bình giờ hỏi (bàn, khung) trống tối nay → T5@19:00 đã mất; còn T5@18:00 và T5@20:00.
<b>Kết quả:</b> quy tắc "tối đa một đặt chỗ hoạt động mỗi (bàn, khung)" chính là thứ khiến T5@19:00 biến mất với Bình.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> đặt thẳng <code>diner_id</code> và <code>slot</code> lên <code>DiningTable</code> và bỏ bảng Reservation. Khi đó một bàn chỉ giữ được một lượt đặt duy nhất, bạn không lưu được trạng thái, việc huỷ, số khách hay món gọi trước, và mất lịch sử. Hãy giữ lượt đặt là một thực thể riêng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Tối đa một đặt chỗ ĐANG HOẠT ĐỘNG mỗi (bàn, khung)" là ràng buộc trạng thái, không chỉ là khoá ngoại.</b> Một cặp (bàn, khung) có thể có nhiều dòng reservation theo thời gian (một cái đặt, huỷ, rồi đặt lại) — bất biến là chỉ một cái <em>chưa huỷ</em> tại một thời điểm. Ở 1.2 ta thực thi phiên bản đơn giản bằng UNIQUE trên (table_id, slot_id); phiên bản đầy đủ dùng partial unique index bỏ qua CANCELLED. <em>Vì sao ngoài syllabus: phân biệt "dòng duy nhất" với "trạng thái hoạt động duy nhất" là kỹ năng mô hình hoá đa số junior bỏ sót.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Nền tảng REST trên Code Lab</span><span class="lc-sub">Tài nguyên, động từ và status code — cách các thực thể này thành endpoint.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The schema & the constraint that prevents double-booking|||1.2 — Schema & ràng buộc chống đặt trùng',
          slug: 'int608-schema',
          type: 'VIDEO',
          description: 'DDL PostgreSQL đầy đủ + ràng buộc UNIQUE(table_id, slot_id): hàng rào cuối cùng chống đặt trùng, do CSDL bảo đảm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The schema &amp; the constraint that prevents double-booking</h2>
<p class="lead">Here is the whole database. Notice one line — the <code>UNIQUE (table_id, slot_id)</code> on <code>reservations</code>. That single constraint is your <strong>last line of defence</strong>: even if two requests slip past every check in your JavaScript, the database itself refuses to write two active reservations for one (table, slot).</p>

<h3>The DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- bcrypt hash</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(10)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- DINER | STAFF</span>
);

<span class="tok-keyword">CREATE TABLE</span> dining_tables (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  label       <span class="tok-type">VARCHAR</span>(20) <span class="tok-keyword">UNIQUE NOT NULL</span>,     <span class="tok-comment">-- T1, T2, ...</span>
  seats       <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>
);

<span class="tok-keyword">CREATE TABLE</span> time_slots (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  slot_date   <span class="tok-type">DATE</span> <span class="tok-keyword">NOT NULL</span>,
  start_time  <span class="tok-type">TIME</span> <span class="tok-keyword">NOT NULL</span>,
  <span class="tok-keyword">UNIQUE</span> (slot_date, start_time)              <span class="tok-comment">-- one slot per date+time</span>
);

<span class="tok-keyword">CREATE TABLE</span> dishes (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  name        <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  price       <span class="tok-type">NUMERIC</span>(10,2) <span class="tok-keyword">NOT NULL</span>,
  available   <span class="tok-type">BOOLEAN</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-keyword">true</span>
);

<span class="tok-keyword">CREATE TABLE</span> reservations (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  table_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> dining_tables(id),
  slot_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> time_slots(id),
  diner_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  party_size  <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,
  status      <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'PENDING'</span>, <span class="tok-comment">-- PENDING|CONFIRMED|CANCELLED</span>
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  <span class="tok-keyword">CONSTRAINT</span> uq_table_slot <span class="tok-keyword">UNIQUE</span> (table_id, slot_id)  <span class="tok-comment">-- ★ no double-booking</span>
);

<span class="tok-keyword">CREATE TABLE</span> pre_order_items (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  reservation_id <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> reservations(id) <span class="tok-keyword">ON DELETE CASCADE</span>,
  dish_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> dishes(id),
  quantity    <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-number">1</span>,
  <span class="tok-keyword">CONSTRAINT</span> uq_res_dish <span class="tok-keyword">UNIQUE</span> (reservation_id, dish_id) <span class="tok-comment">-- one line per dish</span>
);</pre>

<h3>Worked example — why the UNIQUE is the real guard</h3>
<div class="out"><b>Scenario:</b> two INSERTs for (table_id=5, slot_id=42) arrive at the same millisecond.
<b>Step 1 —</b> Transaction A: INSERT reservation (5, 42) → row written, not yet committed.
<b>Step 2 —</b> Transaction B: INSERT reservation (5, 42) → PostgreSQL sees the pending unique key → <b>B waits</b>.
<b>Step 3 —</b> A commits. The unique key (5, 42) now exists.
<b>Step 4 —</b> B is released → its INSERT violates <code>uq_table_slot</code> → <b>ERROR: duplicate key value violates unique constraint</b> (SQLSTATE 23505).
<b>Result:</b> exactly one reservation exists. Your backend catches error <code>23505</code> and returns <b>409 Conflict</b>. The database, not your <code>if</code>-statement, guarantees correctness.</div>

<div class="pitfall"><strong>Trap:</strong> relying only on a JavaScript check like <code>if (await isFree(table, slot))</code>. Between your read and your write, another request can read the same "free" answer — the classic <em>race condition</em>. The JS check is a fast path for the common case; the UNIQUE constraint is the guarantee. You need both. Section 4 shows the full defence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The richer rule with a partial index.</b> To allow a cancelled (table, slot) to be re-booked while still forbidding two <em>active</em> reservations, drop the plain UNIQUE and use:
<pre><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_res
  <span class="tok-keyword">ON</span> reservations (table_id, slot_id)
  <span class="tok-keyword">WHERE</span> status <span class="tok-keyword">IN</span> (<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>);</pre>
Now a (table, slot) can have one CANCELLED row plus one active row. <em>Why beyond syllabus: partial (filtered) indexes are a Postgres power feature that models "unique among active rows" — exactly the state constraint from 1.1.</em></div>

<div class="note-ct">In the backend (Section 2) you write these queries with node-postgres. Knowing the SQL underneath is what lets you debug when a constraint fires.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Schema &amp; ràng buộc chống đặt trùng</h2>
<p class="lead">Đây là toàn bộ CSDL. Chú ý một dòng — <code>UNIQUE (table_id, slot_id)</code> trên <code>reservations</code>. Ràng buộc đơn lẻ đó là <strong>hàng rào cuối cùng</strong>: kể cả khi hai request lọt qua mọi kiểm tra trong JavaScript, chính CSDL từ chối ghi hai đặt chỗ hoạt động cho một (bàn, khung).</p>

<h3>DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- hash bcrypt</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(10)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- DINER | STAFF</span>
);

<span class="tok-keyword">CREATE TABLE</span> dining_tables (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  label       <span class="tok-type">VARCHAR</span>(20) <span class="tok-keyword">UNIQUE NOT NULL</span>,     <span class="tok-comment">-- T1, T2, ...</span>
  seats       <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>
);

<span class="tok-keyword">CREATE TABLE</span> time_slots (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  slot_date   <span class="tok-type">DATE</span> <span class="tok-keyword">NOT NULL</span>,
  start_time  <span class="tok-type">TIME</span> <span class="tok-keyword">NOT NULL</span>,
  <span class="tok-keyword">UNIQUE</span> (slot_date, start_time)              <span class="tok-comment">-- một khung mỗi ngày+giờ</span>
);

<span class="tok-keyword">CREATE TABLE</span> dishes (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  name        <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  price       <span class="tok-type">NUMERIC</span>(10,2) <span class="tok-keyword">NOT NULL</span>,
  available   <span class="tok-type">BOOLEAN</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-keyword">true</span>
);

<span class="tok-keyword">CREATE TABLE</span> reservations (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  table_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> dining_tables(id),
  slot_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> time_slots(id),
  diner_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  party_size  <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,
  status      <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'PENDING'</span>, <span class="tok-comment">-- PENDING|CONFIRMED|CANCELLED</span>
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  <span class="tok-keyword">CONSTRAINT</span> uq_table_slot <span class="tok-keyword">UNIQUE</span> (table_id, slot_id)  <span class="tok-comment">-- ★ chống đặt trùng</span>
);

<span class="tok-keyword">CREATE TABLE</span> pre_order_items (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  reservation_id <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> reservations(id) <span class="tok-keyword">ON DELETE CASCADE</span>,
  dish_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> dishes(id),
  quantity    <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-number">1</span>,
  <span class="tok-keyword">CONSTRAINT</span> uq_res_dish <span class="tok-keyword">UNIQUE</span> (reservation_id, dish_id) <span class="tok-comment">-- một dòng mỗi món</span>
);</pre>

<h3>Ví dụ có lời giải — vì sao UNIQUE mới là hàng rào thật</h3>
<div class="out"><b>Tình huống:</b> hai INSERT cho (table_id=5, slot_id=42) đến cùng một mili-giây.
<b>Bước 1 —</b> Transaction A: INSERT reservation (5, 42) → dòng đã ghi, chưa commit.
<b>Bước 2 —</b> Transaction B: INSERT reservation (5, 42) → PostgreSQL thấy unique key đang chờ → <b>B đợi</b>.
<b>Bước 3 —</b> A commit. Unique key (5, 42) giờ tồn tại.
<b>Bước 4 —</b> B được thả → INSERT của nó vi phạm <code>uq_table_slot</code> → <b>ERROR: duplicate key value violates unique constraint</b> (SQLSTATE 23505).
<b>Kết quả:</b> đúng một đặt chỗ tồn tại. Backend bắt lỗi <code>23505</code> và trả <b>409 Conflict</b>. CSDL, chứ không phải câu <code>if</code> của bạn, mới bảo đảm tính đúng.</div>

<div class="pitfall"><strong>Bẫy:</strong> chỉ dựa vào câu kiểm JavaScript như <code>if (await isFree(table, slot))</code>. Giữa lúc đọc và lúc ghi, một request khác có thể đọc phải cùng câu trả lời "trống" — chính là <em>race condition</em>. Câu kiểm JS là đường nhanh cho trường hợp thường; ràng buộc UNIQUE mới là sự bảo đảm. Bạn cần cả hai. Mục 4 chỉ đủ cách phòng thủ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy tắc đầy đủ với partial index.</b> Để cho phép đặt lại một (bàn, khung) đã huỷ mà vẫn cấm hai đặt chỗ <em>đang hoạt động</em>, bỏ UNIQUE thường và dùng:
<pre><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_res
  <span class="tok-keyword">ON</span> reservations (table_id, slot_id)
  <span class="tok-keyword">WHERE</span> status <span class="tok-keyword">IN</span> (<span class="tok-string">'PENDING'</span>, <span class="tok-string">'CONFIRMED'</span>);</pre>
Giờ một (bàn, khung) có thể có một dòng CANCELLED cộng một dòng hoạt động. <em>Vì sao ngoài syllabus: partial (filtered) index là tính năng mạnh của Postgres mô hình hoá "duy nhất trong các dòng hoạt động" — chính là ràng buộc trạng thái ở 1.1.</em></div>

<div class="note-ct">Ở backend (Mục 2) bạn viết các truy vấn này bằng node-postgres. Biết SQL bên dưới mới giúp bạn debug khi một ràng buộc kích hoạt.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int608-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, cardinality và ràng buộc chống đặt trùng.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'What must never be double-booked, and where does the guarantee live?|||Cái gì không được đặt trùng, và sự bảo đảm nằm ở đâu?',
                options: [
                  'A dish; guaranteed by a Dart if-check|||Một món; bảo đảm bằng câu if trong Dart',
                  'A (table, slot) pair; guaranteed by a UNIQUE constraint in the database|||Một cặp (bàn, khung); bảo đảm bằng ràng buộc UNIQUE trong CSDL',
                  'A user; guaranteed by JWT|||Một user; bảo đảm bằng JWT',
                  'A reservation; guaranteed by the Flutter app|||Một đặt chỗ; bảo đảm bằng app Flutter',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The relationship "a table hosts many reservations over time" is which cardinality?|||Quan hệ "một bàn nhận nhiều đặt chỗ theo thời gian" là lực lượng nào?',
                options: ['1—1', '1—* (one-to-many)|||1—* (một-nhiều)', '*—* (many-to-many)|||*—* (nhiều-nhiều)', '0—0'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why keep Reservation as its own table instead of putting diner_id + slot on DiningTable?|||Vì sao giữ Reservation là bảng riêng thay vì đặt diner_id + slot lên DiningTable?',
                options: [
                  'It is faster to query|||Truy vấn nhanh hơn',
                  'To store status, cancellation, party size, pre-orders and history|||Để lưu trạng thái, việc huỷ, số khách, món gọi trước và lịch sử',
                  'The framework requires it|||Framework bắt buộc',
                  'To avoid using a foreign key|||Để tránh dùng khoá ngoại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Two INSERTs hit the same (table_id, slot_id) at once with UNIQUE(table_id, slot_id). What happens?|||Hai INSERT cùng (table_id, slot_id) một lúc với UNIQUE(table_id, slot_id). Điều gì xảy ra?',
                options: [
                  'Both succeed|||Cả hai thành công',
                  'Both fail|||Cả hai thất bại',
                  'Exactly one commits; the other violates the constraint (23505) and is rejected|||Đúng một cái commit; cái kia vi phạm ràng buộc (23505) và bị từ chối',
                  'The database crashes|||CSDL sập',
                ], correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) A partial unique index WHERE status IN (PENDING, CONFIRMED) lets you…|||(Ngoài giáo trình) Partial unique index WHERE status IN (PENDING, CONFIRMED) cho phép bạn…',
                options: [
                  'Book two active (table, slot) rows at once|||Đặt hai (bàn, khung) hoạt động cùng lúc',
                  'Re-book a (table, slot) after its earlier reservation was cancelled, while still forbidding two active bookings|||Đặt lại một (bàn, khung) sau khi đặt chỗ trước đã huỷ, mà vẫn cấm hai đặt chỗ đang hoạt động',
                  'Skip the foreign key|||Bỏ khoá ngoại',
                  'Store passwords|||Lưu mật khẩu',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ MỤC 2 — REST BACKEND & CÁC LỚP ══════════════════ */
    {
      title: 'Section 2 — The REST Backend & its Layers|||Mục 2 — REST Backend & các lớp',
      description: 'Dựng một REST API nhẹ (Express + node-postgres) theo lớp route→service→data, và một lát cắt dọc "GET khung trống".',
      lessons: [
        {
          title: '2.1 — Project setup & the layered architecture|||2.1 — Khởi tạo dự án & kiến trúc phân lớp',
          slug: 'int608-backend-setup',
          type: 'VIDEO',
          description: 'Khởi tạo Express, kết nối PostgreSQL bằng pg Pool, và tách route → service → data cho gọn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.1</span>
<h2>Project setup &amp; the layered architecture</h2>
<p class="lead">The backend is deliberately small — the app is the star. But small does not mean messy: split it into three layers so the concurrency logic has one obvious home. <strong>Routes</strong> handle HTTP, <strong>services</strong> hold business rules, <strong>data</strong> talks to Postgres.</p>

<h3>The layers</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route (HTTP)</b> — parse the request, call a service, map the result or error to a status code + JSON. No SQL here.</div>
  <div class="lz-layer"><b>Service (rules)</b> — "reserve a table", "confirm a reservation". This is where the transaction lives. No <code>req</code>/<code>res</code> here — pure functions you can unit-test.</div>
  <div class="lz-layer"><b>Data (SQL)</b> — a thin wrapper over <code>pg</code>: run queries, return rows. One place that knows table names.</div>
</div>

<h3>Wiring Express + a pg pool</h3>
<pre><span class="tok-comment">// db.js — one shared connection pool</span>
<span class="tok-keyword">import</span> pg <span class="tok-keyword">from</span> <span class="tok-string">'pg'</span>;
<span class="tok-keyword">export const</span> pool = <span class="tok-keyword">new</span> pg.<span class="tok-type">Pool</span>({
  connectionString: process.env.<span class="tok-type">DATABASE_URL</span>,   <span class="tok-comment">// postgres://user:pass@db:5432/resto</span>
});

<span class="tok-comment">// server.js — the app</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> authRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/auth.js'</span>;
<span class="tok-keyword">import</span> slotRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/slots.js'</span>;
<span class="tok-keyword">import</span> reservationRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/reservations.js'</span>;

<span class="tok-keyword">const</span> app = <span class="tok-function">express</span>();
app.<span class="tok-function">use</span>(express.<span class="tok-function">json</span>());
app.<span class="tok-function">use</span>(<span class="tok-string">'/auth'</span>, authRoutes);
app.<span class="tok-function">use</span>(<span class="tok-string">'/slots'</span>, slotRoutes);
app.<span class="tok-function">use</span>(<span class="tok-string">'/reservations'</span>, reservationRoutes);
app.<span class="tok-function">listen</span>(<span class="tok-number">3000</span>, () =&gt; console.<span class="tok-function">log</span>(<span class="tok-string">'API on :3000'</span>));</pre>

<h3>Worked example — a route delegating to a service</h3>
<div class="out"><b>Request:</b> GET /slots?date=2026-08-01
<b>Step 1 —</b> Route reads <code>req.query.date</code>, validates it is a date.
<b>Step 2 —</b> Route calls <code>slotService.freeSlots(date)</code> — no SQL in the route.
<b>Step 3 —</b> Service calls the data layer <code>slotData.findFree(date)</code>.
<b>Step 4 —</b> Data runs one SQL query and returns rows.
<b>Step 5 —</b> Route sends <code>res.json(rows)</code> with status 200.
<b>Result:</b> each layer has one job; when the concurrency bug appears in Section 4, you know exactly which file to open — the service.</div>

<div class="pitfall"><strong>Trap:</strong> writing SQL directly inside route handlers. It works for one endpoint, then the same query is copy-pasted into three routes, and a schema change means editing all three. Keep queries in the data layer, called by services.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A pool, not a connection.</b> <code>new pg.Pool()</code> reuses a set of connections instead of opening one per request. Under the two-diner race in Section 4, each request grabs its own pooled connection and its own transaction — which is exactly why they can truly run in parallel and collide on the UNIQUE. A single shared connection would serialise them and hide the bug. <em>Why beyond syllabus: connection pooling and its concurrency implications are an operations concern the syllabus rarely covers.</em></div>

<a class="link-card codelab" href="/code-lab/dart?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-1129" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Functions on Code Lab</span><span class="lc-sub">Parameters, return values and pure functions — the shape of your service layer.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.1</span>
<h2>Khởi tạo dự án &amp; kiến trúc phân lớp</h2>
<p class="lead">Backend cố tình nhỏ — app mới là ngôi sao. Nhưng nhỏ không có nghĩa là lộn xộn: tách thành ba lớp để logic tương tranh có một chỗ rõ ràng. <strong>Route</strong> xử lý HTTP, <strong>service</strong> giữ luật nghiệp vụ, <strong>data</strong> nói chuyện với Postgres.</p>

<h3>Các lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route (HTTP)</b> — đọc request, gọi service, ánh xạ kết quả hoặc lỗi thành status code + JSON. Không có SQL ở đây.</div>
  <div class="lz-layer"><b>Service (luật)</b> — "đặt một bàn", "xác nhận đặt chỗ". Transaction sống ở đây. Không có <code>req</code>/<code>res</code> — hàm thuần bạn unit-test được.</div>
  <div class="lz-layer"><b>Data (SQL)</b> — lớp mỏng trên <code>pg</code>: chạy truy vấn, trả dòng. Một chỗ duy nhất biết tên bảng.</div>
</div>

<h3>Đấu nối Express + pg pool</h3>
<pre><span class="tok-comment">// db.js — một pool kết nối dùng chung</span>
<span class="tok-keyword">import</span> pg <span class="tok-keyword">from</span> <span class="tok-string">'pg'</span>;
<span class="tok-keyword">export const</span> pool = <span class="tok-keyword">new</span> pg.<span class="tok-type">Pool</span>({
  connectionString: process.env.<span class="tok-type">DATABASE_URL</span>,   <span class="tok-comment">// postgres://user:pass@db:5432/resto</span>
});

<span class="tok-comment">// server.js — app</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> authRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/auth.js'</span>;
<span class="tok-keyword">import</span> slotRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/slots.js'</span>;
<span class="tok-keyword">import</span> reservationRoutes <span class="tok-keyword">from</span> <span class="tok-string">'./routes/reservations.js'</span>;

<span class="tok-keyword">const</span> app = <span class="tok-function">express</span>();
app.<span class="tok-function">use</span>(express.<span class="tok-function">json</span>());
app.<span class="tok-function">use</span>(<span class="tok-string">'/auth'</span>, authRoutes);
app.<span class="tok-function">use</span>(<span class="tok-string">'/slots'</span>, slotRoutes);
app.<span class="tok-function">use</span>(<span class="tok-string">'/reservations'</span>, reservationRoutes);
app.<span class="tok-function">listen</span>(<span class="tok-number">3000</span>, () =&gt; console.<span class="tok-function">log</span>(<span class="tok-string">'API on :3000'</span>));</pre>

<h3>Ví dụ có lời giải — một route uỷ thác cho service</h3>
<div class="out"><b>Request:</b> GET /slots?date=2026-08-01
<b>Bước 1 —</b> Route đọc <code>req.query.date</code>, kiểm nó là một ngày.
<b>Bước 2 —</b> Route gọi <code>slotService.freeSlots(date)</code> — không SQL trong route.
<b>Bước 3 —</b> Service gọi lớp data <code>slotData.findFree(date)</code>.
<b>Bước 4 —</b> Data chạy một truy vấn SQL và trả dòng.
<b>Bước 5 —</b> Route gửi <code>res.json(rows)</code> với status 200.
<b>Kết quả:</b> mỗi lớp một việc; khi bug tương tranh xuất hiện ở Mục 4, bạn biết chính xác mở file nào — service.</div>

<div class="pitfall"><strong>Bẫy:</strong> viết SQL thẳng trong route handler. Nó chạy cho một endpoint, rồi cùng truy vấn bị copy sang ba route, và một thay đổi schema nghĩa là sửa cả ba. Hãy giữ truy vấn ở lớp data, được service gọi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một pool, không phải một connection.</b> <code>new pg.Pool()</code> tái dùng một tập kết nối thay vì mở một cái mỗi request. Dưới cuộc đua hai thực khách ở Mục 4, mỗi request giành một connection riêng và một transaction riêng — chính vì thế chúng mới thật sự chạy song song và đụng nhau ở UNIQUE. Một connection dùng chung sẽ tuần tự hoá chúng và giấu mất bug. <em>Vì sao ngoài syllabus: pooling kết nối và hệ quả tương tranh của nó là mối bận tâm vận hành mà giáo trình hiếm khi chạm tới.</em></div>

<a class="link-card codelab" href="/code-lab/dart?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-1129" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Hàm trên Code Lab</span><span class="lc-sub">Tham số, giá trị trả về và hàm thuần — hình dạng của lớp service.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Worked slice: GET free slots for a date|||2.2 — Lát cắt có lời giải: GET khung trống theo ngày',
          slug: 'int608-slice-slots',
          type: 'VIDEO',
          description: 'Một endpoint đọc hoàn chỉnh: SQL tính (bàn, khung) chưa bị đặt, service, route — mẫu bạn nhân bản.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>Worked slice — GET free (table, slot) options for a date</h2>
<p class="lead">Build one read endpoint end-to-end. It is the pattern every other read reuses, and it is what the Flutter reservation screen calls first. The interesting part is the SQL: "give me every (table, slot) that has no active reservation on this date".</p>

<h3>The data layer — the availability query</h3>
<pre><span class="tok-comment">// data/slotData.js</span>
<span class="tok-keyword">import</span> { pool } <span class="tok-keyword">from</span> <span class="tok-string">'../db.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">findFree</span>(date) {
  <span class="tok-keyword">const</span> { rows } = <span class="tok-keyword">await</span> pool.<span class="tok-function">query</span>(
    <span class="tok-string">\`SELECT t.id AS table_id, t.label, t.seats,
            s.id AS slot_id, s.start_time
       FROM dining_tables t
       CROSS JOIN time_slots s
       LEFT JOIN reservations r
         ON r.table_id = t.id AND r.slot_id = s.id
        AND r.status IN ('PENDING','CONFIRMED')
      WHERE s.slot_date = \$1
        AND r.id IS NULL              -- no active reservation = FREE
      ORDER BY s.start_time, t.label\`</span>,
    [date]
  );
  <span class="tok-keyword">return</span> rows;
}</pre>

<h3>The service &amp; the route</h3>
<pre><span class="tok-comment">// services/slotService.js</span>
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> slotData <span class="tok-keyword">from</span> <span class="tok-string">'../data/slotData.js'</span>;
<span class="tok-keyword">export const</span> freeSlots = (date) =&gt; slotData.<span class="tok-function">findFree</span>(date);

<span class="tok-comment">// routes/slots.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> slotService <span class="tok-keyword">from</span> <span class="tok-string">'../services/slotService.js'</span>;
<span class="tok-keyword">const</span> r = <span class="tok-function">Router</span>();

r.<span class="tok-function">get</span>(<span class="tok-string">'/'</span>, <span class="tok-keyword">async</span> (req, res) =&gt; {
  <span class="tok-keyword">const</span> date = req.query.date;
  <span class="tok-keyword">if</span> (!date) <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">400</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'date is required'</span> });
  <span class="tok-keyword">const</span> slots = <span class="tok-keyword">await</span> slotService.<span class="tok-function">freeSlots</span>(date);
  res.<span class="tok-function">json</span>(slots);
});
<span class="tok-keyword">export default</span> r;</pre>

<h3>Worked example — running it against seed data</h3>
<div class="out"><b>Seed:</b> tables T1,T2; slots 18:00,19:00 on 2026-08-01; one reservation T1@18:00 (PENDING).
<b>Call:</b> GET /slots?date=2026-08-01
<b>SQL yields:</b> T1@19:00, T2@18:00, T2@19:00  (T1@18:00 is filtered out — it has an active reservation)
<b>Response 200:</b>
[ {"table_id":1,"label":"T1","slot_id":2,"start_time":"19:00"},
  {"table_id":2,"label":"T2","slot_id":1,"start_time":"18:00"},
  {"table_id":2,"label":"T2","slot_id":2,"start_time":"19:00"} ]
<b>Result:</b> the LEFT JOIN + <code>r.id IS NULL</code> is the "only FREE" filter the Flutter list renders.</div>

<div class="pitfall"><strong>Trap:</strong> filtering the join on status in the WHERE clause instead of the ON clause. <code>WHERE r.status IN (...)</code> turns the LEFT JOIN back into an INNER JOIN and drops the free rows entirely. The status condition must sit in the <code>ON</code>, so unmatched (free) rows survive with <code>r.id IS NULL</code>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Anti-join, said properly.</b> "Rows in A with no match in B" is a LEFT JOIN … IS NULL anti-join. The same shape answers "products never ordered", "users with no login". Recognising the anti-join pattern lets you write availability queries without a slow <code>NOT IN</code> subquery. <em>Why beyond syllabus: naming and reusing query patterns is the difference between copying SQL and understanding it.</em></div>

<a class="link-card codelab" href="/code-lab/dart?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-1133" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">OOP on Code Lab</span><span class="lc-sub">Classes and objects in Dart — how your API JSON becomes typed models in the app.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Lát cắt có lời giải — GET (bàn, khung) trống theo ngày</h2>
<p class="lead">Xây một endpoint đọc trọn vẹn từ đầu đến cuối. Đây là mẫu mọi endpoint đọc khác tái dùng, và là thứ màn đặt bàn Flutter gọi đầu tiên. Phần thú vị là SQL: "cho tôi mọi (bàn, khung) không có đặt chỗ hoạt động trong ngày này".</p>

<h3>Lớp data — truy vấn khả dụng</h3>
<pre><span class="tok-comment">// data/slotData.js</span>
<span class="tok-keyword">import</span> { pool } <span class="tok-keyword">from</span> <span class="tok-string">'../db.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">findFree</span>(date) {
  <span class="tok-keyword">const</span> { rows } = <span class="tok-keyword">await</span> pool.<span class="tok-function">query</span>(
    <span class="tok-string">\`SELECT t.id AS table_id, t.label, t.seats,
            s.id AS slot_id, s.start_time
       FROM dining_tables t
       CROSS JOIN time_slots s
       LEFT JOIN reservations r
         ON r.table_id = t.id AND r.slot_id = s.id
        AND r.status IN ('PENDING','CONFIRMED')
      WHERE s.slot_date = \$1
        AND r.id IS NULL              -- khong co dat cho hoat dong = FREE
      ORDER BY s.start_time, t.label\`</span>,
    [date]
  );
  <span class="tok-keyword">return</span> rows;
}</pre>

<h3>Service &amp; route</h3>
<pre><span class="tok-comment">// services/slotService.js</span>
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> slotData <span class="tok-keyword">from</span> <span class="tok-string">'../data/slotData.js'</span>;
<span class="tok-keyword">export const</span> freeSlots = (date) =&gt; slotData.<span class="tok-function">findFree</span>(date);

<span class="tok-comment">// routes/slots.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> slotService <span class="tok-keyword">from</span> <span class="tok-string">'../services/slotService.js'</span>;
<span class="tok-keyword">const</span> r = <span class="tok-function">Router</span>();

r.<span class="tok-function">get</span>(<span class="tok-string">'/'</span>, <span class="tok-keyword">async</span> (req, res) =&gt; {
  <span class="tok-keyword">const</span> date = req.query.date;
  <span class="tok-keyword">if</span> (!date) <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">400</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'date is required'</span> });
  <span class="tok-keyword">const</span> slots = <span class="tok-keyword">await</span> slotService.<span class="tok-function">freeSlots</span>(date);
  res.<span class="tok-function">json</span>(slots);
});
<span class="tok-keyword">export default</span> r;</pre>

<h3>Ví dụ có lời giải — chạy với dữ liệu seed</h3>
<div class="out"><b>Seed:</b> bàn T1,T2; khung 18:00,19:00 ngày 2026-08-01; một đặt chỗ T1@18:00 (PENDING).
<b>Gọi:</b> GET /slots?date=2026-08-01
<b>SQL cho ra:</b> T1@19:00, T2@18:00, T2@19:00  (T1@18:00 bị lọc — nó có đặt chỗ hoạt động)
<b>Phản hồi 200:</b>
[ {"table_id":1,"label":"T1","slot_id":2,"start_time":"19:00"},
  {"table_id":2,"label":"T2","slot_id":1,"start_time":"18:00"},
  {"table_id":2,"label":"T2","slot_id":2,"start_time":"19:00"} ]
<b>Kết quả:</b> LEFT JOIN + <code>r.id IS NULL</code> chính là bộ lọc "chỉ TRỐNG" mà danh sách Flutter hiển thị.</div>

<div class="pitfall"><strong>Bẫy:</strong> lọc theo status ở mệnh đề WHERE thay vì mệnh đề ON. <code>WHERE r.status IN (...)</code> biến LEFT JOIN thành INNER JOIN và làm mất sạch các dòng trống. Điều kiện status phải nằm trong <code>ON</code>, để các dòng không khớp (trống) sống sót với <code>r.id IS NULL</code>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Anti-join, gọi cho đúng tên.</b> "Các dòng trong A không có cặp trong B" là một anti-join LEFT JOIN … IS NULL. Cùng hình dạng đó trả lời "sản phẩm chưa từng bán", "user chưa đăng nhập". Nhận ra mẫu anti-join giúp bạn viết truy vấn khả dụng mà không cần subquery <code>NOT IN</code> chậm chạp. <em>Vì sao ngoài syllabus: đặt tên và tái dùng mẫu truy vấn là khác biệt giữa copy SQL và hiểu nó.</em></div>

<a class="link-card codelab" href="/code-lab/dart?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-1133" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">OOP trên Code Lab</span><span class="lc-sub">Lớp và đối tượng trong Dart — cách JSON API thành model có kiểu trong app.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 3 — XÁC THỰC & PHÂN QUYỀN (JWT) ══════════════════ */
    {
      title: 'Section 3 — Authentication & Roles (JWT)|||Mục 3 — Xác thực & Phân quyền (JWT)',
      description: 'Đăng ký/đăng nhập phát JWT, lưu token an toàn bằng flutter_secure_storage, và phân quyền DINER vs STAFF ở cả hai đầu.',
      lessons: [
        {
          title: '3.1 — Register, login, issue a JWT & store it securely|||3.1 — Đăng ký, đăng nhập, phát JWT & lưu an toàn',
          slug: 'int608-auth-jwt',
          type: 'VIDEO',
          description: 'Hash mật khẩu bằng bcrypt, phát JWT ở backend, và lưu token trong flutter_secure_storage (không phải prefs thường).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.1</span>
<h2>Register, login, issue a JWT &amp; store it securely</h2>
<p class="lead">Auth is two halves. The <strong>backend</strong> hashes passwords with bcrypt and signs a JWT on login. The <strong>app</strong> keeps that token in the OS secure store — the Keychain on iOS, EncryptedSharedPreferences on Android — never in plain <code>SharedPreferences</code>.</p>

<h3>Backend — hash on register, sign on login</h3>
<pre><span class="tok-comment">// services/authService.js</span>
<span class="tok-keyword">import</span> bcrypt <span class="tok-keyword">from</span> <span class="tok-string">'bcryptjs'</span>;
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">register</span>(email, password, fullName, role) {
  <span class="tok-keyword">const</span> hash = <span class="tok-keyword">await</span> bcrypt.<span class="tok-function">hash</span>(password, <span class="tok-number">10</span>);
  <span class="tok-keyword">return</span> userData.<span class="tok-function">insert</span>(email, hash, fullName, role);
}

<span class="tok-keyword">export async function</span> <span class="tok-function">login</span>(email, password) {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> userData.<span class="tok-function">findByEmail</span>(email);
  <span class="tok-keyword">if</span> (!user || !<span class="tok-keyword">await</span> bcrypt.<span class="tok-function">compare</span>(password, user.password))
    <span class="tok-keyword">throw</span> { status: <span class="tok-number">401</span>, message: <span class="tok-string">'Invalid credentials'</span> };
  <span class="tok-keyword">const</span> token = jwt.<span class="tok-function">sign</span>(
    { sub: user.id, role: user.role },        <span class="tok-comment">// role travels inside the token</span>
    process.env.<span class="tok-type">JWT_SECRET</span>,
    { expiresIn: <span class="tok-string">'7d'</span> }
  );
  <span class="tok-keyword">return</span> { token, role: user.role, fullName: user.full_name };
}</pre>

<h3>App — store the token in the secure store</h3>
<pre><span class="tok-comment">// lib/services/token_store.dart</span>
<span class="tok-keyword">import</span> <span class="tok-string">'package:flutter_secure_storage/flutter_secure_storage.dart'</span>;

<span class="tok-keyword">class</span> <span class="tok-type">TokenStore</span> {
  <span class="tok-keyword">static const</span> _key = <span class="tok-string">'jwt'</span>;
  <span class="tok-keyword">final</span> _storage = <span class="tok-keyword">const</span> <span class="tok-type">FlutterSecureStorage</span>();

  <span class="tok-type">Future</span>&lt;<span class="tok-keyword">void</span>&gt; <span class="tok-function">save</span>(<span class="tok-type">String</span> token) =&gt; _storage.<span class="tok-function">write</span>(key: _key, value: token);
  <span class="tok-type">Future</span>&lt;<span class="tok-type">String</span>?&gt; <span class="tok-function">read</span>() =&gt; _storage.<span class="tok-function">read</span>(key: _key);
  <span class="tok-type">Future</span>&lt;<span class="tok-keyword">void</span>&gt; <span class="tok-function">clear</span>() =&gt; _storage.<span class="tok-function">delete</span>(key: _key);
}</pre>

<h3>Worked example — the login round-trip</h3>
<div class="out"><b>Step 1 —</b> App POST /auth/login { email, password }.
<b>Step 2 —</b> Backend finds the user, <code>bcrypt.compare</code> succeeds.
<b>Step 3 —</b> Backend signs a JWT carrying { sub: 7, role: "DINER" }, returns { token, role }.
<b>Step 4 —</b> App calls <code>tokenStore.save(token)</code> → written to EncryptedSharedPreferences (Android).
<b>Step 5 —</b> App restarts a day later → <code>tokenStore.read()</code> returns the token → user is still logged in, no re-login.
<b>Result:</b> the token survives app restarts, is encrypted at rest, and carries the role so both sides know who is calling.</div>

<div class="pitfall"><strong>Trap:</strong> storing the JWT in <code>SharedPreferences</code> "just to ship faster". On a rooted device that file is plain text — a graded security finding. <code>flutter_secure_storage</code> is one dependency and the same API shape; use it from day one.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Put the role in the token, verify it on the server.</b> The JWT carries <code>role</code> so the app can hide staff buttons — but that is UX, not security. The server must re-check the role on every protected route (Lesson 3.2), because a token is readable and a determined user can call your API directly with <code>curl</code>. Client-side role checks decorate; server-side role checks defend. <em>Why beyond syllabus: "never trust the client" is a security axiom the syllabus states but rarely makes you feel.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-529" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; security on Code Lab</span><span class="lc-sub">Tokens, hashing and protecting endpoints — the theory behind this lesson.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.1</span>
<h2>Đăng ký, đăng nhập, phát JWT &amp; lưu an toàn</h2>
<p class="lead">Xác thực có hai nửa. <strong>Backend</strong> hash mật khẩu bằng bcrypt và ký một JWT khi đăng nhập. <strong>App</strong> giữ token đó trong kho an toàn của HĐH — Keychain trên iOS, EncryptedSharedPreferences trên Android — không bao giờ để trong <code>SharedPreferences</code> thường.</p>

<h3>Backend — hash khi đăng ký, ký khi đăng nhập</h3>
<pre><span class="tok-comment">// services/authService.js</span>
<span class="tok-keyword">import</span> bcrypt <span class="tok-keyword">from</span> <span class="tok-string">'bcryptjs'</span>;
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">register</span>(email, password, fullName, role) {
  <span class="tok-keyword">const</span> hash = <span class="tok-keyword">await</span> bcrypt.<span class="tok-function">hash</span>(password, <span class="tok-number">10</span>);
  <span class="tok-keyword">return</span> userData.<span class="tok-function">insert</span>(email, hash, fullName, role);
}

<span class="tok-keyword">export async function</span> <span class="tok-function">login</span>(email, password) {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> userData.<span class="tok-function">findByEmail</span>(email);
  <span class="tok-keyword">if</span> (!user || !<span class="tok-keyword">await</span> bcrypt.<span class="tok-function">compare</span>(password, user.password))
    <span class="tok-keyword">throw</span> { status: <span class="tok-number">401</span>, message: <span class="tok-string">'Invalid credentials'</span> };
  <span class="tok-keyword">const</span> token = jwt.<span class="tok-function">sign</span>(
    { sub: user.id, role: user.role },        <span class="tok-comment">// role di trong token</span>
    process.env.<span class="tok-type">JWT_SECRET</span>,
    { expiresIn: <span class="tok-string">'7d'</span> }
  );
  <span class="tok-keyword">return</span> { token, role: user.role, fullName: user.full_name };
}</pre>

<h3>App — lưu token vào kho an toàn</h3>
<pre><span class="tok-comment">// lib/services/token_store.dart</span>
<span class="tok-keyword">import</span> <span class="tok-string">'package:flutter_secure_storage/flutter_secure_storage.dart'</span>;

<span class="tok-keyword">class</span> <span class="tok-type">TokenStore</span> {
  <span class="tok-keyword">static const</span> _key = <span class="tok-string">'jwt'</span>;
  <span class="tok-keyword">final</span> _storage = <span class="tok-keyword">const</span> <span class="tok-type">FlutterSecureStorage</span>();

  <span class="tok-type">Future</span>&lt;<span class="tok-keyword">void</span>&gt; <span class="tok-function">save</span>(<span class="tok-type">String</span> token) =&gt; _storage.<span class="tok-function">write</span>(key: _key, value: token);
  <span class="tok-type">Future</span>&lt;<span class="tok-type">String</span>?&gt; <span class="tok-function">read</span>() =&gt; _storage.<span class="tok-function">read</span>(key: _key);
  <span class="tok-type">Future</span>&lt;<span class="tok-keyword">void</span>&gt; <span class="tok-function">clear</span>() =&gt; _storage.<span class="tok-function">delete</span>(key: _key);
}</pre>

<h3>Ví dụ có lời giải — vòng đăng nhập</h3>
<div class="out"><b>Bước 1 —</b> App POST /auth/login { email, password }.
<b>Bước 2 —</b> Backend tìm user, <code>bcrypt.compare</code> thành công.
<b>Bước 3 —</b> Backend ký một JWT mang { sub: 7, role: "DINER" }, trả { token, role }.
<b>Bước 4 —</b> App gọi <code>tokenStore.save(token)</code> → ghi vào EncryptedSharedPreferences (Android).
<b>Bước 5 —</b> App mở lại sau một ngày → <code>tokenStore.read()</code> trả token → user vẫn đăng nhập, không cần đăng nhập lại.
<b>Kết quả:</b> token sống qua lần mở lại app, được mã hoá khi lưu, và mang role để cả hai đầu biết ai đang gọi.</div>

<div class="pitfall"><strong>Bẫy:</strong> lưu JWT trong <code>SharedPreferences</code> "cho nhanh". Trên máy đã root, file đó là văn bản thuần — một lỗ hổng bị trừ điểm. <code>flutter_secure_storage</code> chỉ là một dependency và cùng hình dạng API; hãy dùng từ ngày đầu.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đặt role trong token, kiểm nó ở server.</b> JWT mang <code>role</code> để app ẩn nút của nhân viên — nhưng đó là UX, không phải bảo mật. Server phải kiểm lại role ở mọi route được bảo vệ (Bài 3.2), vì token đọc được và một người quyết tâm có thể gọi thẳng API bằng <code>curl</code>. Kiểm role phía client là trang trí; kiểm role phía server mới là phòng thủ. <em>Vì sao ngoài syllabus: "đừng bao giờ tin client" là tiên đề bảo mật mà giáo trình nói tới nhưng hiếm khi cho bạn thấm.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Frestaurant-reservation-app%2Flearn&reflabel=INT608#module-529" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Xác thực &amp; bảo mật trên Code Lab</span><span class="lc-sub">Token, hashing và bảo vệ endpoint — lý thuyết đứng sau bài này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Role-based authorization: who can do what|||3.2 — Phân quyền theo vai trò: ai được làm gì',
          slug: 'int608-roles',
          type: 'VIDEO',
          description: 'Middleware verify JWT + requireRole ở backend, và điều hướng theo role ở app — chặn STAFF-only và "chỉ của tôi".',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.2</span>
<h2>Role-based authorization — who can do what</h2>
<p class="lead">Two roles need two gates. A JWT middleware proves <em>who</em> you are; a role check proves you are <em>allowed</em>. The app mirrors this by routing DINER and STAFF to different home screens — but the server is the real guard.</p>

<h3>Backend — auth &amp; role middleware</h3>
<pre><span class="tok-comment">// middleware/auth.js</span>
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">auth</span>(req, res, next) {
  <span class="tok-keyword">const</span> h = req.headers.authorization || <span class="tok-string">''</span>;
  <span class="tok-keyword">const</span> token = h.<span class="tok-function">startsWith</span>(<span class="tok-string">'Bearer '</span>) ? h.<span class="tok-function">slice</span>(<span class="tok-number">7</span>) : <span class="tok-keyword">null</span>;
  <span class="tok-keyword">if</span> (!token) <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">401</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'No token'</span> });
  <span class="tok-keyword">try</span> {
    req.user = jwt.<span class="tok-function">verify</span>(token, process.env.<span class="tok-type">JWT_SECRET</span>);  <span class="tok-comment">// { sub, role }</span>
    next();
  } <span class="tok-keyword">catch</span> {
    res.<span class="tok-function">status</span>(<span class="tok-number">401</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'Invalid token'</span> });
  }
}

<span class="tok-keyword">export const</span> requireRole = (role) =&gt; (req, res, next) =&gt;
  req.user?.role === role ? <span class="tok-function">next</span>() : res.<span class="tok-function">status</span>(<span class="tok-number">403</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'Forbidden'</span> });</pre>

<h3>Applying the gates on routes</h3>
<pre><span class="tok-comment">// routes/reservations.js</span>
r.<span class="tok-function">post</span>(<span class="tok-string">'/'</span>,               auth,                        create);   <span class="tok-comment">// any logged-in diner</span>
r.<span class="tok-function">get</span>(<span class="tok-string">'/mine'</span>,           auth,                        myList);   <span class="tok-comment">// own reservations</span>
r.<span class="tok-function">patch</span>(<span class="tok-string">'/:id/confirm'</span>,  auth, <span class="tok-function">requireRole</span>(<span class="tok-string">'STAFF'</span>), confirm);  <span class="tok-comment">// STAFF only</span>
r.<span class="tok-function">delete</span>(<span class="tok-string">'/:id'</span>,        auth,                        cancelOwn);<span class="tok-comment">// owner-only (checked in service)</span></pre>

<h3>Worked example — the three access outcomes</h3>
<div class="out"><b>Case A —</b> DINER An calls PATCH /reservations/9/confirm → requireRole('STAFF') fails → <b>403 Forbidden</b>. ✅ blocked.
<b>Case B —</b> DINER An calls DELETE /reservations/9 but reservation 9 belongs to Binh → the service checks <code>reservation.diner_id === req.user.sub</code> → false → <b>403</b>. ✅ blocked.
<b>Case C —</b> STAFF Hoa calls PATCH /reservations/9/confirm → role is STAFF → runs → <b>200</b>, status becomes CONFIRMED. ✅ allowed.
<b>Result:</b> role gates STAFF-only actions; an ownership check inside the service gates "my own" — two different rules, both enforced on the server.</div>

<div class="pitfall"><strong>Trap:</strong> checking ownership with the id from the URL instead of the token. If you trust a <code>dinerId</code> sent in the body, a diner can cancel anyone by changing it. The owner is <code>req.user.sub</code> from the verified JWT — never a client-supplied field.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Authentication vs authorization — two questions.</b> <em>Authentication</em> = "who are you?" (the JWT verify). <em>Authorization</em> = "are you allowed?" (the role + ownership checks). Bugs happen when people conflate them — a valid token is not a permission. Splitting them into <code>auth</code> and <code>requireRole</code> middleware makes each testable in isolation. <em>Why beyond syllabus: the authn/authz distinction underpins every access-control design you will meet professionally.</em></div>

<div class="note-ct">Now the plumbing is done. Section 4 is the heart of the project: reserving a table without ever double-booking it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.2</span>
<h2>Phân quyền theo vai trò — ai được làm gì</h2>
<p class="lead">Hai vai trò cần hai cửa. Middleware JWT chứng minh bạn <em>là ai</em>; kiểm role chứng minh bạn <em>được phép</em>. App phản chiếu điều này bằng cách điều hướng DINER và STAFF tới các màn hình chủ khác nhau — nhưng server mới là hàng rào thật.</p>

<h3>Backend — middleware auth &amp; role</h3>
<pre><span class="tok-comment">// middleware/auth.js</span>
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">auth</span>(req, res, next) {
  <span class="tok-keyword">const</span> h = req.headers.authorization || <span class="tok-string">''</span>;
  <span class="tok-keyword">const</span> token = h.<span class="tok-function">startsWith</span>(<span class="tok-string">'Bearer '</span>) ? h.<span class="tok-function">slice</span>(<span class="tok-number">7</span>) : <span class="tok-keyword">null</span>;
  <span class="tok-keyword">if</span> (!token) <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">401</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'No token'</span> });
  <span class="tok-keyword">try</span> {
    req.user = jwt.<span class="tok-function">verify</span>(token, process.env.<span class="tok-type">JWT_SECRET</span>);  <span class="tok-comment">// { sub, role }</span>
    next();
  } <span class="tok-keyword">catch</span> {
    res.<span class="tok-function">status</span>(<span class="tok-number">401</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'Invalid token'</span> });
  }
}

<span class="tok-keyword">export const</span> requireRole = (role) =&gt; (req, res, next) =&gt;
  req.user?.role === role ? <span class="tok-function">next</span>() : res.<span class="tok-function">status</span>(<span class="tok-number">403</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'Forbidden'</span> });</pre>

<h3>Gắn cửa lên route</h3>
<pre><span class="tok-comment">// routes/reservations.js</span>
r.<span class="tok-function">post</span>(<span class="tok-string">'/'</span>,               auth,                        create);   <span class="tok-comment">// thuc khach da dang nhap</span>
r.<span class="tok-function">get</span>(<span class="tok-string">'/mine'</span>,           auth,                        myList);   <span class="tok-comment">// dat cho cua minh</span>
r.<span class="tok-function">patch</span>(<span class="tok-string">'/:id/confirm'</span>,  auth, <span class="tok-function">requireRole</span>(<span class="tok-string">'STAFF'</span>), confirm);  <span class="tok-comment">// chi STAFF</span>
r.<span class="tok-function">delete</span>(<span class="tok-string">'/:id'</span>,        auth,                        cancelOwn);<span class="tok-comment">// chi chu so huu (kiem trong service)</span></pre>

<h3>Ví dụ có lời giải — ba kết cục truy cập</h3>
<div class="out"><b>Ca A —</b> DINER An gọi PATCH /reservations/9/confirm → requireRole('STAFF') thất bại → <b>403 Forbidden</b>. ✅ bị chặn.
<b>Ca B —</b> DINER An gọi DELETE /reservations/9 nhưng đặt chỗ 9 là của Bình → service kiểm <code>reservation.diner_id === req.user.sub</code> → false → <b>403</b>. ✅ bị chặn.
<b>Ca C —</b> STAFF Hoa gọi PATCH /reservations/9/confirm → role là STAFF → chạy → <b>200</b>, status thành CONFIRMED. ✅ được phép.
<b>Kết quả:</b> role gác hành động chỉ-STAFF; kiểm sở hữu trong service gác "của tôi" — hai luật khác nhau, đều thực thi ở server.</div>

<div class="pitfall"><strong>Bẫy:</strong> kiểm sở hữu bằng id từ URL thay vì từ token. Nếu bạn tin một <code>dinerId</code> gửi trong body, một thực khách có thể huỷ của bất kỳ ai bằng cách đổi nó. Chủ sở hữu là <code>req.user.sub</code> từ JWT đã verify — không bao giờ là một trường client gửi lên.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xác thực vs phân quyền — hai câu hỏi.</b> <em>Xác thực</em> = "bạn là ai?" (verify JWT). <em>Phân quyền</em> = "bạn có được phép?" (kiểm role + sở hữu). Bug xảy ra khi người ta gộp chúng — một token hợp lệ không phải là một quyền. Tách chúng thành middleware <code>auth</code> và <code>requireRole</code> khiến mỗi cái test được độc lập. <em>Vì sao ngoài syllabus: phân biệt authn/authz là nền của mọi thiết kế kiểm soát truy cập bạn sẽ gặp khi đi làm.</em></div>

<div class="note-ct">Giờ phần đường ống đã xong. Mục 4 là trái tim đồ án: đặt một bàn mà không bao giờ đặt trùng nó.</div>
</div>
`,
        },
      ],
    },
  ],
};
