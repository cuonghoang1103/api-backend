/**
 * INT607 — Gym Membership & Classes App (Kỳ 6 — Thực tập, project #7).
 * Mobile-first full-stack: Expo React Native app (expo-router) + Node/Express REST API + PostgreSQL.
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản quay video)
 * → domain/DB design → backend REST setup → auth/JWT + expo-secure-store → booking core (capacity + waitlist)
 * → frontend Expo RN → testing (kèm test đồng thời) → deployment (Docker + EAS) → nâng cao (★ ngoài giáo trình).
 * Song ngữ EN/VN đối xứng. Code RN/JS/SQL <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Deep-link CodeLab react-native/rest-apis/authentication; Docker/CI → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT607.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (RN/JS template, env) = \${ ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT607',
    title: 'Gym Membership & Classes App',
    slug: 'gym-membership-app',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #7 — build a real gym class booking app: an Expo React Native mobile app + a REST API + PostgreSQL, with JWT kept in secure storage, two roles, and a capacity-safe booking core that never over-books a class and auto-promotes a waitlist.|||Đồ án thực tập #7 — xây app đặt lớp gym thật: app di động Expo React Native + REST API + PostgreSQL, JWT lưu an toàn trên máy, hai vai trò, và lõi đặt lớp an toàn theo sức chứa, không quá tải, kèm waitlist tự đôn.',
    description: 'INT607 là đồ án thực tập lấy DI ĐỘNG làm trọng tâm của Kỳ 6: bạn xây một ứng dụng ĐẶT LỚP TẬP GYM (Gym Membership & Classes) hoàn chỉnh — một app Expo React Native chạy trên điện thoại, gọi một REST API nhẹ (Node/Express) trên nền PostgreSQL. Hệ thống có hai vai trò (Hội viên và Huấn luyện viên/Admin), xác thực bằng JWT lưu an toàn trên thiết bị bằng expo-secure-store, điều hướng bằng expo-router. Trọng tâm kỹ thuật là LÕI ĐẶT LỚP theo sức chứa: mỗi lớp có CAPACITY (số chỗ) và KHÔNG BAO GIỜ được nhận quá số chỗ, kể cả khi hai hội viên bấm giành chỗ cuối cùng cùng lúc — bạn sẽ học một câu UPDATE nguyên tử có điều kiện (WHERE seats_left > 0) và một WAITLIST tự đôn người khi có người huỷ. Cuối cùng đóng gói backend bằng Docker và build app bằng EAS, rồi viết kịch bản demo để quay video. Đây là khuôn "mobile + REST" mà mọi đồ án app khác đều tái dùng.',
    whatYouLearn: 'Thiết kế domain & ERD cho nghiệp vụ đặt lớp (User/GymClass/Booking/WaitlistEntry); dựng REST API Node/Express theo kiến trúc phân lớp Route→Service→Repository với node-postgres; xác thực JWT + phân quyền hai vai trò; lưu token an toàn trên thiết bị bằng expo-secure-store (không dùng AsyncStorage cho token); LÕI ĐẶT LỚP an toàn theo sức chứa (UPDATE ... WHERE seats_left > 0 nguyên tử + CHECK (seats_left >= 0) + transaction) và WAITLIST tự đôn khi có người huỷ (FOR UPDATE SKIP LOCKED); app Expo React Native: expo-router, auth context, axios interceptor gắn JWT, và một UI đặt lớp lạc-quan-nhưng-đối-soát xử lý "lớp đã đầy" (409) một cách nhã nhặn; kiểm thử unit + integration (Jest + Supertest) và một test đồng thời chứng minh không quá tải; đóng gói backend bằng Docker Compose và build app bằng EAS; và một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học PRF192/PRO192 (lập trình/OOP), DBI202 (CSDL/SQL), và FER202 (React — nền tảng cho React Native). Cần: Node.js LTS, một điện thoại có cài Expo Go (Android/iOS), VS Code, Docker Desktop (chạy Postgres + backend), một client test API (Postman hoặc REST Client trong VS Code), một tài khoản Expo (miễn phí) cho EAS, và một tài khoản GitHub cho nhóm. Emulator Android Studio/Xcode là tuỳ chọn.',
    documentsNote: 'Tham chiếu: Expo Documentation (docs.expo.dev) • React Native docs (reactnative.dev) • expo-router • expo-secure-store • Express (expressjs.com) • node-postgres (node-postgres.com) • PostgreSQL Documentation • jwt.io. Công cụ: VS Code, Expo Go trên điện thoại, Postman/REST Client, DBeaver/pgAdmin, Docker Desktop, EAS (Expo Application Services), draw.io (ERD). Luyện code: track Code Lab React Native + REST APIs + Authentication. Docker & CI: Exp Hub. Đây là project-course thực tập — vừa xây vừa quay video theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc mobile–server, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int607-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một app đặt lớp gym thật trên điện thoại, kiến trúc mobile–server, và bản đồ vòng đời từ ERD tới EAS.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — Gym Membership &amp; Classes</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, installable mobile app: a <strong>gym class booking app</strong> where a member browses classes, books a spot, and joins a waitlist when a class is full — and the system <strong>never over-books a class</strong> even when two members grab the last spot at the same time. By the end you have a running Expo React Native app on a real phone, a REST API in Docker, tested, plus a recorded demo.</p>
<p>Almost every mobile project in your internship is a variation of this skeleton: an authenticated <strong>REST API</strong> over a relational database, a <strong>React Native app</strong> that consumes it, and one <strong>transactional core</strong> that must stay correct under concurrency. Master this one and the others are re-skins.</p>

<h3>The system in one picture — app / server / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Expo React Native app (phone)</div><div class="lz-d">expo-router · axios · secure-store</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Node/Express REST API</div><div class="lz-d">Route→Service→Repository · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · gym_classes · bookings · waitlist</div></div>
</div>
<div class="diagram">Phone (Expo Go)  ──HTTPS/JSON──▶  Express API  ──SQL (pg)──▶  PostgreSQL
  React Native          (port 4000)                   (port 5432)
  Authorization: Bearer &lt;JWT&gt;                    CHECK (seats_left &gt;= 0)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design</div><div class="lz-nsub">Roles &amp; use cases · ERD · schema · the CHECK/atomic UPDATE that prevents over-booking</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Express REST API &amp; layers</div><div class="lz-nsub">Routes · repositories · services · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">Register/login · secure token on device · Member vs Trainer</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The booking core</div><div class="lz-nsub">Book a spot · never over-book · atomic capacity decrement · waitlist auto-promote</div></div></div>
  <div class="lz-stage">Mobile app</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Expo React Native</div><div class="lz-nsub">expo-router · auth context · axios interceptor · booking screen</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">Jest · Supertest · a concurrency test that proves no over-booking</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose: api + db · EAS build for the app · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Pessimistic locking · push notifications · attendance report · CI</div><div class="lz-nsub">Ship like a real engineering team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — login → see classes → book one → it appears in "My schedule" — then grow it. A tiny end-to-end flow that runs on a real phone beats a huge design that never launches.</div>

<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-454" target="_blank" rel="noopener">
  <span class="lc-ico">📱</span>
  <span class="lc-body"><span class="lc-title">Set up React Native on Code Lab</span><span class="lc-sub">Get Expo running and a first screen on your phone before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — App đặt lớp tập Gym</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một app di động thật, cài được lên máy: <strong>app đặt lớp tập gym</strong>, nơi hội viên xem lớp, đặt một chỗ, và vào waitlist khi lớp đầy — và hệ thống <strong>không bao giờ nhận quá số chỗ của một lớp</strong> kể cả khi hai hội viên giành chỗ cuối cùng cùng lúc. Kết thúc, bạn có một app Expo React Native chạy trên điện thoại thật, một REST API trong Docker, đã test, kèm một video demo.</p>
<p>Gần như mọi đồ án di động trong kỳ thực tập đều là biến thể của bộ khung này: một <strong>REST API</strong> có xác thực trên CSDL quan hệ, một <strong>app React Native</strong> tiêu thụ nó, và một <strong>lõi giao dịch</strong> phải luôn đúng khi tranh chấp. Làm chủ cái này thì các đồ án khác chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — app / server / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">App Expo React Native (điện thoại)</div><div class="lz-d">expo-router · axios · secure-store</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">REST API Node/Express</div><div class="lz-d">Route→Service→Repository · JWT</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · gym_classes · bookings · waitlist</div></div>
</div>
<div class="diagram">Điện thoại (Expo Go) ──HTTPS/JSON──▶  Express API  ──SQL (pg)──▶  PostgreSQL
  React Native          (cổng 4000)                  (cổng 5432)
  Authorization: Bearer &lt;JWT&gt;                   CHECK (seats_left &gt;= 0)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL</div><div class="lz-nsub">Vai trò &amp; use case · ERD · schema · ràng buộc CHECK/UPDATE nguyên tử chống quá tải</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">REST API Express &amp; các lớp</div><div class="lz-nsub">Route · repository · service · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (JWT)</div><div class="lz-nsub">Đăng ký/đăng nhập · token lưu an toàn trên máy · Hội viên vs HLV</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lõi đặt lớp</div><div class="lz-nsub">Đặt một chỗ · không quá tải · giảm số chỗ nguyên tử · waitlist tự đôn</div></div></div>
  <div class="lz-stage">App di động</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Expo React Native</div><div class="lz-nsub">expo-router · auth context · axios interceptor · màn hình đặt lớp</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">Jest · Supertest · một test đồng thời chứng minh không quá tải</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose: api + db · build app bằng EAS · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Pessimistic locking · push notification · báo cáo điểm danh · CI</div><div class="lz-nsub">Ship như một đội kỹ sư thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — đăng nhập → thấy lớp → đặt một cái → nó hiện trong "Lịch của tôi" — rồi mới mở rộng. Một luồng nhỏ chạy được trên điện thoại thật hơn hẳn một bản thiết kế đồ sộ không bao giờ lên máy.</div>

<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-454" target="_blank" rel="noopener">
  <span class="lc-ico">📱</span>
  <span class="lc-body"><span class="lc-title">Cài đặt React Native trên Code Lab</span><span class="lc-sub">Chạy Expo và đưa màn hình đầu tiên lên điện thoại trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int607-pham-vi',
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
  <div class="kv"><span class="k">MEMBER</span><span class="v">Register/login · browse today\\'s classes · book a spot · join the waitlist when full · view / cancel own schedule</span></div>
  <div class="kv"><span class="k">TRAINER / ADMIN</span><span class="v">Login · create classes with a capacity · see who booked (attendance) · mark attended</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">MEMBER taps a class with seats_left &gt; 0 ──▶ POST /bookings ──▶ seats_left − 1, BOOKED
        │                                                          │
        │ class is FULL (seats_left = 0) ──▶ 409 + added to WAITLIST┘
        ▼
Someone CANCELS ──▶ seat returns ──▶ head of WAITLIST auto-promoted to BOOKED</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A member can register, log in, and receive a JWT stored on the device</td><td>POST /auth/register then /auth/login returns a token; app keeps it in secure-store</td></tr>
<tr><td>2</td><td>A member sees classes with their remaining seats</td><td>GET /classes shows capacity and seats_left</td></tr>
<tr><td>3</td><td>Booking a class with free seats decrements seats_left and creates a BOOKED booking</td><td>POST /bookings → 201 + seats_left drops by 1</td></tr>
<tr><td>4</td><td><b>Over-booking is impossible</b></td><td>two concurrent POSTs for the last seat → exactly one 201, one 409+waitlisted</td></tr>
<tr><td>5</td><td>Cancelling a booking frees a seat and auto-promotes the waitlist head</td><td>DELETE /bookings/{id} → first waitlisted member becomes BOOKED</td></tr>
<tr><td>6</td><td>Only a TRAINER can create classes / see attendance</td><td>MEMBER calling the trainer endpoint → 403</td></tr>
<tr><td>7</td><td>The API + db run from one <code>docker compose up</code>; the app runs in Expo Go</td><td>api on :4000, db healthy, app scans the QR and loads</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> Real payment/membership billing, live chat with trainers, wearable/heart-rate integration, an AI workout planner as a core feature. Simulate a push notification with a log line or a mock. Depth on the capacity/waitlist core scores; breadth with nothing finished does not.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 6). "Definition of Done = the tests are green" removes every argument about whether a feature works. <em>Why beyond syllabus: turning a checklist into executable specs is exactly how professional teams gate a release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một lõi giao dịch, vài màn hình</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HỘI VIÊN</span><span class="v">Đăng ký/đăng nhập · xem lớp trong ngày · đặt một chỗ · vào waitlist khi đầy · xem / huỷ lịch của mình</span></div>
  <div class="kv"><span class="k">HLV / ADMIN</span><span class="v">Đăng nhập · tạo lớp có sức chứa · xem ai đã đặt (điểm danh) · đánh dấu đã tham gia</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">HỘI VIÊN chạm lớp còn seats_left &gt; 0 ──▶ POST /bookings ──▶ seats_left − 1, BOOKED
        │                                                          │
        │ lớp ĐẦY (seats_left = 0) ──▶ 409 + thêm vào WAITLIST──────┘
        ▼
Có người HUỶ ──▶ trả lại chỗ ──▶ đầu WAITLIST tự được đôn thành BOOKED</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Hội viên đăng ký, đăng nhập, nhận JWT lưu trên máy</td><td>POST /auth/register rồi /auth/login trả token; app giữ trong secure-store</td></tr>
<tr><td>2</td><td>Hội viên thấy lớp kèm số chỗ còn lại</td><td>GET /classes hiện capacity và seats_left</td></tr>
<tr><td>3</td><td>Đặt lớp còn chỗ giảm seats_left và tạo booking BOOKED</td><td>POST /bookings → 201 + seats_left giảm 1</td></tr>
<tr><td>4</td><td><b>Không thể quá tải</b></td><td>hai POST đồng thời cho chỗ cuối → đúng một 201, một 409+vào waitlist</td></tr>
<tr><td>5</td><td>Huỷ một booking trả lại chỗ và tự đôn đầu waitlist</td><td>DELETE /bookings/{id} → hội viên waitlist đầu tiên thành BOOKED</td></tr>
<tr><td>6</td><td>Chỉ HLV được tạo lớp / xem điểm danh</td><td>HỘI VIÊN gọi endpoint của HLV → 403</td></tr>
<tr><td>7</td><td>API + db chạy từ một <code>docker compose up</code>; app chạy trong Expo Go</td><td>api ở :4000, db healthy, app quét QR và tải được</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Thanh toán/gia hạn hội viên thật, chat trực tiếp với HLV, tích hợp thiết bị đeo/nhịp tim, "AI lập giáo án tập" làm tính năng lõi. Hãy giả lập push notification bằng một dòng log hoặc mock. Sâu ở lõi sức-chứa/waitlist mới ăn điểm; ôm rộng mà chẳng xong thì không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 6). "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc một tính năng có chạy hay không. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int607-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Expo React Native + Node/Express + PostgreSQL — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Every choice below is picked because it is <strong>what you already know</strong> (React from FER202, SQL from DBI202) and because it is the mainstream industry combo for a cross-platform mobile internship.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>App — Expo + React Native</b><br/>One JavaScript codebase runs on both Android and iOS. Expo gives you a managed build, over-the-air reload, and Expo Go so you test on a real phone in seconds. <em>Why: React Native reuses your React knowledge; Expo removes native-toolchain pain for a student team.</em></div>
  <div class="lz-layer"><b>Navigation — expo-router</b><br/>File-based routing (a screen per file in <code>app/</code>), like Next.js for mobile. <em>Why: less boilerplate than manual React Navigation config, and the folder structure documents your screens.</em></div>
  <div class="lz-layer"><b>Secure storage — expo-secure-store</b><br/>The JWT lives in the device keychain/keystore, encrypted — not in plain AsyncStorage. <em>Why: a token is a credential; storing it in the OS secure enclave is the mobile-correct choice.</em></div>
  <div class="lz-layer"><b>Backend — Node/Express + node-postgres</b><br/>A lightweight REST API. Raw SQL through <code>pg</code> keeps the crucial atomic UPDATE visible instead of hidden behind an ORM. <em>Why: same language as the app (JS), tiny, and the concurrency logic stays explicit.</em></div>
  <div class="lz-layer"><b>Database — PostgreSQL 16</b><br/>A real, free, ACID relational database. <em>Why: a single atomic UPDATE and a CHECK constraint are what make over-booking impossible; Postgres is the industry default.</em></div>
  <div class="lz-layer"><b>Ship — Docker (API+db) + EAS (app)</b><br/>The backend starts with one command; the app is built for a device with EAS. <em>Why: reproducible backend + a real installable build graders can run.</em></div>
</div>

<h3>The request journey — how a tap becomes a booked seat</h3>
<div class="diagram">Tap "Book"  →  axios POST /bookings  (JWT from secure-store in header)
   →  Express auth middleware validates JWT
   →  bookings.routes  →  bookingService.book()
   →  BEGIN  →  UPDATE gym_classes SET seats_left = seats_left − 1
                 WHERE id = $1 AND seats_left &gt; 0   (atomic guard)
   →  if 1 row: INSERT booking → COMMIT → 201 Created
   →  if 0 rows: INSERT waitlist_entry → COMMIT → 409 (waitlisted)
   →  React Native updates the list &amp; shows a banner</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A stack is a set of trade-offs, not a fashion.</b> You could swap Express for NestJS, Postgres for MySQL, or Expo for bare React Native, and the architecture would be identical — the same three tiers, the same atomic capacity guard. Reviewers respect a student who can say "I chose X over Y because…". <em>Why beyond syllabus: the syllabus teaches one stack; real engineering is choosing among many for reasons.</em></div>

<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-456" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Core components &amp; UI on Code Lab</span><span class="lc-sub">View, Text, FlatList, Pressable — the building blocks of your screens.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì đó là <strong>thứ bạn đã biết</strong> (React từ FER202, SQL từ DBI202) và là bộ combo chủ đạo của ngành cho một kỳ thực tập di động đa nền tảng.</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>App — Expo + React Native</b><br/>Một codebase JavaScript chạy trên cả Android và iOS. Expo cho bản build được quản lý, reload tức thì, và Expo Go để test trên điện thoại thật trong vài giây. <em>Vì sao: React Native tái dùng kiến thức React; Expo bỏ hết nỗi đau toolchain native cho một nhóm sinh viên.</em></div>
  <div class="lz-layer"><b>Điều hướng — expo-router</b><br/>Routing theo file (mỗi màn hình một file trong <code>app/</code>), giống Next.js cho mobile. <em>Vì sao: ít boilerplate hơn cấu hình React Navigation thủ công, và cấu trúc thư mục tự tài liệu hoá màn hình của bạn.</em></div>
  <div class="lz-layer"><b>Lưu an toàn — expo-secure-store</b><br/>JWT nằm trong keychain/keystore của thiết bị, được mã hoá — không phải AsyncStorage thô. <em>Vì sao: token là một credential; lưu nó trong secure enclave của OS là lựa chọn đúng chuẩn mobile.</em></div>
  <div class="lz-layer"><b>Backend — Node/Express + node-postgres</b><br/>Một REST API nhẹ. SQL thô qua <code>pg</code> giữ câu UPDATE nguyên tử then chốt hiện rõ thay vì bị giấu sau một ORM. <em>Vì sao: cùng ngôn ngữ với app (JS), nhỏ gọn, và logic tương tranh vẫn tường minh.</em></div>
  <div class="lz-layer"><b>CSDL — PostgreSQL 16</b><br/>Một CSDL quan hệ thật, miễn phí, ACID. <em>Vì sao: một câu UPDATE nguyên tử và một ràng buộc CHECK chính là thứ khiến quá tải không thể xảy ra; Postgres là mặc định của ngành.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker (API+db) + EAS (app)</b><br/>Backend khởi động bằng một lệnh; app được build cho thiết bị bằng EAS. <em>Vì sao: backend tái lập được + một bản build cài được thật để giám khảo chạy.</em></div>
</div>

<h3>Hành trình một request — một cú chạm thành một chỗ đã đặt</h3>
<div class="diagram">Chạm "Đặt"  →  axios POST /bookings  (JWT lấy từ secure-store, trong header)
   →  middleware xác thực Express kiểm JWT
   →  bookings.routes  →  bookingService.book()
   →  BEGIN  →  UPDATE gym_classes SET seats_left = seats_left − 1
                 WHERE id = $1 AND seats_left &gt; 0   (rào nguyên tử)
   →  nếu 1 dòng: INSERT booking → COMMIT → 201 Created
   →  nếu 0 dòng: INSERT waitlist_entry → COMMIT → 409 (vào waitlist)
   →  React Native cập nhật danh sách &amp; hiện banner</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một stack là tập hợp các đánh đổi, không phải mốt thời trang.</b> Bạn có thể thay Express bằng NestJS, Postgres bằng MySQL, hay Expo bằng React Native thuần, và kiến trúc vẫn y hệt — cùng ba tầng, cùng rào sức-chứa nguyên tử. Hội đồng nể một sinh viên biết nói "tôi chọn X thay vì Y vì…". <em>Vì sao ngoài syllabus: giáo trình dạy một stack; kỹ nghệ thật là chọn giữa nhiều lựa chọn có lý do.</em></div>

<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-456" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Component &amp; UI cốt lõi trên Code Lab</span><span class="lc-sub">View, Text, FlatList, Pressable — viên gạch xây màn hình của bạn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int607-cai-dat',
          type: 'VIDEO',
          description: 'Node.js, Expo CLI, Expo Go trên điện thoại, VS Code, Docker — cài một lần, dùng cả đồ án. Hướng dẫn chi tiết ở Exp Hub.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your environment</h2>
<p class="lead">Install everything once, before you write a line of code. Verify each tool from the terminal so you never lose an afternoon to a missing SDK. The one non-obvious piece: you need a <strong>real phone with Expo Go</strong> on the same Wi-Fi as your laptop.</p>

<h3>The checklist</h3>
<table>
<thead><tr><th>Tool</th><th>Why</th><th>Verify command</th></tr></thead>
<tbody>
<tr><td>Node.js LTS + npm</td><td>run Expo &amp; the Express API</td><td><code>node -v</code> → 20.x/22.x</td></tr>
<tr><td>Expo CLI (via npx)</td><td>scaffold &amp; run the app</td><td><code>npx expo --version</code></td></tr>
<tr><td>Expo Go (phone app)</td><td>run the app on a real device</td><td>scan the dev QR code</td></tr>
<tr><td>VS Code</td><td>the editor for JS/TS</td><td>opens the project</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + the API container</td><td><code>docker --version</code></td></tr>
<tr><td>Postman / REST Client</td><td>test the API without the app</td><td>send a GET</td></tr>
<tr><td>Git + a GitHub repo</td><td>team workflow</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Fastest Postgres:</strong> don\\'t install it — run it in Docker. <code>docker run --name gym-db -e POSTGRES_PASSWORD=gym -e POSTGRES_DB=gym -p 5432:5432 -d postgres:16</code>. One command, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int607-cai-dat-moi-truong?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">Node.js, Expo CLI, Expo Go, VS Code, Docker — official links and a verify checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> the phone cannot reach the API at <code>localhost</code>. On a device, <code>localhost</code> means the phone itself — not your laptop. Use your laptop\\'s LAN IP (e.g. <code>http://192.168.1.20:4000</code>) as the API base URL, keep both on the same Wi-Fi, and allow the port through your firewall — otherwise every request times out.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt môi trường</h2>
<p class="lead">Cài hết một lần, trước khi viết một dòng code. Kiểm từng công cụ từ terminal để không mất cả buổi chiều vì thiếu SDK. Điểm ít hiển nhiên nhất: bạn cần một <strong>điện thoại thật có Expo Go</strong> cùng mạng Wi-Fi với laptop.</p>

<h3>Danh sách cần cài</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Lệnh kiểm</th></tr></thead>
<tbody>
<tr><td>Node.js LTS + npm</td><td>chạy Expo &amp; API Express</td><td><code>node -v</code> → 20.x/22.x</td></tr>
<tr><td>Expo CLI (qua npx)</td><td>tạo &amp; chạy app</td><td><code>npx expo --version</code></td></tr>
<tr><td>Expo Go (app điện thoại)</td><td>chạy app trên máy thật</td><td>quét mã QR dev</td></tr>
<tr><td>VS Code</td><td>editor cho JS/TS</td><td>mở được dự án</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + container API</td><td><code>docker --version</code></td></tr>
<tr><td>Postman / REST Client</td><td>test API không cần app</td><td>gửi một GET</td></tr>
<tr><td>Git + một repo GitHub</td><td>quy trình nhóm</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Postgres nhanh nhất:</strong> đừng cài — chạy trong Docker. <code>docker run --name gym-db -e POSTGRES_PASSWORD=gym -e POSTGRES_DB=gym -p 5432:5432 -d postgres:16</code>. Một lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int607-cai-dat-moi-truong?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">Node.js, Expo CLI, Expo Go, VS Code, Docker — link chính chủ và checklist kiểm trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> điện thoại không tới được API ở <code>localhost</code>. Trên máy thật, <code>localhost</code> nghĩa là chính điện thoại — không phải laptop. Hãy dùng IP LAN của laptop (ví dụ <code>http://192.168.1.20:4000</code>) làm base URL của API, giữ cả hai cùng Wi-Fi, và mở cổng qua tường lửa — nếu không mọi request sẽ timeout.</div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int607-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng lõi, "khoảnh khắc chống quá tải + waitlist tự đôn", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the one thing that is hard: <strong>two phones fight for the last seat live, one books and one is waitlisted, then a cancel auto-promotes the waitlisted member — on camera</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is a gym class booking app. Two roles, and it can never over-book a class. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Member flow (2m)</div><div class="lz-nsub">On the phone: register → login (mention the token is in secure-store) → browse classes → book a spot → it appears in "My schedule", seats_left drops.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — The money shot (2m)</div><div class="lz-nsub">Two phones (or a phone + a simulator), same class with 1 seat left, both tap Book at once. One shows "Booked", the other "Class full — you are on the waitlist". Then one cancels → the waitlisted member is auto-promoted to Booked. Run the concurrency test in the terminal — green.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:30 — Trainer flow (1.5m)</div><div class="lz-nsub">Log in as trainer → create a class with a capacity → open attendance and mark someone attended. Show a member being blocked (403) from the trainer endpoint.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">6:00 — Under the hood (1m)</div><div class="lz-nsub">Show the ERD, the <code>CHECK (seats_left &gt;= 0)</code>, and the one atomic <code>UPDATE ... WHERE seats_left &gt; 0</code>. Explain in one sentence why over-booking is impossible.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Close (30s)</div><div class="lz-nsub">"Stack: Expo React Native, Node/Express, PostgreSQL, Docker + EAS. Repo link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (never demo on an empty DB). Record the phone screen with the OS screen recorder or scrcpy (Android). Do one dry run. Keep taps deliberate. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The demo is a product, not an afterthought.</b> Interviewers watch the first 60 seconds and the "hard part". Lead with the architecture and end with the concurrency + waitlist proof — that ordering signals engineering maturity far more than a tour of every screen. <em>Why beyond syllabus: communication of your work is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD and a schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng thứ khó: <strong>hai điện thoại giành chỗ cuối cùng ngay trên video, một cái đặt được và một cái vào waitlist, rồi một cú huỷ tự đôn hội viên waitlist lên — ngay trên camera</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là app đặt lớp tập gym. Hai vai trò, và không bao giờ nhận quá số chỗ một lớp. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng hội viên (2m)</div><div class="lz-nsub">Trên điện thoại: đăng ký → đăng nhập (nhắc token nằm trong secure-store) → xem lớp → đặt một chỗ → hiện trong "Lịch của tôi", seats_left giảm.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:30 — Cảnh đắt giá (2m)</div><div class="lz-nsub">Hai điện thoại (hoặc một điện thoại + một simulator), cùng một lớp còn 1 chỗ, cùng chạm Đặt một lúc. Một cái hiện "Đã đặt", cái kia "Lớp đầy — bạn đã vào waitlist". Rồi một cái huỷ → hội viên waitlist tự được đôn thành Đã đặt. Chạy test đồng thời trong terminal — xanh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:30 — Luồng HLV (1.5m)</div><div class="lz-nsub">Đăng nhập HLV → tạo một lớp có sức chứa → mở điểm danh và đánh dấu ai đó đã tham gia. Cho thấy hội viên bị chặn (403) khỏi endpoint của HLV.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">6:00 — Bên trong (1m)</div><div class="lz-nsub">Chiếu ERD, ràng buộc <code>CHECK (seats_left &gt;= 0)</code>, và một câu <code>UPDATE ... WHERE seats_left &gt; 0</code> nguyên tử. Giải thích một câu vì sao không thể quá tải.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">7:00 — Kết (30s)</div><div class="lz-nsub">"Stack: Expo React Native, Node/Express, PostgreSQL, Docker + EAS. Link repo trên màn hình. Cảm ơn." Chạy URL GitHub.</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed dữ liệu demo trước (đừng bao giờ demo trên DB rỗng). Quay màn hình điện thoại bằng bộ ghi màn hình của OS hoặc scrcpy (Android). Quay thử một lần. Chạm dứt khoát. Nếu hỏng, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Demo là một sản phẩm, không phải thứ làm cho có.</b> Nhà tuyển dụng xem 60 giây đầu và "phần khó". Mở bằng kiến trúc và kết bằng bằng chứng chống quá tải + waitlist — thứ tự đó thể hiện sự trưởng thành kỹ thuật hơn nhiều so với đi tua từng màn hình. <em>Vì sao ngoài syllabus: khả năng trình bày công việc bị chấm ngầm ở khắp sự nghiệp, nhưng hiếm khi được dạy rõ.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến hai vai trò thành ERD và schema.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design|||Mục 1 — Thiết kế domain & CSDL',
      description: 'Biến hai vai trò thành use case, ERD và một schema chuẩn hoá — với seats_left + CHECK là trái tim chống quá tải.',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int607-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, GymClass, Booking, WaitlistEntry và quan hệ giữa chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"A <b>member</b> books a <b>spot</b> in a <b>gym class</b>, creating a <b>booking</b>; if the class is full the member joins a <b>waitlist</b>; a <b>trainer</b> creates classes and sees attendance." The nouns give us four core entities:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (MEMBER or TRAINER), email, password hash. Both roles are Users; role decides permissions.</div>
  <div class="lz-layer"><b>GymClass</b> — a scheduled class of a trainer: <code>title</code>, <code>starts_at</code>, <code>capacity</code>, and <code>seats_left</code>. This is the resource that must never be over-booked.</div>
  <div class="lz-layer"><b>Booking</b> — a member holding a confirmed spot: which <code>member</code> in which <code>class</code>, its <code>status</code> (BOOKED / CANCELLED / ATTENDED) and when it was created.</div>
  <div class="lz-layer"><b>WaitlistEntry</b> — a member queued for a full class, ordered by <code>created_at</code>. When a seat frees up, the head of this queue is promoted into a Booking.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────┐        ┌──────────────┐        ┌──────────────┐
│   User   │1──────*│   GymClass   │1──────*│   Booking    │
│(TRAINER) │        │  seats_left  │        └──────────────┘
└──────────┘        └──────────────┘               *│
                          1│                         │1
                           │*                  ┌──────────┐
                    ┌──────────────┐           │   User   │ (MEMBER)
                    │ WaitlistEntry│*─────────1│          │
                    └──────────────┘           └──────────┘

Trainer 1—* GymClass       : a trainer runs many classes
GymClass 1—* Booking       : a class has up to CAPACITY active bookings  ← the rule
GymClass 1—* WaitlistEntry : a full class holds an ordered waitlist
Member   1—* Booking       : a member has many bookings</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> "HIIT 18:00" has capacity 2, seats_left 1. Member An books it.
<b>Step 1 —</b> An sends POST /bookings { classId: HIIT-18:00 }.
<b>Step 2 —</b> The class still has seats_left = 1 → the system decrements it to 0 and creates a Booking (member=An, status=BOOKED).
<b>Step 3 —</b> Member Binh now books the same class → seats_left is 0 → a Booking is refused; instead a WaitlistEntry (member=Binh) is created.
<b>Step 4 —</b> An cancels → seats_left returns to 1 → Binh (head of the waitlist) is auto-promoted → his WaitlistEntry is removed, a Booking (member=Binh) is created, seats_left back to 0.
<b>Result:</b> the class never held more than 2 active bookings — capacity was respected at every step.</div>

<div class="pitfall"><strong>Design trap:</strong> storing only a boolean "isFull" on the class instead of a numeric <code>seats_left</code>. A boolean can\\'t be decremented atomically and hides how many seats remain — you lose both the guard and the UI ("2 seats left"). Keep a counted <code>seats_left</code> derived from <code>capacity</code>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Denormalised counter vs COUNT(*).</b> You could compute remaining seats as <code>capacity − COUNT(active bookings)</code> every time. Storing <code>seats_left</code> as a column is a deliberate denormalisation: it lets a single atomic <code>UPDATE ... WHERE seats_left &gt; 0</code> be the guard (Section 4), which a COUNT-then-insert cannot do race-safely without extra locking. <em>Why beyond syllabus: trading normalisation for a race-safe counter is a modelling decision juniors rarely reason about.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">REST fundamentals on Code Lab</span><span class="lc-sub">Resources, verbs and status codes — the shape of the API over this schema.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>hội viên</b> đặt một <b>chỗ</b> trong một <b>lớp gym</b>, tạo ra một <b>booking</b>; nếu lớp đầy thì hội viên vào <b>waitlist</b>; một <b>HLV</b> tạo lớp và xem điểm danh." Các danh từ cho ta bốn thực thể lõi:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (MEMBER hoặc TRAINER), email, hash mật khẩu. Cả hai vai trò đều là User; role quyết định quyền.</div>
  <div class="lz-layer"><b>GymClass</b> — một lớp có lịch của HLV: <code>title</code>, <code>starts_at</code>, <code>capacity</code>, và <code>seats_left</code>. Đây là tài nguyên không được phép quá tải.</div>
  <div class="lz-layer"><b>Booking</b> — một hội viên đang giữ một chỗ đã xác nhận: <code>member</code> nào trong <code>class</code> nào, <code>status</code> (BOOKED / CANCELLED / ATTENDED) và thời điểm tạo.</div>
  <div class="lz-layer"><b>WaitlistEntry</b> — một hội viên xếp hàng cho lớp đầy, sắp theo <code>created_at</code>. Khi một chỗ trống ra, đầu hàng này được đôn thành một Booking.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────┐        ┌──────────────┐        ┌──────────────┐
│   User   │1──────*│   GymClass   │1──────*│   Booking    │
│  (HLV)   │        │  seats_left  │        └──────────────┘
└──────────┘        └──────────────┘               *│
                          1│                         │1
                           │*                  ┌──────────┐
                    ┌──────────────┐           │   User   │ (HỘI VIÊN)
                    │ WaitlistEntry│*─────────1│          │
                    └──────────────┘           └──────────┘

HLV      1—* GymClass       : một HLV chạy nhiều lớp
GymClass 1—* Booking        : một lớp có tối đa CAPACITY booking hoạt động  ← quy tắc
GymClass 1—* WaitlistEntry  : một lớp đầy giữ một waitlist có thứ tự
Hội viên 1—* Booking        : một hội viên có nhiều booking</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> "HIIT 18:00" có capacity 2, seats_left 1. Hội viên An đặt lớp này.
<b>Bước 1 —</b> An gửi POST /bookings { classId: HIIT-18:00 }.
<b>Bước 2 —</b> Lớp còn seats_left = 1 → hệ thống giảm về 0 và tạo một Booking (member=An, status=BOOKED).
<b>Bước 3 —</b> Hội viên Bình giờ đặt cùng lớp → seats_left = 0 → một Booking bị từ chối; thay vào đó tạo một WaitlistEntry (member=Bình).
<b>Bước 4 —</b> An huỷ → seats_left về 1 → Bình (đầu waitlist) tự được đôn → WaitlistEntry của Bình bị xoá, tạo một Booking (member=Bình), seats_left về 0.
<b>Kết quả:</b> lớp không bao giờ giữ quá 2 booking hoạt động — sức chứa được tôn trọng ở mọi bước.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> chỉ lưu một cờ boolean "isFull" trên lớp thay vì một số <code>seats_left</code>. Boolean không giảm nguyên tử được và giấu mất còn bao nhiêu chỗ — bạn mất cả hàng rào lẫn UI ("còn 2 chỗ"). Hãy giữ một <code>seats_left</code> đếm được, dẫn xuất từ <code>capacity</code>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bộ đếm phi chuẩn hoá vs COUNT(*).</b> Bạn có thể tính số chỗ còn lại bằng <code>capacity − COUNT(booking hoạt động)</code> mỗi lần. Lưu <code>seats_left</code> thành một cột là một phi chuẩn hoá có chủ đích: nó cho phép một câu <code>UPDATE ... WHERE seats_left &gt; 0</code> nguyên tử làm hàng rào (Mục 4), điều mà COUNT-rồi-insert không làm an-toàn-tranh-chấp được nếu không khoá thêm. <em>Vì sao ngoài syllabus: đánh đổi chuẩn hoá lấy một bộ đếm an toàn tranh chấp là quyết định mô hình hoá junior ít khi cân nhắc.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">REST cơ bản trên Code Lab</span><span class="lc-sub">Tài nguyên, động từ và status code — hình dạng API trên schema này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The schema & the constraint that prevents over-booking|||1.2 — Schema & ràng buộc chống quá tải',
          slug: 'int607-schema',
          type: 'VIDEO',
          description: 'DDL PostgreSQL đầy đủ + CHECK (seats_left >= 0) và UPDATE nguyên tử: hàng rào cuối cùng chống quá tải, do CSDL bảo đảm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The schema &amp; the constraint that prevents over-booking</h2>
<p class="lead">Here is the whole database. Notice two lines — the <code>CHECK (seats_left &gt;= 0)</code> on <code>gym_classes</code>, and the partial <code>UNIQUE</code> that stops one member booking the same class twice. Together with a single atomic <code>UPDATE</code> (Section 4), the database itself refuses to let a class go over capacity.</p>

<h3>The DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- bcrypt hash</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- MEMBER | TRAINER</span>
);

<span class="tok-keyword">CREATE TABLE</span> gym_classes (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  trainer_id  <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  title       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  starts_at   <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL</span>,
  capacity    <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL CHECK</span> (capacity &gt; <span class="tok-number">0</span>),
  seats_left  <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,
  <span class="tok-keyword">CONSTRAINT</span> seats_non_negative <span class="tok-keyword">CHECK</span> (seats_left &gt;= <span class="tok-number">0</span>),           <span class="tok-comment">-- ★ can never go below 0</span>
  <span class="tok-keyword">CONSTRAINT</span> seats_within_cap  <span class="tok-keyword">CHECK</span> (seats_left &lt;= capacity)     <span class="tok-comment">-- and never above capacity</span>
);

<span class="tok-keyword">CREATE TABLE</span> bookings (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  class_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> gym_classes(id),
  member_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  status      <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'BOOKED'</span>,  <span class="tok-comment">-- BOOKED | CANCELLED | ATTENDED</span>
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now()
);
<span class="tok-comment">-- ★ a member cannot hold two ACTIVE bookings for the same class:</span>
<span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_booking
  <span class="tok-keyword">ON</span> bookings (class_id, member_id)
  <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'BOOKED'</span>;

<span class="tok-keyword">CREATE TABLE</span> waitlist_entries (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  class_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> gym_classes(id),
  member_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  <span class="tok-keyword">UNIQUE</span> (class_id, member_id)                <span class="tok-comment">-- one queue place per member per class</span>
);</pre>

<h3>Worked example — why the atomic UPDATE is the real guard</h3>
<div class="out"><b>Scenario:</b> "HIIT 18:00" has seats_left = 1; two bookings arrive at the same millisecond.
<b>The guard is one statement:</b>
  UPDATE gym_classes SET seats_left = seats_left - 1
   WHERE id = 7 AND seats_left &gt; 0
  RETURNING seats_left;
<b>Step 1 —</b> Request A runs it → matches the row (seats_left 1 &gt; 0) → sets seats_left = 0, returns 1 row. The row is locked until A commits.
<b>Step 2 —</b> Request B runs the same statement → PostgreSQL makes B wait for A\\'s row lock.
<b>Step 3 —</b> A commits. B is released and re-evaluates <code>seats_left &gt; 0</code> against the NEW value 0 → the WHERE no longer matches → <b>0 rows updated</b>.
<b>Result:</b> A booked; B is told "full" and goes on the waitlist. The single atomic UPDATE — not an <code>if</code> in JavaScript — is what guarantees capacity.</div>

<div class="pitfall"><strong>Trap:</strong> reading <code>seats_left</code> in Node, checking it in JavaScript, then writing back. Between your read and your write another request can read the same value — the classic <em>race condition</em>. The read-modify-write must be ONE statement (<code>SET seats_left = seats_left - 1 WHERE seats_left &gt; 0</code>) so the row lock serializes it. Section 4 shows the full defence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Defence in depth: the CHECK is the backstop.</b> Even if a buggy code path issued a plain <code>seats_left = seats_left - 1</code> without the <code>WHERE seats_left &gt; 0</code>, the <code>CHECK (seats_left &gt;= 0)</code> would reject the transaction rather than let the number go negative. The atomic UPDATE is the guard; the CHECK is the seatbelt behind it. <em>Why beyond syllabus: layering an application-level guard with a database-level invariant is exactly how production systems stay correct despite bugs.</em></div>

<div class="note-ct">In the Express backend (Section 2) you won\\'t hide this UPDATE behind an ORM — you\\'ll run it directly with node-postgres so the guarantee stays visible and reviewable.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Schema &amp; ràng buộc chống quá tải</h2>
<p class="lead">Đây là toàn bộ CSDL. Chú ý hai dòng — <code>CHECK (seats_left &gt;= 0)</code> trên <code>gym_classes</code>, và <code>UNIQUE</code> từng phần chặn một hội viên đặt cùng lớp hai lần. Cùng một câu <code>UPDATE</code> nguyên tử (Mục 4), chính CSDL từ chối để một lớp vượt sức chứa.</p>

<h3>DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- hash bcrypt</span>
  full_name   <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL</span>       <span class="tok-comment">-- MEMBER | TRAINER</span>
);

<span class="tok-keyword">CREATE TABLE</span> gym_classes (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  trainer_id  <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  title       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  starts_at   <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL</span>,
  capacity    <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL CHECK</span> (capacity &gt; <span class="tok-number">0</span>),
  seats_left  <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,
  <span class="tok-keyword">CONSTRAINT</span> seats_non_negative <span class="tok-keyword">CHECK</span> (seats_left &gt;= <span class="tok-number">0</span>),           <span class="tok-comment">-- ★ không bao giờ dưới 0</span>
  <span class="tok-keyword">CONSTRAINT</span> seats_within_cap  <span class="tok-keyword">CHECK</span> (seats_left &lt;= capacity)     <span class="tok-comment">-- và không bao giờ vượt sức chứa</span>
);

<span class="tok-keyword">CREATE TABLE</span> bookings (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  class_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> gym_classes(id),
  member_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  status      <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'BOOKED'</span>,  <span class="tok-comment">-- BOOKED | CANCELLED | ATTENDED</span>
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now()
);
<span class="tok-comment">-- ★ một hội viên không thể giữ hai booking HOẠT ĐỘNG cho cùng một lớp:</span>
<span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_active_booking
  <span class="tok-keyword">ON</span> bookings (class_id, member_id)
  <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'BOOKED'</span>;

<span class="tok-keyword">CREATE TABLE</span> waitlist_entries (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  class_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> gym_classes(id),
  member_id   <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id),
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now(),
  <span class="tok-keyword">UNIQUE</span> (class_id, member_id)                <span class="tok-comment">-- mỗi hội viên một chỗ xếp hàng mỗi lớp</span>
);</pre>

<h3>Ví dụ có lời giải — vì sao UPDATE nguyên tử mới là người gác thật</h3>
<div class="out"><b>Tình huống:</b> "HIIT 18:00" có seats_left = 1; hai lượt đặt tới cùng một mili-giây.
<b>Hàng rào là một câu lệnh:</b>
  UPDATE gym_classes SET seats_left = seats_left - 1
   WHERE id = 7 AND seats_left &gt; 0
  RETURNING seats_left;
<b>Bước 1 —</b> Request A chạy nó → khớp dòng (seats_left 1 &gt; 0) → đặt seats_left = 0, trả 1 dòng. Dòng bị khoá tới khi A commit.
<b>Bước 2 —</b> Request B chạy đúng câu đó → PostgreSQL bắt B đợi khoá dòng của A.
<b>Bước 3 —</b> A commit. B được thả và đánh giá lại <code>seats_left &gt; 0</code> trên giá trị MỚI 0 → WHERE không còn khớp → <b>0 dòng được cập nhật</b>.
<b>Kết quả:</b> A đặt được; B bị báo "đầy" và vào waitlist. Chính một câu UPDATE nguyên tử — không phải một câu <code>if</code> trong JavaScript — mới bảo đảm sức chứa.</div>

<div class="pitfall"><strong>Bẫy:</strong> đọc <code>seats_left</code> trong Node, kiểm bằng JavaScript, rồi ghi lại. Giữa lúc bạn đọc và lúc bạn ghi, một request khác có thể đọc cùng giá trị — <em>race condition</em> kinh điển. Việc đọc-sửa-ghi phải là MỘT câu lệnh (<code>SET seats_left = seats_left - 1 WHERE seats_left &gt; 0</code>) để khoá dòng tuần tự hoá nó. Mục 4 chỉ cách phòng thủ đầy đủ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phòng thủ nhiều lớp: CHECK là chốt chặn.</b> Kể cả một đoạn code lỗi phát một câu <code>seats_left = seats_left - 1</code> thường mà quên <code>WHERE seats_left &gt; 0</code>, ràng buộc <code>CHECK (seats_left &gt;= 0)</code> vẫn từ chối transaction thay vì để con số âm. UPDATE nguyên tử là hàng rào; CHECK là dây an toàn phía sau. <em>Vì sao ngoài syllabus: xếp lớp một hàng rào mức ứng dụng với một bất biến mức CSDL chính là cách hệ thống production giữ đúng bất chấp bug.</em></div>

<div class="note-ct">Trong backend Express (Mục 2) bạn sẽ không giấu câu UPDATE này sau một ORM — bạn chạy nó trực tiếp bằng node-postgres để sự bảo đảm luôn hiện rõ và soát được.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int607-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, cardinality và ràng buộc chống quá tải.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which resource must never be over-booked, and where does the guarantee live?|||Tài nguyên nào không được quá tải, và sự bảo đảm nằm ở đâu?',
                options: [
                  'User; guaranteed by JWT|||User; bảo đảm bằng JWT',
                  'GymClass; guaranteed by an atomic UPDATE plus a CHECK constraint in the database|||GymClass; bảo đảm bằng UPDATE nguyên tử cộng ràng buộc CHECK trong CSDL',
                  'Booking; guaranteed by the mobile app|||Booking; bảo đảm bằng app di động',
                  'WaitlistEntry; guaranteed by a JavaScript if-check|||WaitlistEntry; bảo đảm bằng câu if trong JavaScript',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The relationship "a gym class has many bookings" is which cardinality?|||Quan hệ "một lớp gym có nhiều booking" là lực lượng nào?',
                options: ['1—1', '1—* (one-to-many)|||1—* (một-nhiều)', '*—* (many-to-many)|||*—* (nhiều-nhiều)', '0—0'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why store a numeric seats_left column instead of a boolean isFull?|||Vì sao lưu cột số seats_left thay vì một boolean isFull?',
                options: [
                  'Booleans are not allowed in Postgres|||Postgres không cho dùng boolean',
                  'A number can be decremented atomically and also shows how many seats remain|||Một con số giảm nguyên tử được và còn cho biết còn bao nhiêu chỗ',
                  'It is faster to type|||Gõ nhanh hơn',
                  'The app requires it|||App bắt buộc',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Two bookings hit a class with seats_left=1 at once, using UPDATE ... WHERE seats_left>0. What happens?|||Hai lượt đặt tới một lớp seats_left=1 cùng lúc, dùng UPDATE ... WHERE seats_left>0. Điều gì xảy ra?',
                options: [
                  'Both succeed and seats_left becomes -1|||Cả hai thành công và seats_left thành -1',
                  'Both fail|||Cả hai thất bại',
                  'Exactly one updates the row; the other matches 0 rows and is refused (waitlisted)|||Đúng một cái cập nhật dòng; cái kia trúng 0 dòng và bị từ chối (vào waitlist)',
                  'The database crashes|||CSDL sập',
                ], correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) What is the role of CHECK (seats_left >= 0) if the atomic UPDATE already guards capacity?|||(Ngoài giáo trình) CHECK (seats_left >= 0) có vai trò gì nếu UPDATE nguyên tử đã canh sức chứa?',
                options: [
                  'It replaces the UPDATE guard|||Nó thay thế hàng rào UPDATE',
                  'It is a database-level backstop that rejects any buggy write that would push seats below zero|||Nó là chốt chặn mức CSDL từ chối mọi ghi lỗi làm số chỗ xuống dưới 0',
                  'It stores the waitlist|||Nó lưu waitlist',
                  'It speeds up queries|||Nó tăng tốc truy vấn',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ MỤC 2 — BACKEND: EXPRESS REST API & CÁC LỚP ══════════════════ */
    {
      title: 'Section 2 — Backend: Express REST API & the Layers|||Mục 2 — Backend: REST API Express & các lớp',
      description: 'Khởi tạo API Express, kết nối node-postgres, và xây một lát cắt dọc "GET danh sách lớp" qua Route→Service→Repository.',
      lessons: [
        {
          title: '2.1 — Project setup & the layered architecture|||2.1 — Khởi tạo dự án & kiến trúc phân lớp',
          slug: 'int607-backend-setup',
          type: 'VIDEO',
          description: 'Express + node-postgres, cấu hình env, và ba lớp Route / Service / Repository — mỗi lớp một trách nhiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.1</span>
<h2>Project setup &amp; the layered architecture</h2>
<p class="lead">Scaffold a tiny Express API: <code>npm init -y</code>, then <code>npm i express pg jsonwebtoken bcryptjs zod</code> and <code>npm i -D nodemon</code>. Connect to your Postgres container through a single <code>pg.Pool</code>, and split the code into three layers so each has one job.</p>

<h3>The pool &amp; config (one place reads env)</h3>
<pre><span class="tok-comment">// src/db.js — one shared connection pool</span>
<span class="tok-keyword">import</span> pg <span class="tok-keyword">from</span> <span class="tok-string">'pg'</span>;
<span class="tok-keyword">export const</span> pool = <span class="tok-keyword">new</span> pg.Pool({
  connectionString: process.env.DATABASE_URL
    ?? <span class="tok-string">'postgres://postgres:gym@localhost:5432/gym'</span>,
});
<span class="tok-comment">// helper: run several statements inside ONE transaction</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">tx</span>(fn) {
  <span class="tok-keyword">const</span> client = <span class="tok-keyword">await</span> pool.connect();
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">await</span> client.query(<span class="tok-string">'BEGIN'</span>);
    <span class="tok-keyword">const</span> out = <span class="tok-keyword">await</span> fn(client);
    <span class="tok-keyword">await</span> client.query(<span class="tok-string">'COMMIT'</span>);
    <span class="tok-keyword">return</span> out;
  } <span class="tok-keyword">catch</span> (e) {
    <span class="tok-keyword">await</span> client.query(<span class="tok-string">'ROLLBACK'</span>);
    <span class="tok-keyword">throw</span> e;
  } <span class="tok-keyword">finally</span> {
    client.release();
  }
}</pre>
<p>The <code>DATABASE_URL</code> comes from the environment — the same value will come from Docker in Section 7, with no code change. The <code>tx()</code> helper is what makes the booking core (Section 4) all-or-nothing.</p>

<h3>The three layers — one responsibility each</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route</b> (Express router) — HTTP only. Parses the request, validates the body (zod), calls a service, maps the result to a status code + JSON. <em>No business logic here.</em></div>
  <div class="lz-layer"><b>Service</b> — the business rules. "Are there seats? Decrement, create the booking, else waitlist." Owns transactions (<code>tx()</code>). <em>Knows nothing about HTTP.</em></div>
  <div class="lz-layer"><b>Repository</b> — database access. The only place that writes SQL. <em>Knows nothing about business rules.</em></div>
</div>
<div class="diagram">HTTP request
   │
   ▼
Route ──dto──▶ Service ──params──▶ Repository ──SQL──▶ PostgreSQL
   ▲               │
   └──json/status──┘  (map row → response, choose 200/201/409…)</div>

<div class="callout ok">Why layer at all? Because you can then <strong>test the Service without HTTP</strong> and <strong>swap Express for Fastify without touching business rules</strong>. Each layer is replaceable because it depends only on the one below it.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Validate at the edge with a schema.</b> A <code>zod</code> schema on the request body (<code>{ classId: z.number().int().positive() }</code>) rejects malformed input at the Route before it reaches your service — one line that turns a class of 500-errors into clean 400s. <em>Why beyond syllabus: schema validation at the boundary is a professional habit the syllabus rarely enforces, but every real API does.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-529" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">REST auth &amp; security on Code Lab</span><span class="lc-sub">Headers, middleware and protecting routes — the backend half of this project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.1</span>
<h2>Khởi tạo dự án &amp; kiến trúc phân lớp</h2>
<p class="lead">Dựng một API Express nhỏ: <code>npm init -y</code>, rồi <code>npm i express pg jsonwebtoken bcryptjs zod</code> và <code>npm i -D nodemon</code>. Nối tới container Postgres qua một <code>pg.Pool</code> duy nhất, và chia code thành ba lớp để mỗi lớp một việc.</p>

<h3>Pool &amp; cấu hình (một chỗ đọc env)</h3>
<pre><span class="tok-comment">// src/db.js — một connection pool dùng chung</span>
<span class="tok-keyword">import</span> pg <span class="tok-keyword">from</span> <span class="tok-string">'pg'</span>;
<span class="tok-keyword">export const</span> pool = <span class="tok-keyword">new</span> pg.Pool({
  connectionString: process.env.DATABASE_URL
    ?? <span class="tok-string">'postgres://postgres:gym@localhost:5432/gym'</span>,
});
<span class="tok-comment">// helper: chạy nhiều câu lệnh trong MỘT transaction</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">tx</span>(fn) {
  <span class="tok-keyword">const</span> client = <span class="tok-keyword">await</span> pool.connect();
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">await</span> client.query(<span class="tok-string">'BEGIN'</span>);
    <span class="tok-keyword">const</span> out = <span class="tok-keyword">await</span> fn(client);
    <span class="tok-keyword">await</span> client.query(<span class="tok-string">'COMMIT'</span>);
    <span class="tok-keyword">return</span> out;
  } <span class="tok-keyword">catch</span> (e) {
    <span class="tok-keyword">await</span> client.query(<span class="tok-string">'ROLLBACK'</span>);
    <span class="tok-keyword">throw</span> e;
  } <span class="tok-keyword">finally</span> {
    client.release();
  }
}</pre>
<p><code>DATABASE_URL</code> đến từ môi trường — chính giá trị đó sẽ đến từ Docker ở Mục 7, không cần đổi code. Helper <code>tx()</code> chính là thứ khiến lõi đặt lớp (Mục 4) tất-cả-hoặc-không.</p>

<h3>Ba lớp — mỗi lớp một trách nhiệm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route</b> (Express router) — chỉ lo HTTP. Đọc request, validate body (zod), gọi service, ánh xạ kết quả sang status code + JSON. <em>Không có business logic ở đây.</em></div>
  <div class="lz-layer"><b>Service</b> — quy tắc nghiệp vụ. "Còn chỗ không? Giảm chỗ, tạo booking, không thì waitlist." Sở hữu transaction (<code>tx()</code>). <em>Không biết gì về HTTP.</em></div>
  <div class="lz-layer"><b>Repository</b> — truy cập CSDL. Nơi duy nhất viết SQL. <em>Không biết gì về quy tắc nghiệp vụ.</em></div>
</div>
<div class="diagram">HTTP request
   │
   ▼
Route ──dto──▶ Service ──tham số──▶ Repository ──SQL──▶ PostgreSQL
   ▲               │
   └──json/status──┘  (ánh xạ dòng → response, chọn 200/201/409…)</div>

<div class="callout ok">Vì sao phải phân lớp? Vì khi đó bạn có thể <strong>test Service không cần HTTP</strong> và <strong>thay Express bằng Fastify mà không đụng quy tắc nghiệp vụ</strong>. Mỗi lớp thay được vì nó chỉ phụ thuộc vào lớp ngay dưới.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Validate ngay ở rìa bằng một schema.</b> Một schema <code>zod</code> trên body (<code>{ classId: z.number().int().positive() }</code>) từ chối input sai định dạng ngay tại Route trước khi tới service — một dòng biến một loạt lỗi 500 thành 400 sạch. <em>Vì sao ngoài syllabus: validate bằng schema ở biên là thói quen chuyên nghiệp mà giáo trình ít ép, nhưng mọi API thật đều làm.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-529" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">REST auth &amp; bảo mật trên Code Lab</span><span class="lc-sub">Header, middleware và bảo vệ route — nửa backend của đồ án này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Repositories & the data layer|||2.2 — Repository & lớp dữ liệu',
          slug: 'int607-repositories',
          type: 'VIDEO',
          description: 'Gói mọi SQL vào repository dùng câu lệnh tham số hoá — nơi duy nhất chạm CSDL, chống SQL injection.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>Repositories &amp; the data layer</h2>
<p class="lead">Every SQL string lives in a repository — one module per table. Services call repository functions and never see SQL. Always use <strong>parameterised queries</strong> (<code>$1, $2</code>) so user input can never become SQL.</p>

<h3>The class repository</h3>
<pre><span class="tok-comment">// src/repos/classRepo.js</span>
<span class="tok-keyword">import</span> { pool } <span class="tok-keyword">from</span> <span class="tok-string">'../db.js'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">listUpcoming</span>(db = pool) {
  <span class="tok-keyword">return</span> db.query(
    &#96;SELECT c.id, c.title, c.starts_at, c.capacity, c.seats_left,
            u.full_name AS trainer_name
       FROM gym_classes c
       JOIN users u ON u.id = c.trainer_id
      WHERE c.starts_at &gt;= now()
      ORDER BY c.starts_at&#96;
  );
}

<span class="tok-comment">// the atomic capacity guard — used by the booking service (Section 4)</span>
<span class="tok-keyword">export function</span> <span class="tok-function">claimSeat</span>(db, classId) {
  <span class="tok-keyword">return</span> db.query(
    &#96;UPDATE gym_classes SET seats_left = seats_left - 1
      WHERE id = $1 AND seats_left &gt; 0
     RETURNING seats_left&#96;,
    [classId]
  );
}

<span class="tok-keyword">export function</span> <span class="tok-function">releaseSeat</span>(db, classId) {
  <span class="tok-keyword">return</span> db.query(
    &#96;UPDATE gym_classes SET seats_left = seats_left + 1
      WHERE id = $1 AND seats_left &lt; capacity&#96;,
    [classId]
  );
}</pre>

<h3>The booking &amp; waitlist repository</h3>
<pre><span class="tok-comment">// src/repos/bookingRepo.js</span>
<span class="tok-keyword">export function</span> <span class="tok-function">insertBooking</span>(db, classId, memberId) {
  <span class="tok-keyword">return</span> db.query(
    &#96;INSERT INTO bookings (class_id, member_id, status)
     VALUES ($1, $1, 'BOOKED') RETURNING id, status&#96;,
    [classId, memberId]
  );
}

<span class="tok-keyword">export function</span> <span class="tok-function">addToWaitlist</span>(db, classId, memberId) {
  <span class="tok-keyword">return</span> db.query(
    &#96;INSERT INTO waitlist_entries (class_id, member_id)
     VALUES ($1, $1)
     ON CONFLICT (class_id, member_id) DO NOTHING&#96;,
    [classId, memberId]
  );
}</pre>
<p>Notice <code>claimSeat</code> takes <code>db</code> as an argument — the service passes the transaction client so the seat decrement, the booking insert, and (on cancel) the waitlist promotion all commit together or not at all.</p>

<div class="pitfall"><strong>Trap:</strong> string-concatenating user input into SQL — <code>&#96;... WHERE id = \${classId}&#96;</code>. That is the classic <em>SQL injection</em> hole. Always pass values as the parameter array (<code>[classId]</code>) so the driver escapes them; the query text never changes shape.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Keep SQL out of services.</b> When a repository is the only file that knows table and column names, changing the schema touches one module, and every service stays readable business logic. Mixing SQL into services is the "fat controller" smell that makes a codebase impossible to refactor. <em>Why beyond syllabus: this separation is architecture discipline the syllabus assumes but rarely grades.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Repository &amp; lớp dữ liệu</h2>
<p class="lead">Mọi chuỗi SQL nằm trong một repository — mỗi bảng một module. Service gọi hàm repository và không bao giờ thấy SQL. Luôn dùng <strong>câu lệnh tham số hoá</strong> (<code>$1, $2</code>) để input người dùng không bao giờ biến thành SQL.</p>

<h3>Repository của lớp học</h3>
<pre><span class="tok-comment">// src/repos/classRepo.js</span>
<span class="tok-keyword">import</span> { pool } <span class="tok-keyword">from</span> <span class="tok-string">'../db.js'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">listUpcoming</span>(db = pool) {
  <span class="tok-keyword">return</span> db.query(
    &#96;SELECT c.id, c.title, c.starts_at, c.capacity, c.seats_left,
            u.full_name AS trainer_name
       FROM gym_classes c
       JOIN users u ON u.id = c.trainer_id
      WHERE c.starts_at &gt;= now()
      ORDER BY c.starts_at&#96;
  );
}

<span class="tok-comment">// hàng rào sức chứa nguyên tử — dùng bởi booking service (Mục 4)</span>
<span class="tok-keyword">export function</span> <span class="tok-function">claimSeat</span>(db, classId) {
  <span class="tok-keyword">return</span> db.query(
    &#96;UPDATE gym_classes SET seats_left = seats_left - 1
      WHERE id = $1 AND seats_left &gt; 0
     RETURNING seats_left&#96;,
    [classId]
  );
}

<span class="tok-keyword">export function</span> <span class="tok-function">releaseSeat</span>(db, classId) {
  <span class="tok-keyword">return</span> db.query(
    &#96;UPDATE gym_classes SET seats_left = seats_left + 1
      WHERE id = $1 AND seats_left &lt; capacity&#96;,
    [classId]
  );
}</pre>

<h3>Repository của booking &amp; waitlist</h3>
<pre><span class="tok-comment">// src/repos/bookingRepo.js</span>
<span class="tok-keyword">export function</span> <span class="tok-function">insertBooking</span>(db, classId, memberId) {
  <span class="tok-keyword">return</span> db.query(
    &#96;INSERT INTO bookings (class_id, member_id, status)
     VALUES ($1, $1, 'BOOKED') RETURNING id, status&#96;,
    [classId, memberId]
  );
}

<span class="tok-keyword">export function</span> <span class="tok-function">addToWaitlist</span>(db, classId, memberId) {
  <span class="tok-keyword">return</span> db.query(
    &#96;INSERT INTO waitlist_entries (class_id, member_id)
     VALUES ($1, $1)
     ON CONFLICT (class_id, member_id) DO NOTHING&#96;,
    [classId, memberId]
  );
}</pre>
<p>Chú ý <code>claimSeat</code> nhận <code>db</code> làm tham số — service truyền client của transaction vào để việc giảm chỗ, insert booking, và (khi huỷ) đôn waitlist cùng commit hoặc cùng không.</p>

<div class="pitfall"><strong>Bẫy:</strong> nối chuỗi input người dùng vào SQL — <code>&#96;... WHERE id = \${classId}&#96;</code>. Đó là lỗ <em>SQL injection</em> kinh điển. Luôn truyền giá trị qua mảng tham số (<code>[classId]</code>) để driver escape chúng; văn bản truy vấn không bao giờ đổi hình.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Giữ SQL ngoài service.</b> Khi repository là file duy nhất biết tên bảng và cột, đổi schema chỉ đụng một module, và mọi service vẫn là business logic dễ đọc. Trộn SQL vào service là mùi "fat controller" khiến codebase không thể refactor. <em>Vì sao ngoài syllabus: sự tách bạch này là kỷ luật kiến trúc mà giáo trình giả định nhưng ít chấm.</em></div>
</div>
`,
        },
        {
          title: '2.3 — Worked slice: GET the class list|||2.3 — Lát cắt có lời giải: GET danh sách lớp',
          slug: 'int607-slice-classes',
          type: 'VIDEO',
          description: 'Đi trọn một lát cắt dọc đầu tiên: Repository → Service → Route → thử bằng curl, có kết quả JSON thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.3</span>
<h2>Worked slice — GET the class list</h2>
<p class="lead">Let\\'s ship the first vertical slice end-to-end: an endpoint that returns upcoming classes with their remaining seats as clean JSON. This is the template every other read endpoint copies.</p>

<h3>Step 1 — the Service (business intent, no HTTP)</h3>
<pre><span class="tok-comment">// src/services/classService.js</span>
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> classRepo <span class="tok-keyword">from</span> <span class="tok-string">'../repos/classRepo.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">listClasses</span>() {
  <span class="tok-keyword">const</span> { rows } = <span class="tok-keyword">await</span> classRepo.listUpcoming();
  <span class="tok-keyword">return</span> rows.map((c) =&gt; ({
    id: c.id,
    title: c.title,
    startsAt: c.starts_at,
    trainerName: c.trainer_name,
    capacity: c.capacity,
    seatsLeft: c.seats_left,
    isFull: c.seats_left === <span class="tok-number">0</span>,   <span class="tok-comment">// a computed field the app can use directly</span>
  }));
}</pre>

<h3>Step 2 — the Route (HTTP only)</h3>
<pre><span class="tok-comment">// src/routes/classes.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> classService <span class="tok-keyword">from</span> <span class="tok-string">'../services/classService.js'</span>;

<span class="tok-keyword">export const</span> classes = Router();

classes.get(<span class="tok-string">'/'</span>, <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> {
    res.json(<span class="tok-keyword">await</span> classService.listClasses());
  } <span class="tok-keyword">catch</span> (e) { next(e); }   <span class="tok-comment">// hand errors to the central handler</span>
});</pre>

<h3>Step 3 — mount it in the app</h3>
<pre><span class="tok-comment">// src/app.js</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> { classes } <span class="tok-keyword">from</span> <span class="tok-string">'./routes/classes.routes.js'</span>;

<span class="tok-keyword">export const</span> app = express();
app.use(express.json());
app.use(<span class="tok-string">'/classes'</span>, classes);      <span class="tok-comment">// GET /classes is now live</span></pre>

<h3>Step 4 — test it (real output)</h3>
<div class="out"><b>Request:</b>  curl http://localhost:4000/classes
<b>Response 200:</b>
[
  { "id": 7, "title": "HIIT", "startsAt": "2026-08-01T18:00:00",
    "trainerName": "Coach Minh", "capacity": 2, "seatsLeft": 1, "isFull": false },
  { "id": 8, "title": "Yoga", "startsAt": "2026-08-01T19:00:00",
    "trainerName": "Coach Lan", "capacity": 10, "seatsLeft": 10, "isFull": false }
]</div>
<p>That is a complete slice: request → route → service → repository → JSON. Every other GET endpoint (my schedule, class attendance) is this same shape.</p>

<div class="callout ok"><strong>Rhythm to internalise:</strong> Repository first (the SQL), then Service (the intent + the shape the app wants), then Route (the plumbing). Build inside-out and each layer stays tiny.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Shape the JSON for the client, not the table.</b> The DB column is <code>seats_left</code> (snake_case); the app receives <code>seatsLeft</code> (camelCase) plus a computed <code>isFull</code>. Mapping in the service keeps the API contract stable even if you rename a column later. <em>Why beyond syllabus: decoupling the wire format from the table schema is an API-design habit the syllabus glosses over.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.3</span>
<h2>Lát cắt có lời giải — GET danh sách lớp</h2>
<p class="lead">Hãy ship lát cắt dọc đầu tiên từ đầu đến cuối: một endpoint trả về các lớp sắp tới kèm số chỗ còn lại dưới dạng JSON sạch. Đây là khuôn mà mọi endpoint đọc khác sao chép lại.</p>

<h3>Bước 1 — Service (ý định nghiệp vụ, không HTTP)</h3>
<pre><span class="tok-comment">// src/services/classService.js</span>
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> classRepo <span class="tok-keyword">from</span> <span class="tok-string">'../repos/classRepo.js'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">listClasses</span>() {
  <span class="tok-keyword">const</span> { rows } = <span class="tok-keyword">await</span> classRepo.listUpcoming();
  <span class="tok-keyword">return</span> rows.map((c) =&gt; ({
    id: c.id,
    title: c.title,
    startsAt: c.starts_at,
    trainerName: c.trainer_name,
    capacity: c.capacity,
    seatsLeft: c.seats_left,
    isFull: c.seats_left === <span class="tok-number">0</span>,   <span class="tok-comment">// một trường tính sẵn app dùng trực tiếp</span>
  }));
}</pre>

<h3>Bước 2 — Route (chỉ HTTP)</h3>
<pre><span class="tok-comment">// src/routes/classes.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> classService <span class="tok-keyword">from</span> <span class="tok-string">'../services/classService.js'</span>;

<span class="tok-keyword">export const</span> classes = Router();

classes.get(<span class="tok-string">'/'</span>, <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> {
    res.json(<span class="tok-keyword">await</span> classService.listClasses());
  } <span class="tok-keyword">catch</span> (e) { next(e); }   <span class="tok-comment">// đẩy lỗi cho handler trung tâm</span>
});</pre>

<h3>Bước 3 — mount vào app</h3>
<pre><span class="tok-comment">// src/app.js</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> { classes } <span class="tok-keyword">from</span> <span class="tok-string">'./routes/classes.routes.js'</span>;

<span class="tok-keyword">export const</span> app = express();
app.use(express.json());
app.use(<span class="tok-string">'/classes'</span>, classes);      <span class="tok-comment">// GET /classes giờ đã sống</span></pre>

<h3>Bước 4 — thử nó (kết quả thật)</h3>
<div class="out"><b>Request:</b>  curl http://localhost:4000/classes
<b>Response 200:</b>
[
  { "id": 7, "title": "HIIT", "startsAt": "2026-08-01T18:00:00",
    "trainerName": "Coach Minh", "capacity": 2, "seatsLeft": 1, "isFull": false },
  { "id": 8, "title": "Yoga", "startsAt": "2026-08-01T19:00:00",
    "trainerName": "Coach Lan", "capacity": 10, "seatsLeft": 10, "isFull": false }
]</div>
<p>Đó là một lát cắt hoàn chỉnh: request → route → service → repository → JSON. Mọi endpoint GET khác (lịch của tôi, điểm danh lớp) đều cùng hình dạng này.</p>

<div class="callout ok"><strong>Nhịp cần thấm:</strong> Repository trước (SQL), rồi Service (ý định + hình dạng app cần), rồi Route (đường ống). Xây từ trong ra ngoài, mỗi lớp đều nhỏ gọn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nắn JSON cho client, không phải cho bảng.</b> Cột DB là <code>seats_left</code> (snake_case); app nhận <code>seatsLeft</code> (camelCase) cộng một trường tính sẵn <code>isFull</code>. Ánh xạ trong service giữ hợp đồng API ổn định kể cả khi bạn đổi tên cột sau này. <em>Vì sao ngoài syllabus: tách định dạng truyền khỏi schema bảng là thói quen thiết kế API mà giáo trình lướt qua.</em></div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 3 — AUTH & JWT ══════════════════ */
    {
      title: 'Section 3 — Authentication & Roles (JWT)|||Mục 3 — Xác thực & Phân quyền (JWT)',
      description: 'Đăng ký/đăng nhập, phát JWT, giữ token an toàn trên thiết bị, và phân quyền hai vai trò bằng middleware Express.',
      lessons: [
        {
          title: '3.1 — Register, login & issue a JWT|||3.1 — Đăng ký, đăng nhập & phát JWT',
          slug: 'int607-auth-jwt',
          type: 'VIDEO',
          description: 'Băm mật khẩu bằng bcrypt, đổi email+mật khẩu lấy một JWT ký, và hiểu token mang gì.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.1</span>
<h2>Register, login &amp; issue a JWT</h2>
<p class="lead">Authentication answers "who are you?". The flow: register (store a <strong>bcrypt hash</strong>, never the plain password) → login (check the password, return a <strong>signed JWT</strong>) → every later request carries that token in the <code>Authorization</code> header. On mobile the token then lives in secure storage (Section 5).</p>

<h3>What a JWT is — three dot-separated parts</h3>
<div class="diagram">header.payload.signature
   │       │        └─ HMAC-SHA256(header.payload, SECRET) — proves we issued it
   │       └─ claims: { "sub": 7, "role": "MEMBER", "exp": ... }
   └─ { "alg": "HS256", "typ": "JWT" }</div>
<p>The server does not store sessions. It trusts the token because only the server knows the SECRET used to sign it — tamper with one byte and the signature check fails.</p>

<h3>Register &amp; login — the service</h3>
<pre><span class="tok-comment">// src/services/authService.js</span>
<span class="tok-keyword">import</span> bcrypt <span class="tok-keyword">from</span> <span class="tok-string">'bcryptjs'</span>;
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> userRepo <span class="tok-keyword">from</span> <span class="tok-string">'../repos/userRepo.js'</span>;
<span class="tok-keyword">import</span> { ConflictError, UnauthorizedError } <span class="tok-keyword">from</span> <span class="tok-string">'../errors.js'</span>;

<span class="tok-keyword">const</span> SECRET = process.env.JWT_SECRET ?? <span class="tok-string">'dev-secret-change-me'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">register</span>({ email, password, fullName }) {
  <span class="tok-keyword">if</span> (<span class="tok-keyword">await</span> userRepo.findByEmail(email))
    <span class="tok-keyword">throw new</span> ConflictError(<span class="tok-string">'Email already registered'</span>);
  <span class="tok-keyword">const</span> hash = <span class="tok-keyword">await</span> bcrypt.hash(password, <span class="tok-number">10</span>);   <span class="tok-comment">// ★ hash, never store plain</span>
  <span class="tok-keyword">return</span> userRepo.insert({ email, password: hash, fullName, role: <span class="tok-string">'MEMBER'</span> });
}

<span class="tok-keyword">export async function</span> <span class="tok-function">login</span>({ email, password }) {
  <span class="tok-keyword">const</span> u = <span class="tok-keyword">await</span> userRepo.findByEmail(email);
  <span class="tok-keyword">if</span> (!u || !(<span class="tok-keyword">await</span> bcrypt.compare(password, u.password)))
    <span class="tok-keyword">throw new</span> UnauthorizedError(<span class="tok-string">'Bad credentials'</span>);   <span class="tok-comment">// same message for both</span>
  <span class="tok-keyword">const</span> token = jwt.sign({ sub: u.id, role: u.role }, SECRET, { expiresIn: <span class="tok-string">'7d'</span> });
  <span class="tok-keyword">return</span> { token, role: u.role };
}</pre>

<h3>Worked example — the login round-trip</h3>
<div class="out"><b>1.</b> POST /auth/register { "email":"an@mail.com", "password":"Secret123", "fullName":"An" }
   → 201 Created
<b>2.</b> POST /auth/login    { "email":"an@mail.com", "password":"Secret123" }
   → 200 { "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsInJvbGUiOi...", "role":"MEMBER" }
<b>3.</b> GET /bookings/mine   Header: Authorization: Bearer eyJhbGciOiJIUzI1...
   → 200 [ ...An\\'s bookings... ]
<b>Wrong password?</b> step 2 → 401 Unauthorized (same message whether email or password is wrong — see pitfall).</div>

<div class="pitfall"><strong>Security trap:</strong> different error messages for "email not found" vs "wrong password" let an attacker enumerate which emails exist. Return the <em>same</em> generic "Bad credentials" for both. Also: never log the password or the raw token.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>bcrypt is deliberately slow, and that is a feature.</b> Unlike a plain SHA-256, bcrypt has a tunable cost factor so hashing takes ~100 ms — trivial for one login, but it makes brute-forcing a stolen hash database astronomically expensive. Never hash passwords with a fast general-purpose hash. <em>Why beyond syllabus: the "why slow is good" reasoning is security engineering the syllabus assumes but rarely explains.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">JWT on Code Lab</span><span class="lc-sub">Signing, verifying and protecting routes, hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.1</span>
<h2>Đăng ký, đăng nhập &amp; phát JWT</h2>
<p class="lead">Xác thực trả lời "bạn là ai?". Luồng: đăng ký (lưu một <strong>hash bcrypt</strong>, không bao giờ lưu mật khẩu thô) → đăng nhập (kiểm mật khẩu, trả về một <strong>JWT đã ký</strong>) → mọi request sau mang token đó trong header <code>Authorization</code>. Trên di động, token sau đó nằm trong secure storage (Mục 5).</p>

<h3>JWT là gì — ba phần ngăn bởi dấu chấm</h3>
<div class="diagram">header.payload.signature
   │       │        └─ HMAC-SHA256(header.payload, SECRET) — chứng minh do ta phát
   │       └─ claim: { "sub": 7, "role": "MEMBER", "exp": ... }
   └─ { "alg": "HS256", "typ": "JWT" }</div>
<p>Server không lưu session. Nó tin token vì chỉ server biết SECRET dùng để ký — sửa một byte là chữ ký sai.</p>

<h3>Đăng ký &amp; đăng nhập — service</h3>
<pre><span class="tok-comment">// src/services/authService.js</span>
<span class="tok-keyword">import</span> bcrypt <span class="tok-keyword">from</span> <span class="tok-string">'bcryptjs'</span>;
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> userRepo <span class="tok-keyword">from</span> <span class="tok-string">'../repos/userRepo.js'</span>;
<span class="tok-keyword">import</span> { ConflictError, UnauthorizedError } <span class="tok-keyword">from</span> <span class="tok-string">'../errors.js'</span>;

<span class="tok-keyword">const</span> SECRET = process.env.JWT_SECRET ?? <span class="tok-string">'dev-secret-change-me'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">register</span>({ email, password, fullName }) {
  <span class="tok-keyword">if</span> (<span class="tok-keyword">await</span> userRepo.findByEmail(email))
    <span class="tok-keyword">throw new</span> ConflictError(<span class="tok-string">'Email đã được đăng ký'</span>);
  <span class="tok-keyword">const</span> hash = <span class="tok-keyword">await</span> bcrypt.hash(password, <span class="tok-number">10</span>);   <span class="tok-comment">// ★ băm, không lưu thô</span>
  <span class="tok-keyword">return</span> userRepo.insert({ email, password: hash, fullName, role: <span class="tok-string">'MEMBER'</span> });
}

<span class="tok-keyword">export async function</span> <span class="tok-function">login</span>({ email, password }) {
  <span class="tok-keyword">const</span> u = <span class="tok-keyword">await</span> userRepo.findByEmail(email);
  <span class="tok-keyword">if</span> (!u || !(<span class="tok-keyword">await</span> bcrypt.compare(password, u.password)))
    <span class="tok-keyword">throw new</span> UnauthorizedError(<span class="tok-string">'Sai thông tin đăng nhập'</span>);   <span class="tok-comment">// cùng một thông báo</span>
  <span class="tok-keyword">const</span> token = jwt.sign({ sub: u.id, role: u.role }, SECRET, { expiresIn: <span class="tok-string">'7d'</span> });
  <span class="tok-keyword">return</span> { token, role: u.role };
}</pre>

<h3>Ví dụ có lời giải — vòng đăng nhập</h3>
<div class="out"><b>1.</b> POST /auth/register { "email":"an@mail.com", "password":"Secret123", "fullName":"An" }
   → 201 Created
<b>2.</b> POST /auth/login    { "email":"an@mail.com", "password":"Secret123" }
   → 200 { "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsInJvbGUiOi...", "role":"MEMBER" }
<b>3.</b> GET /bookings/mine   Header: Authorization: Bearer eyJhbGciOiJIUzI1...
   → 200 [ ...các booking của An... ]
<b>Sai mật khẩu?</b> bước 2 → 401 Unauthorized (cùng một thông báo dù email hay mật khẩu sai — xem bẫy).</div>

<div class="pitfall"><strong>Bẫy bảo mật:</strong> thông báo lỗi khác nhau cho "không tìm thấy email" và "sai mật khẩu" giúp kẻ tấn công dò email nào tồn tại. Trả <em>cùng</em> một thông báo chung "Sai thông tin đăng nhập" cho cả hai. Ngoài ra: không bao giờ log mật khẩu hay token thô.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>bcrypt cố tình chậm, và đó là một tính năng.</b> Khác SHA-256 thuần, bcrypt có cost factor điều chỉnh được nên băm mất ~100 ms — không đáng kể cho một lần đăng nhập, nhưng khiến việc brute-force một CSDL hash bị đánh cắp đắt đỏ khủng khiếp. Đừng bao giờ băm mật khẩu bằng hash nhanh đa dụng. <em>Vì sao ngoài syllabus: lý lẽ "vì sao chậm lại tốt" là kỹ nghệ bảo mật mà giáo trình giả định nhưng ít giải thích.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">JWT trên Code Lab</span><span class="lc-sub">Ký, xác minh và bảo vệ route, thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Role-based authorization & mobile token safety|||3.2 — Phân quyền theo vai trò & an toàn token trên máy',
          slug: 'int607-roles',
          type: 'VIDEO',
          description: 'Middleware xác thực + phân quyền theo role (chỉ HLV tạo lớp), kiểm quyền sở hữu, và vì sao token phải nằm trong secure-store.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 3 · Lesson 3.2</span>
<h2>Role-based authorization &amp; mobile token safety</h2>
<p class="lead">Authentication proved <em>who</em> you are; authorization decides <em>what</em> you may do. Two checks: <strong>role</strong> (only a trainer creates classes) and <strong>ownership</strong> (a member cancels only their own booking). And on mobile, one storage rule: the token belongs in the secure enclave.</p>

<h3>The auth middleware — verify once, reuse everywhere</h3>
<pre><span class="tok-comment">// src/middleware/auth.js</span>
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">const</span> SECRET = process.env.JWT_SECRET ?? <span class="tok-string">'dev-secret-change-me'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">requireAuth</span>(req, res, next) {
  <span class="tok-keyword">const</span> h = req.headers.authorization ?? <span class="tok-string">''</span>;
  <span class="tok-keyword">const</span> token = h.startsWith(<span class="tok-string">'Bearer '</span>) ? h.slice(<span class="tok-number">7</span>) : <span class="tok-keyword">null</span>;
  <span class="tok-keyword">if</span> (!token) <span class="tok-keyword">return</span> res.status(<span class="tok-number">401</span>).json({ status: <span class="tok-number">401</span>, message: <span class="tok-string">'No token'</span> });
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> payload = jwt.verify(token, SECRET);
    req.user = { id: payload.sub, role: payload.role };   <span class="tok-comment">// attach for later</span>
    next();
  } <span class="tok-keyword">catch</span> {
    res.status(<span class="tok-number">401</span>).json({ status: <span class="tok-number">401</span>, message: <span class="tok-string">'Invalid or expired token'</span> });
  }
}

<span class="tok-keyword">export function</span> <span class="tok-function">requireRole</span>(role) {
  <span class="tok-keyword">return</span> (req, res, next) =&gt;
    req.user?.role === role
      ? next()
      : res.status(<span class="tok-number">403</span>).json({ status: <span class="tok-number">403</span>, message: <span class="tok-string">'Forbidden'</span> });
}</pre>

<h3>Lock endpoints by role &amp; ownership</h3>
<pre><span class="tok-comment">// only a trainer may create a class or view attendance</span>
classes.post(<span class="tok-string">'/'</span>, requireAuth, requireRole(<span class="tok-string">'TRAINER'</span>), createClassHandler);

<span class="tok-comment">// ownership: a member cancels only their OWN booking (checked in the service)</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">cancel</span>(bookingId, memberId) {
  <span class="tok-keyword">const</span> { rowCount } = <span class="tok-keyword">await</span> pool.query(
    &#96;UPDATE bookings SET status='CANCELLED'
      WHERE id = $1 AND member_id = $2 AND status='BOOKED'&#96;,   <span class="tok-comment">// ★ own it?</span>
    [bookingId, memberId]
  );
  <span class="tok-keyword">if</span> (rowCount === <span class="tok-number">0</span>) <span class="tok-keyword">throw new</span> ForbiddenError(<span class="tok-string">'Not your active booking'</span>); <span class="tok-comment">// → 403</span>
  <span class="tok-comment">// (Section 4 adds the seat release + waitlist promotion here)</span>
}</pre>

<h3>Worked example — the permission matrix</h3>
<table>
<thead><tr><th>Action</th><th>MEMBER</th><th>TRAINER</th></tr></thead>
<tbody>
<tr><td>Book a class / join waitlist</td><td>✅</td><td>❌ 403</td></tr>
<tr><td>Cancel own booking</td><td>✅</td><td>❌</td></tr>
<tr><td>Cancel someone else\\'s booking</td><td>❌ 403</td><td>—</td></tr>
<tr><td>Create a class</td><td>❌ 403</td><td>✅</td></tr>
<tr><td>View attendance</td><td>❌ 403</td><td>✅</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Trap:</strong> checking role but forgetting ownership. If any logged-in member can cancel <em>any</em> booking by changing the id in the URL, that is a broken-access-control vulnerability (OWASP #1). The <code>WHERE member_id = $2</code> in the cancel query enforces ownership at the database, not just in an <code>if</code>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>On mobile, a token is NOT AsyncStorage material.</b> AsyncStorage is plain, unencrypted key-value storage — any other code or a rooted device can read it. A JWT is a credential, so it belongs in <code>expo-secure-store</code>, which uses the iOS Keychain / Android Keystore (hardware-backed, encrypted). Section 5 wires this up. <em>Why beyond syllabus: mobile secure-storage choice is a real security decision the web-focused syllabus never raises.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-765" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; security hardening for mobile on Code Lab</span><span class="lc-sub">Token storage, expiry and safe headers on a device.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 3 · Bài 3.2</span>
<h2>Phân quyền theo vai trò &amp; an toàn token trên máy</h2>
<p class="lead">Xác thực chứng minh <em>bạn là ai</em>; phân quyền quyết định <em>bạn được làm gì</em>. Hai kiểm tra: <strong>vai trò</strong> (chỉ HLV tạo lớp) và <strong>quyền sở hữu</strong> (hội viên chỉ huỷ booking của chính mình). Và trên di động, một quy tắc lưu trữ: token thuộc về secure enclave.</p>

<h3>Middleware xác thực — kiểm một lần, dùng mọi nơi</h3>
<pre><span class="tok-comment">// src/middleware/auth.js</span>
<span class="tok-keyword">import</span> jwt <span class="tok-keyword">from</span> <span class="tok-string">'jsonwebtoken'</span>;
<span class="tok-keyword">const</span> SECRET = process.env.JWT_SECRET ?? <span class="tok-string">'dev-secret-change-me'</span>;

<span class="tok-keyword">export function</span> <span class="tok-function">requireAuth</span>(req, res, next) {
  <span class="tok-keyword">const</span> h = req.headers.authorization ?? <span class="tok-string">''</span>;
  <span class="tok-keyword">const</span> token = h.startsWith(<span class="tok-string">'Bearer '</span>) ? h.slice(<span class="tok-number">7</span>) : <span class="tok-keyword">null</span>;
  <span class="tok-keyword">if</span> (!token) <span class="tok-keyword">return</span> res.status(<span class="tok-number">401</span>).json({ status: <span class="tok-number">401</span>, message: <span class="tok-string">'No token'</span> });
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> payload = jwt.verify(token, SECRET);
    req.user = { id: payload.sub, role: payload.role };   <span class="tok-comment">// gắn để dùng sau</span>
    next();
  } <span class="tok-keyword">catch</span> {
    res.status(<span class="tok-number">401</span>).json({ status: <span class="tok-number">401</span>, message: <span class="tok-string">'Token sai hoặc hết hạn'</span> });
  }
}

<span class="tok-keyword">export function</span> <span class="tok-function">requireRole</span>(role) {
  <span class="tok-keyword">return</span> (req, res, next) =&gt;
    req.user?.role === role
      ? next()
      : res.status(<span class="tok-number">403</span>).json({ status: <span class="tok-number">403</span>, message: <span class="tok-string">'Forbidden'</span> });
}</pre>

<h3>Khoá endpoint theo vai trò &amp; quyền sở hữu</h3>
<pre><span class="tok-comment">// chỉ HLV được tạo lớp hay xem điểm danh</span>
classes.post(<span class="tok-string">'/'</span>, requireAuth, requireRole(<span class="tok-string">'TRAINER'</span>), createClassHandler);

<span class="tok-comment">// quyền sở hữu: hội viên chỉ huỷ booking CỦA MÌNH (kiểm trong service)</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">cancel</span>(bookingId, memberId) {
  <span class="tok-keyword">const</span> { rowCount } = <span class="tok-keyword">await</span> pool.query(
    &#96;UPDATE bookings SET status='CANCELLED'
      WHERE id = $1 AND member_id = $2 AND status='BOOKED'&#96;,   <span class="tok-comment">// ★ có phải của mình?</span>
    [bookingId, memberId]
  );
  <span class="tok-keyword">if</span> (rowCount === <span class="tok-number">0</span>) <span class="tok-keyword">throw new</span> ForbiddenError(<span class="tok-string">'Không phải booking của bạn'</span>); <span class="tok-comment">// → 403</span>
  <span class="tok-comment">// (Mục 4 thêm trả chỗ + đôn waitlist ở đây)</span>
}</pre>

<h3>Ví dụ có lời giải — ma trận quyền</h3>
<table>
<thead><tr><th>Hành động</th><th>HỘI VIÊN</th><th>HLV</th></tr></thead>
<tbody>
<tr><td>Đặt lớp / vào waitlist</td><td>✅</td><td>❌ 403</td></tr>
<tr><td>Huỷ booking của chính mình</td><td>✅</td><td>❌</td></tr>
<tr><td>Huỷ booking của người khác</td><td>❌ 403</td><td>—</td></tr>
<tr><td>Tạo một lớp</td><td>❌ 403</td><td>✅</td></tr>
<tr><td>Xem điểm danh</td><td>❌ 403</td><td>✅</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Bẫy:</strong> kiểm role nhưng quên quyền sở hữu. Nếu bất kỳ hội viên đã đăng nhập nào có thể huỷ <em>bất kỳ</em> booking nào bằng cách đổi id trên URL, đó là lỗ hổng broken-access-control (OWASP #1). Câu <code>WHERE member_id = $2</code> trong truy vấn huỷ thực thi quyền sở hữu tại CSDL, không chỉ trong một câu <code>if</code>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trên di động, token KHÔNG phải thứ của AsyncStorage.</b> AsyncStorage là lưu trữ khoá-giá trị thô, không mã hoá — code khác hay một máy đã root đều đọc được. JWT là một credential, nên nó thuộc về <code>expo-secure-store</code>, dùng iOS Keychain / Android Keystore (được hỗ trợ bởi phần cứng, mã hoá). Mục 5 sẽ nối cái này. <em>Vì sao ngoài syllabus: chọn lưu trữ an toàn trên mobile là quyết định bảo mật thật mà giáo trình thiên về web không nêu.</em></div>

<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-765" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Gia cố Auth &amp; bảo mật cho mobile trên Code Lab</span><span class="lc-sub">Lưu token, hết hạn và header an toàn trên thiết bị.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
    {
      title: 'Section 4 — The Class-Booking Core (no over-booking)|||Mục 4 — Lõi đặt lớp (không quá chỗ)',
      lessons: [
        {
          title: '4.1 — Booking a class without over-booking|||4.1 — Đặt lớp mà không vượt sức chứa',
          slug: 'int607-booking-core',
          type: 'VIDEO',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 4 · Lesson 4.1</span>
<h2>A yoga class holds 20 — never let 21 book it</h2>
<p class="lead">This is the feature graders remember. When a popular class opens, dozens of members tap "Book" within the same second. A naive "count bookings, if &lt; capacity insert" over-books. The fix is a single atomic counter decrement — plus a waitlist for the unlucky.</p>

<h3>The naive service — has a race</h3>
<pre><span class="tok-comment">// (A) READ how many are booked</span>
<span class="tok-keyword">const</span> count = <span class="tok-keyword">await</span> prisma.booking.<span class="tok-function">count</span>({ where: { classId, status: <span class="tok-string">"BOOKED"</span> } });
<span class="tok-keyword">if</span> (count &gt;= gymClass.capacity)               <span class="tok-comment">// (A)</span>
  <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictError</span>(<span class="tok-string">"Class is full"</span>);
<span class="tok-comment">// (B) WRITE — but 20 requests all read count=19 before any insert!</span>
<span class="tok-keyword">await</span> prisma.booking.<span class="tok-function">create</span>({ data: { classId, memberId, status: <span class="tok-string">"BOOKED"</span> } });</pre>

<h3>Why it breaks — everyone reads the stale count</h3>
<div class="out"><b>Time →</b>   20 members tap Book at 06:00:00 for a class with 1 seat left
  t1..t20   (A) each reads booked=19  (&lt; 20)  ✅ all pass the check
  t21..t40  (B) all 20 INSERT a booking
<b>Result (no guard):</b> 39 people booked into a 20-person class. ✗</div>

<h3>The fix — an atomic guarded decrement</h3>
<p>Keep a <code>seats_left</code> counter on the class and decrement it in one conditional UPDATE. Only requests that find a seat left can succeed:</p>
<pre><span class="tok-comment">// raw SQL — atomic: the DB evaluates the WHERE and the decrement together</span>
<span class="tok-keyword">const</span> updated = <span class="tok-keyword">await</span> prisma.$executeRaw&#96;
  UPDATE "Class" SET seats_left = seats_left - 1
  WHERE id = \${classId} AND seats_left &gt; 0&#96;;   <span class="tok-comment">// returns rows affected</span>

<span class="tok-keyword">if</span> (updated === <span class="tok-number">1</span>) {
  <span class="tok-keyword">await</span> prisma.booking.<span class="tok-function">create</span>({ data: { classId, memberId, status: <span class="tok-string">"BOOKED"</span> } });
  <span class="tok-keyword">return</span> { status: <span class="tok-string">"BOOKED"</span> };
} <span class="tok-keyword">else</span> {
  <span class="tok-comment">// seats_left was 0 → no row updated → offer the waitlist (next section)</span>
  <span class="tok-keyword">return</span> <span class="tok-function">joinWaitlist</span>(classId, memberId);   <span class="tok-comment">// → 202 Accepted, position N</span>
}</pre>

<h3>How the atomic UPDATE stays correct — the SQL</h3>
<div class="out">Class 7 has seats_left = 1. Twenty members race:
  UPDATE "Class" SET seats_left = seats_left - 1 WHERE id=7 AND seats_left > 0;

The DB serialises row-level writes, so exactly ONE update finds seats_left = 1 &gt; 0
→ sets it to 0, returns 1 row. The other nineteen see seats_left = 0, WHERE fails,
→ 0 rows updated → they go to the waitlist. No over-booking, ever. ✅</div>

<div class="pitfall"><strong>Trap:</strong> the count-then-insert pattern, even inside a transaction. Under READ_COMMITTED all 20 requests read the same stale count before any insert commits. The guard must be <em>inside</em> the UPDATE's WHERE clause so the check and the decrement are one atomic step.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A counter column beats COUNT(*) at booking time.</b> Deriving "seats left" with <code>capacity - COUNT(bookings)</code> re-scans rows on every attempt and cannot be guarded atomically. A denormalised <code>seats_left</code> column can be decremented conditionally in O(1) and is the single source of truth for availability. Trading a little denormalisation for a correct, cheap invariant is a deliberate design call. <em>Why beyond syllabus: choosing denormalisation to enable an atomic guard is a modelling decision the syllabus never frames.</em></div>

<a class="link-card codelab" href="/code-lab/postgresql?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-933" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Concurrency &amp; locking in PostgreSQL</span><span class="lc-sub">Atomic updates, row locks, isolation — on Code Lab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 4 · Bài 4.1</span>
<h2>Một lớp yoga chứa 20 người — đừng bao giờ để 21 người đặt</h2>
<p class="lead">Đây là tính năng giám khảo nhớ nhất. Khi một lớp hot mở, hàng chục hội viên chạm "Đặt" trong cùng một giây. Kiểu "đếm booking, nếu &lt; sức chứa thì chèn" ngây thơ sẽ quá chỗ. Cách sửa là một lần giảm bộ đếm nguyên tử — cộng một waitlist cho người kém may.</p>

<h3>Service ngây thơ — có race</h3>
<pre><span class="tok-comment">// (A) ĐỌC đã đặt bao nhiêu</span>
<span class="tok-keyword">const</span> count = <span class="tok-keyword">await</span> prisma.booking.<span class="tok-function">count</span>({ where: { classId, status: <span class="tok-string">"BOOKED"</span> } });
<span class="tok-keyword">if</span> (count &gt;= gymClass.capacity)               <span class="tok-comment">// (A)</span>
  <span class="tok-keyword">throw new</span> <span class="tok-type">ConflictError</span>(<span class="tok-string">"Lớp đã đầy"</span>);
<span class="tok-comment">// (B) GHI — nhưng 20 request đều đọc count=19 trước khi ai chèn!</span>
<span class="tok-keyword">await</span> prisma.booking.<span class="tok-function">create</span>({ data: { classId, memberId, status: <span class="tok-string">"BOOKED"</span> } });</pre>

<h3>Vì sao nó hỏng — ai cũng đọc số đếm cũ</h3>
<div class="out"><b>Thời gian →</b>   20 hội viên chạm Đặt lúc 06:00:00 cho lớp còn 1 chỗ
  t1..t20   (A) mỗi người đọc booked=19  (&lt; 20)  ✅ tất cả qua kiểm
  t21..t40  (B) cả 20 INSERT một booking
<b>Kết quả (không rào):</b> 39 người đặt vào một lớp 20 chỗ. ✗</div>

<h3>Cách sửa — giảm có canh nguyên tử</h3>
<p>Giữ một bộ đếm <code>seats_left</code> trên lớp và giảm nó trong một UPDATE có điều kiện. Chỉ request tìm thấy còn chỗ mới thành công:</p>
<pre><span class="tok-comment">// SQL thô — nguyên tử: DB tính WHERE và phép giảm cùng nhau</span>
<span class="tok-keyword">const</span> updated = <span class="tok-keyword">await</span> prisma.$executeRaw&#96;
  UPDATE "Class" SET seats_left = seats_left - 1
  WHERE id = \${classId} AND seats_left &gt; 0&#96;;   <span class="tok-comment">// trả số dòng bị ảnh hưởng</span>

<span class="tok-keyword">if</span> (updated === <span class="tok-number">1</span>) {
  <span class="tok-keyword">await</span> prisma.booking.<span class="tok-function">create</span>({ data: { classId, memberId, status: <span class="tok-string">"BOOKED"</span> } });
  <span class="tok-keyword">return</span> { status: <span class="tok-string">"BOOKED"</span> };
} <span class="tok-keyword">else</span> {
  <span class="tok-comment">// seats_left đã là 0 → không dòng nào update → mời vào waitlist (mục sau)</span>
  <span class="tok-keyword">return</span> <span class="tok-function">joinWaitlist</span>(classId, memberId);   <span class="tok-comment">// → 202 Accepted, vị trí N</span>
}</pre>

<h3>Atomic UPDATE giữ đúng thế nào — SQL</h3>
<div class="out">Lớp 7 có seats_left = 1. Hai mươi hội viên đua:
  UPDATE "Class" SET seats_left = seats_left - 1 WHERE id=7 AND seats_left > 0;

DB tuần tự hoá ghi ở mức dòng, nên đúng MỘT update tìm thấy seats_left = 1 &gt; 0
→ đặt về 0, trả 1 dòng. Mười chín người kia thấy seats_left = 0, WHERE fail,
→ 0 dòng update → họ vào waitlist. Không bao giờ quá chỗ. ✅</div>

<div class="pitfall"><strong>Bẫy:</strong> kiểu đếm-rồi-chèn, kể cả trong transaction. Dưới READ_COMMITTED cả 20 request đọc cùng một số đếm cũ trước khi có insert nào commit. Rào phải nằm <em>bên trong</em> mệnh đề WHERE của UPDATE để kiểm và giảm là một bước nguyên tử.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một cột bộ đếm hơn COUNT(*) lúc đặt.</b> Suy "còn mấy chỗ" bằng <code>capacity - COUNT(bookings)</code> quét lại dòng ở mỗi lần thử và không thể canh nguyên tử. Một cột <code>seats_left</code> phi chuẩn hoá có thể giảm có điều kiện trong O(1) và là nguồn sự thật duy nhất về chỗ trống. Đánh đổi một chút phi chuẩn hoá để có một bất biến đúng và rẻ là một quyết định thiết kế có chủ đích. <em>Vì sao ngoài syllabus: chọn phi chuẩn hoá để bật một rào nguyên tử là quyết định mô hình hoá giáo trình không đặt ra.</em></div>

<a class="link-card codelab" href="/code-lab/postgresql?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-933" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Tương tranh &amp; khoá trong PostgreSQL</span><span class="lc-sub">Update nguyên tử, khoá dòng, mức cô lập — trên Code Lab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — Waitlist, cancel & auto-promote|||4.2 — Waitlist, huỷ & tự đôn lên',
          slug: 'int607-waitlist',
          type: 'VIDEO',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 4 · Lesson 4.2</span>
<h2>When a member cancels, promote the next in line — automatically</h2>
<p class="lead">A full class isn't the end. Members who miss out join a FIFO waitlist; when someone cancels, the first waitlisted member is promoted to a real booking in the <em>same transaction</em> that frees the seat — so a seat is never lost or double-given.</p>

<h3>The cancel + promote, atomically</h3>
<pre><span class="tok-keyword">await</span> prisma.$transaction(<span class="tok-keyword">async</span> (tx) =&gt; {
  <span class="tok-comment">// 1) cancel this member's booking</span>
  <span class="tok-keyword">await</span> tx.booking.<span class="tok-function">update</span>({ where: { id: bookingId }, data: { status: <span class="tok-string">"CANCELLED"</span> } });

  <span class="tok-comment">// 2) is anyone waiting? take the OLDEST waitlist entry (FIFO)</span>
  <span class="tok-keyword">const</span> next = <span class="tok-keyword">await</span> tx.waitlist.<span class="tok-function">findFirst</span>({
    where: { classId }, orderBy: { createdAt: <span class="tok-string">"asc"</span> },
  });

  <span class="tok-keyword">if</span> (next) {
    <span class="tok-comment">// 3a) promote them — the freed seat goes straight to the waitlist, seats_left unchanged</span>
    <span class="tok-keyword">await</span> tx.waitlist.<span class="tok-function">delete</span>({ where: { id: next.id } });
    <span class="tok-keyword">await</span> tx.booking.<span class="tok-function">create</span>({ data: { classId, memberId: next.memberId, status: <span class="tok-string">"BOOKED"</span> } });
    <span class="tok-function">notify</span>(next.memberId, <span class="tok-string">"You're in! A seat opened up."</span>);   <span class="tok-comment">// push notification</span>
  } <span class="tok-keyword">else</span> {
    <span class="tok-comment">// 3b) nobody waiting → return the seat to the pool</span>
    <span class="tok-keyword">await</span> tx.$executeRaw&#96;UPDATE "Class" SET seats_left = seats_left + 1 WHERE id = \${classId}&#96;;
  }
});</pre>

<h3>Worked example — a seat's journey</h3>
<div class="out">Class 7: capacity 20, seats_left 0, waitlist = [Mai, Nam]
Booked member cancels →
  · Mai (oldest) is promoted to BOOKED, removed from waitlist
  · seats_left stays 0 (the freed seat went to Mai, not back to the pool)
  · Mai gets a push: "You're in!"
Later, Nam cancels his waitlist spot → waitlist = [] , seats_left still 0
If a booked member now cancels and nobody waits → seats_left becomes 1 (open again).</div>

<div class="pitfall"><strong>Trap:</strong> freeing the seat (<code>seats_left + 1</code>) AND promoting a waitlister in the same cancel. That double-frees: the seat goes to the pool <em>and</em> to the waitlisted member, so the class over-books by one. Either promote (seat stays claimed) OR return to pool — never both.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Do the promotion inside the cancel transaction.</b> If cancelling and promoting were two separate transactions, a crash between them loses the seat (freed but nobody promoted) or duplicates it. Wrapping "free a seat" and "fill it from the waitlist" in one transaction makes the whole hand-off atomic — it either fully happens or not at all. <em>Why beyond syllabus: reasoning about the crash window between two writes, and closing it with a transaction, is a reliability skill the coursework never drills.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-2368" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma transactions on Code Lab</span><span class="lc-sub">$transaction, atomic multi-step writes.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 4 · Bài 4.2</span>
<h2>Khi một hội viên huỷ, đôn người kế tiếp lên — tự động</h2>
<p class="lead">Lớp đầy không phải là hết. Hội viên lỡ chỗ vào một waitlist FIFO; khi ai đó huỷ, hội viên đầu waitlist được đôn thành booking thật trong <em>cùng transaction</em> giải phóng chỗ — nên một chỗ không bao giờ bị mất hay trao đôi.</p>

<h3>Huỷ + đôn, nguyên tử</h3>
<pre><span class="tok-keyword">await</span> prisma.$transaction(<span class="tok-keyword">async</span> (tx) =&gt; {
  <span class="tok-comment">// 1) huỷ booking của hội viên này</span>
  <span class="tok-keyword">await</span> tx.booking.<span class="tok-function">update</span>({ where: { id: bookingId }, data: { status: <span class="tok-string">"CANCELLED"</span> } });

  <span class="tok-comment">// 2) có ai đang đợi? lấy waitlist CŨ NHẤT (FIFO)</span>
  <span class="tok-keyword">const</span> next = <span class="tok-keyword">await</span> tx.waitlist.<span class="tok-function">findFirst</span>({
    where: { classId }, orderBy: { createdAt: <span class="tok-string">"asc"</span> },
  });

  <span class="tok-keyword">if</span> (next) {
    <span class="tok-comment">// 3a) đôn họ lên — chỗ vừa trống đi thẳng cho waitlist, seats_left không đổi</span>
    <span class="tok-keyword">await</span> tx.waitlist.<span class="tok-function">delete</span>({ where: { id: next.id } });
    <span class="tok-keyword">await</span> tx.booking.<span class="tok-function">create</span>({ data: { classId, memberId: next.memberId, status: <span class="tok-string">"BOOKED"</span> } });
    <span class="tok-function">notify</span>(next.memberId, <span class="tok-string">"Bạn có chỗ rồi! Một ghế vừa trống."</span>);   <span class="tok-comment">// push notification</span>
  } <span class="tok-keyword">else</span> {
    <span class="tok-comment">// 3b) không ai đợi → trả chỗ về bể</span>
    <span class="tok-keyword">await</span> tx.$executeRaw&#96;UPDATE "Class" SET seats_left = seats_left + 1 WHERE id = \${classId}&#96;;
  }
});</pre>

<h3>Ví dụ có lời giải — hành trình một chỗ</h3>
<div class="out">Lớp 7: sức chứa 20, seats_left 0, waitlist = [Mai, Nam]
Hội viên đã đặt huỷ →
  · Mai (cũ nhất) được đôn thành BOOKED, gỡ khỏi waitlist
  · seats_left vẫn 0 (chỗ trống đi cho Mai, không về bể)
  · Mai nhận push: "Bạn có chỗ rồi!"
Sau đó, Nam huỷ suất waitlist → waitlist = [] , seats_left vẫn 0
Nếu giờ một hội viên đã đặt huỷ và không ai đợi → seats_left thành 1 (mở lại).</div>

<div class="pitfall"><strong>Bẫy:</strong> vừa giải phóng chỗ (<code>seats_left + 1</code>) VỪA đôn một waitlister trong cùng lần huỷ. Điều đó trả đôi: chỗ đi về bể <em>và</em> đi cho hội viên waitlist, nên lớp quá chỗ một người. Hoặc đôn (chỗ giữ nguyên đã nhận) HOẶC trả về bể — không bao giờ cả hai.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Làm việc đôn bên trong transaction huỷ.</b> Nếu huỷ và đôn là hai transaction riêng, một crash giữa chúng làm mất chỗ (đã giải phóng nhưng không ai được đôn) hoặc nhân đôi nó. Bọc "giải phóng một chỗ" và "lấp nó từ waitlist" trong một transaction khiến cả cú bàn giao nguyên tử — hoặc xảy ra trọn vẹn hoặc không gì cả. <em>Vì sao ngoài syllabus: suy luận về khe crash giữa hai lần ghi, và đóng nó bằng transaction, là kỹ năng độ tin cậy môn học không luyện.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-2368" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Transaction Prisma trên Code Lab</span><span class="lc-sub">$transaction, ghi nhiều bước nguyên tử.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '4.3 — Checkpoint quiz: the booking core|||4.3 — Quiz kiểm tra: lõi đặt lớp',
          slug: 'int607-quiz-4',
          type: 'QUIZ',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1',
                question: 'Why does UPDATE Class SET seats_left = seats_left - 1 WHERE id=? AND seats_left > 0 prevent over-booking?|||Vì sao UPDATE Class SET seats_left = seats_left - 1 WHERE id=? AND seats_left > 0 chặn quá chỗ?',
                options: [
                  'The check and decrement are one atomic step; only requests that find a free seat update a row|||Kiểm và giảm là một bước nguyên tử; chỉ request tìm thấy chỗ trống mới update một dòng',
                  'It locks the whole table for a minute|||Nó khoá cả bảng một phút',
                  'It deletes old bookings|||Nó xoá booking cũ',
                  'It doubles the capacity|||Nó tăng gấp đôi sức chứa',
                ],
                correctIndex: 0,
                points: 1,
              },
              {
                id: 'q2',
                question: 'Why is count-then-insert unsafe even inside a transaction?|||Vì sao đếm-rồi-chèn không an toàn kể cả trong transaction?',
                options: [
                  'Under READ_COMMITTED many requests read the same stale count before any insert commits|||Dưới READ_COMMITTED nhiều request đọc cùng số đếm cũ trước khi có insert nào commit',
                  'Transactions disable COUNT|||Transaction vô hiệu COUNT',
                  'INSERT is not transactional|||INSERT không có tính giao dịch',
                  'It is actually safe|||Thực ra nó an toàn',
                ],
                correctIndex: 0,
                points: 1,
              },
              {
                id: 'q3',
                question: 'When a booked member cancels and the waitlist is non-empty, what happens to seats_left?|||Khi một hội viên đã đặt huỷ và waitlist không rỗng, seats_left ra sao?',
                options: [
                  'It stays the same — the freed seat goes directly to the promoted waitlister|||Nó giữ nguyên — chỗ trống đi thẳng cho waitlister được đôn',
                  'It increases by 1|||Nó tăng thêm 1',
                  'It resets to capacity|||Nó về lại sức chứa',
                  'It goes negative|||Nó thành âm',
                ],
                correctIndex: 0,
                points: 1,
              },
              {
                id: 'q4',
                question: 'Why must cancel + promote happen in one transaction?|||Vì sao huỷ + đôn phải trong một transaction?',
                options: [
                  'A crash between two separate writes could lose the seat or duplicate it; one transaction makes the hand-off atomic|||Crash giữa hai lần ghi riêng có thể mất chỗ hoặc nhân đôi; một transaction làm cú bàn giao nguyên tử',
                  'Transactions are faster|||Transaction nhanh hơn',
                  'Prisma requires it for updates|||Prisma bắt buộc cho update',
                  'It saves memory|||Nó tiết kiệm bộ nhớ',
                ],
                correctIndex: 0,
                points: 1,
              },
              {
                id: 'q5',
                question: '(Beyond syllabus) Why prefer a seats_left counter column over capacity - COUNT(bookings)?|||(Ngoài giáo trình) Vì sao chuộng cột bộ đếm seats_left hơn capacity - COUNT(bookings)?',
                options: [
                  'It can be decremented conditionally in O(1) and guarded atomically; COUNT re-scans and cannot be guarded|||Nó giảm có điều kiện trong O(1) và canh nguyên tử; COUNT quét lại và không canh được',
                  'COUNT is not valid SQL|||COUNT không phải SQL hợp lệ',
                  'Counters use less disk|||Bộ đếm tốn ít đĩa hơn',
                  'There is no difference|||Không có khác biệt',
                ],
                correctIndex: 0,
                points: 1,
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Section 5 — The mobile app (React Native / Expo)|||Mục 5 — Ứng dụng di động (React Native / Expo)',
      lessons: [
        {
          title: '5.1 — Screens, secure token storage & the booking flow|||5.1 — Màn hình, lưu token an toàn & luồng đặt lớp',
          slug: 'int607-mobile-client',
          type: 'VIDEO',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 5 · Lesson 5.1</span>
<h2>A React Native app that books classes and handles the waitlist</h2>
<p class="lead">The mobile client talks to the same REST API. Two mobile-specific concerns matter: storing the JWT <em>securely</em> (not in plain AsyncStorage) and giving clear feedback for the three outcomes — booked, waitlisted, or full.</p>

<h3>Store the token in the device keychain</h3>
<pre><span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> SecureStore <span class="tok-keyword">from</span> <span class="tok-string">"expo-secure-store"</span>;

<span class="tok-comment">// after login — encrypted, OS-backed keychain, NOT plain AsyncStorage</span>
<span class="tok-keyword">await</span> SecureStore.<span class="tok-function">setItemAsync</span>(<span class="tok-string">"token"</span>, data.token);

<span class="tok-comment">// a shared fetch wrapper attaches it</span>
<span class="tok-keyword">async function</span> <span class="tok-function">api</span>(path, opts = {}) {
  <span class="tok-keyword">const</span> token = <span class="tok-keyword">await</span> SecureStore.<span class="tok-function">getItemAsync</span>(<span class="tok-string">"token"</span>);
  <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> <span class="tok-function">fetch</span>(API_URL + path, {
    ...opts,
    headers: { <span class="tok-string">"Content-Type"</span>: <span class="tok-string">"application/json"</span>, Authorization: &#96;Bearer \${token}&#96;, ...opts.headers },
  });
  <span class="tok-keyword">if</span> (res.status === <span class="tok-number">401</span>) { <span class="tok-keyword">await</span> <span class="tok-function">signOut</span>(); <span class="tok-keyword">throw new</span> <span class="tok-type">Error</span>(<span class="tok-string">"Session expired"</span>); }
  <span class="tok-keyword">return</span> res;
}</pre>

<h3>The Book button — three outcomes</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">BookButton</span>({ classId, onDone }) {
  <span class="tok-keyword">const</span> [busy, setBusy] = <span class="tok-function">useState</span>(<span class="tok-keyword">false</span>);

  <span class="tok-keyword">async function</span> <span class="tok-function">book</span>() {
    setBusy(<span class="tok-keyword">true</span>);
    <span class="tok-keyword">try</span> {
      <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> <span class="tok-function">api</span>(<span class="tok-string">"/bookings"</span>, { method: <span class="tok-string">"POST"</span>, body: JSON.<span class="tok-function">stringify</span>({ classId }) });
      <span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> res.<span class="tok-function">json</span>();
      <span class="tok-keyword">if</span> (res.status === <span class="tok-number">201</span>) Alert.<span class="tok-function">alert</span>(<span class="tok-string">"Booked!"</span>, <span class="tok-string">"See you in class 💪"</span>);
      <span class="tok-keyword">else if</span> (res.status === <span class="tok-number">202</span>) Alert.<span class="tok-function">alert</span>(<span class="tok-string">"Class full"</span>, &#96;You're #\${data.position} on the waitlist.&#96;);
      onDone();                       <span class="tok-comment">// refetch class list</span>
    } <span class="tok-keyword">catch</span> (e) {
      Alert.<span class="tok-function">alert</span>(<span class="tok-string">"Could not book"</span>, e.message);
    } <span class="tok-keyword">finally</span> { setBusy(<span class="tok-keyword">false</span>); }
  }

  <span class="tok-keyword">return</span> &lt;Pressable disabled={busy} onPress={book}&gt;&lt;Text&gt;{busy ? <span class="tok-string">"…"</span> : <span class="tok-string">"Book"</span>}&lt;/Text&gt;&lt;/Pressable&gt;;
}</pre>

<div class="pitfall"><strong>Trap:</strong> keeping the JWT in <code>AsyncStorage</code>. AsyncStorage is unencrypted plain text on the device — any backup or rooted phone exposes it. Use <code>expo-secure-store</code>, which is backed by the iOS Keychain / Android Keystore.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>202 Accepted is the right code for "waitlisted".</b> The request succeeded but the booking isn't confirmed — it's pending a seat. <code>201 Created</code> would lie (nothing was booked); <code>409</code> would say "give up". <code>202 Accepted</code> precisely means "we took your request, it's in progress" — exactly the waitlist. Choosing the honest status code is what lets the app render the right screen. <em>Why beyond syllabus: the 202 semantic for async/pending outcomes is almost never taught, yet it models the waitlist perfectly.</em></div>

<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-765" target="_blank" rel="noopener">
  <span class="lc-ico">📱</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; secure storage on Code Lab</span><span class="lc-sub">Tokens, secure-store, fetch wrappers.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 5 · Bài 5.1</span>
<h2>Một app React Native đặt lớp và xử lý waitlist</h2>
<p class="lead">Client di động nói chuyện với cùng REST API. Hai mối quan tâm riêng của mobile: lưu JWT <em>an toàn</em> (không phải AsyncStorage thường) và phản hồi rõ ràng cho ba kết cục — đã đặt, vào waitlist, hoặc đầy.</p>

<h3>Lưu token trong keychain thiết bị</h3>
<pre><span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> SecureStore <span class="tok-keyword">from</span> <span class="tok-string">"expo-secure-store"</span>;

<span class="tok-comment">// sau đăng nhập — keychain mã hoá, do OS bảo vệ, KHÔNG phải AsyncStorage thường</span>
<span class="tok-keyword">await</span> SecureStore.<span class="tok-function">setItemAsync</span>(<span class="tok-string">"token"</span>, data.token);

<span class="tok-comment">// một wrapper fetch dùng chung gắn nó</span>
<span class="tok-keyword">async function</span> <span class="tok-function">api</span>(path, opts = {}) {
  <span class="tok-keyword">const</span> token = <span class="tok-keyword">await</span> SecureStore.<span class="tok-function">getItemAsync</span>(<span class="tok-string">"token"</span>);
  <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> <span class="tok-function">fetch</span>(API_URL + path, {
    ...opts,
    headers: { <span class="tok-string">"Content-Type"</span>: <span class="tok-string">"application/json"</span>, Authorization: &#96;Bearer \${token}&#96;, ...opts.headers },
  });
  <span class="tok-keyword">if</span> (res.status === <span class="tok-number">401</span>) { <span class="tok-keyword">await</span> <span class="tok-function">signOut</span>(); <span class="tok-keyword">throw new</span> <span class="tok-type">Error</span>(<span class="tok-string">"Phiên hết hạn"</span>); }
  <span class="tok-keyword">return</span> res;
}</pre>

<h3>Nút Đặt — ba kết cục</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">BookButton</span>({ classId, onDone }) {
  <span class="tok-keyword">const</span> [busy, setBusy] = <span class="tok-function">useState</span>(<span class="tok-keyword">false</span>);

  <span class="tok-keyword">async function</span> <span class="tok-function">book</span>() {
    setBusy(<span class="tok-keyword">true</span>);
    <span class="tok-keyword">try</span> {
      <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> <span class="tok-function">api</span>(<span class="tok-string">"/bookings"</span>, { method: <span class="tok-string">"POST"</span>, body: JSON.<span class="tok-function">stringify</span>({ classId }) });
      <span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> res.<span class="tok-function">json</span>();
      <span class="tok-keyword">if</span> (res.status === <span class="tok-number">201</span>) Alert.<span class="tok-function">alert</span>(<span class="tok-string">"Đã đặt!"</span>, <span class="tok-string">"Hẹn gặp ở lớp 💪"</span>);
      <span class="tok-keyword">else if</span> (res.status === <span class="tok-number">202</span>) Alert.<span class="tok-function">alert</span>(<span class="tok-string">"Lớp đầy"</span>, &#96;Bạn là #\${data.position} trong waitlist.&#96;);
      onDone();                       <span class="tok-comment">// tải lại danh sách lớp</span>
    } <span class="tok-keyword">catch</span> (e) {
      Alert.<span class="tok-function">alert</span>(<span class="tok-string">"Không đặt được"</span>, e.message);
    } <span class="tok-keyword">finally</span> { setBusy(<span class="tok-keyword">false</span>); }
  }

  <span class="tok-keyword">return</span> &lt;Pressable disabled={busy} onPress={book}&gt;&lt;Text&gt;{busy ? <span class="tok-string">"…"</span> : <span class="tok-string">"Đặt"</span>}&lt;/Text&gt;&lt;/Pressable&gt;;
}</pre>

<div class="pitfall"><strong>Bẫy:</strong> giữ JWT trong <code>AsyncStorage</code>. AsyncStorage là văn bản thường không mã hoá trên thiết bị — bất kỳ bản sao lưu hay điện thoại đã root nào cũng lộ nó. Dùng <code>expo-secure-store</code>, được bảo vệ bởi iOS Keychain / Android Keystore.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>202 Accepted là mã đúng cho "vào waitlist".</b> Request thành công nhưng booking chưa được xác nhận — nó đang chờ một chỗ. <code>201 Created</code> sẽ nói dối (chẳng đặt được gì); <code>409</code> sẽ bảo "bỏ cuộc". <code>202 Accepted</code> nghĩa chính xác "chúng tôi đã nhận yêu cầu, đang xử lý" — đúng là waitlist. Chọn mã trạng thái trung thực là điều cho phép app render đúng màn hình. <em>Vì sao ngoài syllabus: ngữ nghĩa 202 cho kết cục bất đồng bộ/đang chờ gần như không được dạy, nhưng nó mô hình hoá waitlist hoàn hảo.</em></div>

<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-765" target="_blank" rel="noopener">
  <span class="lc-ico">📱</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; lưu trữ an toàn trên Code Lab</span><span class="lc-sub">Token, secure-store, fetch wrapper.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
    {
      title: 'Section 6 — Deployment (API + mobile build)|||Mục 6 — Triển khai (API + build mobile)',
      lessons: [
        {
          title: '6.1 — Docker for the API, EAS build for the app|||6.1 — Docker cho API, EAS build cho app',
          slug: 'int607-docker',
          type: 'VIDEO',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 6 · Lesson 6.1</span>
<h2>Two deploy targets: the API to a server, the app to the stores</h2>
<p class="lead">A mobile project ships in two halves. The REST API + Postgres go into Docker on a server (as before). The React Native app is <em>built</em> with Expo EAS into an installable binary — it doesn't run on your server, it runs on phones.</p>

<div class="lz-flow">
  <div class="lz-step">Phone app (Expo EAS build)</div>
  <div class="lz-step">Express API :3000 (Docker)</div>
  <div class="lz-step">Postgres :5432 (Docker)</div>
</div>

<h3>The API side — docker-compose.yml</h3>
<pre><span class="tok-keyword">services</span>:
  db:
    <span class="tok-keyword">image</span>: postgres:16
    <span class="tok-keyword">environment</span>: { POSTGRES_DB: gym, POSTGRES_PASSWORD: \${DB_PASSWORD} }
    <span class="tok-keyword">volumes</span>: [ "pgdata:/var/lib/postgresql/data" ]
    <span class="tok-keyword">healthcheck</span>: { test: ["CMD-SHELL","pg_isready -U postgres"], interval: 5s, retries: 10 }
  api:
    <span class="tok-keyword">build</span>: .
    <span class="tok-keyword">environment</span>:
      DATABASE_URL: postgresql://postgres:\${DB_PASSWORD}@db:5432/gym
      JWT_SECRET: \${JWT_SECRET}
    <span class="tok-keyword">command</span>: sh -c "npx prisma migrate deploy &amp;&amp; node src/server.js"
    <span class="tok-keyword">depends_on</span>: { db: { condition: service_healthy } }
    <span class="tok-keyword">ports</span>: [ "3000:3000" ]
<span class="tok-keyword">volumes</span>: { pgdata: {} }</pre>

<h3>The app side — point it at the deployed API, then build</h3>
<pre><span class="tok-comment"># app.json / .env — the app must call the PUBLIC url, not localhost</span>
EXPO_PUBLIC_API_URL=https://api.yourgym.com

<span class="tok-comment"># build an installable binary with EAS (Expo Application Services)</span>
npx eas build --profile preview --platform android   <span class="tok-comment"># → an .apk to install &amp; demo</span></pre>

<div class="pitfall"><strong>Trap:</strong> leaving <code>API_URL</code> as <code>http://localhost:3000</code> in the built app. On a phone, <code>localhost</code> is the <em>phone itself</em>, not your dev machine — every request fails. The app must point at the API's real LAN IP (in dev) or its public URL (in the build).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>EXPO_PUBLIC_* is baked in at build time.</b> Just like Next's NEXT_PUBLIC_, any <code>EXPO_PUBLIC_</code> variable is compiled into the binary when you run the build — changing the API URL later means a new build, not a config edit. And never ship a secret this way: it's inside an app anyone can decompile. <em>Why beyond syllabus: the build-time env baking and its "no secrets in the client" corollary catch out real mobile deploys, and the syllabus never covers the app/server split.</em></div>

<a class="link-card codelab" href="/code-lab/expo?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-1612" target="_blank" rel="noopener">
  <span class="lc-ico">📲</span>
  <span class="lc-body"><span class="lc-title">Expo setup &amp; builds on Code Lab</span><span class="lc-sub">EAS build, env, installable binaries.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 6 · Bài 6.1</span>
<h2>Hai đích triển khai: API lên server, app lên store</h2>
<p class="lead">Một dự án mobile ship hai nửa. REST API + Postgres vào Docker trên server (như trước). App React Native được <em>build</em> bằng Expo EAS thành một binary cài được — nó không chạy trên server của bạn, nó chạy trên điện thoại.</p>

<div class="lz-flow">
  <div class="lz-step">App điện thoại (Expo EAS build)</div>
  <div class="lz-step">Express API :3000 (Docker)</div>
  <div class="lz-step">Postgres :5432 (Docker)</div>
</div>

<h3>Phía API — docker-compose.yml</h3>
<pre><span class="tok-keyword">services</span>:
  db:
    <span class="tok-keyword">image</span>: postgres:16
    <span class="tok-keyword">environment</span>: { POSTGRES_DB: gym, POSTGRES_PASSWORD: \${DB_PASSWORD} }
    <span class="tok-keyword">volumes</span>: [ "pgdata:/var/lib/postgresql/data" ]
    <span class="tok-keyword">healthcheck</span>: { test: ["CMD-SHELL","pg_isready -U postgres"], interval: 5s, retries: 10 }
  api:
    <span class="tok-keyword">build</span>: .
    <span class="tok-keyword">environment</span>:
      DATABASE_URL: postgresql://postgres:\${DB_PASSWORD}@db:5432/gym
      JWT_SECRET: \${JWT_SECRET}
    <span class="tok-keyword">command</span>: sh -c "npx prisma migrate deploy &amp;&amp; node src/server.js"
    <span class="tok-keyword">depends_on</span>: { db: { condition: service_healthy } }
    <span class="tok-keyword">ports</span>: [ "3000:3000" ]
<span class="tok-keyword">volumes</span>: { pgdata: {} }</pre>

<h3>Phía app — trỏ tới API đã deploy, rồi build</h3>
<pre><span class="tok-comment"># app.json / .env — app phải gọi url CÔNG KHAI, không phải localhost</span>
EXPO_PUBLIC_API_URL=https://api.yourgym.com

<span class="tok-comment"># build một binary cài được bằng EAS (Expo Application Services)</span>
npx eas build --profile preview --platform android   <span class="tok-comment"># → một .apk để cài &amp; demo</span></pre>

<div class="pitfall"><strong>Bẫy:</strong> để <code>API_URL</code> là <code>http://localhost:3000</code> trong app đã build. Trên điện thoại, <code>localhost</code> là <em>chính điện thoại</em>, không phải máy dev của bạn — mọi request fail. App phải trỏ tới IP LAN thật của API (lúc dev) hoặc URL công khai của nó (lúc build).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>EXPO_PUBLIC_* bị "nướng" vào lúc build.</b> Giống NEXT_PUBLIC_ của Next, bất kỳ biến <code>EXPO_PUBLIC_</code> nào được biên dịch vào binary khi bạn chạy build — đổi API URL về sau nghĩa là build mới, không phải sửa config. Và đừng bao giờ ship bí mật kiểu này: nó nằm trong một app ai cũng decompile được. <em>Vì sao ngoài syllabus: env nướng lúc-build và hệ quả "không bí mật trong client" làm hỏng deploy mobile thật, và giáo trình không nói về phân chia app/server.</em></div>

<a class="link-card codelab" href="/code-lab/expo?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-1612" target="_blank" rel="noopener">
  <span class="lc-ico">📲</span>
  <span class="lc-body"><span class="lc-title">Cài đặt &amp; build Expo trên Code Lab</span><span class="lc-sub">EAS build, env, binary cài được.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
    {
      title: 'Section 7 — Advanced: ship like a pro (Beyond the syllabus)|||Mục 7 — Nâng cao: làm như dân chuyên (Ngoài giáo trình)',
      lessons: [
        {
          title: '7.1 — Push, QR check-in, membership expiry & optimistic UI ★|||7.1 — Push, check-in QR, hết hạn thẻ & UI lạc quan ★',
          slug: 'int607-advanced',
          type: 'VIDEO',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 7 · Lesson 7.1 · <span class="badge">★ Beyond the syllabus</span></span>
<h2>Four upgrades that turn the app into a portfolio piece</h2>
<p class="lead">The booking core is correct. These four additions are what a reviewer of a mobile gym app notices — each a small, self-contained ★ beyond the syllabus.</p>

<h3>1) Push notifications — tell the waitlister they got in</h3>
<pre><span class="tok-comment">// backend: when auto-promoting from the waitlist, send an Expo push</span>
<span class="tok-keyword">await</span> <span class="tok-function">fetch</span>(<span class="tok-string">"https://exp.host/--/api/v2/push/send"</span>, {
  method: <span class="tok-string">"POST"</span>, headers: { <span class="tok-string">"Content-Type"</span>: <span class="tok-string">"application/json"</span> },
  body: JSON.<span class="tok-function">stringify</span>({ to: member.expoPushToken, title: <span class="tok-string">"You're in!"</span>, body: <span class="tok-string">"A seat opened in Yoga 6pm"</span> }),
});</pre>
<p>The seat that opened is worthless if the member never learns about it — a push closes the loop from Section 4's waitlist.</p>

<h3>2) QR check-in — prove attendance at the door</h3>
<pre><span class="tok-comment">// the app shows a QR encoding a short-lived signed token</span>
<span class="tok-keyword">const</span> qr = jwt.<span class="tok-function">sign</span>({ bookingId, exp: nowSec + <span class="tok-number">90</span> }, CHECKIN_SECRET);   <span class="tok-comment">// valid 90s</span>
<span class="tok-comment">// the front-desk scanner POSTs it → backend verifies + marks ATTENDED (once)</span></pre>
<p>The 90-second expiry stops a member screenshotting a QR and sharing it — the token is stale seconds later.</p>

<h3>3) Membership expiry — a nightly job</h3>
<pre><span class="tok-comment">// cron: every night, expire memberships whose end date has passed</span>
<span class="tok-keyword">await</span> prisma.$executeRaw&#96;
  UPDATE "Membership" SET status = 'EXPIRED'
  WHERE status = 'ACTIVE' AND ends_at &lt; now()&#96;;
<span class="tok-comment">// booking then checks membership.status = 'ACTIVE' before allowing a class</span></pre>

<h3>4) Optimistic UI — instant feedback, then reconcile</h3>
<pre><span class="tok-comment">// flip the button to "Booked" immediately, roll back if the server disagrees</span>
setLocal(<span class="tok-string">"BOOKED"</span>);                       <span class="tok-comment">// optimistic</span>
<span class="tok-keyword">try</span> { <span class="tok-keyword">await</span> <span class="tok-function">api</span>(<span class="tok-string">"/bookings"</span>, {...}); }
<span class="tok-keyword">catch</span> { setLocal(<span class="tok-string">"AVAILABLE"</span>); Alert.<span class="tok-function">alert</span>(<span class="tok-string">"Class filled up"</span>); }   <span class="tok-comment">// reconcile on failure</span></pre>

<div class="pitfall"><strong>Trap:</strong> trusting the client's <code>expoPushToken</code> forever. Push tokens rotate (reinstall, OS update) and go stale; sending to a dead token silently fails. Refresh and re-store the token on every app launch, and drop tokens Expo reports as invalid.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Short-lived signed tokens beat static QR codes.</b> A QR that never expires can be screenshotted and reused; one that carries a 90-second signed expiry is single-use in practice. The same idea — a signature plus a tight expiry — secures check-ins, magic links, and one-time actions everywhere. <em>Why beyond syllabus: designing an expiring, signed capability for a physical-world action is a security pattern the coursework never poses.</em></div>

<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-459" target="_blank" rel="noopener">
  <span class="lc-ico">📱</span>
  <span class="lc-body"><span class="lc-title">Native features on Code Lab</span><span class="lc-sub">Push, camera/QR, device APIs.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 7 · Bài 7.1 · <span class="badge">★ Ngoài giáo trình</span></span>
<h2>Bốn nâng cấp biến app thành tác phẩm hồ sơ</h2>
<p class="lead">Lõi đặt lớp đã đúng. Bốn bổ sung này là thứ người chấm một app gym di động để ý — mỗi cái một ★ nhỏ, độc lập, vượt giáo trình.</p>

<h3>1) Push notification — báo waitlister họ có chỗ</h3>
<pre><span class="tok-comment">// backend: khi tự đôn từ waitlist, gửi một push Expo</span>
<span class="tok-keyword">await</span> <span class="tok-function">fetch</span>(<span class="tok-string">"https://exp.host/--/api/v2/push/send"</span>, {
  method: <span class="tok-string">"POST"</span>, headers: { <span class="tok-string">"Content-Type"</span>: <span class="tok-string">"application/json"</span> },
  body: JSON.<span class="tok-function">stringify</span>({ to: member.expoPushToken, title: <span class="tok-string">"Bạn có chỗ rồi!"</span>, body: <span class="tok-string">"Ghế trống ở Yoga 18h"</span> }),
});</pre>
<p>Chỗ vừa trống vô nghĩa nếu hội viên không bao giờ biết — một push đóng vòng lặp từ waitlist ở Mục 4.</p>

<h3>2) Check-in QR — chứng minh có mặt ở cửa</h3>
<pre><span class="tok-comment">// app hiện một QR mã hoá một token đã ký đời ngắn</span>
<span class="tok-keyword">const</span> qr = jwt.<span class="tok-function">sign</span>({ bookingId, exp: nowSec + <span class="tok-number">90</span> }, CHECKIN_SECRET);   <span class="tok-comment">// hợp lệ 90s</span>
<span class="tok-comment">// máy quét ở quầy POST nó → backend xác minh + đánh dấu ATTENDED (một lần)</span></pre>
<p>Hạn 90 giây chặn hội viên chụp màn hình một QR rồi chia sẻ — token đã cũ vài giây sau.</p>

<h3>3) Hết hạn thẻ — một job hằng đêm</h3>
<pre><span class="tok-comment">// cron: mỗi đêm, cho hết hạn các thẻ đã qua ngày kết thúc</span>
<span class="tok-keyword">await</span> prisma.$executeRaw&#96;
  UPDATE "Membership" SET status = 'EXPIRED'
  WHERE status = 'ACTIVE' AND ends_at &lt; now()&#96;;
<span class="tok-comment">// đặt lớp sau đó kiểm membership.status = 'ACTIVE' trước khi cho vào lớp</span></pre>

<h3>4) UI lạc quan — phản hồi tức thì, rồi đối soát</h3>
<pre><span class="tok-comment">// lật nút thành "Đã đặt" ngay, rollback nếu server không đồng ý</span>
setLocal(<span class="tok-string">"BOOKED"</span>);                       <span class="tok-comment">// lạc quan</span>
<span class="tok-keyword">try</span> { <span class="tok-keyword">await</span> <span class="tok-function">api</span>(<span class="tok-string">"/bookings"</span>, {...}); }
<span class="tok-keyword">catch</span> { setLocal(<span class="tok-string">"AVAILABLE"</span>); Alert.<span class="tok-function">alert</span>(<span class="tok-string">"Lớp vừa đầy"</span>); }   <span class="tok-comment">// đối soát khi lỗi</span></pre>

<div class="pitfall"><strong>Bẫy:</strong> tin <code>expoPushToken</code> của client mãi mãi. Token push xoay vòng (cài lại, cập nhật OS) và cũ đi; gửi tới token chết âm thầm fail. Làm mới và lưu lại token ở mỗi lần mở app, và bỏ token Expo báo không hợp lệ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Token ký đời ngắn hơn QR tĩnh.</b> Một QR không bao giờ hết hạn có thể bị chụp và tái dùng; một cái mang hạn ký 90 giây thực tế là dùng-một-lần. Cùng ý tưởng — một chữ ký cộng một hạn ngắn — bảo vệ check-in, magic link, và hành động một-lần khắp nơi. <em>Vì sao ngoài syllabus: thiết kế một "capability" ký có hạn cho một hành động thế giới thực là mẫu bảo mật môn học không đặt ra.</em></div>

<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fgym-membership-app%2Flearn&reflabel=INT607#module-459" target="_blank" rel="noopener">
  <span class="lc-ico">📱</span>
  <span class="lc-body"><span class="lc-title">Tính năng native trên Code Lab</span><span class="lc-sub">Push, camera/QR, device API.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — Final quiz: architecture & trade-offs|||7.2 — Quiz cuối: kiến trúc & đánh đổi',
          slug: 'int607-quiz-7',
          type: 'QUIZ',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1',
                question: 'Why store the JWT with expo-secure-store instead of AsyncStorage?|||Vì sao lưu JWT bằng expo-secure-store thay vì AsyncStorage?',
                options: [
                  'AsyncStorage is unencrypted plain text; secure-store uses the OS keychain/keystore|||AsyncStorage là văn bản thường không mã hoá; secure-store dùng keychain/keystore của OS',
                  'AsyncStorage cannot store strings|||AsyncStorage không lưu được chuỗi',
                  'secure-store is faster|||secure-store nhanh hơn',
                  'There is no difference|||Không có khác biệt',
                ],
                correctIndex: 0,
                points: 1,
              },
              {
                id: 'q2',
                question: 'Which HTTP status best represents "added to the waitlist"?|||Mã HTTP nào biểu diễn tốt nhất "đã thêm vào waitlist"?',
                options: ['201 Created', '202 Accepted', '409 Conflict', '500 Internal Server Error'],
                correctIndex: 1,
                points: 1,
              },
              {
                id: 'q3',
                question: 'On the built mobile app, why does API_URL = http://localhost:3000 fail?|||Trên app mobile đã build, vì sao API_URL = http://localhost:3000 thất bại?',
                options: [
                  'On a phone localhost means the phone itself, not your dev server; use the LAN IP or public URL|||Trên điện thoại localhost nghĩa là chính điện thoại, không phải server dev; dùng IP LAN hoặc URL công khai',
                  'localhost is a reserved word|||localhost là từ khoá',
                  'Port 3000 is blocked on all phones|||Cổng 3000 bị chặn trên mọi điện thoại',
                  'It actually works|||Thực ra nó chạy',
                ],
                correctIndex: 0,
                points: 1,
              },
              {
                id: 'q4',
                question: 'Why give the check-in QR token a 90-second expiry?|||Vì sao cho token QR check-in hạn 90 giây?',
                options: [
                  'A short expiry makes a screenshotted/shared QR useless seconds later — effectively single-use|||Hạn ngắn khiến một QR bị chụp/chia sẻ vô dụng vài giây sau — thực tế dùng một lần',
                  'To save battery|||Để tiết kiệm pin',
                  'Because JWTs must be under 90 seconds|||Vì JWT phải dưới 90 giây',
                  'It makes the QR smaller|||Nó làm QR nhỏ hơn',
                ],
                correctIndex: 0,
                points: 1,
              },
              {
                id: 'q5',
                question: 'Why must cancel + waitlist-promote run in one transaction?|||Vì sao huỷ + đôn-waitlist phải chạy trong một transaction?',
                options: [
                  'A crash between two separate writes could lose the freed seat or duplicate it|||Crash giữa hai lần ghi riêng có thể mất chỗ vừa trống hoặc nhân đôi nó',
                  'Transactions are required by Expo|||Expo bắt buộc transaction',
                  'It makes the push faster|||Nó làm push nhanh hơn',
                  'It saves database space|||Nó tiết kiệm dung lượng',
                ],
                correctIndex: 0,
                points: 1,
              },
              {
                id: 'q6',
                question: 'Which mechanism most directly guarantees a 20-seat class never books 21 members?|||Cơ chế nào trực tiếp bảo đảm lớp 20 chỗ không bao giờ đặt 21 người?',
                options: [
                  'The atomic UPDATE ... SET seats_left = seats_left - 1 WHERE seats_left > 0|||UPDATE ... SET seats_left = seats_left - 1 WHERE seats_left > 0 nguyên tử',
                  'A foreign key on memberId|||Khoá ngoại trên memberId',
                  'Counting bookings in JavaScript|||Đếm booking trong JavaScript',
                  'The expo-secure-store keychain|||Keychain expo-secure-store',
                ],
                correctIndex: 0,
                points: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
